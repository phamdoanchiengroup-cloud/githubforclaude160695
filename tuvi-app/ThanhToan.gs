/**
 * ============================================================
 *  ThanhToan.gs — VÍ XU, MỞ KHÓA TỪNG PHẦN, ĐƠN NẠP & QUẢN TRỊ
 *  - 1 xu = 1.000đ. Khách nạp xu qua VietQR (payOS tự đối soát, hoặc thủ công do chủ sở hữu xác nhận),
 *    rồi dùng xu mở khóa "Bản mở" (49 xu) và các phần trả thêm cho từng lá số.
 *  - Mô hình nhiều giai đoạn: bản mệnh mở 1 lần; VẬN HẠN bán theo từng đại vận (dv:<năm bắt đầu>), từng năm
 *    (nam:<năm>), nhật vận theo tháng (thang:<yyyy-mm>) và gói "Đồng hành cả năm" (dong_hanh:<năm>) → khách quay lại mỗi năm/tháng.
 *  - Gói gia đình: mua N "lượt mở" (sheet Ve), mỗi lượt mở Tổng hợp 6 hệ + vận năm hiện tại cho một lá số bất kỳ.
 *  - Khóa lá số = băm của (loại lịch, ngày, tháng, năm, nhuận, giờ, phút, giới tính, họ tên) – đổi năm xem không mất quyền.
 *  - Chủ sở hữu và thành viên VIP: toàn quyền, không trừ xu.
 *  - Dữ liệu trong Google Sheet: Vi, SoCai (sổ cái), MoKhoa, DonHang. Cấu hình payOS & bảng giá trong Script Properties.
 *  - Đối soát payOS bằng cách tự hỏi trạng thái đơn (khi khách đang chờ + trigger mỗi 5 phút), không cần webhook
 *    (Apps Script trả 302 cho POST và không đọc được header).
 * ============================================================
 */
/** Bảng giá "kéo người dùng" (10/2026): mọi phần 9–49 xu. goc = giá cũ, chỉ để hiển thị gạch ngang. */
var TT_GIA_PHIEN = 4;   // 16/11 (chủ dự án chốt): bán lẻ chỉ 9 hoặc 19 xu; năm tách "bức tranh chung" + 4 chủ đề; Đồng hành 49 – tăng số này khi đổi bảng giá mặc định → bảng giá cũ đã lưu trong Quản trị bị bỏ qua
/** Gói đổi nghĩa/giá ở phiên 4: giá lưu trong Quản trị từ phiên 3 không áp cho các gói này (lấy giá mặc định mới).
 *  'nam' cũng đổi nghĩa (nay chỉ là bức tranh chung, không gồm 4 chủ đề). */
var TT_GIA_DOI = ['dong_hanh', 'dai_van', 'van_ngay', 'tron_goi', 'gia_dinh_3', 'gia_dinh_5', 'nam'];
/** Phiên giá bắt đầu tách năm: dòng MoKhoa 'nam:<năm>' ghi ở phiên nhỏ hơn số này (hoặc không ghi phiên) là vận năm KIỂU CŨ → giữ cả 4 chủ đề */
var TT_NAM_TACH_PHIEN = 4;
/** 4 chủ đề năm (nam_cd:<cd>:<năm>) – khớp HSN_CD trong HoiTu.gs */
var TT_CHU_DE = ['cv', 'tien', 'tc', 'sk'];
/** Khấu trừ khi nâng lên combo: phần lẻ đã mua được trừ, nhưng tối đa 50% giá combo */
var TT_TRU_TOI_DA = 0.5;
var TT_PHAN_MAC_DINH = {
  co_ban: { ten: 'Tổng hợp 6 hệ – kết luận 9 lĩnh vực, chân dung, con người, tình duyên, đường đời', xu: 19 },   // miễn phí cho tài khoản (16/11)
  dai_van: { ten: '10 năm của bạn – luận chi tiết 1 đại vận', xu: 19, theo: 'dv' },
  dai_van_qua: { ten: 'Kiểm chứng 10 năm đã qua', xu: 9, theo: 'dv' },
  tron_dai_van: { ten: 'Trọn 12 đại vận cả đời (gói cũ)', xu: 69, an: true },   // 16/11: thôi bán riêng, nằm trong Trọn đời; người đã mua giữ quyền
  nam: { ten: 'Năm X: bức tranh chung', xu: 19, theo: 'nam' },   // X = năm đang xem (giao diện thay); không gồm chi tiết 4 chủ đề
  nam_cd: { ten: 'Năm X theo chủ đề', xu: 9, theo: 'nam_cd' },  // nam_cd:<cv|tien|tc|sk>:<năm>
  thang: { ten: 'Tháng của bạn – từng ngày trong 1 tháng', xu: 9, theo: 'thang' },
  dong_hanh: { ten: 'Đồng hành năm – bức tranh chung + 4 chủ đề + 12 tháng + bản tin tháng qua email', xu: 49, theo: 'nam' },
  bien_co: { ten: 'Những năm đáng chú ý của đời bạn (30 năm)', xu: 19 },
  phoi_ngau: { ten: 'Người bạn đời hợp với bạn và các tuổi hợp', xu: 9 },
  pdf: { ten: 'Sách luận giải PDF đầy đủ', xu: 19 },
  do_gio: { ten: 'Dò chính xác giờ sinh', xu: 9 },   // miễn phí cho tài khoản (16/11)
  tron_goi: { ten: 'Trọn đời – 12 đại vận, những năm đáng chú ý, người bạn đời, PDF đầy đủ', xu: 89 },
  hoi_vien: { ten: 'Hội viên năm (gói cũ)', xu: 99, theo: 'tk', an: true },   // 16/11: thôi bán; người đã mua giữ quyền đến hết hạn
  cap_doi: { ten: 'Hai bạn hợp nhau đến đâu – hợp đôi 2 lá số', xu: 19 },   // mở theo từng cặp, không thuộc trọn gói
  quan_he: { ten: 'Bạn và người thân: hiểu nhau hơn', xu: 9 },              // mở theo từng cặp người thân (khóa như cap_doi), luận theo vai trong gia đình
  // Tiện ích (TienIch.gs)
  xem_tuoi: { ten: 'Xem tuổi làm nhà, cưới hỏi – 10 năm + tuổi mượn', xu: 9 },
  phong_thuy: { ten: 'Phong thủy Bát trạch – 8 hướng, bố trí, màu hợp', xu: 19 },
  chon_ngay: { ten: 'Chọn ngày tốt – 1 việc trong 1 tháng', xu: 9, theo: 'ngay' },
  hop_tac: { ten: 'Hợp tác làm ăn – ghép 2 lá số', xu: 19 },        // mở theo từng cặp
  dat_ten: { ten: 'Đặt tên con – chấm tên & gợi ý theo ngũ hành', xu: 29 },   // mở theo lá số của bé
  gieo_que: { ten: 'Gieo quẻ hỏi việc – 1 câu hỏi', xu: 9 },         // trừ theo từng câu (gieoQue)
  ban_tin: { ten: 'Bản tin vận tháng qua email – 12 tháng (gói cũ)', xu: 39, an: true }, // 16/11: chỉ còn trong Đồng hành năm; người đã đăng ký giữ đến hết hạn
  van_ngay: { ten: 'Lời nhắn mỗi sáng qua email – 30 ngày', xu: 19 }, // đăng ký theo 30 ngày (dangKyVanNgay)
  gia_dinh_3: { ten: 'Gói gia đình 3 người – Đồng hành năm cho 3 lá số', xu: 79, luot: 3 },
  gia_dinh_5: { ten: 'Gói gia đình 5 người – Đồng hành năm cho 5 lá số', xu: 119, luot: 5 },
  luu_nien: { ten: 'Lưu niên nhiều năm (gói cũ)', xu: 19, an: true }   // gói cũ: người đã mua được xem mọi năm/tháng
};
/** 23/10/2026 (chủ dự án): Tiện ích miễn phí hết, chỉ hai phần báo cáo qua email (ban_tin, van_ngay) còn tính phí.
 *  Giá các phần này luôn về 0, kể cả khi Quản trị đã lưu giá khác. */
var TT_MIEN_PHI = ['xem_tuoi', 'phong_thuy', 'chon_ngay', 'hop_tac', 'dat_ten', 'gieo_que'];
/** Phần thuộc Trọn đời (không gồm vận năm/tháng – bán theo từng năm). co_ban, do_gio, xem_tuoi, phong_thuy nay miễn phí – giữ để người mua cũ không mất gì */
var TT_TRON_GOI = ['co_ban', 'tron_dai_van', 'bien_co', 'phoi_ngau', 'pdf', 'do_gio', 'xem_tuoi', 'phong_thuy'];
/** Phần lẻ được khấu trừ khi nâng lên Trọn đời (cộng thêm mọi đại vận lẻ dv:<năm> đã mua) */
var TT_TRON_GOI_TRU = ['tron_dai_van', 'bien_co', 'phoi_ngau', 'pdf'];
var TT_GOI_MAC_DINH = [{ tien: 20000, xu: 20 }, { tien: 50000, xu: 55 }, { tien: 100000, xu: 120 }, { tien: 200000, xu: 260 }];
/** Thưởng kéo người dùng: quà đăng ký, thưởng giới thiệu khi bạn bè đăng ký (xu), trần số lượt thưởng giới thiệu mỗi người */
var TT_KM_MAC_DINH = { lanDau: 100, gioiThieu: 0, dangKy: 39, gtDangKy: 0, gtToiDa: 30 };   // 16/11 (phiên 4): quà 39 xu chỉ khi xác thực email (mỗi email một lần, mỗi tài khoản một lần); bỏ thưởng mời
/** Phiên mức khuyến mại: quà đăng ký / thưởng mời lưu trong Quản trị ở phiên cũ bị bỏ qua (mã mời và trường gioiThieu vẫn giữ để dữ liệu cũ không lỗi). */
var TT_KM_PHIEN = 4;   // 16/11: quà 39 xu sau xác thực email, thưởng mời = 0
var TT_SH = {
  Vi: ['Tài khoản', 'Số dư (xu)', 'Cập nhật'],
  SoCai: ['Thời gian', 'Tài khoản', 'Thay đổi (xu)', 'Số dư sau', 'Lý do', 'Tham chiếu'],
  MoKhoa: ['Thời gian', 'Tài khoản', 'Khóa lá số', 'Phần', 'Xu', 'Lá số', 'Phiên giá'],   // Phiên giá: để phân biệt vận năm kiểu cũ (trống / < 4) với bức tranh chung
  DonHang: ['Mã đơn', 'Tài khoản', 'Số tiền (đ)', 'Xu', 'Trạng thái', 'Tạo lúc', 'Trả lúc', 'Kênh', 'Tham chiếu', 'Nội dung CK'],
  Ve: ['Tài khoản', 'Lượt mở còn lại', 'Cập nhật'],
  GieoQue: ['Thời gian', 'Tài khoản', 'Câu hỏi', 'Lĩnh vực', 'Kết quả (JSON)']
};
var TT_TRANG_THAI = { CHO: 'Chờ thanh toán', DA_TRA: 'Đã thanh toán', HUY: 'Đã hủy', HET_HAN: 'Hết hạn' };

/* ---------------- Lưu trữ ---------------- */
function laySS_() {
  var ss = null;
  try { ss = SpreadsheetApp.getActiveSpreadsheet(); } catch (e) { ss = null; }
  if (!ss) {
    var props = PropertiesService.getScriptProperties(), id = props.getProperty('SHEET_ID');
    if (id) { try { ss = SpreadsheetApp.openById(id); } catch (e2) { ss = null; } }
    if (!ss) { ss = SpreadsheetApp.create('Thiên Cơ Các – Lịch sử lá số'); props.setProperty('SHEET_ID', ss.getId()); }
  }
  return ss;
}
function ttSheet_(ten) {
  var ss = laySS_(), sh = ss.getSheetByName(ten);
  if (!sh) {
    sh = ss.insertSheet(ten);
    sh.appendRow(TT_SH[ten]);
    sh.getRange(1, 1, 1, TT_SH[ten].length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}
/** Chuỗi người dùng nhập trước khi ghi Sheet (rà soát 16/11): LUÔN thêm dấu ' để Sheet giữ nguyên dạng chữ –
 *  tên đăng nhập "0912345678" không mất số 0 đầu (mất ví), "5-mar" không bị đổi thành ngày, "=IMPORTDATA(…)" không thành công thức.
 *  Sheet tự bỏ dấu ' này: ô hiển thị và giá trị đọc ra vẫn đúng chuỗi gốc, TextFinder vẫn tìm thấy. */
function shO_(v) { return typeof v === 'string' && v !== '' ? "'" + v : v; }
/** Các dòng (1-based) có ô cột col trùng khớp tuyệt đối với val */
function ttTim_(sh, col, val) {
  var last = sh.getLastRow();
  if (last < 2) return [];
  return sh.getRange(2, col, last - 1, 1).createTextFinder(String(val)).matchEntireCell(true).matchCase(true).findAll()
    .map(function (r) { return r.getRow(); });
}
function ttKhoa_(fn) {
  var l = LockService.getScriptLock();
  l.waitLock(20000);
  try { return fn(); } finally { l.releaseLock(); }
}

/* ---------------- Bảng giá & cấu hình ---------------- */
function ttBangGia_() {
  var phan = JSON.parse(JSON.stringify(TT_PHAN_MAC_DINH)), goi = TT_GOI_MAC_DINH.slice(), km = JSON.parse(JSON.stringify(TT_KM_MAC_DINH));
  try {
    var v = PropertiesService.getScriptProperties().getProperty('TT_BANG_GIA');
    if (v) {
      var o = JSON.parse(v), cungPhien = +o.phien === TT_GIA_PHIEN, phienTruoc = +o.phien === TT_GIA_PHIEN - 1;
      // Bảng giá lưu từ phiên cũ hơn bị bỏ qua – chỉ giữ các mức thưởng. Phiên liền trước (2): giữ giá tùy chỉnh + gói nạp,
      // trừ các gói đổi nghĩa ở phiên 3 (TT_GIA_DOI) – các gói này lấy giá mặc định mới
      if (cungPhien || phienTruoc) {
        Object.keys(o.phan || {}).forEach(function (k) { if (phan[k] && o.phan[k] >= 0 && (cungPhien || TT_GIA_DOI.indexOf(k) < 0)) phan[k].xu = Math.round(o.phan[k]); });
        if (o.goi && o.goi.length) goi = o.goi.filter(function (g) { return g.tien > 0 && g.xu > 0; });
      }
      if (o.thuongLanDau != null) km.lanDau = Math.max(0, Math.min(500, +o.thuongLanDau || 0));
      if (o.thuongGioiThieu != null && +o.kmPhien === TT_KM_PHIEN) km.gioiThieu = Math.max(0, Math.min(100, +o.thuongGioiThieu || 0));
      if (o.thuongDangKy != null && +o.kmPhien === TT_KM_PHIEN) km.dangKy = Math.max(0, Math.min(200, +o.thuongDangKy || 0));
      if (o.thuongGTDangKy != null && +o.kmPhien === TT_KM_PHIEN) km.gtDangKy = Math.max(0, Math.min(100, +o.thuongGTDangKy || 0));
    }
  } catch (e) { /* dùng mặc định */ }
  TT_MIEN_PHI.forEach(function (k) { if (phan[k]) { phan[k].xu = 0; phan[k].mienPhi = true; delete phan[k].goc; } });
  Object.keys(phan).forEach(function (k) { delete phan[k].goc; });   // 16/11: bỏ giá gạch ngang (giá chưa từng bán)
  return { phan: phan, goi: goi, xuVnd: 1000, thuongLanDau: km.lanDau, thuongGioiThieu: km.gioiThieu,
    thuongDangKy: km.dangKy, thuongGTDangKy: km.gtDangKy, gtToiDa: km.gtToiDa };
}
/** Bảng giá công khai (khách chưa đăng nhập cũng xem được) */
function bangGiaCongKhai() {
  var bg = ttBangGia_();
  bg.url = (function () { try { return ScriptApp.getService().getUrl(); } catch (e) { return ''; } })();
  return bg;
}
/** Liên hệ chuẩn hóa để chặn nhận quà trùng: email chữ thường; SĐT chỉ số, +84/84 → 0 */
function ttLienHeChuan_(lh) {
  lh = String(lh || '').trim().toLowerCase();
  if (!lh) return '';
  if (lh.indexOf('@') >= 0) {   // bỏ phần +bí danh; Gmail bỏ cả dấu chấm (a.b+1@gmail.com = ab@gmail.com)
    var at = lh.lastIndexOf('@'), ten = lh.slice(0, at).split('+')[0], mien = lh.slice(at + 1);
    if (mien === 'googlemail.com') mien = 'gmail.com';
    if (mien === 'gmail.com') ten = ten.replace(/\./g, '');
    return ten + '@' + mien;
  }
  var so = lh.replace(/\D/g, ''); if (/^84\d{9,10}$/.test(so)) so = '0' + so.slice(2);
  return so;
}
/** Tài khoản đã từng nhận quà chào mừng chưa (cờ mới daNhanQua, hoặc sổ cái có dòng quà 'DK' của tài khoản – gồm cả quà 50/9 xu kiểu cũ) */
function ttDaNhanQua_(ten, o) {
  if (o && o.daNhanQua) return true;
  var sh = ttSheet_('SoCai');
  return ttTim_(sh, 2, ten).some(function (r) { var v = sh.getRange(r, 1, 1, 6).getValues()[0]; return String(v[5]) === 'DK' && +v[2] > 0 && /^Quà chào mừng/.test(String(v[4])); });
}
/** Quà chào mừng sau khi xác thực email (16/11, phiên khuyến mại 4). GỌI BÊN TRONG ttKhoa_ (xacThucEmail).
 *  Mỗi email chuẩn hóa nhận 1 lần (khóa QUA_LH_ dùng chung với quà kiểu cũ); mỗi tài khoản nhận 1 lần. o = bản ghi tài khoản (được cập nhật + ghi lại). */
function ttQuaXacThuc_(ten, o, email) {
  var bg = ttBangGia_(), qua = { xu: 0, gt: 0, lyDo: '' }, P = PropertiesService.getScriptProperties();
  if (!(bg.thuongDangKy > 0)) { qua.lyDo = 'tat'; return qua; }
  if (ttDaNhanQua_(ten, o)) { qua.lyDo = 'taiKhoan'; return qua; }
  var lh = ttLienHeChuan_(email), khoaLH = lh ? 'QUA_LH_' + tkSha_(lh).slice(0, 24) : '';
  if (!khoaLH) { qua.lyDo = 'email'; return qua; }
  if (P.getProperty(khoaLH)) { qua.lyDo = 'email'; return qua; }   // email này đã nhận quà (ở tài khoản khác)
  ttCong_(ten, bg.thuongDangKy, 'Quà chào mừng khi xác thực email', 'DK'); qua.xu = bg.thuongDangKy;   // cộng xu xong mới đánh dấu: ghi sổ lỗi thì không mất quà
  P.setProperty(khoaLH, ten); o.daNhanQua = true; tkGhi_(ten, o);
  var gt = o.gioiThieu, og = gt && bg.thuongGTDangKy > 0 ? tkDoc_(gt) : null;   // thưởng mời: mặc định 0 từ phiên 4 (chỉ bật lại được trong Quản trị)
  if (og) {
    ttCong_(ten, bg.thuongGTDangKy, 'Thưởng đăng ký qua lời mời của ' + gt, 'DK'); qua.xu += bg.thuongGTDangKy; qua.gt = bg.thuongGTDangKy;
    var n = +og.soMoiDK || 0;
    if (n < bg.gtToiDa) { ttCong_(gt, bg.thuongGTDangKy, 'Bạn ' + ten + ' đăng ký qua lời mời của bạn', 'GT'); og.soMoiDK = n + 1; tkGhi_(gt, og); }
  }
  return qua;
}

function ttCauHinh_() {
  var c = {};
  try { c = JSON.parse(PropertiesService.getScriptProperties().getProperty('TT_CAU_HINH') || '{}'); } catch (e) { c = {}; }
  c.nganHang = c.nganHang || {};
  c.payos = !!(c.clientId && c.apiKey && c.checksum);
  return c;
}

/* ---------------- Ví xu ---------------- */
function ttSoDu_(u) {
  var sh = ttSheet_('Vi'), r = ttTim_(sh, 1, u);
  return r.length ? Number(sh.getRange(r[0], 2).getValue()) || 0 : 0;
}
/** Cộng/trừ xu – gọi bên trong ttKhoa_ */
function ttCong_(u, n, lyDo, thamChieu) {
  var sh = ttSheet_('Vi'), r = ttTim_(sh, 1, u);
  var cu = r.length ? Number(sh.getRange(r[0], 2).getValue()) || 0 : 0, moi = cu + n;
  if (moi < 0) throw new Error('Số dư không đủ.');
  if (r.length) sh.getRange(r[0], 2, 1, 2).setValues([[moi, new Date()]]);
  else sh.appendRow([shO_(u), moi, new Date()]);
  ttSheet_('SoCai').appendRow([new Date(), shO_(u), n, moi, lyDo, thamChieu || '']);
  return moi;
}

/* ---------------- Quyền mở khóa theo lá số ---------------- */
function ttKhoaLaSo_(input) {
  input = input || {};
  var ten = String(input.name || '').trim().toLowerCase().replace(/\s+/g, ' ');
  var s = [input.calendar === 'am' ? 'am' : 'duong', +input.day || 0, +input.month || 0, +input.year || 0, input.leap ? 1 : 0,
    +input.hour || 0, +input.minute || 0, input.gender === 'nu' ? 'nu' : 'nam', ten].join('|');
  return 'LS' + tkSha_(s).slice(0, 24);
}
function ttToanQuyen_(u) { return !!u && (u.vaiTro === 'chu' || u.vaiTro === 'vip'); }
function ttQuyen_(u, khoa) {
  // daMua: phần (không theo thời gian) đã thật sự trả tiền; daTra: xu đã trả theo từng mã (để combo trừ đúng số đã trả)
  // namCu: năm mua "Vận năm" kiểu cũ (trước phiên 4) → giữ cả 4 chủ đề; cdMo: chủ đề năm đã mua ('cv:2027')
  var q = { dvMo: {}, namMo: {}, namCu: {}, cdMo: {}, thangMo: {}, dhNam: {}, daMua: {}, daTra: {} };
  Object.keys(TT_PHAN_MAC_DINH).forEach(function (k) { q[k] = false; });
  if (!u) return q;
  if (ttToanQuyen_(u)) { Object.keys(TT_PHAN_MAC_DINH).forEach(function (k) { q[k] = true; }); q.toanQuyen = q.dvAll = q.namAll = q.thangAll = true; return q; }
  var sh = ttSheet_('MoKhoa');
  ttTim_(sh, 3, khoa).forEach(function (r) {
    var v = sh.getRange(r, 1, 1, Math.min(7, sh.getMaxColumns ? sh.getMaxColumns() : 7)).getValues()[0];
    if (String(v[1]) !== u.ten) return;
    var p = String(v[3]), m = p.match(/^(dv|nam|thang|dong_hanh|nam_cd):(.+)$/);
    q.daTra[p] = (q.daTra[p] || 0) + (+v[4] || 0);
    if (!m) { q[p] = true; q.daMua[p] = true; return; }
    if (m[1] === 'dong_hanh') q.dhNam[m[2]] = true;
    else if (m[1] === 'nam_cd') q.cdMo[m[2]] = true;
    else { q[m[1] + 'Mo'][m[2]] = true; if (m[1] === 'nam' && !((+v[6] || 0) >= TT_NAM_TACH_PHIEN)) q.namCu[m[2]] = true; }
  });
  // 16/11 (phương án A): tài khoản đã đăng nhập được Tổng hợp 6 hệ + dò giờ sinh miễn phí; 1 đại vận đã qua gần nhất mở ở ttCatPhan_
  q.taiKhoan = true; q.co_ban = true; q.do_gio = true;
  var hv = ttHoiVien_(u.ten);
  if (hv) { q.hoiVien = hv; q.namAll = q.thangAll = true; }
  if (q.tron_goi) TT_TRON_GOI.forEach(function (k) { q[k] = true; });
  if (q.tron_dai_van) q.dvAll = true;
  if (q.luu_nien) q.namAll = q.thangAll = true;   // gói cũ
  return q;
}
/** Hạn Hội viên năm còn hiệu lực ('yyyy-mm-dd') hoặc '' – lưu ở MoKhoa với khóa 'TK:<tài khoản>' */
function ttHoiVien_(ten) {
  var sh = ttSheet_('MoKhoa'), han = '';
  ttTim_(sh, 3, 'TK:' + ten).forEach(function (r) { var m = String(sh.getRange(r, 4).getValue()).match(/^hoi_vien:(\d{4}-\d{2}-\d{2})$/); if (m && m[1] > han) han = m[1]; });
  return han && han >= Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd') ? han : '';
}
/** Rà soát Đợt 3 (B1): lời luận theo năm/tháng/ngày của Chiêm tinh, Human Design, Thần số chỉ giữ khung + con số khi năm chưa mở */
function ttCatNamHe_(r, coNam, coThang, vy) {
  var M = r.moRong || {}, KN = 'Lời luận năm ' + vy + ' nằm trong phần Vận năm (hoặc Hội viên năm).', KT = '';
  (function w(o) {   // mục "Vận trình" trong phần luận từng hệ
    if (!o || typeof o !== 'object') return;
    if (o.k === 'vanTrinh' && Array.isArray(o.items)) { if (!coNam) { o.items = [KN]; o.khoa = true; } return; }
    for (var k in o) if (o.hasOwnProperty(k)) w(o[k]);
  })([M.hd, M.thanSo, M.chiemTinhLuan]);
  var C = M.chiemTinhLuan, H = M.hd && M.hd.phanTich, S = M.thanSo && M.thanSo.phanTich;
  if (!coNam) {
    if (C && C.namXem) { C.namXem.items = [KN]; C.namXem.khoa = true; }
    if (C && C.secs) C.secs.forEach(function (x) { if (x && Array.isArray(x.items) && x.items.some(function (t) { return /Hồ sơ năm|Solar Return|Transit/.test(t); })) { x.items = x.items.filter(function (t) { return !/Hồ sơ năm|Solar Return|Transit/.test(t); }).concat([KN]); x.khoa = true; } });
    if (C && C.phanTich && C.phanTich.chuKy) { var ck = C.phanTich.chuKy; Object.keys(ck).forEach(function (k) { if (Array.isArray(ck[k])) ck[k].forEach(function (t) { if (t && typeof t.t === 'string') t.t = ''; }); else if (typeof ck[k] === 'string' && k !== 'ngayXet') ck[k] = ''; }); ck.khoa = true; }
    if (H) ['solarReturn', 'transit'].forEach(function (k) { if (H[k]) { if (typeof H[k].t === 'string') H[k].t = KN; H[k].kenh = []; H[k].trungTam = []; H[k].khoa = true; } });
    if (S && S.chuKy) S.chuKy.forEach(function (c) { if (c.nam >= vy) { c.y = KT; c.khoa = true; } });
    if (S && S.thang) S.thang.forEach(function (c) { c.y = KT; c.khoa = true; });
    if (M.tongHop && M.tongHop.namNay) M.tongHop.namNay.nguon = [];
    ((M.tongHop && M.tongHop.matMa) || []).forEach(function (x) { if (x && typeof x.y === 'string' && x.y.indexOf('Năm ' + vy + ', ba tháng') >= 0) x.y = x.y.slice(0, x.y.indexOf('Năm ' + vy + ', ba tháng')).trim(); });   // 26 câu luận năm của 6 hệ
    var coNamVy = new RegExp('[Nn]ăm ' + vy);
    // Chu kỳ Chiêm tinh (transit, tiến triển, Solar Arc): bỏ câu luận năm đang xem và các năm tới
    var namToi = function (t) { var m = String(t).match(/(?:[Nn]ăm|khoảng năm) (\d{4})/); return !!m && +m[1] >= vy; };
    if (C && C.phanTich && C.phanTich.chuKy) (function w(o) {
      for (var k in o) if (o.hasOwnProperty(k) && k !== 'ngayXet') {
        if (Array.isArray(o[k])) { o[k] = o[k].filter(function (x) { return !(typeof x === 'string' && namToi(x)); }); w(o[k]); }
        else if (typeof o[k] === 'string') { if (namToi(o[k]) || k === 't') o[k] = ''; }
        else if (o[k] && typeof o[k] === 'object') w(o[k]);
      }
    })(C.phanTich.chuKy);
    if (C && C.phanTich && C.phanTich.chuKy && C.phanTich.chuKy.solarReturn) { C.phanTich.chuKy.solarReturn.ds = [KN]; C.phanTich.chuKy.solarReturn.khoa = true; }   // rà soát Đợt 3–4 S1
    [C && C.phanTich, S, H].forEach(function (P) { ((P && P.loiKhuyen) || []).forEach(function (x) { if (x && typeof x.t === 'string' && coNamVy.test(x.t)) { x.t = KN; x.khoa = true; } }); });
    if (S && S.chuyenTiep) { if (typeof S.chuyenTiep.ket === 'string') S.chuyenTiep.ket = KN; if (typeof S.chuyenTiep.tron === 'string') S.chuyenTiep.tron = KN; }
    var HLt = M.haLac && M.haLac.luan && M.haLac.luan.tongQuan;
    if (Array.isArray(HLt)) M.haLac.luan.tongQuan = HLt.map(function (t) { return typeof t === 'string' && t.indexOf('Năm ' + vy) === 0 ? t.split(' – ')[0] + '. ' + KN : t; });
    var D = M.deHieu || {}, laNam = new RegExp('^(Năm nay|Năm ' + vy + '|Thời điểm hành động|Chủ đề năm theo tên của bạn)$'), cauNam = new RegExp('Năm ' + vy + '|Năm Cá Nhân|Năm thu hoạch|Chu kỳ 9 năm mới');
    Object.keys(D).forEach(function (h) {
      ((D[h] && D[h].khoi) || []).forEach(function (k) { (k.doan || []).forEach(function (d) {
        if (laNam.test(String(d.tieuDe || ''))) { d.text = KN; d.list = []; d.khoa = true; return; }
        if (Array.isArray(d.list) && d.list.some(function (t) { return cauNam.test(t); })) { d.list = d.list.filter(function (t) { return !cauNam.test(t); }).concat([KN]); d.khoa = true; }
      }); });
    });
  }
  if (!coThang && S && S.ngay) S.ngay.forEach(function (c) { c.y = KT; c.khoa = true; });
}
/** Năm bắt đầu của đại vận ĐÃ QUA gần nhất (miễn phí cho tài khoản – tự kiểm chứng), hoặc null */
function ttDvMienPhi_(dsBatDau) {
  var n = new Date().getFullYear(), qua = dsBatDau.filter(function (b) { return b + 9 < n; });
  return qua.length ? Math.max.apply(null, qua) : null;
}
function ttPad2_(n) { return (n < 10 ? '0' : '') + n; }
function ttCoDv_(q, nam) { return !!(q.toanQuyen || q.dvAll || q.dvMo[String(nam)]); }
function ttCoDh_(q, y) { return !!(q.toanQuyen || q.dhNam[String(y)] || (q.namAll && q.thangAll)); }   // Hội viên năm / lưu niên đã gồm Đồng hành
function ttCoNam_(q, y) { return !!(q.toanQuyen || q.namAll || q.namMo[String(y)] || q.dhNam[String(y)]); }
/** Chủ đề năm cd (cv/tien/tc/sk) của năm y: đã mua chủ đề, có Đồng hành năm đó (gồm Hội viên/lưu niên/lượt gia đình), hoặc vận năm kiểu cũ */
function ttCoCd_(q, y, cd) { y = String(y); return !!(q.toanQuyen || ttCoDh_(q, y) || (q.namCu || {})[y] || (q.cdMo || {})[cd + ':' + y]); }
/** Giá combo sau khi trừ phần lẻ đã trả – trừ tối đa TT_TRU_TOI_DA (50%) giá combo */
function ttGiaCombo_(gia, daTra) { return gia - Math.min(Math.max(0, daTra || 0), Math.floor(gia * TT_TRU_TOI_DA)); }
/** Tổng xu đã trả cho các mã thỏa điều kiện */
function ttTongDaTra_(q, loc) { return Object.keys(q.daTra || {}).filter(loc).reduce(function (s, k) { return s + q.daTra[k]; }, 0); }
function ttCoThang_(q, y, m) { return !!(q.toanQuyen || q.thangAll || q.dhNam[String(y)] || q.thangMo[y + '-' + ttPad2_(+m)]); }
/** Tháng dương lịch của tuần nhật vận đang xem ("26/9/2026" → [2026, 9]) */
function ttThangNhatVan_(r) {
  var n = r.chiTiet && r.chiTiet.nhatVan && r.chiTiet.nhatVan[0], m = n && String(n.ngay).match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (m) return [+m[3], +m[2]];
  var d = new Date(); return [d.getFullYear(), d.getMonth() + 1];
}
/** Cắt bớt các phần chưa mở khỏi kết quả đầy đủ (Bản mở đã có). Phần bị khóa giữ lại "tiêu đề + điểm" làm mồi. */
function ttCatPhan_(r, q) {
  var vy = r.tuvi.info.viewYear, T = r.moRong && r.moRong.tongHop, CT = r.chiTiet || {};
  var namNay = new Date().getFullYear();
  // 16/11: tài khoản được đọc miễn phí đại vận ĐÃ QUA gần nhất (tự kiểm chứng)
  if (q.taiKhoan && !q.toanQuyen && !q.dvAll) {
    var mp = ttDvMienPhi_((CT.daiVan || []).map(function (d) { return +String(d.nam).slice(0, 4); }));
    if (mp) { q.dvMo = JSON.parse(JSON.stringify(q.dvMo)); q.dvMo[String(mp)] = true; q.dvQuaMienPhi = mp; }
  }
  var coNam = ttCoNam_(q, vy), tn = ttThangNhatVan_(r), coThang = ttCoThang_(q, tn[0], tn[1]);
  // Lời luận gắn với đại vận cụ thể trong các tab từng hệ (rà soát V2): vận chưa mở chỉ giữ khung + mức
  // Rà soát Đợt 3 (B2/B3): chỉ mở giai đoạn trùng năm với đại vận Tử Vi đang mở (vận đã qua miễn phí hoặc vận đã mua)
  // Giai đoạn đang diễn ra chỉ mở khi đại vận Tử Vi HIỆN TẠI đã mở (không "ăn theo" vận đã qua miễn phí)
  function vanMo(bd, kt) {
    if (q.toanQuyen || q.dvAll) return true;
    var dangDien = bd <= namNay && namNay <= kt;
    return Object.keys(q.dvMo).some(function (k) { k = +k; return bd <= k + 9 && kt >= k && (!dangDien || (k <= namNay && namNay <= k + 9)); });
  }
  var KHOA_DV = 'Lời luận chi tiết của giai đoạn này nằm trong phần vận hạn (12 đại vận hoặc Trọn đời).';
  if (r.duDoan && r.duDoan.vanLon) ['tot', 'xau'].forEach(function (k) {
    (r.duDoan.vanLon[k] || []).forEach(function (d) { var bd = +String(d.nam).slice(0, 4); if (!(q.toanQuyen || q.dvAll || ttCoDv_(q, bd))) { d.hoa = []; d.linhVuc = [KHOA_DV]; d.khoa = true; } });
  });
  if (r.battuChiTiet && r.battuChiTiet.daiVanCungVi) r.battuChiTiet.daiVanCungVi.forEach(function (d) {
    if (!vanMo(+d.nam, +d.nam + 9)) { d.items = [KHOA_DV]; d.khoa = true; }
  });
  if (r.moRong && r.moRong.haLac && r.moRong.haLac.luan) (r.moRong.haLac.luan.daiVan || []).forEach(function (v) {
    if (!vanMo(+String(v.nam).slice(0, 4), +String(v.nam).slice(-4))) { v.items = [KHOA_DV]; v.khoa = true; }
  });
  if (!coNam || !coThang) ttCatNamHe_(r, coNam, coThang, vy);
  ttGanNamCd_(r, q);   // 4 chủ đề năm – dựng từ Hồ sơ năm ĐẦY ĐỦ, phải chạy trước khi cắt Hồ sơ năm
  var tomTat = { nam: vy, coNam: coNam, thangNhat: tn[0] + '-' + ttPad2_(tn[1]), coThang: coThang, dv: [], cd: {} };
  TT_CHU_DE.forEach(function (cd) { tomTat.cd[cd] = ttCoCd_(q, vy, cd); });
  if (!q.bien_co) {
    if (r.duDoan) { r.duDoan.chuDe = {}; delete r.duDoan._years; }
    if (T) { T.hoiTu = null; T.bienCo = null; }
  }
  if (!q.phoi_ngau && T) T.phoiNgau = null;
  // ĐẠI VẬN: giữ khung (tuổi, năm, cung, điểm) – bỏ lời luận của vận chưa mở
  (CT.daiVan || []).forEach(function (d) {
    var bd = +String(d.nam).slice(0, 4), co = ttCoDv_(q, bd);
    tomTat.dv.push({ nam: bd, co: co });
    if (!co) { d.secs = []; d.khoa = true; }
  });
  // Sao hạn đại vận trong bước 26 (TuViChuyenSau.gs › tvcsSaoHanCong_): vận chưa mở chỉ giữ khung + mức
  if (CT.saoHan) CT.saoHan = CT.saoHan.map(function (v) {
    return ttCoDv_(q, v.tuNam) ? v : { tu: v.tu, den: v.den, tuNam: v.tuNam, denNam: v.denNam, cung: v.cung, hienTai: v.hienTai, muc: v.muc, huong: v.huong, khoa: true };
  });
  if (T && T.daiVanSau && T.daiVanSau.ds) T.daiVanSau.ds = T.daiVanSau.ds.map(function (d) {
    return ttCoDv_(q, d.nam) ? d : { nam: d.nam, den: d.den, khoang: d.khoang, isNow: d.isNow, nhan: d.nhan, huong: d.huong, he: d.he.map(function (x) { return { he: x.he, huong: x.huong }; }), khoa: true };
  });
  if (T && T.duongDoi) (T.duongDoi.chang || []).forEach(function (c) {
    var bd = +String(c.nam).slice(0, 4);
    if (!ttCoDv_(q, bd)) { c.lines = (c.lines || []).slice(0, 1); c.khoa = true; }
  });
  // HỒ SƠ NĂM theo chủ đề (16/11): sự kiện / khía cạnh của chủ đề chưa mở chỉ giữ nhãn – kể cả khi đã mua bức tranh chung
  if (T && T.hoSoNam && !T.hoSoNam.loi) {
    var H0 = T.hoSoNam, lo0 = H0.noiBat[0], moKc = function (kc) { return ttCoCd_(q, vy, htCdCuaKc_(kc)); };
    H0.khiaCanh = H0.khiaCanh.map(function (x) { return moKc(x.k) ? x : { k: x.k, ten: x.ten, icon: x.icon, nhan: x.nhan, huong: x.huong, doiLap: x.doiLap, sk: x.sk, cd: htCdCuaKc_(x.k), khoa: true }; });
    H0.suKien = H0.suKien.map(function (x) { return moKc(x.kc) || x.k === lo0 ? x : { k: x.k, kc: x.kc, loai: x.loai, ten: x.ten, ngan: x.ngan, ngoai: x.ngoai, cd: htCdCuaKc_(x.kc), khoa: true }; });   // giữ 1 sự kiện nổi bật làm mồi
  }
  // VẬN NĂM
  if (!coNam) {
    if (CT.tieuVan) { CT.tieuVan.secs = []; CT.tieuVan.luu = null; CT.tieuVan.khoa = true; }
    CT.nguyetVan = [];
    if (T && T.namNay) { T.namNay.ketLuan = (T.namNay.ketLuan || []).slice(0, 1); T.namNay.linhVuc = []; T.namNay.khoa = true; }
    if (T && T.thang) T.thang = T.thang.map(function (m) { return { thang: m.thang, canChi: m.canChi, batDau: m.batDau, diem: m.diem, danhGia: m.danhGia, khoa: true }; });
    if (r.moRong && r.moRong.haLac && r.moRong.haLac.luan && r.moRong.haLac.luan.namNay) { var hn = r.moRong.haLac.luan.namNay; hn.y = ''; hn.khuyen = ''; hn.ghi = []; hn.khoa = true; }
    // Hồ sơ năm (bức tranh chung chưa mở): giữ thế đứng 5 hệ + nhãn khía cạnh; sự kiện đã cắt theo chủ đề ở trên
    if (T && T.hoSoNam && !T.hoSoNam.loi) {
      var H = T.hoSoNam;
      H.tom = H.tom.slice(0, 1); H.khoa = true; delete H.hanhDong; delete H.cauNoi;
      if (H.gocNhin) H.gocNhin = H.gocNhin.map(function (x) { return { he: x.he, vai: x.vai }; });
      H.he = H.he.map(function (x) { return { he: x.he, nguon: x.nguon, huong: x.huong, nhan: x.nhan }; });
    }
    // Hồ sơ 12 tháng: chỉ giữ khung tháng + đánh giá chung
    if (T && T.hoSoThang && !T.hoSoThang.loi) {
      T.hoSoThang.khoa = true; T.hoSoThang.suKien = [];
      T.hoSoThang.thang = T.hoSoThang.thang.map(function (m) { return { thang: m.thang, nay: m.nay, canChi: m.canChi, tu: m.tu, den: m.den, danhGia: m.danhGia, diem: m.diem, khoa: true }; });
    }
  }
  if (r.battuChiTiet && r.battuChiTiet.luuNien) r.battuChiTiet.luuNien = r.battuChiTiet.luuNien.filter(function (y) { return ttCoNam_(q, y.nam); });
  if (r.moRong && r.moRong.haLac && r.moRong.haLac.luan) {
    var HL = r.moRong.haLac.luan;
    if (HL.nam) HL.nam = HL.nam.filter(function (y) { return ttCoNam_(q, y.nam); });
    (HL.daiVan || []).forEach(function (v) { if (v.cacNam) { var n0 = v.cacNam.length; v.cacNam = v.cacNam.filter(function (y) { return ttCoNam_(q, y.nam); }); v.namKhoa = n0 - v.cacNam.length; } });
  }
  if (!q.namAll && !q.toanQuyen) CT.tieuVanNhieuNam = (CT.tieuVanNhieuNam || []).map(function (y) { return { nam: y.nam, canChi: y.canChi, tuoi: y.tuoi, cung: y.cung, diem: y.diem, danhGia: y.danhGia, khoa: !ttCoNam_(q, y.nam) }; });
  // NHẬT VẬN theo tháng
  if (!coThang) { CT.nhatVan = []; if (T) T.ngay = []; }
  tomTat.dvQuaMienPhi = q.dvQuaMienPhi || null; tomTat.hoiVien = q.hoiVien || '';
  r.vanTom = tomTat;
  return r;
}
/** r.namCd: 4 chủ đề của năm đang xem (htNamCd_ trong HoiTu.gs). Chủ đề chưa mở chỉ giữ tên + nhãn (+ 1 dòng tóm tắt nếu đã có bức tranh chung).
 *  Mỗi chủ đề có id để mua: muaPhan(token, input, 'nam_cd', '<cd>:<năm>'). */
function ttGanNamCd_(r, q) {
  var T = r.moRong && r.moRong.tongHop, H = T && T.hoSoNam, vy = r.tuvi.info.viewYear;
  var CD = null; try { CD = htNamCd_(H); } catch (e) { CD = null; }
  if (!CD) { r.namCd = null; return r; }
  var coNam = ttCoNam_(q, vy), gia = (ttBangGia_().phan.nam_cd || {}).xu;
  Object.keys(CD).forEach(function (cd) {
    var o = CD[cd], co = ttCoCd_(q, vy, cd);
    o.id = cd + ':' + vy; o.co = co; o.gia = gia;
    if (co) return;
    CD[cd] = { k: o.k, ten: o.ten, icon: o.icon, nam: o.nam, id: o.id, co: false, gia: gia, khoa: true, nhan: o.nhan, huong: o.huong,
      tom: coNam ? o.tom : '', soSuKien: o.suKien.length };
  });
  r.namCd = CD;
  return r;
}
/* ---------------- API: ví & mở khóa ---------------- */
function viCuaToi(token) {
  var u = tkCan_(token), bg = ttBangGia_();
  var shD = ttSheet_('DonHang'), daNap = ttTim_(shD, 2, u.ten).some(function (r) { return shD.getRange(r, 5).getValue() === 'DA_TRA'; });
  var out = { nguoiDung: u, toanQuyen: ttToanQuyen_(u), soDu: ttSoDu_(u.ten), bangGia: bg, soCai: [], donCho: [], thanhToan: ttCauHinh_().payos ? 'payos' : 'thucong',
    lanDau: !daNap, maGioiThieu: u.ten, soVe: ttToanQuyen_(u) ? 0 : ttSoVe_(u.ten), url: (function () { try { return ScriptApp.getService().getUrl(); } catch (e) { return ''; } })() };
  var sh = ttSheet_('SoCai');
  ttTim_(sh, 2, u.ten).slice(-15).reverse().forEach(function (r) {
    var v = sh.getRange(r, 1, 1, 6).getValues()[0];
    out.soCai.push({ luc: ttNgay_(v[0]), n: v[2], sau: v[3], lyDo: v[4] });
  });
  return out;
}
/** id: năm bắt đầu đại vận (dai_van), năm (nam, dong_hanh), 'yyyy-mm' (thang), '<cd>:<năm>' (nam_cd, cd = cv|tien|tc|sk) */
function ttMaPhan_(phan, id) {
  var P = TT_PHAN_MAC_DINH[phan];
  if (!P.theo) return phan;
  id = String(id == null ? '' : id).trim();
  if (P.theo === 'ngay') {   // chọn ngày: 'việc|yyyy-mm'
    var n = id.match(/^([a-z_]+)\|(\d{4})-(\d{1,2})$/); if (!n || +n[3] < 1 || +n[3] > 12) throw new Error('Việc hoặc tháng không hợp lệ.');
    return 'ngay:' + n[1] + ':' + n[2] + '-' + ttPad2_(+n[3]);
  }
  if (P.theo === 'nam_cd') {
    var c = id.match(/^([a-z]+)[:|](\d{4})$/);
    if (!c || TT_CHU_DE.indexOf(c[1]) < 0) throw new Error('Chủ đề năm không hợp lệ (cv, tien, tc, sk).');
    if (+c[2] < 1800 || +c[2] > 2300) throw new Error('Năm không hợp lệ.');
    return 'nam_cd:' + c[1] + ':' + c[2];
  }
  if (P.theo === 'thang') { var m = id.match(/^(\d{4})-(\d{1,2})$/); if (!m || +m[2] < 1 || +m[2] > 12) throw new Error('Tháng không hợp lệ.'); return 'thang:' + m[1] + '-' + ttPad2_(+m[2]); }
  if (!/^\d{4}$/.test(id) || +id < 1800 || +id > 2300) throw new Error('Năm không hợp lệ.');
  return (P.theo === 'dv' ? 'dv' : phan === 'dong_hanh' ? 'dong_hanh' : 'nam') + ':' + id;
}
/**
 * Mua một phần cho lá số (hoặc cặp). Trả { ok, soDu, gia } | { ok:false, thieu, gia, soDu } | { ok, daCo } | { ok, toanQuyen }.
 *  - nam_cd: id = '<cd>:<năm>' (cv, tien, tc, sk) → mã 'nam_cd:<cd>:<năm>'.
 *  - cap_doi, hop_tac, quan_he: input = { a: lá số 1, b: lá số 2 } (không phụ thuộc thứ tự);
 *    quan_he nhận thêm input = { ids: [id1, id2] } – hai người trong danh sách Gia đình của tài khoản.
 *  - Combo dong_hanh / tron_goi: trừ phần lẻ đã trả, tối đa 50% giá combo.
 */
function muaPhan(token, input, phan, id) {
  var u = tkCan_(token), bg = ttBangGia_(), p = bg.phan[phan];
  if (!p || !TT_PHAN_MAC_DINH[phan] || TT_PHAN_MAC_DINH[phan].an) throw new Error('Không có gói "' + phan + '".');
  if (TT_PHAN_MAC_DINH[phan].luot) return ttMuaGiaDinh_(u, phan, bg);
  if (phan === 'gieo_que') throw new Error('Gói này mua trực tiếp trong công cụ.');
  if (phan === 'quan_he') input = ttQuanHeInput_(u, input);
  var capDoi = phan === 'cap_doi' || phan === 'hop_tac' || phan === 'quan_he';
  if (capDoi && !(input && input.a && input.b)) throw new Error('Cần thông tin của cả hai người.');
  var khoa = capDoi ? ttKhoaCapDoi_(input.a, input.b) : ttKhoaLaSo_(input);
  var tenLS = capDoi ? String(input.a.name || '?') + ' & ' + String(input.b.name || '?') : String(input && input.name || '');
  if (ttToanQuyen_(u)) return { ok: true, toanQuyen: true };
  if (phan === 'dai_van_qua') { phan = 'dai_van'; p = bg.phan.dai_van; }
  var ma = ttMaPhan_(phan, id), dvMienPhi = null, namMa = /^nam_cd:/.test(ma) ? +ma.slice(-4) : +id;
  if (phan === 'dai_van' && +id + 9 < new Date().getFullYear()) {   // vận đã qua gần nhất: miễn phí, không bán lại (tính trước khi khóa ví)
    var tv = tuviLapLaSo_(input);
    dvMienPhi = ttDvMienPhi_(tv.palaces.map(function (c) { return tv.info.lunar.year + c.daiHan - 1; }));
  }
  return ttKhoa_(function () {
    var q = ttQuyen_(u, khoa);
    var daCo = ma === phan ? q[phan] : /^ngay:/.test(ma) ? !!q[ma] : /^dv:/.test(ma) ? ttCoDv_(q, id) : /^thang:/.test(ma) ? ttCoThang_(q, +ma.slice(6, 10), +ma.slice(11)) :
      /^nam_cd:/.test(ma) ? ttCoCd_(q, namMa, ma.split(':')[1]) : /^dong_hanh:/.test(ma) ? ttCoDh_(q, id) : ttCoNam_(q, id);
    if (!daCo && dvMienPhi !== null && dvMienPhi === +id) daCo = true;
    if (daCo) return { ok: true, daCo: true, soDu: ttSoDu_(u.ten) };
    // 16/11: không còn điều kiện "mở Tổng hợp trước" cho Người bạn đời – Tổng hợp 6 hệ đã miễn phí
    var gia = p.xu;
    if (phan === 'dai_van' && +id + 9 < new Date().getFullYear()) gia = bg.phan.dai_van_qua.xu;   // vận đã qua: giá kiểm chứng
    if (phan === 'dong_hanh' || phan === 'tron_goi') gia = ttGiaNangCap_(q, phan, id, bg).gia;   // trừ phần lẻ đã trả, tối đa 50%
    var du = ttSoDu_(u.ten);
    if (du < gia) return { ok: false, thieu: gia - du, gia: gia, soDu: du };
    var nhan = p.ten.replace(/^Năm X\b/, 'Năm ' + namMa) + (ma !== phan ? ' [' + ma + ']' : '');   // sổ cái: "Năm 2027: bức tranh chung"
    var moi = gia ? ttCong_(u.ten, -gia, 'Mở khóa: ' + nhan + ' – ' + tenLS.slice(0, 60), khoa) : du;
    ttGhiQuyen_(u.ten, gia, [new Date(), shO_(u.ten), khoa, ma, gia, shO_(tenLS.slice(0, 80)), TT_GIA_PHIEN]);
    return { ok: true, soDu: moi, gia: gia };
  });
}
/** Giá combo sau khấu trừ (dùng khi mua và để giao diện xem trước): { gia, goc, tru } – tru đã giới hạn 50%.
 *  dong_hanh (năm id): trừ bức tranh chung / vận năm cũ, 4 chủ đề, các tháng của năm đó. tron_goi: trừ đại vận lẻ, 12 đại vận cũ, biến cố, bạn đời, PDF. */
function ttGiaNangCap_(q, phan, id, bg) {
  var p = bg.phan[phan], tru = 0;
  if (phan === 'dong_hanh') { var y = String(id); tru = ttTongDaTra_(q, function (k) { return k === 'nam:' + y || (/^nam_cd:/.test(k) && k.slice(-5) === ':' + y) || k.indexOf('thang:' + y + '-') === 0; }); }
  if (phan === 'tron_goi') tru = ttTongDaTra_(q, function (k) { return TT_TRON_GOI_TRU.indexOf(k) >= 0 || /^dv:/.test(k); });
  var gia = tru ? ttGiaCombo_(p.xu, tru) : p.xu;
  if (phan === 'dong_hanh') {   // rà soát 17/11: không thu quá tổng giá lẻ của phần còn thiếu trong năm
    var yy = +id, con = (q.namMo[String(yy)] || (q.namCu || {})[String(yy)] ? 0 : bg.phan.nam.xu);
    TT_CHU_DE.forEach(function (cd) { if (!ttCoCd_(q, yy, cd)) con += bg.phan.nam_cd.xu; });
    for (var th = 1; th <= 12; th++) if (!ttCoThang_(q, yy, th)) con += bg.phan.thang.xu;
    gia = Math.min(gia, con);
  }
  return { gia: gia, goc: p.xu, tru: p.xu - gia };
}
/** quan_he: nhận { a, b } (lá số) hoặc { ids: [id1, id2] } trong danh sách Gia đình; cặp vợ chồng xem ở Cặp đôi */
function ttQuanHeInput_(u, input) {
  input = input || {};
  if (Array.isArray(input.ids)) {
    var ds = gdDoc_(u), ch = input.ids.slice(0, 2).map(function (i) { return ds.filter(function (x) { return x.id === i; })[0]; });
    if (ch.length < 2 || !ch[0] || !ch[1] || ch[0] === ch[1]) throw new Error('Chọn hai người trong danh sách Gia đình.');
    if (gdLoaiCap_(ch[0].quanHe, ch[1].quanHe).loai === 'vc') throw new Error('Cặp vợ chồng xem ở phần "Hai bạn hợp nhau đến đâu" (Cặp đôi).');
    return { a: ch[0].input, b: ch[1].input };
  }
  return input;
}

/* ---------------- Gói gia đình: lượt mở dùng cho nhiều lá số ---------------- */
function ttSoVe_(ten) {
  var sh = ttSheet_('Ve'), r = ttTim_(sh, 1, ten);
  return r.length ? Number(sh.getRange(r[0], 2).getValue()) || 0 : 0;
}
function ttCongVe_(ten, n) {
  var sh = ttSheet_('Ve'), r = ttTim_(sh, 1, ten), moi = ttSoVe_(ten) + n;
  if (moi < 0) throw new Error('Bạn đã dùng hết lượt gia đình.');
  if (r.length) sh.getRange(r[0], 2, 1, 2).setValues([[moi, new Date()]]); else sh.appendRow([shO_(ten), moi, new Date()]);
  return moi;
}
/** Ghi dòng quyền vào MoKhoa; ghi lỗi thì hoàn lại xu vừa trừ rồi báo lỗi (rà soát Đợt 3 B6) */
function ttGhiQuyen_(ten, gia, dong) {
  try {
    var sh = ttSheet_('MoKhoa');
    if (dong.length >= 7 && sh.getRange(1, 7).getValue() === '') sh.getRange(1, 7).setValue(TT_SH.MoKhoa[6]);   // trang tính cũ (6 cột): thêm tiêu đề cột Phiên giá
    sh.appendRow(dong);
  }
  catch (e) { if (gia) ttCong_(ten, gia, 'Hoàn xu do lỗi ghi quyền', 'HOAN'); throw new Error('Chưa ghi được quyền mở khóa, xu đã được hoàn lại. Vui lòng thử lại sau ít phút.'); }
}
/** (Gói cũ – 16/11 thôi bán, muaPhan từ chối 'hoi_vien'; giữ hàm để chủ dự án bật lại nếu cần.) Hội viên năm: cộng 12 tháng lịch từ hạn hiện tại (hoặc hôm nay) – mở vận năm/tháng/nhật vận cho mọi lá số của tài khoản */
function ttMuaHoiVien_(u, p) {
  if (ttToanQuyen_(u)) return { ok: true, toanQuyen: true };
  return ttKhoa_(function () {
    var du = ttSoDu_(u.ten);
    if (du < p.xu) return { ok: false, thieu: p.xu - du, gia: p.xu, soDu: du };
    var cu = ttHoiVien_(u.ten), goc = cu ? new Date(cu + 'T00:00:00') : new Date();
    goc.setFullYear(goc.getFullYear() + 1);   // đúng 12 tháng lịch (kể cả năm nhuận)
    var han = Utilities.formatDate(goc, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
    var moi = ttCong_(u.ten, -p.xu, 'Mua ' + p.ten + ' (đến ' + han + ')', 'TK:' + u.ten);
    ttGhiQuyen_(u.ten, p.xu, [new Date(), shO_(u.ten), 'TK:' + u.ten, 'hoi_vien:' + han, p.xu, 'Hội viên năm', TT_GIA_PHIEN]);
    return { ok: true, soDu: moi, gia: p.xu, hoiVien: han };
  });
}
function ttMuaGiaDinh_(u, phan, bg) {
  if (ttToanQuyen_(u)) return { ok: true, toanQuyen: true };
  var p = bg.phan[phan], luot = TT_PHAN_MAC_DINH[phan].luot;
  return ttKhoa_(function () {
    var du = ttSoDu_(u.ten);
    if (du < p.xu) return { ok: false, thieu: p.xu - du, gia: p.xu, soDu: du };
    var moi = ttCong_(u.ten, -p.xu, 'Mua ' + p.ten + ' (' + luot + ' lượt mở)', phan);
    return { ok: true, soDu: moi, gia: p.xu, soVe: ttCongVe_(u.ten, luot), luot: luot };
  });
}
/** Dùng 1 lượt gia đình cho lá số đang xem: mở Đồng hành cả năm đang xem (vận năm + 12 tháng) – 16/11 */
function dungLuotGiaDinh(token, input) {
  var u = tkCan_(token);
  if (ttToanQuyen_(u)) return { ok: true, toanQuyen: true };
  var khoa = ttKhoaLaSo_(input), vy = +(input && input.viewYear) || new Date().getFullYear(), ten = String(input && input.name || '').slice(0, 80);
  return ttKhoa_(function () {
    var q = ttQuyen_(u, khoa);
    if (ttCoDh_(q, vy)) return { ok: true, daCo: true, soVe: ttSoVe_(u.ten) };
    var ve = ttCongVe_(u.ten, -1);
    ttSheet_('MoKhoa').appendRow([new Date(), shO_(u.ten), khoa, 'dong_hanh:' + vy, 0, shO_(ten + ' (lượt gia đình)'), TT_GIA_PHIEN]);
    return { ok: true, soVe: ve };
  });
}
/** Tài khoản đã mua phần `phan` cho khóa `khoa` chưa (tra nhanh MoKhoa – dùng cho quan_he theo từng cặp) */
function ttCoPhanKhoa_(ten, khoa, phan) {
  var sh = ttSheet_('MoKhoa');
  return ttTim_(sh, 3, khoa).some(function (r) { var v = sh.getRange(r, 2, 1, 3).getValues()[0]; return String(v[0]) === ten && String(v[2]) === phan; });
}
/** Kiểm tra quyền một phần cho lá số (dùng cho dò giờ sinh…) */
function ttCanPhan_(token, input, phan) {
  var u = tkCan_(token);
  if (ttToanQuyen_(u)) return u;
  if (!ttQuyen_(u, ttKhoaLaSo_(input))[phan]) throw new Error('Chức năng này cần mở khóa "' + ttBangGia_().phan[phan].ten + '" cho lá số hiện tại.');
  return u;
}

/* ---------------- Đơn nạp xu ---------------- */
function taoDonNap(token, iGoi) {
  var u = tkCan_(token), g = ttBangGia_().goi[+iGoi], cfg = ttCauHinh_();
  if (!g) throw new Error('Gói nạp không hợp lệ.');
  var dem = CacheService.getScriptCache(), k = 'DON_' + u.ten, n = parseInt(dem.get(k) || '0', 10);
  if (n >= 8) throw new Error('Bạn tạo quá nhiều đơn trong thời gian ngắn – thử lại sau ít phút.');
  dem.put(k, String(n + 1), 600);
  var ma = Number(String(Date.now()).slice(-8) + String(Math.floor(Math.random() * 90) + 10));
  var noiDung = 'TCC' + String(ma).slice(-6);
  var don = { ma: ma, tien: g.tien, xu: g.xu, noiDung: noiDung, kenh: cfg.payos ? 'payos' : 'thucong' };
  if (cfg.payos) {
    var d = ttPayosTao_(cfg, ma, g.tien, noiDung);
    don.checkoutUrl = d.checkoutUrl; don.bin = d.bin; don.stk = d.accountNumber; don.chuTK = d.accountName; don.noiDung = d.description || noiDung;
  } else {
    if (!cfg.nganHang.stk || !cfg.nganHang.bin) throw new Error('Chủ sở hữu chưa cài đặt tài khoản nhận tiền. Vui lòng liên hệ để nạp xu.');
    don.bin = cfg.nganHang.bin; don.stk = cfg.nganHang.stk; don.chuTK = cfg.nganHang.chuTK || ''; don.tenNH = cfg.nganHang.tenNH || '';
  }
  ttSheet_('DonHang').appendRow([ma, shO_(u.ten), g.tien, g.xu, 'CHO', new Date(), '', don.kenh, don.checkoutUrl || '', don.noiDung]);
  don.qrAnh = 'https://img.vietqr.io/image/' + encodeURIComponent(don.bin) + '-' + encodeURIComponent(don.stk) + '-compact2.png?amount=' + g.tien +
    '&addInfo=' + encodeURIComponent(don.noiDung) + '&accountName=' + encodeURIComponent(don.chuTK || '');
  return don;
}
function ttDon_(ma) {
  var sh = ttSheet_('DonHang'), r = ttTim_(sh, 1, ma);
  if (!r.length) return null;
  var v = sh.getRange(r[0], 1, 1, 10).getValues()[0];
  return { row: r[0], ma: v[0], tk: String(v[1]), tien: Number(v[2]), xu: Number(v[3]), trangThai: String(v[4]), tao: v[5], tra: v[6], kenh: String(v[7]), thamChieu: v[8], noiDung: v[9] };
}
function kiemTraDon(token, ma) {
  var u = tkCan_(token), d = ttDon_(ma);
  if (!d || (d.tk !== u.ten && u.vaiTro !== 'chu')) throw new Error('Không tìm thấy đơn.');
  if (d.trangThai === 'CHO' && d.kenh === 'payos') { try { ttDoiSoatPayos_(d); } catch (e) { /* thử lại lần sau */ } d = ttDon_(ma); }
  return { trangThai: d.trangThai, ten: TT_TRANG_THAI[d.trangThai] || d.trangThai, soDu: ttSoDu_(u.ten) };
}
function ttGhiNhanDon_(ma, nguon, thamChieu) {
  return ttKhoa_(function () {
    var d = ttDon_(ma);
    if (!d || d.trangThai === 'DA_TRA') return false;
    var sh = ttSheet_('DonHang');
    sh.getRange(d.row, 5).setValue('DA_TRA');
    sh.getRange(d.row, 7).setValue(new Date());
    if (thamChieu) sh.getRange(d.row, 9).setValue(thamChieu);
    var lanDau = !ttTim_(sh, 2, d.tk).some(function (r) { return r !== d.row && sh.getRange(r, 5).getValue() === 'DA_TRA'; });
    ttCong_(d.tk, d.xu, 'Nạp ' + d.tien + 'đ (' + nguon + ')', 'DON' + ma);
    if (lanDau) {
      var bg = ttBangGia_(), o = tkDoc_(d.tk) || {};
      var th = Math.round(d.xu * bg.thuongLanDau / 100);
      if (th > 0) ttCong_(d.tk, th, 'Thưởng nạp lần đầu +' + bg.thuongLanDau + '%', 'DON' + ma);
      if (o.gioiThieu && tkDoc_(o.gioiThieu)) {
        var tg = Math.round(d.xu * bg.thuongGioiThieu / 100);
        if (tg > 0) ttCong_(o.gioiThieu, tg, 'Thưởng giới thiệu ' + d.tk + ' (+' + bg.thuongGioiThieu + '% lần nạp đầu)', 'DON' + ma);
      }
    }
    return true;
  });
}
function ttDatTrangThai_(ma, tt) {
  var d = ttDon_(ma);
  if (d && d.trangThai === 'CHO') ttSheet_('DonHang').getRange(d.row, 5).setValue(tt);
}

/* ---------------- payOS ---------------- */
function ttPayosKy_(obj, key) {
  var s = Object.keys(obj).sort().map(function (k) { return k + '=' + obj[k]; }).join('&');
  return tkHex_(Utilities.computeHmacSha256Signature(s, key, Utilities.Charset.UTF_8));
}
function ttPayosGoi_(cfg, method, path, body) {
  var res = UrlFetchApp.fetch('https://api-merchant.payos.vn' + path, {
    method: method, contentType: 'application/json', muteHttpExceptions: true,
    headers: { 'x-client-id': cfg.clientId, 'x-api-key': cfg.apiKey },
    payload: body ? JSON.stringify(body) : undefined
  });
  var j = {};
  try { j = JSON.parse(res.getContentText() || '{}'); } catch (e) { j = { desc: 'HTTP ' + res.getResponseCode() }; }
  return j;
}
function ttPayosTao_(cfg, ma, tien, moTa) {
  var url = cfg.traVe || (typeof ScriptApp !== 'undefined' && ScriptApp.getService().getUrl()) || 'https://payos.vn';
  var body = { orderCode: ma, amount: tien, description: moTa, cancelUrl: url, returnUrl: url, expiredAt: Math.floor(Date.now() / 1000) + 1800 };
  body.signature = ttPayosKy_({ amount: tien, cancelUrl: url, description: moTa, orderCode: ma, returnUrl: url }, cfg.checksum);
  var j = ttPayosGoi_(cfg, 'post', '/v2/payment-requests', body);
  if (j.code !== '00' || !j.data) throw new Error('payOS chưa tạo được đơn: ' + (j.desc || 'không rõ lỗi') + '. Hãy thử lại hoặc báo chủ sở hữu.');
  return j.data;
}
function ttDoiSoatPayos_(d) {
  var cfg = ttCauHinh_();
  if (!cfg.payos) return;
  var j = ttPayosGoi_(cfg, 'get', '/v2/payment-requests/' + d.ma);
  if (j.code !== '00' || !j.data) return;
  var info = j.data;
  if (info.status === 'PAID' && Number(info.amountPaid != null ? info.amountPaid : info.amount) >= d.tien) {
    var tx = (info.transactions || [])[0];
    ttGhiNhanDon_(d.ma, 'payOS', tx && tx.reference || '');
  } else if (info.status === 'CANCELLED') ttDatTrangThai_(d.ma, 'HUY');
  else if (info.status === 'EXPIRED') ttDatTrangThai_(d.ma, 'HET_HAN');
}
/** Trigger mỗi 5 phút: đối soát các đơn payOS đang chờ trong 48 giờ gần nhất */
function ttQuetDonTuDong() {
  chiChayNoiBo_(arguments[0]);
  if (!ttCauHinh_().payos) return;
  var sh = ttSheet_('DonHang'), last = sh.getLastRow();
  if (last < 2) return;
  var n = Math.min(300, last - 1), v = sh.getRange(last - n + 1, 1, n, 10).getValues(), han = Date.now() - 48 * 3600e3;
  v.forEach(function (x) {
    if (x[4] === 'CHO' && x[7] === 'payos' && new Date(x[5]).getTime() > han) {
      try { ttDoiSoatPayos_(ttDon_(x[0])); } catch (e) { /* bỏ qua, lần sau */ }
    }
  });
}
function ttCaiTrigger_() {
  var co = ScriptApp.getProjectTriggers().some(function (t) { return t.getHandlerFunction() === 'ttQuetDonTuDong'; });
  if (!co) ScriptApp.newTrigger('ttQuetDonTuDong').timeBased().everyMinutes(5).create();
}

/* ---------------- Quản trị (chủ sở hữu) ---------------- */
function ttNgay_(d) { return d instanceof Date ? Utilities.formatDate(d, 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy HH:mm') : String(d || ''); }
function qtTongQuan(token) {
  tkCan_(token, true);
  var cfg = ttCauHinh_(), sh = ttSheet_('DonHang'), last = sh.getLastRow(), don = [], dt = { homNay: 0, thangNay: 0, tong: 0, soDon: 0, choXuLy: 0 };
  var bayGio = new Date(), ngay = Utilities.formatDate(bayGio, 'Asia/Ho_Chi_Minh', 'yyyyMMdd'), thang = ngay.slice(0, 6);
  if (last >= 2) {
    sh.getRange(2, 1, last - 1, 10).getValues().forEach(function (v) {
      if (v[4] === 'CHO') dt.choXuLy++;
      if (v[4] !== 'DA_TRA') return;
      var t = v[6] instanceof Date ? Utilities.formatDate(v[6], 'Asia/Ho_Chi_Minh', 'yyyyMMdd') : '';
      dt.tong += Number(v[2]) || 0; dt.soDon++;
      if (t === ngay) dt.homNay += Number(v[2]) || 0;
      if (t.slice(0, 6) === thang) dt.thangNay += Number(v[2]) || 0;
    });
    var n = Math.min(60, last - 1);
    sh.getRange(last - n + 1, 1, n, 10).getValues().reverse().forEach(function (v) {
      don.push({ ma: v[0], tk: v[1], tien: v[2], xu: v[3], trangThai: v[4], ten: TT_TRANG_THAI[v[4]] || v[4], tao: ttNgay_(v[5]), tra: ttNgay_(v[6]), kenh: v[7], noiDung: v[9] });
    });
  }
  var tk = dsTaiKhoan(token).map(function (a) { a.soDu = ttSoDu_(a.ten); return a; });
  return {
    bangGia: ttBangGia_(), doanhThu: dt, don: don, taiKhoan: tk,
    cauHinh: { payos: cfg.payos, clientId: cfg.clientId ? cfg.clientId.slice(0, 6) + '…' : '', coApiKey: !!cfg.apiKey, coChecksum: !!cfg.checksum, nganHang: cfg.nganHang, traVe: cfg.traVe || '' }
  };
}
function qtLuuBangGia(token, bg) {
  tkCan_(token, true);
  var phan = {}, goi = [];
  var cu0 = ttBangGia_();
  Object.keys(TT_PHAN_MAC_DINH).forEach(function (k) { var v = Math.round(Number(bg && bg.phan && bg.phan[k])); phan[k] = v >= 0 && v < 100000 ? v : cu0.phan[k].xu; });
  (bg && bg.goi || []).forEach(function (g) { var t = Math.round(Number(g.tien)), x = Math.round(Number(g.xu)); if (t >= 2000 && x > 0) goi.push({ tien: t, xu: x }); });
  if (!goi.length) throw new Error('Cần ít nhất một gói nạp (số tiền ≥ 2.000đ).');
  var cu = ttBangGia_();
  function pct(v, mac, tran) { return v == null || v === '' || isNaN(+v) ? mac : Math.max(0, Math.min(tran, Math.round(+v))); }
  PropertiesService.getScriptProperties().setProperty('TT_BANG_GIA', JSON.stringify({ phien: TT_GIA_PHIEN, kmPhien: TT_KM_PHIEN, phan: phan, goi: goi,
    thuongLanDau: pct(bg && bg.thuongLanDau, cu.thuongLanDau, 500), thuongGioiThieu: pct(bg && bg.thuongGioiThieu, cu.thuongGioiThieu, 100),
    thuongDangKy: pct(bg && bg.thuongDangKy, cu.thuongDangKy, 200), thuongGTDangKy: pct(bg && bg.thuongGTDangKy, cu.thuongGTDangKy, 100) }));
  return ttBangGia_();
}
function qtLuuCauHinh(token, moi) {
  tkCan_(token, true);
  var c = ttCauHinh_();
  moi = moi || {};
  ['clientId', 'apiKey', 'checksum'].forEach(function (k) { if (moi[k] === '-') c[k] = ''; else if (moi[k]) c[k] = String(moi[k]).trim(); });
  if (moi.nganHang) c.nganHang = { bin: String(moi.nganHang.bin || '').trim(), stk: String(moi.nganHang.stk || '').trim(), chuTK: String(moi.nganHang.chuTK || '').trim().toUpperCase(), tenNH: String(moi.nganHang.tenNH || '').trim() };
  if (moi.traVe != null) c.traVe = String(moi.traVe).trim();
  delete c.payos;
  PropertiesService.getScriptProperties().setProperty('TT_CAU_HINH', JSON.stringify(c));
  var trig = '';
  if (c.clientId && c.apiKey && c.checksum) { try { ttCaiTrigger_(); trig = 'đã bật đối soát tự động mỗi 5 phút'; } catch (e) { trig = 'chưa cài được trigger: ' + e.message; } }
  return { ok: true, trigger: trig };
}
function qtKiemTraPayos(token) {
  tkCan_(token, true);
  var cfg = ttCauHinh_();
  if (!cfg.payos) return { ok: false, thongBao: 'Chưa nhập đủ Client ID, API Key, Checksum Key.' };
  var j = ttPayosGoi_(cfg, 'get', '/v2/payment-requests/1');
  var sai = /client|api key|unauthor|xác thực|không hợp lệ/i.test(String(j.desc || ''));
  return { ok: !sai, thongBao: 'payOS phản hồi: ' + (j.code || '') + ' – ' + (j.desc || '(không có mô tả)') + (sai ? ' → kiểm tra lại khóa.' : ' → kết nối được (đơn thử #1 không tồn tại là bình thường).') };
}
function qtXacNhanDon(token, ma) { tkCan_(token, true); if (!ttGhiNhanDon_(ma, 'xác nhận thủ công', 'thủ công')) throw new Error('Đơn không ở trạng thái chờ.'); return qtTongQuan(token); }
function qtHuyDon(token, ma) { tkCan_(token, true); ttDatTrangThai_(ma, 'HUY'); return qtTongQuan(token); }
function qtDieuChinhXu(token, user, n, lyDo) {
  var me = tkCan_(token, true), u = tkTen_(user);
  n = Math.round(Number(n));
  if (!n) throw new Error('Nhập số xu khác 0 (âm để trừ).');
  if (!tkDoc_(u)) throw new Error('Không tìm thấy tài khoản.');
  ttKhoa_(function () { ttCong_(u, n, (n > 0 ? 'Tặng/điều chỉnh: ' : 'Trừ/hoàn: ') + String(lyDo || '').slice(0, 80) + ' (bởi ' + me.ten + ')', 'ADMIN'); });
  return qtTongQuan(token);
}

/** Chạy MỘT LẦN trong trình soạn thảo Apps Script (sau khi dán mã) để cấp quyền gọi payOS, cài trigger và tạo các trang tính */
function capQuyenThanhToan() {
  chiChayNoiBo_(arguments[0]);
  ['Vi', 'SoCai', 'MoKhoa', 'DonHang', 'Ve'].forEach(ttSheet_);
  ScriptApp.getProjectTriggers();
  try { UrlFetchApp.fetch('https://api-merchant.payos.vn', { muteHttpExceptions: true }); } catch (e) { /* chỉ để xin quyền */ }
  LockService.getScriptLock();
  Logger.log('✔ Đã cấp quyền và tạo các trang tính Vi, SoCai, MoKhoa, DonHang, Ve.');
}

/* ---------------- Mã quà tặng (khuyến mãi) ---------------- */
function qtTaoMaQua(token, ma, xu, soLuot, hetHan) {
  tkCan_(token, true);
  ma = String(ma || '').trim().toUpperCase();
  if (!/^[A-Z0-9_-]{4,24}$/.test(ma)) throw new Error('Mã 4–24 ký tự: chữ không dấu, số, gạch.');
  xu = Math.round(+xu); soLuot = Math.round(+soLuot) || 1;
  if (!(xu > 0 && xu <= 10000)) throw new Error('Số xu tặng từ 1 đến 10.000.');
  var cu = PropertiesService.getScriptProperties().getProperty('QT_' + ma), o = cu ? JSON.parse(cu) : { daDung: [] };
  o.xu = xu; o.soLuot = soLuot; o.hetHan = hetHan ? String(hetHan).slice(0, 10) : ''; o.taoLuc = o.taoLuc || new Date().toISOString();
  PropertiesService.getScriptProperties().setProperty('QT_' + ma, JSON.stringify(o));
  return qtDsMaQua(token);
}
function qtDsMaQua(token) {
  tkCan_(token, true);
  var p = PropertiesService.getScriptProperties().getProperties(), out = [];
  Object.keys(p).forEach(function (k) {
    if (k.indexOf('QT_') !== 0) return;
    var o = JSON.parse(p[k]);
    out.push({ ma: k.slice(3), xu: o.xu, soLuot: o.soLuot, daDung: (o.daDung || []).length, hetHan: o.hetHan || '', taoLuc: o.taoLuc || '' });
  });
  return out.sort(function (a, b) { return String(b.taoLuc).localeCompare(String(a.taoLuc)); });
}
function qtXoaMaQua(token, ma) { tkCan_(token, true); PropertiesService.getScriptProperties().deleteProperty('QT_' + String(ma).toUpperCase()); return qtDsMaQua(token); }
function nhapMaQua(token, ma) {
  var u = tkCan_(token), c = CacheService.getScriptCache(), k = 'MQ_' + u.ten, n = parseInt(c.get(k) || '0', 10);
  if (n >= 10) throw new Error('Bạn nhập sai mã quá nhiều lần – thử lại sau 15 phút.');
  ma = String(ma || '').trim().toUpperCase();
  return ttKhoa_(function () {
    var props = PropertiesService.getScriptProperties(), v = props.getProperty('QT_' + ma);
    if (!v) { c.put(k, String(n + 1), 900); throw new Error('Mã quà tặng không đúng.'); }
    var o = JSON.parse(v), hom = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
    o.daDung = o.daDung || [];
    if (o.hetHan && hom > o.hetHan) throw new Error('Mã đã hết hạn.');
    if (o.daDung.indexOf(u.ten) >= 0) throw new Error('Bạn đã dùng mã này rồi.');
    if (o.daDung.length >= o.soLuot) throw new Error('Mã đã hết lượt sử dụng.');
    o.daDung.push(u.ten);
    props.setProperty('QT_' + ma, JSON.stringify(o));
    var moi = ttCong_(u.ten, o.xu, 'Mã quà tặng ' + ma, 'MA' + ma);
    return { ok: true, xu: o.xu, soDu: moi };
  });
}

/* ===================================================================
 *  BÁO CÁO NGÀY CHO CHỦ SỞ HỮU (email 7 giờ sáng mỗi ngày)
 *  Chủ sở hữu chạy caiDatBaoCaoNgay() MỘT LẦN trong trình soạn thảo Apps Script.
 *  Người nhận: Thuộc tính tập lệnh BAO_CAO_EMAIL (Cài đặt dự án → Thuộc tính tập lệnh);
 *  không đặt thì gửi về chính tài khoản Google đang chạy dự án.
 * =================================================================== */
function bcNguoiNhan_() {
  var e = '';
  try { e = PropertiesService.getScriptProperties().getProperty('BAO_CAO_EMAIL') || ''; } catch (x) { e = ''; }
  if (!e) { try { e = Session.getEffectiveUser().getEmail(); } catch (x) { e = ''; } }
  return String(e || '').trim();
}
function bcSo_(n) { return String(Math.round(n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
function bcDong_(ten, ncol) {
  var sh = null; try { sh = laySS_().getSheetByName(ten); } catch (e) { sh = null; }
  if (!sh || sh.getLastRow() < 2) return [];
  return sh.getRange(2, 1, sh.getLastRow() - 1, ncol).getValues();
}
function bcNgay_(v) { return v instanceof Date ? v : v ? new Date(v) : null; }
function bcTrong_(v, tu, den) { var d = bcNgay_(v); return !!(d && !isNaN(d) && d >= tu && d < den); }

/** Số liệu kinh doanh trong khoảng [tu, den) và tổng quan 7/30 ngày */
function bcSoLieu_(den) {
  den = den || new Date();
  var tu = new Date(den.getTime() - 864e5), tu7 = new Date(den.getTime() - 7 * 864e5), tu30 = new Date(den.getTime() - 30 * 864e5);
  var bg = ttBangGia_(), out = { tu: tu, den: den };
  // Tài khoản
  var tk = [], p = tkProps_().getProperties();
  Object.keys(p).forEach(function (k) { if (k.indexOf('TK_') !== 0) return; try { var o = JSON.parse(p[k]); tk.push({ ten: k.slice(3), o: o }); } catch (e) {} });
  out.tongTK = tk.length;
  out.tkMoi = tk.filter(function (x) { return bcTrong_(x.o.taoLuc, tu, den); }).map(function (x) { return { ten: x.ten, hienThi: x.o.hienThi || x.ten, lienHe: x.o.lienHe || '', gioiThieu: x.o.gioiThieu || '' }; });
  out.tkMoi7 = tk.filter(function (x) { return bcTrong_(x.o.taoLuc, tu7, den); }).length;
  out.tkHoatDong = tk.filter(function (x) { return bcTrong_(x.o.lanCuoi, tu, den); }).length;
  // Đơn nạp: [Mã, Tài khoản, Tiền, Xu, Trạng thái, Tạo lúc, Trả lúc, Kênh, ...]
  var don = bcDong_('DonHang', 8);
  function tra(a, b) { return don.filter(function (r) { return r[4] === 'DA_TRA' && bcTrong_(r[6] || r[5], a, b); }); }
  var d1 = tra(tu, den), d7 = tra(tu7, den), d30 = tra(tu30, den);
  function tong(ds, c) { return ds.reduce(function (s, r) { return s + (+r[c] || 0); }, 0); }
  out.don = { n: d1.length, tien: tong(d1, 2), xu: tong(d1, 3), ds: d1.slice(0, 15).map(function (r) { return { ma: r[0], tk: r[1], tien: +r[2] || 0, kenh: r[7] || '' }; }) };
  out.don7 = { n: d7.length, tien: tong(d7, 2) }; out.don30 = { n: d30.length, tien: tong(d30, 2) };
  out.donCho = don.filter(function (r) { return r[4] === 'CHO' && bcTrong_(r[5], tu, den); }).length;
  out.donChoLau = don.filter(function (r) { return r[4] === 'CHO' && bcNgay_(r[5]) && bcNgay_(r[5]) < tu && bcNgay_(r[5]) >= tu7; }).length;
  // Phần đã mở: [Thời gian, Tài khoản, Khóa lá số, Phần, Xu, Lá số]
  var mk = bcDong_('MoKhoa', 6).filter(function (r) { return bcTrong_(r[0], tu, den); }), nhom = {};
  mk.forEach(function (r) { var k = String(r[3]).split(':')[0], g = nhom[k] = nhom[k] || { k: k, ten: String((bg.phan[k] && bg.phan[k].ten) || k).replace(/^Năm X\b/, 'Năm'), n: 0, xu: 0 }; g.n++; g.xu += +r[4] || 0; });
  out.moKhoa = Object.keys(nhom).map(function (k) { return nhom[k]; }).sort(function (a, b) { return b.xu - a.xu || b.n - a.n; });
  // Sổ cái xu: [Thời gian, Tài khoản, Thay đổi, Số dư sau, Lý do, Tham chiếu]
  var sc = bcDong_('SoCai', 5).filter(function (r) { return bcTrong_(r[0], tu, den); });
  out.xuTieu = -sc.filter(function (r) { return +r[2] < 0; }).reduce(function (s, r) { return s + (+r[2] || 0); }, 0);
  out.xuTang = sc.filter(function (r) { return +r[2] > 0 && /quà|thưởng|tặng|giới thiệu|mời/i.test(String(r[4])); }).reduce(function (s, r) { return s + (+r[2] || 0); }, 0);
  // Lá số lập, gieo quẻ, bản tin
  out.laSo = bcDong_(typeof SHEET_NAME !== 'undefined' ? SHEET_NAME : 'LaSo', 1).filter(function (r) { return bcTrong_(r[0], tu, den); }).length;
  out.gieoQue = bcDong_('GieoQue', 1).filter(function (r) { return bcTrong_(r[0], tu, den); }).length;
  out.banTin = bcDong_('BanTin', 5).filter(function (r) { return bcTrong_(r[4], tu, den); }).length;
  // Tình trạng hệ thống
  out.loiCaiDat = [];
  try { if (typeof kiemTraCaiDat_ === 'function') out.loiCaiDat = kiemTraCaiDat_().map(function (x) { return String(x).replace(/<[^>]+>/g, ''); }); } catch (e) { out.loiCaiDat = ['Không chạy được kiểm tra cài đặt: ' + (e && e.message)]; }
  try { out.coQuetDon = ScriptApp.getProjectTriggers().some(function (t) { return t.getHandlerFunction() === 'ttQuetDonTuDong'; }); } catch (e) { out.coQuetDon = null; }
  out.coPayos = !!(ttCauHinh_() || {}).payos;
  return out;
}

function bcHtml_(S) {
  function o(nhan, gt, phu) { return '<td style="padding:10px 12px;border:1px solid #e3e8ee;border-radius:8px;vertical-align:top"><div style="font-size:12px;color:#667">' + nhan + '</div><div style="font-size:22px;font-weight:700;color:#0b4a5c">' + gt + '</div>' + (phu ? '<div style="font-size:12px;color:#889">' + phu + '</div>' : '') + '</td>'; }
  function ngay(d) { return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear(); }
  var h = '<div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#1d2733">' +
    '<h2 style="color:#0b4a5c;margin-bottom:4px">Thiên Cơ Các · Báo cáo ngày ' + ngay(S.den) + '</h2><p style="color:#667;margin-top:0">Số liệu 24 giờ qua (từ ' + S.tu.getHours() + 'h ' + ngay(S.tu) + ').</p>' +
    '<table style="border-collapse:separate;border-spacing:6px;width:100%"><tr>' +
    o('Doanh thu', bcSo_(S.don.tien) + ' đ', S.don.n + ' đơn đã thanh toán') + o('Tài khoản mới', S.tkMoi.length, S.tkHoatDong + ' người đăng nhập') + o('Lá số lập', S.laSo, S.gieoQue + ' lượt gieo quẻ') + '</tr><tr>' +
    o('Xu khách đã dùng', bcSo_(S.xuTieu), 'xu tặng: ' + bcSo_(S.xuTang)) + o('7 ngày', bcSo_(S.don7.tien) + ' đ', S.don7.n + ' đơn · ' + S.tkMoi7 + ' tài khoản mới') + o('30 ngày', bcSo_(S.don30.tien) + ' đ', S.don30.n + ' đơn · tổng ' + S.tongTK + ' tài khoản') + '</tr></table>';
  if (S.moKhoa.length) h += '<h3>Phần khách đã mở</h3><table style="border-collapse:collapse;width:100%;font-size:14px">' + S.moKhoa.map(function (g) {
    return '<tr><td style="padding:4px 6px;border-bottom:1px solid #eee">' + g.ten + '</td><td style="padding:4px 6px;border-bottom:1px solid #eee;text-align:right">' + g.n + ' lượt</td><td style="padding:4px 6px;border-bottom:1px solid #eee;text-align:right">' + bcSo_(g.xu) + ' xu</td></tr>'; }).join('') + '</table>';
  else h += '<h3>Phần khách đã mở</h3><p>Chưa có lượt mở nào trong 24 giờ qua.</p>';
  if (S.don.ds.length) h += '<h3>Đơn nạp đã thanh toán</h3><ul>' + S.don.ds.map(function (d) { return '<li>' + d.tk + ' – ' + bcSo_(d.tien) + ' đ (' + (d.kenh || '') + ', mã ' + d.ma + ')</li>'; }).join('') + '</ul>';
  if (S.tkMoi.length) h += '<h3>Tài khoản mới</h3><ul>' + S.tkMoi.slice(0, 20).map(function (u) { return '<li>' + u.hienThi + ' (' + u.ten + ')' + (u.lienHe ? ' – ' + u.lienHe : '') + (u.gioiThieu ? ' · được ' + u.gioiThieu + ' giới thiệu' : '') + '</li>'; }).join('') + '</ul>';
  var canLam = [];
  if (S.loiCaiDat.length) canLam.push('Cài đặt có ' + S.loiCaiDat.length + ' lỗi: ' + S.loiCaiDat.join(' | '));
  if (S.donCho) canLam.push(S.donCho + ' đơn nạp đang chờ thanh toán trong 24 giờ qua' + (S.coPayos ? ' (payOS tự xác nhận khi khách chuyển khoản).' : ' – kiểm tra tài khoản ngân hàng rồi xác nhận trong Quản trị.'));
  if (S.donChoLau) canLam.push(S.donChoLau + ' đơn chờ quá 1 ngày – nên kiểm tra hoặc hủy trong Quản trị.');
  if (S.coPayos && S.coQuetDon === false) canLam.push('Chưa bật quét đơn tự động – vào Quản trị bấm lưu cấu hình payOS để bật lại.');
  if (!S.don7.n) canLam.push('7 ngày qua chưa có đơn nạp nào – có thể thử chương trình ưu đãi hoặc chia sẻ link mời.');
  h += '<h3>Cần chú ý</h3>' + (canLam.length ? '<ul>' + canLam.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' : '<p>✔ Mọi thứ bình thường: cài đặt đúng, không có đơn treo.</p>');
  h += '<p style="color:#889;font-size:12px">Email tự động gửi lúc 7 giờ sáng mỗi ngày. Muốn tắt: mở trình soạn thảo Apps Script, chọn hàm tatBaoCaoNgay rồi bấm Chạy.</p></div>';
  return h;
}

/** Gửi báo cáo (trigger hằng ngày gọi; chủ sở hữu cũng chạy tay được để xem thử) */
function guiBaoCaoNgay() {
  chiChayNoiBo_(arguments[0]);
  var to = bcNguoiNhan_();
  if (!to) throw new Error('Chưa có email nhận báo cáo: thêm Thuộc tính tập lệnh BAO_CAO_EMAIL.');
  var S = bcSoLieu_(new Date());
  MailApp.sendEmail({ to: to, subject: 'Thiên Cơ Các · ' + S.den.getDate() + '/' + (S.den.getMonth() + 1) + ': ' + bcSo_(S.don.tien) + ' đ · ' + S.tkMoi.length + ' tài khoản mới · ' + S.laSo + ' lá số' + (S.loiCaiDat.length ? ' · ⚠ lỗi cài đặt' : ''), htmlBody: bcHtml_(S) });
  return { to: to };   // không trả số liệu (doanh thu, liên hệ khách) – rà soát 16/11
}
/** Chủ sở hữu chạy 1 lần: bật gửi báo cáo 7 giờ sáng mỗi ngày và gửi ngay một bản thử */
function caiDatBaoCaoNgay() {
  chiChayNoiBo_(arguments[0]);
  ScriptApp.getProjectTriggers().forEach(function (tr) { if (tr.getHandlerFunction() === 'guiBaoCaoNgay') ScriptApp.deleteTrigger(tr); });
  ScriptApp.newTrigger('guiBaoCaoNgay').timeBased().everyDays(1).atHour(7).create();
  var r = guiBaoCaoNgay();
  Logger.log('✔ Đã bật báo cáo ngày lúc 7 giờ sáng, gửi tới ' + r.to + '. Vừa gửi một bản thử – hãy kiểm tra hộp thư (cả mục Thư rác/Quảng cáo).');
}
function tatBaoCaoNgay() {
  chiChayNoiBo_(arguments[0]);
  var n = 0; ScriptApp.getProjectTriggers().forEach(function (tr) { if (tr.getHandlerFunction() === 'guiBaoCaoNgay') { ScriptApp.deleteTrigger(tr); n++; } });
  Logger.log(n ? '✔ Đã tắt báo cáo ngày.' : 'Báo cáo ngày vốn chưa bật.');
}
