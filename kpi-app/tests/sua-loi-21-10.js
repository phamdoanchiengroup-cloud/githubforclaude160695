/**
 * Kiểm thử 4 lỗi chủ dự án báo 21/10 (tests/sua-loi-21-10/): TP chỉ xem KPI xưởng mình, gỡ phạt nhập trễ ngày nghỉ,
 * sản lượng chờ duyệt của công đoạn đã ngừng vẫn hiện cho TP, ngày bị từ chối đã gửi lại thì thôi nhắc "nhập lại".
 *   DATA=/đường/dẫn/csdl.json TZ=Asia/Ho_Chi_Minh node kpi-app/tests/sua-loi-21-10.js
 */
const path = require('path'), fs = require('fs');
const G = require('./gia-lap-kpi.js');
const MOI = path.join(__dirname, '..', 'Code.gs'), DATA = process.env.DATA;
if (!DATA) { console.log('Cần DATA=<file json dữ liệu>'); process.exit(1); }
let dem = 0, loi = 0, r;
const ok = (dk, ten, ct) => { dem++; if (dk) console.log('  ✓ ' + ten); else { loi++; console.log('  ✗ ' + ten + (ct !== undefined ? '  → ' + JSON.stringify(ct).slice(0, 400) : '')); } };

const du = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const hTK = du.TaiKhoan[0], iDoi = hTK.indexOf('DoiMatKhauLanDau');
du.TaiKhoan.slice(1).forEach(x => { x[iDoi] = 'Không'; });
const c = G.tao(MOI, du, '2026-10-14T10:00:00+07:00');
const tk = f => c.doc_('TaiKhoan').filter(f)[0];
const vt = v => x => String(x.VaiTro).trim() === v && String(x.TrangThai).trim() === 'Đang dùng';
const P = t => c.__phienDai(t);
const owner = tk(vt('OWNER')), tp = tk(x => vt('TP')(x) && x.MaXuong), pp = tk(x => vt('PP')(x) && x.MaXuong && x.MaXuong !== tp.MaXuong);
const tO = P(owner), tTP = P(tp), tPP = P(pp);
const cn = tk(x => vt('CN')(x) && x.MaXuong === tp.MaXuong && x.MaNV && c.doc_('NhanSu').some(n => n.MaNV === x.MaNV && n.TrangThai !== 'Nghỉ việc'));
const tCN = P(cn);
const ngVN = v => c.ngayVN_(v);

console.log('\n1. Trưởng / phó phòng chỉ xem bảng KPI xưởng mình');
const xuongCua = kq => [...new Set((kq.ds || []).map(o => o.MaXuong))];
r = c.__goi('layKPIKy', tTP, 'thang', '2026-09', '');
ok(r.ok && r.ds.length > 0 && xuongCua(r).join() === tp.MaXuong, 'TP xem tháng 9: chỉ xưởng ' + tp.MaXuong, xuongCua(r));
r = c.__goi('layKPIKy', tTP, 'thang', '2026-09', pp.MaXuong);
ok(r.ok && xuongCua(r).join() === tp.MaXuong, 'TP xin xưởng khác: vẫn chỉ trả xưởng mình', xuongCua(r));
r = c.__goi('layKPIKy', tPP, 'quy', '2026-Q3', '');
ok(r.ok && r.ds.length > 0 && xuongCua(r).join() === pp.MaXuong, 'PP xem quý 3: chỉ xưởng ' + pp.MaXuong, xuongCua(r));
r = c.__goi('layKPIKy', tO, 'thang', '2026-09', pp.MaXuong);
ok(r.ok && xuongCua(r).join() === pp.MaXuong, 'ban điều hành vẫn chọn được xưởng bất kỳ', xuongCua(r));
r = c.__goi('layKPIQuanLy', tTP, '2026-09');
ok(r.ok && r.ds.every(o => String(o.maXuong) === tp.MaXuong) && r.ds.length > 0, 'TP xem KPI quản lý: chỉ trưởng/phó phòng xưởng mình', r.ds && r.ds.map(o => o.maXuong));

console.log('\n2. Ngày nghỉ chấm muộn: gỡ phạt nhập trễ');
const phat = (ma, ng) => c.doc_('PhatNhapTre').filter(p => p.MaNV === ma && ngVN(p.Ngay) === ng).length;
const vpNT = (ma, ng) => c.doc_('ViPham').filter(v => v.MaNV === ma && v.MaVP === 'NHAPTRE' && ngVN(v.Ngay) === ng).length;
const dsNghi = c.doc_('PhatNhapTre').filter(p => { const k = c.doc_('DiemDanhNghi').find(d => d.MaNV === p.MaNV && ngVN(d.Ngay) === ngVN(p.Ngay)); return k && c.gioCoMat_(c.khTuBanGhi_(k)) <= 0; });
const nuaNgay = c.doc_('PhatNhapTre').filter(p => c.doc_('DiemDanhNghi').some(d => d.MaNV === p.MaNV && ngVN(d.Ngay) === ngVN(p.Ngay) && c.khTuBanGhi_(d) === '0.5x'));
ok(dsNghi.length >= 10, 'dữ liệu thật: ' + dsNghi.length + ' lượt phạt rơi vào ngày nghỉ cả ngày (trước khi sửa)');
const tong0 = c.doc_('PhatNhapTre').length;
r = c.__goi('chayPhatNhapTre', { triggerUid: '1' });
ok(dsNghi.every(p => !phat(p.MaNV, ngVN(p.Ngay))), 'lần chạy phạt hằng ngày tự gỡ hết các lượt đó', dsNghi.filter(p => phat(p.MaNV, ngVN(p.Ngay))).map(p => p.MaNV + ngVN(p.Ngay)));
ok(dsNghi.every(p => !vpNT(p.MaNV, ngVN(p.Ngay))), 'vi phạm nề nếp NHAPTRE tự động của các ngày đó cũng gỡ');
ok(nuaNgay.length > 0 && nuaNgay.every(p => phat(p.MaNV, ngVN(p.Ngay))), 'làm nửa ngày (vẫn phải nhập): giữ phạt', nuaNgay.length);
const ptQL = (() => { const q = c.mapQuanLy_(); return du.PhatNhapTre.slice(1).filter(x => q[String(x[0]).trim()]).length; })();   // phạt sót của TP/PP cũng gỡ (rà soát đợt 2)
ok(c.doc_('PhatNhapTre').length === tong0 - dsNghi.length - ptQL, 'không gỡ nhầm lượt phạt khác (gỡ ' + dsNghi.length + ' ngày nghỉ + ' + ptQL + ' của trưởng/phó phòng)', [tong0, c.doc_('PhatNhapTre').length]);

// Phạt rồi mới điểm danh nghỉ: TP lưu điểm danh là gỡ ngay
const ngP = '2026-10-08';
const nvP = c.doc_('NhanSu').find(n => n.MaXuong === tp.MaXuong && n.TrangThai !== 'Nghỉ việc' && n.MaNV !== tp.MaNV && n.MaNV !== cn.MaNV && !c.doc_('DiemDanhNghi').some(d => d.MaNV === n.MaNV && ngVN(d.Ngay) === ngP));
const hP = c.__sheets.PhatNhapTre.rows[0], hV = c.__sheets.ViPham.rows[0];
c.__sheets.PhatNhapTre.rows.push(hP.map(h => ({ MaNV: nvP.MaNV, HoTen: nvP.HoTen, MaXuong: nvP.MaXuong, Ngay: ngP, ThoiDiemPhat: new Date(), GhiChu: 'Quá hạn nhập SL (17h ngày LV thứ 3)' }[h] ?? '')));
c.__sheets.ViPham.rows.push(hV.map(h => ({ MaGhi: 'VPT21', Ngay: ngP, MaNV: nvP.MaNV, MaVP: 'NHAPTRE', GhiChu: 'Tự động: quá hạn nhập SL', NguoiGhi: 'Hệ thống (tự động)', ThoiDiemGhi: new Date() }[h] ?? '')));
c.__goi('XOA_BO_NHO_TAM');
ok(phat(nvP.MaNV, ngP) === 1 && vpNT(nvP.MaNV, ngP) === 1, 'giả lập: ' + nvP.MaNV + ' bị phạt nhập trễ ngày 08/10');
const nghiCu = c.doc_('DiemDanhNghi').filter(d => d.MaXuong === tp.MaXuong && ngVN(d.Ngay) === ngP).map(d => ({ MaNV: d.MaNV, LyDo: d.LyDo }));
r = c.__goi('luuDiemDanh', tTP, ngP, nghiCu.concat([{ MaNV: nvP.MaNV, LyDo: 'Nghỉ phép năm' }]));
ok(r.ok, 'TP lưu điểm danh 08/10: thêm ' + nvP.MaNV + ' nghỉ phép', r.msg);
ok(!phat(nvP.MaNV, ngP) && !vpNT(nvP.MaNV, ngP), 'lượt phạt + vi phạm NHAPTRE ngày đó được gỡ ngay khi lưu');

console.log('\n3. Sản lượng chờ duyệt: công đoạn chuyển "Ngừng" sau khi công nhân gửi');
const cdCN = c.doc_('CongDoan').filter(x => x.MaXuong === cn.MaXuong && x.TrangThai !== 'Ngừng');
const ngG = '2026-10-13';
r = c.__goi('congNhanGuiSanLuong', tCN, [{ Ngay: ngG, MaCD: cdCN[0].MaCD, GioLam: 8, SoLuongLamRa: 50, SoLoi: 0 }]);
ok(r.ok, 'công nhân gửi sản lượng 13/10', r.msg);
const rowCD = c.doc_('CongDoan').find(x => x.MaCD === cdCN[0].MaCD);
c.suaO_('CongDoan', rowCD._row, 'TrangThai', 'Ngừng'); c.xong_ && c.xong_();
c.__goi('XOA_BO_NHO_TAM');
r = c.__goi('napDuLieu', tTP);
const thay = (r.choDuyet || []).filter(x => x.MaNV === cn.MaNV && x.Ngay === ngG);
ok(r.ok && thay.length === 1, 'TP vẫn thấy dòng chờ duyệt (trước đây bị ẩn)', thay.length);
ok((r.cdNgung || []).some(x => x.MaCD === cdCN[0].MaCD && x.TenCD === rowCD.TenCD), 'gửi kèm tên công đoạn đã ngừng để hiện đúng tên');
r = c.__goi('duyetNhomNguoi', tTP, thay.map(x => x.MaDong), 0, '', {});
ok(r.ok, 'TP duyệt được', r.msg);
c.suaO_('CongDoan', rowCD._row, 'TrangThai', 'Đang dùng'); c.xong_ && c.xong_();

console.log('\n4. Bị từ chối → gửi lại → duyệt: thôi nhắc "nhập lại"');
const ngT = '2026-10-12';
r = c.__goi('congNhanGuiSanLuong', tCN, [{ Ngay: ngT, MaCD: cdCN[1].MaCD, GioLam: 8, SoLuongLamRa: 40, SoLoi: 0 }]);
ok(r.ok, 'công nhân gửi 12/10', r.msg);
let ids = c.doc_('NhatKySanXuat').filter(x => x.MaNV === cn.MaNV && ngVN(x.Ngay) === ngT && String(x.TrangThai).trim() === 'Chờ duyệt').map(x => x.MaDong);
r = c.__goi('duyetSanLuong', tTP, ids[0], false);
ok(r.ok, 'TP từ chối', r.msg);
const nhapLai = () => (c.__goi('napPhan', tCN, ['nk']).canNhapLai || []).filter(x => x.Ngay === ngT).length;
ok(nhapLai() === 1, 'công nhân thấy khung "nhập lại" ngày 12/10');
r = c.__goi('congNhanGuiSanLuong', tCN, [{ Ngay: ngT, MaCD: cdCN[1].MaCD, GioLam: 8, SoLuongLamRa: 45, SoLoi: 0 }]);
ok(r.ok, 'công nhân gửi lại', r.msg);
ok(nhapLai() === 0, 'đang chờ duyệt: thôi nhắc nhập lại');
ids = c.doc_('NhatKySanXuat').filter(x => x.MaNV === cn.MaNV && ngVN(x.Ngay) === ngT && String(x.TrangThai).trim() === 'Chờ duyệt').map(x => x.MaDong);
r = c.__goi('duyetNhomNguoi', tTP, ids, 0, '', {});
ok(r.ok && nhapLai() === 0, 'TP duyệt xong: vẫn không nhắc', r.msg);

console.log('\n5. Rà soát đợt 2: tạm nghỉ, phạt sót của trưởng/phó phòng, hàm soát dữ liệu');
const maQL = c.mapQuanLy_();
ok(!c.doc_('PhatNhapTre').some(p => maQL[String(p.MaNV).trim()]), 'không còn lượt phạt nhập trễ của trưởng/phó phòng (dữ liệu thật có C160)');
const tamNghi = c.doc_('NhanSu').filter(n => n.TrangThai === 'Tạm nghỉ').map(n => n.MaNV);
const ptTruoc = c.doc_('PhatNhapTre').filter(p => tamNghi.includes(p.MaNV)).length;
c.__goi('chayPhatNhapTre', { triggerUid: '2' });
ok(tamNghi.length > 0 && c.doc_('PhatNhapTre').filter(p => tamNghi.includes(p.MaNV)).length === ptTruoc, 'nhân sự Tạm nghỉ không bị phạt thêm (' + tamNghi.join(', ') + ')');
r = c.__goi('KIEM_TRA_DU_LIEU', { triggerUid: '3' });
const kt = c.doc_('KiemTraDuLieu'), nhom = new Set(kt.map(x => x['Nhóm']));
ok(r > 0 && kt.length === r, 'KIEM_TRA_DU_LIEU ghi ' + r + ' mục vào sheet KiemTraDuLieu');
['Nhật ký: ngày không hợp lệ', 'Tài khoản trùng tên đăng nhập', 'Công đoạn đang dùng chưa có định mức (hiệu suất tính 0)', 'DiemDanhNghi: ngày không hợp lệ']
  .forEach(n => ok(nhom.has(n), 'có nhóm: ' + n));
c.__nguoiDung = 'nguoi.khac@gmail.com'; r = c.__goi('KIEM_TRA_DU_LIEU'); c.__nguoiDung = undefined;
ok(r && r.ok === false, 'người khác gọi (từ web) bị chặn');

console.log('\n' + (loi ? '✗ ' + loi + '/' + dem + ' lỗi' : '✓ Đạt cả ' + dem + ' kiểm tra'));
process.exit(loi ? 1 : 0);
