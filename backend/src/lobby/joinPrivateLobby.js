import { lobbies } from '../index.js';
import { populateUserGameState } from '../util/index.js';

export const joinPrivateLobby = (io, socket) => {
  socket.on(
    'joinPrivateLobby',
    ({ lobbyId, profileImage, username }, callback) => {
      // Find lobby
      let lobbyIndex = lobbies.findIndex((l) => l.lobbyId === lobbyId);
      if (lobbyIndex === -1) {
        return callback({ error: 'Cannot connect to lobby.' });
      }

      if (
        (lobbies[lobbyIndex].users.length === 2 &&
          lobbies[lobbyIndex].gameMode === 'Duel') ||
        (lobbies[lobbyIndex].users.length === 20 &&
          lobbies[lobbyIndex].gameMode === 'Large')
      ) {
        return callback({ error: 'Sorry, lobby is full!' });
      }

      // Construct user
      const user = { id: socket.id, profileImage, username };

      // Add user to lobby w/ initial game state
      lobbies[lobbyIndex].users.push({
        ...user,
        ...populateUserGameState(),
        points: 0,
        newPoints: 0,
      });

      // Join lobby
      socket.join(lobbies[lobbyIndex].lobbyId);

      // Send updated lobby info
      io.to(lobbies[lobbyIndex].lobbyId).emit('updateLobby', {
        lobby: lobbies[lobbyIndex],
      });

      // Send initial user state to user
      io.to(socket.id).emit('updateUser', {
        user: {
          ...user,
          ...populateUserGameState(),
          points: 0,
          newPoints: 0,
        },
      });
    }
  );
};
