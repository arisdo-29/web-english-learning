import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { STATIC_VOCAB, STATIC_IRREGULAR_VERBS } from '../data/staticData';
import { ASTRYX_THEMES } from '../astryx/themes';
import { speak } from '../services/tts';
import { AstryxKbd } from '../astryx/components';
import { Badge, Button } from './ui';
import { Icons } from './Icons';

export default function CommandPalette() {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setActiveTab,
    setIsPlacementOpen,
    setIsSpeedChallengeOpen,
    settings,
    updateSettings,
    addWordToReview,
    showToast
  } = useApp();

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  const allVocabList = useMemo(() => {
    const list = [];
    Object.entries(STATIC_VOCAB).forEach(([lv, arr]) => {
      arr.forEach(w => list.push({ ...w, lv }));
    });
    return list;
  }, []);

  if (!isCommandPaletteOpen) return null;

  const q = query.trim().toLowerCase();

  const navActions = [
    { id: 'home', title: 'Bảng điều khiển học tập', sub: 'Thống kê tiến độ, chuỗi ngày học và lộ trình CEFR', icon: Icons.Home, action: () => setActiveTab('home') },
    { id: 'vocab', title: 'Từ vựng & Flashcard 3D', sub: 'Học thẻ lật 3D, trắc nghiệm, gõ từ và tự đặt câu với AI', icon: Icons.Vocab, action: () => setActiveTab('vocab') },
    { id: 'translate', title: 'Dịch đoạn văn Việt – Anh', sub: 'Luyện dịch kèm gợi ý từ khóa và AI chấm điểm chi tiết', icon: Icons.Translate, action: () => setActiveTab('translate') },
    { id: 'reading', title: 'Đọc hiểu & Tra từ trực tiếp', sub: 'Đọc bài tiếng Anh A1–C1, bấm vào từ bất kỳ để tra nghĩa', icon: Icons.Reading, action: () => setActiveTab('reading') },
    { id: 'speaking', title: 'Luyện nói & Phát âm (Speaking Coach)', sub: 'Thu âm giọng nói và chấm điểm phát âm từng từ', icon: Icons.Speaking, action: () => setActiveTab('speaking') },
    { id: 'dictation', title: 'Nghe chép chính tả (Dictation)', sub: 'Nghe giọng Kokoro AI và so khớp từng từ bằng LCS', icon: Icons.Dictation, action: () => setActiveTab('dictation') },
    { id: 'scramble', title: 'Sắp xếp câu (Sentence Builder)', sub: 'Ghép các khối từ thành câu hoàn chỉnh đúng ngữ pháp', icon: Icons.Scramble, action: () => setActiveTab('scramble') },
    { id: 'blank', title: 'Điền từ khuyết (Cloze Test)', sub: 'Luyện giới từ, cụm động từ và cấu trúc ngữ pháp', icon: Icons.Blank, action: () => setActiveTab('blank') },
    { id: 'grammar', title: 'Cẩm nang Ngữ pháp & Động từ bất quy tắc', sub: 'Công thức ngữ pháp A1–C1 và bảng 45 động từ V1-V2-V3', icon: Icons.BookOpen, action: () => setActiveTab('grammar') },
    { id: 'chat', title: 'Hội thoại nhập vai AI (Roleplay Partner)', sub: '6 kịch bản thực tế có nhiệm vụ và sửa lỗi ngữ pháp', icon: Icons.Chat, action: () => setActiveTab('chat') },
    { id: 'speed', title: 'Thử thách Phản xạ 60 Giây (60s Blitz)', sub: 'Trò chơi tính giờ nhân hệ số Combo XP', icon: Icons.Zap, action: () => setIsSpeedChallengeOpen(true) },
    { id: 'placement', title: 'Kiểm tra xếp trình độ CEFR (15 câu)', sub: 'Đánh giá nhanh trình độ từ A1 đến C1', icon: Icons.Target, action: () => setIsPlacementOpen(true) },
    { id: 'review', title: 'Sổ tay SRS & Lỗi ngữ pháp', sub: 'Ôn tập từ vựng theo Spaced Repetition', icon: Icons.Notebook, action: () => setActiveTab('review') },
    { id: 'settings', title: 'Cài đặt hệ thống & Giao diện Pastel', sub: 'Đổi tông màu Pastel, giọng đọc Kokoro và API Key', icon: Icons.Settings, action: () => setActiveTab('settings') }
  ].filter(item => !q || item.title.toLowerCase().includes(q) || item.sub.toLowerCase().includes(q));

  const matchedWords = q.length >= 1
    ? allVocabList.filter(w => w.en.toLowerCase().includes(q) || w.vi.toLowerCase().includes(q)).slice(0, 6)
    : [];

  const matchedVerbs = q.length >= 1
    ? STATIC_IRREGULAR_VERBS.filter(v =>
        v.v1.toLowerCase().includes(q) ||
        v.v2.toLowerCase().includes(q) ||
        v.v3.toLowerCase().includes(q) ||
        v.vi.toLowerCase().includes(q)
      ).slice(0, 5)
    : [];

  const matchedThemes = q.length >= 1
    ? Object.values(ASTRYX_THEMES).filter(th => th.name.toLowerCase().includes(q) || th.id.toLowerCase().includes(q))
    : [];

  return (
    <div
      onClick={() => setIsCommandPaletteOpen(false)}
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="rounded-2xl bg-card text-foreground max-w-xl w-full overflow-hidden shadow-2xl border border-border animate-in zoom-in-95 duration-150"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border bg-secondary/40">
          <Icons.Search className="w-4 h-4 text-primary shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Escape') setIsCommandPaletteOpen(false);
              if (e.key === 'Enter' && navActions.length > 0) {
                navActions[0].action();
                setIsCommandPaletteOpen(false);
              }
            }}
            placeholder="Tìm bài học, tra nhanh từ vựng (Anh/Việt), động từ bất quy tắc..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(false)}
            className="astryx-kbd cursor-pointer hover:text-foreground"
          >
            ESC
          </button>
        </div>

        {/* Results Stream */}
        <div className="max-h-[420px] overflow-y-auto p-3.5 space-y-4">
          
          {/* Quick Dictionary Lookup Results */}
          {matchedWords.length > 0 && (
            <div className="space-y-1.5">
              <div className="px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Tra nhanh Từ vựng ({matchedWords.length})
              </div>
              {matchedWords.map((w, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl border border-border bg-secondary/40 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground text-sm">{w.en}</span>
                      <span className="font-mono text-muted-foreground">{w.ipa}</span>
                      <Badge variant="pastel" className="text-[10px]">{w.lv}</Badge>
                    </div>
                    <div className="text-foreground/90 font-medium">{w.vi}</div>
                    {w.ex && <div className="text-[11px] text-muted-foreground italic">"{w.ex}"</div>}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => speak(w.en, { voiceName: settings.voice, rate: settings.rate })}
                      title="Nghe phát âm"
                    >
                      <Icons.Volume className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        addWordToReview(w);
                        showToast(`Đã lưu "${w.en}" vào Sổ tay!`, 'success');
                      }}
                      title="Lưu vào sổ tay"
                    >
                      <Icons.Plus className="w-3.5 h-3.5" />
                      <span>Lưu</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Irregular Verbs Matches */}
          {matchedVerbs.length > 0 && (
            <div className="space-y-1.5">
              <div className="px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Động từ bất quy tắc (V1 → V2 → V3)
              </div>
              {matchedVerbs.map((v, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl border border-border bg-secondary/40 text-xs"
                >
                  <div>
                    <div className="font-bold text-foreground">
                      <span className="text-primary">{v.v1}</span> → <span>{v.v2}</span> → <span className="underline">{v.v3}</span>
                    </div>
                    <div className="text-muted-foreground text-[11px] mt-0.5">{v.vi} · "{v.ex}"</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => speak(`${v.v1}, ${v.v2}, ${v.v3}`, { voiceName: settings.voice, rate: settings.rate })}
                  >
                    <Icons.Volume className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Navigation Modules */}
          {navActions.length > 0 && (
            <div className="space-y-1">
              <div className="px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Điều hướng nhanh
              </div>
              {navActions.map(item => {
                const IconComp = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      item.action();
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-secondary/80 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-primary/12 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-foreground truncate">{item.title}</div>
                        <div className="text-[11px] text-muted-foreground truncate">{item.sub}</div>
                      </div>
                    </div>
                    <Icons.ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Theme Switcher Matches */}
          {matchedThemes.length > 0 && (
            <div className="space-y-1">
              <div className="px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Giao diện Pastel shadcn/ui
              </div>
              {matchedThemes.map(th => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => {
                    updateSettings({ astryxTheme: th.id });
                    setIsCommandPaletteOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-secondary/80 text-left text-xs"
                >
                  <span className="flex items-center gap-2 font-semibold">
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: th.preview.accent }} />
                    <span>Đổi sang {th.name}</span>
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">{th.package}</span>
                </button>
              ))}
            </div>
          )}

          {navActions.length === 0 && matchedWords.length === 0 && matchedVerbs.length === 0 && (
            <div className="py-8 text-center text-xs text-muted-foreground">
              Không tìm thấy kết quả phù hợp cho "{query}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-border bg-secondary/40 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Gõ tên từ tiếng Anh hoặc tiếng Việt bất kỳ để tra từ điển tức thì</span>
          <span className="hidden sm:inline">Nhấn <AstryxKbd>Enter</AstryxKbd> để mở mục đầu tiên</span>
        </div>
      </div>
    </div>
  );
}
