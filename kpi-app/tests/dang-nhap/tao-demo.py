# -*- coding: utf-8 -*-
"""Dựng kpi-app/demo-dang-nhap.html: chèn hình Mai (tests/mai/mai-chibi.js) vào tests/dang-nhap/demo.src.html.
   python3 kpi-app/tests/dang-nhap/tao-demo.py"""
import io, os
D = os.path.dirname(os.path.abspath(__file__))
src = io.open(os.path.join(D, 'demo.src.html'), encoding='utf-8').read()
mai = io.open(os.path.join(D, '..', 'mai', 'mai-chibi.js'), encoding='utf-8').read().strip()
out = src.replace('/*MAI*/', mai)
io.open(os.path.join(D, '..', '..', 'demo-dang-nhap.html'), 'w', encoding='utf-8').write(out)
print('OK demo-dang-nhap.html', len(out.encode('utf-8')) // 1024, 'KB')
