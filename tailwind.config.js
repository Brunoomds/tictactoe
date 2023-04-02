/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["QuickSand", "sans-serif"],
			},
			animation: {
				"pulse-fast": "pulse 500ms ease-in-out infinite",
			},
		},
	},
	plugins: [],
};
