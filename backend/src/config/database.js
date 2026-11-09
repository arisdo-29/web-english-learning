const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

let pool = null;
let isPostgres = false;

// Đường dẫn file cơ sở dữ liệu local (khi không dùng PostgreSQL/Supabase)
const LOCAL_DB_PATH = path.join(__dirname, '..', 'database', 'dev_data.json');

// Khởi tạo trạng thái ban đầu cho local DB
const DEFAULT_LOCAL_STATE = {
  users: [{ id: 'default_user', username: 'Learner', created_at: new Date().toISOString() }],
  user_stats: {
    default_user: {
      user_id: 'default_user',
      total_points: 0,
      streak: 0,
      daily_goal: 50,
      level: 'B1',
      last_active_date: new Date().toISOString().split('T')[0]
    }
  },
  daily_points: {}, // 'default_user_YYYY-MM-DD': { date, points }
  mode_stats: {},   // 'default_user_mode': { mode, correct_count, total_count }
  notebook_words: [], // [{ id, user_id, en, vi, ipa, lv, created_at }]
  notebook_notes: [], // [{ id, user_id, type, wrong, fix, why, date, created_at }]
  custom_passages: [], // [{ id, user_id, vi, en, lv, created_at }]
  user_settings: {
    default_user: {
      level: 'B1',
      dailyGoal: 50,
      source: 'builtin',
      topics: ['life', 'study', 'work', 'it'],
      theme: 'light',
      tts: true,
      autoSpeak: false,
      rate: 1.0,
      voice: '',
      vocabType: 'mix',
      blankType: 'type',
      strictness: 'normal',
      feedbackLang: 'vi',
      explain: 'short',
      chatCorrection: 'all',
      hints: true
    }
  }
};

let localMemoryDb = null;

// Helper đọc/ghi local JSON an toàn
function loadLocalDb() {
  if (localMemoryDb) return localMemoryDb;
  try {
    if (fs.existsSync(LOCAL_DB_PATH)) {
      const data = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
      localMemoryDb = JSON.parse(data);
    } else {
      localMemoryDb = JSON.parse(JSON.stringify(DEFAULT_LOCAL_STATE));
      saveLocalDb();
    }
  } catch (err) {
    console.error('Lỗi khi đọc file dev_data.json, sử dụng dữ liệu mặc định:', err.message);
    localMemoryDb = JSON.parse(JSON.stringify(DEFAULT_LOCAL_STATE));
  }
  return localMemoryDb;
}

function saveLocalDb() {
  try {
    const dir = path.dirname(LOCAL_DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(localMemoryDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('Lỗi khi ghi file dev_data.json:', err.message);
  }
}

// Khởi tạo Database
async function initDatabase() {
  const connectionString = process.env.DATABASE_URL;

  if (connectionString && (connectionString.startsWith('postgres://') || connectionString.startsWith('postgresql://'))) {
    try {
      console.log('🔄 Đang kết nối PostgreSQL (Supabase / Neon)...');
      pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false }
      });

      // Kiểm tra kết nối
      const client = await pool.connect();
      console.log('✅ Đã kết nối thành công tới PostgreSQL Cloud!');

      // Tự động kiểm tra và tạo bảng nếu chưa có
      const schemaSqlPath = path.join(__dirname, '..', 'database', 'schema.sql');
      if (fs.existsSync(schemaSqlPath)) {
        const schema = fs.readFileSync(schemaSqlPath, 'utf-8');
        await client.query(schema);
        console.log('✅ Đã đồng bộ Schema cơ sở dữ liệu trên Cloud.');
      }
      client.release();
      isPostgres = true;
      return;
    } catch (err) {
      console.warn('⚠️ Không thể kết nối PostgreSQL Cloud, tự động chuyển về Local Database:', err.message);
      isPostgres = false;
    }
  }

  console.log('📦 Đang sử dụng Local Persistent Database (dev_data.json).');
  loadLocalDb();
}

// ================= CÁC PHƯƠNG THỨC XỬ LÝ DỮ LIỆU =================

const db = {
  isPostgres: () => isPostgres,

  // 1. Lấy thông tin & tiến độ người dùng
  async getUserStats(userId = 'default_user') {
    if (isPostgres) {
      const res = await pool.query('SELECT * FROM user_stats WHERE user_id = $1', [userId]);
      return res.rows[0] || {
        user_id: userId,
        total_points: 0,
        streak: 0,
        daily_goal: 50,
        level: 'B1'
      };
    } else {
      const mem = loadLocalDb();
      return mem.user_stats[userId] || DEFAULT_LOCAL_STATE.user_stats.default_user;
    }
  },

  // 2. Ghi nhận điểm và cập nhật chuỗi ngày học
  async recordPoints(userId = 'default_user', points = 0, mode = null, isCorrect = false) {
    const today = new Date().toISOString().split('T')[0];

    if (isPostgres) {
      // Cập nhật daily_points
      await pool.query(
        `INSERT INTO daily_points (user_id, date, points)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, date) 
         DO UPDATE SET points = daily_points.points + $3`,
        [userId, today, points]
      );

      // Cập nhật mode_stats
      if (mode) {
        await pool.query(
          `INSERT INTO mode_stats (user_id, mode, correct_count, total_count)
           VALUES ($1, $2, $3, 1)
           ON CONFLICT (user_id, mode)
           DO UPDATE SET 
             total_count = mode_stats.total_count + 1,
             correct_count = mode_stats.correct_count + $3`,
          [userId, mode, isCorrect ? 1 : 0]
        );
      }

      // Cập nhật user_stats (tính lại streak)
      const daysRes = await pool.query(
        `SELECT date, points FROM daily_points WHERE user_id = $1 AND points > 0 ORDER BY date DESC LIMIT 30`,
        [userId]
      );
      
      let streak = 0;
      let checkDate = new Date();
      const earnedDates = new Set(daysRes.rows.map(r => new Date(r.date).toISOString().split('T')[0]));
      
      const todayStr = checkDate.toISOString().split('T')[0];
      if (!earnedDates.has(todayStr)) {
        checkDate.setDate(checkDate.getDate() - 1);
      }
      
      while (earnedDates.has(checkDate.toISOString().split('T')[0])) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }

      await pool.query(
        `UPDATE user_stats 
         SET total_points = total_points + $1,
             streak = $2,
             last_active_date = $3,
             updated_at = NOW()
         WHERE user_id = $4`,
        [points, streak, today, userId]
      );

      return this.getUserDashboard(userId);
    } else {
      const mem = loadLocalDb();
      const stats = mem.user_stats[userId] || { ...DEFAULT_LOCAL_STATE.user_stats.default_user, user_id: userId };
      
      // Update daily points
      const key = `${userId}_${today}`;
      if (!mem.daily_points[key]) {
        mem.daily_points[key] = { date: today, points: 0 };
      }
      mem.daily_points[key].points += points;
      stats.total_points = (stats.total_points || 0) + points;

      // Update mode stats
      if (mode) {
        const mKey = `${userId}_${mode}`;
        if (!mem.mode_stats[mKey]) {
          mem.mode_stats[mKey] = { mode, correct_count: 0, total_count: 0 };
        }
        mem.mode_stats[mKey].total_count += 1;
        if (isCorrect) mem.mode_stats[mKey].correct_count += 1;
      }

      // Calculate streak
      let streak = 0;
      let checkDate = new Date();
      const todayStr = checkDate.toISOString().split('T')[0];
      const hasToday = (mem.daily_points[`${userId}_${todayStr}`]?.points || 0) > 0;
      if (!hasToday) checkDate.setDate(checkDate.getDate() - 1);

      while (true) {
        const dStr = checkDate.toISOString().split('T')[0];
        if ((mem.daily_points[`${userId}_${dStr}`]?.points || 0) > 0) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
      stats.streak = streak;
      stats.last_active_date = today;
      mem.user_stats[userId] = stats;
      saveLocalDb();

      return this.getUserDashboard(userId);
    }
  },

  // 3. Lấy thông tin bảng điều khiển (Dashboard)
  async getUserDashboard(userId = 'default_user') {
    const today = new Date().toISOString().split('T')[0];
    
    // 7 ngày gần nhất
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }

    if (isPostgres) {
      const statsRes = await pool.query('SELECT * FROM user_stats WHERE user_id = $1', [userId]);
      const stats = statsRes.rows[0] || {};

      const historyRes = await pool.query(
        `SELECT date, points FROM daily_points WHERE user_id = $1 AND date = ANY($2::date[])`,
        [userId, days]
      );
      const pointsMap = {};
      historyRes.rows.forEach(r => {
        const dStr = new Date(r.date).toISOString().split('T')[0];
        pointsMap[dStr] = r.points;
      });

      const modesRes = await pool.query('SELECT mode, correct_count, total_count FROM mode_stats WHERE user_id = $1', [userId]);
      const modeStats = {};
      modesRes.rows.forEach(r => {
        modeStats[r.mode] = { r: r.correct_count, t: r.total_count };
      });

      const todayRes = await pool.query('SELECT points FROM daily_points WHERE user_id = $1 AND date = $2', [userId, today]);
      const todayPoints = todayRes.rows[0]?.points || 0;

      const nbRes = await pool.query('SELECT COUNT(*) as count FROM notebook_words WHERE user_id = $1', [userId]);
      const wordsCount = parseInt(nbRes.rows[0]?.count || 0, 10);

      return {
        stats: {
          total: stats.total_points || 0,
          streak: stats.streak || 0,
          dailyGoal: stats.daily_goal || 50,
          level: stats.level || 'B1',
          todayPoints,
          wordsToReview: wordsCount
        },
        history: days.map(d => ({ date: d, points: pointsMap[d] || 0 })),
        modes: modeStats
      };
    } else {
      const mem = loadLocalDb();
      const stats = mem.user_stats[userId] || DEFAULT_LOCAL_STATE.user_stats.default_user;
      const todayPoints = mem.daily_points[`${userId}_${today}`]?.points || 0;
      const wordsCount = (mem.notebook_words || []).filter(w => w.user_id === userId).length;

      const history = days.map(d => ({
        date: d,
        points: mem.daily_points[`${userId}_${d}`]?.points || 0
      }));

      const modeStats = {};
      Object.keys(mem.mode_stats || {}).forEach(k => {
        if (k.startsWith(`${userId}_`)) {
          const item = mem.mode_stats[k];
          modeStats[item.mode] = { r: item.correct_count, t: item.total_count };
        }
      });

      return {
        stats: {
          total: stats.total_points || 0,
          streak: stats.streak || 0,
          dailyGoal: stats.daily_goal || 50,
          level: stats.level || 'B1',
          todayPoints,
          wordsToReview: wordsCount
        },
        history,
        modes: modeStats
      };
    }
  },

  // 4. Sổ tay từ cần ôn
  async getNotebookWords(userId = 'default_user') {
    if (isPostgres) {
      const res = await pool.query(
        'SELECT * FROM notebook_words WHERE user_id = $1 ORDER BY id DESC LIMIT 300',
        [userId]
      );
      return res.rows;
    } else {
      const mem = loadLocalDb();
      return (mem.notebook_words || []).filter(w => w.user_id === userId);
    }
  },

  async addNotebookWord(userId = 'default_user', word) {
    if (isPostgres) {
      await pool.query(
        `INSERT INTO notebook_words (user_id, en, vi, ipa, lv)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (user_id, en) DO NOTHING`,
        [userId, word.en, word.vi, word.ipa || '', word.lv || '']
      );
      return this.getNotebookWords(userId);
    } else {
      const mem = loadLocalDb();
      const exists = mem.notebook_words.some(w => w.user_id === userId && w.en.toLowerCase() === word.en.toLowerCase());
      if (!exists) {
        mem.notebook_words.unshift({
          id: Date.now(),
          user_id: userId,
          en: word.en,
          vi: word.vi,
          ipa: word.ipa || '',
          lv: word.lv || '',
          created_at: new Date().toISOString()
        });
        saveLocalDb();
      }
      return this.getNotebookWords(userId);
    }
  },

  async removeNotebookWord(userId = 'default_user', en) {
    if (isPostgres) {
      await pool.query('DELETE FROM notebook_words WHERE user_id = $1 AND en = $2', [userId, en]);
      return this.getNotebookWords(userId);
    } else {
      const mem = loadLocalDb();
      mem.notebook_words = mem.notebook_words.filter(w => !(w.user_id === userId && w.en.toLowerCase() === en.toLowerCase()));
      saveLocalDb();
      return this.getNotebookWords(userId);
    }
  },

  async clearNotebookWords(userId = 'default_user') {
    if (isPostgres) {
      await pool.query('DELETE FROM notebook_words WHERE user_id = $1', [userId]);
      return [];
    } else {
      const mem = loadLocalDb();
      mem.notebook_words = mem.notebook_words.filter(w => w.user_id !== userId);
      saveLocalDb();
      return [];
    }
  },

  // 5. Sổ tay ghi chép lỗi sai
  async getNotebookNotes(userId = 'default_user') {
    if (isPostgres) {
      const res = await pool.query(
        'SELECT * FROM notebook_notes WHERE user_id = $1 ORDER BY id DESC LIMIT 200',
        [userId]
      );
      return res.rows;
    } else {
      const mem = loadLocalDb();
      return (mem.notebook_notes || []).filter(n => n.user_id === userId);
    }
  },

  async addNotebookNote(userId = 'default_user', note) {
    const today = new Date().toISOString().split('T')[0];
    if (isPostgres) {
      await pool.query(
        `INSERT INTO notebook_notes (user_id, type, wrong, fix, why, date)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, note.type, note.wrong, note.fix, note.why || '', today]
      );
      return this.getNotebookNotes(userId);
    } else {
      const mem = loadLocalDb();
      mem.notebook_notes.unshift({
        id: Date.now(),
        user_id: userId,
        type: note.type,
        wrong: note.wrong,
        fix: note.fix,
        why: note.why || '',
        date: today,
        created_at: new Date().toISOString()
      });
      saveLocalDb();
      return this.getNotebookNotes(userId);
    }
  },

  async clearNotebookNotes(userId = 'default_user') {
    if (isPostgres) {
      await pool.query('DELETE FROM notebook_notes WHERE user_id = $1', [userId]);
      return [];
    } else {
      const mem = loadLocalDb();
      mem.notebook_notes = mem.notebook_notes.filter(n => n.user_id !== userId);
      saveLocalDb();
      return [];
    }
  },

  // 6. Đoạn văn tự thêm (Custom passages)
  async getCustomPassages(userId = 'default_user') {
    if (isPostgres) {
      const res = await pool.query(
        'SELECT * FROM custom_passages WHERE user_id = $1 ORDER BY id DESC',
        [userId]
      );
      return res.rows;
    } else {
      const mem = loadLocalDb();
      return (mem.custom_passages || []).filter(p => p.user_id === userId);
    }
  },

  async addCustomPassage(userId = 'default_user', passage) {
    if (isPostgres) {
      const res = await pool.query(
        `INSERT INTO custom_passages (user_id, vi, en, lv)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [userId, passage.vi, passage.en || '', passage.lv || 'Của bạn']
      );
      return res.rows[0];
    } else {
      const mem = loadLocalDb();
      const newP = {
        id: Date.now(),
        user_id: userId,
        vi: passage.vi,
        en: passage.en || '',
        lv: passage.lv || 'Của bạn',
        created_at: new Date().toISOString()
      };
      mem.custom_passages.unshift(newP);
      saveLocalDb();
      return newP;
    }
  },

  async clearCustomPassages(userId = 'default_user') {
    if (isPostgres) {
      await pool.query('DELETE FROM custom_passages WHERE user_id = $1', [userId]);
      return [];
    } else {
      const mem = loadLocalDb();
      mem.custom_passages = mem.custom_passages.filter(p => p.user_id !== userId);
      saveLocalDb();
      return [];
    }
  },

  // 7. Cài đặt người dùng
  async getUserSettings(userId = 'default_user') {
    if (isPostgres) {
      const res = await pool.query('SELECT settings FROM user_settings WHERE user_id = $1', [userId]);
      return res.rows[0]?.settings || DEFAULT_LOCAL_STATE.user_settings.default_user;
    } else {
      const mem = loadLocalDb();
      return mem.user_settings[userId] || DEFAULT_LOCAL_STATE.user_settings.default_user;
    }
  },

  async updateUserSettings(userId = 'default_user', settings) {
    if (isPostgres) {
      await pool.query(
        `INSERT INTO user_settings (user_id, settings)
         VALUES ($1, $2)
         ON CONFLICT (user_id) DO UPDATE SET settings = $2, updated_at = NOW()`,
        [userId, JSON.stringify(settings)]
      );
      if (settings.level || settings.dailyGoal) {
        await pool.query(
          `UPDATE user_stats SET level = COALESCE($1, level), daily_goal = COALESCE($2, daily_goal) WHERE user_id = $3`,
          [settings.level || null, settings.dailyGoal || null, userId]
        );
      }
      return settings;
    } else {
      const mem = loadLocalDb();
      mem.user_settings[userId] = { ...(mem.user_settings[userId] || {}), ...settings };
      if (mem.user_stats[userId]) {
        if (settings.level) mem.user_stats[userId].level = settings.level;
        if (settings.dailyGoal) mem.user_stats[userId].daily_goal = settings.dailyGoal;
      }
      saveLocalDb();
      return mem.user_settings[userId];
    }
  },

  // 8. Đặt lại toàn bộ thống kê
  async resetStats(userId = 'default_user') {
    if (isPostgres) {
      await pool.query('DELETE FROM daily_points WHERE user_id = $1', [userId]);
      await pool.query('DELETE FROM mode_stats WHERE user_id = $1', [userId]);
      await pool.query('UPDATE user_stats SET total_points = 0, streak = 0 WHERE user_id = $1', [userId]);
      return this.getUserDashboard(userId);
    } else {
      const mem = loadLocalDb();
      mem.user_stats[userId] = {
        ...mem.user_stats[userId],
        total_points: 0,
        streak: 0
      };
      Object.keys(mem.daily_points).forEach(k => {
        if (k.startsWith(`${userId}_`)) delete mem.daily_points[k];
      });
      Object.keys(mem.mode_stats).forEach(k => {
        if (k.startsWith(`${userId}_`)) delete mem.mode_stats[k];
      });
      saveLocalDb();
      return this.getUserDashboard(userId);
    }
  }
};

module.exports = {
  initDatabase,
  db
};
