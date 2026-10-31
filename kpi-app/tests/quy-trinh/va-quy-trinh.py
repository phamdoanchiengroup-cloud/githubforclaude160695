# -*- coding: utf-8 -*-
# Vá Code.gs – Quy trình sản xuất (31/10): nối tests/quy-trinh/quy-trinh.gs + cho phép tải mảnh QuyTrinh.html (chỉ OWNER).
# Chạy bằng exec() ở cuối tests/va-code.py. Kiểm thử: tests/quy-trinh.js
R("var MANH_GD = { SoDo: ['ADMIN', 'TP', 'TL', 'HR'], HoatAnh: null, AmThanh: null };",
  "var MANH_GD = { SoDo: ['ADMIN', 'TP', 'TL', 'HR'], HoatAnh: null, AmThanh: null, QuyTrinh: ['OWNER'] };   // QuyTrinh (31/10): chỉ chủ sở hữu")
s = s.rstrip() + '\n' + io.open(os.path.join(os.path.dirname(__file__), 'quy-trinh', 'quy-trinh.gs'), encoding='utf-8').read()
