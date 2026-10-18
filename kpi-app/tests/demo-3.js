const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/** Kiểm tra trang demo-3.html (8 dụng cụ đo, máy tính + điện thoại + giảm chuyển động):  S=<thư mục lưu ảnh> node tests/demo-3.js */
const F = 'file:///home/user/githubforclaude160695/kpi-app/demo-3.html', S = (process.env.S || '/tmp') + '/d3/';
require('fs').mkdirSync(S, { recursive: true });
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 260) : '')); } };
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 1360, height: 900 } })).newPage(); const e = []; p.on('pageerror', x => e.push(x.message)); p.on('console', m => { if (m.type() === 'error' && !/fonts|ERR_/.test(m.text())) e.push(m.text()) });
  await p.goto(F); await p.waitForTimeout(2500);
  const sec = id => p.locator('#' + id);
  // 1
  let v = await p.evaluate(() => __c1.gt()); ok(v.length === 9 && v.every(x => /\d/.test(x)), 'cụm 9 đồng hồ: đủ 9 số', v);
  ok(/\d/.test(await p.evaluate(() => __c1.tom())), 'cụm đồng hồ: dòng tóm tắt', await p.evaluate(() => __c1.tom()));
  await sec('demo1').screenshot({ path: S + '1.png' });
  // 2
  await sec('demo2').scrollIntoViewIfNeeded(); await p.waitForTimeout(1500);
  const g0 = await p.evaluate(() => __c2.gt()); await p.evaluate(() => __c2.tick()); await p.waitForTimeout(1500);
  const g1 = await p.evaluate(() => __c2.gt()), h1 = await p.evaluate(() => __c2.hien());
  ok(g1 > g0, 'bộ đếm cơ khí: số tăng ' + g0 + ' → ' + g1);
  ok(Number(h1) === g1 % 1e6, 'trống số dừng đúng giá trị', { h1, g1 });
  await sec('demo2').screenshot({ path: S + '2.png' });
  // 3
  await sec('demo3').scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
  const n0 = await p.evaluate(() => __c3.nhay()); ok(n0 === 3, 'andon: 3 đèn đang nháy (1 đỏ, 2 vàng)', n0);
  await sec('demo3').screenshot({ path: S + '3.png' });
  await p.click('#c3Nhan'); await p.waitForTimeout(200);
  ok(await p.evaluate(() => __c3.nhay()) === 2 && /đã nhận/.test(await p.evaluate(() => __c3.ct())), 'bấm "Đã nhận": đèn đỏ thôi nháy');
  await p.click('#c3 .c3-thap[data-i="3"]'); await p.waitForTimeout(200);
  ok(/Sơn/.test(await p.evaluate(() => __c3.ct())), 'bấm tháp Sơn: hiện lý do');
  // 4
  await sec('demo4').scrollIntoViewIfNeeded(); await p.waitForTimeout(2500);
  const s4 = await p.evaluate(() => __c4.so()); ok(s4 > 500 && await p.evaluate(() => __c4.n()) > 5, 'máy ghi: bút đang vẽ, có số', s4);
  await p.evaluate(() => __c4.dungMay()); await p.waitForTimeout(2500);
  ok(await p.evaluate(() => __c4.so()) < s4, 'giả lập dừng máy: sản lượng tụt', await p.evaluate(() => __c4.so()));
  await sec('demo4').screenshot({ path: S + '4.png' });
  // 5
  await sec('demo5').scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
  const t5 = await p.evaluate(() => { __c5.ve(10.5); return __c5.tt() });
  ok(/Còn 6 giờ 30 phút/.test(t5) && /Chậm 6,0%/.test(t5), "đồng hồ ca lúc 10:30: còn 6 giờ 30, chậm 6%", t5);
  await sec('demo5').screenshot({ path: S + '5.png' });
  // 6
  await sec('demo6').scrollIntoViewIfNeeded(); await p.waitForTimeout(1200);
  const b6 = await p.evaluate(() => __c6.bat()); ok(b6.length >= 5 && b6.some(x => x > 0), 'cột LED: có đèn sáng', b6);
  await sec('demo6').screenshot({ path: S + '6.png' });
  // 7
  await sec('demo7').scrollIntoViewIfNeeded(); await p.waitForTimeout(800);
  ok(await p.evaluate(() => __c7.chon()) === 2 && /Tháng 9/.test(await p.evaluate(() => __c7.ky())), 'núm xoay: mặc định tháng 9');
  await p.focus('#c7Num'); await p.keyboard.press('ArrowLeft'); await p.waitForTimeout(900);
  ok(await p.evaluate(() => __c7.chon()) === 1 && Math.abs(await p.evaluate(() => __c7.goc()) + 60) < 1, 'phím ←: nấc tháng 8, núm về đúng góc', await p.evaluate(() => __c7.goc()));
  const bb = await p.locator('#c7Num').boundingBox(), cx = bb.x + bb.width / 2, cy = bb.y + bb.height / 2;
  await p.mouse.move(cx, cy - 50); await p.mouse.down(); await p.mouse.move(cx + 35, cy - 35, { steps: 4 }); await p.mouse.move(cx + 50, cy - 5, { steps: 6 }); await p.mouse.move(cx + 35, cy + 35, { steps: 6 }); await p.mouse.up(); await p.waitForTimeout(1000);
  const k7 = await p.evaluate(() => [__c7.chon(), __c7.goc()]);
  ok(k7[0] === 3 && Math.abs(k7[1] - 60) < 1, 'kéo núm: bám nấc Quý 3', k7);
  await sec('demo7').screenshot({ path: S + '7.png' });
  // 8
  await sec('demo8').scrollIntoViewIfNeeded();
  const a8 = await p.evaluate(() => __c8.so()); await p.waitForTimeout(1300);
  ok(/^\d{6}$/.test(a8) && await p.evaluate(() => __c8.so()) !== a8, 'đồng hồ lật: đang đếm', a8);
  await p.click('#c8Chon button[data-k="chot"]'); await p.waitForTimeout(800);
  ok(/chốt tháng 9/.test(await p.evaluate(() => __c8.tt())), 'đổi sang chốt tháng: đổi chú thích');
  await sec('demo8').screenshot({ path: S + '8.png' });
  await p.screenshot({ path: S + 'toan.png', fullPage: true });
  ok(e.length === 0, 'máy tính: không lỗi JS', e);
  // điện thoại
  const m = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage(); const e2 = []; m.on('pageerror', x => e2.push(x.message));
  await m.goto(F); await m.waitForTimeout(2000);
  const tran = await m.evaluate(() => document.documentElement.scrollWidth); ok(tran <= 391, 'điện thoại: không tràn ngang', tran);
  await m.screenshot({ path: S + 'dt.png', fullPage: true });
  ok(e2.length === 0, 'điện thoại: không lỗi JS', e2);
  // giảm chuyển động
  const r = await (await b.newContext({ viewport: { width: 1360, height: 900 }, reducedMotion: 'reduce' })).newPage(); const e3 = []; r.on('pageerror', x => e3.push(x.message));
  await r.goto(F); await r.waitForTimeout(1200);
  await r.locator('#demo7').scrollIntoViewIfNeeded(); await r.waitForTimeout(300); await r.focus('#c7Num'); await r.keyboard.press('ArrowRight'); await r.waitForTimeout(50);
  ok(Math.abs(await r.evaluate(() => __c7.goc()) - 60) < .1, 'giảm chuyển động: núm nhảy thẳng tới nấc');
  ok(e3.length === 0, 'giảm chuyển động: không lỗi JS', e3);
  await b.close(); console.log(`\n${dem - loi}/${dem} đạt`); process.exit(loi ? 1 : 0);
})();
