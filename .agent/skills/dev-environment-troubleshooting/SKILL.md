---
name: Dev Environment Troubleshooting
description: Expert troubleshooting guide for ft-quoting monorepo development environment failures, specifically focusing on `npm run dev`, SAM CLI, and port conflicts.
usage:
  triggers:
    - "npm run dev failed"
    - "dev server not starting"
    - "port 3000 already in use"
    - "SAM build failed"
    - "api server connection refused"
    - "debug dev environment"
---

# Dev Environment Troubleshooting Guide

This skill helps diagnose and resolve issues with the `npm run dev` command in the `ft-quoting` monorepo. The development environment orchestrates a Frontend (Vite), Backend (SAM Local API), and a Backend Watcher (Nodemon).

## 🚑 Quick Recovery

If the user is blocked, first try the "Nuclear Option" to reset the environment:

```bash
# 1. Kill all potential conflicting processes
./scripts/kill_port.sh 3000  # Backend API
./scripts/kill_port.sh 5173  # Frontend
./scripts/kill_port.sh 5174  # Frontend Alternate

# 2. Clean build artifacts (often causes SAM "template not found" issues)
rm -rf apps/server/.aws-sam
rm -rf apps/server/dist

# 3. Re-install and rebuild
npm install
npm run build:be
```

## 🔍 Diagnostic Workflow

Follow these steps to identify the root cause.

### 1. Check for Port Conflicts
The most common failure is ensuring the backend API port (3000) is free.

**Command:**
```bash
lsof -i :3000
```
**Fix:**
If `sam` or `node` is listening, run `npm run predev` or `./scripts/kill_port.sh 3000`.

### 2. Verify Backend Build Artifacts
The local API server uses the **source** `template.yaml` (to avoid race conditions) but points to compiled code in `dist/`.

**Checks:**
1. Does `apps/server/dist` exist?
2. Does `apps/server/dist/lambda.js` exist?

**Fix:**
Run `npm run build:be` manually to ensure the TypeScript compilation succeeded.

### 3. Debug SAM CLI / Docker
The SAM CLI requires Docker (or OrbStack) to be running if `warm-containers` are used, though we currently run with `warm-containers LAZY`.

**Common Errors:**
- `Error: Template file not found`: Ensure you are running from the root and `apps/server/template.yaml` exists.
- `Docker is not running`: Start Docker Desktop/OrbStack.

### 4. Race Conditions (Watcher vs API)
We found that the backend watcher (`nodemon`) sometimes deletes the `dist` folder while the API server is reading it.

**Validation:**
- Check `package.json` for the `dev` script.
- Ensure `sleep` commands exist: `"sleep 2 && npm run dev:be"`

### 5. Environment Variables
The `switch-env.sh` script generates the `.env` file.

**Validation:**
- Check if `apps/server/.env` exists and is not empty.
- Ensure `VITE_COGNITO_USER_POOL_ID` is set if user management fails.

## 🛠 Common Fix Patterns

### "Address already in use"
The `predev` hook should have caught this, but if manual processes were started:
```bash
kill -9 $(lsof -ti :3000)
```

### "Template file not found"
This usually means the `sam build` step failed or was skipped.
```bash
npm run build:be
```

### "Runtime.ImportModuleError: Error: Cannot find module"
The `dist` folder is missing or corrupt.
1. Stop the dev server.
2. `rm -rf apps/server/dist`
3. `npm run dev` (which triggers `build:be`)
