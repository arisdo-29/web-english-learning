import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { callAIJSON, isAIConfigured } from '../services/ai';
import { speak } from '../services/tts';
import AudioPlayer from './AudioPlayer';
import { Icons } from './Icons';

export default function ScrambleTab() {
  const { settings, awardPoints, addMistakeNote, showToast, t } = useApp();

  const [sentences, setSentences] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wordsPool, setWordsPool] = useState([]);
  const [pickedWords, setPickedWords] = useState([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
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

    const toks = currentSentence.en.split(/\s+/);
    let shuffled = toks.map((w, i) => ({ w, i }));
    for (let k = 0; k < 6; k++) {
      shuffled.sort(() => Math.random() - 0.5);
      if (shuffled.some((x, i) => x.i !== i)) break;
    }

    setWordsPool(shuffled);
    setPickedWords([]);
    setHintsUsed(0);
    setIsAnswered(false);
    setIsCorrect(false);
  }, [currentIndex, currentSentence]);

  const handlePickWord = (token) => {
    if (isAnswered) return;
    setPickedWords(prev => [...prev, token]);
  };

  const handleRemoveWord = (token) => {
    if (isAnswered) return;
    setPickedWords(prev => prev.filter(x => x.i !== token.i));
  };

  const handleReset = () => {
    setPickedWords([]);
    setIsAnswered(false);
  };

  // Smart hint algorithm from original HTML lines 1088-1092
  const handleHint = () => {
    if (isAnswered || !currentSentence) return;
    const target = currentSentence.en.split(/\s+/);
    let k = 0;
    while (k < pickedWords.length && pickedWords[k].w === target[k]) {
      k++;
    }
    if (k >= target.length) return;

    const validPrefix = pickedWords.slice(0, k);
    const neededWord = target[k];

    // Find the word from wordsPool that is not in validPrefix and matches neededWord
    const nextToken = wordsPool.find(x => !validPrefix.some(p => p.i === x.i) && x.w === neededWord);
    if (nextToken) {
      setPickedWords([...validPrefix, nextToken]);
      setHintsUsed(prev => prev + 1);
    }
  };

  const handleCheck = () => {
    if (!pickedWords.length || isAnswered || !currentSentence) return;

    const ans = pickedWords.map(x => x.w).join(' ');
    const target = currentSentence.en.split(/\s+/).join(' ');
    const ok = ans === target && pickedWords.length === wordsPool.length;

    setIsAnswered(true);
    setIsCorrect(ok);

    const points = ok ? Math.max(1, 5 - hintsUsed * 2) : 0;
    awardPoints('scramble', ok, points);

    if (!ok) {
      addMistakeNote({
        type: 'Sắp xếp câu',
        wrong: ans,
        fix: target,
        why: currentSentence.vi
      });
    } else {
      speak(target, { voiceName: settings.voice, rate: settings.rate });
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
      const prompt = `Create one natural English sentence for a CEFR ${settings.level} learner (6-12 words).
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
    return <div className="text-center py-12 text-muted-foreground">Đang tải bài sắp xếp...</div>;
  }

  const unpickedWords = wordsPool.filter(x => !pickedWords.some(p => p.i === x.i));
  const targetText = currentSentence.en.split(/\s+/).join(' ');

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
        <div>
          <h2 className="text-lg md:text-xl font-bold tracking-tight text-foreground">
            {t('Sắp xếp câu')}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t('Bấm vào các từ theo đúng thứ tự. Bấm lại từ đã chọn để bỏ ra.')}
          </p>
        </div>

        <button
          onClick={handleGenAI}
          disabled={isGenerating}
          className="btn-ghost text-xs py-1 px-2.5"
        >
          <Icons.Sparkles className="w-3.5 h-3.5" />
          <span>{isGenerating ? 'Đang tạo...' : t('Câu mới bằng AI')}</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="app-card p-6 md:p-8 space-y-6">
        
        {/* Vietnamese Meaning Prompt */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{t('Nghĩa tiếng Việt')}</span>
            <span className="px-2 py-0.5 rounded-full font-semibold border border-border bg-muted/40">
              {currentSentence.lv || settings.level}
            </span>
          </div>
          <div className="p-3.5 rounded-lg border border-border bg-muted/30 font-medium text-foreground text-sm md:text-base leading-relaxed">
            {currentSentence.vi}
          </div>
        </div>

        {/* Answer Zone (Placed chips) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
            {t('Câu của bạn')}
          </label>
          <div className="min-h-[56px] p-3 rounded-lg border border-border bg-background flex flex-wrap gap-2 items-center">
            {pickedWords.length === 0 ? (
              <span className="text-muted-foreground text-xs italic">
                Chọn từ bên dưới...
              </span>
            ) : (
              pickedWords.map(token => (
                <button
                  key={token.i}
                  disabled={isAnswered}
                  onClick={() => handleRemoveWord(token)}
                  className="word-chip border-primary/40 text-primary hover:bg-muted"
                >
                  {token.w}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Word Pool Zone */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
            {t('Các từ')}
          </label>
          <div className="min-h-[56px] p-3 rounded-lg border border-dashed border-border bg-muted/20 flex flex-wrap gap-2 items-center">
            {unpickedWords.length === 0 ? (
              <span className="text-muted-foreground text-xs italic">
                Đã xếp hết các từ
              </span>
            ) : (
              unpickedWords.map(token => (
                <button
                  key={token.i}
                  disabled={isAnswered}
                  onClick={() => handlePickWord(token)}
                  className="word-chip"
                >
                  {token.w}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={handleCheck}
            disabled={pickedWords.length === 0 || isAnswered}
            className="btn-primary text-xs"
          >
            <span>{t('Kiểm tra')}</span>
          </button>

          {settings.hints && !isAnswered && (
            <button
              onClick={handleHint}
              className="btn-secondary text-xs"
            >
              <Icons.Lightbulb className="w-3.5 h-3.5" />
              <span>{t('Gợi ý 1 từ')}</span>
            </button>
          )}

          <button
            onClick={handleReset}
            disabled={isAnswered}
            className="btn-ghost text-xs"
          >
            <span>{t('Làm lại')}</span>
          </button>

          <div className="flex-1" />

          {isAnswered && (
            <button
              onClick={handleNext}
              className="btn-primary text-xs"
            >
              <span>{t('Câu tiếp')} →</span>
            </button>
          )}
        </div>

        {/* Result Reveal */}
        {isAnswered && (
          <div className="p-4 rounded-lg border border-border bg-muted/30 flex items-center justify-between gap-3 animate-in fade-in">
            <div className="text-sm">
              {isCorrect ? (
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {t('Chính xác.')}
                </span>
              ) : (
                <div>
                  <span className="font-semibold text-destructive">{t('Chưa đúng.')}</span>{' '}
                  <span className="text-foreground">{t('Đáp án:')} <strong>{targetText}</strong></span>
                </div>
              )}
            </div>

            <AudioPlayer text={targetText} size="sm" />
          </div>
        )}

      </div>

    </div>
  );
}
