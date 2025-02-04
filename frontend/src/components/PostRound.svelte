<script>
	import game from '../store/multiplayerGame';
	import { highContrast } from '../store/highContrast';

	export let isDisabled;
	export let isReady;
	export let newPoints;
	export let points;
</script>

<div class="flex flex-col items-center">
	<div class="stat-title text-white">New</div>
	<div class="stat-value text-white">+{newPoints}</div>
</div>
<div class="flex flex-col items-center">
	<div class="stat-title text-white">Total</div>
	<div class="stat-value text-white">{points}</div>
</div>
<div class="flex flex-col items-center">
	<div class="stat-title mb-2 text-white">Ready</div>
	<input
		checked={isReady}
		class:overrideCheckbox={!$highContrast}
		class:overrideCheckboxHC={$highContrast}
		class={`checkbox checkbox-lg border-4 ${highContrast ? 'border-blue-500' : 'border-green-500'}`}
		disabled={isDisabled}
		type="checkbox"
		on:click={() => game.setUserAsReady()}
	/>
</div>

<style>
	.overrideCheckbox {
		opacity: 1 !important;
		border-color: rgb(34 197 94);
	}

	.overrideCheckboxHC {
		opacity: 1 !important;
		border-color: rgb(234 88 12);
	}
</style>
