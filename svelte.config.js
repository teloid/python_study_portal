import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		// Деплой на Cloudflare Pages. В дев-режиме адаптер сам поднимает
		// локальную эмуляцию D1 через getPlatformProxy(), так что `vite dev`
		// работает с platform.env.DB без отдельного `wrangler pages dev`.
		adapter: adapter()
	}
};

export default config;
