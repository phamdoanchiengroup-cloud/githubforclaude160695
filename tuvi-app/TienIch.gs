/**
 * ============================================================
 *  TIỆN ÍCH XEM THÊM (bán lẻ): Xem tuổi làm nhà – cưới hỏi, Phong thủy Bát trạch,
 *  Chọn ngày tốt, Gieo quẻ hỏi việc, Hợp tác làm ăn, Đặt tên con, Bản tin vận tháng.
 *
 *  Mỗi tiện ích có phần xem miễn phí (làm mồi) và phần chi tiết trả xu – cắt ở máy chủ như các phần khác.
 *  Mọi kết quả kèm "coSo" ghi rõ phái / cách tính, và nhắc: mang tính tham khảo theo tục lệ, không phải
 *  kết luận khoa học. Dùng chung dữ liệu với TuVi.gs, BatTu.gs, LuanGiai.gs (lịch pháp), HaLac.gs (64 quẻ),
 *  ThanSoHoc.gs, Lunar.gs, ThanhToan.gs (xu, quyền).
 *
 *  API (gọi từ trình duyệt, token luôn ở cuối):
 *    tienIch(input, loai, thamSo, token)   – loai: xem_tuoi | phong_thuy | chon_ngay | hop_tac | dat_ten
 *    gieoQue(cauHoi, linhVuc, token)       – mỗi câu hỏi trừ xu (câu đầu tiên miễn phí)
 *    dsGieoQue(token)                      – các câu đã hỏi
 *    dangKyBanTin(input, email, token)     – bản tin vận tháng qua email (theo năm)
 *    caiDatBanTin()                        – chủ sở hữu chạy 1 lần trong trình soạn thảo để bật gửi hằng tháng
 * ============================================================
 */

var TI_THAM_KHAO = 'Theo tục lệ và sách cổ – mang tính tham khảo, không phải kết luận khoa học. Việc hệ trọng nên cân nhắc thêm điều kiện thực tế.';

/** Lá số rút gọn cho tiện ích: chỉ Tử Vi + Bát Tự (nhanh hơn lập đủ 6 hệ) */
function tiCoBan_(input) {
  input = input || {};
  if (!input.viewYear) input.viewYear = new Date().getFullYear();
  var tv = tuviLapLaSo(input), bt = batTuLap(input);
  return { tv: tv, bt: bt, I: tv.info, male: input.gender !== 'nu' };
}
function tiChiSo_(chi) { return mod12(chi); }
function tiNamCanChi_(y) { return CAN[mod10(y - 4)] + ' ' + CHI[mod12(y - 4)]; }

/* ================= 1. XEM TUỔI LÀM NHÀ – CƯỚI HỎI ================= */
var TI_KIM_LAU = {
  1: ['Kim Lâu Thân', 'theo tục lệ ảnh hưởng đến chính người đứng tuổi'],
  3: ['Kim Lâu Thê', 'theo tục lệ ảnh hưởng đến vợ/chồng'],
  6: ['Kim Lâu Tử', 'theo tục lệ ảnh hưởng đến con cái'],
  8: ['Kim Lâu Lục Súc', 'theo tục lệ ảnh hưởng đến tài sản, việc làm ăn']
};
var TI_HOANG_OC = [
  ['Nhất Cát', true, 'được yên ổn, việc làm nhà thuận'], ['Nhì Nghi', true, 'hợp làm nhà, gia đạo hưng vượng'],
  ['Tam Địa Sát', false, 'dễ gặp trắc trở, bệnh tật'], ['Tứ Tấn Tài', true, 'làm nhà thêm tài lộc'],
  ['Ngũ Thọ Tử', false, 'theo tục lệ là cung xấu cho gia đạo'], ['Lục Hoang Ốc', false, 'nhà dễ bỏ không, khó thành']
];
/** Tam Tai theo nhóm tam hợp của tuổi: Thân Tý Thìn → Dần Mão Thìn; Dần Ngọ Tuất → Thân Dậu Tuất; Hợi Mão Mùi → Tỵ Ngọ Mùi; Tỵ Dậu Sửu → Hợi Tý Sửu */
function tiTamTai_(chiSinh) {
  var g = mod12(chiSinh) % 4;   // 0: Thân Tý Thìn, 1: Tỵ Dậu Sửu, 2: Dần Ngọ Tuất, 3: Hợi Mão Mùi
  return [[2, 3, 4], [11, 0, 1], [8, 9, 10], [5, 6, 7]][g];
}
function tiHoangOc_(tuoiMu) { return TI_HOANG_OC[(((Math.floor(tuoiMu / 10) + tuoiMu % 10 - 1) % 6) + 6) % 6]; }
function tiXetNam_(namSinhAm, chiSinh, nu, nam) {
  var tm = nam - namSinhAm + 1, chiNam = mod12(nam - 4);
  var kl = TI_KIM_LAU[tm % 9] || null, ho = tiHoangOc_(tm), tt = tiTamTai_(chiSinh).indexOf(chiNam) >= 0;
  var qh = lgQuanHeChi_(chiNam, chiSinh), xung = qh.indexOf('lục xung') >= 0, tuoi = chiNam === mod12(chiSinh);
  var lamNha = !kl && ho[1] && !tt, cuoi = nu ? !kl : true;
  var ghi = [];
  ghi.push(kl ? 'Phạm ' + kl[0] + ' (tuổi mụ ' + tm + ' chia 9 dư ' + (tm % 9) + ') – ' + kl[1] + '.' : 'Không phạm Kim Lâu (tuổi mụ ' + tm + ' chia 9 dư ' + (tm % 9) + ').');
  ghi.push('Hoang Ốc: rơi cung ' + ho[0] + ' – ' + ho[2] + '.');
  ghi.push(tt ? 'Đang trong hạn Tam Tai (năm ' + CHI[chiNam] + ').' : 'Không trong hạn Tam Tai.');
  if (tuoi) ghi.push('Năm tuổi (trùng Thái Tuế) – nhiều người kiêng khởi sự lớn.');
  else if (xung) ghi.push('Năm xung tuổi (' + CHI[chiNam] + ' xung ' + CHI[mod12(chiSinh)] + ') – nên thận trọng.');
  return { nam: nam, canChi: tiNamCanChi_(nam), tuoiMu: tm, kimLau: kl ? kl[0] : '', hoangOc: ho[0], hoangOcTot: ho[1], tamTai: tt, xung: xung, namTuoi: tuoi,
    lamNha: lamNha, cuoi: cuoi, canNhac: tuoi || xung || (tt && cuoi), ghi: ghi };
}
function tiXemTuoi_(cb, mo, muonNam) {
  var I = cb.I, namAm = I.lunar.year, chi = I.yChi, nu = !cb.male, y0 = new Date().getFullYear();
  var bang = []; for (var y = y0; y < y0 + 10; y++) bang.push(tiXetNam_(namAm, chi, nu, y));
  var nay = bang[0];
  var ket = (nay.lamNha ? 'Năm ' + y0 + ' bạn ' + nay.tuoiMu + ' tuổi mụ: theo tục lệ là năm thuận để làm nhà.' : 'Năm ' + y0 + ' bạn ' + nay.tuoiMu + ' tuổi mụ: theo tục lệ chưa thuận để tự đứng tên làm nhà.') + ' ' +
    (nu ? (nay.cuoi ? 'Về cưới hỏi: không phạm Kim Lâu, có thể tổ chức.' : 'Về cưới hỏi: phạm Kim Lâu – nhiều gia đình sẽ chờ năm khác hoặc chọn ngày giờ kỹ.') :
      'Về cưới hỏi: tục lệ phổ biến xét Kim Lâu theo tuổi cô dâu – hãy nhập lá số của người nữ để xem.');
  var out = { loai: 'xem_tuoi', mo: mo, namSinhAm: namAm, tuoiCon: CON_GIAP[chi], nu: nu, nay: nay, ketLuan: ket,
    soNamLamNha: bang.filter(function (b) { return b.lamNha; }).length, soNamCuoi: bang.filter(function (b) { return b.cuoi; }).length,
    coSo: ['Kim Lâu: tuổi mụ (âm lịch) chia 9, dư 1 – 3 – 6 – 8 là phạm (Thân – Thê – Tử – Lục Súc). Cưới hỏi xét tuổi cô dâu; làm nhà xét tuổi người đứng tên.',
      'Hoang Ốc: 10 tuổi ở Nhất Cát, 20 Nhì Nghi, 30 Tam Địa Sát, 40 Tứ Tấn Tài, 50 Ngũ Thọ Tử, 60 Lục Hoang Ốc, 70 quay lại Nhất Cát; số lẻ đếm tiếp vòng quanh 6 cung. Nhất Cát, Nhì Nghi, Tứ Tấn Tài là cung tốt.',
      'Tam Tai: theo nhóm tam hợp của năm sinh (Thân Tý Thìn gặp Dần Mão Thìn; Dần Ngọ Tuất gặp Thân Dậu Tuất; Hợi Mão Mùi gặp Tỵ Ngọ Mùi; Tỵ Dậu Sửu gặp Hợi Tý Sửu).',
      'Tuổi mụ = năm xem − năm sinh âm lịch + 1. Mỗi địa phương có thể tính hơi khác; đây là cách phổ biến nhất.', TI_THAM_KHAO] };
  if (!mo) return out;
  out.bang = bang;
  out.hoaGiai = ['Mượn tuổi: nhờ người không phạm (thường là người thân, nam giới, hợp tuổi) đứng tên làm lễ động thổ, gia chủ tạm tránh đi trong lúc làm lễ.',
    'Chọn ngày – giờ hoàng đạo, hợp tuổi cho lễ động thổ, đổ mái, nhập trạch (xem công cụ Chọn ngày tốt).',
    'Nếu chỉ phạm Tam Tai hoặc xung tuổi: nhiều gia đình vẫn làm nhưng chọn ngày kỹ, làm lễ chu đáo và giữ tâm thế thận trọng.'];
  var namTot = bang.filter(function (b) { return b.lamNha; }).map(function (b) { return b.nam; });
  out.namTotLamNha = namTot;
  if (muonNam) {
    var mn = +muonNam, chiM = mod12(mn - 4);
    out.muon = { namSinh: mn, tuoi: CON_GIAP[chiM], canChi: tiNamCanChi_(mn), xet: tiXetNam_(mn, chiM, false, y0) };
  }
  return out;
}

/* ================= 2. PHONG THỦY BÁT TRẠCH ================= */
var TI_SO_QUAI = { 1: 'Khảm', 2: 'Khôn', 3: 'Chấn', 4: 'Tốn', 6: 'Càn', 7: 'Đoài', 8: 'Cấn', 9: 'Ly' };
var TI_QUAI_HANH = { 'Khảm': 'Thủy', 'Ly': 'Hỏa', 'Chấn': 'Mộc', 'Tốn': 'Mộc', 'Càn': 'Kim', 'Đoài': 'Kim', 'Cấn': 'Thổ', 'Khôn': 'Thổ' };
var TI_BT_KHI = ['Sinh Khí', 'Thiên Y', 'Diên Niên', 'Phục Vị', 'Họa Hại', 'Lục Sát', 'Ngũ Quỷ', 'Tuyệt Mệnh'];
// Thứ tự hướng: Sinh Khí, Thiên Y, Diên Niên, Phục Vị, Họa Hại, Lục Sát, Ngũ Quỷ, Tuyệt Mệnh
var TI_BT = {
  'Khảm': ['Đông Nam', 'Đông', 'Nam', 'Bắc', 'Tây', 'Tây Bắc', 'Đông Bắc', 'Tây Nam'],
  'Ly': ['Đông', 'Đông Nam', 'Bắc', 'Nam', 'Đông Bắc', 'Tây Nam', 'Tây', 'Tây Bắc'],
  'Chấn': ['Nam', 'Bắc', 'Đông Nam', 'Đông', 'Tây Nam', 'Đông Bắc', 'Tây Bắc', 'Tây'],
  'Tốn': ['Bắc', 'Nam', 'Đông', 'Đông Nam', 'Tây Bắc', 'Tây', 'Tây Nam', 'Đông Bắc'],
  'Càn': ['Tây', 'Đông Bắc', 'Tây Nam', 'Tây Bắc', 'Đông Nam', 'Bắc', 'Đông', 'Nam'],
  'Khôn': ['Đông Bắc', 'Tây', 'Tây Bắc', 'Tây Nam', 'Đông', 'Nam', 'Đông Nam', 'Bắc'],
  'Cấn': ['Tây Nam', 'Tây Bắc', 'Tây', 'Đông Bắc', 'Nam', 'Đông', 'Bắc', 'Đông Nam'],
  'Đoài': ['Tây Bắc', 'Tây Nam', 'Đông Bắc', 'Tây', 'Bắc', 'Đông Nam', 'Nam', 'Đông']
};
var TI_BT_Y = {
  'Sinh Khí': ['Tốt nhất – sức sống, tài lộc, thăng tiến', 'hướng cửa chính, hướng bàn làm việc, hướng ngồi khi ký kết'],
  'Thiên Y': ['Tốt – sức khỏe, quý nhân giúp đỡ', 'phòng ngủ, hướng đầu giường (nhất là người hay ốm)'],
  'Diên Niên': ['Tốt – hòa thuận, bền vững trong tình cảm và các mối quan hệ', 'phòng ngủ vợ chồng, phòng khách'],
  'Phục Vị': ['Tốt vừa – bình yên, tĩnh tâm, học hành', 'bàn thờ, bàn học, phòng làm việc tĩnh'],
  'Họa Hại': ['Xấu nhẹ – thị phi, việc nhỏ hay trục trặc', 'nhà vệ sinh, kho, phòng chứa đồ'],
  'Lục Sát': ['Xấu – bất hòa, kiện tụng, tình cảm trắc trở', 'nhà vệ sinh, kho'],
  'Ngũ Quỷ': ['Xấu – hao tài, tranh cãi, dễ mất mát', 'đặt bếp (bếp "tọa hung hướng cát"), nhà vệ sinh'],
  'Tuyệt Mệnh': ['Xấu nhất – hao tổn, bệnh tật', 'nhà vệ sinh, kho; tránh đặt cửa chính, giường ngủ']
};
/** Cung phi (quái mệnh) theo năm sinh âm lịch – công thức phổ biến cho 1900–2099 */
function tiCungPhi_(namAm, male) {
  var yy = namAm % 100, r;
  if (namAm < 2000) r = male ? 100 - yy : yy - 4; else r = male ? 99 - yy : yy + 6;
  r = ((r % 9) + 9) % 9; if (r === 0) r = 9;
  if (r === 5) return male ? 'Khôn' : 'Cấn';
  return TI_SO_QUAI[r];
}
function tiPhongThuy_(cb, mo) {
  var namAm = cb.I.lunar.year, q = tiCungPhi_(namAm, cb.male), hanh = TI_QUAI_HANH[q];
  var dong = ['Khảm', 'Ly', 'Chấn', 'Tốn'].indexOf(q) >= 0;
  var huong = TI_BT[q].map(function (h, i) { var k = TI_BT_KHI[i]; return { khi: k, huong: h, tot: i < 4, y: TI_BT_Y[k][0], dung: TI_BT_Y[k][1] }; });
  var sinh = HANH_SINH[(HANH_SINH.indexOf(hanh) + 4) % 5], khac = HANH_SINH[(HANH_SINH.indexOf(hanh) + 3) % 5];
  var out = { loai: 'phong_thuy', mo: mo, namSinhAm: namAm, cungPhi: q, hanh: hanh, nhom: dong ? 'Đông tứ mệnh' : 'Tây tứ mệnh',
    tot: huong[0], ketLuan: 'Bạn thuộc cung ' + q + ' (' + hanh + '), nhóm ' + (dong ? 'Đông tứ mệnh – hợp nhà hướng Đông, Đông Nam, Nam, Bắc' : 'Tây tứ mệnh – hợp nhà hướng Tây, Tây Bắc, Tây Nam, Đông Bắc') +
      '. Hướng tốt nhất (Sinh Khí): ' + huong[0].huong + '.',
    coSo: ['Phái Bát trạch (sách Bát trạch minh cảnh): mỗi người có một "cung phi" theo năm sinh âm lịch và giới tính; 8 hướng chia 4 tốt (Sinh Khí, Thiên Y, Diên Niên, Phục Vị) và 4 xấu (Họa Hại, Lục Sát, Ngũ Quỷ, Tuyệt Mệnh).',
      'Cung phi: năm 1900–1999 nam lấy (100 − 2 số cuối), nữ lấy (2 số cuối − 4); từ 2000 nam lấy (99 − 2 số cuối), nữ lấy (2 số cuối + 6); chia 9 lấy dư (dư 0 là 9). Số 5: nam là Khôn, nữ là Cấn (có tài liệu ghi khác – đây là cách phổ biến nhất).',
      'Màu theo ngũ hành của cung phi (hành bản mệnh và hành sinh ra nó); phần "theo Bát Tự" dùng dụng thần – hai cách có thể cho gợi ý khác nhau.', 'Bát trạch chỉ là một trong nhiều phái phong thủy (còn Huyền không, Loan đầu…).', TI_THAM_KHAO] };
  if (!mo) return out;
  out.huong = huong;
  out.mau = { hop: [hanh + ': ' + HANH_INFO[hanh].mau, sinh + ' (sinh ra ' + hanh + '): ' + HANH_INFO[sinh].mau], ky: khac + ' (khắc ' + hanh + '): ' + HANH_INFO[khac].mau,
    batTu: cb.bt.goiY ? 'Theo Bát Tự (dụng thần ' + cb.bt.goiY.dung + '): ' + cb.bt.goiY.mau : '' };
  out.boTri = [
    'Cửa chính: ưu tiên hướng ' + huong[0].huong + ' (Sinh Khí) hoặc ' + huong[2].huong + ' (Diên Niên).',
    'Bàn làm việc: ngồi quay mặt về ' + huong[0].huong + ' hoặc ' + huong[3].huong + '.',
    'Giường ngủ: đầu giường hướng ' + huong[1].huong + ' (Thiên Y) hoặc ' + huong[2].huong + ' (Diên Niên).',
    'Bếp: đặt ở phương xấu (' + huong[6].huong + ' – Ngũ Quỷ, hoặc ' + huong[7].huong + ' – Tuyệt Mệnh), miệng bếp quay về hướng tốt – "tọa hung hướng cát".',
    'Nhà vệ sinh, kho: đặt ở ' + huong[7].huong + ', ' + huong[5].huong + ' hoặc ' + huong[4].huong + '.',
    'Vợ chồng khác nhóm Đông/Tây tứ mệnh: thường lấy cung phi của người trụ cột kinh tế làm chính, người còn lại chọn hướng bàn làm việc, đầu giường hợp mình.'];
  return out;
}

/* ================= 3. CHỌN NGÀY TỐT ================= */
var TI_VIEC = {
  cuoi: { ten: 'Cưới hỏi', trucTot: ['Thành', 'Định', 'Khai', 'Mãn'], trucXau: ['Phá', 'Nguy', 'Bế', 'Kiến', 'Trừ'], kyChi: 11, soCN: [2, 6], kyTamNuong: true },
  khai_truong: { ten: 'Khai trương, mở hàng', trucTot: ['Mãn', 'Thành', 'Khai', 'Định'], trucXau: ['Phá', 'Bế', 'Nguy', 'Trừ'], kyCan: 0, soCN: [1, 8] },
  dong_tho: { ten: 'Động thổ, khởi công', trucTot: ['Thành', 'Định', 'Chấp', 'Mãn'], trucXau: ['Phá', 'Nguy', 'Kiến', 'Thu', 'Bế'], soCN: [4, 8] },
  nhap_trach: { ten: 'Nhập trạch, về nhà mới', trucTot: ['Thành', 'Định', 'Khai', 'Mãn'], trucXau: ['Phá', 'Nguy', 'Bế', 'Chấp'], soCN: [4, 6] },
  ky_ket: { ten: 'Ký kết, giao dịch lớn', trucTot: ['Thành', 'Định', 'Chấp', 'Khai', 'Mãn'], trucXau: ['Phá', 'Nguy', 'Bế'], kyCan: 5, soCN: [8, 4] },
  xuat_hanh: { ten: 'Xuất hành, đi xa', trucTot: ['Khai', 'Kiến', 'Thành', 'Định'], trucXau: ['Phá', 'Nguy', 'Bế', 'Thu'], kyChi: 5, soCN: [5, 3] },
  mua_xe_nha: { ten: 'Mua nhà, mua xe', trucTot: ['Thành', 'Định', 'Mãn', 'Thu', 'Khai'], trucXau: ['Phá', 'Nguy', 'Bế'], kyCan: 4, soCN: [4, 8] }
};
var TI_TAM_NUONG = [3, 7, 13, 18, 22, 27], TI_NGUYET_KY = [5, 14, 23];
function tiNgayCaNhan_(solar, d, m, y) {
  var rd = tsRutGon_(solar.day, false), rm = tsRutGon_(solar.month, false);
  var py = tsRutGon_(rd + rm + tsRutGon_(String(y).split('').reduce(function (a, c) { return a + (+c); }, 0), false), false);
  return tsRutGon_(tsRutGon_(py + m, false) + d, false);
}
function tiChonNgay_(cb, viec, thang, mo) {
  var V = TI_VIEC[viec]; if (!V) throw new Error('Chưa có việc "' + viec + '".');
  var mm = /^(\d{4})-(\d{1,2})$/.exec(String(thang || '')); if (!mm) throw new Error('Tháng không hợp lệ.');
  var Y = +mm[1], M = +mm[2], I = cb.I, chiTuoi = I.yChi;
  var soNgay = new Date(Y, M, 0).getDate(), ds = [];
  for (var d = 1; d <= soNgay; d++) {
    var jd = jdFromDate(d, M, Y), lu = solarToLunar(d, M, Y), dc = mod10(jd + 9), dz = mod12(jd + 1);
    var L2 = sunLongitudeDeg(jd + 0.5 - 7 / 24 - 1e-4), chiThangTiet = mod12(Math.floor((((L2 - 315) % 360) + 360) % 360 / 30) + 2);
    var truc = LG_TRUC[mod12(dz - chiThangTiet)], chiThangHD = mod12(lu.month + 1);
    var than = LG_12_THAN[lgThanNgay_(chiThangHD, dz)], hd = LG_HOANG_DAO.indexOf(lgThanNgay_(chiThangHD, dz)) >= 0;
    var tu = LG_TU[((jd % 28) + 28) % 28], cn = tiNgayCaNhan_(I.solar, d, M, Y);
    var diem = 0, tot = [], xau = [], tranh = false;
    if (hd) { diem += 2; tot.push('Hoàng đạo (' + than + ')'); } else { diem -= 2; xau.push('Hắc đạo (' + than + ')'); }
    if (V.trucTot.indexOf(truc) >= 0) { diem += 2; tot.push('Trực ' + truc + ' hợp việc'); }
    else if (V.trucXau.indexOf(truc) >= 0) { diem -= 3; xau.push('Trực ' + truc + ' kỵ việc này'); if (truc === 'Phá') tranh = true; }
    if (tu[1]) { diem += 1; tot.push('Sao ' + tu[0] + ' (cát tú)'); } else { diem -= 1; xau.push('Sao ' + tu[0] + ' (hung tú)'); }
    if (TI_TAM_NUONG.indexOf(lu.day) >= 0) { diem -= 3; xau.push('Ngày Tam Nương (' + lu.day + ' âm)'); if (V.kyTamNuong) tranh = true; }
    if (TI_NGUYET_KY.indexOf(lu.day) >= 0) { diem -= 2; xau.push('Ngày Nguyệt Kỵ (' + lu.day + ' âm)'); }
    var qh = lgQuanHeChi_(dz, chiTuoi);
    if (qh.indexOf('lục xung') >= 0) { diem -= 4; tranh = true; xau.push('Ngày xung tuổi (' + CHI[dz] + ' xung ' + CHI[chiTuoi] + ')'); }
    else if (qh.indexOf('tam hợp') >= 0 || qh.indexOf('lục hợp') >= 0) { diem += 1; tot.push('Ngày hợp tuổi (' + qh.join(', ') + ')'); }
    if (V.kyChi === dz) { diem -= 2; xau.push('Bành Tổ kỵ: ' + LG_BANH_TO_CHI[dz].split(' – ')[0]); }
    if (V.kyCan === dc) { diem -= 2; xau.push('Bành Tổ kỵ: ' + LG_BANH_TO_CAN[dc].split(' – ')[0]); }
    if (V.soCN.indexOf(cn) >= 0) { diem += 1; tot.push('Ngày cá nhân số ' + cn + ' hợp việc (Thần số)'); }
    var muc = tranh || diem <= -4 ? 'Nên tránh' : diem >= 5 ? 'Rất tốt' : diem >= 3 ? 'Tốt' : 'Bình thường';
    var gio = []; for (var h = 0; h < 12; h++) if (LG_HOANG_DAO.indexOf(lgThanNgay_(dz, h)) >= 0) gio.push(CHI[h] + ' (' + GIO_CHI[h] + ')');
    ds.push({ ngay: d + '/' + M + '/' + Y, d: d, thu: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][(jd + 1) % 7], am: lu.day + '/' + lu.month + (lu.leap ? 'N' : ''),
      canChi: CAN[dc] + ' ' + CHI[dz], hoangDao: hd, truc: truc, diem: diem, muc: muc, tot: tot, xau: xau, gio: gio,
      huong: 'Hỷ thần ' + LG_HY_THAN[dc] + ', Tài thần ' + LG_TAI_THAN[dc] });
  }
  var dem = { 'Rất tốt': 0, 'Tốt': 0, 'Bình thường': 0, 'Nên tránh': 0 };
  ds.forEach(function (x) { dem[x.muc]++; });
  var out = { loai: 'chon_ngay', mo: mo, viec: viec, tenViec: V.ten, thang: Y + '-' + (M < 10 ? '0' : '') + M, dem: dem,
    ketLuan: 'Tháng ' + M + '/' + Y + ' có ' + (dem['Rất tốt'] + dem['Tốt']) + ' ngày tốt cho việc ' + V.ten.toLowerCase() + ' hợp tuổi ' + CON_GIAP[chiTuoi] + ' của bạn' + (dem['Rất tốt'] ? ', trong đó ' + dem['Rất tốt'] + ' ngày rất tốt' : '') + '.',
    coSo: ['Mỗi ngày xét: 12 thần Hoàng đạo/Hắc đạo, 12 Trực (hợp hay kỵ với việc đang chọn), Nhị thập bát tú, ngày Tam Nương (3, 7, 13, 18, 22, 27 âm), Nguyệt Kỵ (5, 14, 23 âm), ngày xung tuổi, Bành Tổ bách kỵ và ngày cá nhân (Thần số học).',
      'Ngày xung tuổi, trực Phá (và Tam Nương với cưới hỏi) được xếp "nên tránh" dù các yếu tố khác tốt; ngày có nhiều yếu tố xấu cộng lại (từ −4 điểm) cũng xếp "nên tránh". Còn lại là ngày bình thường – làm việc thường ngày không sao, việc lớn nên ưu tiên ngày tốt.',
      'Chưa xét: Dương công kỵ nhật, Sát chủ, Thọ tử, sao tốt xấu theo Ngọc hạp thông thư – các sách chọn ngày khác nhau có thể cho kết quả lệch vài ngày.', TI_THAM_KHAO] };
  if (!mo) { out.tot1 = ds.filter(function (x) { return x.muc === 'Rất tốt' || x.muc === 'Tốt'; }).length; return out; }
  out.ngay = ds;
  out.nenChon = ds.filter(function (x) { return x.muc === 'Rất tốt' || x.muc === 'Tốt'; }).sort(function (a, b) { return b.diem - a.diem; }).slice(0, 5);
  return out;
}

/* ================= 4. GIEO QUẺ HỎI VIỆC (Mai hoa dịch số – lập quẻ theo thời gian) ================= */
var TI_TIEN_THIEN = { 1: 'Càn', 2: 'Đoài', 3: 'Ly', 4: 'Chấn', 5: 'Tốn', 6: 'Khảm', 7: 'Cấn', 8: 'Khôn' };
var TI_LV_QUE = { tai_loc: 'tiền bạc, làm ăn', cong_viec: 'công việc, sự nghiệp', tinh_cam: 'tình cảm, hôn nhân', suc_khoe: 'sức khỏe', thi_cu: 'thi cử, học hành', di_xa: 'đi xa, xuất hành', kien_tung: 'tranh chấp, giấy tờ', khac: 'việc bạn hỏi' };
var TI_TD = {
  duoc_sinh: [2, 'Dụng sinh Thể', 'việc có lực bên ngoài nâng đỡ – dễ thành, có người giúp, thường có tin vui'],
  binh: [1.5, 'Thể Dụng tỷ hòa', 'hai bên cùng khí – việc thuận, có người đồng lòng'],
  khac: [0.5, 'Thể khắc Dụng', 'việc vẫn thành nhưng phải bỏ công sức, chủ động nắm quyền'],
  sinh: [-1, 'Thể sinh Dụng', 'bạn phải cho đi nhiều – hao tiền, hao sức, dễ thiệt nếu không tính kỹ'],
  bi_khac: [-2, 'Dụng khắc Thể', 'việc có sức cản từ bên ngoài – dễ trắc trở, nên chậm lại hoặc đổi cách']
};
function tiGioVN_() { var d = new Date(Date.now() + 7 * 3600000); return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate(), h: d.getUTCHours(), mi: d.getUTCMinutes() }; }
function tiLapQue_(t) {
  var lu = solarToLunar(t.d, t.m, t.y), chiGio = mod12(Math.floor((t.h + 1) / 2));
  var soNam = mod12(lu.year - 4) + 1, soGio = chiGio + 1, N = soNam + lu.month + lu.day, H = N + soGio;
  var tren = TI_TIEN_THIEN[N % 8 || 8], duoi = TI_TIEN_THIEN[H % 8 || 8], dong = H % 6 || 6;
  var hao = hlHaoCua_(tren, duoi), chu = hlTuHao_(hao), bien = hlTuHao_(hlBien_(hao, dong)), ho = hlTuHao_(hao.slice(1, 4).concat(hao.slice(2, 5)));
  var the = dong <= 3 ? tren : duoi, dung = dong <= 3 ? duoi : tren, bienDung = dong <= 3 ? bien.duoi : bien.tren;
  return { lu: lu, chiGio: chiGio, so: [soNam, lu.month, lu.day, soGio], tren: tren, duoi: duoi, dong: dong, chu: chu, bien: bien, ho: ho, the: the, dung: dung, bienDung: bienDung };
}
function tiLuanQue_(Q, linhVuc) {
  var hT = HL_QUAI[Q.the].hanh, hD = HL_QUAI[Q.dung].hanh, hB = HL_QUAI[Q.bienDung].hanh;
  var r1 = TI_TD[quanHeHanh(hT, hD)], r2 = TI_TD[quanHeHanh(hT, hB)], rh = TI_TD[quanHeHanh(hT, HL_QUAI[Q.ho.tren].hanh)];
  var mua = ['Mộc', 'Mộc', 'Mộc', 'Hỏa', 'Hỏa', 'Hỏa', 'Kim', 'Kim', 'Kim', 'Thủy', 'Thủy', 'Thủy'][Q.lu.month - 1];
  var qm = quanHeHanh(mua, hT), vuong = qm === 'binh' ? ['vượng', 0.5] : qm === 'sinh' ? ['tướng', 0.3] : qm === 'duoc_sinh' ? ['hưu', 0] : qm === 'khac' ? ['tử', -0.5] : ['tù', -0.3];
  var d = r1[0] + r2[0] * 0.7 + rh[0] * 0.3 + vuong[1] + Q.chu.diem * 0.3;
  var muc = d >= 2.2 ? 'Đại cát' : d >= 0.9 ? 'Cát' : d > -0.6 ? 'Bình' : d > -1.8 ? 'Hơi trắc trở' : 'Hung';
  var lv = TI_LV_QUE[linhVuc] || TI_LV_QUE.khac;
  var luan = [
    'Quẻ chủ ' + Q.chu.ten + ' (hào ' + Q.dong + ' động): ' + Q.chu.y + '.',
    'Hiện tại – ' + r1[1] + ' (Thể ' + Q.the + ' ' + hT + ', Dụng ' + Q.dung + ' ' + hD + '): ' + r1[2] + '.',
    'Quá trình – quẻ Hỗ ' + Q.ho.ten + ': ' + rh[2] + '.',
    'Kết cục – quẻ Biến ' + Q.bien.ten + ' (' + r2[1] + '): ' + r2[2] + '.',
    'Thể ' + hT + ' vào tháng ' + Q.lu.month + ' âm là ' + vuong[0] + (vuong[1] > 0 ? ' – bản thân đủ sức lo việc.' : vuong[1] < 0 ? ' – bản thân đang yếu, nên nhờ thêm người.' : '.')
  ];
  var khuyen = d >= 0.9 ? 'Về ' + lv + ': có thể tiến hành; ' + Q.chu.khuyen + '.' : d > -0.6 ? 'Về ' + lv + ': chưa rõ thắng thua – chuẩn bị kỹ, làm từng bước; ' + Q.chu.khuyen + '.' :
    'Về ' + lv + ': lúc này nên chậm lại, tìm thêm thông tin hoặc đổi cách làm; ' + Q.chu.khuyen + '.';
  return { muc: muc, diem: Math.round(d * 100) / 100, luan: luan, khuyen: khuyen };
}
function tiQueKetQua_(Q, cauHoi, linhVuc, t) {
  var L = tiLuanQue_(Q, linhVuc), UK = null;
  if (typeof vsUngKy_ === 'function') { try { UK = vsUngKy_(Q, t); L.luan = L.luan.concat(UK.luan); } catch (e) { UK = null; } }
  return { cauHoi: cauHoi, linhVuc: linhVuc, luc: t.d + '/' + t.m + '/' + t.y + ' ' + (t.h < 10 ? '0' : '') + t.h + ':' + (t.mi < 10 ? '0' : '') + t.mi,
    am: Q.lu.day + '/' + Q.lu.month + '/' + Q.lu.year + ' giờ ' + CHI[Q.chiGio], so: Q.so, dong: Q.dong,
    chu: { ten: Q.chu.ten, hao: Q.chu.hao, tren: Q.tren, duoi: Q.duoi }, ho: { ten: Q.ho.ten, hao: Q.ho.hao }, bien: { ten: Q.bien.ten, hao: Q.bien.hao },
    the: Q.the, dung: Q.dung, ungKy: UK ? { ngay: UK.ngay, thang: UK.thang, so: UK.so, hanh: UK.hanh } : null, muc: L.muc, diem: L.diem, luan: L.luan, khuyen: L.khuyen,
    coSo: ['Mai hoa dịch số (Thiệu Khang Tiết) – lập quẻ theo thời gian hỏi: (số chi năm + tháng âm + ngày âm) chia 8 được quẻ trên; cộng thêm số chi giờ chia 8 được quẻ dưới; tổng chia 6 được hào động. Số tiên thiên: Càn 1, Đoài 2, Ly 3, Chấn 4, Tốn 5, Khảm 6, Cấn 7, Khôn 8.',
      'Quẻ không có hào động là Thể (bạn), quẻ có hào động là Dụng (sự việc). Xét ngũ hành Thể – Dụng ở quẻ chủ (hiện tại), quẻ Hỗ (quá trình), quẻ Biến (kết cục) và mùa hỏi.',
      (UK ? UK.coSo + ' ' : '') + 'Mỗi câu hỏi nên hỏi một lần, lúc lòng thật sự muốn biết. ' + TI_THAM_KHAO] };
}
function gieoQue(cauHoi, linhVuc, token) {
  var u = tkCan_(token);
  cauHoi = String(cauHoi || '').trim().slice(0, 300);
  if (cauHoi.length < 5) throw new Error('Hãy viết câu hỏi cụ thể hơn (ít nhất vài chữ).');
  var bg = ttBangGia_(), gia = bg.phan.gieo_que ? bg.phan.gieo_que.xu : 9;
  return ttKhoa_(function () {
    var sh = ttSheet_('GieoQue'), daHoi = ttTim_(sh, 2, u.ten).length, mien = daHoi === 0, toan = ttToanQuyen_(u);
    var tra = toan || mien ? 0 : gia, du = ttSoDu_(u.ten);
    if (du < tra) return { ok: false, thieu: tra - du, gia: tra, soDu: du };
    var t = tiGioVN_(), kq = tiQueKetQua_(tiLapQue_(t), cauHoi, linhVuc, t);
    var moi = tra ? ttCong_(u.ten, -tra, 'Gieo quẻ: ' + cauHoi.slice(0, 50), 'que') : du;
    sh.appendRow([new Date(), u.ten, cauHoi, linhVuc || '', JSON.stringify(kq)]);
    kq.ok = true; kq.soDu = toan ? null : moi; kq.mienPhi = mien && !toan; kq.gia = tra;
    return kq;
  });
}
function dsGieoQue(token) {
  var u = tkCan_(token), sh = ttSheet_('GieoQue'), rows = ttTim_(sh, 2, u.ten).slice(-20).reverse();
  return rows.map(function (r) { try { return JSON.parse(sh.getRange(r, 5).getValue()); } catch (e) { return null; } }).filter(Boolean);
}

/* ================= 5. HỢP TÁC LÀM ĂN ================= */
var TI_TS_NHOM = [[1, 5, 7], [2, 4, 8], [3, 6, 9]];
var TI_VAI_TS = { 1: 'khởi xướng, dẫn dắt', 2: 'kết nối, hòa giải, hỗ trợ', 3: 'truyền thông, bán hàng, sáng tạo', 4: 'vận hành, quy trình, kỷ luật', 5: 'đối ngoại, mở thị trường, đàm phán', 6: 'chăm sóc khách hàng, nhân sự', 7: 'nghiên cứu, phân tích, chuyên môn sâu', 8: 'tài chính, quản trị, ra quyết định lớn', 9: 'tầm nhìn, cộng đồng, thương hiệu' };
var TI_VAI_HD = { Manifestor: 'khởi xướng, mở đường', Generator: 'bền bỉ thực thi', 'Manifesting Generator': 'thực thi nhanh, đa nhiệm', Projector: 'định hướng, quản lý người', Reflector: 'đánh giá, kiểm định' };
function tiTsGoc_(n) { return n > 9 ? tsRutGon_(n, false) : n; }
function tiHopTac_(A, B, inA, inB, mo) {
  var diem = 0, dong = [];
  function them(d, t) { diem += d; dong.push({ d: d, t: t }); }
  var cA = A.tuvi.info.yChi, cB = B.tuvi.info.yChi, qh = lgQuanHeChi_(cA, cB);
  if (qh.indexOf('tam hợp') >= 0 || qh.indexOf('lục hợp') >= 0) them(2, 'Tuổi ' + CON_GIAP[cA] + ' – ' + CON_GIAP[cB] + ' ' + qh.join(', ') + ': dễ đồng lòng, hiểu ý nhau.');
  if (qh.indexOf('lục xung') >= 0) them(-2, 'Tuổi xung (' + CHI[cA] + ' – ' + CHI[cB] + '): hay bất đồng cách làm, cần phân vai rõ.');
  if (qh.indexOf('lục hại') >= 0 || qh.indexOf('tương hình') >= 0) them(-1, 'Tuổi ' + qh.filter(function (x) { return /hại|hình/.test(x); }).join(', ') + ': dễ hiểu lầm, nên thỏa thuận bằng văn bản.');
  var mA = A.tuvi.info.banMenh.hanh, mB = B.tuvi.info.banMenh.hanh, qm = quanHeHanh(mA, mB);
  them({ binh: 0.8, sinh: 0.5, duoc_sinh: 0.8, khac: -0.6, bi_khac: -0.6 }[qm], 'Bản mệnh ' + A.tuvi.info.banMenh.ten + ' – ' + B.tuvi.info.banMenh.ten + ': ' +
    { binh: 'cùng hành, hợp tính', sinh: 'người thứ nhất nâng đỡ người thứ hai', duoc_sinh: 'người thứ hai nâng đỡ người thứ nhất', khac: 'người thứ nhất lấn át người thứ hai', bi_khac: 'người thứ hai lấn át người thứ nhất' }[qm] + '.');
  function manh(bt) { var p = bt.phanTram || {}; return Object.keys(p).sort(function (x, y) { return p[y] - p[x]; })[0]; }
  var hA = manh(A.battu), hB = manh(B.battu), bu = 0;
  if ((A.battu.goiY.hy || []).indexOf(hB) >= 0) { bu++; them(1.5, 'Hành mạnh nhất của người thứ hai (' + hB + ') đúng là hành người thứ nhất cần (dụng/hỷ thần) – bổ khuyết cho nhau.'); }
  if ((B.battu.goiY.hy || []).indexOf(hA) >= 0) { bu++; them(1.5, 'Hành mạnh nhất của người thứ nhất (' + hA + ') đúng là hành người thứ hai cần – bổ khuyết cho nhau.'); }
  if ((A.battu.goiY.ky || []).indexOf(hB) >= 0) them(-1, 'Hành mạnh của người thứ hai (' + hB + ') là hành người thứ nhất nên tiết chế – dễ bị cuốn theo.');
  if ((B.battu.goiY.ky || []).indexOf(hA) >= 0) them(-1, 'Hành mạnh của người thứ nhất (' + hA + ') là hành người thứ hai nên tiết chế.');
  var ttAB = thapThanTen_(A.battu.nhatChuCan, B.battu.nhatChuCan), ttBA = thapThanTen_(B.battu.nhatChuCan, A.battu.nhatChuCan);
  var TT_Y = { 'Tỷ Kiên': 'ngang hàng – hợp làm đồng sáng lập nhưng dễ cạnh tranh vai', 'Kiếp Tài': 'ngang hàng, dễ tranh phần – cần chia lợi nhuận rõ ràng', 'Chính Ấn': 'người kia là chỗ dựa, người thầy', 'Thiên Ấn': 'người kia cho ý tưởng, góc nhìn mới',
    'Thực Thần': 'mình nuôi dưỡng, đào tạo người kia', 'Thương Quan': 'mình hay góp ý, chỉnh sửa người kia', 'Chính Tài': 'mình quản được người kia, người kia mang lại lợi ích', 'Thiên Tài': 'người kia mở ra nguồn tiền, cơ hội bất ngờ', 'Chính Quan': 'người kia có uy với mình, giữ kỷ luật', 'Thất Sát': 'người kia gây áp lực, thúc mình mạnh' };
  var tsA = tiTsGoc_(A.moRong && A.moRong.thanSo ? A.moRong.thanSo.duongDoi : 0), tsB = tiTsGoc_(B.moRong && B.moRong.thanSo ? B.moRong.thanSo.duongDoi : 0);
  if (tsA && tsB) {
    var cung = TI_TS_NHOM.some(function (g) { return g.indexOf(tsA) >= 0 && g.indexOf(tsB) >= 0; });
    them(cung ? 1 : 0, 'Thần số đường đời ' + tsA + ' – ' + tsB + ': ' + (cung ? 'cùng nhóm, dễ hiểu cách nghĩ của nhau.' : 'khác nhóm – bổ sung góc nhìn nhưng cần kiên nhẫn trao đổi.'));
  }
  var lA = A.moRong && A.moRong.hd ? A.moRong.hd.loai : '', lB = B.moRong && B.moRong.hd ? B.moRong.hd.loai : '';
  if (lA && lB) {
    var hdHop = (lA === 'Projector') !== (lB === 'Projector') && [lA, lB].some(function (x) { return /Generator/.test(x); });
    if (hdHop) them(1, 'Human Design: một người định hướng (Projector), một người thực thi (Generator) – cặp phân vai tự nhiên.');
    else if (lA === 'Manifestor' && lB === 'Manifestor') them(-0.5, 'Human Design: hai người cùng muốn khởi xướng – nên chia rõ mảng phụ trách.');
  }
  var d10 = chuanHoa10_(diem * 0.9);
  var muc = d10 >= 7 ? 'Rất hợp tác' : d10 >= 5.8 ? 'Hợp tác tốt' : d10 >= 4.5 ? 'Hợp tác được, cần phân vai rõ' : 'Nhiều va chạm – cân nhắc kỹ';
  var out = { loai: 'hop_tac', mo: mo, ten: [inA.name || 'Người 1', inB.name || 'Người 2'], diem: d10, muc: muc,
    ketLuan: (inA.name || 'Người 1') + ' và ' + (inB.name || 'Người 2') + ': ' + d10 + '/10 – ' + muc.toLowerCase() + '.',
    coSo: ['Kết hợp: quan hệ tuổi (tam hợp, lục hợp, xung, hại, hình), ngũ hành bản mệnh nạp âm, bổ khuyết ngũ hành Bát Tự (hành mạnh của người này có phải dụng/hỷ thần của người kia), thập thần giữa hai Nhật chủ, nhóm số đường đời Thần số học và loại năng lượng Human Design.',
      'Đây là bộ tiêu chí do Thiên Cơ Các tổng hợp từ tục "hợp tuổi làm ăn" và các hệ – không phải một phép xem cổ nguyên bản. Hợp đồng rõ ràng và năng lực thực tế vẫn quan trọng nhất.', TI_THAM_KHAO] };
  if (!mo) { out.soTieuChi = dong.length; return out; }
  out.dong = dong;
  out.quanHe = [(inA.name || 'Người 1') + ' nhìn ' + (inB.name || 'người 2') + ' như ' + ttAB + ': ' + (TT_Y[ttAB] || ''), (inB.name || 'Người 2') + ' nhìn ' + (inA.name || 'người 1') + ' như ' + ttBA + ': ' + (TT_Y[ttBA] || '')];
  out.vaiTro = [[inA.name || 'Người 1', tsA ? TI_VAI_TS[tsA] : '', TI_VAI_HD[lA] || ''], [inB.name || 'Người 2', tsB ? TI_VAI_TS[tsB] : '', TI_VAI_HD[lB] || '']].map(function (v) {
    return v[0] + ': hợp ' + [v[1], v[2]].filter(Boolean).join('; ') + '.'; });
  out.khuyen = [diem < 0 ? 'Ghi rõ vai trò, quyền quyết định và cách chia lợi nhuận bằng văn bản ngay từ đầu.' : 'Tận dụng điểm bổ trợ: mỗi người giữ mảng mình mạnh, họp định kỳ để thống nhất hướng đi.',
    'Người có hành mạnh là dụng thần của người kia nên giữ vai trò "tạo nguồn", người còn lại giữ vai trò "điều phối".', 'Chọn ngày ký kết, khai trương hợp tuổi cả hai (xem công cụ Chọn ngày tốt).'];
  return out;
}

/* ================= 6. ĐẶT TÊN CON ================= */
// Tên xếp ngũ hành theo nghĩa Hán-Việt (có trường phái xếp theo bộ thủ / số nét – kết quả có thể khác). g: nam | nu | ca
var TI_TEN = {
  'Mộc': [['Lâm', 'ca', 'rừng cây'], ['Tùng', 'nam', 'cây tùng, khí tiết'], ['Bách', 'nam', 'cây bách, bền vững'], ['Trúc', 'ca', 'cây trúc, ngay thẳng'], ['Mai', 'nu', 'hoa mai'], ['Lan', 'nu', 'hoa lan, thanh cao'],
    ['Cúc', 'nu', 'hoa cúc'], ['Đào', 'nu', 'hoa đào'], ['Liễu', 'nu', 'cây liễu, mềm mại'], ['Quế', 'ca', 'cây quế, thơm quý'], ['Thảo', 'nu', 'cỏ cây, hiếu thảo'], ['Xuân', 'ca', 'mùa xuân'],
    ['Diệp', 'nu', 'lá cây'], ['Chi', 'nu', 'cành cây, cỏ linh chi'], ['Sâm', 'nam', 'rừng rậm'], ['Vinh', 'nam', 'tươi tốt, vinh hiển'], ['Nhân', 'nam', 'nhân ái (Nhân thuộc Mộc trong ngũ thường)'], ['Kiệt', 'nam', 'tài giỏi xuất chúng'],
    ['Hoa', 'nu', 'bông hoa'], ['Phương', 'nu', 'hương thơm cỏ cây'], ['Thư', 'nu', 'sách (giấy từ cây)'], ['Đông', 'nam', 'phương Đông']],
  'Hỏa': [['Minh', 'ca', 'sáng suốt'], ['Quang', 'nam', 'ánh sáng'], ['Huy', 'nam', 'rực rỡ'], ['Nhật', 'nam', 'mặt trời'], ['Dương', 'ca', 'mặt trời, dương khí'], ['Hồng', 'ca', 'màu đỏ'],
    ['Đan', 'nu', 'màu son đỏ'], ['Hạ', 'nu', 'mùa hạ'], ['Viêm', 'nam', 'ngọn lửa'], ['Diệu', 'nu', 'rực rỡ, kỳ diệu'], ['Lễ', 'nam', 'lễ nghĩa (Lễ thuộc Hỏa)'], ['Chiêu', 'ca', 'sáng tỏ'],
    ['Tâm', 'ca', 'trái tim, tấm lòng'], ['Ánh', 'nu', 'ánh sáng'], ['Hy', 'ca', 'ánh sáng ban mai'], ['Nam', 'nam', 'phương Nam'], ['Hiển', 'nam', 'hiển đạt, sáng tỏ'], ['Thước', 'nam', 'sáng rỡ'], ['Linh', 'nu', 'linh hoạt, tinh anh'], ['Huân', 'nam', 'công lao, ấm áp']],
  'Thổ': [['Sơn', 'nam', 'núi'], ['Nham', 'nam', 'núi đá'], ['Thạch', 'nam', 'đá'], ['Điền', 'nam', 'ruộng đất'], ['Khôn', 'nam', 'đất, đức bao dung'], ['Kiên', 'nam', 'vững chắc'],
    ['Ngọc', 'nu', 'ngọc quý'], ['Bích', 'nu', 'ngọc bích'], ['Tín', 'nam', 'chữ tín (Tín thuộc Thổ)'], ['Trung', 'nam', 'trung tâm, trung thực'], ['Hoàng', 'nam', 'màu vàng, sắc của Thổ'], ['Thành', 'nam', 'thành trì, thành công'],
    ['Lĩnh', 'nam', 'đỉnh núi'], ['Nhạc', 'nam', 'núi cao'], ['Địa', 'nam', 'đất'], ['Châu', 'nu', 'ngọc trai'], ['Anh', 'ca', 'tinh hoa (thường xếp Thổ)'], ['An', 'ca', 'bình an, vững chãi'], ['Đức', 'nam', 'đạo đức, vững bền'], ['Bảo', 'nam', 'báu vật']],
  'Kim': [['Kim', 'ca', 'vàng, kim loại quý'], ['Ngân', 'nu', 'bạc'], ['Cương', 'nam', 'cứng rắn'], ['Thiết', 'nam', 'sắt, ý chí'], ['Chung', 'nam', 'chuông, trung thành'], ['Nhuệ', 'nam', 'sắc bén'],
    ['Kiếm', 'nam', 'thanh kiếm'], ['Nghĩa', 'nam', 'nghĩa khí (Nghĩa thuộc Kim)'], ['Thu', 'nu', 'mùa thu'], ['Bạch', 'ca', 'màu trắng'], ['Trâm', 'nu', 'cây trâm cài tóc'], ['Xuyến', 'nu', 'vòng đeo tay'],
    ['Đĩnh', 'nam', 'thỏi vàng bạc'], ['Tây', 'nam', 'phương Tây'], ['Phong', 'nam', 'mũi nhọn, sắc sảo'], ['Doanh', 'ca', 'đầy đủ, dư dật'], ['Hân', 'nu', 'vui vẻ (thường xếp Kim)'], ['Luyện', 'nam', 'rèn luyện kim loại']],
  'Thủy': [['Hải', 'nam', 'biển'], ['Giang', 'ca', 'sông lớn'], ['Hà', 'nu', 'sông'], ['Thủy', 'nu', 'nước'], ['Băng', 'nu', 'băng giá, trong sạch'], ['Tuyết', 'nu', 'tuyết trắng'],
    ['Sương', 'nu', 'giọt sương'], ['Vũ', 'nam', 'mưa'], ['Hồ', 'ca', 'hồ nước'], ['Trí', 'nam', 'trí tuệ (Trí thuộc Thủy)'], ['Khê', 'nu', 'suối nhỏ'], ['Tuyền', 'nu', 'suối nguồn'],
    ['Nguyệt', 'nu', 'mặt trăng'], ['Vân', 'nu', 'mây'], ['Uyên', 'nu', 'sâu sắc, uyên bác'], ['Hàn', 'nam', 'lạnh, mùa đông'], ['Bắc', 'nam', 'phương Bắc'], ['Lưu', 'nam', 'dòng chảy'],
    ['Hạo', 'nam', 'mênh mông'], ['Dung', 'nu', 'bao dung như nước'], ['Nhi', 'nu', 'trẻ nhỏ (thường xếp Thủy)'], ['Hưng', 'nam', 'hưng thịnh']]
};
var TI_TEN_MAP = null;
function tiTenMap_() {
  if (TI_TEN_MAP) return TI_TEN_MAP;
  TI_TEN_MAP = {};
  Object.keys(TI_TEN).forEach(function (h) { TI_TEN[h].forEach(function (t) { var k = t[0].toLowerCase(); if (!TI_TEN_MAP[k]) TI_TEN_MAP[k] = { hanh: h, g: t[1], y: t[2], ten: t[0] }; }); });
  return TI_TEN_MAP;
}
/** Thanh điệu: bằng (không dấu, huyền) / trắc (sắc, hỏi, ngã, nặng) */
function tiThanh_(tu) {
  var s = String(tu).normalize ? String(tu).normalize('NFD') : String(tu);
  return /[̣́̉̃]/.test(s) ? 'T' : 'B';
}
function tiChamTen_(ho, ten, gioi, bt, duongDoi, solar, vy, inputCon) {
  var M = tiTenMap_(), k = String(ten).trim().toLowerCase(), info = M[k], diem = 0, ghi = [];
  var dung = bt.goiY.dung, hy = bt.goiY.hy || [], ky = bt.goiY.ky || [];
  if (!info) ghi.push('Tên "' + ten + '" chưa có trong từ điển ngũ hành của hệ thống – chỉ chấm thần số và thanh điệu.');
  else {
    if (info.hanh === dung) { diem += 2; ghi.push('Tên thuộc hành ' + info.hanh + ' – đúng dụng thần của bé: bổ khuyết tốt nhất.'); }
    else if (hy.indexOf(info.hanh) >= 0) { diem += 1.5; ghi.push('Tên thuộc hành ' + info.hanh + ' – hỷ thần của bé: hỗ trợ tốt.'); }
    else if (ky.indexOf(info.hanh) >= 0) { diem -= 2; ghi.push('Tên thuộc hành ' + info.hanh + ' – hành bé nên tiết chế (kỵ thần): không nên chọn.'); }
    else ghi.push('Tên thuộc hành ' + info.hanh + ' – trung tính với lá số của bé.');
    if (info.g !== 'ca' && info.g !== gioi) { diem -= 0.5; ghi.push('Tên thường dùng cho ' + (info.g === 'nam' ? 'con trai' : 'con gái') + '.'); }
  }
  var hoTen = (String(ho || '').trim() + ' ' + String(ten).trim()).trim();
  var ts = thanSoHocLap(Object.assign({}, inputCon, { name: hoTen }), solar, vy), sm = tiTsGoc_(ts.suMenh || 0), dd = tiTsGoc_(duongDoi || 0);
  if (sm && dd) {
    var cung = TI_TS_NHOM.some(function (g) { return g.indexOf(sm) >= 0 && g.indexOf(dd) >= 0; });
    if (cung) { diem += 1; ghi.push('Thần số: số sứ mệnh của họ tên (' + sm + ') cùng nhóm với số đường đời (' + dd + ') – tên "cộng hưởng" với ngày sinh.'); }
    else ghi.push('Thần số: số sứ mệnh của họ tên (' + sm + ') khác nhóm số đường đời (' + dd + ') – không xấu, chỉ ít cộng hưởng hơn.');
  }
  var am = hoTen.split(/\s+/).map(tiThanh_).join('');
  if (/^B+$/.test(am)) { diem -= 0.5; ghi.push('Thanh điệu toàn bằng (' + am + ') – đọc lên hơi đều, thiếu điểm nhấn.'); }
  else if (/^T+$/.test(am)) { diem -= 0.5; ghi.push('Thanh điệu toàn trắc (' + am + ') – đọc lên hơi gắt.'); }
  else { diem += 0.5; ghi.push('Thanh điệu có bằng có trắc (' + am + ') – đọc lên hài hòa.'); }
  var d10 = chuanHoa10_(diem * 1.2);
  return { ten: String(ten).trim(), hoTen: hoTen, hanh: info ? info.hanh : '', y: info ? info.y : '', diem: d10, muc: d10 >= 7 ? 'Rất hợp' : d10 >= 5.8 ? 'Hợp' : d10 >= 4.5 ? 'Tạm được' : 'Chưa hợp', ghi: ghi };
}
function tiDatTen_(inputCon, ho, dsTen, mo) {
  var cb = tiCoBan_(inputCon), bt = cb.bt, vy = new Date().getFullYear(), solar = cb.I.solar, gioi = cb.male ? 'nam' : 'nu';
  var dd = thanSoHocLap(Object.assign({}, inputCon, { name: '' }), solar, vy).duongDoi;
  var ten = (dsTen || []).map(function (t) { return String(t || '').trim(); }).filter(Boolean).slice(0, 12);
  var out = { loai: 'dat_ten', mo: mo, gioi: gioi, dung: bt.goiY.dung, hy: bt.goiY.hy, ky: bt.goiY.ky, duongDoi: dd,
    ketLuan: 'Theo Bát Tự, bé ' + (gioi === 'nam' ? 'trai' : 'gái') + ' sinh ' + solar.day + '/' + solar.month + '/' + solar.year + ' cần bổ hành ' + bt.goiY.dung + (bt.goiY.hy.length > 1 ? ' (hỗ trợ: ' + bt.goiY.hy.slice(1).join(', ') + ')' : '') +
      '; nên tránh tên thuộc hành ' + (bt.goiY.ky.join(', ') || '—') + '.',
    coSo: ['Bổ khuyết ngũ hành: chọn tên thuộc dụng thần / hỷ thần trong Bát Tự của bé (hành lá số đang thiếu), tránh kỵ thần.',
      'Ngũ hành của tên xếp theo nghĩa Hán-Việt của chữ (ví dụ Hải – Thủy, Lâm – Mộc, Minh – Hỏa; Nhân – Mộc, Lễ – Hỏa, Tín – Thổ, Nghĩa – Kim, Trí – Thủy theo ngũ thường). Có trường phái xếp theo bộ thủ hoặc số nét chữ Hán – kết quả có thể khác.',
      'Thần số học: số sứ mệnh của họ tên nên cùng nhóm (1-5-7, 2-4-8, 3-6-9) với số đường đời của ngày sinh. Thanh điệu: tên có cả thanh bằng và trắc đọc lên hài hòa hơn.',
      'Giờ sinh chưa biết (dự sinh) thì trụ giờ chưa chính xác – nên xem lại sau khi bé chào đời.', TI_THAM_KHAO] };
  var cham = ten.map(function (t) { return tiChamTen_(ho, t, gioi, bt, dd, solar, vy, inputCon); });
  if (!mo) { out.cham = cham.slice(0, 1); out.soTen = cham.length; return out; }
  out.cham = cham.sort(function (a, b) { return b.diem - a.diem; });
  var goiY = [];
  [bt.goiY.dung].concat(bt.goiY.hy.slice(1)).forEach(function (h) {
    (TI_TEN[h] || []).forEach(function (t) { if (t[1] === 'ca' || t[1] === gioi) goiY.push(t[0]); });
  });
  out.goiY = goiY.slice(0, 40).map(function (t) { return tiChamTen_(ho, t, gioi, bt, dd, solar, vy, inputCon); }).sort(function (a, b) { return b.diem - a.diem; }).slice(0, 12);
  return out;
}

/* ================= API CHUNG ================= */
function tienIch(input, loai, thamSo, token) {
  var u = tkPhien_(token), toan = !!(u && ttToanQuyen_(u)), ts = thamSo || {};
  function co(khoa, ma) { if (toan) return true; if (!u) return false; var q = ttQuyen_(u, khoa); return !!(q[ma] || (q.tron_goi && TT_TRON_GOI.indexOf(ma) >= 0)); }
  var r;
  if (loai === 'xem_tuoi') r = tiXemTuoi_(tiCoBan_(input), co(ttKhoaLaSo_(input), 'xem_tuoi'), ts.muon);
  else if (loai === 'phong_thuy') r = tiPhongThuy_(tiCoBan_(input), co(ttKhoaLaSo_(input), 'phong_thuy'));
  else if (loai === 'chon_ngay') { var ma = ttMaPhan_('chon_ngay', (ts.viec || '') + '|' + (ts.thang || '')); r = tiChonNgay_(tiCoBan_(input), ts.viec, ts.thang, co(ttKhoaLaSo_(input), ma)); r.ma = ma; }
  else if (loai === 'hop_tac') {
    var a = input && input.a, b = input && input.b; if (!a || !b) throw new Error('Cần thông tin của cả hai người.');
    ['viewYear'].forEach(function (k) { a[k] = a[k] || new Date().getFullYear(); b[k] = b[k] || a[k]; });
    r = tiHopTac_(lapLaSoDayDu_(a), lapLaSoDayDu_(b), a, b, co(ttKhoaCapDoi_(a, b), 'hop_tac'));
  }
  else if (loai === 'dat_ten') r = tiDatTen_(input, ts.ho, ts.ten, co(ttKhoaLaSo_(input), 'dat_ten'));
  else throw new Error('Chưa có tiện ích "' + loai + '".');
  r.dangNhap = !!u; r.toanQuyen = toan;
  return r;
}

/* ================= 7. BẢN TIN VẬN THÁNG QUA EMAIL ================= */
var TI_SH_BAN_TIN = ['Tài khoản', 'Email', 'Lá số (JSON)', 'Hạn đến', 'Đăng ký lúc', 'Gửi gần nhất'];
function tiShBanTin_() {
  var ss = laySS_(), sh = ss.getSheetByName('BanTin');
  if (!sh) { sh = ss.insertSheet('BanTin'); sh.appendRow(TI_SH_BAN_TIN); sh.setFrozenRows(1); }
  return sh;
}
function dangKyBanTin(input, email, token) {
  var u = tkCan_(token); email = String(email || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Email chưa đúng.');
  if (!input || !input.year) throw new Error('Hãy lập lá số trước khi đăng ký.');
  var bg = ttBangGia_(), gia = ttToanQuyen_(u) ? 0 : (bg.phan.ban_tin ? bg.phan.ban_tin.xu : 99);
  return ttKhoa_(function () {
    var du = ttSoDu_(u.ten);
    if (du < gia) return { ok: false, thieu: gia - du, gia: gia, soDu: du };
    var moi = gia ? ttCong_(u.ten, -gia, 'Bản tin vận tháng 12 tháng – ' + email, 'ban_tin') : du;
    var han = new Date(); han.setFullYear(han.getFullYear() + 1);
    var hanStr = han.getFullYear() + '-' + (han.getMonth() < 9 ? '0' : '') + (han.getMonth() + 1) + '-' + (han.getDate() < 10 ? '0' : '') + han.getDate();
    var sh = tiShBanTin_(), clean = {}; ['name', 'gender', 'calendar', 'day', 'month', 'year', 'leap', 'hour', 'minute', 'place', 'longitude', 'tz'].forEach(function (k) { if (input[k] != null) clean[k] = input[k]; });
    sh.appendRow([u.ten, email, JSON.stringify(clean), "'" + hanStr, new Date(), '']);
    return { ok: true, soDu: ttToanQuyen_(u) ? null : moi, gia: gia, hanDen: hanStr };
  });
}
function dsBanTin(token) {
  var u = tkCan_(token), sh = tiShBanTin_(), last = sh.getLastRow(); if (last < 2) return [];
  return sh.getRange(2, 1, last - 1, 6).getDisplayValues().filter(function (r) { return r[0] === u.ten; }).map(function (r) {
    var i = {}; try { i = JSON.parse(r[2]); } catch (e) {} return { email: r[1], ten: i.name || '', hanDen: r[3], guiGanNhat: r[5] }; });
}
/** Nội dung email của một tháng cho một lá số */
function tiBanTinHtml_(input, y, m) {
  input.viewYear = y;
  var r = lapLaSoDayDu_(input), T = r.moRong && r.moRong.tongHop, cb = { tv: r.tuvi, bt: r.battu, I: r.tuvi.info, male: input.gender !== 'nu' };
  var th = T && T.thang ? T.thang.filter(function (t) { return +t.thang === +m; })[0] : null;
  var ky = tiChonNgay_(cb, 'ky_ket', y + '-' + m, true), xh = tiChonNgay_(cb, 'xuat_hanh', y + '-' + m, true);
  function li(a) { return a.map(function (x) { return '<li>' + x + '</li>'; }).join(''); }
  var h = '<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#1d2733"><h2 style="color:#0b4a5c">Thiên Cơ Các · Vận tháng ' + m + '/' + y + '</h2>' +
    '<p>Chào ' + (input.name || 'bạn') + ', đây là bản tin vận tháng dành riêng cho lá số của bạn.</p>';
  if (th) h += '<h3>Tổng quan tháng</h3><p>' + (th.danhGia || '') + (th.diem != null ? ' (điểm ' + th.diem + ')' : '') + (th.canChi ? ' – tháng ' + th.canChi : '') + '.</p>';
  h += '<h3>Ngày tốt để ký kết, giao dịch</h3><ul>' + li(ky.nenChon.map(function (d) { return d.thu + ' ' + d.ngay + ' (âm ' + d.am + ') – ' + d.muc + '; giờ tốt: ' + d.gio.slice(0, 3).join(', '); })) + '</ul>';
  h += '<h3>Ngày tốt để đi xa</h3><ul>' + li(xh.nenChon.slice(0, 3).map(function (d) { return d.thu + ' ' + d.ngay + ' – ' + d.huong; })) + '</ul>';
  var tranh = ky.ngay.filter(function (d) { return d.xau.some(function (x) { return /xung tuổi/.test(x); }); }).map(function (d) { return d.ngay; });
  if (tranh.length) h += '<h3>Ngày xung tuổi – nên tránh việc lớn</h3><p>' + tranh.join(', ') + '</p>';
  h += '<p style="color:#667;font-size:12px">' + TI_THAM_KHAO + '</p></div>';
  return h;
}
/** Gửi bản tin tháng cho mọi người còn hạn (trigger hằng tháng gọi) */
function guiBanTinThang() {
  var sh = tiShBanTin_(), last = sh.getLastRow(); if (last < 2) return 0;
  var t = tiGioVN_(), homNay = t.y + '-' + (t.m < 10 ? '0' : '') + t.m + '-' + (t.d < 10 ? '0' : '') + t.d, n = 0;
  var rows = sh.getRange(2, 1, last - 1, 6).getDisplayValues();
  rows.forEach(function (r, i) {
    if (!r[1] || String(r[3]).replace(/^'/, '') < homNay) return;
    try {
      var input = JSON.parse(r[2]);
      MailApp.sendEmail({ to: r[1], subject: 'Thiên Cơ Các · Vận tháng ' + t.m + '/' + t.y + ' của ' + (input.name || 'bạn'), htmlBody: tiBanTinHtml_(input, t.y, t.m) });
      sh.getRange(i + 2, 6).setValue("'" + homNay); n++;
    } catch (e) { sh.getRange(i + 2, 6).setValue('Lỗi: ' + String(e && e.message || e).slice(0, 80)); }
  });
  return n;
}
/** Chủ sở hữu chạy 1 lần (trong trình soạn thảo Apps Script) để bật gửi bản tin 7 giờ sáng ngày 1 hằng tháng */
function caiDatBanTin() {
  ScriptApp.getProjectTriggers().forEach(function (tr) { if (tr.getHandlerFunction() === 'guiBanTinThang') ScriptApp.deleteTrigger(tr); });
  ScriptApp.newTrigger('guiBanTinThang').timeBased().onMonthDay(1).atHour(7).create();
  Logger.log('✔ Đã bật gửi bản tin vận tháng: 7 giờ sáng ngày 1 hằng tháng.');
}

/* ================= 8. LUẬN GIẢI HẰNG NGÀY QUA EMAIL (hôm nay + ngày mai) =================
 * Chủ sở hữu / VIP đăng ký trên web (Tiện ích › Luận giải hằng ngày) cho lá số đang xem: lá số lưu trong sheet VanNgay,
 * không ghi vào mã. Chạy caiDatVanNgay() MỘT LẦN trong trình soạn thảo để bật gửi 6 giờ sáng mỗi ngày.
 * Văn viết cho người đọc: không nêu tên sao, thuật ngữ cổ có giải nghĩa, luôn kèm cách ứng xử. */
var TI_SH_VAN_NGAY = ['Tài khoản', 'Email', 'Lá số (JSON)', 'Đăng ký lúc', 'Gửi gần nhất', 'Trạng thái'];
var TI_VN_DG = {
  'Rất tốt': ['Ngày thuận', '#7d8a97', 'Mọi việc có xu hướng trôi chảy hơn thường lệ – hợp để chủ động: gặp gỡ, đề xuất, bắt đầu việc quan trọng.'],
  'Tốt': ['Ngày khá', '#9a7a55', 'Ngày nhìn chung thuận – việc đã định sẽ suôn sẻ, có thể tiến thêm một bước nhỏ.'],
  'Bình': ['Ngày bình', '#b8956a', 'Ngày bình ổn – hợp làm việc quen thuộc, theo kế hoạch; chưa nên thử điều mới mạo hiểm.'],
  'Kém': ['Ngày nên chậm', '#b8806a', 'Ngày dễ vướng chuyện nhỏ – nói chậm lại, kiểm tra kỹ giấy tờ và tiền bạc; việc lớn nên để sang ngày khác.']
};
var TI_VN_TT = {
  'Tỷ Kiên': 'Năng lượng ngày nghiêng về bạn bè, đồng nghiệp ngang hàng – hợp làm việc nhóm; dễ nảy sinh so bì, nên chia việc rõ ràng và nhường một bước.',
  'Kiếp Tài': 'Dễ phát sinh chi tiêu vì người khác hoặc bị tranh phần – hạn chế cho vay, góp vốn trong ngày; giữ ví chặt một chút.',
  'Thực Thần': 'Đầu óc thư thái, hợp sáng tạo, chia sẻ ý tưởng, ăn uống và nghỉ ngơi – tận hưởng nhưng đừng để sự lười kéo dài.',
  'Thương Quan': 'Ý tưởng nhiều, lời nói sắc – dễ va chạm với cấp trên hoặc người lớn tuổi; góp ý nhẹ nhàng, nghĩ hai lần trước khi nói.',
  'Thiên Tài': 'Có thể gặp cơ hội tiền bạc bất ngờ, giao tiếp rộng – vui nhưng giữ tay chi tiêu, đừng đầu tư theo cảm hứng.',
  'Chính Tài': 'Hợp việc tiền bạc đều đặn: thu nợ, lập ngân sách, ký hợp đồng nhỏ, chăm lo việc nhà.',
  'Thất Sát': 'Có thể gặp áp lực, việc gấp hoặc người khó tính – giữ bình tĩnh, làm từng việc một, tránh tranh cãi tay đôi.',
  'Chính Quan': 'Hợp việc giấy tờ, gặp cấp trên, làm việc với cơ quan – làm đúng quy trình sẽ được ghi nhận.',
  'Thiên Ấn': 'Hợp học hỏi, nghiên cứu, suy nghĩ một mình; dễ đa nghi – kiểm chứng trước khi kết luận về người khác.',
  'Chính Ấn': 'Dễ nhận được giúp đỡ, lời khuyên từ người lớn – hợp học tập, chăm sóc sức khỏe, nghỉ ngơi đúng giờ.'
};
function tiShVanNgay_() {
  var ss = laySS_(), sh = ss.getSheetByName('VanNgay');
  if (!sh) { sh = ss.insertSheet('VanNgay'); sh.appendRow(TI_SH_VAN_NGAY); sh.setFrozenRows(1); }
  return sh;
}
function tiInputSach_(input) {
  var o = {}; ['name', 'gender', 'calendar', 'day', 'month', 'year', 'leap', 'hour', 'minute', 'place', 'longitude', 'tz', 'tuHoaCanh', 'hoangDao'].forEach(function (k) { if (input[k] != null && input[k] !== '') o[k] = input[k]; });
  return o;
}
function tiNgayStr_(t) { return t.y + '-' + (t.m < 10 ? '0' : '') + t.m + '-' + (t.d < 10 ? '0' : '') + t.d; }
/** Đăng ký nhận luận giải hằng ngày (chủ sở hữu / VIP) – gửi ngay một bản thử */
function dangKyVanNgay(input, email, token) {
  var u = tkCan_(token); email = String(email || '').trim();
  if (!ttToanQuyen_(u)) throw new Error('Luận giải hằng ngày qua email hiện dành cho chủ sở hữu và thành viên VIP.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Email chưa đúng.');
  if (!input || !input.year) throw new Error('Hãy lập lá số trước khi đăng ký.');
  var sh = tiShVanNgay_(), last = sh.getLastRow(), clean = tiInputSach_(input);
  if (last >= 2) {
    var rows = sh.getRange(2, 1, last - 1, 2).getDisplayValues();
    for (var i = rows.length - 1; i >= 0; i--) if (rows[i][0] === u.ten && rows[i][1].toLowerCase() === email.toLowerCase()) sh.deleteRow(i + 2);
  }
  sh.appendRow([u.ten, email, JSON.stringify(clean), new Date(), '', 'bật']);
  var thu = '';
  try { tiGuiVanNgay_(email, clean, tiGioVN_()); thu = 'đã gửi bản thử'; } catch (e) { thu = 'chưa gửi được bản thử: ' + (e && e.message || e); }
  return { ok: true, email: email, ten: clean.name || '', thu: thu };
}
function huyVanNgay(email, token) {
  var u = tkCan_(token), sh = tiShVanNgay_(), last = sh.getLastRow(), n = 0; email = String(email || '').trim().toLowerCase();
  if (last < 2) return { ok: true, n: 0 };
  var rows = sh.getRange(2, 1, last - 1, 2).getDisplayValues();
  for (var i = rows.length - 1; i >= 0; i--) if (rows[i][0] === u.ten && (!email || rows[i][1].toLowerCase() === email)) { sh.deleteRow(i + 2); n++; }
  return { ok: true, n: n };
}
function dsVanNgay(token) {
  var u = tkCan_(token), sh = tiShVanNgay_(), last = sh.getLastRow(); if (last < 2) return [];
  return sh.getRange(2, 1, last - 1, 6).getDisplayValues().filter(function (r) { return r[0] === u.ten; }).map(function (r) {
    var i = {}; try { i = JSON.parse(r[2]); } catch (e) {} return { email: r[1], ten: i.name || '', guiGanNhat: r[4], trangThai: r[5] }; });
}
// Văn theo lĩnh vực: nhóm quan hệ can ngày với bạn → [câu, mức] cho Công việc, Tiền bạc, Tình cảm – gia đình, Sức khỏe
var TI_VN_NHOM = { 'Tỷ Kiên': 'ban', 'Kiếp Tài': 'ban', 'Thực Thần': 'xuat', 'Thương Quan': 'xuat', 'Thiên Tài': 'tai', 'Chính Tài': 'tai', 'Thất Sát': 'quan', 'Chính Quan': 'quan', 'Thiên Ấn': 'an', 'Chính Ấn': 'an' };
var TI_VN_LV_TEN = { cv: 'Công việc', tien: 'Tiền bạc', tc: 'Tình cảm – gia đình', sk: 'Sức khỏe' };
var TI_VN_LV = {
  ban: { cv: ['Hợp làm việc nhóm, phối hợp với đồng nghiệp ngang hàng; dễ nảy sinh so bì công lao – chia việc rõ ràng ngay từ đầu sẽ đỡ va chạm.', 0],
    tien: ['Dễ có khoản chi vì bạn bè, anh em hoặc phải chia phần – nếu giúp ai, chỉ đưa mức bạn sẵn lòng không lấy lại.', -1],
    tc: ['Bạn có xu hướng muốn làm theo ý mình hơn thường lệ – lắng nghe người thân thêm một nhịp sẽ giữ được không khí êm ấm.', 0],
    sk: ['Sức bền tốt, hợp vận động, chơi thể thao cùng bạn bè; chỉ cần tránh cố quá sức vì ganh đua.', 1] },
  xuat: { cv: ['Đầu óc nhiều ý tưởng, hợp sáng tạo, viết, trình bày, đề xuất cải tiến; lời nói dễ sắc – góp ý với cấp trên nên mềm mỏng và có số liệu đi kèm.', 0],
    tien: ['Hợp kiếm tiền từ tay nghề, sản phẩm, dịch vụ của chính mình; chi cho ăn uống, giải trí dễ vượt dự tính – đặt trước một mức trần.', 0],
    tc: ['Dễ bày tỏ cảm xúc, hợp hẹn hò, chơi với con cái, nói lời cảm ơn; tránh đùa quá trớn làm người kia chạnh lòng.', 1],
    sk: ['Tinh thần thư thái, ăn ngon miệng – giữ ăn uống điều độ, đừng thức khuya vì mải việc mình thích.', 0] },
  tai: { cv: ['Hợp việc có kết quả cụ thể: chốt số liệu, thu xếp hồ sơ, xử lý việc liên quan đến tiền và khách hàng.', 1],
    tien: ['Tiền bạc là chủ đề chính của ngày – rà lại các khoản thu chi, có thể có cơ hội kiếm thêm; vẫn cân nhắc trước khi xuống tiền theo cảm hứng.', 1],
    tc: ['Hợp chăm lo việc nhà, mua sắm nhỏ cho gia đình; với người thân, quan tâm bằng việc làm cụ thể sẽ được đón nhận hơn lời nói.', 0],
    sk: ['Dễ bận rộn mà quên nghỉ – đặt giờ ăn trưa và giờ đứng dậy đi lại để giữ sức.', 0] },
  quan: { cv: ['Công việc có thể dồn việc gấp hoặc yêu cầu từ cấp trên – giữ giấy tờ rõ ràng, trả lời bằng văn bản khi cần; tránh tranh cãi tay đôi.', 0],
    tien: ['Tiền bạc nên giữ ổn định: ưu tiên nộp, trả các khoản đến hạn, tránh khoản chi phát sinh ngoài kế hoạch.', 0],
    tc: ['Bạn có xu hướng mang áp lực công việc về nhà – nói rõ với người thân là mình đang mệt, họ sẽ thông cảm hơn là để im lặng.', -1],
    sk: ['Căng thẳng dễ dồn lên vai gáy, đầu – xen vài phút hít thở sâu, đi bộ nhẹ sau giờ làm.', -1] },
  an: { cv: ['Việc cần suy nghĩ kỹ, tra cứu, lên kế hoạch sẽ làm tốt hơn việc cần tốc độ; xin ý kiến người đi trước rồi hãy quyết.', 1],
    tien: ['Tiền bạc ổn định nhưng chưa phải ngày để mạo hiểm – hợp tìm hiểu, so sánh kỹ trước khi quyết định khoản chi lớn.', 0],
    tc: ['Dễ nhận được sự quan tâm từ cha mẹ, người lớn – gọi điện hỏi thăm sẽ làm ngày ấm hơn; tránh suy diễn ý người khác khi chưa hỏi rõ.', 1],
    sk: ['Hợp nghỉ ngơi, chăm sóc sức khỏe, khám định kỳ, ngủ đủ giấc.', 1] }
};
var TI_VN_CUNG_LV = { 'Quan Lộc': 'cv', 'Nô Bộc': 'cv', 'Thiên Di': 'cv', 'Phụ Mẫu': 'cv', 'Tài Bạch': 'tien', 'Điền Trạch': 'tien',
  'Phu Thê': 'tc', 'Tử Tức': 'tc', 'Huynh Đệ': 'tc', 'Tật Ách': 'sk', 'Mệnh': 'sk', 'Phúc Đức': 'sk' };
var TI_VN_NHA_LV = { 1: 'sk', 2: 'tien', 3: 'cv', 4: 'tc', 5: 'tc', 6: 'sk', 7: 'tc', 8: 'tien', 9: 'cv', 10: 'cv', 11: 'cv', 12: 'sk' };
var TI_VN_VIEC_NHO = { ban: 'Nhắn hỏi thăm một người bạn lâu chưa gặp.', xuat: 'Ghi lại một ý tưởng bạn đang ấp ủ, dù chỉ vài dòng.',
  tai: 'Ghi lại các khoản chi trong ngày, kể cả khoản nhỏ.', quan: 'Hoàn tất một việc giấy tờ còn tồn đọng.', an: 'Dành 15 phút đọc sách hoặc học một điều mới.' };
// Điều kiêng theo lịch cổ, nói bằng lời ngày nay (theo can và chi ngày)
var TI_VN_KY_CAN = ['không nên mở kho, xuất vốn hay hàng hóa lớn', 'không nên trồng cây, khởi đầu việc cần vun đắp lâu dài', 'không nên sửa bếp',
  'không nên cắt tóc', 'không nên nhận hay mua đất đai', 'không nên hủy hợp đồng, bội ước – dễ thiệt cho cả hai bên', 'không nên lắp đặt máy móc, khung dệt mới',
  'không nên muối, ủ đồ ăn', 'không nên tháo nước, sửa đường ống', 'không nên kiện tụng, tranh chấp – dễ thua lý'];
var TI_VN_KY_CHI = ['không nên xem bói, gieo quẻ', 'không nên nhận chức mới', 'không nên làm lễ cúng lớn', 'không nên đào giếng, khoan nước',
  'tránh khóc lóc, nói chuyện tang', 'không nên đi xa – dễ hao tiền', 'không nên lợp, sửa mái nhà', 'không nên bắt đầu loại thuốc mới (thuốc theo đơn bác sĩ vẫn uống đều)',
  'không nên kê, chuyển giường', 'không nên mở tiệc, say sưa', 'không nên ăn thịt chó', 'không nên cưới gả'];
var TI_VN_KY_BO = { can: { 0: /nhập kho/ }, chi: { 1: /nhậm chức/, 5: /xuất hành|đi xa/, 11: /cưới hỏi/ } };
var TI_VN_SO = { 1: 1, 2: 0, 3: 0.8, 4: -0.4, 5: 0.4, 6: 0.5, 7: -0.5, 8: 1.4, 9: -0.4 };
var TI_VN_THANG = { 'Tháng vàng': 'một tháng rất thuận – nên tận dụng để làm những việc đã ấp ủ', 'Thuận': 'một tháng nhìn chung thuận – việc đã định dễ suôn sẻ',
  'Bình': 'một tháng bình ổn – cứ theo kế hoạch là được', 'Cần giữ': 'một tháng nên giữ nhịp – làm chắc từng việc, chưa vội mở rộng',
  'Thận trọng': 'một tháng nên thận trọng – ưu tiên giữ gìn, việc lớn cân nhắc kỹ' };
function tiVanMuc_(x) { return x >= 1 ? 'thuận' : x <= -1 ? 'cần giữ' : 'bình'; }
/** Luận một ngày của lá số theo văn dễ hiểu (k = 0 hôm nay, 1 ngày mai) */
function tiVanMotNgay_(r, k) {
  var nv = r.chiTiet && r.chiTiet.nhatVan && r.chiTiet.nhatVan[k]; if (!nv) return null;
  var hv = (r.moRong && r.moRong.tongHop && r.moRong.tongHop.ngay || [])[k] || {}, bt = r.battu, I = r.tuvi.info;
  var m = String(nv.ngay).match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/), jd = jdFromDate(+m[1], +m[2], +m[3]), dc = mod10(jd + 9), dz = mod12(jd + 1);
  var dg = TI_VN_DG[hv.danhGia] || TI_VN_DG[nv.diem >= 1.5 ? 'Tốt' : nv.diem <= -1.5 ? 'Kém' : 'Bình'];
  var luu = [], nen = [], tranh = [], lv = { cv: [[], 0], tien: [[], 0], tc: [[], 0], sk: [[], 0] };
  function them(k2, cau, muc) { lv[k2][0].push(cau); lv[k2][1] += muc || 0; }
  var tt = thapThanTen_(bt.nhatChuCan, dc), nhom = TI_VN_NHOM[tt] || 'ban';
  if (TI_VN_TT[tt]) luu.push(TI_VN_TT[tt]);
  Object.keys(lv).forEach(function (k2) { them(k2, TI_VN_LV[nhom][k2][0], TI_VN_LV[nhom][k2][1]); });
  // Mảng nổi bật theo cung ngày
  var linh = LG_LINH_VUC[nv.cung], lvNoi = TI_VN_CUNG_LV[nv.cung];
  if (linh) {
    luu.push('Chuyện nổi bật trong ngày thường xoay quanh <b>' + linh + '</b>.');
    if (nv.diem >= 1) them(lvNoi, 'Đây là mảng nổi bật nhất trong ngày và đang có chiều thuận – chuyện ' + linh + ' dễ có tiến triển, tin vui.', 1);
    else if (nv.diem <= -1) them(lvNoi, 'Đây là mảng nổi bật nhất trong ngày và dễ có trục trặc nhỏ quanh chuyện ' + linh + ' – nói chậm, nghe nhiều, đừng quyết vội.', -1);
    else them(lvNoi, 'Đây là mảng được để ý nhiều nhất trong ngày (chuyện ' + linh + ') – dành thời gian cho nó sẽ có ích.', 0);
  }
  var khi = danhGiaVan_(CAN_HANH[dc], CHI_HANH[dz], bt.goiY.hy, bt.goiY.ky);
  if (khi === 'Đại cát' || khi === 'Cát') them('sk', 'Khí của ngày hợp với bạn – tinh thần sảng khoái, làm việc bền.', 1);
  else if (khi === 'Hơi kém' || khi === 'Cẩn trọng') them('sk', 'Khí của ngày không hợp lắm với bạn – dễ mệt, dễ nóng; giữ nhịp vừa phải, uống đủ nước, nghỉ đúng giờ.', -1);
  var q1 = lgQuanHeChi_(dz, I.yChi), q2 = lgQuanHeChi_(dz, bt.pillars[2].chi), xung = q1.indexOf('lục xung') >= 0;
  if (xung) {
    luu.unshift('Ngày <b>xung với tuổi</b> của bạn – tránh quyết định lớn, ký kết, đi xa; nếu buộc phải làm, chọn giờ đẹp bên dưới.'); tranh.push('quyết định lớn, ký kết');
    them('cv', 'Chưa nên chốt việc lớn hay ký kết trong ngày này; nếu buộc phải làm, đọc kỹ từng điều khoản và chọn giờ đẹp.', -1);
  } else if (q1.indexOf('tam hợp') >= 0 || q1.indexOf('lục hợp') >= 0) them('cv', 'Ngày hợp tuổi – thuận nhờ vả, gặp người mới, mở lời đề nghị.', 1);
  if (q2.indexOf('lục xung') >= 0) them('tc', 'Trong nhà dễ bất đồng ý kiến – nhường nhịn một chút, để chuyện khó nói sang lúc cả hai bình tĩnh.', -1);
  if ((HT_QUY_NHAN[bt.nhatChuCan] || []).indexOf(dz) >= 0) them('cv', 'Dễ gặp người sẵn lòng giúp – đừng ngại mở lời nhờ.', 1);
  var ty = LG_TRUC_Y[nv.truc]; if (ty) { nen.push(ty[0]); tranh.push(ty[1]); }
  var it = (nv.secs && nv.secs[0] && nv.secs[0].items) || [], trang = '', nha = 0, so = '';
  it.forEach(function (x) { var a = /^Chiêm tinh: .*nhà (\d+) – .*dồn vào (.+)\.$/.exec(x); if (a) { nha = +a[1]; trang = a[2]; } var b = /^Thần số: ngày cá nhân (\d) – (.+)\.$/.exec(x); if (b) so = b[2]; });
  if (trang) them(TI_VN_NHA_LV[nha] || 'tc', 'Cảm xúc và sự chú ý của bạn dồn vào ' + trang + '.', 0);
  if (so) nen.unshift(so.replace(/^ngày /, ''));
  // Điều kiêng theo lịch cổ: bỏ khỏi "Nên" những việc lịch cổ kiêng trong ngày
  var bo = [TI_VN_KY_BO.can[dc], TI_VN_KY_BO.chi[dz]].filter(Boolean);
  if (bo.length) nen = nen.map(function (x) { return x.split(/,\s*/).filter(function (v) { return !bo.some(function (re) { return re.test(v); }); }).join(', '); }).filter(Boolean);
  // Ngày xung tuổi hoặc ngày kém: hạ nhãn và bỏ các việc lớn khỏi mục "Nên" để lời khuyên không tự mâu thuẫn
  var kem = hv.danhGia === 'Kém';
  if (xung && (dg === TI_VN_DG['Rất tốt'] || dg === TI_VN_DG['Tốt'])) dg = TI_VN_DG['Bình'];
  if (xung || kem) {
    var LON = /khởi sự|ký kết|cưới hỏi|khai trương|xuất hành|nhậm chức|đi xa|đàm phán|nhập trạch|cầu tài/;
    nen = nen.map(function (x) { return x.split(/,\s*/).filter(function (v) { return !LON.test(v); }).join(', '); }).filter(Boolean);
  }
  // Ngày Hắc đạo: lịch cổ khuyên dời việc trọng đại nên không gợi ý các lễ lớn
  if (!nv.hoangDao) nen = nen.map(function (x) { return x.split(/,\s*/).filter(function (v) { return !/cưới hỏi|khai trương|nhập trạch|khởi công|an táng/.test(v); }).join(', '); }).filter(Boolean);
  if (!nen.length) nen.push('việc quen thuộc, việc nhỏ, nghỉ ngơi');
  var linhVuc = Object.keys(lv).map(function (k2) {
    var d = lv[k2][1]; if ((xung || kem) && d > 0) d = 0;
    return { k: k2, ten: TI_VN_LV_TEN[k2], muc: tiVanMuc_(d), noi: k2 === lvNoi, van: lv[k2][0] };
  });
  // Bốn hệ
  var tvM = /Rất tốt|^Tốt|Khá/.test(nv.danhGia) ? 1 : nv.danhGia === 'Trung bình' ? 0 : -1;
  var btM = khi === 'Đại cát' || khi === 'Cát' ? 1 : khi === 'Bình' ? 0 : -1;
  var ctM = !nha ? 0 : [1, 5, 9, 10, 11].indexOf(nha) >= 0 ? 1 : [6, 8, 12].indexOf(nha) >= 0 ? -1 : 0;
  var soM = TI_VN_SO[hv.so] == null ? 0 : TI_VN_SO[hv.so] >= 0.8 ? 1 : TI_VN_SO[hv.so] < 0 ? -1 : 0;
  var he = [['Tử Vi', tvM], ['Bát Tự', btM], ['Chiêm tinh', ctM], ['Thần số', soM]].map(function (x) { return { he: x[0], muc: tiVanMuc_(x[1]) }; });
  // Giờ theo buổi: hoàng đạo và không xung tuổi là giờ đẹp; giờ hợp hành của bạn được ưu tiên
  var gio = [], xungGio = mod12(I.yChi + 6), buoi = [], gioDep = '';
  for (var h = 0; h < 12; h++) if (LG_HOANG_DAO.indexOf(lgThanNgay_(dz, h)) >= 0) gio.push(GIO_CHI[h]);
  [['Sáng', [3, 4, 5]], ['Chiều', [6, 7, 8]], ['Tối', [9, 10, 11]]].forEach(function (b) {
    var tot = [], cham = [];
    b[1].forEach(function (h2) { (LG_HOANG_DAO.indexOf(lgThanNgay_(dz, h2)) >= 0 && h2 !== xungGio ? tot : cham).push(h2); });
    buoi.push({ ten: b[0], tot: tot.map(function (h2) { return GIO_CHI[h2]; }), cham: cham.map(function (h2) { return GIO_CHI[h2]; }) });
  });
  for (var h3 = 3; h3 < 12 && !gioDep; h3++) if (LG_HOANG_DAO.indexOf(lgThanNgay_(dz, h3)) >= 0 && h3 !== xungGio && bt.goiY.hy.indexOf(CHI_HANH[h3]) >= 0) gioDep = GIO_CHI[h3];
  for (var h4 = 3; h4 < 12 && !gioDep; h4++) if (LG_HOANG_DAO.indexOf(lgThanNgay_(dz, h4)) >= 0 && h4 !== xungGio) gioDep = GIO_CHI[h4];
  var tu = LG_TU.filter(function (x) { return x[0] === nv.tu; })[0];
  return { ngay: nv.ngay, thu: nv.thu, am: nv.am, canChi: nv.canChi, nhan: dg[0], mau: dg[1], tong: dg[2], hoangDao: nv.hoangDao, luu: luu, nen: nen, tranh: tranh, xung: xung,
    gio: gio, gioDep: gioDep, buoi: buoi, linhVuc: linhVuc, he: he, linh: linh || '', tuTot: tu ? !!tu[1] : null,
    ky: [TI_VN_KY_CAN[dc], TI_VN_KY_CHI[dz]], viecNho: TI_VN_VIEC_NHO[nhom], mauHop: bt.goiY.mau, soHop: bt.goiY.so,
    taiThan: LG_TAI_THAN[dc], hyThan: LG_HY_THAN[dc], sat: LG_SAT_PHUONG[dz % 4] };
}
/** Mốc trong tháng (dạng "d/m: …" hoặc "d/m–d/m: …") còn hiệu lực hôm nay hoặc rơi vào 7 ngày tới */
function tiVanMocGan_(dauMoc, t) {
  var jd0 = jdFromDate(t.d, t.m, t.y);
  function jdOf(s) { var p = s.split('/'), mm = +p[1], yy = t.y + (mm < t.m - 6 ? 1 : mm > t.m + 6 ? -1 : 0); return jdFromDate(+p[0], mm, yy); }
  return (dauMoc || []).map(function (x) {
    var a = /^(\d{1,2}\/\d{1,2})(?:–(\d{1,2}\/\d{1,2}))?: (.+)$/.exec(String(x)); if (!a) return null;
    var tu = jdOf(a[1]), den = a[2] ? jdOf(a[2]) : tu;
    if (a[2] ? (jd0 >= tu && jd0 <= den) : (tu >= jd0 && tu <= jd0 + 7)) return (a[2] ? 'Từ ' + a[1] + ' đến ' + a[2] : 'Ngày ' + a[1]) + ': ' + a[3] + '.';
    return null;
  }).filter(Boolean);
}
function tiVanNgayDuLieu_(input, t) {
  var i = JSON.parse(JSON.stringify(input)); i.viewYear = t.y; i.viewDate = tiNgayStr_(t);
  var r = lapLaSoDayDu_(i), T = r.moRong && r.moRong.tongHop, th = T && T.hoSoThang && T.hoSoThang.thang ? T.hoSoThang.thang.filter(function (x) { return x.nay; })[0] : null;
  var thang = null;
  if (th) {
    var nhip = (th.tom || []).filter(function (x) { return /^Nhịp tháng/.test(x); })[0] || '';
    thang = { t: th.thang, tu: th.tu, den: th.den, dg: th.danhGia, loi: TI_VN_THANG[th.danhGia] || '',
      deDen: (th.noiBat || []).map(function (x) { return x.ngan; }), canDe: (th.canPhong || []).map(function (x) { return x.ngan; }),
      nhip: nhip.replace(/^Nhịp tháng theo con số cá nhân: /, '').replace(/\.$/, ''), moc: tiVanMocGan_(th.dauMoc, t) };
  }
  return { ten: input.name || 'bạn', homNay: tiVanMotNgay_(r, 0), ngayMai: tiVanMotNgay_(r, 1), thang: thang };
}
/** Lời dặn "chuẩn bị từ tối nay" cho ngày mai – dựa trên nhãn ngày, mảng nổi bật và mảng cần giữ của ngày mai */
function tiVanChuanBi_(M) {
  if (!M) return [];
  var a = [];
  if (M.xung || M.nhan === 'Ngày nên chậm') a.push('Ngày mai nên đi chậm: tối nay sắp xếp sẵn việc, dời các cuộc hẹn quan trọng nếu được và ngủ sớm để có sức.');
  else if (M.nhan === 'Ngày thuận' || M.nhan === 'Ngày khá') a.push('Ngày mai thuận' + (M.linh ? ' cho chuyện ' + M.linh : '') + ': tối nay chuẩn bị sẵn ý chính, giấy tờ cần dùng' + (M.gioDep ? '; hẹn việc quan trọng vào khoảng ' + M.gioDep : '') + '.');
  else a.push('Ngày mai bình ổn: tối nay ghi ra ba việc chính cần làm, sáng mai làm lần lượt theo thứ tự là đủ.');
  var ck = M.linhVuc.filter(function (x) { return x.muc === 'cần giữ'; })[0];
  if (ck) a.push('Mảng cần giữ ngày mai là <b>' + ck.ten.toLowerCase() + '</b> – ' + ck.van[ck.van.length - 1].replace(/^[A-ZĐ]/, function (c) { return c.toLowerCase(); }));
  return a;
}
function tiVanNgayHtml_(D) {
  var MAU = { 'thuận': ['#e7efe6', '#4f7a52'], 'bình': ['#f3ece0', '#8a6d48'], 'cần giữ': ['#f6e3dc', '#a2583f'] };
  function chip(ten, muc) { var c = MAU[muc] || MAU['bình']; return '<span style="display:inline-block;margin:3px 6px 3px 0;padding:3px 10px;border-radius:12px;font-size:12px;background:' + c[0] + ';color:' + c[1] + '"><b>' + ten + '</b> · ' + muc + '</span>'; }
  function ds(a) { return a.map(function (x) { return '<li style="margin:4px 0">' + x + '</li>'; }).join(''); }
  function tieuDe(s) { return '<p style="margin:14px 0 6px;font-weight:700;color:#5a4632">' + s + '</p>'; }
  function khoi(N, day) {
    if (!N) return '';
    var h = '<div style="border:1px solid #eadfcd;border-radius:14px;padding:18px 20px;margin:16px 0;background:#fffdf9">' +
      '<div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#9a7a55">' + (day ? 'Hôm nay' : 'Ngày mai') + ' · ' + N.thu + ' ' + N.ngay + ' · âm lịch ' + N.am + ' · ngày ' + N.canChi + '</div>' +
      '<div style="font-size:24px;font-weight:700;margin:6px 0;color:' + N.mau + '">' + N.nhan + (N.xung ? ' <span style="font-size:13px;color:#b8806a">· xung tuổi</span>' : '') + '</div>' +
      '<p style="margin:0 0 8px">' + N.tong + '</p>' +
      '<div style="margin:6px 0 2px;font-size:12px;color:#7a6a58">Bốn hệ nhìn ngày này:</div><div>' + N.he.map(function (x) { return chip(x.he, x.muc); }).join('') + '</div>';
    h += tieuDe('Điều chính cần biết') + '<ul style="margin:0;padding-left:20px">' + ds(N.luu) + '</ul>';
    h += tieuDe('Theo từng lĩnh vực');
    N.linhVuc.forEach(function (L) {
      h += '<div style="margin:8px 0;padding:10px 12px;border-radius:10px;background:' + (L.noi ? '#fbf3e6' : '#faf7f2') + '">' +
        '<div>' + chip(L.ten, L.muc) + (L.noi ? '<span style="font-size:12px;color:#9a7a55">★ nổi bật trong ngày</span>' : '') + '</div>' +
        '<div style="font-size:14px;margin-top:4px">' + L.van.join(' ') + '</div></div>';
    });
    h += tieuDe('Lịch trong ngày') + '<ul style="margin:0;padding-left:20px">' + ds(N.buoi.map(function (b) {
      return '<b>' + b.ten + ':</b> ' + (b.tot.length ? 'giờ đẹp ' + b.tot.join(', ') + ' – hợp gặp gỡ, làm việc quan trọng' : 'không có giờ đẹp – hợp việc nhẹ, việc quen') +
        (b.cham.length && b.tot.length ? '; ' + b.cham.join(', ') + ' nên làm việc nhẹ' : '') + '.';
    })) + '</ul>' + (N.gioDep ? '<p style="margin:6px 0 0">⭐ <b>Giờ đẹp nhất cho bạn:</b> ' + N.gioDep + ' – dành cho việc quan trọng nhất trong ngày.</p>' : '');
    h += '<p style="margin:10px 0 2px"><b>Nên:</b> ' + N.nen.join('; ') + '.</p><p style="margin:2px 0"><b>Tránh:</b> ' + N.tranh.join('; ') + '.</p>' +
      '<p style="margin:2px 0"><b>Hướng tốt:</b> đi gặp đối tác, cầu tài về hướng ' + N.taiThan + '; việc vui về hướng ' + N.hyThan + '; tránh động thổ, xuất hành về hướng ' + N.sat + '.</p>';
    h += tieuDe('Điều kiêng theo lịch cổ') + '<p style="margin:0;font-size:14px">Lời kiêng truyền thống cho ngày ' + N.canChi + ': ' + N.ky.join('; ') + '. ' +
      'Đây là ngày ' + (N.hoangDao ? '<b>Hoàng đạo</b> (ngày tốt)' : '<b>Hắc đạo</b> (việc trọng đại như cưới hỏi, khai trương nên chọn ngày khác)') +
      (N.tuTot == null ? '' : '; theo vòng 28 ngày, ngày này ' + (N.tuTot ? 'thuận cho việc lớn' : 'việc lớn nên cân nhắc')) + '. <span style="color:#8f8576">(Mang tính tham khảo – chỉ cần lưu tâm với việc hệ trọng.)</span></p>';
    if (day) h += '<p style="margin:12px 0 0;padding:10px 12px;border-radius:10px;background:#f4f1ea">🌱 <b>Một việc nhỏ nên làm hôm nay:</b> ' + N.viecNho +
      ' Màu hợp với bạn: ' + N.mauHop.toLowerCase() + '; con số hợp: ' + N.soHop + '.</p>';
    else { var cb = tiVanChuanBi_(N); if (cb.length) h += tieuDe('🌙 Chuẩn bị từ tối nay') + '<ul style="margin:0;padding-left:20px">' + ds(cb) + '</ul>'; }
    return h + '</div>';
  }
  var t = D.thang, th = '';
  if (t) {
    th = '<div style="border:1px solid #eadfcd;border-radius:14px;padding:16px 20px;margin:16px 0;background:#faf7f2;font-size:14px">' +
      '<div style="font-weight:700;color:#5a4632">Bối cảnh tháng ' + t.t + ' âm lịch (' + t.tu + ' – ' + t.den + ')</div>' +
      '<p style="margin:6px 0">Với bạn, đây là ' + (t.loi || 'một tháng bình thường') + '.' +
      (t.deDen.length ? ' Việc dễ đến trong tháng: ' + t.deDen.join(', ') + '.' : '') +
      (t.canDe.length ? ' Nên để ý: ' + t.canDe.join(', ') + ' – giữ lịch nghỉ ngơi đều và đừng ôm quá nhiều việc cùng lúc.' : '') + '</p>' +
      (t.nhip ? '<p style="margin:6px 0">Nhịp của tháng: ' + t.nhip + '.</p>' : '') +
      (t.moc.length ? '<p style="margin:8px 0 2px;font-weight:700">Mốc đáng nhớ quanh mấy ngày này</p><ul style="margin:0;padding-left:20px">' + ds(t.moc) + '</ul>' : '') + '</div>';
  }
  return '<div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:auto;color:#2a2118;line-height:1.55">' +
    '<div style="padding:18px 20px;border-radius:14px;background:linear-gradient(120deg,#f7f5f0,#ecdcc4 45%,#e8b9a0);color:#2a2118">' +
    '<div style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#7a5a40">Thiên Cơ Các · Luận giải hằng ngày</div>' +
    '<div style="font-size:22px;font-weight:700;margin-top:4px">Chào ' + D.ten + ',</div><div>Đây là những điều nên biết cho hôm nay và ngày mai theo lá số của bạn.</div></div>' +
    khoi(D.homNay, true) + khoi(D.ngayMai, false) + th +
    '<p style="margin:16px 4px 0;font-size:12px;color:#8f8576">Tổng hợp từ Tử Vi, Bát Tự, Chiêm tinh, Thần số học và lịch cổ – mang tính tham khảo, giúp bạn chủ động sắp xếp việc trong ngày. Ngừng nhận: vào web › Tiện ích › Luận giải hằng ngày › Ngừng nhận.</p></div>';
}
function tiGuiVanNgay_(email, input, t) {
  var D = tiVanNgayDuLieu_(input, t), N = D.homNay;
  MailApp.sendEmail({ to: email, subject: 'Thiên Cơ Các · ' + (N ? N.thu + ' ' + N.ngay.replace(/\/\d{4}$/, '') + ': ' + N.nhan + (N.xung ? ' · xung tuổi' : '') : 'Luận giải hằng ngày'), htmlBody: tiVanNgayHtml_(D) });
  return D;
}
/** Trigger 6 giờ sáng gọi: gửi cho mọi người đang bật (mỗi email một lần mỗi ngày) */
function guiVanNgay() {
  var sh = tiShVanNgay_(), last = sh.getLastRow(); if (last < 2) return 0;
  var t = tiGioVN_(), homNay = tiNgayStr_(t), n = 0;
  sh.getRange(2, 1, last - 1, 6).getDisplayValues().forEach(function (r, i) {
    if (!r[1] || r[5] === 'tắt' || String(r[4]).replace(/^'/, '').indexOf(homNay) === 0) return;
    try { tiGuiVanNgay_(r[1], JSON.parse(r[2]), t); sh.getRange(i + 2, 5).setValue("'" + homNay); n++; }
    catch (e) { sh.getRange(i + 2, 5).setValue('Lỗi ' + homNay + ': ' + String(e && e.message || e).slice(0, 80)); }
  });
  return n;
}
/** Chủ sở hữu chạy 1 lần trong trình soạn thảo: bật gửi luận giải 6 giờ sáng mỗi ngày */
function caiDatVanNgay() {
  ScriptApp.getProjectTriggers().forEach(function (tr) { if (tr.getHandlerFunction() === 'guiVanNgay') ScriptApp.deleteTrigger(tr); });
  ScriptApp.newTrigger('guiVanNgay').timeBased().everyDays(1).atHour(6).create();
  var sh = tiShVanNgay_(), co = sh.getLastRow() - 1;
  Logger.log('✔ Đã bật luận giải hằng ngày lúc 6 giờ sáng. ' + (co > 0 ? 'Đang có ' + co + ' email đăng ký.' : 'Chưa có email nào: vào web, lập lá số của bạn, mở Tiện ích › Luận giải hằng ngày để đăng ký.'));
}
function tatVanNgay() {
  var n = 0; ScriptApp.getProjectTriggers().forEach(function (tr) { if (tr.getHandlerFunction() === 'guiVanNgay') { ScriptApp.deleteTrigger(tr); n++; } });
  Logger.log(n ? '✔ Đã tắt luận giải hằng ngày.' : 'Luận giải hằng ngày vốn chưa bật.');
}
