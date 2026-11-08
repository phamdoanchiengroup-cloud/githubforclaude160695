
/* ===== TĂNG TỐC ĐỢT 3 (08/11/2026 – chủ dự án chọn phương án A) =====
   Đo trên dữ liệu thật 07/11: lượt gọi nào cũng đọc cả sheet NhatKySanXuat (19.252 dòng × 16 cột ≈ 308.000 ô, tăng ~7.000 dòng/tháng).
   1) Bộ nhớ đệm nhật ký DÙNG CHUNG giữa các lượt gọi (CacheService, nén gzip, 10 phút). Có ai ghi nhật ký (xoaCache_) là bỏ ngay.
      Lượt đang giữ khóa ghi (khoa_) luôn đọc thẳng sheet – số dòng (_row) để sửa ô phải đúng tuyệt đối.
      Sửa tay trong Google Sheet: chạy XOA_BO_NHO_TAM (như trước) hoặc đợi tối đa 10 phút.
   2) Bộ đo tốc độ: máy chủ gắn __ms (thời gian chạy) vào kết quả; trình duyệt đo cả đường truyền, gửi gộp về ghiTocDo;
      chủ sở hữu xem ở Thống kê › Tốc độ web (layTocDo). Lưu theo ngày trong ScriptProperties, giữ 14 ngày.
   3) Khóa mã hóa bản lưu số liệu trên máy (người dùng tự bật "ghi nhớ trên máy cá nhân"): layKhoaLuu, đổi khóa khi Thoát / đổi mật khẩu. */
var NKD_TEN = 'NhatKySanXuat', NKD_K = 'NKD3', NKD_GIAY = 600, NKD_MANH = 90000;
var __NKD_TT = { trung: 0, truot: 0 };
function nkdMoi_() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function nkdPB_() {
  try { var c = CacheService.getScriptCache(), v = c.get(NKD_K + '_pb'); if (!v) { v = nkdMoi_(); c.put(NKD_K + '_pb', v, 21600); } return v; } catch (e) { return ''; }
}
function nkdBo_() { try { CacheService.getScriptCache().put(NKD_K + '_pb', nkdMoi_(), 21600); } catch (e) {} }
function nkdDung_() { return !__KHOA; }   // đang giữ khóa ghi -> không dùng bản nhớ
function nkdLay_(pb) {
  if (!pb) return null;
  try {
    var c = CacheService.getScriptCache(), m = c.get(NKD_K + '_m');
    if (!m) return null; m = JSON.parse(m); if (m.pb !== pb || !(m.n > 0)) return null;
    var ks = []; for (var i = 0; i < m.n; i++) ks.push(NKD_K + '_' + pb + '_' + i);
    var a = c.getAll(ks), s = ''; for (var j = 0; j < m.n; j++) { if (a[ks[j]] == null) return null; s += a[ks[j]]; }
    var v = JSON.parse(Utilities.ungzip(Utilities.newBlob(Utilities.base64Decode(s), 'application/x-gzip')).getDataAsString());
    for (var r = 1; r < v.length; r++) { var d = v[r]; for (var k = 0; k < d.length; k++) { var x = d[k]; if (typeof x === 'string' && x.charAt(0) === '\u0007') d[k] = new Date(Number(x.slice(1))); } }
    return v;
  } catch (e) { return null; }
}
function nkdGhi_(pb, v) {
  if (!pb || !v || v.length < 2) return;
  try {
    var w = v.map(function(r, i) { return i === 0 ? r : r.map(function(x) { return Object.prototype.toString.call(x) === '[object Date]' ? '\u0007' + x.getTime() : x; }); });
    var z = Utilities.base64Encode(Utilities.gzip(Utilities.newBlob(JSON.stringify(w), 'application/json')).getBytes());
    if (z.length > NKD_MANH * 60) return;   // > ~5 MB nén: không nhớ (nên chạy lưu trữ nhật ký cũ)
    var p = {}, n = 0; for (var x = 0; x < z.length; x += NKD_MANH) p[NKD_K + '_' + pb + '_' + (n++)] = z.slice(x, x + NKD_MANH);
    var c = CacheService.getScriptCache(); c.putAll(p, NKD_GIAY); c.put(NKD_K + '_m', JSON.stringify({ pb: pb, n: n }), NKD_GIAY);
  } catch (e) {}
}

/* ---------- 2) BỘ ĐO TỐC ĐỘ ---------- */
var TD_MOC = [500, 1000, 2000, 3000, 5000, 8000, 15000];   // ms – 8 ngăn: <0,5 s … ≥ 15 s
var TD_GIU = 14;
function tdNgan_(ms) { for (var i = 0; i < TD_MOC.length; i++) if (ms < TD_MOC[i]) return i; return TD_MOC.length; }
function tdCong_(o, ms, sv) {   // o = [lượt, tổng ms, chậm nhất, tổng ms máy chủ, lượt có số máy chủ, ngăn 0..7]
  if (!o) { o = [0, 0, 0, 0, 0]; for (var i = 0; i <= TD_MOC.length; i++) o.push(0); }
  o[0]++; o[1] += ms; if (ms > o[2]) o[2] = ms; if (sv >= 0) { o[3] += sv; o[4]++; } o[5 + tdNgan_(ms)]++;
  return o;
}
function ghiTocDo(token, ds) {
  var me = docPhien_(token); if (!me) return { ok: false };
  if (Object.prototype.toString.call(ds) !== '[object Array]') return { ok: false };
  var vt = String(me.laOwner ? 'OWNER' : (me.vaiTro || '?')).replace(/[^A-Z]/g, '').slice(0, 6) || '?';
  var ngay = homNayVN_(), p = PropertiesService.getScriptProperties(), k = 'TD_' + ngay.replace(/-/g, ''), o = {};
  try { o = JSON.parse(p.getProperty(k) || '{}'); } catch (e) { o = {}; }
  o.f = o.f || {}; o.v = o.v || {};
  ds.slice(0, 60).forEach(function(x) {
    if (!x || typeof x !== 'object') return;
    var fn = String(x.f || ''), ms = Math.round(Number(x.ms)), sv = x.sv == null ? -1 : Math.round(Number(x.sv));
    if (!/^[A-Za-z_][A-Za-z0-9_]{0,39}$/.test(fn) || !(ms >= 0 && ms < 600000)) return;
    if (!(sv >= 0 && sv < 600000)) sv = -1;
    if (!o.f[fn] && Object.keys(o.f).length >= 80) return;   // chặn phình
    o.f[fn] = tdCong_(o.f[fn], ms, sv);
    if (/^(trang|vaoApp|napDuLieu)$/.test(fn)) { var kv = fn + '|' + vt; o.v[kv] = tdCong_(o.v[kv], ms, sv); }
  });
  try { p.setProperty(k, JSON.stringify(o)); } catch (e) {}
  try { var cu = new Date(ngay + 'T12:00:00Z'); cu.setUTCDate(cu.getUTCDate() - TD_GIU - 1); p.deleteProperty('TD_' + Utilities.formatDate(cu, 'GMT', 'yyyyMMdd')); } catch (e) {}
  return { ok: true };
}
function layTocDo(token, soNgay) {
  var q = qtQuyen_(token); if (q.loi) return q.loi;
  soNgay = Math.max(1, Math.min(TD_GIU, Number(soNgay) || 7));
  var p = PropertiesService.getScriptProperties(), d = new Date(homNayVN_() + 'T12:00:00Z'), ngay = [];
  for (var i = 0; i < soNgay; i++) {
    var x = Utilities.formatDate(d, 'GMT', 'yyyyMMdd'), v = p.getProperty('TD_' + x);
    if (v) { try { ngay.push({ ngay: x.slice(0, 4) + '-' + x.slice(4, 6) + '-' + x.slice(6), o: JSON.parse(v) }); } catch (e) {} }
    d.setUTCDate(d.getUTCDate() - 1);
  }
  var nk = 0; try { var sh = ss_().getSheetByName(NKD_TEN); nk = sh ? sh.getLastRow() - 1 : 0; } catch (e) {}
  return sach_({ ok: true, moc: TD_MOC, ngay: ngay, nhatKyDong: nk, nkDem: nkdLay_(nkdPB_()) ? 1 : 0 });
}

/* ---------- 3) KHÓA MÃ HÓA BẢN LƯU TRÊN MÁY ---------- */
function klKhoa_(tk) { return 'KL_' + String(tk || '').toLowerCase(); }
function layKhoaLuu(token) {
  var me = docPhien_(token); if (!me) return { ok: false, hetHan: true };
  var p = PropertiesService.getScriptProperties(), k = klKhoa_(me.tk), v = p.getProperty(k);
  if (!v) { var b = []; for (var i = 0; i < 32; i++) b.push(Math.floor(Math.random() * 256)); v = Utilities.base64Encode(b.map(function(x) { return x > 127 ? x - 256 : x; })); p.setProperty(k, v); }
  return { ok: true, khoa: v, tk: me.tk };
}
function boKhoaLuu_(tk) { try { if (tk) PropertiesService.getScriptProperties().deleteProperty(klKhoa_(tk)); } catch (e) {} }
