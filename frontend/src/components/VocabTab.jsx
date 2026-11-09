import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { callAIJSON, isAIConfigured } from '../services/ai';
import { speak } from '../services/tts';
import AudioPlayer from './AudioPlayer';
import { AstryxCard, AstryxButton, AstryxBadge, AstryxSegmentedControl, AstryxProgressBar } from '../astryx/components';
import { Icons } from './Icons';

export default function VocabTab() {
  const {
    settings,
    awardPoints,
    addWordToReview,
    updateWordMastery,
    removeWordFromReview,
    notebookWords,
    showToast,
    t
  } = useApp();

  // 3 Sub-modes: 'flashcard' (3D Flip + SRS) | 'quiz' (Choice / Type) | 'listen' (Audio-first quiz)
  const [subMode, setSubMode] = useState('quiz');
  const [isFlipped, setIsFlipped] = useState(false);

  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [typedInput, setTypedInput] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);
  const [direction, setDirection] = useState('en');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [isCustomAIMode, setIsCustomAIMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [rightCount, setRightCount] = useState(0);

  // Detailed Word Usage section
  const [showUsage, setShowUsage] = useState(false);
  const [usageData, setUsageData] = useState(null);
  const [usageLoading, setUsageLoading] = useState(false);
  const [practiceSentence, setPracticeSentence] = useState('');
  const [sentenceFeedback, setSentenceFeedback] = useState(null);
  const [isCheckingSentence, setIsCheckingSentence] = useState(false);

  const timerRef = useRef(null);

  const loadWords = async (customSet = null, review = false) => {
    stopTimer();
    setIsReviewMode(review);
    setIsCustomAIMode(!!customSet && !review);

    let data;
    if (customSet && customSet.length) {
      data = customSet;
    } else if (review && notebookWords.length) {
      data = [...notebookWords];
    } else {
      data = await api.getVocab(settings.level, settings.range, settings.vocabCount || 10);
    }

    setWords(data || []);
    setCurrentIndex(0);
    setRightCount(0);
    resetQuestionState();
  };

  useEffect(() => {
    loadWords();
    return () => stopTimer();
  }, [settings.level, settings.range, settings.vocabCount]);

  const currentWord = words[currentIndex] || null;

  const resetQuestionState = () => {
    setSelectedOption(null);
    setTypedInput('');
    setIsAnswered(false);
    setIsCorrect(false);
    setIsTimeout(false);
    setIsFlipped(false);
    setShowUsage(false);
    setUsageData(null);
    setPracticeSentence('');
    setSentenceFeedback(null);
  };

  useEffect(() => {
    if (!currentWord) return;

    resetQuestionState();
    stopTimer();

    const isChoice = subMode === 'listen' || settings.vocabType === 'choice' || (settings.vocabType === 'mix' && Math.random() < 0.5);

    if (isChoice) {
      const correctAnswer = (subMode === 'listen' || direction === 'en') ? currentWord.vi : currentWord.en;
      const otherWords = words.filter(w => w.en !== currentWord.en);
      const distractors = [...new Set(otherWords.map(w => (subMode === 'listen' || direction === 'en') ? w.vi : w.en))]
        .filter(tText => tText !== correctAnswer)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      setOptions([correctAnswer, ...distractors].sort(() => Math.random() - 0.5));
    } else {
      setOptions([]);
    }

    if (subMode === 'listen' || (settings.autoSpeak && direction === 'en')) {
      speak(currentWord.en, { voiceName: settings.voice, rate: settings.rate });
    }

    if (subMode !== 'flashcard' && settings.timer > 0) {
      setTimeLeft(settings.timer);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleAnswer(false, null, true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [currentIndex, currentWord, direction, subMode]);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleAnswer = (correct, chosen, timeout = false) => {
    if (isAnswered || !currentWord) return;
    stopTimer();

    setIsAnswered(true);
    setIsCorrect(correct);
    setIsTimeout(timeout);
    setSelectedOption(chosen);

    if (correct) {
      setRightCount(prev => prev + 1);
      awardPoints('vocab', true, settings.vocabType === 'type' ? 3 : 2);
      if (isReviewMode) {
        removeWordFromReview(currentWord.en);
      }
    } else {
      awardPoints('vocab', false, 0);
      addWordToReview({ ...currentWord, mastery: 0 });
    }

    if (settings.autoSpeak || subMode === 'listen') {
      speak(currentWord.en, { voiceName: settings.voice, rate: settings.rate });
    }
  };

  const handleSRSRate = (rating) => {
    if (!currentWord) return;
    // rating: 0 (Again), 1 (Hard), 2 (Good), 3 (Easy)
    if (rating <= 1) {
      addWordToReview({ ...currentWord, mastery: rating });
      awardPoints('vocab', false, 1);
    } else {
      updateWordMastery(currentWord.en, rating);
      setRightCount(prev => prev + 1);
      awardPoints('vocab', true, rating);
    }
    handleNext();
  };

  const handleNext = () => {
    if (currentIndex + 1 < words.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(words.length);
    }
  };

  const handleLoadUsage = async () => {
    if (showUsage) {
      setShowUsage(false);
      return;
    }
    setShowUsage(true);

    if (usageData) return;
    if (!isAIConfigured(settings.ai)) {
      setUsageData({ error: 'Cần cấu hình AI để giải thích sâu hơn. Vào Cài đặt > Kết nối AI.' });
      return;
    }

    setUsageLoading(true);
    try {
      const prompt = `Explain how to use the English word "${currentWord.en}" (meaning: ${currentWord.vi}) for a CEFR ${settings.level} learner.
Return JSON: {
  "ipa": "${currentWord.ipa || '/IPA/'}",
  "pos": "part of speech",
  "meaning": "short meaning in Vietnamese",
  "usage": "when and how to use it, in Vietnamese",
  "patterns": ["common patterns or collocations"],
  "examples": [
    {"en": "example sentence 1", "vi": "dịch nghĩa tiếng Việt"},
    {"en": "example sentence 2", "vi": "dịch nghĩa tiếng Việt"}
  ],
  "mistake": "a common mistake Vietnamese learners make with this word"
}`;
      const res = await callAIJSON(prompt, 'English Teacher', settings.ai);
      setUsageData(res);
    } catch (err) {
      setUsageData({ error: err.message });
    } finally {
      setUsageLoading(false);
    }
  };

  const handleCheckSentence = async () => {
    if (!practiceSentence.trim() || !currentWord) return;
    setIsCheckingSentence(true);
    setSentenceFeedback(null);

    try {
      const prompt = `The learner (CEFR ${settings.level}) wrote this sentence to practise the word "${currentWord.en}": """${practiceSentence.trim()}""". Check if the word is used correctly and the sentence is grammatical and natural.
Return JSON: {
  "score": 0-10,
  "comment": "short feedback in Vietnamese",
  "fixed": "corrected natural version"
}`;
      const res = await callAIJSON(prompt, 'English Teacher', settings.ai);
      setSentenceFeedback(res);
      if (res.score >= 7) {
        awardPoints('vocab', true, 2);
      }
    } catch (err) {
      setSentenceFeedback({ error: err.message });
    } finally {
      setIsCheckingSentence(false);
    }
  };

  const handleGenAIWords = async () => {
    if (!isAIConfigured(settings.ai)) {
      showToast('Cần cấu hình AI để tạo bộ từ mới.', 'error');
      return;
    }
    setIsGenerating(true);
    try {
      const prompt = `Give 12 useful English words for a CEFR ${settings.level} learner.
Return JSON array: [
  ["word", "nghĩa tiếng Việt ngắn gọn", "/American IPA/", "part of speech", "Short English example sentence"]
]`;
      const res = await callAIJSON(prompt, 'English Teacher', settings.ai);
      if (Array.isArray(res) && res.length >= 4) {
        const parsed = res.map(x => ({
          en: String(x[0]).trim(),
          vi: String(x[1]).trim(),
          ipa: x[2] ? String(x[2]).trim() : '',
          pos: x[3] ? String(x[3]).trim() : '',
          ex: x[4] ? String(x[4]).trim() : '',
          lv: settings.level
        }));
        loadWords(parsed, false);
        showToast('Đã tạo bộ từ mới bằng AI!', 'success');
      }
    } catch (err) {
      showToast('Lỗi tạo từ: ' + err.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  if (currentIndex >= words.length && words.length > 0) {
    return (
      <AstryxCard padding="lg" className="text-center max-w-md mx-auto space-y-6 animate-in fade-in">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
          <Icons.Trophy className="w-8 h-8" />
        </div>
        <div>
          <div className="text-4xl font-extrabold tracking-tight text-foreground">
            {rightCount}/{words.length}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{t('câu đúng')} · Hoàn thành lượt học!</p>
        </div>

        <div className="flex flex-col gap-2.5 pt-2">
          <AstryxButton variant="primary" size="lg" className="w-full" onClick={() => loadWords()}>
            {t('Chơi lượt mới')}
          </AstryxButton>

          {notebookWords.length > 0 && (
            <AstryxButton variant="secondary" size="lg" className="w-full" onClick={() => loadWords(notebookWords, true)}>
              {t('Ôn lại các từ đã trả lời sai')} ({notebookWords.length})
            </AstryxButton>
          )}
        </div>
      </AstryxCard>
    );
  }

  if (!currentWord) {
    return <div className="text-center py-12 text-muted-foreground">Đang tải bộ từ vựng...</div>;
  }

  const isChoiceMode = options.length > 0;
  const correctAnswer = (subMode === 'listen' || direction === 'en') ? currentWord.vi : currentWord.en;

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12 animate-in fade-in duration-200">
      
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
        <div>
          <h2 className="text-lg md:text-xl font-bold tracking-tight text-foreground">
            {t('Từ vựng & Đặt câu')}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isReviewMode ? 'Chế độ ôn tập Sổ tay SRS' : `Trình độ ${settings.level} · ${words.length} từ mỗi lượt`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <AstryxSegmentedControl
            size="sm"
            value={subMode}
            onChange={setSubMode}
            options={[
              { value: 'quiz', label: 'Phản xạ' },
              { value: 'flashcard', label: 'Thẻ lật 3D' },
              { value: 'listen', label: 'Nghe đoán' }
            ]}
          />

          <AstryxButton
            variant="outline"
            size="sm"
            icon={Icons.Sparkles}
            isLoading={isGenerating}
            onClick={handleGenAIWords}
          >
            AI Words
          </AstryxButton>

          <AstryxButton
            variant="ghost"
            size="sm"
            icon={Icons.RotateCcw}
            onClick={() => loadWords()}
          >
            {t('Lượt mới')}
          </AstryxButton>
        </div>
      </div>

      {/* Progress & Timer */}
      <div className="space-y-1.5">
        <AstryxProgressBar
          value={currentIndex}
          max={words.length}
          size="sm"
          label={`Tiến độ lượt học: ${currentIndex + 1}/${words.length}`}
        />

        {subMode !== 'flashcard' && settings.timer > 0 && !isAnswered && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icons.Clock className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-mono font-bold">{timeLeft}s</span>
            <AstryxProgressBar value={timeLeft} max={settings.timer} variant="warning" size="sm" className="flex-1" />
          </div>
        )}
      </div>

      {/* SUBMODE 1: 3D INTERACTIVE FLASHCARD + SRS */}
      {subMode === 'flashcard' ? (
        <div className="space-y-5">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="app-card p-8 sm:p-10 min-h-[280px] flex flex-col justify-between cursor-pointer hover:border-primary transition-all select-none"
          >
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <AstryxBadge status="accent">{currentWord.lv || settings.level}</AstryxBadge>
              <span className="flex items-center gap-1 font-semibold text-primary">
                <Icons.Flip className="w-3.5 h-3.5" />
                <span>{isFlipped ? 'Mặt sau (Nghĩa & Ví dụ)' : 'Mặt trước (Bấm thẻ để lật)'}</span>
              </span>
            </div>

            {!isFlipped ? (
              <div className="py-8 text-center space-y-3">
                <div className="flex items-center justify-center gap-3">
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                    {currentWord.en}
                  </h3>
                  <AudioPlayer text={currentWord.en} size="md" />
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-mono">
                  {currentWord.ipa && <span>{currentWord.ipa}</span>}
                  {currentWord.pos && <AstryxBadge status="neutral">{currentWord.pos}</AstryxBadge>}
                </div>
                <p className="text-xs text-muted-foreground pt-2">
                  Hãy nhẩm nghĩa của từ rồi bấm vào thẻ để kiểm tra
                </p>
              </div>
            ) : (
              <div className="py-6 text-center space-y-4 animate-in fade-in duration-150">
                <div className="text-2xl sm:text-3xl font-extrabold text-primary">
                  {currentWord.vi}
                </div>
                <div className="text-sm font-bold text-foreground">
                  {currentWord.en} <span className="font-mono text-muted-foreground font-normal">{currentWord.ipa}</span>
                </div>
                {currentWord.ex && (
                  <div className="p-3.5 rounded-xl border border-border bg-muted/30 max-w-md mx-auto text-xs space-y-1 text-left">
                    <div className="flex items-center justify-between font-semibold text-foreground">
                      <span>"{currentWord.ex}"</span>
                      <AudioPlayer text={currentWord.ex} size="sm" />
                    </div>
                    {currentWord.exVi && <div className="text-muted-foreground">{currentWord.exVi}</div>}
                  </div>
                )}
              </div>
            )}

            <div className="text-center text-[11px] text-muted-foreground">
              Spaced Repetition (SRS): Đánh giá mức độ nhớ bên dưới
            </div>
          </div>

          {/* SRS Memory Rating Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              type="button"
              onClick={() => handleSRSRate(0)}
              className="p-3 rounded-xl border border-destructive/40 bg-destructive/10 hover:bg-destructive/15 text-destructive text-xs font-bold transition-all"
            >
              1. Quên (Ôn lại ngay)
            </button>
            <button
              type="button"
              onClick={() => handleSRSRate(1)}
              className="p-3 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/15 text-amber-700 dark:text-amber-300 text-xs font-bold transition-all"
            >
              2. Hơi khó (Lưu sổ tay)
            </button>
            <button
              type="button"
              onClick={() => handleSRSRate(2)}
              className="p-3 rounded-xl border border-sky-500/40 bg-sky-500/10 hover:bg-sky-500/15 text-sky-700 dark:text-sky-300 text-xs font-bold transition-all"
            >
              3. Nhớ tốt (+2 XP)
            </button>
            <button
              type="button"
              onClick={() => handleSRSRate(3)}
              className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all"
            >
              4. Rất dễ (+3 XP)
            </button>
          </div>
        </div>
      ) : (
        /* SUBMODE 2 & 3: QUIZ MODE & LISTENING VOCAB MODE */
        <AstryxCard padding="lg" className="space-y-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <AstryxBadge status="accent">{currentWord.lv || settings.level}</AstryxBadge>
              {currentWord.pos && <AstryxBadge status="neutral">{currentWord.pos}</AstryxBadge>}
            </div>

            {subMode === 'quiz' && settings.vocabType !== 'type' && (
              <select
                value={direction}
                onChange={e => setDirection(e.target.value)}
                className="astryx-select px-2.5 py-1 text-xs font-semibold"
              >
                <option value="en">Anh → Việt</option>
                <option value="vi">Việt → Anh</option>
              </select>
            )}
          </div>

          {/* Prompt Display */}
          {subMode === 'listen' ? (
            <div className="p-6 rounded-xl border border-border bg-muted/20 text-center space-y-3">
              <div className="flex items-center justify-center gap-3">
                <AudioPlayer text={currentWord.en} size="lg" />
                <AudioPlayer text={currentWord.en} slow={true} size="lg" />
              </div>
              <div className="text-xs font-semibold text-muted-foreground">
                {isAnswered ? (
                  <span className="text-lg font-extrabold text-foreground">
                    {currentWord.en} <span className="font-mono text-xs text-muted-foreground">{currentWord.ipa}</span>
                  </span>
                ) : (
                  'Nghe phát âm và chọn đúng nghĩa tiếng Việt của từ'
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              {direction === 'vi' && !isChoiceMode && (
                <div className="text-xs text-muted-foreground">
                  {t('Viết từ tiếng Anh có nghĩa:')}
                </div>
              )}
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
                  {direction === 'en' ? currentWord.en : currentWord.vi}
                </h3>
                {direction === 'en' && currentWord.ipa && (
                  <span className="text-sm text-muted-foreground font-mono">
                    {currentWord.ipa}
                  </span>
                )}
                {direction === 'en' && <AudioPlayer text={currentWord.en} size="sm" />}
              </div>
            </div>
          )}

          {/* Question Input / Multiple Choice */}
          {isChoiceMode ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {options.map((opt, i) => {
                const isSelected = selectedOption === opt;
                const isRight = isAnswered && opt === correctAnswer;
                const isWrong = isAnswered && isSelected && !isRight;

                return (
                  <button
                    key={i}
                    disabled={isAnswered}
                    onClick={() => handleAnswer(opt === correctAnswer, opt)}
                    className={`p-3.5 rounded-xl text-left text-sm font-semibold border transition-all ${
                      isRight
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold'
                        : isWrong
                          ? 'border-destructive bg-destructive/10 text-destructive'
                          : 'border-border bg-card hover:bg-muted text-foreground'
                    }`}
                  >
                    <span className="text-muted-foreground mr-2 text-xs font-mono">{String.fromCharCode(65 + i)}.</span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              {settings.hints && !isAnswered && (
                <p className="text-xs text-muted-foreground">
                  Gợi ý chữ cái đầu: <strong className="text-primary">{currentWord.en[0]}</strong>{' '}
                  {'_ '.repeat(currentWord.en.length - 1)} ({currentWord.en.length} ký tự)
                </p>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  autoFocus
                  disabled={isAnswered}
                  value={typedInput}
                  onChange={e => setTypedInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      if (isAnswered) handleNext();
                      else if (typedInput.trim()) {
                        handleAnswer(typedInput.trim().toLowerCase() === currentWord.en.toLowerCase(), typedInput);
                      }
                    }
                  }}
                  placeholder={t('Gõ từ tiếng Anh')}
                  className="astryx-input flex-1 p-2.5 text-sm font-medium"
                />
                <AstryxButton
                  variant="primary"
                  disabled={isAnswered || !typedInput.trim()}
                  onClick={() => handleAnswer(typedInput.trim().toLowerCase() === currentWord.en.toLowerCase(), typedInput)}
                >
                  {t('Trả lời')}
                </AstryxButton>
                <AstryxButton
                  variant="ghost"
                  disabled={isAnswered}
                  onClick={() => handleAnswer(false, null)}
                >
                  {t('Không biết')}
                </AstryxButton>
              </div>
            </div>
          )}

          {/* Answer Feedback & Example Sentence */}
          {isAnswered && (
            <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-3 animate-in fade-in">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className={`font-bold ${isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}>
                    {isCorrect ? t('Chính xác.') : isTimeout ? t('Hết giờ.') : t('Chưa đúng.')}
                  </span>
                  <span className="text-foreground">
                    <strong>{currentWord.en}</strong>{' '}
                    {currentWord.ipa && <span className="text-muted-foreground font-mono text-xs">{currentWord.ipa}</span>} – {currentWord.vi}
                  </span>
                  <AudioPlayer text={currentWord.en} size="sm" />
                </div>

                <div className="flex items-center gap-2">
                  <AstryxButton variant="secondary" size="sm" icon={Icons.Lightbulb} onClick={handleLoadUsage}>
                    {showUsage ? 'Ẩn cách dùng' : t('Cách dùng và ví dụ')}
                  </AstryxButton>
                  <AstryxButton variant="primary" size="sm" onClick={handleNext}>
                    {t('Câu tiếp')} →
                  </AstryxButton>
                </div>
              </div>

              {currentWord.ex && (
                <div className="p-2.5 rounded-lg border border-border bg-card text-xs flex items-center justify-between gap-2">
                  <div>
                    <div className="font-semibold text-foreground">Ví dụ: "{currentWord.ex}"</div>
                    {currentWord.exVi && <div className="text-muted-foreground mt-0.5">{currentWord.exVi}</div>}
                  </div>
                  <AudioPlayer text={currentWord.ex} size="sm" />
                </div>
              )}

              {/* Inline AI Usage & Sentence Practice */}
              {showUsage && (
                <div className="pt-3 border-t border-border space-y-3 text-xs leading-relaxed animate-in fade-in">
                  {usageLoading ? (
                    <p className="text-muted-foreground">Đang tải phân tích cách dùng từ AI...</p>
                  ) : usageData?.error ? (
                    <p className="text-destructive">{usageData.error}</p>
                  ) : usageData ? (
                    <>
                      <div>
                        <span className="font-bold text-foreground uppercase tracking-wider block mb-0.5">
                          {t('Cách dùng')}
                        </span>
                        <p className="text-muted-foreground">{usageData.usage || currentWord.vi}</p>
                      </div>

                      {usageData.patterns && usageData.patterns.length > 0 && (
                        <div>
                          <span className="font-bold text-foreground uppercase tracking-wider block mb-0.5">
                            {t('Cụm từ hay gặp')}
                          </span>
                          <p className="text-muted-foreground">{usageData.patterns.join(' · ')}</p>
                        </div>
                      )}

                      {usageData.examples && (
                        <div className="space-y-1.5">
                          <span className="font-bold text-foreground uppercase tracking-wider block">
                            Ví dụ mở rộng
                          </span>
                          {usageData.examples.map((ex, idx) => (
                            <div key={idx} className="p-2 rounded border border-border bg-card">
                              <div className="flex items-center justify-between font-medium text-foreground">
                                <span>{ex.en}</span>
                                <AudioPlayer text={ex.en} size="sm" />
                              </div>
                              <p className="text-[11px] text-muted-foreground mt-0.5">{ex.vi}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : null}

                  {/* Sentence practice */}
                  <div className="pt-2 border-t border-border space-y-1.5">
                    <span className="font-bold text-foreground block">
                      Tự đặt câu với "{currentWord.en}" để AI chấm (+2 XP)
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={practiceSentence}
                        onChange={e => setPracticeSentence(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleCheckSentence(); }}
                        placeholder={`Viết 1 câu tiếng Anh có chứa từ "${currentWord.en}"...`}
                        className="astryx-input flex-1 p-2 text-xs"
                      />
                      <AstryxButton
                        variant="outline"
                        size="sm"
                        isLoading={isCheckingSentence}
                        disabled={!practiceSentence.trim()}
                        onClick={handleCheckSentence}
                      >
                        {t('Chấm câu')}
                      </AstryxButton>
                    </div>

                    {sentenceFeedback && (
                      <div className="p-2.5 rounded border border-border bg-card text-xs space-y-1">
                        <div>
                          <span className={`font-bold ${sentenceFeedback.score >= 7 ? 'text-emerald-600' : 'text-destructive'}`}>
                            {sentenceFeedback.score}/10
                          </span>{' '}
                          <span>{sentenceFeedback.comment}</span>
                        </div>
                        {sentenceFeedback.fixed && (
                          <div className="text-muted-foreground flex items-center gap-1.5">
                            <span>Câu tự nhiên hơn: <strong>{sentenceFeedback.fixed}</strong></span>
                            <AudioPlayer text={sentenceFeedback.fixed} size="sm" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </AstryxCard>
      )}

    </div>
  );
}
