import { answers } from '../const/answers';
import { guesses } from '../const/guesses';

export const populateEmptyWordArrays = (number) => {
	const array = [];
	let i = 0;
	while (i < number) {
		array.push({ char: '', isCorrect: false, isInWord: false, isNotInWord: false });
		i++;
	}
	return array;
};

export const getRandomWord = (allWords) => {
	if (allWords) {
		return guesses[Math.floor(Math.random() * guesses.length)].toUpperCase().split('');
	}

	return answers[Math.floor(Math.random() * answers.length)].toUpperCase().split('');
};

export const getRandomWordWithCorrectness = () => {
	const randomWord = getRandomWord();
	const word = [];
	randomWord.forEach((c) => {
		word.push({
			char: c,
			isInWord: Math.random() < 0.5,
			isCorrect: Math.random() < 0.5,
			isNotInWord: false
		});
	});
	word.forEach((c) => {
		if (!c.isCorrect && !c.isInWord) {
			c.isNotInWord = true;
		}
	});
	return word;
};
