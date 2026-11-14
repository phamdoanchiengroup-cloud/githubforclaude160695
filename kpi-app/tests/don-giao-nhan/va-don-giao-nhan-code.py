# -*- coding: utf-8 -*-
"""Vá Code.gs – mục 45 (14/11): mảnh QuyTrinh.html cấp thêm cho ADMIN (ban điều hành) để mở tab Đơn hàng; dữ liệu Đơn hàng kiểm quyền ở dhQuyenDon_ (tests/quy-trinh/don-hang.gs)."""
_a = "QuyTrinh: ['OWNER', 'TP', 'PP'], CauHinhGay: [] };"
assert s.count(_a) == 1, 'mục 45: không thấy MANH_GD'
s = s.replace(_a, "QuyTrinh: ['OWNER', 'ADMIN', 'TP', 'PP'], CauHinhGay: [] };   /* 14/11: + ADMIN – tab Đơn hàng cho ban điều hành */")
