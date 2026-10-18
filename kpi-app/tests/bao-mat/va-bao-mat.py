# -*- coding: utf-8 -*-
"""Vá bảo mật Code.gs (rà soát 17/10, sửa 18/10) – chạy bằng exec() ở cuối tests/va-code.py, dùng chung R() và s.
Danh sách việc + lý do: kpi-app/VIEC-BAO-MAT.md. Kiểm thử: tests/bao-mat.js."""
import re

# ======================================================================= 1. HÀM CHẠY TAY / TRIGGER
# Apps Script cho trình duyệt gọi MỌI hàm toàn cục không có '_' cuối. Các hàm dưới đây chỉ được chạy từ trình soạn thảo
# (người chạy = chủ dự án) hoặc từ trigger đã cài (mã trigger có thật). Giữ nguyên tên để không phải cài lại trigger.
HAM_NOI_BO = ['chayPhatNhapTre', 'chotThangTuDong', 'snapshotKPIHangNgay', 'donTokenHetHan', 'saoLuuHangNgay']
HAM_NOI_BO += re.findall(r'^function ([A-Z][A-Z0-9_]*[A-Z0-9])\(', s, re.M)
for ten in HAM_NOI_BO:
    m = re.search(r'^function ' + ten + r'\(([^)]*)\) \{', s, re.M)
    if not m:
        raise SystemExit('KHÔNG THẤY HÀM ' + ten)
    s = s[:m.end()] + "\n  if (!noiBo_(arguments[0])) return chanWeb_('" + ten + "');" + s[m.end():]

R("""/* ===== MÃ HÓA MẬT KHẨU ===== */""", """/* ===== HÀM CHỈ CHẠY NỘI BỘ (bảo mật 18/10) =====
   Trình duyệt gọi được mọi hàm toàn cục không có '_' cuối, kể cả khách chưa đăng nhập. Hàm chạy tay (viết hoa) và hàm
   trigger kiểm tra noiBo_ trước: trigger thật (mã trigger có trong dự án) hoặc người chạy chính là chủ dự án
   (trình soạn thảo Apps Script). Khách mở web: Session.getActiveUser() trả rỗng -> bị chặn. */
function noiBo_(e) {
  try {
    if (e && e.triggerUid) {
      var id = String(e.triggerUid);
      if (ScriptApp.getProjectTriggers().some(function(t) { return String(t.getUniqueId()) === id; })) return true;
    }
  } catch (x) {}
  try {
    var a = String(Session.getActiveUser().getEmail() || ''), b = String(Session.getEffectiveUser().getEmail() || '');
    return !!a && a.toLowerCase() === b.toLowerCase();
  } catch (x) {}
  return false;
}
function chanWeb_(ten) {
  try { Logger.log('Đã chặn ' + ten + ': chỉ chạy được trong trình soạn thảo Apps Script (tài khoản chủ dự án) hoặc bằng trigger.'); } catch (x) {}
  return { ok: false, msg: 'Chức năng này chỉ chạy trong trình soạn thảo Apps Script.' };
}

/* ===== CHẶN CÔNG THỨC KHI GHI VÀO SHEET (bảo mật 18/10) =====
   Chữ người dùng nhập bắt đầu bằng = + - @ sẽ bị Google Sheets hiểu là công thức (đọc được ô của sheet khác).
   Thêm dấu ' phía trước: Sheets giữ nguyên chữ, dấu ' bị ẩn. Số (kể cả '-5') giữ nguyên. */
function chuAnToan_(v) {
  if (typeof v !== 'string' || v.length < 2) return v;
  if (!/^[=+\\-@\\t\\r]/.test(v) || /^[+-]?\\d+(\\.\\d+)?$/.test(v)) return v;
  return "'" + v;
}
function dongAnToan_(row) { return row.map(chuAnToan_); }

/* ===== MÃ HÓA MẬT KHẨU ===== */""")

# ======================================================================= 2. CÔNG THỨC + GIỚI HẠN NHẬP
R("""  sh.appendRow(head.map(function(h) { return obj[h] !== undefined ? obj[h] : ''; }));
  xoaCache_(name);""", """  sh.appendRow(head.map(function(h) { return obj[h] !== undefined ? chuAnToan_(obj[h]) : ''; }));
  xoaCache_(name);""")
R("""    return head.map(function(h) { return o[h] !== undefined ? o[h] : ''; });
  });
  sh.getRange(sh.getLastRow() + 1, 1, rows.length, head.length).setValues(rows);""", """    return head.map(function(h) { return o[h] !== undefined ? chuAnToan_(o[h]) : ''; });
  });
  sh.getRange(sh.getLastRow() + 1, 1, rows.length, head.length).setValues(rows);""")
R("""  var m = __CHO_GHI[name] || (__CHO_GHI[name] = {});
  (m[row] = m[row] || {})[i + 1] = val;""", """  var m = __CHO_GHI[name] || (__CHO_GHI[name] = {});
  (m[row] = m[row] || {})[i + 1] = chuAnToan_(val);""")
R("""    o.setNumberFormat('@');            // định dạng văn bản
    o.setValue(String(val == null ? '' : val));""", """    o.setNumberFormat('@');            // định dạng văn bản
    o.setValue(chuAnToan_(String(val == null ? '' : val)));""")
R("""  sh.appendRow([
    ma_('TB'), new Date(), maXuong || '', 'TP', tieuDe || '', noiDung || '', 'Chưa', nguoiTao || ''
  ]);""", """  sh.appendRow(dongAnToan_([
    ma_('TB'), new Date(), maXuong || '', 'TP', tieuDe || '', noiDung || '', 'Chưa', nguoiTao || ''
  ]));""")
R("""  sh1.getRange(1, 1, bang.length, 6).setValues(bang);""", """  sh1.getRange(1, 1, bang.length, 6).setValues(bang.map(dongAnToan_));""")
R("""  sh2.getRange(1, 1, ct.length, 5).setNumberFormat('@').setValues(ct);""", """  sh2.getRange(1, 1, ct.length, 5).setNumberFormat('@').setValues(ct.map(dongAnToan_));""")
R("""  sh3.getRange(1, 1, td.length, 4).setNumberFormat('@').setValues(td);""", """  sh3.getRange(1, 1, td.length, 4).setNumberFormat('@').setValues(td.map(dongAnToan_));""")

# Công nhân gửi sản lượng: tối đa 30 dòng, ghi chú ≤ 300 ký tự, máy phải là máy của xưởng mình
R("""  if (!rows || !rows.length) return sach_({ ok: false, msg: 'Chưa có dòng nào.' });
  khoa_();
  var loiNgay = kiemNgay_(rows[0].Ngay, 31);""", """  if (!rows || !rows.length) return sach_({ ok: false, msg: 'Chưa có dòng nào.' });
  if (rows.length > SL_TOI_DA_DONG) return sach_({ ok: false, msg: 'Mỗi lần gửi tối đa ' + SL_TOI_DA_DONG + ' dòng.' });
  khoa_();
  var loiNgay = kiemNgay_(rows[0].Ngay, 31);""")
R("""    var c = cd.filter(function(x) { return x.MaCD === r.MaCD; })[0];
    if (!c || c.MaXuong !== me.xuong) return sach_({ ok: false, msg: 'Dòng ' + (i + 1) + ': công đoạn không thuộc xưởng của bạn.' });
  }
""", """    var c = cd.filter(function(x) { return x.MaCD === r.MaCD; })[0];
    if (!c || c.MaXuong !== me.xuong) return sach_({ ok: false, msg: 'Dòng ' + (i + 1) + ': công đoạn không thuộc xưởng của bạn.' });
    if (r.MaMay && !doc_('MayMoc').some(function(x) { return String(x.MaMay) === String(r.MaMay) && x.MaXuong === me.xuong; }))
      return sach_({ ok: false, msg: 'Dòng ' + (i + 1) + ': máy không thuộc xưởng của bạn.' });
    r.GhiChu = String(r.GhiChu || '').slice(0, GHI_CHU_TOI_DA);
  }
""")
R("""function congNhanGuiSanLuong(token, rows) {""", """var SL_TOI_DA_DONG = 30, GHI_CHU_TOI_DA = 300;   // bảo mật 18/10: giới hạn mỗi lần công nhân gửi
function congNhanGuiSanLuong(token, rows) {""")

# ======================================================================= 3 + 4 + 12 + 13. MẬT KHẨU, PHIÊN, CHẶN DÒ
R("""function bam_(mk) {""", """/* Bảo mật 18/10: mật khẩu mới lưu dạng 'v2$<muối riêng>$<HMAC-SHA256 lặp MK_VONG lần>'.
   Dạng cũ (SHA-256 một vòng, muối chung) vẫn đăng nhập được và tự đổi sang dạng mới ngay khi đăng nhập đúng. */
var MK_VONG = 400, MK_HAN_TAM_GIO = 48;
function hex_(b) { return b.map(function(x) { return ('0' + (x & 0xFF).toString(16)).slice(-2); }).join(''); }
function bam2_(mk, muoi) {
  var k = Utilities.newBlob('KPI|' + muoi + '|' + MUOI).getBytes();
  var h = Utilities.computeHmacSha256Signature(Utilities.newBlob(String(mk)).getBytes(), k);
  for (var i = 1; i < MK_VONG; i++) h = Utilities.computeHmacSha256Signature(h, k);
  return hex_(h);
}
function taoBam_(mk) {
  var muoi = Utilities.getUuid().replace(/-/g, '').slice(0, 16).toLowerCase();
  return 'v2$' + muoi + '$' + bam2_(mk, muoi);
}
function laBamCu_(luu) { return chuan_(luu).indexOf('v2$') !== 0; }
function kiemMK_(luu, mk) {
  var s = chuan_(luu);
  if (s.indexOf('v2$') === 0) { var p = s.split('$'); return p.length === 3 && bam2_(mk, p[1]) === p[2]; }
  return !!s && s === bam_(mk);
}
/* Mật khẩu tạm ngẫu nhiên 8 ký tự (bỏ chữ dễ nhầm 0/o, 1/l/i) */
function mkTam_() {
  var bo = 'abcdefghjkmnpqrstuvwxyz23456789', hx = Utilities.getUuid().replace(/-/g, ''), out = '';
  for (var i = 0; out.length < 8; i += 2) out += bo.charAt(parseInt(hx.substr(i, 2), 16) % bo.length);
  return out;
}
/* Bảo đảm sheet TaiKhoan có cột `ten` (thêm vào cuối nếu thiếu) */
function cotTK_(ten) {
  var sh = ss_().getSheetByName('TaiKhoan');
  if (!sh) return;
  var head = sh.getRange(1, 1, 1, Math.max(1, sh.getLastColumn())).getValues()[0];
  if (head.indexOf(ten) < 0) {
    sh.getRange(1, head.length + 1).setValue(ten).setFontWeight('bold');
    delete __HEAD_CACHE['TaiKhoan']; delete __DOC_CACHE['TaiKhoan'];
  }
}
/* Đặt mật khẩu tạm cho 1 dòng TaiKhoan: phải đổi khi đăng nhập, hết hạn sau MK_HAN_TAM_GIO giờ */
function datMKTam_(row, mk) {
  cotTK_('HanMatKhauTam');
  ghiBam_(row, taoBam_(mk));
  suaO_('TaiKhoan', row, 'DoiMatKhauLanDau', 'Có');
  suaO_('TaiKhoan', row, 'HanMatKhauTam', new Date(new Date().getTime() + MK_HAN_TAM_GIO * 3600e3));
}
function hanMKTamQua_(tk) {
  if (String(tk.DoiMatKhauLanDau).trim() !== 'Có' || !tk.HanMatKhauTam) return false;
  var t = new Date(tk.HanMatKhauTam).getTime();
  return !isNaN(t) && new Date().getTime() > t;
}
/* Phiên bản phiên: tăng khi đổi / cấp lại mật khẩu -> mọi phiên cũ của tài khoản đó hết hiệu lực */
function tangPhienBan_(tk) {
  cotTK_('PhienBan');
  var pb = (Number(tk.PhienBan) || 0) + 1;
  suaO_('TaiKhoan', tk._row, 'PhienBan', pb);
  return pb;
}
function ghiPhien_(token, o) {
  var con = Math.floor(((o.hanDen || 0) - new Date().getTime()) / 1000);
  if (con < 1) return;
  var s = JSON.stringify(o);
  try { CacheService.getScriptCache().put('P_' + token, s, Math.min(con, 21600)); } catch (e) {}
  try { PropertiesService.getScriptProperties().setProperty('P_' + token, s); } catch (e) {}
}

function bam_(mk) {""")

# Phiên: lưu phiên bản; đọc lại cache theo hạn còn lại; so phiên bản với sheet
R("""    maNV: tk.MaNV || '', hanDen: (new Date().getTime() + ttl * 1000)
  });""", """    maNV: tk.MaNV || '', hanDen: (new Date().getTime() + ttl * 1000), pb: Number(tk.PhienBan) || 0
  });""")
R("""      // Nạp lại vào cache cho lần sau nhanh hơn
      try { CacheService.getScriptCache().put('P_' + token, s, 21600); } catch (e) {}""", """      // Nạp lại vào cache cho lần sau nhanh hơn (chỉ trong thời gian phiên còn hạn)
      var con = Math.floor(((o.hanDen || 0) - new Date().getTime()) / 1000);
      if (con > 0) try { CacheService.getScriptCache().put('P_' + token, s, Math.min(con, 21600)); } catch (e) {}""")
R("""  if (!tk || String(tk.TrangThai).trim() !== 'Đang dùng') return null;
  if (tk.MaNV && nvDaNghi_(tk.MaNV)) return null;          // hồ sơ đã chuyển Nghỉ việc""", """  if (!tk || String(tk.TrangThai).trim() !== 'Đang dùng') return null;
  if ((Number(tk.PhienBan) || 0) !== (Number(o.pb) || 0)) return null;   // đã đổi / cấp lại mật khẩu sau khi đăng nhập
  if (o.hanDen && new Date().getTime() > o.hanDen) return null;
  if (tk.MaNV && nvDaNghi_(tk.MaNV)) return null;          // hồ sơ đã chuyển Nghỉ việc""")
R("""  o.tenXuong = o.xuong ? tenXuong_(o.xuong) : '';
  o.maNV = tk.MaNV || o.maNV || '';
  o.token = token;""", """  o.tenXuong = o.xuong ? tenXuong_(o.xuong) : '';
  o.maNV = tk.MaNV || o.maNV || '';
  o.token = token;
  o.pb = Number(tk.PhienBan) || 0;""")

# Đăng nhập: khóa tạm tăng dần (1, 2, 4, 8, 15 phút) thay vì khóa cứng 15 phút ngay lần sai thứ 5
R("""    var cache = CacheService.getScriptCache();
    var khoaKey = 'SAI_' + ten;
    var soSai = 0;
    try { soSai = Number(cache.get(khoaKey) || 0); } catch (e) {}
    if (soSai >= SO_LAN_SAI_TOI_DA)
      return sach_({ ok: false, msg: 'Nhập sai quá ' + SO_LAN_SAI_TOI_DA + ' lần. Tài khoản tạm khóa ' +
        PHUT_KHOA_DANG_NHAP + ' phút — thử lại sau, hoặc nhờ chủ sở hữu cấp lại mật khẩu.' });
    var baoSai = function() {
      try { cache.put(khoaKey, String(soSai + 1), PHUT_KHOA_DANG_NHAP * 60); } catch (e) {}""", """    var cache = CacheService.getScriptCache();
    var khoaKey = 'SAI_' + ten;
    var soSai = 0, khoaDen = 0, bayGio = new Date().getTime();
    try { var ks = String(cache.get(khoaKey) || '0').split('|'); soSai = Number(ks[0]) || 0; khoaDen = Number(ks[1]) || 0; } catch (e) {}
    if (khoaDen > bayGio)
      return sach_({ ok: false, msg: 'Nhập sai nhiều lần. Đợi ' + Math.ceil((khoaDen - bayGio) / 60000) +
        ' phút rồi thử lại, hoặc nhờ người quản lý cấp lại mật khẩu.' });
    var baoSai = function() {
      var n = soSai + 1, den = n >= SO_LAN_SAI_TOI_DA ? bayGio + Math.min(PHUT_KHOA_DANG_NHAP, Math.pow(2, n - SO_LAN_SAI_TOI_DA)) * 60000 : 0;
      try { cache.put(khoaKey, n + '|' + den, 6 * 3600); } catch (e) {}""")
R("""    if (!tk) return baoSai();
    if (chuan_(tk.MatKhauMaHoa) !== bam_(matKhau)) return baoSai();
    if (String(tk.TrangThai).trim() !== 'Đang dùng') return sach_({ ok: false, msg: 'Tài khoản đã bị ngừng sử dụng.' });""", """    if (!tk) return baoSai();
    if (!kiemMK_(tk.MatKhauMaHoa, matKhau)) return baoSai();
    if (String(tk.TrangThai).trim() !== 'Đang dùng') return sach_({ ok: false, msg: 'Tài khoản đã bị ngừng sử dụng.' });
    if (hanMKTamQua_(tk))
      return sach_({ ok: false, msg: 'Mật khẩu tạm đã hết hạn (quá ' + MK_HAN_TAM_GIO + ' giờ). Nhờ người quản lý cấp lại mật khẩu.' });
    if (laBamCu_(tk.MatKhauMaHoa)) { try { ghiBam_(tk._row, taoBam_(matKhau)); } catch (e) {} }   // đổi sang cách mã hóa mới""")
R("""    return sach_({ ok: false, msg: 'Lỗi máy chủ: ' + (e.message || e) });
  }
}

function dangXuat(token) {""", """    try { Logger.log('dangNhap lỗi: ' + (e && e.stack || e)); } catch (x) {}
    return sach_({ ok: false, msg: 'Máy chủ đang bận, chưa đăng nhập được. Thử lại sau ít phút.' });
  }
}

function dangXuat(token) {""")

# Đổi mật khẩu: mã hóa mới, xóa hạn mật khẩu tạm, thu hồi mọi phiên khác (phiên đang dùng được giữ lại)
R("""  if (chuan_(tk.MatKhauMaHoa) !== bam_(cu)) return sach_({ ok: false, msg: 'Mật khẩu hiện tại không đúng.' });
  if (String(moi) === String(cu)) return sach_({ ok: false, msg: 'Mật khẩu mới phải khác mật khẩu cũ.' });

  ghiBam_(tk._row, bam_(moi));
  suaO_('TaiKhoan', tk._row, 'DoiMatKhauLanDau', 'Không');""", """  if (!kiemMK_(tk.MatKhauMaHoa, cu)) return sach_({ ok: false, msg: 'Mật khẩu hiện tại không đúng.' });
  if (String(moi) === String(cu)) return sach_({ ok: false, msg: 'Mật khẩu mới phải khác mật khẩu cũ.' });
  if (String(moi).length > 100) return sach_({ ok: false, msg: 'Mật khẩu quá dài.' });

  ghiBam_(tk._row, taoBam_(moi));
  suaO_('TaiKhoan', tk._row, 'DoiMatKhauLanDau', 'Không');
  if (tk.HanMatKhauTam) suaO_('TaiKhoan', tk._row, 'HanMatKhauTam', '');
  var pbMoi = tangPhienBan_(tk);
  try { var ph = JSON.parse(docChuoiPhien_(token)); ph.pb = pbMoi; ghiPhien_(token, ph); } catch (e) {}""")

# Tạo tài khoản / cấp lại: mật khẩu tạm ngẫu nhiên, hết hạn sau 48 giờ, trả về để hiện hộp có nút Chép / In phiếu
R("""  var mkTam = o.MatKhau && String(o.MatKhau).length >= 6 ? String(o.MatKhau) : '123456';""", """  var mkTam = o.MatKhau && String(o.MatKhau).length >= 6 ? String(o.MatKhau) : mkTam_();
  if (MK_YEU_.indexOf(mkTam.toLowerCase()) >= 0) return sach_({ ok: false, msg: 'Mật khẩu tạm quá dễ đoán. Để trống để hệ thống tự tạo.' });""")
R("""  them_('TaiKhoan', {
    TenDangNhap: tk, MatKhauMaHoa: bam_(mkTam), HoTen: o.HoTen,""", """  them_('TaiKhoan', {
    TenDangNhap: tk, MatKhauMaHoa: '', HoTen: o.HoTen,""")
R("""  if (moiTao) ghiBam_(moiTao._row, bam_(mkTam));
  ghiLog_(me, 'Tạo tài khoản', tk + ' — ' + o.VaiTro + (maNV ? ' (' + maNV + ')' : ''));
  return sach_({ ok: true, msg: 'Đã tạo tài khoản "' + tk + '". Mật khẩu tạm: ' + mkTam });""", """  if (moiTao) datMKTam_(moiTao._row, mkTam);
  ghiLog_(me, 'Tạo tài khoản', tk + ' — ' + o.VaiTro + (maNV ? ' (' + maNV + ')' : ''));
  return sach_({ ok: true, mkTam: mkTam, tenDN: tk, hoTen: o.HoTen, hanGio: MK_HAN_TAM_GIO,
    msg: 'Đã tạo tài khoản "' + tk + '". Mật khẩu tạm: ' + mkTam + ' (dùng trong ' + MK_HAN_TAM_GIO + ' giờ)' });""")
R("""  // Mật khẩu tạm NGẪU NHIÊN 6 số (không dùng 123456 — ai cũng đoán được)
  var mkTam = String(Math.floor(100000 + Math.random() * 900000));
  ghiBam_(tk._row, bam_(mkTam));
  suaO_('TaiKhoan', tk._row, 'DoiMatKhauLanDau', 'Có');""", """  // Mật khẩu tạm NGẪU NHIÊN 8 ký tự, hết hạn sau 48 giờ; mọi phiên đang mở của tài khoản này bị đăng xuất
  var mkTam = mkTam_();
  datMKTam_(tk._row, mkTam);
  tangPhienBan_(tk);""")
R("""  return sach_({ ok: true, mkTam: mkTam, msg: 'Mật khẩu tạm của "' + tenDN + '": ' + mkTam +
    '\\nHãy báo riêng cho người này. Họ sẽ phải đổi mật khẩu ngay lần đăng nhập đầu.' });""", """  return sach_({ ok: true, mkTam: mkTam, tenDN: tk.TenDangNhap, hoTen: tk.HoTen, hanGio: MK_HAN_TAM_GIO,
    msg: 'Mật khẩu tạm của "' + tenDN + '": ' + mkTam +
    '\\nHãy báo riêng cho người này trong ' + MK_HAN_TAM_GIO + ' giờ. Họ sẽ phải đổi mật khẩu ngay lần đăng nhập đầu.' });""")

# Thêm nhân sự tự tạo tài khoản công nhân: mật khẩu tạm ngẫu nhiên
R("""        them_('TaiKhoan', {
          TenDangNhap: tenDN, MatKhauMaHoa: bam_('123456'), HoTen: o.HoTen,""", """        var mkMoi = mkTam_();
        them_('TaiKhoan', {
          TenDangNhap: tenDN, MatKhauMaHoa: '', HoTen: o.HoTen,""")
R("""        if (moiTao) ghiBam_(moiTao._row, bam_('123456'));
        ghiLog_(me, 'Tạo tài khoản (tự động)', tenDN + ' — CN (' + maNV + ')');
        tkMsg = ' Đã tạo tài khoản đăng nhập "' + tenDN + '" (mật khẩu 123456, bắt buộc đổi lần đầu).';""", """        if (moiTao) datMKTam_(moiTao._row, mkMoi);
        ghiLog_(me, 'Tạo tài khoản (tự động)', tenDN + ' — CN (' + maNV + ')');
        tkMoi = { mkTam: mkMoi, tenDN: tenDN, hoTen: o.HoTen, hanGio: MK_HAN_TAM_GIO };
        tkMsg = ' Đã tạo tài khoản đăng nhập "' + tenDN + '" (mật khẩu tạm ' + mkMoi + ', dùng trong ' + MK_HAN_TAM_GIO + ' giờ).';""")
R("""  // Tên đăng nhập = mã NV viết thường; mật khẩu 123456; bắt buộc đổi lần đầu.
  var tkMsg = '';""", """  // Tên đăng nhập = mã NV viết thường; mật khẩu tạm ngẫu nhiên (48 giờ); bắt buộc đổi lần đầu.
  var tkMsg = '', tkMoi = null;""")
R("""  return sach_({ ok: true, msg: 'Đã lưu hồ sơ.' +
    (full ? '' : ' Phòng nhân sự sẽ bổ sung giấy tờ và hợp đồng.') + tkMsg });""", """  var kqNS = { ok: true, msg: 'Đã lưu hồ sơ.' +
    (full ? '' : ' Phòng nhân sự sẽ bổ sung giấy tờ và hợp đồng.') + tkMsg };
  if (tkMoi) for (var kN in tkMoi) kqNS[kN] = tkMoi[kN];
  return sach_(kqNS);""")

# Tạo hàng loạt (chạy tay): mỗi người một mật khẩu tạm, in danh sách ra Nhật ký thực thi để phát
R("""  var mk = bam_('123456');
  var now = new Date();
  var themDs = [];""", """  cotTK_('HanMatKhauTam');
  head = shTK.getRange(1, 1, 1, shTK.getLastColumn()).getValues()[0];
  var han = new Date(new Date().getTime() + MK_HAN_TAM_GIO * 3600e3), dsMK = [];
  var now = new Date();
  var themDs = [];""")
R("""    themDs.push([
      ten, mk, nv.HoTen, 'CN', nv.MaXuong || '', 'Đang dùng',
      'Có', '', now, maNV
    ]);""", """    var mk1 = mkTam_();
    dsMK.push(maNV + ' | ' + nv.HoTen + ' | ' + mk1);
    themDs.push([
      ten, taoBam_(mk1), nv.HoTen, 'CN', nv.MaXuong || '', 'Đang dùng',
      'Có', '', now, maNV
    ]);""")
R("""        LanDangNhapCuoi: d[7], NgayTao: d[8], MaNV: d[9]
      };""", """        LanDangNhapCuoi: d[7], NgayTao: d[8], MaNV: d[9], HanMatKhauTam: han
      };""")
R("""  Logger.log('Đã tạo mới: ' + themDs.length + ' tài khoản công nhân (mật khẩu 123456)');""", """  Logger.log('Đã tạo mới: ' + themDs.length + ' tài khoản công nhân. Mật khẩu tạm (dùng trong ' + MK_HAN_TAM_GIO + ' giờ) – chép danh sách dưới đây để phát:');
  if (dsMK.length) Logger.log(dsMK.join('\\n'));""")
