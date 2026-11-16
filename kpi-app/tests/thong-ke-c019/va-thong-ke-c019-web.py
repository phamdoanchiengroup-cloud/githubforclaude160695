# -*- coding: utf-8 -*-
"""Vá Index.html – mục 47 (16/11 tối, chủ dự án): mở tab Thống kê cho Giám đốc C019 (chỉ xem; mục "Tốc độ web" vẫn chỉ chủ sở hữu).
Máy chủ: tkQuyen_ trong tests/quy-trinh/quy-trinh.gs. Chạy bằng exec() cuối tests/va-index.py."""
def _t47(cu, moi, dem=1):
    global s
    assert s.count(cu) == dem, ('mục 47: không thấy đúng %d chỗ' % dem, cu[:80], s.count(cu))
    s = s.replace(cu, moi)
_i = s.index("  ADMIN:[['hd','📖 Hướng dẫn']")
_j = s.index("],\n", _i)
s = s[:_j] + ",['tk','Thống kê']" + s[_j:]   # chỉ hiện cho C019 (lọc ở dưới)
_t47("return ME.laOwner || !tabChiOwner[t[0]] || (t[0]==='qt'&&ME.vaiTro==='TP');",
     "return ME.laOwner || !tabChiOwner[t[0]] || (t[0]==='qt'&&ME.vaiTro==='TP') || (t[0]==='tk'&&tkCoXem());")
_t47("function vTK(){\n  if(!ME||!ME.laOwner){",
     "var TK_NV_XEM={C019:1};   /* 16/11 tối (chủ dự án): Giám đốc xem được tab Thống kê */\nfunction tkCoXem(){ return !!(ME&&(ME.laOwner||TK_NV_XEM[String(ME.maNV||'').trim().toUpperCase()])); }\nfunction vTK(){\n  if(!ME||!tkCoXem()){")
