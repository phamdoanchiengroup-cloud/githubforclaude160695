# -*- coding: utf-8 -*-
"""Vá Index.html – mục 50: trang Bán hàng nhập đơn (16/11 khuya). Giao diện ở mảnh tải sau DonBan.html
(chép từ tests/don-ban/don-ban-web.html). Vai trò BH chỉ thấy tab "Đơn hàng của tôi"; người duyệt (ME.dbDuyet: C019 / C056 / C067
+ chủ sở hữu) thấy tab "Đơn bán hàng" + việc chờ duyệt ở Việc hôm nay / Tổng quan. Chạy bằng exec() cuối tests/va-index.py. Kiểm thử: tests/don-ban-web.js"""
import hashlib as _hl50
_db_src = io.open(os.path.join(D, 'don-ban', 'don-ban-web.html'), encoding='utf-8').read()
io.open(os.path.join(D, '..', 'DonBan.html'), 'w', encoding='utf-8').write(_db_src)
_dsf50 = os.path.join(D, '..', 'danh-sach-file.txt'); _dsl50 = io.open(_dsf50, encoding='utf-8').read().split()
if 'DonBan' not in _dsl50: io.open(_dsf50, 'w', encoding='utf-8').write('\n'.join(_dsl50 + ['DonBan']) + '\n')

def _t50(cu, moi, dem=1):
    global s
    assert s.count(cu) == dem, ('mục 50: không thấy đúng %d chỗ' % dem, cu[:80], s.count(cu))
    s = s.replace(cu, moi)
_m50 = _re36.search(r'var MANH_VER=(\{[^}]*\});', s); assert _m50
_d50 = _json.loads(_m50.group(1)); _d50['DonBan'] = _hl50.sha256(_db_src.encode('utf-8')).hexdigest()[:16]
s = s.replace(_m50.group(0), 'var MANH_VER=' + _json.dumps(_d50) + ';', 1)
# vai trò BH: 1 tab, thanh dưới điện thoại 1 nút, tên vai trò
_t50("  NHOM:[['com','Cơm trưa']],", "  NHOM:[['com','Cơm trưa']],\n  BH:[['bh','Đơn hàng của tôi']],   /* 16/11 khuya: Bán hàng chỉ thấy trang nhập đơn */")
_t50("  NHOM:['com'],", "  NHOM:['com'],\n  BH:['bh'],")
_t50("NHOM:'NHÓM BÁO CƠM'}[ME.vaiTroGoc||ME.vaiTro]", "NHOM:'NHÓM BÁO CƠM',BH:'BÁN HÀNG'}[ME.vaiTroGoc||ME.vaiTro]")
_t50("NHOM:'Nhóm báo cơm'}[vt]||vt", "NHOM:'Nhóm báo cơm',BH:'Bán hàng'}[vt]||vt")
_t50("var vt={ADMIN:'Ban điều hành',TP:'Trưởng phòng',PP:'Phó phòng',HR:'Nhân sự',QC:'Kiểm soát CL',CN:'Công nhân',BEP:'Bếp ăn',TL:'Trợ lý BĐH',NV:'Nhân viên BP',TBP:'Trưởng BP',NHOM:'Nhóm báo cơm'};",
     "var vt={ADMIN:'Ban điều hành',TP:'Trưởng phòng',PP:'Phó phòng',HR:'Nhân sự',QC:'Kiểm soát CL',CN:'Công nhân',BEP:'Bếp ăn',TL:'Trợ lý BĐH',NV:'Nhân viên BP',TBP:'Trưởng BP',NHOM:'Nhóm báo cơm',BH:'Bán hàng'};")
# người duyệt (ban điều hành): tab "Đơn bán hàng" ngay sau Đơn hàng – chỉ hiện khi ME.dbDuyet
_t50("['dh','Đơn hàng'],['tk','Thống kê']", "['dh','Đơn hàng'],['bh','Đơn bán hàng'],['tk','Thống kê']")
_t50("  ['Sản xuất',['dh','duyetsl',", "  ['Sản xuất',['dh','bh','duyetsl',")
_t50("cgay:vCGay}[k])();", "cgay:vCGay,bh:vBH}[k])();")
_t50("  kyn:'<path", "  bh:'<path d=\"M4 5h16v14H4z\"/><path d=\"M8 9h8M8 13h5\"/><path d=\"M15.5 15.5l2 2 3-3\"/>',\n  kyn:'<path")
_t50("  // 5) Yêu cầu sửa hồ sơ\n", """  // 50) Đơn Bán hàng chờ duyệt (16/11 khuya)
  if(ME.dbDuyet&&window.__dbCho&&__dbCho.ok&&__dbCho.n) v.push({muc:'vang',so:__dbCho.n,nho:'đơn',t:'Đơn mới của Bán hàng chờ bạn duyệt',m:__dbCho.ds.slice(0,4).map(function(x){return '<b>'+esc(x.ma)+'</b> '+esc(x.kenh)+' ('+esc(x.ai)+', '+x.n+' mã)'}).join(' · '),fn:"go('bh')",nut:'Xem & duyệt'});
  // 5) Yêu cầu sửa hồ sơ
""")
_t50("function vHomNay(){\n", """function vHomNay(){
  if(ME&&ME.dbDuyet&&window.__dbChoTai!==ME.tk){ window.__dbChoTai=ME.tk; call('demDonBanCho',[],function(r){ window.__dbCho=r; if(tabHienTai==='homnay') vHomNay(); }); }
""")
_t50("  if (ME && ME.cg === 'duyet' && window.__cgChoTai !== ME.tk) { window.__cgChoTai = ME.tk; call('demCauHinhGayCho', [], function (r) { window.__cgCho = r; tqVeViec(); }); }",
     "  if (ME && ME.cg === 'duyet' && window.__cgChoTai !== ME.tk) { window.__cgChoTai = ME.tk; call('demCauHinhGayCho', [], function (r) { window.__cgCho = r; tqVeViec(); }); }\n  if (ME && ME.dbDuyet && window.__dbChoTai !== ME.tk) { window.__dbChoTai = ME.tk; call('demDonBanCho', [], function (r) { window.__dbCho = r; tqVeViec(); }); }")
_k50 = s.rfind('</body>')
s = s[:_k50] + """<script>
/* ===== 50. ĐƠN BÁN HÀNG (16/11 khuya) – Bán hàng nhập đơn, C019 / C056 / C067 duyệt. Máy chủ kiểm lại ở mọi hàm ===== */
(function(){ var g=window.dsTabHienCo; window.dsTabHienCo=function(){ var a=g.apply(this,arguments); return (window.ME&&(ME.vaiTro==='BH'||ME.dbDuyet))?a:a.filter(function(t){return t[0]!=='bh'}); }; })();
function vBH(){
  if(!ME||!(ME.vaiTro==='BH'||ME.dbDuyet)){ $('main').innerHTML='<div class="alert a-wn">Tài khoản không dùng được trang này.</div>'; return; }
  if(window.__bnDaNap){ bnVe(); return; }
  $('main').innerHTML='<div class="ptitle">Đơn hàng</div><div class="pdesc">Đang tải…</div>';
  taiManh('DonBan',function(ok,msg){
    if(tabHienTai!=='bh')return;
    if(ok&&window.__bnDaNap){ bnVe(); return; }
    $('main').innerHTML='<div class="ptitle">Đơn hàng</div><div class="alert a-bd">'+esc(msg||'Không tải được.')+' <button class="btn sm" type="button" onclick="vBH()">Thử lại</button></div>';
  });
}
</script>
""" + s[_k50:]
