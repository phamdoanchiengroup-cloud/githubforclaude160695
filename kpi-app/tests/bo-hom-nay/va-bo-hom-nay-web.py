# -*- coding: utf-8 -*-
"""Vá Index.html – mục 43 (09/11): KPI tạm tính trong trình duyệt không tính hôm nay; ghi chú "tính tới hết hôm qua".
(Phần Thống kê / Sản lượng xưởng / báo cáo sửa thẳng ở nguồn QuyTrinh: tests/quy-trinh/quy-trinh-web.html.) Chạy cuối tests/va-index.py."""
def _t43(cu, moi, dem=1):
    global s
    assert s.count(cu) == dem, ('mục 43: không thấy đúng %d chỗ' % dem, cu[:80], s.count(cu))
    s = s.replace(cu, moi)
_t43("loc: a.filter(function (r) { return ngay(r.Ngay).slice(0, 7) === th; }) };", "loc: a.filter(function (r) { var d = ngay(r.Ngay); return d.slice(0, 7) === th && d < today(); }) };   // 09/11: không tính hôm nay")
_t43("    if(r.tamTinh) tt.innerHTML='⏳ Kỳ này <b>chưa chốt</b> — số liệu đang tính trực tiếp, có thể thay đổi đến khi chốt.';",
     "    if(r.tamTinh) tt.innerHTML='⏳ Kỳ này <b>chưa chốt</b> — số liệu đang tính trực tiếp, <b>tới hết hôm qua</b> (không tính ngày đang làm), có thể thay đổi đến khi chốt.';")
