# -*- coding: utf-8 -*-
"""Vá Code.gs – tăng tốc đợt 2 (21/10): đăng nhập, Bảng KPI, KPI quản lý. Chạy bằng exec() ở cuối tests/va-code.py; dùng chung R() và s.
Đo trên dữ liệu thật 21/10 (14.460 dòng nhật ký): napDuLieu của ban điều hành gửi về 2,9 MB, bảng KPI / KPI quản lý gần như
không bao giờ lấy được bộ nhớ tạm vì mọi lượt ghi (cả công nhân gửi sản lượng, đăng ký cơm) đều xóa nhớ.
Kiểm thử: tests/tang-toc-2.js."""

# ======================================================================= 1. GÓI GỌN DỮ LIỆU NẠP (đăng nhập / tải lại)
# Mảng nhiều đối tượng cùng khóa -> { __b:1, c:[tên cột], h:[[giá trị]] } (bỏ lặp tên khóa ở mỗi dòng), cả gói trả về
# dạng MỘT chuỗi JSON (google.script.run chuyển chuỗi nhanh hơn nhiều so với hàng vạn đối tượng nhỏ).
# Trình duyệt mở gói bằng moGoi_ (tests/tang-toc-2/va-tang-toc-web.py).
R("""function napDuLieu(token) { return napDuLieuLoi_(token, null); }""",
  """function napDuLieu(token) { return goiNap_(napDuLieuLoi_(token, null)); }""")
R("""function napPhan(token, phan) {
  return napDuLieuLoi_(token, phan && phan.length ? phan : null);
}""", """function napPhan(token, phan) {
  return goiNap_(napDuLieuLoi_(token, phan && phan.length ? phan : null));
}""")
s = s.rstrip() + '\n' + r"""
/* ===== TĂNG TỐC ĐỢT 2 (21/10) – gói gọn dữ liệu nạp, bộ nhớ tạm KPI riêng, làm nóng bảng KPI ===== */
var GOI_TU_DONG = 30;        // mảng từ 30 dòng trở lên thì gói dạng bảng
function goiNap_(r) {
  if (!r || typeof r !== 'object' || !r.ok) return r;
  var o = {};
  Object.keys(r).forEach(function(k) { o[k] = goiBang_(r[k]); });
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
"""

# ======================================================================= 2. BỘ NHỚ TẠM KPI KHÔNG BỊ XÓA OAN
R("""    var raw = ten + '|' + JSON.stringify(thamSo) + '|' + phienBan_() + '|' + homNayVN_() + (gioVN_() >= 17 ? 'c' : 's');""",
  """    var raw = ten + '|' + JSON.stringify(thamSo) + '|' + (NHO_KPI_[ten] ? 'k' + phienBanKPI_() : phienBan_()) + '|' + homNayVN_() + (gioVN_() >= 17 ? 'c' : 's');""")
R("""function tangPhienBan_() {
  __PB = new Date().getTime() + '.' + Math.floor(Math.random() * 1e6);
  try { PropertiesService.getScriptProperties().setProperty('KPI_PB', __PB); } catch (e) {}
}""", """function tangPhienBan_(chiChung) {
  __PB = new Date().getTime() + '.' + Math.floor(Math.random() * 1e6);
  try { PropertiesService.getScriptProperties().setProperty('KPI_PB', __PB); } catch (e) {}
  if (!chiChung) tangPhienBanKPI_();                  // gọi thẳng (XOA_BO_NHO_TAM, dọn phạt…) thì xóa cả nhớ KPI
}""")
R("""  if (__KHOA && !__DA_TANG_PB) { tangPhienBan_(); __DA_TANG_PB = true; }""",
  """  if (__KHOA && !__DA_TANG_PB) { tangPhienBan_(!anhHuongKPI_()); __DA_TANG_PB = true; }""")
R("""  themNhieu_('NhatKySanXuat', out);
  ghiLog_(me, 'Công nhân gửi sản lượng',""", """  __KPI_KHONG_DOI = true;                             // chỉ thêm dòng "Chờ duyệt": không xóa nhớ bảng KPI (21/10)
  themNhieu_('NhatKySanXuat', out);
  ghiLog_(me, 'Công nhân gửi sản lượng',""")

# ======================================================================= 3. HÀM TÍNH NHẬN SẴN "me" (để trigger làm nóng gọi được, không cần phiên)
R("""function layKPIKyGoc_(token, kieu, giaTri, maXuong) {
  var me = docPhien_(token);""", """function layKPIKyGoc_(token, kieu, giaTri, maXuong, meSan) {
  var me = meSan || docPhien_(token);""")
R("""function layKPIQuanLyGoc_(token, kyThang) {
  var me = docPhien_(token);""", """function layKPIQuanLyGoc_(token, kyThang, meSan) {
  var me = meSan || docPhien_(token);""")
