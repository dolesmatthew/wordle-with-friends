<script>
	import { fly } from 'svelte/transition';
	import { goto } from '$app/navigation';

	import game from '../store/game';
	import multiplayerGame from '../store/multiplayerGame';
	import { userCount } from '../store/userCount';
	import { highContrast } from '../store/highContrast';
	import socket from '../util/socket';
	import { buttonStyles, inputStyles, listItemMenuStyles } from '../const/styles';
	import Modal from '../components/Modal.svelte';

	let difficulty = 'Normal';
	let gameMode = 'Duel';
	let lobbyCode = '';
	let message = '';
	let profileImage = '';
	let searchType = 'Search';
	let showModal = false;
	let username = '';

	$: {
		if ($multiplayerGame.inGame) {
			if ($multiplayerGame.lobby.gameMode === 'Duel') {
				goto('/duel');
			}
			if ($multiplayerGame.lobby.gameMode === 'Large') {
				goto('/lobby');
			}
		}
	}

	const handleFormSubmit = () => {
		if (username.length === 0) {
			showModal = true;
			message = 'Please enter a username.';
			return;
		}
		if (searchType === 'Search') {
			multiplayerGame.joinLobby(username, profileImage, gameMode, difficulty);
		}
		if (searchType === 'Join') {
			if (lobbyCode.length !== 6) {
				showModal = true;
				message = 'Please enter a valid 6 character lobby code.';
				return;
			}
			socket.emit(
				'joinPrivateLobby',
				{ lobbyId: lobbyCode, username, profileImage },
				({ error }) => {
					if (error) {
						showModal = true;
						message = error;
						return;
					}
				}
			);
		}
		if (searchType === 'Create') {
			multiplayerGame.createPrivateLobby(username, profileImage, gameMode, difficulty);
		}
		game.resetGame();
	};

	const handleCloseModal = () => {
		showModal = false;
		message = '';
	};
</script>

<div class="flex flex-col items-center mx-auto input-width p-6">
	<p in:fly={{ y: -400 }} class="font-bold text-white text-xl mb-2">
		{$userCount} players currently online
	</p>
	<input
		in:fly={{ x: -400 }}
		class={`${inputStyles} ${$highContrast ? 'border-blue-500' : 'border-green-500'} input-bg`}
		type="text"
		placeholder="Username"
		bind:value={username}
	/>
	<input
		in:fly={{ x: 400 }}
		class={`${inputStyles} ${$highContrast ? 'border-blue-500' : 'border-green-500'} input-bg`}
		type="text"
		placeholder="Profile Image URL (optional)"
		bind:value={profileImage}
	/>

	<div
		in:fly={{ x: -400 }}
		class="w-full divider divider-border text-white uppercase font-bold text-xl"
	>
		Game Mode
	</div>
	<ul class="w-full">
		<li
			in:fly={{ x: 400 }}
			on:click={() => (gameMode = 'Duel')}
			class={gameMode === 'Duel'
				? `${listItemMenuStyles} ${
						$highContrast ? 'text-blue-500 border-l-blue-500' : 'text-green-500 border-l-green-500'
				  } border-l-2`
				: `${listItemMenuStyles} text-white`}
		>
			<p class="ml-2 text-2xl font-bold">Duel</p>
			<p class="ml-2">1v1 another player in a battle of wits.</p>
		</li>
		<li
			in:fly={{ x: -400 }}
			on:click={() => (gameMode = 'Large')}
			class={gameMode === 'Large'
				? `${listItemMenuStyles} ${
						$highContrast ? 'text-blue-500 border-l-blue-500' : 'text-green-500 border-l-green-500'
				  } border-l-2`
				: `${listItemMenuStyles} text-white`}
		>
			<p class="ml-2 text-2xl font-bold">Large</p>
			<p class="ml-2">Play with up to 20 players and see if you can come out on top.</p>
		</li>
	</ul>
	<div
		in:fly={{ x: 400 }}
		class="w-full divider divider-border text-white uppercase font-bold text-xl"
	>
		Difficulty
	</div>
	<ul class="w-full">
		<li
			in:fly={{ x: -400 }}
			on:click={() => (difficulty = 'Normal')}
			class={difficulty === 'Normal'
				? `${listItemMenuStyles} ${
						$highContrast ? 'text-blue-500 border-l-blue-500' : 'text-green-500 border-l-green-500'
				  } border-l-2`
				: `${listItemMenuStyles} text-white`}
		>
			<p class="ml-2 text-2xl font-bold">Normal</p>
			<p class="ml-2">Words will be choosen from a pool of 2,300+ fairly common words.</p>
		</li>
		<li
			in:fly={{ x: 400 }}
			on:click={() => (difficulty = 'Hard')}
			class={difficulty === 'Hard'
				? `${listItemMenuStyles}  ${
						$highContrast ? 'text-blue-500 border-l-blue-500' : 'text-green-500 border-l-green-500'
				  } border-l-2`
				: `${listItemMenuStyles} text-white`}
		>
			<p class="ml-2 text-2xl font-bold">Hard</p>
			<p class="ml-2">No holds barred, anything goes. Pool size of nearly 13,000 words.</p>
		</li>
	</ul>
	<div
		in:fly={{ x: -400 }}
		class="w-full divider divider-border text-white uppercase font-bold text-xl"
	>
		Play
	</div>
	<ul class="w-full">
		<li
			in:fly={{ x: -400 }}
			on:click={() => (searchType = 'Search')}
			class={searchType === 'Search'
				? `${listItemMenuStyles}  ${
						$highContrast ? 'text-blue-500 border-l-blue-500' : 'text-green-500 border-l-green-500'
				  } border-l-2`
				: `${listItemMenuStyles} text-white`}
		>
			<p class="ml-2 text-2xl font-bold">Search</p>
			<p class="ml-2">Look for an open lobby with the above selected options.</p>
		</li>
		<li
			in:fly={{ x: 400 }}
			on:click={() => (searchType = 'Create')}
			class={searchType === 'Create'
				? `${listItemMenuStyles}  ${
						$highContrast ? 'text-blue-500 border-l-blue-500' : 'text-green-500 border-l-green-500'
				  } border-l-2`
				: `${listItemMenuStyles} text-white`}
		>
			<p class="ml-2 text-2xl font-bold">Create</p>
			<p class="ml-2">Host a private lobby with the above selected options.</p>
		</li>
		<li
			in:fly={{ x: -400 }}
			on:click={() => (searchType = 'Join')}
			class={searchType === 'Join'
				? `${listItemMenuStyles}  ${
						$highContrast ? 'text-blue-500 border-l-blue-500' : 'text-green-500 border-l-green-500'
				  } border-l-2`
				: `${listItemMenuStyles} text-white`}
		>
			<p class="ml-2 text-2xl font-bold">Join</p>
			<p class="ml-2">Join a private lobby using a lobby code.</p>
		</li>
	</ul>
	{#if searchType === 'Join'}
		<input
			in:fly={{ x: 400 }}
			class={`${inputStyles} ${$highContrast ? 'border-blue-500' : 'border-green-500'} input-bg`}
			type="text"
			placeholder="Lobby Code"
			bind:value={lobbyCode}
		/>
	{/if}
	<button
		in:fly={{ y: 400 }}
		class={`w-full h-20 btn p-4 my-4 ${buttonStyles} ${
			$highContrast ? 'bg-blue-500' : 'bg-green-500'
		}`}
		on:click={handleFormSubmit}
	>
		<p class="text-3xl font-bold">Go</p>
	</button>
</div>

{#if showModal}
	<input class="modal-toggle" type="checkbox" bind:checked={showModal} />
	<Modal on:closemodal={handleCloseModal}>
		<p class="font-bold text-xl text-white">{message}</p>
	</Modal>
{/if}

<style>
	.divider-border:after,
	.divider-border:before {
		background-color: rgb(75 85 99);
		opacity: 0.4;
	}

	.input-width {
		width: 700px;
	}

	.input-bg {
		background-color: rgb(39 39 42) !important;
	}
	@media (max-width: 800px) {
		.input-width {
			width: 100% !important;
		}
	}
</style>
