const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/** Kiểm tra demo-3d.html (6 hiệu ứng 3D):  S=<thư mục ảnh> node tests/demo-3d.js */
const F = 'file://' + require('path').resolve(__dirname, '..', 'demo-3d.html'), S = (process.env.S || '/tmp') + '/d3d/';
require('fs').mkdirSync(S, { recursive: true });
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 1200, height: 900 } })).newPage(); const e = []; p.on('pageerror', x => e.push(x.message));
  await p.goto(F); await p.waitForTimeout(1500);
  // 1. lật thẻ
  await p.click('#lat'); await p.waitForTimeout(900);
  ok(await p.evaluate(() => document.getElementById('lat').classList.contains('sau') && /rotateY|matrix3d/.test(getComputedStyle(document.getElementById('lat')).transform)), 'thẻ KPI lật ra mặt sau');
  await p.focus('#lat'); await p.keyboard.press('Enter'); await p.waitForTimeout(100);
  ok(await p.evaluate(() => !document.getElementById('lat').classList.contains('sau')), 'phím Enter lật lại (dùng được bàn phím)');
  // 2. nút lún
  const b2 = await p.locator('#b2').boundingBox(); await p.mouse.move(b2.x + 20, b2.y + 10); await p.mouse.down(); await p.waitForTimeout(120);
  const lun = await p.evaluate(() => getComputedStyle(document.getElementById('b2')).transform); await p.mouse.up();
  ok(/matrix\(1, 0, 0, 1, 0, 6\)/.test(lun) && /1 lần/.test(await p.textContent('#d2')), 'nút lún xuống khi bấm và vẫn bấm được', lun);
  // 3. bục
  const cao = await p.evaluate(() => [...document.querySelectorAll('#san3 .hop')].map(h => h.offsetHeight));
  ok(cao.join() === '120,160,92', 'bục mọc đúng thứ hạng (hạng 1 cao nhất)', cao);
  // 4. cột: kéo xoay + bấm cột
  await p.locator('#canh4').scrollIntoViewIfNeeded();
  const c4 = await p.locator('#canh4').boundingBox(); const r0 = await p.evaluate(() => getComputedStyle(document.getElementById('san4')).getPropertyValue('--ry'));
  await p.mouse.move(c4.x + 100, c4.y + 60); await p.mouse.down(); await p.mouse.move(c4.x + 220, c4.y + 60, { steps: 6 }); await p.mouse.up();
  const r1 = await p.evaluate(() => getComputedStyle(document.getElementById('san4')).getPropertyValue('--ry'));
  ok(parseFloat(r1) > parseFloat(r0) + 20, 'kéo ngang xoay cột 3D', [r0, r1]);
  const cot = await p.locator('#san4 .cot3d[data-i="7"] .truoc').boundingBox(); await p.mouse.click(cot.x + cot.width / 2, cot.y + cot.height - 10);
  ok(/Đóng gói.*64,8%.*dưới 80%/.test(await p.textContent('#chon4')), 'bấm cột: hiện chi tiết + nhận xét', await p.textContent('#chon4'));
  ok(await p.evaluate(() => [...document.querySelectorAll('#san4 .hop')].length === 8), 'đủ 8 xưởng');
  // 5. chồng thẻ: vuốt phải duyệt, vuốt ngắn quay về, nút trả lại
  await p.locator('#chong').scrollIntoViewIfNeeded();
  let t = await p.locator('#chong .tsl').last().boundingBox();
  await p.mouse.move(t.x + 150, t.y + 60); await p.mouse.down(); await p.mouse.move(t.x + 200, t.y + 60, { steps: 4 }); await p.mouse.up(); await p.waitForTimeout(450);
  ok(await p.evaluate(() => __3d.the().length === 5 && __3d.kq().ok === 0), 'vuốt ngắn rồi thả: thẻ quay về, chưa duyệt');
  await p.mouse.move(t.x + 150, t.y + 60); await p.mouse.down(); await p.mouse.move(t.x + 330, t.y + 60, { steps: 8 }); await p.mouse.up(); await p.waitForTimeout(450);
  ok(await p.evaluate(() => __3d.the().length === 4 && __3d.kq().ok === 1), 'vuốt phải đủ xa: duyệt');
  await p.click('#b5tc'); await p.waitForTimeout(450);
  ok(await p.evaluate(() => __3d.the().length === 3 && __3d.kq().tc === 1) && /trả lại 1/.test(await p.textContent('#d5')), 'nút Trả lại: thẻ bay trái, đếm đúng');
  // 6. lật tháng
  await p.click('#lich [data-l="-1"]'); await p.waitForTimeout(700);
  ok(await p.evaluate(() => __3d.ti() === 1 && document.querySelectorAll('#lich .giay').length === 1 && /Tháng 9\/2026/.test(document.querySelector('#lich .giay').textContent)), 'bấm ‹: lật về tháng 9, chỉ còn 1 trang');
  await p.click('#lich [data-l="1"]'); await p.waitForTimeout(700);
  ok(/Tháng 10\/2026/.test(await p.textContent('#lich')), 'bấm ›: lật sang tháng 10');
  ok(e.length === 0, 'không lỗi JS', e);
  const m = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage(); await m.goto(F); await m.waitForTimeout(700);
  ok(await m.evaluate(() => document.documentElement.scrollWidth) <= 391, 'điện thoại: không tràn ngang', await m.evaluate(() => document.documentElement.scrollWidth));
  await m.screenshot({ path: S + 'dt.png', fullPage: true });
  const r = await (await b.newContext({ reducedMotion: 'reduce' })).newPage(); await r.goto(F); await r.waitForTimeout(300);
  ok(await r.evaluate(() => getComputedStyle(document.getElementById('lat')).transitionDuration === '0s'), 'giảm chuyển động: lật ngay, không bay lượn');
  await b.close(); console.log(`\n${dem - loi}/${dem} đạt`); process.exit(loi ? 1 : 0);
})();
