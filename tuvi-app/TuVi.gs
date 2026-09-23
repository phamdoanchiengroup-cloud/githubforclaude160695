/**
 * ============================================================
 *  TuVi.gs — BỘ MÁY AN SAO TỬ VI ĐẨU SỐ (12 CUNG)
 *  - An Mệnh, Thân, 12 cung, Ngũ Hổ Độn can cung, Cục
 *  - 14 Chính tinh + Miếu/Vượng/Đắc/Bình/Hãm
 *  - Lục cát, Lục sát, Tứ Hóa, Lộc Tồn, Thiên Mã ... (~ 100 phụ tinh)
 *  - Vòng Bác Sĩ, vòng Thái Tuế, vòng Tràng Sinh, Tuần, Triệt
 *  - Đại hạn, Tiểu hạn, Lưu niên (năm xem)
 *  - Luận giải tự động (cách cục, 12 cung)
 * ============================================================
 */

var CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
var CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
var CAN_HANH = ['Mộc', 'Mộc', 'Hỏa', 'Hỏa', 'Thổ', 'Thổ', 'Kim', 'Kim', 'Thủy', 'Thủy'];
var CHI_HANH = ['Thủy', 'Thổ', 'Mộc', 'Mộc', 'Thổ', 'Hỏa', 'Hỏa', 'Thổ', 'Kim', 'Kim', 'Thổ', 'Thủy'];
var CON_GIAP = ['Chuột', 'Trâu', 'Hổ', 'Mèo', 'Rồng', 'Rắn', 'Ngựa', 'Dê', 'Khỉ', 'Gà', 'Chó', 'Lợn'];
var GIO_CHI = ['23h–01h', '01h–03h', '03h–05h', '05h–07h', '07h–09h', '09h–11h',
  '11h–13h', '13h–15h', '15h–17h', '17h–19h', '19h–21h', '21h–23h'];
var HANH_SINH = ['Mộc', 'Hỏa', 'Thổ', 'Kim', 'Thủy']; // vòng tương sinh

var NAP_AM = [
  ['Hải Trung Kim', 'Kim'], ['Lư Trung Hỏa', 'Hỏa'], ['Đại Lâm Mộc', 'Mộc'], ['Lộ Bàng Thổ', 'Thổ'],
  ['Kiếm Phong Kim', 'Kim'], ['Sơn Đầu Hỏa', 'Hỏa'], ['Giản Hạ Thủy', 'Thủy'], ['Thành Đầu Thổ', 'Thổ'],
  ['Bạch Lạp Kim', 'Kim'], ['Dương Liễu Mộc', 'Mộc'], ['Tuyền Trung Thủy', 'Thủy'], ['Ốc Thượng Thổ', 'Thổ'],
  ['Tích Lịch Hỏa', 'Hỏa'], ['Tùng Bách Mộc', 'Mộc'], ['Trường Lưu Thủy', 'Thủy'], ['Sa Trung Kim', 'Kim'],
  ['Sơn Hạ Hỏa', 'Hỏa'], ['Bình Địa Mộc', 'Mộc'], ['Bích Thượng Thổ', 'Thổ'], ['Kim Bạch Kim', 'Kim'],
  ['Phú Đăng Hỏa', 'Hỏa'], ['Thiên Hà Thủy', 'Thủy'], ['Đại Trạch Thổ', 'Thổ'], ['Thoa Xuyến Kim', 'Kim'],
  ['Tang Đố Mộc', 'Mộc'], ['Đại Khê Thủy', 'Thủy'], ['Sa Trung Thổ', 'Thổ'], ['Thiên Thượng Hỏa', 'Hỏa'],
  ['Thạch Lựu Mộc', 'Mộc'], ['Đại Hải Thủy', 'Thủy']
];

var CUNG_NAMES = ['Mệnh', 'Huynh Đệ', 'Phu Thê', 'Tử Tức', 'Tài Bạch', 'Tật Ách',
  'Thiên Di', 'Nô Bộc', 'Quan Lộc', 'Điền Trạch', 'Phúc Đức', 'Phụ Mẫu'];

var CUC_INFO = {
  'Thủy': { so: 2, ten: 'Thủy Nhị Cục' },
  'Mộc': { so: 3, ten: 'Mộc Tam Cục' },
  'Kim': { so: 4, ten: 'Kim Tứ Cục' },
  'Thổ': { so: 5, ten: 'Thổ Ngũ Cục' },
  'Hỏa': { so: 6, ten: 'Hỏa Lục Cục' }
};

// Miếu (M) – Vượng (V) – Đắc (Đ) – Bình (B) – Hãm (H), theo thứ tự Tý..Hợi
var DO_SANG = {
  'Tử Vi':      ['B', 'Đ', 'M', 'B', 'V', 'M', 'M', 'Đ', 'M', 'B', 'V', 'B'],
  'Thiên Cơ':   ['Đ', 'Đ', 'H', 'M', 'M', 'V', 'Đ', 'Đ', 'V', 'M', 'M', 'H'],
  'Thái Dương': ['H', 'Đ', 'V', 'V', 'V', 'M', 'M', 'Đ', 'H', 'H', 'H', 'H'],
  'Vũ Khúc':    ['V', 'M', 'V', 'Đ', 'M', 'H', 'V', 'M', 'V', 'Đ', 'M', 'H'],
  'Thiên Đồng': ['V', 'H', 'M', 'Đ', 'H', 'Đ', 'H', 'H', 'M', 'H', 'H', 'Đ'],
  'Liêm Trinh': ['V', 'Đ', 'V', 'H', 'M', 'H', 'V', 'Đ', 'V', 'H', 'M', 'H'],
  'Thiên Phủ':  ['M', 'B', 'M', 'B', 'V', 'Đ', 'M', 'Đ', 'M', 'B', 'V', 'Đ'],
  'Thái Âm':    ['V', 'Đ', 'H', 'H', 'H', 'H', 'H', 'Đ', 'V', 'M', 'M', 'M'],
  'Tham Lang':  ['H', 'M', 'Đ', 'H', 'V', 'H', 'H', 'M', 'Đ', 'H', 'V', 'H'],
  'Cự Môn':     ['V', 'H', 'V', 'M', 'H', 'H', 'V', 'H', 'Đ', 'M', 'H', 'Đ'],
  'Thiên Tướng':['V', 'Đ', 'M', 'H', 'V', 'Đ', 'V', 'Đ', 'M', 'H', 'V', 'Đ'],
  'Thiên Lương':['V', 'Đ', 'V', 'V', 'M', 'H', 'M', 'Đ', 'V', 'H', 'M', 'H'],
  'Thất Sát':   ['M', 'Đ', 'M', 'H', 'H', 'V', 'M', 'Đ', 'M', 'H', 'H', 'V'],
  'Phá Quân':   ['M', 'V', 'H', 'H', 'Đ', 'H', 'M', 'V', 'H', 'H', 'Đ', 'H'],
  // một số phụ tinh có xét miếu hãm
  'Văn Xương':  ['H', 'Đ', 'H', 'Đ', 'Đ', 'Đ', 'H', 'Đ', 'H', 'Đ', 'Đ', 'Đ'],
  'Văn Khúc':   ['H', 'Đ', 'H', 'Đ', 'Đ', 'Đ', 'H', 'Đ', 'H', 'Đ', 'Đ', 'Đ'],
  'Kình Dương': ['H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H'],
  'Đà La':      ['H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H'],
  'Hỏa Tinh':   ['H', 'H', 'Đ', 'Đ', 'Đ', 'Đ', 'Đ', 'H', 'H', 'H', 'H', 'H'],
  'Linh Tinh':  ['H', 'H', 'Đ', 'Đ', 'Đ', 'Đ', 'Đ', 'H', 'H', 'H', 'H', 'H'],
  'Địa Không':  ['H', 'H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ'],
  'Địa Kiếp':   ['H', 'H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ']
};
var DO_SANG_TEN = { 'M': 'Miếu', 'V': 'Vượng', 'Đ': 'Đắc', 'B': 'Bình', 'H': 'Hãm' };
var DO_SANG_DIEM = { 'M': 3, 'V': 2, 'Đ': 1, 'B': 0, 'H': -2 };

/**
 * Thông tin sao: [ngũ hành, loại (chinh|cat|hung|trung), mô tả ngắn]
 */
var SAO = {
  'Tử Vi': ['Thổ', 'chinh', 'Đế tinh – quyền uy, phúc thọ, giải ách'],
  'Thiên Cơ': ['Mộc', 'chinh', 'Thiện tinh – mưu trí, linh hoạt, khéo tay'],
  'Thái Dương': ['Hỏa', 'chinh', 'Quý tinh – danh tiếng, nhiệt huyết, cha/chồng'],
  'Vũ Khúc': ['Kim', 'chinh', 'Tài tinh – tiền bạc, cương nghị, quyết đoán'],
  'Thiên Đồng': ['Thủy', 'chinh', 'Phúc tinh – hiền hòa, hưởng thụ, đổi thay'],
  'Liêm Trinh': ['Hỏa', 'chinh', 'Tù tinh – nguyên tắc, pháp lý, tổ chức'],
  'Thiên Phủ': ['Thổ', 'chinh', 'Tài khố – ổn định, bảo thủ, giữ của'],
  'Thái Âm': ['Thủy', 'chinh', 'Phú tinh – điền sản, tinh tế, mẹ/vợ'],
  'Tham Lang': ['Thủy', 'chinh', 'Đào hoa tinh – đa tài, ham muốn, giao tế'],
  'Cự Môn': ['Thủy', 'chinh', 'Ám tinh – ngôn luận, thị phi, lý lẽ'],
  'Thiên Tướng': ['Thủy', 'chinh', 'Ấn tinh – chính trực, nghĩa hiệp, uy nghi'],
  'Thiên Lương': ['Mộc', 'chinh', 'Ấm tinh – che chở, thọ, y dược, giáo hóa'],
  'Thất Sát': ['Kim', 'chinh', 'Tướng tinh – dũng mãnh, quyết liệt, mạo hiểm'],
  'Phá Quân': ['Thủy', 'chinh', 'Hao tinh – phá cũ lập mới, tiên phong'],

  'Tả Phù': ['Thổ', 'cat', 'Trợ tinh – được giúp đỡ, quý nhân'],
  'Hữu Bật': ['Thủy', 'cat', 'Trợ tinh – hỗ trợ, hòa đồng'],
  'Văn Xương': ['Kim', 'cat', 'Văn tinh – học vấn, khoa bảng, văn chương'],
  'Văn Khúc': ['Thủy', 'cat', 'Văn tinh – tài nghệ, ăn nói, nghệ thuật'],
  'Thiên Khôi': ['Hỏa', 'cat', 'Quý nhân (dương) – đỗ đạt, được nâng đỡ'],
  'Thiên Việt': ['Hỏa', 'cat', 'Quý nhân (âm) – cơ hội, may mắn'],
  'Lộc Tồn': ['Thổ', 'cat', 'Lộc tinh – tài lộc, giữ của, cẩn trọng'],
  'Thiên Mã': ['Hỏa', 'cat', 'Dịch mã – di chuyển, năng động, thay đổi'],
  'Hóa Lộc': ['Mộc', 'cat', 'Tài lộc, thuận lợi, sinh sôi'],
  'Hóa Quyền': ['Mộc', 'cat', 'Quyền lực, uy tín, năng lực chủ động'],
  'Hóa Khoa': ['Thủy', 'cat', 'Danh tiếng, khoa cử, giải hung'],
  'Hóa Kỵ': ['Thủy', 'hung', 'Trở ngại, ghen ghét, u uẩn, thị phi'],
  'Kình Dương': ['Kim', 'hung', 'Sát tinh – cương mãnh, tranh đấu, thương tích'],
  'Đà La': ['Kim', 'hung', 'Sát tinh – trì trệ, dây dưa, ám hại'],
  'Hỏa Tinh': ['Hỏa', 'hung', 'Sát tinh – nóng nảy, bột phát, hỏa hoạn'],
  'Linh Tinh': ['Hỏa', 'hung', 'Sát tinh – âm ỉ, bất ngờ, tai biến'],
  'Địa Không': ['Hỏa', 'hung', 'Sát tinh – hao tán, hư không, ý tưởng lạ'],
  'Địa Kiếp': ['Hỏa', 'hung', 'Sát tinh – kiếp đoạt, thăng trầm đột ngột'],
  'Thiên Hình': ['Hỏa', 'hung', 'Hình pháp, kỷ luật, dao kéo, phẫu thuật'],
  'Thiên Riêu': ['Thủy', 'hung', 'Đa tình, mê hoặc, u buồn'],
  'Thiên Y': ['Thủy', 'cat', 'Y dược, chữa bệnh'],
  'Hồng Loan': ['Thủy', 'cat', 'Hôn nhân, duyên tình, nhan sắc'],
  'Thiên Hỷ': ['Thủy', 'cat', 'Hỷ sự, vui mừng'],
  'Đào Hoa': ['Mộc', 'cat', 'Duyên dáng, tình cảm, giao tế'],
  'Thiên Khốc': ['Kim', 'hung', 'Buồn khóc, âu lo (đắc địa: danh tiếng)'],
  'Thiên Hư': ['Thủy', 'hung', 'Hư hao, trống rỗng, lo âu'],
  'Long Trì': ['Thủy', 'cat', 'Văn nhã, khoa danh, nhà cửa'],
  'Phượng Các': ['Thổ', 'cat', 'Thanh cao, khoa danh, hỷ sự'],
  'Giải Thần': ['Mộc', 'cat', 'Giải trừ tai ách'],
  'Tam Thai': ['Thủy', 'cat', 'Địa vị, danh vọng'],
  'Bát Tọa': ['Mộc', 'cat', 'Địa vị, xe cộ, uy thế'],
  'Ân Quang': ['Mộc', 'cat', 'Ân huệ, được ban thưởng'],
  'Thiên Quý': ['Thổ', 'cat', 'Quý hiển, được giúp đỡ'],
  'Thiên Đức': ['Hỏa', 'cat', 'Phúc đức, giải hung'],
  'Nguyệt Đức': ['Hỏa', 'cat', 'Nhân hậu, giải hung'],
  'Thiên Quan': ['Hỏa', 'cat', 'Quý nhân, quan lộc'],
  'Thiên Phúc': ['Thổ', 'cat', 'Phúc thiện, may mắn'],
  'Thiên Trù': ['Thổ', 'cat', 'Ăn uống, bếp núc, lộc ăn'],
  'Quốc Ấn': ['Thổ', 'cat', 'Ấn tín, chức vụ'],
  'Đường Phù': ['Mộc', 'cat', 'Danh vọng, nhà cửa'],
  'Thai Phụ': ['Kim', 'cat', 'Danh giá, văn tài'],
  'Phong Cáo': ['Thổ', 'cat', 'Bằng sắc, khen thưởng'],
  'Thiên Tài': ['Thổ', 'cat', 'Tài năng, trí tuệ'],
  'Thiên Thọ': ['Thổ', 'cat', 'Thọ, hiền lành'],
  'Hoa Cái': ['Kim', 'cat', 'Nghệ thuật, tôn giáo, kiêu hãnh'],
  'Thiên Giải': ['Hỏa', 'cat', 'Giải trừ tai họa'],
  'Địa Giải': ['Thổ', 'cat', 'Giải trừ tai họa'],
  'Cô Thần': ['Thổ', 'hung', 'Cô độc, lẻ loi'],
  'Quả Tú': ['Thổ', 'hung', 'Cô quả, đơn chiếc'],
  'Kiếp Sát': ['Hỏa', 'hung', 'Tai nạn, cướp đoạt'],
  'Phá Toái': ['Hỏa', 'hung', 'Hao tổn, đổ vỡ'],
  'Lưu Hà': ['Thủy', 'hung', 'Tai nạn sông nước, máu huyết'],
  'Thiên Không': ['Hỏa', 'hung', 'Hư không, lừa dối, mất mát'],
  'Đẩu Quân': ['Hỏa', 'hung', 'Nghiêm khắc, cô độc (Nguyệt tướng)'],
  'Thiên La': ['Thổ', 'hung', 'Lưới trời – bó buộc'],
  'Địa Võng': ['Thổ', 'hung', 'Lưới đất – vướng mắc'],
  'Thiên Thương': ['Thổ', 'hung', 'Hao tổn, tang thương'],
  'Thiên Sứ': ['Thủy', 'hung', 'Tai ách, tin buồn'],
  // Vòng Bác Sĩ
  'Bác Sĩ': ['Thủy', 'cat', 'Thông minh, học rộng'],
  'Lực Sĩ': ['Hỏa', 'cat', 'Sức mạnh, quyền lực'],
  'Thanh Long': ['Thủy', 'cat', 'Hỷ sự, may mắn'],
  'Tiểu Hao': ['Hỏa', 'hung', 'Hao tán nhỏ'],
  'Tướng Quân': ['Mộc', 'cat', 'Uy dũng, quyền hành'],
  'Tấu Thư': ['Kim', 'cat', 'Văn thư, ăn nói'],
  'Phi Liêm': ['Hỏa', 'hung', 'Nhanh nhẹn, thị phi'],
  'Hỷ Thần': ['Hỏa', 'cat', 'Vui vẻ, hỷ sự'],
  'Bệnh Phù': ['Thổ', 'hung', 'Bệnh tật'],
  'Đại Hao': ['Hỏa', 'hung', 'Hao tán lớn'],
  'Phục Binh': ['Hỏa', 'hung', 'Tiểu nhân ngầm'],
  'Quan Phủ': ['Hỏa', 'hung', 'Kiện tụng, giấy tờ'],
  // Vòng Thái Tuế
  'Thái Tuế': ['Hỏa', 'trung', 'Uy nghi, ngôn luận, thị phi'],
  'Thiếu Dương': ['Hỏa', 'cat', 'Thông minh, vui vẻ'],
  'Tang Môn': ['Mộc', 'hung', 'Tang thương, buồn phiền'],
  'Thiếu Âm': ['Thủy', 'cat', 'Hiền hòa, phúc nhẹ'],
  'Quan Phù': ['Hỏa', 'hung', 'Kiện cáo, giấy tờ'],
  'Tử Phù': ['Kim', 'hung', 'Buồn thương, trở ngại'],
  'Tuế Phá': ['Hỏa', 'hung', 'Phá tán, bướng bỉnh'],
  'Long Đức': ['Thủy', 'cat', 'Phúc đức, giải hung'],
  'Bạch Hổ': ['Kim', 'hung', 'Tai nạn, tang, kiện tụng'],
  'Phúc Đức': ['Thổ', 'cat', 'Phúc đức, giải hung'],
  'Điếu Khách': ['Hỏa', 'hung', 'Tin buồn, khoác lác'],
  'Trực Phù': ['Kim', 'hung', 'Buồn phiền, trở ngại'],
  // Vòng Tràng Sinh
  'Tràng Sinh': ['Thủy', 'cat', 'Sinh sôi, khởi đầu'],
  'Mộc Dục': ['Thủy', 'hung', 'Tắm gội – đào hoa, thay đổi'],
  'Quan Đới': ['Kim', 'cat', 'Chuẩn bị thành đạt'],
  'Lâm Quan': ['Kim', 'cat', 'Thành đạt, có chức vị'],
  'Đế Vượng': ['Kim', 'cat', 'Cực thịnh, mạnh mẽ'],
  'Suy': ['Thủy', 'hung', 'Suy giảm'],
  'Bệnh': ['Hỏa', 'hung', 'Yếu đau'],
  'Tử': ['Hỏa', 'hung', 'Ngưng trệ'],
  'Mộ': ['Thổ', 'trung', 'Tàng trữ, tích lũy'],
  'Tuyệt': ['Thổ', 'hung', 'Cùng cực, đứt đoạn'],
  'Thai': ['Thổ', 'trung', 'Thai nghén, ấp ủ'],
  'Dưỡng': ['Mộc', 'cat', 'Nuôi dưỡng, bồi đắp']
};

var VONG_BAC_SI = ['Bác Sĩ', 'Lực Sĩ', 'Thanh Long', 'Tiểu Hao', 'Tướng Quân', 'Tấu Thư',
  'Phi Liêm', 'Hỷ Thần', 'Bệnh Phù', 'Đại Hao', 'Phục Binh', 'Quan Phủ'];
var VONG_THAI_TUE = ['Thái Tuế', 'Thiếu Dương', 'Tang Môn', 'Thiếu Âm', 'Quan Phù', 'Tử Phù',
  'Tuế Phá', 'Long Đức', 'Bạch Hổ', 'Phúc Đức', 'Điếu Khách', 'Trực Phù'];
var VONG_TRANG_SINH = ['Tràng Sinh', 'Mộc Dục', 'Quan Đới', 'Lâm Quan', 'Đế Vượng', 'Suy',
  'Bệnh', 'Tử', 'Mộ', 'Tuyệt', 'Thai', 'Dưỡng'];

// Tứ Hóa theo can năm: [Lộc, Quyền, Khoa, Kỵ] (phái Việt Nam – Thái Thứ Lang)
var TU_HOA = [
  ['Liêm Trinh', 'Phá Quân', 'Vũ Khúc', 'Thái Dương'],
  ['Thiên Cơ', 'Thiên Lương', 'Tử Vi', 'Thái Âm'],
  ['Thiên Đồng', 'Thiên Cơ', 'Văn Xương', 'Liêm Trinh'],
  ['Thái Âm', 'Thiên Đồng', 'Thiên Cơ', 'Cự Môn'],
  ['Tham Lang', 'Thái Âm', 'Hữu Bật', 'Thiên Cơ'],
  ['Vũ Khúc', 'Tham Lang', 'Thiên Lương', 'Văn Khúc'],
  ['Thái Dương', 'Vũ Khúc', 'Thái Âm', 'Thiên Đồng'],
  ['Cự Môn', 'Thái Dương', 'Văn Khúc', 'Văn Xương'],
  ['Thiên Lương', 'Tử Vi', 'Thiên Phủ', 'Vũ Khúc'],
  ['Phá Quân', 'Cự Môn', 'Thái Âm', 'Tham Lang']
];
var HOA_TEN = ['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Hóa Kỵ'];

var LOC_TON_POS = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0];
var KHOI_POS = [1, 0, 11, 11, 1, 0, 6, 6, 3, 3];
var VIET_POS = [7, 8, 9, 9, 7, 8, 2, 2, 5, 5];
var LUU_HA_POS = [9, 10, 7, 8, 5, 6, 4, 3, 11, 2];
var THIEN_TRU_POS = [5, 6, 0, 5, 6, 8, 2, 6, 9, 10];
var THIEN_QUAN_POS = [7, 4, 5, 2, 3, 9, 11, 9, 10, 6];
var THIEN_PHUC_POS = [9, 8, 0, 11, 3, 2, 6, 5, 6, 5];

var MENH_CHU = ['Tham Lang', 'Cự Môn', 'Lộc Tồn', 'Văn Khúc', 'Liêm Trinh', 'Vũ Khúc',
  'Phá Quân', 'Vũ Khúc', 'Liêm Trinh', 'Văn Khúc', 'Lộc Tồn', 'Cự Môn'];
var THAN_CHU = ['Linh Tinh', 'Thiên Tướng', 'Thiên Lương', 'Thiên Đồng', 'Văn Xương', 'Thiên Cơ',
  'Hỏa Tinh', 'Thiên Tướng', 'Thiên Lương', 'Thiên Đồng', 'Văn Xương', 'Thiên Cơ'];

/* ------------------------ Tiện ích ------------------------ */
function mod12(x) { return ((x % 12) + 12) % 12; }
function mod10(x) { return ((x % 10) + 10) % 10; }
function canChiIndex(can, chi) { return ((6 * can - 5 * chi) % 60 + 60) % 60; }
function napAm(can, chi) {
  var n = NAP_AM[Math.floor(canChiIndex(can, chi) / 2)];
  return { ten: n[0], hanh: n[1] };
}
/** Quan hệ ngũ hành a -> b : 'binh'|'sinh'(a sinh b)|'khac'(a khắc b)|'bi_khac'(b khắc a)|'duoc_sinh'(b sinh a) */
function quanHeHanh(a, b) {
  var d = (HANH_SINH.indexOf(b) - HANH_SINH.indexOf(a) + 5) % 5;
  return ['binh', 'sinh', 'khac', 'bi_khac', 'duoc_sinh'][d];
}
function canChiText(can, chi) { return CAN[can] + ' ' + CHI[chi]; }

/* ============================================================
 *  HÀM CHÍNH: LẬP LÁ SỐ TỬ VI
 *  input: {name, gender:'nam'|'nu', calendar:'duong'|'am', day, month, year,
 *          hour, minute, leap, viewYear, lateRat, leapMode, trueSolar, longitude}
 * ============================================================ */
function tuviLapLaSo(input) {
  var t = chuanHoaThoiGian_(input);
  var ld = t.lunar;
  var hourChi = Math.floor((t.hour + 1) / 2) % 12;

  var yCan = mod10(ld.year + 6), yChi = mod12(ld.year + 8);
  var male = input.gender !== 'nu';
  var duong = yCan % 2 === 0;
  var thuan = (duong && male) || (!duong && !male); // Dương Nam, Âm Nữ -> thuận
  var amDuongTen = (duong ? 'Dương ' : 'Âm ') + (male ? 'Nam' : 'Nữ');

  // Tháng dùng để an sao (xử lý tháng nhuận)
  var m = ld.month;
  if (ld.leap && input.leapMode === 'split' && ld.day > 15) m = m % 12 + 1;
  var d = ld.day;

  // --- Mệnh, Thân ---
  var menh = mod12(2 + (m - 1) - hourChi);
  var than = mod12(2 + (m - 1) + hourChi);

  // --- Can các cung (Ngũ Hổ Độn) ---
  var canDan = mod10((yCan % 5) * 2 + 2);
  var palaces = [];
  for (var c = 0; c < 12; c++) {
    palaces.push({
      chi: c, chiTen: CHI[c], can: mod10(canDan + mod12(c - 2)),
      chinh: [], cat: [], hung: [], tieu: [], luu: [],
      tuan: false, triet: false
    });
    palaces[c].canTen = CAN[palaces[c].can];
  }
  for (var k = 0; k < 12; k++) {
    var p = palaces[mod12(menh - k)];
    p.cung = CUNG_NAMES[k];
    p.cungIdx = k;
  }
  palaces[than].isThan = true;

  // --- Cục ---
  var menhNapAm = napAm(palaces[menh].can, menh);
  var cuc = CUC_INFO[menhNapAm.hanh];
  var cucSo = cuc.so;

  var pos = {}; // tên sao -> vị trí
  function an(name, at, extra) {
    at = mod12(at);
    pos[name] = at;
    var info = SAO[name] || ['Thổ', 'trung', ''];
    var star = { n: name, h: info[0], t: info[1] };
    if (DO_SANG[name]) star.b = DO_SANG[name][at];
    if (extra) for (var key in extra) star[key] = extra[key];
    var P = palaces[at];
    if (info[1] === 'chinh') P.chinh.push(star);
    else if (info[1] === 'cat') P.cat.push(star);
    else if (info[1] === 'hung') P.hung.push(star);
    else P.tieu.push(star);
    return star;
  }

  // --- An Tử Vi ---
  var q = Math.ceil(d / cucSo);
  var r = q * cucSo - d;
  var tuVi = r % 2 === 0 ? mod12(2 + (q - 1) + r) : mod12(2 + (q - 1) - r);
  var thienPhu = mod12(4 - tuVi);

  an('Tử Vi', tuVi);
  an('Thiên Cơ', tuVi - 1);
  an('Thái Dương', tuVi - 3);
  an('Vũ Khúc', tuVi - 4);
  an('Thiên Đồng', tuVi - 5);
  an('Liêm Trinh', tuVi - 8);
  an('Thiên Phủ', thienPhu);
  an('Thái Âm', thienPhu + 1);
  an('Tham Lang', thienPhu + 2);
  an('Cự Môn', thienPhu + 3);
  an('Thiên Tướng', thienPhu + 4);
  an('Thiên Lương', thienPhu + 5);
  an('Thất Sát', thienPhu + 6);
  an('Phá Quân', thienPhu + 10);

  // --- Sao theo tháng ---
  var taPhu = mod12(4 + m - 1), huuBat = mod12(10 - (m - 1));
  an('Tả Phù', taPhu);
  an('Hữu Bật', huuBat);
  an('Thiên Hình', 9 + m - 1);
  an('Thiên Riêu', 1 + m - 1);
  an('Thiên Y', 1 + m - 1);
  an('Thiên Giải', 8 + m - 1);
  an('Địa Giải', 7 + m - 1);

  // --- Sao theo giờ ---
  var vanXuong = mod12(10 - hourChi), vanKhuc = mod12(4 + hourChi);
  an('Văn Xương', vanXuong);
  an('Văn Khúc', vanKhuc);
  an('Địa Kiếp', 11 + hourChi);
  an('Địa Không', 11 - hourChi);
  an('Thai Phụ', 6 + hourChi);
  an('Phong Cáo', 2 + hourChi);

  // --- Sao theo ngày ---
  an('Tam Thai', taPhu + d - 1);
  an('Bát Tọa', huuBat - (d - 1));
  an('Ân Quang', vanXuong + d - 2);
  an('Thiên Quý', vanKhuc - d + 2);

  // --- Sao theo can năm ---
  var locTon = LOC_TON_POS[yCan];
  an('Lộc Tồn', locTon);
  an('Kình Dương', locTon + 1);
  an('Đà La', locTon - 1);
  an('Thiên Khôi', KHOI_POS[yCan]);
  an('Thiên Việt', VIET_POS[yCan]);
  an('Lưu Hà', LUU_HA_POS[yCan]);
  an('Thiên Trù', THIEN_TRU_POS[yCan]);
  an('Thiên Quan', THIEN_QUAN_POS[yCan]);
  an('Thiên Phúc', THIEN_PHUC_POS[yCan]);
  an('Quốc Ấn', locTon + 8);
  an('Đường Phù', locTon + 5);

  // Vòng Bác Sĩ (bắt đầu tại Lộc Tồn)
  for (var i = 0; i < 12; i++) {
    pos[VONG_BAC_SI[i]] = mod12(locTon + (thuan ? i : -i));
    palaces[pos[VONG_BAC_SI[i]]].bacSi = VONG_BAC_SI[i];
  }

  // --- Sao theo chi năm ---
  for (i = 0; i < 12; i++) {
    pos['TT.' + VONG_THAI_TUE[i]] = mod12(yChi + i);
    palaces[mod12(yChi + i)].thaiTue = VONG_THAI_TUE[i];
  }
  an('Thiên Không', yChi + 1);
  an('Long Trì', 4 + yChi);
  an('Phượng Các', 10 - yChi);
  an('Giải Thần', 10 - yChi);
  an('Thiên Khốc', 6 - yChi);
  an('Thiên Hư', 6 + yChi);
  an('Hồng Loan', 3 - yChi);
  an('Thiên Hỷ', 3 - yChi + 6);
  an('Thiên Đức', 9 + yChi);
  an('Nguyệt Đức', 5 + yChi);

  var nhom = yChi % 4; // 0: Thân Tý Thìn, 1: Tỵ Dậu Sửu, 2: Dần Ngọ Tuất, 3: Hợi Mão Mùi
  var MA = [2, 11, 8, 5], DAO = [9, 6, 3, 0], CAI = [4, 1, 10, 7], KIEP = [5, 2, 11, 8];
  an('Thiên Mã', MA[nhom]);
  an('Đào Hoa', DAO[nhom]);
  an('Hoa Cái', CAI[nhom]);
  an('Kiếp Sát', KIEP[nhom]);

  var phuong = Math.floor(mod12(yChi - 2) / 3); // 0: Dần Mão Thìn, 1: Tỵ Ngọ Mùi, 2: Thân Dậu Tuất, 3: Hợi Tý Sửu
  an('Cô Thần', [5, 8, 11, 2][phuong]);
  an('Quả Tú', [1, 4, 7, 10][phuong]);
  an('Phá Toái', [5, 1, 9][yChi % 3]); // Tý Ngọ Mão Dậu: Tỵ | Sửu Mùi Thìn Tuất: Sửu | Dần Thân Tỵ Hợi: Dậu
  an('Thiên Tài', menh + yChi);
  an('Thiên Thọ', than + yChi);
  an('Đẩu Quân', yChi - (m - 1) + hourChi);
  an('Thiên La', 4);
  an('Địa Võng', 10);
  an('Thiên Thương', mod12(menh - 7));  // cung Nô Bộc
  an('Thiên Sứ', mod12(menh - 5));      // cung Tật Ách

  // Hỏa Tinh – Linh Tinh
  var HOA_START = [2, 3, 1, 9], LINH_START = [10, 10, 3, 10]; // theo nhóm tam hợp như trên
  var hoaDir = thuan ? 1 : -1;
  an('Hỏa Tinh', HOA_START[nhom] + hoaDir * hourChi);
  an('Linh Tinh', LINH_START[nhom] - hoaDir * hourChi);

  // --- Tứ Hóa (gắn cạnh sao được hóa) ---
  for (i = 0; i < 4; i++) {
    var sName = TU_HOA[yCan][i];
    var sp = pos[sName];
    an(HOA_TEN[i], sp, { hoaOf: sName });
    markHoa_(palaces[sp], sName, HOA_TEN[i]);
  }

  // --- Vòng Tràng Sinh ---
  var tsStart = { 'Thủy': 8, 'Thổ': 8, 'Mộc': 11, 'Kim': 5, 'Hỏa': 2 }[menhNapAm.hanh];
  for (i = 0; i < 12; i++) {
    var tsp = mod12(tsStart + (thuan ? i : -i));
    palaces[tsp].trangSinh = VONG_TRANG_SINH[i];
    pos[VONG_TRANG_SINH[i]] = tsp;
  }

  // --- Tuần, Triệt ---
  var trietStart = [8, 6, 4, 2, 0][yCan % 5];
  palaces[trietStart].triet = true;
  palaces[trietStart + 1].triet = true;
  var tuanStart = mod12(yChi - yCan);
  palaces[mod12(tuanStart - 2)].tuan = true;
  palaces[mod12(tuanStart - 1)].tuan = true;

  // --- Đại hạn ---
  for (i = 0; i < 12; i++) {
    var dp = mod12(menh + (thuan ? i : -i));
    palaces[dp].daiHan = cucSo + i * 10;
  }
  // --- Tiểu hạn ---
  var thStart = [10, 7, 4, 1][nhom]; // Thân Tý Thìn: Tuất | Tỵ Dậu Sửu: Mùi | Dần Ngọ Tuất: Thìn | Hợi Mão Mùi: Sửu
  for (i = 0; i < 12; i++) {
    var tp = mod12(thStart + (male ? i : -i));
    palaces[tp].tieuHanChi = mod12(yChi + i);
    palaces[tp].tieuHan = CHI[mod12(yChi + i)];
  }

  // --- Lưu niên ---
  var vy = parseInt(input.viewYear, 10) || new Date().getFullYear();
  var vCan = mod10(vy + 6), vChi = mod12(vy + 8);
  var tuoi = vy - ld.year + 1;
  var daiHanNow = -1, tieuHanNow = -1;
  for (i = 0; i < 12; i++) {
    var P = palaces[i];
    if (tuoi >= P.daiHan && tuoi <= P.daiHan + 9) { P.isDaiHan = true; daiHanNow = i; }
    if (P.tieuHanChi === vChi) { P.isTieuHan = true; tieuHanNow = i; }
  }
  function luu(name, at) { palaces[mod12(at)].luu.push(name); }
  luu('L.Thái Tuế', vChi);
  luu('L.Tang Môn', vChi + 2);
  luu('L.Bạch Hổ', vChi + 8);
  luu('L.Thiên Khốc', 6 - vChi);
  luu('L.Thiên Hư', 6 + vChi);
  luu('L.Lộc Tồn', LOC_TON_POS[vCan]);
  luu('L.Kình Dương', LOC_TON_POS[vCan] + 1);
  luu('L.Đà La', LOC_TON_POS[vCan] - 1);
  luu('L.Thiên Mã', MA[vChi % 4]);
  for (i = 0; i < 4; i++) luu('L.' + HOA_TEN[i], pos[TU_HOA[vCan][i]]);

  // Đại hạn năm xem: tứ hóa theo can cung đại hạn
  if (daiHanNow >= 0) {
    var dhCan = palaces[daiHanNow].can;
    for (i = 0; i < 4; i++) palaces[pos[TU_HOA[dhCan][i]]].luu.push('ĐV.' + HOA_TEN[i]);
  }

  // Tính điểm từng cung
  for (i = 0; i < 12; i++) palaces[i].diem = diemCung_(palaces[i]);

  var info = {
    name: input.name || 'Vô Danh',
    gender: male ? 'Nam' : 'Nữ', male: male,
    yCan: yCan, yChi: yChi, thangAn: m, ngayAn: d,
    solar: t.solar, lunar: ld, hour: t.hour, minute: t.minute,
    hourChi: hourChi, gioTen: CHI[hourChi] + ' (' + GIO_CHI[hourChi] + ')',
    canNam: CAN[yCan], chiNam: CHI[yChi], namCanChi: canChiText(yCan, yChi), conGiap: CON_GIAP[yChi],
    thangCanChi: canChiText(mod10(canDan + m - 1), mod12(m + 1)),
    ngayCanChi: canChiText(mod10(t.jd + 9), mod12(t.jd + 1)),
    gioCanChi: canChiText(mod10((mod10(t.jd + 9) % 5) * 2 + hourChi), hourChi),
    amDuong: amDuongTen, thuan: thuan,
    banMenh: napAm(yCan, yChi), menhNapAm: menhNapAm,
    cuc: cuc.ten, cucSo: cucSo, cucHanh: menhNapAm.hanh,
    menh: menh, than: than, thanCu: palaces[than].cung,
    menhChu: MENH_CHU[menh], thanChu: THAN_CHU[yChi],
    viewYear: vy, viewCanChi: canChiText(vCan, vChi), tuoi: tuoi,
    daiHanNow: daiHanNow, tieuHanNow: tieuHanNow,
    notes: t.notes
  };

  var chart = { info: info, palaces: palaces, pos: pos };
  chart.luanGiai = tuviLuanGiai_(chart);
  return chart;
}

function markHoa_(P, starName, hoa) {
  var lists = [P.chinh, P.cat, P.hung, P.tieu];
  for (var i = 0; i < lists.length; i++) {
    for (var j = 0; j < lists[i].length; j++) {
      if (lists[i][j].n === starName) lists[i][j].hoa = hoa.replace('Hóa ', '');
    }
  }
}

/**
 * Chuẩn hóa thời gian sinh: trả về ngày dương, âm, giờ, JD ngày (đã xét giờ Tý muộn)
 */
function chuanHoaThoiGian_(input) {
  var notes = [];
  var day = parseInt(input.day, 10), month = parseInt(input.month, 10), year = parseInt(input.year, 10);
  var hour = parseInt(input.hour, 10) || 0, minute = parseInt(input.minute, 10) || 0;
  if (!(year >= 1800 && year <= 2200)) throw new Error('Năm sinh cần trong khoảng 1800 – 2200.');
  if (!(month >= 1 && month <= 12) || !(day >= 1 && day <= 31)) throw new Error('Ngày/tháng không hợp lệ.');
  if (!(hour >= 0 && hour <= 23) || !(minute >= 0 && minute <= 59)) throw new Error('Giờ/phút không hợp lệ.');

  var solar;
  if (input.calendar === 'am') {
    var s = lunarToSolar(day, month, year, input.leap ? 1 : 0, LUNAR_TZ);
    if (!s) {
      throw new Error(input.leap ? 'Năm âm lịch ' + year + ' không có tháng ' + month + ' nhuận (hoặc ngày vượt quá số ngày của tháng).'
        : 'Ngày âm lịch không hợp lệ (tháng ' + month + ' năm ' + year + ' có thể chỉ có 29 ngày).');
    }
    solar = { day: s.day, month: s.month, year: s.year };
  } else {
    var back = jdToDate(jdFromDate(day, month, year));
    if (back[0] !== day || back[1] !== month) throw new Error('Ngày dương lịch không tồn tại.');
    solar = { day: day, month: month, year: year };
  }

  var jd = jdFromDate(solar.day, solar.month, solar.year);
  var totalMin = hour * 60 + minute;

  // Hiệu chỉnh giờ mặt trời thực (tùy chọn)
  if (input.trueSolar) {
    var lon = parseFloat(input.longitude);
    if (isNaN(lon)) lon = 105.85;
    var N = jd - jdFromDate(1, 1, solar.year) + 1;
    var B = 2 * Math.PI * (N - 81) / 364;
    var eot = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
    var delta = Math.round((lon - LUNAR_TZ * 15) * 4 + eot);
    totalMin += delta;
    notes.push('Đã hiệu chỉnh giờ mặt trời thực: ' + (delta >= 0 ? '+' : '') + delta + ' phút (kinh độ ' + lon + '°).');
    while (totalMin < 0) { totalMin += 1440; jd -= 1; }
    while (totalMin >= 1440) { totalMin -= 1440; jd += 1; }
  }
  var h = Math.floor(totalMin / 60), mi = totalMin % 60;
  var sd = jdToDate(jd);
  var solarTrue = { day: sd[0], month: sd[1], year: sd[2] };

  var jdDay = jd;
  if (h === 23 && input.lateRat !== false) {
    jdDay = jd + 1;
    notes.push('Sinh giờ Tý muộn (23h–24h): ngày âm và trụ ngày được tính sang hôm sau.');
  }
  var dd = jdToDate(jdDay);
  var lunar = solarToLunar(dd[0], dd[1], dd[2], LUNAR_TZ);
  if (lunar.leap) notes.push('Sinh vào tháng ' + lunar.month + ' nhuận – ' +
    (input.leapMode === 'split' ? 'nửa đầu tính tháng trước, từ ngày 16 tính tháng sau.' : 'an sao như tháng ' + lunar.month + ' thường.'));

  return {
    solar: solar, solarTrue: solarTrue, lunar: lunar, jd: jdDay, jdClock: jd,
    hour: h, minute: mi, totalMin: totalMin, notes: notes
  };
}

/** Điểm cát hung của một cung */
function diemCung_(P) {
  var s = 0;
  P.chinh.forEach(function (st) {
    s += DO_SANG_DIEM[st.b] || 0;
  });
  var big = { 'Tả Phù': 1.5, 'Hữu Bật': 1.5, 'Văn Xương': 1.5, 'Văn Khúc': 1.5, 'Thiên Khôi': 1.5, 'Thiên Việt': 1.5,
    'Lộc Tồn': 2, 'Hóa Lộc': 2, 'Hóa Quyền': 1.5, 'Hóa Khoa': 1.5, 'Thiên Mã': 1 };
  var bad = { 'Kình Dương': 1.5, 'Đà La': 1.5, 'Hỏa Tinh': 1.5, 'Linh Tinh': 1.5, 'Địa Không': 2, 'Địa Kiếp': 2, 'Hóa Kỵ': 2 };
  P.cat.forEach(function (st) { s += big[st.n] || 0.4; });
  P.hung.forEach(function (st) {
    var w = bad[st.n] || 0.4;
    if (st.b === 'Đ') w = w / 2;
    s -= w;
  });
  if (P.tuan || P.triet) s = s * 0.6;
  return Math.round(s * 10) / 10;
}

/* ============================================================
 *                     LUẬN GIẢI TỬ VI
 * ============================================================ */
var Y_NGHIA_CUNG = {
  'Mệnh': 'bản thân, tính cách, tài năng và khuynh hướng cả đời',
  'Huynh Đệ': 'anh chị em, người ngang hàng thân thiết',
  'Phu Thê': 'hôn nhân, người phối ngẫu và chuyện tình cảm',
  'Tử Tức': 'con cái, học trò, khả năng sáng tạo',
  'Tài Bạch': 'tiền bạc, cách kiếm và giữ tài sản',
  'Tật Ách': 'sức khỏe, bệnh tật và tai ách',
  'Thiên Di': 'ra ngoài xã hội, đi xa, cơ hội bên ngoài',
  'Nô Bộc': 'bạn bè, đồng nghiệp, cấp dưới, đối tác',
  'Quan Lộc': 'sự nghiệp, công danh, nghề nghiệp',
  'Điền Trạch': 'nhà cửa, đất đai, môi trường sống',
  'Phúc Đức': 'phúc phần tổ tiên, đời sống tinh thần, tuổi thọ',
  'Phụ Mẫu': 'cha mẹ, bề trên, giấy tờ – học vấn'
};

var LUAN_CHINH_TINH_MENH = {
  'Tử Vi': 'Tử Vi là Đế tinh – người đôn hậu, tự trọng, có phong thái lãnh đạo, thích được tôn trọng và có trách nhiệm với người thân. Đắc cách thì được quý nhân nâng đỡ, dễ giữ vị trí quản lý; kém thì tham vọng lớn hơn năng lực, dễ cô độc trên cao.',
  'Thiên Cơ': 'Thiên Cơ là sao mưu trí – đầu óc nhanh nhạy, giỏi tính toán, lên kế hoạch, khéo tay kỹ thuật, thích nghiên cứu. Đắc địa là bậc quân sư, chuyên gia; hãm địa hay lo nghĩ, thay đổi ý định, dễ mất tập trung.',
  'Thái Dương': 'Thái Dương chủ danh – tính tình cởi mở, hào phóng, nhiệt tình, thích giúp đỡ và hoạt động xã hội. Sáng sủa (Dần → Ngọ) thì danh tiếng rạng rỡ; hãm địa làm nhiều hưởng ít, hao tổn tinh thần, nên giữ gìn mắt và huyết áp.',
  'Vũ Khúc': 'Vũ Khúc là Tài tinh – cương nghị, quyết đoán, thực tế, có năng khiếu tài chính – kinh doanh – kỹ thuật cơ khí. Đắc địa giàu có nhờ tự lực; hãm thì cô khắc, nóng vội, nên mềm mỏng trong quan hệ.',
  'Thiên Đồng': 'Thiên Đồng là Phúc tinh – hiền hòa, lạc quan, dễ gần, biết hưởng thụ, giỏi thích nghi. Đời thường "tiền hung hậu cát", trẻ vất vả sau an nhàn. Hãm địa thiếu kiên định, dễ bỏ dở.',
  'Liêm Trinh': 'Liêm Trinh là sao nguyên tắc – cứng rắn, liêm chính, có tài tổ chức, hợp ngành luật, công an, quân đội, quản trị. Đắc địa là người có uy; hãm địa nóng nảy, dễ vướng thị phi pháp lý, cần tránh đầu cơ.',
  'Thiên Phủ': 'Thiên Phủ là kho trời – điềm đạm, thận trọng, bao dung, giỏi quản lý và giữ tài sản, đời sống ổn định. Cần tránh bảo thủ; gặp Tuần/Triệt hoặc Không Kiếp thì kho rỗng, phải tự gây dựng.',
  'Thái Âm': 'Thái Âm là Phú tinh – dịu dàng, tinh tế, giàu cảm xúc, yêu cái đẹp, có lộc về nhà đất. Sinh ban đêm và đắc địa (Thân → Tý) rất tốt; hãm địa hay u sầu, tài lộc thất thường.',
  'Tham Lang': 'Tham Lang là sao đa tài đa dục – giao tế giỏi, hoạt bát, nhiều tham vọng, hợp kinh doanh, nghệ thuật, ngoại giao. Đắc địa phát muộn nhưng lớn (Tham Lang "tứ mộ"); hãm địa ham vui, dễ sa đà tửu sắc.',
  'Cự Môn': 'Cự Môn chủ ngôn luận – ăn nói sắc sảo, lập luận chặt chẽ, hợp nghề luật, giảng dạy, truyền thông. Đắc địa (Tý Ngọ Dần Thân) có danh nhờ khẩu tài; hãm địa dễ thị phi, hiểu lầm, nên "uốn lưỡi bảy lần".',
  'Thiên Tướng': 'Thiên Tướng là Ấn tinh – chính trực, trọng nghĩa, hào hiệp, thích bênh vực kẻ yếu, có phong thái chỉn chu. Đắc địa được giao quyền ấn; gặp Tuần/Triệt hoặc Kình Hình thì dễ gặp tai nạn, nên thận trọng.',
  'Thiên Lương': 'Thiên Lương là Ấm tinh – nhân hậu, thanh cao, có tinh thần che chở người khác, chủ thọ và giải nạn. Hợp y dược, giáo dục, tư vấn, công tác xã hội. Hãm địa hay lo chuyện bao đồng.',
  'Thất Sát': 'Thất Sát là Tướng tinh – dũng mãnh, quyết liệt, ưa mạo hiểm, không chịu khuất phục. Đắc địa lập nghiệp gian nan nhưng làm nên sự nghiệp lớn; hãm địa cuộc đời nhiều sóng gió, cần kiểm soát nóng nảy.',
  'Phá Quân': 'Phá Quân là sao tiên phong – dám phá cũ lập mới, không chịu gò bó, thích cải cách. Đắc địa (Tý Ngọ) có uy, làm việc lớn; hãm địa bấp bênh, tán tài, dễ thay đổi nghề nghiệp nhiều lần.'
};

var TU_KHOA = {
  'Tử Vi': 'quyền quý, ổn định', 'Thiên Cơ': 'mưu trí, biến động', 'Thái Dương': 'danh tiếng, hào phóng',
  'Vũ Khúc': 'tài chính, cứng rắn', 'Thiên Đồng': 'an vui, thay đổi', 'Liêm Trinh': 'nguyên tắc, pháp lý',
  'Thiên Phủ': 'tích lũy, giữ gìn', 'Thái Âm': 'tinh tế, điền sản', 'Tham Lang': 'ham muốn, giao tế',
  'Cự Môn': 'ngôn luận, thị phi', 'Thiên Tướng': 'chính trực, ấn tín', 'Thiên Lương': 'che chở, bền vững',
  'Thất Sát': 'quyết liệt, sóng gió', 'Phá Quân': 'đổi mới, hao tán'
};

var LUAN_CUNG_SAO = {
  'Quan Lộc': {
    'Tử Vi': 'hợp vị trí quản lý, lãnh đạo, hành chính.', 'Thiên Cơ': 'hợp kỹ thuật, kế hoạch, tư vấn, công nghệ.',
    'Thái Dương': 'hợp công việc công quyền, giáo dục, truyền thông, ngoại giao.', 'Vũ Khúc': 'hợp tài chính, ngân hàng, kinh doanh, cơ khí.',
    'Thiên Đồng': 'hợp dịch vụ, văn hóa, công việc nhẹ nhàng, hay đổi nghề.', 'Liêm Trinh': 'hợp luật, quân đội, công an, quản trị.',
    'Thiên Phủ': 'hợp quản lý tài sản, kế toán, kho vận, nhà nước.', 'Thái Âm': 'hợp bất động sản, nghệ thuật, tài chính, làm việc về đêm.',
    'Tham Lang': 'hợp kinh doanh, giải trí, ngoại giao, ẩm thực.', 'Cự Môn': 'hợp luật sư, giảng dạy, truyền thông, bán hàng.',
    'Thiên Tướng': 'hợp hành chính, nhân sự, thời trang, dịch vụ cao cấp.', 'Thiên Lương': 'hợp y dược, giáo dục, bảo hiểm, tư vấn.',
    'Thất Sát': 'hợp quân sự, kỹ thuật nặng, khởi nghiệp, cạnh tranh cao.', 'Phá Quân': 'hợp đổi mới, sáng tạo, xây dựng, kinh doanh mạo hiểm.'
  },
  'Tài Bạch': {
    'Tử Vi': 'tiền bạc ổn định, có người giúp giữ của.', 'Thiên Cơ': 'kiếm tiền bằng trí tuệ, thu nhập biến động.',
    'Thái Dương': 'tiền đến nhờ danh tiếng, dễ rộng tay chi tiêu.', 'Vũ Khúc': 'tài tinh đắc vị, giỏi làm và giữ tiền.',
    'Thiên Đồng': 'tay trắng làm nên, trước khó sau dễ.', 'Liêm Trinh': 'kiếm tiền vất vả, nên làm ăn minh bạch.',
    'Thiên Phủ': 'kho lộc dồi dào, giỏi tích lũy.', 'Thái Âm': 'giàu nhờ tích góp, điền sản.',
    'Tham Lang': 'kiếm tiền nhanh qua kinh doanh, giao tế; chi cũng nhanh.', 'Cự Môn': 'kiếm tiền bằng lời nói, dễ tranh chấp tiền bạc.',
    'Thiên Tướng': 'tiền bạc đủ đầy, hào phóng.', 'Thiên Lương': 'có lộc ấm, được thừa hưởng, không nên đầu cơ.',
    'Thất Sát': 'tiền đến từ mạo hiểm, lúc được lúc mất.', 'Phá Quân': 'kiếm nhiều tiêu nhiều, tài chính thăng trầm.'
  },
  'Phu Thê': {
    'Tử Vi': 'người phối ngẫu có cá tính, địa vị; nên nhường nhịn.', 'Thiên Cơ': 'bạn đời thông minh, nên kết hôn muộn cho bền.',
    'Thái Dương': 'bạn đời cởi mở, năng động; hôn nhân sáng sủa nếu đắc địa.', 'Vũ Khúc': 'bạn đời cứng rắn, nên lập gia đình muộn.',
    'Thiên Đồng': 'bạn đời hiền hòa, hôn nhân vui vẻ, có thể trắc trở ban đầu.', 'Liêm Trinh': 'tình cảm mãnh liệt, dễ sóng gió, cần chung thủy.',
    'Thiên Phủ': 'bạn đời đảm đang, ổn định, có của.', 'Thái Âm': 'bạn đời dịu dàng, tinh tế, có nhan sắc.',
    'Tham Lang': 'tình duyên phong phú, cần giữ gìn chung thủy.', 'Cự Môn': 'vợ chồng hay bất đồng lời nói, cần lắng nghe.',
    'Thiên Tướng': 'bạn đời đàng hoàng, chu đáo, biết chăm lo.', 'Thiên Lương': 'bạn đời lớn tuổi hoặc chín chắn, biết che chở.',
    'Thất Sát': 'tình cảm mạnh mẽ nhưng dễ va chạm, nên muộn.', 'Phá Quân': 'hôn nhân dễ thay đổi, nên kết hôn muộn và bao dung.'
  }
};

function tuviLuanGiai_(chart) {
  var P = chart.palaces, I = chart.info, pos = chart.pos;
  var menh = I.menh;
  var out = { tongQuan: [], menh: [], cachCuc: [], cung: [], han: [] };
  var tptc = [menh, mod12(menh + 4), mod12(menh + 8), mod12(menh + 6)];
  function inTPTC(name) { return tptc.indexOf(pos[name]) >= 0; }
  function sao(p) { return P[p].chinh.map(function (s) { return s.n; }); }
  function saoMoTa(p) {
    return P[p].chinh.map(function (s) { return s.n + (s.b ? ' (' + DO_SANG_TEN[s.b] + ')' : '') + (s.hoa ? ' hóa ' + s.hoa : ''); }).join(', ');
  }

  // 1. Tổng quan âm dương, mệnh cục
  var menhCungDuong = menh % 2 === 0;
  var namDuong = CAN.indexOf(I.canNam) % 2 === 0;
  out.tongQuan.push('Tuổi ' + I.namCanChi + ' (' + I.conGiap + '), ' + I.amDuong + '. Bản mệnh ' + I.banMenh.ten + ' (' + I.banMenh.hanh + '), ' + I.cuc + '.');
  out.tongQuan.push(menhCungDuong === namDuong
    ? 'Âm Dương thuận lý: Mệnh đóng cung ' + (menhCungDuong ? 'dương' : 'âm') + ' hợp với tuổi ' + (namDuong ? 'dương' : 'âm') + ' – làm việc gì cũng dễ thuận chiều, được thời.'
    : 'Âm Dương nghịch lý: Mệnh đóng cung ' + (menhCungDuong ? 'dương' : 'âm') + ' trái với tuổi ' + (namDuong ? 'dương' : 'âm') + ' – đời thường phải nỗ lực nhiều hơn, thành công nhờ kiên trì.');

  var qh = quanHeHanh(I.cucHanh, I.banMenh.hanh);
  var cucMenhTxt = {
    'duoc_sinh': 'Mệnh sinh Cục: hao tổn công sức cho hoàn cảnh, nhưng biết vun đắp nên vẫn thành.',
    'sinh': 'Cục sinh Mệnh: rất tốt, hoàn cảnh nâng đỡ bản thân, dễ phát triển.',
    'binh': 'Mệnh Cục bình hòa (đồng hành): ổn định, tự lực vững vàng.',
    'khac': 'Cục khắc Mệnh: hoàn cảnh gây sức ép, phải tự vượt khó, dễ gặp trở ngại buổi đầu.',
    'bi_khac': 'Mệnh khắc Cục: bản thân chế ngự được hoàn cảnh nhưng vất vả, tốn sức.'
  }[qh];
  out.tongQuan.push(cucMenhTxt);

  var menhCungHanh = CHI_HANH[menh];
  var qh2 = quanHeHanh(menhCungHanh, I.banMenh.hanh);
  out.tongQuan.push('Cung Mệnh an tại ' + CHI[menh] + ' (hành ' + menhCungHanh + ') ' + {
    'sinh': 'sinh bản mệnh ' + I.banMenh.hanh + ' – được đất, rất tốt.',
    'duoc_sinh': 'được bản mệnh sinh – hao tổn nhưng chủ động.',
    'binh': 'đồng hành với bản mệnh – vững vàng.',
    'khac': 'khắc bản mệnh – cần nhiều nỗ lực.',
    'bi_khac': 'bị bản mệnh khắc – bản thân mạnh hơn hoàn cảnh, tốn sức.'
  }[qh2]);
  out.tongQuan.push('Mệnh chủ: ' + I.menhChu + ' · Thân chủ: ' + I.thanChu + '.');

  // 2. Luận Mệnh
  var ms = P[menh].chinh;
  if (ms.length) {
    out.menh.push('Mệnh có ' + saoMoTa(menh) + ' tọa thủ.');
    ms.forEach(function (s) {
      var txt = LUAN_CHINH_TINH_MENH[s.n];
      if (txt) out.menh.push(txt + (s.b ? ' Ở đây sao ' + (DO_SANG_DIEM[s.b] >= 1 ? 'sáng (' + DO_SANG_TEN[s.b] + ') nên phát huy mặt tốt.' : DO_SANG_DIEM[s.b] < 0 ? 'hãm địa, cần tu dưỡng để hóa giải mặt xấu.' : 'bình hòa.') : ''));
    });
  } else {
    var xc = mod12(menh + 6);
    out.menh.push('Mệnh Vô Chính Diệu – mượn chính tinh cung Thiên Di (' + CHI[xc] + '): ' + (saoMoTa(xc) || 'không có') +
      '. Người mệnh vô chính diệu linh hoạt, dễ thích nghi, chịu ảnh hưởng mạnh của môi trường; thường phải rời quê hoặc tự lập sớm.');
    var tamKhong = (P[menh].tuan ? 1 : 0) + (P[menh].triet ? 1 : 0) +
      (pos['Địa Không'] === menh ? 1 : 0) + (pos['Thiên Không'] === menh ? 1 : 0);
    if (tamKhong >= 2) out.cachCuc.push({ ten: 'Vô Chính Diệu đắc Tam Không', tot: true, moTa: 'Mệnh trống gặp các sao Không – lại thành quý cách, phát đạt bất ngờ.' });
  }
  var catM = P[menh].cat.map(function (s) { return s.n; });
  var hungM = P[menh].hung.map(function (s) { return s.n; });
  if (catM.length) out.menh.push('Cát tinh hội tại Mệnh: ' + catM.join(', ') + '.');
  if (hungM.length) out.menh.push('Hung tinh tại Mệnh: ' + hungM.join(', ') + ' – nên chú ý tiết chế những mặt tiêu cực của các sao này.');
  if (P[menh].tuan) out.menh.push('Mệnh gặp Tuần Không: thuở nhỏ nhiều trắc trở, sau 30 tuổi mới hanh thông; sao xấu cũng bớt xấu.');
  if (P[menh].triet) out.menh.push('Mệnh gặp Triệt Lộ: tuổi trẻ gặp cản trở, dễ bị cắt đứt giữa chừng; bền chí thì hậu vận tốt.');
  out.menh.push('Thân cư ' + I.thanCu + ': ' + ({
    'Mệnh': 'Mệnh Thân đồng cung – tính cách nhất quán, tự lập, đời sống ít thay đổi bản chất.',
    'Phúc Đức': 'coi trọng phúc đức, dòng họ; hưởng phúc tổ tiên, hậu vận an nhàn.',
    'Quan Lộc': 'trọng công danh sự nghiệp, về sau đặt hết tâm huyết vào công việc.',
    'Tài Bạch': 'thiên về tiền bạc, giỏi làm kinh tế, hậu vận chú trọng tài chính.',
    'Thiên Di': 'hay đi xa, thành công nhờ bên ngoài, giao thiệp rộng.',
    'Phu Thê': 'chịu ảnh hưởng lớn từ người phối ngẫu; hôn nhân quyết định nhiều đến hậu vận.'
  }[I.thanCu] || 'Thân nằm ở cung ' + I.thanCu + '.'));

  // 3. Cách cục
  var cc = out.cachCuc;
  var soTPT = ['Tử Vi', 'Thiên Phủ', 'Vũ Khúc', 'Thiên Tướng'].filter(inTPTC).length;
  if (soTPT >= 3) cc.push({ ten: 'Tử Phủ Vũ Tướng', tot: true, moTa: 'Bộ sao quyền quý, giàu có, hợp quản lý – kinh doanh lớn.' });
  var soCNDL = ['Thiên Cơ', 'Thái Âm', 'Thiên Đồng', 'Thiên Lương'].filter(inTPTC).length;
  if (soCNDL >= 3) cc.push({ ten: 'Cơ Nguyệt Đồng Lương', tot: true, moTa: 'Cách "lại" – làm công chức, chuyên môn, ổn định, thông minh, mềm mỏng.' });
  if (['Thất Sát', 'Phá Quân', 'Tham Lang'].some(function (n) { return pos[n] === menh; }))
    cc.push({ ten: 'Sát Phá Tham', tot: null, moTa: 'Cuộc đời nhiều biến động, dám nghĩ dám làm, thành bại lớn; hợp khởi nghiệp, võ nghiệp.' });
  if (pos['Tử Vi'] === pos['Thiên Phủ'] && pos['Tử Vi'] === menh)
    cc.push({ ten: 'Tử Phủ đồng cung', tot: true, moTa: 'Mệnh có cả Đế tinh và Kho trời – phú quý song toàn.' });
  if (pos['Thái Dương'] === pos['Thái Âm'] && pos['Thái Dương'] === menh)
    cc.push({ ten: 'Nhật Nguyệt đồng cung', tot: true, moTa: 'Âm dương hội tụ – thông minh, đa tài, hợp nghiên cứu.' });
  var nhat = P[pos['Thái Dương']].chinh.filter(function (s) { return s.n === 'Thái Dương'; })[0];
  var nguyet = P[pos['Thái Âm']].chinh.filter(function (s) { return s.n === 'Thái Âm'; })[0];
  if (nhat && nguyet && DO_SANG_DIEM[nhat.b] >= 1 && DO_SANG_DIEM[nguyet.b] >= 1 && (inTPTC('Thái Dương') || inTPTC('Thái Âm')))
    cc.push({ ten: 'Nhật Nguyệt tịnh minh', tot: true, moTa: 'Mặt trời, mặt trăng cùng sáng chiếu Mệnh – công danh hiển đạt.' });
  if (DO_SANG_DIEM[nhat.b] < 0 && DO_SANG_DIEM[nguyet.b] < 0 && (inTPTC('Thái Dương') || inTPTC('Thái Âm')))
    cc.push({ ten: 'Nhật Nguyệt phản bối', tot: false, moTa: 'Nhật Nguyệt đều hãm – phải tự lực nhiều, nhưng gặp Tuần/Triệt hoặc Hóa Khoa lại thành cách "phản vi kỳ cách".' });
  if (menh === 7 && !P[7].chinh.length && pos['Thái Dương'] === 3 && pos['Thái Âm'] === 11)
    cc.push({ ten: 'Minh Châu xuất hải', tot: true, moTa: 'Mệnh vô chính diệu tại Mùi, Nhật Mão Nguyệt Hợi chiếu – đại quý cách.' });
  if (pos['Cự Môn'] === menh && (menh === 0 || menh === 6))
    cc.push({ ten: 'Thạch trung ẩn ngọc', tot: true, moTa: 'Cự Môn cư Tý Ngọ – ngọc trong đá, trung niên phát sáng.' });

  function giap(a, b) {
    var l = mod12(menh - 1), rr = mod12(menh + 1);
    return (pos[a] === l && pos[b] === rr) || (pos[a] === rr && pos[b] === l);
  }
  if (giap('Tả Phù', 'Hữu Bật')) cc.push({ ten: 'Tả Hữu giáp Mệnh', tot: true, moTa: 'Được nhiều người giúp đỡ, quý nhân phù trợ.' });
  if (giap('Văn Xương', 'Văn Khúc')) cc.push({ ten: 'Xương Khúc giáp Mệnh', tot: true, moTa: 'Học hành giỏi giang, có văn tài.' });
  if (giap('Thiên Khôi', 'Thiên Việt')) cc.push({ ten: 'Khôi Việt giáp Mệnh', tot: true, moTa: 'Quý nhân hai bên, thi cử đỗ đạt.' });
  if (giap('Kình Dương', 'Đà La')) cc.push({ ten: 'Kình Đà giáp Mệnh', tot: false, moTa: 'Bị kìm kẹp, dễ gặp tiểu nhân; cần cẩn trọng trong quyết định.' });
  if (giap('Địa Không', 'Địa Kiếp')) cc.push({ ten: 'Không Kiếp giáp Mệnh', tot: false, moTa: 'Dễ hao tán, thăng trầm; nên làm việc ổn định, tránh đầu cơ.' });
  if (giap('Hỏa Tinh', 'Linh Tinh')) cc.push({ ten: 'Hỏa Linh giáp Mệnh', tot: false, moTa: 'Tính khí nóng, dễ gặp chuyện bất ngờ.' });
  if (pos['Lộc Tồn'] === menh) cc.push({ ten: 'Lộc Tồn thủ Mệnh', tot: true, moTa: 'Có lộc, biết giữ của, cẩn trọng; hơi cô độc vì bị Kình Đà giáp.' });
  if (inTPTC('Văn Xương') && inTPTC('Văn Khúc')) cc.push({ ten: 'Văn Xương – Văn Khúc hội chiếu', tot: true, moTa: 'Học vấn, văn tài nổi bật.' });
  if (inTPTC('Thiên Khôi') && inTPTC('Thiên Việt')) cc.push({ ten: 'Tọa quý hướng quý', tot: true, moTa: 'Khôi Việt hội chiếu – nhiều quý nhân, dễ thăng tiến.' });
  if (inTPTC('Tả Phù') && inTPTC('Hữu Bật')) cc.push({ ten: 'Tả Hữu hội chiếu', tot: true, moTa: 'Có người trợ lực, được lòng tập thể.' });
  if (inTPTC('Hóa Lộc') && inTPTC('Hóa Quyền') && inTPTC('Hóa Khoa'))
    cc.push({ ten: 'Tam Hóa liên châu', tot: true, moTa: 'Lộc – Quyền – Khoa cùng hội – danh lợi song toàn.' });
  [pos['Lộc Tồn'], pos['Hóa Lộc']].forEach(function (lp, idx) {
    if (lp === pos['Thiên Mã'] && tptc.indexOf(lp) >= 0)
      cc.push({ ten: 'Lộc Mã giao trì', tot: true, moTa: (idx ? 'Hóa Lộc' : 'Lộc Tồn') + ' gặp Thiên Mã – phát tài nhờ năng động, đi xa, buôn bán.' });
  });
  if (pos['Tham Lang'] === menh && (pos['Hỏa Tinh'] === menh || pos['Linh Tinh'] === menh))
    cc.push({ ten: pos['Hỏa Tinh'] === menh ? 'Hỏa Tham' : 'Linh Tham', tot: true, moTa: 'Tham Lang gặp Hỏa/Linh – phát nhanh, bất ngờ, hoạnh tài.' });
  if (pos['Địa Không'] === menh || pos['Địa Kiếp'] === menh)
    cc.push({ ten: 'Không Kiếp thủ Mệnh', tot: false, moTa: 'Tư duy độc đáo nhưng dễ thăng trầm, "sinh bất phùng thời"; hợp nghề sáng tạo, tâm linh.' });
  if (pos['Hóa Kỵ'] === menh)
    cc.push({ ten: 'Hóa Kỵ thủ Mệnh', tot: false, moTa: 'Hay ưu tư, gặp nhiều cản trở, dễ bị hiểu lầm; kiên trì sẽ vượt qua.' });
  if (pos['Kình Dương'] === menh && (menh === 6))
    cc.push({ ten: 'Mã đầu đới kiếm', tot: null, moTa: 'Kình Dương cư Ngọ – uy dũng trấn biên, nhưng cần đề phòng tai nạn.' });
  if (!cc.length) cc.push({ ten: 'Không có cách cục đặc biệt', tot: null, moTa: 'Lá số bình ổn – thành bại chủ yếu do nỗ lực và vận hạn.' });

  // 4. Luận 12 cung
  for (var k = 0; k < 12; k++) {
    var pi = mod12(menh - k);
    var cungTen = CUNG_NAMES[k];
    var C = P[pi];
    var lines = [];
    var cs = sao(pi);
    var muon = false, ref = pi;
    if (!cs.length) { ref = mod12(pi + 6); muon = true; }
    var mota = saoMoTa(ref);
    lines.push((muon ? 'Vô chính diệu, mượn sao xung chiếu ' + (mota || '—') : 'Chính tinh: ' + mota) + '.');
    var kw = P[ref].chinh.map(function (s) { return TU_KHOA[s.n]; }).filter(Boolean);
    if (kw.length) lines.push('Khuynh hướng: ' + kw.join('; ') + '.');
    if (LUAN_CUNG_SAO[cungTen]) {
      P[ref].chinh.forEach(function (s) {
        var tx = LUAN_CUNG_SAO[cungTen][s.n];
        if (tx) lines.push(s.n + ': ' + tx);
      });
    }
    if (C.cat.length) lines.push('Cát tinh: ' + C.cat.map(function (s) { return s.n; }).join(', ') + '.');
    if (C.hung.length) lines.push('Hung tinh: ' + C.hung.map(function (s) { return s.n; }).join(', ') + '.');
    if (C.tuan || C.triet) lines.push('Gặp ' + [C.tuan ? 'Tuần' : '', C.triet ? 'Triệt' : ''].filter(Boolean).join(' & ') + ': tốt xấu đều giảm, hay trắc trở ở giai đoạn đầu.');
    var d = C.diem;
    var danhGia = d >= 5 ? 'Rất tốt' : d >= 2.5 ? 'Tốt' : d >= 0.5 ? 'Khá' : d > -1.5 ? 'Trung bình' : 'Cần lưu ý';
    out.cung.push({ cung: cungTen, chi: CHI[pi], yNghia: Y_NGHIA_CUNG[cungTen], lines: lines, diem: d, danhGia: danhGia, isThan: !!C.isThan });
  }

  // 5. Hạn năm xem
  if (I.daiHanNow >= 0) {
    var D = P[I.daiHanNow];
    out.han.push('Đại hạn ' + D.daiHan + '–' + (D.daiHan + 9) + ' tuổi đi qua cung ' + D.cung + ' (' + D.canTen + ' ' + D.chiTen + '): ' +
      (D.chinh.length ? saoMoTa(I.daiHanNow) : 'vô chính diệu') + ' – đánh giá ' + mucDo_(D.diem) + '.');
  } else {
    out.han.push('Năm xem nằm ngoài các đại hạn (tuổi ' + I.tuoi + ').');
  }
  if (I.tieuHanNow >= 0) {
    var T = P[I.tieuHanNow];
    out.han.push('Tiểu hạn năm ' + I.viewCanChi + ' (' + I.tuoi + ' tuổi) tại cung ' + T.cung + ' (' + T.chiTen + '): ' +
      (T.chinh.length ? saoMoTa(I.tieuHanNow) : 'vô chính diệu') + '. Lưu tinh: ' + (T.luu.join(', ') || 'không') + '.');
    var bad = T.luu.filter(function (x) { return /Kình|Đà|Kỵ|Tang|Hổ|Khốc|Hư/.test(x); });
    var good = T.luu.filter(function (x) { return /Lộc|Quyền|Khoa|Mã/.test(x); });
    if (good.length) out.han.push('Năm có ' + good.join(', ') + ' – thuận lợi cho tài lộc, công danh, di chuyển.');
    if (bad.length) out.han.push('Cần cẩn trọng vì ' + bad.join(', ') + ' – tránh tranh chấp, giữ sức khỏe, cẩn thận khi đi lại.');
  }
  var ttPos = mod12(I.viewYear + 8);
  if (ttPos === mod12(CHI.indexOf(I.chiNam))) out.han.push('Năm tuổi (trùng Thái Tuế) – nên sống chậm, tránh quyết định lớn vội vàng.');
  if (mod12(ttPos - CHI.indexOf(I.chiNam)) === 6) out.han.push('Năm xung Thái Tuế – dễ biến động, thay đổi chỗ ở/công việc.');

  return out;
}

function mucDo_(d) {
  return d >= 5 ? 'rất tốt' : d >= 2.5 ? 'tốt' : d >= 0.5 ? 'khá' : d > -1.5 ? 'trung bình' : 'cần thận trọng';
}
