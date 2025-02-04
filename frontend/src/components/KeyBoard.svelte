<script>
	import { keyRowBottom, keyRowMiddle, keyRowTop } from '../const';
	import KeyStroke from './KeyStroke.svelte';

	export let isMultiplayer;
</script>

<div class="flex justify-center gap-1 w-full mt-1">
	{#each keyRowTop as key}
		<KeyStroke {isMultiplayer} letter={key} on:letterclicked />
	{/each}
</div>
<div class="flex justify-center gap-1 w-full mt-1">
	{#each keyRowMiddle as key}
		<KeyStroke {isMultiplayer} letter={key} on:letterclicked />
	{/each}
</div>
<div class="flex justify-center gap-1 w-full mt-1">
	{#each keyRowBottom as key}
		<KeyStroke {isMultiplayer} letter={key} on:letterclicked on:actionclicked />
	{/each}
</div>
