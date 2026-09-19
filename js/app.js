/* English Partner — core app logic */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const EP = window.EP;

  /* ---------- storage ---------- */
  const STORE_KEY = 'ep-v1';
  EP.Store = {
    load() {
      try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); }
      catch { return {}; }
    },
    save(patch) {
      const cur = this.load();
      Object.assign(cur, patch);
      localStorage.setItem(STORE_KEY, JSON.stringify(cur));
      return cur;
    },
    getSettings() {
      const d = this.load();
      const p = d.provider || 'gemini';
      const prov = EP.PROVIDERS[p] || EP.PROVIDERS.gemini;
      return {
        provider: p,
        key: d.key || '',
        base: d.base || prov.base,
        model: d.model || prov.model,
        accent: d.accent || 'en-US',
        rate: d.rate != null ? d.rate : 0.95,
        voiceURI: d.voiceURI || ''
      };
    },
    setSettings(s) { this.save(s); },
    cards() { return this.load().cards || []; },
    setCards(c) { this.save({ cards: c }); },
    chat() { return this.load().chat || []; },
    setChat(c) { this.save({ chat: c }); },
    journal() { return this.load().journal || {}; },
    setJournal(j) { this.save({ journal: j }); },
    mistakes() { return this.load().mistakes || []; },
    setMistakes(m) { this.save({ mistakes: m }); },
    situations() {
      const saved = this.load().sitStatus || {};
      return EP.SITUATIONS.map(s => ({ ...s, status: saved[s.code] != null ? saved[s.code] : 0 }));
    },
    setSitStatus(code, status) {
      const d = this.load();
      d.sitStatus = d.sitStatus || {};
      d.sitStatus[code] = status;
      this.save({ sitStatus: d.sitStatus });
    },
    streak() {
      const d = this.load();
      return { days: d.streakDays || 0, last: d.streakLast || '' };
    },
    touchStreak() {
      const today = EP.today();
      const st = this.streak();
      if (st.last === today) return st;
      const yest = EP.shiftDate(today, -1);
      const days = st.last === yest ? (st.days || 0) + 1 : 1;
      this.save({ streakDays: days, streakLast: today });
      return { days, last: today };
    },
    chunks() {
      const c = this.load().chunks;
      return (c && c.length) ? c : EP.DEFAULT_CHUNKS.map(x => ({ ...x }));
    },
    setChunks(c) { this.save({ chunks: c }); },
    harvest() { return this.load().harvest || ''; },
    setHarvest(h) { this.save({ harvest: h }); },
    passes() { return this.load().passes || [false, false, false, false]; },
    setPasses(p) { this.save({ passes: p }); },
    recordings() { return this.load().recordings || []; },
    setRecordings(r) { this.save({ recordings: r }); }
  };

  EP.today = () => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  };
  EP.shiftDate = (iso, n) => {
    const d = new Date(iso + 'T12:00:00');
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  };

  /* ---------- UI helpers ---------- */
  EP.toast = (msg, type = '') => {
    const t = $('#toast');
    t.textContent = msg;
    t.className = 'toast on' + (type ? ' ' + type : '');
    clearTimeout(EP._toastT);
    EP._toastT = setTimeout(() => t.classList.remove('on'), 2600);
  };

  EP.md = (text) => {
    if (!text) return '';
    let s = String(text)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // code fences
    s = s.replace(/```([\s\S]*?)```/g, (_, c) => '<pre><code>' + c.replace(/^\n/, '') + '</code></pre>');
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    // headers
    s = s.replace(/^######\s+(.*)$/gm, '<h3>$1</h3>');
    s = s.replace(/^#####\s+(.*)$/gm, '<h3>$1</h3>');
    s = s.replace(/^####\s+(.*)$/gm, '<h3>$1</h3>');
    s = s.replace(/^###\s+(.*)$/gm, '<h3>$1</h3>');
    s = s.replace(/^##\s+(.*)$/gm, '<h2>$1</h2>');
    s = s.replace(/^#\s+(.*)$/gm, '<h1>$1</h1>');
    // bold / italic
    s = s.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
    s = s.replace(/\*([^*]+)\*/g, '<i>$1</i>');
    // hr
    s = s.replace(/^---$/gm, '<hr>');
    // blockquote
    s = s.replace(/^&gt;\s?(.*)$/gm, '<blockquote>$1</blockquote>');
    // tables
    s = s.replace(/(?:^|\n)(\|.+\|(?:\n\|.+\|)+)/g, (block) => {
      const rows = block.trim().split('\n').filter(Boolean);
      if (rows.length < 2) return block;
      const parse = r => r.replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
      const head = parse(rows[0]);
      const isSep = rows[1] && /^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?$/.test(rows[1]);
      const body = rows.slice(isSep ? 2 : 1);
      let html = '<table><thead><tr>' + head.map(h => `<th>${h}</th>`).join('') + '</tr></thead><tbody>';
      body.forEach(r => {
        const cells = parse(r);
        html += '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
      });
      return html + '</tbody></table>';
    });
    // lists
    s = s.replace(/(?:^|\n)((?:[\-\*]\s+.+(?:\n|$))+)/g, (block) => {
      const items = block.trim().split('\n').map(l => l.replace(/^[\-\*]\s+/, ''));
      return '<ul>' + items.map(i => `<li>${i}</li>`).join('') + '</ul>';
    });
    s = s.replace(/(?:^|\n)((?:\d+\.\s+.+(?:\n|$))+)/g, (block) => {
      const items = block.trim().split('\n').map(l => l.replace(/^\d+\.\s+/, ''));
      return '<ol>' + items.map(i => `<li>${i}</li>`).join('') + '</ol>';
    });
    // paragraphs
    s = s.split(/\n{2,}/).map(p => {
      if (/^<(h\d|ul|ol|pre|table|blockquote|hr)/.test(p.trim())) return p;
      return '<p>' + p.replace(/\n/g, '<br>') + '</p>';
    }).join('');
    return s;
  };

  /* ---------- TTS ---------- */
  EP.TTS = {
    utter: null,
    voices: [],
    refresh() {
      this.voices = window.speechSynthesis?.getVoices() || [];
      const sel = $('#setVoice');
      if (!sel) return;
      const cfg = EP.Store.getSettings();
      const acc = cfg.accent || 'en-US';
      const list = this.voices.filter(v => v.lang && v.lang.toLowerCase().startsWith(acc.slice(0, 2).toLowerCase()));
      const use = list.length ? list : this.voices;
      sel.innerHTML = use.map(v =>
        `<option value="${v.voiceURI}" ${v.voiceURI === cfg.voiceURI ? 'selected' : ''}>${v.name} (${v.lang})</option>`
      ).join('') || '<option value="">—</option>';
    },
    pickVoice() {
      const cfg = EP.Store.getSettings();
      this.refresh();
      if (cfg.voiceURI) {
        const v = this.voices.find(x => x.voiceURI === cfg.voiceURI);
        if (v) return v;
      }
      const acc = cfg.accent || 'en-US';
      return this.voices.find(v => v.lang === acc)
        || this.voices.find(v => v.lang && v.lang.startsWith(acc.slice(0, 2)))
        || this.voices[0] || null;
    },
    stop() {
      try { speechSynthesis.cancel(); } catch {}
      this.utter = null;
    },
    speak(text, opts = {}) {
      if (!text) return;
      if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
        EP.toast('مرورگر شما پخش گفتار را پشتیبانی نمی‌کند.', 'err');
        return;
      }
      this.stop();
      const cfg = EP.Store.getSettings();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = opts.lang || cfg.accent || 'en-US';
      u.rate = opts.rate != null ? opts.rate : (cfg.rate || 0.95);
      const v = this.pickVoice();
      if (v) u.voice = v;
      this.utter = u;
      speechSynthesis.speak(u);
    },
    /** Only English lines (skip Persian / RTL-heavy) */
    englishOnly(text) {
      return String(text || '').split(/\n+/).map(l => l.trim()).filter(l => {
        if (!l) return false;
        if (/^[#>*\-\d.|`]+$/.test(l)) return false;
        const fa = (l.match(/[\u0600-\u06FF]/g) || []).length;
        const en = (l.match(/[A-Za-z]/g) || []).length;
        return en >= 3 && en > fa;
      }).join('. ');
    }
  };
  if (typeof speechSynthesis !== 'undefined') {
    speechSynthesis.onvoiceschanged = () => EP.TTS.refresh();
  }

  /* ---------- tabs ---------- */
  EP.goto = (tab) => {
    $$('.tab').forEach(t => t.classList.toggle('on', t.id === 'tab-' + tab));
    $$('#navbar button').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
    // more-menu targets that are not in navbar
    if (['cards', 'prompts', 'settings', 'situations'].includes(tab)) {
      $$('#navbar button').forEach(b => b.classList.remove('on'));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ---------- home ---------- */
  EP.renderHome = () => {
    const st = EP.Store.touchStreak();
    const cards = EP.Store.cards();
    const due = cards.filter(c => !c.next || c.next <= EP.today());
    const sits = EP.Store.situations();
    const done = sits.filter(s => s.status === 2).length;
    const doing = sits.filter(s => s.status === 1).length;
    $('#homeHero').innerHTML = `
      <div class="row"><b class="grow">🔥 زنجیره</b><span class="pill ok">${st.days} روز</span></div>
      <div class="muted small">آخرین فعالیت: ${st.last || '—'}</div>
      <div class="grid2" style="margin-top:10px">
        <div class="kpi"><b>${due.length}</b><span>کارت سررسید</span></div>
        <div class="kpi"><b>${done}</b><span>موقعیت مسلط</span></div>
        <div class="kpi"><b>${doing}</b><span>در حال یادگیری</span></div>
        <div class="kpi"><b>${cards.length}</b><span>کل کارت‌ها</span></div>
      </div>`;
    $('#homeDue').innerHTML = due.length
      ? `<div class="row"><b class="grow">🃏 کارت‌های امروز</b><button class="small" data-goto="cards">مرور</button></div>
         <div class="small muted">${due.slice(0, 5).map(c => `• ${c.en}`).join('<br>')}${due.length > 5 ? '<br>…' : ''}</div>`
      : `<div class="row"><b class="grow">🃏 کارت‌ها</b><span class="pill ok">همه مرور شد</span></div>
         <div class="muted small">کارت سررسیدی نداری. از درس‌ها کارت بساز.</div>`;
    const nextSit = sits.find(s => s.status === 0) || sits.find(s => s.status === 1);
    $('#homeNext').innerHTML = nextSit
      ? `<div class="row"><b class="grow">🎯 قدم بعدی</b><span class="codepill">${nextSit.code}</span></div>
         <div class="en2" dir="ltr" style="text-align:left;font-weight:600;margin:6px 0">${nextSit.en}</div>
         <div class="muted small">${nextSit.fa}</div>
         <div class="row" style="margin-top:8px">
           <button class="primary small" id="btnStartNext">▶ شروع در جلسه</button>
           <button class="small" data-goto="situations">🗺 نقشه</button>
         </div>`
      : `<div class="muted">همه موقعیت‌ها را دیدی 🎉</div>`;
    const btn = $('#btnStartNext');
    if (btn) btn.onclick = () => {
      EP.openSituation(nextSit);
    };

    // journal
    const j = EP.Store.journal();
    const today = EP.today();
    $('#journalDate').textContent = today;
    $('#journal').value = j[today] || '';
  };

  /* ---------- chat / lesson ---------- */
  EP.chatImages = [];

  EP.renderChat = () => {
    const log = $('#chatLog');
    const msgs = EP.Store.chat();
    log.innerHTML = '';
    if (!msgs.length) {
      log.innerHTML = `<div class="msg sys"><div class="body">سلام! مرحله را انتخاب کن یا پیام بفرست. برای درس کامل از پرامت «📐 قالب ۱۱ بلوکی» استفاده کن. کلید API را در تنظیمات بچسبان.</div></div>`;
      return;
    }
    msgs.forEach((m, idx) => {
      const div = document.createElement('div');
      div.className = 'msg ' + (m.role === 'user' ? 'me' : m.role === 'system' ? 'sys' : 'ai');
      const who = m.role === 'user' ? 'من' : m.role === 'system' ? 'سیستم' : 'مربی';
      div.innerHTML = `<div class="who"><span>${who}</span><span class="muted">${m.at || ''}</span></div>
        <div class="body">${EP.md(m.content)}</div>`;
      if (m.images && m.images.length) {
        m.images.forEach(src => {
          const img = document.createElement('img');
          img.src = src;
          div.appendChild(img);
        });
      }
      if (m.role === 'assistant') {
        const acts = document.createElement('div');
        acts.className = 'acts';
        acts.innerHTML = `
          <button data-a="tts" data-i="${idx}">🔊 خواندن انگلیسی</button>
          <button data-a="speak" data-i="${idx}">🗣 تمرین در گفتن</button>
          <button data-a="cards" data-i="${idx}">🃏 ساخت کارت</button>
          <button data-a="mist" data-i="${idx}">🟥 ثبت اشتباه</button>
          <button data-a="dl" data-i="${idx}">💾 دانلود</button>`;
        div.appendChild(acts);
      }
      log.appendChild(div);
    });
    log.scrollTop = log.scrollHeight;
    log.querySelectorAll('.acts button').forEach(b => {
      b.onclick = () => EP.chatAction(b.dataset.a, +b.dataset.i);
    });
  };

  EP.chatAction = (a, i) => {
    const msgs = EP.Store.chat();
    const m = msgs[i];
    if (!m) return;
    if (a === 'tts') {
      const en = EP.TTS.englishOnly(m.content);
      if (!en) return EP.toast('خط انگلیسی پیدا نشد', 'err');
      EP.TTS.speak(en);
    } else if (a === 'speak') {
      const lines = EP.extractChunks(m.content);
      if (!lines.length) return EP.toast('چانکی پیدا نشد', 'err');
      const cur = EP.Store.chunks();
      EP.Store.setChunks([...lines, ...cur]);
      EP.Speak.idx = 0;
      EP.Speak.render();
      EP.goto('speak');
      EP.toast(`${lines.length} خط به «گفتن» اضافه شد`, 'ok');
    } else if (a === 'cards') {
      const lines = EP.extractChunks(m.content);
      if (!lines.length) return EP.toast('چانکی برای کارت پیدا نشد', 'err');
      const cards = EP.Store.cards();
      lines.forEach(l => cards.unshift(EP.makeCard(l.en, l.fa, l.code)));
      EP.Store.setCards(cards);
      EP.toast(`${lines.length} کارت ساخته شد`, 'ok');
      EP.renderHome();
    } else if (a === 'mist') {
      const wrong = prompt('جملهٔ غلط (انگلیسی):');
      if (!wrong) return;
      const right = prompt('نسخهٔ درست:') || '';
      const list = EP.Store.mistakes();
      list.unshift({ wrong, right, at: EP.today(), note: '' });
      EP.Store.setMistakes(list);
      EP.toast('در دفتر اشتباهات ثبت شد', 'ok');
      if (EP.renderMore) EP.renderMore();
    } else if (a === 'dl') {
      const blob = new Blob([m.content], { type: 'text/markdown' });
      const ael = document.createElement('a');
      ael.href = URL.createObjectURL(blob);
      ael.download = `lesson-${EP.today()}.md`;
      ael.click();
    }
  };

  EP.extractChunks = (text) => {
    const lines = String(text || '').split(/\n/);
    const out = [];
    for (let i = 0; i < lines.length; i++) {
      let en = lines[i].trim()
        .replace(/^[-*•\d.)\]]+\s*/, '')
        .replace(/^\*\*(.+)\*\*$/, '$1')
        .replace(/^["«]|["»]$/g, '');
      // strip markdown table pipes loosely
      if (en.includes('|')) {
        const cells = en.split('|').map(c => c.trim()).filter(Boolean);
        en = cells.find(c => /[A-Za-z]{3,}/.test(c) && !/^[-:]+$/.test(c)) || '';
      }
      if (!en) continue;
      const faCount = (en.match(/[\u0600-\u06FF]/g) || []).length;
      const enCount = (en.match(/[A-Za-z]/g) || []).length;
      if (enCount < 4 || enCount <= faCount) continue;
      if (en.length > 160) continue;
      let fa = '';
      const next = (lines[i + 1] || '').trim();
      if (/[\u0600-\u06FF]/.test(next) && !/[A-Za-z]{6,}/.test(next)) fa = next.replace(/^[-*•]+\s*/, '');
      const codeM = en.match(/\b(M\d{2}-S\d+)\b/);
      out.push({ en: en.replace(/\bM\d{2}-S\d+\b/g, '').trim(), fa, code: codeM ? codeM[1] : '' });
      if (out.length >= 12) break;
    }
    // unique
    const seen = new Set();
    return out.filter(x => {
      const k = x.en.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  };

  EP.makeCard = (en, fa, code) => ({
    id: 'c' + Date.now() + Math.random().toString(36).slice(2, 6),
    en, fa: fa || '', code: code || '',
    box: 0,
    next: EP.today(),
    created: EP.today()
  });

  EP.sendChat = async (text, images) => {
    const content = (text || '').trim();
    if (!content && !(images && images.length)) return;
    const msgs = EP.Store.chat();
    msgs.push({ role: 'user', content: content || '(تصویر)', images: images || [], at: new Date().toLocaleTimeString('fa-IR') });
    EP.Store.setChat(msgs);
    EP.renderChat();
    $('#chatInput').value = '';
    EP.chatImages = [];
    const preview = $('#chatPreview');
    if (preview) preview.remove();

    const thinking = document.createElement('div');
    thinking.className = 'msg ai';
    thinking.id = 'thinking';
    thinking.innerHTML = `<div class="who">مربی</div><div class="body"><span class="spin"></span> در حال فکر…</div>`;
    $('#chatLog').appendChild(thinking);

    try {
      const history = msgs.slice(-12).map(m => ({ role: m.role === 'system' ? 'system' : m.role, content: m.content }));
      const apiMsgs = [{ role: 'system', content: EP.SYSTEM_PROMPT }, ...history.filter(m => m.role !== 'system')];
      // attach images only on last user turn
      const reply = await EP.AI.chat({ messages: apiMsgs, images: images && images.length ? images : null });
      const list = EP.Store.chat();
      list.push({ role: 'assistant', content: reply, at: new Date().toLocaleTimeString('fa-IR') });
      EP.Store.setChat(list);
      EP.Store.touchStreak();
      EP.renderChat();
      EP.renderHome();
    } catch (err) {
      EP.toast(err.message || String(err), 'err');
      const list = EP.Store.chat();
      list.push({ role: 'assistant', content: '⚠️ خطا: ' + (err.message || err), at: new Date().toLocaleTimeString('fa-IR') });
      EP.Store.setChat(list);
      EP.renderChat();
    } finally {
      const th = $('#thinking');
      if (th) th.remove();
    }
  };

  EP.buildStage = () => {
    const id = $('#stageSel').value;
    const stage = EP.STAGES.find(s => s.id === id);
    const extra = EP.STAGE_PROMPTS[id] || '';
    const sit = EP._currentSit;
    let msg = `مرحله: ${stage ? stage.title : id}\n${extra}`;
    if (sit) msg += `\n\nکد موقعیت: ${sit.code}\nموضوع: ${sit.en}\n(${sit.fa})`;
    EP.sendChat(msg);
  };

  EP.openSituation = (sit) => {
    EP._currentSit = sit;
    EP.goto('lesson');
    EP.sendChat(`موقعیت ${sit.code}: ${sit.en} (${sit.fa})\nلطفاً با مرحلهٔ زمینه شروع کن و بعد منتظر من بمان.`);
    if (sit.status === 0) EP.Store.setSitStatus(sit.code, 1);
  };

  /* ---------- speak ---------- */
  EP.Speak = {
    idx: 0,
    media: null,
    chunks: [],
    recs: [],
    loopTimer: null,
    looping: false,

    load() {
      this.chunks = EP.Store.chunks();
      if (!this.chunks.length) this.chunks = EP.DEFAULT_CHUNKS.map(x => ({ ...x }));
      this.idx = Math.min(this.idx, this.chunks.length - 1);
      this.render();
      this.renderRecs();
    },
    cur() { return this.chunks[this.idx] || { en: '…', fa: '…' }; },
    render() {
      const c = this.cur();
      $('#speakEn').textContent = c.en;
      $('#speakFa').textContent = c.fa || '';
      const rate = $('#rate');
      if (rate && !rate._init) {
        rate.value = EP.Store.getSettings().rate || 0.95;
        rate._init = true;
      }
    },
    play(slow) {
      const cfg = EP.Store.getSettings();
      const r = slow ? 0.7 : parseFloat($('#rate').value || cfg.rate || 0.95);
      const acc = $('#accentSel').value || cfg.accent;
      EP.TTS.speak(this.cur().en, { rate: r, lang: acc });
    },
    next(d) {
      this.idx = (this.idx + d + this.chunks.length) % this.chunks.length;
      this.render();
    },
    async toggleRec() {
      if (this.media && this.media.state !== 'inactive') {
        this.media.stop();
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mr = new MediaRecorder(stream);
        const chunks = [];
        mr.ondataavailable = e => chunks.push(e.data);
        mr.onstop = async () => {
          stream.getTracks().forEach(t => t.stop());
          $('#btnRec').classList.remove('live');
          $('#recState').textContent = 'آماده';
          const blob = new Blob(chunks, { type: mr.mimeType || 'audio/webm' });
          const url = URL.createObjectURL(blob);
          const audio = $('#myAudio');
          audio.src = url;
          audio.hidden = false;
          // store meta (not full blob in LS — keep object URL session-only + meta)
          const list = EP.Store.recordings();
          const rec = {
            id: 'r' + Date.now(),
            en: this.cur().en,
            at: new Date().toISOString(),
            // keep base64 small samples only if tiny; else session url
          };
          try {
            if (blob.size < 200000) {
              const buf = await blob.arrayBuffer();
              const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
              rec.data = `data:${blob.type};base64,${b64}`;
            } else {
              rec.sessionUrl = url;
            }
          } catch {
            rec.sessionUrl = url;
          }
          list.unshift(rec);
          EP.Store.setRecordings(list.slice(0, 30));
          this.renderRecs();
          EP.toast('ضبط ذخیره شد', 'ok');
        };
        this.media = mr;
        mr.start();
        $('#btnRec').classList.add('live');
        $('#recState').textContent = 'در حال ضبط…';
      } catch (e) {
        EP.toast('میکروفون در دسترس نیست (https لازم است)', 'err');
      }
    },
    compare() {
      this.play(false);
      const audio = $('#myAudio');
      if (audio && audio.src) {
        setTimeout(() => { try { audio.currentTime = 0; audio.play(); } catch {} }, 1800);
      } else {
        EP.toast('اول صدای خودت را ضبط کن', 'err');
      }
    },
    renderRecs() {
      const list = EP.Store.recordings();
      const el = $('#recList');
      if (!list.length) { el.innerHTML = '<span class="muted">هنوز ضبطی نیست</span>'; return; }
      el.innerHTML = list.map(r => `
        <div class="fcard">
          <div class="en">${r.en}</div>
          <div class="fa">${new Date(r.at).toLocaleString('fa-IR')}</div>
          ${r.data || r.sessionUrl ? `<audio controls src="${r.data || r.sessionUrl}" style="width:100%;margin-top:6px"></audio>` : ''}
        </div>`).join('');
    },
    startLoop() {
      if (this.looping) { this.stopLoop(); return; }
      this.looping = true;
      $('#loopState').textContent = 'روشن';
      $('#btnLoop').textContent = '⏹ توقف';
      const gap = parseInt($('#loopGap').value, 10) || 3;
      const reps = parseInt($('#loopReps').value, 10) || 3;
      let left = reps;
      const tick = () => {
        if (!this.looping) return;
        this.play(false);
        const approx = Math.max(2, (this.cur().en.split(/\s+/).length * 0.45) / (parseFloat($('#rate').value) || 1));
        this.loopTimer = setTimeout(() => {
          if (!this.looping) return;
          left--;
          if (left <= 0) {
            if ($('#loopAuto').checked) {
              this.next(1);
              left = reps;
              this.loopTimer = setTimeout(tick, gap * 1000);
            } else {
              this.stopLoop();
              EP.toast('دورها تمام شد', 'ok');
            }
          } else {
            this.loopTimer = setTimeout(tick, gap * 1000);
          }
        }, (approx + gap) * 1000);
      };
      tick();
    },
    stopLoop() {
      this.looping = false;
      clearTimeout(this.loopTimer);
      $('#loopState').textContent = 'خاموش';
      $('#btnLoop').textContent = '▶ شروع حالت سایه';
      EP.TTS.stop();
    }
  };

  /* ---------- dictionary ---------- */
  EP.Dict = {
    async lookup(q) {
      q = (q || '').trim();
      if (!q) return;
      const out = $('#dictOut');
      out.innerHTML = `<div class="muted"><span class="spin"></span> جست‌وجو…</div>`;
      try {
        const res = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + encodeURIComponent(q));
        if (!res.ok) throw new Error('پیدا نشد');
        const data = await res.json();
        const entry = data[0];
        let html = '';
        const phonetic = entry.phonetic || (entry.phonetics || []).map(p => p.text).filter(Boolean)[0] || '';
        const audio = (entry.phonetics || []).map(p => p.audio).filter(Boolean)[0];
        html += `<div class="wcard">
          <div class="whead">
            <span class="word">${entry.word}</span>
            <span class="ipa">${phonetic}</span>
            ${audio ? `<button class="small" id="btnDictAudio">🔊</button>` : ''}
            <button class="small" id="btnDictTTS">🗣</button>
          </div>`;
        (entry.meanings || []).forEach(m => {
          html += `<div class="pos">${m.partOfSpeech || ''}</div>`;
          (m.definitions || []).slice(0, 4).forEach(d => {
            html += `<div class="def">• ${d.definition}${d.example ? `<div class="ex">“${d.example}”</div>` : ''}</div>`;
          });
        });
        html += `</div>`;
        // free FA translation via myMemory
        try {
          const tr = await fetch('https://api.mymemory.translated.net/get?q=' + encodeURIComponent(q) + '&langpair=en|fa');
          const tj = await tr.json();
          const fa = tj?.responseData?.translatedText;
          if (fa) html += `<div class="wcard"><b>ترجمه فارسی</b><div style="margin-top:6px">${fa}</div></div>`;
        } catch {}
        out.innerHTML = html;
        const ba = $('#btnDictAudio');
        if (ba && audio) ba.onclick = () => { new Audio(audio).play(); };
        const bt = $('#btnDictTTS');
        if (bt) bt.onclick = () => EP.TTS.speak(entry.word);
      } catch (e) {
        out.innerHTML = `<div class="wcard muted">نتیجه‌ای نبود. می‌توانی با AI (دکمه‌های پایین) بپرسی.</div>`;
      }
    },
    async quick(kind) {
      const q = $('#dictQ').value.trim();
      if (!q) return EP.toast('واژه را بنویس', 'err');
      const map = {
        collocation: `Collocations and natural partners for: "${q}". Table with level + example. Bilingual FA notes.`,
        example: `5 natural example sentences for "${q}" with stress mark and FA situational translation.`,
        native: `Give 🟩🟦🟪 native-level rewrites/usages for "${q}" with why.`,
        fa: `Translate to natural Persian (situational, not literal): "${q}". Also give 2 example sentences EN+FA.`
      };
      EP.goto('lesson');
      EP.sendChat(map[kind] || map.example);
    }
  };

  /* ---------- cards / SRS ---------- */
  EP.Cards = {
    render() {
      const cards = EP.Store.cards();
      const due = cards.filter(c => !c.next || c.next <= EP.today());
      $('#cardsDue').innerHTML = `
        <div class="row"><b class="grow">مرور فاصله‌دار</b><span class="pill ${due.length ? 'due' : 'ok'}">${due.length} سررسید</span></div>
        <div class="muted small">باکس‌ها: ۱ → ۳ → ۷ → ۱۴ → ۳۰ روز</div>
        ${due.slice(0, 1).map(c => `
          <div class="fcard" style="margin-top:10px">
            <div class="en" id="dueEn">${c.en}</div>
            <div class="fa" id="dueFa" hidden>${c.fa || '—'}</div>
            <div class="row" style="margin-top:8px">
              <button class="small" id="btnShowFa">نمایش معنی</button>
              <button class="small primary" data-grade="1" data-id="${c.id}">✅ بلدم</button>
              <button class="small" data-grade="0" data-id="${c.id}">🔁 دوباره</button>
            </div>
          </div>`).join('') || '<div class="muted small" style="margin-top:8px">کارت سررسیدی نیست.</div>'}`;
      const show = $('#btnShowFa');
      if (show) show.onclick = () => { $('#dueFa').hidden = false; EP.TTS.speak($('#dueEn').textContent); };
      $$('#cardsDue [data-grade]').forEach(b => b.onclick = () => this.grade(b.dataset.id, +b.dataset.grade));

      $('#cardsList').innerHTML = cards.length
        ? cards.map(c => `
          <div class="fcard">
            <div class="row">
              <div class="en grow">${c.en}</div>
              <span class="pill">${c.code || '—'}</span>
              <span class="pill ${(!c.next || c.next <= EP.today()) ? 'due' : 'ok'}">${c.next || '—'}</span>
            </div>
            <div class="fa">${c.fa || ''}</div>
            <div class="row" style="margin-top:6px">
              <button class="small" data-tts="${c.id}">🔊</button>
              <button class="small" data-del="${c.id}">🗑</button>
            </div>
          </div>`).join('')
        : '<div class="muted">کارتی نیست — از درس‌ها بساز یا دستی اضافه کن.</div>';
      $$('#cardsList [data-tts]').forEach(b => {
        b.onclick = () => {
          const c = EP.Store.cards().find(x => x.id === b.dataset.tts);
          if (c) EP.TTS.speak(c.en);
        };
      });
      $$('#cardsList [data-del]').forEach(b => {
        b.onclick = () => {
          EP.Store.setCards(EP.Store.cards().filter(x => x.id !== b.dataset.del));
          this.render(); EP.renderHome();
        };
      });
    },
    add() {
      const en = $('#cardEn').value.trim();
      const fa = $('#cardFa').value.trim();
      const code = $('#cardCode').value.trim();
      if (!en) return EP.toast('متن انگلیسی لازم است', 'err');
      const cards = EP.Store.cards();
      cards.unshift(EP.makeCard(en, fa, code));
      EP.Store.setCards(cards);
      $('#cardEn').value = ''; $('#cardFa').value = '';
      this.render(); EP.renderHome();
      EP.toast('کارت اضافه شد', 'ok');
    },
    grade(id, ok) {
      const cards = EP.Store.cards();
      const c = cards.find(x => x.id === id);
      if (!c) return;
      if (ok) {
        c.box = Math.min((c.box || 0) + 1, EP.SRS_DAYS.length - 1);
      } else {
        c.box = 0;
      }
      c.next = EP.shiftDate(EP.today(), EP.SRS_DAYS[c.box] || 1);
      EP.Store.setCards(cards);
      EP.Store.touchStreak();
      this.render(); EP.renderHome();
    },
    exportCsv() {
      const cards = EP.Store.cards();
      const rows = [['Front', 'Back', 'Code']].concat(cards.map(c => [c.en, c.fa, c.code]));
      const csv = rows.map(r => r.map(x => `"${String(x || '').replace(/"/g, '""')}"`).join(',')).join('\n');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
      a.download = 'english-partner-anki.csv';
      a.click();
    },
    exportJson() {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([JSON.stringify(EP.Store.cards(), null, 2)], { type: 'application/json' }));
      a.download = 'cards-backup.json';
      a.click();
    }
  };

  /* ---------- settings ---------- */
  EP.Settings = {
    render() {
      const cfg = EP.Store.getSettings();
      const sel = $('#setProvider');
      sel.innerHTML = Object.values(EP.PROVIDERS).map(p =>
        `<option value="${p.id}" ${p.id === cfg.provider ? 'selected' : ''}>${p.name}</option>`
      ).join('');
      $('#setKey').value = cfg.key || '';
      $('#setBase').value = cfg.base || '';
      $('#setModel').value = cfg.model || '';
      $('#setAccent').value = cfg.accent || 'en-US';
      $('#setRate').value = cfg.rate != null ? cfg.rate : 0.95;
      EP.TTS.refresh();
      const d = EP.Store.load();
      $('#storeInfo').textContent = `کارت‌ها: ${(d.cards || []).length} · پیام‌ها: ${(d.chat || []).length} · اشتباهات: ${(d.mistakes || []).length}`;
    },
    saveFromUI() {
      const provider = $('#setProvider').value;
      const prov = EP.PROVIDERS[provider];
      EP.Store.setSettings({
        provider,
        key: $('#setKey').value.trim(),
        base: $('#setBase').value.trim() || prov.base,
        model: $('#setModel').value.trim() || prov.model,
        accent: $('#setAccent').value,
        rate: parseFloat($('#setRate').value) || 0.95,
        voiceURI: $('#setVoice').value
      });
    },
    onProviderChange() {
      const p = EP.PROVIDERS[$('#setProvider').value];
      if (!p) return;
      $('#setBase').value = p.base;
      $('#setModel').value = p.model;
      this.saveFromUI();
    }
  };

  /* ---------- page analyze ---------- */
  EP.Page = {
    files: [],
    async analyze() {
      const mode = $('#pageMode').value;
      const book = $('#bookName').value.trim();
      const input = $('#pageFiles');
      const files = [...(input.files || [])];
      const images = [];
      for (const f of files.slice(0, 4)) {
        images.push(await EP.fileToDataURL(f));
      }
      const prompt = EP.pagePrompt(mode, book);
      EP.goto('lesson');
      await EP.sendChat(prompt + (book ? '' : '\n(کتاب را اگر در تصویر دیدی تشخیص بده)'), images);
    }
  };

  EP.fileToDataURL = (file) => new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

  /* ---------- boot bindings ---------- */
  function bind() {
    // nav
    $$('#navbar button').forEach(b => b.onclick = () => {
      const t = b.dataset.tab;
      if (t === 'more') { EP.goto('more'); if (EP.renderMore) EP.renderMore(); }
      else if (t === 'dict') { EP.goto('dict'); }
      else if (t === 'speak') { EP.Speak.load(); EP.goto('speak'); }
      else if (t === 'video') { if (EP.renderVideo) EP.renderVideo(); EP.goto('video'); }
      else if (t === 'lesson') { EP.renderChat(); EP.goto('lesson'); }
      else if (t === 'page') EP.goto('page');
      else { EP.renderHome(); EP.goto('home'); }
    });
    $$('[data-goto]').forEach(b => b.addEventListener('click', () => {
      const t = b.dataset.goto;
      if (t === 'cards') { EP.Cards.render(); EP.goto('cards'); }
      else if (t === 'prompts') { if (EP.renderPrompts) EP.renderPrompts(); EP.goto('prompts'); }
      else if (t === 'settings') { EP.Settings.render(); EP.goto('settings'); }
      else if (t === 'situations') { if (EP.renderSituations) EP.renderSituations(); EP.goto('situations'); }
      else if (t === 'video') { if (EP.renderVideo) EP.renderVideo(); EP.goto('video'); }
      else { EP.renderHome(); EP.goto(t); }
    }));

    $('#btnSettingsTop').onclick = () => { EP.Settings.render(); EP.goto('settings'); };
    $('#btnStop').onclick = () => EP.TTS.stop();

    // stages
    $('#stageSel').innerHTML = EP.STAGES.map(s =>
      `<option value="${s.id}">${s.icon} ${s.title}</option>`
    ).join('');
    $('#stageSel').onchange = () => {
      const s = EP.STAGES.find(x => x.id === $('#stageSel').value);
      $('#stageHint').textContent = s ? s.hint : '';
    };
    $('#stageSel').dispatchEvent(new Event('change'));
    $('#btnStage').onclick = () => EP.buildStage();
    $('#btnSend').onclick = () => EP.sendChat($('#chatInput').value, EP.chatImages);
    $('#chatInput').addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); EP.sendChat($('#chatInput').value, EP.chatImages); }
    });
    $('#btnClearChat').onclick = () => {
      if (confirm('چت پاک شود؟')) { EP.Store.setChat([]); EP.renderChat(); }
    };
    $('#btnImgChat').onclick = () => $('#chatFile').click();
    $('#chatFile').onchange = async () => {
      const f = $('#chatFile').files[0];
      if (!f) return;
      const url = await EP.fileToDataURL(f);
      EP.chatImages = [url];
      let prev = $('#chatPreview');
      if (!prev) {
        prev = document.createElement('div');
        prev.id = 'chatPreview';
        prev.className = 'preview';
        $('.composer').prepend(prev);
      }
      prev.innerHTML = `<img src="${url}" alt="preview">`;
      EP.toast('عکس آمادهٔ ارسال', 'ok');
    };
    $('#btnSceneBuild').onclick = () => {
      const sit = EP._currentSit;
      EP.sendChat(EP.scenePrompt(sit ? sit.en : ''));
    };
    $('#btnSceneImg').onclick = () => $('#chatFile').click();

    // page
    $('#btnAnalyze').onclick = () => EP.Page.analyze();

    // speak
    $('#btnPlay').onclick = () => EP.Speak.play(false);
    $('#btnSlow').onclick = () => EP.Speak.play(true);
    $('#btnRec').onclick = () => EP.Speak.toggleRec();
    $('#btnCompare').onclick = () => EP.Speak.compare();
    $('#btnPrevChunk').onclick = () => EP.Speak.next(-1);
    $('#btnNextChunk').onclick = () => EP.Speak.next(1);
    $('#btnLoop').onclick = () => EP.Speak.startLoop();
    $('#btnDelRecs').onclick = () => {
      if (confirm('همه ضبط‌ها پاک شوند؟')) { EP.Store.setRecordings([]); EP.Speak.renderRecs(); }
    };
    $('#rate').oninput = () => {
      const cfg = EP.Store.getSettings();
      EP.Store.setSettings({ ...cfg, rate: parseFloat($('#rate').value) });
    };
    $('#accentSel').onchange = () => {
      const cfg = EP.Store.getSettings();
      EP.Store.setSettings({ ...cfg, accent: $('#accentSel').value });
      $('#setAccent').value = $('#accentSel').value;
    };

    // dict
    $('#btnDict').onclick = () => EP.Dict.lookup($('#dictQ').value);
    $('#dictQ').addEventListener('keydown', e => { if (e.key === 'Enter') EP.Dict.lookup($('#dictQ').value); });
    $$('[data-quick]').forEach(b => b.onclick = () => EP.Dict.quick(b.dataset.quick));

    // cards
    $('#btnAddCard').onclick = () => EP.Cards.add();
    $('#btnExportCsv').onclick = () => EP.Cards.exportCsv();
    $('#btnExportJson').onclick = () => EP.Cards.exportJson();

    // journal
    $('#btnJournalSave').onclick = () => {
      const j = EP.Store.journal();
      j[EP.today()] = $('#journal').value;
      EP.Store.setJournal(j);
      EP.Store.touchStreak();
      EP.toast('ژورنال ذخیره شد', 'ok');
      EP.renderHome();
    };
    $('#btnJournalHistory').onclick = () => {
      const j = EP.Store.journal();
      const keys = Object.keys(j).sort().reverse().slice(0, 10);
      $('#journalHist').innerHTML = keys.length
        ? keys.map(k => `<div style="margin:6px 0"><b>${k}</b><pre style="white-space:pre-wrap;margin:4px 0;direction:ltr;text-align:left;font-size:12px">${j[k]}</pre></div>`).join('')
        : 'سابقه‌ای نیست';
    };
    $('#btnJournalExport').onclick = () => {
      const j = EP.Store.journal();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([JSON.stringify(j, null, 2)], { type: 'application/json' }));
      a.download = 'journal.json';
      a.click();
    };

    // settings
    $('#setProvider').onchange = () => EP.Settings.onProviderChange();
    ['setKey', 'setBase', 'setModel', 'setAccent', 'setRate', 'setVoice'].forEach(id => {
      const el = $('#' + id);
      if (el) el.addEventListener('change', () => EP.Settings.saveFromUI());
      if (el) el.addEventListener('blur', () => EP.Settings.saveFromUI());
    });
    $('#btnTest').onclick = async () => {
      EP.Settings.saveFromUI();
      $('#testOut').innerHTML = '<span class="spin"></span> تست…';
      try {
        const r = await EP.AI.test();
        $('#testOut').textContent = '✅ اتصال برقرار: ' + r.slice(0, 80);
        EP.toast('اتصال OK', 'ok');
      } catch (e) {
        $('#testOut').textContent = '❌ ' + e.message;
        EP.toast(e.message, 'err');
      }
    };
    $('#btnBackup').onclick = () => {
      const data = EP.Store.load();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
      a.download = `ep-backup-${EP.today()}.json`;
      a.click();
    };
    $('#btnRestore').onclick = () => $('#restoreFile').click();
    $('#restoreFile').onchange = async () => {
      const f = $('#restoreFile').files[0];
      if (!f) return;
      try {
        const text = await f.text();
        const data = JSON.parse(text);
        localStorage.setItem(STORE_KEY, JSON.stringify(data));
        EP.toast('بازگردانی شد', 'ok');
        location.reload();
      } catch (e) {
        EP.toast('فایل نامعتبر', 'err');
      }
    };
    $('#btnWipe').onclick = () => {
      if (confirm('همه داده‌های محلی پاک شود؟')) {
        localStorage.removeItem(STORE_KEY);
        location.reload();
      }
    };

    // network badge
    const badge = $('#netBadge');
    const syncNet = () => {
      const on = navigator.onLine;
      badge.textContent = on ? 'آنلاین' : 'آفلاین';
      badge.className = 'badge ' + (on ? 'on' : 'off');
    };
    window.addEventListener('online', syncNet);
    window.addEventListener('offline', syncNet);
    syncNet();

    // SW
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    bind();
    EP.Speak.load();
    EP.renderHome();
    EP.renderChat();
    EP.Settings.render();
    // expose for extra.js
    window.EP = EP;
    document.dispatchEvent(new Event('ep-ready'));
  });
})();
