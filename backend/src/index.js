require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./config/database');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Cấu hình CORS để frontend Vercel hoặc Localhost gọi được
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(u => u.trim())
  : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Cho phép requests không có origin (ví dụ curl hoặc mobile app)
    if (!origin) return callback(null, true);
    // Cho phép tất cả subdomain vercel.app
    if (origin.endsWith('.vercel.app') || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    return callback(null, true); // Chế độ mở rộng mặc định để dễ dàng kết nối
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Route chào mừng
app.get('/', (req, res) => {
  res.json({
    name: 'English Learning App API',
    version: '2.0.0',
    status: 'Running',
    endpoints: {
      health: '/api/health',
      dashboard: '/api/progress/dashboard',
      exercises: '/api/exercises/passages',
      placementTest: '/api/exercises/placement-test'
    }
  });
});

// Gắn API Routes
app.use('/api', apiRoutes);

// Xử lý Route không tồn tại
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint không tồn tại' });
});

// Middleware xử lý lỗi tập trung
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err);
  res.status(500).json({ success: false, error: err.message || 'Lỗi máy chủ nội bộ' });
});

// Khởi động server
async function startServer() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 English Learning Backend đang chạy tại: http://localhost:${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`=======================================================`);
  });
}

startServer();
