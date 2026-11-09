import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { callAIJSON, isAIConfigured } from '../services/ai';
import AudioPlayer from './AudioPlayer';
import { AstryxCard, AstryxButton, AstryxBadge } from '../astryx/components';
import { Icons } from './Icons';

export default function TranslateTab() {
  const { settings, awardPoints, addMistakeNote, addWordToReview, showToast, customPassages, addCustomPassage, t } = useApp();

  const [passages, setPassages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showSample, setShowSample] = useState(false);
  const [kwText, setKwText] = useState('');
  const [isGettingKw, setIsGettingKw] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const [customVi, setCustomVi] = useState('');
  const [customEn, setCustomEn] = useState('');

  const loadPassages = async () => {
    const data = await api.getPassages(settings.level, settings.range);
    const combined = [...customPassages, ...(data || [])];
    setPassages(combined);
    setCurrentIndex(0);
    resetState();
  };

  useEffect(() => {
    loadPassages();
  }, [settings.level, settings.range, customPassages.length]);

  const currentPassage = passages[currentIndex] || null;

  const resetState = () => {
    setUserInput('');
    setShowSample(false);
    setKwText('');
    setResult(null);
  };

  const handleNext = async () => {
    const wantAI = isAIConfigured(settings.ai) && (settings.source === 'ai' || (settings.source === 'mix' && Math.random() < 0.5));
    if (wantAI) {
      await handleGenAI();
      return;
    }

    if (passages.length > 0) {
      setCurrentIndex((currentIndex + 1) % passages.length);
      resetState();
    }
  };

  const handleGetKw = async () => {
    if (kwText) {
      setKwText('');
      return;
    }

    if (currentPassage.kw) {
      setKwText(currentPassage.kw);
      return;
    }

    if (!isAIConfigured(settings.ai)) {
      setKwText('Đoạn này chưa có gợi ý sẵn. Hãy cấu hình AI để gợi ý từ vựng tự động.');
      return;
    }

    setIsGettingKw(true);
    try {
      const prompt = `List 3-5 key words a learner needs to translate this Vietnamese text into English: """${currentPassage.vi}""". Do not translate the whole text. Return JSON: {"kw":"tiếng Việt = English; ..."}`;
      const res = await callAIJSON(prompt, 'English Teacher', settings.ai);
      setKwText(res.kw || '');
    } catch (err) {
      setKwText('Lỗi: ' + err.message);
    } finally {
      setIsGettingKw(false);
    }
  };

  const handleGrade = async () => {
    if (!userInput.trim()) {
      showToast('Bạn chưa viết bản dịch.', 'error');
      return;
    }
    if (!currentPassage) return;

    setIsGrading(true);
    setResult(null);

    const hasAI = isAIConfigured(settings.ai);

    if (hasAI) {
      try {
        const strictDesc = {
          easy: "Be encouraging and lenient: focus on whether the meaning is right and ignore minor slips.",
          normal: "Grade fairly: meaning, grammar and naturalness all matter.",
          strict: "Grade strictly like an IELTS examiner: penalise grammar, word choice, articles, punctuation and unnatural phrasing."
        }[settings.strictness || 'normal'];

        const system = `You are an English teacher. The learner is Vietnamese, CEFR level ${settings.level}. ${strictDesc} Always answer with valid JSON only, no markdown.`;
        const prompt = `Grade this Vietnamese-to-English translation.
Vietnamese: """${currentPassage.vi}"""
${currentPassage.en ? `Reference: """${currentPassage.en}"""` : ''}
Student: """${userInput.trim()}"""
Return JSON: {
  "score": 0-100,
  "summary": "1-2 sentence overall comment",
  "errors": [{"wrong":"the wrong part","fix":"corrected version","why":"explanation"}],
  "better": "a natural improved English version close to the student's wording",
  "tip": "one tip for next time"
}`;
        const res = await callAIJSON(prompt, system, settings.ai);
        const score = Math.max(0, Math.min(100, parseInt(res.score, 10) || 70));

        awardPoints('translate', score >= 70, Math.round(score / 10));

        if (res.errors && res.errors.length) {
          res.errors.forEach(e => {
            addMistakeNote({ type: 'Dịch', wrong: e.wrong, fix: e.fix, why: e.why });
          });
        }

        setResult({
          score,
          summary: res.summary,
          errors: res.errors || [],
          better: res.better || currentPassage.en,
          tip: res.tip,
          isAI: true
        });
      } catch (err) {
        showToast('AI lỗi, chuyển sang chấm nhanh: ' + err.message, 'error');
        gradeLocalFallback();
      }
    } else {
      gradeLocalFallback();
    }

    setIsGrading(false);
  };

  const gradeLocalFallback = () => {
    if (!currentPassage.en) {
      setResult({
        score: 0,
        summary: 'Đoạn này không có đáp án mẫu. Cần cài API key để chấm.',
        better: '',
        isAI: false
      });
      return;
    }

    const norm = s => String(s || '').toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9' ]/g, " ").replace(/\s+/g, " ").trim();
    const u = norm(userInput).split(' ').filter(Boolean);
    const r = norm(currentPassage.en).split(' ').filter(Boolean);
    const bag = {};
    r.forEach(w => { bag[w] = (bag[w] || 0) + 1; });
    let hit = 0;
    u.forEach(w => {
      if (bag[w]) { hit++; bag[w]--; }
    });

    const p = hit / u.length;
    const rc = hit / r.length;
    const score = (p + rc) > 0 ? Math.round(200 * p * rc / (p + rc)) : 0;

    awardPoints('translate', score >= 70, Math.round(score / 10));

    setResult({
      score,
      summary: 'Chấm nhanh bằng thuật toán F1 so khớp từ với đáp án mẫu. Kết nối AI để nhận sửa lỗi ngữ pháp từng câu.',
      better: currentPassage.en,
      isAI: false
    });
  };

  const handleGenAI = async () => {
    if (!isAIConfigured(settings.ai)) {
      showToast('Cần cấu hình AI để tạo đoạn mới.', 'error');
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Create one new Vietnamese paragraph for a learner to translate into English. CEFR Level: ${settings.level}. Topic: daily life or work. Return JSON: {"vi":"...","en":"natural English translation","kw":"3-5 key words formatted as 'tiếng Việt = English; ...'"}`;
      const res = await callAIJSON(prompt, 'English Teacher', settings.ai);
      const newP = {
        id: Date.now(),
        lv: `${settings.level} · AI`,
        vi: res.vi,
        en: res.en,
        kw: res.kw
      };
      setPassages(prev => [newP, ...prev]);
      setCurrentIndex(0);
      resetState();
      showToast('Đã tạo đoạn mới bằng AI!', 'success');
    } catch (err) {
      showToast('Lỗi tạo đoạn: ' + err.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddCustom = () => {
    if (!customVi.trim()) return;
    const newP = {
      id: Date.now(),
      lv: 'Của bạn',
      vi: customVi.trim(),
      en: customEn.trim(),
      kw: ''
    };
    addCustomPassage(newP);
    setCustomVi('');
    setCustomEn('');
    setCurrentIndex(0);
    resetState();
  };

  if (!currentPassage) {
    return <div className="text-center py-12 text-muted-foreground">{t('Đoạn tiếp')}...</div>;
  }

  // Parse keyword pairs ("sinh viên = student; bóng đá = football") into clickable chips
  const kwPairs = kwText
    ? kwText
        .split(';')
        .map(s => s.trim())
        .filter(Boolean)
        .map(pair => {
          const [viPart, enPart] = pair.split('=').map(x => x?.trim());
          return { raw: pair, vi: viPart, en: enPart };
        })
    : [];

  const wordCount = userInput.trim() ? userInput.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in duration-200">
      
      {/* Main Practice Card */}
      <AstryxCard padding="lg" className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
          <div>
            <h2 className="text-lg md:text-xl font-bold tracking-tight text-foreground">
              {t('Dịch đoạn văn')}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('Đọc đoạn tiếng Việt và viết bản tiếng Anh vào ô bên dưới.')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <AstryxBadge status="accent">{currentPassage.lv}</AstryxBadge>
            <span className="text-xs text-muted-foreground font-semibold">
              Đoạn {currentIndex + 1}/{passages.length}
            </span>
          </div>
        </div>

        {/* Source Vietnamese Section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t('Tiếng Việt')}
            </span>
            {settings.hints && (
              <button
                type="button"
                onClick={handleGetKw}
                disabled={isGettingKw}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <Icons.Lightbulb className="w-3.5 h-3.5" />
                <span>{kwText ? 'Ẩn gợi ý từ khoá' : t('Gợi ý từ vựng')}</span>
              </button>
            )}
          </div>

          <div className="p-4 sm:p-5 rounded-xl border border-border bg-muted/30 text-base md:text-lg text-foreground font-medium leading-relaxed">
            {currentPassage.vi}
          </div>

          {/* Clickable Keyword Chips */}
          {kwPairs.length > 0 && (
            <div className="p-3.5 rounded-xl border border-primary/25 bg-primary/5 space-y-2 animate-in fade-in">
              <div className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Từ khoá gợi ý (Bấm để chèn vào bài dịch hoặc lưu Sổ tay):
              </div>
              <div className="flex flex-wrap gap-2">
                {kwPairs.map((kp, i) => (
                  <div key={i} className="inline-flex items-center rounded-lg border border-border bg-card px-2.5 py-1 text-xs gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (kp.en) {
                          setUserInput(prev => (prev ? `${prev.trim()} ${kp.en} ` : `${kp.en} `));
                        }
                      }}
                      className="text-left hover:text-primary transition-colors"
                      title="Bấm để chèn từ tiếng Anh vào ô dịch"
                    >
                      <span className="text-muted-foreground">{kp.vi}</span>
                      {kp.en && <span className="font-bold text-foreground"> = {kp.en}</span>}
                    </button>
                    {kp.en && (
                      <button
                        type="button"
                        onClick={() => {
                          addWordToReview({ en: kp.en, vi: kp.vi, lv: settings.level });
                          showToast(`Đã lưu "${kp.en}" vào Sổ tay!`, 'success');
                        }}
                        className="text-muted-foreground hover:text-primary"
                        title="Lưu vào sổ tay"
                      >
                        <Icons.Plus className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Translation Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t('Bản dịch của bạn')}
            </label>
            <span className="text-[11px] text-muted-foreground font-mono">
              {wordCount} words
            </span>
          </div>
          <textarea
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            placeholder="Write your natural English translation here..."
            rows={4}
            className="astryx-textarea w-full p-3.5 text-sm leading-relaxed resize-y"
          />
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <AstryxButton
            variant="primary"
            isLoading={isGrading}
            onClick={handleGrade}
          >
            {isGrading ? 'Đang chấm...' : t('Chấm điểm')}
          </AstryxButton>

          <AstryxButton
            variant="secondary"
            onClick={() => setShowSample(!showSample)}
          >
            {showSample ? 'Ẩn đáp án' : t('Xem đáp án mẫu')}
          </AstryxButton>

          <div className="flex-1" />

          <AstryxButton
            variant="outline"
            size="sm"
            icon={Icons.Sparkles}
            isLoading={isGenerating}
            onClick={handleGenAI}
          >
            {t('Tạo đoạn mới bằng AI')}
          </AstryxButton>

          <AstryxButton
            variant="ghost"
            size="sm"
            onClick={handleNext}
          >
            {t('Đoạn tiếp')} →
          </AstryxButton>
        </div>

        {/* Sample Answer Box */}
        {showSample && (
          <div className="p-4 rounded-xl border border-border bg-muted/40 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
              <span>{t('Đáp án mẫu')}</span>
              {currentPassage.en && <AudioPlayer text={currentPassage.en} size="sm" />}
            </div>
            <p className="text-sm font-semibold text-foreground leading-relaxed">
              {currentPassage.en || t('Đoạn này chưa có đáp án mẫu. Bấm Chấm điểm (cần AI) để nhận bản dịch gợi ý.')}
            </p>
          </div>
        )}

        {/* Feedback Section */}
        {result && (
          <div className="p-5 rounded-xl border border-border bg-muted/20 space-y-4 animate-in fade-in">
            <div className="flex items-baseline gap-2.5">
              <span className={`text-3xl font-extrabold tracking-tight ${
                result.score >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-primary'
              }`}>
                {result.score}/100
              </span>
              <AstryxBadge status={result.isAI ? 'accent' : 'neutral'}>
                {result.isAI ? 'AI Teacher Grading' : 'Local F1 Score'}
              </AstryxBadge>
            </div>

            <p className="text-sm text-foreground/90 leading-relaxed">
              {result.summary}
            </p>

            {/* Error List */}
            {result.errors && result.errors.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-destructive block">
                  {t('Lỗi cần sửa')}
                </span>
                <div className="space-y-1.5">
                  {result.errors.map((err, i) => (
                    <div key={i} className="p-3 rounded-lg border border-border bg-card text-xs">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="line-through text-destructive font-medium">{err.wrong}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">{err.fix}</span>
                      </div>
                      {err.why && <p className="text-muted-foreground text-[11px] mt-1">{err.why}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Better Version */}
            {result.better && (
              <div className="pt-2 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                  <span>{t('Bản dịch tự nhiên hơn')}</span>
                  <AudioPlayer text={result.better} size="sm" />
                </div>
                <div className="p-3.5 rounded-lg border border-border bg-card text-sm font-semibold text-foreground leading-relaxed">
                  {result.better}
                </div>
              </div>
            )}

            {result.tip && (
              <p className="text-xs text-muted-foreground italic pt-1">
                💡 Mẹo: {result.tip}
              </p>
            )}
          </div>
        )}

      </AstryxCard>

      {/* Add Custom Passage Card */}
      <AstryxCard padding="md" className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-foreground">
            {t('Thêm đoạn của riêng bạn')}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t('Dán đoạn tiếng Việt muốn luyện. Đáp án mẫu có thể để trống nếu đã cài AI.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              {t('Đoạn tiếng Việt')}
            </label>
            <textarea
              value={customVi}
              onChange={e => setCustomVi(e.target.value)}
              rows={3}
              className="astryx-textarea w-full p-2.5 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              {t('Đáp án mẫu (tuỳ chọn)')}
            </label>
            <textarea
              value={customEn}
              onChange={e => setCustomEn(e.target.value)}
              rows={3}
              className="astryx-textarea w-full p-2.5 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <AstryxButton
            variant="primary"
            size="sm"
            disabled={!customVi.trim()}
            onClick={handleAddCustom}
          >
            {t('Thêm và luyện ngay')}
          </AstryxButton>
          {customPassages.length > 0 && (
            <span className="text-xs text-muted-foreground">
              Bạn đã thêm {customPassages.length} đoạn.
            </span>
          )}
        </div>
      </AstryxCard>

    </div>
  );
}
