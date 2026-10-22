# -*- coding: utf-8 -*-
"""Vá Index.html – KPI phía trình duyệt lấy đúng số máy chủ (22/10, chủ dự án báo KPI "có vẻ không đúng" sau khi đổi định mức).
Chạy bằng exec() trong tests/va-index.py (trước mục chia đôi). Kiểm thử: tests/kpi-may-web.js."""
_k30 = s.rfind('</body>')
s = s[:_k30] + '<script>\n' + io.open(os.path.join(D, 'kpi-may', 'kpi-may.js'), encoding='utf-8').read() + '</script>\n' + s[_k30:]
