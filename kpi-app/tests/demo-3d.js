const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/** Kiểm tra trang demo-3d.html (12 kiểm tra):  S=<thư mục lưu ảnh> node tests/demo-3d.js */
const F = 'file:///home/user/githubforclaude160695/kpi-app/demo-3d.html', S = process.env.S + '/';
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c) : '')); } };
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage(); const e = []; p.on('pageerror', x => e.push(x.message));
  await p.goto(F); await p.waitForTimeout(2200);
  // 1 nghiêng
  const t = await p.locator('#tilt').boundingBox(); await p.mouse.move(t.x + t.width * .9, t.y + t.height * .2); await p.waitForTimeout(150);
  ok(/rotateY\(9/.test(await p.$eval('#tilt', x => x.style.transform)), 'thẻ nghiêng theo con trỏ', await p.$eval('#tilt', x => x.style.transform));
  await p.locator('#tilt').screenshot({ path: S + 'd1.png' }); await p.mouse.move(5, 5);
  // 2 lật
  await p.click('#latWrap'); await p.waitForTimeout(1400);
  ok(await p.$eval('#lat', x => x.classList.contains('mo') && getComputedStyle(x).transform !== 'none'), 'thẻ lật sang mặt sau');
  await p.locator('#latWrap').screenshot({ path: S + 'd2.png' });
  // 3 bi
  const px = await p.$eval('#bi3d', c => { const g = c.getContext('2d'); const d = g.getImageData(c.width / 2, c.height / 2, 1, 1).data; const goc = g.getImageData(2, 2, 1, 1).data; return [d[3], goc[3]]; });
  ok(px[0] === 255 && px[1] === 0, 'viên bi được vẽ (giữa đặc, góc trong suốt)', px);
  const a1 = await p.$eval('#bi3d', c => c.toDataURL()); await p.waitForTimeout(400); const a2 = await p.$eval('#bi3d', c => c.toDataURL());
  ok(a1 !== a2, 'viên bi đang lăn (hình thay đổi theo thời gian)');
  await p.click('[data-bi="9"]'); await p.waitForTimeout(300); await p.locator('#bi3d').screenshot({ path: S + 'd3.png' });
  // 4,5
  await p.locator('#canhBuc').scrollIntoViewIfNeeded(); await p.waitForTimeout(1600);
  ok(await p.$$eval('#buc .hop', x => x.every(h => !h.classList.contains('thap'))), 'bục vinh danh đã mọc đủ 3');
  await p.locator('#canhBuc').screenshot({ path: S + 'd4.png' });
  const c = await p.locator('#canhCot').boundingBox(); await p.mouse.move(c.x + c.width / 2, c.y + 150); await p.mouse.down(); await p.mouse.move(c.x + c.width / 2 - 60, c.y + 150, { steps: 5 }); await p.mouse.up();
  ok(Math.abs(parseFloat(await p.$eval('#cot', x => x.style.getPropertyValue('--ry')))) < 0.01, 'kéo để xoay biểu đồ cột', await p.$eval('#cot', x => x.style.getPropertyValue('--ry')));
  await p.waitForTimeout(900); await p.locator('#canhCot').screenshot({ path: S + 'd5.png' });
  // 6 chồng thẻ: vuốt
  await p.locator('#chong').scrollIntoViewIfNeeded(); const k = await p.locator('#chong').boundingBox();
  const truoc = await p.evaluate(() => __chong()[0]);
  await p.mouse.move(k.x + 100, k.y + 60); await p.mouse.down(); await p.mouse.move(k.x + 260, k.y + 60, { steps: 6 }); await p.mouse.up(); await p.waitForTimeout(700);
  ok(await p.evaluate(() => __chong()[0]) !== truoc && await p.evaluate(() => __chong()[3]) === truoc, 'vuốt thẻ trên cùng: chuyển xuống cuối chồng');
  await p.locator('#chong').screenshot({ path: S + 'd6.png' });
  // 7 khối lập phương
  await p.click('#tabNut button[data-i="3"]'); await p.waitForTimeout(900);
  ok(await p.$eval('#lp', x => x.style.getPropertyValue('--ry')) === '90deg', 'tab "So sánh": xoay đường ngắn nhất (+90°)', await p.$eval('#lp', x => x.style.getPropertyValue('--ry')));
  await p.click('#tabNut button[data-i="1"]'); await p.waitForTimeout(350); await p.locator('.hop-tab').screenshot({ path: S + 'd7.png' });
  // 8 pháo giấy
  await p.locator('#banPhao').scrollIntoViewIfNeeded(); await p.click('#banPhao'); await p.waitForTimeout(1250);
  ok(await p.evaluate(() => __soManh()) === 140 && await p.$eval('#soDat', x => x.textContent) === '102.4%', 'đạt 100%: số chạy tới 102.4% và bắn 140 mảnh pháo giấy');
  await p.screenshot({ path: S + 'd8.png' });
  ok(e.length === 0, 'không lỗi JS', e);
  await p.screenshot({ path: S + 'd-full.png', fullPage: true });
  // điện thoại + giảm chuyển động
  const m = await (await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2, reducedMotion: 'reduce' })).newPage(); const e2 = []; m.on('pageerror', x => e2.push(x.message));
  await m.goto(F); await m.waitForTimeout(1200); await m.click('#banPhao');
  ok(e2.length === 0 && await m.$eval('#soDat', x => x.textContent) === '102.4%', 'điện thoại + giảm chuyển động: chạy được, không lỗi', e2);
  const ngang = await m.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
  ok(ngang, 'điện thoại: không bị tràn ngang');
  await m.screenshot({ path: S + 'd-dt.png' });
  await b.close(); console.log('\n' + (loi ? '✗ ' + loi + '/' + dem + ' LỖI' : '✓ Tất cả ' + dem + ' kiểm tra đạt'));
})();
