const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
/** Kiểm tra demo-so-do-nha-may.html (sơ đồ nhà máy 2D + 3D tô màu KPI / sĩ số):
 *    THREE=<thư mục gói npm three@0.160.0> OUT=<thư mục ảnh> node tests/demo-so-do.js
 *  (sandbox chặn jsdelivr nên trả thư viện Three.js từ gói npm cục bộ; không có THREE thì bỏ qua phần 3D) */
const F = 'file://' + path.resolve(__dirname, '..', 'demo-so-do-nha-may.html'), OUT = process.env.OUT || '', THREE = process.env.THREE || '';
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
async function mo(b, o = {}) {
  const ctx = await b.newContext(Object.assign({ viewport: { width: o.w || 1360, height: o.h || 900 }, deviceScaleFactor: o.dsf || 1 }, o.cham ? { isMobile: true, hasTouch: true } : {}, o.giam ? { reducedMotion: 'reduce' } : {}));
  if (THREE) await ctx.route(/cdn\.jsdelivr\.net\/npm\//, r => { const u = r.request().url(), goi = [['three@0.160.0/', THREE]].find(g => u.includes(g[0]));
    if (!goi) return r.abort(); r.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(path.join(goi[1], u.split(goi[0])[1])) }); });
  await ctx.route(/fonts\.googleapis|fonts\.gstatic/, r => r.abort());
  const p = await ctx.newPage(); p.loi = []; p.on('pageerror', e => p.loi.push(e.message));
  await p.goto(F); await p.waitForTimeout(400); p.ctx = ctx; return p;
}
const mauPhong = (p, ten) => p.evaluate(t => { const g = [...document.querySelectorAll('#mb .phong')].find(x => x.getAttribute('aria-label').startsWith(t)); return g ? g.querySelector('rect').getAttribute('fill') : null; }, ten);
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
  console.log('2D · máy tính');
  let p = await mo(b);
  let s = await p.evaluate(() => [document.querySelectorAll('#mb .phong').length, document.querySelectorAll('#mb .may').length, document.querySelectorAll('#mb .may.bt').length]);
  ok(s[0] === 19 && s[1] > 30 && s[2] === 0, 'Tầng 1: 19 khu + máy vẽ đúng từ bản vẽ, không có máy bảo trì', s);
  ok(await mauPhong(p, 'Cuốn') === '#66d49a', 'Khu "Cuốn" (Phôi Carbon, KPI mẫu 96%) tô xanh lá như hạng A trên web');
  ok(await mauPhong(p, 'Xưởng gia công') === '#f0b04e', 'Xưởng gia công (Ngọn Taro 72%) tô vàng hạng C');
  ok(await mauPhong(p, 'Hành lang SX') === '#2b3035', 'hành lang không thuộc xưởng: màu nền tối');
  await p.click('#mb .phong[aria-label^="Cuốn"]'); await p.waitForTimeout(200);
  s = await p.textContent('#ct');
  ok(/Cuốn/.test(s) && /Phôi Carbon/.test(s) && /96% · hạng A/.test(s) && /21\/22/.test(s), 'chạm khu: thẻ chi tiết có xưởng, KPI + hạng, có mặt 21/22', s);
  await p.click('#segMau button[data-c="siso"]'); await p.waitForTimeout(200);
  ok(await mauPhong(p, 'Xưởng gia công') === '#f47272' && /16\/21/.test(await p.textContent('#mb')), 'đổi sang "Sĩ số": Ngọn Taro 16/21 (76%) tô đỏ, số trên sơ đồ đổi theo');
  await p.click('#segMau button[data-c="kpi"]');
  await p.click('#segTang button[data-f="2"]'); await p.waitForTimeout(200);
  s = await p.evaluate(() => [document.querySelectorAll('#mb .may.bt').length, document.querySelectorAll('#mb .vong').length]);
  ok(s[0] === 2 && s[1] === 2, 'Tầng 3: 2 máy CNC đang bảo trì nháy đỏ', s);
  await p.click('#mb .may.bt'); await p.waitForTimeout(200);
  ok(/Đang bảo trì/.test(await p.textContent('#ct')) && /M-CNC-02|M 03/.test(await p.textContent('#ct')), 'chạm máy đỏ: "Đang bảo trì" + lý do + mã máy trên web');
  await p.click('#xs button[data-x="PHOITHO"]'); await p.waitForTimeout(200);
  s = await p.evaluate(() => [document.querySelector('#segTang button[aria-pressed="true"]').dataset.f, document.querySelectorAll('#mb .phong.sang').length, document.getElementById('mb').classList.contains('loc')]);
  ok(s[0] === '0' && s[1] === 3 && s[2], 'bấm xưởng Phôi Thô ở danh sách: tự sang Tầng 1, làm nổi 3 khu của xưởng', s);
  await p.click('details.ghep summary');
  await p.selectOption('#bg select[data-fi="0"][data-ri="5"]', 'PHOITHO'); await p.waitForTimeout(200);
  ok(await mauPhong(p, 'Khu chuốt') === '#2fd3c6', 'bảng ghép: đổi "Khu chuốt" sang Phôi Thô (84%) → tô xanh ngọc hạng B ngay', await mauPhong(p, 'Khu chuốt'));
  await p.focus('#mb .phong[aria-label^="Cắt"]'); await p.keyboard.press('Enter'); await p.waitForTimeout(150);
  ok(/Cắt/.test(await p.textContent('#ct h3')), 'bàn phím: Tab tới khu rồi Enter để xem chi tiết');
  if (OUT) await p.screenshot({ path: OUT + '/so-do-2d.png', fullPage: true });
  ok(!p.loi.length, 'không lỗi JS', p.loi);

  if (THREE) {
    console.log('3D · bản của chủ dự án có tô màu');
    await p.click('#segMau button[data-c="kpi"]');
    await p.click('.tabs button[data-t="3d"]');
    const f3 = await (await p.waitForSelector('#k3d iframe')).contentFrame();
    await f3.waitForSelector('#c3d canvas', { timeout: 60000 }); await p.waitForTimeout(4000);
    s = await f3.evaluate(() => [!!window.SS, !!document.getElementById('segMau'), document.getElementById('legend').textContent]);
    ok(s[0] && s[1] && /A \/ A\+/.test(s[2]) && /bảo trì/.test(s[2]), 'bản 3D dùng chung số liệu: có nút Màu, chú giải KPI + máy bảo trì', s);
    await f3.evaluate(() => document.querySelector('#segFloor button[data-f="2"]').click()); await p.waitForTimeout(3000);
    s = await f3.evaluate(() => [...document.querySelectorAll('.lbl.bt')].filter(e => e.style.display !== 'none' && e.isConnected).length);
    ok(s === 2, 'Tầng 3 trong 3D: 2 nhãn "⚠ Bảo trì" trên máy CNC', s);
    await f3.evaluate(() => { [...document.querySelectorAll('#rl button')].find(x => /P\. máy CNC 1/.test(x.textContent)).click(); }); await p.waitForTimeout(1800);
    s = await f3.textContent('#info');
    ok(/Xưởng CNC/.test(s) && /103% · hạng A\+/.test(s) && /26\/26/.test(s), 'chọn phòng trong 3D: khung chi tiết có KPI + sĩ số xưởng', s.slice(0, 200));
    if (OUT) await p.screenshot({ path: OUT + '/so-do-3d.png' });
    await f3.evaluate(() => document.querySelector('#segMau button[data-c="siso"]').click()); await p.waitForTimeout(800);
    ok(await p.evaluate(() => document.querySelector('#segMau button[data-c="siso"]').getAttribute('aria-pressed')) === 'true', 'đổi "Sĩ số" trong 3D thì bản 2D cũng đổi theo (dùng chung)');
    await f3.evaluate(() => document.querySelector('#segMau button[data-c=""]').click()); await p.waitForTimeout(500);
    ok(!/A \/ A\+/.test(await f3.textContent('#legend')), '"Màu thật": trở lại chú giải vật liệu sàn như bản gốc');
    ok(!p.loi.length, 'không lỗi JS (3D)', p.loi);
  }
  await p.ctx.close();

  console.log('2D · điện thoại');
  p = await mo(b, { w: 390, h: 844, cham: true, dsf: 2 });
  ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'không tràn ngang');
  const bx = await p.locator('#mb').boundingBox();
  ok(bx.width >= 335, 'sơ đồ rộng gần hết màn hình', bx.width);
  await p.tap('#mb .phong[aria-label^="Kho lạnh"]'); await p.waitForTimeout(500);
  ok(/chưa ghép/.test(await p.textContent('#ct')), 'chạm Kho lạnh: báo "chưa ghép với xưởng nào"');
  await p.tap('#segTang button[data-f="1"]'); await p.tap('#mb .phong[aria-label^="Khu vực in UV"]'); await p.waitForTimeout(500);
  ok(/In UV/.test(await p.textContent('#ct')), 'Tầng 2: chạm khu in UV ra đúng xưởng In UV');
  if (OUT) await p.screenshot({ path: OUT + '/so-do-dt.png' });
  ok(!p.loi.length, 'không lỗi JS', p.loi);
  await p.ctx.close(); await b.close();
  console.log((loi ? '✗ ' : '✓ ') + (dem - loi) + '/' + dem + ' đạt'); process.exit(loi ? 1 : 0);
})();
