/** Kiểm thử cột phụ đơn (15/11 đêm): hỏng cần làm bù, 3 cột Đóng gói, chú thích – DATA=<csdl.json> TZ=Asia/Ho_Chi_Minh node kpi-app/tests/cot-phu.js */
const path = require('path'), fs = require('fs'); const G = require('./gia-lap-kpi.js');
const DATA = process.env.DATA; if (!DATA) { console.log('Cần DATA='); process.exit(1); }
let n = 0, l = 0; const ok = (c, t, x) => { n++; if (!c) l++; console.log((c ? '  ✓ ' : '  ✗ ') + t + (c ? '' : ' → ' + JSON.stringify(x).slice(0, 400))); };
const du = JSON.parse(fs.readFileSync(DATA, 'utf8')); ['DonHangChup', 'PhanLoaiSKU', 'CauHinhSP', 'BTPTheoSKU', 'DonUuTien'].forEach(k => { if (du[k]) du[k] = du[k].slice(0, 1); });
const iDoi = du.TaiKhoan[0].indexOf('DoiMatKhauLanDau'); du.TaiKhoan.slice(1).forEach(x => { x[iDoi] = 'Không'; });
const c = G.tao(path.join(__dirname, '..', 'Code.gs'), du, '2026-11-16T09:00:00+07:00');
const H = ['', 'Loại hàng cần sản xuất', 'Loại Phôi', 'Số lượng đặt', 'SX CÒN THIẾU', 'Deadline', 'HẠN MỚI HT ĐƠN CŨ', 'TỔNG SP CÓ THỂ GIAO: Của Tuyết Anh', 'Hàng Còn lại trong kho và đóng gói, có thể giao', 'HÀNG ĐI- ĐÃ TRẢ KHÁCH', 'CHÚ THÍCH CÁC BỘ PHẬN', '', 'Phôi của Phố', 'Ngày hẹn trả BP60', 'Sơn của Khoa', 'Hỏng cần làm bù', 'Ngày hẹn trả SƠN', 'Đóng gói của Tuyết Anh', 'Hàng lấy dưới Kho TP', 'Tổng cộng hàng ĐG nhận từ HT', 'Hỏng Cần làm bù'];
const R = ['#A-01/11', 'GAY NOVA X1 MAU DO', '', 50, 50, '30/11', '', '=I2+J2', 3, 4, 'ghi chú cũ', '', 10, '', 5, 2, '', '', '', '', ''];
const OEM = [H, R, ['', 'GAY NOVA X1 MAU XANH', '', 30, 30, '30/11', '', 0, 0, 0, '', '', '', '', '', '', '', '', '', '', '']];
c.__ngoai = { [c.DH_SHEET_ID]: { ten: 'x', sheets: { OEM: OEM } } }; c.dhDocDon_(true);
const TK = c.doc_('TaiKhoan').filter(t => t.TrangThai === 'Đang dùng'), tk = (vt, x) => c.__phienDai(TK.find(t => /TP|PP/.test(t.VaiTro) && String(t.MaXuong) === x));
const dg = tk('TP', 'DG'), son = tk('TP', 'SON'), own = c.__phienDai(TK.find(t => String(t.VaiTro).trim() === 'OWNER'));
let r = c.__goi('layDonHangXuong', own, true), o = r.don[0], m = r.cot.OEM;
ok(o.giao === 0 || o.giao >= 0, 'đọc được đơn'); ok(o.kho === 3 && o.daTra === 4 && o.chuThich === 'ghi chú cũ' && o.hong.SON === 2 && o.hong.PHOI === undefined, 'đọc: còn trong kho 3, đã trả 4, chú thích, hỏng Sơn 2; Phôi KHÔNG lấy nhầm hỏng của Sơn', [o.kho, o.daTra, o.chuThich, o.hong]);
ok(m.giao === 7 && m.kho === 8 && m.tra === 9 && m.ct === 10 && m.hong.SON === 15 && m.hong.DG === 20 && m.hong.PHOI === undefined, 'bản đồ cột gửi cho web đúng', m);
const P = x => Object.assign({ tab: 'OEM', dong: 2, ten: 'GAY NOVA X1 MAU DO' }, x);
r = c.__goi('luuCotPhuDon', son, P({ bp: 'SON', kho: { moi: '9', cu: 3 } })); ok(!r.ok, 'TP Sơn không nhập được cột của Đóng gói', r);
r = c.__goi('luuCotPhuDon', son, P({ bp: 'DG', hong: { moi: '1', cu: 0 } })); ok(!r.ok, 'TP Sơn không nhập hỏng cho bộ phận khác', r);
r = c.__goi('luuCotPhuDon', son, P({ bp: 'SON', hong: { moi: '6', cu: 2 }, ct: { moi: '=HYPERLINK("x")', cu: 'ghi chú cũ' } }));
ok(r.ok && OEM[1][15] === 6 && r.kq.hong.SON === 6 && !String(OEM[1][10]).startsWith('#CONG_THUC') && /HYPERLINK/.test(OEM[1][10]), 'TP Sơn ghi hỏng Sơn 6 + chú thích (chữ "=" không thành công thức)', [r, OEM[1][15], OEM[1][10]]);
r = c.__goi('luuCotPhuDon', son, P({ bp: 'SON', hong: { moi: '7', cu: 2 } })); ok(!r.ok && r.xungDot, 'số web đang thấy khác Sheet → báo xung đột', r);
r = c.__goi('luuCotPhuDon', dg, P({ bp: 'DG', giao: { moi: '20', cu: 0 }, kho: { moi: '12', cu: 3 }, tra: { moi: '8', cu: 4 }, hong: { moi: '1', cu: 0 } }));
ok(r.ok && OEM[1][8] === 12 && OEM[1][9] === 8 && OEM[1][20] === 1 && OEM[1][7] === '=I2+J2' && /CÔNG THỨC/.test(r.msg), 'TP Đóng gói ghi kho 12, đã trả 8, hỏng ĐG 1; ô "Có thể giao" là công thức → giữ nguyên, có báo', [r.msg, OEM[1]]);
r = c.__goi('luuCotPhuDon', dg, P({ ten: 'TEN KHAC', bp: 'DG', kho: { moi: '1', cu: 12 } })); ok(!r.ok, 'tên hàng ở dòng không khớp → từ chối', r);
r = c.__goi('luuCotPhuDon', dg, P({ bp: 'DG', tra: { moi: '', cu: 8 } })); ok(r.ok && OEM[1][9] === '', 'xóa trống ô được', [r, OEM[1][9]]);

console.log('\n16/11: sửa thẳng trong bảng (luuBangDon)');
const uuTK = TK.find(t => ['C019', 'C077', 'C067'].includes(String(t.MaNV).trim().toUpperCase()) && String(t.VaiTro).trim() !== 'OWNER'), uu = uuTK && c.__phienDai(uuTK);
const B = (x) => Object.assign({ tab: 'OEM', dong: 3, ten: 'GAY NOVA X1 MAU XANH' }, x);
r = c.__goi('luuBangDon', son, { ds: [B({ sl: { moi: '40', cu: 30 } })] }); ok(!r.ok && OEM[2][3] === 30, 'TP Sơn không sửa được SL đặt', r);
r = c.__goi('luuBangDon', dg, { ds: [B({ dl: { moi: '2026-12-05', cu: '2026-11-30' } })] }); ok(!r.ok, 'TP Đóng gói không sửa được deadline', r);
r = c.__goi('luuBangDon', son, { ds: [B({ kho: { moi: '5', cu: 0 } })] }); ok(!r.ok && OEM[2][8] === 0, 'TP Sơn không nhập được cột Đóng gói', r);
ok(!!uu, 'có tài khoản ban điều hành (C019 / C077 / C067) để thử', uuTK && uuTK.MaNV);
if (uu) {
  r = c.__goi('luuBangDon', uu, { ds: [B({ sl: { moi: '40', cu: 30 }, dl: { moi: '2026-12-05', cu: '2026-11-30' }, kho: { moi: '5', cu: 0 }, hong: { moi: '2', cu: 0 } }), P({ dong: 2, tra: { moi: '3', cu: 0 } })] });
  ok(r.ok && OEM[2][3] === 40 && /^'?05\/12\/2026$/.test(OEM[2][5]) && OEM[2][8] === 5 && OEM[2][20] === 2 && OEM[1][9] === 3 && r.n === 5, 'ban điều hành: 1 lần lưu ghi SL đặt 40, deadline 05/12, trong kho 5, hỏng ĐG 2 (2 dòng)', [r, OEM[2], OEM[1][9]]);
  r = c.__goi('luuBangDon', uu, { ds: [B({ sl: { moi: '45', cu: 30 } })] }); ok(!r.ok && r.xungDot && OEM[2][3] === 40, 'số web đang thấy khác Sheet → hỏi ghi đè, chưa ghi', r);
  r = c.__goi('luuBangDon', uu, { boQua: true, ds: [B({ sl: { moi: '45', cu: 30 } })] }); ok(r.ok && OEM[2][3] === 45, 'bấm OK ghi đè → ghi', r);
  r = c.__goi('luuBangDon', uu, { ds: [B({ sl: { moi: '', cu: 45 } })] }); ok(!r.ok && OEM[2][3] === 45, 'SL đặt không cho để trống', r);
  r = c.__goi('luuBangDon', uu, { ds: [P({ dong: 2, giao: { moi: '9', cu: 0 } })] }); ok(r.ok && OEM[1][7] === '=I2+J2' && /CÔNG THỨC/.test(r.msg), 'ô công thức (Có thể giao) giữ nguyên, có báo', r);
  r = c.__goi('luuBangDon', uu, { ds: [B({ ten: 'KHAC', kho: { moi: '1', cu: 5 } })] }); ok(!r.ok && OEM[2][8] === 5, 'tên hàng không khớp dòng → không ghi', r);
}
r = c.__goi('luuBangDon', dg, { ds: [B({ hong: { moi: '4', cu: 2 }, tra: { moi: '1', cu: 0 } })] }); ok(r.ok && OEM[2][20] === 4 && OEM[2][9] === 1, 'TP Đóng gói ghi hỏng ĐG + đã trả khách', [r, OEM[2]]);
console.log(n + ' kiểm thử, ' + l + ' lỗi'); process.exit(l ? 1 : 0);
