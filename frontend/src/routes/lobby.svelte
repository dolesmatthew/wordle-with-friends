<script>
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';

	import game from '../store/multiplayerGame';
	import socket from '../util/socket';
	import { keyCodes } from '../const';

	import Avatar from '../components/Avatar.svelte';
	import KeyBoard from '../components/KeyBoard.svelte';
	import Modal from '../components/Modal.svelte';
	import MultiplayerGameTile from '../components/MultiplayerGameTile.svelte';
	import PostRound from '../components/PostRound.svelte';
	import Standings from '../components/Standings.svelte';

	let message = 'No active game.';
	let showModal = !$game.inGame;
	let standings = [];

	$: {
		standings = [...$game.lobby.users];
		standings.sort((a, b) => (a.points < b.points ? 1 : -1));
	}

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

<svelte:window on:keydown={handleKeydown} />

{#if $game.inGame}
	<div class="ml-2 absolute top-20 right-2 md:right-5">
		<div class="stat-title uppercase font-bold text-white">Players</div>
		<div class="font-bold text-3xl text-white">{$game.lobby.users.length}/20</div>
	</div>

	<div class="w-full flex flex-row justify-center">
		<div class="flex flex-col mr-4 lobby-large:mr-8 player-section-width">
			<div class="ml-4 mt-2 flex flex-col lobby-code">
				<div class="stat-title uppercase font-bold text-white">Lobby Code</div>
				<div class="font-bold text-3xl text-green-500">{$game.lobby.lobbyId}</div>
			</div>
			<div class="sticky top-0">
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
							in:fly={{ x: -400 }}
							class="w-full mt-1 grid gap-1 grid-cols-5"
							class:shake={word.validCheckFailed}
						>
							{#each word.word as letter, j}
								<MultiplayerGameTile
									borderWidth="2px"
									char={letter.char}
									fontSize="32px"
									height="70px"
									isCorrect={letter.isCorrect}
									isInWord={letter.isInWord}
									isNotInWord={letter.isNotInWord}
									obscure={false}
									transitionTime={`${(j + 0.1) * 0.5}s`}
									userIndex={$game.lobby.users.findIndex((u) => u.id === $game.user.id)}
									width="70px"
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
										height="70px"
										isCorrect={true}
										isInWord={false}
										isNotInWord={false}
										obscure={false}
										transitionTime={`${(i + 0.1) * 0.5}s`}
										userIndex={0}
										width="70px"
										wordIndex={i}
									/>
								{/each}
							</div>
						</div>
					{/if}
				{/if}
			</div>
		</div>

		<div class="w-full h-1/2 my-14 lobby-medium:my-10 lobby-large:my-5 lobby-section-width">
			{#if $game.lobby.lobbyDoneGuessing}
				<div
					in:fly={{ x: 400 }}
					class="w-full lobby-medium:w-3/4 lobby-large:w-2/3 mx-auto divider divider-border text-white uppercase font-bold text-lg"
				>
					Standings
				</div>
				<div class="lobby-medium:mx-12 lobby-medium:mt-0 lobby-large:mx-24">
					<Standings users={standings} />
				</div>
			{/if}
			<div in:fly={{ x: 400 }} class="grid gap-1 lobby-medium:grid-cols-2 lobby-large:grid-cols-3">
				{#each $game.lobby.users as user, userIndex}
					{#if user.id !== $game.user.id}
						<div in:fly={{ x: 400 }} class="w-full flex flex-col justify-start items-center px-2">
							<div
								in:fly={{ x: -400 }}
								class="w-full flex flex-row justify-between items-end mt-5 mb-2"
							>
								<div class="flex flex-row items-center">
									<Avatar
										isMini={true}
										isReady={false}
										profileImage={user.profileImage}
										showIndicator={false}
										username={user.username}
									/>
									<p class="ml-4 font-bold mb-1 text-white">
										{user.username}
									</p>
								</div>
								<div class="flex flex-col items-center mb-2">
									<div class="text-lg font-bold text-white mr-2">{user.points}</div>
								</div>
							</div>
							{#each user.words as word, i}
								<div
									class="w-full grid grid-cols-5"
									class:shake={word.validCheckFailed}
									style="margin-top: 4px"
								>
									{#each word.word as letter, j}
										<MultiplayerGameTile
											borderWidth="1px"
											char={letter.char}
											fontSize="20px"
											height="40px"
											isCorrect={letter.isCorrect}
											isInWord={letter.isInWord}
											isNotInWord={letter.isNotInWord}
											obscure={!$game.lobby.lobbyDoneGuessing}
											transitionTime={`${(j + 0.1) * 0.5}s`}
											{userIndex}
											width="95%"
											wordIndex={i}
										/>
									{/each}
								</div>
							{/each}
						</div>
					{/if}
				{/each}
			</div>
		</div>
	</div>
{/if}

{#if showModal}
	<input class="modal-toggle" type="checkbox" bind:checked={showModal} />
	<Modal on:closemodal={handleCloseModal}>
		<p class="font-bold text-xl text-white">{message}</p>
	</Modal>
{/if}

<style>
	.divider-border:after,
	.divider-border:before {
		background-color: #fff;
		opacity: 0.6;
	}

	.board-width {
		width: 400px;
	}

	.player-section-width {
		width: 500px;
	}

	.lobby-section-width {
		width: 700px;
	}

	.lobby-code {
		display: none;
	}

	@media (max-width: 1000px) {
		.player-section-width {
			width: 450px;
		}
	}

	@media (max-width: 600px) {
		.lobby-code {
			display: flex;
		}
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
