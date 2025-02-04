import answers from '../consts/answers.js';
import guesses from '../consts/answers.js';
import { lobbies } from '../index.js';

export const getRandomWord = (allWords) => {
  if (allWords) {
    return guesses[Math.floor(Math.random() * guesses.length)]
      .toUpperCase()
      .split('');
  }

  return answers[Math.floor(Math.random() * answers.length)]
    .toUpperCase()
    .split('');
};

export const createLobby = (isPrivate, gameMode, difficulty) => {
  const lobbyId = generateLobbyNumber(6);
  const lobbyIndex = lobbies.findIndex((lobby) => lobby.lobbyId === lobbyId);
  if (lobbyIndex != -1) {
    createLobby(isPrivate);
  }

  const lobby = {
    answer: getRandomWord(difficulty === 'Hard' ? true : false),
    lobbyId: lobbyId,
    round: 1,
    users: [],
    lobbyDoneGuessing: false,
    isPrivate,
    gameMode,
    difficulty,
  };
  lobbies.push(lobby);
  return lobby;
};

export const generateLobbyNumber = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

export const populateUserGameState = () => {
  return {
    words: [
      {
        word: populateEmptyWordArrays(5),
        validCheckFailed: false,
        wordSubmitted: false,
      },
      {
        word: populateEmptyWordArrays(5),
        validCheckFailed: false,
        wordSubmitted: false,
      },
      {
        word: populateEmptyWordArrays(5),
        validCheckFailed: false,
        wordSubmitted: false,
      },
      {
        word: populateEmptyWordArrays(5),
        validCheckFailed: false,
        wordSubmitted: false,
      },
      {
        word: populateEmptyWordArrays(5),
        validCheckFailed: false,
        wordSubmitted: false,
      },
      {
        word: populateEmptyWordArrays(5),
        validCheckFailed: false,
        wordSubmitted: false,
      },
    ],
    currentWord: 0,
    index: 0,
    isCorrect: false,
    isDone: false,
    isReady: false,
    lettersUsed: [],
  };
};

export const populateEmptyWordArrays = (number) => {
  const array = [];
  let i = 0;
  while (i < number) {
    array.push({
      char: '',
      isCorrect: false,
      isInWord: false,
      isNotInWord: false,
    });
    i++;
  }
  return array;
};
