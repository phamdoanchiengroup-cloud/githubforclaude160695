/**
 * Kiểm thử các mục tư vấn đã duyệt 18/10 (kpi-app/TU-VAN-VAN-HANH.md): định mức theo ngày, vi phạm không ngày, số gốc khi TP sửa,
 * học việc 1 tháng, nhắc hạn nhập, soát khâu duyệt, định mức lệch, đón người mới, bảng kỹ năng.
 *   DATA=/đường/dẫn/csdl.json TZ=Asia/Ho_Chi_Minh node kpi-app/tests/van-hanh.js
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
const tk = f => c.doc_('TaiKhoan').filter(f)[0];
const vt = v => x => String(x.VaiTro).trim() === v && String(x.TrangThai).trim() === 'Đang dùng';
const owner = tk(vt('OWNER')), tp = tk(x => vt('TP')(x) && x.MaXuong);
const P = t => c.__phienDai(t), tO = P(owner), tTP = P(tp);
const cn = tk(x => vt('CN')(x) && x.MaXuong === tp.MaXuong && x.MaNV && c.doc_('NhanSu').some(n => n.MaNV === x.MaNV));
const tCN = P(cn);
const cdX = c.doc_('CongDoan').filter(x => x.MaXuong === tp.MaXuong && x.TrangThai !== 'Ngừng');
const cd1 = cdX.find(x => c.doc_('DinhMuc').some(d => d.MaCD === x.MaCD && Number(d.DinhMucGio) > 0));
const dmGoc = Number(c.doc_('DinhMuc').find(d => d.MaCD === cd1.MaCD).DinhMucGio);
const kpi = (ma, ky) => { c.__goi('noiBo_'); return c.kpiThang_(ma, ky, c.docDuLieuKPI_()); };   // __goi trước để xóa bộ nhớ đệm đọc sheet

console.log('\nA1. Định mức theo ngày áp dụng');
// 1 dòng đã chốt ngày 05/10 của công nhân, tính KPI tháng 10 trước khi đổi định mức
const hNK = c.__sheets.NhatKySanXuat.rows[0];
const themNK = (ngay, sl, them) => c.__sheets.NhatKySanXuat.rows.push(hNK.map(h => (Object.assign({ MaDong: 'NKT' + Math.random().toString(36).slice(2, 8), Ngay: ngay, MaNV: cn.MaNV, MaCD: cd1.MaCD, GioLam: 8, SoLuongLamRa: sl, TrangThai: 'Đã chốt', NguoiNhap: 'x → duyệt: y' }, them || {}))[h] ?? ''));
themNK('2026-10-05', Math.round(dmGoc * 8));
c.__goi('XOA_BO_NHO_TAM');
const truoc = kpi(cn.MaNV, '2026-10');
r = c.__goi('banDieuHanhSuaDinhMuc', tO, cd1.MaCD, dmGoc * 2, 'Thử A1');
ok(r && r.ok, 'ban điều hành đổi định mức (gấp đôi) hôm nay 14/10', r);
ok(c.__sheets.LichSuDinhMuc && c.__sheets.LichSuDinhMuc.rows.length === 2, 'định mức cũ lưu vào LichSuDinhMuc (đến hết 13/10)', c.__sheets.LichSuDinhMuc && c.__sheets.LichSuDinhMuc.rows);
const sau = kpi(cn.MaNV, '2026-10');
ok(truoc && sau && Math.abs(truoc.sl - sau.sl) < 0.01, 'KPI tháng 10 (dòng ngày 05/10) không đổi sau khi đổi định mức', [truoc && truoc.sl, sau && sau.sl]);
const d = c.docDuLieuKPI_();
ok(c.dmNgay_(d, cd1.MaCD, '2026-10-05') === dmGoc && c.dmNgay_(d, cd1.MaCD, '2026-10-14') === dmGoc * 2, 'ngày 05/10 dùng định mức cũ, từ 14/10 dùng định mức mới');

console.log('\nA2. Vi phạm không có ngày');
const hVP = c.__sheets.ViPham.rows[0];
const mvp = c.doc_('DanhMucViPham')[0];
c.__sheets.ViPham.rows.push(hVP.map(h => ({ MaGhi: 'VPT1', Ngay: '', MaNV: cn.MaNV, MaVP: mvp.MaVP, ThoiDiemGhi: { $d: 0 } }[h] ?? '')));
c.__sheets.ViPham.rows[c.__sheets.ViPham.rows.length - 1][hVP.indexOf('ThoiDiemGhi')] = new Date('2026-09-20T09:00:00+07:00');
const k9 = kpi(cn.MaNV, '2026-09'), k10 = kpi(cn.MaNV, '2026-10');
ok(k10 && k10.at === sau.at && k10.tt === sau.tt, 'vi phạm thiếu ngày (ghi 20/09) không trừ vào tháng 10', [k10 && [k10.tt, k10.at], [sau.tt, sau.at]]);

console.log('\nA4. Trưởng phòng sửa số khi duyệt: lưu số gốc');
const cho = (ngay, sl) => { r = c.__goi('congNhanGuiSanLuong', tCN, [{ Ngay: ngay, MaCD: cd1.MaCD, GioLam: 8, SoLuongLamRa: sl }]); return c.doc_('NhatKySanXuat').filter(x => x.MaNV === cn.MaNV && String(x.TrangThai).trim() === 'Chờ duyệt').map(x => x.MaDong); };
let ids = cho('2026-10-12', 100);
const sua = {}; ids.forEach(i => { sua[i] = { SoLuongLamRa: 130, soLoi: 0 }; });
r = c.__goi('duyetNhomNguoi', tTP, ids, 0, '', sua); ok(r.ok, 'trưởng phòng duyệt: sửa SL 100 → 130', r.msg);
const dong = c.doc_('NhatKySanXuat').find(x => x.MaDong === ids[0]);
ok(String(dong.SLGoc) === '100/0' && Number(dong.SoLuongLamRa) === 130, 'lưu số gốc công nhân khai (100/0), số duyệt 130', [dong.SLGoc, dong.SoLuongLamRa]);

console.log('\nD2 + D3. Học việc 1 tháng');
const iVao = du.NhanSu[0].indexOf('NgayVaoLam');
const nsRow = c.__sheets.NhanSu.rows.find(x => x[0] === cn.MaNV);
nsRow[iVao] = new Date('2026-10-01T00:00:00+07:00');
c.__goi('XOA_BO_NHO_TAM');
ok(c.__goi('hetHocViec_', cn.MaNV) === '2026-11-01', 'vào làm 01/10 → hết học việc 01/11');
ok(c.__goi('laHocViecThang_', cn.MaNV, '2026-10') === true && c.__goi('laHocViecThang_', cn.MaNV, '2026-11') === false, 'tháng 10 là học việc, tháng 11 thì không');
r = c.__goi('layKPIKy', tTP, 'thang', '2026-10', '');
const dongKPI = (r.ds || []).find(x => x.MaNV === cn.MaNV);
ok(dongKPI && dongKPI.loai === 'Học việc' && dongKPI.hang === 0, 'bảng KPI tháng 10: loại "Học việc", không xếp hạng', dongKPI);
ok((r.ds || []).filter(x => x.MaXuong === tp.MaXuong && x.hang > 0).map(x => x.hang).sort((a, b) => a - b).every((h, i) => h === i + 1), 'người khác trong xưởng vẫn xếp hạng liền 1, 2, 3…');
// không bị phạt nhập trễ khi đang học việc: ngày 07/10 xưởng có điểm danh, không nhập
const hXN = c.__sheets.XacNhanDiemDanh.rows[0];
['2026-10-07', '2026-10-08'].forEach(n => c.__sheets.XacNhanDiemDanh.rows.push(hXN.map(h => ({ Ngay: n, MaXuong: cn.MaXuong, NguoiXacNhan: 'x' }[h] ?? ''))));
c.__datGio('2026-10-13T18:00:00+07:00');
c.__goi('chayPhatNhapTre');
ok(!c.doc_('PhatNhapTre').some(p => p.MaNV === cn.MaNV && ['2026-10-07', '2026-10-08'].includes(c.ngayVN_(p.Ngay))), 'đang học việc: không bị phạt nhập trễ');

console.log('\nC1 + C2. Nhắc hạn nhập');
c.__datGio('2026-10-09T08:00:00+07:00');
r = c.__goi('hanNhapCuaToi', tCN);
ok(r.ok && r.ds.length && r.ds[0].ngay === '2026-10-07' && r.ds[0].han === '2026-10-09' && r.hocViec, 'công nhân: còn thiếu 07/10, hạn 17:00 ngày 09/10 (đang học việc)', r);
r = c.__goi('canNhacXuong', tTP);
ok(r.ok && r.ds.some(x => x.MaNV === cn.MaNV && x.ngay.includes('2026-10-07')), 'trưởng phòng: thấy người cần nhắc trong xưởng mình', r.ds && r.ds.slice(0, 3));
r = c.__goi('canNhacXuong', tCN); ok(r.ok && !r.ds.length, 'công nhân gọi danh sách cần nhắc: rỗng');
c.__datGio('2026-10-14T10:00:00+07:00');

console.log('\nA4 + A6. Soát khâu duyệt, định mức lệch');
r = c.__goi('soatDuyet', tTP); ok(!r.ok, 'trưởng phòng không xem bảng soát');
r = c.__goi('soatDuyet', tO);
const xX = r.ok && r.xuong.find(x => x.MaXuong === tp.MaXuong);
ok(r.ok && xX && xX.sua >= 1 && Array.isArray(r.mau) && Array.isArray(r.lech), 'ban điều hành: số dòng TP sửa, mẫu đối chiếu, định mức lệch', r.ok ? { x: xX, mau: r.mau.length, lech: r.lech.length } : r);

console.log('\nD4. Đón người mới');
r = c.__goi('layHoiNhap', tTP);
const moi = r.ok && r.ds.find(x => x.MaNV === cn.MaNV);
ok(moi && moi.muc.length === 8 && moi.muc.find(m => m.ma === 'nhapdau').xong, 'trưởng phòng thấy người mới vào 01/10, mục "lần nhập đầu đã duyệt" tự đánh dấu', moi);
r = c.__goi('danhDauHoiNhap', tTP, cn.MaNV, 'phieu', true); ok(r.ok, 'đánh dấu tay "đã giao phiếu"');
ok(c.__goi('layHoiNhap', tTP).ds.find(x => x.MaNV === cn.MaNV).muc.find(m => m.ma === 'phieu').xong, 'mục tay đã lưu');
r = c.__goi('danhDauHoiNhap', tTP, cn.MaNV, 'nhapdau', true); ok(!r.ok, 'mục tự động không đánh dấu tay được');
r = c.__goi('danhDauHoiNhap', tCN, cn.MaNV, 'phieu', false); ok(!r.ok, 'công nhân không đánh dấu được');

console.log('\nD5. Bảng kỹ năng 3 mức');
r = c.__goi('luuMucKyNang', tTP, cn.MaNV, cd1.MaCD, 'hoc');
ok(r.ok && r.MucKyNang[cd1.MaCD] === 'hoc' && r.CongDoanLamDuoc.split(',').includes(cd1.MaCD), 'đặt "Đang học": công đoạn vẫn trong danh sách làm được', r);
r = c.__goi('luuMucKyNang', tTP, cn.MaNV, cd1.MaCD, 'lam'); ok(r.ok && !r.MucKyNang[cd1.MaCD], '"Làm được": bỏ khỏi bảng mức');
r = c.__goi('luuMucKyNang', tTP, cn.MaNV, cd1.MaCD, ''); ok(r.ok && !r.CongDoanLamDuoc.split(',').includes(cd1.MaCD), 'bỏ công đoạn');
const cnKhac = tk(x => vt('CN')(x) && x.MaXuong && x.MaXuong !== tp.MaXuong && x.MaNV);
r = c.__goi('luuMucKyNang', tTP, cnKhac.MaNV, cd1.MaCD, 'hoc'); ok(!r.ok, 'không sửa kỹ năng người xưởng khác');

console.log('\n' + (loi ? '✗ ' + loi + '/' + dem + ' lỗi' : '✓ ' + dem + '/' + dem + ' đạt'));
process.exit(loi ? 1 : 0);
