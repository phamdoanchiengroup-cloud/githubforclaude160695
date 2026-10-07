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

  console.log('\n7. Đợt 2: chốt tháng, điểm danh, công nhân gửi, Excel, chưa có dữ liệu, hết phiên');
  const phu = p => p.evaluate(() => { const x = $('ltPhu'); return x ? { mo: x.classList.contains('mo'), b: x.querySelector('b').textContent, svg: x.querySelectorAll('.lt-hinh svg path').length } : {}; });
  const choPhu = async (p, re) => { for (let i = 0; i < 60; i++) { const x = await phu(p); if (x.mo && re.test(x.b) && x.svg > 0) return x; await p.waitForTimeout(150); } return phu(p); };
  p = await vao(b, 'chienpham'); p.on('dialog', d => d.accept());
  await p.evaluate(() => go('kpi')); await p.waitForTimeout(2500);
  await p.evaluate(() => chotThangUI());
  let x = await choPhu(p, /Đã chốt KPI/);
  ok(x.mo && x.svg > 5, 'chốt tháng: lớp phủ con dấu "Đã chốt KPI…"', x);
  await p.waitForTimeout(3200); ok(!(await phu(p)).mo, 'chốt tháng: tự đóng');
  await p.evaluate(() => { kpiXuong = kpiXuong || (D.phongban[0] || {}).MaXuong; kpiKy.giaTri = '2030-01'; taiKPIKy(); }); await p.waitForTimeout(2500);
  ok(await svgTrong(p, '#main .lt-trong .lt-o') > 3 && /Chưa có dữ liệu kỳ này/.test(await p.textContent('#main')), 'kỳ chưa có dữ liệu: kính lúp + lời gợi ý', await svgTrong(p, '#main .lt-trong .lt-o'));
  // hết phiên: không tự tải lại, chờ bấm
  await p.evaluate(() => { window.__chuaTai = 1; hetHan(); }); await p.waitForTimeout(2500);
  x = await phu(p);
  ok(x.mo && /hết hạn/.test(x.b) && await p.evaluate(() => window.__chuaTai === 1), 'hết phiên: lớp phủ, trang KHÔNG tự tải lại sau 2,5 giây', x);
  ok(await p.evaluate(() => document.activeElement.id === 'ltDNLai'), 'hết phiên: con trỏ ở nút Đăng nhập lại');
  await p.click('#ltDeSau'); ok(!(await phu(p)).mo, 'hết phiên: "Để sau" đóng lớp phủ');
  ok(!p.loi.length, 'không lỗi trang', p.loi);
  await p.context().close();
  p = await vao(b, 'tpdg');
  await p.evaluate(() => go('dd')); await p.waitForSelector('#dd_siso', { timeout: 20000 });
  await p.evaluate(() => luuDiemDanhUI());
  x = await choPhu(p, /điểm danh/);
  ok(x.mo && x.svg > 5 && /đi làm/.test(await p.evaluate(() => $('ltPhu').querySelector('small').textContent)), 'điểm danh: lớp phủ 5 người + sĩ số', x);
  await p.waitForTimeout(2800); ok(!(await phu(p)).mo, 'điểm danh: tự đóng');
  ok(!p.loi.length, 'không lỗi trang', p.loi);
  await p.context().close();
  p = await vao(b, 'c068');
  await p.evaluate(() => go('cnnhap')); await p.waitForTimeout(1500);
  const cdCN = await p.evaluate(() => { const c = (D.congdoan || []).find(c => c.MaXuong === ME.xuong && String(c.TrangThai || '').indexOf('Ngừng') < 0); if (!c) return null; cnRows = [{ MaCD: c.MaCD, SoLuongLamRa: 10, SoLoi: 0 }]; cnGui(); return c.MaCD; });
  x = await choPhu(p, /chờ trưởng phòng duyệt/);
  ok(cdCN && x.mo && x.svg > 3, 'công nhân gửi: phiếu vào khay + đồng hồ chờ', [cdCN, x, await p.textContent('#toast')]);
  ok(!p.loi.length, 'không lỗi trang', p.loi);
  await p.context().close();
  // Excel (bảng thống kê tháng của điểm danh); giả thư viện XLSX vì sandbox chặn cdnjs
  p = await vao(b, 'tpdg');
  await p.evaluate(() => { ddCheDo = 'thang'; go('dd'); }); await p.waitForFunction(() => !!window.__tk, null, { timeout: 30000 });
  await p.evaluate(() => { window.__tep = []; window.XLSX = { utils: { book_new: () => ({}), aoa_to_sheet: () => ({}), book_append_sheet: () => {} }, writeFile: (w, t) => window.__tep.push(t) }; });
  await p.click('button:has-text("Xuất Excel")');
  x = await choPhu(p, /Đã tải file Excel/);
  ok(x.mo && x.svg > 5 && await p.evaluate(() => /^ChamCong_\d{4}-\d\d\.xlsx$/.test(window.__tep[0] || '')), 'Excel: lớp phủ bảng tính, báo đã tải + tên file', [x, await p.evaluate(() => window.__tep)]);
  await p.evaluate(() => { ltDong(); window.XLSX.writeFile = () => { throw new Error('hỏng thử'); }; xuatExcelLich(); }); await p.waitForTimeout(300);
  ok(!(await phu(p)).mo && /Lỗi tạo file/.test(await p.textContent('#toast')), 'Excel lỗi: đóng lớp phủ, báo lỗi');
  ok(!p.loi.length, 'không lỗi trang', p.loi);
  await p.context().close();

  console.log('\n8. Đợt 3: trả lại, máy bảo trì, vi phạm, nghỉ dài hạn, thêm nhân sự, đổi mật khẩu');
  const daNoi = async (p, re, ten, min = 3) => { const x = await choPhu(p, re); ok(x.mo && re.test(x.b) && x.svg >= min, ten, [x, await p.textContent('#toast').catch(() => '')]); };
  p = await vao(b, 'tpdg'); p.on('dialog', d => d.accept());
  await p.evaluate(() => go('duyetsl')); await p.waitForTimeout(1200);
  const nutTC = p.locator('#main button.dg:has-text("Từ chối")').first();
  if (await nutTC.count()) { await nutTC.click(); await daNoi(p, /Đã trả lại/, 'trưởng phòng từ chối: phiếu bật ra, dấu ✕'); } else ok(false, 'không có nút Từ chối');
  await p.evaluate(() => ltDong());
  await p.evaluate(() => go('nenep')); await p.waitForSelector('#vp_nv', { timeout: 20000 });
  await p.evaluate(() => { const n = $('vp_nv'), l = $('vp_loai'); n.selectedIndex = n.options.length > 1 ? 1 : 0; l.selectedIndex = l.options.length > 1 ? 1 : 0; addVP(); });
  await daNoi(p, /Đã ghi vi phạm/, 'ghi vi phạm: sổ + bút, ghi rõ người và lỗi');
  ok(/Xóa/.test(await p.evaluate(() => $('ltPhu').querySelector('small').textContent)), 'ghi vi phạm: có hướng dẫn xóa nếu ghi nhầm');
  await p.evaluate(() => ltDong());
  await p.evaluate(() => { ddCheDo = 'thang'; go('dd'); }); await p.waitForSelector('#ndh_nv', { timeout: 30000 });
  await p.evaluate(() => { $('ndh_tu').value = '2026-10-20'; $('ndh_den').value = '2026-12-31'; dangKyNDH(); });
  await daNoi(p, /Đã đăng ký nghỉ dài hạn/, 'nghỉ dài hạn: dải ngày tô lên lịch');
  ok(!p.loi.length, 'không lỗi trang', p.loi);
  await p.context().close();
  p = await vao(b, 'chienpham'); p.on('dialog', d => d.type() === 'prompt' ? d.accept('thử') : d.accept());
  await p.evaluate(() => go('mm')); await p.waitForTimeout(1500);
  const nutMay = p.locator('#main button:has-text("Bảo trì"), #main button:has-text("bảo trì")').first();
  if (await nutMay.count()) { await nutMay.click(); await daNoi(p, /chuyển sang "Bảo trì"/, 'máy sang bảo trì: bánh răng + cờ lê'); } else ok(false, 'không thấy nút Bảo trì', await p.evaluate(() => $('main').textContent.slice(0, 200)));
  await p.evaluate(() => ltDong());
  await p.evaluate(() => go('ns')); await p.waitForTimeout(1500);
  const coForm = await p.evaluate(() => { if (!$('n_ma')) return false; $('n_ma').value = 'NVTHU99'; $('n_ten').value = 'Người Thử'; addNS(); return true; });
  if (coForm) await daNoi(p, /Đã thêm Người Thử/, 'thêm nhân sự: thẻ nhân viên + dấu ✓'); else ok(false, 'không có form thêm nhân sự');
  await p.evaluate(() => ltDong());
  await p.evaluate(() => go('nk')); await p.waitForTimeout(1500);
  const bdh = await p.evaluate(() => { const b = [...document.querySelectorAll('#main button')].find(x => /bdhTuChoi/.test(x.getAttribute('onclick') || '')); if (b) b.click(); return !!b; });
  if (bdh) await daNoi(p, /Đã trả lại/, 'ban điều hành từ chối dòng đã chốt: cùng hoạt ảnh trả lại'); else console.log('  · (không có dòng đã chốt để ban điều hành từ chối – bỏ qua)');
  await p.evaluate(() => ltDong());
  await p.evaluate(() => moDoiMK()); await p.waitForSelector('#d_cu');
  await p.evaluate(() => { $('d_cu').value = 'demo'; $('d_moi').value = 'demo-moi-123'; $('d_lai').value = 'demo-moi-123'; doiMK(); });
  await daNoi(p, /Đã đổi mật khẩu/, 'đổi mật khẩu: ổ khóa sập lại');
  ok(!p.loi.length, 'không lỗi trang', p.loi);
  await p.context().close();

  await b.close();
  console.log(`\n${dem - loiDem}/${dem} đạt`); process.exit(loiDem ? 1 : 0);
})();
