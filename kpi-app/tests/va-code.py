# -*- coding: utf-8 -*-
"""Vá Code.gs (bản gốc trong kpi-app/goc/) -> kpi-app/Code.gs.
Mỗi lần thay đều kiểm tra chuỗi gốc xuất hiện đúng số lần mong đợi, sai là dừng."""
import io, os, re, sys

GOC = os.path.join(os.path.dirname(__file__), '..', 'goc', 'Code.gs')
RA = os.path.join(os.path.dirname(__file__), '..', 'Code.gs')
s = io.open(GOC, encoding='utf-8').read()


def R(old, new, n=1):
    global s
    c = s.count(old)
    if c != n:
        sys.exit('KHÔNG KHỚP (%d lần, cần %d):\n%s' % (c, n, old[:200]))
    s = s.replace(old, new)


def VUNG(dau, cuoi, new):
    """Thay đoạn từ `dau` (gồm) tới `cuoi` (không gồm)."""
    global s
    i = s.find(dau)
    j = s.find(cuoi, i + 1)
    if i < 0 or j < 0 or s.count(dau) != 1:
        sys.exit('KHÔNG THẤY VÙNG: ' + dau[:80])
    s = s[:i] + new + s[j:]


# ---------------------------------------------------------------- tiện ích chung
R("""var __SS_CACHE = null;
var __DOC_CACHE = {};
""", """var __SS_CACHE = null;
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
  if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(s)) return 'Ngày "' + s + '" không hợp lệ.';
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
    if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(ng)) return;
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
""")

R("""function them_(name, obj) {
  var sh = ss_().getSheetByName(name);
  var head = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];""",
  """function them_(name, obj) {
  var sh = ss_().getSheetByName(name);
  var head = dauCot_(name);""")
R("""  if (!arr.length) return;
  var sh = ss_().getSheetByName(name);
  var head = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];""",
  """  if (!arr.length) return;
  var sh = ss_().getSheetByName(name);
  var head = dauCot_(name);""")
R("""function suaO_(name, row, col, val) {
  var sh = ss_().getSheetByName(name);
  var head = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];""",
  """function suaO_(name, row, col, val) {
  var sh = ss_().getSheetByName(name);
  var head = dauCot_(name);""")
R("""function suaOText_(name, row, col, val) {
  var sh = ss_().getSheetByName(name);
  var head = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];""",
  """function suaOText_(name, row, col, val) {
  var sh = ss_().getSheetByName(name);
  var head = dauCot_(name);""")

R("""function ma_(p) {""", """/* Xóa nhiều dòng một lượt (từ dưới lên, gom các dòng liền nhau). rows = số dòng trong sheet. */
function xoaNhieuDong_(name, rows) {
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

function ma_(p) {""")

# ---------------------------------------------------------------- mật khẩu, phiên, đăng nhập
R("""function ghiBam_(row, hash) {
  var sh = ss_().getSheetByName('TaiKhoan');
  var head = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];""",
  """function ghiBam_(row, hash) {
  var sh = ss_().getSheetByName('TaiKhoan');
  var head = dauCot_('TaiKhoan');""")

R("""function docPhien_(token) {
  if (!token) return null;
  var s = docChuoiPhien_(token);
  if (!s) return null;
  var o = JSON.parse(s);

  // Kiểm tra lại quyền trong Sheet — phòng trường hợp bị ngừng quyền giữa phiên
  var tk = doc_('TaiKhoan').filter(function(x) {
    return String(x.TenDangNhap).toLowerCase() === String(o.tk).toLowerCase();
  })[0];
  if (!tk || String(tk.TrangThai).trim() !== 'Đang dùng') return null;
""", """/* choPhepChuaDoiMK = true: vẫn trả phiên khi người dùng chưa đổi mật khẩu lần đầu
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
""")

VUNG("function dangNhap(tenDN, matKhau) {", "function dangXuat(token) {", """/* Nhân viên có hồ sơ ở trạng thái Nghỉ việc? */
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

""")

R("""function doiMatKhau(token, cu, moi) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (!moi || String(moi).length < 6) return sach_({ ok: false, msg: 'Mật khẩu mới phải từ 6 ký tự trở lên.' });
""", """/* Mật khẩu quá dễ đoán — không cho đặt */
var MK_YEU_ = ['123456', '1234567', '12345678', '123456789', '1234567890', '111111', '000000', '888888',
  '666666', '123123', '654321', 'abc123', 'abcdef', 'password', 'matkhau', 'qwerty'];

function doiMatKhau(token, cu, moi) {
  var me = docPhien_(token, true);
  if (!me) return sach_({ ok: false, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  if (!moi || String(moi).length < 6) return sach_({ ok: false, msg: 'Mật khẩu mới phải từ 6 ký tự trở lên.' });
  var moiThuong = String(moi).toLowerCase();
  if (MK_YEU_.indexOf(moiThuong) >= 0 || /^(.)\\1+$/.test(moiThuong))
    return sach_({ ok: false, msg: 'Mật khẩu này quá dễ đoán. Chọn mật khẩu khác (nên có cả chữ và số).' });
  if (moiThuong === String(me.tk).toLowerCase() || moiThuong === String(me.maNV || '').toLowerCase())
    return sach_({ ok: false, msg: 'Không dùng tên đăng nhập / mã nhân viên làm mật khẩu.' });
""")

# ---------------------------------------------------------------- nạp dữ liệu
R("""  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn. Đăng nhập lại.' });
""", """  var me = docPhien_(token, true);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn. Đăng nhập lại.' });
  if (me.phaiDoiMK) return sach_({ ok: false, phaiDoiMK: true, me: me, msg: 'Cần đổi mật khẩu lần đầu trước khi dùng hệ thống.' });
""")
R("""  kcs = kcs.map(function(r) { r.Ngay = ngayVN_(r.Ngay); return r; });
""", """  kcs = kcs.map(function(r) { r.Ngay = ngayVN_(r.Ngay); return r; });

  // GIẢM TẢI: chỉ gửi về trình duyệt dữ liệu từ đầu tháng trước (dòng Chờ duyệt thì gửi hết).
  // Bảng KPI, lịch sử KPI, chấm công theo tháng vẫn do máy chủ tính trên toàn bộ dữ liệu.
  var tuNgay = mocGuiVe_();
  if (tuNgay) {
    nhatkyTat = nhatkyTat.filter(function(r) { return r.Ngay >= tuNgay || String(r.TrangThai).trim() === 'Chờ duyệt'; });
    kcs = kcs.filter(function(r) { return r.Ngay >= tuNgay; });
  }
  var sauMoc = function(arr) {
    return tuNgay ? arr.filter(function(r) { return ngayVN_(r.Ngay) >= tuNgay; }) : arr;
  };
""")
R("""  var trongso = ts.length ? ts[ts.length - 1]
    : { KyApDung: '', SanLuong: 40, ChatLuong: 30, TuanThu: 15, AnToan: 15, TranKPI: 120, TyTrongTo: 70 };""",
  """  var trongso = trongSoKy_(ts, kyVN_());   // trọng số áp cho THÁNG NÀY""")
R("""    chamcong: (ss_().getSheetByName('DiemDanhNghi') ? doc_('DiemDanhNghi') : []),
    xacNhanDD: (ss_().getSheetByName('XacNhanDiemDanh') ? docAnToan_('XacNhanDiemDanh') : []),""",
  """    chamcong: sauMoc(ss_().getSheetByName('DiemDanhNghi') ? doc_('DiemDanhNghi') : []),
    xacNhanDD: sauMoc(ss_().getSheetByName('XacNhanDiemDanh') ? docAnToan_('XacNhanDiemDanh') : []),
    ngayLe: Object.keys(bangNgayLe_()),""")
R("""    log: me.laOwner ? doc_('NhatKyThaoTac').slice(-80).reverse() : [],""",
  """    log: me.laOwner ? docCuoi_('NhatKyThaoTac', 80).reverse() : [],""")
R("""/* Đọc sheet an toàn: nếu sheet chưa tồn tại""", """/* Gửi về trình duyệt dữ liệu của N tháng gần nhất (tháng này + tháng trước). Đặt 0 = gửi hết như cũ. */
var SO_THANG_GUI_VE = 2;
function mocGuiVe_() {
  if (!SO_THANG_GUI_VE) return '';
  var p = kyVN_().split('-'), y = Number(p[0]), m = Number(p[1]) - (SO_THANG_GUI_VE - 1);
  while (m < 1) { m += 12; y--; }
  return y + '-' + ('0' + m).slice(-2) + '-01';
}

/* Đọc sheet an toàn: nếu sheet chưa tồn tại""")

# ---------------------------------------------------------------- nhập sản lượng: khóa + kiểm tra ngày
R("""  if (me.vaiTro !== 'TP' && me.vaiTro !== 'ADMIN') return sach_({ ok: false, msg: 'Không có quyền nhập nhật ký.' });
""", """  if (me.vaiTro !== 'TP' && me.vaiTro !== 'ADMIN') return sach_({ ok: false, msg: 'Không có quyền nhập nhật ký.' });
  khoa_();
  for (var iN = 0; rows && iN < rows.length; iN++) {
    var loiN = kiemNgay_(rows[iN].Ngay, 62);
    if (loiN) return sach_({ ok: false, msg: 'Dòng ' + (iN + 1) + ': ' + loiN });
  }
""")
R("""  if (!me.maNV) return sach_({ ok: false, msg: 'Tài khoản chưa gắn với mã nhân viên. Báo quản lý cấp lại.' });
  if (!rows || !rows.length) return sach_({ ok: false, msg: 'Chưa có dòng nào.' });
""", """  if (!me.maNV) return sach_({ ok: false, msg: 'Tài khoản chưa gắn với mã nhân viên. Báo quản lý cấp lại.' });
  if (!rows || !rows.length) return sach_({ ok: false, msg: 'Chưa có dòng nào.' });
  khoa_();
  var loiNgay = kiemNgay_(rows[0].Ngay, 31);
  if (loiNgay) return sach_({ ok: false, msg: loiNgay });
  for (var iN = 1; iN < rows.length; iN++) {
    if (String(rows[iN].Ngay) !== String(rows[0].Ngay)) return sach_({ ok: false, msg: 'Mỗi lần gửi chỉ cho một ngày.' });
  }
""")

# ---------------------------------------------------------------- khóa cho các chức năng ghi còn lại
GHI = ['duyetSanLuong', 'duyetNhomNguoi', 'tuChoiNhieu', 'xoaDongChoDuyet', 'duyetSanLuongNhieu',
       'ghiViPham', 'xoaViPham', 'xoaViPhamNhieu', 'luuKCS', 'luuNhanSu', 'luuKyNang', 'ganCongDoanChoNhieu',
       'suaNhanSu', 'congNhanGuiSuaHoSo', 'duyetSuaHoSo', 'duyetTatCaSuaHoSo', 'mienTruKPINhieu',
       'boMienTruKPINhieu', 'luuMay', 'doiTinhTrangMay', 'thanhLyMay', 'guiDeXuat', 'duyetDeXuat',
       'duyetTatCaDeXuat', 'luuDinhMuc', 'luuCongDoan', 'suaCongDoan', 'doiTrangThaiCongDoan', 'doiCachCham',
       'luuTrongSo', 'taoTaiKhoan', 'doiTrangThaiTK', 'capLaiMatKhau', 'dangKyNghiDaiHan', 'xoaNghiDaiHan',
       'donChamTayTrungNDH', 'banDieuHanhTuChoi', 'banDieuHanhTuChoiNhieu', 'danhDauDaDoc',
       'banDieuHanhSuaDinhMuc', 'banDieuHanhSuaDinhMucNhieu']
for ten in GHI:
    m = re.search(r'function ' + ten + r'\(', s)
    if not m or len(re.findall(r'function ' + ten + r'\(', s)) != 1:
        sys.exit('Không thấy hàm ' + ten)
    k = re.compile(r'\n(\s*)if\s*\(\s*!me\s*\)[^\n]*\n').search(s, m.end())
    if not k or k.start() - m.end() > 200:
        sys.exit('Không thấy dòng kiểm tra phiên trong ' + ten)
    s = s[:k.end()] + k.group(1) + 'khoa_();\n' + s[k.end():]

# ---------------------------------------------------------------- kiểm tra ngày ở các chỗ khác
R("""  if (!o.MaVP) return sach_({ ok: false, msg: 'Chưa chọn loại vi phạm.' });
""", """  if (!o.MaVP) return sach_({ ok: false, msg: 'Chưa chọn loại vi phạm.' });
  if (o.Ngay) { var loiNgay = kiemNgay_(o.Ngay, 62); if (loiNgay) return sach_({ ok: false, msg: loiNgay }); }
""")
R("""  if (Number(o.SoLuongKhongDat) <= 0) return sach_({ ok: false, msg: 'Chưa nhập số lượng không đạt.' });
""", """  if (Number(o.SoLuongKhongDat) <= 0) return sach_({ ok: false, msg: 'Chưa nhập số lượng không đạt.' });
  var loiNgay = kiemNgay_(o.Ngay, 62);
  if (loiNgay) return sach_({ ok: false, msg: loiNgay });
""")
R("""  if(String(tuNgay) > String(denNgay)) return sach_({ ok:false, msg:'Từ ngày phải trước hoặc bằng đến ngày.' });
""", """  if(!/^\\d{4}-\\d{2}-\\d{2}$/.test(String(tuNgay)) || !/^\\d{4}-\\d{2}-\\d{2}$/.test(String(denNgay)))
    return sach_({ ok:false, msg:'Ngày không hợp lệ.' });
  if(String(tuNgay) > String(denNgay)) return sach_({ ok:false, msg:'Từ ngày phải trước hoặc bằng đến ngày.' });
""")

# ---------------------------------------------------------------- quyền xem hồ sơ / lịch sử KPI / thông báo
R("""function hoSoNhanVien(token, maNV) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
""", """function hoSoNhanVien(token, maNV) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  // Hồ sơ có SĐT, địa chỉ, CCCD: chỉ ban điều hành, nhân sự, trưởng/phó phòng (trong xưởng) xem được.
  // Công nhân chỉ xem hồ sơ của chính mình.
  if (me.vaiTro === 'CN' && String(maNV) !== String(me.maNV))
    return sach_({ ok: false, msg: 'Bạn chỉ xem được hồ sơ của chính mình.' });
  if (['ADMIN', 'HR', 'TP', 'CN'].indexOf(me.vaiTro) < 0)
    return sach_({ ok: false, msg: 'Không có quyền xem hồ sơ nhân sự.' });
""")
R("""function layLichSuKPI(token, maNV) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok:false, hetHan:true, msg:'Phiên hết hạn.' });
""", """function layLichSuKPI(token, maNV) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok:false, hetHan:true, msg:'Phiên hết hạn.' });
  // Công nhân / trưởng phòng: chỉ xem chi tiết KPI của người trong xưởng mình
  if ((me.vaiTro === 'CN' || me.vaiTro === 'TP') && String(maNV) !== String(me.maNV)) {
    var nvXem = nhanSuGomTP_().filter(function(x){ return x.MaNV === maNV; })[0];
    if (!nvXem || String(nvXem.MaXuong) !== String(me.xuong))
      return sach_({ ok:false, msg:'Chỉ xem được chi tiết KPI của người trong xưởng mình.' });
  }
""")
R("""  if (!t) return sach_({ ok: false, msg: 'Không tìm thấy thông báo.' });
""", """  if (!t) return sach_({ ok: false, msg: 'Không tìm thấy thông báo.' });
  if (me.vaiTro !== 'ADMIN' && !(me.vaiTro === 'TP' && String(t.MaXuong) === String(me.xuong)))
    return sach_({ ok: false, msg: 'Không có quyền.' });
""")

# ---------------------------------------------------------------- sửa hồ sơ: chặn tự nâng quyền, nghỉ việc thì ngừng tài khoản
R("""    // Đổi xưởng: chỉ ADMIN được phép
    if (k === 'MaXuong') {""", """    // Chỉ ban điều hành / nhân sự được đổi chức danh liên quan cấp quản lý (tránh tự nâng quyền tài khoản)
    if (k === 'ChucDanh' && !full && (laChucDanhQL_(o[k]) || laChucDanhQL_(nv.ChucDanh))) return;
    // Đổi xưởng: chỉ ADMIN được phép
    if (k === 'MaXuong') {""")
R("""  if (!doi.length) return sach_({ ok: true, msg: 'Không có thay đổi nào.' });

  // Nếu đổi chức danh""", """  if (!doi.length) return sach_({ ok: true, msg: 'Không có thay đổi nào.' });

  // Chuyển "Nghỉ việc" -> ngừng luôn tài khoản đăng nhập của người này
  var ghiChuTK = '';
  if (doi.indexOf('TrangThai') >= 0 && String(o.TrangThai).trim() === 'Nghỉ việc') {
    var nNgung = ngungTKTheoMaNV_(nv.MaNV);
    if (nNgung) ghiChuTK = ' Đã ngừng ' + nNgung + ' tài khoản đăng nhập của người này.';
  }

  // Nếu đổi chức danh""")
R("""  ghiLog_(me, 'Sửa hồ sơ nhân sự', o.MaNV + ' — ' + doi.join(', '));
  return sach_({ ok: true, msg: 'Đã cập nhật ' + doi.length + ' thông tin.' + ghiChuVT });
}
""", """  ghiLog_(me, 'Sửa hồ sơ nhân sự', o.MaNV + ' — ' + doi.join(', '));
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
""")

# ---------------------------------------------------------------- cấp lại mật khẩu: mật khẩu tạm ngẫu nhiên
R("""  ghiBam_(tk._row, bam_('123456'));
  suaO_('TaiKhoan', tk._row, 'DoiMatKhauLanDau', 'Có');
  ghiLog_(me, 'Cấp lại mật khẩu', tenDN);
  return sach_({ ok: true, msg: 'Đã cấp lại mật khẩu cho "' + tenDN + '" về 123456. Người này phải đổi ngay khi đăng nhập.' });""",
  """  // Mật khẩu tạm NGẪU NHIÊN 6 số (không dùng 123456 — ai cũng đoán được)
  var mkTam = String(Math.floor(100000 + Math.random() * 900000));
  ghiBam_(tk._row, bam_(mkTam));
  suaO_('TaiKhoan', tk._row, 'DoiMatKhauLanDau', 'Có');
  try { CacheService.getScriptCache().remove('SAI_' + String(tenDN).toLowerCase().trim()); } catch (e) {}
  ghiLog_(me, 'Cấp lại mật khẩu', tenDN);
  return sach_({ ok: true, mkTam: mkTam, msg: 'Mật khẩu tạm của "' + tenDN + '": ' + mkTam +
    '\\nHãy báo riêng cho người này. Họ sẽ phải đổi mật khẩu ngay lần đăng nhập đầu.' });""")
R("""    if (cDoi > 0) sh.getRange(i, cDoi).setValue('Không');""", """    if (cDoi > 0) sh.getRange(i, cDoi).setValue('Có');   // bắt buộc đổi lại khi đăng nhập""")
R("""function TAO_LAI_TAI_KHOAN() {
  var ss = ss_();
  var sh = ss.getSheetByName('TaiKhoan');
  if (!sh) sh = ss.insertSheet('TaiKhoan');
""", """function TAO_LAI_TAI_KHOAN() {
  var ss = ss_();
  var sh = ss.getSheetByName('TaiKhoan');
  // AN TOÀN: hàm này XÓA SẠCH sheet TaiKhoan. Không cho chạy khi đã có dữ liệu thật.
  if (sh && sh.getLastRow() > 8) {
    Logger.log('DỪNG: sheet TaiKhoan đang có ' + (sh.getLastRow() - 1) + ' tài khoản. Hàm này sẽ xóa hết nên không chạy.');
    return;
  }
  if (!sh) sh = ss.insertSheet('TaiKhoan');
""")
R("""    ['giamdoc', mk, 'Giám đốc',            'ADMIN', '',    'Đang dùng', 'Không', '', now],
    ['phogd1',  mk, 'Phó giám đốc 1',      'ADMIN', '',    'Đang dùng', 'Không', '', now],
    ['phogd2',  mk, 'Phó giám đốc 2',      'ADMIN', '',    'Đang dùng', 'Không', '', now],
    ['tpson',   mk, 'Trưởng phòng Sơn',    'TP',    'SON', 'Đang dùng', 'Không', '', now],
    ['tpcnc',   mk, 'Trưởng phòng CNC',    'TP',    'CNC', 'Đang dùng', 'Không', '', now],
    ['nhansu',  mk, 'Phòng nhân sự',       'HR',    '',    'Đang dùng', 'Không', '', now],
    ['kcs',     mk, 'Kiểm soát chất lượng','QC',    '',    'Đang dùng', 'Không', '', now]""",
  """    ['giamdoc', mk, 'Giám đốc',            'ADMIN', '',    'Đang dùng', 'Có', '', now],
    ['phogd1',  mk, 'Phó giám đốc 1',      'ADMIN', '',    'Đang dùng', 'Có', '', now],
    ['phogd2',  mk, 'Phó giám đốc 2',      'ADMIN', '',    'Đang dùng', 'Có', '', now],
    ['tpson',   mk, 'Trưởng phòng Sơn',    'TP',    'SON', 'Đang dùng', 'Có', '', now],
    ['tpcnc',   mk, 'Trưởng phòng CNC',    'TP',    'CNC', 'Đang dùng', 'Có', '', now],
    ['nhansu',  mk, 'Phòng nhân sự',       'HR',    '',    'Đang dùng', 'Có', '', now],
    ['kcs',     mk, 'Kiểm soát chất lượng','QC',    '',    'Đang dùng', 'Có', '', now]""")

# ---------------------------------------------------------------- ngày làm việc có tính ngày lễ
VUNG("function themNgayLamViec_(ngayStr, n) {", "/* Lấy họ tên nhân viên từ mã", """function themNgayLamViec_(ngayStr, n) {
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

""")

# ---------------------------------------------------------------- KPI quản lý
R("""  var nsXuong = dt.nhansu.filter(function(x){
    return x.MaXuong === maXuong && String(x.TrangThai).trim() !== 'Nghỉ việc';
  });
  var tongHS = 0, tongTL = 0, dem = 0;
  nsXuong.forEach(function(nv){
    var k = kpiThang_(nv.MaNV, kyThang, dt);""", """  dt.maQL = dt.maQL || mapQuanLy_();
  var nsXuong = dt.nhansu.filter(function(x){
    return x.MaXuong === maXuong && String(x.TrangThai).trim() !== 'Nghỉ việc' && !dt.maQL[String(x.MaNV).trim()];
  });
  var tongHS = 0, tongTL = 0, dem = 0;
  nsXuong.forEach(function(nv){
    var k = kpiThangNho_(nv.MaNV, kyThang, dt);""")
R("""  var homNay = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
  var gioHienTai = new Date().getHours();
  var motChotDD = (gioHienTai >= 17) ? homNay : Utilities.formatDate(new Date(Date.now()-86400000),'Asia/Ho_Chi_Minh','yyyy-MM-dd');
  var ngayLV = [];
  (function(){
    var d = new Date(kyThang + '-01T00:00:00');
    var thang = kyThang;
    while (Utilities.formatDate(d,'Asia/Ho_Chi_Minh','yyyy-MM')===thang) {
      var s = Utilities.formatDate(d,'Asia/Ho_Chi_Minh','yyyy-MM-dd');
      if (s > motChotDD) break;                       // chỉ xét ngày đã kết thúc (hoặc hôm nay nếu đã qua 17h)
      if (d.getDay() !== 0) ngayLV.push(s);
      d.setDate(d.getDate()+1);
    }
  })();""", """  var homNay = homNayVN_();
  var motChotDD = (gioVN_() >= 17) ? homNay : congNgay_(homNay, -1);
  var ngayLV = [];
  for (var s = kyThang + '-01'; s.slice(0, 7) === kyThang && s <= motChotDD; s = congNgay_(s, 1)) {
    // Chỉ xét ngày đã kết thúc; bỏ Chủ nhật, ngày lễ và ngày xưởng được miễn điểm danh
    if (laNgayLamViec_(s, maXuong)) ngayLV.push(s);
  }""")
R("""    try { gio = new Date(td).getHours() + new Date(td).getMinutes()/60; } catch(e){}""",
  """    try { gio = Number(Utilities.formatDate(new Date(td), TZ_VN, 'H')) + Number(Utilities.formatDate(new Date(td), TZ_VN, 'm'))/60; } catch(e){}""")
R("""  var ds = tks.map(function(a){
    var nv = dt.nhansu.filter(function(x){ return x.MaNV === a.MaNV; })[0];
    if (!nv) return null;
    // nhật ký của xưởng này (để tính duyệt trễ / duyệt ẩu)
    dt.nhatkyXuong = nkTat.filter(function(r){
      var cd = dt.congdoan.filter(function(c){ return c.MaCD === r.MaCD; })[0];
      return cd && String(cd.MaXuong) === String(nv.MaXuong);
    });""", """  // Gom nhật ký theo xưởng MỘT lần (trước đây lọc lại cho từng người -> chậm)
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
    dt.nhatkyXuong = nkTheoXuong[String(nv.MaXuong)] || [];""")
R("""  kyThang = kyThang || Utilities.formatDate(new Date(),'Asia/Ho_Chi_Minh','yyyy-MM');

  // Chuẩn bị dữ liệu dùng chung""", """  kyThang = kyThang || kyVN_();

  // Chuẩn bị dữ liệu dùng chung""")

# ---------------------------------------------------------------- phạt nhập trễ: ghi một lượt, có mã ghi, bỏ ngày lễ
VUNG("function chayPhatNhapTre() {", "/* ===== CHẨN ĐOÁN 1 NGƯỜI", """function chayPhatNhapTre() {
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

""")
R("""  ScriptApp.newTrigger('chayPhatNhapTre').timeBased().atHour(18).everyDays(1)
    .inTimezone('Asia/Ho_Chi_Minh').create();""", """  ScriptApp.newTrigger('chayPhatNhapTre').timeBased().atHour(18).everyDays(1)
    .inTimezone(TZ_VN).create();""")

# ---------------------------------------------------------------- trọng số theo kỳ
R("""    trongso: (function(){
      var ts = doc_('TrongSoKPI');
      return ts.length ? ts[ts.length-1]
        : { SanLuong:40, ChatLuong:30, TuanThu:15, AnToan:15, TranKPI:120 };
    })()
  };""", """    dsTrongSo: doc_('TrongSoKPI'),
    trongso: trongSoKy_(doc_('TrongSoKPI'), kyVN_())
  };""")
R("""  var t = dt.trongso;
  // Hiệu suất sản lượng""", """  var t = trongSoKy_(dt.dsTrongSo, kyThang, dt.trongso);   // trọng số của ĐÚNG tháng đang tính
  // Hiệu suất sản lượng""")
R("""  var t = dt.trongso;
  var theoNgay = Object.keys(byday).sort().reverse().map(function(day){
    var b = byday[day];""", """  var theoNgay = Object.keys(byday).sort().reverse().map(function(day){
    var b = byday[day];
    var t = trongSoKy_(dt.dsTrongSo, day.slice(0,7), dt.trongso);""")
R("""function loaiKPI_(v) {""", """/* ===== TRỌNG SỐ THEO KỲ =====
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

function loaiKPI_(v) {""")
R("""  var t = Number(o.SanLuong) + Number(o.ChatLuong) + Number(o.TuanThu) + Number(o.AnToan);""",
  """  if (!/^\\d{4}-\\d{2}$/.test(String(o.KyApDung || ''))) return sach_({ ok: false, msg: 'Kỳ áp dụng phải dạng năm-tháng, VD 2026-10.' });
  var t = Number(o.SanLuong) + Number(o.ChatLuong) + Number(o.TuanThu) + Number(o.AnToan);""")

# ---------------------------------------------------------------- chốt tháng
R("""  var ky = kyThang || ((function(){ var d=new Date(); return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2); })());""",
  """  var ky = kyThang || kyVN_();
  if (!/^\\d{4}-\\d{2}$/.test(String(ky))) return sach_({ ok:false, msg:'Kỳ không hợp lệ (cần dạng năm-tháng).' });""")
VUNG("function chotThangLoi_(ky, xuongLoc, nguoiChot) {", "/* Lấy bảng KPI theo kỳ:", """function chotThangLoi_(ky, xuongLoc, nguoiChot) {
  var dt = docDuLieuKPI_();

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

""")
R("""  var thangHienTai = (function(){ var d=new Date(); return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2); })();""",
  """  var thangHienTai = kyVN_();""")
R("""      snap = laySnapshotThang_(thg, xuongLoc);
      // Tháng đã qua nhưng chưa từng chốt -> vẫn tính trực tiếp để không bỏ trống
      if (!snap.length) { snap = tinhThangTrucTiep_(thg, xuongLoc); tamTinh = true; }""", """      snap = laySnapshotThang_(thg, xuongLoc);
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
      }""")
R("""  var all = doc_('KPIThang').filter(function(r){
    return chuanKy_(r.Ky) === thgChuan && (!xuongLoc || r.MaXuong === xuongLoc);
  });
  return all;""", """  var maQL = mapQuanLy_();   // bỏ trưởng/phó phòng lọt vào các bản chốt cũ
  var all = doc_('KPIThang').filter(function(r){
    return chuanKy_(r.Ky) === thgChuan && (!xuongLoc || r.MaXuong === xuongLoc) && !maQL[String(r.MaNV).trim()];
  });
  return all;""")
R("""    var snap = laySnapshotThang_(thg, '').filter(function(o){ return o.MaNV === maNV; })[0];
    if (snap) return {""", """    var snap = laySnapshotThang_(thg, '').filter(function(o){ return o.MaNV === maNV; })[0];
    if (snap && !laChotTam_(snap)) return {""")
for pat in ["  var ky = kyThang || (function(){ var d=new Date(); return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2); })();"]:
    R(pat, "  var ky = kyThang || kyVN_();", 3)

# ---------------------------------------------------------------- điểm danh
R("""    if (head.indexOf('KyHieu') < 0){ sh.insertColumnBefore(chen); sh.getRange(1, chen).setValue('KyHieu'); }
  }""", """    if (head.indexOf('KyHieu') < 0){ sh.insertColumnBefore(chen); sh.getRange(1, chen).setValue('KyHieu'); }
    delete __HEAD_CACHE['DiemDanhNghi']; xoaCache_('DiemDanhNghi');
  }""")
VUNG("function luuDiemDanh(token, ngay, nghi) {", "/* Sheet ghi xác nhận", """function luuDiemDanh(token, ngay, nghi) {
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

""")
VUNG("function luuLichThang(token, ky, rows){", "/* Thống kê + lịch tháng.", """function luuLichThang(token, ky, rows){
  var me = docPhien_(token);
  if (!me) return sach_({ ok:false, hetHan:true, msg:'Phiên hết hạn.' });
  if (me.vaiTro !== 'TP') return sach_({ ok:false, msg:'Chỉ trưởng phòng được chấm lịch.' });
  ky = String(ky || '');
  if (!/^\\d{4}-\\d{2}$/.test(ky)) return sach_({ ok:false, msg:'Thiếu hoặc sai tháng.' });
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
    if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(ng) || ng.slice(0, 7) !== ky || congNgay_(ng, 0) !== ng)
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

""")
R("""  canXoa.sort(function(a,b){ return b._row - a._row; }).forEach(function(r){ xoaDong_('DiemDanhNghi', r._row); });""",
  """  xoaNhieuDong_('DiemDanhNghi', canXoa.map(function(r){ return r._row; }));""")
R("""  if (l.indexOf('ốm') >= 0 || l.indexOf('om') >= 0) return 'Nkl';  // ốm dài -> Nkl
  if (l.indexOf('gia đình') >= 0) return 'Nkl';                    // việc gia đình -> Nkl""",
  """  if (l.indexOf('ốm') >= 0 || l.indexOf('om') >= 0) return 'Nkl';  // ốm dài -> Nkl
  if (l.indexOf('bệnh') >= 0 || l.indexOf('viện') >= 0) return 'Nkl'; // nghỉ bệnh, nằm viện -> như ốm
  if (l.indexOf('gia đình') >= 0 || /(^|\\s)gđ(\\s|$)/.test(l)) return 'Nkl';   // việc gia đình / "cv gđ" -> Nkl""")

# ---------------------------------------------------------------- ghi cột mới: bỏ nhớ tiêu đề
R("""    sh.getRange(1, idx + 1).setValue(colName).setFontWeight('bold')
      .setBackground('#12313a').setFontColor('#ffffff');
  }""", """    sh.getRange(1, idx + 1).setValue(colName).setFontWeight('bold')
      .setBackground('#12313a').setFontColor('#ffffff');
    delete __HEAD_CACHE[sheetName];
  }""")

# ================================================================= TĂNG TỐC (29/09/2026)
# Bộ đệm ghi
R("""function doc_(name) {
  if (__DOC_CACHE.hasOwnProperty(name)) return __DOC_CACHE[name];""", """function doc_(name) {
  if (__CHO_GHI[name]) xaGhi_(name);                 // còn ô chờ ghi của sheet này -> ghi trước rồi mới đọc
  if (__DOC_CACHE.hasOwnProperty(name)) return __DOC_CACHE[name];""")
R("""function suaO_(name, row, col, val) {
  var sh = ss_().getSheetByName(name);
  var head = dauCot_(name);
  var i = head.indexOf(col);
  if (i >= 0) sh.getRange(row, i + 1).setValue(val);
  xoaCache_(name);
}""", """/* Sửa một ô: KHÔNG ghi ngay mà đưa vào bộ đệm; cuối lượt gọi (sach_ -> xong_) ghi một lần theo khối. */
function suaO_(name, row, col, val) {
  var head = dauCot_(name);
  var i = head.indexOf(col);
  if (i < 0) return;
  var m = __CHO_GHI[name] || (__CHO_GHI[name] = {});
  (m[row] = m[row] || {})[i + 1] = val;
  xoaCache_(name);
}""")
R("""function suaOText_(name, row, col, val) {
  var sh = ss_().getSheetByName(name);""", """function suaOText_(name, row, col, val) {
  xaGhi_(name);
  var sh = ss_().getSheetByName(name);""")
R("""function xoaDong_(name, row) {
  var sh = ss_().getSheetByName(name);""", """function xoaDong_(name, row) {
  xaGhi_(name);                                       // ghi hết trước khi xóa dòng (xóa làm lệch số dòng)
  var sh = ss_().getSheetByName(name);""")
R("""function xoaNhieuDong_(name, rows) {
  var sh = ss_().getSheetByName(name);""", """function xoaNhieuDong_(name, rows) {
  xaGhi_(name);
  var sh = ss_().getSheetByName(name);""")
R("""    if (head.indexOf('Cong') < 0){ sh.insertColumnBefore(chen); sh.getRange(1, chen).setValue('Cong'); }""",
  """    xaGhi_('DiemDanhNghi');
    if (head.indexOf('Cong') < 0){ sh.insertColumnBefore(chen); sh.getRange(1, chen).setValue('Cong'); }""")
R("""  var head = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  var idx = head.indexOf(colName);
  if (idx < 0) {
    // thêm cột mới ở cuối
    idx = head.length;
    sh.getRange(1, idx + 1).setValue(colName).setFontWeight('bold')
      .setBackground('#12313a').setFontColor('#ffffff');
    delete __HEAD_CACHE[sheetName];
  }
  sh.getRange(row, idx + 1).setValue(val);
  xoaCache_(sheetName);""", """  var head = dauCot_(sheetName);
  if (head.indexOf(colName) < 0) {
    // thêm cột mới ở cuối
    sh.getRange(1, head.length + 1).setValue(colName).setFontWeight('bold')
      .setBackground('#12313a').setFontColor('#ffffff');
    delete __HEAD_CACHE[sheetName];
  }
  suaO_(sheetName, row, colName, val);                // vào bộ đệm ghi như các ô khác""")
# xoaCache_: ghi nhớ sheet đã đổi trong lượt gọi
R("""function xoaCache_(name) {
  if (name) delete __DOC_CACHE[name]; else __DOC_CACHE = {};""", """function xoaCache_(name) {
  __DA_GHI[name || '*'] = 1;                          // sheet đã đổi -> báo giao diện tải lại đúng phần
  if (name) delete __DOC_CACHE[name]; else __DOC_CACHE = {};""")
# sach_: ghi bộ đệm trước khi trả kết quả
R("""function sach_(v) {
  if (v === null || v === undefined) return '';""", """function sach_(v) {
  xong_();                                            // cuối lượt: ghi bộ đệm, tăng phiên bản dữ liệu nếu có ghi
  ganPhanDoi_(v);                                     // báo giao diện phần dữ liệu nào vừa đổi
  return sachLoi_(v);
}
function sachLoi_(v) {
  if (v === null || v === undefined) return '';""")
R("""    return v.map(function(x) { return sach_(x); });""", """    return v.map(function(x) { return sachLoi_(x); });""")
R("""      o[k] = sach_(v[k]);""", """      o[k] = sachLoi_(v[k]);""")

# Nạp theo phần + bớt dữ liệu gửi về
VUNG("function napDuLieu(token) {", "/* Gửi về trình duyệt dữ liệu của N tháng", """function napDuLieu(token) { return napDuLieuLoi_(token, null); }

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

""")

# Bộ nhớ tạm cho các hàm tính nặng: đổi tên hàm gốc, thêm hàm bọc
for goc, bao in [
  ("function layKPIKy(token, kieu, giaTri, maXuong) {", """function layKPIKy(token, kieu, giaTri, maXuong) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok:false, hetHan:true, msg:'Phiên hết hạn.' });
  return nho_('layKPIKy', [kieu, giaTri, maXuong || ''], function() { return layKPIKyGoc_(token, kieu, giaTri, maXuong); });
}
function layKPIKyGoc_(token, kieu, giaTri, maXuong) {"""),
  ("function layKPIQuanLy(token, kyThang) {", """function layKPIQuanLy(token, kyThang) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok:false, hetHan:true, msg:'Phiên đăng nhập đã hết hạn.' });
  return nho_('layKPIQuanLy', [kyThang || kyVN_(), me.vaiTro, me.xuong, me.laOwner], function() { return layKPIQuanLyGoc_(token, kyThang); });
}
function layKPIQuanLyGoc_(token, kyThang) {"""),
  ("function thongKeNghiThang(token, kyThang, maXuong) {", """function thongKeNghiThang(token, kyThang, maXuong) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok:false, hetHan:true, msg:'Phiên hết hạn.' });
  return nho_('thongKeNghiThang', [kyThang || kyVN_(), maXuong || '', me.vaiTro, me.xuong], function() { return thongKeNghiThangGoc_(token, kyThang, maXuong); });
}
function thongKeNghiThangGoc_(token, kyThang, maXuong) {"""),
  ("function phanTichDinhMuc(token, kieu, giaTri) {", """function phanTichDinhMuc(token, kieu, giaTri) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok:false, hetHan:true, msg:'Phiên đăng nhập đã hết hạn.' });
  return nho_('phanTichDinhMuc', [kieu, giaTri, me.vaiTro, me.xuong, me.laOwner], function() { return phanTichDinhMucGoc_(token, kieu, giaTri); });
}
function phanTichDinhMucGoc_(token, kieu, giaTri) {"""),
  ("function layLichSuKPI(token, maNV) {", """function layLichSuKPI(token, maNV) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok:false, hetHan:true, msg:'Phiên hết hạn.' });
  return nho_('layLichSuKPI', [maNV, me.vaiTro, me.xuong, me.maNV], function() { return layLichSuKPIGoc_(token, maNV); });
}
function layLichSuKPIGoc_(token, maNV) {"""),
]:
    R(goc, bao)

# Đọc thêm trang lưu trữ khi cần tháng cũ; nạp gộp trước
R("""function docDuLieuKPI_() {
  var dt = {
    nhatky: doc_('NhatKySanXuat'),""", """function docDuLieuKPI_(canLuuTru) {
  napTruoc_(SHEET_NAP_);
  var dt = {
    nhatky: (canLuuTru && ss_().getSheetByName(TEN_LUU_TRU)) ? doc_(TEN_LUU_TRU).concat(doc_('NhatKySanXuat')) : doc_('NhatKySanXuat'),""")
R("""  // Chuẩn bị dữ liệu dùng chung
  var dt = docDuLieuKPI_();""", """  // Chuẩn bị dữ liệu dùng chung
  var dt = docDuLieuKPI_(canLuuTru_([kyThang]));""")
R("""  var nkTat = doc_('NhatKySanXuat');""", """  var nkTat = dt.nhatky;""")
R("""function chotThangLoi_(ky, xuongLoc, nguoiChot) {
  var dt = docDuLieuKPI_();""", """function chotThangLoi_(ky, xuongLoc, nguoiChot) {
  var dt = docDuLieuKPI_(canLuuTru_([ky]));""")
R("""function tinhThangTrucTiep_(thg, xuongLoc) {
  var dt = docDuLieuKPI_();""", """function tinhThangTrucTiep_(thg, xuongLoc) {
  var dt = docDuLieuKPI_(canLuuTru_([thg]));""")
R("""  var dt = docDuLieuKPI_();
  // Tất cả tháng có nhật ký đã chốt của người này""", """  var dt = docDuLieuKPI_(canLuuTru_(['']));
  // Tất cả tháng có nhật ký đã chốt của người này""")
R("""  var dt = docDuLieuKPI_();
  var congdoan = doc_('CongDoan');
  var dinhmuc = doc_('DinhMuc');""", """  var dt = docDuLieuKPI_(canLuuTru_(thangCanLay));
  var congdoan = doc_('CongDoan');
  var dinhmuc = doc_('DinhMuc');""")
# Trigger / hàm dài: ghi bộ đệm + tăng phiên bản ở cuối
R("""  xoaCache_('KPIThang');   // làm mới cache để bảng KPI đọc được snapshot vừa ghi""",
  """  xoaCache_('KPIThang');   // làm mới cache để bảng KPI đọc được snapshot vừa ghi
  xong_();""")
R("""  Logger.log('Đã phạt nhập trễ: ' + phatMoi.length + ' lượt.');""", """  xong_();
  Logger.log('Đã phạt nhập trễ: ' + phatMoi.length + ' lượt.');""")
R("""  Logger.log('Đã dọn: '+soPhat+' dòng PhatNhapTre, '+soVP+' vi phạm NHAPTRE của TP/PP.');""",
  """  tangPhienBan_();
  Logger.log('Đã dọn: '+soPhat+' dòng PhatNhapTre, '+soVP+' vi phạm NHAPTRE của TP/PP.');""")

# Sau khi chốt tháng tự động: tạo báo cáo PDF, lưu Drive, gửi email (lỗi gửi báo cáo không được làm hỏng việc chốt)
R("""  var n = chotThangLoi_(kyCu, '', 'Tự động (ngày làm việc thứ 3)');""", """  var n = chotThangLoi_(kyCu, '', 'Tự động (ngày làm việc thứ 3)');
  try { guiBaoCaoThang_(kyCu); } catch (e) { Logger.log('Gửi báo cáo tháng lỗi: ' + e); }""")

# ---------------------------------------------------------------- hàm chạy tay một lần
s = s.rstrip() + '\n' + io.open(os.path.join(os.path.dirname(__file__), 'ham-chay-tay.gs'), encoding='utf-8').read()
s = s.rstrip() + '\n' + io.open(os.path.join(os.path.dirname(__file__), 'toc-do.gs'), encoding='utf-8').read()
s = s.rstrip() + '\n' + io.open(os.path.join(os.path.dirname(__file__), 'bao-cao.gs'), encoding='utf-8').read()

io.open(RA, 'w', encoding='utf-8').write(s)
print('OK ->', os.path.abspath(RA))
