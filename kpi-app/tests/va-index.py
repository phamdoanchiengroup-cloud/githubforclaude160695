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

# 5) Ô tên đăng nhập không gợi ý sẵn tên tài khoản giám đốc
R('''<input id="l_tk" autocomplete="username" placeholder="giamdoc"''', '''<input id="l_tk" autocomplete="username" placeholder="Mã nhân viên, VD: c123"''')

io.open(os.path.join(D, '..', 'Index.html'), 'w', encoding='utf-8').write(s)
print('OK Index.html')
