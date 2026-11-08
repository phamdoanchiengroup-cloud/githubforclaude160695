# -*- coding: utf-8 -*-
"""Vá Code.gs – dọn dẹp hằng tháng (08/11): sao lưu tháng (24 bản) + nhật ký sản lượng giữ 2 tháng (cũ hơn sang trang lưu trữ)
+ nhật ký thao tác giữ 2 tháng (cũ hơn xóa). Các phép tính dài ngày đọc thêm trang lưu trữ (docNKTu_).
Chạy bằng exec() cuối tests/va-code.py. Kiểm thử: tests/luu-tru.js"""
def _ld(cu, moi, dem=1):
    global s
    assert s.count(cu) == dem, ('dọn dẹp: không thấy đúng %d chỗ' % dem, cu[:90], s.count(cu))
    s = s.replace(cu, moi)
def _ldHam(ham, cu, moi):   # thay trong thân 1 hàm
    global s
    a = s.index('function ' + ham + '('); b = s.find('\nfunction ', a + 10); b = len(s) if b < 0 else b
    than = s[a:b]; assert than.count(cu) == 1, ('dọn dẹp: ' + ham, cu, than.count(cu))
    s = s[:a] + than.replace(cu, moi) + s[b:]
_ld("var SO_THANG_GIU = 3;", "var SO_THANG_GIU = 1;   // 08/11 (chủ dự án): sheet chính giữ tháng này + tháng trước")
_ldHam('hoSoNhanVien', "doc_('NhatKySanXuat')", "docNKTu_('')")
_ldHam('layQuyTrinh', "doc_('NhatKySanXuat')", "docNKTu_(tu)")
_ldHam('dhDongGoiNgay_', "doc_('NhatKySanXuat')", "docNKTu_(tu)")
_ldHam('dhSanLuongXuong_', "doc_('NhatKySanXuat')", "docNKTu_(tu)")
_ldHam('dpTinh_', "doc_('NhatKySanXuat')", "docNKTu_(dpCongNgay_(hn, -45))")
_ldHam('kiemTraTonThang', "doc_('NhatKySanXuat')", "docNKTu_(String(kyThang || kyVN_()) + '-01')")
_ldHam('layThongKe', "docAnToan_('NhatKySanXuat')", "docNKTu_(kyTruoc_(thang) + '-01')")
_ld("  if (me.laOwner) { try { tt4CaiLich_(); } catch (e) {} }", "  if (me.laOwner) { try { tt4CaiLich_(); } catch (e) {} try { ldCaiLich_(); } catch (e) {} }   // + lịch dọn dẹp hằng tháng")
s = s.rstrip('\n') + '\n\n' + io.open(os.path.join(os.path.dirname(__file__), 'luu-tru', 'luu-tru.gs'), encoding='utf-8').read()
