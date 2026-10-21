# -*- coding: utf-8 -*-
"""Vá Index.html – mục 27: chia đôi màn hình (danh sách trái, chi tiết phải) cho Bảng KPI, Nhân sự, KPI quản lý.
Chạy bằng exec() ở cuối tests/va-index.py (phải là mục CUỐI vì bọc lại các hàm của mục trước); dùng chung R(), s, D.
Mã: tests/chia-doi/chia-doi.{css,js}. Kiểm thử: tests/chia-doi-web.js."""

# veHS: cho phép vẽ hồ sơ vào khung bên phải thay vì thay cả trang
R("""  $('main').innerHTML=h;
  window.scrollTo(0,0);
  window.__hs=r;
}""", """  if(window.__hsVao){ window.__hsVao(h.replace('<button class="btn" onclick="vNS()">← Về danh sách</button>','')); return; }   // chia đôi (mục 27)
  $('main').innerHTML=h;
  window.scrollTo(0,0);
  window.__hs=r;
  try{ if(window.innerWidth>=1100 && !cdBat()){ var nutVe=$('main').querySelector('button[onclick="vNS()"]');
    if(nutVe) nutVe.insertAdjacentHTML('afterend',' <button class="btn" onclick="cdDatKieu(true);vNS();xemHS(\\''+esc(r.ho.MaNV)+'\\')">⧉ Chia đôi</button>'); } }catch(e){}
}""")

# KPI quản lý: nhớ danh sách + đánh dấu dòng để bấm mở chi tiết
R("""    var b='';
    // Bảng tổng""", """    var b=''; window.__qlDs=ds;
    // Bảng tổng""")
R("""      b+='<tr>'+
        '<td class="mono">'+(o.hang||'–')+'</td>'+""", """      b+='<tr data-cd="ql|'+esc(o.maNV)+'">'+
        '<td class="mono">'+(o.hang||'–')+'</td>'+""")

_cd = os.path.join(D, 'chia-doi')
_css = io.open(os.path.join(_cd, 'chia-doi.css'), encoding='utf-8').read()
_js = io.open(os.path.join(_cd, 'chia-doi.js'), encoding='utf-8').read()
_k = s.rfind('</body>')
assert _k > 0 and 'cdPanel' not in s
s = s[:_k] + '<style>\n' + _css + '</style>\n<script>\n' + _js + '</script>\n' + s[_k:]
