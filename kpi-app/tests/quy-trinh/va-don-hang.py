# -*- coding: utf-8 -*-
# Vá Code.gs – Đơn hàng → xưởng (31/10): nối tests/quy-trinh/don-hang.gs (đọc Sheet "Trạng thái đơn hàng", phân loại SKU 4 thông số).
# Chạy bằng exec() ở cuối tests/va-code.py, sau va-quy-trinh.py (dùng qtQuyen_). Kiểm thử: tests/don-hang.js
s = s.rstrip() + '\n' + io.open(os.path.join(os.path.dirname(__file__), 'quy-trinh', 'don-hang.gs'), encoding='utf-8').read()
# 01/11: chụp đơn hàng mỗi ngày cùng trigger 9h sáng có sẵn (không cần chủ dự án cài thêm trigger)
_cu_dh = "  var n = chotThangLoi_(ky, '', NGUOI_CHOT_TAM);\n"
assert s.count(_cu_dh) == 1, ('va-don-hang: không thấy snapshotKPIHangNgay', s.count(_cu_dh))
s = s.replace(_cu_dh, _cu_dh + "  if (typeof chupDonHangHangNgay_ === 'function') chupDonHangHangNgay_();   // tab Đơn hàng (01/11): bản chụp để xem thay đổi trong ngày\n")
