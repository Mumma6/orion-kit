// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeNova from 'starlight-theme-nova'

// https://astro.build/config
export default defineConfig({
	output: 'static',
	outDir: 'dist',
	build: {
		inlineStylesheets: 'auto',
	},
	integrations: [
		starlight({
			plugins: [
				starlightThemeNova(), 
			  ],
			title: 'Orion Kit',
			
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/orion-kit/orion' }],
			sidebar: [
			{
				label: 'Getting Started',
				items: [
					{ label: 'Introduction', slug: 'introduction' },
					{ label: 'Quick Start', slug: 'getting-started' },
					{ label: 'Learning Paths', slug: 'learning-paths' },
					{ label: 'Customization', slug: 'getting-started/customization' },
					{ label: 'Deployment', slug: 'getting-started/deployment' },
					{ label: 'Feature Integration', slug: 'getting-started/integrations' },
					{ label: 'Troubleshooting', slug: 'getting-started/troubleshooting' },
				],
			},
			{
				label: 'Complete Guide',
				items: [
					{ label: 'Accounts Setup', slug: 'guide/accounts-setup' },
					{ label: 'Environment Variables', slug: 'guide/environment-variables' },
					{ label: 'Deployment', slug: 'guide/deployment' },
					{ label: 'Forms', slug: 'guide/forms' },
					{ label: 'Error Handling', slug: 'guide/error-handling' },
					{ label: 'TanStack Query', slug: 'guide/tanstack-query' },
					{ label: 'Zod Validation', slug: 'guide/zod' },
					{ label: 'Stripe Payments', slug: 'guide/stripe-payments' },
					{ label: 'Testing', slug: 'guide/testing' },
					{ label: 'E2E Testing', slug: 'guide/e2e-testing' },
				],
			},
			{
				label: 'Architecture',
				autogenerate: { directory: 'architecture' },
			},
			{
				label: 'Applications',
				autogenerate: { directory: 'apps' },
			},
			{
				label: 'Packages',
				autogenerate: { directory: 'packages' },
			},
			{
				label: 'Reference',
				items: [
					{ label: 'Integrations Overview', slug: 'reference/integrations' },
					{ label: 'Adding AI Features', slug: 'reference/integrations/ai' },
					{ label: 'Adding Email', slug: 'reference/integrations/email' },
					{ label: 'Adding i18n', slug: 'reference/integrations/i18n' },
					{ label: 'Adding File Uploads', slug: 'reference/integrations/file-uploads' },
					{ label: 'Adding CMS', slug: 'reference/integrations/cms' },
					{ label: 'Adding Real-time', slug: 'reference/integrations/realtime' },
					{ label: 'Adding Search', slug: 'reference/integrations/search' },
				],
			},
			],
		}),
	],
});
