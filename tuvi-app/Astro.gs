/**
 * ============================================================
 *  Astro.gs — BỘ TÍNH VỊ TRÍ THIÊN THỂ (không cần thư viện ngoài)
 *  - Mặt Trời, Mặt Trăng, Sao Thủy → Sao Diêm Vương: thuật toán quỹ đạo
 *    Kepler + nhiễu động chính (Paul Schlyter), có hiệu chỉnh thời gian ánh sáng
 *    và quang sai; Nút Bắc thật (Meeus); Mọc (Ascendant) & Thiên đỉnh (MC).
 *  - Tọa độ hoàng đạo nhiệt đới (tropical), xuân phân của ngày – dùng cho
 *    chiêm tinh phương Tây và Human Design.
 *  - Đã đối chiếu với astronomy-engine (xem tests/doi-chieu.js).
 * ============================================================
 */

var AST_RAD = Math.PI / 180;
function astNorm_(x) { x = x % 360; return x < 0 ? x + 360 : x; }
function astSin_(x) { return Math.sin(x * AST_RAD); }
function astCos_(x) { return Math.cos(x * AST_RAD); }
function astAtan2_(y, x) { return Math.atan2(y, x) / AST_RAD; }

/** Giải phương trình Kepler, trả về dị thường tâm sai E (độ) */
function astKepler_(M, e) {
  var E = M + (180 / Math.PI) * e * astSin_(M) * (1 + e * astCos_(M));
  for (var i = 0; i < 12; i++) {
    var dE = (E - (180 / Math.PI) * e * astSin_(E) - M) / (1 - e * astCos_(E));
    E -= dE;
    if (Math.abs(dE) < 1e-7) break;
  }
  return E;
}

var AST_PLANET_EL = {
  mercury: function (d) { return { N: 48.3313 + 3.24587E-5 * d, i: 7.0047 + 5.00E-8 * d, w: 29.1241 + 1.01444E-5 * d, a: 0.387098, e: 0.205635 + 5.59E-10 * d, M: 168.6562 + 4.0923344368 * d }; },
  venus: function (d) { return { N: 76.6799 + 2.46590E-5 * d, i: 3.3946 + 2.75E-8 * d, w: 54.8910 + 1.38374E-5 * d, a: 0.723330, e: 0.006773 - 1.302E-9 * d, M: 48.0052 + 1.6021302244 * d }; },
  mars: function (d) { return { N: 49.5574 + 2.11081E-5 * d, i: 1.8497 - 1.78E-8 * d, w: 286.5016 + 2.92961E-5 * d, a: 1.523688, e: 0.093405 + 2.516E-9 * d, M: 18.6021 + 0.5240207766 * d }; },
  jupiter: function (d) { return { N: 100.4542 + 2.76854E-5 * d, i: 1.3030 - 1.557E-7 * d, w: 273.8777 + 1.64505E-5 * d, a: 5.20256, e: 0.048498 + 4.469E-9 * d, M: 19.8950 + 0.0830853001 * d }; },
  saturn: function (d) { return { N: 113.6634 + 2.38980E-5 * d, i: 2.4886 - 1.081E-7 * d, w: 339.3939 + 2.97661E-5 * d, a: 9.55475, e: 0.055546 - 9.499E-9 * d, M: 316.9670 + 0.0334442282 * d }; },
  uranus: function (d) { return { N: 74.0005 + 1.3978E-5 * d, i: 0.7733 + 1.9E-8 * d, w: 96.6612 + 3.0565E-5 * d, a: 19.18171 - 1.55E-8 * d, e: 0.047318 + 7.45E-9 * d, M: 142.5905 + 0.011725806 * d }; },
  neptune: function (d) { return { N: 131.7806 + 3.0173E-5 * d, i: 1.7700 - 2.55E-7 * d, w: 272.8461 - 6.027E-6 * d, a: 30.05826 + 3.313E-8 * d, e: 0.008606 + 2.15E-9 * d, M: 260.2471 + 0.005995147 * d }; }
};

/** Mặt Trời: kinh độ hoàng đạo địa tâm (độ) & vector (AU) */
function astSun_(d) {
  var w = 282.9404 + 4.70935E-5 * d, e = 0.016709 - 1.151E-9 * d, M = astNorm_(356.0470 + 0.9856002585 * d);
  var E = astKepler_(M, e);
  var xv = astCos_(E) - e, yv = Math.sqrt(1 - e * e) * astSin_(E);
  var v = astAtan2_(yv, xv), r = Math.sqrt(xv * xv + yv * yv);
  var lon = astNorm_(v + w);
  return { lon: lon, r: r, x: r * astCos_(lon), y: r * astSin_(lon), M: M, w: w };
}

/** Vị trí nhật tâm (x, y, z) của hành tinh theo hoàng đạo ngày */
function astHelio_(name, d) {
  var x, y, z, lon, lat, r;
  if (name === 'pluto') {
    var S = 50.03 + 0.033459652 * d, P = 238.95 + 0.003968789 * d;
    lon = 238.9508 + 0.00400703 * d - 19.799 * astSin_(P) + 19.848 * astCos_(P) + 0.897 * astSin_(2 * P) - 4.956 * astCos_(2 * P) +
      0.610 * astSin_(3 * P) + 1.211 * astCos_(3 * P) - 0.341 * astSin_(4 * P) - 0.190 * astCos_(4 * P) + 0.128 * astSin_(5 * P) - 0.034 * astCos_(5 * P) -
      0.038 * astSin_(6 * P) + 0.031 * astCos_(6 * P) + 0.020 * astSin_(S - P) - 0.010 * astCos_(S - P);
    lat = -3.9082 - 5.453 * astSin_(P) - 14.975 * astCos_(P) + 3.527 * astSin_(2 * P) + 1.673 * astCos_(2 * P) - 1.051 * astSin_(3 * P) +
      0.328 * astCos_(3 * P) + 0.179 * astSin_(4 * P) - 0.292 * astCos_(4 * P) + 0.019 * astSin_(5 * P) + 0.100 * astCos_(5 * P) -
      0.031 * astSin_(6 * P) - 0.026 * astCos_(6 * P) + 0.011 * astCos_(S - P);
    r = 40.72 + 6.68 * astSin_(P) + 6.90 * astCos_(P) - 1.18 * astSin_(2 * P) - 0.03 * astCos_(2 * P) + 0.15 * astSin_(3 * P) - 0.14 * astCos_(3 * P);
    // công thức Schlyter cho Sao Diêm Vương đã theo xuân phân ngày (đã kiểm chứng với astronomy-engine)
  } else {
    var el = AST_PLANET_EL[name](d);
    var M = astNorm_(el.M), E = astKepler_(M, el.e);
    var xv = el.a * (astCos_(E) - el.e), yv = el.a * Math.sqrt(1 - el.e * el.e) * astSin_(E);
    var v = astAtan2_(yv, xv);
    r = Math.sqrt(xv * xv + yv * yv);
    var xh = r * (astCos_(el.N) * astCos_(v + el.w) - astSin_(el.N) * astSin_(v + el.w) * astCos_(el.i));
    var yh = r * (astSin_(el.N) * astCos_(v + el.w) + astCos_(el.N) * astSin_(v + el.w) * astCos_(el.i));
    var zh = r * (astSin_(v + el.w) * astSin_(el.i));
    lon = astAtan2_(yh, xh);
    lat = astAtan2_(zh, Math.sqrt(xh * xh + yh * yh));
    if (name === 'jupiter' || name === 'saturn' || name === 'uranus') {
      var Mj = astNorm_(19.8950 + 0.0830853001 * d), Ms = astNorm_(316.9670 + 0.0334442282 * d), Mu = astNorm_(142.5905 + 0.011725806 * d);
      if (name === 'jupiter') lon += -0.332 * astSin_(2 * Mj - 5 * Ms - 67.6) - 0.056 * astSin_(2 * Mj - 2 * Ms + 21) + 0.042 * astSin_(3 * Mj - 5 * Ms + 21) -
        0.036 * astSin_(Mj - 2 * Ms) + 0.022 * astCos_(Mj - Ms) + 0.023 * astSin_(2 * Mj - 3 * Ms + 52) - 0.016 * astSin_(Mj - 5 * Ms - 69);
      if (name === 'saturn') {
        lon += 0.812 * astSin_(2 * Mj - 5 * Ms - 67.6) - 0.229 * astCos_(2 * Mj - 4 * Ms - 2) + 0.119 * astSin_(Mj - 2 * Ms - 3) +
          0.046 * astSin_(2 * Mj - 6 * Ms - 69) + 0.014 * astSin_(Mj - 3 * Ms + 32);
        lat += -0.020 * astCos_(2 * Mj - 4 * Ms - 2) + 0.018 * astSin_(2 * Mj - 6 * Ms - 49);
      }
      if (name === 'uranus') lon += 0.040 * astSin_(Ms - 2 * Mu + 6) + 0.035 * astSin_(Ms - 3 * Mu + 33) - 0.015 * astSin_(Mj - Mu + 20);
    }
  }
  x = r * astCos_(lon) * astCos_(lat); y = r * astSin_(lon) * astCos_(lat); z = r * astSin_(lat);
  return { x: x, y: y, z: z, r: r };
}

/** Kinh độ hoàng đạo địa tâm biểu kiến của hành tinh (có hiệu chỉnh thời gian ánh sáng) */
function astPlanetLon_(name, d) {
  var sun = astSun_(d);
  var h = astHelio_(name, d);
  var gx = h.x + sun.x, gy = h.y + sun.y, gz = h.z;
  var dist = Math.sqrt(gx * gx + gy * gy + gz * gz);
  var tau = dist * 0.0057755183; // ngày ánh sáng/AU
  h = astHelio_(name, d - tau);
  gx = h.x + sun.x; gy = h.y + sun.y;
  return astNorm_(astAtan2_(gy, gx) - 0.0057); // quang sai hằng năm (xấp xỉ)
}

/** ΔT (giây) – đa thức NASA (Espenak & Meeus) cho 1900–2150 */
function astDeltaT_(jd) {
  var y = 2000 + (jd - 2451544.5) / 365.25, t;
  if (y < 1920) { t = y - 1900; return -2.79 + 1.494119 * t - 0.0598939 * t * t + 0.0061966 * t * t * t - 0.000197 * t * t * t * t; }
  if (y < 1941) { t = y - 1920; return 21.20 + 0.84493 * t - 0.076100 * t * t + 0.0020936 * t * t * t; }
  if (y < 1961) { t = y - 1950; return 29.07 + 0.407 * t - t * t / 233 + t * t * t / 2547; }
  if (y < 1986) { t = y - 1975; return 45.45 + 1.067 * t - t * t / 260 - t * t * t / 718; }
  if (y < 2005) { t = y - 2000; return 63.86 + 0.3345 * t - 0.060374 * t * t + 0.0017275 * t * t * t + 0.000651814 * t * t * t * t + 0.00002373599 * t * t * t * t * t; }
  if (y < 2050) { t = y - 2000; return 62.92 + 0.32217 * t + 0.005589 * t * t; }
  return -20 + 32 * Math.pow((y - 1820) / 100, 2) - 0.5628 * (2150 - y);
}

/** Mặt Trăng: kinh độ hoàng đạo biểu kiến (Meeus, chương 47 – các số hạng chính) */
var AST_MOON_TERMS = [
  // [D, M, M', F, hệ số (1e-6 độ)]
  [0, 0, 1, 0, 6288774], [2, 0, -1, 0, 1274027], [2, 0, 0, 0, 658314], [0, 0, 2, 0, 213618], [0, 1, 0, 0, -185116],
  [0, 0, 0, 2, -114332], [2, 0, -2, 0, 58793], [2, -1, -1, 0, 57066], [2, 0, 1, 0, 53322], [2, -1, 0, 0, 45758],
  [0, 1, -1, 0, -40923], [1, 0, 0, 0, -34720], [0, 1, 1, 0, -30383], [2, 0, 0, -2, 15327], [0, 0, 1, 2, -12528],
  [0, 0, 1, -2, 10980], [4, 0, -1, 0, 10675], [0, 0, 3, 0, 10034], [4, 0, -2, 0, 8548], [2, 1, -1, 0, -7888],
  [2, 1, 0, 0, -6766], [1, 0, -1, 0, -5163], [1, 1, 0, 0, 4987], [2, -1, 1, 0, 4036], [2, 0, 2, 0, 3994],
  [4, 0, 0, 0, 3861], [2, 0, -3, 0, 3665], [0, 1, -2, 0, -2689], [2, 0, -1, 2, -2602], [2, -1, -2, 0, 2390],
  [1, 0, 1, 0, -2348], [2, -2, 0, 0, 2236], [0, 1, 2, 0, -2120], [0, 2, 0, 0, -2069], [2, -2, -1, 0, 2048],
  [2, 0, 1, -2, -1773], [2, 0, 0, 2, -1595], [4, -1, -1, 0, 1215], [0, 0, 2, 2, -1110], [3, 0, -1, 0, -892],
  [2, 1, 1, 0, -810], [4, -1, -2, 0, 759], [0, 2, -1, 0, -713], [2, 2, -1, 0, -700], [2, 1, -2, 0, 691],
  [2, -1, 0, -2, 596], [4, 0, 1, 0, 549], [0, 0, 4, 0, 537], [4, -1, 0, 0, 520], [1, 0, -2, 0, -487],
  [2, 1, 0, -2, -399], [0, 0, 2, -2, -381], [1, 1, 1, 0, 351], [3, 0, -2, 0, -340], [4, 0, -3, 0, 330],
  [2, -1, 2, 0, 327], [0, 2, 1, 0, -323], [1, 1, -1, 0, 299], [2, 0, 3, 0, 294]
];
function astMoonLonJD_(jd) {
  var jde = jd + astDeltaT_(jd) / 86400;
  var T = (jde - 2451545.0) / 36525;
  var Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + T * T * T / 538841;
  var D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T + T * T * T / 545868;
  var M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T;
  var Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T + T * T * T / 69699;
  var F = 93.2720950 + 483202.0175233 * T - 0.0036539 * T * T;
  var E = 1 - 0.002516 * T - 0.0000074 * T * T;
  var sum = 0;
  for (var i = 0; i < AST_MOON_TERMS.length; i++) {
    var t = AST_MOON_TERMS[i];
    var c = t[4];
    if (Math.abs(t[1]) === 1) c *= E; else if (Math.abs(t[1]) === 2) c *= E * E;
    sum += c * astSin_(t[0] * D + t[1] * M + t[2] * Mp + t[3] * F);
  }
  var A1 = 119.75 + 131.849 * T, A2 = 53.09 + 479264.290 * T;
  sum += 3958 * astSin_(A1) + 1962 * astSin_(Lp - F) + 318 * astSin_(A2);
  var om = 125.04452 - 1934.136261 * T;
  var nut = (-17.20 * astSin_(om) - 1.32 * astSin_(2 * (280.4665 + 36000.7698 * T))) / 3600; // chương động kinh độ
  return astNorm_(Lp + sum / 1e6 + nut);
}

/** Nút Bắc thật (Meeus, chương 47) */
function astTrueNode_(jd) {
  var T = (jd - 2451545.0) / 36525;
  var om = 125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + T * T * T / 467441;
  var D = 297.8501921 + 445267.1114034 * T, M = 357.5291092 + 35999.0502909 * T,
    Mp = 134.9633964 + 477198.8675055 * T, F = 93.2720950 + 483202.0175233 * T;
  om += -1.4979 * astSin_(2 * (D - F)) - 0.1500 * astSin_(M) - 0.1226 * astSin_(2 * D) + 0.1176 * astSin_(2 * F) - 0.0801 * astSin_(2 * (Mp - F));
  return astNorm_(om);
}

/** Tất cả thiên thể tại JD (UT). Trả về {sun, earth, moon, northNode, southNode, mercury, ..., pluto} (độ) */
function astToanBo(jd) {
  var d = jd - 2451543.5;
  var sun = astNorm_(astSun_(d).lon - 0.0057);
  var nn = astTrueNode_(jd);
  var o = { sun: sun, earth: astNorm_(sun + 180), moon: astMoonLonJD_(jd), northNode: nn, southNode: astNorm_(nn + 180) };
  ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'].forEach(function (p) { o[p] = astPlanetLon_(p, d); });
  return o;
}

/** Hoàng đạo nghiêng & giờ sao */
function astObliquity_(jd) { return 23.4392911 - 0.0130042 * (jd - 2451545.0) / 36525; }
function astGMST_(jd) {
  var T = (jd - 2451545.0) / 36525;
  return astNorm_(280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - T * T * T / 38710000);
}
/** Mọc (ASC) và Thiên đỉnh (MC) */
function astGoc_(jd, lat, lon) {
  var ramc = astNorm_(astGMST_(jd) + lon), eps = astObliquity_(jd);
  var mc = astNorm_(astAtan2_(astSin_(ramc), astCos_(ramc) * astCos_(eps)));
  var asc = astNorm_(astAtan2_(astCos_(ramc), -(astSin_(ramc) * astCos_(eps) + Math.tan(lat * AST_RAD) * astSin_(eps))));
  return { asc: asc, mc: mc, ramc: ramc };
}

/** Tìm JD (UT) khi Mặt Trời ở kinh độ target, gần jdGuess (dùng cho Design 88°) */
function astTimMatTroi_(target, jdGuess) {
  var jd = jdGuess;
  for (var i = 0; i < 40; i++) {
    var diff = target - astToanBoSun_(jd);
    while (diff > 180) diff -= 360;
    while (diff < -180) diff += 360;
    if (Math.abs(diff) < 1e-7) break;
    jd += diff / 360 * 365.2422;
  }
  return jd;
}
function astToanBoSun_(jd) { return astNorm_(astSun_(jd - 2451543.5).lon - 0.0057); }

/** JD UT từ ngày giờ địa phương */
function astJD_(y, m, d, hour, minute, tz) {
  return jdFromDate(d, m, y) - 0.5 + ((hour || 0) * 60 + (minute || 0)) / 1440 - (tz || 0) / 24;
}
