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

_t36("['ns','Nhân sự'],['kyn','Kỹ năng'],['mm','Máy móc'],['ts','Trọng số']", "['ns','Nhân sự'],['kyn','Kỹ năng'],['qt','Quy trình sản xuất'],['dh','Đơn hàng'],['mm','Máy móc'],['ts','Trọng số']")
_t36("  ['Sản xuất',['duyetsl','nk','kcs','dd','nenep','cccn']],", "  ['Sản xuất',['duyetsl','nk','qt','dh','kcs','dd','nenep','cccn']],")
_t36("  var tabChiOwner={pq:1, ptdm:1, log:1, kpiql:1};", "  var tabChiOwner={pq:1, ptdm:1, log:1, kpiql:1, qt:1, dh:1};   // qt: Quy trình sản xuất (31/10), dh: Đơn hàng (01/11) – chỉ chủ sở hữu")
_t36("sodo:vSoDo,com:vCom}[k])();", "sodo:vSoDo,com:vCom,qt:vQT,dh:vDH}[k])();")
_t36("  kyn:'<path", "  dh:'<path d=\"M5 4.5h14v15H5z\"/><path d=\"M8.5 9h7M8.5 12.5h7M8.5 16h4\"/>',\n  qt:'<rect x=\"3.5\" y=\"3.5\" width=\"6\" height=\"4.5\" rx=\"1\"/><rect x=\"14.5\" y=\"3.5\" width=\"6\" height=\"4.5\" rx=\"1\"/><rect x=\"9\" y=\"16\" width=\"6\" height=\"4.5\" rx=\"1\"/><path d=\"M6.5 8v3.5h11V8M12 11.5V16\"/>',\n  kyn:'<path")
# 02/11: Việc hôm nay (chủ sở hữu) báo sản phẩm mới chưa có cấu hình / loại khúc chưa có chất liệu / tab kênh mới – bấm mở Đơn hàng → Cấu hình sản phẩm
_t36("  // 5) Yêu cầu sửa hồ sơ\n", """  // 36b) Sản phẩm mới trong Sheet đơn chưa có cấu hình (chỉ chủ sở hữu, 02/11) – số đếm nạp ngầm từ demSanPhamMoi
  if(ME.laOwner&&window.__spMoi&&__spMoi.ok){ var sm=__spMoi, tabDX=[]; try{ tabDX=JSON.parse(localStorage.getItem('dhTabDaXem')||'[]'); }catch(e){}
    if(sm.n) v.push({muc:'vang',so:sm.n,nho:'sản phẩm',t:'Sản phẩm mới chưa có cấu hình',m:'Trong Sheet đơn có: '+sm.ten.slice(0,3).map(function(x){return '<b>'+esc(x.ten)+'</b>'}).join(', ')+(sm.n>3?' và '+(sm.n-3)+' tên khác':'')+' – còn thiếu '+sm.thieu+' sp, đang tạm tính là gậy đánh, chất liệu chưa rõ. Bổ sung để Việc theo xưởng và Thống kê tính đúng.',fn:"moCauHinhSP()",nut:'Bổ sung cấu hình'});
    if(sm.khuc&&sm.khuc.length) v.push({muc:'',so:sm.khuc.length,nho:'loại',t:'Loại chuôi / ngọn chưa có chất liệu',m:sm.khuc.slice(0,4).map(function(x){return esc(x.ten)}).join(', ')+(sm.khuc.length>4?'…':'')+' – nhãn đang hiện "Chưa rõ".',fn:"moCauHinhSP()",nut:'Chọn chất liệu'});
    var tm=(sm.tabMoi||[]).filter(function(t){return tabDX.indexOf(t)<0});
    if(tm.length) v.push({muc:'',so:tm.length,nho:'tab',t:'Sheet đơn có tab kênh mới',m:'Web đang tự đọc thêm: <b>'+tm.map(esc).join(', ')+'</b>. Nếu không phải tab đơn hàng, bấm "Bỏ qua tab này" ở tab Đơn hàng.',fn:"dhDaXemTab();moCauHinhSP('chuy')",nut:'Xem'});
  }
  // 5) Yêu cầu sửa hồ sơ
""")
_t36("function vHomNay(){\n", """function vHomNay(){
  if(ME&&ME.laOwner&&!window.__spMoiTai){ window.__spMoiTai=1; call('demSanPhamMoi',[],function(r){ window.__spMoi=r; if(tabHienTai==='homnay') vHomNay(); }); }
""")
_k36b = s.rfind('</body>')
s = s[:_k36b] + """<script>
/* 36b (02/11): mở Đơn hàng ở mục chỉ định (Cấu hình sản phẩm); đánh dấu đã xem tab kênh mới */
function moCauHinhSP(v){ window.__dhMo=v||'cauhinh'; go('dh'); }
function dhDaXemTab(){ try{ var a=JSON.parse(localStorage.getItem('dhTabDaXem')||'[]'); ((window.__spMoi||{}).tabMoi||[]).forEach(function(t){ if(a.indexOf(t)<0) a.push(t); }); localStorage.setItem('dhTabDaXem',JSON.stringify(a.slice(-50))); }catch(e){} }
</script>
""" + s[_k36b:]
import hashlib as _hl36, re as _re36
_v36 = _hl36.md5(_qt_src.encode('utf-8')).hexdigest()[:10]
_m36 = _re36.search(r'var MANH_VER=(\{[^}]*\});', s)
assert _m36, 'mục 36: không thấy MANH_VER'
_d36 = _json.loads(_m36.group(1)); _d36['QuyTrinh'] = _v36
s = s.replace(_m36.group(0), 'var MANH_VER=' + _json.dumps(_d36) + ';', 1)
_k36 = s.rfind('</body>')
s = s[:_k36] + '''<script>
/* ===== 36. QUY TRÌNH SẢN XUẤT (31/10) – giao diện ở QuyTrinh.html, chỉ chủ sở hữu (máy chủ chặn ở layManhGiaoDien + từng hàm) ===== */
/* 01/11: tab "Đơn hàng" (chỉ chủ sở hữu) – cùng mảnh QuyTrinh.html */
function vDH(){
  if(!ME||!ME.laOwner){ $('main').innerHTML='<div class="alert a-wn">Tab này đang chỉ mở cho tài khoản chủ sở hữu.</div>'; return; }
  if(window.__qtDaNap){ dhTrangVe(); return; }
  $('main').innerHTML='<div class="ptitle">Đơn hàng</div><div class="pdesc">Đang tải…</div>';
  taiManh('QuyTrinh',function(ok,msg){
    if(tabHienTai!=='dh')return;
    if(ok&&window.__qtDaNap){ dhTrangVe(); return; }
    $('main').innerHTML='<div class="ptitle">Đơn hàng</div><div class="alert a-bd">'+esc(msg||'Không tải được.')+' <button class="btn sm" type="button" onclick="vDH()">Thử lại</button></div>';
  });
}
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
