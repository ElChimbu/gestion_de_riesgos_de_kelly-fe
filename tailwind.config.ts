export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
		"./node_modules/@maj0codes/ui-library/dist/**/*.{js,mjs,cjs,ts,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				quicksand: ["Quicksand", "sans-serif"],
			},
		},
	},
	plugins: [],
};
