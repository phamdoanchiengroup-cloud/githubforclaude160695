/**
 * ============================================================
 *  THIÊN CƠ CÁC — WEB APP LẬP LÁ SỐ TỬ VI & BÁT TỰ
 *  Code.gs — điểm vào Web App, API cho giao diện, lưu lịch sử vào Google Sheet
 *
 *  Các file trong dự án Apps Script:
 *    Code.gs      – server, doGet, API
 *    Lunar.gs     – âm lịch, tiết khí
 *    TuVi.gs      – an sao Tử Vi 12 cung + luận giải
 *    BatTu.gs     – Bát Tự (Tứ Trụ), ngũ hành, đại vận
 *    LuanGiai.gs  – luận 12 cung chuyên sâu, đại vận, tiểu vận, nguyệt vận, nhật vận
 *    BatTuChiTiet.gs – luận Bát Tự chi tiết: cung vị tứ trụ, lục thân, cách cục, thần sát mở rộng
 *    DuDoan.gs    – suy luận các năm biến cố sức khỏe/tài chính/gia đạo, kết hôn, sinh con, tài lộc, quan lộc
 *    Index.html   – khung giao diện
 *    Styles.html  – CSS (phong cách tiên hiệp sáng)
 *    Script.html  – JavaScript phía trình duyệt (vẽ lá số)
 * ============================================================
 */

var APP_TITLE = 'Thiên Cơ Các · Lá Số Tử Vi & Bát Tự';
var SHEET_NAME = 'LaSo';
var SHEET_HEADERS = ['Thời gian lập', 'Họ tên', 'Giới tính', 'Loại lịch', 'Ngày', 'Tháng', 'Năm', 'Nhuận',
  'Giờ', 'Phút', 'Dương lịch', 'Âm lịch', 'Năm can chi', 'Mệnh', 'Cục', 'Bát tự', 'Nhật chủ', 'Dụng thần', 'Input JSON'];

/** Trang web */
function doGet(e) {
  var loi = kiemTraCaiDat_();
  if (loi.length) {
    return HtmlService.createHtmlOutput(trangLoiCaiDat_(loi)).setTitle('Thiên Cơ Các – lỗi cài đặt')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }
  var tpl = HtmlService.createTemplateFromFile('Index');
  tpl.initialParams = JSON.stringify((e && e.parameter) || {});
  return tpl.evaluate()
    .setTitle(APP_TITLE)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=5')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** Nhúng file HTML con (Styles, Script) */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/* ---------------------- Tự kiểm tra cài đặt ---------------------- */
var FILE_HTML_CAN_CO = { 'Index': '<!DOCTYPE html>', 'Styles': '<style>', 'Script': '<script>' };
var HAM_CAN_CO = {
  'Lunar.gs': 'solarToLunar', 'TuVi.gs': 'tuviLapLaSo', 'BatTu.gs': 'batTuLap',
  'LuanGiai.gs': 'luanChiTiet', 'DuDoan.gs': 'duDoanCuocDoi', 'BatTuChiTiet.gs': 'batTuChiTiet',
  'Astro.gs': 'astToanBo', 'ChiemTinh.gs': 'chiemTinhLap', 'HumanDesign.gs': 'hdLap', 'ThanSoHoc.gs': 'thanSoHocLap', 'TongHop.gs': 'tongHopLuan', 'PhoiNgau.gs': 'phoiNgauLuan', 'HaLac.gs': 'haLacLap', 'HoiTu.gs': 'htHoiTu_', 'BatTuLuan.gs': 'btlLinhVuc_'
};

/** Trả về danh sách lỗi cài đặt (rỗng nếu mọi thứ đúng) */
function kiemTraCaiDat_() {
  var loi = [];
  var g = typeof globalThis !== 'undefined' ? globalThis : this;
  Object.keys(HAM_CAN_CO).forEach(function (f) {
    if (typeof g[HAM_CAN_CO[f]] !== 'function') {
      loi.push('Thiếu hoặc sai file <b>' + f + '</b>: không tìm thấy hàm <code>' + HAM_CAN_CO[f] + '</code>. ' +
        'Hãy tạo file loại <b>Tập lệnh</b> tên <b>' + f.replace('.gs', '') + '</b> và dán đúng nội dung ' + f + '.');
    }
  });
  Object.keys(FILE_HTML_CAN_CO).forEach(function (f) {
    var c;
    try { c = HtmlService.createHtmlOutputFromFile(f).getContent(); } catch (err) {
      loi.push('Thiếu file <b>' + f + '.html</b>: hãy tạo file loại <b>HTML</b> tên <b>' + f + '</b>.');
      return;
    }
    var dau = String(c).replace(/^\s+/, '');
    if (dau.toLowerCase().indexOf(FILE_HTML_CAN_CO[f].toLowerCase()) !== 0) {
      var mau = dau.slice(0, 90).replace(/[<>&]/g, function (x) { return { '<': '&lt;', '>': '&gt;', '&': '&amp;' }[x]; });
      loi.push('File <b>' + f + '.html</b> có nội dung sai: dòng đầu phải là <code>' +
        FILE_HTML_CAN_CO[f].replace('<', '&lt;').replace('>', '&gt;') + '</code> nhưng đang là: <code>' + mau + '…</code>' +
        ' → có thể đã dán nhầm nội dung file khác. Hãy xóa hết và dán lại đúng file <b>' + f + '.html</b>.');
    }
  });
  return loi;
}

function trangLoiCaiDat_(loi) {
  return '<meta charset="utf-8"><div style="font-family:system-ui,sans-serif;max-width:760px;margin:30px auto;padding:22px;border:2px solid #c8372d;border-radius:14px;background:#fff8f6;line-height:1.6">' +
    '<h2 style="color:#9e2b22;margin-top:0">⚠ Cài đặt chưa đúng</h2><p>Web app phát hiện ' + loi.length + ' lỗi trong các file của dự án Apps Script:</p><ol>' +
    loi.map(function (x) { return '<li style="margin:8px 0">' + x + '</li>'; }).join('') + '</ol>' +
    '<p>Sau khi sửa: lưu (Ctrl+S) → <b>Triển khai → Quản lý các lần triển khai → ✎ → Phiên bản mới → Triển khai</b>, rồi tải lại trang này.</p></div>';
}

/** Chạy hàm này trong trình soạn thảo (chọn kiemTraCaiDat → Chạy) để xem lỗi trong Nhật ký thực thi */
function kiemTraCaiDat() {
  var loi = kiemTraCaiDat_();
  if (!loi.length) { Logger.log('✔ Cài đặt đúng: đủ 16 file .gs và 3 file HTML.'); return; }
  loi.forEach(function (x) { Logger.log('✘ ' + x.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')); });
}

/**
 * API chính: lập lá số Tử Vi + Bát Tự + tổng luận
 * @param {Object} input dữ liệu từ form
 */
function lapLaSo(input) {
  input = input || {};
  var tv = tuviLapLaSo(input);
  var bt = batTuLap(input);
  var result = {
    tuvi: tv,
    battu: bt,
    ketHop: ketHopLuan(tv, bt),
    chiTiet: null,
    saoInfo: SAO,
    createdAt: new Date().toISOString()
  };
  result.chiTiet = luanChiTiet(tv, bt, input);
  result.duDoan = duDoanCuocDoi(tv, bt, input, result.chiTiet.daiVan);
  result.battuChiTiet = batTuChiTiet(bt, input, tv);
  try {
    result.moRong = lapMoRong_(input, result);
  } catch (err) {
    result.moRongLoi = String(err && err.message || err);
  }
  if (input.save) {
    try { luuLichSu_(input, result); result.saved = true; } catch (err) { result.saveError = String(err && err.message || err); }
  }
  return result;
}

/**
 * Dò giờ sinh: thử 12 giờ (Tý → Hợi) với cùng ngày sinh, đo mức khớp của các sự kiện đã biết.
 * @param {Object} input dữ liệu form, cần input.events = [{nam, loai}]
 */
function doGioSinh(input) {
  input = input || {};
  var ev = (input.events || []).filter(function (e) { return e && e.nam && e.loai; });
  if (!ev.length) throw new Error('Hãy nhập ít nhất một sự kiện đã biết (năm + loại sự kiện).');
  var gocChi = Math.floor(((parseInt(input.hour, 10) || 0) + 1) / 2) % 12;
  var out = [];
  for (var h = 0; h < 12; h++) {
    var inp = JSON.parse(JSON.stringify(input));
    inp.hour = h === 0 ? 0 : h * 2; inp.minute = h === 0 ? 30 : 0; inp.trueSolar = false; inp.events = ev;
    var tv = tuviLapLaSo(inp), bt = batTuLap(inp);
    var D = duDoanCuocDoi(tv, bt, inp, false);
    var dc = D.doiChieu;
    out.push({
      gio: h, gioTen: CHI[h] + ' (' + GIO_CHI[h] + ')', hienTai: h === gocChi,
      menh: CHI[tv.info.menh], cuc: tv.info.cuc,
      chinhTinh: tv.palaces[tv.info.menh].chinh.map(function (s) { return s.n; }).join(', ') || 'VCD',
      truGio: bt.pillars[3].canTen + ' ' + bt.pillars[3].chiTen,
      diem: dc.trungBinh, trungTop: dc.trungTop, pct: dc.suKien.map(function (x) { return x.pct; })
    });
  }
  var sorted = out.slice().sort(function (a, b) { return (b.trungTop - a.trungTop) || (b.diem - a.diem); });
  return { gio: out, tot: sorted[0], suKien: ev.map(function (e) { return e.nam + ' – ' + DD_CHU_DE[e.loai].ten; }),
    ghiChu: 'Giờ có điểm khớp cao nhất là ứng viên tốt nhất cho giờ sinh thật. Cần ≥ 3–4 sự kiện ở các chủ đề khác nhau thì kết quả mới đáng tin; đây là phương pháp "định giờ sinh bằng sự kiện" tham khảo.' };
}

/** Đổi lịch nhanh cho ô xem trước ở form */
function doiLich(input) {
  var d = parseInt(input.day, 10), m = parseInt(input.month, 10), y = parseInt(input.year, 10);
  if (input.calendar === 'am') {
    var s = lunarToSolar(d, m, y, input.leap ? 1 : 0, LUNAR_TZ);
    if (!s) return { ok: false, msg: 'Ngày âm lịch không hợp lệ' };
    return { ok: true, solar: s, leapMonth: getLeapMonthOfYear(y) };
  }
  var l = solarToLunar(d, m, y, LUNAR_TZ);
  return { ok: true, lunar: l };
}

/** Chiêm tinh + Thần số học + Human Design + Tổng hợp đa hệ */
function lapMoRong_(input, result) {
  var tv = result.tuvi, vy = tv.info.viewYear;
  var ct = chiemTinhLap(input);
  var ctL = chiemTinhLuan(ct, vy);
  var ts = thanSoHocLap(input, tv.info.solar, vy);
  var hd = hdLap(ct.thoiDiem.jd);
  var hl = haLacLap(result.battu, tv), hlL = haLacLuan(hl, result.battu, vy);
  var th = tongHopLuan({ tv: tv, bt: result.battu, btct: result.battuChiTiet, ct: ct, ctL: ctL, ts: ts, hd: hd, hl: hl, hlL: hlL, chiTiet: result.chiTiet,
    duDoan: result.duDoan, daiVanTV: result.chiTiet.daiVan, input: input });
  // Gọn dữ liệu trả về trình duyệt
  var ctOut = { thoiDiem: ct.thoiDiem, heNha: ct.heNha, cusp: ct.cusp, hanhTinh: ct.hanhTinh, asc: ct.asc, mc: ct.mc, goc: ct.goc,
    nguyenTo: ct.nguyenTo, tinhChat: ct.tinhChat, phaTrang: ct.phaTrang, chuTinh: ct.chuTinh };
  var hdOut = { act: hd.act, gates: hd.gates, kenh: hd.kenh, dinh: hd.dinh, loai: hd.loai, loaiTen: HD_TYPES[hd.loai].ten, thamQuyen: HD_AUTH[hd.thamQuyen].ten,
    chienLuoc: HD_TYPES[hd.loai].chienLuoc, profile: hd.profile, dinhNghia: hd.dinhNghia, cross: hd.cross, goc: hd.goc, luan: hdLuan(hd) };
  var hlOut = { tien: hl.tien, hau: hl.hau, hoTien: hl.hoTien, hoHau: hl.hoHau, luan: hlL };
  return { haLac: hlOut, chiemTinh: ctOut, chiemTinhLuan: ctL, thanSo: ts, thanSoLuan: thanSoHocLuan(ts), hd: hdOut, tongHop: th };
}

/* ---------------------- Lưu trữ Google Sheet ---------------------- */

function getSheet_() {
  var ss = null;
  try { ss = SpreadsheetApp.getActiveSpreadsheet(); } catch (e) { ss = null; }
  if (!ss) {
    var props = PropertiesService.getScriptProperties();
    var id = props.getProperty('SHEET_ID');
    if (id) {
      try { ss = SpreadsheetApp.openById(id); } catch (e2) { ss = null; }
    }
    if (!ss) {
      ss = SpreadsheetApp.create('Thiên Cơ Các – Lịch sử lá số');
      props.setProperty('SHEET_ID', ss.getId());
    }
  }
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(SHEET_HEADERS);
    sh.getRange(1, 1, 1, SHEET_HEADERS.length)
      .setFontWeight('bold').setBackground('#1f5f5b').setFontColor('#fdf6e3');
    sh.setFrozenRows(1);
    sh.setColumnWidth(SHEET_HEADERS.length, 80);
  }
  return sh;
}

function luuLichSu_(input, r) {
  var sh = getSheet_();
  var I = r.tuvi.info, B = r.battu;
  var s = I.solar, l = I.lunar;
  sh.appendRow([
    new Date(), input.name || 'Vô Danh', I.gender, input.calendar === 'am' ? 'Âm lịch' : 'Dương lịch',
    input.day, input.month, input.year, input.leap ? 'x' : '', input.hour, input.minute,
    s.day + '/' + s.month + '/' + s.year,
    l.day + '/' + l.month + (l.leap ? ' (nhuận)' : '') + '/' + l.year,
    I.namCanChi, I.banMenh.ten, I.cuc,
    B.pillars.map(function (p) { return p.canTen + ' ' + p.chiTen; }).join(' | '),
    B.nhatChu, B.goiY.dung,
    JSON.stringify(input)
  ]);
}

/** Lấy 50 lá số gần nhất */
function getLichSu() {
  var sh = getSheet_();
  var last = sh.getLastRow();
  if (last < 2) return [];
  var n = Math.min(50, last - 1);
  var values = sh.getRange(last - n + 1, 1, n, SHEET_HEADERS.length).getValues();
  var out = [];
  for (var i = values.length - 1; i >= 0; i--) {
    var v = values[i];
    var inp = {};
    try { inp = JSON.parse(v[SHEET_HEADERS.length - 1]); } catch (e) { inp = {}; }
    out.push({
      row: last - n + 1 + i,
      time: v[0] instanceof Date ? Utilities.formatDate(v[0], 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy HH:mm') : String(v[0]),
      name: v[1], gender: v[2], duong: v[10], am: v[11], canChi: v[12], cuc: v[14], input: inp
    });
  }
  return out;
}

/** Xóa một dòng lịch sử */
function xoaLichSu(row) {
  var sh = getSheet_();
  row = parseInt(row, 10);
  if (row >= 2 && row <= sh.getLastRow()) sh.deleteRow(row);
  return true;
}

/** Hàm chạy thử trong trình soạn thảo Apps Script */
function testLapLaSo() {
  var r = lapLaSo({ name: 'Thử nghiệm', gender: 'nam', calendar: 'duong', day: 15, month: 8, year: 1990, hour: 10, minute: 30, viewYear: 2026 });
  Logger.log(JSON.stringify(r.tuvi.info, null, 2));
  Logger.log(r.battu.pillars.map(function (p) { return p.canTen + ' ' + p.chiTen; }).join(' | '));
}
