/**
 * Kiểm thử Đơn hàng → xưởng (tests/quy-trinh/don-hang.gs): phân loại SKU 4 thông số, đọc Sheet đơn (chỉ đọc), sửa tay, quyền chỉ OWNER.
 *   DATA=<csdl.json> [DH=<dh.json: các tab Sheet "Trạng thái đơn hàng">] TZ=Asia/Ho_Chi_Minh node kpi-app/tests/don-hang.js
 */
const path = require('path'), fs = require('fs');
const G = require('./gia-lap-kpi.js');
const DATA = process.env.DATA; if (!DATA) { console.log('Cần DATA='); process.exit(1); }
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? '  → ' + JSON.stringify(c).slice(0, 300) : '')); } };
const du = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const iDoi = du.TaiKhoan[0].indexOf('DoiMatKhauLanDau'); du.TaiKhoan.slice(1).forEach(x => { x[iDoi] = 'Không'; });
const c = G.tao(path.join(__dirname, '..', 'Code.gs'), du, '2026-10-31T17:00:00+07:00');
const TK = c.doc_('TaiKhoan').filter(t => t.TrangThai === 'Đang dùng'), vt = v => TK.find(t => String(t.VaiTro).trim() === v);
const Town = c.__phienDai(vt('OWNER')), Tadm = c.__phienDai(vt('ADMIN'));
const PL = (ten, gc) => c.plPhanLoai_(ten, gc || '', null);
const la = (p, o) => Object.keys(o).every(k => p[k] === o[k]);
let r;

console.log('\n1. Phân loại – các ca app thử (Qoder) gán sai');
[
  ['Evo Luna Maxbing Edition - Malachite Eclipse', '', { loai: 'GAY', dong: 'EVO4', ren: 'R3810' }],
  ['Evo Luna Maxbing Edition - Malachite Eclipse', 'CHỈ ĐẶT NỐI', { loai: 'NOI' }],
  ['Combo MAXBING Evo Meg - ABYSS BLADE', '', { dong: 'EVO5', chuoi: 'GF740', ren: 'R51618' }],
  ['Combo MAXBING Evo Crown - ANCIENT OAK', '', { dong: 'EVO2', chuoi: 'GF736HK', ngon: 'MIX' }],
  ['NGỌN NHẢY HORNET', '', { loai: 'NGON', chuoi: 'KHONG', ngon: 'NHAY139' }],
  ['RHI2-C30PT21.5/11.8/18', '', { loai: 'NGON', ngon: 'FC', ren: 'R51618', dau: '11.8' }],
  ['RHI2-C30PT21.5/12.4/QLOC', '', { loai: 'NGON', ren: 'QLOC', dau: '12.4' }],
  ['GẬY NHẢY TK ALL NEW MÀU ĐỎ-13.9 REN 3/8-8', '', { dong: 'TKNHAY', chuoi: 'NHAY390' }],
  ['GẬY PHÁ TK sport MÀU XANH', '', { dong: 'EVOX', tip: 'BAK' }],
  ['Rhino - 30" / 3/8-10 Carbon Pool Cue Single Shaft - 11.8', '', { loai: 'NGON', ren: 'R3810', dau: '11.8', tin: 'xanh' }],
  ['Gậy Đánh Rhino - Bia Hơi', '', { dong: 'BEER', chuoi: 'MIXCB' }]
].forEach(([t, g, mong]) => { const p = PL(t, g); ok(la(p, mong), t + (g ? ' [' + g + ']' : '') + ' → ' + JSON.stringify(mong), p); });

console.log('\n2. Phân loại – 4 thông số, tên gọi, ghi chú đơn');
let p = PL('EVO4/LUN2/BLUE/LW-BLACK/G/10/12.5');
ok(la(p, { loai: 'GAY', dong: 'EVO4', chuoi: 'GF736HK', ngon: 'GF29', tip: 'TIMEK', ren: 'R3810', dau: '12.5', tay: 'DA', tin: 'xanh' }), 'mã SKU EVO4 đọc đủ 4 thông số + đầu + tay', p);
p = PL('Nebula 2 Pool Cue - Charcoal Gray - Sport Wrap - 12.4 mm', '_Joint: 5/16-14 _Tip: TIME CRYSTAL 1');
ok(p.dong === 'NEBULA' && p.chuoi === 'MIXCB25' && p.ren === 'R51614' && p.tip === 'TIME3', 'tay da sport → chuôi vách 2.5; ren / tip theo ghi chú đơn ("_Joint:")', p);
p = PL('CUEBOTS CUE - CGP2'); ok(p.dong === 'CBCGP' && p.ren === 'UNI', 'CGP → Uniloc (không nhầm sang CGW ren 3/8-10)', p);
p = PL('CB-ZW/ZW1/29C/NW/388/12.5'); ok(p.dong === 'CBZW' && p.tin === 'xanh', 'mã CB-ZW/ZW1 nhận đúng (tên gọi kết thúc bằng "/")', p);
p = PL('RHI2-KOMET2/BRE/BLUE/13.0/388'); ok(p.dong === 'KOMET' && p.ngon === 'FCPHA', 'RHI2-KOMET2 (số liền sau tên gọi)', p);
p = PL('PHÁ NHẢY EVO VAL1'); ok(p.dong === 'EVOVAL', '"VAL1" vẫn nhận ra dòng VAL', p);
p = PL('Gậy Đánh Evo Lửa Việt - Ngọn Carbon'); ok(p.dong === 'VIETNAM' && p.tin === 'vang', 'tên gọi dài nhất thắng ("Lửa Việt" hơn "EVO"); dòng chưa chắc → vàng', p);
p = PL('KOMET BREAK SHAFT - 13.0 3/8-8'); ok(p.loai === 'NGON' && p.dong === 'NG-KOMET' && p.ngon === 'FCPHA' && p.dau === '13.0', 'ngọn phá KOMET lẻ → dòng NG-KOMET, đầu 13.0', p);
p = PL('Rhino Retro Pool Cue Butt - Black'); ok(p.loai === 'CHUOI' && p.dong === 'CH-RETRO' && p.chuoi === 'MIXCB', 'chuôi Retro lẻ → CH-RETRO (không lẫn chuôi Must)', p);
p = PL('CB-ZW/ZW1/29C/NW/388'); ok(p.dau === '12.5', 'thiếu cỡ đầu → lấy cỡ mặc định của dòng (ZW 12.5)', p);
p = PL('Gậy ABC hoàn toàn lạ'); ok(p.tin === 'do' && !p.dong,'tên lạ → đỏ, không đoán', p);
p = PL('Rhino Soft Cue Case 1X2 - Black'); ok(p.loai === 'PK', 'bao cơ → phụ kiện (không sản xuất)', p);
p = PL('RHINO RETRÔ BOCOTE Extension - 8-Inch'); ok(p.loai === 'NOI', 'tay nối', p);
p = PL('LUMINAX Cue Butt - JET BLACK (wrapless)', '_Joint Type: 3/8-10 chỉ gửi chuôi'); ok(p.loai === 'CHUOI' && p.ren === 'R3810' && p.ngon === 'KHONG', 'chuôi bán lẻ: không có ngọn, ren theo ghi chú', p);
p = c.plPhanLoai_('Gậy ABC hoàn toàn lạ', '', { LoaiHang: 'GAY', Dong: 'EVO1', Chuoi: 'GF736HK', Ngon: 'MIX', Tip: 'TIMEK', Ren: 'R388' });
ok(p.nguon === 'duyet' && p.dong === 'EVO1' && p.tin === 'xanh', 'có bản sửa tay → dùng bản sửa', p);

p = PL('EVO4/LUN2/BLUE/LW-BLACK/G/10/12.5'); ok(p.kieu === 'DANH' && p.vl === 'GF', 'EVO 4: gậy đánh, ngọn glassfiber', p);
p = PL('PHÁ NHẢY EVO VAL1'); ok(p.kieu === 'PHANHAY' && p.vl === 'MIX', 'Valkyrie: phá nhảy (nhóm riêng), ngọn mix', p);
p = PL('RHI2-KOMET2/BRE/BLUE/13.0/388'); ok(p.kieu === 'PHA' && p.vl === 'FC', 'KOMET: phá, full carbon', p);
p = PL('Rhino Retro Pool Cue Butt - Black'); ok(p.kieu === 'DANH' && p.vl === 'MIX', 'chuôi lẻ: chất liệu theo chuôi', p);

console.log('\n3. Đọc Sheet đơn (chỉ đọc) + quyền');
const tab = [['', 'NOTE…'], ['', 'Loại hàng cần sản xuất', 'Loại Phôi', 'Số lượng đặt', 'SX CÒN THIẾU', 'Deadline', 'CHÚ THÍCH CÁC BỘ PHẬN', 'Phôi của Phố', 'Ngày hẹn trả', 'Sơn của Khoa', 'Hỏng cần làm bù', 'UV của Doanh', 'Hoàn thiện của Thịnh', 'Tổng cộng hàng ĐG nhận từ HT'],
  ['#A-01/10', 'EVO4/LUN2/COMBOMAX', '', 100, 60, '20/11', '', '', '', 50, 3, '', '', 40],
  ['', 'Rhino - 30" / 3/8-8 Carbon Pool Cue Single Shaft - 12.5', '_Joint: Q-loc', 10, 10, new Date('2026-12-10T00:00:00+07:00'), '', 'chờ phôi', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['#B-02/10', 'Rhino Soft Cue Case 1X2 - Black', '', 5, 0, '', '', '', '', '', '', '', '', '']];
c.__ngoai = { [c.DH_SHEET_ID]: { ten: 'Trạng thái đơn hàng', sheets: { KHO: tab } } };
r = c.__goi('layDonHangXuong', Tadm, true); ok(r.ok && r.q && !r.q.sua.length, 'ban điều hành xem được Đơn hàng, không ghi (14/11)', r && r.q);
r = c.__goi('layDonHangXuong', 'sai', true); ok(!r.ok && r.hetHan, 'phiên sai bị chặn', r);
r = c.__goi('layDonHangXuong', Town, true);
ok(r.ok && r.don.length === 3, 'đọc 3 dòng đơn (bỏ dòng trống)', r.don && r.don.map(o => o.ten));
const d0 = r.don[0], d1 = r.don[1];
ok(d0.maDon === '#A-01/10' && d0.sl === 100 && d0.thieu === 60 && d0.dl === '2026-11-20' && d0.qua.SON === 50 && d0.hong.SON === 3 && d0.qua.DG === 40 && !('PHOI' in d0.qua), 'cột theo tiêu đề: SL, thiếu, deadline dd/mm, đã qua Sơn / ĐG, hỏng làm bù; ô trống = chưa ghi', d0);
ok(d1.maDon === '#A-01/10' && !('PHOI' in d1.qua) && d1.dl === '2026-10-12' && d1.pl.ren === 'QLOC', 'dòng con lấy mã đơn dòng trên; "chờ phôi" không thành số; ngày bị Sheet đảo (10/12) đọc lại 12/10; ren theo "Loại phôi"', d1);
ok(r.nhan && r.nhan.chuoi.GF736HK && r.nhan.dong.length > 40, 'trả kèm từ điển nhãn 4 thông số + dòng gậy');
c.__ngoai = {};
r = c.__goi('layDonHangXuong', Town, false); ok(r.ok && r.don.length === 3, 'lần sau lấy từ bộ nhớ tạm (không mở lại Sheet)');
r = c.__goi('layDonHangXuong', Town, true); ok(!r.ok && /Trạng thái đơn hàng/.test(r.msg), 'mất quyền vào Sheet đơn → báo lỗi dễ hiểu', r);
c.__ngoai = { [c.DH_SHEET_ID]: { ten: 'x', sheets: { KHO: tab } } };

console.log('\n3b. Tab Đơn hàng: cột thêm + bản chụp hằng ngày + thay đổi');
r = c.__goi('layDonHangXuong', Town, true);
ok(r.don[0].nguoiDat === 'A' && r.don[0].ngayDat === '2026-10-01' && r.don[0].phoi === '' && r.don[1].phoi === '_Joint: Q-loc', 'mã đơn "#A-01/10" → người đặt A, ngày đặt 01/10; tách cột loại phôi', r.don.slice(0, 2).map(o => [o.nguoiDat, o.ngayDat, o.phoi]));
ok(r.don[1].dl === '2026-10-12', 'deadline sau ngày đặt giữ năm nay', r.don[1].dl);
r = c.__goi('layThayDoiDon', Tadm); ok(!r.ok, 'ban điều hành không xem được thay đổi đơn');
r = c.__goi('layThayDoiDon', Town);
ok(r.ok && !r.truoc && r.daChup && c.doc_('DonHangChup').length >= 1, 'lần đầu: chưa có mốc so sánh, tự chụp bản hôm nay vào sheet DonHangChup (file KPI)', r);
r = c.__goi('layThayDoiDon', Town); ok(r.ok && !r.daChup, 'mở lại trong ngày: không chụp thêm');
ok(c.chupDonHangHangNgay_() === undefined && c.doc_('DonHangChup').length === 1, 'trigger 9h: đã có bản hôm nay thì bỏ qua');
// giả lập: bản chụp là của hôm qua, hôm nay Sheet đơn đổi
const shC = c.ss_().getSheetByName('DonHangChup'); shC.getRange(2, 1).setValue('2026-10-30');
const tab2 = tab.map(rw => rw.slice()); tab2[2][4] = 45; tab2.push(['#C-30/10', 'EVO1/BEAST', '', 20, 20, '05/11', '', '', '', '', '', '', '', '']);
c.__ngoai = { [c.DH_SHEET_ID]: { ten: 'x', sheets: { KHO: tab2 } } }; c.dhDocDon_(true);
r = c.__goi('layThayDoiDon', Town);
const loai = r.thay.map(x => x.loai + (x.chieu ? ':' + x.chieu : ''));
ok(r.ok && r.truoc === '2026-10-30' && loai.includes('thieu:giam') && loai.includes('moi') && r.daChup, 'so với bản hôm qua: thấy "còn thiếu giảm" + "dòng mới"; chụp bản hôm nay', loai);
ok(r.lichSu.length === 1 && r.lichSu[0][0] === '2026-10-30', 'trả lịch sử tổng còn thiếu theo ngày (để vẽ xu hướng)', r.lichSu);
c.__ngoai = { [c.DH_SHEET_ID]: { ten: 'x', sheets: { KHO: tab } } }; c.dhDocDon_(true);
ok(String(c.ss_().getSheetByName('DonHangChup').rows[1][2]).startsWith('~'), 'bản chụp: mảnh dữ liệu bắt đầu bằng "~" (không thành công thức)');
ok(c.dhKhoaDs_([{ maDon: 'A', ten: 'X|Y', tab: 'KHO' }, { maDon: 'A', ten: 'X|Y', tab: 'KHO' }]).join() === 'A|X/Y|KHO,A|X/Y|KHO#2', 'dòng trùng mã + tên được đánh số, ký tự "|" trong tên không làm lệch khóa');

console.log('\n4. Sửa tay phân loại');
r = c.__goi('luuPhanLoaiSKU', Tadm, { ten: 'X', loai: 'GAY' }); ok(!r.ok, 'ban điều hành không sửa được');
r = c.__goi('luuPhanLoaiSKU', Town, { ten: 'EVO4/LUN2/COMBOMAX', loai: 'GAY', dong: 'EVO4', chuoi: 'XYZ', ngon: 'GF29', tip: 'TIMEK', ren: 'R3810' }); ok(!r.ok, 'giá trị lạ bị chặn', r);
r = c.__goi('luuPhanLoaiSKU', Town, { ten: 'EVO4/LUN2/COMBOMAX', loai: 'GAY', dong: '__proto__', chuoi: 'GF736HK', ngon: 'GF29', tip: 'TIMEK', ren: 'R3810' }); ok(!r.ok, 'dòng tên đặc biệt bị chặn', r);
r = c.__goi('luuPhanLoaiSKU', Town, { ten: 'EVO4/LUN2/COMBOMAX', loai: 'GAY', dong: 'EVO4', chuoi: 'GF740', ngon: 'GF29', tip: 'TIMEK', ren: 'R3810', ghiChu: '=1+1' });
ok(r.ok, 'lưu sửa tay', r);
r = c.__goi('layDonHangXuong', Town, false);
ok(r.don[0].pl.nguon === 'duyet' && r.don[0].pl.chuoi === 'GF740', 'áp ngay cho đơn cùng tên (không cần đọc lại Sheet đơn)', r.don[0].pl);
ok(String(c.doc_('PhanLoaiSKU')[0].GhiChu).startsWith("'"), 'ghi chú "=" không thành công thức');
c.__goi('luuPhanLoaiSKU', Town, { ten: 'EVO4/LUN2/COMBOMAX', loai: 'GAY', dong: 'EVO4', chuoi: 'GF736HK', ngon: 'GF29', tip: 'TIMEK', ren: 'R3810' });
ok(c.doc_('PhanLoaiSKU').length === 1, 'sửa lại cùng tên: thay dòng cũ, không nhân đôi');
r = c.__goi('luuPhanLoaiSKU', Town, { ten: 'EVO4/LUN2/COMBOMAX', bo: true });
ok(r.ok && c.doc_('PhanLoaiSKU').length === 0 && c.__goi('layDonHangXuong', Town, false).don[0].pl.nguon === 'tu-dong', '"Về tự động" xóa bản sửa');
ok(c.doc_('NhatKyThaoTac').some(x => x.HanhDong === 'Phân loại SKU'), 'ghi nhật ký thao tác');

console.log('\n4b. 2 nhãn chất liệu chuôi / ngọn + Vào–Ra–Tồn (02/11)');
p = PL('Combo MAXBING Evo Crown - ANCIENT OAK'); ok(p.loai === 'GAY' && p.vlC === 'GF' && p.vlN === 'MIX', 'gậy 2 khúc: chuôi GF 736 → Glassfiber, ngọn Mix → Mix (2 nhãn khác nhau)', p);
p = PL('RHI2-C30PT21.5/11.8/18'); ok(p.vlC === '' && p.vlN === 'FC', 'ngọn lẻ: chỉ nhãn ngọn', p);
p = PL('Rhino Retro Pool Cue Butt - Black'); ok(p.loai === 'CHUOI' && p.vlN === '' && !!p.vlC, 'chuôi lẻ: chỉ nhãn chuôi', p);
p = PL('Rhino Soft Cue Case 1X2 - Black'); ok(p.vlC === '' && p.vlN === '', 'phụ kiện: không nhãn chất liệu', p);
{ const ch = { '2026-10-30': [['A|x|KHO', 10, 10, 0, '2026-11-05', 'dangSX'], ['B|y|DEALER', 5, 5, 0, '2026-10-29', 'treHan'], ['C|z|KHO', 4, 4, 0, '', 'dangSX']],
    '2026-10-31': [['A|x|KHO', 10, 0, 10, '2026-11-05', 'sanSang'], ['B|y|DEALER', 5, 0, 5, '2026-10-29', 'sanSang'], ['D|w|OEM', 7, 7, 0, '', 'dangSX']] };
  const r2 = c.dhDongChay_(ch), d = r2.ngay[0];
  ok(r2.ngay.length === 1 && d.join() === '2026-10-31,7,15,7,2,1,1', 'vào 7 (dòng mới) · ra 15 · tồn 7 · xong 2, đúng hạn 1 · 1 dòng mất khi còn thiếu (không tính ra)', d);
  ok(r2.kenh.Kho.join() === '1,1' && r2.kenh.Dealer.join() === '1,0', 'đúng hạn theo kênh', r2.kenh); }

console.log('\n4c. Cấu hình sản phẩm trên web + báo sản phẩm mới + tab kênh mới (02/11)');
{ const tabX = [['', 'Loại hàng cần sản xuất', 'Loại Phôi', 'Số lượng đặt', 'SX CÒN THIẾU', 'Deadline'], ['#M-01/10', 'GAY NOVA X1 MAU DO', '', 5, 5, '20/11'], ['', 'GAY NOVA X1 MAU XANH', '', 3, 3, '20/11'], ['', 'EVO4/LUN2/BLUE/LW-BLACK/G/10/12.5', '', 2, 2, '20/11']];
  c.__ngoai = { [c.DH_SHEET_ID]: { ten: 'x', sheets: { KHO: tabX, 'KÊNH MỚI': tabX.slice(0, 2), 'Đơn hàng HT': tabX, '_SNAPSHOT': tabX } } }; c.dhDocDon_(true);
  r = c.__goi('demSanPhamMoi', Tadm); ok(!r.ok, 'ban điều hành không xem được');
  r = c.__goi('demSanPhamMoi', Town);
  ok(r.ok && r.n === 2 && r.thieu === 13 && r.ten[0].thieu === 10 && r.tabMoi.join() === 'KÊNH MỚI', 'báo 2 tên mới, còn thiếu 13 (tên trùng ở 2 kênh được gộp); tự đọc tab "KÊNH MỚI", bỏ tab lưu trữ "Đơn hàng HT" / "_SNAPSHOT"', r);
  r = c.__goi('luuCauHinhSP', Tadm, { loai: 'CHUOI', ma: 'NHAY390', chatLieu: 'GF' }); ok(!r.ok, 'ban điều hành không sửa được cấu hình');
  r = c.__goi('luuCauHinhSP', Town, { loai: 'DONG', ten: 'Nova', loaiHang: 'GAY', tenGoi: 'AB', chuoi: 'MIXCB', ngon: 'FC', tip: 'TIMEK' }); ok(!r.ok, 'chữ nhận diện < 3 ký tự: từ chối');
  r = c.__goi('luuCauHinhSP', Town, { loai: 'DONG', ten: 'Nova', loaiHang: 'GAY', tenGoi: 'NOVA X1', chuoi: 'KHONG', ngon: 'FC', tip: 'TIMEK' }); ok(!r.ok, 'gậy thiếu loại chuôi: từ chối');
  r = c.__goi('luuCauHinhSP', Town, { loai: 'DONG', ten: '=Nova X1', loaiHang: 'GAY', tenGoi: 'NOVA X1', chuoi: 'MIXCB', ngon: 'FC', tip: 'TIMEK', ren: 'R388', dau: '12,5' });
  const maD = r.ma; ok(r.ok && /^D-/.test(maD) && c.doc_('CauHinhSP')[0].Ten === 'Nova X1', 'thêm dòng gậy mới (tên bắt đầu "=" bị bỏ dấu, không thành công thức)', r.msg);
  let x = c.__goi('layDonHangXuong', Town, false), p2 = x.don.find(o => /NOVA X1 MAU XANH/.test(o.ten)).pl;
  ok(p2.dong === maD && p2.tin === 'xanh' && p2.vlC === 'MIX' && p2.vlN === 'FC' && p2.dau === '12.5' && p2.ren === 'R388', 'mọi tên có chữ nhận diện tự nhận cấu hình (chuôi Mix, ngọn FC, đầu 12.5)', p2);
  ok(x.nhan.dongDu.some(d => d.ma === maD && d.them) && x.tabMoi.join() === 'KÊNH MỚI', 'trả danh sách dòng gậy đầy đủ + tab mới cho web');
  r = c.__goi('luuCauHinhSP', Town, { loai: 'CHUOI', ma: 'NHAY390', chatLieu: 'GF', kieu: 'NHAY' }); x = c.__goi('layDonHangXuong', Town, false);
  ok(r.ok && x.nhan.vlChuoi.NHAY390 === 'GF' && c.plPhanLoai_('GẬY NHẢY TK ALL NEW MÀU ĐỎ-13.9 REN 3/8-8', '', null).vlC === 'GF', 'sửa chất liệu loại chuôi có sẵn → áp ngay cho sản phẩm dùng loại đó');
  r = c.__goi('luuCauHinhSP', Town, { loai: 'NGON', ten: 'Ngọn thử nhảy', chatLieu: 'FC', kieu: 'NHAY' }); const maN = r.ma;
  r = c.__goi('luuCauHinhSP', Town, { loai: 'DONG', ma: maD, ten: 'Nova X1', loaiHang: 'GAY', tenGoi: 'NOVA X1', chuoi: 'MIXCB', ngon: maN, tip: 'TIMEK' });
  ok(r.ok && c.plPhanLoai_('GAY NOVA X1 MAU DO', '', null).kieu === 'NHAY', 'loại ngọn tự thêm (kiểu nhảy) → dòng dùng nó thành gậy nhảy');
  r = c.__goi('luuCauHinhSP', Town, { loai: 'NGON', ma: maN, xoa: true }); ok(!r.ok && /đang được dùng/.test(r.msg), 'loại đang được dùng: không xóa được (chỉ ẩn)', r.msg);
  r = c.__goi('luuCauHinhSP', Town, { loai: 'NGON', ma: maN, ten: 'Ngọn thử nhảy', chatLieu: 'FC', kieu: 'NHAY', an: true }); x = c.__goi('layDonHangXuong', Town, false);
  ok(r.ok && x.nhan.an.NGON[maN] === 1, 'ẩn loại khỏi ô chọn');
  r = c.__goi('demSanPhamMoi', Town); ok(r.n === 0, 'sau khi thêm dòng gậy: hết báo sản phẩm mới', r.n);
  r = c.__goi('luuCauHinhSP', Town, { loai: 'DONG', ma: maD, xoa: true }); ok(r.ok && c.plPhanLoai_('GAY NOVA X1 MAU DO', '', null).tin === 'do', 'xóa dòng tự thêm → tên hàng lại thành "chưa nhận ra"');
  r = c.__goi('luuCauHinhSP', Town, { loai: 'DONG', ma: 'EVO4', ten: 'EVO 4 (sửa)', loaiHang: 'GAY', tenGoi: 'EVO4, EVO 4', chuoi: 'GF736HK', ngon: 'FC', tip: 'TIMEK', ren: 'R3810' });
  ok(r.ok && c.plPhanLoai_('EVO4/LUN2/BLUE/LW-BLACK/G/10/12.5', '', null).ngon === 'FC', 'sửa dòng gậy có sẵn (EVO 4 ngọn → FC)');
  r = c.__goi('luuCauHinhSP', Town, { loai: 'DONG', ma: 'EVO4', xoa: true }); ok(r.ok && c.plPhanLoai_('EVO4/LUN2/BLUE/LW-BLACK/G/10/12.5', '', null).ngon === 'GF29', '"Về cấu hình gốc" trả EVO 4 về như mã');
  r = c.__goi('boQuaTabDon', Town, 'KÊNH MỚI', true); x = c.__goi('layDonHangXuong', Town, true);
  ok(r.ok && !x.tabMoi.length && x.tabBo.join() === 'KÊNH MỚI' && !x.don.some(o => o.tab === 'KÊNH MỚI'), 'bỏ qua tab kênh mới: không đọc nữa');
  r = c.__goi('boQuaTabDon', Town, 'KHO', true); ok(!r.ok, 'không cho bỏ qua 7 tab chuẩn');
  ok(c.doc_('NhatKyThaoTac').some(x => x.HanhDong === 'Cấu hình sản phẩm'), 'ghi nhật ký thao tác'); }

console.log('\n4d. Tab "ĐƠN ƯU TIÊN" làm nguồn mục Ưu tiên (07/11)');
{ const tabK = [['', 'Loại hàng cần sản xuất', 'Loại Phôi', 'Số lượng đặt', 'SX CÒN THIẾU', 'Deadline'], ['#KHO-01/11', 'EVO4/LUN2/BLUE/LW-BLACK/G/10/12.5', '', 6, 6, '26/11'], ['#KHO-02/11', 'RHI2-KOMET2/BRE/BLUE/13.0/388', '', 4, 4, '26/11']];
  const tabU = [tabK[0], ['#KHO-01/11', 'EVO4/LUN2/BLUE/LW-BLACK/G/10/12.5', '', 6, 6, '17/11']];
  c.__ngoai = { [c.DH_SHEET_ID]: { ten: 'x', sheets: { KHO: tabK, 'ĐƠN ƯU TIÊN': tabU } } }; c.dhDocDon_(true);
  const x = c.__goi('layDonHangXuong', Town, true);
  ok(x.ok && x.don.length === 2 && x.don.reduce((a, o) => a + o.thieu, 0) === 10, 'tab ĐƠN ƯU TIÊN không cộng vào tổng đơn (không đếm trùng)', x.don && x.don.length);
  ok(!(x.tabMoi || []).length, 'tab ĐƠN ƯU TIÊN không bị báo là "kênh mới"', x.tabMoi);
  const u = (x.uu || [])[0] || {};
  ok((x.uu || []).length === 1 && u.maDon === '#KHO-01/11' && u.tab === 'KHO' && u.uuTien && u.pl && u.pl.dong === 'EVO4', 'trả danh sách ưu tiên riêng, kênh lấy theo mã đơn ở tab chính, có phân loại', u);
  ok(/-11-17$/.test(u.dl) && /-11-26$/.test(x.don.find(o => o.maDon === '#KHO-01/11').dl), 'hạn ưu tiên lấy theo tab ĐƠN ƯU TIÊN (17/11), khác hạn ở tab KHO (26/11)', [u.dl]); }

console.log('\n4e. Kênh POD-ECOMSTONE, sản lượng nhập theo ngày, công suất (07/11)');
{ const tabE = [['', 'Loại hàng cần sản xuất', 'Loại Phôi', 'Số lượng đặt', 'SX CÒN THIẾU', 'Deadline'], ['#ECO-01/11', 'EVO4/LUN2/BLUE/LW-BLACK/G/10/12.5', '', 3, 3, '20/11']];
  c.__ngoai = { [c.DH_SHEET_ID]: { ten: 'x', sheets: { KHO: [tabE[0]], 'POD-ECOMSTONE': tabE } } }; c.dhDocDon_(true);
  let x = c.__goi('layDonHangXuong', Town, true);
  ok(x.ok && x.don.length === 1 && x.don[0].kenh === 'POD – Ecomstone' && !(x.tabMoi || []).length, 'tab POD-ECOMSTONE đọc như kênh chuẩn (không báo "kênh mới")', x.don && x.don[0]);
  ok(x.kenhDs.some(k => k[0] === 'POD-ECOMSTONE') && x.kenhDs.some(k => k[0] === 'OEM'), 'trả đủ danh sách kênh (kể cả kênh chưa có đơn)');
  ok(x.cs && x.cs.sp === 310 && x.cs.macDinh && x.cs.nghi.some(n => n[0] === '2027-01-01'), 'công suất mặc định 310 sp/ngày + lịch lễ gợi ý', x.cs);
  const cu = [['A|EVO4/LUN2/BLUE/LW-BLACK/G/10/12.5|KHO', 10, 10, 0, '', 'dangSX'], ['B|Rhino Soft Cue Case 1X2 - Black|OEM', 5, 5, 0, '', 'dangSX'], ['C|RHI2-KOMET2/BRE/BLUE/13.0/388|DEALER', 4, 4, 0, '', 'dangSX'], ['D|EVO4/LUN2/BLUE/LW-BLACK/G/10/12.5|KHO', 3, 3, 0, '', 'dangSX']];
  const nay = [['A|EVO4/LUN2/BLUE/LW-BLACK/G/10/12.5|KHO', 10, 4, 0, '', 'dangSX'], ['B|Rhino Soft Cue Case 1X2 - Black|OEM', 5, 0, 0, '', 'sanSang'], ['C|RHI2-KOMET2/BRE/BLUE/13.0/388|DEALER', 4, 6, 0, '', 'dangSX'], ['E|EVO4/LUN2/BLUE/LW-BLACK/G/10/12.5|KHO', 7, 7, 0, '', 'dangSX']];
  const k = c.dhTinhSanLuong_(cu, nay, {}, {});
  ok(k.ra === 11 && k.sx === 6 && k.tang === 2 && k.vao === 7 && k.mat === 3 && k.ton === 17 && k.kenh.Kho === 6 && k.kenh.OEM === 5 && k.loai.GAY === 6 && k.loai.PK === 5,
    'sản lượng = thiếu trước − thiếu sau cùng dòng: 6 sp sản xuất (+5 phụ kiện tách riêng); thiếu tăng → điều chỉnh; dòng mới / dòng mất không tính', k);
  const ch = { '2026-11-02': cu, '2026-11-03': nay, '2026-11-04': nay };
  const n1 = c.dhGhiSanLuong_(ch), n2 = c.dhGhiSanLuong_(ch), sl = c.dhDocSanLuong_().filter(r => r[0] >= '2026-11-03');   // sheet có thể có sẵn ngày cũ từ phần kiểm thử trước
  ok(n1 === 2 && n2 === 0 && sl.length === 2 && sl[0][0] === '2026-11-03' && sl[0][1] === '2026-11-02' && sl[0][3] === 6 && sl[1][3] === 0 && sl[0][8].kenh.Kho === 6, 'lưu sản lượng mỗi ngày vào sheet ẩn DonHangSanLuong 1 lần (gọi lại không ghi trùng)', sl);
  let r = c.__goi('luuCongSuat', Tadm, { sp: 300, nghi: [] }); ok(!r.ok, 'ban điều hành không sửa được công suất');
  r = c.__goi('luuCongSuat', Town, { sp: 0, nghi: [] }); ok(!r.ok, 'công suất 0: từ chối');
  r = c.__goi('luuCongSuat', Town, { sp: 400, nghi: [['2027-13-40', 'x']] }); ok(!r.ok && /không hợp lệ/.test(r.msg), 'ngày sai: từ chối', r.msg);
  r = c.__goi('luuCongSuat', Town, { sp: 400, nghi: [['2027-02-05', '=Tết'], ['2027-02-05', 'trùng']], lam: ['2027-01-10'] });
  ok(r.ok && r.cs.sp === 400 && r.cs.nghiTay.length === 1 && r.cs.nghiTay[0][1] === 'Tết' && r.cs.nghi.some(n => n[0] === '2027-02-06') && r.cs.nghiTuDong.some(n => n[0] === '2026-04-26' && /Giỗ Tổ/.test(n[1])) && r.cs.lam[0] === '2027-01-10' && !r.cs.macDinh, 'lưu công suất 400 + ngày nghỉ riêng (bỏ dấu "=", bỏ trùng) + ngày làm bù; lễ âm lịch tự tính (Tết 2027 = 06/02, Giỗ Tổ 2026 = 26/04)', r.cs);
  ok(c.__goi('layDonHangXuong', Town, false).cs.sp === 400, 'công suất mới trả về cho web'); }

console.log('\n4g. Đọc Sheet theo ORDER·FLOW: mã không số, dòng ghi chú, ngày hẹn trả, gộp dòng trùng (07/11)');
{ const E = 'EVO4/LUN2/BLUE/LW-BLACK/G/10/12.5', H = ['Mã', 'Loại hàng cần sản xuất', 'Loại Phôi', 'Số lượng đặt', 'SX CÒN THIẾU', 'Deadline', 'Sơn của Khoa', 'Hỏng cần làm bù', 'Ngày hẹn trả SƠN'];
  const tab = [H, ['KHO-01/11', E, '', 5, 5, '20/11', 3, '', '25/11'], ['#DEMO', E, '', 2, 2, '', '', '', ''], ['', E, '', 1, 1, '', '', '', ''],
    ['CẦN THÊM ĐÁNH PHÁ 3/8/8 300PCS/TUẦN', '', '', '', '', '', '', '', ''], ['', E, '', 4, 4, '', '', '', '']];
  c.__ngoai = { [c.DH_SHEET_ID]: { ten: 'x', sheets: { KHO: tab } } }; c.dhDocDon_(true);
  const x = c.__goi('layDonHangXuong', Town, true), d = x.don;
  ok(d.length === 4 && d[1].maDon === '#DEMO' && d[2].maDon === '#DEMO' && d[3].maDon === '#DEMO', 'mã nhóm không có chữ số (#DEMO) giữ cho các dòng dưới; dòng ghi chú "CẦN THÊM … /TUẦN" không thành mã đơn', d.map(o => o.maDon));
  ok(/-11-25$/.test((d[0].hen || {}).SON || '') && d[0].qua.SON === 3, 'đọc ngày hẹn trả của công đoạn (Sơn 25/11)', d[0].hen);
  const cu = [['A|x|KHO', 5, 5], ['A|x|KHO#2', 5, 5]], nay = [['A|x|KHO', 5, 3]];
  const k = c.dhTinhSanLuong_(cu, nay, {}, {});
  ok(k.ra === 7 && k.mat === 0 && k.vao === 0, 'gộp dòng trùng khóa: 2 dòng (thiếu 10) thành 1 dòng thiếu 3 -> sản lượng 7, không báo mất', k); }

console.log('\n4f. Đơn chuyển sang tab HT-<năm> (07/11)');
{ const H = ['', 'Loại hàng cần sản xuất', 'Loại Phôi', 'Số lượng đặt', 'SX CÒN THIẾU', 'Deadline'], nam = new Date().getFullYear(), tabHT = 'HT-' + nam;
  const E = 'EVO4/LUN2/BLUE/LW-BLACK/G/10/12.5', K = 'RHI2-KOMET2/BRE/BLUE/13.0/388';
  c.__ngoai = { [c.DH_SHEET_ID]: { ten: 'x', sheets: { DEALER: [H, ['DEA-02/11', K, '', 4, 4, '20/11']], [tabHT]: [H, ['KHO-01/11', E, '', 10, 0, '20/11'], ['KHO-03/10', E, '', 3, 1, '10/11'], ['OEM-01/01', E, '', 5, 0, '01/02']] } } }; c.dhDocDon_(true);
  let x = c.__goi('layDonHangXuong', Town, true);
  ok(x.ok && x.don.length === 1 && !(x.tabMoi || []).length, 'tab ' + tabHT + ' không bị đọc thành kênh mới, không cộng vào tổng đơn', [x.don.length, x.tabMoi]);
  const cu = [['KHO-01/11|' + E + '|KHO', 10, 10, 0, nam + '-11-20', 'dangSX'], ['DEA-02/11|' + K + '|DEALER', 4, 4, 0, nam + '-11-20', 'dangSX'], ['OEM-09/11|' + K + '|OEM', 2, 2, 0, '', 'dangSX']];
  const cu0 = [['KHO-03/10|' + E + '|KHO', 3, 3, 0, nam + '-11-10', 'treHan']].concat(cu);
  const goc = c.dhDocChup_; c.dhDocChup_ = () => ({ [nam + '-11-04']: cu0, [nam + '-11-05']: cu });
  const nay = [['DEA-02/11|' + K + '|DEALER', 4, 4, 0, nam + '-11-20', 'dangSX']], kq = c.dhTimChuyenHT_(nay, nam + '-11-06'); c.dhDocChup_ = goc;
  const a = kq.dong.find(r => r[0].startsWith('KHO-01/11')), d = kq.dong.find(r => r[0].startsWith('KHO-03/10')), sa = kq.su.find(r => r[2] === 'KHO-01/11'), sd = kq.su.find(r => r[2] === 'KHO-03/10');
  ok(kq.dong.length === 2 && a && a[2] === 0 && a[6] === 1 && d && d[2] === 1 && d[7] === 3 && !kq.dong.some(r => r[0].startsWith('OEM-09/11')),
    'dòng biến mất + có ở tab HT -> thêm vào bản chụp (cờ HT); dòng chuyển chậm 1 ngày vẫn nhận; dòng biến mất không có ở HT -> không', kq.dong);
  ok(sa && sa[4] === 'Kho' && sa[10] === 'dung' && sd && sd[10] === 'giaoThieu' && sd[1] === nam + '-11-04', 'sự kiện hoàn thiện: kênh từ bản chụp, đủ + đúng hạn / giao thiếu, ngày cuối còn thấy', kq.su);
  const k = c.dhTinhSanLuong_(cu, nay.concat(kq.dong), {}, {});
  ok(k.ra === 12 && k.sx === 12 && k.mat === 2 && k.ton === 4 && k.vao === 0 && k.ht.n === 2 && k.ht.thieu === 1 && k.tang === 0,
    'sản lượng tính cả đơn chuyển HT (10 + 3−1 = 12), phần giao thiếu không cộng; chỉ dòng không có ở HT mới "mất"', k);
  const n1 = c.dhGhiHoanThien_(kq.su), n2 = c.dhGhiHoanThien_(kq.su), ht = c.dhDocHoanThien_();
  ok(n1 === 2 && n2 === 0 && ht.length >= 2 && ht.some(r => r[2] === 'KHO-01/11' && r[10] === 'dung' && r[6] === 10), 'lưu sự kiện vào sheet ẩn DonHangHoanThien 1 lần / ngày', ht);
  const ch = c.dhDongChay_({ [nam + '-11-05']: cu, [nam + '-11-06']: nay.concat(kq.dong) }).ngay[0];
  ok(ch[1] === 0 && ch[3] === 4 && ch[6] === 1, 'Vào–Ra–Tồn: dòng chuyển HT không tính "vào", không cộng tồn; chỉ 1 dòng mất', ch); }

console.log('\n4h. Đơn hoàn thiện đọc trực tiếp tab HT + Đóng gói theo nhật ký KPI + lịch NgayLe (07/11)');
{ const nam = new Date().getFullYear(), E = 'EVO4/LUN2/BLUE/LW-BLACK/G/10/12.5', H = ['Mã', 'Loại hàng cần sản xuất', 'Loại Phôi', 'Số lượng đặt', 'SX CÒN THIẾU', 'Deadline', 'HẠN MỚI HT ĐƠN CŨ', 'Kênh'];
  const ht = [H, ['OEM-03/09', E, '', 4, 0, '28/09', '', ''], ['', 'Rhino Soft Cue Case 1X2 - Black', '', 3, 0, '', '', ''], ['DEALER', '', '', '', '', '', '', ''], ['DEA-01/09', E, '', 10, 0, '20/09', '05/10', ''], ['KHO-02/09', E, '', 6, 1, '25/09', '', 'Kho']];
  c.__ngoai = { [c.DH_SHEET_ID]: { ten: 'x', sheets: { OEM: [H.slice(0, 6), ['OEM-03/09', E, '', 1, 1, '28/09']], ['HT-' + nam]: ht } } }; c.dhDocDon_(true);
  let r = c.__goi('layDonHoanThien', Tadm, true); ok(r.ok, 'ban điều hành xem được Hoàn thiện (14/11)');
  r = c.__goi('layDonHoanThien', Town, true);
  ok(r.ok && !r.don && r.donC.length === 9 && r.donH.every(d => d.length === 9), '08/11: gửi gọn dạng bảng 9 cột (web mở lại bằng dhHTMo)', r.donC);
  r.don = r.donH.map(d => Object.fromEntries(r.donC.map((k, j) => [k, d[j]])));
  const g = m => r.don.find(o => o.maDon === m) || {};
  ok(r.ok && r.tabs.join() === 'HT-' + nam && r.don.length === 4 && g('DEA-01/09').tab === 'DEALER' && g('KHO-02/09').tab === 'KHO' && g('OEM-03/09').tab === 'OEM' && g('OEM-03/09').kenh === 'OEM',
    'đọc tab HT-' + nam + ': kênh từ dòng tiêu đề nhóm (DEALER), cột "Kênh" (Kho), mã đơn còn ở tab kênh (OEM)', r.don.map(o => [o.maDon, o.tab]));
  ok(g('DEA-01/09').thang === nam + '-10' && g('KHO-02/09').thang === nam + '-09' && g('KHO-02/09').thieu === 1 && c.dhHTTrucTiep_(false).don.find(o => o.maDon === 'DEA-01/09').pl.loai === 'GAY' && r.nguon.nhom === 1 && r.nguon.cot === 1 && r.nguon.ma === 2,
    'tháng theo hạn mới HT (05/10) nếu có, không thì deadline; giữ số thiếu khi chuyển; có phân loại sản phẩm', [g('DEA-01/09').thang, g('KHO-02/09').thang, r.nguon]);
  const dg = c.__goi('layDongGoiNgay', Town, 200), ma = c.dhMaDongGoi_();
  ok(dg.ok && ma.length > 0 && Object.keys(dg.ngay).length > 10 && Object.values(dg.ngay).every(v => v > 0), 'Đóng gói theo ngày từ nhật ký KPI (bước xuất Đóng gói: ' + ma.length + ' mã công đoạn, ' + Object.keys(dg.ngay).length + ' ngày)', [ma, Object.keys(dg.ngay).length]);
  const cs = c.dhCongSuat_(); ok(cs.nghi.some(n => n[0] === '2026-09-01' && /lịch KPI/.test(n[1])), 'ngày nghỉ lấy thêm từ bảng NgayLe của web KPI (01/09/2026)'); }

console.log('\n4i. Email báo cáo 8h (chỉ chủ sở hữu) (07/11)');
{ c.__mail = []; let r = c.__goi('guiThuEmailDonHang', Tadm); ok(!r.ok, 'ban điều hành không gửi thử được');
  r = c.__goi('guiThuEmailDonHang', Town); const m = c.__mail[0] || {};
  ok(r.ok && c.__mail.length === 1 && /^\[Thử\]/.test(m.subject) && /8 ĐƠN TRỌNG ĐIỂM/.test(m.htmlBody) && /THEO KÊNH/.test(m.htmlBody) && /POD – Ecomstone/.test(m.htmlBody), 'gửi thử: tiêu đề [Thử], có 6 số, theo kênh (đủ 8 kênh), 8 đơn trọng điểm', [r.msg, m.subject]);
  if (process.env.MAIL_OUT) fs.writeFileSync(process.env.MAIL_OUT, '<meta charset="utf-8">' + (m.htmlBody || ''));
  r = c.__goi('batTatEmailDonHang', Town, false); ok(r.ok && r.email.bat === false, 'tắt email');
  r = c.__goi('batTatEmailDonHang', Town, true); ok(r.ok && r.email.bat === true, 'bật lại email');
  c.__trigger = [{ id: 'tEmail', ham: 'EMAIL_DON_HANG_8H' }]; c.__mail = [];
  c.EMAIL_DON_HANG_8H({ triggerUid: 'tEmail' }); const n1 = c.__mail.length; c.EMAIL_DON_HANG_8H({ triggerUid: 'tEmail' });
  ok(c.__mail.length === n1 && n1 <= 1, 'trigger 8h: mỗi ngày gửi tối đa 1 lần (chủ nhật / ngày lễ không gửi)', [n1, c.__mail.length]);
  ok(!(c.EMAIL_DON_HANG_8H({}) || {}).ok || c.__mail.length === n1, 'gọi không qua trigger: bị chặn'); }

if (process.env.DH) {
  console.log('\n5. Toàn bộ đơn thật (DH=)');
  const dh = JSON.parse(fs.readFileSync(process.env.DH, 'utf8')), sh = {};
  for (const k in dh) sh[k] = dh[k].map(rw => (rw || []).map(v => (v && typeof v === 'object' && v.$d) ? new Date(v.$d + '+07:00') : v));
  c.__ngoai = { [c.DH_SHEET_ID]: { ten: 'Trạng thái đơn hàng', sheets: sh } };
  r = c.__goi('layDonHangXuong', Town, true);
  const ten = {}; r.don.forEach(o => { ten[o.ten.toUpperCase()] = o.pl.tin; });
  const n = Object.values(ten), xanh = n.filter(x => x === 'xanh').length, doo = n.filter(x => x === 'do').length;
  ok(r.ok && r.don.length > 500, 'đọc ' + r.don.length + ' dòng đơn');
  ok(xanh / n.length >= 0.85 && doo === 0, 'tên hàng chắc chắn ' + xanh + '/' + n.length + ' (≥ 85%), không tên nào đỏ', { xanh, doo, tong: n.length });
  const kv = {}; r.don.forEach(o => { if (o.pl.loai === 'PK' || o.pl.loai === 'NOI') return; const k = o.pl.loai + '|' + o.pl.kieu + '|' + o.pl.vl; kv[k] = (kv[k] || 0) + o.thieu; });
  if (process.env.IN_KIEU) console.log(kv);
  ok(r.don.every(o => o.pl.kieu && o.pl.vl) && Object.keys(kv).some(k => /NHAY\|/.test(k)) && Object.keys(kv).some(k => /\|PHA\|/.test(k)) && Object.keys(kv).some(k => /PHANHAY/.test(k)), 'mọi dòng có kiểu (đánh / nhảy / phá / phá nhảy) + chất liệu', kv);
  ok(!Object.keys(kv).some(k => /^GAY\|DANH\|KHAC/.test(k) && kv[k] > 0.05 * r.don.reduce((a, o) => a + o.thieu, 0)), 'gậy đánh "chưa rõ chất liệu" < 5% phần còn thiếu', kv);
  ok(r.don.every(o => o.pl.loai && (o.pl.loai === 'PK' || o.pl.loai === 'NOI' || o.pl.tin === 'do' || (o.pl.chuoi && o.pl.ngon && o.pl.tip && o.pl.ren))), 'mọi dòng sản xuất đều đủ 4 thông số');
}

console.log('\n07/11. Tab chính Thống kê – layThongKe (chỉ chủ sở hữu)');
{ const tk = c.layThongKe(Town, '2026-10', true);
  ok(tk.ok && !tk.loi && ['ns', 'dd', 'com', 'cd', 'kpi'].every(k => tk[k]), 'chủ sở hữu: đủ 5 mảng, không lỗi', tk.loi || Object.keys(tk));
  ok(tk.xuong[0][0] === 'PHOICB' && tk.xuong.map(x => x[0]).indexOf('DG') > tk.xuong.map(x => x[0]).indexOf('HT'), 'xưởng xếp theo dòng chảy (Phôi Carbon đầu, Đóng gói sau Hoàn thiện)', tk.xuong.map(x => x[0]));
  ok(tk.ngayLam.length >= 20 && tk.ngayLam.every(d => d.slice(0, 7) === '2026-10' && new Date(d + 'T12:00:00Z').getUTCDay() !== 0), 'ngày làm tháng 10: thứ 2 – thứ 7, không chủ nhật', tk.ngayLam.length);
  const ns = Object.values(tk.ns.x).reduce((a, o) => a + o.dang, 0), dl = c.doc_('NhanSu').filter(x => String(x.TrangThai).trim() === 'Đang làm').length;
  ok(ns === dl, 'nhân sự đang làm = số "Đang làm" trong Nhân sự', [ns, dl]);
  const x = Object.values(tk.dd.x), sai = x.filter(o => o.vang < 0 || o.vang > o.cong + 1e-9 || o.ngayXN > tk.ngayLam.length);
  ok(!sai.length && x.some(o => o.vang > 0), 'điểm danh: 0 ≤ công vắng ≤ công kế hoạch, ngày xác nhận ≤ ngày làm', sai[0]);
  ok(x.filter(o => o.nguoi).every(o => o.tbDiLam != null && o.tbDiLam <= o.nguoi && o.tbDiLam >= 0 && Math.abs(o.tbDiLam - (o.nguoi - (o.vangNg || 0) / o.ngayLamX)) < 0.06), '08/11: TB đi làm / ngày = người − (nghỉ cả ngày + 0,5 × nửa ngày) ÷ ngày làm', x.slice(0, 2));
  ok(Object.values(tk.dd.kyHieu).length > 0 && !('NL' in Object.fromEntries(tk.dd.top.map(p => [p.nv, 1]))), 'điểm danh: có đếm ký hiệu, NL không tính vắng');
  ok(tk.com.daTongKet === true && tk.com.x.length > 0 && tk.com.x.every(r => r.chua >= 0), 'báo cơm tháng 10 (đã tổng kết): đọc SuatAnThang, có "không báo"', tk.com.x[0]);
  const cd = Object.values(tk.cd.x).filter(o => o.hs != null);
  ok(cd.length >= 5 && cd.every(o => o.hs > 0 && o.hs < 500 && o.gio > 0), 'công đoạn: hiệu suất thô = giờ chuẩn ÷ giờ có mặt (hợp lý)', cd.map(o => o.hs));
  ok(tk.kpi.ky === '2026-09' && tk.kpi.tamTinh, 'KPI (đồng hồ 31/10 – tháng 10 đang chạy): phân tích tháng đã chốt 09/2026', [tk.kpi.ky, tk.kpi.dsKy]);
  const c2 = G.tao(path.join(__dirname, '..', 'Code.gs'), du, '2026-11-07T19:00:00+07:00'), T2 = c2.__phienDai(vt('OWNER'));
  const tk2 = c2.layThongKe(T2, '2026-11', true);
  ok(tk2.ok && tk2.chuaChot && tk2.kpi.ky === '2026-10' && tk2.kpi.tamTinh && tk2.com.daTongKet === false && tk2.com.soNguoiChua > 0, 'tháng đang chạy: KPI lấy tháng chốt gần nhất, báo cơm tính từng ngày + đếm người không báo', [tk2.kpi.ky, tk2.com.soNguoiChua]);
  ok(c2.laNgayLe_('2026-11-24', '') && c2.laNgayLe_('2027-11-24', 'CNC') && !c2.laNgayLe_('2026-11-23', '') && c2.dhCongSuat_().nghi.some(x => x[0] === '2026-11-24'), '08/11: 24/11 (Ngày Văn hóa Việt Nam) là ngày lễ ở KPI / điểm danh và công suất Đơn hàng');
  const r2 = c.layThongKe(Tadm, '2026-10');
  ok(r2.ok === false, 'tài khoản không phải chủ sở hữu (ADMIN) bị chặn', r2);
}

console.log('\n14/11. Giao nhận theo bộ phận ghi thẳng vào Sheet đơn + xác nhận hẹn');
{
  const T = tk => c.__phienDai(TK.find(t => t.TenDangNhap === tk));
  const tb = [['', 'NOTE'], ['MÃ', 'Loại hàng cần sản xuất', 'Số lượng đặt', 'SX CÒN THIẾU', 'Deadline', 'Phôi của Phố', 'Ngày hẹn trả BP60', 'Sơn của Khoa', 'Ngày hẹn trả Sơn', 'UV của Doanh', 'Hoàn thiện của Thịnh', 'Tổng cộng hàng ĐG nhận từ HT'],
    ['#G-14/11', 'Rhino Retro Pool Cue Butt - Black', 50, 50, '30/11', '', '', '', '', '=B3', '', '']];
  c.__ngoai = { [c.DH_SHEET_ID]: { ten: 'x', sheets: { KHO: tb } } }; c.dhDocDon_(true);
  const Tphoi = T('tpphoicb'), Tson = T('c398'), Tuv = T('tpinuv');
  let r = c.luuDonGiaoNhan(Tphoi, { tab: 'KHO', dong: 3, ten: 'Rhino Retro Pool Cue Butt - Black', sl: 20, hen: '2026-11-20', cu: { slDat: 50, sl: 0, hen: '' } });
  ok(r.ok && tb[2][5] === 20 && r.o === 'PHOI', 'TP Phôi lưu SL lũy kế + hẹn vào đúng dòng Sheet, đơn ở Phôi', r);
  const n1 = tb[1].length;
  ok(tb[1].slice(-10).join('|') === c.DH_TD_COT.join('|') && tb[0].length < n1, 'thêm 10 cột phụ ở ĐÚNG dòng tiêu đề (dòng 2)', tb[1].slice(-10));
  r = c.luuDonGiaoNhan(Tphoi, { tab: 'KHO', dong: 3, ten: 'Rhino Retro Pool Cue Butt - Black', sl: 25, cu: { slDat: 50, sl: 20 } });
  ok(r.ok && tb[1].length === n1, 'lưu lần 2 không thêm cột lặp lại', tb[1].length);
  r = c.luuDonGiaoNhan(Tson, { tab: 'KHO', dong: 3, bp: 'PHOI', sl: 1 }); ok(!r.ok, 'PP Sơn không ghi được số của Phôi', r.msg);
  r = c.luuDonGiaoNhan(Tadm, { tab: 'KHO', dong: 3, bp: 'PHOI', sl: 1 }); ok(!r.ok, 'ban điều hành không ghi được', r.msg);
  r = c.luuDonGiaoNhan(Tuv, { tab: 'KHO', dong: 3, xnHen: { bp: 'PHOI', dongY: true } }); ok(!r.ok, 'UV không xác nhận được hẹn của Phôi (không phải bộ phận liền sau)', r.msg);
  r = c.luuDonGiaoNhan(Tson, { tab: 'KHO', dong: 3, xnHen: { bp: 'PHOI', dongY: false } }); ok(!r.ok && /lý do/.test(r.msg), 'không kịp phải ghi lý do', r.msg);
  r = c.luuDonGiaoNhan(Tson, { tab: 'KHO', dong: 3, xnHen: { bp: 'PHOI', dongY: true } });
  ok(r.ok && r.xh && r.xh.PHOI && r.xh.PHOI.ok === 1 && r.xh.PHOI.ngay === '2026-11-20' && r.o === 'PHOI', 'Sơn (bộ phận sau) đồng ý hẹn Phôi 20/11, không đổi bộ phận đang làm', r);
  c.dhDocDon_(true); const d = c.layDonHangXuong(Tson, true), o = d.don.find(x => x.maDon === '#G-14/11');
  ok(o && o.dn && o.dn.h && o.dn.h.PHOI && o.dn.h.PHOI.ok === 1, 'đọc lại Sheet: thấy xác nhận hẹn', o && o.dn);
  r = c.luuDonGiaoNhan(Tuv, { tab: 'KHO', dong: 3, xacNhan: true, slNhan: 25 }); ok(r.ok, 'chưa chọn kế tiếp: bộ phận khác vẫn nhận được', r.msg);
  r = c.luuDonGiaoNhan(Tuv, { tab: 'KHO', dong: 3, sl: 5, cu: { slDat: 50, sl: 0 } });
  ok(!r.ok && /CÔNG THỨC/.test(r.msg) && tb[2][9] === '=B3', 'ô UV đang là công thức: không ghi đè, báo rõ ô', r.msg);
}

console.log((loi ? '\n✗ ' : '\n✓ ') + (dem - loi) + '/' + dem + ' đạt');
process.exit(loi ? 1 : 0);
