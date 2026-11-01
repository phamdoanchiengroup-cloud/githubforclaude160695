/**
 * GiaDinh.gs – Tab "👪 Gia đình": mỗi tài khoản lưu danh sách người nhà để mở nhanh lá số, xem quan hệ (qua Cặp đôi)
 * và bảng vận năm cả nhà. 1/11/2026: mở cho mọi thành viên đã đăng nhập (chủ dự án chốt); cột Phi Tinh chỉ chủ sở hữu thấy.
 * Lưu ở trang tính "GiaDinh" của Google Sheet dự án (mỗi tài khoản một dòng JSON).
 * Danh sách mặc định của chủ sở hữu (GD_MAC_DINH) – chủ dự án đồng ý đưa thông tin gia đình lên mã (1/11).
 * Giờ Tý muộn (23–24h) luôn tính sang ngày âm hôm sau (chủ dự án nhắc 1/11) – không tắt chuyển ngày để khớp trang khác.
 */
var GD_TOI_DA = 30;
var GD_QUAN_HE = ['Bản thân', 'Vợ', 'Chồng', 'Con trai', 'Con gái', 'Cha', 'Mẹ', 'Anh', 'Chị', 'Em trai', 'Em gái', 'Ông', 'Bà', 'Cháu', 'Họ hàng', 'Bạn bè', 'Khác'];
var GD_SH = ['Tài khoản', 'Danh sách (JSON)', 'Cập nhật'];
/** Gia đình chủ sở hữu – lấy từ 4 lá số Bắc phái trên tuvi.cohoc.net chủ dự án gửi (đã đối chiếu Mệnh/Cục/Lai Nhân khớp) */
var GD_MAC_DINH = [
  { ten: 'Phạm Doãn Chiến', quanHe: 'Bản thân', input: { name: 'Phạm Doãn Chiến', gender: 'nam', calendar: 'am', day: 19, month: 5, year: 1995, hour: 6, minute: 0 } },
  { ten: 'Vợ', quanHe: 'Vợ', input: { name: 'Vợ', gender: 'nu', calendar: 'am', day: 20, month: 9, year: 1997, hour: 2, minute: 0 } },
  { ten: 'Con gái', quanHe: 'Con gái', input: { name: 'Con gái', gender: 'nu', calendar: 'duong', day: 22, month: 8, year: 2023, hour: 23, minute: 30 } },   // giờ Tý muộn → sang ngày âm hôm sau (8/7 Quý Mão), chủ dự án xác nhận
  { ten: 'Em gái', quanHe: 'Em gái', input: { name: 'Em gái', gender: 'nu', calendar: 'am', day: 19, month: 7, year: 2001, hour: 2, minute: 0 } }
];

function gdSh_() {
  var ss = laySS_(), sh = ss.getSheetByName('GiaDinh');
  if (!sh) { sh = ss.insertSheet('GiaDinh'); sh.appendRow(GD_SH); sh.setFrozenRows(1); }
  return sh;
}
function gdDong_(sh, ten) {
  var n = sh.getLastRow(); if (n < 2) return 0;
  var f = sh.getRange(2, 1, n - 1, 1).createTextFinder(ten).matchEntireCell(true).findAll();
  return f.length ? f[0].getRow() : 0;
}
function gdDoc_(u) {
  var sh = gdSh_(), r = gdDong_(sh, u.ten);
  if (r) { try { var v = JSON.parse(sh.getRange(r, 2).getValue() || '[]'); if (Array.isArray(v)) return v; } catch (e) {} return []; }
  if (u.vaiTro === 'chu') return GD_MAC_DINH.map(gdChuan_);   // chủ sở hữu chưa lưu gì: dùng danh sách mặc định
  return [];
}
function gdGhi_(u, ds) {
  var sh = gdSh_(), r = gdDong_(sh, u.ten), v = [u.ten, JSON.stringify(ds), new Date()];
  if (r) sh.getRange(r, 1, 1, 3).setValues([v]); else sh.appendRow(v);
}
function gdChuan_(x, i) {
  var n = function (v, lo, hi) { v = parseInt(v, 10); return v >= lo && v <= hi ? v : null; };
  var inp = x && x.input || {};
  var o = {
    id: String(x && x.id || ('gd' + Date.now() + '_' + i)).slice(0, 40),
    ten: String(x && x.ten || inp.name || '').trim().slice(0, 60),
    quanHe: GD_QUAN_HE.indexOf(x && x.quanHe) >= 0 ? x.quanHe : 'Khác',
    input: { name: String(inp.name || x && x.ten || '').trim().slice(0, 60), gender: inp.gender === 'nu' ? 'nu' : 'nam', calendar: inp.calendar === 'am' ? 'am' : 'duong',
      day: n(inp.day, 1, 31), month: n(inp.month, 1, 12), year: n(inp.year, 1800, 2200), leap: inp.leap === true || inp.leap === 'true',
      hour: n(inp.hour, 0, 23) == null ? 0 : n(inp.hour, 0, 23), minute: n(inp.minute, 0, 59) == null ? 0 : n(inp.minute, 0, 59),
      lateRat: !(inp.lateRat === false || inp.lateRat === 'false'),
      place: String(inp.place || '').slice(0, 80), tz: inp.tz != null ? String(inp.tz).slice(0, 4) : '7' }
  };
  if (!o.input.day || !o.input.month || !o.input.year) throw new Error('Người thứ ' + (i + 1) + ' (' + (o.ten || 'chưa có tên') + ') thiếu ngày, tháng hoặc năm sinh.');
  if (!o.ten) o.ten = o.quanHe;
  return o;
}

/** Danh sách người nhà của tài khoản đang đăng nhập */
function giaDinhDs(token) { var u = tkCan_(token); return { ds: gdDoc_(u), quanHe: GD_QUAN_HE }; }

/** Lưu cả danh sách (thêm / sửa / xóa / sắp xếp làm ở giao diện rồi gửi lên một lần) */
function giaDinhLuu(ds, token) {
  var u = tkCan_(token);
  if (!Array.isArray(ds)) throw new Error('Danh sách không hợp lệ.');
  if (ds.length > GD_TOI_DA) throw new Error('Tối đa ' + GD_TOI_DA + ' người.');
  var sach = ds.map(gdChuan_);
  gdGhi_(u, sach);
  return { ds: sach };
}

/** Bảng vận năm cả nhà: mỗi người một dòng – tuổi, năm với tuổi, Bát Tự lưu niên (+ Phi Tinh lưu niên cho chủ sở hữu) */
function giaDinhVanNam(nam, token) {
  var u = tkCan_(token), chu = u.vaiTro === 'chu';
  nam = parseInt(nam, 10) || new Date().getFullYear();
  var chiNam = ((nam + 8) % 12 + 12) % 12;
  return { nam: nam, canChi: CAN[((nam + 6) % 10 + 10) % 10] + ' ' + CHI[chiNam], phiTinh: chu, ds: gdDoc_(u).map(function (p) {
    var o = { id: p.id, ten: p.ten, quanHe: p.quanHe };
    try {
      var inp = JSON.parse(JSON.stringify(p.input)); inp.viewYear = nam; inp.save = false;
      var tv = tuviLapLaSo(inp), I = tv.info;
      o.tuoi = nam - I.lunar.year + 1; o.conGiap = I.conGiap || ''; o.namSinh = I.namCanChi || '';
      var d = (chiNam - I.yChi + 12) % 12;   // quan hệ chi năm xem với chi tuổi
      o.thaiTue = d === 0 ? 'Trùng tuổi (năm tuổi)' : d === 6 ? 'Xung tuổi' : (d === 3 || d === 9) ? 'Hình tuổi' : (d === 4 || d === 8) ? 'Tam hợp' : '';
      if (chu && typeof ptLap_ === 'function') {
        var ln = ptLap_(tv, nam, 1).luuNien[0];
        o.phiTinh = { muc: ln.muc, menh: ln.menh, loi: (ln.de || [])[0] || '' };
      }
      var bt = batTuLap(inp);
      if (bt && bt.luuNien) o.batTu = { canChi: bt.luuNien.canChi, danhGia: bt.luuNien.danhGia, loi: (bt.luuNien.ghiChu || [])[0] || '' };
    } catch (e) { o.loi = String(e && e.message || e); }
    return o;
  }) };
}
