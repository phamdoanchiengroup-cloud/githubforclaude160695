# -*- coding: utf-8 -*-
# Vá Code.gs – giai đoạn 1 Bán hàng nhập đơn (16/11 khuya): nối tests/don-ban/don-ban.gs + vai trò BH.
# Chạy bằng exec() cuối tests/va-code.py (sau cau-hinh-gay sửa MANH_GD). Kiểm thử: tests/don-ban.js
s = s.rstrip() + '\n' + io.open(os.path.join(os.path.dirname(__file__), 'don-ban', 'don-ban.gs'), encoding='utf-8').read()
# 17/11: ngày dự kiến xong + bảng đơn nhà máy + đang xem (du-kien.gs), giai đoạn 2 khóa cột Sheet đơn (khoa-sheet.gs)
for _f in ['du-kien.gs', 'khoa-sheet.gs', 'thu-don.gs', 'tom-tat.gs']:   # 18/11: + Sheet tóm tắt cho trợ lý   # 17/11 khuya: + thử trước khi đặt / đề nghị ưu tiên
    s = s.rstrip() + '\n' + io.open(os.path.join(os.path.dirname(__file__), 'don-ban', _f), encoding='utf-8').read()

def _tdb(cu, moi, dem=1):
    global s
    assert s.count(cu) == dem, ('va-don-ban: không thấy đúng %d chỗ' % dem, cu[:80], s.count(cu))
    s = s.replace(cu, moi)

# Bảo mật (bao-mat-ung-dung 16/11): tài khoản BH bị CHẶN MẶC ĐỊNH ở mọi hàm – chỉ các hàm đặt __CHO_BH = true mới đọc được phiên BH
_tdb("var __KHOA = null;", "var __KHOA = null;\nvar __BH_CHAN = false;   // 21/11: lượt này chặn tài khoản BH (KHÔNG phải hết phiên) -> sach_ đổi hetHan thành báo không dùng được\nvar __CHO_BH = false;   // 16/11 khuya: hàm cho phép tài khoản Bán hàng (BH) đặt true trước docPhien_")
_tdb("  if (o.vaiTro === 'OWNER') o.vaiTro = 'ADMIN';\n  o.cg = cgQuyenCua_(o);",
     "  if (o.vaiTro === 'OWNER') o.vaiTro = 'ADMIN';\n  if (o.vaiTro === 'BH' && !__CHO_BH) { __BH_CHAN = true; return null; }   // 16/11 khuya: Bán hàng chỉ dùng được trang Đơn hàng của tôi + đăng nhập / đổi mật khẩu\n  o.cg = cgQuyenCua_(o);")
for _h in ['function napDuLieuLoi_(token, phan) {\n', 'function dangXuat(token) {\n', 'function doiMatKhau(token, cu, moi) {\n', 'function layManhGiaoDien(token, ten) {\n',
           'function layDonBan(token) {\n', 'function luuDonBan(token, p) {\n', 'function xoaDonBan(token, p) {\n', 'function layBangDonNhaMay(token) {\n',
           'function thuDonBH(token, p) {\n', 'function guiDeNghiUu(token, p) {\n', 'function viSaoDonBH(token, p) {\n']:
    _tdb(_h, _h + '  __CHO_BH = true;   // 16/11 khuya: hàm Bán hàng được gọi\n')
# napDuLieu: BH nhận gói rỗng như bếp / nhóm báo cơm (không có KPI, nhân sự, nhật ký…)
_tdb("  if (me.vaiTro === 'BEP' || me.vaiTro === 'NHOM' || me.vaiTro === 'NV' || me.vaiTro === 'TBP') {",
     "  if (me.vaiTro === 'BEP' || me.vaiTro === 'NHOM' || me.vaiTro === 'NV' || me.vaiTro === 'TBP' || me.vaiTro === 'BH') {   // 16/11 khuya: + BH (Bán hàng)")
_tdb("var HS_KHONG_BAT_BUOC = ['OWNER', 'ADMIN', 'NHOM', 'BEP'];", "var HS_KHONG_BAT_BUOC = ['OWNER', 'ADMIN', 'NHOM', 'BEP', 'BH'];   // 16/11 khuya: + BH – hồ sơ Bán hàng quản lý ở danh sách nhân sự ngoài SX")
_tdb("var MANH_GD = { ", "var MANH_GD = { DonBan: ['BH', 'ADMIN'], ")   # 16/11 khuya: mảnh trang Đơn hàng của tôi (ADMIN = người duyệt; hàm máy chủ kiểm lại quyền)
# người duyệt: cờ để web hiện tab "Đơn bán hàng" + số chờ duyệt
_tdb("  me.banMay = KPI_BAN_MAY;\n", "  me.banMay = KPI_BAN_MAY;\n  try { me.dbDuyet = dhCoHuy_(me) ? 1 : 0; } catch (eDB) { me.dbDuyet = 0; }   // 16/11 khuya: duyệt đơn Bán hàng\n")
# 17/11 giai đoạn 2: nhật ký sửa tay cột khóa – dùng trigger onEdit đã có của Sheet đơn; rà lại khóa ở lượt đồng bộ 10 phút
_tdb("function DH_TAB10_SUA(e) { if (!noiBo_(e)) return; ", "function DH_TAB10_SUA(e) { if (!noiBo_(e)) return; try { dhkSuaTay_(e); } catch (eK) {} ")
_tdb("dhTab10Tao_(); } else dhTab10DongBo_(); } catch (e) {}", "dhTab10Tao_(); } else dhTab10DongBo_(); try { dhkRa_(); } catch (eK) {} } catch (e) {}")
# 18/11: Sheet "Tóm tắt đơn hàng cho trợ lý (web)" – ghi sau lượt đồng bộ 10 phút (ngoài khóa, giãn 60 phút)
_tdb(" finally { l.releaseLock(); } }   /* 16/11 khuya: vừa hủy", " finally { l.releaseLock(); } try { dttCapNhat_(false); } catch (eT) {} }   /* 16/11 khuya: vừa hủy")
# 21/11 (Bán hàng báo "cứ bị hết phiên"): web gọi napComTrua / layBongDa / layKPIKy cho mọi tài khoản sau đăng nhập -> BH bị chặn
# ở docPhien_ -> máy chủ trả hetHan -> web đăng xuất. Nay lượt bị chặn vì là BH trả { ok:false, bhChan:1 } (KHÔNG hetHan).
_tdb("  var r = sachLoi_(v);\n", "  var r = sachLoi_(v);\n  if (__BH_CHAN && r && typeof r === 'object' && r.hetHan) r = { ok: false, bhChan: 1, msg: 'Tài khoản Bán hàng không dùng chức năng này.' };   // 21/11\n")

