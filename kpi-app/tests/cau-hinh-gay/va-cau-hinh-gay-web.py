# -*- coding: utf-8 -*-
"""Vá Index.html – mục 42: tab "Cấu hình gậy" (08/11). Giao diện + bộ vẽ ở mảnh tải sau CauHinhGay.html
(chép từ tests/cau-hinh-gay/cau-hinh-gay-web.html, chèn logo Rhino xám cho dấu chìm PDF). Tab chỉ hiện khi ME.cg
(máy chủ tính theo mã NV: C056, C019, C077, C067). Chạy bằng exec() cuối tests/va-index.py. Kiểm thử: tests/cau-hinh-gay-web.js"""
import base64 as _b64_42, hashlib as _hl42, io as _io42
from PIL import Image as _Img42
_lg = _Img42.open(os.path.join(D, '..', 'anh', 'rhino', 'logo-rhino.png')).convert('RGBA')
_px = _lg.load()
for _x in range(_lg.size[0]):
    for _y in range(_lg.size[1]):
        _px[_x, _y] = (40, 52, 64, _px[_x, _y][3])
_lg = _lg.resize((260, 59), _Img42.LANCZOS); _bf = _io42.BytesIO(); _lg.save(_bf, 'PNG', optimize=True)
import re as _re42
_h42 = io.open(os.path.join(D, 'cau-hinh-gay', 'cau-hinh-gay-web.html'), encoding='utf-8').read()
_k42w = set(k for k, _x in _re42.findall(r"\['((?:ngon|chuoi|chung)\.[A-Za-z.]+)','[^']*','[^']*'(,'s')?\]", _h42[_h42.index('var CG_TRUONG = ['):_h42.index('function cgLay(')]))
_k42s = set(_json.loads(_re42.search(r'var CG_KHOA = (\{.*?\});', io.open(os.path.join(D, 'cau-hinh-gay', 'cau-hinh-gay.gs'), encoding='utf-8').read()).group(1)).keys())
assert _k42w == _k42s, ('mục 42: trường CG_TRUONG (web) khác CG_KHOA (máy chủ)', _k42w ^ _k42s)
_cg_src = io.open(os.path.join(D, 'cau-hinh-gay', 'cau-hinh-gay-web.html'), encoding='utf-8').read().replace('{{LOGO_XAM}}', _b64_42.b64encode(_bf.getvalue()).decode())
# 09/11: ảnh joint pin cắt từ bản vẽ gốc Rhino (đã bỏ kích thước, dựng đứng) – anh/pin/pin-*.png. L dài, T thò khỏi vai, D Ø lớn nhất (mm, theo bản vẽ)
_pin42 = {'radial': (85.20, 35.85, 9.80), 'uniloc': (80.80, 50.7, 9.71), 'r1618': (76.55, 27.20, 9.80), 'r1614': (79.6, 30.6, 9.70)}
_pd42 = {}
for _k, (_L, _T, _Dm) in _pin42.items():
    _f = os.path.join(D, '..', 'anh', 'pin', 'pin-%s.png' % _k); _im = _Img42.open(_f)
    _pd42[_k] = {'L': _L, 'T': _T, 'D': _Dm, 'w': _im.size[0], 'h': _im.size[1], 's': 'data:image/png;base64,' + _b64_42.b64encode(open(_f, 'rb').read()).decode()}
assert _cg_src.count('/*PIN*/{}/*PIN*/') == 1, 'mục 42: thiếu chỗ chèn ảnh pin'
_cg_src = _cg_src.replace('/*PIN*/{}/*PIN*/', _json.dumps(_pd42, separators=(',', ':')))
io.open(os.path.join(D, '..', 'CauHinhGay.html'), 'w', encoding='utf-8').write(_cg_src)
_dsf = os.path.join(D, '..', 'danh-sach-file.txt'); _dsl = io.open(_dsf, encoding='utf-8').read().split()
if 'CauHinhGay' not in _dsl: io.open(_dsf, 'w', encoding='utf-8').write('\n'.join(_dsl + ['CauHinhGay']) + '\n')

def _t42(cu, moi, dem=1):
    global s
    assert s.count(cu) == dem, ('mục 42: không thấy đúng %d chỗ' % dem, cu[:80], s.count(cu))
    s = s.replace(cu, moi)
_m42 = _re36.search(r'var MANH_VER=(\{[^}]*\});', s); assert _m42
_d42 = _json.loads(_m42.group(1)); _d42['CauHinhGay'] = _hl42.sha256(_cg_src.encode('utf-8')).hexdigest()[:16]
s = s.replace(_m42.group(0), 'var MANH_VER=' + _json.dumps(_d42) + ';', 1)
_t42("['qt','Quy trình sản xuất'],['dh','Đơn hàng'],['tk','Thống kê'],['mm','Máy móc'],['ts','Trọng số']", "['qt','Quy trình sản xuất'],['dh','Đơn hàng'],['tk','Thống kê'],['cgay','Cấu hình gậy'],['mm','Máy móc'],['ts','Trọng số']")
_t42("  ['Sản xuất',['duyetsl','nk','qt','dh','tk','kcs','dd','nenep','cccn']],", "  ['Sản xuất',['duyetsl','nk','qt','dh','cgay','tk','kcs','dd','nenep','cccn']],")
_t42("qt:vQT,dh:vDH,tk:vTK}[k])();", "qt:vQT,dh:vDH,tk:vTK,cgay:vCGay}[k])();")
_t42("  kyn:'<path", "  cgay:'<path d=\"M3 15.5L15.5 3l2 2L5 17.5z\"/><circle cx=\"18\" cy=\"18\" r=\"2.6\"/><path d=\"M6.5 13.5l2 2M10 10l2 2\"/>',\n  kyn:'<path")
_t42("  // 5) Yêu cầu sửa hồ sơ\n", """  // 42) Cấu hình gậy chờ Giám đốc sản xuất duyệt (08/11)
  if(ME.cg==='duyet'&&window.__cgCho&&__cgCho.ok&&__cgCho.n) v.push({muc:'vang',so:__cgCho.n,nho:'bản vẽ',t:'Cấu hình gậy chờ bạn duyệt',m:__cgCho.ds.slice(0,4).map(function(x){return '<b>'+esc(x.ma)+'</b> v'+esc(x.pb)+' ('+esc(x.nguoi)+', '+esc(x.luc)+')'}).join(' · '),fn:"go('cgay')",nut:'Xem & duyệt'});
  // 5) Yêu cầu sửa hồ sơ
""")
_t42("function vHomNay(){\n", """function vHomNay(){
  if(ME&&ME.cg==='duyet'&&window.__cgChoTai!==ME.tk){ window.__cgChoTai=ME.tk; call('demCauHinhGayCho',[],function(r){ window.__cgCho=r; if(tabHienTai==='homnay') vHomNay(); }); }
""")
# 09/11: chủ sở hữu C056 cũng duyệt – Tổng quan (gộp Việc hôm nay) tự nạp số bản chờ duyệt
_t42("  if (!window.__spMoiTai) { window.__spMoiTai = 1; call('demSanPhamMoi', [], function (r) { window.__spMoi = r; tqVeViec(); }); }",
     "  if (!window.__spMoiTai) { window.__spMoiTai = 1; call('demSanPhamMoi', [], function (r) { window.__spMoi = r; tqVeViec(); }); }\n  if (ME && ME.cg === 'duyet' && window.__cgChoTai !== ME.tk) { window.__cgChoTai = ME.tk; call('demCauHinhGayCho', [], function (r) { window.__cgCho = r; tqVeViec(); }); }")
_k42 = s.rfind('</body>')
s = s[:_k42] + """<script>
/* ===== 42. CẤU HÌNH GẬY (08/11) – tài liệu mật: tab chỉ hiện khi ME.cg (máy chủ kiểm lại ở mọi hàm) ===== */
(function(){ var g=window.dsTabHienCo; window.dsTabHienCo=function(){ var a=g.apply(this,arguments); return (window.ME&&ME.cg)?a:a.filter(function(t){return t[0]!=='cgay'}); }; })();
function vCGay(){
  if(!ME||!ME.cg){ $('main').innerHTML='<div class="alert a-wn">Tài khoản không xem được Cấu hình gậy.</div>'; return; }
  if(window.__cgDaNap){ cgVeTrang(); return; }
  $('main').innerHTML='<div class="ptitle">Cấu hình gậy</div><div class="pdesc">Đang tải…</div>';
  taiManh('CauHinhGay',function(ok,msg){
    if(tabHienTai!=='cgay')return;
    if(ok&&window.__cgDaNap){ cgVeTrang(); return; }
    $('main').innerHTML='<div class="ptitle">Cấu hình gậy</div><div class="alert a-bd">'+esc(msg||'Không tải được.')+' <button class="btn sm" type="button" onclick="vCGay()">Thử lại</button></div>';
  });
}
</script>
""" + s[_k42:]
