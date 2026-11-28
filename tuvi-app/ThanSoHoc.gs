/**
 * ============================================================
 *  ThanSoHoc.gs — THẦN SỐ HỌC PYTHAGORAS (trường phái phổ biến ở Việt Nam)
 *  - Số Chủ đạo (Đường đời) 1–9, 11/2, 22/4, 33/6; số Ngày sinh; số Thái độ
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
  7: { ten: 'Người tìm chân lý', tk: 'phân tích, tâm linh, trải nghiệm, học qua chiêm nghiệm', manh: 'sâu sắc, ham học, trực giác và trí tuệ cao, độc lập tư duy', yeu: 'khép kín, hoài nghi, hay thu mình, học qua va vấp', nghe: 'nghiên cứu, khoa học, công nghệ, triết học, tâm linh, phân tích', bh: 'chia sẻ tri thức, mở lòng tin người' },
  8: { ten: 'Người quyền lực', tk: 'tài chính, quản trị, độc lập, thành tựu', manh: 'tham vọng, giỏi kinh doanh, bản lĩnh, nhìn ra giá trị', yeu: 'độc đoán, thực dụng, làm việc quá sức, khó bày tỏ cảm xúc', nghe: 'kinh doanh, tài chính – ngân hàng, bất động sản, quản lý cấp cao, luật', bh: 'dùng quyền lực và tiền bạc để phụng sự, cân bằng vật chất – tinh thần' },
  9: { ten: 'Người nhân đạo', tk: 'lý tưởng, trách nhiệm cộng đồng, tham vọng, bao dung', manh: 'rộng lượng, có tầm nhìn lớn, giàu lòng trắc ẩn, truyền cảm hứng', yeu: 'lý tưởng hóa, khó buông bỏ, dễ thất vọng về người khác', nghe: 'giáo dục, từ thiện, nghệ thuật, y tế, luật, chính trị – xã hội', bh: 'buông bỏ, cho đi không điều kiện' },
  10: { ten: 'Người linh hoạt (10/1)', tk: 'thích nghi, độc lập, may mắn, khởi đầu mới', manh: 'có tố chất số 1 nhưng mềm dẻo hơn, dễ thích nghi, được may mắn nâng đỡ', yeu: 'dao động giữa tự tin và ngờ vực, dễ chủ quan', nghe: 'kinh doanh, quản lý, sáng tạo, bán hàng, công việc cần linh hoạt', bh: 'tin vào bản thân mà vẫn biết lắng nghe' },
  11: { ten: 'Bậc thầy trực giác (11/2)', tk: 'trực giác, tâm linh, truyền cảm hứng, nhạy cảm cao', manh: 'nhìn thấu, có sức ảnh hưởng tinh thần, sáng tạo, lý tưởng cao', yeu: 'căng thẳng thần kinh, dễ bất an, mâu thuẫn giữa lý tưởng và thực tế', nghe: 'tâm lý, giáo dục, nghệ thuật, tâm linh, diễn giả, chữa lành', bh: 'biến trực giác thành hành động phụng sự, giữ vững trung tâm' },
  22: { ten: 'Bậc thầy kiến tạo (22/4)', tk: 'xây dựng lớn, tầm nhìn thực tế, trách nhiệm xã hội', manh: 'biến ước mơ lớn thành hiện thực, tổ chức giỏi, bản lĩnh', yeu: 'áp lực tự đặt ra rất lớn, cứng nhắc, sợ thất bại', nghe: 'quản lý dự án lớn, kiến trúc, chính sách, doanh nghiệp, kỹ thuật', bh: 'kiên nhẫn xây từng viên gạch vì lợi ích chung' },
  33: { ten: 'Bậc thầy chữa lành (33/6)', tk: 'yêu thương vô điều kiện, dạy dỗ, hy sinh', manh: 'lòng trắc ẩn lớn, truyền cảm hứng, chữa lành người khác', yeu: 'hy sinh quá mức, gánh vác thay người khác, cầu toàn', nghe: 'giáo dục, y tế, tư vấn, nghệ thuật, hoạt động cộng đồng', bh: 'phụng sự mà không đánh mất bản thân' }
};

/** Ý nghĩa từng con số trên biểu đồ ngày sinh */
var TS_BD = {
  1: { y: 'khả năng biểu đạt bản thân, giao tiếp nội tâm', c: ['Thiếu 1: bạn nghe và quan sát tốt, ít nói lời thừa; mặt trái: khó nói ra suy nghĩ thật, dễ bị hiểu lầm và chịu thiệt vì không lên tiếng đúng lúc', 'Một số 1: bạn biết điều gì nên nói; mặt trái: hay giữ trong lòng, người thân thường không biết bạn đang nghĩ gì', 'Hai số 1: biểu đạt cân bằng, giao tiếp tốt cả nói lẫn viết; mặt trái: dễ tin mình đã nói rõ trong khi người nghe hiểu khác', 'Ba số 1: hoặc rất hoạt ngôn, hoặc rất kiệm lời; mặt trái: dễ nói lấn át người khác, hoặc im lặng đến mức bị cho là lạnh lùng. Gợi ý: hỏi lại xem người nghe đã hiểu đúng ý mình chưa', 'Bốn số 1 trở lên: nhạy với lời nói, chọn chữ kỹ; mặt trái: dễ tổn thương vì một câu nói rồi thu mình lại, khó giải thích bản thân với người khác'] },
  2: { y: 'trực giác, nhạy cảm, cảm nhận người khác', c: ['Thiếu 2: bạn ít bị cảm xúc người khác chi phối, quyết nhanh; mặt trái: trực giác yếu, dễ thiếu kiên nhẫn và vô tình làm người khác phật lòng', 'Một số 2: trực giác tốt, nhạy cảm vừa phải; mặt trái: khi mệt dễ đọc sai thái độ người khác', 'Hai số 2: trực giác mạnh, đọc vị người khác tốt; mặt trái: dễ tổn thương, dễ để tâm trạng người xung quanh kéo mình xuống', 'Ba số 2: rất nhạy cảm, hiểu người nhanh; mặt trái: dễ bận lòng lâu, hay chiều theo ý người khác rồi chịu thiệt. Gợi ý: có một người tin cậy để chia sẻ', 'Bốn số 2 trở lên: cảm nhận cực nhạy; mặt trái: dễ bất an, dễ kiệt sức ở môi trường ồn ào, căng thẳng'] },
  3: { y: 'trí nhớ, tư duy, óc sáng tạo và phân tích', c: ['Thiếu 3: bạn thiên thực hành, làm hơn nói; mặt trái: trí nhớ ngắn hạn kém, dễ quên việc và chi tiết nếu không ghi chép', 'Một số 3: trí nhớ tốt, lạc quan, tư duy mạch lạc; mặt trái: dễ chủ quan vì nghĩ mình đã nắm hết vấn đề', 'Hai số 3: trí tưởng tượng và óc sáng tạo mạnh; mặt trái: dễ sống trong đầu, nghĩ nhiều mà làm ít', 'Ba số 3: đầu óc sắc, phân tích nhanh; mặt trái: suy nghĩ quá nhiều, hay lo xa, hay tranh luận và khó hòa hợp về cảm xúc', 'Bốn số 3 trở lên: trí óc hoạt động không ngừng; mặt trái: dễ căng thẳng, khó ngủ, người khác khó theo kịp bạn'] },
  4: { y: 'trật tự, thực tế, khéo tay, tổ chức', c: ['Thiếu 4: bạn linh hoạt, không bị quy trình bó buộc; mặt trái: thiếu ngăn nắp, khó kiên trì với việc tay chân và việc lặp lại', 'Một số 4: thực tế, gọn gàng, khéo tay; mặt trái: dễ bực bội khi mọi thứ lộn xộn', 'Hai số 4: rất có tổ chức, giỏi kỹ thuật – thủ công; mặt trái: dễ cứng nhắc, khó chấp nhận cách làm khác mình', 'Ba số 4 trở lên: làm việc bền, chắc tay; mặt trái: quá chú trọng vật chất, cứng nhắc, làm việc quá sức đến hao mòn', 'Nhiều số 4: sức làm việc lớn; mặt trái: rất bảo thủ, thiếu linh hoạt, dễ va chạm với người thích đổi mới'] },
  5: { y: 'cảm xúc, tình yêu, ý chí và động lực (trung tâm biểu đồ)', c: ['Thiếu 5: bạn ít bốc đồng; mặt trái: khó giữ động lực, dễ nản, cảm xúc khó ổn định và khó nói lời yêu thương', 'Một số 5: cảm xúc cân bằng, có động lực, yêu thương rõ ràng; mặt trái: khi bị dồn ép lâu vẫn có lúc bùng lên bất ngờ', 'Hai số 5: quyết tâm mạnh, cảm xúc mãnh liệt; mặt trái: dễ tự cao, dễ áp đặt ý mình lên người khác', 'Ba số 5: cảm xúc dữ dội, sức sống lớn; mặt trái: dễ nói lời làm tổn thương người thân khi nóng giận', 'Nhiều số 5: năng lượng dồi dào; mặt trái: bốc đồng, dễ quyết vội rồi hối tiếc'] },
  6: { y: 'sáng tạo, trách nhiệm với gia đình – nhà cửa', c: ['Thiếu 6: bạn tự do, ít bị việc nhà ràng buộc; mặt trái: ít gắn bó việc nhà, người thân dễ thấy bạn vô tâm', 'Một số 6: yêu gia đình, có óc sáng tạo và trách nhiệm; mặt trái: dễ ôm việc nhà một mình rồi mệt', 'Hai số 6: rất lo cho gia đình; mặt trái: dễ căng thẳng, hay can thiệp vào việc của người thân', 'Ba số 6 trở lên: tận tụy với gia đình; mặt trái: lo âu quá mức, dễ bất mãn vì thấy mình hy sinh mà không được ghi nhận', 'Nhiều số 6: trách nhiệm rất cao; mặt trái: đời sống xoay hết quanh gia đình, dễ ngột ngạt cho cả bạn lẫn người thân'] },
  7: { y: 'bài học qua trải nghiệm, chiêm nghiệm, tâm linh', c: ['Thiếu 7: bạn thường học qua sách vở và kinh nghiệm người khác nên ít phải trả giá đắt; mặt trái: dễ thiếu chiều sâu của trải nghiệm thật', 'Một số 7: bạn học qua trải nghiệm cá nhân và nhớ rất lâu; mặt trái: thường phải qua một lần mất mát (tình cảm, công việc hoặc tiền bạc) mới rút ra bài học', 'Hai số 7: trí tuệ sâu sắc nhờ trải nghiệm; mặt trái: dễ gặp mất mát, va vấp ở hai mặt đời sống (tình cảm, công việc hoặc tiền bạc)', 'Ba số 7 trở lên: hiểu đời sâu hơn người cùng tuổi; mặt trái: đời nhiều mất mát và thử thách, dễ có giai đoạn buồn, cô độc kéo dài', 'Nhiều số 7: thiên hướng triết học – tôn giáo mạnh; mặt trái: dễ xa rời đời sống thường ngày và người thân'] },
  8: { y: 'khả năng quan sát chi tiết, độc lập, trách nhiệm tài chính', c: ['Thiếu 8: bạn ít bị chi tiết làm phiền; mặt trái: dễ bừa bộn, thiếu chú ý chi tiết, quản lý tiền kém', 'Một số 8: gọn gàng, độc lập, biết quản lý tiền; mặt trái: đôi khi quá tự lực, ngại nhờ ai', 'Hai số 8: rất chi tiết, cẩn trọng; mặt trái: khó tính, hay soi lỗi người khác', 'Ba số 8 trở lên: năng động, thích xê dịch; mặt trái: bồn chồn, khó ổn định chỗ ở và công việc', 'Nhiều số 8: nhạy bén, phản ứng nhanh; mặt trái: hay vội quyết định rồi phải sửa'] },
  9: { y: 'lý tưởng, tham vọng, trách nhiệm cộng đồng', c: ['Thiếu 9: bạn có xu hướng đặt mục tiêu gần và thực tế; mặt trái: dễ thiếu một lý tưởng dài hạn để bám vào khi gặp khó (đây là nét chung của gần như cả thế hệ sinh từ năm 2000, vì năm sinh không có chữ số 9, chứ không phải điểm riêng của bạn)', 'Một số 9: có lý tưởng, trách nhiệm, bao dung; mặt trái: dễ ôm cả việc của người khác', 'Hai số 9: lý tưởng cao; mặt trái: dễ chỉ trích người không đạt chuẩn của mình', 'Ba số 9: rất lý tưởng; mặt trái: dễ xa rời thực tế, hay thất vọng về người và việc', 'Bốn số 9 trở lên: tầm nhìn rộng; mặt trái: lý tưởng lấn át đời sống riêng, dễ bỏ bê bản thân và gia đình'] }
};

var TS_MUI_TEN = [
  { so: [1, 2, 3], ten: 'Mũi tên Kế hoạch', co: 'giỏi lập kế hoạch, tổ chức, tư duy mạch lạc; mặt trái: dễ mất bình tĩnh khi kế hoạch bị phá ngang, khó xoay xở khi việc không theo trình tự' },
  { so: [4, 5, 6], ten: 'Mũi tên Ý chí', co: 'ý chí mạnh, quyết tâm theo đuổi mục tiêu đến cùng; mặt trái: dễ cố chấp, khó buông việc đã sai hướng', trong: 'Mũi tên trống – Dễ thất vọng (trống 4-5-6): bạn dễ hụt hẫng, dồn nén khi việc không như ý, có giai đoạn mất động lực kéo dài; điểm được là bạn ít ảo tưởng, nhìn thất bại khá tỉnh. Gợi ý: đặt mục tiêu nhỏ và chia sẻ với người tin cậy' },
  { so: [7, 8, 9], ten: 'Mũi tên Hoạt động', co: 'năng động, hành động nhiều, học bằng làm; mặt trái: dễ làm trước nghĩ sau, ôm nhiều việc cùng lúc', trong: 'Mũi tên trống – Thụ động (trống 7-8-9): bạn nghĩ nhiều hơn làm, dễ trì hoãn, để lỡ cơ hội vì chờ đủ điều kiện; điểm được là bạn ít hành động liều. Gợi ý: mỗi tuần đặt một việc cụ thể và làm cho xong' },
  { so: [1, 4, 7], ten: 'Mũi tên Thực tế (Thể chất)', co: 'khéo tay, thực tế, bền bỉ về thể chất, giỏi việc vật chất; mặt trái: dễ coi nhẹ chuyện cảm xúc, tinh thần', trong: 'Mũi tên trống – Thiếu thực tế (trống 1-4-7): bạn làm theo cảm hứng hơn kế hoạch, dễ bừa bộn, vụng việc tay chân và quản lý vật chất kém; điểm được là bạn ít bị khuôn phép bó buộc. Gợi ý: ghi việc cần làm mỗi ngày' },
  { so: [2, 5, 8], ten: 'Mũi tên Cân bằng cảm xúc', co: 'cảm xúc ổn định, tinh thần vững, dễ tạo cảm giác an toàn; mặt trái: ít bộc lộ, người khác khó đoán cảm xúc thật của bạn', trong: 'Mũi tên trống – Nhạy cảm (trống 2-5-8): bạn dễ chạnh lòng, tự nghi ngờ mình, dễ bị lời nói người khác làm tổn thương và tự ti kéo dài; điểm được là bạn tinh ý, hiểu nỗi đau của người khác. Gợi ý: ở gần những người tôn trọng bạn' },
  { so: [3, 6, 9], ten: 'Mũi tên Trí tuệ', co: 'trí nhớ và tư duy xuất sắc, học giỏi, sáng tạo; mặt trái: dễ coi thường người chậm hơn, sống trong đầu nhiều', trong: 'Mũi tên trống – Trí nhớ ngắn (trống 3-6-9): bạn dễ quên, học lý thuyết chậm và khó nhớ lâu nếu không thực hành; điểm được là bạn học nhanh qua tay chân, qua kinh nghiệm thật. Gợi ý: ghi chép và ôn lại' },
  { so: [1, 5, 9], ten: 'Mũi tên Quyết tâm', co: 'kiên trì, quyết tâm cao, không bỏ cuộc giữa chừng; mặt trái: dễ bướng, cố theo cả những việc không còn đáng theo', trong: 'Mũi tên trống – Trì hoãn (trống 1-5-9): bạn chần chừ trước việc lớn, dễ lỡ thời cơ, việc kéo dài mà không xong; điểm được là bạn ít quyết liều. Gợi ý: làm bước đầu ngay trong ngày' },
  { so: [3, 5, 7], ten: 'Mũi tên Tâm linh (Nhạy bén)', co: 'thấu hiểu sâu, trực giác và tâm linh mạnh, bình an nội tâm; mặt trái: dễ xa rời chuyện thực tế, tiền bạc', trong: 'Mũi tên trống – Hoài nghi (trống 3-5-7): bạn cần bằng chứng rõ mới tin, dễ nghi ngờ người khác và bất an trước những điều không chắc; điểm được là bạn khó bị lừa. Gợi ý: tin từng bước với người đã chứng tỏ được mình' }
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

/** Số chủ đạo: cộng tất cả chữ số ngày sinh; rút gọn về 1–9, giữ 11, 22, 33 */
function tsDuongDoi_(d, m, y) {
  return tsRutGon_(tsTongChuSo_('' + d + m + y), true);
}

function thanSoHocLap_(input, solar, viewYear) {
  var d = solar.day, m = solar.month, y = solar.year;
  var ld = tsDuongDoi_(d, m, y);
  var ngay = tsRutGon_(d, false), thaiDo = tsRutGon_(tsTongChuSo_('' + d + m), true);
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
      if ('AEIOU'.indexOf(w.charAt(i)) >= 0) nh += v; else pa += v; // Y luôn là phụ âm
    }
    linhHon += nh; nhanCach += pa; suMenh += nh + pa;
    tenTu.push({ tu: w, nguyenAm: nh, phuAm: pa });
    cb += TS_CHU[w.charAt(0)] || 0;
  });
  if (!linhHon || !nhanCach) coTen = false; // tên quá ngắn (thiếu nguyên âm hoặc phụ âm)
  var R = { duongDoi: ld, duongDoiGoc: tsGoc_(ld), ngaySinh: ngay, thaiDo: thaiDo, bieuDo: dem, muiTen: muiTen, coTen: coTen, tenChuan: ten };
  if (coTen) {
    R.linhHon = tsRutGon_(linhHon, true); R.nhanCach = tsRutGon_(nhanCach, true); R.suMenh = tsRutGon_(suMenh, true);
    R.truongThanh = tsRutGon_(ld + R.suMenh, true);
    R.canBang = tsRutGon_(cb, false);
    R.baiHoc = []; for (k = 1; k <= 9; k++) if (!demTen[k]) R.baiHoc.push(k);
    var maxc = 0; for (k = 1; k <= 9; k++) maxc = Math.max(maxc, demTen[k]);
    R.damMe = []; for (k = 1; k <= 9; k++) if (demTen[k] === maxc && maxc > 0) R.damMe.push(k);
    R.demTen = demTen;
  }
  // Đỉnh cao & thử thách
  var rm = tsRutGon_(m, false), rd = tsRutGon_(d, false), ry = tsRutGon_(tsTongChuSo_(y), false);
  var sm = tsTongChuSo_(m), sd = tsTongChuSo_(d), sy = tsTongChuSo_(y);
  var p1 = tsRutGon_(sm + sd, true), p2 = tsRutGon_(sd + sy, true), p3 = tsRutGon_(p1 + p2, true), p4 = tsRutGon_(sm + sy, true);
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
  1: 'Năm khởi đầu chu kỳ 9 năm: hợp gieo hạt – bắt đầu dự án, công việc, mối quan hệ mới, tự lập. Mặt trái: việc mới tốn sức, kết quả chưa thấy ngay, dễ thấy cô đơn vì phải tự quyết nhiều.',
  2: 'Năm kiên nhẫn và hợp tác: hợp vun đắp quan hệ; tình cảm – hôn nhân được chú ý. Mặt trái: việc tiến chậm, dễ nhạy cảm, phụ thuộc vào quyết định của người khác; vội vàng thì hỏng việc.',
  3: 'Năm sáng tạo và giao tiếp: mở rộng xã hội, học hỏi, thể hiện bản thân. Mặt trái: dễ phân tán, chi cho vui chơi vượt dự tính, nói nhiều thành lỡ lời.',
  4: 'Năm xây nền móng: hợp làm việc chăm chỉ, kỷ luật, sắp xếp tài chính – nhà cửa – sức khỏe. Mặt trái: nhiều việc nặng, ít may mắn bất ngờ, dễ mệt và thấy bị bó buộc.',
  5: 'Năm thay đổi và tự do: có di chuyển, cơ hội mới, đổi việc/đổi chỗ ở. Mặt trái: dễ bất ổn, bốc đồng, hao tiền vì quyết định vội.',
  6: 'Năm trách nhiệm và yêu thương: gia đình, hôn nhân, con cái, nhà cửa được chú trọng. Mặt trái: gánh nặng gia đình tăng, dễ ôm việc của người thân và mệt vì phải lo cho nhiều người.',
  7: 'Năm nội tâm và học hỏi: hợp nghiên cứu, tu dưỡng, nhìn lại. Mặt trái: dễ cô đơn, buồn chán, thu nhập chững lại; không hợp mạo hiểm tiền bạc.',
  8: 'Năm thu hoạch và quyền lực: tài chính, thăng tiến, được công nhận cho những gì đã gieo 7 năm qua. Mặt trái: áp lực tiền bạc và trách nhiệm lớn, dễ làm quá sức; những năm trước làm ẩu thì năm này phải trả giá.',
  9: 'Năm kết thúc và buông bỏ: hoàn tất, dọn dẹp những gì không còn phù hợp để chuẩn bị chu kỳ mới. Mặt trái: dễ có chia tay, mất mát hoặc kết thúc một mối quan hệ, một công việc; tâm trạng hay nặng nề.'
};
var TS_THU_THACH = {
  0: 'thử thách lựa chọn – không có một điểm yếu rõ, nhưng dễ mông lung, chọn mãi không xong hướng đi',
  1: 'cái tôi – hoặc bị người khác lấn át, hoặc tự mình thành độc đoán',
  2: 'nhạy cảm quá mức, sợ bị từ chối, dễ để người khác quyết thay mình',
  3: 'khó bày tỏ cảm xúc, dễ phân tán và tự ti',
  4: 'thiếu kỷ luật và kiên nhẫn, ngại việc nặng, dễ bỏ dở',
  5: 'dùng tự do thiếu trách nhiệm, dễ cực đoan và sa vào cám dỗ',
  6: 'trách nhiệm gia đình đè nặng, cầu toàn, hay kiểm soát người thân',
  7: 'hoài nghi, khó tin người, dễ tự cô lập',
  8: 'quan hệ với tiền bạc và quyền lực – hoặc quá ham, hoặc né tránh tiền và quyền'
};

function thanSoHocLuan_(ts) {
  var S = TS_SO, L = S[ts.duongDoi], secs = [];
  secs.push({ tieuDe: 'Số chủ đạo ' + ts.duongDoi + (ts.duongDoi >= 10 ? '/' + ts.duongDoiGoc : '') + ' – ' + L.ten, items: [
    'Từ khóa: ' + L.tk + '.', '✓ Điểm mạnh: ' + L.manh + '.', '✗ Mặt trái: ' + L.yeu + '.', 'Nghề nghiệp hợp: ' + L.nghe + '.', 'Bài học đường đời: ' + L.bh + '.'] });
  var N = S[ts.ngaySinh] || S[tsGoc_(ts.ngaySinh)], T = S[ts.thaiDo];
  secs.push({ tieuDe: 'Số ngày sinh ' + ts.ngaySinh + ' & số thái độ ' + ts.thaiDo, items: [
    'Số ngày sinh (năng khiếu bẩm sinh, hỗ trợ số chủ đạo): ' + N.tk + ' – ' + N.manh + '.',
    'Số thái độ (ấn tượng đầu tiên người khác nhận về bạn): ' + T.tk + '; dễ bị nhìn thấy mặt ' + T.yeu.split(',')[0] + '.'] });
  var bd = [];
  for (var k = 1; k <= 9; k++) { var c = ts.bieuDo[k]; bd.push((c === 0 ? '◇ ' : c >= 3 ? '◇ ' : '✓ ') + 'Số ' + k + ' (' + TS_BD[k].y + ') × ' + c + ': ' + TS_BD[k].c[Math.min(4, c)] + '.'); }
  secs.push({ tieuDe: 'Biểu đồ ngày sinh – từng con số', items: bd });
  secs.push({ tieuDe: 'Mũi tên trên biểu đồ', items: ts.muiTen.length ? ts.muiTen.map(function (a) { return (a.tot ? '✓ ' + a.ten + ' (' + a.so + ')' : '✗ ' + a.ten) + ': ' + a.y + '.'; }) : ['Không có mũi tên đầy hay trống trọn vẹn – năng lực phân bố đều: không có điểm trội hẳn, nhưng cũng không có chỗ hổng lớn.'] });
  if (ts.coTen) {
    var ten = [
      'Số linh hồn ' + ts.linhHon + ' (khát khao sâu thẳm – từ nguyên âm): ' + S[ts.linhHon].tk + '.',
      'Số nhân cách ' + ts.nhanCach + ' (vẻ ngoài xã hội – từ phụ âm): ' + S[ts.nhanCach].tk + '; người khác thấy bạn ' + S[ts.nhanCach].manh.split(',').slice(0, 2).join(',') + '.',
      'Số sứ mệnh ' + ts.suMenh + ' (tài năng và mục tiêu – toàn bộ tên): ' + S[ts.suMenh].tk + '; hợp ' + S[ts.suMenh].nghe + '.',
      'Số trưởng thành ' + ts.truongThanh + ' (chủ đề nổi lên sau khoảng 35–45 tuổi): ' + S[ts.truongThanh].tk + '.',
      'Số cân bằng ' + ts.canBang + ' (cách ứng xử khi khủng hoảng – từ chữ cái đầu): ' + S[ts.canBang].tk + '.',
      ts.baiHoc.length ? '◇ Bài học mang theo (số vắng trong tên): ' + ts.baiHoc.join(', ') + ' – dễ thiếu: ' + ts.baiHoc.map(function (x) { return S[x].tk.split(',')[0]; }).join('; ') + '.' : '✓ Tên đủ các số 1–9: không có bài học mang theo nổi bật.',
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
var TS_TAI_CHINH = { 1: 'kiếm tiền tốt khi được tự làm chủ; mặt trái: chi mạnh tay cho mục tiêu riêng, dễ hụt vì không chịu nghe góp ý', 2: 'tài chính ổn khi có đối tác tin cậy; mặt trái: dễ mất tiền vì cho vay, bảo lãnh do nể', 3: 'tiền đến từ giao tiếp, sáng tạo; mặt trái: tiêu theo cảm hứng, khó tích lũy',
  4: 'tích lũy chậm mà chắc, giỏi tiết kiệm; mặt trái: tài sản lớn lên chậm, dễ bỏ lỡ cơ hội vì quá dè dặt', 5: 'cơ hội kiếm tiền nhiều; mặt trái: thu nhập lên xuống thất thường, dễ cháy túi nếu không có quỹ dự phòng', 6: 'tiền đến từ phục vụ, dịch vụ; mặt trái: chi rất nhiều cho gia đình, khó giữ phần cho mình', 7: 'hợp đầu tư dài hạn có tìm hiểu kỹ; mặt trái: không đặt nặng tiền nên thu nhập dễ thấp hơn năng lực',
  8: 'có năng khiếu tài chính, dễ kiếm lớn; mặt trái: cũng dễ mất lớn khi liều, tiền bạc lên xuống mạnh', 9: 'rộng rãi, tiền đến khi làm việc có ý nghĩa; mặt trái: hay cho đi quá tay, dễ túng đúng lúc cần', 10: 'kiếm tiền nhanh nhờ nắm bắt cơ hội; mặt trái: dễ chủ quan, chi tiêu thiếu kỷ luật',
  11: 'tiền đến qua uy tín cá nhân; mặt trái: dễ xem nhẹ chuyện tiền, thu nhập bấp bênh', 22: 'có thể tạo tài sản lớn qua dự án dài hạn; mặt trái: áp lực vốn lớn, dễ kẹt tiền khi dự án kéo dài', 33: 'tiền đến qua việc chăm sóc, giúp người; mặt trái: chi nhiều cho người khác, dễ thiếu cho chính mình' };
var TS_CAN_TINH = { 1: 'cần người tôn trọng sự độc lập của bạn; mặt trái: bạn dễ áp đặt, khó nhường trong chuyện hai người', 2: 'cần sự dịu dàng, quan tâm, được lắng nghe; mặt trái: dễ tủi thân, phụ thuộc cảm xúc vào người kia', 3: 'cần niềm vui, trò chuyện, được khen ngợi; mặt trái: dễ chán khi tình cảm vào nếp, hay nói đùa làm người kia buồn mà không biết', 4: 'cần sự ổn định, chung thủy, cam kết rõ ràng; mặt trái: dễ khô khan, cứng nhắc, ít lãng mạn',
  5: 'cần không gian tự do và những trải nghiệm mới cùng nhau; mặt trái: khó cam kết lâu dài, dễ bị cám dỗ', 6: 'cần mái ấm, sự gắn bó gia đình; mặt trái: dễ kiểm soát, ghen và lo quá mức cho người mình yêu', 7: 'cần người hiểu chiều sâu và tôn trọng khoảng lặng của bạn; mặt trái: dễ khép kín, người kia thấy cô đơn ngay khi ở bên bạn', 8: 'cần người đồng hành cùng mục tiêu, tôn trọng thành tựu; mặt trái: dễ đặt công việc lên trên tình cảm, ít thời gian cho người thân',
  9: 'cần một tình yêu rộng lượng, cùng lý tưởng sống; mặt trái: dễ lý tưởng hóa người kia rồi thất vọng', 11: 'cần sự kết nối tâm hồn sâu sắc; mặt trái: kỳ vọng cao, dễ thất vọng và căng thẳng trong quan hệ', 22: 'cần người cùng xây dựng tương lai; mặt trái: dễ biến tình cảm thành một kế hoạch, thiếu sự mềm mại', 33: 'cần được yêu thương như cách bạn yêu thương người khác; mặt trái: hy sinh quá mức rồi thấy mình bị thiệt' };
var TS_SUC_KHOE = { 1: 'sức bật tốt, làm việc hăng; mặt trái: tự đặt áp lực cao, dễ căng thẳng, đau đầu và khó ngủ khi việc không như ý; theo các sách thần số, dễ mắc đau đầu, đau nửa đầu, huyết áp cao, mất ngủ; gợi ý: xen vài giờ nghỉ ngắn trong ngày', 2: 'cơ thể nhạy, sớm nhận ra khi mình mệt; mặt trái: khi lo nghĩ dễ ăn ngủ thất thường, dạ dày dễ phản ứng; theo các sách thần số, dễ mắc đau dạ dày, rối loạn tiêu hóa, rối loạn lo âu; gợi ý: giữ một khoảng lặng trước giờ ngủ', 3: 'năng lượng vui, hồi sức nhanh; mặt trái: nói nhiều, làm nhiều, dễ khản giọng, cạn sức và ngủ không đủ; theo các sách thần số, dễ mắc viêm họng, khản tiếng, bệnh ngoài da; gợi ý: chọn bớt việc',
  4: 'thể lực bền, chịu khó; mặt trái: ngồi lâu, làm miệt mài, dễ đau lưng, mỏi cổ vai và cứng khớp; theo các sách thần số, dễ mắc đau lưng, thoái hóa cột sống, viêm khớp; gợi ý: đặt giờ kết thúc công việc', 5: 'nhanh nhẹn, linh hoạt; mặt trái: sống theo hứng, dễ ăn uống thất thường, thức khuya và va quệt khi vội; theo các sách thần số, dễ mắc đau dạ dày, bệnh gan do rượu bia, suy nhược thần kinh; gợi ý: giữ giờ ăn ngủ đều', 6: 'biết chăm sóc, giữ nếp ăn uống cho cả nhà; mặt trái: lo cho người khác đến quên bữa, dễ mệt mỏi kéo dài vì căng thẳng gia đình; theo các sách thần số, dễ mắc tăng huyết áp, thừa cân, bệnh tim mạch; gợi ý: giữ bữa ăn và giờ nghỉ cho riêng mình',
  7: 'đầu óc sâu, ít bị cuốn theo ồn ào; mặt trái: khi sống khép kín dễ trầm buồn, mất ngủ vì suy nghĩ nhiều; theo các sách thần số, dễ mắc suy nhược thần kinh, trầm cảm, mất ngủ kéo dài; gợi ý: đi bộ ngoài trời và gặp người thân đều đặn', 8: 'sức chịu áp lực lớn; mặt trái: dốc sức vì mục tiêu, dễ kiệt sức, tim mạch và huyết áp chịu áp lực khi làm quá lâu; theo các sách thần số, dễ mắc tăng huyết áp, bệnh tim mạch, kiệt sức; gợi ý: có lịch nghỉ cố định', 9: 'giàu năng lượng cảm xúc; mặt trái: hay gánh chuyện của người khác, dễ suy sụp tinh thần, mệt mỏi không rõ lý do; theo các sách thần số, dễ mắc suy giảm miễn dịch, trầm cảm, rối loạn giấc ngủ; gợi ý: biết nói "không" đúng lúc',
  10: 'sức bật tốt, thích nghi nhanh; mặt trái: tự đặt áp lực, dễ căng thẳng và ngủ không sâu; theo các sách thần số, dễ mắc đau đầu, huyết áp cao, mất ngủ; gợi ý: nghỉ ngắn xen kẽ, vận động nhẹ', 11: 'cảm nhận rất nhạy; mặt trái: thần kinh dễ căng, hay lo âu, khó ngủ; theo các sách thần số, dễ mắc rối loạn lo âu, mất ngủ, hồi hộp tim đập nhanh; gợi ý: bớt màn hình buổi tối và tập thở chậm', 22: 'sức gánh vác lớn; mặt trái: ôm việc lớn, dễ quá tải kéo dài, căng cơ, mất ngủ; theo các sách thần số, dễ mắc đau lưng, cột sống, huyết áp cao, kiệt sức; gợi ý: giao bớt việc', 33: 'giỏi chăm sóc người khác; mặt trái: dồn sức lo cho người khác, dễ kiệt sức và bỏ bê sức khỏe bản thân; theo các sách thần số, dễ mắc bệnh tim mạch, suy nhược, kiệt sức; gợi ý: giữ một khoảng thời gian riêng mỗi tuần' };
var TS_THACH_SK = { 0: 'khó chọn hướng dễ sinh bồn chồn, ngủ không sâu – giữ nhịp sinh hoạt đều', 1: 'tự gồng gánh, dễ căng cơ và đau đầu – nghỉ đúng lúc', 2: 'nhạy cảm làm bạn ăn ngủ thất thường – cần một cách thư giãn riêng',
  3: 'dồn nén cảm xúc, dễ tức ngực, khó thở khi căng thẳng – viết ra, nói ra, vận động', 4: 'cứng nhắc, làm quá sức, dễ đau lưng, mỏi khớp – giãn cơ, đổi tư thế thường xuyên', 5: 'sa đà ăn uống, thức khuya, dạ dày và giấc ngủ dễ chịu thiệt – cần điều độ', 6: 'lo âu cho người thân kéo dài, dễ mệt mỏi, mất ngủ – dành thời gian thư giãn cho chính mình',
  7: 'suy nghĩ nhiều, khó ngủ, dễ trầm buồn – đi bộ, ra ngoài thiên nhiên', 8: 'làm việc quá sức vì tiền, dễ kiệt sức – đặt giờ nghỉ cố định' };
var TS_NO = {
  13: { ten: 'Món nợ công sức 13/4', y: 'dễ muốn đi đường tắt, ngại việc nặng nhọc; công việc hay phải làm lại nhiều lần, thành quả đến chậm hơn người khác. Bù lại, đã làm lại được thì tay nghề rất chắc', bh: 'chăm chỉ, kiên trì, làm đến nơi đến chốn', sk: 'cơ thể đòi hỏi kỷ luật – tập luyện đều, không bỏ bữa, không thức khuya kéo dài' },
  14: { ten: 'Món nợ công sức 14/5', y: 'dễ buông thả, sa đà hưởng thụ, thay đổi thất thường, có giai đoạn mất kiểm soát về tiền hoặc thói quen. Bù lại, bạn thích nghi nhanh, trải nghiệm rộng', bh: 'điều độ và biết cam kết', sk: 'dễ lạm dụng rượu bia, ăn uống, thiết bị điện tử – điều độ là thuốc' },
  16: { ten: 'Món nợ công sức 16/7', y: 'dễ có giai đoạn đổ vỡ, phải "làm lại từ đầu" trong tình cảm hay công việc, nhất là khi cái tôi quá lớn. Bù lại, sau mỗi lần như vậy bạn hiểu mình sâu hơn hẳn', bh: 'khiêm nhường, mở lòng và tin vào điều lớn hơn bản thân', sk: 'sức khỏe tinh thần dễ chịu thiệt khi ôm chuyện một mình – nên có người để tâm sự' },
  19: { ten: 'Món nợ công sức 19/1', y: 'hay tự làm tất cả, khó nhận giúp đỡ, dễ thành độc đoán và cô lập. Bù lại, bạn tự lập rất sớm', bh: 'tự lập nhưng biết nhờ và biết cho', sk: 'dễ quá tải vì gồng một mình – nghỉ ngơi và nhờ giúp khi quá sức' }
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

function tsChuCai_(tu, tuoi) {
  var ds = String(tu || '').split('').filter(function (c) { return TS_CHU[c]; }); if (!ds.length) return null;
  var L = ds.reduce(function (s, c) { return s + TS_CHU[c]; }, 0), p = tuoi % L, i = 0;
  while (p >= TS_CHU[ds[i]]) { p -= TS_CHU[ds[i]]; i = (i + 1) % ds.length; }
  return { chu: ds[i], so: TS_CHU[ds[i]], conLai: TS_CHU[ds[i]] - p };
}
function tsChuyenTiep_(T, viewYear, chuKy) {
  var tu = (T.tenTu || []).map(function (w) { return w.tu; }); if (!tu.length) return null;
  var ten = tu[tu.length - 1], dem = tu.length > 2 ? tu.slice(1, -1).join('') : '', ho = tu.length > 1 ? tu[0] : '';
  var ds = [];
  for (var y = viewYear; y < viewYear + 10; y++) {
    var a = y - T.y; if (a < 0) continue;
    var th = tsChuCai_(ten, a), tr = dem ? tsChuCai_(dem, a) : null, li = ho ? tsChuCai_(ho, a) : null;
    var tong = [th, tr, li].reduce(function (s, x) { return s + (x ? x.so : 0); }, 0), e = tsRutGon_(tong, true);
    var pn = (chuKy || []).filter(function (c) { return c.nam === y; })[0];
    ds.push({ nam: y, tuoi: a, the: th, tri: tr, linh: li, tinhChat: e, trung: !!pn && tsGoc_(e) === pn.so });
  }
  var N = ds[0], S = TS_SO, g = tsGoc_;
  var chu = function (x, vai) { return x ? 'chữ ' + x.chu + ' (' + vai + ', còn ' + x.conLai + ' năm)' : ''; };
  return { ds: ds, ten: ten, dem: dem, ho: ho,
    ket: 'Năm ' + N.nam + ' (tròn ' + N.tuoi + ' tuổi): ' + [chu(N.the, 'thể chất – tên ' + ten), chu(N.tri, 'trí tuệ – đệm'), chu(N.linh, 'tâm linh – họ')].filter(Boolean).join(', ') +
      ' → số tinh chất ' + N.tinhChat + ': ' + S[g(N.tinhChat)].tk + '.' + (N.trung ? ' Trùng số năm cá nhân – chủ đề năm được nhân đôi, rất rõ nét.' : ''),
    tron: 'Năm nay bạn có xu hướng tập trung vào ' + S[g(N.tinhChat)].tk + '.' + (N.trung ? ' Chủ đề này trùng với nhịp năm cá nhân nên thể hiện rất rõ, cả mặt thuận lẫn mặt khó của nó.' : '') };
}
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
    bs.push({ ten: 'Tiềm Thức', so: 9 - ts.baiHoc.length, y: (9 - ts.baiHoc.length >= 7 ? 'tự tin, xử lý tình huống bất ngờ tốt; mặt trái: dễ chủ quan' : 9 - ts.baiHoc.length >= 5 ? 'phản ứng khá, nhưng cần thời gian mới bình tĩnh lại' : 'dễ lúng túng, rối khi gặp chuyện bất ngờ; bù lại bạn cẩn thận khi có thời gian chuẩn bị'), cach: '9 − số con số vắng trong tên (' + ts.baiHoc.length + ')' });
    bs.push({ ten: 'Bài Học Mang Theo', so: ts.baiHoc.length ? ts.baiHoc.join(', ') : '—', y: ts.baiHoc.length ? 'dễ thiếu: ' + ts.baiHoc.map(function (x) { return tsNgan_(S[x].tk, 1); }).join('; ') : 'tên có đủ 1–9, không có bài học nổi bật', cach: 'Các số 1–9 không xuất hiện trong tên' });
    bs.push({ ten: 'Đam Mê Ẩn', so: ts.damMe.join(', '), y: ts.damMe.map(function (x) { return tsNgan_(S[x].tk, 1); }).join('; '), cach: 'Số xuất hiện nhiều nhất trong tên' });
  }
  bs.push({ ten: 'Món Nợ Công Sức', so: no.length ? no.map(function (x) { return x.so; }).filter(function (x, i, a) { return a.indexOf(x) === i; }).join(', ') : '—', y: no.length ? no.map(function (x) { return x.ten + ' (' + x.o + '): ' + x.y; }).join('; ') : 'không mang số món nợ công sức', cach: 'Tổng trung gian 13, 14, 16, 19 ở ngày sinh, Đường Đời, các số tên' });
  out.boSung = bs; out.noNghiep = no;
  // ---- B4: chu kỳ
  var tuoi = viewYear - T.y, dcNay = 0;
  ts.dinhCao.forEach(function (p, i) { if (tuoi >= p.tu) dcNay = i; });
  out.dinhCao = ts.dinhCao.map(function (p, i) { return { so: p.so, tu: p.tu, den: p.den, namTu: T.y + p.tu, namDen: p.den >= 99 ? null : T.y + p.den, thuThach: p.thuThach, nay: i === dcNay, y: S[p.so].tk, tt: TS_THU_THACH[p.thuThach] }; });
  out.chuKy = [];
  for (var yy = viewYear - 4; yy <= viewYear + 13; yy++) { var pn = tsRutGon_(T.rd + T.rm + tsRutGon_(tsTongChuSo_(yy), false), false); out.chuKy.push({ nam: yy, so: pn, diem: TS_NANG_LUONG[pn], nay: yy === viewYear, y: TS_NAM[pn] }); }
  // Chữ cái chuyển tiếp & số tinh chất (Transit letters / Essence – trường phái Pythagoras, Decoz): mỗi phần tên chạy
  // lần lượt từng chữ, chữ kéo dài số năm bằng giá trị của nó (A = 1 năm … I, R = 9 năm), hết tên thì lặp lại.
  // Tên Việt "Họ – Đệm – Tên": Tên (gọi hằng ngày) = thể chất, Đệm = trí tuệ, Họ = tâm linh. Tinh chất = tổng ba chữ (giữ 11, 22).
  out.chuyenTiep = tsChuyenTiep_(T, viewYear, out.chuKy);
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
  if (LH && NC && tsNhom_(LH) !== tsNhom_(NC)) tc.push('◇ Bên trong và bên ngoài thuộc hai nhóm năng lượng khác nhau: bạn có nhiều mặt, ứng biến linh hoạt; mặt trái: người mới quen dễ hiểu sai về bạn, bạn dễ thấy cô đơn ngay giữa nhiều người. Gợi ý: nói rõ điều mình thật sự muốn.');
  else if (LH) tc.push('✓ Bên trong và bên ngoài cùng nhóm năng lượng: bạn sống khá "thật", người khác dễ hiểu bạn; mặt trái: khó che cảm xúc, dễ bị người khác đoán ý.');
  luan.push({ k: 'tinhCach', ten: 'Tính cách', icon: '🧭', dua: 'Đường Đời · Nhân Cách · Linh Hồn · Ngày Sinh', items: tc });
  luan.push({ k: 'suNghiep', ten: 'Sự nghiệp – tài chính', icon: '💼', dua: 'Định Mệnh · Đường Đời · Ngày Sinh', items: [
    'Nghề phù hợp (' + (ts.coTen ? 'Định Mệnh ' : 'Đường Đời ') + DM + '): ' + S[DM].nghe + '.',
    'Môi trường làm việc hợp (Đường Đời ' + ld + '): ' + TS_MOI_TRUONG[ld] + '.',
    'Kỹ năng nổi bật (Ngày Sinh ' + NS + '): ' + tsNgan_((S[NS] || S[g(NS)]).manh, 3) + '.',
    'Tài chính: ' + TS_TAI_CHINH[DM] + '.'].concat(ts.bieuDo[8] === 0 ? ['◇ Biểu đồ thiếu số 8: dễ bừa bộn chuyện tiền, chi mà không biết tiền đi đâu, hay hụt cuối tháng. Gợi ý: ghi chép thu chi, tách quỹ.'] : []) });
  var hop = TS_NHOM[tsNhom_(ld)] || [];
  luan.push({ k: 'tinhDuyen', ten: 'Tình duyên – gia đình', icon: '💞', dua: 'Linh Hồn · Nhân Cách · Đường Đời', items: [
    LH ? 'Nhu cầu tình cảm (Linh Hồn ' + LH + '): bạn ' + TS_CAN_TINH[LH] + '.' : 'Nhu cầu tình cảm: ' + TS_CAN_TINH[g(ld)] + ' (theo Đường Đời, vì chưa có họ tên).',
    'Cách bạn thu hút (' + (ts.coTen ? 'Nhân Cách ' : 'Thái Độ ') + NC + '): người khác bị cuốn hút bởi vẻ ' + TS_NGOAI[NC] + '.',
    'Đối tượng hợp (Đường Đời ' + ld + ', ' + TS_NHOM_TEN[tsNhom_(ld)].replace(' (', ': các số ').replace(/\)$/, '') + '): người có Đường Đời ' + hop.join(', ') + ' dễ đồng điệu; khác nhóm thì bổ sung cho nhau nhưng dễ va chạm về cách sống, hay hiểu lầm nhau.',
    ts.bieuDo[5] === 0 ? '◇ Biểu đồ thiếu số 5 (trung tâm cảm xúc): hay ngại bày tỏ tình cảm, người kia dễ thấy bạn lạnh nhạt dù bạn thương thật. Gợi ý: nói lời yêu thương thành tiếng.' : ts.bieuDo[5] >= 3 ? '◇ Nhiều số 5: yêu nồng nhiệt, nhưng cảm xúc mãnh liệt, dễ nói lời làm tổn thương khi nóng giận.' : '✓ Có số 5 ở trung tâm: cảm xúc tương đối cân bằng; mặt trái: bị dồn ép lâu vẫn có lúc bùng nổ.',
    ts.bieuDo[6] ? 'Gia đình: có số 6 trong ngày sinh – yêu gia đình, có trách nhiệm' + (ts.bieuDo[6] >= 2 ? ', nhưng dễ lo lắng quá mức và can thiệp vào việc của người thân.' : '; mặt trái: dễ ôm việc nhà một mình.') : 'Gia đình: thiếu số 6 – bạn tự do, ít bị việc nhà ràng buộc, nhưng dễ bị người thân cho là vô tâm, ít đỡ đần.'] });
  var sk = ['Nhịp sống nên giữ (Đường Đời ' + ld + '): ' + TS_SUC_KHOE[ld] + '.', 'Theo Thách Thức chính ' + ts.thachThucChinh + ': ' + TS_THACH_SK[ts.thachThucChinh] + '.'];
  no.forEach(function (x, i) { if (no.map(function (y) { return y.so; }).indexOf(x.so) === i) sk.push('Món nợ công sức ' + x.so + ': ' + x.sk + '.'); });
  if (ts.bieuDo[2] >= 3) sk.push('Nhiều số 2: bạn cảm nhận cơ thể rất nhạy, nhưng khi căng thẳng dễ mất ngủ, hồi hộp. Gợi ý: có một thói quen thư giãn trước giờ ngủ.');
  sk.push('Đây là xu hướng theo con số, không phải chẩn đoán; khi có dấu hiệu bất thường, hãy hỏi bác sĩ.');
  luan.push({ k: 'sucKhoe', ten: 'Sức khỏe', icon: '🌿', dua: 'Đường Đời · Thách Thức · Món Nợ Công Sức', items: sk });
  var hon = ['Bài học đường đời (Đường Đời ' + ld + '): ' + S[ld].bh + '.', 'Bài học từ thách thức chính (' + ts.thachThucChinh + '): ' + TS_THU_THACH[ts.thachThucChinh] + '.'];
  if (ts.coTen && ts.baiHoc.length) hon.push('Bài học mang theo (số vắng trong tên ' + ts.baiHoc.join(', ') + '): ' + ts.baiHoc.map(function (x) { return 'rèn ' + tsNgan_(S[x].tk, 1); }).join('; ') + '.');
  no.forEach(function (x, i) { if (no.map(function (y) { return y.so; }).indexOf(x.so) === i) hon.push(x.ten + ': ' + x.y + ' → bài học ' + x.bh + '.'); });
  ts.muiTen.filter(function (a) { return !a.tot; }).forEach(function (a) { hon.push(a.ten + ': ' + a.y + '.'); });
  luan.push({ k: 'linhHon', ten: 'Bài học linh hồn', icon: '🕯', dua: 'Đường Đời · Bài học mang theo · Món nợ công sức · mũi tên trống', items: hon });
  var dc = out.dinhCao[dcNay], dcSau = out.dinhCao[dcNay + 1], cn = out.chuKy.filter(function (c) { return c.nay; })[0];
  var vt = ['Năm ' + viewYear + ' là Năm Cá Nhân ' + cn.so + ': ' + cn.y,
    'Giai đoạn đời hiện tại – Đỉnh Cao ' + (dcNay + 1) + ' (số ' + dc.so + ', ' + dc.tu + '–' + (dc.den >= 99 ? 'cuối đời' : dc.den) + ' tuổi): ' + dc.y + '. Thử thách kèm theo (' + dc.thuThach + '): ' + dc.tt + '.'];
  if (dcSau) vt.push('Từ năm ' + dcSau.namTu + ' (' + dcSau.tu + ' tuổi) chuyển sang Đỉnh Cao ' + (dcNay + 2) + ' – số ' + dcSau.so + ': ' + dcSau.y + '.');
  var n1 = out.chuKy.filter(function (c) { return c.nam > viewYear && c.so === 1; })[0], n8 = out.chuKy.filter(function (c) { return c.nam >= viewYear && c.so === 8; })[0];
  if (n1) vt.push('Chu kỳ 9 năm mới bắt đầu năm ' + n1.nam + ' – hợp khởi sự việc lớn, đổi lại năm đầu chu kỳ thường vất vả, phải tự lực nhiều.');
  if (n8) vt.push('Năm thu hoạch gần nhất: ' + n8.nam + ' (Năm Cá Nhân 8) – hợp thăng tiến, tài chính, đi kèm áp lực trách nhiệm và tiền bạc lớn.');
  luan.push({ k: 'vanTrinh', ten: 'Vận trình theo năm', icon: '📅', dua: 'Năm Cá Nhân · Đỉnh Cao · Thử Thách', items: vt });
  out.luan = luan;
  // ---- B6: lời khuyên
  var thangTot = out.thang.filter(function (m) { return [1, 3, 8].indexOf(m.so) >= 0; }).map(function (m) { return m.thang; });
  out.loiKhuyen = [
    { ten: 'Điểm mạnh cần phát huy', t: 'Hãy phát huy sự ' + tsNgan_(S[ld].manh, 3) + (NS !== ld ? ', cùng năng khiếu ' + tsNgan_((S[NS] || S[g(NS)]).manh, 2) : '') + '.' + ts.muiTen.filter(function (a) { return a.tot; }).slice(0, 2).map(function (a) { return ' ' + a.ten + ': ' + a.y + '.'; }).join('') },
    { ten: 'Điểm yếu cần khắc phục', t: 'Mặt trái của bạn: ' + S[ld].yeu + ' – dễ làm hỏng việc và quan hệ nếu để mặc. Gợi ý: ' + S[ld].bh + '.' },
    { ten: 'Thời điểm hành động', t: 'Năm ' + viewYear + ' (năm cá nhân ' + cn.so + ') nên tập trung ' + TS_THANG[cn.so] + '. Tháng thuận để khởi sự, giao tiếp hoặc ký kết: ' + (thangTot.length ? thangTot.join(', ') : '—') + ' (dương lịch).' + (n1 ? ' Việc lớn nên khởi động vào năm ' + n1.nam + '.' : '') },
    { ten: 'Hướng phát triển', t: 'Giai đoạn này (đỉnh cao số ' + dc.so + ') hãy phát triển ' + dc.y + '.' + (dcSau ? ' Chuẩn bị cho giai đoạn từ ' + dcSau.namTu + ': ' + dcSau.y + '.' : '') },
    { ten: 'Bài học cần học', t: 'Thách thức chính: ' + TS_THU_THACH[ts.thachThucChinh] + '.' + (no.length ? ' Món nợ công sức: ' + no.map(function (x) { return x.bh; }).filter(function (x, i, a) { return a.indexOf(x) === i; }).join('; ') + '.' : '') }
  ];
  // ---- Trường hợp đặc biệt
  var db = [], ms = [];
  [['Đường Đời', ld], ['Ngày Sinh', ts.ngaySinh]].concat(ts.coTen ? [['Định Mệnh', ts.suMenh], ['Linh Hồn', ts.linhHon], ['Nhân Cách', ts.nhanCach], ['Trưởng Thành', ts.truongThanh]] : [])
    .concat(ts.dinhCao.map(function (p, i) { return ['Đỉnh Cao ' + (i + 1), p.so]; })).forEach(function (x) { if (TS_MASTER[x[1]]) ms.push(x); });
  if (ms.length) db.push({ ten: 'Số bậc thầy (11, 22, 33)', co: true, t: ms.map(function (x) { return x[0] + ' ' + x[1]; }).join(', ') + ': không rút gọn tiếp – tiềm năng cao nhưng áp lực cũng lớn: dễ căng thẳng thần kinh, đặt kỳ vọng quá sức rồi thất vọng về bản thân. ' + ms.map(function (x) { return x[1]; }).filter(function (x, i, a) { return a.indexOf(x) === i; }).map(function (x) { return 'Số ' + x + ': ' + TS_MASTER[x].toLowerCase(); }).join('; ') + '.' });
  else db.push({ ten: 'Số bậc thầy (11, 22, 33)', co: false, t: 'Không có trong các chỉ số chính.' });
  db.push({ ten: 'Số món nợ công sức (13, 14, 16, 19)', co: no.length > 0, t: no.length ? no.map(function (x) { return x.so + ' ở ' + x.o; }).join(', ') + '. Đây là những chỗ đời bạn dễ vấp lặp lại nếu không nhận ra. Gợi ý: gọi đúng tên thói quen gây vấp và sửa từ việc nhỏ.' : 'Không có.' });
  var co0 = [['Đường Đời', tsChuoi_(T.tongNgaySinh)]].concat(ts.coTen ? [['Định Mệnh', tsChuoi_(T.suMenh)]] : []).filter(function (x) { return x[1].some(function (n) { return n === 10 || n === 20 || n === 30; }); });
  db.push({ ten: 'Số 0 (10, 20, 30)', co: co0.length > 0, t: co0.length ? co0.map(function (x) { return x[0] + ' đi qua ' + x[1].filter(function (n) { return n % 10 === 0 && n; })[0]; }).join(', ') + ': số 0 khuếch đại con số đi kèm – cả mặt mạnh lẫn mặt yếu đều rõ hơn người khác; thiếu định hướng thì dễ chệch hướng mạnh.' : 'Không có.' });
  var lap = []; for (var k = 1; k <= 9; k++) if (ts.bieuDo[k] >= 3) lap.push(k + ' (×' + ts.bieuDo[k] + ')');
  db.push({ ten: 'Số lặp trong ngày sinh', co: lap.length > 0, t: lap.length ? 'Số ' + lap.join(', ') + ': năng lượng của con số này được tăng cường – mặt mạnh nổi bật, nhưng mặt yếu của nó cũng dễ thành tật.' : 'Không có con số nào lặp từ 3 lần trở lên.' });
  if (ts.coTen) db.push({ ten: 'Tên có dấu tiếng Việt', co: true, t: '"' + out.duLieu.ten + '" → "' + ts.tenChuan + '" (bỏ dấu, Đ → D, giữ nguyên thứ tự họ – đệm – tên).' });
  out.dacBiet = db;
  // ---- Ứng dụng: tự khám phá
  var hh = [];
  if (ts.coTen) {
    var nh = [tsNhom_(ld), tsNhom_(LH), tsNhom_(NC)], giong = nh.filter(function (x) { return x === nh[0]; }).length;
    hh.push('Đường Đời ' + ld + ' (mục đích) · Linh Hồn ' + LH + ' (khát khao) · Nhân Cách ' + NC + ' (bề ngoài).');
    hh.push(giong === 3 ? '✓ Ba con số cùng nhóm năng lượng: điều bạn muốn, điều bạn thể hiện và con đường của bạn thống nhất – sống thuận tự nhiên; mặt trái: dễ thiếu góc nhìn khác, ít chịu thay đổi khi cần.' :
      nh[0] === nh[1] ? '◇ Khát khao khớp con đường sống, nhưng vẻ ngoài khác nhóm – người khác dễ đánh giá sai bạn lúc đầu, có khi bạn mất cơ hội vì ấn tượng ban đầu.' :
      '◇ Khát khao bên trong khác nhóm với con đường sống – dễ giằng co "muốn một đằng, phải làm một nẻo", có giai đoạn chán việc, mất phương hướng; bù lại bạn có nhiều mặt năng lực. Gợi ý: tìm công việc dung hòa cả hai.');
  } else hh.push('Nhập họ tên khai sinh để so sánh Đường Đời – Linh Hồn – Nhân Cách.');
  out.hoaHop = hh;
  return out;
}
