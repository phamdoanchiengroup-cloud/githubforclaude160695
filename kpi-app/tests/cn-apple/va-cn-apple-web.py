# -*- coding: utf-8 -*-
"""Vá Index.html – mục 44: web công nhân kiểu Apple (09/11, chủ dự án chốt: chỉ CN, thanh dưới 5 nút Nhập · KPI · Cơm · Xưởng · Tôi,
bảng KPI xưởng chỉ top 3 + người trên + mình, bật cho tất cả và có nút về giao diện cũ). CSS + JS ở tests/cn-apple/.
Chạy bằng exec() cuối tests/va-index.py. Kiểm thử: tests/cn-apple-web.js"""
_css44 = io.open(os.path.join(D, 'cn-apple', 'cn-apple.css'), encoding='utf-8').read()
_js44 = io.open(os.path.join(D, 'cn-apple', 'cn-apple.js'), encoding='utf-8').read()
assert 0 < s.index('</head>') < s.index('<body'), 'mục 44: không thấy </head> của trang'
s = s.replace('</head>', '<style id="cnApple">\n' + _css44 + '</style>\n</head>', 1)
_k44 = s.rfind('</body>')
s = s[:_k44] + '<script>\n' + _js44 + '</script>\n' + s[_k44:]
