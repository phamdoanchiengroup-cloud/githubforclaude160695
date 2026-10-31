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
    ok(/Quy trình sản xuất/.test(s[0]) && /công nhân trong danh sách/.test(s[1]) && /mục tiêu 137%/.test(s[1]) && s[2] && s[3] === 9 && s[4] === 9, 'Toàn nhà máy: câu kết luận, báo nháp, 9 luồng, bảng 9 xưởng', s);
    const T = await p.evaluate(() => { const t = qtTinh(); return { nut: t.nut.ma, tai: t.nut.tai, ds: t.ds.map(o => [o.ma, +o.can.toFixed(2), o.co, +o.tai.toFixed(3)]) }; });
    ok(T.nut && T.ds.every(o => o[1] >= 0 && o[2] > 0) && T.ds.every(o => o[3] <= T.tai + 1e-3), 'nút thắt = xưởng tải cao nhất', T);
    // mỗi người: tổng phần thời gian chia cho các công đoạn = tỷ lệ ngày có mặt (không đếm trùng); xưởng: có mặt ≤ danh sách
    s = await p.evaluate(() => { const t = qtTinh(), N = QT.soNgaySX, fte = Object.values(t.cd).reduce((a, c) => a + c.fte, 0);
      const coMat = Object.values(QT.ngayCong).reduce((a, d) => a + Math.min(1, d / N), 0);
      return [fte, coMat, t.ds.every(o => o.coMat <= o.co + 1e-9), t.ds.every(o => o.nangSuat >= 0 && o.nangSuat < 2)]; });
    ok(s[0] > 10 && s[0] <= s[1] + 1e-6 && s[2] && s[3], 'chia thời gian người cho công đoạn không vượt ngày có mặt; có mặt ≤ danh sách', s);
    // công thức: thay mục tiêu 100 -> 200 thì CN cần gấp đôi
    await p.fill('#qtMt', '100'); await p.dispatchEvent('#qtMt', 'change'); await p.waitForTimeout(200);
    const can1 = await p.evaluate(() => qtTinh().ds.map(o => +o.can.toFixed(2)));
    await p.fill('#qtMt', '200'); await p.dispatchEvent('#qtMt', 'change'); await p.waitForTimeout(200);
    const can2 = await p.evaluate(() => qtTinh().ds.map(o => +o.can.toFixed(2)));
    ok(can2.every((v, i) => Math.abs(v - 2 * can1[i]) < 0.02), 'mục tiêu 200% → CN cần gấp đôi', [can1, can2]);
    await p.fill('#qtMt', '100'); await p.dispatchEvent('#qtMt', 'change'); await p.waitForTimeout(200);
    // kiểm tay 1 công đoạn: can = SL/ngày ÷ định mức ÷ (giờ × hiệu suất)
    s = await p.evaluate(() => { const t = qtTinh(), m = Object.keys(QT.thongKe).find(k => (QT.cdMap[k] || {}).DM > 0 && t.cd[k]), c = t.cd[m];
      const tay = QT.thongKe[m].sl / QT.soNgaySX / QT.cdMap[m].DM / (QTS.gioCoMat * QTS.hieuSuat); return [m, c.can, tay]; });
    ok(Math.abs(s[1] - s[2]) < 1e-9, 'CN cần của 1 công đoạn đúng công thức', s);
    if (CHUP) await p.screenshot({ path: CHUP + '/qt-nm-' + w + '.png', fullPage: true });
    // Từng xưởng
    await p.click('.qt-tabs button:has-text("Từng xưởng")'); await p.waitForTimeout(300);
    s = await p.evaluate(() => [document.querySelectorAll('.qt-sodo svg g.nut').length, document.querySelectorAll('.qt-sodo path.canh').length, document.querySelector('#qtChonX').value, !!document.querySelector('.qt-sodo svg g.nut.bd')]);
    ok(s[0] > 3 && s[1] > 3 && s[2], 'Từng xưởng: sơ đồ có nút + mũi tên', s);
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
