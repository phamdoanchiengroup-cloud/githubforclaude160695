const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/**
 * Mục 44 – web công nhân kiểu Apple (09/11): chỉ CN, thanh dưới 5 nút, Xưởng (Bảng KPI / Chấm công), Tôi,
 * bảng KPI xưởng top 3 + người trên + mình, chữ to, về giao diện cũ / giao diện mới, TP không đổi.
 *   F=<bản xem thử .html> node tests/cn-apple-web.js
 */
const F = 'file://' + process.env.F;
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
const vao = async (p, tk) => { await p.evaluate(t => { l_tk.value = t; l_mk.value = 'demo'; login(); }, tk);
  await p.waitForFunction(t => document.getElementById('app').style.display === 'block' && window.D && D.me && D.me.tk === t && window.ME === D.me, tk, { timeout: 60000 }); await p.waitForTimeout(1200); };
(async () => {
  const b = await chromium.launch();
  for (const [w, ten] of [[390, 'điện thoại'], [1360, 'máy tính']]) {
    console.log('— ' + ten);
    const ctx = await b.newContext({ viewport: { width: w, height: 860 }, timezoneId: 'Asia/Ho_Chi_Minh' });
    const p = await ctx.newPage(); const e = []; p.on('pageerror', x => e.push(x.message));
    await p.route(/cdnjs|fonts\.g|jsdelivr/, r => r.abort());
    await p.goto(F); await p.waitForSelector('#xtGoiY');
    await vao(p, 'c040');
    let s = await p.evaluate(() => ({ moi: document.documentElement.classList.contains('cn-moi'), nut: [...document.querySelectorAll('#botbar button')].map(x => (x.querySelector('.nl')||x).textContent.trim()),
      bb: getComputedStyle(document.getElementById('botbar')).display, nav: getComputedStyle(document.getElementById('nav')).display }));
    ok(s.moi && s.nut.join(',') === 'Nhập,KPI,Cơm,Xưởng,Tôi' && s.bb === 'flex' && s.nav === 'none', 'CN: giao diện mới, thanh dưới 5 nút Nhập · KPI · Cơm · Xưởng · Tôi, ẩn menu cũ', s);
    await p.evaluate(() => go('cnnhap')); await p.waitForTimeout(1500);
    s = await p.evaluate(() => ({ on: document.querySelector('#botbar button.on .nl').textContent, duc: getComputedStyle(document.getElementById('ducbar')).display, cham: document.querySelector('#botbar button[data-k=cnnhap]').classList.contains('cham'), co: !!document.getElementById('ducbar').textContent.trim() }));
    ok(s.on === 'Nhập' && s.duc !== 'none', 'tab Nhập: sáng nút Nhập, khung nhắc nhập hiện đủ', s);
    await p.evaluate(() => go('kpica')); await p.waitForTimeout(1500);
    s = await p.evaluate(() => ({ on: document.querySelector('#botbar button.on .nl').textContent, duc: getComputedStyle(document.getElementById('ducbar')).display, cham: document.querySelector('#botbar button[data-k=cnnhap]').classList.contains('cham'), co: !!document.getElementById('ducbar').textContent.trim() }));
    ok(s.on === 'KPI' && s.duc === 'none' && s.cham === s.co, 'tab KPI: khung nhắc ẩn, nút Nhập có chấm đỏ khi còn việc nhập', s);
    await p.evaluate(() => go('cnxuong')); await p.waitForFunction(() => document.querySelector('#kpi_bang tbody tr'), null, { timeout: 30000 }); await p.waitForTimeout(800);
    s = await p.evaluate(() => { const rows = [...document.querySelectorAll('#kpi_bang tbody tr:not(.cn-cach)')], hien = rows.filter(r => getComputedStyle(r).display !== 'none');
      const iToi = rows.findIndex(r => r.classList.contains('cn-toi'));
      return { tab: tabHienTai, on: document.querySelector('#botbar button.on .nl').textContent, seg: document.querySelector('#cnSeg .on') && document.querySelector('#cnSeg .on').textContent, n: rows.length, hien: hien.map(r => rows.indexOf(r)), iToi,
        cot: getComputedStyle(rows[0].cells[2]).display, nut: (document.querySelector('.cn-xemhet') || {}).textContent }; });
    const mong = [...new Set([0, 1, 2, s.iToi - 1, s.iToi].filter(i => i >= 0 && i < s.n))].sort((a, b) => a - b);
    ok(s.tab === 'kpicn' && s.on === 'Xưởng' && s.seg === 'Bảng KPI', 'Xưởng mở Bảng KPI, nút chuyển Bảng KPI / Chấm công', s);
    ok(s.iToi >= 0 && JSON.stringify(s.hien) === JSON.stringify(mong) && s.cot === 'none' && /Xem cả xưởng \(\d+ người\)/.test(s.nut), 'bảng KPI chỉ hiện top 3 + người trên + mình, gọn cột, có nút Xem cả xưởng', s);
    s = await p.evaluate(() => { document.querySelector('.cn-xemhet').click(); return [...document.querySelectorAll('#kpi_bang tbody tr:not(.cn-cach)')].filter(r => getComputedStyle(r).display !== 'none').length; });
    ok(s === (await p.evaluate(() => document.querySelectorAll('#kpi_bang tbody tr:not(.cn-cach)').length)), 'bấm Xem cả xưởng: hiện đủ cả xưởng', s);
    await p.evaluate(() => [...document.querySelectorAll('#cnSeg button')][1].click()); await p.waitForTimeout(1500);
    s = await p.evaluate(() => ({ tab: tabHienTai, on: document.querySelector('#botbar button.on .nl').textContent }));
    await p.evaluate(() => go('cnnhap')); await p.waitForTimeout(600); await p.evaluate(() => go('cnxuong')); await p.waitForTimeout(800);
    const nho = await p.evaluate(() => tabHienTai);
    ok(s.tab === 'cccn' && s.on === 'Xưởng' && nho === 'cccn', 'Chấm công trong Xưởng; quay lại Xưởng nhớ trang đang xem', [s, nho]);
    await p.evaluate(() => go('cntoi')); await p.waitForTimeout(500);
    s = await p.evaluate(() => ({ on: document.querySelector('#botbar button.on .nl').textContent, dong: [...document.querySelectorAll('.cn-dong > span:first-child')].map(x => x.firstChild.textContent), ten: document.querySelector('.cn-toi-dau .ptitle').textContent, cuon: document.documentElement.scrollWidth <= innerWidth + 1 }));
    ok(s.on === 'Tôi' && s.ten === ME_TEN(s) && ['Kỹ năng của tôi', 'Hướng dẫn sử dụng', 'Đổi mật khẩu', 'Chữ to', 'Rhino nhắc nhở', 'Dùng giao diện cũ'].every(t => s.dong.includes(t)) && s.cuon, 'Tôi: hồ sơ + kỹ năng, hướng dẫn, đổi mật khẩu, chữ to, Rhino, về giao diện cũ; không tràn ngang', s);
    await p.evaluate(() => go('kyn')); await p.waitForTimeout(800);
    ok(await p.evaluate(() => document.querySelector('#botbar button.on .nl').textContent === 'Tôi'), 'Kỹ năng mở từ Tôi: nút Tôi vẫn sáng');
    await p.evaluate(() => { go('cntoi'); cnDoiChuTo(); });
    s = await p.evaluate(() => ({ to: document.documentElement.classList.contains('cn-to'), cong: document.getElementById('cnCongTo').classList.contains('on'), z: getComputedStyle(document.getElementById('main')).zoom }));
    await p.evaluate(() => cnDoiChuTo());
    ok(s.to && s.cong && Number(s.z) > 1 && !(await p.evaluate(() => document.documentElement.classList.contains('cn-to'))), 'Chữ to bật / tắt được', s);
    s = await p.evaluate(() => { const a = maiTat(); cnDoiRhino(); const b = maiTat(); const c = document.getElementById('cnCongMai').classList.contains('on'); cnDoiRhino(); return { a, b, c, d: maiTat() }; });
    ok(s.a !== s.b && s.c === !s.b && s.d === s.a, 'Rhino nhắc nhở bật / tắt ở mục Tôi', s);
    p.once('dialog', d => d.accept()); await p.evaluate(() => cnVeCu()); await p.waitForTimeout(800);
    s = await p.evaluate(() => ({ moi: document.documentElement.classList.contains('cn-moi'), nutMoi: !!document.getElementById('cnNutMoi'), bb: [...document.querySelectorAll('#botbar button')].map(x => (x.querySelector('.nl')||x).textContent.trim()).join(','), nav: document.querySelectorAll('#nav button[data-k]').length }));
    ok(!s.moi && s.nutMoi && s.nav >= 5 && !/Tôi/.test(s.bb), 'Dùng giao diện cũ: về menu cũ, có nút "Giao diện mới" ở đầu trang', s);
    await p.evaluate(() => document.getElementById('cnNutMoi').click()); await p.waitForTimeout(800);
    s = await p.evaluate(() => ({ moi: document.documentElement.classList.contains('cn-moi'), nutMoi: !!document.getElementById('cnNutMoi'), tab: tabHienTai }));
    ok(s.moi && !s.nutMoi && s.tab === 'cnnhap', 'bấm "Giao diện mới": trở lại giao diện mới', s);
    // trưởng phòng: không đổi
    await vao(p, 'tpdg');
    s = await p.evaluate(() => ({ moi: document.documentElement.classList.contains('cn-moi'), seg: !document.getElementById('cnSeg') || getComputedStyle(document.getElementById('cnSeg')).display === 'none', toi: [...document.querySelectorAll('#botbar button .nl')].some(x => x.textContent === 'Tôi') }));
    ok(!s.moi && s.seg && !s.toi, 'trưởng phòng: giữ giao diện hiện tại', s);
    ok(!e.length, 'không lỗi JavaScript', e);
    await ctx.close();
  }
  await b.close();
  console.log('\n' + (dem - loi) + '/' + dem + ' đạt' + (loi ? ' – ' + loi + ' LỖI' : ''));
  process.exit(loi ? 1 : 0);
})();
function ME_TEN(s) { return s.ten; }
