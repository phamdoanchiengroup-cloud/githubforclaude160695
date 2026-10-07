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
  --cyan:#2fd3c6; --cyan-d:#138f87; --acc-rgb:47,211,198;
  --amber:#e3a33e; --red:#e5484d; --green:#5cc98a;""")
for a, b in [('34,211,197', 'var(--acc-rgb)'), ('#22d3c5', 'var(--cyan)'), ('14,20,24', '12,13,15'),
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

# 6i) Hai bộ màu (tối dịu / trắng ngà): bỏ các màu viết cứng cho nền tối
for a, b in [('#111316', 'var(--panel2)'), ('#1f1c17', 'var(--panel2)'), ('#1a1815', 'var(--panel2)'),
             ('style="color:#4ade80"', 'style="color:var(--green)"'), ('style="color:#f2a93b"', 'style="color:var(--amber)"'),
             ('color:#3a2600', 'color:var(--panel)'),
             ('.btn:hover{border-color:var(--ink3);background:#22303a}', '.btn:hover{border-color:var(--ink3);background:var(--hover)}'),
             ('.btn.pri:hover{background:#3ee0d3;border-color:#3ee0d3}', '.btn.pri:hover{background:var(--cyan);border-color:var(--cyan);filter:brightness(1.08)}'),
             ('linear-gradient(135deg,var(--cyan),#38bdf8)', 'linear-gradient(135deg,var(--cyan-d),var(--cyan))'),
             ('.cn-note.i b{color:#38bdf8}', '.cn-note.i b{color:var(--cyan)}'), ('rgba(56,189,248,', 'rgba(var(--acc-rgb),')]:
    RA(a, b)
R("""function hexOf(v){return v>=90?'var(--cyan)':(v>=80?'#f2a93b':'#f2555a')}""",
  """function hexOf(v){var s=document.documentElement.getAttribute('data-gd')==='sang';
  return v>=90?(s?'#0b7a73':'#2fd3c6'):(v>=80?(s?'#a86400':'#f0b04e'):(s?'#c0302b':'#f47272'))}""")
R("""function mauKPI(v){ return v>=90?'#4ade80':(v>=80?'var(--cyan)':(v>=70?'#f2a93b':'#f2555a')); }""",
  """function mauKPI(v){ var s=document.documentElement.getAttribute('data-gd')==='sang';
  return v>=90?(s?'#1f7a48':'#66d49a'):(v>=80?(s?'#0b7a73':'#2fd3c6'):(v>=70?(s?'#a86400':'#f0b04e'):(s?'#c0302b':'#f47272'))); }""")
R("""      <button class="btn sm hhelp" onclick="go('hd')" title="Hướng dẫn sử dụng">?</button>""",
  """      <button class="btn sm hgd" id="btnGD" onclick="gdDoi()" title="Đổi nền sáng / tối"></button>
      <button class="btn sm hhelp" onclick="go('hd')" title="Hướng dẫn sử dụng">?</button>""")
# 6j) Hiệu ứng: chuyển tab, duyệt, thông báo, bảng xếp hạng (mã hiệu ứng nằm trong giao-dien-moi.html)
R("""cccn:vCCCaNhan}[k])();
  capNhatDucBar();
  capNhatDem();""", """cccn:vCCCaNhan}[k])();
  capNhatDucBar();
  capNhatDem();
  try{sauKhiVeTab(arguments[2])}catch(e){}""")
R("""      if(doc && tabHienTai!==tab0) return;          // đã sang tab khác: bỏ kết quả cũ, không vẽ đè
      __phanDoi = (res && res.phanDoi) || null;
      try{ cb(res); } catch(err){ toast('Lỗi xử lý: '+(err.message||err)); }
      __phanDoi = null;""", """      if(doc && tabHienTai!==tab0) return;          // đã sang tab khác: bỏ kết quả cũ, không vẽ đè
      var chay=function(){
        __phanDoi = (res && res.phanDoi) || null;
        try{ cb(res); } catch(err){ toast('Lỗi xử lý: '+(err.message||err)); }
        __phanDoi = null;
      };
      // Duyệt xong: vẽ dấu ✓ và cho dòng trượt ra rồi mới cập nhật (0,3 giây)
      var coHU=false;
      try{ coHU = !!(res && res.ok && /^(duyet|banDieuHanhSuaDinhMuc)/.test(fn) && hieuUngDuyet(fn,args,nutGoc)); }catch(e){}
      if(coHU) setTimeout(chay,300); else chay();
      // Lưu thành công (không phải duyệt, không phải đọc): tia lửa nhỏ tại nút
      try{ if(!coHU && !doc && res && res.ok) tiaLua(nutGoc); }catch(e){}""")
R("""  if(nut){nut.disabled=true;nut.classList.add('dang-chay');}""", """  var nutGoc=nut||window.__nutHU||null; window.__nutHU=null;
  if(nut){nut.disabled=true;nut.classList.add('dang-chay');}""")
R("""function toast(m,ok){
  var t=$('toast'); t.textContent=m; t.className='on '+(ok?'ok':'bd');
  setTimeout(function(){t.className=''},3400);
}""", """function toast(m,ok){
  var t=$('toast'); t.textContent=m; t.className=''; void t.offsetWidth; t.className='on '+(ok?'ok':'bd');
  clearTimeout(toast._h); toast._h=setTimeout(function(){t.className=''},3400);
  if(!ok){try{rungONhap()}catch(e){}}
}""")
R("""      var huy=o.hang===1?'🥇':o.hang===2?'🥈':o.hang===3?'🥉':String(o.hang);
      body+='<tr'+(laToi?""", """      var huy=o.hang<=3?'<span class="bi-so s'+o.hang+'" title="Hạng '+o.hang+'"><b>'+o.hang+'</b></span>':String(o.hang);
      body+='<tr'+(o.hang<=3?' class="gd-top"':'')+(laToi?""")

R("""/* ===== ĐĂNG NHẬP ===== */
var TOKEN=null;""", GD_JS + """

/* ===== ĐĂNG NHẬP ===== */
var TOKEN=null;""")


# 7) BÁO CÁO THÁNG (PDF) trên trang Bảng KPI — TP tải báo cáo xưởng mình, ban điều hành tải toàn nhà máy / xưởng bất kỳ
R("""  // KPI quản lý (TP xem xưởng mình; ADMIN xem toàn bộ) — đặt TRÊN bảng KPI công nhân
  if(ME.vaiTro==='ADMIN'||ME.vaiTro==='TP'){""", """  if(ME.vaiTro==='ADMIN'||ME.vaiTro==='TP') h+=khoiBaoCaoThang();
  // KPI quản lý (TP xem xưởng mình; ADMIN xem toàn bộ) — đặt TRÊN bảng KPI công nhân
  if(ME.vaiTro==='ADMIN'||ME.vaiTro==='TP'){""")
R("""/* Fallback: tải nội dung HTML thành file */""", """/* ===== BÁO CÁO THÁNG (PDF) ===== */
function khoiBaoCaoThang(){
  var d=new Date(), opt='';
  for(var i=0;i<13;i++){
    var t=new Date(d.getFullYear(), d.getMonth()-i, 1), ky=t.getFullYear()+'-'+('0'+(t.getMonth()+1)).slice(-2);
    opt+='<option value="'+ky+'"'+(i===1?' selected':'')+'>Tháng '+(t.getMonth()+1)+'/'+t.getFullYear()+(i===0?' (đang chạy – tạm tính)':'')+'</option>';
  }
  var xu='';
  if(ME.vaiTro==='ADMIN'){
    xu='<div><label>Phạm vi</label><select id="bc_xuong"><option value="">Toàn nhà máy (gửi ban lãnh đạo)</option>'+
      (D.phongban||[]).map(function(p){return '<option value="'+esc(p.MaXuong)+'">'+esc(p.TenXuong)+'</option>'}).join('')+'</select></div>';
  }
  return '<div class="card"><h3>Báo cáo tháng<span>'+(ME.vaiTro==='TP'?'báo cáo riêng xưởng của bạn':'PDF tổng hợp KPI, sản lượng, chuyên cần, vi phạm')+'</span></h3>'+
    '<div class="row r3" style="align-items:flex-end"><div><label>Tháng</label><select id="bc_ky">'+opt+'</select></div>'+xu+
    '<div style="display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap"><button class="btn pri" onclick="taiBaoCaoUI(\\'pdf\\')">Tải PDF</button>'+
    '<button class="btn" onclick="taiBaoCaoUI(\\'html\\')">Xem &amp; in</button></div></div>'+
    '<div class="note">Báo cáo tháng trước được tự tạo vào ngày làm việc thứ 3 (lúc chốt KPI), lưu trong Google Drive và gửi email cho người có tên trong sheet NguoiNhanBaoCao. Tổng hợp mất khoảng 10–40 giây.</div></div>';
}
function taiBaoCaoUI(dang){
  var ky=$('bc_ky').value, mx=$('bc_xuong')?$('bc_xuong').value:'';
  var th='tháng '+Number(ky.slice(5))+'/'+ky.slice(0,4);
  ltMo('dang-tong-hop-bao-cao','Đang tổng hợp báo cáo '+th+'…','Khoảng 10–40 giây – đừng tắt trang',true);
  call('layBaoCaoThang',[ky,mx,dang],function(r){
    if(!r||!r.ok){ltDong();toast((r&&r.msg)||'Không tạo được báo cáo');return}
    ltXong(dang==='html'?'Báo cáo đã sẵn sàng':'Đã tải báo cáo',dang==='html'?'Đang mở hộp thoại in…':r.ten);
    if(dang==='html'){
      var cu=document.getElementById('bc_frame'); if(cu) cu.parentNode.removeChild(cu);
      var ifr=document.createElement('iframe'); ifr.id='bc_frame';
      ifr.style.cssText='position:fixed;right:0;bottom:0;width:0;height:0;border:0';
      document.body.appendChild(ifr);
      var idoc=ifr.contentWindow.document;
      idoc.open(); idoc.write(r.html.replace('<style>','<style>@page{size:A4;margin:14mm 12mm}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}')); idoc.close();
      setTimeout(function(){
        try{ ifr.contentWindow.focus(); ifr.contentWindow.print(); toast('Đã mở hộp thoại in — chọn "Lưu thành PDF" hoặc máy in',true); }
        catch(e){ taiFileHTML(r.html,'Bao-cao-KPI-'+ky+'.html'); toast('Không in trực tiếp được — đã tải file HTML, mở rồi bấm Ctrl+P'); }
      },500);
      return;
    }
    var bin=atob(r.b64), u=new Uint8Array(bin.length);
    for(var i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i);
    var url=URL.createObjectURL(new Blob([u],{type:'application/pdf'})), a=document.createElement('a');
    a.href=url; a.download=r.ten; document.body.appendChild(a); a.click();
    setTimeout(function(){ document.body.removeChild(a); URL.revokeObjectURL(url); },1000);
  });
}

/* Fallback: tải nội dung HTML thành file */""")


# 8) HOẠT ẢNH LOTTIE (4 mẫu đã duyệt 06/10): chờ báo cáo, duyệt xong, đã duyệt hết, mất kết nối.
#    Thư viện lottie-web tải từ cdnjs khi cần (như thư viện Excel); không tải được thì dùng hiệu ứng cũ.
import json as _json
LT = {}
for _t in ['dang-tong-hop-bao-cao', 'duyet-xong', 'da-duyet-het', 'mat-ket-noi',
           'chot-thang', 'diem-danh-xong', 'gui-cho-duyet', 'xuat-excel', 'chua-co-du-lieu', 'het-phien',   # đợt 2 (07/10)
           'tra-lai', 'may-bao-tri', 'ghi-vi-pham', 'nghi-dai-han', 'them-nhan-su', 'doi-mat-khau']:          # đợt 3 (07/10)
    LT[_t] = _json.load(io.open(os.path.join(D, '..', 'lottie', _t + '.json'), encoding='utf-8'))
LT_JSON = _json.dumps(LT, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
R(""".hgd svg{width:17px!important;height:17px!important;flex:none;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round}
</style>""", """.hgd svg{width:17px!important;height:17px!important;flex:none;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round}
/* ===== Lottie ===== */
#ltPhu{position:fixed;inset:0;z-index:9000;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(8,10,12,.62)}
#ltPhu.mo{display:flex}
#ltPhu .lt-the{width:min(360px,100%);background:var(--panel);border:1px solid var(--line);border-radius:18px;padding:22px 20px 20px;text-align:center;box-shadow:0 30px 60px -20px rgba(0,0,0,.6)}
#ltPhu .lt-hinh{width:132px;height:132px;margin:0 auto 6px}
#ltPhu b{display:block;font-size:15px;color:var(--ink)}
#ltPhu small{display:block;font-size:12.5px;color:var(--ink2);margin-top:3px;word-break:break-word}
#ltPhu .lt-nut{display:flex;gap:8px;justify-content:center;margin-top:14px}
#ltPhu .lt-nut:empty{display:none}
.lt-quay{transform-origin:100px 100px;animation:ltQuay 1.1s linear infinite}
@keyframes ltQuay{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.lt-quay{animation:none}}
.lt-o{width:96px;height:96px;margin:0 auto 4px}
.hn-xong .lt-o{width:84px;height:84px;margin:0;flex:none}
.lt-tich{position:fixed;width:64px;height:64px;margin:-32px 0 0 -32px;z-index:8000;pointer-events:none}
.empty.lt-trong b{display:block;color:var(--ink);font-size:15px;margin-bottom:2px}
</style>""")
R("""/* Fallback: tải nội dung HTML thành file */""", """/* ===== HOẠT ẢNH LOTTIE =====
   4 hoạt ảnh tự vẽ (kpi-app/lottie/*.json, 4–9 KB). lottie-web tải từ cdnjs lần đầu cần; lỗi mạng -> bỏ qua, dùng hiệu ứng cũ.
   Máy bật "giảm chuyển động": hiện khung cuối, đứng yên. */
var LT_DATA=""" + LT_JSON + """;
var LT_URL='https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie_light.min.js';
var __ltCho=[], __ltDang=false, __ltLoi=false, __ltDs=[];
function ltNap(cb){
  if(window.lottie){cb(true);return}
  if(__ltLoi){cb(false);return}
  __ltCho.push(cb); if(__ltDang)return; __ltDang=true;
  var s=document.createElement('script'); s.src=LT_URL; s.async=true;
  var xong=function(ok){__ltDang=false; if(!ok)__ltLoi=true; var c=__ltCho; __ltCho=[]; c.forEach(function(f){try{f(ok&&!!window.lottie)}catch(e){}})};
  s.onload=function(){xong(true)}; s.onerror=function(){xong(false)};
  document.head.appendChild(s);
}
/* Hình tĩnh thay thế khi không tải được lottie-web (mạng chặn cdnjs) */
var LT_TINH=(function(){ var v=function(x){return '<svg viewBox="0 0 200 200" width="100%" height="100%" fill="none" stroke-linecap="round" stroke-linejoin="round">'+x+'</svg>'};
  return {'dang-tong-hop-bao-cao':v('<circle cx="100" cy="100" r="75" stroke="#3a434b" stroke-width="6"/><circle class="lt-quay" cx="100" cy="100" r="75" stroke="#16a89d" stroke-width="6" stroke-dasharray="110 400"/><rect x="65" y="55" width="70" height="90" rx="8" stroke="#aab5bc" stroke-width="5"/><path d="M80 80h40M80 96h40M80 112h28" stroke="#2fd3c6" stroke-width="6"/>'),
    'duyet-xong':v('<circle cx="100" cy="100" r="48" fill="#2fd3c6"/><path d="M78 101l16 16 30-32" stroke="#06201e" stroke-width="10"/>'),
    'da-duyet-het':v('<rect x="60" y="50" width="80" height="100" rx="10" stroke="#aab5bc" stroke-width="5"/><rect x="85" y="49" width="30" height="12" rx="4" fill="#aab5bc"/><path d="M76 82l6 6 10-12M76 104l6 6 10-12M76 126l6 6 10-12" stroke="#2fd3c6" stroke-width="5"/><path d="M100 82h22M100 104h22M100 126h22" stroke="#3a434b" stroke-width="5"/>'),
    'mat-ket-noi':v('<path d="M38 92a88 88 0 0 1 124 0M60 114a56 56 0 0 1 80 0M82 136a24 24 0 0 1 36 0" stroke="#aab5bc" stroke-width="7"/><circle cx="100" cy="150" r="7" fill="#aab5bc"/><path d="M54 60l92 92" stroke="#f26b6b" stroke-width="8"/>'),
    'chot-thang':v('<rect x="54" y="44" width="92" height="112" rx="9" fill="#21262b" stroke="#aab5bc" stroke-width="5"/><circle cx="100" cy="106" r="32" stroke="#f0b04e" stroke-width="5"/><path d="M86 107l10 10 19-21" stroke="#f0b04e" stroke-width="6"/>'),
    'diem-danh-xong':v('<g fill="#2fd3c6"><circle cx="36" cy="66" r="8"/><circle cx="68" cy="66" r="8"/><circle cx="100" cy="66" r="8"/><circle cx="164" cy="66" r="8"/><rect x="23" y="80" width="26" height="16" rx="8"/><rect x="55" y="80" width="26" height="16" rx="8"/><rect x="87" y="80" width="26" height="16" rx="8"/><rect x="151" y="80" width="26" height="16" rx="8"/></g><circle cx="132" cy="66" r="8" fill="#f0b04e"/><rect x="119" y="80" width="26" height="16" rx="8" fill="#f0b04e"/><path d="M26 130h148" stroke="#3a434b" stroke-width="8"/><path d="M26 130h118" stroke="#2fd3c6" stroke-width="8"/>'),
    'gui-cho-duyet':v('<rect x="73" y="71" width="54" height="66" rx="6" fill="#21262b" stroke="#aab5bc" stroke-width="4.5"/><path d="M84 88h32M84 100h24" stroke="#2fd3c6" stroke-width="4"/><rect x="48" y="131" width="104" height="30" rx="6" fill="#2a3036" stroke="#aab5bc" stroke-width="5"/><circle cx="146" cy="60" r="18" fill="#21262b" stroke="#f0b04e" stroke-width="4"/><path d="M146 60v-11M146 60h7" stroke="#f0b04e" stroke-width="3.5"/>'),
    'xuat-excel':v('<rect x="59" y="35" width="82" height="68" rx="7" fill="#21262b" stroke="#aab5bc" stroke-width="4.5"/><path d="M70 52h62M70 67h62M70 82h62" stroke="#2fd3c6" stroke-width="8"/><path d="M100 120v28M88 138l12 12 12-12" stroke="#f0b04e" stroke-width="6"/><path d="M66 166v14h68v-14" stroke="#aab5bc" stroke-width="5"/>'),
    'chua-co-du-lieu':v('<path d="M30 46v94h142" stroke="#aab5bc" stroke-width="5"/><path d="M40 100h126" stroke="#3a434b" stroke-width="4" stroke-dasharray="7 9"/><circle cx="96" cy="88" r="19" stroke="#2fd3c6" stroke-width="5.5"/><path d="M110 102l16 16" stroke="#2fd3c6" stroke-width="7"/>'),
    'het-phien':v('<circle cx="92" cy="92" r="56" fill="#21262b" stroke="#aab5bc" stroke-width="5"/><path d="M92 92V58M92 92h20" stroke="#aab5bc" stroke-width="5"/><path d="M131 140v-11a11 11 0 0 1 22 0v11" stroke="#f0b04e" stroke-width="6"/><rect x="123" y="138" width="38" height="28" rx="6" fill="#f0b04e"/>'),
    'tra-lai':v('<rect x="62" y="22" width="54" height="66" rx="6" fill="#21262b" stroke="#aab5bc" stroke-width="4.5" transform="rotate(-8 89 55)"/><circle cx="134" cy="36" r="17" fill="#f26b6b"/><path d="M127 29l14 14M141 29l-14 14" stroke="#fff" stroke-width="4.5"/><rect x="48" y="131" width="104" height="30" rx="6" fill="#2a3036" stroke="#aab5bc" stroke-width="5"/><path d="M136 184H66M76 175l-11 9 11 9" stroke="#f0b04e" stroke-width="5"/>'),
    'may-bao-tri':v('<circle cx="84" cy="112" r="36" fill="#aab5bc"/><circle cx="84" cy="112" r="13" fill="#21262b"/><circle cx="142" cy="70" r="20" fill="#2fd3c6"/><circle cx="142" cy="70" r="7" fill="#21262b"/><path d="M58 62l26 30" stroke="#f0b04e" stroke-width="10"/><circle cx="52" cy="54" r="12" stroke="#f0b04e" stroke-width="8"/>'),
    'ghi-vi-pham':v('<rect x="48" y="42" width="96" height="116" rx="8" fill="#21262b" stroke="#aab5bc" stroke-width="5"/><path d="M58 42v116" stroke="#aab5bc" stroke-width="4"/><path d="M68 62h60M68 78h50M68 94h40" stroke="#3a434b" stroke-width="5"/><path d="M68 112h58" stroke="#f0b04e" stroke-width="5"/><circle cx="148" cy="48" r="16" fill="#f0b04e"/><path d="M140 48h16" stroke="#06201e" stroke-width="5"/>'),
    'nghi-dai-han':v('<rect x="44" y="50" width="112" height="100" rx="10" fill="#21262b" stroke="#aab5bc" stroke-width="5"/><rect x="44" y="58" width="112" height="20" rx="6" fill="#3a434b"/><path d="M76 52v14M124 52v14" stroke="#aab5bc" stroke-width="5"/><rect x="66" y="102" width="96" height="12" rx="6" fill="#f0b04e" opacity=".85" transform="translate(-14 -14)"/><rect x="52" y="116" width="54" height="12" rx="6" fill="#f0b04e" opacity=".85"/>'),
    'them-nhan-su':v('<rect x="38" y="67" width="124" height="78" rx="10" fill="#21262b" stroke="#aab5bc" stroke-width="5"/><circle cx="66" cy="96" r="11" fill="#2fd3c6"/><rect x="50" y="110" width="32" height="16" rx="8" fill="#2fd3c6"/><path d="M94 94h42M94 108h28M94 122h14" stroke="#3a434b" stroke-width="5"/><circle cx="156" cy="68" r="18" fill="#2fd3c6"/><path d="M148 68l6 6 11-12" stroke="#06201e" stroke-width="4.5"/>'),
    'doi-mat-khau':v('<g fill="#2fd3c6"><circle cx="67" cy="44" r="7"/><circle cx="89" cy="44" r="7"/><circle cx="111" cy="44" r="7"/><circle cx="133" cy="44" r="7"/></g><path d="M83 112V97a17 17 0 0 1 34 0v15" stroke="#aab5bc" stroke-width="8"/><rect x="70" y="109" width="60" height="46" rx="9" fill="#2fd3c6"/><circle cx="100" cy="128" r="4.5" fill="#06201e"/>')}; })();
/* Phát hoạt ảnh vào el. Trả đối tượng có .huy(). lap=true: lặp (dùng khi chờ). */
function ltPhat(el,ten,lap,khiXong){
  var h={a:null,huy:function(){try{if(h.a)h.a.destroy()}catch(e){} h.a=null; h.huyRoi=true}};
  if(!el||!LT_DATA[ten])return h;
  ltNap(function(ok){
    if(!ok&&!h.huyRoi&&LT_TINH[ten]&&!el.firstChild) el.innerHTML=LT_TINH[ten];   // không tải được thư viện: hình tĩnh
    if(!ok||h.huyRoi||!document.body.contains(el)){ if(khiXong)khiXong(false); return; }
    el.innerHTML='';
    var giam=GIAM_CD();
    h.a=lottie.loadAnimation({container:el,renderer:'svg',loop:!!lap&&!giam,autoplay:!giam,animationData:JSON.parse(JSON.stringify(LT_DATA[ten]))});
    if(giam) h.a.addEventListener('DOMLoaded',function(){h.a.goToAndStop(h.a.totalFrames-1,true)});
    h.a.__el=el; __ltDs.push(h.a);
    if(khiXong)khiXong(true);
  });
  return h;
}
/* Dọn hoạt ảnh có khung đã bị vẽ lại (tránh tốn máy) */
function ltDon(){ __ltDs=__ltDs.filter(function(a){ if(a.__el&&document.body.contains(a.__el))return true; try{a.destroy()}catch(e){} return false; }); }
/* Lớp phủ giữa màn hình: chờ / xong / lỗi */
var __ltPhu=null;
function ltKhung(){
  var p=$('ltPhu'); if(p)return p;
  p=document.createElement('div'); p.id='ltPhu'; p.setAttribute('role','status'); p.setAttribute('aria-live','polite');
  p.innerHTML='<div class="lt-the"><div class="lt-hinh"></div><b></b><small></small><div class="lt-nut"></div></div>';
  document.body.appendChild(p); return p;
}
function ltMo(ten,tieuDe,phu,lap,nut){
  var p=ltKhung(); if(__ltPhu)__ltPhu.huy(); clearTimeout(ltMo._h);
  p.querySelector('b').textContent=tieuDe||''; p.querySelector('small').textContent=phu||'';
  var hinh=p.querySelector('.lt-hinh'); hinh.innerHTML=''; p.querySelector('.lt-nut').innerHTML=nut||'';
  p.onclick=null; p.classList.add('mo'); __ltPhu=ltPhat(hinh,ten,lap);
  return p;
}
function ltDong(){ var p=$('ltPhu'); if(p)p.classList.remove('mo'); if(__ltPhu){__ltPhu.huy();__ltPhu=null} clearTimeout(ltMo._h); }
/* Xong việc: hoạt ảnh phát 1 lần rồi tự đóng (bấm vào lớp phủ để đóng sớm) */
function ltXong(tieuDe,phu,ten,ms){ var p=ltMo(ten||'duyet-xong',tieuDe,phu,false); p.onclick=ltDong; ltMo._h=setTimeout(ltDong,ms||1700); }
/* Trang trống "chưa có dữ liệu" có hoạt ảnh kính lúp */
function ltTrong(tieuDe,phu){ return '<div class="empty lt-trong"><div class="lt-o" data-lt="chua-co-du-lieu" aria-hidden="true"></div><b>'+esc(tieuDe)+'</b>'+esc(phu||'')+'</div>'; }
/* Lỗi mạng (Apps Script trả "NetworkError … HTTP 0" khi rớt mạng / mạng chập chờn) */
function laLoiMang(e){ var m=String(e&&e.message||e||''); return /NetworkError|HTTP 0|Failed to fetch|network|mạng|timed? ?out|Connection/i.test(m); }
function ltMatMang(fn,args,cb){
  var doc=laHamDoc_(fn);
  ltMo('mat-ket-noi','Mất kết nối',doc?'Chưa tải được dữ liệu. Kiểm tra mạng (wifi / 4G) rồi bấm Thử lại.':'Chưa lưu được. Số bạn vừa nhập vẫn còn trên màn hình – kiểm tra mạng rồi bấm Thử lại.',true,
    '<button class="btn" id="ltDongNut">Đóng</button><button class="btn pri" id="ltThuLai">Thử lại</button>');
  $('ltDongNut').onclick=ltDong;
  $('ltThuLai').onclick=function(){ ltDong(); call(fn,args,cb); };
  setTimeout(function(){ var b=$('ltThuLai'); if(b)b.focus(); },50);
}
/* Nạp sẵn thư viện sau khi trang mở 4 giây, để lần dùng đầu không phải chờ */
setTimeout(function(){ ltNap(function(){}); },4000);

/* Fallback: tải nội dung HTML thành file */""")
# lỗi mạng trong call()
R("""    }).withFailureHandler(function(e){
      ketThuc();
      toast('Lỗi: '+(e&&e.message||e));
    });
    r[fn].apply(r,[TOKEN].concat(args));""", """    }).withFailureHandler(function(e){
      ketThuc();
      if(laLoiMang(e)){ ltMatMang(fn,args,cb); return; }
      toast('Lỗi: '+(e&&e.message||e));
    });
    r[fn].apply(r,[TOKEN].concat(args));""")
# duyệt xong: dấu tích Lottie tại nút (từ chối vẫn dùng dấu ✕ cũ)
R("""  var sv=t.firstChild; sv.style.left=(r.left+r.width/2)+'px'; sv.style.top=(r.top+r.height/2)+'px';
  document.body.appendChild(sv); setTimeout(function(){sv.remove()},950);""", """  var sv=t.firstChild; sv.style.left=(r.left+r.width/2)+'px'; sv.style.top=(r.top+r.height/2)+'px';
  if(!tuChoi&&window.lottie){
    var lt=document.createElement('div'); lt.className='lt-tich'; lt.style.left=sv.style.left; lt.style.top=sv.style.top;
    document.body.appendChild(lt); var hl=ltPhat(lt,'duyet-xong',false); setTimeout(function(){hl.huy();lt.remove()},1100);
  } else { document.body.appendChild(sv); setTimeout(function(){sv.remove()},950); }""")
# Việc hôm nay: mọi việc đã xong
R("""    h+='<div class="hn-xong"><svg class="hn-bi" viewBox="0 0 130 56" aria-hidden="true">'+
      '<ellipse class="sang" cx="106" cy="30" rx="22" ry="16" fill="rgba(var(--acc-rgb),.35)"/>'+
      '<line x1="4" y1="38.5" x2="90" y2="38.5" stroke="var(--line)" stroke-width="2" stroke-linecap="round"/>'+
      '<ellipse class="lo" cx="106" cy="30" rx="15" ry="11"/>'+
      '<g class="bi"><circle cx="104" cy="28" r="9" fill="#f4f1ea"/><circle cx="101" cy="25" r="3" fill="#fff" opacity=".9"/>'+
      '<circle cx="106" cy="31" r="2.2" fill="var(--cyan)"/></g></svg>'+""", """    h+='<div class="hn-xong"><div class="lt-o" data-lt="da-duyet-het" aria-hidden="true"></div>'+""")
# Duyệt sản lượng: không còn gì chờ
R("""    h+='<div class="card"><div class="empty">Không có sản lượng nào đang chờ duyệt</div></div>';""",
  """    h+='<div class="card"><div class="empty lt-trong"><div class="lt-o" data-lt="da-duyet-het" aria-hidden="true"></div><b>Đã duyệt hết</b>Không có sản lượng nào đang chờ duyệt</div></div>';""")
# Gắn hoạt ảnh cho mọi khung [data-lt] mới vẽ (dùng bộ theo dõi #main sẵn có)
R("""  try{hieuUngDot2(main)}catch(e){}
  if(GIAM_CD())return;""", """  try{hieuUngDot2(main)}catch(e){}
  try{ ltDon(); Array.prototype.forEach.call(main.querySelectorAll('[data-lt]:not([data-lt-on])'),function(el){ el.setAttribute('data-lt-on','1'); ltPhat(el,el.getAttribute('data-lt'),true); }); }catch(e){}
  if(GIAM_CD())return;""")


# 9) LOTTIE ĐỢT 2 (duyệt 07/10): chốt tháng, lưu điểm danh, công nhân gửi sản lượng, xuất Excel, chưa có dữ liệu, hết phiên.
R("""function hetHan(){
  toast('Phiên đăng nhập đã hết hạn. Đăng nhập lại.');
  try{sessionStorage.removeItem('kpi_token')}catch(e){}
  setTimeout(function(){location.reload()},1800);
}""", """function hetHan(){
  // Không tự tải lại trang nữa: để người dùng kịp chép số đang nhập dở rồi mới đăng nhập lại
  try{sessionStorage.removeItem('kpi_token')}catch(e){}
  if(typeof ltMo!=='function'){ toast('Phiên đăng nhập đã hết hạn. Đăng nhập lại.'); setTimeout(function(){location.reload()},1800); return; }
  ltMo('het-phien','Phiên đăng nhập đã hết hạn','Trang không tự tải lại: chép lại số đang nhập nếu cần, rồi bấm Đăng nhập lại.',true,
    '<button class="btn" id="ltDeSau">Để sau</button><button class="btn pri" id="ltDNLai">Đăng nhập lại</button>');
  $('ltDeSau').onclick=ltDong;
  $('ltDNLai').onclick=function(){ location.reload(); };
  setTimeout(function(){ var b=$('ltDNLai'); if(b)b.focus(); },50);
}""")
# chốt tháng
R("""    chotThangUI._dang=false;
    toast(r.msg, r.ok);
    if(r.ok) taiKPIKy();""", """    chotThangUI._dang=false;
    if(r.ok) ltXong(r.msg, 'Số liệu đã được lưu lại để tính thưởng và xếp hạng', 'chot-thang', 2800); else toast(r.msg, false);
    if(r.ok) taiKPIKy();""")
# điểm danh
R("""  call('luuDiemDanh',[ddNgay, nghi], function(r){
    toast(r.msg, r.ok);""", """  call('luuDiemDanh',[ddNgay, nghi], function(r){
    if(r.ok) ltXong(r.msg, $('dd_siso')?$('dd_siso').textContent:'', 'diem-danh-xong', 2400); else toast(r.msg, false);""")
# công nhân gửi sản lượng
R("""    cnGui._dangGui=false;
    toast(r.msg,r.ok);""", """    cnGui._dangGui=false;
    if(r.ok) ltXong('Đã gửi – chờ trưởng phòng duyệt', (r.msg||'')+' Duyệt xong mới tính vào KPI.', 'gui-cho-duyet', 3200); else toast(r.msg,false);""")
# xuất Excel: lớp chờ khi tải thư viện + dựng file, xong thì báo tên file
R("""function xuatExcelLich(){
  var r=window.__tk; if(!r)return;""", """function xuatExcelLich(){
  var r=window.__tk; if(!r)return;
  ltMo('xuat-excel','Đang tạo file Excel…','Chấm công tháng '+r.ky.slice(5)+'/'+r.ky.slice(0,4),true);""")
R("""    XLSX.writeFile(wb, 'ChamCong_'+r.ky+'.xlsx');""", """    XLSX.writeFile(wb, 'ChamCong_'+r.ky+'.xlsx');
    ltXong('Đã tải file Excel', 'ChamCong_'+r.ky+'.xlsx', 'xuat-excel', 2200);""")
R("""function xuatMauHCNS(){
  var r=window.__tk; if(!r)return;""", """function xuatMauHCNS(){
  var r=window.__tk; if(!r)return;
  ltMo('xuat-excel','Đang tạo file Excel…','Bảng chấm công HC-NS tháng '+r.ky.slice(5)+'/'+r.ky.slice(0,4),true);""")
R("""    XLSX.writeFile(wb, 'BangChamCong_HCNS_'+r.ky+'.xlsx');""", """    XLSX.writeFile(wb, 'BangChamCong_HCNS_'+r.ky+'.xlsx');
    ltXong('Đã tải file Excel', 'BangChamCong_HCNS_'+r.ky+'.xlsx', 'xuat-excel', 2200);""")
R("""function napThuVien(url, bienToanCuc, cb){
  if(window[bienToanCuc]){cb();return}
  var s=document.createElement('script'); s.src=url;
  s.onload=function(){cb()};
  s.onerror=function(){toast('Không tải được thư viện xuất Excel (cần mạng)')};""", """function napThuVien(url, bienToanCuc, cb){
  var chay=function(){ try{cb()}catch(e){ try{ltDong()}catch(x){} toast('Lỗi tạo file: '+(e.message||e)); } };
  if(window[bienToanCuc]){chay();return}
  var s=document.createElement('script'); s.src=url;
  s.onload=chay;
  s.onerror=function(){ try{ltDong()}catch(x){} toast('Không tải được thư viện xuất Excel (cần mạng)')};""")
# trang chưa có dữ liệu
R("""  if(!ds.length)h+='<div class="card"><div class="empty">Chưa có dữ liệu kỳ này</div></div>';""",
  """  if(!ds.length)h+='<div class="card">'+ltTrong('Chưa có dữ liệu kỳ này','Kỳ này chưa có sản lượng nào được duyệt. Chọn kỳ khác ở ô Kỳ.')+'</div>';""")
R("""    if(!ds.length){ $('qlBody').innerHTML='<div class="empty">Chưa có dữ liệu KPI quản lý cho tháng này.</div>'; return; }""",
  """    if(!ds.length){ $('qlBody').innerHTML=ltTrong('Chưa có KPI quản lý tháng này','Chọn tháng khác, hoặc chờ trưởng phòng nhập và duyệt sản lượng.'); return; }""")
R("""  if(!arr||!arr.length){box.innerHTML='<div class="empty">Chưa có dữ liệu</div>';return}""",
  """  if(!arr||!arr.length){box.innerHTML=ltTrong('Chưa có dữ liệu','Chưa có kỳ nào được chốt để xem lịch sử.');return}""")


# 10) LOTTIE ĐỢT 3 (duyệt 07/10): trả lại sản lượng, máy bảo trì, ghi vi phạm, nghỉ dài hạn, thêm nhân sự, đổi mật khẩu.
TRA_LAI = "ltXong('Đã trả lại để nhập lại', r.msg, 'tra-lai', 2600)"
R("""  call('tuChoiNhieu',[ids],function(r){
    toast(r.msg,r.ok);""", """  call('tuChoiNhieu',[ids],function(r){
    if(r.ok) """ + TRA_LAI + """; else toast(r.msg,false);""")
R("""  call('banDieuHanhTuChoi',[maDong,lyDo],function(r){
    toast(r.msg,r.ok);""", """  call('banDieuHanhTuChoi',[maDong,lyDo],function(r){
    if(r.ok) """ + TRA_LAI + """; else toast(r.msg,false);""")
R("""  call('banDieuHanhTuChoiNhieu',[ids],function(r){
    toast(r.msg,r.ok);""", """  call('banDieuHanhTuChoiNhieu',[ids],function(r){
    if(r.ok) """ + TRA_LAI + """; else toast(r.msg,false);""")
# máy: chuyển sang bảo trì -> bánh răng; hoạt động lại -> dấu tích
R("""  call('doiTinhTrangMay',[ma,tt],function(r){
    toast(r.msg,r.ok); if(r.ok)reload(vMM);""", """  call('doiTinhTrangMay',[ma,tt],function(r){
    if(r.ok) ltXong(ma+(tt==='Hoạt động'?' hoạt động lại':' chuyển sang "'+tt+'"'), tt==='Hoạt động'?'Máy đã sẵn sàng nhận sản lượng.':'Sửa xong thì bấm lại nút ở dòng máy này để chuyển về "Hoạt động".', tt==='Hoạt động'?'duyet-xong':'may-bao-tri', 2600);
    else toast(r.msg,false);
    if(r.ok)reload(vMM);""")
# vi phạm
R("""  call('ghiViPham',[o],function(r){toast(r.msg,r.ok); if(r.ok)reload(vNeNep)});""",
  """  var tenOpt=function(id){ var e=$(id); return e&&e.selectedIndex>=0?e.options[e.selectedIndex].text:''; };
  var nguoiVP=tenOpt('vp_nv'), loaiVP=tenOpt('vp_loai');
  call('ghiViPham',[o],function(r){
    if(r.ok) ltXong('Đã ghi vi phạm', (loaiVP?loaiVP+' – ':'')+nguoiVP+'. Ghi nhầm thì bấm Xóa ở danh sách, điểm được cộng lại.', 'ghi-vi-pham', 2800); else toast(r.msg,false);
    if(r.ok)reload(vNeNep)});""")
# nghỉ dài hạn
R("""  call('dangKyNghiDaiHan',[nv.value,loai.value,tu.value,den.value,''],function(res){
    toast(res.msg,res.ok);""", """  call('dangKyNghiDaiHan',[nv.value,loai.value,tu.value,den.value,''],function(res){
    if(res.ok) ltXong('Đã đăng ký nghỉ dài hạn', res.msg.replace(/^Đã đăng ký nghỉ dài hạn cho nhân sự /,'')+' Những ngày này tự ghi vào điểm danh.', 'nghi-dai-han', 2800); else toast(res.msg,false);""")
# thêm nhân sự
R("""  call('luuNhanSu',[o],function(r){toast(r.msg,r.ok); if(r.ok)reload(vNS)});""",
  """  call('luuNhanSu',[o],function(r){
    if(r.ok) ltXong('Đã thêm '+o.HoTen, 'Mã '+o.MaNV+(o.MaXuong?' · '+((D.phongban||[]).filter(function(x){return x.MaXuong===o.MaXuong})[0]||{TenXuong:o.MaXuong}).TenXuong:''), 'them-nhan-su', 2600); else toast(r.msg,false);
    if(r.ok)reload(vNS)});""")
# đổi mật khẩu
R("""    if(!r.ok){bao(r.msg);return}
    toast(r.msg,true);
    var b=$('mkbox'); if(b)b.remove();""", """    if(!r.ok){bao(r.msg);return}
    try{ ltXong('Đã đổi mật khẩu','Lần sau đăng nhập bằng mật khẩu mới. Đừng chia sẻ mật khẩu cho người khác.','doi-mat-khau',2600); }catch(x){ toast(r.msg,true); }
    var b=$('mkbox'); if(b)b.remove();""")


# 11) Sửa lỗi 07/10: thanh "So sánh hiệu suất giữa các xưởng" (và các thanh khác) kẹt ở 0.
#     Hai đoạn hiệu ứng "mọc từ 0" (play cũ + hieuUngMoi) cùng chạy; đoạn sau ghi nhớ nhầm chiều rộng 0. Dùng chung data-w.
R("""      fills.forEach(function(el){
        finals.push(el.style.width || '');
        el.style.width='0';
      });
      requestAnimationFrame(function(){requestAnimationFrame(function(){
        fills.forEach(function(el,i){ el.style.width = finals[i]; });
      });});""", """      fills.forEach(function(el){
        var w=el.getAttribute('data-w') || el.style.width || '';
        if(w && w!=='0' && w!=='0px') el.setAttribute('data-w',w);
        finals.push(w);
        el.style.width='0';
      });
      requestAnimationFrame(function(){requestAnimationFrame(function(){
        fills.forEach(function(el,i){ el.style.width = finals[i]; el.removeAttribute('data-w'); });
      });});""")

io.open(os.path.join(D, '..', 'Index.html'), 'w', encoding='utf-8').write(s)
print('OK Index.html')
