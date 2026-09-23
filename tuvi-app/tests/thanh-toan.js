/**
 * Kiểm thử ví xu & mở khóa (ThanhToan.gs + TaiKhoan.gs) với Apps Script giả lập:
 * Google Sheet trong bộ nhớ, LockService, CacheService, Script Properties và payOS giả.
 * Chạy: TK_PASS='<mật khẩu chủ sở hữu>' node tests/thanh-toan.js
 */
const fs = require('fs'), vm = require('vm'), path = require('path'), crypto = require('crypto');
const D = path.join(__dirname, '..');
const store = {}, cache = {}, sheets = {};
function Range(sh, r, c, nr, nc) {
  this.sh = sh; this.r = r; this.c = c; this.nr = nr || 1; this.nc = nc || 1;
}
Range.prototype = {
  getValues() { const o = []; for (let i = 0; i < this.nr; i++) { const row = []; for (let j = 0; j < this.nc; j++) row.push(((this.sh.rows[this.r - 1 + i] || [])[this.c - 1 + j]) ?? ''); o.push(row); } return o; },
  getValue() { return this.getValues()[0][0]; },
  setValues(v) { v.forEach((row, i) => row.forEach((x, j) => { const R = this.sh.rows[this.r - 1 + i] = this.sh.rows[this.r - 1 + i] || []; R[this.c - 1 + j] = x; })); return this; },
  setValue(x) { return this.setValues([[x]]); },
  setFontWeight() { return this; }, setBackground() { return this; }, setFontColor() { return this; },
  getRow() { return this.r; },
  createTextFinder(t) { const self = this; return { matchEntireCell() { return this; }, matchCase() { return this; },
    findAll() { const o = []; for (let i = 0; i < self.nr; i++) if (String((self.sh.rows[self.r - 1 + i] || [])[self.c - 1]) === String(t)) o.push(new Range(self.sh, self.r + i, self.c)); return o; } }; }
};
function Sheet(n) { this.name = n; this.rows = []; }
Sheet.prototype = {
  appendRow(r) { this.rows.push(r.slice()); return this; }, getLastRow() { return this.rows.length; },
  getLastColumn() { return Math.max(0, ...this.rows.map(r => r.length)); },
  getRange(r, c, nr, nc) { return new Range(this, r, c, nr, nc); }, setFrozenRows() {}, setColumnWidth() {}, deleteRow(i) { this.rows.splice(i - 1, 1); }
};
const ss = { getSheetByName: n => sheets[n] || null, insertSheet: n => (sheets[n] = new Sheet(n)), getId: () => 'x' };
const payos = { don: {} };
const ctx = {
  console, Math, Date, JSON,
  Utilities: {
    DigestAlgorithm: { SHA_256: 'sha256' }, Charset: { UTF_8: 'utf8' },
    computeDigest: (a, s) => Array.from(crypto.createHash('sha256').update(s, 'utf8').digest()).map(b => (b > 127 ? b - 256 : b)),
    computeHmacSha256Signature: (s, k) => Array.from(crypto.createHmac('sha256', k).update(s, 'utf8').digest()).map(b => (b > 127 ? b - 256 : b)),
    getUuid: () => crypto.randomUUID(), sleep: () => {}, formatDate: (d, tz, f) => { const x = new Date(d); const p = n => String(n).padStart(2, '0'); return f === 'yyyyMMdd' ? '' + x.getFullYear() + p(x.getMonth() + 1) + p(x.getDate()) : x.toISOString(); }
  },
  PropertiesService: { getScriptProperties: () => ({ getProperty: k => (k in store ? store[k] : null), setProperty: (k, v) => { store[k] = v; }, deleteProperty: k => { delete store[k]; }, getProperties: () => Object.assign({}, store) }) },
  CacheService: { getScriptCache: () => ({ get: k => (k in cache ? cache[k] : null), put: (k, v) => { cache[k] = v; }, remove: k => { delete cache[k]; } }) },
  LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
  SpreadsheetApp: { getActiveSpreadsheet: () => ss },
  ScriptApp: { getService: () => ({ getUrl: () => 'https://script.google.com/macros/s/X/exec' }), getProjectTriggers: () => [], newTrigger: () => ({ timeBased: () => ({ everyMinutes: () => ({ create() { ctx.__trigger = true; } }) }) }) },
  UrlFetchApp: { fetch(url, o) {
    const m = url.match(/payment-requests\/?(\d*)$/); let j;
    if (o.method === 'post') {
      const b = JSON.parse(o.payload), key = ctx.__checksum;
      const s = ['amount', 'cancelUrl', 'description', 'orderCode', 'returnUrl'].map(k => k + '=' + b[k]).join('&');
      const ok = crypto.createHmac('sha256', key).update(s).digest('hex') === b.signature && o.headers['x-client-id'] === 'cid';
      payos.don[b.orderCode] = { orderCode: b.orderCode, amount: b.amount, amountPaid: 0, status: 'PENDING' };
      j = ok ? { code: '00', data: { checkoutUrl: 'https://pay.payos.vn/web/abc', bin: '970452', accountNumber: '123456789', accountName: 'PHAM CHIEN', description: b.description } } : { code: '20', desc: 'Chữ ký không hợp lệ' };
    } else { const d = payos.don[m[1]]; j = d ? { code: '00', data: d } : { code: '101', desc: 'Không tìm thấy' }; }
    return { getContentText: () => JSON.stringify(j), getResponseCode: () => 200 };
  } }
};
vm.createContext(ctx);
fs.readdirSync(D).filter(f => f.endsWith('.gs') && f !== 'Code.gs').forEach(f => vm.runInContext(fs.readFileSync(path.join(D, f), 'utf8'), ctx, { filename: f }));
const code = fs.readFileSync(path.join(D, 'Code.gs'), 'utf8');
vm.runInContext(code.slice(code.indexOf('function lapLaSoDayDu_'), code.indexOf('/* ---------------------- Lưu trữ')), ctx);
let loi = 0;
const ok = (c, m) => { if (!c) { loi++; console.log('✗', m); } else console.log('✔', m); };
const nem = f => { try { f(); return null; } catch (e) { return e.message; } };
const PASS = process.env.TK_PASS;
if (!PASS) { console.log('Bỏ qua: cần biến TK_PASS'); process.exit(0); }
const L = { name: 'Nguyễn Văn An', gender: 'nam', calendar: 'duong', day: 15, month: 8, year: 1990, hour: 10, minute: 30, place: '21.03|105.85|Hà Nội', tz: '7' };

const chu = ctx.dangNhap('chienpham', PASS).token;
ok(nem(() => ctx.dangKy('ab', 'matkhau123', 'A', '0912345678')) !== null, 'Đăng ký: chặn tên quá ngắn');
ok(nem(() => ctx.dangKy('khachmoi', 'matkhau123', 'Khách', 'abc')) !== null, 'Đăng ký: bắt buộc SĐT/email hợp lệ');
const dk = ctx.dangKy('khachmoi', 'matkhau123', 'Khách Mới', '0912 345 678');
ok(dk.token && dk.nguoiDung.vaiTro === 'thanhVien', 'Khách tự đăng ký và đăng nhập luôn');
const T = dk.token;
let r = ctx.lapLaSo(L, T);
ok(r.khach && r.canMo && r.soDu === 0 && r.bangGia.phan.co_ban.xu === 49, 'Thành viên chưa mở: nhận bản rút gọn + nút mở khóa (49 xu)');
let m = ctx.muaPhan(T, L, 'co_ban');
ok(m.ok === false && m.thieu === 49, 'Không đủ xu → báo thiếu 49 xu');
// nạp thủ công khi chưa có payOS
ok(/chưa cài đặt/.test(nem(() => ctx.taoDonNap(T, 0))), 'Chưa cài tài khoản nhận tiền → báo lỗi rõ');
ctx.qtLuuCauHinh(chu, { nganHang: { bin: '970452', stk: '000111222', chuTK: 'pham chien', tenNH: 'KienlongBank' } });
let don = ctx.taoDonNap(T, 0);
ok(don.kenh === 'thucong' && /img\.vietqr\.io\/image\/970452-000111222/.test(don.qrAnh) && /^TCC\d{6}$/.test(don.noiDung), 'Đơn thủ công: VietQR đúng tài khoản + nội dung ' + don.noiDung);
ok(ctx.kiemTraDon(T, don.ma).trangThai === 'CHO', 'Đơn chờ xác nhận');
ok(nem(() => ctx.qtXacNhanDon(T, don.ma)) !== null, 'Thành viên không tự xác nhận đơn được');
ctx.qtXacNhanDon(chu, don.ma);
ok(ctx.kiemTraDon(T, don.ma).soDu === 50, 'Chủ sở hữu xác nhận → cộng 50 xu');
ok(nem(() => ctx.qtXacNhanDon(chu, don.ma)) !== null && ctx.viCuaToi(T).soDu === 50, 'Xác nhận lần 2 không cộng trùng');
ok(/Bản mở/.test(nem(() => ctx.muaPhan(T, L, 'pdf'))), 'Mua phần thêm khi chưa có Bản mở → yêu cầu mở Bản mở trước');
m = ctx.muaPhan(T, L, 'co_ban');
ok(m.ok && m.soDu === 1, 'Mở Bản mở: trừ 49 xu, còn 1');
r = ctx.lapLaSo(L, T);
ok(!r.khach && r.moRong && r.battuChiTiet.linhVuc.length === 12 && r.quyen.co_ban, 'Đã mở: nhận bản đầy đủ');
ok(r.moRong.tongHop.hoiTu === null && r.moRong.tongHop.phoiNgau === null && Object.keys(r.duDoan.chuDe).length === 0, 'Phần chưa mua (biến cố, phối ngẫu) bị cắt ở máy chủ');
ok(r.battuChiTiet.luuNien.length === 1 && r.moRong.tongHop.thang.length === 0, 'Lưu niên chưa mua: chỉ còn năm hiện tại');
ok(ctx.lapLaSo(Object.assign({}, L, { viewYear: 2031 }), T).quyen.co_ban, 'Đổi năm xem vẫn giữ quyền (mở vĩnh viễn)');
ok(ctx.lapLaSo(Object.assign({}, L, { day: 16 }), T).khach, 'Lá số khác → chưa mở');
ok(/cần mở khóa/.test(nem(() => ctx.doGioSinh(Object.assign({ events: [{ nam: 2015, loai: 'ketHon' }] }, L), T))), 'Dò giờ sinh cần mở khóa riêng');
// payOS
ctx.__checksum = 'ck-secret';
ctx.qtLuuCauHinh(chu, { clientId: 'cid', apiKey: 'ak', checksum: 'ck-secret' });
ok(ctx.__trigger === true, 'Lưu khóa payOS → tự cài trigger đối soát 5 phút');
don = ctx.taoDonNap(T, 1);
ok(don.kenh === 'payos' && don.checkoutUrl && don.stk === '123456789', 'Đơn payOS: chữ ký hợp lệ, nhận link + tài khoản');
ok(ctx.kiemTraDon(T, don.ma).trangThai === 'CHO', 'Chưa trả → vẫn chờ');
Object.assign(payos.don[don.ma], { status: 'PAID', amountPaid: 100000, transactions: [{ reference: 'FT123' }] });
let k = ctx.kiemTraDon(T, don.ma);
ok(k.trangThai === 'DA_TRA' && k.soDu === 111, 'payOS báo PAID → tự cộng 110 xu (số dư 111)');
ctx.ttQuetDonTuDong();
ok(ctx.viCuaToi(T).soDu === 111, 'Trigger quét lại không cộng trùng');
m = ctx.muaPhan(T, L, 'tron_goi');
ok(m.ok && m.gia === 70 && m.soDu === 41, 'Trọn gói trừ phần đã mua: 119 − 49 = 70 xu');
r = ctx.lapLaSo(L, T);
ok(r.moRong.tongHop.hoiTu && r.moRong.tongHop.phoiNgau && r.battuChiTiet.luuNien.length > 5 && r.quyen.pdf, 'Trọn gói: mở tất cả');
// VIP & chủ sở hữu
ctx.taoTaiKhoan(chu, 'nguoinha', 'matkhau123', 'Người nhà', 'vip');
const vip = ctx.dangNhap('nguoinha', 'matkhau123').token;
r = ctx.lapLaSo(Object.assign({}, L, { day: 20 }), vip);
ok(!r.khach && r.quyen.toanQuyen && r.moRong.tongHop.hoiTu, 'VIP: xem toàn bộ không trừ xu');
r = ctx.lapLaSo(Object.assign({}, L, { day: 21 }), chu);
ok(!r.khach && r.quyen.toanQuyen && r.soDu === null, 'Chủ sở hữu: toàn quyền, không cần xu');
ctx.qtDatVaiTro(chu, 'nguoinha', 'thanhVien');
ok(ctx.lapLaSo(Object.assign({}, L, { day: 20 }), vip).khach, 'Hạ VIP → thành viên thường');
const tq = ctx.qtTongQuan(chu);
ok(tq.doanhThu.tong === 150000 && tq.doanhThu.soDon === 2 && tq.cauHinh.payos && !JSON.stringify(tq).includes('ck-secret'), 'Quản trị: doanh thu 150.000đ / 2 đơn, không lộ khóa bí mật');
ctx.qtDieuChinhXu(chu, 'khachmoi', 10, 'tặng');
ok(ctx.viCuaToi(T).soDu === 51 && ctx.viCuaToi(T).soCai.length >= 4, 'Tặng xu + sổ cái ghi nhận');
ok(nem(() => ctx.qtLuuBangGia(T, {})) !== null, 'Thành viên không sửa được bảng giá');
ctx.qtLuuBangGia(chu, { phan: { co_ban: 59 }, goi: [{ tien: 100000, xu: 120 }] });
ok(ctx.ttBangGia_().phan.co_ban.xu === 59 && ctx.ttBangGia_().goi.length === 1, 'Sửa bảng giá');
if (loi) { console.log(loi + ' lỗi'); process.exit(1); } else console.log('✔ Thanh toán: tất cả kiểm tra đạt');
