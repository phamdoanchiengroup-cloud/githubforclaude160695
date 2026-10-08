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
  giaDao: ['Hỏa Trạch Khuê', 'Thiên Thủy Tụng', 'Thiên Địa Bĩ', 'Sơn Phong Cổ', 'Phong Thủy Hoán', 'Hỏa Sơn Lữ'],
  // Nhóm thêm cho Hồ sơ năm (không vào 8 chủ đề hội tụ)
  hocHanh: ['Sơn Thủy Mông', 'Hỏa Phong Đỉnh', 'Thuần Ly', 'Phong Địa Quan', 'Địa Sơn Khiêm', 'Thuần Đoài', 'Địa Phong Thăng'],
  diXa: ['Hỏa Sơn Lữ', 'Thuần Tốn', 'Phong Thủy Hoán', 'Phong Sơn Tiệm', 'Thiên Sơn Độn', 'Thủy Thiên Nhu', 'Thuần Chấn'],
  quyNhan: ['Thiên Hỏa Đồng Nhân', 'Thủy Địa Tỷ', 'Địa Thiên Thái', 'Lôi Thủy Giải', 'Phong Lôi Ích', 'Hỏa Thiên Đại Hữu', 'Phong Trạch Trung Phu'],
  thiPhi: ['Thiên Thủy Tụng', 'Hỏa Lôi Phệ Hạp', 'Hỏa Trạch Khuê', 'Trạch Thủy Khốn', 'Thủy Sơn Kiển', 'Thiên Địa Bĩ', 'Trạch Thiên Quải'],
  nhaDat: ['Phong Hỏa Gia Nhân', 'Thuần Cấn', 'Lôi Phong Hằng', 'Thuần Khôn', 'Thủy Phong Tỉnh', 'Sơn Thiên Đại Súc', 'Địa Trạch Lâm'],
  tinhThan: ['Thuần Khảm', 'Trạch Phong Đại Quá', 'Địa Hỏa Minh Di', 'Thủy Sơn Kiển', 'Thiên Sơn Độn', 'Lôi Sơn Tiểu Quá', 'Sơn Địa Bác']
};
var HT_SO = { // năm cá nhân → sức nặng theo chủ đề
  taiLoc: { 8: 1, 1: 0.5, 3: 0.4 }, quanLoc: { 1: 1, 8: 1, 4: 0.5 }, ketHon: { 2: 1, 6: 1 }, sinhCon: { 6: 0.9, 3: 0.5, 2: 0.4 },
  buocNgoat: { 5: 1, 1: 0.9, 9: 0.8 }, sucKhoe: { 7: 0.9, 4: 0.6, 9: 0.5 }, taiChinh: { 7: 0.8, 9: 0.7, 5: 0.5 }, giaDao: { 9: 0.9, 5: 0.7, 6: 0.5 },
  hocHanh: { 7: 1, 3: 0.5, 1: 0.4 }, diXa: { 5: 1, 9: 0.6, 3: 0.4 }, quyNhan: { 2: 0.8, 3: 0.6, 8: 0.4 }, thiPhi: { 5: 0.5, 1: 0.4, 9: 0.4 },
  nhaDat: { 4: 1, 6: 0.7, 8: 0.5 }, tinhThan: { 7: 0.8, 9: 0.7, 2: 0.5 }
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
    if (v >= ctx.tv[T.k][1]) add(T.k, 'Tử Vi', 1.4, 'Tử Vi: tín hiệu rất mạnh (top 7% cả đời, cường độ ' + Math.min(10, v) + '/10)');
    else if (v >= ctx.tv[T.k][0]) add(T.k, 'Tử Vi', 1, 'Tử Vi: tín hiệu mạnh (top 20% cả đời, cường độ ' + Math.min(10, v) + '/10)');
  });
  if ((C.daiVanTV || []).some(function (d) { return +String(d.nam).slice(0, 4) === y; })) add('buocNgoat', 'Tử Vi', 1.2, 'Tử Vi: năm chuyển đại hạn');
  htTinTuViThem_(tv, y, add);
  // Bát Tự
  var can = ((y - 4) % 10 + 10) % 10, chi = ((y - 4) % 12 + 12) % 12, cc = CAN[can] + ' ' + CHI[chi], nChi = bt.pillars[0].chi;
  htBtTin_(bt, tv.info.male, can, chi, add, 'năm');
  if (bt.daiVan.some(function (d) { return d.nam === y; })) add('buocNgoat', 'Bát Tự', 1.3, 'Bát Tự: năm giao đại vận');
  if ((chi - nChi + 12) % 12 === 6) add('buocNgoat', 'Bát Tự', 0.9, 'Bát Tự: năm xung Thái Tuế – dễ đổi chỗ ở/công việc');
  // Tuế vận tịnh lâm: can chi năm trùng can chi đại vận đang đi ("Tứ trụ dự đoán học" – Thiệu Vĩ Hoa: năm có biến lớn)
  var dvHt = bt.daiVan.filter(function (d) { return d.nam <= y; }).slice(-1)[0];
  if (dvHt && dvHt.can === can && dvHt.chi === chi) { add('buocNgoat', 'Bát Tự', 1.3, 'Bát Tự: tuế vận tịnh lâm (năm ' + cc + ' trùng đại vận) – năm biến động lớn'); add('sucKhoe', 'Bát Tự', 0.7, 'Bát Tự: tuế vận tịnh lâm – giữ sức khỏe'); }
  else if (dvHt && (dvHt.chi - chi + 12) % 12 === 6 && htKhacCan_(dvHt.can, can)) add('buocNgoat', 'Bát Tự', 0.9, 'Bát Tự: năm thiên khắc địa xung với đại vận ' + dvHt.canChi + ' – đổi hướng');
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
    // nhóm thêm cho Hồ sơ năm
    if (J === 9 || J === 3) add('hocHanh', 'Chiêm tinh', J === 9 ? 1.1 : 0.8, 'Chiêm tinh: Sao Mộc qua nhà ' + J + ' (học tập, ' + (J === 9 ? 'bằng cấp' : 'kỹ năng') + ')');
    else if (P === 9 || P === 3) add('hocHanh', 'Chiêm tinh', 0.6, 'Chiêm tinh: hồ sơ năm nhà ' + P);
    if (J === 9) add('diXa', 'Chiêm tinh', 1, 'Chiêm tinh: Sao Mộc qua nhà 9 (đi xa, nước ngoài)');
    else if (P === 9) add('diXa', 'Chiêm tinh', 0.7, 'Chiêm tinh: hồ sơ năm nhà 9');
    else if (J === 3) add('diXa', 'Chiêm tinh', 0.4, 'Chiêm tinh: Sao Mộc qua nhà 3 (đi lại gần)');
    if (J === 11) add('quyNhan', 'Chiêm tinh', 1, 'Chiêm tinh: Sao Mộc qua nhà 11 (bạn bè, người giúp)');
    else if (P === 11) add('quyNhan', 'Chiêm tinh', 0.6, 'Chiêm tinh: hồ sơ năm nhà 11');
    else if (J === 7) add('quyNhan', 'Chiêm tinh', 0.5, 'Chiêm tinh: Sao Mộc qua nhà 7 (đối tác tốt)');
    if (S === 7) add('thiPhi', 'Chiêm tinh', 0.9, 'Chiêm tinh: Sao Thổ qua nhà 7 – quan hệ, hợp đồng căng thẳng');
    else if (S === 3 || S === 9) add('thiPhi', 'Chiêm tinh', 0.5, 'Chiêm tinh: Sao Thổ qua nhà ' + S + ' – giấy tờ, thủ tục chậm trễ');
    if (P === 12) add('thiPhi', 'Chiêm tinh', 0.4, 'Chiêm tinh: hồ sơ năm nhà 12 – kẻ ngầm cản trở');
    if (J === 4) add('nhaDat', 'Chiêm tinh', 1, 'Chiêm tinh: Sao Mộc qua nhà 4 (nhà cửa mở rộng)');
    else if (P === 4) add('nhaDat', 'Chiêm tinh', 0.5, 'Chiêm tinh: hồ sơ năm nhà 4');
    if (S === 4) add('nhaDat', 'Chiêm tinh', 0.6, 'Chiêm tinh: Sao Thổ qua nhà 4 (sửa sang, gánh vác nhà cửa)');
    var tts = (S === 12 ? 1 : S === 1 ? 0.6 : 0) + (A.sSun === 'vuông' || A.sSun === 'đối' ? 0.6 : 0) + (P === 12 ? 0.4 : 0);
    if (tts) add('tinhThan', 'Chiêm tinh', Math.min(1.4, tts), 'Chiêm tinh: ' + [S === 12 || S === 1 ? 'Sao Thổ qua nhà ' + S : '', A.sSun === 'vuông' || A.sSun === 'đối' ? 'Sao Thổ ' + A.sSun + ' Mặt Trời gốc' : '', P === 12 ? 'hồ sơ năm nhà 12' : ''].filter(Boolean).join(', '));
  }
  // Thần số học
  var so = htNamCaNhan_(C.ts, tv.info.solar, y);
  Object.keys(HT_SO).forEach(function (k) { var v = HT_SO[k][so]; if (v) add(k, 'Thần số học', v, 'Thần số: năm cá nhân ' + so); });
  if (C.ts.dinhCao.some(function (p, i) { return i > 0 && tv.info.solar.year + p.tu === y; })) add('buocNgoat', 'Thần số học', 1, 'Thần số: bước sang đỉnh cao mới');
  return { nam: y, tuoi: tuoi, canChi: cc, soCN: so, tin: out };
}

/** Tín hiệu Bát Tự của một can chi lưu (năm hoặc tháng) so với tứ trụ gốc: thập thần, hỷ – kỵ, xung – hợp – hình,
 *  Đào hoa, Dịch Mã, Thiên Ất quý nhân, phục ngâm – phản ngâm (Thiệu Vĩ Hoa "Tứ trụ dự đoán học"; Tử Bình chân thuyên) */
function htKhacCan_(a, b) { var r = quanHeHanh(CAN_HANH[a], CAN_HANH[b]); return r === 'khac' || r === 'bi_khac'; }
function htBtTin_(bt, male, can, chi, add, kieu) {
  var cc = CAN[can] + ' ' + CHI[chi];
  var nc = bt.nhatChuCan, hy = bt.goiY.hy, ky = bt.goiY.ky;
  var tC = thapThanTen_(nc, can), tZ = thapThanTen_(nc, TANG_CAN[chi][0]), cc = CAN[can] + ' ' + CHI[chi];
  var hC = CAN_HANH[can], hZ = CHI_HANH[chi], tot = hy.indexOf(hC) >= 0 || hy.indexOf(hZ) >= 0, xau = ky.indexOf(hC) >= 0 && ky.indexOf(hZ) >= 0;
  var co = function (re) { return re.test(tC) || re.test(tZ); };
  var dChi = bt.pillars[2].chi, nChi = bt.pillars[0].chi, mChi = bt.pillars[1].chi, gChi = bt.pillars[3].chi;
  var xungNgay = (chi - dChi + 12) % 12 === 6, xungNam = (chi - nChi + 12) % 12 === 6, hopNgay = PN_LUC_HOP[dChi] === chi || (chi !== dChi && (chi - dChi + 12) % 4 === 0);
  if (co(/Chính Tài|Thiên Tài/)) add('taiLoc', 'Bát Tự', tot ? 1.3 : 0.6, 'Bát Tự: ' + kieu + ' ' + cc + ' mang Tài tinh (' + tC + '/' + tZ + ')' + (tot ? ', lại là hỷ dụng' : ''));
  if (co(/Quan|Sát/)) add('quanLoc', 'Bát Tự', tot ? 1.2 : 0.9, 'Bát Tự: ' + kieu + ' ' + cc + ' mang Quan/Sát – áp lực và cơ hội thăng tiến');
  var pn = male ? /Chính Tài|Thiên Tài/ : /Quan|Sát/;
  var kh = (co(pn) ? 0.8 : 0) + (hopNgay ? 0.6 : 0) + (HT_DAO_HOA[nChi] === chi || HT_DAO_HOA[dChi] === chi ? 0.5 : 0);
  if (kh) add('ketHon', 'Bát Tự', kh, 'Bát Tự: ' + [co(pn) ? 'sao phối ngẫu xuất hiện' : '', hopNgay ? kieu + ' hợp cung phu thê (nhật chi)' : '', HT_DAO_HOA[nChi] === chi || HT_DAO_HOA[dChi] === chi ? 'gặp Đào hoa' : ''].filter(Boolean).join(', '));
  var sc = male ? /Quan|Sát/ : /Thực|Thương/;
  var sv = (co(sc) ? 0.8 : 0) + (PN_LUC_HOP[gChi] === chi || (chi !== gChi && (chi - gChi + 12) % 4 === 0) ? 0.4 : 0);
  if (sv) add('sinhCon', 'Bát Tự', sv, 'Bát Tự: ' + (co(sc) ? 'sao con cái (' + (male ? 'Quan/Sát' : 'Thực/Thương') + ') đến' : kieu + ' hợp trụ giờ (cung con cái)'));
  var sk = (xau ? 0.7 : 0) + (xungNgay ? 0.5 : 0) + (xungNam ? 0.5 : 0) + (chi === nChi ? 0.3 : 0);
  if (sk) add('sucKhoe', 'Bát Tự', sk, 'Bát Tự: ' + [xau ? 'can chi ' + kieu + ' đều là kỵ thần' : '', xungNgay ? 'xung nhật chi' : '', xungNam ? 'xung Thái Tuế năm sinh' : '', chi === nChi ? (kieu === 'năm' ? 'năm tuổi' : 'tháng trùng chi tuổi') : ''].filter(Boolean).join(', '));
  var tcv = (co(/Kiếp|Tỷ/) && bt.tyLeTro >= 45 ? 0.9 : 0) + (co(/Chính Tài|Thiên Tài/) && !tot ? 0.4 : 0) + (xau ? 0.3 : 0);
  if (tcv) add('taiChinh', 'Bát Tự', tcv, 'Bát Tự: ' + (co(/Kiếp|Tỷ/) ? 'Tỷ Kiếp đoạt tài khi thân đã vượng' : 'tài đến nhưng thuộc kỵ thần – dễ vào nhanh ra nhanh'));
  var gd = (xungNgay ? 1 : 0) + ((chi - mChi + 12) % 12 === 6 ? 0.6 : 0);
  if (gd) add('giaDao', 'Bát Tự', gd, 'Bát Tự: ' + (xungNgay ? kieu + ' xung cung phu thê' : kieu + ' xung trụ tháng (cha mẹ, anh em)'));
  if (co(/Ấn/)) add('hocHanh', 'Bát Tự', tot ? 1.1 : 0.8, 'Bát Tự: ' + kieu + ' ' + cc + ' mang Ấn tinh – học hành, bằng cấp, giấy tờ');
  if (co(/Ấn/)) add('nhaDat', 'Bát Tự', tot ? 0.8 : 0.5, 'Bát Tự: Ấn tinh còn chủ nhà cửa, chỗ dựa');
  if ((HT_QUY_NHAN[nc] || []).indexOf(chi) >= 0) add('quyNhan', 'Bát Tự', 1.1, 'Bát Tự: ' + kieu + ' ' + cc + ' gặp Thiên Ất quý nhân của nhật chủ');
  else if (co(/Ấn/) && tot) add('quyNhan', 'Bát Tự', 0.6, 'Bát Tự: Ấn tinh hỷ dụng – có bề trên nâng đỡ');
  var tp = (co(/Thương/) ? 0.9 : 0) + (co(/Kiếp/) ? 0.5 : 0) + (lgQuanHeChi_(chi, dChi).indexOf('tương hình') >= 0 ? 0.6 : 0);
  if (tp) add('thiPhi', 'Bát Tự', Math.min(1.4, tp), 'Bát Tự: ' + [co(/Thương/) ? 'Thương Quan – lời nói dễ gây va chạm, kỵ kiện tụng' : '', co(/Kiếp/) ? 'Kiếp Tài – cạnh tranh, tiểu nhân' : '', lgQuanHeChi_(chi, dChi).indexOf('tương hình') >= 0 ? 'chi ' + kieu + ' hình nhật chi' : ''].filter(Boolean).join(', '));
  var maNam = [2, 11, 8, 5][nChi % 4], maNgay = [2, 11, 8, 5][dChi % 4];
  if (chi === maNam || chi === maNgay) add('diXa', 'Bát Tự', 1, 'Bát Tự: ' + kieu + ' ' + cc + ' gặp Dịch Mã – đi lại, đổi chỗ');
  else if (xungNgay) add('diXa', 'Bát Tự', 0.5, 'Bát Tự: ' + kieu + ' xung nhật chi – dễ phải di chuyển');
  var tt = (co(/Thiên Ấn|Kiêu/) ? 0.6 : 0) + (co(/Sát/) && !tot ? 0.7 : 0) + (xau ? 0.4 : 0);
  if (tt) add('tinhThan', 'Bát Tự', Math.min(1.4, tt), 'Bát Tự: ' + [co(/Thiên Ấn|Kiêu/) ? 'Thiên Ấn – hay lo nghĩ, dễ cô độc' : '', co(/Sát/) && !tot ? 'Thất Sát là kỵ – áp lực đè nặng' : '', xau ? 'can chi ' + kieu + ' đều là kỵ thần' : ''].filter(Boolean).join(', '));
  // Phục ngâm (can chi lưu trùng hệt trụ ngày/trụ năm) – sầu muộn, việc cũ lặp lại; Phản ngâm (thiên khắc địa xung) – đảo lộn
  [[2, 'trụ ngày (bản thân, hôn nhân)'], [0, 'trụ năm (gốc gác, cha mẹ)']].forEach(function (x) {
    var P = bt.pillars[x[0]];
    if (P.can === can && P.chi === chi) { add('tinhThan', 'Bát Tự', 0.9, 'Bát Tự: ' + kieu + ' ' + cc + ' phục ngâm ' + x[1] + ' – buồn phiền, việc cũ lặp lại'); add('giaDao', 'Bát Tự', 0.5, 'Bát Tự: phục ngâm ' + x[1]); }
    else if ((P.chi - chi + 12) % 12 === 6 && htKhacCan_(P.can, can)) { add('buocNgoat', 'Bát Tự', 1, 'Bát Tự: ' + kieu + ' ' + cc + ' phản ngâm (thiên khắc địa xung) ' + x[1] + ' – đảo lộn, thay đổi lớn'); add(x[0] === 2 ? 'giaDao' : 'sucKhoe', 'Bát Tự', 0.7, 'Bát Tự: phản ngâm ' + x[1]); }
  });
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

/* ===================================================================
 *  HỒ SƠ NĂM – BIẾN CỐ TỪNG NĂM (19 sự kiện · 8 khía cạnh)
 *  Mỗi sự kiện ghép tín hiệu "ủng hộ" và "ngược chiều" của 5 hệ có lịch năm.
 *  Xác suất = (số lần sự kiện thường gặp trong đời, theo độ tuổi) phân bổ cho
 *  từng năm theo sức mạnh tín hiệu: λ_năm = N × A(tuổi)·e^(βE) / Σ A·e^(βE),
 *  p = 1 − e^(−λ). E = Σ trọng số hệ × (ủng hộ − ngược chiều).
 *  Đây là mô hình tham khảo minh bạch, chưa hiệu chỉnh bằng dữ liệu thống kê thực.
 * =================================================================== */
/** Tín hiệu Tử Vi cho nhóm thêm (học hành, đi xa, quý nhân, thị phi, nhà đất, tinh thần) */
function htTinTuViThem_(tv, y, add) {
  var th = lgTieuHanCung_(tv, y); if (th < 0) return;
  var ex = lgLuuTinh_(tv, y).ex, P = tv.palaces, tp = lgTPTC_(th);
  function luu(p, n) { return (ex[mod12(p)] || []).indexOf('L.' + n) >= 0; }
  function luuTP(n) { return tp.some(function (p) { return luu(p, n); }); }
  function goc(p, n) { return lgSaoTrongCung_(tv, mod12(p)).indexOf(n) >= 0; }
  function cong(k, ds) {
    var v = 0, ly = [];
    ds.forEach(function (d) { if (d[0]) { v += d[1]; ly.push(d[2]); } });
    if (v > 0) add(k, 'Tử Vi', Math.min(1.4, Math.round(v * 10) / 10), 'Tử Vi: ' + ly.join(', '));
  }
  var khoa = luu(th, 'Hóa Khoa'), xk = luu(th, 'Văn Xương') || luu(th, 'Văn Khúc'), kv = luu(th, 'Thiên Khôi') || luu(th, 'Thiên Việt');
  cong('hocHanh', [[khoa, 1.1, 'lưu Hóa Khoa tại cung tiểu hạn'], [!khoa && (luu(th - 8, 'Hóa Khoa') || luuTP('Hóa Khoa')), 0.6, 'lưu Hóa Khoa chiếu hạn'],
    [xk, 0.8, 'lưu Văn Xương/Văn Khúc tại hạn'], [!xk && (luuTP('Văn Xương') || luuTP('Văn Khúc')), 0.4, 'lưu Văn Xương/Văn Khúc chiếu hạn']]);
  cong('diXa', [[luu(th, 'Thiên Mã'), 1.1, 'lưu Thiên Mã tại cung tiểu hạn'], [luu(th + 6, 'Thiên Mã'), 0.7, 'lưu Thiên Mã tại Thiên Di năm'],
    [P[th].cung === 'Thiên Di', 0.8, 'tiểu hạn đi vào cung Thiên Di gốc'], [goc(th, 'Thiên Mã'), 0.4, 'Thiên Mã gốc tại hạn']]);
  cong('quyNhan', [[kv, 1, 'lưu Thiên Khôi/Thiên Việt tại hạn'], [!kv && (luuTP('Thiên Khôi') || luuTP('Thiên Việt')), 0.5, 'lưu Khôi/Việt chiếu hạn'],
    [goc(th, 'Tả Phù') || goc(th, 'Hữu Bật'), 0.4, 'Tả Phù/Hữu Bật gốc tại hạn'], [khoa, 0.3, 'lưu Hóa Khoa – có người giải nguy']]);
  cong('thiPhi', [[luu(th, 'Kình Dương') || luu(th, 'Đà La'), 0.7, 'lưu Kình Dương/Đà La tại hạn'], [luu(th, 'Hóa Kỵ') || luu(th - 7, 'Hóa Kỵ'), 1, 'lưu Hóa Kỵ tại hạn hoặc Nô Bộc năm'],
    [luu(th, 'Thái Tuế'), 0.6, 'lưu Thái Tuế tại hạn – lời ra tiếng vào'], [goc(th, 'Quan Phù') || goc(th, 'Quan Phủ'), 0.5, 'Quan Phù/Quan Phủ tại hạn – giấy tờ, kiện tụng'], [goc(th, 'Thiên Hình'), 0.4, 'Thiên Hình gốc tại hạn']]);
  cong('nhaDat', [[P[th].cung === 'Điền Trạch', 0.9, 'tiểu hạn đi vào cung Điền Trạch gốc'], [luu(th - 9, 'Hóa Lộc') || luu(th - 9, 'Lộc Tồn'), 0.8, 'lưu Lộc nhập Điền Trạch năm'],
    [luu(th - 9, 'Hóa Quyền'), 0.5, 'lưu Hóa Quyền nhập Điền Trạch năm'], [luu(th - 9, 'Thiên Mã'), 0.4, 'lưu Thiên Mã tại Điền Trạch năm – dời nhà']]);
  cong('tinhThan', [[luu(th, 'Thiên Khốc') || luu(th, 'Thiên Hư'), 0.6, 'lưu Thiên Khốc/Thiên Hư tại hạn'], [luu(th - 10, 'Hóa Kỵ'), 1, 'lưu Hóa Kỵ nhập Phúc Đức năm – lo nghĩ'],
    [luu(th, 'Tang Môn'), 0.5, 'lưu Tang Môn tại hạn'], [P[th].cung === 'Phúc Đức' && P[th].diem < 0, 0.5, 'tiểu hạn vào cung Phúc Đức gốc yếu']]);
}

var HSN_HE = ['Tử Vi', 'Bát Tự', 'Hà Lạc', 'Chiêm tinh', 'Thần số học'];
var HSN_W = { 'Tử Vi': 1.2, 'Bát Tự': 1.1, 'Chiêm tinh': 1, 'Hà Lạc': 0.8, 'Thần số học': 0.6 };
var HSN_NGUON = { 'Tử Vi': 'vận năm trên lá số', 'Bát Tự': 'khí của năm so với ngũ hành gốc', 'Hà Lạc': 'quẻ của năm', 'Chiêm tinh': 'chu kỳ các hành tinh lớn', 'Thần số học': 'con số năm cá nhân' };
var HSN_BETA = 0.9;
var HSN_KC = [
  { k: 'nghiep', ten: 'Sự nghiệp – công việc', icon: '▲' },
  { k: 'tien', ten: 'Tài chính – tài sản', icon: '◈' },
  { k: 'tinh', ten: 'Tình cảm – hôn nhân', icon: '❤' },
  { k: 'con', ten: 'Con cái', icon: '✿' },
  { k: 'khoe', ten: 'Sức khỏe – tinh thần', icon: '✚' },
  { k: 'nha', ten: 'Gia đình – nhà cửa', icon: '⌂' },
  { k: 'hoc', ten: 'Học hành – đi xa', icon: '✎' },
  { k: 'quanHe', ten: 'Quan hệ – giấy tờ', icon: '☯' }
];
/* N: số lần sự kiện thường gặp trong cả cửa sổ tuổi (ước lượng đời thường); ngan: tên ngắn; nguoc: chiều ngược khi có hệ phản đối */
var HSN_SK = [
  { k: 'thangTien', kc: 'nghiep', loai: 'tot', ten: 'Thăng tiến, được giao việc lớn hoặc ghi nhận thành tích', ngan: 'thăng tiến', nguoc: 'trở ngại, va chạm nơi làm việc',
    ung: { quanLoc: 1, quyNhan: 0.4 }, nghich: { thiPhi: 0.5, tinhThan: 0.3 }, N: 4, tuoi: [20, 65],
    khuyen: 'Chủ động nhận việc khó, ghi lại kết quả cụ thể và nói rõ mong muốn với người có quyền quyết định.' },
  { k: 'doiViec', kc: 'nghiep', loai: 'dong', ten: 'Đổi việc, chuyển nơi làm hoặc đổi hướng nghề', ngan: 'thay đổi công việc', nguoc: 'mọi thứ giữ nguyên',
    ung: { buocNgoat: 1, quanLoc: 0.3, diXa: 0.3 }, nghich: {}, N: 5, tuoi: [18, 65],
    khuyen: 'Nếu muốn đổi, chuẩn bị trước hồ sơ và khoản dự phòng 3–6 tháng; nếu muốn ở lại, đây là lúc nói chuyện lại về vai trò.' },
  { k: 'apLucViec', kc: 'nghiep', loai: 'xau', ten: 'Áp lực, cạnh tranh hoặc va chạm nơi làm việc', ngan: 'áp lực công việc', nguoc: 'được nâng đỡ',
    ung: { thiPhi: 0.8, tinhThan: 0.4, quanLoc: 0.2 }, nghich: { quyNhan: 0.5 }, N: 10, tuoi: [18, 68],
    khuyen: 'Giữ mọi thỏa thuận bằng văn bản, tránh tranh luận lúc nóng, chọn một người đáng tin để trao đổi trước khi phản ứng.' },
  { k: 'thuNhap', kc: 'tien', loai: 'tot', ten: 'Thu nhập tăng rõ rệt hoặc có khoản tiền lớn', ngan: 'thu nhập tăng', nguoc: 'hao hụt tiền bạc',
    ung: { taiLoc: 1 }, nghich: { taiChinh: 0.7 }, N: 6, tuoi: [18, 80],
    khuyen: 'Đặt trước tỷ lệ tiết kiệm cho mọi khoản thu thêm; đừng để thu nhập tăng kéo chi tiêu tăng theo.' },
  { k: 'haoTai', kc: 'tien', loai: 'xau', ten: 'Hao tài: chi lớn ngoài dự kiến, mất tiền hoặc đầu tư thua lỗ', ngan: 'hao tài', nguoc: 'tiền vào thuận',
    ung: { taiChinh: 1 }, nghich: { taiLoc: 0.6 }, N: 6, tuoi: [18, 90],
    khuyen: 'Không cho vay hay đứng tên bảo lãnh lớn; giữ quỹ dự phòng; mọi khoản đầu tư mới nên thử nhỏ trước.' },
  { k: 'taiSan', kc: 'tien', loai: 'dong', ten: 'Mua bán nhà đất, xe hoặc tài sản lớn', ngan: 'giao dịch tài sản lớn', nguoc: 'chưa thuận để mua bán',
    ung: { nhaDat: 1, taiLoc: 0.4 }, nghich: { taiChinh: 0.4 }, N: 3, tuoi: [22, 75],
    khuyen: 'Kiểm tra kỹ giấy tờ pháp lý, đọc hợp đồng với người có chuyên môn; đừng vay vượt 40% thu nhập hằng tháng.' },
  { k: 'quenMoi', kc: 'tinh', loai: 'tot', ten: 'Có mối quan hệ tình cảm mới hoặc tình cảm hiện tại thăng hoa', ngan: 'tình cảm khởi sắc', nguoc: 'tình cảm nguội lạnh',
    ung: { ketHon: 1 }, nghich: { giaDao: 0.4 }, N: 4, tuoi: [16, 50],
    khuyen: 'Mở lòng với các mối quan hệ qua bạn bè, công việc; nếu đã có đôi, dành thời gian riêng cho hai người.' },
  { k: 'cuoiHoi', kc: 'tinh', loai: 'tot', ten: 'Cưới hỏi (hoặc hỷ sự lớn trong gia đình nếu đã lập gia đình)', ngan: 'cưới hỏi', nguoc: 'trắc trở chuyện lứa đôi',
    ung: { ketHon: 1.2 }, nghich: { giaDao: 0.5 }, N: 1.2, tuoi: [18, 45],
    khuyen: 'Nếu đã có ý định, đây là năm nên bàn chuyện tương lai rõ ràng với người kia và gia đình hai bên.' },
  { k: 'batHoa', kc: 'tinh', loai: 'xau', ten: 'Bất hòa, xa cách trong chuyện vợ chồng – người yêu', ngan: 'bất hòa tình cảm', nguoc: 'tình cảm êm ấm',
    ung: { giaDao: 0.8, thiPhi: 0.3 }, nghich: { ketHon: 0.5 }, N: 5, tuoi: [18, 80],
    khuyen: 'Nói ra điều mình cần thay vì chờ người kia tự hiểu; tránh quyết định lớn về quan hệ khi đang giận.' },
  { k: 'conCai', kc: 'con', loai: 'tot', ten: 'Tin vui con cái (mang thai, sinh nở) hoặc niềm vui lớn từ con', ngan: 'tin vui con cái', nguoc: 'lo lắng về con',
    ung: { sinhCon: 1 }, nghich: {}, N: 2, tuoi: [20, 44],
    khuyen: 'Nếu đang mong con, chăm sức khỏe cả hai vợ chồng từ đầu năm; nếu đã có con, dành thời gian đồng hành cùng con.' },
  { k: 'omDau', kc: 'khoe', loai: 'xau', ten: 'Ốm đau phải chữa trị hoặc mệt mỏi kéo dài', ngan: 'ốm đau', nguoc: 'sức khỏe vững',
    ung: { sucKhoe: 1, tinhThan: 0.3 }, nghich: {}, N: 12, tuoi: [1, 90],
    khuyen: 'Khám sức khỏe định kỳ đầu năm, ngủ đủ, đừng trì hoãn khi cơ thể báo hiệu bất thường.' },
  { k: 'taiNan', kc: 'khoe', loai: 'xau', ten: 'Va chạm, tai nạn nhỏ hoặc phải phẫu thuật', ngan: 'va chạm, tai nạn', nguoc: 'đi lại bình an',
    ung: { sucKhoe: 0.6, diXa: 0.3, thiPhi: 0.2 }, nghich: {}, N: 4, tuoi: [5, 90],
    khuyen: 'Cẩn thận khi lái xe, leo cao, dùng máy móc; mua bảo hiểm phù hợp; không đi đường xa khi mệt.' },
  { k: 'tinhThan', kc: 'khoe', loai: 'xau', ten: 'Áp lực tinh thần, lo âu, cần nghỉ ngơi', ngan: 'căng thẳng tinh thần', nguoc: 'tinh thần thoải mái',
    ung: { tinhThan: 1, sucKhoe: 0.2 }, nghich: { quyNhan: 0.3 }, N: 10, tuoi: [12, 90],
    khuyen: 'Giữ một thói quen giúp đầu óc nghỉ (đi bộ, thiền, viết), chia sẻ với người thân, đừng ôm việc một mình.' },
  { k: 'nguoiThan', kc: 'nha', loai: 'xau', ten: 'Biến động liên quan cha mẹ hoặc người thân (sức khỏe, việc hiếu)', ngan: 'biến động người thân', nguoc: 'gia đình yên ổn',
    ung: { giaDao: 1 }, nghich: {}, N: 6, tuoi: [10, 90],
    khuyen: 'Thăm hỏi cha mẹ, người lớn tuổi thường xuyên hơn; nhắc mọi người khám sức khỏe.' },
  { k: 'nhaCua', kc: 'nha', loai: 'dong', ten: 'Sửa nhà, chuyển nhà hoặc thay đổi chỗ ở', ngan: 'thay đổi chỗ ở', nguoc: 'chỗ ở ổn định',
    ung: { nhaDat: 0.8, buocNgoat: 0.5, diXa: 0.3 }, nghich: {}, N: 6, tuoi: [18, 85],
    khuyen: 'Nếu sửa hay chuyển nhà, chọn tháng thuận bên dưới và dự trù ngân sách dư 20%.' },
  { k: 'hocThi', kc: 'hoc', loai: 'tot', ten: 'Học thêm, thi cử, lấy bằng cấp – chứng chỉ', ngan: 'học hành thi cử', nguoc: 'học hành trắc trở',
    ung: { hocHanh: 1 }, nghich: { tinhThan: 0.3 }, N: 5, tuoi: [6, 60],
    khuyen: 'Đăng ký khóa học hay kỳ thi bạn đã định – năm có tín hiệu học hành thì công sức bỏ ra dễ thành kết quả.' },
  { k: 'diXa', kc: 'hoc', loai: 'dong', ten: 'Đi xa: công tác dài, du học, định cư hoặc chuyến đi đáng nhớ', ngan: 'đi xa', nguoc: 'ở yên một chỗ',
    ung: { diXa: 1, buocNgoat: 0.3 }, nghich: {}, N: 6, tuoi: [6, 85],
    khuyen: 'Chuẩn bị giấy tờ (hộ chiếu, visa) sớm; chuyến đi năm nay dễ mở ra cơ hội hoặc mối quan hệ mới.' },
  { k: 'quyNhan', kc: 'quanHe', loai: 'tot', ten: 'Gặp quý nhân giúp đỡ, mở rộng quan hệ có ích', ngan: 'quý nhân giúp đỡ', nguoc: 'thị phi, tiểu nhân',
    ung: { quyNhan: 1 }, nghich: { thiPhi: 0.5 }, N: 10, tuoi: [10, 85],
    khuyen: 'Tham gia hội nhóm, sự kiện nghề nghiệp; chủ động nhờ giúp – người phù hợp dễ xuất hiện năm nay.' },
  { k: 'thiPhi', kc: 'quanHe', loai: 'xau', ten: 'Thị phi, tranh chấp hoặc rắc rối giấy tờ – pháp lý', ngan: 'thị phi, tranh chấp', nguoc: 'được giúp đỡ',
    ung: { thiPhi: 1 }, nghich: { quyNhan: 0.5 }, N: 5, tuoi: [16, 85],
    khuyen: 'Đọc kỹ trước khi ký, giữ chứng từ, tránh nói sau lưng người khác; có tranh chấp thì nên hòa giải sớm.' }
];
var HSN_THANG_TT = { taiLoc: /Chính Tài|Thiên Tài/, quanLoc: /Quan|Sát/, hocHanh: /Ấn/, nhaDat: /Ấn/, quyNhan: /Ấn/, thiPhi: /Thương|Kiếp/, taiChinh: /Kiếp|Tỷ/, tinhThan: /Thiên Ấn|Sát/ };

/** Hiệu số ủng hộ − ngược chiều của một hệ cho một sự kiện trong một năm (hoặc tháng) */
function htNet_(n, sk, he) {
  var v = 0, o = n.tin;
  Object.keys(sk.ung).forEach(function (k) { var x = o[k] && o[k][he]; if (x) v += sk.ung[k] * Math.min(1.4, x.v); });
  Object.keys(sk.nghich).forEach(function (k) { var x = o[k] && o[k][he]; if (x) v -= sk.nghich[k] * Math.min(1.4, x.v); });
  return v;
}
/** Sức mạnh tín hiệu chung E = Σ trọng số hệ × hiệu số (mỗi hệ kẹp −1,2 … 1,6) */
function htE_(n, sk, W) { var e = 0; Object.keys(W).forEach(function (h) { e += W[h] * Math.max(-1.2, Math.min(1.6, htNet_(n, sk, h))); }); return e; }
/** Khả năng theo độ tuổi (tiên nghiệm) */
function htTuoiA_(sk, t) {
  if (sk.k === 'cuoiHoi') return ddTuoiHeSo_('ketHon', t);
  if (sk.k === 'conCai') return ddTuoiHeSo_('sinhCon', t);
  if (t < sk.tuoi[0] - 3 || t > sk.tuoi[1] + 5) return 0;
  var w = t < sk.tuoi[0] || t > sk.tuoi[1] ? 0.3 : 1;
  if (sk.k === 'omDau' || sk.k === 'taiNan' || sk.k === 'nguoiThan') w *= 0.6 + t / 60;
  return w;
}
/** Bảng λ (kỳ vọng số lần) và rel (gấp mấy lần mức thường) của mọi sự kiện trong mọi năm – dùng chung cho năm, tháng, đại vận */
function htSkLuoi_(namTin, W) {
  var out = {};
  HSN_SK.forEach(function (S) {
    var tong = 0, tongA = 0, ds = namTin.map(function (n) {
      var a = htTuoiA_(S, n.tuoi), w = a > 0 ? a * Math.exp(HSN_BETA * htE_(n, S, W)) : 0; tong += w; tongA += a; return { nam: n.nam, tuoi: n.tuoi, a: a, w: w };
    });
    ds.forEach(function (x) { x.lam = tong > 0 ? S.N * x.w / tong : 0; x.rel = tong > 0 && x.a > 0 ? x.w / x.a * tongA / tong : 0; x.p = Math.round((1 - Math.exp(-x.lam)) * 100); });
    out[S.k] = ds;
  });
  return out;
}

/** Mức khả năng: xét cả xác suất tuyệt đối lẫn mức so với bình thường của chính người đó (rel) */
function htMucP_(p, rel) { return p >= 50 || (rel >= 3 && p >= 20) ? 'Rất cao' : rel >= 2.2 ? 'Cao' : rel >= 1.5 ? 'Khá cao' : rel >= 0.8 ? 'Bình thường' : 'Thấp'; }
function htDs_(a) { return a.length <= 1 ? a.join('') : a.slice(0, -1).join(', ') + ' và ' + a[a.length - 1]; }

/** Hồ sơ năm xem: 19 sự kiện, xác suất, hệ ủng hộ – ngược chiều, tháng nên chú ý, lời khuyên */
function htHoSoNam_(C, namTin, thang, W) {
  W = W || HSN_W;
  var vy = C.tv.info.viewYear, nay = new Date().getFullYear(), male = C.tv.info.male, bt = C.bt;
  var n0 = namTin.filter(function (n) { return n.nam === vy; })[0];
  if (!n0) return null;
  var net = htNet_;
  function E(n, sk) { return htE_(n, sk, W); }
  var A = htTuoiA_;
  // Tháng (âm lịch) của năm xem: thập thần can/chi tháng khớp chủ đề + điểm tháng tổng hợp
  var nc = bt.nhatChuCan, MT = Object.assign({}, HSN_THANG_TT, { ketHon: male ? /Chính Tài|Thiên Tài/ : /Quan|Sát/, sinhCon: male ? /Quan|Sát/ : /Thực|Thương/ });
  var thTT = (thang || []).map(function (m) {
    var p = String(m.canChi).split(' '), can = CAN.indexOf(p[0]), chi = CHI.indexOf(p[1]);
    return { thang: m.thang, diem: +m.diem || 0, tt: can >= 0 && chi >= 0 ? thapThanTen_(nc, can) + '/' + thapThanTen_(nc, TANG_CAN[chi][0]) : '' };
  });
  function thangHop(sk) {
    if (!thTT.length) return [];
    return thTT.map(function (m) {
      var khop = 0; Object.keys(sk.ung).forEach(function (k) { if (MT[k] && MT[k].test(m.tt)) khop += sk.ung[k]; });
      return { thang: m.thang, d: (sk.loai === 'xau' ? -m.diem : m.diem) + 0.8 * khop };
    }).sort(function (a, b) { return b.d - a.d; }).slice(0, 2).map(function (m) { return m.thang; }).sort(function (a, b) { return a - b; });
  }
  var qua = vy < nay;
  var sk = HSN_SK.map(function (S) {
    var tong = 0, tongA = 0;
    namTin.forEach(function (n) { var a = A(S, n.tuoi); if (a > 0) { tong += a * Math.exp(HSN_BETA * E(n, S)); tongA += a; } });
    var a0 = A(S, n0.tuoi), e0 = E(n0, S);
    var lam = tong > 0 && a0 > 0 ? S.N * a0 * Math.exp(HSN_BETA * e0) / tong : 0;
    var p = a0 > 0 ? Math.max(2, Math.min(90, Math.round((1 - Math.exp(-lam)) * 100))) : 0;
    var rel = tong > 0 && a0 > 0 ? Math.round(Math.exp(HSN_BETA * e0) * tongA / tong * 10) / 10 : 0;
    var ung = [], nghich = [], ly = {};
    HSN_HE.forEach(function (h) {
      var v = net(n0, S, h);
      if (v >= 0.5) ung.push(h); else if (v <= -0.4) nghich.push(h);
      var l = [];
      Object.keys(S.ung).concat(Object.keys(S.nghich)).forEach(function (k) { var x = n0.tin[k] && n0.tin[k][h]; if (x && l.indexOf(x.ly) < 0) l.push(x.ly); });
      if (l.length) ly[h] = l;
    });
    var dong = !a0 ? 'Ngoài độ tuổi' : ung.length >= 3 && !nghich.length ? 'Đồng thuận' : ung.length && nghich.length ? 'Đối lập' : ung.length >= 2 ? 'Nghiêng về' : ung.length === 1 ? 'Một hệ báo' : nghich.length ? 'Nghiêng chiều ngược' : 'Ít tín hiệu';
    var tenUng = ung.map(function (h) { return h + ' (' + HSN_NGUON[h] + ')'; });
    var giai = !a0 ? 'Ngoài độ tuổi thường gặp của việc này.' :
      dong === 'Đồng thuận' ? ung.length + ' hệ – ' + htDs_(tenUng) + ' – cùng nghiêng về ' + S.ngan + '. Khi nhiều phương pháp độc lập cùng chỉ một hướng, khả năng cao hơn mức thường của bạn' + (rel >= 1.3 ? ' (khoảng ' + (rel >= 5 ? 'hơn ×5' : '×' + String(rel).replace('.', ',')) + ')' : '') + '.' :
      dong === 'Đối lập' ? htDs_(ung) + ' nghiêng về ' + S.ngan + '; ' + htDs_(nghich) + ' lại cho chiều ngược (' + S.nguoc + '). ' +
        (S.loai === 'tot' ? 'Cơ hội có thật nhưng kèm trở ngại – kết quả phụ thuộc nhiều vào sự chuẩn bị và thời điểm bạn chọn.' : S.loai === 'xau' ? 'Rủi ro có, nhưng cũng có yếu tố đỡ – phòng trước thì nhẹ đi đáng kể.' : 'Thay đổi có thể đến nhưng chưa chắc theo cách bạn muốn – cân nhắc kỹ trước khi quyết.') :
      dong === 'Nghiêng về' ? htDs_(tenUng) + ' cùng nghiêng về ' + S.ngan + ', các hệ còn lại không phản đối.' :
      dong === 'Một hệ báo' ? 'Chỉ ' + tenUng[0] + ' báo – tín hiệu riêng lẻ, nên coi là khả năng, chưa phải xu hướng chung.' :
      dong === 'Nghiêng chiều ngược' ? htDs_(nghich) + ' nghiêng về ' + S.nguoc + ' – việc này khó xảy ra hơn mức thường.' :
      'Các hệ không có tín hiệu đáng kể – khả năng ở mức nền theo độ tuổi.';
    return { k: S.k, kc: S.kc, loai: S.loai, ten: S.ten, ngan: S.ngan, p: p, muc: a0 ? htMucP_(p, rel) : '—', rel: rel, E: Math.round(e0 * 10) / 10,
      ung: ung, nghich: nghich, dong: dong, giai: giai, khuyen: S.khuyen, thang: a0 ? thangHop(S) : [], ly: ly, ngoai: !a0 };
  });
  // Khía cạnh
  var khiaCanh = HSN_KC.map(function (K) {
    var ds = sk.filter(function (x) { return x.kc === K.k && !x.ngoai; });
    function mx(loai) { return ds.filter(function (x) { return x.loai === loai && x.p >= 15; }).reduce(function (m, x) { return Math.max(m, x.rel); }, 0); }
    var g = mx('tot'), b = mx('xau'), d = mx('dong');
    var nhan = !ds.length ? 'Chưa đến tuổi' : g >= 1.8 && b >= 1.8 ? 'Cơ hội lẫn thử thách' : b >= 1.8 ? 'Cần giữ' : g >= 1.8 ? 'Thuận' : d >= 1.8 ? 'Có thay đổi' : 'Bình ổn';
    var huong = nhan === 'Thuận' ? 'tot' : nhan === 'Cần giữ' ? 'xau' : nhan === 'Bình ổn' || nhan === 'Chưa đến tuổi' ? 'vua' : 'dong';
    var top = ds.slice().sort(function (a, b) { return b.p - a.p; })[0];
    return { k: K.k, ten: K.ten, icon: K.icon, nhan: nhan, huong: huong, doiLap: ds.some(function (x) { return x.dong === 'Đối lập' && x.p >= 15; }),
      cau: top && top.p < 10 && top.muc !== 'Cao' && top.muc !== 'Rất cao' ? 'Không có việc nổi bật – khía cạnh này khá yên trong năm.' : top ? 'Nổi bật nhất: ' + top.ngan + ' (' + top.p + '%, ' + top.dong.toLowerCase() + ').' : '', sk: ds.map(function (x) { return x.k; }) };
  });
  // Mỗi hệ nói gì về cả năm
  var he = HSN_HE.map(function (h) {
    var t = 0, x = 0;
    sk.forEach(function (s) { if (s.ngoai) return; var v = net(n0, HSN_SK.filter(function (S) { return S.k === s.k; })[0], h); if (s.loai === 'tot') t += Math.max(0, v); else if (s.loai === 'xau') x += Math.max(0, v); });
    var d = t - x;
    return { he: h, nguon: HSN_NGUON[h], tot: Math.round(t * 10) / 10, xau: Math.round(x * 10) / 10, huong: d >= 0.8 ? 'tot' : d <= -0.8 ? 'xau' : 'vua', nhan: d >= 0.8 ? 'Nghiêng thuận' : d <= -0.8 ? 'Nghiêng thử thách' : 'Trung tính' };
  });
  var soTot = he.filter(function (x) { return x.huong === 'tot'; }).length, soXau = he.filter(function (x) { return x.huong === 'xau'; }).length;
  var noiBat = sk.filter(function (x) { return !x.ngoai && (x.muc === 'Rất cao' || x.muc === 'Cao' || x.muc === 'Khá cao'); }).sort(function (a, b) { return b.p - a.p; }).slice(0, 5);
  var doiLap = sk.filter(function (x) { return x.dong === 'Đối lập' && x.p >= 15; });
  var canGiu = sk.filter(function (x) { return x.loai === 'xau' && !x.ngoai; }).sort(function (a, b) { return b.p - a.p; })[0];
  var tom = [];
  tom.push('Năm ' + vy + ' (' + n0.canChi + ', ' + n0.tuoi + ' tuổi mụ): ' + (soTot > soXau ? soTot + '/5 hệ nghiêng thuận' + (soXau ? ', ' + soXau + ' hệ nghiêng thử thách' : '') + '.' :
    soXau > soTot ? soXau + '/5 hệ nghiêng thử thách' + (soTot ? ', ' + soTot + ' hệ nghiêng thuận' : '') + ' – năm nên chắc hơn tiến.' : 'các hệ chia đều thuận – khó, năm có cả cơ hội lẫn việc cần giữ.'));
  if (noiBat.length) tom.push((qua ? 'Những việc nhiều khả năng đã diễn ra: ' : 'Những việc nhiều khả năng xảy ra: ') + noiBat.slice(0, 3).map(function (x) { return x.ngan + ' (' + x.p + '%)'; }).join(', ') + '.');
  if (canGiu && canGiu.p >= 15) tom.push(noiBat.slice(0, 3).indexOf(canGiu) >= 0 ? 'Với ' + canGiu.ngan + ': ' + canGiu.khuyen.charAt(0).toLowerCase() + canGiu.khuyen.slice(1) :
    'Điều nên chủ động phòng: ' + canGiu.ngan + ' (' + canGiu.p + '%). ' + canGiu.khuyen);
  if (doiLap.length) tom.push('Các hệ chưa thống nhất ở: ' + doiLap.map(function (x) { return x.ngan; }).join(', ') + ' – xem phần giải thích để biết hệ nào nói gì.');
  if (qua) tom.push('Năm này đã qua: hãy đối chiếu với những gì bạn đã trải qua – càng khớp, các năm tới càng đáng tin.');
  return { nam: vy, tuoi: n0.tuoi, canChi: n0.canChi, soCN: n0.soCN, qua: qua, tom: tom, he: he, khiaCanh: khiaCanh, suKien: sk,
    noiBat: noiBat.map(function (x) { return x.k; }), doiLap: doiLap.map(function (x) { return x.k; }),
    coSo: 'Mỗi sự kiện ghép tín hiệu của 5 hệ có lịch năm (Tử Vi, Bát Tự, Hà Lạc, Chiêm tinh, Thần số học; Human Design không có lịch năm). Mỗi hệ có tín hiệu "ủng hộ" và "ngược chiều" – ví dụ với thu nhập tăng, tín hiệu hao tài là ngược chiều. ' +
      'Xác suất lấy số lần việc đó thường gặp trong đời người (ví dụ đổi việc khoảng 5 lần, cưới khoảng 1 lần) rồi phân bổ cho từng năm theo độ tuổi và sức mạnh tín hiệu: năm càng nhiều hệ cùng báo càng nhận phần lớn. ' +
      '"×2" nghĩa là gấp đôi mức thường của chính bạn ở độ tuổi đó. Đồng thuận = từ 3 hệ cùng báo, không hệ nào ngược; Đối lập = có hệ báo và có hệ ngược chiều. ' +
      'Đây là mô hình tham khảo minh bạch, chưa được hiệu chỉnh bằng thống kê thực tế – hãy dùng các năm đã qua để tự kiểm chứng.' };
}
