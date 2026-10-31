# -*- coding: utf-8 -*-
# Vá Code.gs – Đơn hàng → xưởng (31/10): nối tests/quy-trinh/don-hang.gs (đọc Sheet "Trạng thái đơn hàng", phân loại SKU 4 thông số).
# Chạy bằng exec() ở cuối tests/va-code.py, sau va-quy-trinh.py (dùng qtQuyen_). Kiểm thử: tests/don-hang.js
s = s.rstrip() + '\n' + io.open(os.path.join(os.path.dirname(__file__), 'quy-trinh', 'don-hang.gs'), encoding='utf-8').read()
