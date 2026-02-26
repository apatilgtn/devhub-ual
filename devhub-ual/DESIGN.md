# DevHub UAL – Design & Railway Deployment

## Project summary

- **Type:** Backstage developer portal (monorepo)
- **Stack:** Node 22/24, Yarn 4, TypeScript 5.8, React 18, Backstage CLI ~0.35
- **Entry:** `packages/app` (frontend), `packages/backend` (API + serves app in production)

## Missing design (addressed)

| Gap | Solution |
|-----|----------|
| **Secrets in config** | DB and GitHub credentials moved to env vars; documented in `.env.example` |
| **Production baseUrl** | `app-config.production.yaml` uses `APP_BASE_URL` and `PORT` |
| **Port** | Backend listens on `PORT` (Railway sets this) |
| **No env docs** | `.env.example` lists all required/optional variables |
| **Single production image** | `Dockerfile.railway` does full build (install → tsc → build:backend) then runs backend |
| **Railway config** | `railway.json` + `nixpacks.toml` for build/start and root directory |
| **Railway MCP** | Cursor MCP config at `.cursor/mcp.json` for deploy/variables/logs via AI |

## Supabase (login/auth)

- **Supabase Auth** – Login/sign-in and logout use Supabase in `CustomSignInPage` and `LogoutPage`. Still intact; credentials are read from app-config (`supabase.url`, `supabase.anonKey`) with fallbacks so local dev works without env.
- **Supabase Postgres** – Backend DB; in production set `POSTGRES_*` to your Supabase connection (e.g. pooler host).
- Full deployment steps (including Supabase): see **`docs/RAILWAY_DEPLOYMENT_PLAN.md`**.

## Railway deployment

### Build and run

- **Build:** Use `Dockerfile.railway` (multi-stage: build backend + app bundle, then minimal runtime).
- **Start:** `node packages/backend --config app-config.yaml --config app-config.production.yaml`
- **Port:** Backend binds to `PORT` (Railway provides this).

### Required environment variables (Railway)

Set in Railway project → Variables (or via MCP `set-variables`):

| Variable | Description |
|----------|-------------|
| `POSTGRES_HOST` | PostgreSQL host (e.g. Railway Postgres or Supabase) |
| `POSTGRES_PORT` | Usually `5432` |
| `POSTGRES_USER` | DB user |
| `POSTGRES_PASSWORD` | DB password |
| `APP_BASE_URL` | Public URL of the app (e.g. `https://<service>.up.railway.app`) |
| `GITHUB_TOKEN` | Optional; for GitHub catalog/integrations |

Optional: `BACKEND_SECRET`, GitHub OAuth `clientId`/`clientSecret` (use env in config if needed).

### Health check

Backstage backend exposes readiness via its root/API. Railway can use the root URL or `/api/health` if available; adjust in Railway service settings if needed.

### Related tools / apps

- **Postgres:** Add Railway Postgres plugin or use external (e.g. Supabase).
- **Elasticsearch:** Optional; for search. Use Railway template or external; set in config.
- **Kubernetes / Airflow / Grafana / OpenMetadata:** Optional; proxy endpoints in `app-config.yaml` point to localhost by default; for production, point to real URLs via env or override in `app-config.production.yaml`.

## Railway MCP server (Cursor)

The Railway MCP server lets the AI assistant:

- Create/link projects and environments
- Deploy this service and set variables
- Generate a domain and pull logs

Setup: ensure `.cursor/mcp.json` includes the Railway MCP server and Railway CLI is installed and logged in. See `docs/RAILWAY_MCP.md` in repo root.

## Solution design and multi-service

- **What’s implemented:** DevHub UAL on Railway, Supabase auth + Postgres, env-based config, docs. See **`docs/SOLUTION_DESIGN_AND_IMPLEMENTATION.md`**.
- **Adding more apps:** Same Railway project can run multiple services (e.g. a second app with `app/`, `components/`, api-explorer, auth). Add a new service from the same or another repo and set Root Directory and variables. Details in the same doc.

## File map

- `railway.json` – Railway build/start and root directory
- `nixpacks.toml` – Nixpacks fallback when not using Dockerfile
- `Dockerfile.railway` – Production Docker build for Railway
- `app-config.production.yaml` – PORT, APP_BASE_URL, DB from env
- `.env.example` – Env var reference (copy to `.env` for local dev)
- `.cursor/mcp.json` – Cursor Railway MCP config (at repo root)
- `docs/RAILWAY_MCP.md` – Railway MCP setup and deploy steps
- `docs/SOLUTION_DESIGN_AND_IMPLEMENTATION.md` – What’s deployed, checklist, adding more services

## Local development

Copy `.env.example` to `.env` and set `POSTGRES_*`, `GITHUB_TOKEN`, and optionally `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`. Run `yarn install` and `yarn start` from `devhub-ual`.
