// Controller hỗ trợ gọi AI tập trung trên Backend (nếu muốn proxy hoặc bảo mật API Key trên Server)

const PROVIDER_CONFIG = {
  gemini: {
    endpoint: (model, key) => `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model || 'gemini-2.5-flash')}:generateContent?key=${encodeURIComponent(key)}`
  },
  groq: {
    url: 'https://api.groq.com/openai/v1/chat/completions',
    defaultModel: 'llama-3.3-70b-versatile'
  },
  cerebras: {
    url: 'https://api.cerebras.ai/v1/chat/completions',
    defaultModel: 'llama-3.3-70b'
  },
  openai: {
    url: 'https://api.openai.com/v1/chat/completions',
    defaultModel: 'gpt-4o-mini'
  },
  deepseek: {
    url: 'https://api.deepseek.com/v1/chat/completions',
    defaultModel: 'deepseek-chat'
  }
};

async function executeAI({ provider = 'gemini', model, key, url, messages, system = '' }) {
  const apiKey = (key || process.env[`${provider.toUpperCase()}_API_KEY`] || '').trim();
  const customUrl = (url || '').trim();

  // 1. Google Gemini native
  if (provider === 'gemini' && !customUrl) {
    if (!apiKey) {
      throw new Error(`Chưa có API key cho Gemini.`);
    }
    const targetModel = (model || 'gemini-2.5-flash').trim();
    const body = {
      contents: messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }))
    };
    if (system) {
      body.systemInstruction = { parts: [{ text: system }] };
    }

    const res = await fetch(PROVIDER_CONFIG.gemini.endpoint(targetModel, apiKey), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || `Lỗi Gemini API: ${res.status}`);
    return data.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '';
  }

  // 2. OpenAI-compatible / Custom Base URL
  const cfg = PROVIDER_CONFIG[provider] || PROVIDER_CONFIG.groq;
  const base = (customUrl || cfg.url || '').replace(/\/+$/, '');
  if (!base) {
    throw new Error('Chưa có URL API. Hãy nhập Base URL (VD: https://api.openai.com/v1 hoặc proxy).');
  }

  let endpoint = base;
  if (!endpoint.endsWith('/chat/completions') && !endpoint.includes(':generateContent')) {
    endpoint = `${base}/chat/completions`;
  }

  const targetModel = (model || cfg.defaultModel || 'gpt-4o-mini').trim();
  const headers = { 'Content-Type': 'application/json' };
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: targetModel,
      messages: system ? [{ role: 'system', content: system }, ...messages] : messages
    })
  });

  const txt = await res.text();
  let data;
  try {
    data = JSON.parse(txt);
  } catch {
    throw new Error(`Phản hồi AI không hợp lệ từ ${endpoint}: ${txt.slice(0, 150)}`);
  }

  if (!res.ok) throw new Error(data.error?.message || data.message || `Lỗi AI API: ${res.status}`);
  return data.choices?.[0]?.message?.content || '';
}

exports.chat = async (req, res) => {
  try {
    const { provider = 'gemini', model, key, url, messages, system = '' } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, error: 'Thiếu mảng tin nhắn (messages).' });
    }

    const reply = await executeAI({ provider, model, key, url, messages, system });
    res.json({ success: true, reply });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.gradeTranslation = async (req, res) => {
  try {
    const { provider = 'gemini', model, key, url, vi, studentAnswer, reference, level = 'B1' } = req.body;
    if (!vi || !studentAnswer) {
      return res.status(400).json({ success: false, error: 'Thiếu câu tiếng Việt hoặc bài làm học viên.' });
    }

    const system = `You are an expert English teacher. The learner is Vietnamese, CEFR level ${level}. Always answer with valid JSON only, no markdown codeblocks.`;
    const prompt = `Grade this Vietnamese-to-English translation.
Vietnamese: """${vi}"""
${reference ? `Reference: """${reference}"""` : ''}
Student: """${studentAnswer}"""
Return JSON: {
  "score": 0-100,
  "summary": "1-2 sentence overall comment in Vietnamese",
  "errors": [{"wrong":"the wrong part","fix":"corrected version","why":"explanation in Vietnamese"}],
  "better": "a natural improved English version close to the student's wording",
  "tip": "one tip for next time in Vietnamese"
}`;

    const raw = await executeAI({ provider, model, key, url, messages: [{ role: 'user', content: prompt }], system });
    const match = raw.match(/[\[{][\s\S]*[\]}]/);
    if (!match) throw new Error('AI phản hồi sai định dạng JSON.');
    const result = JSON.parse(match[0]);

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
