/**
 * ============================================================
 *  TuViChuyenSau.gs — LUẬN TỬ VI CHUYÊN SÂU (CHỈ CHỦ SỞ HỮU)
 *  Tab "👑 Lá số chủ sở hữu" (yêu cầu của chủ dự án 25/10/2026):
 *   1. Bộ sao (tổ hợp chính tinh – phụ tinh) ở từng cung: đồng cung, tam phương tứ chính, giáp cung.
 *   2. Mười hai đại vận soi sao hạn: Thiên Không, Thiên Thương – Thiên Sứ (giáp Thiên Di), Không Kiếp,
 *      tứ sát, Hóa Kỵ gốc và Hóa Kỵ của can đại vận, Tang Hổ…; sao giải; các năm hệ trọng trong vận.
 *   3. Thọ khí (cách cổ thư xem dương thọ): Mệnh – Phúc Đức – Tật Ách, sao thọ, sát tinh, Cục – Mệnh,
 *      vòng Tràng Sinh; chỉ nêu mức và các giai đoạn cần giữ gìn, KHÔNG đoán tuổi mất.
 *  Chỉ đọc sao đã an trong tuviLapLaSo_ (TuVi.gs), không an lại. Máy chủ chặn người không phải chủ sở hữu.
 *  Nguồn: Tử Vi Đẩu Số Toàn Thư (phú Thái Vi, Cốt Tủy, quyết an Thiên Thương – Thiên Sứ), các bộ cách cục
 *  phổ biến (Trung Châu phái, Tam hợp phái), bài của Lưu Uẩn Linh về Thương – Sứ – xem TVCS_NGUON.
 * ============================================================
 */

var TVCS_NGUON = [
  { ten: 'Tử Vi Đẩu Số Toàn Thư – quyển 2, "An Thiên Thương Thiên Sứ quyết"', y: 'Thương ở Nô Bộc, Sứ ở Tật Ách; hạn vào cung bị hai sao kẹp thì hung tinh thêm nặng.', url: 'https://m.gushiwen.cn/guwen/bookv_89136ccdfc9d.aspx' },
  { ten: 'Lưu Uẩn Linh – ý nghĩa cơ bản của Thiên Thương, Thiên Sứ', y: 'Thương là lúc việc hình thành (có thể vượt qua), Sứ là lúc việc phải có kết quả; hai cung cách nhau ba ô (thường ứng ba năm); đại vận thứ sáu chắc chắn đi qua một trong hai cung.', url: 'https://www.ziweishuyuan.com/express-method/505.html' },
  { ten: 'Thiên Thương, Thiên Sứ – sao tang vong (tổng hợp các phái)', y: 'Hai sao luôn kẹp Thiên Di; ngày thường ít tác dụng, vào hạn mà chính tinh hãm, gặp sát hoặc Hóa Kỵ thì thành dấu cảnh báo. Chính tinh Cự, Cơ, Tham, Liêm, Phá hãm địa là nặng nhất.', url: 'https://www.shenjige.cn/details/3syCnLL5W.html' },
  { ten: 'Sao giải Thương – Sứ (sách Việt)', y: 'Tử Vi, Thiên Phủ, Thiên Lương, Thiên Đồng cùng Hóa Khoa, Hóa Lộc, Tả Phù, Hữu Bật làm nhẹ hạn.', url: 'https://hoc.kabala.vn/sao-thien-su-thien-thuong/' },
  { ten: 'Trung Châu phái – Đẩu Số thâm tạo giảng nghĩa, cung Tật Ách', y: 'Xem sức khỏe – thọ phải xem cùng lúc Tật Ách, Mệnh và Phúc Đức (Phúc Đức còn gọi là cung "thọ nguyên").', url: 'https://www.dushu.com/guoxue/105513/1146509.html' },
  { ten: 'Các cách cục thường gặp (tư liệu Tử Vi Đẩu Số)', y: 'Điều kiện thành cách của khoảng 60 cách: Tử Phủ đồng cung, Thất Sát triều Đẩu, Dương Lương Xương Lộc, Minh Châu xuất hải, Dương Đà giáp Kỵ, Lộc phùng lưỡng sát…', url: 'https://www.dushu.com/guoxue/105528/1146809.html' },
  { ten: 'Tổ hợp sao và tầng bậc cách cục', y: 'Cách tốt bị sát tinh phá thì mất tác dụng; cách xấu gặp cát tinh thì nhẹ đi (Hỏa Linh giáp gặp Lộc Tồn giải, Dương Đà giáp Kỵ gặp Thiên Phủ chế).', url: 'https://wiki.tianjiyao.com/ziwei/pattern-combinations.html' }
];

var TVCS_SAT = ['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh', 'Địa Không', 'Địa Kiếp'];
var TVCS_CAT6 = ['Tả Phù', 'Hữu Bật', 'Văn Xương', 'Văn Khúc', 'Thiên Khôi', 'Thiên Việt'];
var TVCS_GIAI = ['Hóa Khoa', 'Hóa Lộc', 'Lộc Tồn', 'Tả Phù', 'Hữu Bật', 'Thiên Giải', 'Địa Giải', 'Giải Thần', 'Thiên Đức', 'Nguyệt Đức', 'Long Đức', 'Phúc Đức', 'Thiên Quan', 'Thiên Phúc', 'Ân Quang', 'Thiên Quý'];
var TVCS_GIAI_CHINH = ['Tử Vi', 'Thiên Phủ', 'Thiên Lương', 'Thiên Đồng'];
var TVCS_KY_HAM = ['Cự Môn', 'Thiên Cơ', 'Tham Lang', 'Liêm Trinh', 'Phá Quân'];

/**
 * Bảng bộ sao. Mỗi luật:
 *  d: sao phải có trong chính cung (chính tinh xét cả khi mượn của cung xung chiếu nếu cung vô chính diệu)
 *  h: sao phải có trong tam phương tứ chính (gồm cả chính cung)
 *  g: cặp sao giáp cung (hai cung kề hai bên)
 *  mot: ít nhất một sao trong danh sách nằm ở chính cung; motH: … nằm trong tam phương
 *  chi: cung phải an ở các địa chi này (0 = Tý … 11 = Hợi)
 *  o: chỉ xét ở các cung này ('Thân' = cung an Thân) – dùng cho bộ phụ tinh vốn luôn đứng tam hợp với nhau
 *  kc(c): điều kiện thêm, c = ngữ cảnh cung
 *  loai: 'cat' | 'hung' | 'trung'; cau: câu phú/thuật ngữ cổ (nếu có); y: ý nghĩa; huong: cách ứng xử
 */
var TVCS_BO_SAO = [
  // ---- Tử Vi hệ ----
  { ten: 'Tử Phủ đồng cung', d: ['Tử Vi', 'Thiên Phủ'], loai: 'cat', cau: 'Tử Phủ đồng cung, chung thân phúc hậu',
    y: 'Đế tinh và kho trời cùng ngồi: nền tảng vững, vừa có chí làm chủ vừa biết giữ của. Mặt trái: dễ tự mãn, ôm việc một mình, thiếu phụ tá thì chỉ dừng ở mức an toàn.', huong: 'Cần Tả Hữu, Xương Khúc hoặc Lộc mới thật quý; tránh tự mãn, ôm việc một mình.' },
  { ten: 'Tử Tướng ở Thìn Tuất', d: ['Tử Vi', 'Thiên Tướng'], loai: 'trung', cau: 'Tử Tướng Thìn Tuất – Thiên La Địa Võng',
    y: 'Có tư cách lãnh đạo nhưng hay bị khuôn khổ, người trên kìm giữ; dễ "giỏi mà chưa gặp thời". Mặt tốt: có nề nếp, được nể trọng trong tổ chức.', huong: 'Gặp Tả Hữu, Xương Khúc thì thoát lưới; nên bền bỉ trong tổ chức lớn trước khi tự đứng.' },
  { ten: 'Tử Sát ở Tỵ Hợi', d: ['Tử Vi', 'Thất Sát'], loai: 'cat', cau: 'Tử Vi Thất Sát, hóa sát vi quyền',
    y: 'Sát khí được đế tinh chế thành quyền: quyết đoán, dám nhận trách nhiệm lớn. Mặt trái: quyền dễ thành độc đoán, sai thì sai lớn vì ít người dám cản.', huong: 'Gặp Kình Đà Không Kiếp thì quyền dễ thành độc đoán; nên lắng nghe người dưới.' },
  { ten: 'Tử Phá ở Sửu Mùi', d: ['Tử Vi', 'Phá Quân'], loai: 'trung', cau: 'Tử Phá Sửu Mùi',
    y: 'Tham vọng lớn, thích phá cách, đổi mới; đời nhiều lần làm lại từ đầu. Mặt tốt: hợp vai mở đường; mặt xấu: hao tiền, hao sức theo mỗi lần đổi hướng.', huong: 'Hợp vai mở đường, cải tổ; cần người giữ nhịp bên cạnh để không bỏ dở.' },
  { ten: 'Tử Tham ở Mão Dậu', d: ['Tử Vi', 'Tham Lang'], loai: 'trung', cau: 'Đào hoa phạm chủ',
    y: 'Đế tinh vướng đào hoa: duyên dáng, giỏi giao tế nhưng dễ sa vào hưởng thụ, tình cảm phức tạp. Mặt tốt: sức hút mở được nhiều cửa.', huong: 'Gặp Địa Không, Địa Kiếp hoặc Tuần Triệt lại thanh cao (hợp tu học, nghệ thuật); nên giữ chừng mực.' },
  { ten: 'Quân thần khánh hội', d: ['Tử Vi'], h: ['Tả Phù', 'Hữu Bật'], loai: 'cat', cau: 'Quân thần khánh hội',
    y: 'Tử Vi có Tả Hữu chầu: được người tài theo giúp, làm việc lớn có bộ sậu. Mặt trái: quen dựa vào bộ sậu, người giúp rời đi thì việc chững lại.', huong: 'Biết dùng người, chia quyền thì càng lên.' },
  { ten: 'Tử Vi cô quân', d: ['Tử Vi'], loai: 'hung', cau: 'Tử Vi vô Tả Hữu, vi cô quân',
    kc: function (c) { return !c.coH('Tả Phù') && !c.coH('Hữu Bật') && c.demH(TVCS_SAT) >= 2; },
    y: 'Đế tinh không có người phò, lại gặp sát: có chí lớn mà lẻ loi, dễ đơn độc khi quyết. Mặt tốt: tự quyết được, không phụ thuộc ai.', huong: 'Chủ động kết đồng minh, tìm cố vấn; tránh quyết lớn khi đang bị cô lập.' },
  // ---- Thiên Phủ ----
  { ten: 'Phủ gặp Lộc – kho đầy', d: ['Thiên Phủ'], motH: ['Lộc Tồn', 'Hóa Lộc'], loai: 'cat', cau: 'Thiên Phủ phùng Lộc',
    y: 'Kho có lộc vào: giỏi tích lũy, giữ tài sản bền. Mặt trái: dè dặt quá mức, giữ của mà lỡ dịp tốt.', huong: 'Hợp tài chính, quản trị, bất động sản.' },
  { ten: 'Không khố – lộ khố', d: ['Thiên Phủ'], loai: 'hung', cau: 'Thiên Phủ ngộ Không – không khố',
    kc: function (c) { return c.co('Địa Không') || c.co('Địa Kiếp') || c.tuan || c.triet; },
    y: 'Kho trời gặp Không Kiếp hoặc Tuần Triệt: kho rỗng, tiền vào rồi ra, phải tự gây dựng. Mặt tốt: không bám của, mất rồi vẫn gây dựng lại được.', huong: 'Lập quỹ dự phòng, tách tiền giữ và tiền tiêu; tránh bảo lãnh, đầu cơ.' },
  { ten: 'Phủ Tướng triều viên', o: ['Mệnh', 'Thân'], h: ['Thiên Phủ', 'Thiên Tướng'], loai: 'cat', cau: 'Phủ Tướng triều viên, thiên chung chi lộc',
    kc: function (c) { return !c.co('Thiên Phủ') && !c.co('Thiên Tướng'); }, y: 'Kho và ấn cùng chầu: cơm áo đủ đầy, được tin cậy giao việc. Mặt trái: được giao nhiều nên dễ gánh trách nhiệm của người khác.', huong: 'Giữ chữ tín là vốn lớn nhất.' },
  // ---- Vũ Khúc ----
  { ten: 'Vũ Phủ ở Tý Ngọ', d: ['Vũ Khúc', 'Thiên Phủ'], loai: 'cat', cau: 'Vũ Phủ đồng cung',
    y: 'Tài tinh gặp kho: kiếm và giữ tiền đều giỏi, tính thực tế. Mặt trái: thực dụng, người thân dễ thấy lạnh nhạt.', huong: 'Đừng để thực dụng quá làm mất tình người.' },
  { ten: 'Vũ Tướng ở Dần Thân', d: ['Vũ Khúc', 'Thiên Tướng'], loai: 'cat', cau: 'Vũ Tướng đồng cung',
    y: 'Tiền đi với uy tín: làm ăn đứng đắn, được giao quản lý tài chính. Mặt trái: hay vất vả, chịu thiệt vì việc của người khác.', huong: 'Gặp Kình Đà thì hay vất vả vì việc người khác.' },
  { ten: 'Vũ Tham ở Sửu Mùi', d: ['Vũ Khúc', 'Tham Lang'], loai: 'cat', cau: 'Tham Vũ đồng hành, tiên bần hậu phú',
    y: 'Tuổi trẻ vất vả, khoảng ba mươi tuổi trở đi mới phát; giỏi kinh doanh. Mặt trái: giai đoạn đầu thiếu thốn thật sự, dễ làm liều để giàu nhanh.', huong: 'Kiên nhẫn tích lũy giai đoạn đầu, không vội làm giàu.' },
  { ten: 'Vũ Sát ở Mão Dậu', d: ['Vũ Khúc', 'Thất Sát'], loai: 'hung', cau: 'Vũ Khúc Thất Sát – nhân tài trì đao',
    y: 'Tài tinh gặp tướng tinh ở thế yếu: kiếm tiền quyết liệt nhưng dễ va chạm, mất mát vì tiền. Mặt tốt: dám làm, làm được việc khó.', huong: 'Cẩn trọng dao kéo, máy móc, hợp đồng; không vay mượn nóng.' },
  { ten: 'Vũ Phá ở Tỵ Hợi', d: ['Vũ Khúc', 'Phá Quân'], loai: 'hung', cau: 'Vũ Phá – phá tổ ly tông',
    y: 'Tiền vào nhiều nhưng hao cũng nhiều; hay rời gốc gác để tự lập. Mặt tốt: tinh thần tự lập cao.', huong: 'Lập kỷ luật chi tiêu; hợp nghề kỹ thuật, cơ khí, khai phá.' },
  // ---- Liêm Trinh ----
  { ten: 'Liêm Phủ ở Thìn Tuất', d: ['Liêm Trinh', 'Thiên Phủ'], loai: 'cat', cau: 'Liêm Phủ đồng cung',
    y: 'Nguyên tắc đi cùng biết giữ: làm ăn ổn, có quy củ. Mặt trái: cứng nhắc, chậm thích nghi khi hoàn cảnh đổi.', huong: 'Hợp quản lý, hành chính.' },
  { ten: 'Liêm Sát ở Sửu Mùi', d: ['Liêm Trinh', 'Thất Sát'], chi: [1, 7], loai: 'cat', cau: 'Liêm Trinh Thất Sát, phản vi tích phú chi nhân',
    y: 'Hai sao cứng gặp nhau ở đất tốt: chịu khó, gom góp mà thành giàu. Mặt trái: làm quá sức, sức khỏe hao mòn dần.', huong: 'Giữ sức, tránh làm quá sức.' },
  { ten: 'Liêm Tham ở Tỵ Hợi', d: ['Liêm Trinh', 'Tham Lang'], loai: 'hung', cau: 'Liêm Tham Tỵ Hợi',
    y: 'Hai sao đào hoa ở đất hãm: ham vui, dễ sa đà, vướng thị phi hoặc giấy tờ pháp lý. Mặt tốt: cởi mở, giao tiếp rộng.', huong: 'Giữ ranh giới trong quan hệ và tiền bạc; gặp Hóa Kỵ càng phải thận trọng.' },
  { ten: 'Liêm Phá ở Mão Dậu', d: ['Liêm Trinh', 'Phá Quân'], loai: 'hung', cau: 'Liêm Phá đồng cung',
    y: 'Liều lĩnh, thích mạo hiểm; dễ thăng trầm, va chạm. Mặt tốt: gan dạ, hợp việc cần dũng khí.', huong: 'Hợp việc cần dũng khí (kỹ thuật, quân sự, cứu hộ); luôn giữ an toàn.' },
  { ten: 'Hình tù giáp ấn', d: ['Liêm Trinh', 'Thiên Tướng'], loai: 'hung', cau: 'Hình tù giáp ấn',
    kc: function (c) { return c.co('Kình Dương'); }, y: 'Liêm Tướng gặp Kình Dương: dễ dính việc pháp lý, kỷ luật. Mặt tốt: nhạy với luật lệ, hợp nghề luật, kiểm tra.', huong: 'Làm đúng quy trình, giữ giấy tờ rõ ràng; hợp nghề luật, kiểm tra.' },
  { ten: 'Liêm Trinh gặp Hình – Kình', d: ['Liêm Trinh'], mot: ['Thiên Hình', 'Kình Dương'], loai: 'hung', cau: 'Liêm Trinh ngộ Hình',
    kc: function (c) { return !c.co('Thiên Tướng'); }, y: 'Sao "tù" gặp sao hình: dễ vướng kiện tụng, va chạm thân thể. Mặt tốt: dám đứng ra bảo vệ lẽ phải.', huong: 'Tránh tranh chấp gay gắt; chọn cách hòa giải.' },
  // ---- Cơ Nguyệt Đồng Lương ----
  { ten: 'Cơ Âm ở Dần Thân', d: ['Thiên Cơ', 'Thái Âm'], loai: 'trung', cau: 'Cơ Nguyệt Dần Thân',
    y: 'Tinh tế, nhạy cảm, nhiều mưu kế; hay di chuyển, đổi chỗ. Mặt trái: nghĩ quá nhiều, khó ổn định một chỗ.', huong: 'Hợp nghề tính toán, kế hoạch; tránh suy nghĩ quá nhiều.' },
  { ten: 'Cự Cơ ở Mão Dậu', d: ['Thiên Cơ', 'Cự Môn'], chi: [3, 9], loai: 'cat', cau: 'Cự Cơ Mão Dậu, công khanh chi vị',
    kc: function (c) { return !c.co('Hóa Kỵ'); }, y: 'Ăn nói sắc sảo, giỏi phân tích: hợp nghề dùng lời (luật, giảng dạy, tư vấn). Mặt trái: lời sắc dễ gây thù, thắng lý mà thua tình.', huong: 'Ở Dậu kém hơn ở Mão; nói ít mà đúng.' },
  { ten: 'Thiện ấm triều cương', d: ['Thiên Cơ', 'Thiên Lương'], loai: 'cat', cau: 'Cơ Lương Thìn Tuất – thiện ấm triều cương',
    y: 'Mưu trí và được che chở: giỏi biện luận, có thiên hướng triết lý, tôn giáo. Mặt trái: bàn nhiều làm ít.', huong: 'Đừng chỉ bàn mà không làm.' },
  { ten: 'Thủy trừng quế ngạc', d: ['Thiên Đồng', 'Thái Âm'], chi: [0], loai: 'cat', cau: 'Nguyệt sinh thương hải – thủy trừng quế ngạc',
    y: 'Đồng Âm ở Tý: thanh nhã, hưởng phúc, có của để dành. Mặt trái: an phận, thiếu chủ động nên lỡ cơ hội lớn.', huong: 'Hợp nghề văn hóa, nghệ thuật, tài chính an toàn.' },
  { ten: 'Đồng Cự ở Sửu Mùi', d: ['Thiên Đồng', 'Cự Môn'], loai: 'hung', cau: 'Đồng Cự Sửu Mùi',
    y: 'Lao tâm, nhiều nỗi lo trong lòng; dễ hiểu lầm vì lời nói. Mặt tốt: suy nghĩ kỹ, ít khi nói bừa.', huong: 'Viết rõ, nói chậm; tìm việc ổn định giảm áp lực.' },
  { ten: 'Đồng Lương ở Dần Thân', d: ['Thiên Đồng', 'Thiên Lương'], loai: 'cat', cau: 'Ấm phúc tụ',
    y: 'Phúc và ấm cùng chỗ: hiền hòa, được người trên che chở, hay gặp may lúc khó. Mặt trái: dễ trông chờ may mắn và người khác.', huong: 'Hợp nghề phục vụ, y, giáo dục.' },
  { ten: 'Lương Mã phiêu đãng', d: ['Thiên Lương', 'Thiên Mã'], chi: [2, 5, 8, 11], loai: 'trung', cau: 'Lương Mã phiêu đãng',
    y: 'Thích tự do, hay đi xa, khó gắn một chỗ. Mặt tốt: mở mang tầm nhìn; mặt xấu: khó tích lũy quan hệ, tài sản.', huong: 'Chọn nghề có di chuyển; giữ một mái nhà làm điểm tựa.' },
  { ten: 'Lương Xương – thầy hiền', d: ['Thiên Lương'], mot: ['Văn Xương', 'Văn Khúc'], loai: 'cat', cau: 'Lương Xương',
    y: 'Đoan chính, có học, hợp làm thầy, cố vấn. Mặt trái: dễ cứng nhắc theo sách vở, hay dạy đời.', huong: 'Truyền dạy là cách tích phúc.' },
  // ---- Nhật Nguyệt ----
  { ten: 'Cự Nhật ở Dần', d: ['Thái Dương', 'Cự Môn'], chi: [2], loai: 'cat', cau: 'Cự Nhật Dần cung, quan phong tam đại',
    y: 'Mặt trời mọc soi tan bóng tối của Cự Môn: danh tiếng nhờ lời nói, học vấn. Mặt trái: nói nhiều hơn làm thì mất uy tín nhanh.', huong: 'Ở Thân thì vất vả hơn; nói đi đôi với làm.' },
  { ten: 'Nhật chiếu lôi môn', d: ['Thái Dương', 'Thiên Lương'], chi: [3], loai: 'cat', cau: 'Nhật chiếu lôi môn',
    y: 'Thái Dương Thiên Lương ở Mão: rạng rỡ, có danh, được kính trọng. Mặt trái: lo việc chung nhiều nên hao sức, ít thời gian cho gia đình.', huong: 'Hợp công việc công chúng, giáo dục.' },
  { ten: 'Dương Lương Xương Lộc', o: ['Mệnh', 'Thân', 'Quan Lộc'], h: ['Thái Dương', 'Thiên Lương', 'Văn Xương'], motH: ['Lộc Tồn', 'Hóa Lộc'], loai: 'cat', cau: 'Dương Lương Xương Lộc, lô truyền đệ nhất danh',
    y: 'Bộ sao thi cử, học hàm: học đâu chắc đó, có danh nhờ chữ nghĩa. Mặt trái: dễ thiên lý thuyết, ngừng học là tụt lại.', huong: 'Đầu tư bằng cấp, chứng chỉ rất đáng.' },
  { ten: 'Nhật hãm gặp Kỵ', d: ['Thái Dương'], loai: 'hung', cau: 'Nhật hãm hóa Kỵ',
    kc: function (c) { return c.ham('Thái Dương') && c.co('Hóa Kỵ'); }, y: 'Mặt trời tối lại gặp Kỵ: dễ bị hiểu lầm, bất đồng với người đàn ông lớn trong nhà (cha, chồng, sếp). Mặt tốt: học được cách tự khẳng định mình.', huong: 'Làm việc minh bạch, chủ động giải thích; giữ sức, đừng thức khuya kéo dài.' },
  { ten: 'Nguyệt hãm gặp Kỵ', d: ['Thái Âm'], loai: 'hung', cau: 'Nguyệt hãm hóa Kỵ',
    kc: function (c) { return c.ham('Thái Âm') && c.co('Hóa Kỵ'); }, y: 'Mặt trăng tối gặp Kỵ: tâm trạng thất thường, việc nhà đất – phụ nữ trong nhà hay vướng. Mặt tốt: nhạy cảm, thấu hiểu người khác sâu.', huong: 'Giữ nhịp sinh hoạt đều; giấy tờ nhà đất làm kỹ.' },
  // ---- Sát Phá Tham ----
  { ten: 'Thất Sát triều Đẩu', d: ['Thất Sát'], chi: [0, 2, 6, 8], loai: 'cat', cau: 'Thất Sát triều Đẩu, tước lộc vinh xương',
    kc: function (c) { return c.demD(TVCS_SAT) === 0; }, y: 'Tướng tinh chầu đế tinh ở đất miếu: đại khí, thành muộn mà lớn. Mặt trái: đường dài gian nan, nhiều năm vất vả mới có chỗ đứng.', huong: 'Gặp sát thì mất cách; giữ kỷ luật bản thân.' },
  { ten: 'Thất Sát gặp Kình Dương', d: ['Thất Sát', 'Kình Dương'], loai: 'hung', cau: 'Thất Sát Kình Dương',
    y: 'Quyết liệt quá mức, dễ va chạm, thương tích. Mặt tốt: năng lượng dồi dào, hợp việc cần sức bền.', huong: 'Hướng sức mạnh vào thể thao, kỹ thuật; cẩn thận giao thông, dao kéo.' },
  { ten: 'Phá Quân gặp Xương Khúc', d: ['Phá Quân'], mot: ['Văn Xương', 'Văn Khúc'], loai: 'hung', cau: 'Phá Quân Xương Khúc – thủy trung tác trủng',
    y: 'Có văn tài nhưng hay bỏ dở, đường học vấn gián đoạn; cổ thư dặn tránh sông nước. Mặt tốt: có văn tài, hứng khởi với cái mới.', huong: 'Học theo từng chặng ngắn có đích; cẩn thận khi bơi lội, đi thuyền.' },
  { ten: 'Phá Quân gặp sát', d: ['Phá Quân'], loai: 'hung', cau: 'Phá Quân ngộ sát',
    kc: function (c) { return c.demD(['Kình Dương', 'Hỏa Tinh', 'Linh Tinh', 'Đà La']) >= 1; }, y: 'Sức phá tăng mạnh: dễ đổ vỡ, tai nạn bất ngờ. Mặt tốt: dám làm mới khi người khác còn ngần ngại.', huong: 'Đổi mới có kế hoạch, không đốt cầu sau lưng.' },
  { ten: 'Hỏa Tham / Linh Tham', d: ['Tham Lang'], motH: ['Hỏa Tinh', 'Linh Tinh'], loai: 'cat', cau: 'Tham Lang Hỏa Tinh, hoạnh phát',
    kc: function (c) { return !c.ham('Tham Lang'); }, y: 'Tham Lang sáng gặp Hỏa/Linh: phát nhanh, có tiền bất ngờ. Mặt trái: đến nhanh đi nhanh, dễ mất lại vì ham thêm.', huong: 'Phát nhanh thì cũng dễ tan nhanh – chốt lời, giữ phần.' },
  { ten: 'Phong lưu thái trượng', d: ['Tham Lang', 'Đà La'], chi: [2], loai: 'hung', cau: 'Tham Đà Dần cung – phong lưu thái trượng',
    y: 'Sa vào tình ái, ham vui làm lỡ việc. Mặt tốt: sức hút mạnh.', huong: 'Đặt ranh giới rõ trong quan hệ.' },
  { ten: 'Phiếm thủy đào hoa', d: ['Tham Lang'], chi: [0], loai: 'trung', cau: 'Phiếm thủy đào hoa',
    y: 'Tham Lang ở Tý: duyên dáng, đa tình, giỏi giao tế. Mặt trái: tình cảm dễ rối ren.', huong: 'Gặp Tuần Triệt hay Không Kiếp thì đào hoa thành tài nghệ.' },
  { ten: 'Tham Lang gặp Kình Dương', d: ['Tham Lang', 'Kình Dương'], loai: 'hung', cau: 'Tham Lang Kình Dương',
    y: 'Ham muốn mạnh, dễ vì tham mà vướng. Mặt tốt: hăng hái theo đuổi điều mình muốn.', huong: 'Đặt giới hạn trước khi bắt đầu một cuộc chơi.' },
  // ---- Cự Môn ----
  { ten: 'Thạch trung ẩn ngọc', d: ['Cự Môn'], chi: [0, 6], motH: ['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa'], loai: 'cat', cau: 'Thạch trung ẩn ngọc',
    y: 'Ngọc trong đá: tuổi trẻ ít người biết, trung niên tỏa sáng. Mặt trái: lúc trẻ dễ bị đánh giá thấp, chịu thiệt thòi.', huong: 'Đừng vội khoe tài, cứ trau dồi.' },
  { ten: 'Cự Môn gặp Kình Đà', d: ['Cự Môn'], mot: ['Kình Dương', 'Đà La'], loai: 'hung', cau: 'Cự Môn Kình Đà – thị phi',
    y: 'Khẩu thiệt, kiện tụng, tranh cãi. Mặt tốt: có lý lẽ, dám nói điều người khác ngại nói.', huong: 'Nói ít, viết rõ, không tranh hơn thua bằng lời.' },
  { ten: 'Cự Môn hóa Kỵ', d: ['Cự Môn'], loai: 'hung', cau: 'Cự Kỵ',
    kc: function (c) { return c.saoHoa('Cự Môn') === 'Kỵ'; }, y: 'Lời nói dễ thành họa, bị hiểu lầm. Mặt tốt: nói thật, không vòng vo.', huong: 'Kiểm tra lại trước khi nói/gửi.' },
  // ---- Thiên Tướng giáp ----
  { ten: 'Tài ấm giáp ấn', d: ['Thiên Tướng'], loai: 'cat', cau: 'Tài ấm giáp ấn',
    kc: function (c) { return c.giap('Hóa Lộc', 'Thiên Lương'); }, y: 'Thiên Tướng được Lộc và Lương kẹp: được nâng đỡ, cơm áo đủ. Mặt trái: quen được đỡ nên khó tự đứng khi người đỡ rút lui.', huong: 'Nhận việc lớn khi được mời.' },
  { ten: 'Hình Kỵ giáp ấn', d: ['Thiên Tướng'], loai: 'hung', cau: 'Hình Kỵ giáp ấn',
    kc: function (c) { return c.giap('Kình Dương', 'Hóa Kỵ'); }, y: 'Thiên Tướng bị Kình và Kỵ kẹp: hay bị liên lụy, chịu tiếng thay người. Mặt tốt: trọng nghĩa, được người ngay thẳng tin.', huong: 'Đừng đứng ra bảo lãnh; giữ chứng từ.' },
  // ---- Lục cát ----
  { ten: 'Tả Hữu đồng cung', d: ['Tả Phù', 'Hữu Bật'], loai: 'cat', cau: 'Tả Phù Hữu Bật, chung thân phúc hậu',
    y: 'Người giúp đến từ hai phía: làm gì cũng có tay chân. Mặt trái: tự lực kém đi, nợ ân tình nhiều.', huong: 'Trả ơn đúng lúc để giữ lực đỡ.' },
  { ten: 'Tả Hữu giáp', g: ['Tả Phù', 'Hữu Bật'], loai: 'cat', cau: 'Tả Hữu giáp', y: 'Hai bên có người đỡ. Mặt trái: dễ ỷ lại vào sự hỗ trợ.', huong: 'Cởi mở nhờ giúp.' },
  { ten: 'Xương Khúc đồng cung', d: ['Văn Xương', 'Văn Khúc'], loai: 'cat', cau: 'Văn Xương Văn Khúc',
    y: 'Văn tài, học giỏi, khéo chữ nghĩa. Mặt trái: nói hay hơn làm, thiên lý thuyết.', huong: 'Viết, dạy, thi cử đều thuận.' },
  { ten: 'Xương Khúc giáp', g: ['Văn Xương', 'Văn Khúc'], loai: 'cat', cau: 'Xương Khúc giáp', y: 'Có văn tài bao quanh. Mặt trái: dễ dựa vào hiểu biết của người khác.', huong: 'Học thêm luôn có lợi.' },
  { ten: 'Xương Khúc gặp Kỵ', mot: ['Văn Xương', 'Văn Khúc'], loai: 'hung', cau: 'Xương Khúc hóa Kỵ',
    kc: function (c) { return c.saoHoa('Văn Xương') === 'Kỵ' || c.saoHoa('Văn Khúc') === 'Kỵ'; }, y: 'Giấy tờ, chữ ký, văn bản dễ sai sót. Mặt tốt: biết trước thì cẩn thận hơn người.', huong: 'Đọc kỹ hợp đồng, nhờ người xem lại.' },
  { ten: 'Tọa quý hướng quý', o: ['Mệnh', 'Thân', 'Quan Lộc', 'Tài Bạch'], h: ['Thiên Khôi', 'Thiên Việt'], loai: 'cat', cau: 'Tọa quý hướng quý',
    y: 'Quý nhân cả trong lẫn ngoài. Mặt trái: quen hỏi người trên nên tự quyết kém.', huong: 'Gặp khó thì hỏi người trên.' },
  { ten: 'Khôi Việt giáp', g: ['Thiên Khôi', 'Thiên Việt'], loai: 'cat', cau: 'Khôi Việt giáp', y: 'Quý nhân hai bên. Mặt trái: dễ chủ quan, chuẩn bị qua loa.', huong: 'Thi cử, xin việc thuận.' },
  // ---- Lộc – Mã – Tứ Hóa ----
  { ten: 'Song Lộc', o: ['Mệnh', 'Thân', 'Quan Lộc', 'Tài Bạch'], h: ['Lộc Tồn', 'Hóa Lộc'], loai: 'cat', cau: 'Song Lộc triều viên', y: 'Hai nguồn lộc cùng chầu: tiền đến từ nhiều ngả. Mặt trái: nhiều nguồn thì dễ rối, phân tán sức.', huong: 'Đa dạng nguồn thu.' },
  { ten: 'Lộc phùng lưỡng sát', mot: ['Lộc Tồn', 'Hóa Lộc'], loai: 'hung', cau: 'Lộc phùng lưỡng sát',
    kc: function (c) { return c.co('Địa Không') || c.co('Địa Kiếp'); }, y: 'Lộc gặp Không Kiếp: có tiền mà khó giữ, dễ mất vì tin người. Mặt tốt: rộng lượng, kiếm ra tiền được.', huong: 'Không cho vay lớn, không đầu tư theo lời rủ.' },
  { ten: 'Lộc Kỵ đồng cung', mot: ['Lộc Tồn', 'Hóa Lộc'], loai: 'trung', cau: 'Lộc Kỵ tương phùng',
    kc: function (c) { return c.co('Hóa Kỵ'); }, y: 'Được rồi lại vướng: lợi đi kèm phiền. Có khi cái giá phải trả lớn hơn cái được.', huong: 'Tính kỹ cái giá đi kèm mỗi khoản lợi.' },
  { ten: 'Lộc Mã giao trì', o: ['Mệnh', 'Thân', 'Quan Lộc', 'Tài Bạch'], h: ['Thiên Mã'], motH: ['Lộc Tồn', 'Hóa Lộc'], loai: 'cat', cau: 'Lộc Mã giao trì',
    kc: function (c) { return c.cungCo('Thiên Mã', 'Lộc Tồn') || c.cungCo('Thiên Mã', 'Hóa Lộc'); }, y: 'Lộc đi cùng ngựa: càng đi xa, càng năng động càng có tiền. Mặt trái: bôn ba mệt, xa gia đình, tiền tiêu theo những chuyến đi.', huong: 'Hợp buôn bán, xuất nhập khẩu, công tác xa.' },
  { ten: 'Mã ngộ Không vong', d: ['Thiên Mã'], loai: 'hung', cau: 'Mã lạc không vong',
    kc: function (c) { return c.tuan || c.triet || c.co('Thiên Không') || c.co('Địa Không'); }, y: 'Ngựa sa hố: bôn ba mà ít thành, đi nhiều về không. Mặt tốt: chịu khó, không ngại dấn thân.', huong: 'Chuyến đi nào cũng cần mục tiêu rõ.' },
  { ten: 'Chiết túc mã', d: ['Thiên Mã', 'Đà La'], loai: 'hung', cau: 'Chiết túc mã',
    y: 'Ngựa què chân: đi lại trắc trở, kế hoạch dời đổi. Mặt tốt: quen xoay xở với tình huống bất ngờ.', huong: 'Dự phòng thời gian cho mọi chuyến đi.' },
  { ten: 'Tam Hóa liên châu', o: ['Mệnh', 'Thân', 'Quan Lộc', 'Tài Bạch'], h: ['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa'], loai: 'cat', cau: 'Tam kỳ gia hội',
    y: 'Lộc – Quyền – Khoa cùng chầu: danh lợi đều có. Mặt trái: được nhiều thì bị soi nhiều, dễ bị ghen tị.', huong: 'Nắm thời cơ khi tới.' },
  { ten: 'Khoa Quyền Lộc giáp', loai: 'cat', cau: 'Khoa Quyền Lộc giáp',
    kc: function (c) { return c.giap('Hóa Lộc', 'Hóa Quyền') || c.giap('Hóa Lộc', 'Hóa Khoa') || c.giap('Hóa Quyền', 'Hóa Khoa'); }, y: 'Hai bên có Hóa cát kẹp: được thời thế đẩy lên. Mặt trái: phụ thuộc thời thế bên ngoài.', huong: 'Đừng bỏ lỡ lời mời.' },
  { ten: 'Dương Đà giáp Kỵ', d: ['Hóa Kỵ'], loai: 'hung', cau: 'Dương Đà giáp Kỵ vi bại cục',
    kc: function (c) { return c.giap('Kình Dương', 'Đà La'); }, y: 'Kỵ bị Kình Đà kẹp: bế tắc, trở ngại dồn dập. Mặt tốt: qua được thì lì và tỉnh hơn hẳn.', huong: 'Lùi một bước, giải từng nút; Thiên Phủ trong cung làm nhẹ.' },
  { ten: 'Thanh Long gặp Kỵ', d: ['Hóa Kỵ', 'Thanh Long'], loai: 'cat', cau: 'Thanh Long ngộ Kỵ – rồng ngậm ngọc',
    y: 'Kỵ gặp Thanh Long lại hóa thành lợi: từ khó khăn bật ra cơ hội. Mặt trái: giai đoạn đầu khó thật, dễ bỏ cuộc trước khi bật lên.', huong: 'Kiên trì qua giai đoạn đầu.' },
  // ---- Sát tinh ----
  { ten: 'Linh Xương Đà Vũ', d: ['Vũ Khúc'], h: ['Linh Tinh', 'Văn Xương', 'Đà La'], loai: 'hung', cau: 'Linh Xương Đà Vũ, hạn chí đầu hà',
    y: 'Bộ sao cổ thư coi là rất nặng khi vào hạn: bế tắc, tuyệt vọng, quyết định dại dột. Mặt tốt: biết trước thì chuẩn bị được người đồng hành.', huong: 'Khi hạn tới: không quyết lớn một mình, tìm người tin cậy chia sẻ, giữ an toàn sông nước.' },
  { ten: 'Lục sát hội tụ', o: ['Mệnh', 'Thân', 'Tật Ách', 'Thiên Di', 'Tài Bạch', 'Quan Lộc'], loai: 'hung', cau: 'Sát tinh hội tụ',
    kc: function (c) { return c.demH(TVCS_SAT) >= 4; }, y: 'Bốn sát tinh trở lên chiếu: áp lực, tranh đấu, biến cố. Mặt tốt: rèn bản lĩnh, sức chịu đựng.', huong: 'Chọn nghề cần dũng khí; tiết chế nóng giận; giữ an toàn.' },
  { ten: 'Song Không', d: ['Thiên Không', 'Địa Không'], loai: 'hung', cau: 'Song Không',
    y: 'Hai sao Không cùng chỗ: ý tưởng lớn mà dễ hụt, tiền dễ bay. Mặt tốt: giàu sáng tạo, hợp nghiên cứu, tu học.', huong: 'Hợp nghiên cứu, tu học, sáng tạo; tránh đầu cơ.' },
  { ten: 'Thiên Không gặp Kiếp', d: ['Thiên Không', 'Địa Kiếp'], loai: 'hung', cau: 'Không Kiếp tương phùng',
    y: 'Mất mát vì tin người, kế hoạch đổ vỡ giữa chừng. Mặt tốt: dám nghĩ khác, có ý tưởng lạ.', huong: 'Kiểm chứng trước khi tin; chia nhỏ rủi ro.' },
  { ten: 'Thiên Không gặp đào hoa', d: ['Thiên Không'], mot: ['Đào Hoa', 'Hồng Loan'], loai: 'hung', cau: 'Đào Hoa ngộ Không',
    y: 'Duyên đến dễ, đi cũng dễ; tình cảm hụt hẫng. Mặt tốt: có sức hút.', huong: 'Đừng vội cam kết khi mới quen.' },
  { ten: 'Hoa Cái gặp Không', d: ['Hoa Cái'], mot: ['Thiên Không', 'Địa Không'], loai: 'trung', cau: 'Hoa Cái ngộ Không',
    y: 'Thiên hướng tâm linh, nghệ thuật, triết lý. Mặt trái: dễ tách khỏi đời thường, xem nhẹ chuyện cơm áo.', huong: 'Một không gian riêng để tĩnh tâm là cần.' },
  { ten: 'Lưu Hà Kiếp Sát', d: ['Lưu Hà', 'Kiếp Sát'], loai: 'hung', cau: 'Lưu Hà Kiếp Sát',
    y: 'Cổ thư dặn cẩn thận sông nước, đi lại, máu huyết. Mặt tốt: biết trước để phòng thì rủi ro giảm nhiều.', huong: 'Giữ an toàn giao thông, bơi lội.' },
  { ten: 'Không Kiếp giáp', g: ['Địa Không', 'Địa Kiếp'], loai: 'hung', cau: 'Không Kiếp giáp', y: 'Hao tán bao quanh. Mặt tốt: quen xoay xở khi thiếu.', huong: 'Giữ tài sản chắc.' },
  { ten: 'Hỏa Linh giáp', g: ['Hỏa Tinh', 'Linh Tinh'], loai: 'hung', cau: 'Hỏa Linh giáp', y: 'Chuyện bất ngờ, nóng nảy. Mặt tốt: phản ứng nhanh với việc gấp.', huong: 'Hít thở trước khi phản ứng; Lộc Tồn trong cung làm nhẹ.' },
  // ---- Phụ tinh thành bộ ----
  { ten: 'Tứ Linh (Long Phượng Hổ Cái)', o: ['Mệnh', 'Thân', 'Quan Lộc'], mot: ['Long Trì', 'Phượng Các', 'Bạch Hổ', 'Hoa Cái'], h: ['Long Trì', 'Phượng Các', 'Bạch Hổ', 'Hoa Cái'], loai: 'cat', cau: 'Long Phượng Hổ Cái',
    y: 'Bộ sao danh giá: có tiếng tăm, được trọng vọng. Mặt trái: áp lực giữ hình ảnh, dễ sĩ diện và bị soi xét.', huong: 'Giữ hình ảnh, uy tín.' },
  { ten: 'Thai Tọa', o: ['Mệnh', 'Thân', 'Quan Lộc'], mot: ['Tam Thai', 'Bát Tọa'], h: ['Tam Thai', 'Bát Tọa'], loai: 'cat', cau: 'Tam Thai Bát Tọa', y: 'Địa vị, chỗ ngồi vững. Mặt trái: ngồi ghế thì gánh trách nhiệm, ngại rời vị trí dù đã không hợp.', huong: 'Hợp việc có chức danh.' },
  { ten: 'Quang Quý', o: ['Mệnh', 'Thân', 'Quan Lộc', 'Phúc Đức'], mot: ['Ân Quang', 'Thiên Quý'], h: ['Ân Quang', 'Thiên Quý'], loai: 'cat', cau: 'Ân Quang Thiên Quý', y: 'Được ơn, được giúp không mong đợi. Mặt trái: dễ trông chờ may mắn, mang nợ ân tình.', huong: 'Sống tử tế là gieo lộc.' },
  { ten: 'Thai Cáo', o: ['Mệnh', 'Thân', 'Quan Lộc'], mot: ['Thai Phụ', 'Phong Cáo'], h: ['Thai Phụ', 'Phong Cáo'], loai: 'cat', cau: 'Thai Phụ Phong Cáo', y: 'Bằng khen, danh dự. Mặt trái: dễ làm vì thành tích, trọng danh hơn thực.', huong: 'Ghi nhận đến từ nỗ lực bền.' },
  { ten: 'Khốc Hư ở Tý Ngọ', d: ['Thiên Khốc', 'Thiên Hư'], chi: [0, 6], loai: 'cat', cau: 'Khốc Hư Tý Ngọ',
    y: 'Ở đất đắc địa, buồn lo hóa thành danh tiếng, ăn nói có sức nặng. Mặt trái: con đường đến đó qua nhiều nỗi buồn, mất mát.', huong: 'Biến trải nghiệm buồn thành chiều sâu.' },
  { ten: 'Khốc Hư', d: ['Thiên Khốc', 'Thiên Hư'], loai: 'hung', cau: 'Khốc Hư',
    kc: function (c) { return c.chi !== 0 && c.chi !== 6; }, y: 'Hay buồn lo, trống trải. Mặt tốt: nhạy cảm, hiểu nỗi buồn của người khác.', huong: 'Giữ kết nối với người thân, vận động đều.' },
  { ten: 'Tang Hổ', o: ['Mệnh', 'Thân', 'Phúc Đức', 'Tật Ách', 'Phụ Mẫu'], h: ['Tang Môn', 'Bạch Hổ'], loai: 'hung', cau: 'Tang Môn Bạch Hổ',
    kc: function (c) { return c.co('Tang Môn') || c.co('Bạch Hổ'); }, y: 'Tang chế, tai nạn, kiện tụng – khi vào hạn mới đáng để ý. Mặt tốt: biết trước thì chăm lo được người thân.', huong: 'Thăm hỏi người lớn tuổi trong nhà; cẩn thận đi lại.' },
  { ten: 'Tam minh Đào Hồng Hỷ', o: ['Mệnh', 'Thân', 'Phu Thê'], mot: ['Đào Hoa', 'Hồng Loan', 'Thiên Hỷ'], h: ['Đào Hoa', 'Hồng Loan', 'Thiên Hỷ'], loai: 'cat', cau: 'Đào Hồng Hỷ',
    y: 'Duyên nhiều, được yêu mến, nhiều hỷ sự. Mặt trái: dễ rối chuyện tình cảm, ghen tuông, tốn kém cho cuộc vui.', huong: 'Chọn lọc mối quan hệ.' },
  { ten: 'Hình Riêu Y', o: ['Mệnh', 'Thân', 'Quan Lộc', 'Tật Ách'], mot: ['Thiên Hình', 'Thiên Riêu', 'Thiên Y'], h: ['Thiên Hình', 'Thiên Riêu', 'Thiên Y'], loai: 'trung', cau: 'Hình Riêu Y',
    y: 'Bộ sao nghề thuốc, chữa trị. Mặt trái: dễ ôm nỗi đau người khác, lơ là sức khỏe của mình.', huong: 'Hợp ngành y, dược, chăm sóc.' },
  { ten: 'Cô Quả', d: ['Cô Thần', 'Quả Tú'], loai: 'hung', cau: 'Cô Thần Quả Tú', y: 'Lẻ loi, tự lo một mình. Mặt tốt: tự lập, ít phải nhờ vả.', huong: 'Chủ động tìm cộng đồng hợp mình.' }
];

/**
 * Nghề nghiệp hiện nay → sao thường gặp ở Mệnh / Quan Lộc / Tài Bạch (Thiên Di, Phúc Đức khi nguồn nói rõ).
 * w: 3 sao chủ đạo, 2 hay gặp, 1 phụ trợ. Soạn 25/10/2026 (chuyên gia content-creator) từ muaban.net (14 chính tinh ở Quan Lộc),
 * mytour.vn (phụ tinh gắn nghề), masterseanchan.com (tính chất 14 chính tinh), toutiao. Nghề mới (lập trình, dữ liệu – AI, KOL,
 * chứng khoán, nhân sự, tâm lý trị liệu, nông nghiệp) suy theo tính chất sao. Các nguồn lệch nhau ở Tử Vi, Thất Sát, Thái Dương,
 * Cự Môn, Thiên Lương, Thái Âm (xem ghi chú bộ não) – chấm điểm cộng dồn nhiều sao, không dựa vào một sao.
 */
var TVCS_NGHE = [
  {"nghe": "Lập trình viên, kỹ sư phần mềm", "nhom": "Công nghệ", "sao": [{"ten": "Thiên Cơ", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Thái Âm", "cung": ["Mệnh", "Quan Lộc"], "w": 2}, {"ten": "Cự Môn", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Văn Khúc", "cung": ["Mệnh", "Quan Lộc"], "w": 1}, {"ten": "Hóa Khoa", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Địa Không", "cung": ["Quan Lộc"], "w": 1}], "y": "Người đầu óc nhanh, thích phân tích và mày mò máy móc, làm được việc cần tư duy logic và kiên nhẫn ngồi tìm lỗi.", "nguon": ["https://mytour.vn/vi/blog/bai-viet/kham-pha-thien-phu-voi-la-so-tu-vi-lua-chon-nghe-nghiep-phu-hop.html", "https://www.masterseanchan.com/zwds-main-star-tian-ji/"]},
  {"nghe": "Kỹ sư dữ liệu, trí tuệ nhân tạo", "nhom": "Công nghệ", "sao": [{"ten": "Thiên Cơ", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Cự Môn", "cung": ["Mệnh", "Quan Lộc"], "w": 2}, {"ten": "Vũ Khúc", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Hóa Khoa", "cung": ["Mệnh", "Quan Lộc"], "w": 2}, {"ten": "Văn Xương", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Địa Kiếp", "cung": ["Quan Lộc"], "w": 1}], "y": "Hợp người thích đào sâu, đặt câu hỏi và tìm quy luật trong đống số liệu, chịu được việc nghiên cứu lâu dài.", "nguon": ["https://www.masterseanchan.com/zwds-main-star-ju-men/", "https://muaban.net/blog/cung-quan-loc-448042/"]},
  {"nghe": "Kỹ sư điện, điện tử, viễn thông", "nhom": "Công nghệ", "sao": [{"ten": "Thiên Cơ", "cung": ["Quan Lộc"], "w": 3}, {"ten": "Thái Dương", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Thái Âm", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Hỏa Tinh", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Linh Tinh", "cung": ["Quan Lộc"], "w": 1}], "y": "Người khéo tay, hiểu máy móc, hợp làm việc với nguồn điện, thiết bị và hệ thống kỹ thuật.", "nguon": ["https://mytour.vn/vi/blog/bai-viet/kham-pha-thien-phu-voi-la-so-tu-vi-lua-chon-nghe-nghiep-phu-hop.html"]},
  {"nghe": "Thiết kế đồ họa, thiết kế sản phẩm", "nhom": "Truyền thông – sáng tạo", "sao": [{"ten": "Liêm Trinh", "cung": ["Quan Lộc"], "w": 3}, {"ten": "Tham Lang", "cung": ["Mệnh", "Quan Lộc"], "w": 2}, {"ten": "Thiên Cơ", "cung": ["Mệnh"], "w": 2}, {"ten": "Hồng Loan", "cung": ["Mệnh", "Quan Lộc"], "w": 2}, {"ten": "Tấu Thư", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Văn Khúc", "cung": ["Mệnh"], "w": 1}, {"ten": "Long Trì", "cung": ["Quan Lộc"], "w": 1}], "y": "Có con mắt thẩm mỹ, thích cái đẹp và cái mới, biết biến ý tưởng thành hình ảnh hấp dẫn người xem.", "nguon": ["https://muaban.net/blog/cung-quan-loc-448042/", "https://mytour.vn/vi/blog/bai-viet/kham-pha-thien-phu-voi-la-so-tu-vi-lua-chon-nghe-nghiep-phu-hop.html"]},
  {"nghe": "Marketing, quảng cáo, quan hệ công chúng", "nhom": "Kinh doanh – tài chính", "sao": [{"ten": "Tham Lang", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Liêm Trinh", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Thái Âm", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Văn Xương", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Văn Khúc", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Lưu Hà", "cung": ["Mệnh"], "w": 1}, {"ten": "Hóa Lộc", "cung": ["Quan Lộc"], "w": 1}], "y": "Giỏi giao tiếp, nắm được thị hiếu, biết làm cho sản phẩm được chú ý và nhớ đến.", "nguon": ["https://muaban.net/blog/cung-quan-loc-448042/", "https://www.masterseanchan.com/zwds-main-star-tan-lang/", "https://mytour.vn/vi/blog/bai-viet/kham-pha-thien-phu-voi-la-so-tu-vi-lua-chon-nghe-nghiep-phu-hop.html"]},
  {"nghe": "Bán hàng, kinh doanh thương mại", "nhom": "Kinh doanh – tài chính", "sao": [{"ten": "Tham Lang", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Thái Dương", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Vũ Khúc", "cung": ["Tài Bạch", "Quan Lộc"], "w": 2}, {"ten": "Lộc Tồn", "cung": ["Tài Bạch", "Mệnh"], "w": 2}, {"ten": "Hóa Lộc", "cung": ["Tài Bạch", "Quan Lộc"], "w": 2}, {"ten": "Thiên Mã", "cung": ["Thiên Di", "Quan Lộc"], "w": 1}], "y": "Người năng động, ham kiếm tiền, giỏi thuyết phục và chịu chạy việc bên ngoài, càng đi nhiều càng có đơn.", "nguon": ["https://mytour.vn/vi/blog/bai-viet/kham-pha-thien-phu-voi-la-so-tu-vi-lua-chon-nghe-nghiep-phu-hop.html", "https://www.masterseanchan.com/zwds-main-star-tai-yang/", "https://muaban.net/blog/cung-quan-loc-448042/"]},
  {"nghe": "KOL, người sáng tạo nội dung số", "nhom": "Truyền thông – sáng tạo", "sao": [{"ten": "Tham Lang", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Thái Dương", "cung": ["Mệnh"], "w": 2}, {"ten": "Thiên Đồng", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Đào Hoa", "cung": ["Mệnh"], "w": 2}, {"ten": "Hồng Loan", "cung": ["Mệnh"], "w": 1}, {"ten": "Thiên Hỷ", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Hóa Lộc", "cung": ["Tài Bạch"], "w": 1}], "y": "Có duyên trước đám đông, thích thể hiện bản thân, biết giải trí và tạo cảm tình nên dễ có người theo dõi.", "nguon": ["https://www.masterseanchan.com/zwds-main-star-tan-lang/", "https://muaban.net/blog/cung-quan-loc-448042/", "https://mytour.vn/vi/blog/bai-viet/kham-pha-thien-phu-voi-la-so-tu-vi-lua-chon-nghe-nghiep-phu-hop.html"]},
  {"nghe": "Nhà báo, biên tập viên", "nhom": "Truyền thông – sáng tạo", "sao": [{"ten": "Cự Môn", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Thiên Cơ", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Thái Dương", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Văn Xương", "cung": ["Mệnh", "Quan Lộc"], "w": 2}, {"ten": "Văn Khúc", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Tấu Thư", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Hóa Khoa", "cung": ["Quan Lộc"], "w": 1}], "y": "Thích đặt câu hỏi, soi kỹ sự việc và viết lách sắc sảo, muốn nói ra điều người khác chưa thấy.", "nguon": ["https://www.masterseanchan.com/zwds-main-star-ju-men/", "https://mytour.vn/vi/blog/bai-viet/kham-pha-thien-phu-voi-la-so-tu-vi-lua-chon-nghe-nghiep-phu-hop.html"]},
  {"nghe": "MC, người dẫn chương trình, phát thanh viên", "nhom": "Truyền thông – sáng tạo", "sao": [{"ten": "Cự Môn", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Thái Dương", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Tham Lang", "cung": ["Mệnh"], "w": 1}, {"ten": "Lưu Hà", "cung": ["Mệnh"], "w": 1}, {"ten": "Thiên Hỷ", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Hóa Quyền", "cung": ["Mệnh"], "w": 1}], "y": "Ăn nói lưu loát, sáng sủa trước đám đông, có sức lan tỏa và dẫn dắt người nghe.", "nguon": ["https://www.masterseanchan.com/zwds-main-star-ju-men/", "https://www.masterseanchan.com/zwds-main-star-tai-yang/"]},
  {"nghe": "Diễn viên, ca sĩ, nghệ sĩ biểu diễn", "nhom": "Truyền thông – sáng tạo", "sao": [{"ten": "Tham Lang", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Liêm Trinh", "cung": ["Mệnh"], "w": 2}, {"ten": "Thái Âm", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Đào Hoa", "cung": ["Mệnh", "Quan Lộc"], "w": 2}, {"ten": "Hồng Loan", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Thiên Hỷ", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Phượng Các", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Hóa Lộc", "cung": ["Quan Lộc"], "w": 1}], "y": "Có sức hút tự nhiên, cảm xúc phong phú và thích được nhìn thấy, hợp đứng trên sân khấu hay trước ống kính.", "nguon": ["https://www.masterseanchan.com/zwds-main-star-tan-lang/", "https://muaban.net/blog/cung-quan-loc-448042/", "https://mytour.vn/vi/blog/bai-viet/kham-pha-thien-phu-voi-la-so-tu-vi-lua-chon-nghe-nghiep-phu-hop.html"]},
  {"nghe": "Nhà văn, biên kịch, người viết nội dung", "nhom": "Truyền thông – sáng tạo", "sao": [{"ten": "Cự Môn", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Thiên Tướng", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Thiên Cơ", "cung": ["Mệnh"], "w": 2}, {"ten": "Văn Xương", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Văn Khúc", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Tấu Thư", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Ân Quang", "cung": ["Mệnh"], "w": 1}, {"ten": "Thiên Quý", "cung": ["Mệnh"], "w": 1}], "y": "Giàu chữ nghĩa, tưởng tượng tốt, thích quan sát đời sống rồi kể lại bằng câu chữ.", "nguon": ["https://mytour.vn/vi/blog/bai-viet/kham-pha-thien-phu-voi-la-so-tu-vi-lua-chon-nghe-nghiep-phu-hop.html", "https://www.masterseanchan.com/zwds-main-star-ju-men/"]},
  {"nghe": "Phiên dịch, biên dịch", "nhom": "Truyền thông – sáng tạo", "sao": [{"ten": "Thái Dương", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Cự Môn", "cung": ["Mệnh", "Quan Lộc"], "w": 2}, {"ten": "Thiên Cơ", "cung": ["Mệnh"], "w": 2}, {"ten": "Tả Phù", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Hữu Bật", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Hóa Khoa", "cung": ["Quan Lộc"], "w": 3}, {"ten": "Tấu Thư", "cung": ["Quan Lộc"], "w": 1}], "y": "Học ngôn ngữ nhanh, diễn đạt rõ ràng, hợp vai cầu nối giúp hai bên hiểu nhau.", "nguon": ["https://mytour.vn/vi/blog/bai-viet/kham-pha-thien-phu-voi-la-so-tu-vi-lua-chon-nghe-nghiep-phu-hop.html"]},
  {"nghe": "Giáo viên phổ thông", "nhom": "Giáo dục – nghiên cứu", "sao": [{"ten": "Thái Dương", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Thiên Lương", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Cự Môn", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Thiên Cơ", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Hóa Khoa", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Thiên Khôi", "cung": ["Mệnh"], "w": 1}, {"ten": "Lưu Hà", "cung": ["Quan Lộc"], "w": 1}], "y": "Người thích che chở và chỉ dạy, nói dễ hiểu, sẵn lòng truyền đạt cho người đi sau.", "nguon": ["https://www.masterseanchan.com/zwds-main-star-tai-yang/", "https://www.masterseanchan.com/zwds-main-star-tian-liang/", "https://mytour.vn/vi/blog/bai-viet/kham-pha-thien-phu-voi-la-so-tu-vi-lua-chon-nghe-nghiep-phu-hop.html"]},
  {"nghe": "Giảng viên, nhà nghiên cứu", "nhom": "Giáo dục – nghiên cứu", "sao": [{"ten": "Thiên Cơ", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Cự Môn", "cung": ["Mệnh", "Quan Lộc"], "w": 2}, {"ten": "Thiên Lương", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Hóa Khoa", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Văn Xương", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Thiên Khôi", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Thiên Việt", "cung": ["Quan Lộc"], "w": 1}], "y": "Ham hiểu biết, thích tìm tận gốc vấn đề và có danh tiếng nhờ kiến thức chuyên sâu.", "nguon": ["https://www.masterseanchan.com/zwds-main-star-ju-men/", "https://www.masterseanchan.com/zwds-main-star-tian-liang/", "https://mytour.vn/vi/blog/bai-viet/kham-pha-thien-phu-voi-la-so-tu-vi-lua-chon-nghe-nghiep-phu-hop.html"]},
  {"nghe": "Bác sĩ nội khoa, bác sĩ gia đình", "nhom": "Y tế – chăm sóc", "sao": [{"ten": "Thiên Lương", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Thiên Đồng", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Thiên Cơ", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Cự Môn", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Thiên Y", "cung": ["Mệnh", "Quan Lộc"], "w": 2}, {"ten": "Thiên Khôi", "cung": ["Quan Lộc"], "w": 1}], "y": "Người có lòng thương, muốn giúp người lúc khó khăn, kiên nhẫn lắng nghe và chữa lành.", "nguon": ["https://www.masterseanchan.com/zwds-main-star-tian-liang/", "https://mytour.vn/vi/blog/bai-viet/kham-pha-thien-phu-voi-la-so-tu-vi-lua-chon-nghe-nghiep-phu-hop.html", "https://muaban.net/blog/cung-quan-loc-448042/"]},
  {"nghe": "Bác sĩ phẫu thuật, nha sĩ", "nhom": "Y tế – chăm sóc", "sao": [{"ten": "Vũ Khúc", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Thất Sát", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Phá Quân", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Thiên Lương", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Thiên Hình", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Kiếp Sát", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Kình Dương", "cung": ["Quan Lộc"], "w": 1}], "y": "Tay vững, quyết đoán, dám ra tay dứt khoát ở những thời khắc sinh tử.", "nguon": ["https://muaban.net/blog/cung-quan-loc-448042/", "https://www.masterseanchan.com/zwds-main-star-wu-qu/", "https://www.masterseanchan.com/zwds-main-star-qi-sha/", "https://mytour.vn/vi/blog/bai-viet/kham-pha-thien-phu-voi-la-so-tu-vi-lua-chon-nghe-nghiep-phu-hop.html"]},
  {"nghe": "Dược sĩ, ngành dược – hóa chất", "nhom": "Y tế – chăm sóc", "sao": [{"ten": "Thiên Cơ", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Thiên Lương", "cung": ["Mệnh", "Quan Lộc"], "w": 2}, {"ten": "Thái Âm", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Thiên Y", "cung": ["Quan Lộc"], "w": 3}, {"ten": "Hóa Kỵ", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Văn Xương", "cung": ["Quan Lộc"], "w": 1}], "y": "Cẩn thận, tỉ mỉ, ghi nhớ tốt, hợp công việc cân đo chính xác để giúp người khỏe lại.", "nguon": ["https://mytour.vn/vi/blog/bai-viet/kham-pha-thien-phu-voi-la-so-tu-vi-lua-chon-nghe-nghiep-phu-hop.html"]},
  {"nghe": "Điều dưỡng, chăm sóc người bệnh", "nhom": "Y tế – chăm sóc", "sao": [{"ten": "Thiên Đồng", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Thiên Lương", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Thái Âm", "cung": ["Mệnh"], "w": 2}, {"ten": "Thiên Y", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Thiên Phúc", "cung": ["Phúc Đức"], "w": 1}, {"ten": "Hữu Bật", "cung": ["Quan Lộc"], "w": 1}], "y": "Hiền hòa, chu đáo, giàu lòng trắc ẩn, thấy vui khi được chăm lo cho người khác.", "nguon": ["https://www.masterseanchan.com/zwds-main-star-tian-liang/", "https://mytour.vn/vi/blog/bai-viet/kham-pha-thien-phu-voi-la-so-tu-vi-lua-chon-nghe-nghiep-phu-hop.html"]},
  {"nghe": "Tâm lý trị liệu, công tác xã hội", "nhom": "Y tế – chăm sóc", "sao": [{"ten": "Thiên Lương", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Thiên Cơ", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Thái Âm", "cung": ["Mệnh"], "w": 2}, {"ten": "Cự Môn", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Thiên Quý", "cung": ["Phúc Đức"], "w": 1}, {"ten": "Ân Quang", "cung": ["Phúc Đức"], "w": 1}], "y": "Biết lắng nghe, nhạy với nỗi lòng người khác, thích tìm lời giải cho những rối rắm trong tâm.", "nguon": ["https://www.masterseanchan.com/zwds-main-star-tian-liang/", "https://www.masterseanchan.com/zwds-main-star-tai-yin/"]},
  {"nghe": "Luật sư, cố vấn pháp lý", "nhom": "Pháp lý – hành chính", "sao": [{"ten": "Cự Môn", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Thiên Tướng", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Liêm Trinh", "cung": ["Mệnh", "Quan Lộc"], "w": 2}, {"ten": "Thái Dương", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Thiên Lương", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Thiên Hình", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Hóa Quyền", "cung": ["Mệnh"], "w": 1}], "y": "Lý lẽ sắc bén, giỏi tranh biện, đặt nặng lẽ phải và dám đứng ra bảo vệ quyền lợi cho người khác.", "nguon": ["https://www.masterseanchan.com/zwds-main-star-ju-men/", "https://www.masterseanchan.com/zwds-main-star-lian-zhen/", "https://www.masterseanchan.com/zwds-main-star-tian-xiang/", "https://muaban.net/blog/cung-quan-loc-448042/"]},
  {"nghe": "Thẩm phán, kiểm sát viên, thanh tra", "nhom": "Pháp lý – hành chính", "sao": [{"ten": "Liêm Trinh", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Thất Sát", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Thiên Lương", "cung": ["Mệnh", "Quan Lộc"], "w": 2}, {"ten": "Thiên Tướng", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Thiên Hình", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Hóa Kỵ", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Quốc Ấn", "cung": ["Quan Lộc"], "w": 1}], "y": "Nguyên tắc, nghiêm minh, phân rõ phải trái và chịu được áp lực khi phải ra quyết định.", "nguon": ["https://www.masterseanchan.com/zwds-main-star-lian-zhen/", "https://www.masterseanchan.com/zwds-main-star-qi-sha/", "https://mytour.vn/vi/blog/bai-viet/kham-pha-thien-phu-voi-la-so-tu-vi-lua-chon-nghe-nghiep-phu-hop.html"]},
  {"nghe": "Công chức hành chính nhà nước", "nhom": "Pháp lý – hành chính", "sao": [{"ten": "Tử Vi", "cung": ["Mệnh", "Quan Lộc"], "w": 2}, {"ten": "Thiên Tướng", "cung": ["Quan Lộc"], "w": 3}, {"ten": "Thiên Đồng", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Thiên Lương", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Liêm Trinh", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Quốc Ấn", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Phong Cáo", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Tả Phù", "cung": ["Quan Lộc"], "w": 1}], "y": "Thích sự ổn định, làm việc theo quy trình, đáng tin và hợp với môi trường tổ chức có thứ bậc rõ ràng.", "nguon": ["https://www.masterseanchan.com/zwds-main-star-zi-wei/", "https://www.masterseanchan.com/zwds-main-star-lian-zhen/", "https://www.toutiao.com/zixun/7492593308917614603/"]},
  {"nghe": "Thư ký, trợ lý giám đốc, tham mưu", "nhom": "Pháp lý – hành chính", "sao": [{"ten": "Thiên Tướng", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Thiên Đồng", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Thiên Lương", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Tả Phù", "cung": ["Mệnh", "Quan Lộc"], "w": 2}, {"ten": "Hữu Bật", "cung": ["Mệnh", "Quan Lộc"], "w": 2}, {"ten": "Văn Xương", "cung": ["Quan Lộc"], "w": 1}], "y": "Chu toàn, khéo léo, giỏi sắp xếp và hỗ trợ người đứng đầu làm việc trơn tru.", "nguon": ["https://www.toutiao.com/zixun/7492593308917614603/", "https://muaban.net/blog/cung-quan-loc-448042/"]},
  {"nghe": "Ngoại giao, quan hệ quốc tế", "nhom": "Pháp lý – hành chính", "sao": [{"ten": "Thái Dương", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Cự Môn", "cung": ["Quan Lộc"], "w": 3}, {"ten": "Thiên Tướng", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Thái Âm", "cung": ["Mệnh"], "w": 1}, {"ten": "Thiên Mã", "cung": ["Thiên Di"], "w": 1}, {"ten": "Hóa Khoa", "cung": ["Quan Lộc"], "w": 1}], "y": "Ăn nói khéo, cởi mở với người lạ, hợp làm đại diện và kết nối ở những nơi xa.", "nguon": ["https://muaban.net/blog/cung-quan-loc-448042/", "https://www.masterseanchan.com/zwds-main-star-tian-xiang/"]},
  {"nghe": "Kế toán, kiểm toán, thuế", "nhom": "Kinh doanh – tài chính", "sao": [{"ten": "Vũ Khúc", "cung": ["Mệnh", "Quan Lộc", "Tài Bạch"], "w": 3}, {"ten": "Thiên Phủ", "cung": ["Quan Lộc", "Tài Bạch"], "w": 2}, {"ten": "Thái Âm", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Thiên Lương", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Lộc Tồn", "cung": ["Tài Bạch"], "w": 1}, {"ten": "Hóa Khoa", "cung": ["Quan Lộc"], "w": 1}], "y": "Rạch ròi chuyện tiền bạc, cẩn thận với con số và giữ của chắc tay.", "nguon": ["https://www.masterseanchan.com/zwds-main-star-wu-qu/", "https://muaban.net/blog/cung-quan-loc-448042/", "https://www.masterseanchan.com/zwds-main-star-tian-fu/"]},
  {"nghe": "Ngân hàng, tài chính doanh nghiệp", "nhom": "Kinh doanh – tài chính", "sao": [{"ten": "Vũ Khúc", "cung": ["Mệnh", "Quan Lộc", "Tài Bạch"], "w": 3}, {"ten": "Thiên Phủ", "cung": ["Mệnh", "Quan Lộc", "Tài Bạch"], "w": 3}, {"ten": "Liêm Trinh", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Thái Âm", "cung": ["Tài Bạch"], "w": 1}, {"ten": "Hóa Lộc", "cung": ["Tài Bạch"], "w": 2}, {"ten": "Lộc Tồn", "cung": ["Tài Bạch"], "w": 2}, {"ten": "Hóa Khoa", "cung": ["Quan Lộc"], "w": 1}], "y": "Giỏi quản lý tiền của người khác, thận trọng, đáng tin, hợp làm nơi giữ và điều tiết dòng vốn.", "nguon": ["https://www.masterseanchan.com/zwds-main-star-wu-qu/", "https://www.masterseanchan.com/zwds-main-star-tian-fu/", "https://muaban.net/blog/cung-quan-loc-448042/"]},
  {"nghe": "Đầu tư chứng khoán, quỹ đầu tư", "nhom": "Kinh doanh – tài chính", "sao": [{"ten": "Vũ Khúc", "cung": ["Mệnh", "Tài Bạch"], "w": 3}, {"ten": "Tham Lang", "cung": ["Mệnh", "Tài Bạch"], "w": 2}, {"ten": "Phá Quân", "cung": ["Tài Bạch"], "w": 2}, {"ten": "Thiên Cơ", "cung": ["Mệnh"], "w": 1}, {"ten": "Hóa Lộc", "cung": ["Tài Bạch"], "w": 2}, {"ten": "Hóa Quyền", "cung": ["Tài Bạch"], "w": 1}, {"ten": "Địa Kiếp", "cung": ["Tài Bạch"], "w": 1}], "y": "Nhạy với cơ hội kiếm tiền, dám chấp nhận rủi ro và quyết nhanh; cần kỷ luật để tránh lúc lên lúc xuống.", "nguon": ["https://www.masterseanchan.com/zwds-main-star-wu-qu/", "https://www.masterseanchan.com/zwds-main-star-po-jun/"]},
  {"nghe": "Bất động sản, môi giới nhà đất", "nhom": "Kinh doanh – tài chính", "sao": [{"ten": "Thái Âm", "cung": ["Mệnh", "Tài Bạch", "Quan Lộc"], "w": 3}, {"ten": "Thiên Phủ", "cung": ["Tài Bạch", "Quan Lộc"], "w": 3}, {"ten": "Tham Lang", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Lưu Hà", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Lộc Tồn", "cung": ["Tài Bạch"], "w": 1}, {"ten": "Hóa Lộc", "cung": ["Tài Bạch"], "w": 1}], "y": "Có duyên với nhà cửa, đất đai, thích tích lũy tài sản lâu dài và biết làm trung gian.", "nguon": ["https://mytour.vn/vi/blog/bai-viet/kham-pha-thien-phu-voi-la-so-tu-vi-lua-chon-nghe-nghiep-phu-hop.html", "https://www.masterseanchan.com/zwds-main-star-tai-yin/", "https://www.masterseanchan.com/zwds-main-star-tan-lang/"]},
  {"nghe": "Chủ doanh nghiệp, nhà khởi nghiệp", "nhom": "Kinh doanh – tài chính", "sao": [{"ten": "Tử Vi", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Thất Sát", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Phá Quân", "cung": ["Mệnh", "Quan Lộc"], "w": 2}, {"ten": "Thiên Phủ", "cung": ["Tài Bạch"], "w": 1}, {"ten": "Hóa Quyền", "cung": ["Mệnh", "Quan Lộc"], "w": 2}, {"ten": "Tả Phù", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Hữu Bật", "cung": ["Quan Lộc"], "w": 1}], "y": "Muốn tự làm chủ, dám mở đường mới và gánh trách nhiệm; càng có người giỏi phò giúp càng đi xa.", "nguon": ["https://www.masterseanchan.com/zwds-main-star-zi-wei/", "https://www.masterseanchan.com/zwds-main-star-qi-sha/", "https://www.masterseanchan.com/zwds-main-star-po-jun/"]},
  {"nghe": "Quản lý cấp cao, điều hành", "nhom": "Kinh doanh – tài chính", "sao": [{"ten": "Tử Vi", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Thiên Phủ", "cung": ["Mệnh", "Quan Lộc"], "w": 2}, {"ten": "Thiên Tướng", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Vũ Khúc", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Hóa Quyền", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Tả Phù", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Hữu Bật", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Thiên Khôi", "cung": ["Mệnh"], "w": 1}], "y": "Có tầm nhìn, biết dùng người và giữ được trật tự cho cả tổ chức vận hành.", "nguon": ["https://www.masterseanchan.com/zwds-main-star-zi-wei/", "https://www.masterseanchan.com/zwds-main-star-tian-fu/", "https://www.masterseanchan.com/zwds-main-star-tian-xiang/"]},
  {"nghe": "Quản lý nhân sự, tuyển dụng", "nhom": "Kinh doanh – tài chính", "sao": [{"ten": "Thiên Tướng", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Thiên Lương", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Thiên Đồng", "cung": ["Mệnh"], "w": 2}, {"ten": "Thái Dương", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Tả Phù", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Hữu Bật", "cung": ["Quan Lộc"], "w": 1}], "y": "Công tâm, hòa nhã, biết dung hòa quyền lợi giữa người lao động và tổ chức.", "nguon": ["https://www.masterseanchan.com/zwds-main-star-tian-xiang/", "https://muaban.net/blog/cung-quan-loc-448042/"]},
  {"nghe": "Xuất nhập khẩu, logistics, vận tải", "nhom": "Kinh doanh – tài chính", "sao": [{"ten": "Thiên Cơ", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Phá Quân", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Thái Dương", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Vũ Khúc", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Thiên Mã", "cung": ["Quan Lộc", "Thiên Di"], "w": 3}, {"ten": "Lộc Tồn", "cung": ["Tài Bạch"], "w": 1}], "y": "Năng động, thích di chuyển và xoay xở nhanh, hợp với dòng hàng hóa luôn chảy.", "nguon": ["https://muaban.net/blog/cung-quan-loc-448042/", "https://mytour.vn/vi/blog/bai-viet/kham-pha-thien-phu-voi-la-so-tu-vi-lua-chon-nghe-nghiep-phu-hop.html", "https://www.masterseanchan.com/zwds-main-star-wu-qu/"]},
  {"nghe": "Kỹ sư cơ khí, công nghiệp, quản lý nhà xưởng", "nhom": "Kỹ thuật – sản xuất", "sao": [{"ten": "Thất Sát", "cung": ["Quan Lộc"], "w": 3}, {"ten": "Phá Quân", "cung": ["Quan Lộc"], "w": 3}, {"ten": "Vũ Khúc", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Thiên Cơ", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Kình Dương", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Địa Không", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Hỏa Tinh", "cung": ["Quan Lộc"], "w": 1}], "y": "Thực tế, chịu khó, thích làm ra sản phẩm cụ thể bằng máy móc và kỹ thuật.", "nguon": ["https://muaban.net/blog/cung-quan-loc-448042/", "https://mytour.vn/vi/blog/bai-viet/kham-pha-thien-phu-voi-la-so-tu-vi-lua-chon-nghe-nghiep-phu-hop.html"]},
  {"nghe": "Kỹ sư xây dựng, công trình", "nhom": "Kỹ thuật – sản xuất", "sao": [{"ten": "Vũ Khúc", "cung": ["Quan Lộc"], "w": 3}, {"ten": "Thất Sát", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Thiên Phủ", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Thái Âm", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Thiên Mã", "cung": ["Thiên Di"], "w": 1}, {"ten": "Hóa Quyền", "cung": ["Quan Lộc"], "w": 1}], "y": "Bền bỉ, chắc chắn, giỏi tính toán và dám đứng mũi chịu sào ở công trường.", "nguon": ["https://muaban.net/blog/cung-quan-loc-448042/", "https://www.masterseanchan.com/zwds-main-star-wu-qu/"]},
  {"nghe": "Kiến trúc sư, thiết kế nội thất – cảnh quan", "nhom": "Kỹ thuật – sản xuất", "sao": [{"ten": "Thái Âm", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Thiên Cơ", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Liêm Trinh", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Long Trì", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Phượng Các", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Hồng Loan", "cung": ["Mệnh"], "w": 1}, {"ten": "Tấu Thư", "cung": ["Quan Lộc"], "w": 1}], "y": "Kết hợp được óc thẩm mỹ với tư duy không gian, thích tạo ra nơi ở đẹp và tiện.", "nguon": ["https://mytour.vn/vi/blog/bai-viet/kham-pha-thien-phu-voi-la-so-tu-vi-lua-chon-nghe-nghiep-phu-hop.html"]},
  {"nghe": "Nông nghiệp, trang trại, chế biến nông sản", "nhom": "Kỹ thuật – sản xuất", "sao": [{"ten": "Thiên Phủ", "cung": ["Mệnh", "Tài Bạch"], "w": 2}, {"ten": "Thiên Đồng", "cung": ["Mệnh"], "w": 2}, {"ten": "Thái Âm", "cung": ["Tài Bạch"], "w": 2}, {"ten": "Thiên Lương", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Lộc Tồn", "cung": ["Tài Bạch"], "w": 1}, {"ten": "Thiên Phúc", "cung": ["Phúc Đức"], "w": 1}], "y": "Hiền hòa, kiên nhẫn, thích tích lũy từ từ và gắn bó với đất đai, mùa vụ.", "nguon": ["https://www.masterseanchan.com/zwds-main-star-tian-fu/", "https://www.masterseanchan.com/zwds-main-star-tai-yin/"]},
  {"nghe": "Đầu bếp, nhà hàng – ẩm thực", "nhom": "Dịch vụ – du lịch", "sao": [{"ten": "Thiên Đồng", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Liêm Trinh", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Tham Lang", "cung": ["Quan Lộc", "Tài Bạch"], "w": 2}, {"ten": "Thất Sát", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Thiên Trù", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Hóa Lộc", "cung": ["Tài Bạch"], "w": 1}], "y": "Thích hưởng thụ và chăm chút món ngon, khéo tay, vui khi làm người khác no lòng.", "nguon": ["https://muaban.net/blog/cung-quan-loc-448042/", "https://mytour.vn/vi/blog/bai-viet/kham-pha-thien-phu-voi-la-so-tu-vi-lua-chon-nghe-nghiep-phu-hop.html", "https://www.masterseanchan.com/zwds-main-star-tan-lang/"]},
  {"nghe": "Du lịch, khách sạn, hướng dẫn viên", "nhom": "Dịch vụ – du lịch", "sao": [{"ten": "Thiên Đồng", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Tham Lang", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Thiên Cơ", "cung": ["Mệnh"], "w": 1}, {"ten": "Thái Âm", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Thiên Mã", "cung": ["Thiên Di", "Quan Lộc"], "w": 3}, {"ten": "Thiên Hỷ", "cung": ["Mệnh"], "w": 1}], "y": "Vui vẻ, dễ gần, thích đi đây đi đó và mang lại trải nghiệm thoải mái cho khách.", "nguon": ["https://muaban.net/blog/cung-quan-loc-448042/", "https://www.masterseanchan.com/zwds-main-star-tan-lang/", "https://mytour.vn/vi/blog/bai-viet/kham-pha-thien-phu-voi-la-so-tu-vi-lua-chon-nghe-nghiep-phu-hop.html"]},
  {"nghe": "Phi công, tiếp viên hàng không, lái xe", "nhom": "Dịch vụ – du lịch", "sao": [{"ten": "Thiên Cơ", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Phá Quân", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Thiên Đồng", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Thiên Mã", "cung": ["Mệnh", "Thiên Di", "Quan Lộc"], "w": 3}, {"ten": "Lộc Tồn", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Hóa Quyền", "cung": ["Quan Lộc"], "w": 1}], "y": "Phản xạ nhanh, thích chuyển động và đổi cảnh, hợp công việc gắn với phương tiện và những chuyến đi.", "nguon": ["https://mytour.vn/vi/blog/bai-viet/kham-pha-thien-phu-voi-la-so-tu-vi-lua-chon-nghe-nghiep-phu-hop.html", "https://muaban.net/blog/cung-quan-loc-448042/"]},
  {"nghe": "Thời trang, làm đẹp, trang điểm – làm tóc", "nhom": "Dịch vụ – du lịch", "sao": [{"ten": "Thiên Đồng", "cung": ["Quan Lộc"], "w": 3}, {"ten": "Tham Lang", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Thái Âm", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Hồng Loan", "cung": ["Mệnh", "Quan Lộc"], "w": 2}, {"ten": "Đào Hoa", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Hoa Cái", "cung": ["Mệnh"], "w": 1}, {"ten": "Tấu Thư", "cung": ["Quan Lộc"], "w": 1}], "y": "Yêu cái đẹp, nhạy xu hướng, biết làm người khác tự tin và rạng rỡ hơn.", "nguon": ["https://muaban.net/blog/cung-quan-loc-448042/", "https://mytour.vn/vi/blog/bai-viet/kham-pha-thien-phu-voi-la-so-tu-vi-lua-chon-nghe-nghiep-phu-hop.html"]},
  {"nghe": "Quân đội, công an", "nhom": "Lực lượng vũ trang – an ninh", "sao": [{"ten": "Thất Sát", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Phá Quân", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Vũ Khúc", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Thiên Tướng", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Liêm Trinh", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Kình Dương", "cung": ["Mệnh"], "w": 1}, {"ten": "Tướng Quân", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Thiên Hình", "cung": ["Quan Lộc"], "w": 1}], "y": "Gan dạ, kỷ luật, dám xông pha và chịu gian khổ để giữ an toàn cho người khác.", "nguon": ["https://muaban.net/blog/cung-quan-loc-448042/", "https://www.masterseanchan.com/zwds-main-star-qi-sha/", "https://www.toutiao.com/zixun/7492593308917614603/", "https://mytour.vn/vi/blog/bai-viet/kham-pha-thien-phu-voi-la-so-tu-vi-lua-chon-nghe-nghiep-phu-hop.html"]},
  {"nghe": "Bảo vệ, an ninh, cứu hộ – phòng cháy", "nhom": "Lực lượng vũ trang – an ninh", "sao": [{"ten": "Thất Sát", "cung": ["Quan Lộc"], "w": 3}, {"ten": "Thiên Lương", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Thiên Cơ", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Phá Quân", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Lực Sĩ", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Kình Dương", "cung": ["Quan Lộc"], "w": 1}], "y": "Nhanh nhạy trong tình huống nguy cấp, muốn đứng ra che chắn và giải cứu người gặp nạn.", "nguon": ["https://www.masterseanchan.com/zwds-main-star-qi-sha/", "https://muaban.net/blog/cung-quan-loc-448042/"]},
  {"nghe": "Hải quan, kiểm soát biên giới", "nhom": "Lực lượng vũ trang – an ninh", "sao": [{"ten": "Thiên Tướng", "cung": ["Quan Lộc"], "w": 3}, {"ten": "Vũ Khúc", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Liêm Trinh", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Thiên Hình", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Quốc Ấn", "cung": ["Quan Lộc"], "w": 1}], "y": "Nghiêm túc, giữ nguyên tắc, hợp việc kiểm tra và giữ cửa ngõ theo đúng luật lệ.", "nguon": ["https://muaban.net/blog/cung-quan-loc-448042/"]},
  {"nghe": "Vận động viên, huấn luyện viên thể thao", "nhom": "Lực lượng vũ trang – an ninh", "sao": [{"ten": "Thất Sát", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Vũ Khúc", "cung": ["Mệnh"], "w": 2}, {"ten": "Tham Lang", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Hóa Quyền", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Kình Dương", "cung": ["Mệnh"], "w": 1}, {"ten": "Lực Sĩ", "cung": ["Mệnh"], "w": 1}], "y": "Sức bền và ý chí thắng cao, thích thử thách thể lực và cạnh tranh trực diện.", "nguon": ["https://www.masterseanchan.com/zwds-main-star-qi-sha/", "https://www.masterseanchan.com/zwds-main-star-wu-qu/", "https://muaban.net/blog/cung-quan-loc-448042/"]},
  {"nghe": "Tư vấn phong thủy, tâm linh, tôn giáo", "nhom": "Tâm linh – tư vấn", "sao": [{"ten": "Thiên Lương", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Thiên Cơ", "cung": ["Mệnh"], "w": 2}, {"ten": "Cự Môn", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Thiên Tướng", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Hoa Cái", "cung": ["Mệnh", "Quan Lộc"], "w": 2}, {"ten": "Thiên Quan", "cung": ["Phúc Đức"], "w": 1}, {"ten": "Thiên Phúc", "cung": ["Phúc Đức"], "w": 1}], "y": "Thích suy ngẫm lẽ đời, có khuynh hướng hướng nội và muốn giúp người tìm bình an.", "nguon": ["https://www.masterseanchan.com/zwds-main-star-tian-liang/", "https://muaban.net/blog/cung-quan-loc-448042/", "https://www.masterseanchan.com/zwds-main-star-tian-xiang/"]},
  {"nghe": "Tư vấn chiến lược, hoạch định, chuyên viên phân tích", "nhom": "Tâm linh – tư vấn", "sao": [{"ten": "Thiên Cơ", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Thiên Lương", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Thiên Đồng", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Cự Môn", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Hóa Khoa", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Tam Thai", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Bát Tọa", "cung": ["Quan Lộc"], "w": 1}], "y": "Giỏi tính trước tính sau, nhìn ra đường đi nước bước và đưa lời khuyên có cơ sở.", "nguon": ["https://www.masterseanchan.com/zwds-main-star-tian-ji/", "https://muaban.net/blog/cung-quan-loc-448042/"]},
  {"nghe": "Nhạc sĩ, nhạc công, vũ công", "nhom": "Truyền thông – sáng tạo", "sao": [{"ten": "Tham Lang", "cung": ["Mệnh"], "w": 2}, {"ten": "Thái Âm", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Liêm Trinh", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Văn Khúc", "cung": ["Mệnh", "Quan Lộc"], "w": 3}, {"ten": "Phượng Các", "cung": ["Quan Lộc"], "w": 2}, {"ten": "Hoa Cái", "cung": ["Mệnh"], "w": 1}, {"ten": "Tấu Thư", "cung": ["Quan Lộc"], "w": 1}, {"ten": "Thiên Mã", "cung": ["Quan Lộc"], "w": 1}], "y": "Cảm thụ âm thanh và nhịp điệu tốt, thể hiện cảm xúc qua tiếng đàn, giọng hát hay điệu múa.", "nguon": ["https://mytour.vn/vi/blog/bai-viet/kham-pha-thien-phu-voi-la-so-tu-vi-lua-chon-nghe-nghiep-phu-hop.html", "https://muaban.net/blog/cung-quan-loc-448042/"]}
];

/** Mức nặng của sao hạn khi nằm trong cung đại vận (đồng cung) – trọng số */
var TVCS_HAN_W = {
  'Thiên Không': 1.5, 'Thiên Thương': 1.5, 'Thiên Sứ': 1.8, 'Địa Không': 1.5, 'Địa Kiếp': 1.8,
  'Kình Dương': 1.2, 'Đà La': 1.0, 'Hỏa Tinh': 1.0, 'Linh Tinh': 1.0, 'Hóa Kỵ': 1.5, 'Thiên Hình': 0.8,
  'Tang Môn': 0.8, 'Bạch Hổ': 1.0, 'Điếu Khách': 0.5, 'Thiên Khốc': 0.4, 'Thiên Hư': 0.4, 'Lưu Hà': 0.6, 'Kiếp Sát': 0.6,
  'Tuế Phá': 0.4, 'Bệnh Phù': 0.5, 'Đại Hao': 0.6, 'Phá Toái': 0.4, 'Tử Phù': 0.3
};
var TVCS_HAN_Y = {
  'Thiên Không': 'kỳ vọng dễ hụt, bị lừa hoặc mất tiền vì tin người, kế hoạch đổ giữa chừng; ngược lại rất hợp nghiên cứu, tu học, sáng tạo',
  'Thiên Thương': 'hao tổn, mất mát; việc của bạn bè, cấp dưới kéo theo phiền – là lúc chuyện bắt đầu hình thành, còn kịp xử lý nếu thấy sớm',
  'Thiên Sứ': 'chuyện tích tụ lâu đến lúc phải có kết quả; cổ thư coi là sao "báo tin" – cần giữ sức khỏe, khám định kỳ',
  'Địa Không': 'hao tán, ý tưởng viển vông, đầu tư dễ mất',
  'Địa Kiếp': 'thăng trầm đột ngột, mất của, biến động lớn',
  'Kình Dương': 'tranh đấu, va chạm, dao kéo',
  'Đà La': 'trì trệ, dây dưa, bị ngáng',
  'Hỏa Tinh': 'nóng nảy, chuyện bột phát, cẩn thận lửa điện',
  'Linh Tinh': 'chuyện âm ỉ rồi bùng, bất ngờ',
  'Hóa Kỵ': 'vướng mắc, thị phi, việc không thông',
  'Thiên Hình': 'kỷ luật, pháp lý, mổ xẻ',
  'Tang Môn': 'tang chế, buồn phiền', 'Bạch Hổ': 'tai nạn, kiện tụng, tang', 'Điếu Khách': 'tin buồn',
  'Thiên Khốc': 'buồn khóc', 'Thiên Hư': 'trống trải, hư hao', 'Lưu Hà': 'sông nước, máu huyết', 'Kiếp Sát': 'tai nạn, bị cướp đoạt',
  'Tuế Phá': 'phá tán', 'Bệnh Phù': 'ốm vặt', 'Đại Hao': 'hao tiền lớn', 'Phá Toái': 'đổ vỡ nhỏ', 'Tử Phù': 'buồn thương'
};

/* ---------- Ngữ cảnh một cung ---------- */
function tvcsTen_(Pc) {
  var s = {};
  [Pc.chinh, Pc.cat, Pc.hung, Pc.tieu, Pc.vong || []].forEach(function (ds) { ds.forEach(function (x) { s[x.n] = x; }); });
  if (Pc.trangSinh) s[Pc.trangSinh] = s[Pc.trangSinh] || { n: Pc.trangSinh };
  return s;
}
function tvcsCtx_(tv, pi) {
  var P = tv.palaces, T = P.map(tvcsTen_);
  var xung = mod12(pi + 6), tp = [pi, mod12(pi + 4), mod12(pi + 8), xung];
  var muon = !P[pi].chinh.length;
  var chinhRef = muon ? P[xung].chinh : P[pi].chinh;
  function chinhCo(n) { return chinhRef.some(function (s) { return s.n === n; }); }
  var c = {
    pi: pi, chi: pi, muon: muon, tuan: !!P[pi].tuan, triet: !!P[pi].triet, tp: tp,
    co: function (n) { return n in T[pi] || (SAO[n] && SAO[n][1] === 'chinh' && chinhCo(n)); },
    coH: function (n) { return tp.some(function (q) { return n in T[q]; }); },
    demD: function (ds) { return ds.filter(function (n) { return n in T[pi]; }).length; },
    demH: function (ds) { return ds.filter(function (n) { return tp.some(function (q) { return n in T[q]; }); }).length; },
    demChinh: function () { return P[pi].chinh.length; },
    ham: function (n) { var s = chinhRef.filter(function (x) { return x.n === n; })[0] || T[pi][n]; return !!s && s.b === 'H'; },
    saoHoa: function (n) { var q = tv.pos[n]; if (q == null || tp.indexOf(q) < 0 && q !== pi) return ''; var s = T[q][n]; return (s && s.hoa) || ''; },
    giap: function (a, b) { var l = mod12(pi - 1), r = mod12(pi + 1); return (a in T[l] && b in T[r]) || (a in T[r] && b in T[l]); },
    cungCo: function (a, b) { return tp.some(function (q) { return a in T[q] && b in T[q]; }); }
  };
  return c;
}

/** Điều kiện thêm (hàm kc) viết thành lời – cho thư viện bộ sao ở tab Tham khảo */
var TVCS_DK_THEM = {
  'Tử Vi cô quân': 'tam phương không có Tả Phù, Hữu Bật mà có từ 2 sát tinh',
  'Không khố – lộ khố': 'trong cung có Địa Không, Địa Kiếp hoặc Tuần, Triệt',
  'Phủ Tướng triều viên': 'cung không chứa Thiên Phủ, Thiên Tướng mà được hai sao chầu từ tam phương',
  'Cự Cơ ở Mão Dậu': 'không có Hóa Kỵ trong cung',
  'Hình tù giáp ấn': 'có thêm Kình Dương trong cung',
  'Liêm Trinh gặp Hình – Kình': 'không có Thiên Tướng đồng cung',
  'Nhật hãm gặp Kỵ': 'Thái Dương hãm địa và có Hóa Kỵ',
  'Nguyệt hãm gặp Kỵ': 'Thái Âm hãm địa và có Hóa Kỵ',
  'Thất Sát triều Đẩu': 'trong cung không có sát tinh',
  'Phá Quân gặp sát': 'trong cung có Kình Dương, Đà La, Hỏa Tinh hoặc Linh Tinh',
  'Hỏa Tham / Linh Tham': 'Tham Lang không hãm',
  'Cự Môn hóa Kỵ': 'Cự Môn mang Hóa Kỵ',
  'Tài ấm giáp ấn': 'hai cung kề là Hóa Lộc và Thiên Lương',
  'Hình Kỵ giáp ấn': 'hai cung kề là Kình Dương và Hóa Kỵ',
  'Xương Khúc gặp Kỵ': 'Văn Xương hoặc Văn Khúc mang Hóa Kỵ',
  'Lộc phùng lưỡng sát': 'trong cung có Địa Không hoặc Địa Kiếp',
  'Lộc Kỵ đồng cung': 'trong cung có Hóa Kỵ',
  'Lộc Mã giao trì': 'Thiên Mã và Lộc cùng một cung trong tam phương',
  'Mã ngộ Không vong': 'cung có Tuần, Triệt, Thiên Không hoặc Địa Không',
  'Khoa Quyền Lộc giáp': 'hai cung kề là hai trong ba Hóa Lộc, Hóa Quyền, Hóa Khoa',
  'Dương Đà giáp Kỵ': 'hai cung kề là Kình Dương và Đà La',
  'Lục sát hội tụ': 'tam phương tứ chính có từ 4 sát tinh (Kình, Đà, Hỏa, Linh, Không, Kiếp)',
  'Khốc Hư': 'cung không ở Tý, Ngọ',
  'Tang Hổ': 'Tang Môn hoặc Bạch Hổ nằm ngay trong cung'
};
/** Mô tả điều kiện thành bộ bằng lời */
function tvcsDieuKien_(r) {
  var CHI_T = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'], ds = [];
  if (r.d) ds.push('cùng cung: ' + r.d.join(' + '));
  if (r.mot) ds.push('trong cung có một trong: ' + r.mot.join(', '));
  if (r.h) ds.push('tam phương tứ chính có: ' + r.h.join(', '));
  if (r.motH) ds.push('tam phương có một trong: ' + r.motH.join(', '));
  if (r.g) ds.push('hai cung kề hai bên là ' + r.g.join(' và '));
  if (r.chi) ds.push('cung an tại ' + r.chi.map(function (c) { return CHI_T[c]; }).join(', '));
  if (TVCS_DK_THEM[r.ten]) ds.push(TVCS_DK_THEM[r.ten]);
  if (r.o) ds.push('xét ở cung ' + r.o.join(', '));
  return ds.join('; ');
}

/** Bộ sao khớp ở một cung */
function tvcsBoSaoCung_(tv, pi) {
  var c = tvcsCtx_(tv, pi), out = [];
  TVCS_BO_SAO.forEach(function (r) {
    if (r.chi && r.chi.indexOf(pi) < 0) return;
    if (r.o && r.o.indexOf(tv.palaces[pi].cung) < 0 && !(r.o.indexOf('Thân') >= 0 && tv.palaces[pi].isThan)) return;
    if (r.d && !r.d.every(c.co)) return;
    if (r.h && !r.h.every(c.coH)) return;
    if (r.g && !c.giap(r.g[0], r.g[1])) return;
    if (r.mot && !r.mot.some(c.co)) return;
    if (r.motH && !r.motH.some(c.coH)) return;
    if (r.kc && !r.kc(c)) return;
    out.push({ ten: r.ten, loai: r.loai, cau: r.cau || '', y: r.y, huong: r.huong || '', muon: c.muon && (r.d || []).some(function (n) { return SAO[n] && SAO[n][1] === 'chinh'; }) });
  });
  return out;
}

/* ---------- 1. Bộ sao 12 cung ---------- */
function tvcsBoSao_(tv) {
  var P = tv.palaces, I = tv.info, ds = [];
  for (var k = 0; k < 12; k++) {
    var pi = mod12(I.menh - k), Pc = P[pi];
    var chinh = Pc.chinh.map(function (s) { return s.n + (s.b ? ' (' + s.b + ')' : '') + (s.hoa ? ' hóa ' + s.hoa : ''); });
    ds.push({ cung: Pc.cung, chi: CHI[pi], than: !!Pc.isThan, chinh: chinh.join(', ') || 'Vô chính diệu (mượn ' + (P[mod12(pi + 6)].chinh.map(function (s) { return s.n; }).join(', ') || '—') + ')',
      phu: Pc.cat.concat(Pc.hung).map(function (s) { return s.n; }), bo: tvcsBoSaoCung_(tv, pi) });
  }
  return ds;
}

/* ---------- 2. Mười hai đại vận ---------- */
function tvcsDaiVan_(tv) {
  var P = tv.palaces, I = tv.info, T = P.map(tvcsTen_);
  function cungTen(n) { for (var i = 0; i < 12; i++) if (P[i].cung === n) return i; return -1; }
  var pNo = cungTen('Nô Bộc'), pTat = cungTen('Tật Ách'), pDi = cungTen('Thiên Di'), pPhuc = cungTen('Phúc Đức');
  var namSinh = I.lunar.year, ds = [];
  var thuTu = [];
  for (var i = 0; i < 12; i++) thuTu.push(i);
  thuTu.sort(function (a, b) { return P[a].daiHan - P[b].daiHan; });
  thuTu.forEach(function (pi, stt) {
    var Pc = P[pi], tu = Pc.daiHan, den = tu + 9;
    if (tu > 100) return;
    var tp = [pi, mod12(pi + 4), mod12(pi + 8), mod12(pi + 6)];
    var nang = 0, giai = 0, dau = [], giaiDs = [], han = [];
    Object.keys(TVCS_HAN_W).forEach(function (n) {
      if (n in T[pi]) { nang += TVCS_HAN_W[n]; han.push({ sao: n, o: 'trong cung', y: TVCS_HAN_Y[n] }); }
      else if (['Địa Không', 'Địa Kiếp', 'Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh', 'Hóa Kỵ', 'Thiên Không'].indexOf(n) >= 0 &&
        tp.slice(1).some(function (q) { return n in T[q]; })) { nang += TVCS_HAN_W[n] * 0.4; han.push({ sao: n, o: 'chiếu', y: TVCS_HAN_Y[n] }); }
    });
    // Thương – Sứ
    if (pi === pTat) { dau.push('Đại vận vào đúng cung Thiên Sứ (Tật Ách): cổ thư dặn giữ sức khỏe, việc cũ đến lúc phải có kết quả.'); }
    if (pi === pNo) { dau.push('Đại vận vào đúng cung Thiên Thương (Nô Bộc): hao tổn, việc của bạn bè – cấp dưới kéo theo phiền; đây là lúc chuyện mới hình thành, còn kịp xử lý.'); }
    if (pi === pDi) { nang += 1.2; dau.push('Đại vận ở Thiên Di – cung luôn bị Thiên Thương và Thiên Sứ kẹp hai bên: ra ngoài, đi xa cần cẩn trọng; chính tinh yếu hoặc gặp sát thì dấu cảnh báo rõ hơn.'); }
    if (stt === 5) dau.push('Đại vận thứ sáu: theo Lưu Uẩn Linh, vận này chắc chắn đi qua cung Thương hoặc Sứ – thường là trung vận, nên chăm lo sức khỏe.');
    var chinhHam = Pc.chinh.filter(function (s) { return TVCS_KY_HAM.indexOf(s.n) >= 0 && s.b === 'H'; }).map(function (s) { return s.n; });
    if ((pi === pNo || pi === pTat || pi === pDi) && chinhHam.length) { nang += 1; dau.push('Chính tinh ' + chinhHam.join(', ') + ' hãm địa ở cung Thương/Sứ/Thiên Di – các phái coi là nặng nhất khi thêm sát hoặc Hóa Kỵ.'); }
    // Giáp
    function giap(a, b) { var l = mod12(pi - 1), r = mod12(pi + 1); return (a in T[l] && b in T[r]) || (a in T[r] && b in T[l]); }
    [['Kình Dương', 'Đà La', 'Kình Đà giáp vận: bị kìm hai đầu', 1], ['Địa Không', 'Địa Kiếp', 'Không Kiếp giáp vận: hao tán bao quanh', 1], ['Hỏa Tinh', 'Linh Tinh', 'Hỏa Linh giáp vận: chuyện bất ngờ', 0.6]].forEach(function (g) {
      if (giap(g[0], g[1])) { nang += g[3]; dau.push(g[2] + '.'); }
    });
    if ('Hóa Kỵ' in T[pi] && giap('Kình Dương', 'Đà La')) { nang += 1; dau.push('Dương Đà giáp Kỵ ngay cung vận: bế tắc dồn dập.'); }
    // Tứ Hóa của can đại vận
    var TH = tv.tuHoa || TU_HOA, dvCan = Pc.can, hoa = TH[dvCan] || [];
    var kyQ = tv.pos[hoa[3]], locQ = tv.pos[hoa[0]];
    var dvKy = null, dvLoc = null;
    if (kyQ != null) {
      dvKy = { sao: hoa[3], cung: P[kyQ].cung };
      if (kyQ === pi) { nang += 1.2; dvKy.y = 'Hóa Kỵ của vận nằm ngay cung vận: mười năm hay vướng.'; }
      else if (kyQ === mod12(pi + 6)) { nang += 1; dvKy.y = 'Hóa Kỵ của vận xung thẳng cung vận.'; }
      else if (kyQ === I.menh) { nang += 0.8; dvKy.y = 'Hóa Kỵ của vận nhập Mệnh gốc: bản thân chịu áp lực.'; }
      else if (kyQ === pTat) { nang += 0.8; dvKy.y = 'Hóa Kỵ của vận nhập Tật Ách: lưu ý sức khỏe.'; }
      else if (kyQ === pPhuc) { nang += 0.5; dvKy.y = 'Hóa Kỵ của vận nhập Phúc Đức: tinh thần nặng nề, lo nghĩ.'; }
      else dvKy.y = 'Hóa Kỵ của vận vào cung ' + P[kyQ].cung + ': việc thuộc cung này hay vướng.';
    }
    if (locQ != null) {
      dvLoc = { sao: hoa[0], cung: P[locQ].cung };
      if (tp.indexOf(locQ) >= 0) { giai += 0.8; dvLoc.y = 'Hóa Lộc của vận vào tam phương cung vận: có nguồn lực bù đắp.'; }
      else dvLoc.y = 'Hóa Lộc của vận vào cung ' + P[locQ].cung + ': lợi đến từ việc của cung này.';
    }
    // Sao giải
    Pc.chinh.forEach(function (s) { if (TVCS_GIAI_CHINH.indexOf(s.n) >= 0 && s.b !== 'H') { giai += 0.9; giaiDs.push(s.n); } });
    TVCS_GIAI.forEach(function (n) { if (n in T[pi]) { giai += n === 'Hóa Khoa' || n === 'Hóa Lộc' || n === 'Lộc Tồn' ? 0.6 : 0.35; giaiDs.push(n); } });
    if (Pc.tuan || Pc.triet) { nang *= 0.85; dau.push('Có ' + (Pc.tuan ? 'Tuần' : 'Triệt') + ': tốt xấu đều giảm bớt, nửa đầu vận hay trắc trở.'); }
    // Bộ sao đặc biệt khi vào hạn
    var bo = tvcsBoSaoCung_(tv, pi).filter(function (b) { return b.ten === 'Linh Xương Đà Vũ' || b.ten === 'Song Không' || b.ten === 'Thiên Không gặp Kiếp' || b.ten === 'Lục sát hội tụ'; });
    bo.forEach(function (b) { nang += 1; dau.push('Bộ "' + b.ten + '" (' + b.cau + ') nằm ở cung vận.'); });
    var diem = Math.round((nang - giai * 0.8) * 10) / 10;
    var muc = diem < 1.5 ? 'Êm' : diem < 3.5 ? 'Cần để ý' : diem < 6 ? 'Nặng' : 'Rất nặng';
    // Năm hệ trọng trong vận
    var nam = [];
    for (var t = tu; t <= den; t++) {
      var y = namSinh + t - 1, ch = mod12(y + 8), tq = -1;
      for (var q = 0; q < 12; q++) if (P[q].tieuHanChi === ch) tq = q;
      var ly = [];
      if ((pi === pNo && tq === pTat) || (pi === pTat && tq === pNo)) ly.push('đại vận và tiểu hạn mỗi bên gặp một sao Thương/Sứ ("đại tiểu nhị hạn các đắc kỳ nhất")');
      var tqSat = tq >= 0 && TVCS_SAT.concat(['Hóa Kỵ', 'Thiên Không']).some(function (n) { return n in T[tq]; });
      if ((tq === pNo || tq === pTat || tq === pDi) && diem >= 3.5 && tqSat) ly.push('tiểu hạn vào ' + P[tq].cung + ' (có sát tinh) giữa vận nặng');
      if ((ch === pNo || ch === pTat) && (pi === pNo || pi === pTat || pi === pDi)) ly.push('Thái Tuế năm đóng ở cung ' + P[ch].cung + ' (Thương/Sứ)');
      if (tq >= 0 && 'Thiên Không' in T[tq] && ('Địa Không' in T[tq] || 'Địa Kiếp' in T[tq])) ly.push('tiểu hạn gặp Thiên Không cùng Không/Kiếp');
      if (tq >= 0 && 'Hóa Kỵ' in T[tq] && (TVCS_SAT.some(function (n) { return n in T[tq]; }))) ly.push('tiểu hạn gặp Hóa Kỵ và sát tinh');
      if (ly.length) nam.push({ nam: y, tuoi: t, canChi: canChiText(mod10(y + 6), ch), tieuHan: tq >= 0 ? P[tq].cung : '', ly: ly });
    }
    ds.push({ stt: stt + 1, tu: tu, den: den, tuNam: namSinh + tu - 1, denNam: namSinh + den - 1, cung: Pc.cung, chi: CHI[pi], canChi: Pc.canTen + ' ' + Pc.chiTen,
      chinh: Pc.chinh.map(function (s) { return s.n + (s.b ? ' (' + s.b + ')' : ''); }).join(', ') || 'Vô chính diệu',
      hienTai: pi === I.daiHanNow, han: han, dau: dau, giai: giaiDs, dvKy: dvKy, dvLoc: dvLoc, diem: diem, muc: muc, nam: nam });
  });
  return ds;
}

/* ---------- 3. Thọ khí ---------- */
function tvcsTho_(tv, dv) {
  var P = tv.palaces, I = tv.info, T = P.map(tvcsTen_), cong = [], tru = [];
  function cungTen(n) { for (var i = 0; i < 12; i++) if (P[i].cung === n) return i; return -1; }
  var ba = [['Mệnh', I.menh], ['Phúc Đức', cungTen('Phúc Đức')], ['Tật Ách', cungTen('Tật Ách')]];
  var diem = 0;
  function them(d, txt) { diem += d; (d >= 0 ? cong : tru).push({ d: Math.round(d * 10) / 10, y: txt }); }
  ba.forEach(function (b) {
    var pi = b[1], Pc = P[pi];
    var sang = Pc.chinh.filter(function (s) { return s.b === 'M' || s.b === 'V' || s.b === 'Đ'; }).map(function (s) { return s.n; });
    var ham = Pc.chinh.filter(function (s) { return s.b === 'H'; }).map(function (s) { return s.n; });
    if (sang.length) them(0.8, b[0] + ': chính tinh sáng (' + sang.join(', ') + ').');
    if (ham.length) them(-0.8, b[0] + ': chính tinh hãm (' + ham.join(', ') + ').');
    if (!Pc.chinh.length) them(-0.3, b[0] + ' vô chính diệu – sức chống đỡ dựa vào cung xung chiếu.');
    ['Thiên Thọ', 'Thiên Lương', 'Thiên Đồng', 'Lộc Tồn', 'Tử Vi', 'Thiên Phủ', 'Hóa Khoa', 'Thiên Giải', 'Địa Giải', 'Giải Thần', 'Thiên Đức', 'Nguyệt Đức', 'Thiên Y'].forEach(function (n) {
      if (n in T[pi]) them(n === 'Thiên Thọ' || n === 'Thiên Lương' ? 0.9 : 0.4, b[0] + ' có ' + n + (n === 'Thiên Thọ' ? ' (sao thọ)' : n === 'Thiên Lương' ? ' (sao "ấm" – thọ, che chở)' : '') + '.');
    });
    var sat = TVCS_SAT.concat(['Hóa Kỵ', 'Thiên Hình', 'Thiên Không']).filter(function (n) { return n in T[pi]; });
    if (sat.length) them(-0.5 * sat.length, b[0] + ' gặp ' + sat.join(', ') + '.');
    if (Pc.tuan || Pc.triet) them(-0.3, b[0] + ' gặp ' + (Pc.tuan ? 'Tuần' : 'Triệt') + ' – tuổi nhỏ yếu hơn, càng lớn càng vững.');
    var ts = Pc.trangSinh;
    if (ts === 'Tràng Sinh' || ts === 'Đế Vượng' || ts === 'Lâm Quan' || ts === 'Quan Đới') them(0.5, b[0] + ' ở vòng Tràng Sinh: ' + ts + ' – sinh khí mạnh.');
    if (ts === 'Bệnh' || ts === 'Tử' || ts === 'Tuyệt') them(-0.5, b[0] + ' ở vòng Tràng Sinh: ' + ts + ' – sinh khí yếu.');
  });
  var qh = quanHeHanh(I.cucHanh, I.banMenh.hanh);
  if (qh === 'sinh') them(0.6, 'Cục sinh bản Mệnh – hoàn cảnh nuôi dưỡng thân.');
  if (qh === 'khac') them(-0.6, 'Cục khắc bản Mệnh – cổ thư coi là hao tổn thể lực, phải giữ gìn.');
  if (I.menh === tv.info.than) them(0.2, 'Mệnh Thân đồng cung – nội lực tập trung.');
  if (I.thanCu === 'Phúc Đức') them(0.5, 'Thân cư Phúc Đức – cổ thư coi là dấu hiệu hưởng phúc, sống lâu.');
  var muc = diem >= 3 ? 'Dồi dào' : diem >= 1 ? 'Khá' : diem >= -1 ? 'Vừa' : 'Cần giữ gìn';
  var moc = (dv || []).filter(function (d) { return d.muc === 'Nặng' || d.muc === 'Rất nặng'; }).map(function (d) {
    return { tu: d.tu, den: d.den, tuNam: d.tuNam, denNam: d.denNam, cung: d.cung, muc: d.muc, nam: d.nam.map(function (n) { return n.nam; }) };
  });
  return { muc: muc, diem: Math.round(diem * 10) / 10, cong: cong, tru: tru, moc: moc,
    cach: 'Cổ thư xem dương thọ qua ba cung Mệnh (gốc), Phúc Đức ("thọ nguyên") và Tật Ách (thân thể); cộng sao thọ – sao giải, trừ sát tinh và Hóa Kỵ; xét Cục sinh hay khắc bản Mệnh và vòng Tràng Sinh. Giai đoạn cần giữ gìn lấy từ các đại vận "Nặng / Rất nặng" ở trên.',
    luuY: 'Đây là cách đọc theo cổ học để tự nhắc mình chăm lo sức khỏe đúng lúc. Không có phương pháp nào biết trước tuổi thọ; sức khỏe thật do lối sống, khám định kỳ và lời bác sĩ quyết định.' };
}

/* ---------- 4. Bản công khai cho luận theo trình tự 26 bước (mọi người xem) ----------
   Văn dễ hiểu không nêu tên sao; tên sao, câu phú nằm ở "ky" (căn cứ). Sao hạn đại vận viết nhẹ nhàng, không có mức "Rất nặng";
   vận chưa mở khóa bị ttCatPhan_ (ThanhToan.gs) cắt còn khung. Thọ khí KHÔNG đưa ra bản công khai. */
/** Lời dễ hiểu (không tên sao) cho từng bộ sao – chuyên gia content-creator viết 25/10, dùng trong 26 bước công khai */
var TVCS_BO_SAO_DE = {
  "Tử Phủ đồng cung": {"de": "Ở mảng đời sống này, bạn có xu hướng vừa muốn tự mình cầm lái, vừa biết giữ những gì đã gây dựng. Mặt tốt: nền móng vững, dễ được tin cậy, đời sống đủ đầy dần theo thời gian. Mặt xấu: hay ôm hết việc vào mình, tự mãn sớm, thiếu người giỏi bên cạnh thì chỉ dừng ở mức an toàn và dễ bị người khác vượt qua.", "khuyen": "Chia bớt việc cho người đáng tin và giữ thói quen học thêm."},
  "Tử Tướng ở Thìn Tuất": {"de": "Ở mảng đời sống này, bạn có tố chất dẫn dắt nhưng hay bị khuôn khổ, nguyên tắc hoặc người phía trên giữ chân. Mặt tốt: bạn có tư cách, được nể trọng, làm việc có nề nếp. Mặt xấu: giỏi mà chưa gặp thời, công sức bị nhìn nhận thấp hơn thực tế, có giai đoạn dài thấy mình bị kìm và bức bối.", "khuyen": "Rèn nghề trong một tổ chức có nền nếp trước khi tính chuyện tự đứng riêng."},
  "Tử Sát ở Tỵ Hợi": {"de": "Bạn thuộc mẫu người quyết đoán, dám nhận việc khó và trách nhiệm lớn ở mảng đời sống này. Mặt tốt: bạn đứng mũi chịu sào được, người khác dựa vào bạn lúc khó. Mặt xấu: quyết liệt dễ thành độc đoán, người xung quanh thấy bị áp đảo, ngại góp ý, và khi sai thì sai lớn vì ít ai dám cản.", "khuyen": "Trước quyết định lớn, hỏi ý người làm cùng và cấp dưới."},
  "Tử Phá ở Sửu Mùi": {"de": "Ở mảng đời sống này, bạn mang hoài bão lớn, thích đổi mới, không ngại đi khác lối mòn. Mặt tốt: bạn mở đường được, dám cải tổ cái cũ. Mặt xấu: đời nhiều lần phải bắt đầu lại từ đầu, việc dễ dang dở, tiền và công sức hao theo mỗi lần đổi hướng.", "khuyen": "Tìm một người giỏi giữ nhịp, theo dõi tiến độ việc mình khởi xướng."},
  "Tử Tham ở Mão Dậu": {"de": "Bạn có xu hướng duyên dáng, khéo giao tiếp, dễ được yêu mến ở mảng đời sống này. Mặt tốt: sức hút giúp bạn mở được nhiều cửa, hợp nghệ thuật và việc cần giao tế. Mặt xấu: dễ sa vào hưởng thụ, tình cảm nhiều ngả, tốn tiền và mất uy tín vì những cuộc vui hoặc mối quan hệ không rõ ràng.", "khuyen": "Đặt vài nguyên tắc rõ cho chuyện vui chơi và tình cảm."},
  "Quân thần khánh hội": {"de": "Bạn thuộc mẫu người dễ được người giỏi tìm đến giúp sức ở mảng đời sống này. Mặt tốt: làm việc lớn có đội ngũ đáng tin bên cạnh. Mặt xấu: quen dựa vào người giúp nên khi đội ngũ tan thì chững lại; không biết chia quyền thì người giỏi bỏ đi.", "khuyen": "Giao việc rõ ràng và ghi nhận công sức người giúp mình."},
  "Tử Vi cô quân": {"de": "Ở mảng đời sống này, bạn có chí lớn nhưng hay phải tự gánh vác, ít người kề vai. Mặt tốt: bạn tự quyết được, không phụ thuộc ai. Mặt xấu: lẻ loi khi đứng trước quyết định hệ trọng, dễ quyết sai vì không ai góp ý, và có giai đoạn cô đơn thật sự trên vị trí của mình.", "khuyen": "Tìm một người cố vấn đáng tin; tránh chốt việc lớn khi đang bị tách lẻ."},
  "Phủ gặp Lộc – kho đầy": {"de": "Bạn thuộc mẫu người giỏi tích lũy và biết giữ những gì mình có ở mảng đời sống này. Mặt tốt: tiền bạc, công sức được vun dần thành vốn liếng bền. Mặt xấu: dè dặt quá mức nên lỡ dịp tốt, có lúc keo kiệt với chính mình và người thân, giữ của mà sống không thoải mái.", "khuyen": "Dành một phần nhỏ cho việc học và mở rộng."},
  "Không khố – lộ khố": {"de": "Ở mảng đời sống này, tiền bạc hay công sức của bạn có xu hướng đến rồi đi, khó giữ lại lâu. Mặt xấu: phải tự tay gây dựng nhiều hơn người khác, dễ hụt khi có việc gấp, có giai đoạn trắng tay vì chi tiêu, cho vay hoặc đầu tư sai. Mặt tốt: bạn không bám của, mất rồi vẫn gây dựng lại được.", "khuyen": "Lập quỹ dự phòng, tách tiền giữ và tiền tiêu; không đứng ra bảo lãnh."},
  "Phủ Tướng triều viên": {"de": "Bạn thuộc mẫu người đáng tin, thường được giao những việc cần sự chu đáo ở mảng đời sống này. Mặt tốt: cơm áo đủ đầy nhờ uy tín tích lũy. Mặt xấu: được giao nhiều nên dễ ôm trách nhiệm của người khác; chỉ một lần thất hứa là mất phần lớn chỗ dựa.", "khuyen": "Giữ chữ tín trong từng việc nhỏ và nhận việc vừa sức."},
  "Vũ Phủ ở Tý Ngọ": {"de": "Bạn thuộc mẫu người thực tế, vừa biết kiếm vừa biết giữ tiền ở mảng đời sống này. Mặt tốt: tính toán chắc, ít khi bị động về tài chính. Mặt xấu: quá chú trọng được mất nên người thân thấy lạnh, xa cách; có lúc vì tiền mà bỏ qua tình nghĩa.", "khuyen": "Dành chỗ cho tình cảm và sự sẻ chia bên cạnh tính toán."},
  "Vũ Tướng ở Dần Thân": {"de": "Bạn có xu hướng làm ăn đứng đắn, giữ uy tín, thường được tin giao quản lý tiền bạc hay việc hệ trọng ở mảng đời sống này. Mặt tốt: người khác thấy bạn đáng tin, nghiêm túc. Mặt xấu: nhận lời giúp nhiều người nên vất vả vì việc của người khác, có khi chịu thiệt cả tiền lẫn sức.", "khuyen": "Nói rõ giới hạn trách nhiệm ngay từ đầu."},
  "Vũ Tham ở Sửu Mùi": {"de": "Bạn có xu hướng thành công muộn mà chắc ở mảng đời sống này. Mặt tốt: đầu óc kinh doanh tốt, sức bền đáng nể, càng về sau càng vững. Mặt xấu: giai đoạn đầu thật sự vất vả, thiếu thốn, dễ nản hoặc làm liều để giàu nhanh rồi thua lỗ.", "khuyen": "Tích lũy đều và học nghề thật vững ở giai đoạn đầu."},
  "Vũ Sát ở Mão Dậu": {"de": "Ở mảng đời sống này, bạn theo đuổi mục tiêu rất quyết liệt, nhất là chuyện tiền bạc. Mặt tốt: dám làm, làm được việc khó. Mặt xấu: dễ va chạm, mất tiền vì quyết vội, vướng tranh chấp hợp đồng hoặc gặp tai nạn khi làm việc với máy móc, dao kéo.", "khuyen": "Đọc kỹ hợp đồng, không vay mượn gấp, luôn giữ an toàn khi làm việc nặng."},
  "Vũ Phá ở Tỵ Hợi": {"de": "Ở mảng đời sống này, bạn có xu hướng kiếm được nhiều nhưng chi ra cũng nhiều, tiền khó đọng lại. Mặt tốt: tinh thần tự lập cao, dám rời nơi quen để tự tìm đường. Mặt xấu: hao tán liên tục, xa gốc gác, có giai đoạn tay trắng sau một thời gian làm ra nhiều tiền.", "khuyen": "Để riêng một khoản tiết kiệm bắt buộc mỗi tháng."},
  "Liêm Phủ ở Thìn Tuất": {"de": "Bạn thuộc mẫu người có nguyên tắc và biết giữ gìn ở mảng đời sống này. Mặt tốt: làm việc có quy củ, mọi thứ ổn định, ít xáo trộn. Mặt xấu: cứng nhắc trước thay đổi, chậm thích nghi nên dễ bị bỏ lại khi hoàn cảnh đổi.", "khuyen": "Giữ nguyên tắc nhưng sẵn lòng điều chỉnh khi tình hình thay đổi."},
  "Liêm Sát ở Sửu Mùi": {"de": "Bạn có xu hướng chịu thương chịu khó, gom góp từng chút mà dần thành vững ở mảng đời sống này. Mặt tốt: cứng cỏi, đi đường dài ít khi bỏ cuộc. Mặt xấu: quen gồng gánh nên làm quá sức, sức khỏe hao mòn dần mà không để ý, ít thời gian cho người thân.", "khuyen": "Đặt lịch nghỉ rõ ràng như lịch làm việc."},
  "Liêm Tham ở Tỵ Hợi": {"de": "Ở mảng đời sống này, bạn có xu hướng ham vui, dễ bị cuốn vào cuộc chơi hay mối giao tình phức tạp. Mặt tốt: cởi mở, giao tiếp rộng, dễ kết thân. Mặt xấu: dễ sa đà, vướng điều tiếng, mất tiền hoặc dính rắc rối giấy tờ, pháp lý vì thiếu tỉnh táo.", "khuyen": "Giữ ranh giới rõ trong tình cảm và tiền bạc; giấy tờ làm đúng quy định."},
  "Liêm Phá ở Mão Dậu": {"de": "Ở mảng đời sống này, bạn thích mạo hiểm, dám liều để thử điều mới. Mặt tốt: gan dạ, hợp việc cần dũng khí. Mặt xấu: đời nhiều lên xuống, dễ va chạm, đổ vỡ và gặp rủi ro thân thể khi liều quá tay.", "khuyen": "Hướng sự gan dạ vào việc cần dũng khí và luôn giữ an toàn."},
  "Hình tù giáp ấn": {"de": "Ở mảng đời sống này, bạn có xu hướng dễ dính đến quy định, kỷ luật hoặc thủ tục pháp lý. Mặt xấu: một sơ suất nhỏ về giấy tờ cũng có thể gây phiền phức lớn, có khi bị kỷ luật hoặc kiện tụng. Mặt tốt: sự nhạy với luật lệ có thể thành thế mạnh nghề nghiệp (luật, kiểm tra, giám sát).", "khuyen": "Làm đúng quy trình, cất giữ giấy tờ rõ ràng."},
  "Liêm Trinh gặp Hình – Kình": {"de": "Ở mảng đời sống này, bạn có xu hướng dễ rơi vào tranh chấp, kiện tụng hoặc va chạm khi nóng vội. Mặt xấu: tính thẳng và cứng khiến mâu thuẫn bị đẩy lên gay gắt, dễ thiệt cả tiền lẫn thân. Mặt tốt: bạn dám đứng ra bảo vệ lẽ phải.", "khuyen": "Khi có mâu thuẫn, ưu tiên thương lượng trước."},
  "Cơ Âm ở Dần Thân": {"de": "Bạn thuộc mẫu người tinh tế, nhạy cảm và giỏi tính toán ở mảng đời sống này. Mặt tốt: nhiều phương án, nhạy bén, hợp việc kế hoạch, phân tích. Mặt xấu: nghĩ quá nhiều nên mệt và khó chọn, hay đổi chỗ ở, nơi làm, cách làm, khó ổn định lâu.", "khuyen": "Đặt hạn chót cho mỗi lần cân nhắc."},
  "Cự Cơ ở Mão Dậu": {"de": "Bạn thuộc mẫu người ăn nói sắc sảo, giỏi phân tích và lập luận ở mảng đời sống này. Mặt tốt: lời nói là công cụ mạnh, hợp tư vấn, giảng dạy, luật. Mặt xấu: lời sắc làm người nghe phật lòng, dễ gây thù và mất quan hệ vì thắng lý mà thua tình.", "khuyen": "Ghi nhận điểm đúng của người khác trước khi phản biện."},
  "Thiện ấm triều cương": {"de": "Bạn thuộc mẫu người mưu trí, giỏi lý lẽ, thường được che chở lúc cần ở mảng đời sống này. Mặt tốt: có chiều sâu, nghiêng về đạo lý, triết học, đời sống tinh thần. Mặt xấu: bàn nhiều làm ít, dễ chậm hành động nên ý hay mà không thành việc.", "khuyen": "Biến mỗi ý tưởng thành một bước làm cụ thể."},
  "Thủy trừng quế ngạc": {"de": "Bạn thuộc mẫu người nhã nhặn, sống tình cảm, có duyên hưởng sự êm ấm ở mảng đời sống này. Mặt tốt: biết để dành, có của ăn của để theo thời gian. Mặt xấu: thiếu chủ động, ngại va chạm, dễ an phận nên bỏ lỡ cơ hội lớn.", "khuyen": "Giữ thói quen tiết kiệm và chủ động hơn khi có dịp."},
  "Đồng Cự ở Sửu Mùi": {"de": "Ở mảng đời sống này, bạn có xu hướng hay lo nghĩ, giữ nhiều tâm sự trong lòng. Mặt xấu: lời nói dễ bị hiểu sai ý, sinh phiền lòng và hiểu lầm kéo dài; lo âu nhiều làm hao sức. Mặt tốt: bạn suy nghĩ kỹ, ít khi nói bừa.", "khuyen": "Nói chậm, viết rõ những điều hệ trọng."},
  "Đồng Lương ở Dần Thân": {"de": "Bạn thuộc mẫu người hiền hòa, dễ mến, hay được người đi trước che chở ở mảng đời sống này. Mặt tốt: gặp khó thường có người giúp hoặc tìm được lối ra. Mặt xấu: dễ trông chờ vào may mắn và người khác, thiếu chủ động nên khi không có ai đỡ thì lúng túng.", "khuyen": "Giữ thói quen tự lo trước, nhờ giúp sau."},
  "Lương Mã phiêu đãng": {"de": "Bạn có xu hướng yêu tự do, thích đi đây đi đó, khó gắn bó lâu một chỗ ở mảng đời sống này. Mặt tốt: mở mang tầm nhìn, nhiều trải nghiệm. Mặt xấu: thiếu chốn neo đậu, quan hệ và tài sản khó tích lũy, có lúc thấy mình lạc lõng.", "khuyen": "Giữ một nơi chốn hoặc thói quen cố định làm điểm tựa."},
  "Lương Xương – thầy hiền": {"de": "Bạn thuộc mẫu người đoan chính, ham học, có cốt cách người thầy ở mảng đời sống này. Mặt tốt: kiến thức và sự ngay thẳng khiến người khác tìm đến xin lời khuyên. Mặt xấu: dễ thành người hay dạy đời, cứng nhắc theo sách vở, thu nhập từ việc dạy dỗ thường không cao.", "khuyen": "Truyền dạy khi được hỏi, và cập nhật kiến thức thường xuyên."},
  "Cự Nhật ở Dần": {"de": "Bạn thuộc mẫu người có tiếng nói và học vấn giúp tạo danh tiếng ở mảng đời sống này. Mặt tốt: làm sáng tỏ được chuyện rối rắm, được lắng nghe. Mặt xấu: nói nhiều hơn làm thì mất uy tín rất nhanh, dễ bị điều tiếng vì lời nói.", "khuyen": "Luôn làm đúng điều mình đã nói."},
  "Nhật chiếu lôi môn": {"de": "Bạn thuộc mẫu người rạng rỡ, có sức lan tỏa, dễ được kính trọng ở mảng đời sống này. Mặt tốt: tỏa sáng khi đứng trước nhiều người, làm việc vì lợi ích chung. Mặt xấu: lo việc chung nhiều nên hao sức, ít thời gian cho gia đình, và dễ kiêu khi được tung hô.", "khuyen": "Giữ khiêm tốn và giữ thời gian cho người nhà."},
  "Dương Lương Xương Lộc": {"de": "Bạn thuộc mẫu người học đâu chắc đó, có duyên với thi cử, bằng cấp ở mảng đời sống này. Mặt tốt: chữ nghĩa là con đường tạo dựng tên tuổi. Mặt xấu: dễ quá đề cao bằng cấp, lý thuyết hơn thực hành; ngừng học là tụt lại.", "khuyen": "Đầu tư vào bằng cấp đi kèm kinh nghiệm thực tế."},
  "Nhật hãm gặp Kỵ": {"de": "Ở mảng đời sống này, bạn có xu hướng dễ bị hiểu lầm, nhất là với những người đàn ông lớn trong đời như cha, chồng hoặc cấp trên. Mặt xấu: làm tốt mà không được ghi nhận, quan hệ với họ dễ căng, hay mệt mỏi và thức khuya hao sức. Mặt tốt: bạn học được cách tự khẳng định mà không cần dựa vào ai.", "khuyen": "Chủ động trình bày rõ ý mình và hạn chế thức khuya."},
  "Nguyệt hãm gặp Kỵ": {"de": "Ở mảng đời sống này, bạn có xu hướng dễ xao động cảm xúc, tâm trạng lên xuống thất thường. Mặt xấu: chuyện nhà đất hoặc chuyện với những người phụ nữ trong nhà dễ khiến bạn bận lòng, có thể vướng giấy tờ, tranh chấp. Mặt tốt: bạn nhạy cảm, thấu hiểu người khác sâu.", "khuyen": "Kiểm tra kỹ giấy tờ nhà đất trước khi ký."},
  "Thất Sát triều Đẩu": {"de": "Bạn thuộc mẫu người có khí chất lớn, thành công muộn nhưng vững ở mảng đời sống này. Mặt tốt: tầm nhìn xa, đủ bản lĩnh gánh việc khó. Mặt xấu: con đường dài và gian nan, nhiều năm vất vả trước khi có chỗ đứng; thiếu kỷ luật là dễ chệch hướng.", "khuyen": "Rèn kỷ luật bản thân mỗi ngày."},
  "Thất Sát gặp Kình Dương": {"de": "Ở mảng đời sống này, bạn quyết liệt, mạnh mẽ đến mức dễ quá tay. Mặt xấu: dễ va chạm với người khác, gặp sơ suất, thương tích khi vội vàng hoặc nóng giận. Mặt tốt: năng lượng dồi dào, hợp thể thao, kỹ thuật, việc cần sức bền.", "khuyen": "Cẩn thận khi đi đường và dùng dao kéo, máy móc."},
  "Phá Quân gặp Xương Khúc": {"de": "Ở mảng đời sống này, bạn có năng khiếu chữ nghĩa nhưng hay làm dở dang, con đường học hành dễ gián đoạn. Mặt tốt: có văn tài, nhiều hứng khởi với cái mới. Mặt xấu: bắt đầu nhiều mà xong ít, bằng cấp hoặc dự án dễ bỏ ngang; sách xưa còn dặn cẩn trọng nơi sông nước.", "khuyen": "Học theo từng chặng ngắn có đích rõ; bơi lội, đi thuyền luôn có đồ an toàn."},
  "Phá Quân gặp sát": {"de": "Ở mảng đời sống này, bạn mang sức thay đổi rất mạnh. Mặt xấu: dễ gặp đổ vỡ, biến động bất ngờ, mất chỗ dựa vì cắt đứt quá nhanh, có rủi ro thân thể khi làm việc nặng. Mặt tốt: bạn dám làm mới khi người khác còn ngần ngại.", "khuyen": "Đổi mới có kế hoạch, luôn giữ lại một đường lui."},
  "Hỏa Tham / Linh Tham": {"de": "Bạn có xu hướng gặp những dịp phát lên nhanh, có khoản thu bất ngờ ở mảng đời sống này. Mặt tốt: nhạy với thời điểm, dám nắm bắt. Mặt xấu: đến nhanh thì đi cũng nhanh – dễ mất lại phần lớn vì ham thêm, đặt cược tiếp hoặc tiêu xài theo đà.", "khuyen": "Chốt lời đúng lúc và cất riêng một phần."},
  "Phong lưu thái trượng": {"de": "Ở mảng đời sống này, bạn có xu hướng dễ bị cuốn vào chuyện tình cảm hoặc cuộc vui mà lỡ việc chính. Mặt xấu: tốn tiền, mất uy tín, gia đình hoặc công việc bị ảnh hưởng vì những mối quan hệ không rõ ràng. Mặt tốt: sức hút mạnh, dễ được người khác chú ý.", "khuyen": "Sắp xếp việc chính trước, vui chơi sau."},
  "Phiếm thủy đào hoa": {"de": "Bạn thuộc mẫu người duyên dáng, đa tình, giỏi giao tiếp ở mảng đời sống này. Mặt tốt: dễ kết nối, được nhiều người để ý, hợp nghệ thuật, bán hàng. Mặt xấu: tình cảm dễ rối ren, nhiều mối cùng lúc, dễ làm tổn thương người khác và chính mình.", "khuyen": "Chọn lọc các mối thân quen."},
  "Tham Lang gặp Kình Dương": {"de": "Ở mảng đời sống này, bạn mang ham muốn mạnh mẽ. Mặt tốt: hăng hái, dám theo đuổi điều mình muốn. Mặt xấu: vì muốn nhiều mà vướng rắc rối – nợ nần, tranh chấp hoặc quan hệ phức tạp – và khó dừng khi đang đà.", "khuyen": "Tự đặt giới hạn trước khi bắt đầu một cuộc chơi, khoản đầu tư hay mối tình mới."},
  "Thạch trung ẩn ngọc": {"de": "Bạn thuộc mẫu người như viên ngọc trong đá ở mảng đời sống này. Mặt tốt: giá trị nằm ở chiều sâu, càng về sau càng tỏa sáng. Mặt xấu: lúc trẻ ít người nhận ra, dễ bị đánh giá thấp, chịu thiệt thòi và có lúc nghi ngờ chính mình.", "khuyen": "Kiên trì trau dồi, không so sánh mình với người khác."},
  "Cự Môn gặp Kình Đà": {"de": "Ở mảng đời sống này, bạn có xu hướng dễ vướng điều tiếng, tranh cãi hoặc kiện tụng vì lời nói. Mặt xấu: một câu nói vội có thể kéo theo mâu thuẫn dài, mất bạn, mất việc. Mặt tốt: bạn có lý lẽ, dám nói điều người khác ngại nói.", "khuyen": "Nói ít, viết rõ; việc hệ trọng có giấy tờ ghi lại."},
  "Cự Môn hóa Kỵ": {"de": "Ở mảng đời sống này, bạn có xu hướng dễ bị hiểu lầm vì lời nói. Mặt xấu: ý tốt mà người nghe hiểu khác, lời vô tình gây mất lòng hoặc rắc rối, có khi thành chuyện lớn. Mặt tốt: bạn nói thật, không vòng vo.", "khuyen": "Đọc lại tin nhắn, thư từ trước khi gửi."},
  "Tài ấm giáp ấn": {"de": "Bạn có xu hướng được người khác nâng đỡ, cơm áo đủ đầy ở mảng đời sống này. Mặt tốt: khi có việc lớn thường được mời gọi, tin giao. Mặt xấu: được nâng đỡ quen nên khó tự đứng khi người đỡ rút lui, và mang ơn nhiều thì khó từ chối yêu cầu.", "khuyen": "Nhận việc lớn khi được mời và chuẩn bị chu đáo."},
  "Hình Kỵ giáp ấn": {"de": "Ở mảng đời sống này, bạn có xu hướng dễ bị liên lụy, có khi chịu tiếng thay người khác. Mặt xấu: lòng tốt bị đặt vào thế khó, có thể mất tiền vì bảo lãnh hoặc bị kéo vào chuyện pháp lý của người khác. Mặt tốt: bạn trọng nghĩa, được người ngay thẳng tin.", "khuyen": "Không đứng ra bảo lãnh; giữ đủ chứng từ mọi giao dịch."},
  "Tả Hữu đồng cung": {"de": "Bạn thuộc mẫu người hay có người giúp từ nhiều phía ở mảng đời sống này. Mặt tốt: làm gì cũng có người góp tay. Mặt xấu: quen có người giúp nên tự lực kém đi; nợ ân tình nhiều thì khó từ chối khi họ nhờ lại.", "khuyen": "Trả ơn đúng lúc và giữ liên lạc với người từng giúp mình."},
  "Tả Hữu giáp": {"de": "Bạn có xu hướng được người xung quanh hỗ trợ khi cần ở mảng đời sống này. Mặt tốt: hai bên thường có người sẵn lòng đỡ một tay. Mặt xấu: không mở lời thì không ai biết để giúp, và dễ ỷ lại vào sự hỗ trợ.", "khuyen": "Mở lời nhờ giúp khi cần và sẵn lòng giúp lại."},
  "Xương Khúc đồng cung": {"de": "Bạn thuộc mẫu người có năng khiếu chữ nghĩa, học giỏi, khéo diễn đạt ở mảng đời sống này. Mặt tốt: viết, dạy, thi cử đều là thế mạnh. Mặt xấu: dễ thiên về lý thuyết, nói hay hơn làm; khéo chữ quá đôi khi bị cho là không thật.", "khuyen": "Giữ thói quen đọc và viết, đi kèm làm thật."},
  "Xương Khúc giáp": {"de": "Bạn có xu hướng được bao quanh bởi môi trường học thức ở mảng đời sống này. Mặt tốt: dễ tiếp thu, học hỏi từ người giỏi. Mặt xấu: dễ dựa vào hiểu biết của người khác thay vì tự đào sâu.", "khuyen": "Học thêm bất cứ khi nào có dịp."},
  "Xương Khúc gặp Kỵ": {"de": "Ở mảng đời sống này, bạn có xu hướng dễ gặp sai sót trong giấy tờ, chữ ký hoặc thủ tục. Mặt xấu: một chi tiết nhỏ bỏ qua có thể gây thiệt hại hoặc tranh chấp về sau; thi cử, hồ sơ dễ trục trặc. Mặt tốt: biết vậy thì bạn sẽ cẩn thận hơn người khác.", "khuyen": "Đọc kỹ hợp đồng và nhờ người hiểu biết xem lại giấy tờ hệ trọng."},
  "Tọa quý hướng quý": {"de": "Bạn thuộc mẫu người có người nâng đỡ cả trong lẫn ngoài ở mảng đời sống này. Mặt tốt: gặp khó thường có người chỉ đường. Mặt xấu: quen hỏi người trên nên tự quyết kém, và người giúp đổi ý là bạn mất hướng.", "khuyen": "Hỏi người đi trước nhưng tự chịu trách nhiệm quyết định."},
  "Khôi Việt giáp": {"de": "Bạn có xu hướng gặp người giúp từ hai phía ở mảng đời sống này. Mặt tốt: thi cử, xin việc, bước ngoặt lớn thường thuận hơn nhờ có người nâng đỡ. Mặt xấu: dễ chủ quan, chuẩn bị qua loa vì nghĩ sẽ có người lo.", "khuyen": "Chuẩn bị kỹ cho các kỳ thi, buổi phỏng vấn."},
  "Song Lộc": {"de": "Bạn có xu hướng có nhiều nguồn thu, tiền đến từ nhiều ngả ở mảng đời sống này. Mặt tốt: một nguồn trục trặc vẫn còn nguồn khác. Mặt xấu: nhiều nguồn thì dễ rối sổ sách, phân tán sức và chi tiêu theo cảm giác giàu có.", "khuyen": "Ghi chép thu chi rõ ràng cho từng nguồn."},
  "Lộc phùng lưỡng sát": {"de": "Ở mảng đời sống này, bạn có xu hướng có tiền nhưng khó giữ. Mặt xấu: dễ mất tiền vì tin người, cho vay không đòi được, đầu tư theo lời rủ rồi thua lỗ. Mặt tốt: bạn rộng lượng, kiếm ra tiền được.", "khuyen": "Không cho vay lớn, không đầu tư khi chưa tìm hiểu kỹ."},
  "Lộc Kỵ đồng cung": {"de": "Ở mảng đời sống này, bạn có xu hướng được lợi nhưng đi kèm phiền toái. Mặt tốt: cơ hội có lợi vẫn đến. Mặt xấu: mỗi khoản lợi thường kéo theo điều kiện, ràng buộc hoặc rắc rối, có khi cái giá phải trả lớn hơn cái được.", "khuyen": "Trước mỗi khoản lợi, tự hỏi mình phải đánh đổi gì."},
  "Lộc Mã giao trì": {"de": "Bạn có xu hướng càng năng động, càng đi xa thì càng có nhiều dịp kiếm tiền ở mảng đời sống này. Mặt tốt: di chuyển và mở rộng quan hệ mang lại nhiều thuận lợi. Mặt xấu: bôn ba nhiều thì mệt, xa gia đình, tiền đến nhanh nhưng cũng tiêu theo những chuyến đi.", "khuyen": "Mở rộng thị trường nhưng giữ một chỗ dựa ở nhà."},
  "Mã ngộ Không vong": {"de": "Ở mảng đời sống này, bạn có xu hướng bôn ba nhiều nhưng thành tựu chưa tương xứng với công sức. Mặt xấu: đi nhiều mà về tay trắng, tốn tiền, tốn sức cho những chuyến đi hay dự án không thành. Mặt tốt: bạn chịu khó, không ngại dấn thân.", "khuyen": "Đặt mục tiêu cụ thể cho mỗi chuyến đi hay dự án."},
  "Chiết túc mã": {"de": "Ở mảng đời sống này, bạn có xu hướng gặp trắc trở khi đi lại, kế hoạch hay bị thay đổi, dời lịch. Mặt xấu: lỡ việc, mất tiền vì trễ hẹn, có lúc gặp sự cố trên đường. Mặt tốt: bạn quen xoay xở với tình huống bất ngờ.", "khuyen": "Luôn dự phòng thời gian và có kế hoạch thay thế."},
  "Tam Hóa liên châu": {"de": "Bạn thuộc mẫu người có thể đạt được cả tiền bạc, tiếng tăm lẫn vị thế ở mảng đời sống này. Mặt tốt: thời thế thường mở ra những dịp thuận lợi. Mặt xấu: được nhiều thì bị soi nhiều, dễ bị ghen tị và áp lực giữ hình ảnh; chủ quan là mất.", "khuyen": "Chuẩn bị sẵn kiến thức và vốn để nắm dịp tốt."},
  "Khoa Quyền Lộc giáp": {"de": "Bạn có xu hướng được thời thế đẩy lên, có những lời mời, dịp may đến từ xung quanh ở mảng đời sống này. Mặt tốt: dễ được người khác nhìn thấy và tạo điều kiện. Mặt xấu: phụ thuộc vào hoàn cảnh bên ngoài; do dự là lỡ, và dịp đến từ người khác thì cũng có thể bị lấy lại.", "khuyen": "Cân nhắc nhanh khi có lời mời tốt."},
  "Dương Đà giáp Kỵ": {"de": "Ở mảng đời sống này, bạn có xu hướng gặp những trở ngại dồn dập, cảm giác bế tắc khi mọi thứ cùng đến một lúc. Mặt xấu: việc tắc, người ngáng, càng cố gỡ nhanh càng rối, có giai đoạn mất mát thật. Mặt tốt: qua được giai đoạn này, bạn lì và tỉnh hơn hẳn.", "khuyen": "Gỡ từng nút một và bàn với người tin cậy."},
  "Thanh Long gặp Kỵ": {"de": "Bạn có xu hướng từ khó khăn bật ra dịp tốt ở mảng đời sống này. Mặt tốt: trở ngại ban đầu thường lại là bước đệm cho thành công. Mặt xấu: giai đoạn đầu thật sự khó, dễ nản và bỏ cuộc trước khi tới lúc bật lên.", "khuyen": "Ghi lại bài học sau mỗi lần vấp."},
  "Linh Xương Đà Vũ": {"de": "Ở mảng đời sống này, bạn có xu hướng gặp những giai đoạn bế tắc, nặng nề và dễ đưa ra quyết định vội vàng. Sách xưa coi đây là điều cần đặc biệt để ý khi vận hạn tới, tức những quãng thời gian khó khăn theo chu kỳ. Mặt xấu: dễ tuyệt vọng, quyết định dại dột về tiền bạc hoặc bản thân. Mặt tốt: biết trước thì bạn chuẩn bị được người đồng hành.", "khuyen": "Trong giai đoạn khó, không quyết việc lớn một mình và giữ an toàn nơi sông nước."},
  "Lục sát hội tụ": {"de": "Ở mảng đời sống này, bạn có xu hướng gặp nhiều sức ép, cạnh tranh và biến động hơn người khác. Mặt xấu: va chạm, tranh đấu, biến cố đến dồn dập, dễ hao sức và hao tiền. Mặt tốt: bạn được rèn bản lĩnh và sức chịu đựng mà ít người có.", "khuyen": "Chọn công việc cần dũng khí và tập kiềm chế nóng giận."},
  "Song Không": {"de": "Ở mảng đời sống này, bạn có ý tưởng lớn nhưng dễ hụt khi thực hiện. Mặt xấu: tiền bạc dễ trôi, kế hoạch dễ thành viển vông, đầu cơ thì mất. Mặt tốt: đầu óc bay bổng, giàu sáng tạo, hợp nghiên cứu, học hỏi, sáng tác.", "khuyen": "Tránh các khoản đầu cơ rủi ro cao."},
  "Thiên Không gặp Kiếp": {"de": "Ở mảng đời sống này, bạn có xu hướng dễ thiệt vì tin người hoặc kế hoạch đổ vỡ giữa chừng. Mặt xấu: mất tiền, mất công vì người khác, dự án dở dang. Mặt tốt: bạn dám nghĩ khác, có ý tưởng lạ.", "khuyen": "Kiểm chứng trước khi tin và chia nhỏ rủi ro."},
  "Thiên Không gặp đào hoa": {"de": "Ở mảng đời sống này, bạn có xu hướng gặp những mối duyên đến nhanh nhưng cũng dễ tan. Mặt xấu: tình cảm hụt hẫng, dễ tổn thương vì người không thật lòng. Mặt tốt: bạn có sức hút, dễ được để ý.", "khuyen": "Không vội cam kết khi mới quen."},
  "Hoa Cái gặp Không": {"de": "Bạn thuộc mẫu người nghiêng về đời sống tinh thần, nghệ thuật và triết lý ở mảng đời sống này. Mặt tốt: thích ngẫm nghĩ, có chiều sâu. Mặt xấu: dễ tách khỏi đời thường, xa cách người xung quanh, chuyện cơm áo dễ bị xem nhẹ.", "khuyen": "Giữ nhịp sống thường ngày bên cạnh góc riêng để tĩnh tâm."},
  "Lưu Hà Kiếp Sát": {"de": "Ở mảng đời sống này, bạn có xu hướng cần cẩn trọng hơn trong đi lại và các hoạt động có rủi ro. Sách xưa nhắc để ý nơi sông nước và giữ gìn thân thể. Mặt xấu: dễ gặp sự cố, va quệt, mất mát khi chủ quan. Mặt tốt: biết trước để phòng thì rủi ro giảm nhiều.", "khuyen": "Tuân thủ luật giao thông và có đồ bảo hộ khi làm việc rủi ro."},
  "Không Kiếp giáp": {"de": "Ở mảng đời sống này, bạn có xu hướng gặp những khoản chi bất ngờ, tiền bạc dễ vơi. Mặt xấu: hao tán từ nhiều phía, khó giữ được khoản dư. Mặt tốt: bạn quen xoay xở khi thiếu.", "khuyen": "Luôn có quỹ dự phòng và tránh đầu tư mạo hiểm."},
  "Hỏa Linh giáp": {"de": "Ở mảng đời sống này, bạn có xu hướng gặp chuyện bất ngờ và dễ phản ứng nóng nảy. Mặt xấu: bùng lên nhanh khi bị dồn ép, nói và làm điều phải hối hận. Mặt tốt: phản ứng nhanh, xử lý được tình huống gấp.", "khuyen": "Hít thở vài lần trước khi phản ứng."},
  "Tứ Linh (Long Phượng Hổ Cái)": {"de": "Bạn thuộc mẫu người có tiếng tăm, được nhiều người trọng vọng ở mảng đời sống này. Mặt tốt: cốt cách và vẻ ngoài dễ gây thiện cảm. Mặt xấu: danh tiếng kéo theo áp lực giữ hình ảnh, dễ sĩ diện và bị soi xét; một lỗi nhỏ cũng dễ bị đồn lớn.", "khuyen": "Giữ gìn uy tín và cách ứng xử."},
  "Thai Tọa": {"de": "Bạn có xu hướng có chỗ đứng vững, dễ được trao chức danh hoặc vị trí ở mảng đời sống này. Mặt tốt: được tin giao vai trò có trách nhiệm. Mặt xấu: ngồi ghế thì phải gánh trách nhiệm, áp lực và dễ ngại rời vị trí dù đã không còn hợp.", "khuyen": "Làm tốt vai trò hiện tại trước khi nhận thêm."},
  "Quang Quý": {"de": "Bạn có xu hướng nhận được sự giúp đỡ hay ơn huệ bất ngờ ở mảng đời sống này. Mặt tốt: điều tốt thường đến khi bạn không mong đợi. Mặt xấu: dễ trông chờ vào may mắn, và nhận ơn nhiều thì mang nợ ân tình.", "khuyen": "Giúp người khi có thể."},
  "Thai Cáo": {"de": "Bạn có xu hướng được ghi nhận, khen thưởng, có danh dự ở mảng đời sống này. Mặt tốt: cố gắng thường được nhìn thấy. Mặt xấu: dễ làm vì thành tích, coi trọng danh hơn thực, buồn khi không được khen.", "khuyen": "Kiên trì làm tốt từng việc, không chạy theo khen thưởng."},
  "Khốc Hư ở Tý Ngọ": {"de": "Bạn thuộc mẫu người từng trải, biến buồn lo thành chiều sâu và tiếng nói có sức nặng ở mảng đời sống này. Mặt tốt: lời bạn nói được lắng nghe vì có trải nghiệm thật. Mặt xấu: con đường đến đó thường qua nhiều nỗi buồn, mất mát; nỗi buồn cũ có lúc trở lại.", "khuyen": "Chia sẻ trải nghiệm với người khác."},
  "Khốc Hư": {"de": "Ở mảng đời sống này, bạn có xu hướng hay buồn lo, cảm thấy trống trải trong lòng. Mặt xấu: nỗi buồn dễ kéo dài, ảnh hưởng giấc ngủ, sức khỏe và công việc; có giai đoạn thấy cô đơn thật sự. Mặt tốt: bạn nhạy cảm, hiểu nỗi buồn của người khác.", "khuyen": "Giữ liên lạc với người thân và vận động đều; buồn kéo dài thì tìm người có chuyên môn."},
  "Tang Hổ": {"de": "Ở mảng đời sống này, bạn có xu hướng cần để ý hơn đến chuyện buồn trong gia đình, chuyện tranh chấp hoặc an toàn khi đi lại, nhất là trong giai đoạn vận hạn, tức quãng thời gian khó khăn theo chu kỳ. Mặt xấu: dễ có tin buồn, kiện tụng hoặc sự cố trên đường. Mặt tốt: biết trước thì bạn chăm lo được người thân, nhất là người lớn tuổi.", "khuyen": "Thường xuyên thăm hỏi người lớn tuổi và cẩn thận khi đi xa."},
  "Tam minh Đào Hồng Hỷ": {"de": "Bạn thuộc mẫu người có duyên, được nhiều người yêu mến, thường có nhiều niềm vui ở mảng đời sống này. Mặt tốt: dễ kết nối, nhiều chuyện vui. Mặt xấu: nhiều người để ý thì dễ rối chuyện tình cảm, ghen tuông, và tốn kém cho các cuộc vui.", "khuyen": "Chọn lọc những mối thân quen thật sự đáng giữ."},
  "Hình Riêu Y": {"de": "Bạn có xu hướng dễ thấu hiểu nỗi khó của người khác và muốn giúp họ vượt qua ở mảng đời sống này. Mặt tốt: có năng khiếu với nghề chăm sóc, chữa trị. Mặt xấu: dễ ôm nỗi đau của người khác, kiệt sức, và lơ là sức khỏe của chính mình.", "khuyen": "Dành thời gian nghỉ ngơi cho bản thân."},
  "Cô Quả": {"de": "Ở mảng đời sống này, bạn có xu hướng tự lo liệu một mình, có lúc thấy lẻ loi. Mặt tốt: tự lập, ít phải nhờ vả ai. Mặt xấu: khó mở lòng, ít người hiểu mình, có giai đoạn cô đơn kéo dài kể cả khi có người bên cạnh.", "khuyen": "Tham gia một nhóm có cùng sở thích."}
};
// Nhãn đo "những điều cần phòng" (khác điểm tốt/xấu chung của đại vận ở bước 26 – một vận tốt vẫn có thể có điều cần phòng)
var TVCS_MUC_CONG = { 'Êm': 'Ít điều cần phòng', 'Cần để ý': 'Có vài điều cần để ý', 'Nặng': 'Nên thận trọng', 'Rất nặng': 'Cần thận trọng nhiều' };
var TVCS_HAN_DE = {
  'Thiên Không': 'hụt kỳ vọng, vì tin người mà mất tiền hoặc đổ kế hoạch', 'Thiên Thương': 'hao tổn, việc của bạn bè hay người dưới quyền kéo theo phiền',
  'Thiên Sứ': 'những việc tồn đọng lâu đến lúc phải có kết quả, kể cả kết quả xấu, kèm sức khỏe đi xuống', 'Địa Không': 'hao tiền, theo đuổi ý tưởng xa thực tế',
  'Địa Kiếp': 'thay đổi đột ngột, mất mát về tiền bạc, công việc', 'Kình Dương': 'va chạm, tranh chấp, sơ suất thân thể', 'Đà La': 'việc chậm, dây dưa',
  'Hỏa Tinh': 'chuyện bột phát, dễ nóng vội', 'Linh Tinh': 'chuyện âm ỉ rồi bất ngờ bùng lên', 'Hóa Kỵ': 'việc vướng mắc, bị hiểu lầm',
  'Thiên Hình': 'chuyện giấy tờ, kỷ luật, quy định', 'Tang Môn': 'chuyện buồn, tin không vui trong gia đình', 'Bạch Hổ': 'sự cố đi lại, kiện tụng, tranh chấp'
};
var TVCS_KHUYEN_CONG = {
  'Êm': 'Mặt trái của giai đoạn êm là dễ chủ quan. Gợi ý: đây là lúc làm những việc đã ấp ủ.',
  'Cần để ý': 'Gợi ý: làm việc lớn thì chia nhỏ bước đi, giữ một khoản dự phòng.',
  'Nặng': 'Giai đoạn này dễ mất tiền, sứt mẻ quan hệ hoặc sức khỏe sa sút nếu liều. Gợi ý: không bảo lãnh, không vay mượn lớn.',
  'Rất nặng': 'Giai đoạn này nhiều rủi ro thật về tiền bạc, sức khỏe và gia đình. Gợi ý: giữ thế thủ, việc lớn bàn với người tin cậy trước khi quyết.'
};
function tvcsBoSaoCong_(tv) {
  var DE = typeof TVCS_BO_SAO_DE !== 'undefined' ? TVCS_BO_SAO_DE : {}, out = {}, P = tv.palaces;
  for (var pi = 0; pi < 12; pi++) {
    out[P[pi].cung] = tvcsBoSaoCung_(tv, pi).filter(function (b) { return DE[b.ten]; }).map(function (b) {
      return { ten: b.ten, loai: b.loai, cau: b.cau, de: DE[b.ten].de, khuyen: DE[b.ten].khuyen };
    });
  }
  return out;
}
function tvcsSaoHanCong_(tv) {
  return tvcsDaiVan_(tv).map(function (v) {
    var trong = v.han.filter(function (h) { return h.o === 'trong cung' && TVCS_HAN_DE[h.sao]; }).map(function (h) { return TVCS_HAN_DE[h.sao]; });
    var de = 'Từ ' + v.tu + ' đến ' + v.den + ' tuổi (' + v.tuNam + '–' + v.denNam + '), xét riêng những điều cần phòng: ' + TVCS_MUC_CONG[v.muc].toLowerCase() + '.';
    if (trong.length) de += ' Bạn có xu hướng gặp ' + trong.slice(0, 3).join('; ') + '.';
    if (v.cung === 'Thiên Di') de += ' Đây là giai đoạn ra ngoài, đi xa nhiều: có cơ hội bên ngoài nhưng cũng dễ có sự cố khi di chuyển.';
    if (v.cung === 'Tật Ách') de += ' Giai đoạn sức khỏe dễ sa sút, bệnh cũ dễ trở lại; nên khám định kỳ, hỏi bác sĩ khi có dấu hiệu lạ.';
    if (v.cung === 'Nô Bộc') de += ' Bạn bè, cộng sự dễ kéo theo phiền hoặc gây thiệt; việc chung cần giấy tờ rõ ràng.';
    if (v.giai.length) de += trong.length || v.muc !== 'Êm' ? ' Mặt tốt: giai đoạn này có người nâng đỡ khi gặp khó.' : ' Giai đoạn này có người nâng đỡ, dễ gặp người giúp.';
    de += ' ' + TVCS_KHUYEN_CONG[v.muc];
    var ky = v.han.map(function (h) { return h.sao + ' (' + h.o + ')'; });
    return { tu: v.tu, den: v.den, tuNam: v.tuNam, denNam: v.denNam, cung: v.cung, hienTai: v.hienTai, muc: TVCS_MUC_CONG[v.muc], huong: v.muc === 'Êm' ? 'tot' : v.muc === 'Cần để ý' ? 'vua' : 'xau',
      de: de, nam: v.nam.map(function (n) { return n.nam; }),
      ky: 'Cung ' + v.cung + ' (' + v.canChi + '; ' + v.chinh + ')' + (ky.length ? ' – sao hạn: ' + ky.join(', ') : '') + (v.giai.length ? ' – sao giải: ' + v.giai.join(', ') : '') + (v.dvKy ? ' – ' + v.dvKy.sao + ' hóa Kỵ vào ' + v.dvKy.cung : '') + '.' };
  });
}

/** Gói toàn bộ (dùng cho kiểm thử và cho hàm máy chủ) */
function tvcsLap_(tv) {
  var dv = tvcsDaiVan_(tv);
  return { ten: tv.info.name, gioi: tv.info.gender, namSinh: tv.info.lunar.year, namCanChi: tv.info.namCanChi, cuc: tv.info.cuc, banMenh: tv.info.banMenh.ten,
    boSao: tvcsBoSao_(tv), daiVan: dv, tho: tvcsTho_(tv, dv), nguon: TVCS_NGUON };
}

/** API công khai cho tab Tham khảo: thư viện bộ sao (không cần lá số) + bảng nghề nghiệp */
function thamKhaoTuVi() {
  return {
    boSao: TVCS_BO_SAO.map(function (r) { return { ten: r.ten, loai: r.loai, cau: r.cau || '', y: r.y, huong: r.huong || '', dk: tvcsDieuKien_(r) }; }),
    nghe: typeof TVCS_NGHE !== 'undefined' ? TVCS_NGHE : [],
    nguon: TVCS_NGUON
  };
}

/** API cho giao diện: chỉ chủ sở hữu */
function tuViChuSoHuu(input, token) {
  tkCan_(token, true);
  return tvcsLap_(tuviLapLaSo_(input || {}));
}
