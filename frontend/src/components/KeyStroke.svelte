<script>
	import { createEventDispatcher } from 'svelte';

	import game from '../store/game';
	import { highContrast } from '../store/highContrast';
	import multiplayerGame from '../store/multiplayerGame';

	export let isMultiplayer;
	export let letter;

	const dispatch = createEventDispatcher();
</script>

{#if letter.length === 1}
	<kbd
		class="kbd md:kbd-md h-14 lg:kbd-lg font font-bold bg-gray-400 text-white keystroke-width"
		class:isUsed={isMultiplayer
			? $multiplayerGame.user.lettersUsed.filter((c) => c.char === letter).length > 0
			: $game.lettersUsed.filter((c) => c.char === letter).length > 0}
		class:isNotInWord={isMultiplayer
			? $multiplayerGame.user.lettersUsed.filter((c) => c.char === letter && c.isNotInWord).length >
			  0
			: $game.lettersUsed.filter((c) => c.char === letter && c.isNotInWord).length > 0}
		class:isInWord={!$highContrast &&
			(isMultiplayer
				? $multiplayerGame.user.lettersUsed.filter((c) => c.char === letter && c.isInWord).length >
				  0
				: $game.lettersUsed.filter((c) => c.char === letter && c.isInWord).length > 0)}
		class:isInWordHC={$highContrast &&
			(isMultiplayer
				? $multiplayerGame.user.lettersUsed.filter((c) => c.char === letter && c.isInWord).length >
				  0
				: $game.lettersUsed.filter((c) => c.char === letter && c.isInWord).length > 0)}
		class:isCorrect={!$highContrast &&
			(isMultiplayer
				? $multiplayerGame.user.lettersUsed.filter((c) => c.char === letter && c.isCorrect).length >
				  0
				: $game.lettersUsed.filter((c) => c.char === letter && c.isCorrect).length > 0)}
		class:isCorrectHC={$highContrast &&
			(isMultiplayer
				? $multiplayerGame.user.lettersUsed.filter((c) => c.char === letter && c.isCorrect).length >
				  0
				: $game.lettersUsed.filter((c) => c.char === letter && c.isCorrect).length > 0)}
		on:click={() => dispatch('letterclicked', { letter })}
		>{letter}
	</kbd>
{:else}
	<kbd
		class="kbd kbd-md lg:kbd-lg font font-bold bg-gray-400 text-white"
		on:click={() => dispatch('actionclicked', { action: letter })}>{letter}</kbd
	>
{/if}

<style>
	.font {
		font-family: Arial, Helvetica, sans-serif;
	}

	.isCorrect {
		background-color: rgb(34 197 94) !important;
	}

	.isCorrectHC {
		background-color: rgb(234 88 12) !important;
	}

	.isInWord {
		background-color: rgb(234 179 8);
	}

	.isInWordHC {
		background-color: rgb(59 130 246);
	}

	.isNotInWord {
		background-color: rgb(75 85 99);
	}

	.isUsed {
		color: rgb(255, 255, 255);
	}

	@media (max-width: 400px) {
		.keystroke-width {
			min-width: 10px !important;
		}
	}
</style>
