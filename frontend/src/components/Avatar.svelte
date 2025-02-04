<script>
	import { DoubleBounce } from 'svelte-loading-spinners';
	import { highContrast } from '../store/highContrast';

	export let isMini;
	export let isReady;
	export let profileImage;
	export let showIndicator;
	export let username;
</script>

<div class="avatar placeholder indicator">
	{#if !isReady && showIndicator}
		<div class="h-10 indicator-item badge bg-transparent border-transparent">
			{#if $highContrast}
				<DoubleBounce size="20" color="#EA580C" unit="px" />
			{:else}
				<DoubleBounce size="20" color="#EAB308" unit="px" />
			{/if}
		</div>
	{/if}
	{#if isReady && showIndicator}
		<div
			class={`indicator-item badge border-transparent ${
				$highContrast ? 'bg-blue-500' : 'bg-green-500'
			}`}
		/>
	{/if}

	{#if profileImage}
		<div class={isMini ? 'rounded-btn w-10 h-10' : 'rounded-btn w-14 h-14'}>
			<img src={profileImage} alt="Profile Pic" />
		</div>
	{:else}
		<div
			class={isMini
				? 'bg-neutral-focus text-neutral-content rounded-btn w-10 h-10'
				: 'bg-neutral-focus text-neutral-content rounded-btn w-14 h-14'}
		>
			<span class="text-xl">{username.charAt(0)}</span>
		</div>
	{/if}
</div>
