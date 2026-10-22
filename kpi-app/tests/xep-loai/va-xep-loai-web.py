# -*- coding: utf-8 -*-
"""Vá Index.html – thang xếp loại mới (chủ dự án 22/10): S ≥ 95, A+ ≥ 90, A ≥ 85, B ≥ 80, C ≥ 70, D < 70.
Chạy bằng exec() trong tests/va-index.py (trước mục chia đôi). Sơ đồ: tests/so-do/so-do-chung.js; giọng "loại S": tests/am-thanh/."""
R("""  if(v>=100)return['A+','p-ok'];if(v>=90)return['A','p-ok'];""",
  """  if(v>=95)return['S','p-ok'];if(v>=90)return['A+','p-ok'];if(v>=85)return['A','p-ok'];   // thang 22/10""")
R("""        '<tr><td><span class="cn-pill g">A+</span></td><td>≥ 100</td><td>Xuất sắc</td></tr>'+
        '<tr><td><span class="cn-pill g">A</span></td><td>90–99</td><td>Tốt</td></tr>'+""",
  """        '<tr><td><span class="cn-pill g">S</span></td><td>≥ 95</td><td>Xuất sắc</td></tr>'+
        '<tr><td><span class="cn-pill g">A+</span></td><td>90–94</td><td>Rất tốt</td></tr>'+
        '<tr><td><span class="cn-pill g">A</span></td><td>85–89</td><td>Tốt</td></tr>'+""")
R("""<span class="cn-pill g">A+ ≥100</span> <span class="cn-pill g">A 90–99</span>""",
  """<span class="cn-pill g">S ≥95</span> <span class="cn-pill g">A+ 90–94</span> <span class="cn-pill g">A 85–89</span>""")
R("""var lo=(toi.tong>=100?'A+':(toi.tong>=90?'A':(toi.tong>=80?'B':(toi.tong>=70?'C':'D'))));""", """var lo=loai(toi.tong)[0];""")
R("""'Xếp loại: A+ (≥100), A (90–99), B (80–89), C (70–79), D (&lt;70).'""", """'Xếp loại: S (≥95), A+ (90–94), A (85–89), B (80–84), C (70–79), D (&lt;70).'""")
R("""function loaiFE(v){ return v>=100?'A+':(v>=90?'A':(v>=80?'B':(v>=70?'C':'D'))); }""",
  """function loaiFE(v){ return v>=95?'S':(v>=90?'A+':(v>=85?'A':(v>=80?'B':(v>=70?'C':'D')))); }""")
R("""  var t={'A+':['vui covu','Bạn đang <b>dẫn đầu</b>! Giữ nhịp này và chỉ mẹo cho đồng đội nhé.'],
    'A':['vui','Rất tốt! Còn <b>'+f(Math.max(0,100-tong))+'%</b> nữa là lên hạng A+.'],
    'B':['','Ổn định đó! Còn <b>'+f(Math.max(0,90-tong))+'%</b> nữa là lên hạng A.""",
  """  var t={'S':['vui covu','Hạng <b>S</b> – xuất sắc! Bạn đang <b>dẫn đầu</b>, giữ nhịp này và chỉ mẹo cho đồng đội nhé.'],
    'A+':['vui covu','Rất giỏi! Còn <b>'+f(Math.max(0,95-tong))+'%</b> nữa là lên hạng S.'],
    'A':['vui','Rất tốt! Còn <b>'+f(Math.max(0,90-tong))+'%</b> nữa là lên hạng A+.'],
    'B':['','Ổn định đó! Còn <b>'+f(Math.max(0,85-tong))+'%</b> nữa là lên hạng A.""")
R("""thu=['D','C','B','A','A+']""", """thu=['D','C','B','A','A+','S']""")
R("""ma={'D':'lD','C':'lC','B':'lB','A':'lA','A+':'lAp'}[h];""", """ma={'D':'lD','C':'lC','B':'lB','A':'lA','A+':'lAp','S':'lS'}[h];""")
R("""'<tr><td><span class="cn-pill c">B</span></td><td>80–89</td><td>Đạt</td></tr>'""", """'<tr><td><span class="cn-pill c">B</span></td><td>80–84</td><td>Đạt</td></tr>'""")
R("""<span class="cn-pill c">B 80–89</span>""", """<span class="cn-pill c">B 80–84</span>""")
R("""Pháo giấy khi mở KPI cá nhân đạt hạng A/A+""", """Pháo giấy khi mở KPI cá nhân đạt hạng A/A+/S""")
