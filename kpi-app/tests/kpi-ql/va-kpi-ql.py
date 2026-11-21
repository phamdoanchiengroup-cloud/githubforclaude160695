# -*- coding: utf-8 -*-
# Vá Code.gs – 21/11 (chủ dự án chốt trước khi gắn QUỸ THƯỞNG theo KPI, góp ý quan-ly-van-hanh):
#  (1) KPI quản lý (TP/PP): Hiệu suất / tỷ lệ đạt xưởng tính MỌI công nhân có KPI trong tháng (cả người nghỉ việc sau đó) và
#      CHỐT lưu vào sheet KPIQuanLyThang khi chốt tháng; tháng đã chốt thì web hiện số đã chốt (không tự đổi khi có người nghỉ).
#  (2) Trần: hiệu suất xưởng tối đa 130% (KPI quản lý); trần hiệu suất công nhân 150% áp từ tháng 11/2026
#      (tự thêm 1 dòng TrongSoKPI KyApDung 2026-11-01, giữ nguyên tỷ trọng – làm 1 lần, cờ KQL_TRAN150).
# Chạy bằng exec() cuối tests/va-code.py. Kiểm thử: tests/kpi-ql.js
def _tq(cu, moi, dem=1):
    global s
    assert s.count(cu) == dem, ('va-kpi-ql: không thấy đúng %d chỗ' % dem, cu[:80], s.count(cu))
    s = s.replace(cu, moi)

# dt.nhansu (docDuLieuKPI_) đã BỎ người nghỉ việc -> thêm dt.nhansuTatCa (mọi người) cho KPI quản lý + chốt tháng
_tq("    nhansu: doc_('NhanSu').filter(function(x){ return String(x.TrangThai).trim() !== 'Nghỉ việc'; }),",
    "    nhansu: doc_('NhanSu').filter(function(x){ return String(x.TrangThai).trim() !== 'Nghỉ việc'; }),\n    nhansuTatCa: doc_('NhanSu'),   // 21/11: cả người đã nghỉ – chốt tháng / KPI quản lý tháng cũ")
# chốt tháng: tính MỌI người (kpiThang_ trả null nếu tháng đó không làm) – trước đây chốt lại tháng cũ làm MẤT KPI người đã nghỉ
_tq("  var dsNV = dt.nhansu.filter(function(x){ return !maQL[String(x.MaNV).trim()]; });\n  if (xuongLoc)",
    "  var dsNV = (dt.nhansuTatCa || dt.nhansu).filter(function(x){ return !maQL[String(x.MaNV).trim()] && kqlCoTinh_(dt, x, ky); });   // 21/11: cả người đã nghỉ (chốt lại tháng cũ không làm mất KPI của họ)\n  if (xuongLoc)")
_tq("  var nsXuong = dt.nhansu.filter(function(x){\n    return x.MaXuong === maXuong && String(x.TrangThai).trim() !== 'Nghỉ việc' && !dt.maQL[String(x.MaNV).trim()];",
    "  var nsXuong = (dt.nhansuTatCa || dt.nhansu).filter(function(x){\n    return x.MaXuong === maXuong && !dt.maQL[String(x.MaNV).trim()];   // 21/11: MỌI công nhân có KPI trong tháng (cả người nghỉ việc sau đó) – kpiThangNho_ trả null nếu tháng đó không làm")
_tq("  var hieuSuatXuong = dem ? tongHS / dem : 0;      // có thể >100 (bị chặn trần ở cá nhân)",
    "  var hieuSuatXuong = dem ? tongHS / dem : 0;\n  if (hieuSuatXuong > KQL_TRAN_XUONG) hieuSuatXuong = KQL_TRAN_XUONG;   // 21/11: trần hiệu suất xưởng 130% (chủ dự án chốt)")
_tq("""  ds.sort(function(a,b){ return b.tong - a.tong; });

  return sach_({ ok:true, ky:kyThang, ds:ds, laOwner: me.laOwner, vaiTro: me.vaiTro });""",
"""  ds.sort(function(a,b){ return b.tong - a.tong; });
  if (meSan && meSan.__tho) return ds;   // 21/11: chốt tháng lấy số thô (kqlChot_)
  var chot = kqlDocChot_(kyThang);       // 21/11: tháng đã chốt -> điểm lấy từ KPIQuanLyThang (không tự đổi khi có người nghỉ việc)
  if (chot) {
    ds.forEach(function(o){ var c = chot[String(o.maNV)]; if (!c) return;
      o.hieuSuatXuong = Number(c.HieuSuatXuong); o.tyLeDatXuong = Number(c.TyLeDatXuong); o.vanHanh = Number(c.VanHanh); o.neNep = Number(c.NeNep);
      o.kpiQuanLy = o.tong = Number(c.TongKPI); o.daChot = 1; o.chotLuc = String(c.ThoiDiemChot || ''); });
    var tx = {}; ds.forEach(function(o){ (tx[o.maXuong] = tx[o.maXuong] || []).push(o); });
    Object.keys(tx).forEach(function(mx){ tx[mx].sort(function(a,b){ return b.tong - a.tong; }); tx[mx].forEach(function(o,i){ o.hang = i+1; }); });
    ds.sort(function(a,b){ return b.tong - a.tong; });
  }
  return sach_({ ok:true, ky:kyThang, ds:ds, laOwner: me.laOwner, vaiTro: me.vaiTro, daChot: chot ? 1 : 0 });""")
_tq("""  ghiSnapshot_(sh, ky, xuongLoc, rows);
  xoaCache_('KPIThang');   // làm mới cache để bảng KPI đọc được snapshot vừa ghi
  xong_();
  return rows.length;""",
"""  ghiSnapshot_(sh, ky, xuongLoc, rows);
  xoaCache_('KPIThang');   // làm mới cache để bảng KPI đọc được snapshot vừa ghi
  try { kqlChot_(ky, xuongLoc, nguoiChot); } catch (eQL) {}   // 21/11: chốt luôn KPI quản lý TP/PP
  xong_();
  return rows.length;""")
_tq("function docDuLieuKPI_(canLuuTru) {\n", "function docDuLieuKPI_(canLuuTru) {\n  try { kqlTran150_(); } catch (eT) {}   // 21/11: trần hiệu suất CN 150% từ T11/2026 (1 lần)\n")

s = s.rstrip() + '\n' + r"""
/* ===== 21/11 (chủ dự án chốt trước khi gắn QUỸ THƯỞNG): CHỐT KPI QUẢN LÝ + TRẦN 150% / 130% =====
   - KPIQuanLyThang: 1 dòng / TP-PP / tháng, ghi khi chốt tháng (chotThangLoi_, cả chốt tự động đầu tháng). Tháng đã chốt:
     layKPIQuanLy hiện điểm đã chốt (khoản trừ vẫn hiện để xem; miễn trừ sau khi chốt thì chủ sở hữu chốt lại tháng đó).
   - Trần: hiệu suất xưởng ≤ 130% (KQL_TRAN_XUONG); trần hiệu suất công nhân 150% từ 2026-11 (thêm dòng TrongSoKPI, đổi được ở web). */
var KQL_TRAN_XUONG = 130, KQL_TRAN_CN = 150, KQL_COT = ['Ky', 'MaNV', 'HoTen', 'VaiTro', 'MaXuong', 'HieuSuatXuong', 'TyLeDatXuong', 'VanHanh', 'NeNep', 'TongKPI', 'Loai', 'ThoiDiemChot', 'NguoiChot'];
/* người còn làm: tính như cũ; người đã nghỉ việc: chỉ tính tháng họ CÓ nhật ký sản xuất đã chốt (không thì điểm danh mặc định "có mặt" làm họ thành SL 0) */
function kqlCoTinh_(dt, x, ky) {
  if (String(x.TrangThai).trim() !== 'Nghỉ việc') return true;
  var m = String(x.MaNV);
  if (dt.idxNK) return (dt.idxNK[m + '|' + ky] || []).length > 0;
  return dt.nhatky.some(function(r){ return r.MaNV === m && String(r.TrangThai).trim() === 'Đã chốt' && ngayVN_(r.Ngay).slice(0, 7) === ky; });
}
function kqlDocChot_(ky) {
  var m = {}, co = false;
  docAnToan_('KPIQuanLyThang').forEach(function(r){ if (chuanKy_(r.Ky) === String(ky)) { m[String(r.MaNV).trim()] = r; co = true; } });
  return co ? m : null;
}
function kqlChot_(ky, xuongLoc, nguoiChot) {
  var ds = layKPIQuanLyGoc_(null, ky, { vaiTro: 'ADMIN', laOwner: true, xuong: '', __tho: true });
  if (!Array.isArray(ds)) return 0;
  if (xuongLoc) ds = ds.filter(function(o){ return String(o.maXuong) === String(xuongLoc); });
  var ss = ss_(), sh = ss.getSheetByName('KPIQuanLyThang');
  if (!sh) { sh = ss.insertSheet('KPIQuanLyThang'); sh.getRange(1, 1, 1, KQL_COT.length).setValues([KQL_COT]).setFontWeight('bold'); sh.setFrozenRows(1); }
  var last = sh.getLastRow(), giu = [], bo = {};
  ds.forEach(function(o){ bo[String(o.maNV)] = 1; });
  if (last >= 2) giu = sh.getRange(2, 1, last - 1, KQL_COT.length).getValues().filter(function(r){
    if (r.join('') === '') return false;
    if (chuanKy_(r[0]) !== String(ky)) return true;
    return xuongLoc ? !bo[String(r[1]).trim()] && String(r[4]) !== String(xuongLoc) : false; });
  var now = new Date();
  var moi = ds.map(function(o){ return [String(ky), o.maNV, o.hoTen || '', o.vaiTro || '', o.maXuong, r2_(o.hieuSuatXuong), r2_(o.tyLeDatXuong), r2_(o.vanHanh), r2_(o.neNep), r2_(o.tong), loaiKPI_(o.tong), now, nguoiChot || 'Hệ thống']; });
  var tat = giu.concat(moi);
  if (last >= 2) sh.getRange(2, 1, last - 1, KQL_COT.length).clearContent();
  if (tat.length) { sh.getRange(2, 1, tat.length, KQL_COT.length).setValues(tat); sh.getRange(2, 1, tat.length, 1).setNumberFormat('@'); }
  xoaCache_('KPIQuanLyThang');
  return moi.length;
}
function kqlTran150_() {
  var p = PropertiesService.getScriptProperties(); if (p.getProperty('KQL_TRAN150') === '1') return;
  var ds = doc_('TrongSoKPI'), cuoi = trongSoKy_(ds, '2026-11', TRONG_SO_MAC_DINH);
  if (Number(cuoi.TranKPI) !== KQL_TRAN_CN || chuanKy_(cuoi.KyApDung) !== '2026-11')
    them_('TrongSoKPI', { KyApDung: '2026-11-01', SanLuong: Number(cuoi.SanLuong), ChatLuong: Number(cuoi.ChatLuong), TuanThu: Number(cuoi.TuanThu), AnToan: Number(cuoi.AnToan),
      TranKPI: KQL_TRAN_CN, TyTrongTo: Number(cuoi.TyTrongTo) || 70, NguoiCapNhat: 'Hệ thống (chủ dự án chốt trần 150% – 21/11)', ThoiDiem: new Date() });
  p.setProperty('KQL_TRAN150', '1');
  try { xoaCache_('TrongSoKPI'); } catch (e) {}
}
"""
