const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/**
 * Âm thanh + giọng Rhino (mục 24, 18/10): mặc định tắt, nút đổi vòng Tắt → Tiếng → Tiếng + giọng, giọng tải sau (AmThanh.html),
 * đọc số tiếng Việt, gắn đúng các chỗ (gửi xong, lỗi, đọc lại trước khi gửi, lên hạng, vuốt).
 *   F=<bản xem thử .html> node tests/am-thanh-web.js
 */
const fs = require('fs'), path = require('path');
const F = 'file://' + process.env.F;
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
const idx = fs.readFileSync(path.join(__dirname, '..', 'Index.html'), 'utf8');
ok(idx.includes('id="btnAm"') && idx.includes('var AM_GIONG=null;') && !idx.includes('AM_GIONG={'), 'Index.html có nút Tiếng, không nhúng tiếng thu sẵn');
ok(/AM_GIONG=\{/.test(fs.readFileSync(path.join(__dirname, '..', 'AmThanh.html'), 'utf8')) && /AmThanh: null/.test(fs.readFileSync(path.join(__dirname, '..', 'Code.gs'), 'utf8')), 'AmThanh.html + máy chủ cho tải');
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] }); const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage(); const loiJS = [];
  p.on('pageerror', e => loiJS.push(e.message));
  await p.goto(F); await p.waitForSelector('#xtGoiY');
  await p.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  await p.click('#xtGoiY button:has-text("chienpham")'); await p.waitForSelector('#app', { state: 'visible', timeout: 30000 });
  await p.waitForTimeout(1500);
  // đếm tiếng đã phát
  await p.evaluate(() => { window.__nghe = []; Object.keys(AM_TIENG).forEach(k => { const f = AM_TIENG[k]; AM_TIENG[k] = function () { __nghe.push(k); return f.apply(this, arguments); }; });
    window.__noi = []; const n = amNoi; amNoi = function (ds) { __noi.push(ds.filter(x => typeof x === 'string').join(' ')); return n.apply(this, arguments); }; });
  let s = await p.evaluate(() => { document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); toast('thử', false); return [amCheDo(), document.getElementById('btnAm').textContent, !!AM.ac, __nghe.length]; });
  ok(s[0] === 'tat' && s[1] === '🔇' && !s[2] && s[3] === 0, 'mặc định tắt: không tạo âm thanh, lỗi không kêu', s);
  await p.click('#btnAm');
  s = await p.evaluate(() => { toast('lỗi', false); return [amCheDo(), document.getElementById('btnAm').textContent, !!AM.ac, __nghe.slice(), __noi.length, AM_GIONG]; });
  ok(s[0] === 'am' && s[1] === '🔉' && s[2] && s[3].join() === 'bam,sai' && s[4] === 0 && s[5] === null, 'bấm 1 lần: bật tiếng (chưa giọng, chưa tải giọng)', s);
  await p.click('#btnAm'); await p.waitForTimeout(2500);
  s = await p.evaluate(() => [amCheDo(), document.getElementById('btnAm').textContent, AM_GIONG && Object.keys(AM_GIONG).length, __noi.slice(), Object.keys(localStorage).some(k => k.indexOf('kpi_manh_AmThanh_' + MANH_VER.AmThanh) === 0)]);
  ok(s[0] === 'giong' && s[1] === '🔊' && s[2] > 40 && s[3].indexOf('bat') >= 0 && s[4], 'bấm 2 lần: bật giọng, tải AmThanh.html và nhớ theo phiên bản', s);
  s = await p.evaluate(() => { const W = { d0: 'không', d1: 'một', d2: 'hai', d3: 'ba', d4: 'bốn', d5: 'năm', d6: 'sáu', d7: 'bảy', d8: 'tám', d9: 'chín', muoi: 'mười', muoi2: 'mươi', mot2: 'mốt', lam: 'lăm', tram: 'trăm', linh: 'linh', nghin: 'nghìn' };
    const thieu = []; [0, 5, 15, 21, 105, 1005, 21045, 99999].forEach(n => amDocSo(n).forEach(m => { if (!AM_GIONG[m]) thieu.push(m); }));
    return [[0, 15, 21, 25, 105, 110, 1005, 1050, 21045].map(n => amDocSo(n).map(k => W[k]).join(' ')), thieu]; });
  ok(s[0].join('|') === 'không|mười lăm|hai mươi mốt|hai mươi lăm|một trăm linh năm|một trăm mười|một nghìn không trăm linh năm|một nghìn không trăm năm mươi|hai mươi mốt nghìn không trăm bốn mươi lăm' && !s[1].length, 'đọc số tiếng Việt đúng, đủ tiếng thu sẵn', s);
  // giải mã được mọi tiếng
  s = await p.evaluate(async () => { let n = 0; for (const k in AM_GIONG) { await amGiaiMa(k); n++; } return n; });
  ok(s > 40, 'giải mã được mọi tiếng thu sẵn', s);
  // hộp đọc lại trước khi gửi
  s = await p.evaluate(() => { __noi = []; let gui = 0; maiXacNhan([{ Ngay: '2026-10-18', MaCD: (D.congDoan && D.congDoan[0] || {}).MaCD, SoLuongLamRa: 120, SoLoi: 2 }, { Ngay: '2026-10-18', MaCD: '', SoLuongLamRa: 5, SoLoi: 0 }], function () { gui++; }, function () {});
    return new Promise(r => setTimeout(() => { const g = document.getElementById('maiGui'); g && g.click(); r([__noi.slice(), gui]); }, 400)); });
  ok(s[0][0] === 'ngay muoi d8 thang muoi ban_gui d2 cong_doan tong d1 tram d2 muoi2 lam cai d2 loi dung_chua' && s[1] === 1, 'đọc lại: ngày 18 tháng 10, 2 công đoạn, tổng 125 cái, 2 lỗi; bấm Gửi vẫn gửi', s);
  // gửi xong, lên hạng, vuốt
  s = await p.evaluate(() => { __nghe = []; __noi = []; AM.cuoi = {};
    try { ltXong('Đã gửi – chờ trưởng phòng duyệt', '', 'gui-cho-duyet', 300); } catch (e) {}
    try { ttPhao(); } catch (e) {} try { ttHen('Đã duyệt', function () {}, function () {}, '', 100); } catch (e) {}
    return new Promise(r => setTimeout(() => r([__nghe.slice(), __noi.slice()]), 1800)); });
  ok(['gui', 'hang', 'vuot'].every(k => s[0].indexOf(k) >= 0) && s[1].some(x => x.indexOf('da_gui') === 0), 'gửi xong / lên hạng / vuốt có tiếng, gửi xong Rhino nói', s);
  ok(await p.evaluate(() => /am\('cua'\)/.test(String(lkMoCua)) && /am\('vao'\)/.test(String(bbTrung))), 'màn đăng nhập: mở cửa cuốn + đăng nhập đúng có tiếng');
  await p.click('#btnAm');
  s = await p.evaluate(() => { __nghe = []; AM.cuoi = {}; toast('lỗi', false); am('gui'); return [amCheDo(), document.getElementById('btnAm').textContent, __nghe.length]; });
  ok(s[0] === 'tat' && s[1] === '🔇' && s[2] === 0, 'bấm lần 3: tắt hẳn', s);
  s = await p.evaluate(() => { const cn = __MAY_CHU.doc_('TaiKhoan').find(x => x.VaiTro === 'CN' && x.TrangThai === 'Đang dùng'); const r = __MAY_CHU.layManhGiaoDien(__MAY_CHU.taoPhien_(cn), 'AmThanh'); return [r.ok, r.ok && r.noiDung.length > 100000]; });
  ok(s[0] && s[1], 'công nhân tải được phần giọng nói', s);
  // điện thoại: nút không làm tràn ngang
  await p.setViewportSize({ width: 390, height: 844 }); await p.waitForTimeout(300);
  s = await p.evaluate(() => document.documentElement.scrollWidth);
  ok(s <= 390, 'điện thoại không tràn ngang', s);
  ok(!loiJS.length, 'không lỗi JS', loiJS);
  console.log((loi ? '✗ ' : '✓ ') + (dem - loi) + '/' + dem + ' đạt'); await b.close(); process.exit(loi ? 1 : 0);
})();
