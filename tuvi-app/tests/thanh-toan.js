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
  setValues(v) { v.forEach((row, i) => row.forEach((x, j) => { const R = this.sh.rows[this.r - 1 + i] = this.sh.rows[this.r - 1 + i] || []; R[this.c - 1 + j] = (x => typeof x === 'string' && x[0] === "'" ? x.slice(1) : x)(x); })); return this; },
  setValue(x) { return this.setValues([[x]]); },
  setFontWeight() { return this; }, setBackground() { return this; }, setFontColor() { return this; },
  getRow() { return this.r; },
  createTextFinder(t) { const self = this; return { matchEntireCell() { return this; }, matchCase() { return this; },
    findAll() { const o = []; for (let i = 0; i < self.nr; i++) if (String((self.sh.rows[self.r - 1 + i] || [])[self.c - 1]) === String(t)) o.push(new Range(self.sh, self.r + i, self.c)); return o; } }; }
};
function Sheet(n) { this.name = n; this.rows = []; }
Sheet.prototype = {
  appendRow(r) { this.rows.push(r.map((x => typeof x === 'string' && x[0] === "'" ? x.slice(1) : x))); return this; }, getLastRow() { return this.rows.length; },
  getLastColumn() { return Math.max(0, ...this.rows.map(r => r.length)); },
  getRange(r, c, nr, nc) { return new Range(this, r, c, nr, nc); }, setFrozenRows() {}, setColumnWidth() {}, deleteRow(i) { this.rows.splice(i - 1, 1); }
};
const ss = { getSheetByName: n => sheets[n] || null, insertSheet: n => (sheets[n] = new Sheet(n)), getId: () => 'x' };
const payos = { don: {} };
const ctx = {
  console, Math, Date, JSON,
  Session: { getActiveUser: () => ({ getEmail: () => 'chu@vidu.vn' }), getEffectiveUser: () => ({ getEmail: () => 'chu@vidu.vn' }) },
  Utilities: {
    DigestAlgorithm: { SHA_256: 'sha256' }, Charset: { UTF_8: 'utf8' },
    computeDigest: (a, s) => Array.from(crypto.createHash('sha256').update(s, 'utf8').digest()).map(b => (b > 127 ? b - 256 : b)),
    computeHmacSha256Signature: (s, k) => Array.from(crypto.createHmac('sha256', k).update(s, 'utf8').digest()).map(b => (b > 127 ? b - 256 : b)),
    getUuid: () => crypto.randomUUID(), sleep: () => {}, formatDate: (d, tz, f) => { const x = new Date(d); const p = n => String(n).padStart(2, '0'); return f === 'yyyyMMdd' ? '' + x.getFullYear() + p(x.getMonth() + 1) + p(x.getDate()) : f === 'yyyy-MM-dd' ? x.getFullYear() + '-' + p(x.getMonth() + 1) + '-' + p(x.getDate()) : x.toISOString(); }
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
// Không có mật khẩu thật (TK_PASS) thì thay seed chủ sở hữu bằng một mật khẩu thử – chỉ trong bộ nhớ kiểm thử (rà soát 16/11)
if (!process.env.TK_PASS) { const s = 'salt-thu-nghiem'; ctx.TK_CHU_SEED = { salt: s, hash: ctx.tkBam_('mat-khau-thu-nghiem', s), vaiTro: 'chu', hienThi: 'Chủ sở hữu' }; }
const PASS = process.env.TK_PASS || 'mat-khau-thu-nghiem';
const L = { name: 'Nguyễn Văn An', gender: 'nam', calendar: 'duong', day: 15, month: 8, year: 1990, hour: 10, minute: 30, place: '21.03|105.85|Hà Nội', tz: '7' };

const chu = ctx.dangNhap('chienpham', PASS).token;
// Phần đầu kiểm tra cơ chế với bảng giá cũ (ghim cố định) và tắt quà đăng ký; phần cuối kiểm tra bảng giá mặc định mới + quà
const GIA_CU = { co_ban: 49, tron_goi: 149, cap_doi: 29, dai_van: 19, nam: 29, dong_hanh: 79, bien_co: 29, phoi_ngau: 19, pdf: 29, do_gio: 19, tron_dai_van: 99 };
store.TT_BANG_GIA = JSON.stringify({ phien: ctx.TT_GIA_PHIEN, phan: GIA_CU, goi: [{ tien: 50000, xu: 50 }, { tien: 100000, xu: 110 }, { tien: 200000, xu: 240 }, { tien: 500000, xu: 650 }], thuongDangKy: 0, thuongGTDangKy: 0, kmPhien: ctx.TT_KM_PHIEN });
ok(nem(() => ctx.dangKy('ab', 'matkhau123', 'A', '0912345678')) !== null, 'Đăng ký: chặn tên quá ngắn');
ok(nem(() => ctx.dangKy('khachmoi', 'matkhau123', 'Khách', 'abc')) !== null, 'Đăng ký: bắt buộc SĐT/email hợp lệ');
const dk = ctx.dangKy('khachmoi', 'matkhau123', 'Khách Mới', '0912 345 678');
ok(dk.token && dk.nguoiDung.vaiTro === 'thanhVien', 'Khách tự đăng ký và đăng nhập luôn');
const T = dk.token;
let r = ctx.lapLaSo(L, T);
ok(!r.khach && !r.tongKhoa && r.quyen.co_ban && r.quyen.do_gio && r.soDu === 0 && r.bangGia.phan.bien_co.xu === 29, 'Tài khoản miễn phí: đọc 6 hệ + Tổng hợp 6 hệ + dò giờ (phương án A 16/11)');
let m = ctx.muaPhan(T, L, 'bien_co');
ok(m.ok === false && m.thieu === 29, 'Không đủ xu → báo thiếu 29 xu');
// nạp thủ công khi chưa có payOS
ok(/chưa cài đặt/.test(nem(() => ctx.taoDonNap(T, 0))), 'Chưa cài tài khoản nhận tiền → báo lỗi rõ');
ctx.qtLuuCauHinh(chu, { nganHang: { bin: '970452', stk: '000111222', chuTK: 'pham chien', tenNH: 'KienlongBank' } });
let don = ctx.taoDonNap(T, 0);
ok(don.kenh === 'thucong' && /img\.vietqr\.io\/image\/970452-000111222/.test(don.qrAnh) && /^TCC\d{6}$/.test(don.noiDung), 'Đơn thủ công: VietQR đúng tài khoản + nội dung ' + don.noiDung);
ok(ctx.kiemTraDon(T, don.ma).trangThai === 'CHO', 'Đơn chờ xác nhận');
ok(nem(() => ctx.qtXacNhanDon(T, don.ma)) !== null, 'Thành viên không tự xác nhận đơn được');
ctx.qtXacNhanDon(chu, don.ma);
ok(ctx.kiemTraDon(T, don.ma).soDu === 100, 'Chủ sở hữu xác nhận → cộng 50 xu + thưởng nạp lần đầu 100% = 100 xu');
ok(nem(() => ctx.qtXacNhanDon(chu, don.ma)) !== null && ctx.viCuaToi(T).soDu === 100 && !ctx.viCuaToi(T).lanDau, 'Xác nhận lần 2 không cộng trùng');
ok(ctx.muaPhan(T, L, 'co_ban').daCo && ctx.viCuaToi(T).soDu === 100, 'Tổng hợp 6 hệ đã có sẵn cho tài khoản → mua lại không trừ xu');
m = ctx.muaPhan(T, L, 'bien_co');
ok(m.ok && m.soDu === 71, 'Mở Những năm đáng chú ý: trừ 29 xu, còn 71');
r = ctx.lapLaSo(L, T);
ok(!r.khach && r.moRong && r.battuChiTiet.linhVuc.length === 12 && r.quyen.co_ban, 'Đã mở: nhận bản đầy đủ');
ok(r.moRong.tongHop.phoiNgau === null && Object.keys(r.duDoan.chuDe).length > 0, 'Phần chưa mua (phối ngẫu) bị cắt ở máy chủ, phần đã mua (biến cố) mở');
ok(r.battuChiTiet.luuNien.length === 0 && r.moRong.tongHop.thang.every(function (t) { return t.khoa && t.tv === undefined; }) && r.chiTiet.daiVan.filter(function (d) { return !d.khoa; }).length === 1 && r.chiTiet.daiVan.filter(function (d) { return !d.khoa; })[0].secs.length > 0 && +String(r.chiTiet.daiVan.filter(function (d) { return !d.khoa; })[0].nam).slice(0, 4) + 9 < new Date().getFullYear(), 'Vận hạn chưa mua: lưu niên, 12 tháng, đại vận khóa – trừ 1 đại vận đã qua gần nhất (tự kiểm chứng)');
ok(ctx.lapLaSo(Object.assign({}, L, { viewYear: 2031 }), T).quyen.bien_co, 'Đổi năm xem vẫn giữ quyền (mở vĩnh viễn)');
ok(!ctx.lapLaSo(Object.assign({}, L, { day: 16 }), T).quyen.bien_co, 'Lá số khác → phần đã mua chưa mở');
ok(nem(() => ctx.doGioSinh(Object.assign({ events: [{ nam: 2015, loai: 'ketHon' }] }, L), T)) === null && /cần mở khóa|đăng nhập/i.test(nem(() => ctx.doGioSinh(Object.assign({ events: [{ nam: 2015, loai: 'ketHon' }] }, L), ''))), 'Dò giờ sinh miễn phí cho tài khoản, khách phải đăng nhập');
// payOS
ctx.__checksum = 'ck-secret';
ctx.qtLuuCauHinh(chu, { clientId: 'cid', apiKey: 'ak', checksum: 'ck-secret' });
ok(ctx.__trigger === true, 'Lưu khóa payOS → tự cài trigger đối soát 5 phút');
don = ctx.taoDonNap(T, 1);
ok(don.kenh === 'payos' && don.checkoutUrl && don.stk === '123456789', 'Đơn payOS: chữ ký hợp lệ, nhận link + tài khoản');
ok(ctx.kiemTraDon(T, don.ma).trangThai === 'CHO', 'Chưa trả → vẫn chờ');
Object.assign(payos.don[don.ma], { status: 'PAID', amountPaid: 100000, transactions: [{ reference: 'FT123' }] });
let k = ctx.kiemTraDon(T, don.ma);
ok(k.trangThai === 'DA_TRA' && k.soDu === 181, 'payOS báo PAID → tự cộng 110 xu, không thưởng lần 2 (số dư 181)');
ctx.ttQuetDonTuDong();
ok(ctx.viCuaToi(T).soDu === 181, 'Trigger quét lại không cộng trùng');
m = ctx.muaPhan(T, L, 'tron_goi');
ok(m.ok && m.gia === 120 && m.soDu === 61, 'Trọn đời chỉ trừ phần đã thật sự trả tiền: 149 − 29 = 120 xu (Tổng hợp/dò giờ miễn phí không bị trừ)');
r = ctx.lapLaSo(L, T);
ok(r.moRong.tongHop.hoiTu && r.moRong.tongHop.phoiNgau && r.quyen.pdf && r.chiTiet.daiVan.every(function (d) { return !d.khoa; }) && r.battuChiTiet.luuNien.length === 0, 'Trọn đời: mở bản mệnh, 12 đại vận, biến cố, phối ngẫu, PDF – vận năm vẫn bán theo năm');
// VIP & chủ sở hữu
ctx.taoTaiKhoan(chu, 'nguoinha', 'matkhau123', 'Người nhà', 'vip');
const vip = ctx.dangNhap('nguoinha', 'matkhau123').token;
r = ctx.lapLaSo(Object.assign({}, L, { day: 20 }), vip);
ok(!r.khach && r.quyen.toanQuyen && r.moRong.tongHop.hoiTu, 'VIP: xem toàn bộ không trừ xu');
r = ctx.lapLaSo(Object.assign({}, L, { day: 21 }), chu);
ok(!r.khach && r.quyen.toanQuyen && r.soDu === null, 'Chủ sở hữu: toàn quyền, không cần xu');
ctx.qtDatVaiTro(chu, 'nguoinha', 'thanhVien');
{ const rv = ctx.lapLaSo(Object.assign({}, L, { day: 20 }), vip); ok(!rv.quyen.toanQuyen && !rv.quyen.bien_co && rv.moRong.tongHop.hoiTu === null, 'Hạ VIP → thành viên thường'); }
const tq = ctx.qtTongQuan(chu);
ok(tq.doanhThu.tong === 150000 && tq.doanhThu.soDon === 2 && tq.cauHinh.payos && !JSON.stringify(tq).includes('ck-secret'), 'Quản trị: doanh thu 150.000đ / 2 đơn, không lộ khóa bí mật');
ctx.qtDieuChinhXu(chu, 'khachmoi', 10, 'tặng');
ok(ctx.viCuaToi(T).soDu === 71 && ctx.viCuaToi(T).soCai.length >= 5, 'Tặng xu + sổ cái ghi nhận');
ok(nem(() => ctx.qtLuuBangGia(T, {})) !== null, 'Thành viên không sửa được bảng giá');
ctx.qtLuuBangGia(chu, { phan: { co_ban: 59 }, goi: [{ tien: 100000, xu: 120 }] });
ok(ctx.ttBangGia_().phan.co_ban.xu === 59 && ctx.ttBangGia_().goi.length === 1, 'Sửa bảng giá');
// giới thiệu bạn bè
const b2 = ctx.dangKy('ban.moi', 'matkhau123', 'Bạn Mới', 'ban@moi.vn', 'khachmoi');
don = ctx.taoDonNap(b2.token, 0);
Object.assign(payos.don[don.ma], { status: 'PAID', amountPaid: 100000 });
ctx.kiemTraDon(b2.token, don.ma);
ok(ctx.viCuaToi(b2.token).soDu === 240, 'Người được giới thiệu: gói 120 xu + thưởng lần đầu 120 = 240');
ok(ctx.viCuaToi(T).soDu === 71 + 24, 'Người giới thiệu nhận 20% lần nạp đầu của bạn (+24 xu)');
// mã quà tặng
ok(nem(() => ctx.qtTaoMaQua(T, 'TET2027', 30, 1)) !== null, 'Thành viên không tạo được mã quà');
ctx.qtTaoMaQua(chu, 'tet2027', 30, 1, '2099-01-01');
ok(ctx.nhapMaQua(b2.token, 'Tet2027').soDu === 270, 'Nhập mã quà tặng: +30 xu');
ok(/đã dùng|hết lượt/.test(nem(() => ctx.nhapMaQua(b2.token, 'TET2027'))) && /hết lượt/.test(nem(() => ctx.nhapMaQua(T, 'TET2027'))), 'Mã chỉ dùng 1 lần / hết lượt');
ok(/không đúng/.test(nem(() => ctx.nhapMaQua(T, 'SAIMA'))), 'Mã sai bị từ chối');
ctx.qtTaoMaQua(chu, 'CU2020', 5, 10, '2020-01-01');
ok(/hết hạn/.test(nem(() => ctx.nhapMaQua(T, 'CU2020'))), 'Mã hết hạn bị từ chối');
ctx.qtLuuBangGia(chu, { phan: {}, goi: [{ tien: 50000, xu: 50 }], thuongLanDau: 50, thuongGioiThieu: 10 });
ok(ctx.ttBangGia_().thuongLanDau === 50 && ctx.ttBangGia_().thuongGioiThieu === 10, 'Chỉnh % thưởng lần đầu / giới thiệu');
// Xem cặp đôi (29 xu, mở theo từng cặp, không thuộc trọn gói)
const L2 = { name: 'Trần Thị Thùy Vy', gender: 'nu', calendar: 'duong', day: 3, month: 4, year: 1994, hour: 7, minute: 0, place: '10.78|106.70|TP. Hồ Chí Minh', tz: '7' };
let cd = ctx.lapCapDoi(L, L2, T);
ok(cd.biKhoa && !cd.moKhoa && cd.tieuChi.filter(t => t.diem != null).length === 2 && !cd.thoiDiem && !cd.linhVuc, 'Cặp đôi: trọn gói lá số không mở cặp đôi – chỉ bản xem thử');
ok(ctx.lapCapDoi(L, L2, '').biKhoa && !ctx.lapCapDoi(L, L2, '').dangNhap, 'Cặp đôi: khách chưa đăng nhập xem thử được');
if (ctx.viCuaToi(T).soDu < 29) ctx.qtDieuChinhXu(chu, 'khachmoi', 50, 'test cặp đôi');
const truoc = ctx.viCuaToi(T).soDu;
m = ctx.muaPhan(T, { a: L, b: L2 }, 'cap_doi');
ok(m.ok && m.gia === 29 && m.soDu === truoc - 29, 'Mở cặp đôi: trừ 29 xu (không cần Bản mở của người thứ hai)');
cd = ctx.lapCapDoi(L2, L, T);
ok(cd.moKhoa && cd.thoiDiem && cd.linhVuc.taiChinh && cd.tieuChi.every(t => t.diem != null), 'Cặp đôi đã mở: đầy đủ, không phụ thuộc thứ tự nhập');
ok(ctx.muaPhan(T, { a: L2, b: L }, 'cap_doi').daCo, 'Mua lại cặp đã mở → báo đã có, không trừ xu');
ok(ctx.lapCapDoi(L, Object.assign({}, L2, { day: 4 }), T).biKhoa, 'Cặp khác → chưa mở');
ok(ctx.lapCapDoi(L, L2, chu).moKhoa, 'Chủ sở hữu xem cặp đôi không cần mua');
// ---- Bảng giá mới & kéo người dùng ----
store.TT_BANG_GIA = JSON.stringify({ phan: { co_ban: 99 }, thuongDangKy: 0, kmPhien: ctx.TT_KM_PHIEN });   // bảng giá lưu từ phiên cũ (không có "phien")
ok(ctx.ttBangGia_().phan.co_ban.xu === ctx.TT_PHAN_MAC_DINH.co_ban.xu && ctx.ttBangGia_().thuongDangKy === 0, 'Bảng giá phiên cũ bị bỏ qua, giữ mức thưởng đã chỉnh');
delete store.TT_BANG_GIA;
const bgM = ctx.ttBangGia_();
ok(bgM.phan.tron_goi.xu === 89 && bgM.phan.hoi_vien.xu === 99 && bgM.phan.gia_dinh_3.xu === 79 && bgM.phan.gia_dinh_5.xu === 119, 'Phương án A: Trọn đời 89, Hội viên năm 99, gia đình 79/119');
ok(Object.keys(bgM.phan).every(k => bgM.phan[k].goc === undefined), 'Không còn giá gạch ngang (giá chưa từng bán)');
ok(bgM.thuongDangKy === 9 && bgM.thuongGTDangKy === 0, 'Quà đăng ký 9 xu; không thưởng xu khi bạn chỉ đăng ký (chỉ thưởng khi bạn nạp lần đầu)');
{ const cu = store.TT_BANG_GIA; store.TT_BANG_GIA = JSON.stringify({ phien: ctx.TT_GIA_PHIEN, thuongDangKy: 50, thuongGTDangKy: 9, kmPhien: 2 }); ok(ctx.ttBangGia_().thuongDangKy === 9 && ctx.ttBangGia_().thuongGTDangKy === 0, 'Mức quà 50 xu / thưởng mời lưu ở phiên khuyến mại cũ bị bỏ qua → 9 / 0'); store.TT_BANG_GIA = cu; }
const ck = ctx.bangGiaCongKhai(); ok(ck.phan && ck.thuongDangKy === bgM.thuongDangKy, 'Bảng giá công khai cho khách');
const n1 = ctx.dangKy('nguoimoi1', 'matkhau123', 'Người Mới', 'moi1@x.vn', '');
ok(n1.qua.xu === bgM.thuongDangKy && ctx.viCuaToi(n1.token).soDu === bgM.thuongDangKy, 'Đăng ký nhận quà chào mừng');
m = ctx.muaPhan(n1.token, Object.assign({}, L, { day: 11 }), 'thang', new Date().getFullYear() + '-12'); ok(m.ok && m.soDu === bgM.thuongDangKy - bgM.phan.thang.xu, 'Dùng quà 9 xu mở ngay 1 tháng, không cần nạp');
ok(ctx.dangKy('nguoimoi1b', 'matkhau123', 'Trùng Liên Hệ', 'MOI1@x.vn ', '').qua.xu === 0, 'Quà đăng ký mỗi email chỉ một lần (không phân biệt hoa thường)');
ok(ctx.dangKy('nguoimoi6', 'matkhau123', 'B6', '+84 98 765 4321', '').qua.xu === 9 && ctx.dangKy('nguoimoi6b', 'matkhau123', 'B6b', '0987654321', '').qua.xu === 0, 'Quà đăng ký mỗi SĐT chỉ một lần (+84 và 0 là một)');
// Hội viên năm: mở vận năm/tháng/nhật vận cho mọi lá số của tài khoản trong 12 tháng
ctx.qtDieuChinhXu(chu, 'nguoimoi6', 200, 'test hội viên');
{ const t6 = ctx.dangNhap('nguoimoi6', 'matkhau123').token, x0 = ctx.viCuaToi(t6).soDu;
  let h = ctx.lapLaSo(Object.assign({}, L, { day: 12 }), t6); ok(h.vanTom.coNam === false && !h.vanTom.hoiVien, 'Chưa là Hội viên: vận năm khóa');
  const hv = ctx.muaPhan(t6, null, 'hoi_vien'), hanMong = new Date(); hanMong.setDate(hanMong.getDate() + 365);
  ok(hv.ok && hv.gia === 99 && ctx.viCuaToi(t6).soDu === x0 - 99 && hv.hoiVien === hanMong.toISOString().slice(0, 10), 'Mua Hội viên năm: trừ 99 xu, hạn 365 ngày (' + hv.hoiVien + ')');
  h = ctx.lapLaSo(Object.assign({}, L, { day: 12 }), t6); const h2 = ctx.lapLaSo(L2, t6);
  ok(h.vanTom.coNam && h.vanTom.coThang && h.chiTiet.nguyetVan.length === 12 && h.vanTom.hoiVien === hv.hoiVien, 'Hội viên: vận năm + 12 tháng + nhật vận mở');
  ok(h2.vanTom.coNam && h2.quyen.hoiVien, 'Hội viên: áp dụng cho mọi lá số của tài khoản');
  ok(h.chiTiet.daiVan.filter(d => !d.khoa).length === 1 && !h.quyen.bien_co, 'Hội viên không gồm 12 đại vận / biến cố (bán riêng)');
  const hv2 = ctx.muaPhan(t6, null, 'hoi_vien'); ok(hv2.ok && hv2.hoiVien > hv.hoiVien && (new Date(hv2.hoiVien) - new Date(hv.hoiVien)) / 864e5 === 365, 'Gia hạn Hội viên: cộng nối 365 ngày');
  ok(!ctx.lapLaSo(Object.assign({}, L, { day: 12 }), dk.token).quyen.hoiVien, 'Hội viên của tài khoản khác không lan sang');
}
const truocGT = ctx.ttSoDu_('nguoimoi1');
const n2 = ctx.dangKy('nguoimoi2', 'matkhau123', 'Bạn Của Người Mới', 'moi2@x.vn', 'nguoimoi1');
ok(n2.qua.xu === bgM.thuongDangKy && n2.qua.gt === 0, 'Được mời: chỉ quà đăng ký 9 xu');
ok(ctx.ttSoDu_('nguoimoi1') === truocGT, 'Người mời chưa nhận xu khi bạn chỉ đăng ký (chống tạo tài khoản ảo)');
const o1 = JSON.parse(store.TK_nguoimoi1); o1.soMoiDK = bgM.gtToiDa; store.TK_nguoimoi1 = JSON.stringify(o1);
ctx.dangKy('nguoimoi3', 'matkhau123', 'B3', 'moi3@x.vn', 'nguoimoi1');
ok(ctx.ttSoDu_('nguoimoi1') === truocGT + bgM.thuongGTDangKy, 'Thưởng mời có trần số lượt');
const n4 = ctx.dangKy('nguoimoi4', 'matkhau123', 'B4', 'moi4@x.vn', 'khong.co.ai');
ok(n4.qua.gt === 0 && n4.qua.xu === bgM.thuongDangKy, 'Mã mời không tồn tại: chỉ quà đăng ký');
if (loi) { console.log(loi + ' lỗi'); process.exit(1); } else console.log('✔ Thanh toán: tất cả kiểm tra đạt');
