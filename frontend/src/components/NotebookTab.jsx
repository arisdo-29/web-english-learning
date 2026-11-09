import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { callAIJSON, isAIConfigured } from '../services/ai';
import AudioPlayer from './AudioPlayer';
import { AstryxCard, AstryxButton, AstryxBadge, AstryxSegmentedControl } from '../astryx/components';
import { Icons } from './Icons';

export default function NotebookTab() {
  const {
    notebookWords,
    notebookNotes,
    addWordToReview,
    updateWordMastery,
    removeWordFromReview,
    clearAllWords,
    clearAllNotes,
    setActiveTab,
    awardPoints,
    settings,
    showToast,
    t
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('words'); // 'words' | 'notes' | 'add'
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedWordUsage, setExpandedWordUsage] = useState({});
  const [usageLoading, setUsageLoading] = useState({});
  const [practiceSentences, setPracticeSentences] = useState({});
  const [sentenceResults, setSentenceResults] = useState({});
  const [sentenceChecking, setSentenceChecking] = useState({});

  // Manual word form state
  const [newWordEn, setNewWordEn] = useState('');
  const [newWordVi, setNewWordVi] = useState('');
  const [newWordIpa, setNewWordIpa] = useState('');

  // Confirmation state for clearing
  const [confirmClearWords, setConfirmClearWords] = useState(false);
  const [confirmClearNotes, setConfirmClearNotes] = useState(false);

  const handleClearWords = () => {
    if (!confirmClearWords) {
      setConfirmClearWords(true);
      setTimeout(() => setConfirmClearWords(false), 3000);
      return;
    }
    clearAllWords();
    setConfirmClearWords(false);
  };

  const handleClearNotes = () => {
    if (!confirmClearNotes) {
      setConfirmClearNotes(true);
      setTimeout(() => setConfirmClearNotes(false), 3000);
      return;
    }
    clearAllNotes();
    setConfirmClearNotes(false);
  };

  const handleAddManualWord = (e) => {
    e.preventDefault();
    if (!newWordEn.trim() || !newWordVi.trim()) return;
    addWordToReview({
      en: newWordEn.trim(),
      vi: newWordVi.trim(),
      ipa: newWordIpa.trim(),
      lv: settings.level,
      mastery: 0
    });
    setNewWordEn('');
    setNewWordVi('');
    setNewWordIpa('');
    setActiveSubTab('words');
    showToast(`Đã thêm "${newWordEn.trim()}" vào Sổ tay SRS!`, 'success');
  };

  const handleExportCSV = () => {
    if (!notebookWords.length) return;
    const rows = [
      ['English', 'IPA', 'Vietnamese', 'Level', 'Mastery (0-3)'],
      ...notebookWords.map(w => [
        `"${(w.en || '').replace(/"/g, '""')}"`,
        `"${(w.ipa || '').replace(/"/g, '""')}"`,
        `"${(w.vi || '').replace(/"/g, '""')}"`,
        w.lv || settings.level,
        w.mastery ?? 0
      ])
    ];
    const csvContent = '\uFEFF' + rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `so-tay-tu-vung-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Đã xuất Sổ tay ra file CSV!', 'success');
  };

  const handleToggleUsage = async (w, idx) => {
    if (expandedWordUsage[idx]) {
      setExpandedWordUsage(prev => ({ ...prev, [idx]: null }));
      return;
    }

    if (!isAIConfigured(settings.ai)) {
      setExpandedWordUsage(prev => ({ ...prev, [idx]: { error: 'Cần cấu hình AI để xem giải thích cách dùng từ. Vào Cài đặt > Kết nối AI.' } }));
      return;
    }

    setUsageLoading(prev => ({ ...prev, [idx]: true }));
    try {
      const prompt = `Explain how to use the English word "${w.en}" (meaning: ${w.vi}) for a CEFR ${settings.level} learner.
Return JSON: {
  "ipa": "${w.ipa || '/IPA/'}",
  "pos": "part of speech",
  "meaning": "short meaning in Vietnamese",
  "usage": "when and how to use it, in Vietnamese",
  "patterns": ["common patterns"],
  "examples": [
    {"en": "example sentence 1", "vi": "dịch nghĩa tiếng Việt"},
    {"en": "example sentence 2", "vi": "dịch nghĩa tiếng Việt"}
  ],
  "mistake": "common mistake"
}`;
      const res = await callAIJSON(prompt, 'English Teacher', settings.ai);
      setExpandedWordUsage(prev => ({ ...prev, [idx]: res }));
    } catch (err) {
      setExpandedWordUsage(prev => ({ ...prev, [idx]: { error: err.message } }));
    } finally {
      setUsageLoading(prev => ({ ...prev, [idx]: false }));
    }
  };

  const handleCheckSentence = async (w, idx) => {
    const text = practiceSentences[idx]?.trim();
    if (!text) return;

    setSentenceChecking(prev => ({ ...prev, [idx]: true }));
    try {
      const prompt = `The learner wrote this sentence to practise the word "${w.en}": """${text}""". Check if the word is used correctly and the sentence is grammatical and natural.
Return JSON: {
  "score": 0-10,
  "comment": "short feedback in Vietnamese",
  "fixed": "corrected natural version"
}`;
      const res = await callAIJSON(prompt, 'English Teacher', settings.ai);
      setSentenceResults(prev => ({ ...prev, [idx]: res }));
      if (res.score >= 7) awardPoints('vocab', true, 2);
    } catch (err) {
      setSentenceResults(prev => ({ ...prev, [idx]: { error: err.message } }));
    } finally {
      setSentenceChecking(prev => ({ ...prev, [idx]: false }));
    }
  };

  const filteredWords = notebookWords.filter(w => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return w.en?.toLowerCase().includes(q) || w.vi?.toLowerCase().includes(q);
  });

  const masteryBadges = [
    { label: 'Mới (Cần ôn)', status: 'negative' },
    { label: 'Đang học', status: 'warning' },
    { label: 'Sắp thuộc', status: 'info' },
    { label: 'Đã thuộc', status: 'positive' }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
        <div>
          <h2 className="text-lg md:text-xl font-bold tracking-tight text-foreground">
            {t('Sổ tay & Từ cần ôn')}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Quản lý từ vựng theo Spaced Repetition (SRS), tự thêm từ mới và xem lại lỗi ngữ pháp.
          </p>
        </div>

        <AstryxSegmentedControl
          value={activeSubTab}
          onChange={setActiveSubTab}
          options={[
            { value: 'words', label: t('Từ cần ôn'), badge: notebookWords.length },
            { value: 'notes', label: t('Lỗi đã mắc'), badge: notebookNotes.length },
            { value: 'add', label: '+ Thêm từ mới' }
          ]}
        />
      </div>

      {/* Subtab 1: Words */}
      {activeSubTab === 'words' && (
        <AstryxCard padding="lg" className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Icons.Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Tìm từ trong sổ tay..."
                className="astryx-input w-full pl-8 pr-3 py-2 text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <AstryxButton
                variant="primary"
                size="sm"
                disabled={!notebookWords.length}
                onClick={() => {
                  setActiveTab('vocab');
                  showToast('Bắt đầu ôn tập các từ trong Sổ tay!', 'info');
                }}
              >
                {t('Ôn các từ này')}
              </AstryxButton>

              <AstryxButton
                variant="outline"
                size="sm"
                icon={Icons.Download}
                disabled={!notebookWords.length}
                onClick={handleExportCSV}
              >
                Xuất CSV
              </AstryxButton>

              <AstryxButton
                variant="destructive"
                size="sm"
                disabled={!notebookWords.length}
                onClick={handleClearWords}
              >
                {confirmClearWords ? 'Xác nhận xoá?' : t('Xoá hết')}
              </AstryxButton>
            </div>
          </div>

          {filteredWords.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <p className="text-xs text-muted-foreground italic">
                Chưa có từ vựng nào trong danh sách.
              </p>
              <AstryxButton variant="secondary" size="sm" onClick={() => setActiveSubTab('add')}>
                + Tự thêm từ vựng đầu tiên
              </AstryxButton>
            </div>
          ) : (
            <div className="divide-y divide-border pt-1">
              {filteredWords.map((w, idx) => {
                const mLevel = w.mastery ?? 0;
                const mBadge = masteryBadges[mLevel] || masteryBadges[0];

                return (
                  <div key={idx} className="py-3.5 space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2.5 text-sm">
                      <span className="font-extrabold text-foreground">{w.en}</span>
                      {w.ipa && <span className="text-xs text-muted-foreground font-mono">{w.ipa}</span>}
                      <span className="text-muted-foreground">·</span>
                      <span className="text-foreground font-medium">{w.vi}</span>
                      {w.lv && <AstryxBadge status="neutral">{w.lv}</AstryxBadge>}

                      {/* Clickable SRS Mastery Badge */}
                      <button
                        type="button"
                        onClick={() => updateWordMastery(w.en, (mLevel + 1) % 4)}
                        title="Bấm để đổi trạng thái ghi nhớ SRS"
                      >
                        <AstryxBadge status={mBadge.status}>{mBadge.label}</AstryxBadge>
                      </button>

                      <div className="flex-1" />

                      <AudioPlayer text={w.en} size="sm" />

                      <AstryxButton
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleUsage(w, idx)}
                      >
                        {expandedWordUsage[idx] ? 'Ẩn' : t('Cách dùng và ví dụ')}
                      </AstryxButton>

                      <AstryxButton
                        variant="ghost"
                        size="sm"
                        onClick={() => removeWordFromReview(w.en)}
                        className="text-destructive"
                      >
                        {t('Xoá')}
                      </AstryxButton>
                    </div>

                    {usageLoading[idx] && (
                      <div className="p-3 rounded border border-border bg-muted/20 text-xs text-muted-foreground animate-pulse">
                        Đang tải phân tích cách dùng từ AI...
                      </div>
                    )}

                    {expandedWordUsage[idx] && (
                      <div className="p-4 rounded-xl border border-border bg-muted/20 text-xs space-y-2.5 animate-in fade-in">
                        {expandedWordUsage[idx].error ? (
                          <p className="text-destructive">{expandedWordUsage[idx].error}</p>
                        ) : (
                          <>
                            <div>
                              <span className="font-bold text-foreground uppercase tracking-wider block mb-0.5">
                                {t('Cách dùng')}:
                              </span>
                              <p className="text-muted-foreground">{expandedWordUsage[idx].usage}</p>
                            </div>

                            {expandedWordUsage[idx].patterns && (
                              <div>
                                <span className="font-bold text-foreground uppercase tracking-wider block mb-0.5">
                                  {t('Cụm từ hay gặp')}:
                                </span>
                                <p className="text-muted-foreground">{expandedWordUsage[idx].patterns.join(' · ')}</p>
                              </div>
                            )}

                            {expandedWordUsage[idx].examples && (
                              <div className="space-y-1.5">
                                <span className="font-bold text-foreground uppercase tracking-wider block">
                                  Ví dụ:
                                </span>
                                {expandedWordUsage[idx].examples.map((ex, exIdx) => (
                                  <div key={exIdx} className="p-2.5 rounded-lg border border-border bg-card">
                                    <div className="flex items-center justify-between font-semibold text-foreground">
                                      <span>{ex.en}</span>
                                      <AudioPlayer text={ex.en} size="sm" />
                                    </div>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">{ex.vi}</p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Sentence practice */}
                            <div className="pt-2 border-t border-border space-y-1.5">
                              <span className="font-bold text-foreground block">
                                Tự đặt câu với "{w.en}"
                              </span>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={practiceSentences[idx] || ''}
                                  onChange={e => setPracticeSentences(prev => ({ ...prev, [idx]: e.target.value }))}
                                  onKeyDown={e => { if (e.key === 'Enter') handleCheckSentence(w, idx); }}
                                  placeholder="Write your sentence..."
                                  className="astryx-input flex-1 p-2 text-xs"
                                />
                                <AstryxButton
                                  variant="outline"
                                  size="sm"
                                  isLoading={sentenceChecking[idx]}
                                  disabled={!practiceSentences[idx]?.trim()}
                                  onClick={() => handleCheckSentence(w, idx)}
                                >
                                  {t('Chấm câu')}
                                </AstryxButton>
                              </div>

                              {sentenceResults[idx] && (
                                <div className="p-2.5 rounded border border-border bg-card text-xs space-y-1">
                                  <div>
                                    <span className={`font-bold ${sentenceResults[idx].score >= 7 ? 'text-emerald-600' : 'text-destructive'}`}>
                                      {sentenceResults[idx].score}/10
                                    </span>{' '}
                                    <span>{sentenceResults[idx].comment}</span>
                                  </div>
                                  {sentenceResults[idx].fixed && (
                                    <div className="text-muted-foreground flex items-center gap-1.5">
                                      <span>Sửa: {sentenceResults[idx].fixed}</span>
                                      <AudioPlayer text={sentenceResults[idx].fixed} size="sm" />
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </AstryxCard>
      )}

      {/* Subtab 2: Mistake Notes */}
      {activeSubTab === 'notes' && (
        <AstryxCard padding="lg" className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-foreground">
                {t('Lỗi đã mắc')} ({notebookNotes.length})
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Tự động ghi nhận từ phần Dịch, Đọc hiểu, Phát âm, Sắp xếp câu, Điền từ và Hội thoại AI.
              </p>
            </div>

            <AstryxButton
              variant="destructive"
              size="sm"
              disabled={!notebookNotes.length}
              onClick={handleClearNotes}
            >
              {confirmClearNotes ? 'Xác nhận xoá?' : t('Xoá hết')}
            </AstryxButton>
          </div>

          {notebookNotes.length === 0 ? (
            <p className="text-xs text-muted-foreground py-8 text-center italic">
              Chưa có lỗi nào được lưu.
            </p>
          ) : (
            <div className="divide-y divide-border pt-1">
              {notebookNotes.map((n, idx) => (
                <div key={idx} className="py-3.5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <AstryxBadge status="accent">{n.type}</AstryxBadge>
                    <span>{n.date || 'Gần đây'}</span>
                  </div>

                  <div className="space-y-0.5 text-xs md:text-sm">
                    <div className="line-through text-destructive font-medium">
                      {n.wrong}
                    </div>
                    <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                      <span>{n.fix}</span>
                      <AudioPlayer text={n.fix} size="sm" />
                    </div>
                  </div>

                  {n.why && (
                    <p className="text-xs text-muted-foreground italic pt-0.5">
                      {n.why}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </AstryxCard>
      )}

      {/* Subtab 3: Add Custom Word */}
      {activeSubTab === 'add' && (
        <AstryxCard padding="lg" className="space-y-5 max-w-xl mx-auto">
          <div>
            <h3 className="font-bold text-base text-foreground">
              Thêm từ vựng mới vào Sổ tay SRS
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Lưu các từ bạn bắt gặp trong công việc, tài liệu hoặc phim ảnh để ôn tập bằng Flashcard 3D.
            </p>
          </div>

          <form onSubmit={handleAddManualWord} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground block">Từ hoặc cụm từ tiếng Anh *</label>
              <input
                type="text"
                required
                value={newWordEn}
                onChange={e => setNewWordEn(e.target.value)}
                placeholder="VD: resilient, take into account..."
                className="astryx-input w-full p-2.5 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground block">Nghĩa tiếng Việt *</label>
              <input
                type="text"
                required
                value={newWordVi}
                onChange={e => setNewWordVi(e.target.value)}
                placeholder="VD: kiên cường, bền bỉ; tính đến, cân nhắc..."
                className="astryx-input w-full p-2.5 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground block">Phiên âm IPA (Tuỳ chọn)</label>
              <input
                type="text"
                value={newWordIpa}
                onChange={e => setNewWordIpa(e.target.value)}
                placeholder="VD: /rɪˈzɪl.jənt/"
                className="astryx-input w-full p-2.5 text-sm font-mono"
              />
            </div>

            <AstryxButton type="submit" variant="primary" className="w-full">
              Lưu vào Sổ tay SRS
            </AstryxButton>
          </form>
        </AstryxCard>
      )}

    </div>
  );
}
