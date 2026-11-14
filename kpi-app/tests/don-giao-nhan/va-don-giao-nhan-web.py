# -*- coding: utf-8 -*-
"""Vá Index.html – mục 45 (14/11): Đơn hàng mở cho ban điều hành + TP/PP (giao nhận theo bộ phận, xem tests/quy-trinh/)
+ màu "Carbon Navy" cho nền tối toàn web (navy.css). Ý tưởng từ bản chủ dự án tự sửa bằng AI khác, Claude chỉnh lại. Chạy bằng exec() cuối tests/va-index.py."""
def _t45(a, b):
    global s
    assert s.count(a) == 1, ('mục 45', a[:80], s.count(a)); s = s.replace(a, b)
_t45(""":root{--bg:#1d2125;--panel:#262b30;--panel2:#2f353b;--line:#3e464e;
  --ink:#eef2f4;--ink2:#c3ccd2;--ink3:#9ca8b0;
  --cyan:#2fd3c6;--cyan-d:#138f87;--acc-rgb:47,211,198;--amber:#f0b04e;--red:#f77e7e;--green:#66d49a;
  --on-acc:#062622;--nav-bg:#181b1f;--head-bg:#181b1f;--bot-bg:rgba(24,27,31,.97);--hover:rgba(255,255,255,.05);
  --bong:0 1px 0 rgba(255,255,255,.03) inset;--row-line:rgba(255,255,255,.07)}""",
""":root{--bg:#050a15;--panel:#0b1626;--panel2:#0f1e33;--line:#1c3454;
  --ink:#eaf4ff;--ink2:#b4cbe5;--ink3:#8ea9c9;
  --cyan:#3ea6ff;--cyan-d:#1c6ad1;--acc-rgb:62,166,255;--amber:#ffc857;--red:#ff667d;--green:#3ee0a3;
  --on-acc:#04121f;--nav-bg:#060d1b;--head-bg:#060d1b;--bot-bg:rgba(6,13,27,.97);--hover:rgba(62,166,255,.08);
  --bong:0 14px 34px -24px rgba(0,0,0,.85),inset 0 1px 0 rgba(140,195,255,.09);--row-line:rgba(90,150,220,.13)}""")
_t45("kpiql:1, qt:1, dh:1, tk:1};", "kpiql:1, qt:1, tk:1};   /* 14/11: Đơn hàng mở cho ban điều hành + TP/PP */")
_t45("['qt','Quy trình sản xuất'],['dash','Tổng quan']", "['qt','Quy trình sản xuất'],['dh','Đơn hàng'],['dash','Tổng quan']")
_a45 = s.index('function vDH(){')
_g45 = "if(!ME||!ME.laOwner){ $('main').innerHTML='<div class=\"alert a-wn\">Tab này đang chỉ mở cho tài khoản chủ sở hữu.</div>'; return; }"
assert s.find(_g45, _a45) - _a45 < 40, 'mục 45: không thấy chặn quyền vDH'
s = s[:_a45] + s[_a45:].replace(_g45, "if(!ME||!(ME.laOwner||ME.vaiTro==='ADMIN'||ME.vaiTro==='TP')){ $('main').innerHTML='<div class=\"alert a-wn\">Tab này mở cho ban điều hành và trưởng / phó phòng.</div>'; return; }", 1)
_k45 = s.rfind('</body>')
s = s[:_k45] + '<style id="gdNavy">\n' + io.open(os.path.join(D, 'don-giao-nhan', 'navy.css'), encoding='utf-8').read() + '</style>\n' + s[_k45:]
