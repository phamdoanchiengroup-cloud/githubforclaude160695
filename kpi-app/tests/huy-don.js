/** Kiểm thử giai đoạn 0 hủy / bớt mã đơn hàng (16/11 khuya, tests/quy-trinh/huy-don.gs):
 *  quyền, Sheet riêng tự tạo, khớp dòng theo tab + mã đơn + tên, mồ côi, Sheet đơn giữ nguyên (17/11 tối: không tô màu), hoàn tác, loại khỏi tính toán, không áp 2 lần.
 *   DATA=<csdl.json> TZ=Asia/Ho_Chi_Minh node kpi-app/tests/huy-don.js */
const path = require('path'), fs = require('fs'); const G = require('./gia-lap-kpi.js');
const DATA = process.env.DATA; if (!DATA) { console.log('Cần DATA='); process.exit(1); }
let n = 0, l = 0; const ok = (c, t, x) => { n++; if (!c) l++; console.log((c ? '  ✓ ' : '  ✗ ') + t + (c ? '' : ' → ' + String(JSON.stringify(x)).slice(0, 400))); };
const du = JSON.parse(fs.readFileSync(DATA, 'utf8'));
['DonHangChup', 'DonHangSanLuong', 'DonHangHoanThien', 'DonHangHong', 'PhanLoaiSKU', 'CauHinhSP', 'BTPTheoSKU', 'DonUuTien'].forEach(k => { if (du[k]) du[k] = du[k].slice(0, 1); });
const iDoi = du.TaiKhoan[0].indexOf('DoiMatKhauLanDau'); du.TaiKhoan.slice(1).forEach(x => { x[iDoi] = 'Không'; });
const c = G.tao(path.join(__dirname, '..', 'Code.gs'), du, '2026-11-16T09:00:00+07:00');
const H = ['', 'Loại hàng cần sản xuất', 'Loại Phôi', 'Số lượng đặt', 'SX CÒN THIẾU', 'Deadline', 'CHÚ THÍCH CÁC BỘ PHẬN', 'Phôi của Phố', 'Ngày hẹn trả BP60', 'Sơn của Khoa', 'Ngày hẹn trả SƠN', 'Đóng gói của Tuyết Anh'];
const OEM = [H,
  ['#A-01/11', 'GAY NOVA X1 MAU DO', '', 50, 50, '30/11', '', 20, '', 10, '', ''],
  ['', 'GAY NOVA X1 MAU XANH', '', 30, 30, '30/11', '', 5, '', '', '', ''],
  ['', 'GAY NOVA X1 MAU VANG', '', 10, 10, '30/11', '', '', '', '', '', ''],
  ['#B-02/11', 'GAY NOVA X1 MAU DO', '', 40, 40, '20/11', '', '', '', '', '', ''],
  ['#B-02/11', 'GAY NOVA X1 MAU DO', '', 8, 8, '20/11', '', '', '', '', '', '']];   // mã trùng trong cùng đơn -> khóa #2
const KHO = [H, ['#K-03/11', 'NGON RHINO 12.4', '', 100, 100, '25/11', '', '', '', '', '', '']];
c.__ngoai = { [c.DH_SHEET_ID]: { ten: 'x', sheets: { OEM: OEM, KHO: KHO } } };
const shDH = () => c.SpreadsheetApp.openById(c.DH_SHEET_ID).getSheetByName('OEM');
const mau = d => shDH().getRange(d, 1, 1, 12).getBackgrounds()[0];
shDH().getRange(2, 1, 1, 3).setBackground('#fce5cd');   // dòng 2 có màu riêng (cam) -> hoàn tác phải trả đúng màu này
const TK = c.doc_('TaiKhoan').filter(t => t.TrangThai === 'Đang dùng'), ma = m => TK.find(t => String(t.MaNV).trim().toUpperCase() === m);
const P = t => t && c.__phienDai(t);
const own = P(TK.find(t => String(t.VaiTro).trim() === 'OWNER')), gd = P(ma('C019')), kl = P(ma('C067')), c077 = P(ma('C077'));
const tp = P(TK.find(t => /TP|PP/.test(t.VaiTro) && String(t.MaXuong) === 'SON'));
const lay = (t, lm) => c.__goi('layDonHangXuong', t || own, lm === undefined ? true : lm);
const dong = (r, ten, md) => r.don.find(o => o.ten === ten && (!md || o.maDon === md));
let r, x, lenh = 0; const L = () => 'test' + (++lenh) + 'abc';
const huy = (t, p) => c.__goi('huyBotDon', t, Object.assign({ tab: 'OEM', lenh: L() }, p));

console.log('\n1. Quyền');
ok(!!gd && !!kl && !!c077 && !!tp, 'có tài khoản thử C019, C067, C077, TP Sơn', [!!gd, !!kl, !!c077, !!tp]);
r = lay(own); ok(r.ok && r.huy && r.huy.quyen === 1 && r.huy.ds.length === 0, 'chủ sở hữu thấy mục Đơn đã hủy (trống), có quyền', r.huy);
ok(c.PropertiesService.getScriptProperties().getProperty('DH_CSDL_ID') == null, 'chưa hủy gì thì CHƯA tạo Sheet riêng');
ok(lay(tp).huy.quyen === 0 && lay(c077).huy.quyen === 0, 'TP Sơn và C077 không có quyền hủy (vẫn xem được)');
const p0 = { loai: 'HUY', dong: 3, ten: 'GAY NOVA X1 MAU XANH', maDon: '#A-01/11', lyDo: 'Khách đổi mẫu' };
r = huy(c077, p0); ok(!r.ok && /C019/.test(r.msg), 'C077 bị chặn', r);
r = huy(tp, p0); ok(!r.ok, 'TP Sơn bị chặn', r);
r = c.__goi('huyBotDon', 'token-gia', p0); ok(!r.ok, 'token giả bị chặn', r);
const c2 = TK.filter(t => String(t.MaNV).trim().toUpperCase() === 'C067').length;
ok(c2 === 1, 'C067 gắn đúng 1 tài khoản (điều kiện dhCoHuy_)', c2);
r = huy(gd, Object.assign({}, p0, { lyDo: 'abc' })); ok(!r.ok && /lý do/i.test(r.msg), 'lý do < 5 ký tự bị chặn', r);
r = huy(gd, Object.assign({}, p0, { lyDo: 'x'.repeat(201) })); ok(!r.ok, 'lý do > 200 ký tự bị chặn', r);
r = huy(gd, Object.assign({}, p0, { tab: 'ĐẾN HẠN 10 NGÀY' })); ok(!r.ok, 'tab ĐẾN HẠN 10 NGÀY bị chặn', r);
r = huy(gd, Object.assign({}, p0, { tab: 'HT-2026' })); ok(!r.ok, 'tab HT-2026 bị chặn', r);
r = huy(gd, Object.assign({}, p0, { tab: 'KHONG CO' })); ok(!r.ok, 'tab không tồn tại bị chặn', r);
[1, -3, 'a', 2.5, 99].forEach(d => { r = huy(gd, Object.assign({}, p0, { dong: d })); ok(!r.ok, 'dòng ' + JSON.stringify(d) + ' bị chặn', r); });
r = huy(gd, Object.assign({}, p0, { ten: 'TEN KHAC' })); ok(!r.ok && r.cu, 'tên không khớp dòng → từ chối, bảo Làm mới', r);
r = huy(gd, Object.assign({}, p0, { loai: 'XOA' })); ok(!r.ok, 'loại thao tác lạ bị chặn', r);
ok(c.PropertiesService.getScriptProperties().getProperty('DH_CSDL_ID') == null, 'các lần bị chặn không tạo Sheet riêng');

console.log('\n2. Hủy 1 mã – Sheet riêng, tô xám, loại khỏi tính toán');
const t0 = lay(own).don.filter(o => o.tab === 'OEM').reduce((a, o) => a + o.thieu, 0);
r = huy(kl, Object.assign({}, p0, { lyDo: '=HYPERLINK("x") khách đổi' })); ok(r.ok && r.n === 1, 'C067 hủy mã MAU XANH', r);
const idCsdl = c.PropertiesService.getScriptProperties().getProperty('DH_CSDL_ID'), ssH = c.SpreadsheetApp.openById(idCsdl);
ok(!!idCsdl && ssH.getName() === 'CSDL Đơn hàng (web)' && ['DongHuy', 'SuKien', 'ThongBao'].every(t => ssH.getSheetByName(t)), 'tự tạo Sheet "CSDL Đơn hàng (web)" có 3 tab, id lưu ScriptProperties');
const vH = ssH.getSheetByName('DongHuy').getDataRange().getValues();
ok(vH.length === 2 && vH[1][1] === '/A-01/11|GAY NOVA X1 MAU XANH|OEM' && vH[1][16] === 'HIEU_LUC', 'DongHuy ghi khóa tab + mã đơn + tên, trạng thái HIEU_LUC', vH[1]);
ok(!String(vH[1][8]).startsWith('#CONG_THUC') && /HYPERLINK/.test(vH[1][8]), 'lý do bắt đầu "=" lưu dạng chữ', vH[1][8]);
ok(mau(3).every(m => m === '#ffffff') && OEM[2][3] === 30 && OEM[2][1] === 'GAY NOVA X1 MAU XANH', '17/11 tối: Sheet đơn GIỮ NGUYÊN (không tô màu, chữ / số không đổi)', mau(3));
r = lay(own); x = dong(r, 'GAY NOVA X1 MAU XANH');
ok(!x && r.don.filter(o => o.tab === 'OEM').reduce((a, o) => a + o.thieu, 0) === t0 - 30, 'bảng đơn: dòng hủy biến mất, tổng còn thiếu OEM giảm 30');
ok(r.huy.ds.length === 1 && r.huy.ds[0].hl === 1 && !r.huy.ds[0].moCoi && r.huy.ds[0].td.qua.PHOI === 5 && r.huy.ds[0].giu.indexOf('PHOI') >= 0, 'mục Đơn đã hủy: 1 bản ghi, khớp dòng, lưu số đã giao (Phôi 5) + bộ phận đang giữ', r.huy.ds[0]);
ok(r.huy.ds[0].toi === 0 && r.huy.ds[0].moi === 1, 'chủ sở hữu: thông báo mới (người khác hủy)', r.huy.ds[0]);
ok(lay(kl).huy.ds[0].moi === 0, 'người hủy không tự nhận thông báo của mình');
r = huy(gd, p0); ok(!r.ok && /đã hủy/.test(r.msg), 'hủy lại mã đã hủy → báo đã hủy, không ghi thêm', r);
ok(ssH.getSheetByName('DongHuy').getLastRow() === 2, 'vẫn 1 bản ghi');
const pLenh = Object.assign({ tab: 'OEM' }, p0, { dong: 4, ten: 'GAY NOVA X1 MAU VANG', lenh: 'lenhtrung01' });
r = c.__goi('huyBotDon', gd, pLenh); const r2 = c.__goi('huyBotDon', gd, pLenh);
ok(r.ok && r2.ok && ssH.getSheetByName('DongHuy').getLastRow() === 3, 'bấm 2 lần cùng mã yêu cầu → chỉ 1 bản ghi', [r, r2]);
c.dhXoaCacheDon_(); r = lay(own, false);
ok(!dong(r, 'GAY NOVA X1 MAU VANG') && !dong(r, 'GAY NOVA X1 MAU XANH'), 'đọc từ bộ nhớ tạm vẫn áp lớp phủ');

console.log('\n3. Bớt SL – SL mới thay SL đặt, không trừ 2 lần');
const pb = { loai: 'BOT', dong: 2, ten: 'GAY NOVA X1 MAU DO', maDon: '#A-01/11', lyDo: 'Khách giảm số lượng' };
r = huy(gd, Object.assign({}, pb, { slMoi: 50 })); ok(!r.ok, 'SL mới = SL đặt bị chặn', r);
r = huy(gd, Object.assign({}, pb, { slMoi: 0 })); ok(!r.ok, 'SL mới = 0 bị chặn', r);
r = huy(gd, Object.assign({}, pb, { slMoi: 12.5 })); ok(!r.ok, 'SL mới lẻ bị chặn', r);
r = huy(gd, Object.assign({}, pb, { slMoi: 15 })); ok(r.ok, 'C019 bớt MAU DO 50 → 15', r);
x = dong(lay(own), 'GAY NOVA X1 MAU DO', '#A-01/11');
ok(x && x.sl === 15 && x.thieu === 15 && x.slGoc === 50 && x.qua.PHOI === 15 && x.qua.SON === 10 && x.bot && x.bot.moi === 15, 'dòng bớt: SL 15, còn thiếu 15, Phôi đã giao 20 → tính 15 (không vượt SL)', x);
ok(OEM[1][3] === 50 && mau(2)[0] === '#fce5cd', 'Sheet cũ không đổi số, không tô màu khi bớt');
r = c.__goi('luuDonGiaoNhan', tp, { tab: 'OEM', dong: 2, ten: x.ten, bp: 'SON', sl: '12', cu: { slDat: x.slGoc || x.sl, sl: (x.quaGoc || x.qua).SON, hen: '' } });
ok(r.ok && OEM[1][9] === 12, 'TP Sơn vẫn nhập được số trên dòng đã bớt (web gửi SL gốc trong Sheet → không báo xung đột giả)', [r, OEM[1][9]]);
r = c.__goi('luuDonGiaoNhan', tp, { tab: 'OEM', dong: 2, ten: x.ten, bp: 'SON', sl: '13', cu: { slDat: x.sl, sl: 12, hen: '' } });
ok(!r.ok && r.xungDot, '(đối chứng) gửi SL đã bớt thay SL Sheet → máy chủ báo lệch', r);
c.__goi('luuDonGiaoNhan', tp, { tab: 'OEM', dong: 2, ten: x.ten, bp: 'SON', sl: '10', cu: { slDat: 50, sl: 12, hen: '' } });
x = dong(lay(own), 'GAY NOVA X1 MAU DO', '#A-01/11'); ok(x.sl === 15 && x.thieu === 15, 'đọc lại lần nữa vẫn 15 (không trừ 2 lần)', x);
r = huy(gd, Object.assign({}, pb, { slMoi: 15 })); ok(!r.ok && /đã bớt/.test(r.msg), 'bớt lại đúng số cũ → báo đã bớt', r);
r = huy(gd, Object.assign({}, pb, { slMoi: 20 })); ok(r.ok, 'bớt lần 2 (đổi ý còn 20) thay bản cũ', r);
x = dong(lay(own), 'GAY NOVA X1 MAU DO', '#A-01/11'); ok(x.sl === 20 && x.thieu === 20, 'SL theo bản bớt mới nhất (20), không cộng dồn 2 lần bớt', x);
ok(ssH.getSheetByName('DongHuy').getDataRange().getValues().filter(v => v[16] === 'HIEU_LUC').length === 3, 'chỉ 3 bản ghi hiệu lực (bản bớt cũ → THAY_THE)');

console.log('\n4. Mã trùng tên trong cùng đơn + hủy cả đơn');
r = huy(gd, { loai: 'HUY', dong: 6, ten: 'GAY NOVA X1 MAU DO', maDon: '#B-02/11', lyDo: 'Nhập trùng dòng' });
x = lay(own).don.filter(o => o.maDon === '#B-02/11');
ok(r.ok && x.length === 1 && x[0].sl === 40 && x[0].dong === 5, 'hủy dòng trùng thứ 2 (khóa #2) – dòng thứ 1 vẫn còn', x);
r = huy(gd, { loai: 'HUY_DON', dong: 5, ten: 'GAY NOVA X1 MAU DO', maDon: '#B-02/11', lyDo: 'Khách hủy đơn' });
x = lay(own).don.filter(o => o.maDon === '#B-02/11');
ok(r.ok && r.n === 1 && /1 mã đã hủy trước đó/.test(r.msg) && x.length === 0 && r.nhom, 'hủy cả đơn #B: bỏ qua mã đã hủy, đơn biến khỏi bảng', r);
ok(mau(5).every(m => m === '#ffffff') && mau(6).every(m => m === '#ffffff'), 'hủy cả đơn #B: Sheet đơn giữ nguyên màu');
r = huy(gd, { loai: 'HUY_DON', dong: 5, ten: 'GAY NOVA X1 MAU DO', maDon: '#B-02/11', lyDo: 'Khách hủy đơn' }); ok(!r.ok, 'hủy cả đơn lần 2 → báo đã hủy hết', r);

console.log('\n5. Thông báo');
r = lay(own); const moi1 = r.huy.ds.filter(h => h.moi).length;
ok(moi1 >= 3, 'chủ sở hữu có ' + moi1 + ' thông báo chưa xem', moi1);
r = c.__goi('xemThongBaoHuy', own); ok(r.ok && r.xem, 'chủ sở hữu mở chuông → đánh dấu đã xem', r);
ok(lay(own).huy.ds.filter(h => h.moi).length === 0, 'hết thông báo mới của chủ sở hữu');
ok(lay(tp).huy.ds.filter(h => h.moi).length === moi1, 'TP Sơn vẫn còn thông báo (đã xem tính riêng từng tài khoản)');

console.log('\n6. Hoàn tác');
const rec = lay(own).huy.ds.find(h => h.ten === 'GAY NOVA X1 MAU XANH');
r = c.__goi('hoanTacHuyDon', c077, { id: rec.id, lyDo: 'Khách đặt lại' }); ok(!r.ok, 'C077 không hoàn tác được', r);
r = c.__goi('hoanTacHuyDon', gd, { id: rec.id, lyDo: '' }); ok(!r.ok, 'hoàn tác bắt buộc lý do', r);
r = c.__goi('hoanTacHuyDon', gd, { id: rec.id, lyDo: 'Khách đặt lại' }); ok(r.ok, 'C019 hoàn tác mã C067 đã hủy', r);
ok(dong(lay(own), 'GAY NOVA X1 MAU XANH') && mau(3).every(m => m === '#ffffff'), 'dòng hiện lại trên bảng, Sheet trả màu cũ (trắng)', mau(3));
r = c.__goi('hoanTacHuyDon', gd, { id: rec.id, lyDo: 'Khách đặt lại' }); ok(!r.ok, 'hoàn tác 2 lần bị chặn', r);
x = lay(own).huy.ds.find(h => h.id === rec.id); ok(x && x.hl === 0 && x.htAi && x.htLy === 'Khách đặt lại', 'mục Đơn đã hủy: bản ghi chuyển "đã hoàn tác", ghi ai + lý do', x);
/* hủy dòng có màu riêng rồi hoàn tác: trả đúng màu cam */
const bot = lay(own).huy.ds.find(h => h.loai === 'BOT' && h.hl); c.__goi('hoanTacHuyDon', gd, { id: bot.id, lyDo: 'Bớt nhầm số' });
ok(dong(lay(own), 'GAY NOVA X1 MAU DO', '#A-01/11').sl === 50, 'hoàn tác bớt → SL đặt về 50');
r = huy(gd, { loai: 'HUY', dong: 2, ten: 'GAY NOVA X1 MAU DO', maDon: '#A-01/11', lyDo: 'Thử màu cam' }); ok(r.ok && mau(2)[0] === '#fce5cd', 'hủy dòng màu cam → Sheet giữ màu cam', r);
c.__goi('hoanTacHuyDon', gd, { id: r.ids[0], lyDo: 'Thử màu cam' }); const m2 = mau(2);
ok(m2[0] === '#fce5cd' && m2[2] === '#fce5cd' && m2[3] === '#ffffff', 'hoàn tác trả đúng màu cam ở 3 ô đầu, trắng các ô sau', m2);
/* ai đó đổi màu dòng sau khi hủy -> hoàn tác giữ màu đó */
r = huy(gd, { loai: 'HUY', dong: 2, ten: 'GAY NOVA X1 MAU DO', maDon: '#A-01/11', lyDo: 'Thử đổi màu' });
shDH().getRange(2, 5).setBackground('#ff0000'); r = c.__goi('hoanTacHuyDon', gd, { id: r.ids[0], lyDo: 'Thử đổi màu' });
ok(r.ok && !/đổi màu/.test(r.msg) && mau(2)[4] === '#ff0000', 'người dùng tự đổi màu dòng → hoàn tác không đụng màu Sheet', [r.msg, mau(2)]);
const nhom = lay(own).huy.ds.find(h => h.nhom && h.hl).nhom;
r = c.__goi('hoanTacHuyDon', kl, { nhom: nhom, lyDo: 'Khách đặt lại đơn' });
ok(r.ok && lay(own).don.filter(o => o.maDon === '#B-02/11').length === 1, 'hoàn tác cả đơn #B (theo nhóm) – dòng hủy riêng lẻ trước đó vẫn hủy', r);

console.log('\n7. Mồ côi – Sheet đổi dòng, không áp sang dòng khác');
r = huy(gd, { loai: 'HUY', dong: 4, ten: 'GAY NOVA X1 MAU VANG', maDon: '#A-01/11', lyDo: 'Mã này hết hàng' });
ok(!r.ok && /đã hủy/.test(r.msg), 'MAU VANG đang hủy (từ mục 2)');
OEM[3][1] = 'GAY NOVA X1 MAU TIM';   // ai đó sửa tên dòng 4 trong Sheet
r = lay(own); const mc = r.huy.ds.find(h => h.ten === 'GAY NOVA X1 MAU VANG');
ok(mc && mc.moCoi === 1 && dong(r, 'GAY NOVA X1 MAU TIM'), 'lớp phủ MAU VANG thành mồ côi; dòng mới MAU TIM vẫn hiện (không bị hủy nhầm)', mc);
OEM.splice(1, 0, ['#Z-05/11', 'GAY CHEN THEM', '', 3, 3, '30/11', '', '', '', '', '', '']);   // chèn dòng đầu tab -> mọi dòng dời xuống
r = lay(own); x = dong(r, 'GAY NOVA X1 MAU DO', '#A-01/11');
ok(x && x.dong === 3 && x.sl === 50 && !!dong(r, 'GAY NOVA X1 MAU DO', '#B-02/11'), 'chèn dòng: khớp theo mã + tên, không theo số dòng', x);
r = huy(gd, { loai: 'HUY', dong: 3, ten: 'GAY NOVA X1 MAU XANH', maDon: '#A-01/11', lyDo: 'Thử dòng dời' });
ok(!r.ok && r.cu, 'web gửi số dòng cũ sau khi Sheet chèn dòng → từ chối, không tô nhầm', r);

console.log('\n8. Bản chụp / sản lượng: bớt SL không tính là sản lượng ra');
const cu = [['#A|X|OEM', 50, 50, 0, '', 'dangSX', 0]], nay = [['#A|X|OEM', 15, 15, 0, '', 'dangSX', 0, null, 35]];
x = c.dhTinhSanLuong_(cu, nay, {}, {}); ok(x.ra === 0 && x.mat === 35, 'bớt 35 trên web → thiếu giảm 35 tính là điều chỉnh (mất 35), ra 0', x);
x = c.dhTinhSanLuong_(cu, [['#A|X|OEM', 40, 20, 0, '', 'dangSX', 0, null, 10]], {}, {}); ok(x.ra === 20 && x.mat === 10, 'bớt 10 + làm ra 20 → ra 20, mất 10', x);
x = c.dhTinhSanLuong_(nay, [['#A|X|OEM', 15, 10, 0, '', 'dangSX', 0, null, 35]], {}, {}); ok(x.ra === 5 && x.mat === 0, 'hôm sau (vẫn bớt 35) làm ra 5 → ra 5, không trừ bớt lần 2', x);
r = huy(gd, { loai: 'BOT', dong: 3, ten: 'GAY NOVA X1 MAU DO', maDon: '#A-01/11', slMoi: 20, lyDo: 'Thử bản chụp' });
c.dhChup_(true); const ch = c.dhDocChup_(), hn = Object.keys(ch)[0], rr = (ch[hn] || []).find(z => z[0] === '/A-01/11|GAY NOVA X1 MAU DO|OEM');
ok(r.ok && rr && rr[1] === 20 && rr[2] === 20 && rr[8] === 30 && !(ch[hn] || []).some(z => /MAU VANG/.test(z[0])), 'bản chụp ngày: dòng bớt ghi SL 20 + đã bớt 30 (cột 9), dòng hủy không có', rr);

console.log('\n9. Giới hạn số lần mỗi giờ');
for (let i = 0; i < 40; i++) c.__goi('xemThongBaoHuy', gd);   // xem không tính vào giới hạn
const sk = ssH.getSheetByName('SuKien'), so = sk.getLastRow() - 1, tkGd = c.docPhien_(gd).tk;
const hdr = sk.getRange(1, 1, 1, 9).getValues()[0], gio = c.dhhGio_();
for (let i = 0; i < 30; i++) sk.appendRow(hdr.map(h => h === 'Luc' ? gio : h === 'Tk' ? tkGd : h === 'ThaoTac' ? 'HUY' : ''));
r = huy(gd, { loai: 'BOT', dong: 3, ten: 'GAY NOVA X1 MAU DO', maDon: '#A-01/11', slMoi: 10, lyDo: 'Thử giới hạn giờ' });
ok(!r.ok && /1 giờ/.test(r.msg), 'quá 30 lần / giờ → chặn', [so, r]);


/* 10. Web: cột STT, chip Đơn đã hủy, chuông, khối Điều chỉnh đơn trong bảng nổi (dữ liệu thật từ máy chủ giả lập) */
(async () => {
  console.log('\n10. Web');
  const { chromium } = require('/opt/node22/lib/node_modules/playwright');
  const dGd = lay(gd), dTp = lay(tp);
  const b = await chromium.launch(), er = [];
  const mo = async (w, d) => { const pg = await b.newPage({ viewport: { width: w, height: 900 } }); pg.on('pageerror', e => er.push(e.message));
    await pg.setContent('<html><head><style>*{box-sizing:border-box}</style></head><body><main id=main style="max-width:100%"></main></body></html>');
    await pg.addScriptTag({ content: 'window.esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\\"":"&quot;"}[c]));window.qtSo=n=>String(Math.round(n||0));window.toast=()=>{};window.__goi=[];window.call=(f,a,cb)=>{window.__goi.push([f,a]);cb&&cb(f==="huyBotDon"?{ok:true,msg:"Đã hủy X.",ids:["Habc123456789"],nhom:""}:{ok:true,msg:"ok"});};window.$=id=>document.getElementById(id);window.tabHienTai="dh";' });
    await pg.addScriptTag({ content: fs.readFileSync(path.join(__dirname, '..', 'QuyTrinh.html'), 'utf8').replace(/^[\s\S]*?<script>/, '').replace(/<\/script>[\s\S]*$/, '') });
    await pg.addStyleTag({ content: (fs.readFileSync(path.join(__dirname, '..', 'QuyTrinh.html'), 'utf8').match(/<style>([\s\S]*?)<\/style>/) || [, ''])[1] });
    await pg.evaluate(d => { window.DH = d; window.dhTai = () => {}; window.dhVeLai = () => { document.getElementById('main').innerHTML = dhVeBang(DH.don); }; DHV = 'bang'; }, d);
    return pg; };
  let pg = await mo(1300, dGd);
  let w = await pg.evaluate(() => { DHB.tab = 'OEM'; dhVeLai(); const o = {};
    o.stt = [...document.querySelectorAll('.dh-sh tbody td.c1 .dh-stt')].map(t => t.textContent); o.cot = document.querySelectorAll('.dh-sh thead tr:first-child th').length; o.c0 = document.querySelectorAll('.c0').length;
    o.c2 = [...document.querySelectorAll('.dh-sh tbody td.c2')].map(t => t.textContent).join('|');
    o.th0 = (document.querySelector('.dh-sh thead th') || {}).textContent;
    o.chip = (document.querySelector('.dh-tabb.huy') || {}).textContent; o.chuong = !!document.querySelector('.dh-chb');
    o.bot = (document.querySelector('.dh-hangoc') || {}).textContent || '';
    const r0 = DH.don.find(x => x.tab === 'OEM' && x.maDon === '#A-01/11'); DHB.mo = r0.tab + '|' + r0.dong; o.form = dhBForm(r0);
    DHHuy.mo = r0.tab + '|' + r0.dong + '|HUY'; o.formHuy = dhBForm(r0); DHHuy.mo = '';
    DHB.tab = '@huy'; dhVeLai(); o.huy = document.getElementById('main').innerHTML; o.the = document.querySelectorAll('.dh-hcard').length; o.htNut = [...document.querySelectorAll('.dh-hcard button')].filter(x => /Hoàn tác/.test(x.textContent)).length;
    return o; });
  ok(w.th0 === 'Mã đơn' && w.c0 === 0 && w.stt.length >= 2 && w.stt.every(t => /^\d+\/\d+$/.test(t)), 'thứ tự mã trong đơn (vd 2/3) nằm ngay ô Mã đơn – không thêm cột STT', [w.th0, w.c0, w.stt]);
  ok(!/mã \d+\/\d+/.test(w.c2), 'cột Mã sản phẩm không còn chữ "mã x/y"', w.c2.slice(0, 200));
  ok(/Đơn đã hủy/.test(w.chip) && w.chuong, 'có chip "Đơn đã hủy (n)" + chuông thông báo', w.chip);
  ok(/bớt từ 50/.test(w.bot), 'dòng đang bớt: ô SL đặt ghi "bớt từ 50" (không thêm cột)', w.bot);
  ok(/Điều chỉnh đơn/.test(w.form) && /Bớt SL/.test(w.form) && /Hủy mã này/.test(w.form), 'C019: bảng nổi có khối Điều chỉnh đơn (Bớt SL / Hủy mã này)');
  ok(/Lý do \(bắt buộc\)/.test(w.formHuy) && /disabled/.test(w.formHuy) && /Sheet đơn giữ nguyên/.test(w.formHuy), 'bấm Hủy mã này: hiện ô lý do + tóm tắt hậu quả, nút xác nhận khóa đến khi đủ lý do');
  ok(w.the >= 5 && w.htNut >= 1 && /Sheet đã đổi/.test(w.huy) && /không<\/b> áp sang dòng khác/.test(w.huy), 'mục Đơn đã hủy: thẻ từng mã, nút Hoàn tác, cảnh báo mồ côi', [w.the, w.htNut]);
  await pg.evaluate(() => { DHB.tab = 'OEM'; dhVeLai(); const r0 = DH.don.find(x => x.tab === 'OEM' && x.maDon === '#A-01/11'); DHB.mo = r0.tab + '|' + r0.dong; dhBNoi(); DHHuy.mo = r0.tab + '|' + r0.dong + '|HUY'; DHHuy.lenh = 'wtest1234'; dhBNoi(); });
  await pg.fill('#dhHuyLy', 'abc'); let dis = await pg.$eval('#dhHuyOK', e => e.disabled);
  await pg.fill('#dhHuyLy', 'Khách đổi mẫu'); const dis2 = await pg.$eval('#dhHuyOK', e => e.disabled);
  if (process.env.ANH) await pg.screenshot({ path: process.env.ANH + '/huy-noi.png' });
  await pg.click('#dhHuyOK'); const goi = await pg.evaluate(() => window.__goi.find(x => x[0] === 'huyBotDon'));
  ok(dis && !dis2 && goi && goi[1][0].loai === 'HUY' && goi[1][0].lyDo === 'Khách đổi mẫu' && goi[1][0].lenh === 'wtest1234', 'gõ lý do ≥ 5 ký tự mới bấm được; gửi huyBotDon đúng dòng + mã yêu cầu', [dis, dis2, goi]);
  /* 17/11: thanh Hoàn tác 10 giây */
  let hb = await pg.evaluate(() => { const b = document.getElementById('dhHoan'); return b && [b.innerText, getComputedStyle(b).position, b.getBoundingClientRect().right <= innerWidth + 1]; });
  ok(hb && /Đã hủy X/.test(hb[0]) && /Hoàn tác \(10\)/.test(hb[0]) && hb[1] === 'fixed' && hb[2], 'sau khi hủy: thanh "Hoàn tác (10)" hiện ở đáy, không tràn màn', hb);
  await pg.waitForTimeout(1300); hb = await pg.$eval('#dhHoanNut', e => e.textContent); ok(/Hoàn tác \((9|8)\)/.test(hb), 'đếm ngược giây', hb);
  if (process.env.ANH) await pg.screenshot({ path: process.env.ANH + '/huy-hoan10.png' });
  await pg.click('#dhHoanNut'); const ht = await pg.evaluate(() => window.__goi.find(x => x[0] === 'hoanTacHuyDon'));
  ok(ht && ht[1][0].id === 'Habc123456789' && /bấm nhầm/i.test(ht[1][0].lyDo) && !(await pg.$('#dhHoan')), 'bấm Hoàn tác: gọi hoanTacHuyDon đúng bản ghi, lý do "bấm nhầm" tự điền, thanh tắt', ht);
  await pg.evaluate(() => dhHoan10({ ok: true, msg: 'Đã hủy cả đơn', ids: ['Ha', 'Hb'], nhom: 'Dabc1234567' })); await pg.waitForTimeout(10500);
  ok(!(await pg.$('#dhHoan')), 'hết 10 giây thanh tự tắt (vẫn hoàn tác được ở mục Đơn đã hủy)');
  /* 17/11: tạm dừng sản xuất trên web */
  w = await pg.evaluate(() => { const o = {}, ds = DH.don.filter(x => x.tab === 'OEM' && x.thieu > 0 && !x.phu), r1 = ds[0];
    DHB.mo = ''; dhBNoi(); DHB.tab = 'OEM'; o.formDung0 = dhBForm(r1); DHHuy.mo = r1.tab + '|' + r1.dong + '|DUNG'; o.formDung = dhBForm(r1); DHHuy.mo = '';
    const k = (r1.maDon || '(không mã)') + '|' + r1.tab, coTruoc = dhCSDon().some(g => g.ma + '|' + g.tab === k && g.dong.indexOf(r1) >= 0);
    r1.dung = { id: 'Hdung0000001', nhom: '', ly: 'Chờ khách thanh toán', ai: 'Giám đốc', luc: '2026-10-25 08:00:00', hen: '' }; r1.st = 'tamDung';
    o.ra = coTruoc && !dhCSDon().some(g => g.dong.indexOf(r1) >= 0);
    dhVeLai(); o.nhan = (document.querySelector('.dh-dung') || {}).textContent || ''; o.nhanCls = (document.querySelector('.dh-dung') || {}).className || ''; o.chip = (document.querySelector('.dh-tabb.dung') || {}).textContent || '';
    o.form = dhBForm(r1); DHHuy.mo = r1.tab + '|' + r1.dong + '|CHAY'; o.formChay = dhBForm(r1); DHHuy.mo = '';
    DHB.tab = '@dung'; dhVeLai(); o.tom = (document.querySelector('.dh-dg-don') || {}).textContent || ''; o.dong = document.querySelectorAll('.dh-sh tbody td.c1').length;
    DHB.tab = 'OEM'; return o; });
  ok(/Tạm dừng mã này/.test(w.formDung0) && /Dự kiến chạy lại/.test(w.formDung) && /Chờ khách thanh toán/.test(w.formDung) && /không tính/.test(w.formDung) && /disabled/.test(w.formDung), 'C019: bảng nổi có "Tạm dừng mã này"; form: lý do bắt buộc (có lý do mẫu) + ngày dự kiến chạy lại + giải thích không tính', w.formDung.slice(0, 120));
  ok(w.ra, 'mã tạm dừng ra khỏi danh sách tính công suất (dhCSDon)');
  ok(/Tạm dừng · 23 ngày/.test(w.nhan) && /\bcam\b/.test(w.nhanCls) && /Tạm dừng/.test(w.chip), 'dòng vẫn hiện, nhãn "Tạm dừng · 23 ngày" màu cam (> 14 ngày); có chip mục Tạm dừng', [w.nhan, w.nhanCls, w.chip]);
  ok(/Đang tạm dừng 23 ngày/.test(w.form) && /Chạy lại mã này/.test(w.form) && /làm dở/.test(w.form), 'bảng nổi mã đang dừng: lý do, số ngày, nút Chạy lại, nhắc chỉ nhập hàng làm dở');
  ok(/Deadline mới/.test(w.formChay) && /Chạy lại sản xuất/.test(w.formChay), 'Chạy lại: hiện deadline hiện tại / ngày dự kiến nếu chạy lại + ô deadline mới');
  ok(/23 ngày/.test(w.tom) && /quá 14 ngày/.test(w.tom) && w.dong === 1, 'mục Tạm dừng: thẻ đơn (23 ngày, nhắc "đã quá 14 ngày – chạy lại hay hủy?") + bảng 1 dòng để nhập số', [w.tom, w.dong]);
  if (process.env.ANH) { await pg.evaluate(() => { DHB.tab = '@dung'; dhVeLai(); }); await pg.screenshot({ path: process.env.ANH + '/dung-muc.png' }); }
  if (process.env.ANH) { await pg.evaluate(() => { DHB.mo = ''; dhBNoi(); DHB.tab = 'OEM'; dhVeLai(); }); await pg.screenshot({ path: process.env.ANH + '/huy-bang.png' }); }
  await pg.close();
  /* TP Sơn: không có khối điều chỉnh; chuông có số; nhãn "bộ phận bạn đang giữ" */
  pg = await mo(390, dTp);
  w = await pg.evaluate(() => { DHB.tab = 'OEM'; dhVeLai(); const o = {}; const r0 = DH.don.find(x => x.tab === 'OEM'); o.form = dhBForm(r0);
    o.so = (document.querySelector('.dh-chb b') || {}).textContent; dhChuongMo(); o.menu = (document.querySelector('.dh-chm') || {}).innerHTML || ''; o.xem = window.__goi.some(x => x[0] === 'xemThongBaoHuy');
    o.so2 = (document.querySelector('.dh-chb b') || {}).textContent || '';
    DHHuy.chuong = false; DHB.tab = '@huy'; dhVeLai(); o.huy = document.getElementById('main').innerHTML; o.cha = (function(){ var e=document.querySelector('.dh-hcard'), a=[]; while(e&&e.tagName!=='BODY'){ a.push(e.tagName+'.'+e.className+':'+Math.round(e.getBoundingClientRect().width)); e=e.parentElement; } return a; })(); o.rong = [...document.querySelectorAll('.dh-hcard, .dh-hcard *, .dh-hg-don, .dh-ghi, .alert')].filter(e => e.getBoundingClientRect().right > 392).slice(0, 4).map(e => e.tagName + '.' + e.className + ' ' + Math.round(e.getBoundingClientRect().right));
    o.chm = 0; return o; });
  ok(!/Điều chỉnh đơn/.test(w.form) && !/Hoàn tác<\/button>/.test(w.huy), 'TP Sơn: không có nút hủy / bớt / hoàn tác (chỉ xem)');
  ok(+w.so > 0 && w.xem && !w.so2, 'TP Sơn: chuông có số chưa xem; mở ra → gọi xemThongBaoHuy, số mất', [w.so, w.so2]);
  ok(/Bộ phận bạn \(Sơn\) đang giữ 10 cái/.test(w.huy) && /dh-hcard[^"]* giu/.test(w.huy), 'TP Sơn: mã bộ phận Sơn đang giữ 10 cái có nhãn cam + viền cam', w.huy.slice(0, 300));
  ok(w.rong.length === 0, 'điện thoại 390px: thẻ mục Đơn đã hủy không tràn ngang (hàng chip tự cuộn như cũ)', [w.rong, w.cha]);
  await pg.evaluate(() => { DHB.tab = 'OEM'; dhVeLai(); DHHuy.chuong = true; dhVeLai(); });
  const bx = await pg.$eval('.dh-chm', e => { const r = e.getBoundingClientRect(); return [r.left, r.right]; }).catch(() => null);
  if (process.env.ANH) { await pg.screenshot({ path: process.env.ANH + '/huy-chuong-dt.png' }); await pg.evaluate(() => { DHHuy.chuong = false; DHB.tab = '@huy'; dhVeLai(); }); await pg.screenshot({ path: process.env.ANH + '/huy-muc-dt.png', fullPage: true }); }
  ok(bx && bx[0] >= 0 && bx[1] <= 390, 'điện thoại: hộp thông báo nằm trong màn hình', bx);
  await pg.close(); await b.close();
  ok(er.length === 0, 'không lỗi script', er);
  console.log('\n' + (l ? '✗ ' + l + ' / ' + n + ' lỗi' : '✓ Đạt ' + n + ' / ' + n));
  process.exit(l ? 1 : 0);
})();
