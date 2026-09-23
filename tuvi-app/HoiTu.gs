/**
 * ============================================================
 *  HoiTu.gs — HỘI TỤ 6 HỆ: BIẾN CỐ XÁC SUẤT CAO · VẬN THÁNG/NGÀY · MẬT MÃ CÁ NHÂN
 *  Nguyên tắc: mỗi hệ có "tín hiệu" riêng cho từng năm & từng chủ đề. Năm nào có
 *  từ 3 hệ trở lên cùng báo một chủ đề thì xác suất xảy ra cao (đối chiếu chéo).
 *   · Tử Vi   – điểm dự đoán theo tiểu hạn, lưu niên đại hạn, lưu tinh (DuDoan.gs)
 *   · Bát Tự  – thập thần của can chi năm, hỷ/kỵ, xung – hợp nhật chi/năm sinh, giao vận
 *   · Hà Lạc  – quẻ lưu niên (nhóm quẻ theo chủ đề) & năm đầu vận hào
 *   · Chiêm tinh – Sao Mộc/Sao Thổ quá cảnh qua nhà, hồ sơ năm (profection), chu kỳ lớn
 *   · Thần số – năm cá nhân 1–9, chuyển đỉnh cao
 *   · Human Design – không có lịch năm (chỉ nêu giai đoạn đời), nên không bỏ phiếu năm
 * ============================================================
 */

var HT_CHU_DE = [
  { k: 'taiLoc', ten: 'Tài lộc bứt phá', loai: 'tot', icon: '◈', tuoi: [18, 90] },
  { k: 'quanLoc', ten: 'Sự nghiệp thăng tiến / chuyển động', loai: 'tot', icon: '▲', tuoi: [18, 75] },
  { k: 'ketHon', ten: 'Tình duyên – hôn nhân', loai: 'tot', icon: '❤', tuoi: [18, 50] },
  { k: 'sinhCon', ten: 'Tin vui con cái', loai: 'tot', icon: '✿', tuoi: [20, 46] },
  { k: 'buocNgoat', ten: 'Bước ngoặt – đổi môi trường', loai: 'dong', icon: '⟳', tuoi: [12, 90] },
  { k: 'sucKhoe', ten: 'Sức khỏe cần giữ', loai: 'xau', icon: '✚', tuoi: [1, 90] },
  { k: 'taiChinh', ten: 'Hao tài – rủi ro tiền bạc', loai: 'xau', icon: '⚠', tuoi: [18, 90] },
  { k: 'giaDao', ten: 'Biến động gia đạo – nhà cửa', loai: 'xau', icon: '⌂', tuoi: [1, 90] }
];
var HT_QUE = {
  taiLoc: ['Hỏa Thiên Đại Hữu', 'Phong Lôi Ích', 'Lôi Hỏa Phong', 'Hỏa Địa Tấn', 'Địa Thiên Thái', 'Sơn Thiên Đại Súc', 'Hỏa Phong Đỉnh', 'Trạch Địa Tụy', 'Địa Trạch Lâm'],
  quanLoc: ['Địa Phong Thăng', 'Hỏa Địa Tấn', 'Hỏa Phong Đỉnh', 'Thuần Càn', 'Địa Thủy Sư', 'Địa Trạch Lâm', 'Trạch Hỏa Cách', 'Lôi Thiên Đại Tráng', 'Phong Địa Quan'],
  ketHon: ['Trạch Sơn Hàm', 'Phong Sơn Tiệm', 'Phong Hỏa Gia Nhân', 'Lôi Trạch Quy Muội', 'Lôi Phong Hằng', 'Thiên Phong Cấu', 'Trạch Lôi Tùy', 'Thủy Địa Tỷ'],
  sinhCon: ['Địa Lôi Phục', 'Sơn Lôi Di', 'Thủy Lôi Truân', 'Phong Hỏa Gia Nhân', 'Lôi Địa Dự', 'Thuần Khôn'],
  buocNgoat: ['Trạch Hỏa Cách', 'Thuần Chấn', 'Lôi Thủy Giải', 'Địa Lôi Phục', 'Hỏa Sơn Lữ', 'Trạch Lôi Tùy', 'Sơn Phong Cổ', 'Phong Thủy Hoán'],
  sucKhoe: ['Thuần Khảm', 'Thủy Sơn Kiển', 'Trạch Thủy Khốn', 'Sơn Địa Bác', 'Địa Hỏa Minh Di', 'Trạch Phong Đại Quá', 'Sơn Trạch Tổn'],
  taiChinh: ['Sơn Trạch Tổn', 'Sơn Địa Bác', 'Trạch Thủy Khốn', 'Thiên Thủy Tụng', 'Phong Thủy Hoán', 'Thiên Địa Bĩ'],
  giaDao: ['Hỏa Trạch Khuê', 'Thiên Thủy Tụng', 'Thiên Địa Bĩ', 'Sơn Phong Cổ', 'Phong Thủy Hoán', 'Hỏa Sơn Lữ']
};
var HT_SO = { // năm cá nhân → sức nặng theo chủ đề
  taiLoc: { 8: 1, 1: 0.5, 3: 0.4 }, quanLoc: { 1: 1, 8: 1, 4: 0.5 }, ketHon: { 2: 1, 6: 1 }, sinhCon: { 6: 0.9, 3: 0.5, 2: 0.4 },
  buocNgoat: { 5: 1, 1: 0.9, 9: 0.8 }, sucKhoe: { 7: 0.9, 4: 0.6, 9: 0.5 }, taiChinh: { 7: 0.8, 9: 0.7, 5: 0.5 }, giaDao: { 9: 0.9, 5: 0.7, 6: 0.5 }
};
var HT_DAO_HOA = { 0: 9, 4: 9, 8: 9, 2: 3, 6: 3, 10: 3, 5: 6, 9: 6, 1: 6, 11: 0, 3: 0, 7: 0 };

function htNamCaNhan_(ts, solar, y) { return tsRutGon_(tsRutGon_(solar.day, false) + tsRutGon_(solar.month, false) + tsRutGon_(tsTongChuSo_(y), false), false); }
function htPhanVi_(arr, p) { var a = arr.filter(function (x) { return x != null; }).slice().sort(function (x, y) { return x - y; }); return a.length ? a[Math.min(a.length - 1, Math.floor(p * a.length))] : 0; }

/** Tín hiệu từng hệ cho 1 năm */
function htTinHieu_(C, y, ctx) {
  var tv = C.tv, bt = C.bt, dd = C.duDoan, idx = y - dd.namBatDau, tuoi = idx + 1, out = {};
  function add(k, he, v, ly) { if (v <= 0) return; var o = out[k] = out[k] || {}; if (!o[he] || o[he].v < v) o[he] = { v: v, ly: ly }; }
  // Tử Vi
  HT_CHU_DE.forEach(function (T) {
    var cd = dd.chuDe[T.k]; if (!cd) return;
    var v = (cd.diemGoc || cd.diem || [])[idx]; if (v == null) return;
    if (v >= ctx.tv[T.k][1]) add(T.k, 'Tử Vi', 1.4, 'Tử Vi: tín hiệu rất mạnh (top 7% cả đời, điểm ' + v + ')');
    else if (v >= ctx.tv[T.k][0]) add(T.k, 'Tử Vi', 1, 'Tử Vi: tín hiệu mạnh (top 20% cả đời, điểm ' + v + ')');
  });
  if ((C.daiVanTV || []).some(function (d) { return +String(d.nam).slice(0, 4) === y; })) add('buocNgoat', 'Tử Vi', 1.2, 'Tử Vi: năm chuyển đại hạn');
  // Bát Tự
  var nc = bt.nhatChuCan, can = ((y - 4) % 10 + 10) % 10, chi = ((y - 4) % 12 + 12) % 12, hy = bt.goiY.hy, ky = bt.goiY.ky;
  var tC = thapThanTen_(nc, can), tZ = thapThanTen_(nc, TANG_CAN[chi][0]), cc = CAN[can] + ' ' + CHI[chi];
  var hC = CAN_HANH[can], hZ = CHI_HANH[chi], tot = hy.indexOf(hC) >= 0 || hy.indexOf(hZ) >= 0, xau = ky.indexOf(hC) >= 0 && ky.indexOf(hZ) >= 0;
  var co = function (re) { return re.test(tC) || re.test(tZ); };
  var male = tv.info.male, dChi = bt.pillars[2].chi, nChi = bt.pillars[0].chi, mChi = bt.pillars[1].chi, gChi = bt.pillars[3].chi;
  var xungNgay = (chi - dChi + 12) % 12 === 6, xungNam = (chi - nChi + 12) % 12 === 6, hopNgay = PN_LUC_HOP[dChi] === chi || (chi !== dChi && (chi - dChi + 12) % 4 === 0);
  if (co(/Tài/)) add('taiLoc', 'Bát Tự', tot ? 1.3 : 0.6, 'Bát Tự: năm ' + cc + ' mang Tài tinh (' + tC + '/' + tZ + ')' + (tot ? ', lại là hỷ dụng' : ''));
  if (co(/Quan|Sát/)) add('quanLoc', 'Bát Tự', tot ? 1.2 : 0.9, 'Bát Tự: năm ' + cc + ' mang Quan/Sát – áp lực và cơ hội thăng tiến');
  var pn = male ? /Tài/ : /Quan|Sát/;
  var kh = (co(pn) ? 0.8 : 0) + (hopNgay ? 0.6 : 0) + (HT_DAO_HOA[nChi] === chi || HT_DAO_HOA[dChi] === chi ? 0.5 : 0);
  if (kh) add('ketHon', 'Bát Tự', kh, 'Bát Tự: ' + [co(pn) ? 'sao phối ngẫu xuất hiện' : '', hopNgay ? 'năm hợp cung phu thê (nhật chi)' : '', HT_DAO_HOA[nChi] === chi || HT_DAO_HOA[dChi] === chi ? 'gặp Đào hoa' : ''].filter(Boolean).join(', '));
  var sc = male ? /Quan|Sát/ : /Thực|Thương/;
  var sv = (co(sc) ? 0.8 : 0) + (PN_LUC_HOP[gChi] === chi || (chi !== gChi && (chi - gChi + 12) % 4 === 0) ? 0.4 : 0);
  if (sv) add('sinhCon', 'Bát Tự', sv, 'Bát Tự: ' + (co(sc) ? 'sao con cái (' + (male ? 'Quan/Sát' : 'Thực/Thương') + ') đến' : 'năm hợp trụ giờ (cung con cái)'));
  var sk = (xau ? 0.7 : 0) + (xungNgay ? 0.5 : 0) + (xungNam ? 0.5 : 0) + (chi === nChi ? 0.3 : 0);
  if (sk) add('sucKhoe', 'Bát Tự', sk, 'Bát Tự: ' + [xau ? 'can chi năm đều là kỵ thần' : '', xungNgay ? 'xung nhật chi' : '', xungNam ? 'xung Thái Tuế năm sinh' : '', chi === nChi ? 'năm tuổi' : ''].filter(Boolean).join(', '));
  var tcv = (co(/Kiếp|Tỷ/) && bt.tyLeTro >= 45 ? 0.9 : 0) + (co(/Tài/) && !tot ? 0.4 : 0) + (xau ? 0.3 : 0);
  if (tcv) add('taiChinh', 'Bát Tự', tcv, 'Bát Tự: ' + (co(/Kiếp|Tỷ/) ? 'Tỷ Kiếp đoạt tài khi thân đã vượng' : 'tài đến nhưng thuộc kỵ thần – dễ vào nhanh ra nhanh'));
  var gd = (xungNgay ? 1 : 0) + ((chi - mChi + 12) % 12 === 6 ? 0.6 : 0);
  if (gd) add('giaDao', 'Bát Tự', gd, 'Bát Tự: ' + (xungNgay ? 'năm xung cung phu thê' : 'năm xung trụ tháng (cha mẹ, anh em)'));
  if (bt.daiVan.some(function (d) { return d.nam === y; })) add('buocNgoat', 'Bát Tự', 1.3, 'Bát Tự: năm giao đại vận');
  if (xungNam) add('buocNgoat', 'Bát Tự', 0.9, 'Bát Tự: năm xung Thái Tuế – dễ đổi chỗ ở/công việc');
  // Hà Lạc
  var hn = ctx.hlNam[y];
  if (hn) {
    Object.keys(HT_QUE).forEach(function (k) {
      if (HT_QUE[k].indexOf(hn.que) >= 0) add(k, 'Hà Lạc', 1.1, 'Hà Lạc: quẻ năm ' + hn.que + ' (' + hn.danhGia + ')');
    });
    if (hn.diem >= 1.5) add('taiLoc', 'Hà Lạc', 0.8, 'Hà Lạc: quẻ năm ' + hn.que + ' đại cát');
    if (hn.diem <= -1.5) add('sucKhoe', 'Hà Lạc', 0.8, 'Hà Lạc: quẻ năm ' + hn.que + ' hung');
    if (ctx.hlDau[y]) add('buocNgoat', 'Hà Lạc', 1.1, 'Hà Lạc: năm đầu vận hào mới (' + ctx.hlDau[y] + ')');
  }
  // Chiêm tinh
  var A = ctx.astro[y];
  if (A) {
    var J = A.j, S = A.s, P = A.pro;
    if ([2, 8, 11].indexOf(J) >= 0) add('taiLoc', 'Chiêm tinh', 1, 'Chiêm tinh: Sao Mộc qua nhà ' + J + ' (tiền bạc/thu nhập)');
    if ([2, 11].indexOf(P) >= 0) add('taiLoc', 'Chiêm tinh', 0.6, 'Chiêm tinh: hồ sơ năm kích hoạt nhà ' + P);
    if (J === 10) add('quanLoc', 'Chiêm tinh', 1.1, 'Chiêm tinh: Sao Mộc qua nhà 10 (sự nghiệp)');
    if (S === 10) add('quanLoc', 'Chiêm tinh', 0.9, 'Chiêm tinh: Sao Thổ qua nhà 10 – trách nhiệm, thử thách chức vụ');
    if (P === 10) add('quanLoc', 'Chiêm tinh', 0.7, 'Chiêm tinh: hồ sơ năm nhà 10');
    if (J === 7 || J === 5) add('ketHon', 'Chiêm tinh', 1, 'Chiêm tinh: Sao Mộc qua nhà ' + J + ' (' + (J === 7 ? 'hôn nhân' : 'tình yêu') + ')');
    if (P === 7) add('ketHon', 'Chiêm tinh', 0.8, 'Chiêm tinh: hồ sơ năm nhà 7 (hôn nhân)');
    if (A.jVenus) add('ketHon', 'Chiêm tinh', 1, 'Chiêm tinh: Sao Mộc hợp Sao Kim gốc');
    if (J === 5 || P === 5) add('sinhCon', 'Chiêm tinh', J === 5 ? 1 : 0.7, 'Chiêm tinh: ' + (J === 5 ? 'Sao Mộc' : 'hồ sơ năm') + ' ở nhà 5 (con cái)');
    if ([1, 6, 12].indexOf(S) >= 0) add('sucKhoe', 'Chiêm tinh', 1, 'Chiêm tinh: Sao Thổ qua nhà ' + S + ' (thể lực, bệnh tật)');
    if (A.sSun) add('sucKhoe', 'Chiêm tinh', 1, 'Chiêm tinh: Sao Thổ ' + A.sSun + ' Mặt Trời gốc');
    if ([6, 12].indexOf(P) >= 0) add('sucKhoe', 'Chiêm tinh', 0.6, 'Chiêm tinh: hồ sơ năm nhà ' + P);
    if (S === 2 || S === 8) add('taiChinh', 'Chiêm tinh', 1, 'Chiêm tinh: Sao Thổ qua nhà ' + S + ' (thắt chặt tài chính)');
    if (S === 4) add('giaDao', 'Chiêm tinh', 1, 'Chiêm tinh: Sao Thổ qua nhà 4 (gia đình, nhà cửa)');
    if (P === 4) add('giaDao', 'Chiêm tinh', 0.6, 'Chiêm tinh: hồ sơ năm nhà 4');
    A.chuKy.forEach(function (c) { add('buocNgoat', 'Chiêm tinh', /Mộc/.test(c) ? 0.6 : 1.2, 'Chiêm tinh: ' + c); });
  }
  // Thần số học
  var so = htNamCaNhan_(C.ts, tv.info.solar, y);
  Object.keys(HT_SO).forEach(function (k) { var v = HT_SO[k][so]; if (v) add(k, 'Thần số học', v, 'Thần số: năm cá nhân ' + so); });
  if (C.ts.dinhCao.some(function (p, i) { return i > 0 && tv.info.solar.year + p.tu === y; })) add('buocNgoat', 'Thần số học', 1, 'Thần số: bước sang đỉnh cao mới');
  return { nam: y, tuoi: tuoi, canChi: cc, soCN: so, tin: out };
}

function htChuanBi_(C) {
  var dd = C.duDoan, ctx = { tv: {}, hlNam: {}, hlDau: {}, astro: {} };
  HT_CHU_DE.forEach(function (T) {
    var arr = ((dd.chuDe[T.k] || {}).diemGoc || (dd.chuDe[T.k] || {}).diem || []).filter(function (v, i) { return i + 1 >= T.tuoi[0] && i + 1 <= T.tuoi[1]; });
    ctx.tv[T.k] = [htPhanVi_(arr, 0.8), htPhanVi_(arr, 0.93)];
  });
  if (C.hlL) {
    (C.hlL.nam || []).forEach(function (n) { ctx.hlNam[n.nam] = n; });
    C.hlL.daiVan.forEach(function (v) { ctx.hlDau[+String(v.nam).split('–')[0]] = v.ten; });
  }
  // Chiêm tinh theo năm (giữa năm dương lịch)
  var ct = C.ct, cusp = ct.cusp.map(function (c) { return c.lon; }), y0 = C.tv.info.solar.year;
  var ky = {}; (ct.chuKy || []).forEach(function (c) { if (/Thổ|Thiên Vương|Mộc/.test(c.ten)) (ky[c.nam] = ky[c.nam] || []).push(c.ten); });
  for (var y = dd.namBatDau; y <= dd.namBatDau + 90; y++) {
    var d = astJD_(y, 7, 1, 12, 0, 7) - 2451543.5, j = astPlanetLon_('jupiter', d), s = astPlanetLon_('saturn', d);
    var sd = ctKhoang_(s, ct.by.sun.lon);
    ctx.astro[y] = { j: ctNhaCua_(j, cusp), s: ctNhaCua_(s, cusp), pro: ((y - y0) % 12 + 12) % 12 + 1, jVenus: ctKhoang_(j, ct.by.venus.lon) < 8,
      sSun: sd < 6 ? 'hợp' : Math.abs(sd - 180) < 6 ? 'đối' : Math.abs(sd - 90) < 5 ? 'vuông' : '', chuKy: ky[y] || [] };
  }
  return ctx;
}

/** Biến cố hội tụ: năm có ≥ 3 hệ cùng báo */
function htHoiTu_(C) {
  var dd = C.duDoan, vy = C.tv.info.viewYear, ctx = htChuanBi_(C), nam = [];
  for (var y = dd.namBatDau; y <= dd.namBatDau + 89; y++) nam.push(htTinHieu_(C, y, ctx));
  var chuDe = HT_CHU_DE.map(function (T) {
    var ds = [];
    nam.forEach(function (n) {
      if (n.tuoi < T.tuoi[0] || n.tuoi > T.tuoi[1]) return;
      var o = n.tin[T.k]; if (!o) return;
      var he = Object.keys(o).filter(function (h) { return o[h].v >= 0.8; });
      var diem = 0; Object.keys(o).forEach(function (h) { diem += o[h].v; });
      if (he.length >= 3) ds.push({ nam: n.nam, tuoi: n.tuoi, canChi: n.canChi, soHe: he.length, diem: Math.round(diem * 10) / 10, he: he,
        ly: Object.keys(o).sort(function (a, b) { return o[b].v - o[a].v; }).map(function (h) { return o[h].ly; }),
        muc: he.length >= 5 ? 'Rất cao' : he.length === 4 ? 'Cao' : 'Khá cao', qua: n.nam < vy });
    });
    var sap = ds.filter(function (x) { return !x.qua; }).sort(function (a, b) { return b.soHe - a.soHe || b.diem - a.diem; });
    return { k: T.k, ten: T.ten, loai: T.loai, icon: T.icon, nam: ds, dinh: sap.slice(0, 4).sort(function (a, b) { return a.nam - b.nam; }), qua: ds.filter(function (x) { return x.qua && x.nam >= vy - 12; }).slice(-3) };
  });
  // Lưới 30 năm cho biểu đồ
  var luoi = { nam: [], dong: HT_CHU_DE.map(function (T) { return { k: T.k, ten: T.ten, loai: T.loai, gt: [] }; }) };
  nam.forEach(function (n) {
    if (n.nam < vy - 3 || n.nam > vy + 26) return;
    luoi.nam.push(n.nam);
    HT_CHU_DE.forEach(function (T, i) {
      var o = n.tin[T.k] || {}, he = Object.keys(o).filter(function (h) { return o[h].v >= 0.8; });
      var ok = n.tuoi >= T.tuoi[0] && n.tuoi <= T.tuoi[1];
      luoi.dong[i].gt.push({ so: ok ? he.length : 0, he: ok ? he : [] });
    });
  });
  // Cửa sổ thời gian đáng nhớ: năm tương lai có nhiều chủ đề hội tụ
  var cuaSo = nam.filter(function (n) { return n.nam >= vy && n.nam <= vy + 30; }).map(function (n) {
    var cd = HT_CHU_DE.filter(function (T) {
      var o = n.tin[T.k] || {}; return n.tuoi >= T.tuoi[0] && n.tuoi <= T.tuoi[1] && Object.keys(o).filter(function (h) { return o[h].v >= 0.8; }).length >= 3;
    });
    return { nam: n.nam, tuoi: n.tuoi, cd: cd.map(function (T) { return T.ten; }), loai: cd.map(function (T) { return T.loai; }) };
  }).filter(function (x) { return x.cd.length >= 2; }).slice(0, 8);
  return { chuDe: chuDe, luoi: luoi, cuaSo: cuaSo, namTin: nam,
    coSo: 'Mỗi năm, 5 hệ có lịch thời gian (Tử Vi, Bát Tự, Hà Lạc, Chiêm tinh, Thần số học) độc lập phát tín hiệu theo 8 chủ đề. Tín hiệu Tử Vi lấy nhóm 20% năm mạnh nhất cả đời; Bát Tự xét thập thần, hỷ/kỵ, xung – hợp của can chi năm; Hà Lạc xét quẻ lưu niên; Chiêm tinh xét Sao Mộc, Sao Thổ qua 12 nhà, hồ sơ năm và các chu kỳ lớn; Thần số xét năm cá nhân. Năm có từ 3 hệ cùng báo được coi là xác suất cao; 4 hệ – cao; 5 hệ – rất cao. Human Design không có lịch năm nên không bỏ phiếu.' };
}

/** 12 tháng năm xem: Tử Vi nguyệt vận + Bát Tự can chi tháng + Thần số tháng cá nhân */
function htThang_(C) {
  var nv = (C.chiTiet && C.chiTiet.nguyetVan) || [], bt = C.bt, py = htNamCaNhan_(C.ts, C.tv.info.solar, C.tv.info.viewYear);
  var DG = { 'Đại cát': 2, 'Cát': 1, 'Bình': 0, 'Hơi kém': -1, 'Cẩn trọng': -2 }, SOM = { 1: 1, 2: 0, 3: 0.8, 4: -0.4, 5: 0.4, 6: 0.5, 7: -0.5, 8: 1.4, 9: -0.4 };
  return nv.map(function (m) {
    var p = String(m.canChi).split(' '), can = CAN.indexOf(p[0]), chi = CHI.indexOf(p[1]);
    var btDG = can >= 0 ? danhGiaVan_(CAN_HANH[can], CHI_HANH[chi], bt.goiY.hy, bt.goiY.ky) : 'Bình', so = tsRutGon_(py + m.thang, false);
    var tvD = Math.max(-2, Math.min(2, m.diem / 3)), d = tvD * 0.45 + (DG[btDG] || 0) * 0.3 + SOM[so] * 0.25;
    return { thang: m.thang, canChi: m.canChi, batDau: m.batDau, tv: m.danhGia, tvDiem: m.diem, bt: btDG, so: so, diem: Math.round(d * 100) / 100,
      danhGia: d >= 0.8 ? 'Tháng vàng' : d >= 0.3 ? 'Thuận' : d > -0.3 ? 'Bình' : d > -0.8 ? 'Cần giữ' : 'Thận trọng' };
  });
}
/** 7 ngày tới: Tử Vi nhật vận + ngày cá nhân (thần số) */
function htNgay_(C) {
  var py = htNamCaNhan_(C.ts, C.tv.info.solar, C.tv.info.viewYear), SOM = { 1: 1, 2: 0, 3: 0.8, 4: -0.4, 5: 0.4, 6: 0.5, 7: -0.5, 8: 1.4, 9: -0.4 };
  return ((C.chiTiet && C.chiTiet.nhatVan) || []).map(function (n) {
    var dm = String(n.ngay).split('/'), so = tsRutGon_(py + (+dm[1]) + tsRutGon_(+dm[0], false), false);
    var d = Math.max(-2, Math.min(2, n.diem / 3)) * 0.7 + SOM[so] * 0.3;
    return { ngay: n.ngay, thu: n.thu, am: n.am, canChi: n.canChi, hoangDao: n.hoangDao, truc: n.truc, tv: n.danhGia, so: so, diem: Math.round(d * 100) / 100,
      danhGia: d >= 0.8 ? 'Rất tốt' : d >= 0.3 ? 'Tốt' : d > -0.3 ? 'Bình' : 'Kém' };
  });
}

/* ========================= MẬT MÃ CÁ NHÂN ========================= */
var HT_LAC_THU_HANH = { 1: 'Thủy', 2: 'Thổ', 3: 'Mộc', 4: 'Mộc', 5: 'Thổ', 6: 'Kim', 7: 'Kim', 8: 'Thổ', 9: 'Hỏa' };
var HT_NT_HANH = { 'Lửa': 'Hỏa', 'Đất': 'Thổ', 'Nước': 'Thủy', 'Khí': 'Mộc' };
var HT_QUY_NHAN = { 0: [1, 7], 4: [1, 7], 6: [1, 7], 1: [0, 8], 5: [0, 8], 2: [11, 9], 3: [11, 9], 8: [3, 5], 9: [3, 5], 7: [6, 2] };
var HT_GIO = { 'Mộc': 'giờ Dần – Mão (3h–7h)', 'Hỏa': 'giờ Tỵ – Ngọ (9h–13h)', 'Thổ': 'giờ Thìn, Mùi, Tuất, Sửu (7–9h, 13–15h, 19–21h)', 'Kim': 'giờ Thân – Dậu (15h–19h)', 'Thủy': 'giờ Hợi – Tý (21h–1h)' };
var HT_MUA = { 'Mộc': 'mùa xuân (tháng 1–3 âm)', 'Hỏa': 'mùa hạ (tháng 4–6 âm)', 'Thổ': 'các tháng giao mùa (3, 6, 9, 12 âm)', 'Kim': 'mùa thu (tháng 7–9 âm)', 'Thủy': 'mùa đông (tháng 10–12 âm)' };
var HT_HANH_Y = { 'Mộc': 'sinh trưởng, sáng tạo, nhân hậu', 'Hỏa': 'nhiệt huyết, tỏa sáng, lễ nghĩa', 'Thổ': 'vững chãi, bao dung, giữ chữ tín', 'Kim': 'quyết đoán, nguyên tắc, nghĩa khí', 'Thủy': 'trí tuệ, linh hoạt, sâu sắc' };

function htMatMa_(C, hoiTu, thang) {
  var tv = C.tv, bt = C.bt, ct = C.ct, ts = C.ts, hd = C.hd, hl = C.hl, items = [];
  // 1. Nguyên tố linh hồn
  var phieu = {}, nguon = [];
  function v(h, w, n) { phieu[h] = (phieu[h] || 0) + w; nguon.push(n + ': ' + h); }
  var tro = Object.keys(bt.phanTram).sort(function (a, b) { return bt.phanTram[b] - bt.phanTram[a]; })[0];
  v(tro, 1.5, 'Bát Tự (hành vượng nhất)'); v(tv.info.cucHanh, 1, 'Tử Vi (cục)'); v(tv.info.banMenh.hanh, 1, 'Bản mệnh nạp âm');
  var ntMax = Object.keys(ct.nguyenTo).sort(function (a, b) { return ct.nguyenTo[b] - ct.nguyenTo[a]; })[0]; v(HT_NT_HANH[ntMax], 1, 'Chiêm tinh (nguyên tố ' + ntMax + ')');
  if (hl) { v(HL_QUAI[hl.tien.duoi].hanh, 1, 'Hà Lạc (nội quái ' + hl.tien.duoi + ')'); }
  v(HT_LAC_THU_HANH[tsGoc_(ts.duongDoi)] || 'Thổ', 0.8, 'Thần số (số ' + ts.duongDoi + ' theo Lạc Thư)');
  var nt = Object.keys(phieu).sort(function (a, b) { return phieu[b] - phieu[a]; })[0], dung = bt.goiY.dung;
  items.push({ ten: 'Nguyên tố linh hồn', gt: nt, y: 'Hành ' + nt + ' xuất hiện nhiều nhất khi ghép 6 hệ (' + nguon.join(' · ') + ') – tinh thần ' + HT_HANH_Y[nt] + '. ' +
    (nt === dung ? 'Trùng với dụng thần Bát Tự: bạn "được trời phú" đúng thứ mình cần.' : 'Dụng thần của bạn lại là ' + dung + ' – năng lượng bạn cần bồi thêm để cân bằng (' + HT_HANH_Y[dung] + ').') });
  // 2. Con số định mệnh
  var so = {}, nS = [];
  function s(x, n) { x = tsRutGon_(+x || 0, false); if (x >= 1 && x <= 9) { so[x] = (so[x] || 0) + 1; nS.push(n + ' ' + x); } }
  s(ts.duongDoi, 'số chủ đạo'); s(ts.ngaySinh, 'số ngày sinh'); s(tv.info.cucSo, 'cục Tử Vi'); if (hl) { s(hl.thienN, 'Thiên số Hà Lạc'); s(hl.diaN, 'Địa số Hà Lạc'); s(hl.tien.so, 'số quẻ Tiên thiên'); }
  s(hd.act.p.sun.gate, 'cổng Mặt Trời HD'); String(bt.goiY.so).split(/\D+/).forEach(function (x) { if (x) s(x, 'số hợp Bát Tự'); });
  s(Math.floor(ct.by.sun.lon / 30) + 1, 'cung Mặt Trời (thứ tự)');
  var top = Object.keys(so).sort(function (a, b) { return so[b] - so[a]; })[0];
  items.push({ ten: 'Con số định mệnh', gt: String(top), y: 'Số ' + top + ' lặp lại ' + so[top] + ' lần trong lá số của bạn (' + nS.filter(function (x) { return x.slice(-1) === String(top); }).join(', ') + '). Hãy dùng nó cho biển số, số nhà, ngày ký kết quan trọng.' });
  // 3. Giờ vàng & mùa vàng
  var hy2 = bt.goiY.hy[1];
  items.push({ ten: 'Khung giờ vàng', gt: HT_GIO[dung].split(' (')[0], y: 'Làm việc quan trọng vào ' + HT_GIO[dung] + ' – giờ của dụng thần ' + dung + (hy2 ? '; phương án phụ: ' + HT_GIO[hy2] + '.' : '.') + (hd.loai === 'Projector' || hd.loai === 'Reflector' ? ' Human Design nhắc: bạn không có sinh lực bền – chia việc thành các "cú sprint" ngắn.' : ' Human Design: bạn có nguồn sinh lực bền – ưu tiên việc bạn thật sự hứng thú.') });
  var tv3 = (thang || []).slice().sort(function (a, b) { return b.diem - a.diem; }).slice(0, 3).map(function (m) { return 'tháng ' + m.thang; });
  items.push({ ten: 'Mùa của bạn', gt: HT_MUA[dung].split(' (')[0], y: 'Năng lượng dâng cao vào ' + HT_MUA[dung] + '. Năm ' + tv.info.viewYear + ', ba tháng sáng nhất (âm lịch) theo 3 hệ là ' + tv3.join(', ') + '.' });
  // 4. Quý nhân & người cần dè chừng
  var qn = (HT_QUY_NHAN[bt.nhatChuCan] || []).map(function (c) { return CHI[c] + ' (' + CON_GIAP[c] + ')'; });
  var yc = tv.info.yChi, hop = [(yc + 4) % 12, (yc + 8) % 12, PN_LUC_HOP[yc]].map(function (c) { return CHI[c]; });
  var sunNt = CT_CUNG[ct.by.sun.cung].nt, cungHop = CT_CUNG.filter(function (c, i) { return i !== ct.by.sun.cung && (c.nt === sunNt || ({ 'Lửa': 'Khí', 'Khí': 'Lửa', 'Đất': 'Nước', 'Nước': 'Đất' })[sunNt] === c.nt); }).map(function (c) { return c.ten; }).slice(0, 4);
  items.push({ ten: 'Quý nhân của bạn', gt: qn.join(', '), y: 'Thiên Ất quý nhân (Bát Tự): người tuổi ' + qn.join(' hoặc ') + '. Hợp tác làm ăn: tuổi ' + hop.join(', ') + ' (tam hợp – lục hợp). Theo chiêm tinh, người cung ' + cungHop.join(', ') + ' dễ đồng điệu với bạn; theo thần số, người có số chủ đạo cùng nhóm ' + pnNhomSo_(ts.duongDoi).join('-') + '.' });
  var xung = CHI[(yc + 6) % 12], hai = CHI[PN_HAI[yc]], vuong = [CT_CUNG[(ct.by.sun.cung + 3) % 12].ten, CT_CUNG[(ct.by.sun.cung + 9) % 12].ten];
  items.push({ ten: 'Người cần giữ khoảng cách hợp lý', gt: 'Tuổi ' + xung, y: 'Tuổi ' + xung + ' (lục xung) và ' + hai + ' (lục hại) dễ bất đồng quan điểm; cung ' + vuong.join(', ') + ' tạo góc vuông với Mặt Trời của bạn – va chạm nhưng cũng thúc bạn trưởng thành. Không phải "kẻ xấu", chỉ cần giao tiếp rõ ràng.' });
  // 5. Âm – dương
  var duong = 0, tong = 0;
  bt.pillars.forEach(function (p) { tong += 2; if (p.can % 2 === 0) duong++; if (p.chi % 2 === 0) duong++; });
  if (hl) hl.tien.hao.forEach(function (h) { tong++; duong += h; });
  tong += 2; duong += (ct.nguyenTo['Lửa'] + ct.nguyenTo['Khí']) / (ct.nguyenTo['Lửa'] + ct.nguyenTo['Khí'] + ct.nguyenTo['Đất'] + ct.nguyenTo['Nước']) * 2;
  tong += 1; duong += ts.duongDoi % 2;
  var pd = Math.round(duong / tong * 100);
  items.push({ ten: 'Cán cân Âm – Dương', gt: pd + '% dương', y: (pd >= 58 ? 'Thiên về dương: chủ động, hướng ngoại, thích dẫn dắt – cần thêm tĩnh lặng và lắng nghe.' : pd <= 42 ? 'Thiên về âm: sâu sắc, trực giác, bền bỉ âm thầm – cần mạnh dạn thể hiện hơn.' : 'Âm dương khá cân bằng: biết tiến biết lui, dễ thích nghi.') + ' (Tính từ can chi Bát Tự, hào quẻ Hà Lạc, nguyên tố chiêm tinh và số chủ đạo.)' });
  // 6. Biểu tượng linh hồn
  items.push({ ten: 'Biểu tượng linh hồn', gt: CON_GIAP[tv.info.yChi] + ' × ' + ct.by.sun.cungTen + (hl ? ' × ' + hl.tien.ten : ''), y: 'Con ' + CON_GIAP[tv.info.yChi] + ' mang mệnh ' + tv.info.banMenh.ten + ', dưới cung ' + ct.by.sun.cungTen + ' (' + CT_CUNG[ct.by.sun.cung].tuKhoa + ')' + (hl ? ', đứng trong quẻ ' + hl.tien.ten + ' – ' + hl.tien.y.toLowerCase() : '') + '. Một hình ảnh để bạn nhớ mình là ai.' });
  // 7. Năm vàng của đời
  var vang = [];
  ['taiLoc', 'quanLoc'].forEach(function (k) { var cd = hoiTu.chuDe.filter(function (x) { return x.k === k; })[0]; if (cd && cd.dinh.length) vang.push(cd.dinh.slice().sort(function (a, b) { return b.soHe - a.soHe || (b.diem || 0) - (a.diem || 0) || a.nam - b.nam; })[0]); });
  vang.sort(function (a, b) { return a.nam - b.nam; });
  if (vang.length) items.push({ ten: 'Năm vàng phía trước', gt: vang.map(function (x) { return x.nam; }).join(' · '), y: vang.map(function (x) { return x.nam + ' (' + x.tuoi + ' tuổi): ' + x.soHe + ' hệ cùng báo – ' + x.he.join(', '); }).join('; ') + '. Hãy chuẩn bị trước 1–2 năm để đón trọn.' });
  // 8. Hình mẫu đời người
  var giai = hd.l1 === 6 || hd.l2 === 6 ? 'Hồ sơ có hào 6: đời chia 3 chặng – thử nghiệm đến ~30, "lên mái nhà" quan sát 30–50, sau 50 thành hình mẫu.' : 'Human Design: sau Sao Thổ hồi quy (~29) bạn mới thật sự sống đúng thiết kế; sau Chiron hồi quy (~50) là lúc truyền lại kinh nghiệm.';
  items.push({ ten: 'Nhịp đời của bạn', gt: (hl && hl.tien.diem < hl.hau.diem ? 'Tiền khó – hậu thuận' : hl && hl.tien.diem > hl.hau.diem ? 'Tiền thuận – hậu giữ' : 'Đều tay'), y: giai + (hl ? ' Hà Lạc: quẻ Tiên thiên ' + hl.tien.ten + ' → Hậu thiên ' + hl.hau.ten + '.' : '') });
  return items;
}
