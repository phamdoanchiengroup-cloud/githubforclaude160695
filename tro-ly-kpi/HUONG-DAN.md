# Trợ lý KPI – hướng dẫn cài đặt (khoảng 10 phút)

Trợ lý chạy thành **một dự án Apps Script riêng**. Nó chỉ **đọc** file "CSDL KPI", không sửa web app KPI đang dùng.
Nó không đọc ra hay gửi đi số CCCD, điện thoại, địa chỉ, lương.

## Bước 1. Tạo dự án mới
1. Mở https://script.google.com → **Dự án mới**.
2. Bấm vào chữ "Dự án không có tiêu đề" ở góc trên trái, đổi tên thành **Trợ lý KPI**.
3. Mở file `Mã.gs` → **xóa hết** → dán toàn bộ nội dung file `TroLyKPI.gs` → bấm 💾 Lưu.

## Bước 2. Nhập token Zalo (không gửi token cho ai, kể cả Claude)
1. Bấm ⚙️ **Cài đặt dự án** (thanh bên trái).
2. Kéo xuống **Thuộc tính tập lệnh** → **Thêm thuộc tính tập lệnh**.
   - Thuộc tính: `ZALO_TOKEN`
   - Giá trị: dán token bot Zalo
3. Bấm **Lưu thuộc tính tập lệnh**.

## Bước 3. Triển khai thành ứng dụng web (để Zalo gửi tin nhắn vào được)
1. Bấm **Triển khai** → **Tùy chọn triển khai mới**.
2. Bấm ⚙️ cạnh "Chọn loại" → chọn **Ứng dụng web**.
   - Thực thi dưới dạng: **Tôi**
   - Người có quyền truy cập: **Bất kỳ ai**. Đừng lo: chỉ Zalo mới có mã khóa bí mật, và bot chỉ trả lời Zalo của bạn.
3. Bấm **Triển khai** → **Cấp quyền truy cập** → chọn tài khoản Google của bạn.
   - Nếu hiện "Google chưa xác minh ứng dụng này": bấm **Nâng cao** → **Đi tới Trợ lý KPI** → **Cho phép**.
4. **Sao chép URL ứng dụng web** (đuôi `/exec`).
5. Quay lại ⚙️ **Cài đặt dự án** → thêm thuộc tính `WEBAPP_URL`, giá trị là URL vừa chép → Lưu.

## Bước 4. Chạy cài đặt
1. Quay lại trang mã (biểu tượng `< >`).
2. Trên thanh công cụ, ô chọn hàm → chọn **caiDat** → bấm ▶ **Chạy**.
3. Xem **Nhật ký thực thi** ở dưới. Sẽ có dòng: `👉 Mở Zalo, nhắn cho bot đúng dòng này: ketnoi 123456`.
4. Mở Zalo → vào **Bot Trợ lý KPI** → nhắn đúng `ketnoi 123456` (số của bạn).
5. Bot trả lời "✅ Đã kết nối!" là xong.

## Dùng hằng ngày
- **7 giờ sáng** bot tự gửi bản tin ngày làm việc gần nhất. Chủ nhật không gửi lặp lại bản tin thứ Bảy.
- Nhắn cho bot:
  - `bc` → bản tin ngày gần nhất
  - `bc 10/10` → bản tin ngày 10/10
  - `tuần` → tổng kết 7 ngày
  - `giúp` → hướng dẫn
- Muốn thử ngay: trong trình soạn thảo, chọn hàm **thuGuiBanTin** → ▶ Chạy.

## Bước 5. Bật hỏi tự do bằng AI

Sau bước này bạn hỏi bot bằng câu thường, ví dụ: "hôm nay bao nhiêu người nghỉ?", "xưởng nào dừng máy nhiều nhất tháng 9?", "top 5 người hiệu suất cao nhất tuần này".

1. **Lấy khóa API:**
   - Vào https://console.anthropic.com → đăng ký / đăng nhập.
   - **Billing**: nạp tiền trả trước (ví dụ 5–10 USD).
   - **API Keys** → **Create Key** → sao chép khóa (bắt đầu bằng `sk-ant-`). Không gửi khóa cho ai, kể cả Claude.
2. **Thêm file mã AI:** trong Apps Script, bấm **＋** cạnh "Tệp" → **Tập lệnh** → đặt tên `TroLyAI` → xóa nội dung mẫu → dán toàn bộ file `TroLyAI.gs` → Lưu.
3. **Dán lại `Mã.gs`** bằng bản `TroLyKPI.gs` mới nhất: xóa hết → dán → Lưu.
4. ⚙️ **Cài đặt dự án → Thuộc tính tập lệnh** → thêm `ANTHROPIC_API_KEY` = khóa vừa tạo → Lưu.
5. **Triển khai → Quản lý triển khai → ✏️ → Phiên bản: Phiên bản mới → Triển khai.**

**Tùy chọn** (thêm vào Thuộc tính tập lệnh nếu muốn):

| Thuộc tính | Mặc định | Ý nghĩa |
|---|---|---|
| `AI_MODEL` | `claude-opus-5-5` | Đổi sang `claude-haiku-5-5` để rẻ hơn khoảng 40 lần (kém thông minh hơn) |
| `AI_EFFORT` | `low` | `medium` / `high`: suy nghĩ kỹ hơn, chậm và tốn hơn |
| `AI_GIOI_HAN_NGAY` | `60` | Số câu hỏi tối đa mỗi ngày, chống tốn tiền ngoài ý muốn |

**Chi phí ước tính:** 1 USD ≈ 26.000đ. Đây là ước lượng thô, xem số thật ở console.anthropic.com → Usage.

| Model | Mỗi câu hỏi | Hỏi 10 câu/ngày |
|---|---|---|
| `claude-opus-5-5` (mặc định) | ~1.000–2.000đ | ~300–550 nghìn đồng/tháng |
| `claude-haiku-5-5` | ~50đ | ~15 nghìn đồng/tháng |

**AI chỉ đọc được:**
- Các sheet sản xuất, điểm danh, KCS, vi phạm, KPI tháng, máy móc, danh mục.
- **Không** đọc được sheet tài khoản, yêu cầu sửa hồ sơ, nhật ký thao tác, cũng không đọc được các cột CCCD, điện thoại, địa chỉ, năm sinh, lương.
- AI chỉ đọc, không sửa được gì.

## Bước 6. Công ty Agent (nhiều phòng ban AI)

Sau bước này bot có 5 "phòng" làm việc:

| Phòng | Gọi thẳng | Việc |
|---|---|---|
| Sản xuất | `@sx` | số liệu ngày, hiệu suất, dừng máy, KCS |
| Phân tích dữ liệu | `@pt` | so sánh, tìm nguyên nhân, báo cáo Google Sheet có biểu đồ |
| Nhân sự | `@ns` | điểm danh, nghỉ, vi phạm, KPI cá nhân |
| Truyền thông | `@viết` | bài Facebook, tuyển dụng, thông báo, thư |
| Thư ký | `@tk` | ghi việc + nhắc đúng giờ, ghi chú, Lịch Google, email nháp |

Phòng thứ 6 là "Kế hoạch – Đơn hàng", đang tắt, chờ Claude làm phần đọc sheet đơn hàng.

Bạn cứ nhắn tự nhiên, **thư ký điều phối** sẽ chuyển câu hỏi đúng phòng. Câu trả lời có ghi `[Tên phòng]` ở đầu.

**Cài đặt** (làm đúng thứ tự, nhớ sao lưu trước: **Tổng quan → Tạo bản sao**):

1. Dán lại `Mã.gs` ← `TroLyKPI.gs` và `TroLyAI` ← `TroLyAI.gs` (bản mới).
2. Bấm **＋ → Tập lệnh** → đặt tên `Agents` → xóa nội dung mẫu → dán `Agents.gs` → 💾 Lưu.
3. Chọn hàm **caiDatAgent** → ▶ **Chạy**.
   - Google sẽ hỏi quyền mới (Lịch, Gmail, tạo bảng tính) → **Xem lại quyền → chọn tài khoản → Nâng cao → Đi tới Trợ lý KPI → Cho phép**.
   - ⚠ **Phải làm bước này TRƯỚC bước 4.** Nếu triển khai trước khi cấp quyền, bot sẽ ngừng trả lời cho đến khi bạn chạy `caiDatAgent`.
4. **Triển khai → Quản lý triển khai → ✏️ → Phiên bản mới → Triển khai.**
5. Xem **Nhật ký thực thi**, mở đường link sheet **"Trợ lý – Công ty Agent"** (nằm trong Drive của bạn). Vào tab **SoTay** → sửa 2 dòng có chữ **"SỬA DÒNG NÀY"**: thông tin công ty và giọng văn. Phòng Truyền thông dựa vào 2 dòng này để viết.
6. Nhắn bot `phòng ban` để xem danh sách.

**Sheet "Trợ lý – Công ty Agent"** (bạn sửa được trực tiếp, không cần đụng mã):
- **CacAgent**: mỗi dòng một phòng.
  - `Goi`: tên gọi tắt. `MoTa`: việc phụ trách, thư ký dựa vào đây để chia việc. `VaiTro`: cách làm việc.
  - `CongCu`: công cụ được dùng. `Model` / `Effort`: để trống là dùng mặc định. `Bat`: Có / Không.
  - **Thêm phòng mới**: thêm một dòng. Sau khi sửa sheet, chờ khoảng 10 phút để bot nhận thay đổi.
  - Công cụ có sẵn: `tra_cuu, hieu_suat, ban_tin` (đọc KPI), `bao_cao_sheet`, `so_tay_tim, so_tay_ghi, so_tay_xong`, `lich_xem, lich_tao`, `email_tim, email_nhap`.
- **SoTay**: trí nhớ chung của mọi phòng.
  - Loại **Bối cảnh**: luôn được đưa cho mọi phòng (thông tin công ty, cách xưng hô, thói quen của bạn…).
  - Loại **Việc** có **Hạn**: bot nhắn Zalo nhắc khi đến hạn, cứ 15 phút kiểm tra một lần. Việc trong ngày cũng được đưa vào bản tin 7 giờ sáng.
- **NhatKy**: lịch sử hỏi đáp để bạn xem lại.

**Lệnh nhanh** (không tốn tiền AI):
- `phòng ban`: danh sách phòng
- `việc`: các việc đang mở
- `xong 5`: đánh dấu việc số 5 đã xong

**An toàn:**
- Email chỉ tạo **nháp**, bạn tự bấm gửi.
- Lịch chỉ ghi vào lịch của bạn, không mời ai.
- Dữ liệu sản xuất chỉ đọc.
- Phòng nào chỉ dùng được công cụ ghi trong cột `CongCu` của phòng đó.

## Khi cập nhật bản mới
1. Mở từng file (`Mã.gs` ← `TroLyKPI.gs`, `TroLyAI` ← `TroLyAI.gs`, `Agents` ← `Agents.gs`) → xóa hết → dán bản mới → 💾 Lưu.
2. **Triển khai → Quản lý triển khai → ✏️ → Phiên bản: Phiên bản mới → Triển khai.** URL giữ nguyên, không cần chạy lại `caiDat`.
   - Nếu Claude báo bản mới dùng thêm quyền: chạy `caiDatAgent` để cấp quyền **trước** khi triển khai.

## Cách tính (giống web app KPI)
- Chỉ tính dòng `NhatKySanXuat` có TrangThai **"Đã chốt"** (trưởng phòng đã duyệt). "Chờ duyệt" được đếm riêng. "Từ chối" bị bỏ.
- **Hiệu suất** = Σ (số lượng − hàng lỗi KCS) ÷ định mức, chia cho **giờ có mặt** theo chấm công:
  - đi làm = 8h, nửa ngày = 4h, đi muộn x-n thì trừ n giờ, nghỉ = 0.
  - Ngày công = xưởng đã xác nhận điểm danh, hoặc người đó có dòng đã chốt.
  - Không tính trưởng/phó phòng, người nghỉ việc, ngày nghỉ dài hạn.
  - Định mức lấy dòng cuối cùng của công đoạn trong sheet DinhMuc.
- ▲▼ là chênh lệch so với 14 ngày trước đó (bản tin ngày) hoặc 7 ngày trước đó (bản tin tuần).
- Điểm KPI tháng (chất lượng, tuân thủ, an toàn, tổng KPI) xem ở bảng `KPIThang` do web app chốt.

## Gỡ lỗi
- Bot không trả lời:
  - Kiểm tra Bước 3 đã chọn **Bất kỳ ai**.
  - Kiểm tra `WEBAPP_URL` có đuôi `/exec`.
  - Chạy lại **caiDat**.
- Nếu lỡ để lộ token: vào Zalo Bot Creator (https://zalo.me/s/botcreator/) tạo token mới → sửa `ZALO_TOKEN` → chạy lại **caiDat**.
- Bot báo lỗi quyền, hoặc ngừng trả lời sau khi cập nhật: chạy **caiDatAgent** trong Apps Script và bấm Cho phép.
- Kiểm thử trên máy (dành cho Claude): `node tests/tro-ly.js && node tests/agents.js`.
