<script>
	import { createEventDispatcher } from 'svelte';
	import { highContrast } from '../store/highContrast';

	const dispatch = createEventDispatcher();
</script>

<div class="modal bg-gray-700/75">
	<div
		class={`modal-box border-4 bg-gray-800 ${
			$highContrast ? 'border-blue-500' : 'border-green-500'
		}`}
	>
		<slot />
		<div class="modal-action">
			<label
				for="my-modal-2"
				class={`btn border-none ${$highContrast ? 'bg-blue-500' : 'bg-green-500'}`}
				on:click={() => dispatch('closemodal')}
			>
				Close
			</label>
		</div>
	</div>
</div>
