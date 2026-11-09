import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { LEVELS } from '../data/staticData';
import { callAIJSON, isAIConfigured } from '../services/ai';
import AudioPlayer from './AudioPlayer';
import { AstryxCard, AstryxButton, AstryxBadge, AstryxSegmentedControl } from '../astryx/components';
import { Icons } from './Icons';

export default function GrammarTab() {
  const { settings, awardPoints, addWordToReview, showToast, t } = useApp();

  const [subTab, setSubTab] = useState('lessons'); // 'lessons' | 'verbs'
  const [grammarList, setGrammarList] = useState([]);
  const [verbsList, setVerbsList] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [activeTopicId, setActiveTopicId] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [verbQuery, setVerbQuery] = useState('');
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState(null);
  const [isAskingAI, setIsAskingAI] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await api.getGrammar();
      if (data) {
        setGrammarList(data.grammar || []);
        setVerbsList(data.irregularVerbs || []);
        if (data.grammar?.length) setActiveTopicId(data.grammar[0].id);
      }
    };
    load();
  }, []);

  const filteredGrammar = selectedLevel === 'ALL'
    ? grammarList
    : grammarList.filter(g => g.lv === selectedLevel);

  const currentTopic = filteredGrammar.find(g => g.id === activeTopicId) || filteredGrammar[0] || null;

  const filteredVerbs = verbsList.filter(v => {
    if (!verbQuery.trim()) return true;
    const q = verbQuery.toLowerCase();
    return (
      v.v1.toLowerCase().includes(q) ||
      v.v2.toLowerCase().includes(q) ||
      v.v3.toLowerCase().includes(q) ||
      v.vi.toLowerCase().includes(q)
    );
  });

  const handleSelectQuizAnswer = (qIdx, oIdx, rightIdx) => {
    const key = `${currentTopic.id}_${qIdx}`;
    if (quizAnswers[key] !== undefined) return;
    setQuizAnswers(prev => ({ ...prev, [key]: oIdx }));
    const ok = oIdx === rightIdx;
    awardPoints('grammar', ok, ok ? 3 : 0);
  };

  const handleAskGrammarAI = async () => {
    if (!aiQuestion.trim()) return;
    if (!isAIConfigured(settings.ai)) {
      showToast('Hãy cấu hình AI trong Cài đặt để hỏi gia sư ngữ pháp AI.', 'error');
      return;
    }
    setIsAskingAI(true);
    try {
      const prompt = `A Vietnamese learner (CEFR ${settings.level}) asks this English grammar question: """${aiQuestion.trim()}""".
Explain clearly in Vietnamese with formula, 2 natural English examples (with Vietnamese translation), and 1 common mistake to avoid.
Return JSON: {
  "title": "Tên chủ điểm ngữ pháp",
  "formula": "Công thức tóm tắt",
  "explanation": "Giải thích dễ hiểu bằng tiếng Việt",
  "examples": [{"en":"...","vi":"..."}],
  "mistake": "Lỗi thường gặp cần tránh"
}`;
      const res = await callAIJSON(prompt, 'Expert English Grammar Teacher', settings.ai);
      setAiAnswer(res);
    } catch (err) {
      showToast('Lỗi hỏi AI: ' + err.message, 'error');
    } finally {
      setIsAskingAI(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
        <div>
          <h2 className="text-lg md:text-xl font-bold tracking-tight text-foreground">
            {t('Ngữ pháp & Động từ')}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Hệ thống hóa công thức ngữ pháp CEFR A1–C1, lỗi người Việt hay gặp và bảng 45 động từ bất quy tắc.
          </p>
        </div>

        <AstryxSegmentedControl
          value={subTab}
          onChange={setSubTab}
          options={[
            { value: 'lessons', label: 'Chuyên đề Ngữ pháp', icon: Icons.BookOpen, badge: grammarList.length },
            { value: 'verbs', label: 'Động từ Bất quy tắc', icon: Icons.Vocab, badge: verbsList.length }
          ]}
        />
      </div>

      {/* TAB 1: GRAMMAR LESSONS */}
      {subTab === 'lessons' ? (
        <div className="space-y-6">
          {/* AI Grammar Tutor Bar */}
          <AstryxCard padding="sm" className="space-y-3 bg-muted/20">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-primary shrink-0">
                <Icons.Sparkles className="w-4 h-4" />
                <span>Hỏi nhanh Gia sư Ngữ pháp AI:</span>
              </div>
              <input
                type="text"
                value={aiQuestion}
                onChange={e => setAiQuestion(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAskGrammarAI(); }}
                placeholder="VD: Phân biệt 'used to', 'be used to' và 'get used to'..."
                className="astryx-input flex-1 px-3 py-1.5 text-xs"
              />
              <AstryxButton
                variant="primary"
                size="sm"
                isLoading={isAskingAI}
                disabled={!aiQuestion.trim()}
                onClick={handleAskGrammarAI}
              >
                Giải thích
              </AstryxButton>
            </div>

            {aiAnswer && (
              <div className="p-4 rounded-xl border border-primary/30 bg-card space-y-2.5 text-xs animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-primary">{aiAnswer.title}</span>
                  <button onClick={() => setAiAnswer(null)} className="text-muted-foreground hover:text-foreground">✕</button>
                </div>
                {aiAnswer.formula && (
                  <div className="p-2 rounded bg-muted font-mono font-semibold text-foreground">
                    {aiAnswer.formula}
                  </div>
                )}
                <p className="text-foreground/90 leading-relaxed">{aiAnswer.explanation}</p>
                {aiAnswer.examples?.map((ex, i) => (
                  <div key={i} className="p-2 rounded border border-border bg-muted/20 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-foreground">{ex.en}</div>
                      <div className="text-muted-foreground">{ex.vi}</div>
                    </div>
                    <AudioPlayer text={ex.en} size="sm" />
                  </div>
                ))}
                {aiAnswer.mistake && (
                  <div className="text-destructive font-medium">⚠️ Lưu ý: {aiAnswer.mistake}</div>
                )}
              </div>
            )}
          </AstryxCard>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Sidebar: Grammar Topics List */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                {['ALL', ...LEVELS].map(lv => (
                  <button
                    key={lv}
                    onClick={() => setSelectedLevel(lv)}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold border transition-all ${
                      selectedLevel === lv
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-card text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {lv === 'ALL' ? 'Tất cả' : lv}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                {filteredGrammar.map(item => {
                  const isSelected = currentTopic?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTopicId(item.id)}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/10 shadow-xs'
                          : 'border-border bg-card hover:bg-muted/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <AstryxBadge status={isSelected ? 'accent' : 'neutral'}>{item.lv}</AstryxBadge>
                        <span className="text-[10px] text-muted-foreground font-medium">{item.category}</span>
                      </div>
                      <div className="font-bold text-xs sm:text-sm text-foreground">{item.titleVi}</div>
                      <div className="text-[11px] text-muted-foreground truncate">{item.title}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right 2 Columns: Selected Grammar Lesson Detail */}
            {currentTopic && (
              <div className="lg:col-span-2">
                <AstryxCard padding="lg" className="space-y-5">
                  <div className="border-b border-border pb-4 space-y-1">
                    <div className="flex items-center gap-2">
                      <AstryxBadge status="accent">{currentTopic.lv}</AstryxBadge>
                      <span className="text-xs text-muted-foreground font-semibold">{currentTopic.category}</span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground pt-1">{currentTopic.titleVi}</h3>
                    <p className="text-xs text-muted-foreground">{currentTopic.title}</p>
                  </div>

                  {/* Formula Box */}
                  <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      Công thức cốt lõi
                    </div>
                    <div className="font-mono text-xs sm:text-sm font-bold text-foreground">
                      {currentTopic.formula}
                    </div>
                  </div>

                  {/* Usage & Common Mistake */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1.5">
                      <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Icons.CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Cách dùng chuẩn</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {currentTopic.usage}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/5 space-y-1.5">
                      <div className="text-xs font-bold text-destructive flex items-center gap-1.5">
                        <Icons.AlertCircle className="w-4 h-4" />
                        <span>Lỗi người Việt hay mắc</span>
                      </div>
                      <p className="text-xs text-foreground/90 leading-relaxed">
                        {currentTopic.mistake}
                      </p>
                    </div>
                  </div>

                  {/* Examples with Audio */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Ví dụ thực tế
                    </div>
                    <div className="space-y-2">
                      {(currentTopic.examples || []).map((ex, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-lg border border-border bg-card flex items-center justify-between gap-3"
                        >
                          <div className="space-y-0.5 text-xs sm:text-sm">
                            <div className="font-semibold text-foreground">{ex.en}</div>
                            <div className="text-xs text-muted-foreground">{ex.vi}</div>
                          </div>
                          <AudioPlayer text={ex.en} size="sm" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Mini-Quiz */}
                  {currentTopic.quiz && currentTopic.quiz.length > 0 && (
                    <div className="pt-4 border-t border-border space-y-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-primary">
                        Bài tập vận dụng nhanh (+3 XP / câu)
                      </div>
                      {currentTopic.quiz.map((q, qIdx) => {
                        const key = `${currentTopic.id}_${qIdx}`;
                        const picked = quizAnswers[key];
                        const isDone = picked !== undefined;
                        return (
                          <div key={qIdx} className="p-4 rounded-xl border border-border bg-muted/20 space-y-2.5 text-xs">
                            <div className="font-bold text-sm text-foreground">{q.q}</div>
                            <div className="grid grid-cols-2 gap-2">
                              {q.options.map((opt, oIdx) => {
                                const isRight = isDone && oIdx === q.answer;
                                const isWrong = isDone && picked === oIdx && !isRight;
                                return (
                                  <button
                                    key={oIdx}
                                    disabled={isDone}
                                    onClick={() => handleSelectQuizAnswer(qIdx, oIdx, q.answer)}
                                    className={`p-2.5 rounded-lg border text-left font-semibold transition-all ${
                                      isRight
                                        ? 'border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                                        : isWrong
                                          ? 'border-destructive bg-destructive/15 text-destructive'
                                          : 'border-border bg-card hover:bg-muted text-foreground'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                            {isDone && (
                              <div className="text-muted-foreground pt-1">
                                <strong>Giải thích:</strong> {q.explain}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </AstryxCard>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* TAB 2: IRREGULAR VERBS TABLE */
        <AstryxCard padding="lg" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-foreground">
                Bảng Động từ Bất quy tắc thông dụng (V1 – V2 – V3)
              </h3>
              <p className="text-xs text-muted-foreground">
                Tra cứu nhanh, nghe phát âm cả 3 dạng và lưu động từ vào Sổ tay.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Icons.Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={verbQuery}
                onChange={e => setVerbQuery(e.target.value)}
                placeholder="Tìm động từ (VD: write, wrote, viết...)"
                className="astryx-input w-full pl-8 pr-3 py-2 text-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-muted/60 text-muted-foreground border-b border-border text-xs uppercase">
                  <th className="py-3 px-4 font-bold">V1 (Nguyên thể)</th>
                  <th className="py-3 px-4 font-bold">V2 (Quá khứ)</th>
                  <th className="py-3 px-4 font-bold">V3 (Quá khứ phân từ)</th>
                  <th className="py-3 px-4 font-bold">Nghĩa tiếng Việt & Ví dụ</th>
                  <th className="py-3 px-4 font-bold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredVerbs.map((v, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-extrabold text-primary">
                      {v.v1} <span className="text-[11px] font-mono font-normal text-muted-foreground block">{v.ipa}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-foreground">{v.v2}</td>
                    <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">{v.v3}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-foreground">{v.vi}</div>
                      <div className="text-xs text-muted-foreground italic">{v.ex}</div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <AudioPlayer text={`${v.v1}. ${v.v2}. ${v.v3}.`} size="sm" />
                        <button
                          type="button"
                          onClick={() => {
                            addWordToReview({
                              en: `${v.v1} (${v.v2} - ${v.v3})`,
                              vi: v.vi,
                              ipa: v.ipa,
                              lv: v.lv || 'A2'
                            });
                            showToast(`Đã lưu "${v.v1}" vào Sổ tay!`, 'success');
                          }}
                          className="astryx-btn astryx-btn-sm astryx-btn-outline"
                          title="Lưu vào sổ tay"
                        >
                          <Icons.Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AstryxCard>
      )}
    </div>
  );
}
