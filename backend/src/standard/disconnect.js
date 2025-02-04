import { lobbies } from '../index.js';
import { getRandomWord, populateUserGameState } from '../util/index.js';

export const disconnect = (io, socket) => {
  socket.on('disconnect', () => {
    // Update active user count
    socket.broadcast.emit('userCount', {
      count: io.engine.clientsCount,
    });

    // Remove user if actively in game
    lobbies.forEach((lobby, i) => {
      const userIndex = lobby.users.findIndex((u) => u.id === socket.id);
      if (userIndex !== -1) {
        lobbies[i].users.splice(userIndex, 1);

        // Inform lobby user has left if duel lobby
        if (lobbies[i].users.length > 0 && lobbies[i].gameMode === 'Duel') {
          io.to(lobbies[i].users[0].id).emit('userLeft');
        }

        // If large lobby
        if (lobbies[i].gameMode === 'Large') {
          // And lobby done guessing
          if (lobbies[i].lobbyDoneGuessing) {
            let lobbyReady = true;
            lobbies[i].users.forEach((u) => {
              if (!u.isReady) {
                lobbyReady = false;
              }
            });

            // Still send updated users if lobby not ready
            if (!lobbyReady) {
              io.to(lobbies[i].lobbyId).emit('updateLobbyUsers', {
                users: lobbies[i].users,
              });
            }

            // Round reset if all users ready
            if (lobbyReady) {
              lobbies[i].answer = getRandomWord(
                lobbies[i].difficulty === 'Hard' ? true : false
              );
              lobbies[i].lobbyDoneGuessing = false;
              lobbies[i].round = ++lobbies[i].round;
              lobbies[i].users.forEach((u, j) => {
                const user = {
                  ...u,
                  ...populateUserGameState(),
                };
                lobbies[i].users[j] = user;
                io.to(user.id).emit('updateUser', {
                  user,
                });
              });
              io.to(lobbies[i].lobbyId).emit('updateLobby', {
                lobby: lobbies[i],
              });
            }
          }
          // If lobby still guessing, check all users are done
          else {
            let lobbyDone = true;
            lobbies[i].users.forEach((u) => {
              if (!u.isCorrect && !u.isDone) {
                lobbyDone = false;
              }
            });
            io.to(lobbies[i].lobbyId).emit('updateLobbyUsers', {
              users: lobbies[i].users,
            });
            if (lobbyDone) {
              io.to(lobbies[i].lobbyId).emit('lobbyDoneGuessing', {
                lobbyDoneGuessing: lobbyDone,
              });
            }
          }
        }

        // Remove lobby if no users present or only 1 user in Duel lobby
        if (
          lobbies[i].users.length === 0 ||
          (lobbies[i].users.length === 1 && lobbies[i].gameMode === 'Duel')
        ) {
          lobbies.splice(i, 1);
        }
      }
    });
  });
};
