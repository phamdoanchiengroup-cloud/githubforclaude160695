const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/** Kiểm tra trang demo-2.html (25 kiểm tra, máy tính + điện thoại + giảm chuyển động):  S=<thư mục lưu ảnh> node tests/demo-2.js */
const F = 'file:///home/user/githubforclaude160695/kpi-app/demo-2.html', S = process.env.S + '/d2/';
require('fs').mkdirSync(S, { recursive: true });
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 260) : '')); } };
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 1360, height: 900 } })).newPage(); const e = []; p.on('pageerror', x => e.push(x.message)); p.on('console', m => { if (m.type() === 'error' && !/fonts|ERR_/.test(m.text())) e.push(m.text()) });
  await p.goto(F); await p.waitForTimeout(2200);
  const sec = id => p.locator('#' + id);
  // 1
  let v = await p.evaluate(() => __d1());
  ok(v.tong === '92,7' && v.off[0] < 80, 'vòng KPI: chạy tới 92,7 (tháng 9)', v);
  await p.click('#d1Seg button[data-v="7"]'); await p.waitForTimeout(500);
  const giua = await p.evaluate(() => __d1().tong); await p.waitForTimeout(1100);
  ok(giua !== '92,7' && await p.evaluate(() => __d1().tong) === '85,8', 'đổi sang tháng 7: chạy từ số cũ sang 85,8 (giữa chừng: ' + giua + ')');
  await p.hover('#d1Ct li[data-i="1"]'); await p.waitForTimeout(300);
  ok(await p.$eval('#d1V', x => x.getAttribute('data-hl')) === '1', 'rê dòng "Chất lượng": làm nổi đúng vòng đó');
  await sec('demo1').screenshot({ path: S + '1.png' });
  // 2
  await sec('demo2').scrollIntoViewIfNeeded(); const bd = await p.locator('#d2Bd').boundingBox();
  await p.mouse.move(bd.x + bd.width * .6, bd.y + 100); await p.waitForTimeout(200);
  const tip = await p.$eval('#d2Tip', x => ({ hien: x.classList.contains('hien'), t: x.textContent }));
  ok(tip.hien && /\/09\/2026/.test(tip.t) && /%/.test(tip.t), 'kéo dò: hiện đúng ngày và số', tip.t);
  await sec('demo2').screenshot({ path: S + '2.png' });
  await p.click('#d2Seg button[data-v="sl"]'); await p.waitForTimeout(350); await sec('demo2').screenshot({ path: S + '2-bien.png' }); await p.waitForTimeout(600);
  ok(/sp/.test(await p.evaluate(() => __d2.do(5))), 'đổi sang Sản lượng: đường biến hình, chú thích đổi đơn vị');
  // 3
  await sec('demo3').scrollIntoViewIfNeeded(); await p.waitForTimeout(500);
  const H = await p.evaluate(() => __d3.H()); ok(H.every(h => h > 8) && Math.max(...H) > 100, 'bản đồ nhà máy: 9 khối đã mọc', H.map(Math.round));
  const g = p.locator('#d3Svg g[data-k="5"] polygon').nth(2); await g.hover({ force: true }); await p.waitForTimeout(250);
  ok(/Hoàn thiện/.test(await p.$eval('#d3Ben', x => x.textContent)) && /Chưa điểm danh/.test(await p.$eval('#d3Ben', x => x.textContent)), 'rê khối Hoàn thiện: hiện chi tiết + chưa điểm danh');
  await sec('demo3').screenshot({ path: S + '3.png' });
  await p.click('#d3Seg button[data-v="cd"]'); await p.waitForTimeout(1200);
  const H2 = await p.evaluate(() => __d3.H()); ok(H2[5] > 120 && H2[0] < 12, 'chỉ số "Chờ duyệt": xưởng Hoàn thiện cao vọt (55 dòng)', H2.map(Math.round));
  await sec('demo3').screenshot({ path: S + '3-cd.png' });
  // 4
  await sec('demo4').scrollIntoViewIfNeeded();
  const t0 = await p.evaluate(() => __d4());
  await p.click('#d4Seg button[data-v="1"]'); await p.waitForTimeout(250); await sec('demo4').screenshot({ path: S + '4-giua.png' }); await p.waitForTimeout(700);
  const t1 = await p.evaluate(() => __d4());
  ok(t0[0] === 'Đỗ Văn Nga' && t1[0] === 'Trần Văn Trang', 'đổi tiêu chí Sản lượng: người dẫn đầu đổi đúng', [t0[0], t1[0]]);
  ok(await p.$$eval('.d4-ld.hien', x => x.length) === 8, 'mỗi người có mũi tên lên/xuống bao nhiêu bậc');
  await sec('demo4').screenshot({ path: S + '4.png' });
  // 5
  await p.keyboard.press('Control+k'); await p.waitForTimeout(250);
  ok(await p.$eval('#d5Nen', x => x.classList.contains('mo')), 'Ctrl+K mở hộp tìm nhanh');
  await p.keyboard.type('nga'); await p.waitForTimeout(150);
  const kq = await p.evaluate(() => __d5.ds()); ok(/Nga/.test(kq[0]) && /Ng[aâ]n|Đóng/.test(kq.join('|')), 'gõ "nga" không dấu: ra Đỗ Văn Nga đầu tiên', kq.slice(0, 4));
  await p.screenshot({ path: S + '5.png' });
  await p.fill('#d5In', 'chot'); await p.waitForTimeout(120); const kq2 = await p.evaluate(() => __d5.ds());
  ok(/Chốt/.test(kq2[0]), 'gõ "chot": ra lệnh "Chốt bù tháng 9"', kq2[0]);
  await p.keyboard.press('Enter'); await p.waitForTimeout(300);
  ok(!(await p.$eval('#d5Nen', x => x.classList.contains('mo'))) && /Chốt bù/.test(await p.$eval('#thongBao', x => x.textContent)), 'Enter: chạy lệnh và đóng hộp');
  // 6
  await sec('demo6').scrollIntoViewIfNeeded(); await p.click('#d6San .d6-dau'); 
  await p.keyboard.press('a'); await p.waitForTimeout(220); await sec('demo6').screenshot({ path: S + '6-duyet.png' }); await p.waitForTimeout(400);
  ok(await p.evaluate(() => __d6.n()) === 4 && await p.$eval('#d6Tb', x => x.classList.contains('hien')), 'phím A: duyệt người đầu, hiện thanh Hoàn tác');
  await p.keyboard.press('z'); await p.waitForTimeout(500);
  ok(await p.evaluate(() => __d6.n()) === 5 && (await p.evaluate(() => __d6.ten()))[0] === 'Đỗ Văn Nga', 'phím Z: hoàn tác, người đó quay lại đúng chỗ');
  for (let i = 0; i < 5; i++) { await p.keyboard.press('a'); await p.waitForTimeout(560); }
  ok(await p.evaluate(() => __d6.n()) === 0 && await p.$('.d6-xong') !== null, 'duyệt hết: hiện "Đã xử lý hết"');
  await p.waitForTimeout(700); await sec('demo6').screenshot({ path: S + '6.png' });
  // 7
  await sec('demo7').scrollIntoViewIfNeeded(); await p.waitForTimeout(900);
  ok(await p.evaluate(() => __d7.vao()) >= 28, 'lịch: các ô hiện dần theo sóng chéo');
  const o = p.locator('#d7Luoi .d7-o.lam').first(); await o.hover(); await p.waitForTimeout(200);
  ok(/hiệu suất/.test(await p.$eval('#d7Tip', x => x.textContent)), 'rê ô: hiện chi tiết ngày', await p.$eval('#d7Tip', x => x.textContent));
  await sec('demo7').screenshot({ path: S + '7.png' });
  await p.click('#d7Truoc'); await p.waitForTimeout(900);
  ok(await p.evaluate(() => __d7.thang()) === 'Tháng 8/2026', 'nút ‹: sang tháng 8');
  // 8
  await sec('demo8').scrollIntoViewIfNeeded();
  await p.click('#d8Cd button[data-i="3"]'); await p.waitForTimeout(250); const g1 = await p.evaluate(() => __d8.goc()); await p.waitForTimeout(1600);
  const s8 = await p.evaluate(() => __d8.so());
  ok(s8 === '135%' , 'chọn "Laser check ngọn": kim về đúng 135%', s8);
  await sec('demo8').screenshot({ path: S + '8.png' });
  ok(e.length === 0, 'không lỗi JS', e);
  await p.screenshot({ path: S + 'full.png', fullPage: true });
  // điện thoại
  const m = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true })).newPage(); const e2 = []; m.on('pageerror', x => e2.push(x.message));
  await m.goto(F); await m.waitForTimeout(2000);
  ok(await m.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'điện thoại: không tràn ngang', await m.evaluate(() => [document.documentElement.scrollWidth, innerWidth]));
  for (const id of ['demo1', 'demo3', 'demo4', 'demo6']) { await m.locator('#' + id).scrollIntoViewIfNeeded(); await m.waitForTimeout(700); await m.locator('#' + id).screenshot({ path: S + 'dt-' + id + '.png' }); }
  ok(e2.length === 0, 'điện thoại: không lỗi JS', e2);
  // giảm chuyển động
  const r = await (await b.newContext({ viewport: { width: 1200, height: 900 }, reducedMotion: 'reduce' })).newPage(); const e3 = []; r.on('pageerror', x => e3.push(x.message));
  await r.goto(F); await r.waitForTimeout(600);
  ok(e3.length === 0 && await r.evaluate(() => __d1().tong) === '92,7', 'giảm chuyển động: số hiện ngay, không lỗi', e3);
  await b.close(); console.log('\n' + (loi ? '✗ ' + loi + '/' + dem + ' LỖI' : '✓ Tất cả ' + dem + ' kiểm tra đạt'));
})();
