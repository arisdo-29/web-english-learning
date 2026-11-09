import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { speak } from '../services/tts';
import { callAIJSON, isAIConfigured } from '../services/ai';
import AudioPlayer from './AudioPlayer';
import { AstryxCard, AstryxButton, AstryxBadge } from '../astryx/components';
import { Icons } from './Icons';

function cleanWord(w) {
  return String(w || '').toLowerCase().replace(/[^a-z0-9']/g, '').trim();
}

export default function SpeakingTab() {
  const { settings, awardPoints, addMistakeNote, showToast, t } = useApp();

  const [drills, setDrills] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [evalResult, setEvalResult] = useState(null);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      const data = await api.getSpeaking(settings.level);
      setDrills(data || []);
      setCurrentIndex(0);
    };
    load();
  }, [settings.level]);

  useEffect(() => {
    const SpeechRec = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    setSpeechSupported(!!SpeechRec);
  }, []);

  const currentDrill = drills[currentIndex] || null;

  useEffect(() => {
    setSpokenText('');
    setEvalResult(null);
    if (isListening && recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      setIsListening(false);
    }
  }, [currentIndex, currentDrill?.id]);

  const evaluatePronunciation = (transcript) => {
    if (!currentDrill) return;
    const targetWords = currentDrill.en.split(/\s+/);
    const spokenWords = (transcript || '').split(/\s+/).map(cleanWord).filter(Boolean);

    let matchedCount = 0;
    const wordBreakdown = targetWords.map(tw => {
      const cw = cleanWord(tw);
      const exactMatch = spokenWords.includes(cw);
      const partialMatch = !exactMatch && spokenWords.some(sw => sw.length >= 3 && (cw.startsWith(sw.slice(0, 3)) || sw.startsWith(cw.slice(0, 3))));
      if (exactMatch) matchedCount += 1;
      else if (partialMatch) matchedCount += 0.6;

      return {
        word: tw,
        status: exactMatch ? 'good' : partialMatch ? 'close' : 'missed'
      };
    });

    const accuracy = Math.min(100, Math.round((matchedCount / targetWords.length) * 100));
    setEvalResult({
      accuracy,
      wordBreakdown,
      transcript
    });

    const passed = accuracy >= 70;
    awardPoints('speaking', passed, Math.max(2, Math.round(accuracy / 15)));

    if (accuracy < 65) {
      addMistakeNote({
        type: 'Phát âm',
        wrong: transcript || '(Chưa rõ âm)',
        fix: currentDrill.en,
        why: currentDrill.tip || ''
      });
    }
  };

  const toggleRecording = () => {
    const SpeechRec = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SpeechRec) {
      showToast('Trình duyệt hiện tại chưa bật Web Speech Recognition. Bạn có thể tự nhập hoặc dùng nút Tự đánh giá bên dưới.', 'info');
      return;
    }

    if (isListening) {
      try { recognitionRef.current?.stop(); } catch {}
      setIsListening(false);
      return;
    }

    try {
      const rec = new SpeechRec();
      rec.lang = 'en-US';
      rec.interimResults = true;
      rec.maxAlternatives = 1;

      rec.onstart = () => {
        setIsListening(true);
        setSpokenText('');
        setEvalResult(null);
      };

      rec.onresult = (event) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + ' ';
        }
        setSpokenText(transcript.trim());
        if (event.results[event.results.length - 1].isFinal) {
          evaluatePronunciation(transcript.trim());
        }
      };

      rec.onerror = () => {
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      showToast('Không thể khởi động microphone: ' + err.message, 'error');
    }
  };

  const handleGenAISpeaking = async () => {
    if (!isAIConfigured(settings.ai)) {
      showToast('Cần cấu hình AI để tạo câu luyện phát âm mới.', 'error');
      return;
    }
    setIsGenerating(true);
    try {
      const prompt = `Create one natural English sentence for speaking & pronunciation practice at CEFR ${settings.level}.
Return JSON: {
  "en": "English sentence...",
  "vi": "Nghĩa tiếng Việt",
  "ipa": "/Full American IPA transcription/",
  "tip": "Mẹo phát âm, nối âm hoặc trọng âm bằng tiếng Việt"
}`;
      const res = await callAIJSON(prompt, 'English Phonetics Coach', settings.ai);
      const newDrill = {
        id: 'sp-ai-' + Date.now(),
        ...res
      };
      setDrills(prev => [newDrill, ...prev]);
      setCurrentIndex(0);
      showToast('Đã tạo câu luyện phát âm mới bằng AI!', 'success');
    } catch (err) {
      showToast('Lỗi tạo câu: ' + err.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!currentDrill) {
    return <div className="py-12 text-center text-muted-foreground">Đang tải bài luyện phát âm...</div>;
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg md:text-xl font-bold tracking-tight text-foreground">
              {t('Luyện nói & Phát âm')}
            </h2>
            <AstryxBadge status="positive">Elsa-style Coach</AstryxBadge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Nghe giọng mẫu Kokoro AI, bấm thu âm để hệ thống phân tích độ chính xác từng từ.
          </p>
        </div>

        <AstryxButton
          variant="outline"
          size="sm"
          icon={Icons.Sparkles}
          isLoading={isGenerating}
          onClick={handleGenAISpeaking}
        >
          Câu mới bằng AI
        </AstryxButton>
      </div>

      {/* Main Speaking Card */}
      <AstryxCard padding="lg" className="space-y-6">
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Câu {currentIndex + 1}/{drills.length}</span>
          <AstryxBadge status="accent">{settings.level}</AstryxBadge>
        </div>

        {/* Target Sentence & IPA */}
        <div className="p-5 rounded-xl border border-border bg-muted/20 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg md:text-2xl font-bold text-foreground leading-snug">
              {currentDrill.en}
            </h3>
            <div className="flex items-center gap-1.5 shrink-0">
              <AudioPlayer text={currentDrill.en} size="md" />
              <AudioPlayer text={currentDrill.en} slow={true} size="md" />
            </div>
          </div>

          {currentDrill.ipa && (
            <div className="text-xs sm:text-sm font-mono text-primary">
              {currentDrill.ipa}
            </div>
          )}

          <div className="text-xs sm:text-sm text-muted-foreground border-t border-border/60 pt-2">
            {currentDrill.vi}
          </div>
        </div>

        {/* Phonetic Coaching Tip */}
        {currentDrill.tip && (
          <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-2.5 text-xs">
            <Icons.Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-foreground">Mẹo phát âm & nối âm: </span>
              <span className="text-foreground/90">{currentDrill.tip}</span>
            </div>
          </div>
        )}

        {/* Microphone Recording Center */}
        <div className="flex flex-col items-center justify-center py-4 space-y-3 border-y border-border">
          <button
            type="button"
            onClick={toggleRecording}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-md ${
              isListening
                ? 'bg-red-500 text-white ring-8 ring-red-500/20 animate-pulse'
                : 'bg-primary text-primary-foreground hover:scale-105'
            }`}
            title={isListening ? "Nhấn để dừng thu âm" : "Nhấn để bắt đầu nói tiếng Anh"}
          >
            <Icons.Speaking className="w-7 h-7" />
          </button>

          <div className="text-xs font-semibold text-foreground">
            {isListening ? 'Đang lắng nghe bạn nói... (Hãy đọc to câu tiếng Anh)' : 'Bấm biểu tượng Micro để bắt đầu nói'}
          </div>

          {spokenText && (
            <div className="text-xs text-muted-foreground italic">
              Nhận diện: "{spokenText}"
            </div>
          )}
        </div>

        {/* Manual / Fallback Practice Input (For environments without mic permission) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Hoặc đọc to rồi gõ/kiểm tra âm bạn vừa đọc:</span>
            <button
              type="button"
              onClick={() => {
                speak(currentDrill.en, { voiceName: settings.voice, rate: settings.rate });
                evaluatePronunciation(currentDrill.en);
              }}
              className="text-primary font-semibold hover:underline"
            >
              Đã đọc to thành công (Tự chấm 100%)
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={spokenText}
              onChange={e => setSpokenText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && spokenText.trim()) {
                  evaluatePronunciation(spokenText.trim());
                }
              }}
              placeholder="Nội dung nhận diện giọng nói hoặc tự nhập..."
              className="astryx-input flex-1 px-3 py-2 text-xs"
            />
            <AstryxButton
              variant="secondary"
              size="sm"
              disabled={!spokenText.trim()}
              onClick={() => evaluatePronunciation(spokenText.trim())}
            >
              Chấm phát âm
            </AstryxButton>
          </div>
        </div>

        {/* Pronunciation Score & Word-by-Word Color Breakdown */}
        {evalResult && (
          <div className="p-5 rounded-xl border border-border bg-muted/30 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-extrabold ${
                  evalResult.accuracy >= 80
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : evalResult.accuracy >= 55
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-destructive'
                }`}>
                  {evalResult.accuracy}%
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  độ chuẩn xác phát âm
                </span>
              </div>

              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Rõ âm
                </span>
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Gần đúng
                </span>
                <span className="flex items-center gap-1 text-destructive font-semibold">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> Cần luyện lại
                </span>
              </div>
            </div>

            {/* Word-level phonetic coloring */}
            <div className="p-3.5 rounded-lg border border-border bg-card flex flex-wrap gap-2">
              {evalResult.wordBreakdown.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => speak(item.word, { voiceName: settings.voice, rate: 0.85 })}
                  className={`px-2.5 py-1 rounded-md text-sm font-bold border transition-transform hover:scale-105 ${
                    item.status === 'good'
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                      : item.status === 'close'
                        ? 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300'
                        : 'border-destructive/40 bg-destructive/10 text-destructive'
                  }`}
                  title="Bấm vào từ để nghe phát âm chậm của từ này"
                >
                  {item.word}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-2">
          <AstryxButton
            variant="ghost"
            size="sm"
            onClick={() => setCurrentIndex((currentIndex - 1 + drills.length) % drills.length)}
          >
            ← Câu trước
          </AstryxButton>
          <AstryxButton
            variant="primary"
            size="sm"
            onClick={() => setCurrentIndex((currentIndex + 1) % drills.length)}
          >
            Câu tiếp theo →
          </AstryxButton>
        </div>

      </AstryxCard>
    </div>
  );
}
