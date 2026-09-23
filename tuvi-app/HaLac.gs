/**
 * ============================================================
 *  HaLac.gs — BÁT TỰ HÀ LẠC (Hà Lạc lý số – tương truyền Trần Đoàn, Thiệu Khang Tiết)
 *  1. Đổi 8 chữ can chi (tứ trụ theo tiết khí) ra số Hà Đồ – Lạc Thư,
 *     cộng số lẻ = Thiên số, số chẵn = Địa số; rút gọn (trừ 25 / 30, bỏ hàng chục).
 *  2. Số → quái theo Hậu thiên Lạc Thư (1 Khảm, 2 Khôn, 3 Chấn, 4 Tốn, 6 Càn,
 *     7 Đoài, 8 Cấn, 9 Ly; số 5 ký cung theo Tam nguyên & giới tính).
 *  3. Ghép thượng/hạ quái → quẻ Tiên thiên; hào nguyên đường theo giờ sinh
 *     (giờ dương Tý→Tỵ lấy hào dương, giờ âm Ngọ→Hợi lấy hào âm).
 *  4. Quẻ Hậu thiên: biến hào nguyên đường rồi đảo thượng – hạ quái; nguyên đường
 *     dời 3 hào. Quẻ Hỗ: hào 2-3-4 làm hạ quái, 3-4-5 làm thượng quái.
 *  5. Đại vận theo hào: từ hào nguyên đường đi lên, hết hào 6 vòng về hào 1, đủ
 *     6 hào; hào dương 9 năm, hào âm 6 năm. Hết Tiên thiên chuyển sang Hậu thiên.
 *  6. Lưu niên: năm đầu của vận hào lấy quẻ biến tại hào đó, mỗi năm sau biến
 *     tiếp hào kế trên của quẻ năm trước (vòng tròn 6 hào).
 *  Đánh giá: cát – hung của quẻ (Chu Dịch), vị hào (đắc vị, đắc trung, có ứng),
 *  ngũ hành quái so với dụng thần Bát Tự.
 * ============================================================
 */

var HL_QUAI = {
  'Càn': { l: [1, 1, 1], tuong: 'Thiên', hanh: 'Kim', y: 'trời – cương kiện, lãnh đạo, cha, quan lộc' },
  'Đoài': { l: [1, 1, 0], tuong: 'Trạch', hanh: 'Kim', y: 'đầm – vui vẻ, lời nói, giao tiếp, thiếu nữ' },
  'Ly': { l: [1, 0, 1], tuong: 'Hỏa', hanh: 'Hỏa', y: 'lửa – sáng suốt, danh tiếng, văn minh' },
  'Chấn': { l: [1, 0, 0], tuong: 'Lôi', hanh: 'Mộc', y: 'sấm – hành động, khởi phát, trưởng nam' },
  'Tốn': { l: [0, 1, 1], tuong: 'Phong', hanh: 'Mộc', y: 'gió – mềm mỏng, thâm nhập, buôn bán' },
  'Khảm': { l: [0, 1, 0], tuong: 'Thủy', hanh: 'Thủy', y: 'nước – hiểm nguy, trí tuệ, lao tâm' },
  'Cấn': { l: [0, 0, 1], tuong: 'Sơn', hanh: 'Thổ', y: 'núi – dừng lại, tích lũy, bền vững' },
  'Khôn': { l: [0, 0, 0], tuong: 'Địa', hanh: 'Thổ', y: 'đất – nhu thuận, bao dung, mẹ, nhà đất' }
};
var HL_SO_QUAI = { 1: 'Khảm', 2: 'Khôn', 3: 'Chấn', 4: 'Tốn', 6: 'Càn', 7: 'Đoài', 8: 'Cấn', 9: 'Ly' };
var HL_CAN_SO = [6, 2, 8, 7, 1, 9, 3, 4, 6, 2];
var HL_CHI_SO = [[1, 6], [5, 10], [3, 8], [3, 8], [5, 10], [2, 7], [2, 7], [5, 10], [4, 9], [4, 9], [5, 10], [1, 6]];

/** 64 quẻ (thứ tự Văn Vương): [thượng, hạ, tên, điểm cát–hung −2..2, ý nghĩa, lời khuyên] */
var HL_QUE = [
  ['Càn', 'Càn', 'Thuần Càn', 2, 'Trời cương kiện, sáng tạo không ngừng – quyền lực, lãnh đạo, thành công lớn', 'tự cường không nghỉ nhưng tránh kiêu mãn'],
  ['Khôn', 'Khôn', 'Thuần Khôn', 1, 'Đất nhu thuận, bao dung, nuôi dưỡng – thành công nhờ hợp tác và đi sau', 'nhu thuận, bền bỉ, đi sau thì được'],
  ['Khảm', 'Chấn', 'Thủy Lôi Truân', -1, 'Khởi đầu gian nan như mầm non đội đất – có tiềm năng nhưng nhiều trở ngại', 'kiên nhẫn, tìm người giúp, chưa nên liều'],
  ['Cấn', 'Khảm', 'Sơn Thủy Mông', -0.5, 'Mông muội, non nớt – thời học hỏi, cần thầy dẫn dắt', 'khiêm tốn học hỏi, tránh tự phụ'],
  ['Khảm', 'Càn', 'Thủy Thiên Nhu', 0.5, 'Chờ đợi đúng thời như mây chờ mưa – có lòng tin thì hanh thông', 'chờ thời, dưỡng sức, đừng nóng vội'],
  ['Càn', 'Khảm', 'Thiên Thủy Tụng', -1.5, 'Tranh tụng, bất đồng, kiện cáo', 'nhường nhịn, hòa giải, tránh kiện tụng'],
  ['Khôn', 'Khảm', 'Địa Thủy Sư', 0, 'Quân đội, tổ chức, kỷ luật – thành công khi có người lãnh đạo chính đáng', 'tổ chức chặt chẽ, dùng người đúng'],
  ['Khảm', 'Khôn', 'Thủy Địa Tỷ', 1, 'Thân cận, liên kết, được lòng người', 'kết giao đúng người, đoàn kết'],
  ['Tốn', 'Càn', 'Phong Thiên Tiểu Súc', 0, 'Tích nhỏ thành lớn – bị ngăn trở nhẹ, mây dày chưa mưa', 'tích lũy từng chút, chờ thời'],
  ['Càn', 'Đoài', 'Thiên Trạch Lý', 0.5, 'Lễ nghi, bước đi thận trọng như giẫm đuôi hổ mà không bị cắn', 'giữ lễ, thận trọng thì an'],
  ['Khôn', 'Càn', 'Địa Thiên Thái', 2, 'Thông thái, trời đất giao hòa – hanh thông, thịnh vượng', 'tận dụng thời thịnh, phòng khi đổi vận'],
  ['Càn', 'Khôn', 'Thiên Địa Bĩ', -1.5, 'Bế tắc, trên dưới không thông – tiểu nhân lấn át', 'giữ mình, ẩn nhẫn chờ qua'],
  ['Càn', 'Ly', 'Thiên Hỏa Đồng Nhân', 1.5, 'Hòa đồng, hợp tác rộng rãi, cùng chí hướng', 'mở rộng hợp tác, công tâm'],
  ['Ly', 'Càn', 'Hỏa Thiên Đại Hữu', 2, 'Sở hữu lớn, giàu có, rực rỡ như mặt trời giữa trời', 'giữ khiêm, dùng của làm việc tốt'],
  ['Khôn', 'Cấn', 'Địa Sơn Khiêm', 1.5, 'Khiêm tốn – núi ẩn dưới đất, được người kính trọng', 'khiêm nhường thì mọi việc hanh thông'],
  ['Chấn', 'Khôn', 'Lôi Địa Dự', 1, 'Vui vẻ, hứng khởi, chuẩn bị chu đáo', 'vui mà không sa đà, chuẩn bị trước'],
  ['Đoài', 'Chấn', 'Trạch Lôi Tùy', 1, 'Theo thời, tùy thuận – được người đi theo', 'linh hoạt theo thời, chọn đúng người để theo'],
  ['Cấn', 'Tốn', 'Sơn Phong Cổ', -0.5, 'Đổ nát cần sửa chữa – chấn chỉnh việc cũ', 'sửa sai, cải tổ, giải quyết việc tồn đọng'],
  ['Khôn', 'Đoài', 'Địa Trạch Lâm', 1.5, 'Đến gần, lớn mạnh – thời tiến', 'tiến lên nhưng lo trước lúc suy'],
  ['Tốn', 'Khôn', 'Phong Địa Quan', 0.5, 'Quan sát, chiêm nghiệm, làm gương', 'quan sát kỹ, sống làm gương'],
  ['Ly', 'Chấn', 'Hỏa Lôi Phệ Hạp', -0.5, 'Cắn đứt trở ngại – hình phạt, pháp luật', 'quyết đoán xử lý trở ngại, công minh'],
  ['Cấn', 'Ly', 'Sơn Hỏa Bí', 0.5, 'Trang sức, vẻ đẹp bên ngoài', 'chuộng thực chất hơn hình thức'],
  ['Cấn', 'Khôn', 'Sơn Địa Bác', -2, 'Bóc lở, sụp đổ dần – tiểu nhân thịnh', 'án binh, giữ gốc, không mạo hiểm'],
  ['Khôn', 'Chấn', 'Địa Lôi Phục', 1, 'Trở lại, phục hồi – dương khí trở về', 'bắt đầu lại từ từ, sửa mình'],
  ['Càn', 'Chấn', 'Thiên Lôi Vô Vọng', 0, 'Chân thật, không vọng động – làm càn thì gặp họa bất ngờ', 'sống thật, không mưu cầu bất chính'],
  ['Cấn', 'Càn', 'Sơn Thiên Đại Súc', 1.5, 'Tích tụ lớn, nuôi dưỡng hiền tài', 'tích lũy tri thức, của cải, chờ dịp lớn'],
  ['Cấn', 'Chấn', 'Sơn Lôi Di', 0.5, 'Nuôi dưỡng – ăn uống và lời nói', 'giữ lời nói và ăn uống điều độ'],
  ['Đoài', 'Tốn', 'Trạch Phong Đại Quá', -1, 'Quá mức, gánh nặng làm oằn cột', 'giảm tải, hành động phi thường nhưng cẩn trọng'],
  ['Khảm', 'Khảm', 'Thuần Khảm', -1.5, 'Hiểm trở chồng chất', 'giữ lòng tin, vượt hiểm từng bước'],
  ['Ly', 'Ly', 'Thuần Ly', 1, 'Sáng sủa, nương vào chính đạo, văn minh', 'nương tựa đúng chỗ, giữ sáng suốt'],
  ['Đoài', 'Cấn', 'Trạch Sơn Hàm', 1, 'Cảm ứng – tình cảm, hôn nhân', 'chân thành cảm hóa, thuận duyên tình cảm'],
  ['Chấn', 'Tốn', 'Lôi Phong Hằng', 1, 'Lâu bền, kiên định', 'giữ vững con đường đã chọn'],
  ['Càn', 'Cấn', 'Thiên Sơn Độn', -0.5, 'Lui ẩn, tránh tiểu nhân', 'biết lui đúng lúc để bảo toàn'],
  ['Chấn', 'Càn', 'Lôi Thiên Đại Tráng', 1, 'Cường thịnh, sức mạnh lớn', 'mạnh mà giữ chính, không lạm dụng'],
  ['Ly', 'Khôn', 'Hỏa Địa Tấn', 1.5, 'Tiến lên, thăng tiến như mặt trời mọc', 'tiến bước, được trọng dụng'],
  ['Khôn', 'Ly', 'Địa Hỏa Minh Di', -1.5, 'Ánh sáng bị che – người hiền bị hại', 'giấu tài, giữ chính, chờ sáng'],
  ['Tốn', 'Ly', 'Phong Hỏa Gia Nhân', 1, 'Gia đình, nề nếp, nội trợ', 'chăm lo gia đạo, phân vai rõ'],
  ['Ly', 'Đoài', 'Hỏa Trạch Khuê', -1, 'Chia lìa, bất đồng', 'tìm điểm chung trong việc nhỏ'],
  ['Khảm', 'Cấn', 'Thủy Sơn Kiển', -1.5, 'Gian nan, chân bị vướng', 'quay lại tự xét, tìm quý nhân'],
  ['Chấn', 'Khảm', 'Lôi Thủy Giải', 1, 'Giải thoát, tháo gỡ khó khăn', 'giải quyết nhanh gọn, bao dung'],
  ['Cấn', 'Đoài', 'Sơn Trạch Tổn', -0.5, 'Bớt dưới thêm trên – hy sinh để được lâu dài', 'bớt dục vọng, đầu tư cho tương lai'],
  ['Tốn', 'Chấn', 'Phong Lôi Ích', 1.5, 'Lợi ích, gia tăng', 'làm việc lớn, giúp người cùng được lợi'],
  ['Đoài', 'Càn', 'Trạch Thiên Quải', 0, 'Quyết đoán, dứt khoát loại bỏ điều xấu', 'quyết mà không bạo'],
  ['Càn', 'Tốn', 'Thiên Phong Cấu', -0.5, 'Gặp gỡ bất ngờ – âm lấn dương', 'cẩn trọng với mối quan hệ mới'],
  ['Đoài', 'Khôn', 'Trạch Địa Tụy', 1, 'Tụ họp, đoàn tụ', 'tập hợp lực lượng, phòng bất trắc'],
  ['Khôn', 'Tốn', 'Địa Phong Thăng', 1.5, 'Đi lên, thăng tiến từ từ', 'tiến dần, tìm gặp người có quyền'],
  ['Đoài', 'Khảm', 'Trạch Thủy Khốn', -1.5, 'Khốn cùng, cạn kiệt', 'giữ chí, ít nói, chờ qua cơn khốn'],
  ['Khảm', 'Tốn', 'Thủy Phong Tỉnh', 0.5, 'Giếng nước – nguồn lực bền, nuôi người', 'bồi đắp nền tảng, phục vụ'],
  ['Đoài', 'Ly', 'Trạch Hỏa Cách', 0.5, 'Cách mạng, thay đổi lớn', 'đổi mới đúng thời, giữ lòng tin'],
  ['Ly', 'Tốn', 'Hỏa Phong Đỉnh', 1.5, 'Cái đỉnh – xây dựng cái mới, địa vị', 'ổn định vị thế, dùng người tài'],
  ['Chấn', 'Chấn', 'Thuần Chấn', 0, 'Chấn động, sấm sét – sợ hãi rồi vui', 'bình tĩnh trước biến động'],
  ['Cấn', 'Cấn', 'Thuần Cấn', 0, 'Dừng lại, tĩnh lặng', 'biết dừng đúng lúc'],
  ['Tốn', 'Cấn', 'Phong Sơn Tiệm', 1, 'Tiến dần – hôn nhân tốt', 'từng bước vững chắc'],
  ['Chấn', 'Đoài', 'Lôi Trạch Quy Muội', -1, 'Hôn nhân không chính, vội vàng', 'tránh vội vàng trong tình cảm'],
  ['Chấn', 'Ly', 'Lôi Hỏa Phong', 1, 'Thịnh lớn, sung mãn', 'tận hưởng thời thịnh nhưng phòng suy'],
  ['Ly', 'Cấn', 'Hỏa Sơn Lữ', -0.5, 'Lữ khách – xa nhà, bất định', 'khiêm nhường nơi đất khách'],
  ['Tốn', 'Tốn', 'Thuần Tốn', 0.5, 'Nhu thuận, thâm nhập như gió', 'mềm mỏng, kiên trì'],
  ['Đoài', 'Đoài', 'Thuần Đoài', 1, 'Vui vẻ, giao tiếp, thuyết phục', 'vui mà giữ chính'],
  ['Tốn', 'Khảm', 'Phong Thủy Hoán', 0, 'Ly tán rồi hóa giải', 'hàn gắn, quy tụ lòng người'],
  ['Khảm', 'Đoài', 'Thủy Trạch Tiết', 0.5, 'Tiết chế, giới hạn', 'tiết kiệm vừa phải'],
  ['Tốn', 'Đoài', 'Phong Trạch Trung Phu', 1.5, 'Thành tín, lòng tin', 'giữ chữ tín'],
  ['Chấn', 'Cấn', 'Lôi Sơn Tiểu Quá', -0.5, 'Hơi quá – việc nhỏ được, việc lớn không', 'làm việc nhỏ, khiêm hạ'],
  ['Khảm', 'Ly', 'Thủy Hỏa Ký Tế', 0.5, 'Đã xong, đã thành – đầu tốt cuối dễ loạn', 'giữ thành quả, phòng suy'],
  ['Ly', 'Khảm', 'Hỏa Thủy Vị Tế', 0, 'Chưa xong, sắp thành', 'cẩn trọng ở bước cuối']
];
var HL_HAO_VI = {
  1: ['Sơ hào', 'nền móng, khởi sự, còn ẩn – nên học hỏi, tích lũy, chưa vội hiển lộ'],
  2: ['Nhị hào', 'vị trung của nội quái, ứng với hào 5 – được người trên nâng đỡ, lo gia đạo, xây nội lực'],
  3: ['Tam hào', 'cuối nội quái, chỗ quá độ – dễ vội vàng, nhiều áp lực, cần thận trọng'],
  4: ['Tứ hào', 'đầu ngoại quái, cận kề hào quân – làm việc gần người quyền lực, phải khéo léo'],
  5: ['Ngũ hào', 'vị chí tôn, trung chính – thời đỉnh cao, làm chủ, có quyền quyết'],
  6: ['Thượng hào', 'cực điểm – vật cực tắc phản, nên lui dần, truyền lại, giữ gìn']
};

function hlQue_(tren, duoi) {
  for (var i = 0; i < 64; i++) if (HL_QUE[i][0] === tren && HL_QUE[i][1] === duoi) return i;
  return -1;
}
function hlQuaiTuLines_(a) {
  for (var k in HL_QUAI) { var l = HL_QUAI[k].l; if (l[0] === a[0] && l[1] === a[1] && l[2] === a[2]) return k; }
  return null;
}
/** Quẻ từ mảng 6 hào (dưới lên) */
function hlTuHao_(h) {
  var duoi = hlQuaiTuLines_(h.slice(0, 3)), tren = hlQuaiTuLines_(h.slice(3, 6));
  var i = hlQue_(tren, duoi);
  return { idx: i, so: i + 1, ten: HL_QUE[i][2], tren: tren, duoi: duoi, hao: h.slice(), diem: HL_QUE[i][3], y: HL_QUE[i][4], khuyen: HL_QUE[i][5] };
}
function hlHaoCua_(tren, duoi) { return HL_QUAI[duoi].l.concat(HL_QUAI[tren].l); }
function hlBien_(h, p) { var x = h.slice(); x[p - 1] = 1 - x[p - 1]; return x; }
function hlRutGon_(n, tru) {
  while (n > tru) n -= tru;
  if (n > 10) n = n % 10 || n / 10;
  if (n === 10) n = 1;
  return n;
}
/** Số 5 ký cung theo Tam nguyên */
function hlSo5_(namAm, male, duongNam) {
  if (namAm >= 1864 && namAm <= 1923) return male ? 'Cấn' : 'Khôn';
  if (namAm >= 1924 && namAm <= 1983) return (male === duongNam) ? 'Cấn' : 'Khôn';
  return male ? 'Ly' : 'Đoài';
}
/** Chấm một hào trong quẻ */
function hlDiemHao_(q, p) {
  var h = q.hao, duong = h[p - 1] === 1, dv = (p % 2 === 1) === duong, trung = p === 2 || p === 5;
  var doi = p <= 3 ? p + 3 : p - 3, ung = h[p - 1] !== h[doi - 1];
  var d = q.diem + (dv ? 0.5 : -0.3) + (trung ? 0.5 : 0) + (ung ? 0.4 : -0.2) + (p === 3 ? -0.3 : 0) + (p === 6 ? -0.2 : 0) + (p === 5 && dv ? 0.3 : 0);
  return { diem: Math.round(d * 10) / 10, duong: duong, dacVi: dv, trung: trung, ung: ung };
}

function haLacLap(bt, tv) {
  var male = tv.info.male, namAm = tv.info.lunar.year, duongNam = tv.info.yCan % 2 === 0;
  var thien = 0, dia = 0, ct = [];
  bt.pillars.forEach(function (p) {
    var cs = HL_CAN_SO[p.can], zs = HL_CHI_SO[p.chi];
    [cs].concat(zs).forEach(function (n) { if (n % 2) thien += n; else dia += n; });
    ct.push(p.tru + ' ' + p.canTen + ' ' + p.chiTen + ': can ' + cs + ', chi ' + zs.join('–'));
  });
  var tN = hlRutGon_(thien, 25), dN = hlRutGon_(dia, 30);
  var qT = tN === 5 ? hlSo5_(namAm, male, duongNam) : HL_SO_QUAI[tN];
  var qD = dN === 5 ? hlSo5_(namAm, male, duongNam) : HL_SO_QUAI[dN];
  // Thượng quái: dương nam / âm nữ lấy quái Thiên số; âm nam / dương nữ lấy quái Địa số
  var thuan = male === duongNam;
  var tren = thuan ? qT : qD, duoi = thuan ? qD : qT;
  var hao = hlHaoCua_(tren, duoi), tien = hlTuHao_(hao);
  // Hào nguyên đường
  var chiGio = bt.pillars[3].chi, gioDuong = chiGio <= 5, k = gioDuong ? chiGio + 1 : chiGio - 5;
  var vt = []; for (var i = 1; i <= 6; i++) if (hao[i - 1] === (gioDuong ? 1 : 0)) vt.push(i);
  if (!vt.length) for (i = 1; i <= 6; i++) vt.push(i);
  var nd = vt[(k - 1) % vt.length];
  tien.nguyenDuong = nd;
  // Hậu thiên
  var bien = hlBien_(hao, nd), hauHao = bien.slice(3, 6).concat(bien.slice(0, 3));
  var hau = hlTuHao_(hauHao); hau.nguyenDuong = nd <= 3 ? nd + 3 : nd - 3;
  function ho(h) { return hlTuHao_([h[1], h[2], h[3], h[2], h[3], h[4]]); }
  var hoTien = ho(hao), hoHau = ho(hauHao);
  // Đại vận theo hào
  var dv = [], tuoi = 1;
  [[tien, 'Tiên thiên'], [hau, 'Hậu thiên']].forEach(function (x) {
    var q = x[0];
    for (var j = 0; j < 6; j++) {
      var p = ((q.nguyenDuong - 1 + j) % 6) + 1, soNam = q.hao[p - 1] ? 9 : 6;
      var dq = hlTuHao_(hlBien_(q.hao, p)), dh = hlDiemHao_(q, p);
      var nam = [], cur = hlBien_(q.hao, p), pp = p;
      for (var y = 0; y < soNam; y++) {
        if (y > 0) { pp = pp % 6 + 1; cur = hlBien_(cur, pp); }
        var qn = hlTuHao_(cur);
        nam.push({ nam: tv.info.lunar.year + tuoi - 1 + y, tuoi: tuoi + y, que: qn.ten, so: qn.so, hao: pp, diem: qn.diem, tren: qn.tren, duoi: qn.duoi });
      }
      dv.push({ que: x[1], goc: q.ten, hao: p, haoTen: HL_HAO_VI[p][0], duong: q.hao[p - 1] === 1, tuoiTu: tuoi, tuoiDen: tuoi + soNam - 1,
        namTu: tv.info.lunar.year + tuoi - 1, namDen: tv.info.lunar.year + tuoi + soNam - 2, bien: dq.ten, bienSo: dq.so, bienDiem: dq.diem, diemHao: dh, nam: nam });
      tuoi += soNam;
    }
  });
  return { thien: thien, dia: dia, thienN: tN, diaN: dN, quaiThien: qT, quaiDia: qD, chiTiet: ct, thuan: thuan,
    tien: tien, hau: hau, hoTien: hoTien, hoHau: hoHau, daiVan: dv, gioDuong: gioDuong, nguyen: namAm < 1924 ? 'Thượng nguyên' : namAm < 1984 ? 'Trung nguyên' : 'Hạ nguyên' };
}

function hlQuaiHanh_(q) { return [HL_QUAI[q.tren].hanh, HL_QUAI[q.duoi].hanh]; }
function hlDanhGia_(d) { return d >= 2 ? 'Đại cát' : d >= 1 ? 'Cát' : d >= 0.2 ? 'Khá' : d > -0.6 ? 'Bình' : d > -1.4 ? 'Hơi kém' : 'Hung'; }

/** Chấm & luận một năm */
function hlLuanNam_(n, bt) {
  var hy = bt.goiY.hy, ky = bt.goiY.ky, d = n.diem, ghi = [];
  [HL_QUAI[n.tren].hanh, HL_QUAI[n.duoi].hanh].forEach(function (h, i) {
    if (hy.indexOf(h) >= 0) { d += i ? 0.3 : 0.4; ghi.push((i ? 'nội' : 'ngoại') + ' quái ' + (i ? n.duoi : n.tren) + ' (' + h + ') hợp dụng thần'); }
    if (ky.indexOf(h) >= 0) { d -= i ? 0.2 : 0.3; ghi.push((i ? 'nội' : 'ngoại') + ' quái ' + (i ? n.duoi : n.tren) + ' (' + h + ') là kỵ thần'); }
  });
  var Q = HL_QUE[n.so - 1];
  return { diem: Math.round(d * 10) / 10, danhGia: hlDanhGia_(d), y: Q[4], khuyen: Q[5], ghi: ghi };
}

function haLacLuan(hl, bt, viewYear) {
  var T = hl.tien, H = hl.hau, secs = [];
  function qStr(q) { return q.ten + ' (quẻ số ' + q.so + ': ' + HL_QUAI[q.tren].tuong + ' ' + q.tren + ' trên, ' + HL_QUAI[q.duoi].tuong + ' ' + q.duoi + ' dưới)'; }
  secs.push({ tieuDe: 'Lập số Hà Lạc', items: hl.chiTiet.concat([
    'Tổng Thiên số (số lẻ) = ' + hl.thien + ' → ' + hl.thienN + ' → quái ' + hl.quaiThien + '; tổng Địa số (số chẵn) = ' + hl.dia + ' → ' + hl.diaN + ' → quái ' + hl.quaiDia + '.',
    (hl.thuan ? 'Dương nam/âm nữ: quái Thiên số làm thượng quái.' : 'Âm nam/dương nữ: quái Địa số làm thượng quái.') + ' Sinh thuộc ' + hl.nguyen + ' (dùng khi gặp số 5).',
    'Giờ sinh ' + (hl.gioDuong ? 'dương (Tý → Tỵ): lấy hào dương' : 'âm (Ngọ → Hợi): lấy hào âm') + ' làm nguyên đường → hào ' + T.nguyenDuong + '.'
  ]) });
  var hT = hlDiemHao_(T, T.nguyenDuong);
  secs.push({ tieuDe: 'Quẻ Tiên thiên – ' + T.ten, items: [
    (T.diem >= 1 ? '✓ ' : T.diem <= -1 ? '✗ ' : '◇ ') + qStr(T) + ': ' + T.y + '.',
    'Quẻ Tiên thiên chủ vận nửa đầu đời và bản chất bẩm sinh. Lời khuyên: ' + T.khuyen + '.',
    'Hào nguyên đường ' + HL_HAO_VI[T.nguyenDuong][0] + ' (' + (hT.duong ? 'dương' : 'âm') + (hT.dacVi ? ', đắc vị' : ', thất vị') + (hT.trung ? ', đắc trung' : '') + (hT.ung ? ', có ứng' : ', không ứng') + '): ' + HL_HAO_VI[T.nguyenDuong][1] + '.',
    'Thượng quái ' + T.tren + ' – ' + HL_QUAI[T.tren].y + '; hạ quái ' + T.duoi + ' – ' + HL_QUAI[T.duoi].y + '.'
  ] });
  secs.push({ tieuDe: 'Quẻ Hậu thiên – ' + H.ten, items: [
    (H.diem >= 1 ? '✓ ' : H.diem <= -1 ? '✗ ' : '◇ ') + qStr(H) + ': ' + H.y + '.',
    'Quẻ Hậu thiên chủ vận nửa sau đời và kết quả của nỗ lực. Lời khuyên: ' + H.khuyen + '.',
    'Nguyên đường dời sang ' + HL_HAO_VI[H.nguyenDuong][0] + ': ' + HL_HAO_VI[H.nguyenDuong][1] + '.',
    (T.diem + H.diem >= 2 ? '✓ Tiên – Hậu thiên đều tốt: đời thuận, càng về sau càng vững.' : T.diem < H.diem ? '✓ Hậu thiên tốt hơn Tiên thiên: tiền vận vất vả, hậu vận khá lên – "tiền hung hậu cát".' : T.diem > H.diem ? '◇ Tiên thiên tốt hơn Hậu thiên: tuổi trẻ thuận lợi, trung – hậu vận cần giữ gìn thành quả.' : '◇ Tiên – Hậu thiên cân bằng: đời bình ổn, thành bại tùy nỗ lực.')
  ] });
  secs.push({ tieuDe: 'Quẻ Hỗ (diễn biến ẩn bên trong)', items: [
    'Hỗ của Tiên thiên: ' + hl.hoTien.ten + ' – ' + hl.hoTien.y + '. Cho biết điều âm thầm chi phối tuổi trẻ.',
    'Hỗ của Hậu thiên: ' + hl.hoHau.ten + ' – ' + hl.hoHau.y + '. Cho biết điều âm thầm chi phối trung – hậu vận.'
  ] });
  var dvL = hl.daiVan.map(function (v) {
    var dg = v.diemHao.diem + v.bienDiem * 0.4;
    var nay = viewYear >= v.namTu && viewYear <= v.namDen;
    return { ten: v.que + ' · ' + v.haoTen + ' (' + (v.duong ? 'dương – 9 năm' : 'âm – 6 năm') + ')', khoang: v.tuoiTu + '–' + v.tuoiDen + ' tuổi', nam: v.namTu + '–' + v.namDen, isNow: nay,
      diem: Math.round(dg * 10) / 10, danhGia: hlDanhGia_(dg),
      items: [
        'Quẻ gốc ' + v.goc + ', hào ' + v.hao + ' ' + (v.duong ? 'dương' : 'âm') + (v.diemHao.dacVi ? ' đắc vị' : ' thất vị') + (v.diemHao.trung ? ', đắc trung' : '') + (v.diemHao.ung ? ', có ứng' : '') + ': ' + HL_HAO_VI[v.hao][1] + '.',
        'Quẻ biến của vận: ' + v.bien + ' – ' + HL_QUE[v.bienSo - 1][4] + '. Nên: ' + HL_QUE[v.bienSo - 1][5] + '.',
        (dg >= 1 ? '✓ Vận hào tốt: thời cơ mở, nên chủ động tiến.' : dg <= -0.6 ? '✗ Vận hào kém: thời bất lợi, nên thủ, giữ sức và tích lũy.' : '◇ Vận hào trung bình: được mất đan xen, thành bại do cách ứng xử.')
      ],
      cacNam: v.nam.map(function (n) { var L = hlLuanNam_(n, bt); return { nam: n.nam, tuoi: n.tuoi, que: n.que, hao: n.hao, diem: L.diem, danhGia: L.danhGia, y: L.y, khuyen: L.khuyen, ghi: L.ghi }; }) };
  });
  var tatCa = []; dvL.forEach(function (v) { tatCa = tatCa.concat(v.cacNam); });
  var nayN = tatCa.filter(function (n) { return n.nam === viewYear; })[0];
  var sap = tatCa.filter(function (n) { return n.nam >= viewYear && n.nam < viewYear + 10; });
  var tot = sap.slice().sort(function (a, b) { return b.diem - a.diem; }).slice(0, 3), xau = sap.slice().sort(function (a, b) { return a.diem - b.diem; }).slice(0, 2);
  var tq = [];
  if (nayN) tq.push('Năm ' + viewYear + ' (' + nayN.tuoi + ' tuổi): quẻ ' + nayN.que + ', hào động ' + nayN.hao + ' – ' + nayN.danhGia + '. ' + nayN.y + '; nên ' + nayN.khuyen + '.');
  tq.push('10 năm tới – năm sáng nhất theo quẻ: ' + tot.map(function (n) { return n.nam + ' (' + n.que + ')'; }).join(', ') + '; năm cần thận trọng: ' + xau.map(function (n) { return n.nam + ' (' + n.que + ')'; }).join(', ') + '.');
  return { secs: secs, daiVan: dvL, namNay: nayN, tongQuan: tq, nam: tatCa,
    coSo: [
      'Can: Giáp, Nhâm = 6; Ất, Quý = 2; Bính = 8; Đinh = 7; Mậu = 1; Kỷ = 9; Canh = 3; Tân = 4. Chi: Tý, Hợi = 1·6; Dần, Mão = 3·8; Tỵ, Ngọ = 2·7; Thân, Dậu = 4·9; Thìn, Tuất, Sửu, Mùi = 5·10 (Hà Đồ).',
      'Thiên số trừ 25, Địa số trừ 30 (nếu vượt), còn quá 10 thì bỏ hàng chục; số → quái theo Lạc Thư hậu thiên. Số 5: Thượng nguyên nam Cấn nữ Khôn; Trung nguyên dương nam/âm nữ Cấn, âm nam/dương nữ Khôn; Hạ nguyên nam Ly nữ Đoài.',
      'Hào nguyên đường theo giờ; quẻ Hậu thiên = biến hào nguyên đường rồi đảo thượng – hạ quái; quẻ Hỗ lấy hào 2-3-4 và 3-4-5.',
      'Đại vận: hào dương 9 năm, hào âm 6 năm, đi từ nguyên đường lên và vòng đủ 6 hào; Tiên thiên xong chuyển Hậu thiên. Lưu niên: biến lần lượt từng hào mỗi năm.',
      'Điểm hào = cát/hung của quẻ + đắc vị (dương hào lẻ, âm hào chẵn) + đắc trung (hào 2, 5) + có ứng (1–4, 2–5, 3–6 khác âm dương); điểm năm cộng/trừ theo ngũ hành quái so với dụng thần Bát Tự.'
    ] };
}
