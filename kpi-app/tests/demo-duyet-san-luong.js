const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/** Kiểm tra demo-duyet-san-luong.html (làm lại màn hình Duyệt sản lượng):  S=<thư mục lưu ảnh> node tests/demo-duyet-san-luong.js */
const F = 'file:///home/user/githubforclaude160695/kpi-app/demo-duyet-san-luong.html', S = (process.env.S || '/tmp') + '/ds/';
require('fs').mkdirSync(S, { recursive: true });
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 1360, height: 950 } })).newPage(); const e = []; p.on('pageerror', x => e.push(x.message)); p.on('console', m => { if (m.type() === 'error' && !/fonts|ERR_/.test(m.text())) e.push(m.text()) });
  await p.goto(F); await p.waitForTimeout(600); const ev = f => p.evaluate(f);
  ok(await ev(() => __ds.dong()) === 55 && await ev(() => __ds.con()) === 24, 'số liệu mẫu: 55 dòng, 24 lượt');
  ok(await ev(() => __ds.can()) === 7 && (await ev(() => __ds.hien())).length === 7, 'mặc định chỉ hiện 7 lượt cần xem');
  const co = async k => p.evaluate(k2 => __ds.co(k2), k);
  ok((await co('CN205_2026-09-30')).some(x => /Hiệu suất \d{3}%/.test(x)), 'gõ thừa số 0 (5.200): cờ hiệu suất cao', await co('CN205_2026-09-30'));
  ok((await co('CN203_2026-09-29')).includes('Nghỉ theo chấm công'), 'nghỉ mà có sản lượng: có cờ');
  ok((await co('CN213_2026-10-01')).includes('Chưa có định mức'), 'Pha sơn: chưa có định mức');
  ok((await co('CN224_2026-09-30')).some(x => /Lỗi 12%/.test(x)), 'lỗi 12%: có cờ');
  ok((await co('CN222_2026-10-01')).includes('Trùng công đoạn'), 'nhập trùng: có cờ');
  ok((await co('CN225_2026-09-29')).includes('Nửa ngày'), 'nửa ngày mà sản lượng cả ngày: có cờ');
  await p.screenshot({ path: S + '1-can-xem.png', fullPage: true });
  // sửa số trong chi tiết → cờ biến mất, hiệu suất về bình thường
  await p.click('.g[data-k="CN205_2026-09-30"] .g-dong .ten'); await p.fill('.g[data-k="CN205_2026-09-30"] input[data-f="sl"] >> nth=0', '520'); await p.press('.g[data-k="CN205_2026-09-30"] input[data-f="sl"] >> nth=0', 'Tab');
  const hs = await p.evaluate(() => __ds.hs('CN205_2026-09-30')); ok(hs > 80 && hs < 120 && !(await co('CN205_2026-09-30')).length, 'sửa 5.200 → 520: hiệu suất ' + Math.round(hs) + '%, hết cờ');
  ok(/đã sửa số/.test(await p.textContent('.g[data-k="CN205_2026-09-30"] .ten')), 'đánh dấu "đã sửa số"');
  await p.screenshot({ path: S + '2-sua.png', fullPage: true });
  // loại dòng trùng
  await p.click('.g[data-k="CN222_2026-10-01"] .g-dong .ten'); await p.click('.g[data-k="CN222_2026-10-01"] [data-a="loai"] >> nth=1');
  ok(!(await co('CN222_2026-10-01')).length && await ev(() => __ds.dong()) === 54, 'loại dòng trùng: hết cờ, còn 54 dòng');
  // duyệt cả nhóm bình thường một lần + hoàn tác
  await p.click('#chonBinh'); ok(/1[89] lượt/.test(await p.textContent('#tChon')), 'chọn tất cả dòng bình thường', await p.textContent('#tChon'));
  await p.click('#tDuyet'); await p.waitForTimeout(300); const sau = await ev(() => __ds.con());
  ok(sau <= 6, 'duyệt một lần: còn ' + sau + ' lượt', sau);
  await p.click('#baoHt'); ok(await ev(() => __ds.con()) > sau, 'Hoàn tác trong 5 giây: trả lại'); await p.click('#chonBinh');
  await p.click('#tDuyet'); await p.waitForTimeout(5400); ok(await ev(() => __ds.daDuyet()) >= 17, 'sau 5 giây: ghi nhận đã duyệt', await ev(() => __ds.daDuyet()));
  // từ chối bắt buộc có lý do
  await p.click('[data-loc="can"]'); await p.click('.g[data-k="CN203_2026-09-29"] [data-a="tc"]'); ok(await p.isDisabled('#hopOk'), 'từ chối: chưa chọn lý do thì chưa bấm được');
  await p.click('#hopLy .chip >> text=Không có mặt ngày đó'); await p.click('#hopOk'); ok(/lý do: Không có mặt ngày đó/.test(await p.textContent('#baoChu')), 'từ chối kèm lý do');
  // bàn phím
  await p.keyboard.press('ArrowDown'); await p.keyboard.press('Enter'); ok(await p.locator('.g.tro.mo').count() === 1, 'phím ↓ Enter: mở chi tiết');
  const n0 = await ev(() => __ds.con()); await p.keyboard.press('a'); await p.waitForTimeout(100); ok(await ev(() => __ds.con()) === n0 - 1, 'phím A: duyệt lượt đang trỏ');
  await p.click('#tab [data-k="cu"]'); await p.waitForTimeout(200); ok(await p.locator('#cu table').count() === 3, 'tab Bản hiện tại: 3 bảng xưởng');
  await p.screenshot({ path: S + '3-ban-cu.png', fullPage: true });
  ok(e.length === 0, 'không lỗi JS', e);
  const m = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage(); const e2 = []; m.on('pageerror', x => e2.push(x.message));
  await m.goto(F); await m.waitForTimeout(500); await m.tap('.g >> nth=1 >> .ten'); await m.waitForTimeout(200);
  ok(await m.evaluate(() => document.documentElement.scrollWidth) <= 391, 'điện thoại: không tràn ngang', await m.evaluate(() => document.documentElement.scrollWidth));
  await m.screenshot({ path: S + '4-dt.png', fullPage: true }); ok(e2.length === 0, 'điện thoại: không lỗi JS', e2);
  await b.close(); console.log(`\n${dem - loi}/${dem} đạt`); process.exit(loi ? 1 : 0);
})();
