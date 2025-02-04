<script>
	import Avatar from './Avatar.svelte';

	export let users;
</script>

<table class="table w-full text-white">
	<tbody>
		{#each users as user, userIndex}
			<tr>
				<td class="bg-transparent font-bold border-none p-3">
					<div class="flex flex-row items-center">
						<p class="mr-4 text-xl">{userIndex + 1}</p>
						<Avatar
							isMini={true}
							isReady={user.isReady}
							profileImage={user.profileImage}
							showIndicator={true}
							username={user.username}
						/>
						<p class="ml-4 text-xl">{user.username}</p>
					</div>
				</td>
				<td class="bg-transparent text-right font-bold text-2xl border-none p-3">{user.points}</td>
			</tr>
		{/each}
	</tbody>
</table>
