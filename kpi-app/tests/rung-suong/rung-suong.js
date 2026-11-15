/* ===== Giao diện "Rừng Sương" (demo 16/11): vẽ nền rừng sương + dương xỉ đọng sương bằng canvas, đặt làm ảnh nền cố định (--rs-nen).
   Không dùng ảnh ngoài. Bật/tắt: rsBat(true/false), nhớ ở localStorage kpi_rs. ===== */
(function(){
  function rnd(s){ return function(){ s=(s*16807)%2147483647; return (s-1)/2147483646; }; }
  function giot(c,x,y,r){ var g=c.createRadialGradient(x-r*.35,y-r*.4,r*.1,x,y,r);
    g.addColorStop(0,'rgba(255,255,255,.95)'); g.addColorStop(.35,'rgba(210,240,225,.35)'); g.addColorStop(1,'rgba(255,255,255,.6)');
    c.fillStyle=g; c.beginPath(); c.arc(x,y,r,0,7); c.fill(); }
  function la(c,x,y,dai,goc,tl,r,coGiot){ var n=22,b=dai/n; c.save(); c.translate(x,y); c.rotate(goc);
    c.strokeStyle='rgba(120,190,90,'+(.85*tl)+')'; c.lineWidth=Math.max(1.5,dai/180); c.beginPath(); c.moveTo(0,0);
    for(var i=0;i<=n;i++) c.lineTo(i*b,Math.sin(i/n*1.2)*dai*.12); c.stroke();
    for(var i=1;i<n;i++){ var px=i*b,py=Math.sin(i/n*1.2)*dai*.12,len=dai*.22*Math.sin(Math.PI*i/n)+4;
      [-1,1].forEach(function(s){ c.save(); c.translate(px,py); c.rotate(s*1.05-.18);
        var g=c.createLinearGradient(0,0,len,0); g.addColorStop(0,'rgba(70,140,60,'+tl+')'); g.addColorStop(1,'rgba(150,215,110,'+tl+')');
        c.fillStyle=g; c.beginPath(); c.moveTo(0,0); c.quadraticCurveTo(len*.5,-len*.16,len,0); c.quadraticCurveTo(len*.5,len*.16,0,0); c.fill(); c.restore();
        if(coGiot&&r()<.16) giot(c,px+Math.cos(s*1.05)*len*.7,py+Math.sin(s*1.05)*len*.7+3,2+r()*dai/90); }); }
    c.restore(); }
  function ve(){
    var w=Math.min(1800,Math.max(360,innerWidth)), h=Math.min(1400,Math.max(640,innerHeight)), cv=document.createElement('canvas'); cv.width=w; cv.height=h;
    var c=cv.getContext('2d'), r=rnd(7);
    var g=c.createLinearGradient(0,0,0,h); g.addColorStop(0,'#2f5d4a'); g.addColorStop(.5,'#1e4637'); g.addColorStop(1,'#0f2a22'); c.fillStyle=g; c.fillRect(0,0,w,h);
    for(var i=0;i<Math.round(w*h/14000);i++){ var x=r()*w,y=r()*h,rr=10+r()*60,b=c.createRadialGradient(x,y,0,x,y,rr);
      b.addColorStop(0,r()<.5?'rgba(160,215,140,.2)':'rgba(240,250,235,.14)'); b.addColorStop(1,'rgba(0,0,0,0)'); c.fillStyle=b; c.beginPath(); c.arc(x,y,rr,0,7); c.fill(); }
    c.save(); c.globalCompositeOperation='lighter';
    for(var k=0;k<6;k++){ var x0=w*(.5+r()*.5),t=c.createLinearGradient(x0,0,x0-w*.45,h); t.addColorStop(0,'rgba(255,250,220,.15)'); t.addColorStop(1,'rgba(255,250,220,0)');
      c.fillStyle=t; c.beginPath(); c.moveTo(x0-12-r()*40,0); c.lineTo(x0+12+r()*40,0); c.lineTo(x0-w*.42,h); c.lineTo(x0-w*.58,h); c.fill(); }
    c.restore();
    var s=Math.min(w,h);
    la(c,w*1.02,h*.62,s*.75,2.75,.9,r,true); la(c,w*1.04,h*.82,s*.55,2.95,.75,r,true);
    la(c,-s*.04,h*1.02,s*.7,-.95,.7,r,true); la(c,w*.12,h*1.05,s*.45,-1.25,.5,r,false);
    for(var i=0;i<40;i++){ c.fillStyle='rgba(70,120,50,.75)'; c.beginPath(); c.ellipse(r()*w,h*.97+r()*h*.04,10+r()*20,5+r()*8,0,0,7); c.fill(); }
    for(var i=0;i<14;i++) giot(c,r()*w,h*(.9+r()*.08),2+r()*5);
    var m=c.createLinearGradient(0,0,0,h); m.addColorStop(0,'rgba(8,26,20,.15)'); m.addColorStop(1,'rgba(8,26,20,.35)'); c.fillStyle=m; c.fillRect(0,0,w,h);
    var url; try{ url=cv.toDataURL('image/jpeg',.82); }catch(e){ return; }
    document.documentElement.style.setProperty('--rs-nen','url('+url+')');
  }
  var daVe=0, tg;
  window.rsBat=function(bat){ var h=document.documentElement; h.classList.toggle('rs',!!bat); try{ localStorage.setItem('kpi_rs',bat?'1':'0'); }catch(e){}
    if(bat&&!daVe){ daVe=1; ve(); } var n=document.getElementById('rsNut'); if(n) n.textContent=bat?'🌿 Rừng Sương: BẬT':'🌿 Rừng Sương: TẮT'; };
  addEventListener('resize',function(){ if(!daVe) return; clearTimeout(tg); tg=setTimeout(ve,300); });
  var bat=true; try{ bat=localStorage.getItem('kpi_rs')!=='0'; }catch(e){}
  /* nút bật / tắt nổi (chỉ bản demo) */
  var n=document.createElement('button'); n.id='rsNut'; n.type='button';
  n.style.cssText='position:fixed;right:calc(10px + env(safe-area-inset-right,0px));top:calc(64px + env(safe-area-inset-top,0px));z-index:9999;padding:8px 12px;border-radius:999px;border:1px solid rgba(255,255,255,.5);background:rgba(16,44,35,.72);color:#f2faf5;font:600 12px system-ui;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);cursor:pointer';
  n.onclick=function(){ rsBat(!document.documentElement.classList.contains('rs')); };
  document.body.appendChild(n); rsBat(bat);
})();
