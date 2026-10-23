# TCC Bán hàng

Nhóm: Thiên Cơ Các · Tách từ CLAUDE.md ngày 21/10/2026
Liên quan: [[TCC Tiện ích bán lẻ]] · [[TCC Nghiệm chứng]] · [[Quyết định của chủ dự án]] · [[00 Mục lục]]

- `TT_PHAN_MAC_DINH` là bảng giá mặc định; chủ dự án sửa được trong Quản trị.
- **Chiến lược 10/2026: kéo người dùng.** Mọi phần 9–49 xu, trường `goc` = giá cũ để hiện gạch ngang (`giaHtml` ở client). `TT_GIA_PHIEN`: bảng giá lưu trong Script Properties không cùng phiên thì bỏ qua phần giá/gói nạp (chỉ giữ mức thưởng) – tăng số này mỗi khi đổi giá mặc định. `TT_KM_MAC_DINH`: quà đăng ký 19 xu (đủ mở `co_ban`), mời bạn đăng ký thì cả hai +9 xu (trần 30 lượt/người mời, đếm `soMoiDK` trong tài khoản), vẫn giữ 20% lần nạp đầu của bạn bè. `dangKy` → `ttQuaDangKy_` trả `r.qua`. `bangGiaCongKhai()` cho khách chưa đăng nhập (kèm `url` để làm link mời). Client: `quaDK()`, `linkMoi()`, `chiaSe()` (Web Share, không có thì chép lời mời), `moiBanHtml()` (cuối tab Tổng quan và Tiện ích), nút "↗ Mời bạn bè" ở thẻ hồ sơ, `#wlQua` ở trang chủ, `#rgQua` trong hộp đăng ký; khách chưa đăng nhập thấy CTA "Đăng ký nhận quà & mở Tổng hợp" (`tinhTrangMua`, `th6KhachHtml`, `tongKhoaHtml`). `tests/thanh-toan.js` ghim bảng giá cũ cho phần đầu, phần cuối kiểm tra giá mới + quà.
- **Luận giải 6 hệ miễn phí** (12 cung Tử Vi, Bát Tự, Chiêm tinh, Thần số, HD, Hà Lạc).
- `co_ban` (19 xu) nay là **Tổng hợp 6 hệ**: 9 lĩnh vực, chân dung, con người, tình duyên, đường đời, mật mã; mở vĩnh viễn. Client: `tongKhoa(r)`, `tongKhoaHtml` (tab Tổng quan khóa), `tinhTrangMua` mời mở Tổng hợp (trừ ở tab Vận hạn). Mua vận hạn/biến cố/PDF không cần `co_ban`; riêng `phoi_ngau` cần `co_ban` (nằm trong phần Tổng hợp).
- **Vận hạn bán lẻ theo giai đoạn.** Mỗi lần mở ghi một dòng vào sheet `MoKhoa` (cột "Phần") với mã:
  - `dv:<năm bắt đầu>`: một đại vận, 9 xu.
  - `nam:<năm>`: vận năm, 19 xu.
  - `thang:<yyyy-mm>`: nhật vận một tháng, 9 xu.
  - `dong_hanh:<năm>`: đồng hành cả năm, 39 xu (trừ phần đã mua).
- **Gói trọn:** `tron_dai_van` 39 xu. `tron_goi` (Trọn đời, 49 xu) gồm `TT_TRON_GOI`, **không gồm năm/tháng** (vẫn giữ nguồn thu định kỳ).
- **Gói gia đình:** `gia_dinh_3` / `gia_dinh_5` cộng lượt vào sheet `Ve`. `dungLuotGiaDinh` dùng 1 lượt = Bản mở + vận năm cho 1 lá số.
- **Quyền:** `ttQuyen_` trả `q` gồm cờ từng phần, `q.dvMo`, `q.namMo`, `q.thangMo`, `q.dhNam` và `dvAll/namAll/thangAll`.
  - **Chú ý:** không đặt tên map trùng tên gói (`nam`, `thang`), vì từng gây lỗi ghi đè.
- **Cắt nội dung ở máy chủ:** `ttCatPhan_` bỏ lời luận của phần chưa mở, chỉ giữ điểm làm mồi, và gắn `r.vanTom`.
- **Gói cũ:** người đã mua `luu_nien` được xem mọi năm/tháng.
- **Phía trình duyệt:** `data-mua="phan|id"` → `muaGo`; `tinhTrangMua` quyết định thanh kêu gọi mua; `chenKhoa` chèn thẻ khóa; `bangGiaHtml` là bảng giá 3 bậc.
- **Bản miễn phí:** `renderKhach` có câu mở, nút nghiệm chứng, dòng thời gian đại vận bị che, bảng giá và cam kết minh bạch.
- Giá bán là mức khởi đầu, chưa qua thử nghiệm; nên xem doanh thu trong Quản trị rồi điều chỉnh.

## 23/10 – Quà đăng ký 50 xu + poster trang chủ (mã `2026.10.23.4`)
- `TT_KM_MAC_DINH.dangKy` đổi 19 → **50**. Thêm `TT_KM_PHIEN = 2`: quà đăng ký lưu trong Quản trị chỉ có hiệu lực khi `kmPhien` trùng phiên này (bản lưu cũ 19 xu bị bỏ qua). `qtLuuBangGia` ghi thêm `kmPhien`.
- Poster `#posterQua` nằm đầu `qc-top`, chỉ hiện cho khách chưa đăng nhập; khi poster hiện thì ẩn `qc-strip`. Hàm `vePosterQua(qd)` trong Script.html: số xu lớn trong vòng sáng, 3 cách dùng tính giá từ bảng giá thật, mỗi cách ghi "còn dư":
  - **Trọn đời** 49 xu (gốc 149).
  - **Năm nay**: Tổng hợp + vận năm + nhật vận 1 tháng = 47 xu.
  - **Tình duyên**: Tổng hợp + cặp đôi + phối ngẫu = 47 xu.
  - Nút "Tạo tài khoản – nhận 50 xu" (`data-dang-ky`).
- `duMo(qd)` thay câu cũ "đủ mở Tổng hợp 6 hệ" ở trang chủ, hộp đăng ký và thanh CTA.
- Kiểm thử: `thanh-toan.js` thêm kiểm tra quà 50 và bỏ bản lưu phiên cũ (cần `TK_PASS` mới chạy được; đã kiểm tra riêng bằng gia-lap: mặc định 50, bản lưu cũ 19 → 50, bản lưu mới 30 → 30, đăng ký nhận 50). Các bộ cai-dat 83, tai-khoan, tien-ich 55, tong-hop, giai-doan, ho-so-nam, van-sau đều đạt.
