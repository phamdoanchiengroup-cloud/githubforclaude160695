const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/** Kiểm tra giao diện cơm trưa (va-index.py mục 16) trên bản xem thử 1 file, đặt giờ 12/10/2026 14:30:
 *    DATA=csdl.json OUT=$S/xem-thu-com.html GIO=2026-10-12T14:30:00+07:00 TZ=Asia/Ho_Chi_Minh node tests/tao-ban-xem-thu.js
 *    F=$S/xem-thu-com.html [OUT=<thư mục ảnh>] node tests/com-trua-web.js */
const F = 'file://' + process.env.F, OUT = process.env.OUT || '';
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
async function moTrang(b, o = {}) {
  const ctx = await b.newContext(Object.assign({ viewport: { width: o.w || 1360, height: o.h || 900 }, timezoneId: 'Asia/Ho_Chi_Minh' }, o.cham ? { isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : {}));
  await ctx.route(/cdnjs\.cloudflare\.com|fonts\.googleapis|fonts\.gstatic/, r => r.abort());
  const p = await ctx.newPage(); p.loi = []; p.on('pageerror', e => p.loi.push(e.message)); p.on('dialog', d => d.accept());
  await p.goto(F); await p.waitForSelector('#xtGoiY'); await p.click('#xtGoiY button:has-text("chienpham")');
  await p.waitForSelector('#app', { state: 'visible', timeout: 30000 }); await p.waitForTimeout(1500);
  await p.evaluate(() => { try { maiGocDong(); } catch (e) {} });
  p.ctx = ctx; return p;
}
// đổi người dùng ngay trong trang (máy chủ giả giữ dữ liệu trong bộ nhớ, tải lại trang là mất)
const doiNguoi = (p, f) => p.evaluate(f => {
  const t = __MAY_CHU.doc_('TaiKhoan').find(new Function('x', 'return ' + f));
  try { localStorage.setItem('kpi_mai_hd_cn_' + t.TenDangNhap, '1'); localStorage.setItem('kpi_mai', 'tat'); } catch (e) {}   // tắt hướng dẫn Mai lần đầu để chạm được nút
  TOKEN = __MAY_CHU.taoPhien_(t); vaoHeThong(); return t.TenDangNhap;
}, f).then(async v => { await p.waitForTimeout(1500); await p.evaluate(() => { try { maiGocDong(); } catch (e) {} }); return v; });
(async () => {
  const b = await chromium.launch();
  console.log('Chủ sở hữu · máy tính');
  let p = await moTrang(b);
  ok(await p.evaluate(() => $('combar').classList.contains('hide')), 'chưa có thực đơn: không hiện thanh cơm trưa');
  let s = await p.evaluate(() => [...document.querySelectorAll('#nav button')].map(x => x.dataset.k));
  ok(s.includes('com'), 'menu có "Cơm trưa"', s);
  await p.evaluate(() => go('com')); await p.waitForTimeout(800);
  ok(await p.evaluate(() => !!$('cmMon') && $('cmNgay').value === '2026-10-13'), 'form báo thực đơn, ngày mặc định = ngày mai 13/10');
  await p.fill('#cmMon', 'Cơm trắng\nGà rang sả ớt\nRau muống xào tỏi\nCanh bí đỏ'); await p.fill('#cmGc', 'Có suất chay');
  await p.click('button:has-text("Lưu thực đơn")'); await p.waitForTimeout(1500);
  s = await p.evaluate(() => [$('combar').className, $('combar').textContent]);
  ok(s[0] === '' && /Thứ Ba 13\/10/.test(s[1]) && /Gà rang/.test(s[1]) && /16:00 hôm nay/.test(s[1]) && /còn 1 giờ (2\d|30) phút/.test(s[1]), 'lưu xong: thanh thực đơn hiện món, hạn 16:00 hôm nay, còn khoảng 1 giờ 30 phút', s[1]);
  await p.click('#combar .cm-nut.an'); await p.waitForTimeout(1500);
  s = await p.evaluate(() => [$('combar').querySelector('.cm-nut.an').getAttribute('aria-pressed'), document.querySelector('.cm-so .an b').textContent, document.querySelector('.cm-the').textContent]);
  ok(s[0] === 'true' && s[1] === '1' && /đã đăng ký ăn/.test(s[2]), 'bấm Ăn trên thanh: nút sáng, tổng hợp 1 suất, thẻ ghi "đã đăng ký ăn"', s);
  s = await p.evaluate(() => [...document.querySelectorAll('.cm-bang tbody tr')].map(r => r.textContent));
  ok(s.length > 3 && /Toàn nhà máy/.test(s[s.length - 1]) && s.some(x => /Văn phòng \/ khác/.test(x)), 'bảng tổng hợp theo xưởng + dòng Toàn nhà máy', s.slice(-2));
  await p.evaluate(() => __MAY_CHU.dangKyCom(__MAY_CHU.taoPhien_(__MAY_CHU.doc_('TaiKhoan').find(x => String(x.VaiTro).trim() === 'CN' && x.MaNV && x.TrangThai === 'Đang dùng')), '2026-10-13', false));
  await p.evaluate(() => comTai()); await p.waitForTimeout(1200);
  s = await p.evaluate(() => { const h = [...document.querySelectorAll('h4')].find(x => /Danh sách không ăn/.test(x.textContent)); const t = h && h.nextElementSibling;
    return [h && h.textContent, t && [...t.querySelectorAll('th')].map(x => x.textContent).join('|'), t && t.querySelector('tbody tr') && [...t.querySelector('tbody tr').cells].map(x => x.textContent)]; });
  ok(/Danh sách không ăn \(1\)/.test(s[0]) && s[1] === '#|Họ tên|Mã NV|Xưởng' && s[2] && /^C/i.test(s[2][2]) && /Xưởng/.test(s[2][3]), 'ban điều hành: bảng người không ăn có họ tên, mã NV, xưởng', s);
  await p.evaluate(() => go('kpi')); await p.waitForTimeout(800);
  ok(await p.evaluate(() => $('combar').className === '' && /Gà rang/.test($('combar').textContent)), 'thanh thực đơn vẫn hiện khi sang trang khác (Bảng KPI)');
  if (OUT) { await p.evaluate(() => go('com')); await p.waitForTimeout(600); await p.screenshot({ path: OUT + '/com-may-tinh.png', fullPage: true }); }

  console.log('Trưởng phòng');
  const tp = await doiNguoi(p, "String(x.VaiTro).trim()==='TP' && x.MaXuong==='DG' && x.TrangThai==='Đang dùng'");
  await p.evaluate(() => go('com')); await p.waitForTimeout(1000);
  s = await p.evaluate(() => [!!$('cmMon'), document.querySelectorAll('.cm-bang tbody tr').length, [...document.querySelectorAll('.cm-bang tbody tr')].filter(r => r.querySelector('details')).map(r => r.cells[0].textContent)]);
  ok(!s[0] && s[1] > 3 && s[2].length === 1, 'trưởng phòng ' + tp + ': không có form thực đơn, thấy số mọi xưởng, danh sách tên chỉ xưởng mình', s);
  s = await p.evaluate(() => [!!$('cmHo'), document.querySelectorAll('#cmHoDs li').length, $('cmHoNgay').value]);
  ok(s[0] && s[1] > 0 && s[2] === '2026-10-13', 'trưởng phòng có mục "Đăng ký hộ" (ngày mai, danh sách người chưa đăng ký)', s);
  const ten1 = await p.evaluate(() => document.querySelector('#cmHoDs li b').textContent);
  await p.click('#cmHoDs li .cm-nut.an'); await p.waitForTimeout(1500);
  s = await p.evaluate(t => { COM.hoLoc = 'tat'; comHoVe(1); const li = [...document.querySelectorAll('#cmHoDs li')].find(x => x.querySelector('b').textContent === t); return li && li.textContent; }, ten1);
  ok(s && /Ăn/.test(s) && /hộ:/.test(s), 'bấm Ăn: người đó ghi "Ăn (hộ: tên trưởng phòng)"', s);
  await p.evaluate(() => { COM.hoLoc = 'chua'; comHoVe(1); });
  await p.click('#cmHoDs button:has-text("Đăng ký ăn cho tất cả")'); await p.waitForTimeout(1800);
  ok(await p.evaluate(() => /Mọi người đã đăng ký/.test($('cmHoDs').textContent)), 'nút "Đăng ký ăn cho tất cả người chưa đăng ký" chạy được');

  console.log('Bếp ăn (vai trò BEP)');
  await p.evaluate(() => { __MAY_CHU.them_('TaiKhoan', { TenDangNhap: 'bep', HoTen: 'Bếp ăn', VaiTro: 'BEP', MaXuong: '', TrangThai: 'Đang dùng', DoiMatKhauLanDau: 'Không' }); });
  await doiNguoi(p, "x.TenDangNhap==='bep'");
  s = await p.evaluate(() => [[...document.querySelectorAll('#nav button')].map(x => x.dataset.k), tabHienTai, $('hbadge').textContent, !!$('cmMon'), !!document.querySelector('.cm-bang')]);
  ok(s[0].join() === 'com' && s[1] === 'com' && s[2] === 'BẾP ĂN' && s[3] && s[4], 'bếp chỉ có trang Cơm trưa: nhập thực đơn + xem tổng hợp', s);
  s = await p.evaluate(() => [document.querySelectorAll('.cm-nut.an,.cm-nut.khong').length, $('combar').textContent, document.querySelector('.cm-the').textContent]);
  ok(s[0] === 0 && /suất ăn/.test(s[1]) && /suất ăn/.test(s[2]) && !/Bạn chưa đăng ký/.test(s[2]), 'bếp: không có nút Ăn / Không ăn, thanh + thẻ hiện số suất', s);

  console.log('Công nhân · điện thoại');
  await p.close(); await p.ctx.close();
  p = await moTrang(b, { w: 390, h: 844, cham: true });
  await p.evaluate(() => __MAY_CHU.luuThucDon(TOKEN, '2026-10-13', 'Cơm trắng\nCá kho tộ\nCanh chua', ''));
  const cn = await doiNguoi(p, "String(x.VaiTro).trim()==='CN' && x.MaXuong==='DG' && x.TrangThai==='Đang dùng'");
  s = await p.evaluate(() => [tabHienTai, $('combar').className, $('combar').textContent, document.documentElement.scrollWidth <= innerWidth + 1]);
  ok(s[0] === 'cnnhap' && s[1] === '' && /Cá kho tộ/.test(s[2]) && s[3], 'công nhân ' + cn + ': thanh thực đơn hiện ngay trang Nhập sản lượng, không tràn ngang', s);
  await p.tap('#combar .cm-nut.khong'); await p.waitForTimeout(1500);
  s = await p.evaluate(() => [$('combar').querySelector('.cm-nut.khong').getAttribute('aria-pressed'), COM.d.cuaToi['2026-10-13']]);
  ok(s[0] === 'true' && s[1] === 0, 'chạm "Không ăn": ghi nhận', s);
  await p.evaluate(() => go('com')); await p.waitForTimeout(1000);
  s = await p.evaluate(() => [!!$('cmMon'), !!document.querySelector('.cm-bang'), /1<\/b> bữa không ăn/.test($('main').innerHTML)]);
  ok(!s[0] && !s[1] && s[2], 'công nhân: không có form, không có tổng hợp; dòng "tháng này 1 bữa không ăn"', s);
  if (OUT) await p.screenshot({ path: OUT + '/com-dien-thoai.png', fullPage: true });
  ok(!p.loi.length, 'không lỗi JS', p.loi);
  await p.ctx.close(); await b.close();
  console.log((loi ? '✗ ' : '✓ ') + (dem - loi) + '/' + dem + ' đạt'); process.exit(loi ? 1 : 0);
})();
