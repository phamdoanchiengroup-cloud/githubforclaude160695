# -*- coding: utf-8 -*-
# Mục 20 của va-index.py (exec): dải thông báo GIẢI BÓNG ĐÁ (13/10) dưới thanh cơm trưa, mọi tài khoản.
# Chủ dự án: không làm tab riêng, chỉ vài thông tin hưởng ứng phong trào. Máy chủ: tests/bong-da.gs (layBongDa).
_bd = os.path.join(D, 'bong-da')
assert 'bdbar' not in s
R("""  <div id="combar" class="hide"></div>""", """  <div id="combar" class="hide"></div>
  <div id="bdbar" class="hide"></div>""")
R("""    try{ comTai(); }catch(e){}""", """    try{ comTai(); }catch(e){}
    try{ bdTai(); }catch(e){}""")
_k = s.rfind('</body>')
s = s[:_k] + '<style>\n' + io.open(os.path.join(_bd, 'va-bong-da.css'), encoding='utf-8').read() + '</style>\n<script>\n' + io.open(os.path.join(_bd, 'va-bong-da.js'), encoding='utf-8').read() + '</script>\n' + s[_k:]
