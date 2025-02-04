import { createServer } from 'http';
import { Server } from 'socket.io';
import { createPrivateLobby } from './lobby/createPrivateLobby.js';
import { disconnect } from './standard/disconnect.js';
import { joinLobby } from './lobby/joinLobby.js';
import { joinPrivateLobby } from './lobby/joinPrivateLobby.js';
import { userSubmittedWord } from './game/userSubmittedWord.js';
import { userIsReady } from './game/userIsReady.js';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin:
      process.env.NODE_ENV === 'production'
        ? [
            'https://www.wordlewithfriends.co',
            'https://wordle-with-friends-eight.vercel.app',
          ]
        : 'http://localhost:3000',
  },
});

export const lobbies = [];

io.on('connection', (socket) => {
  io.to(socket.id).emit('userCount', {
    count: io.engine.clientsCount,
  });
  socket.broadcast.emit('userCount', {
    count: io.engine.clientsCount,
  });

  createPrivateLobby(io, socket);
  joinPrivateLobby(io, socket);
  joinLobby(io, socket);
  userSubmittedWord(io, socket);
  userIsReady(io, socket);
  disconnect(io, socket);
});

const port = process.env.PORT || 8080;
httpServer.listen(port, () => {
  console.log(`listening on *:${port}`);
});
