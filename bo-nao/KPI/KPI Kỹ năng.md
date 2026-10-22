# KPI Kỹ năng

Nhóm: KPI · Cập nhật 22/10/2026
Liên quan: [[KPI Tổng quan và cách dựng]] · [[KPI Kiểm thử]] · [[Quyết định của chủ dự án]] · [[Việc chờ chủ dự án]] · [[Công cụ Claude]]

## Chủ dự án yêu cầu 22/10
- TP/PP liệt kê kỹ năng của từng xưởng (khác công đoạn) kèm mô tả, gửi ban điều hành duyệt. Sau đó TP/PP gán cho nhân viên những kỹ năng đã qua kiểm tra xác nhận.
- Mục đích: đánh giá, xét tăng lương (nhiều kỹ năng thì lương cao hơn).
- Lời chủ dự án: "bạn cứ làm thứ tốt nhất đi, tham khảo thêm chuyên gia Agency" → đã hỏi 2 vai chuyên gia `hoi-nhap-nhan-su` (lương thưởng) và `thiet-ke-dao-tao` (ma trận kỹ năng ILUO), rồi tự chốt.

## Thiết kế đã chốt (đợt 1)
- **Danh mục** (sheet `KyNang`, tự tạo, cả sheet định dạng chữ):
  - Trường: Tên (5–80 ký tự), Xưởng hoặc `*` = dùng chung, Nhóm, Mô tả, Tiêu chí đạt (2–8 dòng, lưu JSON), Công đoạn liên quan (≥ 1, đúng xưởng), Lý do.
  - Trọng số A/B/C do BĐH đặt khi duyệt.
  - Trạng thái: Chờ duyệt / Trả lại (bắt buộc ghi lý do) / Đã duyệt / Ngừng. Không xóa.
  - Chặn trùng tên trong cùng xưởng (so không dấu, không phân biệt hoa thường).
  - TP sửa kỹ năng đã duyệt → lưu `BanSua` chờ duyệt lại, trong lúc chờ vẫn dùng nội dung cũ. Đổi tiêu chí thì `PhienBan` tăng.
- **Gán cho nhân viên** (sheet `KyNangNhanVien`, mỗi lần một dòng, không ghi đè):
  - 4 cấp: 1 Đang học · 2 Làm được · 3 Thành thạo · 4 Kèm được.
  - Từ cấp 2: phải tích đủ tiêu chí và ghi bằng chứng.
  - TP/PP ghi cấp 1–2 có hiệu lực ngay. Cấp 3–4 chờ BĐH xác nhận; trong lúc chờ vẫn tính cấp cũ.
  - Không tự gán cho mình. TP không gán cho TP/PP khác (BĐH làm).
  - Hạ cấp và thu hồi phải có lý do. Ngày kiểm không được sau hôm nay và không trước ngày vào làm.
  - Hạn kiểm lại 24 tháng (từ cấp 2).
  - Trạng thái dòng: Đã xác nhận / Chờ xác nhận / Từ chối / Thu hồi / Thay thế / Hủy.
- **Điểm kỹ năng (mô phỏng, CHƯA gắn lương)**:
  - Điểm = trọng số (A 1 · B 2 · C 3) × hệ số cấp (cấp 2 → 1 · cấp 3 → 1,5 · cấp 4 → 2). Cấp 1 không tính.
  - Quá hạn, hoặc kỹ năng đã ngừng → không tính.
  - Chuyên gia khuyên chạy thử 3–6 tháng để hiệu chỉnh rồi mới gắn lương.
- **Quyền**: BĐH (ADMIN) toàn quyền. TP/PP làm trong xưởng mình. Nhân sự (HR) và trợ lý chỉ xem. Công nhân xem "Kỹ năng của tôi", kỹ năng có thể học, và tên người "Kèm được" trong xưởng. Công nhân không thấy điểm của người khác.

## Mã
- Máy chủ `kpi-app/tests/ky-nang/ky-nang.gs` (nối cuối va-code.py qua `va-ky-nang.py`):
  - Ghi: `deXuatKyNang`, `suaKyNang`, `bdhDuyetKyNang` (không đặt tên bắt đầu bằng "duyet" vì `call` sẽ chạy hiệu ứng duyệt), `ngungKyNang`, `ganKyNang`, `bdhXacNhanKyNang`, `thuHoiKyNang`.
  - Đọc: `layKyNang`.
  - Mọi hàm ghi trả kèm dữ liệu mới của tab (`knDuLieu_`). Web vẽ lại luôn (`knNhan`), không gọi tải lại lần 2: nhanh hơn, và hết lỗi thỉnh thoảng vẫn thấy dữ liệu cũ sau khi duyệt.
- Web mục 33 `ky-nang/ky-nang-web.js` + `va-ky-nang-web.py` (trước mục 27 chia đôi):
  - Tab khóa `kyn`, nhóm menu "Danh mục". Có cho ADMIN, TP, HR, TL, CN (CN thấy tên "Kỹ năng của tôi").
  - Các trang con: Ma trận · Danh mục · Chờ duyệt · Báo cáo.
  - Báo cáo: điểm nghẽn (dưới 2 người làm được hoặc chưa ai kèm được), tỉ lệ đa năng (≥ 3 kỹ năng), sắp hết hạn trong 60 ngày.
- Hộp thoại `.kn-hop`: CSS riêng cho nút chọn và ô tích, vì CSS chung `label` (in hoa) và `input{width:100%}` làm vỡ bố cục.
- Lỗi đã sửa khi rà: bỏ gạch đầu dòng ở tiêu chí từng cắt luôn số đầu câu ("10 cây…"). Nay chỉ bỏ `-`, `•`, `1.`, `2)`.

## Kiểm thử
- `tests/ky-nang.js`: 49.
- `tests/ky-nang-web.js`: 19, dùng bản xem thử `BO_HO_SO=1`. Đổi tài khoản bằng `login()` đè lên, không `logout()`, vì tải lại trang sẽ mất dữ liệu thử.

## Để sau (đợt 2–3)
- Ảnh bằng chứng cho cấp 3–4.
- Tự gia hạn khi có sản lượng ở công đoạn liên quan trong 6 tháng; trạng thái "Tạm ngưng" khi 12 tháng không dùng.
- Cảnh báo lạm phát (xưởng nâng cấp quá nhiều), hậu kiểm ngẫu nhiên 10%/quý.
- Cộng điểm kỹ năng hiếm, thưởng một lần cho người kèm.
- Quy tắc chuyển xưởng (ân hạn 6 tháng).
- Bảng quy đổi điểm → bậc / phụ cấp kỹ năng: nhờ nhân sự rà pháp lý (BLLĐ 2019 Điều 93; nên dùng "phụ cấp kỹ năng" có điều kiện hưởng; tính BHXH).
