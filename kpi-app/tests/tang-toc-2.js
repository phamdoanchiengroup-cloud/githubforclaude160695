/**
 * Kiểm thử tăng tốc đợt 2 (21/10, tests/tang-toc-2/): gói gọn dữ liệu nạp, bộ nhớ tạm KPI không bị xóa oan, làm nóng bảng KPI.
 *   DATA=/đường/dẫn/csdl.json TZ=Asia/Ho_Chi_Minh node kpi-app/tests/tang-toc-2.js
 */
const path = require('path'), fs = require('fs'), vm = require('vm');
const G = require('./gia-lap-kpi.js');
const MOI = path.join(__dirname, '..', 'Code.gs'), DATA = process.env.DATA;
if (!DATA) { console.log('Cần DATA=<file json dữ liệu>'); process.exit(1); }
let dem = 0, loi = 0, r;
const ok = (dk, ten, ct) => { dem++; if (dk) console.log('  ✓ ' + ten); else { loi++; console.log('  ✗ ' + ten + (ct !== undefined ? '  → ' + JSON.stringify(ct).slice(0, 400) : '')); } };

// Hàm mở gói lấy đúng từ Index.html (bản trình duyệt chạy)
const html = fs.readFileSync(path.join(__dirname, '..', 'Index.html'), 'utf8');
const m = html.match(/function moGoi_\(r\)\{[\s\S]*?\n  return r;\n\}/);
const moGoi_ = m ? vm.runInNewContext('(' + m[0] + ')') : null;
ok(!!moGoi_, 'Index.html có hàm moGoi_');

const du = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const iDoi = du.TaiKhoan[0].indexOf('DoiMatKhauLanDau'); du.TaiKhoan.slice(1).forEach(x => { x[iDoi] = 'Không'; });
const c = G.tao(MOI, du, '2026-10-21T10:00:00+07:00');
const tk = f => c.doc_('TaiKhoan').filter(f)[0];
const vt = v => x => String(x.VaiTro).trim() === v && String(x.TrangThai).trim() === 'Đang dùng';
const owner = tk(vt('OWNER')), tp = tk(x => vt('TP')(x) && x.MaXuong);
const cn = tk(x => vt('CN')(x) && x.MaXuong === tp.MaXuong && x.MaNV && c.doc_('NhanSu').some(n => n.MaNV === x.MaNV && n.TrangThai !== 'Nghỉ việc'));
const T = { OWNER: c.__phienDai(owner), TP: c.__phienDai(tp), CN: c.__phienDai(cn) };
const KY = '2026-10';

console.log('\n1. Dữ liệu nạp: một chuỗi JSON, mảng lớn dạng bảng, mở ra giống hệt bản cũ');
for (const ai of ['OWNER', 'TP', 'CN']) {
  const goi = c.__goiTho('napDuLieu', T[ai]);
  const cu = c.__goi('napDuLieuLoi_', T[ai], null);
  const mo = moGoi_(goi);
  ok(typeof goi === 'string' && goi.indexOf('"__b":1') > 0, ai + ': trả về chuỗi có mảng dạng bảng');
  ok(JSON.stringify(mo) === JSON.stringify(cu), ai + ': mở gói ra đúng từng giá trị như trước (' + Object.keys(cu).length + ' phần)');
  const kbCu = JSON.stringify(cu).length / 1024, kbMoi = goi.length / 1024;
  ok(kbMoi < kbCu * 0.6, ai + ': nhẹ hơn ' + Math.round(kbCu) + ' KB → ' + Math.round(kbMoi) + ' KB');
}
r = moGoi_(c.__goiTho('napPhan', T.TP, ['nk', 'cc']));
ok(r.ok && Array.isArray(r.nhatky) && Array.isArray(r.chamcong) && r.nhatky.length > 0, 'napPhan cũng gói / mở được');
r = moGoi_(c.__goiTho('napDuLieu', 'phien-sai'));
ok(r && r.ok === false && r.hetHan, 'phiên hết hạn vẫn trả đối tượng báo lỗi như cũ');
const mau = moGoi_(JSON.stringify({ ok: true, a: { __b: 1, c: ['x', 'y'], h: [[1, null], ['', 0]] } }));
ok(JSON.stringify(mau.a) === JSON.stringify([{ x: 1 }, { x: '', y: 0 }]), 'null = không có khóa; chuỗi rỗng và số 0 giữ nguyên');

console.log('\n2. Bộ nhớ tạm bảng KPI không bị xóa vì việc không liên quan KPI');
r = c.__goi('layKPIKy', T.TP, 'thang', KY, '');
ok(r.ok && !r.tuBoNho, 'lần đầu: tính mới');
r = c.__goi('layKPIKy', T.TP, 'thang', KY, '');
ok(r.ok && r.tuBoNho, 'lần hai: lấy bộ nhớ tạm');
c.__datGio('2026-10-21T10:05:00+07:00');
const cd = c.doc_('CongDoan').filter(x => x.MaXuong === tp.MaXuong && x.TrangThai !== 'Ngừng')[0];
const ngayGui = '2026-10-20';
c.__goi('napDuLieu', T.CN);
r = c.__goi('congNhanGuiSanLuong', T.CN, [{ Ngay: ngayGui, MaCD: cd.MaCD, SoLuongLamRa: 10, SoLoi: 0, GioLam: 8, MaMay: '' }]);
const daGui = r && r.ok;
ok(daGui || /đã nhập|đã được duyệt|nghỉ/i.test(r && r.msg), 'công nhân gửi sản lượng (' + (r && r.msg) + ')');
r = c.__goi('layKPIKy', T.TP, 'thang', KY, '');
ok(r.ok && r.tuBoNho, 'sau khi công nhân gửi (chờ duyệt): bảng KPI vẫn lấy bộ nhớ tạm');
r = c.__goi('layKPIQuanLy', T.TP, KY); c.__goi('layKPIQuanLy', T.TP, KY);
const ngCom = '2026-10-22';
r = c.__goi('luuThucDon', T.OWNER, ngCom, 'Cơm, canh, thịt kho', '', []);
ok(r && r.ok, 'ban điều hành lưu thực đơn ngày mai', r);
if (r && r.ok) {
  r = c.__goi('layKPIKy', T.TP, 'thang', KY, '');
  ok(r.ok && r.tuBoNho, 'sau khi lưu thực đơn: bảng KPI vẫn lấy bộ nhớ tạm');
  r = c.__goi('dangKyCom', T.CN, ngCom, true);
  ok(r && r.ok, 'công nhân đăng ký cơm', r);
  r = c.__goi('layKPIKy', T.TP, 'thang', KY, '');
  ok(r.ok && r.tuBoNho, 'sau khi đăng ký cơm: bảng KPI vẫn lấy bộ nhớ tạm');
} else console.log('  (bỏ qua: không có thực đơn còn mở để thử đăng ký cơm)');
r = c.__goi('layKPIQuanLy', T.TP, KY);
ok(r.ok && r.tuBoNho, 'KPI quản lý cũng giữ bộ nhớ tạm');
if (daGui) {
  const dong = c.doc_('NhatKySanXuat').filter(x => x.MaNV === cn.MaNV && String(x.TrangThai).trim() === 'Chờ duyệt' && c.ngayVN_(x.Ngay) === ngayGui)[0];
  r = c.__goi('duyetSanLuong', T.TP, dong.MaDong, true);
  ok(r && r.ok, 'trưởng phòng duyệt dòng vừa gửi', r);
  r = c.__goi('layKPIKy', T.TP, 'thang', KY, '');
  ok(r.ok && !r.tuBoNho, 'sau khi duyệt (số liệu KPI đổi): bảng KPI tính lại');
}
c.__goi('XOA_BO_NHO_TAM');
r = c.__goi('layKPIKy', T.TP, 'thang', KY, '');
ok(r.ok && !r.tuBoNho, 'XOA_BO_NHO_TAM vẫn xóa được cả nhớ KPI');

console.log('\n3. Làm nóng bằng trigger');
c.__datGio('2026-10-21T11:00:00+07:00');
c.__trigger = [{ id: 'lam-nong', ham: 'LAM_NONG_KPI' }];
const t0 = Date.now();
c.__goi('LAM_NONG_KPI', { triggerUid: 'lam-nong' });
console.log('    (làm nóng trên máy giả lập: ' + (Date.now() - t0) + ' ms)');
r = c.__goi('layKPIKy', T.TP, 'thang', KY, '');
ok(r.ok && r.tuBoNho, 'trưởng phòng mở Bảng KPI: có sẵn');
r = c.__goi('layKPIKy', T.OWNER, 'thang', KY, '');
ok(r.ok && r.tuBoNho, 'ban điều hành mở Bảng KPI toàn nhà máy: có sẵn');
r = c.__goi('layKPIQuanLy', T.TP, KY);
ok(r.ok && r.tuBoNho && r.ds.every(o => String(o.maXuong) === tp.MaXuong), 'trưởng phòng mở KPI quản lý: có sẵn, chỉ xưởng mình');
r = c.__goi('layKPIQuanLy', T.OWNER, KY);
ok(r.ok && r.tuBoNho && r.laOwner === true, 'chủ sở hữu mở KPI quản lý: có sẵn');
const kq1 = c.__goi('layKPIKyGoc_', T.TP, 'thang', KY, tp.MaXuong);
const kq2 = c.__goi('layKPIKy', T.TP, 'thang', KY, '');
delete kq2.tuBoNho;
ok(JSON.stringify(kq1) === JSON.stringify(kq2), 'bản làm nóng giống hệt bản tính trực tiếp');
c.__datGio('2026-10-21T23:00:00+07:00');
c.__goi('XOA_BO_NHO_TAM');
c.__goi('LAM_NONG_KPI', { triggerUid: 'lam-nong' });
r = c.__goi('layKPIKy', T.TP, 'thang', KY, '');
ok(r.ok && !r.tuBoNho, 'ngoài giờ 6h–22h: trigger không làm gì');

console.log('\n' + (loi ? '✗ ' + loi + '/' + dem + ' kiểm tra lỗi' : '✓ Đạt cả ' + dem + ' kiểm tra'));
process.exit(loi ? 1 : 0);
