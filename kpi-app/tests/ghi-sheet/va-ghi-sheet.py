# -*- coding: utf-8 -*-
"""Vá Code.gs – 28/11 (chủ dự án: "duyệt 1 đơn từ web, sheet ghi mã đơn ở mỗi dòng sản phẩm"): dbGhiSheet_ ghi GIỐNG CÁCH SHEET ĐANG GHI ở từng tab:
- Mã đơn: chỉ ở dòng đầu đơn nếu tab đó để trống mã ở các dòng sau (Dealer, Kho, Đơn ưu tiên, POD, A Đông); tab nào đang lặp lại mã ở mọi dòng (Web lẻ thường) thì lặp.
- Dòng "TỔNG SL CÒN THIẾU" cuối đơn nhiều mã: chỉ thêm ở tab đang có dòng này (Dealer, Kho, Đơn ưu tiên) – nhãn ở cột Loại phôi, cột SX CÒN THIẾU = SUM các dòng của đơn.
- Dòng mẫu để chép công thức = dòng SẢN PHẨM cuối cùng (không lấy dòng TỔNG / dòng trống – tránh chép nhầm công thức SUM xuống dòng hàng).
Chạy bằng exec() ở CUỐI tests/va-code.py."""
def _R(a, b, n=1):
    global s
    assert s.count(a) == n, ('va-ghi-sheet: không thấy / thấy nhiều', s.count(a), a[:90])
    s = s.replace(a, b)
_R("""  var ncMau = Math.min(Math.max(sh.getLastColumn(), 1), 60), mau = [];
  try { if (last > meta.hdr) mau = sh.getRange(last, 1, 1, ncMau).getFormulasR1C1()[0]; } catch (e) { mau = []; }""",
"""  var ncMau = Math.min(Math.max(sh.getLastColumn(), 1), 60), mau = [];
  /* 28/11: xem cách tab đang ghi (300 dòng cuối): mã đơn lặp mọi dòng hay chỉ dòng đầu; có dòng TỔNG SL CÒN THIẾU không; dòng mẫu = dòng sản phẩm cuối */
  var lapMa = false, coTong = false, dongMau = 0;
  try {
    if (last > meta.hdr) {
      var tu = Math.max(meta.hdr + 1, last - 299), cu = sh.getRange(tu, 1, last - tu + 1, Math.max(meta.ten, meta.phoi >= 0 ? meta.phoi : 0, 2) + 1).getValues(), lap = 0, trong = 0, truoc = '';
      cu.forEach(function(x, i) {
        var m = String(x[0] == null ? '' : x[0]).trim(), t = String(x[meta.ten] == null ? '' : x[meta.ten]).trim();
        if (x.some(function(c) { return /TỔNG SL CÒN THIẾU/i.test(String(c)); })) { coTong = true; return; }
        if (!t) return; dongMau = tu + i;
        if (!m) trong++; else if (m === truoc) lap++;
        if (m) truoc = m;
      });
      lapMa = lap > trong;
    }
  } catch (eK) {}
  try { if (dongMau) mau = sh.getRange(dongMau, 1, 1, ncMau).getFormulasR1C1()[0]; } catch (e) { mau = []; }""")
_R("""    v[0] = r.MaDon; v[meta.ten] = chuAnToan_(x.ten); v[meta.sl] = x.sl;""",
   """    v[0] = (i === 0 || lapMa) ? r.MaDon : ''; v[meta.ten] = chuAnToan_(x.ten); v[meta.sl] = x.sl;   // 28/11: mã đơn như cách tab đang ghi""")
_R("""  var vals = dong.map(function(x) {
    var v = []; for (var j = 0; j < nc; j++) v.push('');""",
   """  var vals = dong.map(function(x, i) {
    var v = []; for (var j = 0; j < nc; j++) v.push('');""")
_R("""  } catch (eW) { try { sh.getRange(dau, 1, vals.length, Math.max(nc, ncMau)).clearContent(); } catch (eX) {} throw eW; }   // lỗi giữa chừng: xóa phần vừa ghi để duyệt lại được
  return [dau, vals.length];""",
"""    /* 28/11: dòng TỔNG SL CÒN THIẾU cuối đơn nhiều mã (chỉ tab đang có dòng này) */
    if (coTong && vals.length > 1 && cThieu >= 0) {
      var cNhan = meta.phoi >= 0 ? meta.phoi : 2, ct = String.fromCharCode(65 + cThieu);   // cột ≤ Z (SX CÒN THIẾU nằm đầu bảng)
      sh.getRange(dau + vals.length, cNhan + 1).setValue('TỔNG SL CÒN THIẾU');
      if (cThieu < 26) sh.getRange(dau + vals.length, cThieu + 1).setValue('=SUM(' + ct + dau + ':' + ct + (dau + vals.length - 1) + ')');   // setValue chuỗi '=' = công thức
    }
  } catch (eW) { try { sh.getRange(dau, 1, vals.length + 1, Math.max(nc, ncMau)).clearContent(); } catch (eX) {} throw eW; }   // lỗi giữa chừng: xóa phần vừa ghi để duyệt lại được
  return [dau, vals.length];""")
