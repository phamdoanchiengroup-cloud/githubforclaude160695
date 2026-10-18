# -*- coding: utf-8 -*-
"""Dựng kpi-app/demo-dang-nhap-xu-huong.html: 5 kiểu màn đăng nhập theo xu hướng (kính lỏng, cực quang, bento,
   chữ động, thẻ hologram) theo bộ nhận diện Rhino. Dùng lại khung demo.src.html (ganNhap, okLop, chọn kiểu, xem điện thoại),
   CSS ở xu-huong.css, các kiểu ở xu-huong.js; chèn hình Mai + ảnh/font Rhino.
   python3 kpi-app/tests/dang-nhap/tao-xu-huong.py"""
import io, os, sys
D = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, D)
from anh_rhino import anh_rhino
doc = lambda f: io.open(os.path.join(D, f), encoding='utf-8').read()
s = doc('demo.src.html')
# CSS: bỏ CSS 5 kiểu cũ (A–E), giữ CSS hình Mai
i = s.index('/* ===== A. BẢN VẼ KỸ THUẬT ===== */'); j = s.index('@media (prefers-reduced-motion:reduce){*{animation-duration')
cu = s[i:j]
mai_css = cu[cu.index('/* hình Mai'):cu.index('/* ===== D.')]
s = s[:i] + mai_css + doc('xu-huong.css') + '\n' + s[j:]
# JS: thay mảng KIEU
i = s.index('var KIEU=['); j = s.index('var dang=0;')
s = s[:i] + doc('xu-huong.js') + '\n' + s[j:]
s = s.replace('<title>Demo màn đăng nhập</title>', '<title>Màn đăng nhập theo xu hướng</title>\n<link href="https://fonts.googleapis.com/css2?family=Arimo:wght@400;700&display=swap" rel="stylesheet">')
s = s.replace('<h1>Màn đăng nhập – 5 lựa chọn</h1>', '<h1>Màn đăng nhập – 5 kiểu đang thịnh hành</h1>')
a = s.index('<div class="mo">'); b = s.index('</div>', a) + 6
s = s[:a] + ('<div class="mo">Năm kiểu giao diện đăng nhập đang được chia sẻ nhiều trên mạng xã hội năm 2025–26, làm theo bộ nhận diện Rhino '
             '(than chì + vàng, logo, ảnh sản phẩm thật) và có Mai. Mỗi kiểu đều đăng nhập thử được: <b>mật khẩu là "demo"</b>, gõ sai để xem báo lỗi. '
             'Đưa chuột lên các kiểu A, B, E để thấy hiệu ứng theo con trỏ.</div>') + s[b:]
s = s.replace('/*MAI*/', io.open(os.path.join(D, '..', 'mai', 'mai-chibi.js'), encoding='utf-8').read().strip())
s = anh_rhino(s)
ra = os.path.join(D, '..', '..', 'demo-dang-nhap-xu-huong.html')
io.open(ra, 'w', encoding='utf-8').write(s)
print('OK demo-dang-nhap-xu-huong.html', len(s.encode('utf-8')) // 1024, 'KB')
