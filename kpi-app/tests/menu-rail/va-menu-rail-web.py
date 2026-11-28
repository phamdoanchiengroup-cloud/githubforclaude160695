# -*- coding: utf-8 -*-
"""Vá Index.html – 28/11 (chủ dự án: "cột menu bỏ ẩn toàn bộ như hiện tại mà thu gọn thành cột biểu tượng, khi rê chuột đến thì hiện ra đầy đủ").
Máy tính (≥ 901px), mọi giao diện trừ công nhân giao diện mới (.cn-moi – không có menu trái): menu luôn hiện dạng CỘT BIỂU TƯỢNG 64px;
rê chuột / Tab bàn phím vào cột (hoặc bấm ☰) -> mở rộng đủ chữ, nổi đè lên nội dung (không đẩy trang). Điện thoại giữ như cũ (☰ mở ngăn kéo).
Thay khối 14/11 tối "ẨN MENU TRÁI – chỉ thò mép 8px". Chạy bằng exec() ở CUỐI tests/va-index.py."""
_k = s.find('</head>')   # thẻ </head> ĐẦU TIÊN (chuỗi '</head>' còn xuất hiện trong mã JS phía sau)
s = s[:_k] + """<style id="menuRail">
/* 28/11: menu trái dạng cột biểu tượng (máy tính) */
@media (min-width:901px){
  html:not(.cn-moi) body #nav{transform:none!important;visibility:visible!important;width:64px!important;padding-left:6px!important;padding-right:6px!important;overflow-x:hidden!important;
    transition:width .18s ease,box-shadow .18s ease!important;z-index:150!important;border-right-width:1px!important}
  html:not(.cn-moi) body #nav:hover,html:not(.cn-moi) body #nav:focus-within,html.nav-mo:not(.cn-moi) body #nav{width:var(--nav-w,236px)!important;box-shadow:0 0 50px rgba(0,0,0,.45)!important}
  /* thu gọn: chỉ biểu tượng – ẩn chữ, tiêu đề nhóm, chân menu; số đếm thành chấm nhỏ trên biểu tượng */
  html:not(.cn-moi):not(.nav-mo) body #nav:not(:hover):not(:focus-within) .nl,
  html:not(.cn-moi):not(.nav-mo) body #nav:not(:hover):not(:focus-within) .nav-chan,
  html:not(.cn-moi):not(.nav-mo) body #nav:not(:hover):not(:focus-within) #kpiBan{display:none!important}
  html:not(.cn-moi):not(.nav-mo) body #nav:not(:hover):not(:focus-within) .ngt{font-size:0!important;height:1px;padding:0!important;margin:8px 6px!important;border-top:1px solid var(--line);overflow:hidden}
  html:not(.cn-moi):not(.nav-mo) body #nav:not(:hover):not(:focus-within) button{justify-content:center!important;padding-left:0!important;padding-right:0!important;position:relative}
  html:not(.cn-moi):not(.nav-mo) body #nav:not(:hover):not(:focus-within) button .dem:not(.hide){position:absolute;top:3px;right:6px;min-width:8px;height:8px;padding:0!important;font-size:0!important;border-radius:50%}
  html:not(.cn-moi) body #nav button{white-space:nowrap;overflow:hidden}
  html:not(.cn-moi) body #nav button svg{flex:0 0 auto}
  /* nội dung chừa chỗ cho cột biểu tượng (cột mở rộng thì nổi đè lên, không đẩy trang) */
  html:not(.cn-moi) body #app>#ducbar,html:not(.cn-moi) body #app>#minibar,html:not(.cn-moi) body #app>main{margin-left:66px!important}
}
@media (min-width:901px) and (prefers-reduced-motion:reduce){html:not(.cn-moi) body #nav{transition:none!important}}
</style>
""" + s[_k:]
