# -*- coding: utf-8 -*-
"""Vá Code.gs – 28/11 tối (chủ dự án): "trong MỌI số liệu thống kê và hiển thị đều tính các đơn ở tab ĐƠN ƯU TIÊN vào kênh Kho,
không tính đơn ưu tiên là 1 kênh riêng". Giữ o.tab = 'ĐƠN ƯU TIÊN' (để đọc / ghi đúng tab Sheet), chỉ GỘP khi hiển thị / thống kê:
nhãn kênh = 'Kho', danh sách kênh (kenhDs) bỏ ĐƠN ƯU TIÊN, mọi bảng theo kênh gom về KHO (dhTabK_). Nút lọc "★ Đơn ưu tiên" trên web giữ.
Chạy bằng exec() ở CUỐI tests/va-code.py (sau le-ngay)."""
def _R(a, b, n=1):
    global s
    assert s.count(a) == n, ('va-uu-kho: không thấy / thấy nhiều', s.count(a), a[:90])
    s = s.replace(a, b)
_R("'ĐƠN ƯU TIÊN': 'ĐƠN ƯU TIÊN',", "'ĐƠN ƯU TIÊN': 'Kho',")
_R("var DH_NHAN_TAB = {", "function dhTabK_(t) { return t === 'ĐƠN ƯU TIÊN' ? 'KHO' : t; }   // 28/11 tối (chủ dự án): đơn tab ĐƠN ƯU TIÊN tính vào kênh Kho trong mọi thống kê\nvar DH_NHAN_TAB = {")
_R("kenhDs: DH_TABS.map(function(t) {", "kenhDs: DH_TABS.filter(function(t) { return t !== 'ĐƠN ƯU TIÊN'; }).map(function(t) {")
_R("DH_TABS.map(function(t) { var k = DH_NHAN_TAB[t] || t, x = kenh[k]", "DH_TABS.filter(function(t) { return t !== 'ĐƠN ƯU TIÊN'; }).map(function(t) { var k = DH_NHAN_TAB[t] || t, x = kenh[k]")
_R("for (var t in DH_NHAN_TAB) if (DH_NHAN_TAB[t] === r[4]) tabMa[r[2]] = t;", "for (var t in DH_NHAN_TAB) if (DH_NHAN_TAB[t] === r[4] && !tabMa[r[2]]) tabMa[r[2]] = t;")
_R("Object.keys(DH_NHAN_TAB).forEach(function(t) { tabNhan[DH_NHAN_TAB[t]] = t; });", "Object.keys(DH_NHAN_TAB).forEach(function(t) { if (!tabNhan[DH_NHAN_TAB[t]]) tabNhan[DH_NHAN_TAB[t]] = t; });")
_R("var x = theo[o.tab] || (theo[o.tab] = { tab: o.tab, don: {},", "var x = theo[dhTabK_(o.tab)] || (theo[dhTabK_(o.tab)] = { tab: dhTabK_(o.tab), don: {},")
_R("var g = R.m[k], x = theo[g.tab]; if (!x) return;", "var g = R.m[k], x = theo[dhTabK_(g.tab)]; if (!x) return;")
_R("var t = theo[g.tab] || (theo[g.tab] = { tab: g.tab,", "var t = theo[dhTabK_(g.tab)] || (theo[dhTabK_(g.tab)] = { tab: dhTabK_(g.tab),", 2)
_R("var t = theo[o.tab] || (theo[o.tab] = { tab: o.tab, don: 0,", "var t = theo[dhTabK_(o.tab)] || (theo[dhTabK_(o.tab)] = { tab: dhTabK_(o.tab), don: 0,")
_R("var DH_DON_KHOA = 'DH_DON_v18';", "var DH_DON_KHOA = 'DH_DON_v19';   // v19 (28/11 tối): nhãn kênh ĐƠN ƯU TIÊN = Kho")
_R("function dbtLan_(tab) { var t = String(tab || '').toUpperCase().trim(),", "function dbtLan_(tab) { var t = dhTabK_(String(tab || '').toUpperCase().trim()),")   # làn theo cấu hình của kênh Kho
_R("var lanSo = function(tab) { var t = String(tab || '').toUpperCase().trim(); if (CF.kenh && CF.kenh[t])", "var lanSo = function(tab) { var t = dhTabK_(String(tab || '').toUpperCase().trim()); if (CF.kenh && CF.kenh[t])")
