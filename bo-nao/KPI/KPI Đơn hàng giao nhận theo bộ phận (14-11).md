# KPI Đơn hàng giao nhận theo bộ phận (14-11)

Liên quan: [[KPI Quy trình sản xuất]] · [[KPI Điều phối sản xuất (08-11)]] · [[Quyết định của chủ dự án]] · [[Lần dán lên Apps Script]]

## Nguồn
- Chủ dự án tự làm bằng AI khác (13–14/11) rồi gửi Index/Code/QuyTrinh. Chọn **A: dùng bản đó, Claude sửa chỗ cần thiết** (không bê nguyên xi).
- Cách gộp: `diff -u` bản sinh ra ↔ bản chủ dự án, `patch` vào `tests/quy-trinh/don-hang.gs`; `quy-trinh-web.html` chép thẳng (bản gốc trùng QuyTrinh.html). Phần Index / MANH_GD ở mục vá mới **45** `tests/don-giao-nhan/` (`va-don-giao-nhan-web.py`, `va-don-giao-nhan-code.py`, `navy.css`).

## Chủ dự án chốt (14/11)
- Mở tab Đơn hàng cho **ban điều hành (ADMIN) + TP/PP**. TP/PP **xem tất cả**, chỉ ghi bộ phận mình; BĐH chỉ xem; chủ sở hữu ghi thay được (có nhật ký).
- **Ghi thẳng vào Sheet đơn** (đổi quyết định 31/10 "chỉ đọc"): SL lũy kế vào cột "PHÔI CỦA… / SƠN CỦA…", hẹn vào "NGÀY HẸN TRẢ …", thêm **10 cột phụ** cuối mỗi tab: ĐANG Ở BP, BP KẾ TIẾP, 7 × XN NHẬN <BP>, **XN HẸN**.
- Mỗi dòng Sheet = một mã sản phẩm, có cấu hình bán thành phẩm riêng (sheet `BTPTheoSKU`, chỉ chủ sở hữu sửa; mặc định theo loại: chuôi Phôi→Sơn→UV→HT→ĐG, ngọn Phôi→Taro→Làm đầu→ĐG, gậy đủ 7).
- **Bộ phận sau xác nhận ngày hẹn** của bộ phận trước: Đồng ý / Không kịp (bắt buộc lý do). Xác nhận gắn với đúng ngày lúc bấm – đổi hẹn thì tự về "chờ xác nhận" (● vàng; ✓ xanh; ✗ đỏ).
- Màu **Carbon Navy** cho toàn web khi nền tối (không áp web công nhân kiểu Apple – `:not(.cn-moi)`); bảng đơn phải **tương phản rõ** (chữ trắng, số đậm, dòng chẵn lẻ).

## Claude sửa thêm so với bản chủ dự án
- **Lỗi**: `dhThemCotTD_` đọc tiêu đề ở dòng 1 nhưng ghi ở dòng tiêu đề thật → tab có tiêu đề ở dòng 2 mỗi lần lưu lại thêm 9 cột. Đã đọc đúng dòng.
- **Không ghi đè ô công thức**: trước khi ghi, đọc `getFormulas()` của dòng; ô nào là công thức thì dừng, báo tên ô (vd `J3`).
- Xác nhận nhận hàng: khi đã chọn bộ phận kế tiếp thì chỉ bộ phận đó nhận được.
- Thêm `dhXnHenDoc_` / `dhXnHenGhi_` (ô XN HẸN đọc được bằng mắt: "Phôi: ✓ 20/11/2026 · Tên · 14/11 10:20"), `dhBPSau_`, `dhTenCot_`; web `dhBTruoc`, `dhBXnHen`, `dhBXnHenLuu`. Bộ nhớ tạm `DH_DON_v12`.

## Kiểm thử
- `don-hang.js` 135/146 (11 lỗi cũ có từ trước; 11 kiểm thử mới mục "14/11" đạt; sửa kỳ vọng: BĐH xem được, công suất 310). Giả lập thêm `getFormulas`, `SpreadsheetApp.flush`.
- `quy-trinh-web.js` còn 5 lỗi cũ (sửa kỳ vọng: mặc định bảng kiểu Sheet, BĐH + TP có tab Đơn hàng). `cn-apple-web.js` 30/30.
