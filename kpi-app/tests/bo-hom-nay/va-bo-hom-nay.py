# -*- coding: utf-8 -*-
"""Vá Code.gs – 09/11 (chủ dự án): mọi số thống kê / KPI / biểu đồ / lưu đồ KHÔNG tính ngày đang làm việc (hôm nay chưa xong
-> số lệch). Tính tới hết hôm qua. Giữ nguyên phần vận hành trong ngày (điểm danh, nhập / duyệt sản lượng, cơm, sĩ số hôm nay)
và email / báo cáo đọc riêng. Chạy bằng exec() cuối tests/va-code.py. Kiểm thử: tests/bo-hom-nay.js"""
def _bh(cu, moi, dem=1):
    global s
    assert s.count(cu) == dem, ('bỏ hôm nay: không thấy đúng %d chỗ' % dem, cu[:90], s.count(cu))
    s = s.replace(cu, moi)
def _bhHam(ham, cu, moi, dem=1):
    global s
    a = s.index('function ' + ham + '('); b = s.find('\nfunction ', a + 10); b = len(s) if b < 0 else b
    than = s[a:b]; assert than.count(cu) == dem, ('bỏ hôm nay: ' + ham, cu[:80], than.count(cu))
    s = s[:a] + than.replace(cu, moi) + s[b:]
# KPI (xưởng, tất cả xưởng, cá nhân, máy): bỏ ngày hôm nay khỏi ngày công + vi phạm
_bhHam('kpiThang_', "  var gc=0, sl=0, ng2=0, mauSo=0;\n  Object.keys(ngayCong).forEach(function(ngayR){\n    if (nghiDaiHanNgay(ngayR)) return;",
       "  var gc=0, sl=0, ng2=0, mauSo=0, hnK = homNayVN_();   // 09/11: hôm nay chưa xong -> không tính\n  Object.keys(ngayCong).forEach(function(ngayR){\n    if (ngayR >= hnK) return;\n    if (nghiDaiHanNgay(ngayR)) return;")
_bhHam('kpiThang_', "    return !!ng && ng.slice(0,7) === kyThang;", "    return !!ng && ng.slice(0,7) === kyThang && ng < hnK;")
# Tab Thống kê: ngày làm tới hết hôm qua; nhật ký / chấm công / KCS / nhập trễ / vi phạm hôm nay không tính; bộ nhớ tạm theo ngày
_bhHam('tkNgayLam_', "if (x > hn) break;", "if (x >= hn) break;   // 09/11: tới hết hôm qua")
_bhHam('layThongKe', "  var khoa = 'TK_v1_' + thang;", "  var hnT = homNayVN_(), khoa = 'TK_v2_' + thang + '_' + hnT;   // 09/11: bỏ hôm nay -> số đổi theo ngày")
_bhHam('layThongKe', "var d = ngayVN_(r.Ngay); if (d.slice(0, 7) === thang) cc[r.MaNV + '|' + d] = khTuBanGhi_(r);", "var d = ngayVN_(r.Ngay); if (d.slice(0, 7) === thang && d < hnT) cc[r.MaNV + '|' + d] = khTuBanGhi_(r);")
_bhHam('layThongKe', "var d = ngayVN_(k.Ngay); if (d.slice(0, 7) === thang) {", "var d = ngayVN_(k.Ngay); if (d.slice(0, 7) === thang && d < hnT) {")
_bhHam('layThongKe', "      var d = ngayVN_(r.Ngay); if (d.slice(0, 7) !== thang) return;\n      var st = String(r.TrangThai", "      var d = ngayVN_(r.Ngay); if (d.slice(0, 7) !== thang || d >= hnT) return;\n      var st = String(r.TrangThai")
_bhHam('layThongKe', "docAnToan_('PhatNhapTre').forEach(function(r) { if (ngayVN_(r.Ngay).slice(0, 7) !== thang) return;", "docAnToan_('PhatNhapTre').forEach(function(r) { if (ngayVN_(r.Ngay).slice(0, 7) !== thang || ngayVN_(r.Ngay) >= hnT) return;")
_bhHam('layThongKe', "docAnToan_('ViPham').forEach(function(v) { if (ngayVN_(v.Ngay).slice(0, 7) !== thang) return;", "docAnToan_('ViPham').forEach(function(v) { if (ngayVN_(v.Ngay).slice(0, 7) !== thang || ngayVN_(v.Ngay) >= hnT) return;")
# Sản lượng từng xưởng / đóng gói theo ngày (Thống kê, Tổng quan, biểu đồ) và Lưu đồ quy trình: tới hết hôm qua
_bhHam('layDongGoiNgay', "  var den = homNayVN_(), d0", "  var den = congNgay_(homNayVN_(), -1), d0")
_bhHam('layQuyTrinh', "  var den = homNayVN_(), d0", "  var den = congNgay_(homNayVN_(), -1), d0")
