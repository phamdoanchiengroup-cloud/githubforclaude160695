/** 28/11 – SKU từng mã hàng (tests/sku/): skuCua_, Order-Flow / Lẻ-POD đã xong / đổi deadline / tab Đơn hàng.
 *   DATA=<csdl.json> TZ=Asia/Ho_Chi_Minh node kpi-app/tests/sku-web.js */
const path = require('path'), fs = require('fs'); const G = require('./gia-lap-kpi.js');
let n = 0, l = 0; const ok = (c, t, x) => { n++; if (!c) l++; console.log((c ? '  ✓ ' : '  ✗ ') + t + (c ? '' : ' → ' + String(JSON.stringify(x)).slice(0, 300))); };
const du = JSON.parse(fs.readFileSync(process.env.DATA, 'utf8')); du.DonHangChup = (du.DonHangChup || [[]]).slice(0, 1);
const c = G.tao(path.join(__dirname, '..', 'Code.gs'), du, '2026-11-28T09:00:00+07:00');
ok(c.skuCua_('Nebula 2 Pool Cue - Charcoal Gray - Wrapless - 11.8 mm') === 'RHI2-NEBULA2/388/GRAY/NW/11.8', 'tên đúng file SEA → SKU');
ok(c.skuCua_("RHINO - 30\"/3/8 - 10 CARBON POOL CUE SINGLE SHAFT - 12.5") === "RHI2-C30PT21.5/12.5/10", "SKU.xlsx (danh mục chuẩn) đè file SEA – ngọn C30PT21.5");
ok(c.skuCua_("GẬY CLB 2 KHÚC - XANH") === "", "tên tiếng Việt trùng nhiều SKU → không đoán");
ok(c.skuCua_('  nebula 2 pool cue – charcoal gray-wrapless -  11.8 MM ') === 'RHI2-NEBULA2/388/GRAY/NW/11.8', 'khác hoa / thường, gạch nối, khoảng trắng vẫn khớp');
ok(c.skuCua_('EVO4/LUN3/COMBOMAX') === 'EVO4/LUN3/COMBOMAX', 'tên vốn đã là SKU → giữ');
ok(c.skuCua_('Rhino RETRÔ Pool Cue - Snake - Lizard Embossed Microfiber Leather Wrap & Point') === '', 'tên chưa có SKU → rỗng (web hiện tên), không ghép gần đúng');
const H = ['', 'Loại hàng cần sản xuất', 'Loại Phôi', 'Số lượng đặt', 'SX CÒN THIẾU', 'Deadline', 'HẠN MỚI HT ĐƠN CŨ', 'TỔNG SP CÓ THỂ GIAO: Của Tuyết Anh', 'Hàng Còn lại trong kho và đóng gói, có thể giao', 'HÀNG ĐI- ĐÃ TRẢ KHÁCH', 'CHÚ THÍCH CÁC BỘ PHẬN'];
c.__ngoai = { [c.DH_SHEET_ID]: { ten: 'x', sheets: { KHO: [H, ['#K-1', 'Nebula 2 Pool Cue - Charcoal Gray - Wrapless - 11.8 mm', '', 28, 10, '30/12', '', 18, 18, '', ''], ['', 'GAY LA', '', 5, 5, '30/12', '', 0, 0, '', '']] } } };
const d = c.dhDocDon_(true), a = d.don.find(o => o.ten.startsWith('Nebula')), b = d.don.find(o => o.ten === 'GAY LA');
ok(a.sku === 'RHI2-NEBULA2/388/GRAY/NW/11.8' && !b.sku, 'dữ liệu đơn: o.sku gắn đúng, tên lạ không có SKU');
const own = c.__phienDai(c.doc_('TaiKhoan').find(t => String(t.VaiTro).trim() === 'OWNER'));
const r = c.__goi('layBangDonNhaMay', own), dd = r.ds.find(x => x[2].startsWith('Nebula'));
ok(dd && dd[10] === 'RHI2-NEBULA2/388/GRAY/NW/11.8', 'Bảng đơn nhà máy: cột [10] = SKU', dd);
const idx = fs.readFileSync(path.join(__dirname, '..', 'DonBan.html'), 'utf8'), qt = fs.readFileSync(path.join(__dirname, '..', 'QuyTrinh.html'), 'utf8');
ok(/function bnSkuTen/.test(idx) && /bnSkuTen\(z\.sku,z\.ten\)/.test(idx) && /bnSkuTen\(z\[3\],z\[0\]\)/.test(idx) && /x\[7\]\?'<b>'\+esc\(x\[7\]\)/.test(idx), 'Order-Flow: bảng đơn, Lẻ/POD đã xong, đổi deadline hiện SKU to + tên nhỏ');
ok(/function dhSkuTen/.test(qt) && /dhSkuTen\(o\)/.test(qt) && /o\.sku\|\|''/.test(qt), 'tab Đơn hàng: ô Mã sản phẩm hiện SKU + tìm được theo SKU');
const c2 = G.tao(path.join(__dirname, '..', 'Code.gs'), JSON.parse(fs.readFileSync(process.env.DATA, 'utf8')), '2026-11-28T09:00:00+07:00');
c2.__ngoai = { [c2.DH_SHEET_ID]: { ten: 'x', sheets: { 'WEB LẺ CUSTOM': [H, ['#C-9', 'GAY CUSTOM X', 'Khắc tên: MINH · màu đỏ', 1, 1, '30/12', '', 0, 0, '', '']], KHO: [H, ['#K-2', 'GAY KHO Y', 'CYCO 12.5', 5, 5, '30/12', '', 0, 0, '', '']] } } };
const own2 = c2.__phienDai(c2.doc_('TaiKhoan').find(t => String(t.VaiTro).trim() === 'OWNER')), r2 = c2.__goi('layBangDonNhaMay', own2), cu = r2.ds.find(x => x[2] === 'GAY CUSTOM X'), kh = r2.ds.find(x => x[2] === 'GAY KHO Y');
ok(cu && cu[11] === 'Khắc tên: MINH · màu đỏ' && kh && kh[11] === '', 'ghi chú đơn lẻ (cột Loại phôi) chỉ gửi cho tab Web lẻ, tab khác để trống', [cu, kh]);
ok(/z\.gc\?'<span class="of-gc">/.test(idx), 'Order-Flow hiện ghi chú chữ nhỏ dưới tên sản phẩm');
console.log('\n' + (n - l) + '/' + n + ' đạt'); process.exit(l ? 1 : 0);
