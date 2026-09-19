# English Partner

PWA language coach (RTL / Persian UI) — dictionary, spaced repetition, shadowing, AI lesson chat.

## Run on the web (GitHub Pages)

**Production URL (after a successful deployment from `main`):**
https://ss44-bot.github.io/english-partner/

### Enable GitHub Pages (one-time, repo owner)

1. Open **Settings → Pages**:
   https://github.com/ss44-bot/english-partner/settings/pages
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Merge the complete app (including `js/`) into `main`, then run the workflow on `main`:
   https://github.com/ss44-bot/english-partner/actions/workflows/pages.yml
4. Wait until the **Deploy GitHub Pages** job is green. Site goes live at the URL above.

The `github-pages` environment can reject feature-branch deployments. The workflow now deploys only `main`; use the live preview to test feature branches. A repository administrator must explicitly authorize another branch before deploying it to that environment.

### Other free hosts (no setup code change)

- **Netlify Drop:** drag the repo folder onto https://app.netlify.com/drop
- **Cloudflare Pages / Vercel:** import `ss44-bot/english-partner`

## Local run

```bash
python3 tests/check_assets.py
python3 -m http.server 8000 --bind 0.0.0.0
# → http://localhost:8000
```

## Setup in the app

1. Open the app → **Settings**
2. Pick a provider (Gemini / OpenAI / Groq / …) → paste API key → **Test**
3. On iPhone: Safari → Share → **Add to Home Screen**

API key stays in browser `localStorage` only.

Full Persian guide: [README-FA.md](./README-FA.md)

## Repo

https://github.com/ss44-bot/english-partner
