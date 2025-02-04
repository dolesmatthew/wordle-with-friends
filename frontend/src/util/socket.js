import { io } from 'socket.io-client';
import { browser } from '$app/env';
import multiplayerGame from '../store/multiplayerGame';
import { userCount } from '../store/userCount';

let socket = io(import.meta.env.VITE_SOCKET_URL, { 'connect timeout': 5000 });

const initSocket = async () => {};

if (browser) {
	initSocket();
}

socket.on('updateLobby', ({ lobby }) => {
	multiplayerGame.setLobby(lobby);
});

socket.on('updateUser', ({ user }) => {
	multiplayerGame.setUser(user);
});

socket.on('updateLobbyUsers', ({ users }) => {
	multiplayerGame.updateLobbyUsers(users);
});

socket.on('lobbyDoneGuessing', ({ lobbyDoneGuessing }) => {
	multiplayerGame.updateLobbyDoneGuessing(lobbyDoneGuessing);
});

socket.on('userLeft', () => {
	multiplayerGame.opponentLeftLobby();
});

socket.on('userCount', ({ count }) => {
	userCount.set(count);
});

export default socket;
