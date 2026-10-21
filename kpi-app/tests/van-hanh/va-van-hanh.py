# -*- coding: utf-8 -*-
"""Vá Code.gs – các mục tư vấn vận hành / KPI / động viên / hội nhập (chủ dự án duyệt 18/10; danh sách kpi-app/TU-VAN-VAN-HANH.md).
Chạy bằng exec() ở cuối tests/va-code.py, SAU va-bao-mat.py; dùng chung R() và s. Kiểm thử: tests/van-hanh.js."""

# ======================================================================= A1. ĐỊNH MỨC THEO NGÀY ÁP DỤNG
# Khi đổi định mức (mọi chỗ đều sửa ô DinhMucGio), giá trị cũ được lưu vào sheet LichSuDinhMuc (đến hết hôm qua).
# KPI tính mỗi dòng nhật ký theo định mức ĐANG ÁP DỤNG ngày đó -> duyệt định mức mới giữa tháng không làm đổi
# phần đầu tháng, chốt lại tháng cũ ra đúng như cũ.
R("""function suaO_(name, row, col, val) {
  var head = dauCot_(name);""", """function suaO_(name, row, col, val) {
  if (name === 'DinhMuc' && col === 'DinhMucGio') luuLichSuDM_(row, val);
  var head = dauCot_(name);""")
R("""function dm_(maCD, dinhmuc) {""", """/* ===== LỊCH SỬ ĐỊNH MỨC (18/10) ===== */
var LSDM_SHEET = 'LichSuDinhMuc', LSDM_COT = ['MaCD', 'DinhMucGio', 'TuNgay', 'DenNgay', 'ThoiDiem'];
function luuLichSuDM_(row, moi) {
  try {
    var cu = doc_('DinhMuc').filter(function(x) { return x._row === row; })[0];
    if (!cu || soVN_(cu.DinhMucGio) === soVN_(moi) || !(soVN_(cu.DinhMucGio) > 0)) return;
    var homQua = congNgay_(homNayVN_(), -1), tu = cu.HieuLucTu ? ngayVN_(cu.HieuLucTu) : '';
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

function dm_(maCD, dinhmuc) {""")
R("""  dt.idxDM = {};
  dt.dinhmuc.forEach(function(x){ dt.idxDM[x.MaCD] = soVN_(x.DinhMucGio); });""", """  dt.idxDM = {};
  dt.dinhmuc.forEach(function(x){ dt.idxDM[x.MaCD] = soVN_(x.DinhMucGio); });
  // Định mức cũ đã thay (A1, 18/10): MaCD -> [{tu, den, gio}] xếp theo ngày kết thúc
  dt.lsDM = {};
  (ss_().getSheetByName(LSDM_SHEET) ? doc_(LSDM_SHEET) : []).forEach(function(x){
    var den = ngayVN_(x.DenNgay); if (!den) return;
    (dt.lsDM[x.MaCD] = dt.lsDM[x.MaCD] || []).push({ tu: x.TuNgay ? ngayVN_(x.TuNgay) : '', den: den, gio: soVN_(x.DinhMucGio) });
  });
  Object.keys(dt.lsDM).forEach(function(k){ dt.lsDM[k].sort(function(a, b){ return a.den < b.den ? -1 : 1; }); });""")
# kpiThang_: định mức theo ngày
R("""      var d = dt.idxDM ? (dt.idxDM[r.MaCD] || 0) : dm_(r.MaCD, dt.dinhmuc);
      var n = dt.idxLoi ? (dt.idxLoi[maNV+'|'+ngayR+'|'+r.MaCD] || 0) : ngLoi_(r, dt.kcs);
      var dat = Number(r.SoLuongLamRa) - n;""", """      var d = dmNgay_(dt, r.MaCD, ngayR);
      var n = dt.idxLoi ? (dt.idxLoi[maNV+'|'+ngayR+'|'+r.MaCD] || 0) : ngLoi_(r, dt.kcs);
      var dat = Number(r.SoLuongLamRa) - n;""")
R("""      var d = dm_(r.MaCD, dt.dinhmuc), nl = ngLoi_(r, dt.kcs), dat = Number(r.SoLuongLamRa)-nl;""",
  """      var d = dmNgay_(dt, r.MaCD, day), nl = ngLoi_(r, dt.kcs), dat = Number(r.SoLuongLamRa)-nl;""")
R("""    var d = dt.idxDM[r.MaCD] || 0;
    if (d <= 0) return;                        // chưa có định mức -> bỏ""", """    var d = dmNgay_(dt, r.MaCD, ng);
    if (d <= 0) return;                        // chưa có định mức -> bỏ""")
R("""      var sl = Number(r.SoLuongLamRa) || 0, d = dt.idxDM[r.MaCD] || 0, gio = soVN_(r.GioLam) || 0;""",
  """      var sl = Number(r.SoLuongLamRa) || 0, d = dmNgay_(dt, r.MaCD, ng), gio = soVN_(r.GioLam) || 0;""")

# ======================================================================= A2. VI PHẠM KHÔNG GHI NGÀY: TÍNH THEO NGÀY GHI, KHÔNG TRỪ LẶP MỖI THÁNG
R("""  var vpThang = vpNguoi.filter(function(v){
    var ng = ngayVN_(v.Ngay);
    return (!ng || ng.slice(0,7) === kyThang);
  });""", """  var vpThang = vpNguoi.filter(function(v){
    var ng = ngayVN_(v.Ngay) || ngayVN_(v.ThoiDiemGhi);   // A2 (18/10): thiếu ngày thì lấy ngày ghi, không trừ lặp mọi tháng
    return !!ng && ng.slice(0,7) === kyThang;
  });""")

# ======================================================================= A4. KHI DUYỆT: LƯU SỐ GỐC NẾU TP SỬA
R("""    if (slLamRa !== Number(r.SoLuongLamRa)) suaO_('NhatKySanXuat', r._row, 'SoLuongLamRa', slLamRa);
    if (gioLam !== Number(r.GioLam)) suaO_('NhatKySanXuat', r._row, 'GioLam', gioLam);""", """    if (slLamRa !== Number(r.SoLuongLamRa) || soLoi !== tach.soLoi)   // A4: lưu số công nhân khai trước khi TP sửa (soát khâu duyệt)
      ghiCotNeuCo_('NhatKySanXuat', r._row, 'SLGoc', Number(r.SoLuongLamRa) + '/' + tach.soLoi);
    if (slLamRa !== Number(r.SoLuongLamRa)) suaO_('NhatKySanXuat', r._row, 'SoLuongLamRa', slLamRa);
    if (gioLam !== Number(r.GioLam)) suaO_('NhatKySanXuat', r._row, 'GioLam', gioLam);""", 2)
# ======================================================================= A4 + A6. BẢNG SOÁT KHÂU DUYỆT + ĐỊNH MỨC LỆCH (ban điều hành, trợ lý)
s = s.rstrip() + '\n' + io.open(os.path.join(os.path.dirname(__file__), 'van-hanh', 'van-hanh.gs'), encoding='utf-8').read()

# ======================================================================= D2 + D3. HỌC VIỆC 1 THÁNG (chủ dự án 18/10)
# Tính từ NgayVaoLam: không bị phạt nhập trễ; tháng có quá nửa thời gian học việc thì KPI ghi "Học việc", không xếp hạng.
R("""function loaiKPI_(v) {""", """/* ===== HỌC VIỆC (18/10): HOC_VIEC_THANG tháng kể từ ngày vào làm ===== */
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

function loaiKPI_(v) {""")
# chốt tháng
R("""  Object.keys(theoXuong).forEach(function(mx){ sapXepHang_(theoXuong[mx]); });

  var now = new Date();
  var rows = ketqua.map(function(o){
    return [ ky, o.MaNV, o.HoTen, o.MaXuong, r2_(o.sl), r2_(o.cl), r2_(o.tt), r2_(o.at),
             r2_(o.tong), loaiKPI_(o.tong),""", """  Object.keys(theoXuong).forEach(function(mx){ sapXepHangHV_(theoXuong[mx], ky); });

  var now = new Date();
  var rows = ketqua.map(function(o){
    return [ ky, o.MaNV, o.HoTen, o.MaXuong, r2_(o.sl), r2_(o.cl), r2_(o.tt), r2_(o.at),
             r2_(o.tong), loaiCo_(o.MaNV, ky, o.tong),""")
# bảng KPI theo kỳ
R("""  Object.keys(theoXuong).forEach(function(mx){ sapXepHang_(theoXuong[mx]); });
  ds.forEach(function(o){ o.loai = loaiKPI_(o.tong); });""", """  var kyCuoi = thangCanLay[thangCanLay.length - 1] || kyVN_();
  Object.keys(theoXuong).forEach(function(mx){ sapXepHangHV_(theoXuong[mx], kyCuoi); });
  ds.forEach(function(o){ o.loai = loaiCo_(o.MaNV, kyCuoi, o.tong); o.hocViec = laHocViecThang_(o.MaNV, kyCuoi); });""")
R("""      TongKPI:r2_(k.tong), Loai:loaiKPI_(k.tong), TongSanLuong:k.spl""", """      TongKPI:r2_(k.tong), Loai:loaiCo_(x.MaNV, thg, k.tong), TongSanLuong:k.spl""")
R("""  out.forEach(function(o){ o.loai = loaiKPI_(o.tong); (theoXuong[o.MaXuong] = theoXuong[o.MaXuong] || []).push(o); });
  Object.keys(theoXuong).forEach(function(mx){ sapXepHang_(theoXuong[mx]); });""", """  out.forEach(function(o){ o.loai = loaiCo_(o.MaNV, ky, o.tong); (theoXuong[o.MaXuong] = theoXuong[o.MaXuong] || []).push(o); });
  Object.keys(theoXuong).forEach(function(mx){ sapXepHangHV_(theoXuong[mx], ky); });""")
# phạt nhập trễ: bỏ những ngày còn học việc
R("""      if (laNgayLe_(ng, nv.MaXuong)) return;                   // ngày lễ / xưởng được miễn""", """      if (laNgayLe_(ng, nv.MaXuong)) return;                   // ngày lễ / xưởng được miễn
      if (dangHocViec_(nv.MaNV, ng)) return;                   // đang học việc (tháng đầu): không phạt (chủ dự án 18/10)""")

# D5: gửi mức kỹ năng cùng hồ sơ cơ bản (TP / công nhân cùng xưởng xem được)
R("""    var coBan = ['MaNV', 'HoTen', 'MaXuong', 'ChucDanh', 'TrangThai', 'NgayVaoLam', 'CongDoanLamDuoc', 'NamSinh', 'laTP'];""",
  """    var coBan = ['MaNV', 'HoTen', 'MaXuong', 'ChucDanh', 'TrangThai', 'NgayVaoLam', 'CongDoanLamDuoc', 'MucKyNang', 'NamSinh', 'laTP'];""")

# D3: báo cáo tháng có thêm nhóm "Học việc" (không xếp loại)
R("""var BC_LOAI = ['A+','A','B','C','D'];
var BC_MAU_LOAI = { 'A+':'#1e7f5c', 'A':'#3aa57a', 'B':'#d29b2a', 'C':'#e07b39', 'D':'#c0392b' };""", """var BC_LOAI = ['A+','A','B','C','D','Học việc'];
var BC_MAU_LOAI = { 'A+':'#1e7f5c', 'A':'#3aa57a', 'B':'#d29b2a', 'C':'#e07b39', 'D':'#c0392b', 'Học việc':'#7d868c' };""")

# A1: gửi lịch sử định mức về trình duyệt (KPI tạm tính trên web khớp máy chủ)
R("""    out.dinhmuc = doc_('DinhMuc');""", """    out.dinhmuc = doc_('DinhMuc');
    out.lsDM = ss_().getSheetByName(LSDM_SHEET) ? doc_(LSDM_SHEET).map(function(x){ return { MaCD: x.MaCD, DinhMucGio: soVN_(x.DinhMucGio), TuNgay: x.TuNgay ? ngayVN_(x.TuNgay) : '', DenNgay: ngayVN_(x.DenNgay) }; }) : [];""")
