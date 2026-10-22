/**
 * Kiểm thử Kỹ năng (tests/ky-nang/): đề xuất – duyệt danh mục, gán 4 cấp, xác nhận, thu hồi, điểm, quyền xem.
 *   DATA=/đường/dẫn/csdl.json TZ=Asia/Ho_Chi_Minh node kpi-app/tests/ky-nang.js
 */
const path = require('path'), fs = require('fs');
const G = require('./gia-lap-kpi.js');
const DATA = process.env.DATA; if (!DATA) { console.log('Cần DATA='); process.exit(1); }
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? '  → ' + JSON.stringify(c).slice(0, 300) : '')); } };
const du = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const iDoi = du.TaiKhoan[0].indexOf('DoiMatKhauLanDau'); du.TaiKhoan.slice(1).forEach(x => { x[iDoi] = 'Không'; });
const c = G.tao(path.join(__dirname, '..', 'Code.gs'), du, '2026-10-22T17:00:00+07:00');
const TK = c.doc_('TaiKhoan').filter(t => t.TrangThai === 'Đang dùng');
const tp = TK.find(t => String(t.VaiTro).trim() === 'TP' && t.MaXuong && c.doc_('CongDoan').filter(x => x.MaXuong === t.MaXuong).length >= 3);
const X = tp.MaXuong, Ttp = c.__phienDai(tp);
const tp2 = TK.find(t => String(t.VaiTro).trim() === 'TP' && t.MaXuong && t.MaXuong !== X), Ttp2 = c.__phienDai(tp2);
const own = TK.find(t => String(t.VaiTro).trim() === 'OWNER'), Town = c.__phienDai(own);
const adm = TK.find(t => String(t.VaiTro).trim() === 'ADMIN'), Tadm = c.__phienDai(adm);
const cds = c.doc_('CongDoan').filter(x => x.MaXuong === X && String(x.TrangThai).trim() !== 'Ngừng').slice(0, 3).map(x => x.MaCD);
const cdKhac = c.doc_('CongDoan').find(x => x.MaXuong !== X && String(x.TrangThai).trim() !== 'Ngừng').MaCD;
const nvs = c.doc_('NhanSu').filter(x => x.MaXuong === X && x.TrangThai === 'Đang làm' && String(x.laTP).toUpperCase() !== 'TRUE' && x.MaNV !== tp.MaNV);
const nv = nvs[0], nv2 = nvs[1];
const tkCN = TK.find(t => String(t.VaiTro).trim() === 'CN' && t.MaNV === nv.MaNV) || TK.find(t => String(t.VaiTro).trim() === 'CN' && nvs.some(n => n.MaNV === t.MaNV));
const mau = { TenKN: 'Phun PU bóng đạt độ phủ đều', MaXuong: X, Nhom: 'Sơn', MoTa: 'Pha sơn PU theo tỉ lệ, phun lớp bóng cho thân cơ, xử lý chảy / rỗ.',
  TieuChi: '- Pha đúng tỉ lệ không cần nhắc\n- 10 cây liên tiếp không chảy, không rỗ\n- Đạt ≥ 80% định mức giờ\n- Đeo mặt nạ, găng đúng quy định', CongDoan: cds };
const kn = () => c.doc_('KyNang'), gn = () => c.doc_('KyNangNhanVien');
let r;

console.log('\n1. Đề xuất (trưởng / phó phòng ' + tp.TenDangNhap + ', xưởng ' + X + ')');
r = c.__goi('deXuatKyNang', Ttp, Object.assign({}, mau, { TenKN: 'Sơn' })); ok(!r.ok, 'tên quá ngắn: chặn', r);
r = c.__goi('deXuatKyNang', Ttp, Object.assign({}, mau, { TieuChi: 'chỉ một dòng' })); ok(!r.ok, 'ít hơn 2 tiêu chí: chặn', r);
r = c.__goi('deXuatKyNang', Ttp, Object.assign({}, mau, { CongDoan: [] })); ok(!r.ok, 'không có công đoạn liên quan: chặn', r);
r = c.__goi('deXuatKyNang', Ttp, Object.assign({}, mau, { CongDoan: [cdKhac] })); ok(!r.ok, 'công đoạn xưởng khác: chặn', r);
r = c.__goi('deXuatKyNang', Ttp, Object.assign({}, mau, { MaXuong: tp2.MaXuong })); ok(!r.ok, 'đề xuất cho xưởng khác: chặn', r);
r = c.__goi('deXuatKyNang', Ttp, mau); const K1 = r.MaKN;
ok(r.ok && kn().find(k => k.MaKN === K1).TrangThai === 'Chờ duyệt', 'đề xuất hợp lệ → Chờ duyệt', r);
const tc1 = JSON.parse(kn().find(k => k.MaKN === K1).TieuChi);
ok(tc1.length === 4 && tc1[0] === 'Pha đúng tỉ lệ không cần nhắc' && tc1[1].startsWith('10 cây'), 'tiêu chí tách dòng, bỏ gạch đầu dòng, GIỮ số đầu câu ("10 cây…")', tc1);
ok(JSON.stringify(c.knChuan_({ TenKN: 'Kiểm tra đầu nối ren', MaXuong: X, MoTa: 'Kiểm tra ren đầu nối bằng dưỡng.', TieuChi: '1. Dùng dưỡng đúng cỡ\n\n  \n2) 20 đầu liên tiếp đạt\n', CongDoan: cds }, { vaiTro: 'TP', xuong: X }).o.TieuChi) === JSON.stringify(JSON.stringify(['Dùng dưỡng đúng cỡ', '20 đầu liên tiếp đạt'])), 'bỏ số thứ tự "1." / "2)" nhưng giữ "20 đầu"');
r = c.__goi('deXuatKyNang', Ttp, Object.assign({}, mau, { TenKN: 'phun pu  BÓNG đạt độ phủ đều' })); ok(!r.ok && /cùng tên/.test(r.msg), 'trùng tên (khác hoa thường / dấu cách): chặn', r);
const cn0 = c.__phienDai(tkCN); ok(!c.__goi('deXuatKyNang', cn0, mau).ok, 'công nhân không đề xuất được');
r = c.__goi('ganKyNang', Ttp, { maNV: nv.MaNV, maKN: K1, cap: 1, ngayKiem: '2026-10-20' }); ok(!r.ok, 'chưa duyệt: không gán được', r);

console.log('\n2. Ban điều hành duyệt');
ok(!c.__goi('bdhDuyetKyNang', Ttp, K1, true, 'B').ok, 'trưởng phòng không tự duyệt');
r = c.__goi('bdhDuyetKyNang', Tadm, K1, true, ''); ok(!r.ok, 'duyệt mà chưa chọn trọng số: chặn', r);
r = c.__goi('bdhDuyetKyNang', Tadm, K1, false, ''); ok(!r.ok, 'trả lại không ghi lý do: chặn', r);
r = c.__goi('bdhDuyetKyNang', Tadm, K1, false, '', 'Tiêu chí 3 ghi rõ định mức'); ok(r.ok && kn().find(k => k.MaKN === K1).TrangThai === 'Trả lại', 'trả lại có lý do', r);
r = c.__goi('suaKyNang', Ttp, K1, Object.assign({}, mau, { TieuChi: mau.TieuChi.replace('≥ 80%', '≥ 80% định mức (8 cây/giờ)') }));
ok(r.ok && kn().find(k => k.MaKN === K1).TrangThai === 'Chờ duyệt', 'trưởng phòng sửa → về Chờ duyệt', r);
r = c.__goi('bdhDuyetKyNang', Tadm, K1, true, 'B'); const k1 = kn().find(k => k.MaKN === K1);
ok(r.ok && k1.TrangThai === 'Đã duyệt' && k1.TrongSo === 'B' && String(k1.PhienBan) === '1', 'duyệt + trọng số B', r);

console.log('\n3. Gán cho nhân viên ' + nv.MaNV);
r = c.__goi('ganKyNang', Ttp, { maNV: nv.MaNV, maKN: K1, cap: 2, tieuChiDat: [0, 1, 2], bangChung: 'Lô 2210, 10 cây', ngayKiem: '2026-10-20' });
ok(!r.ok && /tiêu chí/.test(r.msg), 'cấp 2 mà chưa đạt đủ tiêu chí: chặn', r);
r = c.__goi('ganKyNang', Ttp, { maNV: nv.MaNV, maKN: K1, cap: 2, tieuChiDat: [0, 1, 2, 3], bangChung: '', ngayKiem: '2026-10-20' }); ok(!r.ok && /bằng chứng/.test(r.msg), 'thiếu bằng chứng: chặn', r);
r = c.__goi('ganKyNang', Ttp, { maNV: nv.MaNV, maKN: K1, cap: 2, tieuChiDat: [0, 1, 2, 3], bangChung: 'Lô 2210, 10 cây', ngayKiem: '2026-12-01' }); ok(!r.ok, 'ngày kiểm sau hôm nay: chặn', r);
r = c.__goi('ganKyNang', Ttp2, { maNV: nv.MaNV, maKN: K1, cap: 1, ngayKiem: '2026-10-20' }); ok(!r.ok, 'trưởng phòng xưởng khác: chặn', r);
if (tp.MaNV) { r = c.__goi('ganKyNang', Ttp, { maNV: tp.MaNV, maKN: K1, cap: 1, ngayKiem: '2026-10-20' }); ok(!r.ok, 'tự gán cho mình: chặn', r); }
r = c.__goi('ganKyNang', Ttp, { maNV: nv.MaNV, maKN: K1, cap: 1, ngayKiem: '2026-10-01' }); ok(r.ok && !r.cho, 'cấp 1 Đang học: có hiệu lực ngay', r);
r = c.__goi('ganKyNang', Ttp, { maNV: nv.MaNV, maKN: K1, cap: 2, tieuChiDat: [0, 1, 2, 3], bangChung: 'Lô 2210, 10 cây đạt', ngayKiem: '2026-10-20' });
let ht = gn().filter(g => g.MaNV === nv.MaNV && g.MaKN === K1);
ok(r.ok && ht.filter(g => g.TrangThai === 'Đã xác nhận').length === 1 && ht.find(g => g.TrangThai === 'Đã xác nhận').Cap == 2 && ht.some(g => g.TrangThai === 'Thay thế'), 'cấp 2: hiệu lực ngay, dòng cũ chuyển "Thay thế" (giữ lịch sử)', ht.map(g => g.TrangThai));
ok(ht.find(g => g.TrangThai === 'Đã xác nhận').HetHan === '2028-10-20', 'hạn kiểm lại 24 tháng (2028-10-20)', ht.find(g => g.TrangThai === 'Đã xác nhận').HetHan);
r = c.__goi('ganKyNang', Ttp, { maNV: nv.MaNV, maKN: K1, cap: 3, tieuChiDat: [0, 1, 2, 3], bangChung: 'Lô 2221 – 30 cây, tự xử lý chảy sơn', ngayKiem: '2026-10-21' });
ok(r.ok && r.cho, 'trưởng phòng nâng cấp 3: chờ ban điều hành xác nhận', r);
ht = gn().filter(g => g.MaNV === nv.MaNV && g.MaKN === K1);
ok(ht.find(g => g.TrangThai === 'Đã xác nhận').Cap == 2, 'trong lúc chờ: vẫn tính cấp 2');
const G3 = ht.find(g => g.TrangThai === 'Chờ xác nhận').MaGN;
ok(!c.__goi('bdhXacNhanKyNang', Ttp, G3, true).ok, 'trưởng phòng không tự xác nhận');
ok(!c.__goi('bdhXacNhanKyNang', Tadm, G3, false, '').ok, 'từ chối không lý do: chặn');
r = c.__goi('bdhXacNhanKyNang', Tadm, G3, true, ''); ht = gn().filter(g => g.MaNV === nv.MaNV && g.MaKN === K1);
ok(r.ok && ht.filter(g => g.TrangThai === 'Đã xác nhận').length === 1 && ht.find(g => g.TrangThai === 'Đã xác nhận').Cap == 3, 'ban điều hành xác nhận → cấp 3', r);
r = c.__goi('ganKyNang', Ttp, { maNV: nv.MaNV, maKN: K1, cap: 2, tieuChiDat: [0, 1, 2, 3], bangChung: 'kiểm lại', ngayKiem: '2026-10-22' }); ok(!r.ok && /lý do/.test(r.msg), 'hạ cấp không lý do: chặn', r);

console.log('\n4. Điểm kỹ năng (mô phỏng)');
r = c.__goi('layKyNang', Ttp);
ok(r.ok && r.diem[nv.MaNV] === 3, 'cấp 3 × trọng số B: 2 × 1,5 = 3 điểm', r.diem && r.diem[nv.MaNV]);
c.__goi('ganKyNang', Tadm, { maNV: nv2.MaNV, maKN: K1, cap: 4, tieuChiDat: [0, 1, 2, 3], bangChung: 'BĐH kiểm trực tiếp', ngayKiem: '2026-10-22' });
r = c.__goi('layKyNang', Ttp); ok(r.diem[nv2.MaNV] === 4, 'ban điều hành gán thẳng cấp 4: 2 × 2 = 4 điểm', r.diem[nv2.MaNV]);
ok(r.gn.every(g => c.doc_('NhanSu').find(x => x.MaNV === g.MaNV).MaXuong === X), 'trưởng phòng chỉ thấy người xưởng mình');
const g2 = gn().find(g => g.MaNV === nv2.MaNV && g.TrangThai === 'Đã xác nhận'); const cuHan = g2.HetHan;
g2.HetHan = '2026-01-01'; c.xoaCache_ && c.xoaCache_('KyNangNhanVien');
c.suaO_('KyNangNhanVien', g2._row, 'HetHan', '2026-01-01'); c.xaGhi_();
r = c.__goi('layKyNang', Ttp); ok(!r.diem[nv2.MaNV] && r.gn.find(g => g.MaNV === nv2.MaNV).hetHan, 'quá hạn kiểm lại: không tính điểm, gắn cờ hết hạn', r.diem[nv2.MaNV]);
c.suaO_('KyNangNhanVien', g2._row, 'HetHan', cuHan); c.xaGhi_();

console.log('\n5. Sửa kỹ năng đã duyệt');
r = c.__goi('suaKyNang', Ttp, K1, Object.assign({}, mau, { TieuChi: mau.TieuChi + '\n- Vệ sinh súng phun cuối ca' }));
let kk = kn().find(k => k.MaKN === K1);
ok(r.ok && kk.TrangThai === 'Đã duyệt' && JSON.parse(kk.TieuChi).length === 4 && JSON.parse(kk.BanSua).TieuChi, 'bản sửa chờ duyệt, kỹ năng vẫn dùng nội dung cũ', r);
r = c.__goi('bdhDuyetKyNang', Tadm, K1, true, ''); kk = kn().find(k => k.MaKN === K1);
ok(r.ok && JSON.parse(kk.TieuChi).length === 5 && String(kk.PhienBan) === '2' && !kk.BanSua, 'duyệt bản sửa: áp nội dung mới, phiên bản tiêu chí 2', r);

console.log('\n6. Công nhân xem');
const Tcn = c.__phienDai(tkCN); r = c.__goi('layKyNang', Tcn);
ok(r.ok && r.quyen === 'cn' && r.gn.every(g => g.MaNV === tkCN.MaNV) && Object.keys(r.diem).length === 1, 'chỉ thấy kỹ năng + điểm của mình', r.diem);
ok(r.kn.every(k => k.TrangThai === 'Đã duyệt' && k.LyDo === undefined), 'chỉ thấy kỹ năng đã duyệt, không thấy ghi chú nội bộ');
ok(tkCN.MaNV === nv2.MaNV || (r.kem[K1] || []).length >= 1, 'biết ai trong xưởng "Kèm được" để hỏi học', r.kem);
ok(!c.__goi('ganKyNang', Tcn, { maNV: nv.MaNV, maKN: K1, cap: 1, ngayKiem: '2026-10-20' }).ok, 'công nhân không gán được');

console.log('\n7. Thu hồi / ngừng');
ok(!c.__goi('thuHoiKyNang', Ttp, nv.MaNV, K1, '').ok, 'thu hồi không lý do: chặn');
r = c.__goi('thuHoiKyNang', Ttp, nv.MaNV, K1, 'Lỗi chảy sơn lặp lại 3 lô'); ok(r.ok && !c.__goi('layKyNang', Ttp).diem[nv.MaNV], 'thu hồi: hết điểm', r);
ok(!c.__goi('ngungKyNang', Ttp, K1, 'x').ok, 'trưởng phòng không ngừng được kỹ năng đã duyệt');
r = c.__goi('ngungKyNang', Tadm, K1, ''); ok(!r.ok && /ghi lý do/.test(r.msg), 'đang có người được gán: phải ghi lý do ngừng', r);
r = c.__goi('ngungKyNang', Tadm, K1, 'Gộp vào kỹ năng phun sơn chung'); ok(r.ok && !c.__goi('layKyNang', Ttp).diem[nv2.MaNV], 'ngừng: không còn tính điểm', r);
r = c.__goi('deXuatKyNang', Town, Object.assign({}, mau, { TenKN: 'Đọc bản vẽ kỹ thuật', MaXuong: '*', CongDoan: [cds[0], cdKhac], TrongSo: 'A' }));
ok(r.ok && kn().find(k => k.MaKN === r.MaKN).TrangThai === 'Đã duyệt', 'ban điều hành thêm kỹ năng dùng chung (nhiều xưởng): duyệt ngay', r);
ok(c.__goi('layKyNang', Ttp2).kn.some(k => k.MaKN === r.MaKN) && !c.__goi('layKyNang', Ttp2).kn.some(k => k.MaKN === K1), 'xưởng khác thấy kỹ năng dùng chung, không thấy kỹ năng riêng xưởng ' + X);
const hr = TK.find(t => String(t.VaiTro).trim() === 'HR');
if (hr) { const Thr = c.__phienDai(hr); ok(c.__goi('layKyNang', Thr).ok && !c.__goi('ganKyNang', Thr, { maNV: nv.MaNV, maKN: r.MaKN, cap: 1, ngayKiem: '2026-10-20' }).ok, 'nhân sự: xem được, không gán được'); }

console.log('\n' + (dem - loi) + '/' + dem + ' đạt');
process.exit(loi ? 1 : 0);
