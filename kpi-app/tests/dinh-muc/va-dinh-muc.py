# -*- coding: utf-8 -*-
"""Vá Code.gs – phân tích định mức (21/10, chủ dự án hỏi): sửa theo gợi ý rồi phân tích lại vẫn ra hiệu suất >100%.
Chạy bằng exec() ở cuối tests/va-code.py; dùng chung R() và s. Kiểm thử: tests/dinh-muc.js.

Nguyên nhân:
 1. Từ 18/10 (A1) định mức áp theo NGÀY: sửa định mức thì các ngày trước đó vẫn dùng định mức cũ (sheet LichSuDinhMuc).
    Phân tích cũng dùng định mức theo ngày -> các ngày trước khi sửa vẫn lỏng -> trung vị vẫn >100%.
 2. Giờ có mặt của một ngày được chia cho các công đoạn theo tỷ lệ "giờ chuẩn", nên hiệu suất từng công đoạn thực ra là
    hiệu suất CẢ NGÀY của người đó. Nâng định mức một công đoạn chỉ kéo xuống một phần -> gợi ý "định mức × trung vị / 85"
    luôn thiếu khi người làm nhiều công đoạn trong ngày.
Sửa:
 - Phân tích theo ĐỊNH MỨC ĐANG DÙNG cho mọi ngày của kỳ (trungVi); vẫn trả trungViKy = theo định mức từng ngày (như KPI).
 - Gợi ý cho MỌI công đoạn lệch mốc 85% quá ±3 điểm (CHỈ NÂNG – chủ dự án: định mức chặt thường do người mới đang đào tạo, không hạ), giải cùng lúc mọi công đoạn (lặp, chia đôi khoảng)
   để trung vị sau khi áp gần 85%; trả dmGoiY, trungViSau (dự kiến), itNguoi (< 3 người có dữ liệu).
 - Chủ dự án 21/10: đổi định mức là áp cho CẢ THÁNG đang làm (tháng chưa chốt chính thức): cắt / xóa các đoạn
   LichSuDinhMuc trùng tháng này, HieuLucTu = ngày 1. Kể cả tháng đã chốt chính thức (chủ dự án 21/10) – khi đó
   lời báo nhắc bấm "Chốt bù tháng này" để KPIThang đã lưu tính lại (nhacChotBuDM_)."""

# ---------------------------------------------------------------- 1. hàm phân tích mới (giữ bản cũ đổi tên để so)
R("""function phanTichDinhMucGoc_(token, kieu, giaTri) {""", """function phanTichDinhMucCu_(token, kieu, giaTri) {   // bản trước 21/10 – thay bằng phanTichDinhMucGoc_ ở cuối file""")

# ---------------------------------------------------------------- 2. đổi định mức là áp cho CẢ THÁNG đang làm (chủ dự án 21/10)
# Mọi chỗ đổi định mức (ban điều hành sửa, sửa hàng loạt, duyệt đề xuất, sửa công đoạn) đi qua suaO_('DinhMuc','DinhMucGio')
# -> luuLichSuDM_: định mức cũ chỉ còn giữ cho các ngày TRƯỚC ngày 1 tháng này (kể cả tháng đã chốt).
R("""    var homQua = congNgay_(homNayVN_(), -1), tu = cu.HieuLucTu ? ngayVN_(cu.HieuLucTu) : '';""",
  """    var tuAp = ngayApDM_();                              // ngày 1 tháng này (kể cả tháng đã chốt)
    if (tuAp < homNayVN_()) catLichSuDM_(cu.MaCD, tuAp); // bỏ phần lịch sử trùng tháng này (21/10)
    var homQua = congNgay_(tuAp, -1), tu = cu.HieuLucTu ? ngayVN_(cu.HieuLucTu) : '';""")
_n = s.count("'HieuLucTu', ngayVN_(new Date())") + s.count("HieuLucTu: ngayVN_(new Date())")
s = s.replace("'HieuLucTu', ngayVN_(new Date())", "'HieuLucTu', ngayApDM_()").replace("HieuLucTu: ngayVN_(new Date())", "HieuLucTu: ngayApDM_()")
assert _n == 12, _n   # 6 chỗ ghi DinhMuc (duyệt đề xuất ×2, duyệt tất cả, thêm định mức, sửa công đoạn, BĐH sửa ×2) × 2 dạng

# ---------------------------------------------------------------- 3. lời báo sau khi đổi định mức: tháng đã chốt thì nhắc Chốt bù
for a, b in [
  ("msg: dongY ? 'Đã duyệt và cập nhật định mức.' : 'Đã từ chối đề xuất.' });", "msg: dongY ? nhacChotBuDM_('Đã duyệt và cập nhật định mức.') : 'Đã từ chối đề xuất.' });"),
  ("msg: 'Đã duyệt tất cả ' + n + ' đề xuất và cập nhật định mức.' });", "msg: nhacChotBuDM_('Đã duyệt tất cả ' + n + ' đề xuất và cập nhật định mức.') });"),
  ("return sach_({ ok: true, msg: 'Đã lưu định mức.' });", "return sach_({ ok: true, msg: nhacChotBuDM_('Đã lưu định mức.') });"),
  ("msg: 'Đã cập nhật công đoạn (' + thayDoi.length + ' thay đổi).' });", "msg: (thayDoi.join(' ').indexOf('định mức') >= 0 ? nhacChotBuDM_ : String)('Đã cập nhật công đoạn (' + thayDoi.length + ' thay đổi).') });"),
  ("msg:'Đã cập nhật định mức \"' + cd.TenCD + '\": ' + cu + ' → ' + moi + ' ' + donVi + '.' });", "msg:nhacChotBuDM_('Đã cập nhật định mức \"' + cd.TenCD + '\": ' + cu + ' → ' + moi + ' ' + donVi + '.') });"),
  ("return sach_({ ok:true, soSua:soSua, boQua:boQua, chiTiet:chiTiet, msg:msg });", "return sach_({ ok:true, soSua:soSua, boQua:boQua, chiTiet:chiTiet, msg:nhacChotBuDM_(msg) });"),
]:
  R(a, b)

s = s.rstrip() + '\n' + io.open(os.path.join(os.path.dirname(__file__), 'dinh-muc', 'dinh-muc.gs'), encoding='utf-8').read()
