/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				"Bblue": "#300C6A",
				"Bheader": "#0A97C3"
			},
			fontFamily: {
				inter: ["Inter Variable", "sans-serif"]
			}
		},
	},
	plugins: [],
}
