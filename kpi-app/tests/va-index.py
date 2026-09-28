# -*- coding: utf-8 -*-
"""Vá Index.html (bản gốc kpi-app/goc/Index.html) -> kpi-app/Index.html."""
import io, os, sys

D = os.path.dirname(__file__)
s = io.open(os.path.join(D, '..', 'goc', 'Index.html'), encoding='utf-8').read()


def R(old, new, n=1):
    global s
    c = s.count(old)
    if c != n:
        sys.exit('KHÔNG KHỚP (%d lần, cần %d):\n%s' % (c, n, old[:200]))
    s = s.replace(old, new)


# 1) Đăng nhập xong: nếu phải đổi mật khẩu lần đầu thì mở hộp đổi mật khẩu bắt buộc
R("""    TOKEN=r.token; ME=r.me;
    try{sessionStorage.setItem('kpi_token',TOKEN)}catch(e){}
    vaoHeThong();""", """    TOKEN=r.token; ME=r.me;
    try{sessionStorage.setItem('kpi_token',TOKEN)}catch(e){}
    if(ME.phaiDoiMK){batDoiMK();return}
    vaoHeThong();""")
R("""    $('gspin').classList.add('hide');
    if(!r.ok){lerr(r.msg);return}
    D=r; ME=r.me; inApp=true;""", """    $('gspin').classList.add('hide');
    if(!r.ok){
      if(r.phaiDoiMK){ME=r.me;batDoiMK();return}
      if(r.hetHan){try{sessionStorage.removeItem('kpi_token')}catch(e){}}
      lerr(r.msg);return}
    D=r; ME=r.me; inApp=true;""")
R("""    toast(r.msg,true);
    var b=$('mkbox'); if(b)b.remove();""", """    toast(r.msg,true);
    var b=$('mkbox'); if(b)b.remove();
    if(__batDoiMK){__batDoiMK=false; vaoHeThong();}""")
R("""  if(moi!==lai){bao('Hai lần nhập mật khẩu không khớp');return}""", """  if(moi!==lai){bao('Hai lần nhập mật khẩu không khớp');return}
  if(moi===cu){bao('Mật khẩu mới phải khác mật khẩu hiện tại');return}""")
R("""/* ===== ĐỔI MẬT KHẨU TRONG ỨNG DỤNG ===== */""", """/* ===== BẮT BUỘC ĐỔI MẬT KHẨU LẦN ĐẦU =====
   Tài khoản mới / vừa được cấp lại mật khẩu phải đặt mật khẩu riêng trước khi vào hệ thống.
   Máy chủ cũng chặn mọi chức năng khác cho tới khi đổi xong. */
var __batDoiMK=false;
function batDoiMK(){
  __batDoiMK=true;
  $('gspin').classList.add('hide');
  moDoiMK();
  var box=$('mkbox'); if(!box)return;
  var h=box.querySelector('h3');
  if(h){
    h.textContent='Đặt mật khẩu mới';
    var n=document.createElement('div'); n.className='note'; n.style.marginBottom='12px';
    n.innerHTML='Chào <b>'+esc(ME&&ME.ten||'')+'</b>. Vì an toàn, bạn cần đặt mật khẩu riêng trước khi vào hệ thống. '+
      'Không dùng 123456, ngày sinh hay mã nhân viên.';
    h.parentNode.insertBefore(n,h.nextSibling);
  }
  var huy=box.querySelector('.acts .btn:not(.pri)');
  if(huy){huy.textContent='Thoát'; huy.setAttribute('onclick','thoatBatDoiMK()');}
}
function thoatBatDoiMK(){
  try{google.script.run.dangXuat(TOKEN)}catch(e){}
  try{sessionStorage.removeItem('kpi_token')}catch(e){}
  location.reload();
}

/* ===== ĐỔI MẬT KHẨU TRONG ỨNG DỤNG ===== */""")

# 2) Cấp lại mật khẩu: máy chủ tạo mật khẩu tạm ngẫu nhiên -> hiện rõ để chủ sở hữu báo lại
R("""  if(!confirm('Cấp lại mật khẩu cho "'+tk+'" về 123456?'))return;
  call('capLaiMatKhau',[tk],function(r){toast(r.msg,r.ok); if(r.ok)vPQ()});""",
  """  if(!confirm('Cấp mật khẩu tạm mới cho "'+tk+'"?\\nNgười này sẽ phải đổi mật khẩu ngay khi đăng nhập.'))return;
  call('capLaiMatKhau',[tk],function(r){
    if(!r.ok){toast(r.msg);return}
    alert(r.msg);   // hiện đủ lâu để chép mật khẩu tạm
    vPQ();
  });""")

# 3) Không nhắc điểm danh vào ngày lễ / ngày xưởng được miễn
R("""    var canNhacDD=(!laCN_hn && ME.xuong && !daDDHomNay);""",
  """    var canNhacDD=(!laCN_hn && ME.xuong && !daDDHomNay && !laNgayLeKH(homNay, ME.xuong));""")
R("""function choSL(){return (D.choDuyet||[]).length}""", """function choSL(){return (D.choDuyet||[]).length}
/* Ngày lễ / ngày xưởng được miễn điểm danh (máy chủ gửi dạng 'yyyy-MM-dd|MaXuong', '*' = cả nhà máy) */
function laNgayLeKH(ng, mx){
  var s=(D&&D.ngayLe)||[];
  return s.indexOf(ng+'|*')>=0 || (!!mx && s.indexOf(ng+'|'+mx)>=0);
}""")

# 4) Trạng thái bảng KPI & hướng dẫn: cách chốt tháng mới
R("""    else tt.innerHTML='✓ Số liệu '+(r.kieu==='thang'?'cập nhật đến 9h sáng nay':'tổng hợp từ các tháng đã chốt')+'.';""",
  """    else tt.innerHTML='✓ Số liệu '+(r.kieu==='thang'?'đã chốt chính thức':'tổng hợp từ các tháng đã chốt')+'.';""")
R("""        '<li>Snapshot tự động 9h mỗi ngày.</li>'+
        '<li>Chốt tháng 23h ngày cuối tháng.</li>'+
        '<li>Tháng đã qua: đọc snapshot, không tính lại.</li></ul>'],""",
  """        '<li>Snapshot tạm tự động 9h mỗi ngày.</li>'+
        '<li>Tháng trước được chốt chính thức lúc 23h ngày làm việc thứ 3 của tháng sau (để kịp duyệt sản lượng cuối tháng).</li>'+
        '<li>Tháng đã qua mà chưa chốt chính thức: vẫn tính trực tiếp. Đã chốt: đọc bản chốt, không tính lại.</li>'+
        '<li>Ngày lễ (sheet NgayLe) không tính quên điểm danh, không tính vào hạn duyệt / hạn nhập.</li></ul>'],""")

# 4b) Font tiêu đề cho màn đăng nhập (Cormorant Garamond, có dấu tiếng Việt)
R("""<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">""",
  """<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">""")

# 5) Màn đăng nhập "Bàn bi-a" (nguồn chung: tests/dang-nhap-bi-a.html, cũng dùng cho bản xem thử)
bb = io.open(os.path.join(D, 'dang-nhap-bi-a.html'), encoding='utf-8').read()
import base64
bb = bb.replace('{{ANH_NGON}}', 'data:image/png;base64,' + base64.b64encode(open(os.path.join(D, '..', 'anh', 'ngon-carbon.png'), 'rb').read()).decode())
BB_CSS = bb.split('<!--CSS-->')[1].split('<!--HTML-->')[0].strip('\n')
BB_HTML = bb.split('<!--HTML-->')[1].split('<!--JS-->')[0].strip('\n')
BB_JS = bb.split('<!--JS-->')[1].strip('\n')


def VUNG(dau, cuoi, new):
    global s
    i = s.find(dau)
    j = s.find(cuoi, i + 1)
    if i < 0 or j < 0 or s.count(dau) != 1:
        sys.exit('KHÔNG THẤY VÙNG: ' + dau[:80])
    s = s[:i] + new + s[j:]


VUNG('/* GATE */\n', '.spin{width:26px', BB_CSS + '\n')
VUNG('<div id="gate">\n', '<div id="app">', BB_HTML + '\n\n')
R("""/* ===== ĐĂNG NHẬP ===== */
var TOKEN=null;""", BB_JS + """

/* ===== ĐĂNG NHẬP ===== */
var TOKEN=null;""")
# Đăng nhập sai -> bi cái rơi lỗ; đúng -> phá dàn bi rồi mới vào
R("""    $('gspin').classList.add('hide');
    if(!r.ok){lerr(r.msg);return}
    TOKEN=r.token; ME=r.me;
    try{sessionStorage.setItem('kpi_token',TOKEN)}catch(e){}
    if(ME.phaiDoiMK){batDoiMK();return}
    vaoHeThong();""", """    $('gspin').classList.add('hide');
    if(!r.ok){bbTruot();lerr(r.msg);return}
    TOKEN=r.token; ME=r.me;
    try{sessionStorage.setItem('kpi_token',TOKEN)}catch(e){}
    $('btnLogin').disabled=true;
    bbTrung(function(){
      $('btnLogin').disabled=false;
      if(ME.phaiDoiMK){batDoiMK();return}
      vaoHeThong();
    });""")
R("""  $('gspin').classList.remove('hide');
  $('lerr').classList.add('hide');
  google.script.run.withSuccessHandler(function(r){""", """  $('gspin').classList.remove('hide');
  $('lerr').classList.add('hide');
  try{bbCho()}catch(e){}              // kéo cơ, ngắm trong lúc chờ máy chủ
  google.script.run.withSuccessHandler(function(r){""")
R("""    lerr('Không kết nối được: '+(e.message||e));
  }).dangNhap(tk,mk);""", """    try{bbTha()}catch(x){}
    lerr('Không kết nối được: '+(e.message||e));
  }).dangNhap(tk,mk);""")
R("""function lerr(m){var e=$('lerr');e.textContent=m;e.classList.remove('hide')}""",
  """function lerr(m){var e=$('lerr');e.textContent=m;e.classList.remove('hide');
  var g=$('gate'); if(g&&g.classList.contains('bb-vao')){g.classList.remove('bb-vao');try{bbXep();bbChu('Đăng nhập')}catch(x){}}}""")
R("""  else{setTimeout(function(){var e=$('l_tk'); if(e)e.focus()},300)}""",
  """  else{setTimeout(function(){var e=$('l_tk'); if(e)e.focus()},300)}
  try{bbKhoiDong()}catch(e){}""")

# =====================================================================
# 6) GIAO DIỆN BÊN TRONG + CHỐNG TREO (bản 29/09/2026) — nguồn: tests/giao-dien-moi.html
gd = io.open(os.path.join(D, 'giao-dien-moi.html'), encoding='utf-8').read()
GD_CSS = gd.split('<!--CSS-->')[1].split('<!--JS-->')[0].strip('\n')
GD_JS = gd.split('<!--JS-->')[1].strip('\n')


def RA(old, new):
    """Thay mọi chỗ (phải có ít nhất 1)."""
    global s
    if s.count(old) < 1:
        sys.exit('KHÔNG THẤY: ' + old)
    s = s.replace(old, new)


# 6a) Bảng màu obsidian · trắng ngà · vàng đồng (cùng tông màn đăng nhập)
R("""  --bg:#0e1418; --panel:#151d23; --panel2:#1b262e; --line:#26343d;
  --ink:#e8eef2; --ink2:#8fa3b0; --ink3:#5d7280;
  --cyan:#22d3c5; --cyan-d:#0e8f86;
  --amber:#f2a93b; --red:#f2555a; --green:#4ade80;""", """  --bg:#0c0d0f; --panel:#141619; --panel2:#1b1e22; --line:#2a2d33;
  --ink:#f1ede4; --ink2:#a8a49b; --ink3:#77746d;
  --cyan:#c9a36a; --cyan-d:#8a6a3a;           /* tên biến giữ nguyên để khỏi sửa khắp nơi; màu là vàng đồng */
  --amber:#e3a33e; --red:#e5484d; --green:#5cc98a;""")
for a, b in [('34,211,197', '201,163,106'), ('#22d3c5', '#c9a36a'), ('14,20,24', '12,13,15'),
             ('21,29,35', '20,22,25'), ('38,52,61', '42,45,51'), ('#131b21', '#111316'), ('#0b6f68', '#5e4726'),
             ('#124b52', '#2a2219'), ('#06231f', '#1b1408'), ('#16242a', '#1f1c17'), ('#152229', '#1a1815'),
             ('143,163,176', '168,164,155')]:
    RA(a, b)
R("</style>\n</head>", GD_CSS + "\n</style>\n</head>")

# 6b) Bỏ nền động (aurora + hạt canvas): tốn CPU/GPU, làm cuộn và gõ phím bị giật trên máy yếu
R("""<div id="bgfx" aria-hidden="true"><div class="aurora a1"></div><div class="aurora a2"></div><div class="aurora a3"></div><div class="aurora a4"></div><canvas></canvas></div>""",
  """<div id="bgfx" aria-hidden="true"></div>""")

# 6c) Đầu trang: nút mở menu (điện thoại) + nút "?" mở Hướng dẫn
R("""  <header>
    <div class="hl">""", """  <header>
    <div class="hl">
      <button class="btn hnut" onclick="moNav(!document.body.classList.contains('mo-nav'))" aria-label="Menu"><svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>""")
R("""      <button class="btn sm" onclick="moDoiMK()">Đổi mật khẩu</button>""",
  """      <button class="btn sm hhelp" onclick="go('hd')" title="Hướng dẫn sử dụng">?</button>
      <button class="btn sm" onclick="moDoiMK()">Đổi mật khẩu</button>""")

# 6d) Đang xử lý: thanh mảnh trên cùng, không che màn hình; đếm số lời gọi đang chạy
R("""function busy(b){$('busy').classList.toggle('on',b)}""",
  """var __soDangChay=0;
function busy(b){__soDangChay=Math.max(0,__soDangChay+(b?1:-1));$('busy').classList.toggle('on',__soDangChay>0)}""")

# 6e) Gọi máy chủ: khóa nút vừa bấm (chống bấm 2 lần), bỏ kết quả đọc nếu đã chuyển tab,
#     ghi nhớ phần dữ liệu máy chủ báo vừa đổi để reload() chỉ tải lại phần đó
R("""/* Bọc mọi lời gọi máy chủ: tự bắt phiên hết hạn */
function call(fn,args,cb){
  busy(true);
  var daXong=false;
  var ketThuc=function(){ if(!daXong){daXong=true;busy(false);} };
  try{
    var r=google.script.run.withSuccessHandler(function(res){
      ketThuc();
      if(res&&res.hetHan){hetHan();return}
      try{ cb(res); } catch(err){ toast('Lỗi xử lý: '+(err.message||err)); }""", """/* Bọc mọi lời gọi máy chủ: tự bắt phiên hết hạn */
var __phanDoi=null;   // phần dữ liệu lượt ghi vừa rồi làm thay đổi (máy chủ báo) -> reload() chỉ tải lại phần đó
function laHamDoc_(fn){return /^(lay|thongKe|phanTich|hoSo|kiemTra|siSo|nap)/.test(fn)}
function call(fn,args,cb){
  busy(true);
  var daXong=false, tab0=tabHienTai, doc=laHamDoc_(fn);
  var nut=document.activeElement;
  if(!(nut && nut.tagName==='BUTTON' && !nut.disabled && !doc)) nut=null;
  if(nut){nut.disabled=true;nut.classList.add('dang-chay');}
  var ketThuc=function(){ if(!daXong){daXong=true;busy(false);if(nut){nut.disabled=false;nut.classList.remove('dang-chay');}} };
  try{
    var r=google.script.run.withSuccessHandler(function(res){
      ketThuc();
      if(res&&res.hetHan){hetHan();return}
      if(doc && tabHienTai!==tab0) return;          // đã sang tab khác: bỏ kết quả cũ, không vẽ đè
      __phanDoi = (res && res.phanDoi) || null;
      try{ cb(res); } catch(err){ toast('Lỗi xử lý: '+(err.message||err)); }
      __phanDoi = null;""")

# 6f) Tải lại sau khi lưu: chỉ xin phần vừa đổi (napPhan) rồi ghép vào D
R("""function reload(cb){
  busy(true);
  google.script.run.withSuccessHandler(function(r){
    busy(false);
    if(r.hetHan){hetHan();return}
    if(r.ok){D=r; if(cb)cb();}
  }).withFailureHandler(function(e){busy(false);toast('Lỗi: '+(e.message||e))}).napDuLieu(TOKEN);
}""", """function reload(cb){
  var phan=__phanDoi; __phanDoi=null;
  if(phan==='tat') phan=null;
  if(phan && !phan.length) phan=['-'];               // lượt ghi không đụng dữ liệu hiển thị: chỉ làm mới "me"
  var tab0=tabHienTai;
  busy(true);
  var g=google.script.run.withSuccessHandler(function(r){
    busy(false);
    if(r.hetHan){hetHan();return}
    if(r.ok){
      if(phan){ for(var k in r){ if(k!=='ok'&&k!=='phan') D[k]=r[k]; } }
      else D=r;
      capNhatDem();
      if(tabHienTai!==tab0) return;                  // người dùng đã sang tab khác: không vẽ đè
      if(cb)cb();
    }
  }).withFailureHandler(function(e){busy(false);toast('Lỗi: '+(e.message||e))});
  if(phan) g.napPhan(TOKEN,phan); else g.napDuLieu(TOKEN);
}""")

# 6g) Điều hướng chia nhóm + tab "Việc hôm nay" (mặc định cho ban điều hành / trưởng phòng)
R("""  ADMIN:[['hd','📖 Hướng dẫn'],['dash','Tổng quan'],""", """  ADMIN:[['hd','📖 Hướng dẫn'],['homnay','Việc hôm nay'],['dash','Tổng quan'],""")
R("""  TP:[['hd','📖 Hướng dẫn'],['dash','Tổng quan'],""", """  TP:[['hd','📖 Hướng dẫn'],['homnay','Việc hôm nay'],['dash','Tổng quan'],""")
VUNG("function buildNav(){", "function choSL(){", """function buildNav(){
  document.body.classList.toggle('ql', ME.vaiTro==='ADMIN'||ME.vaiTro==='TP');
  veNav();
  var ds=dsTabHienCo().filter(function(t){return t[0]!=='hd'});
  go((ds[0]||dsTabHienCo()[0])[0]);
}
""")
R("""function capNhatChamDX(){
  var nav=$('nav'); if(!nav)return;""", """function capNhatChamDX(){
  capNhatDem(); return;
  var nav=$('nav'); if(!nav)return;""")
R("""function capNhatChamSL(){
  var nav=$('nav');if(!nav)return;""", """function capNhatChamSL(){
  capNhatDem(); return;
  var nav=$('nav');if(!nav)return;""")
R("""  if(!btn){
    var idx=(TABS[ME.vaiTro]||[]).findIndex(function(t){return t[0]===k});
    if(idx>=0){var nav=$('nav'); if(nav)btn=nav.children[idx];}
  }
  Array.prototype.forEach.call(document.querySelectorAll('nav button'),function(b){b.classList.remove('on')});
  if(btn)btn.classList.add('on');
  window.scrollTo(0,0);
  tabHienTai=k;
  ({hd:vHuongDan,""", """  Array.prototype.forEach.call(document.querySelectorAll('#nav button,#botbar button'),function(b){
    b.classList.toggle('on', b.getAttribute('data-k')===k);
  });
  moNav(false);
  window.scrollTo(0,0);
  tabHienTai=k;
  ({homnay:vHomNay,hd:vHuongDan,""")
R("""cccn:vCCCaNhan}[k])();
  capNhatDucBar();""", """cccn:vCCCaNhan}[k])();
  capNhatDucBar();
  capNhatDem();""")
# Nhắc định mức (trưởng phòng) nạp xong -> vẽ lại Việc hôm nay + số đếm
R("""    var mb2=$('minibar'); if(!mb2)return;
    ve((miniHS||'')+manhDM(_dmChuYCache.length));""", """    if(tabHienTai==='homnay')vHomNay();
    capNhatDem();
    var mb2=$('minibar'); if(!mb2)return;
    ve((miniHS||'')+manhDM(_dmChuYCache.length));""")

# 6h) Tra cứu nhanh bằng chỉ mục (các hàm này được gọi hàng chục nghìn lần khi vẽ Tổng quan / KPI)
R("""function dm(cd){var r=D.dinhmuc.filter(function(x){return x.MaCD===cd})[0];return r?Number(r.DinhMucGio):0}""",
  """function dm(cd){var r=ix_('dm',D.dinhmuc,function(x){return x.MaCD})[cd];return r?Number(r.DinhMucGio):0}""")
R("""  var cc=D.chamcong||[];
  for(var i=0;i<cc.length;i++){
    if(String(cc[i].MaNV)===String(maNV) && ngayChuan_(cc[i].Ngay)===ngayYMD) return gioCoMatFE(khTuBanGhiFE_(cc[i]));
  }
  return 8; // không có bản ghi -> đi làm đủ""", """  var r=ix_('cc',D.chamcong,function(x){return String(x.MaNV)+'|'+ngayChuan_(x.Ngay)})[String(maNV)+'|'+ngayYMD];
  if(r) return gioCoMatFE(khTuBanGhiFE_(r));
  return 8; // không có bản ghi -> đi làm đủ""")
R("""function dvt(cd){var r=D.dinhmuc.filter(function(x){return x.MaCD===cd})[0];return r&&r.DonViTinh?r.DonViTinh:'cái/giờ'}
function nv(m){var r=D.nhansu.filter(function(x){return x.MaNV===m})[0];return r?r:{HoTen:m,MaXuong:''}}
function cd(m){var r=D.congdoan.filter(function(x){return x.MaCD===m})[0];return r?r:{TenCD:m,MaXuong:'',CachCham:'CN'}}""",
  """function dvt(cd){var r=ix_('dm',D.dinhmuc,function(x){return x.MaCD})[cd];return r&&r.DonViTinh?r.DonViTinh:'cái/giờ'}
function nv(m){var r=ix_('nv',D.nhansu,function(x){return x.MaNV})[m];return r?r:{HoTen:m,MaXuong:''}}
function cd(m){var r=ix_('cd',D.congdoan,function(x){return x.MaCD})[m];return r?r:{TenCD:m,MaXuong:'',CachCham:'CN'}}""")
R("""function ngLoi(r){
  return D.kcs.filter(function(k){
    return ngay(k.Ngay)===ngay(r.Ngay)&&k.MaNV===r.MaNV&&k.MaCD===r.MaCD
  }).reduce(function(a,k){return a+Number(k.SoLuongKhongDat||0)},0);
}""", """function ngLoi(r){
  return (ix_('kcs',D.kcs,function(k){return ngay(k.Ngay)+'|'+k.MaNV+'|'+k.MaCD},true)[ngay(r.Ngay)+'|'+r.MaNV+'|'+r.MaCD]||[])
    .reduce(function(a,k){return a+Number(k.SoLuongKhongDat||0)},0);
}""")
R("""  var rows=D.nhatky.filter(function(r){return r.MaNV===maNV && String(r.TrangThai).trim()==='Đã chốt'});""",
  """  var rows=(ix_('nkNV',D.nhatky,function(r){return r.MaNV},true)[maNV]||[]).filter(function(r){return String(r.TrangThai).trim()==='Đã chốt'});""")
R("""function pbTen(m){var p=D.phongban.filter(function(x){return x.MaXuong===m})[0];return p?p.TenXuong:m}""",
  """function pbTen(m){var p=ix_('pb',D.phongban,function(x){return x.MaXuong})[m];return p?p.TenXuong:m}""")

R("""/* ===== ĐĂNG NHẬP ===== */
var TOKEN=null;""", GD_JS + """

/* ===== ĐĂNG NHẬP ===== */
var TOKEN=null;""")

io.open(os.path.join(D, '..', 'Index.html'), 'w', encoding='utf-8').write(s)
print('OK Index.html')
