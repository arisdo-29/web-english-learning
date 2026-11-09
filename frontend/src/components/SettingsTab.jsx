import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AI_PROVIDERS, POPULAR_ENDPOINTS, POPULAR_MODELS, isAIConfigured, callAI, callAIJSON } from '../services/ai';
import { getEnglishVoices, speak, KOKORO_VOICES } from '../services/tts';
import { LEVELS, LEVEL_NAME, TOPICS } from '../data/staticData';
import { ASTRYX_THEMES } from '../astryx/themes';
import { AstryxCard, AstryxButton, AstryxBadge, AstryxSegmentedControl } from '../astryx/components';
import { Icons } from './Icons';

export default function SettingsTab() {
  const {
    settings,
    updateSettings,
    showToast,
    resetAllStats,
    clearCustomPassages,
    resetDefaultSettings,
    applyLevel,
    t
  } = useApp();

  const [aiConfig, setAiConfig] = useState(settings.ai || { provider: 'custom', model: 'gpt-4o-mini', key: '', url: 'https://api.openai.com/v1' });
  const [aiMode, setAiMode] = useState(
    (settings.ai?.provider === 'custom' || settings.ai?.url) ? 'custom' : 'preset'
  );
  const [showApiKey, setShowApiKey] = useState(false);
  const [testingAI, setTestingAI] = useState(false);
  const [aiTestResult, setAiTestResult] = useState(null);
  const [voices, setVoices] = useState([]);

  const [topicDesc, setTopicDesc] = useState('');
  const [suggestedTopics, setSuggestedTopics] = useState([]);
  const [isSuggestingTopics, setIsSuggestingTopics] = useState(false);

  const [confirmResetStats, setConfirmResetStats] = useState(false);
  const [confirmResetCustom, setConfirmResetCustom] = useState(false);
  const [confirmResetSettings, setConfirmResetSettings] = useState(false);

  useEffect(() => {
    setVoices(getEnglishVoices());
  }, []);

  useEffect(() => {
    if (settings.ai) {
      setAiConfig(settings.ai);
      if (settings.ai.provider === 'custom' || settings.ai.url) {
        setAiMode('custom');
      }
    }
  }, [settings.ai]);

  const handleSaveAI = () => {
    updateSettings({ ai: aiConfig });
    showToast('Đã lưu cấu hình AI.', 'success');
  };

  const handleTestAI = async () => {
    setTestingAI(true);
    setAiTestResult(null);
    const start = performance.now();

    try {
      const reply = await callAI(
        [{ role: 'user', content: 'Reply with the single word: OK' }],
        'Test connection',
        aiConfig
      );
      const latency = Math.round(performance.now() - start);
      setAiTestResult({
        success: true,
        message: `Kết nối thành công (${latency}ms)! Phản hồi: "${reply.trim().slice(0, 100)}"`
      });
      updateSettings({ ai: aiConfig }, true);
    } catch (err) {
      setAiTestResult({ success: false, message: `Lỗi kết nối: ${err.message}` });
    } finally {
      setTestingAI(false);
    }
  };

  const handleClearAI = () => {
    const cleared = { ...aiConfig, key: '' };
    setAiConfig(cleared);
    updateSettings({ ai: cleared });
    setAiTestResult(null);
    showToast('Đã xoá key.', 'info');
  };

  const handleSuggestTopics = async () => {
    if (!topicDesc.trim()) {
      showToast('Hãy mô tả chủ đề bạn muốn luyện.', 'error');
      return;
    }
    if (!isAIConfigured(settings.ai)) {
      showToast('Cần cấu hình AI (Key hoặc URL) để gợi ý chủ đề.', 'error');
      return;
    }

    setIsSuggestingTopics(true);
    setSuggestedTopics([]);

    try {
      const prompt = `A Vietnamese English learner (CEFR ${settings.level}) describes what they want to practise: """${topicDesc.trim()}""". Suggest 6 specific, practical practice topics that fit this description.
Return JSON: {"topics":[{"vi":"tên chủ đề ngắn bằng tiếng Việt","en":"short topic name in English","why":"one short line on why it helps"}]}`;
      const res = await callAIJSON(prompt, 'English Curriculum Designer', settings.ai);
      setSuggestedTopics(res.topics || []);
    } catch (err) {
      showToast('Lỗi gợi ý: ' + err.message, 'error');
    } finally {
      setIsSuggestingTopics(false);
    }
  };

  const handleAddCustomTopic = (topicItem, index) => {
    const k = 'c' + Date.now() + index;
    const newCustomTopics = [...(settings.customTopics || []), { k, vi: topicItem.vi, en: topicItem.en }];
    const newTopics = [...(settings.topics || []), k];
    updateSettings({ customTopics: newCustomTopics, topics: newTopics });
    setSuggestedTopics(prev => prev.filter((_, i) => i !== index));
    showToast(`Đã thêm chủ đề "${topicItem.vi}".`, 'success');
  };

  const handleRemoveTopic = (key) => {
    const newCustom = (settings.customTopics || []).filter(c => c.k !== key);
    const newTopics = (settings.topics || []).filter(tKey => tKey !== key);
    updateSettings({ customTopics: newCustom, topics: newTopics.length ? newTopics : ['life'] });
  };

  const handleExportData = () => {
    const data = {
      settings,
      stats: JSON.parse(localStorage.getItem('elg_stats') || '{}'),
      notebook: JSON.parse(localStorage.getItem('elg_notebook') || '{}'),
      custom: JSON.parse(localStorage.getItem('elg_custom') || '[]')
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `luyen-tieng-anh-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Đã xuất dữ liệu.', 'success');
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const d = JSON.parse(reader.result);
        if (d.settings) localStorage.setItem('elg_settings', JSON.stringify(d.settings));
        if (d.stats) localStorage.setItem('elg_stats', JSON.stringify(d.stats));
        if (d.notebook) localStorage.setItem('elg_notebook', JSON.stringify(d.notebook));
        if (d.custom) localStorage.setItem('elg_custom', JSON.stringify(d.custom));
        showToast('Đang khôi phục dữ liệu...', 'success');
        setTimeout(() => window.location.reload(), 800);
      } catch {
        showToast('File không hợp lệ.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const selectedProvider = AI_PROVIDERS[aiConfig.provider] || AI_PROVIDERS.gemini;
  const freeProviders = Object.entries(AI_PROVIDERS).filter(([_, p]) => p.group === 'Có gói miễn phí');
  const paidProviders = Object.entries(AI_PROVIDERS).filter(([_, p]) => p.group === 'Trả phí');
  const localProviders = Object.entries(AI_PROVIDERS).filter(([_, p]) => p.group === 'Chạy trên máy / bên ngoài');

  const allTopicsMap = { ...TOPICS };
  (settings.customTopics || []).forEach(c => {
    allTopicsMap[c.k] = [c.vi, c.en, true];
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 animate-in fade-in duration-200">
      
      {/* 0. Meta Astryx Theme Studio */}
      <AstryxCard padding="lg" className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Icons.Palette className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-base md:text-lg text-foreground">
                Bảng màu Nhu & Pastel (shadcn/ui Studio)
              </h3>
              <AstryxBadge status="accent">shadcn/pastel-themes</AstryxBadge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Chọn 6 tông màu nhu, pastel dịu mắt (Matcha Kem, Tím Oải Hương, Kem Yến Mạch, Xanh Mây, Hồng Phấn, Cam Đào) tối ưu cho việc học và đọc hiểu lâu dài.
            </p>
          </div>
        </div>

        {/* 7 Official Astryx Themes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.values(ASTRYX_THEMES).map(th => {
            const isSelected = (settings.astryxTheme || 'sage') === th.id;
            return (
              <button
                key={th.id}
                type="button"
                onClick={() => updateSettings({ astryxTheme: th.id })}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                    : 'border-border bg-card hover:bg-muted/60'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: th.preview.accent }} />
                      <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: th.preview.bg }} />
                    </div>
                    {isSelected && <AstryxBadge status="accent" prominence="solid">Active</AstryxBadge>}
                  </div>
                  <div className="font-bold text-xs text-foreground">{th.name}</div>
                  <div className="text-[10px] font-mono text-muted-foreground">{th.package}</div>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-snug">
                  {th.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Mode, Radius Scale, Font Size & UI Language */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 pt-2 border-t border-border">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Chế độ Sáng / Tối</label>
            <select
              value={settings.theme || 'light'}
              onChange={e => updateSettings({ theme: e.target.value })}
              className="astryx-select w-full p-2.5 text-xs font-semibold"
            >
              <option value="light">Sáng (Light Mode)</option>
              <option value="dark">Tối (Dark Mode)</option>
              <option value="system">Theo hệ thống (System)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Bo góc đồng tâm (Radius)</label>
            <select
              value={settings.radiusScale || 'standard'}
              onChange={e => updateSettings({ radiusScale: e.target.value })}
              className="astryx-select w-full p-2.5 text-xs font-semibold"
            >
              <option value="sharp">Sắc nét (Sharp)</option>
              <option value="standard">Tiêu chuẩn Astryx (4/8/12px)</option>
              <option value="rounded">Mềm mại (Rounded 1.35x)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Cỡ chữ hệ thống</label>
            <select
              value={settings.fontSize || 'm'}
              onChange={e => updateSettings({ fontSize: e.target.value })}
              className="astryx-select w-full p-2.5 text-xs font-semibold"
            >
              <option value="s">Nhỏ (14px)</option>
              <option value="m">Tiêu chuẩn (16px)</option>
              <option value="l">Lớn (17.5px)</option>
              <option value="xl">Rất lớn (19px)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">{t('Ngôn ngữ hiển thị')}</label>
            <select
              value={settings.uiLang || 'vi'}
              onChange={e => updateSettings({ uiLang: e.target.value })}
              className="astryx-select w-full p-2.5 text-xs font-semibold"
            >
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </AstryxCard>

      {/* 1. Trình độ và nội dung */}
      <AstryxCard padding="lg" className="space-y-5">
        <div>
          <h3 className="font-bold text-base md:text-lg text-foreground">
            {t('Trình độ và nội dung')}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            {t('Trình độ quyết định đề có sẵn, độ khó của đề AI tạo và cách AI nhận xét.')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              {t('Trình độ (CEFR)')}
            </label>
            <select
              value={settings.level || 'B1'}
              onChange={e => applyLevel(e.target.value, true)}
              className="astryx-select w-full p-2.5 text-xs font-medium"
            >
              {LEVELS.map(lv => (
                <option key={lv} value={lv}>{lv} · {t(LEVEL_NAME[lv])}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              {t('Phạm vi đề có sẵn')}
            </label>
            <select
              value={settings.range || 'around'}
              onChange={e => updateSettings({ range: e.target.value })}
              className="astryx-select w-full p-2.5 text-xs font-medium"
            >
              <option value="exact">{t('Đúng trình độ')}</option>
              <option value="around">{t('Quanh trình độ (±1 bậc)')}</option>
              <option value="easier">{t('Thêm 1 bậc thấp hơn (ôn lại)')}</option>
              <option value="harder">{t('Thêm 1 bậc cao hơn (thử thách)')}</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              {t('Nguồn đề khi bấm "tiếp"')}
            </label>
            <select
              value={settings.source || 'builtin'}
              onChange={e => updateSettings({ source: e.target.value })}
              className="astryx-select w-full p-2.5 text-xs font-medium"
            >
              <option value="builtin">{t('Đề có sẵn')}</option>
              <option value="mix">{t('Trộn đề có sẵn và AI')}</option>
              <option value="ai">{t('Luôn tạo bằng AI')}</option>
            </select>
          </div>
        </div>

        {/* Favorite Topics */}
        <div className="space-y-2 pt-2 border-t border-border">
          <label className="text-xs font-semibold text-foreground block">
            {t('Chủ đề yêu thích')}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(allTopicsMap).map(([k, [vi, en, isCustom]]) => {
              const isOn = (settings.topics || []).includes(k);
              const label = settings.uiLang === 'en' ? en : vi;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    const cur = settings.topics || [];
                    const next = isOn ? cur.filter(x => x !== k) : [...cur, k];
                    updateSettings({ topics: next.length ? next : ['life'] });
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                    isOn
                      ? 'border-primary bg-primary text-primary-foreground font-semibold'
                      : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <span>{label}</span>
                  {isCustom && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveTopic(k);
                      }}
                      className="hover:opacity-75 font-bold"
                      title="Xoá chủ đề"
                    >
                      ×
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Suggest Topics */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-semibold text-foreground block">
            {t('Mô tả chủ đề bạn muốn luyện')}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={topicDesc}
              onChange={e => setTopicDesc(e.target.value)}
              placeholder={t('Ví dụ: tôi sắp phỏng vấn thực tập Java backend')}
              className="astryx-input flex-1 p-2 text-xs"
            />
            <AstryxButton
              variant="outline"
              size="sm"
              isLoading={isSuggestingTopics}
              disabled={!topicDesc.trim()}
              onClick={handleSuggestTopics}
            >
              {t('Gợi ý chủ đề')}
            </AstryxButton>
          </div>

          {suggestedTopics.length > 0 && (
            <div className="space-y-1.5 pt-2">
              {suggestedTopics.map((item, i) => (
                <div key={i} className="p-2.5 rounded border border-border bg-muted/30 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-semibold text-foreground">{item.vi}</span>{' '}
                    <span className="text-muted-foreground">· {item.en}</span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{item.why}</p>
                  </div>
                  <AstryxButton
                    variant="primary"
                    size="sm"
                    onClick={() => handleAddCustomTopic(item, i)}
                  >
                    {t('Thêm')}
                  </AstryxButton>
                </div>
              ))}
            </div>
          )}
        </div>
      </AstryxCard>

      {/* 2. Cách chơi */}
      <AstryxCard padding="lg" className="space-y-5">
        <h3 className="font-bold text-base md:text-lg text-foreground">
          {t('Cách chơi')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              {t('Số câu mỗi lượt từ vựng')}
            </label>
            <select
              value={settings.vocabCount || 10}
              onChange={e => updateSettings({ vocabCount: parseInt(e.target.value, 10) })}
              className="astryx-select w-full p-2.5 text-xs font-medium"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              {t('Kiểu câu hỏi từ vựng')}
            </label>
            <select
              value={settings.vocabType || 'mix'}
              onChange={e => updateSettings({ vocabType: e.target.value })}
              className="astryx-select w-full p-2.5 text-xs font-medium"
            >
              <option value="choice">{t('Trắc nghiệm')}</option>
              <option value="type">{t('Tự gõ từ tiếng Anh')}</option>
              <option value="mix">{t('Trộn cả hai')}</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              {t('Thời gian mỗi câu từ vựng')}
            </label>
            <select
              value={settings.timer ?? 0}
              onChange={e => updateSettings({ timer: parseInt(e.target.value, 10) })}
              className="astryx-select w-full p-2.5 text-xs font-medium"
            >
              <option value="0">{t('Không giới hạn')}</option>
              <option value="30">{t('30 giây')}</option>
              <option value="20">{t('20 giây')}</option>
              <option value="15">{t('15 giây')}</option>
              <option value="10">{t('10 giây')}</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              {t('Kiểu điền từ')}
            </label>
            <select
              value={settings.blankType || 'type'}
              onChange={e => updateSettings({ blankType: e.target.value })}
              className="astryx-select w-full p-2.5 text-xs font-medium"
            >
              <option value="choice">{t('Chọn đáp án')}</option>
              <option value="type">{t('Tự gõ')}</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              {t('Mục tiêu điểm mỗi ngày')}
            </label>
            <select
              value={settings.dailyGoal || 50}
              onChange={e => updateSettings({ dailyGoal: parseInt(e.target.value, 10) })}
              className="astryx-select w-full p-2.5 text-xs font-medium"
            >
              <option value="20">20 XP</option>
              <option value="50">50 XP</option>
              <option value="100">100 XP</option>
              <option value="150">150 XP</option>
              <option value="200">200 XP</option>
            </select>
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <label className="flex items-start gap-2.5 text-xs text-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!!settings.hints}
              onChange={e => updateSettings({ hints: e.target.checked })}
              className="mt-0.5 rounded border-input"
            />
            <div>
              <span className="font-semibold block">{t('Hiện gợi ý')}</span>
              <span className="text-muted-foreground leading-relaxed block mt-0.5">
                {t('Từ khoá khi dịch, chữ cái đầu khi gõ từ, gợi ý ngữ pháp, nút gợi ý khi sắp xếp câu.')}
              </span>
            </div>
          </label>
        </div>
      </AstryxCard>

      {/* 3. AI chấm điểm và phản hồi */}
      <AstryxCard padding="lg" className="space-y-5">
        <h3 className="font-bold text-base md:text-lg text-foreground">
          {t('AI chấm điểm và phản hồi')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              {t('Mức chấm điểm')}
            </label>
            <select
              value={settings.strictness || 'normal'}
              onChange={e => updateSettings({ strictness: e.target.value })}
              className="astryx-select w-full p-2.5 text-xs font-medium"
            >
              <option value="easy">{t('Dễ tính, tập trung vào ý nghĩa')}</option>
              <option value="normal">{t('Bình thường')}</option>
              <option value="strict">{t('Khắt khe, như giám khảo IELTS')}</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              {t('Ngôn ngữ nhận xét')}
            </label>
            <select
              value={settings.feedbackLang || 'vi'}
              onChange={e => updateSettings({ feedbackLang: e.target.value })}
              className="astryx-select w-full p-2.5 text-xs font-medium"
            >
              <option value="vi">{t('Tiếng Việt')}</option>
              <option value="both">{t('Tiếng Việt kèm thuật ngữ tiếng Anh')}</option>
              <option value="en">{t('Tiếng Anh đơn giản')}</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              {t('Độ chi tiết giải thích')}
            </label>
            <select
              value={settings.explain || 'short'}
              onChange={e => updateSettings({ explain: e.target.value })}
              className="astryx-select w-full p-2.5 text-xs font-medium"
            >
              <option value="short">{t('Ngắn gọn')}</option>
              <option value="detailed">{t('Chi tiết, nêu tên quy tắc ngữ pháp')}</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              {t('Sửa lỗi khi hội thoại')}
            </label>
            <select
              value={settings.chatCorrection || 'all'}
              onChange={e => updateSettings({ chatCorrection: e.target.value })}
              className="astryx-select w-full p-2.5 text-xs font-medium"
            >
              <option value="all">{t('Sửa mọi lỗi')}</option>
              <option value="major">{t('Chỉ sửa lỗi lớn')}</option>
              <option value="off">{t('Không sửa, chỉ trò chuyện')}</option>
            </select>
          </div>
        </div>
      </AstryxCard>

      {/* 4. Phát âm */}
      <AstryxCard padding="lg" className="space-y-5">
        <h3 className="font-bold text-base md:text-lg text-foreground">
          {t('Phát âm')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="space-y-1.5 sm:col-span-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">
                {t('Giọng đọc')}
              </label>
              <AstryxBadge status="accent">Kokoro AI + System</AstryxBadge>
            </div>
            <select
              value={settings.voice || ''}
              onChange={e => {
                updateSettings({ voice: e.target.value });
                speak('Hello! This is Kokoro speech synthesis for your English practice.', { voiceName: e.target.value, rate: settings.rate });
              }}
              className="astryx-select w-full p-2.5 text-xs font-medium"
            >
              <option value="">{t('Tự động (Giọng Kokoro Heart chuẩn Mỹ)')}</option>
              <optgroup label="Giọng đọc Kokoro AI (hexgrad/kokoro - 23 giọng)">
                {KOKORO_VOICES.map(kv => (
                  <option key={kv.id} value={kv.id}>
                    {kv.name} · {kv.trait}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Giọng đọc thiết bị (System Voices)">
                {voices.map(v => (
                  <option key={v.name} value={v.name}>
                    {v.name.replace(/Microsoft|Google/g, '').trim()} ({v.lang})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-foreground">
              <span>{t('Tốc độ đọc:')}</span>
              <span className="text-primary font-bold">{(+settings.rate).toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.05"
              value={settings.rate || 1.0}
              onChange={e => updateSettings({ rate: parseFloat(e.target.value) })}
              className="w-full accent-primary"
            />
            <AstryxButton
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => speak('Hello! Nice to meet you.', { voiceName: settings.voice, rate: settings.rate })}
            >
              {t('Nghe thử')}
            </AstryxButton>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border">
          <label className="flex items-start gap-2.5 text-xs text-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!!settings.tts}
              onChange={e => updateSettings({ tts: e.target.checked })}
              className="mt-0.5 rounded border-input"
            />
            <div>
              <span className="font-semibold block">{t('Bật đọc to')}</span>
              <span className="text-muted-foreground text-[11px] leading-relaxed block mt-0.5">
                {t('Dùng giọng đọc có sẵn của trình duyệt, không cần AI.')}
              </span>
            </div>
          </label>

          <label className="flex items-start gap-2.5 text-xs text-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!!settings.autoSpeak}
              onChange={e => updateSettings({ autoSpeak: e.target.checked })}
              className="mt-0.5 rounded border-input"
            />
            <div>
              <span className="font-semibold block">{t('Tự đọc từ vựng')}</span>
              <span className="text-muted-foreground text-[11px] leading-relaxed block mt-0.5">
                {t('Tự phát âm từ tiếng Anh khi hiện câu hỏi và khi có đáp án.')}
              </span>
            </div>
          </label>
        </div>
      </AstryxCard>

      {/* 5. Kết nối AI (API Key, Custom URL & Model) */}
      <AstryxCard padding="lg" className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
          <div>
            <h3 className="font-bold text-base md:text-lg text-foreground flex items-center gap-2">
              <Icons.Sparkles className="w-4 h-4 text-primary" />
              <span>{t('Kết nối AI (Tự điền URL & Model)')}</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Tự do điền URL cung cấp API, Model name tùy ý hoặc chọn từ 17 nhà cung cấp có sẵn.
            </p>
          </div>

          <AstryxSegmentedControl
            size="sm"
            value={aiMode}
            onChange={mode => {
              setAiMode(mode);
              if (mode === 'custom') {
                setAiConfig(prev => ({
                  ...prev,
                  provider: 'custom',
                  url: prev.url || 'https://api.openai.com/v1',
                  model: prev.model || 'gpt-4o-mini'
                }));
              } else if (aiConfig.provider === 'custom') {
                setAiConfig(prev => ({ ...prev, provider: 'gemini', model: 'gemini-2.5-flash' }));
              }
            }}
            options={[
              { value: 'custom', label: 'Tự điền URL & Model' },
              { value: 'preset', label: '17 Nhà cung cấp' }
            ]}
          />
        </div>

        {aiMode === 'custom' ? (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Icons.Link className="w-3.5 h-3.5 text-primary" />
                  <span>URL cung cấp API (Base URL / Endpoint)</span>
                </label>
                <span className="text-[11px] text-muted-foreground">Tương thích OpenAI / Proxy</span>
              </div>
              <input
                type="text"
                value={aiConfig.url || ''}
                onChange={e => setAiConfig(prev => ({ ...prev, url: e.target.value, provider: 'custom' }))}
                placeholder="https://api.openai.com/v1 hoặc https://your-custom-proxy.com/v1"
                className="astryx-input w-full p-2.5 text-xs font-mono"
              />
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-muted-foreground mr-1">Gợi ý nhanh:</span>
                {POPULAR_ENDPOINTS.map(ep => (
                  <button
                    key={ep.name}
                    type="button"
                    onClick={() => {
                      setAiConfig(prev => ({
                        ...prev,
                        provider: 'custom',
                        url: ep.url,
                        model: ep.defaultModel
                      }));
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] border transition-colors ${
                      aiConfig.url === ep.url
                        ? 'border-primary bg-primary/10 text-primary font-semibold'
                        : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {ep.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Icons.Cpu className="w-3.5 h-3.5 text-primary" />
                  <span>Tên Model (Tự do điền bất kỳ model nào)</span>
                </label>
                <span className="text-[11px] text-muted-foreground">e.g. gpt-4o, deepseek-chat...</span>
              </div>
              <input
                type="text"
                list="popularModelsList"
                value={aiConfig.model || ''}
                onChange={e => setAiConfig(prev => ({ ...prev, model: e.target.value }))}
                placeholder="Nhập tên model (VD: gpt-4o, gpt-4o-mini, deepseek-chat, gemini-2.5-flash...)"
                className="astryx-input w-full p-2.5 text-xs font-mono"
              />
              <datalist id="popularModelsList">
                {POPULAR_MODELS.map(m => (
                  <option key={m} value={m} />
                ))}
              </datalist>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Nhà cung cấp
                </label>
                <select
                  value={aiConfig.provider}
                  onChange={e => {
                    const provId = e.target.value;
                    const p = AI_PROVIDERS[provId];
                    setAiConfig(prev => ({
                      ...prev,
                      provider: provId,
                      model: p.models[0] || '',
                      url: p.url || ''
                    }));
                  }}
                  className="astryx-select w-full p-2.5 text-xs font-medium"
                >
                  <optgroup label="Tùy chỉnh linh hoạt">
                    <option value="custom">⚡ Tùy chỉnh (Tự điền URL & Model tùy ý)</option>
                  </optgroup>
                  <optgroup label="Có gói miễn phí">
                    {freeProviders.filter(([k]) => k !== 'custom').map(([k, p]) => (
                      <option key={k} value={k}>{p.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Trả phí">
                    {paidProviders.map(([k, p]) => (
                      <option key={k} value={k}>{p.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Chạy trên máy / bên ngoài">
                    {localProviders.map(([k, p]) => (
                      <option key={k} value={k}>{p.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Tên Model (hoặc chọn gợi ý)
                </label>
                <input
                  type="text"
                  list="stModelList"
                  value={aiConfig.model || ''}
                  onChange={e => setAiConfig(prev => ({ ...prev, model: e.target.value }))}
                  placeholder="e.g. gemini-2.5-flash"
                  className="astryx-input w-full p-2.5 text-xs font-mono"
                />
                <datalist id="stModelList">
                  {(selectedProvider.models || []).map(m => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>
        )}

        {/* API Key */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground">API key</label>
            <span className="text-[11px] text-muted-foreground">Lưu bảo mật trong trình duyệt</span>
          </div>
          <div className="relative">
            <input
              type={showApiKey ? "text" : "password"}
              value={aiConfig.key || ''}
              onChange={e => setAiConfig(prev => ({ ...prev, key: e.target.value }))}
              placeholder="Dán API key vào đây (sk-...)"
              className="astryx-input w-full p-2.5 pr-10 text-xs font-mono"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
            >
              {showApiKey ? <Icons.EyeOff className="w-3.5 h-3.5" /> : <Icons.Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border">
          <AstryxButton variant="primary" size="sm" icon={Icons.Check} onClick={handleSaveAI}>
            Lưu cấu hình
          </AstryxButton>

          <AstryxButton
            variant="outline"
            size="sm"
            icon={Icons.Sparkles}
            isLoading={testingAI}
            onClick={handleTestAI}
          >
            {testingAI ? 'Đang kiểm tra...' : 'Kiểm tra kết nối'}
          </AstryxButton>

          <AstryxButton variant="ghost" size="sm" icon={Icons.Trash} onClick={handleClearAI}>
            Xoá key
          </AstryxButton>
        </div>

        {aiTestResult && (
          <div className={`p-3 rounded-lg border text-xs font-medium flex items-start gap-2 ${
            aiTestResult.success
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'border-destructive/30 bg-destructive/10 text-destructive'
          }`}>
            {aiTestResult.success ? (
              <Icons.CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <Icons.AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <span>{aiTestResult.message}</span>
          </div>
        )}
      </AstryxCard>

      {/* 6. Dữ liệu */}
      <AstryxCard padding="lg" className="space-y-4">
        <div>
          <h3 className="font-bold text-base md:text-lg text-foreground">
            {t('Dữ liệu')}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Sao lưu điểm, thống kê, sổ tay SRS, đoạn tự thêm và cài đặt giao diện shadcn/ui.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <AstryxButton variant="outline" size="sm" icon={Icons.Download} onClick={handleExportData}>
            Xuất dữ liệu (.json)
          </AstryxButton>

          <label className="astryx-btn astryx-btn-sm astryx-btn-outline cursor-pointer">
            <Icons.Upload className="w-3.5 h-3.5" />
            <span>Nhập dữ liệu</span>
            <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
          </label>

          <div className="flex-1" />

          <AstryxButton
            variant="ghost"
            size="sm"
            className="text-destructive"
            onClick={() => {
              if (!confirmResetStats) {
                setConfirmResetStats(true);
                setTimeout(() => setConfirmResetStats(false), 3000);
                return;
              }
              resetAllStats();
              setConfirmResetStats(false);
            }}
          >
            {confirmResetStats ? 'Xác nhận đặt lại điểm?' : 'Đặt lại điểm'}
          </AstryxButton>

          <AstryxButton
            variant="ghost"
            size="sm"
            className="text-destructive"
            onClick={() => {
              if (!confirmResetCustom) {
                setConfirmResetCustom(true);
                setTimeout(() => setConfirmResetCustom(false), 3000);
                return;
              }
              clearCustomPassages();
              setConfirmResetCustom(false);
            }}
          >
            {confirmResetCustom ? 'Xác nhận xoá đoạn?' : 'Xoá đoạn tự thêm'}
          </AstryxButton>

          <AstryxButton
            variant="ghost"
            size="sm"
            className="text-destructive"
            onClick={() => {
              if (!confirmResetSettings) {
                setConfirmResetSettings(true);
                setTimeout(() => setConfirmResetSettings(false), 3000);
                return;
              }
              resetDefaultSettings();
              setConfirmResetSettings(false);
            }}
          >
            {confirmResetSettings ? 'Xác nhận khôi phục?' : 'Khôi phục mặc định'}
          </AstryxButton>
        </div>
      </AstryxCard>

    </div>
  );
}
