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
  { k: 'sucKhoe', ten: 'Sức khỏe dễ sa sút', loai: 'xau', icon: '✚', tuoi: [1, 90] },
  { k: 'taiChinh', ten: 'Giai đoạn dễ hao tiền', loai: 'xau', icon: '⚠', tuoi: [18, 90] },
  { k: 'giaDao', ten: 'Gia đình – nhà cửa dễ căng', loai: 'xau', icon: '⌂', tuoi: [1, 90] }
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
    if (v >= ctx.tv[T.k][1]) add(T.k, 'Tử Vi', 1.4, 'Tử Vi: tín hiệu rất mạnh (thuộc nhóm năm mạnh nhất cả đời, cường độ ' + Math.min(10, v) + '/10)');
    else if (v >= ctx.tv[T.k][0]) add(T.k, 'Tử Vi', 1, 'Tử Vi: tín hiệu mạnh (thuộc nhóm năm mạnh cả đời, cường độ ' + Math.min(10, v) + '/10)');
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
  if (dvHt && dvHt.can === can && dvHt.chi === chi) { add('buocNgoat', 'Bát Tự', 1.3, 'Bát Tự: tuế vận tịnh lâm (năm ' + cc + ' trùng đại vận) – năm có nhiều chuyển động'); add('sucKhoe', 'Bát Tự', 0.7, 'Bát Tự: tuế vận tịnh lâm – giữ sức khỏe'); }
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
    if ([1, 6, 12].indexOf(S) >= 0) add('sucKhoe', 'Chiêm tinh', 1, 'Chiêm tinh: Sao Thổ qua nhà ' + S + ' (thể lực – nên nghỉ ngơi điều độ)');
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
    if (P === 12) add('thiPhi', 'Chiêm tinh', 0.4, 'Chiêm tinh: hồ sơ năm nhà 12 – việc ngầm cần để ý');
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
  if (tp) add('thiPhi', 'Bát Tự', Math.min(1.4, tp), 'Bát Tự: ' + [co(/Thương/) ? 'Thương Quan – lời nói dễ gây va chạm, nên cẩn trọng giấy tờ, hợp đồng' : '', co(/Kiếp/) ? 'Kiếp Tài – cạnh tranh, nên giữ chữ tín' : '', lgQuanHeChi_(chi, dChi).indexOf('tương hình') >= 0 ? 'chi ' + kieu + ' hình nhật chi' : ''].filter(Boolean).join(', '));
  var maNam = [2, 11, 8, 5][nChi % 4], maNgay = [2, 11, 8, 5][dChi % 4];
  if (chi === maNam || chi === maNgay) add('diXa', 'Bát Tự', 1, 'Bát Tự: ' + kieu + ' ' + cc + ' gặp Dịch Mã – đi lại, đổi chỗ');
  else if (xungNgay) add('diXa', 'Bát Tự', 0.5, 'Bát Tự: ' + kieu + ' xung nhật chi – dễ phải di chuyển');
  var tt = (co(/Thiên Ấn|Kiêu/) ? 0.6 : 0) + (co(/Sát/) && !tot ? 0.7 : 0) + (xau ? 0.4 : 0);
  if (tt) add('tinhThan', 'Bát Tự', Math.min(1.4, tt), 'Bát Tự: ' + [co(/Thiên Ấn|Kiêu/) ? 'Thiên Ấn – hay lo nghĩ, dễ thu mình' : '', co(/Sát/) && !tot ? 'Thất Sát là kỵ – áp lực đè nặng' : '', xau ? 'can chi ' + kieu + ' đều là kỵ thần' : ''].filter(Boolean).join(', '));
  // Phục ngâm (can chi lưu trùng hệt trụ ngày/trụ năm) – sầu muộn, việc cũ lặp lại; Phản ngâm (thiên khắc địa xung) – đảo lộn
  [[2, 'trụ ngày (bản thân, hôn nhân)'], [0, 'trụ năm (gốc gác, cha mẹ)']].forEach(function (x) {
    var P = bt.pillars[x[0]];
    if (P.can === can && P.chi === chi) { add('tinhThan', 'Bát Tự', 0.9, 'Bát Tự: ' + kieu + ' ' + cc + ' phục ngâm ' + x[1] + ' – việc cũ dễ lặp lại, dễ buồn bực'); add('giaDao', 'Bát Tự', 0.5, 'Bát Tự: phục ngâm ' + x[1]); }
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
    coSo: 'Mỗi năm, 5 hệ có lịch thời gian (Tử Vi, Bát Tự, Hà Lạc, Chiêm tinh, Thần số học) độc lập phát tín hiệu theo 8 chủ đề. Tín hiệu Tử Vi lấy nhóm 20% năm mạnh nhất cả đời; Bát Tự xét thập thần, hỷ/kỵ, xung – hợp của can chi năm; Hà Lạc xét quẻ lưu niên; Chiêm tinh xét Sao Mộc, Sao Thổ qua 12 nhà, hồ sơ năm và các chu kỳ lớn; Thần số xét năm cá nhân. Năm có từ 3 hệ cùng báo được coi là tín hiệu rõ; 4 hệ – rõ hơn; 5 hệ – rất rõ. Human Design không có lịch năm nên không bỏ phiếu.' };
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
  items.push({ ten: 'Khung giờ vàng', gt: HT_GIO[dung].split(' (')[0], y: 'Làm việc quan trọng vào ' + HT_GIO[dung] + ' – giờ của dụng thần ' + dung + (hy2 ? '; phương án phụ: ' + HT_GIO[hy2] + '.' : '.') + (hd.loai === 'Projector' || hd.loai === 'Reflector' ? ' Human Design: bạn không có sinh lực bền – làm kéo dài dễ kiệt sức, cáu bẳn; hợp chia việc thành các đợt ngắn.' : ' Human Design: bạn có nguồn sinh lực bền – làm việc mình hứng thú thì rất dai sức, nhưng làm việc không hợp thì dễ bực bội, chán nản kéo dài.') });
  var tv3 = (thang || []).slice().sort(function (a, b) { return b.diem - a.diem; }).slice(0, 3).map(function (m) { return 'tháng ' + m.thang; });
  items.push({ ten: 'Mùa của bạn', gt: HT_MUA[dung].split(' (')[0], y: 'Năng lượng dâng cao vào ' + HT_MUA[dung] + '. Năm ' + tv.info.viewYear + ', ba tháng sáng nhất (âm lịch) theo 3 hệ là ' + tv3.join(', ') + '.' });
  // 4. Quý nhân & người cần dè chừng
  var qn = (HT_QUY_NHAN[bt.nhatChuCan] || []).map(function (c) { return CHI[c] + ' (' + CON_GIAP[c] + ')'; });
  var yc = tv.info.yChi, hop = [(yc + 4) % 12, (yc + 8) % 12, PN_LUC_HOP[yc]].map(function (c) { return CHI[c]; });
  var sunNt = CT_CUNG[ct.by.sun.cung].nt, cungHop = CT_CUNG.filter(function (c, i) { return i !== ct.by.sun.cung && (c.nt === sunNt || ({ 'Lửa': 'Khí', 'Khí': 'Lửa', 'Đất': 'Nước', 'Nước': 'Đất' })[sunNt] === c.nt); }).map(function (c) { return c.ten; }).slice(0, 4);
  items.push({ ten: 'Quý nhân của bạn', gt: qn.join(', '), y: 'Thiên Ất quý nhân (Bát Tự): người tuổi ' + qn.join(' hoặc ') + '. Hợp tác làm ăn: tuổi ' + hop.join(', ') + ' (tam hợp – lục hợp). Theo chiêm tinh, người cung ' + cungHop.join(', ') + ' dễ đồng điệu với bạn; theo thần số, người có số chủ đạo cùng nhóm ' + pnNhomSo_(ts.duongDoi).join('-') + '.' });
  var xung = CHI[(yc + 6) % 12], hai = CHI[PN_HAI[yc]], vuong = [CT_CUNG[(ct.by.sun.cung + 3) % 12].ten, CT_CUNG[(ct.by.sun.cung + 9) % 12].ten];
  items.push({ ten: 'Người cần giữ khoảng cách hợp lý', gt: 'Tuổi ' + xung, y: 'Tuổi ' + xung + ' (lục xung) và ' + hai + ' (lục hại) dễ bất đồng quan điểm; cung ' + vuong.join(', ') + ' tạo góc vuông với Mặt Trời của bạn. Mặt tốt: những người này hay chỉ ra điểm bạn chưa thấy, làm cùng họ bạn buộc phải chặt chẽ hơn. Mặt xấu: dễ cãi nhau vì khác cách làm, chung tiền hay chung nhà dễ căng và mất lòng. Gợi ý: thỏa thuận rõ bằng giấy trước khi làm chung.' });
  // 5. Âm – dương
  var duong = 0, tong = 0;
  bt.pillars.forEach(function (p) { tong += 2; if (p.can % 2 === 0) duong++; if (p.chi % 2 === 0) duong++; });
  if (hl) hl.tien.hao.forEach(function (h) { tong++; duong += h; });
  tong += 2; duong += (ct.nguyenTo['Lửa'] + ct.nguyenTo['Khí']) / (ct.nguyenTo['Lửa'] + ct.nguyenTo['Khí'] + ct.nguyenTo['Đất'] + ct.nguyenTo['Nước']) * 2;
  tong += 1; duong += ts.duongDoi % 2;
  var pd = Math.round(duong / tong * 100);
  items.push({ ten: 'Cán cân Âm – Dương', gt: pd + '% dương', y: (pd >= 58 ? 'Thiên về dương. Mặt tốt: chủ động, hướng ngoại, dám dẫn dắt. Mặt xấu: nóng vội, nói nhiều hơn nghe, dễ lấn át người khác và hay bỏ dở khi hết hứng.' : pd <= 42 ? 'Thiên về âm. Mặt tốt: sâu sắc, trực giác tốt, bền bỉ âm thầm. Mặt xấu: ngại lên tiếng, hay để bụng, dễ bị người khác giành phần và chậm ra quyết định.' : 'Âm dương khá cân bằng. Mặt tốt: biết tiến biết lui, dễ thích nghi. Mặt xấu: không có thế mạnh nào thật nổi trội, có lúc lưỡng lự giữa hai hướng.') + ' (Tính từ can chi Bát Tự, hào quẻ Hà Lạc, nguyên tố chiêm tinh và số chủ đạo.)' });
  // 6. Biểu tượng linh hồn
  items.push({ ten: 'Biểu tượng linh hồn', gt: CON_GIAP[tv.info.yChi] + ' × ' + ct.by.sun.cungTen + (hl ? ' × ' + hl.tien.ten : ''), y: 'Con ' + CON_GIAP[tv.info.yChi] + ' mang mệnh ' + tv.info.banMenh.ten + ', dưới cung ' + ct.by.sun.cungTen + ' (' + CT_CUNG[ct.by.sun.cung].tuKhoa + ')' + (hl ? ', đứng trong quẻ ' + hl.tien.ten + ' – ' + hl.tien.y.toLowerCase() : '') + '. Một hình ảnh để bạn nhớ mình là ai.' });
  // 7. Năm vàng của đời
  var vang = [];
  ['taiLoc', 'quanLoc'].forEach(function (k) { var cd = hoiTu.chuDe.filter(function (x) { return x.k === k; })[0]; if (cd && cd.dinh.length) vang.push(cd.dinh.slice().sort(function (a, b) { return b.soHe - a.soHe || (b.diem || 0) - (a.diem || 0) || a.nam - b.nam; })[0]); });
  vang.sort(function (a, b) { return a.nam - b.nam; });
  if (vang.length) items.push({ ten: 'Năm vàng phía trước', gt: vang.map(function (x) { return x.nam; }).join(' · '), y: vang.map(function (x) { return x.nam + ' (' + x.tuoi + ' tuổi): ' + x.soHe + ' hệ cùng báo – ' + x.he.join(', '); }).join('; ') + '. Năm thuận cũng là năm dễ chủ quan, tiêu và hứa quá tay; nên chuẩn bị trước 1–2 năm.' });
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
    ung: { quanLoc: 1, quyNhan: 0.4 }, nghich: { thiPhi: 0.5, tinhThan: 0.3 }, manh: { 'Tử Vi': 1.2, 'Bát Tự': 1.2 }, N: 4, tuoi: [20, 65],
    khuyen: 'Chủ động nhận việc khó, ghi lại kết quả cụ thể và nói rõ mong muốn với người có quyền quyết định.' },
  { k: 'doiViec', kc: 'nghiep', loai: 'dong', ten: 'Đổi việc, chuyển nơi làm hoặc đổi hướng nghề', ngan: 'thay đổi công việc', nguoc: 'mọi thứ giữ nguyên',
    ung: { buocNgoat: 1, quanLoc: 0.3, diXa: 0.3 }, nghich: {}, manh: { 'Chiêm tinh': 1.2, 'Bát Tự': 1.1 }, N: 5, tuoi: [18, 65],
    khuyen: 'Nếu muốn đổi, chuẩn bị trước hồ sơ và khoản dự phòng 3–6 tháng; nếu muốn ở lại, đây là lúc nói chuyện lại về vai trò.' },
  { k: 'apLucViec', kc: 'nghiep', loai: 'xau', ten: 'Áp lực, cạnh tranh hoặc va chạm nơi làm việc', ngan: 'áp lực công việc', nguoc: 'được nâng đỡ',
    ung: { thiPhi: 0.8, tinhThan: 0.4, quanLoc: 0.2 }, nghich: { quyNhan: 0.5 }, manh: { 'Bát Tự': 1.2, 'Tử Vi': 1.1 }, N: 10, tuoi: [18, 68],
    khuyen: 'Giữ mọi thỏa thuận bằng văn bản, tránh tranh luận lúc nóng, chọn một người đáng tin để trao đổi trước khi phản ứng.' },
  { k: 'thuNhap', kc: 'tien', loai: 'tot', ten: 'Thu nhập tăng rõ rệt hoặc có khoản tiền lớn', ngan: 'thu nhập tăng', nguoc: 'tài chính cần giữ chặt',
    ung: { taiLoc: 1 }, nghich: { taiChinh: 0.7 }, manh: { 'Bát Tự': 1.3, 'Tử Vi': 1.1 }, N: 6, tuoi: [18, 80],
    khuyen: 'Đặt trước tỷ lệ tiết kiệm cho mọi khoản thu thêm; đừng để thu nhập tăng kéo chi tiêu tăng theo.' },
  { k: 'haoTai', kc: 'tien', loai: 'xau', ten: 'Hao tiền: dễ có khoản chi lớn ngoài dự kiến, dễ phải vay mượn', ngan: 'hao tiền', nguoc: 'tiền vào thuận',
    ung: { taiChinh: 1 }, nghich: { taiLoc: 0.6 }, manh: { 'Bát Tự': 1.2, 'Tử Vi': 1.2 }, N: 6, tuoi: [18, 90],
    khuyen: 'Không cho vay hay đứng tên bảo lãnh lớn; giữ quỹ dự phòng; mọi khoản đầu tư mới nên thử nhỏ trước.' },
  { k: 'taiSan', kc: 'tien', loai: 'dong', ten: 'Mua bán nhà đất, xe hoặc tài sản lớn', ngan: 'giao dịch tài sản lớn', nguoc: 'chưa thuận để mua bán',
    ung: { nhaDat: 1, taiLoc: 0.4 }, nghich: { taiChinh: 0.4 }, manh: { 'Tử Vi': 1.2, 'Bát Tự': 1.1 }, N: 3, tuoi: [22, 75],
    khuyen: 'Kiểm tra kỹ giấy tờ pháp lý, đọc hợp đồng với người có chuyên môn; chỉ quyết định khi đã tính kỹ sức tài chính của mình.' },
  { k: 'quenMoi', kc: 'tinh', loai: 'tot', ten: 'Có mối quan hệ tình cảm mới hoặc tình cảm hiện tại thăng hoa', ngan: 'tình cảm khởi sắc', nguoc: 'tình cảm cần hâm nóng',
    ung: { ketHon: 1 }, nghich: { giaDao: 0.4 }, manh: { 'Chiêm tinh': 1.3, 'Tử Vi': 1.1 }, N: 4, tuoi: [16, 50],
    khuyen: 'Mở lòng với các mối quan hệ qua bạn bè, công việc; nếu đã có đôi, dành thời gian riêng cho hai người.' },
  { k: 'cuoiHoi', kc: 'tinh', loai: 'tot', ten: 'Cưới hỏi (hoặc hỷ sự lớn trong gia đình nếu đã lập gia đình)', ngan: 'cưới hỏi', nguoc: 'chuyện lứa đôi cần thêm thời gian',
    ung: { ketHon: 1.2 }, nghich: { giaDao: 0.5 }, manh: { 'Tử Vi': 1.2, 'Bát Tự': 1.2 }, N: 1.2, tuoi: [18, 45],
    khuyen: 'Nếu đã có ý định, đây là năm nên bàn chuyện tương lai rõ ràng với người kia và gia đình hai bên.' },
  { k: 'batHoa', kc: 'tinh', loai: 'xau', ten: 'Tình cảm vợ chồng – người yêu dễ bất hòa, cãi vã, lạnh nhạt', ngan: 'bất hòa trong tình cảm', nguoc: 'tình cảm êm ấm',
    ung: { giaDao: 0.8, thiPhi: 0.3 }, nghich: { ketHon: 0.5 }, manh: { 'Tử Vi': 1.2, 'Chiêm tinh': 1.1 }, N: 5, tuoi: [18, 80],
    khuyen: 'Nói ra điều mình cần thay vì chờ người kia tự hiểu; tránh quyết định lớn về quan hệ khi đang giận.' },
  { k: 'conCai', kc: 'con', loai: 'tot', ten: 'Tin vui con cái (mang thai, sinh nở) hoặc niềm vui lớn từ con', ngan: 'tin vui con cái', nguoc: 'cần dành thêm thời gian cho con',
    ung: { sinhCon: 1 }, nghich: {}, manh: { 'Tử Vi': 1.2, 'Bát Tự': 1.1 }, N: 2, tuoi: [20, 44],
    khuyen: 'Nếu đang mong con, chăm sức khỏe cả hai vợ chồng từ đầu năm; nếu đã có con, dành thời gian đồng hành cùng con.' },
  { k: 'omDau', kc: 'khoe', loai: 'xau', ten: 'Sức khỏe yếu hơn thường: dễ mệt, ốm vặt, bệnh cũ trở lại', ngan: 'sức khỏe yếu', nguoc: 'sức khỏe vững',
    ung: { sucKhoe: 1, tinhThan: 0.3 }, nghich: {}, manh: { 'Bát Tự': 1.3, 'Tử Vi': 1.1 }, N: 12, tuoi: [1, 90],
    khuyen: 'Khám sức khỏe định kỳ đầu năm, ngủ đủ, giữ nếp sinh hoạt điều độ; có gì bất thường thì hỏi ý kiến bác sĩ sớm.' },
  { k: 'taiNan', kc: 'khoe', loai: 'xau', ten: 'Dễ va quệt, chấn thương khi đi lại, vận động', ngan: 'va quệt khi đi lại', nguoc: 'đi lại bình an',
    ung: { sucKhoe: 0.6, diXa: 0.3, thiPhi: 0.2 }, nghich: {}, manh: { 'Tử Vi': 1.2, 'Chiêm tinh': 1.2 }, N: 4, tuoi: [5, 90],
    khuyen: 'Cẩn thận khi lái xe, leo cao, dùng máy móc; mua bảo hiểm phù hợp; không đi đường xa khi mệt.' },
  { k: 'tinhThan', kc: 'khoe', loai: 'xau', ten: 'Áp lực tinh thần, lo âu, mất ngủ', ngan: 'căng thẳng tinh thần', nguoc: 'tinh thần thoải mái',
    ung: { tinhThan: 1, sucKhoe: 0.2 }, nghich: { quyNhan: 0.3 }, manh: { 'Chiêm tinh': 1.3, 'Thần số học': 1.2 }, N: 10, tuoi: [12, 90],
    khuyen: 'Giữ một thói quen giúp đầu óc nghỉ (đi bộ, thiền, viết), chia sẻ với người thân, đừng ôm việc một mình.' },
  { k: 'nguoiThan', kc: 'nha', loai: 'xau', ten: 'Cha mẹ, người thân có việc phải lo (sức khỏe, tiền bạc)', ngan: 'lo cho người thân', nguoc: 'gia đình yên ổn',
    ung: { giaDao: 1 }, nghich: {}, manh: { 'Tử Vi': 1.2, 'Bát Tự': 1.1 }, N: 6, tuoi: [10, 90],
    khuyen: 'Thăm hỏi cha mẹ, người lớn tuổi thường xuyên hơn; nhắc mọi người khám sức khỏe.' },
  { k: 'nhaCua', kc: 'nha', loai: 'dong', ten: 'Sửa nhà, chuyển nhà hoặc thay đổi chỗ ở', ngan: 'thay đổi chỗ ở', nguoc: 'chỗ ở ổn định',
    ung: { nhaDat: 0.8, buocNgoat: 0.5, diXa: 0.3 }, nghich: {}, manh: { 'Tử Vi': 1.1, 'Chiêm tinh': 1.1 }, N: 6, tuoi: [18, 85],
    khuyen: 'Nếu sửa hay chuyển nhà, chọn tháng thuận bên dưới và dự trù ngân sách dư 20%.' },
  { k: 'hocThi', kc: 'hoc', loai: 'tot', ten: 'Học thêm, thi cử, lấy bằng cấp – chứng chỉ', ngan: 'học hành thi cử', nguoc: 'học hành trắc trở',
    ung: { hocHanh: 1 }, nghich: { tinhThan: 0.3 }, manh: { 'Tử Vi': 1.2, 'Chiêm tinh': 1.1 }, N: 5, tuoi: [6, 60],
    khuyen: 'Đăng ký khóa học hay kỳ thi bạn đã định – năm có tín hiệu học hành thì công sức bỏ ra dễ thành kết quả.' },
  { k: 'diXa', kc: 'hoc', loai: 'dong', ten: 'Đi xa: công tác dài, du học, định cư hoặc chuyến đi đáng nhớ', ngan: 'đi xa', nguoc: 'ở yên một chỗ',
    ung: { diXa: 1, buocNgoat: 0.3 }, nghich: {}, manh: { 'Chiêm tinh': 1.3, 'Tử Vi': 1.1 }, N: 6, tuoi: [6, 85],
    khuyen: 'Chuẩn bị giấy tờ (hộ chiếu, visa) sớm; chuyến đi năm nay dễ mở ra cơ hội hoặc mối quan hệ mới.' },
  { k: 'quyNhan', kc: 'quanHe', loai: 'tot', ten: 'Gặp quý nhân giúp đỡ, mở rộng quan hệ có ích', ngan: 'quý nhân giúp đỡ', nguoc: 'cần cẩn trọng trong quan hệ',
    ung: { quyNhan: 1 }, nghich: { thiPhi: 0.5 }, manh: { 'Bát Tự': 1.2, 'Tử Vi': 1.1 }, N: 10, tuoi: [10, 85],
    khuyen: 'Tham gia hội nhóm, sự kiện nghề nghiệp; chủ động nhờ giúp – người phù hợp dễ xuất hiện năm nay.' },
  { k: 'thiPhi', kc: 'quanHe', loai: 'xau', ten: 'Thị phi: dễ vướng tranh cãi, rắc rối giấy tờ, hợp đồng', ngan: 'thị phi, giấy tờ', nguoc: 'được giúp đỡ',
    ung: { thiPhi: 1 }, nghich: { quyNhan: 0.5 }, manh: { 'Tử Vi': 1.2, 'Bát Tự': 1.1 }, N: 5, tuoi: [16, 85],
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
/* manh: hệ "giỏi nhất" về việc này được nhân thêm trọng số – Bát Tự mạnh về tiền bạc, thể chất (ngũ hành); Tử Vi mạnh về việc cụ thể
 * theo cung (hôn nhân, con cái, nhà đất, giấy tờ); Chiêm tinh mạnh về tình cảm, tâm lý, đi xa; Thần số về nhịp tinh thần */
function htE_(n, sk, W) { var e = 0, m = sk.manh || {}; Object.keys(W).forEach(function (h) { e += W[h] * (m[h] || 1) * Math.max(-1.2, Math.min(1.6, htNet_(n, sk, h))); }); return e; }
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
        (S.loai === 'tot' ? 'Cơ hội có thật nhưng kèm trở ngại rõ – có thể được, cũng có thể vấp.' : S.loai === 'xau' ? 'Rủi ro có thật; có yếu tố đỡ nhưng không xóa được rủi ro.' : 'Thay đổi có thể đến nhưng chưa chắc theo cách bạn muốn – cân nhắc kỹ trước khi quyết.') :
      dong === 'Nghiêng về' ? htDs_(tenUng) + ' cùng nghiêng về ' + S.ngan + ', các hệ còn lại không phản đối.' :
      dong === 'Một hệ báo' ? 'Chỉ ' + tenUng[0] + ' báo – tín hiệu riêng lẻ, nên coi là khả năng, chưa phải xu hướng chung.' :
      dong === 'Nghiêng chiều ngược' ? htDs_(nghich) + ' nghiêng về ' + S.nguoc + ' – việc này khó xảy ra hơn mức thường.' :
      'Các hệ không có tín hiệu đáng kể – khả năng ở mức nền theo độ tuổi.';
    var heManh = Object.keys(S.manh || {}).sort(function (a, b) { return S.manh[b] - S.manh[a]; });
    return { k: S.k, kc: S.kc, loai: S.loai, ten: S.ten, ngan: S.ngan, heManh: heManh, p: p, muc: a0 ? htMucP_(p, rel) : '—', rel: rel, E: Math.round(e0 * 10) / 10,
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
      cau: top && top.p < 10 && top.muc !== 'Cao' && top.muc !== 'Rất cao' ? 'Không có việc nổi bật – khía cạnh này khá yên trong năm.' : top ? 'Nổi bật nhất: ' + top.ngan + ' (' + top.dong.toLowerCase() + ').' : '', sk: ds.map(function (x) { return x.k; }) };
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
    soXau > soTot ? soXau + '/5 hệ nghiêng thử thách' + (soTot ? ', ' + soTot + ' hệ nghiêng thuận' : '') + ' – năm nên chắc hơn tiến.' : 'các hệ chia đều thuận – khó, năm có cả cơ hội lẫn trở ngại.'));
  if (noiBat.length) tom.push((qua ? 'Những việc nhiều khả năng đã diễn ra: ' : 'Những việc nhiều khả năng xảy ra: ') + noiBat.slice(0, 3).map(function (x) { return x.ngan + ' (mức ' + x.muc.toLowerCase() + ')'; }).join(', ') + '.');
  if (canGiu && canGiu.p >= 15) tom.push(noiBat.slice(0, 3).indexOf(canGiu) >= 0 ? 'Với ' + canGiu.ngan + ': ' + canGiu.khuyen.charAt(0).toLowerCase() + canGiu.khuyen.slice(1) :
    'Điều nên chủ động phòng: ' + canGiu.ngan + '. ' + canGiu.khuyen);
  if (doiLap.length) tom.push('Các hệ chưa thống nhất ở: ' + doiLap.map(function (x) { return x.ngan; }).join(', ') + ' – xem phần giải thích để biết hệ nào nói gì.');
  if (qua) tom.push('Năm này đã qua: hãy đối chiếu với những gì bạn đã trải qua – càng khớp, các năm tới càng đáng tin.');
  return { nam: vy, tuoi: n0.tuoi, canChi: n0.canChi, soCN: n0.soCN, qua: qua, tom: tom, he: he, khiaCanh: khiaCanh, suKien: sk, kyHanh: ((bt && bt.goiY && bt.goiY.ky) || []).slice(0, 2),
    noiBat: noiBat.map(function (x) { return x.k; }), doiLap: doiLap.map(function (x) { return x.k; }),
    coSo: 'Mỗi sự kiện ghép tín hiệu của 5 hệ có lịch năm (Tử Vi, Bát Tự, Hà Lạc, Chiêm tinh, Thần số học; Human Design không có lịch năm). Mỗi hệ có tín hiệu "ủng hộ" và "ngược chiều" – ví dụ với thu nhập tăng, tín hiệu cần giữ tiền là ngược chiều. ' +
      'Mức khả năng lấy số lần việc đó thường gặp trong đời người (ví dụ đổi việc khoảng 5 lần, cưới khoảng 1 lần) rồi phân bổ cho từng năm theo độ tuổi và sức mạnh tín hiệu: năm càng nhiều hệ cùng báo càng nhận phần lớn. ' +
      '"×2" nghĩa là gấp đôi mức thường của chính bạn ở độ tuổi đó. Đồng thuận = từ 3 hệ cùng báo, không hệ nào ngược; Đối lập = có hệ báo và có hệ ngược chiều. ' +
      'Mỗi hệ có thế mạnh riêng nên với từng việc, hệ giỏi nhất về việc đó được tính nặng hơn (ví dụ Bát Tự với tiền bạc và sức khỏe, Tử Vi với hôn nhân – con cái – nhà đất, Chiêm tinh với tình cảm – tâm lý – đi xa). ' +
      'Ranh giới "năm" của mỗi hệ cũng khác nhau: Tử Vi và Hà Lạc đổi năm từ Tết âm lịch, Bát Tự từ tiết Lập Xuân (khoảng 4/2), Chiêm tinh và Thần số theo năm dương lịch – các việc rơi vào tháng Giêng, tháng Hai dương lịch có thể được hệ này tính cho năm trước, hệ kia tính cho năm sau. ' +
      'Đây là mô hình tham khảo minh bạch, chưa được hiệu chỉnh bằng thống kê thực tế – hãy dùng các năm đã qua để tự kiểm chứng.' };
}

/* ======================================================================================================
 * HỒ SƠ NĂM THEO 4 CHỦ ĐỀ (16/11/2026 – chủ dự án chốt bán lẻ 9/19 xu): mỗi chủ đề là một phần 9 xu (`nam_cd:<cd>:<năm>`).
 * Gom 8 khía cạnh của Hồ sơ năm thành 4 chủ đề; phần "bức tranh chung" (nam) chỉ thấy 1 dòng tóm tắt của mỗi chủ đề.
 * Văn ở đây ghép tự động từ tín hiệu sẵn có (sự kiện, tháng hợp, hệ đồng thuận, lời khuyên) – content-creator sẽ viết dày thêm.
 * Chủ đề Sức khỏe & nhịp sống chỉ nói nhịp nghỉ ngơi, áp lực, chăm sóc bản thân – không chẩn đoán bệnh (quyết định 24/10).
 * ====================================================================================================== */
var HSN_CD = [
  { k: 'cv', ten: 'Công việc & sự nghiệp', icon: '▲', kc: ['nghiep', 'hoc', 'quanHe'], linhVuc: 'công việc' },
  { k: 'tien', ten: 'Tiền bạc', icon: '◈', kc: ['tien'], linhVuc: 'tiền bạc' },
  { k: 'tc', ten: 'Tình cảm & gia đình', icon: '❤', kc: ['tinh', 'con', 'nha'], linhVuc: 'tình cảm và gia đình' },
  { k: 'sk', ten: 'Sức khỏe & nhịp sống', icon: '✚', kc: ['khoe'], linhVuc: 'sức khỏe và nhịp sống' }
];
/* ---------- KHO VĂN 4 CHỦ ĐỀ NĂM (content-creator 16/11/2026) ----------
 * Mỗi chủ đề 5 phần: diễn biến cả năm · tháng thuận · tháng cần để ý · góc nhìn ≥ 3 hệ · 3 việc nên làm.
 * Câu ghép theo tín hiệu: mức của chủ đề (tot/vua/xau/hai/dong) × việc nổi bật × tháng × thế đứng từng hệ.
 * Không tên sao, không %, không chẩn đoán bệnh; tầng 1 mở bằng "Bạn có xu hướng…"; câu khó luôn kèm cách làm. */
/** Việc nổi bật: [khi tín hiệu rõ, khi tín hiệu vừa] */
var HSN_CD_SK_VAN = {
  thangTien: ['Công sức bạn bỏ ra thời gian qua có xu hướng được nhìn thấy rõ hơn: dễ được giao việc lớn hoặc được ghi nhận bằng kết quả cụ thể. Cái giá: việc nhiều lên, kỳ vọng cao hơn, dễ bị soi và bị ganh tị.',
    'Có vài cơ hội nhỏ để thể hiện năng lực – một dự án, một vai trò mới; nhưng cơ hội không rõ ràng, làm nửa vời thì dễ trôi qua mà không đổi được gì.'],
  doiViec: ['Bạn có xu hướng muốn làm mới con đường của mình: đổi chỗ làm, đổi vị trí hoặc rẽ sang hướng gần với điều mình thích. Mặt trái: đổi vội dễ hụt thu nhập vài tháng, mất thâm niên hoặc vào chỗ không hơn chỗ cũ.',
    'Ý muốn thay đổi công việc có thể nhen lên nhưng chưa chín; quyết khi đang chán dễ bỏ chỗ tốt để lấy chỗ chưa chắc.'],
  apLucViec: ['Nhịp làm việc có xu hướng căng hơn: việc dồn, cạnh tranh hoặc khác ý với người cùng làm, có thể mất điểm với cấp trên hay mất một mối quan hệ nơi làm. Mặt được: qua giai đoạn này bạn biết rõ ai đáng tin và mình chịu được đến đâu.',
    'Đôi lúc công việc đòi hỏi nhiều hơn thường lệ hoặc có va chạm nhỏ; dồn lâu dễ thành mệt mỏi và cáu gắt mang về nhà.'],
  hocThi: ['Đây là lúc thuận để học thêm, thi một chứng chỉ hoặc nâng một kỹ năng – công sức bỏ vào học hành dễ thành kết quả. Cái giá: tốn thời gian, tiền học, phải bớt việc khác và bớt thời gian cho gia đình.',
    'Một khóa học ngắn hay một kỹ năng mới có ích trong năm này; học dàn trải, bỏ giữa chừng thì tốn tiền mà không được gì.'],
  diXa: ['Năm có nhiều chuyển động: công tác xa, chuyến đi dài hoặc làm việc với người ở nơi khác dễ mở ra mối quen, việc mới. Mặt trái: tốn kém, mệt vì đi lại, việc nhà và người thân dễ bị bỏ bê.',
    'Những chuyến đi, kể cả ngắn, có thể mang lại một mối quen hay một ý tưởng; đi nhiều mà không tính trước thì hao tiền, hao sức.'],
  quyNhan: ['Bạn có xu hướng gặp người sẵn lòng giúp: một người đi trước, một đồng nghiệp hiểu việc hoặc một mối quen mở đúng cánh cửa. Mặt trái: dễ dựa dẫm, mắc nợ ân tình, và không phải ai tỏ ra giúp cũng giúp thật.',
    'Các mối quan hệ nghề nghiệp có ích hơn thường lệ nếu bạn chủ động; ngồi chờ thì cơ hội này dễ qua tay người khác.'],
  thiPhi: ['Lời nói và văn bản năm nay dễ thành chuyện: một câu nói vội hay một điều khoản chưa đọc kỹ có thể dẫn tới tranh cãi, mất tiền hoặc rắc rối giấy tờ kéo dài. Mặt được: va vấp này buộc bạn làm việc rõ ràng, chặt chẽ hơn.',
    'Thỉnh thoảng có hiểu lầm trong trao đổi, dễ bị nói sau lưng hoặc bị hiểu sai ý. Gợi ý: ghi lại các thỏa thuận quan trọng bằng văn bản.'],
  thuNhap: ['Dòng tiền có xu hướng rộng hơn: thu nhập tăng, có khoản thưởng hoặc một nguồn thu mới đến từ năng lực của bạn. Mặt trái: có tiền dễ tiêu rộng tay, người quanh mình nhờ vả nhiều hơn, cuối năm chưa chắc dư hơn năm trước.',
    'Có cơ hội tăng thêm thu nhập, thường đi kèm nhận thêm việc – tiền thêm phải đổi bằng thời gian và sức.'],
  haoTai: ['Tiền ra có xu hướng nhanh hơn tiền vào ở vài thời điểm: khoản chi bất ngờ, việc nhà hay lời nhờ vả về tiền dễ xuất hiện, có thể phải rút tiền tích lũy hoặc đi vay. Mặt được: giai đoạn này cho bạn thấy rõ chỗ hở trong cách giữ tiền.',
    'Có thể có vài khoản chi ngoài dự kiến; không có khoản dự phòng thì dễ phải vay mượn hoặc cắt bớt việc đã định.'],
  taiSan: ['Năm có không khí của những quyết định về tài sản lớn – nhà, xe hay một khoản tích lũy dài hạn. Mặt tốt: có thể có được thứ mong lâu. Mặt xấu: quyết nhanh dễ mua đắt, vướng giấy tờ hoặc gánh nợ quá sức.',
    'Ý định mua sắm món lớn có thể xuất hiện; quyết vội dễ mua theo cảm xúc rồi tiếc hoặc kẹt tiền.'],
  quenMoi: ['Chuyện tình cảm có xu hướng ấm lên: người đang một mình dễ gặp người khiến mình chú ý, người đã có đôi dễ tìm lại sự gần gũi. Mặt trái: cảm xúc lên nhanh dễ chọn vội, hoặc có người thứ ba chen vào mối quan hệ đang có.',
    'Có những khoảnh khắc khiến lòng mềm lại – một cuộc gặp, một buổi trò chuyện sâu; nhưng cảm xúc này dễ đến rồi đi, chưa chắc thành chuyện lâu dài.'],
  cuoiHoi: ['Không khí trong năm thuận cho những bàn bạc nghiêm túc về tương lai hai người, hoặc một dịp vui lớn trong nhà. Cái giá: tốn kém, dễ bất đồng với gia đình hai bên về lễ nghi, tiền bạc, chỗ ở.',
    'Nếu đã có dự định chung, năm nay có thể nói chuyện rõ hơn; nhưng một bên chưa sẵn sàng thì dễ thành giằng co, kéo dài.'],
  batHoa: ['Người thân thiết nhất có xu hướng cần bạn lắng nghe nhiều hơn; khác ý dễ thành cãi vã, chiến tranh lạnh, có lúc nghĩ đến chuyện chia tay. Mặt được: nói thật được với nhau thì hai người hiểu nhau hơn trước.',
    'Đôi lúc hai người hiểu lệch ý nhau; để lâu không nói thì chuyện nhỏ dễ thành khoảng cách.'],
  conCai: ['Chuyện con cái mang lại niềm vui: có thể là một tin vui đang mong, hoặc những bước tiến của con khiến bạn tự hào. Cái giá: tốn sức, tốn tiền, ít thời gian cho bản thân và cho người bạn đời.',
    'Thời gian dành cho con hoặc người nhỏ tuổi trong nhà đem lại niềm vui; nhưng con cũng dễ đòi hỏi nhiều hơn, có lúc làm bạn mệt và căng.'],
  nguoiThan: ['Gia đình có xu hướng cần bạn nhiều hơn: cha mẹ, người lớn tuổi hay anh chị em có việc phải lo, có thể là sức khỏe hay tiền bạc. Cái giá: tốn thời gian, tiền và dễ căng với người nhà vì chuyện chia phần trách nhiệm.',
    'Vài việc nhà cần bạn để tâm; lơ đi thì dễ bị trách là vô tâm, chuyện nhỏ thành chuyện lớn.'],
  nhaCua: ['Chuyện chỗ ở dễ chuyển động: sửa sang, sắp xếp lại hoặc dọn đến nơi mới. Mặt tốt: không gian hợp hơn với giai đoạn này. Mặt xấu: tốn kém hơn dự tính, mệt và xáo trộn nếp nhà một thời gian.',
    'Có thể bạn muốn làm mới không gian sống; sửa nhỏ cũng dễ phát sinh chi phí và việc vặt hơn bạn nghĩ.'],
  omDau: ['Cơ thể có xu hướng yếu hơn thường: dễ mệt, ốm vặt hoặc bệnh cũ trở lại khi làm quá sức, ngủ không đủ. Để kéo dài thì sức khỏe dễ kéo theo công việc và tiền bạc.',
    'Vài giai đoạn bạn sẽ thấy hụt năng lượng hơn thường lệ; cố làm tiếp lúc đó dễ sinh ốm và năng suất giảm.'],
  taiNan: ['Khi đi lại, vận động hay làm việc tay chân, bạn dễ gặp va quệt, trầy xước hoặc chấn thương nhỏ hơn thường – nhất là lúc vội và lúc mệt.',
    'Bất cẩn khi đi đường xa hay lúc đang mệt dễ dẫn tới va chạm, hỏng đồ hoặc chấn thương nhẹ.'],
  tinhThan: ['Đầu óc có xu hướng nhiều suy nghĩ: lo toan chồng lên nhau, dễ mất ngủ, cáu gắt hoặc buồn kéo dài, nhất là khi bạn ôm việc một mình. Gợi ý: có một người để chia sẻ.',
    'Có lúc bạn thấy nặng đầu, khó tập trung hơn thường; dồn lâu dễ thành mất ngủ và dễ nổi nóng với người nhà.']
};
/** Kho văn từng chủ đề. mo: câu mở theo mức (tầng 1); yen: khi không có việc nào nổi bật; thuan / chuY: việc hợp làm trong tháng thuận / cần để ý;
 *  khuyen: việc nên làm bổ sung theo mức; ket: câu kết nhẹ nhàng theo mức (tầng 2) */
var HSN_CD_VAN = {
  cv: {
    mo: {
      tot: ['Bạn có xu hướng bước vào năm {y} với nhiều đà cho công việc: những gì bạn làm dễ được nhìn thấy, người xung quanh sẵn lòng trao thêm việc. Mặt trái: việc nhiều lên, dễ ôm đồm và bị so sánh.',
        'Bạn có xu hướng thấy công việc năm {y} trôi chảy hơn những năm gần đây – hợp để tiến thêm một bậc; nhưng chủ quan thì dễ hứa quá sức mình.'],
      vua: ['Bạn có xu hướng đi qua năm {y} với nhịp công việc khá đều: không có cú rẽ lớn, hợp để làm sâu những gì đang có. Mặt trái: dễ giậm chân, thu nhập và vị trí khó nhích lên.',
        'Bạn có xu hướng cần một năm {y} "chạy bền" hơn "chạy nước rút": công việc ổn nhưng chậm, dễ thấy chán vì không có gì mới.'],
      xau: ['Bạn có xu hướng thấy công việc năm {y} khó hơn: nhiều việc, nhiều ý kiến trái chiều, dễ va chạm với cấp trên hoặc đồng nghiệp và có lúc mất điểm vì một sai sót. Mặt được: qua năm này tay nghề vững hơn, biết rõ ai đáng tin.',
        'Bạn có xu hướng gánh nhiều trách nhiệm trong năm {y}; áp lực có thật, dễ quá tải, làm nhiều mà chưa chắc được ghi nhận tương xứng.'],
      hai: ['Bạn có xu hướng gặp cả cơ hội lẫn trở ngại trong công việc năm {y}: có việc mở ra, nhưng cũng có chỗ dễ vấp – chọn sai lúc thì phần khó lấn phần thuận.',
        'Bạn có xu hướng thấy công việc năm {y} như một con dốc có gió thuận: lên được, nhưng mệt, và trượt chân là mất nhiều công.'],
      dong: ['Bạn có xu hướng đứng trước những ngã rẽ trong công việc năm {y}: có cánh cửa mới, nhưng bước vội dễ mất chỗ đang có mà chỗ mới chưa chắc hơn.',
        'Bạn có xu hướng muốn làm mới con đường nghề nghiệp trong năm {y}; thay đổi dễ kéo theo hụt thu nhập và xáo trộn vài tháng đầu.']
    },
    yen: 'Không có việc nào trong công việc nổi lên rõ: ít biến động, nhưng cũng ít cơ hội mới tự tìm đến.',
    thuan: ['nộp hồ sơ, đề xuất ý tưởng hoặc xin một buổi nói chuyện về vai trò của mình', 'khởi động dự án mới hay nhận thêm trách nhiệm', 'gặp gỡ, kết nối với người trong nghề',
      'hoàn tất khóa học, chứng chỉ hoặc bài thi đang dở', 'chốt các thỏa thuận đã bàn kỹ', 'trình bày kết quả và nói rõ mong muốn của mình'],
    chuY: ['tránh quyết định nghỉ việc hay đổi hướng khi đang bực', 'đọc kỹ mọi văn bản trước khi ký', 'giữ lời nói mềm trong các cuộc họp căng', 'đừng nhận thêm việc vượt sức'],
    khuyen: {
      tot: ['Viết ra một mục tiêu công việc rõ ràng cho năm {y} và chia nhỏ theo từng quý.', 'Chủ động nói với người có quyền quyết định về việc bạn muốn làm tiếp theo.'],
      vua: ['Chọn một kỹ năng gắn với việc đang làm và dành mỗi tuần vài giờ để học.', 'Ghi lại kết quả công việc mỗi tháng – cuối năm, đó là căn cứ để bạn đề xuất điều mình xứng đáng.'],
      xau: ['Mỗi tuần dành 15 phút tổng kết: việc gì đã xong, việc gì cần nhờ người khác hỗ trợ.', 'Giữ các thỏa thuận quan trọng bằng tin nhắn hoặc email để tránh hiểu lầm.'],
      dong: ['Trước khi đổi hướng, trò chuyện với một người đã đi con đường đó để hiểu thật.', 'Chuẩn bị một khoản dự phòng trước mọi quyết định thay đổi lớn.']
    },
    ket: { tot: 'Năm thuận không tự mang kết quả đến; không bước thì phần thuận trôi qua mà không để lại gì.', vua: 'Năm đều tay là năm xây nền; cái giá là kết quả đến chậm, dễ nản giữa chừng.',
      xau: 'Năm này phần khó nhiều hơn phần thuận: dễ quá tải, va chạm và mệt. Gợi ý: chia việc nhỏ, nhờ người đúng lúc.', dong: 'Thay đổi nào cũng có giai đoạn chông chênh về tiền và tinh thần. Gợi ý: chuẩn bị kỹ rồi đi từng bước.' }
  },
  tien: {
    mo: {
      tot: ['Bạn có xu hướng thấy dòng tiền năm {y} rộng rãi hơn: tiền vào đều hơn, có thêm khoản thu từ năng lực của mình. Mặt trái: tiêu cũng dễ rộng tay theo, nhất là cho thể diện và người nhờ vả.',
        'Bạn có xu hướng gặp một năm {y} thuận cho tiền bạc – không phải "trúng lớn", mà là công sức được trả xứng hơn; nhưng tiền thêm thường đi kèm việc thêm.'],
      vua: ['Bạn có xu hướng giữ tiền bạc năm {y} ở mức ổn định: không biến động lớn, hợp để tích lũy đều. Mặt trái: thu nhập khó tăng, muốn bứt lên phải tự tạo thêm nguồn.',
        'Bạn có xu hướng trải qua năm {y} với chuyện tiền nong khá êm; nhưng êm dễ sinh lơ là, chi lặt vặt cộng lại không nhỏ.'],
      xau: ['Bạn có xu hướng gặp vài khoản chi ngoài dự kiến trong năm {y}; tiền ra dễ nhanh hơn tiền vào, có thể phải rút tiền tích lũy, vay mượn hoặc mất tiền vì cho vay, đầu tư sai. Mặt được: năm này cho thấy rõ chỗ hở trong cách giữ tiền.',
        'Bạn có xu hướng hụt tiền hơn trong năm {y}: chi nhỏ cộng lại thành lớn, lời nhờ vả về tiền dễ xuất hiện và khó từ chối.'],
      hai: ['Bạn có xu hướng thấy tiền bạc năm {y} vừa có cửa vào mới vừa có khoản phải chi: thu tăng nhưng chi tăng theo, cuối năm chưa chắc dư.',
        'Bạn có xu hướng có một năm {y} "vào nhiều ra nhiều"; thiếu kỷ luật chi tiêu thì tiền qua tay nhiều mà giữ lại chẳng bao nhiêu.'],
      dong: ['Bạn có xu hướng đứng trước những quyết định lớn về tài sản trong năm {y}: mua, bán, đổi hay dồn khoản tích lũy. Đúng lúc thì được tài sản tốt; vội thì dễ mua đắt, bán rẻ hoặc gánh nợ.',
        'Bạn có xu hướng muốn đổi cách dùng tiền trong năm {y}; đổi mà chưa tính kỹ dễ mất phí, mất cả tiền gốc.']
    },
    yen: 'Không có khoản nào nổi lên rõ: tiền bạc không biến động lớn, nhưng cũng không có cửa thu mới tự đến.',
    thuan: ['đặt lại kế hoạch chi tiêu và mở thêm một khoản tiết kiệm tự động', 'bàn chuyện thu nhập hoặc nhận thêm việc có thù lao rõ ràng', 'chốt các khoản thu còn treo một cách nhẹ nhàng',
      'tìm hiểu kỹ một cách tích lũy an toàn, dễ hiểu', 'mua món lớn đã cân nhắc từ lâu', 'rà lại các khoản phí, gói dịch vụ không còn dùng'],
    chuY: ['hoãn các khoản cho vay hay đứng tên giúp người khác', 'không xuống tiền cho lời mời "làm giàu nhanh"', 'giữ quỹ dự phòng, bớt mua sắm theo cảm xúc', 'kiểm tra kỹ hóa đơn và các khoản tự động trừ'],
    khuyen: {
      tot: ['Tự động chuyển một phần mỗi khoản thu vào tài khoản tiết kiệm ngay khi nhận.', 'Ghi lại chi tiêu ba tháng đầu năm để biết tiền mình thật sự đi đâu.'],
      vua: ['Ghi lại chi tiêu ba tháng đầu năm để biết tiền mình thật sự đi đâu.', 'Đặt một mục tiêu tích lũy nhỏ, vừa sức cho cả năm {y} và theo dõi mỗi tháng.'],
      xau: ['Giữ một quỹ dự phòng riêng, không đụng đến trừ khi thật cần.', 'Trước mỗi khoản chi lớn, chờ hai ngày rồi mới quyết.'],
      dong: ['Mọi giao dịch tài sản lớn đều nên đọc kỹ giấy tờ cùng người có chuyên môn.', 'Tính trước xem mình xoay xở thế nào nếu kế hoạch chậm hơn dự kiến nửa năm.']
    },
    ket: { tot: 'Tiền đến thuận cũng là lúc dễ tiêu thuận; không giữ lại một phần ngay từ đầu thì năm sau dễ hụt.', vua: 'Năm êm hợp để xây thói quen về tiền; mặt trái là không có đột phá, tích lũy lên chậm.',
      xau: 'Năm này tiền dễ hụt hơn bình thường, sai một quyết định có thể mất khoản tích lũy nhiều năm. Gợi ý: biết trước khoản nào bắt buộc chi và giữ quỹ dự phòng.', dong: 'Quyết định về tài sản mà sai thì khó quay lại; chậm còn hơn nhanh mà sai.' }
  },
  tc: {
    mo: {
      tot: ['Bạn có xu hướng thấy chuyện tình cảm và gia đình năm {y} ấm áp hơn: người thân gần nhau hơn. Mặt trái: gần nhau nhiều cũng dễ va chạm vì chuyện nhỏ, và bạn dễ ôm việc nhà quá phần mình.',
        'Bạn có xu hướng nhận được niềm vui từ người thân thiết trong năm {y}; nhưng người thân cũng kỳ vọng ở bạn nhiều hơn.'],
      vua: ['Bạn có xu hướng giữ được nhịp tình cảm, gia đình khá êm trong năm {y}: không có biến động lớn. Mặt trái: êm dễ thành nhạt, hai người ít chuyện để nói với nhau.',
        'Bạn có xu hướng đi qua năm {y} với chuyện nhà bình yên; nhưng lơ là việc nhỏ hằng ngày thì khoảng cách lớn dần lúc nào không hay.'],
      xau: ['Bạn có xu hướng gặp chuyện căng trong nhà năm {y}: có người cần bạn mà bạn chưa đáp được, có chuyện để lâu thành cãi vã, chiến tranh lạnh hoặc tổn thương khó nói. Mặt được: nói rõ được thì quan hệ thật hơn trước.',
        'Bạn có xu hướng gặp vài va chạm trong nhà năm {y}, cùng việc nhà, việc người thân đòi bạn bỏ công, bỏ tiền nhiều hơn thường lệ.'],
      hai: ['Bạn có xu hướng trải qua năm {y} với cả niềm vui lẫn chuyện căng trong tình cảm và gia đình – có lúc ấm, có lúc dễ làm tổn thương nhau vì một câu nói.',
        'Bạn có xu hướng gặp một năm {y} nhiều cảm xúc trong chuyện nhà: có tin vui, cũng có lúc bất đồng, dễ làm nhau buồn.'],
      dong: ['Bạn có xu hướng thấy chuyện nhà, chuyện chỗ ở có chuyển động trong năm {y}: sắp xếp lại, đổi nếp hoặc đổi không gian sống – mới mẻ, nhưng tốn kém và dễ bất đồng giữa các thành viên.',
        'Bạn có xu hướng muốn làm mới đời sống gia đình trong năm {y}; tự quyết mà không bàn thì dễ thành mâu thuẫn trong nhà.']
    },
    yen: 'Không có chuyện nào nổi lên rõ: nhà yên, nhưng sự gắn bó dễ nhạt nếu không ai chủ động quan tâm.',
    thuan: ['hẹn một buổi đi chơi hay bữa tối riêng với người thân thiết nhất', 'về thăm gia đình, gặp người thân lâu ngày chưa gặp', 'mở lòng làm quen qua bạn bè, nhóm sở thích',
      'cùng người thân lên kế hoạch cho một việc chung trong nhà', 'nói ra một điều bạn đã giữ trong lòng lâu nay', 'tổ chức một dịp sum họp nhỏ'],
    chuY: ['nhường nhau một câu khi không khí căng', 'tránh nhắc chuyện cũ lúc đang mệt', 'dành thêm thời gian hỏi han người lớn tuổi trong nhà', 'đừng quyết chuyện lớn của hai người khi đang giận'],
    khuyen: {
      tot: ['Dành một buổi mỗi tuần không điện thoại cho người thân thiết nhất.', 'Nói lời cảm ơn cụ thể với người đã chăm lo cho bạn.'],
      vua: ['Giữ một thói quen nhỏ cho gia đình: bữa cơm chung, cuộc gọi cuối tuần.', 'Hỏi người thân "dạo này có điều gì làm bạn bận lòng không" – rồi lắng nghe đến hết.'],
      xau: ['Khi thấy căng thẳng, hẹn nói chuyện lúc cả hai bình tĩnh thay vì nói ngay.', 'Gọi về hỏi thăm cha mẹ hoặc người lớn trong nhà đều đặn mỗi tuần.'],
      dong: ['Bàn chuyện thay đổi trong nhà với mọi người trước khi quyết.', 'Giữ lại một nếp quen của gia đình (bữa cơm chung, ngày cuối tuần) giữa những thay đổi.']
    },
    ket: { tot: 'Niềm vui trong nhà có thật, nhưng dễ bị coi là đương nhiên; người thân không được ghi nhận lâu dần sẽ thấy thiệt.', vua: 'Bình yên trong nhà có thật, nhưng dễ nhạt nếu chỉ để nó tự trôi.',
      xau: 'Va chạm trong nhà năm này dễ để lại tổn thương lâu hơn bạn nghĩ. Gợi ý: nói chậm, nghe nhiều, không quyết chuyện lớn lúc đang giận.', dong: 'Thay đổi trong nhà dễ làm xáo trộn nếp quen và làm ai đó thấy bị bỏ rơi. Gợi ý: giữ lại một nếp chung giữa những thay đổi.' }
  },
  sk: {
    mo: {
      tot: ['Bạn có xu hướng giữ được nhịp sống khá cân bằng trong năm {y}: năng lượng ổn, đầu óc thông thoáng. Mặt trái: khỏe dễ chủ quan, thức khuya, làm quá rồi trả giá vào năm sau.',
        'Bạn có xu hướng thấy năm {y} dễ thở hơn về thể lực và tinh thần; nhưng nếp xấu cũ không sửa thì vẫn âm thầm bào sức.'],
      vua: ['Bạn có xu hướng đi qua năm {y} với nhịp sống khá đều, không có gì nổi lên rõ; mặt trái là mệt mỏi nhỏ dễ bị bỏ qua cho đến khi thành chuyện.',
        'Bạn có xu hướng ổn định về nhịp sinh hoạt trong năm {y}; nhưng ổn không có nghĩa là khỏe, ăn ngủ thất thường vẫn tích lại.'],
      xau: ['Bạn có xu hướng dễ mệt, dễ ốm hơn thường lệ trong năm {y} nếu ôm nhiều việc: ngủ kém, sức đề kháng giảm, bệnh cũ dễ trở lại. Mặt được: cơ thể báo sớm, còn kịp sửa nếp sống.',
        'Bạn có xu hướng chịu nhiều áp lực hơn trong năm {y}; áp lực kéo dài dễ thành mất ngủ, mệt mỏi kéo dài và cáu gắt.'],
      hai: ['Bạn có xu hướng có những giai đoạn đầy năng lượng xen những giai đoạn đuối sức trong năm {y}; lúc hăng dễ làm quá, rồi trả giá bằng mấy tuần mệt.',
        'Bạn có xu hướng đi qua năm {y} theo nhịp lên xuống: có lúc rất hăng hái, có lúc uể oải, khó giữ đều việc gì.'],
      dong: ['Bạn có xu hướng thay đổi nhịp sống trong năm {y}: giờ giấc, chỗ ở hay cách làm việc đổi khác; cơ thể dễ lệch nhịp, mất ngủ, ăn uống thất thường một thời gian.',
        'Bạn có xu hướng bước vào một nhịp sống mới trong năm {y}; đòi hỏi bản thân như cũ ngay thì dễ đuối sức.']
    },
    yen: 'Không có tín hiệu nào nổi lên rõ: không có gì đáng kể, nhưng sức khỏe vẫn đi theo cách bạn ăn, ngủ, vận động.',
    thuan: ['bắt đầu một thói quen vận động nhẹ và giữ nó đều', 'sắp lại giờ ngủ, tắt màn hình sớm hơn', 'đi một chuyến ngắn để nạp lại năng lượng',
      'thử một cách thư giãn mới: đi bộ, hít thở chậm, viết nhật ký', 'đi kiểm tra sức khỏe định kỳ nếu đã lâu chưa làm', 'nấu ăn ở nhà nhiều hơn, ăn chậm hơn'],
    chuY: ['bớt thức khuya và cắt bớt lịch hẹn', 'chậm lại khi lái xe, đi đường xa', 'cho mình một ngày nghỉ thật sự mỗi tuần', 'để ý tín hiệu mệt của cơ thể và nghỉ sớm'],
    khuyen: {
      tot: ['Tận dụng năm dễ thở để xây một thói quen vận động bạn thật sự thích.', 'Giữ giờ ngủ ổn định, kể cả cuối tuần.'],
      vua: ['Giữ giờ ngủ ổn định, kể cả cuối tuần.', 'Mỗi ngày có ít nhất 20 phút đi bộ hoặc vận động nhẹ.'],
      xau: ['Đặt "giờ tắt máy" mỗi tối để đầu óc được nghỉ trước khi ngủ.', 'Mỗi tuần giữ ít nhất một khoảng trống không lịch hẹn để nạp lại năng lượng.'],
      dong: ['Khi nhịp sống thay đổi, giữ lại ít nhất một thói quen cũ giúp bạn thấy vững.', 'Cho mình vài tuần thích nghi trước khi tăng khối lượng việc.']
    },
    ket: { tot: 'Lúc khỏe là lúc dễ quên chăm mình; nếp xấu trong năm thuận thường lộ ra ở những năm bận hơn.', vua: 'Không có gì to tát, nhưng ngủ thiếu, ăn thất thường kéo dài vẫn bào sức từ từ.',
      xau: 'Năm này cơ thể yếu hơn thường, cố quá dễ ốm và kéo theo việc, tiền. Gợi ý: nghỉ đúng lúc và đi khám khi có dấu hiệu lạ.', dong: 'Thay đổi nào cũng tốn sức; giai đoạn đầu dễ mệt và lệch nhịp hơn bạn nghĩ.' }
  }
};
/** Cách nhìn của từng hệ (đời thường) */
var HSN_CD_LENS = { 'Tử Vi': 'Tử Vi (nhìn vận năm trên lá số)', 'Bát Tự': 'Bát Tự (so khí của năm với ngũ hành gốc của bạn)', 'Hà Lạc': 'Hà Lạc (đọc quẻ của năm)',
  'Chiêm tinh': 'Chiêm tinh (theo chu kỳ các hành tinh lớn)', 'Thần số học': 'Thần số học (theo con số năm cá nhân)' };
/** Năm cá nhân 1–9 (Thần số) – ý nghĩa đời thường theo từng chủ đề */
var HSN_CD_SO = {
  1: { y: 'năm gieo hạt, hợp để bắt đầu điều mới', cv: 'hợp mở hướng mới', tien: 'hợp đặt nền cho nguồn thu mới', tc: 'hợp chủ động bước tới trong các mối quan hệ', sk: 'hợp bắt đầu thói quen mới' },
  2: { y: 'năm của hợp tác và kiên nhẫn', cv: 'hợp làm cùng người khác hơn là đi một mình', tien: 'hợp tích lũy chậm mà chắc', tc: 'hợp lắng nghe, vun đắp', sk: 'hợp sống chậm, nhạy với cảm xúc của mình' },
  3: { y: 'năm của giao tiếp và sáng tạo', cv: 'hợp trình bày ý tưởng, mở rộng quan hệ', tien: 'dễ chi cho niềm vui – nên đặt hạn mức', tc: 'hợp gặp gỡ, sum họp, trò chuyện', sk: 'hợp tìm niềm vui trong vận động' },
  4: { y: 'năm xây nền, làm chắc', cv: 'hợp hoàn thiện quy trình, làm việc bền bỉ', tien: 'hợp lập kế hoạch dài hơi', tc: 'hợp lo cho nền nếp trong nhà', sk: 'hợp giữ giờ giấc đều đặn' },
  5: { y: 'năm của thay đổi và dịch chuyển', cv: 'dễ có cơ hội mới, đi lại nhiều', tien: 'dễ vào ra nhanh – nên giữ kỷ luật', tc: 'hợp làm mới không khí trong nhà', sk: 'dễ xáo trộn giờ giấc – nên giữ một nếp cố định' },
  6: { y: 'năm của gia đình và trách nhiệm', cv: 'hợp chăm lo cho đội nhóm, người cùng làm', tien: 'chi cho gia đình nhiều hơn', tc: 'người thân là trọng tâm', sk: 'hợp chăm mình như chăm người thân' },
  7: { y: 'năm lắng lại, học và nghĩ sâu', cv: 'hợp học thêm, đào sâu chuyên môn', tien: 'hợp giữ hơn là mở rộng', tc: 'cần khoảng riêng nhưng đừng khép lòng', sk: 'cần nhiều thời gian nghỉ, tĩnh lặng' },
  8: { y: 'năm của thành quả và tiền bạc', cv: 'hợp nhận trách nhiệm lớn, đòi hỏi xứng đáng', tien: 'thuận cho thu nhập nếu làm có kế hoạch', tc: 'dễ bận – nhớ chừa thời gian cho người thân', sk: 'dễ làm quá sức – nhớ nghỉ giữa chừng' },
  9: { y: 'năm khép lại một chu kỳ', cv: 'hợp hoàn tất, buông bớt việc không còn hợp', tien: 'hợp dọn dẹp, trả bớt khoản cũ', tc: 'hợp hàn gắn, nói lời cảm ơn và xin lỗi', sk: 'hợp nghỉ ngơi, chuẩn bị sức cho chu kỳ mới' }
};
var HSN_HANH_TANG = { 'Mộc': 'bệnh về gan, mật, mắt và thần kinh (đau đầu, căng cơ)', 'Hỏa': 'bệnh về tim, huyết áp, mạch máu và mất ngủ',
  'Thổ': 'bệnh về dạ dày, tiêu hóa, tì vị', 'Kim': 'bệnh về phổi, đường hô hấp, da và đại tràng', 'Thủy': 'bệnh về thận, bàng quang, đường tiết niệu, xương khớp' };
function htCdMua_(m) { return m <= 3 ? 'đầu năm' : m <= 6 ? 'giữa năm' : m <= 9 ? 'mùa thu' : 'cuối năm'; }
/** Đoạn văn 5 phần của một chủ đề năm (gọi trong htNamCd_). Trả { items, khuyen } – khuyen đủ 3 việc */
function htCdVan_(H, C, ci, o) {
  var V = HSN_CD_VAN[C.k], vy = H.nam, sd = (+vy || 0) + (+H.tuoi || 0) * 7 + ci * 3;
  function chon(a, k) { return a[((sd + (k || 0)) % a.length + a.length) % a.length]; }
  function thay(t) { return String(t).replace(/\{y\}/g, vy); }
  var ds = o.ds, noi = o.noi, TT = o.thangThuan, CY = o.thangChuY;
  var key = o.nhan === 'Thuận' ? 'tot' : o.nhan === 'Cần giữ' ? 'xau' : o.nhan === 'Cơ hội lẫn thử thách' ? 'hai' : o.nhan === 'Có thay đổi' ? 'dong' : 'vua';
  var items = [];
  // 1. Diễn biến cả năm
  var p1 = [thay(chon(V.mo[key]))];
  if (noi.length) {
    noi.slice(0, 2).forEach(function (x, i) { var v = HSN_CD_SK_VAN[x.k]; if (v) p1.push(v[i === 0 && (x.muc === 'Rất cao' || x.muc === 'Cao') ? 0 : 1]); });
    if (noi.some(function (x) { return x.dong === 'Đối lập'; })) p1.push('Ở chuyện này các hệ chưa cùng một ý: có hệ thấy thuận, có hệ thấy trở ngại – kết quả có thể nghiêng về bên nào cũng được.');
  } else p1.push(V.yen);
  items.push(p1.join(' '));
  var dau = TT.filter(function (m) { return m <= 6; }).length, sau = TT.length - dau;
  var nhip = !TT.length ? '' : dau > sau ? 'Nhịp năm nghiêng về nửa đầu (theo âm lịch): phần thuận đến sớm, nên khởi động việc quan trọng ngay từ những tháng đầu.' :
    sau > dau ? 'Nhịp năm nghiêng về nửa sau (theo âm lịch): những tháng đầu là lúc chuẩn bị, phần thuận rõ dần từ giữa năm trở đi.' :
    'Phần thuận rải đều hai nửa năm, nên giữ nhịp đều tay thay vì dồn sức vào một lúc.';
  if (CY.length) { var mua = []; CY.forEach(function (m) { var t = htCdMua_(m); if (mua.indexOf(t) < 0) mua.push(t); }); nhip += (nhip ? ' ' : '') + 'Phần cần giữ nhịp rơi nhiều vào ' + htDs_(mua) + '.'; }
  if (nhip) items.push(nhip);
  // 2. Tháng thuận – mỗi tháng gắn với việc thuận của tháng đó và một việc hợp làm
  var totDs = o.thuanNguon;
  if (TT.length) {
    var cau = TT.map(function (m, i) {
      var vi = totDs.filter(function (x) { return (x.thang || []).indexOf(m) >= 0; }).map(function (x) { return x.ngan; }).slice(0, 2);
      return 'tháng ' + m + (vi.length && C.k !== 'sk' ? ' (thuận cho ' + htDs_(vi) + ')' : '') + ' hợp để ' + chon(V.thuan, m + i);
    });
    items.push((C.k === 'sk' ? 'Những tháng dễ thở hơn (âm lịch): ' : 'Những tháng thuận nhất cho ' + C.linhVuc + ' (âm lịch): ') + cau.join('; ') + '.' +
      (TT.length >= 2 ? ' Nếu có việc quan trọng, hãy xếp vào các tháng này để thuận đà.' : ''));
  } else items.push('Mảng ' + C.linhVuc + ' năm nay không có tháng nào nổi trội hẳn – không có lúc thuận rõ để dựa vào, kết quả chỉ đến từ sự đều tay quanh năm.');
  // 3. Tháng cần để ý
  var xauDs = ds.filter(function (x) { return x.loai === 'xau'; });
  if (CY.length) {
    var cau2 = CY.slice(0, 2).map(function (m, i) {
      var vi = xauDs.filter(function (x) { return (x.thang || []).indexOf(m) >= 0; }).map(function (x) { return x.ngan; }).slice(0, 2);
      return 'tháng ' + m + (vi.length ? ' (nhắc chuyện ' + htDs_(vi) + ')' : '') + ' – ' + chon(V.chuY, m + i);
    });
    items.push('Tháng nên giữ nhịp hơn (âm lịch): ' + cau2.join('; ') + '. Đây là những tháng dễ vấp hơn thường: dễ sai sót, va chạm hoặc phát sinh chi phí. Gợi ý: không chốt việc lớn trong các tháng này.');
  } else {
    var trung = []; xauDs.slice(0, 3).forEach(function (x) { (x.thang || []).forEach(function (m) { if (TT.indexOf(m) >= 0 && trung.indexOf(m) < 0) trung.push(m); }); });
    items.push(trung.length ? 'Tháng ' + htDs_(trung.sort(function (a, b) { return a - b; })) + ' vừa thuận vừa cần để ý: cứ làm việc đã định, nhưng ' + chon(V.chuY, trung[0]) + '.' :
      'Không có tháng nào cần dè chừng riêng cho ' + C.linhVuc + '; trở ngại nếu có thường đến từ lúc bạn quá tải.');
  }
  // 4. Góc nhìn từng hệ (ít nhất 3 hệ)
  var heDs = HSN_HE.map(function (h) {
    var g = ds.filter(function (x) { return x.loai !== 'xau' && x.ung.indexOf(h) >= 0; }), b = ds.filter(function (x) { return x.loai === 'xau' && x.ung.indexOf(h) >= 0; }),
      n = ds.filter(function (x) { return x.nghich.indexOf(h) >= 0; });
    return { h: h, g: g, b: b, n: n, w: g.length + b.length + n.length };
  });
  var chonHe = heDs.filter(function (x) { return x.w > 0; }).sort(function (a, b) { return b.w - a.w; });
  heDs.forEach(function (x) { if (chonHe.length < 3 && chonHe.indexOf(x) < 0) chonHe.push(x); });
  var so = +H.soCN, SO = HSN_CD_SO[so];
  if (SO && !chonHe.some(function (x) { return x.h === 'Thần số học'; })) chonHe.push(heDs[4]);
  function ng(a) { return htDs_(a.slice(0, 2).map(function (x) { return x.ngan; })); }
  var gocNhin = chonHe.map(function (x) {
    var t = HSN_CD_LENS[x.h] + ' ';
    t += x.g.length && x.b.length ? 'thấy cả hai mặt: thuận cho ' + ng(x.g) + ', nhưng cũng nhắc chuyện ' + ng(x.b) + '.' :
      x.g.length ? 'nghiêng về phía thuận: ' + ng(x.g) + '.' :
      x.b.length ? 'nhắc bạn để tâm chuyện ' + ng(x.b) + '.' :
      x.n.length ? (function () {
        var nB = x.n.filter(function (s) { return s.loai === 'xau'; }), nG = x.n.filter(function (s) { return s.loai !== 'xau'; });
        return nB.length ? 'thấy nhẹ bớt chuyện ' + ng(nB) + ' – một tín hiệu đỡ cho bạn' + (nG.length ? ', nhưng chưa thấy rõ ' + ng(nG) : '') + '.' : 'chưa thấy rõ ' + ng(nG) + ' – việc này dễ chậm hoặc chưa thành trong năm nay.';
      })() :
      'không thấy tín hiệu nổi bật cho ' + C.linhVuc + ', nghĩa là mảng này đi theo nhịp quen thuộc của bạn.';
    if (x.h === 'Thần số học' && SO) t += ' Năm nay là năm cá nhân số ' + so + ' – ' + SO.y + '; với ' + C.linhVuc + ', ' + SO[C.k] + '.';
    return t;
  });
  items.push('Góc nhìn của từng hệ: ' + gocNhin.join(' '));
  items.push(o.heUng.length >= 3 && !o.heNghich.length ? 'Gộp lại, ' + htDs_(o.heUng) + ' cùng có tín hiệu cho chủ đề này (việc thuận hay việc cần giữ xem ở từng hệ bên trên) – đây là mảng có chuyện đáng kể trong năm, đáng để bạn lên kế hoạch theo.' :
    o.heUng.length && o.heNghich.length ? 'Gộp lại, ' + htDs_(o.heUng) + ' có tín hiệu ủng hộ, còn ' + htDs_(o.heNghich) + ' nghiêng chiều ngược – được hay vấp đều có thể xảy ra.' :
    o.heUng.length ? 'Gộp lại, ' + htDs_(o.heUng) + ' có tín hiệu cho chủ đề này, các hệ còn lại không phản đối.' :
    'Gộp lại, các hệ không có tín hiệu mạnh cho chủ đề này – không có lực đẩy rõ, cũng không có trở ngại rõ.');
  // 5. Việc nên làm: đủ 3 việc (việc theo sự kiện trước, rồi việc theo tháng, rồi việc theo mức của chủ đề)
  var khuyen = o.khuyen.slice(0, 3);
  if (khuyen.length < 3 && TT.length) khuyen.push((C.k === 'sk' ? 'Dùng ' : 'Dồn việc quan trọng nhất về ' + C.linhVuc + ' vào ') + htDs_(TT.slice(0, 2).map(function (m) { return 'tháng ' + m; })) + ' âm lịch' + (C.k === 'sk' ? ' để bắt đầu một thói quen chăm sóc bản thân và giữ nó cả năm.' : ' – đặt mốc cụ thể ngay từ bây giờ.'));
  var kk = V.khuyen[key === 'hai' ? (sd % 2 ? 'xau' : 'tot') : key];
  kk.forEach(function (t) { if (khuyen.length < 3) { t = thay(t); if (khuyen.indexOf(t) < 0) khuyen.push(t); } });
  V.khuyen.vua.forEach(function (t) { if (khuyen.length < 3) { t = thay(t); if (khuyen.indexOf(t) < 0) khuyen.push(t); } });
  items.push(V.ket[key === 'hai' ? 'dong' : key] + ' Nếu chỉ chọn một việc để bắt đầu, hãy làm việc đầu tiên trong danh sách bên dưới' + (TT.length ? ', và đặt mốc xong trước hết tháng ' + TT[0] + ' âm lịch.' : '.'));
  if (C.k === 'sk') {
    var tang = (H.kyHanh || []).map(function (h) { return HSN_HANH_TANG[h]; }).filter(Boolean);
    if (tang.length) items.push((key === 'xau' || key === 'hai' ? 'Năm nay ' : 'Nền chung, kể cả năm nhẹ: ') + 'theo cổ học ngũ hành, bạn có xu hướng dễ mắc ' + htDs_(tang) +
      (key === 'xau' || key === 'hai' ? ' – những chỗ này dễ lộ ra hơn khi mệt, ngủ thiếu hoặc căng thẳng kéo dài.' : ' – những chỗ này thường yếu hơn phần còn lại của cơ thể.'));
    items.push('Đây là cách luận cổ học để tham khảo, không phải chẩn đoán: nên khám sức khỏe định kỳ, và khi có dấu hiệu lạ thì hỏi bác sĩ sớm.');
  }
  if (H.qua) items.push('Năm ' + vy + ' đã qua: hãy đối chiếu với những gì bạn đã trải – càng khớp, các năm tới càng đáng tin.');
  return { items: items, khuyen: khuyen };
}
/** Chủ đề (cv/tien/tc/sk) của một khía cạnh Hồ sơ năm */
function htCdCuaKc_(kc) { for (var i = 0; i < HSN_CD.length; i++) if (HSN_CD[i].kc.indexOf(kc) >= 0) return HSN_CD[i].k; return ''; }
/** Tách Hồ sơ năm (bản đầy đủ) thành 4 chủ đề: { cv: { k, ten, icon, nhan, huong, tom, items, suKien, thangThuan, thangChuY, heUng, heNghich, khuyen }, … } */
function htNamCd_(H) {
  if (!H || H.loi || !H.suKien) return null;
  var vy = H.nam, qua = !!H.qua, out = {};
  HSN_CD.forEach(function (C) {
    var kc = H.khiaCanh.filter(function (x) { return C.kc.indexOf(x.k) >= 0; });
    var ds = H.suKien.filter(function (x) { return C.kc.indexOf(x.kc) >= 0 && !x.ngoai; }).sort(function (a, b) { return b.p - a.p; });
    var nhanDs = kc.map(function (x) { return x.nhan; });
    var nhan = !ds.length ? 'Chưa đến tuổi' : nhanDs.indexOf('Cơ hội lẫn thử thách') >= 0 || (nhanDs.indexOf('Thuận') >= 0 && nhanDs.indexOf('Cần giữ') >= 0) ? 'Cơ hội lẫn thử thách' :
      nhanDs.indexOf('Cần giữ') >= 0 ? 'Cần giữ' : nhanDs.indexOf('Thuận') >= 0 ? 'Thuận' : nhanDs.indexOf('Có thay đổi') >= 0 ? 'Có thay đổi' : 'Bình ổn';
    var huong = nhan === 'Thuận' ? 'tot' : nhan === 'Cần giữ' ? 'xau' : nhan === 'Bình ổn' || nhan === 'Chưa đến tuổi' ? 'vua' : 'dong';
    var noi = ds.filter(function (x) { return x.muc === 'Rất cao' || x.muc === 'Cao' || x.muc === 'Khá cao'; });
    var top = noi[0] || ds[0];
    var tot = ds.filter(function (x) { return x.loai !== 'xau'; }), xau = ds.filter(function (x) { return x.loai === 'xau'; });
    // 1 dòng tóm tắt (bức tranh chung thấy dòng này)
    var tom = !ds.length ? C.ten + ' năm ' + vy + ': chưa đến độ tuổi của các việc thuộc chủ đề này.' :
      nhan === 'Thuận' ? C.ten + ' năm ' + vy + ': nghiêng về thuận' + (top ? ', nổi bật nhất là ' + top.ngan : '') + '.' :
      nhan === 'Cần giữ' ? C.ten + ' năm ' + vy + ': năm nên giữ nhịp' + (top ? ', việc cần để ý nhất: ' + top.ngan : '') + '.' :
      nhan === 'Cơ hội lẫn thử thách' ? C.ten + ' năm ' + vy + ': có cả cơ hội lẫn trở ngại – phần nào lớn hơn chưa ngã ngũ.' :
      nhan === 'Có thay đổi' ? C.ten + ' năm ' + vy + ': có xu hướng thay đổi' + (top ? ' (' + top.ngan + ')' : '') + '.' :
      noi.length ? C.ten + ' năm ' + vy + ': nhìn chung ổn định; việc có khả năng đến: ' + noi[0].ngan + '.' : C.ten + ' năm ' + vy + ': khá êm, không có việc nào nổi lên rõ.';
    // Tháng âm lịch hợp: tháng của việc thuận / tháng cần để ý
    function thangCua(a) { var t = []; a.slice(0, 3).forEach(function (x) { (x.thang || []).forEach(function (m) { if (t.indexOf(m) < 0) t.push(m); }); }); return t.sort(function (a2, b2) { return a2 - b2; }).slice(0, 3); }
    var thangThuan = thangCua(tot), thangChuY = thangCua(xau).filter(function (m) { return thangThuan.indexOf(m) < 0; });
    // Chủ đề chỉ có việc "cần giữ" (Sức khỏe & nhịp sống) không tự có tháng thuận: mượn tháng của các việc thuận cả năm,
    // bỏ các tháng cần để ý của chủ đề → "tháng dễ thở hơn" (16/11, để đủ phần tháng thuận của bài 9 xu)
    var thuanNguon = tot;
    if (!thangThuan.length && ds.length) {
      thuanNguon = H.suKien.filter(function (x) { return x.loai !== 'xau' && !x.ngoai; }).sort(function (a, b) { return b.p - a.p; });
      thangThuan = thangCua(thuanNguon).filter(function (m) { return thangChuY.indexOf(m) < 0; });
    }
    // Các hệ cùng báo / báo ngược trong chủ đề
    // Mỗi hệ: cộng số việc (trong 4 việc đầu) hệ đó ủng hộ, trừ số việc hệ đó báo chiều ngược → mỗi hệ chỉ đứng một phía
    var diemHe = {};
    ds.slice(0, 4).forEach(function (x) { x.ung.forEach(function (h) { diemHe[h] = (diemHe[h] || 0) + 1; }); x.nghich.forEach(function (h) { diemHe[h] = (diemHe[h] || 0) - 1; }); });
    var heUng = HSN_HE.filter(function (h) { return diemHe[h] > 0; }), heNghich = HSN_HE.filter(function (h) { return diemHe[h] < 0; });
    var khuyen = []; (noi.length ? noi : ds).slice(0, 3).forEach(function (x) { if (khuyen.indexOf(x.khuyen) < 0) khuyen.push(x.khuyen); });
    // Các đoạn luận 5 phần (content-creator 16/11 – kho văn HSN_CD_VAN, ghép theo tín hiệu trong htCdVan_)
    var items = [];
    if (!ds.length) items.push('Ở độ tuổi hiện tại, các việc thuộc chủ đề ' + C.linhVuc + ' chưa đến lúc xét. Điều quý nhất lúc này là một nếp sống vui, đủ ngủ, được yêu thương – nền đó sẽ đỡ cho mọi chủ đề về sau.');
    else {
      var van = htCdVan_(H, C, HSN_CD.indexOf(C), { ds: ds, noi: noi, nhan: nhan, thangThuan: thangThuan, thangChuY: thangChuY, thuanNguon: thuanNguon, heUng: heUng, heNghich: heNghich, khuyen: khuyen });
      items = van.items; khuyen = van.khuyen;
    }
    out[C.k] = { k: C.k, ten: C.ten, icon: C.icon, nam: vy, nhan: nhan, huong: huong, tom: tom, items: items, suKien: ds.map(function (x) { return x.k; }),
      thangThuan: thangThuan, thangChuY: thangChuY, heUng: heUng, heNghich: heNghich, khuyen: khuyen };
  });
  return out;
}
