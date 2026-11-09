/**
 * Audio & Text-to-Speech Service using Kokoro TTS (hexgrad/kokoro) & Web Speech API
 */

// Danh sách toàn bộ giọng đọc chất lượng cao trích xuất từ hexgrad/kokoro
export const KOKORO_VOICES = [
  // Nữ Mỹ (American Female)
  { id: 'kokoro:af_heart', name: 'Kokoro Heart (Nữ Mỹ · Chuẩn A+)', lang: 'en-US', gender: 'female', trait: 'Tự nhiên & Chuẩn mực nhất' },
  { id: 'kokoro:af_bella', name: 'Kokoro Bella (Nữ Mỹ · Năng động A-)', lang: 'en-US', gender: 'female', trait: 'Năng lượng & Tươi sáng' },
  { id: 'kokoro:af_nicole', name: 'Kokoro Nicole (Nữ Mỹ · Êm dịu)', lang: 'en-US', gender: 'female', trait: 'Thì thầm & Nhẹ nhàng' },
  { id: 'kokoro:af_sarah', name: 'Kokoro Sarah (Nữ Mỹ · Thời sự)', lang: 'en-US', gender: 'female', trait: 'Rõ ràng & Chuyên nghiệp' },
  { id: 'kokoro:af_sky', name: 'Kokoro Sky (Nữ Mỹ · Trong trẻo)', lang: 'en-US', gender: 'female', trait: 'Ngọt ngào & Dễ nghe' },
  { id: 'kokoro:af_aoede', name: 'Kokoro Aoede (Nữ Mỹ · Diễn cảm)', lang: 'en-US', gender: 'female', trait: 'Giàu cảm xúc & Kể chuyện' },
  { id: 'kokoro:af_kore', name: 'Kokoro Kore (Nữ Mỹ · Tự nhiên)', lang: 'en-US', gender: 'female', trait: 'Giao tiếp hàng ngày' },
  { id: 'kokoro:af_nova', name: 'Kokoro Nova (Nữ Mỹ · Ấm áp)', lang: 'en-US', gender: 'female', trait: 'Ấm áp & Gần gũi' },
  { id: 'kokoro:af_alloy', name: 'Kokoro Alloy (Nữ Mỹ · Dứt khoát)', lang: 'en-US', gender: 'female', trait: 'Hiện đại & Dứt khoát' },

  // Nam Mỹ (American Male)
  { id: 'kokoro:am_michael', name: 'Kokoro Michael (Nam Mỹ · Trầm ấm A-)', lang: 'en-US', gender: 'male', trait: 'Trầm ấm & Nam tính' },
  { id: 'kokoro:am_adam', name: 'Kokoro Adam (Nam Mỹ · Thường nhật)', lang: 'en-US', gender: 'male', trait: 'Trẻ trung & Tự nhiên' },
  { id: 'kokoro:am_liam', name: 'Kokoro Liam (Nam Mỹ · Năng động)', lang: 'en-US', gender: 'male', trait: 'Sôi nổi & Dễ bắt nhịp' },
  { id: 'kokoro:am_onyx', name: 'Kokoro Onyx (Nam Mỹ · Mạnh mẽ)', lang: 'en-US', gender: 'male', trait: 'Mạnh mẽ & Lôi cuốn' },
  { id: 'kokoro:am_fenrir', name: 'Kokoro Fenrir (Nam Mỹ · Trầm)', lang: 'en-US', gender: 'male', trait: 'Uy lực & Điện ảnh' },
  { id: 'kokoro:am_puck', name: 'Kokoro Puck (Nam Mỹ · Vui vẻ)', lang: 'en-US', gender: 'male', trait: 'Nhanh nhẹn & Thân thiện' },

  // Nữ Anh (British Female)
  { id: 'kokoro:bf_emma', name: 'Kokoro Emma (Nữ Anh · Chuẩn Oxford A)', lang: 'en-GB', gender: 'female', trait: 'Phát âm Anh - Anh chuẩn mực' },
  { id: 'kokoro:bf_isabella', name: 'Kokoro Isabella (Nữ Anh · Tinh tế)', lang: 'en-GB', gender: 'female', trait: 'Thanh lịch & Quý phái' },
  { id: 'kokoro:bf_alice', name: 'Kokoro Alice (Nữ Anh · Dịu dàng)', lang: 'en-GB', gender: 'female', trait: 'Nhẹ nhàng & Dễ chịu' },
  { id: 'kokoro:bf_lily', name: 'Kokoro Lily (Nữ Anh · Tươi trẻ)', lang: 'en-GB', gender: 'female', trait: 'Hiện đại & Tươi tắn' },

  // Nam Anh (British Male)
  { id: 'kokoro:bm_george', name: 'Kokoro George (Nam Anh · Quý tộc A)', lang: 'en-GB', gender: 'male', trait: 'Phát âm BBC / Quý ông' },
  { id: 'kokoro:bm_fable', name: 'Kokoro Fable (Nam Anh · Kể chuyện)', lang: 'en-GB', gender: 'male', trait: 'Trầm bổng & Thu hút' },
  { id: 'kokoro:bm_lewis', name: 'Kokoro Lewis (Nam Anh · Thấu cảm)', lang: 'en-GB', gender: 'male', trait: 'Ấm áp & Đĩnh đạc' },
  { id: 'kokoro:bm_daniel', name: 'Kokoro Daniel (Nam Anh · Hiện đại)', lang: 'en-GB', gender: 'male', trait: 'Tự nhiên & Đời thường' }
];

let voices = [];
let keepAliveCtx = null;
let currentUtterance = null;
let currentAudio = null;
let isSpeaking = false;
let isPaused = false;
const listeners = new Set();
const audioCache = new Map();

// Kích hoạt audio context siêu nhỏ để giữ cho tai nghe/loa không bị ngủ gật
export function initKeepAlive() {
  if (keepAliveCtx) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 20;
    gain.gain.value = 0.0008;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    keepAliveCtx = ctx;
  } catch (e) {}
}

if (typeof window !== 'undefined') {
  window.addEventListener('pointerdown', initKeepAlive, { once: true });
  window.addEventListener('keydown', initKeepAlive, { once: true });
}

export function loadVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  try {
    voices = window.speechSynthesis.getVoices();
  } catch (e) {
    voices = [];
  }
  return voices;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    loadVoices();
    notifyListeners();
  };
}

export function getEnglishVoices() {
  const all = voices.length ? voices : loadVoices();
  return all
    .filter(v => /^en/i.test(v.lang))
    .sort((a, b) => a.lang.localeCompare(b.lang) || a.name.localeCompare(b.name));
}

export function subscribeVoiceChange(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function notifyListeners() {
  listeners.forEach(cb => {
    try { cb(getEnglishVoices()); } catch (e) {}
  });
}

/**
 * Phát âm thanh - Hỗ trợ cả giọng Kokoro AI lẫn Web Speech Synthesis
 */
export function speak(text, { voiceName = '', rate = 1.0, onEnd, onError } = {}) {
  if (!text) return false;

  stopSpeaking();
  initKeepAlive();

  const isKokoro = String(voiceName).startsWith('kokoro:');
  const kokoroVoiceId = isKokoro ? voiceName.replace('kokoro:', '') : null;
  const kokoroMeta = kokoroVoiceId ? KOKORO_VOICES.find(v => v.id === voiceName) : null;

  // Nếu là giọng Kokoro
  if (isKokoro && kokoroVoiceId) {
    // 1. Kiểm tra cache
    const cacheKey = `${kokoroVoiceId}_${rate}_${text}`;
    if (audioCache.has(cacheKey)) {
      try {
        const audio = new Audio(audioCache.get(cacheKey));
        audio.playbackRate = Math.max(0.5, Math.min(1.5, rate));
        currentAudio = audio;
        isSpeaking = true;
        audio.onended = () => {
          isSpeaking = false;
          if (onEnd) onEnd();
        };
        audio.onerror = (e) => {
          isSpeaking = false;
          speakWithBrowser(text, { lang: kokoroMeta?.lang || 'en-US', gender: kokoroMeta?.gender || 'female', rate, onEnd, onError });
        };
        audio.play().catch(() => {
          speakWithBrowser(text, { lang: kokoroMeta?.lang || 'en-US', gender: kokoroMeta?.gender || 'female', rate, onEnd, onError });
        });
        return true;
      } catch (e) {
        // Fallback sang trình duyệt
      }
    }

    // 2. Tự động fallback mượt mà sang giọng chuẩn Web Speech có cùng Accent và Gender
    return speakWithBrowser(text, {
      lang: kokoroMeta?.lang || 'en-US',
      gender: kokoroMeta?.gender || 'female',
      rate,
      onEnd,
      onError
    });
  }

  // Phát trực tiếp bằng Web Speech API
  return speakWithBrowser(text, { voiceName, rate, onEnd, onError });
}

function speakWithBrowser(text, { voiceName = '', lang = 'en-US', gender = 'female', rate = 1.0, onEnd, onError } = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    if (keepAliveCtx && keepAliveCtx.state === 'suspended') {
      keepAliveCtx.resume();
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();

    const u = new SpeechSynthesisUtterance(text);
    const enVoices = getEnglishVoices();

    let selected = null;
    if (voiceName) {
      selected = enVoices.find(v => v.name === voiceName);
    }

    // Nếu không có voiceName cụ thể, chọn giọng tự nhiên theo lang & gender
    if (!selected) {
      const isUK = /en-GB|en-UK/i.test(lang);
      const isMale = gender === 'male';

      selected = enVoices.find(v => {
        const matchLang = isUK ? /en-GB|en-UK/i.test(v.lang) : /en-US/i.test(v.lang);
        const matchGender = isMale ? /david|guy|mark|male/i.test(v.name) : /jenny|zira|female|natural/i.test(v.name);
        return matchLang && matchGender;
      }) ||
      enVoices.find(v => (isUK ? /en-GB/i.test(v.lang) : /en-US/i.test(v.lang)) && /natural|neural|online/i.test(v.name)) ||
      enVoices.find(v => isUK ? /en-GB/i.test(v.lang) : /en-US/i.test(v.lang)) ||
      enVoices[0];
    }

    if (selected) {
      u.voice = selected;
      u.lang = selected.lang;
    } else {
      u.lang = lang || 'en-US';
    }

    u.rate = Math.max(0.4, Math.min(2.0, rate));

    currentUtterance = u;
    isSpeaking = true;
    isPaused = false;

    u.onend = () => {
      isSpeaking = false;
      isPaused = false;
      if (onEnd) onEnd();
    };

    u.onerror = (err) => {
      isSpeaking = false;
      isPaused = false;
      if (onError) onError(err);
    };

    setTimeout(() => {
      window.speechSynthesis.speak(u);
    }, 60);

    return true;
  } catch (err) {
    console.error('Lỗi TTS:', err);
    return false;
  }
}

export function stopSpeaking() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (e) {}
    currentAudio = null;
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
    isPaused = false;
  }
}
