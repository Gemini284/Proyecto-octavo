/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				"Vblue": "#300C6A",
				"Vheader": "#0A97C3",
				"Vbg": "#141630"
			},
			fontFamily: {
				inter: ["Inter Variable", "sans-serif"]
			}
		},
	},
	plugins: [],
}
