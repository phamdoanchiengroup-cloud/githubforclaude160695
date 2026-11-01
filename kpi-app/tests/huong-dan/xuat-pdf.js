const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async()=>{ const b=await chromium.launch(); const p=await b.newPage();
  await p.goto('file://'+process.env.H,{waitUntil:'load'}); await p.waitForTimeout(800);
  await p.pdf({path:process.env.O,format:'A4',printBackground:true,displayHeaderFooter:true,
    headerTemplate:'<div></div>',
    footerTemplate:'<div style="font-size:8px;width:100%;padding:0 15mm;color:#7a8597;display:flex;justify-content:space-between;font-family:Inter,sans-serif"><span>Hướng dẫn tab Quy trình sản xuất &amp; Đơn hàng · Web KPI sản xuất</span><span>Trang <span class="pageNumber"></span>/<span class="totalPages"></span></span></div>',
    margin:{top:'16mm',bottom:'16mm',left:'15mm',right:'15mm'}});
  await b.close(); })();
