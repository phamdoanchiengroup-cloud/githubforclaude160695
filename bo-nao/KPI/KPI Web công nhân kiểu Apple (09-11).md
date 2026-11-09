# KPI Web công nhân kiểu Apple (09-11)

Nhóm: KPI · 09/11/2026
Liên quan: [[KPI Demo giao diện]] · [[Việc chờ chủ dự án]] · [[Lần dán lên Apps Script]] · [[Quyết định của chủ dự án]] · [[00 Mục lục]]

## Chủ dự án chốt (09/11)
- Áp giao diện kiểu Apple (demo `scratchpad/cn/Web-cong-nhan-demo.html` ngày 08/11) **chỉ cho tài khoản công nhân**; TP / PP / chủ giữ nguyên.
- Thanh dưới **5 nút Nhập · KPI · Cơm · Xưởng · Tôi** (gom 7 mục cũ).
- Bảng KPI xưởng chỉ hiện **top 3 + người ngay trên + mình**, có nút "Xem cả xưởng".
- **Bật cho tất cả**, có nút về giao diện cũ (ở Tôi), giao diện cũ có nút "Giao diện mới" ở đầu trang. Sau khoảng 2 tuần cân nhắc bỏ nút về bản cũ.

## Đã làm – mục 44 (`tests/cn-apple/`: `cn-apple.css`, `cn-apple.js`, `va-cn-apple-web.py`)
- `html.cn-moi` khi `ME.vaiTro==='CN'` và máy chưa chọn bản cũ (`localStorage kpi_cn_gd_cu`). Bảng màu Apple sáng (#f2f2f7, thẻ trắng bo 16, xanh #0a66ff), font hệ thống (đổi cả `--serif`), không kính mờ, nút ≥ 44 px, ô nhập 48 px chữ 16 px.
- Bọc `veNav` → `cnApDung()` vẽ thanh dưới (luôn hiện, cả máy tính), ẩn menu trái + nút đầu trang. Bọc `go`: `cnxuong` → Bảng KPI / Chấm công (nhớ trang cuối, `kpi_cn_xuong_tab`), `cntoi` → `vCNToi()`. Nút sáng theo nhóm (`CN_NHOM`; kyn / hd thuộc Tôi), `aria-current`.
- Xưởng: `#cnSeg` (nút chuyển, role=tab, aria-selected) trên `main`.
- Tôi: hồ sơ (chữ cái đầu), Kỹ năng · Hướng dẫn · Đổi mật khẩu · Chữ to (zoom 1.15, `kpi_cn_chu_to`) · Rhino nhắc nhở (`maiDoi`) · Dùng giao diện cũ · Đăng xuất. Công tắc role=switch.
- Bọc `veBangKPI` → `cnLocBXH()`: ẩn dòng ngoài top 3 + người trên + mình (dòng "⋯" ngăn), ẩn cột SL/CL/TT/AT/Chi tiết, nút "Xem cả xưởng (n người)" / "Thu gọn".
- Khung nhắc nhập (`#ducbar`) chỉ hiện ở tab Nhập; các tab khác nút Nhập có chấm đỏ (bọc `capNhatDucBar`).
- Logic nhập / duyệt / tính KPI không đổi.

## Chuyên gia
- `soat-giao-dien-cuoi` (lần 1: HOLD, 8 điểm) → đã sửa: nền thanh dưới đặc, chữ thanh dưới 13 px #6e6e73 (Chữ to 15), băng Tết tương phản đủ, bỏ quầng màu / số lật ở ô KPI, nhãn 13 px, aria, viền focus, nút ≥ 44 px, nút Đăng xuất đỏ; bỏ bóng cột dính bảng KPI.

## Kiểm thử
- Mới `tests/cn-apple-web.js` 30/30 (điện thoại + máy tính: 5 nút, ducbar / chấm đỏ, Xưởng + nhớ trang, lọc top 3 + trên + mình, Xem cả xưởng, Tôi, Chữ to, Rhino, về bản cũ / bản mới, TP không đổi, không lỗi JS).
- Không ảnh hưởng (so với bản trước trên cùng dữ liệu): thao-tac-web 31/32 (1 lỗi có sẵn), sua-loi-21-10-web 9/9, van-hanh-web 28/29 (1 lỗi có sẵn), mai-web 30/32 (2 lỗi có sẵn; nay đặt giao diện cũ để thử nút Rhino đầu trang), com-trua-web 3 lỗi có sẵn (cần bản xem thử ngày riêng), manh-web 8/8, tong-quan-web 26/26, cau-hinh-gay-web 40/40, bo-hom-nay-web 14/14.

## Chưa làm (giai đoạn sau nếu chủ dự án muốn)
- Các màn bên trong còn bố cục cũ, chỉ đổi màu / chữ / nút: Nhập (chưa có bàn phím số dạng bảng trượt như demo), KPI cá nhân, Cơm (chưa có 2 nút Ăn / Không ăn to + đếm ngược), Chấm công (chưa thành lịch tháng riêng).
