# TCC Bán hàng

Nhóm: Thiên Cơ Các · Tách từ CLAUDE.md ngày 21/10/2026
Liên quan: [[TCC Nghiệm chứng]] · [[TCC Giao diện]] · [[00 Mục lục]]

- `TT_PHAN_MAC_DINH` là bảng giá mặc định; chủ dự án sửa được trong Quản trị.
- **Bản mở** `co_ban` (49 xu): bản mệnh, mở vĩnh viễn.
- **Vận hạn bán lẻ theo giai đoạn.** Mỗi lần mở ghi một dòng vào sheet `MoKhoa` (cột "Phần") với mã:
- `dv:<năm bắt đầu>`: một đại vận, 19 xu (vận đã qua 9 xu).
- `nam:<năm>`: vận năm, 29 xu.
- `thang:<yyyy-mm>`: nhật vận một tháng, 9 xu.
- `dong_hanh:<năm>`: đồng hành cả năm, 79 xu (trừ phần đã mua).
- **Gói trọn:** `tron_dai_van` 99 xu. `tron_goi` (Trọn đời, 149 xu) gồm `TT_TRON_GOI`, **không gồm năm/tháng** (vẫn giữ nguồn thu định kỳ).
- **Gói gia đình:** `gia_dinh_3` / `gia_dinh_5` cộng lượt vào sheet `Ve`. `dungLuotGiaDinh` dùng 1 lượt = Bản mở + vận năm cho 1 lá số.
- **Quyền:** `ttQuyen_` trả `q` gồm cờ từng phần, `q.dvMo`, `q.namMo`, `q.thangMo`, `q.dhNam` và `dvAll/namAll/thangAll`.
- **Chú ý:** không đặt tên map trùng tên gói (`nam`, `thang`), vì từng gây lỗi ghi đè.
- **Cắt nội dung ở máy chủ:** `ttCatPhan_` bỏ lời luận của phần chưa mở, chỉ giữ điểm làm mồi, và gắn `r.vanTom`.
- **Gói cũ:** người đã mua `luu_nien` được xem mọi năm/tháng.
- **Phía trình duyệt:** `data-mua="phan|id"` → `muaGo`; `tinhTrangMua` quyết định thanh kêu gọi mua; `chenKhoa` chèn thẻ khóa; `bangGiaHtml` là bảng giá 3 bậc.
- **Bản miễn phí:** `renderKhach` có câu mở, nút nghiệm chứng, dòng thời gian đại vận bị che, bảng giá và cam kết minh bạch.
- Giá bán là mức khởi đầu, chưa qua thử nghiệm; nên xem doanh thu trong Quản trị rồi điều chỉnh.
