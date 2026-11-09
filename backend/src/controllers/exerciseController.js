const {
  LEVELS,
  LEVEL_NAME,
  PASSAGES,
  VOCAB,
  SENTENCES,
  BLANKS,
  PLACEMENT_TEST,
  PRESETS
} = require('../data/initialData');
const { db } = require('../config/database');

// Tiện ích xáo trộn mảng
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Chuẩn hoá chuỗi
function norm(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9' ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Tính dải trình độ phù hợp
function getLevelRange(level = 'B1', rangeType = 'around') {
  const idx = LEVELS.indexOf(level);
  if (idx === -1) return [level];
  let a = idx, b = idx;
  if (rangeType === 'around') { a--; b++; }
  else if (rangeType === 'easier') { a--; }
  else if (rangeType === 'harder') { b++; }
  return LEVELS.slice(Math.max(0, a), Math.min(LEVELS.length - 1, b) + 1);
}

// 1. Lấy danh sách đoạn văn luyện dịch
exports.getPassages = async (req, res) => {
  try {
    const { level = 'B1', range = 'around' } = req.query;
    const allowedLevels = getLevelRange(level, range);
    const builtin = PASSAGES.filter(p => allowedLevels.includes(p.lv));
    const custom = await db.getCustomPassages(req.query.userId || 'default_user');

    res.json({
      success: true,
      data: shuffle([...custom, ...(builtin.length ? builtin : PASSAGES)])
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 2. Lấy bộ từ vựng luyện tập
exports.getVocab = (req, res) => {
  try {
    const { level = 'B1', range = 'around', count = 10 } = req.query;
    const allowedLevels = getLevelRange(level, range);

    let words = [];
    allowedLevels.forEach(lv => {
      if (VOCAB[lv]) {
        words.push(...VOCAB[lv].map(w => ({ ...w, lv })));
      }
    });

    if (!words.length) {
      Object.keys(VOCAB).forEach(lv => {
        words.push(...VOCAB[lv].map(w => ({ ...w, lv })));
      });
    }

    const shuffled = shuffle(words).slice(0, parseInt(count, 10) || 10);
    res.json({ success: true, data: shuffled });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 3. Lấy câu cho bài Sắp xếp & Nghe chép
exports.getSentences = (req, res) => {
  try {
    const { level = 'B1', range = 'around', count = 10 } = req.query;
    const allowedLevels = getLevelRange(level, range);

    let sentences = [];
    allowedLevels.forEach(lv => {
      if (SENTENCES[lv]) {
        sentences.push(...SENTENCES[lv].map(s => ({ ...s, lv })));
      }
    });

    if (!sentences.length) {
      Object.keys(SENTENCES).forEach(lv => {
        sentences.push(...SENTENCES[lv].map(s => ({ ...s, lv })));
      });
    }

    res.json({ success: true, data: shuffle(sentences).slice(0, parseInt(count, 10) || 10) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 4. Lấy câu điền từ vào chỗ trống
exports.getBlanks = (req, res) => {
  try {
    const { level = 'B1', range = 'around', count = 10 } = req.query;
    const allowedLevels = getLevelRange(level, range);

    let blanks = [];
    allowedLevels.forEach(lv => {
      if (BLANKS[lv]) {
        blanks.push(...BLANKS[lv].map(b => ({ ...b, lv })));
      }
    });

    if (!blanks.length) {
      Object.keys(BLANKS).forEach(lv => {
        blanks.push(...BLANKS[lv].map(b => ({ ...b, lv })));
      });
    }

    res.json({ success: true, data: shuffle(blanks).slice(0, parseInt(count, 10) || 10) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 5. Lấy bài kiểm tra xếp trình độ (15 câu)
exports.getPlacementTest = (req, res) => {
  try {
    const questions = PLACEMENT_TEST.map(item => {
      const correct = item.o[0];
      const shuffledOptions = shuffle(item.o);
      return {
        id: item.id,
        lv: item.lv,
        q: item.q,
        options: shuffledOptions,
        correct: correct,
        correctIndex: shuffledOptions.indexOf(correct)
      };
    });

    res.json({ success: true, data: questions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 6. Chấm điểm bài kiểm tra trình độ & đưa ra gợi ý
exports.submitPlacementTest = async (req, res) => {
  try {
    const { answers, userId = 'default_user' } = req.body;
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ success: false, error: 'Thiếu dữ liệu câu trả lời.' });
    }

    let score = 0;
    const byLv = {};

    PLACEMENT_TEST.forEach(q => {
      const selected = answers[q.id];
      const correct = q.o[0];
      if (selected && norm(selected) === norm(correct)) {
        score++;
        byLv[q.lv] = (byLv[q.lv] || 0) + 1;
      }
    });

    let suggestedLevel = 'A1';
    for (const lv of LEVELS) {
      if ((byLv[lv] || 0) >= 2) {
        suggestedLevel = lv;
      } else {
        break;
      }
    }

    const preset = PRESETS[suggestedLevel] || {};
    await db.updateUserSettings(userId, { level: suggestedLevel, ...preset });

    res.json({
      success: true,
      score,
      total: PLACEMENT_TEST.length,
      byLevel: byLv,
      suggestedLevel,
      levelName: LEVEL_NAME[suggestedLevel],
      appliedPreset: preset
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 7. Chấm điểm bản dịch nhanh bằng thuật toán F1 word-overlap (offline fallback)
exports.gradeTranslationLocal = (req, res) => {
  try {
    const { student, reference } = req.body;
    if (!student || !reference) {
      return res.status(400).json({ success: false, error: 'Thiếu bài làm hoặc đáp án mẫu.' });
    }

    const u = norm(student).split(' ').filter(Boolean);
    const r = norm(reference).split(' ').filter(Boolean);

    if (!u.length) {
      return res.json({ success: true, score: 0 });
    }

    const bag = {};
    r.forEach(w => { bag[w] = (bag[w] || 0) + 1; });
    let hit = 0;
    u.forEach(w => {
      if (bag[w]) {
        hit++;
        bag[w]--;
      }
    });

    const precision = hit / u.length;
    const recall = hit / r.length;
    const score = (precision + recall) > 0 ? Math.round(200 * precision * recall / (precision + recall)) : 0;

    res.json({
      success: true,
      score,
      hitCount: hit,
      totalRefWords: r.length,
      feedback: score >= 80 ? 'Bản dịch rất tốt!' : score >= 60 ? 'Bản dịch khá ổn, cần chú ý thêm từ vựng/ngữ pháp.' : 'Bản dịch chưa sát nghĩa so với đáp án mẫu.'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
