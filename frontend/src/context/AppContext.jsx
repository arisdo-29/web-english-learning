import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { PRESETS } from '../data/staticData';
import { I18N_EN } from '../data/i18n';
import { applyAstryxThemeToDOM, ASTRYX_THEMES } from '../astryx/themes';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') return window.innerWidth >= 1024;
    return true;
  });

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  // Settings with shadcn/ui Pastel theme config
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('elg_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        const validTheme = ASTRYX_THEMES[parsed.astryxTheme] ? parsed.astryxTheme : 'sage';
        return {
          radiusScale: 'standard',
          density: 'default',
          ...parsed,
          astryxTheme: parsed.pastelMigrated ? validTheme : 'sage',
          pastelMigrated: true,
          theme: parsed.pastelMigrated ? (parsed.theme || 'light') : 'light'
        };
      }
    } catch {}
    return {
      level: 'B1',
      range: 'around',
      source: 'builtin',
      topics: ['life', 'study', 'work', 'it'],
      customTopics: [],
      dailyGoal: 50,
      vocabCount: 10,
      vocabType: 'mix',
      timer: 0,
      blankType: 'type',
      strictness: 'normal',
      feedbackLang: 'vi',
      explain: 'short',
      chatCorrection: 'all',
      voice: '',
      rate: 1.0,
      tts: true,
      autoSpeak: false,
      theme: 'light',
      astryxTheme: 'sage', // 'sage' | 'lavender' | 'oat' | 'sky' | 'rose' | 'peach'
      pastelMigrated: true,
      radiusScale: 'standard',
      density: 'default',
      fontSize: 'm',
      uiLang: 'vi',
      hints: true,
      ai: {
        provider: 'gemini',
        model: 'gemini-2.5-flash',
        key: '',
        url: ''
      }
    };
  });

  const [stats, setStats] = useState({
    total: 0,
    streak: 0,
    dailyGoal: 50,
    level: 'B1',
    todayPoints: 0,
    wordsToReview: 0
  });

  const [history7Days, setHistory7Days] = useState([]);
  const [modeStats, setModeStats] = useState({});
  const [notebookWords, setNotebookWords] = useState([]);
  const [notebookNotes, setNotebookNotes] = useState([]);
  const [customPassages, setCustomPassages] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [isPlacementOpen, setIsPlacementOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSpeedChallengeOpen, setIsSpeedChallengeOpen] = useState(false);
  const [speedHighScore, setSpeedHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('elg_speed_high') || '0', 10) || 0;
    } catch {
      return 0;
    }
  });
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [presetOfferLevel, setPresetOfferLevel] = useState(null);

  // Global Pomodoro Study Timer (25 min default)
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);

  const [homeFilter, setHomeFilter] = useState('all');

  // Global keyboard shortcut: Ctrl+K / Cmd+K for Command Palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Pomodoro interval
  useEffect(() => {
    if (!pomodoroRunning) return;
    const id = setInterval(() => {
      setPomodoroSeconds(prev => {
        if (prev <= 1) {
          setPomodoroRunning(false);
          try {
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
          } catch {}
          return 25 * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [pomodoroRunning]);

  const t = (text) => {
    if (!text || typeof text !== 'string') return text;
    if (settings.uiLang === 'en') {
      return I18N_EN[text] || text;
    }
    return text;
  };

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToastMessage({ message: t(message), type, id });
    setTimeout(() => {
      setToastMessage(prev => (prev?.id === id ? null : prev));
    }, 3000);
  };

  // Sync Pastel shadcn/ui theme tokens & font size to document
  useEffect(() => {
    applyAstryxThemeToDOM({
      astryxTheme: settings.astryxTheme || 'sage',
      themeMode: settings.theme || 'light',
      radiusScale: settings.radiusScale || 'standard',
      density: settings.density || 'default'
    });

    const fontSizes = { s: '14px', m: '16px', l: '17.5px', xl: '19px' };
    document.documentElement.style.fontSize = fontSizes[settings.fontSize] || '16px';

    localStorage.setItem('elg_settings', JSON.stringify(settings));
  }, [settings]);

  const refreshData = async () => {
    const health = await api.checkHealth();
    setIsBackendOnline(!!health);

    const dash = await api.getDashboard();
    if (dash) {
      setStats(dash.stats || {});
      setHistory7Days(dash.history || []);
      setModeStats(dash.modes || {});
    }

    const words = await api.getNotebookWords();
    setNotebookWords(words || []);

    const notes = await api.getNotebookNotes();
    setNotebookNotes(notes || []);

    try {
      const customs = JSON.parse(localStorage.getItem('elg_custom') || '[]');
      setCustomPassages(customs);
    } catch {}
  };

  useEffect(() => {
    refreshData();
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.65 }
      });
    } catch {}
  };

  const awardPoints = async (mode, isCorrect, points) => {
    const prevToday = stats.todayPoints || 0;
    const res = await api.recordPoints(points, mode, isCorrect);
    if (res) {
      setStats(res.stats || {});
      setHistory7Days(res.history || []);
      setModeStats(res.modes || {});

      if (prevToday < settings.dailyGoal && (res.stats?.todayPoints || 0) >= settings.dailyGoal) {
        triggerConfetti();
        showToast('Chúc mừng! Bạn đã hoàn thành mục tiêu XP hôm nay!', 'success');
      }
    }
  };

  const updateSpeedHighScore = (newScore) => {
    if (newScore > speedHighScore) {
      setSpeedHighScore(newScore);
      localStorage.setItem('elg_speed_high', String(newScore));
      triggerConfetti();
    }
  };

  const addWordToReview = async (word) => {
    const list = await api.addNotebookWord(word);
    setNotebookWords(list);
    setStats(prev => ({ ...prev, wordsToReview: list.length }));
  };

  const updateWordMastery = async (en, mastery) => {
    const list = await api.updateWordMastery(en, mastery);
    setNotebookWords(list);
  };

  const removeWordFromReview = async (en) => {
    const list = await api.removeNotebookWord(en);
    setNotebookWords(list);
    setStats(prev => ({ ...prev, wordsToReview: list.length }));
  };

  const clearAllWords = async () => {
    setNotebookWords([]);
    localStorage.setItem('elg_notebook', JSON.stringify({ words: [], notes: notebookNotes }));
    setStats(prev => ({ ...prev, wordsToReview: 0 }));
    showToast('Đã xoá hết từ cần ôn.', 'info');
  };

  const addMistakeNote = async (note) => {
    const list = await api.addNotebookNote(note);
    setNotebookNotes(list);
  };

  const clearAllNotes = async () => {
    setNotebookNotes([]);
    localStorage.setItem('elg_notebook', JSON.stringify({ words: notebookWords, notes: [] }));
    showToast('Đã xoá hết lỗi đã mắc.', 'info');
  };

  const addCustomPassage = (passage) => {
    const updated = [passage, ...customPassages];
    setCustomPassages(updated);
    localStorage.setItem('elg_custom', JSON.stringify(updated));
    showToast('Đã thêm đoạn của bạn.', 'success');
  };

  const clearCustomPassages = () => {
    setCustomPassages([]);
    localStorage.removeItem('elg_custom');
    showToast('Đã xoá đoạn tự thêm.', 'info');
  };

  const applyLevel = (newLevel, askPreset = true) => {
    if (askPreset && newLevel !== settings.level) {
      setPresetOfferLevel(newLevel);
    } else {
      executeApplyLevel(newLevel, true);
    }
  };

  const executeApplyLevel = (newLevel, usePreset = true) => {
    const preset = usePreset ? (PRESETS[newLevel] || {}) : {};
    setSettings(prev => ({
      ...prev,
      level: newLevel,
      ...preset
    }));
    setStats(prev => ({ ...prev, level: newLevel }));
    setPresetOfferLevel(null);
    showToast(`Trình độ ${newLevel} · ${PRESETS[newLevel] ? 'đã áp dụng cài đặt gợi ý' : ''}`, 'success');
  };

  const updateSettings = (updates, silent = false) => {
    setSettings(prev => ({ ...prev, ...updates }));
    if (!silent) showToast('Đã lưu cài đặt.', 'success');
  };

  const resetAllStats = () => {
    localStorage.removeItem('elg_stats');
    setStats(prev => ({ ...prev, total: 0, streak: 0, todayPoints: 0 }));
    setHistory7Days(history7Days.map(d => ({ ...d, points: 0 })));
    setModeStats({});
    showToast('Đã đặt lại điểm và thống kê.', 'info');
  };

  const resetDefaultSettings = () => {
    const lv = settings.level || 'B1';
    const defaults = {
      level: lv,
      range: 'around',
      source: 'builtin',
      topics: ['life', 'study', 'work', 'it'],
      customTopics: [],
      dailyGoal: 50,
      vocabCount: 10,
      vocabType: 'mix',
      timer: 0,
      blankType: 'type',
      strictness: 'normal',
      feedbackLang: 'vi',
      explain: 'short',
      chatCorrection: 'all',
      voice: '',
      rate: 1.0,
      tts: true,
      autoSpeak: false,
      theme: 'light',
      astryxTheme: 'sage',
      pastelMigrated: true,
      radiusScale: 'standard',
      density: 'default',
      fontSize: 'm',
      uiLang: 'vi',
      hints: true,
      ...(PRESETS[lv] || {})
    };
    setSettings(prev => ({ ...prev, ...defaults }));
    showToast('Đã khôi phục cài đặt mặc định.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        settings,
        updateSettings,
        homeFilter,
        setHomeFilter,
        stats,
        history7Days,
        modeStats,
        notebookWords,
        notebookNotes,
        customPassages,
        toastMessage,
        showToast,
        isPlacementOpen,
        setIsPlacementOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isSpeedChallengeOpen,
        setIsSpeedChallengeOpen,
        speedHighScore,
        updateSpeedHighScore,
        pomodoroSeconds,
        setPomodoroSeconds,
        pomodoroRunning,
        setPomodoroRunning,
        isBackendOnline,
        refreshData,
        awardPoints,
        triggerConfetti,
        addWordToReview,
        updateWordMastery,
        removeWordFromReview,
        clearAllWords,
        addMistakeNote,
        clearAllNotes,
        addCustomPassage,
        clearCustomPassages,
        applyLevel,
        presetOfferLevel,
        executeApplyLevel,
        setPresetOfferLevel,
        resetAllStats,
        resetDefaultSettings,
        t
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
