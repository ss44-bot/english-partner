# AGENTS.md — English Partner

> راهنمای ایجنت‌های کدنویسی (Claude Code، Codex، Cursor، Gemini CLI، Copilot، OpenCode، Windsurf، …).
> گزارش کامل فارسی اسکیل‌های نصب‌شده: [`SKILLS-FA.md`](./SKILLS-FA.md)

## 1. What this product is

**English Partner is a language-coach agent for Persian speakers.** It is a persistent, tool-using
agent — planner + memory + tools + voice — that teaches English through real situations.

It is **not** a website, **not** a web app, and **not** a chatbot/bot.
Any UI work is limited to the agent's *surface* (conversation, voice, review queue, progress).
Never frame a deliverable as "site", "app", or "bot"; frame it as agent behaviour, agent tools,
agent memory, or agent surface.

## 2. Non-negotiables

- **Persian-first, RTL.** Explanations in Persian, chunks/dialogue in natural English (`dir="rtl"`).
- **Zero build step.** Plain ES modules + `index.html`; must run from a static host and offline (service worker).
- **Secrets stay local.** Provider API keys live in `localStorage` only. Never commit keys, never send them anywhere but the chosen provider.
- **The coach format is law.** The 11-block lesson format and the 🟩🟦🟪 / 🟥🟨🟩 rules in `js/prompts.js` are the product's contract; edit them deliberately, not incidentally.
- **Answer the user in Persian.** Code, identifiers, comments and commit messages stay in English.
- **Evidence before claims.** Run `python3 tests/check_assets.py` (and the browser flow) before saying something works.

## 3. Installed agent skills

Skills live in `.agents/skills/<name>/` (canonical) and are symlinked into `.claude/skills/`.
They are installed with [`skills`](https://github.com/vercel-labs/skills) and pinned in `skills-lock.json`.
Use the matching skill **before** doing the work it covers — don't re-derive the method from scratch.

| Purpose | Skill | Source |
| --- | --- | --- |
| Agent architecture & harness | `agent-harness-construction`, `autonomous-agent-harness`, `agent-architecture-audit` | affaan-m/ECC |
| Agent memory & context | `unified-memory`, `context-budget`, `iterative-retrieval`, `context-engineering` | affaan-m/ECC, addyosmani/agent-skills |
| Tools / integrations | `mcp-builder` | anthropics/skills |
| Provider APIs (models, tools, streaming, memory) | `claude-api` | anthropics/skills |
| Prompt & skill authoring | `skill-creator`, `prompt-optimizer`, `writing-for-agents` | anthropics/skills, affaan-m/ECC, mattpocock/skills |
| Workflow discipline | `brainstorming`, `writing-plans`, `subagent-driven-development`, `verification-before-completion`, `spec-driven-development`, `grill-me` | obra/superpowers, addyosmani/agent-skills, mattpocock/skills |
| Quality & safety | `agent-self-evaluation`, `safety-guard` | affaan-m/ECC |
| Agent surface (UI/UX) | `ui-ux-pro-max`, `design-system` | nextlevelbuilder/ui-ux-pro-max-skill, affaan-m/ECC |
| Teaching craft | `teach` | mattpocock/skills |
| Meta / discovery | `find-skills` | vercel-labs/skills |

### Which skill when

- Turning a vague request into a decided design → `brainstorming`, then `grill-me`.
- Writing a spec / plan before touching code → `spec-driven-development`, `writing-plans`.
- Designing the agent's tools, action space, observation format → `agent-harness-construction`.
- Long-lived learner state (cards, journal, mistakes) → `unified-memory`; retrieving the right slice → `iterative-retrieval`; token pressure → `context-budget`.
- Creating or editing a skill, `AGENTS.md`, or `CLAUDE.md` → `writing-for-agents`, `skill-creator`.
- Exposing a tool (dictionary, SRS, page OCR, TTS) to the agent → `mcp-builder`.
- Before saying "done" → `verification-before-completion`, `agent-self-evaluation`.
- Any destructive/automated operation → `safety-guard`.

## 4. Working rules for agents

1. **Spec first.** No code before the behaviour and the acceptance check are written down.
2. **Small steps, real feedback.** One behaviour per change, verified in the running product.
3. **Keep the surface honest.** Progress, review dates and errors shown to the learner come from real state, never from decorative placeholders.
4. **Budget context.** Load only the skills and files a task needs; 7 books × 150 situations do not fit in one window.
5. **Update docs in the same change** when behaviour, commands or the format contract move: `README.md`, `README-FA.md`, `SKILLS-FA.md`, `AGENTS.md`.

## 5. Repo map

```
index.html            agent surface (RTL shell, tabs)
styles.css            surface styling
js/app.js             UI wiring + local state
js/ai.js              provider calls (Gemini / OpenAI / Groq / …)
js/prompts.js         coach system prompt + 11-block format + prompt library
js/data.js            cards, journal, mistakes, settings
js/bookdata.js        the 7 books / modules
js/extra.js           situations map, weekly plan, extras
sw.js, manifest.webmanifest, icon*.*   offline + install surface
tests/check_assets.py asset gate used by CI
.agents/skills/       installed agent skills (source of truth)
.claude/skills/       symlinks → .agents/skills
skills-lock.json      pinned skill sources + hashes
```

## 6. Managing skills

```bash
npx skills@latest list                 # what is installed
npx skills@latest find "<topic>"       # search the registry
npx skills@latest add <owner/repo> --skill <name> -a claude-code -a universal -y
npx skills@latest update               # pull newer versions
npx skills@latest remove <name>        # uninstall
```

Review a skill's `SKILL.md` before trusting it: skills execute with the agent's full permissions.
