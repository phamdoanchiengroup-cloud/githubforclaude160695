/**
 * Kiểm thử bảo mật (rà soát 17/10, sửa 18/10 – kpi-app/VIEC-BAO-MAT.md) trên giả lập + dữ liệu thật.
 *   DATA=/đường/dẫn/csdl.json TZ=Asia/Ho_Chi_Minh node kpi-app/tests/bao-mat.js      (dữ liệu thật – KHÔNG đưa vào repo)
 */
const path = require('path'), fs = require('fs');
const G = require('./gia-lap-kpi.js');
const MOI = path.join(__dirname, '..', 'Code.gs'), DATA = process.env.DATA;
if (!DATA) { console.log('Cần DATA=<file json dữ liệu>'); process.exit(1); }
let dem = 0, loi = 0;
const ok = (dk, ten, ct) => { dem++; if (dk) console.log('  ✓ ' + ten); else { loi++; console.log('  ✗ ' + ten + (ct !== undefined ? '  → ' + JSON.stringify(ct).slice(0, 400) : '')); } };

const du = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const hTK = du.TaiKhoan[0], iDoi = hTK.indexOf('DoiMatKhauLanDau');
du.TaiKhoan.slice(1).forEach(r => { r[iDoi] = 'Không'; });
const c = G.tao(MOI, du, '2026-10-14T10:00:00+07:00');
const banDau = JSON.stringify(c.__sheets.TaiKhoan.rows);
const tk = f => c.doc_('TaiKhoan').filter(f)[0];
const vt = v => x => String(x.VaiTro).trim() === v && String(x.TrangThai).trim() === 'Đang dùng';
const owner = tk(vt('OWNER')), tp = tk(x => vt('TP')(x) && x.MaXuong), cn = tk(x => vt('CN')(x) && x.MaXuong === tp.MaXuong && x.MaNV);
const P = t => c.taoPhien_(t);

console.log('\n1. Hàm chạy tay / trigger: khách mở web không gọi được');
const hamTay = Object.keys(c).filter(k => typeof c[k] === 'function' && /^[A-Z][A-Z0-9_]*[A-Z0-9]$/.test(k));
c.__nguoiDung = '';   // khách mở web
const truoc = JSON.stringify(c.__sheets), mailTruoc = (c.__mail || []).length;
const bi = hamTay.concat(['chayPhatNhapTre', 'chotThangTuDong', 'snapshotKPIHangNgay', 'donTokenHetHan', 'saoLuuHangNgay']).filter(h => {
  const r = c.__goi(h); return !(r && r.ok === false && /trình soạn thảo/.test(r.msg));
});
ok(hamTay.length > 30 && !bi.length, hamTay.length + ' hàm viết hoa + 5 hàm trigger đều bị chặn', bi);
ok(JSON.stringify(c.__sheets) === truoc && (c.__mail || []).length === mailTruoc, 'không sheet nào bị đổi, không gửi email');
let r = c.__goi('chotThangTuDong', { triggerUid: '999' });
ok(r && r.ok === false, 'truyền mã trigger giả cũng bị chặn');
c.__trigger = [{ id: '777', ham: 'snapshotKPIHangNgay' }];
r = c.__goi('snapshotKPIHangNgay', { triggerUid: '777' });
ok(!(r && r.ok === false), 'trigger thật (mã có trong dự án) vẫn chạy', r);
c.__nguoiDung = 'nguoi.khac@gmail.com';
r = c.__goi('XOA_BO_NHO_TAM'); ok(r && r.ok === false, 'người dùng Google khác (không phải chủ dự án) bị chặn');
c.__nguoiDung = undefined;   // trình soạn thảo, tài khoản chủ dự án
r = c.__goi('XOA_BO_NHO_TAM'); ok(!(r && r.ok === false), 'chủ dự án chạy trong trình soạn thảo: được', r);

console.log('\n2. Chặn công thức khi ghi vào Sheet');
const tCN = P(cn);
const cd = c.doc_('CongDoan').filter(x => x.MaXuong === cn.MaXuong && x.TrangThai !== 'Ngừng')[0];
const ngay = '2026-10-13';
r = c.__goi('congNhanGuiSanLuong', tCN, [{ Ngay: ngay, MaCD: cd.MaCD, GioLam: 8, SoLuongLamRa: 5, SoLoi: 0, GhiChu: '=TEXTJOIN(",",1,TaiKhoan!A:B)' }]);
const dong = c.__sheets.NhatKySanXuat.rows.filter(x => x.includes(cn.MaNV)).pop() || [];
ok(r.ok && dong.some(v => v === '=TEXTJOIN(",",1,TaiKhoan!A:B)') && !dong.some(v => /#CONG_THUC/.test(v)), 'ghi chú bắt đầu bằng "=" được lưu thành chữ, không thành công thức', r.ok ? dong : r);
r = c.__goi('congNhanGuiSanLuong', tCN, Array.from({ length: 31 }, () => ({ Ngay: '2026-10-12', MaCD: cd.MaCD, GioLam: 1, SoLuongLamRa: 1 })));
ok(!r.ok && /tối đa 30/.test(r.msg), 'tối đa 30 dòng mỗi lần gửi', r.msg);
r = c.__goi('congNhanGuiSanLuong', tCN, [{ Ngay: '2026-10-12', MaCD: cd.MaCD, GioLam: 8, SoLuongLamRa: 5, MaMay: 'KHONG-CO' }]);
ok(!r.ok && /máy không thuộc/.test(r.msg), 'mã máy lạ bị từ chối', r.msg);
r = c.__goi('congNhanGuiSanLuong', tCN, [{ Ngay: '2026-10-12', MaCD: cd.MaCD, GioLam: 8, SoLuongLamRa: 5, GhiChu: 'x'.repeat(1000) }]);
const d2 = c.__sheets.NhatKySanXuat.rows.filter(x => x.includes(cn.MaNV)).pop();
ok(r.ok && d2.some(v => typeof v === 'string' && v.length === 300), 'ghi chú cắt còn 300 ký tự', r);
r = c.__goi('congNhanGuiSanLuong', tCN, [{ Ngay: '2026-10-11', MaCD: cd.MaCD, GioLam: 8, SoLuongLamRa: 5, GhiChu: '- máy kẹt chỉ' }]);
const d3 = c.__sheets.NhatKySanXuat.rows.filter(x => x.includes(cn.MaNV)).pop();
ok(r.ok && d3.includes('- máy kẹt chỉ'), 'ghi chú "- máy kẹt chỉ" vẫn đọc ra đúng chữ', d3);

console.log('\n3–4. Mật khẩu tạm, mã hóa mới, phiên');
const tO = P(owner);
r = c.__goi('taoTaiKhoan', tO, { TenDangNhap: 'thu.bm', HoTen: 'Thử Bảo Mật', VaiTro: 'HR' });
ok(r.ok && /^[a-z2-9]{8}$/.test(r.mkTam) && r.hanGio === 48, 'tạo tài khoản: mật khẩu tạm ngẫu nhiên 8 ký tự, 48 giờ', r);
const mk1 = r.mkTam;
let t1 = tk(x => x.TenDangNhap === 'thu.bm');
ok(/^v2\$[0-9a-f]{16}\$[0-9a-f]{64}$/.test(String(t1.MatKhauMaHoa)) && t1.DoiMatKhauLanDau === 'Có' && t1.HanMatKhauTam, 'lưu dạng v2 (muối riêng), phải đổi, có hạn', t1);
r = c.__goi('dangNhap', 'thu.bm', '123456'); ok(!r.ok, 'không đăng nhập bằng 123456');
r = c.__goi('dangNhap', 'thu.bm', mk1); ok(r.ok && r.me.phaiDoiMK, 'đăng nhập bằng mật khẩu tạm → phải đổi', r);
const tokCu = r.token;
c.__datGio('2026-10-16T10:01:00+07:00');
r = c.__goi('dangNhap', 'thu.bm', mk1); ok(!r.ok && /hết hạn/.test(r.msg), 'quá 48 giờ: mật khẩu tạm hết hạn', r.msg);
c.__datGio('2026-10-14T11:00:00+07:00');
r = c.__goi('doiMatKhau', tokCu, mk1, 'MoiTinh2026'); ok(r.ok, 'đổi mật khẩu trong hạn', r);
t1 = tk(x => x.TenDangNhap === 'thu.bm');
ok(t1.DoiMatKhauLanDau === 'Không' && !t1.HanMatKhauTam && /^v2\$/.test(t1.MatKhauMaHoa), 'đổi xong: hết cờ, xóa hạn, vẫn dạng v2');
ok(!!c.__goi('napDuLieu', tokCu).ok, 'phiên đang dùng để đổi mật khẩu vẫn còn');
const tokKhac = c.__goi('dangNhap', 'thu.bm', 'MoiTinh2026').token;
r = c.__goi('capLaiMatKhau', tO, 'thu.bm');
ok(r.ok && /^[a-z2-9]{8}$/.test(r.mkTam), 'cấp lại: mật khẩu tạm ngẫu nhiên', r);
ok(!c.__goi('napDuLieu', tokCu).ok && !c.__goi('napDuLieu', tokKhac).ok, 'cấp lại mật khẩu: mọi phiên cũ bị đăng xuất');
// tài khoản cũ (băm 1 vòng) vẫn đăng nhập được và tự đổi sang dạng mới
const cuIdx = c.__sheets.TaiKhoan.rows.findIndex(x => x[0] === owner.TenDangNhap);
c.__sheets.TaiKhoan.rows[cuIdx][1] = c.bam_('ChuCu#2026');
r = c.__goi('dangNhap', owner.TenDangNhap, 'ChuCu#2026');
ok(r.ok && /^v2\$/.test(c.__sheets.TaiKhoan.rows[cuIdx][1]), 'mật khẩu dạng cũ đăng nhập được, tự chuyển sang v2', r.ok || r.msg);
r = c.__goi('dangNhap', owner.TenDangNhap, 'ChuCu#2026'); ok(r.ok, 'đăng nhập lại bằng dạng mới');

console.log('\n13. Chặn dò mật khẩu');
for (let i = 0; i < 5; i++) c.__goi('dangNhap', 'thu.bm', 'sai' + i);
r = c.__goi('dangNhap', 'thu.bm', 'sai5'); ok(!r.ok && /Đợi 1 phút/.test(r.msg), 'sai 5 lần: chờ 1 phút (không khóa cứng 15 phút)', r.msg);
c.__datGio('2026-10-14T11:01:30+07:00');
r = c.__goi('dangNhap', 'thu.bm', 'sai6'); r = c.__goi('dangNhap', 'thu.bm', 'sai7');
ok(!r.ok && /Đợi 2 phút/.test(r.msg), 'sai tiếp: thời gian chờ tăng dần', r.msg);

module.exports = { c, ok, P, tk, vt, owner, tp, cn };
if (require.main === module) {
  console.log('\n' + (loi ? '✗ ' + loi + '/' + dem + ' lỗi' : '✓ ' + dem + '/' + dem + ' đạt'));
  process.exit(loi ? 1 : 0);
}
