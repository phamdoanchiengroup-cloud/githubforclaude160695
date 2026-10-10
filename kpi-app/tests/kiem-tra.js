/**
 * Kiểm tra bản vá Code.gs trên dữ liệu thật (xuất từ Sheet CSDL KPI thành JSON — KHÔNG đưa file dữ liệu vào repo).
 *   DATA=/đường/dẫn/csdl.json node kpi-app/tests/kiem-tra.js
 * So sánh thêm với mã gốc (kpi-app/goc/Code.gs) ở các phần phải giữ nguyên kết quả.
 */
const path = require('path'), fs = require('fs');
const G = require('./gia-lap-kpi.js');
const MOI = path.join(__dirname, '..', 'Code.gs'), GOC = path.join(__dirname, '..', 'goc', 'Code.gs');
const DATA = process.env.DATA;
if (!DATA) { console.log('Cần DATA=<file json dữ liệu>'); process.exit(1); }
const duLieu = () => JSON.parse(fs.readFileSync(DATA, 'utf8'));
const BAY_GIO = '2026-09-28T16:00:00+07:00';

let dem = 0, loi = 0;
function ok(dk, ten, chiTiet) {
  dem++;
  if (dk) console.log('  ✓ ' + ten);
  else { loi++; console.log('  ✗ ' + ten + (chiTiet !== undefined ? '  → ' + JSON.stringify(chiTiet).slice(0, 300) : '')); }
}
function phien(c, tenDN) {
  const tk = c.doc_('TaiKhoan').filter(x => String(x.TenDangNhap).toLowerCase() === tenDN)[0];
  return c.taoPhien_(tk);
}
function dong(c, ten) { c.__DOC_CACHE = {}; return c.doc_(ten); }

// ===================================================================== 1. Đăng nhập, mật khẩu
console.log('\n1. Đăng nhập & mật khẩu');
{
  const c = G.tao(MOI, duLieu(), BAY_GIO);
  let r;
  for (let i = 0; i < 5; i++) r = c.__goi('dangNhap', 'kcs', 'sai' + i);
  ok(/Còn/.test(c.__goi('dangNhap', 'phogd2', 'x').msg) === false, 'lần sai đầu không báo "còn N lần"');
  r = c.__goi('dangNhap', 'kcs', '123456');
  ok(!r.ok && /tạm khóa/.test(r.msg), 'sai 5 lần -> khóa 15 phút, kể cả nhập đúng', r);
  delete c.__cache['SAI_kcs'];
  r = c.__goi('dangNhap', 'kcs', '123456');
  ok(r.ok, 'hết khóa (hoặc được cấp lại) thì đăng nhập đúng mật khẩu được', r.msg);

  c.__goi('BAT_BUOC_DOI_MAT_KHAU_MAC_DINH');
  r = c.__goi('dangNhap', 'giamdoc', '123456');
  ok(r.ok && r.me.phaiDoiMK === true, 'sau BAT_BUOC_DOI_MAT_KHAU_MAC_DINH: giamdoc bị buộc đổi', r.me);
  const tok = r.token;
  const nap = c.__goi('napDuLieu', tok);
  ok(!nap.ok && nap.phaiDoiMK, 'napDuLieu trả phaiDoiMK, chưa cho vào', nap.msg);
  const kpi = c.__goi('layKPIKy', tok, 'thang', '2026-09', '');
  ok(!kpi.ok && kpi.hetHan, 'chức năng khác bị chặn khi chưa đổi mật khẩu');
  ok(!c.__goi('doiMatKhau', tok, '123456', '123456').ok, 'không cho đặt lại 123456');
  ok(!c.__goi('doiMatKhau', tok, '123456', 'giamdoc').ok, 'không cho đặt trùng tên đăng nhập');
  ok(!c.__goi('doiMatKhau', tok, '123456', '888888').ok, 'không cho đặt 888888');
  r = c.__goi('doiMatKhau', tok, '123456', 'Kpi@2026x');
  ok(r.ok, 'đổi mật khẩu mạnh thành công', r.msg);
  ok(c.__goi('napDuLieu', tok).ok, 'đổi xong thì vào được hệ thống');
  ok(c.__goi('dangNhap', 'giamdoc', 'Kpi@2026x').ok && !c.__goi('dangNhap', 'giamdoc', '123456').ok, 'mật khẩu mới dùng được, mật khẩu cũ hết tác dụng');

  r = c.__goi('dangNhap', 'c491', '123456');
  ok(!r.ok, 'người đã nghỉ việc (c491) không đăng nhập được', r.msg);

  const tOwner = phien(c, 'chienpham');
  r = c.__goi('capLaiMatKhau', tOwner, 'c044');
  ok(r.ok && /^\d{6}$/.test(r.mkTam) && r.mkTam !== '123456', 'cấp lại mật khẩu -> mật khẩu tạm ngẫu nhiên 6 số', r.msg);
  r = c.__goi('dangNhap', 'c044', r.mkTam);
  ok(r.ok && r.me.phaiDoiMK, 'mật khẩu tạm đăng nhập được và bị buộc đổi');
}

// ===================================================================== 2. Quyền xem
console.log('\n2. Quyền xem hồ sơ / lịch sử KPI');
{
  const c = G.tao(MOI, duLieu(), BAY_GIO);
  const tk = c.doc_('TaiKhoan');
  const cn = tk.filter(x => x.VaiTro === 'CN' && x.MaNV && String(x.DoiMatKhauLanDau).trim() !== 'Có' && x.TrangThai === 'Đang dùng' && !c.nvDaNghi_(x.MaNV))[0];
  const tCN = c.taoPhien_(cn);
  const ns = c.doc_('NhanSu');
  const khac = ns.filter(x => x.MaNV !== cn.MaNV && x.MaXuong === cn.MaXuong && x.TrangThai !== 'Nghỉ việc')[0];
  const khacXuong = ns.filter(x => x.MaXuong !== cn.MaXuong && x.TrangThai !== 'Nghỉ việc')[0];
  let r = c.__goi('hoSoNhanVien', tCN, khac.MaNV);
  ok(!r.ok, 'công nhân KHÔNG xem được hồ sơ người khác', r.msg);
  r = c.__goi('hoSoNhanVien', tCN, cn.MaNV);
  ok(r.ok, 'công nhân xem được hồ sơ của mình');
  r = c.__goi('hoSoNhanVien', phien(c, 'kcs'), khac.MaNV);
  ok(!r.ok, 'kiểm soát chất lượng không xem hồ sơ');
  r = c.__goi('layLichSuKPI', tCN, khac.MaNV);
  ok(r.ok, 'công nhân xem chi tiết KPI người cùng xưởng (như cũ)');
  r = c.__goi('layLichSuKPI', tCN, khacXuong.MaNV);
  ok(!r.ok, 'công nhân không xem chi tiết KPI người xưởng khác', r.msg);
  r = c.__goi('hoSoNhanVien', phien(c, 'chienpham'), khac.MaNV);
  ok(r.ok && r.full, 'chủ sở hữu xem đủ hồ sơ');
}

// ===================================================================== 3. Kiểm tra ngày
console.log('\n3. Kiểm tra ngày nhập');
{
  const c = G.tao(MOI, duLieu(), BAY_GIO);
  ok(c.kiemNgay_('2026-09-28', 31) === '', 'hôm nay hợp lệ');
  ok(/tương lai/.test(c.kiemNgay_('2026-10-10', 31)), 'chặn ngày tương lai');
  ok(/quá cũ/.test(c.kiemNgay_('2026-01-08', 0)), 'chặn ngày trước khi dùng hệ thống (nhầm ngày/tháng)');
  ok(/không tồn tại/.test(c.kiemNgay_('2026-02-30', 0)), 'chặn ngày không tồn tại');
  ok(/không hợp lệ/.test(c.kiemNgay_('1483-09-15x', 0)) && /quá cũ/.test(c.kiemNgay_('1483-09-15', 0)), 'chặn năm gõ nhầm');
  ok(/27\/08\/2026 đã quá 31/.test(c.kiemNgay_('2026-08-27', 31)) && c.kiemNgay_('2026-08-28', 31) === '', 'chặn nhập bù quá 31 ngày');
  const cn = c.doc_('TaiKhoan').filter(x => x.VaiTro === 'CN' && x.MaNV && x.TrangThai === 'Đang dùng' && String(x.DoiMatKhauLanDau).trim() !== 'Có')[0];
  const cd = c.doc_('CongDoan').filter(x => x.MaXuong === cn.MaXuong && x.TrangThai !== 'Ngừng')[0];
  const r = c.__goi('congNhanGuiSanLuong', c.taoPhien_(cn), [{ Ngay: '2026-10-10', MaCD: cd.MaCD, SoLuongLamRa: 5, GioLam: 8 }]);
  ok(!r.ok && /tương lai/.test(r.msg), 'công nhân gửi sản lượng ngày tương lai bị chặn', r.msg);
}

// ===================================================================== 4. Điểm danh không xóa ô nửa ngày / đi muộn
console.log('\n4. Điểm danh ngày giữ ô nửa ngày / đi muộn');
{
  const c = G.tao(MOI, duLieu(), BAY_GIO);
  const dd = c.doc_('DiemDanhNghi');
  const mau = dd.filter(r => ['0.5x', 'x-1', 'x-1.5'].indexOf(String(r.KyHieu)) >= 0 && c.ngayVN_(r.Ngay) >= '2026-08-28')[0]
           || dd.filter(r => ['0.5x', 'x-1', 'x-1.5'].indexOf(String(r.KyHieu)) >= 0)[0];
  const ngay = c.ngayVN_(mau.Ngay);
  const tp = c.doc_('TaiKhoan').filter(x => x.VaiTro === 'TP' && x.MaXuong === mau.MaXuong)[0];
  const tTP = c.taoPhien_(tp);
  const truoc = dd.filter(r => c.ngayVN_(r.Ngay) === ngay && r.MaXuong === mau.MaXuong);
  const ds = c.__goi('layDiemDanh', tTP, ngay);
  const nghi = ds.ds.filter(o => o.nghi && !o.daiHan).map(o => ({ MaNV: o.MaNV, LyDo: o.LyDo }));
  c.__datGio('2026-09-28T16:00:00+07:00');
  const kq = c.__goi('luuDiemDanh', tTP, ngay, nghi);
  const sau = dong(c, 'DiemDanhNghi').filter(r => c.ngayVN_(r.Ngay) === ngay && r.MaXuong === mau.MaXuong);
  const kh = a => a.map(r => r.MaNV + ':' + c.khTuBanGhi_(r)).sort().join(',');
  const quaHan = /quá 62/.test(kq.msg || '');
  if (quaHan) console.log('  (ngày mẫu ' + ngay + ' đã quá 62 ngày — bỏ qua)');
  else {
    ok(kq.ok, 'lưu lại điểm danh ngày ' + ngay + ' (xưởng ' + mau.MaXuong + ')', kq.msg);
    ok(kh(truoc) === kh(sau), 'ký hiệu mọi người giữ nguyên sau khi lưu lại (gồm ' + mau.MaNV + ' = ' + mau.KyHieu + ')', { truoc: kh(truoc), sau: kh(sau) });
    // Chạy mã GỐC cùng thao tác -> ô nửa ngày bị mất
    const g = G.tao(GOC, duLieu(), BAY_GIO);
    g.__goi('luuDiemDanh', g.taoPhien_(tp), ngay, nghi);
    const sauGoc = dong(g, 'DiemDanhNghi').filter(r => g.ngayVN_(r.Ngay) === ngay && r.MaXuong === mau.MaXuong);
    ok(kh(sauGoc) !== kh(truoc), '(đối chứng) mã gốc làm mất ô nửa ngày/đi muộn: ' + kh(truoc).split(',').length + ' -> ' + kh(sauGoc).split(',').length + ' ô');
  }
  const moi = dong(c, 'DiemDanhNghi').filter(r => c.ngayVN_(r.Ngay) === ngay && r.MaXuong === mau.MaXuong);
  ok(moi.every(r => String(r.KyHieu).trim() !== ''), 'bản ghi mới đều có ký hiệu');
}

// ===================================================================== 5. Chốt tháng
console.log('\n5. Chốt tháng');
{
  const c = G.tao(MOI, duLieu(), BAY_GIO);
  const maQL = c.mapQuanLy_();
  const n = c.__goi('snapshotKPIHangNgay');
  const k9 = dong(c, 'KPIThang').filter(r => c.chuanKy_(r.Ky) === '2026-09');
  ok(n > 0 && k9.length === n, 'snapshot 9h ghi ' + n + ' người cho 2026-09');
  ok(k9.every(r => !maQL[String(r.MaNV).trim()]), 'snapshot KHÔNG còn trưởng/phó phòng', k9.filter(r => maQL[r.MaNV]).map(r => r.MaNV));
  const k8 = dong(c, 'KPIThang').filter(r => c.chuanKy_(r.Ky) === '2026-08');
  ok(k8.length === 115, 'dữ liệu chốt tháng 8 giữ nguyên (115 dòng)', k8.length);

  const tOwner = phien(c, 'chienpham');
  // Qua tháng 10: tháng 9 chỉ có bản tạm -> bảng KPI tính trực tiếp
  c.__datGio('2026-10-02T10:00:00+07:00');
  let r = c.__goi('layKPIKy', tOwner, 'thang', '2026-09', '');
  ok(r.ok && r.tamTinh, 'ngày 2/10: KPI tháng 9 vẫn tính trực tiếp (chưa chốt chính thức)');
  // Duyệt muộn một dòng chờ duyệt tháng 9 -> phải được tính
  const cho = dong(c, 'NhatKySanXuat').filter(x => String(x.TrangThai).trim() === 'Chờ duyệt' && c.ngayVN_(x.Ngay).slice(0, 7) === '2026-09')[0];
  const truoc = r.ds.filter(o => o.MaNV === cho.MaNV)[0];
  const tAdmin = phien(c, 'phogd2');
  c.__goi('duyetSanLuong', tAdmin, cho.MaDong, true);
  r = c.__goi('layKPIKy', tOwner, 'thang', '2026-09', '');
  const sau = r.ds.filter(o => o.MaNV === cho.MaNV)[0];
  ok(sau && (!truoc || sau.spl > truoc.spl), 'dòng tháng 9 duyệt ngày 2/10 được cộng vào KPI tháng 9', { truoc: truoc && truoc.spl, sau: sau && sau.spl });

  // Chốt tự động: 1/10 (T5) = NLV 1, 2/10 (T6) = NLV 2, 3/10 (T7) = NLV 3
  c.__datGio('2026-10-01T23:00:00+07:00'); c.__goi('chotThangTuDong');
  ok(!c.__goi('daChotChinhThuc_', '2026-09'), '1/10 23h: chưa chốt');
  c.__datGio('2026-10-02T23:00:00+07:00'); c.__goi('chotThangTuDong');
  ok(!c.__goi('daChotChinhThuc_', '2026-09'), '2/10 23h: chưa chốt');
  c.__datGio('2026-10-03T23:00:00+07:00'); c.__goi('chotThangTuDong');
  ok(c.__goi('daChotChinhThuc_', '2026-09'), '3/10 23h (ngày làm việc thứ 3): đã chốt tháng 9 chính thức');
  r = c.__goi('layKPIKy', tOwner, 'thang', '2026-09', '');
  ok(r.ok && !r.tamTinh, 'sau khi chốt: bảng KPI tháng 9 đọc bản chốt');
  const chot = dong(c, 'KPIThang').filter(x => c.chuanKy_(x.Ky) === '2026-09');
  ok(chot.every(x => !maQL[String(x.MaNV).trim()]) && chot.every(x => /ngày làm việc thứ 3/.test(x.NguoiChot)), 'bản chốt chính thức không có trưởng/phó phòng');
  // 9h sáng 5/10 snapshot tháng 10 không đụng tháng 9
  c.__datGio('2026-10-05T09:00:00+07:00'); c.__goi('snapshotKPIHangNgay');
  ok(dong(c, 'KPIThang').filter(x => c.chuanKy_(x.Ky) === '2026-09').length === chot.length, 'snapshot tháng 10 không làm mất bản chốt tháng 9');
  // Mã gốc: chốt 23h ngày 30/9 và có trưởng/phó phòng
  const g = G.tao(GOC, duLieu(), '2026-09-30T23:00:00+07:00');
  g.__goi('chotThangTuDong');
  const gChot = dong(g, 'KPIThang').filter(x => g.chuanKy_(x.Ky) === '2026-09');
  ok(gChot.some(x => maQL[String(x.MaNV).trim()]), '(đối chứng) mã gốc chốt 30/9 có ' + gChot.filter(x => maQL[String(x.MaNV).trim()]).length + ' trưởng/phó phòng trong bảng công nhân');
}

// ===================================================================== 6. KPI giữ nguyên kết quả so với mã gốc
console.log('\n6. Kết quả KPI so với mã gốc');
{
  const c = G.tao(MOI, duLieu(), BAY_GIO), g = G.tao(GOC, duLieu(), BAY_GIO);
  const a = c.__goi('layKPIKy', phien(c, 'chienpham'), 'thang', '2026-09', '');
  const b = g.__goi('layKPIKy', phien(g, 'chienpham'), 'thang', '2026-09', '');
  const m = {}; b.ds.forEach(o => { m[o.MaNV] = o; });
  const lech = a.ds.filter(o => !m[o.MaNV] || Math.abs(m[o.MaNV].tong - o.tong) > 0.001);
  ok(a.ds.length === b.ds.length && lech.length === 0, 'KPI tháng 9 của ' + a.ds.length + ' công nhân giống hệt mã gốc', lech.slice(0, 3));
  const a8 = c.__goi('layKPIKy', phien(c, 'chienpham'), 'thang', '2026-08', '');
  const b8 = g.__goi('layKPIKy', phien(g, 'chienpham'), 'thang', '2026-08', '');
  ok(!a8.tamTinh && a8.ds.length === b8.ds.length, 'tháng 8 đọc bản đã chốt (' + a8.ds.length + ' người)', [a8.ds.length, b8.ds.length]);

  let t0 = Date.now();
  const q1 = c.__goi('layKPIQuanLy', phien(c, 'chienpham'), '2026-09');
  const tMoi = Date.now() - t0; t0 = Date.now();
  const q0 = g.__goi('layKPIQuanLy', phien(g, 'chienpham'), '2026-09');
  const tGoc = Date.now() - t0;
  ok(q1.ok && q1.ds.length === q0.ds.length, 'KPI quản lý: ' + q1.ds.length + ' người, ' + tMoi + ' ms (mã gốc ' + tGoc + ' ms)');
  const khac = q1.ds.map(o => {
    const x = q0.ds.filter(y => y.maNV === o.maNV)[0];
    return { ten: o.hoTen, moi: Math.round(o.tong * 10) / 10, cu: Math.round(x.tong * 10) / 10, vhMoi: o.vanHanh, vhCu: x.vanHanh };
  }).filter(o => Math.abs(o.moi - o.cu) > 0.05);
  console.log('    KPI quản lý thay đổi ở ' + khac.length + ' người (do bỏ ngày lễ trong MienTruDiemDanh và không tính KPI của chính TP/PP vào trung bình xưởng):');
  khac.slice(0, 8).forEach(o => console.log('      ' + o.ten + ': ' + o.cu + ' -> ' + o.moi + ' (vận hành ' + o.vhCu + ' -> ' + o.vhMoi + ')'));
}

// ===================================================================== 7. Giảm tải
console.log('\n7. Giảm tải dữ liệu gửi về trình duyệt');
{
  const c = G.tao(MOI, duLieu(), BAY_GIO), g = G.tao(GOC, duLieu(), BAY_GIO);
  const a = JSON.stringify(c.__goi('napDuLieu', phien(c, 'chienpham')));
  const b = JSON.stringify(g.__goi('napDuLieu', phien(g, 'chienpham')));
  ok(a.length < b.length, 'napDuLieu (chủ sở hữu): ' + Math.round(b.length / 1024) + ' KB -> ' + Math.round(a.length / 1024) + ' KB');
  const d = JSON.parse(a);
  ok(d.log.length === 80, 'nhật ký thao tác: đọc đúng 80 dòng cuối');
  ok(d.nhatky.every(r => r.Ngay >= '2026-08-01'), 'nhật ký gửi về từ 01/08 (tháng trước + tháng này)');
  ok(Array.isArray(d.ngayLe) && d.ngayLe.indexOf('2026-09-02|PHOICB') >= 0, 'gửi kèm ngày lễ / ngày miễn điểm danh');
}

// ===================================================================== 8. Phạt nhập trễ, vi phạm, hàm chạy tay
console.log('\n8. Phạt nhập trễ & hàm chạy tay');
{
  const c = G.tao(MOI, duLieu(), BAY_GIO);
  const vpTruoc = dong(c, 'ViPham').length;
  const n = c.__goi('chayPhatNhapTre');
  const vp = dong(c, 'ViPham');
  ok(vp.length === vpTruoc + n, 'phạt nhập trễ: ' + n + ' lượt mới');
  ok(vp.slice(vpTruoc).every(v => String(v.MaGhi).trim()), 'vi phạm tự động mới có mã ghi');
  const maQL = c.mapQuanLy_();
  ok(dong(c, 'PhatNhapTre').slice(-n || 1e9).every(p => !maQL[p.MaNV]), 'không phạt trưởng/phó phòng');
  ok(c.__goi('chayPhatNhapTre') === 0, 'chạy lại không phạt trùng');
  c.__goi('BO_SUNG_MA_GHI_VIPHAM');
  ok(dong(c, 'ViPham').every(v => String(v.MaGhi).trim()), 'BO_SUNG_MA_GHI_VIPHAM: mọi vi phạm có mã ghi');
  c.__goi('NGUNG_TK_NGHI_VIEC');
  const conDung = dong(c, 'TaiKhoan').filter(t => t.MaNV && t.TrangThai === 'Đang dùng' && c.nvDaNghi_(t.MaNV));
  ok(conDung.length === 0, 'NGUNG_TK_NGHI_VIEC: không còn tài khoản người nghỉ việc');
  c.__goi('TAO_SHEET_NGAY_LE');
  ok(c.laNgayLe_('2026-09-02', 'CNC') && !c.laNgayLe_('2026-09-03', 'CNC'), 'sheet NgayLe hoạt động');
  ok(c.themNgayLamViec_('2026-08-31', 2) === '2026-09-04', 'hạn 2 ngày làm việc từ 31/8 bỏ qua lễ 1–2/9 -> 04/09');

  c.__log.length = 0;
  c.__goi('SUA_NGAY_NHAT_KY');
  console.log('    ' + c.__log.join('\n').split('\n').slice(0, 1).join('\n'));
  const ds = c.__goi('dsNgaySaiNhatKy_');
  const tuSua = ds.filter(d => d.chac);
  ok(tuSua.length >= 20, 'nhận ra ' + ds.length + ' dòng ngày sai, tự sửa chắc chắn được ' + tuSua.length + ' dòng');
  ok(tuSua.every(d => d.deXuat.slice(0, 7) === '2026-08' && d.maNV === 'C049'), 'các dòng tự sửa đều của C049, về tháng 8');
  console.log('    Đề xuất: ' + ds.map(d => d.ngay.slice(0, 10) + '→' + (d.deXuat || '?') + (d.chac ? '' : '(tay)')).filter((v, i, a) => a.indexOf(v) === i).join(', '));
  const sheetNK = c.__sheets.NhatKySanXuat;
  sheetNK.rows[0].indexOf('Ngay');
}

// ===================================================================== 9. Khóa ghi
console.log('\n9. Khóa ghi');
{
  const c = G.tao(MOI, duLieu(), BAY_GIO);
  const t = phien(c, 'chienpham');
  c.__giuKhoa();
  let loiKhoa = '';
  try { c.ghiViPham(t, { MaNV: 'C040', MaVP: 'VP04' }); } catch (e) { loiKhoa = e.message; }
  ok(/bận/.test(loiKhoa), 'đang có người lưu -> báo "hệ thống đang bận", không ghi chồng');
  const r = c.__goi('ghiViPham', t, { MaNV: 'C040', MaVP: 'VP04' });
  ok(r.ok, 'hết khóa thì lưu bình thường');
}

// ===================================================================== 10. Tăng tốc
console.log('\n10. Tăng tốc: bộ đệm ghi, bộ nhớ tạm, nạp theo phần, Sheets API, lưu trữ');
{
  // 10a) Bộ đệm ghi: duyệt 1 người cho kết quả Sheet y hệt mã gốc nhưng ít lần ghi hơn
  const c = G.tao(MOI, duLieu(), BAY_GIO), g = G.tao(GOC, duLieu(), BAY_GIO);
  const cho = dong(c, 'NhatKySanXuat').filter(r => String(r.TrangThai).trim() === 'Chờ duyệt');
  const nv = cho[0].MaNV, ngay = c.ngayVN_(cho[0].Ngay);
  const ds = cho.filter(r => r.MaNV === nv && c.ngayVN_(r.Ngay) === ngay).map(r => r.MaDong);
  const xuong = c.doc_('CongDoan').filter(x => x.MaCD === cho[0].MaCD)[0].MaXuong;
  const tpTen = c.doc_('TaiKhoan').filter(x => x.VaiTro === 'TP' && x.MaXuong === xuong)[0].TenDangNhap;
  c.__thongKe.ghi = 0; g.__thongKe.ghi = 0;
  const r1 = c.__goi('duyetNhomNguoi', phien(c, tpTen), ds, 0, '', {});
  const r2 = g.__goi('duyetNhomNguoi', phien(g, tpTen), ds, 0, '', {});
  const bo = rows => JSON.stringify(rows.map(r => r.map(x => (x instanceof Date || (x && x.getTime)) ? x.getTime() : x)));
  ok(r1.ok && r2.ok && bo(c.__sheets.NhatKySanXuat.rows) === bo(g.__sheets.NhatKySanXuat.rows), 'duyệt ' + ds.length + ' công đoạn: NhatKySanXuat giống hệt mã gốc');
  ok(c.__thongKe.ghi < g.__thongKe.ghi, 'số lần ghi Sheet giảm: ' + g.__thongKe.ghi + ' -> ' + c.__thongKe.ghi);

  // 10b) Bộ nhớ tạm: lần 2 lấy từ bộ nhớ; có người lưu -> tính lại
  const tO = phien(c, 'chienpham');
  const k1 = c.__goi('layKPIKy', tO, 'thang', '2026-09', '');
  const k2 = c.__goi('layKPIKy', tO, 'thang', '2026-09', '');
  ok(!k1.tuBoNho && k2.tuBoNho && JSON.stringify(k1.ds) === JSON.stringify(k2.ds), 'bảng KPI lần 2 lấy từ bộ nhớ tạm, kết quả giống lần 1');
  const q1 = c.__goi('layKPIQuanLy', tO, '2026-09'), q2 = c.__goi('layKPIQuanLy', tO, '2026-09');
  ok(q2.tuBoNho && JSON.stringify(Object.assign({}, q1, { tuBoNho: 0 })) === JSON.stringify(Object.assign({}, q2, { tuBoNho: 0 })), 'KPI quản lý (244KB) nhớ được qua nhiều khối cache');
  const cho2 = dong(c, 'NhatKySanXuat').filter(x => String(x.TrangThai).trim() === 'Chờ duyệt' && c.ngayVN_(x.Ngay).slice(0, 7) === '2026-09')[0];
  c.__goi('duyetSanLuong', phien(c, 'phogd2'), cho2.MaDong, true);
  const k3 = c.__goi('layKPIKy', tO, 'thang', '2026-09', '');
  const a1 = k1.ds.filter(o => o.MaNV === cho2.MaNV)[0], a3 = k3.ds.filter(o => o.MaNV === cho2.MaNV)[0];
  ok(!k3.tuBoNho && a3 && (!a1 || a3.spl > a1.spl), 'sau khi duyệt thêm sản lượng: bỏ bộ nhớ cũ, KPI cập nhật ngay');
  c.__goi('XOA_BO_NHO_TAM');
  ok(!c.__goi('layKPIKy', tO, 'thang', '2026-09', '').tuBoNho, 'XOA_BO_NHO_TAM bỏ bộ nhớ tạm (sau khi sửa tay trong Sheet)');

  // 10c) Nạp theo phần
  const day = c.__goi('napDuLieu', tO), vp = c.__goi('napPhan', tO, ['vp']);
  ok(vp.ok && vp.vipham && !vp.nhatky && !vp.nhansu && !vp.congdoan, 'napPhan([vp]) chỉ gửi phần vi phạm', Object.keys(vp));
  ok(JSON.stringify(vp.vipham) === JSON.stringify(day.vipham) && vp.vipham.length > 0, 'phần vi phạm giống bản nạp đầy đủ');
  const nk = c.__goi('napPhan', tO, ['nk']);
  ok(nk.nhatky && JSON.stringify(nk.nhatky) === JSON.stringify(day.nhatky) && !nk.nhansu, 'napPhan([nk]) gửi nhật ký giống bản đầy đủ');

  const gv = c.__goi('ghiViPham', tO, { MaNV: 'C040', MaVP: 'VP04' });
  ok(gv.ok && JSON.stringify(gv.phanDoi) === '["vp"]', 'ghi vi phạm -> máy chủ báo chỉ cần tải lại phần vi phạm', gv.phanDoi);
  ok(r1.phanDoi && r1.phanDoi.indexOf('nk') >= 0, 'duyệt sản lượng -> báo tải lại phần nhật ký', r1.phanDoi);
  ok(!('phanDoi' in k1), 'hàm chỉ đọc không kèm phanDoi');

  // 10d) Quyền riêng tư hồ sơ nhân sự
  const cn = c.doc_('TaiKhoan').filter(x => x.VaiTro === 'CN' && x.TrangThai === 'Đang dùng' && x.MaNV)[0];
  c.__sheets.TaiKhoan.rows[cn._row - 1][c.dauCot_('TaiKhoan').indexOf('DoiMatKhauLanDau')] = 'Không';
  c.__DOC_CACHE = {};
  const dCN = c.__goi('napDuLieu', c.taoPhien_(dong(c, 'TaiKhoan').filter(x => x.TenDangNhap === cn.TenDangNhap)[0]));
  const khac = (dCN.nhansu || []).filter(x => x.MaNV !== cn.MaNV), minh = (dCN.nhansu || []).filter(x => x.MaNV === cn.MaNV)[0];
  ok(dCN.ok && khac.length > 0 && khac.every(x => !('SoCCCD' in x) && !('DienThoai' in x) && !('DiaChi' in x)), 'công nhân KHÔNG còn thấy CCCD / điện thoại / địa chỉ của người khác', khac[0]);
  ok(minh && ('SoCCCD' in minh) && ('DienThoai' in minh), 'công nhân vẫn thấy hồ sơ của chính mình');
  const gCN = g.__goi('napDuLieu', g.taoPhien_(g.doc_('TaiKhoan').filter(x => x.TenDangNhap === cn.TenDangNhap)[0]));
  ok(gCN.nhansu && gCN.nhansu.some(x => x.MaNV !== cn.MaNV && x.SoCCCD), '(đối chứng) mã gốc gửi CCCD của cả xưởng cho công nhân');

  // 10e) Sheets API: kiểm tra khớp từng ô rồi mới bật; bật rồi kết quả giống hệt, ít lượt đọc hơn
  const s = G.tao(MOI, duLieu(), BAY_GIO);
  s.__batSheetsApi();
  s.__goi('KIEM_TRA_SHEETS_API');
  ok(s.PropertiesService.getScriptProperties().getProperty('KPI_SHEETS_API') === '1', 'KIEM_TRA_SHEETS_API: khớp từng ô -> bật', s.__log.slice(-1)[0]);
  const tS = phien(s, 'chienpham');
  s.__thongKe.doc = 0; const qApi = s.__goi('napDuLieu', tS); const docApi = s.__thongKe.doc;
  s.PropertiesService.getScriptProperties().setProperty('KPI_SHEETS_API', '0');
  s.__thongKe.doc = 0; const qCu = s.__goi('napDuLieu', tS); const docCu = s.__thongKe.doc;
  ok(JSON.stringify(qApi) === JSON.stringify(qCu), 'napDuLieu qua Sheets API giống hệt cách đọc cũ');
  ok(docApi < docCu, 'số lượt đọc: ' + docCu + ' -> ' + docApi);

  // 10f) Lưu trữ nhật ký cũ: KPI quản lý / lịch sử KPI tháng cũ không đổi
  const l = G.tao(MOI, duLieu(), '2026-12-10T10:00:00+07:00');
  const tL = phien(l, 'chienpham');
  const nvLS = dong(l, 'KPIThang').filter(r => l.chuanKy_(r.Ky) === '2026-08')[0].MaNV;
  const ls1 = l.__goi('layLichSuKPI', tL, nvLS), ql1 = l.__goi('layKPIQuanLy', tL, '2026-08');
  const n0 = l.__sheets.NhatKySanXuat.rows.length;
  l.__goi('LUU_TRU_NHAT_KY');
  const n1 = l.__sheets.NhatKySanXuat.rows.length, lt = l.__sheets.NhatKySanXuat_LuuTru;
  ok(lt && n1 < n0 && lt.rows.length - 1 === n0 - n1, 'chuyển ' + (n0 - n1) + ' dòng tháng đã chốt sang NhatKySanXuat_LuuTru', l.__log.slice(-1)[0]);
  ok(dong(l, 'NhatKySanXuat').every(r => l.ngayVN_(r.Ngay).slice(0, 7) >= '2026-09' || !l.daChotChinhThuc_(l.ngayVN_(r.Ngay).slice(0, 7))), 'chỉ chuyển tháng đã chốt chính thức và cũ hơn 3 tháng');
  const ls2 = l.__goi('layLichSuKPI', tL, nvLS), ql2 = l.__goi('layKPIQuanLy', tL, '2026-08');
  const bt = x => JSON.stringify(Object.assign({}, x, { tuBoNho: 0 }));
  ok(!ql2.tuBoNho && bt(ql1) === bt(ql2), 'KPI quản lý tháng 8 giống trước khi lưu trữ');
  ok(bt(ls1) === bt(ls2), 'lịch sử KPI giống trước khi lưu trữ');
}

console.log('\n' + (loi ? '✗ ' + loi + '/' + dem + ' kiểm tra LỖI' : '✓ Tất cả ' + dem + ' kiểm tra đạt'));
process.exit(loi ? 1 : 0);
