/** Kiểm thử tab "ĐẾN HẠN 10 NGÀY" trong Sheet đơn + đồng bộ 2 chiều (15/11 tối): DATA=<csdl.json> TZ=Asia/Ho_Chi_Minh node kpi-app/tests/tab10.js */
const path = require('path'), fs = require('fs'); const G = require('./gia-lap-kpi.js');
const DATA = process.env.DATA; if (!DATA) { console.log('Cần DATA='); process.exit(1); }
let n = 0, l = 0; const ok = (c, t, x) => { n++; if (!c) l++; console.log((c ? '  ✓ ' : '  ✗ ') + t + (c ? '' : ' → ' + JSON.stringify(x).slice(0, 400))); };
const du = JSON.parse(fs.readFileSync(DATA, 'utf8')); ['DonHangChup', 'PhanLoaiSKU', 'CauHinhSP', 'BTPTheoSKU', 'DonUuTien', 'DonHang10Goc'].forEach(k => { if (du[k]) du[k] = du[k].slice(0, 1); });
const iDoi = du.TaiKhoan[0].indexOf('DoiMatKhauLanDau'); du.TaiKhoan.slice(1).forEach(x => { x[iDoi] = 'Không'; });
const c = G.tao(path.join(__dirname, '..', 'Code.gs'), du, '2026-11-16T09:00:00+07:00');
const H = ['', 'Loại hàng cần sản xuất', 'Loại Phôi', 'Số lượng đặt', 'SX CÒN THIẾU', 'Deadline', 'PHÔI CỦA BP', 'Ngày hẹn trả BP60', 'SƠN CỦA BP', 'Ngày hẹn trả Sơn'];
const OEM = [H, ['#A-01/11', 'GAY NOVA X1 MAU DO', 'note A', 50, 50, '20/11', 10, '', 0, ''], ['', 'GAY NOVA X1 MAU XANH', '', 30, 30, '20/11', '', '', '', ''], ['#B-02/11', 'GAY NOVA X1 MAU VANG', '', 20, 20, '30/12', '', '', '', '']];
const KHO = [H, ['#K-03/11', 'GAY RETRO DEN', '', 40, 40, '18/11', 5, '', '', '']];
const sheets = { OEM: OEM, KHO: KHO }; c.__ngoai = { [c.DH_SHEET_ID]: { ten: 'x', sheets: sheets } }; c.dhDocDon_(true);
const sh = () => c.SpreadsheetApp.openById(c.DH_SHEET_ID).getSheetByName('ĐẾN HẠN 10 NGÀY');
let r = c.dhTab10Tao_(); const t10 = () => sh().getDataRange().getValues();
let v = t10(), dau = v[0], ci = k => dau.indexOf(k);
ok(r.n === 3 && v.length === 4, 'lọc đúng 3 dòng hạn trong 10 ngày (bỏ đơn hạn 30/12)', [r, v.length]);
ok(v[1][0] === 'Kho' && v[2][0] === 'OEM' && v[1][1] === '#K-03/11', 'xếp theo hạn sớm trước, có cột KÊNH', v.slice(1).map(x => x.slice(0, 3)));
ok(ci('SL PHÔI') > 0 && ci('HẸN SƠN') > 0 && ci('DEADLINE') > 0 && ci('NOTE (LOẠI PHÔI)') > 0 && v[2][ci('NOTE (LOẠI PHÔI)')] === 'note A' && v[2][ci('SL PHÔI')] === 10, 'có cột sửa được (Deadline, Note, SL / hẹn bộ phận) chép đúng ô tab kênh', dau);
ok(OEM[0].includes('MÃ DÒNG WEB') && /^W/.test(String(OEM[1][OEM[0].indexOf('MÃ DÒNG WEB')])), 'tab kênh có cột MÃ DÒNG WEB, dòng được cấp mã', OEM[0]);
ok(!c.DH_TAB_LOAI.test('ĐẾN HẠN 10 NGÀY') === false, 'tab mới không bị đọc như tab kênh (không cộng 2 lần)');
/* 1) sửa trong tab 10 -> chép về tab kênh */
sh().getRange(3, ci('SL PHÔI') + 1).setValue(25); sh().getRange(3, ci('HẸN SƠN') + 1).setValue('22/11');
let k = c.dhTab10DongBo_(); ok(k.chep === 2 && OEM[1][6] === 25 && OEM[1][9] === '22/11', 'sửa SL Phôi + hẹn Sơn ở tab 10 → chép về đúng dòng tab OEM', [k, OEM[1]]);
/* 2) chèn dòng ở tab kênh -> vẫn tìm đúng dòng nhờ mã dòng */
OEM.splice(1, 0, ['#Z-05/11', 'GAY CHEN THEM', '', 5, 5, '', '', '', '', '']);
sh().getRange(3, ci('SL PHÔI') + 1).setValue(30); k = c.dhTab10DongBo_();
ok(OEM[2][1] === 'GAY NOVA X1 MAU DO' && OEM[2][6] === 30 && OEM[1][6] === '', 'chèn dòng phía trên ở tab kênh → vẫn chép đúng dòng (theo MÃ DÒNG WEB)', [OEM[1], OEM[2]]);
/* 3) tab kênh đổi (TP gõ thẳng / web) -> cập nhật tab 10 */
OEM[2][8] = 12; k = c.dhTab10DongBo_(); ok(k.capNhat === 1 && t10()[2][ci('SL SƠN')] === 12, 'TP sửa thẳng ở tab kênh → tab 10 tự cập nhật', [k, t10()[2]]);
/* 4) cả hai cùng sửa -> giữ tab kênh, báo xung đột */
OEM[2][8] = 15; sh().getRange(3, ci('SL SƠN') + 1).setValue(18); k = c.dhTab10DongBo_();
ok(k.xungDot === 1 && OEM[2][8] === 15 && t10()[2][ci('SL SƠN')] === 15, 'hai nơi cùng sửa khác nhau → giữ số tab kênh, tab 10 ghi lại + báo', [k, OEM[2][8], t10()[2][ci('SL SƠN')]]);
/* 5) SL giảm -> vẫn chép, đếm cảnh báo */
sh().getRange(3, ci('SL PHÔI') + 1).setValue(20); k = c.dhTab10DongBo_(); ok(k.chep === 1 && k.giam === 1 && OEM[2][6] === 20, 'SL giảm → vẫn chép (cảnh báo vàng, không chặn)', k);
/* 6) dòng gốc bị xóa -> không ghi nhầm */
const daXoa = OEM.splice(3, 1)[0]; sh().getRange(4, ci('SL PHÔI') + 1).setValue(7); k = c.dhTab10DongBo_();
ok(k.mat === 1 && !OEM.some(rw => rw[6] === 7), 'dòng gốc bị xóa → báo mất gốc, không chép vào dòng khác', [k, daXoa]);
/* 7) làm mới: đồng bộ trước rồi dựng lại; web gọi lamMoiTab10 có phân quyền */
OEM.splice(3, 0, daXoa); sh().getRange(2, ci('DEADLINE') + 1).setValue('19/11');
const TK = c.doc_('TaiKhoan').filter(t => t.TrangThai === 'Đang dùng'), tp = c.__phienDai(TK.find(t => String(t.VaiTro).trim() === 'TP')), gd = c.__phienDai(TK.find(t => String(t.MaNV).toUpperCase() === 'C019'));
ok(!c.__goi('lamMoiTab10', tp).ok, 'trưởng phòng không bấm Làm mới được');
r = c.__goi('lamMoiTab10', gd); ok(r.ok && KHO[1][5] === '19/11' && r.tab10 && r.tab10.n >= 3, 'Giám đốc làm mới: số vừa sửa ở tab 10 (deadline Kho) được chép trước khi dựng lại', [r, KHO[1]]);
/* 8) DH_TAB10_SUA chỉ chạy khi sửa đúng tab */
let goi = 0; const goc = c.dhTab10DongBo_; c.dhTab10DongBo_ = () => { goi++; return {}; };
c.DH_TAB10_SUA({ range: { getSheet: () => ({ getName: () => 'OEM' }), getRow: () => 3 } }); c.DH_TAB10_SUA({ range: { getSheet: () => ({ getName: () => 'ĐẾN HẠN 10 NGÀY' }), getRow: () => 3 } });
c.dhTab10DongBo_ = goc; ok(goi === 1, 'trigger khi sửa: chỉ đồng bộ khi sửa tab ĐẾN HẠN 10 NGÀY', goi);
console.log(n + ' kiểm thử, ' + l + ' lỗi'); process.exit(l ? 1 : 0);
