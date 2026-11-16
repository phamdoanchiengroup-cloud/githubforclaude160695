# -*- coding: utf-8 -*-
# Vá Code.gs – giai đoạn 1 Bán hàng nhập đơn (16/11 khuya): nối tests/don-ban/don-ban.gs + vai trò BH.
# Chạy bằng exec() cuối tests/va-code.py (sau cau-hinh-gay sửa MANH_GD). Kiểm thử: tests/don-ban.js
s = s.rstrip() + '\n' + io.open(os.path.join(os.path.dirname(__file__), 'don-ban', 'don-ban.gs'), encoding='utf-8').read()

def _tdb(cu, moi, dem=1):
    global s
    assert s.count(cu) == dem, ('va-don-ban: không thấy đúng %d chỗ' % dem, cu[:80], s.count(cu))
    s = s.replace(cu, moi)

# Bảo mật (bao-mat-ung-dung 16/11): tài khoản BH bị CHẶN MẶC ĐỊNH ở mọi hàm – chỉ các hàm đặt __CHO_BH = true mới đọc được phiên BH
_tdb("var __KHOA = null;", "var __KHOA = null;\nvar __CHO_BH = false;   // 16/11 khuya: hàm cho phép tài khoản Bán hàng (BH) đặt true trước docPhien_")
_tdb("  if (o.vaiTro === 'OWNER') o.vaiTro = 'ADMIN';\n  o.cg = cgQuyenCua_(o);",
     "  if (o.vaiTro === 'OWNER') o.vaiTro = 'ADMIN';\n  if (o.vaiTro === 'BH' && !__CHO_BH) return null;   // 16/11 khuya: Bán hàng chỉ dùng được trang Đơn hàng của tôi + đăng nhập / đổi mật khẩu\n  o.cg = cgQuyenCua_(o);")
for _h in ['function napDuLieuLoi_(token, phan) {\n', 'function dangXuat(token) {\n', 'function doiMatKhau(token, cu, moi) {\n', 'function layManhGiaoDien(token, ten) {\n',
           'function layDonBan(token) {\n', 'function luuDonBan(token, p) {\n', 'function xoaDonBan(token, p) {\n']:
    _tdb(_h, _h + '  __CHO_BH = true;   // 16/11 khuya: hàm Bán hàng được gọi\n')
# napDuLieu: BH nhận gói rỗng như bếp / nhóm báo cơm (không có KPI, nhân sự, nhật ký…)
_tdb("  if (me.vaiTro === 'BEP' || me.vaiTro === 'NHOM' || me.vaiTro === 'NV' || me.vaiTro === 'TBP') {",
     "  if (me.vaiTro === 'BEP' || me.vaiTro === 'NHOM' || me.vaiTro === 'NV' || me.vaiTro === 'TBP' || me.vaiTro === 'BH') {   // 16/11 khuya: + BH (Bán hàng)")
_tdb("var HS_KHONG_BAT_BUOC = ['OWNER', 'ADMIN', 'NHOM', 'BEP'];", "var HS_KHONG_BAT_BUOC = ['OWNER', 'ADMIN', 'NHOM', 'BEP', 'BH'];   // 16/11 khuya: + BH – hồ sơ Bán hàng quản lý ở danh sách nhân sự ngoài SX")
_tdb("var MANH_GD = { ", "var MANH_GD = { DonBan: ['BH', 'ADMIN'], ")   # 16/11 khuya: mảnh trang Đơn hàng của tôi (ADMIN = người duyệt; hàm máy chủ kiểm lại quyền)
# người duyệt: cờ để web hiện tab "Đơn bán hàng" + số chờ duyệt
_tdb("  me.banMay = KPI_BAN_MAY;\n", "  me.banMay = KPI_BAN_MAY;\n  try { me.dbDuyet = dhCoHuy_(me) ? 1 : 0; } catch (eDB) { me.dbDuyet = 0; }   // 16/11 khuya: duyệt đơn Bán hàng\n")
