const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
/**
 * Kiểm tra 4 hoạt ảnh Lottie đã gắn vào web thật (Index.html), trên bản xem thử 1 file.
 *   F=<bản xem thử .html> LOTTIE=<lottie_light.min.js lấy từ npm> node tests/lottie-web.js
 * (sandbox chặn cdnjs nên chặn đường dẫn cdnjs và trả file lottie-web cục bộ)
 */
const F = 'file://' + process.env.F, LIB = fs.readFileSync(process.env.LOTTIE, 'utf8');
let dem = 0, loiDem = 0;
const ok = (dk, ten, ct) => { dem++; if (dk) console.log('  ✓ ' + ten); else { loiDem++; console.log('  ✗ ' + ten + (ct !== undefined ? ' → ' + JSON.stringify(ct).slice(0, 220) : '')); } };
async function vao(b, tk, o = {}) {
  const ctx = await b.newContext(Object.assign({ viewport: { width: 1440, height: 900 } }, o.giam ? { reducedMotion: 'reduce' } : {}));
  await ctx.route(/cdnjs\.cloudflare\.com\/ajax\/libs\/lottie-web/, r => o.chan ? r.abort() : r.fulfill({ status: 200, contentType: 'application/javascript', body: LIB }));
  const p = await ctx.newPage(); p.loi = []; p.on('pageerror', e => p.loi.push(e.message));
  await p.goto(F); await p.waitForSelector('#xtGoiY'); await p.click(`#xtGoiY button:has-text("${tk}")`);
  await p.waitForSelector('#app', { state: 'visible', timeout: 30000 }); await p.waitForTimeout(1500); return p;
}
const svgTrong = (p, sel) => p.evaluate(s => { const e = document.querySelector(s); return e ? e.querySelectorAll('svg path').length : -1; }, sel);
(async () => {
  const b = await chromium.launch();

  console.log('\n1. Trang trống "Đã duyệt hết" (TP)');
  let p = await vao(b, 'tpdg');
  await p.evaluate(() => { D.choDuyet = []; go('duyetsl'); }); await p.waitForTimeout(1200);
  ok(await p.locator('.empty.lt-trong b').textContent() === 'Đã duyệt hết', 'có dòng "Đã duyệt hết"');
  ok(await svgTrong(p, '.lt-trong .lt-o') > 5, 'hoạt ảnh bảng kẹp hiện (svg Lottie)', await svgTrong(p, '.lt-trong .lt-o'));
  const lap = await p.evaluate(() => __ltDs.filter(a => a.__el && a.__el.closest('.lt-trong')).map(a => ({ loop: a.loop, dung: a.isPaused })));
  ok(lap.length === 1 && lap[0].loop && !lap[0].dung, 'lặp nhẹ nhàng, đang chạy', lap);
  await p.evaluate(() => go('homnay')); await p.waitForTimeout(900);
  ok(await p.evaluate(() => __ltDs.every(a => document.body.contains(a.__el))), 'sang tab khác: hoạt ảnh cũ được dọn');
  await p.context().close(); p = await vao(b, 'tpdg');

  console.log('\n2. Dấu tích Lottie khi duyệt');
  await p.evaluate(() => go('duyetsl')); await p.waitForTimeout(900);
  const cho0 = await p.evaluate(() => D.choDuyet.length);
  const nut = p.locator('#main button.giu').first();
  if (cho0 && await nut.count()) {
    const bx = await nut.boundingBox();
    await p.mouse.move(bx.x + bx.width / 2, bx.y + bx.height / 2); await p.mouse.down(); await p.waitForTimeout(1000); await p.mouse.up();
    let thay = false; for (let i = 0; i < 20 && !thay; i++) { await p.waitForTimeout(60); thay = await p.evaluate(() => !!document.querySelector('.lt-tich svg')); }
    ok(thay, 'dấu tích Lottie hiện tại nút vừa duyệt');
    await p.waitForTimeout(1500);
    ok(!(await p.evaluate(() => !!document.querySelector('.lt-tich'))), 'dấu tích tự biến mất');
    ok(await p.evaluate(() => D.choDuyet.length) < cho0, 'vẫn duyệt đúng');
  } else ok(false, 'không có dòng chờ duyệt để thử', cho0);
  ok(!p.loi.length, 'không lỗi trang', p.loi);
  await p.context().close();

  console.log('\n3. Báo cáo tháng: chờ → xong');
  p = await vao(b, 'chienpham');
  await p.evaluate(() => go('kpi')); await p.waitForSelector('#bc_ky', { timeout: 20000 });
  await p.evaluate(() => { HTMLIFrameElement.prototype.__p = 1; });
  await p.click('button:has-text("Xem & in")');
  await p.waitForTimeout(150);
  const cho = await p.evaluate(() => ({ mo: $('ltPhu').classList.contains('mo'), b: $('ltPhu').querySelector('b').textContent }));
  ok(cho.mo && /Đang tổng hợp báo cáo tháng/.test(cho.b), 'lớp phủ "Đang tổng hợp…" hiện ngay', cho);
  await p.waitForTimeout(400);
  ok(await svgTrong(p, '#ltPhu .lt-hinh') > 5, 'hoạt ảnh tờ báo cáo chạy');
  await p.screenshot({ path: process.env.OUT ? process.env.OUT + '/lt-cho.png' : '/dev/null' }).catch(() => {});
  let xong = null; for (let i = 0; i < 60 && !xong; i++) { await p.waitForTimeout(200); xong = await p.evaluate(() => /sẵn sàng/.test($('ltPhu').querySelector('b').textContent) ? 1 : null); }
  ok(xong, 'chuyển sang "Báo cáo đã sẵn sàng" (dấu tích)');
  await p.waitForTimeout(2200);
  ok(!(await p.evaluate(() => $('ltPhu').classList.contains('mo'))), 'lớp phủ tự đóng sau 1,7 giây');
  ok(await p.evaluate(() => !!$('bc_frame')), 'vẫn mở bản in như cũ');

  console.log('\n4. Mất kết nối → Thử lại');
  await p.evaluate(() => {
    const goc = Object.getOwnPropertyDescriptor(window.google.script, 'run').get; window.__hong = 1; window.__goi = 0;
    Object.defineProperty(window.google.script, 'run', { get() {
      const r = goc(); if (!window.__hong) return r;
      let loi = () => {}; const px = new Proxy({}, { get(_, t) {
        if (t === 'withSuccessHandler') return () => px; if (t === 'withFailureHandler') return f => (loi = f, px);
        return () => { window.__goi++; window.__hong = 0; setTimeout(() => loi(new Error('NetworkError: Connection failure due to HTTP 0')), 80); };
      } }); return px; } });
  });
  await p.evaluate(() => go('kpiql')); await p.waitForTimeout(700);
  const mm = await p.evaluate(() => ({ mo: $('ltPhu').classList.contains('mo'), b: $('ltPhu').querySelector('b').textContent, nut: !!$('ltThuLai') }));
  ok(mm.mo && mm.b === 'Mất kết nối' && mm.nut, 'hiện "Mất kết nối" với nút Thử lại', mm);
  ok(await svgTrong(p, '#ltPhu .lt-hinh') > 3, 'hoạt ảnh wifi bị gạch');
  ok(await p.evaluate(() => document.activeElement && document.activeElement.id === 'ltThuLai'), 'con trỏ bàn phím ở nút Thử lại');
  await p.click('#ltThuLai'); await p.waitForTimeout(1500);
  ok(!(await p.evaluate(() => $('ltPhu').classList.contains('mo'))), 'Thử lại: lớp phủ đóng');
  ok(await p.evaluate(() => /KPI/i.test(document.querySelector('#main').textContent) && document.querySelector('#main').textContent.length > 300), 'Thử lại: dữ liệu tải được');
  await p.evaluate(() => { window.__hong = 1; });
  await p.evaluate(() => call('layKPIKy', ['2026-09'], function () {})); await p.waitForTimeout(400);
  await p.click('#ltDongNut'); await p.waitForTimeout(200);
  ok(!(await p.evaluate(() => $('ltPhu').classList.contains('mo'))), 'nút Đóng đóng lớp phủ');
  await p.evaluate(() => { window.__hong = 0; });
  // lỗi thường (không phải mạng) vẫn báo bằng toast như cũ
  await p.evaluate(() => call('khongCoHamNay', [], function () {})); await p.waitForTimeout(700);
  ok(!(await p.evaluate(() => $('ltPhu').classList.contains('mo'))) && /Không có hàm/.test(await p.textContent('#toast')), 'lỗi khác mạng vẫn hiện thông báo cũ');
  ok(!p.loi.length, 'không lỗi trang', p.loi);
  await p.context().close();

  console.log('\n5. Máy bật "giảm chuyển động"');
  p = await vao(b, 'tpdg', { giam: true });
  await p.evaluate(() => { D.choDuyet = []; go('duyetsl'); }); await p.waitForTimeout(1200);
  const g = await p.evaluate(() => __ltDs.map(a => ({ dung: a.isPaused, khung: Math.round(a.currentFrame), tong: Math.round(a.totalFrames) })));
  ok(g.length && g.every(a => a.dung && a.khung >= a.tong - 2), 'đứng yên ở khung cuối', g);
  await p.context().close();

  console.log('\n6. Mạng chặn cdnjs: không vỡ trang');
  p = await vao(b, 'tpdg', { chan: true });
  await p.evaluate(() => { D.choDuyet = []; go('duyetsl'); }); await p.waitForTimeout(1500);
  ok(await svgTrong(p, '.lt-trong .lt-o') >= 2, 'hiện hình tĩnh thay thế', await svgTrong(p, '.lt-trong .lt-o'));
  await p.evaluate(() => ltMo('dang-tong-hop-bao-cao', 'Đang tổng hợp…', '', true)); await p.waitForTimeout(300);
  ok(await p.evaluate(() => !!document.querySelector('#ltPhu .lt-quay')), 'lớp phủ chờ dùng vòng quay CSS');
  await p.evaluate(() => ltDong());
  ok(!p.loi.length, 'không lỗi trang', p.loi);
  await p.context().close();

  await b.close();
  console.log(`\n${dem - loiDem}/${dem} đạt`); process.exit(loiDem ? 1 : 0);
})();
