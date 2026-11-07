const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/**
 * Kiểm tra tab "Quy trình sản xuất" trên bản xem thử (mảnh QuyTrinh.html, chỉ chủ sở hữu).
 *   F=<bản xem thử .html> [CHUP=<thư mục ảnh>] node tests/quy-trinh-web.js
 */
const F = 'file://' + process.env.F, CHUP = process.env.CHUP;
let dem = 0, loi = 0, DH_TEN_DEM, window_dx; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
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
    ok(/Quy trình sản xuất/.test(s[0]) && /người trong danh sách đang làm .*trưởng \/ phó phòng.*Theo điểm danh/.test(s[1]) && /Để làm 9\.000 sp\/tháng cần khoảng/.test(s[1]) && s[2] && s[3] === 13 && s[4] === 10, 'Toàn nhà máy: câu kết luận (danh sách + điểm danh), báo nháp, 13 luồng (có POM, ngọn lẻ, đầu gậy lết, tip bán lẻ), bảng 9 xưởng + dòng tổng', s);
    s = await p.evaluate(() => { const ns = (QT.nhanSu || []), dem = {}; ns.forEach(n => { dem[n.MaXuong] = (dem[n.MaXuong] || 0) + 1; });
      const o = [...document.querySelectorAll('.qt-nmw .qt-o[data-x]')].map(e => [e.dataset.x, (e.querySelector('.so.nv') || {}).textContent || '']);
      return { o, dem, sai: o.filter(([x, t]) => !new RegExp('= ' + (dem[x] || 0) + '$').test(t) || !/CN/.test(t)) }; });
    ok(s.o.length >= 9 && !s.sai.length, '03/11: ô xưởng ghi TP / PP / TT / CN, tổng = danh sách đang làm (khớp chấm công)', s.sai.length ? s : s.o.slice(0, 3));
    const T = await p.evaluate(() => { const t = qtTinh(); return { nut: t.nut.ma, tai: t.nut.tai, ds: t.ds.map(o => [o.ma, +o.can.toFixed(2), o.co, +o.tai.toFixed(3)]) }; });
    ok(T.nut && T.ds.every(o => o[1] >= 0 && o[2] > 0) && T.ds.every(o => o[3] <= T.tai + 1e-3), 'nút thắt = xưởng tải cao nhất', T);
    // 01/11: mục tiêu theo sp/tháng -> % so với nhịp đóng gói thành phẩm; bảng thiếu / thừa người
    s = await p.evaluate(() => { const n = qtSlNayDo(), mt = qtMT(), T = qtTinh(); const th = [...document.querySelectorAll('.card table thead th')].map(x => x.textContent);
      return [n, mt, Math.round(9000 / 26 / n * 100), th.includes('Thiếu (+) / thừa (−)') && th.includes('Cần trong danh sách'), T.ds.every(o => o.can >= 0)]; });
    ok(s[0] > 50 && s[1] === s[2] && s[3] && s[4], 'cân bằng tải theo 9.000 sp/tháng: mục tiêu % = (9000 ÷ 26) ÷ nhịp đóng gói; bảng có cột thiếu / thừa + cần trong danh sách', s);
    s = await p.evaluate(() => { QTS.slNay = 400; const a = qtMT(); QTS.slNay = 0; qtMT(); return a; });
    ok(s === Math.round(9000 / 26 / 400 * 100), 'tự nhập nhịp hiện nay (400 sp/ngày) → mục tiêu tính lại', s);
    // 01/11 cách A: bước xuất mặc định mỗi xưởng có ít nhất 1 công đoạn, số ra/ngày đúng công thức
    s = await p.evaluate(() => { const r = {}; (QT.xuong || []).forEach(p => { const a = qtRa(p.MaXuong), N = Math.max(1, QT.soNgaySX); const tay = a.ma.reduce((x, m) => x + ((QT.thongKe[m] || {}).sl || 0), 0) / N; r[p.MaXuong] = [a.ma.length, Math.abs(tay - a.ngay) < 1e-9, a.macDinh]; }); return r; });
    ok(['PHOICB', 'PHOITHO', 'SON', 'INUV', 'NGONTARO', 'NGONTIP', 'CNC', 'HT', 'DG'].every(x => s[x] && s[x][0] >= 1 && s[x][1]), 'cách A: 9 xưởng đều có bước xuất chọn sẵn, ra/ngày = Σ sản lượng bước xuất ÷ ngày sản xuất', s);
    // 01/11: lưu đồ toàn nhà máy + nhóm công đoạn
    s = await p.evaluate(() => { const T = qtTinh(), ra = {}, khac = [];
      Object.keys(T.x).forEach(x => { const G = qtGomNhom(x, T); if (!G) return; const n = Object.values(G.o).reduce((a, g) => a + g.cd.length, 0);
        ra[x] = [n === T.x[x].cd.length, G.cot.length]; Object.values(G.o).forEach(g => { if (g.ten === 'Khác') g.cd.forEach(c => khac.push(x + ':' + c.ten)); }); });
      return { ra, khac, vsm: document.querySelectorAll('.qt-nm .qt-o').length, cap: document.querySelectorAll('svg.qt-duong path.nen.phu').length, duong: document.querySelectorAll('svg.qt-duong path.nen').length, ic: document.querySelectorAll('.qt-nm .qt-o .ic svg path, .qt-nm .qt-o .ic svg circle, .qt-nm .qt-o .ic svg rect').length > 9, nut: document.querySelectorAll('.qt-nm .qt-o.nut').length, hien: innerWidth > 640 ? getComputedStyle(document.querySelector('.qt-nmw')).display !== 'none' : getComputedStyle(document.querySelector('.qt-nmw')).display === 'none' }; });
    ok(Object.values(s.ra).every(v => v[0] && v[1] <= 11) && !s.khac.length, 'nhóm công đoạn: mọi công đoạn vào đúng 1 nhóm, mỗi xưởng ≤ 11 cột, không công đoạn nào rơi vào "Khác"', s);
    ok(s.vsm === 9 && s.nut <= 1 && s.ic && s.hien && (w <= 640 || (s.duong === 13 && s.cap === 5)), 'lưu đồ toàn nhà máy: 9 thẻ xưởng có biểu tượng, 8 đường nối + 5 đường cấp phụ (CNC → Ngọn Tip, Sơn, Đóng gói; POM; ngọn lẻ Tip → Đóng gói – 07/11), tối đa 1 nút thắt; điện thoại ẩn lưu đồ', s);
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
    s = await p.evaluate(() => [document.querySelectorAll('.qt-xg .qt-o').length, (window.__qtCanhX || []).length, document.querySelector('#qtChonX').value]);
    ok(s[0] >= 3 && s[1] >= 2 && s[2], 'Từng xưởng: lưu đồ có thẻ + đường nối', s);
    s = await p.evaluate(() => { const b = document.querySelector('.qt-xg .qt-o'); b.click(); const G = qtGomNhom(QTX, qtTinh()), n = Object.values(G.o).filter(g => g.lan !== 'NGOAI').length;
      return [document.querySelectorAll('.qt-xg .qt-o').length === n ? n : -1, !!document.querySelector('.qt-not'), !!document.querySelector('.qt-con table'), document.querySelectorAll('.qt-xg .qt-o.nut').length, (window.__qtCanhX || []).length]; });
    ok(s[0] >= 4 && s[1] && s[2] && s[3] <= 1 && s[4] >= 2, 'Từng xưởng: lưu đồ kiểu nhà máy (mỗi nhóm 1 thẻ, có đường nối), dòng nút thắt trên cùng, bấm thẻ mở công đoạn con, tối đa 1 nút thắt', s);
    s = await p.evaluate(() => { const r = { }; ['PHOITHO', 'PHOICB', 'HT'].forEach(x => { QTX = x; QTMoNhom = ''; qtVe(); const the = [...document.querySelectorAll('.qt-xg .qt-o')].map(e => e.getBoundingClientRect()); let chong = 0; the.forEach((a, i) => the.forEach((b, j) => { if (i < j && a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1) chong++; })); r[x] = [the.length, chong, window.__qtCanhX.length]; }); return r; });
    ok(Object.values(s).every(v => v[0] > 2 && v[1] === 0 && v[2] >= v[0] - 3), 'lưu đồ xưởng: thẻ không chồng nhau, mỗi thẻ trên dòng chảy đều có đường nối', s);
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
    // Sửa quy trình (02/11: A kéo thả trên lưu đồ ở máy tính + B danh sách ↑↓; điện thoại chỉ danh sách)
    await p.click('.qt-tabs button:has-text("Sửa quy trình")'); await p.selectOption('#qtChonX', 'SON'); await p.waitForTimeout(300);
    s = await p.evaluate(() => [document.querySelectorAll('.qt-r').length, document.querySelectorAll('.qt-ts').length, getComputedStyle(document.querySelector('.qt-sw')).display, !!document.querySelector('.qt-dsb').open, document.documentElement.scrollWidth > innerWidth + 1]);
    ok(s[0] === 13 && s[1] === 13 && (w > 640 ? s[2] !== 'none' && !s[3] : s[2] === 'none' && s[3]) && !s[4], 'Sửa: xưởng Sơn 13 công đoạn; ' + (w > 640 ? 'máy tính có lưu đồ kéo thả, danh sách thu gọn' : 'điện thoại: không lưu đồ, danh sách mở sẵn') + '; không tràn ngang', s);
    if (CHUP) await p.screenshot({ path: CHUP + '/qt-sua-' + w + '.png', fullPage: true });
    await p.evaluate(() => qtSuaO('VS-LAP-POM', 'Buoc', 8));
    ok(await p.evaluate(() => QTDoi && qtTim('VS-LAP-POM').Buoc === 8 && /•/.test(document.querySelector('.qt-tabs').textContent)), 'đổi bước: đánh dấu có thay đổi');
    // ↑ ↓: bước liền nhau 1..n, đi qua "cùng bước" rồi "bước riêng"; hoàn tác
    s = await p.evaluate(() => { const cs = () => qtCsX('SON').filter(q => !qtNgoai(q)), lien = () => { const b = [...new Set(cs().map(q => q.Buoc))].sort((a, c) => a - c); return b.every((v, i) => v === i + 1); };
      const q = qtTim('TUOT-LOT'), n0 = QTHoan.length, chung = () => cs().some(c => c !== q && c.Buoc === q.Buoc), c0 = chung();
      qtDichBuoc('TUOT-LOT', 1); const c1 = chung(), l1 = lien(); qtDichBuoc('TUOT-LOT', 1); const c2 = chung(), l2 = lien();
      qtHoanTac(); qtHoanTac(); return [c0 ? !c1 : c1, c2 === !c1, l1 && l2, q.Buoc, QTHoan.length === n0]; });
    ok(s[0] && s[1] && s[2] && s[3] === 1 && s[4], '↓ lần lượt: đang chung bước → tách bước riêng → làm cùng bước sau…; số bước luôn liền 1..n; hoàn tác trả lại như cũ', s);
    if (w > 640) {
      s = await p.evaluate(() => { const dt = new DataTransfer(), src = document.querySelector('.qt-ts[data-ma="TUOT-LOT"]'), dst = document.querySelector('.qt-sg .o[data-nh="CHUNG"][data-b="1"]:not(.khe)');
        src.dispatchEvent(new DragEvent('dragstart', { bubbles: true, dataTransfer: dt })); dst.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer: dt })); dst.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt }));
        const q = qtTim('TUOT-LOT'), a = [q.Nhanh, q.Buoc]; qtHoanTac();
        const k = document.querySelector('.qt-sg .khe[data-nh="CHUOI"][data-b="1"]'); src.dispatchEvent(new DragEvent('dragstart', { bubbles: true, dataTransfer: dt })); const s2 = document.querySelector('.qt-ts[data-ma="RAP-MAY-CHUOI"], .qt-ts[data-ma]:not([data-ma="TUOT-LOT"])').dataset.ma;
        qtThaVao(s2, 'CHUOI', 1, true); const q2 = qtTim(s2), b = [q2.Buoc, qtCsX('SON').filter(c => !qtNgoai(c) && c.Buoc === 1).length]; qtHoanTac();
        return [a.join(), b, !!window.__qtCanhS && __qtCanhS.length > 0, document.querySelectorAll('.qt-sw svg path').length > 0]; });
      ok(s[0] === 'CHUNG,1' && s[1][0] === 1 && s[1][1] === 1 && s[2] && s[3], 'kéo thả: thả vào ô → đổi nhánh + bước; thả vào khe → chèn bước mới; mũi tên vẽ lại', s);
      await p.evaluate(() => { QTChonThe = 'TUOT-LOT'; qtVe(); });
      ok(await p.evaluate(() => !!document.querySelector('.qt-chonthe .qt-r[data-ma="TUOT-LOT"]')), 'bấm thẻ: hiện khung chỉnh chi tiết của thẻ đó');
      await p.evaluate(() => { QTChonThe = ''; });
    }
    s = await p.evaluate(() => { const x = qtXuat('SON').slice(), m = qtCsX('SON').find(q => x.indexOf(q.Ma) < 0).Ma; qtSao(m); const a = qtXuat('SON').indexOf(m) >= 0 && !qtRa('SON').macDinh; qtHoanTac(); return [a, qtXuat('SON').join() === x.join()]; });
    ok(s[0] && s[1], '⭐ Ra hàng: thêm bước ra hàng (đã chọn tay), hoàn tác được', s);
    s = await p.evaluate(() => { qtDoiNhanh('TUOT-LOT', 'HOTRO'); const a = qtTim('TUOT-LOT').Nhanh === 'HOTRO' && !qtCanh(qtCsX('SON'))['TUOT-LOT'].length; qtHoanTac(); return [a, qtTim('TUOT-LOT').Nhanh]; });
    ok(s[0] && s[1] === 'CHUOI', 'đổi nhánh sang Hỗ trợ: ra ngoài dòng chảy (không nối); hoàn tác', s);
    await p.evaluate(() => { QTMo = 'TUOT-LOT'; qtVe(); });
    await p.evaluate(() => { const el = document.querySelector('.qt-r[data-ma="TUOT-LOT"] .chon input[data-t="VS-LAP-POM"]') || document.querySelector('.chon input[data-ma="TUOT-LOT"][data-t="VS-LAP-POM"]'); if (el) { el.checked = true; qtChonTay(el); } });
    ok(await p.evaluate(() => qtTim('TUOT-LOT').Truoc.length === 0 && /vòng lặp/.test(document.getElementById('toast').textContent)), 'chọn tay tạo vòng lặp: chặn, báo lỗi');
    await p.click('.qt-luu button:has-text("Lưu quy trình")'); await p.waitForTimeout(2500);
    s = await p.evaluate(() => [QT.nhap, (QTD.find(q => q.Ma === 'VS-LAP-POM') || {}).Buoc, __MAY_CHU.doc_('QuyTrinh').length, QTDoi]);
    ok(s[0] === false && s[1] === 8 && s[2] > 190 && !s[3], 'Lưu: ghi sheet QuyTrinh, tải lại không còn nháp', s);
    // Đơn hàng → xưởng (31/10) – bản xem thử dựng với DH=<các tab Sheet đơn>
    if (await p.evaluate(() => !!__MAY_CHU.doc_('KHO').length)) {
      // 01/11: tab riêng "Đơn hàng" (dưới tab Quy trình), mặc định "Đơn cần chú ý"
      ok(await p.evaluate(() => !!document.querySelector('#nav button[data-k="dh"]') && dsTabHienCo().some(t => t[0] === 'dh')), 'chủ sở hữu: có tab Đơn hàng trong menu');
      await p.evaluate(() => go('dh')); await p.waitForSelector('.dh-tl3', { timeout: 30000 });
      // 07/11: làm lại giao diện – 3 ô trả lời (Trễ / Sắp tới hạn / Ưu tiên) + dòng số gọn + 3 nhóm (Theo dõi / Đơn / Sản xuất)
      s = await p.evaluate(() => { const ds = dhLoc(), don = dhGomDon(ds), so = e => +e.textContent.replace(/\./g, ''), tl = [...document.querySelectorAll('.dh-tl b')].map(so), dong = [...document.querySelectorAll('.dh-so b')].map(so);
        const cy = dhChuY(don), tre = don.filter(g => g.st === 'treHan').length, nTre = cy.filter(x => x.l === 'tre' || x.l === 'qua30').length;
        return [tl.length, tl[0] === tre, tre === nTre, dong[0] === don.length, dong[2] === ds.reduce((a, o) => a + o.thieu, 0), DHV, cy.length ? document.querySelectorAll('.dh-bang tbody tr').length : /Không có đơn cần chú ý/.test(document.querySelector('main').textContent) ? 1 : 0, cy.every(x => x.g.thieu > 0),
          document.querySelectorAll('.dh-seg button').length, document.querySelectorAll('.dh-sub button').length, document.querySelectorAll('.dh-menu').length, document.body.classList.contains('tab-dh')]; });
      ok(s[0] === 3 && s[1] && s[2] && s[3] && s[4] && s[5] === 'chuy' && s[6] > 0 && s[7] && s[8] === 3 && s[9] === 3 && s[10] === 2 && s[11], 'Đơn hàng: 3 ô trả lời (số trễ = tổng nhóm trễ trong bảng), dòng số khớp dữ liệu; 3 nhóm + 3 thẻ con + menu ⚙ / ⋯; mặc định "Cần chú ý"', s);
      s = await p.evaluate(() => { const uu = dhUuDs(); DHV = 'uutien'; dhVeLai(); const r = [uu.length === (DH.uu && DH.uu.length ? dhLoc(DH.uu).length : dhLoc().filter(o => o.uuTien).length), /ĐƠN ƯU TIÊN/.test(document.querySelector('main').textContent) === !!(DH.uu && DH.uu.length), document.querySelector('.dh-sub button.on').textContent.startsWith('Ưu tiên')];
        DHV = 'chuy'; dhVeLai(); return r; });
      ok(s.every(Boolean), 'Ưu tiên: lấy danh sách từ tab "ĐƠN ƯU TIÊN" khi Sheet có tab này', s);
      // 07/11: thanh % hoàn thành 2 màu ở mọi danh sách đơn
      s = await p.evaluate(() => { const r = []; for (const v of ['chuy', 'uutien', 'chitiet', 'gom']) { DHV = v; dhVeLai(); r.push(document.querySelectorAll('.dh-than .dh-pb').length > 0); }
        const t = dhTienDo([{ sl: 10, thieu: 4, qua: { PHOI: 9, SON: 7 } }, { sl: 5, thieu: 0, qua: {} }]); r.push(t.sl === 15 && t.xong === 11 && t.dang === 3);
        const e = document.createElement('div'); e.innerHTML = dhThanh(t); r.push(/73%/.test(e.textContent) && e.querySelector('i.x').style.width === '73.3%'); DHV = 'chuy'; dhVeLai(); return r; });
      ok(s.every(Boolean), 'thanh % 2 màu ở Cần chú ý / Ưu tiên / Chi tiết / Gom; % = (đặt − thiếu) ÷ đặt, phần nhạt = đã qua xưởng chưa xong', s);
      // 07/11: công suất & deadline + sản lượng ngày + báo cáo lãnh đạo
      s = await p.evaluate(() => { const K = dhCSTinh(), sx = DH.don.filter(o => o.thieu > 0 && dhLaSX(o)).reduce((a, o) => a + o.thieu, 0);
        const sorted = K.don.every((g, i) => i === 0 || g.eta >= K.don[i - 1].eta), lamCN = K.don.some(g => new Date(g.eta + 'T00:00:00').getDay() === 0);
        const ngay = dhSoNgayLam(K.hn, dhNgayCong(K.xongHet, 1));
        DHV = 'congsuat'; dhVeLai(); const tl = document.querySelector('.dh-than .dh-tl b').textContent.replace(/\./g, '');
        return [K.tong === sx, sorted, !lamCN, Math.abs(ngay - K.ngayCan) <= 1, +tl === sx, K.ky.length === 12, !!document.querySelector('.dh-than svg polyline.phai'), document.querySelectorAll('.dh-bang.cs tbody tr:not(.dh-khoi)').length > 0]; });
      ok(s.every(Boolean), 'Công suất & deadline: tổng = còn thiếu hàng sản xuất, ngày dự kiến xong tăng dần theo thứ tự, không rơi vào chủ nhật, đủ ngày làm; 12 tuần + biểu đồ + bảng đơn', s);
      s = await p.evaluate(() => { dhCS(); DH.cs.nghi = [[dhNgayCong(dhHomNay(), 1), 'thử']]; delete DH.cs._m; const a = dhLaNgayLam(dhNgayCong(dhHomNay(), 1)); DH.cs.nghi = []; delete DH.cs._m; return [!a, dhSoNgayLam('2026-11-02', '2026-11-09')]; });
      ok(s[0] && s[1] === 6, 'ngày nghỉ khai trên web không tính là ngày làm; 1 tuần = 6 ngày làm (thứ 2 – thứ 7)', s);
      s = await p.evaluate(() => { DHTD = { lichSu: [], chay: { ngay: [], kenh: {} }, sanLuong: [['2026-10-30', '2026-10-29', 330, 300, 10, 100, 0, 0, { kenh: { Kho: 300 }, loai: { GAY: 300, PK: 30 } }], ['2026-11-02', '2026-10-30', 700, 680, 0, 90, 0, 5, { kenh: { Kho: 680 }, loai: { GAY: 680 } }]] };
        DHV = 'sanluong'; dhVeLai(); const sl = dhSLDong(), m = document.querySelector('main').textContent;
        return [sl[1].nl === 2, Math.round(sl[1].tb) === 340, dhNhanKhoang(sl[1]) === '30/10–31/10', /Theo tháng/.test(m), document.querySelectorAll('.dh-than svg rect').length === 2]; });
      ok(s.every(Boolean), 'Sản lượng ngày: khoảng qua chủ nhật = 2 ngày làm, trung bình / ngày; bảng tháng + biểu đồ', s);
      s = await p.evaluate(() => { DHV = 'baocao'; dhVeLai(); const B = dhBC(dhHomNay().slice(0, 7)), so = dhBCSo(B), don = dhGomDon(dhLoc());
        const kT = B.kenh.reduce((a, k) => a + k.n, 0), tl = +document.querySelector('.dh-bcso b').textContent.replace(/\D/g, '');
        return [so.length === 6, B.tre.length === don.filter(g => g.st === 'treHan').length, kT === B.don.length, B.kenh.some(k => k.tab === 'POD-ECOMSTONE'), B.trongTh.every(g => g.dlMin.slice(0, 7) === B.th), !!document.querySelector('.dh-than button[onclick="dhBCPDF()"]'), tl === B.sumK(B.slTh, 'sx')]; });
      ok(s.every(Boolean), 'Báo cáo lãnh đạo: 6 số, số đơn trễ = tab, tổng theo kênh = tổng đơn, đủ kênh (cả POD-ECOMSTONE), đơn deadline đúng tháng', s);
      await p.evaluate(() => { DHTD = null; DHV = 'chuy'; dhVeLai(); });
      for (const v of ['chitiet', 'gom', 'thongke', 'thaydoi']) { await p.evaluate(v => { DHV = v; dhVeLai(); }, v); await p.waitForTimeout(400); }
      s = await p.evaluate(() => { DHV = 'chitiet'; DHL.kenh = 'KHO'; dhVeLai(); const n = document.querySelectorAll('.dh-bang tbody tr').length, k = dhLoc().every(o => o.tab === 'KHO');
        DHL.kenh = ''; DHL.st = 'treHan'; const t = dhLoc().every(o => o.st === 'treHan'); DHL.st = ''; DHV = 'thongke'; dhVeLai();
        return [n > 0, k, t, !!document.querySelector('.dh-cong'), [...document.querySelectorAll('.card')].some(c => /Chuôi còn phải làm theo chất liệu/.test(c.textContent)) && [...document.querySelectorAll('.card')].some(c => /Ngọn còn phải làm theo chất liệu/.test(c.textContent)), dhBangXuat().length === DH.don.length + 1]; });
      ok(s.every(Boolean), 'lọc theo kênh / trạng thái; Thống kê: bảng chuôi / ngọn theo chất liệu, lịch giao 14 ngày; bảng xuất Excel đủ dòng', s);
      // 02/11: thống kê theo khúc – tổng bảng Chuôi = còn thiếu của gậy + chuôi lẻ; bảng Ngọn = gậy + ngọn lẻ; ma trận = gậy; có "Cách đọc" ở mọi thẻ
      s = await p.evaluate(() => { const so = t => +String(t).replace(/\./g, '').replace(/[^0-9]/g, '') || 0, sx = dhLoc().filter(o => o.thieu > 0), sum = f => sx.filter(f).reduce((a, o) => a + o.thieu, 0);
        const cards = [...document.querySelectorAll('main .card')], tim = re => cards.find(c => re.test(c.querySelector('div') ? c.querySelector('div').textContent : '')), tongCuoi = c => so([...c.querySelectorAll('tr.dh-khoi')].pop().lastElementChild.textContent);
        const cC = tim(/^Chuôi còn phải làm/), cN = tim(/^Ngọn còn phải làm/), mx = tim(/^Gậy 2 khúc: chất liệu chuôi/);
        return [tongCuoi(cC) === sum(o => o.pl.loai === 'GAY' || o.pl.loai === 'CHUOI'), tongCuoi(cN) === sum(o => o.pl.loai === 'GAY' || o.pl.loai === 'NGON'), tongCuoi(mx) === sum(o => o.pl.loai === 'GAY'),
          document.querySelectorAll('main .dh-doc').length >= 7, /Số ngày hàng tồn/.test(document.querySelector('.dh-tk').textContent), !!tim(/^Nguồn gây trễ/), !!tim(/^Vào – Ra – Tồn/), !!tim(/^Theo kênh/)]; });
      ok(s.every(Boolean), 'Thống kê theo khúc: tổng bảng chuôi / ngọn / ma trận khớp phần còn thiếu; số ngày hàng tồn, Pareto, Vào–Ra–Tồn, theo kênh; mỗi thẻ có "Cách đọc"', s);
      s = await p.evaluate(() => { const C = { ngay: [['2026-10-28', 50, 300, 900, 4, 3, 0], ['2026-10-29', 40, 320, 620, 5, 5, 0], ['2026-10-30', 30, 310, 340, 3, 2, 0], ['2026-10-31', 60, 290, 110, 2, 2, 0], ['2026-11-01', 20, 20, 110, 1, 0, 1]], kenh: { Kho: [10, 8] } };
        const cu = DHTD; DHTD = Object.assign({}, DHTD || {}, { loi: '', chay: C }); const el = document.createElement('div'); el.innerHTML = dhVeThongKe(dhLoc(), dhGomDon(dhLoc())); DHTD = cu;
        const vrt = el.querySelectorAll('.dh-vrt > div'), tk = el.querySelector('.dh-tk').textContent;
        return [vrt.length, el.querySelectorAll('.dh-vrt i.r.duoi').length, /Giao đúng hạn \(4 tuần\)80%/.test(tk), /8\/10 dòng xong/.test(tk), /Ra trung bình 248/.test(el.textContent)]; });
      ok(s[0] === 5 && s[1] === 1 && s[2] && s[3] && s[4], 'Vào–Ra–Tồn: 1 cột mỗi ngày, ngày ra thấp dưới giới hạn kiểm soát tô đỏ; đúng hạn 4 tuần = dung/xong', s);
      await p.evaluate(() => { DHV = 'xuong'; dhVeLai(); }); await p.waitForTimeout(200);
      s = await p.evaluate(() => { const K = dhTinh(), g = x => Object.values(K.X[x].nhom);
        return [g('SON').concat(g('INUV')).every(n => n.vlN === '' && n.ph === 'c'), g('NGONTARO').concat(g('NGONTIP'), g('CNC')).every(n => n.vlC === '' && n.ph === 'n'), g('PHOICB').every(n => (n.ph === 'c' ? n.vlN === '' : n.vlC === '')),
          g('HT').some(n => n.vlC && n.vlN), g('DG').some(n => n.vlN && !n.vlC)]; });
      ok(s.every(Boolean), 'Việc theo xưởng: xưởng chuôi theo chất liệu chuôi, xưởng ngọn theo chất liệu ngọn, Phôi tách theo khúc, Hoàn thiện / Đóng gói hiện cả 2', s);
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
      ok(s === 'tre,sap,nguyco,qua30', 'Đơn cần chú ý: trễ ≤ 30 ngày, sắp tới hạn ≤ 3 ngày, nguy cơ (600 sp / 60 mỗi ngày + 2 > 6 ngày); trễ quá 30 ngày xếp cuối (02/11), còn xa thì bỏ', s);
      s = await p.evaluate(() => { const hn = dhHomNay(), cong = (n) => { const d = new Date(hn + 'T00:00:00'); d.setDate(d.getDate() + n); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); };
        const mk = (dl, thieu) => ({ ma: 'M' + dl, kenh: 'Kho', thieu, dl, dong: [] }); const el = document.createElement('div'); el.innerHTML = dhVeChuY([mk(cong(-5), 10), mk(cong(-40), 7), mk(cong(-90), 3)]);
        const the = [...el.querySelectorAll('.card')]; const cuoi = the[the.length - 1]; const ma = [...cuoi.querySelectorAll('td.ma')].map(t => t.textContent);
        return [the.length, /Quá hạn hơn 30 ngày · 2 đơn · còn thiếu 10/.test(cuoi.textContent), ma.join(), /M/.test(the[0].textContent) && !/Quá hạn hơn/.test(the[0].textContent)]; });
      ok(s[0] === 2 && s[1] && s[2].split(',').length === 2 && s[2].split(',')[0] < s[2].split(',')[1] && s[3], 'Đơn quá hạn > 30 ngày: thẻ riêng bên dưới, mở sẵn, tổng đơn + còn thiếu, trễ lâu nhất lên đầu', s);
      s = await p.evaluate(() => { const a = dhThoiGian(dhTinh(), qtTinh()).nut.nay; dhDoiNL('thang', 18000, 1000, 50000); const b = dhThoiGian(dhTinh(), qtTinh()).nut.nay; dhDoiNL('thang', 5, 1000, 50000); const c = QTS.slThang; dhDoiNL('thang', 9000, 1000, 50000); return [Math.abs(a / b - 2) < 1e-9, c]; });
      ok(s[0] && s[1] === 18000, 'sửa sản lượng/tháng: gấp đôi sản lượng → số ngày giảm một nửa; số ngoài khoảng bị chặn', s);
      if (CHUP) await p.screenshot({ path: CHUP + '/dh-tg-' + w + '.png', fullPage: true });
      await p.evaluate(() => { DHV = 'kiem'; dhVeLai(); }); await p.waitForTimeout(300);
      s = await p.evaluate(() => [document.querySelectorAll('.card table tbody tr').length, document.querySelectorAll('.dh-tin.vang').length]);
      s.push(new Set(DH_TEN_DEM = await p.evaluate(() => DH.don.map(o => o.tenChuan))).size);
      ok(s[0] >= s[2] && s[1] > 0, 'Kiểm phân loại: liệt kê đủ tên hàng, vàng / đỏ lên đầu', s);
      // 02/11: Cấu hình sản phẩm (dòng gậy, loại chuôi / ngọn / tip) + báo sản phẩm mới ở Việc hôm nay
      await p.evaluate(() => { DHV = 'cauhinh'; dhVeLai(); }); await p.waitForTimeout(300);
      s = await p.evaluate(() => { chMoForm('', 'EVO4'); const k = chKhop(['EVO4']).length, f = !!document.getElementById('chGoi') && /Khớp/.test(document.getElementById('chKhop').textContent); CHForm = null; dhVeLai();
        return [document.querySelectorAll('.ch-d tbody tr:not(.dh-khoi)').length, document.querySelectorAll('.ch-k').length, k > 0, f, document.documentElement.scrollWidth > innerWidth + 1, [...document.querySelectorAll('.dh-menu button')].some(b => /Cấu hình sản phẩm/.test(b.textContent)) && /Cấu hình sản phẩm/.test(document.querySelector('.dh-cdt').textContent)]; });
      ok(s[0] >= 40 && s[1] === 3 && s[2] && s[3] && !s[4] && s[5], 'Cấu hình sản phẩm: bảng dòng gậy + 3 bảng loại khúc; form xem trước số tên hàng khớp chữ nhận diện; không tràn ngang', s);
      s = await p.evaluate(() => { window.__spMoi = { ok: true, n: 2, thieu: 13, ten: [{ ten: 'GAY NOVA X1', thieu: 10 }, { ten: 'GAY NOVA X2', thieu: 3 }], khuc: [{ bang: 'CHUOI', ma: 'NHAY390', ten: 'Nhảy 390', thieu: 5 }], tabMoi: ['KÊNH MỚI'] }; window.__spMoiTai = 1;
        const v = viecHomNay().map(x => x.t); return [v.includes('Sản phẩm mới chưa có cấu hình'), v.includes('Loại chuôi / ngọn chưa có chất liệu'), v.includes('Sheet đơn có tab kênh mới')]; });
      ok(s.every(Boolean), 'Việc hôm nay (chủ sở hữu): báo sản phẩm mới, loại khúc chưa có chất liệu, tab kênh mới', s);
      await p.evaluate(() => { moCauHinhSP(); }); await p.waitForTimeout(800);
      ok(await p.evaluate(() => DHV === 'cauhinh' && !!document.querySelector('.ch-d')), 'bấm "Bổ sung cấu hình" → mở Đơn hàng › Cấu hình sản phẩm');
      await p.evaluate(() => { window.__spMoi = null; });
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
  // 03/11: trưởng / phó phòng – chỉ xưởng mình, sửa = gửi đề xuất; chủ sở hữu duyệt
  for (const w of [1360, 390]) {
    const pt = await (await b.newContext({ viewport: { width: w, height: 900 } })).newPage(); const e2 = []; pt.on('pageerror', x => e2.push(x.message));
    await vao(pt, 'tpdg');
    let t = await pt.evaluate(() => [ME.vaiTro, dsTabHienCo().some(x => x[0] === 'qt'), dsTabHienCo().some(x => x[0] === 'dh')]);
    ok(t[0] === 'TP' && t[1] && !t[2], 'trưởng phòng (' + w + 'px): có tab Quy trình, không có tab Đơn hàng', t);
    await pt.evaluate(() => go('qt')); await pt.waitForSelector('.qt-tabs', { timeout: 30000 }); await pt.waitForTimeout(800);
    t = await pt.evaluate(() => [QT.laTP, QT.xuongCua, new Set(QTD.map(q => q.MaXuong)).size, !!document.querySelector('.qt-bar'), document.querySelectorAll('.qt-tabs button').length, document.querySelectorAll('.qt-o.cua').length, document.querySelectorAll('.qt-o .qt-bd').length, Object.keys(QT.nhanSu.reduce((a, n) => (a[n.MaXuong] = 1, a), {})).length, ME.xuong]);
    ok(t[0] && t[1] === t[8] && t[2] === 1 && !t[3] && t[4] === 4 && (w > 640 ? t[5] === 1 : true) && t[6] === 0 && t[7] <= 1, 'chỉ dữ liệu xưởng mình, không ô cài đặt, 4 khung; lưu đồ nhà máy không số, xưởng mình tô sáng', t);
    if (w > 640) {
      await pt.evaluate(() => { QTV = 'sua'; qtVe(); }); await pt.waitForTimeout(300);
      t = await pt.evaluate(() => { const q = QTD.find(x => x.MaXuong === QTX && !qtNgoai(x)); qtDichBuoc(q.Ma, 1); const nut = [...document.querySelectorAll('.qt-luu button')].find(x => /Gửi đề xuất/.test(x.textContent));
        return [!!nut && !nut.disabled, document.querySelectorAll('.qt-xl select[disabled]').length === document.querySelectorAll('.qt-xl .dong').length, document.querySelectorAll('.qt-xl-xem').length > 0]; });
      ok(t.every(Boolean), 'sửa: nút "Gửi đề xuất" (không có Lưu thẳng); luồng của xưởng khác chỉ xem, luồng của mình không đổi được xưởng giao', t);
      await pt.evaluate(() => qtGuiDX()); await pt.waitForTimeout(2500);
      t = await pt.evaluate(() => [!!(QT.deXuat && QT.deXuat.cho), /đang chờ Ban điều hành duyệt/.test(document.querySelector('main').textContent), QT.xemDX]);
      ok(t.every(Boolean), 'gửi đề xuất: tải lại thấy "đang chờ duyệt", khung hiển thị bản đề xuất', t);
      await pt.close();
    }
    await pt.close().catch(() => {});
    ok(!e2.length, 'trưởng phòng: không lỗi JS', e2);
  }
  // chủ sở hữu duyệt (cùng bản xem thử: đề xuất vừa gửi nằm trong máy chủ giả lập của trang trưởng phòng nên tạo lại ở trang chủ sở hữu)
  { const po = await (await b.newContext({ viewport: { width: 1360, height: 900 } })).newPage(); const e3 = []; po.on('pageerror', x => e3.push(x.message));
    await vao(po, 'chienpham');
    let t;
    t = await po.evaluate(() => { const M = __MAY_CHU, tp = M.doc_('TaiKhoan').find(x => x.VaiTro === 'TP' && x.MaXuong === 'SON'), tk = M.taoPhien_(tp), q = M.layQuyTrinh(tk, 30);
      const cd = q.quyTrinh.map(x => ({ Ma: x.Ma, Nhanh: x.Nhanh, Buoc: x.Buoc, Truoc: x.Truoc })); cd[0].Nhanh = 'HOTRO'; return M.guiDeXuatQuyTrinh(tk, { cd, xuat: [], luong: [{ Den: 'INUV', BTP: 'Chuôi sơn xong' }], loiNhan: 'Đề nghị đổi' }).ok; });
    window_dx = t;
    await po.evaluate(() => { window.__qtDXTai = 0; go('homnay'); }); await po.waitForTimeout(1500);
    t = await po.evaluate(() => viecHomNay().some(v => /đề xuất sửa quy trình/.test(v.t)));
    ok(window_dx && t, 'chủ sở hữu: Việc hôm nay báo "Trưởng phòng đề xuất sửa quy trình"', [window_dx, t]);
    await po.evaluate(() => { window.__qtMo = 'duyet'; go('qt'); }); await po.waitForSelector('.qt-tabs', { timeout: 30000 }); await po.waitForTimeout(800);
    t = await po.evaluate(() => [QTV, [...document.querySelectorAll('.qt-tabs button')].some(x => /Đề xuất từ xưởng \(1\)/.test(x.textContent)), [...document.querySelectorAll('main td')].some(x => /Hỗ trợ/.test(x.textContent)), /Lời nhắn: Đề nghị đổi/.test(document.querySelector('main').textContent)]);
    ok(t[0] === 'duyet' && t[1] && t[2] && t[3], 'màn duyệt: so sánh hiện tại / đề xuất (nhánh, công đoạn nhận hàng, luồng), lời nhắn', t);
    await po.evaluate(() => { window.confirm = () => true; const bt = [...document.querySelectorAll('main button')].find(x => /Duyệt và áp dụng/.test(x.textContent)); bt.click(); }); await po.waitForTimeout(1500);
    ok(await po.evaluate(() => QT.nhap && /bản nháp/.test(document.getElementById('toast').textContent) && (QT.deXuatCho || []).length === 1), 'quy trình còn nháp: chặn duyệt, nhắc lưu nháp trước');
    await po.evaluate(() => qtLuu()); await po.waitForTimeout(2500);
    await po.evaluate(() => { QTV = 'duyet'; qtVe(); const bt = [...document.querySelectorAll('main button')].find(x => /Duyệt và áp dụng/.test(x.textContent)); bt.click(); }); await po.waitForTimeout(3000);
    t = await po.evaluate(() => [!(QT.deXuatCho || []).length, (QTD.find(q => q.MaXuong === 'SON' && q.Nhanh === 'HOTRO') || {}).MaXuong, QT.luong.some(a => a.Tu === 'SON' && a.BTP === 'Chuôi sơn xong')]);
    ok(t[0] && t[1] === 'SON' && t[2], 'duyệt: áp dụng phần của xưởng Sơn (nhánh + luồng), hết đề xuất chờ', t);
    ok(!e3.length, 'chủ sở hữu duyệt: không lỗi JS', e3);
    await po.close(); }
  await b.close();
  console.log((loi ? '✗ ' : '✓ ') + (dem - loi) + '/' + dem + ' đạt'); process.exit(loi ? 1 : 0);
})();
