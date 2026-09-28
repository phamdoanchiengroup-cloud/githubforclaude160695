/**
 * HỆ THỐNG KPI SẢN XUẤT — Code.gs (đăng nhập bằng tài khoản riêng)
 */

var HAN_PHIEN = 6 * 60 * 60; // phiên hết hạn sau 6 giờ (giới hạn tối đa của CacheService là 21600 giây = 6 giờ)

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Hệ thống KPI sản xuất')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
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
  var sh = ss_().getSheetByName(name);
  if (!sh) { __DOC_CACHE[name] = []; return []; }
  var v = sh.getDataRange().getValues();
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
  if (name) delete __DOC_CACHE[name]; else __DOC_CACHE = {};
}

function them_(name, obj) {
  var sh = ss_().getSheetByName(name);
  var head = dauCot_(name);
  sh.appendRow(head.map(function(h) { return obj[h] !== undefined ? obj[h] : ''; }));
  xoaCache_(name);
}

function themNhieu_(name, arr) {
  if (!arr.length) return;
  var sh = ss_().getSheetByName(name);
  var head = dauCot_(name);
  var rows = arr.map(function(o) {
    return head.map(function(h) { return o[h] !== undefined ? o[h] : ''; });
  });
  sh.getRange(sh.getLastRow() + 1, 1, rows.length, head.length).setValues(rows);
  xoaCache_(name);
}

/* Sửa một ô: KHÔNG ghi ngay mà đưa vào bộ đệm; cuối lượt gọi (sach_ -> xong_) ghi một lần theo khối. */
function suaO_(name, row, col, val) {
  var head = dauCot_(name);
  var i = head.indexOf(col);
  if (i < 0) return;
  var m = __CHO_GHI[name] || (__CHO_GHI[name] = {});
  (m[row] = m[row] || {})[i + 1] = val;
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
    o.setValue(String(val == null ? '' : val));
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
  return sachLoi_(v);
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

/* ===== MÃ HÓA MẬT KHẨU ===== */
var MUOI = 'KPI@SanXuat#2026$Muoi';

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
    maNV: tk.MaNV || '', hanDen: (new Date().getTime() + ttl * 1000)
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
      // Nạp lại vào cache cho lần sau nhanh hơn
      try { CacheService.getScriptCache().put('P_' + token, s, 21600); } catch (e) {}
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
  if (tk.MaNV && nvDaNghi_(tk.MaNV)) return null;          // hồ sơ đã chuyển Nghỉ việc
  o.phaiDoiMK = String(tk.DoiMatKhauLanDau).trim() === 'Có';
  if (o.phaiDoiMK && !choPhepChuaDoiMK) return null;
  // Lấy vai trò / xưởng MỚI NHẤT trong Sheet (đổi vai trò có hiệu lực ngay, không đợi đăng nhập lại)
  o.tk = tk.TenDangNhap; o.ten = tk.HoTen;
  o.vaiTro = String(tk.VaiTro).trim(); o.xuong = tk.MaXuong || '';

  o.tenXuong = o.xuong ? tenXuong_(o.xuong) : '';
  o.maNV = tk.MaNV || o.maNV || '';
  o.token = token;
  // Phó phòng (PP) có quyền tương đương trưởng phòng (TP).
  // Giữ vai trò gốc để hiển thị đúng danh xưng, nhưng xử lý quyền như TP.
  o.vaiTroGoc = o.vaiTro;
  if (o.vaiTro === 'PP') o.vaiTro = 'TP';
  // OWNER = chu so huu: co moi quyen ADMIN, cong them co laOwner cho cac chuc nang doc quyen.
  o.laOwner = (o.vaiTroGoc === 'OWNER');
  if (o.vaiTro === 'OWNER') o.vaiTro = 'ADMIN';
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
    var soSai = 0;
    try { soSai = Number(cache.get(khoaKey) || 0); } catch (e) {}
    if (soSai >= SO_LAN_SAI_TOI_DA)
      return sach_({ ok: false, msg: 'Nhập sai quá ' + SO_LAN_SAI_TOI_DA + ' lần. Tài khoản tạm khóa ' +
        PHUT_KHOA_DANG_NHAP + ' phút — thử lại sau, hoặc nhờ chủ sở hữu cấp lại mật khẩu.' });
    var baoSai = function() {
      try { cache.put(khoaKey, String(soSai + 1), PHUT_KHOA_DANG_NHAP * 60); } catch (e) {}
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
    if (chuan_(tk.MatKhauMaHoa) !== bam_(matKhau)) return baoSai();
    if (String(tk.TrangThai).trim() !== 'Đang dùng') return sach_({ ok: false, msg: 'Tài khoản đã bị ngừng sử dụng.' });
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
    return sach_({ ok: false, msg: 'Lỗi máy chủ: ' + (e.message || e) });
  }
}

function dangXuat(token) {
  if (token) {
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
  if (chuan_(tk.MatKhauMaHoa) !== bam_(cu)) return sach_({ ok: false, msg: 'Mật khẩu hiện tại không đúng.' });
  if (String(moi) === String(cu)) return sach_({ ok: false, msg: 'Mật khẩu mới phải khác mật khẩu cũ.' });

  ghiBam_(tk._row, bam_(moi));
  suaO_('TaiKhoan', tk._row, 'DoiMatKhauLanDau', 'Không');
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
function napDuLieu(token) { return napDuLieuLoi_(token, null); }

/* Các "phần" dữ liệu gửi về trình duyệt. Sau khi lưu, giao diện chỉ xin lại phần bị ảnh hưởng. */
var PHAN_NAP_ = { nk: 1, cc: 1, ns: 1, cd: 1, mm: 1, vp: 1, ts: 1, tb: 1, dm: 1 };
var COT_NK_GUI_ = ['MaDong', 'Ngay', 'MaNV', 'MaCD', 'MaMay', 'GioLam', 'SoLuongLamRa', 'GioDung', 'LyDoDung', 'GhiChu', 'TrangThai'];
function chonCot_(r, cot) { var o = {}; cot.forEach(function(k) { o[k] = r[k]; }); return o; }

function napDuLieuLoi_(token, phan) {
  try {
  var me = docPhien_(token, true);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn. Đăng nhập lại.' });
  if (me.phaiDoiMK) return sach_({ ok: false, phaiDoiMK: true, me: me, msg: 'Cần đổi mật khẩu lần đầu trước khi dùng hệ thống.' });
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
      congdoan.forEach(function(c) { if (c.MaXuong === me.xuong) mine[c.MaCD] = 1; });
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
    out.canNhapLai = (me.vaiTro === 'CN' ? doc_('NhatKySanXuat').filter(function(r) {
      return r.MaNV === me.maNV && String(r.TrangThai).trim() === 'Từ chối';
    }).map(function(r) { return { Ngay: ngayVN_(r.Ngay), MaCD: r.MaCD, LyDo: r.LyDoTuChoi || r.GhiChu || '' }; }) : []);
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
    var coBan = ['MaNV', 'HoTen', 'MaXuong', 'ChucDanh', 'TrangThai', 'NgayVaoLam', 'CongDoanLamDuoc', 'NamSinh', 'laTP'];
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
    out.dinhmuc = doc_('DinhMuc');
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
  return sach_(out);
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

  var cd = doc_('CongDoan');
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    if (Number(r.SoLuongLamRa) <= 0) return sach_({ ok: false, msg: 'Dòng ' + (i + 1) + ': chưa nhập số lượng.' });
    if (me.vaiTro === 'TP') {
      var c = cd.filter(function(x) { return x.MaCD === r.MaCD; })[0];
      if (!c || c.MaXuong !== me.xuong) return sach_({ ok: false, msg: 'Dòng ' + (i + 1) + ': công đoạn không thuộc xưởng của bạn.' });
    }
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
function congNhanGuiSanLuong(token, rows) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (me.vaiTro !== 'CN') return sach_({ ok: false, msg: 'Chỉ công nhân dùng chức năng này.' });
  if (!me.maNV) return sach_({ ok: false, msg: 'Tài khoản chưa gắn với mã nhân viên. Báo quản lý cấp lại.' });
  if (!rows || !rows.length) return sach_({ ok: false, msg: 'Chưa có dòng nào.' });
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

  var mk = bam_('123456');
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

    themDs.push([
      ten, mk, nv.HoTen, 'CN', nv.MaXuong || '', 'Đang dùng',
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
        LanDangNhapCuoi: d[7], NgayTao: d[8], MaNV: d[9]
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
  Logger.log('Đã tạo mới: ' + themDs.length + ' tài khoản công nhân (mật khẩu 123456)');
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
  if (doc_('NhanSu').filter(function(x) { return String(x.MaNV).toUpperCase() === maNV; })[0])
    return sach_({ ok: false, msg: 'Mã nhân viên ' + maNV + ' đã tồn tại.' });

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
  // Tên đăng nhập = mã NV viết thường; mật khẩu 123456; bắt buộc đổi lần đầu.
  var tkMsg = '';
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
        them_('TaiKhoan', {
          TenDangNhap: tenDN, MatKhauMaHoa: bam_('123456'), HoTen: o.HoTen,
          VaiTro: 'CN', MaXuong: xuong || '', TrangThai: 'Đang dùng',
          DoiMatKhauLanDau: 'Có', LanDangNhapCuoi: '', NgayTao: new Date(), MaNV: maNV
        });
        var moiTao = doc_('TaiKhoan').filter(function(x) {
          return String(x.TenDangNhap).toLowerCase() === tenDN;
        })[0];
        if (moiTao) ghiBam_(moiTao._row, bam_('123456'));
        ghiLog_(me, 'Tạo tài khoản (tự động)', tenDN + ' — CN (' + maNV + ')');
        tkMsg = ' Đã tạo tài khoản đăng nhập "' + tenDN + '" (mật khẩu 123456, bắt buộc đổi lần đầu).';
      }
    }
  } catch (e) {
    tkMsg = ' (Lưu hồ sơ xong nhưng tạo tài khoản lỗi: ' + (e.message || e) + '. Ban điều hành cấp tài khoản thủ công.)';
  }

  return sach_({ ok: true, msg: 'Đã lưu hồ sơ.' +
    (full ? '' : ' Phòng nhân sự sẽ bổ sung giấy tờ và hợp đồng.') + tkMsg });
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
  if (['ADMIN', 'HR', 'TP'].indexOf(me.vaiTro) < 0) return sach_({ ok: false, msg: 'Không có quyền.' });

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

  var nk = doc_('NhatKySanXuat')
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
    ghiChuVT = dongBoVaiTroTaiKhoan_(o.MaNV, o.ChucDanh);
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

function dongBoVaiTroTaiKhoan_(maNV, chucDanh) {
  if (!maNV) return '';
  var cd = String(chucDanh || '').toLowerCase();
  var vaiTroMoi = '';
  if (cd.indexOf('phó phòng') >= 0 || cd.indexOf('phó bộ phận') >= 0 || cd.indexOf('phó bp') >= 0) vaiTroMoi = 'PP';
  else if (cd.indexOf('trưởng phòng') >= 0 || cd.indexOf('trưởng bộ phận') >= 0 || cd.indexOf('quản đốc') >= 0) vaiTroMoi = 'TP';
  if (!vaiTroMoi) return '';   // chức danh không phải cấp quản lý -> không đụng tài khoản

  var tk = doc_('TaiKhoan').filter(function(x) { return String(x.MaNV) === String(maNV); })[0];
  if (!tk) return ' (Nhân viên chưa có tài khoản đăng nhập — chưa đổi được vai trò.)';
  if (String(tk.VaiTro) === vaiTroMoi) return '';   // đã đúng rồi

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

  // (d) Không nhắc CN nhập: -2/lượt CN bị phạt trễ trong xưởng
  (dt.phatTre || []).forEach(function(p){
    if (String(p.MaXuong) !== String(maXuong)) return;
    var ng = ngayVN_(p.Ngay);
    if (ng.slice(0,7) !== kyThang) return;
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
function layKPIQuanLyGoc_(token, kyThang) {
  var me = docPhien_(token);
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

/* Trigger: chạy mỗi ngày. Rà các ngày đã quá hạn, phạt CN chưa nhập. */
function chayPhatNhapTre() {
  taoSheetPhatTre_();
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
    if (String(nv.TrangThai).trim() === 'Nghỉ việc') return;
    if (maQL[String(nv.MaNV).trim()]) return;
    var ndh = (dt.idxNDH && dt.idxNDH[nv.MaNV]) ? dt.idxNDH[nv.MaNV] : [];
    ngays.forEach(function(ng){
      var key = nv.MaNV+'|'+ng;
      if (daPhat[key] || daNhap[key]) return;                  // đã phạt / đã nhập
      if (!xuongDD[nv.MaXuong+'|'+ng]) return;                 // xưởng không đi làm ngày đó
      if (laNgayLe_(ng, nv.MaXuong)) return;                   // ngày lễ / xưởng được miễn
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
      suaO_('DinhMuc', dm._row, 'HieuLucTu', ngayVN_(new Date()));
      suaO_('DinhMuc', dm._row, 'NguoiDuyet', me.ten);
      suaO_('DinhMuc', dm._row, 'GhiChu', dx.LyDo);
    } else {
      them_('DinhMuc', {
        MaCD: dx.MaCD, DinhMucGio: dx.DinhMucMoi, DonViTinh: dx.DonViTinh || 'cái/giờ',
        HieuLucTu: ngayVN_(new Date()), NguoiDuyet: me.ten, GhiChu: dx.LyDo
      });
    }
  }

  ghiLog_(me, dongY ? 'Duyệt định mức' : 'Từ chối định mức',
          dx.MaCD, dx.DinhMucCu, dx.DinhMucMoi);
  return sach_({ ok: true, msg: dongY ? 'Đã duyệt và cập nhật định mức.' : 'Đã từ chối đề xuất.' });
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
      suaO_('DinhMuc', dm._row, 'HieuLucTu', ngayVN_(new Date()));
      suaO_('DinhMuc', dm._row, 'NguoiDuyet', me.ten);
      suaO_('DinhMuc', dm._row, 'GhiChu', dx.LyDo);
    } else {
      them_('DinhMuc', {
        MaCD: dx.MaCD, DinhMucGio: dx.DinhMucMoi, DonViTinh: dx.DonViTinh || 'cái/giờ',
        HieuLucTu: ngayVN_(new Date()), NguoiDuyet: me.ten, GhiChu: dx.LyDo
      });
    }
    n++;
  });

  ghiLog_(me, 'Duyệt tất cả định mức', n + ' đề xuất', '', '');
  return sach_({ ok: true, msg: 'Đã duyệt tất cả ' + n + ' đề xuất và cập nhật định mức.' });
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
    suaO_('DinhMuc', dm._row, 'HieuLucTu', ngayVN_(new Date()));
    suaO_('DinhMuc', dm._row, 'NguoiDuyet', me.ten);
  } else {
    them_('DinhMuc', {
      MaCD: o.MaCD, DinhMucGio: Number(o.DinhMucGio), DonViTinh: o.DonViTinh || 'cái/giờ',
      HieuLucTu: ngayVN_(new Date()), NguoiDuyet: me.ten, GhiChu: 'Thêm mới'
    });
    ghiLog_(me, 'Thêm định mức', o.MaCD, '', o.DinhMucGio);
  }
  return sach_({ ok: true, msg: 'Đã lưu định mức.' });
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
      suaO_('DinhMuc', dmCu._row, 'HieuLucTu', ngayVN_(new Date()));
      suaO_('DinhMuc', dmCu._row, 'NguoiDuyet', me.ten);
      if (Number(dmCu.DinhMucGio) !== dmMoi) thayDoi.push('định mức: ' + dmCu.DinhMucGio + ' → ' + dmMoi + ' ' + dv);
    } else {
      them_('DinhMuc', {
        MaDM: ma_('DM'), MaCD: maCD, DinhMucGio: dmMoi, DonViTinh: dv,
        HieuLucTu: ngayVN_(new Date()), NguoiDuyet: me.ten
      });
      thayDoi.push('đặt định mức: ' + dmMoi + ' ' + dv);
    }
  }

  if (!thayDoi.length) return sach_({ ok: true, msg: 'Không có thay đổi nào.' });
  ghiLog_(me, 'Sửa công đoạn', maCD + ' — ' + thayDoi.join('; '));
  return sach_({ ok: true, msg: 'Đã cập nhật công đoạn (' + thayDoi.length + ' thay đổi).' });
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

  var mkTam = o.MatKhau && String(o.MatKhau).length >= 6 ? String(o.MatKhau) : '123456';

  // Vai trò CN (công nhân) và TP (trưởng phòng) gắn với một mã nhân viên có thật
  var maNV = '';
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
    TenDangNhap: tk, MatKhauMaHoa: bam_(mkTam), HoTen: o.HoTen,
    VaiTro: o.VaiTro, MaXuong: o.MaXuong || '', TrangThai: 'Đang dùng',
    DoiMatKhauLanDau: 'Có', LanDangNhapCuoi: '', NgayTao: new Date(), MaNV: maNV
  });
  var moiTao = doc_('TaiKhoan').filter(function(x) {
    return String(x.TenDangNhap).toLowerCase() === tk;
  })[0];
  if (moiTao) ghiBam_(moiTao._row, bam_(mkTam));
  ghiLog_(me, 'Tạo tài khoản', tk + ' — ' + o.VaiTro + (maNV ? ' (' + maNV + ')' : ''));
  return sach_({ ok: true, msg: 'Đã tạo tài khoản "' + tk + '". Mật khẩu tạm: ' + mkTam });
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

  // Mật khẩu tạm NGẪU NHIÊN 6 số (không dùng 123456 — ai cũng đoán được)
  var mkTam = String(Math.floor(100000 + Math.random() * 900000));
  ghiBam_(tk._row, bam_(mkTam));
  suaO_('TaiKhoan', tk._row, 'DoiMatKhauLanDau', 'Có');
  try { CacheService.getScriptCache().remove('SAI_' + String(tenDN).toLowerCase().trim()); } catch (e) {}
  ghiLog_(me, 'Cấp lại mật khẩu', tenDN);
  return sach_({ ok: true, mkTam: mkTam, msg: 'Mật khẩu tạm của "' + tenDN + '": ' + mkTam +
    '\nHãy báo riêng cho người này. Họ sẽ phải đổi mật khẩu ngay lần đăng nhập đầu.' });
}

/* ========================================================
   CÔNG CỤ CHẨN ĐOÁN
   Chạy trực tiếp trong Apps Script khi không đăng nhập được.
   Chọn tên hàm ở thanh trên cùng rồi bấm Chạy, xem kết quả
   ở phần "Nhật ký thực thi" phía dưới.
   ======================================================== */

/* Đặt lại mật khẩu TẤT CẢ tài khoản về 123456 */
function DAT_LAI_TAT_CA_MAT_KHAU() {
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

  var gc=0, sl=0, ng2=0, mauSo=0;
  Object.keys(ngayCong).forEach(function(ngayR){
    if (nghiDaiHanNgay(ngayR)) return;                 // nghỉ dài hạn -> bỏ qua
    var kyHieu = dt.idxCC ? (dt.idxCC[maNV+'|'+ngayR] || 'x') : kyHieuChamCong_(dt.diemdanh || [], maNV, ngayR);
    var gioMat = gioCoMat_(kyHieu);
    if (gioMat <= 0) return;                            // nghỉ cả ngày -> không tính
    mauSo += gioMat;                                    // ngày công -> luôn cộng giờ có mặt vào mẫu số
    var rs = theoNgay[ngayR] || [];                     // nếu rỗng: đi làm nhưng không khai -> SL 0
    rs.forEach(function(r){
      var d = dt.idxDM ? (dt.idxDM[r.MaCD] || 0) : dm_(r.MaCD, dt.dinhmuc);
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
    var ng = ngayVN_(v.Ngay);
    return (!ng || ng.slice(0,7) === kyThang);
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

function loaiKPI_(v) {
  if (v >= 100) return 'A+';
  if (v >= 90) return 'A';
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
  Object.keys(theoXuong).forEach(function(mx){ sapXepHang_(theoXuong[mx]); });

  var now = new Date();
  var rows = ketqua.map(function(o){
    return [ ky, o.MaNV, o.HoTen, o.MaXuong, r2_(o.sl), r2_(o.cl), r2_(o.tt), r2_(o.at),
             r2_(o.tong), loaiKPI_(o.tong), o.spl, r2_(o.gl), r2_(o.gd), o.hang, now, nguoiChot||'Hệ thống' ];
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
  var homNay = homNayVN_();
  var kyNay = homNay.slice(0, 7), kyCu = kyTruoc_(kyNay);
  var thuTu = 0;
  for (var s = kyNay + '-01'; s <= homNay; s = congNgay_(s, 1)) if (laNgayLamViec_(s)) thuTu++;
  if (!laNgayLamViec_(homNay) || thuTu < 3) return;
  if (thuTu > 3 && daChotChinhThuc_(kyCu)) return;
  var n = chotThangLoi_(kyCu, '', 'Tự động (ngày làm việc thứ 3)');
  try {
    var shLog = ss_().getSheetByName('NhatKyThaoTac');
    if (shLog) shLog.appendRow([new Date(),'HE_THONG','Chốt KPI tháng (tự động)','Kỳ '+kyCu+' — '+n+' người','','']);
  } catch(e){}
}

/* Chạy 1 lần để cài trigger: mỗi ngày 23h (giờ VN) kiểm tra, đến ngày làm việc thứ 3 sẽ chốt tháng trước. */
function CAI_TRIGGER_CHOT_THANG() {
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
  var ky = kyVN_();
  var n = chotThangLoi_(ky, '', NGUOI_CHOT_TAM);
  try {
    var shLog = ss_().getSheetByName('NhatKyThaoTac');
    if (shLog) shLog.appendRow([new Date(),'HE_THONG','Snapshot KPI (9h sáng)','Kỳ '+ky+' — '+n+' người','','']);
  } catch(e){}
  return n;
}

/* Chạy 1 lần trong trình soạn thảo để cài trigger 9h sáng mỗi ngày (giờ VN). */
function CAI_TRIGGER_SNAPSHOT_9H() {
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
  return nho_('layKPIKy', [kieu, giaTri, maXuong || ''], function() { return layKPIKyGoc_(token, kieu, giaTri, maXuong); });
}
function layKPIKyGoc_(token, kieu, giaTri, maXuong) {
  var me = docPhien_(token);
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
  Object.keys(theoXuong).forEach(function(mx){ sapXepHang_(theoXuong[mx]); });
  ds.forEach(function(o){ o.loai = loaiKPI_(o.tong); });

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
      TongKPI:r2_(k.tong), Loai:loaiKPI_(k.tong), TongSanLuong:k.spl
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
      var d = dm_(r.MaCD, dt.dinhmuc), nl = ngLoi_(r, dt.kcs), dat = Number(r.SoLuongLamRa)-nl;
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
  return sach_({ ok:true, ngay:ng, xuong: siSoTatCaXuongTinh_(ng) });
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
  return sach_({ ok:true, msg:'Đã đăng ký nghỉ dài hạn cho nhân sự ('+loai+', '+tuNgay+' → '+denNgay+').' });
}

/* Danh sách nghỉ dài hạn của xưởng (TP) hoặc tất cả (ADMIN). */
function layNghiDaiHan(token, maXuong){
  var me=docPhien_(token);
  if(!me) return sach_({ ok:false, hetHan:true, msg:'Phiên hết hạn.' });
  var xuongLoc=(me.vaiTro==='TP')?me.xuong:(maXuong||'');
  var ds=docAnToan_('NghiDaiHan').filter(function(r){
    return !xuongLoc || r.MaXuong===xuongLoc;
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
  sh.appendRow([
    ma_('TB'), new Date(), maXuong || '', 'TP', tieuDe || '', noiDung || '', 'Chưa', nguoiTao || ''
  ]);
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
  doc_('NhatKySanXuat').forEach(function(r) {
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
function phanTichDinhMucGoc_(token, kieu, giaTri) {
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
    var d = dt.idxDM[r.MaCD] || 0;
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
    suaO_('DinhMuc', dm._row, 'HieuLucTu', ngayVN_(new Date()));
    suaO_('DinhMuc', dm._row, 'NguoiDuyet', me.ten);
    suaO_('DinhMuc', dm._row, 'GhiChu', lyDo || 'BĐH sửa tại phân tích định mức');
  } else {
    them_('DinhMuc', {
      MaCD: maCD, DinhMucGio: moi, DonViTinh: donVi,
      HieuLucTu: ngayVN_(new Date()), NguoiDuyet: me.ten,
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

  return sach_({ ok:true, msg:'Đã cập nhật định mức "' + cd.TenCD + '": ' + cu + ' → ' + moi + ' ' + donVi + '.' });
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
      suaO_('DinhMuc', dm._row, 'HieuLucTu', ngayVN_(new Date()));
      suaO_('DinhMuc', dm._row, 'NguoiDuyet', me.ten);
      suaO_('DinhMuc', dm._row, 'GhiChu', lyDoChung);
    } else {
      them_('DinhMuc', {
        MaCD: maCD, DinhMucGio: moi, DonViTinh: donVi,
        HieuLucTu: ngayVN_(new Date()), NguoiDuyet: me.ten, GhiChu: lyDoChung
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
  return sach_({ ok:true, soSua:soSua, boQua:boQua, chiTiet:chiTiet, msg:msg });
}
/* ===== DỌN TOKEN PHIÊN HẾT HẠN =====
   Quét toàn bộ ScriptProperties có tiền tố "P_" — token phiên đăng nhập.
   Xóa những token đã quá hạn (hanDen < hiện tại) hoặc JSON hỏng.
   Chạy tự động 2h sáng mỗi ngày để không phình bộ nhớ.
   ============================================ */
function donTokenHetHan() {
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
  tangPhienBan_();
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
  if (__KHOA && !__DA_TANG_PB) { tangPhienBan_(); __DA_TANG_PB = true; }
}
var __DA_TANG_PB = false;

/* ---------- 2) PHIÊN BẢN DỮ LIỆU + BỘ NHỚ TẠM ---------- */
var __PB = null;
function phienBan_() {
  if (__PB === null) {
    try { __PB = PropertiesService.getScriptProperties().getProperty('KPI_PB') || '0'; } catch (e) { __PB = '0'; }
  }
  return __PB;
}
function tangPhienBan_() {
  __PB = new Date().getTime() + '.' + Math.floor(Math.random() * 1e6);
  try { PropertiesService.getScriptProperties().setProperty('KPI_PB', __PB); } catch (e) {}
}
var NHO_GIAY = 600;          // nhớ kết quả tính 10 phút
var NHO_KHOI = 90000;        // CacheService giới hạn 100KB mỗi khóa -> cắt khối 90KB

/* Trả kết quả đã nhớ nếu còn; nếu không thì tính bằng fn(), nhớ lại (chỉ nhớ kết quả ok). */
function nho_(ten, thamSo, fn) {
  var khoa = '';
  try {
    var raw = ten + '|' + JSON.stringify(thamSo) + '|' + phienBan_() + '|' + homNayVN_() + (gioVN_() >= 17 ? 'c' : 's');
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
  'HieuLucTu', 'BaoTriKeTiep', 'KyApDung', 'Ky'];
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
  if (can.length < 2) return;
  try {
    var gop = docGopApi_(can);
    can.forEach(function(t) { __DOC_CACHE[t] = bangThanhDoiTuong_(gop[t] || []); });
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
  'NghiDaiHan', 'YeuCauSuaHoSo', 'ThongBao', 'NgayLe', 'MienTruDiemDanh', 'KPIThang', 'PhatNhapTre', 'MienTruKPIQuanLy'];

/* CHẠY TAY: so từng ô giữa cách đọc cũ (getValues) và Sheets API. Khớp hết -> bật đọc gộp. */
function KIEM_TRA_SHEETS_API() {
  if (typeof Sheets === 'undefined') {
    Logger.log('Chưa bật dịch vụ Google Sheets API. Vào Dịch vụ (+) -> Google Sheets API -> Thêm, rồi chạy lại.');
    return;
  }
  var ten = SHEET_NAP_.filter(function(t) { return ss_().getSheetByName(t); });
  var gop = docGopApi_(ten), lech = 0, vd = [];
  ten.forEach(function(t) {
    var a = ss_().getSheetByName(t).getDataRange().getValues(), b = gop[t] || [];
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
  var p = PropertiesService.getScriptProperties();
  if (lech === 0) { p.setProperty('KPI_SHEETS_API', '1'); Logger.log('KHỚP toàn bộ ' + ten.length + ' trang tính. ĐÃ BẬT đọc gộp bằng Sheets API.'); }
  else { p.setProperty('KPI_SHEETS_API', '0'); Logger.log('Có ' + lech + ' ô lệch -> CHƯA bật. Ví dụ:\n' + vd.join('\n')); }
}
function TAT_SHEETS_API() { PropertiesService.getScriptProperties().setProperty('KPI_SHEETS_API', '0'); Logger.log('Đã tắt đọc gộp.'); }

/* ---------- 4) LƯU TRỮ NHẬT KÝ CŨ ----------
   Chuyển các dòng NhatKySanXuat của những tháng ĐÃ CHỐT CHÍNH THỨC và cũ hơn SO_THANG_GIU tháng
   sang trang tính NhatKySanXuat_LuuTru. Bảng KPI tháng cũ đọc bản chốt nên không đổi;
   các phép tính cần tháng cũ (KPI quản lý, lịch sử) tự đọc thêm trang lưu trữ. */
var SO_THANG_GIU = 3;
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
  ScriptApp.getProjectTriggers().forEach(function(t) { if (t.getHandlerFunction() === 'LUU_TRU_NHAT_KY') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('LUU_TRU_NHAT_KY').timeBased().onMonthDay(5).atHour(2).inTimezone(TZ_VN).create();
  Logger.log('Đã cài trigger lưu trữ nhật ký: ngày 5 hằng tháng, 2h sáng.');
}

/* ---------- NẠP THEO PHẦN (tải lại nhẹ sau khi lưu) ----------
   Giao diện gọi napPhan(token, ['nk','cc',...]) thay vì napDuLieu -> chỉ đọc và gửi phần đã đổi. */
function napPhan(token, phan) {
  return napDuLieuLoi_(token, phan && phan.length ? phan : null);
}
