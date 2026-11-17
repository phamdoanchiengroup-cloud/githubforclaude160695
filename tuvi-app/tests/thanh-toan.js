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
ok(nem(() => ctx.dangKy('ab', 'matkhau123', 'A', 'ab@vidu.vn')) !== null, 'Đăng ký: chặn tên quá ngắn');
ok(nem(() => ctx.dangKy('khachmoi', 'matkhau123', 'Khách', 'abc')) !== null, 'Đăng ký: bắt buộc SĐT/email hợp lệ');
const dk = ctx.dangKy('khachmoi', 'matkhau123', 'Khách Mới', 'khachmoi@vidu.vn');
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
ok(ctx.viCuaToi(T).soDu === 71 && JSON.parse(store['TK_ban.moi']).gioiThieu === 'khachmoi', 'Phiên 4: thưởng mời = 0 (người giới thiệu không nhận xu khi bạn nạp), mã mời vẫn lưu');
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
// ---- Bảng giá mới (phiên 4, 16/11: bán lẻ 9/19 xu) & quà xác thực email ----
store.TT_BANG_GIA = JSON.stringify({ phan: { co_ban: 99 }, thuongDangKy: 0, kmPhien: ctx.TT_KM_PHIEN });   // bảng giá lưu từ phiên cũ (không có "phien")
ok(ctx.ttBangGia_().phan.co_ban.xu === ctx.TT_PHAN_MAC_DINH.co_ban.xu && ctx.ttBangGia_().thuongDangKy === 0, 'Bảng giá phiên cũ bị bỏ qua, giữ mức thưởng đã chỉnh');
delete store.TT_BANG_GIA;
const bgM = ctx.ttBangGia_(), P_ = bgM.phan;
ok(ctx.TT_GIA_PHIEN === 4 && ctx.TT_KM_PHIEN === 4, 'TT_GIA_PHIEN = TT_KM_PHIEN = 4');
ok(P_.dai_van.xu === 19 && P_.dai_van_qua.xu === 9 && P_.nam.xu === 19 && P_.thang.xu === 9 && P_.phoi_ngau.xu === 9 && P_.bien_co.xu === 19 && P_.cap_doi.xu === 19 && P_.pdf.xu === 19 && P_.van_ngay.xu === 19,
  'Giá lẻ: 10 năm 19, kiểm chứng 9, năm 19, tháng 9, bạn đời 9, năm đáng chú ý 19, cặp đôi 19, PDF 19, lời nhắn mỗi sáng 19');
ok(P_.nam_cd.xu === 9 && P_.quan_he.xu === 9 && /bức tranh chung/.test(P_.nam.ten), 'Phần mới: chủ đề năm 9, quan hệ người thân 9; "Năm X: bức tranh chung"');
ok(Object.keys(P_).filter(k => !P_[k].an && !P_[k].mienPhi && !P_[k].luot && ['dong_hanh', 'tron_goi', 'co_ban', 'do_gio', 'dat_ten'].indexOf(k) < 0).every(k => P_[k].xu === 9 || P_[k].xu === 19), 'Mọi phần lẻ đang bán chỉ 9 hoặc 19 xu');
ok(P_.dong_hanh.xu === 49 && P_.tron_goi.xu === 89 && P_.gia_dinh_3.xu === 79 && P_.gia_dinh_5.xu === 119, 'Combo: Đồng hành 49, Trọn đời 89, gia đình 79/119');
ok(P_.hoi_vien.an && P_.tron_dai_van.an && P_.ban_tin.an, 'Ẩn (thôi bán): Hội viên năm, 12 đại vận, bản tin tháng lẻ');
ok(Object.keys(P_).every(k => P_[k].goc === undefined), 'Không còn giá gạch ngang (giá chưa từng bán)');
ok(bgM.thuongDangKy === 39 && bgM.thuongGTDangKy === 0 && bgM.thuongGioiThieu === 0, 'Quà xác thực email 39 xu; bỏ thưởng mời (đăng ký 0, nạp lần đầu 0)');
{ const cu = store.TT_BANG_GIA; store.TT_BANG_GIA = JSON.stringify({ phien: ctx.TT_GIA_PHIEN, thuongDangKy: 50, thuongGTDangKy: 9, thuongGioiThieu: 20, kmPhien: ctx.TT_KM_PHIEN - 1 });
  const b = ctx.ttBangGia_(); ok(b.thuongDangKy === 39 && b.thuongGTDangKy === 0 && b.thuongGioiThieu === 0, 'Mức quà / thưởng mời lưu ở phiên khuyến mại cũ bị bỏ qua → 39 / 0 / 0'); store.TT_BANG_GIA = cu; }
{ const cu = store.TT_BANG_GIA; store.TT_BANG_GIA = JSON.stringify({ phien: ctx.TT_GIA_PHIEN, thuongDangKy: 25, kmPhien: ctx.TT_KM_PHIEN }); ok(ctx.ttBangGia_().thuongDangKy === 25, 'Quản trị vẫn chỉnh được mức quà (thuongDangKy)'); store.TT_BANG_GIA = cu; }
const ck = ctx.bangGiaCongKhai(); ok(ck.phan && ck.thuongDangKy === bgM.thuongDangKy, 'Bảng giá công khai cho khách');
{ // phiên 3 → 4: giữ giá tùy chỉnh và gói nạp của chủ dự án, trừ các gói đổi nghĩa
  const cu = store.TT_BANG_GIA; store.TT_BANG_GIA = JSON.stringify({ phien: ctx.TT_GIA_PHIEN - 1, phan: { cap_doi: 25, thang: 12, tron_goi: 49, gia_dinh_3: 39, dong_hanh: 39, dai_van: 9, van_ngay: 29, nam: 29 }, goi: [{ tien: 30000, xu: 33 }], kmPhien: 3 });
  const b = ctx.ttBangGia_(); ok(b.phan.cap_doi.xu === 25 && b.phan.thang.xu === 12 && b.goi.length === 1 && b.goi[0].xu === 33 && b.phan.tron_goi.xu === 89 && b.phan.gia_dinh_3.xu === 79 &&
    b.phan.dong_hanh.xu === 49 && b.phan.dai_van.xu === 19 && b.phan.van_ngay.xu === 19 && b.phan.nam.xu === 19, 'Bảng giá phiên 3: giữ giá tùy chỉnh + gói nạp; gói đổi nghĩa (Đồng hành, 10 năm, lời nhắn, Trọn đời, gia đình, năm) lấy giá mới');
  store.TT_BANG_GIA = cu; }

// --- Đăng ký không tặng ngay; quà 39 xu sau khi xác thực email bằng mã 6 số ---
const thu = []; let quota = 100, guiLoi = false;
ctx.MailApp = { sendEmail: o => { if (guiLoi) throw new Error('mail lỗi'); thu.push(o); }, getRemainingDailyQuota: () => quota };
const maCuoi = () => (String(thu[thu.length - 1].body).match(/(\d{6})/) || [])[1];
const tkJ = t => JSON.parse(store['TK_' + t]), tkSet = (t, f) => { const o = tkJ(t); f(o); store['TK_' + t] = JSON.stringify(o); };
const n1 = ctx.dangKy('nguoimoi1', 'matkhau123', 'Người Mới', 'moi1@x.vn', '');
ok(n1.qua.xu === 0 && n1.canXacThuc === true && n1.emailGoiY === 'moi1@x.vn' && ctx.viCuaToi(n1.token).soDu === 0 && n1.quaXacThuc === 39, 'Đăng ký: chưa tặng xu, trả canXacThuc + gợi ý email');
ok(ctx.xacThucEmail(n1.token, '123456').chuaCo, 'Chưa gửi mã mà nhập → báo chưa có mã');
ok(/Email chưa đúng/.test(nem(() => ctx.guiMaEmail(n1.token, 'moi1@x')) || ''), 'Email sai định dạng bị từ chối');
let g1 = ctx.guiMaEmail(n1.token, 'Moi1@x.vn');
const ma1 = maCuoi();
ok(g1.ok && g1.hetPhut === 15 && g1.conLuot === 4 && thu.length === 1 && thu[0].to === 'Moi1@x.vn' && /^\d{6}$/.test(ma1) && !JSON.stringify(tkJ('nguoimoi1')).includes(ma1), 'Gửi mã 6 số qua MailApp (mã chỉ lưu dạng băm)');
ok(ctx.guiMaEmail(n1.token, 'Moi1@x.vn').choGiay > 0 && thu.length === 1, 'Gửi lại trong 60 giây bị từ chối, không tốn email');
const sai1 = ctx.xacThucEmail(n1.token, ma1 === '000000' ? '111111' : '000000');
ok(sai1.ok === false && sai1.conLan === 4 && ctx.ttSoDu_('nguoimoi1') === 0, 'Nhập sai: báo còn 4 lần, không tặng');
const dung1 = ctx.xacThucEmail(n1.token, ma1);
ok(dung1.ok && dung1.qua.xu === 39 && dung1.soDu === 39 && dung1.email === 'Moi1@x.vn' && ctx.phien(n1.token).daXacThuc && ctx.phien(n1.token).email === 'Moi1@x.vn', 'Nhập đúng: lưu email đã xác thực + tặng 39 xu');
ok(ctx.xacThucEmail(n1.token, ma1).chuaCo, 'Mã đã dùng không dùng lại được');
tkSet('nguoimoi1', o => { o.otp = null; });
ctx.guiMaEmail(n1.token, 'khac@x.vn'); { const v = ctx.xacThucEmail(n1.token, maCuoi()); ok(v.ok && v.qua.xu === 0 && v.qua.lyDo === 'taiKhoan' && ctx.ttSoDu_('nguoimoi1') === 39, 'Tài khoản đã nhận quà: xác thực email khác không nhận thêm'); }
m = ctx.muaPhan(n1.token, Object.assign({}, L, { day: 11 }), 'thang', new Date().getFullYear() + '-12'); ok(m.ok && m.soDu === 39 - P_.thang.xu, 'Dùng quà mở ngay 1 tháng, không cần nạp');
const n1b = ctx.dangKy('nguoimoi1b', 'matkhau123', 'Trùng Email', 'nguoimoi1b@vidu.vn', '');
ctx.guiMaEmail(n1b.token, 'MOI1@x.vn '); { const v = ctx.xacThucEmail(n1b.token, maCuoi()); ok(v.ok && v.qua.xu === 0 && v.qua.lyDo === 'email' && ctx.ttSoDu_('nguoimoi1b') === 0, 'Quà mỗi email chỉ một lần (không phân biệt hoa thường) – tài khoản khác vẫn xác thực được'); }
const n7 = ctx.dangKy('nguoimoi7', 'matkhau123', 'B7', 'nguoimoi7@vidu.vn', ''), n7b = ctx.dangKy('nguoimoi7b', 'matkhau123', 'B7b', 'nguoimoi7b@vidu.vn', '');
ctx.guiMaEmail(n7.token, 'Ten.Mot+abc@GoogleMail.com'); const q7 = ctx.xacThucEmail(n7.token, maCuoi()).qua.xu;
ctx.guiMaEmail(n7b.token, 'tenmot@gmail.com'); const q7b = ctx.xacThucEmail(n7b.token, maCuoi()).qua.xu;
ok(q7 === 39 && q7b === 0, 'Quà: bí danh Gmail (dấu chấm, +đuôi, googlemail) tính là một email');
ok(ctx.ttLienHeChuan_('ab+x@yahoo.com') === 'ab@yahoo.com' && ctx.ttLienHeChuan_('a.b@yahoo.com') === 'a.b@yahoo.com', 'Chuẩn hóa email: bỏ +đuôi; chỉ Gmail bỏ dấu chấm');
{ // mã hết hạn 15 phút
  const t = ctx.dangKy('otphethan', 'matkhau123', 'H', 'hh@x.vn', '').token; ctx.guiMaEmail(t, 'hh@x.vn'); const ma = maCuoi();
  tkSet('otphethan', o => { o.otp.het = Date.now() - 1000; });
  const v = ctx.xacThucEmail(t, ma); ok(v.ok === false && v.hetHan && ctx.ttSoDu_('otphethan') === 0 && !tkJ('otphethan').otp, 'Mã quá 15 phút: báo hết hạn, không tặng');
  tkSet('otphethan', o => { o.otp = null; }); ctx.guiMaEmail(t, 'hh@x.vn');
  ok(ctx.xacThucEmail(t, maCuoi()).qua.xu === 39, 'Gửi lại mã mới sau khi hết hạn → xác thực được, nhận quà'); }
{ // sai 5 lần → mã khóa, kể cả nhập đúng sau đó
  const t = ctx.dangKy('otpsai', 'matkhau123', 'S', 'otpsai@vidu.vn', '').token; ctx.guiMaEmail(t, 'sai@x.vn'); const ma = maCuoi(), sai = ma === '999999' ? '888888' : '999999';
  let v; for (let i = 0; i < 5; i++) v = ctx.xacThucEmail(t, sai);
  ok(v.khoaMa && v.conLan === 0 && ctx.xacThucEmail(t, ma).khoaMa && ctx.ttSoDu_('otpsai') === 0, 'Sai 5 lần: mã bị khóa, nhập đúng cũng không nhận'); }
{ // tối đa 5 lần gửi mỗi ngày + hết quota MailApp
  const t = ctx.dangKy('otpgioihan', 'matkhau123', 'G', 'otpgioihan@vidu.vn', '').token;
  tkSet('otpgioihan', o => { o.otpNgay = ctx.Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd'); o.otpDem = 5; });
  const n0 = thu.length, v = ctx.guiMaEmail(t, 'gh@x.vn'); ok(v.ok === false && v.hetLuot && thu.length === n0, 'Quá 5 lần gửi mã trong ngày: từ chối, không gửi');
  tkSet('otpgioihan', o => { o.otpDem = 0; });
  quota = 40; const v2 = ctx.guiMaEmail(t, 'gh@x.vn'); ok(v2.ok === false && v2.hetQuota && /ngày mai/.test(v2.thongBao) && thu.length === n0, 'Quota MailApp còn ≤ 40 (chừa cho người trả tiền): báo thử lại ngày mai, không gửi');
  quota = 41; ok(ctx.guiMaEmail(t, 'gh@x.vn').ok && thu.length === n0 + 1, 'Quota còn 41 → gửi được');
  quota = 100; tkSet('otpgioihan', o => { o.otp = null; }); guiLoi = true;
  ok(/Chưa gửi được email/.test(nem(() => ctx.guiMaEmail(t, 'gh@x.vn')) || '') && !tkJ('otpgioihan').otp, 'MailApp lỗi: báo lỗi rõ, không giữ mã treo'); guiLoi = false; }
{ // tài khoản cũ đã nhận quà kiểu cũ (sổ cái 'DK') → không nhận thêm 39 xu
  const t = ctx.dangKy('tkcuqua', 'matkhau123', 'Cũ', 'tkcuqua@vidu.vn', '').token;
  ctx.ttKhoa_(() => ctx.ttCong_('tkcuqua', 9, 'Quà chào mừng khi đăng ký', 'DK'));
  ctx.guiMaEmail(t, 'cu@x.vn'); const v = ctx.xacThucEmail(t, maCuoi());
  ok(v.ok && v.qua.xu === 0 && v.qua.lyDo === 'taiKhoan' && ctx.ttSoDu_('tkcuqua') === 9, 'Tài khoản đã nhận quà 9/50 xu kiểu cũ: xác thực email không nhận thêm'); }
const n6 = ctx.dangKy('nguoimoi6', 'matkhau123', 'B6', 'nguoimoi6@vidu.vn', '');
ok(n6.qua.xu === 0 && n6.emailGoiY === 'nguoimoi6@vidu.vn' && n6.canXacThuc && ctx.ttSoDu_('nguoimoi6') === 0, 'Đăng ký: chưa tặng ngay, gợi ý đúng email để xác thực');
ok(/email hợp lệ/.test(nem(() => ctx.dangKy('nguoisdt', 'matkhau123', 'SĐT', '0987654321', ''))), '17/11: chỉ đăng ký bằng email – số điện thoại bị từ chối');

// --- Chủ đề năm (nam_cd) và bức tranh chung (nam) ---
const vyN = new Date().getFullYear(), LN = Object.assign({}, L, { day: 13, viewYear: vyN });
ctx.qtDieuChinhXu(chu, 'nguoimoi6', 300, 'test chủ đề năm');
const t6 = ctx.dangNhap('nguoimoi6', 'matkhau123').token;
let rN = ctx.lapLaSo(LN, t6);
const CDK = ['cv', 'tien', 'tc', 'sk'];
ok(rN.namCd && CDK.every(k => rN.namCd[k] && rN.namCd[k].khoa && !rN.namCd[k].items && rN.namCd[k].tom === '' && rN.namCd[k].id === k + ':' + vyN && rN.namCd[k].gia === 9 && rN.namCd[k].nhan), 'Chưa mua gì: 4 chủ đề chỉ có tên + nhãn, không có lời luận / tóm tắt');
ok(CDK.every(k => rN.vanTom.cd[k] === false) && rN.giaNangCap.dong_hanh.gia === 49, 'vanTom.cd báo 4 chủ đề chưa mở; giá Đồng hành 49');
ok(/Chủ đề năm không hợp lệ/.test(nem(() => ctx.muaPhan(t6, LN, 'nam_cd', 'abc:' + vyN)) || ''), 'Mã chủ đề sai bị từ chối');
let du6 = ctx.ttSoDu_('nguoimoi6');
m = ctx.muaPhan(t6, LN, 'nam_cd', 'cv:' + vyN); ok(m.ok && m.gia === 9 && m.soDu === du6 - 9, 'Mua chủ đề Công việc năm nay: 9 xu');
ok(ctx.muaPhan(t6, LN, 'nam_cd', 'cv|' + vyN).daCo, 'Mua lại chủ đề đã mở → đã có');
rN = ctx.lapLaSo(LN, t6);
const cdHN = kc => ctx.htCdCuaKc_(kc), H6 = rN.moRong.tongHop.hoSoNam, lo6 = H6.noiBat[0];
ok(rN.namCd.cv.co && rN.namCd.cv.items.length >= 3 && rN.namCd.cv.khuyen.length >= 1 && rN.namCd.cv.tom && ['tien', 'tc', 'sk'].every(k => rN.namCd[k].khoa), 'Chủ đề đã mua có đủ lời luận; 3 chủ đề còn lại khóa');
ok(rN.vanTom.coNam === false && rN.chiTiet.nguyetVan.length === 0, 'Mua chủ đề không mở bức tranh chung');
ok(H6.suKien.filter(x => cdHN(x.kc) === 'cv').every(x => !x.khoa && x.giai) && H6.suKien.filter(x => cdHN(x.kc) !== 'cv' && x.k !== lo6).every(x => x.khoa && !x.giai && !x.khuyen), 'Hồ sơ năm: sự kiện chủ đề đã mua đầy đủ, chủ đề khác chỉ giữ tên (trừ 1 sự kiện mồi)');
m = ctx.muaPhan(t6, LN, 'nam', vyN); ok(m.ok && m.gia === 19, 'Mua bức tranh chung 19 xu');
rN = ctx.lapLaSo(LN, t6);
ok(rN.vanTom.coNam && ['tien', 'tc', 'sk'].every(k => rN.namCd[k].khoa && rN.namCd[k].tom && !rN.namCd[k].items), 'Bức tranh chung (mới): mỗi chủ đề chưa mua chỉ có 1 dòng tóm tắt');
ok(rN.moRong.tongHop.hoSoNam.khiaCanh.filter(x => cdHN(x.k) === 'tien').every(x => x.khoa && !x.cau), 'Bức tranh chung không gồm chi tiết khía cạnh của chủ đề chưa mua');
du6 = ctx.ttSoDu_('nguoimoi6');
m = ctx.muaPhan(t6, LN, 'dong_hanh', vyN);
ok(m.ok && m.gia === 25 && ctx.ttSoDu_('nguoimoi6') === du6 - 25, 'Đồng hành 49: đã trả 19 + 9 = 28 nhưng chỉ trừ tối đa 50% (24) → còn 25 xu');
rN = ctx.lapLaSo(LN, t6);
ok(CDK.every(k => rN.namCd[k].co && rN.namCd[k].items) && rN.vanTom.coThang, 'Đồng hành: mở cả 4 chủ đề + các tháng');
{ // người mua "Vận năm" kiểu cũ (trước phiên 4, dòng MoKhoa không có phiên) giữ cả 4 chủ đề; dòng mới (phiên 4) thì không
  const Lc = Object.assign({}, L, { day: 14, viewYear: vyN }), Lm = Object.assign({}, L, { day: 17, viewYear: vyN });
  ctx.ttSheet_('MoKhoa').appendRow([new Date(), 'nguoimoi6', ctx.ttKhoaLaSo_(Lc), 'nam:' + vyN, 29, 'An (cũ)']);
  ctx.ttSheet_('MoKhoa').appendRow([new Date(), 'nguoimoi6', ctx.ttKhoaLaSo_(Lm), 'nam:' + vyN, 19, 'An (mới)', 4]);
  const rc = ctx.lapLaSo(Lc, t6), rm = ctx.lapLaSo(Lm, t6);
  ok(rc.vanTom.coNam && CDK.every(k => rc.namCd[k].co && rc.namCd[k].items) && rc.moRong.tongHop.hoSoNam.suKien.every(x => !x.khoa), 'Vận năm kiểu cũ: giữ trọn năm gồm cả 4 chủ đề');
  ok(rm.vanTom.coNam && CDK.every(k => rm.namCd[k].khoa), 'Bức tranh chung mua ở phiên 4: không gồm 4 chủ đề');
  ok(ctx.muaPhan(t6, Lc, 'nam_cd', 'sk:' + vyN).daCo, 'Người mua năm kiểu cũ mua chủ đề → đã có, không trừ xu'); }

// --- Trọn đời: trừ phần lẻ đã mua, tối đa 50% ---
{ const Lt = Object.assign({}, L, { day: 18 }); ctx.qtDieuChinhXu(chu, 'nguoimoi6', 200, 'test trọn đời');
  ['bien_co', 'pdf', 'phoi_ngau'].forEach(k => ctx.muaPhan(t6, Lt, k));
  const rt = ctx.lapLaSo(Lt, t6); ok(rt.giaNangCap.tron_goi.gia === 45 && rt.giaNangCap.tron_goi.tru === 44, 'Xem trước Trọn đời: đã trả 47 nhưng chỉ trừ 44 (50% của 89) → 45');
  const d0 = ctx.ttSoDu_('nguoimoi6'); m = ctx.muaPhan(t6, Lt, 'tron_goi');
  ok(m.ok && m.gia === 45 && ctx.ttSoDu_('nguoimoi6') === d0 - 45, 'Trọn đời 89: trừ tối đa 50% → trả 45');
  const r2 = ctx.lapLaSo(Lt, t6); ok(r2.chiTiet.daiVan.every(d => !d.khoa) && r2.quyen.bien_co && r2.quyen.pdf && r2.quyen.phoi_ngau && !r2.vanTom.coNam && r2.namCd.cv.khoa, 'Trọn đời: 12 đại vận + biến cố + bạn đời + PDF, không gồm năm/tháng/chủ đề'); }
ok(ctx.muaPhan(t6, Object.assign({}, L, { day: 19 }), 'phoi_ngau').gia === 9, 'Người bạn đời mua thẳng (bỏ điều kiện mở Tổng hợp trước)');

// --- Hội viên năm / 12 đại vận / bản tin: thôi bán, người đã mua giữ quyền ---
ok(/Không có gói/.test(nem(() => ctx.muaPhan(t6, null, 'hoi_vien')) || '') && /Không có gói/.test(nem(() => ctx.muaPhan(t6, L, 'tron_dai_van')) || '') && /Không có gói/.test(nem(() => ctx.muaPhan(t6, L, 'ban_tin')) || ''), 'Không bán Hội viên năm / 12 đại vận / bản tin lẻ nữa');
{ const hanCon = (vyN + 1) + '-06-30', Lh = Object.assign({}, L, { day: 12, viewYear: vyN });
  ctx.ttSheet_('MoKhoa').appendRow([new Date(), 'nguoimoi6', 'TK:nguoimoi6', 'hoi_vien:' + hanCon, 99, 'Hội viên năm']);
  const h = ctx.lapLaSo(Lh, t6), h2 = ctx.lapLaSo(Object.assign({}, L2, { viewYear: vyN }), t6);
  ok(h.vanTom.hoiVien === hanCon && h.vanTom.coNam && h.vanTom.coThang && h.chiTiet.nguyetVan.length === 12 && CDK.every(k => h.namCd[k].co) && h2.vanTom.coNam, 'Hội viên còn hạn (mua trước 16/11): vẫn mở năm + tháng + 4 chủ đề cho mọi lá số');
  const sd = ctx.ttSoDu_('nguoimoi6'); ok(ctx.muaPhan(t6, Lh, 'dong_hanh', vyN).daCo && ctx.ttSoDu_('nguoimoi6') === sd, 'Hội viên mua Đồng hành → đã có, không trừ xu');
  ok(h.chiTiet.daiVan.filter(d => !d.khoa).length === 1 && !h.quyen.bien_co, 'Hội viên không gồm 12 đại vận / biến cố');
  const t1 = n1.token; ctx.ttSheet_('MoKhoa').appendRow([new Date(), 'nguoimoi1', 'TK:nguoimoi1', 'hoi_vien:2020-01-01', 99, 'Hội viên năm']);
  ok(!ctx.lapLaSo(Lh, t1).quyen.hoiVien && !ctx.lapLaSo(Lh, t1).vanTom.coNam, 'Hội viên đã hết hạn: không còn quyền');
  const Ld = Object.assign({}, L, { day: 22 }); ctx.ttSheet_('MoKhoa').appendRow([new Date(), 'nguoimoi1', ctx.ttKhoaLaSo_(Ld), 'tron_dai_van', 39, 'An']);
  ok(ctx.lapLaSo(Ld, t1).chiTiet.daiVan.every(d => !d.khoa), 'Người đã mua 12 đại vận (gói cũ): vẫn mở cả 12 đại vận'); }

// --- Quan hệ người thân (quan_he, 9 xu/cặp, khóa như Cặp đôi) ---
{ const ds = ctx.giaDinhLuu([
    { ten: 'Tôi', quanHe: 'Bản thân', input: { name: 'Tôi', gender: 'nam', calendar: 'duong', day: 15, month: 8, year: 1990, hour: 10, minute: 30 } },
    { ten: 'Mẹ', quanHe: 'Mẹ', input: { name: 'Mẹ', gender: 'nu', calendar: 'duong', day: 2, month: 3, year: 1965, hour: 6, minute: 0 } },
    { ten: 'Vợ', quanHe: 'Vợ', input: { name: 'Vợ', gender: 'nu', calendar: 'duong', day: 3, month: 4, year: 1994, hour: 7, minute: 0 } }], t6).ds;
  let Q = ctx.giaDinhQuanHe([ds[0].id, ds[1].id], t6), c = Q.cap[0];
  ok(!c.moQH && c.giaQH === 9 && c.luan.khoa && c.luan.muc.length === 5 && c.luan.muc.every(x => !x.ds) && c.tomTat.length >= 1 && c.diem >= 0, 'Quan hệ chưa mua: phần xem cũ giữ đầy đủ (miễn phí), 5 mục "Hiểu nhau hơn" chỉ còn tên');
  const d0 = ctx.ttSoDu_('nguoimoi6'); m = ctx.muaPhan(t6, { ids: [ds[0].id, ds[1].id] }, 'quan_he');
  ok(m.ok && m.gia === 9 && ctx.ttSoDu_('nguoimoi6') === d0 - 9, 'Mua quan hệ Tôi – Mẹ: 9 xu');
  ok(ctx.muaPhan(t6, { a: ds[1].input, b: ds[0].input }, 'quan_he').daCo, 'Khóa cặp không phụ thuộc thứ tự (nhập a/b đảo vẫn là đã có)');
  Q = ctx.giaDinhQuanHe([ds[1].id, ds[0].id], t6); c = Q.cap[0];
  ok(c.moQH && c.luan.muc.length === 5 && c.luan.muc.every(x => x.ds && x.ds.length) && c.luan.muc[4].ds.length === 3 && c.canCu.length > 0, 'Quan hệ đã mua: đủ 5 mục (tình thương, va chạm, nói chuyện, năm gắn bó, 3 việc nên làm)');
  ok(!/kết hôn|sinh con|cưới|hôn nhân/i.test(JSON.stringify(c.luan)), 'Quan hệ người thân: không có mục kết hôn / sinh con');
  ok(/vợ chồng/i.test(nem(() => ctx.muaPhan(t6, { ids: [ds[0].id, ds[2].id] }, 'quan_he')) || ''), 'Cặp vợ chồng: không bán quan_he (xem ở Cặp đôi)');
  ok(ctx.lapCapDoi(ds[0].input, ds[1].input, t6).biKhoa, 'Mua quan hệ không mở Cặp đôi');
  ctx.giaDinhLuu(ds, chu); ok(ctx.giaDinhQuanHe([ds[0].id, ds[1].id], chu).cap[0].moQH, 'Chủ sở hữu: quan hệ mở sẵn'); }

// --- Mã mời: vẫn lưu nhưng không thưởng ---
const truocGT = ctx.ttSoDu_('nguoimoi1');
const n2 = ctx.dangKy('nguoimoi2', 'matkhau123', 'Bạn Của Người Mới', 'moi2@x.vn', 'nguoimoi1');
ok(n2.qua.xu === 0 && n2.qua.gt === 0 && tkJ('nguoimoi2').gioiThieu === 'nguoimoi1', 'Được mời: lưu mã mời, không tặng khi đăng ký');
ctx.guiMaEmail(n2.token, 'moi2@x.vn'); const v2 = ctx.xacThucEmail(n2.token, maCuoi());
ok(v2.qua.xu === 39 && v2.qua.gt === 0 && ctx.ttSoDu_('nguoimoi1') === truocGT, 'Xác thực email: người được mời nhận 39, người mời không nhận gì (bỏ thưởng mời)');
const n4 = ctx.dangKy('nguoimoi4', 'matkhau123', 'B4', 'moi4@x.vn', 'khong.co.ai');
ok(n4.qua.gt === 0 && !tkJ('nguoimoi4').gioiThieu, 'Mã mời không tồn tại: không lưu');
// 17/11: hộp đăng ký 3 ô – tên đăng nhập tự tạo từ email, đăng nhập bằng email, mỗi email 1 tài khoản
{ const a = ctx.dangKy('', 'matkhau123', 'Lan', 'Lan.Tran+abc@Gmail.com', '');
  ok(a.token && a.nguoiDung && /^lan\.?tran/.test(a.nguoiDung.ten), 'Đăng ký 3 ô: tên đăng nhập tự tạo từ email (' + (a.nguoiDung && a.nguoiDung.ten) + ')');
  const b = ctx.dangKy('', 'matkhau123', 'Lan 2', 'lan.tran.khac@gmail.com', '');
  ok(b.token && b.nguoiDung.ten !== a.nguoiDung.ten, 'Tên tự tạo trùng thì thêm số (' + b.nguoiDung.ten + ')');
  ok(/đã có tài khoản/.test(nem(() => ctx.dangKy('', 'matkhau123', 'X', 'lantran@gmail.com', ''))), 'Mỗi email (đã chuẩn hóa) chỉ mở 1 tài khoản');
  ok(ctx.dangNhap('LAN.TRAN+abc@gmail.com', 'matkhau123').nguoiDung.ten === a.nguoiDung.ten, 'Đăng nhập bằng email được');
  ok(nem(() => ctx.dangNhap('lan.tran+abc@gmail.com', 'sai-mat-khau-1')) !== null, 'Đăng nhập bằng email sai mật khẩu bị từ chối'); }
if (loi) { console.log(loi + ' lỗi'); process.exit(1); } else console.log('✔ Thanh toán: tất cả kiểm tra đạt');
