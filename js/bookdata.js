/* English Partner — book reference helpers */
window.EP = window.EP || {};

EP.BOOK_NOTES = {
  'Oxford Word Skills Intermediate': {
    focus: 'واژگان موضوعی با تمرین موقعیتی',
    tips: ['واحد را با عکس صفحه بفرست', 'چانک‌ها را به کارت تبدیل کن']
  },
  'English Vocabulary in Use Intermediate': {
    focus: 'واژگان کاربردی روزمره',
    tips: ['کالوکیشن‌های هر واحد را جدا کن', 'مثال شخصی بساز']
  },
  'English Collocations in Use': {
    focus: 'همنشینی‌های طبیعی',
    tips: ['۳ کالوکیشن کلیدی هر صفحه', 'جایگزین فارسی‌زده را رد کن']
  },
  'English Phrasal Verbs in Use': {
    focus: 'افعال عبارتی',
    tips: ['ذره (up/out/off) را جدا حفظ نکن', 'با مفعول واقعی تمرین کن']
  },
  'Oxford Pocket Phrasal Verbs': {
    focus: 'مرجع سریع phrasal',
    tips: ['فقط موارد پرتکرار', 'در دیالوگ بگنجان']
  },
  'Speakout Intermediate': {
    focus: 'مهارت‌های چهارگانه + ویدیو',
    tips: ['بخش speaking را نقش‌آفرینی کن', 'ویدیوی واحد را ۴ پاس ببین']
  },
  'English Grammar in Use': {
    focus: 'گرامر کاربردی',
    tips: ['قانون را در جملهٔ خودت بگو', 'مقایسه با تداخل فارسی']
  }
};

EP.crossBookHint = function (topic) {
  const t = (topic || '').toLowerCase();
  const hits = [];
  EP.BOOKS.forEach(b => {
    const n = EP.BOOK_NOTES[b];
    if (!n) return;
    if (!topic || n.focus.toLowerCase().includes(t) || b.toLowerCase().includes(t)) {
      hits.push(`• **${b}** — ${n.focus}`);
    }
  });
  if (!hits.length) {
    return EP.BOOKS.map(b => `• **${b}** — ${EP.BOOK_NOTES[b].focus}`).join('\n');
  }
  return hits.join('\n');
};
