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
						{ label: 'Accounts Setup', slug: 'guide/accounts-setup' },
						{ label: 'Environment Variables', slug: 'guide/environment-variables' },
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
					items: [
						{ label: 'Overview', slug: 'packages/index' },
						{ label: 'Auth', slug: 'packages/auth' },
						{ label: 'Database', slug: 'packages/database' },
						{ label: 'Types', slug: 'packages/types' },
						{ label: 'UI', slug: 'packages/ui' },
						{ label: 'Analytics', slug: 'packages/analytics' },
						{ label: 'Observability', slug: 'packages/observability' },
						{ label: 'Jobs', slug: 'packages/jobs' },
						{ label: 'Payment', slug: 'packages/payment' },
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
});
