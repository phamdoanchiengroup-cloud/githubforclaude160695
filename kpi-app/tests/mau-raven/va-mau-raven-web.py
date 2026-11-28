# -*- coding: utf-8 -*-
"""Vá Index.html – 28/11 (chủ dự án chọn phương án 1 Raven Teal · Seagrass · Apricot): ĐỔI MÀU NHẤN cho
(1) giao diện mới công nhân (.cn-moi, nền sáng – giữ nền sáng) và (2) chế độ nền sáng (data-gd="sang", không giao diện kính).
Nền tối: don-giao-nhan/navy.css (khối cuối). Chạy bằng exec() ở CUỐI tests/va-index.py."""
_k = s.find('</head>')   # thẻ </head> ĐẦU TIÊN (chuỗi '</head>' còn xuất hiện trong mã JS phía sau)
s = s[:_k] + """<style id="mauRaven">
/* 28/11: màu nhấn Apricot (#FF8A1F) + Raven Teal (#1B2A2C). Chữ / liên kết dùng Apricot đậm #A84C00 (≥ 4,5:1 trên nền sáng); nút chính nền Apricot chữ Raven (6,3:1) */
html.cn-moi,html.cn-moi[data-gd],html.cn-moi.holo{--cyan:#A84C00;--acc-rgb:255,138,31}
html.cn-moi header .hlogo{background:#1B2A2C!important;color:#FF8A1F!important}
html.cn-moi .btn.pri{background:#FF8A1F!important;color:#1B2A2C!important;font-weight:700}
html.cn-moi input:focus,html.cn-moi select:focus,html.cn-moi textarea:focus{border-color:#FF8A1F!important;box-shadow:0 0 0 3px rgba(255,138,31,.22)!important}
html.cn-moi #botbar button.on{color:#A84C00!important}
html.cn-moi .btn:focus-visible,html.cn-moi #botbar button:focus-visible{outline-color:#FF8A1F!important}
html[data-gd="sang"]:not(.cn-moi):not(.rs){--cyan:#A84C00;--cyan-d:#FF8A1F;--acc-rgb:255,138,31;--on-acc:#FFFFFF}   /* nền var(--cyan) đậm + chữ trắng 5,6:1 */
html[data-gd="sang"]:not(.cn-moi):not(.rs) .btn.pri{background:#FF8A1F!important;color:#1B2A2C!important;border-color:transparent!important}
html[data-gd="sang"]:not(.cn-moi):not(.rs) .hlogo{background:#1B2A2C!important;color:#FF8A1F!important}
html[data-gd="sang"]:not(.cn-moi):not(.rs) #nav button.on{background:rgba(255,138,31,.14)!important;color:#1B2A2C!important;border-color:transparent!important;box-shadow:inset 3px 0 0 #FF8A1F!important}
html[data-gd="sang"]:not(.cn-moi):not(.rs) .dh-tabb.on,html[data-gd="sang"]:not(.cn-moi):not(.rs) .db-xem button.on,html[data-gd="sang"]:not(.cn-moi):not(.rs) .dh-seg button.on,html[data-gd="sang"]:not(.cn-moi):not(.rs) .dh-sub button.on{background:#FF8A1F!important;color:#1B2A2C!important;border-color:#FF8A1F!important}
html[data-gd="sang"]:not(.cn-moi):not(.rs) .ptitle::after{content:'';display:block;width:46px;height:3px;border-radius:2px;background:#FF8A1F;margin-top:8px}
@media (min-width:901px){html[data-gd="toi"]:not(.cn-moi):not(.rs) #nav,html[data-gd="sang"]:not(.cn-moi):not(.rs) #nav{border-right-color:#FF8A1F!important}}
</style>
""" + s[_k:]
