/**
 * ============================================================
 *  ThanhToan.gs — VÍ XU, MỞ KHÓA TỪNG PHẦN, ĐƠN NẠP & QUẢN TRỊ
 *  - 1 xu = 1.000đ. Khách nạp xu qua VietQR (payOS tự đối soát, hoặc thủ công do chủ sở hữu xác nhận),
 *    rồi dùng xu mở khóa "Bản mở" (49 xu) và các phần trả thêm cho từng lá số.
 *  - Mô hình nhiều giai đoạn: bản mệnh mở 1 lần; VẬN HẠN bán theo từng đại vận (dv:<năm bắt đầu>), từng năm
 *    (nam:<năm>), nhật vận theo tháng (thang:<yyyy-mm>) và gói "Đồng hành cả năm" (dong_hanh:<năm>) → khách quay lại mỗi năm/tháng.
 *  - Gói gia đình: mua N "lượt mở" (sheet Ve), mỗi lượt mở Bản mở + vận năm hiện tại cho một lá số bất kỳ.
 *  - Khóa lá số = băm của (loại lịch, ngày, tháng, năm, nhuận, giờ, phút, giới tính, họ tên) – đổi năm xem không mất quyền.
 *  - Chủ sở hữu và thành viên VIP: toàn quyền, không trừ xu.
 *  - Dữ liệu trong Google Sheet: Vi, SoCai (sổ cái), MoKhoa, DonHang. Cấu hình payOS & bảng giá trong Script Properties.
 *  - Đối soát payOS bằng cách tự hỏi trạng thái đơn (khi khách đang chờ + trigger mỗi 5 phút), không cần webhook
 *    (Apps Script trả 302 cho POST và không đọc được header).
 * ============================================================
 */
var TT_PHAN_MAC_DINH = {
  co_ban: { ten: 'Bản mở – luận giải bản mệnh 6 hệ', xu: 49 },
  dai_van: { ten: 'Luận chi tiết 1 đại vận (10 năm)', xu: 19, theo: 'dv' },
  dai_van_qua: { ten: 'Đại vận đã qua – kiểm chứng', xu: 9, theo: 'dv' },
  tron_dai_van: { ten: 'Trọn 12 đại vận cả đời', xu: 99 },
  nam: { ten: 'Vận năm – tiểu vận, 12 tháng, lưu niên', xu: 29, theo: 'nam' },
  thang: { ten: 'Nhật vận từng ngày trong 1 tháng', xu: 9, theo: 'thang' },
  dong_hanh: { ten: 'Đồng hành cả năm – vận năm + nhật vận 12 tháng', xu: 79, theo: 'nam' },
  bien_co: { ten: 'Biến cố hội tụ 30 năm & dự đoán cả đời', xu: 29 },
  phoi_ngau: { ten: 'Chân dung người phối ngẫu & tuổi hợp', xu: 19 },
  pdf: { ten: 'PDF bản đầy đủ', xu: 29 },
  do_gio: { ten: 'Dò chính xác giờ sinh', xu: 19 },
  tron_goi: { ten: 'Trọn đời – bản mệnh, 12 đại vận, biến cố, phối ngẫu, PDF, dò giờ', xu: 149 },
  cap_doi: { ten: 'Xem cặp đôi – hợp hôn 2 lá số', xu: 29 },   // mở theo từng cặp, không thuộc trọn gói
  gia_dinh_3: { ten: 'Gói gia đình 3 người', xu: 129, luot: 3 },
  gia_dinh_5: { ten: 'Gói gia đình 5 người', xu: 199, luot: 5 },
  luu_nien: { ten: 'Lưu niên nhiều năm (gói cũ)', xu: 19, an: true }   // gói cũ: người đã mua được xem mọi năm/tháng
};
/** Phần thuộc Trọn đời (không gồm vận năm/tháng – bán theo từng năm) */
var TT_TRON_GOI = ['co_ban', 'tron_dai_van', 'bien_co', 'phoi_ngau', 'pdf', 'do_gio'];
var TT_GOI_MAC_DINH = [{ tien: 50000, xu: 50 }, { tien: 100000, xu: 110 }, { tien: 200000, xu: 240 }, { tien: 500000, xu: 650 }];
var TT_SH = {
  Vi: ['Tài khoản', 'Số dư (xu)', 'Cập nhật'],
  SoCai: ['Thời gian', 'Tài khoản', 'Thay đổi (xu)', 'Số dư sau', 'Lý do', 'Tham chiếu'],
  MoKhoa: ['Thời gian', 'Tài khoản', 'Khóa lá số', 'Phần', 'Xu', 'Lá số'],
  DonHang: ['Mã đơn', 'Tài khoản', 'Số tiền (đ)', 'Xu', 'Trạng thái', 'Tạo lúc', 'Trả lúc', 'Kênh', 'Tham chiếu', 'Nội dung CK'],
  Ve: ['Tài khoản', 'Lượt mở còn lại', 'Cập nhật']
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
  var phan = JSON.parse(JSON.stringify(TT_PHAN_MAC_DINH)), goi = TT_GOI_MAC_DINH.slice(), km = { lanDau: 100, gioiThieu: 20 };
  try {
    var v = PropertiesService.getScriptProperties().getProperty('TT_BANG_GIA');
    if (v) {
      var o = JSON.parse(v);
      Object.keys(o.phan || {}).forEach(function (k) { if (phan[k] && o.phan[k] >= 0) phan[k].xu = Math.round(o.phan[k]); });
      if (o.goi && o.goi.length) goi = o.goi.filter(function (g) { return g.tien > 0 && g.xu > 0; });
      if (o.thuongLanDau != null) km.lanDau = Math.max(0, Math.min(500, +o.thuongLanDau || 0));
      if (o.thuongGioiThieu != null) km.gioiThieu = Math.max(0, Math.min(100, +o.thuongGioiThieu || 0));
    }
  } catch (e) { /* dùng mặc định */ }
  return { phan: phan, goi: goi, xuVnd: 1000, thuongLanDau: km.lanDau, thuongGioiThieu: km.gioiThieu };
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
  else sh.appendRow([u, moi, new Date()]);
  ttSheet_('SoCai').appendRow([new Date(), u, n, moi, lyDo, thamChieu || '']);
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
  var q = { dvMo: {}, namMo: {}, thangMo: {}, dhNam: {} };
  Object.keys(TT_PHAN_MAC_DINH).forEach(function (k) { q[k] = false; });
  if (!u) return q;
  if (ttToanQuyen_(u)) { Object.keys(TT_PHAN_MAC_DINH).forEach(function (k) { q[k] = true; }); q.toanQuyen = q.dvAll = q.namAll = q.thangAll = true; return q; }
  var sh = ttSheet_('MoKhoa');
  ttTim_(sh, 3, khoa).forEach(function (r) {
    var v = sh.getRange(r, 1, 1, 4).getValues()[0];
    if (String(v[1]) !== u.ten) return;
    var p = String(v[3]), m = p.match(/^(dv|nam|thang|dong_hanh):(.+)$/);
    if (!m) { q[p] = true; return; }
    if (m[1] === 'dong_hanh') q.dhNam[m[2]] = true; else q[m[1] + 'Mo'][m[2]] = true;
  });
  if (q.tron_goi) TT_TRON_GOI.forEach(function (k) { q[k] = true; });
  if (q.tron_dai_van) q.dvAll = true;
  if (q.luu_nien) q.namAll = q.thangAll = true;   // gói cũ
  return q;
}
function ttPad2_(n) { return (n < 10 ? '0' : '') + n; }
function ttCoDv_(q, nam) { return !!(q.toanQuyen || q.dvAll || q.dvMo[String(nam)]); }
function ttCoNam_(q, y) { return !!(q.toanQuyen || q.namAll || q.namMo[String(y)] || q.dhNam[String(y)]); }
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
  var coNam = ttCoNam_(q, vy), tn = ttThangNhatVan_(r), coThang = ttCoThang_(q, tn[0], tn[1]);
  var tomTat = { nam: vy, coNam: coNam, thangNhat: tn[0] + '-' + ttPad2_(tn[1]), coThang: coThang, dv: [] };
  if (!q.bien_co) {
    if (r.duDoan) { r.duDoan.chuDe = {}; delete r.duDoan._years; }
    if (T) T.hoiTu = null;
  }
  if (!q.phoi_ngau && T) T.phoiNgau = null;
  // ĐẠI VẬN: giữ khung (tuổi, năm, cung, điểm) – bỏ lời luận của vận chưa mở
  (CT.daiVan || []).forEach(function (d) {
    var bd = +String(d.nam).slice(0, 4), co = ttCoDv_(q, bd);
    tomTat.dv.push({ nam: bd, co: co });
    if (!co) { d.secs = []; d.khoa = true; }
  });
  if (T && T.duongDoi) (T.duongDoi.chang || []).forEach(function (c) {
    var bd = +String(c.nam).slice(0, 4);
    if (!ttCoDv_(q, bd)) { c.lines = (c.lines || []).slice(0, 1); c.khoa = true; }
  });
  // VẬN NĂM
  if (!coNam) {
    if (CT.tieuVan) { CT.tieuVan.secs = []; CT.tieuVan.luu = null; CT.tieuVan.khoa = true; }
    CT.nguyetVan = [];
    if (T && T.namNay) { T.namNay.ketLuan = (T.namNay.ketLuan || []).slice(0, 1); T.namNay.linhVuc = []; T.namNay.khoa = true; }
    if (T && T.thang) T.thang = T.thang.map(function (m) { return { thang: m.thang, canChi: m.canChi, batDau: m.batDau, diem: m.diem, danhGia: m.danhGia, khoa: true }; });
    if (r.moRong && r.moRong.haLac && r.moRong.haLac.luan && r.moRong.haLac.luan.namNay) { var hn = r.moRong.haLac.luan.namNay; hn.y = ''; hn.khuyen = ''; hn.ghi = []; hn.khoa = true; }
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
  r.vanTom = tomTat;
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
/** id: năm bắt đầu đại vận (dai_van), năm (nam, dong_hanh), 'yyyy-mm' (thang) */
function ttMaPhan_(phan, id) {
  var P = TT_PHAN_MAC_DINH[phan];
  if (!P.theo) return phan;
  id = String(id == null ? '' : id).trim();
  if (P.theo === 'thang') { var m = id.match(/^(\d{4})-(\d{1,2})$/); if (!m || +m[2] < 1 || +m[2] > 12) throw new Error('Tháng không hợp lệ.'); return 'thang:' + m[1] + '-' + ttPad2_(+m[2]); }
  if (!/^\d{4}$/.test(id) || +id < 1800 || +id > 2300) throw new Error('Năm không hợp lệ.');
  return (P.theo === 'dv' ? 'dv' : phan === 'dong_hanh' ? 'dong_hanh' : 'nam') + ':' + id;
}
function muaPhan(token, input, phan, id) {
  var u = tkCan_(token), bg = ttBangGia_(), p = bg.phan[phan];
  if (!p || TT_PHAN_MAC_DINH[phan].an) throw new Error('Không có gói "' + phan + '".');
  if (TT_PHAN_MAC_DINH[phan].luot) return ttMuaGiaDinh_(u, phan, bg);
  var capDoi = phan === 'cap_doi', khoa = capDoi ? ttKhoaCapDoi_(input && input.a, input && input.b) : ttKhoaLaSo_(input);
  var tenLS = capDoi ? String(input.a.name || '?') + ' & ' + String(input.b.name || '?') : String(input && input.name || '');
  if (ttToanQuyen_(u)) return { ok: true, toanQuyen: true };
  if (phan === 'dai_van_qua') { phan = 'dai_van'; p = bg.phan.dai_van; }
  var ma = ttMaPhan_(phan, id);
  return ttKhoa_(function () {
    var q = ttQuyen_(u, khoa);
    var daCo = ma === phan ? q[phan] : (/^dv:/.test(ma) ? ttCoDv_(q, id) : /^thang:/.test(ma) ? ttCoThang_(q, +ma.slice(6, 10), +ma.slice(11)) :
      /^dong_hanh:/.test(ma) ? !!q.dhNam[String(id)] : ttCoNam_(q, id));
    if (daCo) return { ok: true, daCo: true, soDu: ttSoDu_(u.ten) };
    if (['co_ban', 'tron_goi', 'do_gio'].indexOf(phan) < 0 && !capDoi && !q.co_ban) throw new Error('Hãy mở "Bản mở" trước (hoặc dùng lượt gia đình / Trọn đời).');
    var gia = p.xu;
    if (phan === 'dai_van' && +id + 9 < new Date().getFullYear()) gia = bg.phan.dai_van_qua.xu;   // vận đã qua: giá kiểm chứng
    if (phan === 'dong_hanh') {   // trừ phần đã mua của năm đó
      var daTraNam = q.namMo[String(id)] ? bg.phan.nam.xu : 0;
      Object.keys(q.thangMo).forEach(function (k) { if (k.indexOf(String(id) + '-') === 0) daTraNam += bg.phan.thang.xu; });
      gia = Math.max(0, p.xu - daTraNam);
    }
    if (phan === 'tron_goi') {
      var daTra = TT_TRON_GOI.filter(function (k) { return q[k] && bg.phan[k]; }).reduce(function (s, k) { return s + bg.phan[k].xu; }, 0);
      gia = Math.max(0, p.xu - daTra);
    }
    var du = ttSoDu_(u.ten);
    if (du < gia) return { ok: false, thieu: gia - du, gia: gia, soDu: du };
    var nhan = p.ten + (ma !== phan ? ' [' + ma + ']' : '');
    var moi = gia ? ttCong_(u.ten, -gia, 'Mở khóa: ' + nhan + ' – ' + tenLS.slice(0, 60), khoa) : du;
    ttSheet_('MoKhoa').appendRow([new Date(), u.ten, khoa, ma, gia, tenLS.slice(0, 80)]);
    return { ok: true, soDu: moi, gia: gia };
  });
}

/* ---------------- Gói gia đình: lượt mở dùng cho nhiều lá số ---------------- */
function ttSoVe_(ten) {
  var sh = ttSheet_('Ve'), r = ttTim_(sh, 1, ten);
  return r.length ? Number(sh.getRange(r[0], 2).getValue()) || 0 : 0;
}
function ttCongVe_(ten, n) {
  var sh = ttSheet_('Ve'), r = ttTim_(sh, 1, ten), moi = ttSoVe_(ten) + n;
  if (moi < 0) throw new Error('Bạn đã dùng hết lượt gia đình.');
  if (r.length) sh.getRange(r[0], 2, 1, 2).setValues([[moi, new Date()]]); else sh.appendRow([ten, moi, new Date()]);
  return moi;
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
/** Dùng 1 lượt gia đình cho lá số đang xem: mở Bản mở + vận năm đang xem */
function dungLuotGiaDinh(token, input) {
  var u = tkCan_(token);
  if (ttToanQuyen_(u)) return { ok: true, toanQuyen: true };
  var khoa = ttKhoaLaSo_(input), vy = +(input && input.viewYear) || new Date().getFullYear(), ten = String(input && input.name || '').slice(0, 80);
  return ttKhoa_(function () {
    var q = ttQuyen_(u, khoa);
    if (q.co_ban && ttCoNam_(q, vy)) return { ok: true, daCo: true, soVe: ttSoVe_(u.ten) };
    var ve = ttCongVe_(u.ten, -1), sh = ttSheet_('MoKhoa');
    if (!q.co_ban) sh.appendRow([new Date(), u.ten, khoa, 'co_ban', 0, ten + ' (lượt gia đình)']);
    if (!ttCoNam_(q, vy)) sh.appendRow([new Date(), u.ten, khoa, 'nam:' + vy, 0, ten + ' (lượt gia đình)']);
    return { ok: true, soVe: ve };
  });
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
  ttSheet_('DonHang').appendRow([ma, u.ten, g.tien, g.xu, 'CHO', new Date(), '', don.kenh, don.checkoutUrl || '', don.noiDung]);
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
  PropertiesService.getScriptProperties().setProperty('TT_BANG_GIA', JSON.stringify({ phan: phan, goi: goi,
    thuongLanDau: pct(bg && bg.thuongLanDau, cu.thuongLanDau, 500), thuongGioiThieu: pct(bg && bg.thuongGioiThieu, cu.thuongGioiThieu, 100) }));
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
