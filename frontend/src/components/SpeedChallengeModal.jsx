import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { STATIC_VOCAB, STATIC_BLANKS } from '../data/staticData';
import { AstryxButton, AstryxBadge, AstryxProgressBar } from '../astryx/components';
import { Icons } from './Icons';

export default function SpeedChallengeModal() {
  const {
    isSpeedChallengeOpen,
    setIsSpeedChallengeOpen,
    settings,
    awardPoints,
    speedHighScore,
    updateSpeedHighScore
  } = useApp();

  const [gameState, setGameState] = useState('intro'); // 'intro' | 'playing' | 'finished'
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [flashState, setFlashState] = useState(null); // 'correct' | 'wrong' | null

  const timerRef = useRef(null);

  const buildQuestionPool = () => {
    const pool = [];
    // Mix vocab across levels
    const allVocab = Object.values(STATIC_VOCAB).flat();
    allVocab.forEach(w => {
      const distractors = allVocab
        .filter(x => x.en !== w.en)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(x => x.vi);
      pool.push({
        type: 'TỪ VỰNG',
        prompt: `Nghĩa của từ "${w.en}" ${w.ipa || ''} là gì?`,
        options: [w.vi, ...distractors].sort(() => Math.random() - 0.5),
        answer: w.vi
      });
    });

    // Mix grammar blanks
    const allBlanks = Object.values(STATIC_BLANKS).flat();
    allBlanks.forEach(b => {
      const opts = [b.a, ...(b.d || [])].slice(0, 4).sort(() => Math.random() - 0.5);
      pool.push({
        type: 'NGỮ PHÁP',
        prompt: b.s,
        options: opts,
        answer: b.a
      });
    });

    return pool.sort(() => Math.random() - 0.5);
  };

  const startGame = () => {
    setQuestions(buildQuestionPool());
    setQIndex(0);
    setScore(0);
    setCombo(0);
    setTimeLeft(60);
    setGameState('playing');
  };

  useEffect(() => {
    if (!isSpeedChallengeOpen) {
      clearInterval(timerRef.current);
      setGameState('intro');
    }
  }, [isSpeedChallengeOpen]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setGameState('finished');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'finished' && score > 0) {
      updateSpeedHighScore(score);
      awardPoints('vocab', true, Math.max(5, Math.round(score / 10)));
    }
  }, [gameState]);

  if (!isSpeedChallengeOpen) return null;

  const currentQ = questions[qIndex % Math.max(1, questions.length)];
  const multiplier = combo >= 9 ? 4 : combo >= 6 ? 3 : combo >= 3 ? 2 : 1;

  const handleAnswer = (opt) => {
    if (!currentQ) return;
    const isRight = opt === currentQ.answer;
    setFlashState(isRight ? 'correct' : 'wrong');
    setTimeout(() => setFlashState(null), 220);

    if (isRight) {
      const newCombo = combo + 1;
      const mult = newCombo >= 9 ? 4 : newCombo >= 6 ? 3 : newCombo >= 3 ? 2 : 1;
      setCombo(newCombo);
      setScore(prev => prev + 10 * mult);
    } else {
      setCombo(0);
    }
    setQIndex(prev => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="app-card max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
        
        <button
          onClick={() => setIsSpeedChallengeOpen(false)}
          className="absolute top-4 right-4 astryx-btn astryx-btn-sm astryx-btn-ghost"
        >
          <Icons.X className="w-4 h-4" />
        </button>

        {gameState === 'intro' && (
          <div className="text-center space-y-4 py-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <Icons.Zap className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-foreground">
              Thử thách Phản xạ 60 Giây (60s Blitz)
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Trả lời nhanh các câu hỏi Từ vựng & Ngữ pháp trong 60 giây. Chuỗi trả lời đúng liên tiếp sẽ kích hoạt nhân điểm <strong>Combo x2, x3, x4</strong>!
            </p>
            <div className="p-3 rounded-xl border border-border bg-muted/40 text-xs font-bold text-foreground">
              Kỷ lục hiện tại của bạn: <span className="text-primary">{speedHighScore} điểm</span>
            </div>
            <AstryxButton variant="primary" size="lg" className="w-full" onClick={startGame}>
              Bắt đầu ngay (60 giây)
            </AstryxButton>
          </div>
        )}

        {gameState === 'playing' && currentQ && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AstryxBadge status="warning" icon={Icons.Clock}>
                  {timeLeft}s
                </AstryxBadge>
                {multiplier > 1 && (
                  <AstryxBadge status="positive" prominence="solid">
                    Combo x{multiplier} 🔥
                  </AstryxBadge>
                )}
              </div>
              <div className="text-lg font-extrabold text-primary">
                {score} pts
              </div>
            </div>

            <AstryxProgressBar
              value={timeLeft}
              max={60}
              variant={timeLeft <= 10 ? 'warning' : 'accent'}
              size="sm"
            />

            <div className={`p-5 rounded-xl border transition-colors ${
              flashState === 'correct'
                ? 'border-emerald-500 bg-emerald-500/10'
                : flashState === 'wrong'
                  ? 'border-destructive bg-destructive/10'
                  : 'border-border bg-muted/20'
            }`}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                {currentQ.type}
              </span>
              <h4 className="text-base sm:text-lg font-bold text-foreground">
                {currentQ.prompt}
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  className="p-3.5 rounded-xl border border-border bg-card hover:bg-primary/10 hover:border-primary text-left text-xs sm:text-sm font-semibold text-foreground transition-all active:scale-98"
                >
                  <span className="text-muted-foreground mr-2 font-mono">{i + 1}.</span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {gameState === 'finished' && (
          <div className="text-center space-y-5 py-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <Icons.Trophy className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Hết giờ! Tổng điểm đạt được
              </span>
              <div className="text-4xl font-extrabold text-primary">{score}</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                +{Math.max(5, Math.round(score / 10))} XP đã được cộng vào tiến độ hôm nay!
              </div>
            </div>

            <div className="flex gap-2">
              <AstryxButton variant="primary" className="flex-1" onClick={startGame}>
                Chơi lại
              </AstryxButton>
              <AstryxButton variant="secondary" onClick={() => setIsSpeedChallengeOpen(false)}>
                Đóng
              </AstryxButton>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
