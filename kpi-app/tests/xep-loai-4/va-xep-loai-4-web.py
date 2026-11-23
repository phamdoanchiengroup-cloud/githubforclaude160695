# -*- coding: utf-8 -*-
"""Vá Index.html – THANG 4 BẬC (chủ dự án 23/11): A ≥ 90 · B 80–89 · C 70–79 · D < 70. Bỏ S / A+.
Chạy bằng exec() ở CUỐI tests/va-index.py. Máy chủ: va-xep-loai-4.py."""
R("if(v>=95)return['S','p-ok'];if(v>=90)return['A+','p-ok'];if(v>=85)return['A','p-ok'];   // thang 22/10",
  "if(v>=90)return['A','p-ok'];   // 23/11: thang 4 bậc A/B/C/D")
R("""'<p>Xếp loại: <span class="cn-pill g">S ≥95</span> <span class="cn-pill g">A+ 90–94</span> <span class="cn-pill g">A 85–89</span> <span class="cn-pill c">B 80–84</span> <span class="cn-pill a">C 70–79</span> <span class="cn-pill r">D &lt;70</span></p>'""",
  """'<p>Xếp loại: <span class="cn-pill g">A ≥90</span> <span class="cn-pill c">B 80–89</span> <span class="cn-pill a">C 70–79</span> <span class="cn-pill r">D &lt;70</span> · Thiếu công: đi làm dưới 50% ngày công; 50–80% ngày công hạ 1 bậc.</p>'""")
R("function loaiFE(v){ return v>=95?'S':(v>=90?'A+':(v>=85?'A':(v>=80?'B':(v>=70?'C':'D')))); }",
  "function loaiFE(v){ return v>=90?'A':(v>=80?'B':(v>=70?'C':'D')); }   /* 23/11: 4 bậc */")
R("""  var t={'S':['vui covu','Hạng <b>S</b> – xuất sắc! Bạn đang <b>dẫn đầu</b>, giữ nhịp này và chỉ mẹo cho đồng đội nhé.'],
    'A+':['vui covu','Rất giỏi! Còn <b>'+f(Math.max(0,95-tong))+'%</b> nữa là lên hạng S.'],
    'A':['vui','Rất tốt! Còn <b>'+f(Math.max(0,90-tong))+'%</b> nữa là lên hạng A+.'],
    'B':['','Ổn định đó! Còn <b>'+f(Math.max(0,85-tong))+'%</b> nữa là lên hạng A.""",
  """  var t={'A':['vui covu','Hạng <b>A</b> – xuất sắc! Bạn đang <b>dẫn đầu</b>, giữ nhịp này và chỉ mẹo cho đồng đội nhé.'],   /* 23/11: thang 4 bậc */
    'B':['','Ổn định đó! Còn <b>'+f(Math.max(0,90-tong))+'%</b> nữa là lên hạng A.""")
R("thu=['D','C','B','A','A+','S'], lenHang=", "thu=['D','C','B','A'], lenHang=")
R("var HOLO_THANG = [[95, 'S'], [90, 'A+'], [85, 'A'], [80, 'B'], [70, 'C'], [0, 'D']];", "var HOLO_THANG = [[90, 'A'], [80, 'B'], [70, 'C'], [0, 'D']];   // 23/11: 4 bậc")
R("[[70, 'C'], [80, 'B'], [85, 'A'], [90, 'A+'], [95, 'S']].forEach(function (m) {", "[[70, 'C'], [80, 'B'], [90, 'A']].forEach(function (m) {")
R("['D', 'C', 'B', 'A', 'A+', 'S'].map(function (l) {", "['D', 'C', 'B', 'A'].map(function (l) {")
R("'Xếp loại: S (≥95), A+ (90–94), A (85–89), B (80–84), C (70–79), D (&lt;70).'", "'Xếp loại: A (≥90), B (80–89), C (70–79), D (&lt;70); Thiếu công khi đi làm dưới 50% ngày công.'")
