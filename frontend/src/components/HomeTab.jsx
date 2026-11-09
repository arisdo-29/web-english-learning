import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { LEVELS, LEVEL_NAME, LEVEL_DESC, STATIC_VOCAB } from '../data/staticData';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
  Button,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  Progress,
  Input
} from './ui';
import AudioPlayer from './AudioPlayer';
import { Icons } from './Icons';

export default function HomeTab() {
  const {
    settings,
    updateSettings,
    stats,
    history7Days,
    modeStats,
    notebookNotes,
    setActiveTab,
    applyLevel,
    setIsPlacementOpen,
    setIsSpeedChallengeOpen,
    speedHighScore,
    addWordToReview,
    showToast,
    t
  } = useApp();

  const [skillCategory, setSkillCategory] = useState('all'); // 'all' | 'vocab_read' | 'listen_speak' | 'write_grammar'
  const [searchQuery, setSearchQuery] = useState('');
  const [dictQuery, setDictQuery] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(String(settings.dailyGoal || 50));

  const currentLevel = settings.level || 'B1';
  const dailyGoal = settings.dailyGoal || 50;
  const todayPts = stats.todayPoints || 0;
  const dailyProgressPct = Math.min(100, Math.round((todayPts / Math.max(1, dailyGoal)) * 100));

  // Compute accuracy & attempts across all modes
  const practicedModesCount = Object.keys(modeStats || {}).filter(k => (modeStats[k]?.t || 0) > 0).length;
  const totalAttempts = Object.values(modeStats || {}).reduce((acc, cur) => acc + (cur.t || 0), 0);
  const totalCorrect = Object.values(modeStats || {}).reduce((acc, cur) => acc + (cur.r || 0), 0);
  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  // Quick vocabulary lookup & daily word carousel
  const allVocab = useMemo(() => {
    const list = [];
    Object.entries(STATIC_VOCAB).forEach(([lv, arr]) => {
      arr.forEach(w => list.push({ ...w, lv }));
    });
    return list;
  }, []);

  const levelVocab = useMemo(() => {
    return (STATIC_VOCAB[currentLevel] || STATIC_VOCAB.B1 || []).map(w => ({ ...w, lv: currentLevel }));
  }, [currentLevel]);

  const displayedWord = useMemo(() => {
    if (dictQuery.trim()) {
      const q = dictQuery.trim().toLowerCase();
      const match = allVocab.find(
        w => w.en.toLowerCase().includes(q) || w.vi.toLowerCase().includes(q)
      );
      if (match) return match;
    }
    if (levelVocab.length > 0) {
      return levelVocab[wordIdx % levelVocab.length];
    }
    return {
      en: 'consistent',
      ipa: '/kənˈsɪstənt/',
      vi: 'kiên định, đều đặn mỗi ngày',
      ex: 'Consistent daily practice is the key to mastering English.',
      lv: currentLevel
    };
  }, [dictQuery, allVocab, levelVocab, wordIdx, currentLevel]);

  // All 10 English Learning Modules tailored to the project
  const learningModules = [
    {
      id: 'vocab',
      title: 'Từ vựng & Đặt câu 3D',
      skillTag: 'Từ vựng · SRS',
      category: 'vocab_read',
      xp: '+15 XP',
      desc: 'Học từ vựng qua thẻ lật 3D, trắc nghiệm phản xạ, nghe phát âm và tự đặt câu với AI chấm chữa.',
      tone: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
      icon: Icons.Vocab
    },
    {
      id: 'reading',
      title: 'Đọc hiểu & Click tra từ',
      skillTag: 'Kỹ năng Đọc',
      category: 'vocab_read',
      xp: '+15 XP',
      desc: 'Đọc các bài viết phân cấp CEFR A1–C1, bấm trực tiếp vào bất kỳ từ nào để tra nghĩa và lưu vào sổ tay.',
      tone: 'bg-sky-500/12 text-sky-700 dark:text-sky-300 border-sky-500/20',
      icon: Icons.Reading
    },
    {
      id: 'dictation',
      title: 'Nghe chép chính tả',
      skillTag: 'Kỹ năng Nghe',
      category: 'listen_speak',
      xp: '+15 XP',
      desc: 'Nghe câu tiếng Anh tự nhiên (Kokoro TTS), mở gợi ý từ bị khuyết và đối chiếu chính xác từng từ bằng LCS.',
      tone: 'bg-amber-500/12 text-amber-800 dark:text-amber-300 border-amber-500/20',
      icon: Icons.Dictation
    },
    {
      id: 'speaking',
      title: 'Luyện nói & Phát âm',
      skillTag: 'Kỹ năng Nói',
      category: 'listen_speak',
      xp: '+20 XP',
      desc: 'Thu âm giọng đọc trực tiếp, chấm điểm độ khớp từng từ và rèn ngữ điệu chuẩn bản xứ.',
      tone: 'bg-rose-500/12 text-rose-700 dark:text-rose-300 border-rose-500/20',
      icon: Icons.Speaking
    },
    {
      id: 'chat',
      title: 'Hội thoại nhập vai AI',
      skillTag: 'Giao tiếp thực tế',
      category: 'listen_speak',
      xp: '+20 XP',
      desc: 'Thực hành 6 tình huống giao tiếp đời sống & công việc cùng gia sư AI có hỗ trợ giọng nói và sửa lỗi.',
      tone: 'bg-purple-500/12 text-purple-700 dark:text-purple-300 border-purple-500/20',
      icon: Icons.Chat
    },
    {
      id: 'translate',
      title: 'Dịch đoạn văn Việt – Anh',
      skillTag: 'Kỹ năng Viết',
      category: 'write_grammar',
      xp: '+20 XP',
      desc: 'Luyện dịch câu và đoạn văn theo chủ đề kèm gợi ý từ khóa, bản dịch mẫu và nhận xét ngữ pháp từ AI.',
      tone: 'bg-indigo-500/12 text-indigo-700 dark:text-indigo-300 border-indigo-500/20',
      icon: Icons.Translate
    },
    {
      id: 'grammar',
      title: 'Ngữ pháp & 45 Động từ bất quy tắc',
      skillTag: 'Ngữ pháp CEFR',
      category: 'write_grammar',
      xp: '+10 XP',
      desc: 'Cẩm nang cấu trúc ngữ pháp trọng tâm A1–C1, bài tập kiểm tra nhanh và bảng tra cứu động từ V1–V2–V3.',
      tone: 'bg-teal-500/12 text-teal-700 dark:text-teal-300 border-teal-500/20',
      icon: Icons.BookOpen
    },
    {
      id: 'blank',
      title: 'Điền từ khuyết (Cloze Test)',
      skillTag: 'Ngữ pháp & Từ loại',
      category: 'write_grammar',
      xp: '+10 XP',
      desc: 'Rèn luyện giới từ, cụm động từ (phrasal verbs) và chia thì qua bài tập điền khuyết có giải thích chi tiết.',
      tone: 'bg-cyan-500/12 text-cyan-700 dark:text-cyan-300 border-cyan-500/20',
      icon: Icons.Blank
    },
    {
      id: 'scramble',
      title: 'Sắp xếp câu hoàn chỉnh',
      skillTag: 'Cấu trúc câu',
      category: 'write_grammar',
      xp: '+10 XP',
      desc: 'Ghép các thẻ từ bị xáo trộn thành câu tiếng Anh hoàn chỉnh đúng trật tự ngữ pháp.',
      tone: 'bg-orange-500/12 text-orange-800 dark:text-orange-300 border-orange-500/20',
      icon: Icons.Scramble
    },
    {
      id: 'review',
      title: 'Sổ tay ôn tập SRS & Lỗi đã mắc',
      skillTag: `${stats.wordsToReview || 0} từ cần ôn`,
      category: 'vocab_read',
      xp: 'Ôn tập',
      desc: 'Quản lý kho từ vựng cá nhân theo mức độ ghi nhớ (Spaced Repetition) và xem lại các lỗi ngữ pháp đã gặp.',
      tone: 'bg-primary/12 text-primary border-primary/20',
      icon: Icons.Notebook
    }
  ];

  const filteredModules = learningModules.filter(m => {
    if (skillCategory !== 'all' && m.category !== skillCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.title.toLowerCase().includes(q) ||
      m.skillTag.toLowerCase().includes(q) ||
      m.desc.toLowerCase().includes(q)
    );
  });

  // Daily 3-step suggested study plan
  const dailySteps = [
    {
      step: 1,
      title: 'Ôn tập & học mới 10 từ vựng 3D',
      sub: 'Ghi nhớ từ vựng theo cấp độ CEFR và tự đặt câu',
      done: (modeStats.vocab?.t || 0) > 0,
      targetTab: 'vocab'
    },
    {
      step: 2,
      title: 'Luyện nghe chép hoặc Phát âm 5 câu',
      sub: 'Rèn phản xạ nghe Kokoro TTS và chuẩn hóa phát âm',
      done: (modeStats.dictation?.t || 0) > 0 || (modeStats.speaking?.t || 0) > 0,
      targetTab: 'dictation'
    },
    {
      step: 3,
      title: 'Dịch 1 đoạn văn Việt – Anh hoặc Hội thoại AI',
      sub: 'Ứng dụng từ vựng và ngữ pháp vào ngữ cảnh thực tế',
      done: (modeStats.translate?.t || 0) > 0 || (modeStats.chat?.t || 0) > 0,
      targetTab: 'translate'
    }
  ];

  const handleSaveGoal = (e) => {
    e.preventDefault();
    const val = Math.max(10, Math.min(500, parseInt(goalInput, 10) || 50));
    updateSettings({ dailyGoal: val }, true);
    setEditingGoal(false);
    showToast(`Đã cập nhật mục tiêu ngày: ${val} XP`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      
      {/* =========================================================================
       * 1. LEARNER WELCOME & CEFR ROADMAP BANNER (shadcn/ui Card)
       * ========================================================================= */}
      <Card className="bg-gradient-to-br from-card via-card to-secondary/60 border-border overflow-hidden">
        <CardContent className="p-6 sm:p-7">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Left: Greeting, CEFR Level Selector & Quick Actions */}
            <div className="space-y-4 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="default" className="px-3 py-1">
                  CEFR {currentLevel} · {t(LEVEL_NAME[currentLevel])}
                </Badge>
                <Badge variant="secondary">
                  {todayPts >= dailyGoal ? '🎉 Đã đạt mục tiêu hôm nay' : `Còn ${Math.max(0, dailyGoal - todayPts)} XP để hoàn thành mục tiêu ngày`}
                </Badge>
              </div>

              <div className="space-y-1.5">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {settings.uiLang === 'en'
                    ? 'Your Daily English Study Space'
                    : 'Không gian rèn luyện tiếng Anh mỗi ngày'}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {LEVEL_DESC[currentLevel]} — Chọn cấp độ CEFR bên dưới hoặc làm bài kiểm tra 15 câu để hệ thống tự động điều chỉnh độ khó từ vựng, bài đọc và ngữ pháp.
                </p>
              </div>

              {/* CEFR Level Stepper Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="inline-flex items-center p-1 rounded-xl bg-secondary/90 border border-border/70 gap-1">
                  {LEVELS.map(lv => {
                    const isSelected = currentLevel === lv;
                    return (
                      <button
                        key={lv}
                        type="button"
                        onClick={() => applyLevel(lv, true)}
                        title={LEVEL_DESC[lv]}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-primary text-primary-foreground shadow-2xs'
                            : 'text-muted-foreground hover:text-foreground hover:bg-card/60'
                        }`}
                      >
                        {lv}
                      </button>
                    );
                  })}
                </div>

                <Button variant="outline" size="sm" onClick={() => setIsPlacementOpen(true)}>
                  <Icons.Target className="w-3.5 h-3.5" />
                  <span>Kiểm tra trình độ (15 câu)</span>
                </Button>

                <Button variant="secondary" size="sm" onClick={() => setIsSpeedChallengeOpen(true)}>
                  <Icons.Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Phản xạ 60s ({speedHighScore}đ)</span>
                </Button>
              </div>
            </div>

            {/* Right: Today's Study Goal Progress Box */}
            <div className="lg:w-80 shrink-0 p-5 rounded-2xl bg-card/90 border border-border shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-muted-foreground block">
                    Tiến độ mục tiêu hôm nay
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-2xl font-bold text-primary">{todayPts}</span>
                    <span className="text-xs text-muted-foreground font-medium">/ {dailyGoal} XP ({dailyProgressPct}%)</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setGoalInput(String(dailyGoal));
                    setEditingGoal(!editingGoal);
                  }}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  {editingGoal ? 'Đóng' : 'Đổi mục tiêu'}
                </button>
              </div>

              {editingGoal ? (
                <form onSubmit={handleSaveGoal} className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="10"
                    max="500"
                    step="10"
                    value={goalInput}
                    onChange={e => setGoalInput(e.target.value)}
                    className="h-8 text-xs"
                  />
                  <Button type="submit" size="sm">Lưu</Button>
                </form>
              ) : (
                <Progress value={todayPts} max={dailyGoal} className="h-2.5" />
              )}

              <div className="flex items-center gap-2 pt-1">
                <Button className="flex-1" size="sm" onClick={() => setActiveTab('vocab')}>
                  <span>Học từ vựng ngay</span>
                  <Icons.ArrowRight className="w-3.5 h-3.5" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('chat')}>
                  <Icons.Chat className="w-3.5 h-3.5" />
                  <span>AI Chat</span>
                </Button>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* =========================================================================
       * 2. 4 KPI SUMMARY CARDS (shadcn/ui Card Composition)
       * ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="py-4 gap-3">
          <CardHeader className="px-5">
            <CardDescription className="text-xs font-medium">Điểm XP hôm nay</CardDescription>
            <CardTitle className="text-2xl font-bold text-foreground">
              {todayPts} <span className="text-sm font-normal text-muted-foreground">/ {dailyGoal} XP</span>
            </CardTitle>
            <CardAction>
              <div className="w-9 h-9 rounded-xl bg-primary/12 text-primary flex items-center justify-center">
                <Icons.Zap className="w-4 h-4" />
              </div>
            </CardAction>
          </CardHeader>
          <CardContent className="px-5">
            <Progress value={todayPts} max={dailyGoal} className="h-1.5" />
          </CardContent>
        </Card>

        <Card className="py-4 gap-3">
          <CardHeader className="px-5">
            <CardDescription className="text-xs font-medium">Chuỗi ngày học (Streak)</CardDescription>
            <CardTitle className="text-2xl font-bold text-foreground">
              {stats.streak || 0} <span className="text-sm font-normal text-muted-foreground">ngày liên tiếp</span>
            </CardTitle>
            <CardAction>
              <div className="w-9 h-9 rounded-xl bg-amber-500/12 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                <Icons.Flame className="w-4 h-4" />
              </div>
            </CardAction>
          </CardHeader>
          <CardContent className="px-5 text-xs text-muted-foreground">
            Tổng điểm tích lũy: <strong className="text-foreground">{stats.total || todayPts} XP</strong>
          </CardContent>
        </Card>

        <Card className="py-4 gap-3">
          <CardHeader className="px-5">
            <CardDescription className="text-xs font-medium">Độ chính xác trung bình</CardDescription>
            <CardTitle className="text-2xl font-bold text-foreground">
              {totalAttempts > 0 ? `${overallAccuracy}%` : '—'}
              <span className="text-xs font-normal text-muted-foreground ml-1.5">
                ({totalCorrect}/{totalAttempts} câu)
              </span>
            </CardTitle>
            <CardAction>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <Icons.Target className="w-4 h-4" />
              </div>
            </CardAction>
          </CardHeader>
          <CardContent className="px-5 text-xs text-muted-foreground">
            Đã thực hành <strong className="text-foreground">{practicedModesCount}/8</strong> kỹ năng
          </CardContent>
        </Card>

        <Card
          onClick={() => setActiveTab('review')}
          className="py-4 gap-3 cursor-pointer hover:border-primary/40 transition-all"
        >
          <CardHeader className="px-5">
            <CardDescription className="text-xs font-medium">Sổ tay SRS cần ôn</CardDescription>
            <CardTitle className="text-2xl font-bold text-foreground">
              {stats.wordsToReview || 0} <span className="text-sm font-normal text-muted-foreground">từ vựng</span>
            </CardTitle>
            <CardAction>
              <div className="w-9 h-9 rounded-xl bg-purple-500/12 text-purple-700 dark:text-purple-300 flex items-center justify-center">
                <Icons.Notebook className="w-4 h-4" />
              </div>
            </CardAction>
          </CardHeader>
          <CardContent className="px-5 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{notebookNotes?.length || 0} ghi chú lỗi ngữ pháp</span>
            <span className="font-semibold text-primary hover:underline">Ôn tập ↗</span>
          </CardContent>
        </Card>
      </div>

      {/* =========================================================================
       * 3. 2-COLUMN WORKSPACE: SKILL MODULES (LEFT) + DAILY TOOLKIT (RIGHT)
       * ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN (8 cols): Categorized Learning Modules with shadcn Tabs */}
        <div className="lg:col-span-8 space-y-4">
          <Tabs value={skillCategory} onValueChange={setSkillCategory}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <TabsList className="w-full sm:w-auto overflow-x-auto justify-start">
                <TabsTrigger value="all">Tất cả (10)</TabsTrigger>
                <TabsTrigger value="vocab_read">Từ vựng & Đọc</TabsTrigger>
                <TabsTrigger value="listen_speak">Nghe & Nói</TabsTrigger>
                <TabsTrigger value="write_grammar">Viết & Ngữ pháp</TabsTrigger>
              </TabsList>

              <div className="relative w-full sm:w-56">
                <Icons.Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Tìm học phần..."
                  className="pl-8 h-9 text-xs"
                />
              </div>
            </div>

            {/* Grid of Learning Module Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {filteredModules.map(mod => {
                const IconComp = mod.icon;
                const mStat = modeStats[mod.id] || { r: 0, t: 0 };
                const acc = mStat.t > 0 ? Math.round((mStat.r / mStat.t) * 100) : null;

                return (
                  <Card
                    key={mod.id}
                    onClick={() => setActiveTab(mod.id)}
                    className="group cursor-pointer hover:border-primary/45 hover:shadow-md transition-all justify-between py-5 gap-4"
                  >
                    <CardHeader className="px-5">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-105 ${mod.tone}`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Badge variant="secondary" className="text-[11px]">
                            {mod.skillTag}
                          </Badge>
                          <Badge variant="pastel" className="text-[11px]">
                            {mod.xp}
                          </Badge>
                        </div>
                      </div>
                      <CardTitle className="text-base group-hover:text-primary transition-colors">
                        {t(mod.title)}
                      </CardTitle>
                      <CardDescription className="text-xs line-clamp-2">
                        {mod.desc}
                      </CardDescription>
                    </CardHeader>

                    <CardFooter className="px-5 pt-3 flex items-center justify-between gap-3">
                      {acc !== null ? (
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                            <span>Đã làm {mStat.t} lượt</span>
                            <span className="font-semibold text-foreground">{acc}% đúng</span>
                          </div>
                          <Progress value={acc} max={100} className="h-1.5" />
                        </div>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">
                          Sẵn sàng cho trình độ {currentLevel}
                        </span>
                      )}

                      <Button variant="secondary" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <span>Luyện tập</span>
                        <Icons.ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </Tabs>
        </div>

        {/* RIGHT COLUMN (4 cols): Daily Word Flashcard, 3-Step Study Plan & 7-Day Chart */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* WIDGET 1: Daily Vocabulary Spotlight & Quick Dictionary */}
          <Card className="py-5 gap-4">
            <CardHeader className="px-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Icons.Vocab className="w-4 h-4 text-primary" />
                  <span>Từ vựng tiêu điểm & Tra nhanh</span>
                </CardTitle>
                <Badge variant="pastel">{displayedWord.lv || currentLevel}</Badge>
              </div>
              <CardDescription className="text-xs">
                Tra nhanh từ điển tích hợp hoặc ôn từ vựng theo cấp độ {currentLevel}.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-5 space-y-3.5">
              <div className="relative">
                <Icons.Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  value={dictQuery}
                  onChange={e => setDictQuery(e.target.value)}
                  placeholder="Gõ từ tiếng Anh hoặc Việt..."
                  className="pl-8 h-9 text-xs"
                />
              </div>

              {/* Pastel Flashcard Preview */}
              <div className="p-4 rounded-2xl bg-secondary/75 border border-border/80 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg font-bold text-foreground">
                        {displayedWord.en}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">
                        {displayedWord.ipa}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-primary mt-0.5">
                      {displayedWord.vi}
                    </p>
                  </div>
                  <AudioPlayer text={displayedWord.en} size="sm" />
                </div>

                {displayedWord.ex && (
                  <p className="text-xs text-muted-foreground italic border-t border-border/60 pt-2">
                    "{displayedWord.ex}"
                  </p>
                )}

                <div className="flex items-center justify-between pt-1 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDictQuery('');
                      setWordIdx(prev => prev + 1);
                    }}
                  >
                    Từ khác ↻
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      addWordToReview(displayedWord);
                      showToast(`Đã lưu "${displayedWord.en}" vào Sổ tay SRS!`, 'success');
                    }}
                  >
                    <Icons.Plus className="w-3.5 h-3.5" />
                    <span>Lưu sổ tay</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* WIDGET 2: Suggested 3-Step Daily Study Plan */}
          <Card className="py-5 gap-4">
            <CardHeader className="px-5">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Icons.Sparkles className="w-4 h-4 text-primary" />
                <span>Lộ trình 3 bước gợi ý hôm nay</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Hoàn thành 3 bước ngắn mỗi ngày để cân bằng Từ vựng – Nghe Nói – Dịch viết.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-5 space-y-2.5">
              {dailySteps.map(item => (
                <div
                  key={item.step}
                  onClick={() => setActiveTab(item.targetTab)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    item.done
                      ? 'bg-emerald-500/8 border-emerald-500/25'
                      : 'bg-card hover:bg-secondary/60 border-border'
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div
                      className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                        item.done
                          ? 'bg-emerald-600 text-white'
                          : 'bg-primary/15 text-primary'
                      }`}
                    >
                      {item.done ? <Icons.Check className="w-3.5 h-3.5" /> : item.step}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-foreground">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {item.sub}
                      </div>
                    </div>
                  </div>
                  <Icons.ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-1" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* WIDGET 3: 7-Day XP Activity Chart */}
          <Card className="py-5 gap-4">
            <CardHeader className="px-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold">
                  Biểu đồ XP 7 ngày gần nhất
                </CardTitle>
                <span className="text-[11px] text-muted-foreground font-mono">
                  Mục tiêu: {dailyGoal} XP
                </span>
              </div>
            </CardHeader>

            <CardContent className="px-5">
              <div className="h-32 flex items-end justify-between gap-2 pt-3">
                {(history7Days && history7Days.length > 0
                  ? history7Days
                  : [
                      { date: '1', points: 20 },
                      { date: '2', points: 35 },
                      { date: '3', points: 30 },
                      { date: '4', points: 50 },
                      { date: '5', points: 40 },
                      { date: '6', points: 45 },
                      { date: '7', points: todayPts }
                    ]
                ).map((item, idx, arr) => {
                  const d = new Date(item.date);
                  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
                  const dayLabel = idx === arr.length - 1 ? 'Nay' : (!isNaN(d) ? days[d.getDay()] : `N${idx + 1}`);
                  const maxPts = Math.max(dailyGoal, ...arr.map(x => x.points || 0), 30);
                  const heightPercent = maxPts > 0 ? Math.max(12, Math.round(((item.points || 0) / maxPts) * 100)) : 12;
                  const hitGoal = (item.points || 0) >= dailyGoal;

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {item.points > 0 ? item.points : ''}
                      </span>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full max-w-[26px] rounded-xl transition-all duration-300 ${
                          hitGoal
                            ? 'bg-primary'
                            : item.points > 0
                              ? 'bg-primary/55'
                              : 'bg-secondary'
                        }`}
                      />
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {dayLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

        </div>

      </div>

    </div>
  );
}
