/**
 * Kiểm thử 09/11: thống kê / KPI / sản lượng xưởng / lưu đồ KHÔNG tính ngày đang làm việc (hôm nay).
 * Thêm dòng nhật ký + chấm công + KCS + vi phạm của hôm nay (số rất lớn) -> mọi số phải giữ nguyên.
 *   DATA=<csdl.json> TZ=Asia/Ho_Chi_Minh node kpi-app/tests/bo-hom-nay.js
 */
const path = require('path'), fs = require('fs');
const G = require('./gia-lap-kpi.js');
const DATA = process.env.DATA; if (!DATA) { console.log('Cần DATA='); process.exit(1); }
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? '  → ' + JSON.stringify(c).slice(0, 300) : '')); } };
const du = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const iDoi = du.TaiKhoan[0].indexOf('DoiMatKhauLanDau'); du.TaiKhoan.slice(1).forEach(x => { x[iDoi] = 'Không'; });
const HN = '2026-11-09', HQ = '2026-11-07';   // 09/11 thứ Hai; 08/11 chủ nhật
const c = G.tao(path.join(__dirname, '..', 'Code.gs'), du, HN + 'T15:00:00+07:00');
const TK = c.doc_('TaiKhoan').filter(t => t.TrangThai === 'Đang dùng'), vt = v => TK.find(t => String(t.VaiTro).trim() === v);
const Town = c.__phienDai(vt('OWNER'));
const lanh = () => { c.__goi('XOA_BO_NHO_TAM'); Object.keys(c.__cache || {}).forEach(k => delete c.__cache[k]); };
const sx = v => (v && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date)) ? Object.keys(v).sort().reduce((o, k) => (o[k] = v[k], o), {}) : v;
const bo = o => JSON.stringify(o, (k, v) => ['__ms', 'luc', 'tuBoNho', 'homNay', 'ms'].indexOf(k) >= 0 ? undefined : sx(v));
const chup = () => { lanh(); return {
  kpi: bo(c.__goi('layKPIKy', Town, 'thang', '2026-11', '')), tk: bo(c.__goi('layThongKe', Town, '2026-11', true)),
  dg: bo(c.__goi('layDongGoiNgay', Town, 60)), qt: bo(c.__goi('layQuyTrinh', Town, 30)) }; };
console.log('\n1. Mốc ngày');
const dg = c.__goi('layDongGoiNgay', Town, 60); ok(dg.ok && dg.den === '2026-11-08', 'Sản lượng xưởng / đóng gói: tới hết hôm qua (den = 08/11)', dg.den);
const tk = c.__goi('layThongKe', Town, '2026-11', true); ok(tk.ok && tk.ngayLam.indexOf(HN) < 0 && tk.ngayLam.indexOf(HQ) >= 0, 'Thống kê: ngày làm không có hôm nay, có 07/11', tk.ngayLam && tk.ngayLam.slice(-3));
const A = chup();
console.log('\n2. Thêm số liệu của HÔM NAY (rất lớn) – số thống kê phải không đổi');
const nk = c.__sheets.NhatKySanXuat, h = nk.rows[0], mau = nk.rows.slice(1).reverse().find(r => String(r[h.indexOf('TrangThai')]).trim() === 'Đã chốt');
for (let i = 0; i < 30; i++) { const r = mau.slice(); r[h.indexOf('Ngay')] = new Date(HN + 'T08:00:00+07:00'); r[h.indexOf('SoLuongLamRa')] = 99999; if (h.indexOf('MaDong') >= 0) r[h.indexOf('MaDong')] = 'TEST-HN-' + i; nk.rows.push(r); }
c.xoaCache_('NhatKySanXuat');
const B = chup();
ok(A.kpi === B.kpi, 'KPI tháng 11 (xưởng + cá nhân) không đổi');
ok(A.tk === B.tk, 'tab Thống kê tháng 11 không đổi');
ok(A.dg === B.dg, 'Sản lượng từng xưởng / đóng gói theo ngày không đổi');
ok(A.qt === B.qt, 'Lưu đồ quy trình (số liệu 30 ngày) không đổi');
console.log('\n3. Hôm qua vẫn được tính');
for (let i = 0; i < 5; i++) { const r = mau.slice(); r[h.indexOf('Ngay')] = new Date(HQ + 'T08:00:00+07:00'); r[h.indexOf('SoLuongLamRa')] = 5000; if (h.indexOf('MaDong') >= 0) r[h.indexOf('MaDong')] = 'TEST-HQ-' + i; nk.rows.push(r); }
c.xoaCache_('NhatKySanXuat');
const C = chup();
ok(A.kpi !== C.kpi && A.tk !== C.tk, 'thêm sản lượng ngày 07/11 → KPI + Thống kê đổi theo');
console.log('\n' + (dem - loi) + '/' + dem + ' đạt' + (loi ? ' – ' + loi + ' LỖI' : ''));
process.exit(loi ? 1 : 0);
