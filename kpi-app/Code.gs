/**
 * HỆ THỐNG KPI SẢN XUẤT — Code.gs (đăng nhập bằng tài khoản riêng)
 */

var __T0 = Date.now();   // 08/11: đo thời gian chạy mỗi lượt gọi (gắn __ms vào kết quả)
var HAN_PHIEN = 6 * 60 * 60; // phiên hết hạn sau 6 giờ (giới hạn tối đa của CacheService là 21600 giây = 6 giờ)

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')   // 08/11: Index không có mẫu <? ?> -> khỏi biên dịch mỗi lần mở
    .setTitle('Hệ thống KPI sản xuất')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');   // bảo mật 18/10: bỏ ALLOWALL – trang khác không nhúng được (chống lừa bấm)
}

/* ===== TIỆN ÍCH ===== */
/* Cache trong một lần gọi server (biến toàn cục reset mỗi request nên không lo dữ liệu cũ) */
var __SS_CACHE = null;
var __DOC_CACHE = {};
var __HEAD_CACHE = {};
var __KHOA = null;
var TZ_VN = 'Asia/Ho_Chi_Minh';

/* ===== KHÓA GHI (chống 2 người lưu cùng lúc làm đè / xóa nhầm dòng) =====
   Mọi chức năng có GHI vào Sheet gọi khoa_() trước khi đọc dữ liệu cần sửa.
   Khóa tự nhả khi lượt chạy kết thúc. Có khóa rồi thì bỏ bộ nhớ đệm để đọc số liệu mới nhất. */
function khoa_() {
  if (__KHOA) return;
  var l = LockService.getScriptLock();
  if (!l.tryLock(30000)) throw new Error('Hệ thống đang bận vì nhiều người cùng lưu. Đợi vài giây rồi bấm lại.');
  __KHOA = l;
  __DOC_CACHE = {};
  __HEAD_CACHE = {};
}

/* Dòng tiêu đề của một sheet (nhớ trong một lượt gọi — đỡ đọc lại mỗi lần sửa một ô) */
function dauCot_(name) {
  if (__HEAD_CACHE[name]) return __HEAD_CACHE[name];
  var sh = ss_().getSheetByName(name);
  var h = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  __HEAD_CACHE[name] = h;
  return h;
}

/* ===== NGÀY GIỜ THEO GIỜ VIỆT NAM (không phụ thuộc múi giờ cài trong dự án) ===== */
function homNayVN_() { return Utilities.formatDate(new Date(), TZ_VN, 'yyyy-MM-dd'); }
function kyVN_() { return Utilities.formatDate(new Date(), TZ_VN, 'yyyy-MM'); }
function gioVN_() { return Number(Utilities.formatDate(new Date(), TZ_VN, 'H')); }
/* Cộng n ngày (n có thể âm) vào chuỗi 'yyyy-MM-dd' */
function congNgay_(s, n) {
  var p = String(s).split('-');
  return new Date(Date.UTC(Number(p[0]), Number(p[1]) - 1, Number(p[2]) + n)).toISOString().slice(0, 10);
}
/* Thứ của chuỗi 'yyyy-MM-dd' (0 = Chủ nhật) */
function thuCua_(s) {
  var p = String(s).split('-');
  return new Date(Date.UTC(Number(p[0]), Number(p[1]) - 1, Number(p[2]))).getUTCDay();
}
function kyTruoc_(ky) {
  var p = String(ky).split('-'), y = Number(p[0]), m = Number(p[1]) - 1;
  if (m < 1) { m = 12; y--; }
  return y + '-' + ('0' + m).slice(-2);
}

/* ===== KIỂM TRA NGÀY NHẬP VÀO =====
   Trả '' nếu hợp lệ, ngược lại trả câu báo lỗi. soNgayLui: cho nhập lùi tối đa bao nhiêu ngày. */
var NGAY_MO_HE_THONG = '2026-07-01';   // không nhận dữ liệu trước mốc này (chặn nhầm ngày/tháng)
function kiemNgay_(s, soNgayLui) {
  s = String(s == null ? '' : s).trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return 'Ngày "' + s + '" không hợp lệ.';
  if (congNgay_(s, 0) !== s) return 'Ngày ' + s + ' không tồn tại.';
  var dmy = s.split('-').reverse().join('/');
  var hn = homNayVN_();
  if (s > hn) return 'Không nhập cho ngày tương lai (' + dmy + ').';
  if (s < NGAY_MO_HE_THONG) return 'Ngày ' + dmy + ' quá cũ — kiểm tra lại, có thể nhầm ngày với tháng.';
  if (soNgayLui && s < congNgay_(hn, -soNgayLui))
    return 'Ngày ' + dmy + ' đã quá ' + soNgayLui + ' ngày, không nhập bù được nữa. Báo ban điều hành nếu cần.';
  return '';
}

/* ===== NGÀY NGHỈ LỄ / NGÀY XƯỞNG ĐƯỢC NGHỈ =====
   Sheet NgayLe: Ngay | TenLe | MaXuong (để trống = cả nhà máy nghỉ). Tạo bằng hàm TAO_SHEET_NGAY_LE.
   Sheet MienTruDiemDanh (đã có): Ngay | MaXuong | LyDo | NguoiTao — ngày một xưởng được miễn điểm danh.
   Ngày lễ: không trừ "quên điểm danh", không tính vào hạn duyệt / hạn nhập, không nhắc điểm danh. */
var __NGAY_LE = null;
function bangNgayLe_() {
  if (__NGAY_LE) return __NGAY_LE;
  var m = {};
  var them = function(r, ten) {
    var ng = ngayVN_(r.Ngay);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(ng)) return;
    m[ng + '|' + (String(r.MaXuong || '').trim() || '*')] = ten;
  };
  docAnToan_('NgayLe').forEach(function(r) { them(r, String(r.TenLe || 'Nghỉ lễ')); });
  docAnToan_('MienTruDiemDanh').forEach(function(r) { them(r, String(r.LyDo || 'Miễn điểm danh')); });
  leCoDinhNam_().forEach(function(x) { if (!m[x[0] + '|*']) m[x[0] + '|*'] = x[1]; });   // 08/11: ngày lễ cố định của công ty (24/11)
  __NGAY_LE = m;
  return m;
}
function laNgayLe_(ng, maXuong) {
  var m = bangNgayLe_();
  return !!(m[ng + '|*'] || (maXuong && m[ng + '|' + maXuong]));
}
/* Ngày làm việc = không phải Chủ nhật, không phải ngày lễ chung (và ngày nghỉ riêng của xưởng nếu truyền maXuong) */
function laNgayLamViec_(ng, maXuong) { return thuCua_(ng) !== 0 && !laNgayLe_(ng, maXuong); }
/* Ép chuỗi số về Number, chấp nhận dấu phẩy thập phân kiểu VN ('12,5' -> 12.5).
   Nếu có cả '.' và ',' thì coi '.' là dấu nghìn; nếu chỉ có ',' thì coi là dấu thập phân. */
function soVN_(v){
  if (v == null || v === '') return 0;
  if (typeof v === 'number') return v;
  var s = String(v).trim();
  if (s.indexOf(',') >= 0) {
    if (s.indexOf('.') >= 0) s = s.replace(/\./g, '');   // '1.234,5' -> '1234,5'
    s = s.replace(',', '.');                              // ',' thập phân -> '.'
  }
  var n = Number(s);
  return isFinite(n) ? n : 0;
}
function ss_() {
  if (!__SS_CACHE) __SS_CACHE = SpreadsheetApp.getActiveSpreadsheet();
  return __SS_CACHE;
}

function doc_(name) {
  if (__CHO_GHI[name]) xaGhi_(name);                 // còn ô chờ ghi của sheet này -> ghi trước rồi mới đọc
  if (__DOC_CACHE.hasOwnProperty(name)) return __DOC_CACHE[name];
  var pbNK = (name === NKD_TEN && nkdDung_()) ? nkdPB_() : '';   // 08/11: nhật ký dùng chung giữa các lượt gọi
  if (pbNK) { var vNK = nkdLay_(pbNK); if (vNK) { __NKD_TT.trung++; return (__DOC_CACHE[name] = bangThanhDoiTuong_(vNK)); } __NKD_TT.truot++; }
  var sh = ss_().getSheetByName(name);
  if (!sh) { __DOC_CACHE[name] = []; return []; }
  var v = sh.getDataRange().getValues();
  if (pbNK) nkdGhi_(pbNK, v);
  if (v.length < 2) { __DOC_CACHE[name] = []; return []; }
  var head = v[0], out = [];
  for (var i = 1; i < v.length; i++) {
    if (v[i].join('') === '') continue;
    var o = { _row: i + 1 };
    for (var j = 0; j < head.length; j++) o[head[j]] = v[i][j];
    out.push(o);
  }
  __DOC_CACHE[name] = out;
  return out;
}

/* Xóa cache một sheet (gọi sau khi ghi/sửa để lần đọc kế tiếp lấy dữ liệu mới) */
function xoaCache_(name) {
  if (!name || name === NKD_TEN) nkdBo_();            // 08/11: bỏ bản nhật ký dùng chung
  __DA_GHI[name || '*'] = 1;                          // sheet đã đổi -> báo giao diện tải lại đúng phần
  if (name) delete __DOC_CACHE[name]; else __DOC_CACHE = {};
}

function them_(name, obj) {
  var sh = ss_().getSheetByName(name);
  var head = dauCot_(name);
  sh.appendRow(head.map(function(h) { return obj[h] !== undefined ? chuAnToan_(obj[h]) : ''; }));
  xoaCache_(name);
}

function themNhieu_(name, arr) {
  if (!arr.length) return;
  var sh = ss_().getSheetByName(name);
  var head = dauCot_(name);
  var rows = arr.map(function(o) {
    return head.map(function(h) { return o[h] !== undefined ? chuAnToan_(o[h]) : ''; });
  });
  sh.getRange(sh.getLastRow() + 1, 1, rows.length, head.length).setValues(rows);
  xoaCache_(name);
}

/* Sửa một ô: KHÔNG ghi ngay mà đưa vào bộ đệm; cuối lượt gọi (sach_ -> xong_) ghi một lần theo khối. */
function suaO_(name, row, col, val) {
  if (name === 'DinhMuc' && col === 'DinhMucGio') luuLichSuDM_(row, val);
  var head = dauCot_(name);
  var i = head.indexOf(col);
  if (i < 0) return;
  var m = __CHO_GHI[name] || (__CHO_GHI[name] = {});
  (m[row] = m[row] || {})[i + 1] = chuAnToan_(val);
  xoaCache_(name);
}

/* Ghi ô ở dạng VĂN BẢN — giữ nguyên số 0 đầu (điện thoại, CCCD). */
function suaOText_(name, row, col, val) {
  xaGhi_(name);
  var sh = ss_().getSheetByName(name);
  var head = dauCot_(name);
  var i = head.indexOf(col);
  if (i >= 0) {
    var o = sh.getRange(row, i + 1);
    o.setNumberFormat('@');            // định dạng văn bản
    o.setValue(chuAnToan_(String(val == null ? '' : val)));
  }
  xoaCache_(name);
}

function xoaDong_(name, row) {
  xaGhi_(name);                                       // ghi hết trước khi xóa dòng (xóa làm lệch số dòng)
  var sh = ss_().getSheetByName(name);
  if (sh && row >= 2) sh.deleteRow(row);
  xoaCache_(name);
}

/* Xóa nhiều dòng một lượt (từ dưới lên, gom các dòng liền nhau). rows = số dòng trong sheet. */
function xoaNhieuDong_(name, rows) {
  xaGhi_(name);
  var sh = ss_().getSheetByName(name);
  if (!sh || !rows || !rows.length) return 0;
  var da = {}, ds = [];
  rows.forEach(function(r) { r = Number(r); if (r >= 2 && !da[r]) { da[r] = 1; ds.push(r); } });
  ds.sort(function(a, b) { return b - a; });
  var n = 0, i = 0;
  while (i < ds.length) {
    var cuoi = ds[i], dau = cuoi;
    while (i + 1 < ds.length && ds[i + 1] === dau - 1) { i++; dau = ds[i]; }
    sh.deleteRows(dau, cuoi - dau + 1);
    n += cuoi - dau + 1;
    i++;
  }
  xoaCache_(name);
  return n;
}

/* Đọc N dòng cuối của một sheet (khỏi đọc cả sheet lớn như NhatKyThaoTac) */
function docCuoi_(name, n) {
  var sh = ss_().getSheetByName(name);
  if (!sh) return [];
  var last = sh.getLastRow();
  if (last < 2) return [];
  var head = dauCot_(name);
  var tu = Math.max(2, last - n + 1);
  return sh.getRange(tu, 1, last - tu + 1, head.length).getValues().map(function(row, i) {
    var o = { _row: tu + i };
    head.forEach(function(h, j) { o[h] = row[j]; });
    return o;
  });
}

function ma_(p) { return p + Utilities.getUuid().replace(/-/g, '').slice(0, 8).toUpperCase(); }

/* Làm sạch dữ liệu trước khi gửi về trình duyệt.
   Apps Script không tuần tự hóa được Date, hàm, hoặc giá trị lạ —
   gặp phải sẽ ném lỗi "Uncaught Ys" và yêu cầu chết giữa chừng.
   Hàm này chuyển mọi thứ về chuỗi hoặc số. */
function sach_(v) {
  xong_();                                            // cuối lượt: ghi bộ đệm, tăng phiên bản dữ liệu nếu có ghi
  ganPhanDoi_(v);                                     // báo giao diện phần dữ liệu nào vừa đổi
  var r = sachLoi_(v);
  if (r && typeof r === 'object' && Object.prototype.toString.call(r) !== '[object Array]' && 'ok' in r) r.__ms = Date.now() - __T0;   // 08/11 bộ đo
  return r;
}
function sachLoi_(v) {
  if (v === null || v === undefined) return '';
  var t = typeof v;
  if (t === 'number') return isFinite(v) ? v : 0;
  if (t === 'boolean') return v;
  if (t === 'string') return v;
  if (Object.prototype.toString.call(v) === '[object Date]') {
    return isNaN(v.getTime()) ? '' : Utilities.formatDate(v, 'GMT+7', 'yyyy-MM-dd HH:mm:ss');
  }
  if (Object.prototype.toString.call(v) === '[object Array]') {
    return v.map(function(x) { return sachLoi_(x); });
  }
  if (t === 'object') {
    var o = {};
    for (var k in v) {
      if (!Object.prototype.hasOwnProperty.call(v, k)) continue;
      if (k === '_row') continue;
      o[k] = sachLoi_(v[k]);
    }
    return o;
  }
  return String(v);
}

function ngayVN_(d) {
  if (!d) return '';
  if (typeof d === 'string') return d.slice(0, 10);
  return Utilities.formatDate(new Date(d), 'GMT+7', 'yyyy-MM-dd');
}

function tenXuong_(m) {
  var p = doc_('PhongBan').filter(function(x) { return x.MaXuong === m; })[0];
  return p ? p.TenXuong : m;
}

/* ===== HÀM CHỈ CHẠY NỘI BỘ (bảo mật 18/10) =====
   Trình duyệt gọi được mọi hàm toàn cục không có '_' cuối, kể cả khách chưa đăng nhập. Hàm chạy tay (viết hoa) và hàm
   trigger kiểm tra noiBo_ trước: trigger thật (mã trigger có trong dự án) hoặc người chạy chính là chủ dự án
   (trình soạn thảo Apps Script). Khách mở web: Session.getActiveUser() trả rỗng -> bị chặn. */
function noiBo_(e) {
  try {
    if (e && e.triggerUid) {
      var id = String(e.triggerUid);
      if (ScriptApp.getProjectTriggers().some(function(t) { return String(t.getUniqueId()) === id; })) return true;
    }
  } catch (x) {}
  try {
    var a = String(Session.getActiveUser().getEmail() || ''), b = String(Session.getEffectiveUser().getEmail() || '');
    return !!a && a.toLowerCase() === b.toLowerCase();
  } catch (x) {}
  return false;
}
function chanWeb_(ten) {
  try { Logger.log('Đã chặn ' + ten + ': chỉ chạy được trong trình soạn thảo Apps Script (tài khoản chủ dự án) hoặc bằng trigger.'); } catch (x) {}
  return { ok: false, msg: 'Chức năng này chỉ chạy trong trình soạn thảo Apps Script.' };
}

/* ===== CHẶN CÔNG THỨC KHI GHI VÀO SHEET (bảo mật 18/10) =====
   Chữ người dùng nhập bắt đầu bằng = + - @ sẽ bị Google Sheets hiểu là công thức (đọc được ô của sheet khác).
   Thêm dấu ' phía trước: Sheets giữ nguyên chữ, dấu ' bị ẩn. Số (kể cả '-5') giữ nguyên. */
function chuAnToan_(v) {
  if (typeof v !== 'string' || v.length < 2) return v;
  if (!/^[=+\-@\t\r]/.test(v) || /^[+-]?\d+(\.\d+)?$/.test(v)) return v;
  return "'" + v;
}
function dongAnToan_(row) { return row.map(chuAnToan_); }

/* ===== MÃ HÓA MẬT KHẨU ===== */
var MUOI = 'KPI@SanXuat#2026$Muoi';

/* Bảo mật 18/10: mật khẩu mới lưu dạng 'v2$<muối riêng>$<HMAC-SHA256 lặp MK_VONG lần>'.
   Dạng cũ (SHA-256 một vòng, muối chung) vẫn đăng nhập được và tự đổi sang dạng mới ngay khi đăng nhập đúng. */
var MK_VONG = 400, MK_HAN_TAM_GIO = 48;
/* ===== AI XEM ĐƯỢC GÌ (bảo mật 18/10) =====
   Cả nhà máy: ban điều hành (ADMIN/OWNER), trợ lý (TL), nhân sự (HR). Trưởng/phó phòng: xưởng mình.
   Công nhân: bản ghi của mình (+ ký hiệu chấm công của người cùng xưởng, KHÔNG có lý do nghỉ). Vai trò khác: chỉ số đếm. */
function xemCaNhaMay_(me) { return !!me && ['ADMIN', 'TL', 'HR'].indexOf(me.vaiTro) >= 0; }
/* Bản ghi chấm công của người khác: giữ ký hiệu (để tính giờ có mặt / KPI), bỏ lý do nghỉ và người ghi */
function cheNghi_(r) {
  return { MaDD: r.MaDD, Ngay: r.Ngay, MaNV: r.MaNV, MaXuong: r.MaXuong, KyHieu: khTuBanGhi_(r), Cong: r.Cong, LyDo: '' };
}
function locNapTheoVaiTro_(me, out) {
  if (xemCaNhaMay_(me)) return out;
  var cuaToi = function(r) { return !!me.maNV && String(r.MaNV) === String(me.maNV); };
  var xuongToi = function(r) { return !!me.xuong && String(r.MaXuong) === String(me.xuong); };
  if (out.chamcong) out.chamcong = out.chamcong
    .filter(function(r) { return me.vaiTro !== 'CN' || xuongToi(r) || cuaToi(r); })
    .map(function(r) { return (cuaToi(r) || (me.vaiTro === 'TP' && xuongToi(r))) ? r : cheNghi_(r); });
  if (out.nghiDaiHan) out.nghiDaiHan = out.nghiDaiHan.filter(function(r) { return cuaToi(r) || (me.vaiTro === 'TP' && xuongToi(r)); });
  if (me.vaiTro === 'CN') {
    var cdX = {};
    doc_('CongDoan').forEach(function(c) { if (c.MaXuong === me.xuong) cdX[c.MaCD] = 1; });
    if (out.maymoc) out.maymoc = out.maymoc.filter(xuongToi);
    if (out.dexuat) out.dexuat = [];
    if (out.kcs) out.kcs = out.kcs.filter(function(k) { return cdX[k.MaCD] || cuaToi(k); });
  }
  if (me.vaiTro === 'QC' && out.vipham) out.vipham = [];
  return out;
}

function hex_(b) { return b.map(function(x) { return ('0' + (x & 0xFF).toString(16)).slice(-2); }).join(''); }
function bam2_(mk, muoi) {
  var k = Utilities.newBlob('KPI|' + muoi + '|' + MUOI).getBytes();
  var h = Utilities.computeHmacSha256Signature(Utilities.newBlob(String(mk)).getBytes(), k);
  for (var i = 1; i < MK_VONG; i++) h = Utilities.computeHmacSha256Signature(h, k);
  return hex_(h);
}
function taoBam_(mk) {
  var muoi = Utilities.getUuid().replace(/-/g, '').slice(0, 16).toLowerCase();
  return 'v2$' + muoi + '$' + bam2_(mk, muoi);
}
function laBamCu_(luu) { return chuan_(luu).indexOf('v2$') !== 0; }
function kiemMK_(luu, mk) {
  var s = chuan_(luu);
  if (s.indexOf('v2$') === 0) { var p = s.split('$'); return p.length === 3 && bam2_(mk, p[1]) === p[2]; }
  return !!s && s === bam_(mk);
}
/* Mật khẩu tạm ngẫu nhiên 8 ký tự (bỏ chữ dễ nhầm 0/o, 1/l/i) */
function mkTam_() {
  var bo = 'abcdefghjkmnpqrstuvwxyz23456789', hx = Utilities.getUuid().replace(/-/g, ''), out = '';
  for (var i = 0; out.length < 8; i += 2) out += bo.charAt(parseInt(hx.substr(i, 2), 16) % bo.length);
  return out;
}
/* Bảo đảm sheet TaiKhoan có cột `ten` (thêm vào cuối nếu thiếu) */
function cotTK_(ten) {
  var sh = ss_().getSheetByName('TaiKhoan');
  if (!sh) return;
  var head = sh.getRange(1, 1, 1, Math.max(1, sh.getLastColumn())).getValues()[0];
  if (head.indexOf(ten) < 0) {
    sh.getRange(1, head.length + 1).setValue(ten).setFontWeight('bold');
    delete __HEAD_CACHE['TaiKhoan']; delete __DOC_CACHE['TaiKhoan'];
  }
}
/* Đặt mật khẩu tạm cho 1 dòng TaiKhoan: phải đổi khi đăng nhập, hết hạn sau MK_HAN_TAM_GIO giờ */
function datMKTam_(row, mk) {
  cotTK_('HanMatKhauTam');
  ghiBam_(row, taoBam_(mk));
  suaO_('TaiKhoan', row, 'DoiMatKhauLanDau', 'Có');
  suaO_('TaiKhoan', row, 'HanMatKhauTam', new Date(new Date().getTime() + MK_HAN_TAM_GIO * 3600e3));
}
function hanMKTamQua_(tk) {
  if (String(tk.DoiMatKhauLanDau).trim() !== 'Có' || !tk.HanMatKhauTam) return false;
  var t = new Date(tk.HanMatKhauTam).getTime();
  return !isNaN(t) && new Date().getTime() > t;
}
/* Phiên bản phiên: tăng khi đổi / cấp lại mật khẩu -> mọi phiên cũ của tài khoản đó hết hiệu lực */
function tangPhienBan_(tk) {
  cotTK_('PhienBan');
  var pb = (Number(tk.PhienBan) || 0) + 1;
  suaO_('TaiKhoan', tk._row, 'PhienBan', pb);
  return pb;
}
function ghiPhien_(token, o) {
  var con = Math.floor(((o.hanDen || 0) - new Date().getTime()) / 1000);
  if (con < 1) return;
  var s = JSON.stringify(o);
  try { CacheService.getScriptCache().put('P_' + token, s, Math.min(con, 21600)); } catch (e) {}
  try { PropertiesService.getScriptProperties().setProperty('P_' + token, s); } catch (e) {}
}

function bam_(mk) {
  var b = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256, MUOI + String(mk), Utilities.Charset.UTF_8);
  return b.map(function(x) { return ('0' + (x & 0xFF).toString(16)).slice(-2); }).join('');
}

/* Chuẩn hóa chuỗi băm đọc từ Sheet: bỏ dấu nháy dẫn, khoảng trắng, đưa về chữ thường.
   Google Sheets có thể tự thêm ký tự hoặc đổi kiểu dữ liệu, nên phải làm sạch trước khi so sánh. */
function chuan_(s) {
  return String(s == null ? '' : s).replace(/^'/, '').trim().toLowerCase();
}

/* Ghi chuỗi băm vào Sheet dưới dạng văn bản thuần, tránh Sheets diễn giải thành số */
function ghiBam_(row, hash) {
  var sh = ss_().getSheetByName('TaiKhoan');
  var head = dauCot_('TaiKhoan');
  var c = head.indexOf('MatKhauMaHoa') + 1;
  sh.getRange(row, c).setNumberFormat('@').setValue(hash);
}

/* ===== PHIÊN ĐĂNG NHẬP ===== */
function taoPhien_(tk) {
  var token = Utilities.getUuid();
  var ttl = Math.min(HAN_PHIEN, 21600); // CacheService không cho quá 21600 giây (6 giờ)
  var dulieu = JSON.stringify({
    tk: tk.TenDangNhap, ten: tk.HoTen, vaiTro: tk.VaiTro, xuong: tk.MaXuong || '',
    maNV: tk.MaNV || '', hanDen: (new Date().getTime() + ttl * 1000), pb: Number(tk.PhienBan) || 0
  });
  // Lưu vào CacheService (nhanh) — nếu lỗi vẫn tiếp tục
  try { CacheService.getScriptCache().put('P_' + token, dulieu, ttl); } catch (e) {}
  // Lưu dự phòng vào PropertiesService (bền, không phụ thuộc cache)
  try { PropertiesService.getScriptProperties().setProperty('P_' + token, dulieu); } catch (e) {}
  return token;
}

/* Đọc phiên từ cache; nếu không có thì đọc từ PropertiesService (dự phòng) */
function docChuoiPhien_(token) {
  var s = null;
  try { s = CacheService.getScriptCache().get('P_' + token); } catch (e) {}
  if (s) return s;
  try {
    s = PropertiesService.getScriptProperties().getProperty('P_' + token);
    if (s) {
      var o = JSON.parse(s);
      if (o.hanDen && new Date().getTime() > o.hanDen) {   // đã quá hạn -> dọn
        try { PropertiesService.getScriptProperties().deleteProperty('P_' + token); } catch (e) {}
        return null;
      }
      // Nạp lại vào cache cho lần sau nhanh hơn (chỉ trong thời gian phiên còn hạn)
      var con = Math.floor(((o.hanDen || 0) - new Date().getTime()) / 1000);
      if (con > 0) try { CacheService.getScriptCache().put('P_' + token, s, Math.min(con, 21600)); } catch (e) {}
      return s;
    }
  } catch (e) {}
  return null;
}

/* choPhepChuaDoiMK = true: vẫn trả phiên khi người dùng chưa đổi mật khẩu lần đầu
   (chỉ dùng cho napDuLieu và doiMatKhau). Các chức năng khác bị chặn cho tới khi đổi xong. */
function docPhien_(token, choPhepChuaDoiMK) {
  if (!token) return null;
  var s = docChuoiPhien_(token);
  if (!s) return null;
  var o = JSON.parse(s);

  // Kiểm tra lại quyền trong Sheet — phòng trường hợp bị ngừng quyền giữa phiên
  var tk = doc_('TaiKhoan').filter(function(x) {
    return String(x.TenDangNhap).toLowerCase() === String(o.tk).toLowerCase();
  })[0];
  if (!tk || String(tk.TrangThai).trim() !== 'Đang dùng') return null;
  if ((Number(tk.PhienBan) || 0) !== (Number(o.pb) || 0)) return null;   // đã đổi / cấp lại mật khẩu sau khi đăng nhập
  if (o.hanDen && new Date().getTime() > o.hanDen) return null;
  if (tk.MaNV && nvDaNghi_(tk.MaNV)) return null;          // hồ sơ đã chuyển Nghỉ việc
  o.phaiDoiMK = String(tk.DoiMatKhauLanDau).trim() === 'Có';
  if (o.phaiDoiMK && !choPhepChuaDoiMK) return null;
  // Lấy vai trò / xưởng MỚI NHẤT trong Sheet (đổi vai trò có hiệu lực ngay, không đợi đăng nhập lại)
  o.tk = tk.TenDangNhap; o.ten = tk.HoTen;
  o.vaiTro = String(tk.VaiTro).trim(); o.xuong = tk.MaXuong || '';

  o.tenXuong = o.xuong ? tenXuong_(o.xuong) : '';
  o.maNV = tk.MaNV || o.maNV || '';
  o.token = token;
  o.pb = Number(tk.PhienBan) || 0;
  // Phó phòng (PP) có quyền tương đương trưởng phòng (TP).
  // Giữ vai trò gốc để hiển thị đúng danh xưng, nhưng xử lý quyền như TP.
  o.vaiTroGoc = o.vaiTro;
  if (o.vaiTro === 'PP') o.vaiTro = 'TP';
  // OWNER = chu so huu: co moi quyen ADMIN, cong them co laOwner cho cac chuc nang doc quyen.
  o.laOwner = (o.vaiTroGoc === 'OWNER');
  if (o.vaiTro === 'OWNER') o.vaiTro = 'ADMIN';
  o.cg = cgQuyenCua_(o);   // 08/11: Cấu hình gậy (tài liệu mật – 4 mã NV)
  return o;
}

/* Nhân viên có hồ sơ ở trạng thái Nghỉ việc? */
function nvDaNghi_(maNV) {
  var nv = doc_('NhanSu').filter(function(x) { return String(x.MaNV).trim() === String(maNV).trim(); })[0];
  return !!nv && String(nv.TrangThai).trim() === 'Nghỉ việc';
}

/* Chặn dò mật khẩu: sai 5 lần liền thì khóa tên đăng nhập đó 15 phút. */
var SO_LAN_SAI_TOI_DA = 5, PHUT_KHOA_DANG_NHAP = 15;

function dangNhap(tenDN, matKhau) {
  try {
    if (!tenDN || !matKhau) return sach_({ ok: false, msg: 'Nhập đủ tên đăng nhập và mật khẩu.' });
    var ten = String(tenDN).toLowerCase().trim();

    var cache = CacheService.getScriptCache();
    var khoaKey = 'SAI_' + ten;
    var soSai = 0, khoaDen = 0, bayGio = new Date().getTime();
    try { var ks = String(cache.get(khoaKey) || '0').split('|'); soSai = Number(ks[0]) || 0; khoaDen = Number(ks[1]) || 0; } catch (e) {}
    if (khoaDen > bayGio)
      return sach_({ ok: false, msg: 'Nhập sai nhiều lần. Đợi ' + Math.ceil((khoaDen - bayGio) / 60000) +
        ' phút rồi thử lại, hoặc nhờ người quản lý cấp lại mật khẩu.' });
    var baoSai = function() {
      var n = soSai + 1, den = n >= SO_LAN_SAI_TOI_DA ? bayGio + Math.min(PHUT_KHOA_DANG_NHAP, Math.pow(2, n - SO_LAN_SAI_TOI_DA)) * 60000 : 0;
      try { cache.put(khoaKey, n + '|' + den, 6 * 3600); } catch (e) {}
      var con = SO_LAN_SAI_TOI_DA - soSai - 1;
      return sach_({ ok: false, msg: 'Sai tên đăng nhập hoặc mật khẩu.' + (con > 0 && con <= 2 ? ' Còn ' + con + ' lần thử.' : '') });
    };

    var sh = ss_().getSheetByName('TaiKhoan');
    if (!sh) return sach_({ ok: false, msg: 'Chưa có trang tính TaiKhoan. Cần chạy KHOI_TAO_HE_THONG.' });

    var ds = doc_('TaiKhoan');
    if (!ds.length) return sach_({ ok: false, msg: 'Trang tính TaiKhoan chưa có tài khoản nào.' });

    var tk = ds.filter(function(x) {
      return String(x.TenDangNhap).toLowerCase().trim() === ten;
    })[0];

    if (!tk) return baoSai();
    if (!kiemMK_(tk.MatKhauMaHoa, matKhau)) return baoSai();
    if (String(tk.TrangThai).trim() !== 'Đang dùng') return sach_({ ok: false, msg: 'Tài khoản đã bị ngừng sử dụng.' });
    if (hanMKTamQua_(tk))
      return sach_({ ok: false, msg: 'Mật khẩu tạm đã hết hạn (quá ' + MK_HAN_TAM_GIO + ' giờ). Nhờ người quản lý cấp lại mật khẩu.' });
    if (laBamCu_(tk.MatKhauMaHoa)) { try { ghiBam_(tk._row, taoBam_(matKhau)); } catch (e) {} }   // đổi sang cách mã hóa mới
    if (tk.MaNV && nvDaNghi_(tk.MaNV))
      return sach_({ ok: false, msg: 'Hồ sơ nhân viên đã chuyển "Nghỉ việc" — tài khoản không còn dùng được.' });
    try { cache.remove(khoaKey); } catch (e) {}

    var token = taoPhien_(tk);

    // Ghi nhật ký ở cuối, và không để lỗi ghi làm hỏng việc đăng nhập
    try {
      suaO_('TaiKhoan', tk._row, 'LanDangNhapCuoi', new Date());
      them_('NhatKyThaoTac', {
        ThoiDiem: new Date(), TenDangNhap: tk.TenDangNhap, HoTen: tk.HoTen,
        HanhDong: 'Đăng nhập', ChiTiet: '', GiaTriCu: '', GiaTriMoi: ''
      });
    } catch (e) {}

    return sach_({
      ok: true, token: token,
      me: { tk: tk.TenDangNhap, ten: tk.HoTen,
            vaiTro: (tk.VaiTro === 'PP') ? 'TP' : (tk.VaiTro === 'OWNER' ? 'ADMIN' : tk.VaiTro),
            vaiTroGoc: tk.VaiTro, laOwner: (tk.VaiTro === 'OWNER'),
            xuong: tk.MaXuong || '', tenXuong: tk.MaXuong ? tenXuong_(tk.MaXuong) : '',
            maNV: tk.MaNV || '',
            phaiDoiMK: String(tk.DoiMatKhauLanDau).trim() === 'Có' }
    });
  } catch (e) {
    try { Logger.log('dangNhap lỗi: ' + (e && e.stack || e)); } catch (x) {}
    return sach_({ ok: false, msg: 'Máy chủ đang bận, chưa đăng nhập được. Thử lại sau ít phút.' });
  }
}

function dangXuat(token) {
  if (token) { try { var meX = docPhien_(token); if (meX) boKhoaLuu_(meX.tk); } catch (e) {}
    try { CacheService.getScriptCache().remove('P_' + token); } catch (e) {}
    try { PropertiesService.getScriptProperties().deleteProperty('P_' + token); } catch (e) {}
  }
  return { ok: true };
}

/* Mật khẩu quá dễ đoán — không cho đặt */
var MK_YEU_ = ['123456', '1234567', '12345678', '123456789', '1234567890', '111111', '000000', '888888',
  '666666', '123123', '654321', 'abc123', 'abcdef', 'password', 'matkhau', 'qwerty'];

function doiMatKhau(token, cu, moi) {
  var me = docPhien_(token, true);
  if (!me) return sach_({ ok: false, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (!moi || String(moi).length < 6) return sach_({ ok: false, msg: 'Mật khẩu mới phải từ 6 ký tự trở lên.' });
  var moiThuong = String(moi).toLowerCase();
  if (MK_YEU_.indexOf(moiThuong) >= 0 || /^(.)\1+$/.test(moiThuong))
    return sach_({ ok: false, msg: 'Mật khẩu này quá dễ đoán. Chọn mật khẩu khác (nên có cả chữ và số).' });
  if (moiThuong === String(me.tk).toLowerCase() || moiThuong === String(me.maNV || '').toLowerCase())
    return sach_({ ok: false, msg: 'Không dùng tên đăng nhập / mã nhân viên làm mật khẩu.' });

  var tk = doc_('TaiKhoan').filter(function(x) {
    return String(x.TenDangNhap).toLowerCase() === String(me.tk).toLowerCase();
  })[0];
  if (!tk) return sach_({ ok: false, msg: 'Không tìm thấy tài khoản.' });
  if (!kiemMK_(tk.MatKhauMaHoa, cu)) return sach_({ ok: false, msg: 'Mật khẩu hiện tại không đúng.' });
  if (String(moi) === String(cu)) return sach_({ ok: false, msg: 'Mật khẩu mới phải khác mật khẩu cũ.' });
  if (String(moi).length > 100) return sach_({ ok: false, msg: 'Mật khẩu quá dài.' });

  ghiBam_(tk._row, taoBam_(moi)); boKhoaLuu_(tk.TenDangNhap);   // 08/11: đổi mật khẩu -> bỏ khóa bản lưu trên máy
  suaO_('TaiKhoan', tk._row, 'DoiMatKhauLanDau', 'Không');
  if (tk.HanMatKhauTam) suaO_('TaiKhoan', tk._row, 'HanMatKhauTam', '');
  var pbMoi = tangPhienBan_(tk);
  try { var ph = JSON.parse(docChuoiPhien_(token)); ph.pb = pbMoi; ghiPhien_(token, ph); } catch (e) {}
  ghiLog_(me, 'Đổi mật khẩu', '', '', '');
  return sach_({ ok: true, msg: 'Đã đổi mật khẩu.' });
}

function ghiLog_(me, hd, ct, cu, moi) {
  them_('NhatKyThaoTac', {
    ThoiDiem: new Date(), TenDangNhap: me.tk, HoTen: me.ten,
    HanhDong: hd, ChiTiet: ct || '', GiaTriCu: cu || '', GiaTriMoi: moi || ''
  });
}

/* ===== NẠP DỮ LIỆU ===== */
function napDuLieu(token) { return goiNap_(napDuLieuLoi_(token, null)); }

/* Các "phần" dữ liệu gửi về trình duyệt. Sau khi lưu, giao diện chỉ xin lại phần bị ảnh hưởng. */
var PHAN_NAP_ = { nk: 1, cc: 1, ns: 1, cd: 1, mm: 1, vp: 1, ts: 1, tb: 1, dm: 1 };
var COT_NK_GUI_ = ['MaDong', 'Ngay', 'MaNV', 'MaCD', 'MaMay', 'GioLam', 'SoLuongLamRa', 'GioDung', 'LyDoDung', 'GhiChu', 'TrangThai'];
function chonCot_(r, cot) { var o = {}; cot.forEach(function(k) { o[k] = r[k]; }); return o; }

function napDuLieuLoi_(token, phan) {
  try {
  if (!phan) { try { napTruoc_(SHEET_NAP_); } catch (e0) {} }   // 08/11 đợt 4: đọc gộp trước cả bước đọc phiên
  var me = docPhien_(token, true);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn. Đăng nhập lại.' });
  if (me.phaiDoiMK) return sach_({ ok: false, phaiDoiMK: true, me: me, msg: 'Cần đổi mật khẩu lần đầu trước khi dùng hệ thống.' });
  me.banMay = KPI_BAN_MAY;
  if (me.laOwner) { try { tt4CaiLich_(); } catch (e) {} try { ldCaiLich_(); } catch (e) {} }   // + lịch dọn dẹp hằng tháng   // 08/11 đợt 4: tự cài lịch giữ nóng đăng nhập
  try { me.hoSoThieu = hsVaiTroPhai_(me.vaiTroGoc || me.vaiTro) ? hoSoThieu_(hsCuaToi_(me)) : []; } catch (e) { me.hoSoThieu = []; }   // hồ sơ bắt buộc (22/10) – mọi nhánh, kể cả bếp / nhóm báo cơm
  if (me.vaiTro === 'BEP' || me.vaiTro === 'NHOM' || me.vaiTro === 'NV' || me.vaiTro === 'TBP') {
    var rong = { ok: true, me: me, phan: phan || 'tat', phongban: doc_('PhongBan').map(function(p) { return { MaXuong: p.MaXuong, TenXuong: p.TenXuong }; }) };
    ['nhatky','choDuyet','nhansu','congdoan','dinhmuc','chamcong','maymoc','kcs','loi','vipham','dexuat','trongso','log','thongBao','ngayLe','lydo','nghiDaiHan','dmvp','xacNhanDD','yeuCauHoSo','yeuCauHoSoCuaToi','canNhapLai'].forEach(function(k) { rong[k] = []; });
    return sach_(rong);
  }
  var can = function(p) { return !phan || phan.indexOf(p) >= 0; };
  napTruoc_(SHEET_NAP_);                              // đọc gộp 1 lần (nếu đã bật Sheets API)

  var loc = function(arr, key) {
    if (me.vaiTro !== 'TP') return arr;
    return arr.filter(function(x) { return x[key] === me.xuong; });
  };
  var tuNgay = mocGuiVe_();
  var sauMoc = function(arr) {
    return tuNgay ? arr.filter(function(r) { return ngayVN_(r.Ngay) >= tuNgay; }) : arr;
  };
  var out = { ok: true, me: me, phan: phan || 'tat' };
  var congdoan = doc_('CongDoan').filter(function(x) { return x.TrangThai !== 'Ngừng'; });

  if (can('nk')) {
    var nhatkyTat = doc_('NhatKySanXuat');
    var kcs = doc_('PhieuKCS');
    if (me.vaiTro === 'TP') {
      var mine = {};
      doc_('CongDoan').forEach(function(c) { if (c.MaXuong === me.xuong) mine[c.MaCD] = 1; });   // kể cả công đoạn đã Ngừng (21/10)
      nhatkyTat = nhatkyTat.filter(function(r) { return mine[r.MaCD]; });
    }
    if (me.vaiTro === 'CN') {
      // Công nhân: xem nhật ký ĐÃ CHỐT của cả xưởng (bảng xếp hạng), phần CHỜ DUYỆT chỉ của mình.
      var cdX = {};
      doc_('CongDoan').forEach(function(c) { if (c.MaXuong === me.xuong) cdX[c.MaCD] = 1; });
      nhatkyTat = nhatkyTat.filter(function(r) {
        return String(r.TrangThai).trim() !== 'Chờ duyệt' ? !!cdX[r.MaCD] : r.MaNV === me.maNV;
      });
    }
    // Chỉ gửi các cột giao diện dùng; chỉ gửi từ đầu tháng trước (dòng Chờ duyệt thì gửi hết)
    var nk = [], cho = [];
    nhatkyTat.forEach(function(r) {
      var tt = String(r.TrangThai).trim(), ng = ngayVN_(r.Ngay);
      if (tt === 'Chờ duyệt') { var a = chonCot_(r, COT_NK_GUI_); a.Ngay = ng; cho.push(a); return; }
      if (tt !== 'Đã chốt' || (tuNgay && ng < tuNgay)) return;
      var b = chonCot_(r, COT_NK_GUI_); b.Ngay = ng; nk.push(b);
    });
    out.nhatky = nk; out.choDuyet = cho;
    out.kcs = kcs.map(function(r) { var o = chonCot_(r, ['MaPhieu', 'Ngay', 'MaNV', 'MaCD', 'SoLuongKhongDat', 'MaLoi']); o.Ngay = ngayVN_(r.Ngay); return o; })
      .filter(function(r) { return !tuNgay || r.Ngay >= tuNgay; });
    out.canNhapLai = (me.vaiTro === 'CN' ? (function() {
      var cuaToi = doc_('NhatKySanXuat').filter(function(r) { return r.MaNV === me.maNV; }), daGuiLai = {};
      cuaToi.forEach(function(r) { var tt = String(r.TrangThai).trim(); if (tt === 'Chờ duyệt' || tt === 'Đã chốt') daGuiLai[ngayVN_(r.Ngay)] = 1; });
      return cuaToi.filter(function(r) { return String(r.TrangThai).trim() === 'Từ chối' && !daGuiLai[ngayVN_(r.Ngay)]; })   // đã gửi lại thì thôi nhắc (21/10)
        .map(function(r) { return { Ngay: ngayVN_(r.Ngay), MaCD: r.MaCD, LyDo: r.LyDoTuChoi || r.GhiChu || '' }; });
    })() : []);
  }
  if (can('cc')) {
    out.chamcong = sauMoc(ss_().getSheetByName('DiemDanhNghi') ? doc_('DiemDanhNghi') : []);
    out.xacNhanDD = sauMoc(ss_().getSheetByName('XacNhanDiemDanh') ? docAnToan_('XacNhanDiemDanh') : []);
    out.ngayLe = Object.keys(bangNgayLe_());
    out.nghiDaiHan = (ss_().getSheetByName('NghiDaiHan') ? docAnToan_('NghiDaiHan') : []);
  }
  if (can('ns')) {
    // Nhân sự: ban điều hành / nhân sự thấy đủ; trưởng phòng không thấy CCCD, lương, hợp đồng;
    // công nhân chỉ thấy tên + xưởng + công đoạn của người cùng xưởng (hồ sơ đầy đủ chỉ của chính mình).
    var full = (me.vaiTro === 'ADMIN' || me.vaiTro === 'HR');
    var coBan = ['MaNV', 'HoTen', 'MaXuong', 'ChucDanh', 'TrangThai', 'NgayVaoLam', 'CongDoanLamDuoc', 'MucKyNang', 'NamSinh', 'laTP'];
    var lienHe = ['DienThoai', 'DiaChi', 'SdtKhanCap'];
    var ns = nhanSuGomTP_();
    if (me.vaiTro === 'TP' || me.vaiTro === 'CN') ns = ns.filter(function(x) { return x.MaXuong === me.xuong || x.MaNV === me.maNV; });
    out.nhansu = ns.map(function(x) {
      if (full) { var o = {}; for (var k in x) if (k !== 'NguoiTao' && k !== 'NgayTao') o[k] = x[k]; return o; }
      if (x.MaNV === me.maNV) return chonCot_(x, coBan.concat(lienHe, ['SoCCCD', 'BacTayNghe']));
      return chonCot_(x, me.vaiTro === 'TP' ? coBan.concat(lienHe, ['BacTayNghe']) : coBan);
    });
    out.yeuCauHoSo = (function() {
      if (['ADMIN', 'HR', 'TP'].indexOf(me.vaiTro) < 0) return [];
      if (!ss_().getSheetByName('YeuCauSuaHoSo')) return [];
      var ds = doc_('YeuCauSuaHoSo').filter(function(y) { return String(y.TrangThai).trim() === 'Chờ duyệt'; });
      if (me.vaiTro === 'TP') ds = ds.filter(function(y) { return String(y.MaXuong) === String(me.xuong); });
      return ds;
    })();
    out.yeuCauHoSoCuaToi = (function() {
      if (me.vaiTro !== 'CN' || !me.maNV) return [];
      if (!ss_().getSheetByName('YeuCauSuaHoSo')) return [];
      return doc_('YeuCauSuaHoSo').filter(function(y) { return y.MaNV === me.maNV; }).slice(-5).reverse();
    })();
  }
  if (can('cd')) {
    out.congdoan = congdoan;
    out.cdNgung = doc_('CongDoan').filter(function(x) { return x.TrangThai === 'Ngừng'; })
      .map(function(x) { return { MaCD: x.MaCD, TenCD: x.TenCD, MaXuong: x.MaXuong, CachCham: x.CachCham, ngung: true }; });
    out.dinhmuc = doc_('DinhMuc');
    out.lsDM = ss_().getSheetByName(LSDM_SHEET) ? doc_(LSDM_SHEET).map(function(x){ return { MaCD: x.MaCD, DinhMucGio: soVN_(x.DinhMucGio), TuNgay: x.TuNgay ? ngayVN_(x.TuNgay) : '', DenNgay: ngayVN_(x.DenNgay) }; }) : [];
    var dexuat = doc_('DeXuatDinhMuc');
    if (me.vaiTro === 'TP') dexuat = dexuat.filter(function(x) { return x.MaXuong === me.xuong; });
    out.dexuat = dexuat;
  }
  if (can('mm')) {
    // Máy đã thanh lý bị ẩn khỏi danh sách thao tác hằng ngày; dữ liệu vẫn giữ trong Sheet.
    out.maymoc = loc(doc_('MayMoc').filter(function(x) { return String(x.TinhTrang).trim() !== 'Thanh lý'; }), 'MaXuong');
  }
  if (can('vp')) {
    // Vi phạm nề nếp/chuyên cần. TP chỉ thấy của xưởng mình; CN chỉ thấy của mình.
    out.dmvp = docAnToan_('DanhMucViPham');
    var vipham = docAnToan_('ViPham').map(function(v) { var o = {}; for (var k in v) o[k] = v[k]; o.Ngay = ngayVN_(v.Ngay); return o; });
    if (me.vaiTro === 'TP') {
      var nvX = {};
      doc_('NhanSu').forEach(function(x) { if (x.MaXuong === me.xuong) nvX[x.MaNV] = 1; });
      vipham = vipham.filter(function(v) { return nvX[v.MaNV]; });
    } else if (me.vaiTro === 'CN') {
      vipham = vipham.filter(function(v) { return v.MaNV === me.maNV; });
    }
    out.vipham = vipham;
  }
  if (can('ts')) out.trongso = trongSoKy_(doc_('TrongSoKPI'), kyVN_());   // trọng số áp cho THÁNG NÀY
  if (can('tb')) {
    out.thongBao = (function() {
      if (me.vaiTro !== 'TP') return [];
      if (!ss_().getSheetByName('ThongBao')) return [];
      return doc_('ThongBao')
        .filter(function(t) { return String(t.MaXuong) === String(me.xuong) && String(t.DaDoc).trim() !== 'Rồi'; })
        .map(function(t) { return { MaTB: t.MaTB, ThoiDiem: t.ThoiDiem, TieuDe: t.TieuDe, NoiDung: t.NoiDung }; })
        .reverse();
    })();
  }
  if (can('dm')) {
    out.phongban = doc_('PhongBan');
    out.loi = doc_('DanhMucLoi');
    out.lydo = doc_('LyDoDung');
  }
  out.log = me.laOwner ? docCuoi_('NhatKyThaoTac', 80).reverse() : [];
  return sach_(locNapTheoVaiTro_(me, out));
  } catch (e) {
    return sach_({ ok: false, msg: 'Lỗi khi nạp dữ liệu: ' + (e.message || e) });
  }
}

/* Gửi về trình duyệt dữ liệu của N tháng gần nhất (tháng này + tháng trước). Đặt 0 = gửi hết như cũ. */
var SO_THANG_GUI_VE = 2;
function mocGuiVe_() {
  if (!SO_THANG_GUI_VE) return '';
  var p = kyVN_().split('-'), y = Number(p[0]), m = Number(p[1]) - (SO_THANG_GUI_VE - 1);
  while (m < 1) { m += 12; y--; }
  return y + '-' + ('0' + m).slice(-2) + '-01';
}

/* Đọc sheet an toàn: nếu sheet chưa tồn tại (chưa nâng cấp) thì trả mảng rỗng thay vì lỗi. */
function docAnToan_(name) {
  try { return doc_(name); } catch (e) { return []; }
}

/* ===== NHẬT KÝ SẢN XUẤT ===== */
function chotCa(token, rows, boQuaTrung) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (me.vaiTro !== 'TP' && me.vaiTro !== 'ADMIN') return sach_({ ok: false, msg: 'Không có quyền nhập nhật ký.' });
  khoa_();
  for (var iN = 0; rows && iN < rows.length; iN++) {
    var loiN = kiemNgay_(rows[iN].Ngay, 62);
    if (loiN) return sach_({ ok: false, msg: 'Dòng ' + (iN + 1) + ': ' + loiN });
  }
  if (!rows || !rows.length) return sach_({ ok: false, msg: 'Chưa có dòng nào.' });
  if (rows.length > 300) return sach_({ ok: false, msg: 'Mỗi lần chốt tối đa 300 dòng.' });

  var cd = doc_('CongDoan'), nsC = {};
  nhanSuGomTP_().forEach(function(x) { nsC[String(x.MaNV)] = x; });
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    if (Number(r.SoLuongLamRa) <= 0) return sach_({ ok: false, msg: 'Dòng ' + (i + 1) + ': chưa nhập số lượng.' });
    if (me.vaiTro === 'TP') {
      var c = cd.filter(function(x) { return x.MaCD === r.MaCD; })[0];
      if (!c || c.MaXuong !== me.xuong) return sach_({ ok: false, msg: 'Dòng ' + (i + 1) + ': công đoạn không thuộc xưởng của bạn.' });
    }
    var nvC = nsC[String(r.MaNV)];
    if (!nvC || String(nvC.TrangThai).trim() === 'Nghỉ việc') return sach_({ ok: false, msg: 'Dòng ' + (i + 1) + ': không tìm thấy nhân viên ' + r.MaNV + '.' });
    if (me.vaiTro === 'TP' && nvC.MaXuong !== me.xuong) return sach_({ ok: false, msg: 'Dòng ' + (i + 1) + ': ' + nvC.HoTen + ' không thuộc xưởng của bạn.' });
    r.GhiChu = String(r.GhiChu || '').slice(0, GHI_CHU_TOI_DA);
  }

  // Cảnh báo (không chặn) nếu nhập trùng NV + ngày + công đoạn đã có trong sổ
  // (đang Chờ duyệt hoặc Đã chốt). Trưởng phòng tự quyết có chốt tiếp hay không.
  if (!boQuaTrung) {
    var nk = doc_('NhatKySanXuat');
    var dsTrung = [];
    rows.forEach(function(r) {
      var ng = ngayVN_(r.Ngay);
      var da = nk.filter(function(x) {
        return x.MaNV === r.MaNV && ngayVN_(x.Ngay) === ng && x.MaCD === r.MaCD
          && String(x.TrangThai).trim() !== 'Từ chối';
      });
      if (da.length) {
        var c2 = cd.filter(function(x) { return x.MaCD === r.MaCD; })[0];
        dsTrung.push({ ngay: ng, maNV: r.MaNV, maCD: r.MaCD,
          tenCD: (c2 ? c2.TenCD : r.MaCD), trangThai: String(da[0].TrangThai).trim() });
      }
    });
    if (dsTrung.length) return sach_({ ok: false, canhBaoTrung: true, dsTrung: dsTrung,
      msg: 'Có ' + dsTrung.length + ' công đoạn đã tồn tại trong ngày.' });
  }

  var now = new Date();
  var out = rows.map(function(r) {
    return {
      MaDong: ma_('NK'), Ngay: r.Ngay, MaNV: r.MaNV,
      MaCD: r.MaCD, MaMay: r.MaMay || '', GioLam: Number(r.GioLam),
      SoLuongLamRa: Number(r.SoLuongLamRa), GioDung: 0,
      LyDoDung: '', GhiChu: r.GhiChu || '', TrangThai: 'Đã chốt',
      NguoiNhap: me.ten, ThoiDiemNhap: now
    };
  });

  themNhieu_('NhatKySanXuat', out);
  ghiLog_(me, 'Chốt ca', 'Thêm ' + out.length + ' dòng ngày ' + rows[0].Ngay + (boQuaTrung ? ' (đã bỏ qua cảnh báo trùng)' : ''));
  return sach_({ ok: true, msg: 'Đã chốt ' + out.length + ' dòng vào sổ.' });
}

/* ===== CÔNG NHÂN GỬI SẢN LƯỢNG (chờ trưởng phòng duyệt) ===== */
var SL_TOI_DA_DONG = 30, GHI_CHU_TOI_DA = 300;   // bảo mật 18/10: giới hạn mỗi lần công nhân gửi
var MA_HOP_LE = /^[A-Za-z0-9_.\-]{1,20}$/;   // mã máy / mã nhân viên (bảo mật 18/10)
function congNhanGuiSanLuong(token, rows) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (me.vaiTro !== 'CN') return sach_({ ok: false, msg: 'Chỉ công nhân dùng chức năng này.' });
  if (!me.maNV) return sach_({ ok: false, msg: 'Tài khoản chưa gắn với mã nhân viên. Báo quản lý cấp lại.' });
  if (!rows || !rows.length) return sach_({ ok: false, msg: 'Chưa có dòng nào.' });
  if (rows.length > SL_TOI_DA_DONG) return sach_({ ok: false, msg: 'Mỗi lần gửi tối đa ' + SL_TOI_DA_DONG + ' dòng.' });
  khoa_();
  var loiNgay = kiemNgay_(rows[0].Ngay, 31);
  if (loiNgay) return sach_({ ok: false, msg: loiNgay });
  for (var iN = 1; iN < rows.length; iN++) {
    if (String(rows[iN].Ngay) !== String(rows[0].Ngay)) return sach_({ ok: false, msg: 'Mỗi lần gửi chỉ cho một ngày.' });
  }

  var cd = doc_('CongDoan');
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    if (Number(r.SoLuongLamRa) <= 0) return sach_({ ok: false, msg: 'Dòng ' + (i + 1) + ': chưa nhập số lượng.' });
    // Số lỗi không được lớn hơn số làm ra
    if (Number(r.SoLoi) > Number(r.SoLuongLamRa)) return sach_({ ok: false, msg: 'Dòng ' + (i + 1) + ': số lỗi không thể lớn hơn số làm ra.' });
    // Công đoạn phải thuộc xưởng của công nhân
    var c = cd.filter(function(x) { return x.MaCD === r.MaCD; })[0];
    if (!c || c.MaXuong !== me.xuong) return sach_({ ok: false, msg: 'Dòng ' + (i + 1) + ': công đoạn không thuộc xưởng của bạn.' });
    if (r.MaMay && !doc_('MayMoc').some(function(x) { return String(x.MaMay) === String(r.MaMay) && x.MaXuong === me.xuong; }))
      return sach_({ ok: false, msg: 'Dòng ' + (i + 1) + ': máy không thuộc xưởng của bạn.' });
    r.GhiChu = String(r.GhiChu || '').slice(0, GHI_CHU_TOI_DA);
  }

  // MỖI NGÀY CHỈ NHẬP 1 LẦN: chặn nếu ngày đó đã có nhật ký "Chờ duyệt" hoặc "Đã chốt".
  // Ngoại lệ: nếu ngày đó bị "Từ chối" thì được nhập lại (coi như sửa lại).
  var ngayGui = ngayVN_(rows[0].Ngay);
  var nkCu = doc_('NhatKySanXuat').filter(function(x){
    return x.MaNV === me.maNV && ngayVN_(x.Ngay) === ngayGui;
  });
  var coChoDuyet = nkCu.some(function(x){ return String(x.TrangThai).trim() === 'Chờ duyệt'; });
  var coDaChot   = nkCu.some(function(x){ return String(x.TrangThai).trim() === 'Đã chốt'; });
  if (coChoDuyet) return sach_({ ok: false, msg: 'Bạn đã nhập sản lượng ngày ' + ngayGui.split("-").reverse().join("/") + ' rồi và đang chờ duyệt. Mỗi ngày chỉ nhập một lần.' });
  if (coDaChot)   return sach_({ ok: false, msg: 'Sản lượng ngày ' + ngayGui.split("-").reverse().join("/") + ' đã được duyệt. Không thể nhập thêm cho ngày này.' });

  var now = new Date();
  var out = rows.map(function(r) {
    // Số lỗi khai kèm được lưu tạm trong GhiChu dạng "LOI:<số>" — khi duyệt sẽ tách ra tạo phiếu ghi lỗi.
    var ghi = r.GhiChu || '';
    var soLoi = Number(r.SoLoi || 0);
    if (soLoi > 0) ghi = 'LOI:' + soLoi + (ghi ? ' | ' + ghi : '');
    return {
      MaDong: ma_('NK'), Ngay: r.Ngay, MaNV: me.maNV,   // luôn ghi đúng mã của người đang đăng nhập
      MaCD: r.MaCD, MaMay: r.MaMay || '', GioLam: Number(r.GioLam),
      SoLuongLamRa: Number(r.SoLuongLamRa), GioDung: 0,
      LyDoDung: '', GhiChu: ghi, TrangThai: 'Chờ duyệt',
      NguoiNhap: me.ten, ThoiDiemNhap: now
    };
  });

  __KPI_KHONG_DOI = true;                             // chỉ thêm dòng "Chờ duyệt": không xóa nhớ bảng KPI (21/10)
  themNhieu_('NhatKySanXuat', out);
  ghiLog_(me, 'Công nhân gửi sản lượng', 'Gửi ' + out.length + ' dòng ngày ' + rows[0].Ngay + ' (chờ duyệt)');
  return sach_({ ok: true, msg: 'Đã gửi ' + out.length + ' dòng cho trưởng phòng duyệt.' });
}

/* Tách số lỗi khai kèm từ GhiChu: "LOI:<số> | ghi chú". Trả về {soLoi, ghiChu}. */
function tachLoi_(ghichu) {
  var s = String(ghichu || '');
  var m = s.match(/^LOI:(\d+)\s*(\|\s*(.*))?$/);
  if (!m) return { soLoi: 0, ghiChu: s };
  return { soLoi: Number(m[1]), ghiChu: m[3] || '' };
}

/* ===== TRƯỞNG PHÒNG DUYỆT SẢN LƯỢNG CHỜ =====
   soLoiSua: nếu truyền vào (khác undefined/null/'') thì dùng số lỗi trưởng phòng sửa;
   nếu không, dùng đúng số lỗi công nhân đã khai. */
function duyetSanLuong(token, maDong, dongY, soLoiSua, sua) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (me.vaiTro !== 'TP' && me.vaiTro !== 'ADMIN') return sach_({ ok: false, msg: 'Chỉ trưởng phòng hoặc ban điều hành duyệt.' });

  var r = doc_('NhatKySanXuat').filter(function(x) { return x.MaDong === maDong; })[0];
  if (!r) return sach_({ ok: false, msg: 'Không tìm thấy dòng.' });
  if (String(r.TrangThai).trim() !== 'Chờ duyệt') return sach_({ ok: false, msg: 'Dòng này đã được xử lý.' });

  // Trưởng phòng chỉ duyệt công đoạn thuộc xưởng mình
  if (me.vaiTro === 'TP') {
    var c = doc_('CongDoan').filter(function(x) { return x.MaCD === r.MaCD; })[0];
    if (!c || c.MaXuong !== me.xuong) return sach_({ ok: false, msg: 'Dòng này không thuộc xưởng của bạn.' });
  }

  if (dongY) {
    // Cho phép trưởng phòng sửa Số lượng / Số lỗi trước khi duyệt (đã bỏ giờ dừng)
    sua = sua || {};
    var slLamRa = Number(r.SoLuongLamRa);
    if (sua.SoLuongLamRa !== undefined && sua.SoLuongLamRa !== null && sua.SoLuongLamRa !== '') {
      slLamRa = Number(sua.SoLuongLamRa);
      if (!(slLamRa > 0)) return sach_({ ok: false, msg: 'Số lượng làm ra phải lớn hơn 0.' });
    }
    var gioLam = Number(r.GioLam);
    if (sua.GioLam !== undefined && sua.GioLam !== null && sua.GioLam !== '') {
      gioLam = Number(sua.GioLam);
      if (!(gioLam > 0)) return sach_({ ok: false, msg: 'Giờ làm phải lớn hơn 0.' });
    }

    // Số lỗi cuối cùng: ưu tiên giá trị trưởng phòng sửa, nếu không lấy của công nhân
    var tach = tachLoi_(r.GhiChu);
    var soLoi = (soLoiSua === undefined || soLoiSua === null || soLoiSua === '') ? tach.soLoi : Number(soLoiSua);
    if (soLoi < 0) soLoi = 0;
    if (soLoi > slLamRa) return sach_({ ok: false, msg: 'Số lỗi không thể lớn hơn số làm ra (' + slLamRa + ').' });

    // Ghi các giá trị đã sửa (nếu có thay đổi)
    if (slLamRa !== Number(r.SoLuongLamRa) || soLoi !== tach.soLoi)   // A4: lưu số công nhân khai trước khi TP sửa (soát khâu duyệt)
      ghiCotNeuCo_('NhatKySanXuat', r._row, 'SLGoc', Number(r.SoLuongLamRa) + '/' + tach.soLoi);
    if (slLamRa !== Number(r.SoLuongLamRa)) suaO_('NhatKySanXuat', r._row, 'SoLuongLamRa', slLamRa);
    if (gioLam !== Number(r.GioLam)) suaO_('NhatKySanXuat', r._row, 'GioLam', gioLam);
    // Đã bỏ giờ dừng — luôn ghi 0
    suaO_('NhatKySanXuat', r._row, 'GioDung', 0);
    suaO_('NhatKySanXuat', r._row, 'LyDoDung', '');

    // Ghi nhật ký thành "Đã chốt", làm sạch phần LOI: trong ghi chú
    suaO_('NhatKySanXuat', r._row, 'GhiChu', tach.ghiChu);
    suaO_('NhatKySanXuat', r._row, 'TrangThai', 'Đã chốt');
    ghiCotNeuCo_('NhatKySanXuat', r._row, 'ThoiDiemDuyet', new Date());
    suaO_('NhatKySanXuat', r._row, 'NguoiNhap', r.NguoiNhap + ' → duyệt: ' + me.ten);

    // Nếu có lỗi, tạo phiếu ghi lỗi (không phân loại) để KPI trừ đúng
    if (soLoi > 0) {
      them_('PhieuKCS', {
        MaPhieu: ma_('QC'), Ngay: ngayVN_(r.Ngay), MaNV: r.MaNV, MaCD: r.MaCD,
        SoLuongKhongDat: soLoi, MaLoi: '',
        NguoiKiemTra: me.ten + ' (duyệt SL)', ThoiDiemNhap: new Date()
      });
    }
    ghiLog_(me, 'Duyệt sản lượng', r.MaNV + ' — ' + r.MaCD + ' — SL ' + slLamRa + (soLoi > 0 ? ' — lỗi ' + soLoi : ''), 'Chờ duyệt', 'Đã chốt');
    return sach_({ ok: true, msg: 'Đã duyệt' + (soLoi > 0 ? ' (trừ ' + soLoi + ' lỗi)' : '') + '. Dòng này giờ được tính vào KPI.' });
  } else {
    suaO_('NhatKySanXuat', r._row, 'TrangThai', 'Từ chối');
    ghiLog_(me, 'Từ chối sản lượng', r.MaNV + ' — ' + r.MaCD + ' — ' + r.SoLuongLamRa, 'Chờ duyệt', 'Từ chối');
    return sach_({ ok: true, msg: 'Đã từ chối. Công nhân cần nhập lại.' });
  }
}

/* Duyệt hàng loạt — nhận mảng mã dòng, duyệt hết. Trả về số duyệt được. */
/* ===== DUYỆT CẢ NHÓM (1 người trong 1 ngày) — giờ dừng & lý do chung ===== */
function duyetNhomNguoi(token, maDongList, gioDung, lyDo, suaList) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (me.vaiTro !== 'TP' && me.vaiTro !== 'ADMIN') return sach_({ ok: false, msg: 'Không có quyền.' });
  if (!maDongList || !maDongList.length) return sach_({ ok: false, msg: 'Chưa chọn dòng nào.' });

  // (Đã bỏ giờ dừng — không còn nhập/validate. Tham số gioDung/lyDo giữ cho tương thích, không dùng.)

  var nk = doc_('NhatKySanXuat');
  var cd = doc_('CongDoan');
  suaList = suaList || {};

  // Lấy các dòng hợp lệ (đúng trạng thái, đúng xưởng nếu là TP)
  var rows = [];
  for (var i = 0; i < maDongList.length; i++) {
    var r = nk.filter(function(x) { return x.MaDong === maDongList[i]; })[0];
    if (!r || String(r.TrangThai).trim() !== 'Chờ duyệt') continue;
    if (me.vaiTro === 'TP') {
      var c = cd.filter(function(x) { return x.MaCD === r.MaCD; })[0];
      if (!c || c.MaXuong !== me.xuong) return sach_({ ok: false, msg: 'Có dòng không thuộc xưởng của bạn.' });
    }
    rows.push(r);
  }
  if (!rows.length) return sach_({ ok: false, msg: 'Không có dòng hợp lệ để duyệt.' });

  var n = 0;
  rows.forEach(function(r, idx) {
    var laCuoi = (idx === rows.length - 1);
    // Áp giá trị sửa (giờ làm, SL, số lỗi) nếu trưởng phòng có chỉnh
    var sua = suaList[r.MaDong] || {};
    var slLamRa = Number(r.SoLuongLamRa);
    if (sua.SoLuongLamRa !== undefined && sua.SoLuongLamRa !== null && sua.SoLuongLamRa !== '') slLamRa = Number(sua.SoLuongLamRa);
    // Giờ làm = 8h nguyên ca chia đều cho các công đoạn (con số kỹ thuật; KPI cộng tổng rồi mới chia
    // nên cách chia không ảnh hưởng). Giờ dừng được TRỪ ở mẫu số khi tính hiệu suất (xem kpiThang_).
    var gioLam = Math.round((8 / rows.length) * 100) / 100;

    var tach = tachLoi_(r.GhiChu);
    var soLoi = (sua.soLoi === undefined || sua.soLoi === null || sua.soLoi === '') ? tach.soLoi : Number(sua.soLoi);
    if (soLoi < 0) soLoi = 0;
    if (soLoi > slLamRa) soLoi = slLamRa;

    if (slLamRa !== Number(r.SoLuongLamRa) || soLoi !== tach.soLoi)   // A4: lưu số công nhân khai trước khi TP sửa (soát khâu duyệt)
      ghiCotNeuCo_('NhatKySanXuat', r._row, 'SLGoc', Number(r.SoLuongLamRa) + '/' + tach.soLoi);
    if (slLamRa !== Number(r.SoLuongLamRa)) suaO_('NhatKySanXuat', r._row, 'SoLuongLamRa', slLamRa);
    if (gioLam !== Number(r.GioLam)) suaO_('NhatKySanXuat', r._row, 'GioLam', gioLam);

    // Đã bỏ giờ dừng — luôn ghi 0
    suaO_('NhatKySanXuat', r._row, 'GioDung', 0);
    suaO_('NhatKySanXuat', r._row, 'LyDoDung', '');

    suaO_('NhatKySanXuat', r._row, 'GhiChu', tach.ghiChu);
    suaO_('NhatKySanXuat', r._row, 'TrangThai', 'Đã chốt');
    ghiCotNeuCo_('NhatKySanXuat', r._row, 'ThoiDiemDuyet', new Date());
    suaO_('NhatKySanXuat', r._row, 'NguoiNhap', r.NguoiNhap + ' → duyệt: ' + me.ten);

    if (soLoi > 0) {
      them_('PhieuKCS', {
        MaPhieu: ma_('QC'), Ngay: ngayVN_(r.Ngay), MaNV: r.MaNV, MaCD: r.MaCD,
        SoLuongKhongDat: soLoi, MaLoi: '',
        NguoiKiemTra: me.ten + ' (duyệt SL)', ThoiDiemNhap: new Date()
      });
    }
    n++;
  });

  ghiLog_(me, 'Duyệt sản lượng cả người', rows[0].MaNV + ' ngày ' + ngayVN_(rows[0].Ngay) + ' — ' + n + ' công đoạn', 'Chờ duyệt', 'Đã chốt');
  return sach_({ ok: true, msg: 'Đã duyệt ' + n + ' công đoạn của người này. Giờ được tính KPI.' });
}

/* Từ chối nhiều dòng (cả người trong một ngày) */
function tuChoiNhieu(token, maDongList) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (me.vaiTro !== 'TP' && me.vaiTro !== 'ADMIN') return sach_({ ok: false, msg: 'Không có quyền.' });
  if (!maDongList || !maDongList.length) return sach_({ ok: false, msg: 'Chưa chọn dòng nào.' });
  var nk = doc_('NhatKySanXuat');
  var cd = doc_('CongDoan');
  var n = 0;
  maDongList.forEach(function(md) {
    var r = nk.filter(function(x) { return x.MaDong === md; })[0];
    if (!r || String(r.TrangThai).trim() !== 'Chờ duyệt') return;
    if (me.vaiTro === 'TP') {
      var c = cd.filter(function(x) { return x.MaCD === r.MaCD; })[0];
      if (!c || c.MaXuong !== me.xuong) return;
    }
    suaO_('NhatKySanXuat', r._row, 'TrangThai', 'Từ chối');
    n++;
  });
  ghiLog_(me, 'Từ chối sản lượng cả người', 'Từ chối ' + n + ' công đoạn');
  return sach_({ ok: true, msg: 'Đã từ chối ' + n + ' công đoạn. Công nhân cần nhập lại.' });
}

/* ===== LOẠI HẲN MỘT DÒNG CHỜ DUYỆT (xóa khỏi sổ) =====
   Dùng khi trưởng phòng thấy một công đoạn công nhân khai sai/thừa và muốn bỏ
   riêng dòng đó, rồi vẫn duyệt các dòng còn lại của người đó trong ngày.
   Chỉ xóa dòng đang "Chờ duyệt" và thuộc xưởng của TP. Không đụng dòng đã chốt. */
function xoaDongChoDuyet(token, maDong) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (me.vaiTro !== 'TP' && me.vaiTro !== 'ADMIN') return sach_({ ok: false, msg: 'Không có quyền.' });
  if (!maDong) return sach_({ ok: false, msg: 'Thiếu mã dòng.' });

  var nk = doc_('NhatKySanXuat');
  var r = nk.filter(function(x) { return x.MaDong === maDong; })[0];
  if (!r) return sach_({ ok: false, msg: 'Không tìm thấy dòng.' });
  if (String(r.TrangThai).trim() !== 'Chờ duyệt')
    return sach_({ ok: false, msg: 'Chỉ loại được dòng đang chờ duyệt.' });
  if (me.vaiTro === 'TP') {
    var c = doc_('CongDoan').filter(function(x) { return x.MaCD === r.MaCD; })[0];
    if (!c || c.MaXuong !== me.xuong)
      return sach_({ ok: false, msg: 'Dòng này không thuộc xưởng của bạn.' });
  }

  xoaDong_('NhatKySanXuat', r._row);
  ghiLog_(me, 'Loại dòng sản lượng', 'Xóa 1 công đoạn (' + r.MaCD + ') của ' + r.MaNV + ' ngày ' + ngayVN_(r.Ngay), 'Chờ duyệt', '(đã xóa)');
  return sach_({ ok: true, msg: 'Đã loại 1 công đoạn khỏi sổ. Các dòng còn lại vẫn duyệt bình thường.' });
}

/* ===== DUYỆT CẢ NHÓM (1 người trong 1 ngày) — kết thúc ===== */
function duyetSanLuongNhieu(token, maDongList) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (me.vaiTro !== 'TP' && me.vaiTro !== 'ADMIN') return sach_({ ok: false, msg: 'Không có quyền.' });
  if (!maDongList || !maDongList.length) return sach_({ ok: false, msg: 'Chưa chọn dòng nào.' });

  var nk = doc_('NhatKySanXuat');
  var cd = doc_('CongDoan');
  var n = 0;
  maDongList.forEach(function(md) {
    var r = nk.filter(function(x) { return x.MaDong === md; })[0];
    if (!r || String(r.TrangThai).trim() !== 'Chờ duyệt') return;
    if (me.vaiTro === 'TP') {
      var c = cd.filter(function(x) { return x.MaCD === r.MaCD; })[0];
      if (!c || c.MaXuong !== me.xuong) return;
    }
    // Tách số lỗi công nhân khai, tạo phiếu ghi lỗi nếu có, làm sạch ghi chú
    var tach = tachLoi_(r.GhiChu);
    suaO_('NhatKySanXuat', r._row, 'GhiChu', tach.ghiChu);
    suaO_('NhatKySanXuat', r._row, 'TrangThai', 'Đã chốt');
    ghiCotNeuCo_('NhatKySanXuat', r._row, 'ThoiDiemDuyet', new Date());
    suaO_('NhatKySanXuat', r._row, 'NguoiNhap', r.NguoiNhap + ' → duyệt: ' + me.ten);
    if (tach.soLoi > 0) {
      them_('PhieuKCS', {
        MaPhieu: ma_('QC'), Ngay: ngayVN_(r.Ngay), MaNV: r.MaNV, MaCD: r.MaCD,
        SoLuongKhongDat: tach.soLoi, MaLoi: '',
        NguoiKiemTra: me.ten + ' (duyệt SL)', ThoiDiemNhap: new Date()
      });
    }
    n++;
  });
  ghiLog_(me, 'Duyệt sản lượng hàng loạt', 'Duyệt ' + n + ' dòng');
  return sach_({ ok: true, msg: 'Đã duyệt ' + n + ' dòng. Các dòng này giờ được tính KPI.' });
}

/* ===== NÂNG CẤP: thêm cột MaNV vào sheet TaiKhoan (chạy MỘT LẦN, không xóa dữ liệu) ===== */
function NANG_CAP_THEM_COT_MANV() {
  if (!noiBo_(arguments[0])) return chanWeb_('NANG_CAP_THEM_COT_MANV');
  var sh = ss_().getSheetByName('TaiKhoan');
  if (!sh) { Logger.log('Không có sheet TaiKhoan'); return; }
  var head = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  if (head.indexOf('MaNV') >= 0) {
    Logger.log('Cột MaNV đã tồn tại — không cần thêm.');
    return;
  }
  // Thêm cột MaNV vào cuối
  var col = sh.getLastColumn() + 1;
  sh.getRange(1, col).setValue('MaNV')
    .setFontWeight('bold').setBackground('#12313a').setFontColor('#ffffff');
  Logger.log('Đã thêm cột MaNV vào sheet TaiKhoan. Giờ có thể tạo tài khoản công nhân.');
}

/* ===== NÂNG CẤP: tạo 2 sheet cho chấm nề nếp/chuyên cần (chạy MỘT LẦN) =====
   - DanhMucViPham: danh mục loại vi phạm + mức trừ (%) + nhóm (ChuyenCan / NeNep)
   - ViPham: ghi nhận từng lần vi phạm
   Không đụng dữ liệu cũ. Chạy lại vẫn an toàn (bỏ qua nếu sheet đã có). */
function NANG_CAP_TAO_SHEET_VIPHAM() {
  if (!noiBo_(arguments[0])) return chanWeb_('NANG_CAP_TAO_SHEET_VIPHAM');
  var ss = ss_();

  // 1. Sheet DanhMucViPham
  var shDM = ss.getSheetByName('DanhMucViPham');
  if (!shDM) {
    shDM = ss.insertSheet('DanhMucViPham');
    shDM.getRange(1, 1, 1, 4).setValues([['MaVP', 'TenViPham', 'MucTru', 'Nhom']])
      .setFontWeight('bold').setBackground('#12313a').setFontColor('#ffffff');
    // Biểu phạt mặc định (sửa được sau trong sheet)
    var mac = [
      ['VP01', 'Nghỉ không phép', 15, 'ChuyenCan'],
      ['VP02', 'Đi trễ / về sớm', 5, 'ChuyenCan'],
      ['VP03', 'Nghỉ có phép quá số ngày', 5, 'ChuyenCan'],
      ['VP04', 'Không đeo thẻ tên', 3, 'NeNep'],
      ['VP05', 'Sai đồng phục', 5, 'NeNep'],
      ['VP06', 'Vi phạm 5S / an toàn lao động', 10, 'NeNep'],
      ['VP07', 'Thái độ, không tuân thủ phân công', 10, 'NeNep']
    ];
    shDM.getRange(2, 1, mac.length, 4).setValues(mac);
    Logger.log('Đã tạo sheet DanhMucViPham với ' + mac.length + ' loại vi phạm mặc định.');
  } else {
    Logger.log('Sheet DanhMucViPham đã tồn tại — giữ nguyên.');
  }

  // 2. Sheet ViPham
  var shVP = ss.getSheetByName('ViPham');
  if (!shVP) {
    shVP = ss.insertSheet('ViPham');
    shVP.getRange(1, 1, 1, 7).setValues([['MaGhi', 'Ngay', 'MaNV', 'MaVP', 'GhiChu', 'NguoiGhi', 'ThoiDiemGhi']])
      .setFontWeight('bold').setBackground('#12313a').setFontColor('#ffffff');
    Logger.log('Đã tạo sheet ViPham (trống, sẵn sàng ghi nhận).');
  } else {
    Logger.log('Sheet ViPham đã tồn tại — giữ nguyên.');
  }
  Logger.log('XONG. Giờ trưởng phòng có thể ghi vi phạm ở màn "Chấm nề nếp".');
}

/* ===== GHI VI PHẠM (trưởng phòng) ===== */
function ghiViPham(token, o) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (me.vaiTro !== 'TP' && me.vaiTro !== 'ADMIN') return sach_({ ok: false, msg: 'Chỉ trưởng phòng hoặc ban điều hành ghi vi phạm.' });
  if (!o.MaNV) return sach_({ ok: false, msg: 'Chưa chọn nhân viên.' });
  if (!o.MaVP) return sach_({ ok: false, msg: 'Chưa chọn loại vi phạm.' });
  if (o.Ngay) { var loiNgay = kiemNgay_(o.Ngay, 62); if (loiNgay) return sach_({ ok: false, msg: loiNgay }); }

  // TP chỉ ghi cho nhân viên xưởng mình
  var nv = doc_('NhanSu').filter(function(x) { return x.MaNV === o.MaNV; })[0];
  if (!nv) return sach_({ ok: false, msg: 'Không tìm thấy nhân viên.' });
  if (me.vaiTro === 'TP' && nv.MaXuong !== me.xuong) return sach_({ ok: false, msg: 'Nhân viên này không thuộc xưởng của bạn.' });

  them_('ViPham', {
    MaGhi: ma_('VP'), Ngay: o.Ngay || ngayVN_(new Date()), MaNV: o.MaNV, MaVP: o.MaVP,
    GhiChu: o.GhiChu || '', NguoiGhi: me.ten, ThoiDiemGhi: new Date()
  });
  ghiLog_(me, 'Ghi vi phạm', o.MaNV + ' — ' + o.MaVP);
  return sach_({ ok: true, msg: 'Đã ghi nhận vi phạm.' });
}

/* Xóa một ghi nhận vi phạm (ghi sai) */
function xoaViPham(token, maGhi) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (me.vaiTro !== 'TP' && me.vaiTro !== 'ADMIN') return sach_({ ok: false, msg: 'Không có quyền.' });

  var v = doc_('ViPham').filter(function(x) { return x.MaGhi === maGhi; })[0];
  if (!v) return sach_({ ok: false, msg: 'Không tìm thấy ghi nhận.' });
  // TP chỉ xóa vi phạm của xưởng mình
  if (me.vaiTro === 'TP') {
    var nv = doc_('NhanSu').filter(function(x) { return x.MaNV === v.MaNV; })[0];
    if (!nv || nv.MaXuong !== me.xuong) return sach_({ ok: false, msg: 'Không thuộc xưởng của bạn.' });
  }
  xoaDong_('ViPham', v._row);
  ghiLog_(me, 'Xóa vi phạm', v.MaNV + ' — ' + v.MaVP);
  return sach_({ ok: true, msg: 'Đã xóa ghi nhận vi phạm.' });
}

/* Xóa HÀNG LOẠT nhiều ghi nhận vi phạm cùng lúc (owner/ADMIN, hoặc TP trong xưởng mình).
   maGhiList: danh sách MaGhi được tích. Bỏ qua mã không tìm thấy hoặc ngoài quyền. */
function xoaViPhamNhieu(token, maGhiList) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (me.vaiTro !== 'TP' && me.vaiTro !== 'ADMIN') return sach_({ ok: false, msg: 'Không có quyền.' });
  if (!maGhiList || !maGhiList.length) return sach_({ ok: false, msg: 'Chưa chọn mục nào để xóa.' });

  var can = {};
  maGhiList.forEach(function(m){ can[String(m)] = 1; });

  // Xóa từ dưới lên để không lệch dòng
  var rows = doc_('ViPham');
  var soXoa = 0, boQua = 0;
  for (var i = rows.length - 1; i >= 0; i--) {
    var v = rows[i];
    if (!can[String(v.MaGhi)]) continue;
    if (me.vaiTro === 'TP') {
      var nv = doc_('NhanSu').filter(function(x){ return x.MaNV === v.MaNV; })[0];
      if (!nv || nv.MaXuong !== me.xuong) { boQua++; continue; }
    }
    xoaDong_('ViPham', v._row);
    soXoa++;
  }
  ghiLog_(me, 'Xóa vi phạm hàng loạt', '', '', 'Xóa ' + soXoa + (boQua ? (', bỏ qua ' + boQua + ' ngoài quyền') : ''));
  return sach_({ ok: true, msg: 'Đã xóa ' + soXoa + ' ghi nhận vi phạm.' + (boQua ? (' Bỏ qua ' + boQua + ' mục ngoài xưởng của bạn.') : '') });
}

/* ===== TẠO HÀNG LOẠT TÀI KHOẢN CÔNG NHÂN TỪ SHEET NhanSu =====
   Chạy trực tiếp trong Apps Script (chọn hàm rồi bấm Chạy).
   - Tạo cho TẤT CẢ nhân viên đang làm (bỏ qua "Nghỉ việc").
   - Tên đăng nhập = mã NV viết thường (NV001 -> nv001).
   - Mật khẩu mặc định 123456, bắt buộc đổi lần đầu.
   - Bỏ qua nhân viên đã có tài khoản công nhân (không tạo trùng).
   Chạy lại nhiều lần vẫn an toàn — chỉ tạo cho người còn thiếu. */
function TAO_HANG_LOAT_TK_CONG_NHAN() {
  if (!noiBo_(arguments[0])) return chanWeb_('TAO_HANG_LOAT_TK_CONG_NHAN');
  var shTK = ss_().getSheetByName('TaiKhoan');
  if (!shTK) { Logger.log('Không có sheet TaiKhoan'); return; }

  // Đảm bảo đã có cột MaNV
  var head = shTK.getRange(1, 1, 1, shTK.getLastColumn()).getValues()[0];
  if (head.indexOf('MaNV') < 0) {
    Logger.log('CHƯA có cột MaNV. Hãy chạy NANG_CAP_THEM_COT_MANV trước, rồi chạy lại hàm này.');
    return;
  }

  var nhanvien = doc_('NhanSu').filter(function(x) {
    return String(x.TrangThai).trim() !== 'Nghỉ việc';
  });
  var taikhoan = doc_('TaiKhoan');

  // Tập tên đăng nhập đã tồn tại (để không đụng), và tập MaNV đã có tài khoản CN
  var tenDaCo = {};
  var maNVDaCoTK = {};
  taikhoan.forEach(function(t) {
    tenDaCo[String(t.TenDangNhap).toLowerCase().trim()] = true;
    if (String(t.VaiTro).trim() === 'CN' && t.MaNV)
      maNVDaCoTK[String(t.MaNV).toUpperCase().trim()] = true;
  });

  cotTK_('HanMatKhauTam');
  head = shTK.getRange(1, 1, 1, shTK.getLastColumn()).getValues()[0];
  var han = new Date(new Date().getTime() + MK_HAN_TAM_GIO * 3600e3), dsMK = [];
  var now = new Date();
  var themDs = [];
  var boQua = [];
  var trung = [];

  nhanvien.forEach(function(nv) {
    var maNV = String(nv.MaNV).toUpperCase().trim();
    if (!maNV) return;

    // Đã có tài khoản công nhân cho mã này -> bỏ qua
    if (maNVDaCoTK[maNV]) { boQua.push(maNV + ' (đã có TK)'); return; }

    var ten = maNV.toLowerCase();
    // Tên đăng nhập trùng với tài khoản khác (ví dụ trưởng phòng) -> báo, không tạo
    if (tenDaCo[ten]) { trung.push(maNV + ' (tên "' + ten + '" đã dùng)'); return; }

    var mk1 = mkTam_();
    dsMK.push(maNV + ' | ' + nv.HoTen + ' | ' + mk1);
    themDs.push([
      ten, taoBam_(mk1), nv.HoTen, 'CN', nv.MaXuong || '', 'Đang dùng',
      'Có', '', now, maNV
    ]);
    tenDaCo[ten] = true; // tránh trùng trong cùng mẻ
  });

  // Ghi xuống sheet theo đúng thứ tự cột hiện có
  if (themDs.length) {
    var cols = head; // thứ tự cột thực tế trong sheet
    var iCol = {};
    cols.forEach(function(c, i) { iCol[c] = i; });

    var rows = themDs.map(function(d) {
      // d theo thứ tự: TenDangNhap, MatKhau, HoTen, VaiTro, MaXuong, TrangThai, DoiMK, LanDN, NgayTao, MaNV
      var map = {
        TenDangNhap: d[0], MatKhauMaHoa: d[1], HoTen: d[2], VaiTro: d[3],
        MaXuong: d[4], TrangThai: d[5], DoiMatKhauLanDau: d[6],
        LanDangNhapCuoi: d[7], NgayTao: d[8], MaNV: d[9], HanMatKhauTam: han
      };
      return cols.map(function(c) { return map[c] !== undefined ? map[c] : ''; });
    });

    var batDau = shTK.getLastRow() + 1;
    shTK.getRange(batDau, 1, rows.length, cols.length).setValues(rows);
    // Cột mật khẩu phải là văn bản thuần
    var cMK = iCol['MatKhauMaHoa'];
    if (cMK >= 0) shTK.getRange(batDau, cMK + 1, rows.length, 1).setNumberFormat('@');
  }

  Logger.log('=== KẾT QUẢ TẠO HÀNG LOẠT ===');
  Logger.log('Đã tạo mới: ' + themDs.length + ' tài khoản công nhân. Mật khẩu tạm (dùng trong ' + MK_HAN_TAM_GIO + ' giờ) – chép danh sách dưới đây để phát:');
  if (dsMK.length) Logger.log(dsMK.join('\n'));
  Logger.log('Bỏ qua (đã có TK): ' + boQua.length + (boQua.length ? ' — ' + boQua.join(', ') : ''));
  if (trung.length) Logger.log('CẦN XEM: ' + trung.length + ' mã bị trùng tên đăng nhập — ' + trung.join(', '));
  if (themDs.length) {
    Logger.log('');
    Logger.log('Danh sách tài khoản vừa tạo (tên đăng nhập / mã NV):');
    themDs.forEach(function(d) { Logger.log('  ' + d[0] + '  →  ' + d[9] + ' (' + d[2] + ')'); });
  }
}

/* ===== KCS ===== */
function luuKCS(token, o) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (me.vaiTro !== 'QC' && me.vaiTro !== 'ADMIN') return sach_({ ok: false, msg: 'Chỉ kiểm soát chất lượng nhập được số lỗi.' });
  if (Number(o.SoLuongKhongDat) <= 0) return sach_({ ok: false, msg: 'Chưa nhập số lượng không đạt.' });
  var loiNgay = kiemNgay_(o.Ngay, 62);
  if (loiNgay) return sach_({ ok: false, msg: loiNgay });

  them_('PhieuKCS', {
    MaPhieu: ma_('QC'), Ngay: o.Ngay, MaNV: o.MaNV, MaCD: o.MaCD,
    SoLuongKhongDat: Number(o.SoLuongKhongDat), MaLoi: '',
    NguoiKiemTra: me.ten, ThoiDiemNhap: new Date()
  });
  ghiLog_(me, 'Ghi nhận lỗi', o.MaNV + ' — ' + o.SoLuongKhongDat + ' sản phẩm');
  return sach_({ ok: true, msg: 'Đã lưu phiếu kiểm tra.' });
}

/* ===== NHÂN SỰ ===== */
function luuNhanSu(token, o) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (['ADMIN', 'HR', 'TP'].indexOf(me.vaiTro) < 0) return sach_({ ok: false, msg: 'Không có quyền.' });
  if (!o.MaNV || !o.HoTen) return sach_({ ok: false, msg: 'Cần mã nhân viên và họ tên.' });

  var maNV = String(o.MaNV).trim().toUpperCase();
  if (!MA_HOP_LE.test(maNV)) return sach_({ ok: false, msg: 'Mã nhân viên chỉ gồm chữ không dấu, số và dấu _ . - (tối đa 20 ký tự).' });
  if (doc_('NhanSu').filter(function(x) { return String(x.MaNV).toUpperCase() === maNV; })[0])
    return sach_({ ok: false, msg: 'Mã nhân viên ' + maNV + ' đã tồn tại.' });
  if (doc_('TaiKhoan').some(function(x) { return String(x.MaNV).toUpperCase().trim() === maNV && String(x.VaiTro).trim() !== 'CN'; }))
    return sach_({ ok: false, msg: 'Mã nhân viên ' + maNV + ' đang gắn với một tài khoản quản lý. Dùng mã khác.' });

  var full = (me.vaiTro === 'ADMIN' || me.vaiTro === 'HR');
  var xuong = (me.vaiTro === 'TP') ? me.xuong : o.MaXuong;

  them_('NhanSu', {
    MaNV: maNV, HoTen: chuanHoaTen_(o.HoTen),
    MaXuong: xuong,
    ChucDanh: chuanHoaChucDanh_(o.ChucDanh || 'Công nhân'),
    BacTayNghe: full ? (o.BacTayNghe || 1) : 1,
    NamSinh: o.NamSinh || '', NgayVaoLam: o.NgayVaoLam || '',
    SoCCCD: full ? (o.SoCCCD || '') : '',
    DienThoai: o.DienThoai || '', DiaChi: o.DiaChi || '',
    LoaiHopDong: full ? (o.LoaiHopDong || '') : 'Chờ nhân sự bổ sung',
    LuongCoBan: full ? (o.LuongCoBan || 0) : 0,
    CongDoanLamDuoc: o.CongDoanLamDuoc || '',
    TrangThai: 'Đang làm', NguoiTao: me.ten, NgayTao: new Date()
  });
  ghiLog_(me, 'Thêm nhân sự', maNV + ' — ' + o.HoTen);

  // ===== TỰ ĐỘNG TẠO TÀI KHOẢN CÔNG NHÂN =====
  // Tên đăng nhập = mã NV viết thường; mật khẩu tạm ngẫu nhiên (48 giờ); bắt buộc đổi lần đầu.
  var tkMsg = '', tkMoi = null;
  try {
    var shTK = ss_().getSheetByName('TaiKhoan');
    var head = shTK ? shTK.getRange(1, 1, 1, shTK.getLastColumn()).getValues()[0] : [];
    var coCotMaNV = head.indexOf('MaNV') >= 0;

    if (!coCotMaNV) {
      tkMsg = ' (Chưa tạo được tài khoản: sheet TaiKhoan thiếu cột MaNV.)';
    } else {
      var dsTK = doc_('TaiKhoan');
      var daCoTK = dsTK.filter(function(x) {
        return String(x.VaiTro).trim() === 'CN' && String(x.MaNV).toUpperCase().trim() === maNV;
      })[0];
      var tenDN = maNV.toLowerCase();
      var trungTen = dsTK.filter(function(x) {
        return String(x.TenDangNhap).toLowerCase().trim() === tenDN;
      })[0];

      if (daCoTK) {
        tkMsg = ' (Tài khoản công nhân đã có sẵn.)';
      } else if (trungTen) {
        tkMsg = ' (Chưa tạo tài khoản: tên đăng nhập "' + tenDN + '" đã có người dùng — cần ban điều hành cấp thủ công.)';
      } else {
        var mkMoi = mkTam_();
        them_('TaiKhoan', {
          TenDangNhap: tenDN, MatKhauMaHoa: '', HoTen: o.HoTen,
          VaiTro: 'CN', MaXuong: xuong || '', TrangThai: 'Đang dùng',
          DoiMatKhauLanDau: 'Có', LanDangNhapCuoi: '', NgayTao: new Date(), MaNV: maNV
        });
        var moiTao = doc_('TaiKhoan').filter(function(x) {
          return String(x.TenDangNhap).toLowerCase() === tenDN;
        })[0];
        if (moiTao) datMKTam_(moiTao._row, mkMoi);
        ghiLog_(me, 'Tạo tài khoản (tự động)', tenDN + ' — CN (' + maNV + ')');
        tkMoi = { mkTam: mkMoi, tenDN: tenDN, hoTen: o.HoTen, hanGio: MK_HAN_TAM_GIO };
        tkMsg = ' Đã tạo tài khoản đăng nhập "' + tenDN + '" (mật khẩu tạm ' + mkMoi + ', dùng trong ' + MK_HAN_TAM_GIO + ' giờ).';
      }
    }
  } catch (e) {
    tkMsg = ' (Lưu hồ sơ xong nhưng tạo tài khoản lỗi: ' + (e.message || e) + '. Ban điều hành cấp tài khoản thủ công.)';
  }

  var kqNS = { ok: true, msg: 'Đã lưu hồ sơ.' +
    (full ? '' : ' Phòng nhân sự sẽ bổ sung giấy tờ và hợp đồng.') + tkMsg };
  if (tkMoi) for (var kN in tkMoi) kqNS[kN] = tkMoi[kN];
  return sach_(kqNS);
}

function luuKyNang(token, maNV, ds) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (['ADMIN', 'HR', 'TP'].indexOf(me.vaiTro) < 0) return sach_({ ok: false, msg: 'Không có quyền.' });

  var nv = doc_('NhanSu').filter(function(x) { return x.MaNV === maNV; })[0];
  if (!nv) return sach_({ ok: false, msg: 'Không tìm thấy nhân viên.' });
  if (me.vaiTro === 'TP' && nv.MaXuong !== me.xuong) return sach_({ ok: false, msg: 'Nhân viên không thuộc xưởng của bạn.' });

  suaO_('NhanSu', nv._row, 'CongDoanLamDuoc', ds);
  ghiLog_(me, 'Cập nhật công đoạn làm được', maNV, nv.CongDoanLamDuoc, ds);
  return sach_({ ok: true, msg: 'Đã cập nhật.' });
}

/* Gán HÀNG LOẠT một công đoạn cho nhiều người trong cùng xưởng.
   maCD: mã công đoạn. maNVList: danh sách MaNV ĐƯỢC TÍCH (làm được công đoạn này).
   Với mọi nhân sự đang làm việc trong xưởng của công đoạn:
     - có trong maNVList  -> đảm bảo CongDoanLamDuoc chứa maCD
     - không trong list   -> gỡ maCD khỏi CongDoanLamDuoc
   Dùng cho khung "Gán người vào công đoạn" ở tab Công đoạn & định mức. */
function ganCongDoanChoNhieu(token, maCD, maNVList, khongGoBot) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (['ADMIN', 'TP'].indexOf(me.vaiTro) < 0) return sach_({ ok: false, msg: 'Không có quyền.' });

  var cd = doc_('CongDoan').filter(function(x){ return x.MaCD === maCD; })[0];
  if (!cd) return sach_({ ok: false, msg: 'Không tìm thấy công đoạn.' });
  if (me.vaiTro === 'TP' && String(cd.MaXuong) !== String(me.xuong))
    return sach_({ ok: false, msg: 'Công đoạn không thuộc xưởng của bạn.' });

  var maXuong = cd.MaXuong;
  var chon = {};
  (maNVList || []).forEach(function(m){ chon[String(m)] = 1; });

  var ns = doc_('NhanSu').filter(function(x){
    return String(x.TrangThai).trim() !== 'Nghỉ việc' && String(x.MaXuong) === String(maXuong);
  });

  var soThem = 0, soGo = 0;
  ns.forEach(function(nv){
    var ds = String(nv.CongDoanLamDuoc || '').split(',').map(function(s){ return s.trim(); }).filter(Boolean);
    var coTrongDs = ds.indexOf(maCD) >= 0;
    var duocChon = !!chon[String(nv.MaNV)];
    if (duocChon && !coTrongDs) {
      ds.push(maCD);
      suaO_('NhanSu', nv._row, 'CongDoanLamDuoc', ds.join(','));
      soThem++;
    } else if (!duocChon && coTrongDs && !khongGoBot) {
      ds = ds.filter(function(x){ return x !== maCD; });
      suaO_('NhanSu', nv._row, 'CongDoanLamDuoc', ds.join(','));
      soGo++;
    }
  });

  ghiLog_(me, 'Gán công đoạn hàng loạt', maCD, '', 'Thêm ' + soThem + ', gỡ ' + soGo);
  return sach_({ ok: true, msg: 'Đã lưu: thêm ' + soThem + ' người, gỡ ' + soGo + ' người cho công đoạn ' + (cd.TenCD || maCD) + '.' });
}

/* Lấy hồ sơ chi tiết một nhân viên: thông tin, nhật ký, lỗi, KPI theo tháng */
function hoSoNhanVien(token, maNV) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  // Hồ sơ có SĐT, địa chỉ, CCCD: chỉ ban điều hành, nhân sự, trưởng/phó phòng (trong xưởng) xem được.
  // Công nhân chỉ xem hồ sơ của chính mình.
  if (me.vaiTro === 'CN' && String(maNV) !== String(me.maNV))
    return sach_({ ok: false, msg: 'Bạn chỉ xem được hồ sơ của chính mình.' });
  if (['ADMIN', 'HR', 'TP', 'CN'].indexOf(me.vaiTro) < 0)
    return sach_({ ok: false, msg: 'Không có quyền xem hồ sơ nhân sự.' });

  var nv = doc_('NhanSu').filter(function(x) { return x.MaNV === maNV; })[0];
  if (!nv) return sach_({ ok: false, msg: 'Không tìm thấy nhân viên.' });
  if (me.vaiTro === 'TP' && nv.MaXuong !== me.xuong)
    return sach_({ ok: false, msg: 'Nhân viên không thuộc xưởng của bạn.' });

  var full = (me.vaiTro === 'ADMIN' || me.vaiTro === 'HR');

  var nk = docNKTu_('')
    .filter(function(r) { return r.MaNV === maNV; })
    .map(function(r) { r.Ngay = ngayVN_(r.Ngay); return r; });

  var kcs = doc_('PhieuKCS')
    .filter(function(r) { return r.MaNV === maNV; })
    .map(function(r) { r.Ngay = ngayVN_(r.Ngay); return r; });

  var ho = {
    MaNV: nv.MaNV, HoTen: nv.HoTen, MaXuong: nv.MaXuong,
    ChucDanh: nv.ChucDanh, NamSinh: nv.NamSinh,
    NgayVaoLam: ngayVN_(nv.NgayVaoLam),
    DienThoai: nv.DienThoai, DiaChi: nv.DiaChi,
    SdtKhanCap: nv.SdtKhanCap,
    CongDoanLamDuoc: nv.CongDoanLamDuoc, TrangThai: nv.TrangThai,
    BacTayNghe: full ? nv.BacTayNghe : '',
    SoCCCD: full ? nv.SoCCCD : '',
    LoaiHopDong: full ? nv.LoaiHopDong : '',
    LuongCoBan: full ? nv.LuongCoBan : ''
  };

  return sach_({ ok: true, full: full, ho: ho, nhatky: nk, kcs: kcs });
}

/* Cập nhật thông tin nhân viên */
function suaNhanSu(token, o) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (['ADMIN', 'HR', 'TP'].indexOf(me.vaiTro) < 0) return sach_({ ok: false, msg: 'Không có quyền.' });

  var nv = doc_('NhanSu').filter(function(x) { return x.MaNV === o.MaNV; })[0];
  if (!nv) return sach_({ ok: false, msg: 'Không tìm thấy nhân viên.' });
  if (me.vaiTro === 'TP' && nv.MaXuong !== me.xuong)
    return sach_({ ok: false, msg: 'Nhân viên không thuộc xưởng của bạn.' });

  var full = (me.vaiTro === 'ADMIN' || me.vaiTro === 'HR');
  // Trưởng phòng / phó phòng được sửa trạng thái làm việc (TrangThai), ngoài các trường cơ bản.
  var duoc = ['HoTen', 'ChucDanh', 'NamSinh', 'NgayVaoLam', 'DienThoai', 'DiaChi', 'SdtKhanCap', 'TrangThai'];
  if (full) duoc = duoc.concat(['BacTayNghe', 'SoCCCD', 'LoaiHopDong', 'LuongCoBan', 'MaXuong']);

  var doi = [];
  var doiXuong = false, xuongCu = String(nv.MaXuong || ''), xuongMoi = xuongCu;
  duoc.forEach(function(k) {
    if (o[k] === undefined || o[k] === '') return;
    if (String(nv[k]) === String(o[k])) return;
    // Chỉ ban điều hành / nhân sự được đổi chức danh liên quan cấp quản lý (tránh tự nâng quyền tài khoản)
    if (k === 'ChucDanh' && !full && (laChucDanhQL_(o[k]) || laChucDanhQL_(nv.ChucDanh))) return;
    // Đổi xưởng: chỉ ADMIN được phép
    if (k === 'MaXuong') {
      if (me.vaiTro !== 'ADMIN') {
        return; // bỏ qua thay đổi xưởng nếu không phải ADMIN
      }
      doiXuong = true; xuongMoi = String(o[k]);
    }
    suaO_('NhanSu', nv._row, k, o[k]);
    doi.push(k);
  });

  // Khi đổi xưởng: xóa sạch công đoạn làm được cũ, thông báo TP xưởng mới gán lại
  if (doiXuong) {
    suaO_('NhanSu', nv._row, 'CongDoanLamDuoc', '');
    taoThongBao_(xuongMoi,
      'Công nhân mới chuyển đến — cần gán công đoạn',
      (o.HoTen || nv.HoTen) + ' (' + nv.MaNV + ') vừa chuyển từ xưởng ' + (xuongCu || '(trống)') +
      ' sang. Công đoạn làm được đã được đặt trống — vui lòng vào mục Nhân sự gán lại công đoạn cho phù hợp xưởng.',
      me.ten);
    ghiLog_(me, 'Chuyển xưởng nhân sự', nv.MaNV + ' — ' + xuongCu + ' → ' + xuongMoi +
      ' (đã xóa công đoạn làm được cũ)', xuongCu, xuongMoi);
  }

  if (!doi.length) return sach_({ ok: true, msg: 'Không có thay đổi nào.' });

  // Chuyển "Nghỉ việc" -> ngừng luôn tài khoản đăng nhập của người này
  var ghiChuTK = '';
  if (doi.indexOf('TrangThai') >= 0 && String(o.TrangThai).trim() === 'Nghỉ việc') {
    var nNgung = ngungTKTheoMaNV_(nv.MaNV);
    if (nNgung) ghiChuTK = ' Đã ngừng ' + nNgung + ' tài khoản đăng nhập của người này.';
  }

  // Nếu đổi chức danh sang Phó phòng / Trưởng phòng thì đồng bộ vai trò tài khoản đăng nhập
  var ghiChuVT = '';
  if (doi.indexOf('ChucDanh') >= 0) {
    ghiChuVT = dongBoVaiTroTaiKhoan_(o.MaNV, o.ChucDanh, me);
  }

  ghiLog_(me, 'Sửa hồ sơ nhân sự', o.MaNV + ' — ' + doi.join(', '));
  return sach_({ ok: true, msg: 'Đã cập nhật ' + doi.length + ' thông tin.' + ghiChuVT + ghiChuTK });
}

/* Chức danh cấp quản lý (trưởng/phó phòng, quản đốc…) */
function laChucDanhQL_(s) {
  var cd = String(s || '').toLowerCase();
  return cd.indexOf('trưởng phòng') >= 0 || cd.indexOf('phó phòng') >= 0 || cd.indexOf('trưởng bộ phận') >= 0 ||
         cd.indexOf('phó bộ phận') >= 0 || cd.indexOf('phó bp') >= 0 || cd.indexOf('quản đốc') >= 0;
}

/* Ngừng mọi tài khoản gắn với một mã nhân viên. Trả số tài khoản đã ngừng. */
function ngungTKTheoMaNV_(maNV) {
  var n = 0;
  doc_('TaiKhoan').forEach(function(t) {
    if (String(t.MaNV).trim() === String(maNV).trim() && String(t.TrangThai).trim() === 'Đang dùng') {
      suaO_('TaiKhoan', t._row, 'TrangThai', 'Ngừng');
      n++;
    }
  });
  return n;
}

/* Đồng bộ vai trò tài khoản đăng nhập theo chức danh nhân sự.
   Chức danh chứa "phó phòng"/"phó bộ phận" -> VaiTro=PP; "trưởng phòng"/"trưởng bộ phận"/"quản đốc" -> TP.
   Lưu ý: "Tổ trưởng" KHÔNG phải cấp quản lý — giữ nguyên vai trò công nhân, không nâng. */
/* Chạy một lần: quét toàn bộ NhanSu, đồng bộ vai trò tài khoản cho tất cả
   người có chức danh Phó phòng / Trưởng phòng mà tài khoản chưa đúng.
   Chạy trực tiếp trong Apps Script rồi xem Nhật ký. */
/* Chạy một lần: xóa tài khoản công nhân (VaiTro=CN) bị TRÙNG cho những người
   đã có tài khoản quản lý (TP/PP/ADMIN) khác. An toàn: chỉ xóa khi chắc chắn */

/* Chạy một lần: sửa lại các TỔ TRƯỞNG bị nâng nhầm thành TP -> trả về CN (công nhân).
   Chỉ hạ người có chức danh chứa "tổ trưởng" mà tài khoản đang là TP. */

function dongBoVaiTroTaiKhoan_(maNV, chucDanh, me) {
  if (!maNV) return '';
  var cd = String(chucDanh || '').toLowerCase();
  var vaiTroMoi = '';
  if (cd.indexOf('phó phòng') >= 0 || cd.indexOf('phó bộ phận') >= 0 || cd.indexOf('phó bp') >= 0) vaiTroMoi = 'PP';
  else if (cd.indexOf('trưởng phòng') >= 0 || cd.indexOf('trưởng bộ phận') >= 0 || cd.indexOf('quản đốc') >= 0) vaiTroMoi = 'TP';
  if (!vaiTroMoi) return '';   // chức danh không phải cấp quản lý -> không đụng tài khoản

  var tk = doc_('TaiKhoan').filter(function(x) { return String(x.MaNV) === String(maNV); })[0];
  if (!tk) return ' (Nhân viên chưa có tài khoản đăng nhập — chưa đổi được vai trò.)';
  if (String(tk.VaiTro) === vaiTroMoi) return '';   // đã đúng rồi
  if (['CN', 'TP', 'PP'].indexOf(String(tk.VaiTro).trim()) < 0) return '';   // tài khoản quản trị / nhân sự / trợ lý: không đụng
  if (!me || !me.laOwner) return ' (Vai trò tài khoản đăng nhập chưa đổi – nhờ chủ sở hữu đổi ở tab Tài khoản.)';

  suaO_('TaiKhoan', tk._row, 'VaiTro', vaiTroMoi);
  return ' Đã nâng vai trò tài khoản "' + tk.TenDangNhap + '" thành ' +
         (vaiTroMoi === 'PP' ? 'Phó phòng' : 'Trưởng phòng') + '.';
}


/* ============================================================
   SỬA HỒ SƠ CÁ NHÂN (công nhân tự sửa 4 mục — cần duyệt)
   4 mục được phép: DienThoai, SoCCCD, DiaChi, SdtKhanCap
   ============================================================ */

/* Tạo sheet lưu yêu cầu sửa hồ sơ nếu chưa có */
function taoSheetYeuCauHoSo_() {
  var ss = ss_();
  var sh = ss.getSheetByName('YeuCauSuaHoSo');
  if (!sh) {
    sh = ss.insertSheet('YeuCauSuaHoSo');
    sh.getRange(1, 1, 1, 13).setValues([[
      'MaYC','MaNV','HoTen','MaXuong','DienThoai','SoCCCD','DiaChi','SdtKhanCap',
      'NguoiGui','NgayGui','TrangThai','NguoiDuyet','NgayDuyet'
    ]]).setFontWeight('bold').setBackground('#12313a').setFontColor('#ffffff');
    sh.setFrozenRows(1);
    // Cột DienThoai(5), SoCCCD(6), SdtKhanCap(8) để dạng VĂN BẢN — giữ số 0 đầu
    sh.getRange(2, 5, sh.getMaxRows() - 1, 1).setNumberFormat('@');
    sh.getRange(2, 6, sh.getMaxRows() - 1, 1).setNumberFormat('@');
    sh.getRange(2, 8, sh.getMaxRows() - 1, 1).setNumberFormat('@');
  }
  return sh;
}

/* Nâng cấp: thêm cột SdtKhanCap vào NhanSu (chạy một lần, an toàn nếu đã có) */
function NANG_CAP_THEM_COT_SDTKHANCAP() {
  if (!noiBo_(arguments[0])) return chanWeb_('NANG_CAP_THEM_COT_SDTKHANCAP');
  var sh = ss_().getSheetByName('NhanSu');
  if (!sh) return;
  var head = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  if (head.indexOf('SdtKhanCap') >= 0) { Logger.log('Đã có cột SdtKhanCap.'); return; }
  sh.getRange(1, sh.getLastColumn() + 1).setValue('SdtKhanCap').setFontWeight('bold');
  xoaCache_('NhanSu');
  Logger.log('Đã thêm cột SdtKhanCap vào NhanSu.');
}

/* Công nhân gửi yêu cầu sửa 4 mục hồ sơ — KHÔNG ghi thẳng, tạo bản ghi chờ duyệt */
function congNhanGuiSuaHoSo(token, o) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (!me.maNV) return sach_({ ok: false, msg: 'Tài khoản của bạn chưa gắn mã nhân viên.' });

  var nv = doc_('NhanSu').filter(function(x) { return x.MaNV === me.maNV; })[0];
  if (!nv) return sach_({ ok: false, msg: 'Không tìm thấy hồ sơ của bạn.' });

  // Chỉ nhận đúng 4 trường cho phép
  var dt = String(o.DienThoai || '').trim();
  var cc = String(o.SoCCCD || '').trim();
  var dc = String(o.DiaChi || '').trim();
  var kc = String(o.SdtKhanCap || '').trim();

  // Kiểm tra định dạng nhẹ
  if (dt && !/^[0-9 +().-]{6,20}$/.test(dt)) return sach_({ ok: false, msg: 'Số điện thoại không hợp lệ.' });
  if (kc && !/^[0-9 +().-]{6,20}$/.test(kc)) return sach_({ ok: false, msg: 'Số điện thoại khẩn cấp không hợp lệ.' });
  if (cc && !/^[0-9]{9,12}$/.test(cc))       return sach_({ ok: false, msg: 'Số CCCD phải là 9–12 chữ số.' });

  // Bỏ yêu cầu cũ còn "Chờ duyệt" của chính người này (chỉ giữ yêu cầu mới nhất)
  taoSheetYeuCauHoSo_();
  var cu = doc_('YeuCauSuaHoSo').filter(function(y) {
    return y.MaNV === me.maNV && String(y.TrangThai).trim() === 'Chờ duyệt';
  });
  cu.forEach(function(y) { suaO_('YeuCauSuaHoSo', y._row, 'TrangThai', 'Đã hủy (gửi lại)'); });

  them_('YeuCauSuaHoSo', {
    MaYC: ma_('YC'), MaNV: me.maNV, HoTen: nv.HoTen, MaXuong: nv.MaXuong,
    DienThoai: dt, SoCCCD: cc, DiaChi: dc, SdtKhanCap: kc,
    NguoiGui: me.ten, NgayGui: new Date(), TrangThai: 'Chờ duyệt',
    NguoiDuyet: '', NgayDuyet: ''
  });
  // Ghi lại 3 trường số ở dạng văn bản để không mất số 0 đầu
  var shYC = ss_().getSheetByName('YeuCauSuaHoSo');
  var rowMoi = shYC.getLastRow();
  suaOText_('YeuCauSuaHoSo', rowMoi, 'DienThoai', dt);
  suaOText_('YeuCauSuaHoSo', rowMoi, 'SoCCCD', cc);
  suaOText_('YeuCauSuaHoSo', rowMoi, 'SdtKhanCap', kc);

  // Thông báo cho trưởng phòng của xưởng
  taoThongBao_(nv.MaXuong, 'Yêu cầu sửa hồ sơ',
    me.ten + ' (' + me.maNV + ') xin cập nhật thông tin liên hệ. Vào mục Nhân sự để duyệt.', me.ten);

  ghiLog_(me, 'Gửi yêu cầu sửa hồ sơ', me.maNV);
  return sach_({ ok: true, msg: 'Đã gửi yêu cầu. Chờ trưởng phòng hoặc ban điều hành duyệt.' });
}

/* TP/ADMIN duyệt hoặc từ chối yêu cầu sửa hồ sơ.
   dongY = true: ghi 4 trường vào NhanSu. false: chỉ đánh dấu từ chối. */
function duyetSuaHoSo(token, maYC, dongY) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (['ADMIN', 'HR', 'TP'].indexOf(me.vaiTro) < 0) return sach_({ ok: false, msg: 'Không có quyền duyệt.' });

  var yc = doc_('YeuCauSuaHoSo').filter(function(y) { return y.MaYC === maYC; })[0];
  if (!yc) return sach_({ ok: false, msg: 'Không tìm thấy yêu cầu.' });
  if (String(yc.TrangThai).trim() !== 'Chờ duyệt')
    return sach_({ ok: false, msg: 'Yêu cầu này đã được xử lý.' });

  // TP chỉ duyệt trong xưởng mình
  if (me.vaiTro === 'TP' && String(yc.MaXuong) !== String(me.xuong))
    return sach_({ ok: false, msg: 'Yêu cầu không thuộc xưởng của bạn.' });

  var nv = doc_('NhanSu').filter(function(x) { return x.MaNV === yc.MaNV; })[0];
  if (!nv) return sach_({ ok: false, msg: 'Không tìm thấy hồ sơ nhân viên.' });

  if (dongY) {
    // Chỉ ghi 4 trường cho phép, và chỉ khi có giá trị
    [['DienThoai', yc.DienThoai, true], ['SoCCCD', yc.SoCCCD, true],
     ['DiaChi', yc.DiaChi, false], ['SdtKhanCap', yc.SdtKhanCap, true]].forEach(function(p) {
      if (String(p[1] || '').trim() !== '') {
        if (p[2]) suaOText_('NhanSu', nv._row, p[0], p[1]);
        else      suaO_('NhanSu', nv._row, p[0], p[1]);
      }
    });
    suaO_('YeuCauSuaHoSo', yc._row, 'TrangThai', 'Đã duyệt');
    ghiLog_(me, 'Duyệt sửa hồ sơ', yc.MaNV + ' — ' + yc.HoTen);
  } else {
    suaO_('YeuCauSuaHoSo', yc._row, 'TrangThai', 'Từ chối');
    ghiLog_(me, 'Từ chối sửa hồ sơ', yc.MaNV + ' — ' + yc.HoTen);
  }
  suaO_('YeuCauSuaHoSo', yc._row, 'NguoiDuyet', me.ten);
  suaO_('YeuCauSuaHoSo', yc._row, 'NgayDuyet', new Date());

  return sach_({ ok: true, msg: dongY ? 'Đã duyệt và cập nhật hồ sơ.' : 'Đã từ chối yêu cầu.' });
}

/* Duyệt TẤT CẢ yêu cầu sửa hồ sơ đang chờ (ADMIN: toàn nhà máy; TP: xưởng mình) */
function duyetTatCaSuaHoSo(token) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (['ADMIN', 'HR', 'TP'].indexOf(me.vaiTro) < 0) return sach_({ ok: false, msg: 'Không có quyền duyệt.' });
  if (!ss_().getSheetByName('YeuCauSuaHoSo')) return sach_({ ok: false, msg: 'Chưa có yêu cầu nào.' });

  var ds = doc_('YeuCauSuaHoSo').filter(function(y) { return String(y.TrangThai).trim() === 'Chờ duyệt'; });
  if (me.vaiTro === 'TP') ds = ds.filter(function(y) { return String(y.MaXuong) === String(me.xuong); });
  if (!ds.length) return sach_({ ok: false, msg: 'Không có yêu cầu nào đang chờ.' });

  var dem = 0;
  ds.forEach(function(yc) {
    var nv = doc_('NhanSu').filter(function(x) { return x.MaNV === yc.MaNV; })[0];
    if (!nv) return;
    [['DienThoai', yc.DienThoai, true], ['SoCCCD', yc.SoCCCD, true],
     ['DiaChi', yc.DiaChi, false], ['SdtKhanCap', yc.SdtKhanCap, true]].forEach(function(p) {
      if (String(p[1] || '').trim() !== '') {
        if (p[2]) suaOText_('NhanSu', nv._row, p[0], p[1]);
        else      suaO_('NhanSu', nv._row, p[0], p[1]);
      }
    });
    suaO_('YeuCauSuaHoSo', yc._row, 'TrangThai', 'Đã duyệt');
    suaO_('YeuCauSuaHoSo', yc._row, 'NguoiDuyet', me.ten);
    suaO_('YeuCauSuaHoSo', yc._row, 'NgayDuyet', new Date());
    dem++;
  });

  ghiLog_(me, 'Duyệt tất cả sửa hồ sơ', dem + ' yêu cầu');
  return sach_({ ok: true, msg: 'Đã duyệt và cập nhật ' + dem + ' hồ sơ.' });
}


/* ============================================================
   CHUẨN HÓA VĂN BẢN — thống nhất hoa/thường, khoảng trắng
   Áp dụng: Họ tên & Chức danh (Title Case an toàn); Tên máy & Tên công đoạn
   (chỉ dọn khoảng trắng, GIỮ NGUYÊN mã/viết tắt/gạch ngang).
   ============================================================ */

/* Dọn khoảng trắng cơ bản: NFC, bỏ trắng đầu/cuối, gộp nhiều dấu cách.
   KHÔNG đụng tới gạch ngang (giữ nguyên mã kỹ thuật như TẤM-DA-1.1-8-LỚP). */
function donKhoangTrang_(s) {
  if (s == null) return '';
  var t = String(s);
  try { t = t.normalize('NFC'); } catch (e) {}
  t = t.replace(/\s+/g, ' ').trim();
  return t;
}

/* Họ tên: viết hoa chữ cái đầu mỗi từ (Title Case). Hỗ trợ chữ có dấu.
   "LÊ THÀNH ĐẠT" -> "Lê Thành Đạt"; "vũ thị thúy" -> "Vũ Thị Thúy". */
function chuanHoaTen_(s) {
  var t = donKhoangTrang_(s);
  if (!t) return '';
  t = t.toLowerCase().replace(/(^|\s)(\S)/g, function (m, sep, ch) {
    return sep + ch.toUpperCase();
  });
  return t;
}

/* Chức danh: gom về danh mục chuẩn (an toàn nhất, tránh "Công Nhân").
   Không khớp danh mục thì chỉ viết hoa chữ cái đầu câu. */
function chuanHoaChucDanh_(s) {
  var t = donKhoangTrang_(s);
  if (!t) return '';
  var k = t.toLowerCase();
  var map = {
    'công nhân': 'Công nhân',
    'tổ trưởng': 'Tổ trưởng',
    'trưởng phòng': 'Trưởng phòng',
    'phó phòng': 'Phó phòng',
    'kỹ thuật': 'Kỹ thuật',
    'quản lý': 'Quản lý'
  };
  if (map[k]) return map[k];
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
}

/* Tên công đoạn: viết hoa chữ đầu mỗi từ NHƯNG giữ nguyên viết tắt kỹ thuật
   (CNC, GF, POM, ISO, UV, TIP, SX, FOAM, LOGO...) và các đoạn có chữ số/mã. */
var VIET_TAT_KYTHUAT_ = ['CNC','GF','SX','POM','TIP','ISO','UV','CB','PO','SP',
  'MIKA','CYCO','WRAP','LOGO','TIME','DA','FOAM','1T1Đ','RT','QL','WM','HQTECH'];
function chuanHoaTenCongDoan_(s) {
  if (s == null) return '';
  var t = String(s);
  try { t = t.normalize('NFC'); } catch (e) {}
  t = t.replace(/\s+/g, ' ').trim();
  var vt = {};
  VIET_TAT_KYTHUAT_.forEach(function(w){ vt[w.toUpperCase()] = w; });
  return t.replace(/([^\s\-\(\)\/\+,]+)/g, function(w) {
    if (vt[w.toUpperCase()]) return vt[w.toUpperCase()];   // giữ viết tắt
    if (/[0-9]/.test(w)) return w;                          // giữ đoạn có số/mã
    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  });
}

/* CÔNG CỤ (chạy MỘT LẦN trong trình soạn thảo Apps Script):
   Quét & chuẩn hóa các cột tên. KHÔNG đổi mã, không đổi dữ liệu khác.
   Chọn hàm này trên thanh công cụ, bấm Chạy, rồi xem Nhật ký (Ctrl+Enter). */
function CHUAN_HOA_TOAN_BO_TEN() {
  if (!noiBo_(arguments[0])) return chanWeb_('CHUAN_HOA_TOAN_BO_TEN');
  var ss = ss_();
  var tong = 0;
  // Họ tên -> Title Case
  tong += chuanHoaCot_(ss, 'NhanSu', 'HoTen', chuanHoaTen_);
  tong += chuanHoaCot_(ss, 'TaiKhoan', 'HoTen', chuanHoaTen_);
  // Chức danh -> danh mục chuẩn
  tong += chuanHoaCot_(ss, 'NhanSu', 'ChucDanh', chuanHoaChucDanh_);
  // Tên máy & tên công đoạn -> chỉ dọn khoảng trắng
  tong += chuanHoaCot_(ss, 'MayMoc', 'TenMay', donKhoangTrang_);
  tong += chuanHoaCot_(ss, 'CongDoan', 'TenCD', chuanHoaTenCongDoan_);
  Logger.log('Đã chuẩn hóa xong. Tổng số ô được sửa: ' + tong);
  return tong;
}

/* Chuẩn hóa một cột của một sheet bằng hàm fn. Trả về số ô đã đổi. */
function chuanHoaCot_(ss, tenSheet, tenCot, fn) {
  var sh = ss.getSheetByName(tenSheet);
  if (!sh) return 0;
  var lastRow = sh.getLastRow(), lastCol = sh.getLastColumn();
  if (lastRow < 2) return 0;
  var head = sh.getRange(1, 1, 1, lastCol).getValues()[0];
  var i = head.indexOf(tenCot);
  if (i < 0) return 0;
  var rng = sh.getRange(2, i + 1, lastRow - 1, 1);
  var vals = rng.getValues();
  var doi = 0;
  for (var r = 0; r < vals.length; r++) {
    var cu = vals[r][0];
    if (cu === '' || cu == null) continue;
    var moi = fn(cu);
    if (moi !== String(cu)) { vals[r][0] = moi; doi++; }
  }
  if (doi > 0) { rng.setValues(vals); xoaCache_(tenSheet); }
  Logger.log(tenSheet + '.' + tenCot + ': sửa ' + doi + ' ô.');
  return doi;
}



/* ============================================================
   KPI QUẢN LÝ (Trưởng phòng / Phó phòng)
   Trụ: Hiệu suất xưởng 40% + Tỷ lệ đạt xưởng 10% + Vận hành 40% + Nề nếp 10%
   PP tính lai: có sản lượng cá nhân -> 50% quản lý + 50% cá nhân.
   ============================================================ */

/* Ngày làm việc: bỏ Chủ nhật. Trả 'YYYY-MM-DD' cộng thêm n ngày làm việc. */
function themNgayLamViec_(ngayStr, n) {
  var s = ngayVN_(ngayStr), dem = 0, an = 0;
  while (dem < n && an < 90) {
    s = congNgay_(s, 1); an++;
    if (laNgayLamViec_(s)) dem++;          // bỏ Chủ nhật và ngày lễ chung
  }
  return s;
}

/* Số ngày làm việc (bỏ CN + ngày lễ) giữa 2 mốc yyyy-MM-dd, tính từ sau tuMoc đến denMoc. */
function soNgayLamViec_(tuStr, denStr) {
  if (!(denStr > tuStr)) return 0;
  var dem = 0;
  for (var s = congNgay_(tuStr, 1); s <= denStr; s = congNgay_(s, 1)) if (laNgayLamViec_(s)) dem++;
  return dem;
}

/* Nhớ KPI tháng của 1 người trong một lượt tính (KPI quản lý gọi lại nhiều lần cho cùng xưởng) */
function kpiThangNho_(maNV, ky, dt) {
  dt._nho = dt._nho || {};
  var key = maNV + '|' + ky;
  if (!(key in dt._nho)) dt._nho[key] = kpiThang_(maNV, ky, dt);
  return dt._nho[key];
}

/* Lấy họ tên nhân viên từ mã (dùng trong mô tả khoản trừ). */
function tenNV_(maNV, dt) {
  var nv = (dt.nhansu || []).filter(function(x){ return x.MaNV === maNV; })[0];
  return nv ? nv.HoTen : maNV;
}

/* Tính KPI quản lý cho một TP/PP trong 1 tháng (kyThang = 'YYYY-MM'). */
function kpiQuanLy_(maNV, maXuong, kyThang, dt) {
  var t = dt.trongso;

  /* ===== TRỤ 1: Hiệu suất & tỷ lệ đạt của xưởng ===== */
  // Trung bình KPI cá nhân của mọi nhân sự CN trong xưởng.
  dt.maQL = dt.maQL || mapQuanLy_();
  var nsXuong = dt.nhansu.filter(function(x){
    return x.MaXuong === maXuong && String(x.TrangThai).trim() !== 'Nghỉ việc' && !dt.maQL[String(x.MaNV).trim()];
  });
  var tongHS = 0, tongTL = 0, dem = 0;
  nsXuong.forEach(function(nv){
    var k = kpiThangNho_(nv.MaNV, kyThang, dt);
    if (k) { tongHS += k.sl; tongTL += k.cl; dem++; }
  });
  var hieuSuatXuong = dem ? tongHS / dem : 0;      // có thể >100 (bị chặn trần ở cá nhân)
  var tyLeDatXuong  = dem ? tongTL / dem : 100;

  /* ===== TRỤ 2: Vận hành (bắt đầu 100, trừ thẳng, sàn 0) ===== */
  var vh = 100;
  var chiTiet = { ddMuon:0, ddQuen:0, duyetTre:0, duyetAu:0, khongNhac:0 };

  // Danh sách ngày làm việc trong tháng ĐÃ KẾT THÚC (để xét điểm danh).
  // Ngày hôm nay chỉ được xét khi đã qua 17h (hết giờ làm) — tránh trừ "quên điểm danh"
  // ngay từ sáng sớm khi trưởng phòng chưa kịp điểm danh.
  var homNay = homNayVN_();
  var motChotDD = (gioVN_() >= 17) ? homNay : congNgay_(homNay, -1);
  var ngayLV = [];
  for (var s = kyThang + '-01'; s.slice(0, 7) === kyThang && s <= motChotDD; s = congNgay_(s, 1)) {
    // Chỉ xét ngày đã kết thúc; bỏ Chủ nhật, ngày lễ và ngày xưởng được miễn điểm danh
    if (laNgayLamViec_(s, maXuong)) ngayLV.push(s);
  }

  // Gom TẤT CẢ khoản trừ vào 1 mảng (mỗi khoản có id để Owner miễn trừ).
  // id = loai|maXuong|ngay|đốitượng. Nếu id nằm trong dt.mienKPI -> bỏ qua, không trừ.
  var mienKPI = dt.mienKPI || {};
  var khoanTru = [];
  var themKhoan = function(loai, ngay, doiTuong, tenLoai, diem){
    var id = loai + '|' + maXuong + '|' + ngay + '|' + (doiTuong||'');
    khoanTru.push({ id:id, loai:loai, tenLoai:tenLoai, ngay:ngay, doiTuong:doiTuong||'',
      diem:diem, daMien: !!mienKPI[id] });
  };

  // (a) Điểm danh: muộn (sau 9h) -5, quên -10
  var ddTheoNgay = {};
  (dt.xacNhanDD || []).forEach(function(r){
    if (String(r.MaXuong) !== String(maXuong)) return;
    var ng = ngayVN_(r.Ngay);
    if (!ng || ng.slice(0,7) !== kyThang) return;
    ddTheoNgay[ng] = r.ThoiDiem;
  });
  ngayLV.forEach(function(ng){
    if (!(ng in ddTheoNgay)) { themKhoan('ddQuen', ng, '', 'Quên điểm danh', 10); return; }
    var td = ddTheoNgay[ng];
    var gio = 9;
    try { gio = Number(Utilities.formatDate(new Date(td), TZ_VN, 'H')) + Number(Utilities.formatDate(new Date(td), TZ_VN, 'm'))/60; } catch(e){}
    if (gio >= 9) themKhoan('ddMuon', ng, '', 'Điểm danh muộn', 5);
  });

  // (b) Duyệt trễ: -2/công nhân (gộp theo người-ngày)
  var treSet = {};
  (dt.nhatkyXuong || []).forEach(function(r){
    var ng = ngayVN_(r.Ngay);
    if (!ng || ng.slice(0,7) !== kyThang) return;
    if (!r.ThoiDiemDuyet) return;
    var ngayDuyet = ngayVN_(r.ThoiDiemDuyet);
    if (!ngayDuyet) return;
    var han = themNgayLamViec_(ng, 2);
    if (ngayDuyet > han) treSet[r.MaNV + '|' + ng] = r.MaNV;
  });
  Object.keys(treSet).forEach(function(k){
    var mnv = treSet[k], ng = k.split('|')[1];
    themKhoan('duyetTre', ng, mnv, 'Duyệt trễ (' + tenNV_(mnv, dt) + ')', 2);
  });

  // (c) Duyệt ẩu: -2/dòng bị BĐH từ chối sau khi TP đã duyệt
  (dt.nhatkyXuong || []).forEach(function(r){
    var ng = ngayVN_(r.Ngay);
    if (!ng || ng.slice(0,7) !== kyThang) return;
    if (String(r.TrangThai).trim() !== 'Từ chối') return;
    if (String(r.NguoiNhap || '').indexOf('→ duyệt:') >= 0)
      themKhoan('duyetAu', ng, r.MaNV + '~' + r.MaCD, 'Duyệt ẩu (' + tenNV_(r.MaNV, dt) + ')', 2);
  });

  // (d) Không nhắc CN nhập: -2/lượt CN bị phạt trễ trong xưởng – chỉ lượt CN có vi phạm NHAPTRE cùng ngày (25/10)
  var coNhapTre = {};
  (dt.vipham || []).forEach(function(v){ if (String(v.MaVP).trim() === 'NHAPTRE') coNhapTre[v.MaNV + '|' + ngayVN_(v.Ngay)] = 1; });
  (dt.phatTre || []).forEach(function(p){
    if (String(p.MaXuong) !== String(maXuong)) return;
    var ng = ngayVN_(p.Ngay);
    if (ng.slice(0,7) !== kyThang) return;
    if (!coNhapTre[p.MaNV + '|' + ng]) return;
    themKhoan('khongNhac', ng, p.MaNV, 'Không nhắc CN nhập (' + tenNV_(p.MaNV, dt) + ')', 2);
  });

  // Trừ điểm những khoản CHƯA miễn; đếm chi tiết
  khoanTru.forEach(function(k){
    if (k.daMien) return;
    vh -= k.diem;
    if (k.loai === 'ddMuon') chiTiet.ddMuon++;
    else if (k.loai === 'ddQuen') chiTiet.ddQuen++;
    else if (k.loai === 'duyetTre') chiTiet.duyetTre++;
    else if (k.loai === 'duyetAu') chiTiet.duyetAu++;
    else if (k.loai === 'khongNhac') chiTiet.khongNhac++;
  });
  if (vh < 0) vh = 0;

  /* ===== TRỤ 3: Nề nếp (chuyên cần của chính TP/PP) ===== */
  var vpNguoi = (dt.vipham || []).filter(function(v){ return v.MaNV === maNV; })
    .filter(function(v){ var ng = ngayVN_(v.Ngay); return (!ng || ng.slice(0,7) === kyThang); });
  var neNep = diemNeNep_(maNV, 'ChuyenCan', dt.dmvp, vpNguoi);

  /* ===== TỔNG KPI QUẢN LÝ ===== */
  var kpiQL = hieuSuatXuong*0.40 + tyLeDatXuong*0.10 + vh*0.40 + neNep*0.10;

  /* ===== PP tính GIỐNG TP: thuần KPI quản lý =====
     PP vẫn có thể ghi nhận sản lượng (đào tạo / kèm công nhân mới), nhưng sản lượng đó
     KHÔNG đưa vào điểm KPI. Bỏ cơ chế tính lai 50/50 trước đây — PP và TP tính như nhau.
     caNhan vẫn được đọc để hiển thị tham khảo (kpiCaNhan), không ảnh hưởng tổng điểm. */
  var caNhan = kpiThang_(maNV, kyThang, dt);
  var kpiFinal = kpiQL, laLai = false;

  return {
    maNV: maNV, maXuong: maXuong,
    hieuSuatXuong: hieuSuatXuong, tyLeDatXuong: tyLeDatXuong,
    vanHanh: vh, neNep: neNep,
    kpiQuanLy: kpiQL, kpiCaNhan: caNhan ? caNhan.tong : null,
    laLai: laLai, tong: kpiFinal,
    chiTiet: chiTiet, khoanTru: khoanTru
  };
}

/* API: lấy KPI quản lý của một kỳ. ADMIN/OWNER -> tất cả; TP/PP -> cùng xưởng. */
function layKPIQuanLy(token, kyThang) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok:false, hetHan:true, msg:'Phiên đăng nhập đã hết hạn.' });
  return nho_('layKPIQuanLy', [kyThang || kyVN_(), me.vaiTro, me.xuong, me.laOwner], function() { return layKPIQuanLyGoc_(token, kyThang); });
}
function layKPIQuanLyGoc_(token, kyThang, meSan) {
  var me = meSan || docPhien_(token);
  if (!me) return sach_({ ok:false, hetHan:true, msg:'Phiên đăng nhập đã hết hạn.' });
  if (['ADMIN','TP'].indexOf(me.vaiTro) < 0)
    return sach_({ ok:false, msg:'Không có quyền xem KPI quản lý.' });

  kyThang = kyThang || kyVN_();

  // Chuẩn bị dữ liệu dùng chung
  var dt = docDuLieuKPI_(canLuuTru_([kyThang]));
  dt.congdoan = doc_('CongDoan');
  if (!dt.xacNhanDD) dt.xacNhanDD = ss_().getSheetByName('XacNhanDiemDanh') ? doc_('XacNhanDiemDanh') : [];
  dt.phatTre   = ss_().getSheetByName('PhatNhapTre') ? doc_('PhatNhapTre') : [];
  // Nạp các khoản KPI quản lý đã được Owner miễn trừ (theo id khoản)
  dt.mienKPI = {};
  if (ss_().getSheetByName('MienTruKPIQuanLy'))
    doc_('MienTruKPIQuanLy').forEach(function(m){ dt.mienKPI[String(m.IdKhoan)] = m.LyDo || 1; });
  var nkTat = dt.nhatky;

  // Danh sách TP/PP cần tính (từ TaiKhoan)
  var tks = doc_('TaiKhoan').filter(function(a){
    var vt = String(a.VaiTro).trim();
    return (vt === 'TP' || vt === 'PP') && a.MaNV;
  });

  // Lọc theo quyền
  if (me.vaiTro === 'TP') {
    tks = tks.filter(function(a){
      var nv = dt.nhansu.filter(function(x){ return x.MaNV === a.MaNV; })[0];
      return nv && String(nv.MaXuong) === String(me.xuong);
    });
  }

  // Gom nhật ký theo xưởng MỘT lần (trước đây lọc lại cho từng người -> chậm)
  var xuongCuaCD = {};
  dt.congdoan.forEach(function(c){ xuongCuaCD[c.MaCD] = String(c.MaXuong); });
  var nkTheoXuong = {};
  nkTat.forEach(function(r){
    var mx = xuongCuaCD[r.MaCD];
    if (mx) (nkTheoXuong[mx] = nkTheoXuong[mx] || []).push(r);
  });

  var ds = tks.map(function(a){
    var nv = dt.nhansu.filter(function(x){ return x.MaNV === a.MaNV; })[0];
    if (!nv) return null;
    // nhật ký của xưởng này (để tính duyệt trễ / duyệt ẩu)
    dt.nhatkyXuong = nkTheoXuong[String(nv.MaXuong)] || [];
    var k = kpiQuanLy_(nv.MaNV, nv.MaXuong, kyThang, dt);
    k.hoTen = nv.HoTen; k.vaiTro = String(a.VaiTro).trim();
    k.tenXuong = tenXuong_(nv.MaXuong);
    return k;
  }).filter(Boolean);

  // Xếp hạng trong từng xưởng theo tổng
  var theoXuong = {};
  ds.forEach(function(o){ (theoXuong[o.maXuong] = theoXuong[o.maXuong] || []).push(o); });
  Object.keys(theoXuong).forEach(function(mx){
    theoXuong[mx].sort(function(a,b){ return b.tong - a.tong; });
    theoXuong[mx].forEach(function(o,i){ o.hang = i+1; o.tongXuong = theoXuong[mx].length; });
  });
  ds.sort(function(a,b){ return b.tong - a.tong; });

  return sach_({ ok:true, ky:kyThang, ds:ds, laOwner: me.laOwner, vaiTro: me.vaiTro });
}

/* ===== MIỄN TRỪ KHOẢN KPI QUẢN LÝ (mọi loại trừ) — chỉ OWNER ===== */
function taoSheetMienTruKPI_() {
  var ss = ss_(), sh = ss.getSheetByName('MienTruKPIQuanLy');
  if (!sh) {
    sh = ss.insertSheet('MienTruKPIQuanLy');
    sh.getRange(1,1,1,5).setValues([['IdKhoan','MoTa','Ky','LyDo','NguoiTao']])
      .setFontWeight('bold').setBackground('#12313a').setFontColor('#ffffff');
    sh.setFrozenRows(1);
  }
  return sh;
}

/* OWNER: lấy toàn bộ khoản trừ của mọi TP/PP trong tháng, để chọn miễn/bỏ miễn. */
function layKhoanTruKPI(token, kyThang) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok:false, hetHan:true, msg:'Phiên đăng nhập đã hết hạn.' });
  if (!me.laOwner) return sach_({ ok:false, msg:'Chỉ chủ sở hữu.' });
  kyThang = kyThang || Utilities.formatDate(new Date(),'Asia/Ho_Chi_Minh','yyyy-MM');

  var kq = layKPIQuanLy(token, kyThang);
  var ds = (kq && kq.ds) || [];
  var out = [];
  ds.forEach(function(o){
    (o.khoanTru || []).forEach(function(k){
      out.push({ id:k.id, hoTen:o.hoTen, vaiTro:o.vaiTro, tenXuong:o.tenXuong,
        tenLoai:k.tenLoai, ngay:k.ngay, diem:k.diem, daMien:k.daMien });
    });
  });
  // sắp theo xưởng, ngày
  out.sort(function(a,b){ return (a.tenXuong+a.ngay).localeCompare(b.tenXuong+b.ngay); });
  return sach_({ ok:true, ky:kyThang, ds:out });
}

/* OWNER: miễn trừ hàng loạt. items = [{id, moTa}]. */
function mienTruKPINhieu(token, items, lyDo) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok:false, hetHan:true, msg:'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (!me.laOwner) return sach_({ ok:false, msg:'Chỉ chủ sở hữu.' });
  if (!items || !items.length) return sach_({ ok:false, msg:'Chưa chọn khoản nào.' });
  taoSheetMienTruKPI_();
  var ky = Utilities.formatDate(new Date(),'Asia/Ho_Chi_Minh','yyyy-MM');
  var daCo = {};
  doc_('MienTruKPIQuanLy').forEach(function(m){ daCo[String(m.IdKhoan)]=1; });
  var dem = 0;
  items.forEach(function(it){
    if (daCo[String(it.id)]) return;
    them_('MienTruKPIQuanLy', { IdKhoan: it.id, MoTa: it.moTa || '',
      Ky: (it.id.split('|')[2]||'').slice(0,7) || ky, LyDo: lyDo || 'Điều chỉnh', NguoiTao: me.ten });
    daCo[String(it.id)]=1; dem++;
  });
  ghiLog_(me, 'Miễn trừ KPI quản lý', dem + ' khoản (' + (lyDo||'điều chỉnh') + ')');
  return sach_({ ok:true, msg:'Đã miễn trừ '+dem+' khoản. KPI quản lý sẽ tự tính lại.' });
}

/* OWNER: bỏ miễn hàng loạt. items = [{id}]. */
function boMienTruKPINhieu(token, items) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok:false, hetHan:true, msg:'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (!me.laOwner) return sach_({ ok:false, msg:'Chỉ chủ sở hữu.' });
  if (!ss_().getSheetByName('MienTruKPIQuanLy')) return sach_({ ok:false, msg:'Chưa có dữ liệu.' });
  var can = {}; (items||[]).forEach(function(it){ can[String(it.id)]=1; });
  var rows = doc_('MienTruKPIQuanLy');
  var dem = 0;
  for (var i = rows.length-1; i >= 0; i--) {
    if (can[String(rows[i].IdKhoan)]) { xoaDong_('MienTruKPIQuanLy', rows[i]._row); dem++; }
  }
  ghiLog_(me, 'Bỏ miễn trừ KPI quản lý', dem + ' khoản');
  return sach_({ ok:true, msg:'Đã bỏ miễn '+dem+' khoản.' });
}

/* ============================================================
   PHẠT NHẬP TRỄ — chạy tự động mỗi ngày
   CN đi làm mà quá 17h ngày làm việc thứ 3 (bỏ CN) chưa nhập -> phạt.
   -10 nề nếp CN + -2 vận hành quản lý. Ghi vào sheet PhatNhapTre (không trừ trùng).
   ============================================================ */

function taoSheetPhatTre_() {
  var ss = ss_(), sh = ss.getSheetByName('PhatNhapTre');
  if (!sh) {
    sh = ss.insertSheet('PhatNhapTre');
    sh.getRange(1,1,1,6).setValues([['MaNV','HoTen','MaXuong','Ngay','ThoiDiemPhat','GhiChu']])
      .setFontWeight('bold').setBackground('#12313a').setFontColor('#ffffff');
    sh.setFrozenRows(1);
  }
  return sh;
}

/* Xây map các MaNV là cấp quản lý (TP/PP) — dùng chung cho phạt nhập trễ & lọc bảng KPI.
   Nhận diện theo HAI nguồn để không bỏ sót:
     (1) TaiKhoan.VaiTro là 'TP'/'PP' (và có MaNV);
     (2) NhanSu.ChucDanh chứa 'trưởng phòng'/'phó phòng'/'trưởng bộ phận'/'phó bộ phận'/'quản đốc'.
   Trả về object { MaNV: 1 }. */
function mapQuanLy_() {
  var maQL = {};
  doc_('TaiKhoan').forEach(function(a){
    var vt = String(a.VaiTro).trim();
    if ((vt === 'TP' || vt === 'PP') && a.MaNV) maQL[String(a.MaNV).trim()] = 1;
  });
  doc_('NhanSu').forEach(function(x){
    var cd = String(x.ChucDanh || '').toLowerCase();
    var laQL = (cd.indexOf('trưởng phòng') >= 0 || cd.indexOf('phó phòng') >= 0 ||
                cd.indexOf('trưởng bộ phận') >= 0 || cd.indexOf('phó bộ phận') >= 0 ||
                cd.indexOf('phó bp') >= 0 || cd.indexOf('quản đốc') >= 0);
    if (laQL && x.MaNV) maQL[String(x.MaNV).trim()] = 1;
  });
  return maQL;
}

/* Gỡ phạt nhập trễ tự động (PhatNhapTre + vi phạm NHAPTRE do hệ thống ghi) của những ngày hóa ra là ngày nghỉ:
   nghỉ cả ngày theo chấm công, nghỉ dài hạn, ngày lễ. Trả số lượt đã gỡ. Lỗi thì bỏ qua (không làm hỏng việc lưu). */
function goPhatNgayNghi_() {
  try {
    if (!ss_().getSheetByName('PhatNhapTre')) return 0;
    var phat = doc_('PhatNhapTre');
    var vp = ss_().getSheetByName('ViPham') ? doc_('ViPham').filter(function(v) {
      return v.MaVP === 'NHAPTRE' && (String(v.NguoiGhi || '').indexOf('Hệ thống') === 0 || String(v.GhiChu || '').indexOf('Tự động') === 0);
    }) : [];
    if (!phat.length && !vp.length) return 0;
    var cc = {}, ndh = {}, mx = {};
    docAnToan_('DiemDanhNghi').forEach(function(r) { cc[r.MaNV + '|' + ngayVN_(r.Ngay)] = khTuBanGhi_(r); });
    docAnToan_('NghiDaiHan').forEach(function(r) { (ndh[r.MaNV] = ndh[r.MaNV] || []).push({ tu: ngayVN_(r.TuNgay), den: ngayVN_(r.DenNgay) }); });
    nhanSuGomTP_().forEach(function(x) { mx[x.MaNV] = x.MaXuong; });
    var maQL = mapQuanLy_();
    var laNghi = function(maNV, ng, maXuong) {
      if (maQL[String(maNV).trim()]) return true;          // trưởng/phó phòng không phải nhập sản lượng
      if (!ng) return false;
      var kh = cc[maNV + '|' + ng];
      if (kh && gioCoMat_(kh) <= 0) return true;
      var d = ndh[maNV] || [];
      for (var i = 0; i < d.length; i++) if (d[i].tu <= ng && ng <= d[i].den) return true;
      return laNgayLe_(ng, maXuong || mx[maNV]);
    };
    var xoaP = phat.filter(function(p) { return laNghi(p.MaNV, ngayVN_(p.Ngay), p.MaXuong); }).map(function(p) { return p._row; });
    var xoaV = vp.filter(function(v) { return laNghi(v.MaNV, ngayVN_(v.Ngay)); }).map(function(v) { return v._row; });
    if (xoaP.length) xoaNhieuDong_('PhatNhapTre', xoaP);
    if (xoaV.length) xoaNhieuDong_('ViPham', xoaV);
    if (xoaP.length || xoaV.length) Logger.log('Gỡ phạt nhập trễ ngày nghỉ: ' + xoaP.length + ' lượt phạt, ' + xoaV.length + ' vi phạm.');
    return xoaP.length;
  } catch (e) { Logger.log('goPhatNgayNghi_: ' + e); return 0; }
}

/* Trigger: chạy mỗi ngày. Rà các ngày đã quá hạn, phạt CN chưa nhập. */
function chayPhatNhapTre() {
  if (!noiBo_(arguments[0])) return chanWeb_('chayPhatNhapTre');
  taoSheetPhatTre_();
  goPhatNgayNghi_();   // ngày nghỉ chấm muộn sau lần phạt trước -> gỡ (21/10)
  var dt = docDuLieuKPI_();
  var homNay = homNayVN_();
  var gioNay = gioVN_();

  // Trưởng/Phó phòng KHÔNG phải nhập sản lượng -> không xét phạt nhập trễ cho họ.
  var maQL = mapQuanLy_();

  // Ngày điểm danh của từng xưởng (xưởng có đi làm ngày đó)
  var xuongDD = {};
  docAnToan_('XacNhanDiemDanh').forEach(function(r){ xuongDD[r.MaXuong+'|'+ngayVN_(r.Ngay)] = 1; });

  // Đã nhập: MaNV|Ngay (mọi trạng thái, kể cả chờ duyệt/từ chối -> đã có nhập)
  var daNhap = {};
  dt.nhatky.forEach(function(r){ daNhap[r.MaNV+'|'+ngayVN_(r.Ngay)] = 1; });

  // 14 ngày gần nhất, bỏ Chủ nhật
  var ngays = [];
  for (var back = 0; back <= 14; back++) {
    var ng0 = congNgay_(homNay, -back);
    if (thuCua_(ng0) !== 0) ngays.push(ng0);
  }

  var daPhat = {};
  doc_('PhatNhapTre').forEach(function(p){ daPhat[p.MaNV+'|'+ngayVN_(p.Ngay)] = 1; });

  var phatMoi = [];
  dt.nhansu.forEach(function(nv){
    if (String(nv.TrangThai).trim() === 'Nghỉ việc' || String(nv.TrangThai).trim() === 'Tạm nghỉ') return;   // tạm nghỉ: không phải nhập (21/10)
    if (maQL[String(nv.MaNV).trim()]) return;
    var ndh = (dt.idxNDH && dt.idxNDH[nv.MaNV]) ? dt.idxNDH[nv.MaNV] : [];
    ngays.forEach(function(ng){
      var key = nv.MaNV+'|'+ng;
      if (daPhat[key] || daNhap[key]) return;                  // đã phạt / đã nhập
      if (!xuongDD[nv.MaXuong+'|'+ng]) return;                 // xưởng không đi làm ngày đó
      if (laNgayLe_(ng, nv.MaXuong)) return;                   // ngày lễ / xưởng được miễn
      if (dangHocViec_(nv.MaNV, ng)) return;                   // đang học việc (tháng đầu): không phạt (chủ dự án 18/10)
      for (var i=0;i<ndh.length;i++){ if (ndh[i].tu<=ng && ng<=ndh[i].den) return; }   // nghỉ dài hạn
      var kh = dt.idxCC ? dt.idxCC[key] : null;
      if (kh && gioCoMat_(kh) <= 0) return;                    // nghỉ cả ngày theo điểm danh
      // Hạn chót = 17h của ngày làm việc thứ 3 (ngày phát sinh là ngày 1)
      var han = themNgayLamViec_(ng, 2);
      if (!((homNay > han) || (homNay === han && gioNay >= 17))) return;
      phatMoi.push({ MaNV: nv.MaNV, HoTen: nv.HoTen, MaXuong: nv.MaXuong, Ngay: ng });
      daPhat[key] = 1;
    });
  });

  if (phatMoi.length) {
    khoa_();
    // Đọc lại sau khi khóa để chắc chắn không phạt trùng
    var daPhat2 = {};
    doc_('PhatNhapTre').forEach(function(p){ daPhat2[p.MaNV+'|'+ngayVN_(p.Ngay)] = 1; });
    phatMoi = phatMoi.filter(function(p){ return !daPhat2[p.MaNV+'|'+p.Ngay]; });
    damBaoMaViPhamNhapTre_();
    var now = new Date();
    themNhieu_('PhatNhapTre', phatMoi.map(function(p){
      return { MaNV:p.MaNV, HoTen:p.HoTen, MaXuong:p.MaXuong, Ngay:p.Ngay, ThoiDiemPhat:now,
               GhiChu:'Quá hạn nhập SL (17h ngày LV thứ 3)' };
    }));
    // Vi phạm nề nếp cho CN: -10 điểm (nhóm NeNep) — có mã ghi để xóa được từng dòng khi cần
    if (ss_().getSheetByName('ViPham')) themNhieu_('ViPham', phatMoi.map(function(p){
      return { MaGhi: ma_('VP'), Ngay: p.Ngay, MaNV: p.MaNV, MaVP: 'NHAPTRE',
               GhiChu: 'Tự động: quá hạn nhập SL', NguoiGhi: 'Hệ thống (tự động)', ThoiDiemGhi: now };
    }));
  }
  xong_();
  Logger.log('Đã phạt nhập trễ: ' + phatMoi.length + ' lượt.');
  return phatMoi.length;
}

/* Đảm bảo danh mục có mã vi phạm NHAPTRE (-10, nhóm NeNep) */
function damBaoMaViPhamNhapTre_() {
  if (!ss_().getSheetByName('DanhMucViPham')) return;
  var co = doc_('DanhMucViPham').some(function(x){ return x.MaVP === 'NHAPTRE'; });
  if (!co) them_('DanhMucViPham', { MaVP:'NHAPTRE', TenViPham:'Nhập sản lượng trễ hạn', Nhom:'NeNep', MucTru:10 });
}

/* Ghi 1 vi phạm nề nếp -10 điểm cho CN do nhập trễ (giữ lại cho tương thích). */
function themViPhamNhapTre_(maNV, ngay) {
  damBaoMaViPhamNhapTre_();
  if (ss_().getSheetByName('ViPham')) them_('ViPham', { MaGhi: ma_('VP'), MaNV:maNV, MaVP:'NHAPTRE', Ngay:ngay,
    GhiChu:'Tự động: quá hạn nhập SL', NguoiGhi:'Hệ thống (tự động)', ThoiDiemGhi:new Date() });
}

/* ===== CHẨN ĐOÁN 1 NGƯỜI: vì sao KPI quản lý bị trừ "không nhập sản lượng" — CHẠY MỘT LẦN =====
   Sửa biến MA_NV_CAN_KIEM bên dưới thành mã cần soi (VD 'C160'), chạy hàm, xem Logger.
   In ra: tài khoản (vai trò/MaNV) trong TaiKhoan, hồ sơ trong NhanSu, các dòng PhatNhapTre
   và vi phạm NHAPTRE của CHÍNH người này, và số lượt CN khác trong xưởng bị phạt trễ. */
function CHAN_DOAN_KPI_QL_MOT_NGUOI() {
  if (!noiBo_(arguments[0])) return chanWeb_('CHAN_DOAN_KPI_QL_MOT_NGUOI');
  var MA_NV_CAN_KIEM = 'C160';   // <-- ĐỔI mã ở đây nếu cần

  var L = [];
  L.push('=== CHẨN ĐOÁN KPI QUẢN LÝ cho MaNV = ' + MA_NV_CAN_KIEM + ' ===');

  // 1) Tài khoản trong TaiKhoan có MaNV này (hoặc tên gần đúng)
  var tks = doc_('TaiKhoan');
  var tkKhop = tks.filter(function(a){ return String(a.MaNV).trim() === MA_NV_CAN_KIEM; });
  if (!tkKhop.length) {
    L.push('[TaiKhoan] KHÔNG có tài khoản nào gắn MaNV="' + MA_NV_CAN_KIEM + '".');
    L.push('   -> Đây có thể là lý do: hàm lọc TP/PP dựa vào cột MaNV trong TaiKhoan.');
  } else {
    tkKhop.forEach(function(a){
      L.push('[TaiKhoan] TenDangNhap=' + a.TenDangNhap + ' | VaiTro="' + String(a.VaiTro).trim() +
        '" | MaNV="' + String(a.MaNV).trim() + '" | MaXuong=' + a.MaXuong + ' | TrangThai=' + a.TrangThai);
      var vt = String(a.VaiTro).trim();
      if (vt !== 'TP' && vt !== 'PP')
        L.push('   -> VaiTro KHÔNG phải TP/PP => hệ thống coi là công nhân => VẪN bị phạt nhập trễ. ĐÂY LÀ NGUYÊN NHÂN.');
    });
  }

  // 1b) Có tài khoản nào tên chứa "Lâm" để đối chiếu không (giúp tìm nếu MaNV lệch)
  var theoTen = tks.filter(function(a){ return String(a.HoTen||'').toLowerCase().indexOf('lâm') >= 0; });
  theoTen.forEach(function(a){
    L.push('[TaiKhoan~tên] ' + a.HoTen + ' | VaiTro=' + String(a.VaiTro).trim() + ' | MaNV="' + String(a.MaNV).trim() + '"');
  });

  // 2) Hồ sơ trong NhanSu
  var ns = doc_('NhanSu').filter(function(x){ return String(x.MaNV).trim() === MA_NV_CAN_KIEM; });
  if (!ns.length) L.push('[NhanSu] KHÔNG có hồ sơ MaNV="' + MA_NV_CAN_KIEM + '".');
  else ns.forEach(function(x){
    L.push('[NhanSu] HoTen=' + x.HoTen + ' | ChucDanh="' + x.ChucDanh + '" | MaXuong=' + x.MaXuong + ' | TrangThai=' + x.TrangThai);
  });

  // 3) Dòng PhatNhapTre của CHÍNH người này (phạt oan nếu là TP/PP)
  var phat = (ss_().getSheetByName('PhatNhapTre') ? doc_('PhatNhapTre') : [])
    .filter(function(pp){ return String(pp.MaNV).trim() === MA_NV_CAN_KIEM; });
  L.push('[PhatNhapTre] Số dòng phạt của chính người này: ' + phat.length);
  phat.forEach(function(pp){ L.push('   - ngày ' + ngayVN_(pp.Ngay) + ' | ' + (pp.GhiChu||'')); });

  // 4) Vi phạm NHAPTRE của chính người này
  var vp = (ss_().getSheetByName('ViPham') ? doc_('ViPham') : [])
    .filter(function(v){ return String(v.MaNV).trim() === MA_NV_CAN_KIEM && String(v.MaVP) === 'NHAPTRE'; });
  L.push('[ViPham NHAPTRE] Số vi phạm nhập trễ của chính người này: ' + vp.length);

  // 5) Số lượt CN KHÁC trong cùng xưởng bị phạt trễ (khoản khongNhac -2/lượt là ĐÚNG thiết kế)
  var maXuong = (ns[0] && ns[0].MaXuong) || (tkKhop[0] && tkKhop[0].MaXuong) || '';
  if (maXuong) {
    var phatXuong = (ss_().getSheetByName('PhatNhapTre') ? doc_('PhatNhapTre') : [])
      .filter(function(pp){ return String(pp.MaXuong) === String(maXuong) && String(pp.MaNV).trim() !== MA_NV_CAN_KIEM; });
    L.push('[Xưởng ' + maXuong + '] Số lượt phạt trễ của NGƯỜI KHÁC trong xưởng: ' + phatXuong.length +
      ' (mỗi lượt trừ 2đ vận hành của TP/PP — ĐÚNG thiết kế "không nhắc CN nhập").');
  }

  Logger.log(L.join('\n'));
  return L.join('\n');
}

/* ===== DỌN PHẠT NHẬP TRỄ ĐÃ GHI OAN CHO TRƯỞNG/PHÓ PHÒNG — CHẠY MỘT LẦN =====
   Trước đây chayPhatNhapTre() vô tình phạt cả TP/PP (dù comment nói không phạt).
   Hàm này xóa các dòng phạt oan còn tồn trong sheet PhatNhapTre và các vi phạm
   NHAPTRE tương ứng trong sheet ViPham, để KPI quản lý của TP/PP thôi bị trừ.
   An toàn: chỉ đụng tới MaNV là TP/PP (theo sheet TaiKhoan), không đụng công nhân.
   Chạy trực tiếp trong trình soạn thảo Apps Script, rồi xem Nhật ký (Logger). */
function DON_PHAT_NHAP_TRE_TP_PP() {
  if (!noiBo_(arguments[0])) return chanWeb_('DON_PHAT_NHAP_TRE_TP_PP');
  // Tập MaNV của TP/PP (theo cả TaiKhoan lẫn ChucDanh trong NhanSu)
  var maQL = mapQuanLy_();

  var soPhat = 0, soVP = 0;

  // 1) Xóa trong PhatNhapTre (xóa từ dưới lên để không lệch dòng)
  var shPhat = ss_().getSheetByName('PhatNhapTre');
  if (shPhat) {
    var rowsPhat = doc_('PhatNhapTre');
    for (var i = rowsPhat.length - 1; i >= 0; i--) {
      if (maQL[String(rowsPhat[i].MaNV)]) { xoaDong_('PhatNhapTre', rowsPhat[i]._row); soPhat++; }
    }
  }

  // 2) Xóa vi phạm NHAPTRE của TP/PP trong ViPham
  var shVP = ss_().getSheetByName('ViPham');
  if (shVP) {
    var rowsVP = doc_('ViPham');
    for (var j = rowsVP.length - 1; j >= 0; j--) {
      if (String(rowsVP[j].MaVP) === 'NHAPTRE' && maQL[String(rowsVP[j].MaNV)]) {
        xoaDong_('ViPham', rowsVP[j]._row); soVP++;
      }
    }
  }

  // Ghi nhật ký hệ thống
  try {
    var shLog = ss_().getSheetByName('NhatKyThaoTac');
    if (shLog) shLog.appendRow([new Date(),'HE_THONG','Dọn phạt nhập trễ oan (TP/PP)',
      'Xóa '+soPhat+' dòng PhatNhapTre, '+soVP+' vi phạm NHAPTRE','','']);
  } catch(e){}

  tangPhienBan_();
  Logger.log('Đã dọn: '+soPhat+' dòng PhatNhapTre, '+soVP+' vi phạm NHAPTRE của TP/PP.');
  return { phat: soPhat, vipham: soVP };
}

/* Cài đặt trigger chạy mỗi ngày lúc ~18h. Chạy MỘT LẦN. */
function CAI_TRIGGER_PHAT_TRE() {
  if (!noiBo_(arguments[0])) return chanWeb_('CAI_TRIGGER_PHAT_TRE');
  ScriptApp.getProjectTriggers().forEach(function(t){
    if (t.getHandlerFunction()==='chayPhatNhapTre') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('chayPhatNhapTre').timeBased().atHour(18).everyDays(1)
    .inTimezone(TZ_VN).create();
  Logger.log('Đã cài trigger phạt nhập trễ (18h mỗi ngày).');
}

/* ===== MÁY MÓC ===== */
function luuMay(token, o) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (['ADMIN', 'TP'].indexOf(me.vaiTro) < 0) return sach_({ ok: false, msg: 'Không có quyền.' });
  if (!o.MaMay || !o.TenMay) return sach_({ ok: false, msg: 'Cần mã máy và tên máy.' });
  o.MaMay = String(o.MaMay).trim();
  if (!MA_HOP_LE.test(o.MaMay)) return sach_({ ok: false, msg: 'Mã máy chỉ gồm chữ không dấu, số và dấu _ . - (tối đa 20 ký tự).' });
  if (String(o.TenMay).length > 100) return sach_({ ok: false, msg: 'Tên máy tối đa 100 ký tự.' });
  if (doc_('MayMoc').filter(function(x) { return x.MaMay === o.MaMay; })[0])
    return sach_({ ok: false, msg: 'Mã máy đã tồn tại.' });

  them_('MayMoc', {
    MaMay: o.MaMay, TenMay: donKhoangTrang_(o.TenMay),
    MaXuong: (me.vaiTro === 'TP') ? me.xuong : o.MaXuong,
    ChungLoai: o.ChungLoai || '', NamSuDung: o.NamSuDung || '',
    TinhTrang: 'Hoạt động', BaoTriKeTiep: o.BaoTriKeTiep || '', NguoiTao: me.ten
  });
  ghiLog_(me, 'Thêm máy', o.MaMay + ' — ' + o.TenMay);
  return sach_({ ok: true, msg: 'Đã lưu máy.' });
}

function doiTinhTrangMay(token, maMay, tt) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (['ADMIN', 'TP'].indexOf(me.vaiTro) < 0) return sach_({ ok: false, msg: 'Không có quyền.' });

  var m = doc_('MayMoc').filter(function(x) { return x.MaMay === maMay; })[0];
  if (!m) return sach_({ ok: false, msg: 'Không tìm thấy máy.' });
  if (me.vaiTro === 'TP' && m.MaXuong !== me.xuong) return sach_({ ok: false, msg: 'Máy không thuộc xưởng của bạn.' });

  suaO_('MayMoc', m._row, 'TinhTrang', tt);
  ghiLog_(me, 'Đổi tình trạng máy', maMay, m.TinhTrang, tt);
  return sach_({ ok: true, msg: 'Đã cập nhật.' });
}

/* Thanh lý máy: ẩn khỏi danh sách nhưng giữ nguyên dữ liệu nhật ký cũ.
   Truyền khoiPhuc = true để đưa máy đã thanh lý trở về Hoạt động. */
function thanhLyMay(token, maMay, khoiPhuc) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (['ADMIN', 'TP'].indexOf(me.vaiTro) < 0) return sach_({ ok: false, msg: 'Không có quyền.' });

  var m = doc_('MayMoc').filter(function(x) { return x.MaMay === maMay; })[0];
  if (!m) return sach_({ ok: false, msg: 'Không tìm thấy máy.' });
  if (me.vaiTro === 'TP' && m.MaXuong !== me.xuong)
    return sach_({ ok: false, msg: 'Máy không thuộc xưởng của bạn.' });

  var moi = khoiPhuc ? 'Hoạt động' : 'Thanh lý';
  suaO_('MayMoc', m._row, 'TinhTrang', moi);
  ghiLog_(me, khoiPhuc ? 'Khôi phục máy' : 'Thanh lý máy', maMay, m.TinhTrang, moi);
  return sach_({ ok: true, msg: khoiPhuc
    ? 'Đã khôi phục "' + m.TenMay + '" về Hoạt động.'
    : 'Đã thanh lý "' + m.TenMay + '". Máy được ẩn khỏi danh sách, dữ liệu cũ vẫn giữ nguyên.' });
}

/* Lấy danh sách máy đã thanh lý — để ADMIN/TP xem lại và khôi phục khi cần */
function mayThanhLy(token) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (['ADMIN', 'TP'].indexOf(me.vaiTro) < 0) return sach_({ ok: false, msg: 'Không có quyền.' });

  var ds = doc_('MayMoc').filter(function(x) { return String(x.TinhTrang).trim() === 'Thanh lý'; });
  if (me.vaiTro === 'TP') ds = ds.filter(function(x) { return x.MaXuong === me.xuong; });

  return sach_({ ok: true, maymoc: ds.map(function(x) {
    return { MaMay: x.MaMay, TenMay: x.TenMay, MaXuong: x.MaXuong,
             ChungLoai: x.ChungLoai, NamSuDung: x.NamSuDung, BaoTriKeTiep: ngayVN_(x.BaoTriKeTiep) };
  }) });
}

/* ===== ĐỀ XUẤT ĐỊNH MỨC ===== */
function guiDeXuat(token, o) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (me.vaiTro !== 'TP') return sach_({ ok: false, msg: 'Chỉ trưởng phòng gửi đề xuất.' });
  if (!o.LyDo || String(o.LyDo).length < 10) return sach_({ ok: false, msg: 'Cần nêu lý do cụ thể, ít nhất 10 ký tự.' });
  if (!(Number(o.DinhMucMoi) > 0)) return sach_({ ok: false, msg: 'Định mức phải lớn hơn 0.' });

  var trung = doc_('DeXuatDinhMuc').filter(function(x) {
    return x.MaCD === o.MaCD && x.TrangThai === 'Chờ duyệt';
  })[0];
  if (trung) return sach_({ ok: false, msg: 'Công đoạn này đã có đề xuất đang chờ duyệt.' });

  var cd = doc_('CongDoan').filter(function(x) { return x.MaCD === o.MaCD; })[0];
  if (!cd) return sach_({ ok: false, msg: 'Không tìm thấy công đoạn.' });
  if (cd.MaXuong !== me.xuong) return sach_({ ok: false, msg: 'Công đoạn không thuộc xưởng của bạn.' });

  var cu = doc_('DinhMuc').filter(function(x) { return x.MaCD === o.MaCD; })[0];

  them_('DeXuatDinhMuc', {
    MaDX: ma_('DX'), NgayDeXuat: new Date(), NguoiDeXuat: me.ten, MaXuong: me.xuong,
    MaCD: o.MaCD, DinhMucCu: cu ? cu.DinhMucGio : 0,
    DinhMucMoi: Number(o.DinhMucMoi), DonViTinh: o.DonViTinh || 'cái/giờ',
    LyDo: o.LyDo, TrangThai: 'Chờ duyệt'
  });
  ghiLog_(me, 'Gửi đề xuất định mức', cd.TenCD, cu ? cu.DinhMucGio : 'chưa có', o.DinhMucMoi);
  return sach_({ ok: true, msg: 'Đã gửi đề xuất. Ban điều hành sẽ xem xét.' });
}

function duyetDeXuat(token, maDX, dongY, ghiChu) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (me.vaiTro !== 'ADMIN') return sach_({ ok: false, msg: 'Chỉ ban điều hành được duyệt.' });

  var dx = doc_('DeXuatDinhMuc').filter(function(x) { return x.MaDX === maDX; })[0];
  if (!dx) return sach_({ ok: false, msg: 'Không tìm thấy đề xuất.' });
  if (dx.TrangThai !== 'Chờ duyệt') return sach_({ ok: false, msg: 'Đề xuất này đã được xử lý.' });

  suaO_('DeXuatDinhMuc', dx._row, 'TrangThai', dongY ? 'Đã duyệt' : 'Từ chối');
  suaO_('DeXuatDinhMuc', dx._row, 'NguoiDuyet', me.ten);
  suaO_('DeXuatDinhMuc', dx._row, 'NgayDuyet', new Date());
  suaO_('DeXuatDinhMuc', dx._row, 'GhiChuDuyet', ghiChu || '');

  if (dongY) {
    var dm = doc_('DinhMuc').filter(function(x) { return x.MaCD === dx.MaCD; })[0];
    if (dm) {
      suaO_('DinhMuc', dm._row, 'DinhMucGio', dx.DinhMucMoi);
      suaO_('DinhMuc', dm._row, 'DonViTinh', dx.DonViTinh || 'cái/giờ');
      suaO_('DinhMuc', dm._row, 'HieuLucTu', ngayApDM_());
      suaO_('DinhMuc', dm._row, 'NguoiDuyet', me.ten);
      suaO_('DinhMuc', dm._row, 'GhiChu', dx.LyDo);
    } else {
      them_('DinhMuc', {
        MaCD: dx.MaCD, DinhMucGio: dx.DinhMucMoi, DonViTinh: dx.DonViTinh || 'cái/giờ',
        HieuLucTu: ngayApDM_(), NguoiDuyet: me.ten, GhiChu: dx.LyDo
      });
    }
  }

  ghiLog_(me, dongY ? 'Duyệt định mức' : 'Từ chối định mức',
          dx.MaCD, dx.DinhMucCu, dx.DinhMucMoi);
  return sach_({ ok: true, msg: dongY ? nhacChotBuDM_('Đã duyệt và cập nhật định mức.') : 'Đã từ chối đề xuất.' });
}

/* Duyệt TẤT CẢ đề xuất đang "Chờ duyệt" trong một lần gọi. Chỉ ADMIN. */
function duyetTatCaDeXuat(token) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (me.vaiTro !== 'ADMIN') return sach_({ ok: false, msg: 'Chỉ ban điều hành được duyệt.' });

  var cho = doc_('DeXuatDinhMuc').filter(function(x) { return x.TrangThai === 'Chờ duyệt'; });
  if (!cho.length) return sach_({ ok: false, msg: 'Không có đề xuất nào đang chờ.' });

  var dinhmuc = doc_('DinhMuc');
  var n = 0;
  cho.forEach(function(dx) {
    suaO_('DeXuatDinhMuc', dx._row, 'TrangThai', 'Đã duyệt');
    suaO_('DeXuatDinhMuc', dx._row, 'NguoiDuyet', me.ten);
    suaO_('DeXuatDinhMuc', dx._row, 'NgayDuyet', new Date());
    suaO_('DeXuatDinhMuc', dx._row, 'GhiChuDuyet', 'Duyệt hàng loạt');

    var dm = dinhmuc.filter(function(x) { return x.MaCD === dx.MaCD; })[0];
    if (dm) {
      suaO_('DinhMuc', dm._row, 'DinhMucGio', dx.DinhMucMoi);
      suaO_('DinhMuc', dm._row, 'DonViTinh', dx.DonViTinh || 'cái/giờ');
      suaO_('DinhMuc', dm._row, 'HieuLucTu', ngayApDM_());
      suaO_('DinhMuc', dm._row, 'NguoiDuyet', me.ten);
      suaO_('DinhMuc', dm._row, 'GhiChu', dx.LyDo);
    } else {
      them_('DinhMuc', {
        MaCD: dx.MaCD, DinhMucGio: dx.DinhMucMoi, DonViTinh: dx.DonViTinh || 'cái/giờ',
        HieuLucTu: ngayApDM_(), NguoiDuyet: me.ten, GhiChu: dx.LyDo
      });
    }
    n++;
  });

  ghiLog_(me, 'Duyệt tất cả định mức', n + ' đề xuất', '', '');
  return sach_({ ok: true, msg: nhacChotBuDM_('Đã duyệt tất cả ' + n + ' đề xuất và cập nhật định mức.') });
}

/* ===== ĐỊNH MỨC & CÔNG ĐOẠN ===== */
function luuDinhMuc(token, o) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (me.vaiTro !== 'ADMIN') return sach_({ ok: false, msg: 'Chỉ ban điều hành sửa định mức trực tiếp.' });
  if (!(Number(o.DinhMucGio) > 0)) return sach_({ ok: false, msg: 'Định mức phải lớn hơn 0.' });

  var dm = doc_('DinhMuc').filter(function(x) { return x.MaCD === o.MaCD; })[0];
  if (dm) {
    ghiLog_(me, 'Sửa định mức', o.MaCD, dm.DinhMucGio, o.DinhMucGio);
    suaO_('DinhMuc', dm._row, 'DinhMucGio', Number(o.DinhMucGio));
    suaO_('DinhMuc', dm._row, 'DonViTinh', o.DonViTinh || 'cái/giờ');
    suaO_('DinhMuc', dm._row, 'HieuLucTu', ngayApDM_());
    suaO_('DinhMuc', dm._row, 'NguoiDuyet', me.ten);
  } else {
    them_('DinhMuc', {
      MaCD: o.MaCD, DinhMucGio: Number(o.DinhMucGio), DonViTinh: o.DonViTinh || 'cái/giờ',
      HieuLucTu: ngayApDM_(), NguoiDuyet: me.ten, GhiChu: 'Thêm mới'
    });
    ghiLog_(me, 'Thêm định mức', o.MaCD, '', o.DinhMucGio);
  }
  return sach_({ ok: true, msg: nhacChotBuDM_('Đã lưu định mức.') });
}

function luuCongDoan(token, o) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (['ADMIN', 'TP'].indexOf(me.vaiTro) < 0) return sach_({ ok: false, msg: 'Không có quyền.' });

  var maCD = String(o.MaCD || '').trim().toUpperCase();
  if (!maCD || !o.TenCD) return sach_({ ok: false, msg: 'Cần mã và tên công đoạn.' });
  if (!/^[A-Z0-9\-_]+$/.test(maCD))
    return sach_({ ok: false, msg: 'Mã công đoạn chỉ dùng chữ in hoa, số, gạch ngang.' });
  if (doc_('CongDoan').filter(function(x) { return String(x.MaCD).toUpperCase() === maCD; })[0])
    return sach_({ ok: false, msg: 'Mã công đoạn đã tồn tại.' });

  // Trưởng phòng chỉ thêm được cho xưởng mình
  var xuong = (me.vaiTro === 'TP') ? me.xuong : o.MaXuong;
  if (!xuong) return sach_({ ok: false, msg: 'Chưa chọn xưởng.' });

  them_('CongDoan', {
    MaCD: maCD, TenCD: chuanHoaTenCongDoan_(o.TenCD), MaXuong: xuong,
    CachCham: o.CachCham || 'CN', TrangThai: 'Đang dùng'
  });
  ghiLog_(me, 'Thêm công đoạn', maCD + ' — ' + o.TenCD);
  return sach_({ ok: true, msg: 'Đã thêm công đoạn "' + o.TenCD + '". Bước tiếp: gửi định mức lên ban điều hành duyệt.' });
}

/* Sửa công đoạn đã có: tên + định mức (chỉ ADMIN) */
function suaCongDoan(token, maCD, tenMoi, dinhMucMoi, dvtMoi) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (me.vaiTro !== 'ADMIN') return sach_({ ok: false, msg: 'Chỉ ban điều hành mới sửa công đoạn.' });

  var c = doc_('CongDoan').filter(function(x) { return x.MaCD === maCD; })[0];
  if (!c) return sach_({ ok: false, msg: 'Không tìm thấy công đoạn.' });

  var thayDoi = [];
  // Sửa tên
  if (tenMoi !== undefined && tenMoi !== null && String(tenMoi).trim() && String(tenMoi).trim() !== c.TenCD) {
    var tenCu = c.TenCD;
    var tenCH = chuanHoaTenCongDoan_(tenMoi);
    suaO_('CongDoan', c._row, 'TenCD', tenCH);
    thayDoi.push('tên: "' + tenCu + '" → "' + tenCH + '"');
  }
  // Sửa định mức (ghi đè bản hiện tại, hoặc tạo mới nếu chưa có)
  if (dinhMucMoi !== undefined && dinhMucMoi !== null && dinhMucMoi !== '') {
    var dmMoi = Number(dinhMucMoi);
    if (!(dmMoi > 0)) return sach_({ ok: false, msg: 'Định mức phải lớn hơn 0.' });
    var dv = dvtMoi || 'cái/giờ';
    var dmCu = doc_('DinhMuc').filter(function(x) { return x.MaCD === maCD; })[0];
    if (dmCu) {
      suaO_('DinhMuc', dmCu._row, 'DinhMucGio', dmMoi);
      suaO_('DinhMuc', dmCu._row, 'DonViTinh', dv);
      suaO_('DinhMuc', dmCu._row, 'HieuLucTu', ngayApDM_());
      suaO_('DinhMuc', dmCu._row, 'NguoiDuyet', me.ten);
      if (Number(dmCu.DinhMucGio) !== dmMoi) thayDoi.push('định mức: ' + dmCu.DinhMucGio + ' → ' + dmMoi + ' ' + dv);
    } else {
      them_('DinhMuc', {
        MaDM: ma_('DM'), MaCD: maCD, DinhMucGio: dmMoi, DonViTinh: dv,
        HieuLucTu: ngayApDM_(), NguoiDuyet: me.ten
      });
      thayDoi.push('đặt định mức: ' + dmMoi + ' ' + dv);
    }
  }

  if (!thayDoi.length) return sach_({ ok: true, msg: 'Không có thay đổi nào.' });
  ghiLog_(me, 'Sửa công đoạn', maCD + ' — ' + thayDoi.join('; '));
  return sach_({ ok: true, msg: (thayDoi.join(' ').indexOf('định mức') >= 0 ? nhacChotBuDM_ : String)('Đã cập nhật công đoạn (' + thayDoi.length + ' thay đổi).') });
}

/* Ngừng hoặc dùng lại công đoạn — không xóa hẳn để giữ nguyên dữ liệu nhật ký cũ */
function doiTrangThaiCongDoan(token, maCD) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (['ADMIN', 'TP'].indexOf(me.vaiTro) < 0) return sach_({ ok: false, msg: 'Không có quyền.' });

  var c = doc_('CongDoan').filter(function(x) { return x.MaCD === maCD; })[0];
  if (!c) return sach_({ ok: false, msg: 'Không tìm thấy công đoạn.' });
  if (me.vaiTro === 'TP' && c.MaXuong !== me.xuong)
    return sach_({ ok: false, msg: 'Công đoạn không thuộc xưởng của bạn.' });

  var moi = String(c.TrangThai).trim() === 'Đang dùng' ? 'Ngừng' : 'Đang dùng';
  suaO_('CongDoan', c._row, 'TrangThai', moi);
  ghiLog_(me, 'Đổi trạng thái công đoạn', maCD, c.TrangThai, moi);
  return sach_({ ok: true, msg: 'Đã chuyển "' + c.TenCD + '" sang: ' + moi +
    (moi === 'Ngừng' ? '. Dữ liệu nhật ký cũ vẫn giữ nguyên.' : '') });
}

/* Sửa cách chấm KPI của công đoạn — cá nhân hay theo tổ */
function doiCachCham(token, maCD, cach) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (['ADMIN', 'TP'].indexOf(me.vaiTro) < 0) return sach_({ ok: false, msg: 'Không có quyền.' });
  if (['CN', 'TO'].indexOf(cach) < 0) return sach_({ ok: false, msg: 'Giá trị không hợp lệ.' });

  var c = doc_('CongDoan').filter(function(x) { return x.MaCD === maCD; })[0];
  if (!c) return sach_({ ok: false, msg: 'Không tìm thấy công đoạn.' });
  if (me.vaiTro === 'TP' && c.MaXuong !== me.xuong)
    return sach_({ ok: false, msg: 'Công đoạn không thuộc xưởng của bạn.' });

  suaO_('CongDoan', c._row, 'CachCham', cach);
  ghiLog_(me, 'Đổi cách chấm KPI', c.TenCD, c.CachCham, cach);
  return sach_({ ok: true, msg: 'Đã đổi sang: ' + (cach === 'CN' ? 'Cá nhân' : 'Theo tổ') });
}

/* ===== TRỌNG SỐ ===== */
function luuTrongSo(token, o) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (me.vaiTro !== 'ADMIN') return sach_({ ok: false, msg: 'Chỉ ban điều hành đổi trọng số.' });

  if (!/^\d{4}-\d{2}$/.test(String(o.KyApDung || ''))) return sach_({ ok: false, msg: 'Kỳ áp dụng phải dạng năm-tháng, VD 2026-10.' });
  var t = Number(o.SanLuong) + Number(o.ChatLuong) + Number(o.TuanThu) + Number(o.AnToan);
  if (t !== 100) return sach_({ ok: false, msg: 'Tổng trọng số phải bằng 100%. Hiện tại: ' + t + '%' });

  them_('TrongSoKPI', {
    KyApDung: o.KyApDung, SanLuong: Number(o.SanLuong), ChatLuong: Number(o.ChatLuong),
    TuanThu: Number(o.TuanThu), AnToan: Number(o.AnToan),
    TranKPI: Number(o.TranKPI), TyTrongTo: Number(o.TyTrongTo),
    NguoiCapNhat: me.ten, ThoiDiem: new Date()
  });
  ghiLog_(me, 'Đổi trọng số KPI', 'Kỳ ' + o.KyApDung, '',
          'SL' + o.SanLuong + ' CL' + o.ChatLuong + ' TT' + o.TuanThu + ' AT' + o.AnToan);
  return sach_({ ok: true, msg: 'Đã lưu trọng số cho kỳ ' + o.KyApDung + '.' });
}

/* ===== QUẢN LÝ TÀI KHOẢN ===== */
function napTaiKhoan(token) {
  var me = docPhien_(token);
  if (!me || !me.laOwner) return [];
  return sach_(doc_('TaiKhoan').map(function(x) {
    return {
      TenDangNhap: x.TenDangNhap, HoTen: x.HoTen, VaiTro: x.VaiTro,
      MaXuong: x.MaXuong, TrangThai: x.TrangThai, MaNV: x.MaNV || '',
      DoiMatKhauLanDau: x.DoiMatKhauLanDau,
      LanDangNhapCuoi: x.LanDangNhapCuoi ? String(x.LanDangNhapCuoi).slice(0, 19).replace('T', ' ') : ''
    };
  }));
}

function taoTaiKhoan(token, o) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (me.vaiTro !== 'ADMIN') return sach_({ ok: false, msg: 'Chỉ ban điều hành tạo tài khoản.' });
  if (!me.laOwner) return sach_({ ok: false, msg: 'Chỉ chủ sở hữu được tạo tài khoản.' });

  var tk = String(o.TenDangNhap || '').trim().toLowerCase();
  if (!tk || tk.length < 3) return sach_({ ok: false, msg: 'Tên đăng nhập phải từ 3 ký tự.' });
  if (!/^[a-z0-9_.]+$/.test(tk)) return sach_({ ok: false, msg: 'Tên đăng nhập chỉ dùng chữ thường, số, dấu chấm và gạch dưới.' });
  if (!o.HoTen) return sach_({ ok: false, msg: 'Cần họ tên.' });
  if (doc_('TaiKhoan').filter(function(x) { return String(x.TenDangNhap).toLowerCase() === tk; })[0])
    return sach_({ ok: false, msg: 'Tên đăng nhập đã tồn tại.' });

  var mkTam = o.MatKhau && String(o.MatKhau).length >= 6 ? String(o.MatKhau) : mkTam_();
  if (MK_YEU_.indexOf(mkTam.toLowerCase()) >= 0) return sach_({ ok: false, msg: 'Mật khẩu tạm quá dễ đoán. Để trống để hệ thống tự tạo.' });

  // Vai trò CN (công nhân) và TP (trưởng phòng) gắn với một mã nhân viên có thật
  var maNV = '';
  if (o.VaiTro === 'NHOM') {   // tài khoản nhóm báo tổng số suất cơm (chủ dự án 11/10) – gắn 1 nhóm trong COM_BO_PHAN, không có mã NV
    if (!COM_BO_PHAN[o.MaXuong]) return sach_({ ok: false, msg: 'Chọn nhóm báo cơm cho tài khoản.' });
  }
  if (o.VaiTro === 'NV' || o.VaiTro === 'TBP') return sach_({ ok: false, msg: 'Vai trò này đã bỏ – dùng tài khoản nhóm báo cơm.' });
  if (o.VaiTro === 'CN' || o.VaiTro === 'TP') {
    maNV = String(o.MaNV || '').trim().toUpperCase();
    if (o.VaiTro === 'CN' && !maNV) return sach_({ ok: false, msg: 'Tài khoản công nhân phải chọn nhân viên.' });
    if (maNV) {
      var nv = doc_('NhanSu').filter(function(x) { return String(x.MaNV).toUpperCase() === maNV; })[0];
      if (!nv) return sach_({ ok: false, msg: 'Không tìm thấy nhân viên ' + maNV + '.' });
      // Lấy xưởng theo nhân viên được gắn
      o.MaXuong = nv.MaXuong;
    }
  }

  them_('TaiKhoan', {
    TenDangNhap: tk, MatKhauMaHoa: '', HoTen: o.HoTen,
    VaiTro: o.VaiTro, MaXuong: o.MaXuong || '', TrangThai: 'Đang dùng',
    DoiMatKhauLanDau: 'Có', LanDangNhapCuoi: '', NgayTao: new Date(), MaNV: maNV
  });
  var moiTao = doc_('TaiKhoan').filter(function(x) {
    return String(x.TenDangNhap).toLowerCase() === tk;
  })[0];
  if (moiTao) datMKTam_(moiTao._row, mkTam);
  ghiLog_(me, 'Tạo tài khoản', tk + ' — ' + o.VaiTro + (maNV ? ' (' + maNV + ')' : ''));
  return sach_({ ok: true, mkTam: mkTam, tenDN: tk, hoTen: o.HoTen, hanGio: MK_HAN_TAM_GIO,
    msg: 'Đã tạo tài khoản "' + tk + '". Mật khẩu tạm: ' + mkTam + ' (dùng trong ' + MK_HAN_TAM_GIO + ' giờ)' });
}

function doiTrangThaiTK(token, tenDN) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (me.vaiTro !== 'ADMIN') return sach_({ ok: false, msg: 'Chỉ ban điều hành.' });
  if (!me.laOwner) return sach_({ ok: false, msg: 'Chỉ chủ sở hữu được đổi trạng thái tài khoản.' });
  if (String(tenDN).toLowerCase() === String(me.tk).toLowerCase())
    return sach_({ ok: false, msg: 'Không thể tự ngừng tài khoản của chính mình.' });

  var tk = doc_('TaiKhoan').filter(function(x) {
    return String(x.TenDangNhap).toLowerCase() === String(tenDN).toLowerCase();
  })[0];
  if (!tk) return sach_({ ok: false, msg: 'Không tìm thấy tài khoản.' });

  var moi = String(tk.TrangThai) === 'Đang dùng' ? 'Ngừng' : 'Đang dùng';
  suaO_('TaiKhoan', tk._row, 'TrangThai', moi);
  ghiLog_(me, 'Đổi trạng thái tài khoản', tenDN, tk.TrangThai, moi);
  return sach_({ ok: true, msg: 'Đã chuyển sang: ' + moi });
}

function capLaiMatKhau(token, tenDN) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (me.vaiTro !== 'ADMIN') return sach_({ ok: false, msg: 'Chỉ ban điều hành cấp lại mật khẩu.' });
  if (!me.laOwner) return sach_({ ok: false, msg: 'Chỉ chủ sở hữu được cấp lại mật khẩu.' });

  var tk = doc_('TaiKhoan').filter(function(x) {
    return String(x.TenDangNhap).toLowerCase() === String(tenDN).toLowerCase();
  })[0];
  if (!tk) return sach_({ ok: false, msg: 'Không tìm thấy tài khoản.' });

  // Mật khẩu tạm NGẪU NHIÊN 8 ký tự, hết hạn sau 48 giờ; mọi phiên đang mở của tài khoản này bị đăng xuất
  var mkTam = mkTam_();
  datMKTam_(tk._row, mkTam);
  tangPhienBan_(tk);
  try { CacheService.getScriptCache().remove('SAI_' + String(tenDN).toLowerCase().trim()); } catch (e) {}
  ghiLog_(me, 'Cấp lại mật khẩu', tenDN);
  return sach_({ ok: true, mkTam: mkTam, tenDN: tk.TenDangNhap, hoTen: tk.HoTen, hanGio: MK_HAN_TAM_GIO,
    msg: 'Mật khẩu tạm của "' + tenDN + '": ' + mkTam +
    '\nHãy báo riêng cho người này trong ' + MK_HAN_TAM_GIO + ' giờ. Họ sẽ phải đổi mật khẩu ngay lần đăng nhập đầu.' });
}

/* ========================================================
   CÔNG CỤ CHẨN ĐOÁN
   Chạy trực tiếp trong Apps Script khi không đăng nhập được.
   Chọn tên hàm ở thanh trên cùng rồi bấm Chạy, xem kết quả
   ở phần "Nhật ký thực thi" phía dưới.
   ======================================================== */

/* Đặt lại mật khẩu TẤT CẢ tài khoản về 123456 */
function DAT_LAI_TAT_CA_MAT_KHAU() {
  if (!noiBo_(arguments[0])) return chanWeb_('DAT_LAI_TAT_CA_MAT_KHAU');
  var sh = ss_().getSheetByName('TaiKhoan');
  if (!sh) { Logger.log('Không có trang tính TaiKhoan'); return; }

  var head = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  var cMK = head.indexOf('MatKhauMaHoa') + 1;
  var cDoi = head.indexOf('DoiMatKhauLanDau') + 1;
  var n = sh.getLastRow() - 1;
  if (n < 1) { Logger.log('Chưa có tài khoản nào'); return; }

  var h = bam_('123456');
  for (var i = 2; i <= sh.getLastRow(); i++) {
    sh.getRange(i, cMK).setNumberFormat('@').setValue(h);
    if (cDoi > 0) sh.getRange(i, cDoi).setValue('Có');   // bắt buộc đổi lại khi đăng nhập
  }
  Logger.log('Đã đặt lại mật khẩu ' + n + ' tài khoản về: 123456');
}

/* Tạo lại 7 tài khoản mặc định — không đụng tới dữ liệu sản xuất */
function TAO_LAI_TAI_KHOAN() {
  if (!noiBo_(arguments[0])) return chanWeb_('TAO_LAI_TAI_KHOAN');
  var ss = ss_();
  var sh = ss.getSheetByName('TaiKhoan');
  // AN TOÀN: hàm này XÓA SẠCH sheet TaiKhoan. Không cho chạy khi đã có dữ liệu thật.
  if (sh && sh.getLastRow() > 8) {
    Logger.log('DỪNG: sheet TaiKhoan đang có ' + (sh.getLastRow() - 1) + ' tài khoản. Hàm này sẽ xóa hết nên không chạy.');
    return;
  }
  if (!sh) sh = ss.insertSheet('TaiKhoan');

  sh.clear();
  var head = ['TenDangNhap','MatKhauMaHoa','HoTen','VaiTro','MaXuong','TrangThai',
              'DoiMatKhauLanDau','LanDangNhapCuoi','NgayTao'];
  sh.getRange(1, 1, 1, head.length).setValues([head])
    .setFontWeight('bold').setBackground('#12313a').setFontColor('#ffffff');
  sh.setFrozenRows(1);
  sh.getRange(2, 2, sh.getMaxRows() - 1, 1).setNumberFormat('@');

  var mk = bam_('123456');
  var now = new Date();
  var rows = [
    ['giamdoc', mk, 'Giám đốc',            'ADMIN', '',    'Đang dùng', 'Có', '', now],
    ['phogd1',  mk, 'Phó giám đốc 1',      'ADMIN', '',    'Đang dùng', 'Có', '', now],
    ['phogd2',  mk, 'Phó giám đốc 2',      'ADMIN', '',    'Đang dùng', 'Có', '', now],
    ['tpson',   mk, 'Trưởng phòng Sơn',    'TP',    'SON', 'Đang dùng', 'Có', '', now],
    ['tpcnc',   mk, 'Trưởng phòng CNC',    'TP',    'CNC', 'Đang dùng', 'Có', '', now],
    ['nhansu',  mk, 'Phòng nhân sự',       'HR',    '',    'Đang dùng', 'Có', '', now],
    ['kcs',     mk, 'Kiểm soát chất lượng','QC',    '',    'Đang dùng', 'Có', '', now]
  ];
  sh.getRange(2, 1, rows.length, head.length).setValues(rows);
  for (var c = 1; c <= head.length; c++) sh.autoResizeColumn(c);

  Logger.log('Đã tạo lại 7 tài khoản, mật khẩu đều là 123456');
  Logger.log('giamdoc / phogd1 / phogd2 / tpson / tpcnc / nhansu / kcs');
}

/* ============================================================
   ===== KPI THEO KỲ: CHỐT THÁNG / QUÝ / NĂM =====
   Snapshot lưu ở sheet 'KPIThang' — mỗi người mỗi tháng một dòng.
   Cột: Ky | MaNV | HoTen | MaXuong | HieuSuatSL | ChatLuong | TuanThu | AnToan |
        TongKPI | Loai | TongSanLuong | TongGioLam | TongGioDung | Hang | ThoiDiemChot | NguoiChot
   ============================================================ */

function taoSheetKPIThang_() {
  var ss = ss_();
  var sh = ss.getSheetByName('KPIThang');
  if (!sh) {
    sh = ss.insertSheet('KPIThang');
    sh.appendRow(['Ky','MaNV','HoTen','MaXuong','HieuSuatSL','ChatLuong','TuanThu','AnToan',
                  'TongKPI','Loai','TongSanLuong','TongGioLam','TongGioDung','Hang','ThoiDiemChot','NguoiChot']);
    sh.setFrozenRows(1);
  }
  // Cột Ky (cột 1) phải là văn bản thuần, nếu không Sheets tự đổi '2026-08' thành Date
  sh.getRange(2, 1, sh.getMaxRows() - 1, 1).setNumberFormat('@');
  return sh;
}

/* ----- Các hàm tính KPI phía server (port từ frontend) ----- */
/* ===== LỊCH SỬ ĐỊNH MỨC (18/10) ===== */
var LSDM_SHEET = 'LichSuDinhMuc', LSDM_COT = ['MaCD', 'DinhMucGio', 'TuNgay', 'DenNgay', 'ThoiDiem'];
function luuLichSuDM_(row, moi) {
  try {
    var cu = doc_('DinhMuc').filter(function(x) { return x._row === row; })[0];
    if (!cu || soVN_(cu.DinhMucGio) === soVN_(moi) || !(soVN_(cu.DinhMucGio) > 0)) return;
    var tuAp = ngayApDM_();                              // ngày 1 tháng này (kể cả tháng đã chốt)
    if (tuAp < homNayVN_()) catLichSuDM_(cu.MaCD, tuAp); // bỏ phần lịch sử trùng tháng này (21/10)
    var homQua = congNgay_(tuAp, -1), tu = cu.HieuLucTu ? ngayVN_(cu.HieuLucTu) : '';
    if (tu && tu > homQua) return;                       // định mức cũ mới đặt hôm nay -> chưa áp dụng ngày nào, khỏi lưu
    var sh = ss_().getSheetByName(LSDM_SHEET);
    if (!sh) { sh = ss_().insertSheet(LSDM_SHEET); sh.getRange(1, 1, 1, LSDM_COT.length).setValues([LSDM_COT]).setFontWeight('bold'); sh.setFrozenRows(1); }
    sh.appendRow([cu.MaCD, soVN_(cu.DinhMucGio), tu ? "'" + tu : '', "'" + homQua, new Date()]);
    xoaCache_(LSDM_SHEET);
  } catch (e) {}
}
/* Định mức của công đoạn maCD áp dụng NGÀY ngay ('yyyy-MM-dd') */
function dmNgay_(dt, maCD, ngay) {
  var ls = dt.lsDM && dt.lsDM[maCD];
  if (ls && ngay) for (var i = 0; i < ls.length; i++) if (ngay <= ls[i].den && (!ls[i].tu || ngay >= ls[i].tu)) return ls[i].gio;
  return dt.idxDM ? (dt.idxDM[maCD] || 0) : dm_(maCD, dt.dinhmuc);
}

function dm_(maCD, dinhmuc) {
  var r = dinhmuc.filter(function(x){ return x.MaCD === maCD; })[0];
  return r ? soVN_(r.DinhMucGio) : 0;
}
function ngLoi_(r, kcs) {
  return kcs.filter(function(k){
    return ngayVN_(k.Ngay) === ngayVN_(r.Ngay) && k.MaNV === r.MaNV && k.MaCD === r.MaCD;
  }).reduce(function(a,k){ return a + Number(k.SoLuongKhongDat||0); }, 0);
}
function diemNeNep_(maNV, nhom, dmvp, vipham) {
  var vp = vipham.filter(function(v){ return v.MaNV === maNV; });
  var tru = 0;
  vp.forEach(function(v){
    var loai = dmvp.filter(function(x){ return x.MaVP === v.MaVP; })[0];
    if (loai && String(loai.Nhom).trim() === nhom) tru += Number(loai.MucTru||0);
  });
  var d = 100 - tru;
  return d < 0 ? 0 : d;
}

/* Tính KPI cho 1 người trong 1 tháng 'yyyy-MM'. Trả null nếu không có dữ liệu tháng đó. */
function kpiThang_(maNV, kyThang, dt) {
  // Nhật ký đã chốt trong tháng, gom theo NGÀY
  var rows = dt.idxNK
    ? (dt.idxNK[maNV + '|' + kyThang] || [])
    : dt.nhatky.filter(function(r){
        return r.MaNV === maNV
          && String(r.TrangThai).trim() === 'Đã chốt'
          && ngayVN_(r.Ngay).slice(0,7) === kyThang;
      });
  var theoNgay = {};
  rows.forEach(function(r){
    var ngayR = ngayVN_(r.Ngay);
    (theoNgay[ngayR] = theoNgay[ngayR] || []).push(r);
  });

  // Tập hợp các NGÀY CÔNG cần xét = ngày xưởng đã điểm danh (ngày công chính thức)
  // hợp với ngày người này có nhật ký (phòng khi khai cho ngày chưa kịp xác nhận điểm danh).
  // Ngày đã điểm danh mà không khai sản lượng -> vẫn tính giờ có mặt, sản lượng = 0.
  var xuongNV = dt.idxXuongNV ? dt.idxXuongNV[maNV] : null;
  var ngayCong = {};
  if (xuongNV && dt.idxNgayDD) {
    (dt.idxNgayDD[xuongNV + '|' + kyThang] || []).forEach(function(ng){ ngayCong[ng] = true; });
  }
  Object.keys(theoNgay).forEach(function(ng){ ngayCong[ng] = true; });

  // Nghỉ dài hạn của người này (thai sản, ốm dài...) -> loại ngày trong khoảng
  var dsNDH = (dt.idxNDH && dt.idxNDH[maNV]) ? dt.idxNDH[maNV] : [];
  var nghiDaiHanNgay = function(ng){
    for (var i=0;i<dsNDH.length;i++){ if (dsNDH[i].tu <= ng && ng <= dsNDH[i].den) return true; }
    return false;
  };

  var gc=0, sl=0, ng2=0, mauSo=0, hnK = homNayVN_();   // 09/11: hôm nay chưa xong -> không tính
  Object.keys(ngayCong).forEach(function(ngayR){
    if (ngayR >= hnK) return;
    if (nghiDaiHanNgay(ngayR)) return;                 // nghỉ dài hạn -> bỏ qua
    var kyHieu = dt.idxCC ? (dt.idxCC[maNV+'|'+ngayR] || 'x') : kyHieuChamCong_(dt.diemdanh || [], maNV, ngayR);
    var gioMat = gioCoMat_(kyHieu);
    if (gioMat <= 0) return;                            // nghỉ cả ngày -> không tính
    mauSo += gioMat;                                    // ngày công -> luôn cộng giờ có mặt vào mẫu số
    var rs = theoNgay[ngayR] || [];                     // nếu rỗng: đi làm nhưng không khai -> SL 0
    rs.forEach(function(r){
      var d = dmNgay_(dt, r.MaCD, ngayR);
      var n = dt.idxLoi ? (dt.idxLoi[maNV+'|'+ngayR+'|'+r.MaCD] || 0) : ngLoi_(r, dt.kcs);
      var dat = Number(r.SoLuongLamRa) - n;
      if (d > 0) gc += dat / d;
      sl += Number(r.SoLuongLamRa); ng2 += n;
    });
  });

  // Không có ngày công nào (không điểm danh, không nhật ký) -> không có KPI
  if (mauSo <= 0) return null;
  var ng = ng2;   // giữ tên biến cũ cho phần dưới

  var t = trongSoKy_(dt.dsTrongSo, kyThang, dt.trongso);   // trọng số của ĐÚNG tháng đang tính
  // Hiệu suất sản lượng = tổng giờ chuẩn / tổng giờ CÓ MẶT (lấy từ chấm công).
  var vsl = gc / mauSo * 100;
  if (vsl > Number(t.TranKPI)) vsl = Number(t.TranKPI);
  var vcl = sl > 0 ? Math.max(0, (sl-ng)/sl*100) : 100;
  // Vi phạm nề nếp/chuyên cần: dùng bản ghi trong tháng (nếu ViPham có cột Ngay)
  var vpNguoi = dt.idxVP ? (dt.idxVP[maNV] || []) : dt.vipham.filter(function(v){ return v.MaNV === maNV; });
  var vpThang = vpNguoi.filter(function(v){
    var ng = ngayVN_(v.Ngay) || ngayVN_(v.ThoiDiemGhi);   // A2 (18/10): thiếu ngày thì lấy ngày ghi, không trừ lặp mọi tháng
    return !!ng && ng.slice(0,7) === kyThang && ng < hnK;
  });
  var vtt = diemNeNep_(maNV, 'ChuyenCan', dt.dmvp, vpThang);
  var vat = diemNeNep_(maNV, 'NeNep', dt.dmvp, vpThang);
  var tong = (vsl*Number(t.SanLuong) + vcl*Number(t.ChatLuong) + vtt*Number(t.TuanThu) + vat*Number(t.AnToan)) / 100;

  return { sl:vsl, cl:vcl, tt:vtt, at:vat, tong:tong, spl:sl, gl:mauSo, gd:0 };
}

/* ===== TRỌNG SỐ THEO KỲ =====
   Sheet TrongSoKPI ghi nối tiếp theo thời gian. Tháng nào dùng dòng MỚI NHẤT có KyApDung <= tháng đó
   -> đổi trọng số tháng 10 không làm thay đổi KPI tháng 8, 9. */
var TRONG_SO_MAC_DINH = { KyApDung:'', SanLuong:40, ChatLuong:30, TuanThu:15, AnToan:15, TranKPI:120, TyTrongTo:70 };
function trongSoKy_(ds, ky, macDinh) {
  var chon = null;
  (ds || []).forEach(function(t){
    var k = chuanKy_(t.KyApDung);
    if (!k || !ky || k <= ky) chon = t;
  });
  return chon || (ds && ds[0]) || macDinh || TRONG_SO_MAC_DINH;
}

/* ===== HỌC VIỆC (18/10): HOC_VIEC_THANG tháng kể từ ngày vào làm ===== */
var HOC_VIEC_THANG = 1, __NGAY_VAO = null;
function ngayVaoLam_(maNV) {
  if (!__NGAY_VAO) { __NGAY_VAO = {}; doc_('NhanSu').forEach(function(x){ if (x.NgayVaoLam) __NGAY_VAO[String(x.MaNV)] = ngayVN_(x.NgayVaoLam); }); }
  return __NGAY_VAO[String(maNV)] || '';
}
/* Ngày hết học việc ('yyyy-MM-dd', '' nếu không rõ ngày vào làm) */
function hetHocViec_(maNV) {
  var v = ngayVaoLam_(maNV); if (!v) return '';
  var p = v.split('-'), y = Number(p[0]), m = Number(p[1]) + HOC_VIEC_THANG, d = Number(p[2]);
  while (m > 12) { m -= 12; y++; }
  var cuoi = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return y + '-' + ('0' + m).slice(-2) + '-' + ('0' + Math.min(d, cuoi)).slice(-2);
}
function dangHocViec_(maNV, ngay) { var h = hetHocViec_(maNV); return !!h && ngay < h; }
/* Tháng ky ('yyyy-MM') tính là học việc nếu tới giữa tháng vẫn còn học việc */
function laHocViecThang_(maNV, ky) { var h = hetHocViec_(maNV); return !!h && h > ky + '-15' && ngayVaoLam_(maNV) <= ky + '-31'; }
function loaiCo_(maNV, ky, tong) { return laHocViecThang_(maNV, ky) ? 'Học việc' : loaiKPI_(tong); }
/* Xếp hạng trong xưởng, bỏ người đang học việc (hạng 0) */
function sapXepHangHV_(arr, ky) {
  arr.forEach(function(o){ if (laHocViecThang_(o.MaNV, ky)) o.hang = 0; });
  sapXepHang_(arr.filter(function(o){ return !laHocViecThang_(o.MaNV, ky); }));
  return arr;
}

function loaiKPI_(v) {             // thang 22/10: S ≥ 95, A+ ≥ 90, A ≥ 85, B ≥ 80, C ≥ 70, D < 70
  if (v >= 95) return 'S';
  if (v >= 90) return 'A+';
  if (v >= 85) return 'A';
  if (v >= 80) return 'B';
  if (v >= 70) return 'C';
  return 'D';
}

/* Đọc toàn bộ dữ liệu cần cho việc tính KPI (không lọc theo vai trò) */
/* Số giờ CÓ MẶT trong ngày, suy từ ký hiệu chấm công.
   x/rỗng -> 8h; 0.5x -> 4h; đi muộn x-N -> (8-N)h; nghỉ cả ngày -> 0h. */
function gioCoMat_(kyHieu){
  var k = String(kyHieu||'x').trim();
  if (k === '' || k === 'x') return 8;
  if (k === '0.5x') return 4;
  if (k.indexOf('x-') === 0){
    var muon = parseFloat(k.slice(2));           // x-2 -> muộn 2 giờ
    if (isNaN(muon) || muon < 0) muon = 0;
    var con = 8 - muon;
    return con > 0 ? con : 0;
  }
  return 0;   // mọi loại nghỉ cả ngày
}

function docDuLieuKPI_(canLuuTru) {
  napTruoc_(SHEET_NAP_);
  var dt = {
    nhatky: (canLuuTru && ss_().getSheetByName(TEN_LUU_TRU)) ? doc_(TEN_LUU_TRU).concat(doc_('NhatKySanXuat')) : doc_('NhatKySanXuat'),
    kcs: doc_('PhieuKCS'),
    dinhmuc: doc_('DinhMuc'),
    diemdanh: (ss_().getSheetByName('DiemDanhNghi') ? doc_('DiemDanhNghi') : []),
    xacNhanDD: (ss_().getSheetByName('XacNhanDiemDanh') ? doc_('XacNhanDiemDanh') : []),
    nghiDaiHan: (ss_().getSheetByName('NghiDaiHan') ? doc_('NghiDaiHan') : []),
    nhansu: doc_('NhanSu').filter(function(x){ return String(x.TrangThai).trim() !== 'Nghỉ việc'; }),
    vipham: (ss_().getSheetByName('ViPham') ? doc_('ViPham') : []),
    dmvp: (ss_().getSheetByName('DanhMucViPham') ? doc_('DanhMucViPham') : []),
    dsTrongSo: doc_('TrongSoKPI'),
    trongso: trongSoKy_(doc_('TrongSoKPI'), kyVN_())
  };
  // ----- ĐÁNH INDEX MỘT LẦN (tránh quét lại sheet cho từng người -> không timeout) -----
  // Định mức: MaCD -> DinhMucGio
  dt.idxDM = {};
  dt.dinhmuc.forEach(function(x){ dt.idxDM[x.MaCD] = soVN_(x.DinhMucGio); });
  // Định mức cũ đã thay (A1, 18/10): MaCD -> [{tu, den, gio}] xếp theo ngày kết thúc
  dt.lsDM = {};
  (ss_().getSheetByName(LSDM_SHEET) ? doc_(LSDM_SHEET) : []).forEach(function(x){
    var den = ngayVN_(x.DenNgay); if (!den) return;
    (dt.lsDM[x.MaCD] = dt.lsDM[x.MaCD] || []).push({ tu: x.TuNgay ? ngayVN_(x.TuNgay) : '', den: den, gio: soVN_(x.DinhMucGio) });
  });
  Object.keys(dt.lsDM).forEach(function(k){ dt.lsDM[k].sort(function(a, b){ return a.den < b.den ? -1 : 1; }); });
  // Lỗi KCS: "MaNV|ngày|MaCD" -> tổng SoLuongKhongDat
  dt.idxLoi = {};
  dt.kcs.forEach(function(k){
    var key = k.MaNV + '|' + ngayVN_(k.Ngay) + '|' + k.MaCD;
    dt.idxLoi[key] = (dt.idxLoi[key] || 0) + Number(k.SoLuongKhongDat || 0);
  });
  // Chấm công: "MaNV|ngày" -> ký hiệu
  dt.idxCC = {};
  dt.diemdanh.forEach(function(r){
    dt.idxCC[ r.MaNV + '|' + ngayVN_(r.Ngay) ] = khTuBanGhi_(r);
  });
  // Vi phạm theo người: MaNV -> [bản ghi]
  dt.idxVP = {};
  dt.vipham.forEach(function(v){
    (dt.idxVP[v.MaNV] = dt.idxVP[v.MaNV] || []).push(v);
  });
  // Nhật ký ĐÃ CHỐT theo "MaNV|thang" -> [bản ghi] (để kpiThang_ khỏi quét lại toàn bộ)
  dt.idxNK = {};
  dt.nhatky.forEach(function(r){
    if (String(r.TrangThai).trim() !== 'Đã chốt') return;
    var key = r.MaNV + '|' + ngayVN_(r.Ngay).slice(0,7);
    (dt.idxNK[key] = dt.idxNK[key] || []).push(r);
  });
  // Xưởng của mỗi nhân viên: MaNV -> MaXuong
  dt.idxXuongNV = {};
  dt.nhansu.forEach(function(x){ dt.idxXuongNV[x.MaNV] = x.MaXuong; });
  // Ngày đã điểm danh theo "MaXuong|thang" -> [ngày yyyy-MM-dd] (danh sách ngày công chính thức)
  dt.idxNgayDD = {};
  dt.xacNhanDD.forEach(function(r){
    var ng = ngayVN_(r.Ngay);
    var key = r.MaXuong + '|' + ng.slice(0,7);
    (dt.idxNgayDD[key] = dt.idxNgayDD[key] || []).push(ng);
  });
  // Nghỉ dài hạn theo người: MaNV -> [{tu, den}]
  dt.idxNDH = {};
  dt.nghiDaiHan.forEach(function(r){
    (dt.idxNDH[r.MaNV] = dt.idxNDH[r.MaNV] || []).push({ tu: ngayVN_(r.TuNgay), den: ngayVN_(r.DenNgay) });
  });
  return dt;
}

/* Tra ký hiệu chấm công của 1 người trong 1 ngày (yyyy-MM-dd).
   Trả 'x' (đi làm đủ) nếu không có bản ghi chấm tay. */
function kyHieuChamCong_(diemdanh, maNV, ngayYMD){
  for (var i=0;i<diemdanh.length;i++){
    var r = diemdanh[i];
    if (String(r.MaNV) === String(maNV) && ngayVN_(r.Ngay) === ngayYMD){
      return khTuBanGhi_(r);
    }
  }
  return 'x';
}

/* Xếp hạng theo tie-break: Tổng KPI > Chất lượng > Nề nếp(AnToan) > An toàn?  
   Yêu cầu: hiệu suất bằng nhau -> ưu tiên Chất lượng, Nề nếp, An toàn, Sản lượng.
   (Ở đây "nề nếp" = TuanThu/chuyên cần theo dữ liệu; thứ tự: cl -> tt -> at -> spl) */
function sapXepHang_(arr) {
  arr.sort(function(a, b){
    if (b.tong !== a.tong) return b.tong - a.tong;
    if (b.cl   !== a.cl)   return b.cl   - a.cl;
    if (b.tt   !== a.tt)   return b.tt   - a.tt;
    if (b.at   !== a.at)   return b.at   - a.at;
    return b.spl - a.spl;
  });
  arr.forEach(function(o, i){ o.hang = i + 1; });
  return arr;
}

/* ----- CHỐT THÁNG (thủ công, gọi từ giao diện) ----- */
function chotThang(token, kyThang, chiXuong) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok:false, hetHan:true, msg:'Phiên đăng nhập đã hết hạn.' });
  if (me.vaiTro !== 'ADMIN' && me.vaiTro !== 'TP')
    return sach_({ ok:false, msg:'Chỉ ban điều hành hoặc trưởng phòng được chốt tháng.' });
  if (me.vaiTro === 'ADMIN' && !me.laOwner)
    return sach_({ ok:false, msg:'Chỉ chủ sở hữu được chốt tháng thủ công.' });

  var ky = kyThang || kyVN_();
  if (!/^\d{4}-\d{2}$/.test(String(ky))) return sach_({ ok:false, msg:'Kỳ không hợp lệ (cần dạng năm-tháng).' });
  // TP chỉ được chốt xưởng của mình
  var xuongLoc = (me.vaiTro === 'TP') ? me.xuong : (chiXuong || '');
  if (me.vaiTro === 'TP') {
    if (ky > kyVN_()) return sach_({ ok:false, msg:'Chưa tới tháng này.' });
    if (docAnToan_('KPIThang').some(function(r){ return chuanKy_(r.Ky) === ky && r.MaXuong === me.xuong && !laChotTam_(r); }))
      return sach_({ ok:false, msg:'Tháng ' + ky + ' đã chốt chính thức. Muốn chốt lại, nhờ chủ sở hữu.' });
  }

  var n = chotThangLoi_(ky, xuongLoc, me.ten);
  ghiLog_(me, 'Chốt KPI tháng', 'Kỳ ' + ky + (xuongLoc ? ' — xưởng ' + xuongLoc : ' — toàn nhà máy') + ' — ' + n + ' người');
  return sach_({ ok:true, msg:'Đã chốt KPI tháng ' + ky + ' cho ' + n + ' người.' + (xuongLoc ? ' (xưởng ' + tenXuong_(xuongLoc) + ')' : '') });
}

/* Lõi chốt: tính & ghi snapshot cho 1 kỳ. Ghi đè các dòng cùng kỳ (và cùng xưởng nếu lọc).
   Trả về số người đã chốt. */
function chotThangLoi_(ky, xuongLoc, nguoiChot) {
  var dt = docDuLieuKPI_(canLuuTru_([ky]));

  // Bảng KPI công nhân: BỎ trưởng/phó phòng (họ có bảng KPI quản lý riêng) — giống cách tính trực tiếp
  var maQL = mapQuanLy_();
  var dsNV = dt.nhansu.filter(function(x){ return !maQL[String(x.MaNV).trim()]; });
  if (xuongLoc) dsNV = dsNV.filter(function(x){ return x.MaXuong === xuongLoc; });

  // Tính KPI từng người trong kỳ
  var ketqua = [];
  dsNV.forEach(function(x){
    var k = kpiThang_(x.MaNV, ky, dt);
    if (k) ketqua.push({
      MaNV:x.MaNV, HoTen:x.HoTen, MaXuong:x.MaXuong,
      sl:k.sl, cl:k.cl, tt:k.tt, at:k.at, tong:k.tong,
      spl:k.spl, gl:k.gl, gd:k.gd
    });
  });

  // Xếp hạng TRONG TỪNG XƯỞNG (hạng theo xưởng)
  var theoXuong = {};
  ketqua.forEach(function(o){ (theoXuong[o.MaXuong] = theoXuong[o.MaXuong] || []).push(o); });
  Object.keys(theoXuong).forEach(function(mx){ sapXepHangHV_(theoXuong[mx], ky); });

  var now = new Date();
  var rows = ketqua.map(function(o){
    return [ ky, o.MaNV, o.HoTen, o.MaXuong, r2_(o.sl), r2_(o.cl), r2_(o.tt), r2_(o.at),
             r2_(o.tong), loaiCo_(o.MaNV, ky, o.tong), o.spl, r2_(o.gl), r2_(o.gd), o.hang, now, nguoiChot||'Hệ thống' ];
  });

  // Ghi: khóa, rồi thay các dòng cùng kỳ (và cùng xưởng nếu có lọc) bằng dòng mới — một lượt
  khoa_();
  var sh = taoSheetKPIThang_();
  ghiSnapshot_(sh, ky, xuongLoc, rows);
  xoaCache_('KPIThang');   // làm mới cache để bảng KPI đọc được snapshot vừa ghi
  xong_();
  return rows.length;
}

/* Thay các dòng cùng kỳ (+ cùng xưởng) trong KPIThang bằng rowsMoi. Đọc 1 lần, ghi 1 lần (thay vì xóa từng dòng). */
function ghiSnapshot_(sh, ky, xuongLoc, rowsMoi) {
  var last = sh.getLastRow();
  var giu = [];
  if (last >= 2) {
    giu = sh.getRange(2, 1, last - 1, 16).getValues().filter(function(r){
      if (r.join('') === '') return false;
      var cungKy = chuanKy_(r[0]) === String(ky);
      var cungXuong = !xuongLoc || String(r[3]) === String(xuongLoc);
      return !(cungKy && cungXuong);
    }).map(function(r){ r[0] = chuanKy_(r[0]); return r; });
    sh.getRange(2, 1, last - 1, 16).clearContent();
  }
  var tat = giu.concat(rowsMoi);
  if (tat.length) {
    sh.getRange(2, 1, tat.length, 1).setNumberFormat('@');
    sh.getRange(2, 1, tat.length, 16).setValues(tat);
  }
}

function r2_(v){ return Math.round(Number(v)*100)/100; }

/* Dòng KPIThang là bản TẠM (snapshot 9h hằng ngày), chưa phải chốt chính thức */
var NGUOI_CHOT_TAM = 'Snapshot tự động 9h';
function laChotTam_(r) { return String(r.NguoiChot || '').indexOf('Snapshot') === 0; }
function daChotChinhThuc_(ky) {
  return docAnToan_('KPIThang').some(function(r){ return chuanKy_(r.Ky) === ky && !laChotTam_(r); });
}

/* ----- CHỐT TỰ ĐỘNG -----
   Trigger chạy 23h mỗi ngày (giờ VN). Tháng TRƯỚC được chốt chính thức vào NGÀY LÀM VIỆC THỨ 3 của tháng này:
   lúc đó trưởng phòng đã duyệt xong sản lượng mấy ngày cuối tháng (hạn duyệt 2 ngày làm việc).
   (Trước đây chốt lúc 23h ngày cuối tháng -> mất phần sản lượng duyệt sau.)
   Nếu hôm đó trigger lỡ không chạy, những ngày sau vẫn tự chốt bù khi tháng trước chưa có bản chính thức. */
function chotThangTuDong() {
  if (!noiBo_(arguments[0])) return chanWeb_('chotThangTuDong');
  var homNay = homNayVN_();
  var kyNay = homNay.slice(0, 7), kyCu = kyTruoc_(kyNay);
  var thuTu = 0;
  for (var s = kyNay + '-01'; s <= homNay; s = congNgay_(s, 1)) if (laNgayLamViec_(s)) thuTu++;
  if (!laNgayLamViec_(homNay) || thuTu < 3) return;
  if (thuTu > 3 && daChotChinhThuc_(kyCu)) return;
  var n = chotThangLoi_(kyCu, '', 'Tự động (ngày làm việc thứ 3)');
  try { comTongKetThang_(kyCu); } catch (e) { Logger.log('Tổng kết cơm trưa lỗi: ' + e); }
  try { guiBaoCaoThang_(kyCu); } catch (e) { Logger.log('Gửi báo cáo tháng lỗi: ' + e); }
  try {
    var shLog = ss_().getSheetByName('NhatKyThaoTac');
    if (shLog) shLog.appendRow([new Date(),'HE_THONG','Chốt KPI tháng (tự động)','Kỳ '+kyCu+' — '+n+' người','','']);
  } catch(e){}
}

/* Chạy 1 lần để cài trigger: mỗi ngày 23h (giờ VN) kiểm tra, đến ngày làm việc thứ 3 sẽ chốt tháng trước. */
function CAI_TRIGGER_CHOT_THANG() {
  if (!noiBo_(arguments[0])) return chanWeb_('CAI_TRIGGER_CHOT_THANG');
  ScriptApp.getProjectTriggers().forEach(function(tg){
    if (tg.getHandlerFunction() === 'chotThangTuDong') ScriptApp.deleteTrigger(tg);
  });
  ScriptApp.newTrigger('chotThangTuDong').timeBased().atHour(23).everyDays(1).inTimezone(TZ_VN).create();
  Logger.log('Đã cài trigger chotThangTuDong: 23h mỗi ngày, chốt tháng trước vào ngày làm việc thứ 3.');
}

/* ----- SNAPSHOT KPI HẰNG NGÀY (9h sáng) -----
   Ghi bản TẠM của tháng hiện tại (NguoiChot = 'Snapshot tự động 9h'). Bản tạm không được coi là chốt:
   tháng đã qua mà chỉ có bản tạm thì bảng KPI vẫn tính trực tiếp cho tới khi chốt chính thức. */
function snapshotKPIHangNgay() {
  if (!noiBo_(arguments[0])) return chanWeb_('snapshotKPIHangNgay');
  var ky = kyVN_();
  var n = chotThangLoi_(ky, '', NGUOI_CHOT_TAM);
  if (typeof chupDonHangHangNgay_ === 'function') chupDonHangHangNgay_();   // tab Đơn hàng (01/11): bản chụp để xem thay đổi trong ngày
  try {
    var shLog = ss_().getSheetByName('NhatKyThaoTac');
    if (shLog) shLog.appendRow([new Date(),'HE_THONG','Snapshot KPI (9h sáng)','Kỳ '+ky+' — '+n+' người','','']);
  } catch(e){}
  return n;
}

/* Chạy 1 lần trong trình soạn thảo để cài trigger 9h sáng mỗi ngày (giờ VN). */
function CAI_TRIGGER_SNAPSHOT_9H() {
  if (!noiBo_(arguments[0])) return chanWeb_('CAI_TRIGGER_SNAPSHOT_9H');
  ScriptApp.getProjectTriggers().forEach(function(tg){
    if (tg.getHandlerFunction() === 'snapshotKPIHangNgay') ScriptApp.deleteTrigger(tg);
  });
  ScriptApp.newTrigger('snapshotKPIHangNgay').timeBased().atHour(9).everyDays(1).inTimezone(TZ_VN).create();
  Logger.log('Đã cài trigger snapshotKPIHangNgay: mỗi ngày 9h sáng.');
}

/* Lấy bảng KPI theo kỳ: kieu = 'thang' (yyyy-MM) | 'quy' (yyyy-Qn) | 'nam' (yyyy).
   - Tháng đã có snapshot -> lấy từ snapshot.
   - Tháng hiện tại chưa chốt -> tính trực tiếp (đánh dấu tamTinh=true).
   - Quý/năm = trung bình cộng điểm KPI các tháng có dữ liệu. */
function layKPIKy(token, kieu, giaTri, maXuong) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok:false, hetHan:true, msg:'Phiên hết hạn.' });
  if (me.vaiTro === 'CN' || me.vaiTro === 'TP') { if (!me.xuong) return sach_({ ok:false, msg:'Tài khoản chưa gắn xưởng.' }); maXuong = me.xuong; }   // TP/PP: chỉ xưởng mình (21/10)
  else if (!xemCaNhaMay_(me)) return sach_({ ok:false, msg:'Không có quyền xem bảng KPI.' });
  return nho_('layKPIKy', [kieu, giaTri, maXuong || ''], function() { return layKPIKyGoc_(token, kieu, giaTri, maXuong); });
}
function layKPIKyGoc_(token, kieu, giaTri, maXuong, meSan) {
  var me = meSan || docPhien_(token);
  if (!me) return sach_({ ok:false, hetHan:true, msg:'Phiên hết hạn.' });

  // Cho phép mọi vai trò (TP, CN) xem KPI tất cả xưởng, nhóm theo xưởng ở hiển thị.
  var xuongLoc = maXuong || '';
  var thangCanLay = [];
  if (kieu === 'thang') thangCanLay = [giaTri];
  else if (kieu === 'quy') {
    var m = String(giaTri).match(/^(\d{4})-Q([1-4])$/);
    if (m) { var y=m[1], q=Number(m[2]); for (var i=0;i<3;i++) thangCanLay.push(y+'-'+('0'+((q-1)*3+1+i)).slice(-2)); }
  } else if (kieu === 'nam') {
    for (var mm=1; mm<=12; mm++) thangCanLay.push(giaTri+'-'+('0'+mm).slice(-2));
  }

  // Gom điểm theo người qua các tháng
  var theoNguoi = {}; // MaNV -> {HoTen,MaXuong,cong:[{sl,cl,tt,at,tong,spl}], soThang}
  var tamTinh = false;
  var thangHienTai = kyVN_();

  thangCanLay.forEach(function(thg){
    var snap;
    if (thg >= thangHienTai) {
      // Tháng hiện tại (và tương lai nếu có): LUÔN tính trực tiếp để phản ánh mọi thay đổi
      // ngay lập tức (duyệt sản lượng, nhập theo tổ, ngày đi làm không khai...). Snapshot
      // chỉ dùng cho tháng ĐÃ QUA (dữ liệu không còn đổi). Nhờ lọc theo xưởng nên không quá tải.
      snap = tinhThangTrucTiep_(thg, xuongLoc); tamTinh = true;
    } else {
      snap = laySnapshotThang_(thg, xuongLoc);
      // Tháng đã qua mà xưởng nào CHƯA CHỐT CHÍNH THỨC (chưa có gì, hoặc chỉ có bản tạm 9h)
      // -> tính trực tiếp cho xưởng đó, để sản lượng duyệt muộn vẫn được tính.
      var theoX = {};
      snap.forEach(function(r){ (theoX[r.MaXuong] = theoX[r.MaXuong] || []).push(r); });
      var xTam = Object.keys(theoX).filter(function(mx){ return theoX[mx].every(laChotTam_); });
      if (!snap.length || xTam.length) {
        var song = tinhThangTrucTiep_(thg, xuongLoc); tamTinh = true;
        snap = !snap.length ? song
          : snap.filter(function(r){ return xTam.indexOf(r.MaXuong) < 0; })
                .concat(song.filter(function(r){ return xTam.indexOf(r.MaXuong) >= 0; }));
      }
    }
    snap.forEach(function(o){
      var k = theoNguoi[o.MaNV] || (theoNguoi[o.MaNV] = { MaNV:o.MaNV, HoTen:o.HoTen, MaXuong:o.MaXuong, arr:[] });
      // Chuẩn hóa về một bộ field nhất quán, dù nguồn là snapshot (HieuSuatSL...) hay tạm tính (sl...)
      k.arr.push({
        sl:  Number(o.HieuSuatSL   != null ? o.HieuSuatSL   : o.sl),
        cl:  Number(o.ChatLuong    != null ? o.ChatLuong    : o.cl),
        tt:  Number(o.TuanThu      != null ? o.TuanThu      : o.tt),
        at:  Number(o.AnToan       != null ? o.AnToan       : o.at),
        tong:Number(o.TongKPI      != null ? o.TongKPI      : o.tong),
        spl: Number(o.TongSanLuong != null ? o.TongSanLuong : o.spl)
      });
    });
  });

  // Tổng hợp: trung bình cộng điểm KPI các tháng có dữ liệu
  var ds = Object.keys(theoNguoi).map(function(mn){
    var k = theoNguoi[mn], a = k.arr, n = a.length;
    var avg = function(f){ return a.reduce(function(s,o){ return s+Number(o[f]||0); },0)/n; };
    return {
      MaNV:k.MaNV, HoTen:k.HoTen, MaXuong:k.MaXuong,
      sl:r2_(avg('sl')), cl:r2_(avg('cl')), tt:r2_(avg('tt')), at:r2_(avg('at')),
      tong:r2_(avg('tong')), spl:a.reduce(function(s,o){return s+Number(o.spl||0);},0), soThang:n
    };
  });

  // Xếp hạng theo xưởng với tie-break
  var theoXuong = {};
  ds.forEach(function(o){ (theoXuong[o.MaXuong]=theoXuong[o.MaXuong]||[]).push(o); });
  var kyCuoi = thangCanLay[thangCanLay.length - 1] || kyVN_();
  Object.keys(theoXuong).forEach(function(mx){ sapXepHangHV_(theoXuong[mx], kyCuoi); });
  ds.forEach(function(o){ o.loai = loaiCo_(o.MaNV, kyCuoi, o.tong); o.hocViec = laHocViecThang_(o.MaNV, kyCuoi); });

  return sach_({ ok:true, kieu:kieu, giaTri:giaTri, tamTinh:tamTinh, ds:ds });
}

/* Chuẩn hóa giá trị Ky về dạng 'yyyy-MM' dù ô lưu là chuỗi hay bị Sheets đổi thành Date */
function chuanKy_(ky) {
  if (Object.prototype.toString.call(ky) === '[object Date]') {
    return Utilities.formatDate(ky, 'GMT+7', 'yyyy-MM');
  }
  var s = String(ky).trim();
  // '2026-08-01' -> '2026-08'; '2026-08' giữ nguyên
  var m = s.match(/^(\d{4})-(\d{2})/);
  return m ? (m[1] + '-' + m[2]) : s;
}

/* Đọc snapshot 1 tháng từ sheet KPIThang (lọc xưởng nếu có) */
function laySnapshotThang_(thg, xuongLoc) {
  if (!ss_().getSheetByName('KPIThang')) return [];
  var thgChuan = chuanKy_(thg);
  var maQL = mapQuanLy_();   // bỏ trưởng/phó phòng lọt vào các bản chốt cũ
  var all = doc_('KPIThang').filter(function(r){
    return chuanKy_(r.Ky) === thgChuan && (!xuongLoc || r.MaXuong === xuongLoc) && !maQL[String(r.MaNV).trim()];
  });
  return all;
}

/* Tính trực tiếp 1 tháng (chưa chốt) — trả cùng dạng field như snapshot */
function tinhThangTrucTiep_(thg, xuongLoc) {
  var dt = docDuLieuKPI_(canLuuTru_([thg]));
  var dsNV = dt.nhansu;
  if (xuongLoc) dsNV = dsNV.filter(function(x){ return x.MaXuong === xuongLoc; });
  // Loại TRƯỞNG/PHÓ PHÒNG khỏi bảng KPI công nhân (họ có bảng KPI quản lý riêng)
  var maQL = mapQuanLy_();
  dsNV = dsNV.filter(function(x){ return !maQL[String(x.MaNV).trim()]; });

  // Người cần tính = có nhật ký đã chốt trong tháng, HOẶC có ngày điểm danh (đi làm) trong tháng
  // -> người đi làm mà không khai sản lượng vẫn được tính KPI (sản lượng 0%).
  var coData = {};
  dt.nhatky.forEach(function(r){
    if (String(r.TrangThai).trim() === 'Đã chốt' && ngayVN_(r.Ngay).slice(0,7) === thg)
      coData[r.MaNV] = 1;
  });
  // Thêm người thuộc xưởng có ngày điểm danh trong tháng
  var xuongCoDD = {};
  Object.keys(dt.idxNgayDD || {}).forEach(function(key){
    var ph = key.split('|');   // MaXuong|thang
    if (ph[1] === thg) xuongCoDD[ph[0]] = 1;
  });
  dsNV.forEach(function(x){ if (xuongCoDD[x.MaXuong]) coData[x.MaNV] = 1; });

  var out = [];
  dsNV.forEach(function(x){
    if (!coData[x.MaNV]) return;   // không nhật ký & không ngày điểm danh -> bỏ qua
    var k = kpiThang_(x.MaNV, thg, dt);
    if (k) out.push({
      Ky:thg, MaNV:x.MaNV, HoTen:x.HoTen, MaXuong:x.MaXuong,
      HieuSuatSL:r2_(k.sl), ChatLuong:r2_(k.cl), TuanThu:r2_(k.tt), AnToan:r2_(k.at),
      TongKPI:r2_(k.tong), Loai:loaiCo_(x.MaNV, thg, k.tong), TongSanLuong:k.spl
    });
  });
  return out;
}

/* Lịch sử KPI của 1 người: theo tháng (mọi tháng có dữ liệu), gộp quý & năm. */
function layLichSuKPI(token, maNV) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok:false, hetHan:true, msg:'Phiên hết hạn.' });
  return nho_('layLichSuKPI', [maNV, me.vaiTro, me.xuong, me.maNV], function() { return layLichSuKPIGoc_(token, maNV); });
}
function layLichSuKPIGoc_(token, maNV) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok:false, hetHan:true, msg:'Phiên hết hạn.' });
  // Công nhân / trưởng phòng: chỉ xem chi tiết KPI của người trong xưởng mình
  if (!xemCaNhaMay_(me) && me.vaiTro !== 'CN' && me.vaiTro !== 'TP' && String(maNV) !== String(me.maNV))
    return sach_({ ok:false, msg:'Chỉ xem được chi tiết KPI của chính mình.' });
  if ((me.vaiTro === 'CN' || me.vaiTro === 'TP') && String(maNV) !== String(me.maNV)) {
    var nvXem = nhanSuGomTP_().filter(function(x){ return x.MaNV === maNV; })[0];
    if (!nvXem || String(nvXem.MaXuong) !== String(me.xuong))
      return sach_({ ok:false, msg:'Chỉ xem được chi tiết KPI của người trong xưởng mình.' });
  }

  var dt = docDuLieuKPI_(canLuuTru_(['']));
  // Tất cả tháng có nhật ký đã chốt của người này
  var thangSet = {};
  dt.nhatky.forEach(function(r){
    if (r.MaNV === maNV && String(r.TrangThai).trim() === 'Đã chốt')
      thangSet[ngayVN_(r.Ngay).slice(0,7)] = 1;
  });
  var thangs = Object.keys(thangSet).sort();

  var theoThang = thangs.map(function(thg){
    // Ưu tiên snapshot đã chốt; nếu chưa có thì tính trực tiếp
    var snap = laySnapshotThang_(thg, '').filter(function(o){ return o.MaNV === maNV; })[0];
    if (snap && !laChotTam_(snap)) return {
      ky:thg, sl:Number(snap.HieuSuatSL), cl:Number(snap.ChatLuong),
      tt:Number(snap.TuanThu), at:Number(snap.AnToan), tong:Number(snap.TongKPI),
      loai:snap.Loai, spl:Number(snap.TongSanLuong), hang:Number(snap.Hang||0), daChot:true
    };
    var k = kpiThang_(maNV, thg, dt);
    return k ? { ky:thg, sl:r2_(k.sl), cl:r2_(k.cl), tt:r2_(k.tt), at:r2_(k.at),
                 tong:r2_(k.tong), loai:loaiKPI_(k.tong), spl:k.spl, hang:0, daChot:false } : null;
  }).filter(Boolean);

  // Gộp quý
  var quyMap = {};
  theoThang.forEach(function(m){
    var y = m.ky.slice(0,4), mo = Number(m.ky.slice(5,7)), q = Math.ceil(mo/3);
    var key = y+'-Q'+q;
    (quyMap[key] = quyMap[key] || []).push(m);
  });
  var theoQuy = Object.keys(quyMap).sort().map(function(key){
    var a = quyMap[key], n = a.length, avg=function(f){return a.reduce(function(s,o){return s+o[f]},0)/n;};
    return { ky:key, sl:r2_(avg('sl')), cl:r2_(avg('cl')), tt:r2_(avg('tt')), at:r2_(avg('at')),
             tong:r2_(avg('tong')), loai:loaiKPI_(avg('tong')), spl:a.reduce(function(s,o){return s+o.spl;},0), soThang:n };
  });
  // Gộp năm
  var namMap = {};
  theoThang.forEach(function(m){ var y=m.ky.slice(0,4); (namMap[y]=namMap[y]||[]).push(m); });
  var theoNam = Object.keys(namMap).sort().map(function(y){
    var a=namMap[y], n=a.length, avg=function(f){return a.reduce(function(s,o){return s+o[f]},0)/n;};
    return { ky:y, sl:r2_(avg('sl')), cl:r2_(avg('cl')), tt:r2_(avg('tt')), at:r2_(avg('at')),
             tong:r2_(avg('tong')), loai:loaiKPI_(avg('tong')), spl:a.reduce(function(s,o){return s+o.spl;},0), soThang:n };
  });

  // Chi tiết theo NGÀY (gộp theo ngày) — cho xem lịch sử ngày
  var byday = {};
  dt.nhatky.filter(function(r){ return r.MaNV===maNV && String(r.TrangThai).trim()==='Đã chốt'; })
    .forEach(function(r){
      var day = ngayVN_(r.Ngay);
      var d = dmNgay_(dt, r.MaCD, day), nl = ngLoi_(r, dt.kcs), dat = Number(r.SoLuongLamRa)-nl;
      var b = byday[day] || (byday[day]={gc:0,gcm:0,sl:0});
      if (d>0) b.gc += dat/d;
      b.sl += Number(r.SoLuongLamRa);
    });
  var theoNgay = Object.keys(byday).sort().reverse().map(function(day){
    var b = byday[day];
    var t = trongSoKy_(dt.dsTrongSo, day.slice(0,7), dt.trongso);
    var gcm = gioCoMat_( kyHieuChamCong_(dt.diemdanh || [], maNV, day) );  // giờ có mặt ngày đó
    var hs = gcm > 0 ? b.gc/gcm*100 : 0;
    if (hs > Number(t.TranKPI)) hs = Number(t.TranKPI);
    return { ky:day, sl:r2_(hs), gl:r2_(gcm), gd:0, spl:b.sl, loai:loaiKPI_(hs) };
  }).filter(function(o){ return o.gl > 0; });   // bỏ ngày nghỉ cả ngày

  var ho = dt.nhansu.filter(function(x){return x.MaNV===maNV;})[0] || {HoTen:maNV, MaXuong:''};
  return sach_({ ok:true, maNV:maNV, hoTen:ho.HoTen, xuong:tenXuong_(ho.MaXuong),
    theoNgay:theoNgay, theoThang:theoThang.slice().reverse(), theoQuy:theoQuy.reverse(), theoNam:theoNam.reverse() });
}

/* ============================================================
   ===== ĐIỂM DANH SĨ SỐ (người nghỉ) =====
   Sheet 'DiemDanhNghi': MaDD | Ngay | MaNV | MaXuong | LyDo | NguoiGhi | ThoiDiem
   - Chỉ lưu người NGHỈ. Ai không có trong sheet = đi làm.
   - TP điểm danh xưởng mình; ADMIN xem tất cả.
   ============================================================ */

function taoSheetDiemDanh_() {
  var ss = ss_();
  var sh = ss.getSheetByName('DiemDanhNghi');
  if (!sh) {
    sh = ss.insertSheet('DiemDanhNghi');
    sh.appendRow(['MaDD','Ngay','MaNV','MaXuong','LyDo','KyHieu','Cong','NguoiGhi','ThoiDiem']);
    sh.setFrozenRows(1);
    return sh;
  }
  // Sheet cũ có thể thiếu cột KyHieu / Cong — tự bổ sung để không mất dữ liệu chấm chi tiết
  var head = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  if (head.indexOf('KyHieu') < 0 || head.indexOf('Cong') < 0){
    // Chèn 2 cột KyHieu, Cong ngay sau LyDo (cột 5) nếu thiếu
    var idxLyDo = head.indexOf('LyDo');
    var chen = idxLyDo >= 0 ? idxLyDo + 2 : sh.getLastColumn() + 1;
    xaGhi_('DiemDanhNghi');
    if (head.indexOf('Cong') < 0){ sh.insertColumnBefore(chen); sh.getRange(1, chen).setValue('Cong'); }
    if (head.indexOf('KyHieu') < 0){ sh.insertColumnBefore(chen); sh.getRange(1, chen).setValue('KyHieu'); }
    delete __HEAD_CACHE['DiemDanhNghi']; xoaCache_('DiemDanhNghi');
  }
  return sh;
}

/* Lưu điểm danh 1 ngày: danh sách người NGHỈ. 
   nghi: [{MaNV, LyDo}], ngay: 'yyyy-MM-dd'. Ghi đè toàn bộ người nghỉ của ngày (trong phạm vi xưởng). */
function luuDiemDanh(token, ngay, nghi) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok:false, hetHan:true, msg:'Phiên hết hạn.' });
  if (me.vaiTro !== 'ADMIN' && me.vaiTro !== 'TP')
    return sach_({ ok:false, msg:'Chỉ trưởng phòng hoặc ban điều hành được điểm danh.' });
  if (!ngay) return sach_({ ok:false, msg:'Thiếu ngày điểm danh.' });
  var loiNgay = kiemNgay_(ngay, 62);
  if (loiNgay) return sach_({ ok:false, msg: loiNgay });
  // Chủ nhật được nghỉ — không điểm danh
  if (thuCua_(ngay) === 0)
    return sach_({ ok:false, msg:'Chủ nhật là ngày nghỉ, không cần điểm danh.' });
  khoa_();

  taoSheetDiemDanh_();
  var nsMap = {};
  nhanSuGomTP_().forEach(function(x){ nsMap[x.MaNV] = x; });   // gồm cả trưởng/phó phòng

  // Danh sách nghỉ mới (trong phạm vi quyền)
  var dsNghi = {};
  (nghi || []).forEach(function(o){
    var ns = nsMap[o.MaNV];
    if (!ns) return;
    if (me.vaiTro === 'TP' && ns.MaXuong !== me.xuong) return;
    dsNghi[o.MaNV] = { o: o, ns: ns };
  });

  // Bản ghi cũ của ngày này. GIỮ LẠI ô nửa ngày (0.5x) / đi muộn (x-…) đã chấm ở "Lịch tháng"
  // nếu người đó không bị đánh dấu nghỉ lần này (trước đây lưu điểm danh là xóa mất các ô này).
  var cu = doc_('DiemDanhNghi').filter(function(r){
    return ngayVN_(r.Ngay) === ngay && (me.vaiTro === 'ADMIN' || r.MaXuong === me.xuong);
  });
  var cuTheoNV = {}, canXoa = [];
  cu.forEach(function(r){
    if (!nsMap[r.MaNV]) return;   // người không còn trong danh sách (đã nghỉ việc): giữ nguyên dữ liệu cũ
    var kh = khTuBanGhi_(r);
    var motPhan = (kh === '0.5x' || kh.indexOf('x-') === 0);
    if (motPhan && !dsNghi[r.MaNV]) return;
    cuTheoNV[r.MaNV] = r;
    canXoa.push(r._row);
  });

  var now = new Date(), moi = [];
  Object.keys(dsNghi).forEach(function(mnv){
    var o = dsNghi[mnv].o, ns = dsNghi[mnv].ns, c = cuTheoNV[mnv];
    var lyDo = String(o.LyDo || '').trim();
    // Lý do không đổi -> giữ ký hiệu cũ (VD "NL", "P" chấm ở Lịch tháng); đổi -> suy ký hiệu từ lý do
    var kh = (c && String(c.KyHieu || '').trim() && String(c.LyDo || '').trim() === lyDo)
      ? String(c.KyHieu).trim() : khTuBanGhi_({ LyDo: lyDo });
    moi.push({ MaDD: ma_('DD'), Ngay: ngay, MaNV: mnv, MaXuong: ns.MaXuong, LyDo: lyDo,
               KyHieu: kh, Cong: congTheoKyHieu_(kh), NguoiGhi: me.ten, ThoiDiem: now });
  });
  xoaNhieuDong_('DiemDanhNghi', canXoa);
  themNhieu_('DiemDanhNghi', moi);

  ghiLog_(me, 'Điểm danh', 'Ngày ' + ngay + ' — ' + moi.length + ' người nghỉ');
  goPhatNgayNghi_();

  // Đánh dấu xưởng đã điểm danh hôm nay (để ban điều hành biết xưởng nào đã/chưa làm)
  if (me.vaiTro === 'TP' && me.xuong) {
    xacNhanDiemDanh_(ngay, me.xuong, me.ten);
  }

  return sach_({ ok:true, msg:'Đã lưu điểm danh ngày ' + ngay + ' — ' + moi.length + ' người nghỉ.' });
}

/* Sheet ghi xác nhận: xưởng nào đã điểm danh ngày nào */
function taoSheetXacNhan_(){
  var ss=ss_(), sh=ss.getSheetByName('XacNhanDiemDanh');
  if(!sh){
    sh=ss.insertSheet('XacNhanDiemDanh');
    sh.appendRow(['Ngay','MaXuong','NguoiXacNhan','ThoiDiem']);
    sh.setFrozenRows(1);
  }
  return sh;
}
function xacNhanDiemDanh_(ngay, maXuong, nguoi){
  taoSheetXacNhan_();
  // Nếu đã có xác nhận cho ngày+xưởng này thì không ghi trùng
  var cu = docAnToan_('XacNhanDiemDanh').filter(function(r){
    return ngayVN_(r.Ngay) === ngay && r.MaXuong === maXuong;
  });
  if (cu.length) return;
  them_('XacNhanDiemDanh', { Ngay: ngay, MaXuong: maXuong, NguoiXacNhan: nguoi, ThoiDiem: new Date() });
}

/* Lấy điểm danh 1 ngày cho trưởng phòng: danh sách nhân sự xưởng + ai đang đánh dấu nghỉ */
/* Danh sách nhân sự CÓ GỘP trưởng phòng.
   Trưởng phòng nằm ở TaiKhoan (VaiTro='TP') nhưng thường không có bản ghi NhanSu.
   Hàm này bổ sung họ vào danh sách để điểm danh / thống kê / xem nhân sự đều thấy.
   MaNV của TP: dùng MaNV nếu có, nếu rỗng thì dùng 'TK:'+TenDangNhap để định danh ổn định. */
function nhanSuGomTP_() {
  var ns = doc_('NhanSu').filter(function(x){ return String(x.TrangThai).trim() !== 'Nghỉ việc'; });
  var coMa = {};
  ns.forEach(function(x){ coMa[String(x.MaNV)] = true; });

  var tps = doc_('TaiKhoan').filter(function(t){
    var vt = String(t.VaiTro).trim();
    return (vt === 'TP' || vt === 'PP') && String(t.TrangThai).trim() === 'Đang dùng';
  });
  tps.forEach(function(t){
    var maNV = String(t.MaNV||'').trim() || ('TK:' + t.TenDangNhap);
    if (coMa[maNV]) return; // đã có trong NhanSu rồi thì thôi
    ns.push({
      MaNV: maNV, HoTen: t.HoTen, MaXuong: t.MaXuong || '',
      ChucDanh: (String(t.VaiTro).trim()==='PP') ? 'Phó phòng' : 'Trưởng phòng',
      TrangThai: 'Đang làm', laTP: true
    });
    coMa[maNV] = true;
  });
  return ns;
}

function layDiemDanh(token, ngay) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok:false, hetHan:true, msg:'Phiên hết hạn.' });
  var ng = ngay || ngayVN_(new Date());

  var ns = nhanSuGomTP_();
  if (me.vaiTro === 'TP') ns = ns.filter(function(x){ return x.MaXuong === me.xuong; });
  else if (!xemCaNhaMay_(me)) ns = ns.filter(function(x){ return !!me.maNV && x.MaNV === me.maNV; });

  var nghi = doc_('DiemDanhNghi').filter(function(r){ return ngayVN_(r.Ngay) === ng; });

  // Nghỉ dài hạn phủ lên ngày này -> tự động đánh nghỉ, TP không cần tích tay
  var ndh = docAnToan_('NghiDaiHan').filter(function(r){
    return ngayVN_(r.TuNgay) <= ng && ng <= ngayVN_(r.DenNgay);
  });
  var ndhMap = {};
  ndh.forEach(function(r){ if(!ndhMap[r.MaNV]) ndhMap[r.MaNV] = r.Loai; });

  // Nghỉ cả ngày: x / 0.5x / đi muộn (x-) = vẫn đi làm, không tính nghỉ
  function laNghiCaNgay(kh){
    var k = String(kh||'').trim();
    if (k === 'x' || k === '0.5x' || k.indexOf('x-') === 0) return false;
    return k !== '';
  }

  var ds = ns.map(function(x){
    var n = nghi.filter(function(r){ return r.MaNV === x.MaNV; })[0];
    var dh = ndhMap[x.MaNV];
    // Chấm tay: chỉ tính nghỉ nếu là ký hiệu nghỉ cả ngày (không phải nửa ngày/đi muộn)
    var nghiTay = n ? laNghiCaNgay(khTuBanGhi_(n)) : false;
    var laNghi = nghiTay || (!n && !!dh);
    var lyDo = n ? n.LyDo : (dh || '');
    return { MaNV:x.MaNV, HoTen:x.HoTen, MaXuong:x.MaXuong,
             nghi: laNghi, LyDo: lyDo, daiHan: (!n && !!dh) };
  });
  var soNghi = ds.filter(function(o){ return o.nghi; }).length;
  var daXacNhan = false;
  if (me.vaiTro === 'TP' && me.xuong) {
    daXacNhan = docAnToan_('XacNhanDiemDanh').some(function(r){
      return ngayVN_(r.Ngay) === ng && r.MaXuong === me.xuong;
    });
  }
  return sach_({ ok:true, ngay:ng, tong:ds.length, diLam:ds.length - soNghi, nghi:soNghi,
                 daXacNhan: daXacNhan,
                 tenXuong: me.vaiTro==='TP' ? tenXuong_(me.xuong) : '', ds:ds });
}

/* Sĩ số hôm nay theo tất cả xưởng — cho Tổng quan ban điều hành */

function siSoTatCaXuong(token, ngay) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok:false, hetHan:true, msg:'Phiên hết hạn.' });
  var ng = ngay || ngayVN_(new Date());
  var xs = siSoTatCaXuongTinh_(ng);
  if (!xemCaNhaMay_(me)) xs.forEach(function(x) { if (!(me.vaiTro === 'TP' && x.MaXuong === me.xuong)) x.dsNghi = []; });
  return sach_({ ok:true, ngay:ng, xuong: xs });
}

/* Lõi tính sĩ số theo xưởng cho một ngày (dùng chung cho API và chẩn đoán) */
function siSoTatCaXuongTinh_(ng) {
  var pb = doc_('PhongBan');
  var ns = nhanSuGomTP_();
  var chamAll = doc_('DiemDanhNghi').filter(function(r){ return ngayVN_(r.Ngay) === ng; });

  // Xưởng nào đã xác nhận điểm danh hôm nay
  var xacNhan = {};
  docAnToan_('XacNhanDiemDanh').forEach(function(r){
    if (ngayVN_(r.Ngay) === ng) xacNhan[r.MaXuong] = r.NguoiXacNhan || true;
  });

  // Nghỉ dài hạn phủ lên ngày này
  var ndhAll = docAnToan_('NghiDaiHan').filter(function(r){
    return ngayVN_(r.TuNgay) <= ng && ng <= ngayVN_(r.DenNgay);
  });

  // Xác định "nghỉ cả ngày" theo ký hiệu: x, 0.5x (nửa ngày vẫn đi làm), đi muộn (x-) = KHÔNG nghỉ
  function laNghiCaNgay(kh){
    var k = String(kh||'').trim();
    if (k === 'x' || k === '0.5x') return false;      // đi làm / nửa ngày -> vẫn đi làm
    if (k.indexOf('x-') === 0) return false;          // đi muộn -> vẫn đi làm
    return k !== '';                                   // còn lại (P, Nkl, Nkp, NL, Nb, Cu, Ta, TS...) = nghỉ
  }

  return pb.map(function(p){
    var nsX = ns.filter(function(x){ return x.MaXuong === p.MaXuong; });
    var chamX = chamAll.filter(function(r){ return r.MaXuong === p.MaXuong; });
    var ndhX = ndhAll.filter(function(r){ return r.MaXuong === p.MaXuong; });

    // Tập người nghỉ cả ngày = chấm tay nghỉ cả ngày + nghỉ dài hạn (không trùng lặp theo MaNV)
    var nghiMap = {};
    chamX.forEach(function(r){
      if (laNghiCaNgay(khTuBanGhi_(r))) nghiMap[r.MaNV] = { HoTen:'', LyDo:r.LyDo||'' };
    });
    ndhX.forEach(function(r){
      if (!nghiMap[r.MaNV]) nghiMap[r.MaNV] = { HoTen:'', LyDo:r.Loai||'' };  // chấm tay ưu tiên nếu đã có
    });

    var dsNghi = Object.keys(nghiMap).map(function(mnv){
      var ns1 = nsX.filter(function(x){ return x.MaNV === mnv; })[0];
      return { HoTen: ns1 ? ns1.HoTen : mnv, LyDo: nghiMap[mnv].LyDo };
    });

    return {
      MaXuong:p.MaXuong, TenXuong:p.TenXuong,
      tong: nsX.length, nghi: dsNghi.length, diLam: nsX.length - dsNghi.length,
      dsNghi: dsNghi,
      daDiemDanh: !!xacNhan[p.MaXuong]
    };
  }).filter(function(o){ return o.tong > 0; });
}

/* Thống kê nghỉ theo tháng. kyThang='yyyy-MM'.
   Trả: dsNguoi (mỗi người: tổng nghỉ, có phép, không phép, danh sách ngày nghỉ),
        cacNgay (các ngày trong tháng có người nghỉ, để dựng lịch lưới),
        soNgayTrongThang. */
/* ===== KÝ HIỆU CHẤM CÔNG & QUY ĐỔI CÔNG ===== */
function congTheoKyHieu_(kh){
  var k = String(kh||'x').trim();
  if (k === 'x') return 1;              // đi làm đủ
  if (k === '0.5x') return 0.5;         // làm nửa ngày
  if (k.indexOf('x-') === 0) return 1;  // đi muộn (x-0.5..x-2) — vẫn đi làm, tính đủ công
  // Mọi loại nghỉ (P, Nkl, Nkp, NL, Nb, Cu, Ta, TS, OD, VGĐ, KLD...) đều 0 công.
  // Ngày nghỉ có lương do HC-NS tự trả riêng, không cộng vào công ở đây.
  return 0;
}
function laVangKyHieu_(kh){
  var k=String(kh||'x').trim();
  // Vắng = mọi loại nghỉ cả ngày (không gồm đi làm x/0.5x/đi muộn)
  return ['P','Nkl','Nkp','NL','Nb','Cu','Ta','TS','OD','VGĐ','KLD'].indexOf(k) >= 0;
}
function laKhongPhepKyHieu_(kh){
  var k=String(kh||'x').trim();
  return k==='Nkl' || k==='Nkp' || k==='KLD';   // không lương / không phép
}

/* Lưu cả lịch tháng: rows = [{MaNV, Ngay:'yyyy-MM-dd', KyHieu}]. Chỉ lưu ô KHÁC 'x'.
   Ghi đè toàn bộ bản ghi của tháng trong phạm vi xưởng (TP) trước khi ghi mới. */
function luuLichThang(token, ky, rows){
  var me = docPhien_(token);
  if (!me) return sach_({ ok:false, hetHan:true, msg:'Phiên hết hạn.' });
  if (me.vaiTro !== 'TP') return sach_({ ok:false, msg:'Chỉ trưởng phòng được chấm lịch.' });
  ky = String(ky || '');
  if (!/^\d{4}-\d{2}$/.test(ky)) return sach_({ ok:false, msg:'Thiếu hoặc sai tháng.' });
  if (ky < NGAY_MO_HE_THONG.slice(0, 7)) return sach_({ ok:false, msg:'Tháng ' + ky + ' trước khi dùng hệ thống.' });
  khoa_();

  taoSheetDiemDanh_();
  var nsMap = {};
  nhanSuGomTP_().forEach(function(x){ nsMap[x.MaNV] = x; });
  var xuong = me.xuong;

  // Kiểm tra & dựng dòng mới TRƯỚC khi xóa -> có lỗi thì dữ liệu cũ còn nguyên
  var now = new Date(), moi = [];
  var nhanTen = {Nkl:'Nghỉ không lương', Nkp:'Nghỉ không phép', P:'Nghỉ phép năm',
      NL:'Nghỉ lễ', Nb:'Nghỉ bù', Cu:'Nghỉ cưới hỏi', Ta:'Nghỉ tang', TS:'Thai sản',
      '0.5x':'Làm nửa ngày', 'x-0.5':'Đi muộn 0.5h', 'x-1':'Đi muộn 1h', 'x-1.5':'Đi muộn 1.5h', 'x-2':'Đi muộn 2h'};
  for (var i = 0; i < (rows || []).length; i++) {
    var o = rows[i];
    var kh = String(o.KyHieu || 'x').trim();
    if (kh === 'x') continue;                      // đi làm đủ -> không cần lưu
    var ng = String(o.Ngay || '');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(ng) || ng.slice(0, 7) !== ky || congNgay_(ng, 0) !== ng)
      return sach_({ ok:false, msg:'Ô ngày "' + ng + '" không thuộc tháng ' + ky + '. Chưa lưu gì.' });
    var ns = nsMap[o.MaNV];
    var mx = ns ? ns.MaXuong : xuong;
    if (mx !== xuong) continue;                    // chỉ chấm xưởng mình
    moi.push({
      MaDD: ma_('DD'), Ngay: ng, MaNV: o.MaNV, MaXuong: xuong,
      LyDo: nhanTen[kh] || kh, KyHieu: kh, Cong: congTheoKyHieu_(kh),
      NguoiGhi: me.ten, ThoiDiem: now
    });
  }

  // Thay toàn bộ bản ghi tháng này của xưởng: xóa một lượt, ghi một lượt
  var cu = doc_('DiemDanhNghi').filter(function(r){
    return String(ngayVN_(r.Ngay)).slice(0,7) === ky && r.MaXuong === xuong;
  });
  xoaNhieuDong_('DiemDanhNghi', cu.map(function(r){ return r._row; }));
  themNhieu_('DiemDanhNghi', moi);

  ghiLog_(me, 'Chấm lịch tháng', 'Kỳ ' + ky + ' — ' + moi.length + ' ô khác thường');
  goPhatNgayNghi_();
  return sach_({ ok:true, msg:'Đã lưu lịch tháng ' + ky + ' (' + moi.length + ' ô đánh dấu, còn lại là đi làm đủ).' });
}

/* Thống kê + lịch tháng. Trả ký hiệu từng ô. maXuong: ADMIN xem 1 xưởng hoặc tất cả (''). */
/* ===== NGHỈ DÀI HẠN ===== */
// Ký hiệu & quy đổi công cho nghỉ dài hạn
var LOAI_NDH_ = {
  'Thai sản':               { kyHieu:'TS',  cong:0 },
  'Ốm dài':                 { kyHieu:'Nkl', cong:0 },
  'Việc gia đình':          { kyHieu:'Nkl', cong:0 },
  'Nghỉ không lương dài':   { kyHieu:'Nkl', cong:0 }
};
function kyHieuNDH_(loai){ var o=LOAI_NDH_[loai]; return o?o.kyHieu:'TS'; }
function congNDH_(loai){ var o=LOAI_NDH_[loai]; return o?o.cong:1; }

function taoSheetNghiDaiHan_(){
  var ss=ss_(), sh=ss.getSheetByName('NghiDaiHan');
  if(!sh){
    sh=ss.insertSheet('NghiDaiHan');
    sh.appendRow(['MaNghi','MaNV','MaXuong','Loai','TuNgay','DenNgay','GhiChu','NguoiGhi','ThoiDiem']);
  }
  return sh;
}

/* Đăng ký một khoảng nghỉ dài hạn (TP). */
function dangKyNghiDaiHan(token, maNV, loai, tuNgay, denNgay, ghiChu){
  var me=docPhien_(token);
  if(!me) return sach_({ ok:false, hetHan:true, msg:'Phiên hết hạn.' });
  khoa_();
  if(me.vaiTro!=='TP') return sach_({ ok:false, msg:'Chỉ trưởng phòng được đăng ký nghỉ dài hạn.' });
  if(!maNV||!loai||!tuNgay||!denNgay) return sach_({ ok:false, msg:'Thiếu thông tin (người, loại, từ ngày, đến ngày).' });
  if(!LOAI_NDH_[loai]) return sach_({ ok:false, msg:'Loại nghỉ không hợp lệ.' });
  if(!/^\d{4}-\d{2}-\d{2}$/.test(String(tuNgay)) || !/^\d{4}-\d{2}-\d{2}$/.test(String(denNgay)))
    return sach_({ ok:false, msg:'Ngày không hợp lệ.' });
  if(String(tuNgay) > String(denNgay)) return sach_({ ok:false, msg:'Từ ngày phải trước hoặc bằng đến ngày.' });

  // Xác định xưởng của người này (gồm cả TP)
  var ns=nhanSuGomTP_().filter(function(x){ return x.MaNV===maNV; })[0];
  if(!ns) return sach_({ ok:false, msg:'Không tìm thấy nhân sự.' });
  if(ns.MaXuong!==me.xuong) return sach_({ ok:false, msg:'Chỉ đăng ký cho nhân sự xưởng mình.' });

  taoSheetNghiDaiHan_();
  them_('NghiDaiHan', {
    MaNghi: ma_('NDH'), MaNV: maNV, MaXuong: me.xuong, Loai: loai,
    TuNgay: tuNgay, DenNgay: denNgay, GhiChu: ghiChu||'',
    NguoiGhi: me.ten, ThoiDiem: new Date()
  });
  ghiLog_(me, 'Đăng ký nghỉ dài hạn', maNV+' · '+loai+' · '+tuNgay+' → '+denNgay);
  goPhatNgayNghi_();
  return sach_({ ok:true, msg:'Đã đăng ký nghỉ dài hạn cho nhân sự ('+loai+', '+tuNgay+' → '+denNgay+').' });
}

/* Danh sách nghỉ dài hạn của xưởng (TP) hoặc tất cả (ADMIN). */
function layNghiDaiHan(token, maXuong){
  var me=docPhien_(token);
  if(!me) return sach_({ ok:false, hetHan:true, msg:'Phiên hết hạn.' });
  var xuongLoc=(me.vaiTro==='TP')?me.xuong:(maXuong||'');
  var ds=docAnToan_('NghiDaiHan').filter(function(r){
    return (!xuongLoc || r.MaXuong===xuongLoc) && (me.vaiTro==='TP' || xemCaNhaMay_(me) || (!!me.maNV && r.MaNV===me.maNV));
  });
  var nsMap={}; nhanSuGomTP_().forEach(function(x){ nsMap[x.MaNV]=x; });
  ds=ds.map(function(r){
    var ns=nsMap[r.MaNV]||{};
    return { MaNghi:r.MaNghi, MaNV:r.MaNV, HoTen:ns.HoTen||r.MaNV, MaXuong:r.MaXuong,
      TenXuong:tenXuong_(r.MaXuong), Loai:r.Loai, TuNgay:ngayVN_(r.TuNgay), DenNgay:ngayVN_(r.DenNgay),
      GhiChu:r.GhiChu||'' };
  });
  ds.sort(function(a,b){ return String(b.TuNgay).localeCompare(String(a.TuNgay)); });
  return sach_({ ok:true, ds:ds, laTP:(me.vaiTro==='TP') });
}

/* Xóa một đăng ký nghỉ dài hạn (TP). */
function xoaNghiDaiHan(token, maNghi){
  var me=docPhien_(token);
  if(!me) return sach_({ ok:false, hetHan:true, msg:'Phiên hết hạn.' });
  khoa_();
  if(me.vaiTro!=='TP') return sach_({ ok:false, msg:'Chỉ trưởng phòng được xóa.' });
  var r=docAnToan_('NghiDaiHan').filter(function(x){ return x.MaNghi===maNghi; })[0];
  if(!r) return sach_({ ok:false, msg:'Không tìm thấy bản ghi.' });
  if(r.MaXuong!==me.xuong) return sach_({ ok:false, msg:'Chỉ xóa được của xưởng mình.' });
  xoaDong_('NghiDaiHan', r._row);
  ghiLog_(me, 'Xóa nghỉ dài hạn', r.MaNV+' · '+r.Loai);
  return sach_({ ok:true, msg:'Đã xóa đăng ký nghỉ dài hạn.' });
}

/* Dọn các dòng chấm tay bị TRÙNG (thừa) với nghỉ dài hạn — chỉ xóa dòng có ký hiệu
   giống ký hiệu nghỉ dài hạn (ví dụ TS/Nkl bị điền đè), GIỮ LẠI chấm tay ngày đi làm
   thật (x, 0.5x, đi muộn) để không mất dữ liệu. */
function donChamTayTrungNDH(token, ky){
  var me = docPhien_(token);
  if (!me) return sach_({ ok:false, hetHan:true, msg:'Phiên hết hạn.' });
  khoa_();
  if (me.vaiTro !== 'TP') return sach_({ ok:false, msg:'Chỉ trưởng phòng được dọn.' });
  if (!ky) return sach_({ ok:false, msg:'Thiếu tháng.' });

  var xuong = me.xuong;
  var ndh = docAnToan_('NghiDaiHan').filter(function(r){ return r.MaXuong === xuong; });
  if (!ndh.length) return sach_({ ok:true, msg:'Xưởng chưa có ai đăng ký nghỉ dài hạn.', da:0 });

  var cham = doc_('DiemDanhNghi').filter(function(r){
    return String(ngayVN_(r.Ngay)).slice(0,7) === ky && r.MaXuong === xuong;
  });

  var canXoa = cham.filter(function(r){
    var ng = ngayVN_(r.Ngay);
    // Tìm khoảng nghỉ dài hạn phủ lên người + ngày này
    var d = ndh.filter(function(x){
      return x.MaNV === r.MaNV && ngayVN_(x.TuNgay) <= ng && ng <= ngayVN_(x.DenNgay);
    })[0];
    if (!d) return false;                         // không nằm trong kỳ nghỉ -> giữ nguyên
    var khNdh = kyHieuNDH_(d.Loai);               // ký hiệu đúng của kỳ nghỉ (TS/Nkl)
    var khGhi = khTuBanGhi_(r);                   // ký hiệu của dòng chấm tay
    // Chỉ xóa nếu dòng chấm tay TRÙNG ký hiệu nghỉ dài hạn (thừa) HOẶC là loại nghỉ khác
    // (P, Ta, Nkp... — nhầm lẫn trong kỳ nghỉ). GIỮ LẠI nếu là ngày đi làm thật.
    var laDiLam = (khGhi === 'x' || khGhi === '0.5x' || khGhi.indexOf('x-') === 0);
    return !laDiLam;                              // không phải đi làm -> xóa (trả về ký hiệu nghỉ dài hạn)
  });

  xoaNhieuDong_('DiemDanhNghi', canXoa.map(function(r){ return r._row; }));
  ghiLog_(me, 'Dọn chấm tay trùng nghỉ dài hạn', 'Kỳ ' + ky + ' — ' + canXoa.length + ' dòng');
  return sach_({ ok:true, da: canXoa.length,
    msg: canXoa.length ? ('Đã dọn ' + canXoa.length + ' ngày chấm tay trùng nghỉ dài hạn. Giữ nguyên các ngày đi làm thật; các ngày nghỉ hiển thị theo đăng ký.') 
                       : 'Không có ngày chấm tay nào cần dọn.' });
}

/* Suy ký hiệu chấm công từ một bản ghi DiemDanhNghi.
   Ưu tiên cột KyHieu; nếu dữ liệu cũ chỉ có LyDo thì suy từ nhãn. */
function khTuBanGhi_(r){
  var kh = String(r.KyHieu||'').trim();
  if (kh) return kh;
  var l = String(r.LyDo||'').toLowerCase().trim();
  if (!l) return 'P';
  // Khớp nhãn cũ -> ký hiệu chuẩn
  if (l === 'ts' || l.indexOf('thai sản') >= 0) return 'TS';
  if (l.indexOf('nửa ngày') >= 0 || l === '0.5x') return '0.5x';
  if (l.indexOf('không phép') >= 0) return 'Nkp';
  if (l.indexOf('không lương') >= 0) return 'Nkl';
  if (l.indexOf('nghỉ bù') >= 0 || l === 'nb') return 'Nb';
  if (l.indexOf('nghỉ lễ') >= 0 || l === 'nl') return 'NL';
  if (l.indexOf('cưới') >= 0 || l.indexOf('cươi') >= 0 || l === 'cu') return 'Cu';
  if (l.indexOf('tang') >= 0 || l === 'ta') return 'Ta';
  if (l.indexOf('phép') >= 0 || l === 'p') return 'P';
  if (l.indexOf('ốm') >= 0 || l.indexOf('om') >= 0) return 'Nkl';  // ốm dài -> Nkl
  if (l.indexOf('bệnh') >= 0 || l.indexOf('viện') >= 0) return 'Nkl'; // nghỉ bệnh, nằm viện -> như ốm
  if (l.indexOf('gia đình') >= 0 || /(^|\s)gđ(\s|$)/.test(l)) return 'Nkl';   // việc gia đình / "cv gđ" -> Nkl
  if (l.indexOf('đi muộn') >= 0) {
    if (l.indexOf('0.5') >= 0) return 'x-0.5';
    if (l.indexOf('1.5') >= 0) return 'x-1.5';
    if (l.indexOf('1') >= 0) return 'x-1';
    if (l.indexOf('2') >= 0) return 'x-2';
    return 'x-1';
  }
  return 'P'; // mặc định cuối: coi là nghỉ phép (không tính công)
}

function thongKeNghiThang(token, kyThang, maXuong) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok:false, hetHan:true, msg:'Phiên hết hạn.' });
  if (!xemCaNhaMay_(me) && me.vaiTro !== 'TP') return sach_({ ok:false, msg:'Không có quyền xem thống kê nghỉ.' });
  return nho_('thongKeNghiThang', [kyThang || kyVN_(), maXuong || '', me.vaiTro, me.xuong], function() { return thongKeNghiThangGoc_(token, kyThang, maXuong); });
}
function thongKeNghiThangGoc_(token, kyThang, maXuong) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok:false, hetHan:true, msg:'Phiên hết hạn.' });

  var ky = kyThang || kyVN_();
  var xuongLoc = (me.vaiTro === 'TP') ? me.xuong : (maXuong || '');

  var ns = nhanSuGomTP_();
  if (xuongLoc) ns = ns.filter(function(x){ return x.MaXuong === xuongLoc; });

  var ghi = doc_('DiemDanhNghi').filter(function(r){
    return String(ngayVN_(r.Ngay)).slice(0,7) === ky && (!xuongLoc || r.MaXuong === xuongLoc);
  });

  // Ký hiệu của mỗi bản ghi: ưu tiên cột KyHieu; nếu dữ liệu cũ chỉ có LyDo thì suy ra
  var khCuaBanGhi = khTuBanGhi_;

  // Gom theo người (thống kê số ngày nghỉ)
  var theoNguoi = {};
  ns.forEach(function(x){
    theoNguoi[x.MaNV] = { MaNV:x.MaNV, HoTen:x.HoTen, MaXuong:x.MaXuong,
      tong:0, coPhep:0, khongPhep:0, muon:0, nuaNgay:0, ngayNghi:[] };
  });
  ghi.forEach(function(r){
    var k = theoNguoi[r.MaNV]; if (!k) return;
    var ngD = ngayVN_(r.Ngay), kh = khCuaBanGhi(r);
    if (laVangKyHieu_(kh)) {           // Nkl hoặc P = vắng
      k.tong++;
      if (laKhongPhepKyHieu_(kh)) k.khongPhep++; else k.coPhep++;
    } else if (kh === '0.5x') { k.nuaNgay++; }
    else if (kh.indexOf('x-') === 0) { k.muon++; }
    k.ngayNghi.push({ ngay:ngD, ngayDMY:ngD.slice(8)+'/'+ngD.slice(5,7), kyHieu:kh, lyDo:r.LyDo||'',
      kp:laKhongPhepKyHieu_(kh), vang:laVangKyHieu_(kh) });
  });

  var dsNguoi = Object.keys(theoNguoi).map(function(k){ return theoNguoi[k]; })
    .filter(function(o){ return o.ngayNghi.length > 0; });
  dsNguoi.forEach(function(o){ o.ngayNghi.sort(function(a,b){ return a.ngay.localeCompare(b.ngay); }); });
  dsNguoi.sort(function(a,b){ return b.tong - a.tong || b.khongPhep - a.khongPhep; });

  // Lịch lưới: các ngày trong tháng
  var nam = Number(ky.slice(0,4)), thang = Number(ky.slice(5,7));
  var soNgay = new Date(nam, thang, 0).getDate();
  var cacNgay = [];
  for (var d=1; d<=soNgay; d++){
    var dt = new Date(nam, thang-1, d);
    cacNgay.push({ ngay:d, thu:dt.getDay(), cn:(dt.getDay()===0) });
  }
  // Map: MaNV -> {ngày(số) -> kýhiệu}
  var luoiMap = {};
  ghi.forEach(function(r){
    var ngD = ngayVN_(r.Ngay), dd = Number(ngD.slice(8));
    (luoiMap[r.MaNV] = luoiMap[r.MaNV] || {})[dd] = khCuaBanGhi(r);
  });
  // Sắp nhân sự theo xưởng rồi theo tên (để ADMIN nhóm theo phòng)
  ns.sort(function(a,b){
    if (a.MaXuong !== b.MaXuong) return String(a.MaXuong).localeCompare(String(b.MaXuong));
    return String(a.HoTen).localeCompare(String(b.HoTen), 'vi');
  });
  // Xác định "hôm nay" theo giờ VN để phân biệt ngày đã qua / chưa tới
  var homNay = ngayVN_(new Date());
  var soNgayHienTai = (homNay.slice(0,7) === ky) ? Number(homNay.slice(8)) : (homNay.slice(0,7) > ky ? 99 : 0);

  // Nạp nghỉ dài hạn giao với tháng này -> map MaNV -> {ngày(số) -> {kh, loai}}
  var ndhAll = docAnToan_('NghiDaiHan').filter(function(r){
    return (!xuongLoc || r.MaXuong === xuongLoc);
  });
  var ndhMap = {};        // MaNV -> {ngày -> kýhiệu}
  var ndhNguoi = {};      // MaNV -> {loai, tuNgay, denNgay} (bản ghi áp vào tháng, để hiển thị)
  ndhAll.forEach(function(r){
    var tu = ngayVN_(r.TuNgay), den = ngayVN_(r.DenNgay);
    var kh = kyHieuNDH_(r.Loai);
    for (var d=1; d<=soNgay; d++){
      var ngayStr = ky + '-' + ('0'+d).slice(-2);
      if (ngayStr >= tu && ngayStr <= den){
        (ndhMap[r.MaNV] = ndhMap[r.MaNV] || {})[d] = kh;
        if (!ndhNguoi[r.MaNV]) ndhNguoi[r.MaNV] = { loai:r.Loai, tuNgay:tu, denNgay:den, maNghi:r.MaNghi };
      }
    }
  });

  function xayNguoi(x){
    var tongCong = 0, soNgayLam = 0, soNgayNghiDH = 0;
    var cells = cacNgay.map(function(c){
      if (c.cn) return { kh:'', cn:true };
      var daCham = (luoiMap[x.MaNV] && luoiMap[x.MaNV][c.ngay]);   // chấm tay (ưu tiên cao nhất)
      var ndh = (ndhMap[x.MaNV] && ndhMap[x.MaNV][c.ngay]);       // nghỉ dài hạn điền sẵn
      var tuongLai = (c.ngay > soNgayHienTai);
      var kh, laNdh = false;
      if (daCham) { kh = daCham; }                    // trưởng phòng đã chấm tay -> ưu tiên
      else if (ndh) { kh = ndh; soNgayNghiDH++; laNdh = true; }   // nghỉ dài hạn điền sẵn
      else { kh = tuongLai ? '' : 'x'; }              // còn lại: đã qua = x, chưa tới = trống
      var cong = kh ? congTheoKyHieu_(kh) : 0;
      tongCong += cong;
      if (cong > 0) soNgayLam++;                      // có công = ngày đi làm thực
      return { kh:kh, cn:false, tuongLai:tuongLai, ndh: laNdh };
    });
    return { MaNV:x.MaNV, HoTen:x.HoTen, MaXuong:x.MaXuong, TenXuong:tenXuong_(x.MaXuong),
      cells:cells, tongCong: Math.round(tongCong*10)/10,
      soNgayNghiDH:soNgayNghiDH, soNgayLam:soNgayLam };
  }

  // Số ngày làm việc trong tháng (không tính Chủ nhật)
  var soNgayLamViec = cacNgay.filter(function(c){ return !c.cn; }).length;

  var luoiNguoi = [];      // hiện trong bảng chấm chính
  var nghiTronThang = [];  // đánh dấu ai nghỉ trọn tháng (để ghi chú, KHÔNG ẩn khỏi bảng)
  ns.forEach(function(x){
    var o = xayNguoi(x);
    // Người nghỉ trọn tháng vẫn hiển thị trong bảng chấm (các ngày là ký hiệu nghỉ),
    // chỉ đánh dấu thêm để mục "Đang nghỉ dài hạn" biết là trọn tháng.
    if (ndhNguoi[x.MaNV] && o.soNgayNghiDH >= soNgayLamViec && o.soNgayLam === 0){
      nghiTronThang.push({ MaNV:x.MaNV });
    }
    luoiNguoi.push(o);
  });

  // Danh sách tất cả nghỉ dài hạn giao với tháng (để hiển thị mục riêng đầy đủ)
  var dsNghiDH = Object.keys(ndhNguoi).map(function(mnv){
    var ns2 = ns.filter(function(x){ return x.MaNV===mnv; })[0] || { HoTen:mnv, MaXuong:'' };
    var info = ndhNguoi[mnv];
    return { MaNV:mnv, HoTen:ns2.HoTen, MaXuong:ns2.MaXuong, TenXuong:tenXuong_(ns2.MaXuong),
      Loai:info.loai, TuNgay:info.tuNgay, DenNgay:info.denNgay, MaNghi:info.maNghi,
      tronThang: nghiTronThang.some(function(t){ return t.MaNV===mnv; }) };
  });
  dsNghiDH.sort(function(a,b){ return String(a.TenXuong).localeCompare(String(b.TenXuong)) || String(a.HoTen).localeCompare(String(b.HoTen),'vi'); });

  return sach_({ ok:true, ky:ky, dsNguoi:dsNguoi, cacNgay:cacNgay, luoiNguoi:luoiNguoi,
    nghiDaiHan:dsNghiDH, soNgay:soNgay, tenXuong: xuongLoc ? tenXuong_(xuongLoc) : '',
    laTP: (me.vaiTro==='TP') });
}

/* Công quy đổi theo ký hiệu, gồm cả ký hiệu nghỉ dài hạn */
/* Bảng chấm công cá nhân — công nhân xem lịch của chính mình để đối chiếu/khiếu nại. */
function layChamCongCaNhan(token, kyThang){
  var me = docPhien_(token);
  if (!me) return sach_({ ok:false, hetHan:true, msg:'Phiên hết hạn.' });
  var maNV = me.maNV;
  if (!maNV) return sach_({ ok:false, msg:'Tài khoản chưa gắn mã nhân viên.' });

  var ky = kyThang || kyVN_();

  // Lấy thông tin nhân sự
  var ns = nhanSuGomTP_().filter(function(x){ return x.MaNV === maNV; })[0];
  if (!ns) return sach_({ ok:false, msg:'Không tìm thấy hồ sơ nhân sự.' });

  // Chấm tay trong tháng (DiemDanhNghi)
  var ghi = doc_('DiemDanhNghi').filter(function(r){
    return r.MaNV === maNV && String(ngayVN_(r.Ngay)).slice(0,7) === ky;
  });
  var khCuaBanGhi = khTuBanGhi_;
  var luoiMap = {};
  ghi.forEach(function(r){ luoiMap[Number(ngayVN_(r.Ngay).slice(8))] = khCuaBanGhi(r); });

  // Nghỉ dài hạn giao với tháng
  var ndhMap = {}, ndhInfo = null;
  docAnToan_('NghiDaiHan').filter(function(r){ return r.MaNV === maNV; }).forEach(function(r){
    var tu = ngayVN_(r.TuNgay), den = ngayVN_(r.DenNgay), kh = kyHieuNDH_(r.Loai);
    for (var d=1; d<=31; d++){
      var s = ky+'-'+('0'+d).slice(-2);
      if (s>=tu && s<=den){ ndhMap[d]=kh; if(!ndhInfo) ndhInfo={loai:r.Loai,tuNgay:tu,denNgay:den}; }
    }
  });

  var nam = Number(ky.slice(0,4)), thang = Number(ky.slice(5,7));
  var soNgay = new Date(nam, thang, 0).getDate();
  var homNay = ngayVN_(new Date());
  var soNgayHienTai = (homNay.slice(0,7) === ky) ? Number(homNay.slice(8)) : (homNay.slice(0,7) > ky ? 99 : 0);

  var cacNgay = [], tongCong = 0;
  for (var d=1; d<=soNgay; d++){
    var dt = new Date(nam, thang-1, d), cn = (dt.getDay()===0);
    var kh;
    if (cn) kh = '';
    else {
      var daCham = luoiMap[d], ndh = ndhMap[d], tuongLai = (d > soNgayHienTai);
      kh = daCham ? daCham : (ndh ? ndh : (tuongLai ? '' : 'x'));
      if (kh) tongCong += congTheoKyHieu_(kh);
    }
    cacNgay.push({ ngay:d, thu:dt.getDay(), cn:cn, kh:kh });
  }

  return sach_({ ok:true, ky:ky, MaNV:maNV, HoTen:ns.HoTen, TenXuong:tenXuong_(ns.MaXuong),
    cacNgay:cacNgay, tongCong: Math.round(tongCong*10)/10, nghiDaiHan:ndhInfo });
}

/* Bảng chấm công CẢ XƯỞNG trong 1 tháng (cho công nhân xem để minh bạch).
   Trả: danh sách người, mỗi người có mảng ký hiệu theo từng ngày + tổng công. */
function layChamCongXuongThang(token, kyThang){
  var me = docPhien_(token);
  if (!me) return sach_({ ok:false, hetHan:true, msg:'Phiên hết hạn.' });
  var maNV = me.maNV;
  if (!maNV) return sach_({ ok:false, msg:'Tài khoản chưa gắn mã nhân viên.' });

  // Xưởng của người đăng nhập
  var nsMe = nhanSuGomTP_().filter(function(x){ return x.MaNV === maNV; })[0];
  if (!nsMe) return sach_({ ok:false, msg:'Không tìm thấy hồ sơ nhân sự.' });
  var maXuong = nsMe.MaXuong;

  var ky = kyThang || kyVN_();
  var nam = Number(ky.slice(0,4)), thang = Number(ky.slice(5,7));
  var soNgay = new Date(nam, thang, 0).getDate();
  var homNay = ngayVN_(new Date());
  var soNgayHienTai = (homNay.slice(0,7) === ky) ? Number(homNay.slice(8)) : (homNay.slice(0,7) > ky ? 99 : 0);

  // Nhân sự cùng xưởng (còn làm việc)
  var dsNS = nhanSuGomTP_().filter(function(x){
    return x.MaXuong === maXuong && String(x.TrangThai).trim() !== 'Nghỉ việc';
  });

  // Chấm tay trong tháng (DiemDanhNghi) — gom theo MaNV -> ngày -> ký hiệu
  var ghiThang = doc_('DiemDanhNghi').filter(function(r){
    return String(ngayVN_(r.Ngay)).slice(0,7) === ky;
  });
  var chamMap = {};   // maNV -> { ngày(số) -> ký hiệu }
  ghiThang.forEach(function(r){
    var mnv = r.MaNV;
    if (!chamMap[mnv]) chamMap[mnv] = {};
    chamMap[mnv][ Number(ngayVN_(r.Ngay).slice(8)) ] = khTuBanGhi_(r);
  });

  // Nghỉ dài hạn giao với tháng — gom theo MaNV -> ngày -> ký hiệu
  var ndhMap = {};    // maNV -> { ngày(số) -> ký hiệu }
  docAnToan_('NghiDaiHan').forEach(function(r){
    var tu = ngayVN_(r.TuNgay), den = ngayVN_(r.DenNgay), kh = kyHieuNDH_(r.Loai);
    if (!ndhMap[r.MaNV]) ndhMap[r.MaNV] = {};
    for (var d=1; d<=soNgay; d++){
      var s = ky+'-'+('0'+d).slice(-2);
      if (s>=tu && s<=den) ndhMap[r.MaNV][d] = kh;
    }
  });

  // Tạo tiêu đề cột ngày (thứ trong tuần để tô Chủ nhật)
  var cotNgay = [];
  for (var d=1; d<=soNgay; d++){
    var dt = new Date(nam, thang-1, d);
    cotNgay.push({ ngay:d, thu:dt.getDay(), cn:(dt.getDay()===0) });
  }

  // Dựng từng người
  var nguoi = dsNS.map(function(x){
    var cham = chamMap[x.MaNV] || {}, ndh = ndhMap[x.MaNV] || {};
    var oNgay = [], tongCong = 0;
    for (var d=1; d<=soNgay; d++){
      var dt = new Date(nam, thang-1, d), cn = (dt.getDay()===0);
      var kh;
      if (cn) kh = '';
      else {
        var tuongLai = (d > soNgayHienTai);
        kh = cham[d] ? cham[d] : (ndh[d] ? ndh[d] : (tuongLai ? '' : 'x'));
        if (kh) tongCong += congTheoKyHieu_(kh);
      }
      oNgay.push(kh);
    }
    return { MaNV:x.MaNV, HoTen:x.HoTen, laToi:(x.MaNV===maNV),
      ngay:oNgay, tongCong: Math.round(tongCong*10)/10 };
  });

  // Sắp xếp: mình lên đầu, còn lại theo tên
  nguoi.sort(function(a,b){
    if (a.laToi !== b.laToi) return a.laToi ? -1 : 1;
    return String(a.HoTen).localeCompare(String(b.HoTen), 'vi');
  });

  return sach_({ ok:true, ky:ky, maXuong:maXuong, tenXuong:tenXuong_(maXuong),
    cotNgay:cotNgay, nguoi:nguoi });
}


/* ============================================================
   ===== BAN ĐIỀU HÀNH TỪ CHỐI DÒNG ĐÃ CHỐT + THÔNG BÁO TP =====
   - Chỉ ADMIN (ban điều hành) được dùng.
   - Chỉ áp dụng cho dòng đang "Đã chốt" (dòng "Chờ duyệt" để TP xử lý).
   - Từ chối => trạng thái "Từ chối" (KPI tự động bỏ, vì KPI chỉ tính "Đã chốt").
   - Ghi lý do (tùy chọn) và tạo thông báo trong app cho TP xưởng tương ứng.
   - KHÔNG đụng tới KCS (theo yêu cầu — KCS bàn riêng sau).
   ============================================================ */

/* Đảm bảo sheet ThongBao tồn tại, tiêu đề cột chuẩn. */
function taoSheetThongBao_() {
  var ss = ss_();
  var sh = ss.getSheetByName('ThongBao');
  if (!sh) {
    sh = ss.insertSheet('ThongBao');
    sh.getRange(1, 1, 1, 8).setValues([[
      'MaTB','ThoiDiem','MaXuong','NguoiNhan','TieuDe','NoiDung','DaDoc','NguoiTao'
    ]]).setFontWeight('bold').setBackground('#12313a').setFontColor('#ffffff');
    sh.setFrozenRows(1);
  }
  return sh;
}

/* Ban điều hành từ chối một dòng ĐÃ CHỐT. lyDo có thể rỗng. */
function banDieuHanhTuChoi(token, maDong, lyDo) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (me.vaiTro !== 'ADMIN') return sach_({ ok: false, msg: 'Chỉ ban điều hành mới được từ chối dòng đã chốt.' });
  if (!me.laOwner) return sach_({ ok: false, msg: 'Chỉ chủ sở hữu được từ chối dòng đã chốt.' });

  var r = doc_('NhatKySanXuat').filter(function(x) { return x.MaDong === maDong; })[0];
  if (!r) return sach_({ ok: false, msg: 'Không tìm thấy dòng.' });
  if (String(r.TrangThai).trim() !== 'Đã chốt') {
    return sach_({ ok: false, msg: 'Chỉ từ chối được dòng đang ở trạng thái "Đã chốt".' });
  }

  lyDo = String(lyDo || '').trim();

  // Xác định xưởng của dòng (theo công đoạn) để gửi thông báo đúng trưởng phòng
  var cd = doc_('CongDoan').filter(function(x) { return x.MaCD === r.MaCD; })[0];
  var maXuong = cd ? cd.MaXuong : '';

  // 1) Chuyển trạng thái về "Từ chối" và ghi lý do (để công nhân/TP biết đường sửa)
  suaO_('NhatKySanXuat', r._row, 'TrangThai', 'Từ chối');
  ghiCotNeuCo_('NhatKySanXuat', r._row, 'LyDoTuChoi',
    'BĐH từ chối' + (lyDo ? ': ' + lyDo : ''));
  suaO_('NhatKySanXuat', r._row, 'NguoiNhap',
    String(r.NguoiNhap || '') + ' → BĐH từ chối: ' + me.ten);

  // 2) Tạo thông báo trong app cho trưởng phòng xưởng đó
  var tenNV = (doc_('NhanSu').filter(function(x){ return x.MaNV === r.MaNV; })[0] || {}).HoTen || r.MaNV;
  var tenCD = cd ? cd.TenCD : r.MaCD;
  taoThongBao_(maXuong,
    'Ban điều hành đã từ chối một dòng đã chốt',
    'Ngày ' + ngayVN_(r.Ngay).split('-').reverse().join('/') +
    ' — ' + tenNV + ' — ' + tenCD +
    ' — SL ' + r.SoLuongLamRa +
    (lyDo ? ' — Lý do: ' + lyDo : '') +
    '. Vui lòng kiểm tra và xử lý lại.',
    me.ten);

  ghiLog_(me, 'BĐH từ chối dòng đã chốt',
    r.MaNV + ' — ' + r.MaCD + ' — SL ' + r.SoLuongLamRa + (lyDo ? ' — ' + lyDo : ''),
    'Đã chốt', 'Từ chối');

  return sach_({ ok: true, msg: 'Đã từ chối dòng và gửi thông báo cho trưởng phòng xưởng ' + (maXuong || '(không rõ)') + '.' });
}

/* Ban điều hành từ chối HÀNG LOẠT nhiều dòng đã chốt. Không cần lý do.
   Trả về số dòng từ chối được. Gửi thông báo gộp cho từng TP theo xưởng. */
function banDieuHanhTuChoiNhieu(token, maDongList) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (me.vaiTro !== 'ADMIN') return sach_({ ok: false, msg: 'Chỉ ban điều hành mới được từ chối.' });
  if (!me.laOwner) return sach_({ ok: false, msg: 'Chỉ chủ sở hữu được từ chối dòng đã chốt.' });
  if (!maDongList || !maDongList.length) return sach_({ ok: false, msg: 'Chưa chọn dòng nào.' });

  var nk = doc_('NhatKySanXuat');
  var congdoan = doc_('CongDoan');
  var nhansu = doc_('NhanSu');
  var theoXuong = {};   // gom dòng bị từ chối theo xưởng để báo TP một lần
  var soTuChoi = 0;

  maDongList.forEach(function(maDong) {
    var r = nk.filter(function(x) { return x.MaDong === maDong; })[0];
    if (!r) return;
    if (String(r.TrangThai).trim() !== 'Đã chốt') return;

    suaO_('NhatKySanXuat', r._row, 'TrangThai', 'Từ chối');
    ghiCotNeuCo_('NhatKySanXuat', r._row, 'LyDoTuChoi', 'BĐH từ chối (hàng loạt)');
    suaO_('NhatKySanXuat', r._row, 'NguoiNhap',
      String(r.NguoiNhap || '') + ' → BĐH từ chối: ' + me.ten);

    var cd = congdoan.filter(function(x) { return x.MaCD === r.MaCD; })[0];
    var maXuong = cd ? cd.MaXuong : '';
    var tenNV = (nhansu.filter(function(x){ return x.MaNV === r.MaNV; })[0] || {}).HoTen || r.MaNV;
    var tenCD = cd ? cd.TenCD : r.MaCD;
    (theoXuong[maXuong] = theoXuong[maXuong] || []).push(
      ngayVN_(r.Ngay).split('-').reverse().join('/') + ' — ' + tenNV + ' — ' + tenCD + ' — SL ' + r.SoLuongLamRa);
    soTuChoi++;
  });

  if (!soTuChoi) return sach_({ ok: false, msg: 'Không có dòng hợp lệ để từ chối (chỉ từ chối được dòng đã chốt).' });

  // Gửi một thông báo gộp cho mỗi xưởng
  Object.keys(theoXuong).forEach(function(maXuong) {
    var list = theoXuong[maXuong];
    taoThongBao_(maXuong,
      'Ban điều hành đã từ chối ' + list.length + ' dòng đã chốt',
      list.join(' | ') + '. Vui lòng kiểm tra và xử lý lại.',
      me.ten);
  });

  ghiLog_(me, 'BĐH từ chối hàng loạt', soTuChoi + ' dòng', 'Đã chốt', 'Từ chối');
  return sach_({ ok: true, msg: 'Đã từ chối ' + soTuChoi + ' dòng và gửi thông báo cho các trưởng phòng liên quan.' });
}


function taoThongBao_(maXuong, tieuDe, noiDung, nguoiTao) {
  var sh = taoSheetThongBao_();
  sh.appendRow(dongAnToan_([
    ma_('TB'), new Date(), maXuong || '', 'TP', tieuDe || '', noiDung || '', 'Chưa', nguoiTao || ''
  ]));
  xoaCache_('ThongBao');
}

/* Đọc thông báo cho người đang đăng nhập (chỉ TP, theo xưởng). Mới nhất trước. */
function docThongBao(token) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (!ss_().getSheetByName('ThongBao')) return sach_({ ok: true, ds: [] });

  var ds = doc_('ThongBao');
  if (me.vaiTro === 'TP') {
    ds = ds.filter(function(t){ return String(t.MaXuong) === String(me.xuong); });
  } else if (me.vaiTro !== 'ADMIN') {
    ds = [];   // vai trò khác không nhận loại thông báo này
  }
  ds = ds.map(function(t){
    return { MaTB: t.MaTB, ThoiDiem: t.ThoiDiem, TieuDe: t.TieuDe,
             NoiDung: t.NoiDung, DaDoc: t.DaDoc, MaXuong: t.MaXuong };
  }).reverse();
  return sach_({ ok: true, ds: ds });
}

/* Đánh dấu một thông báo đã đọc. */
function danhDauDaDoc(token, maTB) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  var t = doc_('ThongBao').filter(function(x){ return x.MaTB === maTB; })[0];
  if (!t) return sach_({ ok: false, msg: 'Không tìm thấy thông báo.' });
  if (me.vaiTro !== 'ADMIN' && !(me.vaiTro === 'TP' && String(t.MaXuong) === String(me.xuong)))
    return sach_({ ok: false, msg: 'Không có quyền.' });
  suaO_('ThongBao', t._row, 'DaDoc', 'Rồi');
  return sach_({ ok: true });
}

/* Ghi vào một cột nếu cột đó tồn tại trong sheet; nếu chưa có thì tự thêm cột rồi ghi.
   Dùng cho LyDoTuChoi — tránh lỗi khi sheet cũ chưa có cột này. */
function ghiCotNeuCo_(sheetName, row, colName, val) {
  var sh = ss_().getSheetByName(sheetName);
  if (!sh) return;
  var head = dauCot_(sheetName);
  if (head.indexOf(colName) < 0) {
    // thêm cột mới ở cuối
    sh.getRange(1, head.length + 1).setValue(colName).setFontWeight('bold')
      .setBackground('#12313a').setFontColor('#ffffff');
    delete __HEAD_CACHE[sheetName];
  }
  suaO_(sheetName, row, colName, val);                // vào bộ đệm ghi như các ô khác
}
/* ============================================================
   ===== KIỂM TRA TỒN "CHỜ DUYỆT" THEO THÁNG (cho ban điều hành) =====
   Trả về danh sách xưởng còn dòng chưa duyệt trong một tháng, kèm số dòng.
   Dùng để biết trước khi chốt bù: xưởng nào cần TP duyệt nốt. Chỉ đọc, không sửa.
   ============================================================ */
function kiemTraTonThang(token, kyThang) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (me.vaiTro !== 'ADMIN') return sach_({ ok: false, msg: 'Chỉ ban điều hành mới xem được.' });

  var ky = String(kyThang || '').slice(0, 7);
  if (!/^\d{4}-\d{2}$/.test(ky)) return sach_({ ok: false, msg: 'Kỳ không hợp lệ (cần dạng yyyy-MM).' });

  var congdoan = doc_('CongDoan');
  var phongban = doc_('PhongBan');
  var xuongCua = function(maCD) {
    var c = congdoan.filter(function(x){ return x.MaCD === maCD; })[0];
    return c ? c.MaXuong : '(không rõ)';
  };

  var demTheoXuong = {};
  docNKTu_(String(kyThang || kyVN_()) + '-01').forEach(function(r) {
    if (String(r.TrangThai).trim() !== 'Chờ duyệt') return;
    if (ngayVN_(r.Ngay).slice(0, 7) !== ky) return;
    var mx = xuongCua(r.MaCD);
    demTheoXuong[mx] = (demTheoXuong[mx] || 0) + 1;
  });

  var ds = phongban
    .filter(function(p){ return String(p.TrangThai).trim() !== 'Ngừng'; })
    .map(function(p) {
      return { maXuong: p.MaXuong, tenXuong: p.TenXuong, ton: demTheoXuong[p.MaXuong] || 0 };
    });
  if (demTheoXuong['(không rõ)']) {
    ds.push({ maXuong: '(không rõ)', tenXuong: 'Công đoạn chưa gán xưởng', ton: demTheoXuong['(không rõ)'] });
  }

  var tongTon = ds.reduce(function(s, o){ return s + o.ton; }, 0);
  ds.sort(function(a, b){ return b.ton - a.ton; });

  return sach_({ ok: true, ky: ky, tongTon: tongTon, ds: ds });
}

/* Chạy 1 lần trong Apps Script: chuyển mọi Ky cũ (đang là Date) về text 'yyyy-MM'.
   Sau khi chạy, cột Ky sạch, không còn phụ thuộc chuanKy_ khi đọc. */
function SUA_KY_KPITHANG_VE_TEXT() {
  if (!noiBo_(arguments[0])) return chanWeb_('SUA_KY_KPITHANG_VE_TEXT');
  var sh = ss_().getSheetByName('KPIThang');
  if (!sh) { Logger.log('Không có sheet KPIThang'); return; }
  var last = sh.getLastRow();
  if (last < 2) { Logger.log('Sheet trống'); return; }

  var rng = sh.getRange(2, 1, last - 1, 1);
  rng.setNumberFormat('@');                       // ép cột Ky thành text trước
  var vals = rng.getValues();
  var out = vals.map(function(row){ return [ chuanKy_(row[0]) ]; });
  rng.setValues(out);
  xoaCache_('KPIThang');
  Logger.log('Đã chuẩn hóa ' + out.length + ' dòng Ky về dạng yyyy-MM (text).');
}

/* ============================================================
   ===== CHẨN ĐOÁN BẢNG KPI TRỐNG (chạy 1 lần trong Apps Script) =====
   Chọn hàm CHAN_DOAN_KPI_THANG8 ở thanh trên, bấm Chạy, xem Nhật ký thực thi.
   In ra: sheet KPIThang có bao nhiêu dòng tháng 8, giá trị cột Ky thực tế
   (kèm kiểu dữ liệu), và layKPIKy trả về bao nhiêu người.
   ============================================================ */
function CHAN_DOAN_KPI_THANG8() {
  if (!noiBo_(arguments[0])) return chanWeb_('CHAN_DOAN_KPI_THANG8');
  var thg = '2026-08';
  var sh = ss_().getSheetByName('KPIThang');
  if (!sh) { Logger.log('KHÔNG có sheet KPIThang'); return; }

  var v = sh.getDataRange().getValues();
  Logger.log('Tổng số dòng KPIThang (gồm tiêu đề): ' + v.length);
  Logger.log('Tiêu đề cột: ' + JSON.stringify(v[0]));

  // Xem 5 giá trị cột Ky đầu tiên + kiểu dữ liệu
  Logger.log('--- 5 giá trị cột Ky (cột 1) và kiểu ---');
  for (var i = 1; i <= Math.min(5, v.length - 1); i++) {
    var ky = v[i][0];
    Logger.log('Dòng ' + i + ': Ky = [' + ky + '] — kiểu: ' + typeof ky +
      (Object.prototype.toString.call(ky) === '[object Date]' ? ' (LÀ DATE!)' : ''));
  }

  // Đếm dòng khớp '2026-08' theo cách laySnapshotThang_ đang so sánh
  var khop = 0, khongKhop = 0, mauKhongKhop = [];
  for (var j = 1; j < v.length; j++) {
    if (String(v[j][0]) === thg) khop++;
    else { khongKhop++; if (mauKhongKhop.length < 5) mauKhongKhop.push('[' + v[j][0] + ']'); }
  }
  Logger.log('--- So khớp String(Ky) === "2026-08" ---');
  Logger.log('KHỚP: ' + khop + ' dòng | KHÔNG khớp: ' + khongKhop);
  Logger.log('Mẫu Ky không khớp: ' + mauKhongKhop.join(' '));

  // Gọi thẳng hàm đọc snapshot
  xoaCache_('KPIThang');
  var snap = laySnapshotThang_(thg, '');
  Logger.log('--- laySnapshotThang_("2026-08","") trả về: ' + snap.length + ' dòng ---');
  if (snap.length) Logger.log('Dòng đầu: ' + JSON.stringify(snap[0]));
}

/* ============================================================
   ===== PHÂN TÍCH ĐỊNH MỨC: công đoạn nào có quá nhiều người vượt 90% =====
   Cho ban điều hành. Với mỗi công đoạn, tính hiệu suất từng người trong kỳ
   (sản lượng đạt / định mức / giờ làm của dòng), rồi thống kê phân bố.
   Cảnh báo công đoạn "lỏng" nếu > TY_LE_CANH_BAO% số người vượt 90%.
   Chỉ xét công đoạn có >= SO_NGUOI_TOI_THIEU người để đủ tin.
   ============================================================ */
var TY_LE_CANH_BAO = 40;      // % người vượt 90% để coi là định mức lỏng
var SO_NGUOI_TOI_THIEU = 5;   // số người tối thiểu mới xét

function phanTichDinhMuc(token, kieu, giaTri) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok:false, hetHan:true, msg:'Phiên đăng nhập đã hết hạn.' });
  return nho_('phanTichDinhMuc', [kieu, giaTri, me.vaiTro, me.xuong, me.laOwner], function() { return phanTichDinhMucGoc_(token, kieu, giaTri); });
}
function phanTichDinhMucCu_(token, kieu, giaTri) {   // bản trước 21/10 – thay bằng phanTichDinhMucGoc_ ở cuối file
  var me = docPhien_(token);
  if (!me) return sach_({ ok:false, hetHan:true, msg:'Phiên đăng nhập đã hết hạn.' });
  // OWNER: xem toàn nhà máy (tab Phân tích định mức). TP/PP: chỉ xem xưởng mình
  // (dùng cho banner + phần "Định mức cần chú ý" trong tab Công đoạn & định mức).
  if (!me.laOwner && me.vaiTro !== 'TP')
    return sach_({ ok:false, msg:'Không có quyền xem phân tích định mức.' });

  // Xác định các tháng cần lấy (giống layKPIKy)
  var thangCanLay = [];
  if (kieu === 'thang') thangCanLay = [giaTri];
  else if (kieu === 'quy') {
    var m = String(giaTri).match(/^(\d{4})-Q([1-4])$/);
    if (m) { var y=m[1], q=Number(m[2]); for (var i=0;i<3;i++) thangCanLay.push(y+'-'+('0'+((q-1)*3+1+i)).slice(-2)); }
  } else return sach_({ ok:false, msg:'Chỉ hỗ trợ xem theo Tháng hoặc Quý.' });

  var dt = docDuLieuKPI_(canLuuTru_(thangCanLay));
  var congdoan = doc_('CongDoan');
  var dinhmuc = doc_('DinhMuc');
  var tenCD = function(mc){ var c=congdoan.filter(function(x){return x.MaCD===mc;})[0]; return c?c.TenCD:mc; };
  var xuongCD = function(mc){ var c=congdoan.filter(function(x){return x.MaCD===mc;})[0]; return c?c.MaXuong:''; };
  var dmCua = function(mc){ var r=dinhmuc.filter(function(x){return x.MaCD===mc;})[0]; return r?soVN_(r.DinhMucGio):0; };

  // Gom hiệu suất theo công đoạn, dùng GIỜ CHẤM CÔNG (nhất quán với KPI) thay cho GioLam.
  // Vì chấm công chỉ có giờ theo NGÀY (không tách theo công đoạn), ta PHÂN BỔ giờ có mặt
  // của mỗi (người, ngày) cho từng công đoạn theo tỷ lệ khối lượng (giờ chuẩn) làm ra.
  var trongThang = function(ng){ return thangCanLay.indexOf(ng.slice(0,7)) >= 0; };

  // LƯỢT 1: gom giờ chuẩn theo (người, ngày, công đoạn) và tổng giờ chuẩn theo (người, ngày).
  var theoND = {};   // 'maNV|ngay' -> { tongGC:0, cds:{ maCD: gioChuan } }
  dt.nhatky.forEach(function(r){
    if (String(r.TrangThai).trim() !== 'Đã chốt') return;
    var ng = ngayVN_(r.Ngay);
    if (!trongThang(ng)) return;
    var d = dmNgay_(dt, r.MaCD, ng);
    if (d <= 0) return;                        // chưa có định mức -> bỏ
    var loi = dt.idxLoi[r.MaNV+'|'+ng+'|'+r.MaCD] || 0;
    var dat = Number(r.SoLuongLamRa) - loi;
    if (dat <= 0) return;                      // không có sản lượng đạt -> bỏ
    var gioChuan = dat / d;
    var key = r.MaNV + '|' + ng;
    var o = (theoND[key] = theoND[key] || { maNV:r.MaNV, ngay:ng, tongGC:0, cds:{} });
    o.cds[r.MaCD] = (o.cds[r.MaCD] || 0) + gioChuan;
    o.tongGC += gioChuan;
  });

  // LƯỢT 2: với mỗi (người, ngày), lấy giờ có mặt, phân bổ theo tỷ lệ giờ chuẩn cho từng công đoạn.
  var theoCD = {};   // MaCD -> { MaNV -> {gc, gio} }
  Object.keys(theoND).forEach(function(key){
    var o = theoND[key];
    if (o.tongGC <= 0) return;
    var kyHieu = dt.idxCC ? (dt.idxCC[o.maNV+'|'+o.ngay] || 'x') : 'x';
    var gioMat = gioCoMat_(kyHieu);
    if (gioMat <= 0) return;                   // nghỉ cả ngày -> không đưa vào phân tích
    Object.keys(o.cds).forEach(function(mc){
      var gcCD = o.cds[mc];
      var gioPhanBo = gioMat * (gcCD / o.tongGC);   // phân bổ giờ có mặt theo tỷ lệ khối lượng
      var cd = (theoCD[mc] = theoCD[mc] || {});
      var p = (cd[o.maNV] = cd[o.maNV] || { gc:0, gio:0 });
      p.gc += gcCD; p.gio += gioPhanBo;
    });
  });

  // Với mỗi công đoạn: tính hiệu suất TRUNG VỊ, phân loại lỏng/chặt. Đánh giá TẤT CẢ.
  var MOC_LY_TUONG = 85;   // mốc hiệu suất mong muốn của người "ở giữa"
  var trungVi = function(arr){
    if (!arr.length) return 0;
    var a = arr.slice().sort(function(x,y){ return x-y; });
    var m = Math.floor(a.length/2);
    return a.length % 2 ? a[m] : (a[m-1]+a[m])/2;
  };

  var ketqua = [];
  Object.keys(theoCD).forEach(function(mc){
    var nguoi = theoCD[mc];
    var hsList = [];
    Object.keys(nguoi).forEach(function(mn){
      var p = nguoi[mn];
      if (p.gio > 0) hsList.push(p.gc / p.gio * 100);
    });
    var soCoData = hsList.length;
    var tv = trungVi(hsList);   // hiệu suất trung vị của công đoạn

    // Phân loại theo trung vị (chỉ cảnh báo định mức LỎNG; trung vị thấp không cảnh báo
    //  vì thường do người mới chưa lên tay, không phải định mức sai):
    //  đỏ = lỏng rõ (>110), vàng = hơi lỏng (95-110), xanh = còn lại (kể cả thấp)
    var nhan;
    if (tv > 110) nhan = 'do';
    else if (tv > 95) nhan = 'vang';
    else nhan = 'xanh';

    // Mức chỉnh định mức gợi ý để kéo trung vị về mốc lý tưởng (dương=nâng, âm=hạ)
    var chinh = 0;
    if (nhan !== 'xanh' && tv > 0) chinh = Math.round((tv/MOC_LY_TUONG - 1) * 100);

    ketqua.push({
      maCD:mc, tenCD:tenCD(mc), maXuong:xuongCD(mc), dinhMuc:dmCua(mc),
      soCoData:soCoData, trungVi:r2_(tv), nhan:nhan, chinh:chinh
    });
  });

  // Sắp theo XƯỞNG (thứ tự danh mục phòng ban); trong xưởng: bất thường nhiều lên đầu
  var phongban = doc_('PhongBan');
  var thuTuXuong = {};
  phongban.forEach(function(p, i){ thuTuXuong[p.MaXuong] = i; });
  ketqua.sort(function(a,b){
    var xa = (thuTuXuong[a.maXuong]==null?999:thuTuXuong[a.maXuong]);
    var xb = (thuTuXuong[b.maXuong]==null?999:thuTuXuong[b.maXuong]);
    if (xa !== xb) return xa - xb;
    var uu = { do:0, vang:1, xanh:2 };   // lỏng rõ lên đầu để chú ý
    if (uu[a.nhan] !== uu[b.nhan]) return uu[a.nhan] - uu[b.nhan];
    return b.trungVi - a.trungVi;
  });

  // TP chỉ thấy công đoạn thuộc xưởng của mình
  if (me.vaiTro === 'TP') ketqua = ketqua.filter(function(k){ return k.maXuong === me.xuong; });
  return sach_({ ok:true, kieu:kieu, giaTri:giaTri, nguong:TY_LE_CANH_BAO, ds:ketqua });
}

/* ============================================================
   ===== BAN ĐIỀU HÀNH SỬA ĐỊNH MỨC TẠI CHỖ (có ghi vết) =====
   Dùng ở tab Phân tích định mức. ADMIN nhập định mức mới, áp dụng ngay,
   đồng thời ghi một bản ghi vào DeXuatDinhMuc (trạng thái 'Đã duyệt') để
   lưu lịch sử: định mức cũ -> mới, ai sửa, khi nào, lý do.
   LƯU Ý: sửa định mức sẽ tính lại KPI của các tháng CHƯA CHỐT (theo hiện trạng).
   ============================================================ */
function banDieuHanhSuaDinhMuc(token, maCD, dinhMucMoi, lyDo) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok:false, hetHan:true, msg:'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (me.vaiTro !== 'ADMIN') return sach_({ ok:false, msg:'Chỉ ban điều hành được sửa định mức.' });

  var moi = Number(dinhMucMoi);
  if (!isFinite(moi) || moi <= 0) return sach_({ ok:false, msg:'Định mức mới phải là số dương.' });

  var cd = doc_('CongDoan').filter(function(x){ return x.MaCD === maCD; })[0];
  if (!cd) return sach_({ ok:false, msg:'Không tìm thấy công đoạn.' });

  var dm = doc_('DinhMuc').filter(function(x){ return x.MaCD === maCD; })[0];
  var cu = dm ? Number(dm.DinhMucGio) : 0;
  if (cu === moi) return sach_({ ok:false, msg:'Định mức mới trùng định mức hiện tại.' });

  var donVi = dm ? (dm.DonViTinh || 'cái/giờ') : 'cái/giờ';

  // 1) Cập nhật định mức (ghi đè dòng hiện tại, hoặc tạo mới nếu chưa có)
  if (dm) {
    suaO_('DinhMuc', dm._row, 'DinhMucGio', moi);
    suaO_('DinhMuc', dm._row, 'HieuLucTu', ngayApDM_());
    suaO_('DinhMuc', dm._row, 'NguoiDuyet', me.ten);
    suaO_('DinhMuc', dm._row, 'GhiChu', lyDo || 'BĐH sửa tại phân tích định mức');
  } else {
    them_('DinhMuc', {
      MaCD: maCD, DinhMucGio: moi, DonViTinh: donVi,
      HieuLucTu: ngayApDM_(), NguoiDuyet: me.ten,
      GhiChu: lyDo || 'BĐH sửa tại phân tích định mức'
    });
  }

  // 2) Ghi vết vào DeXuatDinhMuc (đã tự duyệt) — để tra lịch sử thay đổi
  them_('DeXuatDinhMuc', {
    MaDX: ma_('DX'), NgayDeXuat: new Date(), NguoiDeXuat: me.ten, MaXuong: cd.MaXuong,
    MaCD: maCD, DinhMucCu: cu, DinhMucMoi: moi, DonViTinh: donVi,
    LyDo: lyDo || 'BĐH sửa tại phân tích định mức',
    TrangThai: 'Đã duyệt', NguoiDuyet: me.ten, NgayDuyet: new Date(),
    GhiChuDuyet: 'Sửa trực tiếp tại phân tích định mức'
  });

  ghiLog_(me, 'BĐH sửa định mức', cd.TenCD + (lyDo ? ' — ' + lyDo : ''), cu, moi);

  return sach_({ ok:true, msg:nhacChotBuDM_('Đã cập nhật định mức "' + cd.TenCD + '": ' + cu + ' → ' + moi + ' ' + donVi + '.') });
}

/* ===== SỬA ĐỊNH MỨC HÀNG LOẠT =====
   dsList: [{ maCD, dinhMucMoi }, ...]. Cập nhật nhiều công đoạn trong một lượt, trả tổng kết.
   Chỉ ADMIN. Bỏ qua (không tính lỗi) các dòng trùng định mức cũ hoặc giá trị không hợp lệ. */
function banDieuHanhSuaDinhMucNhieu(token, dsList, lyDo) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok:false, hetHan:true, msg:'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (me.vaiTro !== 'ADMIN') return sach_({ ok:false, msg:'Chỉ ban điều hành được sửa định mức.' });
  if (!dsList || !dsList.length) return sach_({ ok:false, msg:'Chưa chọn dòng nào để sửa.' });

  var congdoan = doc_('CongDoan');
  var soSua = 0, boQua = 0, chiTiet = [];
  var lyDoChung = lyDo || 'BĐH sửa hàng loạt tại phân tích định mức';

  dsList.forEach(function(it){
    var maCD = it.maCD;
    var moi = Number(it.dinhMucMoi);
    if (!isFinite(moi) || moi <= 0) { boQua++; return; }
    var cd = congdoan.filter(function(x){ return x.MaCD === maCD; })[0];
    if (!cd) { boQua++; return; }
    // đọc lại DinhMuc mỗi vòng để _row luôn đúng sau khi có thể vừa thêm dòng
    var dm = doc_('DinhMuc').filter(function(x){ return x.MaCD === maCD; })[0];
    var cu = dm ? Number(dm.DinhMucGio) : 0;
    if (cu === moi) { boQua++; return; }
    var donVi = dm ? (dm.DonViTinh || 'cái/giờ') : 'cái/giờ';

    if (dm) {
      suaO_('DinhMuc', dm._row, 'DinhMucGio', moi);
      suaO_('DinhMuc', dm._row, 'HieuLucTu', ngayApDM_());
      suaO_('DinhMuc', dm._row, 'NguoiDuyet', me.ten);
      suaO_('DinhMuc', dm._row, 'GhiChu', lyDoChung);
    } else {
      them_('DinhMuc', {
        MaCD: maCD, DinhMucGio: moi, DonViTinh: donVi,
        HieuLucTu: ngayApDM_(), NguoiDuyet: me.ten, GhiChu: lyDoChung
      });
    }
    them_('DeXuatDinhMuc', {
      MaDX: ma_('DX'), NgayDeXuat: new Date(), NguoiDeXuat: me.ten, MaXuong: cd.MaXuong,
      MaCD: maCD, DinhMucCu: cu, DinhMucMoi: moi, DonViTinh: donVi,
      LyDo: lyDoChung, TrangThai: 'Đã duyệt', NguoiDuyet: me.ten, NgayDuyet: new Date(),
      GhiChuDuyet: 'Sửa hàng loạt tại phân tích định mức'
    });
    ghiLog_(me, 'BĐH sửa định mức (hàng loạt)', cd.TenCD, cu, moi);
    soSua++;
    chiTiet.push(cd.TenCD + ': ' + cu + ' → ' + moi);
  });

  if (soSua === 0) return sach_({ ok:false, msg:'Không có dòng nào được cập nhật (trùng định mức cũ hoặc không hợp lệ).' });
  var msg = 'Đã cập nhật ' + soSua + ' định mức' + (boQua ? (' · bỏ qua ' + boQua + ' dòng') : '') + '.';
  return sach_({ ok:true, soSua:soSua, boQua:boQua, chiTiet:chiTiet, msg:nhacChotBuDM_(msg) });
}
/* ===== DỌN TOKEN PHIÊN HẾT HẠN =====
   Quét toàn bộ ScriptProperties có tiền tố "P_" — token phiên đăng nhập.
   Xóa những token đã quá hạn (hanDen < hiện tại) hoặc JSON hỏng.
   Chạy tự động 2h sáng mỗi ngày để không phình bộ nhớ.
   ============================================ */
function donTokenHetHan() {
  if (!noiBo_(arguments[0])) return chanWeb_('donTokenHetHan');
  try {
    var props = PropertiesService.getScriptProperties();
    var all = props.getProperties();
    var now = new Date().getTime();
    var soXoa = 0;

    Object.keys(all).forEach(function(key) {
      if (key.indexOf('P_') !== 0) return;   // chỉ xử lý property token phiên
      try {
        var o = JSON.parse(all[key]);
        if (o.hanDen && now > o.hanDen) {
          props.deleteProperty(key);
          soXoa++;
        }
      } catch (e) {
        // JSON hỏng (bị ghi lỗi, hoặc format cũ) -> xóa luôn
        props.deleteProperty(key);
        soXoa++;
      }
    });

    Logger.log('Đã dọn ' + soXoa + ' phiên hết hạn. Còn lại ' +
      (Object.keys(props.getProperties()).filter(function(k){return k.indexOf('P_')===0}).length) + ' phiên.');
    return soXoa;
  } catch (e) {
    Logger.log('LỖI dọn token: ' + e);
    return 0;
  }
}

/* Cài trigger tự động 2h sáng mỗi ngày. Chạy MỘT LẦN. */
function CAI_TRIGGER_DON_TOKEN() {
  if (!noiBo_(arguments[0])) return chanWeb_('CAI_TRIGGER_DON_TOKEN');
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === 'donTokenHetHan') ScriptApp.deleteTrigger(t);
  });

  ScriptApp.newTrigger('donTokenHetHan')
    .timeBased()
    .atHour(2)                       // 2h sáng (sau backup 1h)
    .everyDays(1)
    .inTimezone('Asia/Ho_Chi_Minh')
    .create();

  Logger.log('Đã cài trigger dọn token: 2h sáng mỗi ngày.');
}
/* ===== SAO LƯU TỰ ĐỘNG =====
   Copy toàn bộ file Spreadsheet sang thư mục "KPI_Backup" trên Drive.
   Tự dọn các bản backup cũ hơn 30 ngày để không phình Drive.
   Chạy tự động 1h sáng mỗi ngày (sau khi cài trigger).
   ============================================ */
function saoLuuHangNgay() {
  if (!noiBo_(arguments[0])) return chanWeb_('saoLuuHangNgay');
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var tenGoc = ss.getName();

    // Tìm hoặc tạo thư mục backup
    var TEN_THU_MUC = 'KPI_Backup';
    var folder;
    var it = DriveApp.getFoldersByName(TEN_THU_MUC);
    if (it.hasNext()) folder = it.next();
    else folder = DriveApp.createFolder(TEN_THU_MUC);

    // Đặt tên file backup kèm ngày giờ
    var ngay = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd_HHmm');
    var tenMoi = tenGoc + ' — backup ' + ngay;

    // Copy file sang thư mục backup
    DriveApp.getFileById(ss.getId()).makeCopy(tenMoi, folder);

    // Dọn backup cũ hơn 30 ngày
    var SO_NGAY_GIU = 30;
    var mocXoa = new Date().getTime() - SO_NGAY_GIU * 24 * 60 * 60 * 1000;
    var soXoa = 0;
    var files = folder.getFiles();
    while (files.hasNext()) {
      var f = files.next();
      if (f.getDateCreated().getTime() < mocXoa) {
        f.setTrashed(true);   // đưa vào thùng rác Drive, không xóa vĩnh viễn
        soXoa++;
      }
    }

    Logger.log('Backup OK: ' + tenMoi + ' | Dọn ' + soXoa + ' file cũ (>' + SO_NGAY_GIU + ' ngày).');
    return { ok: true, ten: tenMoi, soXoa: soXoa };
  } catch (e) {
    Logger.log('LỖI backup: ' + e);
    return { ok: false, msg: String(e) };
  }
}

/* Cài trigger tự động 1h sáng mỗi ngày. Chạy MỘT LẦN trong Apps Script.
   (Chạy tay: chọn hàm này trên thanh công cụ → bấm ▶ Run) */
function CAI_TRIGGER_SAO_LUU() {
  if (!noiBo_(arguments[0])) return chanWeb_('CAI_TRIGGER_SAO_LUU');
  // Xóa trigger cũ cùng tên (tránh trùng khi chạy lại)
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === 'saoLuuHangNgay') ScriptApp.deleteTrigger(t);
  });

  ScriptApp.newTrigger('saoLuuHangNgay')
    .timeBased()
    .atHour(1)                       // 1h sáng
    .everyDays(1)
    .inTimezone('Asia/Ho_Chi_Minh')
    .create();

  Logger.log('Đã cài trigger sao lưu: 1h sáng mỗi ngày, giữ 30 ngày gần nhất.');
}

/* ============================================================
   ===== CÁC HÀM CHẠY TAY (bản cập nhật 28/09/2026) =====
   Cách chạy: trong trình soạn thảo Apps Script, chọn tên hàm ở thanh trên cùng → bấm ▶ Chạy
   → xem kết quả ở "Nhật ký thực thi" phía dưới.
   ============================================================ */

/* 1) KIỂM TRA SAU CẬP NHẬT — chỉ đọc, không sửa gì.
   In ra: múi giờ dự án, các trigger đang cài, số tài khoản còn mật khẩu mặc định, tài khoản của người
   đã nghỉ việc, vi phạm thiếu mã ghi, dòng nhật ký ngày sai, sheet NgayLe. */
function KIEM_TRA_SAU_CAP_NHAT() {
  if (!noiBo_(arguments[0])) return chanWeb_('KIEM_TRA_SAU_CAP_NHAT');
  var L = [];
  L.push('Múi giờ dự án: ' + Session.getScriptTimeZone() + (Session.getScriptTimeZone() === TZ_VN ? ' (đúng)' : '  <-- NÊN ĐỔI sang Asia/Ho_Chi_Minh trong Cài đặt dự án'));
  var tg = ScriptApp.getProjectTriggers().map(function(t){ return t.getHandlerFunction(); });
  L.push('Trigger đang cài: ' + (tg.length ? tg.join(', ') : '(chưa có)'));
  ['chayPhatNhapTre','chotThangTuDong','snapshotKPIHangNgay','donTokenHetHan','saoLuuHangNgay','LUU_TRU_NHAT_KY'].forEach(function(h){
    if (tg.indexOf(h) < 0) L.push('   THIẾU trigger ' + h + ' -> chạy CAI_LAI_TAT_CA_TRIGGER');
  });

  var mkMacDinh = bam_('123456');
  var tk = doc_('TaiKhoan');
  var conMacDinh = tk.filter(function(t){ return chuan_(t.MatKhauMaHoa) === mkMacDinh && String(t.TrangThai).trim() === 'Đang dùng'; });
  var theoVT = {};
  conMacDinh.forEach(function(t){ theoVT[t.VaiTro] = (theoVT[t.VaiTro] || 0) + 1; });
  L.push('Tài khoản còn mật khẩu mặc định 123456: ' + conMacDinh.length + ' ' + JSON.stringify(theoVT));
  var quanTri = conMacDinh.filter(function(t){ return ['OWNER','ADMIN','HR','QC'].indexOf(String(t.VaiTro).trim()) >= 0; });
  if (quanTri.length) L.push('   !!! Tài khoản QUẢN TRỊ còn mật khẩu mặc định: ' + quanTri.map(function(t){ return t.TenDangNhap; }).join(', '));
  var chuaBat = conMacDinh.filter(function(t){ return String(t.DoiMatKhauLanDau).trim() !== 'Có'; });
  if (chuaBat.length) L.push('   ' + chuaBat.length + ' tài khoản dùng 123456 nhưng chưa bật "phải đổi mật khẩu" -> chạy BAT_BUOC_DOI_MAT_KHAU_MAC_DINH');

  var nghi = tk.filter(function(t){ return t.MaNV && String(t.TrangThai).trim() === 'Đang dùng' && nvDaNghi_(t.MaNV); });
  L.push('Tài khoản của người đã nghỉ việc vẫn "Đang dùng": ' + nghi.length + (nghi.length ? ' (' + nghi.map(function(t){ return t.TenDangNhap; }).join(', ') + ') -> chạy NGUNG_TK_NGHI_VIEC' : ''));

  var vp = docAnToan_('ViPham').filter(function(v){ return !String(v.MaGhi || '').trim(); });
  L.push('Vi phạm thiếu mã ghi: ' + vp.length + (vp.length ? ' -> chạy BO_SUNG_MA_GHI_VIPHAM' : ''));

  var sai = dsNgaySaiNhatKy_();
  L.push('Dòng nhật ký ngày sai: ' + sai.length + (sai.length ? ' -> chạy SUA_NGAY_NHAT_KY' : ''));
  L.push('Sheet NgayLe: ' + (ss_().getSheetByName('NgayLe') ? docAnToan_('NgayLe').length + ' ngày' : 'CHƯA CÓ -> chạy TAO_SHEET_NGAY_LE'));
  Logger.log(L.join('\n'));
  return L.join('\n');
}

/* 2) Cài lại TẤT CẢ trigger theo giờ Việt Nam (xóa trigger cũ cùng tên trước khi cài). */
function CAI_LAI_TAT_CA_TRIGGER() {
  if (!noiBo_(arguments[0])) return chanWeb_('CAI_LAI_TAT_CA_TRIGGER');
  CAI_TRIGGER_PHAT_TRE();
  CAI_TRIGGER_CHOT_THANG();
  CAI_TRIGGER_SNAPSHOT_9H();
  CAI_TRIGGER_DON_TOKEN();
  CAI_TRIGGER_SAO_LUU();
  CAI_TRIGGER_LUU_TRU();
  Logger.log('Xong: đã cài 6 trigger theo giờ Việt Nam.');
}

/* 3) Ngừng tài khoản của những người đã chuyển "Nghỉ việc" trong NhanSu. */
function NGUNG_TK_NGHI_VIEC() {
  if (!noiBo_(arguments[0])) return chanWeb_('NGUNG_TK_NGHI_VIEC');
  khoa_();
  var ds = [];
  doc_('TaiKhoan').forEach(function(t){
    if (t.MaNV && String(t.TrangThai).trim() === 'Đang dùng' && nvDaNghi_(t.MaNV)) {
      suaO_('TaiKhoan', t._row, 'TrangThai', 'Ngừng');
      ds.push(t.TenDangNhap + ' (' + t.HoTen + ')');
    }
  });
  ghiLog_({ tk: 'HE_THONG', ten: 'Chạy tay' }, 'Ngừng TK người nghỉ việc', ds.length + ' tài khoản', '', ds.join(', '));
  xong_();
  Logger.log('Đã ngừng ' + ds.length + ' tài khoản: ' + ds.join(', '));
}

/* 4) Bật cờ "phải đổi mật khẩu" cho mọi tài khoản đang dùng mật khẩu mặc định 123456.
   Lần đăng nhập tới họ sẽ bị buộc đặt mật khẩu mới. KHÔNG đổi mật khẩu của ai. */
function BAT_BUOC_DOI_MAT_KHAU_MAC_DINH() {
  if (!noiBo_(arguments[0])) return chanWeb_('BAT_BUOC_DOI_MAT_KHAU_MAC_DINH');
  khoa_();
  var mk = bam_('123456'), n = 0;
  doc_('TaiKhoan').forEach(function(t){
    if (chuan_(t.MatKhauMaHoa) === mk && String(t.DoiMatKhauLanDau).trim() !== 'Có') {
      suaO_('TaiKhoan', t._row, 'DoiMatKhauLanDau', 'Có');
      n++;
    }
  });
  xong_();
  Logger.log('Đã bật "phải đổi mật khẩu" cho ' + n + ' tài khoản đang dùng 123456.');
}

/* 5) Bổ sung mã ghi cho các vi phạm cũ bị thiếu (vi phạm nhập trễ tự động trước đây không có mã,
   nên không xóa lẻ được trên giao diện). */
function BO_SUNG_MA_GHI_VIPHAM() {
  if (!noiBo_(arguments[0])) return chanWeb_('BO_SUNG_MA_GHI_VIPHAM');
  khoa_();
  var sh = ss_().getSheetByName('ViPham');
  if (!sh || sh.getLastRow() < 2) { Logger.log('Sheet ViPham trống.'); return; }
  var head = dauCot_('ViPham');
  var cMa = head.indexOf('MaGhi'), cNg = head.indexOf('NguoiGhi');
  var rng = sh.getRange(2, 1, sh.getLastRow() - 1, head.length);
  var v = rng.getValues(), n = 0;
  v.forEach(function(r){
    if (r.join('') === '' || String(r[cMa]).trim()) return;
    r[cMa] = ma_('VP');
    if (cNg >= 0 && !String(r[cNg]).trim()) r[cNg] = 'Hệ thống (tự động)';
    n++;
  });
  if (n) { rng.setValues(v); xoaCache_('ViPham'); }
  xong_();
  Logger.log('Đã bổ sung mã ghi cho ' + n + ' vi phạm.');
}

/* 6) Tạo sheet NgayLe (ngày nghỉ lễ của cả nhà máy hoặc từng xưởng).
   Sau khi tạo: mở sheet NgayLe, thêm các ngày Tết Âm lịch, Giỗ Tổ… theo thông báo nghỉ của công ty.
   Cột MaXuong để trống = cả nhà máy nghỉ; ghi mã xưởng (VD CNC) nếu chỉ xưởng đó nghỉ. */
function TAO_SHEET_NGAY_LE() {
  if (!noiBo_(arguments[0])) return chanWeb_('TAO_SHEET_NGAY_LE');
  var ss = ss_();
  if (ss.getSheetByName('NgayLe')) { Logger.log('Sheet NgayLe đã có — giữ nguyên.'); return; }
  var sh = ss.insertSheet('NgayLe');
  sh.getRange(1, 1, 1, 3).setValues([['Ngay', 'TenLe', 'MaXuong']])
    .setFontWeight('bold').setBackground('#12313a').setFontColor('#ffffff');
  sh.setFrozenRows(1);
  sh.getRange(2, 1, 400, 1).setNumberFormat('@');   // giữ ngày ở dạng chữ yyyy-MM-dd
  var mau = [
    ['2026-09-01', 'Quốc khánh (nghỉ kèm)', ''],
    ['2026-09-02', 'Quốc khánh', ''],
    ['2027-01-01', 'Tết Dương lịch', '']
  ];
  sh.getRange(2, 1, mau.length, 3).setValues(mau);
  sh.setColumnWidth(1, 110); sh.setColumnWidth(2, 220);
  Logger.log('Đã tạo sheet NgayLe với ' + mau.length + ' ngày mẫu. Hãy thêm Tết Âm lịch, Giỗ Tổ, 30/4–1/5… theo lịch nghỉ của công ty.');
}

/* Danh sách dòng NhatKySanXuat có ngày sai (dùng chung cho kiểm tra & sửa) */
function dsNgaySaiNhatKy_() {
  var sh = ss_().getSheetByName('NhatKySanXuat');
  if (!sh || sh.getLastRow() < 2) return [];
  var head = dauCot_('NhatKySanXuat');
  var cNgay = head.indexOf('Ngay'), cTD = head.indexOf('ThoiDiemNhap'), cNV = head.indexOf('MaNV'),
      cCD = head.indexOf('MaCD'), cTT = head.indexOf('TrangThai');
  var v = sh.getRange(2, 1, sh.getLastRow() - 1, head.length).getValues();
  var hn = homNayVN_(), out = [];
  v.forEach(function(r, i){
    if (r.join('') === '') return;
    var raw = r[cNgay];
    var ng = (Object.prototype.toString.call(raw) === '[object Date]')
      ? (isNaN(raw.getTime()) ? '' : Utilities.formatDate(raw, TZ_VN, 'yyyy-MM-dd')) : String(raw || '').trim().slice(0, 10);
    var ngNhap = r[cTD] ? ngayVN_(r[cTD]) : hn;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(ngNhap)) ngNhap = hn;
    var hopLe = /^\d{4}-\d{2}-\d{2}$/.test(ng) && congNgay_(ng, 0) === ng && ng >= NGAY_MO_HE_THONG && ng <= ngNhap;
    if (hopLe) return;
    // Đề xuất: đảo ngày <-> tháng (lỗi hay gặp khi điện thoại hiểu 01/08 thành 8 tháng 1)
    var deXuat = '', chac = false;
    var m = ng.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) {
      var dao = m[1] + '-' + m[3] + '-' + m[2];
      if (congNgay_(dao, 0) === dao && dao !== ng && dao >= NGAY_MO_HE_THONG && dao <= ngNhap && dao >= congNgay_(ngNhap, -45)) {
        deXuat = dao; chac = true;
      } else if (ng > ngNhap && Number(m[1]) === Number(ngNhap.slice(0, 4))) {
        // Ngày sau lúc nhập (VD nhập 03/09 cho "28/09") -> có thể nhầm tháng: gợi ý tháng trước
        var p0 = Number(m[2]) - 1, y0 = Number(m[1]);
        if (p0 < 1) { p0 = 12; y0--; }
        var thangTruoc = y0 + '-' + ('0' + p0).slice(-2) + '-' + m[3];
        if (congNgay_(thangTruoc, 0) === thangTruoc && thangTruoc <= ngNhap && thangTruoc >= congNgay_(ngNhap, -45)) deXuat = thangTruoc;
      } else if (Number(m[1]) !== Number(ngNhap.slice(0, 4))) {
        var cungNam = ngNhap.slice(0, 4) + '-' + m[2] + '-' + m[3];   // năm gõ nhầm (VD 1483)
        if (congNgay_(cungNam, 0) === cungNam && cungNam <= ngNhap && cungNam >= congNgay_(ngNhap, -45)) deXuat = cungNam;
      }
    }
    out.push({ dong: i + 2, cot: cNgay + 1, ngay: ng || String(raw), maNV: r[cNV], maCD: r[cCD],
               trangThai: r[cTT], ngayNhap: ngNhap, deXuat: deXuat, chac: chac });
  });
  return out;
}

/* 7) SỬA NGÀY SAI TRONG NHẬT KÝ SẢN XUẤT
   Bước 1: để CHE_DO = 'XEM', bấm Chạy, đọc danh sách + đề xuất trong Nhật ký thực thi.
   Bước 2: đổi CHE_DO = 'SUA', Chạy lại: CHỈ sửa các dòng chắc chắn (ngày và tháng bị đảo).
   Dòng không đoán chắc được (ô trống, #VALUE!, năm lạ) -> sửa tay trong Sheet theo gợi ý. */
function SUA_NGAY_NHAT_KY() {
  if (!noiBo_(arguments[0])) return chanWeb_('SUA_NGAY_NHAT_KY');
  var CHE_DO = 'XEM';   // <-- đổi thành 'SUA' ở bước 2

  var ds = dsNgaySaiNhatKy_();
  var L = ['=== ' + ds.length + ' dòng nhật ký có ngày sai (chế độ ' + CHE_DO + ') ==='];
  ds.forEach(function(d){
    L.push('Dòng ' + d.dong + ' | ' + d.maNV + ' | ' + d.maCD + ' | ' + d.trangThai + ' | ngày đang ghi: ' + d.ngay +
      ' | nhập lúc: ' + d.ngayNhap + ' | ' + (d.chac ? 'TỰ SỬA thành ' + d.deXuat : (d.deXuat ? 'có thể là ' + d.deXuat + ' (sửa tay)' : 'không đoán được — hỏi trưởng phòng rồi sửa tay')));
  });
  if (CHE_DO === 'SUA') {
    khoa_();
    var sh = ss_().getSheetByName('NhatKySanXuat'), n = 0;
    ds.forEach(function(d){
      if (!d.chac) return;
      sh.getRange(d.dong, d.cot).setValue(d.deXuat);
      n++;
    });
    xoaCache_('NhatKySanXuat');
    ghiLog_({ tk: 'HE_THONG', ten: 'Chạy tay' }, 'Sửa ngày sai nhật ký', n + ' dòng (đảo ngày/tháng)');
    xong_();
    L.push('ĐÃ SỬA ' + n + ' dòng. Sau khi sửa, nếu tháng đó đã chốt thì chốt lại tháng đó để bảng KPI cập nhật.');
  }
  Logger.log(L.join('\n'));
}

/* 8) Xóa bộ nhớ tạm (bảng KPI, thống kê… được nhớ 10 phút cho nhanh).
   Chạy sau khi SỬA TAY trực tiếp trong Google Sheet để web hiện số mới ngay. */
function XOA_BO_NHO_TAM() {
  if (!noiBo_(arguments[0])) return chanWeb_('XOA_BO_NHO_TAM');
  tangPhienBan_(); nkdBo_();
  Logger.log('Đã xóa bộ nhớ tạm. Tải lại trang web để thấy số liệu mới.');
}

/* ============================================================
   ===== TĂNG TỐC (bản 29/09/2026) =====
   1) Bộ đệm ghi: suaO_ không ghi ngay từng ô mà gom lại, cuối lượt gọi ghi một lần theo khối dòng.
   2) Số phiên bản dữ liệu + bộ nhớ tạm: kết quả tính nặng (bảng KPI, KPI quản lý, chấm công tháng,
      phân tích định mức, lịch sử KPI) được nhớ 10 phút; có ai lưu thay đổi là tự bỏ nhớ.
   3) Đọc gộp nhiều trang tính bằng Sheets API (chỉ bật sau khi KIEM_TRA_SHEETS_API xác nhận khớp).
   4) Lưu trữ nhật ký sản xuất cũ sang trang tính riêng (LUU_TRU_NHAT_KY).
   ============================================================ */

/* ---------- 1) BỘ ĐỆM GHI ---------- */
var __CHO_GHI = {};          // tên sheet -> { dòng: { cột (1-based): giá trị } }

/* Ghi hết các ô đang chờ của một sheet (hoặc mọi sheet nếu không truyền tên).
   Gom các dòng gần nhau (cách nhau ≤ 3 dòng) thành một khối: đọc khối 1 lần, thay ô, ghi khối 1 lần.
   Khối nào mọi ô đều có giá trị mới thì ghi thẳng, khỏi đọc. */
function xaGhi_(name) {
  var ds = name ? [name] : Object.keys(__CHO_GHI);
  ds.forEach(function(ten) {
    var m = __CHO_GHI[ten];
    if (!m) return;
    delete __CHO_GHI[ten];
    var sh = ss_().getSheetByName(ten);
    if (!sh) return;
    var dong = Object.keys(m).map(Number).sort(function(a, b) { return a - b; });
    var i = 0;
    while (i < dong.length) {
      var j = i;
      while (j + 1 < dong.length && dong[j + 1] - dong[j] <= 4) j++;
      var r1 = dong[i], r2 = dong[j], c1 = 1e9, c2 = 0, soO = 0;
      for (var k = i; k <= j; k++) Object.keys(m[dong[k]]).forEach(function(c) {
        c = Number(c); if (c < c1) c1 = c; if (c > c2) c2 = c; soO++;
      });
      var cao = r2 - r1 + 1, rong = c2 - c1 + 1, rng = sh.getRange(r1, c1, cao, rong);
      var v;
      if (soO === cao * rong) {
        v = []; for (var a = 0; a < cao; a++) { v.push([]); for (var b = 0; b < rong; b++) v[a].push(''); }
      } else v = rng.getValues();
      for (var k2 = i; k2 <= j; k2++) {
        var o = m[dong[k2]];
        Object.keys(o).forEach(function(c) { v[dong[k2] - r1][Number(c) - c1] = o[c]; });
      }
      rng.setValues(v);
      i = j + 1;
    }
    xoaCache_(ten);
  });
}

/* Kết thúc một lượt có ghi: ghi hết bộ đệm, rồi tăng số phiên bản dữ liệu (để bỏ bộ nhớ tạm cũ). */
function xong_() {
  xaGhi_();
  if (__KHOA && !__DA_TANG_PB) { tangPhienBan_(!anhHuongKPI_()); __DA_TANG_PB = true; }
}
var __DA_TANG_PB = false;

/* Sheet đã đổi trong lượt gọi -> "phần" dữ liệu giao diện cần tải lại (napPhan).
   Sheet không thuộc phần nào (TaiKhoan, KPIThang, nhật ký thao tác…) thì bỏ qua; '*' = tải lại hết. */
var __DA_GHI = {};
var PHAN_CUA_SHEET_ = {
  NhatKySanXuat: 'nk', PhieuKCS: 'nk',
  DiemDanhNghi: 'cc', XacNhanDiemDanh: 'cc', NgayLe: 'cc', MienTruDiemDanh: 'cc', NghiDaiHan: 'cc',
  NhanSu: 'ns', YeuCauSuaHoSo: 'ns',
  CongDoan: 'cd', DinhMuc: 'cd', DeXuatDinhMuc: 'cd',
  MayMoc: 'mm', DanhMucViPham: 'vp', ViPham: 'vp', TrongSoKPI: 'ts', ThongBao: 'tb',
  PhongBan: 'dm', DanhMucLoi: 'dm', LyDoDung: 'dm'
};
function ganPhanDoi_(v) {
  if (!v || typeof v !== 'object' || Array.isArray(v) || !v.ok) return;
  var ten = Object.keys(__DA_GHI);
  if (!ten.length) return;
  if (__DA_GHI['*']) { v.phanDoi = 'tat'; return; }
  var p = {};
  ten.forEach(function(t) { if (PHAN_CUA_SHEET_[t]) p[PHAN_CUA_SHEET_[t]] = 1; });
  v.phanDoi = Object.keys(p);
}

/* ---------- 2) PHIÊN BẢN DỮ LIỆU + BỘ NHỚ TẠM ---------- */
var __PB = null;
function phienBan_() {
  if (__PB === null) {
    try { __PB = PropertiesService.getScriptProperties().getProperty('KPI_PB') || '0'; } catch (e) { __PB = '0'; }
  }
  return __PB;
}
function tangPhienBan_(chiChung) {
  __PB = new Date().getTime() + '.' + Math.floor(Math.random() * 1e6);
  try { PropertiesService.getScriptProperties().setProperty('KPI_PB', __PB); } catch (e) {}
  if (!chiChung) tangPhienBanKPI_();                  // gọi thẳng (XOA_BO_NHO_TAM, dọn phạt…) thì xóa cả nhớ KPI
}
var NHO_GIAY = 600;          // nhớ kết quả tính 10 phút
var NHO_KHOI = 90000;        // CacheService giới hạn 100KB mỗi khóa -> cắt khối 90KB

/* Trả kết quả đã nhớ nếu còn; nếu không thì tính bằng fn(), nhớ lại (chỉ nhớ kết quả ok). */
function nho_(ten, thamSo, fn) {
  var khoa = '';
  try {
    var raw = ten + '|' + JSON.stringify(thamSo) + '|' + (NHO_KPI_[ten] ? 'k' + phienBanKPI_() : phienBan_()) + '|' + homNayVN_() + (gioVN_() >= 17 ? 'c' : 's');
    khoa = 'NHO_' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, raw, Utilities.Charset.UTF_8));
    var c = CacheService.getScriptCache(), dau = c.get(khoa);
    if (dau) {
      var n = Number(dau), ks = [];
      for (var i = 0; i < n; i++) ks.push(khoa + '_' + i);
      var cac = c.getAll(ks), s = '';
      for (var j = 0; j < n; j++) { if (cac[ks[j]] == null) { s = null; break; } s += cac[ks[j]]; }
      if (s !== null) {
        var json = Utilities.ungzip(Utilities.newBlob(Utilities.base64Decode(s), 'application/x-gzip')).getDataAsString();
        var kq = JSON.parse(json);
        kq.tuBoNho = true;
        return kq;
      }
    }
  } catch (e) { khoa = khoa || ''; }
  var r = fn();
  try {
    if (khoa && r && r.ok) {
      var z = Utilities.base64Encode(Utilities.gzip(Utilities.newBlob(JSON.stringify(r), 'application/json')).getBytes());
      var soKhoi = Math.ceil(z.length / NHO_KHOI), dat = {};
      if (soKhoi <= 20) {
        for (var q = 0; q < soKhoi; q++) dat[khoa + '_' + q] = z.substr(q * NHO_KHOI, NHO_KHOI);
        var cc = CacheService.getScriptCache();
        cc.putAll(dat, NHO_GIAY);
        cc.put(khoa, String(soKhoi), NHO_GIAY);
      }
    }
  } catch (e) {}
  return r;
}

/* ---------- 3) ĐỌC GỘP BẰNG SHEETS API ----------
   Cần bật: trình soạn thảo Apps Script -> Dịch vụ (+) -> Google Sheets API -> Thêm.
   Sau đó chạy KIEM_TRA_SHEETS_API một lần: hàm so từng ô giữa 2 cách đọc, khớp hết mới bật. */
var COT_NGAY_ = ['Ngay', 'ThoiDiem', 'ThoiDiemNhap', 'ThoiDiemDuyet', 'ThoiDiemPhat', 'ThoiDiemGhi', 'ThoiDiemChot',
  'NgayTao', 'NgayVaoLam', 'LanDangNhapCuoi', 'TuNgay', 'DenNgay', 'NgayGui', 'NgayDuyet', 'NgayDeXuat',
  'HieuLucTu', 'BaoTriKeTiep', 'KyApDung', 'Ky', 'HanMatKhauTam', 'CapNhat'];
function dungSheetsApi_() {
  try {
    return typeof Sheets !== 'undefined' && PropertiesService.getScriptProperties().getProperty('KPI_SHEETS_API') === '1';
  } catch (e) { return false; }
}
/* Đọc nhiều sheet trong MỘT lần gọi, trả { tên: mảng 2 chiều giống getValues() } */
function docGopApi_(tenDs) {
  var z = Utilities.formatDate(new Date(), ss_().getSpreadsheetTimeZone(), 'Z');     // VD "+0700"
  var lech = (z.charAt(0) === '-' ? -1 : 1) * (Number(z.substr(1, 2)) + Number(z.substr(3, 2)) / 60);
  var r = Sheets.Spreadsheets.Values.batchGet(ss_().getId(), {
    ranges: tenDs.map(function(t) { return "'" + t.replace(/'/g, "''") + "'"; }),
    valueRenderOption: 'UNFORMATTED_VALUE', dateTimeRenderOption: 'SERIAL_NUMBER', majorDimension: 'ROWS'
  });
  var out = {};
  (r.valueRanges || []).forEach(function(vr, k) {
    var v = vr.values || [];
    if (!v.length) { out[tenDs[k]] = []; return; }
    var head = v[0], rong = head.length, laNgay = head.map(function(h) { return COT_NGAY_.indexOf(String(h)) >= 0; });
    out[tenDs[k]] = v.map(function(row, i) {
      var o = [];
      for (var j = 0; j < rong; j++) {
        var x = row[j];
        if (x === undefined || x === null) x = '';
        if (i > 0 && laNgay[j] && typeof x === 'number') x = new Date(Math.round((x - 25569) * 864e5 - lech * 3600e3));
        o.push(x);
      }
      return o;
    });
  });
  return out;
}
/* Nạp trước vào bộ nhớ đệm đọc (__DOC_CACHE) nhiều sheet cùng lúc */
function napTruoc_(tenDs) {
  if (!dungSheetsApi_()) return;
  var can = tenDs.filter(function(t) { return !__DOC_CACHE.hasOwnProperty(t) && !__CHO_GHI[t] && ss_().getSheetByName(t); });
  var iNK = can.indexOf(NKD_TEN), pbNK = '';   // 08/11: nhật ký có trong bộ nhớ dùng chung -> khỏi đọc
  if (iNK >= 0 && nkdDung_()) { pbNK = nkdPB_(); var vNK = nkdLay_(pbNK); if (vNK) { __DOC_CACHE[NKD_TEN] = bangThanhDoiTuong_(vNK); can.splice(iNK, 1); pbNK = ''; __NKD_TT.trung++; } else __NKD_TT.truot++; }
  if (can.length < 2) return;
  try {
    var gop = docGopApi_(can);
    can.forEach(function(t) { __DOC_CACHE[t] = bangThanhDoiTuong_(gop[t] || []); });
    if (pbNK && gop[NKD_TEN]) nkdGhi_(pbNK, gop[NKD_TEN]);
  } catch (e) { /* lỗi API -> để doc_ đọc cách cũ */ }
}
function bangThanhDoiTuong_(v) {
  if (v.length < 2) return [];
  var head = v[0], out = [];
  for (var i = 1; i < v.length; i++) {
    if (v[i].join('') === '') continue;
    var o = { _row: i + 1 };
    for (var j = 0; j < head.length; j++) o[head[j]] = v[i][j];
    out.push(o);
  }
  return out;
}
var SHEET_NAP_ = ['TaiKhoan', 'NhanSu', 'PhongBan', 'CongDoan', 'DinhMuc', 'DeXuatDinhMuc', 'DanhMucLoi', 'LyDoDung',
  'NhatKySanXuat', 'PhieuKCS', 'TrongSoKPI', 'MayMoc', 'DanhMucViPham', 'ViPham', 'DiemDanhNghi', 'XacNhanDiemDanh',
  'NghiDaiHan', 'YeuCauSuaHoSo', 'ThongBao', 'NgayLe', 'MienTruDiemDanh', 'KPIThang', 'PhatNhapTre', 'MienTruKPIQuanLy', 'LichSuDinhMuc'];   // 08/11 đợt 4: + LichSuDinhMuc

/* CHẠY TAY: so từng ô giữa cách đọc cũ (getValues) và Sheets API. Khớp hết -> bật đọc gộp. */
function KIEM_TRA_SHEETS_API() {
  if (!noiBo_(arguments[0])) return chanWeb_('KIEM_TRA_SHEETS_API');
  if (typeof Sheets === 'undefined') {
    Logger.log('Chưa bật dịch vụ Google Sheets API. Vào Dịch vụ (+) -> Google Sheets API -> Thêm, rồi chạy lại.');
    return;
  }
  var ten = SHEET_NAP_.filter(function(t) { return ss_().getSheetByName(t); });
  // Đọc 2 cách trong lúc giữ khóa ghi: có người duyệt / nhập đúng lúc kiểm tra thì 2 lần đọc lệch nhau (22/10).
  // Vẫn lệch thì thử lại tối đa 3 lần.
  var lech = 0, vd = [];
  for (var lan = 0; lan < 3; lan++) {
    var kh = LockService.getScriptLock(), a0 = {}, gop;
    kh.waitLock(30000);
    try {
      gop = docGopApi_(ten);
      ten.forEach(function(t) { a0[t] = ss_().getSheetByName(t).getDataRange().getValues(); });
    } finally { kh.releaseLock(); }
    lech = 0; vd = [];
    ten.forEach(function(t) {
      var a = a0[t], b = gop[t] || [];
      // bỏ dòng trống cuối cho công bằng
      var cat = function(x) { while (x.length && x[x.length - 1].join('') === '') x.pop(); return x; };
      a = cat(a); b = cat(b);
      var n = Math.max(a.length, b.length);
      for (var i = 0; i < n; i++) {
        var ra = a[i] || [], rb = b[i] || [], m = Math.max(ra.length, rb.length);
        for (var j = 0; j < m; j++) {
          var x = ra[j] === undefined ? '' : ra[j], y = rb[j] === undefined ? '' : rb[j];
          var giong = (x instanceof Date || y instanceof Date)
            ? (x instanceof Date && y instanceof Date && Math.abs(x.getTime() - y.getTime()) < 1000)
            : String(x) === String(y);
          if (!giong) { lech++; if (vd.length < 15) vd.push(t + '!' + (i + 1) + ':' + (j + 1) + ' [' + x + '] ≠ [' + y + ']'); }
        }
      }
    });
    if (lech === 0) break;
    Utilities.sleep(3000);
  }
  var p = PropertiesService.getScriptProperties();
  if (lech === 0) { p.setProperty('KPI_SHEETS_API', '1'); Logger.log('KHỚP toàn bộ ' + ten.length + ' trang tính. ĐÃ BẬT đọc gộp bằng Sheets API.'); }
  else { p.setProperty('KPI_SHEETS_API', '0'); Logger.log('Có ' + lech + ' ô lệch -> CHƯA bật. Ví dụ:\n' + vd.join('\n')); }
}
function TAT_SHEETS_API() {
  if (!noiBo_(arguments[0])) return chanWeb_('TAT_SHEETS_API'); PropertiesService.getScriptProperties().setProperty('KPI_SHEETS_API', '0'); PropertiesService.getScriptProperties().setProperty('KPI_SHEETS_TAT', '1'); Logger.log('Đã tắt đọc gộp.'); }

/* ---------- 4) LƯU TRỮ NHẬT KÝ CŨ ----------
   Chuyển các dòng NhatKySanXuat của những tháng ĐÃ CHỐT CHÍNH THỨC và cũ hơn SO_THANG_GIU tháng
   sang trang tính NhatKySanXuat_LuuTru. Bảng KPI tháng cũ đọc bản chốt nên không đổi;
   các phép tính cần tháng cũ (KPI quản lý, lịch sử) tự đọc thêm trang lưu trữ. */
var SO_THANG_GIU = 1;   // 08/11 (chủ dự án): sheet chính giữ tháng này + tháng trước
var TEN_LUU_TRU = 'NhatKySanXuat_LuuTru';
function mocLuuTru_() {
  try { return PropertiesService.getScriptProperties().getProperty('KPI_MOC_LUU_TRU') || ''; } catch (e) { return ''; }
}
/* Có cần đọc thêm trang lưu trữ cho các tháng này không */
function canLuuTru_(cacThang) {
  var moc = mocLuuTru_();
  if (!moc) return false;
  return (cacThang || []).some(function(t) { return !t || String(t) < moc; });
}
function LUU_TRU_NHAT_KY() {
  if (!noiBo_(arguments[0])) return chanWeb_('LUU_TRU_NHAT_KY');
  khoa_();
  var sh = ss_().getSheetByName('NhatKySanXuat');
  if (!sh || sh.getLastRow() < 2) { Logger.log('Không có dữ liệu.'); return; }
  var moc = kyVN_();
  for (var k = 0; k < SO_THANG_GIU; k++) moc = kyTruoc_(moc);        // tháng cũ nhất còn giữ lại
  var head = dauCot_('NhatKySanXuat'), cNgay = head.indexOf('Ngay');
  var v = sh.getRange(2, 1, sh.getLastRow() - 1, head.length).getValues();
  var daChot = {}, chuyen = [], dongXoa = [];
  v.forEach(function(r, i) {
    if (r.join('') === '') return;
    var ng = ngayVN_(r[cNgay]), ky = ng.slice(0, 7);
    if (!/^\d{4}-\d{2}$/.test(ky) || ky >= moc) return;
    if (!(ky in daChot)) daChot[ky] = daChotChinhThuc_(ky);
    if (!daChot[ky]) return;                                            // tháng chưa chốt: giữ lại
    chuyen.push(r); dongXoa.push(i + 2);
  });
  if (!chuyen.length) { Logger.log('Không có tháng nào đủ điều kiện lưu trữ (cũ hơn ' + moc + ' và đã chốt chính thức).'); return; }
  var lt = ss_().getSheetByName(TEN_LUU_TRU);
  if (!lt) { lt = ss_().insertSheet(TEN_LUU_TRU); lt.getRange(1, 1, 1, head.length).setValues([head]).setFontWeight('bold'); lt.setFrozenRows(1); }
  lt.getRange(lt.getLastRow() + 1, 1, chuyen.length, head.length).setValues(chuyen);
  xoaNhieuDong_('NhatKySanXuat', dongXoa);
  var cu = mocLuuTru_();
  PropertiesService.getScriptProperties().setProperty('KPI_MOC_LUU_TRU', cu && cu > moc ? cu : moc);
  var thang = Object.keys(daChot).filter(function(t) { return daChot[t]; }).sort();
  ghiLog_({ tk: 'HE_THONG', ten: 'Lưu trữ' }, 'Lưu trữ nhật ký cũ', chuyen.length + ' dòng', '', thang.join(', '));
  xong_();
  Logger.log('Đã chuyển ' + chuyen.length + ' dòng (' + thang.join(', ') + ') sang ' + TEN_LUU_TRU + '.');
}
/* Trigger: ngày 5 hằng tháng, 2h30 sáng */
function CAI_TRIGGER_LUU_TRU() {
  if (!noiBo_(arguments[0])) return chanWeb_('CAI_TRIGGER_LUU_TRU');
  ScriptApp.getProjectTriggers().forEach(function(t) { if (t.getHandlerFunction() === 'LUU_TRU_NHAT_KY') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('LUU_TRU_NHAT_KY').timeBased().onMonthDay(5).atHour(2).inTimezone(TZ_VN).create();
  Logger.log('Đã cài trigger lưu trữ nhật ký: ngày 5 hằng tháng, 2h sáng.');
}

/* ---------- NẠP THEO PHẦN (tải lại nhẹ sau khi lưu) ----------
   Giao diện gọi napPhan(token, ['nk','cc',...]) thay vì napDuLieu -> chỉ đọc và gửi phần đã đổi. */
function napPhan(token, phan) {
  return goiNap_(napDuLieuLoi_(token, phan && phan.length ? phan : null));
}

/* =====================================================================
   BÁO CÁO THÁNG (PDF) — tự tổng hợp khi chốt tháng, gửi ban lãnh đạo; trưởng phòng tải báo cáo xưởng mình.
   - Số liệu KPI lấy đúng như bảng KPI trên web: bản chốt chính thức (sheet KPIThang), xưởng nào chưa chốt thì tính trực tiếp.
   - Một lần đọc dữ liệu dựng được cả báo cáo toàn nhà máy lẫn từng xưởng (bcDuLieu_).
   - HTML chỉ dùng bảng + màu nền (không flex/grid/SVG) để Apps Script đổi sang PDF ổn định.
   Người nhận: sheet "NguoiNhanBaoCao" (Email | NhanBaoCao = TOAN_NHA_MAY / mã xưởng / TAT_CA | GhiChu).
   ===================================================================== */
var BC_THU_MUC = 'Báo cáo KPI hằng tháng';
var BC_SHEET_NHAN = 'NguoiNhanBaoCao';
var BC_LOAI = ['S','A+','A','B','C','D','Học việc'];
var BC_MAU_LOAI = { 'S':'#5b3fa8', 'A+':'#1e7f5c', 'A':'#3aa57a', 'B':'#d29b2a', 'C':'#e07b39', 'D':'#c0392b', 'Học việc':'#7d868c' };

function bcSo_(v, n) {
  if (v === null || v === undefined || v === '' || isNaN(v)) return '–';
  n = n || 0;
  var p = Math.abs(Number(v)).toFixed(n).split('.');
  p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return (Number(v) < 0 && Number(p.join('.')) !== 0 ? '-' : '') + p.join(',');
}
function bcE_(s) { return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function bcThang_(ky) { return 'tháng ' + Number(ky.slice(5,7)) + '/' + ky.slice(0,4); }
function bcLech_(moi, cu, n, donVi, nguoc) {          // "▲ 2,1 điểm" xanh / đỏ (nguoc: giảm là tốt)
  if (moi === null || cu === null || moi === undefined || cu === undefined || isNaN(moi) || isNaN(cu)) return '<span style="color:#8a949c">chưa so được với tháng trước</span>';
  var d = moi - cu, tot = nguoc ? d < 0 : d > 0;
  if (Math.abs(d) < Math.pow(10, -(n||0)) / 2) return '<span style="color:#8a949c">không đổi</span>';
  return '<span style="color:' + (tot ? '#1e7f5c' : '#c0392b') + '">' + (d > 0 ? '▲ ' : '▼ ') + bcSo_(Math.abs(d), n) + (donVi || '') + '</span>';
}
function bcTenX_(du, mx) { var t = String(du.tenX[mx] || mx); return /^(xưởng|phòng|bộ phận|tổ)(\s|$)/i.test(t) ? t : 'Xưởng ' + t; }
function bcTB_(arr, f) { if (!arr.length) return null; return arr.reduce(function(s,o){ return s + Number(o[f]||0); }, 0) / arr.length; }

/* KPI công nhân 1 tháng: giống layKPIKy (chốt chính thức; xưởng chưa chốt -> tính trực tiếp) */
function bcKpiKy_(ky) {
  var snap = laySnapshotThang_(ky, '');
  var theoX = {};
  snap.forEach(function(r){ (theoX[r.MaXuong] = theoX[r.MaXuong] || []).push(r); });
  var xTam = Object.keys(theoX).filter(function(mx){ return theoX[mx].every(laChotTam_); });
  var ds = snap, chinhThuc = snap.length > 0 && !xTam.length && ky < kyVN_();
  if (!snap.length || xTam.length || ky >= kyVN_()) {
    var song = tinhThangTrucTiep_(ky, '');
    ds = (!snap.length || ky >= kyVN_()) ? song
      : snap.filter(function(r){ return xTam.indexOf(r.MaXuong) < 0; }).concat(song.filter(function(r){ return xTam.indexOf(r.MaXuong) >= 0; }));
  }
  var out = ds.map(function(o){
    return { MaNV:o.MaNV, HoTen:o.HoTen, MaXuong:o.MaXuong, sl:Number(o.HieuSuatSL), cl:Number(o.ChatLuong), tt:Number(o.TuanThu),
             at:Number(o.AnToan), tong:Number(o.TongKPI), spl:Number(o.TongSanLuong||0) };
  });
  var theoXuong = {};
  out.forEach(function(o){ o.loai = loaiCo_(o.MaNV, ky, o.tong); (theoXuong[o.MaXuong] = theoXuong[o.MaXuong] || []).push(o); });
  Object.keys(theoXuong).forEach(function(mx){ sapXepHangHV_(theoXuong[mx], ky); });
  return { ds:out, chinhThuc:chinhThuc };
}

/* KPI quản lý (TP/PP) 1 tháng — cùng cách tính với layKPIQuanLy, không cần phiên đăng nhập */
function bcKpiQL_(ky) {
  try {
    var dt = docDuLieuKPI_(canLuuTru_([ky]));
    dt.congdoan = doc_('CongDoan');
    if (!dt.xacNhanDD) dt.xacNhanDD = ss_().getSheetByName('XacNhanDiemDanh') ? doc_('XacNhanDiemDanh') : [];
    dt.phatTre = ss_().getSheetByName('PhatNhapTre') ? doc_('PhatNhapTre') : [];
    dt.mienKPI = {};
    if (ss_().getSheetByName('MienTruKPIQuanLy')) doc_('MienTruKPIQuanLy').forEach(function(m){ dt.mienKPI[String(m.IdKhoan)] = m.LyDo || 1; });
    var xuongCuaCD = {}, nkTheoXuong = {};
    dt.congdoan.forEach(function(c){ xuongCuaCD[c.MaCD] = String(c.MaXuong); });
    dt.nhatky.forEach(function(r){ var mx = xuongCuaCD[r.MaCD]; if (mx) (nkTheoXuong[mx] = nkTheoXuong[mx] || []).push(r); });
    return doc_('TaiKhoan').filter(function(a){ var vt = String(a.VaiTro).trim(); return (vt === 'TP' || vt === 'PP') && a.MaNV; }).map(function(a){
      var nv = dt.nhansu.filter(function(x){ return x.MaNV === a.MaNV; })[0];
      if (!nv) return null;
      dt.nhatkyXuong = nkTheoXuong[String(nv.MaXuong)] || [];
      var k = kpiQuanLy_(nv.MaNV, nv.MaXuong, ky, dt);
      return { MaNV:nv.MaNV, HoTen:nv.HoTen, MaXuong:nv.MaXuong, vaiTro:String(a.VaiTro).trim(), tong:k.tong,
               hsXuong:k.hieuSuatXuong, tlDat:k.tyLeDatXuong, vanHanh:k.vanHanh, neNep:k.neNep };
    }).filter(Boolean);
  } catch (e) { Logger.log('KPI quản lý lỗi: ' + e); return []; }
}

/* Gom MỌI số liệu của 1 tháng (+ tháng trước để so sánh). Dùng chung cho báo cáo toàn nhà máy và từng xưởng. */
function bcDuLieu_(ky) {
  var kyT = kyTruoc_(ky);
  var dt = docDuLieuKPI_(canLuuTru_([ky, kyT]));
  var congdoan = doc_('CongDoan'), xuongCD = {}, tenCD = {};
  congdoan.forEach(function(c){ xuongCD[c.MaCD] = String(c.MaXuong); tenCD[c.MaCD] = c.TenCD; });
  var tenX = {};
  doc_('PhongBan').forEach(function(p){ tenX[p.MaXuong] = p.TenXuong; });
  var maQL = mapQuanLy_();

  var k = bcKpiKy_(ky), kT = bcKpiKy_(kyT);
  var kpiT = {};
  kT.ds.forEach(function(o){ kpiT[o.MaNV] = o; });

  // ---- Sản lượng (nhật ký đã chốt), lỗi KCS, giờ chuẩn; theo xưởng / ngày / công đoạn
  function sanLuong(thang) {
    var X = {}, CD = {}, daTinhLoi = {}, dong = 0;
    dt.nhatky.forEach(function(r){
      if (String(r.TrangThai).trim() !== 'Đã chốt') return;
      var ng = ngayVN_(r.Ngay); if (ng.slice(0,7) !== thang) return;
      var mx = xuongCD[r.MaCD] || dt.idxXuongNV[r.MaNV] || ''; dong++;
      var sl = Number(r.SoLuongLamRa) || 0, d = dmNgay_(dt, r.MaCD, ng), gio = soVN_(r.GioLam) || 0;
      var kl = r.MaNV + '|' + ng + '|' + r.MaCD, loi = daTinhLoi[kl] ? 0 : (dt.idxLoi[kl] || 0); daTinhLoi[kl] = 1;
      var x = X[mx] || (X[mx] = { sl:0, loi:0, gc:0, gio:0, ngay:{}, nguoi:{} });
      x.sl += sl; x.loi += loi; x.ngay[ng] = (x.ngay[ng] || 0) + sl; x.nguoi[r.MaNV] = 1;
      if (d > 0) { x.gc += Math.max(0, sl - loi) / d; if (gio > 0) x.gio += gio; }
      var c = CD[r.MaCD] || (CD[r.MaCD] = { MaCD:r.MaCD, ten:tenCD[r.MaCD] || r.MaCD, MaXuong:mx, dm:d, sl:0, loi:0, gc:0, gio:0, nguoi:{} });
      c.sl += sl; c.loi += loi; c.nguoi[r.MaNV] = 1;
      if (d > 0) { c.gc += Math.max(0, sl - loi) / d; if (gio > 0) c.gio += gio; }
    });
    Object.keys(CD).forEach(function(m){ var c = CD[m]; c.hs = (c.dm > 0 && c.gio > 0) ? c.gc / c.gio * 100 : null; c.soNguoi = Object.keys(c.nguoi).length; c.tlLoi = c.sl ? c.loi / c.sl * 100 : 0; });
    return { X:X, CD:CD, dong:dong };
  }
  var sl = sanLuong(ky), slT = sanLuong(kyT);

  // ---- Chuyên cần: ký hiệu chấm tay trong tháng; ngày công = ngày xưởng đã điểm danh
  function chuyenCan(thang) {
    var X = {}, nguoi = {};
    dt.diemdanh.forEach(function(r){
      var ng = ngayVN_(r.Ngay); if (ng.slice(0,7) !== thang) return;
      var mx = r.MaXuong || dt.idxXuongNV[r.MaNV] || '', kh = khTuBanGhi_(r);
      var x = X[mx] || (X[mx] = { cp:0, kp:0, muon:0, nua:0 });
      var n = nguoi[r.MaNV] || (nguoi[r.MaNV] = { MaNV:r.MaNV, MaXuong:mx, cp:0, kp:0, muon:0, nua:0 });
      if (laVangKyHieu_(kh)) { if (laKhongPhepKyHieu_(kh)) { x.kp++; n.kp++; } else { x.cp++; n.cp++; } }
      else if (kh === '0.5x') { x.nua++; n.nua++; }
      else if (kh.indexOf('x-') === 0) { x.muon++; n.muon++; }
    });
    Object.keys(X).forEach(function(mx){
      var ngayCong = {}; (dt.idxNgayDD[mx + '|' + thang] || []).forEach(function(d){ ngayCong[d] = 1; });
      var soNg = Object.keys(ngayCong).length, soNguoi = dt.nhansu.filter(function(x){ return x.MaXuong === mx; }).length;
      X[mx].ngayCong = soNg; X[mx].tyLe = (soNg && soNguoi) ? Math.max(0, 100 - (X[mx].cp + X[mx].kp) / (soNg * soNguoi) * 100) : null;
    });
    return { X:X, nguoi:nguoi };
  }
  var cc = chuyenCan(ky), ccT = chuyenCan(kyT);

  // ---- Vi phạm trong tháng
  var tenVP = {}; (dt.dmvp || []).forEach(function(v){ tenVP[v.MaVP] = v.TenViPham; });
  function viPham(thang) {
    return (dt.vipham || []).filter(function(v){ return ngayVN_(v.Ngay).slice(0,7) === thang; }).map(function(v){
      return { MaNV:v.MaNV, MaXuong:dt.idxXuongNV[v.MaNV] || '', ten:tenVP[v.MaVP] || v.MaVP, ngay:ngayVN_(v.Ngay), ghiChu:v.GhiChu || '' };
    });
  }
  var vp = viPham(ky), vpT = viPham(kyT);
  var tre = docAnToan_('PhatNhapTre').filter(function(r){ return ngayVN_(r.Ngay).slice(0,7) === ky; });

  // ---- Nhân sự
  var tenNV = {}; doc_('NhanSu').forEach(function(x){ tenNV[x.MaNV] = x.HoTen; });   // gồm cả người đã nghỉ việc
  var nsX = {};
  dt.nhansu.forEach(function(x){
    var o = nsX[x.MaXuong] || (nsX[x.MaXuong] = { tong:0, cn:0, moi:0 });
    o.tong++; if (!maQL[String(x.MaNV).trim()]) o.cn++;
    if (ngayVN_(x.NgayVaoLam).slice(0,7) === ky) o.moi++;
  });

  // Tháng trước có đủ dữ liệu để so không? (vd. tháng đầu dùng web chỉ có vài ngày) -> ít hơn 60% số ngày có sản lượng, hoặc ít hơn một nửa số dòng nhập thì không so
  function soNgaySL(S){ var d = {}; Object.keys(S.X).forEach(function(m){ Object.keys(S.X[m].ngay).forEach(function(n){ d[n] = 1; }); }); return Object.keys(d).length; }
  var duSo = soNgaySL(slT) >= Math.max(1, soNgaySL(sl) * .6) && slT.dong >= sl.dong * .5;   // và số dòng nhập ít nhất bằng nửa tháng này
  var ql = bcKpiQL_(ky);
  var dsX = Object.keys(tenX).filter(function(mx){
    return nsX[mx] || sl.X[mx] || k.ds.some(function(o){ return o.MaXuong === mx; });
  });
  return { ky:ky, kyT:kyT, tenX:tenX, dsX:dsX, tenNV:tenNV, kpi:k.ds, kpiT:kpiT, kpiTds:kT.ds, chinhThuc:k.chinhThuc,
           sl:sl, slT:slT, cc:cc, ccT:ccT, vp:vp, vpT:vpT, duSo:duSo, tre:tre, ns:nsX, ql:ql, com:bcCom_(ky), lapLuc:new Date() };
}

/* Suất ăn trưa của tháng theo xưởng (module cơm trưa); lỗi / chưa dùng thì trả mảng rỗng */
function bcCom_(ky) { try { return typeof comBaoCao_ === 'function' ? comBaoCao_(ky) : []; } catch (e) { return []; } }
function bcComHtml_(ds, so) {
  if (!ds.length) return '';
  var tong = { soNgay:0, an:0, khong:0, chua:0 };
  ds.forEach(function(x){ tong.soNgay = Math.max(tong.soNgay, x.soNgay); tong.an += x.an; tong.khong += x.khong; tong.chua += x.chua; });
  var dong = function(x, i, dam){ return '<tr' + (i % 2 ? ' class="chan"' : '') + '><td>' + (dam ? '<b>' : '') + bcE_(x.ten) + (dam ? '</b>' : '') + '</td><td class="r">' + x.soNgay + '</td><td class="r"><b>' + bcSo_(x.an) + '</b></td><td class="r">' + bcSo_(x.khong) + '</td><td class="r">' + bcSo_(x.chua) + '</td><td class="r">' + (x.soNgay ? bcSo_(x.an / x.soNgay, 1) : '–') + '</td></tr>'; };
  return '<h2>' + so + '. Suất ăn trưa</h2><table class="bang"><tr><th>Xưởng</th><th class="r">Ngày có cơm</th><th class="r">Suất ăn</th><th class="r">Không ăn</th><th class="r">Chưa đăng ký</th><th class="r">TB suất / ngày</th></tr>' +
    ds.map(function(x, i){ return dong(x, i); }).join('') + (ds.length > 1 ? dong({ ten:'Toàn nhà máy', soNgay:tong.soNgay, an:tong.an, khong:tong.khong, chua:tong.chua }, ds.length, true) : '') +
    '</table><p class="nho">Theo đăng ký cơm trưa trên web (nhắc đăng ký trước 16:00 hôm trước, quá giờ vẫn nhận). "Chưa đăng ký": người có tài khoản nhưng không bấm Ăn / Không ăn.</p>';
}

/* Tóm tắt số của 1 phạm vi (mx = '' -> toàn nhà máy) */
function bcTomTat_(du, mx) {
  function loc(a){ return mx ? a.filter(function(o){ return o.MaXuong === mx; }) : a; }
  function cong(X, f){ return Object.keys(X).filter(function(m){ return !mx || m === mx; }).reduce(function(s,m){ return s + (X[m][f] || 0); }, 0); }
  var kp = loc(du.kpi), kpT = loc(du.kpiTds);
  var phanLoai = {}; BC_LOAI.forEach(function(l){ phanLoai[l] = 0; }); kp.forEach(function(o){ phanLoai[o.loai]++; });
  var sl = cong(du.sl.X,'sl'), loi = cong(du.sl.X,'loi'), slT = cong(du.slT.X,'sl'), loiT = cong(du.slT.X,'loi');
  function tlCC(C){ var tu=0, mau=0; Object.keys(C.X).filter(function(m){ return !mx || m === mx; }).forEach(function(m){ var c=C.X[m], n=(du.ns[m]||{}).tong||0; if (c.ngayCong && n){ tu += c.cp + c.kp; mau += c.ngayCong*n; } }); return mau ? 100 - tu/mau*100 : null; }
  var ngay = {};
  Object.keys(du.sl.X).filter(function(m){ return !mx || m === mx; }).forEach(function(m){ var n = du.sl.X[m].ngay; Object.keys(n).forEach(function(d){ ngay[d] = (ngay[d]||0) + n[d]; }); });
  var r = {
    soNguoi:kp.length, kpiTB:bcTB_(kp,'tong'), kpiTBT:bcTB_(kpT,'tong'), hsTB:bcTB_(kp,'sl'), clTB:bcTB_(kp,'cl'), ttTB:bcTB_(kp,'tt'), atTB:bcTB_(kp,'at'),
    phanLoai:phanLoai, tlTot: kp.length ? (phanLoai['S'] + phanLoai['A+'] + phanLoai['A']) / kp.length * 100 : null,
    tlTotT: kpT.length ? kpT.filter(function(o){ return o.tong >= 90; }).length / kpT.length * 100 : null,
    sl:sl, slT:slT, tlLoi: sl ? loi/sl*100 : null, tlLoiT: slT ? loiT/slT*100 : null,
    cc:tlCC(du.cc), ccT:tlCC(du.ccT), vp:loc(du.vp).length, vpT:loc(du.vpT).length, tre:loc(du.tre).length, ngay:ngay
  };
  if (!du.duSo) { r.kpiTBT = r.tlTotT = r.tlLoiT = r.ccT = r.vpT = null; r.slT = 0; }
  return r;
}

/* Nhận định tự động bằng lời (mức: 'tot' | 'canh' | 'xau') */
function bcNhanDinh_(du, mx) {
  var t = bcTomTat_(du, mx), out = [], ten = mx ? bcTenX_(du, mx) : 'Toàn nhà máy';
  if (t.kpiTB !== null) {
    var d = t.kpiTBT !== null ? t.kpiTB - t.kpiTBT : null;
    out.push({ m: t.kpiTB >= 90 ? 'tot' : t.kpiTB >= 80 ? 'canh' : 'xau', s: ten + ' đạt KPI trung bình <b>' + bcSo_(t.kpiTB,1) + '</b> (' + loaiKPI_(t.kpiTB) + ')' +
      (d !== null ? ', ' + (Math.abs(d) < .05 ? 'không đổi' : (d > 0 ? 'tăng ' : 'giảm ') + bcSo_(Math.abs(d),1) + ' điểm') + ' so với ' + bcThang_(du.kyT) : '') + '.' });
  }
  if (!mx) {
    var bx = du.dsX.map(function(m){ var x = bcTomTat_(du, m); return { m:m, kpi:x.kpiTB, d: (x.kpiTB !== null && x.kpiTBT !== null) ? x.kpiTB - x.kpiTBT : null, n:x.soNguoi }; }).filter(function(x){ return x.kpi !== null && x.n >= 3; });
    if (bx.length >= 2) {
      bx.sort(function(a,b){ return b.kpi - a.kpi; });
      out.push({ m:'tot', s:'Dẫn đầu: <b>' + bcE_(bcTenX_(du, bx[0].m)) + '</b> (' + bcSo_(bx[0].kpi,1) + '). Thấp nhất: <b>' + bcE_(bcTenX_(du, bx[bx.length-1].m)) + '</b> (' + bcSo_(bx[bx.length-1].kpi,1) + ').' });
      var coD = bx.filter(function(x){ return x.d !== null; }).sort(function(a,b){ return a.d - b.d; });
      if (coD.length && coD[0].d <= -3) out.push({ m:'xau', s:'<b>' + bcE_(bcTenX_(du, coD[0].m)) + '</b> giảm mạnh nhất: ' + bcSo_(-coD[0].d,1) + ' điểm so với tháng trước – cần tìm nguyên nhân.' });
      if (coD.length && coD[coD.length-1].d >= 3) out.push({ m:'tot', s:'<b>' + bcE_(bcTenX_(du, coD[coD.length-1].m)) + '</b> tiến bộ nhất: tăng ' + bcSo_(coD[coD.length-1].d,1) + ' điểm.' });
    }
  }
  if (t.phanLoai.D) out.push({ m:'xau', s:'<b>' + t.phanLoai.D + ' người</b> xếp loại D (dưới 70 điểm)' + (t.soNguoi ? ', chiếm ' + bcSo_(t.phanLoai.D / t.soNguoi * 100,1) + '%' : '') + ' – nên trao đổi riêng và có kế hoạch kèm cặp.' });
  if (t.sl) out.push({ m: (t.slT && t.sl < t.slT * .95) ? 'canh' : 'tot', s:'Tổng sản lượng <b>' + bcSo_(t.sl) + '</b> sản phẩm' + (t.slT ? ' (' + (t.sl >= t.slT ? 'tăng ' : 'giảm ') + bcSo_(Math.abs(t.sl - t.slT) / t.slT * 100,1) + '% so với tháng trước)' : '') + '.' });
  if (t.tlLoi !== null && t.tlLoi >= 1) out.push({ m: t.tlLoi >= 3 ? 'xau' : 'canh', s:'Tỷ lệ hàng không đạt (KCS) <b>' + bcSo_(t.tlLoi,2) + '%</b>' + (t.tlLoiT !== null ? ' (tháng trước ' + bcSo_(t.tlLoiT,2) + '%)' : '') + '.' });
  var cd = Object.keys(du.sl.CD).map(function(m){ return du.sl.CD[m]; }).filter(function(c){ return (!mx || c.MaXuong === mx) && c.hs !== null && c.gio >= 40; });
  var yeu = cd.filter(function(c){ return c.hs < 80; }).sort(function(a,b){ return b.gio - a.gio; });
  if (yeu.length) out.push({ m:'canh', s:'<b>' + yeu.length + ' công đoạn</b> chạy dưới 80% định mức (nhiều giờ nhất: ' + yeu.slice(0,3).map(function(c){ return bcE_(c.ten) + ' ' + bcSo_(c.hs,0) + '%'; }).join(', ') + ') – xem lại định mức hoặc đào tạo tay nghề.' });
  var vuot = cd.filter(function(c){ return c.hs > 130; });
  if (vuot.length) out.push({ m:'canh', s:'<b>' + vuot.length + ' công đoạn</b> vượt 130% định mức – có thể định mức đang thấp so với thực tế.' });
  if (t.cc !== null && t.cc < 95) out.push({ m: t.cc < 90 ? 'xau' : 'canh', s:'Tỷ lệ chuyên cần <b>' + bcSo_(t.cc,1) + '%</b>.' });
  var kp = Object.keys(du.cc.nguoi).map(function(m){ return du.cc.nguoi[m]; }).filter(function(n){ return (!mx || n.MaXuong === mx) && n.kp >= 2; });
  if (kp.length) out.push({ m:'xau', s:'<b>' + kp.length + ' người</b> nghỉ không phép từ 2 ngày trở lên.' });
  if (t.vp) out.push({ m: (t.vpT !== null && t.vp <= t.vpT) ? 'tot' : 'canh', s:'<b>' + t.vp + '</b> lượt vi phạm nề nếp/chuyên cần' + (t.vpT !== null ? ' (tháng trước ' + t.vpT + ')' : '') + '.' });
  if (!du.duSo && !mx) out.push({ m:'canh', s:'Tháng trước (' + bcThang_(du.kyT) + ') có quá ít dữ liệu trên web (mới bắt đầu dùng) nên báo cáo này <b>không so sánh</b> với tháng trước.' });
  if (t.tre) out.push({ m:'canh', s:'<b>' + t.tre + '</b> lượt bị phạt nhập sản lượng trễ.' });
  return out;
}

/* ---------------- Dựng HTML (bảng thuần, an toàn khi đổi PDF) ---------------- */
var BC_CSS = 'body{font-family:Arial,Helvetica,sans-serif;color:#1d2a33;font-size:10pt;margin:0}' +
  'table{border-collapse:collapse;width:100%}td,th{padding:4px 6px;vertical-align:middle}' +
  '.bang th{background:#0f4c5c;color:#ffffff;font-size:8.5pt;font-weight:bold;text-align:left;border:1px solid #0f4c5c}' +
  '.bang td{border:1px solid #d5dbe0;font-size:9pt}.bang tr.chan td{background:#f5f8fa}.r{text-align:right}.c{text-align:center}' +
  'h2{font-size:13pt;color:#0f4c5c;margin:18px 0 6px;padding-bottom:3px;border-bottom:2px solid #127c74}' +
  '.nho{font-size:8.5pt;color:#5b6770}.trang{page-break-before:always}h2{page-break-after:avoid}tr{page-break-inside:avoid}thead{display:table-header-group}';

function bcThanh_(pt, mau, cao) {            // thanh ngang: bảng 2 ô theo %
  pt = Math.max(0, Math.min(100, pt || 0));
  return '<table style="width:100%;height:' + (cao||8) + 'px"><tr>' + (pt > 0 ? '<td style="width:' + pt.toFixed(1) + '%;background:' + mau + ';padding:0;height:' + (cao||8) + 'px"></td>' : '') +
    (pt < 100 ? '<td style="background:#e8edf0;padding:0"></td>' : '') + '</tr></table>';
}
function bcChongLoai_(pl, tong) {             // thanh xếp chồng phân loại S..D
  if (!tong) return '';
  var h = '<table style="width:100%;height:14px"><tr>';
  BC_LOAI.forEach(function(l){ var p = pl[l] / tong * 100; if (p > 0) h += '<td style="width:' + p.toFixed(1) + '%;background:' + BC_MAU_LOAI[l] + ';padding:0;color:#fff;font-size:7.5pt;text-align:center">' + (p >= 7 ? l : '') + '</td>'; });
  return h + '</tr></table>';
}
function bcCotNgay_(ngay, ky) {               // biểu đồ cột sản lượng theo ngày
  var ds = Object.keys(ngay).sort(); if (!ds.length) return '<p class="nho">Chưa có sản lượng đã duyệt trong tháng.</p>';
  var max = Math.max.apply(null, ds.map(function(d){ return ngay[d]; })), TB = ds.reduce(function(s,d){ return s + ngay[d]; }, 0) / ds.length, CAO = 110;
  var h = '<table style="width:100%;table-layout:fixed"><tr>';
  ds.forEach(function(d){ var v = ngay[d], ch = Math.max(2, Math.round(v / max * CAO));
    h += '<td style="vertical-align:bottom;padding:0 1px;height:' + (CAO + 14) + 'px;text-align:center"><div style="font-size:6pt;color:#5b6770">' + (v >= 1000 ? bcSo_(v/1000,1) + 'k' : bcSo_(v)) + '</div>' +
      '<div style="height:' + ch + 'px;background:' + (v < TB * .8 ? '#e0a03a' : '#127c74') + '"></div></td>'; });
  h += '</tr><tr>';
  ds.forEach(function(d){ h += '<td style="font-size:6.5pt;color:#5b6770;text-align:center;padding:2px 0;border-top:1px solid #9aa6ae">' + Number(d.slice(8)) + '</td>'; });
  return h + '</tr></table><p class="nho">Cột cam: ngày thấp hơn 80% mức trung bình ' + bcSo_(TB) + ' sp/ngày. Sản lượng tính theo ngày làm, chỉ gồm dòng đã duyệt.</p>';
}
function bcO_(nhan, gt, phu, mau) {
  return '<td style="width:33%;padding:5px"><table style="border:1px solid #d5dbe0;border-left:4px solid ' + (mau || '#127c74') + ';background:#fafcfd"><tr><td style="padding:8px 10px">' +
    '<div style="font-size:8.5pt;color:#5b6770">' + nhan + '</div><div style="font-size:18pt;font-weight:bold;color:#1d2a33;margin:2px 0">' + gt + '</div><div style="font-size:8pt">' + phu + '</div></td></tr></table></td>';
}
function bcDau_(du, mx, tieuDe) {
  var lap = Utilities.formatDate(du.lapLuc, TZ_VN, 'HH:mm dd/MM/yyyy');
  return '<table style="background:#0f4c5c;color:#ffffff"><tr><td style="padding:16px 18px">' +
    '<div style="font-size:9pt;letter-spacing:1px;color:#9fd8d1">BÁO CÁO SẢN XUẤT &amp; KPI</div>' +
    '<div style="font-size:20pt;font-weight:bold;margin-top:4px">' + tieuDe + '</div>' +
    '<div style="font-size:11pt;margin-top:2px">' + (mx ? bcE_(bcTenX_(du, mx)) + ' · ' : '') + bcThang_(du.ky).replace('tháng','Tháng') + '</div></td>' +
    '<td style="padding:16px 18px;text-align:right;font-size:8.5pt;color:#cfe3e6;vertical-align:bottom">Lập tự động lúc ' + lap + '<br>' +
    (du.chinhThuc ? 'Số liệu KPI: <b style="color:#ffffff">đã chốt chính thức</b>' : 'Số liệu KPI: <b style="color:#ffd27a">tạm tính (chưa chốt)</b>') + '</td></tr></table>';
}
function bcNhanDinhHtml_(nd) {
  if (!nd.length) return '';
  var mau = { tot:'#1e7f5c', canh:'#b7791f', xau:'#c0392b' };
  return '<table>' + nd.map(function(x){ return '<tr><td style="width:14px;vertical-align:top;padding:5px 0"><div style="width:9px;height:9px;background:' + mau[x.m] + ';margin-top:3px"></div></td><td style="padding:4px 6px;font-size:10pt;line-height:1.45">' + x.s + '</td></tr>'; }).join('') + '</table>';
}
function bcTomTatHtml_(t, du) {
  return '<table><tr>' +
    bcO_('KPI trung bình công nhân', t.kpiTB === null ? '–' : bcSo_(t.kpiTB,1), bcLech_(t.kpiTB, t.kpiTBT, 1, ' điểm') + ' · ' + t.soNguoi + ' người', t.kpiTB >= 90 ? '#1e7f5c' : t.kpiTB >= 80 ? '#d29b2a' : '#c0392b') +
    bcO_('Tổng sản lượng (sp)', bcSo_(t.sl), t.slT ? bcLech_(t.sl / t.slT * 100, 100, 1, '%') + ' so với tháng trước' : 'chưa có tháng trước') +
    bcO_('Tỷ lệ xếp loại S/A+/A', t.tlTot === null ? '–' : bcSo_(t.tlTot,1) + '%', bcLech_(t.tlTot, t.tlTotT, 1, ' điểm %')) + '</tr><tr>' +
    bcO_('Tỷ lệ hàng không đạt (KCS)', t.tlLoi === null ? '–' : bcSo_(t.tlLoi,2) + '%', bcLech_(t.tlLoi, t.tlLoiT, 2, ' điểm %', true), t.tlLoi >= 3 ? '#c0392b' : '#127c74') +
    bcO_('Tỷ lệ chuyên cần', t.cc === null ? '–' : bcSo_(t.cc,1) + '%', bcLech_(t.cc, t.ccT, 1, ' điểm %')) +
    bcO_('Vi phạm nề nếp / nhập trễ', t.vp + ' / ' + t.tre, bcLech_(t.vp, t.vpT, 0, ' lượt', true)) + '</tr></table>';
}
function bcBangKPI_(ds, du, coXuong) {
  var h = '<table class="bang"><tr><th class="c">' + (coXuong ? 'Hạng trong xưởng' : 'Hạng') + '</th><th>Mã</th><th>Họ tên</th>' + (coXuong ? '<th>Xưởng</th>' : '') +
    '<th class="r">Sản lượng %</th><th class="r">Chất lượng</th><th class="r">Tuân thủ</th><th class="r">An toàn</th><th class="r">KPI</th><th class="c">Loại</th>' + (du.duSo ? '<th class="r">So tháng trước</th>' : '') + '<th class="r">Số sp</th></tr>';
  ds.forEach(function(o, i){ var cu = du.duSo ? du.kpiT[o.MaNV] : null;
    h += '<tr' + (i % 2 ? ' class="chan"' : '') + '><td class="c">' + (o.hang || i+1) + '</td><td>' + bcE_(o.MaNV) + '</td><td>' + bcE_(o.HoTen) + '</td>' + (coXuong ? '<td>' + bcE_(du.tenX[o.MaXuong] || o.MaXuong) + '</td>' : '') +
      '<td class="r">' + bcSo_(o.sl,1) + '</td><td class="r">' + bcSo_(o.cl,1) + '</td><td class="r">' + bcSo_(o.tt,0) + '</td><td class="r">' + bcSo_(o.at,0) + '</td>' +
      '<td class="r"><b>' + bcSo_(o.tong,1) + '</b></td><td class="c" style="color:#ffffff;background:' + BC_MAU_LOAI[o.loai] + ';font-weight:bold">' + o.loai + '</td>' +
      (du.duSo ? '<td class="r">' + (cu ? bcLech_(o.tong, cu.tong, 1, '') : '<span style="color:#8a949c">mới</span>') + '</td>' : '') + '<td class="r">' + bcSo_(o.spl) + '</td></tr>'; });
  return h + '</table>';
}
function bcBangCD_(dsCD, du, coXuong) {
  if (!dsCD.length) return '<p class="nho">Không có dữ liệu công đoạn.</p>';
  var h = '<table class="bang"><tr><th>Công đoạn</th>' + (coXuong ? '<th>Xưởng</th>' : '') + '<th class="r">Định mức (sp/giờ)</th><th class="r">Sản lượng</th><th class="r">Giờ chuẩn</th><th class="r">Giờ làm khai</th><th class="r">Hiệu suất</th><th style="width:22%"></th><th class="r">Lỗi KCS</th><th class="r">Số người</th></tr>';
  dsCD.forEach(function(c, i){ var hs = (c.hs !== null && c.gio >= 8) ? c.hs : null, m = hs === null ? '#9aa6ae' : hs > 300 ? '#b7791f' : hs >= 100 ? '#1e7f5c' : hs >= 80 ? '#d29b2a' : '#c0392b';
    h += '<tr' + (i % 2 ? ' class="chan"' : '') + '><td>' + bcE_(c.ten) + '</td>' + (coXuong ? '<td>' + bcE_(du.tenX[c.MaXuong] || c.MaXuong) + '</td>' : '') +
      '<td class="r">' + (c.dm ? bcSo_(c.dm,1) : 'chưa có') + '</td><td class="r">' + bcSo_(c.sl) + '</td><td class="r">' + (c.dm ? bcSo_(c.gc,1) : '–') + '</td><td class="r">' + bcSo_(c.gio,1) + '</td>' +
      '<td class="r" style="color:' + m + ';font-weight:bold">' + (hs === null ? '–' : hs > 300 ? '&gt;300%' : bcSo_(hs,0) + '%') + '</td><td>' + (hs === null ? '' : bcThanh_(hs / 1.5, m, 7)) + '</td>' +
      '<td class="r">' + (c.loi ? bcSo_(c.loi) + ' (' + bcSo_(c.tlLoi,1) + '%)' : '–') + '</td><td class="r">' + c.soNguoi + '</td></tr>'; });
  return h + '</table><p class="nho">Giờ chuẩn = số đạt ÷ định mức. Hiệu suất công đoạn = giờ chuẩn ÷ giờ làm công nhân khai cho công đoạn đó. Thanh đầy = 150%. Công đoạn khai dưới 8 giờ trong tháng không tính hiệu suất (–); trên 300% thường do khai thiếu giờ làm.</p>';
}
function bcPhuongPhap_(du) {
  return '<h2>Ghi chú cách tính</h2><p class="nho" style="line-height:1.5">KPI công nhân lấy đúng như bảng KPI trên web: ' +
    (du.chinhThuc ? 'bản chốt chính thức của tháng.' : 'có xưởng chưa chốt chính thức nên đang tính trực tiếp từ dữ liệu hiện có; số có thể đổi đến khi chốt.') +
    ' KPI = Sản lượng × trọng số + Chất lượng × trọng số + Tuân thủ × trọng số + An toàn × trọng số (trọng số theo đúng kỳ). Xếp loại: S ≥ 95, A+ ≥ 90, A ≥ 85, B ≥ 80, C ≥ 70, D &lt; 70. ' +
    'Sản lượng chỉ gồm dòng đã duyệt. Tỷ lệ chuyên cần = 1 − (ngày vắng có phép + không phép) ÷ (số người × số ngày đã điểm danh). Không gồm trưởng/phó phòng trong bảng KPI công nhân (có bảng KPI quản lý riêng).</p>';
}

/* Báo cáo TOÀN NHÀ MÁY gửi ban lãnh đạo */
function bcHtmlTong_(du) {
  var t = bcTomTat_(du, ''), h = '<html><head><meta charset="utf-8"><style>' + BC_CSS + '</style></head><body>';
  h += bcDau_(du, '', 'Báo cáo tháng toàn nhà máy');
  h += '<h2>1. Tóm tắt</h2>' + bcTomTatHtml_(t, du);
  h += '<h2>2. Nhận định chính</h2>' + bcNhanDinhHtml_(bcNhanDinh_(du, ''));
  // So sánh xưởng
  var bx = du.dsX.map(function(mx){ var x = bcTomTat_(du, mx); x.mx = mx; x.ql = du.ql.filter(function(q){ return q.MaXuong === mx && q.vaiTro === 'TP'; })[0]; return x; })
    .filter(function(x){ return x.soNguoi || x.sl; }).sort(function(a,b){ return (b.kpiTB||0) - (a.kpiTB||0); });
  h += '<h2>3. So sánh các xưởng</h2><table class="bang"><tr><th class="c">#</th><th>Xưởng</th><th class="r">Người</th><th class="r">KPI TB</th><th style="width:15%">Phân loại S → D</th>' + (du.duSo ? '<th class="r">So tháng trước</th>' : '') + '<th class="r">Sản lượng</th><th class="r">Lỗi KCS</th><th class="r">Chuyên cần</th><th class="r">Vi phạm</th><th class="r">KPI trưởng phòng</th></tr>';
  bx.forEach(function(x, i){
    h += '<tr' + (i % 2 ? ' class="chan"' : '') + '><td class="c">' + (i+1) + '</td><td><b>' + bcE_(du.tenX[x.mx] || x.mx) + '</b></td><td class="r">' + x.soNguoi + '</td>' +
      '<td class="r"><b style="color:' + (x.kpiTB >= 90 ? '#1e7f5c' : x.kpiTB >= 80 ? '#b7791f' : '#c0392b') + '">' + bcSo_(x.kpiTB,1) + '</b></td><td>' + bcChongLoai_(x.phanLoai, x.soNguoi) + '</td>' +
      (du.duSo ? '<td class="r">' + bcLech_(x.kpiTB, x.kpiTBT, 1, '') + '</td>' : '') + '<td class="r">' + bcSo_(x.sl) + '</td><td class="r">' + (x.tlLoi === null ? '–' : bcSo_(x.tlLoi,2) + '%') + '</td>' +
      '<td class="r">' + (x.cc === null ? '–' : bcSo_(x.cc,1) + '%') + '</td><td class="r">' + x.vp + '</td><td class="r">' + (x.ql ? bcSo_(x.ql.tong,1) : '–') + '</td></tr>'; });
  h += '</table><p class="nho">Thanh phân loại: <span style="color:' + BC_MAU_LOAI.S + '">■</span> S <span style="color:' + BC_MAU_LOAI['A+'] + '">■</span> A+ <span style="color:' + BC_MAU_LOAI.A + '">■</span> A <span style="color:' + BC_MAU_LOAI.B + '">■</span> B <span style="color:' + BC_MAU_LOAI.C + '">■</span> C <span style="color:' + BC_MAU_LOAI.D + '">■</span> D. Xếp theo KPI trung bình.</p>';
  // Phân loại toàn nhà máy
  h += '<h2>4. Phân bố xếp loại toàn nhà máy</h2><table class="bang"><tr>' + BC_LOAI.map(function(l){ return '<th class="c" style="background:' + BC_MAU_LOAI[l] + ';border-color:' + BC_MAU_LOAI[l] + '">' + l + '</th>'; }).join('') + '</tr><tr>' +
    BC_LOAI.map(function(l){ return '<td class="c"><b style="font-size:13pt">' + t.phanLoai[l] + '</b><br><span class="nho">' + (t.soNguoi ? bcSo_(t.phanLoai[l]/t.soNguoi*100,1) : '0') + '%</span></td>'; }).join('') + '</tr></table>';
  h += '<div class="trang"></div><h2>5. Sản lượng theo ngày</h2>' + bcCotNgay_(t.ngay, du.ky);
  // Top/bottom
  var ds = du.kpi.slice().sort(function(a,b){ return b.tong - a.tong; });
  h += '<h2>6. 10 công nhân dẫn đầu</h2>' + bcBangKPI_(ds.slice(0,10), du, true);
  h += '<h2>7. 10 công nhân cần hỗ trợ</h2>' + bcBangKPI_(ds.slice(-10).reverse(), du, true);
  // Công đoạn cần chú ý
  var cd = Object.keys(du.sl.CD).map(function(m){ return du.sl.CD[m]; }).filter(function(c){ return c.hs !== null && c.gio >= 40; });
  var yeu = cd.filter(function(c){ return c.hs < 85; }).sort(function(a,b){ return b.gio - a.gio; }).slice(0,12);
  h += '<div class="trang"></div><h2>8. Công đoạn dưới 85% định mức (nhiều giờ nhất)</h2>' + bcBangCD_(yeu, du, true);
  var loi = Object.keys(du.sl.CD).map(function(m){ return du.sl.CD[m]; }).filter(function(c){ return c.loi > 0; }).sort(function(a,b){ return b.loi - a.loi; }).slice(0,8);
  if (loi.length) h += '<h2>9. Công đoạn nhiều hàng lỗi nhất</h2>' + bcBangCD_(loi, du, true);
  // KPI quản lý
  if (du.ql.length) {
    h += '<h2>' + (loi.length ? 10 : 9) + '. KPI quản lý (trưởng / phó phòng)</h2><table class="bang"><tr><th>Họ tên</th><th>Chức vụ</th><th>Xưởng</th><th class="r">Hiệu suất xưởng</th><th class="r">Tỷ lệ đạt</th><th class="r">Vận hành</th><th class="r">Nề nếp</th><th class="r">KPI quản lý</th><th class="c">Loại</th></tr>';
    du.ql.slice().sort(function(a,b){ return b.tong - a.tong; }).forEach(function(q, i){ var l = loaiKPI_(q.tong);
      h += '<tr' + (i % 2 ? ' class="chan"' : '') + '><td>' + bcE_(q.HoTen) + '</td><td>' + (q.vaiTro === 'TP' ? 'Trưởng phòng' : 'Phó phòng') + '</td><td>' + bcE_(du.tenX[q.MaXuong] || q.MaXuong) + '</td>' +
        '<td class="r">' + bcSo_(q.hsXuong,1) + '</td><td class="r">' + bcSo_(q.tlDat,1) + '</td><td class="r">' + bcSo_(q.vanHanh,1) + '</td><td class="r">' + bcSo_(q.neNep,1) + '</td>' +
        '<td class="r"><b>' + bcSo_(q.tong,1) + '</b></td><td class="c" style="color:#fff;background:' + BC_MAU_LOAI[l] + ';font-weight:bold">' + l + '</td></tr>'; });
    h += '</table>';
  }
  h += bcComHtml_(du.com || [], (du.ql.length ? (loi.length ? 11 : 10) : (loi.length ? 10 : 9)));
  return bcThead_(h + bcPhuongPhap_(du) + '</body></html>');
}

/* Báo cáo RIÊNG MỘT XƯỞNG (trưởng phòng tải về) */
function bcHtmlXuong_(du, mx) {
  var t = bcTomTat_(du, mx), tNM = bcTomTat_(du, ''), ten = du.tenX[mx] || mx;
  var hang = du.dsX.map(function(m){ return { m:m, k:bcTomTat_(du, m) }; }).filter(function(x){ return x.k.soNguoi; }).sort(function(a,b){ return (b.k.kpiTB||0) - (a.k.kpiTB||0); });
  var viTri = hang.map(function(x){ return x.m; }).indexOf(mx) + 1;
  var h = '<html><head><meta charset="utf-8"><style>' + BC_CSS + '</style></head><body>';
  h += bcDau_(du, mx, 'Báo cáo tháng ' + bcE_(bcTenX_(du, mx).replace(/^Xưởng/, 'xưởng')));
  h += '<h2>1. Tóm tắt</h2>' + bcTomTatHtml_(t, du);
  h += '<p class="nho">So với toàn nhà máy: KPI trung bình nhà máy ' + bcSo_(tNM.kpiTB,1) + (viTri ? ' · xưởng đứng thứ <b>' + viTri + '/' + hang.length + '</b> về KPI trung bình' : '') + '.</p>';
  h += '<h2>2. Nhận định</h2>' + bcNhanDinhHtml_(bcNhanDinh_(du, mx));
  h += '<h2>3. Phân loại công nhân</h2>' + bcChongLoai_(t.phanLoai, t.soNguoi) + '<p class="nho">' + BC_LOAI.map(function(l){ return l + ': <b>' + t.phanLoai[l] + '</b>'; }).join(' · ') + '</p>';
  var ds = du.kpi.filter(function(o){ return o.MaXuong === mx; }).sort(function(a,b){ return a.hang - b.hang; });
  h += '<h2>4. KPI từng công nhân</h2>' + (ds.length ? bcBangKPI_(ds, du, false) : '<p class="nho">Chưa có KPI.</p>');
  h += '<div class="trang"></div><h2>5. Sản lượng theo ngày</h2>' + bcCotNgay_(t.ngay, du.ky);
  var cd = Object.keys(du.sl.CD).map(function(m){ return du.sl.CD[m]; }).filter(function(c){ return c.MaXuong === mx; }).sort(function(a,b){ return b.gc - a.gc || b.sl - a.sl; });
  h += '<h2>6. 15 công đoạn đóng góp nhiều giờ chuẩn nhất</h2>' + bcBangCD_(cd.slice(0, 15), du, false) +
    (cd.length > 15 ? '<p class="nho">Còn ' + (cd.length - 15) + ' công đoạn khác (xem chi tiết ở trang Phân tích định mức trên web).</p>' : '');
  // Chuyên cần
  var cc = Object.keys(du.cc.nguoi).map(function(m){ return du.cc.nguoi[m]; }).filter(function(n){ return n.MaXuong === mx && (n.cp + n.kp + n.muon + n.nua); })
    .sort(function(a,b){ return (b.kp*3 + b.cp + b.muon*.5) - (a.kp*3 + a.cp + a.muon*.5); });
  h += '<h2>7. Chuyên cần</h2>' + (cc.length ? '<table class="bang"><tr><th>Họ tên</th><th>Mã</th><th class="r">Vắng có phép</th><th class="r">Vắng không phép</th><th class="r">Đi muộn</th><th class="r">Nửa ngày</th></tr>' +
    cc.map(function(n, i){ return '<tr' + (i % 2 ? ' class="chan"' : '') + '><td>' + bcE_(du.tenNV[n.MaNV] || n.MaNV) + '</td><td>' + bcE_(n.MaNV) + '</td><td class="r">' + (n.cp || '–') + '</td><td class="r"' + (n.kp ? ' style="color:#c0392b;font-weight:bold"' : '') + '>' + (n.kp || '–') + '</td><td class="r">' + (n.muon || '–') + '</td><td class="r">' + (n.nua || '–') + '</td></tr>'; }).join('') + '</table>'
    : '<p class="nho">Không có ngày vắng / đi muộn nào được chấm trong tháng.</p>');
  // Vi phạm
  var vp = du.vp.filter(function(v){ return v.MaXuong === mx; }).sort(function(a,b){ return a.ngay.localeCompare(b.ngay); });
  h += '<h2>8. Vi phạm nề nếp</h2>' + (vp.length ? '<table class="bang"><tr><th>Ngày</th><th>Họ tên</th><th>Lỗi</th><th>Ghi chú</th></tr>' +
    vp.map(function(v, i){ return '<tr' + (i % 2 ? ' class="chan"' : '') + '><td>' + v.ngay.slice(8) + '/' + v.ngay.slice(5,7) + '</td><td>' + bcE_(du.tenNV[v.MaNV] || v.MaNV) + '</td><td>' + bcE_(v.ten) + '</td><td>' + bcE_(v.ghiChu) + '</td></tr>'; }).join('') + '</table>'
    : '<p class="nho">Không có vi phạm.</p>');
  var ql = du.ql.filter(function(q){ return q.MaXuong === mx; });
  if (ql.length) h += '<h2>9. KPI quản lý</h2><table class="bang"><tr><th>Họ tên</th><th>Chức vụ</th><th class="r">Hiệu suất xưởng</th><th class="r">Tỷ lệ đạt</th><th class="r">Vận hành</th><th class="r">Nề nếp</th><th class="r">KPI quản lý</th></tr>' +
    ql.map(function(q){ return '<tr><td>' + bcE_(q.HoTen) + '</td><td>' + (q.vaiTro === 'TP' ? 'Trưởng phòng' : 'Phó phòng') + '</td><td class="r">' + bcSo_(q.hsXuong,1) + '</td><td class="r">' + bcSo_(q.tlDat,1) + '</td><td class="r">' + bcSo_(q.vanHanh,1) + '</td><td class="r">' + bcSo_(q.neNep,1) + '</td><td class="r"><b>' + bcSo_(q.tong,1) + '</b></td></tr>'; }).join('') + '</table>';
  h += bcComHtml_((du.com || []).filter(function(x){ return x.mx === mx; }), ql.length ? 10 : 9);
  return bcThead_(h + bcPhuongPhap_(du) + '</body></html>');
}

/* Dòng tiêu đề của mỗi bảng thành <thead> để lặp lại khi bảng sang trang */
function bcThead_(h) { return h.replace(/<table class="bang"><tr>([\s\S]*?)<\/tr>/g, '<table class="bang"><thead><tr>$1</tr></thead>'); }
function bcPdf_(html, tenFile) {
  return HtmlService.createHtmlOutput(html).getAs('application/pdf').setName(tenFile);
}
function bcTenFile_(ky, mx, du) {
  var bo = function(s){ return String(s).normalize ? String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').replace(/[^A-Za-z0-9]+/g,'-') : s; };
  return 'Bao-cao-KPI-' + ky + (mx ? '-' + bo(du.tenX[mx] || mx) : '-Toan-nha-may') + '.pdf';
}

/* API cho web (tên bắt đầu bằng 'lay' để giao diện coi là hàm chỉ đọc): TP tải báo cáo xưởng mình; ban điều hành tải toàn nhà máy hoặc xưởng bất kỳ.
   dang = 'pdf' (mặc định) -> {ok, ten, b64}; 'html' -> {ok, html} để xem / in từ trình duyệt. */
function layBaoCaoThang(token, ky, maXuong, dang) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok:false, hetHan:true, msg:'Phiên đăng nhập đã hết hạn.' });
  if (me.vaiTro !== 'ADMIN' && me.vaiTro !== 'TP') return sach_({ ok:false, msg:'Chỉ ban điều hành và trưởng phòng được tải báo cáo tháng.' });
  ky = String(ky || kyTruoc_(kyVN_()));
  if (!/^\d{4}-\d{2}$/.test(ky) || ky > kyVN_()) return sach_({ ok:false, msg:'Tháng không hợp lệ.' });
  var mx = me.vaiTro === 'TP' ? me.xuong : String(maXuong || '');
  var du = bcDuLieu_(ky);
  if (mx && du.dsX.indexOf(mx) < 0) return sach_({ ok:false, msg:'Không có dữ liệu xưởng này trong tháng.' });
  var html = mx ? bcHtmlXuong_(du, mx) : bcHtmlTong_(du);
  if (dang === 'html') return sach_({ ok:true, html:html });
  var ten = bcTenFile_(ky, mx, du);
  return sach_({ ok:true, ten:ten, b64:Utilities.base64Encode(bcPdf_(html, ten).getBytes()) });
}

/* Danh sách người nhận (sheet NguoiNhanBaoCao). Trả {tong:[email], xuong:{MaXuong:[email]}} */
var BC_EMAIL_MAU = 'email-ban-giam-doc@vidu.com';
function bcNguoiNhan_() {
  var o = { tong:[], xuong:{} };
  docAnToan_(BC_SHEET_NHAN).forEach(function(r){
    var em = String(r.Email || '').trim(), loai = String(r.NhanBaoCao || '').trim().toUpperCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) return;
    if (em.toLowerCase() === BC_EMAIL_MAU) return;   // dòng mẫu do TAO_SHEET_NGUOI_NHAN_BAO_CAO tạo, chưa thay email thật
    if (loai === 'TOAN_NHA_MAY' || loai === 'TAT_CA' || !loai) o.tong.push(em);
    if (loai === 'TAT_CA') o.tatCa = (o.tatCa || []).concat(em);
    else if (loai && loai !== 'TOAN_NHA_MAY') (o.xuong[String(r.NhanBaoCao).trim()] = o.xuong[String(r.NhanBaoCao).trim()] || []).push(em);
  });
  return o;
}
function bcThuMuc_(ky) {
  var it = DriveApp.getFoldersByName(BC_THU_MUC), goc = it.hasNext() ? it.next() : DriveApp.createFolder(BC_THU_MUC);
  var con = goc.getFoldersByName(ky);
  return con.hasNext() ? con.next() : goc.createFolder(ky);
}

/* Tạo toàn bộ báo cáo của 1 tháng: lưu PDF vào Google Drive (thư mục "Báo cáo KPI hằng tháng/<tháng>") và gửi email.
   Gọi tự động sau khi chốt tháng; cũng chạy tay được (GUI_BAO_CAO_THANG_TRUOC). */
function guiBaoCaoThang_(ky) {
  var du = bcDuLieu_(ky), nhan = bcNguoiNhan_(), thuMuc = null, ketQua = { ky:ky, tep:[], email:0 };
  try { thuMuc = bcThuMuc_(ky); } catch (e) { Logger.log('Không mở được Google Drive: ' + e); }
  var tong = bcPdf_(bcHtmlTong_(du), bcTenFile_(ky, '', du));
  var tepX = {};
  du.dsX.forEach(function(mx){ if (bcTomTat_(du, mx).soNguoi) tepX[mx] = bcPdf_(bcHtmlXuong_(du, mx), bcTenFile_(ky, mx, du)); });
  if (thuMuc) {
    [tong].concat(Object.keys(tepX).map(function(m){ return tepX[m]; })).forEach(function(b){
      var cu = thuMuc.getFilesByName(b.getName()); while (cu.hasNext()) cu.next().setTrashed(true);
      ketQua.tep.push(thuMuc.createFile(b).getName());
    });
  }
  var t = bcTomTat_(du, ''), nd = bcNhanDinh_(du, '').slice(0, 5);
  var than = '<div style="font-family:Arial,sans-serif;font-size:14px;color:#1d2a33"><p>Kính gửi Ban lãnh đạo,</p><p>Hệ thống KPI gửi báo cáo sản xuất &amp; KPI <b>' + bcThang_(ky) + '</b>' + (du.chinhThuc ? ' (đã chốt chính thức)' : ' (tạm tính)') + '.</p>' +
    '<p>KPI trung bình công nhân: <b>' + bcSo_(t.kpiTB,1) + '</b> · Tổng sản lượng: <b>' + bcSo_(t.sl) + '</b> sp · Tỷ lệ S/A+/A: <b>' + bcSo_(t.tlTot,1) + '%</b></p><ul>' +
    nd.map(function(x){ return '<li style="margin:4px 0">' + x.s + '</li>'; }).join('') + '</ul><p>Chi tiết trong tệp PDF đính kèm' + (thuMuc ? ' và trên Google Drive: <a href="' + thuMuc.getUrl() + '">' + BC_THU_MUC + ' / ' + ky + '</a>' : '') + '.</p>' +
    '<p style="color:#8a949c;font-size:12px">Email tự động từ web KPI sản xuất.</p></div>';
  if (nhan.tong.length) {
    MailApp.sendEmail({ to:nhan.tong.join(','), subject:'Báo cáo sản xuất & KPI ' + bcThang_(ky), htmlBody:than, attachments:[tong], name:'Hệ thống KPI sản xuất' });
    ketQua.email += nhan.tong.length;
  }
  Object.keys(tepX).forEach(function(mx){
    var ds = (nhan.xuong[mx] || []).concat(nhan.tatCa || []);
    if (!ds.length) return;
    MailApp.sendEmail({ to:ds.join(','), subject:'Báo cáo KPI ' + bcThang_(ky) + ' – ' + bcTenX_(du, mx), name:'Hệ thống KPI sản xuất',
      htmlBody:'<div style="font-family:Arial,sans-serif;font-size:14px">Báo cáo KPI ' + bcThang_(ky) + ' của <b>' + bcE_(bcTenX_(du, mx)) + '</b> trong tệp đính kèm.</div>', attachments:[tepX[mx]] });
    ketQua.email += ds.length;
  });
  try { var shLog = ss_().getSheetByName('NhatKyThaoTac'); if (shLog) shLog.appendRow([new Date(),'HE_THONG','Gửi báo cáo tháng','Kỳ ' + ky + ' — ' + ketQua.tep.length + ' tệp, ' + ketQua.email + ' email','','']); } catch (e) {}
  return ketQua;
}

/* ===== Hàm chạy tay (chủ sở hữu) ===== */
/* Chạy 1 lần: tạo sheet người nhận báo cáo. Điền email vào cột Email; cột NhanBaoCao ghi
   TOAN_NHA_MAY (báo cáo cả nhà máy), mã xưởng (vd. SON) để nhận báo cáo xưởng đó, hoặc TAT_CA. */
function TAO_SHEET_NGUOI_NHAN_BAO_CAO() {
  if (!noiBo_(arguments[0])) return chanWeb_('TAO_SHEET_NGUOI_NHAN_BAO_CAO');
  var ss = ss_(), sh = ss.getSheetByName(BC_SHEET_NHAN);
  if (!sh) {
    sh = ss.insertSheet(BC_SHEET_NHAN);
    sh.appendRow(['Email', 'NhanBaoCao', 'GhiChu']);
    sh.appendRow([BC_EMAIL_MAU, 'TOAN_NHA_MAY', 'Thay bằng email thật. Xóa dòng mẫu này nếu không dùng.']);
    sh.setFrozenRows(1);
  }
  Logger.log('Sheet ' + BC_SHEET_NHAN + ' đã sẵn sàng. Mã xưởng dùng được: ' + doc_('PhongBan').map(function(p){ return p.MaXuong + ' (' + p.TenXuong + ')'; }).join(', '));
}
/* Chạy tay: tạo + gửi báo cáo của THÁNG TRƯỚC ngay bây giờ (dùng để thử hoặc gửi bù). */
function GUI_BAO_CAO_THANG_TRUOC() {
  if (!noiBo_(arguments[0])) return chanWeb_('GUI_BAO_CAO_THANG_TRUOC');
  var r = guiBaoCaoThang_(kyTruoc_(kyVN_()));
  Logger.log('Đã tạo ' + r.tep.length + ' tệp trong Drive và gửi ' + r.email + ' email cho kỳ ' + r.ky + '.');
}

/* ================== CƠM TRƯA (11/10) ==================
   Bếp (vai trò BEP) hoặc ban điều hành báo THỰC ĐƠN cho một ngày (thường 14–15h hôm trước).
   Mọi tài khoản tự đăng ký "Ăn" / "Không ăn". Hai mốc, đều tính theo NGÀY HÔM TRƯỚC ngày ăn (bữa thứ Hai -> Chủ nhật), chủ dự án 12/10:
   - 16:00 (Script Property COM_GIO_CHOT): HẠN ĐĂNG KÝ – bếp chốt số suất, đặt đồ ăn; tổng hợp ghi rõ ai đăng ký / đổi sau giờ này.
   - 22:00 (Script Property COM_GIO_KHOA): HẠN THAY ĐỔI (trường hợp cá biệt) – quá giờ thì KHÔNG đăng ký / đổi / báo suất / đăng ký hộ được nữa.
   Ban điều hành (+ trợ lý BĐH) xem tổng hợp số suất theo xưởng kèm họ tên, mã NV; bếp, nhân sự chỉ xem SỐ suất; trưởng / phó phòng xem số của mọi xưởng
   và danh sách tên của xưởng mình.
   Sang tháng mới (cùng lúc chốt KPI tháng): số suất theo xưởng ghi vào sheet SuatAnThang (đưa vào báo cáo tháng),
   danh sách chi tiết lưu thành 1 file bảng tính trên Google Drive (thư mục báo cáo tháng) rồi mới xóa khỏi sheet.
   Sheet tự tạo khi dùng lần đầu: ThucDon, DangKyCom, SuatAnThang. */
var COM_SHEET = {
  ThucDon: ['Ngay', 'MonAn', 'GhiChu', 'NguoiNhap', 'CapNhat', 'MonDoi'],   // MonDoi: JSON [{m: món có thể bớt / đổi, t: món thay (trống = chỉ bớt)}]
  DangKyCom: ['Ngay', 'TenDangNhap', 'HoTen', 'MaNV', 'MaXuong', 'An', 'ThoiDiem', 'DangKyHo', 'SoSuat', 'SoSuatNoiKhac', 'BoMon'],   // BoMon: JSON {món: 'b' bớt | 'd' đổi} (nhóm: {món: [bớt, đổi]}); DangKyHo: tên người đăng ký hộ (trống = tự đăng ký); SoSuat: số suất tài khoản NHÓM báo
  SuatAnThang: ['Ky', 'MaXuong', 'TenXuong', 'SoNgay', 'SuatAn', 'KhongAn', 'ChuaDangKy', 'TepLuu']
};
var COM_VP = 'VP';                       // nhóm Ban điều hành + trưởng phòng + tài khoản không gắn xưởng
var COM_TEN_VP = 'Ban điều hành và trưởng bộ phận';
/* Chủ dự án 11/10: chỉ trưởng phòng ăn cùng ban điều hành -> suất tính vào nhóm VP, không tính theo xưởng. Phó phòng, trưởng 4 bộ phận ngoài sản xuất (TBP) vẫn tính theo xưởng / bộ phận. */
function comMx_(vaiTro, maXuong) { var v = String(vaiTro || '').trim(); return v === 'TP' ? COM_VP : (String(maXuong || '').trim() || COM_VP); }
/* Nhóm ngoài xưởng sản xuất (chủ dự án 11/10, thay 4 bộ phận cũ): mỗi nhóm 1 tài khoản vai trò NHOM, mỗi ngày có thực đơn
   nhóm báo TỔNG SỐ SUẤT (chưa có danh sách nhân sự). KHÔNG nằm trong sheet PhongBan nên không vào KPI. Giữ đúng mã như va-com.js. */
var COM_BO_PHAN = {
  HNAM_BEP: 'Bếp + lái xe + bảo vệ (Hà Nam)',
  HNAM_KTK: 'Kế toán kho + tạp vụ (Hà Nam)',
  HNOI_MAY: 'May + kế toán kho + lái xe (Hà Nội)',
  HNOI_MKT: 'Marketing (Hà Nội)',
  HNOI_STORE: 'Store 47 Nguyễn Tuân (Hà Nội)',
  HNOI_HCKT: 'Hành chính – kế toán (Hà Nội)'
};
var COM_MAX_SUAT = 300;
function comHaNoi_(mx) { return /^HNOI_/.test(String(mx || '')); }   // nhóm ăn ở Hà Nội
function comNoiTen_(haNoi) { return haNoi ? 'Hà Nội' : 'Hà Nam'; }
/* Nhóm báo cơm (chủ dự án 12/10): SoSuat = TỔNG suất của nhóm; SoSuatNoiKhac = số suất trong đó ăn ở nơi kia (người Hà Nội xuống Hà Nam có việc, hoặc ngược lại) */
function comKhac_(r) { return Math.max(0, Math.min(Number(r.SoSuat) || 0, Number(r.SoSuatNoiKhac) || 0)); }
/* ===== Bớt / đổi món (chủ dự án 13/10): bếp đánh dấu tối đa 3 món "có thể bớt / đổi" (+ món thay, không bắt buộc);
   người đã đăng ký ĂN chọn từng món: ăn bình thường / không ăn (bớt) / đổi sang món thay. Trưởng phòng sửa hộ được.
   Nhóm báo tổng: số suất bớt + số suất đổi của từng món. Tổng hợp cộng theo xưởng để bếp biết nấu bao nhiêu suất mỗi món. */
var COM_MAX_MON_DOI = 3;
function comJson_(v, macDinh) { try { var x = JSON.parse(String(v || '')); return x && typeof x === 'object' ? x : macDinh; } catch (e) { return macDinh; } }
function comMonDoi_(r) {   // danh sách món bớt / đổi của 1 dòng ThucDon
  return (comJson_(r && r.MonDoi, []) || []).filter(function(x) { return x && String(x.m || '').trim(); })
    .map(function(x) { return { m: String(x.m).trim().slice(0, 60), t: String(x.t || '').trim().slice(0, 60) }; }).slice(0, COM_MAX_MON_DOI);
}
/* Chuẩn hóa lựa chọn của 1 người theo thực đơn ngày đó: chỉ giữ món còn trong danh sách; chọn "đổi" mà món không có món thay -> bớt */
function comBoNguoi_(bo, ds) {
  var o = {}; bo = bo && typeof bo === 'object' ? bo : {};
  ds.forEach(function(x) { var v = bo[x.m]; if (v === 'b' || v === 'd') o[x.m] = (v === 'd' && !x.t) ? 'b' : v; });
  return o;
}
/* Nhóm: {món: [bớt, đổi, bớt ở nơi kia, đổi ở nơi kia]} – số nguyên >= 0; 2 số đầu là suất ăn ở nơi làm việc của nhóm (<= so − khac),
   2 số sau là suất ăn ở nơi kia (<= khac; chủ dự án 13/10: bếp phải biết suất đổi món ở Hà Nội hay Hà Nam). Không có nơi kia thì chỉ ghi [bớt, đổi]. null nếu sai */
function comBoNhom_(bo, ds, so, khac) {
  var o = {}, sai = false, k = Math.max(0, Math.min(so, Number(khac) || 0)), nha = so - k; bo = bo && typeof bo === 'object' ? bo : {};
  var so_ = function(v) { var n = Number(v) || 0; if (n < 0 || n !== Math.floor(n)) sai = true; return n; };
  ds.forEach(function(x) {
    var v = bo[x.m]; if (!v) return;
    var b = so_(v[0]), d = x.t ? so_(v[1]) : 0, bk = k ? so_(v[2]) : 0, dk = k && x.t ? so_(v[3]) : 0;   // không có suất ở nơi kia: bỏ qua 2 số sau
    if (b + d > nha || bk + dk > k) { sai = true; return; }
    if (bk || dk) o[x.m] = [b, d, bk, dk]; else if (b || d) o[x.m] = [b, d];
  });
  return sai ? null : o;
}
function comLaNhom_(t) { return String(t.VaiTro || t.vaiTro || '').trim() === 'NHOM'; }
function comLaTruong_(me) { return !!me && (me.vaiTro === 'TP' || me.vaiTro === 'TBP') && !!me.xuong; }   // trưởng xưởng / trưởng bộ phận

function comSheet_(ten) {
  var ss = ss_(), sh = ss.getSheetByName(ten);
  if (!sh || sh.getLastColumn() === 0) {          // chưa có, hoặc có nhưng trống trơn (chưa có dòng tiêu đề) -> ghi tiêu đề
    if (!sh) sh = ss.insertSheet(ten);
    sh.getRange(1, 1, 1, COM_SHEET[ten].length).setValues([COM_SHEET[ten]]).setFontWeight('bold');
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1000, 1).setNumberFormat('@');          // ngày / kỳ lưu dạng văn bản 'yyyy-MM-dd'
    delete __DOC_CACHE[ten]; delete __HEAD_CACHE[ten];
  } else {
    // sheet tạo từ bản cũ: thêm cột mới còn thiếu vào cuối dòng tiêu đề
    var head = dauCot_(ten).map(String), thieu = COM_SHEET[ten].filter(function(h) { return head.indexOf(h) < 0; });
    if (thieu.length) {
      sh.getRange(1, head.length + 1, 1, thieu.length).setValues([thieu]).setFontWeight('bold');
      delete __DOC_CACHE[ten]; delete __HEAD_CACHE[ten];
    }
  }
  return sh;
}
function comDoc_(ten) { comSheet_(ten); return doc_(ten); }
function comNgay_(v) { return v instanceof Date ? Utilities.formatDate(v, TZ_VN, 'yyyy-MM-dd') : String(v || '').replace(/^'/, '').slice(0, 10); }
function comGioProp_(ten, macDinh) {
  var v = PropertiesService.getScriptProperties().getProperty(ten), g = Number(v);
  return v !== null && String(v).trim() !== '' && g >= 1 && g < 24 && g === Math.floor(g) ? g : macDinh;
}
function comGioChot_() { return comGioProp_('COM_GIO_CHOT', 16); }                          // hạn đăng ký (bếp chốt số, đặt đồ)
function comGioKhoa_() { return Math.max(comGioChot_(), comGioProp_('COM_GIO_KHOA', 22)); }  // hạn thay đổi, quá giờ là khóa
/* Các mốc của ngày ăn `ngay` – giờ của NGÀY HÔM TRƯỚC, dạng 'yyyy-MM-dd HH:mm' (thứ Hai -> Chủ nhật) */
function comHan_(ngay) { return congNgay_(ngay, -1) + ' ' + ('0' + comGioChot_()).slice(-2) + ':00'; }
function comKhoa_(ngay) { return congNgay_(ngay, -1) + ' ' + ('0' + comGioKhoa_()).slice(-2) + ':00'; }
function comBayGio_() { return Utilities.formatDate(new Date(), TZ_VN, 'yyyy-MM-dd HH:mm'); }
function comConHan_(ngay) { return comBayGio_() < comHan_(ngay); }   // còn trước hạn đăng ký 16:00
function comConMo_(ngay) { return comBayGio_() < comKhoa_(ngay); }   // còn trước giờ khóa 22:00
function comMoc_(h) { return h.slice(11) + ' ngày ' + h.slice(8, 10) + '/' + h.slice(5, 7); }
function comKhoaMsg_(ngay) {
  var h = comKhoa_(ngay);
  return 'Đã chốt đăng ký cơm trưa ' + ngay.slice(8) + '/' + ngay.slice(5, 7) + ' lúc ' + h.slice(11) + ' ngày ' + h.slice(8, 10) + '/' + h.slice(5, 7) + ' – không đổi được nữa. Có việc gấp thì báo trực tiếp với bếp.';
}
function comThoi_(v) { return v instanceof Date ? Utilities.formatDate(v, TZ_VN, 'yyyy-MM-dd HH:mm') : String(v || '').replace(/^'/, '').slice(0, 16); }
function comXem_(me) { return ['ADMIN', 'HR', 'BEP', 'TP', 'TL', 'TBP', 'NHOM'].indexOf(me.vaiTro) >= 0; }   // NHOM: xem số suất toàn công ty như bếp (chủ dự án 11/10)
function comSua_(me) { return me.vaiTro === 'ADMIN' || me.vaiTro === 'BEP' || me.vaiTro === 'TL' || me.vaiTro === 'HR'; }   // TL = trợ lý ban điều hành

/* Tài khoản bếp: chỉ phục vụ cơm nước – không đăng ký suất, không tính vào số người */
function comLaBep_(t) { return String(t.VaiTro || t.vaiTro || '').trim() === 'BEP'; }
/* Chủ dự án 11/10: tài khoản Nhân sự (HR) và Kiểm soát chất lượng (QC) KHÔNG tính suất cơm (không đăng ký, không vào tổng hợp) */
function comKhongTinh_(t) { var v = String(t.VaiTro || t.vaiTroGoc || t.vaiTro || '').trim(); return v === 'HR' || v === 'QC'; }
function comTkBep_() { var m = {}; doc_('TaiKhoan').forEach(function(t) { if (comLaBep_(t) || comKhongTinh_(t)) m[String(t.TenDangNhap).toLowerCase()] = 1; }); return m; }

/* Người cần đăng ký: tài khoản đang dùng (bỏ tài khoản có hồ sơ đã nghỉ việc và tài khoản bếp) */
function comNguoi_() {
  var nghi = {};
  docAnToan_('NhanSu').forEach(function(n) { if (String(n.TrangThai).trim() === 'Nghỉ việc') nghi[String(n.MaNV).trim()] = 1; });
  return doc_('TaiKhoan').filter(function(t) {
    return String(t.TrangThai).trim() === 'Đang dùng' && !comLaBep_(t) && !comLaNhom_(t) && !comKhongTinh_(t) && !(t.MaNV && nghi[String(t.MaNV).trim()]);
  }).map(function(t) {
    return { tk: String(t.TenDangNhap).toLowerCase(), ten: t.HoTen, ma: String(t.MaNV || '').trim(), mx: comMx_(t.VaiTro, t.MaXuong), xg: String(t.MaXuong || '').trim() };
  });
}
function comTenX_() {
  var m = {}; for (var k in COM_BO_PHAN) m[k] = COM_BO_PHAN[k]; docAnToan_('PhongBan').forEach(function(p) { m[p.MaXuong] = p.TenXuong; }); m[COM_VP] = COM_TEN_VP; return m;
}

/* Tổng hợp một ngày: { ngay, xuong:[{mx, ten, an, khong, chua, dsAn, dsKhong, dsChua}], an, khong, chua } */
/* Người đang nghỉ dài hạn (thai sản, ốm dài… – trưởng phòng ghi ở sheet NghiDaiHan) trong ngày `ngay`: MaNV -> loại nghỉ.
   Chủ dự án 12/10: chưa đăng ký thì tự tính KHÔNG ĂN; ai tự đăng ký (hoặc được đăng ký hộ) thì theo lượt đăng ký đó. */
function comNghiDai_(ngay) {
  var m = {};
  docAnToan_('NghiDaiHan').forEach(function(r) { if (ngayVN_(r.TuNgay) <= ngay && ngay <= ngayVN_(r.DenNgay)) m[String(r.MaNV).trim()] = String(r.Loai || 'Nghỉ dài hạn'); });
  return m;
}
function comTongHop_(ngay, me) {
  var nguoi = comNguoi_(), tenX = comTenX_(), dk = {}, bep = comTkBep_();
  comDoc_('DangKyCom').forEach(function(r) { if (comNgay_(r.Ngay) === ngay && !bep[String(r.TenDangNhap).toLowerCase()]) dk[String(r.TenDangNhap).toLowerCase()] = r; });
  var X = {}, ctKhong = [], muon = [], han = comHan_(ngay), nhomTk = {}, nhomChua = 0, nd = comNghiDai_(ngay);
  var mdDs = comMonDoi_(comDoc_('ThucDon').filter(function(r) { return comNgay_(r.Ngay) === ngay; })[0]);
  // bớt / đổi món: x.mon[món] = {b, d}; x.dsMon = [{ten, m, k}] (tên chỉ giữ cho người được xem tên)
  var congMon = function(x, r, ten) {
    if (!mdDs.length || !r) return;
    var bo = comJson_(r.BoMon, {}), laNhom = String(r.SoSuat === undefined ? '' : r.SoSuat).trim() !== '';
    var o = laNhom ? (comBoNhom_(bo, mdDs, Math.max(0, Number(r.SoSuat) || 0), comKhac_(r)) || {}) : comBoNguoi_(bo, mdDs);
    x.mon = x.mon || {}; x.dsMon = x.dsMon || [];
    mdDs.forEach(function(md) {
      var v = o[md.m]; if (!v) return;
      var c = x.mon[md.m] || (x.mon[md.m] = { b: 0, d: 0 });   // b, d: suất ở nơi của xưởng / nhóm; bk, dk: suất nhóm ăn ở nơi kia
      if (laNhom) { c.b += v[0]; c.d += v[1]; if (v[2] || v[3]) { c.bk = (c.bk || 0) + (v[2] || 0); c.dk = (c.dk || 0) + (v[3] || 0); } } else { c[v]++; x.dsMon.push({ ten: ten, m: md.m, k: v }); }
    });
  };
  var ghiMuon = function(r, ten, ma, mx, tenXg) {
    if (!r || comThoi_(r.ThoiDiem) < han) return;
    var nh = String(r.SoSuat === undefined ? '' : r.SoSuat).trim() !== '';
    muon.push({ ten: ten, ma: ma, mx: mx, xuong: tenXg, an: nh ? Math.max(0, Number(r.SoSuat) || 0) : (Number(r.An) === 1 ? 1 : 0), nhom: nh, luc: comThoi_(r.ThoiDiem) });
  };
  nguoi.forEach(function(p) {
    var x = X[p.mx] || (X[p.mx] = { mx: p.mx, ten: tenX[p.mx] || p.mx, an: 0, khong: 0, chua: 0, dsAn: [], dsKhong: [], dsChua: [] });
    var r = dk[p.tk];
    ghiMuon(r, p.ten, p.ma, p.mx, x.ten);
    if (!r && p.ma && nd[p.ma]) { x.khong++; x.dsKhong.push(p.ten); ctKhong.push({ ten: p.ten, ma: p.ma, mx: p.mx, xuong: x.ten, nghi: nd[p.ma] }); }   // nghỉ dài hạn: tự không ăn
    else if (!r) { x.chua++; x.dsChua.push(p.ten); }
    else if (Number(r.An) === 1) { x.an++; x.dsAn.push(p.ten); congMon(x, r, p.ten); }
    else { x.khong++; x.dsKhong.push(p.ten); ctKhong.push({ ten: p.ten, ma: p.ma, mx: p.mx, xuong: x.ten }); }
  });
  // tài khoản NHÓM: 1 dòng / nhóm, số suất = số nhóm báo (chưa báo -> ghi nhận để nhắc)
  doc_('TaiKhoan').forEach(function(t) {
    if (!comLaNhom_(t) || String(t.TrangThai).trim() !== 'Đang dùng') return;
    var tk = String(t.TenDangNhap).toLowerCase(), mx = String(t.MaXuong || '').trim() || tk, r = dk[tk];
    nhomTk[tk] = 1;
    var x = X[mx] || (X[mx] = { mx: mx, ten: tenX[mx] || t.HoTen || mx, an: 0, khong: 0, chua: 0, dsAn: [], dsKhong: [], dsChua: [], nhom: true, baoChua: 0, noiKhac: 0 });
    x.nhom = true;
    if (r) { x.an += Math.max(0, Number(r.SoSuat) || 0); x.noiKhac = (x.noiKhac || 0) + comKhac_(r); ghiMuon(r, x.ten, '', mx, x.ten); congMon(x, r, x.ten); }
    else { x.baoChua++; nhomChua++; }
  });
  // người đã đăng ký nhưng tài khoản nay không còn trong danh sách vẫn được tính suất
  Object.keys(dk).forEach(function(k) {
    if (nhomTk[k] || nguoi.some(function(p) { return p.tk === k; })) return;
    var r = dk[k], mx = String(r.MaXuong || '') || COM_VP;
    var x = X[mx] || (X[mx] = { mx: mx, ten: tenX[mx] || mx, an: 0, khong: 0, chua: 0, dsAn: [], dsKhong: [], dsChua: [] });
    if (String(r.SoSuat === undefined ? '' : r.SoSuat).trim() !== '') { x.an += Math.max(0, Number(r.SoSuat) || 0); x.nhom = true; return; }   // nhóm đã xóa tài khoản
    if (Number(r.An) === 1) { x.an++; x.dsAn.push(r.HoTen); congMon(x, r, r.HoTen); } else { x.khong++; x.dsKhong.push(r.HoTen); ctKhong.push({ ten: r.HoTen, ma: String(r.MaNV || ''), mx: mx, xuong: x.ten }); }
  });
  var ds = Object.keys(X).map(function(k) { return X[k]; }).sort(function(a, b) {
    return (a.mx === COM_VP) - (b.mx === COM_VP) || (!!a.nhom) - (!!b.nhom) || String(a.ten).localeCompare(String(b.ten));
  });
  // họ tên / mã NV: ban điều hành, trợ lý BĐH, nhân sự xem cả nhà máy; trưởng phòng xưởng mình; bếp chỉ thấy SỐ suất (chủ dự án 11/10)
  var tenOk = me && (me.vaiTro === 'ADMIN' || me.vaiTro === 'TL' || me.vaiTro === 'HR');
  ds.forEach(function(x) {
    if (!(tenOk || (comLaTruong_(me) && x.mx === me.xuong))) { delete x.dsAn; delete x.dsKhong; delete x.dsChua; delete x.dsMon; }
  });
  var tong = function(k) { return ds.reduce(function(s, x) { return s + x[k]; }, 0); };
  // danh sách người KHÔNG ĂN đủ họ tên, mã NV, xưởng: ban điều hành / nhân sự / bếp thấy cả nhà máy, trưởng phòng thấy xưởng mình
  var choXem = function(c) { return tenOk || (comLaTruong_(me) && c.mx === me.xuong); };
  ctKhong = ctKhong.filter(choXem).sort(function(a, b) { return String(a.xuong).localeCompare(String(b.xuong)) || String(a.ten).localeCompare(String(b.ten)); });
  var muonAn = muon.reduce(function(s, m) { return s + (m.nhom ? m.an : (m.an ? 1 : 0)); }, 0);
  // chủ dự án 11/10: tổng suất theo nơi ăn – Hà Nội = các nhóm mã HNOI_*, còn lại (xưởng sản xuất, ban điều hành, nhóm Hà Nam) = Hà Nam
  // nhóm báo cơm có thể có suất ăn ở nơi kia (SoSuatNoiKhac) -> cộng vào đúng nơi ăn, ghi lại để bếp biết vì sao số thay đổi
  var noi = { haNam: 0, haNoi: 0 }, sang = [];
  ds.forEach(function(x) {
    var hn = comHaNoi_(x.mx), k = x.noiKhac || 0;
    noi[hn ? 'haNoi' : 'haNam'] += x.an - k; noi[hn ? 'haNam' : 'haNoi'] += k;
    if (k) { x.noiKhacTen = comNoiTen_(!hn); sang.push({ ten: x.ten, so: k, tu: comNoiTen_(hn), den: comNoiTen_(!hn) }); }
  });
  // bếp: mỗi món bớt / đổi nấu bao nhiêu suất (= tổng suất ăn − bớt − đổi), món thay bao nhiêu suất
  // 13/10: tách theo nơi ăn (noi.haNam / noi.haNoi: b, d, nau) – cùng thực đơn nhưng mỗi nơi nấu riêng
  var tongAn = tong('an'), monDoi = mdDs.map(function(md) {
    var b = 0, d = 0, n = { haNam: { b: 0, d: 0 }, haNoi: { b: 0, d: 0 } };
    ds.forEach(function(x) {
      var c = x.mon && x.mon[md.m]; if (!c) return;
      var hn = comHaNoi_(x.mx), nha = n[hn ? 'haNoi' : 'haNam'], kia = n[hn ? 'haNam' : 'haNoi'];
      nha.b += c.b; nha.d += c.d; kia.b += c.bk || 0; kia.d += c.dk || 0;
      b += c.b + (c.bk || 0); d += c.d + (c.dk || 0);
    });
    n.haNam.nau = Math.max(0, noi.haNam - n.haNam.b - n.haNam.d); n.haNoi.nau = Math.max(0, noi.haNoi - n.haNoi.b - n.haNoi.d);
    return { m: md.m, t: md.t, b: b, d: d, nau: Math.max(0, tongAn - b - d), noi: n };
  });
  return { ngay: ngay, monDoi: monDoi, xuong: ds, an: tongAn, khong: tong('khong'), chua: tong('chua'), nhomChua: nhomChua, haNam: noi.haNam, haNoi: noi.haNoi, sangNoiKhac: sang, dsKhongCT: ctKhong,
    muon: muon.length, muonAn: muonAn, dsMuon: muon.filter(function(m) { return m.nhom || choXem(m); }).sort(function(a, b) { return a.luc < b.luc ? -1 : 1; }) };
}

/* Dữ liệu cho thanh thực đơn + trang Cơm trưa */
function napComTrua(token) {
  try {
    var me = docPhien_(token);
    if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
    var homNay = homNayVN_(), den = congNgay_(homNay, 14);
    var td = comDoc_('ThucDon').map(function(r) {
      var ng = comNgay_(r.Ngay);
      return { ngay: ng, mon: String(r.MonAn || ''), monDoi: comMonDoi_(r), ghiChu: String(r.GhiChu || ''), han: comHan_(ng), conHan: comConHan_(ng), khoa: comKhoa_(ng), mo: comConMo_(ng), nguoi: String(r.NguoiNhap || '') };
    }).filter(function(t) { return t.ngay >= congNgay_(homNay, -7) && t.ngay <= den; }).sort(function(a, b) { return a.ngay < b.ngay ? -1 : 1; });
    var cuaToi = {}, cuaToiHo = {}, cuaToiKhac = {}, cuaToiBo = {}, tk = String(me.tk).toLowerCase(), ky = homNay.slice(0, 7), laNhom = comLaNhom_(me);
    var thang = { an: 0, khong: 0 };
    comDoc_('DangKyCom').forEach(function(r) {
      if (String(r.TenDangNhap).toLowerCase() !== tk) return;
      var ng = comNgay_(r.Ngay), an = Number(r.An) === 1 ? 1 : 0;
      cuaToiBo[ng] = an ? comJson_(r.BoMon, {}) : {};
      if (laNhom) { var so = Math.max(0, Number(r.SoSuat) || 0); cuaToi[ng] = so; cuaToiKhac[ng] = comKhac_(r); if (ng.slice(0, 7) === ky) thang.an += so; return; }   // nhóm: cuaToi = số suất đã báo
      cuaToi[ng] = an; if (r.DangKyHo) cuaToiHo[ng] = String(r.DangKyHo); else delete cuaToiHo[ng];
      if (ng.slice(0, 7) === ky) thang[an ? 'an' : 'khong']++;
    });
    var out = { ok: true, homNay: homNay, bayGio: comBayGio_(), gioChot: comGioChot_(), gioKhoa: comGioKhoa_(), thucDon: td, cuaToi: cuaToi, cuaToiHo: cuaToiHo, cuaToiKhac: cuaToiKhac, cuaToiBo: cuaToiBo, noiNha: comNoiTen_(comHaNoi_(me.xuong)), noiKia: comNoiTen_(!comHaNoi_(me.xuong)), thang: thang,
      quyen: { xem: comXem_(me), sua: comSua_(me), dangKy: !comLaBep_(me) && !laNhom && !comKhongTinh_(me), khongTinh: comKhongTinh_(me), nhom: laNhom, maxSuat: COM_MAX_SUAT, ho: ['ADMIN', 'TL', 'HR'].indexOf(me.vaiTro) >= 0 || comLaTruong_(me) }, tongHop: [] };
    if (out.quyen.ho) {
      // danh sách người được đăng ký hộ + trạng thái các ngày có thực đơn sắp tới: hoDK[ngay][tk] = [an, ai đăng ký hộ]
      var tenX = comTenX_(), ngays = {};
      td.forEach(function(t) { if (t.ngay >= homNay) ngays[t.ngay] = {}; });
      out.hoNguoi = comNguoi_().filter(function(p) { return comHoDuoc_(me, p) && p.tk !== tk; })
        .map(function(p) { return { tk: p.tk, ten: p.ten, ma: p.ma, xuong: tenX[p.mx] || p.mx }; })
        .sort(function(a, b) { return String(a.xuong).localeCompare(String(b.xuong)) || String(a.ten).localeCompare(String(b.ten)); });
      comDoc_('DangKyCom').forEach(function(r) { var o = ngays[comNgay_(r.Ngay)]; if (o) o[String(r.TenDangNhap).toLowerCase()] = [Number(r.An) === 1 ? 1 : 0, String(r.DangKyHo || ''), '', Number(r.An) === 1 ? comJson_(r.BoMon, {}) : {}]; });
      var dsNg = comNguoi_();   // người nghỉ dài hạn chưa đăng ký: coi như đã báo không ăn (nút "đăng ký ăn cho tất cả" bỏ qua họ)
      Object.keys(ngays).forEach(function(ng) { var nd = comNghiDai_(ng), o = ngays[ng];
        dsNg.forEach(function(p) { if (p.ma && nd[p.ma] && !o[p.tk]) o[p.tk] = [0, '', nd[p.ma]]; }); });
      out.hoDK = ngays;
    }
    if (out.quyen.xem) {
      // tổng hợp các ngày có thực đơn từ hôm nay trở đi (ngày gần nhất trước)
      out.tongHop = td.filter(function(t) { return t.ngay >= homNay; }).slice(0, 4).map(function(t) { return comTongHop_(t.ngay, me); });
    }
    return sach_(out);
  } catch (e) { return sach_({ ok: false, msg: 'Lỗi tải cơm trưa: ' + e.message }); }
}

/* Xem lại tổng hợp số suất một ngày ĐÃ QUA (chủ dự án 13/10: "phải xem lại được đăng ký cơm ngày thứ 2").
   Dữ liệu còn tới khi chốt tháng (sau đó chuyển vào file lưu tháng trên Drive). */
function xemTongHopCom(token, ngay) {
  try {
    var me = docPhien_(token);
    if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
    if (!comXem_(me)) return sach_({ ok: false, msg: 'Tài khoản của bạn không xem được tổng hợp số suất.' });
    ngay = String(ngay || '').slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(ngay)) return sach_({ ok: false, msg: 'Ngày không hợp lệ.' });
    if (ngay > homNayVN_()) return sach_({ ok: false, msg: 'Ngày này chưa tới – xem ở phần tổng hợp phía trên.' });
    var co = comDoc_('ThucDon').some(function(r) { return comNgay_(r.Ngay) === ngay; }) ||
      comDoc_('DangKyCom').some(function(r) { return comNgay_(r.Ngay) === ngay; });
    if (!co) return sach_({ ok: false, msg: 'Không có dữ liệu cơm trưa ngày ' + ngay.slice(8) + '/' + ngay.slice(5, 7) + ' (ngày không nấu, hoặc tháng đã chốt – xem file "Đăng ký cơm trưa" của tháng đó trên Drive).' });
    return sach_({ ok: true, tongHop: comTongHop_(ngay, me) });
  } catch (e) { return sach_({ ok: false, msg: 'Lỗi tải tổng hợp: ' + e.message }); }
}

function dangKyCom(token, ngay, an, bo) {   // bo: {món: 'b' | 'd'} – không truyền thì giữ lựa chọn bớt / đổi cũ
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (comLaBep_(me)) return sach_({ ok: false, msg: 'Tài khoản bếp chỉ báo thực đơn và xem số suất, không cần đăng ký ăn.' });
  if (comLaNhom_(me)) return sach_({ ok: false, msg: 'Tài khoản nhóm báo tổng số suất, không đăng ký Ăn / Không ăn.' });
  if (comKhongTinh_(me)) return sach_({ ok: false, msg: 'Tài khoản nhân sự / kiểm soát chất lượng không tính suất cơm.' });
  ngay = String(ngay || '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ngay)) return sach_({ ok: false, msg: 'Ngày không hợp lệ.' });
  khoa_();
  var td = comDoc_('ThucDon').filter(function(r) { return comNgay_(r.Ngay) === ngay; })[0];
  if (!td) return sach_({ ok: false, msg: 'Bếp chưa báo thực đơn ngày này.' });
  if (ngay < homNayVN_()) return sach_({ ok: false, msg: 'Ngày ăn đã qua.' });
  if (!comConMo_(ngay)) return sach_({ ok: false, khoa: true, msg: comKhoaMsg_(ngay) });
  var v = an ? 1 : 0, boN = bo === undefined || bo === null ? undefined : comBoNguoi_(bo, comMonDoi_(td));
  comGhi_({ tk: String(me.tk).toLowerCase(), ten: me.ten, ma: me.maNV || '', mx: comMx_(me.vaiTroGoc || me.vaiTro, me.xuong) }, ngay, v, '', undefined, undefined, boN);
  var ng = ngay.slice(8) + '/' + ngay.slice(5, 7);
  return sach_({ ok: true, ngay: ngay, an: v, bo: v ? (boN === undefined ? comBoCua_(me.tk, ngay) : boN) : {},
    msg: v ? (boN !== undefined ? 'Đã cập nhật món ăn trưa ' + ng + (comBoChu_(boN, comMonDoi_(td)) ? ': ' + comBoChu_(boN, comMonDoi_(td)) : ': ăn đủ các món') + '.' : 'Đã đăng ký ăn trưa ' + ng + '.') : 'Đã báo không ăn trưa ' + ng + '.' });
}

function comBoCua_(tk, ngay) {
  var r = comDoc_('DangKyCom').filter(function(x) { return comNgay_(x.Ngay) === ngay && String(x.TenDangNhap).toLowerCase() === String(tk).toLowerCase(); })[0];
  return r ? comJson_(r.BoMon, {}) : {};
}
function comBoChu_(bo, ds) {   // "không ăn Cá kho, đổi Thịt luộc -> Trứng rán"
  return ds.filter(function(x) { return bo[x.m]; }).map(function(x) { return bo[x.m] === 'd' ? 'đổi ' + x.m + ' → ' + x.t : 'không ăn ' + x.m; }).join(', ');
}
/* Ghi 1 lượt đăng ký (tự đăng ký: ho = ''; đăng ký hộ: ho = tên người đăng ký hộ) */
function comGhi_(p, ngay, v, ho, soSuat, khac, bo) {
  var ss = soSuat === undefined || soSuat === null ? '' : soSuat, kh = ss === '' ? '' : (khac || 0);
  var thoi = comBayGio_();
  var cu = comDoc_('DangKyCom').filter(function(r) { return comNgay_(r.Ngay) === ngay && String(r.TenDangNhap).toLowerCase() === p.tk; });
  var boS = !v ? '' : bo === undefined ? (cu.length ? String(cu[0].BoMon || '') : '') : (bo && Object.keys(bo).length ? JSON.stringify(bo) : '');
  if (cu.length) {
    suaO_('DangKyCom', cu[0]._row, 'BoMon', boS);
    suaO_('DangKyCom', cu[0]._row, 'An', v); suaO_('DangKyCom', cu[0]._row, 'ThoiDiem', thoi); suaO_('DangKyCom', cu[0]._row, 'DangKyHo', ho || ''); suaO_('DangKyCom', cu[0]._row, 'SoSuat', ss); suaO_('DangKyCom', cu[0]._row, 'SoSuatNoiKhac', kh);
    if (cu.length > 1) xoaNhieuDong_('DangKyCom', cu.slice(1).map(function(r) { return r._row; }));
  } else {
    them_('DangKyCom', { Ngay: "'" + ngay, TenDangNhap: p.tk, HoTen: p.ten, MaNV: p.ma || '', MaXuong: p.mx || COM_VP, An: v, ThoiDiem: thoi, DangKyHo: ho || '', SoSuat: ss, SoSuatNoiKhac: kh, BoMon: boS });
  }
}

/* Tài khoản NHÓM báo tổng số suất một ngày (sửa được tới giờ khóa 22:00 hôm trước, như mọi người) */
/* so = TỔNG số suất của nhóm; khac = số suất trong đó ăn ở nơi kia (Hà Nội <-> Hà Nam), không bắt buộc */
function baoSuatNhom(token, ngay, so, khac, bo) {   // bo: {món: [số suất bớt, số suất đổi]}
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (!comLaNhom_(me)) return sach_({ ok: false, msg: 'Chỉ tài khoản nhóm mới báo tổng số suất.' });
  ngay = String(ngay || '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ngay)) return sach_({ ok: false, msg: 'Ngày không hợp lệ.' });
  var n = Number(String(so === undefined || so === null ? '' : so).trim());
  if (String(so).trim() === '' || !(n >= 0) || n !== Math.floor(n)) return sach_({ ok: false, msg: 'Nhập số suất là số nguyên từ 0 trở lên.' });
  if (n > COM_MAX_SUAT) return sach_({ ok: false, msg: 'Số suất quá lớn (tối đa ' + COM_MAX_SUAT + ').' });
  var k = Number(String(khac === undefined || khac === null || khac === '' ? 0 : khac).trim());
  if (!(k >= 0) || k !== Math.floor(k) || k > n) return sach_({ ok: false, msg: 'Số suất ăn ở nơi khác không hợp lệ.' });
  khoa_();
  var tdN = comDoc_('ThucDon').filter(function(r) { return comNgay_(r.Ngay) === ngay; })[0];
  if (!tdN) return sach_({ ok: false, msg: 'Bếp chưa báo thực đơn ngày này.' });
  if (ngay < homNayVN_()) return sach_({ ok: false, msg: 'Ngày ăn đã qua.' });
  if (!comConMo_(ngay)) return sach_({ ok: false, khoa: true, msg: comKhoaMsg_(ngay) });
  var boN = bo === undefined || bo === null ? undefined : comBoNhom_(bo, comMonDoi_(tdN), n, k);
  if (boN === null) return sach_({ ok: false, msg: 'Số suất bớt / đổi món không hợp lệ (số nguyên; ở mỗi nơi, không ăn + đổi không quá số suất ăn ở nơi đó).' });
  comGhi_({ tk: String(me.tk).toLowerCase(), ten: me.ten, ma: '', mx: String(me.xuong || '') || COM_VP }, ngay, n > 0 ? 1 : 0, '', n, k, boN);
  var ng = ngay.slice(8) + '/' + ngay.slice(5, 7), hn = comHaNoi_(me.xuong);
  return sach_({ ok: true, ngay: ngay, so: n, khac: k, bo: n ? (boN === undefined ? comBoCua_(me.tk, ngay) : boN) : {}, msg: n ? 'Đã báo ' + n + ' suất cơm trưa ' + ng + (k ? ' (' + (n - k) + ' ở ' + comNoiTen_(hn) + ', ' + k + ' ở ' + comNoiTen_(!hn) + ')' : '') + '.' : 'Đã báo nhóm không ăn trưa ' + ng + ' (0 suất).' });
}

/* Đăng ký hộ (chủ dự án 11/10: người lớn tuổi không quen điện thoại / không có mạng):
   trưởng – phó phòng đăng ký hộ người trong xưởng mình, ban điều hành (+ trợ lý) đăng ký hộ người khối văn phòng. dsTk = 1 hoặc nhiều tên đăng nhập. */
function comHoDuoc_(me, p) {   // chủ dự án 11/10: xưởng nào đăng ký hộ xưởng đó; ban điều hành (+ trợ lý) chỉ đăng ký hộ người nhóm VP (ban điều hành, trưởng phòng, tài khoản không gắn xưởng)
  if (me.vaiTro === 'ADMIN' || me.vaiTro === 'TL' || me.vaiTro === 'HR') return p.mx === COM_VP;
  return comLaTruong_(me) && p.mx === String(me.xuong);
}
function dangKyComHo(token, ngay, dsTk, an, bo) {   // bo: lựa chọn bớt / đổi món (chỉ khi đăng ký hộ 1 người); không truyền thì giữ lựa chọn cũ
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (me.vaiTro !== 'ADMIN' && !comLaTruong_(me) && me.vaiTro !== 'TL' && me.vaiTro !== 'HR') return sach_({ ok: false, msg: 'Chỉ trưởng / phó phòng và ban điều hành được đăng ký hộ.' });
  ngay = String(ngay || '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ngay)) return sach_({ ok: false, msg: 'Ngày không hợp lệ.' });
  khoa_();
  var tdH = comDoc_('ThucDon').filter(function(r) { return comNgay_(r.Ngay) === ngay; })[0];
  if (!tdH) return sach_({ ok: false, msg: 'Bếp chưa báo thực đơn ngày này.' });
  if (ngay < homNayVN_()) return sach_({ ok: false, msg: 'Ngày ăn đã qua.' });
  if (!comConMo_(ngay)) return sach_({ ok: false, khoa: true, msg: comKhoaMsg_(ngay) });
  var muon = {}; [].concat(dsTk || []).forEach(function(t) { muon[String(t).toLowerCase()] = 1; });
  var ds = comNguoi_().filter(function(p) { return muon[p.tk]; });
  if (!ds.length) return sach_({ ok: false, msg: 'Không tìm thấy người cần đăng ký.' });
  if (ds.some(function(p) { return !comHoDuoc_(me, p); })) return sach_({ ok: false, msg: (comLaTruong_(me) ? 'Chỉ đăng ký hộ được người trong xưởng / bộ phận của bạn.' : 'Ban điều hành chỉ đăng ký hộ được người thuộc khối văn phòng / ban điều hành.') });
  var v = an ? 1 : 0, boN = bo === undefined || bo === null || ds.length !== 1 ? undefined : comBoNguoi_(bo, comMonDoi_(tdH));
  ds.forEach(function(p) { comGhi_(p, ngay, v, me.ten, undefined, undefined, boN); });
  var ng = ngay.slice(8) + '/' + ngay.slice(5, 7);
  return sach_({ ok: true, ngay: ngay, an: v, so: ds.length, bo: ds.length === 1 && v ? comBoCua_(ds[0].tk, ngay) : {},
    msg: (ds.length === 1 ? 'Đã đăng ký hộ ' + ds[0].ten : 'Đã đăng ký hộ ' + ds.length + ' người') + (v ? ': ăn trưa ' : ': không ăn ') + ng + '.' });
}

function luuThucDon(token, ngay, monAn, ghiChu, monDoi) {   // monDoi: [{m, t}] món có thể bớt / đổi (tối đa 3)
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (!comSua_(me)) return sach_({ ok: false, msg: 'Chỉ bếp hoặc ban điều hành được nhập thực đơn.' });
  ngay = String(ngay || '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ngay)) return sach_({ ok: false, msg: 'Ngày không hợp lệ.' });
  if (ngay < homNayVN_()) return sach_({ ok: false, msg: 'Không nhập thực đơn cho ngày đã qua.' });
  monAn = String(monAn || '').trim().slice(0, 600); ghiChu = String(ghiChu || '').trim().slice(0, 300);
  if (!monAn) return sach_({ ok: false, msg: 'Nhập ít nhất một món.' });
  var md = comMonDoi_({ MonDoi: JSON.stringify(monDoi || []) }), mdS = md.length ? JSON.stringify(md) : '';
  if ((monDoi || []).filter(function(x) { return x && String(x.m || '').trim(); }).length > COM_MAX_MON_DOI) return sach_({ ok: false, msg: 'Tối đa ' + COM_MAX_MON_DOI + ' món có thể bớt / đổi.' });
  if (md.some(function(x, i) { return md.slice(0, i).some(function(y) { return y.m.toLowerCase() === x.m.toLowerCase(); }); })) return sach_({ ok: false, msg: 'Món có thể bớt / đổi bị trùng tên.' });
  khoa_();
  var cu = comDoc_('ThucDon').filter(function(r) { return comNgay_(r.Ngay) === ngay; })[0], thoi = comBayGio_();
  if (cu) {
    suaO_('ThucDon', cu._row, 'MonAn', monAn); suaO_('ThucDon', cu._row, 'GhiChu', ghiChu);
    suaO_('ThucDon', cu._row, 'NguoiNhap', me.ten); suaO_('ThucDon', cu._row, 'CapNhat', thoi); suaO_('ThucDon', cu._row, 'MonDoi', mdS);
  } else them_('ThucDon', { Ngay: "'" + ngay, MonAn: monAn, GhiChu: ghiChu, NguoiNhap: me.ten, CapNhat: thoi, MonDoi: mdS });
  ghiLog_(me, 'Thực đơn cơm trưa', ngay, '', monAn);
  return sach_({ ok: true, msg: 'Đã lưu thực đơn ngày ' + ngay.slice(8) + '/' + ngay.slice(5, 7) + (comConMo_(ngay) ? '. Hạn đăng ký: ' + comMoc_(comHan_(ngay)) + ', được thay đổi tới ' + comMoc_(comKhoa_(ngay)) + '.' : '. Lưu ý: đã quá giờ chốt (' + comMoc_(comKhoa_(ngay)) + ') nên mọi người KHÔNG đăng ký được bữa này nữa.') });
}

function xoaThucDon(token, ngay) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (!comSua_(me)) return sach_({ ok: false, msg: 'Chỉ bếp hoặc ban điều hành được xóa thực đơn.' });
  ngay = String(ngay || '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ngay)) return sach_({ ok: false, msg: 'Ngày không hợp lệ.' });
  if (ngay < homNayVN_()) return sach_({ ok: false, msg: 'Không xóa thực đơn ngày đã qua.' });
  khoa_();
  var td = comDoc_('ThucDon').filter(function(r) { return comNgay_(r.Ngay) === ngay; });
  var dk = comDoc_('DangKyCom').filter(function(r) { return comNgay_(r.Ngay) === ngay; });
  xoaNhieuDong_('ThucDon', td.map(function(r) { return r._row; }));
  xoaNhieuDong_('DangKyCom', dk.map(function(r) { return r._row; }));
  ghiLog_(me, 'Xóa thực đơn cơm trưa', ngay, td.length ? td[0].MonAn : '', dk.length + ' lượt đăng ký bị xóa');
  return sach_({ ok: true, msg: 'Đã xóa thực đơn' + (dk.length ? ' và ' + dk.length + ' lượt đăng ký' : '') + ' ngày ' + ngay.slice(8) + '/' + ngay.slice(5, 7) + '.' });
}

/* Số suất của một tháng theo xưởng (dùng cho báo cáo tháng). Đã tổng kết thì đọc SuatAnThang, chưa thì tính từ DangKyCom. */
function comBaoCao_(ky) {
  var luu = docAnToan_('SuatAnThang').filter(function(r) { return String(r.Ky).replace(/^'/, '') === ky; });
  if (luu.length) return luu.map(function(r) { return { mx: r.MaXuong, ten: r.TenXuong, soNgay: Number(r.SoNgay) || 0, an: Number(r.SuatAn) || 0, khong: Number(r.KhongAn) || 0, chua: Number(r.ChuaDangKy) || 0 }; });
  return comTinhThang_(ky).ds;
}
function comTinhThang_(ky) {
  var ngays = {};
  docAnToan_('ThucDon').forEach(function(r) { var n = comNgay_(r.Ngay); if (n.slice(0, 7) === ky) ngays[n] = 1; });
  var dsNgay = Object.keys(ngays).sort(), X = {}, tenX = comTenX_(), chiTiet = [];
  dsNgay.forEach(function(ng) {
    var th = comTongHop_(ng, { vaiTro: 'ADMIN' }), maTen = {};
    comNguoi_().forEach(function(p) { maTen[p.mx + '|' + p.ten] = p.ma; });
    th.dsKhongCT.forEach(function(c) { maTen[c.mx + '|' + c.ten] = c.ma; });
    th.xuong.forEach(function(x) {
      var ma = function(t) { return maTen[x.mx + '|' + t] || ''; };
      var o = X[x.mx] || (X[x.mx] = { mx: x.mx, ten: tenX[x.mx] || x.mx, soNgay: 0, an: 0, khong: 0, chua: 0 });
      o.soNgay++; o.an += x.an; o.khong += x.khong; o.chua += x.chua;
      x.dsAn.forEach(function(t) {
        var ghi = (x.dsMon || []).filter(function(c) { return c.ten === t; }).map(function(c) { var md = th.monDoi.filter(function(y) { return y.m === c.m; })[0]; return c.k === 'd' ? 'đổi ' + c.m + ' → ' + (md ? md.t : '') : 'không ăn ' + c.m; });
        chiTiet.push([ng, x.ten, t, ma(t), 'Ăn' + (ghi.length ? ' (' + ghi.join(', ') + ')' : '')]); });
      x.dsKhong.forEach(function(t) { chiTiet.push([ng, x.ten, t, ma(t), 'Không ăn']); });
      x.dsChua.forEach(function(t) { chiTiet.push([ng, x.ten, t, ma(t), 'Chưa đăng ký']); });
      if (x.nhom) chiTiet.push([ng, x.ten, '(nhóm báo tổng)', '', x.baoChua ? 'Chưa báo' : x.an + ' suất' + (x.noiKhac ? ' (' + x.noiKhac + ' ăn ở ' + x.noiKhacTen + ')' : '')]);
    });
  });
  return { ngay: dsNgay, ds: Object.keys(X).map(function(k) { return X[k]; }).sort(function(a, b) { return b.an - a.an; }), chiTiet: chiTiet };
}

/* Sang tháng mới: ghi số suất tháng `ky` vào SuatAnThang, lưu chi tiết thành file bảng tính trên Drive, rồi xóa dữ liệu tháng đó.
   Không lưu được file thì KHÔNG xóa. Chạy lại an toàn (đã tổng kết thì bỏ qua). */
function comTongKetThang_(ky) {
  var daCo = docAnToan_('SuatAnThang').some(function(r) { return String(r.Ky).replace(/^'/, '') === ky; });
  var conDK = docAnToan_('DangKyCom').some(function(r) { return comNgay_(r.Ngay).slice(0, 7) === ky; });
  var conTD = docAnToan_('ThucDon').some(function(r) { return comNgay_(r.Ngay).slice(0, 7) === ky; });
  if (daCo && !conDK && !conTD) return { ky: ky, boQua: true };
  var t = comTinhThang_(ky);
  if (!t.ngay.length && !conDK) return { ky: ky, trong: true };
  // 1) lưu chi tiết lên Drive
  var tep = SpreadsheetApp.create('Đăng ký cơm trưa ' + ky);
  var sh1 = tep.getSheets()[0]; sh1.setName('Tổng hợp theo xưởng');
  var bang = [['Xưởng', 'Số ngày có cơm', 'Suất ăn', 'Không ăn', 'Chưa đăng ký', 'Trung bình suất / ngày']].concat(t.ds.map(function(x) {
    return [x.ten, x.soNgay, x.an, x.khong, x.chua, x.soNgay ? Math.round(x.an / x.soNgay * 10) / 10 : 0]; }));
  sh1.getRange(1, 1, bang.length, 6).setValues(bang.map(dongAnToan_)); sh1.getRange(1, 1, 1, 6).setFontWeight('bold'); sh1.setFrozenRows(1);
  var sh2 = tep.insertSheet('Chi tiết từng người');
  var ct = [['Ngày', 'Xưởng', 'Họ tên', 'Mã NV', 'Đăng ký']].concat(t.chiTiet);
  sh2.getRange(1, 1, ct.length, 5).setNumberFormat('@').setValues(ct.map(dongAnToan_)); sh2.getRange(1, 1, 1, 5).setFontWeight('bold'); sh2.setFrozenRows(1);
  var sh3 = tep.insertSheet('Thực đơn');
  var td = [['Ngày', 'Món ăn', 'Ghi chú', 'Người nhập']].concat(docAnToan_('ThucDon').filter(function(r) { return comNgay_(r.Ngay).slice(0, 7) === ky; })
    .map(function(r) { return [comNgay_(r.Ngay), String(r.MonAn || ''), String(r.GhiChu || ''), String(r.NguoiNhap || '')]; }).sort());
  sh3.getRange(1, 1, td.length, 4).setNumberFormat('@').setValues(td.map(dongAnToan_)); sh3.getRange(1, 1, 1, 4).setFontWeight('bold');
  var file = DriveApp.getFileById(tep.getId());
  try { file.moveTo(bcThuMuc_(ky)); } catch (e) { Logger.log('Không chuyển được file vào thư mục báo cáo: ' + e); }
  // 2) số suất vào SuatAnThang (đưa vào báo cáo tháng)
  comSheet_('SuatAnThang');
  var cuS = docAnToan_('SuatAnThang').filter(function(r) { return String(r.Ky).replace(/^'/, '') === ky; });
  xoaNhieuDong_('SuatAnThang', cuS.map(function(r) { return r._row; }));
  themNhieu_('SuatAnThang', t.ds.map(function(x) {
    return { Ky: "'" + ky, MaXuong: x.mx, TenXuong: x.ten, SoNgay: x.soNgay, SuatAn: x.an, KhongAn: x.khong, ChuaDangKy: x.chua, TepLuu: file.getUrl() }; }));
  // 3) xóa dữ liệu tháng cũ (cả các tháng trước đó còn sót)
  var xoa = function(ten) {
    xoaNhieuDong_(ten, docAnToan_(ten).filter(function(r) { return comNgay_(r.Ngay).slice(0, 7) <= ky; }).map(function(r) { return r._row; }));
  };
  xoa('DangKyCom'); xoa('ThucDon');
  try { var shLog = ss_().getSheetByName('NhatKyThaoTac'); if (shLog) shLog.appendRow([new Date(), 'HE_THONG', 'Tổng kết cơm trưa', 'Kỳ ' + ky + ' — ' + t.ds.reduce(function(s, x) { return s + x.an; }, 0) + ' suất, lưu ' + file.getUrl(), '', '']); } catch (e) {}
  return { ky: ky, tep: file.getUrl(), xuong: t.ds.length };
}

/* Chạy tay: tổng kết cơm trưa THÁNG TRƯỚC ngay (lưu Drive + xóa dữ liệu). Bình thường tự chạy khi chốt tháng. */
function TONG_KET_COM_THANG_TRUOC() {
  if (!noiBo_(arguments[0])) return chanWeb_('TONG_KET_COM_THANG_TRUOC');
  var r = comTongKetThang_(kyTruoc_(kyVN_()));
  Logger.log(JSON.stringify(r));
}
/* Chạy tay: đổi hạn đăng ký (mặc định 16) và giờ khóa thay đổi (mặc định 22) – đều tính theo hôm trước ngày ăn. Sửa số trong hàm rồi bấm Chạy. */
function DAT_GIO_CHOT_COM() {
  if (!noiBo_(arguments[0])) return chanWeb_('DAT_GIO_CHOT_COM');
  PropertiesService.getScriptProperties().setProperty('COM_GIO_CHOT', '16');
  PropertiesService.getScriptProperties().setProperty('COM_GIO_KHOA', '22');
  Logger.log('Hạn đăng ký cơm: ' + comGioChot_() + ':00, được thay đổi tới ' + comGioKhoa_() + ':00 hôm trước ngày ăn.');
}

/* Chạy tay khi trang Cơm trưa không tải được: thử từng bước bằng tài khoản chủ sở hữu, ghi lỗi chi tiết vào Nhật ký thực thi */
function KIEM_TRA_COM_TRUA() {
  if (!noiBo_(arguments[0])) return chanWeb_('KIEM_TRA_COM_TRUA');
  var buoc = function(ten, fn) { try { var v = fn(); Logger.log('✓ ' + ten + (v !== undefined ? ': ' + v : '')); return true; } catch (e) { Logger.log('✗ ' + ten + ': ' + e.message + '\n' + (e.stack || '')); return false; } };
  buoc('Sheet ThucDon', function() { return comDoc_('ThucDon').length + ' dòng'; });
  buoc('Sheet DangKyCom', function() { return comDoc_('DangKyCom').length + ' dòng, cột: ' + dauCot_('DangKyCom').join(', '); });
  buoc('Người cần đăng ký', function() { return comNguoi_().length + ' người'; });
  var tk = doc_('TaiKhoan').filter(function(t) { return String(t.VaiTro).trim() === 'OWNER' || String(t.VaiTro).trim() === 'ADMIN'; })[0];
  if (!tk) { Logger.log('✗ Không thấy tài khoản ADMIN/OWNER để thử'); return; }
  buoc('Tổng hợp hôm nay', function() { var t = comTongHop_(homNayVN_(), { vaiTro: 'ADMIN', xuong: '' }); return t.an + ' ăn / ' + t.khong + ' không / ' + t.chua + ' chưa'; });
  buoc('napComTrua (giả lập phiên ' + tk.TenDangNhap + ')', function() {
    var r = napComTrua(taoPhien_(tk));
    return r && r.ok ? 'OK – ' + r.thucDon.length + ' thực đơn' : 'LỖI – ' + (r && r.msg);
  });
}
/* ================== PHẦN GIAO DIỆN TẢI SAU (12/10) ==================
   Tách khỏi Index.html cho trang nhẹ (mọi người, kể cả công nhân trên điện thoại, không phải tải phần mình không dùng).
   Mỗi phần là 1 file HTML riêng trong dự án Apps Script, chỉ gửi về trình duyệt khi cần:
   - SoDo:    tab "Sơ đồ nhà máy" (mặt bằng 2D + bản 3D) – chỉ các vai trò có tab này.
   - HoatAnh: dữ liệu hoạt ảnh Lottie – tải nền sau khi đăng nhập.
   - AmThanh: giọng nói Rhino thu sẵn (18/10) – chỉ tải khi người dùng bật giọng.
   Trình duyệt nhớ bản đã tải (localStorage, theo mã phiên bản) nên lần sau không tải lại. */
var MANH_GD = { SoDo: ['ADMIN', 'TP', 'TL', 'HR'], HoatAnh: null, AmThanh: null, QuyTrinh: ['OWNER', 'ADMIN', 'TP', 'PP'], CauHinhGay: [] };   /* 14/11: + ADMIN – tab Đơn hàng cho ban điều hành */   // CauHinhGay (08/11): kiểm theo mã NV ở cgQuyenCua_   // QuyTrinh (31/10): chủ sở hữu; 03/11 thêm trưởng / phó phòng (máy chủ chỉ trả dữ liệu xưởng mình)
function layManhGiaoDien(token, ten) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (!Object.prototype.hasOwnProperty.call(MANH_GD, ten)) return sach_({ ok: false, msg: 'Không có phần giao diện này.' });
  var vt = MANH_GD[ten];
  if (ten === 'CauHinhGay') { if (!cgQuyenCua_(me)) return sach_({ ok: false, msg: 'Tài khoản không xem được phần này.' }); vt = null; }
  if (vt && vt.indexOf(me.vaiTro) < 0 && vt.indexOf(me.vaiTroGoc) < 0) return sach_({ ok: false, msg: 'Tài khoản không xem được phần này.' });
  // Đọc nội dung thô (không kiểm tra cú pháp HTML – bản 3D rất dài, kiểm tra có thể báo lỗi dù file có thật); không được mới thử cách cũ
  var loi = '';
  try { return sach_({ ok: true, ten: ten, noiDung: HtmlService.createTemplateFromFile(ten).getRawContent() }); } catch (e) { loi = String(e && e.message || e); }
  try { return sach_({ ok: true, ten: ten, noiDung: HtmlService.createHtmlOutputFromFile(ten).getContent() }); } catch (e2) { loi = loi || String(e2 && e2.message || e2); }
  return sach_({ ok: false, msg: 'Không đọc được file ' + ten + ' trong Apps Script. Kiểm tra: tên file đúng "' + ten + '" (Apps Script tự thêm .html), đã Triển khai phiên bản mới sau khi thêm file. Lỗi Google báo: ' + loi });
}

/* ===== GIẢI BÓNG ĐÁ (13/10, chủ dự án: "chỉ một số thông tin để hưởng ứng phong trào, không cần tab riêng") =====
   Đọc thẳng sheet "Web đá bóng 2026" của web giải (cùng chủ sở hữu) – chỉ lấy tên giải, tên đội, lịch + tỉ số.
   KHÔNG đọc các ô khác của sheet CauHinh (có mật khẩu BTC). Nhớ tạm 10 phút để không mở sheet mỗi lần tải trang. */
var BD_SHEET_ID = '1k8zaZhkRM88Oye0zcKvD6q7PHv9KetTvNmY9xCYR6bE';
var BD_LINK = 'https://script.google.com/macros/s/AKfycbyU0HwrkHWv_cBug5SJYhN_Vo2SZd9R5j_RXlGBeAozoTIZmapdraymm7VWCUJz73PCJA/exec';   // đường link web giải (…/exec); để trống thì không hiện nút "Xem lịch & video"

function layBongDa(token) {
  try {
    var me = docPhien_(token);
    if (!me) return sach_({ ok: false, hetHan: true });
    var c = CacheService.getScriptCache(), cu = c.get('bd_v2');
    if (cu) { cu = JSON.parse(cu); cu.link = BD_LINK; return cu; }   // link luôn lấy mới, không theo bản nhớ tạm
    var ss = SpreadsheetApp.openById(BD_SHEET_ID);
    var bang = function(ten) {
      var sh = ss.getSheetByName(ten); if (!sh) return [];
      var v = sh.getDataRange().getDisplayValues(), h = v.shift() || [];
      return v.map(function(r) { var o = {}; h.forEach(function(k, i) { o[k] = String(r[i] == null ? '' : r[i]).trim(); }); return o; });
    };
    var ten = '';
    bang('CauHinh').forEach(function(r) { if (r.Khoa === 'TEN_GIAI') ten = r.GiaTri; });
    var doi = {};
    bang('Doi').forEach(function(r) { if (r.MaDoi) doi[r.MaDoi] = r.TenDoi; });
    var tran = bang('TranDau').map(function(r) {
      var m = /(\d{1,2}):(\d{2})\s+(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(r.GioThiDau || '');
      if (!m) return null;
      var p = function(x) { return ('0' + x).slice(-2); };
      var xong = r.BanThangA !== '' && r.BanThangB !== '';
      return { a: doi[r.MaDoiA] || r.MaDoiA, b: doi[r.MaDoiB] || r.MaDoiB, vong: r.VongDau, gio: m[5] + '-' + p(m[4]) + '-' + p(m[3]) + ' ' + p(m[1]) + ':' + m[2],
        tsA: xong ? Number(r.BanThangA) : null, tsB: xong ? Number(r.BanThangB) : null, xong: xong };
    }).filter(Boolean).sort(function(x, y) { return x.gio < y.gio ? -1 : 1; });
    var out = sach_({ ok: true, ten: ten || 'Giải bóng đá', link: BD_LINK, tran: tran });
    try { c.put('bd_v2', JSON.stringify(out), 600); } catch (e) {}
    return out;
  } catch (e) { return sach_({ ok: false, msg: 'Không đọc được dữ liệu giải bóng đá: ' + e.message }); }
}
/* ================== BỐ TRÍ MÁY TRONG SƠ ĐỒ 3D (13/10) ==================
   Chế độ "✥ Sắp xếp máy" của bản 3D: dời / xoay / nhân đôi / xóa máy. Trước đây chỉ nhớ trong trình duyệt đang dùng;
   nay lưu vào sheet BoTriMay để mọi người mở sơ đồ đều thấy cùng một bố trí.
   - Mỗi lần lưu thêm 1 dòng (dòng cuối = bố trí đang dùng, các dòng trên = lịch sử, muốn quay lại bản cũ thì xóa các dòng sau nó).
   - NoiDung = JSON {d:{'tầng|máy':[x0,y0,x1,y1,xoay,tên]}, n:[máy thêm], x:[máy xóa]} – chỉ ghi phần khác bản vẽ.
   - Xem: mọi vai trò có tab Sơ đồ. Sửa: chỉ ADMIN. */
var BTM_SHEET = 'BoTriMay', BTM_COT = ['ThoiGian', 'NguoiLuu', 'TomTat', 'NoiDung'], BTM_MAX = 45000;
function btmSheet_() {
  var ss = ss_(), sh = ss.getSheetByName(BTM_SHEET);
  if (!sh) {
    sh = ss.insertSheet(BTM_SHEET);
    sh.getRange(1, 1, 1, BTM_COT.length).setValues([BTM_COT]).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}
function btmSuaDuoc_(me) { return !!me && (me.vaiTro === 'ADMIN' || me.vaiTroGoc === 'ADMIN'); }
function layBoTriMay(token) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  var vt = MANH_GD.SoDo;
  if (vt.indexOf(me.vaiTro) < 0 && vt.indexOf(me.vaiTroGoc) < 0) return sach_({ ok: false, msg: 'Tài khoản không xem được sơ đồ.' });
  var sh = ss_().getSheetByName(BTM_SHEET), kq = { ok: true, sua: btmSuaDuoc_(me), data: null, luc: '', nguoi: '' };
  if (sh && sh.getLastRow() > 1) {
    var v = sh.getRange(sh.getLastRow(), 1, 1, 4).getDisplayValues()[0];
    try { kq.data = JSON.parse(v[3]); kq.luc = v[0]; kq.nguoi = v[1]; } catch (e) { kq.data = null; }
  }
  return sach_(kq);
}
function luuBoTriMay(token, json) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (!btmSuaDuoc_(me)) return sach_({ ok: false, msg: 'Chỉ ban điều hành (quản trị) được lưu bố trí máy.' });
  var o; try { o = JSON.parse(String(json || '')); } catch (e) { return sach_({ ok: false, msg: 'Dữ liệu bố trí không đọc được.' }); }
  if (!o || typeof o !== 'object' || Array.isArray(o)) return sach_({ ok: false, msg: 'Dữ liệu bố trí không đúng dạng.' });
  var d = (o.d && typeof o.d === 'object' && !Array.isArray(o.d)) ? o.d : {}, n = Array.isArray(o.n) ? o.n : [], x = Array.isArray(o.x) ? o.x : [];
  var chu = JSON.stringify({ d: d, n: n, x: x });
  if (chu.length > BTM_MAX) return sach_({ ok: false, msg: 'Bố trí quá lớn để lưu (' + chu.length + ' ký tự).' });
  var nd = Object.keys(d).length, tom = [nd && ('dời ' + nd + ' máy'), n.length && ('thêm ' + n.length + ' máy'), x.length && ('xóa ' + x.length + ' máy')].filter(Boolean).join(', ') || 'đúng bản vẽ';
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var sh = btmSheet_(), luc = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm');
    sh.appendRow(["'" + luc, me.ten || me.tk, tom, chu]);
    try { var shLog = ss_().getSheetByName('NhatKyThaoTac'); if (shLog) shLog.appendRow([new Date(), me.tk, 'Lưu bố trí máy 3D', tom, '', '']); } catch (e) {}
    return sach_({ ok: true, luc: luc, nguoi: me.ten || me.tk, tom: tom });
  } finally { lock.releaseLock(); }
}
/* =====================================================================
   NHÂN SỰ THEO BẢNG CHẤM CÔNG (03/11, chủ dự án)
   1) SUA_NHAN_SU_THEO_CHAM_CONG – hàm chạy MỘT LẦN trong trình soạn thảo Apps Script:
      đọc file "KPI - Sửa nhân sự theo chấm công T10" (Drive của chủ dự án, Claude soạn từ ảnh chấm công)
      rồi sửa: DOI_MA (mã tạm -> mã chấm công, đổi ở mọi sheet có cột MaNV / TenDangNhap, giữ mật khẩu),
      TEN (họ tên đúng chấm công), NGAY_VAO (ngày vào làm), THEM (người thiếu + tài khoản công nhân).
      Sau đó chép file "KPI - Bộ phận ngoài sản xuất" vào sheet NhanSuNgoaiSX.
      Chạy lại nhiều lần không sao (dòng đã đúng thì bỏ qua). Không đụng trạng thái, xưởng, chức danh.
   2) NhanSuNgoaiSX: Kho, Bếp + tạp vụ, Ban điều hành, Xưởng May – CHỈ danh sách, sheet riêng nên
      không vào KPI, điểm danh, cơm trưa, lưu đồ 9 xưởng. Chỉ tài khoản chủ sở hữu xem (tab Nhân sự).
   Dữ liệu cá nhân nằm ở 2 file Drive, KHÔNG nằm trong mã nguồn (chỉ có mã file).
   ===================================================================== */
var NS_CC_FILE_SUA = '1MwEdEj5XELPcjEhLd3BZz-3Tcs4rbQR01KD9hFnor3g';    // KPI - Sửa nhân sự theo chấm công T10
var NS_CC_FILE_NGOAI = '1wmavTqA4C_yjR-Zl1RaqaEKuCSeV2aEu__jXeWbrUuw';  // 08/11: KPI - Nhân sự ngoài sản xuất (hồ sơ) – thay file 03/11 (1KAbgfq0QMZNmFeyF7VWFcEwjWM-ADK4sRR8FghUAcgk); thêm Marketing + Kinh doanh
var NS_NGOAI_SHEET = 'NhanSuNgoaiSX', NS_NGOAI_COT = ['BoPhan', 'Nhom', 'MaNV', 'HoTen', 'ChucDanh', 'NgayVaoLam', 'NgayChinhThuc', 'PhepConLai', 'TrangThai', 'GhiChu'];
var NS_DOI_MA_BO = { NhatKyThaoTac: 1 };   // nhật ký thao tác giữ nguyên lịch sử (ghi đúng tên đăng nhập lúc đó)

function nsNgay_(v) {   // ô ngày (Date hoặc 'yyyy-mm-dd' / 'dd/mm/yyyy') -> Date 12:00 giờ VN, sai -> null
  if (Object.prototype.toString.call(v) === '[object Date]') return isNaN(v.getTime()) ? null : new Date(v.getFullYear(), v.getMonth(), v.getDate(), 12);
  var s = String(v == null ? '' : v).trim(), m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/), y, mo, d;
  if (m) { y = +m[1]; mo = +m[2]; d = +m[3]; } else { m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); if (!m) return null; d = +m[1]; mo = +m[2]; y = +m[3]; }
  if (!(mo >= 1 && mo <= 12 && d >= 1 && d <= 31 && y > 2000)) return null;
  return new Date(y, mo - 1, d, 12);
}
function nsDocFile_(id) {   // -> [{Cột: giá trị}] từ trang đầu của file Drive
  var v = SpreadsheetApp.openById(id).getSheets()[0].getDataRange().getValues(), h = v[0].map(function(x) { return String(x).trim(); }), out = [];
  for (var i = 1; i < v.length; i++) { if (v[i].join('') === '') continue; var o = {}; h.forEach(function(k, j) { o[k] = v[i][j]; }); out.push(o); }
  return out;
}
/* Đổi mã ở mọi sheet: cột MaNV (giữ HOA) và TenDangNhap (chữ thường). -> số ô đã đổi */
var NS_MA_RE = /^[A-Z0-9]{2,20}$/;
function nsCoMaO_(ma) {   // mã đã xuất hiện ở bất kỳ sheet nào (cột MaNV / TenDangNhap)? -> tên sheet đầu tiên, không có -> ''
  var maL = String(ma).toLowerCase(), thay = '';
  ss_().getSheets().some(function(sh) {
    if (NS_DOI_MA_BO[sh.getName()]) return false;
    var nr = sh.getLastRow(), nc = sh.getLastColumn(); if (nr < 2 || nc < 1) return false;
    var h = sh.getRange(1, 1, 1, nc).getValues()[0];
    return h.some(function(ten, j) { ten = String(ten).trim(); if (ten !== 'MaNV' && ten !== 'TenDangNhap') return false;
      var v = sh.getRange(2, j + 1, nr - 1, 1).getValues(); for (var i = 0; i < v.length; i++) if (String(v[i][0]).trim().toLowerCase() === maL) { thay = sh.getName(); return true; } return false; });
  });
  return thay;
}
function nsDoiMaMoiSheet_(cu, moi) {
  if (!cu || !NS_MA_RE.test(cu) || !NS_MA_RE.test(moi)) return 0;   // mã trống / lạ: không đổi gì (tránh ghi vào mọi ô trống)
  var n = 0, ss = ss_(), cuL = cu.toLowerCase();
  ss.getSheets().forEach(function(sh) {
    if (NS_DOI_MA_BO[sh.getName()]) return;
    var nr = sh.getLastRow(), nc = sh.getLastColumn(); if (nr < 2 || nc < 1) return;
    var h = sh.getRange(1, 1, 1, nc).getValues()[0];
    h.forEach(function(ten, j) {
      ten = String(ten).trim(); if (ten !== 'MaNV' && ten !== 'TenDangNhap') return;
      var r = sh.getRange(2, j + 1, nr - 1, 1), v = r.getValues(), doi = false;
      for (var i = 0; i < v.length; i++) if (String(v[i][0]).trim().toLowerCase() === cuL) { v[i][0] = ten === 'MaNV' ? moi : moi.toLowerCase(); doi = true; n++; }
      if (doi) r.setValues(v);
    });
  });
  return n;
}
function SUA_NHAN_SU_THEO_CHAM_CONG() {
  if (!noiBo_(arguments[0])) return chanWeb_('SUA_NHAN_SU_THEO_CHAM_CONG');
  if (!noiBo_(arguments[0])) return chanWeb_('SUA_NHAN_SU_THEO_CHAM_CONG');
  khoa_();   // khóa chung với web: không ai lưu chen vào lúc đang đổi mã
  var log = [], loi = [], ds = nsDocFile_(NS_CC_FILE_SUA), he = { tk: 'HE_THONG', ten: 'Sửa theo chấm công T10' };
  var dsDoi = ds.filter(function(x) { return String(x.Loai).trim() === 'DOI_MA'; }), cuSet = {};
  dsDoi.forEach(function(x) { cuSet[String(x.MaCu || '').trim().toUpperCase()] = 1; });
  var noiChuoi = dsDoi.filter(function(x) { return cuSet[String(x.MaMoi || '').trim().toUpperCase()]; });
  if (noiChuoi.length) { Logger.log('DỪNG: mã mới trùng mã cũ của dòng khác (đổi nối chuỗi): ' + noiChuoi.map(function(x) { return x.MaCu + '→' + x.MaMoi; }).join(', ')); return { ok: false, sua: [], loi: ['đổi nối chuỗi'] }; }
  var thu = { DOI_MA: 0, TEN: 1, NGAY_VAO: 2, THEM: 3 };   // đổi mã trước, rồi mới sửa tên / ngày theo mã mới
  var th = function(x) { var k = String(x.Loai).trim(); return thu.hasOwnProperty(k) ? thu[k] : 9; };
  ds = ds.map(function(x, i) { x._i = i; return x; }).sort(function(a, b) { return (th(a) - th(b)) || (a._i - b._i); });   // giữ thứ tự gốc trong cùng loại
  var shNS = ss_().getSheetByName('NhanSu'), hNS = shNS.getRange(1, 1, 1, shNS.getLastColumn()).getValues()[0];
  var cMa = hNS.indexOf('MaNV') + 1, cTen = hNS.indexOf('HoTen') + 1, cVao = hNS.indexOf('NgayVaoLam') + 1;
  var tim = function(ma) { var v = shNS.getRange(2, cMa, Math.max(1, shNS.getLastRow() - 1), 1).getValues(); for (var i = 0; i < v.length; i++) if (String(v[i][0]).trim().toUpperCase() === ma) return i + 2; return 0; };
  var shTK = ss_().getSheetByName('TaiKhoan'), hTK = shTK.getRange(1, 1, 1, shTK.getLastColumn()).getValues()[0];
  var timTK = function(ten, giaTri) { var c = hTK.indexOf(ten) + 1; if (!c) return 0; var v = shTK.getRange(2, c, Math.max(1, shTK.getLastRow() - 1), 1).getValues(); for (var i = 0; i < v.length; i++) if (String(v[i][0]).trim().toLowerCase() === String(giaTri).toLowerCase()) return i + 2; return 0; };
  ds.forEach(function(r) {
    var loai = String(r.Loai || '').trim(), cu = String(r.MaCu || '').trim().toUpperCase(), ma = String(r.MaMoi || '').trim().toUpperCase(), ten = String(chuAnToan_(chuanHoaTen_(r.HoTen)));
    if (!ma) return;
    if (!NS_MA_RE.test(ma) || (loai === 'DOI_MA' && !NS_MA_RE.test(cu))) { loi.push(loai + ': mã không hợp lệ "' + (cu ? cu + '→' : '') + ma + '"'); return; }
    try {
      if (loai === 'DOI_MA') {
        if (tim(ma)) { log.push('Bỏ qua ' + cu + ' → ' + ma + ': mã mới đã có trong NhanSu (có thể đã đổi rồi).'); return; }
        if (!tim(cu)) { loi.push('Không thấy mã cũ ' + cu + ' trong NhanSu.'); return; }
        if (timTK('TenDangNhap', ma.toLowerCase())) { loi.push('Tên đăng nhập ' + ma.toLowerCase() + ' đã có người dùng – chưa đổi ' + cu + '.'); return; }
        var o2 = nsCoMaO_(ma); if (o2) { loi.push('Mã ' + ma + ' đã có ở sheet ' + o2 + ' – chưa đổi ' + cu + ' (tránh gộp lẫn số liệu).'); return; }
        var n = nsDoiMaMoiSheet_(cu, ma); log.push('Đổi mã ' + cu + ' → ' + ma + ' (' + n + ' ô, đăng nhập bằng ' + ma.toLowerCase() + ', mật khẩu giữ nguyên).');
        ghiLog_(he, 'Đổi mã nhân viên', cu + ' → ' + ma, cu, ma);
      } else if (loai === 'TEN') {
        var row = tim(ma); if (!row) { loi.push('TEN: không thấy ' + ma); return; }
        var cuTen = String(shNS.getRange(row, cTen).getValue());
        if (cuTen !== ten) { shNS.getRange(row, cTen).setValue(ten); log.push('Tên ' + ma + ': ' + cuTen + ' → ' + ten); }
        var rt = timTK('MaNV', ma); if (rt && hTK.indexOf('HoTen') >= 0) shTK.getRange(rt, hTK.indexOf('HoTen') + 1).setValue(ten);
      } else if (loai === 'NGAY_VAO') {
        var row2 = tim(ma), d = nsNgay_(r.NgayVaoLam); if (!row2 || !d) { loi.push('NGAY_VAO: ' + (row2 ? 'ngày sai' : 'không thấy') + ' ' + ma); return; }
        var cuD = shNS.getRange(row2, cVao).getValue(), cuS = cuD ? Utilities.formatDate(new Date(cuD), TZ_VN, 'yyyy-MM-dd') : '';
        if (cuS !== Utilities.formatDate(d, TZ_VN, 'yyyy-MM-dd')) { shNS.getRange(row2, cVao).setValue(d); log.push('Ngày vào ' + ma + ': ' + (cuS || 'trống') + ' → ' + Utilities.formatDate(d, TZ_VN, 'dd/MM/yyyy')); }
      } else if (loai === 'THEM') {
        var x = String(r.MaXuong || '').trim(), daCo = !!tim(ma);
        if (!daCo) them_('NhanSu', { MaNV: ma, HoTen: ten, MaXuong: x, ChucDanh: 'Công nhân', BacTayNghe: 1, NgayVaoLam: nsNgay_(r.NgayVaoLam) || '',
          LoaiHopDong: 'Chờ nhân sự bổ sung', TrangThai: 'Đang làm', NguoiTao: he.ten, NgayTao: new Date() });
        var tkMsg = '';   // tài khoản kiểm tra riêng: lần trước thêm nhân sự mà tạo tài khoản lỗi thì lần này tạo bù
        if (!timTK('TenDangNhap', ma.toLowerCase()) && !timTK('MaNV', ma)) {
          var mk = mkTam_();
          them_('TaiKhoan', { TenDangNhap: ma.toLowerCase(), MatKhauMaHoa: '', HoTen: ten, VaiTro: 'CN', MaXuong: x, TrangThai: 'Đang dùng', DoiMatKhauLanDau: 'Có', LanDangNhapCuoi: '', NgayTao: new Date(), MaNV: ma });
          var moiTao = doc_('TaiKhoan').filter(function(t) { return String(t.TenDangNhap).toLowerCase() === ma.toLowerCase(); })[0];
          if (moiTao) datMKTam_(moiTao._row, mk);
          tkMsg = ' Đã tạo tài khoản ' + ma.toLowerCase() + ' – vào web, tab Tài khoản, bấm "Cấp lại mật khẩu" để lấy mật khẩu tạm đưa cho người này (không ghi mật khẩu vào nhật ký).';
        }
        if (daCo && !tkMsg) { log.push('Bỏ qua thêm ' + ma + ': đã có.'); return; }
        log.push((daCo ? 'Tạo bù tài khoản ' : 'Thêm ') + ma + ' ' + ten + ' (' + x + ').' + tkMsg);
        if (!daCo) ghiLog_(he, 'Thêm nhân sự', ma + ' — ' + ten);
      }
    } catch (e) { loi.push(loai + ' ' + ma + ': ' + (e && e.message || e)); }
  });
  try { var nN = nhapNhanSuNgoaiSX_(); log.push('Bộ phận ngoài sản xuất: ' + nN + ' người vào sheet ' + NS_NGOAI_SHEET + '.'); }
  catch (e2) { loi.push('Bộ phận ngoài sản xuất: ' + (e2 && e2.message || e2)); }
  try { xaGhi_ && xaGhi_(); } catch (e3) {}
  xoaCache_(); tangPhienBan_();
  Logger.log('ĐÃ SỬA (' + log.length + '):\n' + log.join('\n') + (loi.length ? '\n\nCẦN XEM (' + loi.length + '):\n' + loi.join('\n') : '\n\nKhông có lỗi.'));
  return { ok: !loi.length, sua: log, loi: loi };
}
/* Chép danh sách bộ phận ngoài sản xuất từ file Drive vào sheet riêng (thay toàn bộ) */
function nhapNhanSuNgoaiSX_() {
  var ds = nsDocFile_(NS_CC_FILE_NGOAI).filter(function(r) { return String(r.MaNV || '').trim() && String(r.HoTen || '').trim(); });
  var sh = ss_().getSheetByName(NS_NGOAI_SHEET) || ss_().insertSheet(NS_NGOAI_SHEET);
  sh.clearContents();
  var rows = [NS_NGOAI_COT].concat(ds.map(function(r) { return NS_NGOAI_COT.map(function(k) {
    if (k === 'NgayVaoLam' || k === 'NgayChinhThuc') return nsNgay_(r[k]) || '';
    if (k === 'PhepConLai') { var ph = String(r[k] == null ? '' : r[k]).trim().replace(',', '.'); return ph !== '' && !isNaN(Number(ph)) ? Number(ph) : ''; }
    if (k === 'HoTen') return chuanHoaTen_(r[k]);
    return chuAnToan_(String(r[k] == null ? '' : r[k]).trim());
  }); }));
  sh.getRange(1, 1, rows.length, NS_NGOAI_COT.length).setValues(rows);
  sh.getRange(1, 1, 1, NS_NGOAI_COT.length).setFontWeight('bold');
  xoaCache_(NS_NGOAI_SHEET);
  return ds.length;
}
/* Web: danh sách bộ phận ngoài sản xuất – chỉ chủ sở hữu */
var NS_NGOAI_THU = ['Ban điều hành', 'Kinh doanh', 'Marketing', 'Kho', 'Bếp + tạp vụ', 'Xưởng May'];
function layNhanSuNgoaiSX(token) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (!me.laOwner) return sach_({ ok: false, msg: 'Chỉ tài khoản chủ sở hữu xem được.' });
  /* 03/11 (chủ dự án): người đang làm ở 9 xưởng (có trong NhanSu "Đang làm", vd. C043 trưởng phòng Hoàn thiện) giữ ở xưởng, không liệt kê lại ở đây */
  var oXuong = {}; docAnToan_('NhanSu').forEach(function(n) { if (String(n.TrangThai).trim() === 'Đang làm') oXuong[String(n.MaNV).trim().toUpperCase()] = 1; });
  var ds = docAnToan_(NS_NGOAI_SHEET).filter(function(r) { return String(r.MaNV || '').trim() && String(r.TrangThai || 'Đang làm').trim() !== 'Nghỉ việc' && !oXuong[String(r.MaNV).trim().toUpperCase()]; }).map(function(r) {
    return { BoPhan: String(r.BoPhan || ''), Nhom: String(r.Nhom || ''), MaNV: String(r.MaNV), HoTen: String(r.HoTen || ''), ChucDanh: String(r.ChucDanh || ''),
      NgayVaoLam: r.NgayVaoLam ? Utilities.formatDate(new Date(r.NgayVaoLam), TZ_VN, 'dd/MM/yyyy') : '', GhiChu: String(r.GhiChu || ''),
      /* 08/11 (chủ dự án: "đầy đủ thông tin" = hồ sơ): ngày chính thức, tình trạng (08/11: bỏ phép năm còn lại – chủ dự án chưa cần; cột vẫn giữ trong file) + thâm niên tự tính */
      NgayChinhThuc: r.NgayChinhThuc ? Utilities.formatDate(new Date(r.NgayChinhThuc), TZ_VN, 'dd/MM/yyyy') : '',
      tinhTrang: nsTinhTrang_(r), thamNienThang: nsThamNien_(r.NgayVaoLam) };
  });
  ds.forEach(function(x, i) { x._i = i; });   // trong 1 bộ phận giữ đúng thứ tự bảng chấm công (nhóm, trưởng bộ phận đầu)
  ds.sort(function(a, b) {
    var x = NS_NGOAI_THU.indexOf(a.BoPhan), y = NS_NGOAI_THU.indexOf(b.BoPhan); x = x < 0 ? 99 : x; y = y < 0 ? 99 : y;
    return (x - y) || (a._i - b._i);
  });
  ds.forEach(function(x) { delete x._i; });
  return sach_({ ok: true, ds: ds, file: linkFileNgoaiSX_() });
}
function nsYmd_(v) { return v ? Utilities.formatDate(new Date(v), TZ_VN, 'yyyy-MM-dd') : ''; }
function nsTinhTrang_(r) {   // 'Chính thức' | 'Thử việc' | '' (chưa có ngày)
  var hn = homNayVN_(), ct = nsYmd_(r.NgayChinhThuc), vao = nsYmd_(r.NgayVaoLam);
  if (ct) return ct <= hn ? 'Chính thức' : 'Thử việc';
  return vao ? (/thử việc/i.test(String(r.GhiChu || '')) ? 'Thử việc' : '') : '';
}
function nsThamNien_(v) {   // số tháng tròn từ ngày vào làm tới hôm nay
  var a = nsYmd_(v); if (!a) return null; var h = homNayVN_();
  var m = (Number(h.slice(0, 4)) - Number(a.slice(0, 4))) * 12 + Number(h.slice(5, 7)) - Number(a.slice(5, 7)) - (Number(h.slice(8, 10)) < Number(a.slice(8, 10)) ? 1 : 0);
  return Math.max(0, m);
}
/* 08/11 (chủ dự án): nút "Cập nhật từ file" ở Nhân sự › Bộ phận ngoài sản xuất – chép lại toàn bộ danh sách từ file Drive
   "KPI - Nhân sự ngoài sản xuất (hồ sơ)" (file là bản gốc: thêm / sửa / ghi "Nghỉ việc" ở file rồi bấm). Chỉ chủ sở hữu.
   Không tạo tài khoản, không vào KPI / điểm danh / cơm trưa. */
function capNhatNgoaiSXTuFile(token) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (!me.laOwner) return sach_({ ok: false, msg: 'Chỉ tài khoản chủ sở hữu được cập nhật.' });
  khoa_();
  var n = 0;
  try { n = nhapNhanSuNgoaiSX_(); } catch (e) { return sach_({ ok: false, msg: 'Không đọc được file danh sách: ' + (e && e.message || e) }); }
  var dem = {}; doc_(NS_NGOAI_SHEET).forEach(function(r) { if (String(r.TrangThai || '').trim() === 'Nghỉ việc') return; var b = String(r.BoPhan || 'Khác'); dem[b] = (dem[b] || 0) + 1; });
  ghiLog_(me, 'Cập nhật nhân sự ngoài sản xuất', n + ' dòng từ file', '', '');
  return sach_({ ok: true, n: n, dem: dem, msg: 'Đã cập nhật ' + n + ' người: ' + Object.keys(dem).map(function(b) { return b + ' ' + dem[b]; }).join(', ') + '.' });
}
function linkFileNgoaiSX_() { return 'https://docs.google.com/spreadsheets/d/' + NS_CC_FILE_NGOAI + '/edit'; }

/* ================== VẬN HÀNH – NHẮC HẠN, SOÁT DUYỆT, ĐỊNH MỨC LỆCH, HỘI NHẬP, KỸ NĂNG (tư vấn 18/10) ==================
   Nguồn: kpi-app/tests/van-hanh/van-hanh.gs (nối vào Code.gs bởi tests/van-hanh/va-van-hanh.py). Danh sách: kpi-app/TU-VAN-VAN-HANH.md. */

/* ----- Ngày còn thiếu sản lượng, CHƯA quá hạn (cùng điều kiện với chayPhatNhapTre) -----
   Trả { MaNV: [{ngay, han}] } – han = ngày làm việc thứ 3 (hạn 17:00). */
function thieuNhap_(dsNV, homNay) {
  var gioNay = gioVN_(), maQL = mapQuanLy_();
  var xuongDD = {}, daNhap = {}, cc = {}, ndh = {}, daPhat = {};
  docAnToan_('XacNhanDiemDanh').forEach(function(r){ xuongDD[r.MaXuong + '|' + ngayVN_(r.Ngay)] = 1; });
  doc_('NhatKySanXuat').forEach(function(r){ daNhap[r.MaNV + '|' + ngayVN_(r.Ngay)] = 1; });
  docAnToan_('DiemDanhNghi').forEach(function(r){ cc[r.MaNV + '|' + ngayVN_(r.Ngay)] = khTuBanGhi_(r); });
  docAnToan_('NghiDaiHan').forEach(function(r){ (ndh[r.MaNV] = ndh[r.MaNV] || []).push({ tu: ngayVN_(r.TuNgay), den: ngayVN_(r.DenNgay) }); });
  docAnToan_('PhatNhapTre').forEach(function(p){ daPhat[p.MaNV + '|' + ngayVN_(p.Ngay)] = 1; });
  var ngays = [];
  for (var b = 0; b <= 14; b++) { var n0 = congNgay_(homNay, -b); if (thuCua_(n0) !== 0) ngays.push(n0); }
  var out = {};
  dsNV.forEach(function(nv){
    if (!nv || String(nv.TrangThai).trim() === 'Nghỉ việc' || String(nv.TrangThai).trim() === 'Tạm nghỉ' || maQL[String(nv.MaNV).trim()]) return;
    ngays.forEach(function(ng){
      var k = nv.MaNV + '|' + ng;
      if (daNhap[k] || daPhat[k] || !xuongDD[nv.MaXuong + '|' + ng] || laNgayLe_(ng, nv.MaXuong)) return;
      var d = ndh[nv.MaNV] || [];
      for (var i = 0; i < d.length; i++) if (d[i].tu <= ng && ng <= d[i].den) return;
      if (cc[k] && gioCoMat_(cc[k]) <= 0) return;
      var han = themNgayLamViec_(ng, 2);
      if (homNay > han || (homNay === han && gioNay >= 17)) return;      // đã quá hạn -> việc của chayPhatNhapTre
      (out[nv.MaNV] = out[nv.MaNV] || []).push({ ngay: ng, han: han });
    });
  });
  Object.keys(out).forEach(function(m){ out[m].sort(function(a, b){ return a.han < b.han ? -1 : a.han > b.han ? 1 : (a.ngay < b.ngay ? -1 : 1); }); });
  return out;
}

/* Tỷ lệ nhập đúng hạn của một xưởng trong 7 ngày làm việc gần nhất đã qua hạn (để khen cả xưởng, C6) */
function tyLeDungHan_(maXuong, homNay) {
  var ngays = [], d = homNay;
  for (var i = 0; i < 40 && ngays.length < 7; i++) {
    d = congNgay_(d, -1);
    if (thuCua_(d) === 0) continue;
    var han = themNgayLamViec_(d, 2);
    if (han < homNay) ngays.push(d);
  }
  var coDD = {}; docAnToan_('XacNhanDiemDanh').forEach(function(r){ if (r.MaXuong === maXuong) coDD[ngayVN_(r.Ngay)] = 1; });
  ngays = ngays.filter(function(n){ return coDD[n] && !laNgayLe_(n, maXuong); });
  if (!ngays.length) return null;
  var maQL = mapQuanLy_();
  var ns = doc_('NhanSu').filter(function(x){ return x.MaXuong === maXuong && String(x.TrangThai).trim() !== 'Nghỉ việc' && !maQL[String(x.MaNV).trim()]; });
  if (!ns.length) return null;
  var tre = 0, ngaySet = {};
  ngays.forEach(function(n){ ngaySet[n] = 1; });
  docAnToan_('PhatNhapTre').forEach(function(p){ if (p.MaXuong === maXuong && ngaySet[ngayVN_(p.Ngay)]) tre++; });
  var tong = ns.length * ngays.length;
  return { tyLe: Math.round(Math.max(0, tong - tre) / tong * 100), soNgay: ngays.length };
}

/* C1: công nhân xem ngày còn thiếu sản lượng của mình (chỉ những ngày chưa quá hạn) */
function hanNhapCuaToi(token) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (me.vaiTro !== 'CN' || !me.maNV) return sach_({ ok: true, ds: [] });
  var homNay = homNayVN_();
  var nv = nhanSuGomTP_().filter(function(x){ return x.MaNV === me.maNV; })[0];
  var ds = nv ? (thieuNhap_([nv], homNay)[me.maNV] || []) : [];
  var tl = me.xuong ? tyLeDungHan_(me.xuong, homNay) : null;
  return sach_({ ok: true, ds: ds, homNay: homNay, hocViec: dangHocViec_(me.maNV, homNay), hetHocViec: hetHocViec_(me.maNV),
    xuong: tl ? { ten: tenXuong_(me.xuong), tyLe: tl.tyLe, soNgay: tl.soNgay } : null });
}

/* C2: trưởng/phó phòng xem người trong xưởng còn thiếu sản lượng, hạn tới trong 1 ngày làm việc tới */
function canNhacXuong(token) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (me.vaiTro !== 'TP' || !me.xuong) return sach_({ ok: true, ds: [] });
  var homNay = homNayVN_(), moc = themNgayLamViec_(homNay, 1);
  var ns = nhanSuGomTP_().filter(function(x){ return x.MaXuong === me.xuong; });
  var thieu = thieuNhap_(ns, homNay), ten = {};
  ns.forEach(function(x){ ten[x.MaNV] = x.HoTen; });
  var ds = [];
  Object.keys(thieu).forEach(function(m){
    var gan = thieu[m].filter(function(t){ return t.han <= moc; });
    if (gan.length) ds.push({ MaNV: m, HoTen: ten[m] || m, ngay: gan.map(function(t){ return t.ngay; }), han: gan[0].han, hocViec: dangHocViec_(m, homNay) });
  });
  ds.sort(function(a, b){ return a.han < b.han ? -1 : a.han > b.han ? 1 : String(a.HoTen).localeCompare(String(b.HoTen)); });
  var tl = tyLeDungHan_(me.xuong, homNay);
  return sach_({ ok: true, ds: ds, homNay: homNay, xuong: tl ? { ten: tenXuong_(me.xuong), tyLe: tl.tyLe, soNgay: tl.soNgay } : null });
}

/* A4 + A6: bảng soát khâu duyệt + định mức lệch – ban điều hành, trợ lý */
function soatDuyet(token) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (me.vaiTro !== 'ADMIN' && me.vaiTro !== 'TL') return sach_({ ok: false, msg: 'Chỉ ban điều hành xem được.' });
  return nho_('soatDuyet', [], function() { return soatDuyetGoc_(); });
}
function soatDuyetGoc_() {
  var homNay = homNayVN_(), tu30 = congNgay_(homNay, -30), tu7 = congNgay_(homNay, -7), bayGio = new Date().getTime();
  var kyNay = homNay.slice(0, 7), ky = [kyTruoc_(kyNay)]; ky.unshift(kyTruoc_(ky[0])); ky.unshift(kyTruoc_(ky[0]));
  var dt = docDuLieuKPI_(canLuuTru_(ky));
  var cd = {}; doc_('CongDoan').forEach(function(c){ cd[c.MaCD] = c; });
  var ten = {}; nhanSuGomTP_().forEach(function(x){ ten[x.MaNV] = x.HoTen; });
  var X = {}, mau = [], hs = {};
  var x_ = function(mx){ return X[mx] || (X[mx] = { MaXuong: mx, TenXuong: tenXuong_(mx), cho: 0, choLau: 0, duyet: 0, sua: 0, chotCa: 0 }); };
  dt.nhatky.forEach(function(r){
    var c = cd[r.MaCD]; if (!c) return;
    var tt = String(r.TrangThai).trim(), ng = ngayVN_(r.Ngay);
    if (tt === 'Chờ duyệt') {
      var x = x_(c.MaXuong); x.cho++;
      var t = r.ThoiDiemNhap ? new Date(r.ThoiDiemNhap).getTime() : NaN;
      if ((!isNaN(t) && bayGio - t > 24 * 3600e3) || ng < congNgay_(homNay, -1)) x.choLau++;
      return;
    }
    if (tt !== 'Đã chốt') return;
    if (ng >= tu30) {
      var y = x_(c.MaXuong); y.duyet++;
      if (String(r.SLGoc || '').trim()) y.sua++;
      if (String(r.NguoiNhap || '').indexOf('→ duyệt') < 0) y.chotCa++;
      if (ng >= tu7) mau.push(r);
    }
    // A6: hiệu suất từng dòng theo định mức ngày đó, gom theo công đoạn + tháng
    var thg = ng.slice(0, 7), gio = soVN_(r.GioLam) || 0, d = dmNgay_(dt, r.MaCD, ng);
    if (ky.indexOf(thg) < 0 || !(gio > 0) || !(d > 0)) return;
    var sl = Number(r.SoLuongLamRa) || 0;
    ((hs[r.MaCD] = hs[r.MaCD] || {})[thg] = hs[r.MaCD][thg] || []).push(sl / (d * gio) * 100);
  });
  // 5 dòng ngẫu nhiên đã duyệt trong 7 ngày để ban điều hành đối chiếu
  var chon = [];
  for (var i = 0; i < 5 && mau.length; i++) chon.push(mau.splice(Math.floor(Math.random() * mau.length), 1)[0]);
  var trungVi = function(a){ a = a.slice().sort(function(p, q){ return p - q; }); var m = Math.floor(a.length / 2); return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2; };
  var lech = [];
  Object.keys(hs).forEach(function(m){
    var tv = ky.map(function(k){ var a = hs[m][k] || []; return a.length >= 5 ? Math.round(trungVi(a)) : null; });
    if (tv.some(function(v){ return v === null; })) return;
    var cao = tv.every(function(v){ return v > 115; }), thap = tv.every(function(v){ return v < 80; });
    if (cao || thap) lech.push({ MaCD: m, TenCD: (cd[m] || {}).TenCD || m, MaXuong: (cd[m] || {}).MaXuong || '', TenXuong: tenXuong_((cd[m] || {}).MaXuong || ''),
      dm: dt.idxDM[m] || 0, ky: ky, trungVi: tv, huong: cao ? 'cao' : 'thap' });
  });
  lech.sort(function(a, b){ return Math.abs(b.trungVi[2] - 100) - Math.abs(a.trungVi[2] - 100); });
  return sach_({ ok: true, homNay: homNay,
    xuong: Object.keys(X).map(function(k){ return X[k]; }).sort(function(a, b){ return b.choLau - a.choLau || String(a.TenXuong).localeCompare(String(b.TenXuong)); }),
    mau: chon.map(function(r){ var c = cd[r.MaCD] || {}; var tl = tachLoi_(r.GhiChu);
      return { ngay: ngayVN_(r.Ngay), MaNV: r.MaNV, HoTen: ten[r.MaNV] || r.MaNV, TenXuong: tenXuong_(c.MaXuong || ''), TenCD: c.TenCD || r.MaCD,
        SL: Number(r.SoLuongLamRa) || 0, slGoc: String(r.SLGoc || ''), nguoi: String(r.NguoiNhap || '') }; }),
    lech: lech.slice(0, 15) });
}

/* D4. Đón người mới: chủ dự án bỏ hẳn 08/11 (sheet HoiNhap cũ để nguyên, không còn dùng). */

/* ===== D5. BẢNG KỸ NĂNG 3 MỨC: Đang học (có người kèm) / Làm được / Kèm được người khác =====
   CongDoanLamDuoc giữ nguyên cách lưu (danh sách mã công đoạn). Mức nằm ở cột mới MucKyNang = JSON {MaCD: 'hoc'|'kem'};
   không ghi = 'lam' (làm được). */
function luuMucKyNang(token, maNV, maCD, muc) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (['ADMIN', 'TP'].indexOf(me.vaiTro) < 0) return sach_({ ok: false, msg: 'Không có quyền.' });
  if (['hoc', 'lam', 'kem', ''].indexOf(muc) < 0) return sach_({ ok: false, msg: 'Mức không hợp lệ.' });
  khoa_();
  var nv = doc_('NhanSu').filter(function(x){ return x.MaNV === maNV; })[0];
  if (!nv) return sach_({ ok: false, msg: 'Không tìm thấy nhân viên.' });
  if (me.vaiTro === 'TP' && nv.MaXuong !== me.xuong) return sach_({ ok: false, msg: 'Nhân viên không thuộc xưởng của bạn.' });
  var c = doc_('CongDoan').filter(function(x){ return x.MaCD === maCD; })[0];
  if (!c || c.MaXuong !== nv.MaXuong) return sach_({ ok: false, msg: 'Công đoạn không thuộc xưởng của nhân viên.' });
  var ds = String(nv.CongDoanLamDuoc || '').split(/[,;]\s*/).map(function(x){ return x.trim(); }).filter(Boolean);
  var mk = {}; try { mk = JSON.parse(nv.MucKyNang || '{}') || {}; } catch (e) { mk = {}; }
  var co = ds.indexOf(maCD) >= 0;
  if (muc === '') { ds = ds.filter(function(x){ return x !== maCD; }); delete mk[maCD]; }
  else { if (!co) ds.push(maCD); if (muc === 'lam') delete mk[maCD]; else mk[maCD] = muc; }
  suaO_('NhanSu', nv._row, 'CongDoanLamDuoc', ds.join(','));
  ghiCotNeuCo_('NhanSu', nv._row, 'MucKyNang', Object.keys(mk).length ? JSON.stringify(mk) : '');
  ghiLog_(me, 'Bảng kỹ năng', maNV + ' — ' + maCD + ': ' + ({ hoc: 'Đang học', lam: 'Làm được', kem: 'Kèm được', '': 'Bỏ' })[muc]);
  return sach_({ ok: true, CongDoanLamDuoc: ds.join(','), MucKyNang: mk });
}

/* ===== SOÁT DỮ LIỆU SHEET (21/10) – CHẠY TAY TRONG TRÌNH SOẠN THẢO =====
   Ghi kết quả vào sheet "KiemTraDuLieu" (xóa và ghi lại mỗi lần chạy): Nhóm | Chi tiết | Dòng sheet | Cách sửa.
   Chỉ ĐỌC dữ liệu, không sửa gì. */
function KIEM_TRA_DU_LIEU() {
  if (!noiBo_(arguments[0])) return chanWeb_('KIEM_TRA_DU_LIEU');
  var L = [], them = function(nhom, ct, dong, sua) { L.push([nhom, ct, dong || '', sua || '']); };
  var hn = homNayVN_(), coNgay = function(v) { var s = ngayVN_(v); return /^\d{4}-\d{2}-\d{2}$/.test(s) && s >= NGAY_MO_HE_THONG && s <= hn; };
  var ns = {}; doc_('NhanSu').forEach(function(x) { ns[String(x.MaNV).trim()] = x; });
  var cd = {}; doc_('CongDoan').forEach(function(x) { cd[String(x.MaCD).trim()] = x; });
  var dm = {}; doc_('DinhMuc').forEach(function(x) { dm[String(x.MaCD).trim()] = soVN_(x.DinhMucGio); });
  var maQL = mapQuanLy_();

  // 1. Ngày sai trong nhật ký / điểm danh (sản lượng ngày sai không vào KPI)
  doc_('NhatKySanXuat').forEach(function(r) {
    if (!coNgay(r.Ngay)) them('Nhật ký: ngày không hợp lệ', r.MaNV + ' · ' + r.MaCD + ' · SL ' + r.SoLuongLamRa + ' · ngày "' + ngayVN_(r.Ngay) + '" · ' + r.TrangThai, 'NhatKySanXuat ' + r._row, 'Sửa ô Ngay đúng ngày làm (yyyy-mm-dd), hoặc xóa dòng nếu nhập nhầm');
  });
  ['DiemDanhNghi', 'XacNhanDiemDanh'].forEach(function(t) {
    docAnToan_(t).forEach(function(r) { if (!coNgay(r.Ngay)) them(t + ': ngày không hợp lệ', (r.MaNV || r.MaXuong) + ' · "' + ngayVN_(r.Ngay) + '"', t + ' ' + r._row, 'Sửa ngày hoặc xóa dòng'); });
  });
  // 2. Tài khoản
  var tkDem = {};
  doc_('TaiKhoan').forEach(function(t) {
    var k = String(t.TenDangNhap).trim().toLowerCase(), vt = String(t.VaiTro).trim(), m = String(t.MaNV || '').trim();
    if (tkDem[k]) them('Tài khoản trùng tên đăng nhập', k + ' (trùng dòng ' + tkDem[k] + ')', 'TaiKhoan ' + t._row, 'Xóa dòng trùng (hệ thống chỉ dùng dòng trên cùng)'); else tkDem[k] = t._row;
    if (String(t.TrangThai).trim() !== 'Đang dùng') return;
    if (m && ns[m] && String(ns[m].TrangThai).trim() === 'Nghỉ việc') them('Tài khoản còn "Đang dùng" của người đã nghỉ việc', k, 'TaiKhoan ' + t._row, 'Đổi TrangThai thành Ngừng');
    if (vt === 'CN' && maQL[m]) them('Vai trò CN nhưng hồ sơ là trưởng/phó phòng (không bị nhắc/phạt, không vào bảng KPI)', k + ' · ' + (ns[m] ? ns[m].ChucDanh : ''), 'TaiKhoan ' + t._row, 'Sửa chức danh hoặc đổi tài khoản này sang Ngừng nếu đã có tài khoản TP/PP');
    if ((vt === 'CN' || vt === 'TP' || vt === 'PP') && m && !ns[m]) them('Tài khoản gắn mã NV không có trong NhanSu', k + ' → ' + m, 'TaiKhoan ' + t._row, 'Sửa ô MaNV');
  });
  // 3. Nhân sự / công đoạn
  Object.keys(ns).forEach(function(m) {
    var x = ns[m]; if (String(x.TrangThai).trim() === 'Nghỉ việc') return;
    if (!ngayVN_(x.NgayVaoLam)) them('Nhân sự thiếu ngày vào làm (không tính được học việc tháng đầu)', m + ' · ' + x.HoTen, 'NhanSu ' + x._row, 'Điền NgayVaoLam');
    String(x.CongDoanLamDuoc || '').split(',').map(function(s) { return s.trim(); }).filter(String).forEach(function(c) {
      if (!cd[c]) them('Công đoạn làm được không tồn tại', m + ' → ' + c, 'NhanSu ' + x._row, 'Bỏ mã này ở ô CongDoanLamDuoc');
      else if (String(cd[c].TrangThai).trim() === 'Ngừng') them('Công đoạn làm được đã Ngừng', m + ' → ' + c, 'NhanSu ' + x._row, 'Bỏ mã này hoặc gán công đoạn mới');
    });
  });
  Object.keys(cd).forEach(function(c) {
    if (String(cd[c].TrangThai).trim() !== 'Ngừng' && !(dm[c] > 0)) them('Công đoạn đang dùng chưa có định mức (hiệu suất tính 0)', c + ' · ' + cd[c].TenCD, 'CongDoan ' + cd[c]._row, 'Đặt định mức ở tab Công đoạn');
  });
  // 4. Sản lượng bất thường
  var cc = {}; docAnToan_('DiemDanhNghi').forEach(function(r) { cc[r.MaNV + '|' + ngayVN_(r.Ngay)] = khTuBanGhi_(r); });
  doc_('NhatKySanXuat').forEach(function(r) {
    if (String(r.TrangThai).trim() === 'Từ chối' || !coNgay(r.Ngay)) return;
    var ng = ngayVN_(r.Ngay), kh = cc[r.MaNV + '|' + ng], d = dm[String(r.MaCD).trim()], sl = Number(r.SoLuongLamRa);
    if (kh && gioCoMat_(kh) <= 0) them('Có sản lượng vào ngày chấm nghỉ cả ngày (sản lượng không vào hiệu suất)', r.MaNV + ' · ' + ng + ' · ' + kh + ' · ' + r.MaCD + ' SL ' + sl, 'NhatKySanXuat ' + r._row, 'Kiểm tra lại chấm công ngày đó');
    if (d > 0 && sl > d * 8 * 3) them('Sản lượng > 300% định mức 8 giờ (gõ thừa số 0? định mức sai?)', r.MaNV + ' · ' + ng + ' · ' + r.MaCD + ' · SL ' + sl + ' / định mức ' + d + '/giờ', 'NhatKySanXuat ' + r._row, 'Kiểm tra số lượng hoặc định mức');
    if (!(sl > 0)) them('Sản lượng bằng 0', r.MaNV + ' · ' + ng + ' · ' + r.MaCD, 'NhatKySanXuat ' + r._row, 'Xóa dòng hoặc sửa số');
  });
  // Ghi ra sheet
  var sh = ss_().getSheetByName('KiemTraDuLieu') || ss_().insertSheet('KiemTraDuLieu');
  sh.clear();
  var bang = [['Nhóm', 'Chi tiết', 'Dòng sheet', 'Cách sửa']].concat(L.length ? L : [['Không thấy vấn đề', '', '', '']]);
  sh.getRange(1, 1, bang.length, 4).setValues(bang.map(function(r) { return r.map(function(v) { return chuAnToan_(String(v)); }); }));
  sh.getRange(1, 1, 1, 4).setFontWeight('bold'); sh.setFrozenRows(1);
  Logger.log('Soát dữ liệu: ' + L.length + ' mục – xem sheet KiemTraDuLieu.');
  return L.length;
}

/* ===== TĂNG TỐC ĐỢT 2 (21/10) – gói gọn dữ liệu nạp, bộ nhớ tạm KPI riêng, làm nóng bảng KPI ===== */
var GOI_TU_DONG = 30;        // mảng từ 30 dòng trở lên thì gói dạng bảng
function goiNap_(r) {
  if (!r || typeof r !== 'object' || !r.ok) return r;
  var o = {};
  Object.keys(r).forEach(function(k) { o[k] = goiBang_(r[k]); });
  o.__ms = Date.now() - __T0;   // 08/11 bộ đo
  return JSON.stringify(o);
}
function goiBang_(a) {
  if (Object.prototype.toString.call(a) !== '[object Array]' || a.length < GOI_TU_DONG) return a;
  for (var i = 0; i < a.length; i++) if (!a[i] || typeof a[i] !== 'object' || Object.prototype.toString.call(a[i]) === '[object Array]') return a;
  var cot = Object.keys(a[0]), ma = cot.join('\u0001');
  for (var i2 = 1; i2 < a.length; i2++) if (Object.keys(a[i2]).join('\u0001') !== ma) return a;   // khác thứ tự cột -> giữ nguyên (mở ra phải giống hệt)
  var h = a.map(function(x) {
    var d = new Array(cot.length);
    for (var j = 0; j < cot.length; j++) d[j] = x[cot[j]];
    return d;
  });
  return { __b: 1, c: cot, h: h };
}

/* Bộ nhớ tạm KPI có số phiên bản riêng: chỉ đổi khi dữ liệu dùng để tính KPI đổi.
   Không đổi khi: công nhân gửi sản lượng (dòng "Chờ duyệt" không vào KPI), đăng ký cơm, thực đơn, nhật ký thao tác,
   thông báo, bố trí máy, hội nhập, yêu cầu sửa hồ sơ, báo cáo. Có sheet lạ thì vẫn đổi (an toàn). */
var NHO_KPI_ = { layKPIKy: 1, layKPIQuanLy: 1, layLichSuKPI: 1 };
var SHEET_KHONG_KPI_ = { DangKyCom: 1, ThucDon: 1, SuatAnThang: 1, NhatKyThaoTac: 1, ThongBao: 1, BoTriMay: 1, HoiNhap: 1,
  YeuCauSuaHoSo: 1, KiemTraDuLieu: 1, NguoiNhanBaoCao: 1 };
var __KPI_KHONG_DOI = false;  // lượt gọi chỉ thêm dòng "Chờ duyệt" (congNhanGuiSanLuong)
var __PB_KPI = null;
function phienBanKPI_() {
  if (__PB_KPI === null) {
    try { __PB_KPI = PropertiesService.getScriptProperties().getProperty('KPI_PB_KPI') || '0'; } catch (e) { __PB_KPI = '0'; }
  }
  return __PB_KPI;
}
function tangPhienBanKPI_() {
  __PB_KPI = new Date().getTime() + '.' + Math.floor(Math.random() * 1e6);
  try { PropertiesService.getScriptProperties().setProperty('KPI_PB_KPI', __PB_KPI); } catch (e) {}
}
function anhHuongKPI_() {
  if (__KPI_KHONG_DOI) return false;
  var ten = Object.keys(__DA_GHI);
  if (!ten.length) return true;                       // không rõ đã ghi gì (vd. XOA_BO_NHO_TAM) -> coi như có
  return ten.some(function(t) { return t === '*' || !SHEET_KHONG_KPI_[t]; });
}

/* LÀM NÓNG: trigger 10 phút/lần (6h–22h) tính sẵn bảng KPI tháng này (toàn nhà máy + từng xưởng) và KPI quản lý
   (ban điều hành + trưởng phòng từng xưởng), để người mở tab lấy ngay từ bộ nhớ tạm. Bản đã nhớ còn mới thì bỏ qua. */
function LAM_NONG_KPI(e) {
  if (!noiBo_(e)) return chanWeb_('LAM_NONG_KPI');
  var gio = gioVN_();
  if (gio < 6 || gio >= 22) return;
  var t0 = new Date().getTime(), ky = kyVN_(), ds = ['', ], soX = 0;
  doc_('PhongBan').forEach(function(p) { if (p.MaXuong) { ds.push(String(p.MaXuong)); soX++; } });
  ds.forEach(function(mx) {
    if (new Date().getTime() - t0 > 240000) return;   // chừa thời gian, tránh quá 6 phút
    nho_('layKPIKy', ['thang', ky, mx], function() { return layKPIKyGoc_(null, 'thang', ky, mx, { vaiTro: 'ADMIN' }); });
  });
  var meQL = [{ vaiTro: 'ADMIN', xuong: '', laOwner: true }, { vaiTro: 'ADMIN', xuong: '', laOwner: false }];
  doc_('PhongBan').forEach(function(p) { if (p.MaXuong) meQL.push({ vaiTro: 'TP', xuong: String(p.MaXuong), laOwner: false }); });
  meQL.forEach(function(me) {
    if (new Date().getTime() - t0 > 300000) return;
    nho_('layKPIQuanLy', [ky, me.vaiTro, me.xuong, me.laOwner], function() { return layKPIQuanLyGoc_(null, ky, me); });
  });
  try { Logger.log('Làm nóng KPI ' + ky + ': ' + ds.length + ' bảng KPI, ' + meQL.length + ' KPI quản lý, ' + (new Date().getTime() - t0) + ' ms'); } catch (x) {}
}
/* CHẠY TAY 1 LẦN: cài trigger làm nóng 10 phút/lần */
function CAI_TRIGGER_LAM_NONG_KPI() {
  if (!noiBo_(arguments[0])) return chanWeb_('CAI_TRIGGER_LAM_NONG_KPI');
  ScriptApp.getProjectTriggers().forEach(function(t) { if (t.getHandlerFunction() === 'LAM_NONG_KPI') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('LAM_NONG_KPI').timeBased().everyMinutes(10).create();
  Logger.log('Đã cài trigger làm nóng bảng KPI: 10 phút/lần (chỉ chạy 6h–22h).');
}
function TAT_TRIGGER_LAM_NONG_KPI() {
  if (!noiBo_(arguments[0])) return chanWeb_('TAT_TRIGGER_LAM_NONG_KPI');
  ScriptApp.getProjectTriggers().forEach(function(t) { if (t.getHandlerFunction() === 'LAM_NONG_KPI') ScriptApp.deleteTrigger(t); });
  Logger.log('Đã tắt trigger làm nóng bảng KPI.');
}
/* =====================================================================
   PHÂN TÍCH ĐỊNH MỨC (tests/dinh-muc/)
   - 21/10: đánh giá ĐỊNH MỨC ĐANG DÙNG trên mọi ngày của kỳ; giải cùng lúc mọi công đoạn (người làm nhiều công đoạn
     trong ngày chia giờ theo tỷ lệ giờ chuẩn, nên định mức các công đoạn ảnh hưởng lẫn nhau); chỉ NÂNG, không hạ.
   - 22/10 (chủ dự án duyệt theo tư vấn chuyên gia vận hành): mốc = NGƯỜI KHÁ (phân vị 75%) đạt 90%, gộp 3 tháng gần
     nhất, bỏ người ĐỘT BIẾN (> 1,5 × người khá của công đoạn) và người MỚI (tài khoản tạo hoặc vào làm trong 2 tháng).
     Không phân công đoạn chính/phụ, công đoạn 2–3 người vẫn gợi ý (ghi "ít người").
   - Đổi định mức (mọi đường) áp cho cả tháng đang làm (ngayApDM_).
   ===================================================================== */
var DM_MOC = 90;          // hiệu suất người khá mong muốn
var DM_PV = 0.75;         // người khá = phân vị 75% (top 25%)
var DM_SAT = 3;           // lệch ≤ 3 điểm coi là đã sát mốc, không gợi ý
var DM_IT_NGUOI = 3;      // dưới 3 người có dữ liệu: gợi ý kém tin (vẫn gợi ý)
var DM_DOT_BIEN = 1.5;    // hiệu suất > 1,5 × người khá của những người còn lại = đột biến, không tính (công đoạn ≥ 4 người)
var DM_MOI_THANG = 2;     // tài khoản / ngày vào làm trong 2 tháng gần đây = người mới, không tính
var DM_SO_THANG = 3;      // xem theo tháng: gộp 3 tháng gần nhất (tới tháng đang chọn)
var __DM_TU = null;       // ngày bắt đầu áp định mức mới trong lượt gọi (tính một lần)

/* Đổi định mức áp cho CẢ THÁNG đang làm (ngày 1 tháng này), kể cả khi tháng đã chốt (chủ dự án 21/10). */
function ngayApDM_() {
  if (__DM_TU === null) __DM_TU = kyVN_() + '-01';
  return __DM_TU;
}
/* Tháng này đã có bản KPI chốt (KPIThang) -> sau khi đổi định mức cần "Chốt bù" để bản đã lưu khớp số mới */
// 22/10: bỏ lời nhắc "Chốt bù" – Bảng KPI của THÁNG ĐANG LÀM luôn tính trực tiếp (không đọc bản đã chốt), mà đổi định mức
// chỉ áp cho tháng đang làm, nên không bao giờ cần chốt bù vì đổi định mức. (Lời nhắc cũ làm chủ dự án bấm chốt tháng 10 giữa tháng.)
function nhacChotBuDM_(msg) { return msg + ' Bảng KPI tháng này tự tính lại theo định mức mới.'; }
/* Bỏ phần lịch sử định mức của maCD từ ngày tu trở đi (để định mức mới áp được cho các ngày đó) */
function catLichSuDM_(maCD, tu) {
  if (!ss_().getSheetByName(LSDM_SHEET)) return;
  var truoc = congNgay_(tu, -1), xoa = [];
  doc_(LSDM_SHEET).forEach(function(x) {
    if (x.MaCD !== maCD) return;
    var a = x.TuNgay ? ngayVN_(x.TuNgay) : '', b = ngayVN_(x.DenNgay);
    if (!b || b < tu) return;                           // đoạn kết thúc trước ngày áp: giữ
    if (a && a >= tu) xoa.push(x._row);                 // nằm trọn sau ngày áp: xóa
    else suaO_(LSDM_SHEET, x._row, 'DenNgay', "'" + truoc);
  });
  if (xoa.length) { xaGhi_(LSDM_SHEET); xoaNhieuDong_(LSDM_SHEET, xoa); }
}

function dmLamTron_(n) {                                  // sai số làm tròn ≤ ~2,5%
  if (!(n > 0)) return 0;
  var buoc = n >= 20 ? 1 : n >= 5 ? 0.5 : n >= 2 ? 0.1 : 0.05;
  return Math.max(buoc, Math.round(Math.round(n / buoc) * buoc * 100) / 100);
}

function phanTichDinhMucGoc_(token, kieu, giaTri) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok:false, hetHan:true, msg:'Phiên đăng nhập đã hết hạn.' });
  if (!me.laOwner && me.vaiTro !== 'TP')
    return sach_({ ok:false, msg:'Không có quyền xem phân tích định mức.' });

  var thangCanLay = [];
  if (kieu === 'thang') {
    if (!/^\d{4}-\d{2}$/.test(String(giaTri))) return sach_({ ok:false, msg:'Tháng không hợp lệ.' });
    for (var t = giaTri, i0 = 0; i0 < DM_SO_THANG; i0++, t = kyTruoc_(t)) thangCanLay.unshift(t);   // 3 tháng gần nhất
  } else if (kieu === 'quy') {
    var m = String(giaTri).match(/^(\d{4})-Q([1-4])$/);
    if (m) { var y = m[1], q = Number(m[2]); for (var i = 0; i < 3; i++) thangCanLay.push(y + '-' + ('0' + ((q - 1) * 3 + 1 + i)).slice(-2)); }
  } else return sach_({ ok:false, msg:'Chỉ hỗ trợ xem theo Tháng hoặc Quý.' });
  if (!thangCanLay.length) return sach_({ ok:false, msg:'Kỳ không hợp lệ.' });

  var dt = docDuLieuKPI_(canLuuTru_(thangCanLay));
  var congdoan = doc_('CongDoan'), cdMa = {};
  congdoan.forEach(function(c) { cdMa[c.MaCD] = c; });
  var dmHT = {};                                         // định mức đang dùng
  doc_('DinhMuc').forEach(function(x) { var v = soVN_(x.DinhMucGio); if (v > 0) dmHT[x.MaCD] = v; });
  var tenNV = {}; dt.nhansu.forEach(function(x) { tenNV[x.MaNV] = x.HoTen; });

  // Người MỚI: tài khoản tạo hoặc ngày vào làm trong DM_MOI_THANG tháng tính tới cuối kỳ (hoặc hôm nay nếu kỳ chưa hết)
  var cuoiKy = thangCanLay[thangCanLay.length - 1] + '-31', homNay = homNayVN_();
  if (cuoiKy > homNay) cuoiKy = homNay;
  var mocMoi = cuoiKy.slice(0, 7); for (var k0 = 0; k0 < DM_MOI_THANG; k0++) mocMoi = kyTruoc_(mocMoi);
  mocMoi = mocMoi + cuoiKy.slice(7);                     // cùng ngày, lùi 2 tháng
  var batDau = {};
  dt.nhansu.forEach(function(x) { var v = x.NgayVaoLam ? ngayVN_(x.NgayVaoLam) : ''; if (v) batDau[x.MaNV] = v; });
  doc_('TaiKhoan').forEach(function(x) {
    var v = x.NgayTao ? ngayVN_(x.NgayTao) : '', nv = String(x.MaNV || '').trim();
    if (v && nv && (!batDau[nv] || v > batDau[nv])) batDau[nv] = v;   // lấy ngày muộn hơn giữa vào làm và tạo tài khoản
  });
  var laMoi = function(nv) { return !!batDau[nv] && batDau[nv] > mocMoi; };

  // (người, ngày) -> giờ có mặt + sản lượng đạt từng công đoạn
  var nd = {}, boMoi = {}, boHV = {};
  dt.nhatky.forEach(function(r) {
    if (String(r.TrangThai).trim() !== 'Đã chốt') return;
    var ng = ngayVN_(r.Ngay);
    if (thangCanLay.indexOf(ng.slice(0, 7)) < 0) return;
    if (!(dmHT[r.MaCD] > 0)) return;                     // chưa có định mức -> bỏ (như KPI)
    var dat = Number(r.SoLuongLamRa) - (dt.idxLoi[r.MaNV + '|' + ng + '|' + r.MaCD] || 0);
    if (!(dat > 0)) return;
    if (laMoi(r.MaNV)) { boMoi[r.MaNV] = 1; return; }                        // người mới (2 tháng): không tính
    if (dangHocViec_(r.MaNV, ng)) { boHV[r.MaNV] = 1; return; }             // ngày còn học việc của người cũ: không tính
    var k = r.MaNV + '|' + ng;
    var o = nd[k] || (nd[k] = { nv: r.MaNV, ng: ng, dat: {} });
    o.dat[r.MaCD] = (o.dat[r.MaCD] || 0) + dat;
  });
  var ngay = [];
  Object.keys(nd).forEach(function(k) {
    var o = nd[k], kh = dt.idxCC ? (dt.idxCC[k] || 'x') : 'x', gio = gioCoMat_(kh);
    if (gio > 0) { o.gio = gio; ngay.push(o); }
  });
  var theoCD = {};                                       // MaCD -> các (người, ngày) có làm công đoạn đó
  ngay.forEach(function(o) { Object.keys(o.dat).forEach(function(mc) { (theoCD[mc] = theoCD[mc] || []).push(o); }); });

  var pv = function(a, p) {                              // phân vị p (nội suy tuyến tính)
    if (!a.length) return 0;
    a = a.slice().sort(function(x, y) { return x - y; });
    var vt = (a.length - 1) * p, d = Math.floor(vt), t2 = Math.min(d + 1, a.length - 1);
    return a[d] + (a[t2] - a[d]) * (vt - d);
  };
  // Chuẩn bị từng dòng (người, ngày) của công đoạn: khac = giờ chuẩn các công đoạn khác trong ngày (theo N lúc chuẩn bị),
  // để khi dò định mức của riêng mc chỉ tính lại phần của mc. bo = người đột biến của công đoạn (không đưa vào thống kê).
  var dotBien = {};                                      // MaCD -> {MaNV: hiệu suất}
  var chuanBi = function(mc, N) {
    var nv = {}, dsNv = [], bo = dotBien[mc] || {}, rows = [];
    theoCD[mc].forEach(function(o) {
      if (o.nv in bo) return;
      var khac = 0, c; for (c in o.dat) if (c !== mc) khac += o.dat[c] / N[c];
      if (!(o.nv in nv)) { nv[o.nv] = dsNv.length; dsNv.push(o.nv); }
      rows.push({ p: nv[o.nv], dat: o.dat[mc], gio: o.gio, khac: khac });
    });
    return { rows: rows, soNv: dsNv.length, dsNv: dsNv };
  };
  var hsTu = function(cb, Nmc) {                         // hiệu suất từng người ở công đoạn khi định mức là Nmc
    var gc = [], gi = [], i;
    for (i = 0; i < cb.soNv; i++) { gc.push(0); gi.push(0); }
    for (i = 0; i < cb.rows.length; i++) {
      var r = cb.rows[i], g = r.dat / Nmc;
      gc[r.p] += g; gi[r.p] += r.gio * g / (g + r.khac);
    }
    var hs = []; for (i = 0; i < cb.soNv; i++) hs.push(gi[i] > 0 ? gc[i] / gi[i] * 100 : 0);
    return hs;
  };
  var mocTu = function(cb, Nmc) { return pv(hsTu(cb, Nmc), DM_PV); };
  var tk4 = function(mc, N) {                            // [thấp P25, giữa, khá P75, cao nhất]
    var hs = hsTu(chuanBi(mc, N), N[mc]);
    return [pv(hs, 0.25), pv(hs, 0.5), pv(hs, DM_PV), hs.length ? Math.max.apply(null, hs) : 0];
  };
  var dsMC = Object.keys(theoCD);
  var N0 = {}; Object.keys(dmHT).forEach(function(k) { N0[k] = dmHT[k]; });

  // Người ĐỘT BIẾN: hiệu suất > 1,5 × người khá của NHỮNG NGƯỜI CÒN LẠI (không tính chính họ – nếu tính thì người cao nhất
  // kéo mốc lên và lúc bị coi lúc không, số liệu nhảy) -> bỏ khỏi thống kê công đoạn đó. Chỉ xét khi công đoạn có ≥ 4 người.
  dsMC.forEach(function(mc) {
    var cb = chuanBi(mc, N0), hs = hsTu(cb, N0[mc]);
    if (hs.length < 4) return;
    hs.forEach(function(h, i) {
      var khac = hs.slice(0, i).concat(hs.slice(i + 1)), kha = pv(khac, DM_PV);
      if (kha > 0 && h > DM_DOT_BIEN * kha) (dotBien[mc] = dotBien[mc] || {})[cb.dsNv[i]] = h;
    });
  });
  var tk0 = {}; dsMC.forEach(function(mc) { tk0[mc] = tk4(mc, N0); });

  // Giải cùng lúc mọi công đoạn: mỗi vòng, với từng công đoạn, dò định mức (chia đôi trên thang log) để người khá = 90%,
  // giữ định mức các công đoạn khác như vòng trước. Lặp tới khi ổn định. CHỈ NÂNG, không hạ (định mức chặt thường do người mới).
  var canChinh = dsMC.filter(function(mc) { return tk0[mc][2] > 0; });
  var N = {}; Object.keys(N0).forEach(function(k) { N[k] = N0[k]; });
  var CHAN = 4;                                          // chặn an toàn: không gợi ý quá ×4 định mức đang dùng
  var giai = function(ds) {
    for (var vong = 0; vong < 60; vong++) {
      var doiNhat = 0;
      ds.forEach(function(mc) {
        var cu = N[mc], cb = chuanBi(mc, N);
        var lo = Math.log(Math.max(cu / 1.5, N0[mc])), hi = Math.log(Math.min(cu * 1.5, N0[mc] * CHAN));
        for (var it = 0; it < 30; it++) {
          var giua = (lo + hi) / 2;
          if (mocTu(cb, Math.exp(giua)) > DM_MOC) lo = giua; else hi = giua;   // định mức cao hơn -> hiệu suất thấp hơn
        }
        N[mc] = Math.sqrt(cu * Math.exp((lo + hi) / 2));
        doiNhat = Math.max(doiNhat, Math.abs(N[mc] / cu - 1));
      });
      if (doiNhat < 0.0005) break;
    }
  };
  giai(canChinh);
  var NR = {}; Object.keys(N0).forEach(function(k) { NR[k] = N0[k]; });
  canChinh.forEach(function(mc) {                       // không cần nâng (giải ra = định mức đang dùng) thì giữ số cũ, khỏi làm tròn
    if (N[mc] > N0[mc] * 1.001) NR[mc] = Math.max(N0[mc], dmLamTron_(N[mc]));
  });
  // Chỉ gợi ý khi cần: nếu giữ định mức cũ (các công đoạn khác vẫn đổi) mà người khá vẫn sát mốc thì thôi
  canChinh.forEach(function(mc) {
    if (NR[mc] === N0[mc]) return;
    var moi = NR[mc]; NR[mc] = N0[mc];
    if (Math.abs(mocTu(chuanBi(mc, NR), NR[mc]) - DM_MOC) > DM_SAT) NR[mc] = moi;
  });

  var ketqua = dsMC.map(function(mc) {
    var nguoi = {}; theoCD[mc].forEach(function(o) { if (!(dotBien[mc] && o.nv in dotBien[mc])) nguoi[o.nv] = 1; });
    var so = Object.keys(nguoi).length, a = tk0[mc], kha = a[2], nhan;
    if (kha > 110) nhan = 'do';
    else if (kha > 95) nhan = 'vang';
    else if (kha > DM_MOC + DM_SAT) nhan = 'nhe';
    else if (kha >= DM_MOC - DM_SAT) nhan = 'sat';
    else nhan = 'chat';
    var goiY = NR[mc] !== N0[mc] ? NR[mc] : 0, b = tk4(mc, NR);   // "sau" = khi áp TẤT CẢ gợi ý
    var c = cdMa[mc] || {};
    return {
      maCD: mc, tenCD: c.TenCD || mc, maXuong: c.MaXuong || '', dinhMuc: N0[mc], soCoData: so,
      thap: r2_(a[0]), trungVi: r2_(a[1]), kha: r2_(kha), caoNhat: r2_(a[3]), nhan: nhan, itNguoi: so < DM_IT_NGUOI,
      dotBien: Object.keys(dotBien[mc] || {}).map(function(nv) { return { ten: tenNV[nv] || nv, hs: r2_(dotBien[mc][nv]) }; }),
      dmGoiY: goiY, chinh: goiY ? Math.round((goiY / N0[mc] - 1) * 100) : 0,
      khaSau: r2_(b[2]), trungViSau: r2_(b[1]), caoNhatSau: r2_(b[3]),
      chamTran: !!goiY && N[mc] >= N0[mc] * CHAN * 0.999
    };
  });

  // Áp hết gợi ý thì bao nhiêu người đổi hạng (tháng đang làm, theo Bảng KPI)
  var doiHang = null, kyHT = kyVN_();
  if (thangCanLay.indexOf(kyHT) >= 0 && ketqua.some(function(x) { return x.dmGoiY; })) {
    var maQL = mapQuanLy_(), dsNV = dt.nhansu.filter(function(x) {
      return !maQL[String(x.MaNV).trim()] && (me.vaiTro !== 'TP' || x.MaXuong === me.xuong);
    });
    var hang = function() {
      var o = {}; dsNV.forEach(function(x) { var k = kpiThang_(x.MaNV, kyHT, dt); if (k) o[x.MaNV] = loaiCo_(x.MaNV, kyHT, k.tong); }); return o;
    };
    var truoc = hang(), luu = {};
    ketqua.forEach(function(x) { if (x.dmGoiY) { luu[x.maCD] = dt.idxDM[x.maCD]; dt.idxDM[x.maCD] = x.dmGoiY; } });
    var sau = hang();
    Object.keys(luu).forEach(function(mc) { dt.idxDM[mc] = luu[mc]; });
    var chuyen = {}, so2 = 0;
    Object.keys(truoc).forEach(function(nv) {
      if (sau[nv] && sau[nv] !== truoc[nv]) { so2++; var kk = truoc[nv] + ' → ' + sau[nv]; chuyen[kk] = (chuyen[kk] || 0) + 1; }
    });
    doiHang = { soNguoi: Object.keys(truoc).length, soDoi: so2, chuyen: chuyen };
  }

  var thuTuXuong = {}; doc_('PhongBan').forEach(function(p, i) { thuTuXuong[p.MaXuong] = i; });
  var uu = { do: 0, vang: 1, nhe: 2, chat: 3, sat: 4 };
  ketqua.sort(function(a, b) {
    var xa = thuTuXuong[a.maXuong] == null ? 999 : thuTuXuong[a.maXuong], xb = thuTuXuong[b.maXuong] == null ? 999 : thuTuXuong[b.maXuong];
    if (xa !== xb) return xa - xb;
    if (uu[a.nhan] !== uu[b.nhan]) return uu[a.nhan] - uu[b.nhan];
    return Math.abs(b.kha - DM_MOC) - Math.abs(a.kha - DM_MOC);
  });
  if (me.vaiTro === 'TP') ketqua = ketqua.filter(function(k) { return k.maXuong === me.xuong; });
  var dsMoi = Object.keys(boMoi).map(function(nv) { return { ten: tenNV[nv] || nv, tu: batDau[nv] || '' }; })
    .sort(function(a, b) { return a.ten < b.ten ? -1 : 1; });
  return sach_({ ok:true, kieu:kieu, giaTri:giaTri, thang: thangCanLay, moc:DM_MOC, pv:DM_PV, sat:DM_SAT, itNguoi:DM_IT_NGUOI,
    dotBienHeSo: DM_DOT_BIEN, moiThang: DM_MOI_THANG, ds:ketqua, nguoiMoi: dsMoi, soHocViecBo: Object.keys(boHV).length,
    doiHang: doiHang, apTu: ngayApDM_() });
}

/* CHẠY TAY 1 LẦN (21/10): đưa các lần đổi định mức trong tháng này về quy tắc mới – cả tháng tính theo định mức đang dùng.
   Cắt mọi đoạn LichSuDinhMuc trùng tháng này (kể cả tháng đã chốt – khi đó cần Chốt bù). Không đổi tháng trước. */
function AP_DINH_MUC_CA_THANG() {
  if (!noiBo_(arguments[0])) return chanWeb_('AP_DINH_MUC_CA_THANG');
  khoa_();
  var ky = kyVN_(), dau = ky + '-01';
  if (!ss_().getSheetByName(LSDM_SHEET)) { Logger.log('Chưa có sheet ' + LSDM_SHEET + ' – không có gì để đổi.'); return; }
  var ma = {};
  doc_(LSDM_SHEET).forEach(function(x) { if (ngayVN_(x.DenNgay) >= dau) ma[x.MaCD] = 1; });
  Object.keys(ma).forEach(function(mc) { catLichSuDM_(mc, dau); });
  xong_();
  Logger.log(nhacChotBuDM_('Đã áp định mức đang dùng cho cả tháng ' + ky + ': ' + Object.keys(ma).length + ' công đoạn. Mở lại Bảng KPI / Phân tích định mức để thấy số mới.'));
  return Object.keys(ma).length;
}
/* =====================================================================
   HỒ SƠ BẮT BUỘC (22/10, chủ dự án): đăng nhập mà hồ sơ còn thiếu thì phải điền đủ mới dùng tiếp.
   - Áp cho MỌI tài khoản trừ admin (chủ sở hữu, ban điều hành) – chủ dự án 22/10. Có mã nhân viên: hồ sơ NhanSu
     "Đang làm"; không gắn mã nhân viên (trợ lý BĐH, nhân sự, bếp, nhóm báo cơm…): sheet HoSoVanPhong.
   - 6 mục: SĐT, CCCD, địa chỉ, SĐT khẩn cấp, năm sinh, ngày vào làm. Chỉ hỏi mục đang TRỐNG / SAI định dạng;
     điền vào mục trống thì ghi thẳng NhanSu (không cần duyệt – không đè dữ liệu cũ). Sửa mục đã có vẫn qua "Hồ sơ của tôi" (duyệt).
   ===================================================================== */
var HS_KHONG_BAT_BUOC = ['OWNER', 'ADMIN', 'NHOM', 'BEP'];   // chủ sở hữu, ban điều hành, nhóm báo cơm (dùng chung), bếp: không bắt buộc
function hsVaiTroPhai_(vt) { vt = String(vt || '').trim(); return !!vt && HS_KHONG_BAT_BUOC.indexOf(vt) < 0; }
var HS_MUC = [
  { k: 'DienThoai',  ten: 'Số điện thoại' },
  { k: 'SoCCCD',     ten: 'Số CCCD' },
  { k: 'DiaChi',     ten: 'Địa chỉ' },
  { k: 'SdtKhanCap', ten: 'SĐT người thân (khẩn cấp)' },
  { k: 'NamSinh',    ten: 'Năm sinh' },
  { k: 'NgayVaoLam', ten: 'Ngày vào làm' }
];
function hsSo_(v) { return String(v == null ? '' : v).replace(/\D/g, ''); }
/* Chuẩn hóa + kiểm tra 1 mục. Trả '' nếu không hợp lệ. coCu = giá trị đang có trong sheet (dễ dãi hơn: SĐT mất số 0 đầu) */
function hsChuan_(k, v, coCu) {
  var s = String(v == null ? '' : v).trim();
  if (v instanceof Date) s = ngayVN_(v);
  if (k === 'DienThoai' || k === 'SdtKhanCap') {
    var d = hsSo_(s);
    if (coCu && /^[1-9]\d{8}$/.test(d)) d = '0' + d;   // số lưu dạng số trong sheet bị mất số 0 đầu
    return /^0\d{9}$/.test(d) ? d : '';
  }
  if (k === 'SoCCCD') {
    var c = hsSo_(s);
    if (coCu && /^\d{11}$/.test(c)) c = '0' + c;
    return /^\d{12}$/.test(c) ? c : '';
  }
  if (k === 'DiaChi') return s.length >= 5 ? s : '';
  if (k === 'NamSinh') {
    var m = s.match(/(19|20)\d\d/), y = m ? Number(m[0]) : 0, nay = Number(homNayVN_().slice(0, 4));
    return (y >= 1950 && y <= nay - 15) ? String(y) : '';
  }
  if (k === 'NgayVaoLam') {
    var n = ngayVN_(s);
    return (/^\d{4}-\d{2}-\d{2}$/.test(n) && n >= '2000-01-01' && n <= homNayVN_()) ? n : '';
  }
  return s;
}
function hsCanDien_(nv) {                                   // hồ sơ này có phải điền không
  return !!nv && String(nv.TrangThai || '').trim() === 'Đang làm';
}
function hoSoThieu_(nv) {
  if (!hsCanDien_(nv)) return [];
  return HS_MUC.filter(function(m) { return !hsChuan_(m.k, nv[m.k], true); }).map(function(m) { return m.k; });
}
function hsCuaToi_(me) {
  if (!me) return null;
  if (me.maNV) return doc_('NhanSu').filter(function(x) { return String(x.MaNV).trim() === String(me.maNV).trim(); })[0] || null;
  return vpHoSo_(me.tk, me.vaiTroGoc || me.vaiTro, me.ten);   // ban điều hành / trợ lý / nhân sự: không có trong NhanSu
}

/* ----- HỒ SƠ VĂN PHÒNG (22/10): ban điều hành, trợ lý BĐH, hành chính nhân sự chỉ có tài khoản, không có dòng NhanSu
   (thêm vào NhanSu thì lọt vào Bảng KPI công nhân) -> lưu hồ sơ ở sheet riêng HoSoVanPhong, khóa = TenDangNhap. ----- */
var VP_SHEET = 'HoSoVanPhong', VP_VAI_TRO = ['OWNER', 'ADMIN', 'TL', 'HR'];
var VP_COT = ['TenDangNhap', 'HoTen', 'VaiTro', 'DienThoai', 'SoCCCD', 'DiaChi', 'SdtKhanCap', 'NamSinh', 'NgayVaoLam', 'CapNhat'];
function vpLa_(vt) { return VP_VAI_TRO.indexOf(String(vt || '').trim()) >= 0; }
function vpSheet_() {
  var sh = ss_().getSheetByName(VP_SHEET);
  if (!sh) {
    sh = ss_().insertSheet(VP_SHEET);
    sh.getRange(1, 1, 1, VP_COT.length).setValues([VP_COT]).setFontWeight('bold');
    sh.setFrozenRows(1);
    [4, 5, 7].forEach(function(c) { sh.getRange(2, c, sh.getMaxRows() - 1, 1).setNumberFormat('@'); });   // SĐT, CCCD giữ số 0 đầu
  }
  return sh;
}
/* Hồ sơ văn phòng của 1 tài khoản KHÔNG gắn mã nhân viên (ban điều hành, trợ lý, nhân sự, bếp, nhóm báo cơm…);
   chưa có dòng thì trả bản trống (_vp, _moi) để biết còn thiếu gì */
function vpHoSo_(tenDN, vaiTro, hoTen) {
  if (!tenDN || !String(vaiTro || '').trim()) return null;
  var x = ss_().getSheetByName(VP_SHEET) ? docAnToan_(VP_SHEET).filter(function(r) {
    return String(r.TenDangNhap).toLowerCase() === String(tenDN).toLowerCase(); })[0] : null;
  var o = { TenDangNhap: tenDN, HoTen: hoTen, VaiTro: vaiTro, TrangThai: 'Đang làm', _vp: true };
  if (x) { for (var k in x) o[k] = x[k]; o.TrangThai = 'Đang làm'; o._vp = true; } else o._moi = true;
  return o;
}

/* Gọi từ web: lưu các mục còn thiếu của chính mình */
function luuHoSoThieu(token, o) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  var nv = hsCuaToi_(me);
  if (!nv) return sach_({ ok: false, msg: 'Không tìm thấy hồ sơ của bạn.' });
  if (!hsVaiTroPhai_(me.vaiTroGoc || me.vaiTro)) return sach_({ ok: true, msg: 'Tài khoản của bạn không bắt buộc bổ sung hồ sơ.', thieu: [] });
  var thieu = hoSoThieu_(nv), loi = [], ghi = {};
  o = o || {};
  thieu.forEach(function(k) {
    var v = hsChuan_(k, o[k], false);
    if (!v) loi.push(k); else ghi[k] = v;
  });
  if (ghi.DienThoai && ghi.SdtKhanCap && ghi.DienThoai === ghi.SdtKhanCap) loi.push('SdtKhanCap');
  if (loi.length) {
    var ten = {}; HS_MUC.forEach(function(m) { ten[m.k] = m.ten; });
    return sach_({ ok: false, loi: loi, msg: 'Chưa đúng: ' + loi.map(function(k) { return ten[k]; }).join(', ') + '.' });
  }
  var bang = nv._vp ? VP_SHEET : 'NhanSu';
  if (nv._vp) {                                            // hồ sơ văn phòng: chưa có dòng thì thêm dòng
    vpSheet_();
    if (nv._moi) {
      them_(VP_SHEET, { TenDangNhap: me.tk, HoTen: me.ten, VaiTro: me.vaiTroGoc || me.vaiTro, CapNhat: new Date() });
      xaGhi_(VP_SHEET);
      nv._row = ss_().getSheetByName(VP_SHEET).getLastRow();
    } else suaO_(VP_SHEET, nv._row, 'CapNhat', new Date());
  }
  Object.keys(ghi).forEach(function(k) {
    if (k === 'DienThoai' || k === 'SoCCCD' || k === 'SdtKhanCap') suaOText_(bang, nv._row, k, ghi[k]);
    else suaO_(bang, nv._row, k, k === 'NamSinh' ? Number(ghi[k]) : ghi[k]);
  });
  ghiLog_(me, 'Tự điền hồ sơ còn thiếu', (me.maNV || me.tk) + ' — ' + Object.keys(ghi).join(', '));
  xong_();
  return sach_({ ok: true, msg: 'Đã lưu hồ sơ. Cảm ơn bạn!', thieu: [] });
}

/* Ban điều hành / nhân sự (cả nhà máy), trưởng / phó phòng (xưởng mình): ai còn thiếu hồ sơ */
function thongKeHoSoThieu(token) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  var toanBo = xemCaNhaMay_(me) || me.vaiTro === 'HR';
  if (!toanBo && me.vaiTro !== 'TP') return sach_({ ok: false, msg: 'Không có quyền.' });
  var coTK = {};
  doc_('TaiKhoan').forEach(function(t) { if (String(t.TrangThai).trim() === 'Đang dùng' && t.MaNV && hsVaiTroPhai_(t.VaiTro)) coTK[String(t.MaNV).trim()] = 1; });
  var ds = [], theoMuc = {}, du = [];                     // du = mã NV đã đủ hồ sơ (ghi chú từng dòng ở tab Nhân sự)
  HS_MUC.forEach(function(m) { theoMuc[m.k] = 0; });
  var soXet = 0;
  doc_('NhanSu').forEach(function(x) {
    if (!coTK[String(x.MaNV).trim()] || !hsCanDien_(x)) return;
    if (!toanBo && x.MaXuong !== me.xuong) return;
    soXet++;
    var t = hoSoThieu_(x);
    if (!t.length) { du.push(x.MaNV); return; }
    t.forEach(function(k) { theoMuc[k]++; });
    ds.push({ MaNV: x.MaNV, HoTen: x.HoTen, MaXuong: x.MaXuong, thieu: t });
  });
  if (me.laOwner) {                                        // tài khoản không gắn mã NV (trợ lý BĐH, nhân sự, bếp…): chỉ chủ sở hữu thấy
    doc_('TaiKhoan').forEach(function(t) {
      var vt = String(t.VaiTro).trim();
      if (String(t.TrangThai).trim() !== 'Đang dùng' || t.MaNV || !hsVaiTroPhai_(vt)) return;   // mọi tài khoản không gắn mã NV, trừ admin
      soXet++;
      var tt = hoSoThieu_(vpHoSo_(t.TenDangNhap, vt, t.HoTen));
      if (!tt.length) return;
      tt.forEach(function(k) { theoMuc[k]++; });
      ds.push({ MaNV: t.TenDangNhap, HoTen: t.HoTen, MaXuong: 'VAN_PHONG', thieu: tt });
    });
  }
  return sach_({ ok: true, soXet: soXet, soThieu: ds.length, theoMuc: theoMuc, muc: HS_MUC, ds: ds, du: du });
}

/* CHỈ CHỦ SỞ HỮU: danh sách ban điều hành, trợ lý BĐH, hành chính nhân sự (tài khoản + hồ sơ văn phòng) */
function danhSachVanPhong(token) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (!me.laOwner) return sach_({ ok: false, msg: 'Chỉ chủ sở hữu xem được.' });
  var ten = { OWNER: 'Chủ sở hữu', ADMIN: 'Ban điều hành', TL: 'Trợ lý ban điều hành', HR: 'Hành chính nhân sự' }, thuTu = { OWNER: 0, ADMIN: 1, TL: 2, HR: 3 };
  var ds = [];
  doc_('TaiKhoan').forEach(function(t) {
    var vt = String(t.VaiTro).trim();
    if (!vpLa_(vt) || String(t.TrangThai).trim() !== 'Đang dùng') return;
    var h = t.MaNV ? (doc_('NhanSu').filter(function(x) { return String(x.MaNV).trim() === String(t.MaNV).trim(); })[0] || {}) : vpHoSo_(t.TenDangNhap, vt, t.HoTen);
    var o = { tk: t.TenDangNhap, HoTen: t.HoTen, vaiTro: vt, tenVaiTro: ten[vt] || vt, batBuoc: hsVaiTroPhai_(vt),
      lanCuoi: t.LanDangNhapCuoi ? ngayVN_(t.LanDangNhapCuoi) : '', thieu: [] };
    var h2 = {}; for (var k in h) h2[k] = h[k]; h2.TrangThai = 'Đang làm'; o.thieu = hoSoThieu_(h2);
    HS_MUC.forEach(function(m) { var v = hsChuan_(m.k, h[m.k], true); o[m.k] = v || ''; });
    ds.push(o);
  });
  ds.sort(function(a, b) { return (thuTu[a.vaiTro] - thuTu[b.vaiTro]) || (a.HoTen < b.HoTen ? -1 : 1); });
  return sach_({ ok: true, ds: ds, muc: HS_MUC });
}
var KPI_BAN_MAY = '14/11/2026 13:17';   // giờ dựng Code.gs (22/10)
/* =====================================================================
   KỸ NĂNG (22/10, chủ dự án nhờ thiết kế + tham khảo chuyên gia nhân sự / đào tạo)
   - Danh mục: trưởng / phó phòng đề xuất kỹ năng của xưởng (tên, mô tả, tiêu chí đạt, công đoạn liên quan)
     -> ban điều hành duyệt + đặt trọng số A/B/C (hoặc trả lại). Sửa kỹ năng đã duyệt: bản sửa chờ duyệt lại,
     kỹ năng vẫn dùng nội dung cũ đến khi duyệt. Không xóa, chỉ "Ngừng".
   - Gán cho nhân viên: 4 cấp (ILUO) 1 Đang học · 2 Làm được · 3 Thành thạo · 4 Kèm được.
     Cấp 2 trở lên phải đạt ĐỦ tiêu chí + ghi bằng chứng kiểm tra. Trưởng / phó phòng ghi cấp 1–2 có hiệu lực ngay;
     cấp 3–4 chờ ban điều hành xác nhận. Không tự gán cho mình. Hạ cấp / thu hồi phải ghi lý do. Không ghi đè: mỗi lần là 1 dòng.
   - Điểm kỹ năng (mô phỏng, CHƯA gắn lương): trọng số (A=1, B=2, C=3) × hệ số cấp (2 = 1; 3 = 1,5; 4 = 2).
     Cấp 2 trở lên có hạn 24 tháng; hết hạn thì không tính điểm cho tới khi kiểm lại.
   ===================================================================== */
var KN_SHEET = 'KyNang', KNV_SHEET = 'KyNangNhanVien';
var KN_COT = ['MaKN', 'TenKN', 'MaXuong', 'Nhom', 'MoTa', 'TieuChi', 'CongDoan', 'LyDo', 'TrongSo', 'TrangThai', 'PhienBan', 'BanSua',
  'NguoiDeXuat', 'NgayDeXuat', 'NguoiDuyet', 'NgayDuyet', 'GhiChuDuyet'];
var KNV_COT = ['MaGN', 'MaNV', 'MaKN', 'MaXuong', 'Cap', 'CapCu', 'NgayKiem', 'NguoiKiem', 'TieuChiDat', 'BangChung', 'PhienBanKN',
  'TrangThai', 'NguoiXacNhan', 'NgayXacNhan', 'HetHan', 'LyDo', 'ThoiDiem'];
var KN_CAP = { 1: 'Đang học', 2: 'Làm được', 3: 'Thành thạo', 4: 'Kèm được' };
var KN_TRONG_SO = { A: 1, B: 2, C: 3 }, KN_HE_SO = { 1: 0, 2: 1, 3: 1.5, 4: 2 }, KN_HAN_THANG = 24;

function knSheet_(ten, cot) {
  var sh = ss_().getSheetByName(ten);
  if (!sh) {
    sh = ss_().insertSheet(ten);
    sh.getRange(1, 1, 1, cot.length).setValues([cot]).setFontWeight('bold');
    sh.setFrozenRows(1);
    sh.getRange(2, 1, sh.getMaxRows() - 1, cot.length).setNumberFormat('@');   // giữ nguyên chữ (ngày, mã) – không tự đổi sang ngày / số
  }
  return sh;
}
function knLuc_() { return Utilities.formatDate(new Date(), TZ_VN, 'yyyy-MM-dd HH:mm'); }
function knQuyen_(me) {
  if (!me) return '';
  if (me.vaiTro === 'ADMIN') return 'bdh';
  if (me.vaiTro === 'TP') return 'tp';
  if (me.vaiTro === 'HR' || me.vaiTro === 'TL') return 'xem';
  if (me.vaiTro === 'CN' && me.maNV) return 'cn';
  return '';
}
function knJson_(s, mac) { try { var v = JSON.parse(s || ''); return v == null ? mac : v; } catch (e) { return mac; } }
function knTenChuan_(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, ' ').trim();
}
function knDocKN_() { return docAnToan_(KN_SHEET); }
function knDocGN_() { return docAnToan_(KNV_SHEET); }
function knTim_(maKN) { return knDocKN_().filter(function(k) { return String(k.MaKN) === String(maKN); })[0] || null; }
function knCongNgay_(ngay, thang) {
  var p = String(ngay).split('-').map(Number), d = new Date(p[0], p[1] - 1 + thang, p[2]);
  if (d.getDate() !== p[2]) d = new Date(p[0], p[1] + thang, 0);              // 31/1 + 1 tháng -> 28/2
  return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
}

/* Kiểm tra + chuẩn hóa nội dung 1 kỹ năng (đề xuất / sửa). Trả { loi } hoặc { o } */
function knChuan_(o, me, maKNBo) {
  o = o || {};
  var r = {};
  r.TenKN = String(o.TenKN || '').replace(/\s+/g, ' ').trim();
  if (r.TenKN.length < 5 || r.TenKN.length > 80) return { loi: 'Tên kỹ năng cần 5–80 ký tự (vd. "Phun PU bóng đạt độ phủ đều").' };
  var xs = doc_('PhongBan').map(function(p) { return String(p.MaXuong); });
  r.MaXuong = String(o.MaXuong || '').trim();
  if (r.MaXuong !== '*' && xs.indexOf(r.MaXuong) < 0) return { loi: 'Chưa chọn xưởng.' };
  if (me.vaiTro === 'TP' && r.MaXuong !== '*' && r.MaXuong !== me.xuong) return { loi: 'Chỉ đề xuất kỹ năng cho xưởng của bạn.' };
  r.Nhom = String(o.Nhom || '').trim().slice(0, 40);
  r.MoTa = String(o.MoTa || '').trim();
  if (r.MoTa.length < 10 || r.MoTa.length > 500) return { loi: 'Mô tả cần 10–500 ký tự: làm việc gì, trên loại sản phẩm / máy nào.' };
  var tc = (Array.isArray(o.TieuChi) ? o.TieuChi : String(o.TieuChi || '').split('\n'))
    .map(function(x) { return String(x).replace(/^\s*(?:[-–•*+]+|\d{1,2}[.)])\s*/, '').trim(); }).filter(Boolean);   // bỏ gạch đầu dòng / "1." – giữ số trong câu ("10 cây…")
  if (tc.length < 2 || tc.length > 8) return { loi: 'Cần 2–8 tiêu chí đạt (mỗi dòng 1 tiêu chí đo / nhìn được).' };
  if (tc.some(function(x) { return x.length > 200; })) return { loi: 'Mỗi tiêu chí tối đa 200 ký tự.' };
  r.TieuChi = JSON.stringify(tc);
  var cds = doc_('CongDoan'), cdCo = {};
  cds.forEach(function(c) { if (String(c.TrangThai).trim() !== 'Ngừng' && (r.MaXuong === '*' || String(c.MaXuong) === r.MaXuong)) cdCo[String(c.MaCD)] = 1; });
  var cd = (Array.isArray(o.CongDoan) ? o.CongDoan : String(o.CongDoan || '').split(','))
    .map(function(x) { return String(x).trim(); }).filter(function(x, i, a) { return x && a.indexOf(x) === i; });
  if (!cd.length) return { loi: 'Chọn ít nhất 1 công đoạn liên quan.' };
  if (cd.some(function(x) { return !cdCo[x]; })) return { loi: 'Có công đoạn không thuộc xưởng này hoặc đã ngừng.' };
  r.CongDoan = cd.join(',');
  r.LyDo = String(o.LyDo || '').trim().slice(0, 300);
  var ten = knTenChuan_(r.TenKN);
  var trung = knDocKN_().filter(function(k) {
    return String(k.MaKN) !== String(maKNBo || '') && String(k.TrangThai).trim() !== 'Ngừng' &&
      (String(k.MaXuong) === r.MaXuong || String(k.MaXuong) === '*' || r.MaXuong === '*') && knTenChuan_(k.TenKN) === ten;
  })[0];
  if (trung) return { loi: 'Đã có kỹ năng cùng tên: "' + trung.TenKN + '".' };
  return { o: r };
}

/* Trưởng / phó phòng đề xuất (chờ duyệt); ban điều hành thêm thẳng (phải có trọng số) */
function deXuatKyNang(token, o) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  var q = knQuyen_(me);
  if (q !== 'bdh' && q !== 'tp') return sach_({ ok: false, msg: 'Chỉ trưởng / phó phòng hoặc ban điều hành được đề xuất kỹ năng.' });
  khoa_(); knSheet_(KN_SHEET, KN_COT);
  var c = knChuan_(o, me);
  if (c.loi) return sach_({ ok: false, msg: c.loi });
  var r = c.o, ts = String((o || {}).TrongSo || '').trim().toUpperCase();
  if (q === 'bdh' && !KN_TRONG_SO[ts]) return sach_({ ok: false, msg: 'Ban điều hành thêm kỹ năng thì chọn luôn trọng số A / B / C.' });
  r.MaKN = ma_('KN');
  r.TrangThai = q === 'bdh' ? 'Đã duyệt' : 'Chờ duyệt';
  r.TrongSo = q === 'bdh' ? ts : '';
  r.PhienBan = q === 'bdh' ? '1' : '0';
  r.NguoiDeXuat = me.tk; r.NgayDeXuat = knLuc_();
  if (q === 'bdh') { r.NguoiDuyet = me.tk; r.NgayDuyet = r.NgayDeXuat; }
  them_(KN_SHEET, r);
  ghiLog_(me, q === 'bdh' ? 'Thêm kỹ năng' : 'Đề xuất kỹ năng', r.MaKN + ' — ' + r.TenKN + ' (' + r.MaXuong + ')');
  return sach_(knDuLieu_(me, { ok: true, msg: q === 'bdh' ? 'Đã thêm kỹ năng.' : 'Đã gửi đề xuất – chờ ban điều hành duyệt.', MaKN: r.MaKN }));
}

/* Sửa kỹ năng. Trưởng / phó phòng: đề xuất chưa duyệt -> sửa thẳng (về Chờ duyệt);
   đã duyệt -> lưu bản sửa (BanSua) chờ duyệt lại, kỹ năng vẫn dùng nội dung cũ. Ban điều hành: sửa thẳng. */
function suaKyNang(token, maKN, o) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  var q = knQuyen_(me);
  if (q !== 'bdh' && q !== 'tp') return sach_({ ok: false, msg: 'Không có quyền.' });
  khoa_();
  var k = knTim_(maKN);
  if (!k) return sach_({ ok: false, msg: 'Không tìm thấy kỹ năng.' });
  var tt = String(k.TrangThai).trim();
  if (tt === 'Ngừng') return sach_({ ok: false, msg: 'Kỹ năng đã ngừng – không sửa được.' });
  if (q === 'tp' && !(String(k.MaXuong) === me.xuong || (String(k.MaXuong) === '*' && String(k.NguoiDeXuat) === me.tk)))
    return sach_({ ok: false, msg: 'Chỉ sửa kỹ năng của xưởng bạn.' });
  var c = knChuan_(o, me, maKN);
  if (c.loi) return sach_({ ok: false, msg: c.loi });
  var r = c.o, cot = ['TenKN', 'MaXuong', 'Nhom', 'MoTa', 'TieuChi', 'CongDoan', 'LyDo'];
  if (q === 'tp' && tt === 'Đã duyệt') {
    r.NguoiSua = me.tk; r.NgaySua = knLuc_();
    suaO_(KN_SHEET, k._row, 'BanSua', JSON.stringify(r));
    ghiLog_(me, 'Đề xuất sửa kỹ năng', k.MaKN + ' — ' + r.TenKN);
    return sach_(knDuLieu_(me, { ok: true, msg: 'Đã gửi bản sửa – chờ ban điều hành duyệt. Trong lúc chờ vẫn dùng nội dung cũ.' }));
  }
  cot.forEach(function(x) { suaO_(KN_SHEET, k._row, x, r[x]); });
  if (q === 'tp') {
    suaO_(KN_SHEET, k._row, 'TrangThai', 'Chờ duyệt');
    suaO_(KN_SHEET, k._row, 'NguoiDeXuat', me.tk); suaO_(KN_SHEET, k._row, 'NgayDeXuat', knLuc_());
  } else {
    var ts = String((o || {}).TrongSo || '').trim().toUpperCase();
    if (KN_TRONG_SO[ts]) suaO_(KN_SHEET, k._row, 'TrongSo', ts);
    if (tt === 'Đã duyệt' && r.TieuChi !== String(k.TieuChi)) suaO_(KN_SHEET, k._row, 'PhienBan', String((Number(k.PhienBan) || 1) + 1));
    suaO_(KN_SHEET, k._row, 'BanSua', '');
  }
  ghiLog_(me, 'Sửa kỹ năng', k.MaKN + ' — ' + r.TenKN);
  return sach_(knDuLieu_(me, { ok: true, msg: q === 'tp' ? 'Đã lưu – chờ ban điều hành duyệt.' : 'Đã lưu.' }));
}

/* Ban điều hành duyệt / trả lại đề xuất mới hoặc bản sửa */
function bdhDuyetKyNang(token, maKN, dongY, trongSo, ghiChu) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (knQuyen_(me) !== 'bdh') return sach_({ ok: false, msg: 'Chỉ ban điều hành duyệt kỹ năng.' });
  khoa_();
  var k = knTim_(maKN);
  if (!k) return sach_({ ok: false, msg: 'Không tìm thấy kỹ năng.' });
  ghiChu = String(ghiChu || '').trim().slice(0, 300);
  var ts = String(trongSo || '').trim().toUpperCase(), tt = String(k.TrangThai).trim(), luc = knLuc_();
  if (!dongY && ghiChu.length < 5) return sach_({ ok: false, msg: 'Trả lại thì ghi lý do để trưởng phòng sửa.' });
  var ban = knJson_(k.BanSua, null);
  if (ban && tt === 'Đã duyệt') {
    if (dongY) {
      ['TenKN', 'MaXuong', 'Nhom', 'MoTa', 'TieuChi', 'CongDoan', 'LyDo'].forEach(function(x) { suaO_(KN_SHEET, k._row, x, ban[x]); });
      if (ban.TieuChi !== String(k.TieuChi)) suaO_(KN_SHEET, k._row, 'PhienBan', String((Number(k.PhienBan) || 1) + 1));
      if (KN_TRONG_SO[ts]) suaO_(KN_SHEET, k._row, 'TrongSo', ts);
    }
    suaO_(KN_SHEET, k._row, 'BanSua', '');
    suaO_(KN_SHEET, k._row, 'GhiChuDuyet', ghiChu);
    suaO_(KN_SHEET, k._row, 'NguoiDuyet', me.tk); suaO_(KN_SHEET, k._row, 'NgayDuyet', luc);
    ghiLog_(me, dongY ? 'Duyệt bản sửa kỹ năng' : 'Trả lại bản sửa kỹ năng', k.MaKN + ' — ' + k.TenKN + (ghiChu ? ' — ' + ghiChu : ''));
    return sach_(knDuLieu_(me, { ok: true, msg: dongY ? 'Đã duyệt bản sửa.' : 'Đã trả lại bản sửa (kỹ năng giữ nội dung cũ).' }));
  }
  if (tt !== 'Chờ duyệt') return sach_({ ok: false, msg: 'Kỹ năng này không chờ duyệt.' });
  if (dongY && !KN_TRONG_SO[ts]) return sach_({ ok: false, msg: 'Chọn trọng số A / B / C trước khi duyệt.' });
  suaO_(KN_SHEET, k._row, 'TrangThai', dongY ? 'Đã duyệt' : 'Trả lại');
  if (dongY) { suaO_(KN_SHEET, k._row, 'TrongSo', ts); suaO_(KN_SHEET, k._row, 'PhienBan', '1'); }
  suaO_(KN_SHEET, k._row, 'GhiChuDuyet', ghiChu);
  suaO_(KN_SHEET, k._row, 'NguoiDuyet', me.tk); suaO_(KN_SHEET, k._row, 'NgayDuyet', luc);
  ghiLog_(me, dongY ? 'Duyệt kỹ năng' : 'Trả lại kỹ năng', k.MaKN + ' — ' + k.TenKN + (dongY ? ' (trọng số ' + ts + ')' : ' — ' + ghiChu));
  return sach_(knDuLieu_(me, { ok: true, msg: dongY ? 'Đã duyệt kỹ năng.' : 'Đã trả lại cho trưởng phòng.' }));
}

/* Ngừng kỹ năng (không xóa – giữ lịch sử). Trưởng / phó phòng chỉ rút được đề xuất chưa duyệt của xưởng mình. */
function ngungKyNang(token, maKN, lyDo) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  var q = knQuyen_(me);
  if (q !== 'bdh' && q !== 'tp') return sach_({ ok: false, msg: 'Không có quyền.' });
  khoa_();
  var k = knTim_(maKN);
  if (!k) return sach_({ ok: false, msg: 'Không tìm thấy kỹ năng.' });
  var tt = String(k.TrangThai).trim();
  if (tt === 'Ngừng') return sach_(knDuLieu_(me, { ok: true, msg: 'Kỹ năng đã ngừng từ trước.' }));
  if (q === 'tp' && !((tt === 'Chờ duyệt' || tt === 'Trả lại') && (String(k.MaXuong) === me.xuong || String(k.NguoiDeXuat) === me.tk)))
    return sach_({ ok: false, msg: 'Kỹ năng đã duyệt chỉ ban điều hành ngừng được.' });
  lyDo = String(lyDo || '').trim().slice(0, 300);
  var soNguoi = knHienTai_(knDocGN_()).filter(function(g) { return String(g.MaKN) === String(maKN); }).length;
  if (soNguoi && lyDo.length < 5) return sach_({ ok: false, msg: 'Đang có ' + soNguoi + ' người được gán kỹ năng này – ghi lý do ngừng.' });
  suaO_(KN_SHEET, k._row, 'TrangThai', 'Ngừng');
  suaO_(KN_SHEET, k._row, 'BanSua', '');
  if (lyDo) suaO_(KN_SHEET, k._row, 'GhiChuDuyet', lyDo);
  ghiLog_(me, q === 'tp' ? 'Rút đề xuất kỹ năng' : 'Ngừng kỹ năng', k.MaKN + ' — ' + k.TenKN + (lyDo ? ' — ' + lyDo : ''));
  return sach_(knDuLieu_(me, { ok: true, msg: q === 'tp' ? 'Đã rút đề xuất.' : 'Đã ngừng kỹ năng (lịch sử vẫn giữ, không còn tính điểm).' }));
}

/* Dòng gán đang có hiệu lực (Đã xác nhận) – mỗi người × kỹ năng 1 dòng */
function knHienTai_(gn) { return gn.filter(function(g) { return String(g.TrangThai).trim() === 'Đã xác nhận'; }); }
function knCua_(gn, maNV, maKN, tt) {
  return gn.filter(function(g) { return String(g.MaNV) === String(maNV) && String(g.MaKN) === String(maKN) && String(g.TrangThai).trim() === tt; });
}

/* Trưởng / phó phòng (xưởng mình) hoặc ban điều hành ghi kết quả kiểm tra kỹ năng cho 1 người */
function ganKyNang(token, o) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  var q = knQuyen_(me);
  if (q !== 'bdh' && q !== 'tp') return sach_({ ok: false, msg: 'Chỉ trưởng / phó phòng hoặc ban điều hành được gán kỹ năng.' });
  o = o || {};
  khoa_(); knSheet_(KNV_SHEET, KNV_COT);
  var nv = doc_('NhanSu').filter(function(x) { return String(x.MaNV).trim() === String(o.maNV || '').trim(); })[0];
  if (!nv || String(nv.TrangThai).trim() === 'Nghỉ việc') return sach_({ ok: false, msg: 'Không tìm thấy nhân viên đang làm.' });
  if (me.maNV && String(me.maNV) === String(nv.MaNV)) return sach_({ ok: false, msg: 'Không tự gán kỹ năng cho chính mình – nhờ ban điều hành.' });
  if (q === 'tp' && String(nv.MaXuong) !== me.xuong) return sach_({ ok: false, msg: 'Chỉ gán kỹ năng cho người trong xưởng bạn.' });
  if (q === 'tp' && String(nv.laTP).toUpperCase() === 'TRUE') return sach_({ ok: false, msg: 'Kỹ năng của trưởng / phó phòng do ban điều hành xác nhận.' });
  var k = knTim_(o.maKN);
  if (!k || String(k.TrangThai).trim() !== 'Đã duyệt') return sach_({ ok: false, msg: 'Kỹ năng chưa được ban điều hành duyệt (hoặc đã ngừng).' });
  if (String(k.MaXuong) !== '*' && String(k.MaXuong) !== String(nv.MaXuong)) return sach_({ ok: false, msg: 'Kỹ năng này thuộc xưởng khác.' });
  var cap = Number(o.cap);
  if (!KN_CAP[cap]) return sach_({ ok: false, msg: 'Chọn cấp 1–4.' });
  var ngay = String(o.ngayKiem || '').trim(), hn = homNayVN_();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ngay) || ngay > hn) return sach_({ ok: false, msg: 'Ngày kiểm tra không hợp lệ (không được sau hôm nay).' });
  var vao = ngayVN_(nv.NgayVaoLam);
  if (/^\d{4}-\d{2}-\d{2}$/.test(vao) && vao <= hn && ngay < vao) return sach_({ ok: false, msg: 'Ngày kiểm tra trước ngày vào làm (' + vao + ').' });
  var tc = knJson_(k.TieuChi, []), dat = (Array.isArray(o.tieuChiDat) ? o.tieuChiDat : []).map(Number)
    .filter(function(i, j, a) { return i >= 0 && i < tc.length && a.indexOf(i) === j; }).sort();
  var bc = String(o.bangChung || '').trim().slice(0, 500), lyDo = String(o.lyDo || '').trim().slice(0, 300);
  var gn = knDocGN_(), cu = knCua_(gn, nv.MaNV, k.MaKN, 'Đã xác nhận')[0], capCu = cu ? Number(cu.Cap) : 0;
  if (cap >= 2 && dat.length < tc.length) return sach_({ ok: false, msg: 'Chưa đạt đủ ' + tc.length + ' tiêu chí – chỉ ghi được cấp 1 (Đang học).' });
  if (cap >= 2 && bc.length < 5) return sach_({ ok: false, msg: 'Ghi bằng chứng kiểm tra (vd. mã lô / sản phẩm đã kiểm, kết quả).' });
  if (cap < capCu && lyDo.length < 5) return sach_({ ok: false, msg: 'Hạ cấp (' + capCu + ' → ' + cap + ') thì ghi lý do.' });
  var ngay1 = cap === capCu && cu && String(cu.NgayKiem) === ngay;
  if (ngay1) return sach_({ ok: false, msg: 'Người này đã ở cấp ' + cap + ' (kiểm ngày ' + ngay + ').' });
  var thang = q === 'bdh' || cap <= 2 || cap <= capCu;           // cấp 3–4 do trưởng / phó phòng nâng -> chờ ban điều hành
  var luc = knLuc_(), maGN = ma_('GN');
  knCua_(gn, nv.MaNV, k.MaKN, 'Chờ xác nhận').forEach(function(g) { suaO_(KNV_SHEET, g._row, 'TrangThai', 'Hủy'); });
  if (thang && cu) suaO_(KNV_SHEET, cu._row, 'TrangThai', 'Thay thế');
  them_(KNV_SHEET, {
    MaGN: maGN, MaNV: nv.MaNV, MaKN: k.MaKN, MaXuong: nv.MaXuong, Cap: String(cap), CapCu: String(capCu), NgayKiem: ngay, NguoiKiem: me.tk,
    TieuChiDat: JSON.stringify(dat), BangChung: bc, PhienBanKN: String(k.PhienBan || '1'), TrangThai: thang ? 'Đã xác nhận' : 'Chờ xác nhận',
    NguoiXacNhan: thang ? me.tk : '', NgayXacNhan: thang ? luc : '', HetHan: cap >= 2 ? knCongNgay_(ngay, KN_HAN_THANG) : '', LyDo: lyDo, ThoiDiem: luc
  });
  ghiLog_(me, 'Gán kỹ năng', nv.MaNV + ' ' + nv.HoTen + ' — ' + k.TenKN + ': cấp ' + capCu + ' → ' + cap + (thang ? '' : ' (chờ BĐH xác nhận)'));
  return sach_(knDuLieu_(me, { ok: true, cho: !thang, MaGN: maGN,
    msg: thang ? 'Đã ghi: ' + nv.HoTen + ' – ' + KN_CAP[cap] + '.' : 'Đã gửi – cấp ' + cap + ' (' + KN_CAP[cap] + ') chờ ban điều hành xác nhận.' }));
}

/* Ban điều hành xác nhận / từ chối cấp 3–4 trưởng phòng gửi lên */
function bdhXacNhanKyNang(token, maGN, dongY, lyDo) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (knQuyen_(me) !== 'bdh') return sach_({ ok: false, msg: 'Chỉ ban điều hành xác nhận.' });
  khoa_();
  var gn = knDocGN_(), g = gn.filter(function(x) { return String(x.MaGN) === String(maGN); })[0];
  if (!g || String(g.TrangThai).trim() !== 'Chờ xác nhận') return sach_({ ok: false, msg: 'Không còn chờ xác nhận (có thể đã được xử lý).' });
  lyDo = String(lyDo || '').trim().slice(0, 300);
  if (!dongY && lyDo.length < 5) return sach_({ ok: false, msg: 'Từ chối thì ghi lý do.' });
  var k = knTim_(g.MaKN);
  if (dongY && (!k || String(k.TrangThai).trim() !== 'Đã duyệt')) return sach_({ ok: false, msg: 'Kỹ năng đã ngừng – không xác nhận được.' });
  if (dongY) knCua_(gn, g.MaNV, g.MaKN, 'Đã xác nhận').forEach(function(c) { suaO_(KNV_SHEET, c._row, 'TrangThai', 'Thay thế'); });
  suaO_(KNV_SHEET, g._row, 'TrangThai', dongY ? 'Đã xác nhận' : 'Từ chối');
  suaO_(KNV_SHEET, g._row, 'NguoiXacNhan', me.tk); suaO_(KNV_SHEET, g._row, 'NgayXacNhan', knLuc_());
  if (lyDo) suaO_(KNV_SHEET, g._row, 'LyDo', lyDo);
  ghiLog_(me, dongY ? 'Xác nhận kỹ năng' : 'Từ chối kỹ năng', g.MaNV + ' — ' + (k ? k.TenKN : g.MaKN) + ' cấp ' + g.Cap + (lyDo ? ' — ' + lyDo : ''));
  return sach_(knDuLieu_(me, { ok: true, msg: dongY ? 'Đã xác nhận.' : 'Đã từ chối.' }));
}

/* Thu hồi kỹ năng đang có (lỗi chất lượng lặp lại, gian lận khi kiểm…) – phải có lý do */
function thuHoiKyNang(token, maNV, maKN, lyDo) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  var q = knQuyen_(me);
  if (q !== 'bdh' && q !== 'tp') return sach_({ ok: false, msg: 'Không có quyền.' });
  khoa_();
  var gn = knDocGN_(), cu = knCua_(gn, maNV, maKN, 'Đã xác nhận')[0];
  if (!cu) return sach_({ ok: false, msg: 'Người này chưa có kỹ năng này.' });
  if (q === 'tp' && String(cu.MaXuong) !== me.xuong) return sach_({ ok: false, msg: 'Chỉ thu hồi trong xưởng bạn.' });
  if (me.maNV && String(me.maNV) === String(maNV)) return sach_({ ok: false, msg: 'Không tự thu hồi kỹ năng của mình.' });
  lyDo = String(lyDo || '').trim().slice(0, 300);
  if (lyDo.length < 5) return sach_({ ok: false, msg: 'Ghi lý do thu hồi.' });
  suaO_(KNV_SHEET, cu._row, 'TrangThai', 'Thu hồi');
  suaO_(KNV_SHEET, cu._row, 'LyDo', lyDo);
  suaO_(KNV_SHEET, cu._row, 'NguoiXacNhan', me.tk); suaO_(KNV_SHEET, cu._row, 'NgayXacNhan', knLuc_());
  knCua_(gn, maNV, maKN, 'Chờ xác nhận').forEach(function(g) { suaO_(KNV_SHEET, g._row, 'TrangThai', 'Hủy'); });
  ghiLog_(me, 'Thu hồi kỹ năng', maNV + ' — ' + maKN + ' — ' + lyDo);
  return sach_(knDuLieu_(me, { ok: true, msg: 'Đã thu hồi.' }));
}

/* Điểm kỹ năng của từng người (mô phỏng – chưa gắn lương): chỉ tính kỹ năng còn duyệt, còn hạn */
function knDiem_(kn, gnHT, hn) {
  var ts = {}; kn.forEach(function(k) { if (String(k.TrangThai).trim() === 'Đã duyệt') ts[String(k.MaKN)] = KN_TRONG_SO[String(k.TrongSo)] || 0; });
  var d = {};
  gnHT.forEach(function(g) {
    var w = ts[String(g.MaKN)], h = ngayVN_(g.HetHan);
    if (!w || (h && h < hn)) return;
    d[g.MaNV] = (d[g.MaNV] || 0) + w * (KN_HE_SO[Number(g.Cap)] || 0);
  });
  return d;
}

/* Đọc dữ liệu tab Kỹ năng theo quyền */
function layKyNang(token) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (!knQuyen_(me)) return sach_({ ok: false, msg: 'Không có quyền.' });
  return sach_(knDuLieu_(me, { ok: true }));
}
/* Dữ liệu tab Kỹ năng theo quyền, gộp vào o. Các hàm ghi trả kèm luôn (khỏi gọi tải lại lần 2 – nhanh hơn, không lệch) */
function knDuLieu_(me, o) {
  var q = knQuyen_(me);
  var hn = homNayVN_(), kn = knDocKN_(), gn = knDocGN_();
  var xuongCua = {}; doc_('NhanSu').forEach(function(x) { xuongCua[String(x.MaNV)] = String(x.MaXuong); });
  var nvCua = function(g) {
    if (q === 'bdh' || q === 'xem') return true;
    if (q === 'tp') return String(g.MaXuong) === me.xuong || xuongCua[String(g.MaNV)] === me.xuong;
    return String(g.MaNV) === String(me.maNV);
  };
  var dsKN = kn.filter(function(k) {
    var x = String(k.MaXuong), tt = String(k.TrangThai).trim();
    if (q === 'bdh' || q === 'xem') return true;
    if (q === 'tp') return x === me.xuong || x === '*' && (tt === 'Đã duyệt' || String(k.NguoiDeXuat) === me.tk);
    return tt === 'Đã duyệt' && (x === '*' || x === String(me.xuong || xuongCua[String(me.maNV)] || ''));
  }).map(function(k) {
    var o = {}; KN_COT.forEach(function(c) { o[c] = k[c] == null ? '' : String(k[c]); });
    o.TieuChi = knJson_(k.TieuChi, []); o.BanSua = knJson_(k.BanSua, null);
    if (q === 'cn') { delete o.LyDo; delete o.GhiChuDuyet; delete o.BanSua; }
    return o;
  });
  var giu = { 'Đã xác nhận': 1, 'Chờ xác nhận': 1, 'Từ chối': 1, 'Thu hồi': 1 };
  var dsGN = gn.filter(function(g) { return giu[String(g.TrangThai).trim()] && nvCua(g); }).map(function(g) {
    var o = {}; KNV_COT.forEach(function(c) { o[c] = g[c] == null ? '' : String(g[c]); });
    o.Cap = Number(g.Cap) || 0; o.CapCu = Number(g.CapCu) || 0; o.TieuChiDat = knJson_(g.TieuChiDat, []);
    o.HetHan = ngayVN_(g.HetHan); o.hetHan = !!o.HetHan && o.HetHan < hn;
    return o;
  });
  var ht = knHienTai_(gn), diem = knDiem_(kn, ht, hn);
  if (q === 'cn') { var dm = {}; dm[me.maNV] = diem[me.maNV] || 0; diem = dm; }
  else if (q === 'tp') Object.keys(diem).forEach(function(m) { if (xuongCua[m] !== me.xuong) delete diem[m]; });
  // Công nhân: ai trong xưởng "Kèm được" từng kỹ năng (để biết hỏi ai học) – chỉ tên, không có điểm
  var kem = {};
  if (q === 'cn') {
    var ten = {}; doc_('NhanSu').forEach(function(x) { ten[String(x.MaNV)] = x.HoTen; });
    ht.forEach(function(g) { if (Number(g.Cap) === 4 && xuongCua[String(g.MaNV)] === xuongCua[String(me.maNV)] && String(g.MaNV) !== String(me.maNV))
      (kem[String(g.MaKN)] = kem[String(g.MaKN)] || []).push(ten[String(g.MaNV)] || g.MaNV); });
  }
  var tenTK = {}; doc_('TaiKhoan').forEach(function(t) { tenTK[String(t.TenDangNhap)] = t.HoTen; });
  var can = {}; dsKN.forEach(function(k) { ['NguoiDeXuat', 'NguoiDuyet'].forEach(function(c) { if (k[c]) can[k[c]] = tenTK[k[c]] || k[c]; }); });
  dsGN.forEach(function(g) { ['NguoiKiem', 'NguoiXacNhan'].forEach(function(c) { if (g[c]) can[g[c]] = tenTK[g[c]] || g[c]; }); });
  var kq = { quyen: q, kn: dsKN, gn: dsGN, diem: diem, kem: kem, ten: can, cap: KN_CAP, trongSo: KN_TRONG_SO, heSo: KN_HE_SO,
    hanThang: KN_HAN_THANG, homNay: hn, toi: me.maNV || '', xuong: me.xuong || '' };
  for (var c in kq) o[c] = kq[c];
  return o;
}
/* =====================================================================
   QUY TRÌNH SẢN XUẤT (31/10, chủ dự án chọn phương án C + mảnh tải sau)
   - Giai đoạn 1: CHỈ tài khoản chủ sở hữu (OWNER) xem / sửa. Mọi hàm ở đây tự kiểm phiên + quyền ngay đầu.
   - Quy trình: mỗi công đoạn có Nhánh (Ngọn / Chuôi / Chung / Nối…) + Bước (1, 2, 3…). Công đoạn trước tự suy
     từ nhánh + bước (qtCanh_), hoặc ghi tay ở cột Truoc. Luồng bán thành phẩm giữa các xưởng: dòng Loai = XUONG.
   - Chưa lưu gì thì dùng quy trình nháp QT_NHAP (Claude soạn từ tên 195 công đoạn + 3 file chủ dự án gửi).
   - Phân tích (tính ở trình duyệt): giờ chuẩn = sản lượng ÷ định mức; CN cần = giờ chuẩn/ngày × mục tiêu ÷ (giờ × hiệu suất).
   ===================================================================== */
var QT_SHEET = 'QuyTrinh';
var QT_COT = ['Loai', 'Ma', 'MaXuong', 'Nhanh', 'Buoc', 'Truoc', 'GhiChu', 'NguoiSua', 'ThoiDiem'];
var QT_NHANH = { CHUNG: 'Chung', NGON: 'Ngọn', CHUOI: 'Chuôi', GAY1K: 'Gậy 1 khúc', NOI: 'Nối', TIP: 'Típ', PHIP: 'Phíp', POM: 'POM',
  PK: 'Phụ kiện', DONLE: 'Đơn lẻ', LAMLAI: 'Làm lại / sửa', HOTRO: 'Hỗ trợ', CHUAXEP: 'Chưa xếp' };
var QT_NHANH_DONG = { NGON: 1, CHUOI: 1, GAY1K: 1 };          // nhánh chảy qua / gộp vào "Chung"
var QT_NHANH_NGOAI = { LAMLAI: 1, HOTRO: 1, CHUAXEP: 1 };      // không nằm trên dòng chảy (vẫn tính tải)
var QT_CAI_DAT = { gioCoMat: 8, hieuSuat: 0.85, mucTieu: 137, soNgay: 30, slThang: 9000, ngayThang: 26, slNay: 0 };   // 01/11: mục tiêu theo sp/tháng (chủ dự án), slNay 0 = tự đo theo đóng gói thành phẩm;   // mục tiêu 137% = nhu cầu theo đơn tháng 10 (đóng gói ~250/ngày + hàng thiếu tăng ~92/ngày) – chuyên gia vận hành 31/10
var qtCo_ = function(o, k) { return Object.prototype.hasOwnProperty.call(o, k); };   // không nhận tên đặc biệt (__proto__, constructor…)
var QT_XUONG_NHAP = [
  ['PHOICB', 'PHOITHO', 'Phôi 60 (ngọn + chuôi)'], ['PHOITHO', 'NGONTARO', 'Phôi ngọn'], ['PHOITHO', 'SON', 'Phôi chuôi, nối, gậy 1 khúc (60…)'],
  ['NGONTARO', 'HT', 'Ngọn đã taro ren (Ngọn…)'], ['CNC', 'NGONTIP', 'Típ, phíp (CNCTip, CNCPhip)'], ['SON', 'INUV', 'Chuôi / nối đã sơn (S…)'],
  ['INUV', 'HT', 'Chuôi / nối đã in UV (UV…)'], ['NGONTIP', 'HT', 'Ngọn đã làm đầu'], ['HT', 'DG', 'Gậy, ngọn, nối hoàn thiện (HT…)'],
  ['NGONTARO', 'PHOITHO', 'POM các loại (chuôi 87, ngọn 85, 65/75, 30, đáy chuôi)'], ['NGONTIP', 'DG', 'Ngọn bán lẻ (đi thẳng đóng gói)'], ['CNC', 'SON', 'Đầu gậy lết'], ['CNC', 'DG', 'Tip bán lẻ'], ['HT', 'NGONTIP', 'Ngọn chờ làm đầu (Hoàn thiện giao)']];   // 14/11 (chủ dự án): ngọn Taro → Hoàn thiện → Ngọn Tip → trả Hoàn thiện → Đóng gói   // 01/11: nhánh POM + ngọn lẻ (chủ dự án)
/* Luồng chủ dự án báo thêm sau khi có thể đã lưu: [từ, đến, BTP, ngày báo] – bổ sung vào bản lưu cũ hơn ngày báo */
var QT_XUONG_THEM = [['NGONTARO', 'PHOITHO', QT_XUONG_NHAP[9][2], '2026-11-01'], ['NGONTIP', 'DG', QT_XUONG_NHAP[10][2], '2026-11-01'], ['CNC', 'SON', 'Đầu gậy lết', '2026-11-02'], ['CNC', 'DG', 'Tip bán lẻ', '2026-11-03'], ['NGONTARO', 'HT', 'Ngọn đã taro ren (Ngọn…)', '2026-11-14'], ['HT', 'NGONTIP', 'Ngọn chờ làm đầu (Hoàn thiện giao)', '2026-11-14']];
/* 14/11: luồng chủ dự án bỏ – gỡ khỏi bản đã lưu trước ngày báo */
var QT_XUONG_BO = [['NGONTARO', 'NGONTIP', '2026-11-14']];
/* Nháp: MaCD -> [nhánh, bước]. Công đoạn mới không có ở đây -> "Chưa xếp". */
var QT_NHAP = {
  // Phôi Carbon: chuẩn bị vải -> tỉa -> cuốn -> màng nilong -> rút khuôn -> kiểm / cắt / tiện / chuốt
  'CB-NHAPNVL': ['CHUNG', 1], 'CB-XAKHO-GF': ['CHUNG', 2], 'CB-XAKHO-CB': ['CHUNG', 2], 'CB-XAKHOC3': ['CHUNG', 2],
  'CB-XATAM-CAT': ['CHUNG', 3], 'CB-XATAM-CATGF': ['CHUNG', 3], 'CB-XATAM-DO': ['CHUNG', 3], 'CB-TIA-TIAVO': ['CHUNG', 4],
  'CB-TIA-NGONCB': ['NGON', 5], 'CB-TIA-NGONGF': ['NGON', 5], 'CB-CUON-NGONFULL': ['NGON', 6], 'CB-CUON-NGONMIX': ['NGON', 6], 'CB-CUON-NGONN': ['NGON', 6],
  'CB-NILONG-NGONMIX': ['NGON', 7], 'CB-NILONG-NGONFULL': ['NGON', 7], 'CB-NILONG-NGON': ['NGON', 7],
  'CB-TIA-DANHDAU': ['CHUOI', 5], 'CB-TIA-CHUOI': ['CHUOI', 6], 'CB-TIA-SOANBO': ['CHUOI', 7], 'CB-CUON-CHUOICB': ['CHUOI', 8], 'CB-NILONG-CHUOI': ['CHUOI', 9],
  'CB-RUTKHUON': ['CHUNG', 10],
  'CB-CHECK-LD': ['NGON', 11], 'CB-CHECK-KTC': ['NGON', 12], 'CB-CHECK-KTG': ['NGON', 12], 'CB-CHECK-BEMAT': ['NGON', 13], 'CB-CHECK-BEMATTR': ['NGON', 13],
  'CB-CHECK-DODD': ['NGON', 14], 'CB-CHECK-KTKT': ['NGON', 14], 'CB-CHECK-QBD': ['NGON', 15], 'CB-CHECK-CAT': ['NGON', 16],
  'CB-CNCRT-NCB': ['NGON', 17], 'CB-CNC-TIENNGON1MAY': ['NGON', 17], 'CB-CHUOT-NGONMOI': ['NGON', 18], 'CB-CHUOT-NGONCY': ['NGON', 18],
  'CB-CHUOT-DANHBONG': ['NGON', 19], 'CB-DANHBONGFULL': ['NGON', 19], 'CB-CHECK-KICHTHUOC': ['NGON', 20], 'CB-MAIDAU': ['NGON', 20], 'CB-DONGGOINGON': ['NGON', 21],
  'CB-CHUOT-CAT': ['CHUOI', 11], 'CB-CNCRT-CCB': ['CHUOI', 12], 'CB-CNC-TIENCHUOI1MAY': ['CHUOI', 12], 'CB-CHUOT-CHUOI': ['CHUOI', 13], 'CB-CHUOT-CHUOIRT': ['CHUOI', 13],
  'CB-CHECK-CHUOI': ['CHUOI', 14], 'CB-XUATHANG': ['CHUOI', 15],
  'CB-CHUOT-PHAQL': ['LAMLAI', 1], 'CB-CHUOT-PHACY': ['LAMLAI', 1], 'CB-CHUOT-CATNGONQL': ['LAMLAI', 2], 'CB-CUON-QUANLAI': ['LAMLAI', 3], 'CB-CUON-QUANLAICHUOI': ['LAMLAI', 3],
  'CN-NILONG-QL': ['LAMLAI', 4], 'CB-CHUOT-NGONQL': ['LAMLAI', 5], 'CB-CHUOT-SUANGON': ['LAMLAI', 6],
  'CB-VESINHKHUON': ['HOTRO', 1], 'CB-VSKNGON': ['HOTRO', 1],
  // Phôi Thô
  'XPT-CP-KTP': ['CHUNG', 1], 'XPT-CPN-KTN': ['CHUNG', 1], 'XPT-CB-PLP': ['CHUNG', 2], 'XPT-CP-CPCN': ['CHUNG', 3],
  'XPT-EPXN-NCBCD': ['NGON', 4], 'XPT-EPXNCB-NCBT': ['NGON', 4], 'XPT-DP-DPN': ['NGON', 5], 'XPT-CN-CNCB': ['NGON', 6],
  'XPT-TR-TRNGF': ['NGON', 7], 'XPT-TR-TRNCB': ['NGON', 7], 'XPT-MP-DTP': ['NGON', 8],
  'XPT-KCB-KCBGF': ['CHUOI', 4], 'XPT-KCB-KCBCB': ['CHUOI', 4], 'XPT-EPX-EPXC': ['CHUOI', 5], 'XPT-DF-DFC': ['CHUOI', 6], 'XPT-DS-DD': ['CHUOI', 6], 'XPT-CD-CDG': ['CHUOI', 6],
  'XPT-CNC-RC': ['CHUOI', 7], 'XPT-CNC-KRC': ['CHUOI', 7], 'XPT-TR-TRC': ['CHUOI', 8], 'XPT-CR-NRL1': ['CHUOI', 9], 'XPT-CR-NL2': ['CHUOI', 10],
  'XPT-QC-QDR': ['CHUOI', 11], 'XPT-DK-DKNK': ['CHUOI', 12], 'XPT-QB-QBW': ['CHUOI', 13], 'XPT-CM-CMKD': ['CHUOI', 14], 'XPT-C2L-C2LD': ['CHUOI', 14],
  'XPT-CR-CRSD': ['CHUOI', 15], 'XPT-MR-MNR': ['CHUOI', 16], 'XPT-CP-CPD': ['CHUOI', 17], 'XPT-VSR-VSP': ['CHUOI', 18],
  'XPT-TR-TRCRN': ['NOI', 4], 'XPT-LM-LMN': ['NOI', 5], 'XPT-CNC-CN': ['NOI', 6], 'XPT-SH-SHH': ['LAMLAI', 1],
  // CNC: típ, phíp, lết
  'CNC-PHOI-TIP': ['TIP', 1], 'CNC-DAP-LOGO': ['TIP', 2], 'CNC-DAP-LOGO-1T1D': ['TIP', 2], 'CNC-TIP-01': ['TIP', 3], 'CNC-TIP-02': ['TIP', 3],
  'CNC_TIP_DA_LON_7LOP': ['TIP', 3], 'CNC-DA-LON': ['TIP', 3],
  'CNC-PHIP': ['PHIP', 1], 'CNC-GIA-CONG-PHIP': ['PHIP', 1], 'CNC-PHIP-BAKELIT-01': ['PHIP', 1], 'CNC-PHIP-BAKELIT-02': ['PHIP', 1], 'LET-MIKA-DEN': ['PK', 1],
  // Ngọn Taro (kèm làm POM)
  'NGON-TARO-CHECKNGON': ['NGON', 1], 'NGON-TARORENTHUONG-GF': ['NGON', 2], 'NGON-TARORENDONG-GF': ['NGON', 2], 'NGON-TAROREN-CB': ['NGON', 2],
  'NGON-TARORENDONG-CARBON': ['NGON', 2], 'NGON-TAROREN-DONLE': ['NGON', 2], 'NGON-EPOXYREN': ['NGON', 3], 'NGON-EPOXYREN-COMAU': ['NGON', 3],
  'NGON-DANHGIAP-2': ['NGON', 4], 'NGON-DANHGIAP-3': ['NGON', 4], 'NGON-DANHGIAP': ['NGON', 5], 'NGON-DANHGIAP-DONLE': ['NGON', 5], 'NGON-TESTER': ['NGON', 6],
  'NGON-TARO-SXPOM': ['POM', 1], 'NGON-TARO-SXPOM1': ['POM', 1], 'NGON-TARO-SXPOM2': ['POM', 1], 'NGON-TARO-SXPOM3': ['POM', 1], 'NGON-TARO-SXPOM4': ['POM', 1],
  'NGON-TARO-RENPOM': ['POM', 2],
  // Ngọn Tip
  'NGON-LAMBANG': ['NGON', 1], 'NGONLAMBANGGLASS': ['NGON', 1], 'NGON-DANTIP': ['NGON', 2], 'NGON-TIP-LAMDAU': ['NGON', 3], 'NGON-LAMDAUGLASS': ['NGON', 3],
  'NGON-TIP-LAMDAUPHA': ['NGON', 3], 'NGON-CNCBODAU': ['NGON', 4],
  // Sơn
  'TUOT-LOT': ['CHUOI', 1], 'TUOT-LOT-1': ['GAY1K', 1], 'RAP-CHUOI': ['CHUOI', 2], 'RAP-2': ['CHUOI', 2], 'RAP-1': ['GAY1K', 2], 'CUON-WAP-BANG-DINH': ['CHUOI', 3],
  'SON': ['CHUOI', 4], 'SON-1': ['CHUOI', 4], 'SON-MAY-TU-DONG-1': ['GAY1K', 4], 'SON-MAY-TU-DONG-3': ['CHUOI', 5], 'CAT-MAT-CHUOI': ['CHUOI', 6], 'VS-LAP-POM': ['CHUOI', 7],
  'VE-SINH-1': ['HOTRO', 1],
  // In UV
  'IN': ['CHUOI', 1], 'IN-BONG': ['CHUOI', 2], 'BONG': ['CHUOI', 2],
  // Hoàn thiện: chuôi (cắt, hạ khấc, bọc da, đánh bóng) + ngọn GF + nối -> gộp, kiểm gậy
  'HT-CAT': ['CHUOI', 1], 'HT-CAT-C': ['CHUOI', 1], 'HT-HK-1': ['CHUOI', 2], 'HT-HK-2': ['CHUOI', 2], 'HT-CAT-MHK': ['CHUOI', 3],
  'HT-BOCDA-KEOCHUOI': ['CHUOI', 4], 'HT-BOCDA-KEODA': ['CHUOI', 4], 'HT-BOCDA-VAODA': ['CHUOI', 5], 'HT-BOCDA-CAT': ['CHUOI', 6], 'HT-BOCDA-MEP': ['CHUOI', 7],
  'HT-BOCDA-SUA': ['CHUOI', 8], 'HT-DANHBONG-BOC': ['CHUOI', 9], 'HT-DANHBONG-RAPNUOC': ['CHUOI', 10], 'HT-DANHBONG-RAPBUI': ['CHUOI', 10],
  'HT-DANHBONG-CN': ['CHUOI', 11], 'HT-DANHBONG-MAYTIENDAT': ['CHUOI', 12], 'HT-DANHBONG-RAP': ['NGON', 1],
  'HT-ISO-VP': ['GAY1K', 1], 'HT-DANHBONG-RAPPHOI': ['GAY1K', 2], 'HT-CAT-N': ['NOI', 1], 'HT-DANHBONG-NOI': ['NOI', 2], 'HT-ISO-N': ['NOI', 3],
  'HT-ISO-G': ['CHUNG', 13], 'HT-CHECK': ['CHUNG', 14], 'HT-ISO-TP': ['CHUNG', 15],
  // Đóng gói
  'DG-LASER-CHECKGAY': ['CHUNG', 1], 'DG-LASER-CHECKNGON': ['CHUNG', 1], 'DG-LASER': ['CHUNG', 2], 'DG-VESINH-GAY': ['CHUNG', 3], 'DG-VESINH-NGON': ['CHUNG', 3],
  'DG-VESINH-NOI': ['CHUNG', 3], 'DG-VESINH-CHECK': ['CHUNG', 4], 'DG-SEAL': ['CHUNG', 5], 'DG-DONGGOITP': ['CHUNG', 6], 'DG-DONGDAI': ['CHUNG', 7],
  'DG-LASER-PHUKIEN': ['PK', 1], 'DG-LASER-TAGGIABE': ['PK', 1], 'DG-LASER-TAGGIATO': ['PK', 1], 'DG-GAPHOP': ['PK', 1], 'DG-PHUKIEN': ['PK', 2], 'DG-HOPCOMBO': ['PK', 2],
  'DG-DONLE-CHECK': ['DONLE', 1], 'DG-DONLE-QUAY': ['DONLE', 2], 'DG-DONLE-GAY-NGON': ['DONLE', 3], 'DG-DONLE-CUSTOM': ['DONLE', 3], 'DG-DONLE-COMBO': ['DONLE', 3],
  'DG-DONLE-PHUKIEN': ['DONLE', 3], 'DG-DONLE-PHUKIEN-BAOCO': ['DONLE', 3], 'DG-HOTRO': ['HOTRO', 1]
};

function qtQuyen_(token) {
  var me = docPhien_(token);
  if (!me) return { loi: sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' }) };
  if (!me.laOwner) return { loi: sach_({ ok: false, msg: 'Tab Quy trình sản xuất đang chỉ mở cho tài khoản chủ sở hữu.' }) };
  return { me: me };
}
/* 03/11 (chủ dự án): trưởng / phó phòng xem + đề xuất sửa quy trình CHỈ xưởng mình (chủ sở hữu duyệt). -> { me, xuong: '' (chủ sở hữu) | mã xưởng } */
function qtQuyenXem_(token) {
  var me = docPhien_(token);
  if (!me) return { loi: sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' }) };
  if (me.laOwner) return { me: me, xuong: '' };
  if (me.vaiTro === 'TP' && me.xuong && String(me.xuong).trim()) return { me: me, xuong: String(me.xuong).trim() };
  return { loi: sach_({ ok: false, msg: 'Tab Quy trình sản xuất chỉ mở cho chủ sở hữu và trưởng / phó phòng xưởng.' }) };
}
function qtSheet_() {
  var sh = ss_().getSheetByName(QT_SHEET);
  if (!sh) {
    sh = ss_().insertSheet(QT_SHEET);
    sh.getRange(1, 1, 1, QT_COT.length).setValues([QT_COT]).setFontWeight('bold');
    sh.setFrozenRows(1);
    sh.getRange(2, 1, sh.getMaxRows() - 1, QT_COT.length).setNumberFormat('@');
  }
  return sh;
}

/* Công đoạn trước của từng công đoạn (cùng xưởng). ds: [{Ma, MaXuong, Nhanh, Buoc, Truoc[]}] -> { Ma: [Ma trước] }.
   Có ghi tay (Truoc) thì dùng; không thì suy: cùng nhánh bước liền trước, hoặc "Chung" nếu Chung gần hơn;
   "Chung" nhận từ cuối các nhánh dòng chảy (Ngọn / Chuôi / Gậy 1 khúc) chạy sau Chung gần nhất; không có nhánh nào thì từ Chung đó.
   (Bản giống hệt ở trình duyệt: qtCanh trong QuyTrinh.html – kiểm thử so khớp.) */
function qtCanh_(ds) {
  var theoX = {}, out = {};
  ds.forEach(function(c) { (theoX[c.MaXuong] = theoX[c.MaXuong] || []).push(c); });
  Object.keys(theoX).forEach(function(x) {
    var cs = theoX[x];
    var lonNhat = function(nh, s) {          // bước lớn nhất < s của nhánh nh
      var b = 0; cs.forEach(function(c) { if (c.Nhanh === nh && c.Buoc < s && c.Buoc > b) b = c.Buoc; }); return b;
    };
    var o = function(nh, b) { return cs.filter(function(c) { return c.Nhanh === nh && c.Buoc === b; }).map(function(c) { return c.Ma; }); };
    cs.forEach(function(c) {
      if (c.Truoc && c.Truoc.length) { out[c.Ma] = c.Truoc.slice(); return; }
      var r = [];
      if (QT_NHANH_NGOAI[c.Nhanh]) r = [];
      else if (c.Nhanh === 'CHUNG') {
        var sc = lonNhat('CHUNG', c.Buoc);
        Object.keys(QT_NHANH_DONG).forEach(function(nh) { var b = lonNhat(nh, c.Buoc); if (b && b > sc) r = r.concat(o(nh, b)); });
        if (!r.length && sc) r = o('CHUNG', sc);   // không nhánh nào chạy sau Chung gần nhất -> nối thẳng Chung đó
      } else {
        var sb = lonNhat(c.Nhanh, c.Buoc), sc2 = QT_NHANH_DONG[c.Nhanh] ? lonNhat('CHUNG', c.Buoc) : 0;
        if (sc2 > sb) r = o('CHUNG', sc2); else if (sb) r = o(c.Nhanh, sb);
      }
      out[c.Ma] = r;
    });
  });
  return out;
}
function qtLuongCap_(x) { return x.Tu === 'NGONTARO' && x.Den === 'PHOITHO'; }   // chỉ đúng luồng cấp POM (chuyên gia bảo mật 01/11: không miễn theo chữ)
/* Ngày lưu luồng gần nhất ('' nếu chưa có): luồng báo thêm sau ngày đó thì bổ sung; lưu sau ngày báo thì tôn trọng việc chủ dự án xóa */
function qtLuongCu_(dong) {
  var moi = '';
  dong.forEach(function(r) { if (String(r.Loai).trim() !== 'XUONG') return; var t = r.ThoiDiem instanceof Date ? Utilities.formatDate(r.ThoiDiem, TZ_VN, 'yyyy-MM-dd') : String(r.ThoiDiem || '').slice(0, 10); if (t > moi) moi = t; });
  return moi;
}
function qtCoVong_(canh) {
  var mau = {}, vong = '';
  var di = function(m) {
    if (vong) return; mau[m] = 1;
    (canh[m] || []).forEach(function(t) { if (vong) return; if (mau[t] === 1) vong = t + ' ↔ ' + m; else if (!mau[t] && canh[t]) di(t); });
    mau[m] = 2;
  };
  Object.keys(canh).forEach(function(m) { if (!mau[m]) di(m); });
  return vong;
}

/* Quy trình đang lưu (hoặc nháp) -> { cd: {Ma: {...}}, xuong: [...], caiDat, nhap } */
function qtDocQT_(cds) {
  var dong = docAnToan_(QT_SHEET), cd = {}, xuong = [], cai = {}, xuat = {}, luot = {}, k;
  for (k in QT_CAI_DAT) cai[k] = QT_CAI_DAT[k];
  dong.forEach(function(r) {
    var l = String(r.Loai).trim(), ma = String(r.Ma).trim();
    if (l === 'CD' && ma) cd[ma] = { Ma: ma, MaXuong: String(r.MaXuong), Nhanh: qtCo_(QT_NHANH, String(r.Nhanh)) ? String(r.Nhanh) : 'CHUAXEP',
      Buoc: Number(r.Buoc) || 1, Truoc: String(r.Truoc || '').split(',').map(function(x) { return x.trim(); }).filter(Boolean),
      GhiChu: String(r.GhiChu || ''), NguoiSua: String(r.NguoiSua || ''), ThoiDiem: r.ThoiDiem ? String(r.ThoiDiem) : '' };
    else if (l === 'XUONG' && ma.indexOf('>') > 0) xuong.push({ Tu: ma.split('>')[0], Den: ma.split('>')[1], BTP: String(r.Nhanh || ''), GhiChu: String(r.GhiChu || '') });
    else if (l === 'XUAT' && ma) xuat[ma] = String(r.Nhanh || '').split(',').map(function(x) { return x.trim(); }).filter(Boolean);   // bước xuất của xưởng (cách A, 01/11)
    else if (l === 'LUOT' && ma && Number(r.Nhanh) >= 2 && Number(r.Nhanh) <= 5) luot[ma] = Math.round(Number(r.Nhanh));   // 08/11: mỗi khúc ghi mấy lần ở bước xuất (Sơn: mỗi lớp 1 lần)
    else if (l === 'CAIDAT' && QT_CAI_DAT.hasOwnProperty(ma) && isFinite(Number(r.GhiChu)) && String(r.GhiChu) !== '') cai[ma] = Number(r.GhiChu);
  });
  var nhap = !dong.some(function(r) { return String(r.Loai).trim() === 'CD'; });
  // Công đoạn đang dùng chưa có trong quy trình -> nháp (nếu có) / "Chưa xếp"
  cds.forEach(function(c) {
    var m = String(c.MaCD);
    if (cd[m]) { cd[m].MaXuong = String(c.MaXuong); return; }
    var n = QT_NHAP[m];
    cd[m] = { Ma: m, MaXuong: String(c.MaXuong), Nhanh: n ? n[0] : 'CHUAXEP', Buoc: n ? n[1] : 1, Truoc: [], GhiChu: '', NguoiSua: '', ThoiDiem: '', moi: !nhap };
  });
  if (!dong.some(function(r) { return String(r.Loai).trim() === 'XUONG'; }))
    xuong = QT_XUONG_NHAP.map(function(a) { return { Tu: a[0], Den: a[1], BTP: a[2], GhiChu: '' }; });
  else { var luu = qtLuongCu_(dong); QT_XUONG_THEM.forEach(function(a) { if (luu >= a[3]) return;   // luồng chủ dự án báo thêm sau khi đã lưu (01/11): bổ sung nếu bản đã lưu chưa có
    if (!xuong.some(function(l) { return l.Tu === a[0] && l.Den === a[1]; })) xuong.push({ Tu: a[0], Den: a[1], BTP: a[2], GhiChu: 'Thêm ' + a[3].slice(8) + '/' + a[3].slice(5, 7) });
  });
  QT_XUONG_BO.forEach(function(a) { if (luu >= a[2]) return; xuong = xuong.filter(function(l) { return !(l.Tu === a[0] && l.Den === a[1]); }); }); }
  return { cd: cd, xuong: xuong, caiDat: cai, nhap: nhap, xuat: xuat, luot: luot };
}

/* Dữ liệu cho tab: quy trình + thống kê sản lượng theo công đoạn trong kỳ + nhân sự + máy + kỹ năng */
function layQuyTrinh(token, soNgay) {
  var q = qtQuyenXem_(token); if (q.loi) return q.loi;
  var cds = doc_('CongDoan').filter(function(c) { return String(c.TrangThai).trim() !== 'Ngừng'; });
  var qt = qtDocQT_(cds);
  soNgay = [14, 30, 60, 90].indexOf(Number(soNgay)) >= 0 ? Number(soNgay) : qt.caiDat.soNgay;
  var den = congNgay_(homNayVN_(), -1), d0 = new Date(den + 'T12:00:00Z'); d0.setUTCDate(d0.getUTCDate() - soNgay + 1);
  var tu = Utilities.formatDate(d0, 'GMT', 'yyyy-MM-dd');
  var dmRow = {}; doc_('DinhMuc').forEach(function(r) { dmRow[String(r.MaCD)] = r; });
  var tk = {}, ngaySX = {}, cong = {}, d7 = new Date(den + 'T12:00:00Z'); d7.setUTCDate(d7.getUTCDate() - 6); var tu7 = Utilities.formatDate(d7, 'GMT', 'yyyy-MM-dd'), ngay7 = {};
  docNKTu_(tu).forEach(function(r) {
    if (String(r.TrangThai).trim() === 'Từ chối') return;
    var ng = ngayVN_(r.Ngay); if (ng < tu || ng > den) return;
    (cong[String(r.MaNV)] = cong[String(r.MaNV)] || {})[ng] = 1;   // có dòng nhật ký = có mặt làm hàng ngày đó
    var sl = Number(r.SoLuongLamRa) || 0; if (sl <= 0) return;
    var m = String(r.MaCD), t = tk[m] || (tk[m] = { sl: 0, nguoi: {}, ngay: {} });
    t.sl += sl; t.nguoi[String(r.MaNV)] = (t.nguoi[String(r.MaNV)] || 0) + sl; t.ngay[ng] = 1; ngaySX[ng] = 1;
    if (ng >= tu7) { t.sl7 = (t.sl7 || 0) + sl; ngay7[ng] = 1; }   // 7 ngày gần nhất (cách A: nhịp ra của bước xuất)
  });
  Object.keys(tk).forEach(function(m) { var t = tk[m]; t.soNgay = Object.keys(t.ngay).length; delete t.ngay; });
  var ngayCong = {}; Object.keys(cong).forEach(function(m) { ngayCong[m] = Object.keys(cong[m]).length; });
  var nsGoc = doc_('NhanSu').filter(function(n) { return String(n.TrangThai).trim() === 'Đang làm'; });
  var ns = nsGoc.map(function(n) { return { MaNV: String(n.MaNV), HoTen: String(n.HoTen), MaXuong: String(n.MaXuong), ChucDanh: String(n.ChucDanh || '') }; });
  /* 03/11 (chủ dự án): số người có mặt theo ĐIỂM DANH (khớp chấm công), không theo ngày có ghi KPI.
     Ngày có mặt của 1 người = số ngày có sản xuất trong kỳ (từ ngày vào làm) − phần công nghỉ ghi ở DiemDanhNghi (Cong = phần công vẫn được tính) */
  var dsNgaySX = Object.keys(ngaySX), vang = {};
  docAnToan_('DiemDanhNghi').forEach(function(r) { var g = ngayVN_(r.Ngay); if (!ngaySX[g]) return;
    var c = Number(r.Cong); c = isFinite(c) ? Math.max(0, Math.min(1, c)) : 0; var k = String(r.MaNV) + '|' + g; vang[k] = Math.max(vang[k] || 0, 1 - c); });
  var diemDanh = {};
  nsGoc.forEach(function(n) { var m = String(n.MaNV), vao = ngayVN_(n.NgayVaoLam) || '', co = 0;
    dsNgaySX.forEach(function(g) { if (vao && g < vao) return; co += 1 - (vang[m + '|' + g] || 0); });
    diemDanh[m] = Math.round(co * 10) / 10; });
  var may = {};
  docAnToan_('MayMoc').forEach(function(m) {
    var tt = String(m.TinhTrang).trim(); if (tt === 'Thanh lý') return;
    var x = String(m.MaXuong), l = String(m.ChungLoai || 'Khác').trim().toUpperCase() || 'KHÁC';
    may[x] = may[x] || {}; may[x][l] = (may[x][l] || 0) + 1;
  });
  // Kỹ năng đã duyệt -> người đạt cấp ≥ 2 còn hạn cho từng công đoạn trong kỹ năng
  var kn = {}, hn = homNayVN_(), dsKN = {};
  docAnToan_('KyNang').forEach(function(k) { if (String(k.TrangThai).trim() === 'Đã duyệt') dsKN[String(k.MaKN)] = String(k.CongDoan || '').split(','); });
  docAnToan_('KyNangNhanVien').forEach(function(g) {
    if (String(g.TrangThai).trim() !== 'Đã xác nhận' || !dsKN[String(g.MaKN)]) return;
    var cap = Number(g.Cap) || 0, hh = ngayVN_(g.HetHan);
    if (cap < 2 || (hh && hh < hn)) return;
    dsKN[String(g.MaKN)].forEach(function(m) { m = m.trim(); if (!m) return; kn[m] = kn[m] || {}; kn[m][String(g.MaNV)] = Math.max(kn[m][String(g.MaNV)] || 0, cap); });
  });
  var kq = { ok: true, nhap: qt.nhap, quyTrinh: Object.keys(qt.cd).map(function(m) { return qt.cd[m]; }), xuongLuong: qt.xuong, caiDat: qt.caiDat,
    nhanh: QT_NHANH, soNgay: soNgay, tu: tu, den: den, soNgaySX: Object.keys(ngaySX).length,
    congDoan: cds.map(function(c) { var d = dmRow[String(c.MaCD)] || {};
      return { MaCD: String(c.MaCD), TenCD: String(c.TenCD), MaXuong: String(c.MaXuong), DM: Number(d.DinhMucGio) || 0, DVT: String(d.DonViTinh || '') }; }),
    xuong: doc_('PhongBan').filter(function(p) { return String(p.TrangThai || 'Đang dùng').trim() !== 'Ngừng'; }).map(function(p) { return { MaXuong: String(p.MaXuong), TenXuong: String(p.TenXuong) }; }),
    thongKe: tk, soNgaySX7: Object.keys(ngay7).length, xuat: qt.xuat, luot: qt.luot, ngayCong: ngayCong, diemDanh: diemDanh, nhanSu: ns, may: may, kyNang: kn };
  if (q.xuong) {   // trưởng / phó phòng: chỉ dữ liệu xưởng mình (+ tên xưởng và luồng để vẽ lưu đồ nhà máy không số)
    var X = q.xuong, cuaX = {}, nvX = {};
    kq.congDoan = kq.congDoan.filter(function(c) { if (c.MaXuong === X) { cuaX[c.MaCD] = 1; return true; } return false; });
    kq.quyTrinh = kq.quyTrinh.filter(function(c) { return c.MaXuong === X; });
    kq.nhanSu = ns.filter(function(n) { if (n.MaXuong === X) { nvX[n.MaNV] = 1; return true; } return false; });
    var tk2 = {}; Object.keys(tk).forEach(function(m) { if (cuaX[m]) { var t0 = tk[m], ng = {}; Object.keys(t0.nguoi).forEach(function(p) { if (nvX[p]) ng[p] = t0.nguoi[p]; }); tk2[m] = { sl: t0.sl, sl7: t0.sl7, soNgay: t0.soNgay, nguoi: ng }; } else if (QT_CD_DONGGOI_.indexOf(m) >= 0) tk2[m] = { sl: tk[m].sl, nguoi: {} }; });   // nhịp nhà máy (đóng gói) chỉ số tổng
    kq.thongKe = tk2;
    var nc2 = {}; Object.keys(ngayCong).forEach(function(m) { if (nvX[m]) nc2[m] = ngayCong[m]; }); kq.ngayCong = nc2;
    var dd2 = {}; Object.keys(diemDanh).forEach(function(m) { if (nvX[m]) dd2[m] = diemDanh[m]; }); kq.diemDanh = dd2;
    var kn2 = {}; Object.keys(kn).forEach(function(m) { if (!cuaX[m]) return; kn2[m] = {}; Object.keys(kn[m]).forEach(function(p) { if (nvX[p]) kn2[m][p] = kn[m][p]; }); }); kq.kyNang = kn2;   // không lộ mã người xưởng khác
    var may2 = {}; if (may[X]) may2[X] = may[X]; kq.may = may2;
    var xu2 = {}; if (qt.xuat[X]) xu2[X] = qt.xuat[X]; kq.xuat = xu2;
    var lu2 = {}; if (qt.luot[X]) lu2[X] = qt.luot[X]; kq.luot = lu2;
    kq.laTP = true; kq.xuongCua = X; kq.deXuat = qtDeXuatCua_(X);
  } else kq.deXuatCho = qtDsDeXuat_(true).filter(function(r) { return r.TrangThai === 'Chờ duyệt'; }).map(function(r) { var o = {}; for (var k in r) if (k !== '_row') o[k] = r[k]; o.daDoi = !!r.Dau && r.Dau !== qtDauXuong_(qt, r.MaXuong); return o; });
  return sach_(kq);
}

/* Lưu quy trình (ghi đè toàn bộ sheet QuyTrinh trong khóa). o = { cd: [{Ma, Nhanh, Buoc, Truoc[], GhiChu}], xuong: [{Tu, Den, BTP, GhiChu}], caiDat: {} } */
function luuQuyTrinh(token, o) {
  var q = qtQuyen_(token); if (q.loi) return q.loi;
  return sach_(qtKiemGhi_(q.me, o, false));
}
/* Kiểm + ghi toàn bộ quy trình (chiKiem = true: chỉ kiểm, không ghi). Trả { ok, msg, doi } */
function qtKiemGhi_(me, o, chiKiem, ghiChuLog) {
  o = o || {};
  if (!Array.isArray(o.cd) || o.cd.length > 2000 || !Array.isArray(o.xuong || []) || (o.xuong || []).length > 100) return ({ ok: false, msg: 'Dữ liệu quy trình không hợp lệ.' });
  var thoDai = function(v, n) { return v != null && (typeof v !== 'string' && typeof v !== 'number' || String(v).length > n); };   // kiểm độ dài TRƯỚC khi xử lý / giữ khóa
  if (o.cd.some(function(c) { return !c || typeof c !== 'object' || thoDai(c.Ma, 60) || thoDai(c.Nhanh, 20) || thoDai(c.GhiChu, 400) || (c.Truoc != null && (!Array.isArray(c.Truoc) || c.Truoc.length > 20 || c.Truoc.some(function(t) { return thoDai(t, 60); }))); }) ||
      (o.xuong || []).some(function(x) { return !x || typeof x !== 'object' || thoDai(x.Tu, 30) || thoDai(x.Den, 30) || thoDai(x.BTP, 240) || thoDai(x.GhiChu, 400); }) ||
      (o.xuat != null && (typeof o.xuat !== 'object' || Array.isArray(o.xuat) || Object.keys(o.xuat).length > 30 || Object.keys(o.xuat).some(function(k) { var a = o.xuat[k]; return k.length > 30 || !Array.isArray(a) || a.length > 30 || a.some(function(t) { return thoDai(t, 60); }); }))))
    return ({ ok: false, msg: 'Dữ liệu quy trình không hợp lệ (ô quá dài hoặc quá nhiều công đoạn trước).' });
  if (!chiKiem) khoa_();
  var cds = doc_('CongDoan'), xOf = {};
  cds.forEach(function(c) { xOf[String(c.MaCD)] = String(c.MaXuong); });
  var xs = {}; doc_('PhongBan').forEach(function(p) { xs[String(p.MaXuong)] = 1; });
  var ds = [], da = {}, loi = '';
  o.cd.forEach(function(c) {
    if (loi) return;
    var ma = String(c && c.Ma || '').trim();
    if (!qtCo_(xOf, ma)) { loi = 'Công đoạn "' + ma.slice(0, 40) + '" không có trong danh mục.'; return; }
    if (qtCo_(da, ma)) { loi = 'Công đoạn ' + ma + ' bị lặp.'; return; }
    da[ma] = 1;
    var nh = String(c.Nhanh || ''), b = Number(c.Buoc);
    if (!QT_NHANH.hasOwnProperty(nh)) { loi = 'Nhánh của ' + ma + ' không hợp lệ.'; return; }
    if (!(b >= 1 && b <= 99 && Math.floor(b) === b)) { loi = 'Bước của ' + ma + ' phải là số nguyên 1–99.'; return; }
    var tr = (Array.isArray(c.Truoc) ? c.Truoc : []).map(function(x) { return String(x).trim(); }).filter(function(x, i, a) { return x && a.indexOf(x) === i; });
    if (tr.length > 20) { loi = 'Công đoạn ' + ma + ' có quá nhiều công đoạn trước.'; return; }
    for (var i = 0; i < tr.length; i++) {
      if (tr[i] === ma) { loi = 'Công đoạn ' + ma + ' không thể đứng trước chính nó.'; return; }
      if (!qtCo_(xOf, tr[i]) || xOf[tr[i]] !== xOf[ma]) { loi = 'Công đoạn trước của ' + ma + ' phải cùng xưởng (luồng giữa các xưởng sửa ở phần "Luồng giữa các xưởng").'; return; }
    }
    var gc = String(c.GhiChu || '').replace(/\s+/g, ' ').trim();
    if (gc.length > 200) { loi = 'Ghi chú của ' + ma + ' tối đa 200 ký tự.'; return; }
    ds.push({ Ma: ma, MaXuong: xOf[ma], Nhanh: nh, Buoc: b, Truoc: tr, GhiChu: gc });
  });
  if (loi) return ({ ok: false, msg: loi });
  var vong = qtCoVong_(qtCanh_(ds));
  if (vong) return ({ ok: false, msg: 'Quy trình bị vòng lặp: ' + vong + '. Sửa "công đoạn trước" để không quay vòng.' });
  var xl = [], daX = {};
  (o.xuong || []).forEach(function(x) {
    if (loi) return;
    var tu = String(x && x.Tu || ''), den = String(x && x.Den || ''), btp = String(x.BTP || '').replace(/\s+/g, ' ').trim();
    if (!qtCo_(xs, tu) || !qtCo_(xs, den) || tu === den) { loi = 'Luồng giữa các xưởng có xưởng không hợp lệ.'; return; }
    if (qtCo_(daX, tu + '>' + den)) { loi = 'Luồng ' + tu + ' → ' + den + ' bị lặp.'; return; }
    if (btp.length > 120) { loi = 'Tên bán thành phẩm tối đa 120 ký tự.'; return; }
    daX[tu + '>' + den] = 1; xl.push({ Tu: tu, Den: den, BTP: btp, GhiChu: String(x.GhiChu || '').replace(/\s+/g, ' ').trim().slice(0, 200) });
  });
  if (loi) return ({ ok: false, msg: loi });
  // luồng cấp vật liệu (POM Ngọn Taro → Phôi Thô) chạy ngược chiều sản phẩm: không tính khi dò vòng lặp
  // 14/11: ngọn Hoàn thiện → Ngọn Tip → TRẢ LẠI Hoàn thiện là luồng gia công trả về (có chủ đích), không tính là vòng lặp
  var traVe = { 'NGONTIP>HT': 1 };
  var cX = {}; xl.forEach(function(x) { if (!qtLuongCap_(x) && !traVe[x.Tu + '>' + x.Den]) (cX[x.Den] = cX[x.Den] || []).push(x.Tu); });
  if (qtCoVong_(cX)) return ({ ok: false, msg: 'Luồng giữa các xưởng bị vòng lặp: ' + qtCoVong_(cX) + '.' });
  var xt = {};
  Object.keys(o.xuat || {}).forEach(function(x) {
    if (loi) return;
    if (!qtCo_(xs, x)) { loi = 'Bước xuất: xưởng không hợp lệ.'; return; }
    var a = o.xuat[x].map(function(t) { return String(t).trim(); }).filter(function(t, i, b) { return t && b.indexOf(t) === i; });
    for (var i = 0; i < a.length; i++) if (!qtCo_(xOf, a[i]) || xOf[a[i]] !== x) { loi = 'Bước xuất của ' + x + ' phải là công đoạn của xưởng đó.'; return; }
    if (a.length) xt[x] = a;
  });
  if (loi) return ({ ok: false, msg: loi });
  var cai = {}, gh = { gioCoMat: [1, 24], hieuSuat: [0.3, 1.2], mucTieu: [10, 500], soNgay: [14, 90], slThang: [500, 100000], ngayThang: [20, 31], slNay: [0, 5000] };
  for (var k in QT_CAI_DAT) {
    var v = Number((o.caiDat || {})[k]);
    if ((o.caiDat || {})[k] === undefined) v = QT_CAI_DAT[k];
    if (!isFinite(v) || v < gh[k][0] || v > gh[k][1]) return ({ ok: false, msg: 'Cài đặt "' + k + '" ngoài khoảng cho phép.' });
    cai[k] = v;
  }
  // So với bản cũ: dòng không đổi giữ người sửa / thời điểm cũ
  if (chiKiem) return { ok: true };
  var qtCu = qtDocQT_([]), cu = qtCu.cd, luc = Utilities.formatDate(new Date(), TZ_VN, 'yyyy-MM-dd HH:mm'), doi = 0;
  var rows = ds.map(function(c) {
    var c0 = cu[c.Ma], same = c0 && c0.Nhanh === c.Nhanh && c0.Buoc === c.Buoc && c0.Truoc.join(',') === c.Truoc.join(',') && c0.GhiChu === c.GhiChu;
    if (!same) doi++;
    return ['CD', c.Ma, c.MaXuong, c.Nhanh, String(c.Buoc), c.Truoc.join(','), c.GhiChu, same ? c0.NguoiSua : me.tk, same ? c0.ThoiDiem : luc];
  });
  xl.forEach(function(x) { rows.push(['XUONG', x.Tu + '>' + x.Den, x.Tu, x.BTP, '', '', x.GhiChu, me.tk, luc]); });
  Object.keys(xt).forEach(function(x) { rows.push(['XUAT', x, x, xt[x].join(','), '', '', '', me.tk, luc]); });
  Object.keys(qtCu.luot).forEach(function(x) { if (qtCo_(xs, x)) rows.push(['LUOT', x, x, String(qtCu.luot[x]), '', '', '', me.tk, luc]); });   // 08/11: giữ "số lần ghi mỗi khúc" (chỉ đổi ở thẻ Cách đếm)
  Object.keys(cai).forEach(function(k2) { rows.push(['CAIDAT', k2, '', '', '', '', String(cai[k2]), me.tk, luc]); });
  var sh = qtSheet_();
  if (sh.getMaxRows() < rows.length + 1) sh.insertRowsAfter(sh.getMaxRows(), rows.length + 1 - sh.getMaxRows());
  var cuoi = sh.getLastRow();
  if (rows.length) sh.getRange(2, 1, rows.length, QT_COT.length).setValues(rows.map(dongAnToan_));   // ghi trước, rồi mới xóa dòng thừa (lỗi giữa chừng không mất bản cũ)
  if (cuoi > rows.length + 1) sh.getRange(rows.length + 2, 1, cuoi - rows.length - 1, QT_COT.length).clearContent();
  xoaCache_(QT_SHEET);
  ghiLog_(me, 'Sửa quy trình sản xuất', ds.length + ' công đoạn (' + doi + ' dòng thay đổi), ' + xl.length + ' luồng giữa xưởng' + (ghiChuLog ? ' – ' + ghiChuLog : ''));
  return ({ ok: true, msg: 'Đã lưu quy trình (' + doi + ' công đoạn thay đổi).', doi: doi });
}

/* ===== 03/11: đề xuất sửa quy trình của trưởng / phó phòng (chỉ xưởng mình) – chủ sở hữu duyệt ===== */
var QT_DX_SHEET = 'QuyTrinhDeXuat';
var QT_DX_COT = ['Id', 'MaXuong', 'NguoiGui', 'TenNguoi', 'ThoiDiem', 'DuLieu', 'LoiNhan', 'TrangThai', 'NguoiDuyet', 'ThoiDiemDuyet', 'LyDo'];   // DuLieu xóa sau khi duyệt / từ chối (giữ sheet nhẹ)
var QT_CD_DONGGOI_ = ['DG-DONGGOITP', 'DG-DONLE-GAY-NGON', 'DG-DONLE-NGON', 'DG-DONLE-CUSTOM', 'DG-DONLE-COMBO'];   // giống QT_CD_DONGGOI ở web (nhịp hiện nay)
/* Dấu phiên bản phần của 1 xưởng trong quy trình đang lưu (để biết chủ sở hữu đã sửa xưởng đó sau khi trưởng phòng gửi) */
function qtDauXuong_(qt, X) {
  var cd = Object.keys(qt.cd).sort().filter(function(m) { return qt.cd[m].MaXuong === X; }).map(function(m) { var c = qt.cd[m]; return [m, c.Nhanh, c.Buoc, (c.Truoc || []).join('+')].join(':'); });
  var l = qt.xuong.filter(function(a) { return a.Tu === X; }).map(function(a) { return a.Den + '=' + a.BTP; }).sort();
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, JSON.stringify([cd, l, qt.xuat[X] || []]), Utilities.Charset.UTF_8).slice(0, 8).map(function(b) { return ('0' + ((b + 256) % 256).toString(16)).slice(-2); }).join('');
}
function qtDsDeXuat_(chiCho) {
  return docAnToan_(QT_DX_SHEET).map(function(r) {
    var d = null, cho = String(r.TrangThai || '') === 'Chờ duyệt';
    if (cho || !chiCho) { try { d = JSON.parse(String(r.DuLieu || '').replace(/^'/, '')); } catch (e) {} }   // chỉ giải mã bản đang chờ khi cần
    return { Id: String(r.Id), MaXuong: String(r.MaXuong), NguoiGui: String(r.NguoiGui), TenNguoi: String(r.TenNguoi || ''), ThoiDiem: String(r.ThoiDiem || ''), DuLieu: d,
      LoiNhan: String(r.LoiNhan || ''), TrangThai: String(r.TrangThai || ''), NguoiDuyet: String(r.NguoiDuyet || ''), ThoiDiemDuyet: String(r.ThoiDiemDuyet || ''), LyDo: String(r.LyDo || ''), Dau: d && d.dau || '', _row: r._row };
  });
}
/* Đề xuất đang chờ + quyết định gần nhất của 1 xưởng (cho trưởng phòng) */
function qtDeXuatCua_(X) {
  var ds = qtDsDeXuat_().filter(function(r) { return r.MaXuong === X; });
  var cho = ds.filter(function(r) { return r.TrangThai === 'Chờ duyệt'; }).pop() || null;
  var xong = ds.filter(function(r) { return r.TrangThai === 'Đã duyệt' || r.TrangThai === 'Từ chối'; }).sort(function(a, b) { return a.ThoiDiemDuyet < b.ThoiDiemDuyet ? -1 : 1; }).pop() || null;
  var bo = function(r) { if (!r) return null; var o = {}; for (var k in r) if (k !== '_row') o[k] = r[k]; return o; };
  return { cho: bo(cho), cuoi: bo(xong) };
}
/* Ghép đề xuất của xưởng X vào quy trình đang lưu -> o đầy đủ cho qtKiemGhi_ */
function qtGhepDeXuat_(X, d) {
  var cds = doc_('CongDoan').filter(function(c) { return String(c.TrangThai).trim() !== 'Ngừng'; });
  var qt = qtDocQT_(cds), moi = {};
  (d.cd || []).forEach(function(c) { if (c && c.Ma) moi[String(c.Ma)] = c; });
  var cd = Object.keys(qt.cd).map(function(m) { var c = qt.cd[m];
    if (c.MaXuong === X && moi[m]) { var n = moi[m]; return { Ma: m, Nhanh: n.Nhanh, Buoc: n.Buoc, Truoc: n.Truoc || [], GhiChu: c.GhiChu || '' }; }   // ghi chú công đoạn không đổi qua đề xuất
    return { Ma: m, Nhanh: c.Nhanh, Buoc: c.Buoc, Truoc: c.Truoc || [], GhiChu: c.GhiChu || '' }; });
  var gcL = {}; qt.xuong.forEach(function(a) { if (a.Tu === X) gcL[a.Den] = a.GhiChu || ''; });
  var xuong = qt.xuong.filter(function(a) { return a.Tu !== X; }).concat((d.luong || []).map(function(a) { var den = String(a && a.Den || ''); return { Tu: X, Den: den, BTP: String(a && a.BTP || ''), GhiChu: gcL[den] || '' }; }));
  var xuat = {}; Object.keys(qt.xuat).forEach(function(k) { if (k !== X) xuat[k] = qt.xuat[k]; });
  if (Array.isArray(d.xuat) && d.xuat.length) xuat[X] = d.xuat;
  return { cd: cd, xuong: xuong, xuat: xuat, caiDat: qt.caiDat, nhap: qt.nhap };
}
/* Trưởng / phó phòng gửi đề xuất. o = { cd: [{Ma, Nhanh, Buoc, Truoc[], GhiChu}] (chỉ công đoạn xưởng mình), xuat: [Ma], luong: [{Den, BTP, GhiChu}], loiNhan } */
function guiDeXuatQuyTrinh(token, o) {
  var q = qtQuyenXem_(token); if (q.loi) return q.loi;
  if (!q.xuong) return sach_({ ok: false, msg: 'Chủ sở hữu lưu thẳng bằng nút "Lưu quy trình".' });
  var X = q.xuong; o = o || {};
  if (!Array.isArray(o.cd) || o.cd.length > 400 || (o.xuat != null && (!Array.isArray(o.xuat) || o.xuat.length > 30)) || (o.luong != null && (!Array.isArray(o.luong) || o.luong.length > 20)))
    return sach_({ ok: false, msg: 'Dữ liệu đề xuất không hợp lệ.' });
  var xOf = {}; doc_('CongDoan').forEach(function(c) { xOf[String(c.MaCD)] = String(c.MaXuong); });
  var ngoai = o.cd.some(function(c) { return !c || typeof c !== 'object' || xOf[String(c.Ma)] !== X || (Array.isArray(c.Truoc) && c.Truoc.some(function(t) { return xOf[String(t)] !== X; })); }) ||
    (o.xuat || []).some(function(m) { return xOf[String(m)] !== X; });
  if (ngoai) return sach_({ ok: false, msg: 'Chỉ được đề xuất công đoạn của xưởng mình.' });
  var d = { cd: o.cd.map(function(c) { return { Ma: String(c.Ma), Nhanh: String(c.Nhanh || ''), Buoc: Number(c.Buoc), Truoc: (Array.isArray(c.Truoc) ? c.Truoc : []).map(String) }; }),
    xuat: (o.xuat || []).map(String), luong: (o.luong || []).map(function(a) { return { Den: String(a && a.Den || '').slice(0, 30), BTP: String(a && a.BTP || '').slice(0, 120), GhiChu: '' }; }) };
  d.dau = qtDauXuong_(qtDocQT_(doc_('CongDoan').filter(function(c) { return String(c.TrangThai).trim() !== 'Ngừng'; })), X);
  var kt = qtKiemGhi_(q.me, qtGhepDeXuat_(X, d), true);
  if (!kt.ok) return sach_({ ok: false, msg: kt.msg });
  var json = JSON.stringify(d); if (json.length > 45000) return sach_({ ok: false, msg: 'Đề xuất quá lớn.' });
  khoa_();
  var sh = ss_().getSheetByName(QT_DX_SHEET);
  if (!sh) { sh = ss_().insertSheet(QT_DX_SHEET); sh.getRange(1, 1, 1, QT_DX_COT.length).setValues([QT_DX_COT]).setFontWeight('bold'); sh.setFrozenRows(1); sh.getRange(2, 1, sh.getMaxRows() - 1, QT_DX_COT.length).setNumberFormat('@'); try { sh.hideSheet(); } catch (e) {} }
  xoaCache_(QT_DX_SHEET);
  qtDsDeXuat_().filter(function(r) { return r.MaXuong === X && r.TrangThai === 'Chờ duyệt'; }).map(function(r) { return r._row; }).sort(function(a, b) { return b - a; }).forEach(function(r) { sh.deleteRow(r); });   // gửi lại: thay bản đang chờ
  xoaCache_(QT_DX_SHEET);
  var luc = Utilities.formatDate(new Date(), TZ_VN, 'yyyy-MM-dd HH:mm');
  them_(QT_DX_SHEET, { Id: 'DX' + new Date().getTime() + '-' + Utilities.getUuid().slice(0, 8), MaXuong: X, NguoiGui: q.me.tk, TenNguoi: String(q.me.hoTen || q.me.ten || q.me.tk), ThoiDiem: luc, DuLieu: json,
    LoiNhan: String(o.loiNhan || '').replace(/\s+/g, ' ').trim().slice(0, 300), TrangThai: 'Chờ duyệt', NguoiDuyet: '', ThoiDiemDuyet: '', LyDo: '' });
  ghiLog_(q.me, 'Đề xuất quy trình', X, '', d.cd.length + ' công đoạn, ' + d.luong.length + ' luồng');
  return sach_({ ok: true, msg: 'Đã gửi đề xuất – chờ Ban điều hành duyệt.' });
}
/* Chủ sở hữu duyệt / từ chối */
function duyetDeXuatQuyTrinh(token, id, dongY, lyDo) {
  var q = qtQuyen_(token); if (q.loi) return q.loi;
  id = String(id || '').slice(0, 40);
  khoa_(); xoaCache_(QT_DX_SHEET);
  var r = qtDsDeXuat_().filter(function(x) { return x.Id === id; })[0];
  if (!r || r.TrangThai !== 'Chờ duyệt') return sach_({ ok: false, msg: 'Đề xuất không còn chờ duyệt (có thể đã được gửi lại bản mới).' });
  var luc = Utilities.formatDate(new Date(), TZ_VN, 'yyyy-MM-dd HH:mm');
  if (dongY) {
    if (!r.DuLieu) return sach_({ ok: false, msg: 'Dữ liệu đề xuất bị hỏng.' });
    var gh = qtGhepDeXuat_(r.MaXuong, r.DuLieu);
    if (gh.nhap) return sach_({ ok: false, msg: 'Quy trình nhà máy còn là bản nháp – bấm "Lưu quy trình" một lần để chốt bản nháp, rồi mới duyệt đề xuất.' });
    var kq = qtKiemGhi_(q.me, gh, false, 'duyệt đề xuất xưởng ' + r.MaXuong + ' của ' + r.NguoiGui);
    if (!kq.ok) return sach_({ ok: false, msg: 'Không áp dụng được: ' + kq.msg });
  }
  var sh = ss_().getSheetByName(QT_DX_SHEET), i8 = QT_DX_COT.indexOf('TrangThai') + 1;
  sh.getRange(r._row, i8, 1, 4).setValues([[dongY ? 'Đã duyệt' : 'Từ chối', q.me.tk, luc, chuAnToan_(String(lyDo || '').replace(/\s+/g, ' ').trim().slice(0, 300))]]);
  sh.getRange(r._row, QT_DX_COT.indexOf('DuLieu') + 1).setValue('');   // đã quyết định: bỏ dữ liệu chi tiết cho sheet nhẹ
  xoaCache_(QT_DX_SHEET);
  ghiLog_(q.me, dongY ? 'Duyệt đề xuất quy trình' : 'Từ chối đề xuất quy trình', r.MaXuong, '', r.NguoiGui + (lyDo ? ' – ' + String(lyDo).slice(0, 100) : ''));
  return sach_({ ok: true, msg: dongY ? 'Đã duyệt và áp dụng quy trình xưởng ' + r.MaXuong + '.' : 'Đã từ chối đề xuất.' });
}
/* Việc hôm nay (chủ sở hữu): số đề xuất chờ duyệt */
function demDeXuatQuyTrinh(token) {
  var q = qtQuyen_(token); if (q.loi) return q.loi;
  var ds = qtDsDeXuat_().filter(function(r) { return r.TrangThai === 'Chờ duyệt'; });
  return sach_({ ok: true, n: ds.length, ds: ds.map(function(r) { return { MaXuong: r.MaXuong, TenNguoi: r.TenNguoi || r.NguoiGui, ThoiDiem: r.ThoiDiem }; }) });
}

/* ===== 08/11 (chủ dự án chọn "Claude đề xuất cách đếm, tôi duyệt"): đổi bước xuất + số lần ghi mỗi khúc của vài xưởng, giữ nguyên phần còn lại của quy trình.
   o = { xuat: { X: [MaCD] }, luot: { X: 1..5 } } – chỉ chủ sở hữu. */
function apCachDem(token, o) {
  var q = qtQuyen_(token); if (q.loi) return q.loi;
  o = o || {};
  var xuat = o.xuat || {}, luot = o.luot || {};
  if (typeof xuat !== 'object' || Array.isArray(xuat) || typeof luot !== 'object' || Array.isArray(luot) || Object.keys(xuat).length > 12 || Object.keys(luot).length > 12)
    return sach_({ ok: false, msg: 'Dữ liệu không hợp lệ.' });
  var xOf = {}; doc_('CongDoan').forEach(function(c) { xOf[String(c.MaCD)] = String(c.MaXuong); });
  var xs = {}; doc_('PhongBan').forEach(function(p) { xs[String(p.MaXuong)] = 1; });
  var loi = '';
  Object.keys(xuat).forEach(function(X) { var a = xuat[X];
    if (!qtCo_(xs, X) || !Array.isArray(a) || !a.length || a.length > 30) { loi = 'Bước xuất của ' + String(X).slice(0, 20) + ' không hợp lệ.'; return; }
    a.forEach(function(m) { if (!qtCo_(xOf, String(m)) || xOf[String(m)] !== X) loi = 'Công đoạn ' + String(m).slice(0, 40) + ' không thuộc xưởng ' + X + '.'; }); });
  Object.keys(luot).forEach(function(X) { var n = Number(luot[X]); if (!qtCo_(xs, X) || !(n >= 1 && n <= 5 && Math.floor(n) === n)) loi = 'Số lần ghi mỗi khúc phải là 1–5.'; });
  if (loi) return sach_({ ok: false, msg: loi });
  khoa_();
  var sh = qtSheet_(), cuoi = sh.getLastRow(), luc = Utilities.formatDate(new Date(), TZ_VN, 'yyyy-MM-dd HH:mm');
  var cu = cuoi > 1 ? sh.getRange(2, 1, cuoi - 1, QT_COT.length).getValues() : [];
  var giu = cu.filter(function(r) { var l = String(r[0]).trim(), m = String(r[1]).trim();
    if (!l && !m) return false;
    if (l === 'XUAT' && qtCo_(xuat, m)) return false;
    if (l === 'LUOT' && qtCo_(luot, m)) return false;
    return true; });
  Object.keys(xuat).forEach(function(X) { giu.push(['XUAT', X, X, xuat[X].map(String).filter(function(t, i, b) { return b.indexOf(t) === i; }).join(','), '', '', '', q.me.tk, luc]); });
  Object.keys(luot).forEach(function(X) { if (Number(luot[X]) > 1) giu.push(['LUOT', X, X, String(Number(luot[X])), '', '', '', q.me.tk, luc]); });
  if (sh.getMaxRows() < giu.length + 1) sh.insertRowsAfter(sh.getMaxRows(), giu.length + 1 - sh.getMaxRows());
  if (giu.length) sh.getRange(2, 1, giu.length, QT_COT.length).setValues(giu.map(dongAnToan_));
  if (cuoi > giu.length + 1) sh.getRange(giu.length + 2, 1, cuoi - giu.length - 1, QT_COT.length).clearContent();
  xoaCache_(QT_SHEET);
  try { CacheService.getScriptCache().remove('DP_v1'); } catch (e) {}
  ghiLog_(q.me, 'Đổi cách đếm sản lượng xưởng', Object.keys(xuat).map(function(X) { return X + ': ' + xuat[X].join('+'); }).concat(Object.keys(luot).map(function(X) { return X + ' ÷' + luot[X]; })).join(' · ').slice(0, 400));
  return sach_({ ok: true, msg: 'Đã áp dụng cách đếm mới. Biểu đồ sản lượng xưởng, Quy trình và báo cáo tính theo cách này từ giờ.' });
}
/* =====================================================================
   ĐƠN HÀNG → XƯỞNG (31/10, chủ dự án duyệt): đọc Sheet "Trạng thái đơn hàng" (CHỈ ĐỌC), phân loại từng SKU theo
   4 thông số chủ dự án chốt – LOẠI CHUÔI, LOẠI NGỌN, LOẠI TIP, LOẠI REN – rồi tách việc còn lại về từng xưởng:
     chuôi: Phôi Carbon → Phôi Thô → Sơn → In UV (nhận theo mã bán thành phẩm, giao Hoàn thiện theo SKU)
     ngọn : Phôi Carbon → Phôi Thô → Ngọn Taro → Hoàn thiện → Ngọn Tip (CNC cấp típ / phíp) → trả Hoàn thiện → Đóng gói (14/11)
     gậy  : Hoàn thiện → Đóng gói;  ngọn bán lẻ: Ngọn Tip → thẳng Đóng gói.
   Phân loại 3 lớp (chuyên gia vận hành 31/10):
     1. loại hàng (gậy / ngọn lẻ / chuôi lẻ / nối / phụ kiện)
     2. dòng gậy theo BẢNG TÊN GỌI – tên gọi dài (cụ thể) nhất thắng, hòa giữa 2 dòng -> chờ duyệt (đỏ)
     3. 4 thông số = mặc định của dòng (file THÔNG SỐ GẬY) + đọc từ tên / ghi chú đơn (ren, tip, đầu, tay)
   Độ tin cậy: xanh (chắc), vàng (dùng mặc định / dòng chung), đỏ (không xác định). Chủ sở hữu sửa tay -> sheet PhanLoaiSKU,
   lần sau gặp đúng tên đó dùng luôn. Giai đoạn đầu chỉ tài khoản chủ sở hữu (qtQuyen_).
   ===================================================================== */
var DH_SHEET_ID = '1FKrF_wyQcl0SpDhvoRBg7VoaBzgzhSJ7zZ5U2A5ReMU';   // Sheet "Trạng thái đơn hàng" (chia sẻ cho tài khoản chạy web)
var DH_TABS = ['DEALER', 'KHO', 'WEB LẺ CUSTOM', 'WEB LẺ ĐƠN THƯỜNG', 'OEM', 'A ĐÔNG', 'POD-A.BÁCH', 'POD-ECOMSTONE'];   // 07/11: thêm kênh POD-ECOMSTONE (chưa có đơn vẫn là kênh)
var DH_NHAN_TAB = { 'DEALER': 'Dealer', 'KHO': 'Kho', 'WEB LẺ CUSTOM': 'Web lẻ – Custom', 'WEB LẺ ĐƠN THƯỜNG': 'Web lẻ – Thường', 'OEM': 'OEM', 'A ĐÔNG': 'A Đông', 'POD-A.BÁCH': 'POD – A.Bách', 'POD-ECOMSTONE': 'POD – Ecomstone' };
var DH_CACHE_GIAY = 300;   // Sheet đơn thay đổi liên tục: nhớ tạm 5 phút, có nút "Làm mới"
var PL_SHEET = 'PhanLoaiSKU';
var PL_COT = ['TenChuan', 'TenHang', 'LoaiHang', 'Dong', 'Chuoi', 'Ngon', 'Tip', 'Ren', 'GhiChu', 'NguoiSua', 'ThoiDiem'];
/* Cột bộ phận trong Sheet đơn (dò theo tiêu đề) -> chặng */
var DH_CHANG = [['PHOI', /^PHÔI CỦA/], ['SON', /^SƠN CỦA/], ['TARO', /^TARO CỦA/], ['TIP', /LÀM ĐẦU/], ['UV', /^UV CỦA/], ['HT', /^HOÀN THIỆN CỦA/], ['DG', /TỔNG CỘNG HÀNG ĐG|ĐÓNG GÓI CỦA/]];
/* 14/11 (chủ dự án chốt): nhập giao/nhận ngay trên dòng đơn như Sheet. 10 cột phụ ở cuối dòng (sau vùng ngày):
   ĐANG Ở BP, BP KẾ TIẾP + 7 cột "XN NHẬN <bộ phận>" (bộ phận sau bấm nhận, ghi SL · tài khoản · lúc) + XN HẸN (bộ phận sau đồng ý / không kịp với ngày hẹn). */
var DH_BP = [['PHOI', 'Phôi'], ['SON', 'Sơn'], ['TARO', 'Taro'], ['UV', 'UV'], ['HT', 'Hoàn thiện'], ['TIP', 'Làm đầu'], ['DG', 'Đóng gói']];   // 14/11: thứ tự theo luồng mới – ngọn Taro → Hoàn thiện → Làm đầu → trả Hoàn thiện → Đóng gói
var DH_BP_TEN = { PHOI: 'Phôi', SON: 'Sơn', TARO: 'Taro', TIP: 'Làm đầu', UV: 'UV', HT: 'Hoàn thiện', DG: 'Đóng gói' };
var DH_TD_COT = ['ĐANG Ở BP', 'BP KẾ TIẾP'].concat(DH_BP.map(function(b) { return 'XN NHẬN ' + b[1].toUpperCase(); })).concat(['XN HẸN']);   // 14/11 (Claude): XN HẸN = bộ phận sau đồng ý / không kịp với ngày hẹn của bộ phận trước
/* 14/11 (chủ dự án chốt): mỗi DÒNG Sheet = một MÃ SẢN PHẨM, cấu hình bán thành phẩm khác nhau nên SL / hẹn nhập theo mã đó,
   không nhập theo tổng đơn. Mặc định lấy từ luồng xưởng đã duyệt 31/10 (xem chú thích đầu mục ĐƠN HÀNG → XƯỞNG):
     chuôi: Phôi → Sơn → UV → Hoàn thiện → Đóng gói
     ngọn : Phôi → Taro → Hoàn thiện → Làm đầu → (trả Hoàn thiện) → Đóng gói   (14/11)
     gậy  : cả 2 nhánh nên đủ 7 bộ phận;  nối / phụ kiện: không qua xưởng
   Chủ dự án sửa riêng cho từng mã ở sheet BTPTheoSKU (màn Đơn hàng → dòng → Cấu hình bán thành phẩm). */
var DH_BTP_CD = { GAY: ['PHOI', 'SON', 'TARO', 'UV', 'HT', 'TIP', 'DG'], CHUOI: ['PHOI', 'SON', 'UV', 'HT', 'DG'], NGON: ['PHOI', 'TARO', 'HT', 'TIP', 'DG'], NOI: [], PK: [] };   // 14/11: ngọn qua Hoàn thiện trước và sau Làm đầu
var DH_BTP_SHEET = 'BTPTheoSKU', DH_BTP_COT = ['TenChuan', 'TenHang', 'BTP', 'NguoiSua', 'ThoiDiem'];

var PL_LOAI = { GAY: 'Gậy (ngọn + chuôi)', NGON: 'Ngọn bán lẻ', CHUOI: 'Chuôi bán lẻ', NOI: 'Tay nối', PK: 'Phụ kiện / không sản xuất' };
var PL_CHUOI = {
  GF736DP: 'GF 736 đánh phá', GF736HK: 'GF 736 hạ khấc (chỉ foam, có đạn)', GF740: 'GF 740 (1480/2) lót trắng – 5/16-18',
  GF1480: 'GF 1450/1480 chặt đôi', GFFOAM: 'GF 100% foam lót trắng (Cuebots CG)', GFCBFOAM: 'GF vỏ carbon 736 chỉ foam',
  GFCB313: 'GF vỏ carbon 31.3 (Cuebots Z)', MIXCB: 'Mix vỏ carbon 21.3/30.8 vách 2mm', MIXCB25: 'Mix vỏ carbon 21.3/30.8 vách 2.5mm (tay da)',
  MIXCBPHA: 'Mix vỏ carbon 21.3/31.3 (phá)', NHAY33013: 'Nhảy 330-130', NHAY28015: 'Nhảy 280-150', NHAY390: 'Nhảy 390', PHANHAY: 'Phá nhảy 350-385',
  NHAY305: 'Nhảy 305-205', VUTRU: 'Vũ trụ (Raptor)', ECL: 'Chuôi Eclipse lót bạc', CAROM: 'Carom 720', KHONG: '—'
};
var PL_NGON = {
  FC: 'Full carbon T700 747 (30")', FCPHA: 'Full carbon phá 13.0–13.2', FCNHAY: 'Full carbon nhảy 13.9', MIX: 'Mix carbon 29" 12.5 (EVO 1/2)',
  MIXFOAM: 'Mix chỉ foam T700 747', MIXPHA: 'Mix 29" phá 13.0–13.2', NHAY139: 'Nhảy 13.9 GF lõi / vỏ carbon', GF29: 'Glassfiber 29"',
  GF1480: 'GF 1480/2 – 1450/2', GFCB: 'GF vỏ carbon 736 12.5', G750CB: 'G750 bọc carbon (Z-Wave)', ZLUK: 'Mix carbon full foam (Z-Luk)',
  CAROM: 'Carom 710 12.0', KHONG: '—'
};
var PL_TIP = {
  TIME3: 'Time 3 (Crystal)', TIMEK: 'Time 9 xanh 1 đen', DEN7: 'Đen 7 lớp / microfiber', BAK: 'Bakelite (phá / nhảy)', NISHIKI: 'Nishiki',
  ZAN: 'Zan', KAMUI: 'Kamui', CB8: 'Cuebots 8 lớp da lợn', DALON: 'Da lợn', TIME4: 'Time 4 (carom)', KHONG: '—'
};
var PL_REN = { R388: '3/8-8', R3810: '3/8-10', R3811: '3/8-11', R3814: '3/8-14', R51614: '5/16-14', R51618: '5/16-18', UNI: 'Uniloc / UNI-QR',
  QLOC: 'Q-loc', RADIAL: 'Radial', VQR: 'Quick release (VQR)', PSJ: 'Speed joint (PSJ)', WAVY: 'Wavy', VP2: 'VP2', KHONG: '—' };

/* Bảng dòng gậy: [mã, tên, loại hàng, [tên gọi], chuôi, ngọn, tip, ren, chắc chắn?, chuôi khi tay da sport]
   Lấy từ file THÔNG SỐ GẬY (Rhino 2024/2025, EVO, Omega, Raptor, Cuebots, X-Billiards, A Ánh, Aplus) + tên hàng trong đơn 31/10. */
var PL_DONG = [
  ['EVO1', 'EVO 1 (Beast / Freedom / Rebel / Warrior)', 'GAY', ['EVO1', 'EVO 1', 'EVO BEAST', 'EVO FREEDOM', 'EVO REBEL', 'EVO WARRIOR'], 'GF736HK', 'MIX', 'TIMEK', 'R388', 1],
  ['EVO2', 'EVO 2 (Crown / Crystal / Recon)', 'GAY', ['EVO2', 'EVO 2', 'EVO CROWN', 'EVO RECON', 'EVO CRYSTAL'], 'GF736HK', 'MIX', 'TIMEK', 'R388', 1],
  ['EVO4', 'EVO 4 (Luna / Royale / Punisher / Camo)', 'GAY', ['EVO4', 'EVO 4', 'EVO LUNA', 'EVO ROYALE', 'EVO PUNISHER'], 'GF736HK', 'GF29', 'TIMEK', 'R3810', 1],
  ['EVO5', 'EVO 5 (Meg / Gemstone / Pirate)', 'GAY', ['EVO5', 'EVO 5', 'EVO MEG', 'EVO GEMSTONE', 'EVO PIRATE'], 'GF740', 'GF1480', 'DEN7', 'R51618', 1],
  ['EVOX', 'EVO phá X-1 / X-2 / X-Force', 'GAY', ['EVO/BREAK/X', 'X-FORCE', 'EVO X', 'GAY PHA TK'], 'GF736DP', 'MIXPHA', 'BAK', 'R388', 1],
  ['EVOVAL', 'EVO phá nhảy Valkyrie (VAL)', 'GAY', ['EVO/BREAK&JUMP/VAL', 'VALKYRIE', 'PHA NHAY EVO VAL', 'EVO VAL'], 'PHANHAY', 'MIXPHA', 'BAK', 'R388', 1],
  ['EVOPEG', 'EVO nhảy Pegasus (PEG, 3 khúc)', 'GAY', ['EVO/JUMP/PEG', 'PEGASUS', 'EVO PEG'], 'NHAY28015', 'NHAY139', 'BAK', 'R388', 1],
  ['EVOIG', 'EVO nhảy IG (2 khúc)', 'GAY', ['EVO/JUMP/IG', 'EVO IG'], 'NHAY390', 'NHAY139', 'BAK', 'R388', 1],
  ['EVOCHUNG', 'EVO (chưa rõ dòng)', 'GAY', ['EVO'], 'GF736HK', 'MIX', 'TIMEK', 'R388', 0],
  ['TKNHAY', 'Aplus SAM TK nhảy (390-100)', 'GAY', ['GAY NHAY TK', 'TK PRO', 'SAM TK'], 'NHAY390', 'NHAY139', 'BAK', 'R388', 1],
  ['PHANHAY2', 'Gậy phá nhảy chia 2 màu', 'GAY', ['GAY PHA NHAY CHIA 2 MAU', 'PHA NHAY CHIA 2 MAU'], 'PHANHAY', 'MIXPHA', 'BAK', 'R388', 0],
  ['CLUB', 'Gậy CLB / house (RHI68 / RHI88 / R68 / EVO6 Club)', 'GAY', ['RHI68', 'RHI88', 'R68', 'R88', 'CLUB & HOUSE', 'EVO6/CLUB', 'CLUB -', 'HOUSE CUE'], 'GF740', 'GF1480', 'DEN7', 'R51618', 1],
  ['CBCH', 'Cuebots CHS / CHL (1450 / 1480 chặt đôi)', 'GAY', ['CB-CH/', 'CHS1', 'CHS2', 'CHL1', 'CHL2', 'CHS', 'CHL'], 'GF1480', 'GF1480', 'DEN7', 'R51618', 1],
  ['CBCG', 'Cuebots CGW / CGC (ren 3/8-10)', 'GAY', ['CB-CG/', 'CGW', 'CGC'], 'GFFOAM', 'GF29', 'DEN7', 'R3810', 1],
  ['CBCGP', 'Cuebots CGP (Uniloc)', 'GAY', ['CB-CG/CGP', 'CGP'], 'GFFOAM', 'GF29', 'DEN7', 'UNI', 1],
  ['CBZ', 'Cuebots Z-Pure / Z Fusion (ZF)', 'GAY', ['CB-ZF/', 'Z FUSION', 'Z-FUSION', 'Z-PURE', 'Z PURE', 'Z-SP'], 'GFCB313', 'FC', 'CB8', 'R388', 1],
  ['CBZLUK', 'Cuebots Z-Luk', 'GAY', ['Z LUK', 'Z-LUK', 'ZLUK'], 'GFCB313', 'ZLUK', 'CB8', 'R388', 1],
  ['CBZW', 'Cuebots Z-Wave (ZW)', 'GAY', ['CB-ZW/', 'Z WAVE', 'Z-WAVE', 'ZWAVE'], 'GFCB313', 'G750CB', 'DEN7', 'RADIAL', 1],
  ['ALLINKS', 'Allin KS / Destiny (chuôi chỉ foam, ngọn G vỏ CB)', 'GAY', ['ALLIN-KS', 'ALLIN KS', 'ALLIN DESTINY'], 'GFCBFOAM', 'GFCB', 'DEN7', 'R388', 1],
  ['ALLINCRAZY', 'Allin Crazy', 'GAY', ['ALLIN CRAZY', 'CRAZY'], 'GF1480', 'GFCB', 'DEN7', 'R388', 1],
  ['WOLFWF', 'Wolf WF (poker)', 'GAY', ['WOLF-WF', 'WOLF WF'], 'GFCBFOAM', 'GFCB', 'DEN7', 'RADIAL', 1],
  ['WOLFCLB', 'Wolf CLB 1450/2', 'GAY', ['WOLF-CLB', 'WOLF CLB'], 'GF1480', 'GF1480', 'DEN7', 'R51618', 1],
  ['ALLINCHUNG', 'X-Billiards / Allin (chưa rõ dòng)', 'GAY', ['ALLIN', 'WOLF', 'LEGEND', 'CREST'], 'GF736HK', 'FC', 'DEN7', 'R388', 0],
  ['NEBULA', 'Rhino Nebula', 'GAY', ['NEBULA'], 'MIXCB', 'FC', 'TIME3', 'R388', 1, 'MIXCB25'],
  ['RETRO', 'Rhino Retro', 'GAY', ['RHI2-RETRO', 'RETRO II', 'RETRO'], 'MIXCB', 'FC', 'TIME3', 'R388', 1],
  ['MUST', 'Rhino Must', 'GAY', ['RHI2-MUST', 'RHINO MUST', 'MUST', 'MU1', 'MU2', 'MU3', 'MU4', 'MU5'], 'MIXCB', 'FC', 'TIME3', 'R388', 0],
  ['ECLIPSE', 'Rhino Eclipse II', 'GAY', ['RHI2-ECLIPSE', 'ECLIPSE II', 'ECLIPSE'], 'ECL', 'FC', 'NISHIKI', 'R388', 1],
  ['IRC', 'Rhino IRC', 'GAY', ['IRC'], 'ECL', 'FC', 'NISHIKI', 'R388', 1],
  ['BEER', 'Rhino Bia Hơi / Beer (cấu hình như Retro)', 'GAY', ['BIA HOI', 'GAY BEER'], 'MIXCB', 'FC', 'TIME3', 'R388', 1],
  ['KOMET', 'Rhino Komet 2 (phá)', 'GAY', ['KOMET', 'RHI2-KOMET'], 'MIXCBPHA', 'FCPHA', 'BAK', 'R388', 1],
  ['VOYAGER', 'Rhino Voyager đánh', 'GAY', ['VOYAGER', 'ALLSTAR'], 'MIXCB', 'FC', 'TIME3', 'R388', 1],
  ['VOYBREAK', 'Rhino Voyager phá', 'GAY', ['VOYAGER - USA BREAK', 'VOYAGER BREAK', 'USA BREAK'], 'MIXCBPHA', 'FCPHA', 'BAK', 'R388', 1],
  ['RHJUMP', 'Rhino nhảy (Jump / Parkour / Voyager Jump)', 'GAY', ['RHINO JUMP', 'PARKOUR', 'VOYAGER USA JUMP', 'USA JUMP'], 'NHAY33013', 'FCNHAY', 'BAK', 'R388', 1],
  ['LUMINAX', 'Rhino Luminax / Camo / Racing', 'GAY', ['LUMINAX', 'CAMO', 'RACING'], 'GFCBFOAM', 'MIXFOAM', 'TIME3', 'R388', 1],
  ['VIETNAM', 'Gậy Việt Nam (Tôi yêu VN / Lửa Việt)', 'GAY', ['LUA VIET', 'TOI YEU VN', 'VIET NAM'], 'MIXCB', 'FC', 'TIME3', 'R388', 0, 'MIXCB25'],
  ['OMEGA', 'Omega (Uniloc)', 'GAY', ['OMEGA'], 'GF736HK', 'MIXFOAM', 'TIMEK', 'UNI', 1],
  ['RAPTOR', 'Raptor', 'GAY', ['RAPTOR'], 'VUTRU', 'FC', 'KAMUI', 'UNI', 1],
  ['DRAGON', 'Dragon / Aileex Lux / Legend', 'GAY', ['DRAGON', 'AILEEX', 'LUX'], 'GF736HK', 'FC', 'TIME3', 'R388', 1],
  ['CAROM', 'Carom 2025', 'GAY', ['CAROM'], 'CAROM', 'CAROM', 'TIME4', 'R388', 1],
  ['THUE', 'Gậy thuê (chưa có thông số)', 'GAY', ['GAY THUE'], 'GF736DP', 'GFCB', 'DALON', 'R388', 0],
  // Ngọn bán lẻ (đi Phôi → Taro → Tip → thẳng Đóng gói)
  ['NG-RHINO', 'Ngọn carbon Rhino (single shaft)', 'NGON', ['SINGLE SHAFT', 'SNOOKER & ENGLISH POOL SHAFT', 'C30PT', 'NGON DANH CARBON RHINO', 'MUST SHAFT', 'SHAFT ONLY'], 'KHONG', 'FC', 'TIME3', '', 1],
  ['NG-BREAK', 'Ngọn phá carbon', 'NGON', ['BREAK SHAFT'], 'KHONG', 'FCPHA', 'BAK', 'R388', 1],
  ['NG-KOMET', 'Ngọn Komet 2 (phá, 13.0, ren 3/8-8)', 'NGON', ['KOMET BREAK SHAFT', 'KOMET II', 'KOMET'], 'KHONG', 'FCPHA', 'BAK', 'R388', 1],
  ['NG-CAROM', 'Ngọn carom carbon', 'NGON', ['CAROM SINGLE SHAFT'], 'KHONG', 'CAROM', 'TIME4', '', 1],
  ['NG-ZWAVE', 'Ngọn Z-Wave', 'NGON', ['Z-WAVE CARBON SINGLE SHAFT', 'NGON DANH ZWAVE'], 'KHONG', 'G750CB', 'DEN7', '', 1],
  ['NG-ZNITRO', 'Ngọn Cuebots Z-Nitro', 'NGON', ['Z NITRO', 'Z-NITRO'], 'KHONG', 'FC', 'CB8', 'R388', 1],
  ['NG-HORNET', 'Ngọn nhảy Hornet', 'NGON', ['HORNET'], 'KHONG', 'NHAY139', 'BAK', 'R388', 0],
  ['NG-CREST', 'Ngọn đánh Crest', 'NGON', ['CREST S'], 'KHONG', 'FC', 'ZAN', 'R388', 0],
  ['NG-CHUNG', 'Ngọn lẻ (chưa rõ dòng)', 'NGON', [], 'KHONG', 'FC', 'TIME3', '', 0],
  // Chuôi bán lẻ
  ['CH-LUMINAX', 'Chuôi Luminax / Racing', 'CHUOI', ['LUMINAX CUE BUTT', 'RACING CUE BUTT'], 'GFCBFOAM', 'KHONG', 'KHONG', 'R388', 1],
  ['CH-RETRO', 'Chuôi Retro (mix vỏ carbon, hạ khấc bạc)', 'CHUOI', ['RETRO POOL CUE BUTT', 'RETRO CUE BUTT'], 'MIXCB', 'KHONG', 'KHONG', 'R388', 1],
  ['CH-RHINO', 'Chuôi Rhino (chưa rõ dòng, vd. Must)', 'CHUOI', ['MUST CUE BUTT', 'CUE BUTT'], 'MIXCB', 'KHONG', 'KHONG', 'R388', 0],
  ['NOI', 'Tay nối (extension)', 'NOI', [], 'KHONG', 'KHONG', 'KHONG', 'KHONG', 1],
  ['PK', 'Phụ kiện', 'PK', [], 'KHONG', 'KHONG', 'KHONG', 'KHONG', 1]
];

var PL_DAU_MD = { 'NG-ZWAVE': '12.5', 'NG-KOMET': '13.0', 'KOMET': '13.0', 'CBZW': '12.5', 'CBZ': '12.5', 'CBZLUK': '12.5' };   // đầu mặc định theo Thông số gậy
function plChuan_(s) {   // HOA, bỏ dấu, gộp khoảng trắng – để so tên gọi
  return String(s || '').toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/Đ/g, 'D').replace(/[–—]/g, '-')
    .replace(/[“”"″]/g, '"').replace(/\s+/g, ' ').trim();
}
var __PL_RE = null;
function plDongRe_() {
  if (__PL_RE) return __PL_RE;
  __PL_RE = [];
  PL_DONG.forEach(function(d) {
    (d[3] || []).forEach(function(a) {
      var e = plChuan_(a).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      var sau = /[A-Z0-9]$/.test(plChuan_(a)) ? '(?=$|[^A-Z])' : '';   // sau tên gọi được có số (RHI2-KOMET2, VAL1); tên gọi kết thúc bằng "/" thì không cần ranh giới
      __PL_RE.push({ dong: d[0], loai: d[2], dai: a.length, re: new RegExp('(?:^|[^A-Z0-9])' + e + sau) });
    });
  });
  return __PL_RE;
}
function plTimDong_(ma) { for (var i = 0; i < PL_DONG.length; i++) if (PL_DONG[i][0] === ma) return PL_DONG[i]; return null; }

/* Loại hàng từ tên + ghi chú đơn */
function plLoaiHang_(t, g) {
  if (/CHI DAT NOI/.test(g)) return 'NOI';
  if (/GLOVE|CUE CASE|SOFT CUE CASE|HARD CUE CASE|T-SHIRT|POLO|PATCH|WEIGHT BOLT|JOINT TESTER|POOL CUE TIP|^NISHIKI|^ZAN TIP|BAO CO|GANG TAY/.test(t)) return 'PK';
  if (/EXTENSION|(^|[^A-Z])NOI([^A-Z]|$)|TAY NOI/.test(t)) return 'NOI';
  if (/CUE BUTT|BUTT ONLY/.test(t) || /CHI GUI CHUOI/.test(g)) return 'CHUOI';
  if (/SHAFT|^NGON|C30PT/.test(t) || /CHI GUI NGON/.test(g)) return 'NGON';
  return 'GAY';
}
/* Ren đọc từ tên / ghi chú. Trả mã PL_REN hoặc '' */
function plRen_(t, g) {
  var x = t + ' | ' + g;
  var m = x.match(/JOINT(?: TYPE)?:*\s*([^_|]+)/);   // "_Joint: 3/8-10" trong ghi chú đơn web ưu tiên
  var tim = function(s) {
    if (/UNI-?QR|UNILOC|\/U\//.test(s)) return 'UNI';
    if (/Q-?LOC/.test(s)) return 'QLOC';
    if (/VQR|QUICK RELEASE/.test(s)) return 'VQR';
    if (/PSJ|SPEED JOINT/.test(s)) return 'PSJ';
    if (/WAVY/.test(s)) return 'WAVY';
    if (/VP2/.test(s)) return 'VP2';
    if (/RADIAL/.test(s)) return 'RADIAL';
    if (/5\/16[-\/ ]?14/.test(s)) return 'R51614';
    if (/5\/16[-\/ ]?18|51618|\/18\//.test(s)) return 'R51618';
    if (/3\/8[-\/ ]?14/.test(s)) return 'R3814';
    if (/3\/8[-\/ ]?11/.test(s)) return 'R3811';
    if (/3\/8[-\/ ]?10|\/10\//.test(s)) return 'R3810';
    if (/3\/8[-\/ ]?8|\/388\/|\(3\/8-8\)/.test(s)) return 'R388';
    return '';
  };
  if (m) { var r1 = tim(m[1]); if (r1) return r1; }
  var r = tim(x);
  if (r) return r;
  var c = t.match(/C30PT[\d.]+\/[\d.,]+\/(\w+)/);   // RHI2-C30PT21.5/11.8/18
  if (c) return { '18': 'R51618', '10': 'R3810', '8': 'R388', 'QLOC': 'QLOC', 'U': 'UNI' }[c[1]] || '';
  return '';
}
function plTip_(t, g) {
  var x = t + ' | ' + g;
  if (/NISHIKI/.test(x)) return 'NISHIKI';
  if (/ZAN TIP|TIP ZAN/.test(x)) return 'ZAN';
  if (/KAMUI/.test(x)) return 'KAMUI';
  if (/TIP DA LON|PIG SKIN/.test(x)) return 'DALON';
  if (/TIME CRYSTAL|NEW TIME/.test(x)) return 'TIME3';
  return '';
}
function plDau_(t) {   // đường kính đầu ngọn
  var m = t.match(/(?:^|[^\d.])(9\.5|10\.5|1[0-4][.,]\d)(?:\s*MM)?(?=$|[^\d])/);
  if (m) return m[1].replace(',', '.');
  m = t.match(/(?:^|[^\d.])(1[0-4])\s*MM/);   // "Carom Single Shaft 12mm"
  return m ? m[1] + '.0' : '';
}
function plTay_(t) {
  if (/SPORT WRAP|SPORT/.test(t)) return 'SPORT';
  if (/WRAPLESS|\/NW\/|TAY TRON/.test(t)) return 'TRON';
  if (/LEATHER WRAP|\/LW|TAY DA/.test(t)) return 'DA';
  return '';
}

/* Phân loại 1 dòng hàng. sua = bản sửa tay (PhanLoaiSKU) nếu có */
/* Kiểu gậy + chất liệu (01/11, chủ dự án): Đánh / Nhảy / Phá / Phá nhảy; Full carbon → Mix carbon+GF → Glassfiber.
   GF vỏ carbon / G750 bọc carbon / nhảy 13.9 GF lõi vỏ carbon = Mix. Chuôi bán lẻ lấy chất liệu theo chuôi, còn lại theo ngọn. */
var PL_KIEU = { DANH: 'Đánh', NHAY: 'Nhảy', PHA: 'Phá', PHANHAY: 'Phá nhảy' };
var PL_VL = { FC: 'Full carbon', MIX: 'Mix carbon + glassfiber', GF: 'Glassfiber', KHAC: 'Khác / chưa rõ' };
var PL_VL_NGON = { FC: 'FC', FCPHA: 'FC', FCNHAY: 'FC', MIX: 'MIX', MIXFOAM: 'MIX', MIXPHA: 'MIX', NHAY139: 'MIX', GFCB: 'MIX', G750CB: 'MIX', ZLUK: 'MIX', GF29: 'GF', GF1480: 'GF' };
var PL_VL_CHUOI = { MIXCB: 'MIX', MIXCB25: 'MIX', MIXCBPHA: 'MIX', GFCBFOAM: 'MIX', GFCB313: 'MIX', GF736DP: 'GF', GF736HK: 'GF', GF740: 'GF', GF1480: 'GF', GFFOAM: 'GF' };
function plKieu_(o) {
  var c = o.chuoi || '', n = o.ngon || '';
  var kc = PL_KIEU_KHUC[c] || '', kn = PL_KIEU_KHUC[n] || '';   // 02/11: kiểu của loại chuôi / ngọn chủ dự án thêm trên web
  o.kieu = (c === 'PHANHAY' || kc === 'PHANHAY' || kn === 'PHANHAY') ? 'PHANHAY' : (/PHA$/.test(n) || c === 'GF736DP' || c === 'MIXCBPHA' || kc === 'PHA' || kn === 'PHA') ? 'PHA' : (/NHAY/.test(n) || /^NHAY/.test(c) || kc === 'NHAY' || kn === 'NHAY') ? 'NHAY' : 'DANH';
  o.vl = (o.loai === 'CHUOI' ? PL_VL_CHUOI[c] : (PL_VL_NGON[n] || PL_VL_CHUOI[c])) || 'KHAC';
  /* 02/11 (chủ dự án): 2 nhãn chất liệu – chuôi và ngọn có thể khác nhau. '' = SKU không có khúc đó */
  var coC = o.loai === 'GAY' || o.loai === 'CHUOI', coN = o.loai === 'GAY' || o.loai === 'NGON';
  o.vlC = coC ? (PL_VL_CHUOI[c] || 'KHAC') : '';
  o.vlN = coN ? (PL_VL_NGON[n] || 'KHAC') : '';
  return o;
}
function plPhanLoai_(ten, ghiChu, sua) { return plKieu_(plPhanLoai0_(ten, ghiChu, sua)); }
function plPhanLoai0_(ten, ghiChu, sua) {
  var t = plChuan_(ten), g = plChuan_(ghiChu);
  var o = { loai: '', dong: '', chuoi: '', ngon: '', tip: '', ren: '', dau: plDau_(t), tay: plTay_(t), tin: 'xanh', nguon: 'tu-dong', lyDo: [] };
  if (sua) {
    o.loai = sua.LoaiHang; o.dong = sua.Dong; o.chuoi = sua.Chuoi; o.ngon = sua.Ngon; o.tip = sua.Tip; o.ren = sua.Ren;
    o.nguon = 'duyet'; return o;
  }
  o.loai = plLoaiHang_(t, g);
  if (o.loai === 'NGON' && /C30PT/.test(t)) t = t + ' SINGLE SHAFT';   // RHI2-C30PT21.5/11.8/18 = ngọn carbon 30" bán lẻ
  if (o.loai === 'PK' || o.loai === 'NOI') { o.dong = o.loai; o.chuoi = o.ngon = o.tip = 'KHONG'; o.ren = 'KHONG'; return o; }
  // dòng: tên gọi dài nhất thắng, chỉ xét dòng cùng loại hàng (gậy / ngọn / chuôi)
  var best = 0, ds = {};
  plDongRe_().forEach(function(a) {
    if (a.loai !== o.loai || !a.re.test(t)) return;
    if (a.dai > best) { best = a.dai; ds = {}; }
    if (a.dai === best) ds[a.dong] = 1;
  });
  var tim = Object.keys(ds);
  if (tim.length > 1) { o.tin = 'do'; o.lyDo.push('khớp nhiều dòng: ' + tim.join(', ')); }
  var d = plTimDong_(tim[0] || (o.loai === 'NGON' ? 'NG-CHUNG' : ''));
  if (!d) { o.tin = 'do'; o.lyDo.push('không nhận ra dòng gậy'); o.chuoi = o.loai === 'NGON' ? 'KHONG' : ''; o.ngon = o.loai === 'CHUOI' ? 'KHONG' : ''; o.tip = ''; o.ren = plRen_(t, g); return o; }
  o.dong = d[0];
  o.chuoi = (o.tay === 'SPORT' && d[9]) ? d[9] : d[4];
  o.ngon = d[5]; o.tip = d[6];
  if (!d[8] && o.tin === 'xanh') { o.tin = 'vang'; o.lyDo.push('dòng chung / chưa có thông số chắc chắn'); }
  var ren = plRen_(t, g);
  if (ren) o.ren = ren;
  else if (d[7]) { o.ren = d[7]; if (o.loai === 'NGON' && o.tin === 'xanh') { o.tin = 'vang'; o.lyDo.push('ren lấy mặc định của dòng'); } }
  else { o.ren = ''; if (o.tin !== 'do') { o.tin = 'vang'; o.lyDo.push('chưa đọc được ren'); } }
  var tip = plTip_(t, g);
  if (tip) o.tip = tip;
  if (!o.dau && PL_DAU_MD[d[0]]) o.dau = PL_DAU_MD[d[0]];
  if (o.loai === 'NGON' && !o.dau && o.tin === 'xanh' && o.ngon !== 'FCPHA' && o.ngon !== 'NHAY139' && o.ngon !== 'FCNHAY') { o.tin = 'vang'; o.lyDo.push('chưa đọc được đường kính đầu'); }
  return o;
}

/* ---------- đọc Sheet đơn hàng (chỉ đọc) ---------- */
function dhSo_(v) {
  if (typeof v === 'number') return isFinite(v) ? v : 0;
  var s = String(v == null ? '' : v).replace(/,/g, '').trim();
  return /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : 0;   // chữ / ngày / "chờ phôi" -> 0 (không đoán số từ chuỗi lạ)
}
function dhNgay_(v, nam) {   // deadline dd/mm (Sheet hay đảo ngày/tháng) -> 'yyyy-mm-dd'
  var d, m;
  if (Object.prototype.toString.call(v) === '[object Date]') {
    if (isNaN(v.getTime())) return '';
    var dd = Number(Utilities.formatDate(v, TZ_VN, 'dd')), mm = Number(Utilities.formatDate(v, TZ_VN, 'MM'));
    if (dd > 12) { d = dd; m = mm; } else { d = mm; m = dd; }   // giống script đơn hàng: ngày ≤ 12 là bị đảo
  } else {
    var x = String(v || '').match(/(\d{1,2})\s*\/\s*(\d{1,2})/);
    if (!x) return '';
    d = Number(x[1]); m = Number(x[2]);
  }
  if (!(d >= 1 && d <= 31 && m >= 1 && m <= 12)) return '';
  return nam + '-' + ('0' + m).slice(-2) + '-' + ('0' + d).slice(-2);
}
function dhDocTab_(sh, tab, nam, gioiHan, meta) {
  // Chỉ đọc tới cột cần dùng (Sheet có hàng trăm cột "ngày nhận hàng" phía sau); tab tự thêm: giới hạn số dòng (02/11)
  var nr = sh.getLastRow(), nc = Math.min(sh.getLastColumn(), 60);
  if (gioiHan && nr > gioiHan) nr = gioiHan;
  if (nr < 2 || nc < 2) return [];
  var dau = sh.getRange(1, 1, Math.min(nr, 10), nc).getValues(), hi = -1;
  for (var r = 0; r < dau.length; r++) {
    var j = dau[r].join('|').toUpperCase();
    if (j.indexOf('LOẠI HÀNG') >= 0 || j.indexOf('SL ĐẶT') >= 0) { hi = r; break; }
  }
  if (hi < 0) return [];
  var h = dau[hi].map(function(x) { return String(x == null ? '' : x).trim().toUpperCase(); });
  var tim = function(ks) { for (var i = 0; i < h.length; i++) for (var k = 0; k < ks.length; k++) if (h[i].indexOf(ks[k]) >= 0) return i; return -1; };
  var cTen = tim(['LOẠI HÀNG']), cPhoi = tim(['LOẠI PHÔI']), cSL = tim(['SỐ LƯỢNG ĐẶT', 'SL ĐẶT']), cThieu = tim(['CÒN THIẾU']), cDL = tim(['DEADLINE']), cCT = tim(['CHÚ THÍCH']), cKenh = tim(['KÊNH', 'NGUỒN ĐƠN']), cHanMoi = tim(['HẠN MỚI']), cGiao = tim(['CÓ THỂ GIAO']), cTra = tim(['ĐÃ TRẢ KHÁCH', 'HÀNG ĐI']);
  if (cTen < 0) cTen = 1;
  var chang = {}, hong = {}, hen = {};
  /* 07/11 (theo ORDER·FLOW): cột "Ngày hẹn trả …" của từng công đoạn (BP60 = Phôi) */
  h.forEach(function(x, i) { if (x.indexOf('NGÀY HẸN TRẢ') < 0) return; var k = /BP60|PHÔI/.test(x) ? 'PHOI' : /SƠN/.test(x) ? 'SON' : /TARO/.test(x) ? 'TARO' : /TIP|ĐẦU/.test(x) ? 'TIP' : /UV/.test(x) ? 'UV' : /HT|HOÀN THIỆN/.test(x) ? 'HT' : ''; if (k && hen[k] == null) hen[k] = i; });
  DH_CHANG.forEach(function(c) {
    for (var i = 0; i < h.length; i++) if (c[1].test(h[i])) {
      chang[c[0]] = i;
      for (var k = i + 1; k <= i + 3 && k < h.length; k++) if (/HỎNG/.test(h[k])) { hong[c[0]] = k; break; }   // "Hỏng cần làm bù" đứng ngay sau cột bộ phận
      break;
    }
  });
  var cMax = Math.max.apply(null, [cTen, cPhoi, cSL, cThieu, cDL, cCT, cKenh, cHanMoi, cGiao, cTra].concat(Object.keys(chang).map(function(k) { return chang[k]; }), Object.keys(hong).map(function(k) { return hong[k]; }), Object.keys(hen).map(function(k) { return hen[k]; }))) + 1;
  if (meta) { meta.hdr = hi + 1; meta.qty = chang; meta.hen = hen; meta.ten = cTen; meta.sl = cSL; meta.thieu = cThieu; meta.dl = cDL; }   // 14/11: cột bộ phận để ghi đúng ô khi lưu giao/nhận
  var v = sh.getRange(1, 1, nr, Math.max(1, cMax)).getValues();
  var out = [], ma = '', trong = 0, uuDon = '', nhom = '';   // nhom: dòng tiêu đề nhóm ghi tên kênh (tab HT chép nhiều kênh vào 1 tab)
  for (var r2 = hi + 1; r2 < v.length; r2++) {
    var row = v[r2], ten = String(row[cTen] == null ? '' : row[cTen]).trim(), m0 = String(row[0] == null ? '' : row[0]).trim();
    if (!ten && !m0) { if (++trong >= 200) break; continue; }
    trong = 0;
    if (dhSo_(row[cSL]) <= 0) { var kn0 = dhKenhTen_(m0) || dhKenhTen_(ten); if (kn0) { nhom = kn0; continue; } }
    if (dhLaGhiChu_(m0, ten, row)) continue;   // 07/11 (theo ORDER·FLOW): dòng ghi chú chung ("CẦN THÊM … 300PCS/TUẦN") không phải đơn, không đổi mã đơn
    if (m0 && dhLaMa_(m0)) { ma = m0; uuDon = dhUuTien_(m0) ? ma : ''; }   // 07/11: mã nhóm không có chữ số (vd #DEMO) vẫn là mã đơn   // 03/11: "ưu tiên" ở ô mã đơn -> cả đơn ưu tiên (các dòng sau cùng mã)
    var sl = dhSo_(row[cSL]);
    if (!ten || sl <= 0) continue;
    var o = { tab: tab, kenh: DH_NHAN_TAB[tab] || tab, dong: r2 + 1, maDon: m0 || ma, ten: ten.replace(/\s+/g, ' '), ghiChu: [cPhoi >= 0 ? row[cPhoi] : '', cCT >= 0 ? row[cCT] : ''].map(function(x) { return String(x == null ? '' : x).replace(/\s+/g, ' ').trim(); }).filter(Boolean).join(' · ').slice(0, 300),
      sl: sl, thieu: cThieu >= 0 ? Math.max(0, dhSo_(row[cThieu])) : Math.max(0, sl - (cTra >= 0 ? dhSo_(row[cTra]) : 0)),   // không có cột "Còn thiếu" -> đặt − đã trả (không coi là đã xong)
      dl: cDL >= 0 ? dhNgay_(row[cDL], nam) : '', qua: {}, hong: {},
      giao: cGiao >= 0 ? Math.max(0, dhSo_(row[cGiao])) : 0, daTra: cTra >= 0 ? Math.max(0, dhSo_(row[cTra])) : 0,
      phoi: cPhoi >= 0 ? String(row[cPhoi] == null ? '' : row[cPhoi]).replace(/\s+/g, ' ').trim().slice(0, 120) : '',
      chuThich: cCT >= 0 ? String(row[cCT] == null ? '' : row[cCT]).replace(/\s+/g, ' ').trim().slice(0, 200) : '' };
    dhMaDon_(o, nam);
    var uu = [];   // 03/11 (chủ dự án): mã có chữ "ưu tiên" ở bất kỳ ô nào của dòng (cột loại phôi, hạn mới, ghi chú…); giữ lời ghi kèm
    for (var cu = (m0 && dhLaMa_(m0)) ? 1 : 0; cu < row.length; cu++) { var t = row[cu]; if (typeof t === 'string' && dhUuTien_(t)) { t = t.replace(/\s+/g, ' ').trim(); if (uu.indexOf(t) < 0) uu.push(t); } }
    if (uu.length) o.uuTien = uu.join(' · ').slice(0, 160);
    if (uuDon && o.maDon === uuDon) { o.uuDon = 1; o.uuTien = 'Cả đơn ưu tiên' + (o.uuTien ? ' · ' + o.uuTien : ''); }
    Object.keys(chang).forEach(function(k) {   // ô trống = chưa ghi (bỏ qua), khác với ghi số 0
      var cell = row[chang[k]];
      if (typeof cell === 'number' || /^\s*\d+(\.\d+)?\s*$/.test(String(cell == null ? '' : cell))) o.qua[k] = Math.min(sl, Math.max(0, dhSo_(cell)));
    });
    Object.keys(hong).forEach(function(k) { var x = dhSo_(row[hong[k]]); if (x > 0) o.hong[k] = Math.min(sl, x); });
    Object.keys(hen).forEach(function(k) { var x = dhNgay_(row[hen[k]], nam); if (x) (o.hen = o.hen || {})[k] = x; });
    if (cHanMoi >= 0) { var hm = dhNgay_(row[cHanMoi], nam); if (hm) o.hanMoi = hm; }
    if (cKenh >= 0) { var kc = dhKenhTen_(row[cKenh]); if (kc) o.kenhCot = kc; }
    if (nhom) o.kenhNhom = nhom;
    out.push(o);
  }
  return out;
}
/* 07/11 (theo ORDER·FLOW): dòng ghi chú chung trong Sheet đơn – có từ khóa ghi chú và ít ô có dữ liệu */
var DH_GHI_CHU = /CHÚ Ý|\bNOTE\b|TẤT CẢ CÁC GẬY|DÙNG CHO|CẦN THÊM|STOCK KHO|CẬP NHẬT|TRỌNG LƯỢNG|1 TUẦN|\/TUẦN|HỢP ĐỒNG|\bHSG\b/;
function dhLaGhiChu_(m0, ten, row) {
  var t = (String(m0 || '') + ' ' + String(ten || '')).toUpperCase(); if (!DH_GHI_CHU.test(t)) return false;
  var n = 0; for (var i = 0; i < row.length && n <= 4; i++) if (String(row[i] == null ? '' : row[i]).trim() !== '') n++;
  return n <= 4;
}
/* 07/11: chữ trong ô -> tên tab kênh chuẩn (DEALER, KHO, … hoặc nhãn "Dealer", "POD – A.Bách") */
function dhKenhTen_(t) {
  var c = plChuan_(String(t == null ? '' : t)).replace(/[^A-Z0-9]/g, ''); if (!c || c.length > 24) return '';
  for (var i = 0; i < DH_TABS.length; i++) { var a = DH_TABS[i]; if (plChuan_(a).replace(/[^A-Z0-9]/g, '') === c || plChuan_(DH_NHAN_TAB[a] || '').replace(/[^A-Z0-9]/g, '') === c) return a; }
  return '';
}
/* mã đơn: ngắn, không phải câu ghi chú (ORDER·FLOW giữ cả mã không có chữ số như #DEMO) */
/* 09/11: ô bắt đầu bằng "#" là mã đơn dù dài / nhiều chữ (vd "#ĐƠN TRẢ HÀNG TUẦN (09/11-14/11)" – trước đây quá 4 chữ nên các dòng sau bị gán vào mã liền trước "#31/10") */
function dhLaMa_(m0) { m0 = String(m0 || '').trim(); if (!m0 || DH_GHI_CHU.test(m0.toUpperCase())) return false; if (/^#/.test(m0)) return m0.length <= 60; return m0.length <= 40 && m0.split(/\s+/).length <= 4; }
/* 03/11: nhận chữ "ưu tiên" (hoa / thường, có / không dấu) */
function dhUuTien_(t) { return /\bUU\s*TIEN\b/.test(plChuan_(t)); }
/* 13/11: khóa tên hàng để đối chiếu tab ĐƠN ƯU TIÊN với Kho (mã trong tab ưu tiên có tiền tố #NEW-/#KHO- nên không trùng mã Kho) */
function dhTenKhoa_(t) { return String(t == null ? '' : t).toUpperCase().replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim(); }
/* 13/11: tab có dấu cách ở đầu/cuối tên (vd " POD-ECOMSTONE") – getSheetByName không tìm ra, nên tìm thêm theo tên đã cắt */
function dhTimTab_(ss, ten) {
  var sh = ss.getSheetByName(ten); if (sh) return sh;
  var a = ss.getSheets(), t = String(ten).trim().toUpperCase();
  for (var i = 0; i < a.length; i++) if (String(a[i].getName()).trim().toUpperCase() === t) return a[i];
  return null;
}
/* Mã đơn "RHINO-22/06" -> người đặt + ngày đặt (giống web app đơn hàng); deadline trước ngày đặt -> sang năm sau */
var DH_HOM_ = '';
function dhMaDon_(o, nam) {
  var s = String(o.maDon || ''), m = s.match(/(\d{1,2})\s*\/\s*(\d{1,2})/);
  o.nguoiDat = s.replace(/^[#(\s]+/, '').split(/[-–]\s*\d{1,2}\s*\//)[0].replace(/\d+.*$/, '').replace(/[-–()\s]+$/, '').trim().slice(0, 40);
  if (!/[A-Za-zÀ-ỹ]/.test(o.nguoiDat)) o.nguoiDat = '';
  o.ngayDat = '';
  if (m && Number(m[1]) >= 1 && Number(m[1]) <= 31 && Number(m[2]) >= 1 && Number(m[2]) <= 12) {
    o.ngayDat = nam + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[1]).slice(-2);
    if (o.ngayDat > (DH_HOM_ || (DH_HOM_ = homNayVN_()))) o.ngayDat = (nam - 1) + o.ngayDat.slice(4);   // đặt tháng 12 năm trước
    if (o.dl && o.dl < o.ngayDat) o.dl = (Number(o.dl.slice(0, 4)) + 1) + o.dl.slice(4);
  }
  return o;
}
/* ===== 14/11: giao/nhận theo bộ phận – dò 10 cột phụ cuối dòng, quyền theo xưởng của tài khoản ===== */
function dhCotTheoDoi_(sh, nr, hr) {   // -> {tên cột: số cột 1-based} đã có trong Sheet (null nếu chưa tạo). hr = dòng tiêu đề (1-based)
  var last = sh.getLastColumn();
  if (last < 2) return null;
  var h = sh.getRange(Math.max(1, hr || 1), 1, 1, last).getValues()[0].map(function(x) { return String(x == null ? '' : x).trim().toUpperCase(); });
  var idx = {}, co = 0;
  DH_TD_COT.forEach(function(n) { var i = h.indexOf(n); if (i >= 0) { idx[n] = i + 1; co++; } });
  return co ? idx : null;
}
function dhDocTheoDoi_(sh, nr, idx) {   // đọc 1 lần vùng cột phụ -> {dòng: {o, k, x:{PHOI,...}}}
  var cot = Object.keys(idx).map(function(k) { return idx[k]; });
  var c0 = Math.min.apply(null, cot), c1 = Math.max.apply(null, cot);
  var v = sh.getRange(1, c0, nr, c1 - c0 + 1).getValues();
  var pos = {};
  DH_TD_COT.forEach(function(n) { pos[n] = idx[n] ? idx[n] - c0 : -1; });
  var out = {};
  for (var r = 1; r < v.length; r++) {
    var row = v[r], x = { x: {} }, co = false;
    if (pos['ĐANG Ở BP'] >= 0) { var a = String(row[pos['ĐANG Ở BP']] == null ? '' : row[pos['ĐANG Ở BP']]).trim().toUpperCase(); if (a) { x.o = a; co = true; } }
    if (pos['BP KẾ TIẾP'] >= 0) { var b = String(row[pos['BP KẾ TIẾP']] == null ? '' : row[pos['BP KẾ TIẾP']]).trim().toUpperCase(); if (b) { x.k = b; co = true; } }
    DH_BP.forEach(function(bp) {
      var j = pos['XN NHẬN ' + bp[1].toUpperCase()];
      if (j >= 0) { var s = String(row[j] == null ? '' : row[j]).replace(/\s+/g, ' ').trim(); if (s) { x.x[bp[0]] = s; co = true; } }
    });
    if (pos['XN HẸN'] >= 0) { var hx = String(row[pos['XN HẸN']] == null ? '' : row[pos['XN HẸN']]).trim(); if (hx) { x.h = dhXnHenDoc_(hx); co = true; } }
    if (co) out[r + 1] = x;
  }
  return out;
}
/* Tài khoản -> bộ phận: dựa vào MaXuong / tên xưởng trong Sheet PhongBan (mã thật: PHOICB, PHOITHO, NGONTARO, NGONTIP, SON, INUV, HT, DG…) */
function dhBoPhanCua_(me) {
  var s = (String(me && me.xuong || '') + ' ' + String(me && me.tenXuong || '')).toUpperCase();
  var tu = function(m) { return new RegExp('(^|[^A-Z])' + m + '([^A-Z]|$)').test(s); };   // tách theo ký tự không phải chữ (mã xưởng hay dính nhau: NGONTIP, INUV)
  if (/PHÔI|PHOI/.test(s)) return 'PHOI';
  if (/TARO/.test(s)) return 'TARO';
  if (/NGONTIP|LÀM ĐẦU|LAM DAU/.test(s) || tu('TIP')) return 'TIP';
  if (/INUV/.test(s) || tu('UV')) return 'UV';
  if (/ĐÓNG GÓI|DONG GOI/.test(s) || tu('DG')) return 'DG';
  if (/HOÀN THIỆN|HOAN THIEN/.test(s) || tu('HT')) return 'HT';
  if (/SƠN|SON\b/.test(s)) return 'SON';
  return '';
}
/* Ai được vào tab Đơn hàng: ban điều hành (ADMIN/OWNER) xem tất cả; TP/PP xem tất cả nhưng chỉ ghi bộ phận mình.
   OWNER được ghi thay mọi bộ phận (có ghi nhật ký). */
function dhQuyenDon_(token) {
  var me = docPhien_(token);
  if (!me) return { loi: sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' }) };
  if (me.vaiTro !== 'ADMIN' && me.vaiTro !== 'TP') return { loi: sach_({ ok: false, msg: 'Tab Đơn hàng mở cho ban điều hành và trưởng / phó phòng.' }) };
  var bp = dhBoPhanCua_(me);
  return { me: me, bp: bp, xemTatCa: true, sua: me.laOwner ? ['*'] : (bp ? [bp] : []), thay: !!me.laOwner };
}
function dhXoaCacheDon_() {
  try {
    var c = CacheService.getScriptCache(), k = DH_DON_KHOA, n = Number(c.get(k + '_n') || 0), ks = [];
    for (var i = 0; i < n; i++) ks.push(k + '_' + i);
    ks.push(k + '_n'); c.removeAll(ks);
  } catch (e) {}
}
/* Mọi dòng đơn (đã gộp 7 tab). Nhớ tạm DH_CACHE_GIAY giây: nén gzip rồi chia mảnh base64 < 100 KB mỗi khóa. */
var DH_DON_KHOA = 'DH_DON_v12';   // v12 (14/11): dn.h = XN HẸN
function dhDocDon_(lamMoi) {
  var c = CacheService.getScriptCache(), k = DH_DON_KHOA;   // v11 (14/11): thêm tabPhu (dòng tab ĐƠN ƯU TIÊN / TRỄ HẠN để web hiện đủ tab như Sheet)   // v10 (14/11): thêm dn (ĐANG Ở BP / KẾ TIẾP / XN NHẬN) + cot (bản đồ cột bộ phận) cho tab Đơn hàng dạng bảng   // v9 (13/11): nén gzip (11 khóa -> 1–2 khóa, đọc/ghi cache nhanh, tránh DEADLINE_EXCEEDED khi mở tab Đơn hàng)   // v8 (13/11): thêm tre (tab TRỄ HẠN) làm bậc 2 khi lên lịch SX   // v7 (13/11): ánh xạ tab ưu tiên sang Kho theo tên hàng   // v6 (07/11): thêm kênh POD-ECOMSTONE   // v5 (07/11): thêm uu (tab ĐƠN ƯU TIÊN)   // v4 (03/11): thêm uuTien / uuDon
  if (!lamMoi) {
    try {
      var n = Number(c.get(k + '_n') || 0);
      if (n > 0) {
        var ks = []; for (var i = 0; i < n; i++) ks.push(k + '_' + i);
        var all = c.getAll(ks), s = '';
        for (var j = 0; j < n; j++) { if (all[k + '_' + j] == null) { s = null; break; } s += all[k + '_' + j]; }
        if (s) {
          try { return JSON.parse(s); }   // bản không nén còn sót của khóa cũ
          catch (eJ) { return JSON.parse(Utilities.ungzip(Utilities.newBlob(Utilities.base64Decode(s), 'application/x-gzip')).getDataAsString()); }
        }
      }
    } catch (e) {}
  }
  var ss = SpreadsheetApp.openById(DH_SHEET_ID), nam = Number(Utilities.formatDate(new Date(), TZ_VN, 'yyyy')), ds = [], cot = {}, shTab = {};
  DH_TABS.forEach(function(tab) {
    var sh = dhTimTab_(ss, tab); if (!sh) return;
    var meta = {};
    ds = ds.concat(dhDocTab_(sh, tab, nam, DH_TAB_MOI_DONG, meta));   // 13/11: chặn trần 5.000 dòng/tab (tab bị dính dữ liệu thừa ở dòng rất xa làm getRange quá lớn -> DEADLINE_EXCEEDED)
    if (meta.hdr) { cot[tab] = meta; shTab[tab] = sh; }   // 14/11: giữ bản đồ cột (SL / hẹn từng bộ phận) để web hiện bảng như Sheet và ghi đúng ô
  });
  /* 02/11 (chủ dự án): tự đọc tab kênh mới có cột chuẩn ("Loại hàng…" + "Số lượng đặt") – bỏ tab lưu trữ và tab chủ dự án bấm "Bỏ qua" */
  var bo = dhTabBo_(), moi = [];
  ss.getSheets().forEach(function(sh) {
    var ten = String(sh.getName()).trim();   // 13/11: tab " POD-ECOMSTONE" có dấu cách đầu tên -> so theo tên đã cắt
    if (moi.length >= DH_TAB_MOI_MAX || DH_TABS.indexOf(ten) >= 0 || bo.indexOf(ten) >= 0 || DH_TAB_LOAI.test(ten)) return;
    try { if (sh.isSheetHidden && sh.isSheetHidden()) return; } catch (e) {}   // tab ẩn (tổng hợp / nháp): không đọc
    if (!dhCoCotChuan_(sh)) return;
    var meta = {}, r = dhDocTab_(sh, ten, nam, DH_TAB_MOI_DONG, meta);
    if (r.length) { ds = ds.concat(r); moi.push(ten); if (meta.hdr) { cot[ten] = meta; shTab[ten] = sh; } }
  });
  /* 14/11: đọc 10 cột phụ cuối dòng (ĐANG Ở BP / BP KẾ TIẾP / XN NHẬN …) – mỗi tab đọc 1 vùng, gắn vào dòng đơn theo số dòng Sheet */
  Object.keys(shTab).forEach(function(tab) {
    try {
      var sh = shTab[tab], nr = Math.max(1, Math.min(sh.getLastRow(), DH_TAB_MOI_DONG));
      var idx = dhCotTheoDoi_(sh, nr, cot[tab] && cot[tab].hdr); if (!idx) return;
      var dn = dhDocTheoDoi_(sh, nr, idx);
      ds.forEach(function(o) { if (o.tab === tab && dn[o.dong]) o.dn = dn[o.dong]; });
    } catch (eD) {}
  });
  /* 07/11 (chủ dự án): tab "ĐƠN ƯU TIÊN" (bản chép các mã ưu tiên, có hạn riêng) = nguồn của mục Ưu tiên; không cộng vào tổng */
  var uu = [], kenhMa = {}, tenMa = {}, phu = {};   // 14/11: phu = dòng của các tab bản chép (ĐƠN ƯU TIÊN / TRỄ HẠN) để web hiện đủ tab như Sheet, không cộng vào tổng
  ds.forEach(function(o) { if (o.maDon && !kenhMa[o.maDon]) kenhMa[o.maDon] = [o.tab, o.kenh]; });
  /* 13/11: mã trong tab ưu tiên (#NEW-17/10, #KHO-31/10, #21/10) không trùng mã Kho -> ánh xạ thêm theo TÊN HÀNG để biết đơn thuộc kênh nào và có trong Kho không */
  ds.forEach(function(o) { var t = dhTenKhoa_(o.ten); if (!t) return; var cu = tenMa[t]; if (!cu || (cu[0] !== 'KHO' && o.tab === 'KHO')) tenMa[t] = [o.tab, o.kenh]; });   // tên hàng có ở nhiều kênh: lấy Kho (tab ưu tiên là mã ở sẵn trong Kho)
  ss.getSheets().forEach(function(sh) {
    if (uu.length || plChuan_(sh.getName()) !== 'DON UU TIEN') return;
    var metaU = {}, raw = dhDocTab_(sh, sh.getName(), nam, DH_TAB_MOI_DONG, metaU);
    if (metaU.hdr) { cot[sh.getName()] = metaU; shTab[sh.getName()] = sh; }
    phu[sh.getName()] = raw.map(function(o) { o.phu = 1; return o; });
    uu = raw.map(function(o) {
      var c = {}; for (var kk in o) if (Object.prototype.hasOwnProperty.call(o, kk)) c[kk] = o[kk];
      var km = kenhMa[o.maDon] || tenMa[dhTenKhoa_(o.ten)];
      c.tab = km ? km[0] : 'UU_TIEN'; c.kenh = km ? km[1] : 'Ưu tiên'; c.tuTabUu = 1;
      c.trongKho = km && km[0] === 'KHO' ? 1 : 0;
      if (!c.uuTien) c.uuTien = 'Ưu tiên'; return c; });
  });
  /* 13/11 (chủ dự án): tab "TRỄ HẠN" – tên hàng đang trễ, dùng làm BẬC 2 khi lên lịch SX; chỉ lấy danh sách tên, không cộng vào tổng (đây là bản chép của các tab kênh).
     13/11: tab này có thể rất dài -> giới hạn số dòng và bọc lỗi riêng, để lỗi đọc tab trễ không làm hỏng cả tab Đơn hàng (DEADLINE_EXCEEDED). */
  var tre = [];
  try {
    var shTre = null;
    ss.getSheets().some(function(sh) { if (plChuan_(sh.getName()) === 'TRE HAN') { shTre = sh; return true; } return false; });
    if (shTre) {
      var metaT = {}, rawTre = dhDocTab_(shTre, shTre.getName(), nam, DH_TAB_MOI_DONG, metaT);
      if (metaT.hdr) { cot[shTre.getName()] = metaT; shTab[shTre.getName()] = shTre; }
      phu[shTre.getName()] = rawTre.map(function(o) { o.phu = 1; return o; });
      var treCo = {};   // mã trong tab trễ đã cũ (vd #25/09) -> đối chiếu theo TÊN HÀNG như tab ưu tiên
      rawTre.forEach(function(o) {
        var t = dhTenKhoa_(o.ten);
        if (!t || !(o.thieu > 0) || treCo[t]) return;
        treCo[t] = 1; tre.push({ ten: o.ten, thieu: o.thieu });
      });
    }
  } catch (eTre) { tre = []; }
  var kq = { luc: Utilities.formatDate(new Date(), TZ_VN, 'yyyy-MM-dd HH:mm'), don: ds, uu: uu, tre: tre, tabMoi: moi, tabBo: bo, cot: cot, tabPhu: phu };   // 14/11: cot = bản đồ cột SL/hẹn từng bộ phận theo tab; tabPhu = tab bản chép để web hiện đủ tab
  try {
    var z = Utilities.base64Encode(Utilities.gzip(Utilities.newBlob(JSON.stringify(kq))).getBytes()), p = {}, m = 0;
    for (var x = 0; x < z.length; x += 90000) p[k + '_' + (m++)] = z.slice(x, x + 90000);   // base64 là chữ ASCII: 90.000 ký tự = 90 KB < 100 KB mỗi khóa
    p[k + '_n'] = String(m);
    c.putAll(p, DH_CACHE_GIAY);
  } catch (e2) {}
  return kq;
}

/* Tab "Đơn hàng → xưởng": dòng đơn còn thiếu + phân loại + từ điển nhãn */
function dhBTPDoc_() {   // cấu hình bán thành phẩm riêng từng mã sản phẩm: { '<tên chuẩn>': ['PHOI', …] }
  var m = {};
  try {
    docAnToan_(DH_BTP_SHEET).forEach(function(r) {
      var k = String(r.TenChuan || ''); if (!k) return;
      if (k.indexOf('K:') === 0) k = k.slice(2);   // khóa lưu trong Sheet có tiền tố K: (giữ nguyên chữ), tra cứu theo tên chuẩn
      if (!k) return;
      m[k] = String(r.BTP || '').toUpperCase().split(',').map(function(x) { return x.replace(/\s+/g, ''); })
        .filter(function(c) { return DH_BP_TEN[c]; });
    });
  } catch (e) {}
  return m;
}
function dhBTP_(ten, pl, sua) {   // -> { ds: [mã BP theo thứ tự xưởng], sua: 1 nếu chủ dự án đã cấu hình riêng }
  var k = plChuan_(ten);
  if (sua && Object.prototype.hasOwnProperty.call(sua, k)) {
    return { ds: sua[k].slice().sort(function(a, b) { return dhBThuTu_(a) - dhBThuTu_(b); }), sua: 1 };
  }
  return { ds: (DH_BTP_CD[(pl && pl.loai) || ''] || []).slice(), sua: 0 };
}
function dhBThuTu_(k) { for (var i = 0; i < DH_BP.length; i++) if (DH_BP[i][0] === k) return i; return 99; }
function layDonHangXuong(token, lamMoi) {
  var q = dhQuyenDon_(token); if (q.loi) return q.loi;   // 14/11: mở cho ban điều hành + TP/PP (xem tất cả, chỉ ghi bộ phận mình)
  try { dhCaiEmail_(); } catch (eT) {}   // 07/11: tự cài lịch email 8h (chủ sở hữu bật / tắt ở ⚙ Công suất)
  var d;
  try { d = dhDocDon_(!!lamMoi); }
  catch (e) { return sach_({ ok: false, msg: 'Không đọc được Sheet "Trạng thái đơn hàng": ' + (e && e.message || e) + '. Kiểm tra tài khoản chạy web còn được chia sẻ Sheet đó.' }); }
  plNapThem_();   // 02/11: cấu hình sản phẩm chủ dự án thêm / sửa trên web
  var sua = {};
  docAnToan_(PL_SHEET).forEach(function(r) { if (r.TenChuan) sua[String(r.TenChuan)] = r; });   // khóa dạng 'K:<tên chuẩn>' (không bị Sheet đổi thành số)
  var btpSua = dhBTPDoc_();
  var themBTP = function(x) { var b = dhBTP_(x.ten, x.pl, btpSua); x.btp = b.ds; if (b.sua) x.btpSua = 1; return x; };
  var don = d.don.map(function(o) {
    var x = {}; for (var k in o) x[k] = o[k];
    x.tenChuan = plChuan_(o.ten);
    x.pl = plPhanLoai_(o.ten, o.ghiChu, sua['K:' + x.tenChuan]);
    return themBTP(x);
  });
  var uu = (d.uu || []).map(function(o) { var x = {}; for (var k in o) x[k] = o[k]; x.tenChuan = plChuan_(o.ten); x.pl = plPhanLoai_(o.ten, o.ghiChu, sua['K:' + x.tenChuan]); return themBTP(x); });
  var tre = (d.tre || []).map(function(o) { return { ten: o.ten, tenChuan: plChuan_(o.ten), thieu: o.thieu }; });
  var tabPhu = {};   // 14/11: dòng của tab bản chép (ĐƠN ƯU TIÊN / TRỄ HẠN) – chỉ để hiện đủ tab như Sheet, không cộng vào tổng
  Object.keys(d.tabPhu || {}).forEach(function(t) {
    tabPhu[t] = (d.tabPhu[t] || []).map(function(o) { var x = {}; for (var k in o) x[k] = o[k]; x.tenChuan = plChuan_(o.ten); x.pl = plPhanLoai_(o.ten, o.ghiChu, sua['K:' + x.tenChuan]); return themBTP(x); });
  });
  return sach_({ ok: true, luc: d.luc, don: don, uu: uu, tre: tre, nhan: chNhan_(), tabMoi: d.tabMoi || [], tabBo: d.tabBo || [], tabPhu: tabPhu,
    cot: d.cot || {},   // 14/11: bản đồ cột SL/hẹn từng bộ phận theo tab (bảng đơn kiểu Sheet)
    q: { bp: q.bp || '', xemTatCa: !!q.xemTatCa, sua: q.sua || [], thay: !!q.thay, ten: (q.me && q.me.ten) || '', vaiTro: (q.me && q.me.vaiTro) || '' },   // 14/11: quyền nhập của tài khoản
    bpDs: DH_BP.map(function(b) { return [b[0], b[1]]; }),   // 14/11: danh sách bộ phận để chọn bộ phận kế tiếp
    kenhDs: DH_TABS.map(function(t) { return [t, DH_NHAN_TAB[t] || t]; }).concat((d.tabMoi || []).map(function(t) { return [t, t]; })),   // 07/11: đủ mọi kênh (kể cả kênh chưa có đơn) cho bộ lọc + báo cáo
    cs: dhCongSuat_(), email: dhEmailTT_() });
}

/* ===== 14/11 (chủ dự án chốt): nhập số lượng giao / hẹn / xác nhận nhận hàng NGAY TRÊN DÒNG ĐƠN của Sheet =====
   p = { tab, dong, ten, slDat (để kiểm tra dòng), cu:{sl,hen} (giá trị web đang thấy, để phát hiện người khác vừa sửa),
         sl: SL lũy kế mới của bộ phận mình, hen: 'yyyy-mm-dd' | '' , keTiep: mã bộ phận kế tiếp | '',
         xacNhan: true (bộ phận nhận bấm đã nhận), slNhan: SL thực nhận, boQua: true (ghi đè khi đã báo lệch) }
   Quyền: TP/PP chỉ ghi bộ phận của mình; OWNER ghi thay được mọi bộ phận (có ghi Nhật ký). */
function dhMetaTab_(sh, tab) {
  var nam = Number(Utilities.formatDate(new Date(), TZ_VN, 'yyyy'));
  try { var meta = {}; dhDocTab_(sh, tab, nam, 10, meta); return meta.hdr ? meta : null; } catch (e) { return null; }
}
function dhThemCotTD_(sh, meta) {   // tạo các cột phụ còn thiếu ở cuối dòng (giữ tiêu đề ở đúng dòng tiêu đề)
  var last = Math.max(1, sh.getLastColumn());
  var hr = Math.max(1, meta && meta.hdr || 1);   // 14/11 (Claude): đọc tiêu đề ở ĐÚNG dòng tiêu đề – trước đây đọc dòng 1 nên tab có tiêu đề ở dòng 2+ cứ mỗi lần lưu lại thêm 9 cột
  var h = sh.getRange(hr, 1, 1, last).getValues()[0].map(function(x) { return String(x == null ? '' : x).trim().toUpperCase(); });
  var thieu = DH_TD_COT.filter(function(n) { return h.indexOf(n) < 0; });
  if (!thieu.length) return 0;
  var c = last + 1;
  sh.getRange(hr, c, 1, thieu.length).setValues([thieu]).setFontWeight('bold');
  thieu.forEach(function(n, i) { try { sh.setColumnWidth(c + i, /^XN NHẬN/.test(n) ? 230 : 120); } catch (e) {} });
  return thieu.length;
}
function dhDocGN_(sh, dong, meta, cotTD) {   // đọc 1 dòng: SL + hẹn từng bộ phận, ĐANG Ở BP, KẾ TIẾP, XN
  var can = [1, meta.ten + 1, meta.sl + 1];
  Object.keys(meta.qty || {}).forEach(function(k) { can.push(meta.qty[k] + 1); });
  Object.keys(meta.hen || {}).forEach(function(k) { can.push(meta.hen[k] + 1); });
  if (cotTD) Object.keys(cotTD).forEach(function(k) { can.push(cotTD[k]); });
  var maxC = Math.min(Math.max.apply(null, can), Math.max(1, sh.getLastColumn()));
  var r = sh.getRange(dong, 1, 1, maxC).getValues()[0], cell = function(c1) { return r[c1 - 1]; };
  var nam = Number(Utilities.formatDate(new Date(), TZ_VN, 'yyyy')), qua = {}, hen = {};
  Object.keys(meta.qty || {}).forEach(function(k) {
    var s = String(cell(meta.qty[k] + 1) == null ? '' : cell(meta.qty[k] + 1)).trim();
    if (s !== '' && (typeof cell(meta.qty[k] + 1) === 'number' || /^\s*\d+(\.\d+)?\s*$/.test(s))) qua[k] = dhSo_(s);
  });
  Object.keys(meta.hen || {}).forEach(function(k) { var x = dhNgay_(cell(meta.hen[k] + 1), nam); if (x) hen[k] = x; });
  return { ma: String(cell(1) == null ? '' : cell(1)).trim(), ten: String(cell(meta.ten + 1) == null ? '' : cell(meta.ten + 1)).replace(/\s+/g, ' ').trim(), sl: dhSo_(cell(meta.sl + 1)),
    qua: qua, hen: hen,
    o: cotTD && cotTD['ĐANG Ở BP'] ? String(cell(cotTD['ĐANG Ở BP']) == null ? '' : cell(cotTD['ĐANG Ở BP'])).trim().toUpperCase() : '',
    k: cotTD && cotTD['BP KẾ TIẾP'] ? String(cell(cotTD['BP KẾ TIẾP']) == null ? '' : cell(cotTD['BP KẾ TIẾP'])).trim().toUpperCase() : '',
    h: cotTD && cotTD['XN HẸN'] ? dhXnHenDoc_(cell(cotTD['XN HẸN'])) : {},
    x: cotTD ? (function() { var o = {}; DH_BP.forEach(function(b) { var c1 = cotTD['XN NHẬN ' + b[1].toUpperCase()]; if (c1) { var s = String(cell(c1) == null ? '' : cell(c1)).replace(/\s+/g, ' ').trim(); if (s) o[b[0]] = s; } }); return o; })() : {} };
}
function luuDonGiaoNhan(token, p) {
  var q = dhQuyenDon_(token); if (q.loi) return q.loi;
  p = p || {};
  var tab = String(p.tab || ''), dong = Number(p.dong) || 0;
  if (!tab || dong < 2) return sach_({ ok: false, msg: 'Thiếu vị trí dòng đơn – mở lại tab Đơn hàng rồi thử lại.' });
  var actor = String(p.bp || q.bp || '').toUpperCase(), toanQuyen = (q.sua || []).indexOf('*') >= 0;
  if (!toanQuyen) {
    if (!q.bp) return sach_({ ok: false, msg: 'Tài khoản chưa gắn xưởng (MaXuong) nên không nhập được.' });
    if (actor !== q.bp) return sach_({ ok: false, msg: 'Chỉ nhập được cho bộ phận của mình (' + DH_BP_TEN[q.bp] + ').' });
  }
  if (!DH_BP_TEN[actor]) return sach_({ ok: false, msg: 'Bộ phận không hợp lệ.' });
  var lock = LockService.getScriptLock();
  try { lock.waitLock(20000); } catch (eL) { return sach_({ ok: false, msg: 'Sheet đang được người khác ghi – chờ vài giây rồi bấm lại.' }); }
  try {
    var ss = SpreadsheetApp.openById(DH_SHEET_ID), sh = dhTimTab_(ss, tab);
    if (!sh) return sach_({ ok: false, msg: 'Không thấy tab "' + tab + '" trong Sheet đơn hàng.' });
    if (dong > sh.getLastRow()) return sach_({ ok: false, msg: 'Dòng ' + dong + ' không còn trong Sheet (dòng bị xóa?).' });
    var meta = dhMetaTab_(sh, tab);
    if (!meta || meta.ten < 0 || meta.sl < 0) return sach_({ ok: false, msg: 'Không nhận ra cột tên hàng / SL đặt của tab "' + tab + '".' });
    var tam = dhDocGN_(sh, dong, meta, null);   // đọc trước khi tạo cột phụ (kiểm tra dòng còn đúng)
    if (p.ten != null && plChuan_(tam.ten) !== plChuan_(String(p.ten))) return sach_({ ok: false, msg: 'Dòng ' + dong + ' đã đổi trong Sheet – mở lại tab Đơn hàng rồi nhập lại.' });
    if (tam.sl <= 0) return sach_({ ok: false, msg: 'Dòng ' + dong + ' không còn SL đặt – kiểm tra lại Sheet.' });
    if (p.cu && p.cu.slDat != null && Number(p.cu.slDat) !== tam.sl && !p.boQua)
      return sach_({ ok: false, xungDot: true, hienTai: { slDat: tam.sl }, msg: 'SL đặt trong Sheet vừa đổi (' + dhSoVN_(tam.sl) + '). Mở lại tab rồi nhập lại.' });
    dhThemCotTD_(sh, meta);   // bảo đảm đủ 10 cột phụ
    var cotTD = dhCotTheoDoi_(sh, sh.getLastRow(), meta.hdr), H = dhDocGN_(sh, dong, meta, cotTD);
    var cSL = meta.qty[actor] != null ? meta.qty[actor] + 1 : 0, cHen = meta.hen[actor] != null ? meta.hen[actor] + 1 : 0;
    if (!cotTD || !cotTD['ĐANG Ở BP'] || !cotTD['BP KẾ TIẾP'] || !cotTD['XN NHẬN ' + DH_BP_TEN[actor].toUpperCase()])
      return sach_({ ok: false, msg: 'Chưa tạo được 10 cột theo dõi ở cuối Sheet (cần quyền sửa Sheet đơn hàng).' });
    var cO = cotTD['ĐANG Ở BP'], cK = cotTD['BP KẾ TIẾP'], cXN = cotTD['XN NHẬN ' + DH_BP_TEN[actor].toUpperCase()];
    var ghi = [], doi = [], datSL = null;
    /* 1) SL lũy kế của bộ phận mình */
    if (p.sl != null && String(p.sl).trim() !== '' && isFinite(Number(p.sl))) {
      if (!cSL) return sach_({ ok: false, msg: 'Tab "' + tab + '" không có cột số lượng của bộ phận ' + DH_BP_TEN[actor] + '.' });
      var cuSL = H.qua[actor] == null ? 0 : H.qua[actor], moiSL = Math.min(tam.sl, Math.max(0, Math.round(Number(p.sl))));
      if (p.cu && p.cu.sl != null && Number(p.cu.sl) !== cuSL && !p.boQua)
        return sach_({ ok: false, xungDot: true, hienTai: { sl: cuSL, hen: H.hen[actor] || '' }, msg: 'Người khác vừa cập nhật số lượng ' + DH_BP_TEN[actor] + ' (' + dhSoVN_(cuSL) + '). Xem lại rồi ghi đè nếu đúng.' });
      if (moiSL !== cuSL) { ghi.push([cSL, moiSL]); doi.push(DH_BP_TEN[actor] + ': ' + dhSoVN_(cuSL) + ' → ' + dhSoVN_(moiSL)); }
      datSL = moiSL;
    }
    /* 2) Hẹn trả của bộ phận mình */
    if (p.hen !== undefined && p.hen !== null) {
      if (!cHen) return sach_({ ok: false, msg: 'Tab "' + tab + '" không có cột ngày hẹn của bộ phận ' + DH_BP_TEN[actor] + '.' });
      var henMoi = String(p.hen).trim(), cuHen = H.hen[actor] || '';
      if (henMoi && !/^\d{4}-\d\d-\d\d$/.test(henMoi)) return sach_({ ok: false, msg: 'Ngày hẹn không hợp lệ.' });
      if (p.cu && p.cu.hen !== undefined && p.cu.hen !== null && String(p.cu.hen) !== cuHen && !p.boQua)
        return sach_({ ok: false, xungDot: true, hienTai: { sl: H.qua[actor] == null ? 0 : H.qua[actor], hen: cuHen }, msg: 'Người khác vừa đổi hẹn ' + DH_BP_TEN[actor] + (cuHen ? ' (' + dhDMY_(cuHen) + ')' : ' (xóa hẹn)') + '. Xem lại rồi ghi đè nếu đúng.' });
      if (henMoi !== cuHen) {
        if (henMoi) { var x = henMoi.split('-'); ghi.push([cHen, new Date(Number(x[0]), Number(x[1]) - 1, Number(x[2]), 12, 0, 0)]); }
        else ghi.push([cHen, '']);
        doi.push('Hẹn ' + DH_BP_TEN[actor] + ': ' + (cuHen ? dhDMY_(cuHen) : '–') + ' → ' + (henMoi ? dhDMY_(henMoi) : '–'));
      }
    }
    /* 3) Bộ phận đang làm chọn bộ phận kế tiếp */
    if (p.keTiep !== undefined) {
      var kt = String(p.keTiep || '').toUpperCase();
      if (kt && !DH_BP_TEN[kt]) return sach_({ ok: false, msg: 'Bộ phận kế tiếp không hợp lệ.' });
      if (!toanQuyen && H.o && H.o !== actor) return sach_({ ok: false, msg: 'Đơn đang ở bộ phận ' + (DH_BP_TEN[H.o] || H.o) + ' – chỉ TP bộ phận đó được chọn bộ phận kế tiếp.' });
      if (kt !== H.k) { ghi.push([cK, kt]); doi.push('Kế tiếp: ' + (H.k ? DH_BP_TEN[H.k] : '–') + ' → ' + (kt ? DH_BP_TEN[kt] : '–')); }
    }
    /* 4) Bộ phận sau xác nhận đã nhận hàng từ bộ phận trước */
    if (p.xacNhan) {
      if (!H.o) return sach_({ ok: false, msg: 'Dòng này chưa có "ĐANG Ở BP" – TP bộ phận đang làm chọn bộ phận trước khi bàn giao.' });
      if (!toanQuyen && H.k && H.k !== actor) return sach_({ ok: false, msg: 'Đơn đang chờ bộ phận ' + (DH_BP_TEN[H.k] || H.k) + ' nhận – chỉ bộ phận kế tiếp xác nhận nhận hàng.' });   // 14/11 (Claude)
      if (H.o === actor) return sach_({ ok: false, msg: 'Đơn đang ở chính bộ phận ' + DH_BP_TEN[actor] + ' – chưa có bộ phận trước để xác nhận.' });
      var nhan = p.slNhan != null && String(p.slNhan).trim() !== '' ? Math.max(0, Math.round(Number(p.slNhan))) : (H.qua[H.o] != null ? H.qua[H.o] : tam.sl);
      nhan = Math.min(tam.sl, nhan);
      var luc = Utilities.formatDate(new Date(), TZ_VN, 'dd/MM HH:mm');
      ghi.push([cXN, 'nhận từ ' + DH_BP_TEN[H.o] + ' · ' + dhSoVN_(nhan) + ' · ' + (q.me.ten || q.me.tk) + ' · ' + luc]);
      ghi.push([cO, actor]); if (H.k) ghi.push([cK, '']);
      doi.push('XN nhận từ ' + DH_BP_TEN[H.o] + ': ' + dhSoVN_(nhan));
    }
    /* 4b) 14/11 (Claude, chủ dự án chốt): bộ phận SAU đồng ý / không kịp với ngày hẹn của bộ phận TRƯỚC.
       Xác nhận gắn với đúng ngày hẹn lúc bấm – bộ phận trước đổi hẹn thì xác nhận cũ tự hết hiệu lực (web hiện "chờ xác nhận"). */
    if (p.xnHen && p.xnHen.bp) {
      var T = String(p.xnHen.bp).toUpperCase(), henT = H.hen[T] || '';
      if (!DH_BP_TEN[T]) return sach_({ ok: false, msg: 'Bộ phận hẹn không hợp lệ.' });
      if (!henT) return sach_({ ok: false, msg: 'Bộ phận ' + DH_BP_TEN[T] + ' chưa hẹn ngày trả cho mã này.' });
      var sau = dhBPSau_(H.ten, T, H);
      if (!toanQuyen && actor !== sau) return sach_({ ok: false, msg: 'Chỉ bộ phận nhận hàng sau ' + DH_BP_TEN[T] + (sau ? ' (' + DH_BP_TEN[sau] + ')' : '') + ' xác nhận ngày hẹn này.' });
      if (!cotTD['XN HẸN']) return sach_({ ok: false, msg: 'Chưa tạo được cột XN HẸN ở cuối Sheet.' });
      var lyDo = String(p.xnHen.lyDo || '').replace(/[\r\n|]+/g, ' ').trim().slice(0, 120);
      if (!p.xnHen.dongY && !lyDo) return sach_({ ok: false, msg: 'Ghi lý do không kịp (vd. cần hàng sớm hơn ngày nào).' });
      var xh = {}; Object.keys(H.h || {}).forEach(function(k2) { xh[k2] = H.h[k2]; });
      xh[T] = { ok: p.xnHen.dongY ? 1 : 0, ngay: henT, ai: (q.me.ten || q.me.tk), luc: Utilities.formatDate(new Date(), TZ_VN, 'dd/MM HH:mm'), lyDo: lyDo, boi: actor };
      ghi.push([cotTD['XN HẸN'], dhXnHenGhi_(xh)]);
      doi.push('Hẹn ' + DH_BP_TEN[T] + ' ' + dhDMY_(henT) + ': ' + (p.xnHen.dongY ? 'đồng ý' : 'không kịp – ' + lyDo));
    }
    /* 5) Lần đầu nhập: đơn chưa có "ĐANG Ở BP" -> gán bộ phận đang nhập */
    if (!H.o && (datSL != null || doi.length) && !p.xacNhan && !p.xnHen) { ghi.push([cO, actor]); doi.push('Đang ở BP: → ' + DH_BP_TEN[actor]); }
    if (!ghi.length) return sach_({ ok: true, msg: 'Không có thay đổi.', khongDoi: true, dong: dong, o: H.o, k: H.k, sl: H.qua[actor] == null ? 0 : H.qua[actor], hen: H.hen[actor] || '', qua: H.qua, henDs: H.hen, x: H.x, xh: H.h });
    /* 14/11 (Claude): KHÔNG ghi đè ô có công thức trong Sheet đơn (chủ dự án chưa chắc cột PHÔI CỦA… / SƠN CỦA… là số gõ tay hay công thức) */
    var cMaxG = Math.max.apply(null, ghi.map(function(g) { return g[0]; })), fx = sh.getRange(dong, 1, 1, cMaxG).getFormulas()[0];
    var oCT = ghi.filter(function(g) { return fx[g[0] - 1]; });
    if (oCT.length) return sach_({ ok: false, msg: 'Ô ' + oCT.map(function(g) { return dhTenCot_(g[0]) + dong; }).join(', ') + ' trong Sheet đang là CÔNG THỨC – web không ghi đè. Nhờ chủ dự án đổi ô đó thành số gõ tay (hoặc báo Claude) rồi lưu lại.' });
    /* ghi từng ô; ô ngày đặt định dạng dd/MM/yyyy */
    ghi.forEach(function(g) {
      var r = sh.getRange(dong, g[0]);
      if (g[1] instanceof Date) { r.setValue(g[1]); r.setNumberFormat('dd/MM/yyyy'); }
      else { r.setValue(g[1]); if (typeof g[1] === 'number') r.setNumberFormat('0.####'); }
    });
    SpreadsheetApp.flush();
    try { ghiLog_(q.me, 'Giao/nhận đơn', (H.ma || '') + ' · ' + H.ten.slice(0, 80), 'tab ' + tab + ' · dòng ' + dong, doi.join(' | ').slice(0, 400)); } catch (eLog) {}
    dhXoaCacheDon_();
    var S = dhDocGN_(sh, dong, meta, cotTD);
    return sach_({ ok: true, msg: 'Đã lưu: ' + doi.join('; ') + '.', dong: dong, o: S.o, k: S.k, sl: S.qua[actor] == null ? 0 : S.qua[actor], hen: S.hen[actor] || '', qua: S.qua, henDs: S.hen, x: S.x, xh: S.h });
  } catch (e) {
    return sach_({ ok: false, msg: 'Không ghi được vào Sheet: ' + (e && e.message || e) });
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}
/* 14/11 (Claude): ô XN HẸN – mỗi bộ phận một dòng, đọc được bằng mắt trong Sheet:
   "Phôi: ✓ 20/11/2026 · Nguyễn A · 14/11 10:20"  |  "Sơn: ✗ 22/11/2026 · Trần B · 14/11 11:00 · lý do: cần ngày 19/11" */
function dhXnHenDoc_(v) {
  var o = {}, ten = {}; DH_BP.forEach(function(b) { ten[b[1].toUpperCase()] = b[0]; });
  String(v == null ? '' : v).split(/\n+/).forEach(function(d) {
    var m = d.trim().match(/^([^:]+):\s*(✓|✗)\s*(\d\d)\/(\d\d)\/(\d{4})\s*(?:·\s*([^·]*?))?\s*(?:·\s*(\d\d\/\d\d \d\d:\d\d))?\s*(?:·\s*lý do:\s*(.*))?$/);
    if (!m) return; var k = ten[m[1].trim().toUpperCase()]; if (!k) return;
    o[k] = { ok: m[2] === '✓' ? 1 : 0, ngay: m[5] + '-' + m[4] + '-' + m[3], ai: (m[6] || '').trim(), luc: m[7] || '', lyDo: (m[8] || '').trim() };
  });
  return o;
}
function dhXnHenGhi_(o) {
  return DH_BP.filter(function(b) { return o[b[0]]; }).map(function(b) { var x = o[b[0]];
    return b[1] + ': ' + (x.ok ? '✓' : '✗') + ' ' + dhDMY_(x.ngay) + ' · ' + String(x.ai || '').replace(/[·:\n]/g, ' ') + ' · ' + (x.luc || '') + (x.ok ? '' : ' · lý do: ' + (x.lyDo || '')); }).join('\n');
}
/* bộ phận nhận hàng ngay sau T theo cấu hình bán thành phẩm của mã; T ngoài cấu hình -> bộ phận kế tiếp đang ghi trên dòng */
function dhBPSau_(ten, T, H) {   // 14/11: theo luồng mới – xem dhBSau ở web
  var ds = dhBTP_(ten, plPhanLoai_(ten, ''), dhBTPDoc_()).ds, co = function(k) { return ds.indexOf(k) >= 0; };
  if (!co(T)) return (H && H.o === T && H.k) || '';
  var daTip = H && H.qua && H.qua.TIP != null && H.sl > 0 && H.qua.TIP >= H.sl;
  var M = { PHOI: co('SON') ? 'SON' : 'TARO', SON: co('UV') ? 'UV' : 'HT', UV: 'HT', TARO: 'HT', TIP: co('HT') ? 'HT' : 'DG', HT: co('TIP') && !daTip ? 'TIP' : 'DG', DG: '' };
  var k = M[T] || ''; while (k && !co(k)) k = M[k] || ''; return k;
}
function dhTenCot_(c) { var t = ''; while (c > 0) { var m = (c - 1) % 26; t = String.fromCharCode(65 + m) + t; c = Math.floor((c - 1) / 26); } return t; }
function dhSoVN_(n) { return String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
/* yyyy-mm-dd -> dd/mm */
function dhDMY_(s) { var x = String(s || '').match(/^(\d{4})-(\d\d)-(\d\d)$/); return x ? x[3] + '/' + x[2] + '/' + x[1] : String(s || ''); }

/* ===== 14/11 (chủ dự án chốt): cấu hình BÁN THÀNH PHẨM riêng cho TỪNG MÃ SẢN PHẨM =====
   Mỗi dòng Sheet là một mã sản phẩm; các mã khác nhau có cấu hình bán thành phẩm khác nhau nên
   SL / hẹn của bộ phận phải nhập theo mã đó (không nhập theo tổng đơn). Lưu ở sheet BTPTheoSKU.
   Chỉ chủ dự án sửa; chưa cấu hình thì dùng mặc định theo loại hàng (DH_BTP_CD). */
function dhBTPSheet_() {
  var sh = ss_().getSheetByName(DH_BTP_SHEET);
  if (!sh) {
    sh = ss_().insertSheet(DH_BTP_SHEET);
    sh.getRange(1, 1, 1, DH_BTP_COT.length).setValues([DH_BTP_COT]).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}
function luuBTPDon(token, p) {
  var q = dhQuyenDon_(token); if (q.loi) return q.loi;
  if ((q.sua || []).indexOf('*') < 0) return sach_({ ok: false, msg: 'Chỉ chủ dự án được cấu hình bán thành phẩm cho mã sản phẩm.' });
  p = p || {};
  var ten = String(p.ten || '').trim();
  if (!ten || ten.length > 300) return sach_({ ok: false, msg: 'Thiếu tên / mã sản phẩm.' });
  var nhap = String(p.btp || '').toUpperCase().split(',').map(function(x) { return x.replace(/\s+/g, ''); }).filter(Boolean);
  for (var i = 0; i < nhap.length; i++) if (!DH_BP_TEN[nhap[i]]) return sach_({ ok: false, msg: 'Bộ phận không hợp lệ: ' + nhap[i] });
  var ds = nhap.filter(function(v, j) { return nhap.indexOf(v) === j; }).sort(function(a, b) { return dhBThuTu_(a) - dhBThuTu_(b); });
  try {
    khoa_();   // khóa ghi + đọc lại mới nhất (như luuPhanLoaiSKU)
    var k = 'K:' + plChuan_(ten), sh = dhBTPSheet_();
    var cu = docAnToan_(DH_BTP_SHEET).filter(function(r) { return String(r.TenChuan) === k; });
    cu.map(function(r) { return r._row; }).sort(function(a, b) { return b - a; }).forEach(function(r) { sh.deleteRow(r); });
    xoaCache_(DH_BTP_SHEET); delete __HEAD_CACHE[DH_BTP_SHEET];
    if (ds.length) them_(DH_BTP_SHEET, { TenChuan: k, TenHang: ten.slice(0, 300), BTP: ds.join(','), NguoiSua: q.me.tk, ThoiDiem: Utilities.formatDate(new Date(), TZ_VN, 'yyyy-MM-dd HH:mm') });
    try { ghiLog_(q.me, 'Cấu hình BTP mã SP', ten.slice(0, 120), '', ds.join(',') || 'về mặc định'); } catch (eLog) {}
    var b = dhBTP_(ten, plPhanLoai_(ten, ''), dhBTPDoc_());
    return sach_({ ok: true, msg: ds.length ? 'Đã lưu bán thành phẩm cho "' + ten.slice(0, 60) + '": ' + ds.map(function(x) { return DH_BP_TEN[x]; }).join(' → ') + '.' : 'Đã trả cấu hình bán thành phẩm của "' + ten.slice(0, 60) + '" về mặc định theo loại hàng.', btp: b.ds, btpSua: b.sua });
  } catch (e) {
    return sach_({ ok: false, msg: 'Không ghi được cấu hình bán thành phẩm: ' + (e && e.message || e) });
  }
}

/* Chủ sở hữu sửa phân loại 1 tên hàng (áp cho mọi đơn cùng tên). bo = true -> xóa bản sửa, về tự động */
function luuPhanLoaiSKU(token, o) {
  var q = qtQuyen_(token); if (q.loi) return q.loi;
  o = o || {}; plNapThem_();
  var ten = String(o.ten || '').trim();
  if (!ten || ten.length > 300) return sach_({ ok: false, msg: 'Thiếu tên hàng.' });
  var co = function(bang, v) { return Object.prototype.hasOwnProperty.call(bang, String(v)); };
  if (!o.bo) {
    if (!co(PL_LOAI, o.loai)) return sach_({ ok: false, msg: 'Loại hàng không hợp lệ.' });
    if (o.dong && !plTimDong_(String(o.dong))) return sach_({ ok: false, msg: 'Dòng gậy không hợp lệ.' });
    if (!co(PL_CHUOI, o.chuoi) || !co(PL_NGON, o.ngon) || !co(PL_TIP, o.tip) || !co(PL_REN, o.ren)) return sach_({ ok: false, msg: 'Chọn đủ 4 thông số (chuôi, ngọn, tip, ren).' });
  }
  khoa_(); xoaCache_(PL_SHEET);   // đọc lại sheet sau khi khóa trước khi xóa theo số dòng
  var sh = ss_().getSheetByName(PL_SHEET);
  if (!sh) {
    sh = ss_().insertSheet(PL_SHEET);
    sh.getRange(1, 1, 1, PL_COT.length).setValues([PL_COT]).setFontWeight('bold');
    sh.setFrozenRows(1);
    sh.getRange(2, 1, sh.getMaxRows() - 1, PL_COT.length).setNumberFormat('@');
  }
  var k = 'K:' + plChuan_(ten), cu = docAnToan_(PL_SHEET).filter(function(r) { return String(r.TenChuan) === k; });
  cu.map(function(r) { return r._row; }).sort(function(a, b) { return b - a; }).forEach(function(r) { sh.deleteRow(r); });
  xoaCache_(PL_SHEET);
  if (!o.bo) {
    them_(PL_SHEET, { TenChuan: k, TenHang: ten, LoaiHang: String(o.loai), Dong: String(o.dong || ''), Chuoi: String(o.chuoi), Ngon: String(o.ngon), Tip: String(o.tip), Ren: String(o.ren),
      GhiChu: String(o.ghiChu || '').slice(0, 200), NguoiSua: q.me.tk, ThoiDiem: Utilities.formatDate(new Date(), TZ_VN, 'yyyy-MM-dd HH:mm') });
  }
  ghiLog_(q.me, 'Phân loại SKU', ten.slice(0, 120), '', o.bo ? 'về tự động' : [o.loai, o.dong, o.chuoi, o.ngon, o.tip, o.ren].join(' / '));
  return sach_({ ok: true, msg: o.bo ? 'Đã trả về phân loại tự động.' : 'Đã lưu phân loại cho "' + ten.slice(0, 60) + '".' });
}

/* ===== Tab "Đơn hàng" (01/11, chỉ chủ sở hữu): bản chụp mỗi ngày để xem "Thay đổi hôm nay" =====
   Sheet DonHangChup (trong file KPI, KHÔNG ghi vào Sheet đơn hàng): Ngay | Phan | DuLieu – mỗi ngày 1 bản, chia mảnh 40.000 ký tự, giữ 30 ngày.
   Chụp lúc 9h sáng cùng trigger snapshotKPIHangNgay, và lần đầu mở tab trong ngày nếu chưa có. */
var DH_CHUP = 'DonHangChup', DH_CHUP_COT = ['Ngay', 'Phan', 'DuLieu'], DH_CHUP_GIU = 30;
function dhKhoaDong_(o) { return [o.maDon || '', o.ten || '', o.tab || ''].map(function(x) { return String(x).replace(/[|#]/g, '/'); }).join('|'); }
/* Khóa riêng cho từng dòng: dòng trùng mã đơn + tên + tab (khác màu / ghi chú) được đánh số #2, #3… theo thứ tự trong Sheet */
function dhKhoaDs_(ds) { var dem = {}; return ds.map(function(o) { var k = dhKhoaDong_(o); dem[k] = (dem[k] || 0) + 1; return dem[k] > 1 ? k + '#' + dem[k] : k; }); }
function dhTrangThai_(o, homNay) {
  if (o.thieu <= 0 && o.daTra > 0 && o.daTra >= o.sl) return 'daGiao';
  if (o.thieu <= 0) return 'sanSang';
  if (o.dl && o.dl < homNay) return 'treHan';
  return 'dangSX';
}
function dhDocChup_() {   // -> { 'yyyy-MM-dd': [[k, sl, thieu, giao, dl, st], ...] }
  var sh = ss_().getSheetByName(DH_CHUP), out = {};
  if (!sh || sh.getLastRow() < 2) return out;
  var v = sh.getRange(2, 1, sh.getLastRow() - 1, 3).getValues(), p = {};
  v.forEach(function(r) { var d = r[0] instanceof Date ? Utilities.formatDate(r[0], TZ_VN, 'yyyy-MM-dd') : String(r[0]).trim(); if (!/^\d{4}-\d\d-\d\d$/.test(d)) return; (p[d] = p[d] || []).push([Number(r[1]) || 0, String(r[2] || '').replace(/^~/, '')]); });
  Object.keys(p).forEach(function(d) { try { out[d] = JSON.parse(p[d].sort(function(a, b) { return a[0] - b[0]; }).map(function(x) { return x[1]; }).join('')); } catch (e) {} });
  return out;
}
function dhChup_(lamMoi) {
  var hom = homNayVN_(), sh = ss_().getSheetByName(DH_CHUP);
  if (sh && sh.getLastRow() >= 2 && sh.getRange(2, 1, sh.getLastRow() - 1, 1).getDisplayValues().some(function(r) { return String(r[0]) === hom; })) return false;
  var d = dhDocDon_(!!lamMoi), ks = dhKhoaDs_(d.don), rowsC = d.don.map(function(o, i) { return [ks[i], o.sl, o.thieu, o.giao || 0, o.dl || '', dhTrangThai_(o, hom)]; });
  var su = [];   // 07/11: dòng hôm trước còn trong tab kênh, nay đã chuyển sang tab HT -> thêm vào bản chụp với cờ 1 (cột 7) để tính sản lượng + sự kiện hoàn thiện
  try { var kq = dhTimChuyenHT_(rowsC, hom); rowsC = rowsC.concat(kq.dong); su = kq.su; } catch (eHT) { try { ghiLog_({ tk: 'HE_THONG', ten: 'Hệ thống' }, 'Đọc tab HT lỗi', String(eHT && eHT.message || eHT).slice(0, 200), '', ''); } catch (e2) {} }
  var str = JSON.stringify(rowsC);
  khoa_();
  sh = ss_().getSheetByName(DH_CHUP);
  if (!sh) { sh = ss_().insertSheet(DH_CHUP); sh.getRange(1, 1, 1, 3).setValues([DH_CHUP_COT]).setFontWeight('bold'); sh.setFrozenRows(1); try { sh.hideSheet(); } catch (e) {} }
  if (sh.getLastRow() >= 2 && sh.getRange(2, 1, sh.getLastRow() - 1, 1).getDisplayValues().some(function(r) { return String(r[0]) === hom; })) return false;   // người khác vừa chụp
  var rows = []; for (var i = 0, n = 0; i < str.length; i += 40000) rows.push([hom, n++, '~' + str.slice(i, i + 40000)]);   // '~' đầu mảnh: ô không bao giờ bị hiểu là công thức
  sh.getRange(sh.getLastRow() + 1, 1, rows.length, 3).setNumberFormat('@').setValues(rows);
  // giữ DH_CHUP_GIU ngày gần nhất
  var v = sh.getRange(2, 1, sh.getLastRow() - 1, 1).getDisplayValues().map(function(r) { return String(r[0]); });
  var ngay = v.filter(function(x, i) { return v.indexOf(x) === i; }).sort();
  if (ngay.length > DH_CHUP_GIU) {
    var bo = {}; ngay.slice(0, ngay.length - DH_CHUP_GIU).forEach(function(x) { bo[x] = 1; });
    for (var r = v.length - 1; r >= 0; r--) if (bo[v[r]]) sh.deleteRow(r + 2);
  }
  try { dhGhiHoanThien_(su); } catch (e) {}
  try { dhGhiSanLuong_(dhDocChup_()); } catch (e) {}   // 07/11: lưu tổng sản lượng nhập theo ngày (giữ lâu dài)
  return true;
}
/* Gọi từ trigger 9h sáng (snapshotKPIHangNgay) – không cho gọi từ web */
function chupDonHangHangNgay_() { try { dhChup_(true); } catch (e) { try { ghiLog_({ tk: 'HE_THONG', ten: 'Hệ thống' }, 'Chụp đơn hàng lỗi', String(e && e.message || e).slice(0, 200), '', ''); } catch (e2) {} } }

/* Tab "Đơn hàng": thay đổi so với bản chụp gần nhất TRƯỚC hôm nay + lịch sử tổng để thống kê */
function layThayDoiDon(token) {
  var q = qtQuyen_(token); if (q.loi) return q.loi;
  var hom = homNayVN_(), d, ch;
  try { d = dhDocDon_(false); } catch (e) { return sach_({ ok: false, msg: 'Không đọc được Sheet "Trạng thái đơn hàng": ' + (e && e.message || e) }); }
  try { ch = dhDocChup_(); } catch (e0) { ch = {}; }   // 13/11: bản chụp lỗi/đọc lâu không được làm hỏng cả tab Đơn hàng
  var truoc = Object.keys(ch).filter(function(x) { return x < hom; }).sort().pop() || '';
  var thay = [];
  if (truoc) {
    var cu = {}, nay = {};
    ch[truoc].forEach(function(r) { cu[r[0]] = r; });
    var ks = dhKhoaDs_(d.don);
    d.don.forEach(function(o, i) {
      var k = ks[i], c = cu[k], st = dhTrangThai_(o, hom); nay[k] = 1;
      var x = { maDon: o.maDon, ten: o.ten, kenh: o.kenh, tab: o.tab, st: st };
      if (!c) { thay.push(Object.assign({ loai: 'moi', mota: 'Dòng đơn mới' }, x)); return; }
      if (Number(c[2]) !== Number(o.thieu)) thay.push(Object.assign({ loai: 'thieu', chieu: o.thieu < c[2] ? 'giam' : 'tang', mota: 'Còn thiếu ' + c[2] + ' → ' + o.thieu }, x));
      if (String(c[5]) !== st) thay.push(Object.assign({ loai: 'trangthai', truoc: c[5], mota: 'Trạng thái đổi' }, x));
      if (String(c[4] || '') !== String(o.dl || '')) thay.push(Object.assign({ loai: 'deadline', mota: 'Deadline ' + (c[4] || '—') + ' → ' + (o.dl || '—') }, x));
      if (Number(c[1]) !== Number(o.sl)) thay.push(Object.assign({ loai: 'sl', mota: 'SL đặt ' + c[1] + ' → ' + o.sl }, x));
    });
    var htNay = {}; (ch[hom] || []).forEach(function(r) { if (r[6] === 1) htNay[r[0]] = r; });
    ch[truoc].forEach(function(r) { if (r[6] === 1 || nay[r[0]]) return; var a = String(r[0]).replace(/#\d+$/, '').split('|'), h = htNay[r[0]];
      thay.push({ loai: h ? 'ht' : 'xoa', mota: h ? 'Đã hoàn thiện – chuyển sang tab HT' + (Number(h[2]) > 0 ? ' (giao thiếu ' + h[2] + ')' : '') : 'Không còn trong Sheet', maDon: a[0], ten: a[1], tab: a[2], kenh: DH_NHAN_TAB[a[2]] || a[2], st: h ? 'daGiao' : r[5] }); });
  }
  var lichSu = Object.keys(ch).sort().map(function(x) { var t = 0, tre = 0; ch[x].forEach(function(r) { if (r[6] === 1) return; t += Number(r[2]) || 0; if (r[5] === 'treHan') tre++; }); return [x, t, tre]; });
  var daChup = false;
  if (!ch[hom]) { try { daChup = dhChup_(false); } catch (e3) {} }
  if (daChup) { try { ch = dhDocChup_(); } catch (e5) {} }
  try { dhGhiSanLuong_(ch); } catch (e4) {}   // bù các ngày chưa ghi (bản chụp có từ trước 07/11)
  var chay = { ngay: [], kenh: {} }, sanLuong = [], ht = [];
  try { chay = dhDongChay_(ch); } catch (e6) {}
  try { sanLuong = dhDocSanLuong_(); } catch (e7) {}
  try { ht = dhDocHoanThien_(); } catch (e8) {}
  return sach_({ ok: true, luc: d.luc, truoc: truoc, thay: thay.slice(0, 2000), lichSu: lichSu, daChup: daChup, chay: chay, sanLuong: sanLuong, cs: dhCongSuat_(), ht: ht });
}
/* 02/11 (Lean – quan-ly-van-hanh): Vào – Ra – Tồn và giao đúng hạn suy ra từ 2 bản chụp liền nhau (sai số ±1 ngày).
   vao = SL đặt của dòng mới xuất hiện; ra = phần còn thiếu giảm đi (dòng còn trong Sheet); ton = tổng còn thiếu;
   xong = dòng hôm trước còn thiếu, hôm nay hết thiếu (còn trong Sheet); dung = xong mà ngày chụp ≤ deadline (không có deadline: không tính);
   dòng biến mất khi còn thiếu: "không rõ" (có thể hủy) – không tính vào ra / xong. -> { ngay: [[d, vao, ra, ton, xong, dung, mat]], kenh: {tên: [xong, dung]} (28 ngày gần nhất) } */
function dhDongChay_(ch) {
  var ds = Object.keys(ch).sort(), ngay = [], kenh = {}, moc = '';
  if (ds.length) { var m = new Date(ds[ds.length - 1] + 'T00:00:00'); m.setDate(m.getDate() - 28); moc = Utilities.formatDate(m, TZ_VN, 'yyyy-MM-dd'); }
  for (var i = 1; i < ds.length; i++) {
    var cu = {}, nay = {}, vao = 0, ra = 0, ton = 0, xong = 0, dung = 0, mat = 0, d = ds[i];
    ch[ds[i - 1]].forEach(function(r) { cu[r[0]] = r; });
    ch[d].forEach(function(r) {
      nay[r[0]] = 1; var t = Number(r[2]) || 0, c = cu[r[0]]; if (r[6] !== 1) ton += t;   // dòng chuyển HT: phần thiếu còn lại là giao thiếu / hủy, không còn nợ
      if (!c) { if (r[6] !== 1) vao += Number(r[1]) || 0; return; }
      var t0 = Number(c[2]) || 0; if (t0 > t) ra += t0 - t;
      if (t0 > 0 && t <= 0 && r[4]) {
        xong++; var ok = d <= String(r[4]); if (ok) dung++;
        if (d > moc) { var tab = String(r[0]).replace(/#\d+$/, '').split('|')[2] || '', kn = DH_NHAN_TAB[tab] || tab, x = kenh[kn] || (kenh[kn] = [0, 0]); x[0]++; if (ok) x[1]++; }
      }
    });
    ch[ds[i - 1]].forEach(function(r) { if (!nay[r[0]] && r[6] !== 1 && (Number(r[2]) || 0) > 0) mat++; });
    ngay.push([d, vao, ra, ton, xong, dung, mat]);
  }
  return { ngay: ngay.slice(-60), kenh: kenh };
}

/* ===== 02/11: tab kênh mới + cấu hình sản phẩm sửa trên web + báo sản phẩm mới (Việc hôm nay) ===== */
var DH_TAB_HT = /^HT[\s\-_.]*\d{4}$/i;   // 07/11 (chủ dự án): đơn xong được chép cả đơn sang tab HT-<năm> (vd HT-2026) rồi xóa khỏi tab kênh
var DH_TAB_LOAI = /^_|SNAPSHOT|^ĐƠN HÀNG HT$|^DON HANG HT$|^HT[\s\-_.]*\d{4}$|HOÀN THIỆN|HOAN THIEN|LƯU TRỮ|LUU TRU|ARCHIVE|^SHEET\d*$|^ĐƠN ƯU TIÊN$|^DON UU TIEN$|^TRỄ HẠN$|^TRE HAN$/i;   // 07/11: tab ĐƠN ƯU TIÊN là bản chép từ các tab kênh -> không cộng vào tổng (đọc riêng làm nguồn mục Ưu tiên)   // 13/11: tab TRỄ HẠN cũng là bản chép đơn trễ của các kênh -> không đọc trùng   // tab lưu trữ / nháp: không đọc
var DH_TAB_MOI_MAX = 15, DH_TAB_MOI_DONG = 5000;   // tab kênh tự thêm: tối đa 15 tab, mỗi tab đọc 5.000 dòng đầu (chống treo / cạn quota)
/* tab tự thêm phải có ĐỦ cột "Loại hàng" và "Số lượng đặt" trong 10 dòng đầu */
function dhCoCotChuan_(sh) {
  var nr = Math.min(sh.getLastRow(), 10), nc = Math.min(sh.getLastColumn(), 60);
  if (nr < 2 || nc < 2) return false;
  return sh.getRange(1, 1, nr, nc).getValues().some(function(r) { var j = r.join('|').toUpperCase(); return j.indexOf('LOẠI HÀNG') >= 0 && (j.indexOf('SỐ LƯỢNG ĐẶT') >= 0 || j.indexOf('SL ĐẶT') >= 0); });
}
function dhTabBo_() { try { var a = JSON.parse(PropertiesService.getScriptProperties().getProperty('DH_TAB_BO') || '[]'); return Array.isArray(a) ? a.map(String) : []; } catch (e) { return []; } }
/* Bỏ qua / đọc lại 1 tab kênh tự thêm */
function boQuaTabDon(token, tab, bo) {
  var q = qtQuyen_(token); if (q.loi) return q.loi;
  tab = String(tab || '').slice(0, 100);
  var cu = dhTabBo_();
  if (!tab || DH_TABS.indexOf(tab) >= 0) return sach_({ ok: false, msg: 'Tab không hợp lệ.' });
  if (cu.indexOf(tab) < 0) {   // chỉ nhận tab đang có trong Sheet đơn
    var coTab = false; try { coTab = SpreadsheetApp.openById(DH_SHEET_ID).getSheets().some(function(sh) { return String(sh.getName()) === tab; }); } catch (e) {}
    if (!coTab) return sach_({ ok: false, msg: 'Không thấy tab "' + tab + '" trong Sheet đơn.' });
  }
  var a = cu.filter(function(x) { return x !== tab; });
  if (bo) a.push(tab);
  try { PropertiesService.getScriptProperties().setProperty('DH_TAB_BO', JSON.stringify(a.slice(-40))); }
  catch (e) { return sach_({ ok: false, msg: 'Không lưu được danh sách tab bỏ qua.' }); }
  try { var c = CacheService.getScriptCache(); c.remove(DH_DON_KHOA + '_n'); } catch (e) {}   // 07/11: sửa khóa cũ (v3) – bỏ / đọc lại tab có hiệu lực ngay
  ghiLog_(q.me, 'Tab đơn hàng', tab, '', bo ? 'bỏ qua' : 'đọc lại');
  return sach_({ ok: true, msg: bo ? 'Đã bỏ qua tab "' + tab + '".' : 'Sẽ đọc lại tab "' + tab + '".' });
}

/* Cấu hình sản phẩm chủ dự án sửa trên web – sheet CauHinhSP (file KPI). Mỗi dòng ghi đè / thêm vào bảng gốc trong mã:
   Loai = DONG (dòng gậy) | CHUOI | NGON | TIP (loại khúc). Áp lại mỗi lần gọi từ bản gốc (plNapThem_), không đổi bảng gốc. */
var CH_SHEET = 'CauHinhSP';
var CH_COT = ['Loai', 'Ma', 'Ten', 'LoaiHang', 'TenGoi', 'Chuoi', 'Ngon', 'Tip', 'Ren', 'Dau', 'ChatLieu', 'Kieu', 'An', 'NguoiSua', 'ThoiDiem'];
var PL_KIEU_KHUC = {}, PL_AN = { CHUOI: {}, NGON: {}, TIP: {} }, PL_THEM = {}, __PL_GOC = null;
function plNapThem_() {
  if (!__PL_GOC) __PL_GOC = JSON.stringify({ d: PL_DONG, c: PL_CHUOI, n: PL_NGON, t: PL_TIP, vc: PL_VL_CHUOI, vn: PL_VL_NGON, dau: PL_DAU_MD });
  var g = JSON.parse(__PL_GOC);
  PL_DONG = g.d; PL_CHUOI = g.c; PL_NGON = g.n; PL_TIP = g.t; PL_VL_CHUOI = g.vc; PL_VL_NGON = g.vn; PL_DAU_MD = g.dau;
  PL_KIEU_KHUC = {}; PL_AN = { CHUOI: {}, NGON: {}, TIP: {} }; PL_THEM = {}; __PL_RE = null;
  var rows = docAnToan_(CH_SHEET);
  var bang = { CHUOI: function() { return PL_CHUOI; }, NGON: function() { return PL_NGON; }, TIP: function() { return PL_TIP; } };
  rows.forEach(function(r) {   // loại khúc trước (dòng gậy dùng mã khúc)
    var L = String(r.Loai), m = String(r.Ma || '');
    if (!bang[L] || !m) return;
    var b = bang[L]();
    if (!Object.prototype.hasOwnProperty.call(b, m)) PL_THEM[L + '|' + m] = 1;
    if (r.Ten) b[m] = String(r.Ten); else if (!b[m]) b[m] = m;
    var vl = String(r.ChatLieu || '');
    if (L === 'CHUOI' && /^(FC|MIX|GF)$/.test(vl)) PL_VL_CHUOI[m] = vl;
    if (L === 'NGON' && /^(FC|MIX|GF)$/.test(vl)) PL_VL_NGON[m] = vl;
    if (/^(NHAY|PHA|PHANHAY)$/.test(String(r.Kieu || ''))) PL_KIEU_KHUC[m] = String(r.Kieu);
    if (String(r.An) === '1' || r.An === true) PL_AN[L][m] = 1;
  });
  rows.forEach(function(r) {
    if (String(r.Loai) !== 'DONG' || !r.Ma) return;
    var m = String(r.Ma), d = plTimDong_(m), goi = String(r.TenGoi || '').split('|').map(function(x) { return x.trim(); }).filter(Boolean);
    if (!d) { d = [m, '', 'GAY', [], '', '', '', '', 1]; PL_DONG.push(d); PL_THEM['DONG|' + m] = 1; }
    if (r.Ten) d[1] = String(r.Ten);
    if (/^(GAY|NGON|CHUOI)$/.test(String(r.LoaiHang))) d[2] = String(r.LoaiHang);
    if (goi.length) d[3] = goi;
    if (r.Chuoi) d[4] = String(r.Chuoi); if (r.Ngon) d[5] = String(r.Ngon); if (r.Tip) d[6] = String(r.Tip); if (r.Ren) d[7] = String(r.Ren);
    d[8] = 1;   // chủ dự án khai báo = chắc chắn
    if (r.Dau) PL_DAU_MD[m] = String(r.Dau); else if (PL_THEM['DONG|' + m]) delete PL_DAU_MD[m];
  });
  return rows;
}
function chNhan_() {
  return { loai: PL_LOAI, chuoi: PL_CHUOI, ngon: PL_NGON, tip: PL_TIP, ren: PL_REN, kieu: PL_KIEU, vl: PL_VL,
    dong: PL_DONG.map(function(x) { return [x[0], x[1], x[2]]; }),
    dongDu: PL_DONG.map(function(x) { return { ma: x[0], ten: x[1], loai: x[2], goi: x[3] || [], chuoi: x[4], ngon: x[5], tip: x[6], ren: x[7], dau: PL_DAU_MD[x[0]] || '', them: !!PL_THEM['DONG|' + x[0]] }; }),
    vlChuoi: PL_VL_CHUOI, vlNgon: PL_VL_NGON, kieuKhuc: PL_KIEU_KHUC, an: PL_AN, them: PL_THEM };
}
function chChu_(v, n) { return String(v == null ? '' : v).replace(/^[=@\s]+/, '').replace(/\s+/g, ' ').trim().slice(0, n); }   // bỏ "=" / "@" đầu tên (them_ còn chặn công thức bằng chuAnToan_)
/* Lưu 1 dòng cấu hình. o = { loai: 'DONG'|'CHUOI'|'NGON'|'TIP', ma?, ten, loaiHang, tenGoi: [..], chuoi, ngon, tip, ren, dau, chatLieu, kieu, an, xoa } */
function luuCauHinhSP(token, o) {
  var q = qtQuyen_(token); if (q.loi) return q.loi;
  o = o || {};
  khoa_(); xoaCache_(CH_SHEET); xoaCache_(PL_SHEET);   // khóa trước khi sinh mã / kiểm đang dùng / xóa theo số dòng (tránh 2 lần lưu cùng lúc, dữ liệu nhớ tạm cũ)
  plNapThem_();
  var L = String(o.loai || ''), co = function(b, v) { return Object.prototype.hasOwnProperty.call(b, String(v)); };
  if (!/^(DONG|CHUOI|NGON|TIP)$/.test(L)) return sach_({ ok: false, msg: 'Loại cấu hình không hợp lệ.' });
  var bangK = { CHUOI: PL_CHUOI, NGON: PL_NGON, TIP: PL_TIP }[L];
  var ma = String(o.ma || '').toUpperCase().replace(/[^A-Z0-9_-]/g, '').slice(0, 24), moi = !ma;
  var ten = chChu_(o.ten, 80);
  if (moi) {
    if (!ten) return sach_({ ok: false, msg: 'Nhập tên.' });
    var goc = (L === 'DONG' ? 'D' : L.charAt(0)) + '-' + (plChuan_(ten).replace(/[^A-Z0-9]/g, '').slice(0, 14) || 'MOI'), i = 1;
    ma = goc; while ((L === 'DONG' ? plTimDong_(ma) : co(bangK, ma))) ma = goc + (++i);
  } else if (L === 'DONG' ? !plTimDong_(ma) : !co(bangK, ma)) return sach_({ ok: false, msg: 'Không thấy mã ' + ma + '.' });
  var rec = { Loai: L, Ma: ma, Ten: ten, LoaiHang: '', TenGoi: '', Chuoi: '', Ngon: '', Tip: '', Ren: '', Dau: '', ChatLieu: '', Kieu: '', An: o.an ? '1' : '' };
  if (o.xoa) {
    if (moi) return sach_({ ok: false, msg: 'Thiếu mã.' });
    if (PL_THEM[L + '|' + ma]) {   // loại / dòng tự thêm: chỉ xóa được khi chưa dùng
      var dung = docAnToan_(PL_SHEET).some(function(r) { return String(r.Dong) === ma || String(r.Chuoi) === ma || String(r.Ngon) === ma || String(r.Tip) === ma; }) ||
        (L !== 'DONG' && PL_DONG.some(function(d) { return d[4] === ma || d[5] === ma || d[6] === ma; }));
      if (dung) return sach_({ ok: false, msg: 'Mã ' + ma + ' đang được dùng – chỉ ẩn được, không xóa.' });
    }
  } else if (L === 'DONG') {
    var goi = (Array.isArray(o.tenGoi) ? o.tenGoi : String(o.tenGoi || '').split(/[,\n|]/)).map(function(x) { return chChu_(x, 40).replace(/\|/g, '/'); }).filter(function(x) { return plChuan_(x).replace(/[^A-Z0-9]/g, '').length >= 3; }).slice(0, 15);
    if (!goi.length) return sach_({ ok: false, msg: 'Nhập ít nhất 1 chữ nhận diện (từ 3 ký tự chữ / số) có trong tên sản phẩm.' });
    if (!/^(GAY|NGON|CHUOI)$/.test(String(o.loaiHang))) return sach_({ ok: false, msg: 'Chọn loại hàng (gậy / ngọn lẻ / chuôi lẻ).' });
    var lh = String(o.loaiHang), c = String(o.chuoi || ''), n = String(o.ngon || ''), t = String(o.tip || ''), r = String(o.ren || '');
    if (lh === 'NGON') c = 'KHONG'; if (lh === 'CHUOI') { n = 'KHONG'; t = 'KHONG'; }
    if (!co(PL_CHUOI, c) || !co(PL_NGON, n) || !co(PL_TIP, t) || (r && !co(PL_REN, r))) return sach_({ ok: false, msg: 'Chọn đủ chuôi, ngọn, tip (ren có thể để trống).' });
    if (lh === 'GAY' && (c === 'KHONG' || n === 'KHONG')) return sach_({ ok: false, msg: 'Gậy cần cả loại chuôi và loại ngọn.' });
    var dau = String(o.dau || '').replace(',', '.'); if (dau && !/^(9\.5|1[0-4]\.\d)$/.test(dau)) return sach_({ ok: false, msg: 'Đầu mặc định dạng 12.5 (để trống nếu không có).' });
    if (moi && !ten) return sach_({ ok: false, msg: 'Nhập tên dòng gậy.' });
    rec.LoaiHang = lh; rec.TenGoi = goi.join('|'); rec.Chuoi = c; rec.Ngon = n; rec.Tip = t; rec.Ren = r; rec.Dau = dau;
  } else {
    var vl = String(o.chatLieu || ''), kieu = String(o.kieu || '');
    if (vl && !/^(FC|MIX|GF)$/.test(vl)) return sach_({ ok: false, msg: 'Chất liệu không hợp lệ.' });
    if (kieu && !/^(NHAY|PHA|PHANHAY)$/.test(kieu)) return sach_({ ok: false, msg: 'Kiểu không hợp lệ.' });
    if (L !== 'TIP' && moi && !vl) return sach_({ ok: false, msg: 'Chọn chất liệu.' });
    rec.ChatLieu = L === 'TIP' ? '' : vl; rec.Kieu = L === 'TIP' ? '' : kieu;
  }
  var sh = ss_().getSheetByName(CH_SHEET);
  if (!sh) { sh = ss_().insertSheet(CH_SHEET); sh.getRange(1, 1, 1, CH_COT.length).setValues([CH_COT]).setFontWeight('bold'); sh.setFrozenRows(1); sh.getRange(2, 1, sh.getMaxRows() - 1, CH_COT.length).setNumberFormat('@'); }
  docAnToan_(CH_SHEET).filter(function(x) { return String(x.Loai) === L && String(x.Ma) === ma; }).map(function(x) { return x._row; }).sort(function(a, b) { return b - a; }).forEach(function(x) { sh.deleteRow(x); });
  xoaCache_(CH_SHEET);
  if (!o.xoa) { rec.NguoiSua = q.me.tk; rec.ThoiDiem = Utilities.formatDate(new Date(), TZ_VN, 'yyyy-MM-dd HH:mm'); them_(CH_SHEET, rec); }
  ghiLog_(q.me, 'Cấu hình sản phẩm', L + ' ' + ma, '', o.xoa ? 'xóa / về mặc định' : [rec.Ten, rec.TenGoi, rec.Chuoi, rec.Ngon, rec.Tip, rec.Ren, rec.ChatLieu, rec.Kieu, rec.An].join(' / ').slice(0, 300));
  plNapThem_();
  return sach_({ ok: true, ma: ma, msg: o.xoa ? 'Đã xóa / trả về mặc định ' + ma + '.' : 'Đã lưu ' + (ten || ma) + '.', nhan: chNhan_() });
}
/* Việc hôm nay (chủ sở hữu): tên hàng trong đơn còn thiếu mà web chưa nhận ra cấu hình + loại khúc chưa có chất liệu + tab kênh mới */
function demSanPhamMoi(token) {
  var q = qtQuyen_(token); if (q.loi) return q.loi;
  var d; try { d = dhDocDon_(false); } catch (e) { return sach_({ ok: false, msg: 'Không đọc được Sheet đơn hàng.' }); }
  plNapThem_();
  var sua = {}; docAnToan_(PL_SHEET).forEach(function(r) { if (r.TenChuan) sua[String(r.TenChuan)] = r; });
  var ten = {}, khuc = {};
  d.don.forEach(function(o) {
    if (!(o.thieu > 0)) return;
    var k = plChuan_(o.ten), p = plPhanLoai_(o.ten, o.ghiChu, sua['K:' + k]);
    if (p.loai === 'PK' || p.loai === 'NOI') return;
    if (p.tin === 'do') { var x = ten[k] || (ten[k] = { ten: o.ten, thieu: 0, dong: 0 }); x.thieu += o.thieu; x.dong++; return; }
    if (p.vlC === 'KHAC' && p.chuoi && p.chuoi !== 'KHONG') { var a = khuc['CHUOI|' + p.chuoi] || (khuc['CHUOI|' + p.chuoi] = { bang: 'CHUOI', ma: p.chuoi, ten: PL_CHUOI[p.chuoi] || p.chuoi, thieu: 0 }); a.thieu += o.thieu; }
    if (p.vlN === 'KHAC' && p.ngon && p.ngon !== 'KHONG') { var b = khuc['NGON|' + p.ngon] || (khuc['NGON|' + p.ngon] = { bang: 'NGON', ma: p.ngon, ten: PL_NGON[p.ngon] || p.ngon, thieu: 0 }); b.thieu += o.thieu; }
  });
  var ds = Object.keys(ten).map(function(k) { return ten[k]; }).sort(function(a, b) { return b.thieu - a.thieu; });
  var dk = Object.keys(khuc).map(function(k) { return khuc[k]; }).sort(function(a, b) { return b.thieu - a.thieu; });
  return sach_({ ok: true, n: ds.length, ten: ds.slice(0, 20), thieu: ds.reduce(function(a, x) { return a + x.thieu; }, 0), khuc: dk.slice(0, 20), tabMoi: d.tabMoi || [] });
}

/* ===== 07/11 (chủ dự án): sản lượng nhập theo ngày = tổng còn thiếu bản chụp trước − bản chụp sau, CÙNG các dòng đơn =====
   (quan-ly-van-hanh) chỉ so dòng có ở cả 2 bản chụp; dòng mới thêm không tính; còn thiếu TĂNG (sửa số / hỏng) ghi riêng "điều chỉnh", không trừ vào sản lượng;
   dòng biến mất khi còn thiếu ghi riêng "mất" (có thể đã giao rồi chuyển sang Đơn hàng HT, hoặc hủy); khoảng giữa 2 bản chụp có thể dài nhiều ngày (chủ nhật, ngày lễ, mất bản chụp).
   Sheet ẩn DonHangSanLuong (trong file KPI): Ngay | TuNgay | Ra | SX | Vao | Ton | Mat | Tang | ChiTiet – giữ lâu dài (bản chụp chỉ giữ 30 ngày). */
var DH_SL = 'DonHangSanLuong', DH_SL_COT = ['Ngay', 'TuNgay', 'Ra', 'SX', 'Vao', 'Ton', 'Mat', 'Tang', 'ChiTiet'];
function dhLoaiSL_(loai) { return loai === 'GAY' || loai === 'CHUOI' || loai === 'NGON' || loai === 'PK' || loai === 'NOI' ? loai : 'KHAC'; }
/* 07/11 (theo ORDER·FLOW): gộp các dòng trùng mã + tên + tab (#2, #3…) trước khi so -> xóa / chèn 1 dòng trùng không làm lệch sản lượng */
function dhGop_(rows, boHT) {
  var m = {}, out = [];
  rows.forEach(function(r) {
    if (boHT && r[6] === 1) return;
    var k = String(r[0]).replace(/#\d+$/, ''), g = m[k];
    if (!g) { g = m[k] = [k, 0, 0, Number(r[3]) || 0, r[4], r[5], 0, null]; g.n = 0; g.ht = 0; g.co7 = 0; out.push(g); }
    g[1] += Number(r[1]) || 0; g[2] += Number(r[2]) || 0; g.n++;
    if (r[6] === 1) { g.ht++; if (r[7] != null) { g.co7 = 1; g[7] = (g[7] || 0) + (Number(r[7]) || 0); } }
  });
  out.forEach(function(g) { g[6] = g.ht && g.ht === g.n ? 1 : 0; if (!g[6] || !g.co7) g[7] = null; });
  return out;
}
function dhTinhSanLuong_(cu, nay, plCache, sua) {   // cu, nay: mảng dòng bản chụp [k, sl, thieu, giao, dl, st]
  cu = dhGop_(cu, true); nay = dhGop_(nay, false);
  var m = {}, kq = { ra: 0, sx: 0, vao: 0, ton: 0, mat: 0, tang: 0, kenh: {}, loai: {}, don: {}, ht: { n: 0, sp: 0, thieu: 0 } };
  cu.forEach(function(r) { m[r[0]] = r; });
  var co = {};
  nay.forEach(function(r) {
    var t = Number(r[2]) || 0, c = m[r[0]], laHT = r[6] === 1; co[r[0]] = 1; if (!laHT) kq.ton += t;
    if (!c && laHT && r[7] != null) c = [r[0], r[1], r[7]];   // dòng chuyển HT chậm (đã vắng ở bản chụp trước): lấy số thiếu lần cuối còn thấy
    if (!c) { if (!laHT) kq.vao += Number(r[1]) || 0; return; }
    if (c && c[6] === 1) return;   // đã tính hôm chuyển
    var t0 = Number(c[2]) || 0;
    if (laHT) { kq.ht.n++; kq.ht.sp += Math.max(0, t0 - t); kq.ht.thieu += t; if (t >= t0) return; }   // phần thiếu khi chuyển = giao thiếu / hủy: không cộng sản lượng, không tính "điều chỉnh"
    if (t > t0) { kq.tang += t - t0; return; }
    if (t0 <= t) return;
    var ra = t0 - t, a = String(r[0]).replace(/#\d+$/, '').split('|'), tab = a[2] || '', kn = DH_NHAN_TAB[tab] || tab, ten = a[1] || '';
    var l = plCache[ten]; if (l == null) { try { var tc = plChuan_(ten); l = plCache[ten] = dhLoaiSL_(plPhanLoai_(ten, '', sua['K:' + tc]).loai); } catch (e) { l = plCache[ten] = 'KHAC'; } }
    kq.ra += ra; if (l !== 'PK' && l !== 'NOI') kq.sx += ra;
    kq.kenh[kn] = (kq.kenh[kn] || 0) + ra; kq.loai[l] = (kq.loai[l] || 0) + ra;
    var md = (a[0] || '(không mã)') + '|' + kn; kq.don[md] = (kq.don[md] || 0) + ra;
  });
  cu.forEach(function(r) { if (!co[r[0]] && r[6] !== 1 && (Number(r[2]) || 0) > 0) kq.mat += Number(r[2]) || 0; });
  return kq;
}
function dhGhiSanLuong_(ch) {
  var ds = Object.keys(ch || {}).sort(); if (ds.length < 2) return 0;
  var sh = ss_().getSheetByName(DH_SL), daCo = {};
  if (sh && sh.getLastRow() >= 2) sh.getRange(2, 1, sh.getLastRow() - 1, 1).getDisplayValues().forEach(function(r) { daCo[String(r[0])] = 1; });
  var thieu = []; for (var i = 1; i < ds.length; i++) if (!daCo[ds[i]]) thieu.push(i);
  if (!thieu.length) return 0;
  plNapThem_();
  var sua = {}; docAnToan_(PL_SHEET).forEach(function(r) { if (r.TenChuan) sua[String(r.TenChuan)] = r; });
  var pc = {}, rows = thieu.map(function(i) {
    var k = dhTinhSanLuong_(ch[ds[i - 1]], ch[ds[i]], pc, sua), top = Object.keys(k.don).map(function(x) { return [x, k.don[x]]; }).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 15);
    return [ds[i], ds[i - 1], k.ra, k.sx, k.vao, k.ton, k.mat, k.tang, '~' + JSON.stringify({ kenh: k.kenh, loai: k.loai, top: top, ht: k.ht })];
  });
  khoa_();
  sh = ss_().getSheetByName(DH_SL);
  if (!sh) { sh = ss_().insertSheet(DH_SL); sh.getRange(1, 1, 1, DH_SL_COT.length).setValues([DH_SL_COT]).setFontWeight('bold'); sh.setFrozenRows(1); try { sh.hideSheet(); } catch (e) {} }
  if (sh.getLastRow() >= 2) { var lai = {}; sh.getRange(2, 1, sh.getLastRow() - 1, 1).getDisplayValues().forEach(function(r) { lai[String(r[0])] = 1; }); rows = rows.filter(function(r) { return !lai[r[0]]; }); }   // người khác vừa ghi
  if (!rows.length) return 0;
  sh.getRange(sh.getLastRow() + 1, 1, rows.length, DH_SL_COT.length).setNumberFormat('@').setValues(rows.map(function(r) { return r.map(String); }));
  return rows.length;
}
function dhDocSanLuong_() {   // -> [[ngay, tuNgay, ra, sx, vao, ton, mat, tang, {kenh, loai, top}]] tăng dần theo ngày
  var sh = ss_().getSheetByName(DH_SL); if (!sh || sh.getLastRow() < 2) return [];
  return sh.getRange(2, 1, sh.getLastRow() - 1, DH_SL_COT.length).getDisplayValues().map(function(r) {
    var ct = {}; try { ct = JSON.parse(String(r[8]).replace(/^~/, '')); } catch (e) {}
    return [r[0], r[1], Number(r[2]) || 0, Number(r[3]) || 0, Number(r[4]) || 0, Number(r[5]) || 0, Number(r[6]) || 0, Number(r[7]) || 0, ct];
  }).filter(function(r) { return /^\d{4}-\d\d-\d\d$/.test(r[0]); }).sort(function(a, b) { return a[0] < b[0] ? -1 : 1; });
}

/* ===== 07/11 (chủ dự án + quan-ly-van-hanh): công suất và ngày nghỉ để phân tích độ hợp lý số lượng / deadline =====
   13/11: mặc định 310 sp/ngày (chủ dự án chốt lại) cho mọi hàng sản xuất (gậy + chuôi lẻ + ngọn lẻ; không tính phụ kiện, tay nối);
   làm thứ 2 – thứ 7 ≈ 26 công/tháng; ngày lễ điền sẵn theo luật, chủ sở hữu sửa trên web. Giá trị đã lưu ở Script Property DH_CONG_SUAT vẫn thắng mặc định. */
var DH_CS_MAC = 310;
/* 07/11 (theo ORDER·FLOW): ngày lễ tự tính mọi năm – Tết Dương lịch, Tết Nguyên đán (29 Tết → mùng 3, 5 ngày), Giỗ Tổ 10/3 âm, 30/4, 1/5, 2/9 + 3/9.
   Âm lịch → dương lịch theo thuật toán Hồ Ngọc Đức (múi giờ +7). Chủ sở hữu thêm ngày nghỉ riêng của công ty; ngày lễ tự tính nào công ty vẫn làm thì ghi "làm bù". */
function dhJd_(d, m, y) { var a = Math.floor((14 - m) / 12), yy = y + 4800 - a, mm = m + 12 * a - 3; return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045; }
function dhTuJd_(jd) { var a = jd + 32044, b = Math.floor((4 * a + 3) / 146097), c = a - Math.floor(b * 146097 / 4), d = Math.floor((4 * c + 3) / 1461), e = c - Math.floor(1461 * d / 4), m = Math.floor((5 * e + 2) / 153);
  return [e - Math.floor((153 * m + 2) / 5) + 1, m + 3 - 12 * Math.floor(m / 10), b * 100 + d - 4800 + Math.floor(m / 10)]; }
function dhSoc_(k) {
  var T = k / 1236.85, T2 = T * T, T3 = T2 * T, dr = Math.PI / 180, jd = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  jd += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  var M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3, Mp = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3, F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  var C = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M) - 0.4068 * Math.sin(Mp * dr) + 0.0161 * Math.sin(2 * dr * Mp) - 0.0004 * Math.sin(3 * dr * Mp) + 0.0104 * Math.sin(2 * dr * F)
    - 0.0051 * Math.sin(dr * (M + Mp)) - 0.0074 * Math.sin(dr * (M - Mp)) + 0.0004 * Math.sin(dr * (2 * F + M)) - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mp)) + 0.0010 * Math.sin(dr * (2 * F - Mp)) + 0.0005 * Math.sin(dr * (2 * Mp + M));
  var delta = T < -11 ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3 : -0.000278 + 0.000265 * T + 0.000262 * T2;
  return Math.floor(jd + C - delta + 0.5 + 7 / 24);
}
function dhKinhDo_(jdn) { var T = (jdn - 2451545.5 - 7 / 24) / 36525, T2 = T * T, dr = Math.PI / 180, M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2, L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  var DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M) + (0.019993 - 0.000101 * T) * Math.sin(2 * dr * M) + 0.000290 * Math.sin(3 * dr * M), L = (L0 + DL) * dr;
  L = L - Math.PI * 2 * Math.floor(L / (Math.PI * 2)); return Math.floor(L / Math.PI * 6); }
function dhThang11_(y) { var k = Math.floor((dhJd_(31, 12, y) - 2415021) / 29.530588853), nm = dhSoc_(k); return dhKinhDo_(nm) >= 9 ? dhSoc_(k - 1) : nm; }
function dhNhuan_(a11) { var k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5), last = 0, i = 1, arc = dhKinhDo_(dhSoc_(k + i)); do { last = arc; i++; arc = dhKinhDo_(dhSoc_(k + i)); } while (arc !== last && i < 14); return i - 1; }
function dhAmSangDuong_(d, m, y) {   // -> 'yyyy-mm-dd' (tháng không nhuận)
  var a11, b11; if (m < 11) { a11 = dhThang11_(y - 1); b11 = dhThang11_(y); } else { a11 = dhThang11_(y); b11 = dhThang11_(y + 1); }
  var k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5), off = m - 11; if (off < 0) off += 12;
  if (b11 - a11 > 365) { var lOff = dhNhuan_(a11); if (off >= lOff) off += 1; }
  var r = dhTuJd_(dhSoc_(k + off) + d - 1); return r[2] + '-' + ('0' + r[1]).slice(-2) + '-' + ('0' + r[0]).slice(-2);
}
function dhCongNgay_(s, n) { var p = s.split('-'), t = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2] + n)); return t.getUTCFullYear() + '-' + ('0' + (t.getUTCMonth() + 1)).slice(-2) + '-' + ('0' + t.getUTCDate()).slice(-2); }
/* 08/11 (chủ dự án): ngày nghỉ lễ cố định hằng năm của công ty ngoài bảng NgayLe (Cẩm nang hội nhập 09/2026: Ngày Văn hóa Việt Nam 24/11).
   Dùng chung cho KPI / điểm danh (bangNgayLe_), công suất Đơn hàng (dhLeNam_), Thống kê (tkNgayLam_). Rơi vào chủ nhật thì không nghỉ bù. */
var LE_CO_DINH_ = [['11-24', 'Ngày Văn hóa Việt Nam']];
function leCoDinhNam_() { var y = Number(Utilities.formatDate(new Date(), TZ_VN, 'yyyy')), o = []; for (var k = y - 1; k <= y + 1; k++) LE_CO_DINH_.forEach(function(x) { o.push([k + '-' + x[0], x[1]]); }); return o; }
function dhLeNam_(y) {
  var out = [[y + '-01-01', 'Tết Dương lịch'], [y + '-04-30', 'Giải phóng miền Nam'], [y + '-05-01', 'Quốc tế Lao động'], [y + '-09-02', 'Quốc khánh']];   // ngày nghỉ kèm Quốc khánh theo bảng NgayLe của công ty
  var tet = dhAmSangDuong_(1, 1, y);
  for (var i = -2; i <= 2; i++) out.push([dhCongNgay_(tet, i), 'Tết Nguyên đán' + (i === 0 ? ' (mùng 1)' : '')]);
  out.push([dhAmSangDuong_(10, 3, y), 'Giỗ Tổ Hùng Vương (10/3 âm)']);
  LE_CO_DINH_.forEach(function(x) { out.push([y + '-' + x[0], x[1]]); });   // 08/11: 24/11
  return out;
}
function dhCongSuat_() {
  var o = null; try { o = JSON.parse(PropertiesService.getScriptProperties().getProperty('DH_CONG_SUAT') || 'null'); } catch (e) {}
  if (!o || typeof o !== 'object') o = {};
  var sp = Number(o.sp); if (!(sp >= 1 && sp <= 100000)) sp = DH_CS_MAC;
  if (sp === 300 || sp === 350) sp = DH_CS_MAC;   // 13/11: 300 / 350 là mặc định của bản cũ đã lỡ lưu -> theo mặc định mới (310); số khác giữ nguyên
  var re = /^\d{4}-\d\d-\d\d$/, tay = Array.isArray(o.nghi) ? o.nghi.filter(function(x) { return Array.isArray(x) && re.test(String(x[0])); }).map(function(x) { return [String(x[0]), String(x[1] || '').slice(0, 60)]; }) : [];
  var lam = Array.isArray(o.lam) ? o.lam.filter(function(x) { return re.test(String(x)); }).map(String) : [];   // ngày làm bù (chủ nhật đi làm, hoặc ngày lễ tự tính mà công ty vẫn làm)
  var nam = Number(Utilities.formatDate(new Date(), TZ_VN, 'yyyy')), tu = [], co = {};
  for (var y = nam - 1; y <= nam + 1; y++) dhLeNam_(y).forEach(function(x) { tu.push(x); });
  var le = [];   // 07/11: bảng NgayLe (lịch nghỉ công ty đang dùng cho KPI) – dòng không ghi xưởng = cả nhà máy
  try { docAnToan_('NgayLe').forEach(function(r) { var d = ngayVN_(r.Ngay); if (re.test(d) && !String(r.MaXuong || '').trim()) le.push([d, String(r.TenLe || 'Nghỉ lễ').slice(0, 60) + ' (lịch KPI)']); }); } catch (e) {}
  var nghi = [];
  tay.concat(le, tu).forEach(function(x) { if (!co[x[0]]) { co[x[0]] = 1; nghi.push(x); } });
  return { sp: sp, nghi: nghi.sort(function(a, b) { return a[0] < b[0] ? -1 : 1; }), nghiTay: tay.sort(function(a, b) { return a[0] < b[0] ? -1 : 1; }), nghiTuDong: tu.concat(le).sort(function(a, b) { return a[0] < b[0] ? -1 : 1; }), lam: lam.sort(), macDinh: !Array.isArray(o.nghi) };
}
function luuCongSuat(token, o) {
  var q = qtQuyen_(token); if (q.loi) return q.loi;
  o = o || {};
  var sp = Math.round(Number(o.sp)); if (!(sp >= 1 && sp <= 100000)) return sach_({ ok: false, msg: 'Công suất phải từ 1 đến 100.000 sp/ngày.' });
  var bad = '', nghi = (Array.isArray(o.nghi) ? o.nghi : []).slice(0, 200).map(function(x) {
    var d = String((x && x[0]) || '').trim(); if (!/^\d{4}-\d\d-\d\d$/.test(d) || isNaN(new Date(d + 'T00:00:00').getTime())) bad = d || '(trống)';
    return [d, String((x && x[1]) || '').replace(/^[=+\-@]+/, '').trim().slice(0, 60)];
  });
  var lam = (Array.isArray(o.lam) ? o.lam : []).slice(0, 100).map(function(d) { d = String(d || '').trim(); if (!/^\d{4}-\d\d-\d\d$/.test(d)) bad = d || '(trống)'; return d; });
  if (bad) return sach_({ ok: false, msg: 'Ngày không hợp lệ: ' + bad + ' (cần dạng năm-tháng-ngày).' });
  var gon = {}; nghi = nghi.filter(function(x) { if (gon[x[0]]) return false; gon[x[0]] = 1; return true; });
  try { PropertiesService.getScriptProperties().setProperty('DH_CONG_SUAT', JSON.stringify({ sp: sp, nghi: nghi, lam: lam })); }
  catch (e) { return sach_({ ok: false, msg: 'Không lưu được.' }); }
  ghiLog_(q.me, 'Công suất đơn hàng', sp + ' sp/ngày', '', nghi.length + ' ngày nghỉ, ' + lam.length + ' ngày làm bù');
  return sach_({ ok: true, msg: 'Đã lưu công suất ' + sp + ' sp/ngày và ' + nghi.length + ' ngày nghỉ.', cs: dhCongSuat_() });
}

/* ===== 07/11 (chủ dự án): đơn xong được chép CẢ ĐƠN sang tab HT-<năm> rồi xóa khỏi tab kênh; có khi chuyển khi còn thiếu (giao thiếu / hủy).
   Lúc chụp 9h: dòng có ở bản chụp trước, nay không còn ở tab kênh mà có ở tab HT (cùng mã đơn + tên) -> thêm vào bản chụp hôm nay
   [khóa cũ, SL, còn thiếu ghi ở HT, giao, deadline, 'daGiao', 1]: sản lượng = thiếu hôm trước − thiếu ghi ở HT; phần thiếu ghi ở HT = giao thiếu, không tính "mất".
   Tab HT chỉ đọc lúc chụp (1 lần / ngày), không đọc khi mở web. Sự kiện lưu ở sheet ẩn DonHangHoanThien để báo cáo "đã hoàn thiện". */
var DH_HT = 'DonHangHoanThien', DH_HT_COT = ['Ngay', 'TuNgay', 'MaDon', 'Ten', 'Kenh', 'NguoiDat', 'SL', 'ThieuTruoc', 'ThieuHT', 'Deadline', 'DungHan', 'NgayDat'];
/* (quan-ly-van-hanh) DungHan: 'dung' = đủ hàng + đúng hạn (OTIF), 'tre' = đủ nhưng trễ, 'giaoThieu' = chuyển khi còn thiếu (không tính OTIF);
   đúng hạn so với ngày CUỐI CÙNG còn thấy đơn ở tab kênh (cho lệch 1 lần chụp vì 9h hôm sau mới phát hiện) */
function dhDocHT_() {   // -> { 'maDon|ten': {thieu, sl, dl, nguoiDat} } từ tab HT năm nay + năm trước
  var ss = SpreadsheetApp.openById(DH_SHEET_ID), nam = Number(Utilities.formatDate(new Date(), TZ_VN, 'yyyy')), m = {};
  ss.getSheets().forEach(function(sh) {
    var ten = String(sh.getName()).trim(), y = Number((ten.match(/(\d{4})$/) || [])[1]);
    if (!DH_TAB_HT.test(ten) || (y !== nam && y !== nam - 1)) return;
    dhDocTab_(sh, ten, nam).forEach(function(o) { var k = dhKhoaDong_(o).split('|').slice(0, 2).join('|'); if (!m[k]) m[k] = { thieu: o.thieu, sl: o.sl, dl: o.dl || '', nguoiDat: o.nguoiDat || '', ngayDat: o.ngayDat || '' }; });
  });
  return m;
}
function dhTimChuyenHT_(rowsNay, hom) {
  /* xét 3 bản chụp gần nhất trước hôm nay: dòng xóa khỏi tab kênh mà hôm đó chưa chép sang HT vẫn được nhận khi HT có (quan-ly-van-hanh: "để treo, đối chiếu lại") */
  var ch = dhDocChup_(), ds = Object.keys(ch).filter(function(x) { return x < hom; }).sort().slice(-3);
  if (!ds.length) return { dong: [], su: [] };
  var co = {}, daHT = {}, cuoi = {};
  rowsNay.forEach(function(r) { co[r[0]] = 1; });
  ds.forEach(function(d) { ch[d].forEach(function(r) { if (r[6] === 1) daHT[r[0]] = 1; else cuoi[r[0]] = { r: r, d: d }; }); });   // lần cuối còn thấy ở tab kênh
  var mat = Object.keys(cuoi).filter(function(k) { return !co[k] && !daHT[k]; });
  if (!mat.length) return { dong: [], su: [] };
  var ht = dhDocHT_(), dong = [], su = [];
  mat.forEach(function(k) {
    var r = cuoi[k].r, tu = cuoi[k].d, a = String(k).replace(/#\d+$/, '').split('|'), h = ht[a[0] + '|' + a[1]]; if (!h) return;
    var t = Math.max(0, Math.min(Number(h.thieu) || 0, Number(r[1]) || 0)), t0 = Number(r[2]) || 0, dl = r[4] || h.dl || '';
    dong.push([k, r[1], t, r[3] || 0, dl, 'daGiao', 1, t0]);   // cột 8: còn thiếu lần cuối thấy ở tab kênh (khi lần cuối không phải bản chụp liền trước)
    su.push([hom, tu, a[0], a[1], DH_NHAN_TAB[a[2]] || a[2], h.nguoiDat, Number(r[1]) || 0, t0, t, dl, t > 0 ? 'giaoThieu' : (!dl ? '' : (tu <= dl ? 'dung' : 'tre')), h.ngayDat || '']);
  });
  return { dong: dong, su: su };
}
function dhGhiHoanThien_(su) {
  if (!su || !su.length) return 0;
  khoa_();
  var sh = ss_().getSheetByName(DH_HT);
  if (!sh) { sh = ss_().insertSheet(DH_HT); sh.getRange(1, 1, 1, DH_HT_COT.length).setValues([DH_HT_COT]).setFontWeight('bold'); sh.setFrozenRows(1); try { sh.hideSheet(); } catch (e) {} }
  if (sh.getLastRow() >= 2 && sh.getRange(2, 1, sh.getLastRow() - 1, 1).getDisplayValues().some(function(r) { return String(r[0]) === su[0][0]; })) return 0;   // ngày này đã ghi
  sh.getRange(sh.getLastRow() + 1, 1, su.length, DH_HT_COT.length).setNumberFormat('@').setValues(su.map(function(r) { return r.map(function(x) { return String(x == null ? '' : x).replace(/^[=+\-@]/, "'$&"); }); }));
  return su.length;
}
function dhDocHoanThien_() {   // -> [[ngay, tuNgay, maDon, ten, kenh, nguoiDat, sl, thieuTruoc, thieuHT, dl, dungHan, ngayDat]] 400 ngày gần nhất
  var sh = ss_().getSheetByName(DH_HT); if (!sh || sh.getLastRow() < 2) return [];
  var moc = Utilities.formatDate(new Date(Date.now() - 400 * 864e5), TZ_VN, 'yyyy-MM-dd');
  return sh.getRange(2, 1, sh.getLastRow() - 1, DH_HT_COT.length).getDisplayValues().filter(function(r) { return String(r[0]) >= moc; }).map(function(r) {
    return [r[0], r[1], String(r[2]).replace(/^'/, ''), String(r[3]).replace(/^'/, ''), r[4], String(r[5]).replace(/^'/, ''), Number(r[6]) || 0, Number(r[7]) || 0, Number(r[8]) || 0, r[9], r[10], r[11] || ''];
  });
}

/* ===== 07/11 (chủ dự án): đơn đã hoàn thiện đọc TRỰC TIẾP từ tab HT-<năm> (không phụ thuộc bản chụp) – cho báo cáo 3 tháng =====
   Tab HT không có ngày xong -> tháng tính theo HẠN (hạn mới HT nếu có, không thì deadline). Kênh: cột "Kênh" > dòng tiêu đề nhóm kênh
   > mã đơn còn ở tab kênh / bản chụp / sự kiện hoàn thiện > "Chưa xác định" (chủ dự án 07/11). Nhớ tạm 10 phút. */
function dhCacheLay_(k) { try { var c = CacheService.getScriptCache(), n = Number(c.get(k + '_n') || 0); if (!n) return null; var ks = []; for (var i = 0; i < n; i++) ks.push(k + '_' + i); var a = c.getAll(ks), s = ''; for (var j = 0; j < n; j++) { if (a[k + '_' + j] == null) return null; s += a[k + '_' + j]; } return JSON.parse(s); } catch (e) { return null; } }
function dhCacheGhi_(k, o, giay) { try { var s = JSON.stringify(o), p = {}, m = 0; for (var x = 0; x < s.length; x += 30000) p[k + '_' + (m++)] = s.slice(x, x + 30000); p[k + '_n'] = String(m); CacheService.getScriptCache().putAll(p, giay); } catch (e) {} }
function layDonHoanThien(token, lamMoi) {
  var q = dhQuyenDon_(token); if (q.loi) return q.loi;   // 14/11: tab Hoàn thiện nằm trong Đơn hàng -> mở cùng quyền
  /* 08/11 tăng tốc: gửi gọn dạng bảng, chỉ các cột web dùng (1,7 MB → ~0,3 MB). Trình duyệt mở lại bằng dhHTMo. */
  var H = dhHTTrucTiep_(lamMoi), cot = ['maDon', 'kenh', 'tab', 'nguoiDat', 'dl', 'hanMoi', 'thang', 'sl', 'thieu'], o = {};
  Object.keys(H).forEach(function(k) { if (k !== 'don') o[k] = H[k]; });
  if (H.don) { o.donC = cot; o.donH = H.don.map(function(d) { return cot.map(function(c) { var v = d[c]; return v === undefined ? '' : v; }); }); }
  return sach_(o);
}
function dhHTTrucTiep_(lamMoi) {
  var K = 'DH_HT_v2', kq = lamMoi ? null : dhCacheLay_(K);
  if (kq) return kq;
  var ss, nam = Number(Utilities.formatDate(new Date(), TZ_VN, 'yyyy')), rows = [], tabs = [];
  try { ss = SpreadsheetApp.openById(DH_SHEET_ID); } catch (e) { return { ok: false, msg: 'Không mở được Sheet đơn hàng: ' + (e && e.message || e) }; }
  ss.getSheets().forEach(function(sh) {
    var ten = String(sh.getName()).trim(), y = Number((ten.match(/(\d{4})$/) || [])[1]);
    if (!DH_TAB_HT.test(ten) || (y !== nam && y !== nam - 1)) return;
    tabs.push(ten); rows = rows.concat(dhDocTab_(sh, ten, y));
  });
  var tabMa = {}, d = null;   // mã đơn -> tab kênh
  try { d = dhDocDon_(false); d.don.forEach(function(o) { if (o.maDon && !tabMa[o.maDon]) tabMa[o.maDon] = o.tab; }); } catch (e) {}
  try { var ch = dhDocChup_(); Object.keys(ch).forEach(function(x) { ch[x].forEach(function(r) { var a = String(r[0]).split('|'); if (a[0] && a[2] && !tabMa[a[0]]) tabMa[a[0]] = a[2]; }); }); } catch (e) {}
  try { dhDocHoanThien_().forEach(function(r) { if (r[2] && !tabMa[r[2]]) { for (var t in DH_NHAN_TAB) if (DH_NHAN_TAB[t] === r[4]) tabMa[r[2]] = t; } }); } catch (e) {}
  plNapThem_();
  var sua = {}; docAnToan_(PL_SHEET).forEach(function(r) { if (r.TenChuan) sua[String(r.TenChuan)] = r; });
  /* 07/11 (chủ dự án): tab HT không có cột kênh -> suy kênh theo TIỀN TỐ mã đơn (người đặt): luật cố định + kênh chiếm đa số của cùng tiền tố ở tab kênh / đơn HT đã biết kênh */
  var demTT = {}, dem = function(nd, tab) { nd = String(nd || '').trim().toUpperCase(); if (!nd || !tab) return; var x = demTT[nd] || (demTT[nd] = {}); x[tab] = (x[tab] || 0) + 1; };
  try { d && d.don.forEach(function(o) { dem(o.nguoiDat, o.tab); }); } catch (e) {}
  rows.forEach(function(o) { dem(o.nguoiDat, o.kenhCot || o.kenhNhom || tabMa[o.maDon]); });
  var tienTo = function(o) {
    var nd = String(o.nguoiDat || '').trim().toUpperCase(), ma = String(o.maDon || '').toUpperCase();
    if (/^#?KHO\b/.test(ma) || /\bKHO\b/.test(nd)) return 'KHO';   // KHO, EVO KHO, ĐƠN SX TRẢ KHO
    if (/ECOM/.test(nd) || /ECOM/.test(ma)) return 'POD-ECOMSTONE';
    if (/^POD/.test(nd)) return 'POD-A.BÁCH';
    var x = demTT[nd]; if (!x) return '';
    var ks = Object.keys(x).sort(function(a, b) { return x[b] - x[a]; }), tong = ks.reduce(function(s, k) { return s + x[k]; }, 0);
    return x[ks[0]] / tong >= 0.6 ? ks[0] : '';
  };
  var nguon = { cot: 0, nhom: 0, ma: 0, tienTo: 0, khong: 0 }, pc = {};
  var don = rows.map(function(o) {
    var tab = o.kenhCot || o.kenhNhom || tabMa[o.maDon] || '', n = o.kenhCot ? 'cot' : o.kenhNhom ? 'nhom' : tab ? 'ma' : 'khong';
    if (!tab) { tab = tienTo(o); if (tab) n = 'tienTo'; }
    nguon[n]++;
    var tc = plChuan_(o.ten), p = pc[tc] || (pc[tc] = plPhanLoai_(o.ten, o.ghiChu, sua['K:' + tc]));
    return { maDon: o.maDon, ten: o.ten, tab: tab || 'KHONG_RO', kenh: tab ? (DH_NHAN_TAB[tab] || tab) : 'Chưa xác định', nguoiDat: o.nguoiDat || '', ngayDat: o.ngayDat || '',
      dl: o.dl || '', hanMoi: o.hanMoi || '', thang: String(o.hanMoi || o.dl || '').slice(0, 7), sl: o.sl, thieu: o.thieu, daTra: o.daTra || 0, htTab: o.tab,
      pl: { loai: p.loai, kieu: p.kieu, vlC: p.vlC, vlN: p.vlN, tin: p.tin } };
  });
  kq = { ok: true, luc: Utilities.formatDate(new Date(), TZ_VN, 'yyyy-MM-dd HH:mm'), tabs: tabs, don: don, nguon: nguon };
  dhCacheGhi_(K, kq, 600);
  return kq;
}

/* ===== 07/11: sản lượng Đóng gói theo ngày từ NHẬT KÝ KPI (dữ liệu trực tiếp, đủ 3 tháng) – bước xuất của xưởng Đóng gói như tab Quy trình ===== */
var DH_DG_MD = /DONG GOI THANH PHAM|DONG DON LE (GAY|NGON|CUSTOM|COMBO)/;
function dhMaDongGoi_() {
  var cds = doc_('CongDoan'), qt = qtDocQT_(cds.filter(function(c) { return String(c.TrangThai).trim() !== 'Ngừng'; }));
  if (qt.xuat && qt.xuat.DG && qt.xuat.DG.length) return qt.xuat.DG.slice();
  return cds.filter(function(c) { return String(c.MaXuong) === 'DG' && DH_DG_MD.test(plChuan_(c.TenCD)); }).map(function(c) { return String(c.MaCD); });
}
function dhDongGoiNgay_(tu, den) {   // -> { ma: [...], ngay: { 'yyyy-mm-dd': sp } }
  var ma = dhMaDongGoi_(), co = {}, out = {}; ma.forEach(function(m) { co[m] = 1; });
  docNKTu_(tu).forEach(function(r) {
    if (!co[String(r.MaCD)] || String(r.TrangThai).trim() === 'Từ chối') return;
    var ng = ngayVN_(r.Ngay); if (ng < tu || ng > den) return;
    var sl = Number(r.SoLuongLamRa) || 0; if (sl > 0) out[ng] = (out[ng] || 0) + sl;
  });
  return { ma: ma, ngay: out };
}
/* 07/11 (chủ dự án: "phải có biểu đồ sản lượng của từng xưởng"): sản lượng ngày của MỌI xưởng = tổng ở bước xuất của xưởng (tab Quy trình → Sửa quy trình).
   Xưởng chưa khai bước xuất: In UV = In và phủ bóng + Phủ bóng bề mặt gậy; Hoàn thiện = Tổ check hàng (chủ dự án duyệt đề xuất của Claude 07/11); Đóng gói = như dhMaDongGoi_. */
var DH_XUONG_TT = ['PHOICB', 'PHOITHO', 'CNC', 'NGONTARO', 'NGONTIP', 'SON', 'INUV', 'HT', 'DG'];   // theo dòng chảy Phôi → Đóng gói
var DH_XUAT_MAC_DINH = { INUV: ['IN-BONG', 'BONG'], HT: ['HT-CHECK'] };
function dhSanLuongXuong_(tu, den) {   // -> { X: { ten, ma: [...], ngay: { 'yyyy-mm-dd': sl }, macDinh } }
  var cds = doc_('CongDoan'), dung = cds.filter(function(c) { return String(c.TrangThai).trim() !== 'Ngừng'; }), qt = qtDocQT_(dung), co = {}, out = {};
  var ten = {}; docAnToan_('PhongBan').forEach(function(r) { ten[String(r.MaXuong)] = String(r.TenXuong || r.MaXuong); });
  var coCD = {}, tenCD = {}; dung.forEach(function(c) { coCD[String(c.MaCD)] = String(c.MaXuong); tenCD[String(c.MaCD)] = String(c.TenCD || c.MaCD); });
  DH_XUONG_TT.forEach(function(X) {
    var ma = X === 'DG' ? dhMaDongGoi_() : ((qt.xuat && qt.xuat[X] && qt.xuat[X].length) ? qt.xuat[X].slice() : null), macDinh = false;
    if (!ma) { ma = (DH_XUAT_MAC_DINH[X] || []).filter(function(m) { return coCD[m] === X; }); macDinh = ma.length > 0; }
    out[X] = { ten: ten[X] || X, ma: ma, ngay: {}, buoc: {}, tenCD: {}, macDinh: macDinh, luot: (qt.luot && qt.luot[X]) || 1 };   // 08/11: luot = số lần ghi mỗi khúc (Sơn: mỗi lớp 1 lần) -> sản lượng = tổng ÷ luot; buoc giữ số ghi thật
    ma.forEach(function(m) { out[X].tenCD[m] = tenCD[m] || m; });
    ma.forEach(function(m) { (co[m] = co[m] || []).push(X); });
  });
  docNKTu_(tu).forEach(function(r) {
    var xs = co[String(r.MaCD)]; if (!xs || String(r.TrangThai).trim() === 'Từ chối') return;
    var ng = ngayVN_(r.Ngay); if (ng < tu || ng > den) return;
    var sl = Number(r.SoLuongLamRa) || 0, m = String(r.MaCD); if (sl > 0) xs.forEach(function(X) { out[X].ngay[ng] = (out[X].ngay[ng] || 0) + sl / out[X].luot; var b = out[X].buoc[m] || (out[X].buoc[m] = {}); b[ng] = (b[ng] || 0) + sl; });   // từng bước: để thấy xưởng nào đang cộng nhiều loại hàng
  });
  return out;
}
function layDongGoiNgay(token, soNgay) {
  var q = dhQuyenDon_(token); if (q.loi) return q.loi;   // 14/11: mục Đóng gói trong Đơn hàng -> mở cùng quyền
  soNgay = Math.max(7, Math.min(200, Number(soNgay) || 100));
  var den = congNgay_(homNayVN_(), -1), d0 = new Date(den + 'T12:00:00Z'); d0.setUTCDate(d0.getUTCDate() - soNgay + 1);
  var tu = Utilities.formatDate(d0, 'GMT', 'yyyy-MM-dd'), xu = dhSanLuongXuong_(tu, den);
  return sach_({ ok: true, ma: xu.DG.ma, ngay: xu.DG.ngay, xuong: xu, thuTu: DH_XUONG_TT, tu: tu, den: den });
}

/* ===== 07/11 (chủ dự án: "email báo cáo tự động – chỉ gửi cho tôi", 8h sáng T2–T7, học cách trình bày của ORDER·FLOW) =====
   Gửi tới email tài khoản chạy web (chủ sở hữu, không ghi cứng địa chỉ). Bỏ qua chủ nhật + ngày lễ (lịch công suất). Lịch tự cài khi chủ sở hữu mở tab. */
var DH_EMAIL_HAM = 'EMAIL_DON_HANG_8H';
function dhEmailTT_() { try { var p = PropertiesService.getScriptProperties(); return { bat: p.getProperty('DH_EMAIL_TAT') !== '1', lan: p.getProperty('DH_EMAIL_LAN') || '' }; } catch (e) { return { bat: true, lan: '' }; } }
function dhCaiEmail_() {
  var p = PropertiesService.getScriptProperties();
  if (p.getProperty('DH_EMAIL_TAT') === '1' || p.getProperty('DH_EMAIL_CAI') === '1') return;
  if (!ScriptApp.getProjectTriggers().some(function(t) { return t.getHandlerFunction() === DH_EMAIL_HAM; }))
    ScriptApp.newTrigger(DH_EMAIL_HAM).timeBased().atHour(8).everyDays(1).inTimezone(TZ_VN).create();
  p.setProperty('DH_EMAIL_CAI', '1');
}
function batTatEmailDonHang(token, bat) {
  var q = qtQuyen_(token); if (q.loi) return q.loi;
  var p = PropertiesService.getScriptProperties();
  if (bat) { p.deleteProperty('DH_EMAIL_TAT'); p.deleteProperty('DH_EMAIL_CAI'); try { dhCaiEmail_(); } catch (e) { return sach_({ ok: false, msg: 'Không cài được lịch gửi: ' + (e && e.message || e) }); } }
  else { p.setProperty('DH_EMAIL_TAT', '1'); try { ScriptApp.getProjectTriggers().forEach(function(t) { if (t.getHandlerFunction() === DH_EMAIL_HAM) ScriptApp.deleteTrigger(t); }); } catch (e) {} }
  ghiLog_(q.me, 'Email đơn hàng 8h', bat ? 'bật' : 'tắt', '', '');
  return sach_({ ok: true, msg: bat ? 'Đã bật email 8h sáng thứ 2 – thứ 7.' : 'Đã tắt email 8h.', email: dhEmailTT_() });
}
function guiThuEmailDonHang(token) {
  var q = qtQuyen_(token); if (q.loi) return q.loi;
  try { var to = dhGuiEmail_(true); return sach_({ ok: true, msg: 'Đã gửi thử tới ' + to + '.' }); }
  catch (e) { return sach_({ ok: false, msg: 'Không gửi được: ' + (e && e.message || e) }); }
}
function EMAIL_DON_HANG_8H(e) {
  if (!noiBo_(e)) return chanWeb_('EMAIL_DON_HANG_8H');
  try { dhGuiEmail_(false); } catch (x) { try { ghiLog_({ tk: 'HE_THONG', ten: 'Hệ thống' }, 'Email đơn hàng lỗi', String(x && x.message || x).slice(0, 200), '', ''); } catch (x2) {} }
}
function dhGuiEmail_(thu) {
  var hn = homNayVN_(), cs = dhCongSuat_(), nghi = {}; cs.nghi.forEach(function(x) { nghi[x[0]] = x[1]; });
  var lamBu = cs.lam.indexOf(hn) >= 0, cn = new Date(hn + 'T12:00:00Z').getUTCDay() === 0;
  if (!thu && !lamBu && (cn || nghi[hn])) return '';
  var p = PropertiesService.getScriptProperties(); if (!thu && p.getProperty('DH_EMAIL_LAN') === hn) return '';
  var to = Session.getEffectiveUser().getEmail(); if (!to) throw new Error('Không xác định được email chủ sở hữu.');
  var d = dhDocDon_(true), sua = {}; plNapThem_(); docAnToan_(PL_SHEET).forEach(function(r) { if (r.TenChuan) sua[String(r.TenChuan)] = r; });
  var pc = {}, don = {}, kenh = {}, tongSl = 0, tongThieu = 0, thieuSX = 0;
  d.don.forEach(function(o) {
    var tc = plChuan_(o.ten), l = (pc[tc] || (pc[tc] = plPhanLoai_(o.ten, o.ghiChu, sua['K:' + tc]))).loai;
    tongSl += o.sl; tongThieu += o.thieu; if (l !== 'PK' && l !== 'NOI') thieuSX += o.thieu;
    var k = o.maDon + '|' + o.tab, g = don[k] || (don[k] = { ma: o.maDon, kenh: o.kenh, nguoiDat: o.nguoiDat || '', sl: 0, thieu: 0, dl: '' });
    g.sl += o.sl; g.thieu += o.thieu; if (o.thieu > 0 && o.dl && (!g.dl || o.dl < g.dl)) g.dl = o.dl;
  });
  var ds = Object.keys(don).map(function(k) { return don[k]; }), soNgay = function(a, b) { return Math.round((new Date(b + 'T12:00:00Z') - new Date(a + 'T12:00:00Z')) / 864e5); };
  var tre = ds.filter(function(g) { return g.thieu > 0 && g.dl && g.dl < hn; }), sap = ds.filter(function(g) { return g.thieu > 0 && g.dl && g.dl >= hn && soNgay(hn, g.dl) <= 3; });
  ds.forEach(function(g) { var x = kenh[g.kenh] || (kenh[g.kenh] = { don: 0, dang: 0, tre: 0, thieu: 0 }); x.don++; if (g.thieu > 0) x.dang++; if (g.thieu > 0 && g.dl && g.dl < hn) x.tre++; x.thieu += g.thieu; });
  tre.forEach(function(g) { g.tre = soNgay(g.dl, hn); });
  var top = tre.slice().sort(function(a, b) { return b.thieu * b.tre - a.thieu * a.tre; }).slice(0, 8);
  var th = hn.slice(0, 7), dg = dhDongGoiNgay_(th + '-01' < dhCongNgay_(hn, -14) ? th + '-01' : dhCongNgay_(hn, -14), dhCongNgay_(hn, -1)).ngay, dgD = Object.keys(dg).sort();
  var homQua = dgD.length ? dgD[dgD.length - 1] : '', dgThang = 0; dgD.forEach(function(x) { if (x.slice(0, 7) === th) dgThang += dg[x]; });
  var d6 = dgD.slice(-6), tb6 = d6.length ? d6.reduce(function(s, x) { return s + dg[x]; }, 0) / d6.length : 0;
  var nl = 0; for (var x = th + '-01'; x < hn; x = dhCongNgay_(x, 1)) { var w = new Date(x + 'T12:00:00Z').getUTCDay(); if ((w !== 0 && !nghi[x]) || cs.lam.indexOf(x) >= 0) nl++; }
  /* 07/11 (chủ dự án): dòng HT có "SX còn thiếu" = cả số đặt là đơn hủy / dừng SX – không tính fill rate */
  var ht = { n: 0, sl: 0, thieu: 0, huy: 0 }; try { var H = dhHTTrucTiep_(false), seen = {}; (H.don || []).forEach(function(o) { if (o.thang !== th) return; if (o.sl > 0 && o.thieu >= o.sl) { ht.huy += o.sl; return; } ht.sl += o.sl; ht.thieu += o.thieu; if (!seen[o.maDon + '|' + o.kenh]) { seen[o.maDon + '|' + o.kenh] = 1; ht.n++; } }); } catch (eH) {}
  var so = function(n) { return Math.round(Number(n) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }, e = function(t) { return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var ng = function(x) { return x ? x.slice(8, 10) + '/' + x.slice(5, 7) : '–'; }, url = ''; try { url = ScriptApp.getService().getUrl(); } catch (eU) {}
  var thu7 = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][new Date(hn + 'T12:00:00Z').getUTCDay()];
  var o6 = [['Đóng gói ' + (homQua ? ng(homQua) : 'hôm qua'), so(homQua ? dg[homQua] : 0) + ' sp', 'TB 6 ngày ' + so(tb6) + ' · ' + Math.round(tb6 / cs.sp * 100) + '% công suất', '#0b7a73'],
    ['Đóng gói tháng ' + th.slice(5), so(dgThang) + ' sp', nl + ' ngày làm · TB ' + so(nl ? dgThang / nl : 0) + '/ngày', '#0b7a73'],
    ['Còn phải sản xuất', so(thieuSX) + ' sp', '≈ ' + Math.ceil(thieuSX / cs.sp) + ' ngày làm ở ' + so(cs.sp) + ' sp/ngày', '#b87500'],
    ['Đơn trễ hạn', so(tre.length) + ' đơn', so(tre.reduce(function(s, g) { return s + g.thieu; }, 0)) + ' sp còn thiếu', '#c0302b'],
    ['Sắp tới hạn (≤ 3 ngày)', so(sap.length) + ' đơn', so(sap.reduce(function(s, g) { return s + g.thieu; }, 0)) + ' sp còn thiếu', '#b87500'],
    ['Đã hoàn thiện (tab HT) tháng ' + th.slice(5), so(ht.n) + ' đơn', so(ht.sl - ht.thieu) + ' cây giao · fill rate ' + (ht.sl ? Math.floor((ht.sl - ht.thieu) / ht.sl * 1000) / 10 + '%' : '–') + (ht.huy ? ' · hủy / dừng SX ' + so(ht.huy) + ' cây' : ''), '#17643a']];
  var h = '<div style="max-width:640px;margin:0 auto;font-family:Segoe UI,Roboto,Arial,sans-serif;color:#1d2327;border:1px solid #d6dedd;border-radius:12px;overflow:hidden">' +
    '<div style="background:#0b4f4a;color:#fff;padding:16px 20px"><div style="font-size:11px;letter-spacing:2px;opacity:.85">CARBON BILLIARDS · BÁO CÁO SẢN XUẤT</div><div style="font-size:19px;font-weight:600;margin-top:4px">' + thu7 + ', ' + ng(hn) + '/' + hn.slice(0, 4) + '</div>' +
    '<div style="font-size:13px;opacity:.9;margin-top:4px">' + so(ds.length) + ' đơn đang theo dõi · <b>' + so(tre.length) + ' trễ hạn</b> · ' + so(tongThieu) + ' sp còn thiếu</div></div><div style="padding:16px 20px">';
  h += '<table style="width:100%;border-collapse:separate;border-spacing:8px"><tr>' + o6.map(function(x, i) { return (i === 3 ? '</tr><tr>' : '') + '<td style="width:33%;border:1px solid #d6dedd;border-left:4px solid ' + x[3] + ';border-radius:8px;padding:8px 10px;vertical-align:top"><div style="font-size:10px;color:#5b6670;text-transform:uppercase">' + e(x[0]) + '</div><div style="font-size:20px;font-weight:700;color:' + x[3] + '">' + e(x[1]) + '</div><div style="font-size:11px;color:#3d474f">' + e(x[2]) + '</div></td>'; }).join('') + '</tr></table>';
  h += '<div style="font-size:12px;font-weight:600;color:#0b4f4a;border-left:3px solid #0b7a73;padding-left:8px;margin:14px 0 6px">THEO KÊNH</div><table style="width:100%;border-collapse:collapse;font-size:12.5px"><tr style="color:#5b6670;font-size:11px;text-align:right"><td style="text-align:left;padding:4px">Kênh</td><td>Đơn</td><td>Đang làm</td><td>Trễ</td><td style="padding-right:4px">Còn thiếu</td></tr>' +
    DH_TABS.map(function(t) { var k = DH_NHAN_TAB[t] || t, x = kenh[k] || { don: 0, dang: 0, tre: 0, thieu: 0 }; return '<tr style="border-top:1px solid #e1e7e6;text-align:right"><td style="text-align:left;padding:5px 4px">' + e(k) + '</td><td>' + x.don + '</td><td>' + x.dang + '</td><td style="color:' + (x.tre ? '#b42a25' : '#889') + '">' + x.tre + '</td><td style="padding-right:4px">' + so(x.thieu) + '</td></tr>'; }).join('') + '</table>';
  h += '<div style="font-size:12px;font-weight:600;color:#b42a25;border-left:3px solid #c0302b;padding-left:8px;margin:14px 0 6px">8 ĐƠN TRỌNG ĐIỂM (trễ × còn thiếu lớn nhất)</div>' + (top.length ? '<table style="width:100%;border-collapse:collapse;font-size:12.5px"><tr style="color:#5b6670;font-size:11px"><td style="padding:4px">Mã đơn</td><td>Kênh · người đặt</td><td style="text-align:right">Deadline</td><td style="text-align:right">Trễ</td><td style="text-align:right;padding-right:4px">Thiếu</td></tr>' +
    top.map(function(g) { return '<tr style="border-top:1px solid #e1e7e6"><td style="padding:5px 4px;font-weight:600">' + e(g.ma) + '</td><td>' + e(g.kenh) + (g.nguoiDat ? ' · ' + e(g.nguoiDat) : '') + '</td><td style="text-align:right">' + ng(g.dl) + '</td><td style="text-align:right;color:#b42a25">' + g.tre + ' ngày</td><td style="text-align:right;padding-right:4px;font-weight:600">' + so(g.thieu) + '</td></tr>'; }).join('') + '</table>' : '<div style="font-size:12.5px;color:#5b6670">Không có đơn trễ.</div>');
  if (typeof dpEmail_ === 'function') h += dpEmail_(e, so);   // 08/11: điều phối (nút cổ chai, dòng chảy, sức khỏe dữ liệu)
  h += '</div><div style="background:#f1f5f4;padding:10px 20px;font-size:11px;color:#5b6670;text-align:center">Gửi tự động 8h sáng thứ 2 – thứ 7 (trừ ngày lễ) · Sheet đọc lúc ' + e(d.luc) + ' · Đóng gói theo nhật ký KPI' + (url ? ' · <a href="' + e(url) + '" style="color:#0b7a73">Mở web KPI</a>' : '') + '<br>Tắt / bật ở web: Đơn hàng → Sản xuất → Công suất &amp; deadline → ⚙</div></div>';
  MailApp.sendEmail({ to: to, subject: (thu ? '[Thử] ' : '') + 'Báo cáo sản xuất ' + ng(hn) + ' · ' + tre.length + ' đơn trễ · Đóng gói ' + (homQua ? so(dg[homQua]) : 0) + ' sp', htmlBody: h, name: 'Hệ thống KPI sản xuất' });
  if (!thu) p.setProperty('DH_EMAIL_LAN', hn);
  return to;
}


/* ===== 07/11 (chủ dự án): tab chính "Thống kê" – chỉ chủ sở hữu. Tổng hợp Nhân sự, Điểm danh, Báo cơm, Công đoạn, KPI theo tháng.
   Dùng lại đúng công thức đang chạy: giờ có mặt = gioCoMat_ (ký hiệu chấm công), báo cơm = comTinhThang_ / SuatAnThang,
   KPI = bảng KPIThang đã chốt, định mức = phanTichDinhMuc (máy khách gọi riêng). Xưởng xếp theo dòng chảy DH_XUONG_TT. */
var TK_BO_VANG = { NL: 1, TS: 1 };   // không tính vào tỷ lệ vắng: nghỉ lễ, thai sản (nghỉ dài, đã biết trước)
function tkNgayLam_(thang) {   // ngày làm của tháng tới hôm nay: thứ 2 – thứ 7, trừ ngày lễ toàn công ty
  var le = {}; docAnToan_('NgayLe').forEach(function(r) { if (!String(r.MaXuong || '').trim()) le[ngayVN_(r.Ngay)] = 1; });
  LE_CO_DINH_.forEach(function(x) { le[thang.slice(0, 4) + '-' + x[0]] = 1; });   // 08/11: 24/11
  var hn = homNayVN_(), ds = [], d = new Date(thang + '-01T12:00:00Z');
  while (Utilities.formatDate(d, 'GMT', 'yyyy-MM') === thang) {
    var x = Utilities.formatDate(d, 'GMT', 'yyyy-MM-dd'); if (x >= hn) break;   // 09/11: tới hết hôm qua
    if (d.getUTCDay() !== 0 && !le[x]) ds.push(x);
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return ds;
}
function tkThangTruoc_(thang, n) { var a = [thang]; for (var i = 1; i < n; i++) a.unshift(kyTruoc_(a[0])); return a; }
function layThongKe(token, thang, lamMoi) {
  var q = qtQuyen_(token); if (q.loi) return q.loi;
  thang = /^\d{4}-\d{2}$/.test(String(thang || '')) ? String(thang) : kyVN_();
  var hnT = homNayVN_(), khoa = 'TK_v2_' + thang + '_' + hnT;   // 09/11: bỏ hôm nay -> số đổi theo ngày
  if (!lamMoi) { var c = dhCacheLay_(khoa); if (c) return sach_(c); }
  var kq = { ok: true, thang: thang, homNay: homNayVN_(), chuaChot: thang >= kyVN_(), luc: Utilities.formatDate(new Date(), TZ_VN, 'HH:mm dd/MM') };
  var tenX = {}; docAnToan_('PhongBan').forEach(function(p) { tenX[p.MaXuong] = p.TenXuong; });
  var thuTu = DH_XUONG_TT.filter(function(m) { return tenX[m]; }); Object.keys(tenX).forEach(function(m) { if (thuTu.indexOf(m) < 0) thuTu.push(m); });
  kq.xuong = thuTu.map(function(m) { return [m, tenX[m] || m]; });
  var loi = [];
  var thu = function(ten, f) { try { kq[ten] = f(); } catch (e) { loi.push(ten + ': ' + (e && e.message || e)); kq[ten] = null; } };
  var nsAll = docAnToan_('NhanSu'), ngayLam = tkNgayLam_(thang), cuoi = ngayLam.length ? ngayLam[ngayLam.length - 1] : thang + '-01';
  kq.ngayLam = ngayLam;
  var nsX = {}, tenNV = {}, dangLam = {};
  nsAll.forEach(function(x) { var nv = String(x.MaNV || '').trim(); if (!nv) return; nsX[nv] = x.MaXuong; tenNV[nv] = x.HoTen; if (String(x.TrangThai).trim() === 'Đang làm') dangLam[nv] = 1; });

  /* 1) NHÂN SỰ – ảnh chụp hiện tại (Sheet không có ngày nghỉ việc, nên không dựng lại quá khứ) */
  thu('ns', function() {
    var hn = homNayVN_(), nam = Number(hn.slice(0, 4)), X = {}, moi = {}, thieu = { ngayVao: 0, namSinh: 0, hopDong: 0, cccd: 0, dt: 0 };
    var tn = [['< 3 tháng', 0, 3], ['3–12 tháng', 3, 12], ['1–3 năm', 12, 36], ['> 3 năm', 36, 1e9]], tuoi = [['< 25', 0, 25], ['25–34', 25, 35], ['35–44', 35, 45], ['45–54', 45, 55], ['≥ 55', 55, 200]];
    var thangCach = function(a) { var p = a.split('-'), h = hn.split('-'); return (Number(h[0]) - Number(p[0])) * 12 + Number(h[1]) - Number(p[1]) - (Number(h[2]) < Number(p[2]) ? 1 : 0); };
    for (var i = 11, t = kyVN_(); i >= 0; i--) { moi[t] = 0; t = kyTruoc_(t); }
    nsAll.forEach(function(x) {
      var mx = x.MaXuong || '?', st = String(x.TrangThai || '').trim(), o = X[mx] || (X[mx] = { dang: 0, tam: 0, nghi: 0, cd: {}, tn: [0, 0, 0, 0], tuoi: [0, 0, 0, 0, 0], hd: {} });
      if (st === 'Nghỉ việc') { o.nghi++; return; }
      if (st === 'Tạm nghỉ') { o.tam++; return; }
      o.dang++; var cd = String(x.ChucDanh || '').trim() || 'Chưa ghi'; o.cd[cd] = (o.cd[cd] || 0) + 1;
      var hd = String(x.LoaiHopDong || '').trim() || 'Chưa ghi'; o.hd[hd] = (o.hd[hd] || 0) + 1;
      var nv = x.NgayVaoLam ? ngayVN_(x.NgayVaoLam) : '';
      if (nv && /^\d{4}-\d{2}-\d{2}$/.test(nv)) { var m = thangCach(nv); for (var k = 0; k < tn.length; k++) if (m >= tn[k][1] && m < tn[k][2]) { o.tn[k]++; break; } if (nv.slice(0, 7) in moi) moi[nv.slice(0, 7)]++; } else thieu.ngayVao++;
      var ns = Number(x.NamSinh) || 0; if (ns > 1900) { var a = nam - ns; for (var j = 0; j < tuoi.length; j++) if (a >= tuoi[j][1] && a < tuoi[j][2]) { o.tuoi[j]++; break; } } else thieu.namSinh++;
      if (!hd || /chờ|chua|chưa/i.test(hd)) thieu.hopDong++;
      if (!String(x.SoCCCD || '').trim()) thieu.cccd++;
      if (!String(x.DienThoai || '').trim()) thieu.dt++;
    });
    var vp = {}; docAnToan_('NhanSuNgoaiSX').forEach(function(x) { if (String(x.TrangThai || '').trim() === 'Nghỉ việc' || dangLam[String(x.MaNV || '').trim()]) return;   /* 08/11: người đang ở 9 xưởng không đếm lại */ var b = String(x.BoPhan || '').trim() || 'Khác'; vp[b] = (vp[b] || 0) + 1; });
    return { x: X, tnNhan: tn.map(function(a) { return a[0]; }), tuoiNhan: tuoi.map(function(a) { return a[0]; }), moi: moi, thieu: thieu, vanPhong: vp };
  });

  /* 2) ĐIỂM DANH – Sheet chỉ ghi ngày NGHỈ; ô trống = đi làm CHỈ khi xưởng đã xác nhận ngày đó */
  thu('dd', function() {
    var xn = {}, xnDung = {}, ngSet = {}; ngayLam.forEach(function(d) { ngSet[d] = 1; });
    docAnToan_('XacNhanDiemDanh').forEach(function(r) { var d = ngayVN_(r.Ngay); if (!ngSet[d]) return; var k = r.MaXuong + '|' + d; xn[k] = 1; if (r.ThoiDiem && ngayVN_(r.ThoiDiem) === d) xnDung[k] = 1; });
    var X = {}, theoNgay = {}, theoNguoi = {}, kh = {}, thu7 = [0, 0, 0, 0, 0, 0, 0], muon = {};
    var nguoiX = {}; Object.keys(dangLam).forEach(function(nv) { var mx = nsX[nv]; nguoiX[mx] = (nguoiX[mx] || 0) + 1; });
    thuTu.forEach(function(mx) { X[mx] = { nguoi: nguoiX[mx] || 0, cong: 0, vang: 0, nkl: 0, p: 0, nua: 0, muon: 0, khac: 0, ngayXN: 0, ngayXNDung: 0 }; });
    Object.keys(nguoiX).forEach(function(mx) { if (!X[mx]) X[mx] = { nguoi: nguoiX[mx], cong: 0, vang: 0, nkl: 0, p: 0, nua: 0, muon: 0, khac: 0, ngayXN: 0, ngayXNDung: 0 }; });
    Object.keys(X).forEach(function(mx) { ngayLam.forEach(function(d) { if (xn[mx + '|' + d]) { X[mx].ngayXN++; if (xnDung[mx + '|' + d]) X[mx].ngayXNDung++; } }); X[mx].cong = X[mx].nguoi * ngayLam.length; });
    docAnToan_('DiemDanhNghi').forEach(function(r) {
      var d = ngayVN_(r.Ngay); if (!ngSet[d]) return;
      var k = khTuBanGhi_(r), nv = String(r.MaNV || '').trim(), mx = r.MaXuong || nsX[nv] || '?';
      kh[k] = (kh[k] || 0) + 1;
      var o = X[mx] || (X[mx] = { nguoi: 0, cong: 0, vang: 0, nkl: 0, p: 0, nua: 0, muon: 0, khac: 0, ngayXN: 0, ngayXNDung: 0 });
      /* 08/11 (chủ dự án): người đi làm / ngày – nghỉ cả ngày (kể cả thai sản) = 1 người vắng, nửa ngày = 0,5, đi muộn vẫn tính đi làm;
         ngày xưởng nghỉ lễ riêng (NL) không tính là ngày làm của xưởng đó */
      if (k === 'NL') { (o.ngNL = o.ngNL || {})[d] = 1; return; }
      var vn = k === '0.5x' ? 0.5 : (gioCoMat_(k) === 0 ? 1 : 0);
      if (vn) { o.vangNg = (o.vangNg || 0) + vn; (o.vangNgD = o.vangNgD || {})[d] = (o.vangNgD[d] || 0) + vn; }
      if (TK_BO_VANG[k]) return;
      var v = (8 - gioCoMat_(k)) / 8; if (!(v > 0)) return;
      o.vang += v;
      if (k === 'Nkl' || k === 'Nkp') o.nkl += v; else if (k === 'P') o.p += v; else if (k === '0.5x') o.nua += v; else if (k.indexOf('x-') === 0) { o.muon++; muon[nv] = (muon[nv] || 0) + 1; } else o.khac += v;
      (theoNgay[d] = theoNgay[d] || {})[mx] = ((theoNgay[d] || {})[mx] || 0) + v;
      var p = theoNguoi[nv] || (theoNguoi[nv] = { nv: nv, ten: tenNV[nv] || r.HoTen || nv, mx: mx, vang: 0, nkl: 0, lan: 0 });
      p.vang += v; p.lan++; if (k === 'Nkl' || k === 'Nkp') p.nkl += v;
      thu7[new Date(d + 'T12:00:00Z').getUTCDay()] += v;
    });
    Object.keys(X).forEach(function(mx) { var o = X[mx], nl = o.ngNL || {}, n = 0, cong = 0;
      ngayLam.forEach(function(d) { if (nl[d]) return; n++; cong += Math.max(0, o.nguoi - ((o.vangNgD || {})[d] || 0)); });
      o.ngayLamX = n; o.tbDiLam = n ? Math.round(cong / n * 10) / 10 : null; delete o.ngNL; delete o.vangNgD; });
    var top = Object.keys(theoNguoi).map(function(k) { return theoNguoi[k]; }).sort(function(a, b) { return b.vang - a.vang; }).slice(0, 15);
    var muonDs = Object.keys(muon).filter(function(nv) { return muon[nv] >= 3; }).map(function(nv) { return { nv: nv, ten: tenNV[nv] || nv, mx: nsX[nv] || '', lan: muon[nv] }; }).sort(function(a, b) { return b.lan - a.lan; });
    return { x: X, ngay: theoNgay, top: top, kyHieu: kh, thu: thu7, muon3: muonDs };
  });

  /* 3) BÁO CƠM – tháng đang chạy tính từ đăng ký từng ngày (comTinhThang_); tháng đã tổng kết đọc SuatAnThang */
  thu('com', function() {
    var luu = docAnToan_('SuatAnThang').filter(function(r) { return String(r.Ky).replace(/^'/, '') === thang; });
    var o = { daTongKet: !!luu.length, x: [], ngay: {}, chua: [] };
    if (luu.length) { o.x = luu.map(function(r) { return { mx: r.MaXuong, ten: r.TenXuong, soNgay: Number(r.SoNgay) || 0, an: Number(r.SuatAn) || 0, khong: Number(r.KhongAn) || 0, chua: Number(r.ChuaDangKy) || 0 }; }); return o; }
    var t = comTinhThang_(thang), nguoi = {};
    o.x = t.ds; o.dsNgay = t.ngay;
    t.chiTiet.forEach(function(r) {   // [ngày, tên xưởng, họ tên, mã NV, 'Ăn…' | 'Không ăn' | 'Chưa đăng ký' | nhóm]
      var d = r[0], n = o.ngay[d] || (o.ngay[d] = { an: 0, khong: 0, chua: 0 }), s = String(r[4]);
      if (/^Ăn/.test(s)) n.an++; else if (s === 'Không ăn') n.khong++; else if (s === 'Chưa đăng ký') {
        n.chua++; var k = (r[3] || r[2]) + '|' + r[1], p = nguoi[k] || (nguoi[k] = { ten: r[2], ma: r[3], xuong: r[1], lan: 0, ngay: [] }); p.lan++; p.ngay.push(d);
      }
    });
    o.chua = Object.keys(nguoi).map(function(k) { return nguoi[k]; }).sort(function(a, b) { return b.lan - a.lan; }).slice(0, 30);
    o.soNguoiChua = Object.keys(nguoi).length;
    return o;
  });

  /* 4) CÔNG ĐOẠN – nhật ký sản xuất tháng (đã chốt / chờ duyệt / từ chối), giờ dừng, lý do dừng, hiệu suất.
     Hiệu suất như KPI: Σ(SL đạt / định mức giờ) ÷ giờ CÓ MẶT theo chấm công (không dùng cột GioLam – mỗi xưởng nhập một kiểu).
     Một người làm nhiều công đoạn trong ngày: giờ có mặt chia cho từng công đoạn theo tỷ lệ giờ chuẩn. */
  thu('cd', function() {
    var cdMa = {}; docAnToan_('CongDoan').forEach(function(c) { cdMa[c.MaCD] = c; });
    var dm = {}; docAnToan_('DinhMuc').forEach(function(x) { var v = soVN_(x.DinhMucGio); if (v > 0) dm[x.MaCD] = v; });
    var nhom = {}; docAnToan_('LyDoDung').forEach(function(r) { nhom[String(r.LyDo || '').trim()] = r.PhanLoai || ''; });
    var cc = {}; docAnToan_('DiemDanhNghi').forEach(function(r) { var d = ngayVN_(r.Ngay); if (d.slice(0, 7) === thang && d < hnT) cc[r.MaNV + '|' + d] = khTuBanGhi_(r); });
    var loiK = {}; docAnToan_('PhieuKCS').forEach(function(k) { var d = ngayVN_(k.Ngay); if (d.slice(0, 7) === thang && d < hnT) { var kk = k.MaNV + '|' + d + '|' + k.MaCD; loiK[kk] = (loiK[kk] || 0) + (Number(k.SoLuongKhongDat) || 0); } });
    var C = {}, X = {}, ly = {}, trang = {}, nd = {};
    docNKTu_(kyTruoc_(thang) + '-01').forEach(function(r) {
      var d = ngayVN_(r.Ngay); if (d.slice(0, 7) !== thang || d >= hnT) return;
      var st = String(r.TrangThai || '').trim() || 'Khác', c = cdMa[r.MaCD] || {}, mx = c.MaXuong || nsX[r.MaNV] || '?';
      var tx = trang[mx] || (trang[mx] = {}); tx[st] = (tx[st] || 0) + 1;
      if (st !== 'Đã chốt') return;
      var sl = Number(r.SoLuongLamRa) || 0, gd = Number(r.GioDung) || 0, dat = Math.max(0, sl - (loiK[r.MaNV + '|' + d + '|' + r.MaCD] || 0));
      var o = C[r.MaCD] || (C[r.MaCD] = { ma: r.MaCD, ten: c.TenCD || r.MaCD, mx: mx, sl: 0, loi: 0, dung: 0, nguoi: {}, dm: dm[r.MaCD] || 0, chuan: 0, gio: 0 });
      o.sl += sl; o.loi += sl - dat; o.dung += gd; o.nguoi[r.MaNV] = 1;
      var x = X[mx] || (X[mx] = { sl: 0, dung: 0, chuan: 0, gio: 0, nguoi: {}, cdKhongDM: 0 }); x.sl += sl; x.dung += gd; x.nguoi[r.MaNV] = 1;
      if (dm[r.MaCD] > 0) { var k = r.MaNV + '|' + d, e = nd[k] || (nd[k] = { nv: r.MaNV, d: d, cd: {} }); e.cd[r.MaCD] = (e.cd[r.MaCD] || 0) + dat / dm[r.MaCD]; }
      else x.cdKhongDM++;
      if (gd > 0) { var l = String(r.LyDoDung || '').trim() || 'Không ghi lý do', y = ly[l] || (ly[l] = { ly: l, nhom: nhom[l] || '', gio: 0, lan: 0 }); y.gio += gd; y.lan++; }
    });
    var ngX = {};
    Object.keys(nd).forEach(function(k) {
      var e = nd[k], gio = gioCoMat_(cc[k] || 'x'), tong = 0, m; if (!(gio > 0)) return;
      for (m in e.cd) tong += e.cd[m]; if (!(tong > 0)) return;
      for (m in e.cd) {
        var g = gio * e.cd[m] / tong, o = C[m], mx = o.mx, x = X[mx];
        o.chuan += e.cd[m]; o.gio += g; x.chuan += e.cd[m]; x.gio += g;
        var n = (ngX[mx] = ngX[mx] || {}), z = n[e.d] || (n[e.d] = [0, 0]); z[0] += e.cd[m]; z[1] += g;
      }
    });
    var r1 = function(v) { return Math.round(v * 10) / 10; };
    var ds = Object.keys(C).map(function(k) { var o = C[k]; o.nguoi = Object.keys(o.nguoi).length; o.hs = o.gio > 0 ? r1(o.chuan / o.gio * 100) : null; o.gio = r1(o.gio); o.chuan = r1(o.chuan); return o; });
    Object.keys(X).forEach(function(mx) { var x = X[mx]; x.nguoi = Object.keys(x.nguoi).length; x.hs = x.gio > 0 ? r1(x.chuan / x.gio * 100) : null; x.gio = r1(x.gio); x.chuan = r1(x.chuan); });
    var hsNgay = {}; Object.keys(ngX).forEach(function(mx) { hsNgay[mx] = {}; Object.keys(ngX[mx]).forEach(function(d) { var z = ngX[mx][d]; if (z[1] > 0) hsNgay[mx][d] = r1(z[0] / z[1] * 100); }); });
    var nhapTre = {}; docAnToan_('PhatNhapTre').forEach(function(r) { if (ngayVN_(r.Ngay).slice(0, 7) !== thang || ngayVN_(r.Ngay) >= hnT) return; var mx = r.MaXuong || nsX[r.MaNV] || '?'; nhapTre[mx] = (nhapTre[mx] || 0) + 1; });
    return { ds: ds, x: X, lyDo: Object.keys(ly).map(function(k) { return ly[k]; }).sort(function(a, b) { return b.gio - a.gio; }), trangThai: trang, hsNgay: hsNgay, nhapTre: nhapTre };
  });

  /* 5) KPI – bảng KPIThang đã chốt, 4 tháng gần nhất (tháng đang chạy chưa chốt thì lấy tháng chốt gần nhất) */
  thu('kpi', function() {
    var all = docAnToan_('KPIThang'), kys = {}; all.forEach(function(r) { kys[String(r.Ky).replace(/^'/, '')] = 1; });
    var dsKy = Object.keys(kys).sort(), kyNay = kyVN_(), tam = thang >= kyNay;   // tháng đang chạy: bảng KPI chỉ là tạm tính giữa tháng (sản lượng chưa nhập đủ) -> so sánh bằng tháng đã chốt gần nhất
    var ky = dsKy.filter(function(k) { return k <= thang && k < kyNay; }).pop() || (dsKy.indexOf(thang) >= 0 ? thang : '');
    var giu = dsKy.filter(function(k) { return k <= ky; }).slice(-4), bac = { 'S': 6, 'A+': 5, 'A': 4, 'B': 3, 'C': 2, 'D': 1 };
    var theoKy = {}, nguoi = {};
    all.forEach(function(r) {
      var k = String(r.Ky).replace(/^'/, ''); if (giu.indexOf(k) < 0) return;
      var mx = r.MaXuong || '?', o = (theoKy[k] = theoKy[k] || {}), x = o[mx] || (o[mx] = { n: 0, tong: 0, hs: 0, cl: 0, tt: 0, at: 0, loai: {} });
      var loai = String(r.Loai || '').trim() || '?';
      x.n++; x.tong += Number(r.TongKPI) || 0; x.hs += Number(r.HieuSuatSL) || 0; x.cl += Number(r.ChatLuong) || 0; x.tt += Number(r.TuanThu) || 0; x.at += Number(r.AnToan) || 0; x.loai[loai] = (x.loai[loai] || 0) + 1;
      (nguoi[r.MaNV] = nguoi[r.MaNV] || { nv: r.MaNV, ten: r.HoTen, mx: mx, ky: {} }).ky[k] = { loai: loai, tong: Math.round((Number(r.TongKPI) || 0) * 10) / 10 };
    });
    var kt = giu.length > 1 ? giu[giu.length - 2] : '', tut = [], len = [], d2 = [];
    Object.keys(nguoi).forEach(function(nv) {
      var p = nguoi[nv], a = p.ky[ky], b = kt ? p.ky[kt] : null; if (!a) return;
      if (b && bac[a.loai] && bac[b.loai]) { var dlt = bac[a.loai] - bac[b.loai]; if (dlt <= -2) tut.push({ ten: p.ten, mx: p.mx, tu: b.loai, den: a.loai, tong: a.tong }); if (dlt >= 2) len.push({ ten: p.ten, mx: p.mx, tu: b.loai, den: a.loai, tong: a.tong }); }
      if (a.loai === 'D' && b && b.loai === 'D') d2.push({ ten: p.ten, mx: p.mx, tong: a.tong });
    });
    var tenVP = {}; docAnToan_('DanhMucViPham').forEach(function(v) { tenVP[v.MaVP] = v.TenViPham; });
    var vp = {}, vpX = {};
    docAnToan_('ViPham').forEach(function(v) { if (ngayVN_(v.Ngay).slice(0, 7) !== thang || ngayVN_(v.Ngay) >= hnT) return; var m = v.MaVP || '?', mx = nsX[v.MaNV] || '?'; vp[m] = (vp[m] || 0) + 1; (vpX[mx] = vpX[mx] || {})[m] = ((vpX[mx] || {})[m] || 0) + 1; });
    return { ky: ky, tamTinh: tam && ky !== thang, kyTruoc: kt, dsKy: giu, theoKy: theoKy, tut: tut, len: len, d2: d2, viPham: Object.keys(vp).map(function(m) { return { ma: m, ten: tenVP[m] || m, n: vp[m] }; }).sort(function(a, b) { return b.n - a.n; }), viPhamX: vpX };
  });
  if (loi.length) kq.loi = loi;
  dhCacheGhi_(khoa, kq, kq.chuaChot ? 600 : 3600);
  return sach_(kq);
}

/* ===== TĂNG TỐC ĐỢT 3 (08/11/2026 – chủ dự án chọn phương án A) =====
   Đo trên dữ liệu thật 07/11: lượt gọi nào cũng đọc cả sheet NhatKySanXuat (19.252 dòng × 16 cột ≈ 308.000 ô, tăng ~7.000 dòng/tháng).
   1) Bộ nhớ đệm nhật ký DÙNG CHUNG giữa các lượt gọi (CacheService, nén gzip, 10 phút). Có ai ghi nhật ký (xoaCache_) là bỏ ngay.
      Lượt đang giữ khóa ghi (khoa_) luôn đọc thẳng sheet – số dòng (_row) để sửa ô phải đúng tuyệt đối.
      Sửa tay trong Google Sheet: chạy XOA_BO_NHO_TAM (như trước) hoặc đợi tối đa 10 phút.
   2) Bộ đo tốc độ: máy chủ gắn __ms (thời gian chạy) vào kết quả; trình duyệt đo cả đường truyền, gửi gộp về ghiTocDo;
      chủ sở hữu xem ở Thống kê › Tốc độ web (layTocDo). Lưu theo ngày trong ScriptProperties, giữ 14 ngày.
   3) Khóa mã hóa bản lưu số liệu trên máy (người dùng tự bật "ghi nhớ trên máy cá nhân"): layKhoaLuu, đổi khóa khi Thoát / đổi mật khẩu. */
var NKD_TEN = 'NhatKySanXuat', NKD_K = 'NKD3', NKD_GIAY = 900, NKD_MANH = 90000;   // 08/11 đợt 4: 10 -> 15 phút, lịch giữ nóng làm mới trước khi hết
var __NKD_TT = { trung: 0, truot: 0 };
function nkdMoi_() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function nkdPB_() {
  try { var c = CacheService.getScriptCache(), v = c.get(NKD_K + '_pb'); if (!v) { v = nkdMoi_(); c.put(NKD_K + '_pb', v, 21600); } return v; } catch (e) { return ''; }
}
function nkdBo_() { try { CacheService.getScriptCache().put(NKD_K + '_pb', nkdMoi_(), 21600); } catch (e) {} }
function nkdDung_() { return !__KHOA; }   // đang giữ khóa ghi -> không dùng bản nhớ
function nkdLay_(pb) {
  if (!pb) return null;
  try {
    var c = CacheService.getScriptCache(), m = c.get(NKD_K + '_m');
    if (!m) return null; m = JSON.parse(m); if (m.pb !== pb || !(m.n > 0)) return null;
    var ks = []; for (var i = 0; i < m.n; i++) ks.push(NKD_K + '_' + pb + '_' + i);
    var a = c.getAll(ks), s = ''; for (var j = 0; j < m.n; j++) { if (a[ks[j]] == null) return null; s += a[ks[j]]; }
    var v = JSON.parse(Utilities.ungzip(Utilities.newBlob(Utilities.base64Decode(s), 'application/x-gzip')).getDataAsString());
    for (var r = 1; r < v.length; r++) { var d = v[r]; for (var k = 0; k < d.length; k++) { var x = d[k]; if (typeof x === 'string' && x.charAt(0) === '\u0007') d[k] = new Date(Number(x.slice(1))); } }
    return v;
  } catch (e) { return null; }
}
function nkdGhi_(pb, v) {
  if (!pb || !v || v.length < 2) return;
  try {
    var w = v.map(function(r, i) { return i === 0 ? r : r.map(function(x) { return Object.prototype.toString.call(x) === '[object Date]' ? '\u0007' + x.getTime() : x; }); });
    var z = Utilities.base64Encode(Utilities.gzip(Utilities.newBlob(JSON.stringify(w), 'application/json')).getBytes());
    if (z.length > NKD_MANH * 60) return;   // > ~5 MB nén: không nhớ (nên chạy lưu trữ nhật ký cũ)
    var p = {}, n = 0; for (var x = 0; x < z.length; x += NKD_MANH) p[NKD_K + '_' + pb + '_' + (n++)] = z.slice(x, x + NKD_MANH);
    var c = CacheService.getScriptCache(); c.putAll(p, NKD_GIAY); c.put(NKD_K + '_m', JSON.stringify({ pb: pb, n: n }), NKD_GIAY); c.put(NKD_K + '_t', String(Date.now()), NKD_GIAY);
  } catch (e) {}
}

/* ---------- 2) BỘ ĐO TỐC ĐỘ ---------- */
var TD_MOC = [500, 1000, 2000, 3000, 5000, 8000, 15000];   // ms – 8 ngăn: <0,5 s … ≥ 15 s
var TD_GIU = 14;
function tdNgan_(ms) { for (var i = 0; i < TD_MOC.length; i++) if (ms < TD_MOC[i]) return i; return TD_MOC.length; }
function tdCong_(o, ms, sv) {   // o = [lượt, tổng ms, chậm nhất, tổng ms máy chủ, lượt có số máy chủ, ngăn 0..7]
  if (!o) { o = [0, 0, 0, 0, 0]; for (var i = 0; i <= TD_MOC.length; i++) o.push(0); }
  o[0]++; o[1] += ms; if (ms > o[2]) o[2] = ms; if (sv >= 0) { o[3] += sv; o[4]++; } o[5 + tdNgan_(ms)]++;
  return o;
}
function ghiTocDo(token, ds) {
  var me = docPhien_(token); if (!me) return { ok: false };
  if (Object.prototype.toString.call(ds) !== '[object Array]') return { ok: false };
  var vt = String(me.laOwner ? 'OWNER' : (me.vaiTro || '?')).replace(/[^A-Z]/g, '').slice(0, 6) || '?';
  var ngay = homNayVN_(), p = PropertiesService.getScriptProperties(), k = 'TD_' + ngay.replace(/-/g, ''), o = {};
  try { o = JSON.parse(p.getProperty(k) || '{}'); } catch (e) { o = {}; }
  o.f = o.f || {}; o.v = o.v || {};
  ds.slice(0, 60).forEach(function(x) {
    if (!x || typeof x !== 'object') return;
    var fn = String(x.f || ''), ms = Math.round(Number(x.ms)), sv = x.sv == null ? -1 : Math.round(Number(x.sv));
    if (!/^[A-Za-z_][A-Za-z0-9_]{0,39}$/.test(fn) || !(ms >= 0 && ms < 600000)) return;
    if (!(sv >= 0 && sv < 600000)) sv = -1;
    if (!o.f[fn] && Object.keys(o.f).length >= 80) return;   // chặn phình
    o.f[fn] = tdCong_(o.f[fn], ms, sv);
    if (/^(trang|vaoApp|napDuLieu)$/.test(fn)) { var kv = fn + '|' + vt; o.v[kv] = tdCong_(o.v[kv], ms, sv); }
  });
  try { p.setProperty(k, JSON.stringify(o)); } catch (e) {}
  try { var cu = new Date(ngay + 'T12:00:00Z'); cu.setUTCDate(cu.getUTCDate() - TD_GIU - 1); p.deleteProperty('TD_' + Utilities.formatDate(cu, 'GMT', 'yyyyMMdd')); } catch (e) {}
  return { ok: true };
}
function layTocDo(token, soNgay) {
  var q = qtQuyen_(token); if (q.loi) return q.loi;
  soNgay = Math.max(1, Math.min(TD_GIU, Number(soNgay) || 7));
  var p = PropertiesService.getScriptProperties(), d = new Date(homNayVN_() + 'T12:00:00Z'), ngay = [];
  for (var i = 0; i < soNgay; i++) {
    var x = Utilities.formatDate(d, 'GMT', 'yyyyMMdd'), v = p.getProperty('TD_' + x);
    if (v) { try { ngay.push({ ngay: x.slice(0, 4) + '-' + x.slice(4, 6) + '-' + x.slice(6), o: JSON.parse(v) }); } catch (e) {} }
    d.setUTCDate(d.getUTCDate() - 1);
  }
  var nk = 0; try { var sh = ss_().getSheetByName(NKD_TEN); nk = sh ? sh.getLastRow() - 1 : 0; } catch (e) {}
  return sach_({ ok: true, moc: TD_MOC, ngay: ngay, nhatKyDong: nk, nkDem: nkdLay_(nkdPB_()) ? 1 : 0, tt4: tt4TrangThai_() });
}

/* ---------- 3) KHÓA MÃ HÓA BẢN LƯU TRÊN MÁY ---------- */
function klKhoa_(tk) { return 'KL_' + String(tk || '').toLowerCase(); }
function layKhoaLuu(token) {
  var me = docPhien_(token); if (!me) return { ok: false, hetHan: true };
  var p = PropertiesService.getScriptProperties(), k = klKhoa_(me.tk), v = p.getProperty(k);
  if (!v) { var b = []; for (var i = 0; i < 32; i++) b.push(Math.floor(Math.random() * 256)); v = Utilities.base64Encode(b.map(function(x) { return x > 127 ? x - 256 : x; })); p.setProperty(k, v); }
  return { ok: true, khoa: v, tk: me.tk };
}
function boKhoaLuu_(tk) { try { if (tk) PropertiesService.getScriptProperties().deleteProperty(klKhoa_(tk)); } catch (e) {} }

/* ===== 08/11 ĐIỀU PHỐI SẢN XUẤT (chủ dự án chọn việc 1, 2, 3 do quan-ly-van-hanh đề xuất) =====
   1) Cách đếm sản lượng xưởng (Claude đề xuất, chủ sở hữu bấm áp dụng) + Sức khỏe dữ liệu nhật ký.
   3) Dòng chảy giữa các xưởng (hàng đang dồn / đang hụt) + nút cổ chai hôm qua & 7 ngày.
      -> 1 và 3: chủ sở hữu + Ban điều hành (vai trò ADMIN), hiện ở Việc hôm nay; chủ sở hữu có thêm ở email 8h.
   2) "Hôm nay xưởng tôi làm gì trước": trưởng / phó phòng xem xưởng mình, chủ sở hữu xem mọi xưởng (layViecXuongToi).
   Sản lượng xưởng dùng đúng cách A (bước xuất ở tab Quy trình, chia "số lần ghi mỗi khúc") như biểu đồ sản lượng xưởng. */
var DP_CACHE = 'DP_v1';
/* Đề xuất cách đếm (số thật tháng 10, máy giả lập 08/11):
   - Phôi Carbon chỉ đếm Kiểm đếm xuất chuôi + Đóng gói ngọn (~231/ngày, đạt ~50%) – nhánh Ngọn không có bước xuất. Bước cuối nhánh Ngọn là "Cắt Phôi Ngọn" (~214/ngày).
   - Sơn: chủ dự án báo 02/11 "Sơn ghi mỗi lớp sơn thành 1 lần riêng"; mỗi chuôi qua Sơn máy + Sơn súng tay -> ~767/ngày, gấp đôi Phôi Thô xuất chuôi (~345) và Đóng gói (~352). Chia 2 -> ~383.
   - In UV: In và phủ bóng + Phủ bóng bề mặt -> ~753/ngày, cùng kiểu 2 lớp. Chia 2 -> ~377. */
var DP_DE_XUAT = [
  { x: 'PHOICB', them: ['CB-CHECK-CAT'], ly: 'Nhánh Ngọn chưa có bước xuất nên Phôi Carbon chỉ đếm chuôi + ngọn đóng gói. Thêm "Cắt Phôi Ngọn" – bước cuối của mỗi ngọn trước khi giao Phôi Thô.',
    doi: [['XPT-CPN-KTN', 'Phôi Thô: Check phôi ngọn CB trước khi SX'], ['XPT-VSR-VSP', 'Phôi Thô: Vệ sinh ren và phôi (chuôi ra)']] },
  { x: 'SON', luot: 2, ly: 'Sơn ghi mỗi lớp sơn thành 1 lần riêng (Sơn máy + Sơn súng tay cho cùng 1 chuôi) nên đang đếm gấp đôi. Chia 2 để ra số chuôi.',
    doi: [['XPT-VSR-VSP', 'Phôi Thô xuất chuôi'], ['DG-DONGGOITP', 'Đóng gói thành phẩm']] },
  { x: 'INUV', luot: 2, ly: '"In và phủ bóng" + "Phủ bóng bề mặt" ghi 2 lần cho cùng 1 chuôi (cùng kiểu Sơn). Chia 2 để ra số chuôi.',
    doi: [['XPT-VSR-VSP', 'Phôi Thô xuất chuôi'], ['DG-DONGGOITP', 'Đóng gói thành phẩm']] }
];
/* Dòng chảy: [xưởng trước, phần, xưởng sau, phần, nhãn] – phần 'c' chuôi, 'n' ngọn, '' cả xưởng */
var DP_CAP = [['PHOICB', 'c', 'PHOITHO', 'c', 'Phôi chuôi'], ['PHOICB', 'n', 'PHOITHO', 'n', 'Phôi ngọn'], ['PHOITHO', 'c', 'SON', '', 'Chuôi chờ sơn'],
  ['SON', '', 'INUV', '', 'Chuôi chờ in UV'], ['PHOITHO', 'n', 'NGONTARO', 'n', 'Ngọn chờ taro'], ['NGONTARO', 'n', 'HT', 'n', 'Ngọn chờ hoàn thiện (trước làm đầu)']];   // 14/11: ngọn Taro → Hoàn thiện → Ngọn Tip → trả HT   // Hoàn thiện (đếm khúc) → Đóng gói (đếm sản phẩm) khác đơn vị: không so
var DP_CHUOI = [['Chuỗi chuôi', [['PHOICB', 'c'], ['PHOITHO', 'c'], ['SON', ''], ['INUV', '']]], ['Chuỗi ngọn', [['PHOICB', 'n'], ['PHOITHO', 'n'], ['NGONTARO', 'n'], ['HT', 'n'], ['NGONTIP', '']]]];   // 14/11: ngọn qua Hoàn thiện trước Ngọn Tip

/* Đối chiếu ghi thiếu (08/11 chủ dự án: số Ngọn Taro đúng, ngọn GF qua Phôi Thô nhưng Phôi Thô ghi thiếu):
   [nhãn, mã xưởng trước giao, mã xưởng sau nhận, xưởng cần nhắc, chặng dòng chảy liên quan] – xưởng sau làm > 1,3 lần xưởng trước giao (và hơn 20/ngày) trong 14 ngày -> báo */
var DP_GHI_THIEU = [
  ['Ngọn Glassfiber', ['XPT-TR-TRNGF'], ['NGON-TARORENDONG-GF', 'NGON-TARORENTHUONG-GF'], 'PHOITHO', 'Ngọn chờ taro'],
  ['Ngọn Carbon', ['XPT-EPXN-NCBCD', 'XPT-EPXNCB-NCBT'], ['NGON-TAROREN-CB', 'NGON-TARORENDONG-CARBON'], 'PHOITHO', 'Ngọn chờ taro']
];
function dpQuyen_(token) {
  var me = docPhien_(token);
  if (!me) return { loi: sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' }) };
  if (!me.laOwner && me.vaiTro !== 'ADMIN') return { loi: sach_({ ok: false, msg: 'Chỉ chủ sở hữu và Ban điều hành xem phần này.' }) };
  return { me: me };
}
function dpCongNgay_(d, n) { var x = new Date(d + 'T12:00:00Z'); x.setUTCDate(x.getUTCDate() + n); return Utilities.formatDate(x, 'GMT', 'yyyy-MM-dd'); }
/* Ngày làm trong [tu, den]: thứ 2 – thứ 7, trừ lễ toàn công ty (sheet NgayLe không ghi xưởng + 24/11) */
function dpNgayLam_(tu, den) {
  var le = {}; docAnToan_('NgayLe').forEach(function(r) { if (!String(r.MaXuong || '').trim()) le[ngayVN_(r.Ngay)] = 1; });
  [tu.slice(0, 4), den.slice(0, 4)].forEach(function(y) { (typeof LE_CO_DINH_ !== 'undefined' ? LE_CO_DINH_ : []).forEach(function(x) { le[y + '-' + x[0]] = 1; }); });
  var ds = [];
  for (var d = tu, i = 0; d <= den && i < 400; d = dpCongNgay_(d, 1), i++) if (new Date(d + 'T12:00:00Z').getUTCDay() !== 0 && !le[d]) ds.push(d);
  return ds;
}
function dpTv_(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase(); }
function dpTinh_() {
  var hn = homNayVN_(), homQua = dpCongNgay_(hn, -1);
  var ngay30 = dpNgayLam_(dpCongNgay_(hn, -42), homQua).slice(-30), ngay14 = ngay30.slice(-14), ngay7 = ngay30.slice(-7), ngay6 = ngay30.slice(-6);
  var tu30 = ngay30[0] || homQua, la30 = {}, la14 = {}, la7 = {};
  ngay30.forEach(function(d) { la30[d] = 1; }); ngay14.forEach(function(d) { la14[d] = 1; }); ngay7.forEach(function(d) { la7[d] = 1; });
  var cds = doc_('CongDoan'), dung = cds.filter(function(c) { return String(c.TrangThai).trim() !== 'Ngừng'; }), qt = qtDocQT_(dung);
  var xOf = {}, tenCD = {}; cds.forEach(function(c) { xOf[String(c.MaCD)] = String(c.MaXuong); tenCD[String(c.MaCD)] = String(c.TenCD || c.MaCD); });
  var tenX = {}; docAnToan_('PhongBan').forEach(function(r) { tenX[String(r.MaXuong)] = String(r.TenXuong || r.MaXuong); });
  var ten = function(m) { return tenCD[m] || m; };
  /* bước xuất đang dùng của từng xưởng (giống dhSanLuongXuong_) */
  var xuat = {}, luot = {};
  DH_XUONG_TT.forEach(function(X) {
    var ma = X === 'DG' ? dhMaDongGoi_() : ((qt.xuat[X] && qt.xuat[X].length) ? qt.xuat[X].slice() : (DH_XUAT_MAC_DINH[X] || []).filter(function(m) { return xOf[m] === X; }));
    xuat[X] = ma; luot[X] = qt.luot[X] || 1;
  });
  var phan = function(X, m) {   // chuôi / ngọn của 1 bước xuất (nhánh trong tab Quy trình, không có thì theo tên); POM ở Ngọn Taro là vật liệu cấp Phôi Thô – bỏ
    var c = qt.cd[m], nh = c ? c.Nhanh : '', t = dpTv_(m + ' ' + ten(m));
    if (X === 'NGONTARO' && (nh === 'POM' || /pom/.test(t))) return '';
    if (nh === 'PK' || /tester/.test(t)) return '';   // 08/11 chủ dự án: Tester = joint tester thử ren chuôi cho khách (phụ kiện), không phải ngọn
    if (nh === 'NGON' || (/ngon/.test(t) && nh !== 'CHUOI')) return 'n';
    return 'c';
  };
  var cuaXuat = {}; DH_XUONG_TT.forEach(function(X) { xuat[X].forEach(function(m) { (cuaXuat[m] = cuaXuat[m] || []).push(X); }); });
  var deXuatMa = {}; DP_GHI_THIEU.forEach(function(g) { g[1].concat(g[2]).forEach(function(m) { deXuatMa[m] = 1; }); }); DP_DE_XUAT.forEach(function(p) { (p.them || []).forEach(function(m) { deXuatMa[m] = 1; }); (p.doi || []).forEach(function(a) { deXuatMa[a[0]] = 1; }); });
  /* 1 lượt đọc nhật ký */
  var sl = {}, coNK = {}, cho = {}, tuongLai = [], hang = {}, gan = [];
  docNKTu_(dpCongNgay_(hn, -45)).forEach(function(r) {
    var tt = String(r.TrangThai).trim(); if (tt === 'Từ chối') return;
    var ng = ngayVN_(r.Ngay), m = String(r.MaCD), X = xOf[m] || '', v = Number(r.SoLuongLamRa) || 0;
    if (ng > hn) { tuongLai.push({ ng: ng, x: X, cd: ten(m), nv: String(r.MaNV), sl: v, nguoi: String(r.NguoiNhap || '') }); return; }
    if (tt === 'Chờ duyệt' && ng < dpCongNgay_(hn, -2)) { var c = cho[X] || (cho[X] = { n: 0, cu: ng }); c.n++; if (ng < c.cu) c.cu = ng; }
    if (!la30[ng]) return;
    if (la7[ng]) (coNK[X] = coNK[X] || {})[ng] = 1;
    if (v <= 0) return;
    if (cuaXuat[m] || deXuatMa[m]) { var a = sl[m] || (sl[m] = {}); a[ng] = (a[ng] || 0) + v; }
    (hang[m] = hang[m] || []).push(v);
    if (la7[ng]) gan.push([m, ng, v, String(r.MaNV), String(r.NguoiNhap || '').split(' →')[0].trim()]);
  });
  var tong = function(ma, ngs, chia) { var t = 0; ma.forEach(function(m) { var a = sl[m] || {}; ngs.forEach(function(d) { t += a[d] || 0; }); }); return t / (chia || 1); };
  var tb = function(ma, ngs, chia) { return ngs.length ? tong(ma, ngs, chia) / ngs.length : 0; };
  /* ---- 1a. Cách đếm: đang dùng vs đề xuất (TB 30 ngày làm) ---- */
  var dem = DP_DE_XUAT.map(function(p) {
    var X = p.x, cu = xuat[X].slice(), lu = luot[X], moi = cu.slice(), luMoi = p.luot || lu;
    (p.them || []).forEach(function(m) { if (xOf[m] === X && moi.indexOf(m) < 0) moi.push(m); });
    var trung = moi.join(',') === cu.join(',') && luMoi === lu;
    return { x: X, ten: tenX[X] || X, ly: p.ly, daAp: trung,
      cu: { ma: cu, ten: cu.map(ten), luot: lu, tb: Math.round(tb(cu, ngay30, lu)) },
      moi: { ma: moi, ten: moi.map(ten), luot: luMoi, tb: Math.round(tb(moi, ngay30, luMoi)), them: moi.filter(function(m) { return cu.indexOf(m) < 0; }).map(ten) },
      doi: (p.doi || []).filter(function(a) { return xOf[a[0]]; }).map(function(a) { return [a[1], Math.round(tb([a[0]], ngay30, 1))]; }) };
  });
  /* Dòng chảy / nút cổ chai tính theo cách đếm đề xuất khi chủ sở hữu chưa áp (số đang dùng lệch gấp đôi thì so sánh vô nghĩa) */
  var theoDeXuat = false;
  dem.forEach(function(p) { if (p.daAp) return; theoDeXuat = true; xuat[p.x] = p.moi.ma.slice(); luot[p.x] = p.moi.luot; });
  /* ---- 1b. Sức khỏe dữ liệu ---- */
  var thieuNK = [];
  DH_XUONG_TT.forEach(function(X) { var co = coNK[X] || {}, k = ngay6.filter(function(d) { return !co[d]; }); if (k.length) thieuNK.push({ x: X, ten: tenX[X] || X, ngay: k }); });
  var choDs = Object.keys(cho).map(function(X) { return { x: X, ten: tenX[X] || X || '(công đoạn lạ)', n: cho[X].n, cu: cho[X].cu }; }).sort(function(a, b) { return b.n - a.n; });
  var trungVi = {}; Object.keys(hang).forEach(function(m) { var a = hang[m]; if (a.length < 10) return; a.sort(function(x, y) { return x - y; }); trungVi[m] = a[Math.floor(a.length / 2)]; });
  var la = gan.filter(function(g) { var t = trungVi[g[0]]; return t && g[2] > Math.max(3 * t, t + 100); })
    .map(function(g) { return { cd: ten(g[0]), x: tenX[xOf[g[0]]] || xOf[g[0]] || '', ng: g[1], sl: g[2], thuong: trungVi[g[0]], nv: g[3], nguoi: g[4], lan: Math.round(g[2] / trungVi[g[0]] * 10) / 10 }; })
    .sort(function(a, b) { return b.lan - a.lan; });
  var ghiThieu = [];
  DP_GHI_THIEU.forEach(function(g) {
    var a1 = g[1].filter(function(m) { return xOf[m]; }), b1 = g[2].filter(function(m) { return xOf[m]; }); if (!a1.length || !b1.length) return;
    var a = tb(a1, ngay14, 1), b = tb(b1, ngay14, 1);
    if (b > 20 && b > 1.3 * a && b - a > 20) ghiThieu.push({ nhan: g[0], x: g[3], ten: tenX[g[3]] || g[3], sau: tenX[xOf[b1[0]]] || '', a: Math.round(a), b: Math.round(b), cdA: a1.map(ten), cap: g[4] });
  });
  var sk = { ghiThieu: ghiThieu, thieuNK: thieuNK, cho: choDs, choTong: choDs.reduce(function(s, x) { return s + x.n; }, 0), la: la.slice(0, 12), laTong: la.length,
    tuongLai: tuongLai.length, tuongLaiDs: tuongLai.slice(0, 6).map(function(t) { t.x = tenX[t.x] || t.x; return t; }), ngay6: ngay6 };
  /* ---- 3. Dòng chảy + nút cổ chai ---- */
  var ra = function(X, ph, ngs) { var ma = xuat[X].filter(function(m) { return !ph || phan(X, m) === ph; }); if (X === 'NGONTARO' && !ph) ma = ma.filter(function(m) { return phan(X, m) !== ''; }); return tb(ma, ngs, luot[X]); };
  var tenP = function(X, ph) { return (tenX[X] || X) + (ph === 'c' && (X === 'PHOICB' || X === 'PHOITHO') ? ' (chuôi)' : ph === 'n' && (X === 'PHOICB' || X === 'PHOITHO' || X === 'HT') ? ' (ngọn)' : ''); };
  var cap = DP_CAP.map(function(c) {
    var a = ra(c[0], c[1], ngay14), b = ra(c[2], c[3], ngay14), ch = a - b, tich = ch * ngay14.length;
    var tt = !(a > 0) || !(b > 0) ? 'thieu' : Math.abs(ch) > 0.4 * Math.max(a, b) ? 'lech' : Math.abs(ch) <= 0.1 * b ? 'can' : ch > 0 ? 'don' : 'hut';   // lệch > 40%: nhiều khả năng do cách đếm, không kết luận dồn / hụt
    var gt = ghiThieu.filter(function(g) { return g.cap === c[4]; }).map(function(g) { return g.nhan; });
    return { ghiThieu: gt, nhan: c[4], tu: tenP(c[0], c[1]), den: tenP(c[2], c[3]), a: Math.round(a), b: Math.round(b), ch: Math.round(ch), tich: Math.round(tich), ngayB: b > 0 ? Math.round(tich / b * 10) / 10 : null, tt: tt };
  });
  var chuoi = DP_CHUOI.map(function(ch) {
    var ds = ch[1].map(function(a) { return { ten: tenP(a[0], a[1]), x: a[0], tb7: Math.round(ra(a[0], a[1], ngay7)), hq: Math.round(ra(a[0], a[1], [homQua])) }; }).filter(function(o) { return o.tb7 > 0; });
    var nho = ds.reduce(function(m, o) { return !m || o.tb7 < m.tb7 ? o : m; }, null), nhoHQ = ds.filter(function(o) { return o.hq > 0; }).reduce(function(m, o) { return !m || o.hq < m.hq ? o : m; }, null);
    return { ten: ch[0], ds: ds, nut: nho, nutHQ: nhoHQ };
  });
  var dg7 = Math.round(tb(xuat.DG, ngay7, 1));
  return { ok: true, luc: Utilities.formatDate(new Date(), TZ_VN, 'yyyy-MM-dd HH:mm'), homQua: homQua, coHQ: ngay30.indexOf(homQua) >= 0,
    soNgay: { d30: ngay30.length, d14: ngay14.length, d7: ngay7.length }, tu30: tu30, theoDeXuat: theoDeXuat, dem: dem, sk: sk, cap: cap, chuoi: chuoi, dg7: dg7 };
}
function layDieuPhoi(token, lamMoi) {
  var q = dpQuyen_(token); if (q.loi) return q.loi;
  var c = CacheService.getScriptCache(), kq = null;
  if (!lamMoi) { try { var s0 = c.get(DP_CACHE); if (s0) kq = JSON.parse(s0); } catch (e) {} }
  if (!kq) { kq = dpTinh_(); try { var s1 = JSON.stringify(kq); if (s1.length < 90000) c.put(DP_CACHE, s1, 600); } catch (e2) {} }
  kq.coTheAp = !!q.me.laOwner;
  return sach_(kq);
}
/* Chủ sở hữu bấm "Áp dụng đề xuất" ở thẻ Cách đếm -> ghi bước xuất / số lần ghi mỗi khúc của các xưởng chưa áp */
function apDeXuatDem(token) {
  var q = qtQuyen_(token); if (q.loi) return q.loi;
  var d = dpTinh_(), o = { xuat: {}, luot: {} };
  d.dem.forEach(function(p) { if (p.daAp) return; if (p.moi.ma.join(',') !== p.cu.ma.join(',')) o.xuat[p.x] = p.moi.ma; if (p.moi.luot !== p.cu.luot) o.luot[p.x] = p.moi.luot; });
  if (!Object.keys(o.xuat).length && !Object.keys(o.luot).length) return sach_({ ok: true, msg: 'Cách đếm đã đúng như đề xuất.' });
  return apCachDem(token, o);
}

/* ---- 2) Việc của xưởng: dòng đơn còn thiếu có liên quan tới xưởng (máy khách tính phần còn lại ở xưởng bằng đúng hàm của Việc theo xưởng) ---- */
var DP_LOAI_XUONG = { PHOICB: { GAY: 1, NGON: 1, CHUOI: 1 }, PHOITHO: { GAY: 1, NGON: 1, CHUOI: 1, NOI: 1 }, SON: { GAY: 1, CHUOI: 1, NOI: 1 }, INUV: { GAY: 1, CHUOI: 1, NOI: 1 },
  NGONTARO: { GAY: 1, NGON: 1 }, NGONTIP: { GAY: 1, NGON: 1 }, CNC: { GAY: 1, NGON: 1 }, HT: { GAY: 1, NGON: 1, CHUOI: 1, NOI: 1 }, DG: { GAY: 1, NGON: 1, CHUOI: 1, NOI: 1 } };
function layViecXuongToi(token) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  var X = '';
  if (!me.laOwner) {
    if (me.vaiTro !== 'TP' || !me.xuong) return sach_({ ok: false, msg: 'Chỉ trưởng / phó phòng xưởng và chủ sở hữu xem việc theo xưởng.' });
    X = String(me.xuong).trim();
    if (!DP_LOAI_XUONG[X]) return sach_({ ok: true, khongCo: true, xuong: X });
  }
  var d;
  try { d = dhDocDon_(false); }
  catch (e) { return sach_({ ok: false, msg: 'Không đọc được Sheet "Trạng thái đơn hàng": ' + (e && e.message || e) }); }
  plNapThem_();
  var sua = {}; docAnToan_(PL_SHEET).forEach(function(r) { if (r.TenChuan) sua[String(r.TenChuan)] = r; });
  var pc = {}, gon = function(o) {
    var tc = plChuan_(o.ten), p = pc[tc] || (pc[tc] = plPhanLoai_(o.ten, o.ghiChu, sua['K:' + tc]));
    return { maDon: o.maDon, tab: o.tab, kenh: o.kenh, nguoiDat: o.nguoiDat || '', ten: o.ten, sl: o.sl, thieu: o.thieu, dl: o.dl || '', qua: o.qua || {}, hong: o.hong || {}, uuTien: o.uuTien || '', pl: p };
  };
  var hop = function(o) { if (!(o.thieu > 0)) return false; if (!X) return true; var l = (pc[plChuan_(o.ten)] || {}).loai; return !!DP_LOAI_XUONG[X][l]; };
  var don = d.don.map(gon).filter(hop), uu = {};
  (d.uu || []).forEach(function(o) { if (o.maDon) uu[o.maDon] = o.uuTien || 'Ưu tiên'; });
  var tenX = {}; docAnToan_('PhongBan').forEach(function(r) { tenX[String(r.MaXuong)] = String(r.TenXuong || r.MaXuong); });
  return sach_({ ok: true, luc: d.luc, xuong: X, tenXuong: X ? (tenX[X] || X) : '', don: don, uuMa: uu, nhan: chNhan_() });
}

/* Đoạn thêm vào email 8h của chủ sở hữu */
function dpEmail_(e0, so) {
  var e = function(t) { return e0(String(t == null ? '' : t).replace(/^Xưởng /, '')); }, d; try { d = dpTinh_(); } catch (x) { return ''; }
  var h = '<div style="font-size:12px;font-weight:600;color:#0b4f4a;border-left:3px solid #0b7a73;padding-left:8px;margin:14px 0 6px">ĐIỀU PHỐI (' + d.soNgay.d7 + ' ngày làm gần nhất)</div><ul style="margin:0;padding-left:18px;font-size:12.5px;line-height:1.55">';
  d.chuoi.forEach(function(c) { if (c.nut) h += '<li>' + e(c.ten) + ': chậm nhất là <b>' + e(c.nut.ten) + '</b> ~' + so(c.nut.tb7) + '/ngày' + (c.nutHQ && c.nutHQ.ten !== c.nut.ten ? ' (hôm qua: ' + e(c.nutHQ.ten) + ' ' + so(c.nutHQ.hq) + ')' : '') + '</li>'; });
  if (d.theoDeXuat) h += '<li><i>Tính theo cách đếm Claude đề xuất (chưa áp dụng).</i></li>';
  d.cap.filter(function(c) { return c.tt === 'don' || c.tt === 'hut'; }).forEach(function(c) { h += '<li>' + e(c.nhan) + ': ' + (c.tt === 'don' ? '<b style="color:#b42a25">đang dồn</b> +' + so(c.tich) : '<b style="color:#9a5b00">đang hụt</b> ' + so(c.tich)) + ' trong ' + d.soNgay.d14 + ' ngày (' + e(c.tu) + ' ' + so(c.a) + ' → ' + e(c.den) + ' ' + so(c.b) + '/ngày)</li>'; });
  var s = d.sk, sk = [];
  (s.ghiThieu || []).forEach(function(g) { sk.push('<b>' + e(g.ten) + ' có thể ghi thiếu ' + e(g.nhan.toLowerCase()) + '</b> (giao ' + so(g.a) + '/ngày, ' + e(g.sau) + ' làm ' + so(g.b) + '/ngày)'); });
  if (s.thieuNK.length) sk.push(s.thieuNK.length + ' xưởng có ngày làm không ghi nhật ký');
  if (s.choTong) sk.push(s.choTong + ' dòng chờ duyệt quá 2 ngày');
  if (s.laTong) sk.push(s.laTong + ' dòng số lượng bất thường (gấp ≥ 3 lần thường ngày)');
  if (s.tuongLai) sk.push(s.tuongLai + ' dòng ghi ngày tương lai');
  h += '<li>Sức khỏe dữ liệu: ' + (sk.length ? sk.join(' · ') : 'không có gì bất thường') + '</li>';
  if (d.dem.some(function(p) { return !p.daAp; })) h += '<li><b>Chưa áp cách đếm Claude đề xuất</b> (Phôi Carbon / Sơn / In UV) – xem Việc hôm nay.</li>';
  return h + '</ul>';
}

/* ===== 08/11 TĂNG TỐC ĐỢT 4 – ĐĂNG NHẬP NHANH (chủ dự án: "CN, TP, PP mất hơn 20 giây để đăng nhập, thấy số") =====
   Chủ dự án chọn A: (1) Sheets API tự bật: 2-CAP-NHAT.bat ghi dịch vụ Sheets vào appsscript.json; lịch giữ nóng tự kiểm tra
   (đọc 2 cách so khớp như KIEM_TRA_SHEETS_API) rồi bật đọc gộp – mỗi lần đăng nhập đọc ~20 trang tính trong 1 lượt thay vì 20 lượt.
   (2) Giữ nóng bộ nhớ nhật ký dùng chung (NKD3): lịch 5 phút/lần (6h–22h) đọc lại sheet nhật ký khi bản nhớ sắp hết hạn,
   nên người đăng nhập không phải chờ đọc ~20.000 dòng. Lịch tự cài khi chủ sở hữu mở web (không cần chạy tay). */
var TT4_HAM = 'GIU_NONG_DANG_NHAP', TT4_LAM_MOI = 480;   // làm mới bản nhớ khi đã quá 8 phút (bản nhớ sống 15 phút)
function tt4CaiLich_() {
  var p = PropertiesService.getScriptProperties();
  if (p.getProperty('TT4_LICH') === '1' || p.getProperty('TT4_TAT') === '1') return;
  if (!ScriptApp.getProjectTriggers().some(function(t) { return t.getHandlerFunction() === TT4_HAM; }))
    ScriptApp.newTrigger(TT4_HAM).timeBased().everyMinutes(5).create();
  p.setProperty('TT4_LICH', '1');
}
function GIU_NONG_DANG_NHAP(e) {
  if (!noiBo_(e)) return chanWeb_('GIU_NONG_DANG_NHAP');
  var gio = gioVN_(); if (gio < 6 || gio >= 22) return;
  var p = PropertiesService.getScriptProperties(), t0 = Date.now();
  /* (1) Sheets API: tự kiểm tra 1 lần / ngày tới khi khớp (chủ dự án tắt tay bằng TAT_SHEETS_API thì thôi) */
  try {
    var sa = p.getProperty('KPI_SHEETS_API'), kt = p.getProperty('TT4_KT_API') || '', hn = homNayVN_();
    if (typeof Sheets !== 'undefined' && sa !== '1' && p.getProperty('KPI_SHEETS_TAT') !== '1' && kt !== hn) { p.setProperty('TT4_KT_API', hn); KIEM_TRA_SHEETS_API(e); }
  } catch (x) {}
  /* (2) nhật ký dùng chung: còn nóng thì thôi, sắp hết hạn thì đọc lại */
  try {
    var c = CacheService.getScriptCache(), pb = nkdPB_(), m = c.get(NKD_K + '_m'), tu = Number(c.get(NKD_K + '_t') || 0);
    m = m ? JSON.parse(m) : null;
    if (!(m && m.pb === pb && Date.now() - tu < TT4_LAM_MOI * 1000)) {
      var sh = ss_().getSheetByName(NKD_TEN);
      if (sh) nkdGhi_(pb, sh.getDataRange().getValues());
    }
  } catch (x) {}
  try { var n = Number(p.getProperty('TT4_DEM') || 0) + 1; if (n % 12 === 1) Logger.log('Giữ nóng đăng nhập: ' + (Date.now() - t0) + ' ms'); p.setProperty('TT4_DEM', String(n)); } catch (x) {}
}
/* Chạy tay nếu muốn tắt / bật lại lịch giữ nóng */
function TAT_GIU_NONG_DANG_NHAP() {
  if (!noiBo_(arguments[0])) return chanWeb_('TAT_GIU_NONG_DANG_NHAP');
  ScriptApp.getProjectTriggers().forEach(function(t) { if (t.getHandlerFunction() === TT4_HAM) ScriptApp.deleteTrigger(t); });
  var p = PropertiesService.getScriptProperties(); p.setProperty('TT4_TAT', '1'); p.deleteProperty('TT4_LICH'); Logger.log('Đã tắt lịch giữ nóng đăng nhập.');
}
function BAT_GIU_NONG_DANG_NHAP() {
  if (!noiBo_(arguments[0])) return chanWeb_('BAT_GIU_NONG_DANG_NHAP');
  var p = PropertiesService.getScriptProperties(); p.deleteProperty('TT4_TAT'); p.deleteProperty('TT4_LICH'); tt4CaiLich_(); Logger.log('Đã bật lịch giữ nóng đăng nhập (5 phút/lần, 6h–22h).');
}
function tt4TrangThai_() {
  var p = PropertiesService.getScriptProperties(), lich = false;
  try { lich = ScriptApp.getProjectTriggers().some(function(t) { return t.getHandlerFunction() === TT4_HAM; }); } catch (e) {}
  return { sheetsApi: typeof Sheets !== 'undefined' ? (p.getProperty('KPI_SHEETS_API') === '1' ? 'bat' : 'chuaKhop') : 'chuaCo', lich: lich };
}

/* ===== 08/11 DỌN DẸP HẰNG THÁNG (chủ dự án: "chỉ nên giữ tháng hiện tại và tháng trước") =====
   Ngày 1 hằng tháng 3h sáng (lịch tự cài khi chủ sở hữu mở web):
   1) Sao lưu tháng: chép cả file vào thư mục Drive "KPI_Backup_Thang", giữ 24 bản gần nhất (bản hằng ngày "KPI_Backup" vẫn giữ 30 ngày).
   2) Chỉ khi đã có bản sao tháng này:
      - Nhật ký sản lượng: tháng cũ hơn tháng trước (đã chốt chính thức) chuyển sang NhatKySanXuat_LuuTru cùng file (LUU_TRU_NHAT_KY, SO_THANG_GIU = 1).
        Bảng KPI, Thống kê, phân tích định mức, biểu đồ dài ngày tự đọc thêm trang lưu trữ khi cần (docNKTu_).
      - Nhật ký thao tác: xóa dòng trước đầu tháng trước (tra lại trong bản sao tháng). */
var LD_HAM = 'DON_DEP_HANG_THANG', LD_THU_MUC = 'KPI_Backup_Thang', LD_GIU = 24;
/* Nhật ký sản lượng từ ngày tu (yyyy-mm-dd; '' = toàn bộ): ghép thêm trang lưu trữ khi tu cũ hơn mốc lưu trữ */
function docNKTu_(tu) {
  var a = doc_('NhatKySanXuat'), moc = mocLuuTru_();
  if (!moc || (tu && String(tu).slice(0, 7) >= moc) || !ss_().getSheetByName(TEN_LUU_TRU)) return a;
  return docAnToan_(TEN_LUU_TRU).concat(a);
}
function ldCaiLich_() {
  var p = PropertiesService.getScriptProperties();
  if (p.getProperty('LD_LICH') === '1' || p.getProperty('LD_TAT') === '1') return;
  var ds = ScriptApp.getProjectTriggers();
  ds.forEach(function(t) { if (t.getHandlerFunction() === 'LUU_TRU_NHAT_KY') ScriptApp.deleteTrigger(t); });   // lịch cũ ngày 5 (nếu có) -> gộp vào lịch mới
  if (!ds.some(function(t) { return t.getHandlerFunction() === LD_HAM; })) {
    ScriptApp.newTrigger(LD_HAM).timeBased().onMonthDay(1).atHour(3).inTimezone(TZ_VN).create();
    try { var b = ScriptApp.newTrigger(LD_HAM).timeBased(); if (b.after) b.after(15 * 60 * 1000).create(); } catch (e) {}   // chạy lần đầu sau 15 phút
  }
  p.setProperty('LD_LICH', '1');
}
function saoLuuThang_() {
  var ky = kyVN_(), ten = SpreadsheetApp.getActiveSpreadsheet().getName() + ' — thang ' + ky, it = DriveApp.getFoldersByName(LD_THU_MUC);
  var tm = it.hasNext() ? it.next() : DriveApp.createFolder(LD_THU_MUC), co = false, ds = [], f = tm.getFiles();
  while (f.hasNext()) { var x = f.next(); if (x.isTrashed && x.isTrashed()) continue; if (x.getName() === ten) co = true; ds.push(x); }
  if (!co) { var moi = DriveApp.getFileById(SpreadsheetApp.getActiveSpreadsheet().getId()).makeCopy(ten, tm); ds.push(moi); }
  ds.sort(function(a, b) { return b.getDateCreated().getTime() - a.getDateCreated().getTime(); });
  ds.slice(LD_GIU).forEach(function(x) { x.setTrashed(true); });   // vào thùng rác Drive, không xóa vĩnh viễn
  return ten;
}
function donNhatKyThaoTac_() {
  var sh = ss_().getSheetByName('NhatKyThaoTac'); if (!sh || sh.getLastRow() < 2) return 0;
  var moc = kyTruoc_(kyVN_()) + '-01', v = sh.getRange(2, 1, sh.getLastRow() - 1, 1).getValues(), xoa = [];
  v.forEach(function(r, i) { var d = r[0]; if (!d) return; var ng = Object.prototype.toString.call(d) === '[object Date]' ? Utilities.formatDate(d, TZ_VN, 'yyyy-MM-dd') : String(d).slice(0, 10); if (/^\d{4}-\d{2}-\d{2}$/.test(ng) && ng < moc) xoa.push(i + 2); });
  if (xoa.length) xoaNhieuDong_('NhatKyThaoTac', xoa);
  return xoa.length;
}
function DON_DEP_HANG_THANG(e) {
  if (!noiBo_(e)) return chanWeb_(LD_HAM);
  var p = PropertiesService.getScriptProperties(), ky = kyVN_(), kq = [];
  try { kq.push('sao lưu: ' + saoLuuThang_()); p.setProperty('LD_SAO_LUU', ky); } catch (x) { kq.push('LỖI sao lưu tháng: ' + (x && x.message)); }
  if (p.getProperty('LD_SAO_LUU') === ky) {   // chưa sao lưu được thì chưa dọn
    try { LUU_TRU_NHAT_KY(e); kq.push('lưu trữ nhật ký sản lượng: xong'); } catch (x) { kq.push('LỖI lưu trữ nhật ký: ' + (x && x.message)); }
    try { kq.push('xóa ' + donNhatKyThaoTac_() + ' dòng nhật ký thao tác cũ'); } catch (x) { kq.push('LỖI dọn nhật ký thao tác: ' + (x && x.message)); }
  }
  p.setProperty('LD_LAN_CUOI', Utilities.formatDate(new Date(), TZ_VN, 'yyyy-MM-dd HH:mm') + ' · ' + kq.join(' · '));
  try { ghiLog_({ tk: 'HE_THONG', ten: 'Dọn dẹp tháng' }, 'Dọn dẹp hằng tháng', kq.join(' · '), '', ''); } catch (x) {}
  Logger.log(kq.join('\n'));
}

/* ================== CẤU HÌNH GẬY – BẢN VẼ KỸ THUẬT (08/11) ==================
   Tab riêng "Cấu hình gậy": mỗi dòng gậy (dùng chung danh sách với Đơn hàng › Cấu hình sản phẩm) có một bộ thông số
   kích thước / vật liệu đầy đủ; trình duyệt tự vẽ bản vẽ (hình ngoài, mặt cắt, chi tiết joint + đuôi) và xuất PDF.
   TÀI LIỆU MẬT – chỉ 4 mã nhân viên (chủ dự án chốt 08/11):
     C019 + C056 (sửa + DUYỆT, được tự duyệt), C077 + C067 (sửa) – chủ dự án đổi 09/11.
   Luồng: C077 lưu -> bản "Chờ duyệt" (mỗi dòng gậy giữ tối đa 1 bản chờ, lưu lại là thay) -> C019 duyệt -> thành bản hiệu lực
   (số phiên bản tăng, bản hiệu lực cũ chuyển "Bản cũ" – vẫn xem / tải lại được) hoặc từ chối kèm lý do.
   Sheet CauHinhGay (ẩn): Id, MaDong, PhienBan, TrangThai, DuLieu(JSON), NguoiLuu, ThoiDiemLuu, GhiChu, NguoiDuyet, ThoiDiemDuyet, LyDo.
   Mỗi lần tải PDF ghi Nhật ký thao tác (PDF có dấu chìm tên người tải + giờ). */
var CG_SHEET = 'CauHinhGay';
var CG_COT = ['Id', 'MaDong', 'PhienBan', 'TrangThai', 'DuLieu', 'NguoiLuu', 'ThoiDiemLuu', 'GhiChu', 'NguoiDuyet', 'ThoiDiemDuyet', 'LyDo'];
var CG_QUYEN = { C056: 'duyet', C019: 'duyet', C077: 'sua', C067: 'sua' };   // 09/11 (chủ dự án): cả 4 sửa được; C019 + C056 duyệt (được tự duyệt bản mình lưu)
var CG_MAX_JSON = 40000;
/* Trường được lưu (đường dẫn -> 'n' số | 's' chữ) – khớp CG_TRUONG ở CauHinhGay.html (va-cau-hinh-gay-web.py kiểm khớp khi dựng) */
var CG_KHOA = {"ngon.tip.d": "n", "ngon.tip.h": "n", "ngon.tip.vl": "s", "ngon.pad.h": "n", "ngon.pad.vl": "s", "ngon.ferrule.h": "n", "ngon.ferrule.vl": "s", "ngon.ferrule.tenonD": "n", "ngon.ferrule.tenonL": "n", "ngon.ong.vl": "s", "ngon.ong.loi": "s", "ngon.ong.day": "n", "ngon.ong.dai": "n", "ngon.ong.dDau": "n", "ngon.ong.proDai": "n", "ngon.ong.dPro": "n", "ngon.ong.dJoint": "n", "ngon.ong.nutTruoc": "n", "ngon.ong.nutSau": "n", "ngon.ong.nutVl": "s", "ngon.collar.d": "n", "ngon.collar.h": "n", "ngon.collar.vl": "s", "ngon.insert.d": "n", "ngon.insert.l": "n", "ngon.insert.vl": "s", "ngon.insert.ren": "s", "chuoi.collar.d": "n", "chuoi.collar.h": "n", "chuoi.collar.vl": "s", "chuoi.pin.ren": "s", "chuoi.pin.d": "n", "chuoi.pin.tho": "n", "chuoi.pin.chon": "n", "chuoi.pin.buoc": "n", "chuoi.pin.kieu": "s", "chuoi.pin.vl": "s", "chuoi.kieu": "s", "chuoi.soKhuc": "n", "chuoi.forearm.dai": "n", "chuoi.forearm.dDau": "n", "chuoi.forearm.dCuoi": "n", "chuoi.forearm.vl": "s", "chuoi.vo.day": "n", "chuoi.wrap.dai": "n", "chuoi.wrap.dDau": "n", "chuoi.wrap.dCuoi": "n", "chuoi.wrap.vl": "s", "chuoi.sleeve.dai": "n", "chuoi.sleeve.dDau": "n", "chuoi.sleeve.dCuoi": "n", "chuoi.sleeve.vl": "s", "chuoi.veneer.h": "n", "chuoi.veneer.vl": "s", "chuoi.khoiPin.d": "n", "chuoi.khoiPin.l": "n", "chuoi.khoiPin.vl": "s", "chuoi.loi.tren": "s", "chuoi.loi.duoi": "s", "chuoi.thanhNoi.d": "n", "chuoi.thanhNoi.l": "n", "chuoi.thanhNoi.vl": "s", "chuoi.vien.h": "n", "chuoi.vien.vl": "s", "chuoi.khoiCan.dai": "n", "chuoi.khoiCan.vt": "n", "chuoi.khoiCan.vl": "s", "chuoi.noi.dai": "n", "chuoi.noi.ren": "s", "chuoi.noi.pinD": "n", "chuoi.noi.tho": "n", "chuoi.noi.chon": "n", "chuoi.noi.insD": "n", "chuoi.noi.vl": "s", "chuoi.cap.h": "n", "chuoi.cap.d": "n", "chuoi.cap.vl": "s", "chuoi.bumper.h": "n", "chuoi.bumper.d": "n", "chuoi.bumper.vl": "s", "chuoi.ongCan.d": "n", "chuoi.ongCan.dai": "n", "chuoi.ongCan.vl": "s", "chuoi.ongCan.ren": "s", "chuoi.qua.so": "n", "chuoi.qua.d": "n", "chuoi.qua.dai": "n", "chuoi.qua.vl": "s", "chuoi.bumper.renL": "n", "chuoi.forearm.tenonD": "n", "chuoi.forearm.tenonL": "n", "chuoi.khoang.d": "n", "chuoi.khoang.sau": "n", "chuoi.bolt.ren": "s", "chuoi.bolt.dai": "n", "chuoi.bolt.dauD": "n", "chung.khoiMin": "n", "chung.khoiMax": "n", "chung.khoiNgon": "n", "chung.canBang": "n", "chung.ghiChu": "s"};

/* Quyền của 1 phiên: '' | 'xem' | 'sua' | 'duyet'. Chủ sở hữu luôn xem được (kể cả khi mã NV trên tài khoản để trống). */
function cgQuyenCua_(me) {
  if (!me) return '';
  var ma = String(me.maNV || '').trim().toUpperCase(), q = CG_QUYEN[ma] || '';
  if (!q) return '';
  /* mã NV phải gắn với đúng 1 tài khoản đang dùng (chặn tạo tài khoản khác trùng mã để chiếm quyền) */
  var n = doc_('TaiKhoan').filter(function(t) { return String(t.MaNV || '').trim().toUpperCase() === ma && String(t.TrangThai).trim() === 'Đang dùng'; }).length;
  return n === 1 ? q : '';
}
function cgQuyen_(token, can) {
  var me = docPhien_(token);
  if (!me) return { loi: sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' }) };
  var q = cgQuyenCua_(me);
  var duoc = !can || q === can || (can === 'sua' && q === 'duyet');   // người duyệt cũng sửa được
  if (!q || !duoc) return { loi: sach_({ ok: false, msg: can === 'sua' ? 'Tài khoản không được lưu thông số.' : can === 'duyet' ? 'Chỉ C019 hoặc C056 được duyệt.' : 'Tài khoản không xem được Cấu hình gậy.' }) };
  return { me: me, q: q };
}
function cgSheet_() {
  var sh = ss_().getSheetByName(CG_SHEET);
  if (!sh) {
    sh = ss_().insertSheet(CG_SHEET);
    sh.getRange(1, 1, 1, CG_COT.length).setValues([CG_COT]).setFontWeight('bold'); sh.setFrozenRows(1);
    sh.getRange(2, 1, sh.getMaxRows() - 1, CG_COT.length).setNumberFormat('@');
    try { sh.hideSheet(); } catch (e) {}
  }
  return sh;
}
function cgDoc_() { return ss_().getSheetByName(CG_SHEET) ? doc_(CG_SHEET) : []; }
function cgLuc_() { return Utilities.formatDate(new Date(), TZ_VN, 'yyyy-MM-dd HH:mm'); }
function cgTimDong_(ma) {
  plNapThem_();
  for (var i = 0; i < PL_DONG.length; i++) if (PL_DONG[i][0] === ma) return PL_DONG[i];
  return null;
}

/* Danh sách dòng gậy + trạng thái bản vẽ (không kèm thông số – nhẹ) */
function layDsCauHinhGay(token) {
  var Q = cgQuyen_(token); if (Q.loi) return Q.loi;
  plNapThem_();
  var rows = cgDoc_(), tt = {};
  rows.forEach(function(r) {
    var m = String(r.MaDong), o = tt[m] = tt[m] || { pb: 0, cho: false, luc: '' };
    if (r.TrangThai === 'Hiệu lực') { o.pb = Number(r.PhienBan) || 0; o.luc = String(r.ThoiDiemDuyet || ''); }
    if (r.TrangThai === 'Chờ duyệt' && Q.q !== 'xem') o.cho = true;
  });
  var ds = PL_DONG.filter(function(d) { return !(PL_AN.DONG && PL_AN.DONG[d[0]]); }).map(function(d) {
    var o = plKieu_({ loai: d[2], chuoi: d[4], ngon: d[5] }), t = tt[d[0]] || { pb: 0, cho: false, luc: '' };
    return { ma: d[0], ten: d[1], loai: d[2], goi: (d[3] || []).slice(0, 15), kieu: o.kieu, vlC: o.vlC, vlN: o.vlN, chuoi: d[4], ngon: d[5], tip: d[6], ren: d[7],
      tenChuoi: PL_CHUOI[d[4]] || d[4] || '', tenNgon: PL_NGON[d[5]] || d[5] || '', tenTip: PL_TIP[d[6]] || d[6] || '', tenRen: PL_REN[d[7]] || d[7] || '',
      pb: t.pb, cho: t.cho, luc: t.luc };
  });
  return sach_({ ok: true, quyen: Q.q, ds: ds, ten: (Q.me.hoTen || Q.me.ten || Q.me.tk), tk: Q.me.tk, maNV: Q.me.maNV || '' });
}

/* Bản vẽ của 1 dòng gậy: bản hiệu lực + bản chờ duyệt + lịch sử (không kèm dữ liệu các bản cũ) */
function layCauHinhGay(token, ma, phienBan) {
  var Q = cgQuyen_(token); if (Q.loi) return Q.loi;
  ma = String(ma || '').slice(0, 30);
  var d = cgTimDong_(ma); if (!d) return sach_({ ok: false, msg: 'Không thấy dòng gậy.' });
  var rows = cgDoc_().filter(function(r) { return String(r.MaDong) === ma; });
  var gon = function(r) { return r ? { id: r.Id, pb: Number(r.PhienBan) || 0, tt: r.TrangThai, nguoi: r.NguoiLuu, luc: r.ThoiDiemLuu, ghiChu: r.GhiChu, duyet: r.NguoiDuyet, lucDuyet: r.ThoiDiemDuyet, lyDo: r.LyDo } : null; };
  var json = function(r) { try { return r && r.DuLieu ? JSON.parse(r.DuLieu) : null; } catch (e) { return null; } };
  var hl = rows.filter(function(r) { return r.TrangThai === 'Hiệu lực'; })[0];
  var cho = Q.q === 'xem' ? null : rows.filter(function(r) { return r.TrangThai === 'Chờ duyệt'; })[0];   // người chỉ xem: chỉ thấy bản đã duyệt
  if (Q.q === 'xem') rows = rows.filter(function(r) { return r.TrangThai !== 'Chờ duyệt'; });
  try { var ck = 'CGX_' + Q.me.tk + '_' + ma, cc = CacheService.getScriptCache(); if (!cc.get(ck)) { cc.put(ck, '1', 21600); ghiLog_(Q.me, 'Xem cấu hình gậy', ma, '', phienBan ? 'bản ' + String(phienBan).slice(0, 12) : ''); } } catch (e) {}
  var xem = phienBan ? rows.filter(function(r) { return Number(r.PhienBan) === Number(phienBan) && r.TrangThai !== 'Chờ duyệt' && r.TrangThai !== 'Từ chối'; })[0] : null;
  var o = plKieu_({ loai: d[2], chuoi: d[4], ngon: d[5] });
  return sach_({ ok: true, quyen: Q.q,
    dong: { ma: d[0], ten: d[1], loai: d[2], goi: (d[3] || []).slice(0, 15), kieu: o.kieu, vlC: o.vlC, vlN: o.vlN, chuoi: d[4], ngon: d[5], tip: d[6], ren: d[7],
      tenChuoi: PL_CHUOI[d[4]] || d[4] || '', tenNgon: PL_NGON[d[5]] || d[5] || '', tenTip: PL_TIP[d[6]] || d[6] || '', tenRen: PL_REN[d[7]] || d[7] || '' },
    hieuLuc: hl ? { tt: gon(hl), dl: json(hl) } : null,
    choDuyet: cho ? { tt: gon(cho), dl: json(cho) } : null,
    xem: xem ? { tt: gon(xem), dl: json(xem) } : null,
    lichSu: rows.map(gon).sort(function(a, b) { return String(b.luc).localeCompare(String(a.luc)); }).slice(0, 40) });
}

/* Lọc dữ liệu thông số theo CG_KHOA: chỉ giữ trường đã biết, đúng kiểu, số trong khoảng hợp lý.
   Trả { loi } hoặc { dl } (object mới – không mang khóa lạ như __proto__ / constructor). */
function cgLoc_(dl) {
  if (!dl || typeof dl !== 'object' || Array.isArray(dl)) return { loi: 'Dữ liệu không hợp lệ.' };
  if (JSON.stringify(dl).length > CG_MAX_JSON) return { loi: 'Dữ liệu quá lớn.' };
  var ra = { daDo: {} }, loi = '';
  var dat = function(p, v) { var k = p.split('.'), o = ra; for (var i = 0; i < k.length - 1; i++) { if (!Object.prototype.hasOwnProperty.call(o, k[i])) o[k[i]] = {}; o = o[k[i]]; } o[k[k.length - 1]] = v; };
  var lay = function(p) { return p.split('.').reduce(function(o, k) { return (o && typeof o === 'object' && Object.prototype.hasOwnProperty.call(o, k)) ? o[k] : undefined; }, dl); };
  Object.keys(CG_KHOA).forEach(function(p) {
    if (loi) return; var v = lay(p);
    if (v === undefined || v === null || v === '') return;
    if (CG_KHOA[p] === 'n') { if (typeof v !== 'number' || !isFinite(v) || v < 0 || v > 5000) { loi = 'Số không hợp lệ ở ' + p; return; } dat(p, v); }
    else { if (typeof v !== 'string' || v.length > 120) { loi = 'Chữ không hợp lệ ở ' + p; return; } dat(p, v.replace(/[\u0000-\u001f]/g, ' ')); }
  });
  if (loi) return { loi: loi };
  var dd = dl.daDo;
  if (dd && typeof dd === 'object' && !Array.isArray(dd)) Object.keys(dd).forEach(function(k) { var p = k.replace(/__/g, '.'); if (Object.prototype.hasOwnProperty.call(CG_KHOA, p) && dd[k]) ra.daDo[k] = 1; });
  return { dl: ra };
}
/* C077 lưu -> bản chờ duyệt (thay bản đang chờ của dòng đó nếu có) */
function luuCauHinhGay(token, ma, dl, ghiChu) {
  var Q = cgQuyen_(token, 'sua'); if (Q.loi) return Q.loi;
  ma = String(ma || '').slice(0, 30);
  if (!cgTimDong_(ma)) return sach_({ ok: false, msg: 'Không thấy dòng gậy.' });
  var L = cgLoc_(dl); if (L.loi) return sach_({ ok: false, msg: L.loi });
  dl = L.dl;
  khoa_(); cgSheet_(); xoaCache_(CG_SHEET);
  var rows = cgDoc_().filter(function(r) { return String(r.MaDong) === ma; });
  var sh = ss_().getSheetByName(CG_SHEET);
  rows.filter(function(r) { return r.TrangThai === 'Chờ duyệt'; }).map(function(r) { return r._row; }).sort(function(a, b) { return b - a; })
    .forEach(function(r) { sh.deleteRow(r); });
  xoaCache_(CG_SHEET);
  var pbMax = rows.filter(function(r) { return r.TrangThai !== 'Chờ duyệt'; }).reduce(function(m, r) { return Math.max(m, Number(r.PhienBan) || 0); }, 0);   // lưu lại khi đang chờ: giữ số bản
  var gc = String(ghiChu || '').replace(/\s+/g, ' ').trim().slice(0, 300);
  them_(CG_SHEET, { Id: 'CG' + new Date().getTime() + '-' + Utilities.getUuid().slice(0, 6), MaDong: ma, PhienBan: String(pbMax + 1), TrangThai: 'Chờ duyệt',
    DuLieu: JSON.stringify(dl), NguoiLuu: Q.me.tk, ThoiDiemLuu: cgLuc_(), GhiChu: chuAnToan_(gc), NguoiDuyet: '', ThoiDiemDuyet: '', LyDo: '' });
  ghiLog_(Q.me, 'Lưu cấu hình gậy (chờ duyệt)', ma, '', 'bản ' + (pbMax + 1) + (gc ? ' – ' + gc.slice(0, 100) : ''));
  return sach_({ ok: true, msg: 'Đã lưu bản ' + (pbMax + 1) + ' – chờ Giám đốc sản xuất duyệt.' });
}

/* C019 duyệt / từ chối bản chờ */
function duyetCauHinhGay(token, id, dongY, lyDo) {
  var Q = cgQuyen_(token, 'duyet'); if (Q.loi) return Q.loi;
  id = String(id || '').slice(0, 40); lyDo = String(lyDo || '').replace(/\s+/g, ' ').trim().slice(0, 300);
  if (!dongY && !lyDo) return sach_({ ok: false, msg: 'Ghi lý do từ chối để người đo biết cần sửa gì.' });
  khoa_(); xoaCache_(CG_SHEET);
  var rows = cgDoc_(), r = rows.filter(function(x) { return x.Id === id; })[0];
  if (!r || r.TrangThai !== 'Chờ duyệt') return sach_({ ok: false, msg: 'Bản này không còn chờ duyệt (có thể đã được lưu lại bản mới).' });
  var sh = ss_().getSheetByName(CG_SHEET), cTT = CG_COT.indexOf('TrangThai') + 1, cND = CG_COT.indexOf('NguoiDuyet') + 1, luc = cgLuc_();
  if (dongY) rows.filter(function(x) { return x.MaDong === r.MaDong && x.TrangThai === 'Hiệu lực'; }).forEach(function(x) { sh.getRange(x._row, cTT).setValue('Bản cũ'); });
  sh.getRange(r._row, cTT).setValue(dongY ? 'Hiệu lực' : 'Từ chối');
  sh.getRange(r._row, cND, 1, 3).setValues([[Q.me.tk, luc, chuAnToan_(lyDo)]]);
  xoaCache_(CG_SHEET);
  ghiLog_(Q.me, dongY ? 'Duyệt cấu hình gậy' : 'Từ chối cấu hình gậy', r.MaDong, '', 'bản ' + r.PhienBan + ' của ' + r.NguoiLuu + (lyDo ? ' – ' + lyDo.slice(0, 100) : ''));
  return sach_({ ok: true, msg: dongY ? 'Đã duyệt – bản ' + r.PhienBan + ' có hiệu lực.' : 'Đã từ chối, người đo sẽ thấy lý do.' });
}

/* Ghi nhật ký mỗi lần tải PDF (gọi trước khi trình duyệt tạo file); trả tên + giờ để in dấu chìm */
function ghiTaiPdfCauHinhGay(token, ma, phienBan) {
  var Q = cgQuyen_(token); if (Q.loi) return Q.loi;
  ma = String(ma || '').slice(0, 30);
  if (!cgTimDong_(ma)) return sach_({ ok: false, msg: 'Không thấy dòng gậy.' });
  var luc = cgLuc_();
  ghiLog_(Q.me, 'Tải PDF cấu hình gậy', ma, '', 'bản ' + String(phienBan || 'mẫu').slice(0, 12));
  return sach_({ ok: true, nguoi: String(Q.me.hoTen || Q.me.ten || Q.me.tk), tk: Q.me.tk, maNV: Q.me.maNV || '', luc: luc });
}

/* Việc hôm nay của Giám đốc SX: số bản chờ duyệt */
function demCauHinhGayCho(token) {
  var Q = cgQuyen_(token); if (Q.loi) return Q.loi;
  var ds = cgDoc_().filter(function(r) { return r.TrangThai === 'Chờ duyệt'; }).map(function(r) { return { ma: r.MaDong, pb: r.PhienBan, nguoi: r.NguoiLuu, luc: r.ThoiDiemLuu }; });
  return sach_({ ok: true, quyen: Q.q, n: ds.length, ds: ds.slice(0, 10) });
}
