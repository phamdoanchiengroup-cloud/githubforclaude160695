# -*- coding: utf-8 -*-
"""Vá Index.html – mục 36: tab "Quy trình sản xuất" (31/10), chỉ tài khoản chủ sở hữu.
Giao diện nằm ở mảnh tải sau QuyTrinh.html (chép từ tests/quy-trinh/quy-trinh-web.html) – Index chỉ thêm tab + hàm tải.
Chạy bằng exec() trong tests/va-index.py (trước mục 27 chia đôi). Kiểm thử: tests/quy-trinh-web.js"""
_qt_src = io.open(os.path.join(D, 'quy-trinh', 'quy-trinh-web.html'), encoding='utf-8').read()
io.open(os.path.join(D, '..', 'QuyTrinh.html'), 'w', encoding='utf-8').write(_qt_src)

def _t36(cu, moi, dem=1):
    global s
    assert s.count(cu) == dem, ('mục 36: không thấy đúng %d chỗ' % dem, cu[:80], s.count(cu))
    s = s.replace(cu, moi)

_t36("['ns','Nhân sự'],['kyn','Kỹ năng'],['mm','Máy móc'],['ts','Trọng số']", "['ns','Nhân sự'],['kyn','Kỹ năng'],['qt','Quy trình sản xuất'],['mm','Máy móc'],['ts','Trọng số']")
_t36("  ['Sản xuất',['duyetsl','nk','kcs','dd','nenep','cccn']],", "  ['Sản xuất',['duyetsl','nk','qt','kcs','dd','nenep','cccn']],")
_t36("  var tabChiOwner={pq:1, ptdm:1, log:1, kpiql:1};", "  var tabChiOwner={pq:1, ptdm:1, log:1, kpiql:1, qt:1};   // qt: Quy trình sản xuất (31/10) – giai đoạn thử")
_t36("sodo:vSoDo,com:vCom}[k])();", "sodo:vSoDo,com:vCom,qt:vQT}[k])();")
_t36("  kyn:'<path", "  qt:'<rect x=\"3.5\" y=\"3.5\" width=\"6\" height=\"4.5\" rx=\"1\"/><rect x=\"14.5\" y=\"3.5\" width=\"6\" height=\"4.5\" rx=\"1\"/><rect x=\"9\" y=\"16\" width=\"6\" height=\"4.5\" rx=\"1\"/><path d=\"M6.5 8v3.5h11V8M12 11.5V16\"/>',\n  kyn:'<path")
import hashlib as _hl36, re as _re36
_v36 = _hl36.md5(_qt_src.encode('utf-8')).hexdigest()[:10]
_m36 = _re36.search(r'var MANH_VER=(\{[^}]*\});', s)
assert _m36, 'mục 36: không thấy MANH_VER'
_d36 = _json.loads(_m36.group(1)); _d36['QuyTrinh'] = _v36
s = s.replace(_m36.group(0), 'var MANH_VER=' + _json.dumps(_d36) + ';', 1)
_k36 = s.rfind('</body>')
s = s[:_k36] + '''<script>
/* ===== 36. QUY TRÌNH SẢN XUẤT (31/10) – giao diện ở QuyTrinh.html, chỉ chủ sở hữu (máy chủ chặn ở layManhGiaoDien + từng hàm) ===== */
function vQT(){
  if(!ME||!ME.laOwner){ $('main').innerHTML='<div class="alert a-wn">Tab này đang chỉ mở cho tài khoản chủ sở hữu.</div>'; return; }
  if(window.__qtDaNap){ qtVe(); return; }
  $('main').innerHTML='<div class="ptitle">Quy trình sản xuất</div><div class="pdesc">Đang tải…</div>';
  taiManh('QuyTrinh',function(ok,msg){
    if(tabHienTai!=='qt')return;
    if(ok&&window.__qtDaNap){ qtVe(); return; }
    $('main').innerHTML='<div class="ptitle">Quy trình sản xuất</div><div class="alert a-bd">'+esc(msg||'Không tải được.')+' <button class="btn sm" type="button" onclick="vQT()">Thử lại</button></div>';
  });
}
</script>
''' + s[_k36:]
