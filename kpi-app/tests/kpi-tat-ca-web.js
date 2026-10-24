const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/** Kiểm thử mục 35 (tests/kpi-tat-ca/): Bảng KPI của ban điều hành / chủ sở hữu tự tải tất cả xưởng, xưởng nào xong hiện trước.
 *    DATA=csdl.json OUT=$S/xt.html GIO=2026-10-22T17:00:00+07:00 BO_HO_SO=1 TZ=Asia/Ho_Chi_Minh node tests/tao-ban-xem-thu.js
 *    F=$S/xt.html node tests/kpi-tat-ca-web.js */
const F = 'file://' + process.env.F;
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
async function vao(b, tk, w) {
  const p = await b.newPage({ viewport: { width: w || 1360, height: 900 } }); p.jsLoi = []; p.on('pageerror', e => p.jsLoi.push(e.message)); p.on('dialog', d => d.accept());
  await p.route(/fonts\.|cdnjs/, r => r.abort());
  await p.goto(F); await p.waitForSelector('#xtGoiY');
  await p.evaluate(tk => { document.getElementById('l_tk').value = tk; document.getElementById('l_mk').value = 'demo'; login(); }, tk);
  await p.waitForFunction(() => document.getElementById('app').style.display === 'block' && window.__soDangChay === 0, null, { timeout: 30000 });
  await p.evaluate(() => { try { localStorage.setItem('kpi_holo', 'tat'); } catch (e) {} }); await p.waitForTimeout(500);
  return p;
}
(async () => {
  const b = await chromium.launch();
  for (const tk of ['chienpham', 'giamdoc']) {
    console.log('\n' + tk + ' (ban điều hành' + (tk === 'chienpham' ? ', chủ sở hữu' : '') + ')');
    const p = await vao(b, tk);
    await p.evaluate(() => {   // ghi lại thời điểm từng xưởng hiện bảng
      window.__moc = []; new MutationObserver(() => { document.querySelectorAll('#kpi_bang .kpi-tc').forEach(o => { if (o.querySelector('table') && !o.__da) { o.__da = 1; __moc.push([o.getAttribute('data-x'), document.querySelectorAll('#kpi_bang .kpi-tc .empty').length]); } }); })
        .observe(document.body, { childList: true, subtree: true });
      kpiXuong = ''; go('kpi'); });
    let s = await p.evaluate(() => ({ chon: document.getElementById('kpi_xuong').selectedOptions[0].textContent, o: document.querySelectorAll('#kpi_bang .kpi-tc').length, pb: D.phongban.length, bat: /Chọn một/.test(document.getElementById('kpi_bang').textContent) }));
    ok(s.chon === '— Tất cả xưởng —' && s.o === s.pb && !s.bat, 'mở tab: không còn bắt chọn xưởng, tạo sẵn ' + s.o + ' ô cho ' + s.pb + ' xưởng', s);
    await p.waitForFunction(() => document.querySelectorAll('#kpi_bang .kpi-tc .empty').length === 0, null, { timeout: 60000 }).catch(() => {});
    s = await p.evaluate(() => ({ moc: __moc, bang: document.querySelectorAll('#kpi_bang .kpi-tc table').length, ghi: document.querySelectorAll('#kpi_bang .kpi-tc .note').length,
      dong: document.querySelectorAll('#kpi_bang .kpi-tc tbody tr').length, gop: (window.__kpiR && __kpiR.ds || []).length, tt: !!document.getElementById('kpiTcTT') }));
    ok(s.moc.length && s.moc[0][1] > 0, 'xưởng đầu tiên hiện bảng khi các xưởng khác còn đang tải (còn ' + (s.moc[0] && s.moc[0][1]) + ' ô chờ)', s.moc);
    ok(s.bang + s.ghi === await p.evaluate(() => D.phongban.length) && s.bang > 3 && !s.tt, 'tải xong: ' + s.bang + ' bảng xưởng' + (s.ghi ? ' + ' + s.ghi + ' xưởng chưa có dữ liệu' : '') + ', dòng "đang tải" tự ẩn', s);
    ok(s.gop === s.dong, 'số người gộp (' + s.gop + ') = số dòng trong các bảng – dùng cho khung chi tiết', [s.gop, s.dong]);
    await p.click('#kpi_bang .kpi-tc tbody tr button'); await p.waitForTimeout(800);
    s = await p.evaluate(() => (document.body.textContent.match(/Sản lượng/g) || []).length);
    ok(s > 3, 'bấm "Chi tiết" 1 người: mở được chi tiết KPI');
    await p.evaluate(() => { const x = D.phongban[1].MaXuong; kpiXuong = x; document.getElementById('kpi_xuong').value = x; taiKPIKy(); });
    await p.waitForFunction(() => !/Đang tải/.test(document.getElementById('kpi_bang').textContent), null, { timeout: 30000 }).catch(() => {});
    s = await p.evaluate(() => ({ tc: document.querySelectorAll('#kpi_bang .kpi-tc').length, h3: [...document.querySelectorAll('#kpi_bang .card h3')].map(h => h.firstChild.textContent) }));
    ok(s.tc === 0 && s.h3.length === 1, 'chọn 1 xưởng: chỉ bảng xưởng đó (như cũ)', s);
    ok(!p.jsLoi.length, 'không lỗi JS', p.jsLoi);
    await p.close();
  }
  console.log('\nHologram: bấm sao mở đúng bảng KPI của xưởng');
  let p = await vao(b, 'chienpham');
  await p.evaluate(() => { localStorage.removeItem('kpi_holo'); holoApDung(); go('dash'); }); await p.waitForTimeout(1500);
  const ma = await p.evaluate(() => document.querySelector('#hlDai .hl-sao').getAttribute('data-x'));
  await p.click('#hlDai .hl-sao circle.vong');
  await p.waitForFunction(() => tabHienTai === 'kpi' && !/Đang tải/.test(document.getElementById('kpi_bang').textContent), null, { timeout: 30000 }).catch(() => {});
  let s = await p.evaluate(() => ({ x: kpiXuong, chon: document.getElementById('kpi_xuong').value, h3: [...document.querySelectorAll('#kpi_bang .card h3')].map(h => h.firstChild.textContent) }));
  ok(s.x === ma && s.chon === ma && s.h3.length === 1, 'bấm sao ' + ma + ': Bảng KPI chỉ hiện xưởng đó (trước đây hiện "chọn xưởng")', s);
  await p.close();
  console.log('\nTrưởng phòng: không đổi');
  p = await vao(b, 'tpphoicb');
  await p.evaluate(() => go('kpi'));
  await p.waitForFunction(() => !/Đang tải/.test(document.getElementById('kpi_bang').textContent), null, { timeout: 30000 }).catch(() => {});
  s = await p.evaluate(() => ({ chon: !!document.getElementById('kpi_xuong'), tc: document.querySelectorAll('#kpi_bang .kpi-tc').length, bang: document.querySelectorAll('#kpi_bang table').length }));
  ok(!s.chon && s.tc === 0 && s.bang >= 1, 'trưởng phòng: không có ô chọn xưởng, vẫn 1 bảng xưởng mình', s);
  ok(!p.jsLoi.length, 'không lỗi JS', p.jsLoi);
  await b.close();
  console.log('\n' + (loi ? '✗ ' + loi + '/' + dem + ' kiểm tra lỗi' : '✓ Đạt cả ' + dem + ' kiểm tra'));
  process.exit(loi ? 1 : 0);
})();
