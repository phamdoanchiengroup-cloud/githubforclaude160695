const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/** Kiểm tra giao diện mục 22 (bảo mật) + 23 (vận hành / dễ dùng / động viên / hội nhập) trên bản xem thử:
 *    DATA=csdl.json OUT=$S/xt-vh.html GIO=2026-10-14T10:00:00+07:00 TZ=Asia/Ho_Chi_Minh node tests/tao-ban-xem-thu.js
 *    F=$S/xt-vh.html [OUT=<thư mục ảnh>] node tests/van-hanh-web.js */
const F = 'file://' + process.env.F, OUT = process.env.OUT || '';
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
async function moTrang(b, o = {}) {
  const ctx = o.ctx || await b.newContext(Object.assign({ viewport: { width: o.w || 1360, height: o.h || 900 }, timezoneId: 'Asia/Ho_Chi_Minh' }, o.cham ? { isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : {}));
  await ctx.route(/cdnjs\.cloudflare\.com|fonts\.googleapis|fonts\.gstatic/, r => r.abort());
  const p = await ctx.newPage(); p.loi = []; p.on('pageerror', e => p.loi.push(e.message)); p.on('dialog', d => d.accept());
  await p.goto(F); await p.waitForSelector('#xtGoiY');
  p.cua = await p.evaluate(() => !!document.getElementById('lkCua'));
  await p.click('#xtGoiY button:has-text("chienpham")');
  await p.waitForSelector('#app', { state: 'visible', timeout: 30000 }); await p.waitForTimeout(1500);
  await p.evaluate(() => { try { maiGocDong(); } catch (e) {} });
  p.ctx = ctx; return p;
}
const doiNguoi = (p, f, giuMai) => p.evaluate(([f, giuMai]) => {
  const t = __MAY_CHU.doc_('TaiKhoan').find(new Function('x', 'return ' + f));
  if (!giuMai) try { localStorage.setItem('kpi_mai_hd_cn_' + t.TenDangNhap, '1'); localStorage.setItem('kpi_mai_hd_tp_' + t.TenDangNhap, '1'); } catch (e) {}
  TOKEN = __MAY_CHU.taoPhien_(t); vaoHeThong(); return t.TenDangNhap;
}, [f, !!giuMai]).then(async v => { await p.waitForTimeout(1500); await p.evaluate(() => { try { maiGocDong(); } catch (e) {} }); return v; });

(async () => {
  const b = await chromium.launch();
  console.log('Chủ sở hữu');
  let p = await moTrang(b);
  ok(p.cua, 'lần mở đầu tiên trong ngày: có cửa cuốn');
  ok(await p.evaluate(() => esc("a'b`c") === 'a&#39;b&#96;c'), 'esc() đổi cả dấu \' và `');
  await p.evaluate(() => go('homnay')); await p.waitForTimeout(2500);
  let s = await p.evaluate(() => { const v = $('vhSoat'); return v && v.textContent; });
  ok(/Soát khâu duyệt/.test(s || '') && /Chờ quá 1 ngày/.test(s), 'Việc hôm nay: thẻ "Soát khâu duyệt"', (s || '').slice(0, 120));
  await p.evaluate(() => go('pq')); await p.waitForTimeout(1200);
  ok(await p.evaluate(() => !/123456/.test($('main').textContent)), 'tab Tài khoản không còn nhắc mật khẩu 123456');
  const tkCap = await p.evaluate(() => __MAY_CHU.doc_('TaiKhoan').find(x => String(x.VaiTro).trim() === 'CN' && x.TrangThai === 'Đang dùng').TenDangNhap);
  await p.evaluate(tk => capLai(tk), tkCap); await p.waitForTimeout(1500);
  s = await p.evaluate(() => { const h = $('mktHop'); return h && [h.getAttribute('role'), h.getAttribute('aria-modal'), $('mktMk').textContent, h.textContent]; });
  ok(s && s[0] === 'dialog' && s[1] === 'true' && /^[a-z2-9]{8}$/.test(s[2]) && /48 giờ/.test(s[3]), 'cấp lại mật khẩu: hộp mật khẩu tạm 8 ký tự, ghi rõ 48 giờ, nút Chép / In phiếu', s);
  if (OUT) await p.screenshot({ path: OUT + '/mk-tam.png' });
  await p.keyboard.press('Escape'); ok(await p.evaluate(() => !$('mktHop')), 'Esc đóng hộp');
  ok(!p.loi.length, 'không lỗi JavaScript (chủ sở hữu)', p.loi);

  console.log('\nTrưởng phòng');
  const tpTk = await doiNguoi(p, "String(x.VaiTro).trim()==='TP'&&x.MaXuong&&x.TrangThai==='Đang dùng'");
  // một công nhân trong xưởng gửi sản lượng để có dòng chờ duyệt
  await p.evaluate(tp => { const t = __MAY_CHU.doc_('TaiKhoan').find(x => x.TenDangNhap === tp);
    const cn = __MAY_CHU.doc_('TaiKhoan').find(x => String(x.VaiTro).trim() === 'CN' && x.MaXuong === t.MaXuong && x.MaNV && x.TrangThai === 'Đang dùng');
    const cdm = __MAY_CHU.doc_('CongDoan').find(c => c.MaXuong === t.MaXuong && c.TrangThai !== 'Ngừng');
    window.__cnThu = cn.TenDangNhap;
    return __MAY_CHU.congNhanGuiSanLuong(__MAY_CHU.taoPhien_(cn), [{ Ngay: '2026-10-13', MaCD: cdm.MaCD, GioLam: 8, SoLuongLamRa: 40, SoLoi: 0 }]); }, tpTk);
  await p.evaluate(() => reload(function () { go('duyetsl'); })); await p.waitForTimeout(2500);
  ok(await p.evaluate(() => !document.querySelector('#main input[id^="tc_"]') && document.querySelectorAll('#main input[id^="slr_"]').length > 0), 'duyệt sản lượng: không có ô tăng ca (chủ dự án bỏ 18/10)');
  await p.evaluate(() => go('homnay')); await p.waitForTimeout(2500);
  s = await p.evaluate(() => $('vhNhac') ? $('vhNhac').textContent : null);
  ok(s !== null, 'Việc hôm nay của TP: khung "Cần nhắc nhập sản lượng" (rỗng nếu không ai thiếu)', s && s.slice(0, 100));
  await p.evaluate(() => go('cd')); await p.waitForTimeout(1200);
  s = await p.evaluate(() => { const k = $('vhKN'); return k && [k.querySelectorAll('select').length, k.textContent.slice(0, 80)]; });
  ok(s && s[0] > 0 && /Bảng kỹ năng/.test(s[1]), 'tab Công đoạn: Bảng kỹ năng 3 mức', s);
  await p.evaluate(() => { vhKyNang._mo = true; vhKyNang(); });
  const chon = await p.evaluate(() => { const sl = $('vhKN').querySelector('tbody select'); sl.value = 'hoc'; sl.dispatchEvent(new Event('change')); return sl.getAttribute('aria-label'); });
  await p.waitForTimeout(1500);
  s = await p.evaluate(l => { const sl = [...$('vhKN').querySelectorAll('tbody select')].find(x => x.getAttribute('aria-label') === l); return [sl && sl.value, sl && sl.parentNode.className]; }, chon);
  ok(s[0] === 'hoc' && s[1] === 'hoc', 'chọn "Đang học": lưu lên máy chủ, ô tô màu', s);
  await p.evaluate(() => go('ns')); await p.waitForTimeout(1500);
  ok(await p.evaluate(() => !!$('vhHN')), 'tab Nhân sự: khung "Đón người mới" (hiện khi có người vào làm trong 45 ngày)');
  ok(!p.loi.length, 'không lỗi JavaScript (trưởng phòng)', p.loi);
  // hướng dẫn Rhino cho TP lần đầu
  await doiNguoi(p, "x.TenDangNhap==='" + tpTk + "'", true);
  await p.evaluate(() => { try { localStorage.removeItem('kpi_mai'); localStorage.removeItem('kpi_mai_hd_tp_' + ME.tk); } catch (e) {} go('duyetsl'); }); await p.waitForTimeout(2200);
  ok(await p.evaluate(() => { const t = $('maiTour'); return !!t && t.classList.contains('mo') && /duyệt sản lượng/.test(t.textContent); }), 'lần đầu vào Duyệt sản lượng: Rhino hướng dẫn trưởng phòng');
  await p.evaluate(() => { try { maiTourDong && maiTourDong(); } catch (e) {} const t = $('maiTour'); if (t) t.classList.remove('mo'); localStorage.setItem('kpi_mai', 'tat'); });

  console.log('\nCông nhân (điện thoại)');
  await p.setViewportSize({ width: 390, height: 844 });
  await p.evaluate(() => { const t = __MAY_CHU.doc_('TaiKhoan').find(x => x.TenDangNhap === window.__cnThu); localStorage.setItem('kpi_mai_hd_cn_' + t.TenDangNhap, '1'); TOKEN = __MAY_CHU.taoPhien_(t); vaoHeThong(); });
  await p.waitForTimeout(1800); await p.evaluate(() => go('cnnhap')); await p.waitForTimeout(2000);
  s = await p.evaluate(() => { const i = $('cn_sl_0'), r = i.getBoundingClientRect(), cs = getComputedStyle(i);
    return [i.getAttribute('inputmode'), i.value, i.placeholder, parseFloat(cs.fontSize), Math.round(r.height), $('cf_ngay').max === today(),
      Math.round(document.querySelector('#cf_grid .cn-nut').getBoundingClientRect().height)]; });
  ok(s[0] === 'numeric' && s[1] === '' && s[2] === '0', 'ô số lượng: bàn phím số, không có sẵn số 0', s);
  ok(s[3] >= 16 && s[4] >= 44 && s[6] >= 44, 'ô số và nút +/− đủ to cho ngón tay (≥16px chữ, ≥44px cao)', s);
  ok(s[5], 'ô ngày không cho chọn ngày mai');
  await p.click('#cf_bgui'); await p.waitForTimeout(500);
  s = await p.evaluate(() => [document.activeElement && document.activeElement.id, $('cn_sl_0').getAttribute('aria-invalid'), $('cnLoiMsg') && $('cnLoiMsg').textContent]);
  ok(s[0] === 'cn_sl_0' && s[1] === 'true' && /chưa nhập số lượng/.test(s[2] || ''), 'gửi khi chưa nhập: viền đỏ ô số lượng, con trỏ vào ô, lời báo ngay dưới ô', s);
  await p.fill('#cn_sl_0', '25'); await p.waitForTimeout(200);
  ok(await p.evaluate(() => !$('cnLoiMsg') && !$('cn_sl_0').getAttribute('aria-invalid')), 'gõ lại thì lời báo tự mất');
  s = await p.evaluate(() => JSON.parse(localStorage.getItem('kpi_cn_nhap_' + ME.tk) || 'null'));
  ok(s && s.rows && Number(s.rows[0].SoLuongLamRa) === 25, 'số đang nhập được lưu trong máy', s);
  await p.evaluate(() => { cnRows = []; window.__cnRows = []; vCNNhap(); }); await p.waitForTimeout(800);
  ok(await p.evaluate(() => $('cn_sl_0').value === '25'), 'mở lại trang nhập (mất nháp trong bộ nhớ): số 25 được lấy lại từ máy');
  await p.click('#cf_bgui'); await p.waitForTimeout(600);
  s = await p.evaluate(() => { const h = $('maiHop'); return h && [h.classList.contains('mo'), h.querySelector('.mai-thoai').getAttribute('aria-modal')]; });
  ok(s && s[0] && s[1] === 'true', 'hộp đọc lại trước khi gửi mở, đúng chuẩn hộp thoại', s);
  await p.mouse.click(10, 10); await p.waitForTimeout(300);
  ok(await p.evaluate(() => $('maiHop').classList.contains('mo')), 'chạm nhầm ra ngoài: hộp KHÔNG đóng');
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  ok(await p.evaluate(() => !$('maiHop').classList.contains('mo') && !cnGui._dangGui), 'Esc = Sửa lại (đóng hộp, mở lại nút Gửi)');
  // xóa dòng có Hoàn tác
  await p.evaluate(() => cnThemDong(0)); await p.waitForTimeout(200);
  await p.evaluate(() => cnXoaDong(1)); await p.waitForTimeout(400);
  s = await p.evaluate(() => [cnRows.length, $('ttBao') && $('ttBao').textContent]);
  ok(s[0] === 1 && /Hoàn tác/.test(s[1] || ''), 'xóa dòng: có nút Hoàn tác', s);
  ok(await p.evaluate(() => $('vhHan') !== null), 'trang nhập có chỗ nhắc ngày còn thiếu (hiện khi có ngày chưa nhập, chưa quá hạn)');
  await p.evaluate(() => go('kpica')); await p.waitForTimeout(1500);
  s = await p.evaluate(() => $('vhKpiToi') && $('vhKpiToi').textContent);
  ok(/chưa được duyệt/.test(s || ''), 'KPI của tôi: "Còn N ngày chưa được duyệt – chưa tính vào KPI"', (s || '').slice(0, 120));
  if (OUT) await p.screenshot({ path: OUT + '/kpi-cua-toi.png', fullPage: true });
  ok(!p.loi.length, 'không lỗi JavaScript (công nhân)', p.loi);

  console.log('\nMở web lần hai trong ngày');
  const p2 = await moTrang(b, { ctx: p.ctx });
  ok(!p2.cua, 'cửa cuốn không hiện lại trong cùng ngày');
  await b.close();
  console.log('\n' + (loi ? '✗ ' + loi + '/' + dem + ' lỗi' : '✓ ' + dem + '/' + dem + ' đạt'));
  process.exit(loi ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
