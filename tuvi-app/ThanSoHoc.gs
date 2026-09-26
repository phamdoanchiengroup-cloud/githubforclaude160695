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
  var linhHon = 0, nhanCach = 0, suMenh = 0, demTen = {}, cb = 0, tenTu = [], coTen = words.length > 0 && !/^VO DANH$/.test(ten);
  for (k = 1; k <= 9; k++) demTen[k] = 0;
  words.forEach(function (w) {
    var nh = 0, pa = 0;
    for (var i = 0; i < w.length; i++) {
      var v = TS_CHU[w.charAt(i)]; if (!v) continue;
      demTen[v]++;
      if (tsLaNguyenAm_(w, i)) nh += v; else pa += v;
    }
    linhHon += tsRutGon_(nh, true); nhanCach += tsRutGon_(pa, true); suMenh += tsRutGon_(nh + pa, true);
    tenTu.push({ tu: w, nguyenAm: nh, phuAm: pa });
    cb += TS_CHU[w.charAt(0)] || 0;
  });
  if (!linhHon || !nhanCach) coTen = false; // tên quá ngắn (thiếu nguyên âm hoặc phụ âm)
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
  R.tho = { d: d, m: m, y: y, gioiTinh: input.gender, tongNgaySinh: tsTongChuSo_('' + d + m + y), tongRutGon: rm + rd + ry,
    linhHon: linhHon, nhanCach: nhanCach, suMenh: suMenh, tenTu: tenTu, rm: rm, rd: rd, ry: ry };
  R.thachThucChinh = c3;
  try { R.phanTich = tsPhanTich_(R, viewYear, input); } catch (e) { R.phanTichLoi = String(e && e.message || e); }
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

/* ============================================================
 *  PHÂN TÍCH ĐẦY ĐỦ THEO QUY TRÌNH 6 BƯỚC
 *  B1 dữ liệu · B2 chỉ số cốt lõi · B3 chỉ số bổ sung (trưởng thành, thách thức, cân bằng,
 *  nợ nghiệp 13/14/16/19, bài học nghiệp, tiềm thức) · B4 chu kỳ (năm, tháng, ngày cá nhân,
 *  4 đỉnh cao – 4 thử thách) · B5 luận tổng hợp 5 lĩnh vực + bài học linh hồn · B6 lời khuyên;
 *  kèm các trường hợp đặc biệt (số bậc thầy, nợ nghiệp, số 0, số lặp, tên có dấu) và ứng dụng.
 * ============================================================ */
var TS_NGOAI = { 1: 'tự tin, quyết đoán, có phần mạnh mẽ', 2: 'dịu dàng, dễ gần, khéo léo', 3: 'vui vẻ, hoạt ngôn, cuốn hút', 4: 'đứng đắn, nghiêm túc, đáng tin',
  5: 'năng động, phóng khoáng, thú vị', 6: 'ấm áp, chu đáo, đáng tin cậy', 7: 'trầm tĩnh, sâu sắc, có phần xa cách', 8: 'bản lĩnh, có uy, toát ra vẻ thành đạt',
  9: 'rộng lượng, lịch thiệp, có tầm nhìn', 11: 'nhạy bén, có sức hút đặc biệt', 22: 'vững vàng, có tầm vóc', 33: 'hiền hậu, bao dung' };
var TS_TRONG = { 1: 'được độc lập, tự quyết, dẫn đầu', 2: 'được yêu thương, hòa hợp, có người đồng hành', 3: 'được thể hiện, sáng tạo, sống vui', 4: 'được an toàn, ổn định, mọi thứ có trật tự',
  5: 'được tự do, trải nghiệm, khám phá', 6: 'được gắn bó gia đình, chăm sóc và được cần đến', 7: 'được hiểu sâu, tìm ra sự thật, có khoảng lặng riêng', 8: 'được thành tựu, được công nhận, làm chủ tài chính',
  9: 'được cống hiến, sống có ý nghĩa cho nhiều người', 11: 'được truyền cảm hứng, sống theo lý tưởng', 22: 'được xây dựng điều lớn lao và bền vững', 33: 'được chữa lành, nâng đỡ người khác' };
var TS_HANH_DONG = { 1: 'hành động độc lập, thích đi đầu', 2: 'hành động mềm mỏng, qua hợp tác', 3: 'hành động bằng lời nói và ý tưởng', 4: 'hành động kỷ luật, thực tế, từng bước chắc chắn',
  5: 'hành động nhanh, linh hoạt, thích đổi mới', 6: 'hành động vì trách nhiệm và người thân', 7: 'hành động sau khi suy xét kỹ', 8: 'hành động quyết liệt, hướng đến kết quả',
  9: 'hành động vì lý tưởng chung', 10: 'hành động độc lập nhưng linh hoạt', 11: 'hành động theo trực giác', 22: 'hành động theo kế hoạch lớn, dài hơi', 33: 'hành động bằng tình thương' };
var TS_MOI_TRUONG = { 1: 'nơi được tự chủ, có quyền quyết định', 2: 'môi trường hợp tác, hòa nhã, làm việc nhóm', 3: 'nơi được giao tiếp, sáng tạo, thể hiện', 4: 'nơi có quy trình rõ ràng, ổn định lâu dài',
  5: 'nơi nhiều thay đổi, đi lại, gặp gỡ nhiều người', 6: 'nơi chăm sóc, phục vụ, gắn với cộng đồng', 7: 'nơi yên tĩnh, chuyên sâu, nghiên cứu', 8: 'nơi có đường thăng tiến, gắn với tài chính và quản trị',
  9: 'nơi mang lại giá trị cho cộng đồng', 10: 'nơi được tự chủ nhưng nhiều cơ hội mới', 11: 'nơi truyền cảm hứng: giáo dục, nghệ thuật, chữa lành', 22: 'tổ chức lớn, dự án tầm vóc', 33: 'nơi giáo dục, chăm sóc, chữa lành' };
var TS_TAI_CHINH = { 1: 'kiếm tiền tốt khi được tự làm chủ; dễ chi mạnh tay cho mục tiêu riêng', 2: 'tài chính ổn khi có đối tác tin cậy; nên tránh cho vay vì nể', 3: 'tiền đến từ giao tiếp, sáng tạo; dễ tiêu theo cảm hứng',
  4: 'tích lũy chậm mà chắc, giỏi tiết kiệm', 5: 'thu nhập lên xuống, cơ hội nhiều; rất cần quỹ dự phòng', 6: 'chi nhiều cho gia đình; tiền đến từ phục vụ, dịch vụ', 7: 'không đặt nặng tiền; hợp đầu tư dài hạn có tìm hiểu kỹ',
  8: 'có năng khiếu tài chính, dễ kiếm lớn nhưng cũng dễ rủi ro lớn', 9: 'rộng rãi, hay cho đi; tiền đến khi làm việc có ý nghĩa', 10: 'kiếm tiền nhanh nhờ nắm bắt cơ hội; cần giữ kỷ luật chi tiêu',
  11: 'tiền đến qua uy tín cá nhân; dễ xem nhẹ chuyện tiền', 22: 'có thể tạo tài sản lớn qua dự án dài hạn', 33: 'chi nhiều cho người khác; nên có quỹ riêng cho mình' };
var TS_CAN_TINH = { 1: 'cần người tôn trọng sự độc lập của bạn', 2: 'cần sự dịu dàng, quan tâm, được lắng nghe', 3: 'cần niềm vui, trò chuyện, được khen ngợi', 4: 'cần sự ổn định, chung thủy, cam kết rõ ràng',
  5: 'cần không gian tự do và những trải nghiệm mới cùng nhau', 6: 'cần mái ấm, sự gắn bó gia đình', 7: 'cần người hiểu chiều sâu và tôn trọng khoảng lặng của bạn', 8: 'cần người đồng hành cùng mục tiêu, tôn trọng thành tựu',
  9: 'cần một tình yêu rộng lượng, cùng lý tưởng sống', 11: 'cần sự kết nối tâm hồn sâu sắc', 22: 'cần người cùng xây dựng tương lai', 33: 'cần được yêu thương như cách bạn yêu thương người khác' };
var TS_SUC_KHOE = { 1: 'đầu, mắt, huyết áp – căng thẳng do tự đặt áp lực cao', 2: 'hệ thần kinh, dạ dày khi lo âu, giấc ngủ', 3: 'cổ họng, da, hô hấp – kiệt sức do ôm nhiều việc',
  4: 'xương khớp, lưng, răng – mệt mỏi do làm việc quá sức', 5: 'hệ thần kinh, gan khi ăn uống thất thường, chấn thương do vội vàng', 6: 'tim, ngực, cổ – ăn uống thất thường vì lo cho người khác',
  7: 'hệ thần kinh, giấc ngủ – dễ trầm buồn khi sống khép kín', 8: 'tim mạch, huyết áp, tiêu hóa – kiệt sức vì công việc', 9: 'hệ miễn dịch, da – mệt mỏi cảm xúc vì gánh chuyện người khác',
  10: 'đầu, mắt, huyết áp – căng thẳng do tự đặt áp lực', 11: 'hệ thần kinh rất nhạy, lo âu, mất ngủ', 22: 'xương khớp, thần kinh – áp lực trách nhiệm lớn', 33: 'tim, cảm xúc – kiệt sức vì chăm lo người khác' };
var TS_THACH_SK = { 0: 'khó chọn hướng dễ sinh bồn chồn – giữ nhịp sinh hoạt đều', 1: 'tự gồng gánh – học nghỉ ngơi đúng lúc', 2: 'nhạy cảm dễ ảnh hưởng dạ dày, giấc ngủ – học thư giãn',
  3: 'dồn nén cảm xúc – nên viết, nói ra, vận động', 4: 'cứng nhắc, làm quá sức – chú ý lưng, khớp', 5: 'sa đà ăn uống, thức khuya – cần điều độ', 6: 'lo âu cho người thân – chú ý tim, huyết áp',
  7: 'suy nghĩ nhiều, mất ngủ – thiền, đi bộ, ra ngoài thiên nhiên', 8: 'làm việc quá sức vì tiền – chú ý tim mạch, huyết áp' };
var TS_NO = {
  13: { ten: 'Nợ nghiệp 13/4', y: 'dễ muốn đi đường tắt, ngại việc nặng nhọc; công việc hay phải làm lại nhiều lần', bh: 'chăm chỉ, kiên trì, làm đến nơi đến chốn', sk: 'cơ thể đòi hỏi kỷ luật – tập luyện đều, không bỏ bữa, không thức khuya kéo dài' },
  14: { ten: 'Nợ nghiệp 14/5', y: 'dễ buông thả, sa đà hưởng thụ, thay đổi thất thường', bh: 'điều độ và biết cam kết', sk: 'tránh lạm dụng rượu bia, ăn uống, thiết bị điện tử – điều độ là thuốc' },
  16: { ten: 'Nợ nghiệp 16/7', y: 'cái tôi lớn dễ gặp biến cố "đổ vỡ để xây lại" trong tình cảm hay công danh', bh: 'khiêm nhường, mở lòng và tin vào điều lớn hơn bản thân', sk: 'giữ sức khỏe tinh thần – có người để tâm sự, không ôm một mình' },
  19: { ten: 'Nợ nghiệp 19/1', y: 'hay tự làm tất cả, khó nhận giúp đỡ, dễ thành độc đoán', bh: 'tự lập nhưng biết nhờ và biết cho', sk: 'đừng gồng một mình – nghỉ ngơi và nhờ giúp khi quá tải' }
};
var TS_MASTER = { 11: 'Phát triển trực giác, tránh lo âu', 22: 'Xây dựng di sản, tránh mơ mộng', 33: 'Chữa lành, tránh gánh vác quá nhiều' };
var TS_NHOM = [[1, 5, 7], [2, 4, 8], [3, 6, 9]];
var TS_NHOM_TEN = ['nhóm tư duy độc lập (1 – 5 – 7)', 'nhóm thực tế, ổn định (2 – 4 – 8)', 'nhóm cảm xúc, sáng tạo (3 – 6 – 9)'];
var TS_NANG_LUONG = { 1: 7.5, 2: 5.5, 3: 7, 4: 5, 5: 6.5, 6: 6.5, 7: 4.5, 8: 8, 9: 5 };
var TS_THANG = { 1: 'khởi sự việc mới', 2: 'hợp tác, kiên nhẫn chờ', 3: 'giao tiếp, sáng tạo', 4: 'làm việc chăm chỉ, sắp xếp', 5: 'thay đổi, đi lại', 6: 'gia đình, trách nhiệm', 7: 'nghỉ ngơi, học hỏi, suy ngẫm', 8: 'tiền bạc, ký kết, thăng tiến', 9: 'hoàn tất, buông bỏ' };
var TS_NGAY = { 1: 'bắt đầu việc mới', 2: 'gặp gỡ, thương lượng nhẹ nhàng', 3: 'trò chuyện, sáng tạo', 4: 'làm việc tập trung', 5: 'đi lại, thay đổi', 6: 'lo việc nhà, chăm người thân', 7: 'nghỉ ngơi, đọc sách', 8: 'tiền bạc, ký kết', 9: 'dọn dẹp, kết thúc việc cũ' };

function tsChuoi_(n) { var a = [n]; while (n > 9) { n = tsTongChuSo_(n); a.push(n); } return a; }
function tsNhom_(n) { var g = tsGoc_(n); for (var i = 0; i < 3; i++) if (TS_NHOM[i].indexOf(g) >= 0) return i; return -1; }
function tsNgan_(s, k) { return String(s).split(',').slice(0, k || 2).join(',').trim(); }

function tsPhanTich_(ts, viewYear, input) {
  var S = TS_SO, T = ts.tho, ld = ts.duongDoi, g = tsGoc_, out = {};
  // ---- B1: dữ liệu
  out.duLieu = { ten: String(input.name || ''), tenChuan: ts.tenChuan, coTen: ts.coTen, ngaySinh: T.d + '/' + T.m + '/' + T.y,
    gioiTinh: /nu|nữ|female/i.test(String(T.gioiTinh || '')) ? 'Nữ' : 'Nam',
    tu: (T.tenTu || []).map(function (w) { return { tu: w.tu, so: w.tu.split('').map(function (c) { return TS_CHU[c] || 0; }), nguyenAm: w.nguyenAm, phuAm: w.phuAm }; }) };
  // ---- B2: chỉ số cốt lõi (kèm cách tính)
  var core = [{ k: 'duongDoi', ten: 'Đường Đời', so: ld, vai: 'bản chất, mục đích sống', cach: 'Cộng mọi chữ số ngày sinh ' + out.duLieu.ngaySinh + ' = ' + T.tongNgaySinh + ' → ' + ld }];
  if (ts.coTen) core.push(
    { k: 'suMenh', ten: 'Định Mệnh (Sứ mệnh)', so: ts.suMenh, vai: 'tài năng, nghề phù hợp', cach: 'Tổng các chữ cái của họ tên = ' + T.suMenh + ' → ' + ts.suMenh },
    { k: 'linhHon', ten: 'Linh Hồn', so: ts.linhHon, vai: 'khát khao bên trong', cach: 'Tổng các nguyên âm = ' + T.linhHon + ' → ' + ts.linhHon },
    { k: 'nhanCach', ten: 'Nhân Cách', so: ts.nhanCach, vai: 'ấn tượng bên ngoài', cach: 'Tổng các phụ âm = ' + T.nhanCach + ' → ' + ts.nhanCach });
  core.push({ k: 'ngaySinh', ten: 'Ngày Sinh', so: ts.ngaySinh, vai: 'năng khiếu bẩm sinh', cach: 'Ngày ' + T.d + ' → ' + ts.ngaySinh },
    { k: 'thaiDo', ten: 'Thái Độ', so: ts.thaiDo, vai: 'phản ứng đầu tiên, cách người khác nhìn bạn lúc mới gặp', cach: 'Ngày + tháng sinh ' + T.d + ' + ' + T.m + ' → ' + ts.thaiDo });
  core.forEach(function (c) { var X = S[c.so] || S[g(c.so)]; c.ten2 = X.ten; c.tk = X.tk; c.manh = X.manh; c.yeu = X.yeu; });
  out.coLoi = core;
  // ---- B3: chỉ số bổ sung
  var no = [];
  function xetNo(nhan, chuoi) { chuoi.forEach(function (n) { if (TS_NO[n] && !no.some(function (x) { return x.so === n && x.o === nhan; })) no.push({ so: n, o: nhan, ten: TS_NO[n].ten, y: TS_NO[n].y, bh: TS_NO[n].bh, sk: TS_NO[n].sk }); }); }
  xetNo('Ngày sinh', [T.d]);
  xetNo('Đường Đời', tsChuoi_(T.tongNgaySinh)); xetNo('Đường Đời', tsChuoi_(T.tongRutGon));
  if (ts.coTen) { xetNo('Định Mệnh', tsChuoi_(T.suMenh)); xetNo('Linh Hồn', tsChuoi_(T.linhHon)); xetNo('Nhân Cách', tsChuoi_(T.nhanCach)); }
  var bs = [];
  if (ts.coTen) bs.push({ ten: 'Trưởng Thành', so: ts.truongThanh, y: 'chủ đề nổi lên rõ sau khoảng 35–45 tuổi: ' + S[ts.truongThanh].tk, cach: 'Đường Đời + Định Mệnh' });
  bs.push({ ten: 'Thách Thức chính', so: ts.thachThucChinh, y: TS_THU_THACH[ts.thachThucChinh], cach: 'Hiệu của hai thách thức đầu (tháng – ngày, ngày – năm)' });
  if (ts.coTen) {
    bs.push({ ten: 'Cân Bằng', so: ts.canBang, y: 'cách lấy lại thăng bằng khi khủng hoảng: ' + S[ts.canBang].tk, cach: 'Tổng chữ cái đầu của các tiếng trong tên' });
    bs.push({ ten: 'Tiềm Thức', so: 9 - ts.baiHoc.length, y: (9 - ts.baiHoc.length >= 7 ? 'tự tin, xử lý tình huống bất ngờ tốt' : 9 - ts.baiHoc.length >= 5 ? 'phản ứng khá, cần thời gian để bình tĩnh' : 'dễ lúng túng khi gặp bất ngờ – nên chuẩn bị trước'), cach: '9 − số con số vắng trong tên (' + ts.baiHoc.length + ')' });
    bs.push({ ten: 'Bài Học Nghiệp', so: ts.baiHoc.length ? ts.baiHoc.join(', ') : '—', y: ts.baiHoc.length ? 'cần rèn: ' + ts.baiHoc.map(function (x) { return tsNgan_(S[x].tk, 1); }).join('; ') : 'tên có đủ 1–9, không có bài học nổi bật', cach: 'Các số 1–9 không xuất hiện trong tên' });
    bs.push({ ten: 'Đam Mê Ẩn', so: ts.damMe.join(', '), y: ts.damMe.map(function (x) { return tsNgan_(S[x].tk, 1); }).join('; '), cach: 'Số xuất hiện nhiều nhất trong tên' });
  }
  bs.push({ ten: 'Nợ Nghiệp', so: no.length ? no.map(function (x) { return x.so; }).filter(function (x, i, a) { return a.indexOf(x) === i; }).join(', ') : '—', y: no.length ? no.map(function (x) { return x.ten + ' (' + x.o + '): ' + x.y; }).join('; ') : 'không mang số nợ nghiệp', cach: 'Tổng trung gian 13, 14, 16, 19 ở ngày sinh, Đường Đời, các số tên' });
  out.boSung = bs; out.noNghiep = no;
  // ---- B4: chu kỳ
  var tuoi = viewYear - T.y, dcNay = 0;
  ts.dinhCao.forEach(function (p, i) { if (tuoi >= p.tu) dcNay = i; });
  out.dinhCao = ts.dinhCao.map(function (p, i) { return { so: p.so, tu: p.tu, den: p.den, namTu: T.y + p.tu, namDen: p.den >= 99 ? null : T.y + p.den, thuThach: p.thuThach, nay: i === dcNay, y: S[p.so].tk, tt: TS_THU_THACH[p.thuThach] }; });
  out.chuKy = [];
  for (var yy = viewYear - 4; yy <= viewYear + 13; yy++) { var pn = tsRutGon_(T.rd + T.rm + tsRutGon_(tsTongChuSo_(yy), false), false); out.chuKy.push({ nam: yy, so: pn, diem: TS_NANG_LUONG[pn], nay: yy === viewYear, y: TS_NAM[pn] }); }
  out.thang = ts.thangNay.map(function (m) { return { thang: m.thang, so: m.so, diem: TS_NANG_LUONG[m.so], y: TS_THANG[m.so] }; });
  var hom = new Date(), ngay = [];
  if (hom.getFullYear() !== viewYear) hom = new Date(viewYear, 0, 1);
  for (var i = 0; i < 30; i++) {
    var dd = new Date(hom.getFullYear(), hom.getMonth(), hom.getDate() + i), py = tsRutGon_(T.rd + T.rm + tsRutGon_(tsTongChuSo_(dd.getFullYear()), false), false);
    var pm = tsRutGon_(py + dd.getMonth() + 1, false), pd = tsRutGon_(pm + dd.getDate(), false);
    ngay.push({ ngay: dd.getDate() + '/' + (dd.getMonth() + 1), thu: dd.getDay(), so: pd, y: TS_NGAY[pd] });
  }
  out.ngay = ngay;
  // ---- B5: luận tổng hợp
  var NC = ts.coTen ? ts.nhanCach : ts.thaiDo, LH = ts.coTen ? ts.linhHon : null, NS = ts.ngaySinh, DM = ts.coTen ? ts.suMenh : ld;
  var luan = [];
  var tc = ['Bề ngoài bạn ' + TS_NGOAI[NC] + ' (' + (ts.coTen ? 'Nhân Cách' : 'Thái Độ') + ' ' + NC + ')' + (LH ? ', nhưng bên trong khao khát ' + TS_TRONG[LH] + ' (Linh Hồn ' + LH + ')' : '') + '; bạn ' + TS_HANH_DONG[ld] + ' (Đường Đời ' + ld + ').',
    'Tài năng bẩm sinh (Ngày Sinh ' + NS + '): ' + tsNgan_((S[NS] || S[g(NS)]).manh) + '.',
    '✓ Điểm mạnh: ' + S[ld].manh + '.', '✗ Điểm yếu: ' + S[ld].yeu + '.'];
  if (LH && NC && tsNhom_(LH) !== tsNhom_(NC)) tc.push('◇ Bên trong và bên ngoài thuộc hai nhóm năng lượng khác nhau: người mới quen dễ hiểu sai về bạn – hãy chủ động nói ra điều mình thật sự muốn.');
  else if (LH) tc.push('✓ Bên trong và bên ngoài cùng nhóm năng lượng: bạn sống khá "thật", người khác dễ hiểu bạn.');
  luan.push({ k: 'tinhCach', ten: 'Tính cách', icon: '🧭', dua: 'Đường Đời · Nhân Cách · Linh Hồn · Ngày Sinh', items: tc });
  luan.push({ k: 'suNghiep', ten: 'Sự nghiệp – tài chính', icon: '💼', dua: 'Định Mệnh · Đường Đời · Ngày Sinh', items: [
    'Nghề phù hợp (' + (ts.coTen ? 'Định Mệnh ' : 'Đường Đời ') + DM + '): ' + S[DM].nghe + '.',
    'Môi trường làm việc hợp (Đường Đời ' + ld + '): ' + TS_MOI_TRUONG[ld] + '.',
    'Kỹ năng nổi bật (Ngày Sinh ' + NS + '): ' + tsNgan_((S[NS] || S[g(NS)]).manh, 3) + '.',
    'Tài chính: ' + TS_TAI_CHINH[DM] + '.'].concat(ts.bieuDo[8] === 0 ? ['◇ Biểu đồ thiếu số 8: nên học quản lý tiền bài bản (ghi chép thu chi, tách quỹ).'] : []) });
  var hop = TS_NHOM[tsNhom_(ld)] || [];
  luan.push({ k: 'tinhDuyen', ten: 'Tình duyên – gia đình', icon: '💞', dua: 'Linh Hồn · Nhân Cách · Đường Đời', items: [
    LH ? 'Nhu cầu tình cảm (Linh Hồn ' + LH + '): bạn ' + TS_CAN_TINH[LH] + '.' : 'Nhu cầu tình cảm: ' + TS_CAN_TINH[g(ld)] + ' (theo Đường Đời, vì chưa có họ tên).',
    'Cách bạn thu hút (' + (ts.coTen ? 'Nhân Cách ' : 'Thái Độ ') + NC + '): người khác bị cuốn hút bởi vẻ ' + TS_NGOAI[NC] + '.',
    'Đối tượng hợp (Đường Đời ' + ld + ', ' + TS_NHOM_TEN[tsNhom_(ld)] + '): người có Đường Đời ' + hop.join(', ') + ' dễ đồng điệu; khác nhóm thì bổ sung cho nhau nhưng cần nhiều thấu hiểu hơn.',
    ts.bieuDo[5] === 0 ? '◇ Biểu đồ thiếu số 5 (trung tâm cảm xúc): hay ngại bày tỏ tình cảm – hãy nói lời yêu thương thành tiếng.' : ts.bieuDo[5] >= 3 ? '◇ Nhiều số 5: cảm xúc mãnh liệt, dễ nói lời làm tổn thương khi nóng giận.' : '✓ Có số 5 ở trung tâm: cảm xúc tương đối cân bằng.',
    ts.bieuDo[6] ? 'Gia đình: có số 6 trong ngày sinh – yêu gia đình, có trách nhiệm' + (ts.bieuDo[6] >= 2 ? ', dễ lo lắng quá mức cho người thân.' : '.') : 'Gia đình: thiếu số 6 – nên chủ động dành thời gian cho việc nhà và người thân.'] });
  var sk = ['Vùng cần để ý (Đường Đời ' + ld + '): ' + TS_SUC_KHOE[ld] + '.', 'Theo Thách Thức chính ' + ts.thachThucChinh + ': ' + TS_THACH_SK[ts.thachThucChinh] + '.'];
  no.forEach(function (x, i) { if (no.map(function (y) { return y.so; }).indexOf(x.so) === i) sk.push('Nợ nghiệp ' + x.so + ': ' + x.sk + '.'); });
  if (ts.bieuDo[2] >= 3) sk.push('Nhiều số 2: hệ thần kinh nhạy, dễ mất ngủ khi căng thẳng.');
  luan.push({ k: 'sucKhoe', ten: 'Sức khỏe', icon: '🌿', dua: 'Đường Đời · Thách Thức · Nợ Nghiệp', items: sk });
  var hon = ['Bài học đường đời (Đường Đời ' + ld + '): ' + S[ld].bh + '.', 'Bài học từ thách thức chính (' + ts.thachThucChinh + '): ' + TS_THU_THACH[ts.thachThucChinh] + '.'];
  if (ts.coTen && ts.baiHoc.length) hon.push('Bài học nghiệp (số vắng trong tên ' + ts.baiHoc.join(', ') + '): ' + ts.baiHoc.map(function (x) { return 'rèn ' + tsNgan_(S[x].tk, 1); }).join('; ') + '.');
  no.forEach(function (x, i) { if (no.map(function (y) { return y.so; }).indexOf(x.so) === i) hon.push(x.ten + ': ' + x.y + ' → bài học ' + x.bh + '.'); });
  ts.muiTen.filter(function (a) { return !a.tot; }).forEach(function (a) { hon.push(a.ten + ': ' + a.y + '.'); });
  luan.push({ k: 'linhHon', ten: 'Bài học linh hồn', icon: '🕯', dua: 'Đường Đời · Bài học nghiệp · Nợ nghiệp · mũi tên trống', items: hon });
  var dc = out.dinhCao[dcNay], dcSau = out.dinhCao[dcNay + 1], cn = out.chuKy.filter(function (c) { return c.nay; })[0];
  var vt = ['Năm ' + viewYear + ' là Năm Cá Nhân ' + cn.so + ': ' + cn.y,
    'Giai đoạn đời hiện tại – Đỉnh Cao ' + (dcNay + 1) + ' (số ' + dc.so + ', ' + dc.tu + '–' + (dc.den >= 99 ? 'cuối đời' : dc.den) + ' tuổi): ' + dc.y + '. Thử thách kèm theo (' + dc.thuThach + '): ' + dc.tt + '.'];
  if (dcSau) vt.push('Từ năm ' + dcSau.namTu + ' (' + dcSau.tu + ' tuổi) chuyển sang Đỉnh Cao ' + (dcNay + 2) + ' – số ' + dcSau.so + ': ' + dcSau.y + '.');
  var n1 = out.chuKy.filter(function (c) { return c.nam > viewYear && c.so === 1; })[0], n8 = out.chuKy.filter(function (c) { return c.nam >= viewYear && c.so === 8; })[0];
  if (n1) vt.push('Chu kỳ 9 năm mới bắt đầu năm ' + n1.nam + ' – thời điểm tốt để khởi sự việc lớn.');
  if (n8) vt.push('Năm thu hoạch gần nhất: ' + n8.nam + ' (Năm Cá Nhân 8) – hợp thăng tiến, tài chính.');
  luan.push({ k: 'vanTrinh', ten: 'Vận trình theo năm', icon: '📅', dua: 'Năm Cá Nhân · Đỉnh Cao · Thử Thách', items: vt });
  out.luan = luan;
  // ---- B6: lời khuyên
  var thangTot = out.thang.filter(function (m) { return [1, 3, 8].indexOf(m.so) >= 0; }).map(function (m) { return m.thang; });
  out.loiKhuyen = [
    { ten: 'Điểm mạnh cần phát huy', t: 'Hãy phát huy sự ' + tsNgan_(S[ld].manh, 3) + (NS !== ld ? ', cùng năng khiếu ' + tsNgan_((S[NS] || S[g(NS)]).manh, 2) : '') + '.' + ts.muiTen.filter(function (a) { return a.tot; }).slice(0, 2).map(function (a) { return ' ' + a.ten + ': ' + a.y + '.'; }).join('') },
    { ten: 'Điểm yếu cần khắc phục', t: S[ld].yeu.charAt(0).toUpperCase() + S[ld].yeu.slice(1) + ' – hướng khắc phục: ' + S[ld].bh + '.' },
    { ten: 'Thời điểm hành động', t: 'Năm ' + viewYear + ' (năm cá nhân ' + cn.so + ') nên tập trung ' + TS_THANG[cn.so] + '. Tháng thuận để khởi sự, giao tiếp hoặc ký kết: ' + (thangTot.length ? thangTot.join(', ') : '—') + ' (dương lịch).' + (n1 ? ' Việc lớn nên khởi động vào năm ' + n1.nam + '.' : '') },
    { ten: 'Hướng phát triển', t: 'Giai đoạn này (đỉnh cao số ' + dc.so + ') hãy phát triển ' + dc.y + '.' + (dcSau ? ' Chuẩn bị cho giai đoạn từ ' + dcSau.namTu + ': ' + dcSau.y + '.' : '') },
    { ten: 'Bài học cần học', t: 'Thách thức chính: ' + TS_THU_THACH[ts.thachThucChinh] + '.' + (no.length ? ' Nợ nghiệp: ' + no.map(function (x) { return x.bh; }).filter(function (x, i, a) { return a.indexOf(x) === i; }).join('; ') + '.' : '') }
  ];
  // ---- Trường hợp đặc biệt
  var db = [], ms = [];
  [['Đường Đời', ld], ['Ngày Sinh', ts.ngaySinh]].concat(ts.coTen ? [['Định Mệnh', ts.suMenh], ['Linh Hồn', ts.linhHon], ['Nhân Cách', ts.nhanCach], ['Trưởng Thành', ts.truongThanh]] : [])
    .concat(ts.dinhCao.map(function (p, i) { return ['Đỉnh Cao ' + (i + 1), p.so]; })).forEach(function (x) { if (TS_MASTER[x[1]]) ms.push(x); });
  if (ms.length) db.push({ ten: 'Số bậc thầy (11, 22, 33)', co: true, t: ms.map(function (x) { return x[0] + ' ' + x[1]; }).join(', ') + ': không rút gọn tiếp – tiềm năng cao nhưng áp lực lớn, cần cân bằng lý tưởng và thực tế. ' + ms.map(function (x) { return x[1]; }).filter(function (x, i, a) { return a.indexOf(x) === i; }).map(function (x) { return 'Số ' + x + ': ' + TS_MASTER[x].toLowerCase(); }).join('; ') + '.' });
  else db.push({ ten: 'Số bậc thầy (11, 22, 33)', co: false, t: 'Không có trong các chỉ số chính.' });
  db.push({ ten: 'Số nợ nghiệp (13, 14, 16, 19)', co: no.length > 0, t: no.length ? no.map(function (x) { return x.so + ' ở ' + x.o; }).join(', ') + '. Cách xử lý: nhận diện bài học, chủ động sửa đổi, kiên nhẫn với bản thân.' : 'Không có.' });
  var co0 = [['Đường Đời', tsChuoi_(T.tongNgaySinh)]].concat(ts.coTen ? [['Định Mệnh', tsChuoi_(T.suMenh)]] : []).filter(function (x) { return x[1].some(function (n) { return n === 10 || n === 20 || n === 30; }); });
  db.push({ ten: 'Số 0 (10, 20, 30)', co: co0.length > 0, t: co0.length ? co0.map(function (x) { return x[0] + ' đi qua ' + x[1].filter(function (n) { return n % 10 === 0 && n; })[0]; }).join(', ') + ': số 0 khuếch đại sức mạnh của con số đi kèm – tiềm năng lớn, cần định hướng rõ.' : 'Không có.' });
  var lap = []; for (var k = 1; k <= 9; k++) if (ts.bieuDo[k] >= 3) lap.push(k + ' (×' + ts.bieuDo[k] + ')');
  db.push({ ten: 'Số lặp trong ngày sinh', co: lap.length > 0, t: lap.length ? 'Số ' + lap.join(', ') + ': năng lượng của con số này được tăng cường – vừa là thế mạnh, vừa là bài học quan trọng.' : 'Không có con số nào lặp từ 3 lần trở lên.' });
  if (ts.coTen) db.push({ ten: 'Tên có dấu tiếng Việt', co: true, t: '"' + out.duLieu.ten + '" → "' + ts.tenChuan + '" (bỏ dấu, Đ → D, giữ nguyên thứ tự họ – đệm – tên).' });
  out.dacBiet = db;
  // ---- Ứng dụng: tự khám phá
  var hh = [];
  if (ts.coTen) {
    var nh = [tsNhom_(ld), tsNhom_(LH), tsNhom_(NC)], giong = nh.filter(function (x) { return x === nh[0]; }).length;
    hh.push('Đường Đời ' + ld + ' (mục đích) · Linh Hồn ' + LH + ' (khát khao) · Nhân Cách ' + NC + ' (bề ngoài).');
    hh.push(giong === 3 ? '✓ Ba con số cùng nhóm năng lượng: điều bạn muốn, điều bạn thể hiện và con đường của bạn thống nhất – sống thuận tự nhiên.' :
      nh[0] === nh[1] ? '◇ Khát khao khớp con đường sống, nhưng vẻ ngoài khác nhóm – người khác cần thời gian mới hiểu đúng bạn.' :
      '◇ Khát khao bên trong khác nhóm với con đường sống – dễ giằng co "muốn một đằng, phải làm một nẻo"; hãy tìm công việc dung hòa cả hai.');
  } else hh.push('Nhập họ tên khai sinh để so sánh Đường Đời – Linh Hồn – Nhân Cách.');
  out.hoaHop = hh;
  return out;
}
