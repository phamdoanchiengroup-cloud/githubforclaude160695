# -*- coding: utf-8 -*-
"""Vá Index.html – tab Kỹ năng (22/10): ma trận người × kỹ năng, danh mục + duyệt, chờ xác nhận, báo cáo; công nhân: Kỹ năng của tôi.
Chạy bằng exec() trong tests/va-index.py (trước mục chia đôi). Máy chủ: ky-nang/ky-nang.gs. Kiểm thử: tests/ky-nang.js, tests/ky-nang-web.js."""
_k33 = s.rfind('</body>')
s = s[:_k33] + '<script>\n' + io.open(os.path.join(D, 'ky-nang', 'ky-nang-web.js'), encoding='utf-8').read() + '</script>\n' + s[_k33:]
# Menu: nhóm Danh mục; tab cho ban điều hành, trưởng / phó phòng, nhân sự, trợ lý, công nhân
R("""  ['Danh mục',['ns','mm','ts']],""", """  ['Danh mục',['ns','kyn','mm','ts']],""")
R("""['cd','Công đoạn'],['ns','Nhân sự'],['mm','Máy móc'],['ts','Trọng số'],""", """['cd','Công đoạn'],['ns','Nhân sự'],['kyn','Kỹ năng'],['mm','Máy móc'],['ts','Trọng số'],""")
R("""      ['ns','Nhân sự'],['mm','Máy móc']],""", """      ['ns','Nhân sự'],['kyn','Kỹ năng'],['mm','Máy móc']],""")
R("""['kpicn','Bảng KPI xưởng']],""", """['kpicn','Bảng KPI xưởng'],['kyn','Kỹ năng của tôi']],""")
R("""['cd','Công đoạn'],['ns','Hồ sơ nhân sự'],['mm','Máy móc']],""", """['cd','Công đoạn'],['ns','Hồ sơ nhân sự'],['kyn','Kỹ năng'],['mm','Máy móc']],""")
R("""['cd','Công đoạn'],['ns','Nhân sự'],['mm','Máy móc']]
};""", """['cd','Công đoạn'],['ns','Nhân sự'],['kyn','Kỹ năng'],['mm','Máy móc']]
};""")
R("""ptdm:vPTDM,cd:vCD,ns:vNS,""", """ptdm:vPTDM,cd:vCD,ns:vNS,kyn:vKN,""")
R("""var ICON={
""", """var ICON={
  kyn:'<path d="M12 3.5l2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8z"/>',
""")
