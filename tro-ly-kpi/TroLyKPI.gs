/**
 * TRỢ LÝ KPI – bản tin sản xuất qua Zalo Bot.
 * Dự án Apps Script RIÊNG, chỉ ĐỌC file "CSDL KPI" (không sửa web app KPI).
 *
 * Thuộc tính tập lệnh (Cài đặt dự án → Thuộc tính tập lệnh):
 *   ZALO_TOKEN   – token bot Zalo (bắt buộc, chủ dự án tự nhập, không ghi vào mã)
 *   SHEET_ID     – (tùy chọn) ID file CSDL KPI, mặc định là KPI_SHEET_ID_MAC_DINH
 *   WEBAPP_URL   – (tùy chọn) URL ứng dụng web /exec nếu caiDat không tự lấy được
 *   Các khóa tự sinh: WEBHOOK_KEY, MA_KET_NOI, CHU_CHAT_ID, DA_GUI_NGAY
 *
 * Không bao giờ đọc/gửi: CCCD, điện thoại, địa chỉ, lương (chỉ dùng cột cần thiết).
 */

var KPI_SHEET_ID_MAC_DINH = '1znHlbc3ulMRQILePmLZbwNQx-mMXFxd9sm0PBG9lrF8';
var TZ = 'Asia/Ho_Chi_Minh';
var ZALO_API = 'https://bot-api.zaloplatforms.com/bot';
var GIO_BAN_TIN = 7;
/** Trạng thái dòng NhatKySanXuat được tính là sản lượng chính thức (web app KPI ghi "Đã chốt" khi TP duyệt). */
var TT_TINH = ['đã chốt'];
var TT_LOAI = ['từ chối', 'đã hủy', 'hủy'];

/* ============================ CÀI ĐẶT (chạy 1 lần) ============================ */

/** Chạy SAU KHI đã nhập ZALO_TOKEN và đã Triển khai ứng dụng web. */
function caiDat() {
  var P = PropertiesService.getScriptProperties();
  if (!P.getProperty('ZALO_TOKEN')) throw new Error('Chưa nhập ZALO_TOKEN trong Thuộc tính tập lệnh.');
  var url = P.getProperty('WEBAPP_URL') || ScriptApp.getService().getUrl();
  if (!url || !/\/exec$/.test(url)) throw new Error('Chưa có URL ứng dụng web (/exec). Hãy Triển khai → Ứng dụng web trước, hoặc dán URL vào WEBAPP_URL.');
  var key = P.getProperty('WEBHOOK_KEY');
  if (!key) { key = Utilities.getUuid().replace(/-/g, ''); P.setProperty('WEBHOOK_KEY', key); }
  var r = zalo_('setWebhook', { url: url + '?k=' + key, secret_token: key });
  if (!r.ok) throw new Error('Zalo từ chối webhook: ' + (r.description || JSON.stringify(r)));

  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'guiBanTinSang') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('guiBanTinSang').timeBased().everyDays(1).atHour(GIO_BAN_TIN).inTimezone(TZ).create();

  var ma = '';
  if (!P.getProperty('CHU_CHAT_ID')) {
    ma = String(Math.floor(100000 + Math.random() * 900000));
    P.setProperty('MA_KET_NOI', ma);
  }
  var kq = 'ĐÃ CÀI XONG.\n- Webhook: ' + (r.result && r.result.verification && r.result.verification.ok ? 'Zalo kiểm tra OK' : 'đã lưu') +
    '\n- Bản tin tự gửi lúc ' + GIO_BAN_TIN + ' giờ sáng mỗi ngày.' +
    (ma ? '\n\n👉 Mở Zalo, nhắn cho bot đúng dòng này:  ketnoi ' + ma : '\n- Bot đã kết nối với Zalo của bạn từ trước.');
  Logger.log(kq);
  return kq;
}

/** Gửi thử bản tin ngay (chạy tay trong trình soạn thảo). */
function thuGuiBanTin() {
  var id = PropertiesService.getScriptProperties().getProperty('CHU_CHAT_ID');
  if (!id) throw new Error('Chưa kết nối Zalo: chạy caiDat rồi nhắn "ketnoi <mã>" cho bot.');
  var t = banTinNgay_();
  guiZalo_(id, t);
  Logger.log(t);
}

/** Liệt kê các giá trị cột TrangThai của NhatKySanXuat để kiểm tra cách tính. */
function xemTrangThai() {
  var b = bang_('NhatKySanXuat'), dem = {};
  b.rows.forEach(function (r) { var t = String(r[b.c.TrangThai]).trim() || '(trống)'; dem[t] = (dem[t] || 0) + 1; });
  Logger.log(JSON.stringify(dem, null, 1));
  return dem;
}

/* ============================ ZALO ============================ */

function zalo_(ham, data) {
  var token = PropertiesService.getScriptProperties().getProperty('ZALO_TOKEN');
  var res = UrlFetchApp.fetch(ZALO_API + token + '/' + ham, {
    method: 'post', contentType: 'application/json', payload: JSON.stringify(data || {}), muteHttpExceptions: true
  });
  try { return JSON.parse(res.getContentText()); } catch (e) { return { ok: false, description: res.getContentText() }; }
}

/** Gửi tin, tự chia khúc ≤1900 ký tự theo dòng (giới hạn Zalo 2000). */
function guiZalo_(chatId, text) {
  var khuc = [], cur = '';
  String(text).split('\n').forEach(function (d) {
    if ((cur + '\n' + d).length > 1900 && cur) { khuc.push(cur); cur = d; } else cur = cur ? cur + '\n' + d : d;
  });
  if (cur) khuc.push(cur);
  khuc.forEach(function (k) { zalo_('sendMessage', { chat_id: chatId, text: k }); });
}

/** Zalo gọi vào đây mỗi khi có tin nhắn (webhook). */
function doPost(e) {
  try {
    var P = PropertiesService.getScriptProperties();
    var key = P.getProperty('WEBHOOK_KEY');
    if (!e || !e.parameter || !key || e.parameter.k !== key) return traLoi_('ok');
    var body = JSON.parse((e.postData && e.postData.contents) || '{}');
    var ds = body.result !== undefined ? body.result : body;
    (Array.isArray(ds) ? ds : [ds]).forEach(xuLyTin_);
  } catch (err) { console.error(err && err.stack || err); }
  return traLoi_('ok');
}

function doGet() { return traLoi_('Trợ lý KPI đang chạy.'); }

function traLoi_(s) { return ContentService.createTextOutput(s); }

function xuLyTin_(u) {
  var m = u && u.message;
  if (!m || !m.chat || typeof m.text !== 'string') return;
  var C = CacheService.getScriptCache();
  if (m.message_id) { if (C.get('m' + m.message_id)) return; C.put('m' + m.message_id, '1', 3600); }
  var P = PropertiesService.getScriptProperties();
  var chat = String(m.chat.id), text = m.text.trim(), chu = P.getProperty('CHU_CHAT_ID');
  var kn = text.match(/^\/?k[eế]t\s*n[oố]i\s+(\d{6})$/i);
  if (kn) {
    var ma = P.getProperty('MA_KET_NOI');
    if (!chu && ma && kn[1] === ma) {
      P.setProperty('CHU_CHAT_ID', chat); P.deleteProperty('MA_KET_NOI');
      guiZalo_(chat, '✅ Đã kết nối! Từ nay mỗi sáng ' + GIO_BAN_TIN + ' giờ bạn sẽ nhận bản tin sản xuất.\n\n' + HUONG_DAN);
    } else guiZalo_(chat, 'Mã kết nối không đúng hoặc bot đã có chủ.');
    return;
  }
  if (chat !== chu) { guiZalo_(chat, 'Đây là trợ lý riêng, không phục vụ tài khoản này.'); return; }
  guiZalo_(chat, traLoiLenh_(text, chat));
}

var HUONG_DAN = 'Bạn có thể nhắn:\n• bc – bản tin ngày gần nhất\n• bc 10/10 – bản tin ngày 10/10\n• tuần – tổng kết 7 ngày\n• giúp – xem lại hướng dẫn\n• hoặc hỏi tự nhiên, vd "hôm nay bao nhiêu người nghỉ?" (cần bật AI)';

function traLoiLenh_(text, chat) {
  var t = text.toLowerCase().replace(/\s+/g, ' ').trim();
  try {
    var mBc = t.match(/^(bc|báo cáo|bao cao|bản tin|ban tin)(?: (\d{1,2})[\/\-.](\d{1,2})(?:[\/\-.](\d{4}))?)?$/);
    if (mBc) {
      var ngay = null;
      if (mBc[2]) {
        var nam = mBc[4] || Utilities.formatDate(new Date(), TZ, 'yyyy');
        ngay = nam + '-' + pad_(mBc[3]) + '-' + pad_(mBc[2]);
      }
      return banTinNgay_(ngay);
    }
    if (/^(tuần|tuan|tuần này|tuan nay)$/.test(t)) return banTinTuan_();
    if (/^(giúp|giup|help|\/start|xin chào|xin chao|chào|chao|hi)$/.test(t)) return 'Chào bạn 👋\n\n' + HUONG_DAN;
    if (typeof hoiAI_ === 'function' && PropertiesService.getScriptProperties().getProperty('ANTHROPIC_API_KEY')) {
      try { zalo_('sendChatAction', { chat_id: chat, action: 'typing' }); } catch (e) { /* không bắt buộc */ }
      return hoiAI_(chat, text);
    }
    return 'Trợ lý chưa hiểu câu này (chưa bật hỏi tự do bằng AI).\n\n' + HUONG_DAN;
  } catch (e) {
    console.error(e && e.stack || e);
    return '⚠ Lỗi khi đọc dữ liệu: ' + (e && e.message || e);
  }
}

/** Trigger 7 giờ sáng. Không gửi lại nếu ngày gần nhất đã báo (vd. Chủ nhật). */
function guiBanTinSang() {
  var P = PropertiesService.getScriptProperties();
  var id = P.getProperty('CHU_CHAT_ID');
  if (!id) return;
  var D = napDuLieu_();
  var ngay = ngayGanNhat_(D, homNay_());
  if (!ngay || ngay === P.getProperty('DA_GUI_NGAY')) return;
  guiZalo_(id, banTinNgay_(ngay, D));
  P.setProperty('DA_GUI_NGAY', ngay);
}

/* ============================ ĐỌC DỮ LIỆU ============================ */

function ss_() {
  var id = PropertiesService.getScriptProperties().getProperty('SHEET_ID') || KPI_SHEET_ID_MAC_DINH;
  return SpreadsheetApp.openById(id);
}

/** Đọc 1 sheet → {c: {TenCot: chỉ số}, rows: [...]} ; sheet thiếu thì trả rỗng. */
function bang_(ten, ss) {
  var sh = (ss || ss_()).getSheetByName(ten);
  if (!sh || sh.getLastRow() < 1) return { c: {}, rows: [] };
  var v = sh.getDataRange().getValues(), c = {};
  v[0].forEach(function (h, i) { c[String(h).trim()] = i; });
  return { c: c, rows: v.slice(1) };
}

var SHEET_CAN = ['NhatKySanXuat', 'CongDoan', 'DinhMuc', 'PhongBan', 'PhieuKCS', 'DanhMucLoi', 'DiemDanhNghi', 'MayMoc',
  'PhatNhapTre', 'XacNhanDiemDanh', 'NghiDaiHan', 'NgayLe', 'MienTruDiemDanh'];

function napDuLieu_() {
  var ss = ss_(), D = {};
  SHEET_CAN.forEach(function (t) { D[t] = bang_(t, ss); });
  napNhanSu_(D, ss);
  return D;
}

/**
 * NhanSu → chỉ giữ MaNV, MaXuong, còn làm, là quản lý (bỏ mọi cột cá nhân ngay khi đọc).
 * Quản lý (TP/PP, trưởng/phó phòng, quản đốc) không tính KPI công nhân – giống mapQuanLy_ của web app.
 * TaiKhoan chỉ đọc 2 cột VaiTro, MaNV.
 */
function napNhanSu_(D, ss) {
  var ns = bang_('NhanSu', ss), tk = bang_('TaiKhoan', ss);
  D.nvXuong = {}; D.nvCon = {}; D.nvQL = {}; D.nvTen = {};
  tk.rows.forEach(function (r) {
    var vt = String(r[tk.c.VaiTro]).trim(), m = String(r[tk.c.MaNV] || '').trim();
    if ((vt === 'TP' || vt === 'PP') && m) D.nvQL[m] = 1;
  });
  ns.rows.forEach(function (r) {
    var m = String(r[ns.c.MaNV]).trim();
    if (!m) return;
    D.nvXuong[m] = String(r[ns.c.MaXuong]).trim();
    D.nvTen[m] = String(r[ns.c.HoTen]).trim();
    if (String(r[ns.c.TrangThai]).trim() !== 'Nghỉ việc') D.nvCon[m] = 1;
    if (/trưởng phòng|phó phòng|trưởng bộ phận|phó bộ phận|phó bp|quản đốc/.test(String(r[ns.c.ChucDanh] || '').toLowerCase())) D.nvQL[m] = 1;
  });
}

function pad_(n) { n = String(n); return n.length < 2 ? '0' + n : n; }
function homNay_() { return Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd'); }
function so_(x) {
  if (typeof x === 'number') return x;
  var s = String(x || '').trim();
  if (s.indexOf(',') >= 0) s = s.replace(/\./g, '').replace(',', '.');
  var n = Number(s);
  return isFinite(n) && s !== '' ? n : 0;
}

/** Chuẩn hóa ngày về 'yyyy-MM-dd' (Date, '2026-08-25', '25/08/2026 9:14:47'). */
function ngay_(v) {
  if (Object.prototype.toString.call(v) === '[object Date]') return Utilities.formatDate(v, TZ, 'yyyy-MM-dd');
  var s = String(v || '').trim(), m;
  if ((m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/))) return m[1] + '-' + pad_(m[2]) + '-' + pad_(m[3]);
  if ((m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/))) return m[3] + '-' + pad_(m[2]) + '-' + pad_(m[1]);
  return '';
}

function congNgay_(ymd, n) {
  var p = ymd.split('-').map(Number), d = new Date(Date.UTC(p[0], p[1] - 1, p[2] + n));
  return d.getUTCFullYear() + '-' + pad_(d.getUTCMonth() + 1) + '-' + pad_(d.getUTCDate());
}

var THU = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
function tenNgay_(ymd) {
  var p = ymd.split('-').map(Number), d = new Date(Date.UTC(p[0], p[1] - 1, p[2]));
  return THU[d.getUTCDay()] + ' ' + pad_(p[2]) + '/' + pad_(p[1]) + '/' + p[0];
}

function trangThai_(s) {
  s = String(s || '').trim().toLowerCase();
  if (TT_TINH.indexOf(s) >= 0) return 'tinh';
  if (TT_LOAI.indexOf(s) >= 0) return 'loai';
  return 'cho';
}

/** Ngày gần nhất (< hôm nay) có dòng sản xuất, trong 10 ngày qua. */
function ngayGanNhat_(D, homNay) {
  var b = D.NhatKySanXuat, tu = congNgay_(homNay, -10), max = '';
  b.rows.forEach(function (r) {
    var d = ngay_(r[b.c.Ngay]);
    if (d && d < homNay && d >= tu && d > max && trangThai_(r[b.c.TrangThai]) !== 'loai') max = d;
  });
  return max;
}

/** Bảng tra: công đoạn → xưởng, định mức (dòng cuối của mỗi công đoạn – giống web app), tên xưởng. */
function traCuu_(D) {
  var T = { cdXuong: {}, dm: {}, tenXuong: {}, xuongDung: [], tenLoi: {} };
  var cd = D.CongDoan;
  cd.rows.forEach(function (r) { T.cdXuong[String(r[cd.c.MaCD]).trim()] = String(r[cd.c.MaXuong]).trim(); });
  var dm = D.DinhMuc;
  dm.rows.forEach(function (r) { T.dm[String(r[dm.c.MaCD]).trim()] = so_(r[dm.c.DinhMucGio]); });
  var pb = D.PhongBan;
  pb.rows.forEach(function (r) {
    var ma = String(r[pb.c.MaXuong]).trim();
    T.tenXuong[ma] = String(r[pb.c.TenXuong]).trim() || ma;
    if (!/ngừng|không dùng/i.test(String(r[pb.c.TrangThai]))) T.xuongDung.push(ma);
  });
  var dl = D.DanhMucLoi;
  dl.rows.forEach(function (r) { T.tenLoi[String(r[dl.c.MaLoi]).trim()] = String(r[dl.c.TenLoi]).trim(); });
  return T;
}

function dinhMuc_(T, maCD) { return T.dm[maCD] || 0; }

function xuongCua_(T, D, maCD, maNV) {
  return T.cdXuong[maCD] || D.nvXuong[maNV] || '?';
}

/* ---------- Chấm công – chép đúng quy tắc của web app KPI (khTuBanGhi_, gioCoMat_) ---------- */

function kyHieu_(r, c) {
  var kh = String(r[c.KyHieu] || '').trim();
  if (kh) return kh;
  var l = String(r[c.LyDo] || '').toLowerCase().trim();
  if (!l) return 'P';
  if (l === 'ts' || l.indexOf('thai sản') >= 0) return 'TS';
  if (l.indexOf('nửa ngày') >= 0 || l === '0.5x') return '0.5x';
  if (l.indexOf('không phép') >= 0) return 'Nkp';
  if (l.indexOf('không lương') >= 0) return 'Nkl';
  if (l.indexOf('nghỉ bù') >= 0 || l === 'nb') return 'Nb';
  if (l.indexOf('nghỉ lễ') >= 0 || l === 'nl') return 'NL';
  if (l.indexOf('cưới') >= 0 || l.indexOf('cươi') >= 0 || l === 'cu') return 'Cu';
  if (l.indexOf('tang') >= 0 || l === 'ta') return 'Ta';
  if (l.indexOf('phép') >= 0 || l === 'p') return 'P';
  if (l.indexOf('ốm') >= 0 || l.indexOf('om') >= 0) return 'Nkl';
  if (l.indexOf('bệnh') >= 0 || l.indexOf('viện') >= 0) return 'Nkl';
  if (l.indexOf('gia đình') >= 0 || /(^|\s)gđ(\s|$)/.test(l)) return 'Nkl';
  if (l.indexOf('đi muộn') >= 0) {
    if (l.indexOf('0.5') >= 0) return 'x-0.5';
    if (l.indexOf('1.5') >= 0) return 'x-1.5';
    if (l.indexOf('1') >= 0) return 'x-1';
    if (l.indexOf('2') >= 0) return 'x-2';
    return 'x-1';
  }
  return 'P';
}

function gioCoMat_(k) {
  k = String(k || 'x').trim();
  if (k === '' || k === 'x') return 8;
  if (k === '0.5x') return 4;
  if (k.indexOf('x-') === 0) {
    var muon = parseFloat(k.slice(2));
    if (isNaN(muon) || muon < 0) muon = 0;
    return Math.max(8 - muon, 0);
  }
  return 0;
}

/** Chỉ mục dùng chung cho mọi phép tính ngày công (dựng 1 lần cho mỗi D). */
function chiMuc_(D, T) {
  if (D._I) return D._I;
  var I = { nk: {}, cho: [], loi: {}, kh: {}, xn: {}, ndh: {} };
  var b = D.NhatKySanXuat, c = b.c;
  b.rows.forEach(function (r) {
    var d = ngay_(r[c.Ngay]), tt = trangThai_(r[c.TrangThai]);
    if (!d || tt === 'loai') return;
    var o = { d: d, nv: String(r[c.MaNV]).trim(), cd: String(r[c.MaCD]).trim(), gio: so_(r[c.GioLam]), sl: so_(r[c.SoLuongLamRa]),
      dung: so_(r[c.GioDung]), ly: String(r[c.LyDoDung] || '').trim() };
    o.x = xuongCua_(T, D, o.cd, o.nv);
    if (tt === 'cho') { I.cho.push(o); return; }
    (I.nk[o.nv + '|' + d] = I.nk[o.nv + '|' + d] || []).push(o);
  });
  var k = D.PhieuKCS;
  k.rows.forEach(function (r) {
    var key = String(r[k.c.MaNV]).trim() + '|' + ngay_(r[k.c.Ngay]) + '|' + String(r[k.c.MaCD]).trim();
    I.loi[key] = (I.loi[key] || 0) + so_(r[k.c.SoLuongKhongDat]);
  });
  var dd = D.DiemDanhNghi;
  dd.rows.forEach(function (r) { I.kh[String(r[dd.c.MaNV]).trim() + '|' + ngay_(r[dd.c.Ngay])] = kyHieu_(r, dd.c); });
  var xn = D.XacNhanDiemDanh;
  xn.rows.forEach(function (r) { I.xn[String(r[xn.c.MaXuong]).trim() + '|' + ngay_(r[xn.c.Ngay])] = 1; });
  var nd = D.NghiDaiHan;
  nd.rows.forEach(function (r) {
    var m = String(r[nd.c.MaNV]).trim();
    (I.ndh[m] = I.ndh[m] || []).push({ tu: ngay_(r[nd.c.TuNgay]), den: ngay_(r[nd.c.DenNgay]) });
  });
  return (D._I = I);
}

/**
 * Ngày công từng người, đúng cách web app tính KPI sản lượng:
 * ngày công = xưởng đã xác nhận điểm danh HOẶC người đó có nhật ký đã chốt; bỏ ngày nghỉ dài hạn;
 * giờ có mặt theo ký hiệu chấm công (mặc định x = 8h); giờ chuẩn = Σ (SL − lỗi KCS) ÷ định mức.
 * Không tính người đã nghỉ việc và quản lý (TP/PP…).
 */
function ngayCong_(D, T, tu, den) {
  var I = chiMuc_(D, T), out = [];
  Object.keys(D.nvCon).forEach(function (nv) {
    if (D.nvQL[nv]) return;
    var x = D.nvXuong[nv], ndh = I.ndh[nv] || [];
    for (var d = tu; d <= den; d = congNgay_(d, 1)) {
      var rs = I.nk[nv + '|' + d] || [];
      if (!I.xn[x + '|' + d] && !rs.length) continue;
      if (ndh.some(function (n) { return n.tu <= d && d <= n.den; })) continue;
      var gm = gioCoMat_(I.kh[nv + '|' + d] || 'x');
      if (gm <= 0) continue;
      var o = { nv: nv, x: x, d: d, mau: gm, chuan: 0, sl: 0, loi: 0, gio: 0, dung: 0, rows: rs };
      rs.forEach(function (r) {
        var n = I.loi[nv + '|' + d + '|' + r.cd] || 0, dm = dinhMuc_(T, r.cd);
        if (dm > 0) o.chuan += (r.sl - n) / dm;
        o.sl += r.sl; o.loi += n; o.gio += r.gio; o.dung += r.dung;
      });
      out.push(o);
    }
  });
  return out;
}

function nhomMoi_() { return { mau: 0, chuan: 0, sl: 0, loi: 0, gio: 0, dung: 0, nguoi: {}, chuaKhai: {}, cho: 0, dong: 0 }; }
function congVao_(g, o) {
  g.mau += o.mau; g.chuan += o.chuan; g.sl += o.sl; g.loi += o.loi; g.gio += o.gio; g.dung += o.dung;
  g.nguoi[o.nv] = 1; g.dong += o.rows.length;
  if (!o.rows.length) g.chuaKhai[o.nv + '|' + o.d] = 1;
}

/**
 * Tổng hợp theo xưởng (của người) từ ngày tu → den.
 * Mỗi xưởng: mau (giờ có mặt), chuan (giờ chuẩn), gio (giờ khai), dung, sl, loi, nguoi, chuaKhai, cho (dòng chờ duyệt).
 */
function tongHop_(D, T, tu, den) {
  var I = chiMuc_(D, T), X = {}, dungLyDo = {}, ngayCo = {};
  function x(ma) { return X[ma] = X[ma] || nhomMoi_(); }
  ngayCong_(D, T, tu, den).forEach(function (o) { congVao_(x(o.x), o); if (o.rows.length) ngayCo[o.d] = 1; });
  I.cho.forEach(function (r) { if (r.d >= tu && r.d <= den) x(r.x).cho++; });
  Object.keys(I.nk).forEach(function (k) {
    I.nk[k].forEach(function (r) {
      if (r.d < tu || r.d > den || r.dung <= 0) return;
      var ly = r.ly || 'Không ghi lý do', L = dungLyDo[ly] = dungLyDo[ly] || { gio: 0, xuong: {} };
      L.gio += r.dung; L.xuong[r.x] = (L.xuong[r.x] || 0) + r.dung;
    });
  });
  return { X: X, dungLyDo: dungLyDo, soNgay: Object.keys(ngayCo).length };
}

/** % hiệu suất sản lượng = giờ chuẩn ÷ giờ có mặt (giống web app, không chặn trần). */
function pt_(o) { return o.mau > 0 ? o.chuan / o.mau * 100 : null; }
function tong_(X) {
  var t = nhomMoi_();
  Object.keys(X).forEach(function (k) {
    var o = X[k];
    ['mau', 'chuan', 'sl', 'loi', 'gio', 'dung', 'cho', 'dong'].forEach(function (f) { t[f] += o[f]; });
    Object.keys(o.nguoi).forEach(function (n) { t.nguoi[n] = 1; });
    Object.keys(o.chuaKhai).forEach(function (n) { t.chuaKhai[n] = 1; });
  });
  return t;
}
function so0_(n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
function gio_(n) { return (Math.round(n * 10) / 10).toString().replace('.', ',') + 'h'; }
function lech_(a, b) {
  if (a == null || b == null) return '';
  var d = Math.round(a - b);
  return d > 0 ? ' ▲' + d : d < 0 ? ' ▼' + (-d) : ' =';
}

/** "Chờ duyệt 120, Từ chối 3" – các trạng thái của một ngày. */
function demTrangThai_(D, ngay) {
  var b = D.NhatKySanXuat, dem = {};
  b.rows.forEach(function (r) {
    if (ngay_(r[b.c.Ngay]) !== ngay) return;
    var t = String(r[b.c.TrangThai]).trim() || '(trống)';
    dem[t] = (dem[t] || 0) + 1;
  });
  return Object.keys(dem).sort(function (a, b) { return dem[b] - dem[a]; }).map(function (k) { return k + ' ' + dem[k]; }).join(', ');
}

/* ============================ BẢN TIN NGÀY ============================ */

function banTinNgay_(ngay, D) {
  D = D || napDuLieu_();
  var T = traCuu_(D), hn = homNay_();
  ngay = ngay || ngayGanNhat_(D, hn);
  if (!ngay) return 'Không có số liệu sản xuất trong 10 ngày qua.';
  var H = tongHop_(D, T, ngay, ngay);
  var Q = tongHop_(D, T, congNgay_(ngay, -14), congNgay_(ngay, -1)); // để so sánh: TB các ngày trước
  var tg = tong_(H.X), tq = tong_(Q.X);
  var out = ['📊 BẢN TIN SẢN XUẤT', tenNgay_(ngay), '(cách tính như web app KPI · dòng đã chốt · cập nhật ' + Utilities.formatDate(new Date(), TZ, 'HH:mm dd/MM') + ')', ''];

  if (!tg.dong) {
    var tt = demTrangThai_(D, ngay);
    out.push('Chưa có dòng nào "Đã chốt" cho ngày này.' + (tt ? '\nCác dòng đang có: ' + tt + '.' : ''));
  } else {
    out = out.concat(dongXuong_(H, Q, T, 'TB 14 ngày trước'));
  }

  var ly = Object.keys(H.dungLyDo).sort(function (a, b) { return H.dungLyDo[b].gio - H.dungLyDo[a].gio; }).slice(0, 3);
  if (ly.length) {
    out.push('', '⏸ DỪNG MÁY NHIỀU NHẤT');
    ly.forEach(function (k) {
      var L = H.dungLyDo[k];
      var xs = Object.keys(L.xuong).sort(function (a, b) { return L.xuong[b] - L.xuong[a]; }).slice(0, 2)
        .map(function (x) { return (T.tenXuong[x] || x).replace(/^Xưởng /, '') + ' ' + gio_(L.xuong[x]); });
      out.push('• ' + k + ': ' + gio_(L.gio) + ' (' + xs.join(', ') + ')');
    });
  }

  var kcs = kcsNgay_(D, T, ngay);
  if (kcs.tong) {
    out.push('', '🔍 KCS: ' + so0_(kcs.tong) + ' sp không đạt' + (kcs.xuong.length ? ' (' + kcs.xuong.join(', ') + ')' : '') +
      (kcs.loi ? '\n   Lỗi nhiều nhất: ' + kcs.loi : ''));
  }

  var nghi = nghiNgay_(D, ngay);
  if (nghi.tong || nghi.muon) out.push('', '🧍 Nghỉ: ' + nghi.tong + ' người' + (nghi.chiTiet ? ' (' + nghi.chiTiet + ')' : '') +
    (nghi.muon ? '\n   Đi muộn / làm nửa ngày: ' + nghi.muon + ' người' : ''));

  var cy = [];
  if (tg.cho) {
    var xc = Object.keys(H.X).filter(function (k) { return H.X[k].cho; }).sort(function (a, b) { return H.X[b].cho - H.X[a].cho; })
      .map(function (k) { return (T.tenXuong[k] || k).replace(/^Xưởng /, '') + ' ' + H.X[k].cho; });
    cy.push(tg.cho + ' dòng còn chờ duyệt (' + xc.join(', ') + ')');
  }
  var ck = Object.keys(tg.chuaKhai).length;
  if (ck) {
    var xk = Object.keys(H.X).filter(function (k) { return Object.keys(H.X[k].chuaKhai).length; })
      .map(function (k) { return (T.tenXuong[k] || k).replace(/^Xưởng /, '') + ' ' + Object.keys(H.X[k].chuaKhai).length; });
    cy.push(ck + ' người đi làm nhưng chưa có sản lượng đã chốt (' + xk.join(', ') + ')');
  }
  var chuaXN = chuaDiemDanh_(D, T, ngay);
  if (chuaXN.length) cy.push('Chưa xác nhận điểm danh: ' + chuaXN.join(', '));
  var tre = nhapTre_(D, ngay);
  if (tre) cy.push(tre + ' lượt bị phạt nhập trễ (ghi nhận ngày ' + ngay.slice(8) + '/' + ngay.slice(5, 7) + ')');
  if (cy.length) { out.push('', '⚠ CẦN CHÚ Ý'); cy.forEach(function (s) { out.push('• ' + s); }); }

  var may = baoTri_(D, T, hn);
  if (may.length) { out.push('', '🔧 BẢO TRÌ MÁY'); may.forEach(function (s) { out.push('• ' + s); }); }

  out.push('', 'Nhắn "tuần" để xem 7 ngày, "bc 10/10" để xem ngày khác.');
  return out.join('\n');
}

function kcsNgay_(D, T, ngay) {
  var b = D.PhieuKCS, c = b.c, tong = 0, X = {}, L = {};
  b.rows.forEach(function (r) {
    if (ngay_(r[c.Ngay]) !== ngay) return;
    var n = so_(r[c.SoLuongKhongDat]); if (!n) return;
    tong += n;
    var x = xuongCua_(T, D, String(r[c.MaCD]).trim(), String(r[c.MaNV]).trim());
    X[x] = (X[x] || 0) + n;
    var ml = String(r[c.MaLoi]).trim();
    if (ml) L[ml] = (L[ml] || 0) + n;
  });
  var xs = Object.keys(X).sort(function (a, b) { return X[b] - X[a]; }).slice(0, 4)
    .map(function (k) { return (T.tenXuong[k] || k).replace(/^Xưởng /, '') + ' ' + so0_(X[k]); });
  var lk = Object.keys(L).sort(function (a, b) { return L[b] - L[a]; })[0];
  return { tong: tong, xuong: xs, loi: lk ? (T.tenLoi[lk] || lk) + ' (' + so0_(L[lk]) + ')' : '' };
}

/** Người nghỉ (giờ có mặt = 0) và đi muộn / nửa ngày, theo ký hiệu chấm công. */
function nghiNgay_(D, ngay) {
  var b = D.DiemDanhNghi, c = b.c, nghi = {}, ly = {}, it = {};
  b.rows.forEach(function (r) {
    if (ngay_(r[c.Ngay]) !== ngay) return;
    var m = String(r[c.MaNV]).trim();
    if (!m || nghi[m] || it[m]) return;
    if (gioCoMat_(kyHieu_(r, c)) > 0) { it[m] = 1; return; }
    nghi[m] = 1;
    var l = String(r[c.LyDo] || '').trim() || kyHieu_(r, c);
    ly[l] = (ly[l] || 0) + 1;
  });
  return {
    tong: Object.keys(nghi).length, muon: Object.keys(it).length,
    chiTiet: Object.keys(ly).sort(function (a, b) { return ly[b] - ly[a]; }).map(function (k) { return k + ' ' + ly[k]; }).join(', ')
  };
}

function nhapTre_(D, ngay) {
  var b = D.PhatNhapTre, c = b.c, n = 0;
  if (c.ThoiDiemPhat === undefined) return 0;
  b.rows.forEach(function (r) { if (ngay_(r[c.ThoiDiemPhat]) === ngay) n++; });
  return n;
}

/** Máy chưa thanh lý có hạn bảo trì trong 7 ngày tới hoặc đã quá hạn. */
function baoTri_(D, T, hn) {
  var b = D.MayMoc, c = b.c, han = congNgay_(hn, 7), ds = [];
  b.rows.forEach(function (r) {
    if (/thanh lý|ngừng/i.test(String(r[c.TinhTrang]))) return;
    var d = ngay_(r[c.BaoTriKeTiep]);
    if (!d || d > han) return;
    ds.push({ d: d, s: String(r[c.MaMay]).trim() + ' ' + String(r[c.TenMay]).trim() + ' (' + (T.tenXuong[String(r[c.MaXuong]).trim()] || r[c.MaXuong]) + ')' });
  });
  ds.sort(function (a, b) { return a.d < b.d ? -1 : 1; });
  var out = ds.slice(0, 6).map(function (x) {
    var n = Math.round((Date.parse(x.d) - Date.parse(hn)) / 864e5);
    return x.s + ': ' + (n < 0 ? 'QUÁ HẠN ' + (-n) + ' ngày' : n === 0 ? 'hôm nay' : 'còn ' + n + ' ngày');
  });
  if (ds.length > 6) out.push('… và ' + (ds.length - 6) + ' máy khác');
  return out;
}

/** Phần "Toàn nhà máy" + "Theo xưởng" dùng chung cho bản tin ngày và tuần. */
function dongXuong_(H, Q, T, soVoi) {
  var tg = tong_(H.X), tq = tong_(Q.X), p = pt_(tg), pq = pt_(tq), out = [];
  var cl = tg.sl > 0 ? (tg.sl - tg.loi) / tg.sl * 100 : null;
  out.push('🏭 Toàn nhà máy: hiệu suất ' + (p == null ? '—' : Math.round(p) + '%' + lech_(p, pq)) +
    (cl != null && tg.loi ? ' · đạt chất lượng ' + (Math.round(cl * 10) / 10).toString().replace('.', ',') + '%' : '') +
    '\n   ' + Object.keys(tg.nguoi).length + ' người · ' + gio_(tg.mau) + ' có mặt · ' + gio_(tg.dung) + ' dừng');
  if (pq != null) out.push('   (▲▼ so với ' + soVoi + ': ' + Math.round(pq) + '%)');
  out.push('', 'THEO XƯỞNG (hiệu suất · người · giờ dừng)');
  Object.keys(H.X).filter(function (k) { return H.X[k].mau; })
    .sort(function (a, b) { return (pt_(H.X[b]) || -1) - (pt_(H.X[a]) || -1); })
    .forEach(function (k) {
      var o = H.X[k], q = Q.X[k], pk = pt_(o);
      out.push('• ' + (T.tenXuong[k] || k) + ': ' + Math.round(pk) + '%' + lech_(pk, q && pt_(q)) +
        ' · ' + Object.keys(o.nguoi).length + ' người' + (o.dung ? ' · dừng ' + gio_(o.dung) : ''));
    });
  return out;
}

/** Xưởng đang dùng chưa xác nhận điểm danh ngày đó (bỏ ngày lễ / miễn trừ). */
function chuaDiemDanh_(D, T, ngay) {
  var I = chiMuc_(D, T), le = D.NgayLe, mt = D.MienTruDiemDanh, boQua = {};
  var leChung = le.rows.some(function (r) {
    if (ngay_(r[le.c.Ngay]) !== ngay) return false;
    var x = String(r[le.c.MaXuong] || '').trim();
    if (x) { boQua[x] = 1; return false; }
    return true;
  });
  if (leChung) return [];
  mt.rows.forEach(function (r) { if (ngay_(r[mt.c.Ngay]) === ngay) boQua[String(r[mt.c.MaXuong]).trim()] = 1; });
  return T.xuongDung.filter(function (x) {
    return !boQua[x] && !I.xn[x + '|' + ngay] && Object.keys(D.nvCon).some(function (nv) { return D.nvXuong[nv] === x; });
  }).map(function (x) { return T.tenXuong[x] || x; });
}

/* ============================ TỔNG KẾT TUẦN ============================ */

function banTinTuan_(D) {
  D = D || napDuLieu_();
  var T = traCuu_(D), hn = homNay_();
  var den = congNgay_(hn, -1), tu = congNgay_(hn, -7);
  var H = tongHop_(D, T, tu, den), Q = tongHop_(D, T, congNgay_(tu, -7), congNgay_(tu, -1));
  var tg = tong_(H.X), tq = tong_(Q.X);
  var f = function (s) { return s.slice(8) + '/' + s.slice(5, 7); };
  var out = ['📈 TỔNG KẾT 7 NGÀY ' + f(tu) + ' → ' + f(den), '(' + H.soNgay + ' ngày có sản xuất · so với 7 ngày trước đó)', ''];
  if (!tg.dong) return out.concat(['Chưa có dòng nào "Đã chốt".']).join('\n');
  out = out.concat(dongXuong_(H, Q, T, '7 ngày trước đó'));
  var ly = Object.keys(H.dungLyDo).sort(function (a, b) { return H.dungLyDo[b].gio - H.dungLyDo[a].gio; }).slice(0, 3);
  if (ly.length) {
    out.push('', '⏸ LÝ DO DỪNG MÁY NHIỀU NHẤT');
    ly.forEach(function (k) { out.push('• ' + k + ': ' + gio_(H.dungLyDo[k].gio)); });
  }
  if (tg.cho) out.push('', '⚠ Còn ' + tg.cho + ' dòng chờ duyệt trong tuần.');
  return out.join('\n');
}
