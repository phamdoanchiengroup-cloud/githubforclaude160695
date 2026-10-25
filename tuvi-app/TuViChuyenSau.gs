/**
 * ============================================================
 *  TuViChuyenSau.gs — LUẬN TỬ VI CHUYÊN SÂU (CHỈ CHỦ SỞ HỮU)
 *  Tab "👑 Lá số chủ sở hữu" (yêu cầu của chủ dự án 25/10/2026):
 *   1. Bộ sao (tổ hợp chính tinh – phụ tinh) ở từng cung: đồng cung, tam phương tứ chính, giáp cung.
 *   2. Mười hai đại vận soi sao hạn: Thiên Không, Thiên Thương – Thiên Sứ (giáp Thiên Di), Không Kiếp,
 *      tứ sát, Hóa Kỵ gốc và Hóa Kỵ của can đại vận, Tang Hổ…; sao giải; các năm hệ trọng trong vận.
 *   3. Thọ khí (cách cổ thư xem dương thọ): Mệnh – Phúc Đức – Tật Ách, sao thọ, sát tinh, Cục – Mệnh,
 *      vòng Tràng Sinh; chỉ nêu mức và các giai đoạn cần giữ gìn, KHÔNG đoán tuổi mất.
 *  Chỉ đọc sao đã an trong tuviLapLaSo (TuVi.gs), không an lại. Máy chủ chặn người không phải chủ sở hữu.
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
    y: 'Đế tinh và kho trời cùng ngồi: nền tảng vững, vừa có chí làm chủ vừa biết giữ của.', huong: 'Cần Tả Hữu, Xương Khúc hoặc Lộc mới thật quý; tránh tự mãn, ôm việc một mình.' },
  { ten: 'Tử Tướng ở Thìn Tuất', d: ['Tử Vi', 'Thiên Tướng'], loai: 'trung', cau: 'Tử Tướng Thìn Tuất – Thiên La Địa Võng',
    y: 'Có tư cách lãnh đạo nhưng hay bị khuôn khổ, người trên kìm giữ; dễ "giỏi mà chưa gặp thời".', huong: 'Gặp Tả Hữu, Xương Khúc thì thoát lưới; nên bền bỉ trong tổ chức lớn trước khi tự đứng.' },
  { ten: 'Tử Sát ở Tỵ Hợi', d: ['Tử Vi', 'Thất Sát'], loai: 'cat', cau: 'Tử Vi Thất Sát, hóa sát vi quyền',
    y: 'Sát khí được đế tinh chế thành quyền: quyết đoán, dám nhận trách nhiệm lớn.', huong: 'Gặp Kình Đà Không Kiếp thì quyền dễ thành độc đoán; nên lắng nghe người dưới.' },
  { ten: 'Tử Phá ở Sửu Mùi', d: ['Tử Vi', 'Phá Quân'], loai: 'trung', cau: 'Tử Phá Sửu Mùi',
    y: 'Tham vọng lớn, thích phá cách, đổi mới; đời nhiều lần làm lại từ đầu.', huong: 'Hợp vai mở đường, cải tổ; cần người giữ nhịp bên cạnh để không bỏ dở.' },
  { ten: 'Tử Tham ở Mão Dậu', d: ['Tử Vi', 'Tham Lang'], loai: 'trung', cau: 'Đào hoa phạm chủ',
    y: 'Đế tinh vướng đào hoa: duyên dáng, giỏi giao tế nhưng dễ sa vào hưởng thụ, tình cảm phức tạp.', huong: 'Gặp Địa Không, Địa Kiếp hoặc Tuần Triệt lại thanh cao (hợp tu học, nghệ thuật); nên giữ chừng mực.' },
  { ten: 'Quân thần khánh hội', d: ['Tử Vi'], h: ['Tả Phù', 'Hữu Bật'], loai: 'cat', cau: 'Quân thần khánh hội',
    y: 'Tử Vi có Tả Hữu chầu: được người tài theo giúp, làm việc lớn có bộ sậu.', huong: 'Biết dùng người, chia quyền thì càng lên.' },
  { ten: 'Tử Vi cô quân', d: ['Tử Vi'], loai: 'hung', cau: 'Tử Vi vô Tả Hữu, vi cô quân',
    kc: function (c) { return !c.coH('Tả Phù') && !c.coH('Hữu Bật') && c.demH(TVCS_SAT) >= 2; },
    y: 'Đế tinh không có người phò, lại gặp sát: có chí lớn mà lẻ loi, dễ đơn độc khi quyết.', huong: 'Chủ động kết đồng minh, tìm cố vấn; tránh quyết lớn khi đang bị cô lập.' },
  // ---- Thiên Phủ ----
  { ten: 'Phủ gặp Lộc – kho đầy', d: ['Thiên Phủ'], motH: ['Lộc Tồn', 'Hóa Lộc'], loai: 'cat', cau: 'Thiên Phủ phùng Lộc',
    y: 'Kho có lộc vào: giỏi tích lũy, giữ tài sản bền.', huong: 'Hợp tài chính, quản trị, bất động sản.' },
  { ten: 'Không khố – lộ khố', d: ['Thiên Phủ'], loai: 'hung', cau: 'Thiên Phủ ngộ Không – không khố',
    kc: function (c) { return c.co('Địa Không') || c.co('Địa Kiếp') || c.tuan || c.triet; },
    y: 'Kho trời gặp Không Kiếp hoặc Tuần Triệt: kho rỗng, tiền vào rồi ra, phải tự gây dựng.', huong: 'Lập quỹ dự phòng, tách tiền giữ và tiền tiêu; tránh bảo lãnh, đầu cơ.' },
  { ten: 'Phủ Tướng triều viên', o: ['Mệnh', 'Thân'], h: ['Thiên Phủ', 'Thiên Tướng'], loai: 'cat', cau: 'Phủ Tướng triều viên, thiên chung chi lộc',
    kc: function (c) { return !c.co('Thiên Phủ') && !c.co('Thiên Tướng'); }, y: 'Kho và ấn cùng chầu: cơm áo đủ đầy, được tin cậy giao việc.', huong: 'Giữ chữ tín là vốn lớn nhất.' },
  // ---- Vũ Khúc ----
  { ten: 'Vũ Phủ ở Tý Ngọ', d: ['Vũ Khúc', 'Thiên Phủ'], loai: 'cat', cau: 'Vũ Phủ đồng cung',
    y: 'Tài tinh gặp kho: kiếm và giữ tiền đều giỏi, tính thực tế.', huong: 'Đừng để thực dụng quá làm mất tình người.' },
  { ten: 'Vũ Tướng ở Dần Thân', d: ['Vũ Khúc', 'Thiên Tướng'], loai: 'cat', cau: 'Vũ Tướng đồng cung',
    y: 'Tiền đi với uy tín: làm ăn đứng đắn, được giao quản lý tài chính.', huong: 'Gặp Kình Đà thì hay vất vả vì việc người khác.' },
  { ten: 'Vũ Tham ở Sửu Mùi', d: ['Vũ Khúc', 'Tham Lang'], loai: 'cat', cau: 'Tham Vũ đồng hành, tiên bần hậu phú',
    y: 'Tuổi trẻ vất vả, khoảng ba mươi tuổi trở đi mới phát; giỏi kinh doanh.', huong: 'Kiên nhẫn tích lũy giai đoạn đầu, không vội làm giàu.' },
  { ten: 'Vũ Sát ở Mão Dậu', d: ['Vũ Khúc', 'Thất Sát'], loai: 'hung', cau: 'Vũ Khúc Thất Sát – nhân tài trì đao',
    y: 'Tài tinh gặp tướng tinh ở thế yếu: kiếm tiền quyết liệt nhưng dễ va chạm, mất mát vì tiền.', huong: 'Cẩn trọng dao kéo, máy móc, hợp đồng; không vay mượn nóng.' },
  { ten: 'Vũ Phá ở Tỵ Hợi', d: ['Vũ Khúc', 'Phá Quân'], loai: 'hung', cau: 'Vũ Phá – phá tổ ly tông',
    y: 'Tiền vào nhiều nhưng hao cũng nhiều; hay rời gốc gác để tự lập.', huong: 'Lập kỷ luật chi tiêu; hợp nghề kỹ thuật, cơ khí, khai phá.' },
  // ---- Liêm Trinh ----
  { ten: 'Liêm Phủ ở Thìn Tuất', d: ['Liêm Trinh', 'Thiên Phủ'], loai: 'cat', cau: 'Liêm Phủ đồng cung',
    y: 'Nguyên tắc đi cùng biết giữ: làm ăn ổn, có quy củ.', huong: 'Hợp quản lý, hành chính.' },
  { ten: 'Liêm Sát ở Sửu Mùi', d: ['Liêm Trinh', 'Thất Sát'], chi: [1, 7], loai: 'cat', cau: 'Liêm Trinh Thất Sát, phản vi tích phú chi nhân',
    y: 'Hai sao cứng gặp nhau ở đất tốt: chịu khó, gom góp mà thành giàu.', huong: 'Giữ sức, tránh làm quá sức.' },
  { ten: 'Liêm Tham ở Tỵ Hợi', d: ['Liêm Trinh', 'Tham Lang'], loai: 'hung', cau: 'Liêm Tham Tỵ Hợi',
    y: 'Hai sao đào hoa ở đất hãm: ham vui, dễ sa đà, vướng thị phi hoặc giấy tờ pháp lý.', huong: 'Giữ ranh giới trong quan hệ và tiền bạc; gặp Hóa Kỵ càng phải thận trọng.' },
  { ten: 'Liêm Phá ở Mão Dậu', d: ['Liêm Trinh', 'Phá Quân'], loai: 'hung', cau: 'Liêm Phá đồng cung',
    y: 'Liều lĩnh, thích mạo hiểm; dễ thăng trầm, va chạm.', huong: 'Hợp việc cần dũng khí (kỹ thuật, quân sự, cứu hộ); luôn giữ an toàn.' },
  { ten: 'Hình tù giáp ấn', d: ['Liêm Trinh', 'Thiên Tướng'], loai: 'hung', cau: 'Hình tù giáp ấn',
    kc: function (c) { return c.co('Kình Dương'); }, y: 'Liêm Tướng gặp Kình Dương: dễ dính việc pháp lý, kỷ luật.', huong: 'Làm đúng quy trình, giữ giấy tờ rõ ràng; hợp nghề luật, kiểm tra.' },
  { ten: 'Liêm Trinh gặp Hình – Kình', d: ['Liêm Trinh'], mot: ['Thiên Hình', 'Kình Dương'], loai: 'hung', cau: 'Liêm Trinh ngộ Hình',
    kc: function (c) { return !c.co('Thiên Tướng'); }, y: 'Sao "tù" gặp sao hình: dễ vướng kiện tụng, va chạm thân thể.', huong: 'Tránh tranh chấp gay gắt; chọn cách hòa giải.' },
  // ---- Cơ Nguyệt Đồng Lương ----
  { ten: 'Cơ Âm ở Dần Thân', d: ['Thiên Cơ', 'Thái Âm'], loai: 'trung', cau: 'Cơ Nguyệt Dần Thân',
    y: 'Tinh tế, nhạy cảm, nhiều mưu kế; hay di chuyển, đổi chỗ.', huong: 'Hợp nghề tính toán, kế hoạch; tránh suy nghĩ quá nhiều.' },
  { ten: 'Cự Cơ ở Mão Dậu', d: ['Thiên Cơ', 'Cự Môn'], chi: [3, 9], loai: 'cat', cau: 'Cự Cơ Mão Dậu, công khanh chi vị',
    kc: function (c) { return !c.co('Hóa Kỵ'); }, y: 'Ăn nói sắc sảo, giỏi phân tích: hợp nghề dùng lời (luật, giảng dạy, tư vấn).', huong: 'Ở Dậu kém hơn ở Mão; nói ít mà đúng.' },
  { ten: 'Thiện ấm triều cương', d: ['Thiên Cơ', 'Thiên Lương'], loai: 'cat', cau: 'Cơ Lương Thìn Tuất – thiện ấm triều cương',
    y: 'Mưu trí và được che chở: giỏi biện luận, có thiên hướng triết lý, tôn giáo.', huong: 'Đừng chỉ bàn mà không làm.' },
  { ten: 'Thủy trừng quế ngạc', d: ['Thiên Đồng', 'Thái Âm'], chi: [0], loai: 'cat', cau: 'Nguyệt sinh thương hải – thủy trừng quế ngạc',
    y: 'Đồng Âm ở Tý: thanh nhã, hưởng phúc, có của để dành.', huong: 'Hợp nghề văn hóa, nghệ thuật, tài chính an toàn.' },
  { ten: 'Đồng Cự ở Sửu Mùi', d: ['Thiên Đồng', 'Cự Môn'], loai: 'hung', cau: 'Đồng Cự Sửu Mùi',
    y: 'Lao tâm, nhiều nỗi lo trong lòng; dễ hiểu lầm vì lời nói.', huong: 'Viết rõ, nói chậm; tìm việc ổn định giảm áp lực.' },
  { ten: 'Đồng Lương ở Dần Thân', d: ['Thiên Đồng', 'Thiên Lương'], loai: 'cat', cau: 'Ấm phúc tụ',
    y: 'Phúc và ấm cùng chỗ: hiền hòa, được người trên che chở, hay gặp may lúc khó.', huong: 'Hợp nghề phục vụ, y, giáo dục.' },
  { ten: 'Lương Mã phiêu đãng', d: ['Thiên Lương', 'Thiên Mã'], chi: [2, 5, 8, 11], loai: 'trung', cau: 'Lương Mã phiêu đãng',
    y: 'Thích tự do, hay đi xa, khó gắn một chỗ.', huong: 'Chọn nghề có di chuyển; giữ một mái nhà làm điểm tựa.' },
  { ten: 'Lương Xương – thầy hiền', d: ['Thiên Lương'], mot: ['Văn Xương', 'Văn Khúc'], loai: 'cat', cau: 'Lương Xương',
    y: 'Đoan chính, có học, hợp làm thầy, cố vấn.', huong: 'Truyền dạy là cách tích phúc.' },
  // ---- Nhật Nguyệt ----
  { ten: 'Cự Nhật ở Dần', d: ['Thái Dương', 'Cự Môn'], chi: [2], loai: 'cat', cau: 'Cự Nhật Dần cung, quan phong tam đại',
    y: 'Mặt trời mọc soi tan bóng tối của Cự Môn: danh tiếng nhờ lời nói, học vấn.', huong: 'Ở Thân thì vất vả hơn; nói đi đôi với làm.' },
  { ten: 'Nhật chiếu lôi môn', d: ['Thái Dương', 'Thiên Lương'], chi: [3], loai: 'cat', cau: 'Nhật chiếu lôi môn',
    y: 'Thái Dương Thiên Lương ở Mão: rạng rỡ, có danh, được kính trọng.', huong: 'Hợp công việc công chúng, giáo dục.' },
  { ten: 'Dương Lương Xương Lộc', o: ['Mệnh', 'Thân', 'Quan Lộc'], h: ['Thái Dương', 'Thiên Lương', 'Văn Xương'], motH: ['Lộc Tồn', 'Hóa Lộc'], loai: 'cat', cau: 'Dương Lương Xương Lộc, lô truyền đệ nhất danh',
    y: 'Bộ sao thi cử, học hàm: học đâu chắc đó, có danh nhờ chữ nghĩa.', huong: 'Đầu tư bằng cấp, chứng chỉ rất đáng.' },
  { ten: 'Nhật hãm gặp Kỵ', d: ['Thái Dương'], loai: 'hung', cau: 'Nhật hãm hóa Kỵ',
    kc: function (c) { return c.ham('Thái Dương') && c.co('Hóa Kỵ'); }, y: 'Mặt trời tối lại gặp Kỵ: dễ bị hiểu lầm, bất đồng với người đàn ông lớn trong nhà (cha, chồng, sếp).', huong: 'Làm việc minh bạch, chủ động giải thích; giữ sức, đừng thức khuya kéo dài.' },
  { ten: 'Nguyệt hãm gặp Kỵ', d: ['Thái Âm'], loai: 'hung', cau: 'Nguyệt hãm hóa Kỵ',
    kc: function (c) { return c.ham('Thái Âm') && c.co('Hóa Kỵ'); }, y: 'Mặt trăng tối gặp Kỵ: tâm trạng thất thường, việc nhà đất – phụ nữ trong nhà hay vướng.', huong: 'Giữ nhịp sinh hoạt đều; giấy tờ nhà đất làm kỹ.' },
  // ---- Sát Phá Tham ----
  { ten: 'Thất Sát triều Đẩu', d: ['Thất Sát'], chi: [0, 2, 6, 8], loai: 'cat', cau: 'Thất Sát triều Đẩu, tước lộc vinh xương',
    kc: function (c) { return c.demD(TVCS_SAT) === 0; }, y: 'Tướng tinh chầu đế tinh ở đất miếu: đại khí, thành muộn mà lớn.', huong: 'Gặp sát thì mất cách; giữ kỷ luật bản thân.' },
  { ten: 'Thất Sát gặp Kình Dương', d: ['Thất Sát', 'Kình Dương'], loai: 'hung', cau: 'Thất Sát Kình Dương',
    y: 'Quyết liệt quá mức, dễ va chạm, thương tích.', huong: 'Hướng sức mạnh vào thể thao, kỹ thuật; cẩn thận giao thông, dao kéo.' },
  { ten: 'Phá Quân gặp Xương Khúc', d: ['Phá Quân'], mot: ['Văn Xương', 'Văn Khúc'], loai: 'hung', cau: 'Phá Quân Xương Khúc – thủy trung tác trủng',
    y: 'Có văn tài nhưng hay bỏ dở, đường học vấn gián đoạn; cổ thư dặn tránh sông nước.', huong: 'Học theo từng chặng ngắn có đích; cẩn thận khi bơi lội, đi thuyền.' },
  { ten: 'Phá Quân gặp sát', d: ['Phá Quân'], loai: 'hung', cau: 'Phá Quân ngộ sát',
    kc: function (c) { return c.demD(['Kình Dương', 'Hỏa Tinh', 'Linh Tinh', 'Đà La']) >= 1; }, y: 'Sức phá tăng mạnh: dễ đổ vỡ, tai nạn bất ngờ.', huong: 'Đổi mới có kế hoạch, không đốt cầu sau lưng.' },
  { ten: 'Hỏa Tham / Linh Tham', d: ['Tham Lang'], motH: ['Hỏa Tinh', 'Linh Tinh'], loai: 'cat', cau: 'Tham Lang Hỏa Tinh, hoạnh phát',
    kc: function (c) { return !c.ham('Tham Lang'); }, y: 'Tham Lang sáng gặp Hỏa/Linh: phát nhanh, có tiền bất ngờ.', huong: 'Phát nhanh thì cũng dễ tan nhanh – chốt lời, giữ phần.' },
  { ten: 'Phong lưu thái trượng', d: ['Tham Lang', 'Đà La'], chi: [2], loai: 'hung', cau: 'Tham Đà Dần cung – phong lưu thái trượng',
    y: 'Sa vào tình ái, ham vui làm lỡ việc.', huong: 'Đặt ranh giới rõ trong quan hệ.' },
  { ten: 'Phiếm thủy đào hoa', d: ['Tham Lang'], chi: [0], loai: 'trung', cau: 'Phiếm thủy đào hoa',
    y: 'Tham Lang ở Tý: duyên dáng, đa tình, giỏi giao tế.', huong: 'Gặp Tuần Triệt hay Không Kiếp thì đào hoa thành tài nghệ.' },
  { ten: 'Tham Lang gặp Kình Dương', d: ['Tham Lang', 'Kình Dương'], loai: 'hung', cau: 'Tham Lang Kình Dương',
    y: 'Ham muốn mạnh, dễ vì tham mà vướng.', huong: 'Đặt giới hạn trước khi bắt đầu một cuộc chơi.' },
  // ---- Cự Môn ----
  { ten: 'Thạch trung ẩn ngọc', d: ['Cự Môn'], chi: [0, 6], motH: ['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa'], loai: 'cat', cau: 'Thạch trung ẩn ngọc',
    y: 'Ngọc trong đá: tuổi trẻ ít người biết, trung niên tỏa sáng.', huong: 'Đừng vội khoe tài, cứ trau dồi.' },
  { ten: 'Cự Môn gặp Kình Đà', d: ['Cự Môn'], mot: ['Kình Dương', 'Đà La'], loai: 'hung', cau: 'Cự Môn Kình Đà – thị phi',
    y: 'Khẩu thiệt, kiện tụng, tranh cãi.', huong: 'Nói ít, viết rõ, không tranh hơn thua bằng lời.' },
  { ten: 'Cự Môn hóa Kỵ', d: ['Cự Môn'], loai: 'hung', cau: 'Cự Kỵ',
    kc: function (c) { return c.saoHoa('Cự Môn') === 'Kỵ'; }, y: 'Lời nói dễ thành họa, bị hiểu lầm.', huong: 'Kiểm tra lại trước khi nói/gửi.' },
  // ---- Thiên Tướng giáp ----
  { ten: 'Tài ấm giáp ấn', d: ['Thiên Tướng'], loai: 'cat', cau: 'Tài ấm giáp ấn',
    kc: function (c) { return c.giap('Hóa Lộc', 'Thiên Lương'); }, y: 'Thiên Tướng được Lộc và Lương kẹp: được nâng đỡ, cơm áo đủ.', huong: 'Nhận việc lớn khi được mời.' },
  { ten: 'Hình Kỵ giáp ấn', d: ['Thiên Tướng'], loai: 'hung', cau: 'Hình Kỵ giáp ấn',
    kc: function (c) { return c.giap('Kình Dương', 'Hóa Kỵ'); }, y: 'Thiên Tướng bị Kình và Kỵ kẹp: hay bị liên lụy, chịu tiếng thay người.', huong: 'Đừng đứng ra bảo lãnh; giữ chứng từ.' },
  // ---- Lục cát ----
  { ten: 'Tả Hữu đồng cung', d: ['Tả Phù', 'Hữu Bật'], loai: 'cat', cau: 'Tả Phù Hữu Bật, chung thân phúc hậu',
    y: 'Người giúp đến từ hai phía: làm gì cũng có tay chân.', huong: 'Trả ơn đúng lúc để giữ lực đỡ.' },
  { ten: 'Tả Hữu giáp', g: ['Tả Phù', 'Hữu Bật'], loai: 'cat', cau: 'Tả Hữu giáp', y: 'Hai bên có người đỡ.', huong: 'Cởi mở nhờ giúp.' },
  { ten: 'Xương Khúc đồng cung', d: ['Văn Xương', 'Văn Khúc'], loai: 'cat', cau: 'Văn Xương Văn Khúc',
    y: 'Văn tài, học giỏi, khéo chữ nghĩa.', huong: 'Viết, dạy, thi cử đều thuận.' },
  { ten: 'Xương Khúc giáp', g: ['Văn Xương', 'Văn Khúc'], loai: 'cat', cau: 'Xương Khúc giáp', y: 'Có văn tài bao quanh.', huong: 'Học thêm luôn có lợi.' },
  { ten: 'Xương Khúc gặp Kỵ', mot: ['Văn Xương', 'Văn Khúc'], loai: 'hung', cau: 'Xương Khúc hóa Kỵ',
    kc: function (c) { return c.saoHoa('Văn Xương') === 'Kỵ' || c.saoHoa('Văn Khúc') === 'Kỵ'; }, y: 'Giấy tờ, chữ ký, văn bản dễ sai sót.', huong: 'Đọc kỹ hợp đồng, nhờ người xem lại.' },
  { ten: 'Tọa quý hướng quý', o: ['Mệnh', 'Thân', 'Quan Lộc', 'Tài Bạch'], h: ['Thiên Khôi', 'Thiên Việt'], loai: 'cat', cau: 'Tọa quý hướng quý',
    y: 'Quý nhân cả trong lẫn ngoài.', huong: 'Gặp khó thì hỏi người trên.' },
  { ten: 'Khôi Việt giáp', g: ['Thiên Khôi', 'Thiên Việt'], loai: 'cat', cau: 'Khôi Việt giáp', y: 'Quý nhân hai bên.', huong: 'Thi cử, xin việc thuận.' },
  // ---- Lộc – Mã – Tứ Hóa ----
  { ten: 'Song Lộc', o: ['Mệnh', 'Thân', 'Quan Lộc', 'Tài Bạch'], h: ['Lộc Tồn', 'Hóa Lộc'], loai: 'cat', cau: 'Song Lộc triều viên', y: 'Hai nguồn lộc cùng chầu: tiền đến từ nhiều ngả.', huong: 'Đa dạng nguồn thu.' },
  { ten: 'Lộc phùng lưỡng sát', mot: ['Lộc Tồn', 'Hóa Lộc'], loai: 'hung', cau: 'Lộc phùng lưỡng sát',
    kc: function (c) { return c.co('Địa Không') || c.co('Địa Kiếp'); }, y: 'Lộc gặp Không Kiếp: có tiền mà khó giữ, dễ mất vì tin người.', huong: 'Không cho vay lớn, không đầu tư theo lời rủ.' },
  { ten: 'Lộc Kỵ đồng cung', mot: ['Lộc Tồn', 'Hóa Lộc'], loai: 'trung', cau: 'Lộc Kỵ tương phùng',
    kc: function (c) { return c.co('Hóa Kỵ'); }, y: 'Được rồi lại vướng: lợi đi kèm phiền.', huong: 'Tính kỹ cái giá đi kèm mỗi khoản lợi.' },
  { ten: 'Lộc Mã giao trì', o: ['Mệnh', 'Thân', 'Quan Lộc', 'Tài Bạch'], h: ['Thiên Mã'], motH: ['Lộc Tồn', 'Hóa Lộc'], loai: 'cat', cau: 'Lộc Mã giao trì',
    kc: function (c) { return c.cungCo('Thiên Mã', 'Lộc Tồn') || c.cungCo('Thiên Mã', 'Hóa Lộc'); }, y: 'Lộc đi cùng ngựa: càng đi xa, càng năng động càng có tiền.', huong: 'Hợp buôn bán, xuất nhập khẩu, công tác xa.' },
  { ten: 'Mã ngộ Không vong', d: ['Thiên Mã'], loai: 'hung', cau: 'Mã lạc không vong',
    kc: function (c) { return c.tuan || c.triet || c.co('Thiên Không') || c.co('Địa Không'); }, y: 'Ngựa sa hố: bôn ba mà ít thành, đi nhiều về không.', huong: 'Chuyến đi nào cũng cần mục tiêu rõ.' },
  { ten: 'Chiết túc mã', d: ['Thiên Mã', 'Đà La'], loai: 'hung', cau: 'Chiết túc mã',
    y: 'Ngựa què chân: đi lại trắc trở, kế hoạch dời đổi.', huong: 'Dự phòng thời gian cho mọi chuyến đi.' },
  { ten: 'Tam Hóa liên châu', o: ['Mệnh', 'Thân', 'Quan Lộc', 'Tài Bạch'], h: ['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa'], loai: 'cat', cau: 'Tam kỳ gia hội',
    y: 'Lộc – Quyền – Khoa cùng chầu: danh lợi đều có.', huong: 'Nắm thời cơ khi tới.' },
  { ten: 'Khoa Quyền Lộc giáp', loai: 'cat', cau: 'Khoa Quyền Lộc giáp',
    kc: function (c) { return c.giap('Hóa Lộc', 'Hóa Quyền') || c.giap('Hóa Lộc', 'Hóa Khoa') || c.giap('Hóa Quyền', 'Hóa Khoa'); }, y: 'Hai bên có Hóa cát kẹp: được thời thế đẩy lên.', huong: 'Đừng bỏ lỡ lời mời.' },
  { ten: 'Dương Đà giáp Kỵ', d: ['Hóa Kỵ'], loai: 'hung', cau: 'Dương Đà giáp Kỵ vi bại cục',
    kc: function (c) { return c.giap('Kình Dương', 'Đà La'); }, y: 'Kỵ bị Kình Đà kẹp: bế tắc, trở ngại dồn dập.', huong: 'Lùi một bước, giải từng nút; Thiên Phủ trong cung làm nhẹ.' },
  { ten: 'Thanh Long gặp Kỵ', d: ['Hóa Kỵ', 'Thanh Long'], loai: 'cat', cau: 'Thanh Long ngộ Kỵ – rồng ngậm ngọc',
    y: 'Kỵ gặp Thanh Long lại hóa thành lợi: từ khó khăn bật ra cơ hội.', huong: 'Kiên trì qua giai đoạn đầu.' },
  // ---- Sát tinh ----
  { ten: 'Linh Xương Đà Vũ', d: ['Vũ Khúc'], h: ['Linh Tinh', 'Văn Xương', 'Đà La'], loai: 'hung', cau: 'Linh Xương Đà Vũ, hạn chí đầu hà',
    y: 'Bộ sao cổ thư coi là rất nặng khi vào hạn: bế tắc, tuyệt vọng, quyết định dại dột.', huong: 'Khi hạn tới: không quyết lớn một mình, tìm người tin cậy chia sẻ, giữ an toàn sông nước.' },
  { ten: 'Lục sát hội tụ', o: ['Mệnh', 'Thân', 'Tật Ách', 'Thiên Di', 'Tài Bạch', 'Quan Lộc'], loai: 'hung', cau: 'Sát tinh hội tụ',
    kc: function (c) { return c.demH(TVCS_SAT) >= 4; }, y: 'Bốn sát tinh trở lên chiếu: áp lực, tranh đấu, biến cố.', huong: 'Chọn nghề cần dũng khí; tiết chế nóng giận; giữ an toàn.' },
  { ten: 'Song Không', d: ['Thiên Không', 'Địa Không'], loai: 'hung', cau: 'Song Không',
    y: 'Hai sao Không cùng chỗ: ý tưởng lớn mà dễ hụt, tiền dễ bay.', huong: 'Hợp nghiên cứu, tu học, sáng tạo; tránh đầu cơ.' },
  { ten: 'Thiên Không gặp Kiếp', d: ['Thiên Không', 'Địa Kiếp'], loai: 'hung', cau: 'Không Kiếp tương phùng',
    y: 'Mất mát vì tin người, kế hoạch đổ vỡ giữa chừng.', huong: 'Kiểm chứng trước khi tin; chia nhỏ rủi ro.' },
  { ten: 'Thiên Không gặp đào hoa', d: ['Thiên Không'], mot: ['Đào Hoa', 'Hồng Loan'], loai: 'hung', cau: 'Đào Hoa ngộ Không',
    y: 'Duyên đến dễ, đi cũng dễ; tình cảm hụt hẫng.', huong: 'Đừng vội cam kết khi mới quen.' },
  { ten: 'Hoa Cái gặp Không', d: ['Hoa Cái'], mot: ['Thiên Không', 'Địa Không'], loai: 'trung', cau: 'Hoa Cái ngộ Không',
    y: 'Thiên hướng tâm linh, nghệ thuật, triết lý.', huong: 'Một không gian riêng để tĩnh tâm là cần.' },
  { ten: 'Lưu Hà Kiếp Sát', d: ['Lưu Hà', 'Kiếp Sát'], loai: 'hung', cau: 'Lưu Hà Kiếp Sát',
    y: 'Cổ thư dặn cẩn thận sông nước, đi lại, máu huyết.', huong: 'Giữ an toàn giao thông, bơi lội.' },
  { ten: 'Không Kiếp giáp', g: ['Địa Không', 'Địa Kiếp'], loai: 'hung', cau: 'Không Kiếp giáp', y: 'Hao tán bao quanh.', huong: 'Giữ tài sản chắc.' },
  { ten: 'Hỏa Linh giáp', g: ['Hỏa Tinh', 'Linh Tinh'], loai: 'hung', cau: 'Hỏa Linh giáp', y: 'Chuyện bất ngờ, nóng nảy.', huong: 'Hít thở trước khi phản ứng; Lộc Tồn trong cung làm nhẹ.' },
  // ---- Phụ tinh thành bộ ----
  { ten: 'Tứ Linh (Long Phượng Hổ Cái)', o: ['Mệnh', 'Thân', 'Quan Lộc'], mot: ['Long Trì', 'Phượng Các', 'Bạch Hổ', 'Hoa Cái'], h: ['Long Trì', 'Phượng Các', 'Bạch Hổ', 'Hoa Cái'], loai: 'cat', cau: 'Long Phượng Hổ Cái',
    y: 'Bộ sao danh giá: có tiếng tăm, được trọng vọng.', huong: 'Giữ hình ảnh, uy tín.' },
  { ten: 'Thai Tọa', o: ['Mệnh', 'Thân', 'Quan Lộc'], mot: ['Tam Thai', 'Bát Tọa'], h: ['Tam Thai', 'Bát Tọa'], loai: 'cat', cau: 'Tam Thai Bát Tọa', y: 'Địa vị, chỗ ngồi vững.', huong: 'Hợp việc có chức danh.' },
  { ten: 'Quang Quý', o: ['Mệnh', 'Thân', 'Quan Lộc', 'Phúc Đức'], mot: ['Ân Quang', 'Thiên Quý'], h: ['Ân Quang', 'Thiên Quý'], loai: 'cat', cau: 'Ân Quang Thiên Quý', y: 'Được ơn, được giúp không mong đợi.', huong: 'Sống tử tế là gieo lộc.' },
  { ten: 'Thai Cáo', o: ['Mệnh', 'Thân', 'Quan Lộc'], mot: ['Thai Phụ', 'Phong Cáo'], h: ['Thai Phụ', 'Phong Cáo'], loai: 'cat', cau: 'Thai Phụ Phong Cáo', y: 'Bằng khen, danh dự.', huong: 'Ghi nhận đến từ nỗ lực bền.' },
  { ten: 'Khốc Hư ở Tý Ngọ', d: ['Thiên Khốc', 'Thiên Hư'], chi: [0, 6], loai: 'cat', cau: 'Khốc Hư Tý Ngọ',
    y: 'Ở đất đắc địa, buồn lo hóa thành danh tiếng, ăn nói có sức nặng.', huong: 'Biến trải nghiệm buồn thành chiều sâu.' },
  { ten: 'Khốc Hư', d: ['Thiên Khốc', 'Thiên Hư'], loai: 'hung', cau: 'Khốc Hư',
    kc: function (c) { return c.chi !== 0 && c.chi !== 6; }, y: 'Hay buồn lo, trống trải.', huong: 'Giữ kết nối với người thân, vận động đều.' },
  { ten: 'Tang Hổ', o: ['Mệnh', 'Thân', 'Phúc Đức', 'Tật Ách', 'Phụ Mẫu'], h: ['Tang Môn', 'Bạch Hổ'], loai: 'hung', cau: 'Tang Môn Bạch Hổ',
    kc: function (c) { return c.co('Tang Môn') || c.co('Bạch Hổ'); }, y: 'Tang chế, tai nạn, kiện tụng – khi vào hạn mới đáng để ý.', huong: 'Thăm hỏi người lớn tuổi trong nhà; cẩn thận đi lại.' },
  { ten: 'Tam minh Đào Hồng Hỷ', o: ['Mệnh', 'Thân', 'Phu Thê'], mot: ['Đào Hoa', 'Hồng Loan', 'Thiên Hỷ'], h: ['Đào Hoa', 'Hồng Loan', 'Thiên Hỷ'], loai: 'cat', cau: 'Đào Hồng Hỷ',
    y: 'Duyên nhiều, được yêu mến, nhiều hỷ sự.', huong: 'Chọn lọc mối quan hệ.' },
  { ten: 'Hình Riêu Y', o: ['Mệnh', 'Thân', 'Quan Lộc', 'Tật Ách'], mot: ['Thiên Hình', 'Thiên Riêu', 'Thiên Y'], h: ['Thiên Hình', 'Thiên Riêu', 'Thiên Y'], loai: 'trung', cau: 'Hình Riêu Y',
    y: 'Bộ sao nghề thuốc, chữa trị.', huong: 'Hợp ngành y, dược, chăm sóc.' },
  { ten: 'Cô Quả', d: ['Cô Thần', 'Quả Tú'], loai: 'hung', cau: 'Cô Thần Quả Tú', y: 'Lẻ loi, tự lo một mình.', huong: 'Chủ động tìm cộng đồng hợp mình.' }
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
  'Thiên Thương': 'hao tổn, mất mát; việc của bạn bè, cấp dưới kéo theo phiền – là lúc chuyện bắt đầu hình thành, có cách vượt qua',
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
    if (pi === pNo) { dau.push('Đại vận vào đúng cung Thiên Thương (Nô Bộc): hao tổn, việc của bạn bè – cấp dưới kéo theo phiền; có cách vượt qua.'); }
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
  "Tử Phủ đồng cung": {"de": "Ở mảng đời sống này, bạn có xu hướng vừa muốn tự mình cầm lái, vừa biết giữ gìn những gì đã gây dựng. Nền móng của bạn ở đây khá vững, nên dễ tạo được sự tin cậy và một đời sống đủ đầy theo thời gian. Điều nên để ý nhẹ nhàng là thói quen ôm hết việc vào mình hoặc hài lòng quá sớm với những gì đang có. Khi có thêm người giỏi bên cạnh và chịu học hỏi, sự vững vàng này càng nở rộ.", "khuyen": "Hãy chia bớt việc cho người đáng tin và giữ thói quen học thêm điều mới; đó là cách biến nền móng vững thành bước tiến dài."},
  "Tử Tướng ở Thìn Tuất": {"de": "Ở mảng đời sống này, bạn có xu hướng mang tố chất dẫn dắt nhưng hay cảm thấy bị khuôn khổ, nguyên tắc hoặc người phía trên giữ chân. Có lúc bạn thấy mình giỏi mà chưa gặp thời, công sức chưa được nhìn nhận tương xứng. Đó chưa phải là giới hạn của bạn, chỉ là giai đoạn cần bền bỉ tích lũy uy tín. Khi gặp được người nâng đỡ hoặc bạn bè cùng chí hướng, cánh cửa thường mở ra rõ hơn.", "khuyen": "Nên kiên trì trong một tổ chức có nền nếp để rèn nghề và gây dựng mối quen biết tốt, rồi hãy tính chuyện tự đứng riêng."},
  "Tử Sát ở Tỵ Hợi": {"de": "Bạn thuộc mẫu người quyết đoán, dám nhận phần việc khó và trách nhiệm lớn ở mảng đời sống này. Sự mạnh mẽ của bạn được kiểm soát tốt, nên dễ trở thành chỗ dựa và người đứng mũi chịu sào. Đôi khi sự quyết liệt có thể khiến người xung quanh thấy bị áp đảo nếu bạn vội vàng. Biết lắng nghe trước khi chốt sẽ làm uy tín của bạn thêm bền.", "khuyen": "Trước mỗi quyết định lớn, hãy hỏi ý kiến người làm cùng và người cấp dưới; sự lắng nghe giúp bản lĩnh của bạn được nể trọng hơn."},
  "Tử Phá ở Sửu Mùi": {"de": "Ở mảng đời sống này, bạn có xu hướng mang hoài bão lớn, thích đổi mới và chẳng ngại đi khác lối mòn. Vì vậy hành trình của bạn có thể trải qua vài lần bắt đầu lại từ đầu. Đó vừa là sức mạnh mở đường, vừa là điểm dễ khiến việc bị dang dở nếu thiếu nhịp đều. Có người cẩn trọng đi cùng sẽ giúp những ý tưởng táo bạo của bạn đi đến nơi đến chốn.", "khuyen": "Hãy chọn vai trò mở đường, cải tổ, và tìm một người giỏi giữ nhịp, theo dõi tiến độ để việc mình khởi xướng được hoàn thành."},
  "Tử Tham ở Mão Dậu": {"de": "Bạn có xu hướng duyên dáng, khéo giao tiếp và dễ được người khác yêu mến ở mảng đời sống này. Mặt khác, sức hút ấy cũng dễ kéo bạn vào những cuộc vui, những mối tình cảm nhiều ngả rẽ. Nếu biết hướng nét duyên này vào học hỏi, nghệ thuật hay việc giúp người, nó lại trở thành điểm sáng rất riêng. Giữ chừng mực là chìa khóa để bạn tận hưởng mà vẫn an yên.", "khuyen": "Đặt cho mình vài nguyên tắc rõ trong chuyện vui chơi và tình cảm, và dành thời gian cho một môn nghệ thuật hay việc học để vun đắp chiều sâu."},
  "Quân thần khánh hội": {"de": "Bạn thuộc mẫu người dễ được người giỏi tìm đến giúp sức ở mảng đời sống này. Khi bắt tay vào việc lớn, bạn thường có một đội ngũ đáng tin bên cạnh. Điều cần nhớ là sức mạnh ấy chỉ phát huy khi bạn biết tin người và trao việc đúng chỗ. Càng biết chia sẻ vai trò, bạn càng tiến xa.", "khuyen": "Hãy học cách giao việc, chia bớt trách nhiệm và ghi nhận công sức người giúp mình; đội ngũ vững sẽ đưa bạn đi xa."},
  "Tử Vi cô quân": {"de": "Ở mảng đời sống này, bạn có xu hướng mang chí lớn nhưng hay phải tự mình gánh vác, ít người kề vai. Có lúc bạn cảm thấy lẻ loi khi đứng trước những quyết định hệ trọng. Đây chẳng phải lỗi của bạn, mà là dấu hiệu nhắc rằng bạn cần chủ động xây dựng vòng tròn hỗ trợ cho mình. Khi có người cùng bàn bạc, những gánh nặng sẽ nhẹ đi rất nhiều.", "khuyen": "Chủ động kết nối với người cùng chí hướng, tìm một người cố vấn đáng tin; tránh chốt việc lớn khi đang cảm thấy bị tách lẻ."},
  "Phủ gặp Lộc – kho đầy": {"de": "Bạn thuộc mẫu người giỏi tích lũy và biết giữ những gì mình có ở mảng đời sống này. Tiền bạc, của cải hay công sức thường được bạn vun dần thành vốn liếng bền vững. Sự cẩn trọng là thế mạnh, chỉ cần đừng để nó biến thành dè dặt quá mức mà bỏ lỡ dịp tốt. Cân bằng giữa giữ và dùng sẽ giúp bạn sống thoải mái hơn.", "khuyen": "Bạn hợp với những việc liên quan đến quản lý tiền bạc, điều hành hay nhà đất; hãy dành một phần nhỏ cho việc học hỏi, mở rộng để vốn liếng sinh sôi."},
  "Không khố – lộ khố": {"de": "Ở mảng đời sống này, bạn có xu hướng thấy tiền bạc hay công sức đến rồi lại đi, khó giữ lại lâu. Có thể bạn phải tự tay gây dựng nhiều hơn người khác thay vì dựa vào cái sẵn có. Điều này chẳng nói lên rằng bạn sẽ thiếu thốn, chỉ nhắc rằng bạn cần một cách giữ tiền có kỷ luật. Khi có kế hoạch rõ ràng, bạn hoàn toàn có thể xây được nền tảng vững.", "khuyen": "Hãy lập quỹ dự phòng, tách riêng tiền để dành và tiền tiêu; tránh đứng ra bảo lãnh và đừng đầu tư theo kiểu ăn may."},
  "Phủ Tướng triều viên": {"de": "Bạn thuộc mẫu người đáng tin, thường được giao phó những việc cần sự chu đáo ở mảng đời sống này. Cơm áo của bạn có xu hướng đủ đầy nhờ uy tín tích lũy qua thời gian. Sự ổn định đến từ việc người khác tin tưởng và sẵn lòng trao việc cho bạn. Chỉ cần giữ lời hứa, nền tảng ấy sẽ càng thêm vững.", "khuyen": "Giữ chữ tín trong từng việc nhỏ; đó là vốn liếng lớn nhất giúp bạn được trao những vai trò hệ trọng."},
  "Vũ Phủ ở Tý Ngọ": {"de": "Bạn thuộc mẫu người thực tế, vừa biết kiếm tiền vừa biết giữ tiền ở mảng đời sống này. Bạn nhìn vấn đề rõ ràng, tính toán chắc chắn nên ít khi để mình rơi vào thế bị động. Chỉ có điều, khi quá chú trọng chuyện được mất, đôi lúc bạn dễ khiến người thân thấy xa cách. Thêm chút mềm mỏng sẽ giúp sự giỏi giang của bạn được yêu mến hơn.", "khuyen": "Hãy dành chỗ cho tình cảm và sự sẻ chia bên cạnh những tính toán; tình người là thứ vốn giúp tiền bạc của bạn bền hơn."},
  "Vũ Tướng ở Dần Thân": {"de": "Bạn có xu hướng làm ăn đứng đắn, giữ uy tín và thường được tin giao quản lý tiền bạc hay việc hệ trọng ở mảng đời sống này. Người khác thấy ở bạn sự đáng tin và nghiêm túc. Đôi khi vì nhận lời giúp nhiều người, bạn có thể vất vả vì việc của người khác. Biết lượng sức mình sẽ giúp bạn giữ được cả uy tín lẫn sự thong thả.", "khuyen": "Hãy nhận việc vừa sức và nói rõ giới hạn trách nhiệm ngay từ đầu, để lòng tốt của bạn chẳng biến thành gánh nặng."},
  "Vũ Tham ở Sửu Mùi": {"de": "Bạn có xu hướng thành công muộn mà chắc ở mảng đời sống này: giai đoạn đầu có thể khá vất vả, nhưng càng về sau càng vững. Bạn có đầu óc kinh doanh và sức bền đáng nể. Những năm tháng chật vật ban đầu thật ra là lúc bạn tích lũy kinh nghiệm và vốn liếng. Kiên nhẫn chính là điều giúp bạn gặt hái về sau.", "khuyen": "Đừng vội làm giàu nhanh; hãy tích lũy đều đặn, học nghề thật vững ở giai đoạn đầu để bước phát triển về sau được bền."},
  "Vũ Sát ở Mão Dậu": {"de": "Ở mảng đời sống này, bạn có xu hướng theo đuổi mục tiêu rất quyết liệt, nhất là khi liên quan đến tiền bạc. Sự mạnh mẽ ấy giúp bạn làm được việc, nhưng cũng dễ dẫn đến va chạm hoặc mất mát nếu vội vàng. Đây là lời nhắc để bạn chậm lại một nhịp trước những quyết định về tiền và hợp đồng. Khi cẩn trọng hơn, bản lĩnh của bạn sẽ trở thành lợi thế thực sự.", "khuyen": "Đọc kỹ hợp đồng, tránh vay mượn gấp; khi làm việc với dao kéo, máy móc hãy luôn giữ an toàn."},
  "Vũ Phá ở Tỵ Hợi": {"de": "Ở mảng đời sống này, bạn có xu hướng kiếm được nhiều nhưng chi ra cũng nhiều, tiền bạc khó đọng lại. Bạn cũng hay muốn rời xa nơi quen thuộc để tự lập, tự tìm đường riêng. Tinh thần tự lập ấy rất đáng trân trọng, chỉ cần thêm kỷ luật trong chi tiêu là bạn sẽ giữ được thành tựu của mình. Nghề cần tay nghề kỹ thuật hoặc tinh thần khai mở thường hợp với bạn.", "khuyen": "Lập kế hoạch chi tiêu hằng tháng và để riêng một khoản tiết kiệm bắt buộc; nghề kỹ thuật, máy móc hay việc mở hướng mới khá hợp với bạn."},
  "Liêm Phủ ở Thìn Tuất": {"de": "Bạn thuộc mẫu người có nguyên tắc và biết giữ gìn ở mảng đời sống này. Bạn làm việc có quy củ, nên mọi thứ thường ổn định và ít xáo trộn. Đôi khi sự nghiêm túc khiến bạn hơi cứng nhắc trước những thay đổi. Mở lòng đón cách làm mới sẽ giúp nền nếp của bạn thêm sức sống.", "khuyen": "Bạn hợp với công việc điều hành, hành chính; hãy giữ nguyên tắc nhưng sẵn lòng điều chỉnh khi tình hình thay đổi."},
  "Liêm Sát ở Sửu Mùi": {"de": "Bạn có xu hướng chịu thương chịu khó, gom góp từng chút một mà dần thành vững vàng ở mảng đời sống này. Tính cách cứng cỏi giúp bạn đi đường dài mà ít khi bỏ cuộc. Có điều, vì quen gồng gánh, bạn dễ làm quá sức mà chẳng để ý. Biết nghỉ ngơi đúng lúc sẽ giúp bạn đi bền hơn.", "khuyen": "Đặt lịch nghỉ ngơi rõ ràng như đặt lịch làm việc; giữ sức chính là giữ vốn cho con đường dài."},
  "Liêm Tham ở Tỵ Hợi": {"de": "Ở mảng đời sống này, bạn có xu hướng ham vui, dễ bị cuốn vào những cuộc chơi hay mối giao tình phức tạp. Điều này có thể kéo theo chuyện điều tiếng hoặc rắc rối giấy tờ nếu thiếu tỉnh táo. Đó chẳng phải là bản chất xấu, chỉ là nét cần được dẫn dắt khéo. Khi biết đặt ranh giới, sự cởi mở của bạn lại trở thành duyên giao tiếp tốt.", "khuyen": "Giữ ranh giới rõ trong chuyện tình cảm và tiền bạc; giấy tờ pháp lý cần làm đầy đủ, đúng quy định."},
  "Liêm Phá ở Mão Dậu": {"de": "Ở mảng đời sống này, bạn có xu hướng thích mạo hiểm, dám liều để thử điều mới. Vì vậy cuộc sống có thể nhiều lên xuống và đôi khi va chạm. Sự gan dạ ấy là món quà nếu được đặt đúng chỗ. Chỉ cần thêm chút tính toán, bạn sẽ biến lòng can đảm thành thành tựu.", "khuyen": "Hướng sự gan dạ vào những việc cần dũng khí như kỹ thuật, cứu hộ, bảo vệ; và luôn giữ an toàn cho bản thân."},
  "Hình tù giáp ấn": {"de": "Ở mảng đời sống này, bạn có xu hướng dễ dính đến chuyện quy định, kỷ luật hoặc thủ tục pháp lý. Đôi khi chỉ một sơ suất nhỏ về giấy tờ cũng có thể gây phiền phức lớn. Điều này nhắc bạn làm việc bài bản hơn người khác một chút. Ngược lại, chính sự nhạy với luật lệ lại có thể thành thế mạnh nghề nghiệp.", "khuyen": "Làm đúng quy trình, cất giữ giấy tờ rõ ràng; bạn có thể hợp với nghề luật, kiểm tra, giám sát."},
  "Liêm Trinh gặp Hình – Kình": {"de": "Ở mảng đời sống này, bạn có xu hướng dễ rơi vào tranh chấp, kiện tụng hoặc va chạm nếu nóng vội. Tính thẳng và cứng của bạn khi gặp mâu thuẫn dễ bị đẩy lên gay gắt. Đây là lời nhắc nhẹ để bạn chọn cách mềm mỏng trước. Hòa giải thường mang lại cho bạn nhiều hơn là thắng thua.", "khuyen": "Khi có mâu thuẫn, hãy ưu tiên thương lượng và hòa giải; đi lại, vận động cũng nên cẩn thận để giữ an toàn."},
  "Cơ Âm ở Dần Thân": {"de": "Bạn thuộc mẫu người tinh tế, nhạy cảm và giỏi tính toán ở mảng đời sống này. Bạn thường có nhiều phương án trong đầu và hay thay đổi chỗ ở, nơi làm hoặc cách làm. Sự nhạy bén là điểm mạnh, nhưng nghĩ quá nhiều đôi khi khiến bạn mệt và khó chọn. Tin vào trực giác sau khi đã cân nhắc đủ sẽ giúp bạn nhẹ lòng hơn.", "khuyen": "Bạn hợp với việc lập kế hoạch, tính toán, phân tích; hãy đặt hạn chót cho mỗi lần cân nhắc để tránh rối trí."},
  "Cự Cơ ở Mão Dậu": {"de": "Bạn thuộc mẫu người ăn nói sắc sảo, giỏi phân tích và lập luận ở mảng đời sống này. Lời nói là công cụ mạnh của bạn, hợp với nghề tư vấn, giảng dạy hay luật. Chỉ cần để ý rằng lời sắc quá đôi khi làm người nghe phật lòng. Nói ít mà trúng sẽ khiến tiếng nói của bạn có sức nặng hơn.", "khuyen": "Rèn kỹ năng trình bày và lắng nghe; trước khi phản biện, hãy ghi nhận điểm đúng của người khác."},
  "Thiện ấm triều cương": {"de": "Bạn thuộc mẫu người mưu trí, giỏi lý lẽ và thường được che chở vào lúc cần ở mảng đời sống này. Bạn hay nghiêng về những câu hỏi đạo lý, triết học hay đời sống tinh thần. Đó là chiều sâu đáng trân trọng. Điều nên để ý là đừng để mình chỉ bàn mà chậm hành động.", "khuyen": "Biến ý tưởng thành những bước làm cụ thể, dù nhỏ; khả năng ngẫm nghĩ của bạn có giá trị nhất khi đi kèm việc làm."},
  "Thủy trừng quế ngạc": {"de": "Bạn thuộc mẫu người nhã nhặn, sống tình cảm và có duyên hưởng sự êm ấm ở mảng đời sống này. Bạn thường biết để dành, nên có của ăn của để theo thời gian. Sự dịu dàng của bạn là nét cuốn hút tự nhiên. Chỉ cần thêm chút chủ động, bạn sẽ đón được nhiều điều tốt hơn nữa.", "khuyen": "Bạn hợp với công việc nghệ thuật, giáo dục hoặc quản lý tiền theo hướng an toàn; hãy giữ thói quen tiết kiệm đều đặn."},
  "Đồng Cự ở Sửu Mùi": {"de": "Ở mảng đời sống này, bạn có xu hướng hay lo nghĩ, giữ nhiều tâm sự trong lòng. Đôi khi lời nói của bạn bị hiểu khác ý, gây phiền lòng chẳng đáng có. Đây chẳng phải vì bạn vụng về, mà vì bạn nghĩ nhiều hơn những gì mình nói ra. Khi được bày tỏ rõ ràng, nhiều nỗi lo sẽ tự nhẹ đi.", "khuyen": "Hãy nói chậm, viết rõ những điều hệ trọng, và chọn môi trường ổn định để giảm bớt sức ép."},
  "Đồng Lương ở Dần Thân": {"de": "Bạn thuộc mẫu người hiền hòa, dễ mến và hay được người đi trước che chở ở mảng đời sống này. Khi gặp khó, bạn thường may mắn có người giúp hoặc tìm được lối ra. Tấm lòng tốt của bạn chính là nguồn may ấy. Chỉ cần giữ sự chủ động, đừng quá trông chờ vào may mắn.", "khuyen": "Bạn hợp với nghề chăm sóc sức khỏe, giáo dục, giúp đỡ mọi người; tiếp tục giúp người là cách vun đắp vận may."},
  "Lương Mã phiêu đãng": {"de": "Bạn có xu hướng yêu tự do, thích đi đây đi đó và khó gắn bó lâu với một chỗ ở mảng đời sống này. Sự năng động giúp bạn mở mang tầm nhìn và có nhiều trải nghiệm. Mặt khác, đi nhiều đôi khi khiến bạn thấy thiếu chốn neo đậu. Có một mái nhà để trở về sẽ giúp bạn vững lòng hơn.", "khuyen": "Chọn công việc có di chuyển, nhưng hãy giữ một nơi chốn, một thói quen cố định làm điểm tựa tinh thần."},
  "Lương Xương – thầy hiền": {"de": "Bạn thuộc mẫu người đoan chính, ham học và có cốt cách của người thầy ở mảng đời sống này. Mọi người thường tìm đến bạn để xin lời khuyên. Kiến thức và sự ngay thẳng là vốn lớn của bạn. Chia sẻ những gì mình biết sẽ khiến bạn được kính trọng hơn.", "khuyen": "Hãy dạy, hướng dẫn hoặc làm cố vấn cho người khác; truyền lại hiểu biết là cách tích may mắn bền lâu."},
  "Cự Nhật ở Dần": {"de": "Bạn thuộc mẫu người có tiếng nói và học vấn giúp tạo dựng danh tiếng ở mảng đời sống này. Bạn có khả năng làm sáng tỏ những chuyện rối rắm. Điều làm nên uy tín lâu dài là lời nói luôn đi cùng việc làm. Khi giữ được sự nhất quán ấy, tiếng nói của bạn càng có trọng lượng.", "khuyen": "Đầu tư vào học vấn và kỹ năng nói trước đám đông; luôn làm đúng điều mình đã nói."},
  "Nhật chiếu lôi môn": {"de": "Bạn thuộc mẫu người rạng rỡ, có sức lan tỏa và dễ được kính trọng ở mảng đời sống này. Bạn tỏa sáng khi đứng trước nhiều người và làm việc vì lợi ích chung. Danh tiếng đến với bạn một cách tự nhiên nhờ sự ngay thẳng. Chỉ cần giữ sự khiêm tốn, ánh sáng ấy sẽ bền lâu.", "khuyen": "Bạn hợp với công việc giáo dục, truyền thông hoặc làm việc vì số đông; hãy dùng uy tín để giúp người khác cùng tiến."},
  "Dương Lương Xương Lộc": {"de": "Bạn thuộc mẫu người học đâu chắc đó và có duyên với thi cử, bằng cấp ở mảng đời sống này. Chữ nghĩa và kiến thức là con đường giúp bạn tạo dựng tên tuổi. Sự chăm chỉ học hỏi của bạn thường được đền đáp xứng đáng. Hãy coi việc học là hành trình suốt đời.", "khuyen": "Đầu tư vào bằng cấp, chứng chỉ và các khóa học chuyên sâu; đây là khoản đầu tư rất đáng với bạn."},
  "Nhật hãm gặp Kỵ": {"de": "Ở mảng đời sống này, bạn có xu hướng dễ bị hiểu lầm, nhất là với những người đàn ông lớn trong đời như cha, chồng hoặc cấp trên. Đôi khi bạn làm tốt mà chưa được ghi nhận đúng. Điều này chẳng phải do bạn kém, mà do thông tin chưa được truyền đạt rõ. Chủ động chia sẻ và minh bạch sẽ giúp mọi chuyện nhẹ nhàng hơn.", "khuyen": "Làm việc minh bạch, chủ động trình bày rõ ý mình; giữ nếp sinh hoạt điều độ, hạn chế thức khuya kéo dài."},
  "Nguyệt hãm gặp Kỵ": {"de": "Ở mảng đời sống này, bạn có xu hướng dễ xao động cảm xúc, tâm trạng lên xuống thất thường. Chuyện nhà cửa, đất đai hoặc chuyện liên quan đến những người phụ nữ trong nhà có thể khiến bạn bận lòng. Đây là lời nhắc để bạn chăm sóc đời sống tinh thần nhiều hơn. Khi tâm an, mọi việc cũng dễ xử lý hơn.", "khuyen": "Giữ nhịp sinh hoạt đều đặn, dành thời gian thư giãn; giấy tờ nhà đất cần kiểm tra kỹ trước khi ký."},
  "Thất Sát triều Đẩu": {"de": "Bạn thuộc mẫu người có khí chất lớn, thành công muộn nhưng vững chắc ở mảng đời sống này. Bạn có tầm nhìn xa và đủ bản lĩnh để gánh vác việc khó. Con đường có thể dài, nhưng mỗi bước đều góp phần xây nên chỗ đứng chắc. Giữ kỷ luật với chính mình là điều giúp bạn đi đến đích.", "khuyen": "Rèn kỷ luật bản thân mỗi ngày và tránh những cám dỗ làm chệch hướng; thành tựu lớn của bạn cần thời gian vun đắp."},
  "Thất Sát gặp Kình Dương": {"de": "Ở mảng đời sống này, bạn có xu hướng quyết liệt, mạnh mẽ đến mức đôi khi quá tay. Điều này có thể dẫn đến va chạm với người khác hoặc những sơ suất khi vội vàng. Năng lượng dồi dào ấy rất đáng giá nếu được dẫn đúng hướng. Chậm lại một nhịp sẽ giúp bạn vừa an toàn vừa làm việc tốt hơn.", "khuyen": "Dồn năng lượng vào thể thao, kỹ thuật hoặc công việc cần sức bền; khi đi đường hay dùng dao kéo, hãy luôn cẩn thận."},
  "Phá Quân gặp Xương Khúc": {"de": "Ở mảng đời sống này, bạn có xu hướng có năng khiếu chữ nghĩa nhưng hay làm dở dang, con đường học hành dễ bị gián đoạn. Bạn thường bắt đầu nhiều việc với hứng khởi rồi chuyển sang thứ khác. Đây là nét có thể điều chỉnh bằng cách chia nhỏ mục tiêu. Sách xưa cũng nhắc nên cẩn trọng ở nơi sông nước, nên hãy luôn giữ an toàn.", "khuyen": "Học theo từng chặng ngắn có đích rõ ràng; khi bơi lội, đi thuyền hãy luôn có biện pháp an toàn."},
  "Phá Quân gặp sát": {"de": "Ở mảng đời sống này, bạn có xu hướng mang sức thay đổi rất mạnh, dễ gặp đổ vỡ hoặc biến động bất ngờ. Bạn thích làm mới mọi thứ, nhưng khi vội vàng có thể khiến mình mất chỗ dựa. Sự thay đổi tự nó chẳng xấu, chỉ cần có kế hoạch. Khi biết giữ lại đường lui, bạn sẽ đổi mới mà vẫn an toàn.", "khuyen": "Đổi mới có kế hoạch, đừng cắt đứt mọi đường lui; trong đi lại và công việc nặng, hãy giữ an toàn."},
  "Hỏa Tham / Linh Tham": {"de": "Bạn có xu hướng gặp những dịp phát lên nhanh, có khoản thu bất ngờ ở mảng đời sống này. Bạn nhạy với thời điểm và dám nắm bắt. Tuy nhiên, điều gì đến nhanh cũng có thể đi nhanh. Biết dừng đúng lúc và giữ lại phần mình sẽ giúp thành tựu bền hơn.", "khuyen": "Khi gặp thời, hãy chốt lời đúng lúc và để riêng một phần cất giữ; đừng dồn hết vào một lần đặt cược."},
  "Phong lưu thái trượng": {"de": "Ở mảng đời sống này, bạn có xu hướng dễ bị cuốn vào chuyện tình cảm hoặc những cuộc vui mà lỡ việc chính. Sức hút của bạn khá mạnh, nhưng nếu thiếu tỉnh táo có thể kéo theo phiền phức. Đây chẳng phải lời trách, chỉ là lời nhắc để bạn biết đâu là ưu tiên. Khi giữ được ranh giới, bạn vẫn vui mà mọi việc vẫn trôi chảy.", "khuyen": "Đặt ranh giới rõ ràng trong các mối giao tình và sắp xếp việc chính trước, vui chơi sau."},
  "Phiếm thủy đào hoa": {"de": "Bạn thuộc mẫu người duyên dáng, đa tình và giỏi giao tiếp ở mảng đời sống này. Bạn dễ kết nối và được nhiều người để ý. Nét duyên ấy có thể là lợi thế lớn, nhưng cũng dễ khiến tình cảm rối ren nếu thiếu chọn lọc. Khi hướng sức hút vào nghệ thuật hoặc nghề cần giao tiếp, nó sẽ thành điểm mạnh.", "khuyen": "Chọn lọc các mối thân quen và hướng sự duyên dáng vào nghệ thuật, bán hàng, giao tiếp."},
  "Tham Lang gặp Kình Dương": {"de": "Ở mảng đời sống này, bạn có xu hướng mang ham muốn mạnh mẽ, dễ vì muốn nhiều mà vướng vào rắc rối. Sự khát khao giúp bạn hăng hái, nhưng cũng cần được giữ trong giới hạn. Đây là nét hoàn toàn có thể rèn luyện được. Khi biết đủ, bạn sẽ thấy nhẹ nhõm và tự do hơn.", "khuyen": "Trước khi bắt đầu một cuộc chơi, một khoản đầu tư hay một mối tình mới, hãy tự đặt giới hạn và giữ đúng nó."},
  "Thạch trung ẩn ngọc": {"de": "Bạn thuộc mẫu người như viên ngọc trong đá ở mảng đời sống này: lúc trẻ ít người nhận ra, nhưng càng về sau càng tỏa sáng. Giá trị của bạn nằm ở chiều sâu chứ chẳng ở vẻ bề ngoài. Những năm tháng lặng lẽ trau dồi chính là lúc bạn đang mài giũa bản thân. Đến đúng thời điểm, người ta sẽ thấy rõ giá trị ấy.", "khuyen": "Đừng vội phô bày hay so sánh với người khác; cứ kiên trì trau dồi, thời của bạn sẽ đến."},
  "Cự Môn gặp Kình Đà": {"de": "Ở mảng đời sống này, bạn có xu hướng dễ vướng chuyện điều tiếng, tranh cãi hoặc kiện tụng vì lời nói. Đôi khi chỉ một câu nói vội cũng có thể khiến mâu thuẫn kéo dài. Điều này nhắc bạn cân nhắc lời ăn tiếng nói kỹ hơn. Sự điềm tĩnh sẽ giúp bạn tránh được nhiều phiền toái.", "khuyen": "Nói ít, viết rõ, tránh tranh hơn thua bằng lời; việc hệ trọng nên có giấy tờ ghi lại."},
  "Cự Môn hóa Kỵ": {"de": "Ở mảng đời sống này, bạn có xu hướng dễ bị hiểu lầm vì lời nói, đôi khi ý tốt mà người nghe hiểu khác. Lời nói vô tình có thể gây phiền lòng hoặc rắc rối. Đây là lời nhắc dịu dàng để bạn cẩn trọng hơn khi giao tiếp. Khi nói rõ ràng và đúng lúc, bạn sẽ được thấu hiểu hơn.", "khuyen": "Đọc lại tin nhắn, thư từ trước khi gửi và dừng lại một chút trước khi nói điều hệ trọng."},
  "Tài ấm giáp ấn": {"de": "Bạn có xu hướng được người khác nâng đỡ, cơm áo đủ đầy ở mảng đời sống này. Khi có việc lớn, bạn thường được mời gọi hoặc tin tưởng giao phó. Sự hỗ trợ ấy là dịp tốt để bạn khẳng định mình. Đừng ngại nhận trách nhiệm khi được trao.", "khuyen": "Khi được mời nhận việc lớn, hãy mạnh dạn nhận và chuẩn bị chu đáo; nhớ ghi nhận người đã nâng đỡ mình."},
  "Hình Kỵ giáp ấn": {"de": "Ở mảng đời sống này, bạn có xu hướng dễ bị liên lụy, đôi khi phải chịu tiếng thay cho người khác. Lòng tốt của bạn đôi lúc bị đặt vào thế khó. Đây chẳng phải lỗi của bạn, chỉ là lời nhắc cần bảo vệ mình kỹ hơn. Khi mọi thứ minh bạch, bạn sẽ yên tâm hơn.", "khuyen": "Đừng đứng ra bảo lãnh cho người khác, và giữ đầy đủ chứng từ, giấy tờ cho mọi giao dịch."},
  "Tả Hữu đồng cung": {"de": "Bạn thuộc mẫu người hay có người giúp từ nhiều phía ở mảng đời sống này. Làm gì bạn cũng có người góp tay, chia sẻ. Đó là điều may mắn bạn có được nhờ cách sống hòa nhã. Biết trân trọng và đáp lại sẽ giữ cho sự hỗ trợ ấy bền lâu.", "khuyen": "Hãy trả ơn đúng lúc và giữ liên lạc với những người từng giúp mình."},
  "Tả Hữu giáp": {"de": "Bạn có xu hướng được người xung quanh hỗ trợ khi cần ở mảng đời sống này. Hai bên bạn thường có người sẵn lòng đỡ một tay. Chỉ cần bạn mở lời, sự giúp đỡ thường sẽ đến. Đừng ngại chia sẻ khó khăn của mình.", "khuyen": "Cởi mở nhờ giúp khi cần và cũng sẵn lòng giúp lại; sự hỗ trợ hai chiều sẽ ngày càng bền."},
  "Xương Khúc đồng cung": {"de": "Bạn thuộc mẫu người có năng khiếu chữ nghĩa, học giỏi và khéo diễn đạt ở mảng đời sống này. Viết lách, giảng dạy hay thi cử đều là thế mạnh của bạn. Sự tinh tế trong ngôn từ giúp bạn được đánh giá cao. Hãy giữ thói quen đọc và viết để năng khiếu ấy phát triển.", "khuyen": "Tận dụng khả năng viết, dạy, thi cử; một thói quen đọc sách đều đặn sẽ giúp bạn tiến xa."},
  "Xương Khúc giáp": {"de": "Bạn có xu hướng được bao quanh bởi môi trường học thức, những người giỏi chữ nghĩa ở mảng đời sống này. Điều đó giúp bạn dễ tiếp thu và học hỏi. Việc học thêm luôn mang lại lợi ích cho bạn. Hãy tận dụng những người giỏi quanh mình.", "khuyen": "Học thêm bất cứ khi nào có dịp và kết nối với người có kiến thức; mỗi điều học được đều có ích."},
  "Xương Khúc gặp Kỵ": {"de": "Ở mảng đời sống này, bạn có xu hướng dễ gặp sai sót trong giấy tờ, chữ ký hoặc thủ tục. Một chi tiết nhỏ bị bỏ qua có thể gây phiền phức về sau. Đây là lời nhắc để bạn cẩn thận hơn với mọi loại giấy tờ. Khi kiểm tra kỹ, bạn sẽ tránh được những rắc rối chẳng đáng có.", "khuyen": "Đọc kỹ hợp đồng trước khi ký và nhờ người hiểu biết xem lại những giấy tờ hệ trọng."},
  "Tọa quý hướng quý": {"de": "Bạn thuộc mẫu người có người nâng đỡ cả trong lẫn ngoài ở mảng đời sống này. Khi gặp khó, thường có người giúp chỉ đường. Đây là điều may mắn đáng trân trọng. Đừng ngại tìm đến người đi trước để xin lời khuyên.", "khuyen": "Khi gặp khó, hãy chủ động hỏi ý kiến người có kinh nghiệm hoặc người đi trước."},
  "Khôi Việt giáp": {"de": "Bạn có xu hướng gặp người giúp đỡ từ hai phía ở mảng đời sống này. Thi cử, xin việc hay những bước ngoặt lớn thường thuận lợi hơn nhờ có người nâng đỡ. Sự hỗ trợ ấy giúp bạn tự tin hơn. Hãy chuẩn bị tốt để tận dụng những dịp như vậy.", "khuyen": "Chuẩn bị kỹ cho các kỳ thi, buổi phỏng vấn; đừng ngại nhờ người đi trước giới thiệu, hướng dẫn."},
  "Song Lộc": {"de": "Bạn có xu hướng có nhiều nguồn thu, tiền đến từ nhiều ngả ở mảng đời sống này. Sự đa dạng giúp bạn vững vàng hơn khi một nguồn gặp trục trặc. Đây là lợi thế bạn nên tận dụng. Chỉ cần quản lý tốt, các nguồn ấy sẽ cùng sinh sôi.", "khuyen": "Chủ động mở thêm nguồn thu bên cạnh công việc chính và ghi chép thu chi rõ ràng."},
  "Lộc phùng lưỡng sát": {"de": "Ở mảng đời sống này, bạn có xu hướng có tiền nhưng khó giữ, dễ thiệt vì quá tin người. Lòng tin của bạn là nét đẹp, nhưng cần đi kèm sự tỉnh táo. Đây là lời nhắc nhẹ để bạn bảo vệ thành tựu của mình. Khi cẩn trọng hơn, bạn sẽ giữ được những gì đã gây dựng.", "khuyen": "Tránh cho vay số tiền lớn và đừng đầu tư theo lời rủ rê khi chưa tìm hiểu kỹ."},
  "Lộc Kỵ đồng cung": {"de": "Ở mảng đời sống này, bạn có xu hướng gặp tình huống được lợi nhưng đi kèm phiền toái. Mỗi điều tốt đến thường có một điều kiện hoặc rắc rối nhỏ đi theo. Điều này chẳng phải xấu, chỉ là cần cân nhắc kỹ hơn. Khi tính trước những gì phải đánh đổi, bạn sẽ chọn đúng hơn.", "khuyen": "Trước mỗi khoản lợi, hãy tự hỏi mình phải đánh đổi những gì; thấy đáng thì mới nhận."},
  "Lộc Mã giao trì": {"de": "Bạn có xu hướng càng năng động, càng đi xa thì càng có nhiều dịp kiếm tiền ở mảng đời sống này. Sự di chuyển và mở rộng mối quen biết mang lại cho bạn nhiều thuận lợi. Bạn hợp với môi trường sôi động. Hãy tận dụng những chuyến đi để học hỏi và kết nối.", "khuyen": "Bạn hợp với buôn bán, xuất nhập khẩu, công tác xa; hãy chủ động mở rộng thị trường và mối quen biết."},
  "Mã ngộ Không vong": {"de": "Ở mảng đời sống này, bạn có xu hướng bôn ba nhiều nhưng thành tựu chưa tương xứng với công sức. Đôi khi đi nhiều mà trở về tay trắng. Đây chẳng phải lời phán, chỉ nhắc bạn cần định hướng rõ ràng hơn. Khi mỗi bước đi đều có mục tiêu, công sức sẽ được đền đáp.", "khuyen": "Trước mỗi chuyến đi hay dự án, hãy đặt mục tiêu cụ thể và cách đo xem mình đã đạt được chưa."},
  "Chiết túc mã": {"de": "Ở mảng đời sống này, bạn có xu hướng gặp trắc trở khi đi lại, kế hoạch hay bị thay đổi, dời lịch. Điều này có thể gây mệt mỏi nếu bạn quá cứng nhắc. Đây là lời nhắc để bạn chuẩn bị phương án dự phòng. Khi sẵn sàng cho thay đổi, bạn sẽ bình tĩnh hơn.", "khuyen": "Luôn dự phòng thời gian cho mọi chuyến đi và chuẩn bị kế hoạch thay thế khi cần."},
  "Tam Hóa liên châu": {"de": "Bạn thuộc mẫu người có thể đạt được cả tiền bạc, tiếng tăm lẫn vị thế ở mảng đời sống này. Thời thế thường mở ra cho bạn những dịp thuận lợi. Điều cần là bạn sẵn sàng nắm bắt khi thời điểm tới. Sự chuẩn bị tốt sẽ giúp bạn tận dụng trọn vẹn.", "khuyen": "Chuẩn bị sẵn kiến thức và vốn liếng để nắm bắt dịp tốt khi nó đến."},
  "Khoa Quyền Lộc giáp": {"de": "Bạn có xu hướng được thời thế đẩy lên, có những lời mời, dịp may đến từ xung quanh ở mảng đời sống này. Bạn thường được người khác nhìn thấy và tạo điều kiện. Đây là thuận lợi lớn. Đừng để sự do dự làm bạn bỏ lỡ.", "khuyen": "Khi có lời mời hay dịp tốt, hãy cân nhắc nhanh và mạnh dạn nhận; đừng để do dự làm lỡ dịp."},
  "Dương Đà giáp Kỵ": {"de": "Ở mảng đời sống này, bạn có xu hướng gặp những trở ngại dồn dập, cảm giác bế tắc khi mọi thứ cùng đến một lúc. Đây là giai đoạn cần sự bình tĩnh nhiều hơn là cố gắng vội vàng. Lùi một bước để nhìn rõ sẽ giúp bạn tìm ra lối đi. Mọi nút thắt đều có thể gỡ nếu bạn kiên nhẫn.", "khuyen": "Lùi một bước, gỡ từng nút một thay vì xử lý tất cả cùng lúc; tìm người tin cậy để cùng bàn."},
  "Thanh Long gặp Kỵ": {"de": "Bạn có xu hướng từ khó khăn bật ra dịp tốt ở mảng đời sống này. Những trở ngại ban đầu thường lại là bước đệm cho thành công. Sự kiên trì của bạn sẽ được đền đáp. Hãy coi thử thách như một phần của hành trình.", "khuyen": "Kiên trì vượt qua giai đoạn đầu khó khăn; ghi lại bài học từ mỗi lần vấp để bước tiếp vững hơn."},
  "Linh Xương Đà Vũ": {"de": "Ở mảng đời sống này, bạn có xu hướng gặp những giai đoạn thấy bế tắc, nặng nề và dễ đưa ra quyết định vội vàng. Sách xưa coi đây là điều cần đặc biệt để ý khi vận hạn tới, tức những quãng thời gian khó khăn theo chu kỳ. Đây chẳng phải điều chắc chắn sẽ xảy ra, chỉ là lời nhắc để bạn chuẩn bị tinh thần. Có người tin cậy bên cạnh sẽ giúp bạn vượt qua những lúc như vậy.", "khuyen": "Trong giai đoạn khó, đừng quyết việc lớn một mình; hãy tìm người tin cậy để chia sẻ và luôn giữ an toàn, nhất là nơi sông nước."},
  "Lục sát hội tụ": {"de": "Ở mảng đời sống này, bạn có xu hướng gặp nhiều sức ép, cạnh tranh và biến động. Cuộc sống có thể nhiều thử thách hơn người khác. Tuy vậy, chính những thử thách ấy rèn cho bạn bản lĩnh và sức chịu đựng. Khi biết tiết chế cảm xúc, bạn sẽ biến sức ép thành sức mạnh.", "khuyen": "Chọn công việc cần dũng khí, tập kiềm chế nóng giận và luôn giữ an toàn trong đi lại, làm việc."},
  "Song Không": {"de": "Ở mảng đời sống này, bạn có xu hướng có ý tưởng lớn nhưng dễ hụt hẫng khi thực hiện, tiền bạc cũng dễ trôi đi. Đầu óc bạn bay bổng, giàu sáng tạo. Nét này hợp với nghiên cứu, học hỏi hay sáng tạo hơn là đầu cơ. Khi đặt chân vững trên mặt đất, ý tưởng của bạn sẽ thành hiện thực.", "khuyen": "Dồn năng lượng vào nghiên cứu, tu học hoặc sáng tạo; tránh các khoản đầu cơ rủi ro cao."},
  "Thiên Không gặp Kiếp": {"de": "Ở mảng đời sống này, bạn có xu hướng dễ thiệt vì tin người, hoặc kế hoạch bị đổ vỡ giữa chừng. Sự cả tin đôi khi khiến bạn chịu thiệt. Đây là lời nhắc nhẹ để bạn kiểm chứng kỹ hơn. Khi chia nhỏ rủi ro, bạn sẽ an toàn hơn nhiều.", "khuyen": "Kiểm chứng thông tin trước khi tin, và chia nhỏ rủi ro thay vì dồn hết vào một chỗ."},
  "Thiên Không gặp đào hoa": {"de": "Ở mảng đời sống này, bạn có xu hướng gặp những mối duyên đến nhanh nhưng cũng dễ tan. Tình cảm có lúc khiến bạn hụt hẫng. Đây chẳng phải vì bạn thiếu sức hút, mà vì các mối duyên cần thời gian để vững. Khi chậm lại, bạn sẽ nhận ra ai thật lòng.", "khuyen": "Đừng vội cam kết khi mới quen; hãy dành thời gian tìm hiểu để chọn người phù hợp."},
  "Hoa Cái gặp Không": {"de": "Bạn thuộc mẫu người nghiêng về đời sống tinh thần, nghệ thuật và triết lý ở mảng đời sống này. Bạn thích ngẫm nghĩ và tìm ý nghĩa sâu xa. Đây là chiều sâu đáng trân trọng, dù đôi khi khiến bạn hơi tách khỏi đời thường. Giữ cân bằng giữa ngẫm nghĩ và hành động sẽ giúp bạn an yên.", "khuyen": "Tạo một góc riêng để tĩnh tâm, đọc sách hay sáng tác, nhưng vẫn giữ nhịp sống thường ngày với mọi người."},
  "Lưu Hà Kiếp Sát": {"de": "Ở mảng đời sống này, bạn có xu hướng cần cẩn trọng hơn trong chuyện đi lại và các hoạt động có rủi ro. Sách xưa nhắc nên để ý nơi sông nước và giữ gìn thân thể. Đây là lời nhắc phòng ngừa chứ chẳng phải điều chắc chắn. Khi cẩn thận, bạn sẽ an tâm hơn.", "khuyen": "Tuân thủ luật giao thông, cẩn thận khi bơi lội và tránh các hoạt động mạo hiểm thiếu đồ bảo hộ."},
  "Không Kiếp giáp": {"de": "Ở mảng đời sống này, bạn có xu hướng gặp những khoản chi bất ngờ, tiền bạc dễ vơi đi. Đây là lời nhắc để bạn quản lý của cải chặt chẽ hơn. Chẳng có gì đáng lo nếu bạn có kế hoạch. Sự cẩn trọng sẽ giúp bạn giữ được những gì đã gây dựng.", "khuyen": "Giữ của cải ở những nơi an toàn, tránh đầu tư mạo hiểm và luôn có quỹ dự phòng."},
  "Hỏa Linh giáp": {"de": "Ở mảng đời sống này, bạn có xu hướng gặp những chuyện bất ngờ và dễ phản ứng nóng nảy. Cảm xúc của bạn có thể bùng lên nhanh khi bị dồn ép. Đây là nét hoàn toàn có thể rèn luyện. Học cách bình tĩnh sẽ giúp bạn xử lý mọi việc khéo léo hơn.", "khuyen": "Hít thở sâu vài lần trước khi phản ứng, và cho mình thời gian nghĩ kỹ trước khi đưa ra quyết định."},
  "Tứ Linh (Long Phượng Hổ Cái)": {"de": "Bạn thuộc mẫu người có tiếng tăm, được nhiều người trọng vọng ở mảng đời sống này. Bạn có cốt cách và vẻ ngoài dễ gây thiện cảm. Danh tiếng là lợi thế lớn, nhưng cần được giữ gìn. Sự chân thành sẽ giúp tiếng tốt của bạn bền lâu.", "khuyen": "Giữ gìn uy tín và cách ứng xử; mỗi việc làm tốt đều góp phần xây dựng tên tuổi của bạn."},
  "Thai Tọa": {"de": "Bạn có xu hướng có chỗ đứng vững vàng, dễ được trao chức danh hoặc vị trí ở mảng đời sống này. Bạn thường được tin tưởng giao những vai trò có trách nhiệm. Đây là dịp để bạn thể hiện khả năng của mình. Hãy giữ vững vị trí bằng sự tận tâm.", "khuyen": "Bạn hợp với công việc có chức danh rõ ràng; hãy làm tốt vai trò hiện tại để được tin giao thêm."},
  "Quang Quý": {"de": "Bạn có xu hướng nhận được sự giúp đỡ hay ơn huệ bất ngờ ở mảng đời sống này. Những điều tốt thường đến khi bạn chẳng mong đợi. Đây là sự đáp lại cho tấm lòng tốt của bạn. Hãy tiếp tục sống chân thành.", "khuyen": "Sống chân thành, giúp người khi có thể; những điều tốt bạn gieo sẽ quay lại theo cách bất ngờ."},
  "Thai Cáo": {"de": "Bạn có xu hướng được ghi nhận, khen thưởng và có danh dự ở mảng đời sống này. Những cố gắng của bạn thường được nhìn thấy và tôn vinh. Sự ghi nhận đến từ việc bạn bền bỉ làm tốt. Hãy coi đó là nguồn khích lệ để tiếp tục cố gắng.", "khuyen": "Kiên trì làm tốt từng việc; sự ghi nhận đến từ những cố gắng bền bỉ chứ chẳng phải nhất thời."},
  "Khốc Hư ở Tý Ngọ": {"de": "Bạn thuộc mẫu người từng trải, biết biến những nỗi buồn lo thành chiều sâu và tiếng nói có sức nặng ở mảng đời sống này. Lời bạn nói thường được lắng nghe vì chứa đựng trải nghiệm thật. Những điều từng khiến bạn trăn trở giờ trở thành vốn sống. Hãy trân trọng hành trình ấy.", "khuyen": "Biến trải nghiệm buồn thành bài học và chia sẻ với người khác; đó là cách bạn tạo dựng tiếng nói riêng."},
  "Khốc Hư": {"de": "Ở mảng đời sống này, bạn có xu hướng hay buồn lo, đôi khi cảm thấy trống trải trong lòng. Cảm xúc ấy là bình thường và ai cũng có lúc trải qua. Điều cần là bạn đừng để nó kéo dài một mình. Kết nối với người thân sẽ giúp lòng bạn nhẹ hơn.", "khuyen": "Giữ liên lạc với người thân, bạn bè và vận động đều đặn để tinh thần thêm vui."},
  "Tang Hổ": {"de": "Ở mảng đời sống này, bạn có xu hướng cần để ý hơn đến những chuyện buồn trong gia đình, chuyện tranh chấp hoặc an toàn khi đi lại, nhất là trong giai đoạn vận hạn, tức quãng thời gian khó khăn theo chu kỳ. Đây chẳng phải điều chắc chắn sẽ xảy ra, chỉ là lời nhắc để bạn để tâm hơn. Sự chăm lo cho người thân, nhất là người lớn tuổi, sẽ giúp gia đình gắn bó. Cẩn trọng là cách giữ bình an.", "khuyen": "Thường xuyên thăm hỏi người lớn tuổi trong nhà và cẩn thận khi đi lại, nhất là đường xa."},
  "Tam minh Đào Hồng Hỷ": {"de": "Bạn thuộc mẫu người có duyên, được nhiều người yêu mến và thường có nhiều niềm vui ở mảng đời sống này. Sức hút tự nhiên giúp bạn dễ kết nối. Đây là lợi thế lớn trong giao tiếp. Chỉ cần chọn lọc, các mối thân quen sẽ mang lại cho bạn nhiều điều tốt.", "khuyen": "Chọn lọc những mối thân quen thật sự đáng giữ và dành thời gian vun đắp chúng."},
  "Hình Riêu Y": {"de": "Bạn có xu hướng dễ thấu hiểu nỗi khó của người khác và muốn giúp họ vượt qua ở mảng đời sống này. Bạn có năng khiếu với nghề chăm sóc, chữa trị. Đây là món quà ý nghĩa nếu được dùng đúng chỗ. Đôi khi bạn cũng cần chăm sóc chính mình.", "khuyen": "Bạn hợp với ngành chăm sóc sức khỏe, dược, điều dưỡng hoặc tư vấn tâm lý; hãy nhớ dành thời gian nghỉ ngơi cho bản thân."},
  "Cô Quả": {"de": "Ở mảng đời sống này, bạn có xu hướng tự lo liệu một mình, đôi khi cảm thấy lẻ loi. Bạn quen với việc độc lập và ít khi nhờ vả. Sự tự lập là điểm mạnh, nhưng ai cũng cần có người bên cạnh. Mở lòng hơn sẽ giúp bạn tìm được những người hiểu mình.", "khuyen": "Chủ động tìm đến những nhóm, câu lạc bộ có cùng sở thích để kết nối với người hợp mình."}
};
// Nhãn đo "những điều cần phòng" (khác điểm tốt/xấu chung của đại vận ở bước 26 – một vận tốt vẫn có thể có điều cần phòng)
var TVCS_MUC_CONG = { 'Êm': 'Ít điều cần phòng', 'Cần để ý': 'Có vài điều cần để ý', 'Nặng': 'Nên thận trọng', 'Rất nặng': 'Cần thận trọng nhiều' };
var TVCS_HAN_DE = {
  'Thiên Không': 'kỳ vọng dễ hụt, dễ vì tin người mà thiệt', 'Thiên Thương': 'dễ hao tổn, việc của bạn bè hay người dưới quyền kéo theo phiền',
  'Thiên Sứ': 'những việc tồn đọng lâu đến lúc phải giải quyết dứt điểm', 'Địa Không': 'tiền bạc dễ hao, ý tưởng dễ xa thực tế',
  'Địa Kiếp': 'dễ có thay đổi đột ngột về tiền bạc, công việc', 'Kình Dương': 'dễ va chạm, tranh chấp', 'Đà La': 'việc hay chậm, dây dưa',
  'Hỏa Tinh': 'chuyện bột phát, dễ nóng vội', 'Linh Tinh': 'chuyện âm ỉ rồi bất ngờ bùng lên', 'Hóa Kỵ': 'việc hay vướng, dễ bị hiểu lầm',
  'Thiên Hình': 'chuyện giấy tờ, kỷ luật, quy định', 'Tang Môn': 'chuyện buồn trong gia đình', 'Bạch Hổ': 'cần giữ an toàn đi lại, tránh tranh chấp'
};
var TVCS_KHUYEN_CONG = {
  'Êm': 'Đây là lúc nên mạnh dạn làm những việc đã ấp ủ.',
  'Cần để ý': 'Cứ làm việc lớn nhưng chia nhỏ bước đi, giữ một khoản dự phòng.',
  'Nặng': 'Nên đi chậm mà chắc: không bảo lãnh, không vay mượn lớn, chăm lo sức khỏe và các mối quan hệ gần.',
  'Rất nặng': 'Nên giữ thế thủ: ưu tiên sự an toàn, sức khỏe và gia đình; việc lớn bàn với người tin cậy trước khi quyết.'
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
    if (v.cung === 'Thiên Di') de += ' Đây là giai đoạn ra ngoài, đi xa nhiều – chuẩn bị kỹ và giữ an toàn khi di chuyển.';
    if (v.cung === 'Tật Ách') de += ' Giai đoạn nên chăm lo sức khỏe nhiều hơn, giữ nếp sinh hoạt điều độ và khám định kỳ.';
    if (v.cung === 'Nô Bộc') de += ' Nên chọn bạn, chọn cộng sự kỹ; việc chung có giấy tờ rõ ràng.';
    if (v.giai.length) de += trong.length || v.muc !== 'Êm' ? ' Bù lại, giai đoạn này có người nâng đỡ – gặp khó vẫn có lối ra.' : ' Giai đoạn này có người nâng đỡ, dễ gặp quý nhân.';
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
  return tvcsLap_(tuviLapLaSo(input || {}));
}
