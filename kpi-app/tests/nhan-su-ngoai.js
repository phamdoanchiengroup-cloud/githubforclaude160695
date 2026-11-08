/**
 * Kiểm thử Nhân sự ngoài sản xuất (08/11): nút "Cập nhật từ file" (chỉ chủ sở hữu), hồ sơ đủ cột (ngày chính thức, phép còn lại,
 * tình trạng thử việc / chính thức, thâm niên), Kinh doanh + Marketing, không tạo tài khoản. Dữ liệu thử là tên giả.
 *   DATA=<csdl.json> TZ=Asia/Ho_Chi_Minh node kpi-app/tests/nhan-su-ngoai.js
 */
const path = require('path'), fs = require('fs');
const G = require('./gia-lap-kpi.js');
const DATA = process.env.DATA; if (!DATA) { console.log('Cần DATA='); process.exit(1); }
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? '  → ' + JSON.stringify(c).slice(0, 300) : '')); } };
const du = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const iDoi = du.TaiKhoan[0].indexOf('DoiMatKhauLanDau'); du.TaiKhoan.slice(1).forEach(x => { x[iDoi] = 'Không'; });
const c = G.tao(path.join(__dirname, '..', 'Code.gs'), du, '2026-11-08T09:00:00+07:00');
const TK = c.doc_('TaiKhoan').filter(t => t.TrangThai === 'Đang dùng'), vt = v => TK.find(t => String(t.VaiTro).trim() === v);
const Town = c.__phienDai(vt('OWNER')), Tadm = c.__phienDai(vt('ADMIN'));
const H = ['BoPhan', 'Nhom', 'MaNV', 'HoTen', 'ChucDanh', 'NgayVaoLam', 'NgayChinhThuc', 'PhepConLai', 'TrangThai', 'GhiChu'];
const file = [H,
  ['Kinh doanh', 'Quản lý', 'Z901', 'nguyễn văn a', 'Giám đốc bán hàng', '2019-01-01', '2019-03-02', '', 'Đang làm', ''],
  ['Marketing', 'Thiết kế', 'Z902', 'Trần Thị B', 'Nhân viên Thiết kế', '2026-10-19', '2026-12-19', '', 'Đang làm', 'Thử việc'],
  ['Kho', 'Kho Nhà Máy', 'Z903', 'Lê Văn C', 'Nhân viên', '2025-05-13', '2025-07-13', '2,5', 'Đang làm', ''],
  ['Bếp + tạp vụ', 'Bếp Nhà Máy', 'Z904', 'Phạm Thị D', 'Nhân viên', '2026-10-01', '', '0', 'Đang làm', ''],
  ['Xưởng May', '', 'Z905', 'Đỗ Văn E', 'Nhân viên', '2024-03-01', '2024-04-01', '8', 'Nghỉ việc', ''],
  ['Ban điều hành', '', 'Z906', 'Hoàng F', 'Ban điều hành', '2022-11-01', '', '', 'Đang làm', '']];
c.__ngoai = { [c.NS_CC_FILE_NGOAI]: { ten: 'KPI - Nhân sự ngoài sản xuất (hồ sơ)', sheets: { 'Trang tính1': file } } };
const soTK = c.doc_('TaiKhoan').length;

console.log('\n1. Cập nhật từ file');
let r = c.__goi('capNhatNgoaiSXTuFile', Tadm); ok(r.ok === false, 'ban điều hành (không phải chủ sở hữu) bị chặn');
r = c.__goi('capNhatNgoaiSXTuFile', Town);
ok(r.ok && r.n === 6 && r.dem['Kinh doanh'] === 1 && r.dem.Marketing === 1 && !r.dem['Xưởng May'], 'chủ sở hữu: chép 6 dòng, đếm theo bộ phận (bỏ người nghỉ việc)', r);
ok(c.doc_('TaiKhoan').length === soTK, 'không tạo tài khoản');

console.log('\n2. Hồ sơ trên web');
r = c.__goi('layNhanSuNgoaiSX', Town);
const g = m => r.ds.find(x => x.MaNV === m) || {};
ok(r.ok && r.ds.length === 5 && !g('Z905').MaNV, 'liệt kê người đang làm, bỏ "Nghỉ việc"', r.ds.map(x => x.MaNV));
ok(r.ds.map(x => x.BoPhan).join() === 'Ban điều hành,Kinh doanh,Marketing,Kho,Bếp + tạp vụ', 'thứ tự bộ phận: Ban điều hành → Kinh doanh → Marketing → Kho → Bếp', r.ds.map(x => x.BoPhan));
ok(g('Z901').tinhTrang === 'Chính thức' && g('Z902').tinhTrang === 'Thử việc' && g('Z904').tinhTrang === '' && g('Z906').tinhTrang === '', 'tình trạng: qua ngày chính thức = Chính thức, chưa tới = Thử việc, chưa có ngày = trống', r.ds.map(x => [x.MaNV, x.tinhTrang]));
ok(g('Z903').PhepConLai === 2.5 && g('Z904').PhepConLai === 0 && g('Z901').PhepConLai === '', 'phép năm còn lại: "2,5" → 2,5; 0 giữ 0; trống giữ trống', [g('Z903').PhepConLai, g('Z904').PhepConLai]);
ok(g('Z903').NgayChinhThuc === '13/07/2025' && g('Z903').NgayVaoLam === '13/05/2025' && g('Z903').thamNienThang === 17 && g('Z901').thamNienThang === 94, 'ngày dd/mm/yyyy, thâm niên tính theo tháng tròn', [g('Z903').thamNienThang, g('Z901').thamNienThang]);
ok(g('Z901').HoTen === 'Nguyễn Văn A' && /^https:\/\/docs\.google\.com\/spreadsheets\/d\//.test(r.file), 'chuẩn hóa họ tên; có link file gốc');
r = c.__goi('layThongKe', Town, '2026-11', true);
ok(r.ok && r.ns.vanPhong['Kinh doanh'] === 1 && r.ns.vanPhong.Marketing === 1 && !r.ns.vanPhong['Xưởng May'], 'Thống kê › Nhân sự đếm thêm Kinh doanh, Marketing', r.ns && r.ns.vanPhong);

console.log((loi ? '\n✗ ' : '\n✓ ') + (dem - loi) + '/' + dem + ' đạt');
process.exit(loi ? 1 : 0);
