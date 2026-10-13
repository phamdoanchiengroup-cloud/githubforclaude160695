/**
 * Dải thông báo giải bóng đá (13/10): máy chủ layBongDa (đọc sheet web giải giả lập) + giao diện #bdbar trên bản xem thử.
 *   DATA=csdl.json [F=<bản xem thử>] node kpi-app/tests/bong-da.js
 */
const path = require('path'), fs = require('fs');
const G = require('./gia-lap-kpi.js');
const DATA = process.env.DATA, F = process.env.F;
if (!DATA) { console.log('Cần DATA=<file json dữ liệu>'); process.exit(1); }
let dem = 0, loi = 0;
const ok = (dk, ten, ct) => { dem++; if (dk) console.log('  ✓ ' + ten); else { loi++; console.log('  ✗ ' + ten + (ct !== undefined ? '  → ' + JSON.stringify(ct).slice(0, 400) : '')); } };
const du = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const iDoi = du.TaiKhoan[0].indexOf('DoiMatKhauLanDau'); du.TaiKhoan.slice(1).forEach(x => { x[iDoi] = 'Không'; });
const c = G.tao(path.join(__dirname, '..', 'Code.gs'), du, '2026-10-19T09:00:00+07:00');
// sheet web giải giả: CauHinh có mật khẩu (không được lộ ra), Doi, TranDau
const BANG = {
  CauHinh: [['Khoa', 'GiaTri'], ['MAT_KHAU_ADMIN', 'BI-MAT-1'], ['TEN_GIAI', 'Giải Bóng Đá Rhino Billiards 2026'], ['MAT_KHAU_LIVE', 'BI-MAT-2']],
  Doi: [['MaDoi', 'TenDoi'], ['D1', 'RHINO FC'], ['D2', 'EVO FC'], ['D3', 'FC RETRO'], ['D4', 'JUNIORS FC']],
  TranDau: [['MaTran', 'VongDau', 'MaDoiA', 'MaDoiB', 'BanThangA', 'BanThangB', 'GioThiDau'],
    ['T1', '🎉 Khai mạc', 'D3', 'D4', '', '', '15:00 20/10/2026'], ['T2', 'Vòng tròn', 'D1', 'D2', '', '', '15:00 23/10/2026'], ['T0', 'Vòng tròn', 'D2', 'D3', '2', '1', '15:00 18/10/2026']]
};
let moSheet = 0;
c.SpreadsheetApp.openById = id => { moSheet++; return { getSheetByName: n => BANG[n] ? { getDataRange: () => ({ getDisplayValues: () => BANG[n].map(r => r.slice()) }) } : null }; };
const tk = c.doc_('TaiKhoan').find(x => String(x.VaiTro).trim() === 'CN' && String(x.TrangThai).trim() === 'Đang dùng');
let r = c.__goi('layBongDa', c.taoPhien_(tk));
ok(r.ok && r.ten === 'Giải Bóng Đá Rhino Billiards 2026' && r.tran.length === 3, 'công nhân đọc được tên giải + 3 trận', r);
ok(r.tran[0].gio === '2026-10-18 15:00' && r.tran[0].xong && r.tran[0].tsA === 2 && r.tran[0].a === 'EVO FC', 'trận đã đá: giờ chuẩn hóa, tỉ số, tên đội', r.tran[0]);
ok(r.tran[1].a === 'FC RETRO' && !r.tran[1].xong && (r.tran[1].tsA === null || r.tran[1].tsA === ''), 'trận chưa đá: không có tỉ số', r.tran[1]);
ok(!/BI-MAT/.test(JSON.stringify(r)), 'không lộ mật khẩu trong sheet CauHinh của web giải');
c.__goi('layBongDa', c.taoPhien_(tk));
ok(moSheet === 1, 'lần tải thứ 2 dùng bản nhớ tạm, không mở lại sheet', moSheet);
ok(c.__goi('layBongDa', 'sai').ok === false, 'phiên sai: không trả dữ liệu');

(async () => {
  if (F) {
    console.log('Giao diện (bản xem thử)');
    const { chromium } = require('/opt/node22/lib/node_modules/playwright');
    const b = await chromium.launch(), ctx = await b.newContext({ viewport: { width: 1360, height: 900 }, timezoneId: 'Asia/Ho_Chi_Minh' });
    await ctx.route(/cdnjs|fonts\.g/, x => x.abort());
    const p = await ctx.newPage(); const loiJS = []; p.on('pageerror', e => loiJS.push(e.message));
    await p.goto('file://' + F); await p.waitForSelector('#xtGoiY'); await p.click('#xtGoiY button:has-text("chienpham")');
    await p.waitForSelector('#app', { state: 'visible', timeout: 30000 }); await p.waitForTimeout(1200);
    await p.evaluate(() => { BD.gio = () => new Date('2026-10-19T09:00:00+07:00'); });
    ok(await p.evaluate(() => !!$('bdbar') && $('bdbar').previousElementSibling.id === 'combar'), 'có #bdbar ngay dưới thanh cơm trưa');
    const ve = (d) => p.evaluate(d => { try { localStorage.removeItem('kpi_bd_tat'); } catch (e) {} BD.d = d; bdVe(); return [$('bdbar').className, $('bdbar').textContent]; }, d);
    const D = { ok: true, ten: 'Giải Bóng Đá Rhino Billiards 2026', link: '', tran: [
      { a: 'EVO FC', b: 'FC RETRO', vong: 'Vòng tròn', gio: '2026-10-18 15:00', xong: true, tsA: 2, tsB: 1 },
      { a: 'FC RETRO', b: 'JUNIORS FC', vong: '🎉 Khai mạc', gio: '2026-10-20 15:00', xong: false, tsA: null, tsB: null },
      { a: 'RHINO FC', b: 'EVO FC', vong: 'Vòng tròn', gio: '2026-10-23 15:00', xong: false, tsA: null, tsB: null }] };
    let s = await ve(D);
    ok(s[0] === '' && /Kết quả: EVO FC 2 – 1 FC RETRO/.test(s[1]) && /Ngày mai 15:00: FC RETRO gặp JUNIORS FC/.test(s[1]) && /khai mạc/.test(s[1]) && !/RHINO FC gặp/.test(s[1]),
      '19/10: hiện kết quả hôm qua + trận khai mạc ngày mai (chỉ ngày thi đấu gần nhất)', s[1]);
    ok(!/Xem lịch/.test(s[1]), 'chưa có link web giải: không hiện nút "Xem lịch & video"');
    s = await ve(Object.assign({}, D, { link: 'https://script.google.com/macros/s/x/exec' }));
    ok(await p.evaluate(() => { const a = $('bdbar').getBoundingClientRect(), n = $('navCol') || document.querySelector('nav'); return !n || n.getBoundingClientRect().right <= a.left + 1; }), 'máy tính: dải nằm bên phải cột menu, không bị che');
    ok(/Xem lịch & video/.test(s[1]) && await p.evaluate(() => $('bdbar').querySelector('a').target === '_blank'), 'có link: nút mở web giải ở tab mới');
    s = await ve(Object.assign({}, D, { tran: D.tran.slice(2) }));
    ok(s[0] === '' && /Thứ Sáu 23\/10, 15:00 \(còn 4 ngày\): RHINO FC gặp EVO FC/.test(s[1]), 'trận còn 4 ngày: hiện kèm "còn 4 ngày"', s[1]);
    s = await p.evaluate(() => { BD.gio = () => new Date('2026-10-13T09:00:00+07:00'); return 1; });
    s = await ve(Object.assign({}, D, { tran: D.tran.slice(1) }));
    ok(s[0] === '' && /còn 7 ngày/.test(s[1]), '13/10: trận khai mạc 20/10 đã hiện (tròn 1 tuần trước)', s[1]);
    s = await p.evaluate(() => { BD.gio = () => new Date('2026-10-12T09:00:00+07:00'); BD.d.tran = BD.d.tran.slice(); bdVe(); return $('bdbar').className; });
    ok(s === 'hide', '12/10: còn 8 ngày → chưa hiện', s);
    await p.evaluate(() => { BD.gio = () => new Date('2026-10-19T09:00:00+07:00'); });
    await ve(D); await p.click('#bdbar .bd-x'); await p.waitForTimeout(200);
    ok(await p.evaluate(() => $('bdbar').className === 'hide' && localStorage.getItem('kpi_bd_tat') === '2026-10-20 15:00'), 'bấm ×: ẩn tới trận sau (nhớ theo trận)');
    s = await p.evaluate(d => { BD.d = d; bdVe(); return $('bdbar').className; }, Object.assign({}, D, { tran: [{ a: 'X', b: 'Y', vong: '', gio: '2026-10-21 15:00', xong: false }] }));
    ok(s === '', 'trận khác (21/10): dải hiện lại', s);
    await p.evaluate(() => { BD.gio = () => new Date('2026-10-20T08:00:00+07:00'); });
    s = await ve(D);
    ok(/Hôm nay 15:00: FC RETRO gặp JUNIORS FC/.test(s[1]) && /cùng ra sân cổ vũ/.test(s[1]), 'ngày có trận: "Hôm nay 15:00 … cùng ra sân cổ vũ nhé!"', s[1]);
    await p.setViewportSize({ width: 390, height: 800 });
    ok(await p.evaluate(() => document.documentElement.scrollWidth <= 392), 'điện thoại: không tràn ngang');
    ok(!loiJS.length, 'không lỗi JS', loiJS);
    await b.close();
  }
  console.log((loi ? '✗ ' : '✓ ') + (dem - loi) + '/' + dem + ' đạt'); process.exit(loi ? 1 : 0);
})();
