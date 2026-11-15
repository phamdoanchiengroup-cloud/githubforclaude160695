/** Kiểm thử Dự báo đơn tháng tới (15/11 chiều, phần 3 học ERPNext): node kpi-app/tests/du-bao-web.js – không cần DATA */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs'); const src=fs.readFileSync(process.argv[2]||require('path').join(__dirname,'..','QuyTrinh.html'),'utf8');
(async()=>{ const b=await chromium.launch(); let n=0,l=0; const ok=(c,t,x)=>{n++; if(!c)l++; console.log((c?'  ✓ ':'  ✗ ')+t+(c?'':' → '+JSON.stringify(x)))};
 const p=await b.newPage({viewport:{width:1360,height:900}}); const er=[]; p.on('pageerror',e=>er.push(e.message));
 await p.setContent('<html><body><main id=main style="width:1200px"></main></body></html>');
 await p.addScriptTag({content:'window.esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\\"":"&quot;"}[c]));window.qtSo=n=>String(Math.round(n||0));window.toast=()=>{};window.call=()=>{};window.$=id=>document.getElementById(id);'});
 await p.addScriptTag({content: src.replace(/^[\s\S]*?<script>/,'').replace(/<\/script>[\s\S]*$/,'')});
 const r=await p.evaluate(()=>{ const out={}, hn=dhHomNay(), th=hn.slice(0,7), T=k=>dbThang(th,k)+'-05';
  // 3 tháng đủ: 1000 / 1200 / 1400 sp (OEM + Web lẻ) -> dự báo = 0.2*1000+0.3*1200+0.5*1400 = 1260
  const ht=[], mo=[];
  [[-3,1000],[-2,1200],[-1,1400]].forEach(([k,sl])=>{ ht.push({maDon:'O'+k,kenh:'OEM',tab:'OEM',sl:sl*0.8,thieu:0,ngayDat:T(k),loai:'GAY',vlC:'FC',vlN:'MIX'}); ht.push({maDon:'W'+k,kenh:'Web lẻ – Thường',tab:'WEB LẺ ĐƠN THƯỜNG',sl:sl*0.2,thieu:0,ngayDat:T(k),loai:'NGON',vlC:'',vlN:'GF'}); });
  ht.push({maDon:'PK',kenh:'OEM',tab:'OEM',sl:999,thieu:0,ngayDat:T(-1),loai:'PK'});   // phụ kiện: không tính
  ht.push({maDon:'ND',kenh:'OEM',tab:'OEM',sl:50,thieu:0,ngayDat:'',loai:'GAY'});      // không ngày đặt
  mo.push({maDon:'O-1',tab:'OEM',kenh:'OEM',sl:500,thieu:500,ngayDat:T(-1),pl:{loai:'GAY'}});   // trùng mã đã ở HT -> bỏ
  mo.push({maDon:'N1',tab:'KHO',kenh:'Kho',sl:300,thieu:300,ngayDat:hn,pl:{loai:'CHUOI',vlC:'GF'}});  // tháng này
  window.DH={cs:{sp:40,nghi:[],lam:[]},don:mo}; window.DHHT={ok:true,don:ht};
  const D=dbDuLieu(); out.F=D.F; out.T1=D.v(dbThang(th,-1),'T'); out.bo=D.bo; out.soTh=D.soTh; out.oem=D.du(th,'k:OEM'); out.cT=D.du(th,'cT'); out.gGF=D.du(th,'g:GF'); out.thN=D.v(th,'T');
  out.tai1=D.tai1; out.nl=D.nl; out.con=D.con;
  const h=dbVe(); out.h=h; document.getElementById('main').innerHTML=h; out.rong=document.getElementById('main').scrollWidth;
  // ít số liệu: chỉ 1 tháng -> tin cậy thấp, không lỗi
  window.DHHT={ok:true,don:[{maDon:'A',tab:'OEM',kenh:'OEM',sl:100,ngayDat:T(-1),loai:'GAY'}]}; window.DH.don=[]; const D2=dbDuLieu(); out.F2=D2.F; out.h2=dbVe();
  window.DHHT={ok:true,don:[]}; out.h3=dbVe();
  // gradient: bảng màu 4.0 có g4 -> SVG có defs + url(#g4…); bảng in (dhMau(true)) không
  const M4=dhMau4(); out.svg4=dhSvgCotX(['a','b'],[5,9],7,M4); out.svgIn=dhSvgCotX(['a','b'],[5,9],7,dhMau(true));
  out.imr=dhVeIMRDG({dgD:['2026-11-01','2026-11-02','2026-11-03'],dgV:[300,320,310],c:{sp:310}});
  return out; });
 ok(er.length===0,'không lỗi script',er);
 ok(Math.abs(r.F-1260)<0.5,'dự báo = 20/30/50% của 3 tháng đủ (1000/1200/1400 → 1260)',r.F);
 ok(r.T1===1400,'tháng trước 1400: bỏ phụ kiện + bỏ dòng tab kênh trùng mã đã ở HT',r.T1);
 ok(r.bo.n===1&&r.bo.sl===50,'dòng không có ngày đặt được đếm riêng, không tính',r.bo);
 ok(r.soTh===3,'đếm 3 tháng số liệu',r.soTh);
 ok(Math.abs(r.oem-1008)<0.5,'dự báo theo kênh OEM = 80%',r.oem);
 ok(Math.abs(r.cT-1008)<0.5&&Math.abs(r.gGF-252)<0.5,'khúc chuôi = gậy, khúc ngọn GF = ngọn lẻ GF',[r.cT,r.gGF]);
 ok(r.thN===300,'tháng này đến nay = 300 (đơn mở)',r.thN);
 ok(r.nl>15&&Math.abs(r.tai1-1260/(40*r.nl))<1e-9,'tải tháng tới = dự báo ÷ (công suất × ngày làm)',[r.tai1,r.nl]);
 ok(/tin cậy thấp/.test(r.h)&&/Chuẩn bị phôi/.test(r.h)&&/Đại lý \/ OEM/.test(r.h)&&/Đơn lẻ/.test(r.h)&&/Hàng kho/.test(r.h)&&/Tổng cả nhà máy/.test(r.h),'thẻ có nhóm kênh + tổng + bảng phôi + nhãn tin cậy thấp',r.h.slice(0,300));
 ok(/quá công suất/.test(r.h),'tải > 100% có cảnh báo',r.h.match(/tải <b>\d+%/));
 ok(r.rong<=1200,'không tràn ngang khung 1200px',r.rong);
 ok(Math.abs(r.F2-100)<0.5&&/tin cậy thấp/.test(r.h2),'1 tháng số liệu → dự báo = tháng đó, tin cậy thấp',r.F2);
 ok(/Chưa có đơn/.test(r.h3),'không có đơn có ngày đặt → báo rõ',r.h3.slice(0,200));
 ok(/<defs>/.test(r.svg4)&&/url\(#g4x\)/.test(r.svg4)&&/url\(#g4c\)/.test(r.svg4),'web 4.0: cột tô gradient (xanh + cam)',r.svg4.slice(0,300));
 ok(!/url\(#g4/.test(r.svgIn)&&!/<defs>/.test(r.svgIn),'bản in / PDF giữ tô đặc',r.svgIn.slice(0,200));
 const w=(r.imr.match(/viewBox="0 0 (\d+)/)||[])[1]; ok(+w>=1100,'I-MR rộng theo khung (1200px → viewBox ≥ 1100)',w);
 // điện thoại: khung hẹp → I-MR giữ 760 (co lại), thẻ dự báo không tràn
 const q=await b.newPage({viewport:{width:390,height:800}}); await q.setContent('<html><body style="margin:0"><main id=main style="padding:0 16px"></main></body></html>');
 await q.addScriptTag({content:'window.esc=s=>String(s==null?"":s);window.qtSo=n=>String(Math.round(n||0));window.toast=()=>{};window.call=()=>{};'}); await q.addScriptTag({content: src.replace(/^[\s\S]*?<script>/,'').replace(/<\/script>[\s\S]*$/,'')});
 const r2=await q.evaluate(()=>{ return (dhVeIMRDG({dgD:['2026-11-01','2026-11-02'],dgV:[1,2],c:{sp:3}}).match(/viewBox="0 0 (\d+)/)||[])[1]; });
 ok(r2==='760','điện thoại: I-MR giữ khung 760 rồi co theo màn hình',r2);
 console.log(n+' kiểm thử, '+l+' lỗi'); await b.close(); process.exit(l?1:0); })();
