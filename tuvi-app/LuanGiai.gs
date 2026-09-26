/**
 * ============================================================
 *  LuanGiai.gs — LUẬN GIẢI CHUYÊN SÂU
 *  1. Luận 12 cung: cơ sở lý luận, chính tinh & bộ sao, tam phương tứ chính,
 *     nhị hợp, giáp cung, ngũ hành cung – Mệnh, phụ tinh theo bộ, sao đặc thù.
 *  2. Đại vận (đại hạn 10 năm): Tứ Hóa đại vận, Lộc – Kình – Đà đại vận,
 *     các cung chức theo hạn, đối chiếu đại vận Bát Tự.
 *  3. Tiểu vận (lưu niên): tiểu hạn, Lưu Thái Tuế, lưu tinh, quan hệ tuổi – năm.
 *  4. Nguyệt vận: nguyệt hạn 12 tháng âm lịch, can chi tháng, thập thần.
 *  5. Nhật vận: nhật hạn, can chi ngày, Hoàng/Hắc đạo, Thập nhị trực, giờ tốt.
 * ============================================================
 */

/* ---------------------- CƠ SỞ LÝ LUẬN ---------------------- */
var CO_SO_LY_LUAN = {
  cung: [
    'Mỗi cung là một lĩnh vực đời người. Tính chất của cung do chính tinh tọa thủ quyết định (thể), còn phụ tinh, Tứ Hóa và sát tinh làm tăng/giảm, chuyển hóa tính chất đó (dụng).',
    'Độ sáng Miếu – Vượng – Đắc – Bình – Hãm cho biết chính tinh phát huy mặt tốt hay mặt xấu: sao miếu vượng gặp cát tinh thì tốt thêm, sao hãm gặp sát tinh thì xấu nặng.',
    'Tam phương tứ chính (bản cung + 2 cung tam hợp + cung xung chiếu) là nơi hội tụ lực của các sao: "Tọa thủ là chủ, hội chiếu là khách" – bản cung chiếm khoảng 1/2 sức nặng, xung chiếu 1/4, hai cung tam hợp chia phần còn lại.',
    'Nhị hợp (cung lục hợp) có ảnh hưởng ngầm; giáp cung (hai cung kề) tạo thế "kẹp": giáp cát tinh thì được nâng đỡ, giáp sát tinh thì bị kìm kẹp.',
    'Ngũ hành của cung (theo địa chi) so với cung Mệnh cho biết lĩnh vực đó hỗ trợ (sinh), gây áp lực (khắc) hay tiêu hao (được Mệnh sinh) đối với bản thân.',
    'Tuần – Triệt làm giảm lực sao: sao tốt bớt tốt, sao xấu bớt xấu; Triệt nặng ở tiền vận (trước 30 tuổi), Tuần ảnh hưởng suốt đời nhưng nhẹ. Vòng Tràng Sinh cho biết khí của cung đang thịnh hay suy.'
  ],
  daiVan: [
    'Đại hạn 10 năm khởi tại cung Mệnh với số Cục (Thủy 2, Mộc 3, Kim 4, Thổ 5, Hỏa 6). Dương Nam – Âm Nữ đi thuận, Âm Nam – Dương Nữ đi nghịch.',
    'Cung đại hạn được coi như "Mệnh của 10 năm"; từ đó an lại các cung chức của hạn (Đại Tài = cung thứ 5, Đại Quan = cung thứ 9, Đại Phu Thê = cung thứ 3, Đại Tật = cung thứ 6 tính nghịch).',
    'Can của cung đại hạn khởi Tứ Hóa đại vận (Lộc – Quyền – Khoa – Kỵ) và Lộc Tồn – Kình Dương – Đà La đại vận; Hóa nhập cung nào thì lĩnh vực đó được kích hoạt trong 10 năm.',
    'Luận đại hạn: xét sao tại cung hạn và tam phương tứ chính, đối chiếu với lá số gốc (cung hạn là cung chức gì ở lá số gốc), sau cùng so ngũ hành cung hạn với bản mệnh. "Mệnh tốt không bằng Vận tốt".'
  ],
  tieuVan: [
    'Lưu niên đại hạn (Thái Thứ Lang): năm đầu của đại hạn ở chính cung đại hạn, năm thứ hai sang cung xung chiếu; năm thứ ba Dương Nam – Âm Nữ lùi một cung (Âm Nam – Dương Nữ tiến một cung), năm thứ tư trở về cung xung chiếu, từ năm thứ năm đi tiếp mỗi năm một cung. Tiểu hạn, lưu niên đại hạn và Lưu Thái Tuế là ba "điểm rơi" của năm.',
    'Tiểu hạn khởi theo tam hợp tuổi: Dần Ngọ Tuất khởi Thìn, Thân Tý Thìn khởi Tuất, Tỵ Dậu Sửu khởi Mùi, Hợi Mão Mùi khởi Sửu; Nam đi thuận, Nữ đi nghịch, mỗi năm một cung.',
    'Lưu Thái Tuế an tại chi của năm xem; lưu tinh an theo can chi năm: Lưu Lộc Tồn – Kình – Đà (theo can), Lưu Thiên Mã, Tang Môn, Bạch Hổ, Khốc – Hư, Hồng Loan – Thiên Hỷ (theo chi), Lưu Tứ Hóa (theo can năm).',
    '"Đại hạn là gốc, tiểu hạn là ngọn, lưu niên là thời": đại hạn tốt thì tiểu hạn xấu cũng nhẹ; đại hạn xấu mà tiểu hạn gặp lưu sát trùng phùng thì cần đặc biệt đề phòng.',
    'Quan hệ giữa chi năm xem và chi tuổi (tam hợp, lục hợp, xung, hình, hại) cùng can năm với Nhật chủ Bát Tự (thập thần) bổ sung cho nhận định.'
  ],
  nguyetVan: [
    'Nguyệt hạn (Đẩu Quân lưu nguyệt): từ cung tiểu hạn năm xem gọi là tháng Giêng, đếm nghịch đến tháng sinh, rồi từ đó gọi là giờ Tý đếm thuận đến giờ sinh – được cung tháng Giêng; mỗi tháng sau tiến thuận một cung.',
    'Can chi tháng theo Ngũ Hổ Độn (can năm xem), chi tháng Giêng là Dần. Xét sao cung nguyệt hạn + lưu tinh của năm tại cung đó, cộng thêm thập thần của can tháng với Nhật chủ và hợp – xung giữa chi tháng với chi ngày sinh.'
  ],
  nhatVan: [
    'Nhật hạn: từ cung nguyệt hạn của tháng âm lịch đó gọi là mùng 1, đếm thuận đến ngày xem.',
    'Can chi ngày tính theo số ngày Julius; thập thần của can ngày với Nhật chủ cho biết tính chất sự việc trong ngày; chi ngày xung chi tuổi/chi ngày sinh là ngày cần thận trọng.',
    'Hoàng đạo – Hắc đạo theo 12 thần (Thanh Long, Minh Đường, Kim Quỹ, Bảo Quang, Ngọc Đường, Tư Mệnh là Hoàng đạo), mặc định khởi theo tháng âm lịch như lịch Việt; có thể chọn khởi theo tháng tiết khí (nguyệt kiến) như lịch Trung Hoa. Giờ Hoàng đạo khởi theo chi ngày.',
    'Thập nhị trực (Kiến, Trừ, Mãn…): ngày có chi trùng chi tháng tiết khí là trực Kiến; ngày giao tiết lặp lại trực hôm trước. Nhị thập bát tú xoay vòng 28 ngày. Hướng Hỷ – Tài – Phúc thần theo can ngày, sát phương theo chi ngày, Bành Tổ bách kỵ theo can và chi ngày (đối chiếu thư viện lunar-javascript).'
  ]
};

var LG_LINH_VUC = {
  'Mệnh': 'bản thân', 'Huynh Đệ': 'anh chị em', 'Phu Thê': 'hôn nhân – tình cảm', 'Tử Tức': 'con cái',
  'Tài Bạch': 'tiền bạc', 'Tật Ách': 'sức khỏe', 'Thiên Di': 'đi xa – quan hệ xã hội', 'Nô Bộc': 'bạn bè – cộng sự',
  'Quan Lộc': 'công danh – sự nghiệp', 'Điền Trạch': 'nhà cửa – đất đai', 'Phúc Đức': 'phúc phần – tinh thần', 'Phụ Mẫu': 'cha mẹ – giấy tờ'
};

var LG_THU_TU_CHINH = ['Tử Vi', 'Thiên Cơ', 'Thái Dương', 'Vũ Khúc', 'Thiên Đồng', 'Liêm Trinh', 'Thiên Phủ',
  'Thái Âm', 'Tham Lang', 'Cự Môn', 'Thiên Tướng', 'Thiên Lương', 'Thất Sát', 'Phá Quân'];

var LG_BO_CHINH = {
  'Tử Vi|Thiên Phủ': 'Tử Phủ đồng cung – Đế tinh gặp Kho trời: quyền và tài song hành, ổn định, hơi bảo thủ; sợ Không Kiếp, Tuần Triệt làm "kho rỗng".',
  'Tử Vi|Tham Lang': 'Tử Tham – "Đào hoa phạm chủ": tài giao tế, đa tình, ham hưởng thụ; gặp Hóa Khoa, Kình Đà, Hoa Cái lại chuyển sang tu dưỡng, nghệ thuật.',
  'Tử Vi|Thiên Tướng': 'Tử Tướng (Thìn/Tuất – La Võng): quyền lực cộng ấn tín, nguyên tắc, thích làm chủ; thường thành công muộn sau khi thoát "lưới".',
  'Tử Vi|Thất Sát': 'Tử Sát – "Tử Vi hóa sát vi quyền": quyền uy, quyết đoán, dám mạo hiểm để lập nghiệp lớn.',
  'Tử Vi|Phá Quân': 'Tử Phá: muốn cải cách, không chịu an phận, thăng trầm nhưng có chí lớn; cần Tả Hữu, Xương Khúc phò tá mới vững.',
  'Thiên Cơ|Thái Âm': 'Cơ Âm (Dần/Thân): thông minh, nhạy cảm, hay thay đổi và di chuyển, hợp nghề tính toán, thiết kế, tài chính.',
  'Thiên Cơ|Cự Môn': 'Cơ Cự (Mão/Dậu) – "Cơ Cự đồng lâm": mưu trí, lý luận sắc bén, thường phá tổ lập nghiệp, hợp luật, nghiên cứu.',
  'Thiên Cơ|Thiên Lương': 'Cơ Lương (Thìn/Tuất) – "Thiện ấm triều cương": giỏi mưu lược, tư vấn, nói hay, thiên về triết lý – tôn giáo.',
  'Thái Dương|Thái Âm': 'Nhật Nguyệt đồng cung (Sửu/Mùi): âm dương hội nhưng một sáng một mờ – đa tài, tính cách hai mặt, hay dao động; cần Xương Khúc, Khoa để sáng.',
  'Thái Dương|Cự Môn': 'Cự Nhật: ở Dần "quan phong tam đại" – danh tiếng nhờ khẩu tài, ngoại giao; ở Thân Thái Dương đã ngả chiều nên thành tựu kém hơn.',
  'Thái Dương|Thiên Lương': 'Nhật Lương: ở Mão "Nhật chiếu lôi môn" rất quý – danh tiếng, học vấn; ở Dậu công danh muộn, nên làm chuyên môn.',
  'Vũ Khúc|Thiên Phủ': 'Vũ Phủ (Tý/Ngọ): hai tài tinh hội – giỏi tài chính, tích lũy vững bền, tính thận trọng.',
  'Vũ Khúc|Tham Lang': 'Vũ Tham (Sửu/Mùi) – "Vũ Tham bất phát thiếu niên nhân": trẻ vất vả, sau 30 tuổi phát tài mạnh nhờ kinh doanh.',
  'Vũ Khúc|Thiên Tướng': 'Vũ Tướng (Dần/Thân): tài tinh gặp ấn tinh – năng lực quản lý tài chính, làm việc chính trực, hợp ngân hàng, kế toán.',
  'Vũ Khúc|Thất Sát': 'Vũ Sát (Mão/Dậu) – "Tài dữ tù cừu": quyết liệt, làm ăn lớn nhưng rủi ro, đề phòng tai nạn kim khí.',
  'Vũ Khúc|Phá Quân': 'Vũ Phá (Tỵ/Hợi): tài tinh gặp hao tinh – kiếm nhiều tiêu nhiều, dám đầu tư mạo hiểm, dễ phá tán.',
  'Thiên Đồng|Thái Âm': 'Đồng Âm: ở Tý "Thủy trừng quế ngạc" rất đẹp – hiền hòa, đa cảm, có duyên; ở Ngọ hai sao hãm, tình cảm lận đận.',
  'Thiên Đồng|Cự Môn': 'Đồng Cự (Sửu/Mùi): phúc tinh gặp ám tinh – nội tâm bất an, hay buồn phiền, lời nói dễ gây hiểu lầm.',
  'Thiên Đồng|Thiên Lương': 'Đồng Lương (Dần/Thân): phúc ấm song hành – hiền lành, được che chở, hợp công việc phục vụ, y tế, giáo dục.',
  'Liêm Trinh|Thiên Phủ': 'Liêm Phủ (Thìn/Tuất): Thiên Phủ chế được tính cương của Liêm Trinh – nguyên tắc mà mềm mỏng, giữ được của.',
  'Liêm Trinh|Tham Lang': 'Liêm Tham (Tỵ/Hợi): hai sao đào hoa cùng hãm – ham vui, dễ vướng thị phi tình ái, pháp lý; cần tu dưỡng, gặp Tuần Triệt lại tốt.',
  'Liêm Trinh|Thiên Tướng': 'Liêm Tướng (Tý/Ngọ): Thiên Tướng chế Liêm Trinh – chính trực, có uy, hợp ngành luật, quân đội, quản trị.',
  'Liêm Trinh|Thất Sát': 'Liêm Sát (Sửu/Mùi): võ cách – kỹ thuật, quân sự, dám làm; gặp sát tinh thì nhiều sóng gió, tai nạn.',
  'Liêm Trinh|Phá Quân': 'Liêm Phá (Mão/Dậu): tù tinh gặp hao tinh – bất ổn, liều lĩnh, dễ gặp rắc rối pháp lý; hợp công việc phá cách.'
};

var LG_CUNG_SAO = {
  'Huynh Đệ': {
    'Tử Vi': 'anh chị em có người thành đạt, có uy, giúp đỡ được mình.', 'Thiên Cơ': 'anh em thông minh, ít người, hay khác ý.',
    'Thái Dương': 'anh em đông, hào phóng; hãm địa thì xa cách.', 'Vũ Khúc': 'anh em ít, cứng cỏi, dễ bất hòa vì tiền.',
    'Thiên Đồng': 'anh em hòa thuận, vui vẻ.', 'Liêm Trinh': 'anh em ít, dễ xung khắc.',
    'Thiên Phủ': 'anh em đông, khá giả, đùm bọc nhau.', 'Thái Âm': 'có chị em gái tốt, tình cảm tinh tế.',
    'Tham Lang': 'anh em giao du rộng nhưng ít nương tựa được.', 'Cự Môn': 'anh em hay bất đồng, thị phi.',
    'Thiên Tướng': 'anh em nghĩa khí, giúp đỡ nhau.', 'Thiên Lương': 'anh em hiền, có người lớn tuổi che chở.',
    'Thất Sát': 'anh em ít, mỗi người một ngả.', 'Phá Quân': 'anh em ly tán, khác biệt lớn.'
  },
  'Tử Tức': {
    'Tử Vi': 'con ít nhưng tài giỏi, có con quý hiển.', 'Thiên Cơ': 'con thông minh, lanh lợi; sinh muộn thì tốt.',
    'Thái Dương': 'con trai hiển đạt khi đắc địa, tính nhiệt tình.', 'Vũ Khúc': 'con ít, muộn, cứng tính, thực tế.',
    'Thiên Đồng': 'con đông, hiếu thuận, vui vẻ.', 'Liêm Trinh': 'con ít, lúc nhỏ khó dạy.',
    'Thiên Phủ': 'con đông, hiếu thảo, có của.', 'Thái Âm': 'nhiều con gái, hiền, tinh tế.',
    'Tham Lang': 'con đông nhưng khó hòa hợp, nên sinh muộn.', 'Cự Môn': 'con hay cãi, nên dạy bằng lý lẽ.',
    'Thiên Tướng': 'con ngoan, nghĩa khí.', 'Thiên Lương': 'con hiếu, ít mà quý, về già nhờ được.',
    'Thất Sát': 'con ít, sinh khó, cá tính mạnh.', 'Phá Quân': 'con đầu khó nuôi, con cái độc lập sớm.'
  },
  'Tật Ách': {
    'Tử Vi': 'chú ý tỳ vị, tiêu hóa; nhìn chung ít bệnh nặng.', 'Thiên Cơ': 'chú ý gan, thần kinh, chân tay.',
    'Thái Dương': 'chú ý mắt, tim, huyết áp, đầu.', 'Vũ Khúc': 'chú ý phổi, hô hấp, răng, xương.',
    'Thiên Đồng': 'chú ý thận, bàng quang, tai.', 'Liêm Trinh': 'chú ý máu huyết, ung nhọt, bệnh đường sinh dục.',
    'Thiên Phủ': 'chú ý dạ dày, tỳ vị; thể chất khá.', 'Thái Âm': 'chú ý thận, mắt, nội tiết.',
    'Tham Lang': 'chú ý gan, thận, sinh dục, bệnh do tửu sắc.', 'Cự Môn': 'chú ý miệng, họng, dạ dày.',
    'Thiên Tướng': 'chú ý da, bàng quang.', 'Thiên Lương': 'ít bệnh, sống thọ; chú ý dạ dày.',
    'Thất Sát': 'chú ý phổi, đại tràng, tai nạn kim khí.', 'Phá Quân': 'chú ý thận, khí huyết, tai nạn, phẫu thuật.'
  },
  'Thiên Di': {
    'Tử Vi': 'ra ngoài được kính nể, gặp quý nhân.', 'Thiên Cơ': 'hay di chuyển, đổi chỗ làm, thích nghi tốt.',
    'Thái Dương': 'ra ngoài được tiếng, giao thiệp rộng.', 'Vũ Khúc': 'ra ngoài kiếm tiền tốt, hợp làm ăn xa.',
    'Thiên Đồng': 'đi đâu cũng được lòng người.', 'Liêm Trinh': 'ra ngoài dễ va chạm, cẩn thận pháp lý, giao thông.',
    'Thiên Phủ': 'ra ngoài có người giúp, ổn định.', 'Thái Âm': 'đi xa, xuất ngoại có lợi khi đắc địa.',
    'Tham Lang': 'giao du rộng, nhiều cám dỗ.', 'Cự Môn': 'ra ngoài dễ bị thị phi, nói xấu.',
    'Thiên Tướng': 'ra ngoài được nể trọng, có uy tín.', 'Thiên Lương': 'ra ngoài gặp người che chở.',
    'Thất Sát': 'tha hương lập nghiệp, gian nan mà thành.', 'Phá Quân': 'bôn ba, thay đổi môi trường liên tục.'
  },
  'Nô Bộc': {
    'Tử Vi': 'bạn bè có địa vị, nhưng khó sai khiến người dưới.', 'Thiên Cơ': 'bạn thông minh nhưng hay thay đổi.',
    'Thái Dương': 'nhiều bạn bè, được giúp khi đắc địa.', 'Vũ Khúc': 'quan hệ thực tế, vì lợi.',
    'Thiên Đồng': 'bạn bè vui vẻ, dễ hợp tác.', 'Liêm Trinh': 'bạn bè dễ phản trắc, cần cẩn thận.',
    'Thiên Phủ': 'có cộng sự đáng tin, giữ được người.', 'Thái Âm': 'được bạn nữ giúp đỡ.',
    'Tham Lang': 'bạn ăn chơi, dễ bị lợi dụng.', 'Cự Môn': 'dễ bị bạn bè nói xấu.',
    'Thiên Tướng': 'có người dưới trung thành.', 'Thiên Lương': 'bạn bè lớn tuổi, tốt bụng.',
    'Thất Sát': 'bạn bè cá tính mạnh, dễ đối đầu.', 'Phá Quân': 'bạn bè thay đổi, ơn ít oán nhiều.'
  },
  'Điền Trạch': {
    'Tử Vi': 'nhà cửa khang trang, có bất động sản giá trị.', 'Thiên Cơ': 'hay đổi chỗ ở, sửa sang nhà cửa.',
    'Thái Dương': 'nhà sáng sủa, được thừa hưởng khi đắc địa.', 'Vũ Khúc': 'tự tạo nhà đất bằng sức mình.',
    'Thiên Đồng': 'trước ít sau nhiều, tự lập.', 'Liêm Trinh': 'nhà đất dễ tranh chấp giấy tờ.',
    'Thiên Phủ': 'giàu nhà đất, giữ được sản nghiệp.', 'Thái Âm': 'rất tốt về điền sản, tích lũy nhà đất.',
    'Tham Lang': 'lúc thịnh lúc suy, trung niên mới có.', 'Cự Môn': 'nhà đất hay tranh chấp, cẩn thận hàng xóm.',
    'Thiên Tướng': 'nhà đẹp, có người giúp mua sắm.', 'Thiên Lương': 'được hưởng nhà cửa tổ nghiệp.',
    'Thất Sát': 'tổ nghiệp khó giữ, tự lập mới có.', 'Phá Quân': 'phá cũ xây mới, hay mua bán nhà.'
  },
  'Phúc Đức': {
    'Tử Vi': 'họ hàng có người hiển đạt, phúc dày.', 'Thiên Cơ': 'tinh thần hay lo nghĩ, phúc trung bình.',
    'Thái Dương': 'phúc từ bên nội, tinh thần lạc quan.', 'Vũ Khúc': 'phúc về tài, tính tự lập.',
    'Thiên Đồng': 'hưởng phúc an nhàn, tinh thần thoải mái.', 'Liêm Trinh': 'họ hàng ly tán, cần tu tâm tích đức.',
    'Thiên Phủ': 'phúc dày, dòng họ đông, khá giả.', 'Thái Âm': 'phúc từ bên ngoại, đời sống tinh thần phong phú.',
    'Tham Lang': 'ham vui, cần tu dưỡng để giữ phúc.', 'Cự Môn': 'họ hàng thị phi, tâm hay bất an.',
    'Thiên Tướng': 'được tổ tiên che chở, phúc hậu.', 'Thiên Lương': 'phúc thọ, được âm đức phù hộ.',
    'Thất Sát': 'tinh thần vất vả, phải tự tạo phúc.', 'Phá Quân': 'dòng họ biến động, bôn ba, giảm phúc.'
  },
  'Phụ Mẫu': {
    'Tử Vi': 'cha mẹ có địa vị, nghiêm khắc, được nhờ.', 'Thiên Cơ': 'cha mẹ thông minh; hãm thì xa cách.',
    'Thái Dương': 'cha thành đạt khi đắc địa, hãm thì cha vất vả.', 'Vũ Khúc': 'cha mẹ cứng rắn, ít gần gũi.',
    'Thiên Đồng': 'cha mẹ hiền hòa, thương con.', 'Liêm Trinh': 'cha mẹ nghiêm, dễ bất đồng.',
    'Thiên Phủ': 'cha mẹ khá giả, được thừa hưởng.', 'Thái Âm': 'mẹ hiền, được nhờ mẹ khi đắc địa.',
    'Tham Lang': 'cha mẹ phóng khoáng, ít quản.', 'Cự Môn': 'cha mẹ con cái hay bất đồng ý kiến.',
    'Thiên Tướng': 'cha mẹ đàng hoàng, được che chở.', 'Thiên Lương': 'cha mẹ thọ, che chở chu đáo.',
    'Thất Sát': 'sớm xa cha mẹ, tự lập sớm.', 'Phá Quân': 'cha mẹ vất vả, có thể xa cách.'
  }
};

// Nhóm bộ sao lớn trong tam phương tứ chính
var LG_NHOM_LON = [
  { ten: 'Tử Phủ Vũ Tướng', sao: ['Tử Vi', 'Thiên Phủ', 'Vũ Khúc', 'Thiên Tướng'], can: 3, moTa: 'thiên về ổn định, quản lý, tích lũy – hợp làm lớn trong tổ chức, giàu bền.' },
  { ten: 'Sát Phá Tham', sao: ['Thất Sát', 'Phá Quân', 'Tham Lang'], can: 2, moTa: 'thiên về biến động, khai phá, thành bại lớn – hợp khởi nghiệp, cạnh tranh, võ nghiệp.' },
  { ten: 'Cơ Nguyệt Đồng Lương', sao: ['Thiên Cơ', 'Thái Âm', 'Thiên Đồng', 'Thiên Lương'], can: 3, moTa: 'thiên về mềm mỏng, chuyên môn, làm công – ổn định, trọng trí tuệ.' },
  { ten: 'Cự Nhật', sao: ['Cự Môn', 'Thái Dương'], can: 2, moTa: 'thiên về danh tiếng nhờ lời nói, ngoại giao, giảng dạy, truyền thông.' }
];

// Bộ phụ tinh: mode 'dong' = cùng cung, 'hoi' = trong tam phương tứ chính, 'giap' = kẹp hai bên
var LG_BO_PHU = [
  { sao: ['Tả Phù', 'Hữu Bật'], mode: 'hoi', ten: 'Tả Hữu', tot: 1, moTa: 'được trợ lực, nhiều người giúp, làm việc có tổ chức' },
  { sao: ['Văn Xương', 'Văn Khúc'], mode: 'hoi', ten: 'Xương Khúc', tot: 1, moTa: 'học vấn, văn tài, khéo ăn nói, giấy tờ thuận' },
  { sao: ['Thiên Khôi', 'Thiên Việt'], mode: 'hoi', ten: 'Khôi Việt', tot: 1, moTa: 'quý nhân nâng đỡ, thi cử, thăng tiến' },
  { sao: ['Long Trì', 'Phượng Các'], mode: 'hoi', ten: 'Long Phượng', tot: 1, moTa: 'khoa danh, hỷ sự, thanh nhã' },
  { sao: ['Tam Thai', 'Bát Tọa'], mode: 'hoi', ten: 'Thai Tọa', tot: 1, moTa: 'địa vị, uy thế, xe cộ' },
  { sao: ['Ân Quang', 'Thiên Quý'], mode: 'hoi', ten: 'Quang Quý', tot: 1, moTa: 'được ân huệ, ban thưởng, giúp đỡ' },
  { sao: ['Hồng Loan', 'Thiên Hỷ'], mode: 'hoi', ten: 'Hồng Hỷ', tot: 1, moTa: 'hỷ sự, cưới hỏi, sinh nở, vui mừng' },
  { sao: ['Đào Hoa', 'Hồng Loan'], mode: 'hoi', ten: 'Đào Hồng', tot: 0, moTa: 'duyên dáng, tình cảm nồng nàn; tốt cho giao tế, nhưng dễ đa tình' },
  { sao: ['Thiên Đức', 'Nguyệt Đức'], mode: 'hoi', ten: 'Nhị Đức', tot: 1, moTa: 'giải hung, gặp dữ hóa lành, tâm thiện' },
  { sao: ['Thiên Giải', 'Địa Giải', 'Giải Thần'], mode: 'hoi', min: 2, ten: 'Tam Giải', tot: 1, moTa: 'giải trừ tai ách, bệnh tật, kiện tụng' },
  { sao: ['Quốc Ấn', 'Đường Phù'], mode: 'hoi', ten: 'Ấn Phù', tot: 1, moTa: 'quyền chức, bổ nhiệm, danh vị' },
  { sao: ['Thai Phụ', 'Phong Cáo'], mode: 'hoi', ten: 'Thai Cáo', tot: 1, moTa: 'bằng sắc, khen thưởng, danh giá' },
  { sao: ['Thiên Quan', 'Thiên Phúc'], mode: 'hoi', ten: 'Quan Phúc', tot: 1, moTa: 'quý nhân, phúc thiện, may mắn' },
  { sao: ['Lộc Tồn', 'Hóa Lộc'], mode: 'hoi', ten: 'Song Lộc', tot: 1, moTa: 'tài lộc dồi dào, nhiều nguồn thu' },
  { sao: ['Lộc Tồn', 'Thiên Mã'], mode: 'dong', ten: 'Lộc Mã giao trì', tot: 1, moTa: 'phát tài nhờ năng động, đi xa, buôn bán' },
  { sao: ['Hóa Lộc', 'Thiên Mã'], mode: 'dong', ten: 'Lộc Mã giao trì (Hóa Lộc)', tot: 1, moTa: 'tiền đến nhờ di chuyển, giao thương' },
  { sao: ['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa'], mode: 'hoi', ten: 'Tam Hóa liên châu', tot: 1, moTa: 'danh – lợi – quyền cùng đến' },
  { sao: ['Hóa Quyền', 'Hóa Khoa'], mode: 'hoi', ten: 'Quyền Khoa', tot: 1, moTa: 'có năng lực và danh tiếng' },
  { sao: ['Kình Dương', 'Đà La'], mode: 'giap', ten: 'Kình Đà giáp', tot: -1, moTa: 'bị kìm kẹp, tiểu nhân hai bên, khó xoay xở' },
  { sao: ['Kình Dương', 'Đà La'], mode: 'hoi', ten: 'Kình Đà hội', tot: -1, moTa: 'cạnh tranh, trở ngại, thương tích nhẹ' },
  { sao: ['Hỏa Tinh', 'Linh Tinh'], mode: 'hoi', ten: 'Hỏa Linh', tot: -1, moTa: 'nóng nảy, biến cố bất ngờ, hỏa hoạn' },
  { sao: ['Địa Không', 'Địa Kiếp'], mode: 'hoi', ten: 'Không Kiếp', tot: -1, moTa: 'hao tán, thăng trầm đột ngột; ý tưởng độc đáo' },
  { sao: ['Địa Không', 'Địa Kiếp'], mode: 'giap', ten: 'Không Kiếp giáp', tot: -1, moTa: 'dễ bị cuốn vào hao tán, mất mát' },
  { sao: ['Thiên Hình', 'Thiên Riêu'], mode: 'hoi', ten: 'Hình Riêu', tot: -1, moTa: 'thị phi, tình ái rắc rối, dính líu pháp lý' },
  { sao: ['Thiên Khốc', 'Thiên Hư'], mode: 'hoi', ten: 'Khốc Hư', tot: -1, moTa: 'buồn phiền, hao tổn (ở Tý Ngọ lại có danh)' },
  { sao: ['Tang Môn', 'Bạch Hổ'], mode: 'hoi', ten: 'Tang Hổ', tot: -1, moTa: 'tang thương, tai nạn, bệnh tật, kiện cáo' },
  { sao: ['Cô Thần', 'Quả Tú'], mode: 'hoi', ten: 'Cô Quả', tot: -1, moTa: 'cô đơn, ít người thân cận, hay tự lập' },
  { sao: ['Lộc Tồn', 'Địa Không'], mode: 'dong', ten: 'Lộc ngộ Không', tot: -1, moTa: 'lộc bị hao tán, giữ của khó' },
  { sao: ['Lộc Tồn', 'Địa Kiếp'], mode: 'dong', ten: 'Lộc ngộ Kiếp', tot: -1, moTa: 'lộc bị kiếp đoạt, cẩn thận đầu tư' },
  { sao: ['Hóa Kỵ', 'Kình Dương'], mode: 'dong', ten: 'Kỵ Kình', tot: -1, moTa: 'thị phi, tranh chấp gay gắt' },
  { sao: ['Hóa Kỵ', 'Đà La'], mode: 'dong', ten: 'Kỵ Đà', tot: -1, moTa: 'rắc rối dây dưa, khó dứt' },
  { sao: ['Hóa Khoa', 'Hóa Kỵ'], mode: 'dong', ten: 'Khoa giải Kỵ', tot: 1, moTa: 'Hóa Khoa hóa giải bớt tính xấu của Hóa Kỵ' },
  { sao: ['Thiên Hình', 'Kình Dương'], mode: 'dong', ten: 'Hình Kình', tot: -1, moTa: 'dao kéo, phẫu thuật, kỷ luật – hợp nghề y, quân sự' },
  { sao: ['Thiên Mã', 'Hỏa Tinh'], mode: 'dong', ten: 'Chiến mã', tot: 1, moTa: 'hăng hái, bôn ba mà thành' },
  { sao: ['Thiên Mã', 'Đà La'], mode: 'dong', ten: 'Mã ngộ Đà', tot: -1, moTa: '"chiết túc" – di chuyển trắc trở, dự định chậm' },
  { sao: ['Thiên Mã', 'Tràng Sinh'], mode: 'dong', ten: 'Mã ngộ Tràng Sinh', tot: 1, moTa: 'thăng tiến bền, phát triển liên tục' },
  { sao: ['Văn Xương', 'Hóa Kỵ'], mode: 'dong', ten: 'Xương gặp Kỵ', tot: -1, moTa: 'sai sót giấy tờ, thi cử trắc trở' },
  { sao: ['Văn Khúc', 'Hóa Kỵ'], mode: 'dong', ten: 'Khúc gặp Kỵ', tot: -1, moTa: 'lời nói, hợp đồng dễ sai lệch' },
  { sao: ['Hoa Cái', 'Long Trì', 'Phượng Các'], mode: 'hoi', ten: 'Tứ Linh (Long Phượng Hoa Cái)', min: 3, tot: 1, moTa: 'thanh cao, có danh vọng, hợp nghệ thuật' }
];

// Sao đặc thù theo từng cung
var LG_DAC_THU = {
  'Mệnh': { 'Lộc Tồn': 'Lộc Tồn thủ Mệnh: cẩn trọng, biết giữ của, hơi cô độc.', 'Thiên Mã': 'Thiên Mã tại Mệnh: năng động, hay di chuyển.',
    'Hóa Kỵ': 'Hóa Kỵ tại Mệnh: hay ưu tư, dễ bị hiểu lầm; bền chí mới thành.', 'Địa Không': 'Địa Không tại Mệnh: tư duy khác người, dễ hụt hẫng.',
    'Địa Kiếp': 'Địa Kiếp tại Mệnh: đời thăng trầm, hợp nghề tự do, sáng tạo.', 'Kình Dương': 'Kình Dương tại Mệnh: cương mãnh, dễ nóng; đắc địa thì uy dũng.',
    'Thiên Hình': 'Thiên Hình tại Mệnh: nghiêm khắc, kỷ luật; hợp y, luật, quân đội.', 'Hoa Cái': 'Hoa Cái tại Mệnh: phong cách, kiêu hãnh, thích nghệ thuật – tâm linh.',
    'Hóa Quyền': 'Hóa Quyền tại Mệnh: có uy, thích nắm quyền chủ động.', 'Hóa Khoa': 'Hóa Khoa tại Mệnh: có danh tiếng, học giỏi, gặp nạn có người giải.',
    'Hóa Lộc': 'Hóa Lộc tại Mệnh: được lòng người, cơ hội tài lộc nhiều.' },
  'Phu Thê': { 'Đào Hoa': 'Đào Hoa ở Phu Thê: bạn đời duyên dáng; tình cảm sớm.', 'Hồng Loan': 'Hồng Loan ở Phu Thê: hôn nhân có duyên, dễ lập gia đình.',
    'Thiên Hỷ': 'Thiên Hỷ ở Phu Thê: hôn nhân vui vẻ.', 'Thiên Riêu': 'Thiên Riêu ở Phu Thê: đa tình, dễ có người thứ ba.',
    'Hóa Kỵ': 'Hóa Kỵ ở Phu Thê: vợ chồng hay hiểu lầm, ghen tuông; nên kết hôn muộn.', 'Cô Thần': 'Cô Thần ở Phu Thê: ít chia sẻ, dễ cô đơn trong hôn nhân.',
    'Quả Tú': 'Quả Tú ở Phu Thê: dễ xa cách, đơn chiếc.', 'Địa Không': 'Địa Không ở Phu Thê: tình cảm hụt hẫng, dễ đổ vỡ.',
    'Địa Kiếp': 'Địa Kiếp ở Phu Thê: hôn nhân trắc trở, nên muộn.', 'Kình Dương': 'Kình Dương ở Phu Thê: bạn đời cá tính mạnh, hay va chạm.',
    'Hóa Lộc': 'Hóa Lộc ở Phu Thê: bạn đời mang lại tài lộc.', 'Tả Phù': 'Tả Phù ở Phu Thê: được bạn đời giúp, nhưng đề phòng người thứ ba.',
    'Hữu Bật': 'Hữu Bật ở Phu Thê: bạn đời hỗ trợ; đề phòng tình cảm phức tạp.' },
  'Tài Bạch': { 'Lộc Tồn': 'Lộc Tồn ở Tài: tiền vào đều, biết tiết kiệm.', 'Hóa Lộc': 'Hóa Lộc ở Tài: tài lộc hanh thông, nhiều nguồn.',
    'Thiên Mã': 'Thiên Mã ở Tài: kiếm tiền nhờ di chuyển, buôn bán.', 'Địa Không': 'Địa Không ở Tài: tiền đến rồi đi, tránh đầu cơ.',
    'Địa Kiếp': 'Địa Kiếp ở Tài: dễ mất tiền đột ngột, cẩn thận cho vay.', 'Hóa Kỵ': 'Hóa Kỵ ở Tài: tiền bạc dây dưa, dễ nợ nần.',
    'Kình Dương': 'Kình Dương ở Tài: kiếm tiền bằng cạnh tranh, dễ tranh chấp tiền.', 'Vũ Khúc': '',
    'Đại Hao': 'Đại Hao ở Tài: chi tiêu lớn, khó giữ.', 'Tiểu Hao': 'Tiểu Hao ở Tài: hao hụt lặt vặt.' },
  'Quan Lộc': { 'Hóa Quyền': 'Hóa Quyền ở Quan: nắm quyền, thăng chức.', 'Hóa Khoa': 'Hóa Khoa ở Quan: danh tiếng nghề nghiệp, bằng cấp.',
    'Quốc Ấn': 'Quốc Ấn ở Quan: có chức vụ, ấn tín.', 'Thai Phụ': 'Thai Phụ ở Quan: được khen thưởng.', 'Phong Cáo': 'Phong Cáo ở Quan: được bằng khen, bổ nhiệm.',
    'Thiên Khôi': 'Thiên Khôi ở Quan: cấp trên nâng đỡ.', 'Thiên Việt': 'Thiên Việt ở Quan: có cơ hội thăng tiến.',
    'Thiên Hình': 'Thiên Hình ở Quan: hợp ngành luật, y, quân đội, kỷ luật.', 'Tướng Quân': 'Tướng Quân ở Quan: có uy, hợp chỉ huy.',
    'Kình Dương': 'Kình Dương ở Quan: công việc cạnh tranh, võ nghiệp.', 'Hóa Kỵ': 'Hóa Kỵ ở Quan: công việc trắc trở, dễ bị đố kỵ.',
    'Hóa Lộc': 'Hóa Lộc ở Quan: công việc sinh lợi, thuận.' },
  'Tật Ách': { 'Thiên Y': 'Thiên Y ở Tật: gặp thầy gặp thuốc.', 'Kình Dương': 'Kình Dương ở Tật: thương tích, phẫu thuật.',
    'Đà La': 'Đà La ở Tật: bệnh dai dẳng, răng xương.', 'Hỏa Tinh': 'Hỏa Tinh ở Tật: sốt, viêm, bỏng.', 'Linh Tinh': 'Linh Tinh ở Tật: bệnh âm ỉ, thần kinh.',
    'Thiên Hình': 'Thiên Hình ở Tật: dao kéo, phẫu thuật.', 'Hóa Kỵ': 'Hóa Kỵ ở Tật: bệnh kinh niên, khó dứt.',
    'Bệnh Phù': 'Bệnh Phù ở Tật: sức đề kháng yếu.', 'Giải Thần': 'Giải Thần ở Tật: bệnh gặp giải.', 'Thiên Giải': 'Thiên Giải ở Tật: tai ách giảm.',
    'Lưu Hà': 'Lưu Hà ở Tật: chú ý máu huyết, sông nước.' },
  'Thiên Di': { 'Thiên Mã': 'Thiên Mã ở Di: đi xa nhiều, xuất ngoại.', 'Tả Phù': 'Tả Phù ở Di: ra ngoài được giúp.', 'Hữu Bật': 'Hữu Bật ở Di: có người hỗ trợ bên ngoài.',
    'Thiên Khôi': 'Thiên Khôi ở Di: gặp quý nhân nơi xa.', 'Thiên Việt': 'Thiên Việt ở Di: gặp cơ hội bên ngoài.',
    'Kình Dương': 'Kình Dương ở Di: đề phòng tai nạn đường xa.', 'Đà La': 'Đà La ở Di: đi lại trắc trở.', 'Hóa Kỵ': 'Hóa Kỵ ở Di: ra ngoài dễ bị thị phi.',
    'Thiên Không': 'Thiên Không ở Di: cẩn thận lừa đảo.', 'Hóa Lộc': 'Hóa Lộc ở Di: ra ngoài có tiền.' },
  'Điền Trạch': { 'Lộc Tồn': 'Lộc Tồn ở Điền: giữ được nhà đất.', 'Hóa Lộc': 'Hóa Lộc ở Điền: tăng thêm tài sản bất động sản.',
    'Địa Không': 'Địa Không ở Điền: nhà cửa dễ hao hụt.', 'Địa Kiếp': 'Địa Kiếp ở Điền: đề phòng mất nhà đất, tranh chấp.',
    'Hỏa Tinh': 'Hỏa Tinh ở Điền: đề phòng hỏa hoạn.', 'Thiên Trù': 'Thiên Trù ở Điền: nhà đủ ăn, bếp núc ấm.', 'Hóa Kỵ': 'Hóa Kỵ ở Điền: giấy tờ nhà đất rắc rối.' },
  'Phúc Đức': { 'Thiên Đức': 'Thiên Đức ở Phúc: âm đức phù hộ.', 'Nguyệt Đức': 'Nguyệt Đức ở Phúc: tâm thiện, phúc hậu.', 'Hoa Cái': 'Hoa Cái ở Phúc: thiên hướng tâm linh, tôn giáo.',
    'Địa Không': 'Địa Không ở Phúc: tinh thần hay trống trải.', 'Địa Kiếp': 'Địa Kiếp ở Phúc: phúc mỏng, cần tu tâm.', 'Thiên Hư': 'Thiên Hư ở Phúc: hay lo âu.',
    'Hóa Kỵ': 'Hóa Kỵ ở Phúc: nội tâm nặng nề, họ hàng thị phi.' },
  'Tử Tức': { 'Thai': 'Thai ở Tử Tức: con cái sớm, dễ có thai.', 'Hồng Loan': 'Hồng Loan ở Tử Tức: con cái xinh xắn.', 'Thiên Hỷ': 'Thiên Hỷ ở Tử Tức: có tin vui con cái.',
    'Thiên Riêu': 'Thiên Riêu ở Tử Tức: con cái đa tình.', 'Địa Không': 'Địa Không ở Tử Tức: hiếm muộn.', 'Địa Kiếp': 'Địa Kiếp ở Tử Tức: sinh nở trắc trở.',
    'Kình Dương': 'Kình Dương ở Tử Tức: con cá tính, dễ va chạm.', 'Hóa Kỵ': 'Hóa Kỵ ở Tử Tức: lo lắng vì con.' },
  'Phụ Mẫu': { 'Tang Môn': 'Tang Môn ở Phụ Mẫu: chú ý sức khỏe cha mẹ.', 'Bạch Hổ': 'Bạch Hổ ở Phụ Mẫu: cha mẹ vất vả, giấy tờ rắc rối.',
    'Thiên Khốc': 'Thiên Khốc ở Phụ Mẫu: buồn phiền về cha mẹ.', 'Kình Dương': 'Kình Dương ở Phụ Mẫu: bất đồng với cha mẹ.',
    'Văn Xương': 'Văn Xương ở Phụ Mẫu: học hành, giấy tờ thuận.', 'Văn Khúc': 'Văn Khúc ở Phụ Mẫu: cha mẹ có học.',
    'Thiên Khôi': 'Thiên Khôi ở Phụ Mẫu: cha mẹ, bề trên nâng đỡ.', 'Hóa Kỵ': 'Hóa Kỵ ở Phụ Mẫu: dễ xung khắc với bề trên, giấy tờ vướng.' },
  'Huynh Đệ': { 'Tả Phù': 'Tả Phù ở Huynh: anh em giúp đỡ.', 'Hữu Bật': 'Hữu Bật ở Huynh: anh em đông, đỡ đần.', 'Kình Dương': 'Kình Dương ở Huynh: anh em bất hòa.',
    'Địa Kiếp': 'Địa Kiếp ở Huynh: anh em hao tán.', 'Hóa Kỵ': 'Hóa Kỵ ở Huynh: hiểu lầm với anh em.' },
  'Nô Bộc': { 'Tả Phù': 'Tả Phù ở Nô: có người giúp việc đắc lực.', 'Hữu Bật': 'Hữu Bật ở Nô: bạn bè hỗ trợ.', 'Kình Dương': 'Kình Dương ở Nô: bạn bè tranh giành.',
    'Phục Binh': 'Phục Binh ở Nô: đề phòng bị phản.', 'Thiên Hình': 'Thiên Hình ở Nô: dễ kiện tụng với người dưới.', 'Hóa Kỵ': 'Hóa Kỵ ở Nô: bị bạn bè đố kỵ.' }
};

var LG_TRANG_SINH_Y = {
  'Tràng Sinh': 'khởi sinh – lĩnh vực này có sức sống, phát triển bền', 'Mộc Dục': 'tắm gội – dễ thay đổi, đào hoa, chưa ổn định',
  'Quan Đới': 'chuẩn bị thành – đang tích lũy, sắp thành đạt', 'Lâm Quan': 'thành đạt – có vị trí, năng lực thể hiện rõ',
  'Đế Vượng': 'cực thịnh – mạnh nhất, nhưng thịnh cực dễ suy', 'Suy': 'suy – lực yếu dần, nên giữ gìn',
  'Bệnh': 'bệnh – trì trệ, cần chăm chút', 'Tử': 'ngưng – ít biến động, thiếu sinh khí', 'Mộ': 'tàng – tích lũy, giữ được (tốt cho Tài, Điền)',
  'Tuyệt': 'đứt đoạn – dễ gián đoạn rồi bắt đầu lại', 'Thai': 'thai nghén – ý tưởng mới, chưa thành hình', 'Dưỡng': 'nuôi dưỡng – được bồi đắp, chậm mà chắc'
};

var LG_HOA_Y = {
  'Hóa Lộc': 'được kích hoạt tài lộc, thuận lợi, sinh lợi', 'Hóa Quyền': 'nắm quyền, chủ động, tranh đua, mở rộng',
  'Hóa Khoa': 'danh tiếng, học hành, được giúp đỡ, giải hung', 'Hóa Kỵ': 'vướng mắc, lo lắng, hao tổn, thị phi'
};

/* ---------------------- TIỆN ÍCH ---------------------- */
function lgPos_(chart, name) {
  var p = chart.pos[name];
  if (p == null) p = chart.pos['TT.' + name];
  return p;
}
function lgSaoTrongCung_(chart, pi) {
  var P = chart.palaces[pi];
  var arr = P.chinh.concat(P.cat, P.hung, P.tieu).map(function (s) { return s.n; });
  if (P.trangSinh) arr.push(P.trangSinh);
  if (P.bacSi) arr.push(P.bacSi);
  if (P.thaiTue) arr.push(P.thaiTue);
  return arr;
}
function lgTPTC_(pi) { return [pi, mod12(pi + 4), mod12(pi + 8), mod12(pi + 6)]; }
function lgNhiHop_(pi) { return mod12(1 - pi); }
function lgSaoMoTa_(P) {
  return P.chinh.map(function (s) { return s.n + (s.b ? ' (' + DO_SANG_TEN[s.b] + ')' : '') + (s.hoa ? ' hóa ' + s.hoa : ''); }).join(', ');
}
function lgXepHang_(d) {
  var x = chuanHoa10_(d);   // d luôn là điểm thô (cộng dồn trọng số) – quy về thang 10 rồi mới xếp hạng
  if (x >= 8.5) return 'Rất tốt';
  if (x >= 7) return 'Tốt';
  if (x >= 5.5) return 'Khá';
  if (x >= 4) return 'Trung bình';
  if (x >= 2.5) return 'Kém';
  return 'Cần thận trọng';
}
function lgR_(x) { return Math.round(x * 10) / 10; }
/** Quy điểm thô (cộng dồn trọng số sao, không có trần) về thang 10 bằng hàm logistic:
 *  0 điểm thô = 5/10; +5 (Rất tốt) ≈ 8,4; +2,5 (Tốt) ≈ 7; +0,5 (Khá) ≈ 5,4; −1,5 ≈ 3,8; −4 (Kém) ≈ 2,1. */
function diem10_(d) { return chuanHoa10_(d); }

/** Quan hệ giữa hai địa chi */
function lgQuanHeChi_(a, b) {
  var out = [];
  if (a === b) out.push('trùng (đồng chi)');
  if (a !== b && mod12(a - b) % 4 === 0) out.push('tam hợp');
  if (mod12(1 - a) === b) out.push('lục hợp');
  if (mod12(a - b) === 6) out.push('lục xung');
  var hai = ['0-7', '1-6', '2-5', '3-4', '8-11', '9-10'];
  if (hai.indexOf(Math.min(a, b) + '-' + Math.max(a, b)) >= 0) out.push('lục hại');
  var hinh = [[2, 5], [5, 8], [2, 8], [1, 10], [10, 7], [1, 7], [0, 3]];
  hinh.forEach(function (h) { if ((h[0] === a && h[1] === b) || (h[0] === b && h[1] === a)) out.push('tương hình'); });
  if (a === b && [4, 6, 9, 11].indexOf(a) >= 0) out.push('tự hình');
  return out;
}

/** Kiểm tra bộ phụ tinh trong vùng tam phương của cung pi */
function lgBoPhuTinh_(chart, pi, extra) {
  var res = [];
  var tptc = lgTPTC_(pi);
  var here = lgSaoTrongCung_(chart, pi).concat(extra ? (extra[pi] || []) : []);
  function posList(name) {
    var ps = [];
    var p = lgPos_(chart, name);
    if (p != null) ps.push(p);
    if (extra) { for (var k in extra) if (extra[k].indexOf(name) >= 0) ps.push(parseInt(k, 10)); }
    return ps;
  }
  LG_BO_PHU.forEach(function (b) {
    var ok = false, where = '';
    if (b.mode === 'dong') {
      ok = b.sao.every(function (s) { return here.indexOf(s) >= 0; });
      where = 'đồng cung';
    } else if (b.mode === 'hoi') {
      var c = b.sao.filter(function (s) { return posList(s).some(function (p) { return tptc.indexOf(p) >= 0; }); }).length;
      ok = c >= (b.min || b.sao.length);
      var inHere = b.sao.filter(function (s) { return here.indexOf(s) >= 0; }).length;
      where = inHere === b.sao.length ? 'đồng cung' : inHere ? 'thủ – chiếu' : 'hội chiếu';
    } else if (b.mode === 'giap') {
      var l = mod12(pi - 1), r = mod12(pi + 1);
      var a = posList(b.sao[0]), z = posList(b.sao[1]);
      ok = (a.indexOf(l) >= 0 && z.indexOf(r) >= 0) || (a.indexOf(r) >= 0 && z.indexOf(l) >= 0);
      where = 'giáp cung';
    }
    if (ok) res.push({ ten: b.ten, tot: b.tot, where: where, moTa: b.moTa });
  });
  return res;
}

/* ============================================================
 *  1. PHÂN TÍCH MỘT CUNG (dùng chung cho cung gốc & cung hạn)
 * ============================================================ */
function lgPhanTichCung_(chart, pi, opt) {
  opt = opt || {};
  var P = chart.palaces, I = chart.info;
  var C = P[pi];
  var cungTen = opt.cungTen || C.cung;
  var linhVuc = opt.linhVuc || LG_LINH_VUC[cungTen] || cungTen;
  var secs = [];

  // --- Cơ sở ---
  var coSo = [];
  var na = napAm(C.can, C.chi);
  coSo.push('Cung ' + cungTen + ' an tại ' + C.canTen + ' ' + C.chiTen + ' (hành cung ' + CHI_HANH[C.chi] + ', nạp âm ' + na.ten + ') – chủ về ' + (Y_NGHIA_CUNG[cungTen] || linhVuc) + '.');
  if (cungTen !== 'Mệnh' && !opt.laHan) {
    var qh = quanHeHanh(CHI_HANH[C.chi], CHI_HANH[I.menh]);
    coSo.push('Ngũ hành cung (' + CHI_HANH[C.chi] + ') với cung Mệnh (' + CHI_HANH[I.menh] + '): ' + {
      'sinh': 'cung này sinh Mệnh → lĩnh vực ' + linhVuc + ' hỗ trợ, nâng đỡ bản thân.',
      'duoc_sinh': 'Mệnh sinh cung này → bản thân phải hao tâm sức lo cho ' + linhVuc + '.',
      'binh': 'đồng hành → hòa hợp, gắn bó tự nhiên.',
      'khac': 'cung khắc Mệnh → ' + linhVuc + ' dễ tạo áp lực cho bản thân.',
      'bi_khac': 'Mệnh khắc cung → bản thân chủ động, chế ngự được lĩnh vực này nhưng tốn sức.'
    }[qh]);
  }
  var qh2 = quanHeHanh(na.hanh, I.banMenh.hanh);
  coSo.push('Nạp âm cung (' + na.hanh + ') với bản mệnh ' + I.banMenh.ten + ' (' + I.banMenh.hanh + '): ' +
    { 'sinh': 'sinh bản mệnh – thuận.', 'duoc_sinh': 'được bản mệnh sinh – hao lực.', 'binh': 'bình hòa.', 'khac': 'khắc bản mệnh – bất lợi.', 'bi_khac': 'bị bản mệnh khắc – vất vả mà làm chủ được.' }[qh2]);
  if (C.trangSinh) coSo.push('Vòng Tràng Sinh: ' + C.trangSinh + ' – ' + LG_TRANG_SINH_Y[C.trangSinh] + '.');
  if (C.tuan) coSo.push('Gặp Tuần Không: lực các sao giảm, việc thường chậm hoặc dở dang lúc đầu, về sau mới rõ.');
  if (C.triet) coSo.push('Gặp Triệt Lộ: bị cắt ngang ở giai đoạn đầu (tiền vận), sao xấu cũng bị chặn bớt.');
  secs.push({ tieuDe: 'Cơ sở', items: coSo });

  // --- Chính tinh ---
  var ct = [];
  var ref = pi, muon = false;
  if (!C.chinh.length) {
    ref = mod12(pi + 6); muon = true;
    ct.push('Vô chính diệu: cung không có chính tinh nên "mượn" chính tinh cung xung chiếu (' + P[ref].cung + ' – ' + P[ref].chiTen + '): ' +
      (lgSaoMoTa_(P[ref]) || 'không có') + '. Lực mượn chỉ còn khoảng một nửa, tính chất cung phụ thuộc nhiều vào phụ tinh và vận hạn.');
    if (C.tuan || C.triet || lgSaoTrongCung_(chart, pi).indexOf('Địa Không') >= 0 || lgSaoTrongCung_(chart, pi).indexOf('Thiên Không') >= 0)
      ct.push('Vô chính diệu gặp Không (Tuần/Triệt/Địa Không/Thiên Không) – "không cung đắc không" lại thành tốt, dễ có bước ngoặt bất ngờ.');
  } else {
    ct.push('Chính tinh tọa thủ: ' + lgSaoMoTa_(C) + '.');
  }
  var names = P[ref].chinh.map(function (s) { return s.n; })
    .sort(function (a, b) { return LG_THU_TU_CHINH.indexOf(a) - LG_THU_TU_CHINH.indexOf(b); });
  if (names.length === 2 && LG_BO_CHINH[names.join('|')]) ct.push('Bộ sao: ' + LG_BO_CHINH[names.join('|')]);
  P[ref].chinh.forEach(function (s) {
    var tx;
    if (cungTen === 'Mệnh') tx = LUAN_CHINH_TINH_MENH[s.n];
    else if (LUAN_CUNG_SAO[cungTen]) tx = LUAN_CUNG_SAO[cungTen][s.n];
    else if (LG_CUNG_SAO[cungTen]) tx = LG_CUNG_SAO[cungTen][s.n];
    var sang = s.b ? (DO_SANG_DIEM[s.b] >= 1 ? ' Sao ' + DO_SANG_TEN[s.b] + ' nên mặt tốt được phát huy.' :
      DO_SANG_DIEM[s.b] < 0 ? ' Sao hãm địa nên mặt tiêu cực dễ lộ, cần cát tinh hoặc Tuần/Triệt chế hóa.' : ' Sao bình hòa.') : '';
    if (tx) ct.push(s.n + ': ' + tx + sang);
    if (s.hoa) ct.push(s.n + ' hóa ' + s.hoa + ' – ' + LG_HOA_Y['Hóa ' + s.hoa] + ' ngay trên lĩnh vực ' + linhVuc + '.');
  });
  secs.push({ tieuDe: 'Chính tinh & bộ sao', items: ct });

    // --- Tương tác các cung (đầy đủ: TPTC + nhị hợp + giáp 2 bên + Tuần/Triệt kẹp) ---
  var tt = [];
  var th1 = mod12(pi + 4), th2 = mod12(pi + 8), xc = mod12(pi + 6), nh = lgNhiHop_(pi);
  var giapL = mod12(pi - 1), giapR = mod12(pi + 1);

  function tenCung(x) { return (opt.tenCungHan ? opt.tenCungHan(x) : P[x].cung) + ' (' + P[x].chiTen + ')'; }
  function danhGiaGon(x) {
    var d = P[x].diem;
    return (P[x].chinh.length ? lgSaoMoTa_(P[x]) : 'vô chính diệu') + ' – ' + (d >= 2.5 ? 'hỗ trợ tốt' : d >= 0.5 ? 'hỗ trợ vừa' : d > -1.5 ? 'trung tính' : 'gây áp lực');
  }
  function tomSao(p) {
    var c = P[p].chinh.map(function(s){ return s.n; }).join(', ') || 'VCD';
    var cat = P[p].cat.slice(0,3).map(function(s){ return s.n; }).join(', ');
    var hung = P[p].hung.slice(0,3).map(function(s){ return s.n; }).join(', ');
    var parts = ['chính: ' + c];
    if (cat) parts.push('cát: ' + cat);
    if (hung) parts.push('hung: ' + hung);
    return parts.join(' · ');
  }

  // 1) Tam phương tứ chính – nêu rõ vai trò thể/dụng
  tt.push('◈ Bản cung (THỂ – chủ, ~50% sức nặng): ' + tomSao(pi) + '.');
  tt.push('◈ Tam hợp 1 – ' + tenCung(th1) + ' (~12,5%): ' + tomSao(th1) + ' → ' + danhGiaGon(th1) + '.');
  tt.push('◈ Tam hợp 2 – ' + tenCung(th2) + ' (~12,5%): ' + tomSao(th2) + ' → ' + danhGiaGon(th2) + '.');
  tt.push('◈ Xung chiếu (DỤNG – phản chiếu, ~25%): ' + tenCung(xc) + ' – ' + tomSao(xc) + ' → ' + danhGiaGon(xc) + '. Cung đối là "tấm gương": điều gì bị che ở bản cung sẽ lộ ra ở đây.');

  // 2) Nhị hợp – ảnh hưởng ngầm
  tt.push('◇ Nhị hợp (Lục hợp – ảnh hưởng NGẦM, nhẹ nhưng dai dẳng): ' + tenCung(nh) + ' – ' + tomSao(nh) + ' → ' + danhGiaGon(nh) +
    '. Cổ điển: "nhị hợp là cái phông nền" – cát thì âm thầm nâng đỡ, hung thì âm thầm kéo lùi, khó nhận ra ngay.');

  // 3) Giáp cung – kẹp hai bên (có cả giáp sát và giáp Tuần/Triệt)
  var giapGood = ['Tả Phù', 'Hữu Bật', 'Văn Xương', 'Văn Khúc', 'Thiên Khôi', 'Thiên Việt', 'Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Lộc Tồn', 'Thiên Đức', 'Nguyệt Đức', 'Long Trì', 'Phượng Các'];
  var giapBad  = ['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh', 'Địa Không', 'Địa Kiếp', 'Hóa Kỵ', 'Thiên Hình', 'Thiên Riêu', 'Tang Môn', 'Bạch Hổ', 'Thiên Khốc', 'Thiên Hư', 'Cô Thần', 'Quả Tú'];
  var gLgood = lgSaoTrongCung_(chart, giapL).filter(function(s){ return giapGood.indexOf(s)>=0; });
  var gRgood = lgSaoTrongCung_(chart, giapR).filter(function(s){ return giapGood.indexOf(s)>=0; });
  var gLbad  = lgSaoTrongCung_(chart, giapL).filter(function(s){ return giapBad.indexOf(s)>=0; });
  var gRbad  = lgSaoTrongCung_(chart, giapR).filter(function(s){ return giapBad.indexOf(s)>=0; });
  var gLtuan = P[giapL].tuan || P[giapL].triet, gRtuan = P[giapR].tuan || P[giapR].triet;

  if (gLgood.length && gRgood.length)
    tt.push('✓ Giáp CÁT hai bên: ' + gLgood.join(', ') + ' (trái) và ' + gRgood.join(', ') + ' (phải) – được nâng đỡ từ hai phía, quý cách.');
  if (gLbad.length && gRbad.length)
    tt.push('✗ Giáp SÁT hai bên: ' + gLbad.join(', ') + ' (trái) và ' + gRbad.join(', ') + ' (phải) – bị kìm kẹp, dễ gặp trở ngại từ cả hai phía. Cần Tuần/Triệt hoặc Hóa Khoa giải.');
  if ((gLgood.length && gRbad.length) || (gLbad.length && gRgood.length)) {
    var tot = gLgood.length ? gLgood.join(', ') + ' (trái)' : gRgood.join(', ') + ' (phải)';
    var xau = gLbad.length ? gLbad.join(', ') + ' (trái)' : gRbad.join(', ') + ' (phải)';
    tt.push('◇ Giáp nửa cát nửa hung: bên cát là ' + tot + ', bên hung là ' + xau + '.');
  }
  if (gLtuan && gRtuan)
    tt.push('◇ Giáp Tuần/Triệt cả hai bên – cung bị "bọc kín": việc tới lui đều bị cắt, nhưng hung tinh cũng bị chặn. Thường chủ về "vô sự" – ít được nhưng cũng ít mất.');
  else if (gLtuan || gRtuan)
    tt.push('◇ Một bên bị Tuần/Triệt chặn – một nửa cung bị cắt, ảnh hưởng lệch về bên còn lại.');

  // 4) Nhóm lớn trong TPTC
  var tptc = lgTPTC_(pi);
  LG_NHOM_LON.forEach(function (g) {
    var c = g.sao.filter(function (s) { return tptc.indexOf(chart.pos[s]) >= 0; }).length;
    if (c >= g.can) tt.push('◆ Tam phương tứ chính thuộc hệ ' + g.ten + ' (' + c + '/' + g.sao.length + ' sao): ' + g.moTa);
  });

  // 5) Tổng lực tam phương có trọng số
  var tong = C.diem * 0.5 + P[xc].diem * 0.25 + (P[th1].diem + P[th2].diem) * 0.125;
  tt.push('◈ Tổng lực tam phương tứ chính (bản cung ½ + xung ¼ + 2 tam hợp mỗi cái ⅛): điểm thô ' + lgR_(tong) + ' → thang 10: ' + chuanHoa10_(tong) + '/10.');
  secs.push({ tieuDe: 'Tương tác các cung (tam phương tứ chính · nhị hợp · giáp cung)', items: tt });

  // --- Bộ phụ tinh ---
  var bp = lgBoPhuTinh_(chart, pi, opt.extra).map(function (b) {
    return (b.tot > 0 ? '✓ ' : b.tot < 0 ? '✗ ' : '◇ ') + b.ten + ' (' + b.where + '): ' + b.moTa + ' – ứng vào ' + linhVuc + '.';
  });
  var catLe = C.cat.filter(function (s) { return !s.hoaOf; }).map(function (s) { return s.n; });
  var hungLe = C.hung.filter(function (s) { return !s.hoaOf; }).map(function (s) {
    return s.n + (s.b === 'Đ' ? ' (đắc địa – giảm hung, thêm quyết đoán)' : '');
  });
  if (catLe.length) bp.push('Cát tinh tọa thủ: ' + catLe.join(', ') + '.');
  if (hungLe.length) bp.push('Hung – sát tinh tọa thủ: ' + hungLe.join(', ') + '.');
  if (C.bacSi) bp.push('Vòng Bác Sĩ: ' + C.bacSi + ' (' + ((SAO[C.bacSi] || [])[2] || '') + ').');
  if (C.thaiTue) bp.push('Vòng Thái Tuế: ' + C.thaiTue + ' (' + ((SAO[C.thaiTue] || [])[2] || '') + ').');
  if (!bp.length) bp.push('Không có bộ phụ tinh nổi bật.');
  secs.push({ tieuDe: 'Bộ phụ tinh & tương tác sao', items: bp });

  // --- Sao đặc thù ---
  var dt = [];
  var dict = LG_DAC_THU[cungTen] || {};
  lgSaoTrongCung_(chart, pi).forEach(function (n) { if (dict[n]) dt.push(dict[n]); });
  if (dt.length) secs.push({ tieuDe: 'Sao đặc thù tại cung ' + cungTen, items: dt });

  return { secs: secs, tongLuc: tong };
}

/* ============================================================
 *  2. LUẬN 12 CUNG
 * ============================================================ */
function lgLuan12Cung_(chart) {
  var P = chart.palaces, I = chart.info;
  var out = [];
  for (var k = 0; k < 12; k++) {
    var pi = mod12(I.menh - k);
    var C = P[pi];
    var a = lgPhanTichCung_(chart, pi);
    var d = lgR_(a.tongLuc * 1.4);
    var ket = [];
    ket.push('Đánh giá tổng hợp: ' + lgXepHang_(d) + ' (' + diem10_(d) + '/10).');
    if (C.isThan) ket.push('Cung này có Thân cư – là trọng tâm của hậu vận (sau khoảng 30 tuổi).');
    if (C.isDaiHan) ket.push('Đại hạn hiện tại đang đi qua cung này – lĩnh vực ' + LG_LINH_VUC[C.cung] + ' nổi bật trong 10 năm.');
    if (C.isTieuHan) ket.push('Tiểu hạn năm ' + I.viewYear + ' đóng tại đây.');
    a.secs.push({ tieuDe: 'Kết luận', items: ket });
    // Sinh văn dễ hiểu cho cung — gửi xuống client
    var vanFacts = null;
    if (C.cung === 'Mệnh') {
  var factsMenh = tuviSinhFactsCung_(chart, pi);
  vanFacts = {
    kieu: 'menh',
    diemManh: tuviSinhDoanDiemManh_(factsMenh),
    diemYeu:  tuviSinhDoanDiemYeu_(factsMenh),
    anhHuong: tuviSinhDoanAnhHuong_(factsMenh),
    dacBiet:  tuviSinhDoanDacBiet_(factsMenh),
    hoanCanh: sinhDoanHoanCanh_(chart, pi, 'Mệnh')
  };
    } else if (C.cung === 'Phu Thê') {
  vanFacts = {
    kieu: 'phuthe',
    doan: chenHoanCanh_(sinhVanCungPhuThe_(chart, pi), chart, pi, 'Phu Thê')
  };
} else if (C.cung === 'Tài Bạch') {
      vanFacts = {
        kieu: 'taibach',
        doan: chenHoanCanh_(sinhVanCungTaiBach_(chart, pi), chart, pi, 'Tài Bạch')
      };

    } else if (C.cung === 'Quan Lộc') {
      vanFacts = {
        kieu: 'quanloc',
        doan: chenHoanCanh_(sinhVanCungQuanLoc_(chart, pi), chart, pi, 'Quan Lộc')
      };

    } else if (C.cung === 'Tử Tức') {
      vanFacts = {
        kieu: 'tutuc',
        doan: chenHoanCanh_(sinhVanCungTuTuc_(chart, pi), chart, pi, 'Tử Tức')
      };
    } else if (C.cung === 'Tật Ách') {
      vanFacts = {
        kieu: 'tatach',
        doan: chenHoanCanh_(sinhVanCungTatAch_(chart, pi), chart, pi, 'Tật Ách')
      };
    } else if (C.cung === 'Điền Trạch') {
      vanFacts = {
        kieu: 'dientrach',
        doan: chenHoanCanh_(sinhVanCungDienTrach_(chart, pi), chart, pi, 'Điền Trạch')
      };
    } else if (C.cung === 'Phúc Đức') {
      vanFacts = {
        kieu: 'phucduc',
        doan: chenHoanCanh_(sinhVanCungPhucDuc_(chart, pi), chart, pi, 'Phúc Đức')
      };
    } else if (C.cung === 'Thiên Di') {
  vanFacts = {
    kieu: 'thiendi',
    doan: chenHoanCanh_(sinhVanCungThienDi_(chart, pi), chart, pi, 'Thiên Di')
  };
    } else if (C.cung === 'Nô Bộc') {
  vanFacts = { kieu: 'noboc', doan: chenHoanCanh_(sinhVanCungNoBoc_(chart, pi), chart, pi, 'Nô Bộc') };
} else if (C.cung === 'Phụ Mẫu') {
  vanFacts = { kieu: 'phumau', doan: chenHoanCanh_(sinhVanCungPhuMau_(chart, pi), chart, pi, 'Phụ Mẫu') };
} else if (C.cung === 'Huynh Đệ') {
  vanFacts = { kieu: 'huynhde', doan: chenHoanCanh_(sinhVanCungHuynhDe_(chart, pi), chart, pi, 'Huynh Đệ') };
}
    out.push({ cung: C.cung, chi: C.chiTen, canChi: C.canTen + ' ' + C.chiTen, diem: d, danhGia: lgXepHang_(d), isThan: !!C.isThan, secs: a.secs, vanFacts: vanFacts });
  }
  return out;
}

/* ============================================================
 *  3. ĐẠI VẬN
 * ============================================================ */
function lgDaiVan_(chart, bt) {
  var P = chart.palaces, I = chart.info;
  var list = [];
  var order = [];
  for (var i = 0; i < 12; i++) order.push(mod12(I.menh + (I.thuan ? i : -i)));
  order.forEach(function (pi, idx) {
    var C = P[pi];
    var from = C.daiHan, to = C.daiHan + 9;
    var dhCan = C.can;
    // cung chức của hạn: Mệnh hạn = pi; các cung khác tính nghịch
    function tenCungHan(x) { return 'Đại ' + CUNG_NAMES[mod12(pi - x)] + '/gốc ' + P[x].cung; }
    // tứ hóa & Lộc Kình Đà đại vận
    var extra = {};
    function addEx(p, n) { p = mod12(p); (extra[p] = extra[p] || []).push(n); }
    var hoaItems = [];
    for (var h = 0; h < 4; h++) {
      var sName = chart.tuHoa[dhCan][h];
      var sp = chart.pos[sName];
      addEx(sp, HOA_TEN[h]);
      var tenGoc = P[sp].cung, tenHan = CUNG_NAMES[mod12(pi - sp)];
      hoaItems.push('ĐV ' + HOA_TEN[h] + ' (' + sName + ') nhập cung gốc ' + tenGoc + ' = Đại ' + tenHan + ': ' + LG_HOA_Y[HOA_TEN[h]] + ' về ' + LG_LINH_VUC[tenHan] + '.');
    }
    var lt = LOC_TON_POS[dhCan];
    addEx(lt, 'Lộc Tồn'); addEx(lt + 1, 'Kình Dương'); addEx(lt - 1, 'Đà La');
    var tptc = lgTPTC_(pi);
    var ltTxt = 'ĐV Lộc Tồn tại ' + CHI[lt] + ' (' + P[lt].cung + ')' + (tptc.indexOf(lt) >= 0 ? ' – chiếu vào hạn: có nguồn lộc ổn định.' : '.');
    var kd = [];
    if (tptc.indexOf(mod12(lt + 1)) >= 0) kd.push('ĐV Kình Dương chiếu hạn');
    if (tptc.indexOf(mod12(lt - 1)) >= 0) kd.push('ĐV Đà La chiếu hạn');
    // trùng phùng với Kình Đà gốc
    var trung = [];
    if (mod12(lt + 1) === chart.pos['Kình Dương'] || mod12(lt + 1) === chart.pos['Đà La']) trung.push('Kình Dương đại vận trùng sát tinh gốc');
    if (mod12(lt - 1) === chart.pos['Kình Dương'] || mod12(lt - 1) === chart.pos['Đà La']) trung.push('Đà La đại vận trùng sát tinh gốc');

    var a = lgPhanTichCung_(chart, pi, { cungTen: 'Mệnh', laHan: true, extra: extra, tenCungHan: tenCungHan, linhVuc: 'vận 10 năm này' });
    // điểm hạn
    var d = a.tongLuc * 1.4;
    for (var hh = 0; hh < 4; hh++) {
      var p2 = chart.pos[chart.tuHoa[dhCan][hh]];
      var w = tptc.indexOf(p2) === 0 ? 1 : tptc.indexOf(p2) > 0 ? 0.5 : 0;
      d += w * [2, 1.5, 1.5, -2.5][hh];
    }
    if (kd.length) d -= 0.8 * kd.length;
    d -= trung.length * 0.8;
    d = lgR_(d);

    var coSo = [
      'Đại hạn thứ ' + (idx + 1) + ': ' + from + '–' + to + ' tuổi (âm), năm ' + (I.lunar.year + from - 1) + '–' + (I.lunar.year + to - 1) + ', đi ' + (I.thuan ? 'thuận' : 'nghịch') + ' – cung gốc ' + C.cung + ' (' + C.canTen + ' ' + C.chiTen + ').',
      'Cung gốc là ' + C.cung + ' nên 10 năm này lĩnh vực "' + LG_LINH_VUC[C.cung] + '" được đặt lên hàng đầu, ảnh hưởng tới bản thân.',
      'Can cung hạn ' + C.canTen + ' khởi Tứ Hóa đại vận: Lộc ' + chart.tuHoa[dhCan][0] + ', Quyền ' + chart.tuHoa[dhCan][1] + ', Khoa ' + chart.tuHoa[dhCan][2] + ', Kỵ ' + chart.tuHoa[dhCan][3] + '.'
    ];
    var secs = [{ tieuDe: 'Cơ sở đại vận', items: coSo }];
    secs = secs.concat(a.secs.slice(1));
    secs.push({ tieuDe: 'Tứ Hóa & Lộc – Kình – Đà đại vận', items: hoaItems.concat([ltTxt]).concat(kd.length ? [kd.join(', ') + ' – 10 năm có cạnh tranh, trở ngại.'] : []).concat(trung.length ? [trung.join('; ') + ' – "trùng phùng" sát khí, cần đề phòng tai nạn, kiện tụng.'] : []) });

    // cung chức hạn
    var linh = [
      ['Công danh', mod12(pi - 8)], ['Tài lộc', mod12(pi - 4)], ['Tình cảm', mod12(pi - 2)], ['Sức khỏe', mod12(pi - 5)], ['Đi xa – xã hội', mod12(pi - 6)]
    ].map(function (x) {
      var p = x[1], sc = P[p].diem;
      (extra[p] || []).forEach(function (n) { sc += ({ 'Hóa Lộc': 2, 'Hóa Quyền': 1.5, 'Hóa Khoa': 1.5, 'Hóa Kỵ': -2.5, 'Lộc Tồn': 1.5, 'Kình Dương': -1.2, 'Đà La': -1.2 })[n] || 0; });
      return x[0] + ' (Đại ' + CUNG_NAMES[mod12(pi - p)] + ' tại gốc ' + P[p].cung + ' – ' + (P[p].chinh.length ? lgSaoMoTa_(P[p]) : 'VCD') + (extra[p] ? '; ĐV: ' + extra[p].join(', ') : '') + '): ' + lgXepHang_(sc).toLowerCase() + '.';
    });
    secs.push({ tieuDe: 'Các lĩnh vực trong đại vận', items: linh });

    // đối chiếu bát tự
    var bz = [];
    if (bt && bt.daiVan) {
      var birthY = I.solar.year;
      var y0 = I.lunar.year + from - 1, y1 = I.lunar.year + to - 1;
      bt.daiVan.forEach(function (v) {
        if (v.nam <= y1 && v.nam + 9 >= y0) bz.push('Đại vận Bát Tự ' + v.canChi + ' (' + v.nam + '–' + (v.nam + 9) + '): can ' + v.thapThan + ', chi ' + v.chiThapThan + ' – ' + v.danhGia + '. Hành ' + v.hanhCan + '/' + v.hanhChi + (bt.goiY.hy.indexOf(v.hanhCan) >= 0 ? ' thuộc Hỷ/Dụng thần.' : bt.goiY.ky.indexOf(v.hanhCan) >= 0 ? ' thuộc Kỵ thần.' : '.'));
      });
      var hanhCung = napAm(C.can, C.chi).hanh;
      bz.push('Nạp âm cung hạn hành ' + hanhCung + (bt.goiY.hy.indexOf(hanhCung) >= 0 ? ' trùng hành Hỷ/Dụng thần Bát Tự → cộng hưởng tốt.' : bt.goiY.ky.indexOf(hanhCung) >= 0 ? ' là hành Kỵ thần Bát Tự → cần tiết chế.' : ' trung tính với Dụng thần.'));
      if (bz.length) secs.push({ tieuDe: 'Đối chiếu Bát Tự', items: bz });
    }
    var ket = ['Đánh giá đại vận: ' + lgXepHang_(d) + ' (' + diem10_(d) + '/10).'];
    if (C.tuan || C.triet) ket.push('Cung hạn gặp ' + (C.triet ? 'Triệt' : 'Tuần') + ': nửa đầu hạn trắc trở, nửa sau mới hanh thông.');
    ket.push(d >= 2.5 ? 'Nên chủ động mở rộng, nắm bắt cơ hội; đây là giai đoạn "được thời".' :
      d >= 0 ? 'Giữ nhịp ổn định, tích lũy; tận dụng các lĩnh vực có Hóa Lộc/Quyền/Khoa.' :
        'Nên phòng thủ, tránh mạo hiểm lớn, chú trọng sức khỏe và quan hệ; tu dưỡng để hóa giải.');
    secs.push({ tieuDe: 'Kết luận', items: ket });
    list.push({
      ten: 'Đại vận ' + from + '–' + to, khoang: from + '–' + to + ' tuổi', nam: (I.lunar.year + from - 1) + '–' + (I.lunar.year + to - 1),
      cung: C.cung, chi: C.chiTen, canChi: C.canTen + ' ' + C.chiTen, diem: d, danhGia: lgXepHang_(d),
      isNow: !!C.isDaiHan, sao: C.chinh.map(function (s) { return s.n; }).join(', ') || 'VCD', secs: secs
    });
  });
  return list;
}

/* ============================================================
 *  4. LƯU TINH THEO NĂM & TIỂU VẬN
 * ============================================================ */
function lgLuuTinh_(chart, year) {
  var vCan = mod10(year + 6), vChi = mod12(year + 8);
  var ex = {};
  function add(p, n) { p = mod12(p); (ex[p] = ex[p] || []).push(n); }
  add(vChi, 'L.Thái Tuế'); add(vChi + 2, 'L.Tang Môn'); add(vChi + 8, 'L.Bạch Hổ');
  add(6 - vChi, 'L.Thiên Khốc'); add(6 + vChi, 'L.Thiên Hư');
  add(3 - vChi, 'L.Hồng Loan'); add(9 - vChi, 'L.Thiên Hỷ');
  var lt = LOC_TON_POS[vCan];
  add(lt, 'L.Lộc Tồn'); add(lt + 1, 'L.Kình Dương'); add(lt - 1, 'L.Đà La');
  add([2, 11, 8, 5][vChi % 4], 'L.Thiên Mã');
  for (var i = 0; i < 4; i++) add(chart.pos[chart.tuHoa[vCan][i]], 'L.' + HOA_TEN[i]);
  // Lưu Xương – Khúc, Khôi – Việt theo can năm; lưu Đào Hoa theo chi năm (đối chiếu iztro: 流昌/流曲/流魁/流钺)
  add(LG_LUU_XUONG[vCan], 'L.Văn Xương'); add(LG_LUU_KHUC[vCan], 'L.Văn Khúc');
  add(KHOI_POS[vCan], 'L.Thiên Khôi'); add(VIET_POS[vCan], 'L.Thiên Việt');
  add([9, 6, 3, 0][vChi % 4], 'L.Đào Hoa');
  return { can: vCan, chi: vChi, ex: ex };
}
var LG_LUU_XUONG = [5, 6, 8, 9, 8, 9, 11, 0, 2, 3];
var LG_LUU_KHUC = [9, 8, 6, 5, 6, 5, 3, 2, 0, 11];

/** Lưu niên đại hạn (phái Thái Thứ Lang): năm 1 tại cung đại hạn, năm 2 sang cung xung chiếu,
 *  năm 3 Dương Nam/Âm Nữ lùi 1 cung (Âm Nam/Dương Nữ tiến 1 cung), năm 4 trở về cung xung chiếu,
 *  từ năm 5 đi tiếp theo chiều ngược lại mỗi năm một cung. */
function lgLuuDaiHan_(chart, tuoi) {
  var dh = lgDaiHanCung_(chart, tuoi);
  if (dh < 0) return -1;
  var k = tuoi - chart.palaces[dh].daiHan;
  var X = mod12(dh + 6), dir = chart.info.thuan ? 1 : -1;
  if (k === 0) return dh;
  if (k === 1) return X;
  if (k === 2) return mod12(X - dir);
  return mod12(X + dir * (k - 3));
}

var LG_LUU_DIEM = {
  'L.Hóa Lộc': 2, 'L.Hóa Quyền': 1.5, 'L.Hóa Khoa': 1.5, 'L.Hóa Kỵ': -2.5, 'L.Lộc Tồn': 1.5, 'L.Thiên Mã': 0.6,
  'L.Kình Dương': -1.5, 'L.Đà La': -1.2, 'L.Tang Môn': -1, 'L.Bạch Hổ': -1, 'L.Thiên Khốc': -0.6, 'L.Thiên Hư': -0.6,
  'L.Hồng Loan': 0.6, 'L.Thiên Hỷ': 0.6, 'L.Thái Tuế': -0.3,
  'L.Văn Xương': 0.5, 'L.Văn Khúc': 0.5, 'L.Thiên Khôi': 0.7, 'L.Thiên Việt': 0.7, 'L.Đào Hoa': 0.2
};
function lgDiemVung_(chart, pi, ex) {
  var P = chart.palaces, t = lgTPTC_(pi), w = [0.5, 0.125, 0.125, 0.25];
  var s = 0;
  t.forEach(function (p, i) {
    s += P[p].diem * w[i];
    (ex[p] || []).forEach(function (n) { s += (LG_LUU_DIEM[n] || 0) * (i === 0 ? 1 : i === 3 ? 0.6 : 0.4); });
  });
  return lgR_(s * 1.4);
}

function lgTieuHanCung_(chart, year) {
  var ch = mod12(year + 8);
  for (var i = 0; i < 12; i++) if (chart.palaces[i].tieuHanChi === ch) return i;
  return -1;
}
function lgDaiHanCung_(chart, tuoi) {
  for (var i = 0; i < 12; i++) {
    var P = chart.palaces[i];
    if (tuoi >= P.daiHan && tuoi <= P.daiHan + 9) return i;
  }
  return -1;
}

/** Luận riêng các sao lưu niên: mỗi sao lưu rơi vào cung gốc nào (lĩnh vực nào của năm),
 *  và các cách lưu – gốc gặp nhau (song Lộc, Lộc Mã giao trì, song Kỵ, Kình Đà trùng phùng, Tang Hổ…).
 *  Trả về { items, adj } – adj là điểm cộng/trừ vào đánh giá năm. */
var LG_LUU_Y = {
  'L.Thái Tuế': ['◇', 'tâm điểm sự kiện của năm, mọi chuyện ở đây dễ "lên tiếng", va chạm lời nói'],
  'L.Lộc Tồn': ['✓', 'có lộc, tiền vào đều đặn, được giữ của'],
  'L.Hóa Lộc': ['✓', 'nguồn lợi mới mở ra, thuận lợi, hanh thông'],
  'L.Hóa Quyền': ['✓', 'tăng quyền hạn, chủ động, được giao trọng trách'],
  'L.Hóa Khoa': ['✓', 'danh tiếng, giấy tờ – thi cử thuận, có quý nhân giải nguy'],
  'L.Hóa Kỵ': ['✗', 'vướng mắc, thị phi, tiền – tình dễ bế tắc; lĩnh vực cần giữ kín và kiên nhẫn'],
  'L.Kình Dương': ['✗', 'cạnh tranh, va chạm, dễ tổn thương do vội vàng'],
  'L.Đà La': ['✗', 'trì trệ, dây dưa, việc đi chậm hơn dự tính'],
  'L.Thiên Mã': ['◇', 'di chuyển, thay đổi, đi xa hoặc đổi chỗ'],
  'L.Tang Môn': ['✗', 'buồn phiền, tin không vui, chuyện hiếu sự trong họ'],
  'L.Bạch Hổ': ['✗', 'tai nạn nhỏ, kiện tụng, va chạm – cẩn thận máu huyết'],
  'L.Thiên Khốc': ['✗', 'nước mắt, lo âu'],
  'L.Thiên Hư': ['✗', 'hao hụt, hư hao, hứa suông'],
  'L.Hồng Loan': ['✓', 'tình duyên, hỷ sự, được yêu mến'],
  'L.Thiên Hỷ': ['✓', 'tin vui, cưới hỏi, sinh nở'],
  'L.Đào Hoa': ['◇', 'duyên dáng, được chú ý – dễ có mối tình mới'],
  'L.Văn Xương': ['✓', 'học hành, văn bản, thi cử thuận'],
  'L.Văn Khúc': ['✓', 'ăn nói, nghệ thuật, giao tiếp thuận'],
  'L.Thiên Khôi': ['✓', 'quý nhân (nam, bề trên) nâng đỡ'],
  'L.Thiên Việt': ['✓', 'quý nhân (nữ, người ngoài) giúp đỡ']
};
function lgLuanLuuTinh_(chart, L, th, ldh, year) {
  var P = chart.palaces, pos = chart.pos, menh = chart.info.menh, items = [], adj = 0;
  var tp = lgTPTC_(th);
  function o(n) { for (var k in L.ex) if (L.ex[k].indexOf(n) >= 0) return +k; return -1; }
  function ten(p) { return P[p].cung + ' (' + P[p].chiTen + ')'; }
  function vung(p) { return p === th ? 'ngay cung tiểu hạn' : tp.indexOf(p) >= 0 ? 'chiếu vào tiểu hạn' : p === ldh ? 'tại cung lưu niên đại hạn' : p === menh ? 'tại cung Mệnh gốc' : ''; }
  // 1. Từng sao lưu quan trọng: rơi vào cung nào → lĩnh vực nào
  ['L.Thái Tuế', 'L.Hóa Lộc', 'L.Lộc Tồn', 'L.Hóa Quyền', 'L.Hóa Khoa', 'L.Hóa Kỵ', 'L.Kình Dương', 'L.Đà La', 'L.Thiên Mã', 'L.Tang Môn', 'L.Bạch Hổ', 'L.Hồng Loan', 'L.Thiên Hỷ', 'L.Đào Hoa'].forEach(function (n) {
    var p = o(n); if (p < 0) return;
    var y = LG_LUU_Y[n], v = vung(p);
    items.push(y[0] + ' ' + n.replace('L.', 'Lưu ') + ' nhập ' + ten(p) + (v ? ', ' + v : '') + ' → ' + LG_LINH_VUC[P[p].cung] + ': ' + y[1] + '.');
  });
  // 2. Cách lưu – gốc
  var lLoc = o('L.Lộc Tồn'), lHL = o('L.Hóa Lộc'), lKy = o('L.Hóa Kỵ'), lMa = o('L.Thiên Mã'), lKinh = o('L.Kình Dương'), lDa = o('L.Đà La');
  var gLoc = [pos['Lộc Tồn'], pos['Hóa Lộc']], gKy = pos['Hóa Kỵ'];
  [lLoc, lHL].forEach(function (p, i) {
    if (p >= 0 && gLoc.indexOf(p) >= 0) { items.push('✓ Song Lộc: lưu ' + (i ? 'Hóa Lộc' : 'Lộc Tồn') + ' gặp Lộc gốc tại ' + ten(p) + ' – năm tài lộc nổi bật qua ' + LG_LINH_VUC[P[p].cung] + '.'); adj += 0.8; }
  });
  if (lLoc >= 0 && lLoc === lHL) { items.push('✓ Lưu Lộc Tồn và lưu Hóa Lộc cùng cung ' + ten(lLoc) + ' – "Lộc trùng", nguồn thu dồi dào.'); adj += 0.5; }
  if (lMa >= 0 && (lMa === lLoc || lMa === lHL || lMa === pos['Lộc Tồn'] || lMa === pos['Hóa Lộc'])) { items.push('✓ Lộc Mã giao trì tại ' + ten(lMa) + ': tiền đến nhờ di chuyển, kinh doanh xa, đổi môi trường.'); adj += 0.6; }
  if (lMa >= 0 && (lMa === lDa || P[lMa].triet)) { items.push('✗ Chiết túc mã: lưu Thiên Mã ' + (lMa === lDa ? 'gặp lưu Đà La' : 'gặp Triệt') + ' tại ' + ten(lMa) + ' – đi lại trắc trở, kế hoạch dời đổi dễ lỡ.'); adj -= 0.4; }
  if (lKy >= 0 && lKy === gKy) { items.push('✗ Song Kỵ: lưu Hóa Kỵ chồng lên Hóa Kỵ gốc tại ' + ten(lKy) + ' – ' + LG_LINH_VUC[P[lKy].cung] + ' là điểm nghẽn lớn nhất năm, tránh quyết định vội.'); adj -= 1; }
  else if (lKy >= 0 && mod12(lKy + 6) === gKy) { items.push('✗ Lưu Kỵ xung Kỵ gốc (' + ten(lKy) + ' ↔ ' + ten(gKy) + ') – chuyện cũ dễ tái phát.'); adj -= 0.5; }
  if (lKy >= 0 && (lKy === th || lKy === menh)) { items.push('✗ Lưu Hóa Kỵ ' + (lKy === th ? 'đóng ngay tiểu hạn' : 'nhập Mệnh') + ' – năm nhiều phiền muộn, nên giữ mình, ít hứa hẹn.'); adj -= 0.5; }
  if (lKy >= 0 && mod12(lKy + 6) === menh) items.push('✗ Lưu Hóa Kỵ xung chiếu Mệnh từ ' + ten(lKy) + ' – dễ bị hiểu lầm, thị phi từ bên ngoài.');
  [['L.Kình Dương', 'Kình Dương', lKinh], ['L.Đà La', 'Đà La', lDa]].forEach(function (x) {
    if (x[2] >= 0 && x[2] === pos[x[1]]) { items.push('✗ ' + x[1] + ' trùng phùng tại ' + ten(x[2]) + ' (lưu gặp gốc) – sát khí nhân đôi ở ' + LG_LINH_VUC[P[x[2]].cung] + '.'); adj -= 0.6; }
  });
  var lHo = o('L.Bạch Hổ'), lTang = o('L.Tang Môn');
  if (lHo >= 0 && (lHo === lKinh || lHo === pos['Kình Dương'])) { items.push('✗ Bạch Hổ gặp Kình Dương tại ' + ten(lHo) + ' – đề phòng tai nạn, phẫu thuật, va quệt xe cộ.'); adj -= 0.6; }
  if (lTang >= 0 && (lTang === (pos['TT.Tang Môn'] != null ? pos['TT.Tang Môn'] : pos['Tang Môn']) || lTang === (pos['TT.Bạch Hổ'] != null ? pos['TT.Bạch Hổ'] : pos['Bạch Hổ']))) { items.push('✗ Tang – Hổ trùng phùng tại ' + ten(lTang) + ' – năm dễ có tin buồn trong gia đình.'); adj -= 0.4; }
  var hy = ['L.Hồng Loan', 'L.Thiên Hỷ', 'L.Đào Hoa'].map(o).filter(function (p) { return p >= 0 && (tp.indexOf(p) >= 0 || p === menh || P[p].cung === 'Phu Thê'); });
  if (hy.length >= 2) { items.push('✓ Hồng – Hỷ – Đào lưu hội về hạn/Mệnh/Phu Thê – năm động tình duyên: hợp cưới hỏi, ra mắt, sinh con.'); adj += 0.4; }
  if (L.chi === mod12(menh + 6)) items.push('✗ Lưu Thái Tuế xung cung Mệnh gốc – năm "động": dễ thay đổi chỗ ở, công việc, tâm lý bất an.');
  if (L.chi === th) items.push('◇ Thái Tuế nhập hạn: lưu Thái Tuế đóng ngay cung tiểu hạn – năm của những quyết định phải tự đứng ra gánh vác.');
  if (ldh >= 0 && L.ex[ldh]) items.push('◇ Tại cung lưu niên đại hạn ' + ten(ldh) + ' có ' + L.ex[ldh].map(function (n) { return n.replace('L.', 'lưu '); }).join(', ') + ' – điểm rơi của vận 10 năm trong năm ' + year + '.');
  return { items: items.length ? items : ['Các sao lưu năm nay phân tán, không tạo cách đặc biệt.'], adj: lgR_(adj) };
}

function lgTieuVan_(chart, bt, year) {
  var P = chart.palaces, I = chart.info;
  var th = lgTieuHanCung_(chart, year);
  var L = lgLuuTinh_(chart, year);
  var tuoi = year - I.lunar.year + 1;
  var dh = lgDaiHanCung_(chart, tuoi);
  var C = P[th];
  var d = lgDiemVung_(chart, th, L.ex);
  if (dh >= 0) d = lgR_(d * 0.75 + P[dh].diem * 0.25);

  var secs = [];
  var coSo = [
    'Năm ' + year + ' (' + CAN[L.can] + ' ' + CHI[L.chi] + '), ' + tuoi + ' tuổi âm. Tiểu hạn khởi theo tam hợp tuổi ' + I.chiNam + ', ' + (I.male ? 'nam đi thuận' : 'nữ đi nghịch') + ' → năm nay đóng tại cung ' + C.cung + ' (' + C.chiTen + ').',
    'Lưu Thái Tuế tại ' + CHI[L.chi] + ' – cung gốc ' + P[L.chi].cung + ': lĩnh vực ' + LG_LINH_VUC[P[L.chi].cung] + ' là "tâm điểm" sự kiện của năm.',
    dh >= 0 ? 'Nằm trong đại hạn ' + P[dh].daiHan + '–' + (P[dh].daiHan + 9) + ' tại ' + P[dh].cung + ' (' + lgXepHang_(P[dh].diem).toLowerCase() + ') – đại hạn là nền, tiểu hạn là ngọn.' : 'Tuổi nằm ngoài các đại hạn.'
  ];
  var ldh = lgLuuDaiHan_(chart, tuoi);
  if (ldh >= 0) coSo.push('Lưu niên đại hạn năm nay tại cung ' + P[ldh].cung + ' (' + P[ldh].chiTen + '): ' + (P[ldh].chinh.length ? lgSaoMoTa_(P[ldh]) : 'vô chính diệu') +
    (L.ex[ldh] ? '; lưu tinh: ' + L.ex[ldh].join(', ') : '') + ' – là "điểm rơi" của đại hạn trong năm, cần xét song song với tiểu hạn.');
  var qh = lgQuanHeChi_(L.chi, I.yChi);
  if (qh.length) coSo.push('Chi năm ' + CHI[L.chi] + ' với chi tuổi ' + I.chiNam + ': ' + qh.join(', ') + ' – ' +
    (qh.indexOf('lục xung') >= 0 ? 'năm xung Thái Tuế, dễ biến động, thay đổi.' : qh.indexOf('trùng (đồng chi)') >= 0 ? 'năm tuổi, nên thận trọng.' :
      qh.indexOf('tam hợp') >= 0 || qh.indexOf('lục hợp') >= 0 ? 'năm hợp tuổi, thuận hòa.' : 'có va chạm nhỏ.'));
  secs.push({ tieuDe: 'Cơ sở tiểu vận', items: coSo });
  var LL = lgLuanLuuTinh_(chart, L, th, ldh, year);
  secs.push({ tieuDe: 'Luận sao lưu niên ' + year, items: LL.items });
  d = lgR_(d + LL.adj);

  var a = lgPhanTichCung_(chart, th, { cungTen: C.cung, laHan: true, extra: L.ex, linhVuc: 'năm ' + year + ' (qua ' + LG_LINH_VUC[C.cung] + ')' });
  secs = secs.concat(a.secs.slice(1, 3));
  var luu = [];
  lgTPTC_(th).forEach(function (p, i) {
    if (L.ex[p]) luu.push((i === 0 ? 'Tại cung tiểu hạn' : i === 3 ? 'Xung chiếu (' + P[p].cung + ')' : 'Tam hợp (' + P[p].cung + ')') + ': ' + L.ex[p].join(', ') + '.');
  });
  // trùng phùng
  var tp = [];
  if (lgTPTC_(th).indexOf(mod12(LOC_TON_POS[L.can] + 1)) >= 0 && lgTPTC_(th).indexOf(chart.pos['Kình Dương']) >= 0) tp.push('Lưu Kình gặp Kình gốc');
  if (lgTPTC_(th).indexOf(mod12(LOC_TON_POS[L.can] - 1)) >= 0 && lgTPTC_(th).indexOf(chart.pos['Đà La']) >= 0) tp.push('Lưu Đà gặp Đà gốc');
  if (lgTPTC_(th).indexOf(chart.pos[chart.tuHoa[L.can][3]]) >= 0 && lgTPTC_(th).indexOf(chart.pos['Hóa Kỵ']) >= 0) tp.push('Lưu Kỵ gặp Kỵ gốc (song Kỵ)');
  if (tp.length) luu.push('Trùng phùng: ' + tp.join('; ') + ' → sát khí tăng gấp đôi, cần đề phòng.');
  var lb = lgBoPhuTinh_(chart, th, L.ex).filter(function (b) { return true; }).map(function (b) { return (b.tot > 0 ? '✓ ' : b.tot < 0 ? '✗ ' : '◇ ') + b.ten + ' (' + b.where + '): ' + b.moTa + '.'; });
  secs.push({ tieuDe: 'Lưu tinh & trùng phùng', items: luu.concat(lb).length ? luu.concat(lb) : ['Không có lưu tinh đáng kể tại tam phương tiểu hạn.'] });

  var linh = [['Công danh', th - 8], ['Tài lộc', th - 4], ['Tình cảm', th - 2], ['Sức khỏe', th - 5]].map(function (x) {
    var p = mod12(x[1]), sc = lgDiemVung_(chart, p, L.ex);
    return x[0] + ' (cung ' + P[p].cung + ' gốc' + (L.ex[p] ? ', lưu: ' + L.ex[p].join(', ') : '') + '): ' + lgXepHang_(sc).toLowerCase() + '.';
  });
  secs.push({ tieuDe: 'Các lĩnh vực trong năm', items: linh });

  if (bt) {
    var bz = [];
    var dCan = bt.nhatChuCan;
    bz.push('Can năm ' + CAN[L.can] + ' là ' + thapThanTen_(dCan, L.can) + ' (' + THAP_THAN_Y_NGHIA[thapThanTen_(dCan, L.can)] + '); chi năm tàng ' + CAN[TANG_CAN[L.chi][0]] + ' là ' + thapThanTen_(dCan, TANG_CAN[L.chi][0]) + '.');
    var hanhNam = [CAN_HANH[L.can], CHI_HANH[L.chi]];
    bz.push('Ngũ hành năm ' + hanhNam.join('/') + ': ' + hanhNam.map(function (h) { return h + (bt.goiY.hy.indexOf(h) >= 0 ? ' (Hỷ)' : bt.goiY.ky.indexOf(h) >= 0 ? ' (Kỵ)' : ''); }).join(', ') + '.');
    var qhNgay = lgQuanHeChi_(L.chi, bt.pillars[2].chi);
    if (qhNgay.length) bz.push('Chi năm với chi ngày sinh (cung phu thê Bát Tự): ' + qhNgay.join(', ') + '.');
    var s = danhGiaVan_(CAN_HANH[L.can], CHI_HANH[L.chi], bt.goiY.hy, bt.goiY.ky);
    bz.push('Bát Tự đánh giá lưu niên: ' + s + '.');
    d = lgR_(d + ({ 'Đại cát': 1.5, 'Cát': 0.8, 'Bình': 0, 'Hơi kém': -0.6, 'Cẩn trọng': -1.2 })[s]);
    secs.push({ tieuDe: 'Đối chiếu Bát Tự', items: bz });
  }
  var ket = ['Đánh giá năm ' + year + ': ' + lgXepHang_(d) + ' (' + diem10_(d) + '/10).'];
  ket.push(d >= 2.5 ? 'Năm thuận lợi – nên triển khai kế hoạch lớn, mở rộng quan hệ.' : d >= 0 ? 'Năm bình ổn – làm chắc từng bước, tránh dàn trải.' : 'Năm cần phòng thủ – giữ sức khỏe, tránh tranh chấp, cẩn trọng tài chính.');
  secs.push({ tieuDe: 'Kết luận', items: ket });
  return { nam: year, canChi: CAN[L.can] + ' ' + CHI[L.chi], tuoi: tuoi, cung: C.cung, chi: C.chiTen, th: th, diem: d, danhGia: lgXepHang_(d), secs: secs, luu: L };
}

/* ============================================================
 *  5. NGUYỆT VẬN
 * ============================================================ */
function lgNguyetCung_(chart, year, thang) {
  var th = lgTieuHanCung_(chart, year);
  var gieng = mod12(th - (chart.info.thangAn - 1) + chart.info.hourChi);
  return mod12(gieng + thang - 1);
}

function lgNguyetVan_(chart, bt, year) {
  var P = chart.palaces, I = chart.info;
  var L = lgLuuTinh_(chart, year);
  var canDan = mod10((L.can % 5) * 2 + 2);
  var leap = getLeapMonthOfYear(year);
  var out = [];
  for (var m = 1; m <= 12; m++) {
    var pi = lgNguyetCung_(chart, year, m);
    var mc = mod10(canDan + m - 1), mz = mod12(m + 1);
    var start = lunarToSolar(1, m, year, 0);
    var d = lgDiemVung_(chart, pi, L.ex);
    var items = [];
    var C = P[pi];
    items.push('Nguyệt hạn tại cung gốc ' + C.cung + ' (' + C.chiTen + '): ' + (C.chinh.length ? lgSaoMoTa_(C) : 'vô chính diệu, mượn ' + (lgSaoMoTa_(P[mod12(pi + 6)]) || '—')) + '.');
    var catH = C.cat.filter(function (s) { return !s.hoaOf; }).slice(0, 5).map(function (s) { return s.n; });
    var hungH = C.hung.filter(function (s) { return !s.hoaOf; }).map(function (s) { return s.n; });
    if (catH.length || hungH.length) items.push('Phụ tinh: ' + (catH.length ? 'cát ' + catH.join(', ') : '') + (catH.length && hungH.length ? '; ' : '') + (hungH.length ? 'hung ' + hungH.join(', ') : '') + '.');
    if (L.ex[pi]) items.push('Lưu tinh năm tại cung tháng: ' + L.ex[pi].join(', ') + '.');
    var bp = lgBoPhuTinh_(chart, pi, L.ex).filter(function (b) { return b.where === 'đồng cung' || b.where === 'giáp cung'; });
    if (bp.length) items.push('Bộ sao: ' + bp.map(function (b) { return b.ten + ' – ' + b.moTa; }).join('; ') + '.');
    if (bt) {
      var tt = thapThanTen_(bt.nhatChuCan, mc);
      items.push('Can chi tháng ' + CAN[mc] + ' ' + CHI[mz] + ': can là ' + tt + ' (' + THAP_THAN_Y_NGHIA[tt] + ').');
      var qh = lgQuanHeChi_(mz, bt.pillars[2].chi), qh2 = lgQuanHeChi_(mz, I.yChi);
      if (qh.length) items.push('Chi tháng với chi ngày sinh: ' + qh.join(', ') + '.');
      if (qh2.indexOf('lục xung') >= 0) items.push('Tháng xung tuổi – tránh quyết định lớn vội vàng.');
      var s = danhGiaVan_(CAN_HANH[mc], CHI_HANH[mz], bt.goiY.hy, bt.goiY.ky);
      d = lgR_(d + ({ 'Đại cát': 1, 'Cát': 0.5, 'Bình': 0, 'Hơi kém': -0.4, 'Cẩn trọng': -0.8 })[s]);
      items.push('Ngũ hành tháng (' + CAN_HANH[mc] + '/' + CHI_HANH[mz] + ') theo Bát Tự: ' + s + '.');
    }
    items.push(d >= 2.5 ? 'Tháng tốt: nên khởi sự, gặp gỡ, đàm phán.' : d >= 0 ? 'Tháng bình: duy trì, hoàn thiện việc đang làm.' : 'Tháng cần cẩn trọng: giữ sức khỏe, hạn chế tranh chấp, kiểm tra kỹ giấy tờ.');
    out.push({
      thang: m, ten: 'Tháng ' + m + (leap === m ? ' (có tháng nhuận)' : ''), canChi: CAN[mc] + ' ' + CHI[mz],
      batDau: start ? start.day + '/' + start.month + '/' + start.year : '', cung: C.cung, chi: C.chiTen,
      diem: d, danhGia: lgXepHang_(d), secs: [{ tieuDe: 'Luận tháng', items: items }]
    });
  }
  return out;
}

/* ============================================================
 *  6. NHẬT VẬN
 * ============================================================ */
var LG_12_THAN = ['Thanh Long', 'Minh Đường', 'Thiên Hình', 'Chu Tước', 'Kim Quỹ', 'Bảo Quang', 'Bạch Hổ', 'Ngọc Đường', 'Thiên Lao', 'Huyền Vũ', 'Tư Mệnh', 'Câu Trận'];
var LG_HOANG_DAO = [0, 1, 4, 5, 7, 10];
var LG_TRUC = ['Kiến', 'Trừ', 'Mãn', 'Bình', 'Định', 'Chấp', 'Phá', 'Nguy', 'Thành', 'Thu', 'Khai', 'Bế'];
var LG_TRUC_Y = {
  'Kiến': ['xuất hành, khởi sự, nhậm chức', 'động thổ, đào đất'], 'Trừ': ['chữa bệnh, dọn dẹp, bỏ thói xấu', 'cưới hỏi, khai trương'],
  'Mãn': ['cầu tài, cúng tế, mua sắm', 'kiện tụng, nhậm chức'], 'Bình': ['sửa sang, việc thường ngày', 'việc lớn cần đột phá'],
  'Định': ['ký kết, cưới hỏi, nhập học', 'kiện tụng, xuất hành xa'], 'Chấp': ['xây dựng, thu nợ, tuyển người', 'xuất vốn, dọn nhà'],
  'Phá': ['phá dỡ, chữa bệnh', 'khai trương, cưới hỏi, ký kết'], 'Nguy': ['cúng lễ, việc nhỏ', 'leo cao, đi xa, đầu tư mạo hiểm'],
  'Thành': ['khai trương, cưới hỏi, nhập trạch, ký kết', 'kiện tụng'], 'Thu': ['thu hoạch, thu nợ, nhập kho', 'an táng, khởi công'],
  'Khai': ['khai trương, nhập học, xuất hành, cầu tài', 'an táng'], 'Bế': ['đắp đập, lấp hố, tĩnh dưỡng', 'khai trương, xuất hành, chữa mắt']
};
// Bảng tra lịch pháp (đối chiếu lunar-javascript của 6tail, MIT)
var LG_HY_THAN = ['Đông Bắc', 'Tây Bắc', 'Tây Nam', 'Chính Nam', 'Đông Nam', 'Đông Bắc', 'Tây Bắc', 'Tây Nam', 'Chính Nam', 'Đông Nam'];
var LG_TAI_THAN = ['Đông Bắc', 'Đông Bắc', 'Tây Nam', 'Tây Nam', 'Chính Bắc', 'Chính Bắc', 'Chính Đông', 'Chính Đông', 'Chính Nam', 'Chính Nam'];
var LG_PHUC_THAN = ['Chính Bắc', 'Tây Nam', 'Tây Bắc', 'Đông Nam', 'Đông Bắc', 'Chính Bắc', 'Tây Nam', 'Tây Bắc', 'Đông Nam', 'Đông Bắc'];
var LG_SAT_PHUONG = ['Nam', 'Đông', 'Bắc', 'Tây'];
var LG_BANH_TO_CAN = ['Giáp bất khai thương – không mở kho, tiền của hao tán', 'Ất bất tài thực – không trồng cây, nghìn gốc chẳng lên',
  'Bính bất tu táo – không sửa bếp, ắt gặp tai ương', 'Đinh bất thế đầu – không cắt tóc, đầu sinh mụn nhọt',
  'Mậu bất thụ điền – không nhận ruộng đất, chủ chẳng lành', 'Kỷ bất phá khoán – không hủy khế ước, hai bên cùng tổn',
  'Canh bất kinh lạc – không lên khung cửi, khung dệt bỏ không', 'Tân bất hợp tương – không làm tương, chủ chẳng được nếm',
  'Nhâm bất ương thủy – không tháo nước, khó bề đề phòng', 'Quý bất từ tụng – không kiện tụng, lý yếu địch mạnh'];
var LG_BANH_TO_CHI = ['Tý bất vấn bốc – không gieo quẻ, tự rước họa', 'Sửu bất quan đới – không nhận chức/đội mũ, chủ chẳng về quê',
  'Dần bất tế tự – không cúng tế, thần linh chẳng hưởng', 'Mão bất xuyên tỉnh – không đào giếng, nước chẳng trong',
  'Thìn bất khốc khấp – không khóc lóc, dễ có trùng tang', 'Tỵ bất viễn hành – không đi xa, tiền của hao mất',
  'Ngọ bất thiêm cái – không lợp nhà, chủ nhà phải đổi', 'Mùi bất phục dược – không uống thuốc, độc khí vào ruột',
  'Thân bất an sàng – không kê giường, ma quỷ vào phòng', 'Dậu bất hội khách – không đãi khách, say sưa nghiêng ngả',
  'Tuất bất ngật khuyển – không ăn thịt chó, quái lạ lên giường', 'Hợi bất giá thú – không cưới gả, bất lợi tân lang'];
// Nhị thập bát tú: chỉ số = JD mod 28 (0 = Nguy)
var LG_TU = [['Nguy', 0], ['Thất', 1], ['Bích', 1], ['Khuê', 0], ['Lâu', 1], ['Vị', 1], ['Mão', 0], ['Tất', 1], ['Chủy', 0], ['Sâm', 1],
  ['Tỉnh', 1], ['Quỷ', 0], ['Liễu', 0], ['Tinh', 0], ['Trương', 1], ['Dực', 0], ['Chẩn', 1], ['Giác', 1], ['Cang', 0], ['Đê', 0],
  ['Phòng', 1], ['Tâm', 0], ['Vĩ', 1], ['Cơ', 1], ['Đẩu', 1], ['Ngưu', 0], ['Nữ', 0], ['Hư', 0]];

function lgThanNgay_(chiThang, chiNgay) {
  var start = mod12(((chiThang - 2) % 6 + 6) % 6 * 2);
  return mod12(chiNgay - start);
}

function lgNhatVan_(chart, bt, dateStr, soNgay, hdTheoTiet) {
  var I = chart.info, P = chart.palaces;
  var m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(String(dateStr || ''));
  var jd0;
  if (m) jd0 = jdFromDate(parseInt(m[3], 10), parseInt(m[2], 10), parseInt(m[1], 10));
  else { var now = new Date(); jd0 = jdFromDate(now.getDate(), now.getMonth() + 1, now.getFullYear()); }
  var out = [];
  for (var k = 0; k < (soNgay || 7); k++) {
    var jd = jd0 + k;
    var dmy = jdToDate(jd);
    var lu = solarToLunar(dmy[0], dmy[1], dmy[2]);
    var dc = mod10(jd + 9), dz = mod12(jd + 1);
    var L = lgLuuTinh_(chart, lu.year);
    var mp = lgNguyetCung_(chart, lu.year, lu.month);
    var pi = mod12(mp + lu.day - 1);
    var C = P[pi];
    var L2 = sunLongitudeDeg(jd + 0.5 - 7 / 24 - 1e-4); // cuối ngày: ngày giao tiết đã thuộc tháng mới
    var chiThangTiet = mod12(Math.floor((((L2 - 315) % 360) + 360) % 360 / 30) + 2);
    var truc = LG_TRUC[mod12(dz - chiThangTiet)];
    var chiThangHD = hdTheoTiet ? chiThangTiet : mod12(lu.month + 1);
    var than = LG_12_THAN[lgThanNgay_(chiThangHD, dz)];
    var hoangDao = LG_HOANG_DAO.indexOf(lgThanNgay_(chiThangHD, dz)) >= 0;
    var tu = LG_TU[((jd % 28) + 28) % 28];
    var gioTot = [];
    for (var h = 0; h < 12; h++) if (LG_HOANG_DAO.indexOf(lgThanNgay_(dz, h)) >= 0) gioTot.push(CHI[h] + ' (' + GIO_CHI[h] + ')');

    var d = lgDiemVung_(chart, pi, L.ex) * 0.6 + (hoangDao ? 1 : -0.8) + (tu[1] ? 0.3 : -0.3);
    var items = [];
    items.push('Âm lịch ' + lu.day + '/' + lu.month + (lu.leap ? ' nhuận' : '') + '/' + lu.year + ' – ngày ' + CAN[dc] + ' ' + CHI[dz] + ', ' + (hoangDao ? 'Hoàng đạo' : 'Hắc đạo') + ' (' + than + '), trực ' + truc + '.');
    items.push('Nhật hạn tại cung gốc ' + C.cung + ' (' + C.chiTen + '): ' + (C.chinh.length ? lgSaoMoTa_(C) : 'vô chính diệu') + (L.ex[pi] ? '; lưu tinh: ' + L.ex[pi].join(', ') : '') + ' → sự việc trong ngày xoay quanh "' + LG_LINH_VUC[C.cung] + '".');
    var bp = lgBoPhuTinh_(chart, pi, L.ex).filter(function (b) { return b.where === 'đồng cung'; });
    if (bp.length) items.push('Bộ sao cung ngày: ' + bp.map(function (b) { return b.ten + ' – ' + b.moTa; }).join('; ') + '.');
    if (bt) {
      var tt = thapThanTen_(bt.nhatChuCan, dc);
      items.push('Can ngày ' + CAN[dc] + ' là ' + tt + ' với Nhật chủ ' + bt.nhatChu + ' – ' + THAP_THAN_Y_NGHIA[tt] + '.');
      var s = danhGiaVan_(CAN_HANH[dc], CHI_HANH[dz], bt.goiY.hy, bt.goiY.ky);
      d += ({ 'Đại cát': 1, 'Cát': 0.5, 'Bình': 0, 'Hơi kém': -0.4, 'Cẩn trọng': -0.8 })[s];
      var q1 = lgQuanHeChi_(dz, I.yChi), q2 = lgQuanHeChi_(dz, bt.pillars[2].chi);
      if (q1.indexOf('lục xung') >= 0) { items.push('Ngày xung tuổi (' + CHI[dz] + ' xung ' + I.chiNam + ') – kỵ việc lớn.'); d -= 1; }
      else if (q1.indexOf('tam hợp') >= 0 || q1.indexOf('lục hợp') >= 0) { items.push('Ngày hợp tuổi (' + q1.join(', ') + ').'); d += 0.5; }
      if (q2.indexOf('lục xung') >= 0) items.push('Chi ngày xung chi ngày sinh – dễ bất đồng trong gia đình.');
    }
    var ty = LG_TRUC_Y[truc];
    items.push('Trực ' + truc + ' – nên: ' + ty[0] + '; tránh: ' + ty[1] + '.');
    items.push('Sao ' + tu[0] + ' (Nhị thập bát tú) – ' + (tu[1] ? 'cát tú, thuận cho việc lớn.' : 'hung tú, việc lớn nên cân nhắc.'));
    items.push('Xung tuổi ' + CHI[mod12(dz + 6)] + ' (' + CON_GIAP[mod12(dz + 6)] + '); sát phương ' + LG_SAT_PHUONG[dz % 4] + ' – tránh động thổ, xuất hành về hướng này.');
    items.push('Hướng tốt xuất hành: Hỷ thần ' + LG_HY_THAN[dc] + ', Tài thần ' + LG_TAI_THAN[dc] + ', Phúc thần ' + LG_PHUC_THAN[dc] + '.');
    items.push('Bành Tổ bách kỵ: ' + LG_BANH_TO_CAN[dc] + '; ' + LG_BANH_TO_CHI[dz] + '.');
    items.push('Giờ Hoàng đạo: ' + gioTot.join(', ') + '.');
    d = lgR_(d);
    out.push({
      ngay: dmy[0] + '/' + dmy[1] + '/' + dmy[2], thu: ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'][(jd + 1) % 7],
      am: lu.day + '/' + lu.month + (lu.leap ? 'N' : ''), canChi: CAN[dc] + ' ' + CHI[dz], hoangDao: hoangDao, than: than, truc: truc, tu: tu[0],
      cung: C.cung, diem: d, danhGia: lgXepHang_(d), secs: [{ tieuDe: 'Luận ngày', items: items }]
    });
  }
  return out;
}

/* ============================================================
 *  HÀM TỔNG
 * ============================================================ */
function luanChiTiet(chart, bt, input) {
  var I = chart.info;
  var vy = I.viewYear;
  var tieu = lgTieuVan_(chart, bt, vy);
    chart._bt = bt; // đính Bát Tự vào chart để các hàm sinh văn Tử Tức truy cập
  var nhieuNam = [];
  for (var y = vy - 1; y <= vy + 9; y++) {
    var t = lgTieuVan_(chart, bt, y);
    nhieuNam.push({ nam: y, canChi: t.canChi, tuoi: t.tuoi, cung: t.cung, diem: t.diem, danhGia: t.danhGia });
  }
  return {
    coSo: CO_SO_LY_LUAN,
    cung: lgLuan12Cung_(chart),
    daiVan: lgDaiVan_(chart, bt),
    tieuVan: tieu,
    tieuVanNhieuNam: nhieuNam,
    nguyetVan: lgNguyetVan_(chart, bt, vy),
    nhatVan: lgNhatVan_(chart, bt, input && input.viewDate, 7, input && input.hoangDao === 'tiet')
  };
}

/* =========================================================
 *  Sinh "facts dễ hiểu" cho mỗi cung — dùng để render văn
 *  Trả về { anhHuong: [câu...], dacBiet: [câu...] }
 * ========================================================= */
function sinhFactsDeHieu_(chart, pi) {
  var P = chart.palaces, pos = chart.pos;
  var C = P[pi];
  var xc = mod12(pi + 6), th1 = mod12(pi + 4), th2 = mod12(pi + 8), nh = mod12(1 - pi);
  var anhHuong = [], dacBiet = [];

  function d10c(p) { return P[p].diem10 != null ? P[p].diem10 : chuanHoa10_(P[p].diem); }
  function lv(cung) { return (LG_LINH_VUC && LG_LINH_VUC[cung]) || cung; }
  function saoChinhText(p) {
    var s = P[p].chinh.map(function(x){ return x.n; }).join(', ');
    return s || 'không có sao chính';
  }

  /* ========== 1. XUNG CHIẾU ========== */
  var dxc = d10c(xc);
  var saoXc = saoChinhText(xc);
  if (dxc >= 7) {
    anhHuong.push('Cung đối diện — nói về ' + lv(P[xc].cung) + ' — rất mạnh mẽ (có ' + saoXc + '). Đây là nguồn lực lớn mà bạn có thể dựa vào khi cần.');
  } else if (dxc >= 5.5) {
    anhHuong.push('Cung đối diện — nói về ' + lv(P[xc].cung) + ' — khá tốt (có ' + saoXc + '). Bạn nhận được sự hỗ trợ vừa phải từ phía này.');
  } else if (dxc >= 4) {
    anhHuong.push('Cung đối diện — nói về ' + lv(P[xc].cung) + ' — ở mức bình thường. Không giúp cũng không cản trở bạn.');
  } else {
    anhHuong.push('Cung đối diện — nói về ' + lv(P[xc].cung) + ' — khá yếu. Đây là điểm bạn cần tự lực nhiều hơn, không nên ỷ lại.');
  }

  /* ========== 2. TAM HỢP ========== */
  var dt1 = d10c(th1), dt2 = d10c(th2), dtb = (dt1 + dt2) / 2;
  if (dtb >= 6.5) {
    anhHuong.push('Hai cung tam hợp — nói về ' + lv(P[th1].cung) + ' và ' + lv(P[th2].cung) + ' — đều tốt. Bạn có hai nguồn nâng đỡ đáng kể trong cuộc sống.');
  } else if (dtb >= 5) {
    anhHuong.push('Hai cung tam hợp khá ổn — mang lại cho bạn sự nâng đỡ vừa phải.');
  } else if (dtb >= 3.5) {
    anhHuong.push('Hai cung tam hợp ở mức trung bình — bạn không được nâng đỡ nhiều từ hai phía này.');
  } else {
    anhHuong.push('Hai cung tam hợp khá yếu — bạn cần tự lực nhiều hơn, đừng trông chờ vào bên ngoài.');
  }

  /* ========== 3. NHỊ HỢP ========== */
  var dnh = d10c(nh);
  if (dnh >= 6.5) {
    anhHuong.push('Cung nhị hợp — nói về ' + lv(P[nh].cung) + ' — khá tốt. Đây là một nguồn trợ lực âm thầm nhưng bền bỉ mà bạn chưa chắc đã nhận ra.');
  } else if (dnh >= 4) {
    anhHuong.push('Cung nhị hợp ở mức bình thường — không có gì đặc biệt đáng lo.');
  } else {
    anhHuong.push('Cung nhị hợp khá yếu — có thể có một yếu tố âm thầm đang kéo lùi bạn ở lĩnh vực này, cần quan sát.');
  }

  /* ========== 4. GIÁP CUNG ========== */
  var gl = mod12(pi - 1), gr = mod12(pi + 1);
  var saoL = [].concat(P[gl].chinh, P[gl].cat, P[gl].hung).map(function(s){ return s.n; });
  var saoR = [].concat(P[gr].chinh, P[gr].cat, P[gr].hung).map(function(s){ return s.n; });
  var catSao = ['Tả Phù','Hữu Bật','Văn Xương','Văn Khúc','Thiên Khôi','Thiên Việt','Hóa Lộc','Hóa Quyền','Hóa Khoa','Lộc Tồn'];
  var hungSao = ['Kình Dương','Đà La','Hỏa Tinh','Linh Tinh','Địa Không','Địa Kiếp','Hóa Kỵ'];
  var catL = catSao.filter(function(s){ return saoL.indexOf(s) >= 0; });
  var catR = catSao.filter(function(s){ return saoR.indexOf(s) >= 0; });
  var hungL = hungSao.filter(function(s){ return saoL.indexOf(s) >= 0; });
  var hungR = hungSao.filter(function(s){ return saoR.indexOf(s) >= 0; });
  if (catL.length && catR.length) {
    anhHuong.push('Đặc biệt, cung này được hai cung bên cạnh "kẹp" bằng cát tinh — đây là dấu hiệu được nâng đỡ từ hai phía, có quý nhân bảo vệ.');
  } else if (hungL.length && hungR.length) {
    anhHuong.push('Cung này bị hai cung bên cạnh "kẹp" bằng sát tinh — dấu hiệu bị kìm hãm, khó phát huy. Cần kiên nhẫn và cẩn trọng.');
  } else if (catL.length || catR.length) {
    anhHuong.push('Có một bên được cát tinh nâng đỡ — bạn nhận được trợ lực từ một phía, không đầy đủ nhưng vẫn đáng quý.');
  } else if (hungL.length || hungR.length) {
    anhHuong.push('Có một bên có sát tinh — có thể có người hoặc hoàn cảnh âm thầm gây khó cho bạn.');
  }
  var tuanL = P[gl].tuan || P[gl].triet, tuanR = P[gr].tuan || P[gr].triet;
  if (tuanL && tuanR) {
    anhHuong.push('Đặc biệt: cả hai cung bên cạnh đều bị Tuần/Triệt chặn — bạn bị "bọc kín" hai bên, ít được nhưng cũng ít mất.');
  } else if (tuanL || tuanR) {
    anhHuong.push('Một bên bị Tuần/Triệt chặn — ảnh hưởng từ hai phía không đồng đều, bạn cần tự quan sát để cân bằng.');
  }

  /* ========== YẾU TỐ ĐẶC BIỆT ========== */
  /* 5. Tứ Hóa nhập cung */
  var dsSao = [].concat(C.chinh, C.cat, C.hung, C.tieu);
  var hoaDa = {};
  dsSao.forEach(function(s) {
    if (!s.hoa || hoaDa[s.hoa]) return;
    hoaDa[s.hoa] = true;
    var moTa = {
      'Lộc':   'Có Hóa Lộc — tài lộc và may mắn đến với lĩnh vực này. Bạn được hưởng lợi tự nhiên.',
      'Quyền': 'Có Hóa Quyền — bạn có quyền, có uy trong lĩnh vực này. Người khác nể trọng và nghe theo.',
      'Khoa':  'Có Hóa Khoa — danh tiếng và học vấn tỏa sáng. Khi gặp khó sẽ có người giúp giải.',
      'Kỵ':    'Có Hóa Kỵ — đây là điểm cần đặc biệt lưu ý. Dễ gặp trở ngại, hiểu lầm, hoặc hao tổn ở lĩnh vực này.'
    }[s.hoa];
    if (moTa) dacBiet.push(moTa);
  });

  /* 6. Vòng Tràng Sinh */
  if (C.trangSinh && LG_TRANG_SINH_Y[C.trangSinh]) {
    dacBiet.push('Vòng Tràng Sinh đóng tại đây ở vị trí "' + C.trangSinh + '" — ' + LG_TRANG_SINH_Y[C.trangSinh] + '.');
  }

  /* 7. Vòng Bác Sĩ */
  if (C.bacSi) {
    var totBS = ['Bác Sĩ','Lực Sĩ','Thanh Long','Tướng Quân','Tấu Thư','Hỷ Thần'].indexOf(C.bacSi) >= 0;
    var xauBS = ['Bệnh Phù','Đại Hao','Phục Binh','Quan Phủ','Tiểu Hao','Phi Liêm'].indexOf(C.bacSi) >= 0;
    if (totBS) dacBiet.push('Vòng Bác Sĩ đóng ở "' + C.bacSi + '" — điểm sáng tích cực, thêm thuận lợi cho lĩnh vực này.');
    else if (xauBS) dacBiet.push('Vòng Bác Sĩ đóng ở "' + C.bacSi + '" — dấu hiệu cần thận trọng hơn mức bình thường.');
  }

  /* 8. Vòng Thái Tuế */
  if (C.thaiTue) {
    var totTT = ['Thái Tuế','Thiếu Dương','Thiếu Âm','Long Đức','Phúc Đức'].indexOf(C.thaiTue) >= 0;
    var xauTT = ['Tang Môn','Quan Phù','Tử Phù','Tuế Phá','Bạch Hổ','Điếu Khách','Trực Phù'].indexOf(C.thaiTue) >= 0;
    if (totTT) dacBiet.push('Vòng Thái Tuế đóng ở "' + C.thaiTue + '" — mang lại điều tích cực cho lĩnh vực này.');
    else if (xauTT) dacBiet.push('Vòng Thái Tuế đóng ở "' + C.thaiTue + '" — dấu hiệu cần đề phòng ở một số khía cạnh.');
  }

  return { anhHuong: anhHuong, dacBiet: dacBiet };
}