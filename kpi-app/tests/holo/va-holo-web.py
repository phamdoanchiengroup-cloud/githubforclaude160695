# -*- coding: utf-8 -*-
"""Vá Index.html – mục 34: hologram cho riêng tài khoản chủ sở hữu (23/10): lớp áo vũ trụ cho toàn web + "Đài quan sát KPI"
ở đầu Tổng quan + nút bật/tắt cuối menu. Chạy bằng exec() trong tests/va-index.py (trước mục 27 chia đôi). Kiểm thử: tests/holo-web.js."""
_k34 = s.rfind('</body>')
s = s[:_k34] + '<script>\n' + io.open(os.path.join(D, 'holo', 'holo-web.js'), encoding='utf-8').read() + '</script>\n' + s[_k34:]
