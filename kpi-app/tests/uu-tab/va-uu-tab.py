# -*- coding: utf-8 -*-
"""Vá Code.gs – 28/11 (chủ dự án): tab "ĐƠN ƯU TIÊN" thành KÊNH RIÊNG (trước là bản chép của Kho, không cộng).
Chủ dự án đã xóa các dòng trùng ở tab KHO; chốt: (1) vẫn tính làn Kho, hàng ưu tiên xếp trước trong làn; (2) MỌI cột đọc / ghi
ở tab ĐƠN ƯU TIÊN; (3) web có nút lọc kênh riêng "Đơn ưu tiên". An toàn: dòng KHO trùng MÃ ĐƠN + TÊN với tab ưu tiên thì bỏ dòng KHO
(không cộng 2 lần) và báo trong d.trungUu. Chạy bằng exec() ở CUỐI tests/va-code.py (sau sku)."""
def _R(a, b, n=1):
    global s
    assert s.count(a) == n, ('va-uu-tab: không thấy / thấy nhiều', s.count(a), a[:90])
    s = s.replace(a, b)
_R("var DH_TABS = ['DEALER', 'KHO', 'WEB LẺ CUSTOM',", "var DH_TABS = ['DEALER', 'KHO', 'ĐƠN ƯU TIÊN', 'WEB LẺ CUSTOM',")   # 28/11: + ĐƠN ƯU TIÊN (kênh riêng, làn Kho)
_R("var DH_NHAN_TAB = { 'DEALER': 'Dealer', 'KHO': 'Kho',", "var DH_NHAN_TAB = { 'DEALER': 'Dealer', 'KHO': 'Kho', 'ĐƠN ƯU TIÊN': 'ĐƠN ƯU TIÊN',")
# đọc tab ưu tiên: không còn là bản chép -> dòng của nó đã nằm trong ds (vòng DH_TABS); mục Ưu tiên (uu) = chính các dòng đó
_R("""  ss.getSheets().forEach(function(sh) {
    if (uu.length || plChuan_(sh.getName()) !== 'DON UU TIEN') return;""",
"""  /* 28/11 (chủ dự án): tab ĐƠN ƯU TIÊN là KÊNH RIÊNG (đã đọc trong vòng DH_TABS) – mọi dòng của tab là hàng ưu tiên.
     Dòng KHO trùng MÃ ĐƠN + TÊN với tab ưu tiên (còn sót sau khi xóa) -> bỏ dòng KHO, không cộng 2 lần, báo ở trungUu. */
  var trungUu = [];
  try {
    var kUu = function(o) { return String(o.maDon || '').replace(/^[#\\/\\s]+/, '').replace(/\\s+/g, '').toUpperCase() + '|' + dhTenKhoa_(o.ten); }, cuU = {};
    ds.forEach(function(o) { if (o.tab === 'ĐƠN ƯU TIÊN') { cuU[kUu(o)] = 1; if (!o.uuTien) o.uuTien = 'Ưu tiên'; } });
    ds = ds.filter(function(o) { if (o.tab === 'KHO' && cuU[kUu(o)]) { if (trungUu.length < 100) trungUu.push([String(o.maDon || ''), String(o.ten || '').slice(0, 120), o.dong]); return false; } return true; });
    uu = ds.filter(function(o) { return o.tab === 'ĐƠN ƯU TIÊN'; }).map(function(o) {
      var c = {}; for (var kk in o) if (Object.prototype.hasOwnProperty.call(o, kk)) c[kk] = o[kk];
      c.tuTabUu = 1; c.trongKho = 1; return c; });
  } catch (eUT) {}
  ss.getSheets().forEach(function(sh) {
    if (uu.length || DH_TABS.indexOf('ĐƠN ƯU TIÊN') >= 0 || plChuan_(sh.getName()) !== 'DON UU TIEN') return;   // 28/11: chỉ còn dùng khi tab chưa là kênh""")
_R("var kq = { luc: Utilities.formatDate(new Date(), TZ_VN, 'yyyy-MM-dd HH:mm'), don: ds, uu: uu, tre: tre,",
   "var kq = { luc: Utilities.formatDate(new Date(), TZ_VN, 'yyyy-MM-dd HH:mm'), don: ds, uu: uu, trungUu: trungUu, tre: tre,")
_R("return sach_({ ok: true, luc: d.luc, don: don, uu: uu, tre: tre,", "return sach_({ ok: true, luc: d.luc, don: don, uu: uu, trungUu: d.trungUu || [], tre: tre,")
# làn: hàng ưu tiên xếp trước trong làn Kho – dòng tab ưu tiên cũng tính
_R("if (o.tab === 'KHO' && (mu[dbkTC_(o.maDon || '') + '|' + t] || mu['|' + t]))",
   "if ((o.tab === 'KHO' || o.tab === 'ĐƠN ƯU TIÊN') && (mu[dbkTC_(o.maDon || '') + '|' + t] || mu['|' + t]))", 2)
_R("var DH_DON_KHOA = 'DH_DON_v16';", "var DH_DON_KHOA = 'DH_DON_v17';   // v17 (28/11): tab ĐƠN ƯU TIÊN là kênh riêng + trungUu")
# Bản ghi cũ (hủy / bớt / tạm dừng, ★ web, hạn riêng) của các mã này lưu với tab KHO (lúc mã còn ở tab KHO).
# Dòng tab ĐƠN ƯU TIÊN chưa có bản ghi riêng thì dùng bản ghi KHO cùng mã + tên – không mất trạng thái cũ.
_R("    var x = m[ks[i]], z = md[ks[i]], o2 = o;",
   "    var x = m[ks[i]], z = md[ks[i]], o2 = o;\n    if (o.tab === 'ĐƠN ƯU TIÊN') { var kK = ks[i].replace(/\\|ĐƠN ƯU TIÊN(#\\d+)?$/, '|KHO$1'); if (!x) x = m[kK]; if (!z) z = md[kK]; }   // 28/11: bản ghi cũ lưu theo tab KHO")
_R("var uw = dhUuWebDoc_(); don.forEach(function(x) { var w = uw[String(x.maDon || '') + '|' + x.tab];",
   "var uw = dhUuWebDoc_(); don.forEach(function(x) { var w = uw[String(x.maDon || '') + '|' + x.tab] || (x.tab === 'ĐƠN ƯU TIÊN' ? uw[String(x.maDon || '') + '|KHO'] : null);")
_R("var h = m[dhHrKhoa_(o.maDon, o.tab, o.ten)]; if (h) o.hanRieng = h;",
   "var h = m[dhHrKhoa_(o.maDon, o.tab, o.ten)] || (o.tab === 'ĐƠN ƯU TIÊN' ? m[dhHrKhoa_(o.maDon, 'KHO', o.ten)] : null); if (h) o.hanRieng = h;")
_R("    var w = uw[String(x.maDon || '') + '|' + x.tab]; if (w) x.uuWeb = w;",
   "    var w = uw[String(x.maDon || '') + '|' + x.tab] || (x.tab === 'ĐƠN ƯU TIÊN' ? uw[String(x.maDon || '') + '|KHO'] : null); if (w) x.uuWeb = w;")
# 28/11 (2) (chủ dự án: "khóa các cột giống nhau"): tab ĐƠN ƯU TIÊN không còn là tab loại trừ -> khóa cột (Mã đơn / Tên / SL đặt / Deadline / Hạn mới) như tab KHO,
# hủy / bớt / tạm dừng làm được trên dòng tab này; lượt tự rà 6 giờ thấy "tab mới" sẽ tự đặt khóa. Bán hàng vẫn KHÔNG đặt đơn mới thẳng vào tab ưu tiên.
_R("|^SHEET\\d*$|^ĐƠN ƯU TIÊN$|^DON UU TIEN$|", "|^SHEET\\d*$|")
_R("  if (kenh.indexOf(tab) < 0 || DH_TAB_LOAI.test(tab)) return { loi: 'Chọn kênh của đơn.' };",
   "  if (kenh.indexOf(tab) < 0 || DH_TAB_LOAI.test(tab) || tab === 'ĐƠN ƯU TIÊN') return { loi: 'Chọn kênh của đơn.' };   // 28/11: đơn ưu tiên do quản lý chuyển, Bán hàng không đặt thẳng")
