/* ===== 16/11 khuya (chủ dự án chốt) – GIAI ĐOẠN 0: HỦY / BỚT MÃ ĐƠN HÀNG TRÊN WEB =====
   - Nơi lưu = Sheet riêng "CSDL Đơn hàng (web)" do web tự tạo lần đầu (SpreadsheetApp.create, id ở ScriptProperties DH_CSDL_ID).
     Tab DongHuy (lớp phủ hủy / bớt), SuKien (sổ mọi thao tác), ThongBao (mỗi tài khoản đã xem tới lúc nào).
   - Sheet "Trạng thái đơn hàng" cũ: CHỈ tô xám nền dòng đã hủy (lưu màu cũ, hoàn tác trả lại). Không đổi chữ / số.
   - Web tính = dữ liệu Sheet cũ + lớp phủ: dòng HỦY bỏ khỏi mọi phép tính (bảng, ETA, thống kê, bản chụp, email, tab ĐẾN HẠN 10 NGÀY);
     BỚT -> SL mới thay SL đặt (còn thiếu giảm tương ứng). Áp ở dhDocDon_ nên mọi chỗ đọc đơn đều đã trừ.
   - Khớp dòng theo tab + mã đơn + tên SP (+ thứ tự nếu trùng) = dhKhoaDs_, KHÔNG theo số dòng. Lớp phủ không khớp dòng nào = "mồ côi":
     hiện cảnh báo ở mục Đơn đã hủy, không áp sang dòng khác.
   - Quyền: C019 / C056 / C067 (mã NV gắn đúng 1 tài khoản đang dùng) + chủ sở hữu. Bắt buộc lý do; có hoàn tác (cũng phải ghi lý do).
   Kiểm thử: tests/huy-don.js */
var DH_HUY_NV = ['C019', 'C056', 'C067'];   // C019 Giám đốc · C056 Phó GĐ SX · C067 chị Kim Loan (C077 KHÔNG có quyền này) – hằng riêng, không dùng chung DH_UU_NV
var DHH_TEN = 'CSDL Đơn hàng (web)', DHH_PROP = 'DH_CSDL_ID', DHH_CACHE = 'DH_HUY_v1', DHH_XAM = '#d9d9d9', DHH_VANG = '#fff2cc';   // 17/11: vàng nhạt = TẠM DỪNG
var DHH_MAU = { HUY: DHH_XAM, DUNG: DHH_VANG }, DHH_DUNG_LAU = 14;   // 17/11: tạm dừng quá 14 ngày -> nhắc
var DHH_LY_MIN = 5, DHH_LY_MAX = 200, DHH_DON_MAX = 50, DHH_GIO_MAX = 30, DHH_WEB_MAX = 300;
var DHH_COT = {
  DongHuy: ['Id', 'MaDong', 'Tab', 'MaDon', 'Ten', 'Loai', 'SLCu', 'SLMoi', 'LyDo', 'Ai', 'Tk', 'MaNV', 'Luc', 'TienDo', 'MauCu', 'DongSheet', 'TrangThai', 'Nhom', 'NguoiHoanTac', 'TkHoanTac', 'LucHoanTac', 'LyDoHoanTac', 'Hen'],   // 17/11: Hen = dự kiến chạy lại (TẠM DỪNG)
  SuKien: ['Luc', 'Ai', 'Tk', 'MaNV', 'ThaoTac', 'Id', 'MaDong', 'ChiTiet', 'Lenh'],
  ThongBao: ['Tk', 'DaXemDen']
};
function dhCoHuy_(me) {
  if (!me) return false;
  if (me.laOwner) return true;
  var ma = String(me.maNV || '').trim().toUpperCase(); if (DH_HUY_NV.indexOf(ma) < 0) return false;
  return doc_('TaiKhoan').filter(function(t) { return String(t.MaNV || '').trim().toUpperCase() === ma && String(t.TrangThai).trim() === 'Đang dùng'; }).length === 1;
}
function dhhGio_() { return Utilities.formatDate(new Date(), TZ_VN, 'yyyy-MM-dd HH:mm:ss'); }
function dhhLy_(v) {   // lý do: bỏ ký tự điều khiển, gộp khoảng trắng, 5–200 ký tự
  var s = String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (s.length < DHH_LY_MIN) return { loi: 'Ghi lý do (ít nhất ' + DHH_LY_MIN + ' ký tự).' };
  if (s.length > DHH_LY_MAX) return { loi: 'Lý do tối đa ' + DHH_LY_MAX + ' ký tự.' };
  return { s: s };
}
/* Sheet riêng: tạo lần đầu (gọi trong khóa). id có mà mở không được (file bị xóa / mất quyền) -> báo lỗi, KHÔNG tự tạo file mới (giữ lịch sử hủy) */
function dhhSS_(tao) {
  var p = PropertiesService.getScriptProperties(), id = p.getProperty(DHH_PROP);
  if (id) return SpreadsheetApp.openById(id);
  if (!tao) return null;
  var ss = SpreadsheetApp.create(DHH_TEN);   // chỉ chủ sở hữu (tài khoản chạy web) thấy – không chia sẻ thêm
  Object.keys(DHH_COT).forEach(function(t, i) {
    var sh = i === 0 ? ss.getSheets()[0] : ss.insertSheet(t);
    if (i === 0) sh.setName(t);
    try { sh.getRange(2, 1, 999, DHH_COT[t].length).setNumberFormat('@'); } catch (e) {}   // mọi ô là chữ: không bị Sheet đổi thành ngày / công thức
    sh.getRange(1, 1, 1, DHH_COT[t].length).setValues([DHH_COT[t]]);
    try { sh.setFrozenRows(1); sh.getRange(1, 1, 1, DHH_COT[t].length).setFontWeight('bold'); } catch (e) {}
  });
  p.setProperty(DHH_PROP, ss.getId());
  return ss;
}
function dhhDoc_(ss, t) {
  var sh = ss && ss.getSheetByName(t); if (!sh) return [];
  var nr = sh.getLastRow(), nc = DHH_COT[t].length; if (nr < 2) return [];
  var v = sh.getRange(1, 1, nr, nc).getValues(), h = v[0].map(function(x) { return String(x); });
  return v.slice(1).map(function(r, i) { var o = { _row: i + 2 }; h.forEach(function(k, j) { var x = r[j]; o[k] = x == null ? '' : String(x).replace(/^'/, ''); }); return o; });
}
function dhhThem_(ss, t, ds) {
  if (!ds.length) return;
  var sh = ss.getSheetByName(t), c = DHH_COT[t];
  if (!sh) { sh = ss.insertSheet(t); sh.getRange(1, 1, 1, c.length).setValues([c]); }
  else if (sh.getLastColumn() < c.length) sh.getRange(1, 1, 1, c.length).setValues([c]);   // 17/11: thêm cột mới vào cuối (vd Hen) – sửa dòng tiêu đề
  sh.getRange(sh.getLastRow() + 1, 1, ds.length, c.length).setNumberFormat('@')
    .setValues(ds.map(function(o) { return c.map(function(k) { return chuAnToan_(o[k] == null ? '' : String(o[k])); }); }));
}
function dhhSua_(ss, t, row, o) {
  var sh = ss.getSheetByName(t), c = DHH_COT[t];
  Object.keys(o).forEach(function(k) { var j = c.indexOf(k); if (j >= 0) sh.getRange(row, j + 1).setNumberFormat('@').setValue(chuAnToan_(String(o[k] == null ? '' : o[k]))); });
}
/* Lớp phủ (mọi bản ghi DongHuy) – nhớ tạm 5 phút, xóa ngay khi có người hủy / hoàn tác */
function dhhPhu_(lamMoi) {
  var c = CacheService.getScriptCache();
  if (!lamMoi) { try { var s = c.get(DHH_CACHE); if (s) return JSON.parse(s); } catch (e) {} }
  var ss = dhhSS_(false), ds = ss ? dhhDoc_(ss, 'DongHuy') : [];
  try { var z = JSON.stringify(ds); if (z.length < 95000) c.put(DHH_CACHE, z, DH_CACHE_GIAY); } catch (e) {}
  return ds;
}
function dhhXoaCache_() { try { CacheService.getScriptCache().remove(DHH_CACHE); } catch (e) {} }
function dhhSo_(v) { var n = Number(v); return isFinite(n) ? n : 0; }
/* BỚT: SL mới thay SL đặt; còn thiếu giảm đúng phần bớt; số đã giao từng bộ phận không vượt SL mới. Sheet đã sửa SL ≤ SL mới -> giữ số Sheet */
function dhApBot_(o, x) {
  var c = {}; for (var k in o) c[k] = o[k];
  var moi = dhhSo_(x.SLMoi);
  c.bot = { cu: dhhSo_(x.SLCu), moi: moi, ly: x.LyDo, ai: x.Ai, luc: x.Luc };
  if (!(moi > 0) || o.sl <= moi) { c.bot.daKhop = 1; return c; }
  var giam = o.sl - moi; c.slGoc = o.sl; c.sl = moi; c.thieu = Math.max(0, (o.thieu || 0) - giam);
  c.quaGoc = o.qua || {}; if (o.p2) c.p2Goc = o.p2;   // số gốc trong Sheet – web gửi kèm khi nhập để máy chủ so đúng ô (không báo xung đột giả)
  c.qua = {}; Object.keys(o.qua || {}).forEach(function(k) { c.qua[k] = Math.min(moi, o.qua[k]); });
  if (o.p2) { c.p2 = {}; Object.keys(o.p2).forEach(function(k) { var v = o.p2[k]; c.p2[k] = typeof v === 'number' ? Math.min(moi, v) : v; }); }
  return c;
}
function dhApPhu_(d, phu) {
  var out = {}; for (var k in d) out[k] = d[k];
  out.huyKhop = {}; out.phuDs = phu || [];
  var hl = (phu || []).filter(function(x) { return x.TrangThai === 'HIEU_LUC'; }); if (!hl.length) return out;
  var m = {}, md = {}; hl.forEach(function(x) { if (x.Loai === 'DUNG') md[String(x.MaDong)] = x; else m[String(x.MaDong)] = x; });   // 17/11: TẠM DỪNG là lớp riêng (một mã có thể vừa bớt vừa tạm dừng)
  var ks = dhKhoaDs_(d.don), huy3 = {}, huy2 = {}, don = [];
  d.don.forEach(function(o, i) {
    var x = m[ks[i]], z = md[ks[i]], o2 = o;
    if (x) {
      out.huyKhop[x.Id] = 1;
      if (x.Loai === 'HUY') { huy3[(o.maDon || '') + '|' + o.ten + '|' + o.tab] = 1; huy2[(o.maDon || '') + '|' + o.ten] = 1; return; }
      o2 = dhApBot_(o, x);
    }
    if (z) {   /* TẠM DỪNG: vẫn hiện, nhập số được; không tính vào công suất / ngày dự kiến / trễ hạn / tab 10 ngày / hạn chuẩn / email */
      out.huyKhop[z.Id] = 1;
      var c = {}; for (var k in o2) c[k] = o2[k];
      c.dung = { id: z.Id, nhom: z.Nhom || '', ly: z.LyDo, ai: z.Ai, luc: z.Luc, hen: z.Hen || '' }; if (c.thieu > 0) c.st = 'tamDung';
      o2 = c;
    }
    don.push(o2);
  });
  out.don = don;
  out.uu = (d.uu || []).filter(function(o) { return !huy3[(o.maDon || '') + '|' + o.ten + '|' + o.tab]; });   // tab ĐƠN ƯU TIÊN = bản chép (tab đã ánh xạ về kênh)
  var tp = {}; Object.keys(d.tabPhu || {}).forEach(function(t) { tp[t] = (d.tabPhu[t] || []).filter(function(o) { return !huy2[(o.maDon || '') + '|' + o.ten]; }); });
  out.tabPhu = tp;
  return out;
}
/* Mọi chỗ đọc đơn (bảng, bản chụp, email, thống kê, tab 10…) đi qua đây -> đã trừ dòng hủy / áp SL bớt */
function dhDocDon_(lamMoi) {
  var d = dhDocDonGoc_(lamMoi), phu;
  try { phu = dhhPhu_(lamMoi); } catch (e) { var o = {}; for (var k in d) o[k] = d[k]; o.phuLoi = String(e && e.message || e).slice(0, 200); return o; }
  return dhApPhu_(d, phu);
}
/* Dữ liệu cho web: danh sách đã hủy / bớt (mới nhất trên cùng), cờ mồ côi, chưa xem (thông báo) */
function dhhWeb_(me, d) {
  var ds = (d && d.phuDs) || [], khop = (d && d.huyKhop) || {}, xem = '', tk = String(me && me.tk || '');
  try { var ss = ds.length ? dhhSS_(false) : null; if (ss) dhhDoc_(ss, 'ThongBao').forEach(function(r) { if (r.Tk === tk) xem = r.DaXemDen; }); } catch (e) {}
  var kq = ds.filter(function(x) { return x.TrangThai === 'HIEU_LUC' || x.TrangThai === 'HOAN_TAC'; }).map(function(x) {
    var td = {}; try { td = JSON.parse(x.TienDo || '{}'); } catch (e) {}
    var giu = []; if (td.dn && td.dn.o) giu.push(td.dn.o); Object.keys(td.qua || {}).forEach(function(k) { if (td.qua[k] > 0 && giu.indexOf(k) < 0) giu.push(k); });
    var hl = x.TrangThai === 'HIEU_LUC', ht = !hl;
    return { hen: x.Hen || '', id: x.Id, tab: x.Tab, kenh: DH_NHAN_TAB[x.Tab] || x.Tab, maDon: x.MaDon, ten: x.Ten, loai: x.Loai, slCu: dhhSo_(x.SLCu), slMoi: dhhSo_(x.SLMoi), ly: x.LyDo, ai: x.Ai, luc: x.Luc,
      td: td, giu: giu, hl: hl ? 1 : 0, moCoi: hl && !khop[x.Id] ? 1 : 0, nhom: x.Nhom || '', toi: x.Tk === tk ? 1 : 0,
      htAi: ht ? x.NguoiHoanTac : '', htLuc: ht ? x.LucHoanTac : '', htLy: ht ? x.LyDoHoanTac : '',
      moi: ((x.Luc > xem && x.Tk !== tk) || (ht && x.LucHoanTac > xem && x.TkHoanTac !== tk)) ? 1 : 0 };
  });
  kq.sort(function(a, b) { return String(b.htLuc || b.luc).localeCompare(String(a.htLuc || a.luc)); });
  return { ds: kq.slice(0, DHH_WEB_MAX), quyen: dhCoHuy_(me) ? 1 : 0, xem: xem, loi: (d && d.phuLoi) || '' };
}
function dhhNen_(a) { var o = []; (a || []).forEach(function(c) { c = String(c || '').toLowerCase(); if (!/^#[0-9a-f]{6}$/.test(c)) c = '#ffffff'; var z = o[o.length - 1]; if (z && z[0] === c) z[1]++; else o.push([c, 1]); }); return o; }   // nén màu nền: [[màu, số ô liền nhau]]
function dhhMo_(a) { var o = []; (a || []).forEach(function(z) { var c = String(z && z[0] || ''); if (!/^#[0-9a-f]{6}$/i.test(c)) c = '#ffffff'; for (var i = 0; i < Math.min(500, Number(z && z[1]) || 0); i++) o.push(c); }); return o; }
function dhhRateOk_(ss, tk) {   // tối đa 30 lần hủy / bớt / hoàn tác mỗi giờ mỗi người (chống bấm loạn / kịch bản)
  var moc = Utilities.formatDate(new Date(new Date().getTime() - 3600000), TZ_VN, 'yyyy-MM-dd HH:mm:ss');
  return dhhDoc_(ss, 'SuKien').filter(function(r) { return r.Tk === tk && r.Luc >= moc; }).length < DHH_GIO_MAX;
}
function dhhLenh_(p) { var l = String(p && p.lenh || ''); return /^[A-Za-z0-9_-]{6,40}$/.test(l) ? l : ''; }

/* p = { loai: 'HUY' | 'BOT' | 'HUY_DON' | 'DUNG' | 'DUNG_DON' (17/11 tạm dừng mã / cả đơn), tab, dong, ten, maDon, slMoi (BOT), hen (DUNG, tùy chọn), lyDo, lenh } */
function huyBotDon(token, p) {
  var q = dhQuyenDon_(token); if (q.loi) return q.loi;
  if (!dhCoHuy_(q.me)) return sach_({ ok: false, msg: 'Chỉ Giám đốc (C019), Phó GĐ sản xuất (C056) và chị Kim Loan (C067) được hủy / bớt mã.' });
  p = p || {};
  var loai = String(p.loai || ''); if (['HUY', 'BOT', 'HUY_DON', 'DUNG', 'DUNG_DON'].indexOf(loai) < 0) return sach_({ ok: false, msg: 'Thao tác không hợp lệ.' });
  var laDung = loai === 'DUNG' || loai === 'DUNG_DON', caDon = loai === 'HUY_DON' || loai === 'DUNG_DON', hen = String(p.hen || '').trim();
  if (laDung && hen && (!dhNgayThat_(hen) || hen < homNayVN_() || hen > dhCongNgay_(homNayVN_(), 366))) return sach_({ ok: false, msg: 'Ngày dự kiến chạy lại không hợp lệ (từ hôm nay đến 1 năm).' });
  if (!laDung) hen = '';
  var ly = dhhLy_(p.lyDo); if (ly.loi) return sach_({ ok: false, msg: ly.loi });
  var tab = String(p.tab || '').trim().slice(0, 60), dong = Number(p.dong), ten = String(p.ten || '').replace(/\s+/g, ' ').trim();
  if (!tab || DH_TAB_LOAI.test(tab) || !(dong >= 2 && dong <= DH_TAB_MOI_DONG && Math.floor(dong) === dong) || !ten) return sach_({ ok: false, msg: 'Dòng không hợp lệ.' });
  var slMoi = Number(p.slMoi);
  if (loai === 'BOT' && !(slMoi >= 1 && Math.floor(slMoi) === slMoi)) return sach_({ ok: false, msg: 'SL mới phải là số nguyên từ 1 trở lên (muốn bỏ hết thì bấm Hủy mã này).' });
  var lenh = dhhLenh_(p), cache = CacheService.getScriptCache();
  if (lenh) { try { var cu = cache.get('DHH_L_' + lenh); if (cu) return sach_(JSON.parse(cu)); } catch (e) {} }
  var lock = LockService.getScriptLock();
  try { lock.waitLock(20000); } catch (eL) { return sach_({ ok: false, msg: 'Đang có người lưu – thử lại sau vài giây.' }); }
  try {
    if (lenh) { try { var cu2 = cache.get('DHH_L_' + lenh); if (cu2) return sach_(JSON.parse(cu2)); } catch (e) {} }
    var dg = dhDocDonGoc_(false), ks = dhKhoaDs_(dg.don), i0 = -1;
    dg.don.forEach(function(o, i) { if (i0 < 0 && !o.phu && o.tab === tab && o.dong === dong) i0 = i; });
    var o0 = i0 >= 0 ? dg.don[i0] : null;
    if (!o0 || o0.ten !== ten || (p.maDon != null && String(p.maDon) !== String(o0.maDon || ''))) return sach_({ ok: false, cu: true, msg: 'Dòng này vừa đổi trong Sheet – bấm Làm mới rồi thử lại.' });
    var ssDH = SpreadsheetApp.openById(DH_SHEET_ID), sh = dhTabGhi_(ssDH, tab), meta = sh ? dhMetaTab_(sh, tab) : null;
    if (!sh || !meta || DH_TAB_LOAI.test(String(sh.getName()).trim())) return sach_({ ok: false, msg: 'Chỉ hủy / bớt được ở tab kênh đơn hàng.' });
    var ds = caDon ? dg.don.map(function(o, i) { return [o, i]; }).filter(function(z) { return !z[0].phu && z[0].tab === tab && (z[0].maDon || '') === (o0.maDon || ''); }) : [[o0, i0]];
    if (caDon && (!o0.maDon || o0.maDon === '(không mã)')) return sach_({ ok: false, msg: 'Dòng không có mã đơn – ' + (laDung ? 'tạm dừng' : 'hủy') + ' từng mã.' });
    if (loai === 'DUNG' && !(o0.thieu > 0)) return sach_({ ok: false, msg: 'Mã này đã làm xong – không cần tạm dừng.' });
    if (ds.length > DHH_DON_MAX) return sach_({ ok: false, msg: 'Đơn có ' + ds.length + ' mã – ' + (laDung ? 'tạm dừng' : 'hủy') + ' cả đơn tối đa ' + DHH_DON_MAX + ' mã một lần.' });
    /* đọc lại đúng các dòng trong Sheet: tên SP + SL đặt phải khớp (Sheet vừa chèn / xóa dòng -> từ chối, không tô nhầm) */
    var nr = sh.getLastRow(), dMax = Math.max.apply(null, ds.map(function(z) { return z[0].dong; }));
    if (dMax > nr) return sach_({ ok: false, cu: true, msg: 'Dòng này vừa đổi trong Sheet – bấm Làm mới rồi thử lại.' });
    var khoi = sh.getRange(1, 1, dMax, Math.max(meta.ten, meta.sl) + 1).getValues();
    var lech = ds.filter(function(z) { var r = khoi[z[0].dong - 1] || []; return String(r[meta.ten] == null ? '' : r[meta.ten]).replace(/\s+/g, ' ').trim() !== z[0].ten || dhSo_(r[meta.sl]) !== z[0].sl; });
    if (lech.length) return sach_({ ok: false, cu: true, msg: 'Sheet vừa đổi ở dòng ' + lech[0][0].dong + ' – bấm Làm mới rồi thử lại.' });
    var ss = dhhSS_(true), tatCa = dhhDoc_(ss, 'DongHuy'), hl = {}, daHuy = {};
    tatCa.forEach(function(x) { if (x.TrangThai !== 'HIEU_LUC') return; if (x.Loai === 'HUY') daHuy[x.MaDong] = x; if ((x.Loai === 'DUNG') === laDung) hl[x.MaDong] = x; });   // 17/11: tạm dừng là lớp riêng, không thay bản bớt
    if (!dhhRateOk_(ss, String(q.me.tk || ''))) return sach_({ ok: false, msg: 'Bạn đã thao tác ' + DHH_GIO_MAX + ' lần trong 1 giờ – thử lại sau.' });
    var gio = dhhGio_(), nhom = caDon ? 'D' + Utilities.getUuid().replace(/-/g, '').slice(0, 10) : '', moi = [], thay = [], boQua = 0, canhBao = '';
    for (var j = 0; j < ds.length; j++) {
      var o = ds[j][0], k = ks[ds[j][1]], cu3 = hl[k];
      if (cu3 && cu3.Loai === 'HUY') { if (loai === 'HUY_DON') { boQua++; continue; } return sach_({ ok: false, msg: 'Mã này đã hủy trước đó (' + cu3.Ai + ' · ' + cu3.Luc + ').' }); }
      if (laDung) {
        if (daHuy[k] || cu3 || !(o.thieu > 0)) { if (loai === 'DUNG_DON') { boQua++; continue; } return sach_({ ok: false, msg: daHuy[k] ? 'Mã này đã hủy.' : cu3 ? 'Mã này đang tạm dừng (' + cu3.Ai + ' · ' + cu3.Luc + ').' : 'Mã này đã làm xong.' }); }
      }
      if (loai === 'BOT') {
        var nen = cu3 ? dhhSo_(cu3.SLMoi) : o.sl;
        if (slMoi >= o.sl) return sach_({ ok: false, msg: 'SL mới phải nhỏ hơn SL đặt trong Sheet (' + o.sl + ').' });
        if (cu3 && slMoi === nen) return sach_({ ok: false, msg: 'Mã này đã bớt còn ' + nen + ' rồi.' });
      }
      if (cu3) thay.push(cu3);
      var td = { thieu: o.thieu, qua: o.qua || {}, hong: o.hong || {}, giao: o.giao || 0, kho: o.kho || 0, daTra: o.daTra || 0, dl: o.dl || '', dn: o.dn ? { o: o.dn.o || '', k: o.dn.k || '' } : {}, p2: o.p2 || null };
      moi.push({ o: o, rec: { Id: 'H' + Utilities.getUuid().replace(/-/g, '').slice(0, 12), MaDong: k, Tab: tab, MaDon: o.maDon || '', Ten: o.ten, Loai: loai === 'BOT' ? 'BOT' : laDung ? 'DUNG' : 'HUY', SLCu: o.sl, SLMoi: loai === 'BOT' ? slMoi : 0, Hen: hen,
        LyDo: ly.s, Ai: String(q.me.ten || q.me.tk || '').slice(0, 60), Tk: String(q.me.tk || ''), MaNV: String(q.me.maNV || ''), Luc: gio, TienDo: JSON.stringify(td).slice(0, 4000), MauCu: '', DongSheet: o.dong, TrangThai: 'HIEU_LUC', Nhom: nhom } });
    }
    if (!moi.length) return sach_({ ok: false, msg: laDung ? 'Mọi mã của đơn này đã tạm dừng, đã hủy hoặc đã làm xong.' : 'Mọi mã của đơn này đã hủy trước đó.' });
    /* tô xám dòng HỦY trên Sheet cũ (chỉ màu nền), lưu màu cũ để hoàn tác. Dòng đang BỚT bị thay bằng HỦY thì giữ nguyên màu cũ của nó */
    var nc = Math.max(1, Math.min(sh.getLastColumn(), 300));
    moi.forEach(function(z) {
      var mau = DHH_MAU[z.rec.Loai]; if (!mau) return;   // HỦY tô xám, TẠM DỪNG tô vàng nhạt (17/11)
      try { var rg = sh.getRange(z.o.dong, 1, 1, nc); z.rec.MauCu = JSON.stringify(dhhNen_(rg.getBackgrounds()[0])); rg.setBackground(mau); }
      catch (eM) { canhBao = ' (chưa tô màu được dòng trong Sheet: ' + String(eM && eM.message || eM).slice(0, 80) + ')'; }
    });
    thay.forEach(function(x) { dhhSua_(ss, 'DongHuy', x._row, { TrangThai: 'THAY_THE', LucHoanTac: gio }); });
    dhhThem_(ss, 'DongHuy', moi.map(function(z) { return z.rec; }));
    dhhThem_(ss, 'SuKien', [{ Luc: gio, Ai: moi[0].rec.Ai, Tk: moi[0].rec.Tk, MaNV: moi[0].rec.MaNV, ThaoTac: loai, Id: moi.map(function(z) { return z.rec.Id; }).join(',').slice(0, 2000), MaDong: moi.map(function(z) { return z.rec.MaDong; }).join(' ; ').slice(0, 4000),
      ChiTiet: JSON.stringify({ ly: ly.s, slMoi: loai === 'BOT' ? slMoi : null, n: moi.length, boQua: boQua, thay: thay.map(function(x) { return x.Id; }) }).slice(0, 4000), Lenh: lenh }]);
    dhhXoaCache_();
    try { PropertiesService.getScriptProperties().setProperty('DH10_CAN_TAO', '1'); } catch (e) {}   // tab ĐẾN HẠN 10 NGÀY dựng lại ở lượt đồng bộ 10 phút kế tiếp
    try { ghiLog_(q.me, { BOT: 'Bớt SL mã đơn', HUY_DON: 'Hủy cả đơn', HUY: 'Hủy mã đơn', DUNG: 'Tạm dừng mã đơn', DUNG_DON: 'Tạm dừng cả đơn' }[loai], (tab + ' · ' + (o0.maDon || '') + ' · ' + (caDon ? moi.length + ' mã' : o0.ten)).slice(0, 200), loai === 'BOT' ? String(o0.sl) : '', (loai === 'BOT' ? slMoi + ' · ' : '') + ly.s.slice(0, 120)); } catch (e) {}
    var kq = { ok: true, n: moi.length, ids: moi.map(function(z) { return z.rec.Id; }), nhom: nhom,
      msg: (loai === 'DUNG' ? 'Đã tạm dừng ' + o0.ten + (hen ? ' (dự kiến chạy lại ' + hen.slice(8, 10) + '/' + hen.slice(5, 7) + ')' : '') : loai === 'DUNG_DON' ? 'Đã tạm dừng cả đơn ' + o0.maDon + ' (' + moi.length + ' mã' + (boQua ? ', bỏ qua ' + boQua + ' mã đã xong / đã hủy / đang dừng' : '') + ')' : loai === 'BOT' ? 'Đã bớt ' + o0.ten + ' từ ' + o0.sl + ' còn ' + slMoi : loai === 'HUY_DON' ? 'Đã hủy cả đơn ' + o0.maDon + ' (' + moi.length + ' mã' + (boQua ? ', ' + boQua + ' mã đã hủy trước đó' : '') + ')' : 'Đã hủy ' + o0.ten) + '.' + canhBao };
    if (lenh) { try { cache.put('DHH_L_' + lenh, JSON.stringify(kq), 600); } catch (e) {} }
    return sach_(kq);
  } finally { lock.releaseLock(); }
}

/* p = { id } hoặc { nhom } (hoàn tác cả đơn), lyDo bắt buộc. 3 người + chủ sở hữu đều hoàn tác được (người hủy có thể vắng).
   Trả màu cũ chỉ khi dòng còn đúng tên + vẫn đang xám như lúc hủy; ai đã đổi màu dòng thì giữ màu họ đổi, báo lại. */
function hoanTacHuyDon(token, p) {
  var q = dhQuyenDon_(token); if (q.loi) return q.loi;
  if (!dhCoHuy_(q.me)) return sach_({ ok: false, msg: 'Chỉ Giám đốc (C019), Phó GĐ sản xuất (C056) và chị Kim Loan (C067) được hoàn tác.' });
  p = p || {};
  var ly = dhhLy_(p.lyDo); if (ly.loi) return sach_({ ok: false, msg: ly.loi });
  var id = String(p.id || ''), nhom = String(p.nhom || '');
  if (!/^H[0-9a-f]{6,20}$/.test(id) && !/^D[0-9a-f]{6,20}$/.test(nhom)) return sach_({ ok: false, msg: 'Thiếu mã bản ghi.' });
  var lenh = dhhLenh_(p), cache = CacheService.getScriptCache();
  var lock = LockService.getScriptLock();
  try { lock.waitLock(20000); } catch (eL) { return sach_({ ok: false, msg: 'Đang có người lưu – thử lại sau vài giây.' }); }
  try {
    if (lenh) { try { var cu = cache.get('DHH_L_' + lenh); if (cu) return sach_(JSON.parse(cu)); } catch (e) {} }
    var ss = dhhSS_(false); if (!ss) return sach_({ ok: false, msg: 'Chưa có mã nào bị hủy.' });
    var ds = dhhDoc_(ss, 'DongHuy').filter(function(x) { return x.TrangThai === 'HIEU_LUC' && (id ? x.Id === id : x.Nhom === nhom); });
    if (!ds.length) return sach_({ ok: false, msg: 'Bản ghi này đã được hoàn tác hoặc không còn hiệu lực.' });
    if (!dhhRateOk_(ss, String(q.me.tk || ''))) return sach_({ ok: false, msg: 'Bạn đã thao tác ' + DHH_GIO_MAX + ' lần trong 1 giờ – thử lại sau.' });
    var gio = dhhGio_(), ai = String(q.me.ten || q.me.tk || '').slice(0, 60), bao = [];
    var huy = ds.filter(function(x) { return DHH_MAU[x.Loai] && x.MauCu; });   // 17/11: + TẠM DỪNG (vàng)
    if (huy.length) {
      try {
        var ssDH = SpreadsheetApp.openById(DH_SHEET_ID), dg = null;
        huy.forEach(function(x) {
          var sh = dhTabGhi_(ssDH, x.Tab), meta = sh ? dhMetaTab_(sh, x.Tab) : null; if (!sh || !meta) { bao.push(x.Ten + ': không thấy tab'); return; }
          var mau = dhhMo_(JSON.parse(x.MauCu || '[]')); if (!mau.length) return;
          var dong = Number(x.DongSheet), khop = function(d) { if (!(d >= 2) || d > sh.getLastRow()) return false; return String(sh.getRange(d, meta.ten + 1).getValue() || '').replace(/\s+/g, ' ').trim() === x.Ten; };
          if (!khop(dong)) {   // dòng đã dời (Sheet chèn / xóa dòng) -> tìm lại theo khóa
            if (!dg) dg = dhDocDonGoc_(true);
            var ks = dhKhoaDs_(dg.don), i = ks.indexOf(x.MaDong); dong = i >= 0 && dg.don[i].tab === x.Tab ? dg.don[i].dong : 0;
            if (!dong || !khop(dong)) { bao.push(x.Ten + ': không thấy dòng trong Sheet – màu chưa trả'); return; }
          }
          var rg = sh.getRange(dong, 1, 1, mau.length), nay = rg.getBackgrounds()[0];
          if (nay.some(function(c) { return String(c).toLowerCase() !== DHH_MAU[x.Loai]; })) { bao.push(x.Ten + ': dòng đã được đổi màu, giữ màu hiện tại'); return; }
          rg.setBackgrounds([mau]);
        });
      } catch (eM) { bao.push('chưa trả được màu: ' + String(eM && eM.message || eM).slice(0, 80)); }
    }
    ds.forEach(function(x) { dhhSua_(ss, 'DongHuy', x._row, { TrangThai: 'HOAN_TAC', NguoiHoanTac: ai, TkHoanTac: String(q.me.tk || ''), LucHoanTac: gio, LyDoHoanTac: ly.s }); });
    dhhThem_(ss, 'SuKien', [{ Luc: gio, Ai: ai, Tk: String(q.me.tk || ''), MaNV: String(q.me.maNV || ''), ThaoTac: 'HOAN_TAC', Id: ds.map(function(x) { return x.Id; }).join(',').slice(0, 2000), MaDong: ds.map(function(x) { return x.MaDong; }).join(' ; ').slice(0, 4000), ChiTiet: JSON.stringify({ ly: ly.s, bao: bao }).slice(0, 4000), Lenh: lenh }]);
    dhhXoaCache_();
    try { PropertiesService.getScriptProperties().setProperty('DH10_CAN_TAO', '1'); } catch (e) {}
    var chay = ds.every(function(x) { return x.Loai === 'DUNG'; });
    try { ghiLog_(q.me, chay ? 'Chạy lại đơn tạm dừng' : 'Hoàn tác hủy / bớt đơn', (ds[0].Tab + ' · ' + ds[0].MaDon + ' · ' + (ds.length > 1 ? ds.length + ' mã' : ds[0].Ten)).slice(0, 200), '', ly.s.slice(0, 120)); } catch (e) {}
    var kq = { ok: true, n: ds.length, chay: chay ? 1 : 0, msg: (chay ? 'Đã chạy lại ' : 'Đã hoàn tác ') + (ds.length > 1 ? ds.length + ' mã của đơn ' + ds[0].MaDon : ds[0].Ten) + '.' + (bao.length ? ' Lưu ý: ' + bao.join('; ') + '.' : '') };
    if (lenh) { try { cache.put('DHH_L_' + lenh, JSON.stringify(kq), 600); } catch (e) {} }
    return sach_(kq);
  } finally { lock.releaseLock(); }
}

/* Chuông: mở danh sách thông báo = đã xem tới giờ này (chỉ ghi cho tài khoản đang đăng nhập) */
function xemThongBaoHuy(token) {
  var q = dhQuyenDon_(token); if (q.loi) return q.loi;
  var ss = dhhSS_(false); if (!ss) return sach_({ ok: true, xem: '' });
  var lock = LockService.getScriptLock();
  try { lock.waitLock(10000); } catch (eL) { return sach_({ ok: false, msg: 'Đang bận – thử lại sau.' }); }
  try {
    var tk = String(q.me.tk || ''), gio = dhhGio_(), r = dhhDoc_(ss, 'ThongBao').filter(function(x) { return x.Tk === tk; })[0];
    if (r) dhhSua_(ss, 'ThongBao', r._row, { DaXemDen: gio }); else dhhThem_(ss, 'ThongBao', [{ Tk: tk, DaXemDen: gio }]);
    return sach_({ ok: true, xem: gio });
  } finally { lock.releaseLock(); }
}

/* 17/11: nhắc 3 người duyệt – mã TẠM DỪNG đã đến ngày dự kiến chạy lại, hoặc không ghi ngày mà đã dừng quá 14 ngày (gom theo đơn) */
function dhhNhacDung_() {
  var hn = homNayVN_(), don = {}, n = 0;
  (dhhPhu_(false) || []).forEach(function(x) { if (x.TrangThai !== 'HIEU_LUC' || x.Loai !== 'DUNG') return; n++;
    var ngay = Math.floor((Date.parse(hn + 'T00:00:00Z') - Date.parse(String(x.Luc).slice(0, 10) + 'T00:00:00Z')) / 864e5);
    var den = x.Hen ? x.Hen <= hn : ngay >= DHH_DUNG_LAU; if (!den) return;
    var k = x.Tab + '|' + x.MaDon, g = don[k] || (don[k] = { ma: x.MaDon || x.Ten, kenh: DH_NHAN_TAB[x.Tab] || x.Tab, n: 0, ngay: 0, hen: x.Hen || '' }); g.n++; if (ngay > g.ngay) g.ngay = ngay; });
  var ds = Object.keys(don).map(function(k) { return don[k]; }).sort(function(a, b) { return b.ngay - a.ngay; });
  return { tong: n, den: ds.length, ds: ds.slice(0, 5) };
}

