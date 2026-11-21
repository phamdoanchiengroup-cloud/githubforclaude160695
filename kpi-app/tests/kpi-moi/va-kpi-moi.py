# -*- coding: utf-8 -*-
# Vá Code.gs – 21/11 (chủ dự án chốt, trước khi xét thưởng theo KPI): KPI MỚI ÁP TỪ THÁNG 9/2026 (KPI_MOI_TU; 21/11 tối chủ dự án: tính lại + chốt lại T9, T10), tháng cũ giữ cách cũ.
#  (a) Bỏ HỌC VIỆC: người mới có KPI + xếp loại ngay; ngày TRƯỚC ngày vào làm và SAU ngày làm cuối (người đã nghỉ việc) không tính là "có mặt, SL 0".
#  (b) CHUYÊN CẦN theo CHẤM CÔNG (HC-NS đề xuất): Nkp −15/ngày · Nkl/KLD/VGĐ từ ngày thứ 3 −5/ngày · đi muộn (x-h) −2/lần, trừ vào điểm Tuân thủ.
#      Phép năm, lễ, bù, cưới, thai sản… không trừ.
#  (c) NGÀY CÔNG TỐI THIỂU: tỷ lệ công = công đi làm ÷ ngày phải làm (bỏ ngày nghỉ có phép / lễ): ≥ 80% bình thường · 50–80% hạ 1 bậc loại ·
#      < 50% "Thiếu công" (không xếp loại, không xếp hạng).
#  (d) VẬN HÀNH TP/PP theo TỶ LỆ lỗi (mỗi 1% lượt lỗi trừ 5 điểm; quên điểm danh trừ thêm 10 điểm/lần – chủ dự án 21/11 tối: ×2 quá nhẹ tay): 50% điểm danh (quên = 1 lỗi, muộn = ½) ÷ số ngày làm + 50% (duyệt trễ / ẩu / không nhắc) ÷ (số CN × số ngày).
# Chạy bằng exec() cuối tests/va-code.py (sau kpi-ql). Kiểm thử: tests/kpi-moi.js
def _tm(cu, moi, dem=1):
    global s
    assert s.count(cu) == dem, ('va-kpi-moi: không thấy đúng %d chỗ' % dem, cu[:80], s.count(cu))
    s = s.replace(cu, moi)

_tm("function laHocViecThang_(maNV, ky) { var h = hetHocViec_(maNV);",
    "function laHocViecThang_(maNV, ky) { if (String(ky) >= KPI_MOI_TU) return false;   /* 21/11: bỏ học việc từ T11/2026 */ var h = hetHocViec_(maNV);")
_tm("function loaiCo_(maNV, ky, tong) { return laHocViecThang_(maNV, ky) ? 'Học việc' : loaiKPI_(tong); }",
    "function loaiCo_(maNV, ky, tong) { if (String(ky) >= KPI_MOI_TU) return kmLoai_(maNV, ky, tong);   /* 21/11: ngày công tối thiểu */ return laHocViecThang_(maNV, ky) ? 'Học việc' : loaiKPI_(tong); }")
_tm("  arr.forEach(function(o){ if (laHocViecThang_(o.MaNV, ky)) o.hang = 0; });\n  sapXepHang_(arr.filter(function(o){ return !laHocViecThang_(o.MaNV, ky); }));",
    "  arr.forEach(function(o){ if (laHocViecThang_(o.MaNV, ky) || kmThieuCong_(o.MaNV, ky)) o.hang = 0; });   // 21/11: \"Thiếu công\" không xếp hạng\n  sapXepHang_(arr.filter(function(o){ return !laHocViecThang_(o.MaNV, ky) && !kmThieuCong_(o.MaNV, ky); }));")
# kpiThang_: bỏ ngày trước khi vào làm / sau ngày làm cuối, đếm công + chấm công
_tm("  var gc=0, sl=0, ng2=0, mauSo=0, hnK = homNayVN_();   // 09/11: hôm nay chưa xong -> không tính",
    "  var gc=0, sl=0, ng2=0, mauSo=0, hnK = homNayVN_();   // 09/11: hôm nay chưa xong -> không tính\n"
    "  var kmMoi = String(kyThang) >= KPI_MOI_TU, kmVao = kmMoi ? (ngayVaoLam_(maNV) || '') : '', kmCuoi = kmMoi ? kmCuoiLam_(maNV, dt) : '', cc = { lv: 0, cong: 0, nkp: 0, nkl: 0, muon: 0 };   // 21/11")
_tm("    if (nghiDaiHanNgay(ngayR)) return;                 // nghỉ dài hạn -> bỏ qua\n    var kyHieu = dt.idxCC ? (dt.idxCC[maNV+'|'+ngayR] || 'x') : kyHieuChamCong_(dt.diemdanh || [], maNV, ngayR);\n    var gioMat = gioCoMat_(kyHieu);",
    "    if (nghiDaiHanNgay(ngayR)) return;                 // nghỉ dài hạn -> bỏ qua\n"
    "    if (kmMoi && ((kmVao && ngayR < kmVao) || (kmCuoi && ngayR > kmCuoi))) return;   // 21/11: chưa vào làm / đã nghỉ việc -> không tính\n"
    "    var kyHieu = dt.idxCC ? (dt.idxCC[maNV+'|'+ngayR] || 'x') : kyHieuChamCong_(dt.diemdanh || [], maNV, ngayR);\n    var gioMat = gioCoMat_(kyHieu);\n"
    "    if (kmMoi) { var khC = String(kyHieu || 'x').trim(); if (!KM_CO_PHEP[khC]) { cc.lv++; cc.cong += Math.min(1, gioMat / 8);\n"
    "      if (khC === 'Nkp') cc.nkp++; else if (KM_KHONG_LUONG[khC]) cc.nkl++; if (khC.indexOf('x-') === 0) cc.muon++; } }")
_tm("  var tong = (vsl*Number(t.SanLuong) + vcl*Number(t.ChatLuong) + vtt*Number(t.TuanThu) + vat*Number(t.AnToan)) / 100;\n\n  return { sl:vsl, cl:vcl, tt:vtt, at:vat, tong:tong, spl:sl, gl:mauSo, gd:0 };",
    "  if (kmMoi) { vtt = Math.max(0, vtt - KM_TRU_NKP * cc.nkp - KM_TRU_NKL * Math.max(0, cc.nkl - KM_NKL_MIEN) - KM_TRU_MUON * cc.muon); __KCONG[maNV + '|' + kyThang] = cc; }   // 21/11: chuyên cần theo chấm công\n"
    "  var tong = (vsl*Number(t.SanLuong) + vcl*Number(t.ChatLuong) + vtt*Number(t.TuanThu) + vat*Number(t.AnToan)) / 100;\n\n"
    "  return { sl:vsl, cl:vcl, tt:vtt, at:vat, tong:tong, spl:sl, gl:mauSo, gd:0, cong: kmMoi ? cc : null };")
# Vận hành theo tỷ lệ (từ T11)
_tm("  if (vh < 0) vh = 0;\n\n  /* ===== TRỤ 3: Nề nếp (chuyên cần của chính TP/PP) ===== */",
    "  if (vh < 0) vh = 0;\n"
    "  if (String(kyThang) >= KPI_MOI_TU) {   // 21/11: tỷ lệ làm đúng – xưởng đông người không bị trừ về 0\n"
    "    var soNg = ngayLV.length, loiDD = chiTiet.ddQuen + 0.5 * chiTiet.ddMuon, luot = Math.max(1, dem * Math.max(1, soNg)), loiCN = chiTiet.duyetTre + chiTiet.duyetAu + chiTiet.khongNhac;\n"
    "    vh = 100 * (0.5 * (soNg ? Math.max(0, 1 - KM_HE_SO_LOI * loiDD / soNg) : 1) + 0.5 * Math.max(0, 1 - KM_HE_SO_LOI * loiCN / luot));   // mỗi 1% lượt lỗi trừ 5 điểm\n"
    "    vh = Math.max(0, vh - KM_TRU_QUEN_DD * chiTiet.ddQuen);   // 21/11 tối (chủ dự án): mỗi lần TP/PP QUÊN điểm danh trừ thẳng 10 điểm vận hành\n"
    "  }\n\n  /* ===== TRỤ 3: Nề nếp (chuyên cần của chính TP/PP) ===== */")
s = s.rstrip() + '\n' + r"""
/* ===== 21/11: KPI MỚI TỪ THÁNG 11/2026 (bỏ học việc, chuyên cần theo chấm công, ngày công tối thiểu, vận hành theo tỷ lệ) ===== */
var KPI_MOI_TU = '2026-09', __KCONG = {};   // 21/11 tối (chủ dự án): áp cả T9, T10 rồi chốt lại trên web
var KM_CO_PHEP = { 'P': 1, 'NL': 1, 'Nb': 1, 'Cu': 1, 'TS': 1, 'Ta': 1, 'OD': 1 };   // nghỉ phép năm, lễ, bù, cưới, tang, thai sản, ốm có giấy… – không tính vào ngày phải làm
var KM_KHONG_LUONG = { 'Nkl': 1, 'KLD': 1, 'VGĐ': 1 };
var KM_HE_SO_LOI = 5, KM_TRU_QUEN_DD = 10, KM_TRU_NKP = 15, KM_TRU_NKL = 5, KM_NKL_MIEN = 2, KM_TRU_MUON = 2, KM_CONG_DU = 0.8, KM_CONG_TOI_THIEU = 0.5;
var KM_BAC = ['S', 'A+', 'A', 'B', 'C', 'D'];
function kmCuoiLam_(maNV, dt) {   // người đã nghỉ việc: ngày cuối có nhật ký (không có cột ngày nghỉ việc)
  if (!dt._kmTT) { dt._kmTT = {}; (dt.nhansuTatCa || dt.nhansu || []).forEach(function(x){ dt._kmTT[String(x.MaNV).trim()] = String(x.TrangThai).trim(); }); }
  if (dt._kmTT[String(maNV).trim()] !== 'Nghỉ việc') return '';
  if (!dt._kmCuoi) { dt._kmCuoi = {}; (dt.nhatky || []).forEach(function(r){ var m = String(r.MaNV).trim(), ng = ngayVN_(r.Ngay); if (ng && (!dt._kmCuoi[m] || ng > dt._kmCuoi[m])) dt._kmCuoi[m] = ng; }); }
  return dt._kmCuoi[String(maNV).trim()] || '';
}
function kmTyLeCong_(maNV, ky) { var c = __KCONG[maNV + '|' + ky]; return c && c.lv > 0 ? c.cong / c.lv : null; }
var __KM_CHOT = null;
function kmLoaiChot_(maNV, ky) {   // tháng đã chốt (đọc snapshot KPIThang, không tính lại công): lấy loại đã lưu
  if (!__KM_CHOT) { __KM_CHOT = {}; try { (ss_().getSheetByName('KPIThang') ? doc_('KPIThang') : []).forEach(function(r){ __KM_CHOT[String(r.MaNV).trim() + '|' + chuanKy_(r.Ky)] = String(r.Loai || '').trim(); }); } catch (e) {} }
  return __KM_CHOT[String(maNV).trim() + '|' + ky] || '';
}
function kmThieuCong_(maNV, ky) { if (String(ky) < KPI_MOI_TU) return false; var t = kmTyLeCong_(maNV, ky); return t === null ? kmLoaiChot_(maNV, ky) === 'Thiếu công' : t < KM_CONG_TOI_THIEU; }
function kmLoai_(maNV, ky, tong) {
  var L = loaiKPI_(tong), t = kmTyLeCong_(maNV, ky);
  if (t === null) { var lc = kmLoaiChot_(maNV, ky); if (lc === 'Thiếu công' || (lc && KM_BAC.indexOf(lc) > KM_BAC.indexOf(L))) return lc; return L; }   // chốt rồi: giữ loại đã hạ bậc
  if (t < KM_CONG_TOI_THIEU) return 'Thiếu công';
  if (t < KM_CONG_DU) { var i = KM_BAC.indexOf(L); if (i >= 0 && i < KM_BAC.length - 1) L = KM_BAC[i + 1]; }
  return L;
}
"""
_tm("  try { kqlTran150_(); } catch (eT) {}", "  try { kqlTran150_(); } catch (eT) {}\n  try { kmTran150T9_(); } catch (eT9) {}   // 21/11 tối: trần 150% từ T9 (chốt lại T9, T10 theo cách mới)")
s = s.rstrip() + '\n' + r"""
function kmTran150T9_() {   // 1 lần: thêm dòng trọng số từ 2026-09-01, giữ trọng số tháng 9, trần 150%
  var p = PropertiesService.getScriptProperties(); if (p.getProperty('KM_TRAN150_T9') === '1') return;
  var ds = doc_('TrongSoKPI'), t9 = trongSoKy_(ds, '2026-09', TRONG_SO_MAC_DINH);
  if (!(Number(t9.TranKPI) === KQL_TRAN_CN && chuanKy_(t9.KyApDung) === '2026-09'))
    them_('TrongSoKPI', { KyApDung: '2026-09-01', SanLuong: Number(t9.SanLuong), ChatLuong: Number(t9.ChatLuong), TuanThu: Number(t9.TuanThu), AnToan: Number(t9.AnToan),
      TranKPI: KQL_TRAN_CN, TyTrongTo: Number(t9.TyTrongTo) || 70, NguoiCapNhat: 'Hệ thống (chủ dự án: KPI mới áp từ T9 – 21/11)', ThoiDiem: new Date() });
  p.setProperty('KM_TRAN150_T9', '1');
  try { xoaCache_('TrongSoKPI'); } catch (e) {}
}
"""
