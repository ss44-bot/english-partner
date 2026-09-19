/* English Partner — data: stages, providers, chunks, situations, modules */
window.EP = window.EP || {};

EP.PROVIDERS = {
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    base: 'https://generativelanguage.googleapis.com/v1beta',
    model: 'gemini-2.0-flash',
    hint: 'aistudio.google.com/app/apikey'
  },
  openai: {
    id: 'openai',
    name: 'OpenAI',
    base: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
    hint: 'platform.openai.com/api-keys'
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    base: 'https://openrouter.ai/api/v1',
    model: 'openai/gpt-4o-mini',
    hint: 'openrouter.ai/keys'
  },
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic Claude',
    base: 'https://api.anthropic.com/v1',
    model: 'claude-3-5-sonnet-latest',
    hint: 'console.anthropic.com/settings/keys'
  },
  groq: {
    id: 'groq',
    name: 'Groq',
    base: 'https://api.groq.com/openai/v1',
    model: 'llama-3.3-70b-versatile',
    hint: 'console.groq.com/keys'
  }
};

EP.STAGES = [
  { id: 'context',  icon: '①', title: 'زمینه',        hint: 'صحنه، داستان کوتاه و سؤال‌های توصیف بساز' },
  { id: 'teach',    icon: '②', title: 'آموزش',        hint: 'واکاوی واژگانی + افعال کنشی + موقعیت‌ها' },
  { id: 'drill',    icon: '③', title: 'تکرار',        hint: 'دریل تلفظ و پرسش-پاسخ' },
  { id: 'guided',   icon: '④', title: 'تولید هدایت‌شده', hint: 'جای‌خالی و فارسی→انگلیسی با زندگی واقعی' },
  { id: 'roleplay', icon: '⑤', title: 'نقش‌آفرینی',   hint: 'دیالوگ دوزبانه با نوبت‌های من' },
  { id: 'correct',  icon: '⑥', title: 'تصحیح',        hint: 'تصحیح سه‌رنگ 🟥🟨🟩 + معادل‌های جایگزین' },
  { id: 'test',     icon: '⑦', title: 'تست',          hint: 'آزمون کوتاه از همین درس' },
  { id: 'deep',     icon: '⑧', title: 'لایهٔ عمیق',   hint: 'پادکست + داستان + خبر + یوتیوب' },
  { id: 'free',     icon: '⑨', title: 'آزاد',         hint: 'صحبت آزاد با مربی دربارهٔ همین موضوع' }
];

EP.DEFAULT_CHUNKS = [
  { en: "Could you give me a hand with this?", fa: "می‌تونی تو این کار کمکم کنی؟", code: "M01-S1" },
  { en: "I ran into an old friend downtown.", fa: "تو مرکز شهر به یه دوست قدیمی برخوردم.", code: "M01-S2" },
  { en: "Let me walk you through the process.", fa: "بذار قدم‌به‌قدم برات توضیح بدم.", code: "M02-S1" },
  { en: "That rings a bell, but I can't place it.", fa: "یه جوری آشناست، ولی یادم نمیاد دقیقاً چیه.", code: "M02-S2" },
  { en: "I'm tied up right now — can I call you back?", fa: "الان سرم شلوغه — می‌تونم بعداً زنگ بزنم؟", code: "M03-S1" },
  { en: "Would you mind if I opened the window?", fa: "اگه پنجره رو باز کنم اشکالی نداره؟", code: "M03-S2" },
  { en: "I'll take a rain check on dinner.", fa: "شام رو می‌ذاریم برای یه وقت دیگه.", code: "M04-S1" },
  { en: "Could you break it down for me?", fa: "می‌تونی ساده‌تر برام بازش کنی؟", code: "M04-S2" },
  { en: "I'm all ears — go ahead.", fa: "گوشم با شماست — بفرما.", code: "M05-S1" },
  { en: "That totally slipped my mind.", fa: "کاملاً از یادم رفت.", code: "M05-S2" },
  { en: "Let's touch base tomorrow morning.", fa: "فردا صبح یه چک‌این کوتاه داشته باشیم.", code: "M06-S1" },
  { en: "I need to wrap this up before lunch.", fa: "باید قبل از ناهار اینو تموم کنم.", code: "M06-S2" }
];

EP.MODULES = [
  { id: 'M01', title: 'Greetings & Small Talk', fa: 'سلام و گپ کوتاه', yt: ['how to make small talk English', 'English greetings natural'] },
  { id: 'M02', title: 'At Home / Daily Routine', fa: 'خانه و روتین روزانه', yt: ['daily routine English vlog', 'morning routine English'] },
  { id: 'M03', title: 'Work & Office', fa: 'کار و اداره', yt: ['office English conversation', 'meeting English phrases'] },
  { id: 'M04', title: 'Shopping & Money', fa: 'خرید و پول', yt: ['shopping English dialogue', 'at the store English'] },
  { id: 'M05', title: 'Food & Restaurants', fa: 'غذا و رستوران', yt: ['ordering food English', 'restaurant English conversation'] },
  { id: 'M06', title: 'Travel & Transport', fa: 'سفر و حمل‌ونقل', yt: ['airport English conversation', 'asking for directions English'] },
  { id: 'M07', title: 'Health & Body', fa: 'سلامت و بدن', yt: ['doctor English conversation', 'symptoms vocabulary English'] },
  { id: 'M08', title: 'Feelings & Opinions', fa: 'احساسات و نظرات', yt: ['expressing opinions English', 'feelings vocabulary English'] },
  { id: 'M09', title: 'Friends & Relationships', fa: 'دوستان و روابط', yt: ['making friends English', 'relationship English phrases'] },
  { id: 'M10', title: 'Phone & Messages', fa: 'تلفن و پیام', yt: ['phone call English', 'leaving a voicemail English'] },
  { id: 'M11', title: 'Tech & Internet', fa: 'تکنولوژی و اینترنت', yt: ['tech support English', 'describing problems English'] },
  { id: 'M12', title: 'Bank & Formal', fa: 'بانک و رسمی', yt: ['bank English conversation', 'formal English requests'] },
  { id: 'M13', title: 'Emergencies', fa: 'اورژانس', yt: ['emergency English phrases', 'calling 911 English'] },
  { id: 'M14', title: 'Hobbies & Free Time', fa: 'سرگرمی', yt: ['talking about hobbies English', 'weekend plans English'] },
  { id: 'M15', title: 'Weather & Nature', fa: 'هوا و طبیعت', yt: ['weather small talk English', 'nature vocabulary English'] },
  { id: 'M16', title: 'Education & Learning', fa: 'آموزش', yt: ['classroom English', 'study tips English'] },
  { id: 'M17', title: 'News & Current Events', fa: 'خبر و رویداد', yt: ['discussing news English', 'current events vocabulary'] },
  { id: 'M18', title: 'Storytelling', fa: 'قصه‌گویی', yt: ['telling a story English', 'past tense storytelling'] },
  { id: 'M19', title: 'Persuasion & Negotiation', fa: 'متقاعدسازی', yt: ['negotiation English phrases', 'persuading someone English'] },
  { id: 'M20', title: 'Complaints & Apologies', fa: 'شکایت و عذرخواهی', yt: ['making a complaint English', 'apologizing naturally English'] },
  { id: 'M21', title: 'Job Interview', fa: 'مصاحبه شغلی', yt: ['job interview English questions', 'tell me about yourself English'] },
  { id: 'M22', title: 'Presentations', fa: 'ارائه', yt: ['presentation English phrases', 'public speaking tips English'] },
  { id: 'M23', title: 'Customer Service', fa: 'خدمات مشتری', yt: ['customer service English', 'handling complaints English'] },
  { id: 'M24', title: 'Culture & Idioms', fa: 'فرهنگ و اصطلاح', yt: ['common English idioms explained', 'American culture tips'] },
  { id: 'M25', title: 'Advanced Fluency', fa: 'روانی پیشرفته', yt: ['think in English tips', 'advanced conversation English'] }
];

/* 150 situations across 25 modules (6 each) */
EP.SITUATIONS = (function () {
  const base = [
    // M01
    ['Greeting a neighbor', 'سلام به همسایه'],
    ['Meeting someone new at a party', 'آشنایی در مهمانی'],
    ['Catching up after a long time', 'دیدن دوباره بعد از مدت‌ها'],
    ['Making small talk in a waiting room', 'گپ کوتاه در اتاق انتظار'],
    ['Ending a conversation politely', 'ختم مودبانهٔ گفتگو'],
    ['Introducing two friends', 'معرفی دو دوست به هم'],
    // M02
    ['Waking up and morning routine', 'بیدار شدن و روتین صبح'],
    ['Cooking breakfast', 'درست کردن صبحانه'],
    ['Cleaning the apartment', 'تمیز کردن آپارتمان'],
    ['Doing laundry', 'لباس شستن'],
    ['Getting ready to leave home', 'آماده شدن برای خروج'],
    ['Evening wind-down', 'آرام شدن شبانه'],
    // M03
    ['Arriving at the office', 'رسیدن به اداره'],
    ['Stand-up meeting update', 'آپدیت در جلسهٔ کوتاه'],
    ['Asking a colleague for help', 'کمک خواستن از همکار'],
    ['Writing a short work email', 'نوشتن ایمیل کاری کوتاه'],
    ['Handling a tight deadline', 'مهلت فشرده'],
    ['Leaving work for the day', 'ترک محل کار'],
    // M04
    ['Asking for a size in a store', 'پرسیدن سایز در مغازه'],
    ['Comparing two products', 'مقایسهٔ دو محصول'],
    ['Asking for a discount', 'درخواست تخفیف'],
    ['Returning an item', 'برگرداندن کالا'],
    ['Paying and tipping', 'پرداخت و انعام'],
    ['Online order problem', 'مشکل سفارش آنلاین'],
    // M05
    ['Booking a table', 'رزرو میز'],
    ['Ordering food', 'سفارش غذا'],
    ['Asking about ingredients / allergies', 'مواد تشکیل‌دهنده / آلرژی'],
    ['Sending food back politely', 'برگرداندن غذا با ادب'],
    ['Splitting the bill', 'تقسیم صورتحساب'],
    ['Complimenting the meal', 'تعریف از غذا'],
    // M06
    ['Buying a train / bus ticket', 'خرید بلیت'],
    ['Asking for directions', 'پرسیدن مسیر'],
    ['At the airport check-in', 'چک‌این فرودگاه'],
    ['Going through security', 'گذر از بازرسی'],
    ['Ordering a ride / taxi', 'گرفتن تاکسی'],
    ['Dealing with a delay', 'تأخیر سفر'],
    // M07
    ['Describing symptoms to a doctor', 'شرح علائم به پزشک'],
    ['Buying medicine at a pharmacy', 'خرید دارو'],
    ['Booking a medical appointment', 'نوبت پزشکی'],
    ['Talking about fitness goals', 'اهداف ورزشی'],
    ['Feeling sick at work', 'بیماری در محل کار'],
    ['Mental health check-in', 'حال روحی'],
    // M08
    ['Sharing good news', 'خبر خوب'],
    ['Talking about stress', 'حرف زدن از استرس'],
    ['Disagreeing politely', 'مخالفت مودبانه'],
    ['Giving an honest opinion', 'نظر صادقانه'],
    ['Encouraging a friend', 'تشویق دوست'],
    ['Expressing frustration calmly', 'ابراز ناراحتی آرام'],
    // M09
    ['Inviting someone out', 'دعوت کردن'],
    ['Turning down an invitation', 'رد دعوت'],
    ['Apologizing to a friend', 'عذرخواهی از دوست'],
    ['Resolving a small conflict', 'حل اختلاف کوچک'],
    ['Congratulating someone', 'تبریک گفتن'],
    ['Keeping in touch long-distance', 'ارتباط از راه دور'],
    // M10
    ['Answering an unknown call', 'جواب تماس ناشناس'],
    ['Leaving a voicemail', 'پیام صوتی'],
    ['Rescheduling a call', 'جابه‌جایی تماس'],
    ['Texting to confirm plans', 'تأیید برنامه با پیام'],
    ['Asking someone to repeat', 'درخواست تکرار'],
    ['Ending a phone call', 'قطع تماس'],
    // M11
    ['Describing a tech problem', 'شرح مشکل فنی'],
    ['Asking for tech support', 'پشتیبانی فنی'],
    ['Setting up a new app', 'راه‌اندازی اپ'],
    ['Privacy / password talk', 'رمز و حریم خصوصی'],
    ['Video call troubleshooting', 'رفع مشکل تماس تصویری'],
    ['Explaining how something works', 'توضیح کارکرد'],
    // M12
    ['Opening a bank account', 'افتتاح حساب'],
    ['Reporting a lost card', 'کارت گم‌شده'],
    ['Making a formal request', 'درخواست رسمی'],
    ['Filling out a form', 'پر کردن فرم'],
    ['Speaking with a clerk', 'صحبت با کارمند'],
    ['Confirming personal details', 'تأیید اطلاعات شخصی'],
    // M13
    ['Calling emergency services', 'تماس اورژانس'],
    ['Describing an accident', 'شرح تصادف'],
    ['Asking for help on the street', 'کمک خواستن در خیابان'],
    ['Lost passport / wallet', 'گم شدن پاسپورت/کیف'],
    ['Fire alarm / evacuation', 'آژیر آتش / تخلیه'],
    ['Helping an injured person', 'کمک به مصدوم'],
    // M14
    ['Talking about a hobby', 'صحبت از سرگرمی'],
    ['Planning a weekend', 'برنامهٔ آخر هفته'],
    ['Joining a club / class', 'عضویت در کلاس'],
    ['Watching a game / match', 'تماشای مسابقه'],
    ['Recommending a show', 'پیشنهاد سریال'],
    ['Canceling weekend plans', 'لغو برنامه'],
    // M15
    ['Weather small talk', 'گپ دربارهٔ هوا'],
    ['Planning around the weather', 'برنامه با توجه به هوا'],
    ['Describing a landscape', 'وصف منظره'],
    ['Talking about seasons', 'فصل‌ها'],
    ['Extreme weather warning', 'هشدار هوای شدید'],
    ['Nature walk commentary', 'حرف زدن در پیاده‌روی طبیعت'],
    // M16
    ['Asking a teacher a question', 'سؤال از معلم'],
    ['Explaining what you studied', 'شرح درس خوانده‌شده'],
    ['Group project coordination', 'هماهنگی پروژه گروهی'],
    ['Taking notes strategies', 'استراتژی یادداشت'],
    ['Exam stress talk', 'استرس امتحان'],
    ['Giving a short class talk', 'صحبت کوتاه کلاسی'],
    // M17
    ['Summarizing a news story', 'خلاصهٔ خبر'],
    ['Sharing an opinion on news', 'نظر دربارهٔ خبر'],
    ['Fact vs opinion', 'واقعیت در برابر نظر'],
    ['Discussing a local event', 'رویداد محلی'],
    ['Avoiding heated topics', 'پرهیز از موضوعات حساس'],
    ['Following up on a story', 'پیگیری خبر'],
    // M18
    ['Telling a funny story', 'داستان خنده‌دار'],
    ['Narrating your day', 'روایت روز'],
    ['Describing a past trip', 'سفر گذشته'],
    ['Building suspense', 'ایجاد تعلیق'],
    ['Reacting to someone\'s story', 'واکنش به داستان دیگران'],
    ['Correcting a detail mid-story', 'تصحیح جزئیات وسط قصه'],
    // M19
    ['Making a polite request', 'درخواست مودبانه'],
    ['Negotiating a price', 'مذاکره قیمت'],
    ['Persuading a friend', 'متقاعد کردن دوست'],
    ['Finding a compromise', 'رسیدن به توافق'],
    ['Pushing back professionally', 'مخالفت حرفه‌ای'],
    ['Closing a deal verbally', 'بستن توافق شفاهی'],
    // M20
    ['Making a service complaint', 'شکایت از سرویس'],
    ['Apologizing sincerely', 'عذرخواهی صمیمانه'],
    ['Accepting an apology', 'پذیرش عذرخواهی'],
    ['Explaining a mistake', 'شرح اشتباه'],
    ['Asking for a refund', 'درخواست بازپرداخت'],
    ['De-escalating tension', 'کاهش تنش'],
    // M21
    ['Tell me about yourself', 'دربارهٔ خودت بگو'],
    ['Why this job?', 'چرا این شغل؟'],
    ['Describing a strength', 'نقطهٔ قوت'],
    ['Talking about a weakness', 'نقطهٔ ضعف'],
    ['Behavioral question (STAR)', 'سؤال رفتاری STAR'],
    ['Asking the interviewer questions', 'سؤال از مصاحبه‌گر'],
    // M22
    ['Opening a presentation', 'شروع ارائه'],
    ['Explaining a slide', 'توضیح اسلاید'],
    ['Handling a tough question', 'سؤال سخت'],
    ['Transitioning between points', 'گذار بین نکات'],
    ['Closing and call-to-action', 'جمع‌بندی'],
    ['Thanking the audience', 'تشکر از حضار'],
    // M23
    ['Greeting a customer', 'خوش‌آمدگویی به مشتری'],
    ['Understanding the issue', 'درک مشکل'],
    ['Offering a solution', 'ارائه راه‌حل'],
    ['Handling an angry customer', 'مشتری عصبانی'],
    ['Following up after support', 'پیگیری بعد از پشتیبانی'],
    ['Upselling politely', 'پیشنهاد اضافه مودبانه'],
    // M24
    ['Explaining an idiom', 'شرح اصطلاح'],
    ['Cultural do\'s and don\'ts', 'باید و نباید فرهنگی'],
    ['Humor that travels', 'شوخی قابل‌فهم'],
    ['Talking about traditions', 'سنت‌ها'],
    ['Avoiding stereotypes', 'پرهیز از کلیشه'],
    ['Code-switching awareness', 'آگاهی از تغییر کد زبانی'],
    // M25
    ['Thinking out loud in English', 'فکر کردن با صدای بلند'],
    ['Paraphrasing on the fly', 'بازنویسی فوری'],
    ['Filler words control', 'کنترل پرکننده‌ها'],
    ['Shadowing a native clip', 'سایه روی کلیپ نیتیو'],
    ['Self-correcting mid-sentence', 'خودتصحیحی وسط جمله'],
    ['Fluent storytelling challenge', 'چالش قصه‌گویی روان']
  ];
  return base.map((pair, i) => {
    const m = Math.floor(i / 6) + 1;
    const s = (i % 6) + 1;
    const mod = EP.MODULES[m - 1];
    return {
      code: `M${String(m).padStart(2, '0')}-S${s}`,
      module: mod.id,
      en: pair[0],
      fa: pair[1],
      status: 0
    };
  });
})();

EP.BOOKS = [
  'Oxford Word Skills Intermediate',
  'English Vocabulary in Use Intermediate',
  'English Collocations in Use',
  'English Phrasal Verbs in Use',
  'Oxford Pocket Phrasal Verbs',
  'Speakout Intermediate',
  'English Grammar in Use'
];

EP.BOOK_CLUSTERS = {
  shopping: ['Oxford Word Skills — Shopping', 'Collocations — buy/pay/spend', 'Phrasal — pick out / try on'],
  work: ['Speakout — Work units', 'Collocations — meet a deadline', 'Phrasal — wrap up / follow up'],
  travel: ['Oxford Word Skills — Travel', 'Phrasal — check in / set off', 'Vocabulary in Use — Transport']
};

EP.YT_CHANNELS = [
  { name: 'English with Lucy', q: 'English with Lucy' },
  { name: 'BBC Learning English', q: 'BBC Learning English' },
  { name: 'Rachel\'s English', q: 'Rachel\'s English' },
  { name: 'Speak English With Vanessa', q: 'Speak English With Vanessa' },
  { name: 'EnglishClass101', q: 'EnglishClass101' },
  { name: 'Papa Teach Me', q: 'Papa Teach Me English' }
];

EP.WEEK_PLAN = [
  { day: 'شنبه', focus: 'ماژول جاری + شدووینگ ۱۵ دقیقه', icon: '🎯' },
  { day: 'یکشنبه', focus: 'عکس صفحه کتاب + کارت‌سازی', icon: '📸' },
  { day: 'دوشنبه', focus: 'نقش‌آفرینی + دفتر اشتباهات', icon: '💬' },
  { day: 'سه‌شنبه', focus: 'ویدیو ۴ پاس + برداشت چانک', icon: '🎬' },
  { day: 'چهارشنبه', focus: 'مرور کارت‌ها + تست کوتاه', icon: '🃏' },
  { day: 'پنجشنبه', focus: 'موقعیت‌های جدید نقشه', icon: '🗺' },
  { day: 'جمعه', focus: 'ژورنال ۴ جمله + مرور هفته', icon: '📓' }
];

EP.COVERAGE = [
  { want: 'پارتنر/مربی نیتیو', where: 'تب جلسه', ok: true },
  { want: 'تاپیک‌محور ۷ کتاب', where: 'موقعیت‌ها + پرامت‌ها', ok: true },
  { want: 'عکس صفحه → درس', where: 'تب صفحه', ok: true },
  { want: 'ارجاع متقابل کتاب‌ها', where: 'تب صفحه', ok: true },
  { want: 'شدووینگ', where: 'تب گفتن', ok: true },
  { want: 'نقش‌آفرینی', where: 'جلسه مرحله ۵', ok: true },
  { want: 'آزمون', where: 'جلسه مرحله ۷', ok: true },
  { want: 'تصحیح + دفتر اشتباه', where: 'جلسه + بیشتر', ok: true },
  { want: 'یادگیری بصری / صحنه', where: 'جلسه', ok: true },
  { want: 'ویدیو ۴ پاس', where: 'تب ویدیو', ok: true },
  { want: 'افعال کنشی', where: 'پرامت‌ها', ok: true },
  { want: 'دوزبانه', where: 'همه خروجی‌ها', ok: true },
  { want: 'دیکشنری + تلفظ', where: 'تب واژه', ok: true },
  { want: 'ضبط صدا', where: 'تب گفتن', ok: true },
  { want: 'مرور فاصله‌دار', where: 'کارت‌ها', ok: true },
  { want: 'ژورنال ۴ جمله', where: 'خانه', ok: true },
  { want: 'برنامه هفتگی', where: 'بیشتر', ok: true },
  { want: '۱۵۰ موقعیت', where: 'نقشه موقعیت‌ها', ok: true },
  { want: 'یادآور روزانه', where: '—', ok: false },
  { want: 'همگام‌سازی ابری', where: '—', ok: false }
];

EP.SRS_DAYS = [1, 3, 7, 14, 30];
