// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Orion Kit',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: 'introduction' },
						{ label: 'Quick Start', slug: 'quick-start' },
						{ label: 'Roadmap', slug: 'roadmap' },
						{ label: 'Changelog', slug: 'changelog' },
					],
				},
				{
					label: 'Guide',
					autogenerate: { directory: 'guide' },
				},
				{
					label: 'Architecture',
					autogenerate: { directory: 'architecture' },
				},
				{
					label: 'Packages',
					autogenerate: { directory: 'packages' },
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
});
