/**
 * ============================================================
 *  Lunar.gs — ÂM LỊCH VIỆT NAM & THIÊN VĂN CƠ BẢN
 *  Thuật toán của Hồ Ngọc Đức (múi giờ +7), bổ sung tính
 *  kinh độ mặt trời chính xác theo phút để xác định Tiết khí
 *  phục vụ Bát Tự (Tứ Trụ).
 * ============================================================
 */

var LUNAR_TZ = 7;

function lunarInt_(d) { return Math.floor(d); }

/** Ngày dương lịch -> số ngày Julius (JDN, lúc 12h trưa) */
function jdFromDate(dd, mm, yy) {
  var a = lunarInt_((14 - mm) / 12);
  var y = yy + 4800 - a;
  var m = mm + 12 * a - 3;
  var jd = dd + lunarInt_((153 * m + 2) / 5) + 365 * y + lunarInt_(y / 4) - lunarInt_(y / 100) + lunarInt_(y / 400) - 32045;
  if (jd < 2299161) {
    jd = dd + lunarInt_((153 * m + 2) / 5) + 365 * y + lunarInt_(y / 4) - 32083;
  }
  return jd;
}

/** Số ngày Julius -> [ngày, tháng, năm] dương lịch */
function jdToDate(jd) {
  var a, b, c, d, e, m;
  if (jd > 2299160) {
    a = jd + 32044;
    b = lunarInt_((4 * a + 3) / 146097);
    c = a - lunarInt_((b * 146097) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  d = lunarInt_((4 * c + 3) / 1461);
  e = c - lunarInt_((1461 * d) / 4);
  m = lunarInt_((5 * e + 2) / 153);
  var day = e - lunarInt_((153 * m + 2) / 5) + 1;
  var month = m + 3 - 12 * lunarInt_(m / 10);
  var year = b * 100 + d - 4800 + lunarInt_(m / 10);
  return [day, month, year];
}

/** Thời điểm Sóc (trăng mới) thứ k tính từ 1/1/1900 */
function lunarNewMoon_(k) {
  var T = k / 1236.85, T2 = T * T, T3 = T2 * T, dr = Math.PI / 180;
  var Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  var M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  var Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  var F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  var C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
  C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
  C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
  C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 = C1 + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
  var deltat;
  if (T < -11) {
    deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
  } else {
    deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
  }
  return Jd1 + C1 - deltat;
}

/** Kinh độ mặt trời (radian) tại thời điểm JD (UT, có phần lẻ) */
function lunarSunLongitudeRad_(jdn) {
  var T = (jdn - 2451545.0) / 36525, T2 = T * T, dr = Math.PI / 180;
  var M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  var L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  var DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
  var L = L0 + DL;
  L = L * dr;
  L = L - Math.PI * 2 * lunarInt_(L / (Math.PI * 2));
  return L;
}

/**
 * Kinh độ mặt trời biểu kiến (độ, 0..360) tại JD (UT) — có hiệu chỉnh
 * chương động & tinh sai, dùng xác định thời khắc Tiết khí (sai số ~ vài phút).
 * (Lịch âm vẫn dùng công thức gốc của Hồ Ngọc Đức để khớp lịch Việt Nam.)
 */
function sunLongitudeDeg(jdUT) {
  var T = (jdUT - 2451545.0) / 36525, dr = Math.PI / 180;
  var omega = 125.04 - 1934.136 * T;
  var L = lunarSunLongitudeRad_(jdUT) / dr - 0.00569 - 0.00478 * Math.sin(omega * dr);
  L = L % 360;
  if (L < 0) L += 360;
  return L;
}

function lunarGetSunLongitude_(dayNumber, timeZone) {
  return lunarInt_(lunarSunLongitudeRad_(dayNumber - 0.5 - timeZone / 24) / Math.PI * 6);
}

function lunarGetNewMoonDay_(k, timeZone) {
  return lunarInt_(lunarNewMoon_(k) + 0.5 + timeZone / 24);
}

function lunarGetMonth11_(yy, timeZone) {
  var off = jdFromDate(31, 12, yy) - 2415021;
  var k = lunarInt_(off / 29.530588853);
  var nm = lunarGetNewMoonDay_(k, timeZone);
  var sunLong = lunarGetSunLongitude_(nm, timeZone);
  if (sunLong >= 9) nm = lunarGetNewMoonDay_(k - 1, timeZone);
  return nm;
}

function lunarGetLeapMonthOffset_(a11, timeZone) {
  var k = lunarInt_((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  var last, i = 1;
  var arc = lunarGetSunLongitude_(lunarGetNewMoonDay_(k + i, timeZone), timeZone);
  do {
    last = arc;
    i++;
    arc = lunarGetSunLongitude_(lunarGetNewMoonDay_(k + i, timeZone), timeZone);
  } while (arc != last && i < 14);
  return i - 1;
}

/** Dương -> Âm. Trả về {day, month, year, leap} */
function solarToLunar(dd, mm, yy, timeZone) {
  timeZone = timeZone == null ? LUNAR_TZ : timeZone;
  var dayNumber = jdFromDate(dd, mm, yy);
  var k = lunarInt_((dayNumber - 2415021.076998695) / 29.530588853);
  var monthStart = lunarGetNewMoonDay_(k + 1, timeZone);
  if (monthStart > dayNumber) monthStart = lunarGetNewMoonDay_(k, timeZone);
  var a11 = lunarGetMonth11_(yy, timeZone);
  var b11 = a11, lunarYear;
  if (a11 >= monthStart) {
    lunarYear = yy;
    a11 = lunarGetMonth11_(yy - 1, timeZone);
  } else {
    lunarYear = yy + 1;
    b11 = lunarGetMonth11_(yy + 1, timeZone);
  }
  var lunarDay = dayNumber - monthStart + 1;
  var diff = lunarInt_((monthStart - a11) / 29);
  var lunarLeap = 0;
  var lunarMonth = diff + 11;
  if (b11 - a11 > 365) {
    var leapMonthDiff = lunarGetLeapMonthOffset_(a11, timeZone);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff == leapMonthDiff) lunarLeap = 1;
    }
  }
  if (lunarMonth > 12) lunarMonth = lunarMonth - 12;
  if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;
  // Số ngày của tháng âm này
  var nextStart = lunarGetNewMoonDay_(lunarInt_((monthStart - 2415021.076998695) / 29.530588853 + 0.5) + 1, timeZone);
  return { day: lunarDay, month: lunarMonth, year: lunarYear, leap: lunarLeap, monthDays: nextStart - monthStart };
}

/** Âm -> Dương. Trả về {day, month, year} hoặc null nếu không hợp lệ */
function lunarToSolar(lunarDay, lunarMonth, lunarYear, lunarLeap, timeZone) {
  timeZone = timeZone == null ? LUNAR_TZ : timeZone;
  var a11, b11;
  if (lunarMonth < 11) {
    a11 = lunarGetMonth11_(lunarYear - 1, timeZone);
    b11 = lunarGetMonth11_(lunarYear, timeZone);
  } else {
    a11 = lunarGetMonth11_(lunarYear, timeZone);
    b11 = lunarGetMonth11_(lunarYear + 1, timeZone);
  }
  var k = lunarInt_(0.5 + (a11 - 2415021.076998695) / 29.530588853);
  var off = lunarMonth - 11;
  if (off < 0) off += 12;
  if (b11 - a11 > 365) {
    var leapOff = lunarGetLeapMonthOffset_(a11, timeZone);
    var leapMonth = leapOff - 2;
    if (leapMonth <= 0) leapMonth += 12;
    if (lunarLeap != 0 && lunarMonth != leapMonth) {
      return null;
    } else if (lunarLeap != 0 || off >= leapOff) {
      off += 1;
    }
  } else if (lunarLeap != 0) {
    return null;
  }
  var monthStart = lunarGetNewMoonDay_(k + off, timeZone);
  var nextStart = lunarGetNewMoonDay_(k + off + 1, timeZone);
  if (lunarDay > nextStart - monthStart) return null;
  var r = jdToDate(monthStart + lunarDay - 1);
  return { day: r[0], month: r[1], year: r[2] };
}

/** Tháng nhuận của năm âm lịch (0 nếu không có) */
function getLeapMonthOfYear(lunarYear, timeZone) {
  for (var m = 1; m <= 12; m++) {
    if (lunarToSolar(1, m, lunarYear, 1, timeZone)) return m;
  }
  return 0;
}

/**
 * Tìm thời điểm (JD UT) mặt trời đạt kinh độ targetDeg, gần jdGuess
 */
function findSolarTermJD(targetDeg, jdGuess) {
  var jd = jdGuess;
  for (var i = 0; i < 30; i++) {
    var L = sunLongitudeDeg(jd);
    var diff = targetDeg - L;
    while (diff > 180) diff -= 360;
    while (diff < -180) diff += 360;
    if (Math.abs(diff) < 1e-6) break;
    jd += diff / 360 * 365.2422;
  }
  return jd;
}

/** JD (UT, có phần lẻ) -> {y,m,d,h,mi} giờ địa phương */
function jdToLocalDateTime(jdUT, timeZone) {
  timeZone = timeZone == null ? LUNAR_TZ : timeZone;
  var jl = jdUT + 0.5 + timeZone / 24;
  var z = Math.floor(jl);
  var frac = jl - z;
  var dmy = jdToDate(z);
  var totalMin = Math.round(frac * 1440);
  if (totalMin >= 1440) { totalMin -= 1440; dmy = jdToDate(z + 1); }
  return { d: dmy[0], m: dmy[1], y: dmy[2], h: Math.floor(totalMin / 60), mi: totalMin % 60 };
}

/** 24 tiết khí, bắt đầu từ Xuân Phân (0°) */
var TIET_KHI = ['Xuân Phân', 'Thanh Minh', 'Cốc Vũ', 'Lập Hạ', 'Tiểu Mãn', 'Mang Chủng',
  'Hạ Chí', 'Tiểu Thử', 'Đại Thử', 'Lập Thu', 'Xử Thử', 'Bạch Lộ',
  'Thu Phân', 'Hàn Lộ', 'Sương Giáng', 'Lập Đông', 'Tiểu Tuyết', 'Đại Tuyết',
  'Đông Chí', 'Tiểu Hàn', 'Đại Hàn', 'Lập Xuân', 'Vũ Thủy', 'Kinh Trập'];

function getTietKhiName(sunLongDeg) {
  return TIET_KHI[Math.floor(sunLongDeg / 15) % 24];
}
