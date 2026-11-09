import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LEVEL_NAME } from '../data/staticData';
import { Badge, Progress, Button } from './ui';
import { Icons } from './Icons';

export default function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    sidebarOpen,
    setSidebarOpen,
    stats,
    settings,
    setIsPlacementOpen,
    setIsCommandPaletteOpen,
    setIsSpeedChallengeOpen,
    speedHighScore,
    t
  } = useApp();

  const [skillsExpanded, setSkillsExpanded] = useState(true);
  const [grammarExpanded, setGrammarExpanded] = useState(true);
  const [personalExpanded, setPersonalExpanded] = useState(true);

  const currentLevel = settings.level || 'B1';
  const dailyGoal = settings.dailyGoal || 50;
  const todayPts = stats.todayPoints || 0;

  const overviewItems = [
    { id: 'home', label: 'Bảng điều khiển', icon: Icons.Home, tag: null },
    { id: 'chat', label: 'Hội thoại nhập vai AI', icon: Icons.Chat, tag: 'AI Voice' },
    { id: 'speed', label: 'Phản xạ 60 giây', icon: Icons.Zap, tag: `${speedHighScore}đ`, isAction: true }
  ];

  const skillItems = [
    { id: 'vocab', label: 'Từ vựng & Đặt câu 3D', icon: Icons.Vocab, tag: 'SRS' },
    { id: 'reading', label: 'Đọc hiểu & Tra từ', icon: Icons.Reading, tag: 'A1–C1' },
    { id: 'dictation', label: 'Nghe chép chính tả', icon: Icons.Dictation, tag: 'Audio' },
    { id: 'speaking', label: 'Luyện nói & Phát âm', icon: Icons.Speaking, tag: 'Mic' },
    { id: 'translate', label: 'Dịch đoạn văn Việt – Anh', icon: Icons.Translate, tag: 'AI Chấm' }
  ];

  const grammarItems = [
    { id: 'grammar', label: 'Ngữ pháp & 45 Động từ', icon: Icons.BookOpen, tag: 'V1-V2-V3' },
    { id: 'blank', label: 'Điền từ khuyết (Cloze)', icon: Icons.Blank, tag: null },
    { id: 'scramble', label: 'Sắp xếp câu hoàn chỉnh', icon: Icons.Scramble, tag: null }
  ];

  const personalItems = [
    { id: 'review', label: 'Sổ tay ôn tập SRS', icon: Icons.Notebook, badge: stats.wordsToReview },
    { id: 'settings', label: 'Cài đặt & Giao diện', icon: Icons.Settings, tag: null }
  ];

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleAction = (item) => {
    if (item.id === 'speed') {
      setIsSpeedChallengeOpen(true);
    } else {
      handleSelectTab(item.id);
    }
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const renderNavButton = (item) => {
    const isActive = activeTab === item.id;
    const IconComp = item.icon;
    return (
      <button
        key={item.id}
        onClick={() => (item.isAction ? handleAction(item) : handleSelectTab(item.id))}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-all ${
          isActive
            ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/75 font-medium'
        }`}
      >
        <span className="flex items-center gap-2.5 truncate">
          <IconComp className="w-4 h-4 shrink-0" />
          <span className="truncate">{t(item.label)}</span>
        </span>
        {item.badge > 0 ? (
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
              isActive
                ? 'bg-primary-foreground text-primary'
                : 'bg-primary/15 text-primary'
            }`}
          >
            {item.badge}
          </span>
        ) : item.tag ? (
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium shrink-0 ${
              isActive
                ? 'bg-white/20 text-primary-foreground'
                : 'bg-secondary text-muted-foreground'
            }`}
          >
            {item.tag}
          </span>
        ) : null}
      </button>
    );
  };

  return (
    <>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 z-50 lg:z-30 h-screen flex flex-col border-r border-border bg-card/95 backdrop-blur-md text-foreground select-none transition-all duration-200 shrink-0 ${
          sidebarOpen
            ? 'w-64 translate-x-0'
            : '-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden lg:border-none'
        }`}
      >
        {/* Brand Header */}
        <div className="h-15 px-3.5 flex items-center justify-between border-b border-border/80 shrink-0">
          <button
            onClick={() => handleSelectTab('home')}
            className="flex items-center gap-2.5 hover:bg-secondary/70 p-1.5 rounded-xl transition-colors text-left min-w-0"
          >
            <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-2xs">
              <Icons.BookOpen className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[13.5px] font-bold text-foreground tracking-tight truncate">
                Luyện Tiếng Anh
              </div>
              <div className="text-[10.5px] text-muted-foreground truncate">
                CEFR {currentLevel} · Học tập toàn diện
              </div>
            </div>
          </button>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              title="Tra từ điển & Tìm bài học (Ctrl+K)"
            >
              <Icons.Search className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground lg:hidden transition-colors"
              title="Đóng menu"
            >
              <Icons.X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-3 py-3.5 space-y-4 scrollbar-none">
          <nav className="space-y-1">
            {overviewItems.map(renderNavButton)}
          </nav>

          {/* 4 Skills Group */}
          <div>
            <button
              onClick={() => setSkillsExpanded(!skillsExpanded)}
              className="w-full flex items-center justify-between px-2.5 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
            >
              <span>Kỹ năng thực hành</span>
              <span className="text-[10px]">{skillsExpanded ? '▾' : '▸'}</span>
            </button>
            {skillsExpanded && (
              <nav className="space-y-1 mt-1">
                {skillItems.map(renderNavButton)}
              </nav>
            )}
          </div>

          {/* Grammar & Structure Group */}
          <div>
            <button
              onClick={() => setGrammarExpanded(!grammarExpanded)}
              className="w-full flex items-center justify-between px-2.5 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
            >
              <span>Ngữ pháp & Cấu trúc</span>
              <span className="text-[10px]">{grammarExpanded ? '▾' : '▸'}</span>
            </button>
            {grammarExpanded && (
              <nav className="space-y-1 mt-1">
                {grammarItems.map(renderNavButton)}
              </nav>
            )}
          </div>

          {/* Personal Group */}
          <div>
            <button
              onClick={() => setPersonalExpanded(!personalExpanded)}
              className="w-full flex items-center justify-between px-2.5 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
            >
              <span>Cá nhân & Hệ thống</span>
              <span className="text-[10px]">{personalExpanded ? '▾' : '▸'}</span>
            </button>
            {personalExpanded && (
              <nav className="space-y-1 mt-1">
                {personalItems.map(renderNavButton)}
              </nav>
            )}
          </div>
        </div>

        {/* Sidebar Footer: Daily Study Goal & CEFR Card */}
        <div className="p-3 border-t border-border/80 bg-secondary/35">
          <div className="p-3.5 rounded-2xl bg-card border border-border shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <Badge variant="pastel" className="text-[11px] font-semibold">
                CEFR {currentLevel} · {t(LEVEL_NAME[currentLevel])}
              </Badge>
              <button
                onClick={() => setIsPlacementOpen(true)}
                className="text-[11px] font-medium text-primary hover:underline"
                title="Kiểm tra trình độ 15 câu"
              >
                Đổi cấp ↗
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Mục tiêu hôm nay</span>
                <span className="font-semibold text-foreground">
                  {todayPts}/{dailyGoal} XP
                </span>
              </div>
              <Progress value={todayPts} max={dailyGoal} className="h-2" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
