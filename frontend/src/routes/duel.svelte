<script>
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { Circle2 } from 'svelte-loading-spinners';

	import game from '../store/multiplayerGame';
	import { highContrast } from '../store/highContrast';
	import { keyCodes } from '../const';
	import socket from '../util/socket';

	import Avatar from '../components/Avatar.svelte';
	import KeyBoard from '../components/KeyBoard.svelte';
	import Modal from '../components/Modal.svelte';
	import MultiplayerGameTile from '../components/MultiplayerGameTile.svelte';
	import PostRound from '../components/PostRound.svelte';

	let message = 'No active game.';
	let showModal = !$game.inGame;
	let width;

	const handleKeydown = (event) => {
		const keyStroke = String(event.key);
		if ($game.user.isCorrect || $game.user.isDone) {
			return;
		}
		if (/[a-zA-Z]/.test(keyStroke) && keyStroke.length === 1 && $game.user.index + 1 !== 6) {
			game.addLetter(keyStroke.toUpperCase());
		}
		if (
			(event.keyCode === keyCodes.back || event.keyCode === keyCodes.delete) &&
			$game.user.index - 1 !== -1
		) {
			game.removeLetter();
		}
		if (event.keyCode === keyCodes.enter) {
			game.submitWord();
		}
	};

	const handleKeyboardLetter = (event) => {
		if ($game.user.isCorrect || $game.user.isDone) {
			return;
		}
		if ($game.user.index + 1 !== 6) {
			game.addLetter(event.detail.letter);
		}
	};

	const handleKeyboardAction = (event) => {
		if (event.detail.action === 'Back' && $game.user.index - 1 !== -1) {
			game.removeLetter();
		}
		if (event.detail.action === 'Enter' && $game.user.index === 5) {
			game.submitWord();
		}
	};

	const handleCloseModal = () => {
		goto('/multiplayer');
		showModal = false;
	};

	socket.on('userLeft', () => {
		message = 'Opponent has left lobby.';
		showModal = true;
	});
</script>

<svelte:window on:keydown={handleKeydown} bind:innerWidth={width} />

{#if $game.inGame}
	<div class="w-full flex justify-center game-container">
		<div class="ml-4 mt-2 flex flex-col lobby-code">
			<div class="stat-title uppercase font-bold text-white">Lobby Code</div>
			<div class="font-bold text-3xl text-green-500">{$game.lobby.lobbyId}</div>
		</div>
		{#each $game.lobby.users as user, userIndex}
			{#if user.id === $game.user.id}
				<div class="flex flex-col player-section-width">
					<div class="flex flex-col justify-center items-center mx-auto p-4 board-width">
						<div in:fly={{ x: -400 }} class="w-full flex flex-row justify-between items-end mb-4">
							<div class="flex flex-row items-center">
								<Avatar
									isMini={false}
									isReady={false}
									profileImage={$game.user.profileImage}
									showIndicator={false}
									username={$game.user.username}
								/>
								<p class="ml-4 text-2xl font-bold mb-2 text-white">
									{$game.user.username}
								</p>
							</div>
							<div class="flex flex-col items-center mb-3">
								<div class="stat-title text-white">Total</div>
								<div class="stat-value text-white">{$game.user.points}</div>
							</div>
						</div>
						{#each $game.user.words as word, i}
							<div
								in:fly={{ x: 400 }}
								class="mt-1 grid gap-1 grid-cols-5"
								class:shake={word.validCheckFailed}
							>
								{#each word.word as letter, j}
									<MultiplayerGameTile
										borderWidth="2px"
										char={letter.char}
										fontSize="32px"
										height={width < 400 ? '60px' : '70px'}
										isCorrect={letter.isCorrect}
										isInWord={letter.isInWord}
										isNotInWord={letter.isNotInWord}
										obscure={false}
										transitionTime={`${(j + 0.1) * 0.5}s`}
										{userIndex}
										width={width < 400 ? '60px' : '70px'}
										wordIndex={i}
									/>
								{/each}
							</div>
						{/each}
					</div>
					{#if !$game.lobby.lobbyDoneGuessing}
						<div in:fly={{ x: -400 }} class="mt-4 mx-auto keyboard-width">
							<KeyBoard
								isMultiplayer={true}
								on:actionclicked={handleKeyboardAction}
								on:letterclicked={handleKeyboardLetter}
							/>
						</div>
					{/if}
					{#if $game.lobby.lobbyDoneGuessing}
						<div in:fly={{ x: -400 }} class="flex flex-row justify-between board-width mx-auto p-4">
							<PostRound
								isDisabled={$game.user.isReady}
								isReady={$game.user.isReady}
								newPoints={$game.user.newPoints}
								points={$game.user.points}
							/>
						</div>
						{#if !$game.user.isCorrect}
							<div class="flex flex-col justify-center items-center mx-auto p-4 board-width">
								<div class="flex items-center justify-center mt-1 grid gap-1 grid-cols-5">
									{#each $game.lobby.answer as char, i}
										<MultiplayerGameTile
											borderWidth="2px"
											{char}
											fontSize="32px"
											height={width < 400 ? '60px' : '70px'}
											isCorrect={true}
											isInWord={false}
											isNotInWord={false}
											obscure={false}
											transitionTime={`${(i + 0.1) * 0.5}s`}
											userIndex={0}
											width={width < 400 ? '60px' : '70px'}
											wordIndex={i}
										/>
									{/each}
								</div>
							</div>
						{/if}
					{/if}
				</div>
			{/if}
		{/each}
		{#each $game.lobby.users as user, userIndex}
			{#if user.id !== $game.user.id}
				<div class="flex flex-col player-section-width">
					<div class="flex flex-col justify-center items-center mx-auto p-4 board-width">
						<div in:fly={{ x: -400 }} class="w-full flex flex-row justify-between items-end mb-4">
							<div class="flex flex-row items-center">
								<Avatar
									isMini={false}
									isReady={false}
									profileImage={user.profileImage}
									showIndicator={false}
									username={user.username}
								/>
								<p class="ml-4 text-2xl font-bold mb-2 text-white">
									{user.username}
								</p>
							</div>
							<div class="flex flex-col items-center mb-3">
								<div class="stat-title text-white">Total</div>
								<div class="stat-value text-white">{user.points}</div>
							</div>
						</div>
						{#each user.words as word, i}
							<div
								in:fly={{ x: 400 }}
								class="mt-1 grid gap-1 grid-cols-5"
								class:shake={word.validCheckFailed}
							>
								{#each word.word as letter, j}
									<MultiplayerGameTile
										borderWidth="2px"
										char={letter.char}
										fontSize="32px"
										height={width < 400 ? '60px' : '70px'}
										isCorrect={letter.isCorrect}
										isInWord={letter.isInWord}
										isNotInWord={letter.isNotInWord}
										obscure={!$game.lobby.lobbyDoneGuessing}
										transitionTime={`${(j + 0.1) * 0.5}s`}
										{userIndex}
										width={width < 400 ? '60px' : '70px'}
										wordIndex={i}
									/>
								{/each}
							</div>
						{/each}
					</div>
					{#if $game.lobby.lobbyDoneGuessing}
						<div in:fly={{ x: 400 }} class="flex flex-row justify-between board-width mx-auto p-4">
							<PostRound
								isDisabled={true}
								isReady={user.isReady}
								newPoints={user.newPoints}
								points={user.points}
							/>
						</div>
					{/if}
				</div>
			{/if}
		{/each}
		{#if $game.lobby.users.length === 1}
			<div class="flex flex-col player-section-width">
				<div class="flex flex-col justify-center items-center mx-auto p-4 board-width">
					<p in:fly={{ y: -400 }} class="text-2xl font-bold text-white my-8">
						Waiting for player to join...
					</p>
					<div in:fly={{ y: 400 }}>
						<Circle2
							colorOuter={$highContrast ? '#EA580C' : '#22C55E'}
							colorCenter={$highContrast ? '#3482F6' : '#EAB308'}
							colorInner="#4B5563"
							size="200"
							unit="px"
						/>
					</div>
				</div>
			</div>
		{/if}
	</div>
{/if}

{#if showModal}
	<input class="modal-toggle" type="checkbox" bind:checked={showModal} />
	<Modal on:closemodal={handleCloseModal}>
		<p class="font-bold text-xl text-white">{message}</p>
	</Modal>
{/if}

<style>
	.board-width {
		width: 400px;
	}

	.player-section-width {
		width: 500px;
	}

	.lobby-code {
		display: none;
	}

	@media (max-width: 825px) {
		.game-container {
			flex-direction: column;
		}

		.player-section-width {
			margin: auto;
			padding-bottom: 2rem;
		}
	}

	@media (max-width: 600px) {
		.lobby-code {
			display: flex;
		}
	}

	@media (max-width: 500px) {
		.board-width {
			width: 95vw;
		}

		.player-section-width {
			width: 100%;
		}

		.keyboard-width {
			width: 95vw;
		}
	}
</style>
