import { createLobby, populateUserGameState } from '../util/index.js';

export const createPrivateLobby = (io, socket) => {
  socket.on(
    'createPrivateLobby',
    ({ profileImage, username, gameMode, difficulty }, callback) => {
      if (!username) {
        return callback('Username required!');
      }

      // Construct user
      const user = { id: socket.id, profileImage, username };

      // Create private lobby
      const lobby = createLobby(true, gameMode, difficulty);

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
  );
};
