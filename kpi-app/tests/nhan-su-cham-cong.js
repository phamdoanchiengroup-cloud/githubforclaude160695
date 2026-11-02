/**
 * Kiểm thử 03/11: SUA_NHAN_SU_THEO_CHAM_CONG (đổi mã / tên / ngày vào / thêm người theo file Drive) + bộ phận ngoài sản xuất (chỉ chủ sở hữu).
 *   DATA=csdl.json SUA=sua.csv NGOAI=ngoai.csv TZ=Asia/Ho_Chi_Minh node kpi-app/tests/nhan-su-cham-cong.js
 *   (sua.csv / ngoai.csv có dữ liệu cá nhân: chỉ để ở scratchpad, không commit)
 */
const path = require('path'), fs = require('fs');
const G = require('./gia-lap-kpi.js');
const { DATA, SUA, NGOAI } = process.env; if (!DATA || !SUA || !NGOAI) { console.log('Cần DATA= SUA= NGOAI='); process.exit(1); }
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? '  → ' + JSON.stringify(c).slice(0, 400) : '')); } };
const csv = f => fs.readFileSync(f, 'utf8').trim().split(/\r?\n/).map(l => { const o = []; let cur = '', q = false; for (const ch of l) { if (ch === '"') q = !q; else if (ch === ',' && !q) { o.push(cur); cur = ''; } else cur += ch; } o.push(cur); return o; });
const du = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const iDoi = du.TaiKhoan[0].indexOf('DoiMatKhauLanDau'); du.TaiKhoan.slice(1).forEach(x => { x[iDoi] = 'Không'; });
const c = G.tao(path.join(__dirname, '..', 'Code.gs'), du, '2026-11-02T17:00:00+07:00');
const src = fs.readFileSync(path.join(__dirname, '..', 'Code.gs'), 'utf8'), id1 = src.match(/NS_CC_FILE_SUA = '([^']+)'/)[1], id2 = src.match(/NS_CC_FILE_NGOAI = '([^']+)'/)[1];
c.__ngoai = { [id1]: { ten: 'sua', sheets: { T: csv(SUA) } }, [id2]: { ten: 'ngoai', sheets: { T: csv(NGOAI) } } };
const ns = () => c.doc_('NhanSu'), tk = () => c.doc_('TaiKhoan');
const doi = csv(SUA).slice(1).filter(r => r[0] === 'DOI_MA').map(r => [r[1], r[2]]);
const nkTruoc = {}; doi.forEach(([cu]) => { nkTruoc[cu] = c.doc_('NhatKySanXuat').filter(r => String(r.MaNV) === cu).length; });
const TKs = tk().filter(t => t.TrangThai === 'Đang dùng'), vt = v => TKs.find(t => String(t.VaiTro).trim() === v);
const Town = c.__phienDai(vt('OWNER')), Tadm = c.__phienDai(vt('ADMIN'));

console.log('1. Chặn gọi từ web');
c.__nguoiDung = ''; let r = c.__goi('SUA_NHAN_SU_THEO_CHAM_CONG'); ok(r && r.ok === false && /trình soạn thảo/.test(r.msg), 'khách mở web không chạy được hàm sửa', r); c.__nguoiDung = undefined;
r = c.__goi('layNhanSuNgoaiSX', Tadm); ok(!r.ok, 'ban điều hành (không phải chủ sở hữu) không xem được bộ phận ngoài SX', r);

ok(c.nsDoiMaMoiSheet_('', 'C999') === 0 && c.nsDoiMaMoiSheet_('C1 =X', 'C2') === 0, 'mã cũ trống / lạ: không đổi ô nào (chống ghi vào mọi ô trống)');
console.log('\n2. Chạy hàm sửa (trong trình soạn thảo)');
r = c.SUA_NHAN_SU_THEO_CHAM_CONG();
ok(r.ok, 'không có lỗi', r.loi);
doi.forEach(([cu, moi]) => {
  const a = ns().find(n => n.MaNV === moi), b = ns().find(n => n.MaNV === cu), t = tk().find(x => x.MaNV === moi);
  const nk = c.doc_('NhatKySanXuat').filter(x => String(x.MaNV) === moi).length;
  ok(a && !b && t && t.TenDangNhap === moi.toLowerCase() && t.MatKhauMaHoa && nk === nkTruoc[cu], 'đổi mã ' + cu + ' → ' + moi + ': nhân sự, tài khoản (đăng nhập ' + moi.toLowerCase() + ', giữ mật khẩu), ' + nk + ' dòng nhật ký KPI theo sang', { a: !!a, b: !!b, t: t && t.TenDangNhap, nk, truoc: nkTruoc[cu] });
});
const sua = csv(SUA).slice(1);
const tenSai = sua.filter(x => x[0] === 'TEN').filter(x => { const n = ns().find(y => y.MaNV === x[2]); return !n || n.HoTen !== x[3]; });
ok(!tenSai.length, 'họ tên đúng chấm công (' + sua.filter(x => x[0] === 'TEN').length + ' người)', tenSai);
const fmt = d => d ? c.Utilities.formatDate(new Date(d), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd') : '';
const ngaySai = sua.filter(x => x[0] === 'NGAY_VAO').filter(x => { const n = ns().find(y => y.MaNV === x[2]); return !n || fmt(n.NgayVaoLam) !== x[5]; });
ok(!ngaySai.length, 'ngày vào làm đúng chấm công (' + sua.filter(x => x[0] === 'NGAY_VAO').length + ' người)', ngaySai);
sua.filter(x => x[0] === 'THEM').forEach(x => { const n = ns().find(y => y.MaNV === x[2]), t = tk().find(y => y.MaNV === x[2]);
  ok(n && n.TrangThai === 'Đang làm' && n.MaXuong === x[4] && t && t.VaiTro === 'CN' && String(t.DoiMatKhauLanDau) === 'Có', 'thêm ' + x[2] + ' vào ' + x[4] + ' + tài khoản công nhân (mật khẩu tạm, phải đổi)', { n: !!n, t: t && t.TenDangNhap }); });
const tt = du.NhanSu[0].indexOf('TrangThai'), truocTT = {}; du.NhanSu.slice(1).forEach(x => { truocTT[x[0]] = x[tt]; });
ok(ns().every(n => !truocTT[n.MaNV] || truocTT[n.MaNV] === n.TrangThai), 'không đổi trạng thái của ai');
ok(c.doc_('NhanSuNgoaiSX').length === csv(NGOAI).length - 1, 'sheet NhanSuNgoaiSX có ' + (csv(NGOAI).length - 1) + ' người');

console.log('\n3. Chạy lại lần 2: không đổi gì thêm');
r = c.SUA_NHAN_SU_THEO_CHAM_CONG();
ok(r.ok && r.sua.filter(x => !/^Bỏ qua|^Bộ phận ngoài/.test(x)).length === 0, 'lần 2 chỉ báo "bỏ qua"', r.sua.slice(0, 5));

console.log('\n4. Chủ sở hữu xem bộ phận ngoài sản xuất');
r = c.__goi('layNhanSuNgoaiSX', Town);
const bp = r.ds ? [...new Set(r.ds.map(x => x.BoPhan))] : [];
ok(r.ok && r.ds.length === csv(NGOAI).length - 1 && bp.join('|') === 'Ban điều hành|Kho|Bếp + tạp vụ|Xưởng May', 'trả ' + (r.ds || []).length + ' người, nhóm theo bộ phận: ' + bp.join(' → '), r.msg);
ok(!c.doc_('NhanSu').some(n => r.ds.some(x => x.MaNV === n.MaNV && n.MaXuong === '')), 'không thêm ai vào NhanSu (không vào KPI / điểm danh)');
console.log('\n' + (loi ? '✗ ' : '✓ ') + (dem - loi) + '/' + dem + ' đạt'); process.exit(loi ? 1 : 0);
