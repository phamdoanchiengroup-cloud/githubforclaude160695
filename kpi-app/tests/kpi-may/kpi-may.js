/* ===== KPI TRÊN TRÌNH DUYỆT LẤY ĐÚNG SỐ MÁY CHỦ (22/10) =====
   Chủ dự án báo đổi định mức xong "KPI có vẻ không đúng": hàm kpi() phía trình duyệt cộng dồn MỌI nhật ký đang có
   trong máy (từ đầu tháng trước) và thiếu các quy tắc của máy chủ (ngày đi làm không khai, nghỉ dài hạn, lỗi KCS,
   vi phạm theo tháng, trọng số theo kỳ) -> KPI cá nhân, cột KPI ở Nhân sự, hồ sơ, "dưới 80%" ở Tổng quan, Rhino
   lệch với Bảng KPI. Nay: lặng lẽ tải bảng KPI tháng này của máy chủ (layKPIKy – có bộ nhớ tạm + làm nóng nên nhanh),
   kpi(maNV) trả đúng số đó; chưa tải xong / người không có trong bảng thì tính tạm chỉ với nhật ký THÁNG NÀY. */
var KPI_MAY = { th: '', m: null, luc: 0, dang: false };
var KPI_MAY_CACH = 300000;   // tải lại tối đa 5 phút / lần (đổi dữ liệu thì tải lại ngay)
var KPI_MAY_TAB = { dash: 1, ns: 1, kpica: 1 };
var _kpiTho = kpi;
function kpiThangNay_(maNV) {           // tính tạm: chỉ nhật ký tháng này (như Bảng KPI)
  var th = today().slice(0, 7), c = kpiThangNay_.c, a = D.nhatky || [];
  if (!c || c.a !== a || c.n !== a.length || c.th !== th)
    c = kpiThangNay_.c = { a: a, n: a.length, th: th, loc: a.filter(function (r) { return ngay(r.Ngay).slice(0, 7) === th; }) };
  var luu = D.nhatky; D.nhatky = c.loc;
  try { return _kpiTho(maNV); } finally { D.nhatky = luu; }
}
kpi = function (maNV) {
  var o = (KPI_MAY.m && KPI_MAY.th === today().slice(0, 7)) ? KPI_MAY.m[maNV] : null;
  if (o && isFinite(Number(o.tong)))
    return { sl: Number(o.sl) || 0, cl: Number(o.cl) || 0, tt: Number(o.tt) || 0, at: Number(o.at) || 0, tong: Number(o.tong) || 0, spl: Number(o.spl) || 0, may: true };
  return kpiThangNay_(maNV);
};
function kpiMayVeLai_() {
  var t = tabHienTai; if (!KPI_MAY_TAB[t]) return;
  if (t === 'ns' && document.body.classList.contains('cd-mo')) return;   // đang xem hồ sơ ở khung bên phải: không vẽ lại
  if (typeof lmDangSua_ === 'function' && lmDangSua_()) return;
  var y = window.scrollY;
  try { ({ dash: vDash, ns: vNS, kpica: vKPICaNhanToi }[t])(); } catch (e) {}
  window.scrollTo(0, y);
}
function taiKPIMay(ep) {
  if (!ME || !TOKEN || KPI_MAY.dang) return;
  var th = today().slice(0, 7);
  if (!ep && KPI_MAY.th === th && Date.now() - KPI_MAY.luc < KPI_MAY_CACH) return;
  KPI_MAY.dang = true;
  google.script.run.withSuccessHandler(function (r) {
    KPI_MAY.dang = false;
    if (!r || !r.ok) { KPI_MAY.luc = Date.now(); return; }          // không có quyền xem bảng / lỗi: dùng cách tính tạm
    var m = {}, cu = KPI_MAY.m, doi = !cu || KPI_MAY.th !== th;
    (r.ds || []).forEach(function (o) { m[o.MaNV] = o; if (!doi && (!cu[o.MaNV] || cu[o.MaNV].tong !== o.tong)) doi = true; });
    KPI_MAY.m = m; KPI_MAY.th = th; KPI_MAY.luc = Date.now();
    if (doi) kpiMayVeLai_();
  }).withFailureHandler(function () { KPI_MAY.dang = false; }).layKPIKy(TOKEN, 'thang', th, '');
}
(function () {
  var cu = window.go;
  window.go = function (k) { var r = cu.apply(this, arguments); try { if (KPI_MAY_TAB[k]) taiKPIMay(); } catch (e) {} return r; };
  var cuR = window.reload;                 // dữ liệu vừa đổi (duyệt, sửa định mức...) -> lần sau mở tab lấy số mới
  window.reload = function () { KPI_MAY.luc = 0; return cuR.apply(this, arguments); };
})();
