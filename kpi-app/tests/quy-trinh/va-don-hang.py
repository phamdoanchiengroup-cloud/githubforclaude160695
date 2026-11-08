# -*- coding: utf-8 -*-
# Vá Code.gs – Đơn hàng → xưởng (31/10): nối tests/quy-trinh/don-hang.gs (đọc Sheet "Trạng thái đơn hàng", phân loại SKU 4 thông số).
# Chạy bằng exec() ở cuối tests/va-code.py, sau va-quy-trinh.py (dùng qtQuyen_). Kiểm thử: tests/don-hang.js
s = s.rstrip() + '\n' + io.open(os.path.join(os.path.dirname(__file__), 'quy-trinh', 'don-hang.gs'), encoding='utf-8').read()
# 01/11: chụp đơn hàng mỗi ngày cùng trigger 9h sáng có sẵn (không cần chủ dự án cài thêm trigger)
_cu_dh = "  var n = chotThangLoi_(ky, '', NGUOI_CHOT_TAM);\n"
assert s.count(_cu_dh) == 1, ('va-don-hang: không thấy snapshotKPIHangNgay', s.count(_cu_dh))
s = s.replace(_cu_dh, _cu_dh + "  if (typeof chupDonHangHangNgay_ === 'function') chupDonHangHangNgay_();   // tab Đơn hàng (01/11): bản chụp để xem thay đổi trong ngày\n")
# 08/11 (chủ dự án): nghỉ lễ Ngày Văn hóa Việt Nam 24/11 (theo Cẩm nang hội nhập 09/2026) – tự có mỗi năm, khỏi nhập tay vào sheet NgayLe
_cu_le = """  docAnToan_('MienTruDiemDanh').forEach(function(r) { them(r, String(r.LyDo || 'Miễn điểm danh')); });
  __NGAY_LE = m;"""
assert s.count(_cu_le) == 1, ('va-don-hang: không thấy bangNgayLe_', s.count(_cu_le))
s = s.replace(_cu_le, """  docAnToan_('MienTruDiemDanh').forEach(function(r) { them(r, String(r.LyDo || 'Miễn điểm danh')); });
  leCoDinhNam_().forEach(function(x) { if (!m[x[0] + '|*']) m[x[0] + '|*'] = x[1]; });   // 08/11: ngày lễ cố định của công ty (24/11)
  __NGAY_LE = m;""")

