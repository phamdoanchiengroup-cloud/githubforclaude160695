/**
 * ============================================================
 *  ThanhToan.gs — VÍ XU, MỞ KHÓA TỪNG PHẦN, ĐƠN NẠP & QUẢN TRỊ
 *  - 1 xu = 1.000đ. Khách nạp xu qua VietQR (payOS tự đối soát, hoặc thủ công do chủ sở hữu xác nhận),
 *    rồi dùng xu mở khóa "Bản mở" (49 xu) và các phần trả thêm cho từng lá số – mở vĩnh viễn.
 *  - Khóa lá số = băm của (loại lịch, ngày, tháng, năm, nhuận, giờ, phút, giới tính, họ tên) – đổi năm xem không mất quyền.
 *  - Chủ sở hữu và thành viên VIP: toàn quyền, không trừ xu.
 *  - Dữ liệu trong Google Sheet: Vi, SoCai (sổ cái), MoKhoa, DonHang. Cấu hình payOS & bảng giá trong Script Properties.
 *  - Đối soát payOS bằng cách tự hỏi trạng thái đơn (khi khách đang chờ + trigger mỗi 5 phút), không cần webhook
 *    (Apps Script trả 302 cho POST và không đọc được header).
 * ============================================================
 */
var TT_PHAN_MAC_DINH = {
  co_ban: { ten: 'Bản mở – luận giải đầy đủ 6 hệ', xu: 49 },
  bien_co: { ten: 'Biến cố hội tụ 30 năm & dự đoán cả đời', xu: 29 },
  phoi_ngau: { ten: 'Chân dung người phối ngẫu & tuổi hợp', xu: 19 },
  luu_nien: { ten: 'Lưu niên 14 năm, 12 tháng, 7 ngày', xu: 19 },
  pdf: { ten: 'PDF bản đầy đủ', xu: 29 },
  do_gio: { ten: 'Dò giờ sinh theo sự kiện', xu: 9 },
  tron_goi: { ten: 'Trọn gói – mở tất cả', xu: 119 }
};
var TT_GOI_MAC_DINH = [{ tien: 50000, xu: 50 }, { tien: 100000, xu: 110 }, { tien: 200000, xu: 240 }, { tien: 500000, xu: 650 }];
var TT_SH = {
  Vi: ['Tài khoản', 'Số dư (xu)', 'Cập nhật'],
  SoCai: ['Thời gian', 'Tài khoản', 'Thay đổi (xu)', 'Số dư sau', 'Lý do', 'Tham chiếu'],
  MoKhoa: ['Thời gian', 'Tài khoản', 'Khóa lá số', 'Phần', 'Xu', 'Lá số'],
  DonHang: ['Mã đơn', 'Tài khoản', 'Số tiền (đ)', 'Xu', 'Trạng thái', 'Tạo lúc', 'Trả lúc', 'Kênh', 'Tham chiếu', 'Nội dung CK']
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
  var phan = JSON.parse(JSON.stringify(TT_PHAN_MAC_DINH)), goi = TT_GOI_MAC_DINH.slice();
  try {
    var v = PropertiesService.getScriptProperties().getProperty('TT_BANG_GIA');
    if (v) {
      var o = JSON.parse(v);
      Object.keys(o.phan || {}).forEach(function (k) { if (phan[k] && o.phan[k] >= 0) phan[k].xu = Math.round(o.phan[k]); });
      if (o.goi && o.goi.length) goi = o.goi.filter(function (g) { return g.tien > 0 && g.xu > 0; });
    }
  } catch (e) { /* dùng mặc định */ }
  return { phan: phan, goi: goi, xuVnd: 1000 };
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
  var q = {};
  Object.keys(TT_PHAN_MAC_DINH).forEach(function (k) { q[k] = false; });
  if (!u) return q;
  if (ttToanQuyen_(u)) { Object.keys(q).forEach(function (k) { q[k] = true; }); q.toanQuyen = true; return q; }
  var sh = ttSheet_('MoKhoa');
  ttTim_(sh, 3, khoa).forEach(function (r) {
    var v = sh.getRange(r, 1, 1, 4).getValues()[0];
    if (String(v[1]) === u.ten) q[v[3]] = true;
  });
  if (q.tron_goi) Object.keys(q).forEach(function (k) { q[k] = true; });
  return q;
}
/** Cắt bớt các phần chưa mở khỏi kết quả đầy đủ (Bản mở đã có) */
function ttCatPhan_(r, q) {
  var vy = r.tuvi.info.viewYear, T = r.moRong && r.moRong.tongHop;
  if (!q.bien_co) {
    if (r.duDoan) { r.duDoan.chuDe = {}; delete r.duDoan._years; }
    if (T) T.hoiTu = null;
  }
  if (!q.phoi_ngau && T) T.phoiNgau = null;
  if (!q.luu_nien) {
    if (r.battuChiTiet && r.battuChiTiet.luuNien) r.battuChiTiet.luuNien = r.battuChiTiet.luuNien.filter(function (y) { return y.nam === vy; });
    if (r.chiTiet) { r.chiTiet.nguyetVan = []; r.chiTiet.nhatVan = []; r.chiTiet.tieuVanNhieuNam = []; }
    if (T) { T.thang = []; T.ngay = []; }
  }
  return r;
}

/* ---------------- API: ví & mở khóa ---------------- */
function viCuaToi(token) {
  var u = tkCan_(token), bg = ttBangGia_();
  var out = { nguoiDung: u, toanQuyen: ttToanQuyen_(u), soDu: ttSoDu_(u.ten), bangGia: bg, soCai: [], donCho: [], thanhToan: ttCauHinh_().payos ? 'payos' : 'thucong' };
  var sh = ttSheet_('SoCai');
  ttTim_(sh, 2, u.ten).slice(-15).reverse().forEach(function (r) {
    var v = sh.getRange(r, 1, 1, 6).getValues()[0];
    out.soCai.push({ luc: ttNgay_(v[0]), n: v[2], sau: v[3], lyDo: v[4] });
  });
  return out;
}
function muaPhan(token, input, phan) {
  var u = tkCan_(token), bg = ttBangGia_(), p = bg.phan[phan];
  if (!p) throw new Error('Không có gói "' + phan + '".');
  var khoa = ttKhoaLaSo_(input);
  if (ttToanQuyen_(u)) return { ok: true, toanQuyen: true };
  return ttKhoa_(function () {
    var q = ttQuyen_(u, khoa);
    if (q[phan]) return { ok: true, daCo: true, soDu: ttSoDu_(u.ten) };
    if (phan !== 'co_ban' && phan !== 'tron_goi' && !q.co_ban) throw new Error('Hãy mở "Bản mở" trước, hoặc chọn Trọn gói.');
    var gia = p.xu;
    if (phan === 'tron_goi') {
      var daTra = Object.keys(q).filter(function (k) { return q[k] && k !== 'tron_goi' && bg.phan[k]; }).reduce(function (s, k) { return s + bg.phan[k].xu; }, 0);
      gia = Math.max(0, p.xu - daTra);
    }
    var du = ttSoDu_(u.ten);
    if (du < gia) return { ok: false, thieu: gia - du, gia: gia, soDu: du };
    var moi = gia ? ttCong_(u.ten, -gia, 'Mở khóa: ' + p.ten + ' – ' + String(input && input.name || '').slice(0, 40), khoa) : du;
    ttSheet_('MoKhoa').appendRow([new Date(), u.ten, khoa, phan, gia, String(input && input.name || '').slice(0, 60)]);
    return { ok: true, soDu: moi, gia: gia };
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
    ttCong_(d.tk, d.xu, 'Nạp ' + d.tien + 'đ (' + nguon + ')', 'DON' + ma);
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
  Object.keys(TT_PHAN_MAC_DINH).forEach(function (k) { var v = Math.round(Number(bg && bg.phan && bg.phan[k])); if (v >= 0 && v < 100000) phan[k] = v; });
  (bg && bg.goi || []).forEach(function (g) { var t = Math.round(Number(g.tien)), x = Math.round(Number(g.xu)); if (t >= 2000 && x > 0) goi.push({ tien: t, xu: x }); });
  if (!goi.length) throw new Error('Cần ít nhất một gói nạp (số tiền ≥ 2.000đ).');
  PropertiesService.getScriptProperties().setProperty('TT_BANG_GIA', JSON.stringify({ phan: phan, goi: goi }));
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
  ['Vi', 'SoCai', 'MoKhoa', 'DonHang'].forEach(ttSheet_);
  ScriptApp.getProjectTriggers();
  try { UrlFetchApp.fetch('https://api-merchant.payos.vn', { muteHttpExceptions: true }); } catch (e) { /* chỉ để xin quyền */ }
  LockService.getScriptLock();
  Logger.log('✔ Đã cấp quyền và tạo các trang tính Vi, SoCai, MoKhoa, DonHang.');
}
