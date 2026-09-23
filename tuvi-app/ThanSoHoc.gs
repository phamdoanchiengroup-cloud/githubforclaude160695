/**
 * ============================================================
 *  ThanSoHoc.gs — THẦN SỐ HỌC PYTHAGORAS (trường phái phổ biến ở Việt Nam)
 *  - Số Chủ đạo (Đường đời) 2–11, 22/4, 33/6; số Ngày sinh; số Thái độ
 *  - Biểu đồ ngày sinh (lưới Lo Shu 3-6-9 / 2-5-8 / 1-4-7): ý nghĩa từng con số
 *    theo số lần xuất hiện, 8 mũi tên sức mạnh và 7 mũi tên trống
 *  - Biểu đồ tên & tổng hợp: số Linh hồn (nguyên âm), Nhân cách (phụ âm),
 *    Sứ mệnh/Biểu đạt (toàn tên), Trưởng thành, Cân bằng, Bài học nghiệp, Đam mê ẩn
 *  - 4 Đỉnh cao & 4 Thử thách theo tuổi, Năm – Tháng cá nhân, chu kỳ 9 năm
 *  Nguồn tham khảo: David A. Phillips "The Complete Book of Numerology";
 *  Hans Decoz "Numerology: Key to Your Inner Self"; Matthew Goodwin "Numerology –
 *  The Complete Guide"; Juno Jordan "The Romance in Your Name".
 * ============================================================
 */

var TS_SO = {
  1: { ten: 'Người tiên phong', tk: 'độc lập, lãnh đạo, ý chí, khởi đầu', manh: 'quyết đoán, tự lực, dám đi đầu, có tầm nhìn riêng', yeu: 'bướng bỉnh, cái tôi lớn, khó nhờ ai giúp', nghe: 'khởi nghiệp, quản lý, phát minh, thiết kế, bán hàng cấp cao', bh: 'học cách lãnh đạo bằng sự khiêm tốn và lắng nghe' },
  2: { ten: 'Người hòa giải', tk: 'trực giác, nhạy cảm, hợp tác, tinh tế', manh: 'thấu cảm, khéo léo, giỏi làm việc nhóm, trực giác mạnh', yeu: 'dễ tổn thương, thiếu tự tin, phụ thuộc cảm xúc', nghe: 'tư vấn, trị liệu, ngoại giao, nghệ thuật, trợ lý, nhân sự', bh: 'tin vào trực giác, tự tạo ranh giới cảm xúc' },
  3: { ten: 'Người truyền cảm hứng', tk: 'tư duy, sáng tạo, biểu đạt, trí nhớ', manh: 'hoạt ngôn, hài hước, lạc quan, trí nhớ và óc phân tích tốt', yeu: 'dễ phân tán, hay phán xét, nói quá, cả thèm chóng chán', nghe: 'truyền thông, giảng dạy, viết lách, giải trí, phân tích, marketing', bh: 'tập trung, biến ý tưởng thành việc làm đến cùng' },
  4: { ten: 'Người thực tế', tk: 'trật tự, kỷ luật, thực tế, xây dựng', manh: 'chăm chỉ, đáng tin, có tổ chức, giỏi tay chân và quy trình', yeu: 'cứng nhắc, bảo thủ, ngại thay đổi, quá thận trọng', nghe: 'kỹ thuật, xây dựng, kế toán, quản trị vận hành, luật, thợ lành nghề', bh: 'linh hoạt hơn, nhìn xa hơn chi tiết trước mắt' },
  5: { ten: 'Người tự do', tk: 'tự do, trải nghiệm, thay đổi, cảm xúc – tình yêu', manh: 'linh hoạt, thích nghi nhanh, hấp dẫn, giỏi giao tiếp và bán hàng', yeu: 'bồn chồn, thiếu kiên nhẫn, dễ sa đà hưởng thụ', nghe: 'du lịch, truyền thông, bán hàng, sự kiện, báo chí, xuất nhập khẩu', bh: 'tự do trong kỷ luật – biết cam kết' },
  6: { ten: 'Người nuôi dưỡng', tk: 'trách nhiệm, yêu thương, gia đình, sáng tạo', manh: 'tận tụy, chu đáo, có óc thẩm mỹ, giỏi chăm sóc và chữa lành', yeu: 'lo lắng, ôm đồm, hay can thiệp, cầu toàn', nghe: 'y tế, giáo dục, tư vấn gia đình, nghệ thuật, thiết kế nội thất, ẩm thực', bh: 'yêu thương mà không kiểm soát, chăm sóc cả bản thân' },
  7: { ten: 'Người tìm chân lý', tk: 'phân tích, tâm linh, trải nghiệm, học qua mất mát', manh: 'sâu sắc, ham học, trực giác và trí tuệ cao, độc lập tư duy', yeu: 'khép kín, hoài nghi, cô độc, học qua va vấp', nghe: 'nghiên cứu, khoa học, công nghệ, triết học, tâm linh, phân tích', bh: 'chia sẻ tri thức, mở lòng tin người' },
  8: { ten: 'Người quyền lực', tk: 'tài chính, quản trị, độc lập, thành tựu', manh: 'tham vọng, giỏi kinh doanh, bản lĩnh, nhìn ra giá trị', yeu: 'độc đoán, thực dụng, làm việc quá sức, khó bày tỏ cảm xúc', nghe: 'kinh doanh, tài chính – ngân hàng, bất động sản, quản lý cấp cao, luật', bh: 'dùng quyền lực và tiền bạc để phụng sự, cân bằng vật chất – tinh thần' },
  9: { ten: 'Người nhân đạo', tk: 'lý tưởng, trách nhiệm cộng đồng, tham vọng, bao dung', manh: 'rộng lượng, có tầm nhìn lớn, giàu lòng trắc ẩn, truyền cảm hứng', yeu: 'lý tưởng hóa, khó buông bỏ, dễ thất vọng về người khác', nghe: 'giáo dục, từ thiện, nghệ thuật, y tế, luật, chính trị – xã hội', bh: 'buông bỏ, cho đi không điều kiện' },
  10: { ten: 'Người linh hoạt (10/1)', tk: 'thích nghi, độc lập, may mắn, khởi đầu mới', manh: 'có tố chất số 1 nhưng mềm dẻo hơn, dễ thích nghi, được may mắn nâng đỡ', yeu: 'dao động giữa tự tin và ngờ vực, dễ chủ quan', nghe: 'kinh doanh, quản lý, sáng tạo, bán hàng, công việc cần linh hoạt', bh: 'tin vào bản thân mà vẫn biết lắng nghe' },
  11: { ten: 'Bậc thầy trực giác (11/2)', tk: 'trực giác, tâm linh, truyền cảm hứng, nhạy cảm cao', manh: 'nhìn thấu, có sức ảnh hưởng tinh thần, sáng tạo, lý tưởng cao', yeu: 'căng thẳng thần kinh, dễ bất an, mâu thuẫn giữa lý tưởng và thực tế', nghe: 'tâm lý, giáo dục, nghệ thuật, tâm linh, diễn giả, chữa lành', bh: 'biến trực giác thành hành động phụng sự, giữ vững trung tâm' },
  22: { ten: 'Bậc thầy kiến tạo (22/4)', tk: 'xây dựng lớn, tầm nhìn thực tế, trách nhiệm xã hội', manh: 'biến ước mơ lớn thành hiện thực, tổ chức giỏi, bản lĩnh', yeu: 'áp lực tự đặt ra rất lớn, cứng nhắc, sợ thất bại', nghe: 'quản lý dự án lớn, kiến trúc, chính sách, doanh nghiệp, kỹ thuật', bh: 'kiên nhẫn xây từng viên gạch vì lợi ích chung' },
  33: { ten: 'Bậc thầy chữa lành (33/6)', tk: 'yêu thương vô điều kiện, dạy dỗ, hy sinh', manh: 'lòng trắc ẩn lớn, truyền cảm hứng, chữa lành người khác', yeu: 'hy sinh quá mức, gánh vác thay người khác, cầu toàn', nghe: 'giáo dục, y tế, tư vấn, nghệ thuật, hoạt động cộng đồng', bh: 'phụng sự mà không đánh mất bản thân' }
};

/** Ý nghĩa từng con số trên biểu đồ ngày sinh */
var TS_BD = {
  1: { y: 'khả năng biểu đạt bản thân, giao tiếp nội tâm', c: ['Thiếu 1: khó bày tỏ suy nghĩ thật, dễ bị hiểu lầm', 'Một số 1: biểu đạt được nhưng hay giữ trong lòng', 'Hai số 1: biểu đạt cân bằng, giao tiếp tốt cả nói lẫn viết', 'Ba số 1: nói nhiều hoặc rất ít; dễ bị hiểu lầm, hay cô đơn', 'Bốn số 1 trở lên: nhạy cảm giao tiếp, cần học lắng nghe, dễ tự thu mình'] },
  2: { y: 'trực giác, nhạy cảm, cảm nhận người khác', c: ['Thiếu 2: trực giác yếu, dễ thiếu kiên nhẫn, cần học tinh tế', 'Một số 2: trực giác tốt, nhạy cảm vừa phải', 'Hai số 2: trực giác mạnh, đọc vị người khác tốt, dễ tổn thương', 'Ba số 2: rất nhạy cảm, dễ lo âu, cô đơn', 'Bốn số 2 trở lên: quá nhạy cảm, dễ bất an, cần môi trường nhẹ nhàng'] },
  3: { y: 'trí nhớ, tư duy, óc sáng tạo và phân tích', c: ['Thiếu 3: trí nhớ ngắn hạn, cần ghi chép, tư duy thiên thực hành', 'Một số 3: trí nhớ tốt, lạc quan, tư duy mạch lạc', 'Hai số 3: trí tưởng tượng và sáng tạo mạnh, dễ sống trong đầu', 'Ba số 3: tư duy quá nhiều, dễ lo xa, khó hòa hợp cảm xúc', 'Bốn số 3 trở lên: trí óc hoạt động không ngừng, dễ căng thẳng'] },
  4: { y: 'trật tự, thực tế, khéo tay, tổ chức', c: ['Thiếu 4: thiếu ngăn nắp, khó làm việc chân tay kiên trì', 'Một số 4: thực tế, gọn gàng, khéo tay', 'Hai số 4: rất có tổ chức, giỏi kỹ thuật – nghệ thuật thủ công', 'Ba số 4 trở lên: quá chú trọng vật chất, cứng nhắc, làm việc quá sức', 'Nhiều số 4: cần học tính linh hoạt'] },
  5: { y: 'cảm xúc, tình yêu, ý chí và động lực (trung tâm biểu đồ)', c: ['Thiếu 5: cần nỗ lực nhiều để giữ động lực, dễ nản; cảm xúc khó ổn định', 'Một số 5: cảm xúc cân bằng, có động lực, yêu thương rõ ràng', 'Hai số 5: quyết tâm mạnh, cảm xúc mãnh liệt, dễ tự cao', 'Ba số 5: cảm xúc dữ dội, dễ nói lời tổn thương, cần kiểm soát', 'Nhiều số 5: năng lượng dồi dào nhưng dễ bốc đồng'] },
  6: { y: 'sáng tạo, trách nhiệm với gia đình – nhà cửa', c: ['Thiếu 6: ít gắn bó việc nhà, cần học trách nhiệm gia đình', 'Một số 6: yêu gia đình, có óc sáng tạo và trách nhiệm', 'Hai số 6: lo lắng cho gia đình nhiều, dễ căng thẳng', 'Ba số 6 trở lên: lo âu quá mức, dễ bất mãn, cần buông bớt', 'Nhiều số 6: cần tìm niềm vui ngoài gia đình'] },
  7: { y: 'bài học qua trải nghiệm – mất mát, tâm linh', c: ['Thiếu 7: ít mất mát, học qua sách vở và người khác', 'Một số 7: học qua trải nghiệm cá nhân (tình cảm, sức khỏe hoặc tài chính)', 'Hai số 7: mất mát ở hai lĩnh vực, bù lại trí tuệ sâu sắc và tâm linh', 'Ba số 7 trở lên: nhiều thử thách lớn, trưởng thành vượt bậc nếu vượt qua', 'Nhiều số 7: có thiên hướng triết học – tôn giáo mạnh'] },
  8: { y: 'khả năng quan sát chi tiết, độc lập, trách nhiệm tài chính', c: ['Thiếu 8: dễ bừa bộn, thiếu chú ý chi tiết, cần học quản lý', 'Một số 8: gọn gàng, độc lập, biết quản lý tiền', 'Hai số 8: rất chi tiết, cẩn trọng, có thể khó tính', 'Ba số 8 trở lên: bồn chồn, khó ổn định, thích xê dịch', 'Nhiều số 8: cần tránh vội vàng quyết định'] },
  9: { y: 'lý tưởng, tham vọng, trách nhiệm cộng đồng', c: ['Thiếu 9: ít tham vọng xã hội (hiếm gặp với người sinh thế kỷ 20)', 'Một số 9: có lý tưởng, trách nhiệm, bao dung', 'Hai số 9: lý tưởng cao, dễ chỉ trích người không đạt chuẩn', 'Ba số 9: rất lý tưởng, dễ xa rời thực tế, hay thất vọng', 'Bốn số 9 trở lên: cần cân bằng lý tưởng với đời sống cá nhân'] }
};

var TS_MUI_TEN = [
  { so: [1, 2, 3], ten: 'Mũi tên Kế hoạch', co: 'giỏi lập kế hoạch, tổ chức, tư duy mạch lạc – nên làm công việc cần hoạch định' },
  { so: [4, 5, 6], ten: 'Mũi tên Ý chí', co: 'ý chí mạnh, quyết tâm theo đuổi mục tiêu đến cùng', trong: 'Mũi tên Uất giận (trống 4-5-6): dễ thất vọng, dồn nén, cần tìm động lực và chia sẻ cảm xúc' },
  { so: [7, 8, 9], ten: 'Mũi tên Hoạt động', co: 'năng động, hành động nhiều, học bằng làm', trong: 'Mũi tên Thụ động (trống 7-8-9): dễ trì trệ, cần tự đặt mục tiêu và vận động' },
  { so: [1, 4, 7], ten: 'Mũi tên Thực tế (Thể chất)', co: 'khéo tay, thực tế, bền bỉ về thể chất, giỏi việc vật chất', trong: 'Mũi tên Hỗn loạn (trống 1-4-7): khó sắp xếp, thiếu thực tế, cần rèn thói quen' },
  { so: [2, 5, 8], ten: 'Mũi tên Cân bằng cảm xúc', co: 'cảm xúc ổn định, tinh thần vững, dễ tạo cảm giác an toàn', trong: 'Mũi tên Nhạy cảm (trống 2-5-8): dễ tổn thương, thiếu tự tin, cần môi trường an toàn' },
  { so: [3, 6, 9], ten: 'Mũi tên Trí tuệ', co: 'trí nhớ và tư duy xuất sắc, học giỏi, sáng tạo', trong: 'Mũi tên Trí nhớ ngắn hạn (trống 3-6-9): nên học qua thực hành và ghi chép' },
  { so: [1, 5, 9], ten: 'Mũi tên Quyết tâm', co: 'kiên trì, quyết tâm cao, không bỏ cuộc giữa chừng', trong: 'Mũi tên Trì hoãn (trống 1-5-9): hay chần chừ, cần chia nhỏ mục tiêu' },
  { so: [3, 5, 7], ten: 'Mũi tên Tâm linh (Nhạy bén)', co: 'thấu hiểu sâu, trực giác và tâm linh mạnh, bình an nội tâm', trong: 'Mũi tên Hoài nghi (trống 3-5-7): hoài nghi, cần bằng chứng, dễ bất an về niềm tin' }
];

var TS_CHU = { A: 1, J: 1, S: 1, B: 2, K: 2, T: 2, C: 3, L: 3, U: 3, D: 4, M: 4, V: 4, E: 5, N: 5, W: 5, F: 6, O: 6, X: 6, G: 7, P: 7, Y: 7, H: 8, Q: 8, Z: 8, I: 9, R: 9 };

function tsRutGon_(n, giuMaster) {
  while (n > 9 && !(giuMaster && (n === 11 || n === 22 || n === 33))) {
    n = String(n).split('').reduce(function (s, c) { return s + (+c); }, 0);
  }
  return n;
}
function tsTongChuSo_(s) { return String(s).replace(/\D/g, '').split('').reduce(function (a, c) { return a + (+c); }, 0); }
function tsGoc_(n) { return n === 11 ? 2 : n === 22 ? 4 : n === 33 ? 6 : n === 10 ? 1 : n; }
function tsBoDau_(s) {
  return String(s || '').replace(/[đĐ]/g, 'D').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z ]/g, ' ').replace(/\s+/g, ' ').trim();
}
function tsLaNguyenAm_(w, i) {
  var c = w.charAt(i);
  if ('AEIOU'.indexOf(c) >= 0) return true;
  if (c !== 'Y') return false;
  var tr = w.charAt(i - 1), sau = w.charAt(i + 1);
  return !('AEIOU'.indexOf(tr) >= 0 && tr) && !('AEIOU'.indexOf(sau) >= 0 && sau); // Y đứng một mình giữa phụ âm = nguyên âm
}

/** Số chủ đạo: cộng tất cả chữ số ngày sinh; rút gọn tới 2–11, giữ 22, 33 */
function tsDuongDoi_(d, m, y) {
  var n = tsTongChuSo_('' + d + m + y);
  while (n > 11 && n !== 22 && n !== 33) n = tsTongChuSo_(n);
  return n;
}

function thanSoHocLap(input, solar, viewYear) {
  var d = solar.day, m = solar.month, y = solar.year;
  var ld = tsDuongDoi_(d, m, y);
  var ngay = tsRutGon_(d, true), thaiDo = tsRutGon_(tsTongChuSo_('' + d + m), false);
  // Biểu đồ ngày sinh
  var dem = {}; for (var k = 1; k <= 9; k++) dem[k] = 0;
  ('' + d + m + y).split('').forEach(function (c) { if (c !== '0') dem[+c]++; });
  var muiTen = [];
  TS_MUI_TEN.forEach(function (a) {
    var co = a.so.every(function (s) { return dem[s] > 0; }), trong = a.so.every(function (s) { return dem[s] === 0; });
    if (co) muiTen.push({ ten: a.ten, so: a.so.join('-'), tot: true, y: a.co });
    else if (trong && a.trong) muiTen.push({ ten: a.trong.split(':')[0], so: a.so.join('-'), tot: false, y: a.trong.split(': ').slice(1).join(': ') });
  });
  // Tên
  var ten = tsBoDau_(input.name), words = ten ? ten.split(' ') : [];
  var linhHon = 0, nhanCach = 0, suMenh = 0, demTen = {}, cb = 0, coTen = words.length > 0 && !/^VO DANH$/.test(ten);
  for (k = 1; k <= 9; k++) demTen[k] = 0;
  words.forEach(function (w) {
    var nh = 0, pa = 0;
    for (var i = 0; i < w.length; i++) {
      var v = TS_CHU[w.charAt(i)]; if (!v) continue;
      demTen[v]++;
      if (tsLaNguyenAm_(w, i)) nh += v; else pa += v;
    }
    linhHon += tsRutGon_(nh, true); nhanCach += tsRutGon_(pa, true); suMenh += tsRutGon_(nh + pa, true);
    cb += TS_CHU[w.charAt(0)] || 0;
  });
  var R = { duongDoi: ld, duongDoiGoc: tsGoc_(ld), ngaySinh: ngay, thaiDo: thaiDo, bieuDo: dem, muiTen: muiTen, coTen: coTen, tenChuan: ten };
  if (coTen) {
    R.linhHon = tsRutGon_(linhHon, true); R.nhanCach = tsRutGon_(nhanCach, true); R.suMenh = tsRutGon_(suMenh, true);
    R.truongThanh = tsRutGon_(tsGoc_(ld) + tsGoc_(R.suMenh), true);
    R.canBang = tsRutGon_(cb, false);
    R.baiHoc = []; for (k = 1; k <= 9; k++) if (!demTen[k]) R.baiHoc.push(k);
    var maxc = 0; for (k = 1; k <= 9; k++) maxc = Math.max(maxc, demTen[k]);
    R.damMe = []; for (k = 1; k <= 9; k++) if (demTen[k] === maxc && maxc > 0) R.damMe.push(k);
    R.demTen = demTen;
  }
  // Đỉnh cao & thử thách
  var rm = tsRutGon_(m, false), rd = tsRutGon_(d, false), ry = tsRutGon_(tsTongChuSo_(y), false);
  var p1 = tsRutGon_(rm + rd, true), p2 = tsRutGon_(rd + ry, true), p3 = tsRutGon_(tsGoc_(p1) + tsGoc_(p2), true), p4 = tsRutGon_(rm + ry, true);
  var c1 = Math.abs(rm - rd), c2 = Math.abs(rd - ry), c3 = Math.abs(c1 - c2), c4 = Math.abs(rm - ry);
  var t1 = 36 - tsGoc_(ld);
  R.dinhCao = [
    { so: p1, tu: 0, den: t1, thuThach: c1 }, { so: p2, tu: t1 + 1, den: t1 + 9, thuThach: c2 },
    { so: p3, tu: t1 + 10, den: t1 + 18, thuThach: c3 }, { so: p4, tu: t1 + 19, den: 99, thuThach: c4 }
  ];
  // Năm cá nhân
  R.namCaNhan = function (yy) { return tsRutGon_(rd + rm + tsRutGon_(tsTongChuSo_(yy), false), false); };
  R.namNay = R.namCaNhan(viewYear);
  R.chuKy = [];
  for (var yy = viewYear - 2; yy <= viewYear + 9; yy++) R.chuKy.push({ nam: yy, so: R.namCaNhan(yy) });
  R.thangNay = [];
  for (var mm = 1; mm <= 12; mm++) R.thangNay.push({ thang: mm, so: tsRutGon_(R.namNay + mm, false) });
  delete R.namCaNhan;
  return R;
}

var TS_NAM = {
  1: 'Năm khởi đầu chu kỳ 9 năm: gieo hạt – bắt đầu dự án, công việc, mối quan hệ mới; chủ động, tự lập.',
  2: 'Năm kiên nhẫn và hợp tác: vun đắp quan hệ, chờ hạt nảy mầm; tránh vội vàng; tình cảm – hôn nhân được chú ý.',
  3: 'Năm sáng tạo và giao tiếp: mở rộng xã hội, học hỏi, thể hiện bản thân; vui vẻ nhưng dễ phân tán.',
  4: 'Năm xây nền móng: làm việc chăm chỉ, kỷ luật, sắp xếp tài chính – nhà cửa – sức khỏe; ít may mắn bất ngờ.',
  5: 'Năm thay đổi và tự do: di chuyển, cơ hội mới, đổi việc/đổi chỗ ở; cần tránh bốc đồng.',
  6: 'Năm trách nhiệm và yêu thương: gia đình, hôn nhân, con cái, nhà cửa; chăm sóc và được chăm sóc.',
  7: 'Năm nội tâm và học hỏi: nghiên cứu, tu dưỡng, nhìn lại; không hợp mạo hiểm tiền bạc; dễ cô đơn.',
  8: 'Năm thu hoạch và quyền lực: tài chính, thăng tiến, công nhận; gặt những gì đã gieo 7 năm qua.',
  9: 'Năm kết thúc và buông bỏ: hoàn tất, dọn dẹp những gì không còn phù hợp để chuẩn bị chu kỳ mới; cho đi, từ thiện.'
};
var TS_THU_THACH = {
  0: 'thử thách lựa chọn – mọi bài học đều có thể xuất hiện, cần tự định hướng',
  1: 'khẳng định bản thân, không để người khác lấn át hoặc tránh độc đoán',
  2: 'nhạy cảm quá mức, sợ bị từ chối – học tự tin',
  3: 'biểu đạt cảm xúc, tránh phân tán và tự ti',
  4: 'kỷ luật và kiên nhẫn, chấp nhận làm việc chăm chỉ',
  5: 'dùng tự do có trách nhiệm, tránh cực đoan và cám dỗ',
  6: 'trách nhiệm gia đình và cầu toàn – học buông bớt kiểm soát',
  7: 'niềm tin – vượt qua hoài nghi và cô lập',
  8: 'quan hệ với tiền bạc và quyền lực – cân bằng vật chất và tinh thần'
};

function thanSoHocLuan(ts) {
  var S = TS_SO, L = S[ts.duongDoi], secs = [];
  secs.push({ tieuDe: 'Số chủ đạo ' + ts.duongDoi + (ts.duongDoi >= 10 ? '/' + ts.duongDoiGoc : '') + ' – ' + L.ten, items: [
    'Từ khóa: ' + L.tk + '.', '✓ Điểm mạnh: ' + L.manh + '.', '✗ Điểm cần khắc phục: ' + L.yeu + '.', 'Nghề nghiệp hợp: ' + L.nghe + '.', 'Bài học đường đời: ' + L.bh + '.'] });
  var N = S[ts.ngaySinh] || S[tsGoc_(ts.ngaySinh)], T = S[ts.thaiDo];
  secs.push({ tieuDe: 'Số ngày sinh ' + ts.ngaySinh + ' & số thái độ ' + ts.thaiDo, items: [
    'Số ngày sinh (năng khiếu bẩm sinh, hỗ trợ số chủ đạo): ' + N.tk + ' – ' + N.manh + '.',
    'Số thái độ (ấn tượng đầu tiên người khác nhận về bạn): ' + T.tk + '; dễ bị nhìn thấy mặt ' + T.yeu.split(',')[0] + '.'] });
  var bd = [];
  for (var k = 1; k <= 9; k++) { var c = ts.bieuDo[k]; bd.push((c === 0 ? '◇ ' : c >= 3 ? '◇ ' : '✓ ') + 'Số ' + k + ' (' + TS_BD[k].y + ') × ' + c + ': ' + TS_BD[k].c[Math.min(4, c)] + '.'); }
  secs.push({ tieuDe: 'Biểu đồ ngày sinh – từng con số', items: bd });
  secs.push({ tieuDe: 'Mũi tên trên biểu đồ', items: ts.muiTen.length ? ts.muiTen.map(function (a) { return (a.tot ? '✓ ' : '✗ ') + a.ten + ' (' + a.so + '): ' + a.y + '.'; }) : ['Không có mũi tên đầy hay trống trọn vẹn – năng lực phân bố đều, phát triển theo nỗ lực.'] });
  if (ts.coTen) {
    var ten = [
      'Số linh hồn ' + ts.linhHon + ' (khát khao sâu thẳm – từ nguyên âm): ' + S[ts.linhHon].tk + '.',
      'Số nhân cách ' + ts.nhanCach + ' (vẻ ngoài xã hội – từ phụ âm): ' + S[ts.nhanCach].tk + '; người khác thấy bạn ' + S[ts.nhanCach].manh.split(',').slice(0, 2).join(',') + '.',
      'Số sứ mệnh ' + ts.suMenh + ' (tài năng và mục tiêu – toàn bộ tên): ' + S[ts.suMenh].tk + '; hợp ' + S[ts.suMenh].nghe + '.',
      'Số trưởng thành ' + ts.truongThanh + ' (chủ đề nổi lên sau khoảng 35–45 tuổi): ' + S[ts.truongThanh].tk + '.',
      'Số cân bằng ' + ts.canBang + ' (cách ứng xử khi khủng hoảng – từ chữ cái đầu): ' + S[ts.canBang].tk + '.',
      ts.baiHoc.length ? '◇ Bài học nghiệp (số vắng trong tên): ' + ts.baiHoc.join(', ') + ' – cần rèn ' + ts.baiHoc.map(function (x) { return S[x].tk.split(',')[0]; }).join('; ') + '.' : '✓ Tên đủ các số 1–9: không có bài học nghiệp nổi bật.',
      'Đam mê ẩn (số lặp nhiều nhất trong tên): ' + ts.damMe.join(', ') + ' – ' + ts.damMe.map(function (x) { return S[x].tk.split(',')[0]; }).join('; ') + '.'
    ];
    if (ts.linhHon === ts.duongDoi || ts.suMenh === ts.duongDoi) ten.push('✓ Tên cộng hưởng với số chủ đạo – con đường và bản chất thống nhất.');
    secs.push({ tieuDe: 'Biểu đồ tên: "' + ts.tenChuan + '"', items: ten });
  }
  secs.push({ tieuDe: '4 đỉnh cao & thử thách đời người', items: ts.dinhCao.map(function (p, i) {
    return 'Đỉnh ' + (i + 1) + ' (' + p.tu + '–' + (p.den >= 99 ? 'cuối đời' : p.den) + ' tuổi) – số ' + p.so + ': ' + S[p.so].tk + '. Thử thách ' + p.thuThach + ': ' + TS_THU_THACH[p.thuThach] + '.';
  }) });
  secs.push({ tieuDe: 'Năm cá nhân', items: ts.chuKy.map(function (c) { return (c.nam === ts.chuKy[2].nam ? '★ ' : '') + c.nam + ' – năm ' + c.so + ': ' + TS_NAM[c.so]; }) });
  return secs;
}
