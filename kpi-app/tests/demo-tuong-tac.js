const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/** Kiểm tra trang demo-tuong-tac.html (6 thao tác nhập liệu; chuột, bàn phím, chạm, giảm chuyển động):  S=<thư mục lưu ảnh> node tests/demo-tuong-tac.js */
const F = 'file:///home/user/githubforclaude160695/kpi-app/demo-tuong-tac.html', S = (process.env.S || '/tmp') + '/tt/';
require('fs').mkdirSync(S, { recursive: true });
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 1360, height: 900 } })).newPage(); const e = []; p.on('pageerror', x => e.push(x.message)); p.on('console', m => { if (m.type() === 'error' && !/fonts|ERR_/.test(m.text())) e.push(m.text()) });
  await p.goto(F); await p.waitForTimeout(1200);
  const sec = id => p.locator('#' + id), ev = f => p.evaluate(f);
  // 1 điểm danh
  await p.click('#d1Tat'); await p.waitForTimeout(700); ok((await ev(() => __d1.co())) === '20' && /Đã chấm đủ/.test(await ev(() => __d1.con())), 'Tất cả có mặt: 20/20');
  await p.click('#d1 .d1-o[data-i="3"]'); ok((await ev(() => __d1.st()))[3] === '', 'chạm lại: bỏ chấm');
  const o5 = p.locator('#d1 .d1-o[data-i="5"]'); const bb = await o5.boundingBox(); await p.mouse.move(bb.x + 20, bb.y + 20); await p.mouse.down(); await p.waitForTimeout(600);
  ok(await ev(() => __d1.menuMo()), 'giữ 0,45 giây: hiện menu lý do'); await p.mouse.up();
  await p.click('#d1Menu button[data-k="phep"]'); ok((await ev(() => __d1.st()))[5] === 'phep', 'chọn Nghỉ phép');
  await p.click('#d1 .d1-o[data-i="7"]', { button: 'right' }); await p.keyboard.press('ArrowDown'); await p.keyboard.press('Enter'); ok((await ev(() => __d1.st()))[7] === 'tre', 'chuột phải + phím ↓ Enter: Đi trễ');
  ok(await p.isDisabled('#d1Gui'), 'còn người chưa chấm thì chưa gửi được');
  await p.click('#d1 .d1-o[data-i="3"]'); await p.waitForTimeout(700); ok((await ev(() => __d1.co())) === '19', 'có mặt 19 (đi trễ vẫn tính có mặt)', await ev(() => __d1.co()));
  await p.click('#d1Gui'); ok(await ev(() => __d1.khoa()), 'gửi: khóa và đóng dấu'); await p.waitForTimeout(500); await sec('demo1').screenshot({ path: S + '1.png' });
  // 2 bàn phím
  await sec('demo2').scrollIntoViewIfNeeded(); await p.click('#d2Phim button[data-k="9"]'); await p.focus('#d2Phim'); await p.keyboard.type('80');
  ok(await ev(() => __d2.so()) === '980' && await ev(() => __d2.pt()) === '87,5%', 'gõ 980 (bấm + bàn phím): 87,5% của 1.120', [await ev(() => __d2.so()), await ev(() => __d2.pt())]);
  await p.keyboard.press('Backspace'); ok(await ev(() => __d2.so()) === '98', 'phím xóa lùi');
  await p.keyboard.type('00'); await p.keyboard.press('Enter'); ok(/Ghi lần nữa/.test(await ev(() => __d2.bao())) && !(await ev(() => __d2.ds())).length, '9.800 > 140%: chưa ghi, hỏi lại', await ev(() => __d2.bao()));
  await p.keyboard.press('Enter'); ok((await ev(() => __d2.ds()))[0] === 9800, 'bấm Ghi lần 2: ghi được');
  await p.click('#d2Ht'); ok(!(await ev(() => __d2.ds())).length && await ev(() => __d2.so()) === '9800', 'Hoàn tác: trả số về ô nhập');
  await p.click('#d2Phim button[data-k="x"]'); await p.click('#d2Phim button[data-k="x"]'); await p.click('#d2Phim button[data-k="x"]'); await p.click('#d2Phim button[data-k="ok"]');
  ok((await ev(() => __d2.ds()))[0] === 9, 'số thường: ghi ngay 1 lần');
  await p.waitForTimeout(600); await sec('demo2').screenshot({ path: S + '2.png' });
  // 3 nắp an toàn
  await sec('demo3').scrollIntoViewIfNeeded();
  const can = await p.locator('#d3Can').boundingBox();
  ok(!(await ev(() => __d3.mo())), 'nắp đang đóng');
  await p.click('#d3Ds .cg[data-i="0"]'); ok(await ev(() => __d3.con()) === 54, 'duyệt lẻ 1 dòng: còn 54');
  await p.click('#d3Nap'); await p.waitForTimeout(600); ok(await ev(() => __d3.mo()), 'bấm nắp: mở');
  const c2 = await p.locator('#d3Can').boundingBox(); await p.mouse.move(c2.x + c2.width / 2, c2.y + 10); await p.mouse.down(); await p.mouse.move(c2.x + c2.width / 2, c2.y + 30, { steps: 3 }); await p.mouse.up();
  ok(!(await ev(() => __d3.bat())), 'kéo chưa đủ xa: bật ngược lên, chưa duyệt'); await p.waitForTimeout(400);
  await p.mouse.move(c2.x + c2.width / 2, c2.y + 10); await p.mouse.down(); await p.mouse.move(c2.x + c2.width / 2, c2.y + 90, { steps: 6 }); await p.mouse.up(); await p.waitForTimeout(1200);
  ok(await ev(() => __d3.bat()) && await ev(() => __d3.con()) === 0, 'kéo cần xuống hết: duyệt 54 dòng còn lại', await ev(() => __d3.con()));
  await sec('demo3').screenshot({ path: S + '3.png' });
  await p.click('#d3Ht'); ok(await ev(() => __d3.con()) === 55 && !(await ev(() => __d3.bat())), 'Hoàn tác');
  // 4 kéo thả
  await sec('demo4').scrollIntoViewIfNeeded(); const T0 = await ev(() => __d4.T());
  const tLan = p.locator('#d4Kho .the').first(), lan = p.locator('.d4-lan[data-l="3"]');
  const a1 = await tLan.boundingBox(), a2 = await lan.boundingBox();
  await p.mouse.move(a1.x + 20, a1.y + 10); await p.mouse.down(); await p.mouse.move(a1.x + 40, a1.y + 30, { steps: 3 }); await p.mouse.move(a2.x + 60, a2.y + a2.height - 30, { steps: 8 }); await p.mouse.up(); await p.waitForTimeout(400);
  ok((await ev(() => __d4.l()))[11] === 3 && await ev(() => __d4.T()) > T0, 'kéo người vào Đóng gói: sản lượng dây chuyền tăng', [T0, await ev(() => __d4.T())]);
  await p.click('.d4-lan[data-l="0"] .the >> nth=0'); await p.click('.d4-lan[data-l="1"] .d4-dau'); ok((await ev(() => __d4.l())).filter(x => x === 1).length === 4, 'bấm thẻ rồi bấm công đoạn: chuyển được');
  await p.click('#d4Tu'); await p.waitForTimeout(500); const T2 = await ev(() => __d4.T()); ok(T2 >= 690, 'Tự cân bằng: dây chuyền ≥ 690 sp/giờ (tối đa lý thuyết ~745)', T2);
  await sec('demo4').screenshot({ path: S + '4.png' });
  // 5 biên bản
  await sec('demo5').scrollIntoViewIfNeeded(); ok(!(await ev(() => __d5.toi())), 'chưa chọn người: không bấm Tiếp được');
  await p.fill('#d5Tim', 'dung'); await p.click('#d5Ng button >> nth=0'); await p.click('#d5Toi'); await p.waitForTimeout(450);
  await p.click('#d5Loi button[data-i="1"]'); ok(/lần 3: Trừ 100\.000/.test(await p.textContent('#d5Loi')), 'Phạm Thu Dung đã vi phạm 2 lần: lần 3 trừ 100.000');
  await p.click('#d5Toi'); await p.waitForTimeout(500); ok(!(await ev(() => __d5.toi())), 'chưa ký: chưa bấm Tiếp được');
  const k = await p.locator('#d5Cv').boundingBox(); await p.mouse.move(k.x + 30, k.y + 100); await p.mouse.down();
  for (let i = 0; i <= 20; i++) await p.mouse.move(k.x + 30 + i * 12, k.y + 100 - Math.sin(i / 2) * 30); await p.mouse.up();
  ok(await ev(() => __d5.ky()), 'ký xong: có chữ ký'); await sec('demo5').screenshot({ path: S + '5-ky.png' });
  await p.click('#d5Toi'); await p.waitForTimeout(450); ok(/Phạm Thu Dung.*Không đeo bảo hộ.*lần thứ 3/.test(await ev(() => __d5.bb())) && await p.locator('#d5Bb img').count() === 1, 'biên bản có đủ người, lỗi, lần, chữ ký');
  await p.click('#d5Toi'); await p.waitForTimeout(600); ok(await ev(() => __d5.luu()), 'Lưu: đóng dấu'); await sec('demo5').screenshot({ path: S + '5.png' });
  // 6 khoảng ngày
  await sec('demo6').scrollIntoViewIfNeeded(); await p.click('#d6Nhanh button[data-k="7,13"]'); ok(JSON.stringify(await ev(() => __d6.ab())) === '[7,13]' && /6 ngày làm việc/.test(await ev(() => __d6.kq())), 'Tuần 2: 7–13/9, 6 ngày làm', await ev(() => __d6.kq()));
  const sv = await p.locator('#d6Svg').boundingBox(), xNgay = d => sv.x + (24 + (d - .5) * (568 / 30)) / 600 * sv.width /* bản máy tính: viewBox 600 */;
  await p.mouse.move(xNgay(3), sv.y + 50); await p.mouse.down(); await p.mouse.move(xNgay(9), sv.y + 50, { steps: 5 }); await p.mouse.up();
  ok(JSON.stringify(await ev(() => __d6.ab())) === '[3,9]', 'kéo chọn 3 → 9', await ev(() => __d6.ab()));
  await p.keyboard.press('ArrowRight'); await p.keyboard.press('Shift+ArrowRight'); ok(JSON.stringify(await ev(() => __d6.ab())) === '[4,11]', 'phím →, Shift+→: 4 → 11', await ev(() => __d6.ab()));
  await sec('demo6').screenshot({ path: S + '6.png' });
  ok(e.length === 0, 'máy tính: không lỗi JS', e);
  // điện thoại (chạm)
  const m = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage(); const e2 = []; m.on('pageerror', x => e2.push(x.message));
  await m.goto(F); await m.waitForTimeout(1000);
  await m.tap('#d1 .d1-o[data-i="0"]'); ok((await m.evaluate(() => __d1.st()))[0] === 'co', 'điện thoại: chạm điểm danh');
  await m.locator('#demo2').scrollIntoViewIfNeeded(); await m.tap('#d2Phim button[data-k="5"]'); ok(await m.evaluate(() => __d2.so()) === '5', 'điện thoại: chạm phím số');
  for (let i = 1; i <= 6; i++) { await m.locator('#demo' + i).scrollIntoViewIfNeeded(); await m.waitForTimeout(500); await m.locator('#demo' + i).screenshot({ path: S + 'dt' + i + '.png' }); }
  const tran = await m.evaluate(() => document.documentElement.scrollWidth); ok(tran <= 391, 'điện thoại: không tràn ngang', tran);
  ok(e2.length === 0, 'điện thoại: không lỗi JS', e2);
  // giảm chuyển động
  const r = await (await b.newContext({ viewport: { width: 1360, height: 900 }, reducedMotion: 'reduce' })).newPage(); const e3 = []; r.on('pageerror', x => e3.push(x.message));
  await r.goto(F); await r.waitForTimeout(400); await r.locator('#demo3').scrollIntoViewIfNeeded(); await r.click('#d3Nap'); await r.focus('#d3Cong'); await r.keyboard.press('Space');
  ok(await r.evaluate(() => __d3.con()) === 0, 'giảm chuyển động + bàn phím: Space trên cần gạt duyệt ngay');
  ok(e3.length === 0, 'giảm chuyển động: không lỗi JS', e3);
  await b.close(); console.log(`\n${dem - loi}/${dem} đạt`); process.exit(loi ? 1 : 0);
})();
