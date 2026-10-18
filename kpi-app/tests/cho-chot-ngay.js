const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/**
 * Thẻ "Chờ chốt" có cột Ngày (va-index.py mục 13), trên bản xem thử 1 file:
 *   F=<bản xem thử .html> node tests/cho-chot-ngay.js
 */
const F = 'file://' + process.env.F;
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
(async () => {
  const b = await chromium.launch();
  for (const [w, ten] of [[1440, 'máy tính'], [390, 'điện thoại']]) {
    console.log('— ' + ten);
    const p = await (await b.newContext({ viewport: { width: w, height: 900 }, timezoneId: 'Asia/Ho_Chi_Minh' })).newPage(); const e = []; p.on('pageerror', x => e.push(x.message));
    await p.goto(F); await p.waitForSelector('#xtGoiY'); await p.click('#xtGoiY button:has-text("tpdg")');
    await p.waitForSelector('#app', { state: 'visible', timeout: 30000 }); await p.waitForTimeout(1200);
    await p.evaluate(() => { try { maiTourDong() } catch (e) {} vNK(); });
    await p.waitForTimeout(500);
    const r = await p.evaluate(() => {
      const nvs = D.nhansu.filter(n => n.MaXuong === ME.xuong).slice(0, 2), c = D.congdoan.filter(c => c.MaXuong === ME.xuong)[0];
      const hq = new Date(today() + 'T00:00:00'); hq.setDate(hq.getDate() - 1);
      const s = hq.getFullYear() + '-' + ('0' + (hq.getMonth() + 1)).slice(-2) + '-' + ('0' + hq.getDate()).slice(-2);
      draft = [{ Ngay: today(), MaNV: nvs[0].MaNV, MaCD: c.MaCD, SoLuongLamRa: 31.25, GhiChu: '' }, { Ngay: today(), MaNV: nvs[0].MaNV, MaCD: c.MaCD, SoLuongLamRa: 44.85, GhiChu: '' },
        { Ngay: today(), MaNV: nvs[1].MaNV, MaCD: c.MaCD, SoLuongLamRa: 12.5, GhiChu: '' }, { Ngay: s, MaNV: nvs[0].MaNV, MaCD: c.MaCD, SoLuongLamRa: 20, GhiChu: '' }];
      renderDraft();
      const bx = document.getElementById('dbox'), th = [...bx.querySelectorAll('thead th')].map(x => x.textContent.trim());
      const hn = today().slice(8, 10) + '/' + today().slice(5, 7), hq2 = s.slice(8, 10) + '/' + s.slice(5, 7);
      return { th, nhom: bx.querySelectorAll('tbody tr').length, hn: bx.textContent.includes(hn + 'Th') || bx.textContent.includes(hn), hq: bx.textContent.includes(hq2), khac: bx.textContent.includes('không phải hôm nay'), canh: /2 ngày/.test(bx.textContent), tran: document.documentElement.scrollWidth - innerWidth };
    });
    ok(r.th[1] === 'Ngày', 'có cột Ngày ngay sau Nhân viên', r.th);
    ok(r.nhom === 7, 'cùng người nhập 2 ngày thành 2 nhóm riêng (3 nhóm, 7 dòng kể cả Tổng)', r.nhom);
    ok(r.hn && r.hq && r.khac, 'hiện dd/mm từng nhóm, ngày khác hôm nay ghi "không phải hôm nay"', r);
    ok(r.canh, 'có nhiều ngày thì nhắc kiểm tra cột Ngày trước khi chốt');
    ok(r.tran <= 0, 'không tràn ngang trang', r.tran);
    await p.click('#dbox tbody tr:nth-child(1) button'); await p.waitForTimeout(200);
    ok(await p.evaluate(() => draft.map(d => d.SoLuongLamRa).join(',') === '44.85,12.5,20'), 'nút Xóa vẫn xóa đúng dòng');
    await p.evaluate(() => { draft = draft.filter(d => d.Ngay === today()); renderDraft(); });
    ok(await p.evaluate(() => !/khác nhau/.test(document.getElementById('dbox').textContent) && /hôm nay/.test(document.getElementById('dbox').textContent)), 'chỉ một ngày (hôm nay): không có cảnh báo');
    ok(e.length === 0, 'không lỗi JS', e);
  }
  await b.close();
  console.log((loi ? '✗ ' : '✓ ') + (dem - loi) + '/' + dem + ' đạt'); process.exit(loi ? 1 : 0);
})();
