/** Kiểm thử 21/11 – tab Đơn bán hàng: đơn lẻ / POD đã xong trong 3 ngày làm việc gần nhất + % hoàn thành từng đơn (tests/don-ban/du-kien.gs)
 *   DATA=<csdl.json> TZ=Asia/Ho_Chi_Minh node kpi-app/tests/don-xong.js */
const path = require('path'), fs = require('fs'); const G = require('./gia-lap-kpi.js');
const DATA = process.env.DATA; if (!DATA) { console.log('Cần DATA='); process.exit(1); }
let n = 0, l = 0; const ok = (c, t, x) => { n++; if (!c) l++; console.log((c ? '  ✓ ' : '  ✗ ') + t + (c ? '' : ' → ' + String(JSON.stringify(x)).slice(0, 400))); };
const du = JSON.parse(fs.readFileSync(DATA, 'utf8'));
['DonHangChup', 'PhanLoaiSKU', 'CauHinhSP', 'BTPTheoSKU', 'DonUuTien'].forEach(k => { if (du[k]) du[k] = du[k].slice(0, 1); });
const iDoi = du.TaiKhoan[0].indexOf('DoiMatKhauLanDau'); du.TaiKhoan.slice(1).forEach(x => { x[iDoi] = 'Không'; });
// sự kiện hoàn thiện giả (ghi đè): hôm nay T7 21/11 → 3 ngày làm việc = 19, 20, 21/11
const HT = du.DonHangHoanThien[0];
const sk = (ngay, tu, ma, ten, kenh, sl, thieu) => [ngay, tu, ma, ten, kenh, 'x', sl, sl, thieu || 0, '2026-11-25', thieu ? 'giaoThieu' : 'dung', '2026-11-10'];
du.DonHangHoanThien = [HT,
  sk('2026-11-18', '2026-11-17', '#L-CU', 'GAY CU', 'Web lẻ – Thường', 1),            // trước 3 ngày làm -> không hiện
  sk('2026-11-19', '2026-11-18', '#L-01', 'GAY A', 'Web lẻ – Thường', 1),
  sk('2026-11-20', '2026-11-18', '#L-01', 'GAY A', 'Web lẻ – Thường', 1),            // trùng sự kiện (lỗi ghi 2 lần) -> 1 dòng
  sk('2026-11-20', '2026-11-19', '#L-01', 'NGON B', 'Web lẻ – Thường', 2),
  sk('2026-11-21', '2026-11-20', '#C-02', 'GAY CUSTOM', 'Web lẻ – Custom', 1, 1),     // giao thiếu
  sk('2026-11-21', '2026-11-20', '#POD-9', 'GAY POD', 'POD – A.Bách', 3),
  sk('2026-11-21', '2026-11-20', '#K-1', 'GAY KHO', 'Kho', 50)];                     // kênh khác -> không hiện
const c = G.tao(path.join(__dirname, '..', 'Code.gs'), du, '2026-11-21T15:00:00+07:00');
const H = ['', 'Loại hàng cần sản xuất', 'Loại Phôi', 'Số lượng đặt', 'SX CÒN THIẾU', 'Deadline', 'CHÚ THÍCH CÁC BỘ PHẬN', 'Phôi của Phố', 'Sơn của Khoa', 'TỔNG SP CÓ THỂ GIAO'];
const KHO = [H, ['#K-03/11', 'NGON RHINO 12.4', '', 100, 40, '25/11', '', '', '', ''], ['#K-03/11', 'GAY RHINO R1', '', 100, 0, '25/11', '', '', '', ''], ['#K-04/11', 'GAY RHINO R2', '', 10, 10, '28/11', '', '', '', '']];
c.__ngoai = { [c.DH_SHEET_ID]: { ten: 'x', sheets: { KHO: KHO } } };
const TK = () => c.doc_('TaiKhoan').filter(t => t.TrangThai === 'Đang dùng');
const own = c.__phienDai(TK().find(t => String(t.VaiTro).trim() === 'OWNER'));
const cn = c.__phienDai(TK().find(t => String(t.VaiTro).trim() === 'CN'));

console.log('\n1. Đơn lẻ / POD đã xong – 3 ngày làm việc');
let r = c.__goi('layDonXongLePOD', own);
ok(r.ok && JSON.stringify(r.ngay) === '["2026-11-21","2026-11-20","2026-11-19"]', '3 ngày làm việc gần nhất: 19, 20, 21/11', r);
const le = (r.ds || []).filter(x => x.nhom === 'le'), pod = (r.ds || []).filter(x => x.nhom === 'pod');
ok(le.length === 2 && pod.length === 1, 'lẻ 2 đơn (thường + custom), POD 1 đơn; không có Kho, không có đơn xong 18/11', r.ds);
const l1 = le.find(x => x.maDon === '#L-01');
ok(l1 && l1.dong.length === 2 && l1.xong === '2026-11-20', 'đơn #L-01: 2 mã (sự kiện trùng chỉ tính 1), ngày xong = mã cuối cùng 20/11', l1);
ok(le.find(x => x.maDon === '#C-02').dong[0][2] === 1, 'đơn custom giao thiếu 1 → web ghi "giao thiếu"');
ok(r.ds[0].xong >= r.ds[r.ds.length - 1].xong, 'xếp đơn mới xong lên trước');
r = c.__goi('layDonXongLePOD', cn); ok(!r.ok, 'công nhân không xem được', r);

console.log('\n2. Bảng đơn nhà máy: % hoàn thành theo từng đơn');
r = c.__goi('layBangDonNhaMay', own);
ok(r.ok && r.pct && r.pct['KHO|#K-03/11'] === 80, 'đơn #K-03/11: 200 đặt, còn 40 → xong 80% (tính cả mã đã xong): ' + JSON.stringify(r.pct), r.pct);
ok(r.pct['KHO|#K-04/11'] === 0, 'đơn chưa làm → 0%');
ok(r.ds.every(d => d[1] !== '#K-03/11' || d[2] !== 'GAY RHINO R1'), 'bảng vẫn chỉ hiện mã còn thiếu');

console.log('\n' + (n - l) + '/' + n + ' đạt'); process.exit(l ? 1 : 0);
