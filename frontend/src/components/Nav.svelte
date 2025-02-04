<script>
	import { page } from '$app/stores';

	import { exampleWord } from '../const';
	import { highContrast } from '../store/highContrast';
	import multiplayerGame from '../store/multiplayerGame';

	import ExampleTile from './ExampleTile.svelte';
	import Modal from './Modal.svelte';

	let currentPage = '';
	let showModal = false;
	let width;

	$: $page.url.pathname, (currentPage = $page.url.pathname);
</script>

<svelte:window bind:innerWidth={width} />

<div class="navbar shadow-md bg-zinc-800 text-neutral-content nav-height">
	<div class="navbar-start">
		{#if $multiplayerGame.inGame}
			{#if $multiplayerGame.lobby.isPrivate && (currentPage === '/duel' || currentPage === '/lobby')}
				<div class="ml-2 flex flex-col display-none">
					<div class="stat-title uppercase font-bold text-white">Lobby Code</div>
					<div class="font-bold text-3xl text-green-500">{$multiplayerGame.lobby.lobbyId}</div>
				</div>
			{/if}
		{/if}
	</div>
	<div class="navbar-center">
		<a
			class={currentPage === '/'
				? 'btn btn-ghost btn-sm rounded-btn text-lg underline underline-offset-2 decoration-2'
				: 'btn btn-ghost btn-sm rounded-btn text-lg'}
			href="/"
			>Singleplayer
		</a>
		<p class="text-lg">/</p>
		<a
			class={currentPage === '/multiplayer' || currentPage === '/duel'
				? 'btn btn-ghost btn-sm rounded-btn text-lg underline underline-offset-2 decoration-2'
				: 'btn btn-ghost btn-sm rounded-btn text-lg'}
			href="/multiplayer"
			>Multiplayer
		</a>
	</div>
	<div class="navbar-end">
		<div class="ml-2">
			<div
				on:click={() => (showModal = !showModal)}
				class="text-white rounded-full border-2 border-white w-7 font-bold text-white text-center cursor-pointer"
			>
				i
			</div>
		</div>
	</div>
</div>

{#if showModal}
	<input class="modal-toggle" type="checkbox" bind:checked={showModal} />
	<Modal on:closemodal={() => (showModal = !showModal)}>
		<div class="flex flex-col items-center justify-center mx-auto board-width">
			<div class="grid gap-1 grid-cols-5 mt-2">
				{#each exampleWord as letter}
					<ExampleTile
						char={letter.char}
						height={width < 400 ? '60px' : '70px'}
						isCorrect={letter.isCorrect}
						isInWord={letter.isInWord}
						isNotInWord={letter.isNotInWord}
						width={width < 400 ? '60px' : '70px'}
					/>
				{/each}
			</div>
			<p class="text-white font-bold text-lg mt-4 mx-5 md:mx-10">
				A {$highContrast ? 'red-orange' : 'green'} tile indicates a letter is in the word and in the
				correct position. A {$highContrast ? 'blue' : 'yellow'} tile indicates a letter is in the word
				but not in the correct position. A gray tile indicates a letter in not in the word entirely.
			</p>
			<div class="form-control w-2/3 mt-8">
				<label class="cursor-pointer label">
					<span
						><p class="text-white font-bold text-lg">High Contrast</p>
						<p class="text-slate-400 font-bold text-sm">For better color contrast</p></span
					>
					<input
						checked={$highContrast}
						class="toggle"
						type="checkbox"
						on:click={() => highContrast.set(!$highContrast)}
					/>
				</label>
			</div>
		</div>
	</Modal>
{/if}

<style>
	.nav-height {
		min-height: 4.5rem;
		max-height: 4.5rem;
	}

	@media (max-width: 600px) {
		.display-none {
			display: none;
		}
	}
</style>
