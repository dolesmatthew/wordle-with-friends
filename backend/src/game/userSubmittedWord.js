import { lobbies } from '../index.js';

export const userSubmittedWord = (io, socket) => {
  socket.on('userSubmittedWord', ({ lobbyId, user }, callback) => {
    // Find lobby
    const lobbyIndex = lobbies.findIndex((lobby) => lobby.lobbyId === lobbyId);
    if (lobbyIndex == -1) {
      return callback({ error: 'Cannot find lobby' });
    }

    let lobbyDone = true;
    lobbies[lobbyIndex].users.forEach((u) => {
      // Update correct user w/ submitted word
      if (u.id === user.id) {
        u.currentWord = user.currentWord;
        u.index = user.index;
        u.isCorrect = user.isCorrect;
        u.isDone = user.isDone;
        u.lettersUsed = user.lettersUsed;
        u.words = user.words;
        u.points = user.points;
        u.newPoints = user.newPoints;
      }
      // Check all users in lobby done guessing
      if (!u.isCorrect && !u.isDone) {
        lobbyDone = false;
      }
    });

    // Send updated user state back to lobby
    io.to(lobbyId).emit('updateLobbyUsers', {
      users: lobbies[lobbyIndex].users,
    });

    // If all users done guessing, send indicator to lobby
    if (lobbyDone) {
      lobbies[lobbyIndex].lobbyDoneGuessing = true;
      io.to(lobbyId).emit('lobbyDoneGuessing', {
        lobbyDoneGuessing: lobbyDone,
      });
    }
  });
};
