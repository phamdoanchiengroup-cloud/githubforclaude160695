const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/**
 * Kiểm tra tab "Quy trình sản xuất" trên bản xem thử (mảnh QuyTrinh.html, chỉ chủ sở hữu).
 *   F=<bản xem thử .html> [CHUP=<thư mục ảnh>] node tests/quy-trinh-web.js
 */
const F = 'file://' + process.env.F, CHUP = process.env.CHUP;
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
const vao = async (p, tk) => { await p.goto(F); await p.waitForSelector('#xtGoiY'); await p.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  await p.click('#xtGoiY button:has-text("' + tk + '")'); await p.waitForSelector('#app', { state: 'visible', timeout: 30000 }); await p.waitForTimeout(1500); };
(async () => {
  const b = await chromium.launch();
  for (const [w, ten] of [[1360, 'máy tính'], [390, 'điện thoại']]) {
    console.log('— ' + ten);
    const p = await (await b.newContext({ viewport: { width: w, height: 900 }, timezoneId: 'Asia/Ho_Chi_Minh' })).newPage(); const e = []; p.on('pageerror', x => e.push(x.message));
    await vao(p, 'chienpham');
    ok(await p.evaluate(() => ME.laOwner && dsTabHienCo().some(t => t[0] === 'qt') && !!document.querySelector('#nav button[data-k="qt"]')), 'chủ sở hữu: có tab Quy trình sản xuất trong menu');
    ok(await p.evaluate(() => typeof qtVe === 'undefined' && !window.__qtDaNap), 'chưa mở tab: chưa tải giao diện quy trình (Index nhẹ)');
    await p.evaluate(() => go('qt')); await p.waitForFunction(() => document.querySelector('.qt-ket'), null, { timeout: 30000 });
    let s = await p.evaluate(() => [document.querySelector('.ptitle').textContent, document.querySelector('.qt-ket').textContent, !!document.querySelector('.alert.a-wn'), document.querySelectorAll('.qt-luong .ln').length, document.querySelectorAll('.card table tbody tr').length]);
    ok(/Quy trình sản xuất/.test(s[0]) && /công nhân trong danh sách/.test(s[1]) && /Để làm 9\.000 sp\/tháng cần khoảng/.test(s[1]) && s[2] && s[3] === 11 && s[4] === 9, 'Toàn nhà máy: câu kết luận, báo nháp, 11 luồng (có POM, ngọn lẻ), bảng 9 xưởng', s);
    const T = await p.evaluate(() => { const t = qtTinh(); return { nut: t.nut.ma, tai: t.nut.tai, ds: t.ds.map(o => [o.ma, +o.can.toFixed(2), o.co, +o.tai.toFixed(3)]) }; });
    ok(T.nut && T.ds.every(o => o[1] >= 0 && o[2] > 0) && T.ds.every(o => o[3] <= T.tai + 1e-3), 'nút thắt = xưởng tải cao nhất', T);
    // 01/11: mục tiêu theo sp/tháng -> % so với nhịp đóng gói thành phẩm; bảng thiếu / thừa người
    s = await p.evaluate(() => { const n = qtSlNayDo(), mt = qtMT(), T = qtTinh(); const th = [...document.querySelectorAll('.card table thead th')].map(x => x.textContent);
      return [n, mt, Math.round(9000 / 26 / n * 100), th.includes('Thiếu (+) / thừa (−)') && th.includes('Cần trong danh sách'), T.ds.every(o => o.can >= 0)]; });
    ok(s[0] > 50 && s[1] === s[2] && s[3] && s[4], 'cân bằng tải theo 9.000 sp/tháng: mục tiêu % = (9000 ÷ 26) ÷ nhịp đóng gói; bảng có cột thiếu / thừa + cần trong danh sách', s);
    s = await p.evaluate(() => { QTS.slNay = 400; const a = qtMT(); QTS.slNay = 0; qtMT(); return a; });
    ok(s === Math.round(9000 / 26 / 400 * 100), 'tự nhập nhịp hiện nay (400 sp/ngày) → mục tiêu tính lại', s);
    // 01/11: lưu đồ toàn nhà máy + nhóm công đoạn
    s = await p.evaluate(() => { const T = qtTinh(), ra = {}, khac = [];
      Object.keys(T.x).forEach(x => { const G = qtGomNhom(x, T); if (!G) return; const n = Object.values(G.o).reduce((a, g) => a + g.cd.length, 0);
        ra[x] = [n === T.x[x].cd.length, G.cot.length]; Object.values(G.o).forEach(g => { if (g.ten === 'Khác') g.cd.forEach(c => khac.push(x + ':' + c.ten)); }); });
      return { ra, khac, vsm: document.querySelectorAll('.qt-nm .qt-o').length, cap: document.querySelectorAll('svg.qt-duong path.nen.phu').length, duong: document.querySelectorAll('svg.qt-duong path.nen').length, ic: document.querySelectorAll('.qt-nm .qt-o .ic svg path, .qt-nm .qt-o .ic svg circle, .qt-nm .qt-o .ic svg rect').length > 9, nut: document.querySelectorAll('.qt-nm .qt-o.nut').length, hien: innerWidth > 640 ? getComputedStyle(document.querySelector('.qt-nmw')).display !== 'none' : getComputedStyle(document.querySelector('.qt-nmw')).display === 'none' }; });
    ok(Object.values(s.ra).every(v => v[0] && v[1] <= 11) && !s.khac.length, 'nhóm công đoạn: mọi công đoạn vào đúng 1 nhóm, mỗi xưởng ≤ 11 cột, không công đoạn nào rơi vào "Khác"', s);
    ok(s.vsm === 9 && s.nut <= 1 && s.ic && s.hien && (w <= 640 || (s.duong === 10 && s.cap === 2)), 'lưu đồ toàn nhà máy: 9 thẻ xưởng có biểu tượng, 8 đường nối + 2 đường cấp phụ (CNC, POM), tối đa 1 nút thắt; điện thoại ẩn lưu đồ', s);
    // mỗi người: tổng phần thời gian chia cho các công đoạn = tỷ lệ ngày có mặt (không đếm trùng); xưởng: có mặt ≤ danh sách
    s = await p.evaluate(() => { const t = qtTinh(), N = QT.soNgaySX, fte = Object.values(t.cd).reduce((a, c) => a + c.fte, 0);
      const coMat = Object.values(QT.ngayCong).reduce((a, d) => a + Math.min(1, d / N), 0);
      return [fte, coMat, t.ds.every(o => o.coMat <= o.co + 1e-9), t.ds.every(o => o.nangSuat >= 0 && o.nangSuat < 2)]; });
    ok(s[0] > 10 && s[0] <= s[1] + 1e-6 && s[2] && s[3], 'chia thời gian người cho công đoạn không vượt ngày có mặt; có mặt ≤ danh sách', s);
    // công thức: thay mục tiêu 100 -> 200 thì CN cần gấp đôi
    await p.fill('#qtSlT', '6000'); await p.dispatchEvent('#qtSlT', 'change'); await p.waitForTimeout(200);
    const can1 = await p.evaluate(() => [QTS.mucTieu, qtTinh().ds.map(o => o.can)]);
    await p.fill('#qtSlT', '12000'); await p.dispatchEvent('#qtSlT', 'change'); await p.waitForTimeout(200);
    const can2 = await p.evaluate(() => [QTS.mucTieu, qtTinh().ds.map(o => o.can)]);
    ok(can2[1].every((v, i) => Math.abs(v / can1[1][i] - can2[0] / can1[0]) < 1e-9) && Math.abs(can2[0] / can1[0] - 2) < 0.02, '6.000 → 12.000 sp/tháng → người cần gấp đôi', [can1[0], can2[0]]);
    await p.fill('#qtSlT', '9000'); await p.dispatchEvent('#qtSlT', 'change'); await p.waitForTimeout(200);
    await p.evaluate(() => { QTS.slNay = QTS.slThang / QTS.ngayThang; qtVe(); });   // mục tiêu = 100% nhịp hiện nay
    // kiểm tay 1 công đoạn: can = SL/ngày ÷ định mức ÷ (giờ × hiệu suất)
    s = await p.evaluate(() => { const t = qtTinh(), m = Object.keys(QT.thongKe).find(k => (QT.cdMap[k] || {}).DM > 0 && t.cd[k]), c = t.cd[m];
      const tay = QT.thongKe[m].sl / QT.soNgaySX / QT.cdMap[m].DM / (QTS.gioCoMat * QTS.hieuSuat); return [m, c.can, tay]; });
    ok(Math.abs(s[1] - s[2]) < 1e-9, 'CN cần của 1 công đoạn đúng công thức', s);
    await p.evaluate(() => { QTS.slNay = 0; qtVe(); });
    if (CHUP) await p.screenshot({ path: CHUP + '/qt-nm-' + w + '.png', fullPage: true });
    // Từng xưởng
    await p.click('.qt-tabs button:has-text("Từng xưởng")'); await p.waitForTimeout(300);
    s = await p.evaluate(() => [document.querySelectorAll('.qt-sodo svg g.nut').length, document.querySelectorAll('.qt-sodo path.canh').length, document.querySelector('#qtChonX').value, !!document.querySelector('.qt-sodo svg g.nut.bd')]);
    ok(s[0] > 3 && s[1] > 3 && s[2], 'Từng xưởng: sơ đồ có nút + mũi tên', s);
    s = await p.evaluate(() => { const b = document.querySelector('.qt-bc .qt-bh:not(.dau)'); b.click(); return [document.querySelectorAll('.qt-bc .qt-bh:not(.dau)').length, !!document.querySelector('.qt-not'), !!document.querySelector('.qt-con table'), document.querySelectorAll('.qt-bc .qt-bh.nut').length]; });
    ok(s[0] >= 4 && s[1] && s[2] && s[3] <= 1, 'Từng xưởng: các bước đánh số (nhóm công đoạn), dòng nút thắt trên cùng, bấm dòng mở công đoạn con, tối đa 1 nút thắt', s);
    await p.evaluate(() => { QTMoNhom = ''; qtVe(); });
    if (CHUP) await p.screenshot({ path: CHUP + '/qt-x-' + w + '.png', fullPage: true });
    await p.selectOption('#qtChonX', 'HT'); await p.waitForTimeout(300);
    s = await p.evaluate(() => { const c = qtCanh(QTD.filter(q => q.MaXuong === 'HT')); return [c['HT-ISO-G'].sort().join(), document.querySelectorAll('.qt-sodo g.nut').length]; });
    ok(s[0] === ['HT-DANHBONG-MAYTIENDAT', 'HT-DANHBONG-RAP', 'HT-DANHBONG-RAPPHOI'].sort().join(), 'Hoàn thiện: kiểm gậy là điểm quy tụ (chuôi + ngọn + gậy 1 khúc)', s);
    if (CHUP) await p.screenshot({ path: CHUP + '/qt-ht-' + w + '.png', fullPage: true });
    // Con người
    await p.click('.qt-tabs button:has-text("Con người")'); await p.waitForTimeout(300);
    s = await p.evaluate(() => [document.querySelector('.qt-ket').textContent, document.querySelectorAll('.card table tbody tr').length]);
    ok(/chỉ 1 người/.test(s[0]) && s[1] > 3, 'Con người: đếm công đoạn 1 người / 2 người + danh sách', s);
    // Sửa quy trình: đổi bước, chọn tay, chặn vòng lặp, lưu
    await p.click('.qt-tabs button:has-text("Sửa quy trình")'); await p.selectOption('#qtChonX', 'SON'); await p.waitForTimeout(300);
    s = await p.evaluate(() => document.querySelectorAll('.qt-sua .dong').length);
    ok(s === 13, 'Sửa: xưởng Sơn có 13 công đoạn để sửa', s);
    if (CHUP) await p.screenshot({ path: CHUP + '/qt-sua-' + w + '.png', fullPage: true });
    await p.evaluate(() => qtSuaO('VS-LAP-POM', 'Buoc', 8));
    ok(await p.evaluate(() => QTDoi && qtTim('VS-LAP-POM').Buoc === 8 && /•/.test(document.querySelector('.qt-tabs').textContent)), 'đổi bước: đánh dấu có thay đổi');
    await p.evaluate(() => { QTMo = 'TUOT-LOT'; qtVe(); });
    await p.evaluate(() => { const el = document.querySelector('.chon input[data-t="VS-LAP-POM"]'); el.checked = true; qtChonTay(el); });
    ok(await p.evaluate(() => qtTim('TUOT-LOT').Truoc.length === 0 && /vòng lặp/.test(document.getElementById('toast').textContent)), 'chọn tay tạo vòng lặp: chặn, báo lỗi');
    await p.click('.qt-luu button:has-text("Lưu quy trình")'); await p.waitForTimeout(2500);
    s = await p.evaluate(() => [QT.nhap, (QTD.find(q => q.Ma === 'VS-LAP-POM') || {}).Buoc, __MAY_CHU.doc_('QuyTrinh').length, QTDoi]);
    ok(s[0] === false && s[1] === 8 && s[2] > 190 && !s[3], 'Lưu: ghi sheet QuyTrinh, tải lại không còn nháp', s);
    // Đơn hàng → xưởng (31/10) – bản xem thử dựng với DH=<các tab Sheet đơn>
    if (await p.evaluate(() => !!__MAY_CHU.doc_('KHO').length)) {
      // 01/11: tab riêng "Đơn hàng" (dưới tab Quy trình), mặc định "Đơn cần chú ý"
      ok(await p.evaluate(() => !!document.querySelector('#nav button[data-k="dh"]') && dsTabHienCo().some(t => t[0] === 'dh')), 'chủ sở hữu: có tab Đơn hàng trong menu');
      await p.evaluate(() => go('dh')); await p.waitForSelector('.dh-tong', { timeout: 30000 });
      s = await p.evaluate(() => { const ds = dhLoc(), don = dhGomDon(ds), the = [...document.querySelectorAll('.dh-tong b')].map(b => +b.textContent.replace(/\./g, ''));
        return [the.length, the[0] === don.length, the[5] === ds.reduce((a, o) => a + o.thieu, 0), DHV, dhChuY(don).length ? document.querySelectorAll('.dh-bang tbody tr').length : /Không có đơn cần chú ý/.test(document.querySelector('main').textContent) ? 1 : 0, dhChuY(don).every(x => x.g.thieu > 0)]; });
      ok(s[0] === 6 && s[1] && s[2] && s[3] === 'chuy' && s[4] > 0 && s[5], 'Đơn hàng: 6 thẻ tổng khớp dữ liệu (số đơn theo mã, tổng còn thiếu); mặc định "Đơn cần chú ý" nhóm trễ / sắp / nguy cơ', s);
      for (const v of ['chitiet', 'gom', 'thongke', 'thaydoi']) { await p.evaluate(v => { DHV = v; dhVeLai(); }, v); await p.waitForTimeout(400); }
      s = await p.evaluate(() => { DHV = 'chitiet'; DHL.kenh = 'KHO'; dhVeLai(); const n = document.querySelectorAll('.dh-bang tbody tr').length, k = dhLoc().every(o => o.tab === 'KHO');
        DHL.kenh = ''; DHL.st = 'treHan'; const t = dhLoc().every(o => o.st === 'treHan'); DHL.st = ''; DHV = 'thongke'; dhVeLai();
        return [n > 0, k, t, !!document.querySelector('.dh-cong'), [...document.querySelectorAll('.card')].some(c => /nhóm hàng × chất liệu/.test(c.textContent)), dhBangXuat().length === DH.don.length + 1]; });
      ok(s.every(Boolean), 'lọc theo kênh / trạng thái; Thống kê: ma trận nhóm × chất liệu, lịch giao 14 ngày; bảng xuất Excel đủ dòng', s);
      await p.evaluate(() => { DHV = 'thaydoi'; DHTD = null; dhVeLai(); }); await p.waitForTimeout(800);
      ok(await p.evaluate(() => !!DHTD && !DHTD.loi && /bản chụp|So với/.test(document.querySelector('main').textContent)), 'Thay đổi hôm nay: tải được (lần đầu báo chưa có bản ngày trước)');
      if (CHUP) await p.screenshot({ path: CHUP + '/dh-tab-' + w + '.png', fullPage: false });
      await p.evaluate(() => { DHV = 'xuong'; dhVeLai(); }); await p.waitForSelector('.dh-the', { timeout: 30000 });
      s = await p.evaluate(() => { const K = dhTinh(); return [document.querySelectorAll('.dh-the button').length, K.tongThieu, K.X.SON.tong, K.X.NGONTARO.tong, K.X.PHOICB.chuoi + K.X.PHOICB.ngon === K.X.PHOICB.tong, document.querySelectorAll('.card table tbody tr').length]; });
      ok(s[0] === 9 && s[1] > 5000 && s[2] > 0 && s[3] > 0 && s[4] && s[5] > 3, 'Đơn hàng → xưởng: 9 xưởng, việc còn lại theo 4 thông số', s);
      s = await p.evaluate(() => { const o = { thieu: 10, sl: 30, qua: { UV: 25 }, hong: { SON: 2 } }; return [dhCon(o, 'PHOI', dhChuoi('GAY', 'chuoi')), dhCon(o, 'SON', dhChuoi('GAY', 'chuoi')), dhCon(o, 'TARO', dhChuoi('GAY', 'ngon')), dhCon({ thieu: 4, sl: 4, qua: {} }, 'DG', dhChuoi('NGON', 'ngon'))]; });
      ok(s.join() === '5,7,10,4', 'còn làm: đã qua chặng sau thì chặng trước xong; cộng hỏng làm bù; ngọn không tính theo In UV', s);
      // Thời gian làm hết phần đơn còn lại: tự tính lại từ dhTinh + qtTinh, so với bảng
      s = await p.evaluate(() => { const K = dhTinh(), T = qtTinh(), G = dhThoiGian(K, T), P = QTS.slThang / QTS.ngayThang, sai = [];
        G.ds.forEach(o => { const x = K.X[o.ma], q = T.x[o.ma] || {}, nay = x.goc ? x.tong * K.tongThieu / (P * x.goc) : 0;
          if (Math.abs(nay - o.nay) > 1e-6) sai.push(o.ma + ' nay'); if (q.toiDa > 0 && Math.abs(o.max - nay * 100 / q.toiDa) > 1e-6) sai.push(o.ma + ' max');
          if (Math.abs(o.gio - nay * (q.gio || 0)) > 1e-6) sai.push(o.ma + ' gio'); if (Math.abs(o.cong * QTS.gioCoMat * QTS.hieuSuat - o.gio) > 1e-6) sai.push(o.ma + ' cong'); });
        const lon = Math.max.apply(null, G.ds.filter(o => o.max != null && o.con > 0).map(o => o.max));
        const the = [...document.querySelectorAll('.card')].find(c => /Thời gian làm hết/.test(c.textContent));
        return [sai, G.nut && G.nut.max === lon, !!the, the && the.querySelectorAll('tbody tr').length, the && the.querySelectorAll('.qt-tag.bd').length]; });
      ok(!s[0].length && s[1] && s[2] && s[3] === 9 && s[4] === 1, 'thời gian làm hết đơn: ngày nhịp nay / hết sức / giờ chuẩn / công đúng công thức, 1 nút thắt = xưởng lâu nhất', s);
      s = await p.evaluate(() => { const hn = dhHomNay(), g = { thieu: 600, dl: '' }, cong = (n) => { const d = new Date(hn + 'T00:00:00'); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
        const mk = (dl, thieu) => ({ ma: dl, thieu, dl, dong: [] }); const r = dhChuY([mk(cong(-5), 10), mk(cong(-40), 10), mk(cong(2), 10), mk(cong(6), 600), mk(cong(30), 10)]).map(x => x.l); return r.join(); });
      ok(s === 'tre,sap,nguyco', 'Đơn cần chú ý: trễ ≤ 30 ngày, sắp tới hạn ≤ 3 ngày, nguy cơ (600 sp / 60 mỗi ngày + 2 > 6 ngày); trễ quá 30 ngày và còn xa thì bỏ', s);
      s = await p.evaluate(() => { const a = dhThoiGian(dhTinh(), qtTinh()).nut.nay; dhDoiNL('thang', 18000, 1000, 50000); const b = dhThoiGian(dhTinh(), qtTinh()).nut.nay; dhDoiNL('thang', 5, 1000, 50000); const c = QTS.slThang; dhDoiNL('thang', 9000, 1000, 50000); return [Math.abs(a / b - 2) < 1e-9, c]; });
      ok(s[0] && s[1] === 18000, 'sửa sản lượng/tháng: gấp đôi sản lượng → số ngày giảm một nửa; số ngoài khoảng bị chặn', s);
      if (CHUP) await p.screenshot({ path: CHUP + '/dh-tg-' + w + '.png', fullPage: true });
      await p.evaluate(() => { DHV = 'kiem'; dhVeLai(); }); await p.waitForTimeout(300);
      s = await p.evaluate(() => [document.querySelectorAll('.card table tbody tr').length, document.querySelectorAll('.dh-tin.vang').length]);
      ok(s[0] > 300 && s[1] > 0, 'Kiểm phân loại: liệt kê tên hàng, vàng / đỏ lên đầu', s);
      await p.evaluate(() => { DHMo = 'k|' + document.querySelector('.card table tbody tr td').textContent.trim(); });
      if (CHUP) await p.screenshot({ path: CHUP + '/dh-' + w + '.png', fullPage: true });
    }
    ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'không tràn ngang');
    ok(!e.length, 'không lỗi JS', e);
    await p.close();
  }
  // Ban điều hành: không thấy tab, gọi thẳng bị chặn
  const p = await (await b.newContext({ viewport: { width: 1360, height: 900 } })).newPage();
  await vao(p, 'giamdoc');
  const s = await p.evaluate(() => { const a = __MAY_CHU.layQuyTrinh(TOKEN, 30), m = __MAY_CHU.layManhGiaoDien(TOKEN, 'QuyTrinh'); return [ME.vaiTro, ME.laOwner, dsTabHienCo().some(t => t[0] === 'qt'), a.ok, m.ok]; });
  ok(s[0] === 'ADMIN' && !s[1] && !s[2] && !s[3] && !s[4], 'ban điều hành (không phải chủ sở hữu): không có tab, máy chủ chặn dữ liệu + giao diện', s);
  await b.close();
  console.log((loi ? '✗ ' : '✓ ') + (dem - loi) + '/' + dem + ' đạt'); process.exit(loi ? 1 : 0);
})();
