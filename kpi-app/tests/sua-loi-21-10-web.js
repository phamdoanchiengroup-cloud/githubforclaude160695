const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/** Kiểm tra giao diện mục 25 (4 lỗi chủ dự án báo 21/10) trên bản xem thử:
 *    DATA=csdl.json OUT=$S/xt-vh.html GIO=2026-10-14T10:00:00+07:00 TZ=Asia/Ho_Chi_Minh node tests/tao-ban-xem-thu.js
 *    F=$S/xt-vh.html node tests/sua-loi-21-10-web.js */
const F = 'file://' + process.env.F;
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
const doiNguoi = (p, f) => p.evaluate(f => {
  const t = __MAY_CHU.doc_('TaiKhoan').find(new Function('x', 'return ' + f));
  try { localStorage.setItem('kpi_mai_hd_cn_' + t.TenDangNhap, '1'); localStorage.setItem('kpi_mai_hd_tp_' + t.TenDangNhap, '1'); } catch (e) {}
  TOKEN = __MAY_CHU.taoPhien_(t); vaoHeThong(); return t.TenDangNhap;
}, f).then(async v => { await p.waitForTimeout(1500); await p.evaluate(() => { try { maiGocDong(); } catch (e) {} }); return v; });

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1360, height: 900 }, timezoneId: 'Asia/Ho_Chi_Minh' });
  await ctx.route(/cdnjs\.cloudflare\.com|fonts\.googleapis|fonts\.gstatic/, r => r.abort());
  const p = await ctx.newPage(); const jsLoi = []; p.on('pageerror', e => jsLoi.push(e.message)); p.on('dialog', d => d.accept());
  await p.goto(F); await p.waitForSelector('#xtGoiY');
  await p.click('#xtGoiY button:has-text("chienpham")');
  await p.waitForSelector('#app', { state: 'visible', timeout: 30000 }); await p.waitForTimeout(1500);

  console.log('1. Trưởng phòng: tab "KPI phòng" chỉ có xưởng mình');
  const tp = await doiNguoi(p, "String(x.VaiTro).trim()==='TP'&&x.TrangThai==='Đang dùng'&&x.MaXuong==='DG'");
  await p.evaluate(() => { kpiKy = { kieu: 'thang', giaTri: '2026-09' }; go('kpi'); }); await p.waitForFunction(() => !/Đang tải/.test(($('kpi_bang') || {}).textContent || 'Đang tải'), null, { timeout: 60000 });
  let s = await p.evaluate(() => ({ td: $('main').querySelector('.ptitle').textContent, the: [...$('kpi_bang').querySelectorAll('.card h3')].map(h => h.firstChild.textContent) }));
  ok(s.the.length === 1 && /Đóng gói|DG/i.test(s.the[0]), tp + ': bảng KPI chỉ 1 xưởng', s.the);
  ok(/Bảng KPI – /.test(s.td), 'tiêu đề ghi tên xưởng', s.td);

  console.log('2. Công nhân: dải nhắc bỏ ngày nghỉ cả ngày');
  const cn = await doiNguoi(p, "String(x.VaiTro).trim()==='CN'&&x.TrangThai==='Đang dùng'&&x.MaXuong==='DG'&&x.MaNV");
  const ng = '2026-10-13';
  const nhac = () => p.evaluate(ng => {
    D.nhatky = D.nhatky.filter(r => !(r.MaNV === ME.maNV && r.Ngay === ng)); D.choDuyet = D.choDuyet.filter(r => !(r.MaNV === ME.maNV && r.Ngay === ng));
    if (!D.xacNhanDD.some(r => r.MaXuong === ME.xuong && ngayChuan_(r.Ngay) === ng)) D.xacNhanDD = D.xacNhanDD.concat([{ Ngay: ng, MaXuong: ME.xuong }]);
    capNhatDucBar(); return ($('ducbar').textContent || '');
  }, ng);
  s = await nhac();
  ok(/13\/10/.test(s), cn + ' chưa nhập 13/10 (đi làm): có nhắc', s.slice(0, 120));
  await p.evaluate(ng => { D.chamcong = D.chamcong.concat([{ MaDD: 'T', Ngay: ng, MaNV: ME.maNV, MaXuong: ME.xuong, KyHieu: 'P', LyDo: 'Nghỉ phép năm' }]); }, ng);
  s = await nhac();
  ok(!/13\/10/.test(s), 'chấm nghỉ phép 13/10: thôi nhắc', s.slice(0, 120));

  console.log('3. Trưởng phòng mở "Duyệt sản lượng": thấy ngay sản lượng công nhân vừa gửi');
  await doiNguoi(p, "String(x.VaiTro).trim()==='TP'&&x.TrangThai==='Đang dùng'&&x.MaXuong==='DG'");
  await p.evaluate(() => go('duyetsl')); await p.waitForTimeout(2500);
  const gui = await p.evaluate(cn => {        // công nhân gửi (máy khác) sau khi trưởng phòng đã mở trang
    const t = __MAY_CHU.doc_('TaiKhoan').find(x => x.TenDangNhap === cn), tk = __MAY_CHU.taoPhien_(t);
    const cd = D.congdoan.find(c => c.MaXuong === t.MaXuong);
    const r = __MAY_CHU.congNhanGuiSanLuong(tk, [{ Ngay: '2026-10-11', MaCD: cd.MaCD, GioLam: 8, SoLuongLamRa: 77, SoLoi: 0 }]);
    return { ok: r.ok, msg: r.msg, ma: t.MaNV, co: D.choDuyet.some(x => x.MaNV === t.MaNV && x.Ngay === '2026-10-11') };
  }, cn);
  ok(gui.ok && !gui.co, 'công nhân gửi 11/10; dữ liệu trên trang trưởng phòng chưa có', gui);
  await p.evaluate(() => { LM.luc = 0; go('homnay'); go('duyetsl'); }); await p.waitForTimeout(3000);
  s = await p.evaluate(ma => ({ co: D.choDuyet.some(x => x.MaNV === ma && x.Ngay === '2026-10-11'), html: /77/.test($('main').innerHTML) }), gui.ma);
  ok(s.co && s.html, 'mở lại tab: tự tải, dòng mới hiện trên màn duyệt', s);

  console.log('4. Công nhân: khung "nhập lại" biến mất khi ngày đó đã gửi lại');
  await doiNguoi(p, "x.TenDangNhap==='" + cn + "'");
  await p.evaluate(() => { D.canNhapLai = [{ Ngay: '2026-10-11', MaCD: 'X', LyDo: '' }]; LM.luc = 0; go('cnnhap'); });
  const khung = () => p.evaluate(() => { const a = [...$('main').querySelectorAll('.alert.a-bd')].find(x => /Yêu cầu nhập lại/.test(x.textContent)); return a ? a.textContent : ''; });
  s = await khung();
  ok(/11\/10/.test(s), 'dữ liệu cũ trên trang: khung đỏ "nhập lại" có ngày 11/10', s);
  await p.waitForTimeout(3000);
  s = { d: await p.evaluate(() => D.canNhapLai.filter(x => x.Ngay === '2026-10-11').length), khung: await khung() };
  ok(s.d === 0 && !/11\/10/.test(s.khung), 'tự tải lại: ngày 11/10 đã gửi lại -> bỏ khỏi khung đỏ', s);

  ok(!jsLoi.length, 'không lỗi JavaScript', jsLoi);
  await b.close();
  console.log('\n' + (loi ? '✗ ' + loi + '/' + dem + ' lỗi' : '✓ ' + dem + '/' + dem + ' đạt'));
  process.exit(loi ? 1 : 0);
})();
