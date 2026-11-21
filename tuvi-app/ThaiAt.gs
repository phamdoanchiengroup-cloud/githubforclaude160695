/**
 * ============================================================
 *  ThaiAt.gs — THÁI ẤT THẦN KINH: LẬP BÀN (chỉ phần tính, chưa có văn luận, giao diện hay bán)
 *  Trường phái Thái Ất Thống Tông (chủ dự án chốt 21/11/2026), đề xuất: nghien-cuu/thai-at/00-de-xuat.md.
 *  - 4 kế: Tuế kế (năm), Nguyệt kế (tháng), Thời kế (giờ); Nhật kế ('ngay') chưa làm.
 *  - Tích niên = 10.153.917 + năm. Ranh năm Tuế kế = Lập xuân; tháng Nguyệt kế = tháng theo tiết (Dần = từ Lập xuân).
 *    (kintaiyi dùng năm/tháng âm lịch – khác biệt đã biết, kiểm riêng ở tests/doi-chieu-thai-at.js.)
 *  - Thời kế: tích giờ nối liên tục (ngày Giáp Tý giờ Tý = cục 1); từ Đông chí đến trước Hạ chí dương độn,
 *    từ Hạ chí đến trước Đông chí âm độn (kinh độ mặt trời kmKinhDoMatTroi_ – KyMon.gs). Giờ Việt Nam GMT+7,
 *    giờ Tý muộn (23–24h) tính sang ngày hôm sau (chuanHoaThoiGian_ – TuVi.gs, như Bát Tự, Kỳ Môn).
 *  - Mọi quy tắc tính theo công thức (mục 3 đề xuất), KHÔNG chép bảng kintaiyi (bảng có lỗi gõ, mục 4c).
 *  - Chọn theo phương án đề xuất: Ngũ Phúc, Đại Du theo Thống Tông; đại tướng khi toán 10/20/30/40 lấy 1 (Kim Kính);
 *    vòng 12 vị trí có cung giữa (Tứ Thần, Thiên Ất, Địa Ất, Trực Phù); "cung kề" = kề thật trên bàn;
 *    mệnh pháp đặt thần lên 12 cung bằng bàn Thời kế giờ sinh. Dương cửu / Bách lục hành hạn: đợt sau.
 *  Hàm chính: taLap_(opt), taMenh_(sinh), taNamCaNhan_(sinh, namXem), taDanhGia_(ban, loai, vai).
 *  Mỗi kết quả chỉ có mã máy + tên Hán-Việt + một câu giải nghĩa ngắn; văn luận dài viết ở ThaiAtVan.gs (sau).
 *  Kiểm thử: tests/thai-at.js, tests/doi-chieu-thai-at.js (dữ liệu tests/du-lieu/thai-at-doi-chieu.json, kintaiyi MIT).
 * ============================================================
 */

/* ---------- Hằng số bàn ---------- */
var TA_TICH_NIEN = 10153917;
var TA_TICH_NGAY_GOC = 708011105;   // tích ngày của 21/12/1900 (Mậu Thìn) theo Thống Tông (kintaiyi)
// Vòng 16 ô theo chiều thuận (chỉ số o = 0–15); o = 16 là cung giữa (Trung)
var TA_O = ['Tý', 'Sửu', 'Cấn', 'Dần', 'Mão', 'Thìn', 'Tốn', 'Tỵ', 'Ngọ', 'Mùi', 'Khôn', 'Thân', 'Dậu', 'Tuất', 'Càn', 'Hợi', 'Trung'];
var TA_THAN16 = ['Địa Chủ', 'Dương Đức', 'Hòa Đức', 'Lữ Thân', 'Cao Tùng', 'Thái Dương', 'Đại Quýnh', 'Đại Thần',
  'Đại Uy', 'Thiên Đạo', 'Đại Vũ', 'Vũ Đức', 'Thái Thốc', 'Âm Chủ', 'Âm Đức', 'Đại Nghĩa'];
// Số cung Thái Ất (không phải số Lạc Thư): 1 Càn, 2 Ly, 3 Cấn, 4 Chấn, 5 Trung, 6 Đoài, 7 Khôn, 8 Khảm, 9 Tốn
var TA_CUNG_TEN = [null, 'Càn', 'Ly', 'Cấn', 'Chấn', 'Trung', 'Đoài', 'Khôn', 'Khảm', 'Tốn'];
var TA_CUNG_HUONG = [null, 'Tây Bắc', 'Nam', 'Đông Bắc', 'Đông', 'Giữa', 'Tây', 'Tây Nam', 'Bắc', 'Đông Nam'];
var TA_CUNG_O = [null, 14, 8, 2, 4, 16, 12, 10, 0, 6];          // cung → ô
// Ô → cung (gian thần thuộc cung đứng ngay sau nó theo chiều thuận); ô 16 → 5
var TA_O_CUNG = [8, 3, 3, 4, 4, 9, 9, 2, 2, 7, 7, 6, 6, 1, 1, 8, 5];
var TA_CHI_O = [0, 1, 3, 4, 5, 7, 8, 9, 11, 12, 13, 15];        // chi → ô
// Ô → chi khi đặt lên 12 cung mệnh: 4 ô góc theo cặp Cấn Dần, Tốn Tỵ, Khôn Thân, Càn Hợi; ô giữa không đặt
var TA_O_CHI = [0, 1, 2, 2, 3, 4, 5, 5, 6, 7, 8, 8, 9, 10, 11, 11, null];
var TA_DOI = [null, 9, 8, 7, 6, 5, 4, 3, 2, 1];                 // cung đối diện (1↔9, 2↔8, 3↔7, 4↔6)
var TA_DUONG_CUNG = [1, 2, 3, 4, 6, 7, 8, 9], TA_AM_CUNG = [9, 8, 7, 6, 4, 3, 2, 1];
// Văn Xương: vòng 18 bước (dừng 2 lần ở Càn, Khôn khi dương; ở Tốn, Cấn khi âm) – mã ô
var TA_VX_DUONG = [11, 12, 13, 14, 14, 15, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10];
var TA_VX_AM = [3, 4, 5, 6, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0, 1, 2, 2];
// Vòng 12 vị trí của Tứ Thần, Thiên Ất, Địa Ất, Trực Phù (3 năm một vị trí): Càn, Ly, Cấn, Chấn, Trung, Đoài, Khôn, Khảm, Tốn, Tỵ, Thân, Dần
var TA_VONG12 = [14, 8, 2, 4, 16, 12, 10, 0, 6, 7, 11, 3];
var TA_NGUYEN = ['Giáp Tý', 'Bính Tý', 'Mậu Tý', 'Canh Tý', 'Nhâm Tý'];
var TA_TANG = ['Lý thiên', 'Lý địa', 'Lý nhân'];
var TA_KE = {
  nam: { ten: 'Tuế kế', giai: 'bàn theo năm – khí thế chung của cả năm' },
  thang: { ten: 'Nguyệt kế', giai: 'bàn theo tháng (tháng theo tiết khí)' },
  gio: { ten: 'Thời kế', giai: 'bàn theo giờ – dùng để hỏi một việc' }
};

/** Tên Hán-Việt + một câu giải nghĩa cho từng thần/điểm trên bàn (mã máy → {ten, giai, loai: cat|hung|trung}) */
var TA_THAN = {
  thai_at: { ten: 'Thái Ất', giai: 'vị thần chủ của bàn, tượng người đứng đầu, đi chậm qua 8 cung, không vào cung giữa', loai: 'trung' },
  van_xuong: { ten: 'Văn Xương (Thiên Mục)', giai: 'con mắt của phía Chủ – bên giữ thế, bên đang có sẵn vị trí', loai: 'cat' },
  thuy_kich: { ten: 'Thủy Kích', giai: 'con mắt của phía Khách – bên chủ động, bên đến mở lời', loai: 'hung' },
  dinh_muc: { ten: 'Định Mục', giai: 'điểm "chốt" dùng để tính Định toán – kết cục chung của việc', loai: 'trung' },
  thai_tue: { ten: 'Thái Tuế', giai: 'chi của kế đang xem (chi năm, chi tháng hoặc chi giờ)', loai: 'trung' },
  ke_than: { ten: 'Kế Thần', giai: 'thần dẫn đường để đặt Thủy Kích', loai: 'trung' },
  hop_than: { ten: 'Hợp Thần', giai: 'chi lục hợp với Thái Tuế – sự gắn kết, hòa hợp', loai: 'cat' },
  quan_co: { ten: 'Quân Cơ', giai: 'nền của người đứng đầu, việc lớn (30 năm một chi)', loai: 'cat' },
  than_co: { ten: 'Thần Cơ', giai: 'nền của người điều hành, người làm việc (3 năm một chi)', loai: 'cat' },
  dan_co: { ten: 'Dân Cơ', giai: 'nền của người thường, đời sống hằng ngày (1 năm một chi)', loai: 'cat' },
  ngu_phuc: { ten: 'Ngũ Phúc', giai: 'phúc lớn, nơi được che chở (45 năm một cung)', loai: 'cat' },
  dai_du: { ten: 'Đại Du', giai: 'biến động lớn, nơi dễ xáo trộn (36 năm một cung)', loai: 'hung' },
  tieu_du: { ten: 'Tiểu Du', giai: 'biến động nhỏ, đi theo nhịp Thái Ất (3 năm một cung)', loai: 'hung' },
  tu_than: { ten: 'Tứ Thần', giai: 'thần gây trở ngại thứ nhất (3 năm một vị trí)', loai: 'hung' },
  thien_at: { ten: 'Thiên Ất', giai: 'thần gây trở ngại thứ hai – trở ngại từ trên xuống', loai: 'hung' },
  dia_at: { ten: 'Địa Ất', giai: 'thần gây trở ngại thứ ba – trở ngại từ nền, từ dưới lên', loai: 'hung' },
  truc_phu: { ten: 'Trực Phù', giai: 'thần gây trở ngại thứ tư – việc vướng giấy tờ, phép tắc', loai: 'hung' },
  chu_dai: { ten: 'Chủ đại tướng', giai: 'sức chính của phía Chủ', loai: 'trung' },
  chu_tham: { ten: 'Chủ tham tướng', giai: 'sức phụ của phía Chủ', loai: 'trung' },
  khach_dai: { ten: 'Khách đại tướng', giai: 'sức chính của phía Khách', loai: 'trung' },
  khach_tham: { ten: 'Khách tham tướng', giai: 'sức phụ của phía Khách', loai: 'trung' },
  dinh_dai: { ten: 'Định đại tướng', giai: 'sức chính của kết cục chung', loai: 'trung' },
  dinh_tham: { ten: 'Định tham tướng', giai: 'sức phụ của kết cục chung', loai: 'trung' }
};
var TA_THAN_THU_TU = ['thai_at', 'van_xuong', 'thuy_kich', 'dinh_muc', 'thai_tue', 'ke_than', 'hop_than', 'quan_co', 'than_co', 'dan_co',
  'ngu_phuc', 'dai_du', 'tieu_du', 'tu_than', 'thien_at', 'dia_at', 'truc_phu', 'chu_dai', 'chu_tham', 'khach_dai', 'khach_tham', 'dinh_dai', 'dinh_tham'];

/** Cách cục: mã → {ten, giai, muc: cat|hung|trung} */
var TA_CACH = {
  yem: { ten: 'Yểm (đè)', giai: 'Thủy Kích cùng chỗ Thái Ất – sức ép từ bên ngoài đè lên người giữ thế', muc: 'hung' },
  kich: { ten: 'Kích (đánh)', giai: 'Thủy Kích sát bên Thái Ất – dễ bị công kích, cạnh tranh trực diện', muc: 'hung' },
  tu: { ten: 'Tù (giam)', giai: 'Văn Xương hoặc một tướng cùng chỗ Thái Ất – bị trói tay, khó làm chủ', muc: 'hung' },
  bach: { ten: 'Bách (ép sát)', giai: 'đứng sát bên Thái Ất – áp lực đến gần (sát ô: nhanh và nặng; sát cung: chậm và nhẹ)', muc: 'hung' },
  cach: { ten: 'Cách (ngăn)', giai: 'Thủy Kích hoặc tướng khách ở cung đối diện Thái Ất – trên dưới không thông', muc: 'hung' },
  doi: { ten: 'Đối (đối mặt)', giai: 'Văn Xương ở cung đối diện Thái Ất – người thân tín dễ hai lòng', muc: 'hung' },
  quan: { ten: 'Quan (khóa)', giai: 'tướng chủ và tướng khách cùng một cung – hai bên giằng co', muc: 'hung' },
  de_hiep: { ten: 'Đề hiệp (kẹp)', giai: 'Văn Xương và Thủy Kích ở hai bên Thái Ất – bị kẹp giữa hai phía', muc: 'hung' },
  chu_hiep: { ten: 'Chủ hiệp', giai: 'hai tướng chủ đứng hai bên Thái Ất – phía Chủ vây quanh người đứng đầu', muc: 'hung' },
  khach_hiep: { ten: 'Khách hiệp', giai: 'hai tướng khách đứng hai bên Thái Ất – phía Khách vây quanh người đứng đầu', muc: 'hung' },
  tu_quach_co: { ten: 'Tứ quách cố', giai: 'bốn bề bị vây chặt – thời để giữ, không phải để mở rộng', muc: 'hung' },
  tu_quach_do: { ten: 'Tứ quách đỗ', giai: 'bốn bề bị chắn – lối ra tạm đóng, nên chờ thời', muc: 'hung' },
  tuong_giua: { ten: 'Tướng ở giữa', giai: 'đại tướng ở cung giữa – bên đó giữ, chưa ra tay', muc: 'trung' },
  hoa_thuan: { ten: 'Âm dương hòa thuận', giai: 'không có thế đè, ép, vây nào – thế tốt', muc: 'cat' },
  toan_doan: { ten: 'Đoản toán (toán ngắn)', giai: 'toán dưới 10 – đà ngắn, nên làm nhanh gọn', muc: 'hung' },
  vo_thien: { ten: 'Vô thiên (thiếu trời)', giai: 'toán dưới 10 – thời chưa giúp', muc: 'hung' },
  vo_dia: { ten: 'Vô địa (thiếu đất)', giai: 'hàng đơn vị dưới 5 – nền móng (tiền, người, giấy tờ) còn yếu', muc: 'hung' },
  vo_nhan: { ten: 'Vô nhân (thiếu người)', giai: 'hàng đơn vị bằng 0 – thiếu người đồng hành', muc: 'hung' },
  tam_tai: { ten: 'Tam tài túc số', giai: 'toán trên 10, hàng đơn vị trên 5 – đủ trời, đất, người', muc: 'cat' },
  truong_toan: { ten: 'Trường toán (toán dài)', giai: 'toán từ 10 trở lên – việc có sức bền', muc: 'cat' },
  don_duong: { ten: 'Đơn dương', giai: 'toán một chữ số lẻ – dương đơn độc, bất lợi cho bên đó', muc: 'hung' },
  don_am: { ten: 'Đơn âm', giai: 'toán một chữ số chẵn – âm đơn độc', muc: 'trung' },
  trung_duong: { ten: 'Trùng dương', giai: 'hai chữ số đều lẻ – quá cứng, không hòa', muc: 'hung' },
  trung_am: { ten: 'Trùng âm', giai: 'hai chữ số đều chẵn – quá mềm, không hòa', muc: 'hung' },
  thuong_hoa: { ten: 'Thượng hòa', giai: 'con số hòa hợp bậc cao', muc: 'cat' },
  thu_hoa: { ten: 'Thứ hòa', giai: 'con số hòa hợp bậc vừa', muc: 'cat' },
  ha_hoa: { ten: 'Hạ hòa', giai: 'con số hòa hợp bậc thấp', muc: 'cat' }
};
var TA_HOA = { 14: 'thuong_hoa', 18: 'thuong_hoa', 23: 'thu_hoa', 29: 'thu_hoa', 32: 'thu_hoa', 12: 'ha_hoa', 16: 'ha_hoa', 27: 'ha_hoa', 34: 'ha_hoa', 38: 'ha_hoa' };
var TA_BEN = { chu: 'phía Chủ (giữ thế)', khach: 'phía Khách (chủ động)', dinh: 'kết cục chung', chung: 'cả hai phía' };
var TA_NGHIENG = {
  chu_ro: 'Thế nghiêng rõ về phía Chủ (bên giữ thế)', chu: 'Thế hơi nghiêng về phía Chủ',
  giang_co: 'Hai phía giằng co', khach: 'Thế hơi nghiêng về phía Khách (bên chủ động)', khach_ro: 'Thế nghiêng rõ về phía Khách'
};

/* ---------- Hàm phụ ---------- */
function taR1_(x, m) { var r = x % m; return r === 0 ? m : r; }
function taMod_(x, m) { return ((x % m) + m) % m; }
/** Mô tả một vị trí trên bàn từ mã ô (0–16) */
function taViTri_(o) {
  var c = TA_O_CUNG[o];
  return { o: o, ten: TA_O[o], than16: o < 16 ? TA_THAN16[o] : null, cung: c, cungTen: TA_CUNG_TEN[c], huong: TA_CUNG_HUONG[c], laCung: o === 16 || o % 2 === 0 };
}
function taViTriCung_(c) { return taViTri_(TA_CUNG_O[c]); }
/** Toán: đi thuận từ ô khởi tới cung Thái Ất, cộng số các cung chính đi qua (không cộng cung Thái Ất) */
function taToan_(o, ty) {
  var oTy = TA_CUNG_O[ty];
  if (o === oTy) return ty;
  var s = 0, p = o;
  if (o % 2 === 1) { s = 1; p = (o + 1) % 16; }
  while (p !== oTy) { if (p % 2 === 0) s += TA_O_CUNG[p]; p = (p + 1) % 16; }
  return s || 1;
}
/** Đại tướng = hàng đơn vị của toán (10/20/30/40 lấy 1 – Kim Kính); tham tướng = đại × 3 lấy hàng đơn vị (0 → 5) */
function taDaiTuong_(s) { var d = s % 10; return d === 0 ? 1 : d; }
function taThamTuong_(d) { var t = (d * 3) % 10; return t === 0 ? 5 : t; }
/** Các loại của một con số toán (mã TA_CACH) */
function taLoaiToan_(s) {
  var ds = [], dv = s % 10, ch = Math.floor(s / 10);
  if (s < 10) { ds.push('toan_doan', 'vo_thien'); ds.push(s % 2 ? 'don_duong' : 'don_am'); }
  else ds.push('truong_toan');
  if (dv < 5) ds.push('vo_dia');
  if (dv === 0) ds.push('vo_nhan');
  if (s > 10 && dv > 5) ds.push('tam_tai');
  if (s >= 10 && dv !== 0) {
    if (TA_HOA[s]) ds.push(TA_HOA[s]);
    else if (ch % 2 === 1 && dv % 2 === 1) ds.push('trung_duong');
    else if (ch % 2 === 0 && dv % 2 === 0) ds.push('trung_am');
  }
  return ds;
}
/** Quan hệ một ô với cung Thái Ất: cung | than_bach (sát ô) | cung_bach (sát cung) | doi | trung | xa; phía noi (sau, nghịch) / ngoai (trước, thuận) */
function taQuanHe_(o, ty) {
  if (o === 16) return { k: 'trung' };
  var d = taMod_(o - TA_CUNG_O[ty], 16); if (d > 8) d -= 16;
  if (d === 0) return { k: 'cung', d: 0 };
  if (d === 1 || d === -1) return { k: 'than_bach', phia: d < 0 ? 'noi' : 'ngoai', d: d };
  if (d === 2 || d === -2 || d === -3) return { k: 'cung_bach', phia: d < 0 ? 'noi' : 'ngoai', d: d };
  if (TA_O_CUNG[o] === TA_DOI[ty]) return { k: 'doi', d: d };
  return { k: 'xa', d: d };
}

/* ---------- Lập bàn ---------- */
/**
 * Dựng bàn từ tích số (hàm thuần – kiểm thử gọi thẳng để đối chiếu).
 * T: tích số của kế; duong: true/false; tue: chi Thái Tuế của kế (0–11).
 */
function taBan_(T, duong, tue) {
  var cuc = taR1_(T, 72);
  var ty = (duong ? TA_DUONG_CUNG : TA_AM_CUNG)[Math.floor((taR1_(cuc, 24) - 1) / 3)];
  var oVx = (duong ? TA_VX_DUONG : TA_VX_AM)[taR1_(cuc, 18) - 1];
  var keChi = taMod_((duong ? 2 : 8) - tue, 12), hopChi = taMod_(1 - tue, 12);
  var oTk = taMod_(oVx + 2 - TA_CHI_O[keChi], 16);
  var oDm = taMod_(oVx + TA_CHI_O[tue] - TA_CHI_O[hopChi], 16);
  function phia(o) {
    var s = taToan_(o, ty), d = taDaiTuong_(s);
    return { so: s, daiTuong: d, thamTuong: taThamTuong_(d), loai: taLoaiToan_(s) };
  }
  var toan = { chu: phia(oVx), khach: phia(oTk), dinh: phia(oDm) };
  var q12 = Math.floor((taR1_(T, 36) - 1) / 3);
  var vt = {
    thai_at: TA_CUNG_O[ty], van_xuong: oVx, thuy_kich: oTk, dinh_muc: oDm,
    thai_tue: TA_CHI_O[tue], ke_than: TA_CHI_O[keChi], hop_than: TA_CHI_O[hopChi],
    quan_co: TA_CHI_O[(6 + Math.floor((taR1_(T + 250, 360) - 1) / 30)) % 12],
    than_co: TA_CHI_O[(6 + Math.floor((taR1_(T + 250, 36) - 1) / 3)) % 12],
    dan_co: TA_CHI_O[(10 + taR1_(T + 250, 12) - 1) % 12],
    ngu_phuc: TA_CUNG_O[[1, 3, 9, 7, 5][Math.floor((taR1_(T + 250, 225) - 1) / 45)]],
    dai_du: TA_CUNG_O[[7, 8, 9, 1, 2, 3, 4, 6][Math.floor((taR1_(T + 34, 288) - 1) / 36)]],
    tieu_du: TA_CUNG_O[TA_DUONG_CUNG[Math.floor((taR1_(T, 24) - 1) / 3)]],
    tu_than: TA_VONG12[q12], thien_at: TA_VONG12[(q12 + 5) % 12], dia_at: TA_VONG12[(q12 + 8) % 12], truc_phu: TA_VONG12[(q12 + 4) % 12],
    chu_dai: TA_CUNG_O[toan.chu.daiTuong], chu_tham: TA_CUNG_O[toan.chu.thamTuong],
    khach_dai: TA_CUNG_O[toan.khach.daiTuong], khach_tham: TA_CUNG_O[toan.khach.thamTuong],
    dinh_dai: TA_CUNG_O[toan.dinh.daiTuong], dinh_tham: TA_CUNG_O[toan.dinh.thamTuong]
  };
  var than = {};
  TA_THAN_THU_TU.forEach(function (ma) {
    var x = taViTri_(vt[ma]); x.ma = ma; x.ten = TA_THAN[ma].ten; x.viTri = TA_O[vt[ma]]; x.giai = TA_THAN[ma].giai; x.loai = TA_THAN[ma].loai;
    than[ma] = x;
  });
  // 17 ô cho giao diện: mỗi ô kèm danh sách mã thần đứng ở đó
  var o17 = [];
  for (var o = 0; o <= 16; o++) { var v = taViTri_(o); v.than = []; o17.push(v); }
  TA_THAN_THU_TU.forEach(function (ma) { o17[vt[ma]].than.push(ma); });

  var ban = {
    phep: 'Thái Ất Thống Tông', muiGio: 'GMT+7',
    tich: T, cuc: cuc, don: duong ? 'duong' : 'am', donTen: duong ? 'Dương độn' : 'Âm độn',
    cucTen: (duong ? 'Dương' : 'Âm') + ' độn cục ' + cuc,
    tang: TA_TANG[(cuc - 1) % 3], ky: Math.floor((T % 360) / 60) + 1,
    nguyen: TA_NGUYEN[Math.floor((taR1_(T, 360) - 1) / 72)] + ' nguyên',
    thaiAt: { cung: ty, cungTen: TA_CUNG_TEN[ty], huong: TA_CUNG_HUONG[ty], o: TA_CUNG_O[ty], namThu: taR1_(cuc, 3),
      phe: [1, 8, 3, 4].indexOf(ty) >= 0 ? 'noi' : 'ngoai',
      pheGiai: [1, 8, 3, 4].indexOf(ty) >= 0 ? 'Thái Ất ở nội cung – trợ phía Chủ' : 'Thái Ất ở ngoại cung – trợ phía Khách' },
    toan: toan, than: than, o: o17
  };
  ban.cach = taCach_(ban);
  ban.soSanh = taSoSanh_(ban);
  return ban;
}

/** Danh sách cách cục của bàn: [{ma, ten, giai, muc, ben, ai?, kieu?, phia?}] */
function taCach_(ban) {
  var ty = ban.thaiAt.cung, T = ban.than, ds = [];
  function them(ma, ben, x) {
    var c = { ma: ma, ten: TA_CACH[ma].ten, giai: TA_CACH[ma].giai, muc: TA_CACH[ma].muc, ben: ben };
    if (x) for (var k in x) c[k] = x[k];
    ds.push(c);
  }
  var qVx = taQuanHe_(T.van_xuong.o, ty), qTk = taQuanHe_(T.thuy_kich.o, ty), qDm = taQuanHe_(T.dinh_muc.o, ty);
  if (qTk.k === 'cung') them('yem', 'chu', { ai: 'thuy_kich' });
  if (qTk.k === 'than_bach' || qTk.k === 'cung_bach') them('kich', 'chu', { ai: 'thuy_kich', kieu: qTk.k === 'than_bach' ? 'o' : 'cung', phia: qTk.phia });
  if (qVx.k === 'cung') them('tu', 'chu', { ai: 'van_xuong' });
  if (qVx.k === 'than_bach' || qVx.k === 'cung_bach') them('bach', 'chu', { ai: 'van_xuong', kieu: qVx.k === 'than_bach' ? 'o' : 'cung', phia: qVx.phia });
  if (qDm.k === 'than_bach' || qDm.k === 'cung_bach') them('bach', 'dinh', { ai: 'dinh_muc', kieu: qDm.k === 'than_bach' ? 'o' : 'cung', phia: qDm.phia });
  var tuong = [['chu_dai', 'chu'], ['chu_tham', 'chu'], ['khach_dai', 'khach'], ['khach_tham', 'khach'], ['dinh_dai', 'dinh'], ['dinh_tham', 'dinh']];
  tuong.forEach(function (x) {
    var o = T[x[0]].o; if (o === 16) return;
    var q = taQuanHe_(o, ty);
    if (q.k === 'cung') them('tu', x[1], { ai: x[0] });
    else if (q.k === 'cung_bach') them('bach', x[1], { ai: x[0], kieu: 'cung', phia: q.phia });
  });
  if (qTk.k === 'doi') them('cach', 'chung', { ai: 'thuy_kich' });
  ['khach_dai', 'khach_tham'].forEach(function (a) { if (T[a].o !== 16 && taQuanHe_(T[a].o, ty).k === 'doi') them('cach', 'chung', { ai: a }); });
  if (qVx.k === 'doi') them('doi', 'chu', { ai: 'van_xuong' });
  ['chu_dai', 'chu_tham'].forEach(function (a) {
    ['khach_dai', 'khach_tham'].forEach(function (b) { if (T[a].o !== 16 && T[a].o === T[b].o) them('quan', 'chung', { ai: a + '+' + b }); });
  });
  var hai = function (q1, q2) { return q1.d != null && q2.d != null && q1.k !== 'cung' && q2.k !== 'cung' && q1.k !== 'doi' && q2.k !== 'doi' && q1.k !== 'xa' && q2.k !== 'xa' && q1.d * q2.d < 0; };
  if (hai(qVx, qTk)) them('de_hiep', 'chung', { ai: 'van_xuong+thuy_kich' });
  if (T.chu_dai.o !== 16 && T.chu_tham.o !== 16 && hai(taQuanHe_(T.chu_dai.o, ty), taQuanHe_(T.chu_tham.o, ty))) them('chu_hiep', 'chu', { ai: 'chu_dai+chu_tham' });
  if (T.khach_dai.o !== 16 && T.khach_tham.o !== 16 && hai(taQuanHe_(T.khach_dai.o, ty), taQuanHe_(T.khach_tham.o, ty))) them('khach_hiep', 'khach', { ai: 'khach_dai+khach_tham' });
  var cd = ban.toan.chu.daiTuong, kd = ban.toan.khach.daiTuong;
  if ((qVx.k === 'cung' && cd !== 5 && cd === ban.toan.chu.thamTuong) || (qTk.k === 'cung' && kd !== 5 && kd === cd)) them('tu_quach_co', 'chung');
  if ((qVx.k === 'cung' || qTk.k === 'cung') && cd !== 5 && kd !== 5 && TA_DOI[cd] === kd) them('tu_quach_do', 'chung');
  if (cd === 5) them('tuong_giua', 'chu', { ai: 'chu_dai' });
  if (kd === 5) them('tuong_giua', 'khach', { ai: 'khach_dai' });
  if (!ds.some(function (c) { return c.muc === 'hung'; })) them('hoa_thuan', 'chung');
  ['chu', 'khach', 'dinh'].forEach(function (b) { ban.toan[b].loai.forEach(function (ma) { them(ma, b, { so: ban.toan[b].so }); }); });
  return ds;
}

/**
 * So chủ và khách (mục 3m đề xuất): mỗi bên 5 yếu tố +1/0/−1 – độ dài toán, tam tài, hòa, tướng, nhiều/ít;
 * thêm Thái Ất nội/ngoại cung (+1 cho bên được trợ) và cách đè/ép phía Chủ (−1). Chênh ≥2 nghiêng rõ, 1 hơi nghiêng, 0 giằng co.
 */
function taSoSanh_(ban) {
  var c = ban.cach, ty = ban.thaiAt.cung;
  function co(ma, ben) { return c.some(function (x) { return x.ma === ma && (!ben || x.ben === ben); }); }
  function diem(b) {
    var t = ban.toan[b], ly = [], s = 0;
    function y(k, d) { if (d) { ly.push({ k: k, diem: d }); s += d; } }
    y('do_dai', t.so >= 10 ? 1 : -1);
    y('tam_tai', t.loai.indexOf('tam_tai') >= 0 ? 1 : t.loai.indexOf('vo_dia') >= 0 ? -1 : 0);
    y('hoa', t.loai.some(function (x) { return /_hoa$/.test(x); }) ? 1 : t.loai.indexOf('trung_duong') >= 0 || t.loai.indexOf('trung_am') >= 0 ? -1 : 0);
    var phamTuong = c.some(function (x) { return (x.ma === 'tu' || x.ma === 'bach') && (x.ai === b + '_dai' || x.ai === b + '_tham'); });
    y('tuong', t.daiTuong === 5 || phamTuong ? -1 : 1);
    return { diem: s, ly: ly };
  }
  var chu = diem('chu'), khach = diem('khach'), kc = ban.toan.khach.so, cc = ban.toan.chu.so;
  if (kc < cc) { chu.diem += 1; chu.ly.push({ k: 'khach_it_toan', diem: 1 }); }
  else if (kc > cc) { khach.diem += 1; khach.ly.push({ k: 'khach_nhieu_toan', diem: 1 }); }
  if ([1, 8, 3, 4].indexOf(ty) >= 0) { chu.diem += 1; chu.ly.push({ k: 'thai_at_noi', diem: 1 }); }
  else { khach.diem += 1; khach.ly.push({ k: 'thai_at_ngoai', diem: 1 }); }
  if (co('yem') || co('kich') || co('doi') || c.some(function (x) { return x.ma === 'tu' && x.ai === 'van_xuong'; })) {
    chu.diem -= 1; chu.ly.push({ k: 'chu_bi_ep', diem: -1 });
  }
  var lech = chu.diem - khach.diem;
  var ng = lech >= 2 ? 'chu_ro' : lech === 1 ? 'chu' : lech === 0 ? 'giang_co' : lech === -1 ? 'khach' : 'khach_ro';
  return { chu: chu, khach: khach, lech: lech, nghieng: ng, nghiengTen: TA_NGHIENG[ng] };
}

/**
 * Lập bàn Thái Ất cho một thời điểm giờ Việt Nam.
 * opt: {ke: 'nam'|'thang'|'gio', day, month, year, hour, minute} (dương lịch; có thể calendar:'am', leap).
 *   Riêng ke 'nam' có thể chỉ truyền year: lấy thẳng năm đó (năm tính từ Lập xuân).
 * Trả về bàn đầy đủ (xem taBan_) + ke, keTen, thoiDiem, namTiet, thangTiet, ngay, gio.
 */
function taLap_(opt) {
  opt = opt || {};
  var ke = opt.ke || 'gio';
  if (ke === 'ngay') throw new Error('Nhật kế (theo ngày) chưa làm.');
  if (!TA_KE[ke]) throw new Error('Kế không hợp lệ: ' + ke);
  var Y, m = null, T, duong = true, tue, t = null, ngay = null, gio = null, L = null;
  if (ke === 'nam' && opt.day == null && opt.month == null) {
    Y = parseInt(opt.year, 10);
    if (!(Y >= 1 && Y <= 9999)) throw new Error('Năm cần trong khoảng 1 – 9999.');
  } else {
    t = chuanHoaThoiGian_({ calendar: opt.calendar || 'duong', day: opt.day, month: opt.month, year: opt.year,
      hour: opt.hour == null ? 12 : opt.hour, minute: opt.minute, leap: opt.leap });
    var jdUT = t.jdClock - 0.5 + (t.hour * 60 + t.minute) / 1440 - LUNAR_TZ / 24;
    L = kmKinhDoMatTroi_(jdUT);
    Y = t.solar.year;
    if (t.solar.month <= 2 && L > 250 && L < 315) Y -= 1;            // trước Lập xuân: còn năm cũ
    m = Math.floor(taMod_(L - 315, 360) / 30) + 1;                   // tháng tiết: 1 = Dần (từ Lập xuân)
  }
  if (ke === 'nam') { T = TA_TICH_NIEN + Y; tue = taMod_(Y + 8, 12); }
  else if (ke === 'thang') { T = (TA_TICH_NIEN + Y - 1) * 12 + 2 + m; tue = (m + 1) % 12; }
  else {
    var dCan = mod10(t.jd + 9), dChi = mod12(t.jd + 1), hChi = Math.floor((t.hour + 1) / 2) % 12;
    var D = TA_TICH_NGAY_GOC + (t.jd - jdFromDate(21, 12, 1900));
    T = (D - 1) * 12 + hChi + 1;
    duong = L >= 270 || L < 90;                                       // Đông chí → trước Hạ chí: dương độn
    tue = hChi;
    ngay = { can: dCan, chi: dChi, ten: canChiText(dCan, dChi), stt: canChiIndex(dCan, dChi) };
    gio = { can: mod10((dCan % 5) * 2 + hChi), chi: hChi, ten: canChiText(mod10((dCan % 5) * 2 + hChi), hChi) };
  }
  var ban = taBan_(T, duong, tue);
  ban.ke = ke; ban.keTen = TA_KE[ke].ten; ban.keGiai = TA_KE[ke].giai;
  ban.namTiet = Y; ban.namCanChi = canChiText(mod10(Y + 6), mod12(Y + 8));
  if (m != null && ke !== 'nam') { ban.thangTiet = m; ban.thangChi = CHI[(m + 1) % 12]; }
  ban.thaiTue = { chi: tue, ten: CHI[tue] };
  if (t) {
    ban.thoiDiem = { nam: t.solar.year, thang: t.solar.month, ngay: t.solar.day, gio: t.hour, phut: t.minute };
    ban.tyMuon = t.hour === 23;
    ban.kinhDoMatTroi = Math.round(L * 1000) / 1000;
  }
  if (ngay) { ban.ngay = ngay; ban.gio = gio; }
  return ban;
}

/* ---------- Mệnh pháp cá nhân ---------- */
var TA_CUNG12 = [
  { ma: 'menh', ten: 'Mệnh', de: 'bản thân' }, { ma: 'huynh_de', ten: 'Huynh đệ', de: 'anh chị em, bạn bè ngang hàng' },
  { ma: 'the_thiep', ten: 'Thê thiếp', de: 'vợ chồng, người bạn đời' }, { ma: 'tu_ton', ten: 'Tử tôn', de: 'con cái' },
  { ma: 'tai_bach', ten: 'Tài bạch', de: 'tiền bạc' }, { ma: 'dien_trach', ten: 'Điền trạch', de: 'nhà cửa, tài sản' },
  { ma: 'quan_loc', ten: 'Quan lộc', de: 'công việc, sự nghiệp' }, { ma: 'no_boc', ten: 'Nô bộc', de: 'người giúp việc, cấp dưới, cộng sự' },
  { ma: 'tat_ach', ten: 'Tật ách', de: 'sức khỏe' }, { ma: 'phuc_duc', ten: 'Phúc đức', de: 'phúc phần, đời sống tinh thần' },
  { ma: 'tuong_mao', ten: 'Tướng mạo', de: 'dáng vẻ, cách người khác nhìn mình' }, { ma: 'phu_mau', ten: 'Phụ mẫu', de: 'cha mẹ, người đỡ đầu' }
];
/** Đặt các thần của một bàn lên 12 chi (ô giữa không đặt): trả mảng 12 phần tử, mỗi phần tử là danh sách mã thần */
function taDatLen12_(ban) {
  var ds = []; for (var i = 0; i < 12; i++) ds.push([]);
  TA_THAN_THU_TU.forEach(function (ma) { var chi = TA_O_CHI[ban.than[ma].o]; if (chi != null) ds[chi].push(ma); });
  return ds;
}
/**
 * Mệnh pháp (Thái Ất nhân đạo mệnh pháp, Thống Tông qua kintaiyi; độ tin cậy thấp – 1 nguồn mã).
 * sinh: {day, month, year, hour, minute, gender: 'nam'|'nu', calendar?, leap?}
 * Cung Mệnh: đặt chi tháng (tiết) lên ô chi năm; nam năm dương, nữ năm âm đi thuận, ngược lại đi nghịch;
 * ô dưới chi giờ là Mệnh, ô dưới chi ngày là Thân; 12 cung xếp từ Mệnh theo cùng chiều.
 * Thần đặt lên 12 cung bằng bàn Thời kế giờ sinh; bàn Tuế kế năm sinh cho "thế bẩm sinh".
 */
function taMenh_(sinh) {
  var bt = batTuLap_({ calendar: sinh.calendar || 'duong', day: sinh.day, month: sinh.month, year: sinh.year,
    hour: sinh.hour == null ? 12 : sinh.hour, minute: sinh.minute || 0, leap: sinh.leap, gender: sinh.gender, viewYear: 2026 });
  var p = bt.pillars, yCan = p[0].can, yChi = p[0].chi, mChi = p[1].chi, dChi = p[2].chi, hChi = p[3].chi;
  var nam = sinh.gender !== 'nu', duongNam = yCan % 2 === 0;
  var thuan = (nam && duongNam) || (!nam && !duongNam), dir = thuan ? 1 : -1;
  var dat = function (x) { return taMod_(yChi + dir * (x - mChi), 12); };
  var menhChi = dat(hChi), thanChi = dat(dChi);
  var opt = { day: sinh.day, month: sinh.month, year: sinh.year, hour: sinh.hour == null ? 12 : sinh.hour, minute: sinh.minute || 0, calendar: sinh.calendar, leap: sinh.leap };
  var banNam = taLap_({ ke: 'nam', day: opt.day, month: opt.month, year: opt.year, hour: opt.hour, minute: opt.minute, calendar: opt.calendar, leap: opt.leap });
  var banGio = taLap_({ ke: 'gio', day: opt.day, month: opt.month, year: opt.year, hour: opt.hour, minute: opt.minute, calendar: opt.calendar, leap: opt.leap });
  var tren12 = taDatLen12_(banGio);
  var cung12 = TA_CUNG12.map(function (c, i) {
    var chi = taMod_(menhChi + dir * i, 12), ds = tren12[chi];
    var cat = ds.filter(function (ma) { return TA_THAN[ma].loai === 'cat'; }), hung = ds.filter(function (ma) { return TA_THAN[ma].loai === 'hung'; });
    return { i: i, ma: c.ma, ten: c.ten, deHieu: c.de, chi: chi, chiTen: CHI[chi], than: ds, cat: cat, hung: hung,
      danhGia: cat.length > hung.length ? 'tot' : hung.length > cat.length ? 'xau' : 'tron', laThan: chi === thanChi };
  });
  var cungThan = cung12.filter(function (c) { return c.chi === thanChi; })[0];
  var ss = banNam.soSanh, the = ss.lech > 0 ? 'giu_xay' : ss.lech < 0 ? 'xong_pha' : 'can_bang';
  return {
    phep: 'Thái Ất nhân đạo mệnh pháp (Thống Tông)', doTinCay: 'thap',
    gioiTinh: nam ? 'nam' : 'nu', namSinhTiet: banNam.namTiet,
    canChi: { nam: p[0].canTen + ' ' + p[0].chiTen, thang: p[1].canTen + ' ' + p[1].chiTen, ngay: p[2].canTen + ' ' + p[2].chiTen, gio: p[3].canTen + ' ' + p[3].chiTen },
    namAmDuong: duongNam ? 'duong' : 'am', chieu: thuan ? 'thuan' : 'nghich',
    menh: { chi: menhChi, chiTen: CHI[menhChi], than: cung12[0].than, cat: cung12[0].cat, hung: cung12[0].hung },
    thanCung: { chi: thanChi, chiTen: CHI[thanChi], cung: cungThan.ma, cungTen: cungThan.ten, than: cungThan.than, cat: cungThan.cat, hung: cungThan.hung },
    cung12: cung12,
    theBamSinh: { ma: the, giai: the === 'giu_xay' ? 'hợp giữ và xây hơn là xông pha' : the === 'xong_pha' ? 'hợp chủ động, xông pha hơn là ngồi giữ' : 'cân bằng giữa giữ và tiến',
      nghieng: ss.nghieng, chuToan: banNam.toan.chu.so, khachToan: banNam.toan.khach.so },
    cachNamSinh: banNam.cach.map(function (c) { return c.ma; }),
    banNam: banNam, banGio: banGio,
    han: null, hanGhiChu: 'Dương cửu, Bách lục hành hạn (hạn 10 năm): làm ở đợt sau.'
  };
}

/**
 * Vận năm cá nhân – CÁCH GHÉP CỦA THIÊN CƠ CÁC (không phải phép cổ nguyên bản):
 * bàn Tuế kế năm xem + 12 cung mệnh pháp: thần lành/dữ của năm rơi vào cung nào của người đó.
 * sinh như taMenh_; namXem: năm dương lịch (tính từ Lập xuân). Vai mặc định cho vận năm: Chủ.
 */
function taNamCaNhan_(sinh, namXem, vai) {
  var menh = taMenh_(sinh), ban = taLap_({ ke: 'nam', year: namXem });
  var tren12 = taDatLen12_(ban), theoChi = {};
  menh.cung12.forEach(function (c) { theoChi[c.chi] = c; });
  var vao = [];
  tren12.forEach(function (ds, chi) {
    ds.forEach(function (ma) { var c = theoChi[chi]; vao.push({ than: ma, ten: TA_THAN[ma].ten, loai: TA_THAN[ma].loai, chi: chi, chiTen: CHI[chi], cung: c.ma, cungTen: c.ten }); });
  });
  var cungCat = {}, cungHung = {};
  vao.forEach(function (x) { if (x.loai === 'cat') cungCat[x.cung] = 1; if (x.loai === 'hung') cungHung[x.cung] = 1; });
  var menhGap = vao.filter(function (x) { return x.cung === 'menh'; }).map(function (x) { return x.than; });
  var thanGap = vao.filter(function (x) { return x.cung === menh.thanCung.cung; }).map(function (x) { return x.than; });
  return {
    ghep: 'ghep_tcc', ghepGiai: 'Cách ghép của Thiên Cơ Các, không phải phép cổ nguyên bản',
    namXem: ban.namTiet, namCanChi: ban.namCanChi, tuoi: ban.namTiet - menh.namSinhTiet + 1,
    ban: ban, menh: menh, thanVaoCung: vao,
    cungDuocPhuc: Object.keys(cungCat), cungBiCan: Object.keys(cungHung), menhGap: menhGap, thanCungGap: thanGap,
    danhGia: taDanhGia_(ban, 'chung', vai || 'chu'),
    han: null
  };
}

/* ---------- Hỏi việc theo giờ (Thời kế) ---------- */
/** 7 loại việc (mã trùng Kỳ Môn) + 'chung' (vận năm/thời cuộc). dung: thần trợ việc; trong số w nhân cho các phần */
var TA_LOAI = {
  cong_viec: { ten: 'Công việc, xin việc, thăng tiến', dung: ['than_co', 'quan_co'], w: { the: 1, cach: 1, hung: 1 } },
  tai_loc: { ten: 'Tiền bạc, mua bán, hợp tác', dung: ['ngu_phuc', 'dan_co'], w: { the: 1, cach: 1, hung: 1 } },
  tinh_cam: { ten: 'Tình cảm, hẹn gặp, tái hợp', dung: ['hop_than', 'ngu_phuc'], w: { the: 0.6, cach: 1.3, hung: 1 }, nang: ['cach', 'doi', 'quan'] },
  di_xa: { ten: 'Đi xa, xuất hành, chuyển nhà', dung: ['thuy_kich', 'dan_co'], w: { the: 1, cach: 1, hung: 1 }, nang: ['kich', 'yem'] },
  suc_khoe: { ten: 'Sức khỏe và nhịp sống', dung: ['ngu_phuc'], w: { the: 0.6, cach: 1, hung: 1.6 } },
  kien_tung: { ten: 'Tranh chấp, kiện tụng, giấy tờ hợp đồng', dung: ['truc_phu_nguoc'], w: { the: 1.6, cach: 1, hung: 1 }, nang: ['quan'] },
  thi_cu: { ten: 'Thi cử, học hành, hồ sơ', dung: ['van_xuong'], w: { the: 0.8, cach: 1, hung: 1 }, nang: ['tu', 'bach', 'doi'] },
  chung: { ten: 'Nhịp chung (vận năm, thời cuộc)', dung: ['ngu_phuc', 'quan_co', 'than_co', 'dan_co'], w: { the: 1, cach: 1, hung: 1 } }
};
var TA_MUC = {
  thuan: { ten: 'Thuận', giai: 'thế thuận cho vai bạn chọn – có thể tiến' },
  thuan_dk: { ten: 'Thuận có điều kiện', giai: 'thuận vừa – chuẩn bị kỹ, làm rõ vài điểm rồi mới tiến' },
  nen_cho: { ten: 'Nên chờ', giai: 'thế chưa thuận – dùng lúc này để chuẩn bị, chưa nên dồn sức' }
};
/** Ngưỡng điểm nội bộ: diem > thuan → thuan; diem >= thuanDk → thuan_dk; còn lại nen_cho.
 *  Chỉnh trên 20.000 bàn giờ ngẫu nhiên 1990–2040 (vai Khách) để mỗi loại có khoảng 30% thuận, 45% thuận có điều kiện, 25% nên chờ;
 *  riêng 'chung' chỉnh trên Tuế kế 1800–2200 (vai Chủ). */
var TA_NGUONG = {
  cong_viec: { thuan: 0.5, thuanDk: -1.75 }, tai_loc: { thuan: 0.75, thuanDk: -1.5 }, tinh_cam: { thuan: -0.09, thuanDk: -1.79 },
  di_xa: { thuan: 0.75, thuanDk: -1.5 }, suc_khoe: { thuan: 0.35, thuanDk: -1.35 }, kien_tung: { thuan: 1.55, thuanDk: -2.15 },
  thi_cu: { thuan: 0.3, thuanDk: -1.6 }, chung: { thuan: 0, thuanDk: -2.5 }
};
var TA_HUNG_THAN = ['dai_du', 'tu_than', 'thien_at', 'dia_at', 'truc_phu'];
var TA_CAT_THAN = ['ngu_phuc', 'quan_co', 'than_co', 'dan_co'];

/**
 * Chấm một loại việc trên một bàn cho một vai. vai: 'khach' (người chủ động – mặc định khi hỏi việc) | 'chu' (người đang giữ).
 * Trả về { muc, mucTen, diem (nội bộ), vai, loai, nghieng, ly: [{k, diem, ta}] } – ly là mã lý do để văn luận dùng.
 */
function taDanhGia_(ban, loai, vai) {
  var L = TA_LOAI[loai]; if (!L) throw new Error('Loại việc không hợp lệ.');
  vai = vai === 'chu' ? 'chu' : 'khach';
  var doi = vai === 'chu' ? 'khach' : 'chu', ly = [], diem = 0;
  function them(k, d, ta) { d = Math.round(d * 100) / 100; ly.push({ k: k, diem: d, ta: ta }); diem += d; }
  var nang = L.nang || [];
  // 1. Thế chung: bên nào nghiêng
  var lech = (vai === 'chu' ? 1 : -1) * ban.soSanh.lech, l = Math.max(-3, Math.min(3, lech));
  if (l > 0) them('the_ve_ban', 0.5 * l * L.w.the, 'Thế của bàn nghiêng về phía bạn (' + TA_BEN[vai] + ')');
  else if (l < 0) them('the_ve_doi', 0.5 * l * L.w.the, 'Thế của bàn nghiêng về phía bên kia (' + TA_BEN[doi] + ')');
  else them('the_giang_co', 0, 'Hai phía đang giằng co');
  // 2. Cách cục chạm tới vai
  var tru = 0, cong = 0;
  ban.cach.forEach(function (c) {
    if (c.muc !== 'hung' || /^(toan_doan|vo_|don_|trung_)/.test(c.ma)) return;
    var w = (nang.indexOf(c.ma) >= 0 ? 1.6 : 1) * L.w.cach;
    if (c.ma === 'tu_quach_co' || c.ma === 'tu_quach_do') { them(c.ma, -1.5 * w, TA_CACH[c.ma].giai); return; }
    if (c.ma === 'quan') { them('quan', -0.5 * w, TA_CACH.quan.giai); return; }
    if (c.ben === vai || c.ben === 'chung') { if (tru < 2) { var d = Math.min(0.5 * w, 2 - tru); tru += d; them(c.ma + (c.ai ? ':' + c.ai : ''), -d, TA_CACH[c.ma].giai + ' (' + TA_BEN[c.ben] + ')'); } }
    else if (c.ben === doi && cong < 1) { cong += 0.25; them('doi_bi_' + c.ma, 0.25, 'Bên kia vướng thế ' + TA_CACH[c.ma].ten.toLowerCase()); }
  });
  if (ban.cach.some(function (c) { return c.ma === 'hoa_thuan'; })) them('hoa_thuan', 1, TA_CACH.hoa_thuan.giai);
  // 3. Toán của vai
  var tv = ban.toan[vai];
  if (tv.loai.indexOf('tam_tai') >= 0) them('toan_tam_tai', 0.5, 'Toán của phía bạn đủ trời, đất, người');
  if (tv.loai.indexOf('toan_doan') >= 0) them('toan_doan', -0.5, 'Toán của phía bạn ngắn – nên làm nhanh gọn');
  if (ban.toan.dinh.loai.indexOf('vo_nhan') >= 0) them('dinh_vo_nhan', -0.5, 'Định toán thiếu người – kết cục cần thêm người đồng hành');
  // 4. Thần lành / dữ cùng cung với đại tướng của vai
  var oT = ban.than[vai + '_dai'].o, cungT = TA_O_CUNG[oT];
  if (oT !== 16) {
    TA_HUNG_THAN.forEach(function (ma) { if (TA_O_CUNG[ban.than[ma].o] === cungT) them('hung_than_' + ma, -0.5 * L.w.hung, TA_THAN[ma].ten + ' đứng cùng cung với tướng của bạn (' + TA_THAN[ma].giai + ')'); });
    TA_CAT_THAN.forEach(function (ma) { if (TA_O_CUNG[ban.than[ma].o] === cungT) them('cat_than_' + ma, 0.5, TA_THAN[ma].ten + ' đứng cùng cung với tướng của bạn (' + TA_THAN[ma].giai + ')'); });
  } else them('tuong_giua', -0.5, 'Tướng của phía bạn ở cung giữa – nên giữ, chưa ra tay');
  // 5. Dụng thần của loại việc: không bị Thái Ất đè/ép và không đứng cùng thần dữ
  L.dung.forEach(function (ma) {
    var nguoc = /_nguoc$/.test(ma); ma = ma.replace(/_nguoc$/, '');
    var o = ban.than[ma].o, q = taQuanHe_(o, ban.thaiAt.cung);
    var vuong = TA_HUNG_THAN.some(function (h) { return h !== ma && ban.than[h].o !== 16 && TA_O_CUNG[ban.than[h].o] === TA_O_CUNG[o]; });
    if (nguoc) {   // yếu tố cản (Trực Phù – phép tắc, giấy tờ): xa Thái Ất và xa tướng của bạn thì nhẹ
      if (TA_O_CUNG[o] === cungT) them('can_tro_sat', -0.75, TA_THAN[ma].ten + ' (yếu tố cản) đứng ngay cung tướng của bạn');
      else them('can_tro_xa', 0.25, TA_THAN[ma].ten + ' (yếu tố cản) không chạm tướng của bạn');
      return;
    }
    if (q.k === 'cung' || q.k === 'than_bach') them('dung_bi_ep_' + ma, -0.5, TA_THAN[ma].ten + ' (' + TA_THAN[ma].giai + ') bị Thái Ất đè hoặc ép sát');
    else if (vuong) them('dung_vuong_' + ma, -0.5, TA_THAN[ma].ten + ' (' + TA_THAN[ma].giai + ') đứng cùng một thần gây trở ngại');
    else them('dung_tot_' + ma, 0.5, TA_THAN[ma].ten + ' (' + TA_THAN[ma].giai + ') đứng ở chỗ yên');
  });
  var N = TA_NGUONG[loai], muc = diem > N.thuan + 1e-9 ? 'thuan' : diem >= N.thuanDk - 1e-9 ? 'thuan_dk' : 'nen_cho';
  return { muc: muc, mucTen: TA_MUC[muc].ten, mucGiai: TA_MUC[muc].giai, diem: Math.round(diem * 100) / 100, vai: vai, loai: loai, loaiTen: L.ten,
    nghieng: ban.soSanh.nghieng, ly: ly };
}
