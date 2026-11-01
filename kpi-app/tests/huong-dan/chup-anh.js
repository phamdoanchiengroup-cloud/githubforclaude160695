const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const F='file://'+process.env.F, O=process.env.O;
(async()=>{ const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1280,height:900},deviceScaleFactor:1.5});
  await p.goto(F); await p.waitForSelector('#xtGoiY'); await p.click('#xtGoiY button:has-text("chienpham")'); await p.waitForSelector('#app',{state:'visible',timeout:30000}); await p.waitForTimeout(1500);
  await p.addStyleTag({content:'.qt-luu{position:static!important} *{animation:none!important;transition:none!important}'});
  await p.evaluate(()=>{ window.maiGoc=function(){}; document.querySelectorAll('[class*="mai"],[id*="mai"]').forEach(e=>{ if(getComputedStyle(e).position==='fixed') e.style.display='none'; }); });
  const an=async()=>p.evaluate(()=>{ document.querySelectorAll('body *').forEach(e=>{ if(e.closest('main')) return; const s=getComputedStyle(e); if(s.position==='fixed'||s.position==='sticky') e.style.display='none'; }); });
  const the=async(ten,re,i)=>{ await an(); const h=await p.evaluateHandle(([re,i])=>{ const ds=[...document.querySelectorAll('main .card, main details.card')].filter(c=>new RegExp(re).test(c.textContent)); return ds[i||0]||null; },[re,i||0]); const e=h.asElement(); if(!e){ console.log('THIẾU',ten); return; } await e.scrollIntoViewIfNeeded(); await e.screenshot({path:O+'/'+ten+'.png'}); console.log('ok',ten); };
  const vung=async(ten,sel)=>{ await an(); const e=await p.$(sel); if(!e){console.log('THIẾU',ten);return;} await e.screenshot({path:O+'/'+ten+'.png'}); console.log('ok',ten); };
  // Quy trình
  await p.evaluate(()=>go('qt')); await p.waitForSelector('.qt-tabs',{timeout:30000}); await p.waitForTimeout(1200);
  await vung('qt-caidat','.qt-bar'); await vung('qt-tabs','.qt-tabs');
  await the('qt-ketluan','Nhà máy có'); await the('qt-luudo-nm','Lưu đồ toàn nhà máy'); await the('qt-canbang','Giờ chuẩn/ngày');
  await p.evaluate(()=>{QTV='x';QTX='SON';qtVe();}); await p.waitForTimeout(900);
  await the('qt-x-tom','cần .* người, có mặt'); await the('qt-x-luudo','Lưu đồ xưởng');
  await p.evaluate(()=>{QTV='ng';qtVe();}); await p.waitForTimeout(500);
  await the('qt-nguoi','Những người biết làm');
  await p.evaluate(()=>{QTV='sua';qtVe();}); await p.waitForTimeout(900);
  await vung('qt-sua-luudo','.qt-sw'); await p.evaluate(()=>{QTChonThe='TUOT-LOT';qtVe();}); await p.waitForTimeout(500); await vung('qt-sua-chon','.qt-chonthe');
  await the('qt-sua-xuat','Bước ra hàng của xưởng'); 
  await p.evaluate(()=>{QTChonThe='';QTMoDs=true;qtVe();}); await p.waitForTimeout(400); await vung('qt-sua-ds','.qt-dsb');
  // Đơn hàng
  await p.evaluate(()=>go('dh')); await p.waitForSelector('.dh-tong',{timeout:30000}); await p.waitForTimeout(800);
  await vung('dh-tong','.dh-tong'); await vung('dh-loc','.dh-loc'); await vung('dh-tabs','main .qt-tabs');
  await the('dh-chuy','Trễ hạn \\(trong'); await the('dh-qua30','Quá hạn hơn 30 ngày');
  await p.evaluate(()=>{DHV='chitiet';dhVeLai();}); await p.waitForTimeout(400); await the('dh-chitiet','Mã đơn');
  await p.evaluate(()=>{DHV='gom';dhVeLai();}); await p.waitForTimeout(400); await the('dh-gom','Deadline gần nhất');
  await p.evaluate(()=>{DHV='thaydoi';dhVeLai();}); await p.waitForTimeout(1200); await the('dh-thaydoi','bản chụp|So với');
  // Thống kê với số minh họa cho phần cần bản chụp
  await p.evaluate(()=>{ DHTD=Object.assign({},DHTD||{},{loi:'',chay:{ngay:[['2026-10-19',420,360,11200,9,8,0],['2026-10-20',380,395,11185,11,9,0],['2026-10-21',300,410,11075,12,11,0],['2026-10-22',510,350,11235,8,6,0],['2026-10-23',260,402,11093,10,9,0],['2026-10-24',330,388,11035,9,8,1],['2026-10-26',450,371,11114,7,5,0],['2026-10-27',290,415,10989,12,10,0],['2026-10-28',400,120,11269,3,2,0],['2026-10-29',350,380,11239,9,7,0],['2026-10-30',310,401,11148,11,9,0],['2026-10-31',380,392,11136,10,8,0]],kenh:{'Dealer':[40,31],'Kho':[35,30],'Web lẻ – Custom':[22,15],'OEM':[12,11],'POD – A.Bách':[18,14]}}}); DHV='thongke'; dhVeLai(); }); await p.waitForTimeout(800);
  await vung('dh-tk-so','.dh-tk'); await the('dh-tk-chuoi','^Chuôi còn phải làm'); await the('dh-tk-ngon','^Ngọn còn phải làm'); await the('dh-tk-mx','^Gậy 2 khúc: chất liệu');
  await the('dh-tk-luy','^Lịch giao lũy kế'); await the('dh-tk-quahan','^Đơn đang thiếu theo số ngày'); await the('dh-tk-pareto','^Nguồn gây trễ'); await the('dh-tk-kenh','^Theo kênh'); await the('dh-tk-vrt','^Vào – Ra – Tồn'); await the('dh-tk-hong','^Hỏng cần làm bù');
  await p.evaluate(()=>{DHV='xuong';DHX='SON';dhVeLai();}); await p.waitForSelector('.dh-the',{timeout:30000}); await p.waitForTimeout(800);
  await vung('dh-xuong-the','.dh-the'); await the('dh-xuong-tg','Thời gian làm hết'); await the('dh-xuong-bang','Loại chuôi · ren');
  await p.evaluate(()=>{DHV='kiem';dhVeLai();}); await p.waitForTimeout(500); await the('dh-kiem','chắc chắn');
  await p.evaluate(()=>{DHV='cauhinh';dhVeLai();}); await p.waitForTimeout(500); await the('dh-ch-moi','Sản phẩm mới chưa có cấu hình'); await the('dh-ch-dong','Dòng gậy \\(');
  await the('dh-ch-chuoi','^Loại chuôi'); await p.evaluate(()=>{ chMoForm('','NOVA X1'); }); await p.waitForTimeout(400); await vung('dh-ch-form','.ch-form');
  // Việc hôm nay
  await p.evaluate(()=>{ window.__spMoi={ok:true,n:2,thieu:8,ten:[{ten:'GAY NOVA X1 MAU DO',thieu:5},{ten:'GAY NOVA X1 MAU XANH',thieu:3}],khuc:[{bang:'CHUOI',ma:'NHAY390',ten:'Nhảy 390',thieu:610}],tabMoi:[]}; window.__spMoiTai=1; go('homnay'); }); await p.waitForTimeout(1000);
  await an(); const e=await p.evaluateHandle(()=>{ const x=[...document.querySelectorAll('.hn-viec')].filter(v=>/cấu hình|chất liệu/.test(v.textContent)); const w=document.createElement('div'); x[0].parentNode.insertBefore(w,x[0]); x.forEach(v=>w.appendChild(v)); return w; }); await e.asElement().screenshot({path:O+'/hn-spmoi.png'}); console.log('ok hn');
  await b.close(); })();
