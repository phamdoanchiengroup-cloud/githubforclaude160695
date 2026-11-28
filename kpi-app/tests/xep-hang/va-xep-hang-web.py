# -*- coding: utf-8 -*-
"""Vá Index.html – XẾP LOẠI THEO THỨ HẠNG XƯỞNG A+ / A / B / C (chủ dự án 28/11). Loại công nhân lấy từ máy chủ (o.loai);
hàm loai(v) / loaiFE(v) chỉ còn là NGƯỠNG dự phòng (TP / PP, KPI trung bình xưởng): A+ ≥ 90, A 80–89, B 70–79, C < 70.
Chạy bằng exec() ở CUỐI tests/va-index.py (sau va-xep-loai-4-web.py)."""
R("if(v>=90)return['A','p-ok'];   // 23/11: thang 4 bậc A/B/C/D\n  if(v>=80)return['B','p-wn'];if(v>=70)return['C','p-wn'];return['D','p-bd'];",
  "if(v>=90)return['A+','p-ok'];   // 28/11: ngưỡng dự phòng – công nhân dùng loại máy chủ (thứ hạng xưởng)\n  if(v>=80)return['A','p-ok'];if(v>=70)return['B','p-wn'];return['C','p-bd'];")
R("function loaiFE(v){ return v>=90?'A':(v>=80?'B':(v>=70?'C':'D')); }   /* 23/11: 4 bậc */",
  "function loaiFE(v){ return v>=90?'A+':(v>=80?'A':(v>=70?'B':'C')); }   /* 28/11: ngưỡng dự phòng */\nfunction mauLoai(l){ return l==='A+'||l==='A'?'p-ok':l==='B'?'p-wn':l==='C'||l==='D'||l==='Thiếu công'?'p-bd':''; }   /* 28/11: màu theo loại máy chủ */")
R("""'<p>Xếp loại: <span class="cn-pill g">A ≥90</span> <span class="cn-pill c">B 80–89</span> <span class="cn-pill a">C 70–79</span> <span class="cn-pill r">D &lt;70</span> · Thiếu công: đi làm dưới 50% ngày công; 50–80% ngày công hạ 1 bậc.</p>'""",
  """'<p>Xếp loại theo <b>thứ hạng trong xưởng</b>: <span class="cn-pill r">C</span> KPI dưới 70%. Trong số người từ 70% trở lên: <span class="cn-pill g">A+</span> 1 người đứng đầu (xưởng dưới 10 người), 2 người (10–15 người), 3 người (trên 15 người); <span class="cn-pill c">B</span> cùng số người đứng cuối; <span class="cn-pill g">A</span> những người còn lại. Bằng điểm xét lần lượt Chất lượng → Sản lượng → An toàn → Tuân thủ. Thiếu công: đi làm dưới 50% ngày công; 50–80% ngày công hạ 1 bậc.</p>'""")
R("'Xếp loại: A (≥90), B (80–89), C (70–79), D (&lt;70); Thiếu công khi đi làm dưới 50% ngày công.'",
  "'Xếp loại theo thứ hạng trong xưởng: KPI dưới 70% là C; trong số từ 70% trở lên, 1/2/3 người đầu xưởng (xưởng dưới 10 / 10–15 / trên 15 người) là A+, cùng số người cuối là B, còn lại A; Thiếu công khi đi làm dưới 50% ngày công.'")
R("    var lo=loai(toi.tong)[0];", "    var lo=toi.loai||loai(toi.tong)[0];   /* 28/11: loại máy chủ */")
R("      var lo=loaiFE(o.tong), mau=mauKPI(o.tong);", "      var lo=o.loai||loaiFE(o.tong), mau=mauKPI(o.tong);   /* 28/11 */", 2)
R("        '<td><span class=\"pill '+loai(o.tong)[1]+'\">'+o.loai+'</span></td>'+", "        '<td><span class=\"pill '+(mauLoai(o.loai)||loai(o.tong)[1])+'\">'+o.loai+'</span></td>'+")
R("    h+='<td><span class=\"pill '+loai(kieu==='ngay'?o.sl:o.tong)[1]+'\">'+o.loai+'</span></td></tr>';", "    h+='<td><span class=\"pill '+(kieu==='ngay'?loai(o.sl)[1]:(mauLoai(o.loai)||loai(o.tong)[1]))+'\">'+o.loai+'</span></td></tr>';")
R("    var k=kpi(ME.maNV), hang=k?loai(k.tong)[0]:'', chuoi=maiChuoi(),", "    var k=kpi(ME.maNV), hang=k?(k.loai||loai(k.tong)[0]):'', chuoi=maiChuoi(),")
R("thu=['D','C','B','A'], lenHang=", "thu=['C','B','A','A+'], lenHang=")
R("    try{ var k=kpi(ME.maNV), h=k?loai(k.tong)[0]:'',", "    try{ var k=kpi(ME.maNV), h=k?(k.loai||loai(k.tong)[0]):'',")
R("oSo('Xếp loại',loaiFE(o.tong))", "oSo('Xếp loại',o.loai||loaiFE(o.tong))")
R("""  var t={'A':['vui covu','Hạng <b>A</b> – xuất sắc! Bạn đang <b>dẫn đầu</b>, giữ nhịp này và chỉ mẹo cho đồng đội nhé.'],   /* 23/11: thang 4 bậc */
    'B':['','Ổn định đó! Còn <b>'+f(Math.max(0,90-tong))+'%</b> nữa là lên hạng A. Thử <b>giảm hàng lỗi</b> – bớt một cái lỗi là điểm tăng lên.'],
    'C':['lo','Tháng này hơi vất vả. Rhino tin bạn làm được hơn! <b>Hỏi trưởng phòng</b> mẹo của công đoạn khó nhé.'],
    'D':['lo',""", """  var t={'A+':['vui covu','Hạng <b>A+</b> – bạn đang <b>dẫn đầu xưởng</b>! Giữ nhịp này và chỉ mẹo cho đồng đội nhé.'],   /* 28/11: xếp theo thứ hạng xưởng */
    'A':['vui','Rất tốt! Vượt lên <b>nhóm dẫn đầu xưởng</b> là lên A+. Bớt một cái lỗi là điểm tăng ngay.'],
    'B':['','Bạn đang ở <b>nhóm cuối</b> của những người đạt 70%. Vượt qua vài đồng đội là lên A – thử <b>giảm hàng lỗi</b> trước nhé.'],
    'C':['lo',""")
R("var HOLO_THANG = [[90, 'A'], [80, 'B'], [70, 'C'], [0, 'D']];   // 23/11: 4 bậc", "var HOLO_THANG = [[90, 'A+'], [80, 'A'], [70, 'B'], [0, 'C']];   // 28/11: hạng KPI trung bình theo ngưỡng A+/A/B/C")
R("[[70, 'C'], [80, 'B'], [90, 'A']].forEach(function (m) {", "[[70, 'B'], [80, 'A'], [90, 'A+']].forEach(function (m) {")
R("['D', 'C', 'B', 'A'].map(function (l) {", "['C', 'B', 'A', 'A+'].map(function (l) {")
R("    var lo=loai(k.tong); if(k.loai){ lo=[k.loai, k.loai==='Thiếu công'?'p-bd':lo[1]]; }", "    var lo=loai(k.tong); if(k.loai){ lo=[k.loai, mauLoai(k.loai)||lo[1]]; }   /* 28/11: màu theo loại máy chủ */")
