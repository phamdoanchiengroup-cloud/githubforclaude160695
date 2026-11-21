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

/* ============================================================
 *  ĐỢT 1b – "HỎI MỘT VIỆC" (9 xu, mã km_hoi:<yyyymmddhh>:<loại>, mua theo TÀI KHOẢN – khóa 'TK:<tài khoản>')
 *  - kmDanhGia_(ban, loai): chọn dụng thần theo loại việc + chấm ra 3 mức chữ (không có %).
 *  - kyMonHoi(token, loai, thoiDiem): API công khai. Miễn phí: bàn 9 cung + 1 mức kết luận + 1 khung giờ tốt hôm nay.
 *    Đã mua (hoặc toàn quyền): thêm lời luận (kmVanLuan_ trong KyMonVan.gs nếu có), căn cứ, 3 khung giờ tốt trong 3 ngày.
 *  - "Một việc không hỏi hai lần": cùng loại việc trong cùng giờ âm lịch → mở lại bản đã mua, không trừ thêm xu.
 * ============================================================ */
/** 7 loại việc (mã trùng TI_LV_QUE của Gieo quẻ). dt = dụng thần: kieu mon|sao|can|than|ma, gt = chỉ số; w = trọng số; nguoc = yếu tố "cản" (bệnh) */
var KM_LOAI = {
  cong_viec: { ten: 'Công việc, xin việc, thăng tiến', dt: [{ kieu: 'mon', gt: 7, w: 1 }] },
  tai_loc: { ten: 'Tiền bạc, mua bán, hợp tác', dt: [{ kieu: 'mon', gt: 1, w: 1 }, { kieu: 'can', gt: 4, w: 0.6 }] },
  tinh_cam: { ten: 'Tình cảm, hẹn gặp, tái hợp', dt: [{ kieu: 'than', gt: 3, w: 1 }, { kieu: 'can', gt: 1, w: 0.4 }, { kieu: 'can', gt: 6, w: 0.4 }] },
  di_xa: { ten: 'Đi xa, xuất hành, chuyển nhà', dt: [{ kieu: 'ma', w: 1 }, { kieu: 'mon', gt: 7, w: 0.4 }] },
  suc_khoe: { ten: 'Sức khỏe và nhịp sống', dt: [{ kieu: 'sao', gt: 5, w: 1 }, { kieu: 'sao', gt: 1, w: 1, nguoc: true }] },
  kien_tung: { ten: 'Tranh chấp, kiện tụng, giấy tờ hợp đồng', dt: [{ kieu: 'mon', gt: 7, w: 1 }, { kieu: 'sao', gt: 5, w: 0.6 }, { kieu: 'mon', gt: 6, w: 0.6, nguoc: true }] },
  thi_cu: { ten: 'Thi cử, học hành, hồ sơ', dt: [{ kieu: 'mon', gt: 4, w: 1 }, { kieu: 'sao', gt: 3, w: 0.6 }, { kieu: 'can', gt: 3, w: 0.6 }] }
};
var KM_MUC = {
  thuan: { ten: 'Thuận', loi: 'Việc này đang ở thế thuận – bạn có thể tiến, giữ sự chuẩn bị chu đáo như thường lệ.' },
  thuan_dk: { ten: 'Thuận có điều kiện', loi: 'Việc này có xu hướng thuận vừa – nên chuẩn bị kỹ và làm rõ vài điểm rồi mới tiến.' },
  nen_cho: { ten: 'Nên chờ', loi: 'Việc này nên chờ thêm một thời gian – dùng lúc này để chuẩn bị, chưa nên dồn sức tiến ngay.' }
};
/** Ngưỡng điểm (nội bộ) → 3 mức, chỉnh theo từng loại việc trên 20.000 bàn ngẫu nhiên 1990–2040 để mỗi loại có
 *  khoảng 30% "thuận", 45% "thuận có điều kiện", 25% "nên chờ" (dụng thần mỗi loại có điểm nền khác nhau, vd. cửa Khai luôn là cửa tốt).
 *  diem > thuan → thuan; diem >= thuanDk → thuan_dk; còn lại nen_cho. */
var KM_NGUONG = {
  cong_viec: { thuan: 1.9, thuanDk: 0.4 }, tai_loc: { thuan: 1.34, thuanDk: 0.2 }, tinh_cam: { thuan: 0.71, thuanDk: -0.38 },
  di_xa: { thuan: 1.49, thuanDk: 0.03 }, suc_khoe: { thuan: 0.7, thuanDk: -0.3 }, kien_tung: { thuan: 1.1, thuanDk: 0.15 }, thi_cu: { thuan: 0.61, thuanDk: -0.34 }
};
var KM_HOI_GIOI_HAN = { lan: 30, giay: 600 };   // 30 lượt / 10 phút / tài khoản
var KM_HOI_PHAM_VI = { truoc: 1, sau: 3 };      // thời điểm hỏi: từ 1 ngày trước tới 3 ngày tới (không để thay thế gói "Giờ tốt 7 ngày")
var KM_LUU_Y = 'Đây là góc nhìn theo cổ học về thời điểm và hướng đi, để bạn tham khảo và tự cân nhắc. Quyết định cuối cùng là của bạn.';
var KM_LUU_Y_THEM = { suc_khoe: 'Với việc này, hãy hỏi thêm bác sĩ.', kien_tung: 'Với việc này, hãy hỏi thêm luật sư.', tai_loc: 'Với việc này, hãy hỏi thêm người có chuyên môn tài chính.' };
var KM_NHAC_HOI_LAI = 'Bàn của giờ này đã trả lời việc của bạn. Nếu tình hình thay đổi, bạn hỏi lại sau ít nhất một ngày.';
// Ngũ hành: 0 Mộc, 1 Hỏa, 2 Thổ, 3 Kim, 4 Thủy
var KM_HANH_CUNG = { 1: 4, 2: 2, 3: 0, 4: 0, 5: 2, 6: 3, 7: 3, 8: 2, 9: 1 };
var KM_MON_NHA = [1, 8, 3, 4, 9, 2, 7, 6];        // cửa → ô gốc (hành của cửa = hành ô gốc)
var KM_MON_CAT = [1, 1, -1, 0, 0, -1, -1, 1];     // Hưu, Sinh, Khai tốt; Thương, Tử, Kinh xấu; Đỗ, Cảnh trung
var KM_SAO_CAT = [-0.5, -0.5, 0, 0.5, 0.5, 0.5, -0.5, 0.5, 0];   // Phụ, Cầm, Tâm, Nhậm tốt; Bồng, Nhuế, Trụ xấu
var KM_THAN_CAT = [0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5];   // Trực Phù, Thái Âm, Lục Hợp, Cửu Địa, Cửu Thiên tốt
var KM_MON_NGHIA = ['cửa của nghỉ ngơi, hòa hoãn', 'cửa của sinh sôi, tiền vào', 'cửa của va chạm, tổn hao', 'cửa của che chắn, bế tắc',
  'cửa của sáng tỏ, giấy tờ, danh tiếng', 'cửa của dừng lại, kết thúc', 'cửa của lo lắng, tranh cãi', 'cửa của khởi đầu, công danh'];
var KM_SAO_NGHIA = ['sao của mạo hiểm, mưu tính', 'sao của mệt mỏi, cần chăm sóc', 'sao của hành động nhanh', 'sao của học hành, văn chương',
  'sao của trung tâm, ổn định', 'sao của thầy thuốc, người có lý', 'sao của trì trệ, phá vỡ', 'sao của nhẫn nại, tích lũy', 'sao của bộc lộ, nóng vội'];
var KM_THAN_NGHIA = ['thần của quý nhân, người che chở', 'thần của rối rắm, lo nghĩ', 'thần của âm thầm, kín đáo giúp đỡ', 'thần của hòa hợp, gặp gỡ',
  'thần của sức ép, va chạm', 'thần của mập mờ, thiếu rõ ràng', 'thần của vững chãi, giữ gìn', 'thần của vươn xa, mở rộng'];

function kmSinh_(a, b) { return (a + 1) % 5 === b; }
function kmKhac_(a, b) { return (a + 2) % 5 === b; }
/** Hành của mùa theo tiết khí (tháng tiết: Dần Mão Mộc, Tỵ Ngọ Hỏa, Thân Dậu Kim, Hợi Tý Thủy, Thìn Tuất Sửu Mùi Thổ) */
function kmHanhMua_(k) { var chi = (Math.floor(((k - 21 + 24) % 24) / 2) + 2) % 12; return [4, 2, 0, 0, 2, 1, 1, 2, 3, 3, 2, 4][chi]; }
function kmCungCua_(ban, so) { return ban.cung[so - 1]; }
/** Ô (1–9, ô giữa gửi 2) chứa dụng thần trên bàn */
function kmTimCung_(ban, d) {
  if (d.kieu === 'ma') return ban.maTinh.cung === 5 ? 2 : ban.maTinh.cung;
  for (var i = 0; i < 9; i++) {
    var o = ban.cung[i]; if (o.so === 5) continue;
    if (d.kieu === 'mon' && o.mon === d.gt) return o.so;
    if (d.kieu === 'than' && o.than === d.gt) return o.so;
    if (d.kieu === 'sao' && o.sao.indexOf(d.gt) >= 0) return o.so;
    if (d.kieu === 'can' && o.thienBan.indexOf(d.gt) >= 0) return o.so;
  }
  return 2;
}
function kmTenDt_(d, ban) {
  if (d.kieu === 'mon') return 'cửa ' + KM_MON[d.gt] + ' (' + KM_MON_NGHIA[d.gt] + ')';
  if (d.kieu === 'sao') return 'sao ' + KM_SAO[d.gt] + ' (' + KM_SAO_NGHIA[d.gt] + ')';
  if (d.kieu === 'than') return 'thần ' + KM_THAN[d.gt] + ' (' + KM_THAN_NGHIA[d.gt] + ')';
  if (d.kieu === 'can') return 'can ' + CAN[d.gt];
  return 'ngựa (dịch mã – sự di chuyển) ở chi ' + ban.maTinh.ten;
}
/**
 * Chọn dụng thần và chấm mức cho một loại việc trên một bàn. Trả về
 * { muc, diem, nguoiHoi: {can, canTen, cung, huong}, dungThan: [{kieu, gt, ten, cung, huong, vai, nguoc}], ly: [{k, cung, huong, diem, ta}] }
 * Người hỏi = can ngày trên lớp Trời (Giáp ngày lấy lục nghi ẩn của tuần ngày). diem chỉ dùng nội bộ (không đưa ra giao diện).
 */
function kmDanhGia_(ban, loai) {
  var L = KM_LOAI[loai]; if (!L) throw new Error('Loại việc không hợp lệ.');
  var mua = kmHanhMua_(ban.tietKhi.chiSo), ly = [], tong = 0, tongW = 0;
  var canNg = ban.ngay.can === 0 ? KM_NGHI[Math.floor(canChiIndex(ban.ngay.can, ban.ngay.chi) / 10)] : ban.ngay.can;
  var cungQ = kmTimCung_(ban, { kieu: 'can', gt: canNg }), hQ = KM_HANH_CUNG[cungQ];
  function them(k, so, d, ta) { ly.push({ k: k, cung: so, huong: KM_HUONG[so], diem: d, ta: ta }); return d; }
  var dts = L.dt.map(function (d, i) {
    var so = kmTimCung_(ban, d), o = kmCungCua_(ban, so), hX = KM_HANH_CUNG[so], s = 0, ten = kmTenDt_(d, ban);
    if (!d.nguoc) {
      var c = KM_MON_CAT[o.mon]; if (c) s += them(c > 0 ? 'mon_tot' : 'mon_xau', so, c, 'Ô của ' + ten + ' gặp cửa ' + o.monTen + ' (' + KM_MON_NGHIA[o.mon] + ')');
      var hm = KM_HANH_CUNG[KM_MON_NHA[o.mon]];
      if (kmKhac_(hm, hX)) s += them('mon_buc', so, -0.5, 'Cửa ' + o.monTen + ' khắc ô ' + o.huong + ' (môn bức – việc dễ bị ép, khó thông)');
      else if (kmSinh_(hX, hm) || hm === hX) s += them('mon_dac', so, 0.3, 'Cửa ' + o.monTen + ' hợp với ô ' + o.huong + ' (cửa được ô nâng đỡ)');
      var sc = 0; o.sao.forEach(function (x) { sc += KM_SAO_CAT[x]; }); sc = Math.max(-0.5, Math.min(0.5, sc));
      if (sc) s += them(sc > 0 ? 'sao_tot' : 'sao_xau', so, sc, 'Ô này có ' + o.saoTen.join(', ') + ' (' + KM_SAO_NGHIA[o.sao[0]] + ')');
      var hs = KM_HANH_CUNG[o.sao[0] + 1], vs = hs === mua || kmSinh_(mua, hs) ? 0.4 : kmKhac_(mua, hs) || kmKhac_(hs, mua) ? -0.4 : 0;
      if (vs) s += them(vs > 0 ? 'sao_vuong' : 'sao_suy', so, vs, vs > 0 ? 'Sao ở ô này đang được mùa nâng đỡ (vượng, tướng)' : 'Sao ở ô này đang lúc yếu theo mùa (tù, tử)');
      var tc = KM_THAN_CAT[o.than];
      s += them(tc > 0 ? 'than_tot' : 'than_xau', so, tc, 'Ô này có thần ' + o.thanTen + ' (' + KM_THAN_NGHIA[o.than] + ')');
      var ht = Math.floor(o.thienBan[0] / 2), hd = Math.floor(o.diaBan / 2);
      if (kmSinh_(ht, hd) || kmSinh_(hd, ht) || ht === hd) s += them('can_sinh', so, 0.3, 'Can lớp Trời ' + o.thienBanTen[0] + ' và can lớp Đất ' + o.diaBanTen + ' hòa hợp (trên dưới cùng chiều)');
      else s += them('can_khac', so, -0.3, 'Can lớp Trời ' + o.thienBanTen[0] + ' và can lớp Đất ' + o.diaBanTen + ' khắc nhau (trên dưới không cùng chiều)');
      if (o.khongVong) s += them('khong_vong', so, -1, 'Ô này rơi vào tuần không (việc dễ "rỗng", hứa nhiều mà chưa thành)');
      if (o.maTinh && loai === 'di_xa') s += them('ma_tinh', so, 0.5, 'Ô này có ngựa (dịch mã – thuận cho di chuyển)');
      if (so === cungQ) s += them('cung_nguoi_hoi', so, 1, 'Việc nằm ngay ô của người hỏi (việc ở trong tầm tay)');
      else if (kmSinh_(hX, hQ)) s += them('cung_sinh_nguoi', so, 1, 'Ô của việc sinh cho ô người hỏi (việc tự tìm đến, có lợi cho bạn)');
      else if (hX === hQ) s += them('cung_hoa', so, 0.5, 'Ô của việc cùng hành với ô người hỏi (hai bên ngang nhau)');
      else if (kmKhac_(hQ, hX)) s += them('nguoi_khac_cung', so, 0.3, 'Ô người hỏi khắc ô của việc (bạn nắm phần chủ động nhưng phải bỏ sức)');
      else if (kmKhac_(hX, hQ)) s += them('cung_khac_nguoi', so, -1, 'Ô của việc khắc ô người hỏi (việc gây sức ép lên bạn)');
      else s += them('nguoi_sinh_cung', so, -0.3, 'Ô người hỏi sinh cho ô của việc (bạn phải bỏ công sức nhiều)');
    } else {   // yếu tố cản (bệnh khí, tranh cãi): càng yếu, càng xa người hỏi càng tốt
      if (o.khongVong) s += them('can_tro_khong', so, 1, 'Yếu tố cản (' + ten + ') rơi vào tuần không – sức cản giảm');
      var hn = d.kieu === 'sao' ? KM_HANH_CUNG[d.gt + 1] : KM_HANH_CUNG[KM_MON_NHA[d.gt]];
      if (hn === mua || kmSinh_(mua, hn)) s += them('can_tro_vuong', so, -0.5, 'Yếu tố cản (' + ten + ') đang mạnh theo mùa');
      else s += them('can_tro_suy', so, 0.4, 'Yếu tố cản (' + ten + ') đang yếu theo mùa');
      if (so === cungQ || kmKhac_(hX, hQ)) s += them('can_tro_sat', so, -1, 'Yếu tố cản (' + ten + ') áp sát hoặc khắc ô người hỏi');
      else if (kmKhac_(hQ, hX)) s += them('can_tro_bi_che', so, 0.8, 'Ô người hỏi khắc được yếu tố cản (' + ten + ') – bạn chế ngự được');
    }
    tong += s * d.w; tongW += d.w;
    return { kieu: d.kieu, gt: d.gt == null ? null : d.gt, ten: ten, cung: so, huong: KM_HUONG[so], vai: i === 0 ? 'chinh' : 'phu', nguoc: !!d.nguoc };
  });
  var diem = tongW ? tong / tongW : 0;
  // Phục ngâm (sao Trực phù nằm yên ở ô gốc) / phản ngâm (đối ô gốc): việc trì trệ hoặc đảo lộn
  var tp = ban.trucPhu, goc = tp.cungGoc === 5 ? 2 : tp.cungGoc;
  if (tp.cung === goc) diem += them('phuc_ngam', tp.cung, -0.5, 'Bàn phục ngâm (sao chủ bàn nằm yên chỗ cũ – việc dễ trì trệ, nên giữ hơn là đổi)');
  else if (tp.cung === 10 - goc) diem += them('phan_ngam', tp.cung, -0.5, 'Bàn phản ngâm (sao chủ bàn ở phía đối diện – việc dễ đảo chiều, cần dự phòng)');
  var N = KM_NGUONG[loai], muc = diem > N.thuan + 1e-9 ? 'thuan' : diem >= N.thuanDk - 1e-9 ? 'thuan_dk' : 'nen_cho';
  return { muc: muc, diem: Math.round(diem * 100) / 100, nguoiHoi: { can: canNg, canTen: CAN[canNg], cung: cungQ, huong: KM_HUONG[cungQ] }, dungThan: dts, ly: ly };
}

/* ---------- Thời điểm giờ VN, giờ âm lịch, mã km_hoi ---------- */
/** Giờ VN dạng Date "giả UTC" (đọc bằng getUTC*) – không phụ thuộc múi giờ máy chạy */
function kmBayGio_() { return new Date(Date.now() + LUNAR_TZ * 3600e3); }
function kmTuDate_(d) { return { day: d.getUTCDate(), month: d.getUTCMonth() + 1, year: d.getUTCFullYear(), hour: d.getUTCHours(), minute: d.getUTCMinutes() }; }
function kmThoiDiem_(t, boPhamVi) {   // boPhamVi = true: chỉ kiểm hợp lệ (để mở lại lượt đã mua cũ hơn 1 ngày)
  var bay = kmBayGio_();
  if (t == null || t === '' || (typeof t === 'object' && t.day == null)) { return kmTuDate_(bay); }
  if (typeof t !== 'object') throw new Error('Thời điểm không hợp lệ.');
  var o = { day: Math.floor(+t.day), month: Math.floor(+t.month), year: Math.floor(+t.year), hour: Math.floor(+t.hour || 0), minute: Math.floor(+t.minute || 0) };
  if (!(o.year >= 1900 && o.year <= 2100 && o.month >= 1 && o.month <= 12 && o.day >= 1 && o.day <= 31 && o.hour >= 0 && o.hour <= 23 && o.minute >= 0 && o.minute <= 59)) throw new Error('Thời điểm không hợp lệ.');
  var d = new Date(Date.UTC(o.year, o.month - 1, o.day, o.hour, o.minute));
  if (d.getUTCDate() !== o.day) throw new Error('Ngày không có thật.');
  var lech = (d - bay) / 864e5;
  if (!boPhamVi && (lech < -KM_HOI_PHAM_VI.truoc || lech > KM_HOI_PHAM_VI.sau)) throw new Error('Chỉ hỏi được cho thời điểm từ ' + KM_HOI_PHAM_VI.truoc + ' ngày trước đến ' + KM_HOI_PHAM_VI.sau + ' ngày tới.');
  return o;
}
/** Giờ âm lịch chứa thời điểm: { chi, ten, tu, den, batDau: Date giả UTC lúc bắt đầu } – Tý = 23:00–01:00 */
function kmGioAm_(o) {
  var d = new Date(Date.UTC(o.year, o.month - 1, o.day, o.hour, o.minute)), chi = Math.floor((o.hour + 1) / 2) % 12;
  var bd = new Date(d.getTime()); bd.setUTCMinutes(0);
  if (o.hour % 2 === 0) bd.setUTCHours(bd.getUTCHours() - 1);   // giờ chẵn: giờ âm bắt đầu từ giờ lẻ trước đó (0h → 23h hôm trước)
  var p = function (n) { return (n < 10 ? '0' : '') + n; }, h0 = bd.getUTCHours();
  return { chi: chi, ten: CHI[chi], tu: p(h0) + ':00', den: p((h0 + 2) % 24) + ':00', batDau: bd };
}
function kmMaHoi_(o, loai) {
  var b = kmGioAm_(o).batDau, p = function (n) { return (n < 10 ? '0' : '') + n; };
  return 'km_hoi:' + b.getUTCFullYear() + p(b.getUTCMonth() + 1) + p(b.getUTCDate()) + p(b.getUTCHours()) + ':' + loai;
}
function kmNgayStr_(o) { var p = function (n) { return (n < 10 ? '0' : '') + n; }; return o.year + '-' + p(o.month) + '-' + p(o.day); }
/** Gần giờ giao tiết (±2 giờ) → giao diện hiện nhãn "giờ giao tiết, nên xem thêm giờ sau" */
function kmGanGiaoTiet_(ban) {
  var t = Date.UTC(ban.thoiDiem.nam, ban.thoiDiem.thang - 1, ban.thoiDiem.ngay, ban.thoiDiem.gio, ban.thoiDiem.phut);
  return [ban.tietKhi.batDau, ban.tietKhi.ketThuc].some(function (x) { return Math.abs(Date.UTC(x.nam, x.thang - 1, x.ngay, x.gio, x.phut) - t) < 2 * 3600e3; });
}
/** 12 giờ âm lịch của một ngày đồng hồ (Tý = 00:00–01:00 phần đầu ngày, lập bàn lúc 00:30): [{gioAm, ban, dg}] */
function kmQuetNgay_(ngay, loai) {
  var out = [];
  for (var i = 0; i < 12; i++) {
    var o = { day: ngay.day, month: ngay.month, year: ngay.year, hour: 2 * i, minute: i === 0 ? 30 : 0 };
    var ban = kmLap_(o);
    out.push({ o: o, gioAm: kmGioAm_(o), ban: ban, dg: kmDanhGia_(ban, loai) });
  }
  return out;
}
function kmKhung_(x, ngay) {
  return { ngay: kmNgayStr_(ngay), chi: x.gioAm.chi, ten: 'giờ ' + x.gioAm.ten, tu: x.gioAm.tu, den: x.gioAm.den,
    huong: x.dg.dungThan[0].huong, muc: x.dg.muc, mucTen: KM_MUC[x.dg.muc].ten };
}
/** 1 khung giờ tốt nhất trong ngày của thời điểm hỏi (còn lại sau giờ hiện tại nếu là hôm nay; hết giờ thì sang ngày mai) – có cache 6 giờ */
function kmGioTot_(o, loai) {
  var bay = kmTuDate_(kmBayGio_()), ngay = { day: o.day, month: o.month, year: o.year }, homNay = kmNgayStr_(ngay) === kmNgayStr_(bay);
  var phutNay = bay.hour * 60 + bay.minute;
  if (homNay && phutNay >= 23 * 60) { var mai = new Date(Date.UTC(o.year, o.month - 1, o.day + 1)); ngay = { day: mai.getUTCDate(), month: mai.getUTCMonth() + 1, year: mai.getUTCFullYear() }; homNay = false; }
  var ck = 'KMG_' + kmNgayStr_(ngay) + '_' + loai + (homNay ? '_' + bay.hour : ''), c = null;
  try { c = CacheService.getScriptCache(); var v = c.get(ck); if (v) return JSON.parse(v); } catch (e) { c = null; }
  var ds = kmQuetNgay_(ngay, loai).filter(function (x, i) { return !homNay || (i === 0 ? 60 : 2 * i * 60 + 60) > phutNay; });
  var tot = ds.reduce(function (a, x) { return !a || x.dg.diem > a.dg.diem ? x : a; }, null);
  var kq = kmKhung_(tot, ngay);
  try { if (c) c.put(ck, JSON.stringify(kq), 21600); } catch (e) { /* bỏ qua */ }
  return kq;
}
/** Phần trả phí: 3 khung giờ tốt trong 3 ngày (từ ngày hỏi), mỗi ngày 1 khung tốt nhất, xếp hạng tốt nhất trước */
function kmKhungTot3Ngay_(o, loai) {
  var bay = kmTuDate_(kmBayGio_()), tNay = Date.UTC(bay.year, bay.month - 1, bay.day, bay.hour, bay.minute), out = [];
  for (var k = 0; k < 3; k++) {
    var d = new Date(Date.UTC(o.year, o.month - 1, o.day + k)), ngay = { day: d.getUTCDate(), month: d.getUTCMonth() + 1, year: d.getUTCFullYear() };
    var ds = kmQuetNgay_(ngay, loai).filter(function (x, i) { return Date.UTC(ngay.year, ngay.month - 1, ngay.day, i === 0 ? 1 : 2 * i + 1) > tNay; });
    var tot = ds.reduce(function (a, x) { return !a || x.dg.diem > a.dg.diem ? x : a; }, null);
    if (tot) { var k1 = kmKhung_(tot, ngay); k1.diem = tot.dg.diem; out.push(k1); }
  }
  out.sort(function (a, b) { return b.diem - a.diem || (a.ngay < b.ngay ? -1 : 1); });   // xếp hạng: khung tốt nhất trước
  out.forEach(function (k) { delete k.diem; });
  return out;
}
/** Bàn rút gọn để hiển thị (bỏ dữ liệu thừa, giữ đủ 9 ô) */
function kmBanGon_(b) {
  return { phep: b.phep, muiGio: b.muiGio, thoiDiem: b.thoiDiem, tyMuon: b.tyMuon, tietKhi: { ten: b.tietKhi.ten, batDau: b.tietKhi.batDau, ketThuc: b.tietKhi.ketThuc },
    ngay: b.ngay.ten, gio: b.gio.ten, don: b.don, donTen: b.donTen, cuc: b.cuc, nguyenTen: b.nguyenTen,
    trucPhu: { saoTen: b.trucPhu.saoTen, cung: b.trucPhu.cung }, trucSu: { monTen: b.trucSu.monTen, cung: b.trucSu.cung },
    tuanKhong: { ten: b.tuanKhong.ten, cung: b.tuanKhong.cung }, maTinh: { ten: b.maTinh.ten, cung: b.maTinh.cung },
    cung: b.cung.map(function (o) {
      var x = { so: o.so, quai: o.quai, huong: o.huong, diaBan: o.diaBanTen };
      if (o.so !== 5) { x.thienBan = o.thienBanTen; x.sao = o.saoTen; x.mon = o.monTen; x.than = o.thanTen; x.khongVong = o.khongVong; x.maTinh = o.maTinh; }
      return x;
    }) };
}
/** Gói kết quả chấm theo khuôn kmVanLuan_ (KyMonVan.gs) cần: dungThan là MỘT đối tượng (dụng thần chính), ly là mảng MÃ,
 *  gioTot là các khung {nam, thang, ngay, chi, huong}. Kèm nguyên bản (dungThanDs, nguoiHoi, khungTot) để văn dùng thêm nếu cần. */
function kmGoiVan_(ban, dg, khung) {
  var dc = dg.dungThan[0], ma = [];
  dg.ly.forEach(function (x) { if ((x.cung === dc.cung && !/^can_tro/.test(x.k)) || x.k === 'phuc_ngam' || x.k === 'phan_ngam') if (ma.indexOf(x.k) < 0) ma.push(x.k); });
  if (kmGanGiaoTiet_(ban)) ma.push('giao_tiet');
  var co = function (k) { return ma.indexOf(k) >= 0; };
  return { dungThan: { cung: dc.cung, huong: dc.huong, kieu: dc.kieu, ten: dc.ten,
      monKhac: co('mon_buc') ? true : co('mon_dac') ? false : undefined, saoVuong: co('sao_vuong') ? true : co('sao_suy') ? false : undefined },
    ly: ma, gioTot: (khung || []).map(function (k) { var p = k.ngay.split('-'); return { nam: +p[0], thang: +p[1], ngay: +p[2], chi: k.chi, huong: k.huong }; }),
    choDen: dg.muc === 'nen_cho' ? kmChoDen_(ban, khung) : undefined,
    nguoiHoi: dg.nguoiHoi, dungThanDs: dg.dungThan, khungTot: khung || [] };
}
/** Mức "nên chờ": chờ đến ngày sớm nhất trong 3 ngày có khung không còn "nên chờ"; không có thì 3 ngày sau lúc hỏi */
function kmChoDen_(ban, khung) {
  var ds = (khung || []).filter(function (k) { return k.muc !== 'nen_cho'; }).map(function (k) { return k.ngay; }).sort();
  if (ds.length) { var p = ds[0].split('-'); return { nam: +p[0], thang: +p[1], ngay: +p[2] }; }
  var d = new Date(Date.UTC(ban.thoiDiem.nam, ban.thoiDiem.thang - 1, ban.thoiDiem.ngay + 3));
  return { nam: d.getUTCFullYear(), thang: d.getUTCMonth() + 1, ngay: d.getUTCDate() };
}
/** Lời luận (đã mua): gọi kmVanLuan_(ban, loai, muc, danhGia) của KyMonVan.gs nếu có; lỗi hoặc chưa có → khung rỗng */
function kmLuan_(ban, loai, muc, danhGia) {
  var rong = { ketLuan: '', canCu: [], viec: [] };
  if (typeof kmVanLuan_ !== 'function') { rong.chuaCoVan = true; return rong; }
  try { var v = kmVanLuan_(ban, loai, muc, danhGia); return v && typeof v === 'object' ? v : rong; }
  catch (e) { rong.loiVan = true; return rong; }
}
/** Lượt đã mua: dòng MoKhoa khóa 'TK:<tài khoản>', phần = mã km_hoi; cột 6 lưu thời điểm đã hỏi "…@yyyy-mm-dd hh:mm" để mở lại đúng bàn */
function kmDaMua_(ten, ma) {
  var sh = ttSheet_('MoKhoa'), td = null, co = false;
  ttTim_(sh, 3, 'TK:' + ten).forEach(function (r) {
    var v = sh.getRange(r, 2, 1, 5).getValues()[0];
    if (String(v[0]) !== ten || String(v[2]) !== ma) return;
    co = true; var m = String(v[4]).match(/@(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/);
    if (m && !td) td = { year: +m[1], month: +m[2], day: +m[3], hour: +m[4], minute: +m[5] };
  });
  return co ? { thoiDiem: td } : null;
}
function kmGioiHan_(u) {
  if (ttToanQuyen_(u)) return;
  var c = CacheService.getScriptCache(), k = 'KMH_' + u.ten, now = Date.now(), v = null;
  try { v = JSON.parse(c.get(k) || 'null'); } catch (e) { v = null; }
  if (!v || now - v.t > KM_HOI_GIOI_HAN.giay * 1000) v = { t: now, n: 0 };
  if (v.n >= KM_HOI_GIOI_HAN.lan) throw new Error('Bạn hỏi hơi nhiều trong thời gian ngắn – vui lòng đợi khoảng 10 phút rồi hỏi tiếp.');
  v.n++; c.put(k, JSON.stringify(v), KM_HOI_GIOI_HAN.giay);
}
/** Dựng kết quả (dùng chung cho kyMonHoi và muaPhan km_hoi). mo = true → kèm phần trả phí */
function kmKetQua_(o, loai, mo) {
  var b = kmLap_(o), dg = kmDanhGia_(b, loai), ga = kmGioAm_(o);
  var kq = { ok: true, loai: loai, loaiTen: KM_LOAI[loai].ten, ma: kmMaHoi_(o, loai), thoiDiem: o,
    gioAm: { chi: ga.chi, ten: ga.ten, tu: ga.tu, den: ga.den }, ban: kmBanGon_(b), giaoTiet: kmGanGiaoTiet_(b),
    muc: dg.muc, mucTen: KM_MUC[dg.muc].ten, loiMuc: KM_MUC[dg.muc].loi, gioTot: kmGioTot_(o, loai),
    luuY: [KM_LUU_Y].concat(KM_LUU_Y_THEM[loai] ? [KM_LUU_Y_THEM[loai]] : []) };
  if (mo) {
    var khung = kmKhungTot3Ngay_(o, loai);
    kq.danhGia = { nguoiHoi: dg.nguoiHoi, dungThan: dg.dungThan,
      ly: dg.ly.map(function (x) { return { k: x.k, cung: x.cung, huong: x.huong, tot: x.diem > 0, ta: x.ta }; }) };
    kq.khungTot = khung;
    kq.luan = kmLuan_(b, loai, dg.muc, kmGoiVan_(b, dg, khung));
  }
  return kq;
}

/**
 * API: Kỳ Môn "Hỏi một việc". Cần đăng nhập; tối đa 30 lượt / 10 phút / tài khoản.
 *  loai ∈ cong_viec, tai_loc, tinh_cam, di_xa, suc_khoe, kien_tung, thi_cu.
 *  thoiDiem (tùy chọn) = {day, month, year, hour, minute} giờ VN, từ 1 ngày trước đến 3 ngày tới; bỏ trống = bây giờ.
 *  Chưa mua: { ok, loai, loaiTen, ma, thoiDiem, gioAm, ban, giaoTiet, muc, mucTen, loiMuc, gioTot, luuY, gia, daMua:false, soDu }
 *  Đã mua cùng loại việc trong cùng giờ âm lịch (hoặc toàn quyền): thêm daMua:true, danhGia, khungTot, luan, nhacHoiLai
 *  (mở lại đúng thời điểm đã hỏi lúc mua).
 */
function kyMonHoi(token, loai, thoiDiem) {
  var u = tkCan_(token);
  loai = String(loai || '');
  if (!KM_LOAI.hasOwnProperty(loai)) throw new Error('Loại việc không hợp lệ.');
  kmGioiHan_(u);
  var o = kmThoiDiem_(thoiDiem, true), toan = ttToanQuyen_(u), ma = kmMaHoi_(o, loai), mua = toan ? null : kmDaMua_(u.ten, ma);
  if (!mua) kmThoiDiem_(thoiDiem);   // chưa mua: giữ phạm vi 1 ngày trước – 3 ngày tới; đã mua: mở lại được cả lượt cũ
  if (mua && mua.thoiDiem) o = mua.thoiDiem;   // một việc không hỏi hai lần: mở lại đúng bàn đã mua
  var kq = kmKetQua_(o, loai, toan || !!mua), bg = ttBangGia_();
  kq.gia = bg.phan.km_hoi ? bg.phan.km_hoi.xu : 9;
  kq.daMua = !!mua; kq.toanQuyen = toan; kq.soDu = toan ? null : ttSoDu_(u.ten);
  if (mua) kq.nhacHoiLai = KM_NHAC_HOI_LAI;
  return kq;
}
