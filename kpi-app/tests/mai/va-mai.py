# -*- coding: utf-8 -*-
"""Mục 12 của va-index.py: gắn nhân vật Mai vào web KPI (được exec bên trong va-index.py, dùng hàm R và biến s/D của nó)."""
import io, os
_MAI = io.open(os.path.join(D, 'mai', 'mai-chibi.js'), encoding='utf-8').read().strip().replace("var MAI=''+", "var MAI_SVG=''+", 1)

MAI_CSS = r"""
/* ===== MAI – nhân vật hướng dẫn / cổ vũ (SVG tự vẽ, tests/mai/mai-chibi.js) ===== */
.mai .duoi{transform-origin:104px 34px;animation:maiDuoi 2.4s ease-in-out infinite}
@keyframes maiDuoi{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(10deg)}}
.mai .than-tren{transform-origin:100px 256px;animation:maiTho 3.2s ease-in-out infinite}
@keyframes maiTho{50%{transform:translateY(1.6px) scaleY(.995)}}
.mai .mat-g{transform-box:fill-box;transform-origin:center;animation:maiChop 4.2s infinite}
@keyframes maiChop{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.08)}}
.mai .mieng-mo{display:none}
.mai.noi .mieng-mo{display:inline;animation:maiNoi .28s steps(2) infinite}
.mai.noi .mieng-cuoi{animation:maiNoi2 .28s steps(2) infinite}
@keyframes maiNoi{0%{opacity:1}100%{opacity:0}}@keyframes maiNoi2{0%{opacity:0}100%{opacity:1}}
.mai .mo-hoi,.mai .lap-lanh,.mai .may-lo{display:none}
.mai.lo .mo-hoi,.mai.lo .may-lo{display:inline}.mai.lo .may-vui{display:none}
.mai.vui .lap-lanh{display:inline}
.mai .tay-chi{transform-origin:128px 180px;transition:transform .4s}
.mai .ngon{display:none}.mai.chi .ngon{display:inline}
.mai.chi .tay-chi{transform:rotate(-70deg)}
.mai.covu .tay-chi{transform:rotate(-142deg)}
.mai.vay .tay-chi{animation:maiVay 1s ease-in-out infinite}
@keyframes maiVay{0%,100%{transform:rotate(-128deg)}50%{transform:rotate(-156deg)}}
.mai .lap-lanh path{animation:maiLap 1.2s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes maiLap{50%{transform:scale(.4);opacity:.4}}
/* lời Mai ở góc màn hình (chào, nhắc nghỉ, khen) */
#maiGoc{position:fixed;right:16px;bottom:16px;z-index:8500;display:flex;align-items:flex-end;width:min(400px,calc(100vw - 20px));transform:translateY(150%);transition:transform .5s cubic-bezier(.3,1.25,.4,1);pointer-events:none}
#maiGoc.hien{transform:none}
#maiGoc svg{width:92px;height:124px;flex:none;margin-right:-16px;position:relative;z-index:1}
#maiGoc .bb{flex:1;background:var(--panel);border:1.5px solid rgba(var(--acc-rgb),.5);border-radius:14px;padding:9px 28px 10px 22px;box-shadow:0 14px 30px rgba(0,0,0,.35);pointer-events:auto;position:relative;color:var(--ink);font-size:13px}
#maiGoc .bb small{display:block;color:var(--ink3);font-size:11.5px}
#maiGoc .bb .kh{font-weight:650;font-size:14px;line-height:1.4;margin:2px 0 4px}
#maiGoc .bb .kh b{color:var(--cyan)}
#maiGoc .x{position:absolute;top:3px;right:6px;background:none;border:0;color:var(--ink3);font-size:17px;cursor:pointer;line-height:1}
.mai-chuoi{display:flex;gap:3px;margin-top:4px}.mai-chuoi i{width:16px;height:16px;border-radius:5px;background:var(--line);font:600 9px/16px sans-serif;text-align:center;font-style:normal;color:var(--ink3)}
.mai-chuoi i.co{background:rgba(var(--acc-rgb),.25);color:var(--cyan)}
/* dải khẩu hiệu của ngày */
.mai-bang{display:flex;align-items:center;gap:10px;padding:4px 12px 0 4px;border-radius:12px;background:linear-gradient(100deg,rgba(var(--acc-rgb),.10),rgba(var(--acc-rgb),.02) 60%);border:1px solid rgba(var(--acc-rgb),.25);overflow:hidden;margin:0 0 14px}
.mai-bang svg{width:58px;height:72px;flex:none;align-self:flex-end;margin-bottom:-3px}
.mai-bang .nd{flex:1;padding:4px 0 8px}.mai-bang .kh{font-weight:650;font-size:14px;line-height:1.4}.mai-bang .kh b{color:var(--cyan)}
.mai-bang small{color:var(--ink3);font-size:11px}
.mai-chip{display:inline-block;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:1px 8px;border-radius:99px;margin-right:6px}
.mc-at{background:rgba(242,107,107,.15);color:#f08a8a}.mc-cl{background:rgba(var(--acc-rgb),.14);color:var(--cyan)}.mc-ns{background:rgba(240,176,78,.15);color:#d99a3a}
.mc-5s{background:rgba(160,140,255,.15);color:#9a88e6}.mc-dd{background:rgba(74,222,128,.13);color:#3fb36a}.mc-sk{background:rgba(120,190,255,.14);color:#5a9fe0}
/* hướng dẫn rọi sáng + hộp đọc lại */
#maiTour{position:fixed;inset:0;z-index:8800;display:none}
#maiTour.mo{display:block}
#maiTour .ro{position:fixed;border-radius:10px;box-shadow:0 0 0 3000px rgba(6,8,10,.66);transition:all .4s cubic-bezier(.3,1,.4,1);pointer-events:none}
#maiTour .ro::after{content:'';position:absolute;inset:-4px;border-radius:12px;border:2px solid var(--cyan);animation:maiRo 1.6s ease-in-out infinite}
@keyframes maiRo{50%{inset:-9px;opacity:.35}}
#maiTour .ro.toan{box-shadow:0 0 0 3000px rgba(6,8,10,.55)}#maiTour .ro.toan::after{display:none}
#maiTour .vn,#maiHop .vn{position:fixed;left:50%;transform:translateX(-50%);bottom:14px;width:min(560px,calc(100vw - 16px));display:flex;align-items:flex-end}
#maiTour .vn svg,#maiHop .vn svg{width:120px;height:162px;flex:none;margin-right:-24px;margin-bottom:-6px;position:relative;z-index:1}
.mai-thoai{flex:1;position:relative;background:var(--panel);border:1.5px solid rgba(var(--acc-rgb),.55);border-radius:16px;padding:14px 12px 10px 30px;min-height:126px;box-shadow:0 14px 34px rgba(0,0,0,.5);color:var(--ink)}
.mai-thoai .ten{position:absolute;top:-11px;left:30px;background:var(--cyan);color:#06201e;font-weight:700;font-size:11px;padding:2px 10px;border-radius:99px}
.mai-thoai .loi{font-size:14px;line-height:1.5;min-height:60px}
.mai-thoai .loi b{color:var(--cyan)}.mai-thoai .loi .do{color:var(--red);font-weight:650}.mai-thoai .loi .vang{color:var(--amber);font-weight:650}
.mai-thoai .dk{display:flex;align-items:center;gap:6px;margin-top:8px}.mai-thoai .dk .buoc{font-size:11px;color:var(--ink3);margin-right:auto}
.mai-tom{margin:6px 0 2px;font-size:13px;background:rgba(0,0,0,.18);border-radius:10px;padding:6px 9px}
.mai-tom div{display:flex;justify-content:space-between;gap:10px;padding:2px 0}
.mai-tom .tong{border-top:1px solid var(--line);margin-top:3px;padding-top:4px;color:var(--ink2)}
#maiHop{position:fixed;inset:0;z-index:8900;background:rgba(6,8,10,.55);display:none}#maiHop.mo{display:block}
@media(max-width:900px){#maiGoc{bottom:76px;right:6px}.mai-thoai .dk{flex-wrap:wrap}.mai-thoai .dk .buoc{width:100%;margin:0 0 2px}.mai-thoai .dk .btn{flex:1}.mai-thoai .loi{font-size:13.5px}#maiTour .vn,#maiHop .vn{bottom:72px}#maiTour .vn svg,#maiHop .vn svg{width:96px;height:130px}}
@media (prefers-reduced-motion:reduce){.mai *,#maiTour .ro::after{animation:none!important}#maiGoc,#maiTour .ro{transition:none!important}}
"""

MAI_JS = r"""
/* ===== MAI – nhân vật hướng dẫn / cổ vũ =====
   Chào mỗi ngày, khẩu hiệu của ngày, hướng dẫn công nhân lần đầu, đọc lại trước khi gửi, khen sau khi gửi,
   động viên theo hạng KPI, nhắc nghỉ giữa ca. Ai không thích bấm nút "Mai" ở đầu trang để tắt (máy nhớ). */
""" + _MAI + r"""
function maiTat(){try{return localStorage.getItem('kpi_mai')==='tat'}catch(e){return false}}
function maiNho(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
function maiHinh(cls){return '<svg class="mai '+(cls||'')+'" viewBox="0 0 200 270" aria-hidden="true">'+MAI_SVG+'</svg>'}
function maiTen(){var t=String(ME&&ME.ten||'').trim().split(/\s+/);return t[t.length-1]||'bạn'}
var MAI_CD={at:['An toàn','mc-at'],cl:['Chất lượng','mc-cl'],ns:['Năng suất','mc-ns'],'5s':['5S – Gọn gàng','mc-5s'],dd:['Đồng đội','mc-dd'],sk:['Sức khỏe','mc-sk']};
var MAI_KH={
  at:['An toàn là trên hết – <b>về nhà bình an</b> mới là thắng lợi!','Đồ bảo hộ đeo đủ, <b>ca làm yên tâm</b>!','Máy kêu lạ? <b>Dừng lại, báo ngay</b> – không sao cả!','Một phút cẩn thận, <b>cả đời bình an</b>.','Thấy nguy hiểm – <b>nhắc nhau một câu</b>, cứu nhau một lần.'],
  cl:['Làm <b>đúng ngay từ đầu</b>, khỏi phải làm lại!','Một sản phẩm đẹp – <b>trăm khách hàng vui</b>!','Kiểm tra kỹ một giây, <b>đỡ lo cả ngày</b>.','Không nhận lỗi – không làm lỗi – <b>không giao lỗi</b>.','Hàng mình làm ra, <b>mình tự hào</b>!'],
  ns:['Từng cái một, <b>cuối ca thành nghìn</b>!','Hôm nay hơn hôm qua một chút là <b>đủ giỏi rồi</b>!','Nhịp tay đều, <b>năng suất lên đều</b>.','Chuẩn bị kỹ đầu ca, <b>làm nhanh cả ngày</b>.','Mỗi phút không chờ việc là <b>một phút ra hàng</b>.'],
  '5s':['Chỗ làm gọn gàng – <b>tay làm nhanh nhẹn</b>!','Dụng cụ đúng chỗ, <b>không mất công tìm</b>.','Sạch máy, <b>máy bền</b> – sạch chỗ, <b>người khỏe</b>.','Cuối ca 5 phút dọn dẹp, <b>đầu ca vào việc ngay</b>.'],
  dd:['Một người khỏe, cả tổ vui – <b>cả xưởng mạnh</b>!','Giúp nhau một tay, <b>cả ca về sớm</b>.','Biết cách hay – <b>chỉ cho nhau</b>, cùng tiến bộ!','Tổ đồng lòng, <b>việc khó cũng xong</b>.'],
  sk:['Làm hết sức – <b>nghỉ hết mình</b>!','Uống đủ nước, <b>tay chân dẻo dai</b>.','Ngủ đủ giấc, <b>ca làm tỉnh táo</b>.','Mệt thì nói – <b>sức khỏe bạn quan trọng nhất</b>.']};
var MAI_THU=['at','cl','ns','5s','dd','sk'];
/* Khẩu hiệu của ngày: cùng một ngày cả nhà máy thấy cùng một câu; ngày sau đổi chủ đề */
function maiKhNgay(dStr){var p=String(dStr||today()).split('-'),n=Math.floor(Date.UTC(+p[0],+p[1]-1,+p[2])/864e5),cd=MAI_THU[((n%6)+6)%6],ds=MAI_KH[cd];return {cd:cd,cau:ds[Math.floor(n/6)%ds.length]}}
function maiChip(cd){return '<span class="mai-chip '+MAI_CD[cd][1]+'">'+MAI_CD[cd][0]+'</span>'}
function maiBang(){
  if(maiTat())return '';
  var k=maiKhNgay();
  return '<div class="mai-bang">'+maiHinh('vui')+'<div class="nd">'+maiChip(k.cd)+'<small>Khẩu hiệu hôm nay · Mai</small><div class="kh">'+k.cau+'</div></div></div>';
}
/* Lời Mai ở góc màn hình */
function maiBan(){var a=$('maiTour'),b=$('maiHop');return !!((a&&a.classList.contains('mo'))||(b&&b.classList.contains('mo')))}
function maiGoc(nho,kh,phu,cls,ms){
  if(maiTat()||maiBan())return false;
  var g=$('maiGoc');
  if(!g){g=document.createElement('div');g.id='maiGoc';g.setAttribute('role','status');document.body.appendChild(g);}
  g.innerHTML=maiHinh(cls||'vui')+'<div class="bb"><button class="x" aria-label="Đóng" onclick="maiGocDong()">×</button><small>'+nho+'</small><div class="kh">'+kh+'</div>'+(phu||'')+'</div>';
  g.classList.remove('hien'); void g.offsetWidth; g.classList.add('hien');
  clearTimeout(maiGoc._h); maiGoc._h=setTimeout(maiGocDong,ms||6500);
  return true;
}
function maiGocDong(){var g=$('maiGoc');if(g)g.classList.remove('hien');clearTimeout(maiGoc._h)}
/* Chào mỗi ngày (lần đầu mở web trong ngày) */
function maiChao(){
  if(maiTat()||!ME)return;
  var khoa='kpi_mai_chao_'+ME.tk; if(maiNho(khoa)===today())return;
  if(maiBan()){ if(!maiChao._lai){maiChao._lai=1;setTimeout(maiChao,20000);} return; }   // đang hướng dẫn: chào sau
  maiNho(khoa,today());
  var g=new Date().getHours(), b=g<11?'☀ Chào buổi sáng':g<18?'🌤 Chào buổi chiều':'🌙 Chào ca tối', k=maiKhNgay();
  maiGoc(b+', '+esc(maiTen())+'!', k.cau, maiChip(k.cd), 'vay vui', 6500);
}
/* Nhắc nghỉ giữa ca 10:00 và 15:00 (mỗi mốc một lần/ngày) */
function maiNghi(){
  if(maiTat()||!ME)return;
  var d=new Date(),g=d.getHours(); if(!(g===10||g===15)||d.getMinutes()>=30)return;
  var khoa='kpi_mai_nghi_'+g; if(maiNho(khoa)===today()||maiBan())return; maiNho(khoa,today());
  var ds=MAI_KH.sk; maiGoc('Mai nhắc giữa ca · '+g+':00','Uống ngụm nước, nhìn xa 20 giây cho mắt nghỉ nhé!',ds[d.getDate()%ds.length].replace(/<\/?b>/g,''),'vui',10000);
}
function maiKhoiDong(){ setTimeout(maiChao,1400); if(!maiKhoiDong._t){ maiKhoiDong._t=setInterval(maiNghi,60000); setTimeout(maiNghi,5000); } }
/* Nút bật/tắt Mai ở đầu trang */
function maiNut(){var b=$('btnMai');if(b){b.textContent=maiTat()?'Mai: tắt':'🙂 Mai';b.title=maiTat()?'Bật lại nhân vật Mai':'Tắt nhân vật Mai (lời chào, khẩu hiệu, cổ vũ)';}}
function maiDoi(){maiNho('kpi_mai',maiTat()?'bat':'tat');maiNut();maiGocDong();toast(maiTat()?'Đã tắt Mai. Bấm lại để bật.':'Đã bật Mai 🙂',true);try{go(tabHienTai)}catch(e){}}
/* Động viên theo hạng KPI (số liệu thật) */
function maiKPI(hang,tong){
  if(maiTat())return '';
  var t={'A+':['vui covu','Bạn đang <b>dẫn đầu</b>! Giữ nhịp này và chỉ mẹo cho đồng đội nhé.'],
    'A':['vui','Rất tốt! Còn <b>'+f(Math.max(0,100-tong))+'%</b> nữa là lên hạng A+.'],
    'B':['','Ổn định đó! Còn <b>'+f(Math.max(0,90-tong))+'%</b> nữa là lên hạng A. Thử <b>giảm hàng lỗi</b> – bớt một cái lỗi là điểm tăng lên.'],
    'C':['lo','Tháng này hơi vất vả. Mai tin bạn làm được hơn! <b>Hỏi trưởng phòng</b> mẹo của công đoạn khó nhé.'],
    'D':['lo','Đừng nản nhé! Nhập <b>đủ sản lượng mỗi ngày</b> và hỏi trưởng phòng cách làm nhanh hơn – Mai cổ vũ bạn!']}[hang]||['','Cố lên nhé!'];
  return '<div class="mai-bang" style="margin-top:12px">'+maiHinh(t[0])+'<div class="nd"><small>Mai nói về KPI của bạn · hạng '+esc(hang)+'</small><div class="kh" style="font-weight:500">'+t[1]+'</div></div></div>';
}
/* Số ngày làm việc liên tiếp (bỏ Chủ nhật) có gửi sản lượng, tính tới hôm nay */
function maiChuoi(){
  var co={}; (D.choDuyet||[]).concat(D.nhatky||[]).forEach(function(r){if(r.MaNV===ME.maNV)co[ngay(r.Ngay)]=1});
  var d=new Date(today()+'T00:00:00'),n=0;
  for(var i=0;i<40;i++){var s=d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);
    if(d.getDay()!==0){ if(co[s])n++; else if(i>0||n>0)break; }
    d.setDate(d.getDate()-1);}
  return n;
}
var MAI_KHEN=['Giỏi quá! Gửi đúng giờ, trưởng phòng duyệt nhanh hơn đó!','Xong một ca rồi! Về nghỉ ngơi thật khỏe nhé!','Cảm ơn bạn đã nhập cẩn thận – số đúng thì KPI mới đúng!','Mỗi ngày gửi đều là một bước gần hơn tới hạng A!','Tuyệt! Hôm nay bạn đã góp phần vào kế hoạch của xưởng!','Làm tốt lắm! Mai ghi nhận rồi nha ✨'];
function maiKhenGui(){
  if(maiTat())return;
  var n=maiChuoi(), c='';
  if(n>=2){c='<div class="mai-chuoi">';for(var i=1;i<=7;i++)c+='<i class="'+(i<=Math.min(n,7)?'co':'')+'">'+(i<=Math.min(n,7)?'✓':i)+'</i>';c+='</div><small>'+n+' ngày liên tiếp gửi đều'+(n<7?' · thêm '+(7-n)+' ngày nữa là tròn tuần!':' – tuyệt vời!')+'</small>';}
  maiGoc('Đã gửi – chờ trưởng phòng duyệt',MAI_KHEN[Math.floor(Math.random()*MAI_KHEN.length)],c,'covu vui',7000);
}
/* Đọc lại trước khi gửi (công nhân): tránh nhập nhầm */
function maiXacNhan(out,ok,huy){
  var h=$('maiHop'); if(!h){h=document.createElement('div');h.id='maiHop';document.body.appendChild(h);}
  var tong=0,loi=0,canh='';
  var dong=out.map(function(r){tong+=Number(r.SoLuongLamRa)||0;loi+=Number(r.SoLoi)||0;
    if(Number(r.SoLuongLamRa)>5000)canh='<div class="vang" style="margin-top:4px">⚠ Có dòng trên 5.000 cái – kiểm tra xem có gõ thừa số 0 không nhé.</div>';
    return '<div><span>'+esc(cd(r.MaCD).TenCD)+'</span><b>'+Number(r.SoLuongLamRa).toLocaleString('vi-VN')+' cái · lỗi '+(Number(r.SoLoi)||0)+'</b></div>';}).join('');
  var nd=String(out[0]&&out[0].Ngay||today());
  h.innerHTML='<div class="vn">'+(maiTat()?'':maiHinh(canh?'lo':'vui'))+'<div class="mai-thoai" role="dialog" aria-label="Kiểm tra trước khi gửi"><span class="ten">Mai · đọc lại trước khi gửi</span>'+
    '<div class="loi">Bạn kiểm tra giúp Mai nhé, ngày <b>'+dmy(nd)+'</b>:<div class="mai-tom">'+dong+'<div class="tong"><span>Tổng</span><span>'+tong.toLocaleString('vi-VN')+' cái · lỗi '+loi+'</span></div></div>'+canh+'</div>'+
    '<div class="dk"><span class="buoc">Duyệt rồi sẽ không sửa được</span><button class="btn" id="maiSua">Sửa lại</button><button class="btn pri" id="maiGui">Đúng rồi, gửi</button></div></div></div>';
  maiGocDong(); h.classList.add('mo');
  var dong2=function(){h.classList.remove('mo');h.innerHTML='';};
  $('maiGui').onclick=function(){dong2();ok();};
  $('maiSua').onclick=function(){dong2();if(huy)huy();};
  h.onclick=function(e){if(e.target===h){dong2();if(huy)huy();}};
  setTimeout(function(){var b=$('maiGui');if(b)b.focus();},50);
}
/* Hướng dẫn rọi sáng cho công nhân (không tự gõ vào ô thật) */
var __maiT={i:0,ds:[]};
function maiPhanTu(f){try{return typeof f==='function'?f():(f?document.querySelector(f):null)}catch(e){return null}}
function maiRo(el){
  var ro=$('maiTour').querySelector('.ro');
  if(!el){ro.className='ro toan';ro.style.cssText='left:50%;top:40%;width:0;height:0';return}
  var r=el.getBoundingClientRect(); window.scrollBy(0,r.top-Math.max(80,innerHeight*0.22));
  setTimeout(function(){var b=el.getBoundingClientRect(),p=6;ro.className='ro';ro.style.cssText='left:'+(b.left-p)+'px;top:'+(b.top-p)+'px;width:'+(b.width+2*p)+'px;height:'+(b.height+2*p)+'px';},GIAM_CD()?0:120);
}
function maiTourDen(i){
  var T=__maiT; if(i<0)i=0; if(i>=T.ds.length){maiTourDong();return;}
  T.i=i; var b=T.ds[i], el=maiPhanTu(b.s);
  var w=$('maiTour'); w.querySelector('.vn svg').setAttribute('class','mai '+(b.cam||'')+(el?' chi':''));
  w.querySelector('.loi').innerHTML=b.t; w.querySelector('.buoc').textContent='Bước '+(i+1)+'/'+T.ds.length;
  $('maiLui').style.visibility=i?'visible':'hidden'; $('maiTiep').textContent=i===T.ds.length-1?'Xong ✓':'Tiếp ›';
  maiRo(el); setTimeout(function(){$('maiTiep').focus()},30);
}
function maiTourDong(){var w=$('maiTour');if(w)w.classList.remove('mo')}
function maiTour(ds,khoa){
  var w=$('maiTour');
  if(!w){w=document.createElement('div');w.id='maiTour';
    w.innerHTML='<div class="ro"></div><div class="vn">'+maiHinh('')+'<div class="mai-thoai" role="dialog" aria-label="Hướng dẫn"><span class="ten">Mai · hướng dẫn viên</span><div class="loi"></div>'+
      '<div class="dk"><span class="buoc"></span><button class="btn" id="maiBo">Bỏ qua</button><button class="btn" id="maiLui">‹ Lại</button><button class="btn pri" id="maiTiep">Tiếp ›</button></div></div></div>';
    document.body.appendChild(w);
    $('maiTiep').onclick=function(){maiTourDen(__maiT.i+1)}; $('maiLui').onclick=function(){maiTourDen(__maiT.i-1)}; $('maiBo').onclick=maiTourDong;
    w.addEventListener('keydown',function(e){if(e.key==='Escape')maiTourDong();});
  }
  if(khoa)maiNho(khoa,'1');
  // chỉ giữ các bước có phần tử thật trên trang (vd. không có khung đỏ "nhập lại" thì bỏ bước đó)
  ds=ds.filter(function(b){return !b.s||maiPhanTu(b.s)});
  maiGocDong(); __maiT={i:0,ds:ds}; w.classList.add('mo'); maiTourDen(0);
}
function maiTourCN(){
  var o=function(sel,n){return function(){var a=document.querySelectorAll(sel);return a[n||0]||null}};
  var daGui=function(){var a=document.querySelectorAll('#main .card h3');for(var i=0;i<a.length;i++)if(/Sản lượng đã gửi/.test(a[i].textContent))return a[i].parentNode;return null};
  maiTour([
    {cam:'vui',t:'Chào <b>'+esc(maiTen())+'</b>! Mình là <b>Mai</b>. Mỗi cuối ca bạn ghi lại <b>mình đã làm công đoạn gì, được bao nhiêu cái</b> ở trang này. Mình chỉ từng ô nhé!'},
    {s:'#cf_ngay',t:'Xem <b>Ngày</b> trước. Web tự để <b>hôm nay</b>; nhập bù hôm qua thì bấm vào đây đổi ngày. <span class="vang">Mỗi ngày chỉ gửi một lần</span>, nên nhập đủ các việc trong ngày rồi mới gửi.'},
    {s:'#cf_socd',t:'Hôm nay làm <b>mấy công đoạn</b>? Ví dụ sáng mài, chiều lắp ráp là <b>2</b>. Ghi số đó rồi bấm <b>Đặt số dòng</b> – mỗi dòng bên dưới là một công đoạn.'},
    {s:o('#cf_grid select'),t:'Cột <b>Công đoạn</b>: chọn <b>đúng tên việc</b> bạn làm. Hai dòng <span class="vang">không được trùng một công đoạn</span> – cùng một việc thì cộng số lại, ghi một dòng.'},
    {s:o('#cf_grid input[type=number]',0),t:'Cột <b>Số lượng</b>: <b>tổng số sản phẩm làm ra</b> ở công đoạn đó, <b>tính cả hàng lỗi</b>. <span class="do">Không ghi số giờ, không ghi số tiền.</span>'},
    {s:o('#cf_grid input[type=number]',1),t:'Cột <b>Số lỗi</b>: số hàng <b>hỏng trong số đó</b>. Không có lỗi thì để <b>0</b>. Số lỗi <span class="do">không bao giờ lớn hơn</span> số lượng.'},
    {s:o('#cf_grid .btn.sm'),t:'Quên một công đoạn? Bấm <b>+</b> để thêm dòng ngay dưới. Thừa dòng thì bấm <b>−</b>.'},
    {s:'#cf_bgui',t:'Xong thì bấm <b>Gửi cho trưởng phòng</b>. Mai sẽ <b>đọc lại từng dòng</b> để bạn kiểm tra trước khi gửi. <span class="vang">Trưởng phòng duyệt rồi thì không sửa được nữa.</span>'},
    {s:daGui,t:'Gửi xong xem ở đây: <span class="vang">Chờ duyệt</span> là trưởng phòng chưa xem, <b>Đã duyệt</b> là đã vào KPI, <span class="do">Bị từ chối</span> là cần nhập lại ngày đó.'},
    {s:'#main .alert.a-bd',cam:'lo',t:'Bị từ chối thì đầu trang hiện <span class="do">khung đỏ</span> ghi ngày cần nhập lại. Chọn đúng ngày đó, nhập lại cho đúng rồi gửi lần nữa.'},
    {cam:'vui',t:'Xong rồi! Nhớ 4 điều: <b>đúng ngày</b> · <b>đúng công đoạn, không trùng</b> · <b>số lượng là số cái làm ra</b> · <b>số lỗi nhỏ hơn số lượng</b>. Quên thì bấm <b>"? Hướng dẫn nhập"</b> ở đầu trang nhé!'}
  ],'kpi_mai_hd_cn_'+ME.tk);
}
"""

R(""".empty.lt-trong b{display:block;color:var(--ink);font-size:15px;margin-bottom:2px}
</style>""", """.empty.lt-trong b{display:block;color:var(--ink);font-size:15px;margin-bottom:2px}""" + MAI_CSS + """</style>""")
R("""/* Fallback: tải nội dung HTML thành file */""", MAI_JS + """
/* Fallback: tải nội dung HTML thành file */""")
# nút bật/tắt Mai ở đầu trang (hiện cả trên điện thoại nhờ lớp hgd)
R("""      <button class="btn sm hgd" id="btnGD" onclick="gdDoi()" title="Đổi nền sáng / tối"></button>""",
  """      <button class="btn sm hgd" id="btnGD" onclick="gdDoi()" title="Đổi nền sáng / tối"></button>
      <button class="btn sm hgd" id="btnMai" onclick="maiDoi()" title="Tắt nhân vật Mai">🙂 Mai</button>""")
# vào hệ thống: chào + nhắc nghỉ
R("""    $('hsub').textContent=ME.tenXuong||'Toàn nhà máy';
    buildNav();""", """    $('hsub').textContent=ME.tenXuong||'Toàn nhà máy';
    buildNav();
    try{ maiNut(); maiKhoiDong(); }catch(e){}""")
# Việc hôm nay: khẩu hiệu của ngày
R("""    '<div class="hn-tom">'+(gap?('Có <b>'+gap+'</b> việc cần bạn xử lý.'):'Không có việc gấp.')+' '+esc(ME.tenXuong||'Toàn nhà máy')+'</div></div></div>';""",
  """    '<div class="hn-tom">'+(gap?('Có <b>'+gap+'</b> việc cần bạn xử lý.'):'Không có việc gấp.')+' '+esc(ME.tenXuong||'Toàn nhà máy')+'</div></div></div>';
  try{ h+=maiBang(); }catch(e){}""")
# Nhập sản lượng: khẩu hiệu + nút hướng dẫn + tự mở hướng dẫn lần đầu
R("""    '<div class="pdesc">'+esc(me.HoTen||ME.ten)+' · '+esc(ME.tenXuong)+'</div>';""",
  """    '<div class="pdesc">'+esc(me.HoTen||ME.ten)+' · '+esc(ME.tenXuong)+
    ' <button class="btn sm" style="margin-left:6px" onclick="maiTourCN()">? Hướng dẫn nhập</button></div>';
  try{ h+=maiBang(); }catch(e){}""")
R("""  $('main').innerHTML=h;
  cnVeGrid();
}""", """  $('main').innerHTML=h;
  cnVeGrid();
  // Lần đầu vào trang: Mai tự hướng dẫn (mỗi tài khoản một lần; xem lại bằng nút "? Hướng dẫn nhập")
  try{ if(!maiTat()&&!maiNho('kpi_mai_hd_cn_'+ME.tk)) setTimeout(function(){ if(tabHienTai==='cnnhap') maiTourCN(); },700); }catch(e){}
}""")
# KPI cá nhân: động viên theo hạng
R("""      box('Xếp loại',lo[0],null,'A đến D')+'</div>';""", """      box('Xếp loại',lo[0],null,'A đến D')+'</div>';
    try{ h+=maiKPI(lo[0],k.tong); }catch(e){}""")
# Gửi sản lượng: đọc lại trước khi gửi, khen sau khi gửi
R("""  call('congNhanGuiSanLuong',[out],function(r){
    cnGui._dangGui=false;""", """  maiXacNhan(out, function(){ call('congNhanGuiSanLuong',[out],function(r){
    cnGui._dangGui=false;
    if(r.ok) setTimeout(function(){ try{maiKhenGui()}catch(e){} },3600);""")
R("""    if(r.ok){cnRows=[];cnLyDo='';cnNgay='';cnGioDung='';cnLuuNhap();reload(vCNNhap)}
  });
}""", """    if(r.ok){cnRows=[];cnLyDo='';cnNgay='';cnGioDung='';cnLuuNhap();reload(vCNNhap)}
  }); }, huy);
}""")
