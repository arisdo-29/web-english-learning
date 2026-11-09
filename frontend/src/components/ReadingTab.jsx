import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { STATIC_VOCAB, LEVELS } from '../data/staticData';
import { callAIJSON, isAIConfigured } from '../services/ai';
import { speak } from '../services/tts';
import AudioPlayer from './AudioPlayer';
import { AstryxCard, AstryxButton, AstryxBadge, AstryxSegmentedControl } from '../astryx/components';
import { Icons } from './Icons';

export default function ReadingTab() {
  const { settings, awardPoints, addWordToReview, addMistakeNote, showToast, t } = useApp();

  const [readings, setReadings] = useState([]);
  const [selectedLevelFilter, setSelectedLevelFilter] = useState('ALL');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBilingual, setShowBilingual] = useState(false);
  const [selectedWordInfo, setSelectedWordInfo] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Build quick dictionary map from STATIC_VOCAB
  const vocabLookupMap = useMemo(() => {
    const map = {};
    Object.entries(STATIC_VOCAB).forEach(([lv, arr]) => {
      arr.forEach(w => {
        map[w.en.toLowerCase()] = { ...w, lv };
      });
    });
    return map;
  }, []);

  useEffect(() => {
    const load = async () => {
      const data = await api.getReadings(settings.level);
      setReadings(data || []);
      setCurrentIndex(0);
    };
    load();
  }, [settings.level]);

  const filteredReadings = useMemo(() => {
    if (selectedLevelFilter === 'ALL') return readings;
    const filtered = readings.filter(r => r.lv.startsWith(selectedLevelFilter));
    return filtered.length ? filtered : readings;
  }, [readings, selectedLevelFilter]);

  const currentReading = filteredReadings[currentIndex] || filteredReadings[0] || null;

  useEffect(() => {
    setAnswers({});
    setIsSubmitted(false);
    setSelectedWordInfo(null);
  }, [currentReading?.id]);

  const handleWordClick = (rawWord) => {
    const cleaned = rawWord.replace(/[^a-zA-Z'-]/g, '').toLowerCase();
    if (!cleaned) return;

    speak(cleaned, { voiceName: settings.voice, rate: settings.rate });

    // Check article glossary first, then global vocab
    const fromGlossary = (currentReading?.glossary || []).find(
      g => g.en.toLowerCase().includes(cleaned) || cleaned.includes(g.en.toLowerCase())
    );
    const fromVocab = vocabLookupMap[cleaned] || vocabLookupMap[cleaned.replace(/s$|ed$|ing$/, '')];

    if (fromGlossary) {
      setSelectedWordInfo({
        en: fromGlossary.en,
        vi: fromGlossary.vi,
        ipa: fromGlossary.ipa || '',
        lv: currentReading.lv
      });
    } else if (fromVocab) {
      setSelectedWordInfo(fromVocab);
    } else {
      setSelectedWordInfo({
        en: cleaned,
        vi: 'Bấm "Dịch nhanh AI" hoặc lưu vào Sổ tay để ôn tập',
        ipa: '',
        lv: currentReading?.lv || settings.level,
        isUnknown: true
      });
    }
  };

  const handleQuickDefineAI = async (word) => {
    if (!isAIConfigured(settings.ai)) {
      showToast('Hãy cấu hình AI trong Cài đặt để dịch từ tự động.', 'info');
      return;
    }
    try {
      const res = await callAIJSON(
        `Define the English word "${word}" in the context of: "${currentReading?.title}". Return JSON: {"vi":"nghĩa tiếng Việt ngắn gọn","ipa":"/IPA/","ex":"short example"}`,
        'English Dictionary',
        settings.ai
      );
      setSelectedWordInfo({
        en: word,
        vi: res.vi || word,
        ipa: res.ipa || '',
        ex: res.ex || '',
        lv: settings.level
      });
    } catch (err) {
      showToast('Không thể tra từ AI: ' + err.message, 'error');
    }
  };

  const handleSubmitQuiz = () => {
    if (!currentReading) return;
    const qs = currentReading.questions || [];
    if (Object.keys(answers).length < qs.length) {
      showToast('Hãy chọn đáp án cho tất cả câu hỏi đọc hiểu.', 'info');
      return;
    }

    setIsSubmitted(true);
    let right = 0;
    qs.forEach((q, idx) => {
      if (answers[idx] === q.answer) {
        right++;
      } else {
        addMistakeNote({
          type: 'Đọc hiểu',
          wrong: `${q.q} → ${q.options[answers[idx]]}`,
          fix: q.options[q.answer],
          why: q.explain
        });
      }
    });

    const isGood = right >= Math.ceil(qs.length / 2);
    awardPoints('reading', isGood, right * 4);
    showToast(`Bạn trả lời đúng ${right}/${qs.length} câu (+${right * 4} XP)!`, isGood ? 'success' : 'info');
  };

  const handleGenAIReading = async () => {
    if (!isAIConfigured(settings.ai)) {
      showToast('Cần cấu hình AI trong Cài đặt để tạo bài đọc mới.', 'error');
      return;
    }
    setIsGenerating(true);
    try {
      const prompt = `Write an engaging English reading comprehension passage (90-130 words) for a CEFR ${settings.level} learner about technology, travel, or daily habits.
Return JSON: {
  "title": "English Title",
  "titleVi": "Tiêu đề tiếng Việt",
  "topic": "Chủ đề",
  "content": "Full English paragraph...",
  "contentVi": "Bản dịch tiếng Việt đầy đủ...",
  "glossary": [{"en":"word","vi":"nghĩa","ipa":"/ipa/"}],
  "questions": [
    {"q":"Question 1?","options":["A","B","C","D"],"answer":0,"explain":"Giải thích ngắn bằng tiếng Việt"},
    {"q":"Question 2?","options":["A","B","C","D"],"answer":1,"explain":"Giải thích ngắn bằng tiếng Việt"},
    {"q":"Question 3?","options":["A","B","C","D"],"answer":2,"explain":"Giải thích ngắn bằng tiếng Việt"}
  ]
}`;
      const res = await callAIJSON(prompt, 'English Reading Curriculum Author', settings.ai);
      const newArticle = {
        id: 'ai-read-' + Date.now(),
        lv: `${settings.level}`,
        readTime: '3 phút',
        ...res
      };
      setReadings(prev => [newArticle, ...prev]);
      setSelectedLevelFilter('ALL');
      setCurrentIndex(0);
      showToast('Đã tạo bài đọc hiểu mới bằng AI!', 'success');
    } catch (err) {
      showToast('Lỗi tạo bài đọc: ' + err.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!currentReading) {
    return <div className="py-12 text-center text-muted-foreground">Đang tải bài đọc hiểu...</div>;
  }

  const tokens = (currentReading.content || '').split(/(\s+)/);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in duration-200">
      
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg md:text-xl font-bold tracking-tight text-foreground">
              {t('Đọc hiểu & Từ vựng')}
            </h2>
            <AstryxBadge status="accent">Interactive Reader</AstryxBadge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Bấm trực tiếp vào bất kỳ từ tiếng Anh nào trong bài để nghe phát âm và tra nghĩa tức thì.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <AstryxSegmentedControl
            size="sm"
            value={selectedLevelFilter}
            onChange={(val) => {
              setSelectedLevelFilter(val);
              setCurrentIndex(0);
            }}
            options={[
              { value: 'ALL', label: 'Tất cả' },
              ...LEVELS.map(lv => ({ value: lv, label: lv }))
            ]}
          />

          <AstryxButton
            variant="outline"
            size="sm"
            icon={Icons.Sparkles}
            isLoading={isGenerating}
            onClick={handleGenAIReading}
          >
            Bài đọc AI
          </AstryxButton>
        </div>
      </div>

      {/* Article Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {filteredReadings.map((item, idx) => {
          const active = item.id === currentReading.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border shrink-0 transition-all flex items-center gap-1.5 ${
                active
                  ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <span className="font-extrabold">{item.lv}</span>
              <span>·</span>
              <span className="truncate max-w-[180px]">{item.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Reading Surface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Passage + Interactive Word Click */}
        <div className="lg:col-span-2 space-y-5">
          <AstryxCard padding="lg" className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <AstryxBadge status="positive">{currentReading.lv}</AstryxBadge>
                  <AstryxBadge status="neutral">{currentReading.topic || 'General'}</AstryxBadge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Icons.Clock className="w-3 h-3" />
                    {currentReading.readTime || '3 phút'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground pt-1">
                  {currentReading.title}
                </h3>
                <p className="text-xs text-muted-foreground font-medium">
                  {currentReading.titleVi}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <AudioPlayer text={currentReading.content} size="md" />
                <AudioPlayer text={currentReading.content} slow={true} size="md" />
                <AstryxButton
                  variant={showBilingual ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setShowBilingual(!showBilingual)}
                >
                  {showBilingual ? 'Ẩn song ngữ' : 'Song ngữ'}
                </AstryxButton>
              </div>
            </div>

            {/* Interactive Clickable Passage Text */}
            <div className="p-4 sm:p-5 rounded-xl border border-border bg-muted/20 text-base md:text-lg leading-relaxed text-foreground select-text">
              {tokens.map((tok, i) => {
                if (/^\s+$/.test(tok)) return <span key={i}>{tok}</span>;
                return (
                  <span
                    key={i}
                    onClick={() => handleWordClick(tok)}
                    className="cursor-pointer rounded px-0.5 -mx-0.5 hover:bg-primary/15 hover:text-primary transition-colors"
                    title="Bấm để nghe phát âm & xem nghĩa"
                  >
                    {tok}
                  </span>
                );
              })}
            </div>

            {/* Bilingual Translation Box */}
            {showBilingual && (
              <div className="p-4 rounded-xl border border-primary/25 bg-primary/5 text-sm leading-relaxed text-foreground/90 animate-in fade-in">
                <div className="text-[11px] font-bold uppercase tracking-wider text-primary mb-1">
                  Bản dịch tiếng Việt
                </div>
                {currentReading.contentVi}
              </div>
            )}

            {/* Instant Word Lookup Popover Bar */}
            {selectedWordInfo && (
              <div className="p-3.5 rounded-xl border border-primary/40 bg-card shadow-md flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base text-primary">{selectedWordInfo.en}</span>
                    {selectedWordInfo.ipa && (
                      <span className="text-xs font-mono text-muted-foreground">{selectedWordInfo.ipa}</span>
                    )}
                    <AudioPlayer text={selectedWordInfo.en} size="sm" />
                  </div>
                  <div className="text-xs font-medium text-foreground">
                    {selectedWordInfo.vi}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedWordInfo.isUnknown && (
                    <AstryxButton
                      variant="outline"
                      size="sm"
                      icon={Icons.Sparkles}
                      onClick={() => handleQuickDefineAI(selectedWordInfo.en)}
                    >
                      Dịch nhanh AI
                    </AstryxButton>
                  )}
                  <AstryxButton
                    variant="secondary"
                    size="sm"
                    icon={Icons.Plus}
                    onClick={() => {
                      addWordToReview(selectedWordInfo);
                      showToast(`Đã lưu "${selectedWordInfo.en}" vào Sổ tay!`, 'success');
                    }}
                  >
                    Lưu vào Sổ tay
                  </AstryxButton>
                </div>
              </div>
            )}

            {/* Key Glossary Chips */}
            {currentReading.glossary && currentReading.glossary.length > 0 && (
              <div className="pt-2 border-t border-border space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Từ vựng trọng tâm trong bài
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentReading.glossary.map((g, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg border border-border bg-muted/30 flex items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <span className="font-bold text-foreground">{g.en}</span>{' '}
                        {g.ipa && <span className="text-muted-foreground font-mono text-[11px]">{g.ipa}</span>}
                        <div className="text-muted-foreground mt-0.5">{g.vi}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <AudioPlayer text={g.en} size="sm" />
                        <button
                          type="button"
                          onClick={() => {
                            addWordToReview({ ...g, lv: currentReading.lv });
                            showToast(`Đã lưu "${g.en}" vào Sổ tay!`, 'success');
                          }}
                          className="astryx-btn astryx-btn-sm astryx-btn-ghost px-1.5"
                          title="Lưu từ này"
                        >
                          <Icons.Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </AstryxCard>
        </div>

        {/* Right Column: Comprehension Questions */}
        <div className="space-y-4">
          <AstryxCard padding="md" className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h4 className="font-bold text-sm text-foreground">Câu hỏi Đọc hiểu</h4>
                <p className="text-[11px] text-muted-foreground">Trả lời đúng mỗi câu +4 XP</p>
              </div>
              <AstryxBadge status="info">{(currentReading.questions || []).length} câu</AstryxBadge>
            </div>

            <div className="space-y-5">
              {(currentReading.questions || []).map((q, qIdx) => {
                const chosen = answers[qIdx];
                return (
                  <div key={qIdx} className="space-y-2 text-xs">
                    <div className="font-bold text-foreground leading-snug">
                      {qIdx + 1}. {q.q}
                    </div>
                    <div className="space-y-1.5">
                      {q.options.map((opt, oIdx) => {
                        const isPicked = chosen === oIdx;
                        const isRight = isSubmitted && oIdx === q.answer;
                        const isWrong = isSubmitted && isPicked && !isRight;

                        return (
                          <button
                            key={oIdx}
                            type="button"
                            disabled={isSubmitted}
                            onClick={() => setAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                            className={`w-full p-2.5 rounded-lg border text-left font-medium transition-all flex items-start gap-2 ${
                              isRight
                                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold'
                                : isWrong
                                  ? 'border-destructive bg-destructive/10 text-destructive'
                                  : isPicked
                                    ? 'border-primary bg-primary/10 text-primary font-semibold'
                                    : 'border-border bg-card hover:bg-muted/60 text-foreground'
                            }`}
                          >
                            <span className="text-muted-foreground font-mono">{String.fromCharCode(65 + oIdx)}.</span>
                            <span className="flex-1">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {isSubmitted && q.explain && (
                      <div className="p-2.5 rounded-lg bg-muted/50 border border-border text-[11px] text-muted-foreground">
                        <strong>Giải thích:</strong> {q.explain}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-border flex items-center gap-2">
              {!isSubmitted ? (
                <AstryxButton
                  variant="primary"
                  className="w-full"
                  onClick={handleSubmitQuiz}
                >
                  Nộp bài & Chấm điểm
                </AstryxButton>
              ) : (
                <AstryxButton
                  variant="secondary"
                  className="w-full"
                  onClick={() => {
                    setCurrentIndex((currentIndex + 1) % filteredReadings.length);
                  }}
                >
                  Bài đọc tiếp theo →
                </AstryxButton>
              )}
            </div>
          </AstryxCard>
        </div>

      </div>
    </div>
  );
}
