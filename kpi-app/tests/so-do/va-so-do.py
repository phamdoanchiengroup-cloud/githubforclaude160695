# -*- coding: utf-8 -*-
# Mục 15 của va-index.py (exec): tab "Sơ đồ nhà máy" cho ADMIN + TP (duyệt 10/10, "Áp dụng lên web đi").
# Mặt bằng lấy từ so-do/nha-may-3d.html (DATA); phần chung tests/so-do/so-do-chung.js; mã web tests/so-do/va-so-do.{css,js};
# bản 3D vá bằng tests/so-do/va_3d.py, nhúng trong <textarea id="sdNguon3d"> và chỉ dựng khi bấm "Xem 3D".
import sys as _sys, re as _re, json as _json, html as _html
_sd = os.path.join(D, 'so-do')
for _p in (_sd, os.path.join(D, 'dang-nhap')):
    if _p not in _sys.path: _sys.path.insert(0, _p)
from anh_rhino import anh_rhino as _anh_rhino
from va_3d import va_ba as _va_ba
_doc = lambda p: io.open(p, encoding='utf-8').read()
_ba = _anh_rhino(_doc(os.path.join(D, '..', 'so-do', 'nha-may-3d.html')))
_m = _re.search(r'const DATA = (\[.*?\])\n;', _ba, _re.S)
assert _m, 'không thấy DATA trong bản 3D'
_DATA = _json.loads(_m.group(1))
_ss = _doc(os.path.join(_sd, 'so-do-chung.js'))
_ten = {'%d|%s' % (fi, Rm['n']) for fi, F in enumerate(_DATA) for Rm in F['rooms']}
for _k in _re.findall(r"'(\d\|[^']+)': '", _ss):
    assert _k in _ten, 'khu không có trên bản vẽ: ' + _k
_js = _doc(os.path.join(_sd, 'va-so-do.js')).replace('{{SS}}', _ss).replace('{{DATA}}', _json.dumps(_DATA, ensure_ascii=False, separators=(',', ':')))
_css = _doc(os.path.join(_sd, 'va-so-do.css'))
_b3 = _va_ba(_ba, 'KPI tháng này').replace('</textarea', '<\\/textarea')
assert 'sdMb' not in s
# điều hướng: tab mới sau "Tổng quan" cho ADMIN + TP, nhóm "Hôm nay", biểu tượng, hàm vẽ
R("""  ADMIN:[['hd','📖 Hướng dẫn'],['homnay','Việc hôm nay'],['dash','Tổng quan'],""", """  ADMIN:[['hd','📖 Hướng dẫn'],['homnay','Việc hôm nay'],['dash','Tổng quan'],['sodo','Sơ đồ nhà máy'],""")
R("""  TP:[['hd','📖 Hướng dẫn'],['homnay','Việc hôm nay'],['dash','Tổng quan'],""", """  TP:[['hd','📖 Hướng dẫn'],['homnay','Việc hôm nay'],['dash','Tổng quan'],['sodo','Sơ đồ nhà máy'],""")
R("""  ['Hôm nay',['homnay','dash','cnnhap','kpica']],""", """  ['Hôm nay',['homnay','dash','sodo','cnnhap','kpica']],""")
R("""  hd:'<circle cx="12" cy="12" r="8"/>""", """  sodo:'<path d="M3.5 20.5h17"/><path d="M5 20.5V9l5 3V9l5 3V5.5h4v15"/><path d="M8 16h1.5M12.5 16H14M16.5 16H18"/>',
  hd:'<circle cx="12" cy="12" r="8"/>""")
R("""cccn:vCCCaNhan}[k])();""", """cccn:vCCCaNhan,sodo:vSoDo}[k])();""")
_k = s.rfind('</body>')
s = s[:_k] + '<style>\n' + _css + '</style>\n<script>\n' + _js + '</script>\n<textarea id="sdNguon3d" hidden>' + _html.escape(_b3, quote=False) + '</textarea>\n' + s[_k:]
