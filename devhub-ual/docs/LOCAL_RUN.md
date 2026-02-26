# Running DevHub UAL locally

## Quick start (Windows)

1. **Install dependencies** (from `devhub-ual`):
   ```powershell
   yarn install
   ```
   If `isolated-vm` fails to build on Windows, the repo uses `enableScripts: false` in `.yarnrc.yml` so install still completes.

2. **Create `.env`** (copy from `.env.example`) and set at least:
   - `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD` (e.g. your Supabase Postgres connection)

3. **Start the app** (loads `.env` and starts frontend + backend):
   ```powershell
   .\start-local.ps1
   ```
   Or set the env vars yourself and run:
   ```powershell
   $env:NODE_OPTIONS = "--max_old_space_size=2048"
   yarn start
   ```

4. **Open** [http://localhost:3000](http://localhost:3000) (frontend) and [http://localhost:7007](http://localhost:7007) (backend).

## If the backend crashes (Windows)

On Windows, the native module **`isolated-vm`** (used by the Scaffolder) often fails to build. If you see:

```text
Error: Cannot find module './out/isolated_vm'
```

then the **frontend** may still be running at http://localhost:3000, but the **backend** (and thus login, catalog, API) will not work.

**Options:**

- **WSL or Docker** – Run the app inside WSL2 or Docker (Linux) so `isolated-vm` builds and the full stack works.
- **Railway** – Deploy with `Dockerfile.railway`; the image is built on Linux and runs the full app (see `docs/RAILWAY_DEPLOYMENT_PLAN.md`).

## Port already in use

If you see `EADDRINUSE: address already in use ::1:3000`:

1. Close any other terminal or app using port 3000 (or 7007).
2. Or find and stop the process:
   ```powershell
   netstat -ano | findstr ":3000"
   Stop-Process -Id <PID> -Force
   ```

## Summary

| Step              | Command / action |
|-------------------|-------------------|
| Install           | `yarn install` (from `devhub-ual`) |
| Env               | Copy `.env.example` to `.env`, set `POSTGRES_*` (and optional `GITHUB_*`, `SUPABASE_*`) |
| Start             | `.\start-local.ps1` (or set env and `yarn start`) |
| Frontend          | http://localhost:3000 |
| Backend           | http://localhost:7007 (may not start on Windows if `isolated-vm` is missing) |
