/**
 * GiaDinh.gs – Tab "👪 Gia đình" (1/11/2026, chỉ chủ sở hữu): danh sách lá số người nhà, bảng vận năm cả nhà.
 * Dữ liệu ngày giờ sinh lưu trong Script Properties của dự án Apps Script (khóa GD_KHOA), KHÔNG nằm trong mã / GitHub.
 * Luận quan hệ từng cặp dùng lại lapCapDoi (CapDoi.gs) ở giao diện.
 */
var GD_KHOA = 'TCC_GIA_DINH';
var GD_TOI_DA = 30;
var GD_QUAN_HE = ['Bản thân', 'Vợ', 'Chồng', 'Con trai', 'Con gái', 'Cha', 'Mẹ', 'Anh', 'Chị', 'Em trai', 'Em gái', 'Ông', 'Bà', 'Cháu', 'Họ hàng', 'Khác'];

function gdDoc_() {
  try { var v = JSON.parse(PropertiesService.getScriptProperties().getProperty(GD_KHOA) || '[]'); return Array.isArray(v) ? v : []; }
  catch (e) { return []; }
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
      place: String(inp.place || '').slice(0, 80), tz: inp.tz != null ? String(inp.tz).slice(0, 4) : '7' }
  };
  if (!o.input.day || !o.input.month || !o.input.year) throw new Error('Người thứ ' + (i + 1) + ' (' + (o.ten || 'chưa có tên') + ') thiếu ngày, tháng hoặc năm sinh.');
  if (!o.ten) o.ten = o.quanHe;
  return o;
}

/** Danh sách người nhà (chỉ chủ sở hữu) */
function giaDinhDs(token) { tkCan_(token, true); return { ds: gdDoc_(), quanHe: GD_QUAN_HE }; }

/** Lưu cả danh sách (thêm / sửa / xóa / sắp xếp làm ở giao diện rồi gửi lên một lần) */
function giaDinhLuu(ds, token) {
  tkCan_(token, true);
  if (!Array.isArray(ds)) throw new Error('Danh sách không hợp lệ.');
  if (ds.length > GD_TOI_DA) throw new Error('Tối đa ' + GD_TOI_DA + ' người.');
  var sach = ds.map(gdChuan_);
  PropertiesService.getScriptProperties().setProperty(GD_KHOA, JSON.stringify(sach));
  return { ds: sach };
}

/** Bảng vận năm cả nhà: mỗi người một dòng – tuổi, Thái Tuế, Phi Tinh lưu niên, Bát Tự lưu niên */
function giaDinhVanNam(nam, token) {
  tkCan_(token, true);
  nam = parseInt(nam, 10) || new Date().getFullYear();
  var chiNam = ((nam + 8) % 12 + 12) % 12;
  return { nam: nam, canChi: CAN[((nam + 6) % 10 + 10) % 10] + ' ' + CHI[chiNam], ds: gdDoc_().map(function (p) {
    var o = { id: p.id, ten: p.ten, quanHe: p.quanHe };
    try {
      var inp = JSON.parse(JSON.stringify(p.input)); inp.viewYear = nam; inp.save = false;
      var tv = tuviLapLaSo(inp), I = tv.info;
      o.tuoi = nam - I.lunar.year + 1; o.conGiap = I.conGiap || ''; o.namSinh = I.namCanChi || '';
      var d = (chiNam - I.yChi + 12) % 12;   // quan hệ chi năm xem với chi tuổi
      o.thaiTue = d === 0 ? 'Trùng tuổi (năm tuổi)' : d === 6 ? 'Xung tuổi' : (d === 3 || d === 9) ? 'Hình tuổi' : (d === 4 || d === 8) ? 'Tam hợp' : '';
      if (typeof ptLap_ === 'function') {
        var ln = ptLap_(tv, nam, 1).luuNien[0];
        o.phiTinh = { muc: ln.muc, menh: ln.menh, loi: (ln.de || [])[0] || '' };
      }
      var bt = batTuLap(inp);
      if (bt && bt.luuNien) o.batTu = { canChi: bt.luuNien.canChi, danhGia: bt.luuNien.danhGia };
    } catch (e) { o.loi = String(e && e.message || e); }
    return o;
  }) };
}
