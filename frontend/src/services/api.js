/**
 * Frontend API Service with Resilient Offline Fallback
 * Connects to Backend (PostgreSQL/Supabase or Local JSON DB) when available, or falls back to LocalStorage
 */

import {
  STATIC_PASSAGES,
  STATIC_VOCAB,
  STATIC_SENTENCES,
  STATIC_BLANKS,
  STATIC_PLACEMENT_TEST,
  STATIC_READINGS,
  STATIC_GRAMMAR,
  STATIC_IRREGULAR_VERBS,
  STATIC_SPEAKING
} from '../data/staticData';

const BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : '';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}/api${endpoint}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Lỗi API (${res.status})`);
    }
    return await res.json();
  } catch {
    return null;
  }
}

export const api = {
  async checkHealth() {
    return await request('/health');
  },

  async getDashboard() {
    const res = await request('/progress/dashboard');
    if (res && res.success) return res.data;

    try {
      const savedStats = JSON.parse(localStorage.getItem('elg_stats') || '{}');
      const savedNotebook = JSON.parse(localStorage.getItem('elg_notebook') || '{}');
      const today = new Date().toISOString().split('T')[0];

      const days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(d.toISOString().split('T')[0]);
      }

      // Compute streak locally
      let streak = 0;
      const checkDate = new Date();
      const todayHasPoints = ((savedStats.days && savedStats.days[today]) || 0) > 0;
      if (!todayHasPoints) {
        checkDate.setDate(checkDate.getDate() - 1);
      }
      while (true) {
        const dStr = checkDate.toISOString().split('T')[0];
        if (((savedStats.days && savedStats.days[dStr]) || 0) > 0) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      return {
        stats: {
          total: savedStats.total || 0,
          streak: Math.max(streak, savedStats.streak || 0),
          dailyGoal: 50,
          level: 'B1',
          todayPoints: (savedStats.days && savedStats.days[today]) || 0,
          wordsToReview: (savedNotebook.words || []).length
        },
        history: days.map(d => ({ date: d, points: (savedStats.days && savedStats.days[d]) || 0 })),
        modes: savedStats.modes || {}
      };
    } catch {
      return null;
    }
  },

  async recordPoints(points, mode, isCorrect) {
    const res = await request('/progress/record', {
      method: 'POST',
      body: JSON.stringify({ points, mode, isCorrect })
    });
    if (res && res.success) return res.data;

    try {
      const stats = JSON.parse(localStorage.getItem('elg_stats') || '{"modes":{},"days":{},"total":0,"streak":0}');
      const today = new Date().toISOString().split('T')[0];
      stats.days[today] = (stats.days[today] || 0) + points;
      stats.total = (stats.total || 0) + points;

      if (mode) {
        if (!stats.modes[mode]) stats.modes[mode] = { r: 0, t: 0 };
        stats.modes[mode].t++;
        if (isCorrect) stats.modes[mode].r++;
      }

      localStorage.setItem('elg_stats', JSON.stringify(stats));
      return await this.getDashboard();
    } catch {
      return null;
    }
  },

  async getPassages(level, range) {
    const res = await request(`/exercises/passages?level=${level}&range=${range}`);
    if (res && res.success) return res.data;
    return STATIC_PASSAGES;
  },

  async getVocab(level, range, count = 10) {
    const res = await request(`/exercises/vocab?level=${level}&range=${range}&count=${count}`);
    if (res && res.success && res.data?.length) return res.data;

    const words = STATIC_VOCAB[level] || STATIC_VOCAB.B1;
    return [...words].sort(() => Math.random() - 0.5).slice(0, count);
  },

  async getSentences(level, range, count = 10) {
    const res = await request(`/exercises/sentences?level=${level}&range=${range}&count=${count}`);
    if (res && res.success) return res.data;

    const sents = STATIC_SENTENCES[level] || STATIC_SENTENCES.B1;
    return [...sents].sort(() => Math.random() - 0.5).slice(0, count);
  },

  async getBlanks(level, range, count = 10) {
    const res = await request(`/exercises/blanks?level=${level}&range=${range}&count=${count}`);
    if (res && res.success) return res.data;

    const blanks = STATIC_BLANKS[level] || STATIC_BLANKS.B1;
    return [...blanks].sort(() => Math.random() - 0.5).slice(0, count);
  },

  async getReadings(level) {
    const res = await request(`/exercises/readings?level=${level}`);
    if (res && res.success) return res.data;
    return STATIC_READINGS;
  },

  async getGrammar() {
    const res = await request('/exercises/grammar');
    if (res && res.success) return res.data;
    return { grammar: STATIC_GRAMMAR, irregularVerbs: STATIC_IRREGULAR_VERBS };
  },

  async getSpeaking(level) {
    const res = await request(`/exercises/speaking?level=${level}`);
    if (res && res.success) return res.data;
    return STATIC_SPEAKING[level] || STATIC_SPEAKING.B1;
  },

  async getPlacementTest() {
    const res = await request('/exercises/placement-test');
    if (res && res.success) return res.data;
    return STATIC_PLACEMENT_TEST.map(item => ({
      id: item.id,
      lv: item.lv,
      q: item.q,
      options: [...item.o].sort(() => Math.random() - 0.5),
      correct: item.o[0]
    }));
  },

  async getNotebookWords() {
    const res = await request('/notebook/words');
    if (res && res.success) return res.data;
    try {
      const nb = JSON.parse(localStorage.getItem('elg_notebook') || '{}');
      return nb.words || [];
    } catch {
      return [];
    }
  },

  async addNotebookWord(word) {
    const res = await request('/notebook/words', {
      method: 'POST',
      body: JSON.stringify({ word })
    });
    if (res && res.success) return res.data;

    const nb = JSON.parse(localStorage.getItem('elg_notebook') || '{"words":[],"notes":[]}');
    const existingIdx = nb.words.findIndex(w => w.en.toLowerCase() === word.en.toLowerCase());
    if (existingIdx === -1) {
      nb.words.unshift({
        id: Date.now(),
        mastery: word.mastery ?? 0,
        lastReviewed: new Date().toISOString().split('T')[0],
        ...word
      });
    } else if (word.mastery !== undefined) {
      nb.words[existingIdx] = {
        ...nb.words[existingIdx],
        ...word,
        lastReviewed: new Date().toISOString().split('T')[0]
      };
    }
    localStorage.setItem('elg_notebook', JSON.stringify(nb));
    return nb.words;
  },

  async updateWordMastery(en, mastery) {
    const nb = JSON.parse(localStorage.getItem('elg_notebook') || '{"words":[],"notes":[]}');
    nb.words = nb.words.map(w =>
      w.en.toLowerCase() === en.toLowerCase()
        ? { ...w, mastery: Math.max(0, Math.min(3, mastery)), lastReviewed: new Date().toISOString().split('T')[0] }
        : w
    );
    localStorage.setItem('elg_notebook', JSON.stringify(nb));
    return nb.words;
  },

  async removeNotebookWord(en) {
    const res = await request('/notebook/words', {
      method: 'DELETE',
      body: JSON.stringify({ en })
    });
    if (res && res.success) return res.data;

    const nb = JSON.parse(localStorage.getItem('elg_notebook') || '{"words":[],"notes":[]}');
    nb.words = nb.words.filter(w => w.en.toLowerCase() !== en.toLowerCase());
    localStorage.setItem('elg_notebook', JSON.stringify(nb));
    return nb.words;
  },

  async getNotebookNotes() {
    const res = await request('/notebook/notes');
    if (res && res.success) return res.data;
    try {
      const nb = JSON.parse(localStorage.getItem('elg_notebook') || '{}');
      return nb.notes || [];
    } catch {
      return [];
    }
  },

  async addNotebookNote(note) {
    const res = await request('/notebook/notes', {
      method: 'POST',
      body: JSON.stringify({ note })
    });
    if (res && res.success) return res.data;

    const nb = JSON.parse(localStorage.getItem('elg_notebook') || '{"words":[],"notes":[]}');
    nb.notes.unshift({ id: Date.now(), ...note, date: new Date().toISOString().split('T')[0] });
    localStorage.setItem('elg_notebook', JSON.stringify(nb));
    return nb.notes;
  }
};
