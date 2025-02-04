import { getRandomWord, populateEmptyWordArrays } from '../util';
import { get, writable } from 'svelte/store';
import { guesses } from '../const/guesses';

const game = writable({
	words: [
		{ word: populateEmptyWordArrays(5), validCheckFailed: false, wordSubmitted: false },
		{ word: populateEmptyWordArrays(5), validCheckFailed: false, wordSubmitted: false },
		{ word: populateEmptyWordArrays(5), validCheckFailed: false, wordSubmitted: false },
		{ word: populateEmptyWordArrays(5), validCheckFailed: false, wordSubmitted: false },
		{ word: populateEmptyWordArrays(5), validCheckFailed: false, wordSubmitted: false },
		{ word: populateEmptyWordArrays(5), validCheckFailed: false, wordSubmitted: false }
	],
	answer: getRandomWord(false),
	currentWord: 0,
	index: 0,
	isCorrect: false,
	isDone: false,
	lettersUsed: []
});

const customGame = {
	subscribe: game.subscribe,
	addLetter: (newLetter) => {
		game.update((items) => {
			const updatedWords = [...items.words];
			updatedWords[items.currentWord].word[items.index].char = newLetter;
			return {
				...items,
				index: ++items.index,
				words: updatedWords
			};
		});
	},
	removeLetter: () => {
		game.update((items) => {
			const updatedWords = [...items.words];
			updatedWords[items.currentWord].word[items.index - 1].char = '';
			updatedWords[items.currentWord].validCheckFailed = false;
			return {
				...items,
				index: --items.index,
				words: updatedWords
			};
		});
	},
	submitWord: () => {
		const gameState = get(game);

		// Check full current word valid
		const fullWord = [];
		gameState.words[gameState.currentWord].word.forEach((c) => fullWord.push(c.char));
		const isValid = guesses.includes(fullWord.join('').toLowerCase());

		game.update((items) => {
			const updatedWords = [...items.words];
			const updatedLettersUsed = [...items.lettersUsed];

			// If not valid, return w/ indicator
			updatedWords[items.currentWord].validCheckFailed = !isValid;
			if (!isValid) {
				return {
					...items,
					words: updatedWords
				};
			}

			// If valid, check correctness of each index
			updatedWords[items.currentWord].word.forEach((c, i) => {
				if (gameState.answer.includes(c.char)) {
					c.isInWord = true;
					if (gameState.answer[i] === updatedWords[items.currentWord].word[i].char) {
						c.isCorrect = true;
					}
				} else {
					c.isNotInWord = true;
				}
			});

			// Update used letters w/ correctness for keyboard view
			updatedWords[items.currentWord].word.forEach((c, i) => {
				if (gameState.answer.filter((char) => char === c.char).length === 1) {
					updatedWords[items.currentWord].word.forEach((l, j) => {
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

			// Mark word submitted, update state
			updatedWords[items.currentWord].wordSubmitted = true;
			return {
				...items,
				currentWord: items.currentWord + 1,
				index: 0,
				isCorrect: updatedWords[items.currentWord].word.every((c) => c.isCorrect === true),
				isDone: items.currentWord === 5 ? true : false,
				lettersUsed: updatedLettersUsed,
				words: updatedWords
			};
		});
	},
	resetGame: (difficulty) => {
		game.update(() => {
			return {
				words: [
					{ word: populateEmptyWordArrays(5), validCheckFailed: false, wordSubmitted: false },
					{ word: populateEmptyWordArrays(5), validCheckFailed: false, wordSubmitted: false },
					{ word: populateEmptyWordArrays(5), validCheckFailed: false, wordSubmitted: false },
					{ word: populateEmptyWordArrays(5), validCheckFailed: false, wordSubmitted: false },
					{ word: populateEmptyWordArrays(5), validCheckFailed: false, wordSubmitted: false },
					{ word: populateEmptyWordArrays(5), validCheckFailed: false, wordSubmitted: false }
				],
				answer: getRandomWord(difficulty === 'Hard' ? true : false),
				currentWord: 0,
				index: 0,
				isCorrect: false,
				isDone: false,
				lettersUsed: []
			};
		});
	}
};

export default customGame;
