const defaultTheme = require('tailwindcss/defaultTheme');

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		screens: {
			'lobby-medium': '900px',
			'lobby-large': '1200px',
			...defaultTheme.screens
		}
	},
	plugins: [require('daisyui')]
};

module.exports = config;
