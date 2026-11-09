import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { callAIJSON, isAIConfigured } from '../services/ai';
import { speak } from '../services/tts';
import AudioPlayer from './AudioPlayer';
import { AstryxCard, AstryxButton, AstryxBadge, AstryxSegmentedControl } from '../astryx/components';
import { Icons } from './Icons';

export default function BlankTab() {
  const { settings, updateSettings, awardPoints, addMistakeNote, showToast, t } = useApp();

  const [blanks, setBlanks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [typedInput, setTypedInput] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const loadBlanks = async () => {
    const data = await api.getBlanks(settings.level, settings.range);
    setBlanks(data || []);
    setCurrentIndex(0);
  };

  useEffect(() => {
    loadBlanks();
  }, [settings.level, settings.range]);

  const currentBlank = blanks[currentIndex] || null;

  useEffect(() => {
    if (!currentBlank) return;

    setTypedInput('');
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);

    const allOptions = [
      currentBlank.a,
      ...(currentBlank.d || [])
    ].filter(Boolean);

    setOptions([...new Set(allOptions)].sort(() => Math.random() - 0.5));
  }, [currentIndex, currentBlank]);

  const handleAnswer = (val) => {
    if (isAnswered || !currentBlank || !val) return;

    const norm = s => String(s || '').toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9' ]/g, " ").replace(/\s+/g, " ").trim();
    const nv = norm(val);
    const accepted = [currentBlank.a, ...(currentBlank.alt || [])].map(norm);
    const ok = accepted.includes(nv);

    setIsAnswered(true);
    setIsCorrect(ok);
    setSelectedOption(val);

    awardPoints('blank', ok, ok ? 3 : 0);

    const fullSentence = currentBlank.s.replace('___', currentBlank.a);
    if (!ok) {
      addMistakeNote({
        type: 'Điền từ',
        wrong: currentBlank.s.replace('___', `[${val}]`),
        fix: fullSentence,
        why: currentBlank.h || ''
      });
    } else {
      speak(fullSentence, { voiceName: settings.voice, rate: settings.rate });
    }
  };

  const handleSkip = () => {
    if (currentIndex + 1 < blanks.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleNext = async () => {
    const wantAI = isAIConfigured(settings.ai) && (settings.source === 'ai' || (settings.source === 'mix' && Math.random() < 0.5));
    if (wantAI) {
      await handleGenAI();
      return;
    }

    if (currentIndex + 1 < blanks.length) {
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
      const prompt = `Create one English fill-in-the-blank sentence testing grammar or collocations for a CEFR ${settings.level} learner. Use exactly "___" for one missing word.
Return JSON: {
  "sentence": "English sentence with ___",
  "answer": "word",
  "category": "Grammar Category",
  "alternatives": ["optional valid words"],
  "distractors": ["3 plausible but wrong words"],
  "hint": "short hint in Vietnamese"
}`;
      const res = await callAIJSON(prompt, 'English Teacher', settings.ai);
      const newB = {
        id: Date.now(),
        lv: `${settings.level} · AI`,
        s: res.sentence,
        a: res.answer,
        cat: res.category || 'Grammar',
        alt: res.alternatives || [],
        d: res.distractors || [],
        h: res.hint
      };
      setBlanks(prev => [newB, ...prev]);
      setCurrentIndex(0);
      showToast('Đã tạo câu mới bằng AI!', 'success');
    } catch (err) {
      showToast('Lỗi tạo câu: ' + err.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!currentBlank) {
    return <div className="text-center py-12 text-muted-foreground">Đang tải câu điền từ...</div>;
  }

  const isChoiceMode = settings.blankType === 'choice' && options.length >= 2;
  const parts = currentBlank.s.split('___');

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
        <div>
          <h2 className="text-lg md:text-xl font-bold tracking-tight text-foreground">
            {t('Điền từ vào chỗ trống')}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t('Ngữ pháp, giới từ và cụm từ thông dụng.')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AstryxSegmentedControl
            size="sm"
            value={settings.blankType || 'type'}
            onChange={val => updateSettings({ blankType: val }, true)}
            options={[
              { value: 'choice', label: 'Trắc nghiệm' },
              { value: 'type', label: 'Tự gõ' }
            ]}
          />

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
      </div>

      {/* Main Card */}
      <AstryxCard padding="lg" className="space-y-6">
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Câu {currentIndex + 1}/{blanks.length}</span>
          <div className="flex items-center gap-1.5">
            {currentBlank.cat && <AstryxBadge status="neutral">{currentBlank.cat}</AstryxBadge>}
            <AstryxBadge status="accent">{currentBlank.lv || settings.level}</AstryxBadge>
          </div>
        </div>

        {/* Cloze Sentence Display */}
        <div className="p-5 rounded-xl border border-border bg-muted/20 text-lg md:text-xl font-semibold text-foreground leading-relaxed">
          <span>{parts[0]}</span>
          <span className={`inline-block px-2.5 py-0.5 mx-1.5 rounded border-b-2 font-extrabold transition-all ${
            isAnswered
              ? isCorrect
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                : 'border-destructive text-destructive bg-destructive/10'
              : 'border-primary text-primary bg-primary/10 min-w-[72px] text-center'
          }`}>
            {isAnswered ? currentBlank.a : '___'}
          </span>
          <span>{parts[1]}</span>
        </div>

        {/* Grammar Hint */}
        {settings.hints && currentBlank.h && (
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Icons.Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Gợi ý: <strong>{currentBlank.h}</strong></span>
          </p>
        )}

        {/* Input / Choice Area */}
        {isChoiceMode ? (
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            {options.map((opt, i) => {
              const isSelected = selectedOption === opt;
              const isRight = isAnswered && opt.toLowerCase() === currentBlank.a.toLowerCase();
              const isWrong = isAnswered && isSelected && !isRight;

              return (
                <button
                  key={i}
                  disabled={isAnswered}
                  onClick={() => handleAnswer(opt)}
                  className={`p-3.5 rounded-xl text-left text-sm font-bold border transition-all ${
                    isRight
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                      : isWrong
                        ? 'border-destructive bg-destructive/10 text-destructive'
                        : 'border-border bg-card hover:bg-muted text-foreground'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex gap-2 max-w-md pt-2">
            <input
              type="text"
              autoFocus
              disabled={isAnswered}
              value={typedInput}
              onChange={e => setTypedInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  if (isAnswered) handleNext();
                  else if (typedInput.trim()) handleAnswer(typedInput.trim());
                }
              }}
              placeholder={t('Từ còn thiếu')}
              className="astryx-input flex-1 p-2.5 text-sm font-semibold"
            />
            <AstryxButton
              variant="primary"
              disabled={isAnswered || !typedInput.trim()}
              onClick={() => handleAnswer(typedInput.trim())}
            >
              {t('Kiểm tra')}
            </AstryxButton>
            <AstryxButton
              variant="ghost"
              disabled={isAnswered}
              onClick={handleSkip}
            >
              {t('Bỏ qua')}
            </AstryxButton>
          </div>
        )}

        {/* Feedback Section */}
        {isAnswered && (
          <div className="p-4 rounded-xl border border-border bg-muted/30 flex items-center justify-between gap-3 animate-in fade-in">
            <div className="text-sm space-y-0.5">
              {isCorrect ? (
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {t('Đúng rồi.')} (+3 XP)
                </span>
              ) : (
                <div>
                  <span className="font-bold text-destructive">{t('Chưa đúng.')}</span>{' '}
                  <span className="text-foreground">{t('Đáp án:')} <strong>{[currentBlank.a, ...(currentBlank.alt || [])].join(' / ')}</strong></span>
                </div>
              )}
              {currentBlank.h && <div className="text-xs text-muted-foreground">{currentBlank.h}</div>}
            </div>

            <div className="flex items-center gap-2">
              <AudioPlayer text={currentBlank.s.replace('___', currentBlank.a)} size="sm" />
              <AstryxButton variant="primary" size="sm" onClick={handleNext}>
                {t('Câu tiếp')} →
              </AstryxButton>
            </div>
          </div>
        )}

      </AstryxCard>

    </div>
  );
}
