const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/** Kiểm tra trang demo-giao-dien-nen.html (4 kiểu nền × 3 bố cục, xem như điện thoại):  S=<thư mục lưu ảnh> node tests/demo-giao-dien-nen.js */
const F = 'file:///home/user/githubforclaude160695/kpi-app/demo-giao-dien-nen.html', S = (process.env.S || '/tmp') + '/nen/';
require('fs').mkdirSync(S, { recursive: true });
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 1400, height: 1000 } })).newPage(); const e = []; p.on('pageerror', x => e.push(x.message)); p.on('console', m => { if (m.type() === 'error' && !/fonts|ERR_/.test(m.text())) e.push(m.text()) });
  await p.goto(F); await p.waitForTimeout(1200); const ev = f => p.evaluate(f);
  const nen = () => ev(() => getComputedStyle(document.getElementById('khung')).getPropertyValue('--ac').trim());
  for (const [k, ac] of [['than', '#2fd3c6'], ['bang', '#f0b04e'], ['giay', '#1f6feb'], ['kinh', '#7cb2ff']]) {
    await p.click('#chNen [data-k="' + k + '"]'); await p.waitForTimeout(500); ok(await nen() === ac, 'kiểu nền ' + k + ': màu nhấn ' + ac, await nen());
    await p.locator('#vo').screenshot({ path: S + k + '.png' }); }
  await p.click('#chBo [data-k="gon"]'); await p.waitForTimeout(400); ok(await ev(() => document.getElementById('ben').offsetWidth) === 64, 'thanh biểu tượng: rộng 64');
  await p.click('#chBo [data-k="tren"]'); ok(await ev(() => getComputedStyle(document.getElementById('ben')).display) === 'none' && await ev(() => getComputedStyle(document.getElementById('navTren')).display) === 'flex', 'menu trên: ẩn thanh bên, hiện menu ngang');
  await p.click('#navTren > div[data-i="2"] > button'); ok(await ev(() => document.querySelector('#navTren > div[data-i="2"]').classList.contains('mo')), 'bấm nhóm KPI: xổ menu');
  await p.click('#navTren > div[data-i="2"] .mn[data-k="kpi"]'); ok(await ev(() => __nen.trang()) === 'kpi', 'chọn Bảng KPI: chuyển trang');
  await p.click('#chBo [data-k="ben"]'); await p.click('#ben .mn[data-k="homnay"]'); ok(await ev(() => __nen.trang()) === 'homnay', 'thanh bên: về Việc hôm nay');
  await p.click('#chMat [data-k="gon"]'); ok(await ev(() => getComputedStyle(document.getElementById('khung')).getPropertyValue('--p').trim()) === '11px', 'mật độ gọn');
  await p.click('#chMay [data-k="dt"]'); await p.waitForTimeout(600); ok(await ev(() => __nen.hep()), 'xem như điện thoại: hiện thanh dưới');
  await p.click('#duoiDt [data-k="menu"]'); await p.waitForTimeout(300); ok(await ev(() => document.getElementById('ngan').classList.contains('mo')), 'nút Menu: mở ngăn kéo');
  await p.click('#ben2 .mn[data-k="dd"]'); ok(await ev(() => __nen.trang()) === 'dd' && !(await ev(() => document.getElementById('ngan').classList.contains('mo'))), 'chọn Điểm danh trong ngăn kéo: chuyển trang, đóng ngăn');
  await p.click('#duoiDt [data-k="homnay"]'); await p.waitForTimeout(400); await p.locator('#vo').screenshot({ path: S + 'dt.png' });
  ok(e.length === 0, 'không lỗi JS', e);
  const m = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true })).newPage(); const e2 = []; m.on('pageerror', x => e2.push(x.message));
  await m.goto(F); await m.waitForTimeout(800); ok(await m.evaluate(() => __nen.hep()), 'mở bằng điện thoại thật: tự dùng thanh dưới');
  ok(await m.evaluate(() => document.documentElement.scrollWidth) <= 391, 'điện thoại: không tràn ngang', await m.evaluate(() => document.documentElement.scrollWidth));
  await m.screenshot({ path: S + 'dt-that.png' }); ok(e2.length === 0, 'điện thoại: không lỗi JS', e2);
  await b.close(); console.log(`\n${dem - loi}/${dem} đạt`); process.exit(loi ? 1 : 0);
})();
