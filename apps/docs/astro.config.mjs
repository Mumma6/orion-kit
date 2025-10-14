// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeNova from 'starlight-theme-nova'

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			plugins: [
				starlightThemeNova(), 
			  ],
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
