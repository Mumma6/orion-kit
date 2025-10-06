add components from shadcn

cd apps/web
pnpm dlx shadcn@canary add [COMPONENT]

For example, if you run npx shadcn@canary add button, the CLI will install the button component under packages/ui and update the import path for components in apps/web.
