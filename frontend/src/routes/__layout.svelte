<script>
	import Nav from '../components/Nav.svelte';
	import '../app.css';
</script>

<svelte:head>
	<title>Wordle With Friends</title>
	<meta name="description" content="The same Wordle you know, but with friends!" />
	<meta property="og:site_name" content="Wordle With Friends" />
	<meta property="og:url" content="https://www.wordlewithfriends.co" />
	<meta property="og:title" content="Wordle With Friends" />
	<meta property="og:description" content="The same Wordle you know, but with friends!" />
	<meta property="og:image" content="https://i.imgur.com/Y6EKjUa.png" />
	<meta property="og:image:width" content="400" />
	<meta property="og:image:height" content="400" />
</svelte:head>

<Nav />
<div class="md:p-4 bg-zinc-900 page-height">
	<slot />
</div>

<style>
	.page-height {
		min-height: calc(100vh - 4.5rem);
	}
</style>
