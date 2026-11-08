/**
 * Kiểm thử tăng tốc đợt 4 (08/11): Sheets API tự bật + lịch giữ nóng nhật ký (đăng nhập CN / TP không phải đọc lại sheet nhật ký).
 *   DATA=<csdl.json số thật> TZ=Asia/Ho_Chi_Minh node kpi-app/tests/tang-toc-4.js
 */
const path = require('path'), fs = require('fs');
const G = require('./gia-lap-kpi.js');
const DATA = process.env.DATA; if (!DATA) { console.log('Cần DATA='); process.exit(1); }
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? '  → ' + JSON.stringify(c).slice(0, 300) : '')); } };
const du = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const iDoi = du.TaiKhoan[0].indexOf('DoiMatKhauLanDau'); du.TaiKhoan.slice(1).forEach(x => { x[iDoi] = 'Không'; });
const c = G.tao(path.join(__dirname, '..', 'Code.gs'), du, '2026-11-09T07:30:00+07:00');
const TK = c.doc_('TaiKhoan').filter(t => t.TrangThai === 'Đang dùng'), vt = v => TK.find(t => String(t.VaiTro).trim() === v);
const Town = c.__phienDai(vt('OWNER')), Ttp = c.__phienDai(vt('TP')), Tcn = c.__phienDai(vt('CN'));
const P = () => c.PropertiesService.getScriptProperties();
const lanh = () => { c.__goi('XOA_BO_NHO_TAM'); Object.keys(c.__cache || {}).filter(k => /^NKD3/.test(k)).forEach(k => delete c.__cache[k]); };
const nap = T => { const t = c.__thongKe; t.o = 0; t.doc = 0; t.api = 0; const s = c.napDuLieu(T); return { r: JSON.parse(s), o: t.o, doc: t.doc, api: t.api || 0 }; };

console.log('\n1. Tự cài lịch giữ nóng');
ok(P().getProperty('TT4_LICH') !== '1', 'chưa cài trước khi chủ sở hữu mở web');
nap(Ttp); ok(P().getProperty('TT4_LICH') !== '1', 'trưởng phòng đăng nhập: không cài lịch');
nap(Town); ok(P().getProperty('TT4_LICH') === '1', 'chủ sở hữu mở web: tự cài lịch (1 lần)');
c.__trigger = [{ id: 'tt4', ham: 'GIU_NONG_DANG_NHAP' }];

console.log('\n2. Giữ nóng nhật ký');
lanh();
let a = nap(Tcn); const nkO = c.__sheets.NhatKySanXuat.rows.length * c.__sheets.NhatKySanXuat.rows[0].length;
ok(a.o >= nkO, 'bộ nhớ trống: công nhân đăng nhập phải đọc cả sheet nhật ký (' + Math.round(a.o / 1000) + 'k ô)');
lanh(); c.GIU_NONG_DANG_NHAP({ triggerUid: 'tt4' });
a = nap(Tcn); ok(a.o < nkO * 0.3, 'sau lịch giữ nóng: công nhân đăng nhập không đọc sheet nhật ký (' + Math.round(a.o / 1000) + 'k ô)', a.o);
const b = nap(Ttp); ok(b.o < nkO * 0.3 && b.r.ok && b.r.nhatky, 'trưởng phòng cũng vậy, gói vẫn đủ nhật ký');
const t1 = c.__cache['NKD3_t']; c.GIU_NONG_DANG_NHAP({ triggerUid: 'tt4' }); ok(c.__cache['NKD3_t'] === t1, 'còn mới (< 8 phút): lịch không đọc lại');
const lanGoi = c.__thongKe; lanGoi.o = 0; c.GIU_NONG_DANG_NHAP({ triggerUid: 'gia' }); ok(lanGoi.o === 0, 'gọi không phải từ lịch thật: bị chặn');

console.log('\n3. Sheets API tự bật');
ok(P().getProperty('KPI_SHEETS_API') !== '1', 'chưa bật dịch vụ Sheets: không bật đọc gộp');
c.__batSheetsApi(); P().deleteProperty('TT4_KT_API'); c.GIU_NONG_DANG_NHAP({ triggerUid: 'tt4' });
ok(P().getProperty('KPI_SHEETS_API') === '1', 'có dịch vụ Sheets: lịch tự kiểm tra khớp rồi bật đọc gộp');
lanh(); c.GIU_NONG_DANG_NHAP({ triggerUid: 'tt4' }); c.__goi('XOA_BO_NHO_TAM');
const x = nap(Tcn); ok(x.api >= 1 && x.doc <= 6, 'công nhân đăng nhập: đọc gộp ' + x.api + ' lượt API, ' + x.doc + ' lượt đọc (trước: ~21)', x);
const y = nap(Tcn); ok(JSON.stringify(y.r.nhatky) === JSON.stringify(a.r.nhatky), 'gói đọc gộp giống hệt gói đọc lẻ');
c.__goi('TAT_SHEETS_API'); P().deleteProperty('TT4_KT_API'); c.GIU_NONG_DANG_NHAP({ triggerUid: 'tt4' });
ok(P().getProperty('KPI_SHEETS_API') === '0', 'chủ dự án tắt tay: lịch không tự bật lại');
console.log('\n4. Trạng thái ở Thống kê › Tốc độ web');
const td = c.__goi('layTocDo', Town, 7); ok(td.ok && td.tt4 && td.tt4.lich === true && td.tt4.sheetsApi === 'chuaKhop', 'layTocDo trả trạng thái lịch + Sheets API', td.tt4);
console.log((loi ? '✗ ' : '✓ ') + (dem - loi) + '/' + dem + ' đạt'); process.exit(loi ? 1 : 0);
