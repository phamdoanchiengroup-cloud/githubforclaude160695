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
  var lucHao = { tien: hlLucHao_(tien, tien.nguyenDuong, bt), hau: hlLucHao_(hau, hau.nguyenDuong, bt) };
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
      var lh = lucHao[x[1] === 'Tiên thiên' ? 'tien' : 'hau'].hao[p - 1];
      dv.push({ que: x[1], goc: q.ten, hao: p, lucThan: lh.lucThan, haoCanChi: lh.canChi, haoDiem: lh.diem, haoTen: HL_HAO_VI[p][0], duong: q.hao[p - 1] === 1, tuoiTu: tuoi, tuoiDen: tuoi + soNam - 1,
        namTu: tv.info.lunar.year + tuoi - 1, namDen: tv.info.lunar.year + tuoi + soNam - 2, bien: dq.ten, bienSo: dq.so, bienDiem: dq.diem, diemHao: dh, nam: nam });
      tuoi += soNam;
    }
  });
  return { thien: thien, dia: dia, thienN: tN, diaN: dN, quaiThien: qT, quaiDia: qD, chiTiet: ct, thuan: thuan,
    tien: tien, hau: hau, hoTien: hoTien, hoHau: hoHau, daiVan: dv, gioDuong: gioDuong, male: male, lucHao: lucHao, tuoiHau: dv[6].tuoiTu, nguyen: namAm < 1924 ? 'Thượng nguyên' : namAm < 1984 ? 'Trung nguyên' : 'Hạ nguyên' };
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
      diem: Math.round(dg * 10) / 10, danhGia: hlDanhGia_(dg), lucThan: v.lucThan,
      items: [
        'Quẻ gốc ' + v.goc + ', hào ' + v.hao + ' ' + (v.duong ? 'dương' : 'âm') + (v.diemHao.dacVi ? ' đắc vị' : ' thất vị') + (v.diemHao.trung ? ', đắc trung' : '') + (v.diemHao.ung ? ', có ứng' : '') + ': ' + HL_HAO_VI[v.hao][1] + '.',
        'Quẻ biến của vận: ' + v.bien + ' – ' + HL_QUE[v.bienSo - 1][4] + '. Nên: ' + HL_QUE[v.bienSo - 1][5] + '.',
        'Hào cai quản chặng này là ' + v.lucThan + ' (' + v.haoCanChi + ', ' + hlMuc_(v.haoDiem).toLowerCase() + '): chủ đề nổi bật là ' + HL_LT_CHU_DE[v.lucThan](hl.male) + '.',
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
  var lv = hlLinhVuc_(hl), tv = hlThoiVi_(hl, bt);
  return { secs: secs, daiVan: dvL, namNay: nayN, tongQuan: tq, nam: tatCa, linhVuc: lv, thoiVi: tv, queKhac: hlQueKhac_(hl), tuoiHau: hl.tuoiHau,
    coSo: [
      'Can: Giáp, Nhâm = 6; Ất, Quý = 2; Bính = 8; Đinh = 7; Mậu = 1; Kỷ = 9; Canh = 3; Tân = 4. Chi: Tý, Hợi = 1·6; Dần, Mão = 3·8; Tỵ, Ngọ = 2·7; Thân, Dậu = 4·9; Thìn, Tuất, Sửu, Mùi = 5·10 (Hà Đồ).',
      'Thiên số trừ 25, Địa số trừ 30 (nếu vượt), còn quá 10 thì bỏ hàng chục; số → quái theo Lạc Thư hậu thiên. Số 5: Thượng nguyên nam Cấn nữ Khôn; Trung nguyên dương nam/âm nữ Cấn, âm nam/dương nữ Khôn; Hạ nguyên nam Ly nữ Đoài.',
      'Hào nguyên đường theo giờ; quẻ Hậu thiên = biến hào nguyên đường rồi đảo thượng – hạ quái; quẻ Hỗ lấy hào 2-3-4 và 3-4-5.',
      'Đại vận: hào dương 9 năm, hào âm 6 năm, đi từ nguyên đường lên và vòng đủ 6 hào; Tiên thiên xong chuyển Hậu thiên. Lưu niên: biến lần lượt từng hào mỗi năm.',
      'Lục hào nạp giáp (Kinh Phòng): quẻ thuộc một trong tám cung, hào Thế – Ứng theo thứ tự trong cung; mỗi hào nạp một can chi; lục thân so hành hào với hành cung (đồng hành Huynh Đệ, cung sinh hào Tử Tôn, cung khắc hào Thê Tài, hào khắc cung Quan Quỷ, hào sinh cung Phụ Mẫu); lục thú khởi theo can ngày sinh; lục thân vắng thì tìm phục thần ở quẻ Bát thuần của cung.',
      'Sức của hào: lệnh tháng sinh (vượng, tướng, hưu, tù, tử), ngày sinh sinh – phù – khắc – xung, nguyệt phá, không vong theo tuần của ngày sinh; hào nguyên đường là hào động, biến ra hào hóa (hồi đầu sinh / khắc, hóa tiến / thoái). Mỗi lĩnh vực lấy lục thân làm dụng thần, xét thêm nguyên thần (sinh dụng) và kỵ thần (khắc dụng).',
      'Hóa công: quẻ có quái hợp mùa tháng sinh (Xuân Chấn Tốn, Hạ Ly, Thu Càn Đoài, Đông Khảm, tháng Tứ quý Khôn Cấn). Nguyên khí: quẻ có quái nạp can năm sinh (Giáp Nhâm Càn, Ất Quý Khôn, Bính Cấn, Đinh Đoài, Mậu Khảm, Kỷ Ly, Canh Chấn, Tân Tốn).',
      'Điểm hào = cát/hung của quẻ + đắc vị (dương hào lẻ, âm hào chẵn) + đắc trung (hào 2, 5) + có ứng (1–4, 2–5, 3–6 khác âm dương); điểm năm cộng/trừ theo ngũ hành quái so với dụng thần Bát Tự.'
    ] };
}

/* ============================================================
 *  LỤC HÀO NẠP GIÁP (Kinh Phòng) ÁP VÀO QUẺ HÀ LẠC
 *  - Bát cung: mỗi quẻ thuộc một cung (Càn, Đoài, Ly, Chấn, Tốn, Khảm, Cấn, Khôn);
 *    thứ tự trong cung: Bát thuần, Nhất → Ngũ thế, Du hồn, Quy hồn → vị trí hào Thế; Ứng cách Thế 3 hào.
 *  - Nạp giáp: mỗi hào nhận một can chi theo quái trong / ngoài.
 *  - Lục thân so hành của hào với hành của cung: đồng hành Huynh Đệ, cung sinh hào Tử Tôn,
 *    cung khắc hào Thê Tài, hào khắc cung Quan Quỷ, hào sinh cung Phụ Mẫu.
 *  - Lục thú theo can ngày sinh (Giáp Ất khởi Thanh Long … Nhâm Quý khởi Huyền Vũ), đi từ hào 1 lên.
 *  - Phục thần: lục thân vắng mặt thì tìm ở quẻ Bát thuần của cung, nấp dưới hào cùng vị trí (phi thần).
 *  - Vượng suy: xét theo lệnh tháng sinh (vượng, tướng, hưu, tù, tử) và nhật thần (ngày sinh);
 *    nguyệt phá (tháng xung), nhật phá, không vong (tuần của ngày sinh).
 *  - Hào nguyên đường là hào động: biến ra hào hóa – hồi đầu sinh / khắc, hóa tiến / thoái.
 * ============================================================ */
var HL_NAP = {
  'Càn': [[0, [0, 2, 4]], [8, [6, 8, 10]]], 'Khôn': [[1, [7, 5, 3]], [9, [1, 11, 9]]],
  'Chấn': [[6, [0, 2, 4]], [6, [6, 8, 10]]], 'Tốn': [[7, [1, 11, 9]], [7, [7, 5, 3]]],
  'Khảm': [[4, [2, 4, 6]], [4, [8, 10, 0]]], 'Ly': [[5, [3, 1, 11]], [5, [9, 7, 5]]],
  'Cấn': [[2, [4, 6, 8]], [2, [10, 0, 2]]], 'Đoài': [[3, [5, 3, 1]], [3, [11, 9, 7]]]
};
var HL_THE_TEN = ['Bát thuần', 'Nhất thế', 'Nhị thế', 'Tam thế', 'Tứ thế', 'Ngũ thế', 'Du hồn', 'Quy hồn'];
var HL_THE_VI = [6, 1, 2, 3, 4, 5, 4, 3];
var HL_LT = ['Huynh Đệ', 'Tử Tôn', 'Thê Tài', 'Quan Quỷ', 'Phụ Mẫu'];
var HL_LT_QH = { binh: 0, sinh: 1, khac: 2, bi_khac: 3, duoc_sinh: 4 };
var HL_LT_Y = {
  'Phụ Mẫu': 'cha mẹ, bề trên, nhà cửa, học vấn, giấy tờ – cũng là sự vất vả, che chở',
  'Huynh Đệ': 'anh chị em, bạn bè, đồng nghiệp ngang hàng – cũng là cạnh tranh, hao tài',
  'Tử Tôn': 'con cái, học trò, niềm vui, phúc đức – cũng là "thuốc" hóa giải bệnh, tai',
  'Thê Tài': 'tiền bạc, tài sản; với nam còn là vợ, người yêu',
  'Quan Quỷ': 'công danh, chức vụ, áp lực, luật lệ; với nữ còn là chồng; cũng là bệnh tật, lo âu'
};
var HL_THU = ['Thanh Long', 'Chu Tước', 'Câu Trần', 'Đằng Xà', 'Bạch Hổ', 'Huyền Vũ'];
var HL_THU_KHOI = [0, 0, 1, 1, 2, 3, 4, 4, 5, 5];
var HL_THU_Y = {
  'Thanh Long': 'hiền hòa, may mắn, được quý mến', 'Chu Tước': 'lời nói, chữ nghĩa, tranh luận',
  'Câu Trần': 'chậm mà chắc, gắn với đất đai, ruộng vườn', 'Đằng Xà': 'hay lo nghĩ, nhạy cảm, nhiều biến hóa',
  'Bạch Hổ': 'cương quyết, nóng, dễ va chạm', 'Huyền Vũ': 'kín đáo, mưu trí, có chuyện riêng tư'
};
var HL_THE_NHAN = { binh: 'Vượng', sinh: 'Tướng', duoc_sinh: 'Hưu', bi_khac: 'Tù', khac: 'Tử' };
var HL_THE_DIEM = { 'Vượng': 2, 'Tướng': 1.2, 'Hưu': -0.4, 'Tù': -0.9, 'Tử': -1.4 };
var HL_TIEN = { 11: 0, 2: 3, 5: 6, 8: 9, 1: 4, 4: 7, 7: 10, 10: 1 };
var HL_CUNG_MAP = null;

/** Bảng tra 64 quẻ → { cung, the (0..7) } dựng theo quy tắc biến hào của bát cung */
function hlCungMap_() {
  if (HL_CUNG_MAP) return HL_CUNG_MAP;
  var M = {};
  Object.keys(HL_QUAI).forEach(function (k) {
    var h = HL_QUAI[k].l.concat(HL_QUAI[k].l), seq = [h.slice()];
    for (var i = 1; i <= 5; i++) { h = hlBien_(h, i); seq.push(h.slice()); }
    h = hlBien_(h, 4); seq.push(h.slice());
    h = HL_QUAI[k].l.concat(h.slice(3)); seq.push(h.slice());
    seq.forEach(function (x, j) { M[x.join('')] = { cung: k, the: j }; });
  });
  return (HL_CUNG_MAP = M);
}
/** Can chi nạp giáp cho 6 hào (dưới lên) */
function hlNapHao_(hao) {
  var d = hlQuaiTuLines_(hao.slice(0, 3)), t = hlQuaiTuLines_(hao.slice(3, 6)), r = [], i;
  for (i = 0; i < 3; i++) r.push({ can: HL_NAP[d][0][0], chi: HL_NAP[d][0][1][i] });
  for (i = 0; i < 3; i++) r.push({ can: HL_NAP[t][1][0], chi: HL_NAP[t][1][1][i] });
  return r;
}
function hlLucThan_(cungHanh, h) { return HL_LT[HL_LT_QH[quanHeHanh(cungHanh, h)]]; }
/** Không vong theo tuần của trụ ngày */
function hlKhongVong_(can, chi) { var a = (chi - can + 22) % 12; return [a, (a + 1) % 12]; }
/** Sức của một chi (hành) theo tháng và ngày sinh */
function hlSuc_(chi, mChi, dChi, kv) {
  var h = CHI_HANH[chi], ghi = [], the = HL_THE_NHAN[quanHeHanh(CHI_HANH[mChi], h)], d = HL_THE_DIEM[the];
  var phaT = (chi + 6) % 12 === mChi, qhN = quanHeHanh(CHI_HANH[dChi], h), dn = 0;
  if (phaT) { d = Math.min(d, -1.4); ghi.push('nguyệt phá (tháng sinh xung)'); }
  if (chi === mChi) ghi.push('lâm nguyệt kiến');
  if (chi === dChi) { dn = 1.2; ghi.push('lâm nhật thần'); }
  else if (qhN === 'binh' || qhN === 'sinh') { dn = 0.8; ghi.push('được ngày sinh ' + (qhN === 'sinh' ? 'sinh' : 'phù')); }
  else if (qhN === 'khac') { dn = -0.8; ghi.push('bị ngày sinh khắc'); }
  if ((chi + 6) % 12 === dChi) {
    if (d > 0) ghi.push('ám động (ngày xung hào vượng)'); else { dn -= 0.8; ghi.push('nhật phá (ngày xung hào suy)'); }
  }
  var khong = kv.indexOf(chi) >= 0;
  if (khong) ghi.push('không vong');
  var s = d + dn + (khong ? (d + dn > 0.5 ? -0.4 : -1) : 0);
  return { the: the, diem: Math.round(s * 10) / 10, khong: khong, pha: phaT, ghi: ghi };
}
function hlMuc_(s) { return s >= 2 ? 'Rất mạnh' : s >= 0.8 ? 'Mạnh' : s >= -0.4 ? 'Trung bình' : s >= -1.5 ? 'Yếu' : 'Rất yếu'; }

/** Dựng lục hào đầy đủ cho một quẻ; nd = hào động (nguyên đường) */
function hlLucHao_(q, nd, bt) {
  var P = bt.pillars, mChi = P[1].chi, dCan = P[2].can, dChi = P[2].chi, kv = hlKhongVong_(dCan, dChi);
  var cm = hlCungMap_()[q.hao.join('')], cung = cm.cung, cungHanh = HL_QUAI[cung].hanh;
  var the = HL_THE_VI[cm.the], ung = the > 3 ? the - 3 : the + 3, nap = hlNapHao_(q.hao);
  var bienHao = hlBien_(q.hao, nd), napB = hlNapHao_(bienHao)[nd - 1], bienQ = hlTuHao_(bienHao);
  var hao = nap.map(function (x, i) {
    var p = i + 1, h = CHI_HANH[x.chi], s = hlSuc_(x.chi, mChi, dChi, kv);
    return { vi: p, duong: q.hao[i] === 1, can: x.can, chi: x.chi, canChi: CAN[x.can] + ' ' + CHI[x.chi], hanh: h,
      lucThan: hlLucThan_(cungHanh, h), thu: HL_THU[(HL_THU_KHOI[dCan] + i) % 6], the: p === the, ung: p === ung, dong: p === nd,
      suc: s, diem: s.diem };
  });
  // Hào động biến → hào hóa
  var goc = hao[nd - 1], hH = CHI_HANH[napB.chi], qh = quanHeHanh(hH, goc.hanh), hoa = { canChi: CAN[napB.can] + ' ' + CHI[napB.chi], chi: napB.chi, hanh: hH, lucThan: hlLucThan_(cungHanh, hH), kieu: '', diem: 0 };
  if (qh === 'sinh') { hoa.kieu = 'hồi đầu sinh'; hoa.diem = 1; }
  else if (qh === 'khac') { hoa.kieu = 'hồi đầu khắc'; hoa.diem = -1.4; }
  else if (qh === 'duoc_sinh') { hoa.kieu = 'hóa tiết (hào gốc sinh cho hào hóa)'; hoa.diem = -0.4; }
  else if (qh === 'bi_khac') { hoa.kieu = 'hóa ra hào bị mình khắc (tốn sức)'; hoa.diem = -0.2; }
  else if (HL_TIEN[goc.chi] === napB.chi) { hoa.kieu = 'hóa tiến'; hoa.diem = 0.8; }
  else if (HL_TIEN[napB.chi] === goc.chi) { hoa.kieu = 'hóa thoái'; hoa.diem = -0.8; }
  else { hoa.kieu = 'hóa đồng hành'; hoa.diem = 0.2; }
  if (kv.indexOf(napB.chi) >= 0) { hoa.kieu += ', hóa không'; hoa.diem -= 0.4; }
  if ((napB.chi + 6) % 12 === mChi) { hoa.kieu += ', hóa phá'; hoa.diem -= 0.4; }
  goc.hoa = hoa; goc.diem = Math.round((goc.diem + 0.3 + hoa.diem) * 10) / 10;
  // Hào động sinh / khắc các hào tĩnh
  hao.forEach(function (x) {
    if (x.dong) return;
    var r = quanHeHanh(goc.hanh, x.hanh);
    if (r === 'sinh') { x.diem += 0.6; x.dongTac = 'được hào động sinh'; }
    else if (r === 'khac') { x.diem -= 0.7; x.dongTac = 'bị hào động khắc'; }
    x.diem = Math.round(x.diem * 10) / 10;
  });
  // Phục thần
  var coMat = {}; hao.forEach(function (x) { coMat[x.lucThan] = 1; });
  var thuan = HL_QUAI[cung].l.concat(HL_QUAI[cung].l), napT = hlNapHao_(thuan), phuc = [];
  HL_LT.forEach(function (lt) {
    if (coMat[lt]) return;
    for (var i = 0; i < 6; i++) {
      var h = CHI_HANH[napT[i].chi];
      if (hlLucThan_(cungHanh, h) !== lt) continue;
      var phi = hao[i], r = quanHeHanh(phi.hanh, h), s = hlSuc_(napT[i].chi, mChi, dChi, kv), d = s.diem - 0.5, qhT;
      if (r === 'sinh') { d += 0.5; qhT = 'phi thần sinh phục thần – dễ lộ ra'; }
      else if (r === 'khac') { d -= 1; qhT = 'phi thần khắc phục thần – bị đè nén'; }
      else if (r === 'bi_khac') { d += 0.2; qhT = 'phục thần khắc được phi thần – tự trồi lên'; }
      else if (r === 'duoc_sinh') { d -= 0.3; qhT = 'phục thần sinh phi thần – hao sức'; }
      else qhT = 'phục thần cùng hành phi thần';
      d = Math.min(d, 1);
      phuc.push({ lucThan: lt, vi: i + 1, canChi: CAN[napT[i].can] + ' ' + CHI[napT[i].chi], hanh: h, suc: s, diem: Math.round(d * 10) / 10, phi: phi.lucThan + ' ' + phi.canChi, quanHe: qhT });
      break;
    }
  });
  return { que: q.ten, cung: cung, cungHanh: cungHanh, theTen: HL_THE_TEN[cm.the], theVi: the, ungVi: ung, dong: nd, bien: bienQ.ten, bienSo: bienQ.so,
    khongVong: kv.map(function (c) { return CHI[c]; }), thang: CHI[mChi], ngay: CAN[dCan] + ' ' + CHI[dChi], hao: hao, phuc: phuc };
}

/** Sức của một lục thân trong quẻ (xét hào mạnh nhất / hào trì Thế, nguyên thần, kỵ thần, phục thần) */
var HL_SINH_LT = { 'Phụ Mẫu': 'Huynh Đệ', 'Huynh Đệ': 'Tử Tôn', 'Tử Tôn': 'Thê Tài', 'Thê Tài': 'Quan Quỷ', 'Quan Quỷ': 'Phụ Mẫu' };
var HL_KHAC_LT = { 'Phụ Mẫu': 'Tử Tôn', 'Huynh Đệ': 'Thê Tài', 'Tử Tôn': 'Quan Quỷ', 'Thê Tài': 'Phụ Mẫu', 'Quan Quỷ': 'Huynh Đệ' };
function hlNguyenThan_(lt) { for (var k in HL_SINH_LT) if (HL_SINH_LT[k] === lt) return k; }
function hlKyThan_(lt) { for (var k in HL_KHAC_LT) if (HL_KHAC_LT[k] === lt) return k; }
function hlLucThanSuc_(LH, lt) {
  var ds = LH.hao.filter(function (x) { return x.lucThan === lt; }), ghi = [], d, chon = null, phuc = null;
  function manh(t) { var a = LH.hao.filter(function (x) { return x.lucThan === t; }); return a.length ? a.reduce(function (m, x) { return x.diem > m.diem ? x : m; }) : null; }
  if (ds.length) {
    chon = ds.filter(function (x) { return x.the || x.dong; })[0] || ds.reduce(function (m, x) { return x.diem > m.diem ? x : m; });
    d = chon.diem;
    ghi.push(lt + ' hiện ở hào ' + ds.map(function (x) { return x.vi; }).join(', ') + '; xét hào ' + chon.vi + ' (' + chon.canChi + ', ' + chon.hanh + ' – ' + chon.suc.the.toLowerCase() + (chon.suc.ghi.length ? ', ' + chon.suc.ghi.join(', ') : '') + ')');
    if (ds.length >= 3) { d -= 0.3; ghi.push('xuất hiện ' + ds.length + ' lần – phân tán'); }
    if (chon.the) { d += 0.4; ghi.push('trì Thế – gắn chặt với bản thân'); }
    if (chon.ung) ghi.push('ở hào Ứng – đến từ bên ngoài, người khác');
    if (chon.dong) ghi.push('là hào động, ' + chon.hoa.kieu + ' (hóa ' + chon.hoa.canChi + ')');
    if (chon.dongTac) ghi.push(chon.dongTac);
  } else {
    phuc = LH.phuc.filter(function (x) { return x.lucThan === lt; })[0];
    d = phuc ? phuc.diem : -1.5;
    ghi.push(phuc ? lt + ' không hiện – phục (ẩn) dưới hào ' + phuc.vi + ' ' + phuc.phi + '; ' + phuc.quanHe : lt + ' không hiện trên quẻ');
  }
  var nt = manh(hlNguyenThan_(lt)), kt = manh(hlKyThan_(lt));
  if (nt && nt.dong) { d += 0.7; ghi.push('nguyên thần ' + nt.lucThan + ' động sinh trợ'); }
  else if (nt && nt.diem > 0.5) { d += 0.3; ghi.push('nguyên thần ' + nt.lucThan + ' vượng'); }
  if (kt && kt.dong) { d -= 0.8; ghi.push('kỵ thần ' + kt.lucThan + ' động khắc'); }
  else if (kt && kt.diem > 1) { d -= 0.4; ghi.push('kỵ thần ' + kt.lucThan + ' vượng'); }
  d = Math.round(d * 10) / 10;
  return { lucThan: lt, diem: d, muc: hlMuc_(d), hien: ds.length, hao: chon, phuc: phuc, ghi: ghi };
}

/* ---------- Luận lục thân theo lĩnh vực ---------- */
var HL_LT_CHU_DE = {
  'Phụ Mẫu': function () { return 'học hành, giấy tờ, nhà cửa, cha mẹ – nhiều việc phải lo nhưng cũng được che chở'; },
  'Huynh Đệ': function () { return 'bạn bè, anh em, hợp tác – vui vì có người đồng hành nhưng dễ hao tiền, cạnh tranh'; },
  'Tử Tôn': function () { return 'con cái, niềm vui, sáng tạo, sức khỏe hồi phục – thời an nhàn nhưng công danh ít bứt phá'; },
  'Thê Tài': function (m) { return 'tiền bạc, tài sản' + (m ? ', vợ và chuyện gia đình riêng' : '') + ' – cơ hội kiếm tiền nhưng cũng tốn công lo toan'; },
  'Quan Quỷ': function (m) { return 'công danh, trách nhiệm, áp lực' + (m ? '' : ', chồng và hôn nhân') + ' – dễ thăng tiến nhưng cần giữ sức khỏe'; }
};
var HL_THE_TRI = {
  'Huynh Đệ': 'Bạn coi trọng sự tự lập và tình bạn, sống thẳng thắn; tiền bạc thì dễ "vào nhanh, ra cũng nhanh".',
  'Tử Tôn': 'Bạn thích sống an nhiên, vui vẻ, ít màng danh lợi; hợp nghề tự do, sáng tạo hoặc chăm sóc người khác.',
  'Thê Tài': 'Bạn thực tế, nhạy với chuyện tiền bạc và biết tính toán cho cuộc sống.',
  'Quan Quỷ': 'Bạn có tinh thần trách nhiệm cao, hợp môi trường có tổ chức, kỷ luật – nhưng hay giữ áp lực, lo nghĩ trong lòng.',
  'Phụ Mẫu': 'Bạn chịu khó, ham học, hay lo toan cho người khác; đời nhiều việc phải gánh nhưng được tiếng là người đáng tin.'
};
var HL_THE_UNG = {
  sinh: 'Người ngoài, đối tác thường có lòng giúp bạn.',
  khac: 'Bạn hay gặp người cạnh tranh, dễ va chạm – nên rõ ràng ngay từ đầu trong hợp tác.',
  duoc_sinh: 'Bạn hay cho đi, giúp người – điều tốt, nhưng nhớ giữ sức cho mình.',
  bi_khac: 'Bạn thường nắm thế chủ động trong các mối quan hệ.',
  binh: 'Bạn và người xung quanh thường ngang hàng, hợp tác kiểu bạn bè.'
};
var HL_TANG = { 'Mộc': 'gan, mật, gân cơ, mắt', 'Hỏa': 'tim, mạch máu, huyết áp, giấc ngủ', 'Thổ': 'dạ dày, tiêu hóa', 'Kim': 'phổi, đường hô hấp, da', 'Thủy': 'thận, bàng quang, hệ sinh dục' };
var HL_LV = [
  { k: 'banThan', ten: 'Bản thân', icon: '🧭', nhom: 'tinh_cach', dung: 'THE', giai: 'hào Thế – chỗ đứng của chính bạn trong quẻ',
    van: ['Bạn thuộc mẫu người có nội lực vững: tự đứng được trên đôi chân mình, gặp việc khó thường vẫn tìm ra lối đi.',
      'Bạn có xu hướng lúc tự tin, lúc chùn bước; thành bại phụ thuộc khá nhiều vào môi trường và người đồng hành.',
      'Bạn có xu hướng hay tự nghi ngờ bản thân, dễ thấy mình bị động hoặc thiếu người chống lưng.'],
    khuyen: ['Nội lực tốt là vốn quý – hãy dùng nó để kéo người khác cùng đi, đừng chỉ đi một mình.',
      'Chọn môi trường và người đồng hành thật kỹ – với bạn, "đứng đúng chỗ" quan trọng ngang "cố gắng".',
      'Không sao cả – nội lực rèn được. Bắt đầu từ những cam kết nhỏ và giữ đúng lời, sự tự tin sẽ lớn dần.'] },
  { k: 'chaMe', ten: 'Cha mẹ – nhà cửa – học vấn', icon: '🏠', nhom: 'gia_dao', dung: 'Phụ Mẫu', giai: 'hào Phụ Mẫu – cha mẹ, bề trên, nhà cửa, giấy tờ, học hành',
    van: ['Bạn có xu hướng được cha mẹ, người lớn che chở; chuyện học hành, giấy tờ, nhà cửa thường thuận.',
      'Quan hệ với cha mẹ và chuyện học hành, nhà cửa của bạn ở mức bình thường – có lúc thuận, có lúc phải tự lo.',
      'Bạn có xu hướng sớm phải tự lập, ít dựa được vào gia đình; học hành, nhà cửa đến muộn hoặc phải tự gây dựng.'],
    khuyen: ['Hãy tận dụng sự hỗ trợ này để học đến nơi đến chốn, và báo hiếu khi còn có thể.',
      'Giữ liên lạc đều đặn với cha mẹ; giấy tờ quan trọng nên đọc kỹ trước khi ký.',
      'Sự tự lập sớm là sức mạnh. Chủ động học thêm, quan tâm sức khỏe cha mẹ; nhà cửa nên tích lũy dần, không vội vay lớn.'] },
  { k: 'anhEm', ten: 'Anh chị em – bạn bè', icon: '🤝', nhom: 'gia_dao', dung: 'Huynh Đệ', giai: 'hào Huynh Đệ – anh chị em, bạn bè, đồng nghiệp ngang hàng',
    van: ['Bạn có xu hướng đông bạn bè, anh chị em gắn bó, dễ tìm được người cùng chí hướng.',
      'Anh chị em, bạn bè của bạn ở mức vừa phải – thân thiết với vài người, còn lại là xã giao.',
      'Bạn có xu hướng ít nhận được giúp đỡ từ anh em, bạn bè, hay phải tự xoay xở.'],
    khuyen: ['Bạn bè đông thì nhớ rạch ròi chuyện tiền bạc – "tình là tình, tiền là tiền".',
      'Đầu tư vào vài mối quan hệ sâu thay vì nhiều mối quan hệ hời hợt.',
      'Chủ động kết nối qua công việc, sở thích chung; một người bạn đúng giá trị hơn mười người quen.'] },
  { k: 'conCai', ten: 'Con cái – niềm vui', icon: '👶', nhom: 'con_cai', dung: 'Tử Tôn', giai: 'hào Tử Tôn – con cái, học trò, niềm vui, phúc đức',
    van: ['Bạn có xu hướng có phúc về con cái: con hiểu chuyện, là niềm vui lúc về sau; tâm tính bạn cũng khá lạc quan.',
      'Chuyện con cái của bạn ở mức bình thường – có vui có lo, cần đầu tư thời gian dạy dỗ.',
      'Bạn có xu hướng muộn con hoặc phải lo nghĩ nhiều cho con; niềm vui đến chậm hơn người khác.'],
    khuyen: ['Giữ nếp nhà ấm áp – đó là phúc lớn nhất bạn truyền lại cho con.',
      'Quan sát tính cách riêng của con để dạy cho phù hợp, thay vì so sánh với con người khác.',
      'Đừng quá lo – "muộn" không phải là "không". Chăm sức khỏe sớm, và khi có con hãy dành thời gian chất lượng thay vì chỉ lo vật chất.'] },
  { k: 'tienBac', ten: 'Tiền bạc – tài sản', icon: '💰', nhom: 'tai_chinh', dung: 'Thê Tài', giai: 'hào Thê Tài – tiền bạc, tài sản',
    van: ['Bạn có xu hướng kiếm tiền thuận, biết giữ tiền và có tài sản tích lũy theo thời gian.',
      'Tài chính của bạn ở mức đủ dùng – có kiếm, có tiêu; muốn dư dả cần có kế hoạch.',
      'Bạn có xu hướng tiền vào không đều, dễ hao hụt vì chi tiêu, cho vay hoặc cạnh tranh.'],
    khuyen: ['Lúc tiền đến thuận hãy lập quỹ dự phòng và đa dạng tài sản – thuận lúc này không có nghĩa là thuận mãi.',
      'Trích một phần thu nhập để tiết kiệm ngay khi nhận tiền, trước khi chi tiêu.',
      'Không cho vay số tiền mình chưa sẵn sàng mất; ưu tiên thu nhập ổn định trước, đầu tư sau.'] },
  { k: 'honNhan', ten: 'Hôn nhân – tình cảm', icon: '💞', nhom: 'tinh_duyen', dung: 'PHOI', giai: 'nam xem hào Thê Tài (vợ), nữ xem hào Quan Quỷ (chồng); thêm hào Ứng – người đối diện',
    van: ['Bạn có xu hướng gặp được người bạn đời hợp ý, hôn nhân có chỗ dựa.',
      'Chuyện tình cảm của bạn có thuận có nghịch – cần thời gian để hiểu nhau và vun đắp.',
      'Bạn có xu hướng duyên đến muộn hoặc tình cảm nhiều trắc trở, dễ hiểu lầm.'],
    khuyen: ['Giữ thói quen trò chuyện thật lòng – hôn nhân tốt vẫn cần được chăm mỗi ngày.',
      'Nói rõ nhu cầu của mình thay vì chờ người kia tự hiểu.',
      'Đừng vội vàng; chọn người hiểu mình hơn là người khiến mình say mê nhất thời. Kết hôn muộn một chút thường lại bền.'] },
  { k: 'congDanh', ten: 'Công danh – sự nghiệp', icon: '🏛', nhom: 'cong_danh', dung: 'Quan Quỷ', giai: 'hào Quan Quỷ – công danh, chức vụ, cấp trên, kỷ luật',
    van: ['Bạn có xu hướng được trọng dụng, có đường thăng tiến, hợp môi trường có tổ chức và chức danh rõ ràng.',
      'Công danh của bạn ở mức ổn – tiến chậm mà chắc, cần bền bỉ và có chuyên môn.',
      'Bạn có xu hướng khó thăng tiến trong bộ máy, dễ gặp áp lực hoặc cấp trên khó tính; hợp tự làm chủ, nghề tự do hơn.'],
    khuyen: ['Giữ chữ tín và học cách dẫn dắt người khác – đó là chìa khóa để lên cao hơn.',
      'Đầu tư sâu vào một chuyên môn; bằng cấp, chứng chỉ sẽ mở cửa cho bạn.',
      'Đây không phải là "không có sự nghiệp" – chỉ là con đường chuyên môn, tự do, kinh doanh nhỏ hợp bạn hơn con đường chức vụ.'] },
  { k: 'sucKhoe', ten: 'Sức khỏe', icon: '🌿', nhom: 'suc_khoe', dung: 'SK', giai: 'hào Quan Quỷ là bệnh, hào Tử Tôn là thuốc; thêm sức của hào Thế',
    van: ['Bạn có xu hướng thể trạng tốt, ốm vặt nhanh khỏi.',
      'Sức khỏe của bạn ở mức bình thường, cần để ý một vài điểm yếu.',
      'Bạn có xu hướng dễ mệt, hay lo âu hoặc có bệnh dai dẳng cần theo dõi.'],
    khuyen: ['Giữ nếp ngủ và vận động đều – thể trạng tốt cũng cần được bảo dưỡng.',
      'Khám định kỳ mỗi năm và để ý những vùng dưới đây.',
      'Đừng lo lắng quá – phát hiện sớm là chữa được. Khám định kỳ, ngủ đủ, giảm áp lực là "thuốc" tốt nhất.'] }
];
function hlBac_(d) { return d >= 0.8 ? 0 : d >= -0.6 ? 1 : 2; }
/** Chấm một lĩnh vực trên một quẻ lục hào */
function hlLvQue_(LV, LH, male) {
  if (LV.dung === 'THE') {
    var t = LH.hao[LH.theVi - 1], g = ['Hào Thế ở hào ' + t.vi + ': ' + t.lucThan + ' ' + t.canChi + ' (' + t.hanh + ' – ' + t.suc.the.toLowerCase() + (t.suc.ghi.length ? ', ' + t.suc.ghi.join(', ') : '') + ')' + (t.dong ? '; là hào động, ' + t.hoa.kieu : '') + (t.dongTac ? '; ' + t.dongTac : '')];
    var u = LH.hao[LH.ungVi - 1]; g.push('Hào Ứng ở hào ' + u.vi + ': ' + u.lucThan + ' ' + u.canChi + ' – quan hệ Ứng → Thế: ' + ({ sinh: 'Ứng sinh Thế', khac: 'Ứng khắc Thế', duoc_sinh: 'Thế sinh Ứng', bi_khac: 'Thế khắc Ứng', binh: 'đồng hành' })[quanHeHanh(u.hanh, t.hanh)]);
    return { diem: t.diem, muc: hlMuc_(t.diem), ghi: g, lucThan: t.lucThan };
  }
  if (LV.dung === 'SK') {
    var tt = hlLucThanSuc_(LH, 'Tử Tôn'), qq = hlLucThanSuc_(LH, 'Quan Quỷ'), th = LH.hao[LH.theVi - 1];
    var d = tt.diem * 0.5 - Math.max(qq.diem, 0) * 0.5 + th.diem * 0.4 + (qq.hien ? 0.3 : 0.6);
    d = Math.round(d * 10) / 10;
    return { diem: d, muc: hlMuc_(d), ghi: ['Thuốc – ' + tt.ghi[0] + ' → ' + tt.muc.toLowerCase(), 'Bệnh – ' + qq.ghi[0] + ' → ' + qq.muc.toLowerCase(), 'Hào Thế ' + th.canChi + ' → ' + hlMuc_(th.diem).toLowerCase()],
      quyHanh: qq.hao ? qq.hao.hanh : qq.phuc ? qq.phuc.hanh : null, quyManh: qq.diem };
  }
  var lt = LV.dung === 'PHOI' ? (male ? 'Thê Tài' : 'Quan Quỷ') : LV.dung, S = hlLucThanSuc_(LH, lt), dd = S.diem, g2 = S.ghi.slice();
  if (LV.dung === 'PHOI') {
    var tH = LH.hao[LH.theVi - 1], uH = LH.hao[LH.ungVi - 1], r = quanHeHanh(uH.hanh, tH.hanh);
    if (r === 'sinh' || r === 'binh') { dd += 0.3; g2.push('Ứng (người đối diện) ' + (r === 'sinh' ? 'sinh' : 'đồng hành với') + ' Thế'); }
    else if (r === 'khac') { dd -= 0.3; g2.push('Ứng khắc Thế – dễ bất đồng'); }
    if (S.hien >= 2) g2.push(lt + ' hiện ' + S.hien + ' lần – tình cảm dễ nhiều ngả');
    dd = Math.round(dd * 10) / 10;
  }
  return { diem: dd, muc: hlMuc_(dd), ghi: g2, lucThan: lt, hien: S.hien, phuc: !!S.phuc };
}
/** Luận đủ 8 lĩnh vực trên hai quẻ Tiên thiên – Hậu thiên */
function hlLinhVuc_(hl) {
  var LT = hl.lucHao.tien, LHt = hl.lucHao.hau, male = hl.male, moc = hl.tuoiHau;
  return HL_LV.map(function (LV) {
    var a = hlLvQue_(LV, LT, male), b = hlLvQue_(LV, LHt, male), d = Math.round((a.diem + b.diem) / 2 * 10) / 10, bac = hlBac_(d), them = [];
    if (b.diem - a.diem >= 1.2) them.push('Từ khoảng ' + moc + ' tuổi trở đi, chuyện này khá lên rõ.');
    else if (a.diem - b.diem >= 1.2) them.push('Từ khoảng ' + moc + ' tuổi trở đi, chuyện này cần giữ gìn hơn.');
    if (LV.k === 'banThan') {
      var t = LT.hao[LT.theVi - 1], u = LT.hao[LT.ungVi - 1];
      them.unshift(HL_THE_TRI[t.lucThan], HL_THE_UNG[quanHeHanh(u.hanh, t.hanh)], 'Nét khí chất: ' + HL_THU_Y[t.thu] + '.');
    }
    if (LV.k === 'honNhan' && (a.hien >= 2 || b.hien >= 2)) them.push('Tình cảm dễ có nhiều ngả rẽ – khi đã chọn, hãy dứt khoát và chung thủy để giữ bình yên.');
    if ((LV.k === 'honNhan' || LV.k === 'conCai') && a.phuc && b.phuc) them.push('Chuyện này thường đến muộn hoặc kín đáo – cần chủ động tìm và vun đắp.');
    if (LV.k === 'tienBac') {
      var hd = hlLucThanSuc_(LT, 'Huynh Đệ');
      if (hd.hao && (hd.hao.dong || hd.diem > 1.5)) them.push('Có dấu hiệu hao tài vì bạn bè, người thân hoặc cạnh tranh – nên rạch ròi chuyện tiền nong.');
    }
    if (LV.k === 'congDanh') {
      var ts = hlLucThanSuc_(LT, 'Tử Tôn');
      if (ts.hao && ts.hao.dong && a.diem < 0.5) them.push('Bạn hợp làm chuyên môn, nghề tự do hơn là leo thang chức vụ.');
    }
    if (LV.k === 'sucKhoe') {
      var hs = [a.quyHanh, b.quyHanh].filter(function (x, i, s) { return x && s.indexOf(x) === i; });
      if (hs.length) them.push('Vùng cơ thể nên để ý: ' + hs.map(function (h) { return HL_TANG[h]; }).join('; ') + '.');
    }
    return { k: LV.k, ten: LV.ten, icon: LV.icon, nhom: LV.nhom, giai: LV.giai, lucThan: a.lucThan || null,
      tien: a, hau: b, diem: d, muc: hlMuc_(d), bac: ['tot', 'vua', 'kho'][bac], van: LV.van[bac], khuyen: LV.khuyen[bac], them: them };
  });
}
/** Hóa công (quái hợp mùa sinh) & nguyên khí (quái nạp can năm) – hai điều kiện "được thời" của Hà Lạc */
var HL_HOA_CONG = { 2: ['Chấn', 'Tốn'], 3: ['Chấn', 'Tốn'], 5: ['Ly'], 6: ['Ly'], 8: ['Càn', 'Đoài'], 9: ['Càn', 'Đoài'], 11: ['Khảm'], 0: ['Khảm'], 1: ['Khôn', 'Cấn'], 4: ['Khôn', 'Cấn'], 7: ['Khôn', 'Cấn'], 10: ['Khôn', 'Cấn'] };
var HL_CAN_QUAI = ['Càn', 'Khôn', 'Cấn', 'Đoài', 'Khảm', 'Ly', 'Chấn', 'Tốn', 'Càn', 'Khôn'];
function hlThoiVi_(hl, bt) {
  var mChi = bt.pillars[1].chi, yCan = bt.pillars[0].can, hc = HL_HOA_CONG[mChi], nk = HL_CAN_QUAI[yCan], out = [];
  [['Tiên thiên', hl.tien], ['Hậu thiên', hl.hau]].forEach(function (x) {
    var q = x[1], co = [q.tren, q.duoi], dHC = co.some(function (k) { return hc.indexOf(k) >= 0; }), dNK = co.indexOf(nk) >= 0;
    out.push({ que: x[0] + ' ' + q.ten, hoaCong: dHC, nguyenKhi: dNK,
      t: (dHC && dNK ? '✓ ' : dHC || dNK ? '◇ ' : '✗ ') + x[0] + ' ' + q.ten + ': ' + (dHC ? 'được hóa công (có quái ' + hc.join('/') + ' hợp mùa tháng ' + CHI[mChi] + ')' : 'không được hóa công (mùa tháng ' + CHI[mChi] + ' cần quái ' + hc.join('/') + ')') +
        '; ' + (dNK ? 'được nguyên khí (can năm ' + CAN[yCan] + ' nạp vào quái ' + nk + ')' : 'không có nguyên khí (quái ' + nk + ' của can năm ' + CAN[yCan] + ' vắng)') + '.' });
  });
  var tong = out.filter(function (x) { return x.hoaCong; }).length + out.filter(function (x) { return x.nguyenKhi; }).length;
  return { ds: out, diem: tong, ketLuan: tong >= 3 ? 'Mệnh "được thời": quẻ hợp mùa sinh và có gốc từ năm sinh – sức vươn lên mạnh, gặp thời thì phát nhanh.' :
    tong >= 1 ? 'Mệnh "được thời một phần": có chỗ dựa từ thời điểm sinh nhưng chưa trọn – thành công cần thêm nỗ lực và chọn đúng lúc.' :
    'Mệnh "chưa gặp thời": quẻ không hợp mùa sinh – thành công đến từ bền bỉ và tích lũy, không nên trông vào may mắn.' };
}
/** Quẻ Biến (nguyên đường động), Thác (đảo âm dương), Tổng (lật ngược) của Tiên thiên */
function hlQueKhac_(hl) {
  var T = hl.tien, b = hlTuHao_(hlBien_(T.hao, T.nguyenDuong)), th = hlTuHao_(T.hao.map(function (x) { return 1 - x; })), tg = hlTuHao_(T.hao.slice().reverse());
  return [
    { nhan: 'Quẻ Biến', vai: 'hướng đi, kết cục của việc lớn trong đời', q: b },
    { nhan: 'Quẻ Thác', vai: 'mặt đối lập – điều bạn thiếu và cần học', q: th },
    { nhan: 'Quẻ Tổng', vai: 'cách người khác nhìn bạn (đứng ở phía đối diện)', q: tg }
  ];
}
