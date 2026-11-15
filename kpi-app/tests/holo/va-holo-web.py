# -*- coding: utf-8 -*-
"""Vá Index.html – mục 34: hologram cho riêng tài khoản chủ sở hữu (23/10): lớp áo vũ trụ cho toàn web + "Đài quan sát KPI"
ở đầu Tổng quan + nút bật/tắt cuối menu. Chạy bằng exec() trong tests/va-index.py (trước mục 27 chia đôi). Kiểm thử: tests/holo-web.js."""
_k34 = s.rfind('</body>')
# 16/11: hologram bỏ hẳn – lớp áo chủ sở hữu là hệ thống vật liệu kính (tests/rung-suong/), chỉ có hiệu lực khi <html class="rs">
_kinh_css = io.open(os.path.join(D, 'rung-suong', 'rung-suong.css'), encoding='utf-8').read()
_kinh_js = io.open(os.path.join(D, 'rung-suong', 'rung-suong.js'), encoding='utf-8').read()
s = s[:_k34] + '<style id="kinhCss">\n' + _kinh_css + '</style>\n<script>\n' + _kinh_js + '\n' + io.open(os.path.join(D, 'holo', 'holo-web.js'), encoding='utf-8').read() + '</script>\n' + s[_k34:]
