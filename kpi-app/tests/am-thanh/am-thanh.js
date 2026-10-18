/* ===== 24. ÂM THANH + GIỌNG RHINO (18/10, chủ dự án chọn bộ tiếng "HUD phi thuyền" + giọng nữ) =====
   - Mặc định TẮT. Nút ở đầu trang đổi vòng: Tắt → Tiếng → Tiếng + giọng (nhớ trên máy, khóa kpi_am).
   - Tiếng hiệu ứng tự tạo bằng Web Audio (không tải file). Giọng nói: các tiếng thu sẵn trong AmThanh.html
     (tải khi bật giọng, nhớ trong máy – xem tests/am-thanh/tao-giong.py), số được ghép từ từng tiếng (amDocSo).
   - Chỉ phát sau khi người dùng đã chạm / gõ phím (trình duyệt không cho tự phát). */
var AM_GIONG=null;
var AM={ac:null,ra:null,vang:null,giong:null,on:null,dangPhat:[],boDem:{},lan:0,cuoi:{}};
function amCheDo(){try{var v=localStorage.getItem('kpi_am');return v==='am'||v==='giong'?v:'tat'}catch(e){return 'tat'}}
function amBatTieng(){return amCheDo()!=='tat'}
function amBatGiong(){return amCheDo()==='giong'}
function amCtx(){
  if(!AM.ac){var C=window.AudioContext||window.webkitAudioContext;if(!C)return null;
    try{AM.ac=new C()}catch(e){return null}
    var ac=AM.ac; AM.ra=ac.createGain(); AM.ra.gain.value=0.7; AM.ra.connect(ac.destination);
    var d=ac.createDelay(1),fb=ac.createGain(),loc=ac.createBiquadFilter(),ra=ac.createGain();
    d.delayTime.value=0.13; fb.gain.value=0.32; loc.type='lowpass'; loc.frequency.value=3500; ra.gain.value=0.45;
    AM.vang=ac.createGain(); AM.vang.connect(d); d.connect(loc); loc.connect(fb); fb.connect(d); loc.connect(ra); ra.connect(AM.ra);
    AM.giong=ac.createGain(); AM.giong.gain.value=1; AM.giong.connect(ac.destination);}
  if(AM.ac.state==='suspended'){try{AM.ac.resume()}catch(e){}}
  return AM.ac;
}
/* mở khóa âm thanh ở lần chạm / gõ phím đầu tiên */
['pointerdown','keydown','touchend'].forEach(function(ev){ document.addEventListener(ev,function(){ if(amBatTieng())amCtx(); },true); });
function amNoiRa(n,o){n.connect(AM.ra);if(o.vang)n.connect(AM.vang)}
function amTon(f,t0,dur,o){o=o||{};var ac=AM.ac,os=ac.createOscillator(),g=ac.createGain();os.type=o.kieu||'sine';
  os.frequency.setValueAtTime(f,t0);if(o.f2)os.frequency.exponentialRampToValueAtTime(o.f2,t0+(o.lt||dur));
  if(o.lech)os.detune.value=o.lech;
  g.gain.setValueAtTime(0.0001,t0);g.gain.linearRampToValueAtTime(o.g||0.25,t0+(o.a||0.005));g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
  var cuoi=g;if(o.loc){var l=ac.createBiquadFilter();l.type='lowpass';l.frequency.setValueAtTime(o.loc,t0);if(o.loc2)l.frequency.exponentialRampToValueAtTime(o.loc2,t0+dur);g.connect(l);cuoi=l}
  if(o.fm){var m=ac.createOscillator(),mg=ac.createGain();m.frequency.value=o.fm;mg.gain.value=o.fmSau||f*0.5;m.connect(mg);mg.connect(os.frequency);m.start(t0);m.stop(t0+dur+0.05)}
  os.connect(g);amNoiRa(cuoi,o);os.start(t0);os.stop(t0+dur+0.05)}
function amOn(t0,dur,o){o=o||{};var ac=AM.ac;
  if(!AM.on){var n=ac.sampleRate*1.5;AM.on=ac.createBuffer(1,n,ac.sampleRate);var d=AM.on.getChannelData(0);for(var i=0;i<n;i++)d[i]=Math.random()*2-1}
  var s=ac.createBufferSource();s.buffer=AM.on;var f=ac.createBiquadFilter();f.type=o.loai||'bandpass';f.frequency.setValueAtTime(o.f||2000,t0);
  if(o.f2)f.frequency.exponentialRampToValueAtTime(o.f2,t0+dur);f.Q.value=o.q||1;var g=ac.createGain();
  g.gain.setValueAtTime(0.0001,t0);g.gain.linearRampToValueAtTime(o.g||0.3,t0+(o.a||0.003));g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
  s.connect(f);f.connect(g);amNoiRa(g,o);s.start(t0,Math.random()*0.5);s.stop(t0+dur+0.05)}
/* Bộ tiếng HUD phi thuyền */
var AM_TIENG={
  bam:function(t){amTon(1900,t,0.07,{f2:2600,lt:0.03,g:0.12,vang:1});amTon(3800,t,0.03,{g:0.03})},
  gui:function(t){amTon(500,t,0.2,{f2:1700,lt:0.16,g:0.12,vang:1});amTon(1760,t+0.2,0.22,{g:0.18,vang:1});amTon(2637,t+0.29,0.45,{g:0.16,vang:1});amOn(t,0.22,{f:800,f2:6000,q:2,g:0.05,a:0.1})},
  sai:function(t){[0,0.17].forEach(function(d){amTon(420,t+d,0.14,{f2:260,kieu:'sawtooth',g:0.09,loc:1400,fm:30,fmSau:40,vang:1})})},
  han:function(t){amTon(1320,t,0.6,{g:0.14,fm:7,fmSau:18,vang:1});amTon(1980,t+0.02,0.5,{g:0.05,vang:1});amTon(1320,t+0.35,0.7,{g:0.1,fm:7,fmSau:18,vang:1})},
  hang:function(t){[523,659,784,988,1175,1568].forEach(function(f,i){amTon(f,t+i*0.06,0.3,{g:0.1,vang:1})});
    [261,329,392].forEach(function(f){amTon(f,t+0.1,1.4,{kieu:'sawtooth',g:0.035,a:0.35,loc:300,loc2:3000,lech:(Math.random()-0.5)*14,vang:1})});amOn(t+0.35,1,{f:6000,f2:12000,q:3,g:0.04,a:0.3})},
  cua:function(t){amOn(t,0.35,{loai:'highpass',f:3000,f2:800,g:0.12,a:0.01});amTon(90,t+0.1,1,{kieu:'sawtooth',f2:240,g:0.07,loc:500,loc2:1500,a:0.1});amTon(180,t+0.1,1,{kieu:'sawtooth',f2:480,g:0.03,loc:800,a:0.1,vang:1});amOn(t+1,0.4,{f:1200,f2:300,g:0.08,a:0.01})},
  vao:function(t){amTon(150,t,0.55,{kieu:'sawtooth',f2:2400,lt:0.5,g:0.05,loc:600,loc2:6000,a:0.3});[880,1109,1319,1760].forEach(function(f,i){amTon(f,t+0.55+i*0.015,0.9,{g:0.08,vang:1})})},
  vuot:function(t){amOn(t,0.22,{f:400,f2:5000,q:4,g:0.12,a:0.08,vang:1});amTon(600,t,0.2,{f2:1500,g:0.04})}
};
/* am('gui') – phát 1 tiếng (bỏ qua nếu vừa phát cùng tiếng trong 0,4 giây) */
function am(ten){
  if(!amBatTieng()||!AM_TIENG[ten])return;
  var bay=Date.now(); if(AM.cuoi[ten]&&bay-AM.cuoi[ten]<400)return; AM.cuoi[ten]=bay;
  var ac=amCtx(); if(!ac)return;
  try{AM_TIENG[ten](ac.currentTime+0.02)}catch(e){}
}
/* ---- Giọng nói: ghép các tiếng thu sẵn ---- */
function amDocSo3(n,day){var h=Math.floor(n/100),c=Math.floor(n%100/10),d=n%10,r=[];
  if(day||h)r.push('d'+h,'tram');
  if(c===0){if(d){if(day||h)r.push('linh');r.push('d'+d)}}
  else if(c===1){r.push('muoi');if(d)r.push(d===5?'lam':'d'+d)}
  else{r.push('d'+c,'muoi2');if(d)r.push(d===1?'mot2':d===5?'lam':'d'+d)}
  return r}
/* số 0–99.999 → mã các tiếng ("hai mươi mốt nghìn không trăm bốn mươi lăm") */
function amDocSo(n){n=Math.max(0,Math.min(99999,Math.floor(Number(n)||0)));if(!n)return['d0'];
  if(n>=1000){var r=amDocSo3(Math.floor(n/1000),false).concat(['nghin']),du=n%1000;return du?r.concat(amDocSo3(du,true)):r}
  return amDocSo3(n,false)}
function amB64(s){var bin=atob(s),u=new Uint8Array(bin.length);for(var i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return u.buffer}
function amGiaiMa(ma){
  if(AM.boDem[ma])return AM.boDem[ma];
  AM.boDem[ma]=new Promise(function(ok,loi){ if(!AM_GIONG||!AM_GIONG[ma]){loi(new Error('thiếu '+ma));return}
    try{ var p=AM.ac.decodeAudioData(amB64(AM_GIONG[ma]),ok,loi); if(p&&p.catch)p.catch(function(){}); }catch(e){loi(e)} });
  AM.boDem[ma].catch(function(){delete AM.boDem[ma]});
  return AM.boDem[ma];
}
function amDungNoi(){AM.lan++;AM.dangPhat.forEach(function(s){try{s.stop()}catch(e){}});AM.dangPhat=[]}
/* amNoi(['ban_gui', 0.04, 'cai', ...]) – chuỗi mã tiếng, số = khoảng nghỉ (giây) sau tiếng đứng trước */
function amNoi(ds,tre){
  if(!amBatGiong())return;
  var chay=function(){
    var ac=amCtx(); if(!ac)return;
    if(!AM_GIONG){ if(typeof taiManh==='function') taiManh('AmThanh',function(ok){ if(ok&&AM_GIONG)amNoi(ds); }); return; }
    amDungNoi(); var lan=AM.lan, ma=[], nghi=[];
    ds.forEach(function(x){ if(typeof x==='number'){ if(nghi.length)nghi[nghi.length-1]=x; } else { ma.push(x); nghi.push(0.02); } });
    Promise.all(ma.map(amGiaiMa)).then(function(bufs){
      if(lan!==AM.lan)return; var t=ac.currentTime+0.05;
      bufs.forEach(function(b,i){var s=ac.createBufferSource();s.buffer=b;s.connect(AM.giong);s.start(t);AM.dangPhat.push(s);t+=b.duration+nghi[i]});
    }).catch(function(){});
  };
  if(tre)setTimeout(chay,tre); else chay();
}
function amSo(n){return amDocSo(n)}
/* ---- Nút đầu trang ---- */
function amNut(){var b=document.getElementById('btnAm');if(!b)return;var c=amCheDo();
  b.textContent=c==='tat'?'🔇':c==='am'?'🔉':'🔊';
  b.title=c==='tat'?'Tiếng: đang tắt – bấm để bật tiếng hiệu ứng':c==='am'?'Tiếng: đang bật – bấm để bật thêm giọng Rhino':'Tiếng + giọng Rhino: đang bật – bấm để tắt';
  b.setAttribute('aria-label',b.title);}
function amDoi(){
  var c=amCheDo(), moi=c==='tat'?'am':c==='am'?'giong':'tat';
  try{localStorage.setItem('kpi_am',moi)}catch(e){}
  amNut(); amDungNoi();
  if(moi==='am'){ amCtx(); am('bam'); toast('Đã bật tiếng hiệu ứng. Bấm lại để bật thêm giọng Rhino.',true); }
  else if(moi==='giong'){ amCtx(); am('bam'); toast('Đã bật giọng Rhino (lần đầu tải khoảng 300 KB).',true); amNoi(['bat']); }
  else toast('Đã tắt tiếng.',true);
}
/* ---- Gắn vào các chỗ trên web ---- */
(function(){
  var boc=function(ten,f){ var cu=window[ten]; if(typeof cu!=='function')return; window[ten]=f(cu); };
  /* thành công chung (lớp phủ "xong") – công nhân gửi sản lượng thì Rhino nói thêm */
  boc('ltXong',function(cu){return function(a,b,ten){
    am('gui');
    if(ten==='gui-cho-duyet'){ var n=0; try{n=maiChuoi()}catch(e){}
      amNoi(n>=3?['da_gui',0.3,'chuoi1'].concat(amSo(n),['chuoi2']):['da_gui'],600); }
    return cu.apply(this,arguments);}});
  /* báo lỗi (toast đỏ) */
  boc('toast',function(cu){return function(m,ok){ if(ok===false)am('sai'); return cu.apply(this,arguments);}});
  /* lỗi ngay tại ô trên trang nhập của công nhân */
  boc('cnLoiO',function(cu){return function(){ var r=cu.apply(this,arguments); amNoi(['sai'],250); return r;}});
  /* hộp đọc lại trước khi gửi: Rhino đọc ngày, số công đoạn, tổng số, lỗi */
  boc('maiXacNhan',function(cu){return function(out,ok,huy){
    var r=cu.call(this,out,function(){amDungNoi();am('bam');ok.apply(this,arguments)},function(){amDungNoi();if(huy)huy.apply(this,arguments)});
    try{ var tong=0,loi=0; out.forEach(function(x){tong+=Number(x.SoLuongLamRa)||0;loi+=Number(x.SoLoi)||0});
      var nd=String(out[0]&&out[0].Ngay||today()), d=+nd.slice(8,10), th=+nd.slice(5,7);
      amNoi(['ngay'].concat(amSo(d),['thang'],amSo(th),[0.3,'ban_gui'],amSo(out.length),['cong_doan',0.15,'tong'],amSo(tong),['cai',0.15],
        loi?amSo(loi).concat(['loi']):['khong_loi'],[0.25,'dung_chua']),200);
    }catch(e){}
    return r;}});
  /* vuốt / hoàn tác: duyệt, trả lại, xóa dòng */
  boc('ttHen',function(cu){return function(){ am('vuot'); return cu.apply(this,arguments);}});
  boc('delD',function(cu){return function(){ am('vuot'); return cu.apply(this,arguments);}});
  boc('cnXoaDong',function(cu){return function(){ am('vuot'); return cu.apply(this,arguments);}});
  /* lên hạng (pháo giấy) */
  boc('ttPhao',function(cu){return function(){
    am('hang');
    try{ var k=kpi(ME.maNV), h=k?loai(k.tong)[0]:'', ma={'D':'lD','C':'lC','B':'lB','A':'lA','A+':'lAp'}[h];
      if(ma)amNoi(['chuc_mung',ma],1200); }catch(e){}
    return cu.apply(this,arguments);}});
  /* nhắc giữa ca 10:00 / 15:00 (chỉ khi Rhino thật sự hiện lời nhắc) */
  boc('maiNghi',function(cu){return function(){
    var g=new Date().getHours(), k='kpi_mai_nghi_'+g, truoc=maiNho(k), r=cu.apply(this,arguments);
    if(maiNho(k)!==truoc){ am('han'); amNoi(['nghi'],700); }
    return r;}});
  /* nhắc hạn nhập (trang nhập của công nhân) – mỗi ngày một lần */
  boc('vhGoi',function(cu){return function(fn,args,cb){
    if(fn!=='hanNhapCuaToi')return cu.apply(this,arguments);
    return cu.call(this,fn,args,function(r){ var kq=cb.apply(this,arguments);
      try{ if(r&&r.ok&&r.ds&&r.ds.length&&maiNho('kpi_am_han')!==today()){ maiNho('kpi_am_han',today());
        var nd=String(r.ds[0].ngay); am('han'); amNoi(['con_ngay'].concat(amSo(+nd.slice(8,10)),['thang'],amSo(+nd.slice(5,7)),['chua_nhap']),700); } }catch(e){}
      return kq; });}});
  /* màn đăng nhập: mở cửa cuốn, đăng nhập đúng + lời chào theo giờ */
  boc('lkMoCua',function(cu){return function(){ am('cua'); return cu.apply(this,arguments);}});
  boc('bbTrung',function(cu){return function(){
    am('vao'); var g=new Date().getHours(); amNoi([g>=22||g<5?'chao_dem':g<12?'chao_sang':'chao_chieu'],900);
    return cu.apply(this,arguments);}});
  /* hết phiên: cửa cuốn mở */
  new MutationObserver(function(ms){ ms.forEach(function(m){ [].forEach.call(m.addedNodes,function(w){
    if(w.id!=='ttHet')return; var c=w.querySelector('.cua'); if(!c)return;
    var mo=new MutationObserver(function(){ if(c.classList.contains('mo')){ mo.disconnect(); am('cua'); } }); mo.observe(c,{attributes:true,attributeFilter:['class']}); }); }); })
    .observe(document.body,{childList:true});
  amNut();
  /* đã bật giọng: tải nền phần giọng nói sau khi vào web (nhớ trong máy, lần sau không tải lại) */
  boc('vaoHeThong',function(cu){return function(){ var r=cu.apply(this,arguments);
    if(amBatGiong()&&!AM_GIONG)setTimeout(function(){ if(typeof taiManh==='function')taiManh('AmThanh',function(){}); },4000);
    return r;}});
})();
