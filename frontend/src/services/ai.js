/**
 * Direct Client-Side AI Engine supporting all 17 providers and Custom URL & Model
 */

export const POPULAR_ENDPOINTS = [
  { name: 'OpenAI', url: 'https://api.openai.com/v1', defaultModel: 'gpt-4o-mini' },
  { name: 'Groq (Miễn phí)', url: 'https://api.groq.com/openai/v1', defaultModel: 'llama-3.3-70b-versatile' },
  { name: 'DeepSeek (Giá rẻ)', url: 'https://api.deepseek.com/v1', defaultModel: 'deepseek-chat' },
  { name: 'OpenRouter (Đa dạng)', url: 'https://openrouter.ai/api/v1', defaultModel: 'openai/gpt-4o-mini' },
  { name: 'Cerebras (Siêu tốc)', url: 'https://api.cerebras.ai/v1', defaultModel: 'llama-3.3-70b' },
  { name: 'Mistral AI', url: 'https://api.mistral.ai/v1', defaultModel: 'mistral-small-latest' },
  { name: 'GitHub Models', url: 'https://models.github.ai/inference', defaultModel: 'openai/gpt-4o-mini' },
  { name: 'Ollama (Máy bạn)', url: 'http://localhost:11434/v1', defaultModel: 'llama3.2' },
  { name: 'LM Studio (Máy bạn)', url: 'http://localhost:1234/v1', defaultModel: 'local-model' },
  { name: 'CKEY.VN (VND)', url: 'https://api.xah.io/v1', defaultModel: 'deepseek-v4.1-flash' }
];

export const POPULAR_MODELS = [
  'gpt-4o',
  'gpt-4o-mini',
  'gpt-4.1-mini',
  'deepseek-chat',
  'deepseek-reasoner',
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-2.5-flash-lite',
  'claude-3-5-sonnet-20241022',
  'claude-3-5-haiku-20241022',
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'meta-llama/llama-3.3-70b-instruct:free',
  'qwen-2.5-72b-instruct',
  'qwen2.5',
  'mistral-small-latest'
];

export const AI_PROVIDERS = {
  custom: {
    name: 'Tùy chỉnh (Tự điền URL & Model tùy ý)',
    group: 'Tùy chỉnh linh hoạt',
    url: '',
    models: ['gpt-4o-mini', 'gpt-4o', 'deepseek-chat', 'claude-3-5-sonnet-20241022', 'llama-3.3-70b-versatile'],
    noKey: false,
    editUrl: true,
    hint: 'Nhập Base URL của bất kỳ dịch vụ nào tương thích OpenAI (OpenKey, OneAPI, Cloudflare AI Gateway, proxy riêng, vLLM, Ollama...).'
  },
  gemini: {
    name: 'Google Gemini',
    group: 'Có gói miễn phí',
    models: ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.5-pro'],
    hint: 'Có gói miễn phí, lấy key tại aistudio.google.com.'
  },
  groq: {
    name: 'Groq',
    group: 'Có gói miễn phí',
    url: 'https://api.groq.com/openai/v1',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'openai/gpt-oss-120b'],
    hint: 'Miễn phí, rất nhanh. Lấy key tại console.groq.com/keys.'
  },
  cerebras: {
    name: 'Cerebras',
    group: 'Có gói miễn phí',
    url: 'https://api.cerebras.ai/v1',
    models: ['llama-3.3-70b', 'llama3.1-8b', 'gpt-oss-120b'],
    hint: 'Có gói miễn phí. Lấy key tại cloud.cerebras.ai.'
  },
  mistral: {
    name: 'Mistral AI',
    group: 'Có gói miễn phí',
    url: 'https://api.mistral.ai/v1',
    models: ['mistral-small-latest', 'mistral-large-latest', 'open-mistral-nemo'],
    hint: 'Gói Experiment miễn phí. Lấy key tại console.mistral.ai.'
  },
  github: {
    name: 'GitHub Models',
    group: 'Có gói miễn phí',
    url: 'https://models.github.ai/inference',
    models: ['openai/gpt-4.1-mini', 'openai/gpt-4o-mini', 'meta/Llama-3.3-70B-Instruct'],
    hint: 'Miễn phí với tài khoản GitHub. Dùng Personal Access Token có quyền models:read.'
  },
  openrouter: {
    name: 'OpenRouter',
    group: 'Có gói miễn phí',
    url: 'https://openrouter.ai/api/v1',
    models: ['openai/gpt-4o-mini', 'google/gemini-2.5-flash', 'meta-llama/llama-3.3-70b-instruct:free', 'deepseek/deepseek-chat-v3-0324:free'],
    hint: 'Một key dùng được hàng trăm model, có model đuôi :free. Lấy key tại openrouter.ai/keys.'
  },
  openai: {
    name: 'OpenAI',
    group: 'Trả phí',
    url: 'https://api.openai.com/v1',
    models: ['gpt-4o-mini', 'gpt-4.1-mini', 'gpt-4o'],
    hint: 'Trả phí. Lấy key tại platform.openai.com/api-keys.'
  },
  anthropic: {
    name: 'Anthropic Claude',
    group: 'Trả phí',
    models: ['claude-haiku-5-5', 'claude-sonnet-5-5', 'claude-opus-5-5'],
    hint: 'Trả phí. Lấy key tại console.anthropic.com.'
  },
  ckey: {
    name: 'CKEY (ckey.vn)',
    group: 'Trả phí',
    url: 'https://api.xah.io/v1',
    models: ['deepseek-v4.1-flash'],
    hint: 'Trả phí bằng VND. Đăng nhập ckey.vn, lấy API key ở trang Profile.'
  },
  deepseek: {
    name: 'DeepSeek',
    group: 'Trả phí',
    url: 'https://api.deepseek.com/v1',
    models: ['deepseek-chat', 'deepseek-reasoner'],
    hint: 'Giá rẻ. Lấy key tại platform.deepseek.com.'
  },
  xai: {
    name: 'xAI Grok',
    group: 'Trả phí',
    url: 'https://api.x.ai/v1',
    models: ['grok-3-mini', 'grok-3'],
    hint: 'Trả phí. Lấy key tại console.x.ai.'
  },
  together: {
    name: 'Together AI',
    group: 'Trả phí',
    url: 'https://api.together.xyz/v1',
    models: ['meta-llama/Llama-3.3-70B-Instruct-Turbo', 'Qwen/Qwen2.5-72B-Instruct-Turbo'],
    hint: 'Trả phí, nhiều model mã nguồn mở. Lấy key tại api.together.ai.'
  },
  fireworks: {
    name: 'Fireworks AI',
    group: 'Trả phí',
    url: 'https://api.fireworks.ai/inference/v1',
    models: ['accounts/fireworks/models/llama-v3p3-70b-instruct'],
    hint: 'Trả phí. Lấy key tại fireworks.ai.'
  },
  perplexity: {
    name: 'Perplexity',
    group: 'Trả phí',
    url: 'https://api.perplexity.ai',
    models: ['sonar', 'sonar-pro'],
    hint: 'Trả phí. Lấy key tại perplexity.ai/settings/api.'
  },
  ollama: {
    name: 'Ollama (Máy của bạn)',
    group: 'Chạy trên máy / bên ngoài',
    url: 'http://localhost:11434/v1',
    models: ['llama3.2', 'qwen2.5', 'gemma3'],
    noKey: true,
    editUrl: true,
    hint: "Chạy AI trên máy, không cần key. Cài ollama.com, chạy 'ollama pull llama3.2'."
  },
  lmstudio: {
    name: 'LM Studio (Máy của bạn)',
    group: 'Chạy trên máy / bên ngoài',
    url: 'http://localhost:1234/v1',
    models: ['local-model'],
    noKey: true,
    editUrl: true,
    hint: 'Mở LM Studio > Developer > Start Server, bật CORS. Không cần key.'
  }
};

/**
 * Kiểm tra xem AI đã được cấu hình đủ điều kiện để gọi hay chưa
 */
export function isAIConfigured(aiConfig) {
  if (!aiConfig) return false;
  if (aiConfig.key && aiConfig.key.trim().length > 0) return true;
  if (aiConfig.url && aiConfig.url.trim().length > 0) return true;
  if (aiConfig.provider === 'ollama' || aiConfig.provider === 'lmstudio') return true;
  return false;
}

export async function callAI(messages, system = '', config = {}) {
  const provider = config.provider || 'gemini';
  const prov = AI_PROVIDERS[provider] || AI_PROVIDERS.custom || AI_PROVIDERS.gemini;
  const model = (config.model || prov.models?.[0] || 'gpt-4o-mini').trim();
  const key = (config.key || '').trim();
  const customUrl = (config.url || '').trim();

  const isCustomUrl = !!customUrl;

  // Nếu nhà cung cấp yêu cầu key và không có customUrl và không có key
  if (!prov.noKey && !key && !isCustomUrl && provider !== 'custom') {
    throw new Error(`Chưa có API key cho ${prov.name}. Vào Cài đặt > Kết nối AI để thêm.`);
  }

  // 1. Google Gemini native (chỉ dùng nếu không có custom URL)
  if (provider === 'gemini' && !isCustomUrl) {
    if (!key) throw new Error('Chưa có API key cho Gemini. Hãy nhập API key trong Cài đặt.');
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model || 'gemini-2.5-flash')}:generateContent?key=${encodeURIComponent(key)}`;
    const body = {
      contents: messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }))
    };
    if (system) {
      body.systemInstruction = { parts: [{ text: system }] };
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || `Lỗi Gemini API: ${res.status}`);
    return data.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '';
  }

  // 2. Anthropic Claude native (chỉ dùng nếu không có custom URL)
  if (provider === 'anthropic' && !isCustomUrl) {
    if (!key) throw new Error('Chưa có API key cho Anthropic. Hãy nhập API key trong Cài đặt.');
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: model || 'claude-haiku-5-5',
        max_tokens: 1500,
        system: system || undefined,
        messages
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || `Lỗi Anthropic API: ${res.status}`);
    return data.content?.map(c => c.text || '').join('') || '';
  }

  // 3. Toàn bộ các dịch vụ tương thích OpenAI (Custom URL, OpenAI, Groq, DeepSeek, OpenRouter, Cerebras, Ollama, LM Studio, vLLM, Cloudflare AI Gateway...)
  const base = (customUrl || prov.url || '').replace(/\/+$/, '');
  if (!base) {
    throw new Error('Chưa có URL API. Hãy nhập Base URL (VD: https://api.openai.com/v1 hoặc proxy của bạn).');
  }

  let endpoint = base;
  if (!endpoint.endsWith('/chat/completions') && !endpoint.includes(':generateContent')) {
    endpoint = `${base}/chat/completions`;
  }

  const headers = { 'Content-Type': 'application/json' };
  if (key) {
    headers['Authorization'] = `Bearer ${key}`;
  }
  if (provider === 'openrouter' || base.includes('openrouter.ai')) {
    headers['HTTP-Referer'] = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
    headers['X-Title'] = 'English Practice';
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: model || 'gpt-4o-mini',
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

export async function callAIJSON(prompt, systemInstruction = '', config = {}) {
  const system = `${systemInstruction} Always answer with valid JSON only, no markdown codeblocks, no extra explanations.`;
  const raw = await callAI([{ role: 'user', content: prompt }], system, config);
  const match = raw.match(/[\[{][\s\S]*[\]}]/);
  if (!match) throw new Error('AI phản hồi sai định dạng JSON, vui lòng thử lại.');
  return JSON.parse(match[0]);
}
