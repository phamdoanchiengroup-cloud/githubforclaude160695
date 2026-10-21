# -*- coding: utf-8 -*-
"""Dựng kpi-app/demo-so-do-nha-may.html: sơ đồ nhà máy 2D (nhẹ, điện thoại) + bản 3D của chủ dự án (so-do/nha-may-3d.html)
   cùng tô màu theo KPI / sĩ số hôm nay (số liệu mẫu trong tests/so-do/so-do-chung.js).
   python3 kpi-app/tests/so-do/tao-demo.py"""
import io, os, re, json, html
D = os.path.dirname(os.path.abspath(__file__))
G = os.path.join(D, '..', '..')
doc = lambda p: io.open(p, encoding='utf-8').read()

import sys
sys.path.insert(0, os.path.join(D, '..', 'dang-nhap'))
sys.path.insert(0, D)
from anh_rhino import anh_rhino
ba_d = anh_rhino(doc(os.path.join(G, 'so-do', 'nha-may-3d.html')))   # chèn logo RHINO ({{RH_LOGO}}) cho biển tên, cờ
m = re.search(r'const DATA = (\[.*?\])\n;', ba_d, re.S)
assert m, 'không thấy DATA trong bản 3D'
DATA = json.loads(m.group(1))
ss = doc(os.path.join(D, 'so-do-chung.js'))

# mọi khu trong bảng ghép phải có thật trên bản vẽ
ten = {'%d|%s' % (fi, R['n']) for fi, F in enumerate(DATA) for R in F['rooms']}
for k in re.findall(r"'(\d\|[^']+)': '", ss):
    assert k in ten, 'khu không có trên bản vẽ: ' + k

from va_3d import va_ba
b = va_ba(ba_d)

trang = doc(os.path.join(D, 'demo.src.html'))
trang = trang.replace('{{SS}}', ss).replace('{{DATA}}', json.dumps(DATA, ensure_ascii=False, separators=(',', ':')))
trang = trang.replace('{{BA_D}}', html.escape(b, quote=False))
ra = os.path.join(G, 'demo-so-do-nha-may.html')
io.open(ra, 'w', encoding='utf-8').write(trang)
print('OK demo-so-do-nha-may.html', len(trang.encode('utf-8')) // 1024, 'KB')
