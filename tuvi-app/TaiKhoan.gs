/**
 * ============================================================
 *  TaiKhoan.gs — TÀI KHOẢN ĐĂNG NHẬP & CHẾ ĐỘ KHÁCH
 *  - Tài khoản lưu trong Script Properties (khóa "TK_<tên>"), mật khẩu chỉ lưu dạng băm
 *    SHA-256 lặp TK_VONG vòng kèm salt ngẫu nhiên – không lưu mật khẩu gốc.
 *  - Phiên đăng nhập: mã ngẫu nhiên (UUID) giữ trong CacheService 6 giờ, gia hạn khi dùng.
 *  - Sai mật khẩu 5 lần → khóa tài khoản 15 phút.
 *  - Khách (chưa đăng nhập) vẫn lập được lá số, nhưng máy chủ chỉ trả về bản rút gọn
 *    (lá số + phần "hé lộ" như bản PDF xem thử); phần luận giải không rời khỏi máy chủ.
 *  - Vai trò: "chu" (chủ sở hữu – toàn quyền, quản trị), "vip" (xem không giới hạn, không quản trị)
 *    và "thanhVien" (tự đăng ký, mở khóa bằng xu – xem ThanhToan.gs).
 * ============================================================
 */
var TK_VONG = 400;
var TK_CHU = 'chienpham';
// Tài khoản chủ sở hữu khởi tạo sẵn (chỉ lưu salt + mã băm). Đổi mật khẩu trong ứng dụng sẽ ghi đè bản này.
var TK_CHU_SEED = { salt: '7fe52eb72ec40dc415be44affb00a655', hash: '9024324c936271c58add64e8807a84f33453831fbf8a08dcd8f70272a35c2cac', vaiTro: 'chu', hienThi: 'Chủ sở hữu' };

function tkHex_(bytes) { return bytes.map(function (b) { var v = (b + 256) % 256; return (v < 16 ? '0' : '') + v.toString(16); }).join(''); }
function tkSha_(s) { return tkHex_(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, s, Utilities.Charset.UTF_8)); }
function tkBam_(pass, salt) { var h = tkSha_(salt + ':' + pass); for (var i = 0; i < TK_VONG; i++) h = tkSha_(h + salt); return h; }
function tkSalt_() { return Utilities.getUuid().replace(/-/g, ''); }
function tkTen_(u) { return String(u || '').trim().toLowerCase(); }
function tkProps_() { return PropertiesService.getScriptProperties(); }
function tkDoc_(u) {
  u = tkTen_(u);
  var v = tkProps_().getProperty('TK_' + u);
  if (!v && u === TK_CHU) { tkGhi_(u, TK_CHU_SEED); return JSON.parse(JSON.stringify(TK_CHU_SEED)); }
  return v ? JSON.parse(v) : null;
}
function tkGhi_(u, o) { tkProps_().setProperty('TK_' + tkTen_(u), JSON.stringify(o)); }
function tkBang_(a, b) { if (a.length !== b.length) return false; var d = 0; for (var i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0; }
function tkKiemMatKhau_(p) {
  p = String(p || '');
  if (p.length < 8) throw new Error('Mật khẩu cần ít nhất 8 ký tự.');
  if (!/[A-Za-z]/.test(p) || !/[0-9]/.test(p)) throw new Error('Mật khẩu cần có cả chữ và số.');
  return p;
}
function tkNguoi_(u, o) { return { ten: u, hienThi: o.hienThi || u, vaiTro: o.vaiTro || 'thanhVien', email: o.emailXacThuc ? o.email || '' : '', daXacThuc: !!o.emailXacThuc }; }
var TK_VAI_TRO = { chu: 'Chủ sở hữu', vip: 'Thành viên VIP', thanhVien: 'Thành viên' };

/* ---------- Phiên ---------- */
function tkPhien_(token) {
  if (!token || typeof token !== 'string' || token.length < 20) return null;
  var c = CacheService.getScriptCache(), v = c.get('SS_' + token);
  if (!v) return null;
  var s = JSON.parse(v), o = tkDoc_(s.ten);
  if (!o) { c.remove('SS_' + token); return null; }
  c.put('SS_' + token, v, 21600);
  return tkNguoi_(s.ten, o);
}
function tkCan_(token, chiChu) {
  var u = tkPhien_(token);
  if (!u) throw new Error('Cần đăng nhập để dùng chức năng này.');
  if (chiChu && u.vaiTro !== 'chu') throw new Error('Chỉ chủ sở hữu mới dùng được chức năng này.');
  return u;
}

/* ---------- Chặn gọi từ trình duyệt (rà soát bảo mật 16/11) ----------
 * Apps Script cho trình duyệt gọi MỌI hàm không có "_" cuối tên. Hàm vận hành (gửi báo cáo, bản tin, bật/tắt lịch, thử nghiệm)
 * chỉ được chạy: (1) theo lịch thật của dự án – đối chiếu mã lịch (triggerUid), người ngoài không đoán được; hoặc
 * (2) từ trình soạn thảo Apps Script bởi chính chủ dự án (người đang chạy = tài khoản sở hữu dự án). */
function laLichThat_(e) {
  if (!e || !/^\d{4,25}$/.test(String(e.triggerUid || ''))) return false;
  try { return ScriptApp.getProjectTriggers().some(function (t) { return String(t.getUniqueId()) === String(e.triggerUid); }); } catch (x) { return false; }
}
function laChuTrinhSoan_() {
  try { var a = Session.getActiveUser().getEmail(), h = Session.getEffectiveUser().getEmail(); return !!a && a === h; } catch (x) { return false; }
}
function chiChayNoiBo_(e) {
  if (laLichThat_(e) || laChuTrinhSoan_()) return;
  throw new Error('Chức năng này chỉ chạy theo lịch hoặc từ trình soạn thảo Apps Script.');
}

/* ---------- API cho giao diện ---------- */
/** Chỉ mục email → tên đăng nhập (17/11: đăng ký chỉ bằng email, đăng nhập bằng email được) */
function tkKhoaEmail_(email) { return 'EM_' + tkSha_(ttLienHeChuan_(email)).slice(0, 24); }
function tkTenTuEmail_(email) { var v = tkProps_().getProperty(tkKhoaEmail_(email)); return v ? tkTen_(v) : ''; }
function dangNhap(user, pass) {
  if (String(user || '').indexOf('@') >= 0) user = tkTenTuEmail_(user) || String(user);
  var u = tkTen_(user), c = CacheService.getScriptCache(), k = 'SAI_' + u;
  var sai = parseInt(c.get(k) || '0', 10);
  var o = tkDoc_(u), laChu = !!o && o.vaiTro === 'chu';
  // Chủ sở hữu không bị khóa 15 phút (người lạ gõ sai 5 lần không chặn được chủ): sau 5 lần sai chỉ phải đợi vài giây
  // giữa hai lần thử – từ chối ngay, không ngủ, nên không chiếm suất chạy đồng thời của web (rà soát 16/11)
  if (sai >= 5 && !laChu) throw new Error('Tài khoản tạm khóa do nhập sai nhiều lần. Thử lại sau 15 phút.');
  if (sai >= 5 && laChu && c.get('CHO_' + u)) throw new Error('Nhập sai nhiều lần. Đợi vài giây rồi thử lại.');
  var dung = o ? tkBang_(tkBam_(String(pass || ''), o.salt), o.hash) : (tkBam_(String(pass || ''), 'khong-co-tai-khoan'), false);
  if (!dung) {
    c.put(k, String(sai + 1), 900);
    if (laChu && sai + 1 >= 5) c.put('CHO_' + u, '1', Math.min(30, 2 * (sai + 1)));
    Utilities.sleep(600);
    throw new Error('Sai tên đăng nhập hoặc mật khẩu.');
  }
  c.remove(k);
  var token = Utilities.getUuid() + Utilities.getUuid().replace(/-/g, '');
  c.put('SS_' + token, JSON.stringify({ ten: u }), 21600);
  o.lanCuoi = new Date().toISOString(); tkGhi_(u, o);
  return { token: token, nguoiDung: tkNguoi_(u, o) };
}
function phien(token) { return tkPhien_(token); }
function dangXuat(token) { if (token) CacheService.getScriptCache().remove('SS_' + token); return true; }
function doiMatKhau(token, cu, moi) {
  var u = tkCan_(token), o = tkDoc_(u.ten);
  if (!tkBang_(tkBam_(String(cu || ''), o.salt), o.hash)) throw new Error('Mật khẩu hiện tại không đúng.');
  tkKiemMatKhau_(moi);
  o.salt = tkSalt_(); o.hash = tkBam_(moi, o.salt); tkGhi_(u.ten, o);
  return true;
}
function dsTaiKhoan(token) {
  tkCan_(token, true);
  tkDoc_(TK_CHU);
  var p = tkProps_().getProperties(), out = [];
  Object.keys(p).forEach(function (k) {
    if (k.indexOf('TK_') !== 0) return;
    var o = JSON.parse(p[k]), u = k.slice(3);
    out.push({ ten: u, hienThi: o.hienThi || u, vaiTro: o.vaiTro || 'thanhVien', lienHe: o.lienHe || '', tuDangKy: !!o.tuDangKy, gioiThieu: o.gioiThieu || '', taoLuc: o.taoLuc || '', lanCuoi: o.lanCuoi || '',
      email: o.emailXacThuc ? o.email || '' : '', daXacThuc: !!o.emailXacThuc });
  });
  var TT = { chu: 0, vip: 1, thanhVien: 2 };
  return out.sort(function (a, b) { return (TT[a.vaiTro] || 2) - (TT[b.vaiTro] || 2) || String(b.taoLuc).localeCompare(String(a.taoLuc)); });
}
function tkTaoMoi_(user, pass, hienThi, vaiTro, them) {
  var u = tkTen_(user);
  if (!/^[a-z0-9._-]{3,32}$/.test(u)) throw new Error('Tên đăng nhập 3–32 ký tự: chữ thường không dấu, số, dấu chấm, gạch.');
  if (tkDoc_(u)) throw new Error('Tên đăng nhập đã tồn tại.');
  tkKiemMatKhau_(pass);
  var salt = tkSalt_(), o = { salt: salt, hash: tkBam_(pass, salt), vaiTro: vaiTro, hienThi: String(hienThi || u).trim().slice(0, 60) || u, taoLuc: new Date().toISOString() };
  for (var k in (them || {})) o[k] = them[k];
  tkGhi_(u, o);
  return u;
}
function taoTaiKhoan(token, user, pass, hienThi, vaiTro) {
  tkCan_(token, true);
  tkTaoMoi_(user, pass, hienThi, vaiTro === 'vip' ? 'vip' : 'thanhVien');
  return dsTaiKhoan(token);
}
/** Khách tự đăng ký tài khoản thành viên, đăng nhập luôn.
 *  16/11 (phiên khuyến mại 4): KHÔNG tặng quà ngay – quà 39 xu chỉ sau khi xác thực email (guiMaEmail → xacThucEmail).
 *  Trả thêm canXacThuc: true (+ emailGoiY nếu liên hệ là email) để giao diện mời xác thực. Mã mời vẫn lưu (gioiThieu) nhưng thưởng mời = 0. */
function dangKy(user, pass, hienThi, lienHe, maGioiThieu) {
  var c = CacheService.getScriptCache(), n = parseInt(c.get('DK_DEM') || '0', 10);
  if (n >= 30) throw new Error('Hệ thống đang nhận quá nhiều đăng ký – vui lòng thử lại sau ít phút.');
  lienHe = String(lienHe || '').trim().slice(0, 80);
  // 17/11 (chủ dự án): chỉ đăng ký bằng email – để gửi mã xác thực nhận quà 39 xu
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(lienHe)) throw new Error('Nhập email hợp lệ (ví dụ: ten@gmail.com) – mã xác thực nhận quà sẽ gửi về email này.');
  if (tkTenTuEmail_(lienHe)) throw new Error('Email này đã có tài khoản – hãy đăng nhập bằng email và mật khẩu.');
  if (!String(user || '').trim()) {   // 17/11: hộp đăng ký 3 ô – tên đăng nhập tự tạo từ phần trước @ của email
    var goc = lienHe.split('@')[0].split('+')[0].toLowerCase().replace(/[^a-z0-9._-]/g, '').replace(/^[._-]+|[._-]+$/g, '').slice(0, 24);
    if (goc.length < 3) goc = (goc + 'tcc').slice(0, 24);
    user = goc; for (var i = 2; tkDoc_(user) && i < 999; i++) user = goc + i;
  }
  var gt = tkTen_(maGioiThieu), them = { lienHe: lienHe, tuDangKy: true };
  if (gt && gt !== tkTen_(user) && tkDoc_(gt)) them.gioiThieu = gt;
  var u = tkTaoMoi_(user, pass, hienThi, 'thanhVien', them);
  tkProps_().setProperty(tkKhoaEmail_(lienHe), u);
  c.put('DK_DEM', String(n + 1), 600);
  var r = dangNhap(u, pass);
  r.qua = { xu: 0, gt: 0 };
  r.canXacThuc = true; r.quaXacThuc = ttBangGia_().thuongDangKy;
  if (lienHe.indexOf('@') >= 0) r.emailGoiY = lienHe;
  return r;
}

/* ---------- Xác thực email bằng mã 6 số (16/11): mở quà chào mừng 39 xu ----------
 * Mã hiệu lực 15 phút; gửi lại tối thiểu sau 60 giây; tối đa 5 lần gửi mỗi ngày mỗi tài khoản; sai tối đa 5 lần mỗi mã.
 * Quota MailApp dùng chung với lời nhắn hằng ngày / bản tin: luôn chừa ~40 lượt cho người đang trả tiền.
 * Mã chỉ lưu dạng băm (kèm salt của tài khoản) trong bản ghi tài khoản. */
var TK_OTP = { phut: 15, choGiay: 60, toiDaNgay: 5, saiToiDa: 5, chuaQuota: 40, tongNgay: 40 };
/** Số lượt email cần chừa cho người đang trả tiền: người nhận lời nhắn mỗi sáng (+ bản tin vào ngày 1) + 10 dự phòng, tối thiểu 40 */
function tkChuaQuota_() {
  var n = 0;
  try { n += Math.max(0, tiShVanNgay_().getLastRow() - 1); if (new Date().getDate() <= 2) n += Math.max(0, tiShBanTin_().getLastRow() - 1); } catch (e) { }
  return Math.max(TK_OTP.chuaQuota, n + 10);
}
function tkMaSo_() { var h = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, ''); return String(1000000 + parseInt(h.slice(0, 12), 16) % 1000000).slice(1); }
function tkBamMa_(o, ma) { return tkSha_(String(o.salt || '') + '|otp|' + ma); }
function tkEmailHopLe_(e) { return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e); }
/** API: gửi mã 6 số tới email. Trả { ok:true, email, hetPhut, choGiay, conLuot } hoặc { ok:false, thongBao, choGiay | hetLuot | hetQuota } */
function guiMaEmail(token, email) {
  var u = tkCan_(token);
  email = String(email || '').trim().slice(0, 80);
  if (!tkEmailHopLe_(email)) throw new Error('Email chưa đúng định dạng (ví dụ: ten@gmail.com).');
  var hom = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd'), ma = tkMaSo_();
  var dat = ttKhoa_(function () {
    var o = tkDoc_(u.ten), now = Date.now(), x = o.otp;
    if (x && x.luc && now - x.luc < TK_OTP.choGiay * 1000) { var cho = Math.ceil((TK_OTP.choGiay * 1000 - (now - x.luc)) / 1000); return { ok: false, choGiay: cho, thongBao: 'Bạn vừa yêu cầu mã. Vui lòng đợi ' + cho + ' giây rồi bấm gửi lại.' }; }
    var dem = o.otpNgay === hom ? +o.otpDem || 0 : 0;
    if (dem >= TK_OTP.toiDaNgay) return { ok: false, hetLuot: true, thongBao: 'Hôm nay bạn đã yêu cầu mã ' + TK_OTP.toiDaNgay + ' lần. Vui lòng thử lại vào ngày mai.' };
    var P = PropertiesService.getScriptProperties(), tong = String(P.getProperty('OTP_TONG') || '').split('|'), tongN = tong[0] === hom ? +tong[1] || 0 : 0;
    if (tongN >= TK_OTP.tongNgay || MailApp.getRemainingDailyQuota() <= tkChuaQuota_()) return { ok: false, hetQuota: true, thongBao: 'Hôm nay hệ thống đã gửi gần hết số email được phép. Bạn vui lòng thử lại vào ngày mai nhé – quà vẫn chờ bạn.' };
    o.otp = { bam: tkBamMa_(o, ma), email: email, het: now + TK_OTP.phut * 60000, sai: 0, luc: now };
    o.otpNgay = hom; o.otpDem = dem + 1; tkGhi_(u.ten, o); P.setProperty('OTP_TONG', hom + '|' + (tongN + 1));
    return { ok: true, email: email, hetPhut: TK_OTP.phut, choGiay: TK_OTP.choGiay, conLuot: TK_OTP.toiDaNgay - dem - 1 };
  });
  if (!dat.ok) return dat;
  try {
    MailApp.sendEmail({ to: email, name: 'Thiên Cơ Các', subject: 'Mã xác thực Thiên Cơ Các: ' + ma,
      body: 'Mã xác thực email của bạn là: ' + ma + '\nMã có hiệu lực trong ' + TK_OTP.phut + ' phút. Nếu bạn không yêu cầu, hãy bỏ qua email này.',
      htmlBody: '<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#1d2733"><h2 style="color:#0b4a5c">Thiên Cơ Các</h2>' +
        '<p>Mã xác thực email của bạn:</p><p style="font-size:30px;font-weight:700;letter-spacing:6px;color:#0b4a5c">' + ma + '</p>' +
        '<p>Mã có hiệu lực trong ' + TK_OTP.phut + ' phút. Nếu bạn không yêu cầu, hãy bỏ qua email này.</p></div>' });
  } catch (e) {
    ttKhoa_(function () { var o = tkDoc_(u.ten); if (o.otp && o.otp.email === email) { delete o.otp; o.otpDem = Math.max(0, (+o.otpDem || 1) - 1); tkGhi_(u.ten, o); } });
    throw new Error('Chưa gửi được email lúc này. Bạn vui lòng thử lại sau ít phút.');
  }
  return dat;
}
/** API: nhập mã 6 số. Đúng → lưu email đã xác thực vào tài khoản và tặng quà chào mừng MỘT lần (mỗi email chuẩn hóa, mỗi tài khoản).
 *  Trả { ok:true, email, qua: { xu, gt, lyDo }, soDu } hoặc { ok:false, thongBao, conLan | hetHan | khoaMa | chuaCo } */
function xacThucEmail(token, ma) {
  var u = tkCan_(token);
  ma = String(ma || '').replace(/\D/g, '');
  return ttKhoa_(function () {
    var o = tkDoc_(u.ten), x = o.otp, now = Date.now();
    if (!x) return { ok: false, chuaCo: true, thongBao: 'Bạn chưa yêu cầu mã, hoặc mã đã được dùng. Bấm "Gửi mã" để nhận mã mới.' };
    if (now > x.het) { delete o.otp; tkGhi_(u.ten, o); return { ok: false, hetHan: true, thongBao: 'Mã đã hết hạn (' + TK_OTP.phut + ' phút). Bấm "Gửi lại mã" để nhận mã mới.' }; }
    if (x.sai >= TK_OTP.saiToiDa) return { ok: false, khoaMa: true, thongBao: 'Bạn đã nhập sai ' + TK_OTP.saiToiDa + ' lần nên mã này không dùng được nữa. Bấm "Gửi lại mã" để nhận mã mới.' };
    if (ma.length !== 6 || !tkBang_(tkBamMa_(o, ma), x.bam)) {
      x.sai = (+x.sai || 0) + 1; tkGhi_(u.ten, o);
      var con = TK_OTP.saiToiDa - x.sai;
      return con > 0 ? { ok: false, conLan: con, thongBao: 'Mã chưa đúng. Bạn còn ' + con + ' lần thử.' } :
        { ok: false, khoaMa: true, conLan: 0, thongBao: 'Bạn đã nhập sai ' + TK_OTP.saiToiDa + ' lần nên mã này không dùng được nữa. Bấm "Gửi lại mã" để nhận mã mới.' };
    }
    var qua = ttToanQuyen_(u) ? { xu: 0, gt: 0, lyDo: 'toanQuyen' } : ttQuaXacThuc_(u.ten, o, x.email);
    o = tkDoc_(u.ten); delete o.otp; o.email = x.email; o.emailXacThuc = new Date().toISOString(); tkGhi_(u.ten, o);
    if (!tkTenTuEmail_(x.email)) tkProps_().setProperty(tkKhoaEmail_(x.email), u.ten);   // tài khoản cũ: đăng nhập bằng email đã xác thực
    return { ok: true, email: x.email, qua: qua, soDu: ttToanQuyen_(u) ? null : ttSoDu_(u.ten) };
  });
}
function qtDatVaiTro(token, user, vaiTro) {
  tkCan_(token, true);
  var u = tkTen_(user), o = tkDoc_(u);
  if (!o) throw new Error('Không tìm thấy tài khoản.');
  if (o.vaiTro === 'chu') throw new Error('Không đổi vai trò chủ sở hữu.');
  o.vaiTro = vaiTro === 'vip' ? 'vip' : 'thanhVien';
  tkGhi_(u, o);
  return dsTaiKhoan(token);
}
function datLaiMatKhau(token, user, pass) {
  tkCan_(token, true);
  var u = tkTen_(user), o = tkDoc_(u);
  if (!o) throw new Error('Không tìm thấy tài khoản.');
  tkKiemMatKhau_(pass);
  o.salt = tkSalt_(); o.hash = tkBam_(pass, o.salt); tkGhi_(u, o);
  return true;
}
function xoaTaiKhoan(token, user) {
  var me = tkCan_(token, true), u = tkTen_(user);
  if (u === TK_CHU || u === me.ten) throw new Error('Không thể xóa tài khoản chủ sở hữu.');
  tkProps_().deleteProperty('TK_' + u);
  return dsTaiKhoan(token);
}

/* ---------- Lập lá số theo quyền ---------- */
function lapLaSo(input, token) {
  input = input || {};
  var u = tkPhien_(token);
  if (!u) input.save = false;
  input.taiKhoan = u ? u.ten : '';
  var r = lapLaSoDayDu_(input);
  try { r.teaser = demoTeaser_(r); } catch (e) { r.teaser = {}; }
  var khoa = ttKhoaLaSo_(input), bg = ttBangGia_();
  // Luận giải 6 hệ (12 cung Tử Vi, Bát Tự, Chiêm tinh, Thần số, HD, Hà Lạc) mở cho mọi người đọc.
  // Khóa: Tổng hợp 6 hệ (gói co_ban), đại vận – tiểu – nguyệt – nhật vận, biến cố, phối ngẫu, PDF đầy đủ, cặp đôi.
  var q = ttQuyen_(u, khoa);
  if (!q.toanQuyen) {
    ttCatPhan_(r, q);
    if (!q.co_ban) ttCatTongHop_(r);
  } else ttGanNamCd_(r, q);   // r.namCd: 4 chủ đề năm (đủ nội dung với toàn quyền)
  // Giá nâng lên combo sau khấu trừ (tối đa 50%) – giao diện hiện "mở trọn năm thêm X xu"
  if (u && !q.toanQuyen) r.giaNangCap = { dong_hanh: ttGiaNangCap_(q, 'dong_hanh', r.tuvi.info.viewYear, bg), tron_goi: ttGiaNangCap_(q, 'tron_goi', null, bg) };
  r.nguoiDung = u || null; r.khoa = khoa; r.quyen = q; r.bangGia = bg; r.dangNhap = !!u; r.canMo = !!u;
  r.soDu = u && !q.toanQuyen ? ttSoDu_(u.ten) : null; r.soVe = u && !q.toanQuyen ? ttSoVe_(u.ten) : 0;
  return r;
}
/** Tổng hợp 6 hệ chưa mở: bỏ kết luận ghép 6 hệ, chỉ giữ điểm 9 lĩnh vực + lĩnh vực mạnh nhất làm mồi (th6Moi_) */
function ttCatTongHop_(r) {
  var M = r.moRong || {}, T = M.tongHop, D = M.deHieu;
  r.th6 = th6Moi_(r);
  if (T) ['xuatThan', 'vocDang', 'coThe', 'tinhCach', 'duongDoi', 'nghe', 'matMa', 'tomLuoc', 'mayMan', 'phoiNgau'].forEach(function (k) { T[k] = null; });
  if (D) { delete D.th6; delete D.tongHop; }
  r.tongKhoa = true;
  return r;
}
/** Bản rút gọn cho khách: đủ để vẽ lá số và phần "hé lộ", không có lời luận */
function khachRutGon_(r) {
  var tv = r.tuvi, B = r.battu;
  return {
    khach: true, createdAt: r.createdAt, saoInfo: r.saoInfo, teaser: r.teaser,
    // Xem miễn phí: xuất thân, vóc dáng, tính cách, nghề hợp – để khách tự kiểm chứng độ chính xác
    mien: r.moRong && r.moRong.tongHop ? { xuatThan: r.moRong.tongHop.xuatThan, vocDang: r.moRong.tongHop.vocDang, tinhCach: r.moRong.tongHop.tinhCach, nghe: r.moRong.tongHop.nghe } : null,
    tuvi: { info: tv.info, palaces: tv.palaces, luanGiai: { cung: (tv.luanGiai.cung || []).map(function (c) { return { cung: c.cung, yNghia: c.yNghia }; }) } },
    battu: { pillars: B.pillars.map(function (p) { return { tru: p.tru, can: p.can, chi: p.chi, canTen: p.canTen, chiTen: p.chiTen, canHanh: p.canHanh, chiHanh: p.chiHanh }; }),
      nhatChu: B.nhatChu, cuong: B.cuong },
    moi: moiVanHan_(r),
    th6: th6Moi_(r)
  };
}
/** Mồi Tổng hợp 6 hệ cho bản miễn phí: điểm từng lĩnh vực và số hệ đồng thuận (không có lời luận); lộ trọn 1 lĩnh vực mạnh nhất */
function th6Moi_(r) {
  var T = r.moRong && r.moRong.deHieu && r.moRong.deHieu.th6;
  if (!T || T.loi || !T.linhVuc) return null;
  var tot = T.linhVuc.slice().sort(function (a, b) { return b.diem - a.diem; })[0];
  return { tomTat: T.tomTat, theManh: T.theManh, canChuY: T.canChuY,
    linhVuc: T.linhVuc.map(function (x) { return { ten: x.ten, icon: x.icon, diem: x.diem, huong: x.huong, dong: x.dong, soHe: x.soHe,
      lo: x.k === tot.k ? { ket: x.ket, noiBat: x.noiBat, manh: x.manh } : null, soNam: x.namToi.length }; }),
    soNam: T.namToi.length };
}
/** "Mồi" vận hạn cho bản giới hạn: chỉ khung + điểm, không có lời luận */
function moiVanHan_(r) {
  var CT = r.chiTiet || {}, T = (r.moRong && r.moRong.tongHop) || {}, vy = r.tuvi.info.viewYear;
  var out = {
    nam: vy,
    daiVan: (CT.daiVan || []).map(function (d) { return { khoang: d.khoang, nam: d.nam, cung: d.cung, diem: d.diem, danhGia: d.danhGia, isNow: d.isNow }; }),
    thang: (T.thang || []).map(function (m) { return { thang: m.thang, diem: m.diem, danhGia: m.danhGia }; }),
    namNay: T.namNay ? { tieuDe: T.namNay.tieuDe, diem: T.namNay.diem, dong: (T.namNay.ketLuan || [])[0] || '' } : null,
    tieuVan: CT.tieuVan ? { nam: CT.tieuVan.nam, canChi: CT.tieuVan.canChi, danhGia: CT.tieuVan.danhGia, diem: CT.tieuVan.diem } : null
  };
  return out;
}

/* ---------- Phần "hé lộ" (dùng cho khách và bản PDF xem thử) ---------- */
function che_(s) { return String(s).replace(/\b(19|20)(\d{2})\b/g, '$1██'); }
function demoTeaser_(res) {
  var I = res.tuvi.info, B = res.battu, M = res.moRong || {}, T = M.tongHop || {}, TL = T.tomLuoc, D = res.duDoan, vy = I.viewYear;
  var menh = res.tuvi.palaces[I.menh].chinh.map(function (s) { return s.n; }).join(' – ') || 'vô chính diệu';
  var cung = (res.tuvi.luanGiai.cung || []).slice().sort(function (a, b) { return b.diem - a.diem; });
  var dvNow = (res.chiTiet.daiVan || []).filter(function (d) { return d.isNow; })[0];
  var dvTot = (res.chiTiet.daiVan || []).filter(function (d) { return +String(d.nam).slice(0, 4) >= vy; }).sort(function (a, b) { return b.diem - a.diem; })[0];
  var out = {};
  out.tom = TL ? { lo: [TL.tieuDe + '.', TL.phuDe], an: ['2 điểm sáng khác được 6 hệ cùng xác nhận', '3 điều nên chăm chút để cân bằng hơn', '3 hành động then chốt cho 10 năm tới', 'Giai đoạn vàng của đời bạn: ' + che_(TL.chiSo[0].gt + ' tuổi (' + TL.chiSo[0].phu + ')')] } : null;
  out.chart = { lo: ['Mệnh ' + menh + ', Thân cư ' + I.thanCu + ', ' + I.cuc + '.', 'Cung mạnh nhất: ' + cung[0].cung + ' (' + cung[0].danhGia + ').'],
    an: ['Mảng đời cần chăm chút nhất và cách bồi đắp: ███','Ý nghĩa của ' + (res.tuvi.palaces[I.menh].tuan || res.tuvi.palaces[I.menh].triet ? 'Tuần/Triệt đang đóng ở Mệnh' : 'bộ sao tam hợp chiếu Mệnh') + ' với vận của bạn'] };
  out.chart.lo.push('Lá số có ' + (res.tuvi.luanGiai.cachCuc || []).length + ' cách cục nổi bật, trong đó có "' + ((res.tuvi.luanGiai.cachCuc || [])[0] || { ten: '—' }).ten + '".');
  out.chart.an = out.chart.an.concat(['Luận chi tiết 12 cung: tài lộc, sự nghiệp, hôn nhân, con cái, sức khỏe, nhà cửa…', 'Cung ' + cung[cung.length - 1].cung + ' đang ở mức "' + cung[cung.length - 1].danhGia + '" – vì sao và cách hóa giải']);
  var HT = T.hoiTu;
  if (HT) {
    var nong = (HT.cuaSo || []).filter(function (c) { return c.nam >= vy; });
    var manh = []; HT.chuDe.forEach(function (c) { c.dinh.forEach(function (x) { manh.push({ ten: c.ten, x: x }); }); });
    manh.sort(function (a, b) { return b.x.soHe - a.x.soHe || a.x.nam - b.x.nam; });
    out.bien = { lo: ['Trong 30 năm tới có ' + manh.length + ' mốc biến cố được từ 3 hệ trở lên cùng chỉ ra' + (manh[0] ? ' – mạnh nhất là "' + manh[0].ten + '" với ' + manh[0].x.soHe + ' hệ đồng thuận.' : '.')],
      an: manh.slice(0, 4).map(function (m) { return m.ten + ': năm ' + che_(m.x.nam) + ' – ' + m.x.soHe + ' hệ cùng báo'; }).concat(nong.length ? ['Năm "nóng" nhất phía trước: ' + che_(nong[0].nam) + ' – ' + nong[0].cd.length + ' chủ đề cùng hội tụ'] : []) };
  }
  out.van = { lo: dvNow ? ['Bạn đang ở đại vận ' + dvNow.khoang + ' tại cung ' + dvNow.cung + ' – đánh giá: ' + dvNow.danhGia + '.'] : [],
    an: ['Năm ' + vy + ' qua năm lăng kính: lĩnh vực nào mở, lĩnh vực nào cần phòng', 'Tháng tốt nhất và tháng cần tránh trong năm ' + vy + ' (Tử Vi × Bát Tự × Thần số)', '7 ngày tới: ngày nào nên ký kết, ngày nào nên nghỉ ngơi'] };
  if (T.thang && T.thang.length) { var tt = T.thang.slice().sort(function (a, b) { return b.diem - a.diem; })[0]; out.van.lo.push('Một tháng sáng trong năm ' + vy + ': tháng ' + tt.thang + ' âm lịch (' + tt.danhGia.toLowerCase() + ').'); }
  out.battu = { lo: ['Tứ trụ ' + B.pillars.map(function (p) { return p.canTen + ' ' + p.chiTen; }).join(' · ') + '.', 'Nhật chủ ' + B.nhatChu + ' – ' + B.cuong + '.'],
    an: ['Dụng thần – yếu tố giúp bạn đổi vận: ███', 'Cách cục Bát Tự: ███ cách', 'Luận Tứ Trụ đủ 12 lĩnh vực: cha mẹ, anh em, hôn nhân, con cái, tài lộc, sự nghiệp, sức khỏe…', 'Lưu niên Tứ Trụ 14 năm – năm nào dễ có hỷ sự 💍, năm nào cần thủ'] };
  if (M.haLac) {
    var HL = M.haLac.luan;
    out.halac = { lo: ['Quẻ Tiên thiên của bạn: ' + M.haLac.tien.ten + ' – ' + M.haLac.tien.y + '.'],
      an: ['Quẻ Hậu thiên (nửa sau đời): ████', 'Quẻ năm ' + vy + ': ' + (HL.namNay ? HL.namNay.danhGia.replace(/./g, '█') : '███') + ' – lời khuyên cụ thể', '12 vận hào và ' + HL.nam.length + ' quẻ năm được luận chi tiết'] };
  }
  if (M.chiemTinhLuan) {
    var C = M.chiemTinh; var by = {}; C.hanhTinh.forEach(function (p) { by[p.key] = p; });
    out.astro = { lo: [M.chiemTinhLuan.tomTat + '.'], an: ['Sao Kim ở ███ – cách bạn yêu và điều bạn thật sự cần ở người kia', 'Mốc Sao Thổ hồi quy của bạn: năm ' + che_((M.chiemTinhLuan.chuKy.filter(function (c) { return c.ten === 'Sao Thổ hồi quy'; })[0] || { nam: 2000 }).nam), (C.goc || []).length + ' góc chiếu định hình tính cách'] };
  }
  if (M.thanSo) out.so = { lo: ['Số chủ đạo ' + M.thanSo.duongDoi + ' – ' + tsTenNgan_(M.thanSo.duongDoi) + '.'], an: ['Số linh hồn: █ · Số sứ mệnh: █', 'Năm cá nhân ' + vy + ' là năm số █ – nên làm gì', '4 đỉnh cao đời người: đỉnh thứ hai bắt đầu năm ' + che_(I.solar.year + M.thanSo.dinhCao[1].tu)] };
  if (M.hd) out.hd = { lo: ['Bạn thuộc loại ' + M.hd.loaiTen + '.'], an: ['Thẩm quyền ra quyết định: ███', 'Hồ sơ ' + M.hd.profile.replace(/\d/g, '█') + ' – vai trò của bạn trong đời', 'Bản đồ 9 trung tâm và các kênh năng lượng'] };
  if (T.matMa && out.tom) out.tom.an.push(T.matMa.length + ' "mật mã cá nhân": nguyên tố linh hồn, con số định mệnh, khung giờ vàng, quý nhân…');
  if (T.tinhCach) out.nguoi = { lo: ['Tính cách: ' + (T.tinhCach.truc.filter(function (t) { return Math.abs(t.gt) > 0.35; })[0] || { moTa: '—' }).moTa.split(':')[0] + '.', T.xuatThan && T.xuatThan.ketLuan[0] ? (T.xuatThan.ketLuan[0].t || T.xuatThan.ketLuan[0]) : ''].filter(function (x) { return typeof x === 'string'; }),
    an: ['Xuất thân và gia cảnh mà 6 hệ cùng chỉ ra', 'Vóc dáng, nét mặt và dấu hiệu trên cơ thể (bớt, nốt ruồi, vùng dễ tổn thương)', 'Điểm mạnh – điểm cần rèn được nhiều hệ xác nhận'] };
  if (T.phoiNgau) {
    var P = T.phoiNgau, top = P.tuoiHop.tot[0];
    out.duyen = { lo: [P.ketLuan[0] ? String(P.ketLuan[0].t || P.ketLuan[0]).split('.')[0] + '.' : 'Chân dung người bạn đời được ghép từ 5 hệ.'],
      an: [(I.male ? 'Người vợ' : 'Người chồng') + ' tương lai: dáng ███, tính ███, gặp qua ███', 'Năm kết hôn & năm có con kèm xác suất % từng năm – cả 10 năm đã qua (nếu bạn đã lập gia đình) và các năm phía trước', 'Chân dung con cái: trai/gái, số con, tính cách', 'Tuổi hợp nhất: ' + che_(top.nam) + ' (' + top.diem + '/10) · 4 năm sinh hợp khác', 'Tháng sinh âm lịch và dương lịch hợp: █, █, █'] };
  }
  if (T.duongDoi) out.doi = { lo: [String(T.duongDoi.ketLuan[0] || T.duongDoi.chuDe[0] || '').replace(/^[✓✗◇]\s*/, '').split(/\.\s/)[0] + '.'], an: ['Nghề được nhiều hệ cùng gợi ý nhất: ███', 'Chặng đời rực rỡ nhất: ███ tuổi', '12 đại vận Tử Vi chi tiết – Tứ Hóa, cung chức từng vận'] };
  out.them = { lo: ['Kiểm chứng giờ sinh bằng các sự kiện bạn đã trải qua.'], an: ['Bảng màu – số – hướng – ngày may mắn tổng hợp từ 6 hệ'] };
  return out;
}
function tsTenNgan_(n) { var m = { 1: 'người tiên phong', 2: 'người hòa giải', 3: 'người truyền cảm hứng', 4: 'người thực tế', 5: 'người tự do', 6: 'người nuôi dưỡng', 7: 'người tìm chân lý', 8: 'người quyền lực', 9: 'người nhân đạo', 10: 'người linh hoạt', 11: 'bậc thầy trực giác', 22: 'bậc thầy kiến tạo', 33: 'bậc thầy chữa lành' }; return m[n] || ''; }

