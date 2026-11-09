const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/**
 * 09/11: Thống kê › Sản xuất & đơn hàng › Sản lượng từng xưởng – tới hết hôm qua, bấm ô xưởng -> biểu đồ nổi to; KPI tạm tính không tính hôm nay.
 *   F=<bản xem thử .html, GIO trong ngày làm> [CHUP=<thư mục>] node tests/bo-hom-nay-web.js
 */
const path = require('path');
const F = 'file://' + process.env.F, CHUP = process.env.CHUP;
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
(async () => {
  const b = await chromium.launch();
  for (const [w, ten] of [[1360, 'máy tính'], [390, 'điện thoại']]) {
    console.log('— ' + ten);
    const p = await (await b.newContext({ viewport: { width: w, height: 900 }, timezoneId: 'Asia/Ho_Chi_Minh' })).newPage(); const e = []; p.on('pageerror', x => e.push(x.message));
    await p.route(/cdnjs|fonts\.g|jsdelivr/, r => r.abort());
    await p.goto(F); await p.waitForSelector('#xtGoiY'); await p.evaluate(() => { l_tk.value = 'chienpham'; l_mk.value = 'demo'; login(); });
    await p.waitForFunction(() => window.D && D.me && D.me.tk === 'chienpham' && window.ME === D.me, null, { timeout: 60000 }); await p.waitForTimeout(1200);
    await p.evaluate(() => { TKV = 'sx'; go('tk'); });
    await p.waitForSelector('.dh-xo[data-x]', { timeout: 90000 });
    let s = await p.evaluate(() => ({ den: DHDG.den, hn: today(), td: (document.querySelector('.dh-xo[data-x]').closest('.card').textContent.match(/tới hết [0-9/]+/) || [''])[0], n: document.querySelectorAll('.dh-xo[data-x]').length,
      ngs: dhNgayLamGanNhat(5) }));
    ok(s.den < s.hn && s.ngs.every(d => d < s.hn) && /tới hết/.test(s.td) && s.n >= 5, 'Sản lượng từng xưởng: số tới hết hôm qua (' + s.td + '), ' + s.n + ' xưởng', s);
    await p.click('.dh-xo[data-x] .t'); await p.waitForSelector('.dh-phong', { timeout: 5000 });
    s = await p.evaluate(() => { const o = document.querySelector('.dh-phong'), sv = o.querySelector('svg'), r = sv.getBoundingClientRect(); return { w: r.width, cot: sv.querySelectorAll('rect').length, ngay: o.querySelectorAll('.dh-phong-bang span').length, ten: o.querySelector('.dh-phong-dau b').textContent }; });
    ok(s.cot >= 10 && s.ngay >= 10 && (w < 700 ? s.w >= 300 : s.w >= 900), 'bấm ô xưởng → cửa sổ nổi: biểu đồ to (' + Math.round(s.w) + ' px), số từng ngày bên dưới', s);
    if (CHUP) await p.screenshot({ path: path.join(CHUP, 'phong-xuong-' + w + '.png') });
    await p.keyboard.press('Escape'); await p.waitForTimeout(200);
    ok(!(await p.$('.dh-phong')), 'Esc đóng cửa sổ');
    await p.click('.dh-xo[data-x] .t'); await p.waitForSelector('.dh-phong'); await p.click('.dh-phong-x'); ok(!(await p.$('.dh-phong')), 'nút ✕ đóng cửa sổ');
    ok(await p.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 0, 'không tràn ngang');
    // KPI tạm tính trong trình duyệt: thêm dòng nhật ký hôm nay -> không đổi
    s = await p.evaluate(() => { const nv = (D.nhatky.find(r => String(r.TrangThai).trim() === 'Đã chốt') || {}).MaNV; const a = JSON.stringify(kpiThangNay_(nv));
      const r = Object.assign({}, D.nhatky.find(x => x.MaNV === nv)); r.Ngay = today(); r.SoLuongLamRa = 99999; r.TrangThai = 'Đã chốt'; D.nhatky = D.nhatky.concat([r]); const b2 = JSON.stringify(kpiThangNay_(nv)); return [a === b2, nv]; });
    ok(s[0], 'KPI tạm tính (trình duyệt) không tính dòng nhật ký hôm nay', s);
    ok(!e.length, 'không lỗi trang', e);
  }
  await b.close();
  console.log('\n' + (dem - loi) + '/' + dem + ' đạt' + (loi ? ' – ' + loi + ' LỖI' : ''));
  process.exit(loi ? 1 : 0);
})();
