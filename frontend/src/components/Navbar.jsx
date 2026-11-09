import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LEVEL_NAME } from '../data/staticData';
import { ASTRYX_THEMES } from '../astryx/themes';
import { Badge, Button } from './ui';
import { Icons } from './Icons';

export default function Navbar() {
  const {
    activeTab,
    setActiveTab,
    sidebarOpen,
    toggleSidebar,
    stats,
    settings,
    updateSettings,
    setIsPlacementOpen,
    setIsCommandPaletteOpen,
    setIsSpeedChallengeOpen,
    pomodoroSeconds,
    setPomodoroSeconds,
    pomodoroRunning,
    setPomodoroRunning,
    isBackendOnline,
    t
  } = useApp();

  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target)) {
        setThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleThemeMode = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' }, true);
  };

  const toggleLang = () => {
    updateSettings({ uiLang: settings.uiLang === 'en' ? 'vi' : 'en' }, true);
  };

  const currentLevel = settings.level || 'B1';
  const currentThemeObj = ASTRYX_THEMES[settings.astryxTheme] || ASTRYX_THEMES.sage;

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const tabMeta = {
    home: { title: 'Bảng điều khiển học tập', group: 'Tổng quan' },
    vocab: { title: 'Từ vựng & Đặt câu 3D', group: 'Kỹ năng thực hành' },
    translate: { title: 'Dịch đoạn văn Việt – Anh', group: 'Kỹ năng thực hành' },
    reading: { title: 'Đọc hiểu & Click tra từ', group: 'Kỹ năng thực hành' },
    speaking: { title: 'Luyện nói & Phát âm', group: 'Kỹ năng thực hành' },
    dictation: { title: 'Nghe chép chính tả', group: 'Kỹ năng thực hành' },
    grammar: { title: 'Ngữ pháp & 45 Động từ bất quy tắc', group: 'Ngữ pháp & Cấu trúc' },
    blank: { title: 'Điền từ khuyết (Cloze Test)', group: 'Ngữ pháp & Cấu trúc' },
    scramble: { title: 'Sắp xếp câu hoàn chỉnh', group: 'Ngữ pháp & Cấu trúc' },
    chat: { title: 'Hội thoại nhập vai AI', group: 'Thực hành giao tiếp' },
    review: { title: 'Sổ tay ôn tập SRS & Lỗi ngữ pháp', group: 'Cá nhân' },
    settings: { title: 'Cài đặt hệ thống & Giao diện Pastel', group: 'Hệ thống' }
  };

  const currentMeta = tabMeta[activeTab] || tabMeta.home;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/85 backdrop-blur-md">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15 gap-3">
          
          {/* Left: Sidebar Toggle + Breadcrumb + Level Pill */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={toggleSidebar}
              className="w-8 h-8 flex items-center justify-center rounded-xl border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors shrink-0"
              title={sidebarOpen ? "Thu gọn thanh bên" : "Mở thanh bên"}
            >
              <Icons.PanelLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <span className="hidden sm:inline text-xs text-muted-foreground font-medium">
                {t(currentMeta.group)}
              </span>
              <span className="hidden sm:inline text-muted-foreground/50">/</span>
              <h1 className="text-sm font-semibold text-foreground truncate">
                {t(currentMeta.title)}
              </h1>
            </div>

            <button
              type="button"
              onClick={() => setIsPlacementOpen(true)}
              className="hidden lg:inline-flex items-center gap-1.5 ml-1"
              title="Bấm để kiểm tra hoặc đổi trình độ CEFR"
            >
              <Badge variant="pastel" className="cursor-pointer hover:opacity-85">
                CEFR {currentLevel} · {t(LEVEL_NAME[currentLevel])}
              </Badge>
            </button>
          </div>

          {/* Right: Quick Dictionary Search + Pomodoro + Streak + Pastel Theme Picker + Lang */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Quick Dictionary & Lesson Search (Ctrl+K) */}
            <button
              type="button"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hidden md:flex items-center justify-between gap-3 h-9 px-3.5 rounded-xl border border-border bg-background/70 hover:bg-secondary/80 text-xs text-muted-foreground hover:text-foreground transition-colors"
              title="Tra nhanh từ điển Anh-Việt hoặc chuyển bài học (Ctrl+K)"
            >
              <span className="flex items-center gap-2">
                <Icons.Search className="w-3.5 h-3.5 text-primary" />
                <span>Tra từ điển / Tìm bài học...</span>
              </span>
              <kbd className="astryx-kbd">⌘K</kbd>
            </button>

            {/* Pomodoro Study Timer */}
            <div className="hidden xl:flex items-center h-9 rounded-xl border border-border bg-background/70 px-3 gap-1.5 text-xs text-foreground font-mono">
              <button
                type="button"
                onClick={() => setPomodoroRunning(!pomodoroRunning)}
                className="flex items-center gap-1.5 hover:text-primary transition-colors"
                title={pomodoroRunning ? "Tạm dừng Pomodoro" : "Bắt đầu 25 phút học tập trung"}
              >
                {pomodoroRunning ? (
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                ) : (
                  <Icons.Clock className="w-3.5 h-3.5 text-muted-foreground" />
                )}
                <span>{formatTimer(pomodoroSeconds)}</span>
              </button>
              {pomodoroSeconds !== 25 * 60 && (
                <button
                  type="button"
                  onClick={() => {
                    setPomodoroRunning(false);
                    setPomodoroSeconds(25 * 60);
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors ml-0.5"
                  title="Đặt lại 25 phút"
                >
                  <Icons.RotateCcw className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Streak Badge */}
            <div
              className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-border bg-secondary/70 text-xs font-semibold text-foreground"
              title={`Chuỗi học liên tiếp: ${stats.streak || 0} ngày`}
            >
              <Icons.Flame className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{stats.streak || 0}</span>
              <span className="hidden sm:inline text-[11px] font-normal text-muted-foreground">ngày</span>
            </div>

            {/* Daily XP Pill */}
            <button
              onClick={() => setActiveTab('home')}
              className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-xl border border-border bg-card hover:bg-secondary text-xs font-medium transition-colors"
              title="Điểm kinh nghiệm tích lũy hôm nay"
            >
              <span className="font-bold text-primary">{stats.todayPoints || 0}</span>
              <span className="text-muted-foreground">/{settings.dailyGoal || 50} XP</span>
              <span
                className={`w-1.5 h-1.5 rounded-full ml-0.5 ${
                  isBackendOnline ? 'bg-emerald-500' : 'bg-muted-foreground/40'
                }`}
              />
            </button>

            {/* Pastel Theme Studio Popover */}
            <div className="relative" ref={themeMenuRef}>
              <button
                type="button"
                onClick={() => setThemeMenuOpen(prev => !prev)}
                className="h-9 px-3 flex items-center gap-2 rounded-xl border border-border bg-card hover:bg-secondary text-xs font-medium text-foreground transition-colors"
                title="Đổi tông màu nhu Pastel & Chế độ Sáng/Tối"
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                  style={{ backgroundColor: currentThemeObj.preview.accent }}
                />
                <span className="hidden md:inline">Tông màu</span>
                <Icons.Palette className="w-3.5 h-3.5 text-muted-foreground" />
              </button>

              {themeMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 p-4 rounded-2xl border border-border bg-card text-foreground shadow-xl z-50 space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between border-b border-border pb-2.5">
                    <div>
                      <div className="text-xs font-bold text-foreground">Bảng màu Nhu & Pastel</div>
                      <div className="text-[11px] text-muted-foreground">Dịu mắt khi đọc hiểu & học từ vựng</div>
                    </div>
                    <button
                      type="button"
                      onClick={toggleThemeMode}
                      className="px-2.5 py-1 rounded-lg bg-secondary hover:opacity-85 text-xs font-medium text-secondary-foreground flex items-center gap-1.5 transition-colors"
                    >
                      {settings.theme === 'dark' ? <Icons.Sun className="w-3.5 h-3.5" /> : <Icons.Moon className="w-3.5 h-3.5" />}
                      <span>{settings.theme === 'dark' ? 'Nền sáng' : 'Nền tối'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5">
                    {Object.values(ASTRYX_THEMES).map(th => {
                      const isCurrent = (settings.astryxTheme || 'sage') === th.id;
                      return (
                        <button
                          key={th.id}
                          type="button"
                          onClick={() => updateSettings({ astryxTheme: th.id }, true)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-all border ${
                            isCurrent
                              ? 'bg-primary/12 border-primary text-foreground font-semibold'
                              : 'border-transparent hover:bg-secondary/80 text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <span className="flex items-center -space-x-1 shrink-0">
                              <span
                                className="w-4 h-4 rounded-full border border-black/10"
                                style={{ backgroundColor: th.preview.bg }}
                              />
                              <span
                                className="w-4 h-4 rounded-full border border-black/15"
                                style={{ backgroundColor: th.preview.accent }}
                              />
                            </span>
                            <span className="truncate">{th.name}</span>
                          </div>
                          {isCurrent && <Icons.Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Dark/Light Mode Quick Switch */}
            <button
              onClick={toggleThemeMode}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              title={settings.theme === 'dark' ? "Chuyển sang nền sáng Pastel" : "Chuyển sang nền tối dịu mắt"}
            >
              {settings.theme === 'dark' ? (
                <Icons.Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Icons.Moon className="w-4 h-4" />
              )}
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="h-9 px-2.5 flex items-center justify-center rounded-xl border border-border bg-card hover:bg-secondary text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              title="Đổi ngôn ngữ hiển thị (VI / EN)"
            >
              {settings.uiLang === 'en' ? 'EN' : 'VI'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
