const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/**
 * Kiểm thử web tăng tốc đợt 3 (08/11): bộ đo tốc độ, "Mở nhanh (máy cá nhân)" – bản lưu mã hóa, hiện số lần trước kèm nhãn,
 * chặn thao tác ghi khi đang hiện số cũ, Thoát xóa bản lưu; Thống kê › Tốc độ web.
 *   F=<bản xem thử .html> node tests/tang-toc-3-web.js
 */
const F = 'file://' + process.env.F;
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
const dn = async (p, tk, nho) => { await p.waitForSelector('#xtGoiY'); await p.evaluate(([tk, nho]) => { document.getElementById('l_tk').value = tk; document.getElementById('l_mk').value = 'demo'; document.getElementById('bbNhoDL').checked = nho; login(); }, [tk, nho]);
  await p.waitForFunction(() => document.getElementById('app').style.display === 'block' && inApp && !window.__dlCu && window.__soDangChay === 0, null, { timeout: 60000 }); await p.waitForTimeout(1800); };
(async () => {
  const b = await chromium.launch();
  for (const [w, ten] of [[1360, 'máy tính'], [390, 'điện thoại']]) {
    console.log('— ' + ten);
    const ctx = await b.newContext({ viewport: { width: w, height: 900 } }), p = await ctx.newPage(); const e = []; p.on('pageerror', x => e.push(x.message));
    await p.route(/fonts\.g|cdnjs/, r => r.abort());
    await p.goto(F); await p.evaluate(() => { try { localStorage.clear(); } catch (x) {} });
    await p.goto(F); await dn(p, 'chienpham', false);
    ok(await p.evaluate(() => !Object.keys(localStorage).some(k => /^kpi_dl_/.test(k)) && localStorage.getItem('kpi_nho_dl') !== '1'), 'mặc định KHÔNG lưu số liệu trên máy');
    let s = await p.evaluate(() => [TD_BUF.map(x => x.f), TD_BUF.find(x => x.f === 'napDuLieu')]);
    ok(s[0].includes('napDuLieu') && s[0].includes('vaoApp') && typeof s[1].sv === 'number', 'bộ đo ghi: gói đăng nhập (kèm thời gian máy chủ), đăng nhập → thấy số', s);
    await p.evaluate(() => { logout = (function (g) { return function () { window.confirm = () => true; return g(); }; })(logout); });
    await p.evaluate(() => { window.confirm = () => true; logout(); }); await p.waitForTimeout(800);
    await p.goto(F); await dn(p, 'chienpham', true);
    s = await p.evaluate(() => { const k = Object.keys(localStorage).find(k => /^kpi_dl_/.test(k)); const g = k && JSON.parse(localStorage.getItem(k)); return [k, !!g && !!g.iv && g.d.length > 1000, k ? localStorage.getItem(k) : '', localStorage.getItem('kpi_nho_dl')]; });
    ok(s[0] === 'kpi_dl_chienpham' && s[1] && s[3] === '1', 'tích "Mở nhanh" → có bản lưu theo tài khoản', [s[0], s[3]]);
    const tenNguoi = await p.evaluate(() => ((D.nhansu || [])[0] || {}).HoTen || ME.ten);
    ok(!s[2].includes(tenNguoi) && !/HoTen|nhatky|MaNV/.test(s[2]), 'bản lưu đã mã hóa (không đọc được tên, mã nhân viên)');
    // mở lại trang (còn phiên): gói đăng nhập chậm 4 giây -> hiện ngay số lần trước + nhãn
    await p.addInitScript(() => { window.__tre = { napDuLieu: 4000 }; });
    await p.reload(); const t0 = Date.now();
    await p.waitForFunction(() => window.__dlCu && document.getElementById('app').style.display === 'block', null, { timeout: 8000 }).catch(() => {});
    const t1 = Date.now() - t0;
    s = await p.evaluate(() => [!!window.__dlCu, (document.getElementById('dlNhan') || {}).textContent || '', (D.nhansu || []).some(x => x.SoCCCD || x.DienThoai || x.DiaChi), tabHienTai]);
    ok(s[0] && /Đang hiện số lúc .* đang cập nhật/.test(s[1]) && t1 < 3500, ten + ': mở lại trang hiện ngay số lần trước (' + t1 + ' ms) kèm nhãn', [s, t1]);
    ok(!s[2], 'bản hiện tạm không có CCCD / điện thoại / địa chỉ');
    s = await p.evaluate(() => { let t = ''; const g = toast; toast = m => { t = m; }; call('luuMay', [{}], () => {}); toast = g; return [t, window.__soDangChay || 0]; });
    ok(/Đang cập nhật số liệu mới/.test(s[0]), 'đang hiện số cũ: thao tác ghi bị chặn', s);
    await p.evaluate(() => { const ds = dsTabHienCo().filter(t => t[0] !== 'hd'); if (ds[1]) go(ds[1][0]); });
    const tabTruoc = await p.evaluate(() => tabHienTai);
    await p.waitForFunction(() => !window.__dlCu, null, { timeout: 15000 });
    s = await p.evaluate(() => [!document.getElementById('dlNhan'), tabHienTai, (D.nhansu || []).some(x => 'SoCCCD' in x || 'DienThoai' in x)]);
    ok(s[0] && s[1] === tabTruoc, 'số mới về: bỏ nhãn, ở nguyên tab đang xem (' + tabTruoc + ')', s);
    // Thoát -> xóa bản lưu
    await p.evaluate(() => { window.__tre = {}; window.confirm = () => true; logout(); }); await p.waitForTimeout(1200);
    ok(await p.evaluate(() => !localStorage.getItem('kpi_dl_chienpham')), 'Thoát → xóa bản lưu trên máy');
    // tài khoản khác không mở được bản của người trước; bỏ tích → xóa hết
    await p.evaluate(() => { localStorage.setItem('kpi_dl_giamdoc', JSON.stringify({ v: DL_VER, t: Date.now(), iv: 'AAAAAAAAAAAAAAAA', d: 'AAAA' })); });
    await p.goto(F); await dn(p, 'giamdoc', false);
    ok(await p.evaluate(() => !Object.keys(localStorage).some(k => /^kpi_dl_/.test(k)) && !window.__dlCu), 'bỏ tích "Mở nhanh" khi đăng nhập → xóa mọi bản lưu; bản hỏng không làm lỗi');
    ok(!e.length, ten + ': không lỗi JS', e);
    await ctx.close();
  }
  // Thống kê › Tốc độ web (chủ sở hữu)
  { const p = await (await b.newContext({ viewport: { width: 1360, height: 900 } })).newPage(); const e = []; p.on('pageerror', x => e.push(x.message));
    await p.route(/fonts\.g|cdnjs/, r => r.abort()); await p.goto(F); await dn(p, 'chienpham', false);
    await p.evaluate(() => tdGui_()); await p.waitForTimeout(800);
    await p.evaluate(() => go('tk')); await p.waitForFunction(() => window.__qtDaNap && typeof tkChon === 'function', null, { timeout: 60000 });
    await p.evaluate(() => tkChon('td')); await p.waitForFunction(() => /Người dùng chờ bao lâu|Chưa có số đo/.test(document.querySelector('main').innerText), null, { timeout: 30000 });
    const s = await p.evaluate(() => document.querySelector('main').innerText);
    ok(/Người dùng chờ bao lâu/.test(s) && /Tải gói dữ liệu đăng nhập/.test(s) && /Từng loại thao tác/.test(s), 'Thống kê › Tốc độ web: bảng theo vai trò + từng thao tác', s.slice(0, 300));
    ok(!e.length, 'Tốc độ web: không lỗi JS', e); }
  await b.close();
  console.log((loi ? '✗ ' : '✓ ') + (dem - loi) + '/' + dem + ' đạt'); process.exit(loi ? 1 : 0);
})();
