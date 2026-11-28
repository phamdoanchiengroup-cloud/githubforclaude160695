/** 28/11 – tab ĐƠN ƯU TIÊN là KÊNH RIÊNG (chủ dự án đã xóa dòng trùng ở tab KHO): làn Kho, mọi cột đọc / ghi ở tab ưu tiên, nút lọc riêng.
 *   DATA=<csdl.json> TZ=Asia/Ho_Chi_Minh node kpi-app/tests/uu-tab.js   (thay ton-uu-tien.js) */
const path = require('path'), fs = require('fs'); const G = require('./gia-lap-kpi.js');
let n = 0, l = 0; const ok = (c, t, x) => { n++; if (!c) l++; console.log((c ? '  ✓ ' : '  ✗ ') + t + (c ? '' : ' → ' + String(JSON.stringify(x)).slice(0, 300))); };
const du = JSON.parse(fs.readFileSync(process.env.DATA, 'utf8')); du.DonHangChup = (du.DonHangChup || [[]]).slice(0, 1);
const H = ['', 'Loại hàng cần sản xuất', 'Loại Phôi', 'Số lượng đặt', 'SX CÒN THIẾU', 'Deadline', 'HẠN MỚI HT ĐƠN CŨ', 'TỔNG SP CÓ THỂ GIAO: Của Tuyết Anh', 'Hàng Còn lại trong kho và đóng gói, có thể giao', 'HÀNG ĐI- ĐÃ TRẢ KHÁCH', 'CHÚ THÍCH CÁC BỘ PHẬN'];
const tao = (KHO, UU) => { const c = G.tao(path.join(__dirname, '..', 'Code.gs'), du, '2026-11-28T09:00:00+07:00'); c.__ngoai = { [c.DH_SHEET_ID]: { ten: 'x', sheets: { KHO: KHO, 'ĐƠN ƯU TIÊN': UU } } }; return c; };
console.log('1. Không trùng (sau khi xóa ở tab KHO)');
{ const KHO = [H, ['KHO-02/11', 'GAY B', '', 30, 5, '25/12', '', 20, 20, '', '']], UU = [H, ['KHO-25/09', 'GAY A', '', 60, 10, '25/11', '', 60, 30, 30, ''], ['', 'GAY D', '', 8, 8, '25/11', '', 0, 0, '', '']];
  const c = tao(KHO, UU), d = c.dhDocDon_(true), u = d.don.filter(o => o.tab === 'ĐƠN ƯU TIÊN');
  ok(d.don.length === 3 && u.length === 2, 'đọc cả 2 tab, không trùng: 1 dòng KHO + 2 dòng ưu tiên', d.don.map(o => o.tab + ' ' + o.ten));
  ok(u.every(o => o.uuTien && o.kenh === 'ĐƠN ƯU TIÊN' && !o.phu), 'dòng tab ưu tiên: kênh "ĐƠN ƯU TIÊN", là hàng ưu tiên, là dòng thật (không phải bản chép)', u[0]);
  ok(u[0].giao === 60 && u[0].kho === 30 && u[0].daTra === 30 && u[1].maDon === 'KHO-25/09', 'Có thể giao / Tồn kho + ĐG / Đã trả + mã đơn gộp dòng lấy đúng tab ưu tiên', u);
  ok(d.uu.length === 2 && d.trungUu.length === 0 && !Object.keys(d.tabPhu || {}).some(t => /ƯU TIÊN/.test(t)), 'mục Ưu tiên = 2 dòng; không còn tab bản chép', [d.uu.length, d.trungUu, Object.keys(d.tabPhu || {})]);
  const own = c.__phienDai(c.doc_('TaiKhoan').find(t => String(t.VaiTro).trim() === 'OWNER'));
  const r = c.__goi('luuBangDon', own, { ds: [{ tab: 'ĐƠN ƯU TIÊN', dong: u[0].dong, ten: u[0].ten, kho: { moi: 29, cu: 30 }, sl: { moi: 61, cu: 60 } }] });
  ok(r.ok && UU[1][8] === 29 && UU[1][3] === 61, 'web sửa Tồn kho + SL đặt → ghi thẳng vào tab ĐƠN ƯU TIÊN', [r, UU[1][8], UU[1][3]]);
  const b = c.__goi('layBangDonNhaMay', own); ok(b.ok && b.ds.filter(x => x[0] === 'ĐƠN ƯU TIÊN').length === 2 && b.kenh.some(k => k[0] === 'ĐƠN ƯU TIÊN'), 'Order-Flow: có dòng + nút lọc kênh ĐƠN ƯU TIÊN', b.kenh);
  const x = c.__goi('layDonHangXuong', own, true); ok(x.ok && x.kenhDs.some(k => k[0] === 'ĐƠN ƯU TIÊN') && x.don.filter(o => o.tab === 'ĐƠN ƯU TIÊN').length === 2, 'tab Đơn hàng: có nút lọc kênh ĐƠN ƯU TIÊN', x.kenhDs);
  const d2 = c.dhDocDon_(false), RR = c.dbkMoPhong_(c.dbkGiau_(d2), null, c.dhCongSuat_()), L = (RR.L || []).filter(z => z.o && z.o.tab === 'ĐƠN ƯU TIÊN');
  ok(L.length === 2 && L.every(z => z.lan === 3 && /ưu tiên|trễ/.test(z.ly)), 'xếp lịch: dòng ưu tiên ở làn Kho (3), ưu tiên trong làn', L.map(z => [z.lan, z.ly])); }
console.log('2. Còn sót dòng trùng ở tab KHO');
{ const KHO = [H, ['KHO-25/09', 'GAY A', '', 60, 10, '25/11', '', 55, 55, '', ''], ['', 'GAY B', '', 30, 5, '25/12', '', 20, 20, '', '']], UU = [H, ['KHO-25/09', 'GAY A', '', 60, 10, '25/11', '', 60, 30, 30, '']];
  const c = tao(KHO, UU), d = c.dhDocDon_(true);
  ok(d.don.length === 2 && d.don.filter(o => o.ten === 'GAY A').length === 1 && d.don.find(o => o.ten === 'GAY A').tab === 'ĐƠN ƯU TIÊN', 'dòng KHO trùng mã + tên bị bỏ – không cộng 2 lần, giữ dòng tab ưu tiên', d.don.map(o => o.tab + ' ' + o.ten));
  ok(d.trungUu.length === 1 && d.trungUu[0][0] === 'KHO-25/09' && d.trungUu[0][2] === 2, 'báo dòng trùng (mã, tên, số dòng) để xóa', d.trungUu);
  ok(d.don.reduce((s, o) => s + o.thieu, 0) === 15, 'tổng còn thiếu = 10 + 5', d.don.reduce((s, o) => s + o.thieu, 0)); }
console.log('3. Bản ghi cũ lưu theo tab KHO (★ web, hạn riêng) vẫn áp cho dòng tab ưu tiên');
{ const KHO = [H], UU = [H, ['KHO-25/09', 'GAY A', '', 60, 10, '25/11', '', 0, 0, 0, '']];
  const c = tao(KHO, UU); c.dhUuWebDoc_ = () => ({ 'KHO-25/09|KHO': { ai: 'C056', luc: 'x' } }); c.dhHanRiengDoc_ = () => { const m = {}; m[c.dhHrKhoa_('KHO-25/09', 'KHO', 'GAY A')] = { han: '2026-12-01', ly: 't', ai: 'C056' }; return m; };
  c.dhDocDon_(true); const own = c.__phienDai(c.doc_('TaiKhoan').find(t => String(t.VaiTro).trim() === 'OWNER'));
  const x = c.__goi('layDonHangXuong', own, true), o = x.don.find(z => z.ten === 'GAY A');
  ok(o && o.uuWeb && o.hanRieng && o.hanRieng.han === '2026-12-01', '★ web + hạn riêng gắn lúc mã còn ở tab KHO vẫn còn', o && [o.uuWeb, o.hanRieng]); }
console.log('\n' + (n - l) + '/' + n + ' đạt'); process.exit(l ? 1 : 0);
