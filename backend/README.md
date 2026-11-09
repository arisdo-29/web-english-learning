# 🛠️ English Learning App - Backend & Database

Backend API hiệu năng cao xây dựng bằng **Node.js + Express**, hỗ trợ kết nối đa cơ sở dữ liệu:
1. **Local Development (Mặc định)**: Dùng cơ sở dữ liệu JSON bền vững (persistent file-based), chạy ngay lập tức mà **không cần cài bất kỳ phần mềm hay cơ sở dữ liệu nào khác**.
2. **Online Cloud Deployment (Miễn phí 100%)**: Hỗ trợ kết nối **PostgreSQL trên Supabase hoặc Neon.tech**.

---

## ⚡ Hướng dẫn chạy tại máy (Local)

1. Mở terminal tại thư mục backend:
   ```bash
   cd F:\english-learning-app\backend
   npm install
   npm start
   ```
2. Server sẽ chạy tại `http://localhost:5000`. Kiểm tra trạng thái tại `http://localhost:5000/api/health`.

---

## ☁️ Hướng dẫn thiết lập Database Online Miễn phí (Supabase / Neon)

### Cách 1: Sử dụng Supabase (Khuyên dùng - 100% Free)
1. Đăng ký tài khoản miễn phí tại [supabase.com](https://supabase.com).
2. Tạo một Project mới (chọn vùng gần nhất, ví dụ Singapore).
3. Vào **Project Settings** > **Database** > mục **Connection String** > chọn tab **URI**.
4. Sao chép chuỗi kết nối dạng:
   ```
   postgresql://postgres:[MẬT_KHẨU_CỦA_BẠN]@db.[MÃ_DỰ_ÁN].supabase.co:5432/postgres
   ```
5. Dán chuỗi này vào file `.env` của Backend:
   ```env
   DATABASE_URL=postgresql://postgres:your_password@db.your_ref.supabase.co:5432/postgres
   ```
6. (Tuỳ chọn) Vào mục **SQL Editor** trên Supabase, copy toàn bộ nội dung trong file `src/database/schema.sql` dán vào và nhấn **Run** để khởi tạo bảng.

### Cách 2: Sử dụng Neon.tech (Serverless PostgreSQL - 100% Free)
1. Đăng ký tại [neon.tech](https://neon.tech).
2. Nhấn **Create Project**.
3. Copy chuỗi kết nối Connection String và dán vào `.env` ở biến `DATABASE_URL`.

---

## 🚀 Hướng dẫn Deploy Backend lên Online Miễn phí (Render.com)

1. Đẩy code lên GitHub repository của bạn.
2. Đăng ký tài khoản tại [render.com](https://render.com).
3. Chọn **New** > **Web Service**, kết nối repository GitHub của bạn.
4. Cấu hình:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `DATABASE_URL`: (Dán chuỗi kết nối Supabase hoặc Neon ở trên)
     - `FRONTEND_URL`: `*` (hoặc domain Vercel của bạn)
5. Nhấn **Create Web Service**. Sau vài phút, bạn sẽ có URL API dạng `https://english-backend-xxxx.onrender.com`.
