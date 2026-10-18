# -*- coding: utf-8 -*-
"""Mục 22 của va-index.py – bảo mật phía trình duyệt (rà soát 17/10, sửa 18/10; danh sách: kpi-app/VIEC-BAO-MAT.md).
Chạy bằng exec() sau mục 21, dùng chung R() và s."""
import hashlib as _hl22

# 6a) esc(): đổi cả dấu ' và ` (chuỗi đặt trong onclick="f('…')" không thoát ra được)
R("""function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){
  return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}""", """function esc(s){return String(s==null?'':s).replace(/[&<>"'`]/g,function(c){
  return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','`':'&#96;'}[c]})}""")

# 6b) Phần giao diện nhớ trong máy (SoDo, HoatAnh): mã phiên bản = SHA-256 nội dung; chỉ chạy bản nhớ khi khớp mã,
#     để mã độc ghi vào localStorage không thành "cửa hậu" chạy lại mỗi lần đăng nhập.
_v22 = lambda p: _hl22.sha256(io.open(os.path.join(D, '..', p), encoding='utf-8').read().encode('utf-8')).hexdigest()[:16]
_mv = s[s.index('var MANH_VER='):s.index(';', s.index('var MANH_VER='))]
s = s.replace(_mv, 'var MANH_VER=' + _json.dumps({'SoDo': _v22('SoDo.html'), 'HoatAnh': _v22('HoatAnh.html')}), 1)
R("""  try{nd=localStorage.getItem(khoa)}catch(e){}
  if(nd){gan(nd);return}
  if(typeof TOKEN==='undefined'||!TOKEN){xong(false,'Chưa đăng nhập.');return}""", """  try{nd=localStorage.getItem(khoa)}catch(e){}
  if(nd){ bamManh_(nd,function(h){ if(h&&h===MANH_VER[ten]){gan(nd);return}
    try{localStorage.removeItem(khoa)}catch(e){} nd=null; taiMoi(); }); return; }
  taiMoi();
  function taiMoi(){
  if(typeof TOKEN==='undefined'||!TOKEN){xong(false,'Chưa đăng nhập.');return}""")
R("""    try{ for(var i=localStorage.length-1;i>=0;i--){var k=localStorage.key(i); if(k&&k.indexOf('kpi_manh_'+ten+'_')===0)localStorage.removeItem(k)}
      localStorage.setItem(khoa,r.noiDung);}catch(e){}
    gan(r.noiDung);
  }).withFailureHandler(function(e){xong(false,'Không tải được (mạng chập chờn?).')}).layManhGiaoDien(TOKEN,ten);
}""", """    try{ for(var i=localStorage.length-1;i>=0;i--){var k=localStorage.key(i); if(k&&k.indexOf('kpi_manh_'+ten+'_')===0)localStorage.removeItem(k)} }catch(e){}
    bamManh_(r.noiDung,function(h){ if(h&&h===MANH_VER[ten]){try{localStorage.setItem(khoa,r.noiDung)}catch(e){}} });   // chỉ nhớ bản đúng phiên bản
    gan(r.noiDung);
  }).withFailureHandler(function(e){xong(false,'Không tải được (mạng chập chờn?).')}).layManhGiaoDien(TOKEN,ten);
  }
}
/* SHA-256 (16 ký tự đầu) của một chuỗi; trình duyệt không hỗ trợ thì trả '' (không dùng bản nhớ) */
function bamManh_(nd,cb){
  try{ crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(nd))).then(function(b){
    cb(Array.prototype.map.call(new Uint8Array(b),function(x){return ('0'+x.toString(16)).slice(-2)}).join('').slice(0,16));
  },function(){cb('')}); }catch(e){cb('')}
}""")

# 3) Mật khẩu tạm: hiện trong hộp riêng (chữ to, nút Chép, In phiếu), không còn chữ "123456" trên giao diện
R("""   + '<li>Đăng nhập lần đầu bằng mật khẩu <b>123456</b> — hệ thống sẽ bắt bạn <b>đổi mật khẩu riêng</b> ngay. Hãy đổi và giữ kín.</li>'""",
  """   + '<li>Đăng nhập lần đầu bằng <b>mật khẩu tạm</b> được phát (dùng trong 48 giờ) — hệ thống sẽ bắt bạn <b>đổi mật khẩu riêng</b> ngay. Hãy đổi và giữ kín.</li>'""")
R("""    'Tài khoản mới mặc định mật khẩu <b>123456</b> và bắt buộc đổi ngay lần đăng nhập đầu.</div>';""",
  """    'Tài khoản mới nhận <b>mật khẩu tạm ngẫu nhiên</b> (dùng trong 48 giờ) và bắt buộc đổi ngay lần đăng nhập đầu.</div>';""")
R("""    '</div><div class="row"><div><label>Mật khẩu tạm — để trống thì dùng 123456</label>'+
    '<input id="q_mk" placeholder="123456"></div></div>'+""", """    '</div><div class="row"><div><label>Mật khẩu tạm — để trống thì hệ thống tự tạo</label>'+
    '<input id="q_mk" placeholder="Tự tạo" autocomplete="off"></div></div>'+""")
R("""    'Quên mật khẩu: bấm Cấp lại MK, mật khẩu về 123456 và người đó phải đổi khi đăng nhập.</div>';""",
  """    'Quên mật khẩu: bấm Cấp lại MK, hệ thống tạo mật khẩu tạm mới (dùng trong 48 giờ) và người đó phải đổi khi đăng nhập.</div>';""")
R("""  call('taoTaiKhoan',[o],function(r){toast(r.msg,r.ok); if(r.ok)vPQ()});""",
  """  call('taoTaiKhoan',[o],function(r){ if(r.ok&&r.mkTam){vPQ();mkTamHien(r);return} toast(r.msg,r.ok); if(r.ok)vPQ()});""")
R("""    if(!r.ok){toast(r.msg);return}
    alert(r.msg);   // hiện đủ lâu để chép mật khẩu tạm
    vPQ();""", """    if(!r.ok){toast(r.msg);return}
    vPQ(); mkTamHien(r);   // hộp riêng: chữ to, nút Chép, In phiếu""")
R("""'them-nhan-su', 2600); else toast(r.msg,false);""", """'them-nhan-su', 2600); else toast(r.msg,false);
    if(r.ok&&r.mkTam)setTimeout(function(){mkTamHien(r)},2700);""")

_k22 = s.rfind('</body>')
s = s[:_k22] + '''<style>
/* ===== 22. Hộp mật khẩu tạm (bảo mật 18/10) ===== */
#mktHop{position:fixed;inset:0;z-index:130;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:16px}
#mktHop .mkt-the{background:var(--panel);color:var(--ink);border:1px solid var(--line);border-radius:12px;max-width:420px;width:100%;padding:20px}
#mktHop h3{margin:0 0 6px;font-size:17px}
#mktHop .mkt-mk{font:700 30px/1.2 ui-monospace,Menlo,Consolas,monospace;letter-spacing:.12em;text-align:center;padding:14px 8px;margin:12px 0;
  border:1px dashed var(--line);border-radius:10px;user-select:all;word-break:break-all}
#mktHop .mkt-ghi{font-size:13px;color:var(--ink2);line-height:1.5}
#mktHop .acts{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}
#mktHop .acts .btn{min-height:44px;flex:1}
</style>
<script>
/* ===== 22. MẬT KHẨU TẠM (bảo mật 18/10): hiện một lần, chép hoặc in phiếu để giao tận tay ===== */
function mkTamHien(r){
  var cu=document.getElementById('mktHop'); if(cu)cu.remove();
  var gio=r.hanGio||48, han=new Date(Date.now()+gio*3600e3);
  var hanChu=('0'+han.getHours()).slice(-2)+':'+('0'+han.getMinutes()).slice(-2)+' ngày '+han.getDate()+'/'+(han.getMonth()+1);
  var d=document.createElement('div'); d.id='mktHop'; d.setAttribute('role','dialog'); d.setAttribute('aria-modal','true'); d.setAttribute('aria-labelledby','mktTieuDe');
  d.innerHTML='<div class="mkt-the"><h3 id="mktTieuDe">Mật khẩu tạm</h3>'+
    '<div class="mkt-ghi">'+esc(r.hoTen||'')+' · tên đăng nhập <b>'+esc(r.tenDN||'')+'</b></div>'+
    '<div class="mkt-mk" id="mktMk">'+esc(r.mkTam)+'</div>'+
    '<div class="mkt-ghi">Dùng được tới <b>'+hanChu+'</b> ('+gio+' giờ). Giao tận tay người này; lần đăng nhập đầu họ phải đặt mật khẩu riêng. '+
    'Hộp này đóng lại là không xem lại được – quên thì bấm Cấp lại MK.</div>'+
    '<div class="acts"><button class="btn pri" id="mktChep">Chép</button><button class="btn" id="mktIn">In phiếu</button><button class="btn" id="mktDong">Đóng</button></div></div>';
  document.body.appendChild(d);
  var dong=function(){d.remove();document.removeEventListener('keydown',phim)};
  var phim=function(e){if(e.key==='Escape')dong()};
  document.addEventListener('keydown',phim);
  d.querySelector('#mktDong').onclick=dong;
  d.querySelector('#mktChep').onclick=function(){
    var ok=function(){toast('Đã chép mật khẩu tạm',true)};
    try{navigator.clipboard.writeText(r.mkTam).then(ok,function(){chonMk()})}catch(e){chonMk()}
    function chonMk(){var g=document.getElementById('mktMk'),rg=document.createRange();rg.selectNodeContents(g);var sl=getSelection();sl.removeAllRanges();sl.addRange(rg);try{document.execCommand('copy');ok()}catch(e){}}
  };
  d.querySelector('#mktIn').onclick=function(){
    var w=window.open('','_blank'); if(!w){toast('Trình duyệt chặn cửa sổ in – bấm Chép rồi ghi tay.',false);return}
    w.document.write('<!doctype html><meta charset="utf-8"><title>Phiếu tài khoản</title><style>body{font:16px/1.6 Arial,sans-serif;margin:32px;color:#000}'+
      '.mk{font:700 28px monospace;letter-spacing:.15em;border:2px dashed #000;padding:10px 16px;display:inline-block;margin:6px 0}</style>'+
      '<h2>Phiếu tài khoản web KPI</h2><p>Họ tên: <b>'+esc(r.hoTen||'')+'</b><br>Tên đăng nhập: <b>'+esc(r.tenDN||'')+'</b></p>'+
      '<p>Mật khẩu tạm:<br><span class="mk">'+esc(r.mkTam)+'</span></p><p>Dùng được tới <b>'+hanChu+'</b>.</p>'+
      '<ol><li>Mở web KPI, nhập tên đăng nhập và mật khẩu tạm.</li><li>Đặt mật khẩu riêng (từ 6 ký tự, không dùng ngày sinh hay mã nhân viên).</li>'+
      '<li>Giữ kín mật khẩu, không đưa người khác.</li></ol>');
    w.document.close(); w.focus(); w.print();
  };
  d.querySelector('#mktChep').focus();
}
</script>
''' + s[_k22:]
