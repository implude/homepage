import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
	output: 'server',
	integrations: [svelte(), sitemap()],
	adapter: cloudflare({
		imageService: 'cloudflare'
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
