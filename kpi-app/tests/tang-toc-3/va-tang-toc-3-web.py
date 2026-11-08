# -*- coding: utf-8 -*-
"""Vá Index.html – mục 38: tăng tốc đợt 3 (08/11, chủ dự án chọn A + "hiện số lần trước kèm nhãn").
1) Bộ đo: call() đo thời gian từng lượt (cả đường truyền) + __ms máy chủ; đăng nhập → thấy số; mở trang. Gửi gộp về ghiTocDo.
2) Ghi nhớ số liệu trên máy cá nhân (người dùng tự tích, mặc định TẮT – chuyên gia bảo mật 08/11): bản lưu MÃ HÓA AES-GCM,
   khóa do máy chủ giữ (layKhoaLuu, đổi khi Thoát / đổi mật khẩu), bỏ CCCD / điện thoại / địa chỉ / lương, hết hạn 12 giờ.
   Mở web: hiện ngay số lần trước + nhãn "đang cập nhật", chặn mọi thao tác ghi tới khi số mới về.
Chạy bằng exec() cuối tests/va-index.py. Kiểm thử: tests/tang-toc-3-web.js"""
import hashlib as _hl38

def _t38(cu, moi, dem=1):
    global s
    assert s.count(cu) == dem, ('mục 38: không thấy đúng %d chỗ' % dem, cu[:90], s.count(cu))
    s = s.replace(cu, moi)

# --- 1) đo từng lượt gọi + chặn ghi khi đang hiện số cũ
_t38("""function call(fn,args,cb){
  busy(true);""", """function call(fn,args,cb){
  if(window.__dlCu && !laHamDoc_(fn)){ toast('Đang cập nhật số liệu mới – đợi vài giây rồi bấm lại.'); return; }   // 08/11: đang hiện số lần trước
  var __tdT=Date.now();
  busy(true);""")
_t38("""    var r=google.script.run.withSuccessHandler(function(res){
      ketThuc();""", """    var r=google.script.run.withSuccessHandler(function(res){
      try{ tdGhi_(fn,Date.now()-__tdT,res&&res.__ms); }catch(e){}
      ketThuc();""")
# --- đăng nhập → thấy số; thời gian gói đăng nhập; giữ chuỗi gốc để lưu trên máy
_t38("""  __dangDangNhap=true;
  $('btnLogin').disabled=true;""", """  __dangDangNhap=true; window.__tdDN=Date.now(); dlNhoLuu_();
  $('btnLogin').disabled=true;""")
_t38("""    TOKEN=r.token; ME=r.me;
    try{sessionStorage.setItem('kpi_token',TOKEN)}catch(e){}""", """    TOKEN=r.token; ME=r.me;
    try{sessionStorage.setItem('kpi_token',TOKEN); sessionStorage.setItem('kpi_tk',ME.tk)}catch(e){}""")
_t38("""  var o=__napT={tk:tk,xong:false,r:null,e:null,cho:null};
  google.script.run.withSuccessHandler(function(r){o.xong=true;o.r=moGoi_(r);if(o.cho)o.cho();})""", """  var o=__napT={tk:tk,xong:false,r:null,e:null,cho:null}; window.__tdNap0=Date.now();
  google.script.run.withSuccessHandler(function(r){o.xong=true;o.r=moGoi_(window.__dlRaw=r);if(o.cho)o.cho();})""")
_t38("""    if(!o||o.tk!==tk){ google.script.run.withSuccessHandler(function(r){ c.s(moGoi_(r)); }).withFailureHandler(c.f).napDuLieu(tk); return; }""",
     """    if(!o||o.tk!==tk){ window.__tdNap0=Date.now(); google.script.run.withSuccessHandler(function(r){ c.s(moGoi_(window.__dlRaw=r)); }).withFailureHandler(c.f).napDuLieu(tk); return; }""")
_t38("""function vaoHeThong(){
  $('gspin').classList.remove('hide');
  napCo_().withSuccessHandler(function(r){""", """function vaoHeThong(){
  $('gspin').classList.remove('hide');
  (function(){ var f=function(){ try{ if(typeof dlHienCu_==='function') dlHienCu_(); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',f); else f(); })();   // 08/11: hiện ngay số lần trước (nếu bật ghi nhớ trên máy này); mở lại trang thì đợi phần mã cuối trang
  napCo_().withSuccessHandler(function(r){""")
_t38("""    D=r; ME=r.me; inApp=true;
    $('gate').style.display='none';""", """    D=r; ME=r.me; inApp=true;
    try{ tdGhi_('napDuLieu',Date.now()-(window.__tdNap0||Date.now()),r.__ms); window.__tdNap0=0; if(window.__tdDN){ tdGhi_('vaoApp',Date.now()-window.__tdDN); window.__tdDN=0; } }catch(e){}
    var __tabCu=window.__dlCu?tabHienTai:''; if(window.__dlCu){ window.__dlCu=false; dlNhan_(false); }
    try{ dlLuu_(); }catch(e){}
    $('gate').style.display='none';""")
_t38("""    buildNav();
    try{ comTai(); }catch(e){}""", """    buildNav(); if(__tabCu&&__tabCu!==tabHienTai){ try{ go(__tabCu); }catch(e){} }
    try{ comTai(); }catch(e){}""")
# Thoát / hết hạn: xóa bản lưu trên máy
_t38("""  google.script.run.dangXuat(TOKEN);
  try{sessionStorage.removeItem('kpi_token')}catch(e){}""", """  dlXoa_(); tdGui_();
  google.script.run.dangXuat(TOKEN);
  try{sessionStorage.removeItem('kpi_token')}catch(e){}""")
_t38("""  // Không tự tải lại trang nữa: để người dùng kịp chép số đang nhập dở rồi mới đăng nhập lại
  try{sessionStorage.removeItem('kpi_token')}catch(e){}""", """  // Không tự tải lại trang nữa: để người dùng kịp chép số đang nhập dở rồi mới đăng nhập lại
  try{sessionStorage.removeItem('kpi_token')}catch(e){} dlXoa_();""")
# ô tích trên màn đăng nhập
_t38("""        <label class="bb-nho" for="bbNho"><input type="checkbox" id="bbNho">Ghi nhớ mã nhân viên</label>""",
     """        <label class="bb-nho" for="bbNho"><input type="checkbox" id="bbNho">Ghi nhớ mã nhân viên</label>
        <label class="bb-nho" for="bbNhoDL" title="Lần sau mở web hiện ngay số lần trước trong lúc tải số mới. Chỉ tích trên máy / điện thoại của riêng bạn."><input type="checkbox" id="bbNhoDL">Mở nhanh (máy cá nhân)</label>""")
_ver38 = _hl38.md5(s.encode('utf-8')).hexdigest()[:10]
_k38 = s.rfind('</body>')
s = s[:_k38] + """<script>
/* ===== 38. TĂNG TỐC ĐỢT 3 (08/11) – bộ đo tốc độ + mở nhanh bằng số lần trước (mã hóa) ===== */
var TD_BUF=[], TD_T=null, DL_VER='""" + _ver38 + """', DL_HAN=12*3600e3, DL_BO=['SoCCCD','DienThoai','DiaChi','SdtKhanCap','LuongCoBan','NamSinh','SoTaiKhoan','Email'];
function tdGhi_(f,ms,sv){ if(!(ms>=0)||!f) return; TD_BUF.push({f:String(f),ms:Math.round(ms),sv:(typeof sv==='number'?Math.round(sv):null)});
  if(TD_BUF.length>=15) tdGui_(); else if(!TD_T) TD_T=setTimeout(tdGui_,180000); }
function tdGui_(){ if(TD_T){clearTimeout(TD_T);TD_T=null;} if(!TD_BUF.length||typeof TOKEN==='undefined'||!TOKEN) return;
  var a=TD_BUF.splice(0,60); try{ google.script.run.withFailureHandler(function(){}).ghiTocDo(TOKEN,a); }catch(e){} }
document.addEventListener('visibilitychange',function(){ if(document.visibilityState==='hidden') tdGui_(); });
window.addEventListener('load',function(){ try{ var n=performance.getEntriesByType('navigation')[0]; if(n&&n.domContentLoadedEventEnd>0) tdGhi_('trang',n.domContentLoadedEventEnd); }catch(e){} });
/* --- ghi nhớ số liệu trên máy cá nhân (mặc định tắt) --- */
function dlBat_(){ try{ return localStorage.getItem('kpi_nho_dl')==='1'; }catch(e){ return false; } }
function dlNhoLuu_(){ var c=document.getElementById('bbNhoDL'); if(!c) return; try{ if(c.checked) localStorage.setItem('kpi_nho_dl','1'); else { localStorage.removeItem('kpi_nho_dl'); dlXoaHet_(); } }catch(e){} }
(function(){ var c=document.getElementById('bbNhoDL'); if(c) c.checked=dlBat_(); })();
function dlXoaHet_(){ try{ for(var i=localStorage.length-1;i>=0;i--){ var k=localStorage.key(i); if(k&&k.indexOf('kpi_dl_')===0) localStorage.removeItem(k); } }catch(e){} try{ sessionStorage.removeItem('kpi_kl'); }catch(e){} }
function dlXoa_(){ var tk=''; try{ tk=sessionStorage.getItem('kpi_tk')||(ME&&ME.tk)||''; }catch(e){} try{ if(tk) localStorage.removeItem('kpi_dl_'+tk.toLowerCase()); sessionStorage.removeItem('kpi_kl'); }catch(e){} }
function dlB64_(u8){ var s=''; for(var i=0;i<u8.length;i+=8192) s+=String.fromCharCode.apply(null,u8.subarray(i,i+8192)); return btoa(s); }
function dlTuB64_(b){ var s=atob(b), u=new Uint8Array(s.length); for(var i=0;i<s.length;i++) u[i]=s.charCodeAt(i); return u; }
function dlKhoa_(cb){ var k=null; try{ k=sessionStorage.getItem('kpi_kl'); }catch(e){}
  var dung=function(b64){ if(!(window.crypto&&crypto.subtle)) return cb(null); crypto.subtle.importKey('raw',dlTuB64_(b64),'AES-GCM',false,['encrypt','decrypt']).then(cb,function(){cb(null)}); };
  if(k) return dung(k);
  if(typeof TOKEN==='undefined'||!TOKEN) return cb(null);
  google.script.run.withSuccessHandler(function(r){ if(r&&r.ok&&r.khoa){ try{ sessionStorage.setItem('kpi_kl',r.khoa); }catch(e){} dung(r.khoa); } else cb(null); }).withFailureHandler(function(){cb(null)}).layKhoaLuu(TOKEN); }
function dlBoNhay_(o){   /* bỏ trường nhạy cảm của nhân sự trước khi lưu */
  Object.keys(o).forEach(function(k){ var v=o[k];
    if(v&&v.__b===1&&v.c&&v.h){ var giu=[]; v.c.forEach(function(c,j){ if(DL_BO.indexOf(c)<0) giu.push(j); }); if(giu.length<v.c.length){ v.c=giu.map(function(j){return v.c[j]}); v.h=v.h.map(function(d){return giu.map(function(j){return d[j]})}); } }
    else if(Object.prototype.toString.call(v)==='[object Array]') v.forEach(function(x){ if(x&&typeof x==='object') DL_BO.forEach(function(b){ delete x[b]; }); }); });
  return o; }
function dlLuu_(){ var raw=window.__dlRaw; window.__dlRaw=null; if(!dlBat_()||typeof raw!=='string'||!ME||!ME.tk) return;
  setTimeout(function(){ try{ var o=JSON.parse(raw); if(!o||!o.ok) return; var txt=JSON.stringify(dlBoNhay_(o));
    dlKhoa_(function(key){ if(!key) return; var iv=crypto.getRandomValues(new Uint8Array(12));
      crypto.subtle.encrypt({name:'AES-GCM',iv:iv},key,new TextEncoder().encode(txt)).then(function(buf){
        try{ localStorage.setItem('kpi_dl_'+ME.tk.toLowerCase(),JSON.stringify({v:DL_VER,t:Date.now(),iv:dlB64_(iv),d:dlB64_(new Uint8Array(buf))})); }catch(e){ try{ localStorage.removeItem('kpi_dl_'+ME.tk.toLowerCase()); }catch(x){} } }); });
  }catch(e){} },1200); }
function dlNhan_(bat,luc){ var n=document.getElementById('dlNhan');
  if(!bat){ if(n) n.remove(); return; }
  if(!n){ n=document.createElement('div'); n.id='dlNhan'; n.setAttribute('role','status'); document.body.appendChild(n); }
  n.innerHTML='<span class="dl-cham"></span>Đang hiện số lúc '+luc+' · đang cập nhật số mới…'; }
function dlHienCu_(){
  if(!dlBat_()||inApp||typeof TOKEN==='undefined'||!TOKEN) return;
  var tk=''; try{ tk=(sessionStorage.getItem('kpi_tk')||'').toLowerCase(); }catch(e){} if(!tk) return;
  var g=null; try{ g=JSON.parse(localStorage.getItem('kpi_dl_'+tk)||'null'); }catch(e){}
  if(!g||g.v!==DL_VER||!(Date.now()-g.t<DL_HAN)){ try{ localStorage.removeItem('kpi_dl_'+tk); }catch(e){} return; }
  dlKhoa_(function(key){ if(!key||inApp) return;
    crypto.subtle.decrypt({name:'AES-GCM',iv:dlTuB64_(g.iv)},key,dlTuB64_(g.d)).then(function(buf){
      if(inApp) return; var r=moGoi_(new TextDecoder().decode(buf)); if(!r||!r.ok||!r.me) return;
      D=r; ME=r.me; inApp=true; window.__dlCu=true;
      $('gspin').classList.add('hide'); $('gate').style.display='none'; $('app').style.display='block';
      var vt={OWNER:'CHỦ SỞ HỮU',ADMIN:'BAN ĐIỀU HÀNH',TP:'TRƯỞNG PHÒNG',PP:'PHÓ PHÒNG',HR:'NHÂN SỰ',CN:'CÔNG NHÂN'}[ME.laOwner?'OWNER':ME.vaiTro]||ME.vaiTro;
      try{ $('hbadge').textContent=vt; $('hten').textContent=ME.ten; $('hmail').textContent='@'+ME.tk; $('hsub').textContent=ME.tenXuong||'Toàn nhà máy'; }catch(e){}
      var d=new Date(g.t); dlNhan_(true,('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2)+' '+('0'+d.getDate()).slice(-2)+'/'+('0'+(d.getMonth()+1)).slice(-2));
      try{ buildNav(); }catch(e){}
    },function(){ try{ localStorage.removeItem('kpi_dl_'+tk); }catch(e){} });   /* khóa đã đổi (Thoát / đổi mật khẩu ở máy khác) -> bỏ */
  }); }
(function(){ var goc=lerr; lerr=function(m){ if(window.__dlCu){ window.__dlCu=false; inApp=false; dlNhan_(false); try{ $('app').style.display='none'; $('gate').style.display=''; }catch(e){} } return goc.apply(this,arguments); }; })();
</script>
<style>#dlNhan{position:fixed;left:50%;transform:translateX(-50%);top:8px;z-index:140;background:var(--panel2);color:var(--ink);border:1px solid var(--amber);border-radius:999px;padding:5px 14px;font-size:12.5px;box-shadow:0 4px 14px rgba(0,0,0,.25);max-width:calc(100vw - 32px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#dlNhan .dl-cham{display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--amber);margin-right:7px;animation:dlNhay 1s infinite alternate}
@keyframes dlNhay{from{opacity:.3}to{opacity:1}} @media (prefers-reduced-motion:reduce){#dlNhan .dl-cham{animation:none}}</style>
""" + s[_k38:]
