# TCC Lập lá số và bốn tầng luận

Nhóm: Thiên Cơ Các · Tách từ CLAUDE.md ngày 21/10/2026
Liên quan: [[TCC Văn dễ hiểu và Tổng hợp 6 hệ]] · [[TCC Sáu hệ]] · [[TCC Bán hàng]] · [[00 Mục lục]]

- **Lập lá số:**
  - `Code.gs › lapLaSoDayDu_` → `lapMoRong_` gọi các hệ phụ, `tongHopLuan` (TongHop.gs) và `deHieuLap_` (DeHieu.gs).
  - `TaiKhoan.gs › lapLaSo(input, token)` áp quyền. **Từ 10/2026: mọi người (kể cả chưa đăng nhập) nhận bản đầy đủ luận giải 6 hệ**; máy chủ chỉ cắt phần khóa: `ttCatPhan_` (vận hạn, biến cố, phối ngẫu) và `ttCatTongHop_` khi chưa có `co_ban` (bỏ `deHieu.th6/tongHop`, các mục Tổng hợp trong `moRong.tongHop`; gắn `r.th6 = th6Moi_(r)` làm mồi, `r.tongKhoa = true`). `khachRutGon_` không còn dùng.
- **Bốn tầng luận** (thiết kế của chủ dự án):
  1. Dữ liệu.
  2. Facts: `taoFact_` trong Facts.gs, gồm he / linhVuc / nhom / loai / yNghia / trongSo.
  3. Kho văn: `renderVanCung_` trong Script.html; TuViHeThong.gs sinh văn 12 cung.
  4. Đồng thuận 6 hệ: `dhTongHop_` trong DeHieu.gs, gồm 9 lĩnh vực và điểm /10.
- **Thang điểm:** điểm thô → /10 bằng `chuanHoa10_(d) = round(100/(1+e^(-d/3)))/10`. Nhãn phải khớp điểm (có bài kiểm tra).
