/**
 * Kiểm thử dọn dẹp hằng tháng (08/11): sao lưu tháng, nhật ký sản lượng giữ 2 tháng (cũ hơn sang trang lưu trữ),
 * nhật ký thao tác giữ 2 tháng; số KPI / Thống kê / biểu đồ dài ngày không đổi sau khi dọn.
 *   DATA=<csdl.json số thật> TZ=Asia/Ho_Chi_Minh node kpi-app/tests/luu-tru.js
 */
const path = require('path'), fs = require('fs');
const G = require('./gia-lap-kpi.js');
const DATA = process.env.DATA; if (!DATA) { console.log('Cần DATA='); process.exit(1); }
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? '  → ' + JSON.stringify(c).slice(0, 300) : '')); } };
const du = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const iDoi = du.TaiKhoan[0].indexOf('DoiMatKhauLanDau'); du.TaiKhoan.slice(1).forEach(x => { x[iDoi] = 'Không'; });
const c = G.tao(path.join(__dirname, '..', 'Code.gs'), du, '2026-11-09T09:00:00+07:00');
const TK = c.doc_('TaiKhoan').filter(t => t.TrangThai === 'Đang dùng'), vt = v => TK.find(t => String(t.VaiTro).trim() === v);
const Town = c.__phienDai(vt('OWNER')), P = () => c.PropertiesService.getScriptProperties();
const sx = v => (v && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date)) ? Object.keys(v).sort().reduce((o, k) => (o[k] = v[k], o), {}) : v;   // so nội dung, không so thứ tự khóa
const bo = o => JSON.stringify(o, (k, v) => ['__ms', 'luc', 'tuBoNho', 'homNay'].indexOf(k) >= 0 ? undefined : sx(v));
const lanh = () => { c.__goi('XOA_BO_NHO_TAM'); Object.keys(c.__cache || {}).forEach(k => delete c.__cache[k]); };
const ky = r => { const d = r[0]; const s = d instanceof Date ? d.toISOString() : String(d); return s.slice(0, 7); };
const thang = ten => { const sh = c.__sheets[ten]; if (!sh) return {}; const h = sh.rows[0], i = Math.max(h.indexOf('Ngay'), h.indexOf('ThoiDiem')), o = {}; sh.rows.slice(1).forEach(r => { const d = r[i]; const k = (d instanceof Date ? c.Utilities.formatDate(d, 'Asia/Ho_Chi_Minh', 'yyyy-MM') : String(d).slice(0, 7)); o[k] = (o[k] || 0) + 1; }); return o; };
const chup = () => { lanh(); const nv = c.doc_('NhanSu').find(x => String(x.TrangThai).trim() === 'Đang làm').MaNV; return {
  kpi9: bo(c.__goi('layKPIKy', Town, 'thang', '2026-09', '')), kpi10: bo(c.__goi('layKPIKy', Town, 'thang', '2026-10', '')),
  tk9: bo(c.__goi('layThongKe', Town, '2026-09', true)), dg: bo(c.__goi('layDongGoiNgay', Town, 200)), qt: bo(c.__goi('layQuyTrinh', Town, 90)),
  dp: bo((r => { delete r.sk; return r; })(c.__goi('layDieuPhoi', Town, true))), hs: bo(c.__goi('hoSoNhanVien', Town, nv)) }; };

console.log('\n1. Trước khi dọn (số thật)');
const nk0 = thang('NhatKySanXuat'), tt0 = thang('NhatKyThaoTac'); console.log('    nhật ký sản lượng', JSON.stringify(nk0), '\n    nhật ký thao tác', JSON.stringify(tt0));
const A = chup();
console.log('\n2. Tự cài lịch');
c.napDuLieu(c.__phienDai(vt('TP'))); ok(P().getProperty('LD_LICH') !== '1', 'trưởng phòng mở web: không cài');
c.napDuLieu(Town); ok(P().getProperty('LD_LICH') === '1', 'chủ sở hữu mở web: tự cài lịch dọn dẹp ngày 1 hằng tháng');
console.log('\n3. Chạy dọn dẹp');
c.__trigger = [{ id: 'ld', ham: 'DON_DEP_HANG_THANG' }]; c.DON_DEP_HANG_THANG({ triggerUid: 'ld' });
console.log('    ' + P().getProperty('LD_LAN_CUOI'));
ok(P().getProperty('LD_SAO_LUU') === '2026-11', 'đã sao lưu tháng 11 vào KPI_Backup_Thang');
const nk1 = thang('NhatKySanXuat'), lt1 = thang('NhatKySanXuat_LuuTru'), tt1 = thang('NhatKyThaoTac');
console.log('    còn lại', JSON.stringify(nk1), '\n    lưu trữ', JSON.stringify(lt1), '\n    thao tác', JSON.stringify(tt1));
ok(!nk1['2026-08'] && !nk1['2026-09'] && nk1['2026-10'] === nk0['2026-10'] && nk1['2026-11'] === nk0['2026-11'], 'sheet chính chỉ còn tháng 10 + 11 (tháng chưa chốt cũ hơn giữ lại)');
ok(lt1['2026-08'] === nk0['2026-08'] && lt1['2026-09'] === nk0['2026-09'], 'tháng 8, 9 sang NhatKySanXuat_LuuTru đủ dòng');
ok(Object.keys(tt1).every(k => k >= '2026-10') && tt1['2026-10'] === tt0['2026-10'] && tt1['2026-11'] >= tt0['2026-11'], 'nhật ký thao tác chỉ còn từ 01/10');
const B = chup();
console.log('\n4. Số không đổi sau khi dọn');
[['kpi9', 'Bảng KPI tháng 9 (tháng đã lưu trữ)'], ['kpi10', 'Bảng KPI tháng 10'], ['tk9', 'Thống kê tháng 9'], ['dg', 'sản lượng xưởng / đóng gói 200 ngày'], ['qt', 'Quy trình 90 ngày'], ['dp', 'Điều phối (nút cổ chai, dòng chảy)'], ['hs', 'hồ sơ nhân viên (lịch sử)']]
  .forEach(([k, t]) => { if (A[k] !== B[k]) { let i = 0; while (A[k][i] === B[k][i]) i++; console.log('    khác ở:', A[k].slice(i - 60, i + 60), '\n           ', B[k].slice(i - 60, i + 60)); } ok(A[k] === B[k], t + ' giống trước khi dọn'); });
lanh(); const st = c.__thongKe; st.o = 0; c.napDuLieu(c.__phienDai(vt('CN')));
ok(st.o < 345000 * 0.75, 'đăng nhập đọc ít ô hơn (' + Math.round(st.o / 1000) + 'k so với ~345k)', st.o);
console.log('\n5. Chạy lại cùng tháng');
c.DON_DEP_HANG_THANG({ triggerUid: 'ld' }); ok(JSON.stringify(thang('NhatKySanXuat_LuuTru')) === JSON.stringify(lt1), 'không chuyển trùng');
console.log((loi ? '✗ ' : '✓ ') + (dem - loi) + '/' + dem + ' đạt'); process.exit(loi ? 1 : 0);
