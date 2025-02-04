import { lobbies } from '../index.js';
import { getRandomWord, populateUserGameState } from '../util/index.js';

export const userIsReady = (io, socket) => {
  socket.on('userIsReady', ({ lobbyId, isReady }, callback) => {
    // Find lobby
    const lobbyIndex = lobbies.findIndex((lobby) => lobby.lobbyId === lobbyId);
    if (lobbyIndex == -1) {
      return callback({ error: 'Cannot find lobby.' });
    }

    // Mark user ready, check all players are ready
    let lobbyReady = true;
    lobbies[lobbyIndex].users.forEach((u) => {
      if (u.id === socket.id) {
        u.isReady = isReady;
      }
      if (!u.isReady) {
        lobbyReady = false;
      }
    });

    // Still send updated users if lobby not ready
    if (!lobbyReady) {
      io.to(lobbyId).emit('updateLobbyUsers', {
        users: lobbies[lobbyIndex].users,
      });
    }

    // Round reset if all users ready
    if (lobbyReady) {
      lobbies[lobbyIndex].answer = getRandomWord(
        lobbies[lobbyIndex].difficulty === 'Hard' ? true : false
      );
      lobbies[lobbyIndex].lobbyDoneGuessing = false;
      lobbies[lobbyIndex].round = ++lobbies[lobbyIndex].round;
      lobbies[lobbyIndex].users.forEach((u, i) => {
        const user = {
          ...u,
          ...populateUserGameState(),
        };
        lobbies[lobbyIndex].users[i] = user;
        io.to(user.id).emit('updateUser', {
          user,
        });
      });
      io.to(lobbies[lobbyIndex].lobbyId).emit('updateLobby', {
        lobby: lobbies[lobbyIndex],
      });
    }
  });
};
