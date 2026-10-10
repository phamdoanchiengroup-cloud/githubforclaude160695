/* ===== 14) HIỆU ỨNG THAO TÁC (chủ dự án duyệt 10/10 từ demo-thao-tac.html) =====
   9  Duyệt / từ chối sản lượng: tem "ĐÃ DUYỆT"/"TRẢ LẠI" + "Hoàn tác" 4 giây trước khi gửi máy chủ; điện thoại vuốt cả nhóm (phải = duyệt, trái = từ chối)
   10 Chốt ca bằng cần gạt (kéo hẳn xuống đáy mới chốt; bàn phím: Enter)
   12 Chờ chốt: vuốt trái để xóa dòng (điện thoại) + "Hoàn tác" 5 giây (cả nút Xóa)
   13 Kéo xuống ở đầu trang để làm mới (điện thoại; trừ trang công nhân nhập sản lượng và điểm danh)
   14 Nhập sai: ô rung (đã có) + Mai đứng cạnh chỉ vào ô và nói lỗi (trừ trang công nhân nhập sản lượng)
   15 Pháo giấy khi mở KPI cá nhân đạt hạng A/A+ hoặc gửi đều 7 ngày liền – mỗi ngày tối đa 1 lần
   16 Hết phiên: màn tối, dây thả xuống; kéo dây là đèn sáng + hộp đăng nhập lại tại chỗ (không mất trang đang xem)
   Phần công nhân nhập sản lượng và điểm danh GIỮ NGUYÊN như cũ (theo yêu cầu chủ dự án). */
var TT_MS = 4000;            // thời gian còn "Hoàn tác" trước khi gửi duyệt / từ chối lên máy chủ
function ttRung(ms){ try{ if(navigator.vibrate) navigator.vibrate(ms); }catch(e){} }
function ttCham(){ try{ return matchMedia('(pointer:coarse)').matches; }catch(e){ return false; } }

/* Thanh báo dưới đáy, có nút Hoàn tác + vạch đếm ngược */
var TT_HEN = null;           // việc đang chờ gửi máy chủ {lam, huy, ids, h}
function ttBaoDong(){ var t=$('ttBao'); if(t) t.classList.remove('hien'); }
function ttBao(chu, nut, fn, ms, laHen){
  if(!laHen) ttHenXong();
  try{ maiGocDong(); }catch(e){}   // bong bóng Mai ở góc che mất nút Hoàn tác trên điện thoại
  var t=$('ttBao'); if(!t){ t=document.createElement('div'); t.id='ttBao'; t.setAttribute('role','status'); document.body.appendChild(t); }
  t.innerHTML='<span></span>'+(nut?'<button type="button"></button>':'')+'<i></i>';
  t.firstChild.textContent=chu; if(nut) t.querySelector('button').textContent=nut;
  void t.offsetWidth; t.classList.add('hien');
  var vach=t.querySelector('i'); ms=ms||2600;
  if(vach.animate&&!GIAM_CD()) vach.animate([{transform:'scaleX(1)'},{transform:'scaleX(0)'}],{duration:ms,easing:'linear',fill:'forwards'}); else vach.style.display='none';
  if(nut) t.querySelector('button').onclick=function(){ clearTimeout(t.__h); t.classList.remove('hien'); if(fn) fn(); };
  clearTimeout(t.__h); t.__h=setTimeout(function(){ t.classList.remove('hien'); },ms);
}
/* Hẹn làm sau ms (để còn Hoàn tác). Có việc mới thì việc cũ được gửi ngay. */
function ttHenXong(){ if(TT_HEN){ var x=TT_HEN; TT_HEN=null; clearTimeout(x.h); ttBaoDong(); x.lam(); } }
function ttHen(chu, lam, huy, ids, ms){
  ttHenXong();
  var x={lam:lam, huy:huy, ids:ids||''}; ms=ms||TT_MS;
  x.h=setTimeout(function(){ if(TT_HEN===x){ TT_HEN=null; lam(); } }, ms);
  TT_HEN=x;
  ttBao(chu,'Hoàn tác',function(){ if(TT_HEN===x){ TT_HEN=null; clearTimeout(x.h); huy(); } }, ms, true);
}
window.addEventListener('pagehide', function(){ try{ ttHenXong(); }catch(e){} });

/* Kéo chung: chỉ coi là kéo khi đi quá 8px đúng trục; chiCham = chỉ nhận ngón tay */
function ttKeo(el, o){
  var x0=null, y0=0, dang=false, id=null;
  el.addEventListener('pointerdown',function(e){
    if(e.button>0||(o.chiCham&&e.pointerType!=='touch'))return;
    if(o.boQua&&o.boQua(e))return;
    x0=e.clientX; y0=e.clientY; dang=false; id=e.pointerId;
    if(o.giuNgay){ try{el.setPointerCapture(id)}catch(x){} }
  });
  el.addEventListener('pointermove',function(e){
    if(x0==null||id!==e.pointerId)return;
    var dx=e.clientX-x0, dy=e.clientY-y0;
    if(!dang){ var d=o.truc==='x'?Math.abs(dx):Math.abs(dy), k=o.truc==='x'?Math.abs(dy):Math.abs(dx);
      if(d<8)return; if(k>d){ x0=null; return; } dang=true; try{el.setPointerCapture(id)}catch(x){} o.dau&&o.dau(); }
    o.di&&o.di(dx,dy);
  });
  var tha=function(e){ if(id!==e.pointerId)return; var dx=e.clientX-x0, dy=e.clientY-y0;
    if(dang) o.tha&&o.tha(dx,dy); else if(x0!=null) o.bam&&o.bam(); x0=null; dang=false; id=null; };
  el.addEventListener('pointerup',tha);
  el.addEventListener('pointercancel',function(){ if(dang) o.tha&&o.tha(0,0); x0=null; dang=false; id=null; });
}
function ttLaONhap(e){ return !!(e.target&&e.target.closest&&e.target.closest('input,select,textarea,button,label,a,.vuot')); }

/* ---------- 9. Duyệt / từ chối có Hoàn tác + vuốt nhóm ---------- */
function ttTick(ids){ var ds=document.querySelectorAll('.sl-tick'); for(var i=0;i<ds.length;i++) if(ds[i].getAttribute('data-ids')===ids) return ds[i]; return null; }
function ttDongNhom(ids){
  var t=ttTick(ids); if(!t)return [];
  var cuoi=t.closest('tr'), rows=[cuoi], p=cuoi.previousElementSibling;
  while(p && !p.querySelector('.sl-tick') && !p.classList.contains('vuot-dong')){ rows.unshift(p); p=p.previousElementSibling; }
  var n=cuoi.nextElementSibling; if(n&&n.classList.contains('vuot-dong')) rows.push(n);
  return rows;
}
function ttTenNhom(rows){ var td=rows[0]&&rows[0].querySelector('td[rowspan]'); return td&&td.firstChild?String(td.firstChild.textContent||'').trim():''; }
function ttTem(rows, loai){
  var t=rows.filter(function(r){return r.querySelector('.sl-tick')})[0]; if(!t)return null;
  var td=t.lastElementChild, s=td.querySelector('.tt-tem');
  if(!s){ s=document.createElement('span'); td.appendChild(s); }
  s.className='tt-tem '+loai; s.textContent=loai==='ok'?'ĐÃ DUYỆT':'TRẢ LẠI'; t.classList.add('tt-chan');
  return s;
}
function ttDanTem(rows, loai){
  rows.forEach(function(r){ r.classList.add('tt-cho'); r.style.transform=''; });
  var s=ttTem(rows,loai); if(s){ void s.offsetWidth; s.classList.add('hien'); }
}
function ttChupO(){ var o={}; Array.prototype.forEach.call(document.querySelectorAll('#main input[id^="slr_"],#main input[id^="sl_"]'),function(i){o[i.id]=i.value}); return o; }
function ttTraO(o){ for(var k in o){ var i=$(k); if(i&&i.value!==o[k]){ i.value=o[k]; try{ i.dispatchEvent(new Event('input')); }catch(e){} } } }
function ttVeLaiDuyet(giu){ var o=ttChupO(); for(var k in (giu||{})) o[k]=giu[k]; if(tabHienTai==='duyetsl'){ vDuyetSL(); ttTraO(o); } }
function ttSua(ids){ var s={}; ids.forEach(function(id){ var x={}, a=$('slr_'+id), b=$('sl_'+id); if(a)x.SoLuongLamRa=Number(a.value)||0; if(b)x.soLoi=Number(b.value)||0; s[id]=x; }); return s; }
function ttGoi(fn, args, cb, nut){ try{ if(document.activeElement&&document.activeElement.blur) document.activeElement.blur(); }catch(e){} window.__nutHU=(nut&&document.body.contains(nut))?nut:null; call(fn,args,cb); }
var _ttDuyetNguoi=duyetNguoi;
duyetNguoi=function(idsStr, gk){
  var ids=idsStr.split(','), sua=ttSua(ids), giu=ttChupO(), rows=ttDongNhom(idsStr), ten=ttTenNhom(rows);
  var nut=rows.length?rows.filter(function(r){return r.querySelector('.sl-tick')})[0].querySelector('.btn.pri'):null;
  ttDanTem(rows,'ok'); ttRung(20);
  ttHen('Đã duyệt '+(ten||'sản lượng'), function(){
    ttGoi('duyetNhomNguoi',[ids,0,'',sua],function(r){
      toast(r.msg,r.ok);
      if(r.ok) reload(function(){vDuyetSL();capNhatChamSL();capNhatDucBar();}); else ttVeLaiDuyet(giu);
    }, nut);
  }, function(){ ttVeLaiDuyet(giu); }, idsStr);
};
var _ttTuChoiNguoi=tuChoiNguoi;
tuChoiNguoi=function(idsStr){
  var ids=idsStr.split(','), giu=ttChupO(), rows=ttDongNhom(idsStr), ten=ttTenNhom(rows);
  ttDanTem(rows,'tl'); ttRung([20,30,20]);
  ttHen('Đã trả lại '+(ten||'sản lượng')+' để nhập lại', function(){
    ttGoi('tuChoiNhieu',[ids],function(r){
      if(r.ok) ltXong('Đã trả lại để nhập lại', r.msg, 'tra-lai', 2600); else toast(r.msg,false);
      if(r.ok) reload(function(){vDuyetSL();capNhatChamSL();capNhatDucBar();}); else ttVeLaiDuyet(giu);
    });
  }, function(){ ttVeLaiDuyet(giu); }, idsStr, TT_MS+1000);
};
function ttGanDuyet(){
  // vẽ lại trong lúc còn "Hoàn tác": giữ nhóm đó mờ + tem
  if(TT_HEN&&TT_HEN.ids){ var r0=ttDongNhom(TT_HEN.ids); if(r0.length) ttDanTem(r0, /trả lại/.test(($('ttBao')||{}).textContent||'')?'tl':'ok'); }
  if(!ttCham())return;
  var dem=$('slChonCount');
  if(dem&&!$('ttGoiY')){ var g=document.createElement('p'); g.id='ttGoiY'; g.className='tt-goi-y'; g.textContent='Mẹo: vuốt cả nhóm sang phải = Duyệt, sang trái = Từ chối. Có 4 giây để Hoàn tác.'; dem.parentNode.parentNode.insertBefore(g,dem.parentNode.nextSibling); }
  Array.prototype.forEach.call(document.querySelectorAll('.sl-tick'),function(t){
    var ids=t.getAttribute('data-ids'), gk=t.getAttribute('data-gk'), rows=ttDongNhom(ids);
    if(!rows.length||(TT_HEN&&TT_HEN.ids===ids))return;
    var dat=function(dx){ rows.forEach(function(r){ r.style.transform=dx?'translateX('+dx+'px)':''; }); };
    rows.forEach(function(r){ r.classList.add('tt-keo');
      ttKeo(r,{truc:'x',chiCham:true,boQua:ttLaONhap,
        dau:function(){ rows.forEach(function(x){x.classList.remove('ve');x.classList.add('dang')}); },
        di:function(dx){ dat(dx); var s=ttTem(rows,dx>0?'ok':'tl'); if(s){ s.style.opacity=Math.min(1,Math.abs(dx)/90); s.style.transform='translateY(-50%) rotate(-8deg)'; } },
        tha:function(dx){ rows.forEach(function(x){x.classList.remove('dang');x.classList.add('ve')});
          var s=rows.length&&rows[rows.length-1].parentNode.querySelector('.tt-tem'); if(s){ s.style.opacity=''; s.style.transform=''; }
          if(Math.abs(dx)>90){ dat(0); if(dx>0) duyetNguoi(ids,gk); else tuChoiNguoi(ids); }
          else { dat(0); if(s&&!(TT_HEN&&TT_HEN.ids===ids)) s.remove(); } } });
    });
  });
}
var _ttVDuyetSL=vDuyetSL;
vDuyetSL=function(){ var kq=_ttVDuyetSL.apply(this,arguments); try{ ttGanDuyet(); }catch(e){} return kq; };

/* ---------- 10. Chốt ca bằng cần gạt ---------- */
function ttCanGat(){
  var b=$('bchot'); if(!b)return;
  var acts=b.parentNode, cu=acts.parentNode.querySelector('.tt-chot'); if(cu) cu.remove();
  b.style.display='none';
  var nguoi={}, tong=0; draft.forEach(function(r){ nguoi[r.MaNV]=1; tong+=Number(r.SoLuongLamRa)||0; });
  var n=draft.length, w=document.createElement('div'); w.className='tt-chot';
  w.innerHTML='<div class="tom">'+(n?'<b>'+n+' dòng</b> chờ chốt · '+Object.keys(nguoi).length+' người · tổng <b>'+tong.toLocaleString('vi-VN')+'</b> sản phẩm':'Chưa có dòng nào để chốt')+
    '<div class="kq" aria-live="polite">'+(n?'Kéo cần gạt xuống tận đáy để chốt ca':'')+'</div></div>'+
    '<div class="tt-may'+(n?'':' tat')+'"><span class="den"></span><span class="chu" style="top:9px">MỞ</span><span class="chu" style="bottom:8px">CHỐT</span><div class="khe"></div>'+
    '<button type="button" class="can" aria-label="Kéo cần gạt xuống để chốt ca (hoặc nhấn Enter)"'+(n?'':' disabled')+'><i></i></button></div>';
  acts.parentNode.insertBefore(w,acts);
  var can=w.querySelector('.can'), may=w.querySelector('.tt-may'), kq=w.querySelector('.kq'), max=function(){ return may.clientHeight-14-14-40; }, xong=false;
  var veLai=function(){ xong=false; can.style.transform=''; can.classList.remove('xong'); w.querySelector('.den').classList.remove('xanh'); kq.className='kq'; kq.textContent='Kéo cần gạt xuống tận đáy để chốt ca'; };
  var keoXong=function(){
    if(xong||!draft.length)return; xong=true;
    can.style.transform='translateY('+max()+'px)'; can.classList.add('xong'); ttRung([20,30,40]);
    setTimeout(function(){ may.classList.add('cach'); w.querySelector('.den').classList.add('xanh'); kq.className='kq ok'; kq.textContent='Đang chốt ca…';
      chot();
      var t0=Date.now(), h=setInterval(function(){   // chốt không xong (lỗi / bấm Hủy ở hộp trùng) thì cần bật về
        if(!document.body.contains(w)){ clearInterval(h); return; }
        if(!chot._dangChay&&Date.now()-t0>600){ clearInterval(h); veLai(); }
        else if(Date.now()-t0>90000) clearInterval(h);
      },400);
    },300);
  };
  ttKeo(can,{truc:'y',giuNgay:true,dau:function(){ if(!xong) can.classList.add('dang'); },
    di:function(dx,dy){ if(xong)return; can.style.transform='translateY('+Math.max(0,Math.min(max(),dy))+'px)'; },
    tha:function(dx,dy){ can.classList.remove('dang'); if(xong)return; if(dy>=max()*.85) keoXong(); else { can.style.transform=''; if(dy>20) ttRung(10); } },
    bam:function(){ if(xong||!draft.length)return; can.style.transform='translateY(16px)'; setTimeout(function(){ if(!xong) can.style.transform=''; },250); kq.textContent='Kéo hẳn xuống đáy mới chốt nhé (bàn phím: Enter)'; }});
  can.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); keoXong(); } });
}

/* ---------- 12. Chờ chốt: vuốt trái để xóa + Hoàn tác ---------- */
var _ttDelD=delD;
delD=function(i){
  var r=draft[i]; if(!r)return;
  draft.splice(i,1); vNK(); ttRung(20);
  ttBao('Đã xóa dòng '+(nv(r.MaNV).HoTen||r.MaNV)+' – '+(cd(r.MaCD).TenCD||''),'Hoàn tác',function(){ draft.splice(Math.min(i,draft.length),0,r); vNK(); },5000);
};
function ttGanXoa(){
  if(!ttCham())return;
  Array.prototype.forEach.call(document.querySelectorAll('#dbox button[onclick^="delD("]'),function(b){
    var tr=b.closest('tr'), i=+String(b.getAttribute('onclick')).replace(/\D+/g,''); if(!tr)return;
    var o=Array.prototype.filter.call(tr.children,function(td){return !td.hasAttribute('rowspan')});
    var dat=function(x,ve){ o.forEach(function(td){ td.style.transition=ve?'transform .3s':'none'; td.style.transform=x?'translateX('+x+'px)':''; }); };
    tr.classList.add('tt-xoa');
    ttKeo(tr,{truc:'x',chiCham:true,boQua:ttLaONhap,dau:function(){tr.classList.add('dang')},
      di:function(dx){ dat(Math.min(0,dx)); },
      tha:function(dx){ tr.classList.remove('dang'); if(dx<-Math.min(140,tr.clientWidth*.4)){ dat(-tr.clientWidth,true); setTimeout(function(){ delD(i); },180); } else dat(0,true); }});
  });
}
var _ttRenderDraft=renderDraft;
renderDraft=function(){ var kq=_ttRenderDraft.apply(this,arguments); try{ ttCanGat(); }catch(e){} try{ ttGanXoa(); }catch(e){} return kq; };

/* ---------- 13. Kéo xuống ở đầu trang để làm mới (điện thoại) ---------- */
var TT_KHONG_KEO={cnnhap:1, dd:1};
(function(){
  var y0=null, x0=0, kc=0, dang=false, chay=false, el=null;
  var ve=function(){ if(el)return el; el=document.createElement('div'); el.id='ttKeo'; el.setAttribute('aria-hidden','true');
    el.innerHTML='<svg viewBox="0 0 220 64"><g class="co"><rect x="8" y="27" width="128" height="8" rx="4" fill="#3a3f45"/><rect x="126" y="27" width="12" height="8" fill="#eee"/><rect x="138" y="27" width="5" height="8" rx="2" fill="#2f7fd6"/></g>'+
      '<g class="bi"><circle cx="164" cy="31" r="11" fill="#f4f1ea"/><circle cx="160" cy="27" r="3.5" fill="#fff" opacity=".7"/></g><text class="chu" x="110" y="60" text-anchor="middle" fill="#9ca8b0" font-size="10">Kéo xuống để làm mới</text></svg>';
    document.body.appendChild(el); return el; };
  var dat=function(p){ var e=ve(); e.style.height=Math.min(80,p)+'px'; e.querySelector('.co').style.transform='translateX('+(-Math.min(54,p*.6))+'px)'; e.querySelector('.chu').textContent=p>70?'Thả ra để làm mới':'Kéo xuống để làm mới'; };
  var cho=function(){ if(chay||!TOKEN||!ME||TT_KHONG_KEO[tabHienTai])return false;
    var g=$('gate'); if(g&&getComputedStyle(g).display!=='none')return false;
    if($('ttHet'))return false; var lp=$('ltPhu'); if(lp&&getComputedStyle(lp).display!=='none')return false;
    if(document.querySelector('.modal.on,.modal.show,.modal[style*="flex"]'))return false;
    return (window.scrollY||document.documentElement.scrollTop||0)<=0; };
  var lamMoi=function(){ chay=true; var e=ve(); e.classList.add('ve'); e.style.height='80px'; e.querySelector('.co').style.transform='translateX(14px)'; ttRung(15);
    setTimeout(function(){ e.querySelector('.bi').style.transform='translateX(110px)'; e.querySelector('.chu').textContent='Đang tải…'; },120);
    var xong=function(){ if(!chay)return; chay=false; e.style.height='0'; setTimeout(function(){ e.querySelector('.co').style.transform=''; e.querySelector('.bi').style.transition='none'; e.querySelector('.bi').style.transform=''; void e.offsetWidth; e.querySelector('.bi').style.transition=''; },320); };
    var tab=tabHienTai;
    reload(function(){ xong(); go(tab,null,true); ttBao('Đã cập nhật lúc '+new Date().toTimeString().slice(0,5)); });
    setTimeout(xong,12000); };
  document.addEventListener('touchstart',function(e){ y0=null; if(e.touches.length!==1||ttLaONhap(e)||!cho())return; y0=e.touches[0].clientY; x0=e.touches[0].clientX; kc=0; dang=false; },{passive:true});
  document.addEventListener('touchmove',function(e){ if(y0==null)return; var dy=e.touches[0].clientY-y0, dx=e.touches[0].clientX-x0;
    if(!dang){ if(Math.abs(dx)>Math.abs(dy)||dy<0||(window.scrollY||0)>0){ if(Math.abs(dy)>8||Math.abs(dx)>8) y0=null; return; } if(dy<10)return; dang=true; ve().classList.remove('ve'); }
    e.preventDefault(); kc=Math.max(0,(dy-10)*.55); dat(kc); },{passive:false});
  document.addEventListener('touchend',function(){ if(y0==null)return; y0=null; if(!dang)return; dang=false;
    var e=ve(); e.classList.add('ve'); if(kc>70) lamMoi(); else e.style.height='0'; });
})();

/* ---------- 14. Nhập sai: Mai chỉ vào ô ---------- */
function ttMaiChi(){
  var o=__oNhap; if(!o||Date.now()-__oNhapLuc>15000||!document.body.contains(o))return;
  if(typeof MAI_SVG==='undefined'||maiTat()||tabHienTai==='cnnhap')return;
  var r=o.getBoundingClientRect(); if(!r.width||r.bottom<0||r.top>innerHeight)return;
  var m=$('ttMaiChi'); if(!m){ m=document.createElement('div'); m.id='ttMaiChi'; m.setAttribute('aria-hidden','true'); document.body.appendChild(m); }
  m.innerHTML=maiHinh('chi')+'<div class="bb"></div>'; m.querySelector('.bb').textContent=($('toast')||{}).textContent||'Ô này chưa đúng – kiểm tra lại nhé.';
  var w=Math.min(280,innerWidth-16);
  m.style.left=Math.max(8,Math.min(r.right-26,innerWidth-w-8))+'px'; m.style.top=Math.max(8,r.top-72)+'px';
  m.classList.remove('hien'); void m.offsetWidth; m.classList.add('hien');
  var di=function(){ m.classList.remove('hien'); o.removeEventListener('input',di); window.removeEventListener('scroll',di); clearTimeout(ttMaiChi._h); };
  o.addEventListener('input',di); window.addEventListener('scroll',di,{passive:true,once:true});
  clearTimeout(ttMaiChi._h); ttMaiChi._h=setTimeout(di,5500);
}
var _ttRungONhap=rungONhap;
rungONhap=function(){ _ttRungONhap.apply(this,arguments); try{ ttMaiChi(); }catch(e){} };

/* ---------- 15. Pháo giấy khi đạt hạng A / gửi đều 7 ngày ---------- */
function ttPhao(){
  if(GIAM_CD())return;
  var cv=document.createElement('canvas'); cv.id='ttPhao'; document.body.appendChild(cv);
  var cx=cv.getContext('2d'), W=cv.width=innerWidth*2, H=cv.height=innerHeight*2, M=['#2fd3c6','#f0b04e','#eef2f4','#66d49a','#f7b829'], P=[];
  for(var i=0;i<140;i++){ var g=-Math.PI/2+(Math.random()-.5)*1.3, v=16+Math.random()*20; P.push({x:W/2,y:H*.66,vx:Math.cos(g)*v,vy:Math.sin(g)*v,r:Math.random()*6.28,vr:(Math.random()-.5)*.4,w:10+Math.random()*10,h:6+Math.random()*7,c:M[i%M.length]}); }
  var t0=performance.now(); ttRung([15,30,15]);
  (function ve(t){ var dt=Math.min(2,(t-(ve.t||t))/16); ve.t=t; cx.clearRect(0,0,W,H);
    P.forEach(function(p){ p.vy+=.5*dt; p.vx*=.99; p.x+=p.vx*dt; p.y+=p.vy*dt; p.r+=p.vr*dt; cx.save(); cx.translate(p.x,p.y); cx.rotate(p.r); cx.fillStyle=p.c; cx.fillRect(-p.w/2,-p.h/2,p.w,p.h*Math.abs(Math.cos(p.r*2))); cx.restore(); });
    if(t-t0<2800) requestAnimationFrame(ve); else cv.remove(); })(t0);
}
var _ttVKPICaNhanToi=vKPICaNhanToi;
vKPICaNhanToi=function(){
  var kq=_ttVKPICaNhanToi.apply(this,arguments);
  try{
    var k=kpi(ME.maNV), hang=k?loai(k.tong)[0]:'', chuoi=maiChuoi(), khoa='kpi_phao_'+ME.tk;
    if((/^A/.test(hang)||chuoi>=7)&&maiNho(khoa)!==today()){
      maiNho(khoa,today());
      setTimeout(function(){ if(tabHienTai!=='kpica')return; ttPhao(); ttBao(/^A/.test(hang)?'🎉 Hạng '+hang+' – tuyệt vời!':'🎉 '+chuoi+' ngày liền gửi đều – tuyệt vời!'); },700);
    }
  }catch(e){}
  return kq;
};

/* ---------- 16. Hết phiên: kéo dây bật đèn, đăng nhập lại tại chỗ ---------- */
var _ttHetHan=hetHan;
hetHan=function(){
  try{ sessionStorage.removeItem('kpi_token'); }catch(e){}
  if($('ttHet'))return;
  try{ ltDong(); }catch(e){}
  var tk=(ME&&ME.tk)||'';
  var w=document.createElement('div'); w.id='ttHet'; w.setAttribute('role','dialog'); w.setAttribute('aria-label','Phiên đăng nhập đã hết hạn');
  w.innerHTML='<div class="toi"></div><div class="day"><div class="soi"></div><button type="button" aria-label="Kéo dây để bật đèn (hoặc nhấn Enter)"></button><small>Kéo dây để bật đèn</small></div>'+
    '<div class="hop"><b>Phiên làm việc đã hết</b><div class="mo">Đăng nhập lại để làm tiếp – trang đang xem vẫn giữ nguyên, số đang nhập dở không mất.</div>'+
    '<input type="password" autocomplete="current-password" placeholder="Mật khẩu của @'+esc(tk)+'" aria-label="Mật khẩu"><div class="loi"></div>'+
    '<div class="nuts"><button type="button" class="btn tai">Tải lại trang</button><button type="button" class="btn pri vao">Đăng nhập lại</button></div></div>';
  document.body.appendChild(w);
  var day=w.querySelector('.day'), num=day.querySelector('button'), hop=w.querySelector('.hop'), ip=hop.querySelector('input'), loi=hop.querySelector('.loi'), sang=false;
  var bat=function(){ if(sang)return; sang=true; day.style.setProperty('--keo','0px'); day.classList.remove('xuong'); w.classList.add('sang'); ttRung(20); setTimeout(function(){ try{ ip.focus(); }catch(e){} },350); };
  if(GIAM_CD()||!tk) bat(); else setTimeout(function(){ day.classList.add('xuong'); try{ num.focus({preventScroll:true}); }catch(e){} },800);
  ttKeo(num,{truc:'y',giuNgay:true,dau:function(){day.classList.add('dang')},
    di:function(dx,dy){ day.style.setProperty('--keo',Math.max(0,Math.min(140,dy))+'px'); },
    tha:function(dx,dy){ day.classList.remove('dang'); if(dy>50) bat(); else day.style.setProperty('--keo','0px'); },
    bam:function(){ day.style.setProperty('--keo','60px'); setTimeout(bat,160); }});
  num.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); bat(); } });
  hop.querySelector('.tai').onclick=function(){ location.reload(); };
  var dang=false;
  var vao=function(){
    if(dang)return; var mk=ip.value;
    if(!tk){ location.reload(); return; }
    if(!mk){ loi.textContent='Nhập mật khẩu trước đã'; ip.focus(); return; }
    dang=true; loi.textContent=''; hop.querySelector('.vao').disabled=true;
    google.script.run.withSuccessHandler(function(r){
      dang=false; hop.querySelector('.vao').disabled=false;
      if(!r||!r.ok){ loi.textContent=(r&&r.msg)||'Sai mật khẩu'; hop.classList.remove('tt-rung'); void hop.offsetWidth; hop.classList.add('tt-rung'); ttRung([20,30,20]); ip.select(); return; }
      TOKEN=r.token; ME=r.me; try{ sessionStorage.setItem('kpi_token',TOKEN); }catch(e){}
      w.remove(); toast('Đã đăng nhập lại – tiếp tục làm việc',true);
      if(ME.phaiDoiMK){ try{ batDoiMK(); }catch(e){} }
    }).withFailureHandler(function(e){ dang=false; hop.querySelector('.vao').disabled=false; loi.textContent='Không kết nối được: '+(e.message||e); }).dangNhap(tk,mk);
  };
  hop.querySelector('.vao').onclick=vao;
  ip.addEventListener('keydown',function(e){ if(e.key==='Enter') vao(); });
};
