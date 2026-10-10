# -*- coding: utf-8 -*-
# Mục 14 của va-index.py (exec): hiệu ứng thao tác bên trong đã duyệt 10/10 (mục 9, 10, 12–16 của demo-thao-tac.html).
# Mã nằm trong tests/thao-tac/va-thao-tac.css + va-thao-tac.js, chèn ngay trước </body> cuối cùng
# (chạy sau mọi hàm gốc nên bọc lại được duyetNguoi, tuChoiNguoi, renderDraft, delD, vDuyetSL, rungONhap, vKPICaNhanToi, hetHan).
_tt = os.path.join(D, 'thao-tac')
_css = io.open(os.path.join(_tt, 'va-thao-tac.css'), encoding='utf-8').read()
_js = io.open(os.path.join(_tt, 'va-thao-tac.js'), encoding='utf-8').read()
_k = s.rfind('</body>')
assert _k > 0 and 'TT_HEN' not in s
s = s[:_k] + '<style>\n' + _css + '</style>\n<script>\n' + _js + '</script>\n' + s[_k:]
