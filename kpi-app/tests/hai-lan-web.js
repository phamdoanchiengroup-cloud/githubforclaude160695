/** Kiểm thử ngày dự kiến xong 2 làn 30/70 (14/11): node kpi-app/tests/hai-lan-web.js – không cần DATA */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs'); const src=fs.readFileSync(process.argv[2]||require('path').join(__dirname,'..','QuyTrinh.html'),'utf8');
(async()=>{ const b=await chromium.launch(); let n=0,l=0; const ok=(c,t,x)=>{n++; if(!c)l++; console.log((c?'  ✓ ':'  ✗ ')+t+(c?'':' → '+JSON.stringify(x)))};
 const p=await b.newPage(); const er=[]; p.on('pageerror',e=>er.push(e.message));
 await p.setContent('<html><body><div id=out></div></body></html>');
 await p.addScriptTag({content:'window.esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\\"":"&quot;"}[c]));window.qtSo=n=>String(Math.round(n||0));window.toast=()=>{};window.call=()=>{};window.$=id=>document.getElementById(id);'});
 await p.addScriptTag({content: src.replace(/^[\s\S]*?<script>/,'').replace(/<\/script>[\s\S]*$/,'')});
 const r=await p.evaluate(()=>{ const hn=dhHomNay(), G=['PHOI','SON','TARO','UV','HT','TIP','DG'], C=['PHOI','SON','UV','HT','DG'];
  const mk=(ma,tab,sl,dl,extra)=>Object.assign({maDon:ma,tab:tab,kenh:tab,ten:'Gậy '+ma,sl:sl,thieu:sl,dl:dl,btp:G,pl:{loai:'GAY'},qua:{},hen:{}},extra||{});
  const out={};
  // 1) đơn đã ở Đóng gói xong sớm hơn đơn mới cùng SL, dù hạn muộn hơn
  window.DH={cs:{sp:310,nghi:[],lam:[],bp:{}},don:[mk('A','OEM',100,dhNgayCong(hn,20)),mk('B','OEM',100,dhNgayCong(hn,30),{qua:{PHOI:100,SON:100,TARO:100,UV:100,HT:100,TIP:100},p2:{c:100,n:100}})],q:{}};
  let d=dhMoPhong(dhCSDon()); out.A=d.find(g=>g.ma==='A').eta; out.B=d.find(g=>g.ma==='B').eta;
  // 2) làn 30%: đơn web lẻ nhỏ vẫn xong sớm dù OEM lớn hạn sớm hơn
  DH.don=[mk('O','OEM',3000,dhNgayCong(hn,5)),mk('W','WEB LẺ CUSTOM',20,'',{ngayDat:hn})];
  d=dhMoPhong(dhCSDon()); out.O=d.find(g=>g.ma==='O').eta; out.W=d.find(g=>g.ma==='W').eta; out.Wng=dhCSDon().find(g=>g.ma==='W').dlNgam;
  // 3) không có web lẻ → OEM dùng hết 100% (mượn làn)
  DH.don=[mk('O','OEM',3000,dhNgayCong(hn,5))]; d=dhMoPhong(dhCSDon()); out.Osolo=d[0].eta;
  // 4) trễ > 30 ngày → nhóm chờ
  DH.don=[mk('X','KHO',50,dhNgayCong(hn,-40)),mk('Y','KHO',50,dhNgayCong(hn,-10))]; d=dhMoPhong(dhCSDon()); out.X=d.find(g=>g.ma==='X'); out.Y=d.find(g=>g.ma==='Y').lop;
  // 5) thực đo chậm hơn → xong muộn hơn
  DH.don=[mk('O','OEM',3000,dhNgayCong(hn,5))]; out.do1=dhMoPhong(dhCSDon())[0].eta; out.do2=dhMoPhong(dhCSDon(),null,null,200)[0].eta;
  // 6) dhCSTinh + bảng chạy được
  DH.cs.do={sp:250,n:10}; DH.cs._m=null; DH.don=[mk('O','OEM',300,dhNgayCong(hn,5)),mk('W','WEB LẺ ĐƠN THƯỜNG',20,'',{ngayDat:dhNgayCong(hn,-15)}),mk('X','KHO',50,dhNgayCong(hn,-40))];
  const K=dhCSTinh(); out.leQua=K.leQua; out.spDo=K.spDo; out.choN=K.nhom.cho.length; out.eta2=K.don.find(g=>g.ma==='O').eta2;
  try{ window.DHTD={cs:DH.cs}; out.html=(typeof dhVeCongSuat==='function')?dhVeCongSuat():''; }catch(e){ out.loiVe=e.message; }
  try{ DHCSThu={sl:200,dl:dhNgayCong(hn,10)}; DHUT={loai:"ma",gt:"X",nhan:"X"}; out.html2=dhVeCongSuat(); }catch(e){ out.loiVe2=e.message+e.stack.slice(0,200); } DHCSThu=null; DHUT=null;
  // 7) chuôi lẻ đi luồng ngắn
  DH.don=[Object.assign(mk('C','OEM',310,dhNgayCong(hn,20)),{btp:C,pl:{loai:'CHUOI'}})]; out.C=dhMoPhong(dhCSDon())[0].eta; out.hn=hn;
  out.ngayLam=(a,b)=>0; return JSON.parse(JSON.stringify(out)); });
 ok(er.length===0,'không lỗi script',er);
 ok(r.A<=r.B,'16/11 tối: chỉ tính theo công suất (không mô phỏng qua xưởng) – hạn sớm xong trước',[r.A,r.B]);
 ok(r.W<r.O,'đơn web lẻ nhỏ đi làn lẻ 10% – xong trước đơn OEM lớn',[r.W,r.O]);
 ok(!!r.Wng,'đơn lẻ không deadline có hạn ngầm',r.Wng);
 ok(r.Osolo<=r.O,'không có đơn lẻ → OEM dùng cả làn lẻ',[r.Osolo,r.O]);
 ok(r.X&&r.X.lop==='cho'&&!r.X.eta&&r.Y!=='cho','trễ > 30 ngày → chờ hạn mới, trễ 10 ngày vẫn xếp',[r.X&&r.X.lop,r.Y]);
 ok(r.do2>r.do1,'công suất thực đo thấp hơn → xong muộn hơn',[r.do1,r.do2]);
 ok(r.leQua===1&&r.spDo===250&&r.choN===1&&!!r.eta2,'dhCSTinh: đơn lẻ quá 10 ngày, thực đo, nhóm chờ, cột thứ 2',[r.leQua,r.spDo,r.choN,r.eta2]);
 ok(!r.loiVe&&/thực đo 250/.test(r.html)&&/Chờ hạn mới/.test(r.html)&&/Theo ngày đến hạn/.test(r.html)&&/Đơn lẻ \+ POD/.test(r.html)&&/~/.test(r.html),'bảng theo kênh vẽ được 2 cột + nhãn chờ hạn mới + hạn ngầm (card Lẻ + POD) + card theo ngày đến hạn (21/11)',r.loiVe||r.html.slice(0,200));
 ok(!r.loiVe2&&/Thử nhận đơn/.test(r.html2)&&/xếp <b>lên đầu làn/.test(r.html2),"Thử nhận đơn + Thử đẩy (đơn trễ >30 ngày) chạy được",r.loiVe2||String(r.html2).slice(0,300));
 ok(!!r.C,'chuôi lẻ có ngày dự kiến',r.C);
 console.log('A/B',r.A,r.B,'O/W',r.O,r.W,'solo',r.Osolo,'do',r.do1,r.do2,'C',r.C,'hn',r.hn);
 console.log(n+' kiểm thử, '+l+' lỗi'); await b.close(); })();
