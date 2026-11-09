import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { callAIJSON, isAIConfigured } from '../services/ai';
import { speak } from '../services/tts';
import AudioPlayer from './AudioPlayer';
import { AstryxCard, AstryxButton, AstryxBadge } from '../astryx/components';
import { Icons } from './Icons';

function norm(s) {
  return String(s || '').toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9' ]/g, " ").replace(/\s+/g, " ").trim();
}

function lcs(a, b) {
  const n = a.length, m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const ma = new Array(n).fill(false), mb = new Array(m).fill(false);
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      ma[i] = mb[j] = true;
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      i++;
    } else {
      j++;
    }
  }
  return { ma, mb, len: dp[0][0] };
}

export default function DictationTab() {
  const { settings, updateSettings, awardPoints, addMistakeNote, showToast, t } = useApp();

  const [sentences, setSentences] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showVi, setShowVi] = useState(false);
  const [revealedWordIndices, setRevealedWordIndices] = useState([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [diffResult, setDiffResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const loadSentences = async () => {
    const data = await api.getSentences(settings.level, settings.range);
    setSentences(data || []);
    setCurrentIndex(0);
  };

  useEffect(() => {
    loadSentences();
  }, [settings.level, settings.range]);

  const currentSentence = sentences[currentIndex] || null;

  useEffect(() => {
    if (!currentSentence) return;
    setUserInput('');
    setShowVi(false);
    setRevealedWordIndices([]);
    setIsAnswered(false);
    setDiffResult(null);

    speak(currentSentence.en, { voiceName: settings.voice, rate: settings.rate });
  }, [currentIndex, currentSentence]);

  const handleRevealWord = (idx) => {
    if (!revealedWordIndices.includes(idx)) {
      setRevealedWordIndices(prev => [...prev, idx]);
    }
  };

  const handleCheck = () => {
    const raw = userInput.trim();
    if (!raw || isAnswered || !currentSentence) return;

    const ut = raw.split(/\s+/).map(tok => ({ t: tok, k: norm(tok) })).filter(x => x.k);
    const rt = currentSentence.en.split(/\s+/).map(tok => ({ t: tok, k: norm(tok) })).filter(x => x.k);

    const r = lcs(ut.map(x => x.k), rt.map(x => x.k));
    const score = (ut.length + rt.length) > 0 ? Math.round(200 * r.len / (ut.length + rt.length)) : 0;

    setDiffResult({
      score,
      ut,
      rt,
      ma: r.ma,
      mb: r.mb
    });
    setIsAnswered(true);

    const ok = score >= 85;
    awardPoints('dictation', ok, Math.round(score / 20));

    if (score < 100) {
      addMistakeNote({
        type: 'Nghe chép',
        wrong: raw,
        fix: currentSentence.en,
        why: currentSentence.vi
      });
    }
  };

  const handleNext = async () => {
    const wantAI = isAIConfigured(settings.ai) && (settings.source === 'ai' || (settings.source === 'mix' && Math.random() < 0.5));
    if (wantAI) {
      await handleGenAI();
      return;
    }

    if (currentIndex + 1 < sentences.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleGenAI = async () => {
    if (!isAIConfigured(settings.ai)) {
      showToast('Cần cấu hình AI để tạo câu mới.', 'error');
      return;
    }
    setIsGenerating(true);
    try {
      const prompt = `Create one natural English sentence for dictation practice for a CEFR ${settings.level} learner (6-12 words).
Return JSON: {"en":"...","vi":"Vietnamese meaning"}`;
      const res = await callAIJSON(prompt, 'English Teacher', settings.ai);
      const newS = {
        id: Date.now(),
        lv: `${settings.level} · AI`,
        en: res.en.trim(),
        vi: res.vi.trim()
      };
      setSentences(prev => [newS, ...prev]);
      setCurrentIndex(0);
      showToast('Đã tạo câu mới bằng AI!', 'success');
    } catch (err) {
      showToast('Lỗi tạo câu: ' + err.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!currentSentence) {
    return <div className="text-center py-12 text-muted-foreground">Đang tải bài nghe chép...</div>;
  }

  const targetWords = currentSentence.en.split(/\s+/);

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
        <div>
          <h2 className="text-lg md:text-xl font-bold tracking-tight text-foreground">
            {t('Nghe chép chính tả')}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t('Nghe câu tiếng Anh rồi gõ lại chính xác những gì nghe được.')}
          </p>
        </div>

        <AstryxButton
          variant="outline"
          size="sm"
          icon={Icons.Sparkles}
          isLoading={isGenerating}
          onClick={handleGenAI}
        >
          {t('Câu mới bằng AI')}
        </AstryxButton>
      </div>

      {/* Main Card */}
      <AstryxCard padding="lg" className="space-y-6">
        
        {/* Audio Player & Speed Controls */}
        <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-border bg-muted/20">
          <AudioPlayer text={currentSentence.en} size="lg" />
          <AudioPlayer text={currentSentence.en} slow={true} size="lg" />

          <AstryxButton
            variant="outline"
            size="sm"
            onClick={() => setShowVi(!showVi)}
          >
            {showVi ? 'Ẩn nghĩa' : t('Xem nghĩa')}
          </AstryxButton>

          <AstryxBadge status="accent">
            {currentSentence.lv || settings.level}
          </AstryxBadge>

          {/* Playback Speed Pills */}
          <div className="flex items-center gap-1 ml-auto">
            {[0.75, 1.0, 1.2].map(spd => (
              <button
                key={spd}
                type="button"
                onClick={() => {
                  updateSettings({ rate: spd }, true);
                  speak(currentSentence.en, { voiceName: settings.voice, rate: spd });
                }}
                className={`px-2 py-1 rounded text-[11px] font-bold border transition-all ${
                  Math.abs((settings.rate || 1.0) - spd) < 0.05
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {showVi && (
          <div className="p-3.5 rounded-xl border border-border bg-muted/30 text-xs sm:text-sm text-foreground font-medium animate-in fade-in">
            <strong>Nghĩa tiếng Việt:</strong> {currentSentence.vi}
          </div>
        )}

        {/* Interactive Word-by-Word Mask Hint Bar */}
        {settings.hints && !isAnswered && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Gợi ý khung từ ({targetWords.length} từ — bấm vào ô từ bị lỡ để mở gợi ý):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {targetWords.map((w, idx) => {
                const isRevealed = revealedWordIndices.includes(idx);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleRevealWord(idx)}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono border transition-all ${
                      isRevealed
                        ? 'border-primary/40 bg-primary/10 text-primary font-bold'
                        : 'border-dashed border-border bg-muted/40 text-muted-foreground hover:border-primary/40'
                    }`}
                    title="Bấm để hiện từ này"
                  >
                    {isRevealed ? w : `${w[0]}${'•'.repeat(Math.max(1, w.length - 1))}`}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Input Textarea */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            {t('Bạn nghe được')}
          </label>
          <textarea
            value={userInput}
            disabled={isAnswered}
            onChange={e => setUserInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (isAnswered) handleNext();
                else handleCheck();
              }
            }}
            placeholder="Gõ lại câu tiếng Anh bạn nghe được (Nhấn Enter để kiểm tra)..."
            rows={3}
            className="astryx-textarea w-full p-3.5 text-sm font-medium resize-none"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <AstryxButton
            variant="primary"
            onClick={handleCheck}
            disabled={!userInput.trim() || isAnswered}
          >
            {t('Kiểm tra')}
          </AstryxButton>

          {isAnswered && (
            <AstryxButton variant="secondary" onClick={handleNext}>
              {t('Câu tiếp')} →
            </AstryxButton>
          )}
        </div>

        {/* LCS Diff Breakdown */}
        {diffResult && (
          <div className="p-5 rounded-xl border border-border bg-muted/20 space-y-3.5 animate-in fade-in">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-foreground">
                {diffResult.score}%
              </span>
              <span className="text-xs text-muted-foreground font-semibold">độ chính xác (LCS)</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                {t('Bạn viết')}
              </span>
              <div className="p-3 rounded-lg border border-border bg-card text-sm flex flex-wrap gap-1.5">
                {diffResult.ut.map((item, idx) => {
                  const isMatch = diffResult.ma[idx];
                  return (
                    <span
                      key={idx}
                      className={isMatch ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-destructive line-through'}
                    >
                      {item.t}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                {t('Câu đúng')}
              </span>
              <div className="p-3 rounded-lg border border-border bg-card text-sm flex flex-wrap gap-1.5">
                {diffResult.rt.map((item, idx) => {
                  const isMatch = diffResult.mb[idx];
                  return (
                    <span
                      key={idx}
                      className={isMatch ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-destructive border-b-2 border-destructive font-bold'}
                    >
                      {item.t}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-muted-foreground">
                {currentSentence.vi}
              </p>
              <AudioPlayer text={currentSentence.en} size="sm" />
            </div>
          </div>
        )}

      </AstryxCard>

    </div>
  );
}
