/* =====================================================================
   KỸ NĂNG (22/10, chủ dự án nhờ thiết kế + tham khảo chuyên gia nhân sự / đào tạo)
   - Danh mục: trưởng / phó phòng đề xuất kỹ năng của xưởng (tên, mô tả, tiêu chí đạt, công đoạn liên quan)
     -> ban điều hành duyệt + đặt trọng số A/B/C (hoặc trả lại). Sửa kỹ năng đã duyệt: bản sửa chờ duyệt lại,
     kỹ năng vẫn dùng nội dung cũ đến khi duyệt. Không xóa, chỉ "Ngừng".
   - Gán cho nhân viên: 4 cấp (ILUO) 1 Đang học · 2 Làm được · 3 Thành thạo · 4 Kèm được.
     Cấp 2 trở lên phải đạt ĐỦ tiêu chí + ghi bằng chứng kiểm tra. Trưởng / phó phòng ghi cấp 1–2 có hiệu lực ngay;
     cấp 3–4 chờ ban điều hành xác nhận. Không tự gán cho mình. Hạ cấp / thu hồi phải ghi lý do. Không ghi đè: mỗi lần là 1 dòng.
   - Điểm kỹ năng (mô phỏng, CHƯA gắn lương): trọng số (A=1, B=2, C=3) × hệ số cấp (2 = 1; 3 = 1,5; 4 = 2).
     Cấp 2 trở lên có hạn 24 tháng; hết hạn thì không tính điểm cho tới khi kiểm lại.
   ===================================================================== */
var KN_SHEET = 'KyNang', KNV_SHEET = 'KyNangNhanVien';
var KN_COT = ['MaKN', 'TenKN', 'MaXuong', 'Nhom', 'MoTa', 'TieuChi', 'CongDoan', 'LyDo', 'TrongSo', 'TrangThai', 'PhienBan', 'BanSua',
  'NguoiDeXuat', 'NgayDeXuat', 'NguoiDuyet', 'NgayDuyet', 'GhiChuDuyet'];
var KNV_COT = ['MaGN', 'MaNV', 'MaKN', 'MaXuong', 'Cap', 'CapCu', 'NgayKiem', 'NguoiKiem', 'TieuChiDat', 'BangChung', 'PhienBanKN',
  'TrangThai', 'NguoiXacNhan', 'NgayXacNhan', 'HetHan', 'LyDo', 'ThoiDiem'];
var KN_CAP = { 1: 'Đang học', 2: 'Làm được', 3: 'Thành thạo', 4: 'Kèm được' };
var KN_TRONG_SO = { A: 1, B: 2, C: 3 }, KN_HE_SO = { 1: 0, 2: 1, 3: 1.5, 4: 2 }, KN_HAN_THANG = 24;

function knSheet_(ten, cot) {
  var sh = ss_().getSheetByName(ten);
  if (!sh) {
    sh = ss_().insertSheet(ten);
    sh.getRange(1, 1, 1, cot.length).setValues([cot]).setFontWeight('bold');
    sh.setFrozenRows(1);
    sh.getRange(2, 1, sh.getMaxRows() - 1, cot.length).setNumberFormat('@');   // giữ nguyên chữ (ngày, mã) – không tự đổi sang ngày / số
  }
  return sh;
}
function knLuc_() { return Utilities.formatDate(new Date(), TZ_VN, 'yyyy-MM-dd HH:mm'); }
function knQuyen_(me) {
  if (!me) return '';
  if (me.vaiTro === 'ADMIN') return 'bdh';
  if (me.vaiTro === 'TP') return 'tp';
  if (me.vaiTro === 'HR' || me.vaiTro === 'TL') return 'xem';
  if (me.vaiTro === 'CN' && me.maNV) return 'cn';
  return '';
}
function knJson_(s, mac) { try { var v = JSON.parse(s || ''); return v == null ? mac : v; } catch (e) { return mac; } }
function knTenChuan_(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, ' ').trim();
}
function knDocKN_() { return docAnToan_(KN_SHEET); }
function knDocGN_() { return docAnToan_(KNV_SHEET); }
function knTim_(maKN) { return knDocKN_().filter(function(k) { return String(k.MaKN) === String(maKN); })[0] || null; }
function knCongNgay_(ngay, thang) {
  var p = String(ngay).split('-').map(Number), d = new Date(p[0], p[1] - 1 + thang, p[2]);
  if (d.getDate() !== p[2]) d = new Date(p[0], p[1] + thang, 0);              // 31/1 + 1 tháng -> 28/2
  return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
}

/* Kiểm tra + chuẩn hóa nội dung 1 kỹ năng (đề xuất / sửa). Trả { loi } hoặc { o } */
function knChuan_(o, me, maKNBo) {
  o = o || {};
  var r = {};
  r.TenKN = String(o.TenKN || '').replace(/\s+/g, ' ').trim();
  if (r.TenKN.length < 5 || r.TenKN.length > 80) return { loi: 'Tên kỹ năng cần 5–80 ký tự (vd. "Phun PU bóng đạt độ phủ đều").' };
  var xs = doc_('PhongBan').map(function(p) { return String(p.MaXuong); });
  r.MaXuong = String(o.MaXuong || '').trim();
  if (r.MaXuong !== '*' && xs.indexOf(r.MaXuong) < 0) return { loi: 'Chưa chọn xưởng.' };
  if (me.vaiTro === 'TP' && r.MaXuong !== '*' && r.MaXuong !== me.xuong) return { loi: 'Chỉ đề xuất kỹ năng cho xưởng của bạn.' };
  r.Nhom = String(o.Nhom || '').trim().slice(0, 40);
  r.MoTa = String(o.MoTa || '').trim();
  if (r.MoTa.length < 10 || r.MoTa.length > 500) return { loi: 'Mô tả cần 10–500 ký tự: làm việc gì, trên loại sản phẩm / máy nào.' };
  var tc = (Array.isArray(o.TieuChi) ? o.TieuChi : String(o.TieuChi || '').split('\n'))
    .map(function(x) { return String(x).replace(/^\s*(?:[-–•*+]+|\d{1,2}[.)])\s*/, '').trim(); }).filter(Boolean);   // bỏ gạch đầu dòng / "1." – giữ số trong câu ("10 cây…")
  if (tc.length < 2 || tc.length > 8) return { loi: 'Cần 2–8 tiêu chí đạt (mỗi dòng 1 tiêu chí đo / nhìn được).' };
  if (tc.some(function(x) { return x.length > 200; })) return { loi: 'Mỗi tiêu chí tối đa 200 ký tự.' };
  r.TieuChi = JSON.stringify(tc);
  var cds = doc_('CongDoan'), cdCo = {};
  cds.forEach(function(c) { if (String(c.TrangThai).trim() !== 'Ngừng' && (r.MaXuong === '*' || String(c.MaXuong) === r.MaXuong)) cdCo[String(c.MaCD)] = 1; });
  var cd = (Array.isArray(o.CongDoan) ? o.CongDoan : String(o.CongDoan || '').split(','))
    .map(function(x) { return String(x).trim(); }).filter(function(x, i, a) { return x && a.indexOf(x) === i; });
  if (!cd.length) return { loi: 'Chọn ít nhất 1 công đoạn liên quan.' };
  if (cd.some(function(x) { return !cdCo[x]; })) return { loi: 'Có công đoạn không thuộc xưởng này hoặc đã ngừng.' };
  r.CongDoan = cd.join(',');
  r.LyDo = String(o.LyDo || '').trim().slice(0, 300);
  var ten = knTenChuan_(r.TenKN);
  var trung = knDocKN_().filter(function(k) {
    return String(k.MaKN) !== String(maKNBo || '') && String(k.TrangThai).trim() !== 'Ngừng' &&
      (String(k.MaXuong) === r.MaXuong || String(k.MaXuong) === '*' || r.MaXuong === '*') && knTenChuan_(k.TenKN) === ten;
  })[0];
  if (trung) return { loi: 'Đã có kỹ năng cùng tên: "' + trung.TenKN + '".' };
  return { o: r };
}

/* Trưởng / phó phòng đề xuất (chờ duyệt); ban điều hành thêm thẳng (phải có trọng số) */
function deXuatKyNang(token, o) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  var q = knQuyen_(me);
  if (q !== 'bdh' && q !== 'tp') return sach_({ ok: false, msg: 'Chỉ trưởng / phó phòng hoặc ban điều hành được đề xuất kỹ năng.' });
  khoa_(); knSheet_(KN_SHEET, KN_COT);
  var c = knChuan_(o, me);
  if (c.loi) return sach_({ ok: false, msg: c.loi });
  var r = c.o, ts = String((o || {}).TrongSo || '').trim().toUpperCase();
  if (q === 'bdh' && !KN_TRONG_SO[ts]) return sach_({ ok: false, msg: 'Ban điều hành thêm kỹ năng thì chọn luôn trọng số A / B / C.' });
  r.MaKN = ma_('KN');
  r.TrangThai = q === 'bdh' ? 'Đã duyệt' : 'Chờ duyệt';
  r.TrongSo = q === 'bdh' ? ts : '';
  r.PhienBan = q === 'bdh' ? '1' : '0';
  r.NguoiDeXuat = me.tk; r.NgayDeXuat = knLuc_();
  if (q === 'bdh') { r.NguoiDuyet = me.tk; r.NgayDuyet = r.NgayDeXuat; }
  them_(KN_SHEET, r);
  ghiLog_(me, q === 'bdh' ? 'Thêm kỹ năng' : 'Đề xuất kỹ năng', r.MaKN + ' — ' + r.TenKN + ' (' + r.MaXuong + ')');
  return sach_(knDuLieu_(me, { ok: true, msg: q === 'bdh' ? 'Đã thêm kỹ năng.' : 'Đã gửi đề xuất – chờ ban điều hành duyệt.', MaKN: r.MaKN }));
}

/* Sửa kỹ năng. Trưởng / phó phòng: đề xuất chưa duyệt -> sửa thẳng (về Chờ duyệt);
   đã duyệt -> lưu bản sửa (BanSua) chờ duyệt lại, kỹ năng vẫn dùng nội dung cũ. Ban điều hành: sửa thẳng. */
function suaKyNang(token, maKN, o) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  var q = knQuyen_(me);
  if (q !== 'bdh' && q !== 'tp') return sach_({ ok: false, msg: 'Không có quyền.' });
  khoa_();
  var k = knTim_(maKN);
  if (!k) return sach_({ ok: false, msg: 'Không tìm thấy kỹ năng.' });
  var tt = String(k.TrangThai).trim();
  if (tt === 'Ngừng') return sach_({ ok: false, msg: 'Kỹ năng đã ngừng – không sửa được.' });
  if (q === 'tp' && !(String(k.MaXuong) === me.xuong || (String(k.MaXuong) === '*' && String(k.NguoiDeXuat) === me.tk)))
    return sach_({ ok: false, msg: 'Chỉ sửa kỹ năng của xưởng bạn.' });
  var c = knChuan_(o, me, maKN);
  if (c.loi) return sach_({ ok: false, msg: c.loi });
  var r = c.o, cot = ['TenKN', 'MaXuong', 'Nhom', 'MoTa', 'TieuChi', 'CongDoan', 'LyDo'];
  if (q === 'tp' && tt === 'Đã duyệt') {
    r.NguoiSua = me.tk; r.NgaySua = knLuc_();
    suaO_(KN_SHEET, k._row, 'BanSua', JSON.stringify(r));
    ghiLog_(me, 'Đề xuất sửa kỹ năng', k.MaKN + ' — ' + r.TenKN);
    return sach_(knDuLieu_(me, { ok: true, msg: 'Đã gửi bản sửa – chờ ban điều hành duyệt. Trong lúc chờ vẫn dùng nội dung cũ.' }));
  }
  cot.forEach(function(x) { suaO_(KN_SHEET, k._row, x, r[x]); });
  if (q === 'tp') {
    suaO_(KN_SHEET, k._row, 'TrangThai', 'Chờ duyệt');
    suaO_(KN_SHEET, k._row, 'NguoiDeXuat', me.tk); suaO_(KN_SHEET, k._row, 'NgayDeXuat', knLuc_());
  } else {
    var ts = String((o || {}).TrongSo || '').trim().toUpperCase();
    if (KN_TRONG_SO[ts]) suaO_(KN_SHEET, k._row, 'TrongSo', ts);
    if (tt === 'Đã duyệt' && r.TieuChi !== String(k.TieuChi)) suaO_(KN_SHEET, k._row, 'PhienBan', String((Number(k.PhienBan) || 1) + 1));
    suaO_(KN_SHEET, k._row, 'BanSua', '');
  }
  ghiLog_(me, 'Sửa kỹ năng', k.MaKN + ' — ' + r.TenKN);
  return sach_(knDuLieu_(me, { ok: true, msg: q === 'tp' ? 'Đã lưu – chờ ban điều hành duyệt.' : 'Đã lưu.' }));
}

/* Ban điều hành duyệt / trả lại đề xuất mới hoặc bản sửa */
function bdhDuyetKyNang(token, maKN, dongY, trongSo, ghiChu) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (knQuyen_(me) !== 'bdh') return sach_({ ok: false, msg: 'Chỉ ban điều hành duyệt kỹ năng.' });
  khoa_();
  var k = knTim_(maKN);
  if (!k) return sach_({ ok: false, msg: 'Không tìm thấy kỹ năng.' });
  ghiChu = String(ghiChu || '').trim().slice(0, 300);
  var ts = String(trongSo || '').trim().toUpperCase(), tt = String(k.TrangThai).trim(), luc = knLuc_();
  if (!dongY && ghiChu.length < 5) return sach_({ ok: false, msg: 'Trả lại thì ghi lý do để trưởng phòng sửa.' });
  var ban = knJson_(k.BanSua, null);
  if (ban && tt === 'Đã duyệt') {
    if (dongY) {
      ['TenKN', 'MaXuong', 'Nhom', 'MoTa', 'TieuChi', 'CongDoan', 'LyDo'].forEach(function(x) { suaO_(KN_SHEET, k._row, x, ban[x]); });
      if (ban.TieuChi !== String(k.TieuChi)) suaO_(KN_SHEET, k._row, 'PhienBan', String((Number(k.PhienBan) || 1) + 1));
      if (KN_TRONG_SO[ts]) suaO_(KN_SHEET, k._row, 'TrongSo', ts);
    }
    suaO_(KN_SHEET, k._row, 'BanSua', '');
    suaO_(KN_SHEET, k._row, 'GhiChuDuyet', ghiChu);
    suaO_(KN_SHEET, k._row, 'NguoiDuyet', me.tk); suaO_(KN_SHEET, k._row, 'NgayDuyet', luc);
    ghiLog_(me, dongY ? 'Duyệt bản sửa kỹ năng' : 'Trả lại bản sửa kỹ năng', k.MaKN + ' — ' + k.TenKN + (ghiChu ? ' — ' + ghiChu : ''));
    return sach_(knDuLieu_(me, { ok: true, msg: dongY ? 'Đã duyệt bản sửa.' : 'Đã trả lại bản sửa (kỹ năng giữ nội dung cũ).' }));
  }
  if (tt !== 'Chờ duyệt') return sach_({ ok: false, msg: 'Kỹ năng này không chờ duyệt.' });
  if (dongY && !KN_TRONG_SO[ts]) return sach_({ ok: false, msg: 'Chọn trọng số A / B / C trước khi duyệt.' });
  suaO_(KN_SHEET, k._row, 'TrangThai', dongY ? 'Đã duyệt' : 'Trả lại');
  if (dongY) { suaO_(KN_SHEET, k._row, 'TrongSo', ts); suaO_(KN_SHEET, k._row, 'PhienBan', '1'); }
  suaO_(KN_SHEET, k._row, 'GhiChuDuyet', ghiChu);
  suaO_(KN_SHEET, k._row, 'NguoiDuyet', me.tk); suaO_(KN_SHEET, k._row, 'NgayDuyet', luc);
  ghiLog_(me, dongY ? 'Duyệt kỹ năng' : 'Trả lại kỹ năng', k.MaKN + ' — ' + k.TenKN + (dongY ? ' (trọng số ' + ts + ')' : ' — ' + ghiChu));
  return sach_(knDuLieu_(me, { ok: true, msg: dongY ? 'Đã duyệt kỹ năng.' : 'Đã trả lại cho trưởng phòng.' }));
}

/* Ngừng kỹ năng (không xóa – giữ lịch sử). Trưởng / phó phòng chỉ rút được đề xuất chưa duyệt của xưởng mình. */
function ngungKyNang(token, maKN, lyDo) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  var q = knQuyen_(me);
  if (q !== 'bdh' && q !== 'tp') return sach_({ ok: false, msg: 'Không có quyền.' });
  khoa_();
  var k = knTim_(maKN);
  if (!k) return sach_({ ok: false, msg: 'Không tìm thấy kỹ năng.' });
  var tt = String(k.TrangThai).trim();
  if (tt === 'Ngừng') return sach_(knDuLieu_(me, { ok: true, msg: 'Kỹ năng đã ngừng từ trước.' }));
  if (q === 'tp' && !((tt === 'Chờ duyệt' || tt === 'Trả lại') && (String(k.MaXuong) === me.xuong || String(k.NguoiDeXuat) === me.tk)))
    return sach_({ ok: false, msg: 'Kỹ năng đã duyệt chỉ ban điều hành ngừng được.' });
  lyDo = String(lyDo || '').trim().slice(0, 300);
  var soNguoi = knHienTai_(knDocGN_()).filter(function(g) { return String(g.MaKN) === String(maKN); }).length;
  if (soNguoi && lyDo.length < 5) return sach_({ ok: false, msg: 'Đang có ' + soNguoi + ' người được gán kỹ năng này – ghi lý do ngừng.' });
  suaO_(KN_SHEET, k._row, 'TrangThai', 'Ngừng');
  suaO_(KN_SHEET, k._row, 'BanSua', '');
  if (lyDo) suaO_(KN_SHEET, k._row, 'GhiChuDuyet', lyDo);
  ghiLog_(me, q === 'tp' ? 'Rút đề xuất kỹ năng' : 'Ngừng kỹ năng', k.MaKN + ' — ' + k.TenKN + (lyDo ? ' — ' + lyDo : ''));
  return sach_(knDuLieu_(me, { ok: true, msg: q === 'tp' ? 'Đã rút đề xuất.' : 'Đã ngừng kỹ năng (lịch sử vẫn giữ, không còn tính điểm).' }));
}

/* Dòng gán đang có hiệu lực (Đã xác nhận) – mỗi người × kỹ năng 1 dòng */
function knHienTai_(gn) { return gn.filter(function(g) { return String(g.TrangThai).trim() === 'Đã xác nhận'; }); }
function knCua_(gn, maNV, maKN, tt) {
  return gn.filter(function(g) { return String(g.MaNV) === String(maNV) && String(g.MaKN) === String(maKN) && String(g.TrangThai).trim() === tt; });
}

/* Trưởng / phó phòng (xưởng mình) hoặc ban điều hành ghi kết quả kiểm tra kỹ năng cho 1 người */
function ganKyNang(token, o) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  var q = knQuyen_(me);
  if (q !== 'bdh' && q !== 'tp') return sach_({ ok: false, msg: 'Chỉ trưởng / phó phòng hoặc ban điều hành được gán kỹ năng.' });
  o = o || {};
  khoa_(); knSheet_(KNV_SHEET, KNV_COT);
  var nv = doc_('NhanSu').filter(function(x) { return String(x.MaNV).trim() === String(o.maNV || '').trim(); })[0];
  if (!nv || String(nv.TrangThai).trim() === 'Nghỉ việc') return sach_({ ok: false, msg: 'Không tìm thấy nhân viên đang làm.' });
  if (me.maNV && String(me.maNV) === String(nv.MaNV)) return sach_({ ok: false, msg: 'Không tự gán kỹ năng cho chính mình – nhờ ban điều hành.' });
  if (q === 'tp' && String(nv.MaXuong) !== me.xuong) return sach_({ ok: false, msg: 'Chỉ gán kỹ năng cho người trong xưởng bạn.' });
  if (q === 'tp' && String(nv.laTP).toUpperCase() === 'TRUE') return sach_({ ok: false, msg: 'Kỹ năng của trưởng / phó phòng do ban điều hành xác nhận.' });
  var k = knTim_(o.maKN);
  if (!k || String(k.TrangThai).trim() !== 'Đã duyệt') return sach_({ ok: false, msg: 'Kỹ năng chưa được ban điều hành duyệt (hoặc đã ngừng).' });
  if (String(k.MaXuong) !== '*' && String(k.MaXuong) !== String(nv.MaXuong)) return sach_({ ok: false, msg: 'Kỹ năng này thuộc xưởng khác.' });
  var cap = Number(o.cap);
  if (!KN_CAP[cap]) return sach_({ ok: false, msg: 'Chọn cấp 1–4.' });
  var ngay = String(o.ngayKiem || '').trim(), hn = homNayVN_();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ngay) || ngay > hn) return sach_({ ok: false, msg: 'Ngày kiểm tra không hợp lệ (không được sau hôm nay).' });
  var vao = ngayVN_(nv.NgayVaoLam);
  if (/^\d{4}-\d{2}-\d{2}$/.test(vao) && vao <= hn && ngay < vao) return sach_({ ok: false, msg: 'Ngày kiểm tra trước ngày vào làm (' + vao + ').' });
  var tc = knJson_(k.TieuChi, []), dat = (Array.isArray(o.tieuChiDat) ? o.tieuChiDat : []).map(Number)
    .filter(function(i, j, a) { return i >= 0 && i < tc.length && a.indexOf(i) === j; }).sort();
  var bc = String(o.bangChung || '').trim().slice(0, 500), lyDo = String(o.lyDo || '').trim().slice(0, 300);
  var gn = knDocGN_(), cu = knCua_(gn, nv.MaNV, k.MaKN, 'Đã xác nhận')[0], capCu = cu ? Number(cu.Cap) : 0;
  if (cap >= 2 && dat.length < tc.length) return sach_({ ok: false, msg: 'Chưa đạt đủ ' + tc.length + ' tiêu chí – chỉ ghi được cấp 1 (Đang học).' });
  if (cap >= 2 && bc.length < 5) return sach_({ ok: false, msg: 'Ghi bằng chứng kiểm tra (vd. mã lô / sản phẩm đã kiểm, kết quả).' });
  if (cap < capCu && lyDo.length < 5) return sach_({ ok: false, msg: 'Hạ cấp (' + capCu + ' → ' + cap + ') thì ghi lý do.' });
  var ngay1 = cap === capCu && cu && String(cu.NgayKiem) === ngay;
  if (ngay1) return sach_({ ok: false, msg: 'Người này đã ở cấp ' + cap + ' (kiểm ngày ' + ngay + ').' });
  var thang = q === 'bdh' || cap <= 2 || cap <= capCu;           // cấp 3–4 do trưởng / phó phòng nâng -> chờ ban điều hành
  var luc = knLuc_(), maGN = ma_('GN');
  knCua_(gn, nv.MaNV, k.MaKN, 'Chờ xác nhận').forEach(function(g) { suaO_(KNV_SHEET, g._row, 'TrangThai', 'Hủy'); });
  if (thang && cu) suaO_(KNV_SHEET, cu._row, 'TrangThai', 'Thay thế');
  them_(KNV_SHEET, {
    MaGN: maGN, MaNV: nv.MaNV, MaKN: k.MaKN, MaXuong: nv.MaXuong, Cap: String(cap), CapCu: String(capCu), NgayKiem: ngay, NguoiKiem: me.tk,
    TieuChiDat: JSON.stringify(dat), BangChung: bc, PhienBanKN: String(k.PhienBan || '1'), TrangThai: thang ? 'Đã xác nhận' : 'Chờ xác nhận',
    NguoiXacNhan: thang ? me.tk : '', NgayXacNhan: thang ? luc : '', HetHan: cap >= 2 ? knCongNgay_(ngay, KN_HAN_THANG) : '', LyDo: lyDo, ThoiDiem: luc
  });
  ghiLog_(me, 'Gán kỹ năng', nv.MaNV + ' ' + nv.HoTen + ' — ' + k.TenKN + ': cấp ' + capCu + ' → ' + cap + (thang ? '' : ' (chờ BĐH xác nhận)'));
  return sach_(knDuLieu_(me, { ok: true, cho: !thang, MaGN: maGN,
    msg: thang ? 'Đã ghi: ' + nv.HoTen + ' – ' + KN_CAP[cap] + '.' : 'Đã gửi – cấp ' + cap + ' (' + KN_CAP[cap] + ') chờ ban điều hành xác nhận.' }));
}

/* Ban điều hành xác nhận / từ chối cấp 3–4 trưởng phòng gửi lên */
function bdhXacNhanKyNang(token, maGN, dongY, lyDo) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (knQuyen_(me) !== 'bdh') return sach_({ ok: false, msg: 'Chỉ ban điều hành xác nhận.' });
  khoa_();
  var gn = knDocGN_(), g = gn.filter(function(x) { return String(x.MaGN) === String(maGN); })[0];
  if (!g || String(g.TrangThai).trim() !== 'Chờ xác nhận') return sach_({ ok: false, msg: 'Không còn chờ xác nhận (có thể đã được xử lý).' });
  lyDo = String(lyDo || '').trim().slice(0, 300);
  if (!dongY && lyDo.length < 5) return sach_({ ok: false, msg: 'Từ chối thì ghi lý do.' });
  var k = knTim_(g.MaKN);
  if (dongY && (!k || String(k.TrangThai).trim() !== 'Đã duyệt')) return sach_({ ok: false, msg: 'Kỹ năng đã ngừng – không xác nhận được.' });
  if (dongY) knCua_(gn, g.MaNV, g.MaKN, 'Đã xác nhận').forEach(function(c) { suaO_(KNV_SHEET, c._row, 'TrangThai', 'Thay thế'); });
  suaO_(KNV_SHEET, g._row, 'TrangThai', dongY ? 'Đã xác nhận' : 'Từ chối');
  suaO_(KNV_SHEET, g._row, 'NguoiXacNhan', me.tk); suaO_(KNV_SHEET, g._row, 'NgayXacNhan', knLuc_());
  if (lyDo) suaO_(KNV_SHEET, g._row, 'LyDo', lyDo);
  ghiLog_(me, dongY ? 'Xác nhận kỹ năng' : 'Từ chối kỹ năng', g.MaNV + ' — ' + (k ? k.TenKN : g.MaKN) + ' cấp ' + g.Cap + (lyDo ? ' — ' + lyDo : ''));
  return sach_(knDuLieu_(me, { ok: true, msg: dongY ? 'Đã xác nhận.' : 'Đã từ chối.' }));
}

/* Thu hồi kỹ năng đang có (lỗi chất lượng lặp lại, gian lận khi kiểm…) – phải có lý do */
function thuHoiKyNang(token, maNV, maKN, lyDo) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  var q = knQuyen_(me);
  if (q !== 'bdh' && q !== 'tp') return sach_({ ok: false, msg: 'Không có quyền.' });
  khoa_();
  var gn = knDocGN_(), cu = knCua_(gn, maNV, maKN, 'Đã xác nhận')[0];
  if (!cu) return sach_({ ok: false, msg: 'Người này chưa có kỹ năng này.' });
  if (q === 'tp' && String(cu.MaXuong) !== me.xuong) return sach_({ ok: false, msg: 'Chỉ thu hồi trong xưởng bạn.' });
  if (me.maNV && String(me.maNV) === String(maNV)) return sach_({ ok: false, msg: 'Không tự thu hồi kỹ năng của mình.' });
  lyDo = String(lyDo || '').trim().slice(0, 300);
  if (lyDo.length < 5) return sach_({ ok: false, msg: 'Ghi lý do thu hồi.' });
  suaO_(KNV_SHEET, cu._row, 'TrangThai', 'Thu hồi');
  suaO_(KNV_SHEET, cu._row, 'LyDo', lyDo);
  suaO_(KNV_SHEET, cu._row, 'NguoiXacNhan', me.tk); suaO_(KNV_SHEET, cu._row, 'NgayXacNhan', knLuc_());
  knCua_(gn, maNV, maKN, 'Chờ xác nhận').forEach(function(g) { suaO_(KNV_SHEET, g._row, 'TrangThai', 'Hủy'); });
  ghiLog_(me, 'Thu hồi kỹ năng', maNV + ' — ' + maKN + ' — ' + lyDo);
  return sach_(knDuLieu_(me, { ok: true, msg: 'Đã thu hồi.' }));
}

/* Điểm kỹ năng của từng người (mô phỏng – chưa gắn lương): chỉ tính kỹ năng còn duyệt, còn hạn */
function knDiem_(kn, gnHT, hn) {
  var ts = {}; kn.forEach(function(k) { if (String(k.TrangThai).trim() === 'Đã duyệt') ts[String(k.MaKN)] = KN_TRONG_SO[String(k.TrongSo)] || 0; });
  var d = {};
  gnHT.forEach(function(g) {
    var w = ts[String(g.MaKN)], h = ngayVN_(g.HetHan);
    if (!w || (h && h < hn)) return;
    d[g.MaNV] = (d[g.MaNV] || 0) + w * (KN_HE_SO[Number(g.Cap)] || 0);
  });
  return d;
}

/* Đọc dữ liệu tab Kỹ năng theo quyền */
function layKyNang(token) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (!knQuyen_(me)) return sach_({ ok: false, msg: 'Không có quyền.' });
  return sach_(knDuLieu_(me, { ok: true }));
}
/* Dữ liệu tab Kỹ năng theo quyền, gộp vào o. Các hàm ghi trả kèm luôn (khỏi gọi tải lại lần 2 – nhanh hơn, không lệch) */
function knDuLieu_(me, o) {
  var q = knQuyen_(me);
  var hn = homNayVN_(), kn = knDocKN_(), gn = knDocGN_();
  var xuongCua = {}; doc_('NhanSu').forEach(function(x) { xuongCua[String(x.MaNV)] = String(x.MaXuong); });
  var nvCua = function(g) {
    if (q === 'bdh' || q === 'xem') return true;
    if (q === 'tp') return String(g.MaXuong) === me.xuong || xuongCua[String(g.MaNV)] === me.xuong;
    return String(g.MaNV) === String(me.maNV);
  };
  var dsKN = kn.filter(function(k) {
    var x = String(k.MaXuong), tt = String(k.TrangThai).trim();
    if (q === 'bdh' || q === 'xem') return true;
    if (q === 'tp') return x === me.xuong || x === '*' && (tt === 'Đã duyệt' || String(k.NguoiDeXuat) === me.tk);
    return tt === 'Đã duyệt' && (x === '*' || x === String(me.xuong || xuongCua[String(me.maNV)] || ''));
  }).map(function(k) {
    var o = {}; KN_COT.forEach(function(c) { o[c] = k[c] == null ? '' : String(k[c]); });
    o.TieuChi = knJson_(k.TieuChi, []); o.BanSua = knJson_(k.BanSua, null);
    if (q === 'cn') { delete o.LyDo; delete o.GhiChuDuyet; delete o.BanSua; }
    return o;
  });
  var giu = { 'Đã xác nhận': 1, 'Chờ xác nhận': 1, 'Từ chối': 1, 'Thu hồi': 1 };
  var dsGN = gn.filter(function(g) { return giu[String(g.TrangThai).trim()] && nvCua(g); }).map(function(g) {
    var o = {}; KNV_COT.forEach(function(c) { o[c] = g[c] == null ? '' : String(g[c]); });
    o.Cap = Number(g.Cap) || 0; o.CapCu = Number(g.CapCu) || 0; o.TieuChiDat = knJson_(g.TieuChiDat, []);
    o.HetHan = ngayVN_(g.HetHan); o.hetHan = !!o.HetHan && o.HetHan < hn;
    return o;
  });
  var ht = knHienTai_(gn), diem = knDiem_(kn, ht, hn);
  if (q === 'cn') { var dm = {}; dm[me.maNV] = diem[me.maNV] || 0; diem = dm; }
  else if (q === 'tp') Object.keys(diem).forEach(function(m) { if (xuongCua[m] !== me.xuong) delete diem[m]; });
  // Công nhân: ai trong xưởng "Kèm được" từng kỹ năng (để biết hỏi ai học) – chỉ tên, không có điểm
  var kem = {};
  if (q === 'cn') {
    var ten = {}; doc_('NhanSu').forEach(function(x) { ten[String(x.MaNV)] = x.HoTen; });
    ht.forEach(function(g) { if (Number(g.Cap) === 4 && xuongCua[String(g.MaNV)] === xuongCua[String(me.maNV)] && String(g.MaNV) !== String(me.maNV))
      (kem[String(g.MaKN)] = kem[String(g.MaKN)] || []).push(ten[String(g.MaNV)] || g.MaNV); });
  }
  var tenTK = {}; doc_('TaiKhoan').forEach(function(t) { tenTK[String(t.TenDangNhap)] = t.HoTen; });
  var can = {}; dsKN.forEach(function(k) { ['NguoiDeXuat', 'NguoiDuyet'].forEach(function(c) { if (k[c]) can[k[c]] = tenTK[k[c]] || k[c]; }); });
  dsGN.forEach(function(g) { ['NguoiKiem', 'NguoiXacNhan'].forEach(function(c) { if (g[c]) can[g[c]] = tenTK[g[c]] || g[c]; }); });
  var kq = { quyen: q, kn: dsKN, gn: dsGN, diem: diem, kem: kem, ten: can, cap: KN_CAP, trongSo: KN_TRONG_SO, heSo: KN_HE_SO,
    hanThang: KN_HAN_THANG, homNay: hn, toi: me.maNV || '', xuong: me.xuong || '' };
  for (var c in kq) o[c] = kq[c];
  return o;
}
