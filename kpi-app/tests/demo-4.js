const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/** Kiểm tra trang demo-4.html (8 thiết bị nhà máy đợt 2, máy tính + điện thoại + giảm chuyển động):  S=<thư mục lưu ảnh> node tests/demo-4.js */
const F = 'file:///home/user/githubforclaude160695/kpi-app/demo-4.html', S = (process.env.S || '/tmp') + '/d4/';
require('fs').mkdirSync(S, { recursive: true });
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 1360, height: 900 } })).newPage(); const e = []; p.on('pageerror', x => e.push(x.message)); p.on('console', m => { if (m.type() === 'error' && !/fonts|ERR_/.test(m.text())) e.push(m.text()) });
  await p.goto(F); await p.waitForTimeout(3500);
  const sec = id => p.locator('#' + id);
  // 1
  let c1 = await p.evaluate(() => __b1.chu());
  ok(c1[0] === 'PHOI CARBON 45/45DAY DU  ' && /HOAN THIEN.* 0\/36CHUA DD/.test(c1[5]), 'bảng lật: chữ dừng đúng', c1.slice(0, 6));
  ok(/^\d\d:\d\d$/.test(await p.evaluate(() => __b1.gio())), 'bảng lật: giờ', await p.evaluate(() => __b1.gio()));
  await sec('demo1').screenshot({ path: S + '1.png' });
  await p.click('#b1Tua'); await p.waitForTimeout(2500); await sec('demo1').screenshot({ path: S + '1-tua.png' });
  await p.waitForTimeout(9000);
  c1 = await p.evaluate(() => __b1.chu()); ok(c1[0].startsWith('PHOI CARBON 45/45') && await p.evaluate(() => __b1.gio()) === '09:00', 'tua buổi sáng: về số thật lúc 09:00', [c1[0], await p.evaluate(() => __b1.gio())]);
  // 2
  await sec('demo2').scrollIntoViewIfNeeded(); await p.evaluate(() => __b2.ve(630)); await p.waitForTimeout(1500);
  const t2 = await p.evaluate(() => __b2.tt()), k2 = await p.evaluate(() => __b2.kim());
  ok(/Chậm \d/.test(t2) && k2[1] < k2[0], 'hai kim lúc 10:30: thực tế sau kế hoạch, báo chậm', [t2, k2]);
  await sec('demo2').screenshot({ path: S + '2.png' });
  await p.evaluate(() => __b2.ve(1020)); await p.waitForTimeout(1500); ok(/4\.500/.test(await p.evaluate(() => __b2.tt())), 'hết ca: kế hoạch 4.500', await p.evaluate(() => __b2.tt()));
  await sec('demo2').screenshot({ path: S + '2-het.png' });
  // 3
  await sec('demo3').scrollIntoViewIfNeeded(); const s0 = await p.evaluate(() => __b3.sl()); await p.waitForTimeout(3000);
  const d3 = await p.evaluate(() => __b3.doc()); ok(await p.evaluate(() => __b3.sl()) > s0 && /^\s*\d+$/.test(d3.sl) && /^\d{4}$/.test(d3.gio), 'LED: sản lượng tăng, giờ đúng dạng', d3);
  await sec('demo3').screenshot({ path: S + '3.png' });
  // 4
  await sec('demo4').scrollIntoViewIfNeeded(); let d4 = await p.evaluate(() => __b4.dem()); ok(d4.bao === 4 && d4.nhan === 2, 'bảng đèn: 4 mới, 2 theo dõi', d4);
  await sec('demo4').screenshot({ path: S + '4.png' });
  await p.click('#b4Nhan'); d4 = await p.evaluate(() => __b4.dem()); ok(d4.bao === 0 && d4.nhan === 6, 'Xác nhận: đèn thôi nháy', d4);
  await p.click('#b4 .b4-o[data-i="0"]'); await p.click('#b4Xong'); d4 = await p.evaluate(() => __b4.dem()); ok(d4.tat === 7, 'Đã xử lý: đèn tắt', d4);
  await p.click('#b4Thu'); ok(await p.evaluate(() => __b4.sang()) === 12, 'Thử đèn: 12 ô sáng'); await p.waitForTimeout(1800); ok(await p.evaluate(() => __b4.sang()) === 5, 'hết thử đèn: về như cũ');
  await p.click('#b4Moi'); ok((await p.evaluate(() => __b4.dem())).bao === 1, 'Giả lập việc mới: 1 ô nháy');
  // 5
  await sec('demo5').scrollIntoViewIfNeeded(); await p.waitForTimeout(1500);
  let k5 = await p.evaluate(() => __b5.kim()); ok(k5[0] === 104.2 && k5[4] === 79.4, 'thước trượt: kim dừng đúng', k5);
  const g5 = await p.evaluate(() => new Promise(r => { document.querySelector('#b5Ky button[data-k="2"]').click(); requestAnimationFrame(() => requestAnimationFrame(() => r(__b5.kim()))) })); await p.waitForTimeout(1500);
  k5 = await p.evaluate(() => __b5.kim()); ok(k5[4] === 85 && g5[4] !== 85, 'đổi sang tháng 9: kim trượt tới 85', [g5[4], k5[4]]);
  await p.click('#b5 .b5-dong[data-i="4"]'); ok(/Sơn lót.*120 sp\/giờ.*tháng 8/.test(await p.evaluate(() => __b5.ct())), 'bấm dòng: chi tiết', await p.evaluate(() => __b5.ct()));
  await sec('demo5').screenshot({ path: S + '5.png' });
  // 6
  await sec('demo6').scrollIntoViewIfNeeded(); ok(/^8T307:12\*/.test(await p.evaluate(() => __b6.o(8))), 'thẻ chấm công: ngày 8 trễ có dấu *', await p.evaluate(() => __b6.o(8)));
  await p.click('#b6Bam'); await p.waitForTimeout(600); await p.click('#b6Bam'); await p.waitForTimeout(700);
  ok(/^30.*07:02.*17:03.*8,0/.test(await p.evaluate(() => __b6.o(30))) && /24\/24|25\/25/.test(await p.evaluate(() => __b6.tom())), 'bấm thẻ 2 lần: đóng dấu vào/ra, cộng ngày công', [await p.evaluate(() => __b6.o(30)), await p.evaluate(() => __b6.tom())]);
  await sec('demo6').screenshot({ path: S + '6.png' });
  // 7
  await sec('demo7').scrollIntoViewIfNeeded(); await p.waitForTimeout(4500);
  ok(await p.evaluate(() => __b7.xong()) && await p.evaluate(() => __b7.tong()) === '7.795.000 đ', 'phiếu lương: in xong, thực lĩnh 7.795.000', await p.evaluate(() => __b7.tong()));
  await sec('demo7').screenshot({ path: S + '7.png' });
  await p.click('#b7Chon button[data-k="8"]'); await p.waitForTimeout(900); ok(!(await p.evaluate(() => __b7.xong())), 'đổi tháng 8: in lại'); await sec('demo7').screenshot({ path: S + '7-dang-in.png' });
  await p.waitForTimeout(3500); ok(await p.evaluate(() => __b7.tong()) === '6.948.000 đ', 'tháng 8: 6.948.000', await p.evaluate(() => __b7.tong()));
  // 8
  await sec('demo8').scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
  ok(await p.evaluate(() => __b8.so()) === '92,9%' && /Còn thiếu 2,1 điểm/.test(await p.evaluate(() => __b8.goi())), 'bàn trượt: KPI thật 92,9, thiếu 2,1', [await p.evaluate(() => __b8.so()), await p.evaluate(() => __b8.goi())]);
  const r8 = await p.locator('#b8Ban .fd-ray').nth(1).boundingBox();
  await p.mouse.move(r8.x + r8.width / 2, r8.y + 60); await p.mouse.down(); await p.mouse.move(r8.x + r8.width / 2, r8.y + 30, { steps: 5 }); await p.mouse.up(); await p.waitForTimeout(900);
  ok(/Đạt mục tiêu/.test(await p.evaluate(() => __b8.goi())), 'kéo cần chất lượng lên: đạt mục tiêu', [await p.evaluate(() => __b8.so()), await p.evaluate(() => __b8.goi())]);
  await sec('demo8').screenshot({ path: S + '8.png' });
  await p.focus('#b8Ban .fd-ray >> nth=0'); await p.keyboard.press('PageDown'); ok(/^\d/.test(await p.evaluate(() => __b8.so())), 'phím PageDown chỉnh được');
  await p.click('#b8Ve'); ok(await p.evaluate(() => __b8.so()) === '92,9%', 'Về số thực tế');
  await p.screenshot({ path: S + 'toan.png', fullPage: true });
  ok(e.length === 0, 'máy tính: không lỗi JS', e);
  // điện thoại
  const m = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage(); const e2 = []; m.on('pageerror', x => e2.push(x.message));
  await m.goto(F); await m.waitForTimeout(1500);
  for (let i = 1; i <= 8; i++) { await m.locator('#demo' + i).scrollIntoViewIfNeeded(); await m.waitForTimeout(i === 7 ? 4000 : 1200); await m.locator('#demo' + i).screenshot({ path: S + 'dt' + i + '.png' }); }
  const tran = await m.evaluate(() => document.documentElement.scrollWidth); ok(tran <= 391, 'điện thoại: không tràn ngang', tran);
  ok(e2.length === 0, 'điện thoại: không lỗi JS', e2);
  // giảm chuyển động
  const r = await (await b.newContext({ viewport: { width: 1360, height: 900 }, reducedMotion: 'reduce' })).newPage(); const e3 = []; r.on('pageerror', x => e3.push(x.message));
  await r.goto(F); await r.waitForTimeout(600);
  ok((await r.evaluate(() => __b1.chu()))[0].startsWith('PHOI CARBON'), 'giảm chuyển động: bảng lật hiện ngay');
  await r.locator('#demo7').scrollIntoViewIfNeeded(); await r.waitForTimeout(200); ok(await r.evaluate(() => __b7.xong()), 'giảm chuyển động: phiếu lương hiện ngay');
  ok(e3.length === 0, 'giảm chuyển động: không lỗi JS', e3);
  await b.close(); console.log(`\n${dem - loi}/${dem} đạt`); process.exit(loi ? 1 : 0);
})();
