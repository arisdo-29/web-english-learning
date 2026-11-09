# 🎓 English Learning Pro — Meta Astryx Design System Edition

Ứng dụng học tiếng Anh toàn diện **Full-stack (React + Vite + Node.js/Express + PostgreSQL/Local DB)** được thiết kế lại theo kiến trúc và quy chuẩn của **[Meta Astryx Design System (`meta/astryx`)](https://github.com/meta/astryx)** — hệ thống thiết kế mã nguồn mở của Meta với 7 bảng màu chủ đề (`@astryxdesign/theme-*`), hệ thống Design Token phân lớp, tỷ lệ bo góc đồng tâm (Concentric Shapes), nhịp dọc đồng nhất (28/32/36/42px) và 10 mô-đun rèn luyện toàn diện 4 kỹ năng Nghe – Nói – Đọc – Viết.

---

## 🎨 Điểm Nhấn Thiết Kế Theo Chuẩn `meta/astryx`

1. **7 Chủ đề Giao diện Chính thức (`@astryxdesign/theme-*`)**:
   - **Neutral (Meta Default)**: Xanh coban `#0064E0` trên nền trung tính mát mẻ.
   - **Matcha (Botanical)**: Xanh trà đạo `#15803D` dịu mắt khi đọc bài dài.
   - **Butter (Warm Editorial)**: Tông vàng kem ấm áp như trang sách giấy cổ điển.
   - **Chocolate (Espresso)**: Phong cách cà phê rang mộc sang trọng, độ tương phản êm dịu.
   - **Stone (Architectural)**: Sắc chàm Indigo trên nền đá khoáng chất tối giản.
   - **Gothic (Crimson Obsidian)**: Tương phản cao với điểm nhấn đỏ hồng Ruby.
   - **Y2K (Cyber Violet)**: Năng lượng công nghệ tương lai với sắc tím Violet.
   - Hỗ trợ chuyển đổi tức thì giữa **Light Mode / Dark Mode / System** và **3 chế độ Bo góc đồng tâm (`Sharp`, `Standard`, `Rounded`)** ngay trên thanh công cụ **Astryx Theme Studio**.
2. **Kiến trúc Token & Component (`frontend/src/astryx/`)**:
   - Hệ thống lưới khoảng cách 4px (`--spacing-1` → `--spacing-12`), độ cao điều khiển đồng bộ (`--size-element-sm: 28px`, `md: 32px`, `lg: 36px`, `xl: 42px`).
   - Trạng thái tương tác chuẩn Astryx: `Selected (Surface style)` cho `SegmentedControl`, `Selected (Depressed style)` cho thanh điều hướng `Sidebar`, `Selected (Border style)` cho thẻ cấp độ CEFR, và **Astryx Agent Status Pill** (`Thinking`, `Ready`, `Offline`) hiển thị trạng thái tác nhân AI thời gian thực.
3. **Bảng Điều Khiển Nhanh `Command Palette (Ctrl + K)`**:
   - Nhấn `Ctrl + K` (hoặc bấm thanh tìm kiếm trên Header) ở bất kỳ đâu để nhảy nhanh tới mọi bài học, tra từ điển Anh–Việt tức thì, tra bảng động từ bất quy tắc V1–V2–V3 hoặc đổi nhanh chủ đề giao diện Astryx.

---

## 🚀 10 Mô-đun & Chức Năng Học Tập Đầy Đủ

1. **Trang chủ & Nhiệm vụ Hàng ngày (`HomeTab`)**:
   - Lộ trình chuẩn CEFR (`A1` → `C1`), bài kiểm tra xếp lớp 15 câu, danh sách **Nhiệm vụ hôm nay (Daily Missions)** tự động cập nhật tiến độ, biểu đồ XP 7 ngày, thống kê độ chính xác từng kỹ năng và bộ **Huy hiệu Thành tựu (Achievements)**.
2. **Từ vựng 3D & Spaced Repetition (`VocabTab`)**:
   - **3 chế độ học**:
     - **Thẻ lật 3D (Flashcard Study Mode)** kèm nút tự đánh giá mức độ nhớ theo thuật toán lặp lại ngắt quãng (**SRS: Quên / Hơi khó / Nhớ tốt / Rất dễ**).
     - **Luyện phản xạ (Quiz Mode)**: Trắc nghiệm hoặc tự gõ từ có gợi ý chữ cái đầu và đồng hồ đếm ngược.
     - **Nghe đoán từ (Listening Vocab)**: Nghe giọng đọc Kokoro AI để nhận diện từ vựng.
   - Giải thích cách dùng từ, cụm từ cố định (collocations) và **chấm điểm câu tự đặt bằng AI**.
3. **Đọc hiểu & Tra từ Trực tiếp (`ReadingTab` — Mới)**:
   - Các bài đọc phân cấp từ `A1` đến `C1` kèm chế độ **Song ngữ** và giọng đọc toàn bài.
   - **Interactive Click-to-Lookup**: Bấm trực tiếp vào bất kỳ từ tiếng Anh nào trong bài đọc để nghe phát âm, xem nghĩa tiếng Việt và lưu ngay vào Sổ tay SRS.
   - Hệ thống câu hỏi trắc nghiệm đọc hiểu có giải thích chi tiết và tính năng **Tạo bài đọc mới bằng AI**.
4. **Luyện nói & Phát âm (`SpeakingTab` — Mới, phong cách Elsa Speak)**:
   - Tích hợp **Web Speech Recognition** thu âm giọng nói trực tiếp trên trình duyệt.
   - Chấm điểm phần trăm độ chuẩn xác và **tô màu từng từ** (Xanh = rõ âm, Vàng = gần đúng, Đỏ = cần luyện lại), kèm mẹo nối âm và nhấn trọng âm.
5. **Cẩm nang Ngữ pháp & 45 Động từ Bất quy tắc (`GrammarTab` — Mới)**:
   - Hệ thống hóa các chuyên đề ngữ pháp trọng tâm A1–C1 (Thì động từ, Câu điều kiện, Bị động, Mệnh đề quan hệ, Đảo ngữ C1) kèm công thức, lỗi người Việt hay mắc và bài tập vận dụng nhanh.
   - Tích hợp **Gia sư Ngữ pháp AI** giải đáp mọi câu hỏi ngữ pháp.
   - **Bảng 45 Động từ Bất quy tắc (`V1 - V2 - V3`)** có tìm kiếm tức thì và phát âm cả 3 dạng.
6. **Dịch đoạn văn Việt – Anh (`TranslateTab`)**:
   - Thẻ từ khoá gợi ý thông minh (bấm vào từ khoá để chèn thẳng vào ô dịch hoặc lưu vào Sổ tay), bộ đếm từ và chấm điểm chi tiết bằng AI hoặc thuật toán F1.
7. **Nghe chép chính tả (`DictationTab`)**:
   - Bổ sung **Thanh khung từ gợi ý (Interactive Word Mask)** cho phép bấm mở từng từ bị nghe lỡ, nút chỉnh tốc độ đọc (`0.75x`, `1.0x`, `1.2x`) và đối chiếu từ bằng thuật toán LCS.
8. **Sắp xếp câu (`ScrambleTab`) & Điền từ khuyết (`BlankTab`)**:
   - Chuyển đổi linh hoạt giữa chế độ Trắc nghiệm và Tự gõ ngay trên thẻ bài tập, kèm phân loại chủ điểm ngữ pháp.
9. **Hội thoại Nhập vai AI (`ConversationTab`)**:
   - **6 kịch bản nhập vai thực tế** (Phỏng vấn IT, Gọi đồ uống, Sân bay & Khách sạn, Họp Daily Standup, Mua sắm & Đổi trả, Đời sống) kèm mục tiêu nhiệm vụ, mẫu câu gợi ý và **nút Micro nhập liệu bằng giọng nói**.
10. **Thử thách Phản xạ 60 Giây (`SpeedChallengeModal` — Mới) & Đồng hồ Pomodoro**:
    - Trò chơi tính giờ 60s Blitz nhân hệ số **Combo x2, x3, x4** và đồng hồ tập trung Pomodoro 25 phút ngay trên thanh công cụ.
11. **Sổ tay SRS Nâng cao (`NotebookTab`)**:
    - Quản lý cấp độ thuộc từ (`Mới`, `Đang học`, `Sắp thuộc`, `Đã thuộc`), **tự thêm từ vựng cá nhân**, tìm kiếm nhanh và **Xuất Sổ tay ra file CSV / JSON**.

---

## ⚡ Hướng Dẫn Chạy Dự Án Tại Máy (Local)

### 1. Khởi động Backend
```bash
cd backend
npm install
npm start
```
> Backend chạy tại `http://localhost:5000` (tự động dùng cơ sở dữ liệu lưu trữ bền vững `backend/src/database/dev_data.json` hoặc PostgreSQL nếu cấu hình `DATABASE_URL`).

### 2. Khởi động Frontend
```bash
cd frontend
npm install
npm run dev
```
> Mở trình duyệt tại `http://localhost:5173`. Frontend đã được đóng gói sẵn bản build tối ưu trong `frontend/dist` và hoạt động mượt mà cả khi có hoặc không bật Backend.
