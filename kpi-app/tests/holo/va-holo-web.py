# -*- coding: utf-8 -*-
"""Vá Index.html – mục 34: hologram cho riêng tài khoản chủ sở hữu (23/10): lớp áo vũ trụ cho toàn web + "Đài quan sát KPI"
ở đầu Tổng quan + nút bật/tắt cuối menu. Chạy bằng exec() trong tests/va-index.py (trước mục 27 chia đôi). Kiểm thử: tests/holo-web.js."""
_k34 = s.rfind('</body>')
# 16/11: hologram bỏ hẳn – lớp áo chủ sở hữu là hệ thống vật liệu kính (tests/rung-suong/), chỉ có hiệu lực khi <html class="rs">
_kinh_css = io.open(os.path.join(D, 'rung-suong', 'rung-suong.css'), encoding='utf-8').read()
_kinh_js = io.open(os.path.join(D, 'rung-suong', 'rung-suong.js'), encoding='utf-8').read()
# 16/11: ảnh nền thật (Pexels, kpi-app/anh/web/kinh-*.jpg) qua jsDelivr, ghim theo commit ảnh (anh_cdn trong tests/dang-nhap/anh_rhino.py)
import sys as _sys; _sys.path.insert(0, os.path.join(D, 'dang-nhap')); from anh_rhino import anh_cdn as _anh_cdn
_kinh_anh = {t: {'may': _anh_cdn('anh/web/kinh-%s.jpg' % t), 'dt': _anh_cdn('anh/web/kinh-%s-dt.jpg' % t)} for t in ('xanh', 'suong', 'do', 'tim')}
_kinh_js = 'window.KINH_ANH=' + __import__('json').dumps(_kinh_anh) + ';\n' + _kinh_js
s = s[:_k34] + '<style id="kinhCss">\n' + _kinh_css + '</style>\n<script>\n' + _kinh_js + '\n' + io.open(os.path.join(D, 'holo', 'holo-web.js'), encoding='utf-8').read() + '</script>\n' + s[_k34:]
