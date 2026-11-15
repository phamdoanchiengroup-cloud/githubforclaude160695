/* ===== Giao diện "Rừng Sương" (demo 16/11): vẽ nền rừng sương + dương xỉ đọng sương bằng canvas, đặt làm ảnh nền cố định (--rs-nen).
   Không dùng ảnh ngoài. Bật/tắt: rsBat(true/false), nhớ ở localStorage kpi_rs. ===== */
(function(){
  /* 16/11: 3 tông – xanh (rừng sương), đỏ (lá phong đỏ), tím nhạt (oải hương) */
  var TONG={
    xanh:{ten:'Rừng Sương',nen:['#2f5d4a','#1e4637','#0f2a22'],bk:['rgba(160,215,140,.2)','rgba(240,250,235,.14)'],tia:'rgba(255,250,220,',
      can:'rgba(120,190,90,',la1:'rgba(70,140,60,',la2:'rgba(150,215,110,',reu:'rgba(70,120,50,.75)',phu:'rgba(8,26,20,'},
    do:{ten:'Lá Phong',nen:['#7a2a2c','#561a20','#2a0b10'],bk:['rgba(255,150,120,.2)','rgba(255,235,225,.14)'],tia:'rgba(255,225,200,',
      can:'rgba(200,70,50,',la1:'rgba(150,25,30,',la2:'rgba(240,110,70,',reu:'rgba(110,30,30,.75)',phu:'rgba(30,6,10,'},
    tim:{ten:'Oải Hương',nen:['#9a86c4','#6f5c9e','#3d3166'],bk:['rgba(225,205,255,.24)','rgba(250,245,255,.18)'],tia:'rgba(255,245,255,',
      can:'rgba(190,160,235,',la1:'rgba(120,90,180,',la2:'rgba(215,190,250,',reu:'rgba(95,70,140,.75)',phu:'rgba(30,20,55,'}};
  var P=TONG.xanh;
  function rnd(s){ return function(){ s=(s*16807)%2147483647; return (s-1)/2147483646; }; }
  function giot(c,x,y,r){ var g=c.createRadialGradient(x-r*.35,y-r*.4,r*.1,x,y,r);
    g.addColorStop(0,'rgba(255,255,255,.95)'); g.addColorStop(.35,'rgba(210,240,225,.35)'); g.addColorStop(1,'rgba(255,255,255,.6)');
    c.fillStyle=g; c.beginPath(); c.arc(x,y,r,0,7); c.fill(); }
  function la(c,x,y,dai,goc,tl,r,coGiot){ var n=22,b=dai/n; c.save(); c.translate(x,y); c.rotate(goc);
    c.strokeStyle=P.can+(.85*tl)+')'; c.lineWidth=Math.max(1.5,dai/180); c.beginPath(); c.moveTo(0,0);
    for(var i=0;i<=n;i++) c.lineTo(i*b,Math.sin(i/n*1.2)*dai*.12); c.stroke();
    for(var i=1;i<n;i++){ var px=i*b,py=Math.sin(i/n*1.2)*dai*.12,len=dai*.22*Math.sin(Math.PI*i/n)+4;
      [-1,1].forEach(function(s){ c.save(); c.translate(px,py); c.rotate(s*1.05-.18);
        var g=c.createLinearGradient(0,0,len,0); g.addColorStop(0,P.la1+tl+')'); g.addColorStop(1,P.la2+tl+')');
        c.fillStyle=g; c.beginPath(); c.moveTo(0,0); c.quadraticCurveTo(len*.5,-len*.16,len,0); c.quadraticCurveTo(len*.5,len*.16,0,0); c.fill(); c.restore();
        if(coGiot&&r()<.16) giot(c,px+Math.cos(s*1.05)*len*.7,py+Math.sin(s*1.05)*len*.7+3,2+r()*dai/90); }); }
    c.restore(); }
  function ve(){
    var w=Math.min(1800,Math.max(360,innerWidth)), h=Math.min(1400,Math.max(640,innerHeight)), cv=document.createElement('canvas'); cv.width=w; cv.height=h;
    var c=cv.getContext('2d'), r=rnd(7);
    var g=c.createLinearGradient(0,0,0,h); g.addColorStop(0,P.nen[0]); g.addColorStop(.5,P.nen[1]); g.addColorStop(1,P.nen[2]); c.fillStyle=g; c.fillRect(0,0,w,h);
    for(var i=0;i<Math.round(w*h/14000);i++){ var x=r()*w,y=r()*h,rr=10+r()*60,b=c.createRadialGradient(x,y,0,x,y,rr);
      b.addColorStop(0,r()<.5?P.bk[0]:P.bk[1]); b.addColorStop(1,'rgba(0,0,0,0)'); c.fillStyle=b; c.beginPath(); c.arc(x,y,rr,0,7); c.fill(); }
    c.save(); c.globalCompositeOperation='lighter';
    for(var k=0;k<6;k++){ var x0=w*(.5+r()*.5),t=c.createLinearGradient(x0,0,x0-w*.45,h); t.addColorStop(0,P.tia+'.15)'); t.addColorStop(1,P.tia+'0)');
      c.fillStyle=t; c.beginPath(); c.moveTo(x0-12-r()*40,0); c.lineTo(x0+12+r()*40,0); c.lineTo(x0-w*.42,h); c.lineTo(x0-w*.58,h); c.fill(); }
    c.restore();
    var s=Math.min(w,h);
    la(c,w*1.02,h*.62,s*.75,2.75,.9,r,true); la(c,w*1.04,h*.82,s*.55,2.95,.75,r,true);
    la(c,-s*.04,h*1.02,s*.7,-.95,.7,r,true); la(c,w*.12,h*1.05,s*.45,-1.25,.5,r,false);
    for(var i=0;i<40;i++){ c.fillStyle=P.reu; c.beginPath(); c.ellipse(r()*w,h*.97+r()*h*.04,10+r()*20,5+r()*8,0,0,7); c.fill(); }
    for(var i=0;i<14;i++) giot(c,r()*w,h*(.9+r()*.08),2+r()*5);
    var m=c.createLinearGradient(0,0,0,h); m.addColorStop(0,P.phu+'.15)'); m.addColorStop(1,P.phu+'.35)'); c.fillStyle=m; c.fillRect(0,0,w,h);
    var url; try{ url=cv.toDataURL('image/jpeg',.82); }catch(e){ return; }
    document.documentElement.style.setProperty('--rs-nen','url('+url+')');
  }
  var daVe='', tg, THU=['xanh','do','tim','0'];
  window.rsBat=function(t){ if(t===true) t='xanh'; if(!t) t='0'; var h=document.documentElement, bat=t!=='0';
    h.classList.toggle('rs',bat); ['xanh','do','tim'].forEach(function(k){ h.classList.toggle('rs-'+k,t===k); });
    try{ localStorage.setItem('kpi_rs',t); }catch(e){}
    if(!bat) document.querySelectorAll('.rs-sang').forEach(function(e){ e.style.removeProperty('background'); if(e.dataset.rsBg) e.style.setProperty('background',e.dataset.rsBg); e.classList.remove('rs-sang'); daXet.delete(e); });
    if(bat){ P=TONG[t]; if(daVe!==t){ daVe=t; ve(); } setTimeout(quet,50); }
    var n=document.getElementById('rsNut'); if(n) n.style.background=bat?P.nen[2]+'cc':'rgba(30,30,30,.75)'; if(n) n.textContent=bat?'🎨 '+P.ten+' – đổi tông':'🎨 Giao diện gốc – đổi tông'; };
  addEventListener('resize',function(){ if(!daVe) return; P=TONG[daVe]||P; clearTimeout(tg); tg=setTimeout(ve,300); });
  /* 16/11: tìm mọi "thẻ" của web (div bo góc có viền / nền: .card, .vh-the, thẻ Đơn hàng, Đài quan sát…) để gắn viền kính nổi 3D,
     không phải liệt kê từng tên lớp. Thẻ nằm trong thẻ khác → rs-the2 (nhẹ hơn). Thẻ nền sáng (vd. ô kem) → rs-sang (chữ sáng). */
  var daXet=new WeakSet(), hen=0;
  function sangNen(c){ var m=c.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/); if(!m) return 0; var a=m[4]==null?1:+m[4]; if(a<.5) return 0;
    return (.2126*m[1]+.7152*m[2]+.0722*m[3])/255; }
  function quet(){ hen=0; if(!document.documentElement.classList.contains('rs')) return;
    var ds=document.querySelectorAll('#app div,#app section,#app article,#app details,#app li,#app main button');
    for(var i=0;i<ds.length;i++){ var e=ds[i]; if(daXet.has(e)) continue; daXet.add(e);
      var laNut=e.tagName==='BUTTON'; if((laNut?e.parentElement:e).closest('table,#botbar,header,nav,.btn,button')) continue;
      var c=getComputedStyle(e), r=parseFloat(c.borderTopLeftRadius)||0; if(r<8) continue;
      var coVien=(parseFloat(c.borderTopWidth)||0)>=1, nen=c.backgroundColor, coNen=nen&&nen!=='transparent'&&!/,\s*0\)$/.test(nen);
      if(!coVien&&!coNen&&c.backgroundImage==='none') continue;
      var b=e.getBoundingClientRect(); if(laNut?(b.width<90||b.height<70):(b.width<120||b.height<40)) continue;
      e.classList.add(e.parentElement&&e.parentElement.closest('.rs-the')?'rs-the2':'rs-the');
      if(Math.max(sangNen(nen),sangNen(c.backgroundImage||''))>.62){ e.classList.add('rs-sang');
        /* ô nền sáng có màu đặt thẳng trên phần tử: ghi đè bằng kính phụ (nhớ giá trị cũ để trả lại khi tắt) */
        e.dataset.rsBg=e.style.getPropertyValue('background'); e.style.setProperty('background','var(--g2-full)','important'); }
      /* viền gradient thật bằng ::before: chỉ khi ::before đang trống và phần tử đã được định vị (không đổi bố cục) */
      if(c.position!=='static'&&getComputedStyle(e,'::before').content==='none') e.classList.add('rs-vien'); } }
  function henQuet(){ if(!hen) hen=setTimeout(quet,350); }
  new MutationObserver(henQuet).observe(document.body,{childList:true,subtree:true});
  var bat='xanh'; try{ var v=localStorage.getItem('kpi_rs'); if(v==='1') v='xanh'; if(THU.indexOf(v)>=0) bat=v; }catch(e){}
  /* nút bật / tắt nổi (chỉ bản demo) */
  var n=document.createElement('button'); n.id='rsNut'; n.type='button';
  n.style.cssText='position:fixed;right:calc(10px + env(safe-area-inset-right,0px));top:calc(64px + env(safe-area-inset-top,0px));z-index:9999;padding:8px 12px;border-radius:999px;border:1px solid rgba(255,255,255,.5);background:rgba(16,44,35,.72);color:#f2faf5;font:600 12px system-ui;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);cursor:pointer';
  n.onclick=function(){ var h=document.documentElement, cur=h.classList.contains('rs')?(['xanh','do','tim'].filter(function(k){return h.classList.contains('rs-'+k);})[0]||'xanh'):'0'; rsBat(THU[(THU.indexOf(cur)+1)%THU.length]); };
  document.body.appendChild(n); rsBat(bat);
})();
