---
title: Troubleshooting
description: Common issues and solutions
---

Quick fixes for common issues when getting started with Orion Kit.

## 🚀 **Getting Started Issues**

### "Command not found: pnpm"

```bash
# Install pnpm globally
npm install -g pnpm

# Or use npx
npx pnpm install
```

### "Port already in use"

```bash
# Kill processes on specific ports
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
lsof -ti:3002 | xargs kill -9
lsof -ti:3003 | xargs kill -9
lsof -ti:3004 | xargs kill -9

# Or use different ports
pnpm dev --port 3005
```

### "Module not found" errors

```bash
# Clear cache and reinstall
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

## 🔐 **Authentication Issues**

### "Unauthorized" errors

**Problem:** Getting 401 errors when accessing protected routes

**Solutions:**

1. **Sign in first:** Visit http://localhost:3001/login
2. **Check token:** Open browser dev tools → Application → Local Storage → `auth_token`
3. **Clear storage:** Clear localStorage and try again

### "Invalid token" errors

**Problem:** JWT token is invalid or expired

**Solutions:**

1. **Check JWT secret:** Ensure `AUTH_JWT_SECRET` is set in `apps/api/.env.local`
2. **Regenerate secret:** Create new 32+ character secret
3. **Clear tokens:** Clear localStorage and sign in again

### CORS errors

**Problem:** "Access to fetch at 'http://localhost:3002' from origin 'http://localhost:3001' has been blocked by CORS policy"

**Solutions:**

1. **Check API URL:** Ensure `NEXT_PUBLIC_API_URL=http://localhost:3002` in `apps/app/.env.local`
2. **Restart servers:** Stop and restart both API and app servers
3. **Check middleware:** Verify CORS is configured in `apps/api/middleware.ts`

## 🗄️ **Database Issues**

### "Database connection failed"

**Problem:** Can't connect to database

**Solutions:**

1. **Check DATABASE_URL:** Ensure it's set in `packages/database/.env`
2. **Use pooled connection:** For Neon, use "Pooled connection" not "Direct connection"
3. **Check network:** Ensure database is accessible from your IP

### "Table doesn't exist"

**Problem:** Database tables not found

**Solutions:**

1. **Push schema:** Run `pnpm db:push`
2. **Check migrations:** Run `pnpm db:migrate`
3. **Reset database:** Drop and recreate database

### Drizzle Studio won't open

**Problem:** Studio shows connection error

**Solutions:**

1. **Check DATABASE_URL:** Ensure it's set in `apps/studio/.env.local`
2. **Use correct URL:** Visit `https://local.drizzle.studio?port=3003`
3. **Check port:** Ensure port 3003 is available

## 💳 **Payment Issues**

### Stripe webhook errors

**Problem:** Webhook events not being received

**Solutions:**

1. **Start Stripe CLI:** Run `stripe listen --forward-to localhost:3002/webhooks/stripe`
2. **Check webhook secret:** Ensure `STRIPE_WEBHOOK_SECRET` is set correctly
3. **Check endpoint:** Verify webhook URL in Stripe dashboard

### "Stripe key not found"

**Problem:** Stripe API keys not working

**Solutions:**

1. **Check keys:** Ensure you're using test keys (`pk_test_`, `sk_test_`)
2. **Check environment:** Keys should be in `apps/api/.env.local` and `apps/app/.env.local`
3. **Restart servers:** After adding keys, restart all servers

## 📧 **Email Issues**

### Emails not sending

**Problem:** Welcome emails not being sent

**Solutions:**

1. **Check Resend key:** Ensure `RESEND_API_KEY` is set in `apps/api/.env.local`
2. **Check FROM_EMAIL:** Ensure `FROM_EMAIL` is set to a valid domain
3. **Check logs:** Look for errors in API logs

### "Invalid email address"

**Problem:** Email validation failing

**Solutions:**

1. **Check format:** Ensure email is in valid format
2. **Check domain:** Ensure FROM_EMAIL domain is verified in Resend
3. **Use test domain:** Use `onboarding@resend.dev` for testing

## 🚀 **Deployment Issues**

### Build fails on Vercel

**Problem:** Deployment fails with build errors

**Solutions:**

1. **Check root directory:** Set to `apps/api`, `apps/app`, or `apps/web`
2. **Check Node version:** Ensure Node.js 20+ in Vercel settings
3. **Check environment variables:** Ensure all required vars are set

### "Environment variable not defined"

**Problem:** Missing environment variables in production

**Solutions:**

1. **Check Vercel dashboard:** Ensure all required vars are set
2. **Check prefixes:** Use `NEXT_PUBLIC_` for client-side variables
3. **Redeploy:** After adding vars, redeploy the app

### CORS errors in production

**Problem:** API calls failing in production

**Solutions:**

1. **Check URLs:** Ensure `NEXT_PUBLIC_API_URL` points to production API
2. **Check CORS:** Verify CORS is configured for production domain
3. **Check HTTPS:** Ensure all URLs use HTTPS in production

## 🔧 **Development Issues**

### Hot reload not working

**Problem:** Changes not reflecting in browser

**Solutions:**

1. **Check file watching:** Ensure file watchers are working
2. **Restart dev server:** Stop and restart `pnpm dev`
3. **Clear cache:** Clear browser cache and hard refresh

### TypeScript errors

**Problem:** Type errors in IDE

**Solutions:**

1. **Restart TypeScript:** Restart your IDE or TypeScript server
2. **Check imports:** Ensure imports are from correct packages
3. **Run typecheck:** Run `pnpm typecheck` to see all errors

### Tests failing

**Problem:** Unit or E2E tests failing

**Solutions:**

1. **Check environment:** Ensure test environment is set up
2. **Check database:** Ensure test database is accessible
3. **Run specific test:** Run `pnpm test -- --grep "test-name"`

## 🆘 **Still Stuck?**

### Get Help

1. **Check logs:** Look at browser console and server logs
2. **Search issues:** Check [GitHub issues](https://github.com/Mumma6/orion-kit/issues)
3. **Open issue:** [Create new issue](https://github.com/Mumma6/orion-kit/issues/new) with:
   - Error message
   - Steps to reproduce
   - Environment details
   - Screenshots if applicable

### Useful Commands

```bash
# Check all services
pnpm dev

# Check database
pnpm db:studio

# Check types
pnpm typecheck

# Run tests
pnpm test

# Check build
pnpm build
```

### Debug Mode

```bash
# Run with debug logs
DEBUG=* pnpm dev

# Check specific service
pnpm --filter api dev
pnpm --filter app dev
```

---

**Need more help?** Check our [Complete Documentation](/guide) or [open an issue](https://github.com/Mumma6/orion-kit/issues).
