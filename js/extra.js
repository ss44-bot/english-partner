/* English Partner — situations, video, more, prompts */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  function ready() {
    const EP = window.EP;
    if (!EP) return;

    /* ----- situations map ----- */
    EP.renderSituations = () => {
      const filter = $('#sitFilter')?.value || 'all';
      const jump = $('#sitJump')?.value || '';
      const all = EP.Store.situations();
      const done = all.filter(s => s.status === 2).length;
      $('#sitProgress').textContent = `${done} / ${all.length}`;

      // jump select
      const jumpSel = $('#sitJump');
      if (jumpSel && jumpSel.options.length <= 1) {
        EP.MODULES.forEach(m => {
          const o = document.createElement('option');
          o.value = m.id;
          o.textContent = `${m.id} — ${m.fa}`;
          jumpSel.appendChild(o);
        });
      }

      let list = all;
      if (filter === 'todo') list = all.filter(s => s.status === 0);
      if (filter === 'doing') list = all.filter(s => s.status === 1);
      if (filter === 'done') list = all.filter(s => s.status === 2);
      if (jump) list = list.filter(s => s.module === jump);

      const byMod = {};
      list.forEach(s => {
        (byMod[s.module] = byMod[s.module] || []).push(s);
      });

      const root = $('#sitList');
      root.innerHTML = EP.MODULES.filter(m => byMod[m.id]).map(m => {
        const items = byMod[m.id];
        const d = items.filter(x => x.status === 2).length;
        const pct = Math.round((d / items.length) * 100);
        return `<div class="acc" id="mod-${m.id}">
          <details ${jump === m.id ? 'open' : ''}>
            <summary>
              <span class="codepill">${m.id}</span>
              <span class="grow"><b>${m.fa}</b> <span class="muted small">${m.title}</span></span>
              <span class="mini"><i style="width:${pct}%"></i></span>
              <span class="pill">${d}/${items.length}</span>
            </summary>
            <div>
              ${items.map(s => `
                <div class="sit">
                  <button class="st2 s${s.status}" data-code="${s.code}" title="تغییر وضعیت">${['⬜', '🟡', '🟢'][s.status]}</button>
                  <div class="m">
                    <div class="row" style="margin:0">
                      <span class="codepill">${s.code}</span>
                      <button class="small" data-go="${s.code}">▶</button>
                    </div>
                    <div class="en2">${s.en}</div>
                    <div class="fa2">${s.fa}</div>
                  </div>
                </div>`).join('')}
            </div>
          </details>
        </div>`;
      }).join('') || '<div class="card muted">موردی با این فیلتر نیست</div>';

      root.querySelectorAll('.st2').forEach(b => {
        b.onclick = () => {
          const cur = EP.Store.situations().find(x => x.code === b.dataset.code);
          const next = ((cur?.status || 0) + 1) % 3;
          EP.Store.setSitStatus(b.dataset.code, next);
          EP.renderSituations();
          EP.renderHome();
        };
      });
      root.querySelectorAll('[data-go]').forEach(b => {
        b.onclick = () => {
          const sit = EP.Store.situations().find(x => x.code === b.dataset.go);
          if (sit) EP.openSituation(sit);
        };
      });
    };

    $('#sitFilter')?.addEventListener('change', () => EP.renderSituations());
    $('#sitJump')?.addEventListener('change', () => EP.renderSituations());

    /* ----- video 4-pass ----- */
    EP.renderVideo = () => {
      const sel = $('#videoMod');
      if (sel && !sel._filled) {
        sel.innerHTML = EP.MODULES.map(m =>
          `<option value="${m.id}">${m.id} — ${m.fa}</option>`
        ).join('');
        sel._filled = true;
        sel.onchange = () => EP.renderVideo();
      }
      const mod = EP.MODULES.find(m => m.id === (sel?.value || 'M01')) || EP.MODULES[0];
      const q = (mod.yt || [mod.title]).map(term => {
        const url = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(term);
        return `<a class="ytlink" target="_blank" rel="noopener" href="${url}">🔎 ${term}</a>`;
      }).join('');
      $('#videoSearch').innerHTML = `<b>عبارت‌های جست‌وجو — ${mod.fa}</b><div style="margin-top:8px">${q}</div>`;

      const passes = EP.Store.passes();
      const labels = [
        { t: 'پاس ۱ — تماشا', s: 'فقط ببین، نت‌برداری نکن' },
        { t: 'پاس ۲ — ریویو', s: 'چانک‌ها و تلفظ را علامت بزن' },
        { t: 'پاس ۳ — من در صحنه', s: 'با صدای بلند نقش خودت را بگو' },
        { t: 'پاس ۴ — مقایسه', s: 'با اصل مقایسه کن و اصلاح کن' }
      ];
      $('#passList').innerHTML = labels.map((l, i) => `
        <div class="pass">
          <input type="checkbox" data-pass="${i}" ${passes[i] ? 'checked' : ''} style="width:auto;min-height:auto">
          <div class="t"><b>${l.t}</b><span>${l.s}</span></div>
        </div>`).join('');
      $$('#passList [data-pass]').forEach(cb => {
        cb.onchange = () => {
          const p = EP.Store.passes();
          p[+cb.dataset.pass] = cb.checked;
          EP.Store.setPasses(p);
        };
      });
      $('#passHint').textContent = 'یک ویدیو را در سه روز با این ۴ پاس تمام کن.';

      $('#harvest').value = EP.Store.harvest();
      $('#harvestCount').textContent = String(($('#harvest').value.split('\n').filter(l => l.trim()).length) || 0);

      $('#ytChannels').innerHTML = `<b>کانال‌های پیشنهادی</b><div style="margin-top:8px">${
        EP.YT_CHANNELS.map(c => {
          const url = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(c.q);
          return `<a class="ytlink" target="_blank" rel="noopener" href="${url}">▶ ${c.name}</a>`;
        }).join('')
      }</div>`;
    };

    let vTimer = null, vSec = 0;
    function fmt(s) {
      const m = Math.floor(s / 60), ss = s % 60;
      return String(m).padStart(2, '0') + ':' + String(ss).padStart(2, '0');
    }
    $('#btnVTimer')?.addEventListener('click', () => {
      if (vTimer) {
        clearInterval(vTimer); vTimer = null;
        $('#btnVTimer').textContent = 'ادامه';
        return;
      }
      $('#btnVTimer').textContent = 'توقف';
      vTimer = setInterval(() => {
        vSec++;
        $('#vTimer').textContent = fmt(vSec);
      }, 1000);
    });
    $('#btnVTimerReset')?.addEventListener('click', () => {
      clearInterval(vTimer); vTimer = null; vSec = 0;
      $('#vTimer').textContent = '00:00';
      $('#btnVTimer').textContent = 'شروع';
    });
    $('#btnVideoPrompt')?.addEventListener('click', () => {
      const mod = EP.MODULES.find(m => m.id === $('#videoMod').value);
      EP.goto('lesson');
      EP.sendChat(`موضوع ویدیو/ماژول: ${mod ? mod.title + ' / ' + mod.fa : ''}\n` +
        EP.PROMPT_LIBRARY.find(p => p.id === 'video4').body);
    });
    $('#harvest')?.addEventListener('change', () => {
      EP.Store.setHarvest($('#harvest').value);
      $('#harvestCount').textContent = String($('#harvest').value.split('\n').filter(l => l.trim()).length);
    });
    $('#btnHarvestSpeak')?.addEventListener('click', () => {
      const lines = $('#harvest').value.split('\n').map(l => l.trim()).filter(Boolean)
        .map(en => ({ en, fa: '', code: '' }));
      if (!lines.length) return EP.toast('چانکی نیست', 'err');
      EP.Store.setChunks([...lines, ...EP.Store.chunks()]);
      EP.Speak.idx = 0; EP.Speak.load();
      EP.goto('speak');
      EP.toast('به گفتن اضافه شد', 'ok');
    });
    $('#btnHarvestCards')?.addEventListener('click', () => {
      const lines = $('#harvest').value.split('\n').map(l => l.trim()).filter(Boolean);
      if (!lines.length) return EP.toast('چانکی نیست', 'err');
      const cards = EP.Store.cards();
      lines.forEach(en => cards.unshift(EP.makeCard(en, '', '')));
      EP.Store.setCards(cards);
      EP.toast(`${lines.length} کارت`, 'ok');
    });
    $('#btnHarvestClear')?.addEventListener('click', () => {
      $('#harvest').value = '';
      EP.Store.setHarvest('');
      $('#harvestCount').textContent = '0';
    });

    /* ----- prompts library ----- */
    EP.renderPrompts = () => {
      $('#promptList').innerHTML = EP.PROMPT_LIBRARY.map(p => `
        <div class="card">
          <div class="row"><b class="grow">${p.title}</b>
            <button class="small" data-copy="${p.id}">📋 کپی</button>
            <button class="small primary" data-send="${p.id}">▶ فرستادن</button>
          </div>
          <div class="muted small" style="white-space:pre-wrap">${p.body.slice(0, 180)}${p.body.length > 180 ? '…' : ''}</div>
        </div>`).join('');
      $$('#promptList [data-copy]').forEach(b => {
        b.onclick = async () => {
          const p = EP.PROMPT_LIBRARY.find(x => x.id === b.dataset.copy);
          try { await navigator.clipboard.writeText(p.body); EP.toast('کپی شد', 'ok'); }
          catch { EP.toast('کپی نشد', 'err'); }
        };
      });
      $$('#promptList [data-send]').forEach(b => {
        b.onclick = () => {
          const p = EP.PROMPT_LIBRARY.find(x => x.id === b.dataset.send);
          EP.goto('lesson');
          EP.sendChat(p.body);
        };
      });
    };

    /* ----- more: stats, mistakes, week, coverage ----- */
    EP.renderMore = () => {
      const cards = EP.Store.cards();
      const sits = EP.Store.situations();
      const st = EP.Store.streak();
      const due = cards.filter(c => !c.next || c.next <= EP.today()).length;
      $('#moreStats').innerHTML = `
        <div class="row"><b class="grow">📊 آمار</b></div>
        <div class="grid2">
          <div class="kpi"><b>${st.days || 0}</b><span>روز زنجیره</span></div>
          <div class="kpi"><b>${cards.length}</b><span>کارت</span></div>
          <div class="kpi"><b>${due}</b><span>سررسید</span></div>
          <div class="kpi"><b>${sits.filter(s => s.status === 2).length}</b><span>موقعیت مسلط</span></div>
        </div>`;

      const mistakes = EP.Store.mistakes();
      $('#mistakesCard').innerHTML = `
        <div class="row"><b class="grow">🟥 دفتر اشتباهات</b>
          <button class="small" id="btnAddMist">+</button>
          <button class="small" id="btnClearMist">پاک</button>
        </div>
        ${mistakes.length ? mistakes.slice(0, 20).map((m, i) => `
          <div class="mist">
            <div class="w">❌ ${m.wrong}</div>
            <div class="r">✅ ${m.right || '—'}</div>
            <div class="muted small">${m.at || ''}
              <button class="small" data-dm="${i}" style="float:left">🗑</button>
            </div>
          </div>`).join('') : '<div class="muted small">اشتباهی ثبت نشده. از روی پاسخ مربی «ثبت اشتباه» بزن.</div>'}`;
      $('#btnAddMist')?.addEventListener('click', () => {
        const wrong = prompt('جمله غلط:');
        if (!wrong) return;
        const right = prompt('نسخه درست:') || '';
        const list = EP.Store.mistakes();
        list.unshift({ wrong, right, at: EP.today() });
        EP.Store.setMistakes(list);
        EP.renderMore();
      });
      $('#btnClearMist')?.addEventListener('click', () => {
        if (confirm('همه اشتباهات پاک شوند؟')) { EP.Store.setMistakes([]); EP.renderMore(); }
      });
      $$('#mistakesCard [data-dm]').forEach(b => {
        b.onclick = () => {
          const list = EP.Store.mistakes();
          list.splice(+b.dataset.dm, 1);
          EP.Store.setMistakes(list);
          EP.renderMore();
        };
      });

      $('#weekCard').innerHTML = `
        <div class="row"><b class="grow">🗓 برنامه هفتگی</b></div>
        <table class="tbl"><thead><tr><th>روز</th><th>تمرکز</th></tr></thead>
        <tbody>${EP.WEEK_PLAN.map(w => `<tr><td>${w.icon} ${w.day}</td><td>${w.focus}</td></tr>`).join('')}</tbody></table>`;

      $('#coverageCard').innerHTML = `
        <div class="row"><b class="grow">✅ چک‌لیست خواسته‌های من</b></div>
        <table class="tbl"><thead><tr><th>خواسته</th><th>کجا</th><th></th></tr></thead>
        <tbody>${EP.COVERAGE.map(c =>
          `<tr><td>${c.want}</td><td class="small">${c.where}</td><td>${c.ok ? '✅' : '🔜'}</td></tr>`
        ).join('')}</tbody></table>`;

      // re-bind data-goto inside more (cloned content may need)
      $$('#tab-more [data-goto]').forEach(b => {
        b.onclick = () => {
          const t = b.dataset.goto;
          if (t === 'cards') { EP.Cards.render(); EP.goto('cards'); }
          else if (t === 'prompts') { EP.renderPrompts(); EP.goto('prompts'); }
          else if (t === 'settings') { EP.Settings.render(); EP.goto('settings'); }
          else if (t === 'situations') { EP.renderSituations(); EP.goto('situations'); }
          else if (t === 'video') { EP.renderVideo(); EP.goto('video'); }
          else { EP.renderHome(); EP.goto(t); }
        };
      });
    };

    // initial more partial
    EP.renderMore();
  }

  if (window.EP && window.EP.Store) ready();
  else document.addEventListener('ep-ready', ready);
  document.addEventListener('DOMContentLoaded', () => setTimeout(ready, 0));
})();
