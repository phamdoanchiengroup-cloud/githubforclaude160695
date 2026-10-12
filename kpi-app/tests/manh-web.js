const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/**
 * Kiểm tra phần giao diện tải sau (mục 19, 12/10): SoDo.html + HoatAnh.html không nằm trong Index.html, tải khi cần, nhớ theo phiên bản.
 *   F=<bản xem thử .html> node tests/manh-web.js
 */
const fs = require('fs'), path = require('path');
const F = 'file://' + process.env.F;
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
const idx = fs.readFileSync(path.join(__dirname, '..', 'Index.html'), 'utf8');
ok(!idx.includes('sdNguon3d" hidden') && !idx.includes('var SD_DATA') && idx.includes('var LT_DATA=null;') && !/"dang-tong-hop-bao-cao":\{"v"/.test(idx), 'Index.html không còn sơ đồ + dữ liệu hoạt ảnh');
ok(fs.statSync(path.join(__dirname, '..', 'Index.html')).size < 900 * 1024, 'Index.html dưới 900 KB', fs.statSync(path.join(__dirname, '..', 'Index.html')).size);
ok((idx.match(/data:image\/png;base64/g) || []).length === 1 && (idx.match(/data:image\/jpeg;base64/g) || []).length === 1, 'logo và ảnh nền khắc laser chỉ nhúng 1 lần');
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage(); const loiJS = [];
  p.on('pageerror', e => loiJS.push(e.message));
  await p.goto(F); await p.waitForSelector('#xtGoiY');
  await p.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  await p.click('#xtGoiY button:has-text("chienpham")'); await p.waitForSelector('#app', { state: 'visible', timeout: 30000 });
  await p.waitForTimeout(4000);
  let s = await p.evaluate(() => [typeof SD_DATA, !!LT_DATA && Object.keys(LT_DATA).length, Object.keys(localStorage).filter(k => k.indexOf('kpi_manh_') === 0)]);
  ok(s[0] === 'undefined' && s[1] >= 16 && s[2].length === 1 && /kpi_manh_HoatAnh_/.test(s[2][0]), 'sau khi vào: hoạt ảnh tải nền + nhớ; sơ đồ chưa tải', s);
  await p.evaluate(() => go('sodo')); await p.waitForTimeout(2500);
  s = await p.evaluate(() => [typeof SD_DATA, !!document.getElementById('sdMb'), !!document.getElementById('sdNguon3d'), Object.keys(localStorage).some(k => k.indexOf('kpi_manh_SoDo_' + MANH_VER.SoDo) === 0)]);
  ok(s[0] === 'object' && s[1] && s[2] && s[3], 'mở tab Sơ đồ: tải SoDo.html, vẽ sơ đồ, nhớ theo phiên bản', s);
  // máy chủ: công nhân không lấy được sơ đồ; chưa đăng nhập không lấy được gì
  s = await p.evaluate(() => { const cn = __MAY_CHU.doc_('TaiKhoan').find(x => x.VaiTro === 'CN' && x.TrangThai === 'Đang dùng');
    const a = __MAY_CHU.layManhGiaoDien(__MAY_CHU.taoPhien_(cn), 'SoDo'), b2 = __MAY_CHU.layManhGiaoDien(__MAY_CHU.taoPhien_(cn), 'HoatAnh'), c = __MAY_CHU.layManhGiaoDien('sai', 'HoatAnh'), d = __MAY_CHU.layManhGiaoDien(TOKEN, 'Code');
    return [a.ok, b2.ok, c.ok, !!c.hetHan, d.ok]; });
  ok(!s[0] && s[1] && !s[2] && s[3] && !s[4], 'máy chủ: công nhân không lấy được sơ đồ, lấy được hoạt ảnh; phiên sai bị từ chối; tên lạ bị từ chối', s);
  // tải lại trang: lấy từ bộ nhớ, không gọi máy chủ
  await p.reload(); await p.waitForSelector('#xtGoiY'); await p.click('#xtGoiY button:has-text("chienpham")'); await p.waitForSelector('#app', { state: 'visible', timeout: 30000 }); await p.waitForTimeout(1500);
  await p.evaluate(() => { window.__goiMay = 0; const g = __MAY_CHU.layManhGiaoDien; __MAY_CHU.layManhGiaoDien = function () { window.__goiMay++; return g.apply(this, arguments); }; go('sodo'); });
  await p.waitForTimeout(1500);
  s = await p.evaluate(() => [window.__goiMay, !!document.getElementById('sdMb')]);
  ok(s[1] && s[0] === 0, 'lần sau mở sơ đồ lấy từ bộ nhớ trình duyệt, không tải lại', s);
  ok(!loiJS.length, 'không lỗi JS', loiJS);
  console.log((loi ? '✗ ' : '✓ ') + (dem - loi) + '/' + dem + ' đạt'); await b.close(); process.exit(loi ? 1 : 0);
})();
