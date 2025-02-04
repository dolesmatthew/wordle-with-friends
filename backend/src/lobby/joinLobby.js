import { lobbies } from '../index.js';
import { createLobby, populateUserGameState } from '../util/index.js';

export const joinLobby = (io, socket) => {
  socket.on(
    'joinLobby',
    ({ profileImage, username, gameMode, difficulty }, callback) => {
      let lobbyIndex = -1;
      // Check if lobby exists w/ given parameters
      if (gameMode === 'Duel') {
        lobbyIndex = lobbies.findIndex(
          (l) =>
            l.users.length === 1 && !l.isPrivate && l.difficulty === difficulty
        );
      }
      if (gameMode === 'Large') {
        lobbyIndex = lobbies.findIndex(
          (l) =>
            l.users.length <= 20 && !l.isPrivate && l.difficulty === difficulty
        );
      }

      // Construct user
      const user = { id: socket.id, profileImage, username };

      // If no lobby exists
      if (lobbyIndex === -1) {
        // Create non-private lobby
        const lobby = createLobby(false, gameMode, difficulty);

        // Add user to lobby w/ initial game state
        lobby.users.push({
          ...user,
          ...populateUserGameState(),
          points: 0,
          newPoints: 0,
        });

        // Join lobby
        socket.join(lobby.lobbyId);

        // Send lobby info to lobby
        io.to(lobby.lobbyId).emit('updateLobby', {
          lobby,
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
      // If lobby does exist
      else {
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
    }
  );
};
