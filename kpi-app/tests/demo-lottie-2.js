const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/** Kiểm tra demo-lottie-2.html (6 chỗ dùng Lottie đợt 2):  S=<thư mục lưu ảnh> node tests/demo-lottie-2.js */
const F = 'file://' + require('path').resolve(__dirname, '..', 'demo-lottie-2.html'), S = (process.env.S || '/tmp') + '/lt2/';
require('fs').mkdirSync(S, { recursive: true });
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
const hien = (p, id) => p.evaluate(i => document.getElementById(i).classList.contains('hien'), id);
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 1200, height: 950 } })).newPage(); const e = []; p.on('pageerror', x => e.push(x.message)); p.on('console', m => { if (m.type() === 'error') e.push(m.text()) });
  await p.goto(F); await p.waitForTimeout(800);
  ok(await p.evaluate(() => typeof lottie === 'object' && document.querySelectorAll('#b5La svg').length === 1), 'thư viện chạy, ô "chưa có dữ liệu" có hoạt ảnh');
  const f0 = await p.evaluate(() => __lt.a5.currentFrame); await p.waitForTimeout(400); ok(await p.evaluate(() => __lt.a5.currentFrame) !== f0, 'kính lúp đang dò (lặp nhẹ)');
  const muc = i => p.locator('.muc').nth(i);
  // 1. chốt tháng
  await p.click('#b1Nut'); await p.click('#a1Nut'); await p.waitForTimeout(700);
  ok(await hien(p, 'b1Phu') && await p.evaluate(() => !__lt.a1.isPaused), 'chốt tháng: con dấu đang đóng');
  await muc(0).screenshot({ path: S + '1-chot.png' });
  await p.waitForTimeout(2200); ok(!(await hien(p, 'b1Phu')) && await p.textContent('#b1Tt') === 'Đã chốt', 'chốt tháng: tự đóng, nhãn đổi "Đã chốt"');
  ok(/Đã chốt KPI/.test(await p.textContent('#a1Toast')), 'bản hiện tại: thông báo chữ');
  // 2. điểm danh
  await p.locator('#b2 .nut').click(); await p.locator('#a2 .nut').click(); await p.waitForTimeout(1500);
  ok(await p.evaluate(() => document.querySelector('#b2 .ket').classList.contains('hien') && !!document.querySelector('#b2 .ket svg')), 'điểm danh: thẻ "Đã lưu" có hình 5 người');
  await muc(1).screenshot({ path: S + '2-diem-danh.png' });
  // 3. gửi sản lượng
  await p.locator('#b3 .nut').click(); await p.locator('#a3 .nut').click(); await p.waitForTimeout(1600);
  ok(await p.evaluate(() => document.querySelector('#b3 .ket').classList.contains('hien') && /chờ trưởng phòng duyệt/.test(document.querySelector('#b3 .ket').textContent)), 'gửi sản lượng: thẻ "đang chờ duyệt"');
  await muc(2).screenshot({ path: S + '3-gui.png' });
  // 4. Excel
  await p.click('#b4Nut'); await p.click('#a4Nut'); await p.waitForTimeout(500);
  ok(await hien(p, 'b4Phu') && /Đang tạo/.test(await p.textContent('#b4Chu')), 'Excel: lớp "Đang tạo file"');
  await p.waitForTimeout(1100); await muc(3).screenshot({ path: S + '4-excel.png' });
  ok(/Đã tải/.test(await p.textContent('#b4Chu')), 'Excel: đổi sang "Đã tải"');
  await p.waitForTimeout(1600); ok(!(await hien(p, 'b4Phu')), 'Excel: tự đóng');
  await muc(4).screenshot({ path: S + '5-trong.png' });
  // 6. hết phiên
  await p.click('#a6Nut'); await p.click('#b6Nut'); await p.waitForTimeout(700);
  ok(await hien(p, 'b6Phu') && await p.evaluate(() => document.activeElement.id === 'b6Lai'), 'hết phiên: lớp phủ, con trỏ ở "Đăng nhập lại"');
  await muc(5).screenshot({ path: S + '6-het-phien.png' });
  await p.waitForTimeout(1600); ok(await p.inputValue('#a6So') === '' && await p.inputValue('#b6So') === '412', 'bản hiện tại mất số vừa nhập, bản mới còn');
  await p.click('#b6Sau'); ok(!(await hien(p, 'b6Phu')), 'nút "Để sau" đóng lớp phủ');
  ok(e.length === 0, 'không lỗi JS', e);
  const m = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true })).newPage(); await m.goto(F); await m.waitForTimeout(600);
  ok(await m.evaluate(() => document.documentElement.scrollWidth) <= 391, 'điện thoại: không tràn ngang', await m.evaluate(() => document.documentElement.scrollWidth));
  await m.screenshot({ path: S + 'dt.png', fullPage: true });
  const r = await (await b.newContext({ reducedMotion: 'reduce' })).newPage(); await r.goto(F); await r.waitForTimeout(600);
  const g = await r.evaluate(() => [__lt.a5.isPaused, __lt.a5.currentFrame, __lt.a5.totalFrames]);
  ok(g[0] && g[1] >= g[2] - 2, 'giảm chuyển động: hình đứng yên', g);
  await b.close(); console.log(`\n${dem - loi}/${dem} đạt`); process.exit(loi ? 1 : 0);
})();
