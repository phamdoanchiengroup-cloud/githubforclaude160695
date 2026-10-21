# -*- coding: utf-8 -*-
"""Dựng kpi-app/demo-dang-nhap-tram-khac.html: màn đăng nhập mới "Trạm khắc" (tests/dang-nhap/tram-khac.{css,js} chồng lên
   dang-nhap-khac.html, giữ ảnh ngọn cơ + khắc laser) đặt cạnh màn hiện tại. Cả hai có tê giác Rhino như web.
   python3 kpi-app/tests/dang-nhap/tao-demo-tram-khac.py"""
import io, os, html
D = os.path.dirname(os.path.abspath(__file__))
T = os.path.join(D, '..')
_src = io.open(os.path.join(D, 'tao-demo-bi-a.py'), encoding='utf-8').read()
_g = {'__file__': os.path.join(D, 'tao-demo-bi-a.py')}
exec(_src.split("cu = khung('dang-nhap-bi-a.html'")[0], _g)
khung, doc = _g['khung'], _g['doc']

def rhino(s):   # tê giác Rhino thay Mai – đúng như web (va-index.py mục 17)
    ns = {'s': s, 'D': T, 'io': io, 'os': os}
    exec("def R(a, b, n=1):\n    global s\n    assert a in s, a[:80]\n    s = s.replace(a, b, n)\n", ns)
    exec(doc(os.path.join(T, 'mai', 'va-rhino.py')).replace('assert _n >= 30, _n', 'pass'), ns)
    return ns['s']

HU = 'window.LK_HU={chay:true,cua:true,mat:true,ket:true,gio:true};'
cu = rhino(khung('dang-nhap-khac.html', True, HU))
moi = cu
k = moi.rfind('</style>'); moi = moi[:k] + doc(os.path.join(D, 'tram-khac.css')) + moi[k:]
k = moi.rfind('\nbbKhoiDong();'); assert k > 0
moi = moi[:k] + '\n' + doc(os.path.join(D, 'tram-khac.js')) + moi[k:]
trang = doc(os.path.join(D, 'demo-tram-khac.src.html')).replace('{{MOI}}', html.escape(moi, quote=False)).replace('{{CU}}', html.escape(cu, quote=False))
io.open(os.path.join(T, '..', 'demo-dang-nhap-tram-khac.html'), 'w', encoding='utf-8').write(trang)
print('OK demo-dang-nhap-tram-khac.html', len(trang.encode('utf-8')) // 1024, 'KB')
