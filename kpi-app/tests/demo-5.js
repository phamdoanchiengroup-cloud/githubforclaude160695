const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/** Kiểm tra trang demo-5.html (8 thiết bị nhà máy đợt 3, máy tính + điện thoại + giảm chuyển động):  S=<thư mục lưu ảnh> node tests/demo-5.js */
const F = 'file:///home/user/githubforclaude160695/kpi-app/demo-5.html', S = (process.env.S || '/tmp') + '/d5/';
require('fs').mkdirSync(S, { recursive: true });
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 1360, height: 900 } })).newPage(); const e = []; p.on('pageerror', x => e.push(x.message)); p.on('console', m => { if (m.type() === 'error' && !/fonts|ERR_/.test(m.text())) e.push(m.text()) });
  await p.goto(F); await p.waitForTimeout(2000);
  const sec = id => p.locator('#' + id), ev = f => p.evaluate(f);
  // 1
  let t1 = await ev(() => __e1.thuTu()); const so = t => t.map(x => Number(x.replace('%', '').replace(',', '.')));
  ok(t1.length === 24 && so(t1).every((v, i, a) => !i || a[i - 1] >= v), 'thước KPI: 24 người, xếp cao → thấp', t1.slice(0, 4));
  await sec('demo1').screenshot({ path: S + '1.png' });
  await p.click('#e1Xu button[data-k="Sơn"]'); ok((await ev(() => __e1.ds())).length === 8, 'lọc xưởng Sơn: 8 người');
  await p.click('#e1Sx'); t1 = await ev(() => __e1.thuTu()); ok(so(t1).every((v, i, a) => !i || a[i - 1] <= v), 'đổi thấp → cao', t1);
  await p.click('#e1Xu button[data-k=""]'); await p.fill('#e1Tim', 'cn105'); ok((await ev(() => __e1.ds())).length === 1, 'tìm theo mã CN105: 1 người');
  const ten = (await ev(() => __e1.ds()))[0]; await p.fill('#e1Tim', ten.split(' ').pop().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd'));
  ok((await ev(() => __e1.ds())).includes(ten), 'tìm không dấu vẫn ra: ' + ten);
  await p.fill('#e1Tim', ''); await p.click('#e1 .b5-dong >> nth=0'); ok(/tháng 9 .*tháng 8/.test(await ev(() => __e1.tom())), 'bấm người: so sánh 2 tháng', await ev(() => __e1.tom()));
  // 2
  await sec('demo2').scrollIntoViewIfNeeded(); await p.waitForTimeout(1500);
  ok(Math.abs(await ev(() => __e2.kim()) - 74) < 2, 'áp suất: kim ở 74 (rung nhẹ)', await ev(() => __e2.kim()));
  await sec('demo2').screenshot({ path: S + '2.png' });
  await p.click('#e2Ds button[data-i="1"]'); await p.click('#e2Xa'); await p.waitForTimeout(1500);
  const s2 = await ev(() => __e2.so()); ok(s2[0] === 64 && s2[1] === 45 && Math.abs(await ev(() => __e2.kim()) - 45) < .5, 'duyệt 10 dòng Hoàn thiện: 55 → 45, tổng 74 → 64', [s2, await ev(() => __e2.kim())]);
  // 3
  await sec('demo3').scrollIntoViewIfNeeded();
  ok(await ev(() => __e3.T()) === 760 && await ev(() => __e3.ngh()) === 'Hoàn thiện' && !(await ev(() => __e3.doc())), 'dây chuyền: nghẽn ở Hoàn thiện 760', await ev(() => __e3.dk()));
  await sec('demo3').screenshot({ path: S + '3.png' });
  for (let i = 0; i < 3; i++) await p.click('#e3Them');
  ok(await ev(() => __e3.T()) === 870 && await ev(() => __e3.ngh()) === 'Sơn', 'tăng Hoàn thiện +150: điểm nghẽn chuyển sang Sơn 870', await ev(() => __e3.dk()));
  await sec('demo3').screenshot({ path: S + '3-sau.png' });
  // 4
  await sec('demo4').scrollIntoViewIfNeeded(); await p.waitForTimeout(1800);
  const bb = await p.locator('#e4Svg').boundingBox(); await p.mouse.click(bb.x + bb.width / 2, bb.y + bb.height * .2);
  ok(/T\d|CN/.test(await ev(() => __e4.doc())), 'máy ghi tròn: bấm đĩa đọc được ngày giờ', await ev(() => __e4.doc()));
  await p.click('#e4Cu'); await sec('demo4').screenshot({ path: S + '4.png' });
  // 5
  await sec('demo5').scrollIntoViewIfNeeded(); await p.click('#e5Che button[data-k="thang"]'); await p.waitForTimeout(300);
  ok(await ev(() => __e5.so()) === '284315', 'Nixie tháng 9: 284315', await ev(() => __e5.so()));
  await p.click('#e5Che button[data-k="nam"]'); ok(await ev(() => __e5.so()) === String(await ev(() => __e5.v())), 'Nixie năm: 7 ống', await ev(() => __e5.so()));
  await p.click('#e5Che button[data-k="ngay"]'); await p.waitForTimeout(400); await sec('demo5').screenshot({ path: S + '5.png' });
  // 6
  await sec('demo6').scrollIntoViewIfNeeded(); const l0 = await ev(() => __e6.lech()); await p.mouse.move(5, 5); await p.waitForTimeout(1200);
  ok(await ev(() => __e6.lech()) > l0 && await ev(() => __e6.sang()) > 50, 'bảng LED: chữ đang chạy, có đèn sáng', [l0, await ev(() => __e6.lech()), await ev(() => __e6.sang())]);
  await sec('demo6').screenshot({ path: S + '6.png' });
  const c0 = await ev(() => __e6.cot()); await p.fill('#e6Moi', 'Họp giao ban 7:30 sáng thứ Hai'); await p.press('#e6Moi', 'Enter');
  ok(await ev(() => __e6.so()) === 6 && await ev(() => __e6.cot()) > c0, 'thêm thông báo: bảng dài thêm');
  // 7
  await sec('demo7').scrollIntoViewIfNeeded(); await p.waitForTimeout(1500);
  ok(JSON.stringify(await ev(() => __e7.gt())) === JSON.stringify(['96,8%', '91,0%', '104,3%', '94,0%', '101,0%']), 'nhiệt kế hết tháng: đúng % kế hoạch', await ev(() => __e7.gt()));
  await sec('demo7').screenshot({ path: S + '7.png' });
  await ev(() => __e7.ngay(15)); await p.waitForTimeout(1200); ok(/Còn \d+ ngày làm việc: cần/.test(await ev(() => __e7.ct())), 'giữa tháng: tính số cần mỗi ngày', await ev(() => __e7.ct()));
  await sec('demo7').screenshot({ path: S + '7-giua.png' });
  // 8
  await sec('demo8').scrollIntoViewIfNeeded(); await ev(() => __e8.dung()); await p.waitForTimeout(2500);
  let k8 = await ev(() => __e8.kim()); ok(Math.abs(k8[0] - 104.8) < .3 && Math.abs(k8[1] - 99.1) < .3, 'VU: kim tới 104,8 và 99,1', k8);
  await p.click('#e8Chon button[data-i="4"]'); await p.waitForTimeout(2500); k8 = await ev(() => __e8.kim()); ok(Math.abs(k8[0] - 73.7) < .3, 'chọn Hoàn thiện: kim về 73,7', k8);
  await sec('demo8').screenshot({ path: S + '8.png' });
  ok(e.length === 0, 'máy tính: không lỗi JS', e);
  // điện thoại
  const m = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage(); const e2 = []; m.on('pageerror', x => e2.push(x.message));
  await m.goto(F); await m.waitForTimeout(1500);
  for (let i = 1; i <= 8; i++) { await m.locator('#demo' + i).scrollIntoViewIfNeeded(); await m.waitForTimeout(1500); await m.locator('#demo' + i).screenshot({ path: S + 'dt' + i + '.png' }); }
  ok(await m.evaluate(() => __e3.doc()), 'điện thoại: sơ đồ dây chuyền xếp dọc');
  const tran = await m.evaluate(() => document.documentElement.scrollWidth); ok(tran <= 391, 'điện thoại: không tràn ngang', tran);
  ok(e2.length === 0, 'điện thoại: không lỗi JS', e2);
  // giảm chuyển động
  const r = await (await b.newContext({ viewport: { width: 1360, height: 900 }, reducedMotion: 'reduce' })).newPage(); const e3 = []; r.on('pageerror', x => e3.push(x.message));
  await r.goto(F); await r.waitForTimeout(500);
  await r.locator('#demo8').scrollIntoViewIfNeeded(); await r.waitForTimeout(200); const k = await r.evaluate(() => __e8.kim());
  ok(k[0] === 104.8, 'giảm chuyển động: kim VU nhảy thẳng, không rung', k);
  await r.locator('#demo6').scrollIntoViewIfNeeded(); const l1 = await r.evaluate(() => __e6.lech()); await r.waitForTimeout(800); ok(await r.evaluate(() => __e6.lech()) === l1, 'giảm chuyển động: bảng LED không cuộn liên tục');
  ok(e3.length === 0, 'giảm chuyển động: không lỗi JS', e3);
  await b.close(); console.log(`\n${dem - loi}/${dem} đạt`); process.exit(loi ? 1 : 0);
})();
