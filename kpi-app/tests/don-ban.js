/** Kiểm thử giai đoạn 1 – Bán hàng nhập đơn → duyệt → chép vào Sheet đơn (16/11 khuya, tests/don-ban/don-ban.gs)
 *   DATA=<csdl.json> TZ=Asia/Ho_Chi_Minh node kpi-app/tests/don-ban.js */
const path = require('path'), fs = require('fs'); const G = require('./gia-lap-kpi.js');
const DATA = process.env.DATA; if (!DATA) { console.log('Cần DATA='); process.exit(1); }
let n = 0, l = 0; const ok = (c, t, x) => { n++; if (!c) l++; console.log((c ? '  ✓ ' : '  ✗ ') + t + (c ? '' : ' → ' + String(JSON.stringify(x)).slice(0, 400))); };
const du = JSON.parse(fs.readFileSync(DATA, 'utf8'));
['DonHangChup', 'PhanLoaiSKU', 'CauHinhSP', 'BTPTheoSKU', 'DonUuTien'].forEach(k => { if (du[k]) du[k] = du[k].slice(0, 1); });
const iDoi = du.TaiKhoan[0].indexOf('DoiMatKhauLanDau'); du.TaiKhoan.slice(1).forEach(x => { x[iDoi] = 'Không'; });
const c = G.tao(path.join(__dirname, '..', 'Code.gs'), du, '2026-11-16T09:00:00+07:00');
const H = ['', 'Loại hàng cần sản xuất', 'Loại Phôi', 'Số lượng đặt', 'SX CÒN THIẾU', 'Deadline', 'CHÚ THÍCH CÁC BỘ PHẬN', 'Phôi của Phố', 'Sơn của Khoa', 'TỔNG SP CÓ THỂ GIAO'];
const OEM = [H, ['#A-01/11', 'GAY NOVA X1 MAU DO', '', 50, '=D2-0', '30/11', '', 20, 10, '=H2+I2']];
const KHO = [H, ['#K-03/11', 'NGON RHINO 12.4', '', 100, 100, '25/11', '', '', '', '']];
c.__ngoai = { [c.DH_SHEET_ID]: { ten: 'x', sheets: { OEM: OEM, KHO: KHO } } };
const TK = () => c.doc_('TaiKhoan').filter(t => t.TrangThai === 'Đang dùng'), ma = m => TK().find(t => String(t.MaNV).trim().toUpperCase() === m);
const P = t => t && c.__phienDai(t);
const own = P(TK().find(t => String(t.VaiTro).trim() === 'OWNER')), gd = P(ma('C019')), c077 = P(ma('C077'));
const tp = P(TK().find(t => /TP|PP/.test(t.VaiTro) && String(t.MaXuong) === 'SON'));
let r, x;

console.log('\n1. Tài khoản Bán hàng (chủ sở hữu)');
r = c.__goi('dsUngVienBH', gd); ok(!r.ok, 'Giám đốc (không phải chủ sở hữu) không xem danh sách ứng viên', r);
r = c.__goi('dsUngVienBH', own); const uv = r.ds || [];
ok(r.ok && uv.length >= 10 && uv.every(u => /Kinh doanh|Marketing/.test(u.boPhan)), 'chủ sở hữu thấy ứng viên Kinh doanh + Marketing (' + uv.length + ' người)', r.msg);
const goiY = uv.filter(u => u.goiY);
ok(goiY.length >= 5 && goiY.every(u => !/Thiết kế|Content|Quay/.test(u.nhom)), 'gợi ý tick sẵn ' + goiY.length + ' người: Kinh doanh + Sàn TMĐT / CSKH / Website (không có thiết kế, content, quay chụp)', goiY.map(u => u.nhom));
r = c.__goi('taoTaiKhoanBH', gd, { ds: ['C163'] }); ok(!r.ok, 'Giám đốc không tạo được tài khoản', r);
const chon = goiY.slice(0, 3).map(u => u.maNV);
r = c.__goi('taoTaiKhoanBH', own, { ds: chon.concat(['C019', 'X1']) });
ok(r.ok && r.ds.length === 3 && r.ds.every(z => z.tk === z.maNV.toLowerCase() && z.mk.length >= 8) && r.boQua.length === 2, 'tạo 3 tài khoản BH (tên đăng nhập = mã NV), mật khẩu tạm; bỏ qua C019 + mã lạ (không thuộc KD/MKT)', r);
const bh1 = ma(chon[0]), bh2 = ma(chon[1]);
ok(bh1 && bh1.VaiTro === 'BH' && bh1.DoiMatKhauLanDau === 'Có', 'tài khoản mới: vai trò BH, phải đổi mật khẩu lần đầu', bh1);
r = c.__goi('taoTaiKhoanBH', own, { ds: [chon[0]] }); ok(r.ok && r.ds.length === 0 && /đã có tài khoản/.test(r.boQua[0]), 'tạo lại người đã có tài khoản → bỏ qua', r);
const shTK = c.ss_().getSheetByName('TaiKhoan'), hTK = shTK.rows[0], iD2 = hTK.indexOf('DoiMatKhauLanDau'), iV2 = hTK.indexOf('VaiTro');
r = c.__goi('napDuLieu', c.__phienDai(bh1)); ok(!r || r.ok !== true || r.phaiDoiMK, 'BH chưa đổi mật khẩu tạm → chưa vào được dữ liệu', r && [r.ok, r.phaiDoiMK]);
shTK.rows.forEach((row, i) => { if (i && row[iV2] === 'BH') row[iD2] = 'Không'; }); c.xoaCache_('TaiKhoan');
const B1 = P(ma(chon[0])), B2 = P(ma(chon[1]));

console.log('\n2. Bán hàng bị chặn ở mọi hàm khác');
r = c.__goiTho('napDuLieu', B1); const nap = typeof r === 'string' ? JSON.parse(r) : r;
ok(nap && nap.ok && nap.me.vaiTro === 'BH' && !(nap.nhansu || []).length && !(nap.nhatky || []).length, 'napDuLieu: BH đăng nhập được, gói rỗng (không KPI, nhân sự, nhật ký)', nap && Object.keys(nap));
['layDonHangXuong', 'layThongKe', 'huyBotDon', 'duyetDonBan', 'dsUngVienBH', 'demDonBanCho', 'layQuyTrinh', 'danhSachVanPhong'].forEach(f => { r = c.__goi(f, B1, {}); ok(!r || r.ok !== true, 'BH gọi ' + f + ' → bị chặn', r); });
['napComTrua', 'layBongDa', 'layKPIKy', 'layThongKe'].forEach(f => { r = c.__goi(f, B1); ok(r && r.ok === false && !r.hetHan && r.bhChan === 1, '21/11: BH gọi ' + f + ' → bị chặn nhưng KHÔNG báo hết phiên (không bị đăng xuất)', r); });
r = c.__goi('layDonBan', B1); ok(r.ok, '…và ngay sau đó vẫn vào trang Đơn hàng của tôi bình thường', r.msg);
r = c.__goi('layManhGiaoDien', B1, 'QuyTrinh'); ok(!r.ok, 'BH không tải được mảnh Đơn hàng / Quy trình', r);
r = c.__goi('layDonBan', tp); ok(r.ok && r.xem === 1 && r.ds.length === 0, '23/11: TP Sơn vào Order-Flow chế độ CHỈ XEM – không thấy đơn Bán hàng gửi', r);
r = c.__goi('layDonBan', c077); ok(!r.ok, 'C077 không vào (không có quyền duyệt)', r);

console.log('\n3. Bán hàng gửi đơn');
r = c.__goi('layDonBan', B1);
ok(r.ok && r.bh === 1 && r.duyet === 0 && r.ds.length === 0 && r.kenh.some(k => k[0] === 'OEM') && r.sp.indexOf('GAY NOVA X1 MAU DO') >= 0 && !r.tongThieu, 'BH mở trang: kênh + danh mục tên SP, không thấy tổng tồn xưởng', r);
const D = (x) => Object.assign({ maDon: '#BH1-16/11', tab: 'OEM', dl: '2026-12-10', ghiChu: 'Khách VIP', dong: [{ ten: 'GAY NOVA X1 MAU DO', sl: 5, gc: 'tip 12.5' }, { ten: 'GAY MOI CHUA CO', sl: '1.000' }], lenh: 'bh1test01' }, x);
[[{ maDon: '' }, 'thiếu mã'], [{ maDon: '=HACK()' }, 'mã bắt đầu ='], [{ tab: 'ĐẾN HẠN 10 NGÀY' }, 'tab 10 ngày'], [{ tab: 'HT-2026' }, 'tab HT'], [{ tab: 'BIA' }, 'tab lạ'], [{ dl: '2026-02-30' }, 'ngày sai'], [{ dl: '2026-11-01' }, 'deadline đã qua'],
 [{ dong: [] }, 'không có dòng'], [{ dong: [{ ten: 'X', sl: 0 }] }, 'SL 0'], [{ dong: [{ ten: 'X', sl: 2.5 }] }, 'SL lẻ'], [{ dong: [{ ten: 'X', sl: -3 }] }, 'SL âm'], [{ dong: [{ ten: '=IMPORTXML("x")', sl: 1 }] }, 'tên SP bắt đầu ='],
 [{ dong: Array.from({ length: 51 }, (_, i) => ({ ten: 'SP' + i, sl: 1 })) }, '51 dòng'], [{ maDon: '#A-01/11' }, 'mã đã có trong Sheet']].forEach(([o, t]) => { r = c.__goi('luuDonBan', B1, D(Object.assign({ lenh: null }, o))); ok(!r.ok, 'chặn: ' + t, r); });
r = c.__goi('luuDonBan', B1, D()); const r2 = c.__goi('luuDonBan', B1, D());
const ssH = c.SpreadsheetApp.openById(c.PropertiesService.getScriptProperties().getProperty('DH_CSDL_ID'));
ok(r.ok && r2.ok && r.id === r2.id && ssH.getSheetByName('DonBan').getLastRow() === 2, 'gửi đơn; bấm 2 lần cùng mã yêu cầu → 1 đơn (tab DonBan trong Sheet CSDL Đơn hàng)', [r, r2]);
const id1 = r.id;
r = c.__goi('luuDonBan', B2, D({ lenh: 'bh2test01' })); ok(!r.ok && /đã có trên web/.test(r.msg), 'BH khác gửi trùng mã đơn + kênh → chặn', r);
r = c.__goi('layDonBan', B1); x = r.ds[0];
ok(x && x.tt === 'CHO_DUYET' && x.tongSL === 1005 && x.dong[1].sl === 1000 && x.ghiChu === 'Khách VIP', 'đơn chờ duyệt, "1.000" đọc thành 1000, tổng 1005', x);
ok(c.__goi('layDonBan', B2).ds.length === 0, 'BH khác không thấy đơn này');
r = c.__goi('xoaDonBan', B2, { id: id1 }); ok(!r.ok, 'BH khác không xóa được', r);
r = c.__goi('luuDonBan', B2, D({ id: id1, maDon: '#BH2', lenh: 'bh2test02' })); ok(!r.ok, 'BH khác không sửa được', r);
r = c.__goi('demDonBanCho', gd); ok(r.ok && r.n === 1, 'Giám đốc: 1 đơn chờ duyệt (Việc hôm nay)', r);
r = c.__goi('layDonBan', gd); ok(r.ok && r.duyet === 1 && r.ds.length === 1 && r.tongThieu > 0, 'Giám đốc thấy mọi đơn + tổng hàng xưởng còn thiếu', r.tongThieu);

console.log('\n4. Trả về → sửa → gửi lại → duyệt');
r = c.__goi('duyetDonBan', B1, { id: id1, hanh: 'DUYET', dl: '2026-12-10' }); ok(!r.ok, 'BH không tự duyệt được', r);
r = c.__goi('duyetDonBan', gd, { id: id1, hanh: 'TRA_VE', lyDo: '' }); ok(!r.ok, 'trả về phải ghi lý do', r);
r = c.__goi('duyetDonBan', gd, { id: id1, pb: 1, hanh: 'TRA_VE', lyDo: 'Ghi rõ màu gậy mới' }); ok(r.ok, 'Giám đốc trả về', r);
x = c.__goi('layDonBan', B1).ds[0]; ok(x.tt === 'TRA_VE' && x.ly === 'Ghi rõ màu gậy mới' && x.duyetAi, 'BH thấy "trả về" + lý do + ai trả', x);
r = c.__goi('duyetDonBan', gd, { id: id1, hanh: 'DUYET', dl: '2026-12-10' }); ok(!r.ok && r.cu, 'không duyệt được đơn đang trả về', r);
r = c.__goi('luuDonBan', B1, D({ id: id1, pb: 1, dong: [{ ten: 'GAY NOVA X1 MAU DO', sl: 5, gc: 'tip 12.5' }, { ten: '=GAY MOI MAU XANH', sl: 3 }], lenh: 'bh1test02' }));
ok(!r.ok, 'sửa: tên SP "=…" vẫn bị chặn', r);
r = c.__goi('luuDonBan', B1, D({ id: id1, pb: 1, dong: [{ ten: 'GAY NOVA X1 MAU DO', sl: 5, gc: 'tip 12.5' }, { ten: 'GAY MOI MAU XANH', sl: 3, gc: '+ khắc tên' }], lenh: 'bh1test03' }));
x = c.__goi('layDonBan', B1).ds[0]; ok(r.ok && x.tt === 'CHO_DUYET' && x.pb === 2 && x.tongSL === 8, 'BH sửa + gửi lại → chờ duyệt, phiên bản 2', [r, x]);
r = c.__goi('duyetDonBan', gd, { id: id1, pb: 1, hanh: 'DUYET', dl: '2026-12-08', uu: 1 }); ok(!r.ok && r.cu, 'duyệt theo bản cũ (pb 1) → báo tải lại', r);
r = c.__goi('duyetDonBan', gd, { id: id1, pb: 2, hanh: 'DUYET', dl: '' }); ok(!r.ok, 'duyệt phải chốt deadline', r);
r = c.__goi('duyetDonBan', gd, { id: id1, pb: 2, hanh: 'DUYET', dl: '2026-12-08', uu: 1, lenh: 'gdduyet01' });
const r3 = c.__goi('duyetDonBan', gd, { id: id1, pb: 2, hanh: 'DUYET', dl: '2026-12-08', uu: 1, lenh: 'gdduyet01' });
ok(r.ok && r3.ok && OEM.length === 4, 'duyệt: ghi 2 dòng vào cuối tab OEM; bấm 2 lần không ghi 2 lần', [r, r3, OEM.length]);
ok(OEM[2][0] === '#BH1-16/11' && OEM[2][1] === 'GAY NOVA X1 MAU DO' && OEM[2][3] === 5 && /^'?08\/12\/2026$/.test(OEM[2][5]) && /tip 12.5 · Đơn: Khách VIP/.test(OEM[2][2]), 'dòng 1: mã đơn, tên, SL 5, deadline 08/12/2026, note = ghi chú dòng + ghi chú đơn', OEM[2]);
ok(OEM[3][1] === 'GAY MOI MAU XANH' && OEM[3][3] === 3 && !String(OEM[3][2]).startsWith('#CONG_THUC') && /khắc tên/.test(OEM[3][2]), 'dòng 2: ghi chú "+ khắc tên" ghi dạng chữ (không thành công thức)', OEM[3]);
ok(/=D2-0/.test(String(OEM[2][4])) && /=H2\+I2/.test(String(OEM[2][9])) && OEM[2][7] === '' && OEM[2][8] === '', 'cột SX CÒN THIẾU + CÓ THỂ GIAO chép công thức của dòng mẫu; cột bộ phận để trống', OEM[2]);
r = c.__goi('duyetDonBan', c.__phienDai(ma('C067')), { id: id1, pb: 2, hanh: 'DUYET', dl: '2026-12-08', lenh: 'kldup001' }); ok(!r.ok && r.cu && /đã duyệt/.test(r.msg), 'người thứ 2 duyệt lại → báo "đã duyệt bởi …", không ghi thêm', r);
ok(c.doc_('DonUuTien').some(u => String(u.Khoa).replace(/^'/, '') === '#BH1-16/11|OEM'), '★ ưu tiên cả đơn được gắn (cùng chỗ nút ★ bảng đơn)');
r = c.__goi('xoaDonBan', B1, { id: id1 }); ok(!r.ok, 'BH không xóa được đơn đã duyệt', r);
r = c.__goi('layDonHangXuong', own, true); x = r.don.filter(o => o.maDon === '#BH1-16/11');
ok(x.length === 2 && x[0].dl === '2026-12-08' && x[0].thieu >= 0, 'bảng đơn đọc ngay 2 dòng mới (deadline 08/12)', x.map(o => [o.ten, o.sl, o.thieu, o.dl]));

console.log('\n5. Tiến độ cho Bán hàng');
OEM[2][4] = 2; OEM[3][4] = 3; c.dhDocDonGoc_(true);   // Sheet: bộ phận đã trả 3 cây (làm mới bộ nhớ tạm như nút Làm mới)
x = c.__goi('layDonBan', B1).ds[0]; ok(x.tt === 'DA_DUYET' && x.dlChot === '2026-12-08' && x.uu === 1 && x.td && x.td.sl === 8 && x.td.thieu === 5 && x.td.pct === 38, 'đơn đã duyệt: deadline chốt, ★, xong 3/8 = 38%', x.td);
r = c.__goi('huyBotDon', gd, { loai: 'HUY', tab: 'OEM', dong: 4, ten: 'GAY MOI MAU XANH', maDon: '#BH1-16/11', lyDo: 'Khách bỏ mã này', lenh: 'huybh0001' });
x = c.__goi('layDonBan', B1).ds[0]; ok(r.ok && x.td.huy.length === 1 && x.td.huy[0].loai === 'HUY' && x.td.sl === 5, 'mã bị hủy trên bảng đơn → Bán hàng thấy trong tiến độ đơn', [r, x.td]);

console.log('\n6. Xóa đơn chưa duyệt, từ chối');
r = c.__goi('luuDonBan', B2, D({ maDon: '#BH2-16/11', tab: 'KHO', dong: [{ ten: 'NGON RHINO 12.4', sl: 10 }], lenh: 'bh2test03' })); const id2 = r.id;
r = c.__goi('duyetDonBan', gd, { id: id2, pb: 1, hanh: 'TU_CHOI', lyDo: 'Kho đang đủ hàng' }); ok(r.ok && c.__goi('layDonBan', B2).ds[0].tt === 'TU_CHOI', 'từ chối có lý do', r);
r = c.__goi('xoaDonBan', B2, { id: id2 }); ok(r.ok && c.__goi('layDonBan', B2).ds.length === 0, 'BH xóa đơn bị từ chối của mình', r);
ok(KHO.length === 2, 'đơn bị từ chối không ghi gì vào Sheet');

console.log('\n' + (l ? '✗ ' + l + ' / ' + n + ' lỗi' : '✓ Đạt ' + n + ' / ' + n));
process.exit(l ? 1 : 0);
