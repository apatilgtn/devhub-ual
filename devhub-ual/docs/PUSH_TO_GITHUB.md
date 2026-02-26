# Push devhub-ual to apatilgtn/devhub-ual so Railway can build

Railway fails with "Could not find root directory: devhub-ual" because the GitHub repo doesn't have a `devhub-ual` folder yet.

## Fix: push your local code to apatilgtn/devhub-ual

From the **parent folder** that contains `devhub-ual` (e.g. `UAL-demo` or `UAL-demo/UAL-demo`):

```powershell
cd "c:\Users\devop\Downloads\UAL-demo\UAL-demo"
git push apatilgtn main
```

If GitHub says the histories don't match (e.g. repo already has commits):

```powershell
git push apatilgtn main --force
```

After the push, the repo at https://github.com/apatilgtn/devhub-ual will have:
- `devhub-ual/`  ← folder with package.json, Dockerfile.railway, etc.
- (and any other files at your repo root)

Then in Railway, **Root Directory** = `devhub-ual` will work. Trigger a new deploy.

## If you use a new GitHub token

```powershell
git push https://YOUR_GITHUB_TOKEN@github.com/apatilgtn/devhub-ual.git main
```

Replace YOUR_GITHUB_TOKEN with a token that has `repo` scope. Never commit the token.
