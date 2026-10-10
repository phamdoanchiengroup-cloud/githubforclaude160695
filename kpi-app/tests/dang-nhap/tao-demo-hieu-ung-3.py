# -*- coding: utf-8 -*-
"""Dựng kpi-app/demo-dang-nhap-hieu-ung-3.html: màn đăng nhập Khắc laser ĐÚNG như web hiện tại (tê giác Rhino, hiệu ứng đợt 1–2 đang bật)
   + 6 hiệu ứng động mới (tests/dang-nhap/hieu-ung-3.{css,js}) + video nền dựng bằng Remotion (anh/rhino/nen-khac-laser.mp4),
   bật / tắt từng cái bằng công tắc. python3 kpi-app/tests/dang-nhap/tao-demo-hieu-ung-3.py"""
import io, os, base64, html
D = os.path.dirname(os.path.abspath(__file__))
T = os.path.join(D, '..')
# lấy hàm khung() của tao-demo-bi-a.py (chỉ phần định nghĩa, không dựng lại các demo cũ)
_src = io.open(os.path.join(D, 'tao-demo-bi-a.py'), encoding='utf-8').read()
_g = {'__file__': os.path.join(D, 'tao-demo-bi-a.py')}
exec(_src.split("cu = khung('dang-nhap-bi-a.html'")[0], _g)
khung, doc = _g['khung'], _g['doc']

goc = khung('dang-nhap-khac.html', True, '/*LKHU*/')
# tê giác Rhino thay Mai – đúng như web (va-index.py mục 17)
_ns = {'s': goc, 'D': T, 'io': io, 'os': os}
exec("def R(a, b, n=1):\n    global s\n    assert a in s, a[:80]\n    s = s.replace(a, b, n)\n", _ns)
exec(doc(os.path.join(T, 'mai', 'va-rhino.py')).replace('assert _n >= 30, _n', 'pass  # khung đăng nhập có ít chữ Mai hơn cả web'), _ns)
goc = _ns['s']
assert 'rh-anh' in goc and 'var MAI_SVG=\'<image' in goc

css = doc(os.path.join(D, 'hieu-ung-3.css')); js = doc(os.path.join(D, 'hieu-ung-3.js'))
k = goc.rfind('</style>'); goc = goc[:k] + css + goc[k:]
k = goc.rfind('</script>'); goc = goc[:k] + '\n/*LKHU3*/\n' + js + goc[k:]
_b = lambda f: base64.b64encode(open(os.path.join(T, '..', 'anh', 'rhino', f), 'rb').read()).decode()
VWEBM = 'data:video/webm;base64,' + _b('nen-khac-laser.webm'); VMP4 = 'data:video/mp4;base64,' + _b('nen-khac-laser.mp4')

trang = doc(os.path.join(D, 'demo-hieu-ung-3.src.html')).replace('{{GOC}}', html.escape(goc, quote=False)).replace('{{VWEBM}}', VWEBM).replace('{{VMP4}}', VMP4)
io.open(os.path.join(T, '..', 'demo-dang-nhap-hieu-ung-3.html'), 'w', encoding='utf-8').write(trang)
print('OK demo-dang-nhap-hieu-ung-3.html', len(trang.encode('utf-8')) // 1024, 'KB')
