# Railway deployment plan – DevHub UAL

## Supabase: still intact

- **Supabase Auth (login/sign-in)** – Unchanged. CustomSignInPage and LogoutPage use Supabase for sign-in, sign-up, and sign-out. Credentials are read from app-config (`supabase.url`, `supabase.anonKey`), with fallbacks so existing behaviour works without env vars.
- **Supabase Postgres (backend DB)** – Backend still uses Postgres; in production you point it at your Supabase DB via env vars (`POSTGRES_HOST`, etc.). Use your Supabase project’s connection details (e.g. pooler host `aws-1-ap-south-1.pooler.supabase.com`).

So: **login/auth with Supabase is still intact**; only the way credentials are supplied is configurable (app-config + env) for Railway.

---

## Railway deployment plan

### 1. Prerequisites

- GitHub repo with this code (Root Directory in Railway = **`devhub-ual`**).
- Railway account; Railway CLI optional (for MCP or manual deploy).
- Supabase project: Auth (for login) and Postgres (for backend DB).

### 2. Create project and service

1. Railway Dashboard → **New Project** → **Deploy from GitHub**.
2. Select this repo.
3. Add a **Service** from the repo.
4. In the service: **Settings** → **Root Directory** → set to **`devhub-ual`** (so `railway.json` and `Dockerfile.railway` are used).

### 3. Database (Supabase Postgres)

- In Supabase: **Project Settings** → **Database** → copy connection details (URI or host/port/user/password).
- Use the **connection pooling** host (e.g. `…pooler.supabase.com`) and port **5432**.
- In Railway → **Variables**, set:

  | Variable           | Example / value |
  |--------------------|------------------|
  | `POSTGRES_HOST`    | `aws-1-ap-south-1.pooler.supabase.com` |
  | `POSTGRES_PORT`     | `5432` |
  | `POSTGRES_USER`     | e.g. `postgres.bbcnahjnozxlnnziyjsq` |
  | `POSTGRES_PASSWORD` | Your Supabase DB password |

### 4. App URL and port

- After first deploy: **Settings** → **Networking** → **Generate domain** (e.g. `your-service.up.railway.app`).
- Set variable:
  - **`APP_BASE_URL`** = `https://<your-generated-domain>` (no trailing slash).

Railway sets **`PORT`** automatically; the app uses it via `app-config.production.yaml`.

### 5. Supabase Auth (login)

- In Supabase: **Project Settings** → **API** → copy **Project URL** and **anon (public) key**.
- In Railway → **Variables**, set (recommended for production so keys aren’t in repo):

  | Variable             | Value |
  |----------------------|--------|
  | `SUPABASE_URL`       | Your Supabase Project URL |
  | `SUPABASE_ANON_KEY`  | Your Supabase anon/public key |

If these are not set, the app falls back to the values in app-config/code (existing behaviour stays intact).

### 6. Optional variables

- **`GITHUB_TOKEN`** – For catalog/integrations (app-config `integrations.github`).
- **`GITHUB_CLIENT_ID`** / **`GITHUB_CLIENT_SECRET`** – Only if you use GitHub OAuth in addition to Supabase login.

### 7. Deploy

- Push to the connected branch; Railway builds with **`Dockerfile.railway`** and runs the backend (which serves the app).
- Or use **Railway MCP** in Cursor: e.g. “Deploy this service”, “Set variables”, “Generate domain” (see `docs/RAILWAY_MCP.md`).

### 8. Login (Supabase Auth)

- **Identity shape** – The sign-in page now uses Backstage’s `IdentityApi` (`getBackstageIdentity`, `getProfileInfo`, `getCredentials`, `signOut`) so login works after the guest auth bridge.
- **CORS** – Production config sets `backend.cors.origin` to `APP_BASE_URL` so the auth bridge request from the app is allowed on Railway.
- **Supabase redirect URLs** – If you use Supabase redirects (e.g. email magic link), add your Railway URL in Supabase: **Authentication** → **URL configuration** → **Redirect URLs**: `https://<your-railway-domain>/` (and same with `http` if needed for local dev).

### 9. Post-deploy

- Open **`APP_BASE_URL`** in the browser.
- Log in via the Supabase-backed CustomSignInPage (email/password or sign-up).
- Backend uses Supabase Postgres for Backstage data.

---

## Summary

| Item              | Status / action |
|-------------------|-----------------|
| Supabase login/auth | Intact; configurable via `SUPABASE_URL` / `SUPABASE_ANON_KEY`. |
| Supabase Postgres | Use `POSTGRES_*` in Railway; point at your Supabase DB. |
| Build             | `Dockerfile.railway` (root `devhub-ual`). |
| Port / URL        | Railway sets `PORT`; you set `APP_BASE_URL` after generating a domain. |
| Secrets           | Prefer env vars in Railway for DB, Supabase Auth, and GitHub. |
