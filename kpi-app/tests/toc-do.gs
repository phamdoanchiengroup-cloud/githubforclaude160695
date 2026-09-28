
/* ============================================================
   ===== TĂNG TỐC (bản 29/09/2026) =====
   1) Bộ đệm ghi: suaO_ không ghi ngay từng ô mà gom lại, cuối lượt gọi ghi một lần theo khối dòng.
   2) Số phiên bản dữ liệu + bộ nhớ tạm: kết quả tính nặng (bảng KPI, KPI quản lý, chấm công tháng,
      phân tích định mức, lịch sử KPI) được nhớ 10 phút; có ai lưu thay đổi là tự bỏ nhớ.
   3) Đọc gộp nhiều trang tính bằng Sheets API (chỉ bật sau khi KIEM_TRA_SHEETS_API xác nhận khớp).
   4) Lưu trữ nhật ký sản xuất cũ sang trang tính riêng (LUU_TRU_NHAT_KY).
   ============================================================ */

/* ---------- 1) BỘ ĐỆM GHI ---------- */
var __CHO_GHI = {};          // tên sheet -> { dòng: { cột (1-based): giá trị } }

/* Ghi hết các ô đang chờ của một sheet (hoặc mọi sheet nếu không truyền tên).
   Gom các dòng gần nhau (cách nhau ≤ 3 dòng) thành một khối: đọc khối 1 lần, thay ô, ghi khối 1 lần.
   Khối nào mọi ô đều có giá trị mới thì ghi thẳng, khỏi đọc. */
function xaGhi_(name) {
  var ds = name ? [name] : Object.keys(__CHO_GHI);
  ds.forEach(function(ten) {
    var m = __CHO_GHI[ten];
    if (!m) return;
    delete __CHO_GHI[ten];
    var sh = ss_().getSheetByName(ten);
    if (!sh) return;
    var dong = Object.keys(m).map(Number).sort(function(a, b) { return a - b; });
    var i = 0;
    while (i < dong.length) {
      var j = i;
      while (j + 1 < dong.length && dong[j + 1] - dong[j] <= 4) j++;
      var r1 = dong[i], r2 = dong[j], c1 = 1e9, c2 = 0, soO = 0;
      for (var k = i; k <= j; k++) Object.keys(m[dong[k]]).forEach(function(c) {
        c = Number(c); if (c < c1) c1 = c; if (c > c2) c2 = c; soO++;
      });
      var cao = r2 - r1 + 1, rong = c2 - c1 + 1, rng = sh.getRange(r1, c1, cao, rong);
      var v;
      if (soO === cao * rong) {
        v = []; for (var a = 0; a < cao; a++) { v.push([]); for (var b = 0; b < rong; b++) v[a].push(''); }
      } else v = rng.getValues();
      for (var k2 = i; k2 <= j; k2++) {
        var o = m[dong[k2]];
        Object.keys(o).forEach(function(c) { v[dong[k2] - r1][Number(c) - c1] = o[c]; });
      }
      rng.setValues(v);
      i = j + 1;
    }
    xoaCache_(ten);
  });
}

/* Kết thúc một lượt có ghi: ghi hết bộ đệm, rồi tăng số phiên bản dữ liệu (để bỏ bộ nhớ tạm cũ). */
function xong_() {
  xaGhi_();
  if (__KHOA && !__DA_TANG_PB) { tangPhienBan_(); __DA_TANG_PB = true; }
}
var __DA_TANG_PB = false;

/* ---------- 2) PHIÊN BẢN DỮ LIỆU + BỘ NHỚ TẠM ---------- */
var __PB = null;
function phienBan_() {
  if (__PB === null) {
    try { __PB = PropertiesService.getScriptProperties().getProperty('KPI_PB') || '0'; } catch (e) { __PB = '0'; }
  }
  return __PB;
}
function tangPhienBan_() {
  __PB = new Date().getTime() + '.' + Math.floor(Math.random() * 1e6);
  try { PropertiesService.getScriptProperties().setProperty('KPI_PB', __PB); } catch (e) {}
}
var NHO_GIAY = 600;          // nhớ kết quả tính 10 phút
var NHO_KHOI = 90000;        // CacheService giới hạn 100KB mỗi khóa -> cắt khối 90KB

/* Trả kết quả đã nhớ nếu còn; nếu không thì tính bằng fn(), nhớ lại (chỉ nhớ kết quả ok). */
function nho_(ten, thamSo, fn) {
  var khoa = '';
  try {
    var raw = ten + '|' + JSON.stringify(thamSo) + '|' + phienBan_() + '|' + homNayVN_() + (gioVN_() >= 17 ? 'c' : 's');
    khoa = 'NHO_' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, raw, Utilities.Charset.UTF_8));
    var c = CacheService.getScriptCache(), dau = c.get(khoa);
    if (dau) {
      var n = Number(dau), ks = [];
      for (var i = 0; i < n; i++) ks.push(khoa + '_' + i);
      var cac = c.getAll(ks), s = '';
      for (var j = 0; j < n; j++) { if (cac[ks[j]] == null) { s = null; break; } s += cac[ks[j]]; }
      if (s !== null) {
        var json = Utilities.ungzip(Utilities.newBlob(Utilities.base64Decode(s), 'application/x-gzip')).getDataAsString();
        var kq = JSON.parse(json);
        kq.tuBoNho = true;
        return kq;
      }
    }
  } catch (e) { khoa = khoa || ''; }
  var r = fn();
  try {
    if (khoa && r && r.ok) {
      var z = Utilities.base64Encode(Utilities.gzip(Utilities.newBlob(JSON.stringify(r), 'application/json')).getBytes());
      var soKhoi = Math.ceil(z.length / NHO_KHOI), dat = {};
      if (soKhoi <= 20) {
        for (var q = 0; q < soKhoi; q++) dat[khoa + '_' + q] = z.substr(q * NHO_KHOI, NHO_KHOI);
        var cc = CacheService.getScriptCache();
        cc.putAll(dat, NHO_GIAY);
        cc.put(khoa, String(soKhoi), NHO_GIAY);
      }
    }
  } catch (e) {}
  return r;
}

/* ---------- 3) ĐỌC GỘP BẰNG SHEETS API ----------
   Cần bật: trình soạn thảo Apps Script -> Dịch vụ (+) -> Google Sheets API -> Thêm.
   Sau đó chạy KIEM_TRA_SHEETS_API một lần: hàm so từng ô giữa 2 cách đọc, khớp hết mới bật. */
var COT_NGAY_ = ['Ngay', 'ThoiDiem', 'ThoiDiemNhap', 'ThoiDiemDuyet', 'ThoiDiemPhat', 'ThoiDiemGhi', 'ThoiDiemChot',
  'NgayTao', 'NgayVaoLam', 'LanDangNhapCuoi', 'TuNgay', 'DenNgay', 'NgayGui', 'NgayDuyet', 'NgayDeXuat',
  'HieuLucTu', 'BaoTriKeTiep', 'KyApDung', 'Ky'];
function dungSheetsApi_() {
  try {
    return typeof Sheets !== 'undefined' && PropertiesService.getScriptProperties().getProperty('KPI_SHEETS_API') === '1';
  } catch (e) { return false; }
}
/* Đọc nhiều sheet trong MỘT lần gọi, trả { tên: mảng 2 chiều giống getValues() } */
function docGopApi_(tenDs) {
  var z = Utilities.formatDate(new Date(), ss_().getSpreadsheetTimeZone(), 'Z');     // VD "+0700"
  var lech = (z.charAt(0) === '-' ? -1 : 1) * (Number(z.substr(1, 2)) + Number(z.substr(3, 2)) / 60);
  var r = Sheets.Spreadsheets.Values.batchGet(ss_().getId(), {
    ranges: tenDs.map(function(t) { return "'" + t.replace(/'/g, "''") + "'"; }),
    valueRenderOption: 'UNFORMATTED_VALUE', dateTimeRenderOption: 'SERIAL_NUMBER', majorDimension: 'ROWS'
  });
  var out = {};
  (r.valueRanges || []).forEach(function(vr, k) {
    var v = vr.values || [];
    if (!v.length) { out[tenDs[k]] = []; return; }
    var head = v[0], rong = head.length, laNgay = head.map(function(h) { return COT_NGAY_.indexOf(String(h)) >= 0; });
    out[tenDs[k]] = v.map(function(row, i) {
      var o = [];
      for (var j = 0; j < rong; j++) {
        var x = row[j];
        if (x === undefined || x === null) x = '';
        if (i > 0 && laNgay[j] && typeof x === 'number') x = new Date(Math.round((x - 25569) * 864e5 - lech * 3600e3));
        o.push(x);
      }
      return o;
    });
  });
  return out;
}
/* Nạp trước vào bộ nhớ đệm đọc (__DOC_CACHE) nhiều sheet cùng lúc */
function napTruoc_(tenDs) {
  if (!dungSheetsApi_()) return;
  var can = tenDs.filter(function(t) { return !__DOC_CACHE.hasOwnProperty(t) && !__CHO_GHI[t] && ss_().getSheetByName(t); });
  if (can.length < 2) return;
  try {
    var gop = docGopApi_(can);
    can.forEach(function(t) { __DOC_CACHE[t] = bangThanhDoiTuong_(gop[t] || []); });
  } catch (e) { /* lỗi API -> để doc_ đọc cách cũ */ }
}
function bangThanhDoiTuong_(v) {
  if (v.length < 2) return [];
  var head = v[0], out = [];
  for (var i = 1; i < v.length; i++) {
    if (v[i].join('') === '') continue;
    var o = { _row: i + 1 };
    for (var j = 0; j < head.length; j++) o[head[j]] = v[i][j];
    out.push(o);
  }
  return out;
}
var SHEET_NAP_ = ['TaiKhoan', 'NhanSu', 'PhongBan', 'CongDoan', 'DinhMuc', 'DeXuatDinhMuc', 'DanhMucLoi', 'LyDoDung',
  'NhatKySanXuat', 'PhieuKCS', 'TrongSoKPI', 'MayMoc', 'DanhMucViPham', 'ViPham', 'DiemDanhNghi', 'XacNhanDiemDanh',
  'NghiDaiHan', 'YeuCauSuaHoSo', 'ThongBao', 'NgayLe', 'MienTruDiemDanh', 'KPIThang', 'PhatNhapTre', 'MienTruKPIQuanLy'];

/* CHẠY TAY: so từng ô giữa cách đọc cũ (getValues) và Sheets API. Khớp hết -> bật đọc gộp. */
function KIEM_TRA_SHEETS_API() {
  if (typeof Sheets === 'undefined') {
    Logger.log('Chưa bật dịch vụ Google Sheets API. Vào Dịch vụ (+) -> Google Sheets API -> Thêm, rồi chạy lại.');
    return;
  }
  var ten = SHEET_NAP_.filter(function(t) { return ss_().getSheetByName(t); });
  var gop = docGopApi_(ten), lech = 0, vd = [];
  ten.forEach(function(t) {
    var a = ss_().getSheetByName(t).getDataRange().getValues(), b = gop[t] || [];
    // bỏ dòng trống cuối cho công bằng
    var cat = function(x) { while (x.length && x[x.length - 1].join('') === '') x.pop(); return x; };
    a = cat(a); b = cat(b);
    var n = Math.max(a.length, b.length);
    for (var i = 0; i < n; i++) {
      var ra = a[i] || [], rb = b[i] || [], m = Math.max(ra.length, rb.length);
      for (var j = 0; j < m; j++) {
        var x = ra[j] === undefined ? '' : ra[j], y = rb[j] === undefined ? '' : rb[j];
        var giong = (x instanceof Date || y instanceof Date)
          ? (x instanceof Date && y instanceof Date && Math.abs(x.getTime() - y.getTime()) < 1000)
          : String(x) === String(y);
        if (!giong) { lech++; if (vd.length < 15) vd.push(t + '!' + (i + 1) + ':' + (j + 1) + ' [' + x + '] ≠ [' + y + ']'); }
      }
    }
  });
  var p = PropertiesService.getScriptProperties();
  if (lech === 0) { p.setProperty('KPI_SHEETS_API', '1'); Logger.log('KHỚP toàn bộ ' + ten.length + ' trang tính. ĐÃ BẬT đọc gộp bằng Sheets API.'); }
  else { p.setProperty('KPI_SHEETS_API', '0'); Logger.log('Có ' + lech + ' ô lệch -> CHƯA bật. Ví dụ:\n' + vd.join('\n')); }
}
function TAT_SHEETS_API() { PropertiesService.getScriptProperties().setProperty('KPI_SHEETS_API', '0'); Logger.log('Đã tắt đọc gộp.'); }

/* ---------- 4) LƯU TRỮ NHẬT KÝ CŨ ----------
   Chuyển các dòng NhatKySanXuat của những tháng ĐÃ CHỐT CHÍNH THỨC và cũ hơn SO_THANG_GIU tháng
   sang trang tính NhatKySanXuat_LuuTru. Bảng KPI tháng cũ đọc bản chốt nên không đổi;
   các phép tính cần tháng cũ (KPI quản lý, lịch sử) tự đọc thêm trang lưu trữ. */
var SO_THANG_GIU = 3;
var TEN_LUU_TRU = 'NhatKySanXuat_LuuTru';
function mocLuuTru_() {
  try { return PropertiesService.getScriptProperties().getProperty('KPI_MOC_LUU_TRU') || ''; } catch (e) { return ''; }
}
/* Có cần đọc thêm trang lưu trữ cho các tháng này không */
function canLuuTru_(cacThang) {
  var moc = mocLuuTru_();
  if (!moc) return false;
  return (cacThang || []).some(function(t) { return !t || String(t) < moc; });
}
function LUU_TRU_NHAT_KY() {
  khoa_();
  var sh = ss_().getSheetByName('NhatKySanXuat');
  if (!sh || sh.getLastRow() < 2) { Logger.log('Không có dữ liệu.'); return; }
  var moc = kyVN_();
  for (var k = 0; k < SO_THANG_GIU; k++) moc = kyTruoc_(moc);        // tháng cũ nhất còn giữ lại
  var head = dauCot_('NhatKySanXuat'), cNgay = head.indexOf('Ngay');
  var v = sh.getRange(2, 1, sh.getLastRow() - 1, head.length).getValues();
  var daChot = {}, chuyen = [], dongXoa = [];
  v.forEach(function(r, i) {
    if (r.join('') === '') return;
    var ng = ngayVN_(r[cNgay]), ky = ng.slice(0, 7);
    if (!/^\d{4}-\d{2}$/.test(ky) || ky >= moc) return;
    if (!(ky in daChot)) daChot[ky] = daChotChinhThuc_(ky);
    if (!daChot[ky]) return;                                            // tháng chưa chốt: giữ lại
    chuyen.push(r); dongXoa.push(i + 2);
  });
  if (!chuyen.length) { Logger.log('Không có tháng nào đủ điều kiện lưu trữ (cũ hơn ' + moc + ' và đã chốt chính thức).'); return; }
  var lt = ss_().getSheetByName(TEN_LUU_TRU);
  if (!lt) { lt = ss_().insertSheet(TEN_LUU_TRU); lt.getRange(1, 1, 1, head.length).setValues([head]).setFontWeight('bold'); lt.setFrozenRows(1); }
  lt.getRange(lt.getLastRow() + 1, 1, chuyen.length, head.length).setValues(chuyen);
  xoaNhieuDong_('NhatKySanXuat', dongXoa);
  var cu = mocLuuTru_();
  PropertiesService.getScriptProperties().setProperty('KPI_MOC_LUU_TRU', cu && cu > moc ? cu : moc);
  var thang = Object.keys(daChot).filter(function(t) { return daChot[t]; }).sort();
  ghiLog_({ tk: 'HE_THONG', ten: 'Lưu trữ' }, 'Lưu trữ nhật ký cũ', chuyen.length + ' dòng', '', thang.join(', '));
  xong_();
  Logger.log('Đã chuyển ' + chuyen.length + ' dòng (' + thang.join(', ') + ') sang ' + TEN_LUU_TRU + '.');
}
/* Trigger: ngày 5 hằng tháng, 2h30 sáng */
function CAI_TRIGGER_LUU_TRU() {
  ScriptApp.getProjectTriggers().forEach(function(t) { if (t.getHandlerFunction() === 'LUU_TRU_NHAT_KY') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('LUU_TRU_NHAT_KY').timeBased().onMonthDay(5).atHour(2).inTimezone(TZ_VN).create();
  Logger.log('Đã cài trigger lưu trữ nhật ký: ngày 5 hằng tháng, 2h sáng.');
}

/* ---------- NẠP THEO PHẦN (tải lại nhẹ sau khi lưu) ----------
   Giao diện gọi napPhan(token, ['nk','cc',...]) thay vì napDuLieu -> chỉ đọc và gửi phần đã đổi. */
function napPhan(token, phan) {
  return napDuLieuLoi_(token, phan && phan.length ? phan : null);
}
