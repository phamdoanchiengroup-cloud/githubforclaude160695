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
  if (input.save) {
    try { luuLichSu_(input, result); result.saved = true; } catch (err) { result.saveError = String(err && err.message || err); }
  }
  return result;
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
