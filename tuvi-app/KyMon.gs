/**
 * ============================================================
 *  KyMon.gs — KỲ MÔN ĐỘN GIÁP: LẬP BÀN (đợt 1a, chỉ phần tính)
 *  - Thời gia Kỳ Môn (mỗi giờ âm lịch một bàn), chuyển bàn.
 *  - Định cục theo phép Sách Bổ (Trích Bổ): tiết khí lấy đúng giờ giao tiết,
 *    nguyên lấy theo phù đầu (ngày Giáp/Kỷ gần nhất), không xét siêu thần/tiếp khí.
 *  - Giờ Việt Nam GMT+7. Giờ Tý muộn (23–24h) tính sang ngày hôm sau
 *    (dùng chuanHoaThoiGian_ của TuVi.gs, như Bát Tự).
 *  - Ô giữa (cung 5) gửi cung 2 (Khôn) cho cả dương lẫn âm độn: sao gốc ô giữa
 *    đi cùng sao gốc cung 2 và mang thêm can địa bàn ô giữa; cửa gốc ô giữa là cửa cung 2.
 *  - Lớp Thần dùng 8 vị cố định cho cả hai độn: dương độn đi thuận chiều kim đồng hồ,
 *    âm độn đi ngược (không đổi sang Câu Trần, Chu Tước).
 *  - Tuần không lấy theo tuần của trụ giờ; mã tinh lấy theo chi giờ.
 *  - Giờ giao tiết tính bằng kinh độ mặt trời VSOP87 rút gọn (Meeus, chương 32)
 *    + chương động + quang sai + ΔT (astDeltaT_ trong Astro.gs): sai dưới 1 phút
 *    so với lịch thiên văn, đủ cho ca sát giờ giao tiết.
 *  Đối chiếu tự động: tests/ky-mon.js (dữ liệu mẫu tests/du-lieu/ky-mon-doi-chieu.json).
 *  Chưa có hàm công khai, chưa có văn luận, chưa bán.
 * ============================================================
 */

/* ---------- Hằng số bàn ---------- */
// 9 can theo thứ tự xếp lớp Đất: Mậu, Kỷ, Canh, Tân, Nhâm, Quý (lục nghi), Đinh, Bính, Ất (tam kỳ) – chỉ số theo CAN
var KM_NGHI = [4, 5, 6, 7, 8, 9, 3, 2, 1];
// Vòng 8 ô theo chiều kim đồng hồ (Lạc Thư, phương Nam ở trên): 1 → 8 → 3 → 4 → 9 → 2 → 7 → 6
var KM_VONG = [1, 8, 3, 4, 9, 2, 7, 6];
var KM_HUONG = { 1: 'Bắc', 2: 'Tây Nam', 3: 'Đông', 4: 'Đông Nam', 5: 'Giữa', 6: 'Tây Bắc', 7: 'Tây', 8: 'Đông Bắc', 9: 'Nam' };
var KM_QUAI = { 1: 'Khảm', 2: 'Khôn', 3: 'Chấn', 4: 'Tốn', 5: 'Trung', 6: 'Càn', 7: 'Đoài', 8: 'Cấn', 9: 'Ly' };
// Cửu tinh: chỉ số = số ô gốc − 1
var KM_SAO = ['Thiên Bồng', 'Thiên Nhuế', 'Thiên Xung', 'Thiên Phụ', 'Thiên Cầm', 'Thiên Tâm', 'Thiên Trụ', 'Thiên Nhậm', 'Thiên Anh'];
// Bát môn và ô gốc
var KM_MON = ['Hưu', 'Sinh', 'Thương', 'Đỗ', 'Cảnh', 'Tử', 'Kinh', 'Khai'];
var KM_MON_GOC = { 1: 0, 8: 1, 3: 2, 4: 3, 9: 4, 2: 5, 7: 6, 6: 7 };   // ô → chỉ số cửa gốc
// Bát thần theo thứ tự xếp
var KM_THAN = ['Trực Phù', 'Đằng Xà', 'Thái Âm', 'Lục Hợp', 'Bạch Hổ', 'Huyền Vũ', 'Cửu Địa', 'Cửu Thiên'];
// Chi → ô (để đặt mã tinh, tuần không)
var KM_CHI_CUNG = [1, 8, 8, 3, 4, 4, 9, 2, 2, 7, 6, 6];
var KM_NGUYEN = ['Thượng nguyên', 'Trung nguyên', 'Hạ nguyên'];
// Số cục [thượng, trung, hạ] theo 24 tiết, thứ tự như TIET_KHI (Lunar.gs) – bắt đầu từ Xuân Phân (0°)
var KM_CUC = [
  [3, 9, 6], [4, 1, 7], [5, 2, 8], [4, 1, 7], [5, 2, 8], [6, 3, 9],    // Xuân Phân … Mang Chủng (dương)
  [9, 3, 6], [8, 2, 5], [7, 1, 4], [2, 5, 8], [1, 4, 7], [9, 3, 6],    // Hạ Chí … Bạch Lộ (âm)
  [7, 1, 4], [6, 9, 3], [5, 8, 2], [6, 9, 3], [5, 8, 2], [4, 7, 1],    // Thu Phân … Đại Tuyết (âm)
  [1, 7, 4], [2, 8, 5], [3, 9, 6], [8, 5, 2], [9, 6, 3], [1, 7, 4]     // Đông Chí … Kinh Trập (dương)
];

/* ---------- Kinh độ mặt trời chính xác (VSOP87 rút gọn, Meeus bảng 32.A) ---------- */
// Mỗi dòng [A, B, C]: A·cos(B + C·τ), τ = nghìn năm Julius kể từ J2000 (TT)
var KM_VSOP_L = [
  [[175347046, 0, 0], [3341656, 4.6692568, 6283.07585], [34894, 4.6261, 12566.1517], [3497, 2.7441, 5753.3849],
    [3418, 2.8289, 3.5231], [3136, 3.6277, 77713.7715], [2676, 4.4181, 7860.4194], [2343, 6.1352, 3930.2097],
    [1324, 0.7425, 11506.7698], [1273, 2.0371, 529.691], [1199, 1.1096, 1577.3435], [990, 5.233, 5884.927],
    [902, 2.045, 26.298], [857, 3.508, 398.149], [780, 1.179, 5223.694], [753, 2.533, 5507.553],
    [505, 4.583, 18849.228], [492, 4.205, 775.523], [357, 2.92, 0.067], [317, 5.849, 11790.629],
    [284, 1.899, 796.298], [271, 0.315, 10977.079], [243, 0.345, 5486.778], [206, 4.806, 2544.314],
    [205, 1.869, 5573.143], [202, 2.458, 6069.777], [156, 0.833, 213.299], [132, 3.411, 2942.463],
    [126, 1.083, 20.775], [115, 0.645, 0.98], [103, 0.636, 4694.003], [102, 0.976, 15720.839],
    [102, 4.267, 7.114], [99, 6.21, 2146.17], [98, 0.68, 155.42], [86, 5.98, 161000.69],
    [85, 1.3, 6275.96], [85, 3.67, 71430.7], [80, 1.81, 17260.15], [79, 3.04, 12036.46],
    [75, 1.76, 5088.63], [74, 3.5, 3154.69], [74, 4.68, 801.82], [70, 0.83, 9437.76],
    [62, 3.98, 8827.39], [61, 1.82, 7084.9], [57, 2.78, 6286.6], [56, 4.39, 14143.5],
    [56, 3.47, 6279.55], [52, 0.19, 12139.55], [52, 1.33, 1748.02], [51, 0.28, 5856.48],
    [49, 0.49, 1194.45], [41, 5.37, 8429.24], [41, 2.4, 19651.05], [39, 6.17, 10447.39],
    [37, 6.04, 10213.29], [37, 2.57, 1059.38], [36, 1.71, 2352.87], [36, 1.78, 6812.77],
    [33, 0.59, 17789.85], [30, 0.44, 83996.85], [30, 2.74, 1349.87], [25, 3.16, 4690.48]],
  [[628331966747, 0, 0], [206059, 2.678235, 6283.07585], [4303, 2.6351, 12566.1517], [425, 1.59, 3.523],
    [119, 5.796, 26.298], [109, 2.966, 1577.344], [93, 2.59, 18849.23], [72, 1.14, 529.69],
    [68, 1.87, 398.15], [67, 4.41, 5507.55], [59, 2.89, 5223.69], [56, 2.17, 155.42],
    [45, 0.4, 796.3], [36, 0.47, 775.52], [29, 2.65, 7.11], [21, 5.34, 0.98],
    [19, 1.85, 5486.78], [19, 4.97, 213.3], [17, 2.99, 6275.96], [16, 0.03, 2544.31],
    [16, 1.43, 2146.17], [15, 1.21, 10977.08], [12, 2.83, 1748.02], [12, 3.26, 5088.63],
    [12, 5.27, 1194.45], [12, 2.08, 4694], [11, 0.77, 553.57], [10, 1.3, 6286.6],
    [10, 4.24, 1349.87], [9, 2.7, 242.73], [9, 5.64, 951.72], [8, 5.3, 2352.87],
    [6, 2.65, 9437.76], [6, 4.67, 4690.48]],
  [[52919, 0, 0], [8720, 1.0721, 6283.0758], [309, 0.867, 12566.152], [27, 0.05, 3.52],
    [16, 5.19, 26.3], [16, 3.68, 155.42], [10, 0.76, 18849.23], [9, 2.06, 77713.77],
    [7, 0.83, 775.52], [5, 4.66, 1577.34], [4, 1.03, 7.11], [4, 3.44, 5573.14],
    [3, 5.14, 796.3], [3, 6.05, 5507.55], [3, 1.19, 242.73], [3, 6.12, 529.69],
    [3, 0.31, 398.15], [3, 2.28, 553.57], [2, 4.38, 5223.69], [2, 3.75, 0.98]],
  [[289, 5.844, 6283.076], [35, 0, 0], [17, 5.49, 12566.15], [3, 5.2, 155.42],
    [1, 4.72, 3.52], [1, 5.3, 18849.23], [1, 5.97, 242.73]],
  [[114, 3.142, 0], [8, 4.13, 6283.08], [1, 3.84, 12566.15]],
  [[1, 3.14, 0]]
];

/** Kinh độ hoàng đạo biểu kiến của mặt trời (độ, 0..360) tại JD theo giờ UT */
function kmKinhDoMatTroi_(jdUT) {
  var jde = jdUT + astDeltaT_(jdUT) / 86400;
  var tau = (jde - 2451545) / 365250, T = tau * 10, dr = Math.PI / 180;
  var L = 0, p = 1;
  for (var i = 0; i < KM_VSOP_L.length; i++) {
    var s = 0, a = KM_VSOP_L[i];
    for (var j = 0; j < a.length; j++) s += a[j][0] * Math.cos(a[j][1] + a[j][2] * tau);
    L += s * p;
    p *= tau;
  }
  L = L / 1e8 / dr + 180;                                    // địa tâm (độ)
  L -= 0.09033 / 3600;                                       // đổi sang hệ FK5
  var om = (125.04452 - 1934.136261 * T) * dr;
  var Ls = (280.4665 + 36000.7698 * T) * dr, Lm = (218.3165 + 481267.8813 * T) * dr;
  L += (-17.2 * Math.sin(om) - 1.32 * Math.sin(2 * Ls) - 0.23 * Math.sin(2 * Lm) + 0.21 * Math.sin(2 * om)) / 3600;   // chương động
  L -= 20.4898 / 3600;                                       // quang sai (bỏ qua biến thiên khoảng cách ±1,7%)
  L = L % 360;
  return L < 0 ? L + 360 : L;
}

/** JD (UT) lúc mặt trời tới kinh độ deg (bội của 15°), tìm gần jdGuess */
function kmGiaoTiet_(deg, jdGuess) {
  var jd = jdGuess;
  for (var i = 0; i < 40; i++) {
    var d = deg - kmKinhDoMatTroi_(jd);
    while (d > 180) d -= 360;
    while (d < -180) d += 360;
    jd += d / 360 * 365.2422;
    if (Math.abs(d) < 1e-7) break;
  }
  return jd;
}

/** 24 giờ giao tiết trong năm dương lịch nam (giờ Việt Nam), sắp theo thời gian */
function kmTietKhiNam_(nam) {
  var ds = [], jd0 = jdFromDate(1, 1, nam) - 0.5 - LUNAR_TZ / 24;
  var L0 = kmKinhDoMatTroi_(jd0), k0 = Math.floor(L0 / 15);
  for (var i = 1; i <= 25; i++) {
    var k = (k0 + i) % 24, deg = k * 15;
    var jd = kmGiaoTiet_(deg, jd0 + (i * 15 - (L0 - k0 * 15)) / 360 * 365.2422);
    var t = jdToLocalDateTime(jd, LUNAR_TZ);
    if (t.y !== nam) continue;
    ds.push({ chiSo: k, ten: TIET_KHI[k], jd: jd, nam: t.y, thang: t.m, ngay: t.d, gio: t.h, phut: t.mi });
  }
  return ds;
}

/* ---------- Lập bàn ---------- */
function kmVongIdx_(cung) { return KM_VONG.indexOf(cung === 5 ? 2 : cung); }
function kmDi_(cung, buoc, duong) { return (((cung - 1 + (duong ? buoc : -buoc)) % 9) + 9) % 9 + 1; }

/**
 * Lập bàn Kỳ Môn giờ cho một thời điểm giờ Việt Nam.
 * input: {day, month, year, hour, minute} (dương lịch; có thể calendar:'am', leap như lá số)
 * Trả về đối tượng bàn (chỉ dữ liệu, không có văn luận).
 */
function kmLap_(input) {
  var t = chuanHoaThoiGian_({ calendar: input.calendar || 'duong', day: input.day, month: input.month, year: input.year,
    hour: input.hour, minute: input.minute, leap: input.leap });
  // thời điểm vật lý theo giờ đồng hồ (giờ Tý muộn không đổi thời điểm, chỉ đổi ngày can chi)
  var jdUT = t.jdClock - 0.5 + (t.hour * 60 + t.minute) / 1440 - LUNAR_TZ / 24;
  var L = kmKinhDoMatTroi_(jdUT), k = Math.floor(L / 15) % 24;
  var jdDau = kmGiaoTiet_(k * 15, jdUT - (L - k * 15) / 360 * 365.2422);
  if (jdDau > jdUT) { k = (k + 23) % 24; jdDau = kmGiaoTiet_(k * 15, jdDau - 15.2); }   // phòng sai số đúng phút giao tiết
  var jdSau = kmGiaoTiet_(((k + 1) % 24) * 15, jdDau + 15.2);

  // Trụ ngày (đã tính Tý muộn sang hôm sau) và trụ giờ (Ngũ Thử Độn) – như batTuLap_
  var dCan = mod10(t.jd + 9), dChi = mod12(t.jd + 1);
  var hChi = Math.floor((t.hour + 1) / 2) % 12, hCan = mod10((dCan % 5) * 2 + hChi);

  // Phù đầu: ngày Giáp hoặc Kỷ gần nhất (kể cả hôm nay) → nguyên
  var lui = dCan % 5, pdCan = dCan - lui, pdChi = mod12(dChi - lui);
  var nguyen = [0, 2, 1][pdChi % 3];                        // Tý Ngọ Mão Dậu: thượng; Dần Thân Tỵ Hợi: trung; Thìn Tuất Sửu Mùi: hạ
  var duong = k >= 18 || k <= 5;                             // Đông Chí → Mang Chủng: dương độn
  var cuc = KM_CUC[k][nguyen];

  // Lớp Đất
  var dia = {}, cungCua = {};
  for (var i = 0; i < 9; i++) { var c = kmDi_(cuc, i, duong); dia[c] = KM_NGHI[i]; cungCua[KM_NGHI[i]] = c; }

  // Tuần của giờ → tuần thủ (lục nghi ẩn Giáp), tuần không
  var xun = Math.floor(canChiIndex(hCan, hChi) / 10), xunChi = mod12(xun * 10);
  var nghiTuan = KM_NGHI[xun];
  var goc = cungCua[nghiTuan];                               // ô gốc của Trực phù / Trực sử (có thể là 5)
  var canGio = hCan === 0 ? nghiTuan : hCan;
  var cungPhu = cungCua[canGio]; if (cungPhu === 5) cungPhu = 2;

  // Lớp Trời: 8 sao xoay theo vòng, mỗi sao mang can địa bàn ô gốc; sao ô giữa đi cùng sao cung 2
  var lech = (kmVongIdx_(cungPhu) - kmVongIdx_(goc) + 8) % 8;
  var sao = {}, thien = {};
  KM_VONG.forEach(function (o, j) {
    var toi = KM_VONG[(j + lech) % 8];
    sao[toi] = [o - 1]; thien[toi] = [dia[o]];
    if (o === 2) { sao[toi].push(4); thien[toi].push(dia[5]); }
  });

  // Lớp Người: Trực sử đi từ ô gốc, mỗi giờ sau giờ tuần thủ một ô theo số Lạc Thư; rơi ô 5 thì gửi cung 2
  var buoc = (hChi - xunChi + 12) % 12, cungSu = kmDi_(goc, buoc, duong);
  if (cungSu === 5) cungSu = 2;
  var monSu = KM_MON_GOC[goc === 5 ? 2 : goc];
  var lechMon = (kmVongIdx_(cungSu) - kmVongIdx_(goc) + 8) % 8, mon = {};
  KM_VONG.forEach(function (o, j) { mon[KM_VONG[(j + lechMon) % 8]] = KM_MON_GOC[o]; });

  // Lớp Thần: Trực Phù cùng ô sao Trực phù; dương thuận, âm nghịch
  var than = {}, vt = kmVongIdx_(cungPhu);
  KM_THAN.forEach(function (x, j) { than[KM_VONG[((vt + (duong ? j : -j)) % 8 + 8) % 8]] = j; });

  // Mã tinh theo chi giờ (Thân Tý Thìn → Dần, Dần Ngọ Tuất → Thân, Tỵ Dậu Sửu → Hợi, Hợi Mão Mùi → Tỵ)
  var maChi = [2, 11, 8, 5][hChi % 4];
  var khong = [mod12(xunChi + 10), mod12(xunChi + 11)];

  var cung = [];
  for (var so = 1; so <= 9; so++) {
    var o = { so: so, quai: KM_QUAI[so], huong: KM_HUONG[so], diaBan: dia[so], diaBanTen: CAN[dia[so]] };
    if (so !== 5) {
      o.thienBan = thien[so]; o.thienBanTen = thien[so].map(function (x) { return CAN[x]; });
      o.sao = sao[so]; o.saoTen = sao[so].map(function (x) { return KM_SAO[x]; });
      o.mon = mon[so]; o.monTen = KM_MON[mon[so]];
      o.than = than[so]; o.thanTen = KM_THAN[than[so]];
      o.khongVong = khong.some(function (x) { return KM_CHI_CUNG[x] === so; });
      o.maTinh = KM_CHI_CUNG[maChi] === so;
    }
    cung.push(o);
  }
  var tg = function (jd) { var x = jdToLocalDateTime(jd, LUNAR_TZ); return { nam: x.y, thang: x.m, ngay: x.d, gio: x.h, phut: x.mi }; };
  return {
    phep: 'Thời gia, chuyển bàn, Sách Bổ', muiGio: 'GMT+7',
    thoiDiem: { nam: t.solar.year, thang: t.solar.month, ngay: t.solar.day, gio: t.hour, phut: t.minute },
    tyMuon: t.hour === 23,
    tietKhi: { chiSo: k, ten: TIET_KHI[k], batDau: tg(jdDau), ketThuc: tg(jdSau) },
    ngay: { can: dCan, chi: dChi, ten: canChiText(dCan, dChi) },
    gio: { can: hCan, chi: hChi, ten: canChiText(hCan, hChi) },
    phuDau: { can: pdCan, chi: pdChi, ten: canChiText(pdCan, pdChi) },
    nguyen: nguyen, nguyenTen: KM_NGUYEN[nguyen],
    don: duong ? 'duong' : 'am', donTen: duong ? 'Dương độn' : 'Âm độn', cuc: cuc,
    tuanThu: { chi: xunChi, ten: canChiText(0, xunChi), nghi: nghiTuan, nghiTen: CAN[nghiTuan] },
    trucPhu: { sao: goc - 1, saoTen: KM_SAO[goc - 1], cungGoc: goc, cung: cungPhu },
    trucSu: { mon: monSu, monTen: KM_MON[monSu], cungGoc: goc, cung: cungSu },
    tuanKhong: { chi: khong, ten: khong.map(function (x) { return CHI[x]; }), cung: khong.map(function (x) { return KM_CHI_CUNG[x]; }) },
    maTinh: { chi: maChi, ten: CHI[maChi], cung: KM_CHI_CUNG[maChi] },
    cung: cung
  };
}
