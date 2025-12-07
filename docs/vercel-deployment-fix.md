# Vercel NOT_FOUND Error - Fix Documentation

## Summary of Changes

This document explains the fix for the Vercel NOT_FOUND error and the underlying concepts.

## Files Created/Modified

1. **Root `vercel.json`** - Main Vercel configuration
2. **`api/index.js`** - Serverless function wrapper for Express backend
3. **Root `package.json`** - Monorepo package configuration
4. **`frontend/vercel.json`** - Updated to remove circular rewrite

## The Problem

### What Was Happening

Your original `frontend/vercel.json` had this rewrite rule:
```json
{ "source": "/api/(.*)", "destination": "/api/$1" }
```

This is a **circular rewrite** - it tells Vercel to route `/api/*` requests to `/api/*`, but there was no actual serverless function to handle them. When Vercel tried to serve an API request:

1. Request comes in: `GET /api/sales`
2. Rewrite matches: `/api/(.*)` → `/api/$1` → `/api/sales`
3. Vercel looks for a serverless function at `/api/sales` or `/api/index.js`
4. **No function exists** → NOT_FOUND error

### Root Cause

**Traditional Express servers don't work on Vercel** - Vercel is a serverless platform. Your backend was written as:
```javascript
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

This pattern works locally but fails on Vercel because:
- Vercel doesn't run long-running processes
- There's no "port" to listen on
- Each request invokes a serverless function, not a persistent server

## The Solution

### 1. Convert Express to Serverless Function

Created `api/index.js` that:
- Imports your Express app structure
- Exports the app (not `app.listen()`)
- Handles data loading with caching for serverless cold starts
- Works as a serverless function handler

### 2. Proper Vercel Configuration

The root `vercel.json` now:
- **Builds** the frontend as a static site
- **Builds** the API as a serverless function
- **Routes** `/api/*` requests to the serverless function
- **Rewrites** all other requests to serve the frontend SPA

## Understanding the Concepts

### Why Serverless Functions?

**Traditional Server Model:**
```
┌─────────────┐
│   Server   │ ← Runs continuously, listens on port
│  (Express) │
└─────────────┘
     ↑
     │ Handles all requests
     │
┌─────────────┐
│   Client   │
└─────────────┘
```

**Serverless Model (Vercel):**
```
┌─────────────┐
│  Function  │ ← Created on-demand per request
│  (Lambda)  │
└─────────────┘
     ↑
     │ One request = One function invocation
     │ Function dies after response
     │
┌─────────────┐
│   Client   │
└─────────────┘
```

**Benefits:**
- **Auto-scaling**: Functions scale automatically
- **Cost-effective**: Pay only for execution time
- **No server management**: Vercel handles infrastructure

**Trade-offs:**
- **Cold starts**: First request may be slower (function initialization)
- **Stateless**: Can't rely on in-memory state between requests
- **Time limits**: Functions have execution time limits

### Vercel Routing Architecture

Vercel uses a three-phase routing system:

1. **Builds** - What to build and how
2. **Routes** - Explicit routing rules (evaluated first)
3. **Rewrites** - URL rewriting (evaluated after routes)

```
Request: GET /api/sales
    ↓
Routes: /api/(.*) → /api/index.js ✅ Match!
    ↓
Execute serverless function
    ↓
Response
```

```
Request: GET /dashboard
    ↓
Routes: No match
    ↓
Rewrites: /(.*) → /index.html ✅ Match!
    ↓
Serve static file
    ↓
Response
```

### The Mental Model

Think of Vercel as:
- **Static files** = Pre-built frontend assets (HTML, CSS, JS)
- **Serverless functions** = API endpoints that execute code
- **Routing** = Rules that decide which to use

Your app structure:
```
/
├── frontend/          → Static site (React build)
│   └── dist/         → Built files served directly
├── api/              → Serverless functions
│   └── index.js      → Handles /api/* requests
└── vercel.json       → Configuration
```

## Warning Signs to Watch For

### 1. Circular Rewrites
```json
// ❌ BAD - Circular
{ "source": "/api/(.*)", "destination": "/api/$1" }

// ✅ GOOD - Points to actual function
{ "src": "/api/(.*)", "dest": "/api/index.js" }
```

### 2. Missing Serverless Function
- If you route to `/api/*`, you MUST have a function at `api/index.js` or `api/*.js`
- Vercel looks for files in the `api/` directory automatically

### 3. Using `app.listen()`
```javascript
// ❌ BAD - Won't work on Vercel
app.listen(3000);

// ✅ GOOD - Export the app
export default app;
```

### 4. Incorrect Build Configuration
```json
// ❌ BAD - Wrong distDir path
{ "distDir": "build" }  // If your build outputs to "dist"

// ✅ GOOD - Matches actual output
{ "distDir": "dist" }
```

### 5. Monorepo Path Issues
- Make sure `vercel.json` is at the **root** of your monorepo
- Build paths should be relative to the root
- Use `frontend/package.json` not just `package.json` if frontend is in a subdirectory

## Alternative Approaches

### Option 1: Separate Deployments (Current: Monorepo)
**Pros:**
- Single repository
- Shared code/types
- Single deployment

**Cons:**
- More complex configuration
- Both deploy together

### Option 2: Separate Vercel Projects
Deploy frontend and backend as separate Vercel projects.

**Pros:**
- Simpler configuration per project
- Independent deployments
- Can use different domains

**Cons:**
- Need to configure CORS
- Two deployments to manage
- More complex local development

### Option 3: API Routes in Frontend
Put API routes directly in the frontend project using Vercel's API routes.

**Pros:**
- Everything in one place
- Simpler structure

**Cons:**
- Mixes concerns
- Less separation

## Testing the Fix

1. **Deploy to Vercel:**
   ```bash
   vercel
   ```

2. **Test API endpoints:**
   - `https://your-app.vercel.app/api/health`
   - `https://your-app.vercel.app/api/sales`

3. **Test frontend:**
   - `https://your-app.vercel.app/` (should load React app)

4. **Check Vercel logs:**
   - Go to Vercel dashboard → Your project → Functions
   - Check for any errors in function execution

## Common Issues After Fix

### Issue: "Cannot find module"
**Cause:** Import paths in `api/index.js` are wrong
**Fix:** Use relative paths: `../backend/src/...`

### Issue: "Data not loading"
**Cause:** File paths in serverless environment differ
**Fix:** Use `process.cwd()` or absolute paths for data files

### Issue: "CORS errors"
**Cause:** Frontend and API on different origins
**Fix:** Already handled with `cors()` middleware, but verify it's working

### Issue: "Function timeout"
**Cause:** Data loading takes too long
**Fix:** Implement caching (already done in the fix with `dataLoaded` flag)

## Key Takeaways

1. **Vercel = Serverless**: No persistent servers, only functions
2. **Export, don't listen**: Export Express app, don't call `app.listen()`
3. **Routes before rewrites**: Routes are evaluated first
4. **Monorepo needs root config**: `vercel.json` at root, not in subdirectories
5. **Build output matters**: `distDir` must match your actual build output

## Next Steps

1. Deploy and test
2. Monitor Vercel function logs
3. Optimize cold starts if needed (data caching already implemented)
4. Consider environment variables for configuration
5. Set up proper error monitoring

