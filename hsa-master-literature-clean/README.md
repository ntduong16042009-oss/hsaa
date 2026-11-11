# HSA MASTER - Nền Tảng Thi Thử & Đánh Giá Năng Lực Môn Ngữ Văn

Nền tảng luyện tập, thi thử và quản lý kết quả thi đánh giá năng lực môn Ngữ Văn chuẩn cấu trúc HSA (Đại học Quốc gia Hà Nội).

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Cục Bộ (Quick Start)

### 1. Cài đặt các gói phụ thuộc
```bash
npm install
```

### 2. Chạy môi trường Development
```bash
npm run dev
```
Truy cập hệ thống tại: `http://localhost:3000`

### 3. Kiểm thử tự động (Unit Tests)
```bash
npm test
```

### 4. Đóng gói Production
```bash
npm run build
npm start
```

---

## ☁️ Triển Khai Lên Vercel (Vercel.app)

Dự án đã được cấu hình sẵn file `vercel.json` tối ưu hóa cho Vercel:

1. Đẩy mã nguồn dự án lên GitHub / GitLab / Bitbucket.
2. Truy cập [Vercel Dashboard](https://vercel.com/new) -> **Import Git Repository**.
3. Cấu hình tự động:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Bấm **Deploy**. Trang web sẽ được phát hành với tên miền `*.vercel.app`.

---

## 🗄️ Cấu Hình Cơ Sở Dữ Liệu (Supabase Cloud PostgreSQL)

Hệ thống hỗ trợ chế độ lưu trữ linh hoạt (Hybrid Database):
- **Chế độ Mặc định (Local DB)**: Chạy hoàn toàn offline hoặc không cần cấu hình, tự động lưu trữ dữ liệu vào `localStorage` của trình duyệt.
- **Chế độ Đám Mây (Supabase PostgreSQL)**: Dữ liệu được đồng bộ trực tuyến đa thiết bị, cho phép học sinh thi trên nhiều máy và Admin quản lý tập trung.

### Các bước kích hoạt Cloud Database:
1. Tạo một dự án miễn phí tại [Supabase](https://supabase.com).
2. Vào **SQL Editor** trong trang quản trị Supabase, sao chép nội dung file [`supabase_schema.sql`](./supabase_schema.sql) và nhấn **Run** để khởi tạo các bảng:
   - `users`: Tài khoản, mật khẩu băm (salted hash), phân quyền.
   - `exams`: Danh sách đề thi & cấu trúc đề.
   - `questions`: Ngân hàng 105+ câu hỏi thuộc 10 chuyên đề.
   - `exam_attempts`: Lịch sử bài làm, thời gian, điểm số và đáp án của học sinh.
   - `wrong_records`: Sổ tay câu sai và chuỗi trả lời đúng.
3. Vào **Project Settings -> API** trên Supabase để lấy `Project URL` và `anon key`.
4. Tạo file `.env` (hoặc thiết lập trong **Environment Variables** trên Vercel):
   ```env
   VITE_SUPABASE_URL="https://your-project-id.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-key"
   ```
5. Khi khởi động, hệ thống sẽ tự động hiển thị huy hiệu `🟢 Supabase DB` trên thanh tiêu đề và đồng bộ dữ liệu.

---

## 👥 Phân Quyền Hệ Thống (RBAC)

1. **Học sinh (`student`)**:
   - Tham gia thi thử trực tuyến tính giờ tự động.
   - Luyện tập theo từng chuyên đề và luyện lại các câu trả lời sai.
   - Theo dõi Dashboard tiến độ, thống kê điểm số và lịch sử bài làm cá nhân.
   - *Không có quyền truy cập trang Quản trị Admin.*

2. **Quản trị viên (`admin` & `super_admin`)**:
   - Truy cập trang **Quản trị Admin** ([`#admin`](#admin)).
   - Quản lý danh sách tài khoản học sinh, khóa / mở khóa tài khoản.
   - Xem bảng điểm và toàn bộ lịch sử nộp bài của học sinh.
   - Tạo mới, chỉnh sửa đề thi và thêm câu hỏi vào ngân hàng đề.
   - Nhập đề thi hàng loạt từ tệp JSON.
