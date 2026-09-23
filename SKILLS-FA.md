# 🧠 اسکیل‌های ایجنت نصب‌شده روی English Partner

> این فایل گزارش نصب است: **کدام اسکیل‌ها، از کدام ریپوی گیت‌هاب، چرا برای این پروژه، و کِی استفاده می‌شوند.**
> راهنمای خودِ ایجنت‌ها: [`AGENTS.md`](./AGENTS.md)

---

## ✅ چه نصب شد؟

- **۲۴ اسکیل تاپ‌ریت** از **۷ ریپوی معتبر گیت‌هاب** (مجموع ستاره‌ها: بیش از **۱٫۲ میلیون ★**)
- نصب با ابزار استاندارد اکوسیستم: [`skills`](https://github.com/vercel-labs/skills) (سازندهٔ Vercel، رتبهٔ ۱ لیدربورد skills.sh)
- محل نصب: `.agents/skills/<name>/` (نسخهٔ اصلی) + سیم‌لینک در `.claude/skills/`
- فایل قفل: `skills-lock.json` → منبع و هش هر اسکیل ثبت شده، پس نصب روی هر ماشینی بازتولیدپذیر است.
- **بدون اسکیل سایت/اپ/ربات:** طبق خواستهٔ تو، همه‌چیز حول **ساخت ایجنت** چیده شده؛ حتی دو اسکیل طراحی (UI/UX) هم برای «سطح تعامل خودِ ایجنت» هستند، نه برای ساختن وب‌سایت.

---

## 📦 فهرست کامل (دسته‌بندی‌شده)

### ۱) معماری و ساخت هستهٔ ایجنت

| اسکیل | منبع | محبوبیت | در این پروژه چه می‌کند |
|---|---|---|---|
| `agent-harness-construction` | affaan-m/ECC | ۲۶۵٫۸K ★ | طراحی «فضای عمل» ایجنت: تعریف ابزارها، فرمت مشاهدات و خروجی‌ها برای بالاترین نرخ موفقیت. ابزارهای مربی (دیکشنری، کارت مرور، OCR صفحه، صدا) اینجا طراحی می‌شوند. |
| `autonomous-agent-harness` | affaan-m/ECC | ۲۶۵٫۸K ★ | ایجنت خودگردان با **حافظهٔ پایدار**، اجرای زمان‌بندی‌شده و فشرده‌سازی حافظه. معادل ایجنت‌شدهٔ «یادآور روزانه + مرور سررسید + ریتم هفتگی». |
| `agent-architecture-audit` | affaan-m/ECC | ۲۶۵٫۸K ★ | ممیزی ۱۲ لایهٔ ایجنت؛ پیدا کردن «پوستهٔ توخالی» (wrapper)، ضعف planning، حافظه و ابزارها. |
| `mcp-builder` | anthropics/skills (رسمی) | ۱۷۷٫۷K ★ | ساخت سرور MCP تا ایجنت بتواند به سرویس‌های واقعی (دیکشنری، SRS، TTS/STT، ذخیره‌سازی) وصل شود. |
| `claude-api` | anthropics/skills (رسمی) | ۱۷۷٫۷K ★ | مرجع کامل API مدل‌ها: tool use، streaming، agent design، حافظه، هزینه و بهینه‌سازی. مستقیم به `js/ai.js` مربوط است. |

### ۲) حافظه، زمینه و بازیابی

| اسکیل | منبع | محبوبیت | در این پروژه چه می‌کند |
|---|---|---|---|
| `unified-memory` | affaan-m/ECC | ۲۶۵٫۸K ★ | حافظهٔ مشترک و **قابل بازرسی** بین سشن‌ها. معادل ایجنت‌شدهٔ کارت‌های مرور + ژورنال چهار جمله + دفتر اشتباهات. |
| `context-budget` | affaan-m/ECC | ۲۶۵٫۸K ★ | بودجهٔ پنجرهٔ زمینه: ۷ کتاب و ۱۵۰ موقعیت در یک پنجره جا نمی‌شوند؛ این اسکیل می‌گوید چه چیزی بار شود و چه چیزی نه. |
| `iterative-retrieval` | affaan-m/ECC | ۲۶۵٫۸K ★ | بازیابی تدریجی و دقیق‌شونده (RAG سبک) برای آوردن «همان درس/همان کالوکیشن» به موقع. |
| `context-engineering` | addyosmani/agent-skills | ۹۸٫۶K ★ | چیدمان بهینهٔ کل زمینهٔ ایجنت (دستورها، اسکیل‌ها، ابزارها) و تشخیص افت کیفیت. |

### ۳) پرامپت، اسکیل‌سازی و لحن ایجنت

| اسکیل | منبع | محبوبیت | در این پروژه چه می‌کند |
|---|---|---|---|
| `skill-creator` | anthropics/skills (رسمی) | ۱۷۷٫۷K ★ | ساخت اسکیل اختصاصی از دارایی خودت: **قالب ۱۱ بلوکی**، سه سطح 🟩🟦🟪، تصحیح سه‌رنگ 🟥🟨🟩 و باکس نجات → یک اسکیل قابل‌فراخوانی ایجنت. |
| `prompt-optimizer` | affaan-m/ECC | ۲۶۵٫۸K ★ | تحلیل پرامپت خام، پیدا کردن شکاف‌ها و بازنویسی. برای تمیزکاری `js/prompts.js`. |
| `writing-for-agents` | mattpocock/skills | ۲۶۸٫۲K ★ | چطور برای ایجنت بنویسیم: اسکیل، `AGENTS.md`، `CLAUDE.md` و دستورهای کوتاه و بی‌ابهام. |

### ۴) انضباط کار: از ایده تا تحویل

| اسکیل | منبع | محبوبیت | در این پروژه چه می‌کند |
|---|---|---|---|
| `brainstorming` | obra/superpowers | ۲۹۰٫۴K ★ · ۳۷۳K نصب | قبل از هر ساخت: کشف نیت و نیازها، تبدیل ایده به طراحی مشخص. |
| `grill-me` | mattpocock/skills | ۲۶۸٫۲K ★ · ۱٫۲M نصب (رتبهٔ ۲ لیدربورد) | بازجویی بی‌رحم از پلن تا وقتی سوراخ‌هایش پیدا شود؛ جلوگیری از «این چیزی نیست که می‌خواستم». |
| `spec-driven-development` | addyosmani/agent-skills | ۹۸٫۶K ★ | نوشتن اسپک قبل از کد (رفتار، ورودی/خروجی، معیار پذیرش). |
| `writing-plans` | obra/superpowers | ۲۹۰٫۴K ★ | تبدیل اسپک به پلن چندمرحله‌ای اجراپذیر. |
| `subagent-driven-development` | obra/superpowers | ۲۹۰٫۴K ★ | اجرای پلن با زیرایجنت‌های موازی + بازبینی هر مرحله (سرعت + کنترل کیفیت). |
| `verification-before-completion` | obra/superpowers | ۲۹۰٫۴K ★ | «قبل از گفتن تمام شد، خروجی واقعی را نشان بده» — گیت نهایی هر تغییر. |

### ۵) کیفیت، ارزیابی و ایمنی

| اسکیل | منبع | محبوبیت | در این پروژه چه می‌کند |
|---|---|---|---|
| `agent-self-evaluation` | affaan-m/ECC | ۲۶۵٫۸K ★ | خودارزیابی ایجنت روی ۵ محور (دقت، کامل‌بودن، …) بعد از هر کار غیرساده. |
| `safety-guard` | affaan-m/ECC | ۲۶۵٫۸K ★ | جلوگیری از عملیات مخرب/ناخواسته وقتی ایجنت خودکار کار می‌کند. |

### ۶) سطح تعامل ایجنت (UI/UX) + آموزش

| اسکیل | منبع | محبوبیت | در این پروژه چه می‌کند |
|---|---|---|---|
| `ui-ux-pro-max` | nextlevelbuilder/ui-ux-pro-max-skill | ۱۳۰K ★ · ۳۶۸K نصب | هوش طراحی: ۷۹ سبک، ۱۹۲ پالت محصول، ۷۴ جفت فونت، ۱۱۹ قانون UX، ۲۵ نوع چارت. برای **سطح مکالمه/صدا/پیشرفت خودِ ایجنت**. دیتای محلی دارد (آفلاین کار می‌کند). |
| `design-system` | affaan-m/ECC | ۲۶۵٫۸K ★ | ساخت/ممیزی سیستم طراحی و بررسی یکدستی بصری (RTL، فونت فارسی، کنتراست). |
| `teach` | mattpocock/skills | ۲۶۸٫۲K ★ · ۶۹۹K نصب | هنر آموزش یک مفهوم — مستقیماً به Pedagogical core مربی مربوط است. |
| `find-skills` | vercel-labs/skills | ۳۲٫۳K ★ · رتبهٔ **۱** لیدربورد با ۳٫۵M فعالیت | متااسکیل: وقتی قابلیتی کم بود، خودش اسکیلش را در رجیستری پیدا و نصب می‌کند. |

---

## ⚙️ چطور استفاده می‌شود؟

هر ایجنت کدنویسی‌ای که این ریپو را باز کند، از دو راه این‌ها را می‌بیند:

1. `.agents/skills/` — پوشهٔ مشترک و استاندارد اکوسیستم (`universal`)، خوانده‌شده توسط **Codex، Cursor، Gemini CLI، Copilot، OpenCode، Amp، Warp، Zed، Antigravity، Kilo** و …
2. `.claude/skills/` — سیم‌لینک به همان فایل‌ها برای **Claude Code** (یک نسخه، دوتا نما؛ پس ویرایش اسکیل در یک‌جا هر دو را به‌روز می‌کند).

`AGENTS.md` هم نقشهٔ راه ایجنت است: کِی کدام اسکیل را بار کند و چه قواعد ثابتی (فارسی/RTL، بدون build، کلید API فقط لوکال) را رعایت کند.

### دستورهای مدیریت

```bash
npx skills@latest list            # چه چیزی نصب است
npx skills@latest find "<موضوع>"  # جست‌وجو در رجیستری
npx skills@latest update          # به‌روزرسانی همه
npx skills@latest update claude-api
npx skills@latest remove design-system
```

نسخه‌های نصب‌شده در `skills-lock.json` قفل شده‌اند؛ برای بازسازی روی ماشین دیگر: `npx skills@latest experimental_install`.

> 🔒 امنیت: اسکیل‌ها با دسترسی کامل ایجنت اجرا می‌شوند. قبل از اتکا، فایل `SKILL.md` را مرور کن (همهٔ منابع بالا معروف و open-source با مجوز MIT هستند، به‌جز ریپوی `anthropics/skills` که فایل مجوز جدا دارد).

---

## 🗺️ نقشهٔ راه: از اپ به ایجنت (و اسکیلی که هر فاز را می‌برد)

| فاز | کار | اسکیل‌های درگیر |
|---|---|---|
| **۰. تثبیت هویت** ✅ | ریپو خودش را «ایجنت مربی» معرفی می‌کند، نه سایت/اپ/ربات؛ قواعد ثابت مکتوب شد. | `writing-for-agents` |
| **۱. اسپک ایجنت** | تصمیم‌های قطعی: ایجنت چه می‌بیند، چه به‌خاطر می‌سپارد، چه ابزارهایی دارد، معیار موفقیت چیست → `docs/` | `grill-me` → `brainstorming` → `spec-driven-development` → `writing-plans` |
| **۲. هستهٔ ایجنت** | حلقهٔ ایجنت (تصمیم → ابزار → مشاهده → پاسخ) + ابزارها: دیکشنری، SRS، OCR صفحهٔ کتاب، TTS/STT، ذخیره‌سازی؛ حافظهٔ پایدار و بودجهٔ زمینه | `agent-harness-construction`، `mcp-builder`، `claude-api`، `unified-memory`، `iterative-retrieval`، `context-budget`، `context-engineering` |
| **۳. سطح تعامل** | مکالمه، صدا، صف مرور، پیشرفت — به‌عنوان سطح ایجنت نه «اپ» | `ui-ux-pro-max`، `design-system`، `teach` |
| **۴. کیفیت و پایداری** | ارزیابی خروجی ایجنت، دفتر اشتباهات ایجنت، گارد ایمنی، گیت «مدرک قبل از ادعا» روی هر PR | `agent-self-evaluation`، `safety-guard`، `verification-before-completion`، `agent-architecture-audit`، `subagent-driven-development` |

---

## 🔗 منابع

- affaan-m/ECC — <https://github.com/affaan-m/ECC>
- obra/superpowers — <https://github.com/obra/superpowers>
- mattpocock/skills — <https://github.com/mattpocock/skills>
- anthropics/skills (رسمی Anthropic) — <https://github.com/anthropics/skills>
- addyosmani/agent-skills — <https://github.com/addyosmani/agent-skills>
- vercel-labs/skills — <https://github.com/vercel-labs/skills> · لیدربورد: <https://skills.sh>
- nextlevelbuilder/ui-ux-pro-max-skill — <https://github.com/nextlevelbuilder/ui-ux-pro-max-skill>
