/**
 * Kiểm thử hồ sơ bắt buộc (tests/ho-so/): ai thiếu, lưu mục thiếu, thống kê.
 *   DATA=/đường/dẫn/csdl.json TZ=Asia/Ho_Chi_Minh node kpi-app/tests/ho-so.js
 */
const path = require('path'), fs = require('fs');
const G = require('./gia-lap-kpi.js');
const DATA = process.env.DATA; if (!DATA) { console.log('Cần DATA='); process.exit(1); }
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? '  → ' + JSON.stringify(c).slice(0, 300) : '')); } };
const du = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const iDoi = du.TaiKhoan[0].indexOf('DoiMatKhauLanDau'); du.TaiKhoan.slice(1).forEach(x => { x[iDoi] = 'Không'; });
const c = G.tao(path.join(__dirname, '..', 'Code.gs'), du, '2026-10-22T17:00:00+07:00');
const tks = c.doc_('TaiKhoan').filter(t => t.TrangThai === 'Đang dùng' && t.MaNV && c.hsVaiTroPhai_(t.VaiTro));
const ns = {}; c.doc_('NhanSu').forEach(x => ns[x.MaNV] = x);

console.log('\n1. Kiểm tra từng mục');
ok(c.hsChuan_('DienThoai', 912345678, true) === '0912345678' && c.hsChuan_('DienThoai', '0912 345 678', false) === '0912345678' && !c.hsChuan_('DienThoai', '12345', false), 'SĐT: chấp nhận số mất số 0 đầu trong sheet, chuẩn hóa dấu cách, chặn số ngắn');
ok(c.hsChuan_('SoCCCD', '001234567890', false) === '001234567890' && !c.hsChuan_('SoCCCD', '12345678', false), 'CCCD: đúng 12 số');
ok(c.hsChuan_('NamSinh', '1995', false) === '1995' && !c.hsChuan_('NamSinh', '2020', false) && !c.hsChuan_('NamSinh', '1900', false), 'năm sinh hợp lý (1950 … 15 tuổi)');
ok(c.hsChuan_('NgayVaoLam', '2026-05-01', false) === '2026-05-01' && !c.hsChuan_('NgayVaoLam', '2027-01-01', false), 'ngày vào làm không quá hôm nay');

console.log('\n2. Ai phải điền');
const thieu = tks.map(t => ({ t, h: c.hoSoThieu_(ns[t.MaNV]) })).filter(x => x.h.length);
const du6 = tks.filter(t => ns[t.MaNV] && ns[t.MaNV].TrangThai === 'Đang làm' && !c.hoSoThieu_(ns[t.MaNV]).length);
ok(thieu.length > 50, thieu.length + ' tài khoản phải điền, ' + du6.length + ' đã đủ');
const tk1 = thieu.find(x => x.h.length >= 3).t, T = c.__phienDai(tk1);
let r = c.__goi('napDuLieu', T);
ok(r.ok && r.me.hoSoThieu && r.me.hoSoThieu.length >= 3, 'đăng nhập: máy chủ gửi danh sách mục thiếu (' + r.me.hoSoThieu.join(', ') + ')');
const tkDu = du6[0]; r = c.__goi('napDuLieu', c.__phienDai(tkDu));
ok(r.ok && r.me.hoSoThieu && r.me.hoSoThieu.length === 0, 'người đã đủ hồ sơ: không phải điền');

const tkA = c.doc_('TaiKhoan').find(t => t.TrangThai === 'Đang dùng' && String(t.VaiTro).trim() === 'ADMIN');
if (tkA) { const nvA = c.doc_('NhanSu').find(x => x.TrangThai === 'Đang làm' && c.hoSoThieu_(x).length); tkA.MaNV = nvA.MaNV;
  r = c.__goi('napDuLieu', c.__phienDai(tkA)); ok(r.ok && r.me.hoSoThieu.length === 0, 'ban điều hành (gắn mã NV có hồ sơ thiếu): không bắt buộc điền'); tkA.MaNV = ''; }
ok(['OWNER', 'ADMIN'].every(v => !c.hsVaiTroPhai_(v)) && ['TL', 'HR', 'TP', 'PP', 'CN', 'QC', 'NV', 'TBP'].every(v => c.hsVaiTroPhai_(v)), 'chủ sở hữu, ban điều hành không bắt buộc; trợ lý BĐH, nhân sự, trưởng / phó phòng trở xuống phải điền');
console.log('\n3. Lưu');
const muc = c.hoSoThieu_(ns[tk1.MaNV]);
const mau = { DienThoai: '0912345678', SoCCCD: '001234567890', DiaChi: 'Thôn 1, xã A, tỉnh B', SdtKhanCap: '0987654321', NamSinh: '1990', NgayVaoLam: '2026-05-01' };
r = c.__goi('luuHoSoThieu', T, Object.assign({}, mau, { DienThoai: '123' }));
ok(!r.ok && (muc.indexOf('DienThoai') < 0 || r.loi.includes('DienThoai')), 'sai định dạng: báo lỗi, chưa lưu', r);
r = c.__goi('luuHoSoThieu', T, Object.assign({}, mau, { SdtKhanCap: mau.DienThoai }));
ok(!r.ok || muc.indexOf('SdtKhanCap') < 0 || muc.indexOf('DienThoai') < 0, 'SĐT khẩn cấp trùng SĐT của mình: không nhận', r);
const cu = Object.assign({}, c.doc_('NhanSu').find(x => x.MaNV === tk1.MaNV));
r = c.__goi('luuHoSoThieu', T, mau);
const moi = c.doc_('NhanSu').find(x => x.MaNV === tk1.MaNV);
ok(r.ok && !c.hoSoThieu_(moi).length, 'lưu xong: hết thiếu', r);
ok(['DienThoai', 'SoCCCD', 'DiaChi', 'SdtKhanCap', 'NamSinh', 'NgayVaoLam'].every(k => muc.includes(k) || String(moi[k]) === String(cu[k])), 'mục đã có từ trước không bị đè');
ok(String(moi.DienThoai).startsWith('0') || !muc.includes('DienThoai'), 'SĐT lưu dạng chữ, giữ số 0 đầu');
r = c.__goi('napDuLieu', T); ok(r.me.hoSoThieu.length === 0, 'đăng nhập lại: không hiện bảng nữa');

console.log('\n4. Thống kê');
const own = c.doc_('TaiKhoan').find(x => String(x.VaiTro).trim() === 'OWNER' && x.TrangThai === 'Đang dùng');
r = c.__goi('thongKeHoSoThieu', c.__phienDai(own));
const soVP = r.ds.filter(x => x.MaXuong === 'VAN_PHONG').length;
ok(r.ok && r.soThieu - soVP === thieu.length - 1 && soVP > 0, 'chủ sở hữu: ' + r.soThieu + '/' + r.soXet + ' người chưa đủ (gồm ' + soVP + ' tài khoản không gắn mã NV)', [r.soThieu, soVP, thieu.length - 1]);
const tp = c.doc_('TaiKhoan').find(x => String(x.VaiTro).trim() === 'TP' && x.MaXuong && x.TrangThai === 'Đang dùng');
r = c.__goi('thongKeHoSoThieu', c.__phienDai(tp));
ok(r.ok && r.ds.every(x => x.MaXuong === tp.MaXuong), 'trưởng phòng chỉ thấy xưởng mình');
const cn = thieu.find(x => String(x.t.VaiTro).trim() === 'CN').t;
r = c.__goi('thongKeHoSoThieu', c.__phienDai(cn)); ok(!r.ok, 'công nhân không xem được thống kê');

console.log('\n5. Ban điều hành, trợ lý BĐH, nhân sự (không có trong NhanSu)');
const own2 = c.__phienDai(own);
r = c.__goi('danhSachVanPhong', own2);
ok(r.ok && r.ds.length >= 5 && r.ds.some(x => x.vaiTro === 'ADMIN') && r.ds.some(x => x.vaiTro === 'HR') && r.ds.some(x => x.vaiTro === 'TL'), 'chủ sở hữu: danh sách ' + r.ds.length + ' người (BĐH, trợ lý, nhân sự)', r.ds && r.ds.map(x => x.vaiTro));
ok(r.ds.filter(x => x.vaiTro === 'ADMIN' || x.vaiTro === 'OWNER').every(x => !x.batBuoc) && r.ds.filter(x => x.vaiTro === 'TL' || x.vaiTro === 'HR').every(x => x.batBuoc), 'BĐH / chủ sở hữu không bắt buộc, trợ lý / nhân sự bắt buộc');
const bep = c.doc_('TaiKhoan').find(x => String(x.VaiTro).trim() === 'BEP' && x.TrangThai === 'Đang dùng' && !x.MaNV);
if (bep) ok(c.__goi('napDuLieu', c.__phienDai(bep)).me.hoSoThieu.length === 6, 'tài khoản bếp (không gắn mã NV): cũng phải điền');
const adm = c.doc_('TaiKhoan').find(x => String(x.VaiTro).trim() === 'ADMIN' && x.TrangThai === 'Đang dùng' && !x.MaNV);
ok(!c.__goi('danhSachVanPhong', c.__phienDai(adm)).ok, 'ban điều hành không xem được danh sách này');
const hr = c.doc_('TaiKhoan').find(x => String(x.VaiTro).trim() === 'HR' && x.TrangThai === 'Đang dùng' && !x.MaNV), Thr = c.__phienDai(hr);
r = c.__goi('napDuLieu', Thr);
ok(r.ok && r.me.hoSoThieu.length === 6, 'nhân sự (chỉ có tài khoản) đăng nhập: phải điền đủ 6 mục', r.me && r.me.hoSoThieu);
ok(c.__goi('napDuLieu', c.__phienDai(adm)).me.hoSoThieu.length === 0, 'ban điều hành đăng nhập: không phải điền');
r = c.__goi('thongKeHoSoThieu', own2); const coVP = r.ds.some(x => x.MaXuong === 'VAN_PHONG');
r = c.__goi('luuHoSoThieu', Thr, mau);
const vp = c.doc_('HoSoVanPhong').find(x => String(x.TenDangNhap).toLowerCase() === String(hr.TenDangNhap).toLowerCase());
ok(r.ok && vp && String(vp.SoCCCD) === mau.SoCCCD && String(vp.DienThoai) === mau.DienThoai, 'lưu vào sheet HoSoVanPhong (giữ số 0 đầu)', vp);
ok(c.__goi('napDuLieu', Thr).me.hoSoThieu.length === 0 && !c.doc_('NhanSu').some(x => x.HoTen === hr.HoTen && !x.MaNV), 'đăng nhập lại: không hỏi nữa; không thêm dòng vào NhanSu (không lọt Bảng KPI)');
ok(coVP && !c.__goi('thongKeHoSoThieu', c.__phienDai(adm)).ds.some(x => x.MaXuong === 'VAN_PHONG'), 'thống kê hồ sơ thiếu: trợ lý / nhân sự chỉ hiện với chủ sở hữu');
console.log('\n' + (loi ? '✗ ' + loi + '/' + dem + ' kiểm tra lỗi' : '✓ Đạt cả ' + dem + ' kiểm tra'));
process.exit(loi ? 1 : 0);
