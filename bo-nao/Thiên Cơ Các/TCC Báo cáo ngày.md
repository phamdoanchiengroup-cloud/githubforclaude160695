# TCC Báo cáo ngày

Nhóm: Thiên Cơ Các · Tách từ CLAUDE.md ngày 21/10/2026
Liên quan: [[TCC Bán hàng]] · [[TCC Tiện ích bán lẻ]] · [[00 Mục lục]]

- **Báo cáo ngày cho chủ sở hữu (ThanhToan.gs › `bcSoLieu_`, `bcHtml_`, `guiBaoCaoNgay`, `caiDatBaoCaoNgay`, `tatBaoCaoNgay`):** email 7 giờ sáng (trigger `everyDays(1).atHour(7)`): doanh thu 24h/7/30 ngày (DonHang `DA_TRA` theo cột Trả lúc), tài khoản mới (Script Properties `TK_*.taoLuc`) + người giới thiệu, phần đã mở theo loại (MoKhoa), xu dùng/tặng (SoCai), lá số lập, gieo quẻ, bản tin; mục "Cần chú ý": lỗi `kiemTraCaiDat_`, đơn chờ, đơn treo >1 ngày, mất trigger quét payOS, 7 ngày không có đơn. Người nhận: Thuộc tính tập lệnh `BAO_CAO_EMAIL`, không có thì `Session.getEffectiveUser()` (không ghi email vào mã). Chủ dự án chạy `caiDatBaoCaoNgay` một lần (gửi kèm một bản thử). Kiểm thử: `tests/bao-cao.js`.
