import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
	site: 'https://implu.de',
	output: 'server',
	integrations: [svelte(), sitemap()],
	adapter: node({
		mode: 'standalone'
	}),
	experimental: {
		fonts: [
			{
				provider: fontProviders.google(),
				name: 'Inter',
				cssVariable: '--font-sans',
				fallbacks: ['-apple-system', 'sans-serif']
			},
			{
				provider: fontProviders.google(),
				name: 'JetBrains Mono',
				cssVariable: '--font-mono',
				fallbacks: ['monospace']
			}
		]
	}
});
