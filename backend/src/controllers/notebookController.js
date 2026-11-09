const { db } = require('../config/database');

// ================= 1. TỪ CẦN ÔN (NOTEBOOK WORDS) =================
exports.getWords = async (req, res) => {
  try {
    const userId = req.query.userId || 'default_user';
    const words = await db.getNotebookWords(userId);
    res.json({ success: true, data: words });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.addWord = async (req, res) => {
  try {
    const { userId = 'default_user', word } = req.body;
    if (!word || !word.en || !word.vi) {
      return res.status(400).json({ success: false, error: 'Thiếu từ tiếng Anh hoặc nghĩa tiếng Việt.' });
    }
    const words = await db.addNotebookWord(userId, word);
    res.json({ success: true, data: words });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.removeWord = async (req, res) => {
  try {
    const { userId = 'default_user', en } = req.body;
    if (!en) {
      return res.status(400).json({ success: false, error: 'Thiếu từ cần xoá.' });
    }
    const words = await db.removeNotebookWord(userId, en);
    res.json({ success: true, data: words });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.clearWords = async (req, res) => {
  try {
    const { userId = 'default_user' } = req.body;
    const words = await db.clearNotebookWords(userId);
    res.json({ success: true, data: words, message: 'Đã xoá toàn bộ từ cần ôn.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ================= 2. GHI CHÉP LỖI SAI (NOTEBOOK NOTES) =================
exports.getNotes = async (req, res) => {
  try {
    const userId = req.query.userId || 'default_user';
    const notes = await db.getNotebookNotes(userId);
    res.json({ success: true, data: notes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.addNote = async (req, res) => {
  try {
    const { userId = 'default_user', note } = req.body;
    if (!note || !note.type || !note.wrong || !note.fix) {
      return res.status(400).json({ success: false, error: 'Dữ liệu ghi chú lỗi sai không đầy đủ.' });
    }
    const notes = await db.addNotebookNote(userId, note);
    res.json({ success: true, data: notes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.clearNotes = async (req, res) => {
  try {
    const { userId = 'default_user' } = req.body;
    const notes = await db.clearNotebookNotes(userId);
    res.json({ success: true, data: notes, message: 'Đã xoá toàn bộ lỗi ghi chép.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ================= 3. ĐOẠN VĂN TỰ THÊM (CUSTOM PASSAGES) =================
exports.getCustomPassages = async (req, res) => {
  try {
    const userId = req.query.userId || 'default_user';
    const passages = await db.getCustomPassages(userId);
    res.json({ success: true, data: passages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.addCustomPassage = async (req, res) => {
  try {
    const { userId = 'default_user', vi, en, lv } = req.body;
    if (!vi || !vi.trim()) {
      return res.status(400).json({ success: false, error: 'Nội dung đoạn tiếng Việt không được để trống.' });
    }
    const created = await db.addCustomPassage(userId, { vi: vi.trim(), en: (en || '').trim(), lv });
    res.json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.clearCustomPassages = async (req, res) => {
  try {
    const { userId = 'default_user' } = req.body;
    const list = await db.clearCustomPassages(userId);
    res.json({ success: true, data: list, message: 'Đã xoá các đoạn văn tự thêm.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
