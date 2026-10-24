# -*- coding: utf-8 -*-
"""Vá Index.html – mục 35: Bảng KPI của ban điều hành / chủ sở hữu mặc định tải tất cả xưởng, xưởng nào xong hiện trước (24/10).
Chạy bằng exec() trong tests/va-index.py (trước mục 27 chia đôi). Kiểm thử: tests/kpi-tat-ca-web.js."""
R("""  var o='<option value=""'+(kpiXuong===''?' selected':'')+'>— Chọn xưởng —</option>';""",
  """  var o='<option value=""'+(kpiXuong===''?' selected':'')+'>— Tất cả xưởng —</option>';""")
_k35 = s.rfind('</body>')
s = s[:_k35] + '<script>\n' + io.open(os.path.join(D, 'kpi-tat-ca', 'kpi-tat-ca.js'), encoding='utf-8').read() + '</script>\n' + s[_k35:]
