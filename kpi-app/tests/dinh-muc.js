/**
 * Kiểm thử phân tích định mức bản 21/10 (tests/dinh-muc/): đánh giá theo định mức đang dùng, gợi ý mọi công đoạn về 85%,
 * áp gợi ý xong phân tích lại phải quanh 85%, áp "từ đầu tháng" thì KPI tháng này tính theo định mức mới.
 *   DATA=/đường/dẫn/csdl.json TZ=Asia/Ho_Chi_Minh node kpi-app/tests/dinh-muc.js
 */
const path = require('path'), fs = require('fs');
const G = require('./gia-lap-kpi.js');
const MOI = path.join(__dirname, '..', 'Code.gs'), DATA = process.env.DATA;
if (!DATA) { console.log('Cần DATA=<file json dữ liệu>'); process.exit(1); }
let dem = 0, loi = 0, r;
const ok = (dk, ten, ct) => { dem++; if (dk) console.log('  ✓ ' + ten); else { loi++; console.log('  ✗ ' + ten + (ct !== undefined ? '  → ' + JSON.stringify(ct).slice(0, 500) : '')); } };
const du = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const iDoi = du.TaiKhoan[0].indexOf('DoiMatKhauLanDau'); du.TaiKhoan.slice(1).forEach(x => { x[iDoi] = 'Không'; });
const KY = '2026-10', GIO = '2026-10-21T10:00:00+07:00';
const tao = () => { const c = G.tao(MOI, du, GIO); const tk = c.doc_('TaiKhoan').filter(x => String(x.VaiTro).trim() === 'OWNER' && x.TrangThai === 'Đang dùng')[0];
  const tp = c.doc_('TaiKhoan').filter(x => String(x.VaiTro).trim() === 'TP' && x.MaXuong && x.TrangThai === 'Đang dùng')[0];
  return { c, T: c.__phienDai(tk), TP: c.__phienDai(tp), tp }; };
const phanTich = (c, T) => { c.__goi('XOA_BO_NHO_TAM'); const t0 = Date.now(); const kq = c.__goi('phanTichDinhMuc', T, 'thang', KY); kq.ms = Date.now() - t0; return kq; };
const nhieu = ds => ds.filter(x => x.soCoData >= 3);

console.log('\n1. Phân tích theo định mức đang dùng + gợi ý mọi công đoạn');
let { c, T, TP, tp } = tao();
r = phanTich(c, T);
ok(r.ok && r.ds.length > 50, 'phân tích tháng 10: ' + r.ds.length + ' công đoạn (' + r.ms + ' ms trên máy giả lập)');
ok(r.soHocViecBo > 0, 'không tính sản lượng ngày còn học việc vào trung vị (bỏ ' + r.soHocViecBo + ' người)', r.soHocViecBo);
ok(r.apTu === '2026-10-01', 'đổi định mức sẽ áp từ 01/10 (tháng chưa chốt)', r.apTu);
const lech = r.ds.filter(x => x.soCoData > 0 && x.trungVi > 88);
const khongGY = lech.filter(x => !x.dmGoiY && !x.phuThuoc && Math.abs(x.trungViSau - 85) > 3);
ok(!khongGY.length, 'công đoạn lỏng (>88%): ' + lech.filter(x => x.dmGoiY).length + ' có gợi ý, ' + lech.filter(x => x.phuThuoc).length + ' phụ thuộc công đoạn chính, còn lại tự về mốc', khongGY.slice(0, 3));
const satGY = nhieu(r.ds.filter(x => x.nhan === 'sat' && x.dmGoiY));
ok(satGY.every(x => Math.abs(x.trungViSau - 85) <= 3), 'công đoạn đang sát 85% chỉ gợi ý khi công đoạn làm cùng ngày đổi kéo lệch (' + satGY.length + ' công đoạn), sau khi áp vẫn sát mốc', satGY.filter(x => Math.abs(x.trungViSau - 85) > 3).map(x => [x.tenCD, x.trungViSau]));
ok(r.ds.every(x => !x.dmGoiY || (x.dmGoiY < x.dinhMuc * 3.7 && x.dmGoiY > x.dinhMuc / 3.7)), 'không gợi ý đổi gần ×4 (công đoạn phụ để nguyên, ghi "phụ thuộc")');
ok(r.ds.every(x => !x.dmGoiY || x.dmGoiY > x.dinhMuc), 'chỉ gợi ý NÂNG, không gợi ý hạ (chặt thường do người mới đang đào tạo)', r.ds.filter(x => x.dmGoiY && x.dmGoiY < x.dinhMuc).slice(0, 3).map(x => [x.tenCD, x.dinhMuc, x.dmGoiY]));
ok(r.ds.filter(x => x.nhan === 'chat').every(x => !x.dmGoiY), 'công đoạn chặt giữ nguyên định mức');
ok(r.ds.every(x => !x.dmGoiY || (x.dmGoiY <= x.dinhMuc * 4 && x.dmGoiY >= x.dinhMuc / 4)), 'không gợi ý định mức vô lý (trong ×4 định mức đang dùng)');
const duKien = nhieu(r.ds.filter(x => x.dmGoiY));
ok(duKien.every(x => Math.abs(x.trungViSau - 85) <= 6), 'dự kiến sau khi áp (công đoạn ≥3 người có gợi ý): trung vị trong 79–91%', duKien.filter(x => Math.abs(x.trungViSau - 85) > 6).map(x => [x.tenCD, x.trungVi, x.trungViSau]));
r = c.__goi('phanTichDinhMuc', TP, 'thang', KY);
ok(r.ok && r.ds.every(x => x.maXuong === tp.MaXuong), 'trưởng phòng chỉ thấy công đoạn xưởng mình');

console.log('\n2. Áp toàn bộ gợi ý rồi phân tích lại');
const soCat = c.__goi('AP_DINH_MUC_CA_THANG');
ok(soCat > 0 && c.doc_('LichSuDinhMuc').every(x => c.ngayVN_(x.DenNgay) <= '2026-09-30'), 'AP_DINH_MUC_CA_THANG: ' + soCat + ' công đoạn đổi định mức trong tháng 10 giờ tính theo định mức đang dùng cả tháng');
const truoc = phanTich(c, T);
const ap = truoc.ds.filter(x => x.dmGoiY > 0).map(x => ({ maCD: x.maCD, dinhMucMoi: x.dmGoiY }));
r = c.__goi('banDieuHanhSuaDinhMucNhieu', T, ap, 'Thử theo gợi ý');
ok(r.ok && r.soSua === ap.length, 'đã sửa ' + (r.soSua || 0) + ' định mức', r);
const sau = phanTich(c, T);
const daSua = sau.ds.filter(x => ap.some(a => a.maCD === x.maCD));
const xa = nhieu(daSua).filter(x => Math.abs(x.trungVi - 85) > 6);
ok(!xa.length, 'phân tích lại (công đoạn ≥3 người đã sửa): trung vị trong 79–91% (' + nhieu(daSua).length + ' công đoạn)', xa.map(x => [x.tenCD, x.trungVi]));
const tren100 = sau.ds.filter(x => x.trungVi > 100 && !x.itNguoi && !x.phuThuoc);
ok(!tren100.length, 'không còn công đoạn nào (≥3 người) trung vị trên 100%', tren100.map(x => [x.tenCD, x.trungVi, x.soCoData]));
console.log('    (còn ' + sau.ds.filter(x => x.trungVi > 100).length + ' công đoạn >100% nhưng chỉ 1–2 người có dữ liệu hoặc phụ thuộc công đoạn chính)');
ok(daSua.every(x => Math.abs(x.trungViKy - x.trungVi) < 0.5), 'KPI tháng 10 tính theo định mức mới cho cả tháng (khớp số phân tích)', daSua.filter(x => Math.abs(x.trungViKy - x.trungVi) >= 0.5).slice(0, 3).map(x => [x.tenCD, x.trungVi, x.trungViKy]));
const ls = c.doc_('LichSuDinhMuc').filter(x => ap.some(a => a.maCD === x.MaCD));
ok(ls.every(x => c.ngayVN_(x.DenNgay) <= '2026-09-30'), 'lịch sử định mức của các công đoạn đã sửa không còn đoạn nào trong tháng 10', ls.filter(x => c.ngayVN_(x.DenNgay) > '2026-09-30').slice(0, 3));
ok(c.doc_('DinhMuc').filter(x => ap.some(a => a.maCD === x.MaCD)).every(x => c.ngayVN_(x.HieuLucTu) === '2026-10-01'), 'định mức mới ghi "hiệu lực từ" 01/10');
const kpi = c.__goi('layKPIKy', T, 'thang', KY, sau.ds[0].maXuong);
ok(kpi.ok && kpi.ds.length > 0, 'bảng KPI tháng 10 vẫn tính được sau khi áp');
const sep = c.__goi('layKPIKy', T, 'thang', '2026-09', sau.ds[0].maXuong);
const sepTruoc = tao(); const sep0 = sepTruoc.c.__goi('layKPIKy', sepTruoc.T, 'thang', '2026-09', sau.ds[0].maXuong);
ok(JSON.stringify(sep.ds) === JSON.stringify(sep0.ds), 'KPI tháng 9 không đổi');
const ph = truoc.ds.filter(x => x.phuThuoc).slice(0, 2).map(x => x.tenCD + ' (' + x.trungVi + '%)');
console.log('    ví dụ công đoạn phụ thuộc: ' + ph.join(', '));


console.log('\n3. Tháng đang làm đã bấm chốt giữa tháng: định mức mới vẫn áp cả tháng, Bảng KPI tự tính lại, không nhắc Chốt bù (22/10)');
({ c, T } = tao());
c.__goi('AP_DINH_MUC_CA_THANG');
c.them_('KPIThang', { Ky: KY, MaNV: 'NV_THU', HoTen: 'Thử', TongKPI: 80, ThoiDiemChot: new Date(), NguoiChot: 'Ban điều hành' });
ok(c.daChotChinhThuc_(KY), 'đã giả lập chốt chính thức tháng 10');
r = phanTich(c, T);
ok(r.apTu === '2026-10-01', 'tháng đã chốt: đổi định mức vẫn áp từ 01/10', r.apTu);
const mot = r.ds.filter(x => x.dmGoiY > 0 && x.soCoData >= 3)[0];
const nvMot = c.doc_('NhatKySanXuat').find(x => x.MaCD === mot.maCD && String(x.TrangThai).trim() === 'Đã chốt' && c.ngayVN_(x.Ngay) >= '2026-10-01').MaNV;
const xMot = c.doc_('NhanSu').find(n => n.MaNV === nvMot).MaXuong;
const kpiMot = () => c.__goi('layKPIKy', T, 'thang', KY, xMot).ds.find(o => o.MaNV === nvMot);
const k0 = kpiMot();
const kq1 = c.__goi('banDieuHanhSuaDinhMuc', T, mot.maCD, mot.dmGoiY, 'Thử tháng đã chốt');
const k1 = kpiMot();
ok(k0 && k1 && k1.sl < k0.sl - 0.01, 'tháng đang làm dù đã bấm chốt: Bảng KPI tính lại ngay theo định mức mới', [k0 && k0.sl, k1 && k1.sl]);
ok(kq1.ok && !/Chốt bù/.test(kq1.msg) && /tự tính lại/.test(kq1.msg), 'sửa 1 định mức: lời báo "tự tính lại", không bảo bấm Chốt bù', kq1.msg);
const hai = r.ds.filter(x => x.dmGoiY > 0 && x.maCD !== mot.maCD).slice(0, 3).map(x => ({ maCD: x.maCD, dinhMucMoi: x.dmGoiY }));
const kq2 = c.__goi('banDieuHanhSuaDinhMucNhieu', T, hai, 'Thử');
ok(kq2.ok && !/Chốt bù/.test(kq2.msg), 'sửa nhiều định mức: không nhắc Chốt bù', kq2.msg);
const sau3 = phanTich(c, T), x3 = sau3.ds.filter(x => x.maCD === mot.maCD)[0];
ok(Math.abs(x3.trungViKy - x3.trungVi) < 0.5 && c.doc_('LichSuDinhMuc').every(x => c.ngayVN_(x.DenNgay) <= '2026-09-30'), 'tháng đã chốt: KPI tháng 10 tính theo định mức mới cho cả tháng', [x3.trungVi, x3.trungViKy]);
({ c, T } = tao());
const kq3 = c.__goi('banDieuHanhSuaDinhMuc', T, mot.maCD, mot.dmGoiY, 'Thử tháng chưa chốt');
ok(kq3.ok && !/Chốt bù/.test(kq3.msg), 'tháng chưa chốt: lời báo không nhắc Chốt bù', kq3.msg);
console.log('\n' + (loi ? '✗ ' + loi + '/' + dem + ' kiểm tra lỗi' : '✓ Đạt cả ' + dem + ' kiểm tra'));
process.exit(loi ? 1 : 0);
