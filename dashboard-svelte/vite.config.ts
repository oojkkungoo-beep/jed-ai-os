import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	server: { port: 5180, strictPort: true },
	preview: { port: 5180, strictPort: true },
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
			// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
			// See https://svelte.dev/docs/kit/adapters for more information about adapters.
			adapter: adapter()
		}),
		VitePWA({
			registerType: 'autoUpdate',
			manifest: {
				name: "Jed's AI OS",
				short_name: 'Jed AI OS',
				description: 'Personal AI Command Center',
				start_url: '/',
				display: 'standalone',
				theme_color: '#2d4a2d',
				background_color: '#f4f1eb',
				icons: [
					{ src: 'images/Jed.png', sizes: '192x192', type: 'image/png' },
					{ src: 'images/Jed.png', sizes: '512x512', type: 'image/png' }
				]
			},
			workbox: {
				runtimeCaching: [
					{
						urlPattern: /\/api\//,
						handler: 'NetworkFirst',
						options: { cacheName: 'api-cache' }
					},
					{
						urlPattern: /\/images\//,
						handler: 'CacheFirst',
						options: { cacheName: 'image-cache' }
					}
				]
			}
		})
	]
});
