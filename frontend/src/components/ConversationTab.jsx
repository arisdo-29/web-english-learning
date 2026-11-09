import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CONVERSATION_SCENARIOS } from '../data/staticData';
import { callAI, callAIJSON, isAIConfigured } from '../services/ai';
import { speak } from '../services/tts';
import AudioPlayer from './AudioPlayer';
import { AstryxCard, AstryxButton, AstryxBadge, AstryxAgentStatus } from '../astryx/components';
import { Icons } from './Icons';

export default function ConversationTab() {
  const { settings, awardPoints, addMistakeNote, showToast, t } = useApp();

  const [selectedScenario, setSelectedScenario] = useState(CONVERSATION_SCENARIOS[0]);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [suggestedReplies, setSuggestedReplies] = useState([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isListeningMic, setIsListeningMic] = useState(false);

  const chatBottomRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chSystem = () => {
    const L = settings.level || 'B1';
    const low = L <= 'A2';
    const corr = {
      all: 'correct every grammar or word-choice mistake',
      major: 'only correct mistakes that make the meaning unclear or are very basic'
    }[settings.chatCorrection || 'all'] || 'correct every grammar mistake';

    const lang = {
      vi: 'in Vietnamese',
      both: 'in Vietnamese, keeping English terms',
      en: 'in simple English'
    }[settings.feedbackLang || 'vi'] || 'in Vietnamese';

    const corrRule = settings.chatCorrection === 'off'
      ? 'Never correct the learner.'
      : `If the learner's last message has mistakes, ${corr}: after your reply add a new line starting with "Góp ý:" followed by the corrected sentence and a very short explanation ${lang}. If nothing needs correcting, do not add that line.`;

    return `You are roleplaying as "${selectedScenario.role}" in a conversation with a Vietnamese English learner at CEFR ${L}. Topic: ${selectedScenario.topic}. Learner's goal: ${selectedScenario.goal}. Use vocabulary and sentence length suitable for ${L}${low ? ' (very short, simple sentences)' : ''}. Keep replies to ${low ? '1-2' : '2-3'} sentences and end with a natural follow-up question. ${corrRule}`;
  };

  const startConversation = async () => {
    setMessages([]);
    setSuggestedReplies([]);

    if (!isAIConfigured(settings.ai)) {
      setMessages([
        {
          role: 'assistant',
          mainText: `Hello! I'm your ${selectedScenario.role} for the "${selectedScenario.title}" scenario. (Hãy kết nối API Key hoặc URL AI trong mục Cài đặt > Kết nối AI để bắt đầu trò chuyện trực tiếp cùng AI Partner nhé!)`
        }
      ]);
      return;
    }

    setIsSending(true);
    try {
      const startMsg = `Start the roleplay as ${selectedScenario.role} with a welcoming greeting and a first question related to ${selectedScenario.topic}.`;
      const reply = await callAI([{ role: 'user', content: startMsg }], chSystem(), settings.ai);
      const parsed = parseBotText(reply);
      setMessages([
        { role: 'user', content: startMsg, hidden: true },
        { role: 'assistant', ...parsed }
      ]);

      if (settings.autoSpeak) {
        speak(parsed.mainText, { voiceName: settings.voice, rate: settings.rate });
      }
    } catch (err) {
      showToast('Lỗi: ' + err.message, 'error');
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    startConversation();
  }, [selectedScenario.id]);

  const parseBotText = (text) => {
    const parts = (text || '').split(/\n?\s*Góp ý:/);
    const mainText = parts[0].trim();
    const feedback = parts.slice(1).join(' ').trim();
    return { mainText, feedback, raw: text };
  };

  const handleSend = async (overrideText = null) => {
    const text = (overrideText ?? inputText).trim();
    if (!text || isSending) return;

    setInputText('');
    setSuggestedReplies([]);

    const newHistory = [...messages, { role: 'user', content: text, mainText: text }];
    setMessages(newHistory);
    setIsSending(true);

    try {
      const aiMessages = newHistory.map(m => ({ role: m.role, content: m.content || m.mainText }));
      const reply = await callAI(aiMessages, chSystem(), settings.ai);
      const parsed = parseBotText(reply);

      setMessages(prev => [...prev, { role: 'assistant', ...parsed }]);
      awardPoints('chat', !parsed.feedback, 2);

      if (parsed.feedback) {
        addMistakeNote({
          type: 'Hội thoại AI',
          wrong: text,
          fix: parsed.feedback,
          why: `Kịch bản: ${selectedScenario.title}`
        });
      }

      if (settings.autoSpeak) {
        speak(parsed.mainText, { voiceName: settings.voice, rate: settings.rate });
      }
    } catch (err) {
      showToast('Lỗi gửi: ' + err.message, 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleToggleVoiceMic = () => {
    const SpeechRec = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SpeechRec) {
      showToast('Trình duyệt hiện tại chưa hỗ trợ nhập giọng nói trực tiếp.', 'info');
      return;
    }

    if (isListeningMic) {
      try { recognitionRef.current?.stop(); } catch {}
      setIsListeningMic(false);
      return;
    }

    try {
      const rec = new SpeechRec();
      rec.lang = 'en-US';
      rec.interimResults = false;
      rec.onstart = () => setIsListeningMic(true);
      rec.onresult = (event) => {
        const text = event.results[0]?.[0]?.transcript || '';
        if (text) {
          setInputText(prev => (prev ? `${prev} ${text}` : text));
        }
      };
      rec.onerror = () => setIsListeningMic(false);
      rec.onend = () => setIsListeningMic(false);
      recognitionRef.current = rec;
      rec.start();
    } catch {
      setIsListeningMic(false);
    }
  };

  const handleGetSuggestions = async () => {
    if (!messages.length) return;
    if (!isAIConfigured(settings.ai)) {
      showToast('Cần cấu hình AI để lấy gợi ý trả lời.', 'error');
      return;
    }

    setIsSuggesting(true);
    try {
      const historyText = messages
        .filter(m => !m.hidden)
        .slice(-4)
        .map(m => `${m.role === 'user' ? 'Learner: ' : 'Partner: '}${m.mainText}`)
        .join('\n');

      const prompt = `Conversation so far:\n${historyText}\n\nSuggest 2 short possible replies the learner could send next, at CEFR ${settings.level} level.
Return JSON: {"replies":[{"en":"...","vi":"nghĩa tiếng Việt"}]}`;
      const res = await callAIJSON(prompt, 'English Teacher', settings.ai);
      setSuggestedReplies(res.replies || []);
    } catch (err) {
      showToast('Không lấy được gợi ý: ' + err.message, 'error');
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto pb-12 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg md:text-xl font-bold tracking-tight text-foreground">
              {t('Luyện hội thoại')}
            </h2>
            <AstryxAgentStatus state={isSending ? 'thinking' : isAIConfigured(settings.ai) ? 'ready' : 'offline'} />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Chọn kịch bản nhập vai thực tế, trò chuyện bằng bàn phím hoặc giọng nói và nhận góp ý ngữ pháp tức thì.
          </p>
        </div>

        <AstryxButton
          variant="outline"
          size="sm"
          icon={Icons.RotateCcw}
          onClick={startConversation}
        >
          {t('Bắt đầu lại')}
        </AstryxButton>
      </div>

      {/* Scenario Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {CONVERSATION_SCENARIOS.map(sc => {
          const active = selectedScenario.id === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => setSelectedScenario(sc)}
              className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                active
                  ? 'border-primary bg-primary/10 font-bold text-primary shadow-xs'
                  : 'border-border bg-card hover:bg-muted/60 text-foreground'
              }`}
            >
              <div className="truncate font-bold">{sc.title}</div>
              <div className="text-[10px] text-muted-foreground truncate mt-0.5">{sc.role}</div>
            </button>
          );
        })}
      </div>

      {/* Mission Banner & Starter Phrases */}
      <AstryxCard padding="sm" className="bg-muted/20 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div>
            <span className="font-bold text-primary uppercase tracking-wider mr-2">Nhiệm vụ kịch bản:</span>
            <span className="text-foreground font-medium">{selectedScenario.goal}</span>
          </div>
          <AstryxBadge status="neutral">Vai AI: {selectedScenario.role}</AstryxBadge>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-muted-foreground font-semibold">Mẫu câu gợi ý:</span>
          {selectedScenario.phrases.map((ph, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setInputText(ph)}
              className="px-2 py-0.5 rounded-md border border-border bg-card hover:border-primary text-[11px] font-medium text-foreground transition-colors"
            >
              "{ph}"
            </button>
          ))}
        </div>
      </AstryxCard>

      {/* Chat Messages Container */}
      <AstryxCard padding="md" className="min-h-[440px] max-h-[560px] flex flex-col justify-between space-y-4">
        
        <div className="space-y-3.5 overflow-y-auto pr-1 flex-1">
          {messages.filter(m => !m.hidden).map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-in fade-in duration-150`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border bg-muted/50 text-foreground'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.mainText}</p>

                  {!isUser && msg.feedback && (
                    <div className="mt-2.5 pt-2 border-t border-border/80 text-xs text-amber-700 dark:text-amber-300 bg-amber-500/10 p-2 rounded-lg">
                      <strong>💡 Góp ý ngữ pháp:</strong> {msg.feedback}
                    </div>
                  )}

                  {!isUser && (
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground font-semibold">{selectedScenario.role}</span>
                      <AudioPlayer text={msg.mainText} size="sm" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="text-xs text-muted-foreground py-1 flex items-center gap-2">
              <span className="astryx-spinner text-primary" />
              <span>{selectedScenario.role} đang suy nghĩ và kiểm tra ngữ pháp...</span>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Suggested Replies Chips */}
        {suggestedReplies.length > 0 && (
          <div className="pt-2 border-t border-border space-y-1.5">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              {t('Gợi ý câu trả lời')}:
            </span>
            <div className="flex flex-wrap gap-2">
              {suggestedReplies.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInputText(sug.en);
                    setSuggestedReplies([]);
                  }}
                  className="p-2 rounded-lg border border-border bg-card hover:border-primary text-left text-xs transition-colors"
                >
                  <span className="font-bold text-foreground block">{sug.en}</span>
                  <span className="text-[11px] text-muted-foreground">{sug.vi}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar with Voice Microphone */}
        <div className="pt-3 border-t border-border flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleVoiceMic}
            className={`astryx-btn astryx-btn-md px-3 ${
              isListeningMic ? 'bg-red-500 text-white animate-pulse' : 'astryx-btn-outline'
            }`}
            title="Nói bằng giọng của bạn (Speech-to-Text)"
          >
            <Icons.Speaking className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder={isListeningMic ? 'Đang nghe bạn nói...' : 'Nhập câu trả lời tiếng Anh của bạn...'}
            className="astryx-input flex-1 p-2.5 text-sm"
          />

          <AstryxButton
            variant="outline"
            size="md"
            icon={Icons.Lightbulb}
            isLoading={isSuggesting}
            onClick={handleGetSuggestions}
            title="AI gợi ý câu trả lời"
          >
            <span className="hidden sm:inline">{t('Gợi ý câu trả lời')}</span>
          </AstryxButton>

          <AstryxButton
            variant="primary"
            size="md"
            disabled={!inputText.trim() || isSending}
            onClick={() => handleSend()}
          >
            {t('Gửi')}
          </AstryxButton>
        </div>

      </AstryxCard>

    </div>
  );
}
