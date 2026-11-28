/** 28/11 – duyệt đơn trên web ghi vào Sheet GIỐNG CÁCH TAB ĐANG GHI (chủ dự án: "sheet ghi mã đơn ở mỗi dòng sản phẩm").
 *   DATA=<csdl.json> TZ=Asia/Ho_Chi_Minh node kpi-app/tests/ghi-sheet.js */
const path = require('path'), fs = require('fs'); const G = require('./gia-lap-kpi.js');
let n = 0, l = 0; const ok = (c, t, x) => { n++; if (!c) l++; console.log((c ? '  ✓ ' : '  ✗ ') + t + (c ? '' : ' → ' + String(JSON.stringify(x)).slice(0, 300))); };
const du = JSON.parse(fs.readFileSync(process.env.DATA, 'utf8'));
const c = G.tao(path.join(__dirname, '..', 'Code.gs'), du, '2026-11-28T09:00:00+07:00');
const H = ['', 'Loại hàng cần sản xuất', 'Loại Phôi', 'Số lượng đặt', 'SX CÒN THIẾU', 'Deadline'];
const KHO = [H, ['KHO-16.10', 'GAY A', '', 24, '=D2-0', '14/12/2026'], ['', 'GAY B', '', 24, '=D3-0', '14/12/2026'], ['', '', 'TỔNG SL CÒN THIẾU', '', '=SUM(E2:E3)', '']];
const LE = [H, ['#R1-04/11', 'GAY C', 'note', 1, 1, ''], ['#R1-04/11', 'GAY D', 'note', 1, 1, ''], ['#R2-05/11', 'GAY E', '', 1, 1, '']];
const POD = [H, ['POD-1', 'GAY F', '', 1, 1, ''], ['', 'GAY G', '', 1, 1, ''], ['POD-2', 'GAY H', '', 1, 1, '']];
c.__ngoai = { [c.DH_SHEET_ID]: { ten: 'x', sheets: { KHO: KHO, 'WEB LẺ ĐƠN THƯỜNG': LE, 'POD-A.BÁCH': POD } } };
const don = (tab, ma) => ({ Tab: tab, MaDon: ma, GhiChu: '', _d: [{ ten: 'MOI 1', sl: 5, gc: '' }, { ten: 'MOI 2', sl: 3, gc: '' }, { ten: 'MOI 3', sl: 2, gc: '' }] });
console.log('1. Tab KHO (mã chỉ dòng đầu, có dòng TỔNG)');
let g = c.dbGhiSheet_(don('KHO', 'KHO-28.11'), '2026-12-20');
ok(g[0] === 5 && g[1] === 3 && KHO[4][0] === 'KHO-28.11' && KHO[5][0] === '' && KHO[6][0] === '', 'mã đơn chỉ ở dòng đầu đơn', KHO.slice(4).map(r => r[0]));
ok(KHO[7] && KHO[7][2] === 'TỔNG SL CÒN THIẾU' && /=SUM\(E5:E7\)/.test(String(KHO[7][4])) && !KHO[7][1], 'thêm dòng TỔNG SL CÒN THIẾU = SUM các dòng của đơn', KHO[7]);
ok(/=R\[0\]C\[-1\]-0|=D5-0|R1C1|-0/.test(String(KHO[4][4])) && !/SUM/.test(String(KHO[4][4])), 'cột SX CÒN THIẾU chép công thức của dòng SẢN PHẨM (không chép SUM của dòng TỔNG)', KHO[4]);
console.log('2. Tab Web lẻ thường (lặp mã mọi dòng, không có dòng TỔNG)');
g = c.dbGhiSheet_(don('WEB LẺ ĐƠN THƯỜNG', '#R9-28/11'), '');
ok(LE[4][0] === '#R9-28/11' && LE[5][0] === '#R9-28/11' && LE[6][0] === '#R9-28/11' && LE.length === 7, 'mã đơn ở mọi dòng, không thêm dòng TỔNG', LE.slice(4).map(r => r[0]));
console.log('3. Tab POD (mã chỉ dòng đầu, không có dòng TỔNG)');
g = c.dbGhiSheet_(don('POD-A.BÁCH', 'POD-9'), '');
ok(POD[4][0] === 'POD-9' && POD[5][0] === '' && POD.length === 7, 'mã đơn chỉ dòng đầu, không thêm dòng TỔNG', POD.slice(4).map(r => r[0]));
console.log('4. Web đọc lại đúng mã đơn cho mọi dòng');
const d = c.dhDocDon_(true); ok(d.don.filter(o => o.maDon === 'KHO-28.11').length === 3 && d.don.filter(o => o.maDon === 'POD-9').length === 3, 'đọc lại: 3 dòng thuộc đúng đơn', d.don.map(o => o.tab + ' ' + o.maDon + ' ' + o.ten).slice(0, 12));
console.log('\n' + (n - l) + '/' + n + ' đạt'); process.exit(l ? 1 : 0);
