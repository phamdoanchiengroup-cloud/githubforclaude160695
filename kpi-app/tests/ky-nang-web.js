const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/** Kiểm thử mục 33 (tests/ky-nang/): tab Kỹ năng trên trình duyệt – trưởng phòng đề xuất, ban điều hành duyệt, gán cấp, công nhân xem.
 *    DATA=csdl.json OUT=$S/xt.html GIO=2026-10-22T17:00:00+07:00 BO_HO_SO=1 TZ=Asia/Ho_Chi_Minh node tests/tao-ban-xem-thu.js
 *    F=$S/xt.html node tests/ky-nang-web.js      (ANH=thư-mục để lưu ảnh chụp) */
const F = 'file://' + process.env.F, ANH = process.env.ANH;
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
async function dangNhap(p, tk) {
  // không gọi logout() (tải lại trang làm mất dữ liệu thử) – đăng nhập đè bằng tài khoản khác
  await p.evaluate(() => { window.KN = null; });
  await p.evaluate(tk => { document.getElementById('l_tk').value = tk; document.getElementById('l_mk').value = 'demo'; login(); }, tk);
  await p.waitForSelector('#app', { state: 'visible', timeout: 30000 }); await p.waitForTimeout(800);
  await p.waitForFunction(() => __soDangChay === 0, null, { timeout: 30000 }); await p.waitForTimeout(300);   // chờ nạp xong (không vẽ đè tab Kỹ năng)
  await p.evaluate(() => { document.querySelectorAll('.mai-tour,#maiTour,.tour-ovl').forEach(e => e.remove()); });
}
const moTab = async p => { await p.evaluate(() => go('kyn')); await p.waitForFunction(() => KN && __soDangChay === 0 && document.querySelector('#main .kn-tabs, #main .kn-the, #main .card'), null, { timeout: 20000 }); await p.waitForTimeout(200); };
const chup = async (p, ten) => { if (ANH) await p.screenshot({ path: ANH + '/' + ten + '.png', fullPage: false }); };
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1360, height: 900 }, timezoneId: 'Asia/Ho_Chi_Minh' });
  await ctx.route(/cdnjs\.cloudflare\.com|fonts\.googleapis|fonts\.gstatic/, r => r.abort());
  const p = await ctx.newPage(); p.jsLoi = []; p.on('pageerror', e => p.jsLoi.push(e.message));
  p.on('dialog', d => d.accept(d.type() === 'prompt' ? 'Gộp vào kỹ năng chung' : undefined));
  await p.goto(F); await p.waitForSelector('#xtGoiY');

  console.log('1. Trưởng phòng (tpphoicb) đề xuất kỹ năng');
  await dangNhap(p, 'tpphoicb');
  ok(await p.evaluate(() => !!document.querySelector('#nav button[data-k="kyn"]')), 'menu có mục "Kỹ năng"');
  await moTab(p);
  await p.click('.kn-tabs button:has-text("Danh mục")');
  await p.click('button:has-text("Đề xuất kỹ năng")');
  await p.fill('#kf_ten', 'Phun PU bóng đạt độ phủ đều');
  await p.fill('#kf_mota', 'Pha sơn PU theo tỉ lệ, phun lớp bóng cho thân cơ, xử lý chảy / rỗ.');
  await p.fill('#kf_tc', 'Pha đúng tỉ lệ không cần nhắc\n10 cây liên tiếp không chảy, không rỗ\nĐạt ≥ 80% định mức giờ');
  const soCD = await p.evaluate(() => document.querySelectorAll('.kf_cd').length);
  ok(soCD >= 3, 'form liệt kê ' + soCD + ' công đoạn của xưởng để chọn');
  await p.evaluate(() => { const c = document.querySelectorAll('.kf_cd'); c[0].checked = true; c[1].checked = true; });
  await chup(p, '1-de-xuat');
  await p.click('#knHop button:has-text("Gửi đề xuất")'); await p.waitForTimeout(600);
  let s = await p.evaluate(() => ({ hop: !!document.getElementById('knHop'), the: [...document.querySelectorAll('.kn-the h4')].map(h => h.textContent) }));
  ok(!s.hop && s.the.some(t => /Phun PU bóng.*Chờ duyệt/.test(t)), 'gửi xong: thẻ kỹ năng "Chờ duyệt" trong danh mục', s);
  await p.click('.kn-tabs button:has-text("Ma trận")');
  ok(/chưa có kỹ năng được duyệt/.test(await p.textContent('#knNoi')), 'ma trận: báo chưa có kỹ năng được duyệt');

  console.log('\n2. Ban điều hành (giamdoc) duyệt');
  await dangNhap(p, 'giamdoc'); await moTab(p);
  ok(/Chờ duyệt \(1\)/.test(await p.textContent('.kn-tabs')), 'nút "Chờ duyệt (1)"');
  await p.click('.kn-tabs button:has-text("Chờ duyệt")');
  const ma = await p.evaluate(() => KN.kn[0].MaKN);
  await p.selectOption('#kd_' + ma + '_ts', 'B');
  await chup(p, '2-duyet');
  await p.click('.kn-the button:has-text("Duyệt")'); await p.waitForFunction(() => KN && KN.kn[0] && KN.kn[0].TrangThai === 'Đã duyệt', null, { timeout: 15000 }).catch(() => {});
  await p.waitForFunction(() => /Đã duyệt kỹ năng/.test(document.getElementById('toast').textContent), null, { timeout: 15000 }).catch(() => {});
  s = await p.evaluate(() => KN.kn.map(k => [k.TrangThai, k.TrongSo])); ok(s.length === 1 && s[0][0] === 'Đã duyệt' && s[0][1] === 'B', 'duyệt với trọng số B', s);

  console.log('\n3. Trưởng phòng ghi kết quả kiểm tra');
  await dangNhap(p, 'tpphoicb'); await moTab(p); await p.click('.kn-tabs button:has-text("Ma trận")');
  s = await p.evaluate(() => ({ cot: document.querySelectorAll('table.kn-mt thead th').length, dong: document.querySelectorAll('table.kn-mt tbody tr').length }));
  ok(s.cot === 3 && s.dong > 5, 'ma trận: ' + (s.dong - 2) + ' người × 1 kỹ năng + cột điểm', s);
  await p.click('table.kn-mt button[aria-label^="' + (await p.evaluate(() => (D.nhansu.find(n => n.MaNV === 'C360') || {}).HoTen)) + '"]');
  ok(await p.evaluate(() => !!document.getElementById('knHop') && document.querySelectorAll('.kn_tc').length === 3), 'bấm ô: mở hộp ghi kết quả với 3 tiêu chí');
  await p.check('input[name="kn_cap"][value="2"]');
  await p.click('#knHop button:has-text("Lưu")'); await p.waitForTimeout(500);
  ok(await p.evaluate(() => !!document.getElementById('knHop')), 'chưa tích đủ tiêu chí: không lưu (báo lỗi)');
  await p.evaluate(() => document.querySelectorAll('.kn_tc').forEach(c => c.checked = true));
  await p.fill('#kn_bc', 'Lô 2210 – 10 cây đạt');
  await chup(p, '3-gan');
  await p.click('#knHop button:has-text("Lưu")'); await p.waitForTimeout(600);
  s = await p.evaluate(() => ({ hop: !!document.getElementById('knHop'), o: (document.querySelector('table.kn-mt .kn-o.c2') || {}).textContent, diem: KN.diem.C360 }));
  ok(!s.hop && s.o === '2' && s.diem === 2, 'lưu: ô hiện cấp 2, điểm = B(2) × 1 = 2', s);
  await p.click('table.kn-mt button[aria-label^="' + (await p.evaluate(() => D.nhansu.find(n => n.MaNV === 'C360').HoTen)) + '"]');
  await p.check('input[name="kn_cap"][value="3"]');
  ok(/chờ ban điều hành xác nhận/.test(await p.textContent('#kn_ghiChu')), 'chọn cấp 3: nhắc sẽ chờ ban điều hành xác nhận');
  await p.evaluate(() => document.querySelectorAll('.kn_tc').forEach(c => c.checked = true)); await p.fill('#kn_bc', 'Lô 2221 – 30 cây, tự xử lý chảy sơn');
  await p.click('#knHop button:has-text("Lưu")'); await p.waitForFunction(() => KN && KN.gn.some(g => g.TrangThai === 'Chờ xác nhận') && document.querySelector('table.kn-mt'), null, { timeout: 15000 }).catch(() => {});
  ok(await p.evaluate(() => /⏳/.test(document.querySelector('table.kn-mt tbody').textContent)), 'ô có dấu ⏳ chờ xác nhận');
  await p.click('.kn-tabs button:has-text("Báo cáo")');
  ok(/điểm nghẽn/.test(await p.textContent('#knNoi')), 'báo cáo: kỹ năng chỉ 1 người làm được → "điểm nghẽn"');

  console.log('\n4. Ban điều hành xác nhận cấp 3');
  await dangNhap(p, 'giamdoc'); await moTab(p);
  await p.click('.kn-tabs button:has-text("Chờ duyệt")');
  await p.click('#knNoi button:has-text("Xác nhận")'); await p.waitForFunction(() => KN && KN.diem && KN.diem.C360 === 3, null, { timeout: 15000 }).catch(() => {});
  ok(await p.evaluate(() => KN.diem.C360 === 3), 'xác nhận: điểm thành 3 (B × 1,5)');

  console.log('\n5. Công nhân (c360) – điện thoại');
  await p.setViewportSize({ width: 390, height: 844 });
  await dangNhap(p, 'c360'); await moTab(p);
  s = await p.evaluate(() => ({ t: document.querySelector('#main').textContent, tran: document.documentElement.scrollWidth > innerWidth + 1 }));
  ok(/Kỹ năng của tôi/.test(s.t) && /Phun PU bóng/.test(s.t) && /Thành thạo/.test(s.t) && /chưa tính vào lương/.test(s.t), 'thấy kỹ năng của mình (cấp 3 Thành thạo) và điểm mô phỏng', s.t.slice(0, 200));
  ok(!s.tran, 'không tràn ngang trên điện thoại');
  await chup(p, '5-cong-nhan');
  await p.setViewportSize({ width: 390, height: 844 });
  await dangNhap(p, 'tpphoicb'); await p.evaluate(() => { knXem = 'mt'; }); await moTab(p);
  s = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
  ok(!s, 'trưởng phòng xem ma trận trên điện thoại: bảng cuộn trong khung, trang không tràn');
  await p.evaluate(() => document.querySelector('#knNoi').scrollIntoView());
  await chup(p, '6-ma-tran-dt');
  await p.click('table.kn-mt button.kn-b');
  s = await p.evaluate(() => { const h = document.querySelector('#knHop .card'); const r = [...document.querySelectorAll('#knHop input[type=radio],#knHop input[type=checkbox]')].map(e => e.getBoundingClientRect().width); return { rong: h.getBoundingClientRect().width, o: Math.max(...r) }; });
  ok(s.rong <= 390 && s.o <= 24, 'hộp ghi kết quả vừa màn điện thoại, nút chọn / ô tích đúng cỡ', s);
  await chup(p, '7-gan-dt');
  ok(!p.jsLoi.length, 'không lỗi JS', p.jsLoi);
  await b.close();
  console.log('\n' + (loi ? '✗ ' + loi + '/' + dem + ' kiểm tra lỗi' : '✓ Đạt cả ' + dem + ' kiểm tra'));
  process.exit(loi ? 1 : 0);
})();
