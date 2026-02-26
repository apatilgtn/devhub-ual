# Solution design and implementation

This doc ties together what is implemented, what is deployed on Railway, and how to add more services (e.g. a separate dashboard or app) to the same solution.

---

## What is implemented and deployed

### 1. DevHub UAL (Backstage) – **deployed on Railway**

| Component | Status |
|-----------|--------|
| **Backstage app + backend** | Single service; backend serves the app and listens on `PORT` (Railway). |
| **Build** | `Dockerfile.railway` (multi-stage); no standalone `tsc`; `packages/*/src` included in build context. |
| **Auth** | Supabase (CustomSignInPage / LogoutPage) + Backstage guest bridge; GitHub provider optional (commented out in base config). |
| **Database** | Supabase Postgres via `POSTGRES_*` env vars. |
| **Config** | `app-config.yaml` + `app-config.production.yaml`; secrets via env (GRAFANA_TOKEN, OPENMETADATA_TOKEN, etc.). |
| **Railway** | Repo: `apatilgtn/devhub-ual`; Root Directory: `devhub-ual`; domain + `APP_BASE_URL`; Shared Variables for DB and Supabase. |

### 2. Railway infrastructure

- **One project** (e.g. devhub-UAL) with **one service** (devhub-ual) from GitHub.
- **Shared Variables**: `POSTGRES_*`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `APP_BASE_URL`.
- **Networking**: public domain (e.g. `devhub-ual-production.up.railway.app`), target port `7007`.
- **Railway MCP** in Cursor for deploy, variables, logs (see `RAILWAY_MCP.md`).

### 3. Docs and config

- `DESIGN.md` – design summary and file map.
- `RAILWAY_DEPLOYMENT_PLAN.md` – step-by-step deploy and login.
- `LOCAL_RUN.md` – run locally (Windows notes, scripts).
- `.env.example` – required/optional env vars.

---

## Adding more services (e.g. dashboard app)

You can deploy **additional apps** (e.g. a Next.js app with `app/`, `components/`, api-explorer, auth, crm, etc.) on the **same Railway project** so everything is part of one solution.

### Option A: Second service from the same repo (monorepo)

1. In the **same repo**, put the second app in a folder (e.g. `dashboard/` or `web-app/`) with its own `package.json`, `Dockerfile`, and (if needed) `railway.json`.
2. In Railway: **Add Service** → **GitHub** → same repo.
3. Set **Root Directory** to that folder (e.g. `dashboard`).
4. Set **Variables** (and optional **Networking** → Generate domain) for that service.
5. If the app needs the same Postgres or Supabase, reuse the same variables (Shared Variables apply to all services in the environment) or reference Railway’s internal URL (e.g. `devhub-ual.railway.internal` for service-to-service calls).

### Option B: Second service from another repo

1. In the same Railway project, click **Add Service** → **GitHub** → select the other repo.
2. Set Root Directory if the app is in a subfolder.
3. Add Variables; generate a domain if the app should be public.
4. Use **Shared Variables** for DB/auth if both services use the same Supabase/Postgres.

### Option C: Add the app into this repo and deploy as above

If the app from your screenshot (with `app/layout.tsx`, `app/page.tsx`, `api-explorer`, `auth`, `components/AuthAwareNav`, etc.) lives in another folder or repo:

1. **Copy or clone** that app into this repo (e.g. `devhub-ual/dashboard/` or a sibling `dashboard/` next to `devhub-ual/`).
2. Add a **Dockerfile** (and optional `railway.json`) in that folder for Railway build/start.
3. In Railway, **add a new service** from the same repo with Root Directory pointing at that folder.
4. Configure env vars and a public domain if needed.

---

## Checklist: “Everything we need” for this solution

- [x] DevHub UAL (Backstage) builds and runs on Railway.
- [x] Supabase Auth (login) and Supabase Postgres (backend DB) configured via env.
- [x] No hardcoded secrets; production config uses env vars.
- [x] Railway project + one service + domain + Shared Variables.
- [x] Docs: design, deployment plan, local run, MCP.
- [ ] **Optional:** Second app (e.g. dashboard) – add as above when the code is in this repo or in a second repo.

---

## Quick reference

| Need | Where |
|------|--------|
| Deploy DevHub UAL | Railway service, Root Directory `devhub-ual`, variables from `RAILWAY_DEPLOYMENT_PLAN.md`. |
| Add another app | Same project → Add Service → same or other repo, set Root Directory and variables. |
| Change env vars | Railway → project or service → Variables (or MCP `set-variables`). |
| Logs | Railway → service → Deployments → Deploy Logs (or MCP `get-logs`). |
