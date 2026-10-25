# -*- coding: utf-8 -*-
"""Vá Code.gs – KPI quản lý (25/10, chủ dự án): khoản "Không nhắc CN nhập" (-2/lượt) chỉ tính khi công nhân đó THẬT SỰ
bị trừ nề nếp, tức có vi phạm NHAPTRE cùng ngày. Phạt nhập trễ trước 15/09 không ghi vi phạm NHAPTRE (CN không bị trừ)
nên TP/PP cũng không bị trừ. Chạy bằng exec() ở cuối tests/va-code.py. Kiểm thử: tests/khong-nhac.js."""
R("""  // (d) Không nhắc CN nhập: -2/lượt CN bị phạt trễ trong xưởng
  (dt.phatTre || []).forEach(function(p){
    if (String(p.MaXuong) !== String(maXuong)) return;
    var ng = ngayVN_(p.Ngay);
    if (ng.slice(0,7) !== kyThang) return;""",
  """  // (d) Không nhắc CN nhập: -2/lượt CN bị phạt trễ trong xưởng – chỉ lượt CN có vi phạm NHAPTRE cùng ngày (25/10)
  var coNhapTre = {};
  (dt.vipham || []).forEach(function(v){ if (String(v.MaVP).trim() === 'NHAPTRE') coNhapTre[v.MaNV + '|' + ngayVN_(v.Ngay)] = 1; });
  (dt.phatTre || []).forEach(function(p){
    if (String(p.MaXuong) !== String(maXuong)) return;
    var ng = ngayVN_(p.Ngay);
    if (ng.slice(0,7) !== kyThang) return;
    if (!coNhapTre[p.MaNV + '|' + ng]) return;""")
