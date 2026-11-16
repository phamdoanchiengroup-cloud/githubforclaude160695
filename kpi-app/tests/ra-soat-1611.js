/** Kiểm thử các lỗi sửa trong đợt rà soát toàn bộ 16/11: năm của ngày quanh Tết dương, chặn công thức ở Note, chặn ghi tab lạ, ngày không có thật.
 *   DATA=<csdl.json> TZ=Asia/Ho_Chi_Minh node kpi-app/tests/ra-soat-1611.js */
const path = require('path'), fs = require('fs'); const G = require('./gia-lap-kpi.js');
const DATA = process.env.DATA; if (!DATA) { console.log('Cần DATA='); process.exit(1); }
let n = 0, l = 0; const ok = (c, t, x) => { n++; if (!c) l++; console.log((c ? '  ✓ ' : '  ✗ ') + t + (c ? '' : ' → ' + JSON.stringify(x).slice(0, 400))); };
const doc = () => { const du = JSON.parse(fs.readFileSync(DATA, 'utf8')); ['DonHangChup', 'PhanLoaiSKU', 'CauHinhSP', 'BTPTheoSKU', 'DonUuTien', 'DonHang10Goc'].forEach(k => { if (du[k]) du[k] = du[k].slice(0, 1); });
  const iDoi = du.TaiKhoan[0].indexOf('DoiMatKhauLanDau'); du.TaiKhoan.slice(1).forEach(x => { x[iDoi] = 'Không'; }); return du; };
console.log('1. Năm của ngày không ghi năm (Sheet ghi dd/mm)');
let c = G.tao(path.join(__dirname, '..', 'Code.gs'), doc(), '2026-12-20T09:00:00+07:00');
ok(c.dhNgay_('05/01', 2026) === '2027-01-05', '20/12/2026 đọc "05/01" → 05/01/2027 (trước: 2026, báo trễ 349 ngày)', c.dhNgay_('05/01', 2026));
ok(c.dhNgay_('28/12', 2026) === '2026-12-28' && c.dhNgay_('15/11', 2026) === '2026-11-15', 'ngày gần hôm nay giữ năm nay', [c.dhNgay_('28/12', 2026), c.dhNgay_('15/11', 2026)]);
ok(c.dhNgay_("'05/01/2027", 2026) === '2027-01-05' && c.dhNgay_('05/01/2028', 2026) === '2028-01-05', 'ô ghi rõ năm (web ghi) → giữ đúng năm', c.dhNgay_('05/01/2028', 2026));
c = G.tao(path.join(__dirname, '..', 'Code.gs'), doc(), '2027-01-05T09:00:00+07:00');
ok(c.dhNgay_('30/12', 2027) === '2026-12-30', '05/01/2027 đọc "30/12" → 30/12/2026 (đơn vừa trễ, trước: hạn xa gần 1 năm)', c.dhNgay_('30/12', 2027));
c.DH_NAM_CD_ = 1; const ht = c.dhNgay_('05/03', 2025); c.DH_NAM_CD_ = 0;
ok(ht === '2025-03-05', 'tab HT-2025: dùng đúng năm của tab', ht);
console.log('2. Bảo mật / đầu vào');
c = G.tao(path.join(__dirname, '..', 'Code.gs'), doc(), '2026-11-16T09:00:00+07:00');
ok(c.dhNgayThat_('2026-11-30') && !c.dhNgayThat_('2026-13-45') && !c.dhNgayThat_('2026-02-30') && !c.dhNgayThat_('30/11/2026'), 'ngày không có thật (13-45, 30/02) bị từ chối', '');
const H = ['', 'Loại hàng cần sản xuất', 'Loại Phôi', 'Số lượng đặt', 'SX CÒN THIẾU', 'Deadline'];
const OEM = [H, ['#M-01/11', 'GAY NOVA X1 MAU DO', '', 50, 50, '30/12']], T10 = [H, ['#M-01/11', 'GAY NOVA X1 MAU DO', '', 50, 50, '30/12']];
c.__ngoai = { [c.DH_SHEET_ID]: { ten: 'x', sheets: { OEM: OEM, 'ĐẾN HẠN 10 NGÀY': T10, 'HT-2026': T10.map(r => r.slice()) } } }; c.dhDocDon_(true);
const TK = c.doc_('TaiKhoan').filter(t => t.TrangThai === 'Đang dùng'), gd = c.__phienDai(TK.find(t => String(t.MaNV).toUpperCase() === 'C019'));
let qua = null; const cat = c.chuAnToan_; c.chuAnToan_ = v => { const x = cat(v); if (qua === null && /^=IMPORTRANGE/.test(String(v))) qua = x; return x; };
let r = c.__goi('luuGhiChuDon', gd, { tab: 'OEM', dong: 2, ten: 'GAY NOVA X1 MAU DO', note: '=IMPORTRANGE("x","A1")' });
c.chuAnToan_ = cat;
ok(r.ok && String(qua).charAt(0) === "'", 'Note gõ "=..." được ghi dạng chữ (thêm dấu \' đầu – Sheet không chạy công thức)', [r, qua]);
r = c.__goi('luuBangDon', gd, { ds: [{ tab: 'ĐẾN HẠN 10 NGÀY', dong: 2, ten: 'GAY NOVA X1 MAU DO', sl: { cu: 50, moi: 1 } }] });
const r2 = c.__goi('luuBangDon', gd, { ds: [{ tab: 'HT-2026', dong: 2, ten: 'GAY NOVA X1 MAU DO', sl: { cu: 50, moi: 1 } }] });
ok(!r.ok && !r2.ok && T10[1][3] === 50, 'web không ghi được vào tab ĐẾN HẠN 10 NGÀY / HT-<năm> (chỉ tab đơn hàng)', [r, r2]);
r = c.__goi('luuBangDon', gd, { ds: [{ tab: 'OEM', dong: 2, ten: 'GAY NOVA X1 MAU DO', dl: { cu: '2026-12-30', moi: '2026-13-45' } }] });
ok(!r.ok && /không hợp lệ/.test(r.msg), 'deadline 2026-13-45 bị từ chối', r);
r = c.__goi('luuBangDon', gd, { ds: [{ tab: 'OEM', dong: 2, ten: 'GAY NOVA X1 MAU DO', dl: { cu: '2026-12-30', moi: '2027-01-05' } }] });
ok(r.ok && /05\/01\/2027/.test(String(OEM[1][5])) && c.dhNgay_(OEM[1][5], 2026) === '2027-01-05', 'deadline sang năm sau ghi + đọc lại đúng năm 2027', [r, OEM[1][5]]);
ok(typeof c.luuDeadlineDon === 'undefined', 'đã bỏ hàm cũ luuDeadlineDon (thay bằng luuBangDon)');
console.log(n + ' kiểm thử, ' + l + ' lỗi'); process.exit(l ? 1 : 0);
