# -*- coding: utf-8 -*-
"""Vá Code.gs – XẾP LOẠI THEO THỨ HẠNG TRONG XƯỞNG (chủ dự án 28/11) – thay thang 4 bậc A/B/C/D (23/11).
Công nhân (từ KPI_MOI_TU = T9): KPI < 70 → C; trong những người ≥ 70: N người đầu xưởng → A+, N người cuối → B, còn lại A.
N = 1 (xưởng < 10 CN), 2 (10–15), 3 (> 15) – số CN = tổng công nhân có KPI tháng đó của xưởng. Ít người ≥ 70: ưu tiên A+ trước.
Bằng điểm: xét lần lượt Chất lượng → Sản lượng (hiệu suất) → An toàn → Tuân thủ (chuyên gia vận hành); vẫn bằng → cùng loại.
Thiếu công (< 50% ngày công): không xếp hạng; 50–80% ngày công: vẫn chiếm suất rồi hạ 1 bậc (A+ → A → B → C).
TP / PP và kỳ trung bình cá nhân: ngưỡng A+ ≥ 90, A 80–89, B 70–79, C < 70. Áp ngược T9, T10, T11: xhChuyen_() 1 lần.
Chạy bằng exec() ở CUỐI tests/va-code.py (sau va-xep-loai-4.py). Kiểm thử: tests/xep-hang.js."""
R("""function loaiKPI_(v) {             // 23/11 (chủ dự án): thang 4 bậc A ≥ 90, B 80–89, C 70–79, D < 70 – bỏ S / A+
  if (v >= 90) return 'A';
  if (v >= 80) return 'B';
  if (v >= 70) return 'C';
  return 'D';
}""", """function loaiKPI_(v) {             // 28/11: NGƯỠNG (TP / PP, trung bình kỳ, tháng cũ): A+ ≥ 90, A 80–89, B 70–79, C < 70. Công nhân từ T9 xếp theo THỨ HẠNG xưởng – xhGanLoai_
  if (v >= 90) return 'A+';
  if (v >= 80) return 'A';
  if (v >= 70) return 'B';
  return 'C';
}""")
R("var KM_BAC = ['A', 'B', 'C', 'D'];   // 23/11: thang 4 bậc", "var KM_BAC = ['A+', 'A', 'B', 'C'];   // 28/11: xếp theo thứ hạng A+ / A / B / C")
# thang 4 bậc cũ: hàm riêng cho việc chuyển dữ liệu (không dùng loaiKPI_ / KM_BAC mới)
R("  var v = Number(tong), moi = loaiKPI_(v), ky = xl4Cu6_(v, luc), thu6 = ['S', 'A+', 'A', 'B', 'C', 'D'];\n  if (thu6.indexOf(cu) > thu6.indexOf(ky) && thu6.indexOf(ky) >= 0) { var i = KM_BAC.indexOf(moi); if (i >= 0 && i < KM_BAC.length - 1) moi = KM_BAC[i + 1]; }",
  "  var v = Number(tong), moi = xl4L_(v), ky = xl4Cu6_(v, luc), thu6 = ['S', 'A+', 'A', 'B', 'C', 'D'], B4 = ['A', 'B', 'C', 'D'];\n  if (thu6.indexOf(cu) > thu6.indexOf(ky) && thu6.indexOf(ky) >= 0) { var i = B4.indexOf(moi); if (i >= 0 && i < B4.length - 1) moi = B4[i + 1]; }")
R("function xl4Cu_(l) {   // chữ loại cũ (6 bậc) -> 4 bậc theo ngưỡng; giữ Thiếu công / Học việc\n  l = String(l || '').trim();\n  return l === 'S' || l === 'A+' ? 'A' : l;",
  "function xl4L_(v) { return v >= 90 ? 'A' : v >= 80 ? 'B' : v >= 70 ? 'C' : 'D'; }   // thang 4 bậc 23/11 (chỉ để chuyển dữ liệu cũ)\nfunction xl4Cu_(l) {   // 28/11: loại đã lưu dùng thẳng (thang A+/A/B/C); 'S' (thang 22/10 sót) coi là A+\n  l = String(l || '').trim();\n  return l === 'S' ? 'A+' : l;")
R("var BC_LOAI = ['A','B','C','D','Thiếu công','Học việc'];   // 23/11: thang 4 bậc (+ Thiếu công từ KPI mới)", "var BC_LOAI = ['A+','A','B','C','D','Thiếu công','Học việc'];   // 28/11: A+/A/B/C (D: tháng cũ trước T9 đã lưu thang 4 bậc)")
R("var BC_MAU_LOAI = { 'Thiếu công':'#8e44ad', 'A':'#1e7f5c',", "var BC_MAU_LOAI = { 'Thiếu công':'#8e44ad', 'A+':'#0b6e3b', 'A':'#1e7f5c',")
R("tlTot: kp.length ? phanLoai['A'] / kp.length * 100 : null,", "tlTot: kp.length ? ((phanLoai['A+'] || 0) + (phanLoai['A'] || 0)) / kp.length * 100 : null,")
R("bcO_('Tỷ lệ xếp loại A',", "bcO_('Tỷ lệ xếp loại A+/A',")
R("sp · Tỷ lệ loại A: <b>", "sp · Tỷ lệ A+/A: <b>")
R("Xếp loại: A ≥ 90, B 80–89, C 70–79, D &lt; 70 (Thiếu công: đi làm dưới 50% ngày công).",
  "Xếp loại công nhân theo thứ hạng trong xưởng: KPI &lt; 70 → C; trong số ≥ 70, 1/2/3 người đầu (xưởng &lt;10 / 10–15 / &gt;15 người) → A+, cùng số người cuối → B, còn lại A; Thiếu công: đi làm dưới 50% ngày công; 50–80% ngày công hạ 1 bậc. TP / PP: A+ ≥ 90, A 80–89, B 70–79, C &lt; 70.")
R("""Thanh phân loại: <span style="color:' + BC_MAU_LOAI.A + '">■</span> A """, """Thanh phân loại: <span style="color:' + BC_MAU_LOAI['A+'] + '">■</span> A+ <span style="color:' + BC_MAU_LOAI.A + '">■</span> A """)
R("bac = { 'A': 4, 'B': 3, 'C': 2, 'D': 1 };   // 23/11: 4 bậc", "bac = { 'A+': 4, 'A': 3, 'B': 2, 'C': 1, 'D': 1 };   // 28/11: A+/A/B/C")
R("<th style=\"width:15%\">Phân loại A → D</th>", "<th style=\"width:15%\">Phân loại A+ → C</th>")
# hạng: phá hòa theo Chất lượng → Sản lượng → An toàn → Tuân thủ (giống xếp loại)
R("""    if (b.tong !== a.tong) return b.tong - a.tong;
    if (b.cl   !== a.cl)   return b.cl   - a.cl;
    if (b.tt   !== a.tt)   return b.tt   - a.tt;
    if (b.at   !== a.at)   return b.at   - a.at;
    return b.spl - a.spl;""", """    var x = xhSoSanh_(a, b); if (x) return x;   // 28/11: KPI → Chất lượng → Sản lượng → An toàn → Tuân thủ
    return b.spl - a.spl;""")
# 1) chốt tháng
R("  Object.keys(theoXuong).forEach(function(mx){ sapXepHangHV_(theoXuong[mx], ky); });\n\n  var now = new Date();",
  "  Object.keys(theoXuong).forEach(function(mx){ sapXepHangHV_(theoXuong[mx], ky); xhGanLoai_(theoXuong[mx], ky); });   // 28/11: loại theo thứ hạng xưởng\n\n  var now = new Date();")
R("             r2_(o.tong), loaiCo_(o.MaNV, ky, o.tong), o.spl, r2_(o.gl), r2_(o.gd), o.hang, now, nguoiChot||'Hệ thống' ];",
  "             r2_(o.tong), o.loai, o.spl, r2_(o.gl), r2_(o.gd), o.hang, now, nguoiChot||'Hệ thống' ];")
# 2) bảng KPI theo kỳ (tháng: thứ hạng; quý / năm: thứ hạng trên điểm trung bình, không xét ngày công)
R("  ds.forEach(function(o){ o.loai = loaiCo_(o.MaNV, kyCuoi, o.tong); o.hocViec = laHocViecThang_(o.MaNV, kyCuoi); });",
  "  Object.keys(theoXuong).forEach(function(mx){ xhGanLoai_(theoXuong[mx], kyCuoi, kieu !== 'thang'); });   // 28/11: loại theo thứ hạng xưởng\n  ds.forEach(function(o){ o.hocViec = laHocViecThang_(o.MaNV, kyCuoi); });")
# 3) tính trực tiếp tháng đang chạy
R("""      TongKPI:r2_(k.tong), Loai:loaiCo_(x.MaNV, thg, k.tong), TongSanLuong:k.spl
    });
  });
  return out;""", """      TongKPI:r2_(k.tong), Loai:loaiCo_(x.MaNV, thg, k.tong), TongSanLuong:k.spl
    });
  });
  try { xhGanLoaiDong_(out, thg); } catch (eXH) {}   // 28/11: Loai theo thứ hạng xưởng
  return out;""")
# 4) lịch sử KPI 1 người – tháng chưa chốt: loại theo thứ hạng xưởng tháng đó
R("                 tong:r2_(k.tong), loai:loaiKPI_(k.tong), spl:k.spl, hang:0, daChot:false } : null;",
  "                 tong:r2_(k.tong), loai:xhLoaiMot_(maNV, thg, k.tong), spl:k.spl, hang:0, daChot:false } : null;")
# 5) báo cáo tháng
R("  out.forEach(function(o){ o.loai = loaiCo_(o.MaNV, ky, o.tong); (theoXuong[o.MaXuong] = theoXuong[o.MaXuong] || []).push(o); });\n  Object.keys(theoXuong).forEach(function(mx){ sapXepHangHV_(theoXuong[mx], ky); });",
  "  out.forEach(function(o){ (theoXuong[o.MaXuong] = theoXuong[o.MaXuong] || []).push(o); });\n  Object.keys(theoXuong).forEach(function(mx){ sapXepHangHV_(theoXuong[mx], ky); xhGanLoai_(theoXuong[mx], ky); });   // 28/11: loại theo thứ hạng xưởng")
# 6) gợi ý định mức: số người đổi loại
R("      var o = {}; dsNV.forEach(function(x) { var k = kpiThang_(x.MaNV, kyHT, dt); if (k) o[x.MaNV] = loaiCo_(x.MaNV, kyHT, k.tong); }); return o;",
  "      var o = {}, g = {}; dsNV.forEach(function(x) { var k = kpiThang_(x.MaNV, kyHT, dt); if (k) (g[x.MaXuong] = g[x.MaXuong] || []).push({ MaNV: x.MaNV, tong: k.tong, sl: k.sl, cl: k.cl, tt: k.tt, at: k.at }); });\n      Object.keys(g).forEach(function(mx) { xhGanLoai_(g[mx], kyHT).forEach(function(z) { o[z.MaNV] = z.loai; }); }); return o;   // 28/11: theo thứ hạng xưởng")
# hàm chung + chuyển dữ liệu đã lưu
R("  try { xl4Chuyen_(); } catch (eX4) {}   // 23/11: đổi loại đã lưu sang thang 4 bậc (1 lần)",
  "  try { xl4Chuyen_(); } catch (eX4) {}   // 23/11: đổi loại đã lưu sang thang 4 bậc (1 lần)\n  try { xhChuyen_(); } catch (eXH) {}   // 28/11: xếp lại loại đã lưu T9+ theo thứ hạng xưởng (1 lần, sau xl4Chuyen_)")
_k = s.rfind('function kmTran150T9_()')
s = s[:_k] + r"""/* ===== 28/11 (chủ dự án): XẾP LOẠI THEO THỨ HẠNG TRONG XƯỞNG – A+ / A / B / C ===== */
var XH_NGUONG = 70;
function xhN_(n) { return n < 10 ? 1 : n <= 15 ? 2 : 3; }   // số suất A+ (và B) theo số công nhân của xưởng
function xhSoSanh_(a, b) {   // KPI → Chất lượng → Sản lượng (hiệu suất) → An toàn → Tuân thủ; 0 = bằng hết
  var f = ['tong', 'cl', 'sl', 'at', 'tt'];
  for (var i = 0; i < f.length; i++) { var d = (Number(b[f[i]]) || 0) - (Number(a[f[i]]) || 0); if (Math.abs(d) > 1e-9) return d; }
  return 0;
}
function xhHa_(l) { var i = KM_BAC.indexOf(l); return i >= 0 && i < KM_BAC.length - 1 ? KM_BAC[i + 1] : l; }
/* Lõi (không đọc dữ liệu): arr = [{tong, cl, sl, at, tt, loai0: 'Học việc'|'Thiếu công'|'', ha: true/false}] -> gán o.loai */
function xhXep_(arr) {
  var N = xhN_(arr.length), dd = [];
  arr.forEach(function(o) { if (o.loai0) o.loai = o.loai0; else if (!(Number(o.tong) >= XH_NGUONG)) o.loai = 'C'; else dd.push(o); });
  dd.sort(xhSoSanh_);
  var m = dd.length, nTop = Math.min(N, m), nBot = Math.min(N, m - nTop);
  dd.forEach(function(o, i) {
    o._g = i < nTop ? 'A+' : i >= m - nBot ? 'B' : 'A';
    if (i > 0 && xhSoSanh_(dd[i - 1], o) === 0) o._g = dd[i - 1]._g;   // bằng hết mọi tiêu chí -> cùng loại với người trên
  });
  dd.forEach(function(o) { o.loai = o.ha ? xhHa_(o._g) : o._g; delete o._g; });
  return arr;
}
/* arr = công nhân CÙNG XƯỞNG, cùng kỳ (cần MaNV, tong, cl, sl, at, tt). tb = kỳ trung bình (quý / năm): không xét học việc / ngày công */
function xhGanLoai_(arr, ky, tb) {
  if (!tb && String(ky) < KPI_MOI_TU) { arr.forEach(function(o) { o.loai = loaiCo_(o.MaNV, ky, o.tong); }); return arr; }   // tháng trước T9: giữ cách cũ
  arr.forEach(function(o) {
    o.loai0 = ''; o.ha = false; if (tb) return;
    if (laHocViecThang_(o.MaNV, ky)) { o.loai0 = 'Học việc'; return; }
    if (kmThieuCong_(o.MaNV, ky)) { o.loai0 = 'Thiếu công'; return; }
    var t = kmTyLeCong_(o.MaNV, ky);
    if (t !== null) o.ha = t < KM_CONG_DU;
    else { var lc = kmLoaiChot_(o.MaNV, ky); o._lc = lc; }   // tháng đã chốt không còn số công: so với loại đã lưu
  });
  xhXep_(arr);
  arr.forEach(function(o) {
    if (o._lc && KM_BAC.indexOf(o._lc) > KM_BAC.indexOf(o.loai) && KM_BAC.indexOf(o.loai) >= 0) o.loai = o._lc;   // đã bị hạ bậc lúc chốt -> giữ
    delete o._lc; delete o.loai0; delete o.ha;
  });
  return arr;
}
function xhGanLoaiDong_(rows, ky) {   // dòng dạng KPIThang (HieuSuatSL, ChatLuong, …) -> gán Loai theo xưởng
  var g = {};
  rows.forEach(function(r) { (g[r.MaXuong] = g[r.MaXuong] || []).push({ r: r, MaNV: r.MaNV, tong: Number(r.TongKPI), sl: Number(r.HieuSuatSL), cl: Number(r.ChatLuong), tt: Number(r.TuanThu), at: Number(r.AnToan) }); });
  Object.keys(g).forEach(function(mx) { xhGanLoai_(g[mx], ky).forEach(function(o) { o.r.Loai = o.loai; }); });
  return rows;
}
var __XH_MOT = {};
function xhLoaiMot_(maNV, ky, tong) {   // 1 người, tháng chưa chốt: tính cả xưởng (có nhớ trong lượt gọi)
  if (String(ky) < KPI_MOI_TU) return loaiCo_(maNV, ky, tong);
  try {
    if (!__XH_MOT[ky]) { __XH_MOT[ky] = {}; tinhThangTrucTiep_(ky, '').forEach(function(r) { __XH_MOT[ky][r.MaNV] = r.Loai; }); }
    return __XH_MOT[ky][maNV] || loaiCo_(maNV, ky, tong);
  } catch (e) { return loaiCo_(maNV, ky, tong); }
}
function xhChuyen_() {   // 1 lần: KPIThang tháng ≥ T9 xếp lại theo thứ hạng xưởng từ điểm đã lưu; KPIQuanLyThang theo ngưỡng A+/A/B/C
  var p = PropertiesService.getScriptProperties(); if (p.getProperty('XH_CHUYEN') === '1') return;
  if (p.getProperty('XL4_CHUYEN') !== '1') return;   // cần xl4Chuyen_ chạy trước (đưa loại cũ về 4 bậc để biết ai đã bị hạ bậc)
  var lock = LockService.getScriptLock(); if (!lock.tryLock(20000)) return;
  try {
    if (p.getProperty('XH_CHUYEN') === '1') return;
    var B4 = ['A', 'B', 'C', 'D'];
    var sh = ss_().getSheetByName('KPIThang');
    if (sh && sh.getLastRow() >= 2) {
      var dau = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String), n = sh.getLastRow() - 1;
      var c = function(t) { return dau.indexOf(t); }, cK = c('Ky'), cX = c('MaXuong'), cL = c('Loai'), cT = c('TongKPI'), cS = c('HieuSuatSL'), cC = c('ChatLuong'), cU = c('TuanThu'), cA = c('AnToan');
      if (cK >= 0 && cX >= 0 && cL >= 0 && cT >= 0) {
        var V = sh.getRange(2, 1, n, sh.getLastColumn()).getValues(), g = {};
        V.forEach(function(r, i) {
          var ky = chuanKy_(r[cK]); if (!ky || ky < KPI_MOI_TU) return;
          var luu = String(r[cL] || '').trim(), tong = Number(r[cT]);
          var o = { i: i, tong: tong, sl: Number(r[cS]) || 0, cl: Number(r[cC]) || 0, tt: Number(r[cU]) || 0, at: Number(r[cA]) || 0,
                    loai0: luu === 'Học việc' || luu === 'Thiếu công' ? luu : '', ha: B4.indexOf(luu) > B4.indexOf(xl4L_(tong)) && B4.indexOf(xl4L_(tong)) >= 0 };
          (g[ky + '|' + r[cX]] = g[ky + '|' + r[cX]] || []).push(o);
        });
        var L = V.map(function(r) { return [r[cL]]; });
        Object.keys(g).forEach(function(k) { xhXep_(g[k]).forEach(function(o) { L[o.i] = [o.loai]; }); });
        sh.getRange(2, cL + 1, n, 1).setValues(L);
      }
      try { xoaCache_('KPIThang'); } catch (e) {}
    }
    var sq = ss_().getSheetByName('KPIQuanLyThang');
    if (sq && sq.getLastRow() >= 2) {
      var dq = sq.getRange(1, 1, 1, sq.getLastColumn()).getValues()[0].map(String), qL = dq.indexOf('Loai'), qT = dq.indexOf('TongKPI'), nq = sq.getLastRow() - 1;
      if (qL >= 0 && qT >= 0) {
        var T = sq.getRange(2, qT + 1, nq, 1).getValues(), LQ = sq.getRange(2, qL + 1, nq, 1).getValues();
        sq.getRange(2, qL + 1, nq, 1).setValues(T.map(function(r, i) { return [r[0] === '' || r[0] == null ? LQ[i][0] : loaiKPI_(Number(r[0]))]; }));
      }
      try { xoaCache_('KPIQuanLyThang'); } catch (e) {}
    }
    p.setProperty('XH_CHUYEN', '1');
  } finally { lock.releaseLock(); }
}

""" + s[_k:]
