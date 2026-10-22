# -*- coding: utf-8 -*-
"""Vá Index.html – hồ sơ bắt buộc khi đăng nhập + thẻ thống kê ở tab Nhân sự (22/10). Chạy bằng exec() trong tests/va-index.py (trước mục chia đôi)."""
_k31 = s.rfind('</body>')
s = s[:_k31] + '<script>\n' + io.open(os.path.join(D, 'ho-so', 'ho-so-web.js'), encoding='utf-8').read() + '</script>\n' + s[_k31:]
