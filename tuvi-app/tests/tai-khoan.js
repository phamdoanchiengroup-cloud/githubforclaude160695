/**
 * Kiểm thử TaiKhoan.gs với Apps Script giả lập: đăng nhập chủ sở hữu, khóa khi sai nhiều lần,
 * tạo / xóa thành viên, đổi mật khẩu, và bản rút gọn trả về cho khách.
 * Chạy: node tests/tai-khoan.js  (mật khẩu chủ sở hữu truyền qua biến môi trường TK_PASS)
 */
const fs = require('fs'), vm = require('vm'), path = require('path'), crypto = require('crypto');
const D = path.join(__dirname, '..');
const store = {}, cache = {};
const ctx = {
  console, Math, Date, JSON,
  Utilities: {
    DigestAlgorithm: { SHA_256: 'sha256' }, Charset: { UTF_8: 'utf8' },
    computeDigest: (a, s) => Array.from(crypto.createHash('sha256').update(s, 'utf8').digest()).map(b => (b > 127 ? b - 256 : b)),
    getUuid: () => crypto.randomUUID(), sleep: () => {}
  },
  PropertiesService: { getScriptProperties: () => ({
    getProperty: k => (k in store ? store[k] : null), setProperty: (k, v) => { store[k] = v; }, deleteProperty: k => { delete store[k]; }, getProperties: () => Object.assign({}, store) }) },
  CacheService: { getScriptCache: () => ({ get: k => (k in cache ? cache[k] : null), put: (k, v) => { cache[k] = v; }, remove: k => { delete cache[k]; } }) }
};
vm.createContext(ctx);
fs.readdirSync(D).filter(f => f.endsWith('.gs') && f !== 'Code.gs').forEach(f => vm.runInContext(fs.readFileSync(path.join(D, f), 'utf8'), ctx, { filename: f }));
const code = fs.readFileSync(path.join(D, 'Code.gs'), 'utf8');
vm.runInContext(code.slice(code.indexOf('function lapLaSoDayDu_'), code.indexOf('/* ---------------------- Lưu trữ')), ctx);
let loi = 0;
function ok(c, m) { if (!c) { loi++; console.log('✗', m); } else console.log('✔', m); }
function nem(f) { try { f(); return null; } catch (e) { return e.message; } }
const PASS = process.env.TK_PASS;
if (PASS) {
  const r = ctx.dangNhap('ChienPham ', PASS);
  ok(r.token && r.nguoiDung.vaiTro === 'chu', 'Chủ sở hữu đăng nhập được (không phân biệt hoa thường, khoảng trắng)');
  const T = r.token;
  ok(ctx.phien(T).ten === 'chienpham', 'Phiên hợp lệ');
  const ds = ctx.taoTaiKhoan(T, 'thanhvien1', 'matkhau123', 'Thành viên 1');
  ok(ds.length === 2, 'Tạo thành viên');
  const m = ctx.dangNhap('thanhvien1', 'matkhau123');
  ok(nem(() => ctx.dsTaiKhoan(m.token)) !== null, 'Thành viên không xem được danh sách tài khoản');
  ok(nem(() => ctx.doiMatKhau(m.token, 'matkhau123', 'moi45678x')) === null && nem(() => ctx.dangNhap('thanhvien1', 'moi45678x')) === null, 'Đổi mật khẩu');
  ok(nem(() => ctx.xoaTaiKhoan(T, 'chienpham')) !== null, 'Không xóa được chủ sở hữu');
  ok(ctx.xoaTaiKhoan(T, 'thanhvien1').length === 1 && ctx.phien(m.token) === null, 'Xóa thành viên làm mất phiên của họ');
  const full = ctx.lapLaSo({ name: 'A', gender: 'nam', calendar: 'duong', day: 15, month: 8, year: 1990, hour: 10, minute: 30 }, T);
  ok(!full.khach && full.moRong && full.battuChiTiet, 'Đã đăng nhập: nhận bản đầy đủ');
  ctx.dangXuat(T); ok(ctx.phien(T) === null, 'Đăng xuất');
}
for (let i = 0; i < 5; i++) nem(() => ctx.dangNhap('chienpham', 'sai-mat-khau'));
ok(/tạm khóa/.test(nem(() => ctx.dangNhap('chienpham', PASS || 'x'))), 'Khóa tạm sau 5 lần sai');
const k = ctx.lapLaSo({ name: 'B', gender: 'nu', calendar: 'duong', day: 3, month: 2, year: 1985, hour: 22, minute: 0, save: true }, 'token-gia-mao-khong-hop-le-123');
const js = JSON.stringify(k);
ok(k.khach && !k.moRong && !k.battuChiTiet && !k.chiTiet && !k.duDoan && !k.tuvi.luanGiai.tongQuan && !k.battu.goiY, 'Khách: máy chủ chỉ trả bản rút gọn');
ok(k.teaser && k.teaser.chart && k.teaser.battu && k.tuvi.palaces.length === 12 && js.length < 200000, 'Khách: có lá số + phần hé lộ (' + Math.round(js.length / 1024) + ' KB)');
ok(!/lines/.test(JSON.stringify(k.tuvi.luanGiai)), 'Khách: không có lời luận cung');
if (loi) { console.log(loi + ' lỗi'); process.exit(1); } else console.log('✔ Tài khoản: tất cả kiểm tra đạt');
