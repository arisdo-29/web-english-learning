import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { LEVELS, LEVEL_NAME } from '../data/staticData';
import { Icons } from './Icons';

export default function PlacementModal() {
  const { isPlacementOpen, setIsPlacementOpen, executeApplyLevel, t } = useApp();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [byLv, setByLv] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [suggestedLevel, setSuggestedLevel] = useState('A1');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isPlacementOpen) {
      startTest();
    }
  }, [isPlacementOpen]);

  const startTest = async () => {
    setLoading(true);
    setCurrentIndex(0);
    setScore(0);
    setByLv({});
    setIsFinished(false);

    const data = await api.getPlacementTest();
    setQuestions(data || []);
    setLoading(false);
  };

  const handleSelectOption = (opt) => {
    const q = questions[currentIndex];
    const isCorrect = opt === q.correct;

    if (isCorrect) {
      setScore(prev => prev + 1);
      setByLv(prev => ({ ...prev, [q.lv]: (prev[q.lv] || 0) + 1 }));
    }

    advanceQuestion({
      ...byLv,
      [q.lv]: (byLv[q.lv] || 0) + (isCorrect ? 1 : 0)
    }, score + (isCorrect ? 1 : 0));
  };

  const handleSkip = () => {
    advanceQuestion(byLv, score);
  };

  const advanceQuestion = (currentByLv, currentScore) => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      let lv = 'A1';
      for (const L of LEVELS) {
        if ((currentByLv[L] || 0) >= 2) {
          lv = L;
        } else {
          break;
        }
      }
      setSuggestedLevel(lv);
      setIsFinished(true);
    }
  };

  if (!isPlacementOpen) return null;

  const currentQ = questions[currentIndex];
  const progressPercent = questions.length ? Math.round((currentIndex / questions.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="app-card max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          onClick={() => setIsPlacementOpen(false)}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icons.X className="w-4 h-4" />
        </button>

        {loading ? (
          <div className="py-12 text-center text-xs text-muted-foreground">
            Đang tải bài kiểm tra...
          </div>
        ) : !isFinished && currentQ ? (
          <div className="space-y-5">
            <div className="flex items-center justify-between text-xs text-muted-foreground pr-8">
              <span className="font-semibold text-foreground">{t('Kiểm tra trình độ CEFR')}</span>
              <span className="font-mono">Câu {currentIndex + 1}/{questions.length}</span>
            </div>

            <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <h3 className="text-base md:text-lg font-semibold text-foreground leading-snug">
              {currentQ.q}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectOption(opt)}
                  className="p-3.5 rounded-2xl text-left text-xs md:text-sm font-medium border border-border bg-card hover:bg-secondary/80 text-foreground transition-all"
                >
                  <span className="text-muted-foreground mr-2 font-mono">{String.fromCharCode(65 + i)}.</span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border text-xs">
              <button
                onClick={handleSkip}
                className="btn-secondary text-xs py-1.5 px-4"
              >
                <span>{t('Tôi không biết')}</span>
              </button>
              <span className="text-muted-foreground text-[11px]">
                {t('Đừng đoán bừa để kết quả chính xác hơn.')}
              </span>
            </div>
          </div>
        ) : isFinished ? (
          <div className="space-y-4 py-2 text-center">
            <h3 className="text-lg font-bold text-foreground">
              {t('Kết quả kiểm tra')}
            </h3>

            <p className="text-sm text-foreground">
              {t('Bạn trả lời đúng')} <strong>{score}/{questions.length}</strong> {t('câu.')}
            </p>

            <div className="p-3 rounded-2xl bg-secondary/70 text-xs text-muted-foreground flex justify-center gap-3 flex-wrap">
              {LEVELS.map(L => (
                <span key={L}>
                  <strong className="text-foreground">{L}:</strong> {byLv[L] || 0}/3
                </span>
              ))}
            </div>

            <div className="p-5 rounded-3xl border border-border bg-secondary/40 space-y-1">
              <span className="text-xs text-muted-foreground">{t('Trình độ gợi ý:')}</span>
              <div className="text-4xl font-bold text-foreground tracking-tight">
                {suggestedLevel}
              </div>
              <div className="text-xs font-medium text-muted-foreground">
                {t(LEVEL_NAME[suggestedLevel])}
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => {
                  executeApplyLevel(suggestedLevel, true);
                  setIsPlacementOpen(false);
                }}
                className="btn-primary flex-1 text-xs py-2.5"
              >
                <span>Áp dụng trình độ {suggestedLevel}</span>
              </button>
              <button
                onClick={() => setIsPlacementOpen(false)}
                className="btn-secondary text-xs py-2.5 px-5"
              >
                <span>{t('Đóng')}</span>
              </button>
            </div>
          </div>
        ) : null}

      </div>
    </div>
  );
}
