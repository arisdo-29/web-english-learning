# 🎨 English Learning App - Frontend (React + Vite + Tailwind CSS)

Giao diện học tiếng Anh hiện đại lấy cảm hứng từ **Duolingo, Elsa Speak, Quizlet và shadcn/ui**, tối ưu hoá để triển khai lên **Vercel** hoàn toàn miễn phí.

---

## ⚡ Hướng dẫn chạy tại máy (Local)

1. Mở terminal tại thư mục `frontend`:
   ```bash
   cd F:\english-learning-app\frontend
   npm install
   npm run dev
   ```
2. Mở trình duyệt tại: `http://localhost:5173`.

---

## 🚀 Hướng dẫn Deploy lên Vercel (100% Miễn phí)

Dự án đã được cấu hình sẵn file `vercel.json` tối ưu hoá cho SPA (Single Page Application) routing.

### Cách 1: Deploy qua Giao diện Web Vercel (Khuyên dùng)
1. Đẩy toàn bộ thư mục dự án lên **GitHub** của bạn.
2. Truy cập [vercel.com](https://vercel.com) và đăng nhập bằng tài khoản GitHub.
3. Nhấn **Add New...** > **Project**.
4. Chọn kho lưu trữ GitHub chứa dự án của bạn.
5. Cấu hình triển khai:
   - **Framework Preset**: `Vite` (Vercel tự động nhận diện)
   - **Root Directory**: Chọn `frontend` (nhấn Edit và chọn thư mục `frontend`)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     - Thêm biến `VITE_API_URL`: Điền URL Backend của bạn (ví dụ URL Render `https://your-backend.onrender.com`).
     *(Nếu chưa deploy backend, bạn có thể để trống, frontend vẫn hoạt động mượt mà ở chế độ offline)*.
6. Nhấn **Deploy**. Sau khoảng 1 phút, bạn sẽ có trang web hoạt động online với tên miền miễn phí dạng `https://your-app.vercel.app`!

---

### Cách 2: Deploy bằng Vercel CLI từ Terminal
```bash
cd F:\english-learning-app\frontend
npx vercel
```
Làm theo các bước hướng dẫn trên màn hình và chọn Deploy to Production (`npx vercel --prod`).

