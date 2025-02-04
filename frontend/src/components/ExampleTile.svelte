<script>
	import { highContrast } from '../store/highContrast';

	export let char;
	export let height;
	export let isCorrect;
	export let isInWord;
	export let isNotInWord;
	export let width;
</script>

<div
	class="flex items-center justify-center"
	class:isCorrect={isCorrect && !$highContrast}
	class:isCorrectHC={isCorrect && $highContrast}
	class:isInWord={isInWord && !$highContrast}
	class:isInWordHC={isInWord && $highContrast}
	class:isNotInWord
	style={`height: ${height}; width: ${width}`}
>
	<p class="text-white font-bold text-3xl">
		{char}
	</p>
</div>

<style>
	.isCorrect {
		background-color: rgb(34 197 94) !important;
	}

	.isCorrectHC {
		background-color: rgb(234 88 12) !important;
	}

	.isInWord {
		background-color: rgb(234 179 8);
	}

	.isInWordHC {
		background-color: rgb(59 130 246);
	}

	.isNotInWord {
		background-color: rgb(75 85 99);
	}
</style>
