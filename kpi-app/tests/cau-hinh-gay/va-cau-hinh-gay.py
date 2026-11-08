# -*- coding: utf-8 -*-
"""Vá Code.gs – Cấu hình gậy (08/11): tab riêng, bản vẽ kỹ thuật theo thông số, chỉ 4 mã NV (C056, C019 duyệt, C077 nhập, C067).
Chạy bằng exec() cuối tests/va-code.py. Kiểm thử: tests/cau-hinh-gay.js"""
def _cg(cu, moi, dem=1):
    global s
    assert s.count(cu) == dem, ('cấu hình gậy: không thấy đúng %d chỗ' % dem, cu[:90], s.count(cu))
    s = s.replace(cu, moi)
# quyền xem tab đi kèm phiên (trình duyệt ẩn / hiện tab; máy chủ vẫn kiểm từng hàm)
_cg("  o.laOwner = (o.vaiTroGoc === 'OWNER');\n  if (o.vaiTro === 'OWNER') o.vaiTro = 'ADMIN';\n  return o;",
    "  o.laOwner = (o.vaiTroGoc === 'OWNER');\n  if (o.vaiTro === 'OWNER') o.vaiTro = 'ADMIN';\n  o.cg = cgQuyenCua_(o);   // 08/11: Cấu hình gậy (tài liệu mật – 4 mã NV)\n  return o;")
# mảnh giao diện CauHinhGay.html: không theo vai trò mà theo mã NV
_cg("QuyTrinh: ['OWNER', 'TP', 'PP'] };", "QuyTrinh: ['OWNER', 'TP', 'PP'], CauHinhGay: [] };   // CauHinhGay (08/11): kiểm theo mã NV ở cgQuyenCua_")
_cg("  var vt = MANH_GD[ten];\n  if (vt && vt.indexOf(me.vaiTro) < 0 && vt.indexOf(me.vaiTroGoc) < 0)",
    "  var vt = MANH_GD[ten];\n  if (ten === 'CauHinhGay') { if (!cgQuyenCua_(me)) return sach_({ ok: false, msg: 'Tài khoản không xem được phần này.' }); vt = null; }\n  if (vt && vt.indexOf(me.vaiTro) < 0 && vt.indexOf(me.vaiTroGoc) < 0)")
s = s.rstrip('\n') + '\n\n' + io.open(os.path.join(os.path.dirname(__file__), 'cau-hinh-gay', 'cau-hinh-gay.gs'), encoding='utf-8').read()
