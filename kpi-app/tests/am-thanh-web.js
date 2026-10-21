const { chromium } = require('/opt/node22/lib/node_modules/playwright');
/**
 * Âm thanh + giọng Rhino (mục 24, 18/10): mặc định bật tiếng + giọng, nút cuối menu đổi vòng Tắt → Chỉ tiếng → Tiếng + giọng, giọng tải sau (AmThanh.html),
 * đọc số tiếng Việt, gắn đúng các chỗ (gửi xong, lỗi, đọc lại trước khi gửi, lên hạng, vuốt).
 *   F=<bản xem thử .html> node tests/am-thanh-web.js
 */
const fs = require('fs'), path = require('path');
const F = 'file://' + process.env.F;
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? ' → ' + JSON.stringify(c).slice(0, 300) : '')); } };
const idx = fs.readFileSync(path.join(__dirname, '..', 'Index.html'), 'utf8');
ok(!idx.includes('id="btnAm"') && idx.includes("b.id='btnAm'") && idx.includes('var AM_GIONG=null;') && !idx.includes('AM_GIONG={'), 'Index.html: nút Âm thanh do menu tạo (không ở đầu trang), không nhúng tiếng thu sẵn');
ok(/AM_GIONG=\{/.test(fs.readFileSync(path.join(__dirname, '..', 'AmThanh.html'), 'utf8')) && /AmThanh: null/.test(fs.readFileSync(path.join(__dirname, '..', 'Code.gs'), 'utf8')), 'AmThanh.html + máy chủ cho tải');
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] }); const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage(); const loiJS = [];
  p.on('pageerror', e => loiJS.push(e.message));
  await p.goto(F); await p.waitForSelector('#xtGoiY');
  await p.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  await p.click('#xtGoiY button:has-text("chienpham")'); await p.waitForSelector('#app', { state: 'visible', timeout: 30000 });
  await p.waitForTimeout(5500);   // mặc định bật giọng: phần giọng tải nền ~4 giây sau khi vào
  // đếm tiếng đã phát
  await p.evaluate(() => { window.__nghe = []; Object.keys(AM_TIENG).forEach(k => { const f = AM_TIENG[k]; AM_TIENG[k] = function () { __nghe.push(k); return f.apply(this, arguments); }; });
    window.__noi = []; const n = amNoi; amNoi = function (ds) { __noi.push(ds.filter(x => typeof x === 'string').join(' ')); return n.apply(this, arguments); }; });
  let s = await p.evaluate(() => { document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); toast('thử', false);
    const b = document.getElementById('btnAm'); return [amCheDo(), !!b.closest('#nav'), !!document.querySelector('header #btnAm'), b.textContent, !!AM.ac, __nghe.slice(), AM_GIONG && Object.keys(AM_GIONG).length,
      Object.keys(localStorage).some(k => k.indexOf('kpi_manh_AmThanh_' + MANH_VER.AmThanh) === 0)]; });
  ok(s[0] === 'giong' && s[1] && !s[2] && /Âm thanh.*Tiếng \+ giọng Rhino/.test(s[3]) && s[4] && s[5].join() === 'sai' && s[6] > 40 && s[7], 'mặc định BẬT tiếng + giọng, nút ở cuối menu (không ở đầu trang), giọng tải nền + nhớ theo phiên bản', s);
  await p.click('#btnAm');
  s = await p.evaluate(() => { __nghe = []; AM.cuoi = {}; toast('lỗi', false); am('gui'); return [amCheDo(), document.getElementById('btnAm').textContent, __nghe.length]; });
  ok(s[0] === 'tat' && /Đang tắt/.test(s[1]) && s[2] === 0, 'bấm 1 lần: tắt hẳn', s);
  await p.click('#btnAm');
  s = await p.evaluate(() => { __nghe = []; AM.cuoi = {}; toast('lỗi', false); return [amCheDo(), document.getElementById('btnAm').textContent, __nghe.slice()]; });
  ok(s[0] === 'am' && /Chỉ tiếng hiệu ứng/.test(s[1]) && s[2].indexOf('sai') >= 0, 'bấm lần 2: chỉ tiếng hiệu ứng', s);
  await p.click('#btnAm'); await p.waitForTimeout(500);
  s = await p.evaluate(() => [amCheDo(), __noi.slice()]);
  ok(s[0] === 'giong' && s[1].indexOf('bat') >= 0, 'bấm lần 3: bật lại giọng, Rhino báo đã bật', s);
  await p.evaluate(() => veNav());
  ok(await p.evaluate(() => document.querySelectorAll('#btnAm').length === 1 && !!document.querySelector('#nav #btnAm')), 'vẽ lại menu vẫn còn đúng 1 nút Âm thanh');
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
  s = await p.evaluate(() => { const cn = __MAY_CHU.doc_('TaiKhoan').find(x => x.VaiTro === 'CN' && x.TrangThai === 'Đang dùng'); const r = __MAY_CHU.layManhGiaoDien(__MAY_CHU.taoPhien_(cn), 'AmThanh'); return [r.ok, r.ok && r.noiDung.length > 100000]; });
  ok(s[0] && s[1], 'công nhân tải được phần giọng nói', s);
  // điện thoại: nút không làm tràn ngang
  await p.setViewportSize({ width: 390, height: 844 }); await p.waitForTimeout(300);
  s = await p.evaluate(() => { const t = document.querySelector('header .htitle'); return [document.documentElement.scrollWidth, t.scrollWidth <= t.clientWidth + 1, getComputedStyle(t).textOverflow]; });
  ok(s[0] <= 390 && s[1] && s[2] !== 'ellipsis', 'điện thoại: không tràn ngang, tên hệ thống không bị cắt', s);
  ok(!loiJS.length, 'không lỗi JS', loiJS);
  console.log((loi ? '✗ ' : '✓ ') + (dem - loi) + '/' + dem + ' đạt'); await b.close(); process.exit(loi ? 1 : 0);
})();
