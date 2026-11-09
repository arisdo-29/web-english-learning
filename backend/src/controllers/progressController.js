const { db } = require('../config/database');

// 1. Lấy thông tin thống kê tổng quan (Dashboard)
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.query.userId || 'default_user';
    const data = await db.getUserDashboard(userId);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 2. Ghi nhận điểm và cập nhật chuỗi streak
exports.recordPoints = async (req, res) => {
  try {
    const { userId = 'default_user', points = 0, mode, isCorrect = false } = req.body;
    if (typeof points !== 'number') {
      return res.status(400).json({ success: false, error: 'Số điểm không hợp lệ.' });
    }

    const updatedDashboard = await db.recordPoints(userId, points, mode, isCorrect);
    res.json({ success: true, data: updatedDashboard });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 3. Đặt lại toàn bộ điểm và thống kê
exports.resetStats = async (req, res) => {
  try {
    const userId = req.body.userId || 'default_user';
    const data = await db.resetStats(userId);
    res.json({ success: true, data, message: 'Đã đặt lại toàn bộ điểm và thống kê.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 4. Lấy cài đặt người dùng
exports.getSettings = async (req, res) => {
  try {
    const userId = req.query.userId || 'default_user';
    const settings = await db.getUserSettings(userId);
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 5. Cập nhật cài đặt người dùng
exports.updateSettings = async (req, res) => {
  try {
    const userId = req.body.userId || 'default_user';
    const settings = req.body.settings || req.body;
    const updated = await db.updateUserSettings(userId, settings);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
