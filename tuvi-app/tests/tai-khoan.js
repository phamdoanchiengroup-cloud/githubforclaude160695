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
    formatDate: (d, tz, f) => { const p = n => String(n).padStart(2, '0'); return f.replace('yyyy', d.getFullYear()).replace('MM', p(d.getMonth() + 1)).replace('dd', p(d.getDate())).replace('HH', p(d.getHours())).replace('mm', p(d.getMinutes())); },
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
// Không có mật khẩu thật (TK_PASS) thì thay seed chủ sở hữu bằng một mật khẩu thử – chỉ trong bộ nhớ kiểm thử (rà soát 16/11)
if (!process.env.TK_PASS) { const s = 'salt-thu-nghiem'; ctx.TK_CHU_SEED = { salt: s, hash: ctx.tkBam_('mat-khau-thu-nghiem', s), vaiTro: 'chu', hienThi: 'Chủ sở hữu' }; }
const PASS = process.env.TK_PASS || 'mat-khau-thu-nghiem';
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
ctx.Utilities.sleep = () => {};
for (let i = 0; i < 5; i++) nem(() => ctx.dangNhap('chienpham', 'sai-mat-khau'));
ok(/Đợi vài giây/.test(nem(() => ctx.dangNhap('chienpham', PASS)) || ''), 'Chủ sở hữu sau 5 lần sai: chỉ phải đợi vài giây (không khóa 15 phút)');
ctx.CacheService.getScriptCache().remove('CHO_chienpham');
ok(nem(() => ctx.dangNhap('chienpham', PASS)) === null, 'Hết vài giây chờ: chủ sở hữu đăng nhập được, không bị người lạ khóa');
ctx.dangKy('khachkhoa', 'matkhau123', 'Khách', 'khach@vidu.vn');
for (let i = 0; i < 5; i++) nem(() => ctx.dangNhap('khachkhoa', 'sai-mat-khau'));
ok(/tạm khóa/.test(nem(() => ctx.dangNhap('khachkhoa', 'matkhau123'))), 'Tài khoản thường: khóa tạm sau 5 lần sai');
const k = ctx.lapLaSo({ name: 'B', gender: 'nu', calendar: 'duong', day: 3, month: 2, year: 1985, hour: 22, minute: 0, save: true }, 'token-gia-mao-khong-hop-le-123');
const js = JSON.stringify(k);
ok(!k.khach && k.tongKhoa && k.moRong && !k.moRong.deHieu.th6 && k.chiTiet.daiVan.every(function (d) { return d.khoa; }) && !k.moRong.tongHop.hoiTu, 'Khách: đọc được 6 hệ; Tổng hợp, vận hạn, biến cố bị cắt ở máy chủ');
ok(k.teaser && k.teaser.chart && k.tuvi.palaces.length === 12 && k.th6 && js.length < 3000000, 'Khách: có lá số + hé lộ Tổng hợp (' + Math.round(js.length / 1024) + ' KB)');
ok(/lines/.test(JSON.stringify(k.tuvi.luanGiai)) && k.battu.goiY, 'Khách: có lời luận 12 cung và Bát Tự (miễn phí)');
// 17/11: "Điều nên lưu ý" ở Tóm lược – khách chỉ nhận {ten, diem, yeu[0], khuyen[0]} của lĩnh vực yếu nhất, không thêm lời luận nào khác
(function () {
  const lv = k.th6.linhVuc, yeu = lv.slice().sort(function (a, b) { return a.diem - b.diem; })[0];
  const coThem = lv.filter(function (x) { return x.yeu || x.khuyen; });
  const SAO = /Tử Vi|Thiên Phủ|Thái Dương|Thái Âm|Vũ Khúc|Thiên Đồng|Liêm Trinh|Tham Lang|Cự Môn|Thiên Tướng|Thiên Lương|Thất Sát|Phá Quân|Thiên Cơ|Kình Dương|Đà La|Hóa Kỵ|%/;
  ok(coThem.every(function (x) { return x === yeu && x.diem < 6; }) && (!yeu.yeu || (yeu.yeu.length === 1 && Object.keys(yeu.yeu[0]).join() === 't' && /^Bạn có xu hướng/.test(yeu.yeu[0].t))) &&
    (!yeu.khuyen || (yeu.khuyen.length === 1 && typeof yeu.khuyen[0] === 'string')) && !SAO.test(JSON.stringify([yeu.yeu, yeu.khuyen])) && !yeu.lo && !yeu.ket && !yeu.manh && !yeu.phieu,
    'Khách: lĩnh vực yếu nhất (' + yeu.ten + ' ' + yeu.diem + ') chỉ thêm 1 câu lưu ý + 1 gợi ý, không tên sao/%');
  // nhiều lá số: khi lĩnh vực yếu nhất chưa thuận thì có câu "Bạn có xu hướng…" hoặc để trống (giao diện dùng câu mẫu)
  let co = 0, tong = 0, sai = 0;
  for (let i = 0; i < 12; i++) {
    const g = ctx.lapLaSo({ name: 'G' + i, gender: i % 2 ? 'nu' : 'nam', calendar: 'duong', day: 1 + i * 2, month: 1 + i, year: 1970 + i * 3, hour: (i * 5) % 24, minute: 0 }, '');
    const L = g.th6.linhVuc, y = L.slice().sort(function (a, b) { return a.diem - b.diem; })[0]; tong++;
    if (y.yeu) co++;
    if (L.some(function (x) { return x !== y && (x.yeu || x.khuyen); }) || (y.diem >= 6 && (y.yeu || y.khuyen)) || SAO.test(JSON.stringify([y.yeu, y.khuyen]))) sai++;
  }
  ok(!sai, 'Khách 12 lá số: câu lưu ý chỉ ở lĩnh vực yếu nhất chưa thuận (' + co + '/' + tong + ' có câu riêng, còn lại dùng câu mẫu)');
})();
if (loi) { console.log(loi + ' lỗi'); process.exit(1); } else console.log('✔ Tài khoản: tất cả kiểm tra đạt');
