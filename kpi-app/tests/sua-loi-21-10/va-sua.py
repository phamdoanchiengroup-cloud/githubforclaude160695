# -*- coding: utf-8 -*-
"""Vá Code.gs – 4 lỗi chủ dự án báo 21/10. Chạy bằng exec() ở cuối tests/va-code.py (sau va-van-hanh.py); dùng chung R() và s.
Kiểm thử: tests/sua-loi-21-10.js."""

# ======================================================================= 1. TRƯỞNG/PHÓ PHÒNG CHỈ XEM BẢNG KPI XƯỞNG MÌNH
# Trước: TP gọi layKPIKy với maXuong '' -> nhận KPI mọi xưởng. Nay máy chủ ép về xưởng của tài khoản.
R("""  if (me.vaiTro === 'CN') { if (!me.xuong) return sach_({ ok:false, msg:'Tài khoản chưa gắn xưởng.' }); maXuong = me.xuong; }
  else if (!xemCaNhaMay_(me) && me.vaiTro !== 'TP') return sach_({ ok:false, msg:'Không có quyền xem bảng KPI.' });""",
  """  if (me.vaiTro === 'CN' || me.vaiTro === 'TP') { if (!me.xuong) return sach_({ ok:false, msg:'Tài khoản chưa gắn xưởng.' }); maXuong = me.xuong; }   // TP/PP: chỉ xưởng mình (21/10)
  else if (!xemCaNhaMay_(me)) return sach_({ ok:false, msg:'Không có quyền xem bảng KPI.' });""")

# ======================================================================= 3. SẢN LƯỢNG CHỜ DUYỆT KHÔNG HIỆN CHO TP/PP
# Trước: lọc nhật ký của TP theo công đoạn ĐANG DÙNG -> công đoạn chuyển "Ngừng" sau khi công nhân gửi thì dòng chờ duyệt
# biến mất khỏi màn duyệt (công nhân cũng không gửi lại được vì "đang chờ duyệt"). Nay lọc theo mọi công đoạn của xưởng.
R("""    if (me.vaiTro === 'TP') {
      var mine = {};
      congdoan.forEach(function(c) { if (c.MaXuong === me.xuong) mine[c.MaCD] = 1; });""",
  """    if (me.vaiTro === 'TP') {
      var mine = {};
      doc_('CongDoan').forEach(function(c) { if (c.MaXuong === me.xuong) mine[c.MaCD] = 1; });   // kể cả công đoạn đã Ngừng (21/10)""")
# Tên công đoạn đã ngừng (để màn duyệt / lịch sử hiện đúng tên thay cho mã)
R("""  if (can('cd')) {
    out.congdoan = congdoan;""", """  if (can('cd')) {
    out.congdoan = congdoan;
    out.cdNgung = doc_('CongDoan').filter(function(x) { return x.TrangThai === 'Ngừng'; })
      .map(function(x) { return { MaCD: x.MaCD, TenCD: x.TenCD, MaXuong: x.MaXuong, CachCham: x.CachCham, ngung: true }; });""")

# ======================================================================= 4. NGÀY BỊ TỪ CHỐI ĐÃ GỬI LẠI VẪN BÁO "NHẬP LẠI"
# Dòng bị từ chối giữ trạng thái "Từ chối" mãi. Ngày nào công nhân đã gửi lại (có dòng Chờ duyệt / Đã chốt) thì thôi nhắc.
R("""    out.canNhapLai = (me.vaiTro === 'CN' ? doc_('NhatKySanXuat').filter(function(r) {
      return r.MaNV === me.maNV && String(r.TrangThai).trim() === 'Từ chối';
    }).map(function(r) { return { Ngay: ngayVN_(r.Ngay), MaCD: r.MaCD, LyDo: r.LyDoTuChoi || r.GhiChu || '' }; }) : []);""",
  """    out.canNhapLai = (me.vaiTro === 'CN' ? (function() {
      var cuaToi = doc_('NhatKySanXuat').filter(function(r) { return r.MaNV === me.maNV; }), daGuiLai = {};
      cuaToi.forEach(function(r) { var tt = String(r.TrangThai).trim(); if (tt === 'Chờ duyệt' || tt === 'Đã chốt') daGuiLai[ngayVN_(r.Ngay)] = 1; });
      return cuaToi.filter(function(r) { return String(r.TrangThai).trim() === 'Từ chối' && !daGuiLai[ngayVN_(r.Ngay)]; })   // đã gửi lại thì thôi nhắc (21/10)
        .map(function(r) { return { Ngay: ngayVN_(r.Ngay), MaCD: r.MaCD, LyDo: r.LyDoTuChoi || r.GhiChu || '' }; });
    })() : []);""")

# ======================================================================= 2. NGHỈ CẢ NGÀY MÀ VẪN BỊ PHẠT NHẬP TRỄ
# Phạt nhập trễ chạy tự động 17h ngày làm việc thứ 3; nếu ngày nghỉ được chấm SAU lúc đó (dữ liệu thật: nghỉ 3–8/9, phạt 10/9,
# chấm nghỉ 28/9) thì điểm phạt còn nguyên. Nay mỗi lần lưu điểm danh / lịch tháng / nghỉ dài hạn và mỗi lần chạy phạt
# đều gỡ các lượt phạt tự động rơi vào ngày nghỉ cả ngày, nghỉ dài hạn hoặc ngày lễ.
R("""/* Trigger: chạy mỗi ngày. Rà các ngày đã quá hạn, phạt CN chưa nhập. */""",
  """/* Gỡ phạt nhập trễ tự động (PhatNhapTre + vi phạm NHAPTRE do hệ thống ghi) của những ngày hóa ra là ngày nghỉ:
   nghỉ cả ngày theo chấm công, nghỉ dài hạn, ngày lễ. Trả số lượt đã gỡ. Lỗi thì bỏ qua (không làm hỏng việc lưu). */
function goPhatNgayNghi_() {
  try {
    if (!ss_().getSheetByName('PhatNhapTre')) return 0;
    var phat = doc_('PhatNhapTre');
    var vp = ss_().getSheetByName('ViPham') ? doc_('ViPham').filter(function(v) {
      return v.MaVP === 'NHAPTRE' && (String(v.NguoiGhi || '').indexOf('Hệ thống') === 0 || String(v.GhiChu || '').indexOf('Tự động') === 0);
    }) : [];
    if (!phat.length && !vp.length) return 0;
    var cc = {}, ndh = {}, mx = {};
    docAnToan_('DiemDanhNghi').forEach(function(r) { cc[r.MaNV + '|' + ngayVN_(r.Ngay)] = khTuBanGhi_(r); });
    docAnToan_('NghiDaiHan').forEach(function(r) { (ndh[r.MaNV] = ndh[r.MaNV] || []).push({ tu: ngayVN_(r.TuNgay), den: ngayVN_(r.DenNgay) }); });
    nhanSuGomTP_().forEach(function(x) { mx[x.MaNV] = x.MaXuong; });
    var laNghi = function(maNV, ng, maXuong) {
      if (!ng) return false;
      var kh = cc[maNV + '|' + ng];
      if (kh && gioCoMat_(kh) <= 0) return true;
      var d = ndh[maNV] || [];
      for (var i = 0; i < d.length; i++) if (d[i].tu <= ng && ng <= d[i].den) return true;
      return laNgayLe_(ng, maXuong || mx[maNV]);
    };
    var xoaP = phat.filter(function(p) { return laNghi(p.MaNV, ngayVN_(p.Ngay), p.MaXuong); }).map(function(p) { return p._row; });
    var xoaV = vp.filter(function(v) { return laNghi(v.MaNV, ngayVN_(v.Ngay)); }).map(function(v) { return v._row; });
    if (xoaP.length) xoaNhieuDong_('PhatNhapTre', xoaP);
    if (xoaV.length) xoaNhieuDong_('ViPham', xoaV);
    if (xoaP.length || xoaV.length) Logger.log('Gỡ phạt nhập trễ ngày nghỉ: ' + xoaP.length + ' lượt phạt, ' + xoaV.length + ' vi phạm.');
    return xoaP.length;
  } catch (e) { Logger.log('goPhatNgayNghi_: ' + e); return 0; }
}

/* Trigger: chạy mỗi ngày. Rà các ngày đã quá hạn, phạt CN chưa nhập. */""")
R("""  if (!noiBo_(arguments[0])) return chanWeb_('chayPhatNhapTre');
  taoSheetPhatTre_();""", """  if (!noiBo_(arguments[0])) return chanWeb_('chayPhatNhapTre');
  taoSheetPhatTre_();
  goPhatNgayNghi_();   // ngày nghỉ chấm muộn sau lần phạt trước -> gỡ (21/10)""")
R("""  ghiLog_(me, 'Điểm danh', 'Ngày ' + ngay + ' — ' + moi.length + ' người nghỉ');""",
  """  ghiLog_(me, 'Điểm danh', 'Ngày ' + ngay + ' — ' + moi.length + ' người nghỉ');
  goPhatNgayNghi_();""")
R("""  ghiLog_(me, 'Chấm lịch tháng', 'Kỳ ' + ky + ' — ' + moi.length + ' ô khác thường');""",
  """  ghiLog_(me, 'Chấm lịch tháng', 'Kỳ ' + ky + ' — ' + moi.length + ' ô khác thường');
  goPhatNgayNghi_();""")
R("""  ghiLog_(me, 'Đăng ký nghỉ dài hạn', maNV+' · '+loai+' · '+tuNgay+' → '+denNgay);""",
  """  ghiLog_(me, 'Đăng ký nghỉ dài hạn', maNV+' · '+loai+' · '+tuNgay+' → '+denNgay);
  goPhatNgayNghi_();""")

# ======================================================================= RÀ SOÁT 21/10 (đợt 2)
# a) Nhân sự "Tạm nghỉ" không phải nhập sản lượng: không phạt nhập trễ, không nhắc (dữ liệu 28/9: C285 tạm nghỉ vẫn bị phạt 6 lần).
R("""    if (String(nv.TrangThai).trim() === 'Nghỉ việc') return;
    if (maQL[String(nv.MaNV).trim()]) return;""", """    if (String(nv.TrangThai).trim() === 'Nghỉ việc' || String(nv.TrangThai).trim() === 'Tạm nghỉ') return;   // tạm nghỉ: không phải nhập (21/10)
    if (maQL[String(nv.MaNV).trim()]) return;""")
R("""    if (!nv || String(nv.TrangThai).trim() === 'Nghỉ việc' || maQL[String(nv.MaNV).trim()]) return;""",
  """    if (!nv || String(nv.TrangThai).trim() === 'Nghỉ việc' || String(nv.TrangThai).trim() === 'Tạm nghỉ' || maQL[String(nv.MaNV).trim()]) return;""")
# b) Lượt phạt nhập trễ còn sót của trưởng/phó phòng (dữ liệu 28/9: C160 – phó phòng In UV – 11 lượt, làm trưởng phòng In UV bị trừ
#    "không nhắc CN nhập") cũng gỡ tự động cùng lúc với ngày nghỉ.
R("""    nhanSuGomTP_().forEach(function(x) { mx[x.MaNV] = x.MaXuong; });
    var laNghi = function(maNV, ng, maXuong) {
      if (!ng) return false;""", """    nhanSuGomTP_().forEach(function(x) { mx[x.MaNV] = x.MaXuong; });
    var maQL = mapQuanLy_();
    var laNghi = function(maNV, ng, maXuong) {
      if (maQL[String(maNV).trim()]) return true;          // trưởng/phó phòng không phải nhập sản lượng
      if (!ng) return false;""")
# c) Hàm chạy tay soát dữ liệu sheet
s = s.rstrip() + '\n' + io.open(os.path.join(os.path.dirname(__file__), 'sua-loi-21-10', 'kiem-tra-du-lieu.gs'), encoding='utf-8').read()
