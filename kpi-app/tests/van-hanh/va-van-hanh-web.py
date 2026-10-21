# -*- coding: utf-8 -*-
"""Mục 23 của va-index.py – các mục tư vấn chủ dự án duyệt 18/10 (kpi-app/TU-VAN-VAN-HANH.md):
A vận hành/KPI, B dễ dùng cho công nhân, C nhắc nhở động viên, D đào tạo hội nhập. Chạy bằng exec() sau mục 22."""

# ---------------------------------------------------------------- A1. KPI tạm tính trên web: định mức theo ngày
R("""    theoNgay[nD].forEach(function(r){
      var d=dm(r.MaCD), n=ngLoi(r), dat=Number(r.SoLuongLamRa)-n;
      if(d>0)gc+=dat/d;""", """    theoNgay[nD].forEach(function(r){
      var d=dmNgay(r.MaCD,nD), n=ngLoi(r), dat=Number(r.SoLuongLamRa)-n;
      if(d>0)gc+=dat/d;""")

# ---------------------------------------------------------------- B2 + B3 + B6. Trang nhập: ô số to, bàn phím số, lỗi tại ô, nút to, không chọn ngày mai
R("""    var inp='padding:6px 7px;font-size:13px;text-align:right';""", """    var inp='text-align:right';   // cỡ chữ / chiều cao: CSS .cn-o (mục 23)""")
R("""      '<td class="n"><input type="number" value="'+esc(r.SoLuongLamRa)+'" min="0" '+
        'oninput="cnSet('+i+',\\'SoLuongLamRa\\',this.value)" style="width:90px;'+inp+'"></td>'+
      '<td class="n"><input type="number" value="'+esc(r.SoLoi)+'" min="0" '+
        'oninput="cnSet('+i+',\\'SoLoi\\',this.value)" style="width:70px;'+inp+'"></td>'+
      '<td class="n" style="white-space:nowrap">'+
        '<button class="btn sm" title="Thêm dòng dưới" onclick="cnThemDong('+i+')">+</button> '+
        '<button class="btn sm dg" title="Xóa dòng" onclick="cnXoaDong('+i+')">−</button></td></tr>';""",
  """      '<td class="n"><input type="number" class="cn-o" id="cn_sl_'+i+'" inputmode="numeric" pattern="[0-9]*" aria-label="Số lượng dòng '+(i+1)+'" value="'+(Number(r.SoLuongLamRa)?esc(r.SoLuongLamRa):'')+'" placeholder="0" min="0" '+
        'onfocus="this.select()" oninput="cnSet('+i+',\\'SoLuongLamRa\\',this.value)" style="width:96px;'+inp+'"></td>'+
      '<td class="n"><input type="number" class="cn-o" id="cn_loi_'+i+'" inputmode="numeric" pattern="[0-9]*" aria-label="Số lỗi dòng '+(i+1)+'" value="'+(Number(r.SoLoi)?esc(r.SoLoi):'')+'" placeholder="0" min="0" '+
        'onfocus="this.select()" oninput="cnSet('+i+',\\'SoLoi\\',this.value)" style="width:76px;'+inp+'"></td>'+
      '<td class="n" style="white-space:nowrap">'+
        '<button class="btn sm cn-nut" title="Thêm dòng dưới" aria-label="Thêm dòng dưới dòng '+(i+1)+'" onclick="cnThemDong('+i+')">+</button> '+
        '<button class="btn sm dg cn-nut" title="Xóa dòng" aria-label="Xóa dòng '+(i+1)+'" onclick="cnXoaDong('+i+')">−</button></td></tr>';""")
R("""      '<td><select onchange="cnSet('+i+',\\'MaCD\\',this.value)" style="padding:6px 7px;font-size:13px;width:100%">'""",
  """      '<td><select id="cn_cd_'+i+'" class="cn-o" aria-label="Công đoạn dòng '+(i+1)+'" onchange="cnSet('+i+',\\'MaCD\\',this.value)" style="width:100%">'""")
R("""    '<div><label>Ngày</label><input type="date" id="cf_ngay" value="'+esc(cnNgay)+'" onchange="cnNgay=this.value;cnLuuNhap()"></div>'+""",
  """    '<div><label for="cf_ngay">Ngày</label><input type="date" id="cf_ngay" value="'+esc(cnNgay)+'" max="'+today()+'" onchange="cnNgay=this.value;cnLuuNhap()"></div>'+""")
# Lỗi: viền đỏ + lời báo ngay dưới ô sai, đưa con trỏ vào ô; giữ tới khi sửa
R("""    if(!r.MaCD){toast('Dòng '+(i+1)+': chưa chọn công đoạn');huy();return}
    if(!(Number(r.SoLuongLamRa)>0)){toast('Dòng '+(i+1)+': chưa nhập số lượng');huy();return}
    if(Number(r.SoLoi)>Number(r.SoLuongLamRa)){toast('Dòng '+(i+1)+': số lỗi không thể lớn hơn số làm ra');huy();return}""",
  """    if(!r.MaCD){cnLoiO('cn_cd_'+i,'Dòng '+(i+1)+': chưa chọn công đoạn');huy();return}
    if(!(Number(r.SoLuongLamRa)>0)){cnLoiO('cn_sl_'+i,'Dòng '+(i+1)+': chưa nhập số lượng');huy();return}
    if(Number(r.SoLoi)>Number(r.SoLuongLamRa)){cnLoiO('cn_loi_'+i,'Dòng '+(i+1)+': số lỗi không thể lớn hơn số làm ra');huy();return}""")
R("""    if(dem[mc]){toast('Có công đoạn bị nhập trùng: '+cd(mc).TenCD+'. Gộp lại thành một dòng.');huy();return}""",
  """    if(dem[mc]){cnLoiO('cn_cd_'+j,'Có công đoạn bị nhập trùng: '+cd(mc).TenCD+'. Gộp lại thành một dòng.');huy();return}""")
R("""function cnSet(i,field,val){
  if(!cnRows[i])return;""", """function cnSet(i,field,val){
  if(!cnRows[i])return;
  cnBoLoi();""")
# B1. Lưu nháp vào máy (điện thoại tự đóng trang vẫn còn); gửi xong thì xóa
R("""function cnLuuNhap(){window.__cnRows=cnRows;window.__cnLyDo=cnLyDo;window.__cnNgay=cnNgay;window.__cnGioDung=cnGioDung;}""",
  """function cnLuuNhap(){window.__cnRows=cnRows;window.__cnLyDo=cnLyDo;window.__cnNgay=cnNgay;window.__cnGioDung=cnGioDung;
  try{ var k='kpi_cn_nhap_'+(ME&&ME.tk||''), co=cnRows.some(function(r){return Number(r.SoLuongLamRa)>0||Number(r.SoLoi)>0});
    if(co)localStorage.setItem(k,JSON.stringify({rows:cnRows,ngay:cnNgay,luc:Date.now()})); else localStorage.removeItem(k); }catch(e){} }
/* Nháp còn trong máy (mở lại trang / điện thoại tự đóng tab) – giữ tối đa 3 ngày */
function cnNapNhap(){
  if(cnRows.length)return;
  try{ var o=JSON.parse(localStorage.getItem('kpi_cn_nhap_'+ME.tk)||'null');
    if(o&&o.rows&&o.rows.length&&Date.now()-o.luc<3*864e5){cnRows=o.rows;cnNgay=o.ngay||'';cnLuuNhap();cnNapNhap._da=1;} }catch(e){}
}""")
R("""function vCNNhap(){
  var me=nv(ME.maNV);
  var ok=cnCDOK();""", """function vCNNhap(){
  var me=nv(ME.maNV);
  cnNapNhap();
  var ok=cnCDOK();""")
# B5. Sau khi gửi: hoạt ảnh ngắn hơn
R("""    if(r.ok) setTimeout(function(){ try{maiKhenGui()}catch(e){} },3600);
    if(r.ok) ltXong('Đã gửi – chờ trưởng phòng duyệt', (r.msg||'')+' Duyệt xong mới tính vào KPI.', 'gui-cho-duyet', 3200); else toast(r.msg,false);""",
  """    if(r.ok) setTimeout(function(){ try{maiKhenGui()}catch(e){} },2300);
    if(r.ok) ltXong('Đã gửi – chờ trưởng phòng duyệt', (r.msg||'')+' Duyệt xong mới tính vào KPI.', 'gui-cho-duyet', 2000); else toast(r.msg,false);""")
R("""  maiXacNhan(out, function(){ call('congNhanGuiSanLuong',[out],function(r){""", """  window.__vhVuaGui=out;   // C4: khen theo đúng số vừa gửi
  maiXacNhan(out, function(){ call('congNhanGuiSanLuong',[out],function(r){""")
# B7. Hộp đọc lại trước khi gửi: chạm ra ngoài không đóng; Esc = Sửa lại; đúng chuẩn hộp thoại
R("""  $('maiGui').onclick=function(){dong2();ok();};
  $('maiSua').onclick=function(){dong2();if(huy)huy();};
  h.onclick=function(e){if(e.target===h){dong2();if(huy)huy();}};""", """  var phim=function(e){ if(e.key==='Escape'){ e.preventDefault(); sua(); } else if(e.key==='Tab'){ var a=$('maiSua'),b=$('maiGui'); if(e.shiftKey&&document.activeElement===a){e.preventDefault();b.focus();} else if(!e.shiftKey&&document.activeElement===b){e.preventDefault();a.focus();} } };
  var sua=function(){ document.removeEventListener('keydown',phim,true); dong2(); if(huy)huy(); };
  document.addEventListener('keydown',phim,true);
  var tl=h.querySelector('.mai-thoai'); if(tl)tl.setAttribute('aria-modal','true');
  $('maiGui').onclick=function(){ document.removeEventListener('keydown',phim,true); dong2(); ok(); };
  $('maiSua').onclick=sua;
  h.onclick=null;   // chạm nhầm ra ngoài không đóng hộp""")
# B8. Mất mạng lúc đăng nhập: câu tiếng Việt, giữ nguyên mã đã gõ
R("""    lerr('Không kết nối được: '+(e.message||e));
  }).dangNhap(tk,mk);""", """    lerr('Mạng yếu, chưa kết nối được – bấm Đăng nhập lần nữa.');
  }).dangNhap(tk,mk);""")
R("""loi.textContent='Không kết nối được: '+(e.message||e); }).dangNhap(tk,mk)""", """loi.textContent='Mạng yếu, chưa kết nối được – bấm Đăng nhập lần nữa.'; }).dangNhap(tk,mk)""")
# B1. Hết phiên: "Tải lại trang" hỏi lại nếu còn số chưa gửi
R("""  hop.querySelector('.tai').onclick=function(){ location.reload(); };""", """  hop.querySelector('.tai').onclick=function(){ var co=(window.__cnRows||[]).some(function(r){return Number(r.SoLuongLamRa)>0});
    if(co&&!confirm('Bạn còn số sản lượng chưa gửi. Tải lại trang thì số đó vẫn được giữ trong máy, mở lại trang Nhập là thấy. Tải lại?'))return; location.reload(); };""")
# B4. Cửa cuốn màn đăng nhập: mỗi máy 1 lần mỗi ngày (chủ dự án 18/10)
R("""  if (LK_HU.cua && !bbGiam()) lkCua(); else if (LK_HU.day && !bbGiam()) lkDay();""", """  if (LK_HU.cua && !bbGiam() && lkCuaHomNay()) lkCua(); else if (LK_HU.day && !bbGiam()) lkDay();""")
R("""function lkMoCua() {""", """/* Cửa cuốn chỉ hiện lần mở web đầu tiên trong ngày trên mỗi máy (chủ dự án 18/10) */
function lkCuaHomNay() {
  var d = new Date(), h = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  try { if (localStorage.getItem('kpi_cua_ngay') === h) return false; localStorage.setItem('kpi_cua_ngay', h); } catch (e) {}
  return true;
}
function lkMoCua() {""")
# B5. Đăng nhập đúng: tải dữ liệu NGAY trong lúc laser khắc tên (trước đây đợi khắc xong mới tải)
R("""    TOKEN=r.token; ME=r.me;
    try{sessionStorage.setItem('kpi_token',TOKEN)}catch(e){}
    $('btnLogin').disabled=true;
    bbTrung(function(){""", """    TOKEN=r.token; ME=r.me;
    try{sessionStorage.setItem('kpi_token',TOKEN)}catch(e){}
    $('btnLogin').disabled=true;
    if(!ME.phaiDoiMK) napTruoc_(TOKEN);
    bbTrung(function(){""")
R("""function vaoHeThong(){
  $('gspin').classList.remove('hide');
  google.script.run.withSuccessHandler(function(r){""", """/* B5: nạp dữ liệu song song với hoạt cảnh đăng nhập; vaoHeThong dùng lại kết quả nếu đã có / đang tải */
var __napT=null;
function napTruoc_(tk){
  var o=__napT={tk:tk,xong:false,r:null,e:null,cho:null};
  google.script.run.withSuccessHandler(function(r){o.xong=true;o.r=r;if(o.cho)o.cho();})
    .withFailureHandler(function(e){o.xong=true;o.e=e||{};if(o.cho)o.cho();}).napDuLieu(tk);
}
function napCo_(){
  var c={s:null,f:null};
  c.withSuccessHandler=function(s){c.s=s;return c};
  c.withFailureHandler=function(f){c.f=f;return c};
  c.napDuLieu=function(tk){
    var o=__napT; __napT=null;
    if(!o||o.tk!==tk){ google.script.run.withSuccessHandler(c.s).withFailureHandler(c.f).napDuLieu(tk); return; }
    var di=function(){ if(o.e)c.f(o.e); else c.s(o.r); };
    if(o.xong)di(); else o.cho=di;
  };
  return c;
}
function vaoHeThong(){
  $('gspin').classList.remove('hide');
  napCo_().withSuccessHandler(function(r){""")
R("""<div id="toast"></div>""", """<div id="toast" role="status" aria-live="polite"></div>""")

# ---------------------------------------------------------------- D3. KPI của tôi: tháng học việc thì không xếp loại
R("""      box('Xếp loại',lo[0],null,'A đến D')+'</div>';
    try{ h+=maiKPI(lo[0],k.tong); }catch(e){}""", """      box('Xếp loại',vhHocViec()?'Học việc':lo[0],null,vhHocViec()?'tháng đầu chưa xếp loại':'A đến D')+'</div>';
    try{ h+=vhHocViec()?vhMaiHocViec():maiKPI(lo[0],k.tong); }catch(e){}""")
R("""    var k=kpi(ME.maNV), hang=k?loai(k.tong)[0]:'', chuoi=maiChuoi(), khoa='kpi_phao_'+ME.tk;
    if((/^A/.test(hang)||chuoi>=7)&&maiNho(khoa)!==today()){
      maiNho(khoa,today());""", """    var k=kpi(ME.maNV), hang=k?loai(k.tong)[0]:'', chuoi=maiChuoi(), khoa='kpi_phao_'+ME.tk;
    var hangCu=maiNho('kpi_hang_'+ME.tk)||'', thu=['D','C','B','A','A+'], lenHang=hang&&hangCu&&thu.indexOf(hang)>thu.indexOf(hangCu);
    if(hang&&!vhHocViec())maiNho('kpi_hang_'+ME.tk,hang);
    if(lenHang&&!vhHocViec()&&maiNho(khoa)!==today()){   // C7: pháo giấy chỉ khi LÊN HẠNG (giữ giá trị phần thưởng)
      maiNho(khoa,today());""")
R("""ttBao(/^A/.test(hang)?'🎉 Hạng '+hang+' – tuyệt vời!':'🎉 '+chuoi+' ngày liền gửi đều – tuyệt vời!');""",
  """ttBao('🎉 Lên hạng '+hang+' – tuyệt vời!');""")

_k23 = s.rfind('</body>')
s = s[:_k23] + io.open(os.path.join(D, 'van-hanh', 'van-hanh-web.html'), encoding='utf-8').read() + s[_k23:]

# D3: bảng KPI – người đang học việc (hạng 0) xếp cuối, cột hạng ghi "–"
R("""    arr=arr.slice().sort(function(a,b){return a.hang-b.hang});""", """    arr=arr.slice().sort(function(a,b){return (a.hang||1e9)-(b.hang||1e9)});   // hạng 0 = đang học việc: xếp cuối""")
R("""      var huy=o.hang<=3?""", """      var huy=!o.hang?'<span title="Đang học việc – chưa xếp hạng">–</span>':o.hang<=3?""")
R("""        box('Hạng của bạn','#'+me.hang+' / '+(theoXuong[me.MaXuong]||[]).length,null,'trong xưởng')+""", """        box('Hạng của bạn',me.hang?'#'+me.hang+' / '+(theoXuong[me.MaXuong]||[]).length:'Học việc',null,me.hang?'trong xưởng':'tháng đầu chưa xếp hạng')+""")
R("""      body+='<tr'+(o.hang<=3?' class="gd-top"':'')""", """      body+='<tr'+(o.hang&&o.hang<=3?' class="gd-top"':'')""")
