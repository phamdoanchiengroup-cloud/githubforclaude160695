# -*- coding: utf-8 -*-
"""Vá Code.gs – THANG 4 BẬC (chủ dự án 23/11): A ≥ 90 · B 80–89 · C 70–79 · D < 70 (+ "Thiếu công", "Học việc" giữ nguyên).
Bỏ hẳn thang 6 bậc S/A+/A/B/C/D (22/10). Áp luôn, áp ngược T9 + T10: hàm 1 lần xl4Chuyen_() đổi cột Loai đã lưu trong
KPIThang + KPIQuanLyThang sang 4 bậc (tính lại từ TongKPI; dòng đã bị hạ bậc vì ngày công thì hạ 1 bậc trên thang mới).
Chạy bằng exec() ở CUỐI tests/va-code.py (sau mọi mục khác). Kiểm thử: tests/xep-loai-4.js."""
R("""function loaiKPI_(v) {             // thang 22/10: S ≥ 95, A+ ≥ 90, A ≥ 85, B ≥ 80, C ≥ 70, D < 70
  if (v >= 95) return 'S';
  if (v >= 90) return 'A+';
  if (v >= 85) return 'A';
  if (v >= 80) return 'B';""", """function loaiKPI_(v) {             // 23/11 (chủ dự án): thang 4 bậc A ≥ 90, B 80–89, C 70–79, D < 70 – bỏ S / A+
  if (v >= 90) return 'A';
  if (v >= 80) return 'B';""")
R("var KM_BAC = ['S', 'A+', 'A', 'B', 'C', 'D'];", "var KM_BAC = ['A', 'B', 'C', 'D'];   // 23/11: thang 4 bậc")
# tháng đã chốt còn lưu chữ cũ (trước khi chạy xl4Chuyen_) -> quy về 4 bậc để so sánh hạ bậc
R("  return __KM_CHOT[String(maNV).trim() + '|' + ky] || '';\n}",
  "  return xl4Cu_(__KM_CHOT[String(maNV).trim() + '|' + ky] || '');\n}")
R("var BC_LOAI = ['S','A+','A','B','C','D','Học việc'];", "var BC_LOAI = ['A','B','C','D','Thiếu công','Học việc'];   // 23/11: thang 4 bậc (+ Thiếu công từ KPI mới)")
R("var BC_MAU_LOAI = { 'S':'#5b3fa8', 'A+':'#1e7f5c', 'A':'#3aa57a',", "var BC_MAU_LOAI = { 'Thiếu công':'#8e44ad', 'A':'#1e7f5c',")
R("kp.forEach(function(o){ phanLoai[o.loai]++; });", "kp.forEach(function(o){ var l = xl4Cu_(o.loai); phanLoai[l] = (phanLoai[l] || 0) + 1; });")
R("tlTot: kp.length ? (phanLoai['S'] + phanLoai['A+'] + phanLoai['A']) / kp.length * 100 : null,", "tlTot: kp.length ? phanLoai['A'] / kp.length * 100 : null,")
R("bcO_('Tỷ lệ xếp loại S/A+/A',", "bcO_('Tỷ lệ xếp loại A',")
R("Xếp loại: S ≥ 95, A+ ≥ 90, A ≥ 85, B ≥ 80, C ≥ 70, D &lt; 70.", "Xếp loại: A ≥ 90, B 80–89, C 70–79, D &lt; 70 (Thiếu công: đi làm dưới 50% ngày công).")
R("""Thanh phân loại: <span style="color:' + BC_MAU_LOAI.S + '">■</span> S <span style="color:' + BC_MAU_LOAI['A+'] + '">■</span> A+ <span style="color:' + BC_MAU_LOAI.A + '">■</span> A """,
  """Thanh phân loại: <span style="color:' + BC_MAU_LOAI.A + '">■</span> A """)
R("sp · Tỷ lệ S/A+/A: <b>", "sp · Tỷ lệ loại A: <b>")
R("bac = { 'S': 6, 'A+': 5, 'A': 4, 'B': 3, 'C': 2, 'D': 1 };", "bac = { 'A': 4, 'B': 3, 'C': 2, 'D': 1 };   // 23/11: 4 bậc")
R("<th style=\"width:15%\">Phân loại S → D</th>", "<th style=\"width:15%\">Phân loại A → D</th>")
# hàm dùng chung + chuyển dữ liệu đã lưu (1 lần)
R("  try { kmTran150T9_(); } catch (eT9) {}", "  try { kmTran150T9_(); } catch (eT9) {}\n  try { xl4Chuyen_(); } catch (eX4) {}   // 23/11: đổi loại đã lưu sang thang 4 bậc (1 lần)")
_k = s.rfind('function kmTran150T9_()')
s = s[:_k] + r"""/* ===== 23/11 (chủ dự án): THANG 4 BẬC A / B / C / D – bỏ S, A+ ===== */
function xl4Cu_(l) {   // chữ loại cũ (6 bậc) -> 4 bậc theo ngưỡng; giữ Thiếu công / Học việc
  l = String(l || '').trim();
  return l === 'S' || l === 'A+' ? 'A' : l;   // A (85–89) / B (80–84) cũ đều = B mới – riêng 'A' cũ cần TongKPI (xem xl4Chuyen_)
}
function xl4Cu6_(v, luc) {   // loại theo thang cũ tại lúc chốt: trước 22/10 dùng A+ ≥ 100, A ≥ 90…; từ 22/10 dùng S ≥ 95, A+ ≥ 90, A ≥ 85…
  var tr = luc && String(luc) < '2026-10-22';
  if (tr) return v >= 100 ? 'A+' : v >= 90 ? 'A' : v >= 80 ? 'B' : v >= 70 ? 'C' : 'D';
  return v >= 95 ? 'S' : v >= 90 ? 'A+' : v >= 85 ? 'A' : v >= 80 ? 'B' : v >= 70 ? 'C' : 'D';
}
function xl4Moi_(tong, cu, luc) {   // loại 4 bậc cho 1 dòng đã lưu: tính lại từ điểm; nếu dòng cũ đã bị hạ bậc (ngày công) thì hạ 1 bậc
  cu = String(cu || '').trim();
  if (cu === 'Thiếu công' || cu === 'Học việc' || cu === '' || !isFinite(Number(tong))) return cu;
  var v = Number(tong), moi = loaiKPI_(v), ky = xl4Cu6_(v, luc), thu6 = ['S', 'A+', 'A', 'B', 'C', 'D'];
  if (thu6.indexOf(cu) > thu6.indexOf(ky) && thu6.indexOf(ky) >= 0) { var i = KM_BAC.indexOf(moi); if (i >= 0 && i < KM_BAC.length - 1) moi = KM_BAC[i + 1]; }
  return moi;
}
function xl4Chuyen_() {   // 1 lần: đổi cột Loai đã lưu (KPIThang + KPIQuanLyThang) sang thang 4 bậc – áp ngược mọi tháng, kể cả T9, T10
  var p = PropertiesService.getScriptProperties(); if (p.getProperty('XL4_CHUYEN') === '1') return;
  var lock = LockService.getScriptLock(); if (!lock.tryLock(20000)) return;
  try {
    if (p.getProperty('XL4_CHUYEN') === '1') return;
    ['KPIThang', 'KPIQuanLyThang'].forEach(function(ten) {
      var sh = ss_().getSheetByName(ten); if (!sh || sh.getLastRow() < 2) return;
      var dau = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String);
      var cL = dau.indexOf('Loai'), cT = dau.indexOf('TongKPI'), cC = dau.indexOf('ThoiDiemChot');
      if (cT < 0) cT = dau.indexOf('Tong');
      if (cL < 0 || cT < 0) return;
      var n = sh.getLastRow() - 1, T = sh.getRange(2, cT + 1, n, 1).getValues(), L = sh.getRange(2, cL + 1, n, 1).getValues(),
          C = cC >= 0 ? sh.getRange(2, cC + 1, n, 1).getValues() : null, doi = 0;
      var moi = L.map(function(r, i) {
        var luc = C && C[i][0] ? (C[i][0] instanceof Date ? Utilities.formatDate(C[i][0], 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd') : String(C[i][0]).slice(0, 10)) : '';
        var x = xl4Moi_(T[i][0], r[0], luc); if (x !== r[0]) doi++; return [x]; });
      if (doi) sh.getRange(2, cL + 1, n, 1).setValues(moi);
      try { xoaCache_(ten); } catch (e) {}
    });
    p.setProperty('XL4_CHUYEN', '1');
  } finally { lock.releaseLock(); }
}

""" + s[_k:]
