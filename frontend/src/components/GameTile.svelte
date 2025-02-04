<script>
	import game from '../store/game';
	import { highContrast } from '../store/highContrast';

	export let borderWidth;
	export let char;
	export let fontSize;
	export let height;
	export let isCorrect;
	export let isInWord;
	export let isNotInWord;
	export let obscure;
	export let transitionTime;
	export let width;
	export let wordIndex;

	let toggleFlip = false;
	$: $game.answer, (toggleFlip = false);
	$: {
		if ($game.words[wordIndex].wordSubmitted) {
			toggleFlip = true;
		}
		if ($game.isDone && $game.currentWord > 5) {
			toggleFlip = true;
		}
	}
</script>

<div class="flex items-center justify-center flipBox" style={`height: ${height}; width: ${width}`}>
	<div
		class="flipBoxInner relative w-full h-full text-center"
		style={`transition: transform ${transitionTime}`}
		class:toggleFlip
	>
		<div
			class="absolute w-full h-full border-gray-600 flipBoxFront"
			style={`height: ${height}; width: ${width}; border-width: ${borderWidth};`}
		>
			<p class="text-white font-bold verticalAlign" style={`font-size: ${fontSize}`}>
				{obscure ? '' : char}
			</p>
		</div>
		<div
			class="flipBoxBack absolute w-full h-full"
			class:isCorrect={isCorrect && !$highContrast}
			class:isCorrectHC={isCorrect && $highContrast}
			class:isInWord={isInWord && !$highContrast}
			class:isInWordHC={isInWord && $highContrast}
			class:isNotInWord
		>
			<p class="text-white font-bold verticalAlign" style={`font-size: ${fontSize}`}>
				{obscure ? '' : char}
			</p>
		</div>
	</div>
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

	.toggleFlip {
		transform: rotateY(180deg);
	}

	.flipBox {
		perspective: 1000px;
	}

	.flipBoxInner {
		transform-style: preserve-3d;
	}

	.flipBoxFront,
	.flipBoxBack {
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden;
	}

	.flipBoxBack {
		transform: rotateY(180deg);
	}

	.verticalAlign {
		position: relative;
		top: 50%;
		transform: translateY(-50%);
	}
</style>
