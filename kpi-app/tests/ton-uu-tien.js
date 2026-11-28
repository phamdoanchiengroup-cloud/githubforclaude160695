/** 28/11 – mã ưu tiên lấy Có thể giao / Tồn kho + ĐG / Đã trả khách từ tab ĐƠN ƯU TIÊN (thay số tab kênh, không cộng); web sửa thì ghi vào tab ưu tiên.
 *   DATA=<csdl.json> TZ=Asia/Ho_Chi_Minh node kpi-app/tests/ton-uu-tien.js */
const path = require('path'), fs = require('fs'); const G = require('./gia-lap-kpi.js');
let n = 0, l = 0; const ok = (c, t, x) => { n++; if (!c) l++; console.log((c ? '  ✓ ' : '  ✗ ') + t + (c ? '' : ' → ' + String(JSON.stringify(x)).slice(0, 300))); };
const du = JSON.parse(fs.readFileSync(process.env.DATA, 'utf8')); du.DonHangChup = (du.DonHangChup || [[]]).slice(0, 1);
const c = G.tao(path.join(__dirname, '..', 'Code.gs'), du, '2026-11-28T09:00:00+07:00');
const H = ['', 'Loại hàng cần sản xuất', 'Loại Phôi', 'Số lượng đặt', 'SX CÒN THIẾU', 'Deadline', 'HẠN MỚI HT ĐƠN CŨ', 'TỔNG SP CÓ THỂ GIAO: Của Tuyết Anh', 'Hàng Còn lại trong kho và đóng gói, có thể giao', 'HÀNG ĐI- ĐÃ TRẢ KHÁCH', 'CHÚ THÍCH CÁC BỘ PHẬN'];
const KHO = [H, ['KHO-25/09', 'GAY A', '', 60, 0, '25/11', '', 55, 55, '', ''], ['', 'GAY B', '', 30, 5, '25/11', '', 20, 20, '', ''], ['KHO-4.11', 'GAY C', '', 28, 0, '31/12', '', 6, 6, '', ''], ['', 'GAY C', '', 28, 0, '31/12', '', 34, 34, '', '']];
const UU = [H, ['KHO-25/09', 'GAY A', '', 60, 0, '25/11', '', 60, 30, 30, ''], ['KHO-4.11', 'GAY C', '', 28, 0, '31/12', '', 9, 9, '', '']];
c.__ngoai = { [c.DH_SHEET_ID]: { ten: 'x', sheets: { KHO: KHO, 'ĐƠN ƯU TIÊN': UU } } };
const d = c.dhDocDon_(true), k = d.don.filter(o => !o.phu && o.tab === 'KHO');
const a = k.find(o => o.ten === 'GAY A'), b = k.find(o => o.ten === 'GAY B'), cc = k.filter(o => o.ten === 'GAY C');
ok(a.giao === 60 && a.kho === 30 && a.daTra === 30, 'mã có ở tab ưu tiên: lấy H/I/J của tab ưu tiên (60 / 30 / 30), không lấy tab KHO (55 / 55)', a);
ok(b.kho === 20 && !b.dgUu, 'mã không ưu tiên: giữ số tab KHO', b);
ok(cc.every(o => !o.dgUu) && cc[0].kho === 6 && cc[1].kho === 34, 'tab KHO có 2 dòng trùng mã + tên: không thay (tránh đếm trùng)', cc);
ok(k.reduce((s, o) => s + o.kho, 0) === 30 + 20 + 6 + 34, 'tổng tồn không cộng thêm dòng tab ưu tiên');
const own = c.__phienDai(c.doc_('TaiKhoan').find(t => String(t.VaiTro).trim() === 'OWNER'));
const r = c.__goi('luuBangDon', own, { ds: [{ tab: 'KHO', dong: a.dong, ten: a.ten, kho: { moi: 29, cu: 30 }, sl: { moi: 61, cu: 60 } }] });
ok(r.ok && UU[1][8] === 29 && KHO[1][8] === 55 && KHO[1][3] === 61, 'web sửa Tồn kho mã ưu tiên → ghi vào tab ĐƠN ƯU TIÊN; SL đặt vẫn ghi tab KHO', [r, UU[1][8], KHO[1][8], KHO[1][3]]);
console.log('\n' + (n - l) + '/' + n + ' đạt'); process.exit(l ? 1 : 0);
