# -*- coding: utf-8 -*-
"""Vá Code.gs – thang xếp loại mới (chủ dự án 22/10): S ≥ 95, A+ ≥ 90, A ≥ 85, B ≥ 80, C ≥ 70, D < 70.
(Trước: A+ ≥ 100, A ≥ 90, B ≥ 80, C ≥ 70, D < 70.) Chạy bằng exec() ở cuối tests/va-code.py. Kiểm thử: tests/xep-loai.js.
Tháng đã chốt giữ loại đã lưu trong KPIThang (muốn tính lại thì Chốt bù)."""
R("""function loaiKPI_(v) {
  if (v >= 100) return 'A+';
  if (v >= 90) return 'A';""", """function loaiKPI_(v) {             // thang 22/10: S ≥ 95, A+ ≥ 90, A ≥ 85, B ≥ 80, C ≥ 70, D < 70
  if (v >= 95) return 'S';
  if (v >= 90) return 'A+';
  if (v >= 85) return 'A';""")
R("var BC_LOAI = ['A+','A','B','C','D','Học việc'];", "var BC_LOAI = ['S','A+','A','B','C','D','Học việc'];")
R("var BC_MAU_LOAI = { 'A+':'#1e7f5c',", "var BC_MAU_LOAI = { 'S':'#5b3fa8', 'A+':'#1e7f5c',")
# loại cũ lưu trong KPIThang (tháng chốt trước 22/10) có thể không có trong BC_LOAI mới -> vẫn đếm đúng ô
R("tlTot: kp.length ? (phanLoai['A+'] + phanLoai['A']) / kp.length * 100 : null,", "tlTot: kp.length ? (phanLoai['S'] + phanLoai['A+'] + phanLoai['A']) / kp.length * 100 : null,")
R("bcO_('Tỷ lệ xếp loại A+/A',", "bcO_('Tỷ lệ xếp loại S/A+/A',")
R("Xếp loại: A+ ≥ 100, A ≥ 90, B ≥ 80, C ≥ 70, D &lt; 70.", "Xếp loại: S ≥ 95, A+ ≥ 90, A ≥ 85, B ≥ 80, C ≥ 70, D &lt; 70.")
R("<th style=\"width:15%\">Phân loại A+ → D</th>", "<th style=\"width:15%\">Phân loại S → D</th>")
R("""<p class="nho">Thanh phân loại: <span style="color:' + BC_MAU_LOAI['A+'] + '">■</span> A+ """, """<p class="nho">Thanh phân loại: <span style="color:' + BC_MAU_LOAI.S + '">■</span> S <span style="color:' + BC_MAU_LOAI['A+'] + '">■</span> A+ """)
R("sp · Tỷ lệ A+/A: <b>", "sp · Tỷ lệ S/A+/A: <b>")
R("function bcChongLoai_(pl, tong) {             // thanh xếp chồng phân loại A+..D", "function bcChongLoai_(pl, tong) {             // thanh xếp chồng phân loại S..D")
