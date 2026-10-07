const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/** Kiểm tra demo-lottie-4.html (6 chỗ dùng Lottie đợt 4):  S=<thư mục lưu ảnh> node tests/demo-lottie-4.js */
const F = 'file://' + require('path').resolve(__dirname, '..', 'demo-lottie-4.html'), S = (process.env.S || '/tmp') + '/lt4/';
require('fs').mkdirSync(S, { recursive: true });
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 1200, height: 950 } })).newPage(); const e = []; p.on('pageerror', x => e.push(x.message)); p.on('console', m => { if (m.type() === 'error') e.push(m.text()) });
  await p.goto(F); await p.waitForTimeout(600);
  ok(await p.evaluate(() => typeof lottie === 'object'), 'thư viện Lottie chạy');
  const muc = i => p.locator('.muc').nth(i);
  const ca = [['1', 'phu', /Đã chốt ca 06\/10/], ['2', 'ket', /Mài bóng 120 → 135/], ['3', 'phu', /Đã miễn trừ 2 khoản/],
    ['5', 'ket', /Đã gán Mài bóng cho 3 người/], ['6', 'phu', /Đã thanh lý CNC-03/]];
  for (const [i, k, re] of ca) {
    await p.locator(`#b${i} [data-lam]`).first().click(); await p.locator(`#a${i} [data-lam]`).first().click(); await p.waitForTimeout(1100);
    const r = await p.evaluate(([i, k]) => { const x = document.querySelector(`#b${i} .${k}`); return { hien: x.classList.contains('hien'), b: x.querySelector('b').textContent, svg: x.querySelectorAll('.la svg path').length, toast: document.querySelector(`#a${i} .toast`).textContent }; }, [i, k]);
    ok(r.hien && re.test(r.b) && r.svg > 3 && r.toast.length > 5, `mục ${i}: hoạt ảnh + "${r.b}", bản hiện tại chỉ có dòng chữ`, r);
    await muc(+i - 1).screenshot({ path: S + i + '.png' });
  }
  // 4. cấp lại mật khẩu: không tự đóng, có nút Chép
  await p.click('#a4Nut'); await p.click('#b4Nut'); await p.waitForTimeout(3500);
  ok(await p.evaluate(() => document.getElementById('b4Phu').classList.contains('hien') && /K7m-42xq/.test(document.querySelector('#b4Phu .mk').textContent) && document.querySelectorAll('#b4La svg path').length > 3), 'cấp lại MK: chữ to, hoạt ảnh chìa khóa, sau 3,5 giây vẫn mở');
  await muc(3).screenshot({ path: S + '4.png' });
  await p.click('#b4Chep'); ok(/Đã chép/.test(await p.textContent('#b4Chep')), 'nút Chép');
  await p.click('#b4Xong'); ok(!(await p.evaluate(() => document.getElementById('b4Phu').classList.contains('hien'))), 'nút Xong đóng');
  await p.waitForTimeout(2000);
  ok(!(await p.evaluate(() => document.querySelector('#b1 .phu').classList.contains('hien'))), 'lớp phủ tự đóng');
  await p.locator('#b5 .lai').click(); ok(!(await p.evaluate(() => document.querySelector('#b5 .ket').classList.contains('hien'))), 'nút Làm lại dựng lại ô');
  ok(e.length === 0, 'không lỗi JS', e);
  const m = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true })).newPage(); await m.goto(F); await m.waitForTimeout(600);
  ok(await m.evaluate(() => document.documentElement.scrollWidth) <= 391, 'điện thoại: không tràn ngang', await m.evaluate(() => document.documentElement.scrollWidth));
  const r = await (await b.newContext({ reducedMotion: 'reduce' })).newPage(); await r.goto(F); await r.waitForTimeout(400);
  await r.locator('#b1 [data-lam]').click(); await r.waitForTimeout(900);
  const g = await r.evaluate(() => [__lt.b1.isPaused, __lt.b1.currentFrame, __lt.b1.totalFrames]);
  ok(g[0] && g[1] >= g[2] - 2, 'giảm chuyển động: hình đứng yên ở khung cuối', g);
  await b.close(); console.log(`\n${dem - loi}/${dem} đạt`); process.exit(loi ? 1 : 0);
})();
