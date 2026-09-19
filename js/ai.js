/* English Partner — AI providers (OpenAI-compatible, Gemini, Anthropic) */
window.EP = window.EP || {};

EP.AI = {
  async chat({ messages, images }) {
    const cfg = EP.Store.getSettings();
    if (!cfg.key) throw new Error('کلید API تنظیم نشده. برو تنظیمات.');
    const provider = cfg.provider || 'gemini';
    if (provider === 'gemini') return this._gemini({ messages, images, cfg });
    if (provider === 'anthropic') return this._anthropic({ messages, images, cfg });
    return this._openaiCompat({ messages, images, cfg });
  },

  async test() {
    const reply = await this.chat({
      messages: [
        { role: 'system', content: 'Reply with exactly: OK' },
        { role: 'user', content: 'ping' }
      ]
    });
    return (reply || '').trim();
  },

  _sysUser(messages) {
    const sys = messages.filter(m => m.role === 'system').map(m => m.content).join('\n\n');
    const rest = messages.filter(m => m.role !== 'system');
    return { sys, rest };
  },

  async _openaiCompat({ messages, images, cfg }) {
    const base = (cfg.base || EP.PROVIDERS[cfg.provider]?.base || 'https://api.openai.com/v1').replace(/\/$/, '');
    const model = cfg.model || EP.PROVIDERS[cfg.provider]?.model || 'gpt-4o-mini';
    const bodyMessages = messages.map(m => {
      if (m.role === 'system') return m;
      if (images && images.length && m === messages[messages.length - 1] && m.role === 'user') {
        const parts = [{ type: 'text', text: m.content || '' }];
        images.forEach(img => {
          parts.push({ type: 'image_url', image_url: { url: img } });
        });
        return { role: 'user', content: parts };
      }
      return { role: m.role, content: m.content };
    });
    const res = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cfg.key}`,
        ...(cfg.provider === 'openrouter' ? {
          'HTTP-Referer': location.origin,
          'X-Title': 'English Partner'
        } : {})
      },
      body: JSON.stringify({ model, messages: bodyMessages, temperature: 0.7 })
    });
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      throw new Error(`API ${res.status}: ${t.slice(0, 300)}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  },

  async _gemini({ messages, images, cfg }) {
    const model = cfg.model || 'gemini-2.0-flash';
    const { sys, rest } = this._sysUser(messages);
    const contents = rest.map((m, idx) => {
      const parts = [{ text: m.content || '' }];
      if (images && images.length && idx === rest.length - 1 && m.role === 'user') {
        images.forEach(dataUrl => {
          const mimetype = (dataUrl.match(/^data:([^;]+);/) || [])[1] || 'image/jpeg';
          const b64 = dataUrl.split(',')[1] || '';
          if (b64) parts.push({ inline_data: { mime_type: mimetype, data: b64 } });
        });
      }
      return {
        role: m.role === 'assistant' ? 'model' : 'user',
        parts
      };
    });
    // Gemini needs alternating roles; merge if needed is skipped for simplicity
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(cfg.key)}`;
    const body = {
      contents,
      generationConfig: { temperature: 0.7 }
    };
    if (sys) body.systemInstruction = { parts: [{ text: sys }] };
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      throw new Error(`Gemini ${res.status}: ${t.slice(0, 300)}`);
    }
    const data = await res.json();
    const parts = data.candidates?.[0]?.content?.parts || [];
    return parts.map(p => p.text || '').join('');
  },

  async _anthropic({ messages, images, cfg }) {
    const model = cfg.model || 'claude-3-5-sonnet-latest';
    const { sys, rest } = this._sysUser(messages);
    const bodyMessages = rest.map((m, idx) => {
      if (images && images.length && idx === rest.length - 1 && m.role === 'user') {
        const content = [{ type: 'text', text: m.content || '' }];
        images.forEach(dataUrl => {
          const mimetype = (dataUrl.match(/^data:([^;]+);/) || [])[1] || 'image/jpeg';
          const b64 = dataUrl.split(',')[1] || '';
          if (b64) content.push({ type: 'image', source: { type: 'base64', media_type: mimetype, data: b64 } });
        });
        return { role: 'user', content };
      }
      return { role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content || '' };
    });
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': cfg.key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        system: sys || undefined,
        messages: bodyMessages
      })
    });
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      throw new Error(`Anthropic ${res.status}: ${t.slice(0, 300)}`);
    }
    const data = await res.json();
    return (data.content || []).map(c => c.text || '').join('');
  }
};
