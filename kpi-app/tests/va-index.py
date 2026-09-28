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

io.open(os.path.join(D, '..', 'Index.html'), 'w', encoding='utf-8').write(s)
print('OK Index.html')
