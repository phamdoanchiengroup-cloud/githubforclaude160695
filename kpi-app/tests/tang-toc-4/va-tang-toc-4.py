# -*- coding: utf-8 -*-
"""Vá Code.gs – tăng tốc đợt 4 (08/11): Sheets API tự bật + lịch giữ nóng nhật ký (tự cài khi chủ sở hữu mở web).
Chạy bằng exec() cuối tests/va-code.py. Kiểm thử: tests/tang-toc-4.js"""
def _t4(cu, moi, dem=1):
    global s
    assert s.count(cu) == dem, ('tăng tốc 4: không thấy đúng %d chỗ' % dem, cu[:90], s.count(cu))
    s = s.replace(cu, moi)
# bản nhớ nhật ký sống 15 phút (lịch 5 phút làm mới khi quá 8 phút) + ghi lúc ghi
_t4("var NKD_TEN = 'NhatKySanXuat', NKD_K = 'NKD3', NKD_GIAY = 600, NKD_MANH = 90000;",
    "var NKD_TEN = 'NhatKySanXuat', NKD_K = 'NKD3', NKD_GIAY = 900, NKD_MANH = 90000;   // 08/11 đợt 4: 10 -> 15 phút, lịch giữ nóng làm mới trước khi hết")
_t4("var c = CacheService.getScriptCache(); c.putAll(p, NKD_GIAY); c.put(NKD_K + '_m', JSON.stringify({ pb: pb, n: n }), NKD_GIAY);",
    "var c = CacheService.getScriptCache(); c.putAll(p, NKD_GIAY); c.put(NKD_K + '_m', JSON.stringify({ pb: pb, n: n }), NKD_GIAY); c.put(NKD_K + '_t', String(Date.now()), NKD_GIAY);")
# tắt tay Sheets API: ghi nhớ để lịch không tự bật lại
_t4("PropertiesService.getScriptProperties().setProperty('KPI_SHEETS_API', '0'); Logger.log('Đã tắt đọc gộp.'); }",
    "PropertiesService.getScriptProperties().setProperty('KPI_SHEETS_API', '0'); PropertiesService.getScriptProperties().setProperty('KPI_SHEETS_TAT', '1'); Logger.log('Đã tắt đọc gộp.'); }")
# chủ sở hữu đăng nhập / nạp dữ liệu -> tự cài lịch giữ nóng (1 lần)
_t4("  me.banMay = KPI_BAN_MAY;\n", "  me.banMay = KPI_BAN_MAY;\n  if (me.laOwner) { try { tt4CaiLich_(); } catch (e) {} }   // 08/11 đợt 4: tự cài lịch giữ nóng đăng nhập\n")
# đọc gộp ngay từ đầu (trước khi đọc phiên: TaiKhoan, NhanSu, PhongBan) + thêm LichSuDinhMuc -> cả gói đăng nhập 1 lượt đọc
_t4("  'NghiDaiHan', 'YeuCauSuaHoSo', 'ThongBao', 'NgayLe', 'MienTruDiemDanh', 'KPIThang', 'PhatNhapTre', 'MienTruKPIQuanLy'];",
    "  'NghiDaiHan', 'YeuCauSuaHoSo', 'ThongBao', 'NgayLe', 'MienTruDiemDanh', 'KPIThang', 'PhatNhapTre', 'MienTruKPIQuanLy', 'LichSuDinhMuc'];   // 08/11 đợt 4: + LichSuDinhMuc")
_t4("function napDuLieuLoi_(token, phan) {\n  try {\n", "function napDuLieuLoi_(token, phan) {\n  try {\n  if (!phan) { try { napTruoc_(SHEET_NAP_); } catch (e0) {} }   // 08/11 đợt 4: đọc gộp trước cả bước đọc phiên\n")
# Thống kê › Tốc độ web: trạng thái Sheets API + lịch giữ nóng
_t4("return sach_({ ok: true, moc: TD_MOC, ngay: ngay, nhatKyDong: nk, nkDem: nkdLay_(nkdPB_()) ? 1 : 0 });",
    "return sach_({ ok: true, moc: TD_MOC, ngay: ngay, nhatKyDong: nk, nkDem: nkdLay_(nkdPB_()) ? 1 : 0, tt4: tt4TrangThai_() });")
s = s.rstrip('\n') + '\n\n' + io.open(os.path.join(os.path.dirname(__file__), 'tang-toc-4', 'toc-do-4.gs'), encoding='utf-8').read()
