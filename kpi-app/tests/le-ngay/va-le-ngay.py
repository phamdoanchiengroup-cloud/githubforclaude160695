# -*- coding: utf-8 -*-
"""Vá Code.gs – 28/11 (chủ dự án: "xác định ngày đặt hàng của đơn lẻ qua mã đơn và sắp xếp theo ngày đặt từ trước đến sau").
- Ngày đặt đọc từ mã đơn (dhMaDon_ – đã có). Mã KHÔNG ghi ngày (vd #RHINO38394, #RHINO38069-1) -> suy từ đơn CÙNG TIỀN TỐ có SỐ ĐƠN gần nhất
  (số đơn web tăng dần theo thời gian), đánh dấu o.ngayDoan = 1 (web ghi "≈").
- Bảng đơn nhà máy (Order-Flow) gửi thêm [12] = ngày đặt, [13] = 1 nếu là ngày suy ra.
Chạy bằng exec() ở CUỐI tests/va-code.py."""
def _R(a, b, n=1):
    global s
    assert s.count(a) == n, ('va-le-ngay: không thấy / thấy nhiều', s.count(a), a[:90])
    s = s.replace(a, b)
_R("  try { var gSku = function(o) {",
"""  try { dhNgayDoan_(ds); } catch (eND) {}   // 28/11: đơn lẻ / POD không ghi ngày trong mã -> suy theo số đơn gần nhất
  try { var gSku = function(o) {""")
_R("var DH_DON_KHOA = 'DH_DON_v17';", "var DH_DON_KHOA = 'DH_DON_v18';   // v18 (28/11): ngayDoan (ngày đặt suy theo số đơn)")
_R("o.sku || skuCua_(o.ten), /^WEB L/.test(String(o.tab)) ? String(o.phoi || '').slice(0, 300) : '']; })",
   "o.sku || skuCua_(o.ten), /^WEB L/.test(String(o.tab)) ? String(o.phoi || '').slice(0, 300) : '', o.ngayDat || '', o.ngayDoan ? 1 : 0]; })")   # [12] ngày đặt · [13] ngày suy (28/11) – KHÔNG chèn // giữa dòng (Bài học)
s = s + r"""
/* 28/11 (chủ dự án): ngày đặt của đơn lẻ / POD không ghi ngày trong mã -> lấy theo đơn cùng tiền tố có số đơn gần nhất (số đơn tăng theo thời gian) */
function dhNgayDoan_(ds) {
  var so = function(m) { var x = String(m || '').replace(/^[#\s]+/, '').match(/^([A-Za-z.\-]*?)-?(\d{3,})/); return x ? [x[1].toUpperCase(), Number(x[2])] : null; };
  var moc = {};
  ds.forEach(function(o) { if (!/^WEB L|^POD/i.test(String(o.tab)) || !o.ngayDat) return; var k = so(o.maDon); if (k) (moc[k[0]] = moc[k[0]] || []).push([k[1], o.ngayDat]); });
  ds.forEach(function(o) {
    if (!/^WEB L|^POD/i.test(String(o.tab)) || o.ngayDat) return; var k = so(o.maDon), a = k && moc[k[0]]; if (!a || !a.length) return;
    var tot = null; a.forEach(function(z) { if (!tot || Math.abs(z[0] - k[1]) < Math.abs(tot[0] - k[1])) tot = z; });
    if (tot && Math.abs(tot[0] - k[1]) <= 2000) { o.ngayDat = tot[1]; o.ngayDoan = 1; }
  });
}
"""
