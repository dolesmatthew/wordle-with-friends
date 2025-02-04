import { guesses } from '../const/guesses';
import { get, writable } from 'svelte/store';
import socket from '../util/socket';

const multiplayerGame = writable({
	lobby: { users: [] },
	user: {},
	inGame: false
});

const customMultiplayerGame = {
	subscribe: multiplayerGame.subscribe,
	addLetter: (newLetter) => {
		multiplayerGame.update((items) => {
			const updatedWords = [...items.user.words];
			updatedWords[items.user.currentWord].word[items.user.index].char = newLetter;
			return {
				...items,
				user: {
					...items.user,
					index: ++items.user.index,
					words: updatedWords
				}
			};
		});
	},
	removeLetter: () => {
		multiplayerGame.update((items) => {
			const updatedWords = [...items.user.words];
			updatedWords[items.user.currentWord].word[items.user.index - 1].char = '';
			updatedWords[items.user.currentWord].validCheckFailed = false;
			return {
				...items,
				user: {
					...items.user,
					index: --items.user.index,
					words: updatedWords
				}
			};
		});
	},
	submitWord: () => {
		const multiplayerGameState = get(multiplayerGame);

		// Check full current word valid
		const fullWord = [];
		multiplayerGameState.user.words[multiplayerGameState.user.currentWord].word.forEach((c) =>
			fullWord.push(c.char)
		);
		const isValid = guesses.includes(fullWord.join('').toLowerCase());

		multiplayerGame.update((items) => {
			const updatedWords = [...items.user.words];
			const updatedLettersUsed = [...items.user.lettersUsed];

			// If not valid, return w/ indicator
			updatedWords[items.user.currentWord].validCheckFailed = !isValid;
			if (!isValid) {
				return {
					...items,
					user: {
						...items.user,
						words: updatedWords
					}
				};
			}

			// If valid, check correctness of each index
			updatedWords[items.user.currentWord].word.forEach((c, i) => {
				if (multiplayerGameState.lobby.answer.includes(c.char)) {
					c.isInWord = true;
					if (
						multiplayerGameState.lobby.answer[i] ===
						updatedWords[items.user.currentWord].word[i].char
					) {
						c.isCorrect = true;
					}
				} else {
					c.isNotInWord = true;
				}
			});

			// Update used letters w/ correctness for keyboard view
			updatedWords[items.user.currentWord].word.forEach((c, i) => {
				if (multiplayerGameState.lobby.answer.filter((char) => char === c.char).length === 1) {
					updatedWords[items.user.currentWord].word.forEach((l, j) => {
						if (c.char === l.char && i !== j) {
							if (c.isCorrect) {
								l.isInWord = false;
								l.isNotInWord = true;
							}
							if (l.isCorrect) {
								c.isInWord = false;
								c.isNotInWord = true;
							}
							if (c.isInWord && !c.isCorrect && l.isInWord && !l.isCorrect) {
								if (i > j && i !== j) {
									c.isInWord = false;
									c.isNotInWord = true;
								}
								if (j > i && i !== j) {
									l.isInWord = false;
									l.isNotInWord = true;
								}
							}
						}
					});
				}

				// Update used letters w/ correctness for keyboard view
				const useLetterIndex = updatedLettersUsed.indexOf(c);
				if (useLetterIndex === -1) {
					updatedLettersUsed.push(c);
				} else {
					updatedLettersUsed[useLetterIndex] = c;
				}
			});

			const isCorrect = updatedWords[items.user.currentWord].word.every(
				(c) => c.isCorrect === true
			);
			let points = 0;
			if (isCorrect) {
				points += 100;
				points += 150 - (1 + items.user.currentWord) * 25;
			}

			// Mark word submitted, share with socket, update state
			updatedWords[items.user.currentWord].wordSubmitted = true;
			const updatedUser = {
				...items.user,
				currentWord: items.user.currentWord + 1,
				index: 0,
				isCorrect,
				isDone: items.user.currentWord === 5 ? true : false,
				lettersUsed: updatedLettersUsed,
				words: updatedWords,
				points: items.user.points + points,
				newPoints: points
			};

			socket.emit(
				'userSubmittedWord',
				{ lobbyId: items.lobby.lobbyId, user: updatedUser },
				({ error }) => {
					if (error) {
						return console.log(error);
					}
				}
			);

			return {
				...items,
				user: updatedUser
			};
		});
	},
	joinLobby: (username, profileImage, gameMode, difficulty) => {
		socket.emit('joinLobby', { username, profileImage, gameMode, difficulty }, ({ error }) => {
			if (error) {
				return console.log(error);
			}
			multiplayerGame.update((items) => {
				return {
					...items,
					inGame: true
				};
			});
		});
	},
	createPrivateLobby: (username, profileImage, gameMode, difficulty) => {
		socket.emit(
			'createPrivateLobby',
			{ username, profileImage, gameMode, difficulty },
			({ error }) => {
				if (error) {
					return console.log(error);
				}
				multiplayerGame.update((items) => {
					return {
						...items,
						inGame: true
					};
				});
			}
		);
	},
	setLobby: (lobby) => {
		multiplayerGame.update((items) => {
			return {
				...items,
				lobby,
				inGame: true
			};
		});
	},
	setUser: (user) => {
		multiplayerGame.update((items) => {
			return {
				...items,
				user
			};
		});
	},
	updateLobbyUsers: (users) => {
		multiplayerGame.update((items) => {
			return {
				...items,
				lobby: {
					...items.lobby,
					users
				}
			};
		});
	},
	updateLobbyDoneGuessing: (lobbyDoneGuessing) => {
		multiplayerGame.update((items) => {
			return {
				...items,
				lobby: {
					...items.lobby,
					lobbyDoneGuessing
				}
			};
		});
	},
	setUserAsReady: () => {
		multiplayerGame.update((items) => {
			socket.emit('userIsReady', { lobbyId: items.lobby.lobbyId, isReady: true }, ({ error }) => {
				if (error) {
					return console.log(error);
				}
			});
			return {
				...items,
				user: {
					...items.user,
					isReady: true
				}
			};
		});
	},
	opponentLeftLobby: () => {
		multiplayerGame.update(() => {
			return {
				lobby: { users: [] },
				user: {},
				inGame: false
			};
		});
	}
};

export default customMultiplayerGame;
