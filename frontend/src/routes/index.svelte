<script>
	import { fly } from 'svelte/transition';

	import game from '../store/game';
	import { highContrast } from '../store/highContrast';
	import { answers } from '../const/answers';
	import { guesses } from '../const/guesses';
	import { keyCodes } from '../const';
	import { altButtonStyles, buttonStyles } from '../const/styles';

	import ExampleTile from '../components/ExampleTile.svelte';
	import GameTile from '../components/GameTile.svelte';
	import KeyBoard from '../components/KeyBoard.svelte';
	import Modal from '../components/Modal.svelte';

	let difficulty = 'Normal';
	let showModal = false;
	let width;

	const handleKeydown = (event) => {
		const keyStroke = String(event.key);
		if ($game.isCorrect || $game.isDone) {
			return;
		}
		if (/[a-zA-Z]/.test(keyStroke) && keyStroke.length === 1 && $game.index + 1 !== 6) {
			game.addLetter(keyStroke.toUpperCase());
		}
		if (
			(event.keyCode === keyCodes.back || event.keyCode === keyCodes.delete) &&
			$game.index - 1 !== -1
		) {
			game.removeLetter();
		}
		if (event.keyCode === keyCodes.enter) {
			game.submitWord();
		}
	};

	const handleKeyboardLetter = (event) => {
		if ($game.isCorrect || $game.isDone) {
			return;
		}
		if ($game.index + 1 !== 6) {
			game.addLetter(event.detail.letter);
		}
	};

	const handleKeyboardAction = (event) => {
		if (event.detail.action === 'Back' && $game.index - 1 !== -1) {
			game.removeLetter();
		}
		if (event.detail.action === 'Enter' && $game.index === 5) {
			game.submitWord();
		}
	};
</script>

<svelte:window on:keydown={handleKeydown} bind:innerWidth={width} />

<div class="flex flex-col justify-center items-center mx-auto p-4 board-width">
	{#each $game.words as word, i}
		<div
			in:fly={{ x: -400 }}
			class="mt-1 grid gap-1 grid-cols-5"
			class:shake={word.validCheckFailed}
		>
			{#each word.word as letter, j}
				<GameTile
					borderWidth="2px"
					char={letter.char}
					fontSize="32px"
					height={width < 400 ? '60px' : '70px'}
					isCorrect={letter.isCorrect}
					isInWord={letter.isInWord}
					isNotInWord={letter.isNotInWord}
					obscure={false}
					transitionTime={`${(j + 0.1) * 0.5}s`}
					width={width < 400 ? '60px' : '70px'}
					wordIndex={i}
				/>
			{/each}
		</div>
	{/each}
</div>
<div class="flex flex-col items-center justify-center mx-auto board-width">
	{#if !$game.isCorrect && $game.isDone}
		<div class="grid gap-1 grid-cols-5 mt-2">
			{#each $game.answer as char, i}
				<ExampleTile
					{char}
					height={width < 400 ? '60px' : '70px'}
					isCorrect={true}
					isInWord={false}
					isNotInWord={false}
					width={width < 400 ? '60px' : '70px'}
				/>
			{/each}
		</div>
	{/if}
	{#if $game.isCorrect || $game.isDone}
		<div class="w-full px-4 mt-2">
			<button
				class={`w-full h-10 ${buttonStyles} ${$highContrast ? 'bg-blue-500' : 'bg-green-500'}`}
				on:click={() => game.resetGame(difficulty)}
			>
				<p class="text-xl font-bold">Play Again</p>
			</button>
		</div>
		<div class="w-full px-4 mt-2">
			<button
				class={`w-full h-10 ${altButtonStyles} ${
					$highContrast ? 'bg-orange-600' : 'bg-yellow-500'
				}`}
				on:click={() => (showModal = !showModal)}
			>
				<p class="text-xl font-bold">Change Difficulty</p>
			</button>
		</div>
	{/if}
</div>

<div class="pt-4 mx-auto keyboard-width" in:fly={{ x: 400 }}>
	<KeyBoard
		isMultiplayer={false}
		on:actionclicked={handleKeyboardAction}
		on:letterclicked={handleKeyboardLetter}
	/>
</div>

{#if showModal}
	<input class="modal-toggle" type="checkbox" bind:checked={showModal} />
	<Modal on:closemodal={() => (showModal = !showModal)}>
		<div class="mx-auto mt-4 board-width">
			<div class="form-control">
				<label class="cursor-pointer label">
					<span class="text-2xl font-bold text-white">Normal</span>
					<input
						checked={difficulty === 'Normal'}
						class={`radio bg-white ${
							$highContrast ? 'checked:bg-blue-500' : 'checked:bg-green-600'
						}`}
						name="difficulty"
						type="radio"
						value="Normal"
						on:change={() => (difficulty = 'Normal')}
					/>
				</label>
			</div>
			<div class="form-control">
				<label class="cursor-pointer label">
					<span class="text-2xl font-bold text-white">Hard</span>
					<input
						checked={difficulty === 'Hard'}
						class={`radio bg-white ${
							$highContrast ? 'checked:bg-blue-500' : 'checked:bg-green-600'
						}`}
						name="difficulty"
						type="radio"
						value="Hard"
						on:change={() => (difficulty = 'Hard')}
					/>
				</label>
			</div>
			<div class="bg-gray-800 text-gray-800 text-center">
				<div class="place-items-center place-content-center">
					<div class="py-2 text-2xl text-center font-bold uppercase text-white">Pool Size</div>
					<div class="h-14 flex justify-center items-center">
						<div class={`stat-value ${$highContrast ? 'text-blue-500' : 'text-green-500'}`}>
							{difficulty === 'Hard' ? guesses.length : answers.length}
						</div>
					</div>
				</div>
			</div>
		</div>
	</Modal>
{/if}

<style>
	.board-width {
		width: 400px;
	}

	@media (max-width: 400px) {
		.board-width {
			width: 95vw;
		}
		.keyboard-width {
			width: 95vw;
		}
	}
</style>
