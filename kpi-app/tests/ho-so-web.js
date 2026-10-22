const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/** Kiểm thử mục 31 (tests/ho-so/): bảng điền hồ sơ bắt buộc khi đăng nhập + thẻ thống kê ở tab Nhân sự.
 *    DATA=csdl.json OUT=$S/xt.html GIO=2026-10-22T17:00:00+07:00 TZ=Asia/Ho_Chi_Minh node tests/tao-ban-xem-thu.js
 *    F=$S/xt.html node tests/ho-so-web.js */
const F = 'file://' + process.env.F;
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
async function vao(b, tk, rong) {
  const ctx = await b.newContext({ viewport: { width: rong || 1360, height: 900 }, timezoneId: 'Asia/Ho_Chi_Minh' });
  await ctx.route(/cdnjs\.cloudflare\.com|fonts\.googleapis|fonts\.gstatic/, r => r.abort());
  const p = await ctx.newPage(); p.jsLoi = []; p.on('pageerror', e => p.jsLoi.push(e.message)); p.on('dialog', d => d.accept());
  await p.goto(F); await p.waitForSelector('#xtGoiY');
  await p.click('#xtGoiY button:has-text("' + tk + '")');
  await p.waitForSelector('#app', { state: 'visible', timeout: 30000 }); await p.waitForTimeout(1500);
  return p;
}
(async () => {
  const b = await chromium.launch();
  console.log('1. Công nhân thiếu hồ sơ (c068)');
  let p = await vao(b, 'c068', 390);
  let s = await p.evaluate(() => ({ thieu: ME.hoSoThieu, mo: !!document.getElementById('hsBox'), o: [...document.querySelectorAll('#hsBox input')].map(i => i.id) }));
  ok(s.thieu.length > 0 && s.mo && s.o.length === s.thieu.length, 'hiện bảng "Bổ sung thông tin cá nhân" với ' + s.thieu.length + ' mục còn thiếu (màn điện thoại)', s);
  const che = await p.evaluate(() => { const r = document.getElementById('hsBox').getBoundingClientRect(); const e = document.elementFromPoint(20, 300); return r.width >= innerWidth && !!e.closest('#hsBox'); });
  ok(che, 'bảng che kín màn hình – không bấm được phần web phía sau');
  await p.evaluate(() => { document.getElementById('hsBox').querySelectorAll('input').forEach(i => i.value = '12'); });
  await p.click('#hsLuu'); await p.waitForTimeout(300);
  s = await p.evaluate(() => ({ mo: !!document.getElementById('hsBox'), loi: [...document.querySelectorAll('.hs-loi')].filter(x => x.textContent).length }));
  ok(s.mo && s.loi > 0, 'nhập sai: báo lỗi ngay dưới từng ô, chưa cho vào', s);
  const mau = { DienThoai: '0912345678', SoCCCD: '001234567890', DiaChi: 'Thôn 1, xã A, tỉnh B', SdtKhanCap: '0987654321', NamSinh: '1990', NgayVaoLam: '2026-05-01' };
  await p.evaluate(m => { Object.keys(m).forEach(k => { const i = document.getElementById('hs_' + k); if (i) i.value = m[k]; }); }, mau);
  await p.click('#hsLuu'); await p.waitForFunction(() => !document.getElementById('hsBox'), null, { timeout: 15000 }).catch(() => {});
  s = await p.evaluate(() => ({ mo: !!document.getElementById('hsBox'), thieu: ME.hoSoThieu.length }));
  ok(!s.mo && s.thieu === 0, 'điền đủ: bảng đóng, dùng web bình thường', s);
  ok(!p.jsLoi.length, 'không lỗi JS', p.jsLoi);
  await p.context().close();

  console.log('\n2. Chủ sở hữu: thẻ thống kê ở tab Nhân sự');
  p = await vao(b, 'chienpham');
  ok(!(await p.evaluate(() => !!document.getElementById('hsBox'))), 'tài khoản không gắn mã nhân viên: không phải điền');
  await p.evaluate(() => go('ns'));
  await p.waitForFunction(() => { const e = document.getElementById('hsTk'); return e && /Hồ sơ chưa đủ|đã nhập đủ/.test(e.textContent); }, null, { timeout: 20000 }).catch(() => {});
  s = await p.evaluate(() => { const e = document.getElementById('hsTk'); return e ? e.textContent : ''; });
  ok(/Hồ sơ chưa đủ: \d+\/\d+ người/.test(s) && /Số điện thoại/.test(s), 'thẻ "Hồ sơ chưa đủ: x/y người" + số theo từng mục', s.slice(0, 160));
  await p.click('#hsTk button'); await p.waitForTimeout(200);
  ok(await p.evaluate(() => document.getElementById('hsDs').style.display === '' && document.getElementById('hsDs').textContent.includes('thiếu')), 'bấm "Xem danh sách": hiện tên theo xưởng và mục còn thiếu');
  await p.waitForFunction(() => { const e = document.getElementById('vpDs'); return e && /chỉ chủ sở hữu/.test(e.textContent); }, null, { timeout: 20000 }).catch(() => {});
  s = await p.evaluate(() => { const e = document.getElementById('vpDs'); return e ? { t: e.textContent, n: e.querySelectorAll('tbody tr').length } : null; });
  ok(s && s.n >= 5 && /Ban điều hành/.test(s.t) && /Hành chính nhân sự/.test(s.t) && /Trợ lý/.test(s.t), 'khối "Ban điều hành & Hành chính nhân sự" (' + (s && s.n) + ' người) ở tab Nhân sự', s && s.t.slice(0, 160));
  ok(!p.jsLoi.length, 'không lỗi JS', p.jsLoi);
  await p.context().close();

  console.log('\n3. Ban điều hành (giamdoc): không thấy khối này, không phải điền hồ sơ');
  p = await vao(b, 'giamdoc');
  await p.evaluate(() => go('ns')); await p.waitForTimeout(2500);
  s = await p.evaluate(() => ({ vp: !!document.getElementById('vpDs'), hs: !!document.getElementById('hsBox') }));
  ok(!s.vp && !s.hs, 'không có khối danh sách BĐH, không hiện bảng hồ sơ', s);
  await b.close();
  console.log('\n' + (loi ? '✗ ' + loi + '/' + dem + ' kiểm tra lỗi' : '✓ Đạt cả ' + dem + ' kiểm tra'));
  process.exit(loi ? 1 : 0);
})();
