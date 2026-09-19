# English Partner

PWA language coach (RTL / Persian UI) — dictionary, spaced repetition, shadowing, AI lesson chat.

## Run on the web (GitHub Pages)

**Public URL (after you enable Pages once):**  
https://ss44-bot.github.io/english-partner/

### Enable GitHub Pages (one-time, repo owner)

1. Open **Settings → Pages**:  
   https://github.com/ss44-bot/english-partner/settings/pages
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Re-run the workflow (or push any commit):  
   https://github.com/ss44-bot/english-partner/actions/workflows/pages.yml
4. Wait until the **Deploy GitHub Pages** job is green. Site goes live at the URL above.

You can also set **Source = Deploy from a branch → `main` / `/ (root)`** if you prefer classic Pages without Actions.

### Other free hosts (no setup code change)

- **Netlify Drop:** drag the repo folder onto https://app.netlify.com/drop  
- **Cloudflare Pages / Vercel:** import `ss44-bot/english-partner`

## Local run

```bash
python3 -m http.server 8000
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
