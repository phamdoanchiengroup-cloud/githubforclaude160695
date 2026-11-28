/**
 * TuViPhiTinh.gs – Tử Vi theo Tứ Hóa Phi Tinh (Bắc phái / Khâm Thiên môn) – tab riêng "Phi Tinh" (31/10/2026).
 * Can 12 cung theo Ngũ Hổ Độn (sẵn trong lá số), mỗi cung phi Lộc – Quyền – Khoa – Kỵ theo bảng Tứ Hóa của trường Phi Tinh
 * (khác phái Việt ở can Nhâm: Khoa là Tả Phù). Luận: Tứ Hóa năm sinh, Lai Nhân cung, tự hóa ly tâm / hướng tâm, phi hóa 12 cung
 * kèm tên chuyển cung, chuỗi Kỵ chuyển Kỵ, các mẫu Kỵ có tên, đại vận và lưu niên đọc chồng lên nguyên cục.
 * Quy tắc do chuyên gia nghiên cứu tra từ Lương Nhược Du, Trương Thế Hiền, Hứa Thuyên Nhân, các trang Phi Tinh Việt – Trung – Đài
 * (mỗi kỹ thuật ≥2 nguồn); đã đối chiếu can cung, Lai Nhân, 48 phi hóa, đại vận, lưu niên với một bài luận Bắc phái mẫu: khớp toàn bộ.
 * Văn hai tầng do chuyên gia content-creator viết. "Tuyệt mệnh Kỵ" không hiển thị (quy tắc không đoán chết, bệnh).
 */
var PT_TU_HOA = [
 [
  "Liêm Trinh",
  "Phá Quân",
  "Vũ Khúc",
  "Thái Dương"
 ],
 [
  "Thiên Cơ",
  "Thiên Lương",
  "Tử Vi",
  "Thái Âm"
 ],
 [
  "Thiên Đồng",
  "Thiên Cơ",
  "Văn Xương",
  "Liêm Trinh"
 ],
 [
  "Thái Âm",
  "Thiên Đồng",
  "Thiên Cơ",
  "Cự Môn"
 ],
 [
  "Tham Lang",
  "Thái Âm",
  "Hữu Bật",
  "Thiên Cơ"
 ],
 [
  "Vũ Khúc",
  "Tham Lang",
  "Thiên Lương",
  "Văn Khúc"
 ],
 [
  "Thái Dương",
  "Vũ Khúc",
  "Thái Âm",
  "Thiên Đồng"
 ],
 [
  "Cự Môn",
  "Thái Dương",
  "Văn Khúc",
  "Văn Xương"
 ],
 [
  "Thiên Lương",
  "Tử Vi",
  "Tả Phù",
  "Vũ Khúc"
 ],
 [
  "Phá Quân",
  "Cự Môn",
  "Thái Âm",
  "Tham Lang"
 ]
];

/** Luận riêng cho từng phi hóa đơn "cung X phi Lộc/Kỵ nhập cung Y" (khóa "Lộc|Tài Bạch") */
var PT_LUAN = {
 "Mệnh": {
  "Kỵ|Tài Bạch": {
   "luan": "Coi trọng tiền bạc, chịu khó kiếm tiền, tính toán chi tiêu kỹ.",
   "de": "Bạn có xu hướng đặt nặng chuyện tiền và chịu khó kiếm tiền. Gợi ý: đặt mục tiêu tài chính rõ ràng để bớt lo lắng thường trực."
  },
  "Kỵ|Quan Lộc": {
   "luan": "Tận tụy với công việc, dồn sức cho sự nghiệp, dễ lơ là tình cảm (cohoc gọi Thuận thủy Kỵ Mệnh → Quan).",
   "de": "Bạn thuộc mẫu người làm việc hết mình. Gợi ý: dành lịch cố định cho gia đình và người thân để giữ cân bằng."
  },
  "Kỵ|Phu Thê": {
   "luan": "Gắn bó, chung thủy với người phối ngẫu; có xu hướng lập gia đình trước rồi mới lập nghiệp.",
   "de": "Bạn có xu hướng dành nhiều tâm sức cho người bạn đời. Gợi ý: cho nhau khoảng riêng để tình cảm không thành áp lực."
  },
  "Kỵ|Thiên Di": {
   "luan": "Ít để ý hình ảnh bên ngoài, nói thẳng, ra ngoài dễ gặp trở ngại nhỏ.",
   "de": "Bạn có xu hướng sống thật, nói thẳng, không chăm chút hình ảnh. Gợi ý: luyện cách nói mềm hơn khi giao tiếp với người lạ."
  },
  "Kỵ|Điền Trạch": {
   "luan": "Lấy gia đình làm trọng, thấy có trách nhiệm với nhà cửa.",
   "de": "Bạn thuộc mẫu người đặt gia đình lên trước. Gợi ý: chia sẻ việc nhà cho các thành viên khác cùng gánh."
  },
  "Lộc|Phu Thê": {
   "luan": "Tình duyên đằm thắm, đa tình với người khác giới; sau khi lập gia đình công việc dễ thuận.",
   "de": "Bạn có xu hướng tình cảm, chu đáo với người mình thương. Gợi ý: giữ ranh giới rõ trong các mối quan hệ khác giới."
  },
  "Lộc|Tài Bạch": {
   "luan": "Có duyên với tiền mặt, kiếm tiền tương đối nhẹ nhàng; hợp nghề thu tiền mặt hoặc chia lợi nhuận.",
   "de": "Bạn có duyên với tiền bạc. Gợi ý: tập thói quen để dành để cái duyên ấy thành tài sản lâu dài."
  }
 },
 "Huynh Đệ": {
  "Kỵ|Mệnh": {
   "luan": "Việc anh chị em thường đè lên vai mình, phải lo cho họ.",
   "de": "Bạn có xu hướng gánh vác chuyện anh chị em. Gợi ý: giúp vừa sức và để mỗi người tự chịu trách nhiệm phần mình."
  },
  "Kỵ|Tài Bạch": {
   "luan": "Huynh đệ là 'kho nhỏ' (Điền của Tài): Kỵ vào Tài dễ chi nhiều thu ít, khó tích lũy.",
   "de": "Bạn có xu hướng tiền ra nhanh hơn tiền vào. Gợi ý: lập quỹ tiết kiệm tự động ngay khi có thu nhập."
  },
  "Kỵ|Nô Bộc": {
   "luan": "Cho vay khó đòi, tình người mỏng.",
   "de": "Bạn có xu hướng nể nang khi người khác hỏi mượn. Gợi ý: chỉ cho mượn số tiền bạn sẵn sàng không lấy lại."
  },
  "Kỵ|Quan Lộc": {
   "luan": "Không hợp làm ăn chung với anh em; nên giữ bổn phận, làm công hoặc kinh doanh nhỏ ổn định.",
   "de": "Bạn hợp với con đường ổn định hơn là góp vốn với người nhà. Gợi ý: nếu hợp tác, làm giấy tờ rõ ràng."
  }
 },
 "Phu Thê": {
  "Kỵ|Mệnh": {
   "luan": "Chuyện hôn nhân hay làm mình bận lòng; với bản thân người phối ngẫu là người cố chấp.",
   "de": "Bạn có xu hướng để chuyện vợ chồng ảnh hưởng nhiều tới tâm trạng. Gợi ý: hẹn giờ trò chuyện định kỳ để gỡ vướng mắc sớm."
  },
  "Kỵ|Quan Lộc": {
   "luan": "Người phối ngẫu can thiệp công việc; không hợp làm chung với nhau.",
   "de": "Bạn và người bạn đời hợp với việc mỗi người một mảng công việc riêng. Gợi ý: tách bạch chuyện nhà và chuyện làm."
  },
  "Kỵ|Tài Bạch": {
   "luan": "Vì tiền mà lao tâm trong hôn nhân.",
   "de": "Bạn có xu hướng để chuyện tiền ảnh hưởng tới tình cảm vợ chồng. Gợi ý: thống nhất cách quản lý tiền chung ngay từ đầu."
  },
  "Kỵ|Thiên Di": {
   "luan": "Bề ngoài hòa hợp nhưng trong lòng xa cách; ít lãng mạn.",
   "de": "Bạn có xu hướng ít bày tỏ tình cảm. Gợi ý: những cử chỉ nhỏ hằng ngày giúp hai người gần nhau hơn."
  }
 },
 "Tử Tức": {
  "Kỵ|Mệnh": {
   "luan": "Lo nghĩ nhiều cho con cái, như 'mắc nợ con'.",
   "de": "Bạn có xu hướng đặt con cái vào trung tâm lo toan. Gợi ý: tin tưởng và giao cho con tự lập từng phần."
  },
  "Kỵ|Quan Lộc": {
   "luan": "Sau khi có con, việc phát triển sự nghiệp chậm lại.",
   "de": "Bạn có thể phải cân bằng giữa con nhỏ và công việc. Gợi ý: lên kế hoạch hỗ trợ (người thân, dịch vụ) trước khi có con."
  },
  "Kỵ|Điền Trạch": {
   "luan": "Chi tiêu gia đình eo hẹp; con cái dễ tranh chấp tài sản.",
   "de": "Bạn nên chuẩn bị sớm cho chuyện tài sản gia đình. Gợi ý: phân chia rõ ràng, minh bạch giữa các con."
  },
  "Kỵ|Nô Bộc": {
   "luan": "Hợp tác dễ có người tư lợi; bạn bè thưa dần.",
   "de": "Bạn nên cẩn trọng khi góp vốn làm ăn. Gợi ý: kiểm tra sổ sách định kỳ."
  }
 },
 "Tài Bạch": {
  "Kỵ|Mệnh": {
   "luan": "Kiếm tiền bằng sức mình, vất vả; lãi mỏng, hợp đi làm hưởng lương ổn định (cohoc gọi Thuận thủy Kỵ Tài → Mệnh).",
   "de": "Bạn có xu hướng kiếm tiền bằng chính công sức. Gợi ý: đầu tư vào kỹ năng để giá trị sức lao động tăng dần."
  },
  "Kỵ|Nô Bộc": {
   "luan": "Tiền dễ chảy sang bạn bè, chi nhiều cho giao tế.",
   "de": "Bạn có xu hướng rộng rãi với bạn bè. Gợi ý: đặt hạn mức chi cho giao tế mỗi tháng."
  },
  "Kỵ|Phúc Đức": {
   "luan": "Tiêu cho sở thích, hưởng thụ; tiền khó giữ.",
   "de": "Bạn có xu hướng chi cho niềm vui, sở thích. Gợi ý: tách riêng một khoản 'tiền vui' để không lấn sang tiền để dành."
  },
  "Kỵ|Điền Trạch": {
   "luan": "Tiết kiệm giữ nhà, ngại tiêu; lá số tốt thì tích dần thành tài sản.",
   "de": "Bạn thuộc mẫu người chắt chiu, vun vén. Gợi ý: thỉnh thoảng thưởng cho bản thân để giữ động lực."
  },
  "Kỵ|Phụ Mẫu": {
   "luan": "Tránh vay mượn, bảo lãnh; giấy tờ tiền bạc cần cẩn thận.",
   "de": "Bạn nên thận trọng với giấy tờ, hợp đồng liên quan tới tiền. Gợi ý: đọc kỹ trước khi ký, tránh đứng ra bảo lãnh."
  }
 },
 "Tật Ách": {
  "Kỵ|Mệnh": {
   "luan": "Bận rộn không ngơi, rảnh ra lại thấy bứt rứt.",
   "de": "Bạn có xu hướng luôn muốn làm việc gì đó. Gợi ý: lên kế hoạch cho thời gian rảnh để nghỉ ngơi thật sự."
  },
  "Kỵ|Tài Bạch": {
   "luan": "Dồn sức cho việc kiếm tiền; hợp nghề dịch vụ, không ôm hàng tồn.",
   "de": "Bạn sẵn sàng bỏ nhiều sức để kiếm tiền. Gợi ý: giữ nhịp làm – nghỉ đều đặn để đi đường dài."
  },
  "Kỵ|Quan Lộc": {
   "luan": "Môi trường làm việc dễ không vừa ý; hợp vị trí ổn định.",
   "de": "Bạn có xu hướng khó hài lòng với nơi làm việc. Gợi ý: chọn môi trường ổn định, rõ ràng về vai trò."
  }
 },
 "Thiên Di": {
  "Kỵ|Mệnh": {
   "luan": "Ra ngoài dễ gặp chuyện không như ý, dễ xa dần môi trường xã hội.",
   "de": "Bạn có xu hướng ngại môi trường đông người. Gợi ý: chọn vài nhóm nhỏ hợp tính để giữ kết nối."
  },
  "Kỵ|Phu Thê": {
   "luan": "Không khéo vun vén hôn nhân, công việc cũng dễ bị ảnh hưởng.",
   "de": "Bạn có xu hướng để áp lực bên ngoài ảnh hưởng chuyện gia đình. Gợi ý: để lại chuyện công việc ở cửa trước khi về nhà."
  },
  "Kỵ|Tài Bạch": {
   "luan": "Kiếm tiền vất vả, dễ gặp cạnh tranh không lành mạnh.",
   "de": "Bạn nên chọn môi trường làm ăn minh bạch. Gợi ý: hợp đồng rõ ràng, tránh 'làm ăn nóng'."
  },
  "Kỵ|Điền Trạch": {
   "luan": "Dễ rời quê, không giữ nghiệp nhà; tượng chuyển nhà.",
   "de": "Bạn có xu hướng thay đổi nơi ở. Gợi ý: giữ giấy tờ nhà đất cẩn thận mỗi lần chuyển."
  }
 },
 "Nô Bộc": {
  "Kỵ|Mệnh": {
   "luan": "Dễ gặp bạn bè đeo bám; cạnh tranh, thi cử, hợp tác kém thuận.",
   "de": "Bạn có xu hướng bị cuốn vào chuyện của bạn bè. Gợi ý: học cách nói 'không' nhẹ nhàng."
  },
  "Kỵ|Phu Thê": {
   "luan": "Bạn bè can dự hôn nhân, người phối ngẫu không ưa bạn mình.",
   "de": "Bạn nên giữ khoảng cách hợp lý giữa bạn bè và gia đình. Gợi ý: hỏi ý người bạn đời trước khi mời bạn bè vào chuyện nhà."
  },
  "Kỵ|Tài Bạch": {
   "luan": "Bạn bè tính toán tiền bạc; cạnh tranh cùng ngành; cổ đông có thể tư lợi.",
   "de": "Bạn nên tách bạch tiền nong với bạn bè. Gợi ý: mọi khoản góp chung nên có giấy tờ."
  }
 },
 "Quan Lộc": {
  "Kỵ|Mệnh": {
   "luan": "Lao tâm vì công việc, việc gì cũng canh cánh.",
   "de": "Bạn có xu hướng mang công việc theo cả khi nghỉ. Gợi ý: ghi việc ra danh sách để đầu óc được nhẹ."
  },
  "Kỵ|Tài Bạch": {
   "luan": "Thu nhập từ công việc không nhiều; hợp lương cố định.",
   "de": "Bạn hợp với thu nhập ổn định hơn là ăn chia rủi ro. Gợi ý: xây nguồn thu phụ nhỏ, an toàn."
  },
  "Kỵ|Phu Thê": {
   "luan": "Công việc kéo theo người phối ngẫu, hai người cần nâng đỡ nhau.",
   "de": "Bạn và người bạn đời nên cùng nhau tính chuyện sự nghiệp. Gợi ý: chia việc nhà hợp lý trong giai đoạn công việc bận."
  },
  "Kỵ|Phụ Mẫu": {
   "luan": "Công việc vất vả; hợp khu vực công hoặc doanh nghiệp lớn.",
   "de": "Bạn hợp với tổ chức có quy trình rõ ràng. Gợi ý: chọn nơi có lộ trình thăng tiến minh bạch."
  }
 },
 "Điền Trạch": {
  "Kỵ|Mệnh": {
   "luan": "Tay trắng lập nghiệp, gánh trách nhiệm gia đình; nhà cửa, tiền bạc là áp lực; nên tiết kiệm, làm việc ổn định.",
   "de": "Bạn thuộc mẫu người tự gây dựng, gánh vác gia đình. Gợi ý: lập kế hoạch nhà ở dài hạn, vay vừa sức."
  },
  "Kỵ|Tử Tức": {
   "luan": "Kho bị thủng, khó tích lũy; tránh cam kết dài hạn quá sức (cohoc: 'không nên tích trữ').",
   "de": "Bạn có xu hướng khó giữ của để dành. Gợi ý: chọn kênh tích lũy tự động, khó rút."
  },
  "Kỵ|Thiên Di": {
   "luan": "Khó quản lý tài sản; tượng chuyển nhà.",
   "de": "Bạn nên cẩn thận khi xử lý nhà đất. Gợi ý: nhờ người tin cậy, có chuyên môn tư vấn."
  },
  "Kỵ|Phụ Mẫu": {
   "luan": "Rủi ro giấy tờ; không nên đứng ra bảo lãnh hay ký hợp đồng chưa kiểm.",
   "de": "Bạn nên thận trọng với giấy tờ liên quan tới nhà cửa. Gợi ý: không đứng tên hộ, không bảo lãnh vay."
  }
 },
 "Phúc Đức": {
  "Kỵ|Mệnh": {
   "luan": "Hay cố chấp ý nghĩ, dễ buồn lo, tự làm khó mình.",
   "de": "Bạn có xu hướng suy nghĩ nhiều và kỹ tính. Gợi ý: tập buông những việc ngoài tầm tay, dành thời gian cho việc giúp người."
  },
  "Kỵ|Tài Bạch": {
   "luan": "Rất để ý tiền, chăm kiếm tiền, dễ mệt mỏi với nghề.",
   "de": "Bạn có xu hướng lo về tiền nhiều hơn mức cần. Gợi ý: xem lại con số thật để yên tâm hơn."
  },
  "Kỵ|Quan Lộc": {
   "luan": "Việc gì cũng tự làm, dễ quên chăm sóc tình cảm (cohoc: Thuận thủy Kỵ Phúc → Quan).",
   "de": "Bạn có xu hướng ôm việc. Gợi ý: giao bớt việc cho người khác và dành thời gian cho người thân."
  },
  "Kỵ|Phu Thê": {
   "luan": "Rất để ý người phối ngẫu, dễ thành theo sát quá mức.",
   "de": "Bạn có xu hướng quan tâm người bạn đời rất kỹ. Gợi ý: tin tưởng và cho nhau không gian riêng."
  }
 },
 "Phụ Mẫu": {
  "Kỵ|Mệnh": {
   "luan": "Cha mẹ lo cho mình, về sau mình gánh việc phụng dưỡng.",
   "de": "Bạn có xu hướng mang trách nhiệm với cha mẹ. Gợi ý: cùng anh chị em lên kế hoạch chăm sóc cha mẹ sớm."
  },
  "Kỵ|Phu Thê": {
   "luan": "Người trên can dự chuyện tình cảm; sau cưới nên ở riêng.",
   "de": "Bạn có thể gặp ý kiến trái chiều từ gia đình về chuyện tình cảm. Gợi ý: lắng nghe nhưng tự quyết, sau cưới nên có không gian riêng."
  },
  "Kỵ|Tài Bạch": {
   "luan": "Chi tiền cho cha mẹ; cẩn thận vay mượn, bảo lãnh, giấy tờ, tiền phạt.",
   "de": "Bạn nên quản lý giấy tờ tiền bạc cẩn thận. Gợi ý: lưu hồ sơ, đóng các khoản đúng hạn."
  },
  "Kỵ|Quan Lộc": {
   "luan": "Cha mẹ lo cho sự nghiệp của mình; mình cũng phải chia sẻ gánh phụng dưỡng.",
   "de": "Bạn có xu hướng vừa làm vừa lo cho gia đình lớn. Gợi ý: chia rõ phần đóng góp với anh chị em."
  }
 }
};

/** Văn hai tầng: snToa, laiNhan, tuHoa, phi (khuôn chung), mau (mẫu có tên), dvLoc, dvKy, dvKyXung, gioiThieu */
var PT_VAN = {
 "gioiThieu": {
  "ky": "Tứ Hóa Phi Tinh (Bắc phái, còn gọi Tứ Hóa phái hay Phi Tinh phái) là dòng Tử Vi hiện đại hình thành ở Đài Loan khoảng thập niên 1980–1990, tiêu biểu là Khâm Thiên môn và Hà Lạc phái. Khác Tam Hợp (Nam phái) vốn trọng tính chất từng sao và cách cục, phái này gán cho mỗi cung một thiên can theo phép Ngũ Hổ Độn (tính can các cung từ can năm sinh), rồi lần theo đường ‘bay’ (phi) của bốn hóa Lộc – Quyền – Khoa – Kỵ giữa 12 cung để xem nhân quả và thời điểm. Nền là Tứ Hóa năm sinh; phi hóa của từng cung, của đại vận (giai đoạn 10 năm) và của từng năm chồng lên trên nền ấy. Trong đó Lộc là duyên và niềm vui, Quyền là sức nắm giữ, Khoa là lý trí và tiếng tốt, còn Kỵ là nơi để tâm, gắn bó và phải bỏ công – Kỵ không đồng nghĩa với xấu. Phần này chỉ để tham khảo, đặt cạnh phần luận Tam Hợp chứ không thay thế.",
  "de": "Đây là một cách xem hiện đại, hình thành ở Đài Loan vài chục năm gần đây, tập trung vào dòng chảy của sự quan tâm, cơ hội và trách nhiệm giữa các mảng đời sống như bản thân, tiền bạc, công việc, gia đình và các mối quan hệ. Nó cho thấy bạn dễ có duyên ở đâu, hay để tâm và bỏ công vào đâu, và mảng nào dễ hao hụt, va chạm. Mỗi ý dưới đây nêu cả mặt tốt lẫn mặt xấu; nơi bạn gắn bó nhiều thường cũng là nơi bạn tốn sức và dễ tổn thương nhất. Tất cả chỉ là xu hướng để tham khảo, không phải định mệnh."
 },
 "snToa": {
  "Lộc": {
   "Mệnh": {
    "ky": "Hóa Lộc năm sinh ngồi Mệnh: duyên lành tiên thiên (có sẵn từ lúc sinh) đặt ở chính bản thân, chủ đầu óc linh hoạt, dễ gần, tinh thần thường vui.",
    "de": "Mặt tốt: bạn thuộc mẫu người dễ gần, linh hoạt, thường giữ được tinh thần vui vẻ. Mặt xấu: dễ dãi với mình, thiếu chủ kiến khi cần cứng rắn và hay bận rộn với nhiều việc nhỏ mà không đi tới đâu."
   },
   "Huynh Đệ": {
    "ky": "Hóa Lộc năm sinh ngồi Huynh Đệ: có duyên với anh chị em, bạn đồng trang lứa; Huynh Đệ còn là ‘kho nhỏ’ của tiền bạc (Điền Trạch của Tài Bạch) nên chủ tích góp khá.",
    "de": "Mặt tốt: bạn có xu hướng hợp với anh chị em, bạn cùng lứa và tích góp được từ những khoản nhỏ. Mặt xấu: tiền tích góp dễ bị người thân hỏi mượn, và tình thân dễ lẫn với chuyện tiền."
   },
   "Phu Thê": {
    "ky": "Hóa Lộc năm sinh ngồi Phu Thê: tình duyên sâu, người phối ngẫu chu đáo, hai bên có duyên với nhau.",
    "de": "Mặt tốt: bạn có xu hướng gặp được người bạn đời chu đáo, tình cảm sâu đậm. Mặt xấu: bạn dễ đặt quá nhiều niềm vui vào người ấy, khi tình cảm nguội thì hụt hẫng nặng."
   },
   "Tử Tức": {
    "ky": "Hóa Lộc năm sinh ngồi Tử Tức: gần gũi con cái, người nhỏ tuổi; Tử Tức cũng là cung hợp tác nên chủ làm ăn chung thuận.",
    "de": "Mặt tốt: bạn có xu hướng gần gũi con trẻ, người nhỏ tuổi và làm ăn chung khá thuận. Mặt xấu: dễ chiều con, dễ tin đối tác mà lơ là thỏa thuận rõ ràng."
   },
   "Tài Bạch": {
    "ky": "Hóa Lộc năm sinh ngồi Tài Bạch: có duyên với tiền mặt, kiếm tiền tương đối nhẹ nhàng.",
    "de": "Mặt tốt: bạn có xu hướng kiếm tiền tương đối nhẹ nhàng, dòng tiền thường dễ chịu. Mặt xấu: tiền đến dễ nên tiêu cũng dễ, ít chịu tích lũy và dễ hụt khi có việc gấp."
   },
   "Tật Ách": {
    "ky": "Hóa Lộc năm sinh ngồi Tật Ách: ở Bắc phái, Tật Ách chỉ thân thể, nhịp sống và môi trường quanh mình; Lộc ở đây chủ thể lực có phúc, nơi sống và làm việc dễ chịu.",
    "de": "Mặt tốt: bạn có xu hướng có sức bền tốt, nơi sống và làm việc dễ chịu. Mặt xấu: dễ hưởng thụ, ngại vận động, lâu dần dễ mắc bệnh do lối sống như thừa cân, mỡ máu, tiểu đường, gan nhiễm mỡ. Gợi ý: có dấu hiệu lạ thì đi khám, hỏi bác sĩ."
   },
   "Thiên Di": {
    "ky": "Hóa Lộc năm sinh ngồi Thiên Di: ra ngoài dễ gặp quý nhân (người giúp đỡ), ứng xử tròn trịa, được xã hội đón nhận.",
    "de": "Mặt tốt: bạn có xu hướng ra ngoài dễ gặp người giúp đỡ, ứng xử khéo léo. Mặt xấu: tròn trịa quá dễ bị cho là thiếu lập trường, và vận tốt phụ thuộc nhiều vào bên ngoài."
   },
   "Nô Bộc": {
    "ky": "Hóa Lộc năm sinh ngồi Nô Bộc: nhiều bạn tốt, cộng sự hợp ý, cạnh tranh thuận lợi.",
    "de": "Mặt tốt: bạn có xu hướng có nhiều bạn tốt, làm việc nhóm thuận lợi. Mặt xấu: dễ dành cho bạn bè nhiều thời gian, tiền bạc hơn cho gia đình."
   },
   "Quan Lộc": {
    "ky": "Hóa Lộc năm sinh ngồi Quan Lộc: công việc có duyên, dễ gặp thời, sự nghiệp thuận.",
    "de": "Mặt tốt: bạn có xu hướng thuận lợi trong công việc, dễ gặp việc hợp với mình. Mặt xấu: thuận lâu dễ an phận, thiếu sức ép nên khó bứt lên."
   },
   "Điền Trạch": {
    "ky": "Hóa Lộc năm sinh ngồi Điền Trạch: gia đình hòa thuận, nơi ở dễ chịu; Điền Trạch là ‘kho’ của Tài Bạch nên cũng chủ có chỗ tích lũy.",
    "de": "Mặt tốt: bạn có xu hướng có gia đình êm ấm, nơi ở dễ chịu, có chỗ tích lũy. Mặt xấu: dễ chi nhiều cho nhà cửa, và ngại rời vùng an toàn để thử điều mới."
   },
   "Phúc Đức": {
    "ky": "Hóa Lộc năm sinh ngồi Phúc Đức: Phúc Đức chỉ đời sống tinh thần và phúc phần; Lộc ở đây chủ tâm an, biết đủ, dễ vui với điều nhỏ.",
    "de": "Mặt tốt: bạn thuộc mẫu người biết đủ, tâm tương đối an, dễ vui với điều nhỏ. Mặt xấu: biết đủ quá thì thiếu tham vọng, dễ dừng ở mức bình thường."
   },
   "Phụ Mẫu": {
    "ky": "Hóa Lộc năm sinh ngồi Phụ Mẫu: có duyên với cha mẹ, người trên, cấp trên; uy tín và giấy tờ thuận.",
    "de": "Mặt tốt: bạn có xu hướng được người trên quý mến, có uy tín, giấy tờ thuận. Mặt xấu: dựa vào người trên nhiều thì dễ mất chủ động khi họ không còn đỡ."
   }
  },
  "Quyền": {
   "Mệnh": {
    "ky": "Hóa Quyền năm sinh ngồi Mệnh: Quyền là sức nắm giữ, thành tựu; ở Mệnh chủ người có chủ kiến, năng lực tự quyết, muốn làm chủ việc của mình.",
    "de": "Mặt tốt: bạn thuộc mẫu người có chủ kiến, dám quyết và muốn tự làm chủ. Mặt xấu: dễ độc đoán, khó nghe người khác và va chạm với người cũng muốn cầm trịch."
   },
   "Huynh Đệ": {
    "ky": "Hóa Quyền năm sinh ngồi Huynh Đệ: giữ vai đầu tàu giữa anh chị em, bạn đồng trang lứa; với ‘kho nhỏ’ tiền bạc thì quản lý chặt.",
    "de": "Mặt tốt: bạn có xu hướng giữ vai đầu tàu giữa anh chị em, bạn cùng lứa và quản tiền tích góp chặt. Mặt xấu: dễ áp đặt lên anh em, gây khó chịu và tranh quyền trong nhà."
   },
   "Phu Thê": {
    "ky": "Hóa Quyền năm sinh ngồi Phu Thê: người phối ngẫu có năng lực, mạnh mẽ, có tiếng nói trong nhà.",
    "de": "Mặt tốt: bạn có xu hướng gắn bó với người bạn đời có năng lực, có chủ kiến. Mặt xấu: hai người dễ giành phần quyết, người kia có thể lấn tiếng bạn trong nhà."
   },
   "Tử Tức": {
    "ky": "Hóa Quyền năm sinh ngồi Tử Tức: kỳ vọng cao và nghiêm với con cái, người nhỏ tuổi; việc hợp tác có sức bật.",
    "de": "Mặt tốt: bạn có xu hướng đặt kỳ vọng cao với người nhỏ tuổi, làm việc chung có sức bật. Mặt xấu: nghiêm quá khiến con cái áp lực, xa cách, và hợp tác dễ căng vì ai cũng muốn nắm."
   },
   "Tài Bạch": {
    "ky": "Hóa Quyền năm sinh ngồi Tài Bạch: kiếm tiền bằng năng lực, dám làm lớn, muốn nắm chủ động dòng tiền.",
    "de": "Mặt tốt: bạn có xu hướng kiếm tiền bằng năng lực, dám làm lớn. Mặt xấu: dám làm lớn thì cũng dễ lỗ lớn, chi mạnh tay và khó chịu khi người khác can thiệp chuyện tiền."
   },
   "Tật Ách": {
    "ky": "Hóa Quyền năm sinh ngồi Tật Ách: thể lực và sức làm việc mạnh, thích tự tay xử lý mọi việc.",
    "de": "Mặt tốt: bạn có xu hướng có sức làm việc mạnh, thích tự tay xử lý. Mặt xấu: dễ làm quá sức, ôm việc của người khác; cơ thể bị bào mòn, dễ đau lưng – cột sống, đau dạ dày, mất ngủ. Gợi ý: có dấu hiệu lạ thì đi khám, hỏi bác sĩ."
   },
   "Thiên Di": {
    "ky": "Hóa Quyền năm sinh ngồi Thiên Di: ra ngoài thể hiện năng lực tốt, có sức ảnh hưởng, dễ được nể trọng.",
    "de": "Mặt tốt: bạn có xu hướng thể hiện năng lực tốt khi ra bên ngoài, dễ được nể trọng. Mặt xấu: mạnh ở ngoài thì dễ va chạm, gây đối thủ và lơ việc nhà."
   },
   "Nô Bộc": {
    "ky": "Hóa Quyền năm sinh ngồi Nô Bộc: bạn bè, cộng sự giỏi giang, có tiếng nói; nếu không phân vai rõ thì dễ bị lấn tiếng.",
    "de": "Mặt tốt: bạn có xu hướng có bạn bè, đồng nghiệp giỏi giang, có tiếng nói. Mặt xấu: không phân vai rõ thì dễ bị lấn tiếng, công sức của mình bị người khác nhận."
   },
   "Quan Lộc": {
    "ky": "Hóa Quyền năm sinh ngồi Quan Lộc: năng lực chuyên môn mạnh, muốn nắm vai trò chính trong công việc.",
    "de": "Mặt tốt: bạn thuộc mẫu người có năng lực chuyên môn, muốn giữ vai chính trong công việc. Mặt xấu: dễ ôm hết, khó giao việc, và va chạm với cấp trên hay đồng nghiệp cùng tham vọng."
   },
   "Điền Trạch": {
    "ky": "Hóa Quyền năm sinh ngồi Điền Trạch: làm chủ việc nhà, quyết đoán trong chuyện nhà cửa và tài sản.",
    "de": "Mặt tốt: bạn có xu hướng làm chủ chuyện nhà, quyết đoán trong việc nhà cửa, tài sản. Mặt xấu: quyết một mình dễ khiến người nhà phật ý, sinh va chạm trong gia đình."
   },
   "Phúc Đức": {
    "ky": "Hóa Quyền năm sinh ngồi Phúc Đức: ý chí mạnh, theo đuổi sở thích và niềm tin của mình đến cùng.",
    "de": "Mặt tốt: bạn có xu hướng có ý chí mạnh, theo điều mình thích đến cùng. Mặt xấu: dễ cố chấp với niềm tin riêng, khó chấp nhận ý khác."
   },
   "Phụ Mẫu": {
    "ky": "Hóa Quyền năm sinh ngồi Phụ Mẫu: người trên nghiêm khắc nhưng có sức đỡ; học hành, giấy tờ làm có bài bản.",
    "de": "Mặt tốt: bạn có xu hướng có người trên sẵn lòng nâng đỡ, học hành, giấy tờ làm bài bản. Mặt xấu: người trên nghiêm khắc, dễ áp đặt, khiến bạn chịu sức ép."
   }
  },
  "Khoa": {
   "Mệnh": {
    "ky": "Hóa Khoa năm sinh ngồi Mệnh: Khoa là lý trí, hòa hoãn và tiếng tốt; ở Mệnh chủ người điềm đạm, giữ được hình ảnh đứng đắn.",
    "de": "Mặt tốt: bạn thuộc mẫu người điềm đạm, lý trí, giữ được hình ảnh đứng đắn. Mặt xấu: chừng mực quá thì thiếu quyết liệt, dễ do dự và lỡ dịp."
   },
   "Huynh Đệ": {
    "ky": "Hóa Khoa năm sinh ngồi Huynh Đệ: quan hệ với anh chị em, bạn đồng trang lứa êm đềm, lúc cần dễ được giúp.",
    "de": "Mặt tốt: bạn có xu hướng có quan hệ êm đềm với anh chị em, bạn cùng lứa, lúc cần dễ được giúp. Mặt xấu: sự giúp đỡ thường ở mức vừa phải, không đủ để dựa hẳn."
   },
   "Phu Thê": {
    "ky": "Hóa Khoa năm sinh ngồi Phu Thê: người phối ngẫu hiểu biết, nhã nhặn; tình cảm êm, ít sóng gió.",
    "de": "Mặt tốt: bạn có xu hướng gắn bó với người bạn đời hiểu biết, nhã nhặn, tình cảm êm. Mặt xấu: êm quá thì nhạt, ít nồng nhiệt, dễ thành khách sáo."
   },
   "Tử Tức": {
    "ky": "Hóa Khoa năm sinh ngồi Tử Tức: dạy con bằng lý lẽ, kiên nhẫn; hợp tác văn minh, rõ ràng.",
    "de": "Mặt tốt: bạn có xu hướng dạy con bằng lý lẽ, kiên nhẫn, hợp tác văn minh. Mặt xấu: mềm quá thì con thiếu kỷ luật, và hợp tác thiếu người quyết đoán."
   },
   "Tài Bạch": {
    "ky": "Hóa Khoa năm sinh ngồi Tài Bạch: quản lý tiền điềm tĩnh, thu nhập đều, kiếm tiền nhờ uy tín và chuyên môn.",
    "de": "Mặt tốt: bạn có xu hướng quản tiền điềm tĩnh, thu nhập đều, kiếm tiền nhờ uy tín và chuyên môn. Mặt xấu: thu nhập đều nhưng không lớn, khó giàu nhanh."
   },
   "Tật Ách": {
    "ky": "Hóa Khoa năm sinh ngồi Tật Ách: nhịp sống điều độ, gặp khó thường có người hỗ trợ đúng lúc.",
    "de": "Mặt tốt: bạn có xu hướng giữ được nhịp sống điều độ, gặp khó thường có người giúp đúng lúc. Mặt xấu: sự giúp thường đến sau khi chuyện đã xảy ra chứ không chặn trước."
   },
   "Thiên Di": {
    "ky": "Hóa Khoa năm sinh ngồi Thiên Di: ra ngoài để lại ấn tượng tốt, có tiếng thơm, dễ gặp người chỉ đường.",
    "de": "Mặt tốt: bạn có xu hướng để lại ấn tượng tốt, có tiếng thơm khi ra ngoài. Mặt xấu: tiếng tốt nhiều hơn lợi thực, và dễ bận tâm giữ hình ảnh."
   },
   "Nô Bộc": {
    "ky": "Hóa Khoa năm sinh ngồi Nô Bộc: bạn bè lịch sự, đáng tin, sẵn lòng góp ý và chỉ dẫn.",
    "de": "Mặt tốt: bạn có xu hướng có bạn bè lịch sự, đáng tin, sẵn lòng chỉ dẫn. Mặt xấu: quan hệ dễ ở mức xã giao, ít người thật sự xông vào giúp lúc khó."
   },
   "Quan Lộc": {
    "ky": "Hóa Khoa năm sinh ngồi Quan Lộc: làm việc có nề nếp, dễ được ghi nhận về chuyên môn, danh tiếng nghề nghiệp tốt.",
    "de": "Mặt tốt: bạn có xu hướng làm việc có nề nếp, dễ được ghi nhận về chuyên môn. Mặt xấu: danh tiếng tốt mà thu nhập chưa chắc tương xứng."
   },
   "Điền Trạch": {
    "ky": "Hóa Khoa năm sinh ngồi Điền Trạch: nếp nhà nền nã, nơi ở ngăn nắp, yên ổn.",
    "de": "Mặt tốt: bạn có xu hướng có nếp nhà nền nã, nơi ở ngăn nắp, yên ổn. Mặt xấu: nặng giữ nếp nên dễ cứng nhắc với người nhà."
   },
   "Phúc Đức": {
    "ky": "Hóa Khoa năm sinh ngồi Phúc Đức: đời sống tinh thần thanh nhã, biết điều tiết cảm xúc.",
    "de": "Mặt tốt: bạn thuộc mẫu người có đời sống tinh thần thanh nhã, biết điều tiết cảm xúc. Mặt xấu: giữ cảm xúc kỹ quá thì dễ bị thấy là lạnh, xa cách."
   },
   "Phụ Mẫu": {
    "ky": "Hóa Khoa năm sinh ngồi Phụ Mẫu: thuận học hành, thi cử, giấy tờ; được người trên nâng đỡ.",
    "de": "Mặt tốt: bạn có xu hướng thuận học hành, thi cử, giấy tờ, được người trên nâng đỡ. Mặt xấu: dựa vào nâng đỡ thì dễ thiếu sức tự vượt khó."
   }
  },
  "Kỵ": {
   "Mệnh": {
    "ky": "Hóa Kỵ năm sinh ngồi Mệnh: Kỵ là nơi để tâm, chấp giữ và phải bỏ công, không đồng nghĩa với xấu; ở Mệnh chủ người kiên định đến mức có lúc cố chấp, giao tiếp tốn sức.",
    "de": "Mặt tốt: bạn có xu hướng kiên định, đã nghĩ là theo đến cùng. Mặt xấu: kiên định quá thành cố chấp, giao tiếp tốn sức, dễ va chạm và tự làm khó mình."
   },
   "Huynh Đệ": {
    "ky": "Hóa Kỵ năm sinh ngồi Huynh Đệ: để tâm nhiều tới anh chị em, bạn đồng trang lứa; việc góp chung cần nhiều công, ‘kho nhỏ’ tiền bạc phải vun vén.",
    "de": "Mặt tốt: bạn có xu hướng rất để tâm tới anh chị em, bạn cùng lứa. Mặt xấu: việc góp chung tốn nhiều công, tiền tích góp phải vun vén vất vả, dễ hao vì người thân."
   },
   "Phu Thê": {
    "ky": "Hóa Kỵ năm sinh ngồi Phu Thê: đặt nhiều tâm sức và trách nhiệm vào hôn nhân, có xu hướng lập gia đình trước rồi mới lập nghiệp.",
    "de": "Mặt tốt: bạn có xu hướng đặt nhiều tâm sức và trách nhiệm vào chuyện lứa đôi, thường lập gia đình trước rồi mới lập nghiệp. Mặt xấu: tình cảm dễ thành gánh nặng, áp lực và căng thẳng cho cả hai."
   },
   "Tử Tức": {
    "ky": "Hóa Kỵ năm sinh ngồi Tử Tức: nhiều trách nhiệm với con cái, người nhỏ tuổi; việc hợp tác dễ thay đổi.",
    "de": "Mặt tốt: bạn có xu hướng có trách nhiệm với con trẻ, người nhỏ tuổi. Mặt xấu: lo cho con nhiều mà mệt, và việc làm chung dễ thay đổi, khó bền."
   },
   "Tài Bạch": {
    "ky": "Hóa Kỵ năm sinh ngồi Tài Bạch: để tâm nhiều tới tiền, dòng tiền cần quản chặt, phải bỏ công mới có thu.",
    "de": "Mặt tốt: bạn có xu hướng để tâm tới tiền, chịu bỏ công để có thu. Mặt xấu: tiền phải vất vả mới có, dòng tiền cần quản chặt, dễ lo âu vì tiền."
   },
   "Tật Ách": {
    "ky": "Hóa Kỵ năm sinh ngồi Tật Ách: khó ngồi yên, dễ làm quá sức; cần giữ nhịp làm và nghỉ đều.",
    "de": "Mặt tốt: bạn có xu hướng siêng năng, khó ngồi yên. Mặt xấu: dễ làm quá sức, cơ thể mệt mỏi kéo dài; có xu hướng mắc bệnh mạn tính, tái đi tái lại như đau dạ dày, đau lưng, mất ngủ, huyết áp. Gợi ý: có dấu hiệu lạ thì đi khám, hỏi bác sĩ."
   },
   "Thiên Di": {
    "ky": "Hóa Kỵ năm sinh ngồi Thiên Di (xung Mệnh): tính thẳng, hay bôn ba, ra ngoài không phải lúc nào cũng suôn sẻ.",
    "de": "Mặt tốt: bạn có xu hướng sống thẳng thắn, chịu đi lại. Mặt xấu: hay bôn ba, ra ngoài không phải lúc nào cũng suôn sẻ, tính thẳng dễ gây va chạm."
   },
   "Nô Bộc": {
    "ky": "Hóa Kỵ năm sinh ngồi Nô Bộc: dễ bị cuốn vào chuyện của bạn bè, cộng sự; càng cho đi có chừng mực càng nhẹ.",
    "de": "Mặt tốt: bạn có xu hướng tận tình với bạn bè, đồng nghiệp. Mặt xấu: dễ bị cuốn vào chuyện của họ, hao sức, hao tiền và thiệt về mình."
   },
   "Quan Lộc": {
    "ky": "Hóa Kỵ năm sinh ngồi Quan Lộc: coi công việc là trách nhiệm nặng, việc gì cũng muốn tự làm.",
    "de": "Mặt tốt: bạn thuộc mẫu người coi công việc là trách nhiệm lớn, làm tới nơi tới chốn. Mặt xấu: việc gì cũng muốn tự làm nên căng thẳng, quá tải và khó lên vị trí quản lý."
   },
   "Điền Trạch": {
    "ky": "Hóa Kỵ năm sinh ngồi Điền Trạch: gánh nhiều việc nhà, lo toan cho gia đình và chỗ ở.",
    "de": "Mặt tốt: bạn có xu hướng gánh nhiều việc nhà, lo toan cho gia đình. Mặt xấu: gánh nhiều mà mệt, dễ thấy mình chịu thiệt trong nhà."
   },
   "Phúc Đức": {
    "ky": "Hóa Kỵ năm sinh ngồi Phúc Đức: hay lo nghĩ, kỹ tính, khó thảnh thơi (xung Tài Bạch nên cũng hay lo chuyện tiền).",
    "de": "Mặt tốt: bạn có xu hướng suy nghĩ kỹ, cẩn thận. Mặt xấu: hay lo nghĩ, khó thảnh thơi, lo cả chuyện tiền nên tinh thần dễ căng."
   },
   "Phụ Mẫu": {
    "ky": "Hóa Kỵ năm sinh ngồi Phụ Mẫu: duyên với người trên cần vun đắp, phải cẩn thận giấy tờ, hợp đồng liên quan tiền bạc.",
    "de": "Mặt tốt: bạn có xu hướng tự nỗ lực, không trông chờ vào người trên. Mặt xấu: ít được người trên nâng đỡ, giấy tờ, hợp đồng liên quan tiền bạc dễ trục trặc. Gợi ý: đọc kỹ văn bản trước khi ký."
   }
  }
 },
 "laiNhan": {
  "Mệnh": {
   "ky": "Lai Nhân cung (cung có thiên can trùng can năm sinh, nơi phát ra Tứ Hóa năm sinh, tức ‘lý do đến với đời này’) ở Mệnh: tự làm chủ, thành bại do chính mình.",
   "de": "Mặt tốt: bạn thuộc mẫu người tự làm chủ cuộc đời, thành hay bại phần lớn do chính mình. Mặt xấu: tự quyết hết nên dễ cố chấp, sai thì cũng không ai gánh cùng."
  },
  "Huynh Đệ": {
   "ky": "Lai Nhân cung ở Huynh Đệ: động lực đời này đến từ quan hệ với mẹ, anh chị em, bạn đồng trang lứa; hợp kiểu làm ăn chung.",
   "de": "Mặt tốt: bạn có xu hướng lấy động lực từ anh chị em, bạn bè cùng lứa và hợp làm ăn chung. Mặt xấu: lệ thuộc vào người thân, khi quan hệ sứt mẻ thì cả việc lẫn tinh thần bị kéo xuống."
  },
  "Phu Thê": {
   "ky": "Lai Nhân cung ở Phu Thê: coi trọng tình cảm, gắn bó lứa đôi; cảm xúc dễ bị ảnh hưởng bởi sự lạnh nhạt của người kia.",
   "de": "Mặt tốt: bạn có xu hướng coi trọng tình cảm, gắn bó lứa đôi. Mặt xấu: cảm xúc dễ bị ảnh hưởng bởi sự lạnh nhạt của người kia, dễ tổn thương."
  },
  "Tử Tức": {
   "ky": "Lai Nhân cung ở Tử Tức: mong gia đình trọn vẹn, gần gũi người nhỏ tuổi, thích hợp tác.",
   "de": "Mặt tốt: bạn có xu hướng mong gia đình trọn vẹn, gần gũi người nhỏ tuổi, thích hợp tác. Mặt xấu: mong trọn vẹn nên dễ hụt hẫng khi con cái hay đối tác không như ý."
  },
  "Tài Bạch": {
   "ky": "Lai Nhân cung ở Tài Bạch: nhạy với tiền và thị trường, coi trọng sự đủ đầy; dễ tự trách khi chưa đạt mục tiêu tài chính.",
   "de": "Mặt tốt: bạn có xu hướng nhạy với tiền và thị trường, coi trọng sự đủ đầy. Mặt xấu: dễ tự trách, áp lực khi chưa đạt mục tiêu tài chính."
  },
  "Tật Ách": {
   "ky": "Lai Nhân cung ở Tật Ách: thích tự tay làm, dồn sức vào việc; cần chú ý nhịp làm và nghỉ.",
   "de": "Mặt tốt: bạn có xu hướng thích tự tay làm, dồn sức vào việc. Mặt xấu: dễ làm quá sức, cơ thể bị bào mòn."
  },
  "Thiên Di": {
   "ky": "Lai Nhân cung ở Thiên Di: quan tâm hình ảnh bên ngoài, dám đi xa; gặp bế tắc thì mở rộng ra ngoài sẽ có lợi.",
   "de": "Mặt tốt: bạn có xu hướng dám đi xa, gặp bế tắc thì mở rộng ra ngoài sẽ có lợi. Mặt xấu: quá bận tâm hình ảnh bên ngoài, dễ sống vì người khác nhìn."
  },
  "Nô Bộc": {
   "ky": "Lai Nhân cung ở Nô Bộc: đặt bạn bè lên trước, khó từ chối người khác; cần cân bằng với gia đình.",
   "de": "Mặt tốt: bạn có xu hướng trọng bạn bè, sẵn lòng giúp người. Mặt xấu: khó từ chối, đặt bạn bè lên trước nên gia đình dễ thiệt."
  },
  "Quan Lộc": {
   "ky": "Lai Nhân cung ở Quan Lộc: coi trọng mục tiêu sự nghiệp, cần lịch làm việc đầy đủ; dễ nản khi vấp váp.",
   "de": "Mặt tốt: bạn có xu hướng coi trọng mục tiêu sự nghiệp, làm việc có lịch rõ. Mặt xấu: dễ nản khi vấp váp, đồng nhất giá trị bản thân với công việc."
  },
  "Điền Trạch": {
   "ky": "Lai Nhân cung ở Điền Trạch: hướng về gia đình, sự ủng hộ của người nhà là động lực; dễ lập gia đình sớm.",
   "de": "Mặt tốt: bạn có xu hướng hướng về gia đình, lấy sự ủng hộ của người nhà làm động lực. Mặt xấu: dễ lập gia đình sớm khi chưa vững, và chao đảo khi gia đình có chuyện."
  },
  "Phúc Đức": {
   "ky": "Lai Nhân cung ở Phúc Đức: đề cao đời sống tinh thần hơn vật chất; may mắn đến từ phúc phần.",
   "de": "Mặt tốt: bạn có xu hướng đề cao đời sống tinh thần, may mắn đến từ phúc phần. Mặt xấu: dễ xem nhẹ vật chất, thiếu tính toán chuyện cơm áo."
  },
  "Phụ Mẫu": {
   "ky": "Lai Nhân cung ở Phụ Mẫu: ảnh hưởng của cha, người trên lớn, định hình cách hành xử và cách làm cha mẹ sau này.",
   "de": "Mặt tốt: bạn có xu hướng được cha, người trên định hướng rõ cách sống. Mặt xấu: ảnh hưởng ấy lớn đến mức khó thoát khuôn, dễ lặp lại cả cái chưa hay khi làm cha mẹ."
  }
 },
 "tuHoa": {
  "lyTam": {
   "Lộc": {
    "ky": "Tự hóa Lộc ly tâm ở mảng {lv}: can của cung làm chính sao trong cung hóa Lộc, năng lượng tỏa ra ngoài – có duyên nhưng dễ cho đi, có rồi khó giữ; nên xem tiếp cung này chuyển Kỵ về đâu để thấy kết quả.",
    "de": "Mặt tốt: bạn có xu hướng rộng rãi, có niềm vui hay cơ hội ở {lv} là sẵn lòng chia ra. Mặt xấu: có rồi khó giữ, cái được ở {lv} dễ trôi sang người khác."
   },
   "Quyền": {
    "ky": "Tự hóa Quyền ly tâm ở mảng {lv}: sức nắm giữ bung ra ngoài, hay tự đánh giá cao và muốn thể hiện; mạnh lúc đầu nhưng khó bền.",
    "de": "Mặt tốt: bạn có xu hướng thể hiện năng lực mạnh và muốn chứng tỏ ở {lv}. Mặt xấu: hay tự đánh giá cao, mạnh lúc đầu nhưng khó bền."
   },
   "Khoa": {
    "ky": "Tự hóa Khoa ly tâm ở mảng {lv}: lý trí và tiếng tốt tỏa ra nhẹ nhàng, có tiết chế; tiếng tốt đến nhanh nhưng cũng dễ phai nếu không vun đắp.",
    "de": "Mặt tốt: bạn có xu hướng cư xử chừng mực, dễ tạo ấn tượng tốt ở {lv}. Mặt xấu: tiếng tốt đến nhanh nhưng cũng dễ phai."
   },
   "Kỵ": {
    "ky": "Tự hóa Kỵ ly tâm ở mảng {lv}, còn gọi Kỵ xuất: sự chấp giữ được buông ra một cách vô tình, có rồi để trôi; không tính thêm một Kỵ, chỉ luận tượng ‘ra mà không giữ’.",
    "de": "Mặt tốt: bạn có xu hướng không bị trói buộc quá mức bởi {lv}. Mặt xấu: những gì thuộc {lv} dễ trôi đi lúc nào không hay, có rồi để mất."
   }
  },
  "huongTam": {
   "Lộc": {
    "ky": "Hướng tâm Lộc ở mảng {lv}: can của cung làm sao ở cung đối diện hóa Lộc, năng lượng hướng vào trong – duyên khởi, gom tụ, được nhận về.",
    "de": "Mặt tốt: bạn có xu hướng nhận được cơ hội và niềm vui ở {lv} từ bên ngoài tìm đến. Mặt xấu: dễ trông chờ bên ngoài, ít tự tạo cơ hội."
   },
   "Quyền": {
    "ky": "Hướng tâm Quyền ở mảng {lv}: sức đẩy từ cung đối diện dồn về, được trao vai trò, được thúc tới thành tựu.",
    "de": "Mặt tốt: bạn có xu hướng được bên ngoài trao thêm vai trò và động lực ở {lv}. Mặt xấu: vai trò bị đẩy tới nhiều khi vượt sức, dễ thành áp lực."
   },
   "Khoa": {
    "ky": "Hướng tâm Khoa ở mảng {lv}: lý trí, quý nhân (người giúp đỡ) và tiếng tốt từ cung đối diện hướng về.",
    "de": "Mặt tốt: bạn có xu hướng được người khác nâng đỡ, góp ý đúng lúc ở {lv}. Mặt xấu: dễ dựa vào sự góp ý ấy, thiếu tự quyết."
   },
   "Kỵ": {
    "ky": "Hướng tâm Kỵ ở mảng {lv}: Hóa Kỵ nhập cung đối diện tức là xung ngược về chính cung (Lưu xuất Kỵ) – điều của mảng này chảy thẳng ra ngoài, khó giữ nhưng không tích nợ.",
    "de": "Mặt tốt: bạn có xu hướng không tích nợ ở {lv}, làm gọn, quay vòng nhanh. Mặt xấu: những gì thuộc {lv} đến nhanh đi cũng nhanh, khó giữ lâu."
   }
  }
 },
 "phi": {
  "Lộc": {
   "ky": "Mảng {A} phi Hóa Lộc nhập mảng {B}: can của cung xuất làm sao ở cung nhập hóa Lộc, nghĩa là {A} mang duyên, niềm vui tới {B} và cũng vui nhờ {B} (quan hệ hai chiều).",
   "de": "Mặt tốt: bạn có xu hướng để những gì liên quan tới {A} mang lại niềm vui và cơ hội cho {B}, hai bên cùng vui. Mặt xấu: dễ dồn cái tốt sang {B} mà phần {A} của mình thiếu đi."
  },
  "Quyền": {
   "ky": "Mảng {A} phi Hóa Quyền nhập mảng {B}: {A} muốn nắm giữ, đẩy {B} tới thành tựu, đặt năng lực và sức quyết vào {B}.",
   "de": "Mặt tốt: bạn có xu hướng dùng năng lực từ {A} để thúc đẩy {B} tới thành tựu. Mặt xấu: đẩy mạnh quá dễ thành áp đặt, gây căng thẳng ở {B}."
  },
  "Khoa": {
   "ky": "Mảng {A} phi Hóa Khoa nhập mảng {B}: {A} đối với {B} nhẹ nhàng, lý trí, có chừng mực; dễ có quý nhân và tiếng tốt ở {B}.",
   "de": "Mặt tốt: bạn có xu hướng đối đãi với {B} điềm tĩnh, chừng mực xuất phát từ {A}, dễ có tiếng tốt ở đó. Mặt xấu: chừng mực quá thì thiếu nhiệt, quan hệ dễ ở mức xã giao."
  },
  "Kỵ": {
   "ky": "Mảng {A} phi Hóa Kỵ nhập mảng {B}: {A} để tâm, gắn bó và phải bỏ công cho {B}; đồng thời Kỵ ở {B} xung sang cung đối diện của {B}. Kỵ ở đây là sự gắn bó, không đồng nghĩa với xấu.",
   "de": "Mặt tốt: bạn có xu hướng dành nhiều tâm sức từ {A} cho {B}, gắn bó và chịu bỏ công. Mặt xấu: tốn sức, dễ kiệt và kéo theo va chạm ở mảng đối diện với {B}."
  }
 },
 "mau": {
  "luuXuat": {
   "ten": "Lưu xuất Kỵ",
   "ky": "Lưu xuất Kỵ (Kỵ chảy ra): mảng {A} phi Hóa Kỵ vào cung đối diện nên Kỵ xung ngược về chính nó – điều {A} đại diện chảy ra ngoài, khó giữ nhưng cũng không tích nợ. Nếu rơi vào Mệnh, Tài Bạch hoặc Quan Lộc thì gọi Thủy mệnh Kỵ (tính chất như nước chảy), hợp nghề dịch vụ, mua bán, nhận lương hơn là ôm hàng tồn.",
   "de": "Mặt tốt: bạn có xu hướng không tích nợ ở {A}, hợp cách làm gọn, quay vòng nhanh. Mặt xấu: những gì thuộc {A} đến rồi đi khá nhanh, khó giữ lâu, khó tích lũy."
  },
  "nghichThuy": {
   "ten": "Nghịch thủy Kỵ",
   "ky": "Nghịch thủy Kỵ (nước chảy ngược): mảng {A} (Mệnh, Tài Bạch hoặc Quan Lộc) có Lưu xuất Kỵ, nhưng cung đối diện đã có Hóa Kỵ năm sinh và không tự hóa, nên dòng chảy gặp ‘bức tường’ và dội ngược về thành tích tụ. Thuận cho tích lũy, hợp sản xuất, làm chuỗi; không tính là Song Kỵ.",
   "de": "Mặt tốt: bạn có xu hướng thấy những gì bỏ ra ở {A} quay về và tích tụ dần, hợp sản xuất, xây dựng từng bước. Mặt xấu: tích tụ chậm, phải chờ lâu mới thấy kết quả, dễ sốt ruột."
  },
  "thuyTiet": {
   "ten": "Thủy tiết Kỵ",
   "ky": "Thủy tiết Kỵ (nước rò): đủ điều kiện Nghịch thủy Kỵ nhưng cung đối diện (nơi có Kỵ năm sinh) lại tự hóa, ‘bức tường’ bị thủng nên dòng chảy thoát đi – kiếm bao nhiêu tiêu bấy nhiêu.",
   "de": "Mặt tốt: bạn có xu hướng kiếm được ở {A}. Mặt xấu: có được rồi chi ra gần hết, kiếm bao nhiêu tiêu bấy nhiêu."
  },
  "nhapKho": {
   "ten": "Nhập khố Kỵ",
   "ky": "Nhập khố Kỵ (Kỵ vào kho): Hóa Kỵ năm sinh ngồi ở một trong bốn cung mộ Thìn, Tuất, Sửu, Mùi (bốn ‘kho’ theo ngũ hành) và cung đó không tự hóa, ở đây là {A}; chủ giữ của, cần mẫn, kèm ý ‘khiếm trái’ (thấy mình mắc nợ, phải đáp đền) với mảng này.",
   "de": "Mặt tốt: bạn có xu hướng chắt chiu, cần mẫn, giữ của tốt ở {A}. Mặt xấu: luôn mang cảm giác mắc nợ, phải đáp đền với {A}, khó thảnh thơi."
  },
  "tietKho": {
   "ten": "Tiết khố Kỵ",
   "ky": "Tiết khố Kỵ (kho rò): như Nhập khố Kỵ ở {A} nhưng cung đó có tự hóa, kho bị ‘rò’ nên của gom được khó giữ.",
   "de": "Mặt tốt: bạn có xu hướng chăm vun vén {A}. Mặt xấu: thứ gom được lại dễ rò rỉ, khó giữ."
  },
  "sachMa": {
   "ten": "Sách mã Kỵ (Tứ mã Kỵ)",
   "ky": "Sách mã Kỵ hay Tứ mã Kỵ: Hóa Kỵ năm sinh ngồi ở Dần, Thân, Tị, Hợi – bốn cung ‘ngựa’ tượng di chuyển, ở đây là {A}; chủ bôn ba, với mảng này thì gặp ít xa nhiều, gần lâu dễ va chạm.",
   "de": "Mặt tốt: bạn có xu hướng năng động, hay di chuyển. Mặt xấu: với {A} thì gặp ít xa nhiều, gần lâu dễ va chạm."
  },
  "tuanHoan": {
   "ten": "Tuần hoàn Kỵ",
   "ky": "Tuần hoàn Kỵ (Kỵ đi rồi Kỵ về): {A} phi Hóa Kỵ nhập {B} và {B} phi Hóa Kỵ ngược về {A}; quan hệ có qua có lại, mình đối đãi thế nào thì bên kia đáp lại như thế.",
   "de": "Mặt tốt: bạn có xu hướng có quan hệ có qua có lại giữa {A} và {B}, đối tốt thì được đáp tốt. Mặt xấu: đối xấu thì cũng nhận lại xấu, va chạm dễ thành vòng lặp."
  },
  "thiPhi": {
   "ten": "Thị phi Kỵ",
   "ky": "Thị phi Kỵ (Lộc đi, Kỵ về): {A} phi Hóa Lộc nhập {B}, còn {B} phi Hóa Kỵ trở về {A}, hai cung không đối nhau; một bên cho đi mà chưa được đáp lại tương xứng nên dễ sinh than phiền.",
   "de": "Mặt tốt: bạn có xu hướng dành nhiều thiện ý từ {A} cho {B}. Mặt xấu: chưa được đáp lại tương xứng, dễ hụt hẫng, than phiền và sinh tranh chấp."
  },
  "cuTrien": {
   "ten": "Củ triền Kỵ",
   "ky": "Củ triền Kỵ (Kỵ quấn nhau, còn gọi hỗ xung Kỵ): hai Hóa Kỵ do hai cung khác nhau phát ra rơi vào hai đầu trục {A} – {B} nên xung lẫn nhau; chủ dây dưa, giằng co quanh việc của trục này.",
   "de": "Mặt tốt: bạn có xu hướng rất để tâm tới cả {A} lẫn {B}. Mặt xấu: hai mảng giằng co, dây dưa, việc này kéo việc kia, khó dứt điểm."
  },
  "oanThan": {
   "ten": "Oán thán Kỵ",
   "ky": "Oán thán Kỵ: Củ triền Kỵ nằm trên trục Phu Thê – Quan Lộc, hai người dễ bất đồng kéo dài khi chuyện nhà lẫn với chuyện làm; đây là tượng cần học cách đối thoại, không phải lời đoán kết cục.",
   "de": "Mặt tốt: bạn và người bạn đời có xu hướng cùng gắn bó với nhau và với công việc. Mặt xấu: hay bất đồng kéo dài, nhất là khi chuyện làm lẫn vào chuyện nhà."
  },
  "songKy": {
   "ten": "Song Kỵ",
   "ky": "Song Kỵ (hai Kỵ chồng nhau): hai Hóa Kỵ khác nguồn (năm sinh, phi hóa, vận) cùng rơi vào {A} hoặc vào hai đầu trục đối của nó; một Kỵ là để tâm bình thường, hai Kỵ là đã quá mức, cần sắp xếp lại.",
   "de": "Mặt tốt: bạn có xu hướng rất tận tâm với {A}. Mặt xấu: tâm sức dồn vào {A} đã quá mức, dễ quá tải và hao tổn."
  },
  "locVaoNgaKyRaTha": {
   "ten": "Lộc vào mình, Kỵ ra người",
   "ky": "Lộc tùy Kỵ tẩu (Lộc đi theo Kỵ): Hóa Lộc rơi vào ngã cung (mảng của mình) là {A}, nhưng can của cung đó chuyển Kỵ sang tha cung (mảng của người khác) là {B}; cái lợi dễ chỉ là lợi tạm, về sau có thể chảy sang người khác.",
   "de": "Mặt tốt: bạn có xu hướng có được cái lợi ở {A}. Mặt xấu: cái lợi dễ chỉ là tạm, về sau chảy sang {B}."
  },
  "locVaoThaKyVeNga": {
   "ten": "Lộc vào người, Kỵ về mình",
   "ky": "Hóa Lộc rơi vào tha cung (mảng của người khác) là {A}, rồi can của cung đó chuyển Kỵ về ngã cung (mảng của mình) là {B}; khổ trước ngọt sau, cuối cùng phần được thuộc về mình.",
   "de": "Mặt tốt: bạn có xu hướng về sau thu được phần thành quả ở {B}. Mặt xấu: trước phải bỏ công với {A} khá lâu mà chưa thấy gì."
  },
  "kyNhapTamHop": {
   "ten": "Kỵ nhập tam hợp",
   "ky": "Kỵ nhập tam hợp: Hóa Kỵ (nhất là của vận) rơi vào tam hợp Mệnh – Tài Bạch – Quan Lộc gốc (ba trụ chính: bản thân, tiền bạc, công việc), ở đây là {A}; chủ thu giữ, bận rộn, không thành tổn thất lớn.",
   "de": "Mặt tốt: bạn có xu hướng bận rộn có thu về ở {A} trong giai đoạn này. Mặt xấu: bận nhiều, áp lực, dễ quá tải."
  },
  "kyXungTamHop": {
   "ten": "Kỵ xung tam hợp",
   "ky": "Kỵ xung tam hợp (Kỵ xuất): Hóa Kỵ rơi vào cung đối diện của tam hợp Mệnh – Tài Bạch – Quan Lộc (tức Thiên Di, Phúc Đức, Phu Thê) nên xung thẳng vào {A}; chủ hao tổn, nặng nhẹ tùy cung bị xung.",
   "de": "Mặt tốt: bạn có xu hướng thấy rõ mảng nào cần giữ trong giai đoạn này. Mặt xấu: {A} bị kéo căng và dễ hao hụt, nặng nhẹ tùy mảng."
  },
  "phanCung": {
   "ten": "Phản cung Kỵ",
   "ky": "Phản cung Kỵ (hồi lực Kỵ – lực bật ngược như boomerang): vận đi vào tam hợp Mệnh – Tài Bạch – Quan Lộc gốc, rồi Mệnh của vận phi Hóa Kỵ vào cung đối diện của tam hợp gốc, xung ngược chính mình; sức nặng ngang Song Kỵ, nên giữ thế thủ.",
   "de": "Mặt tốt: bạn có xu hướng biết trước giai đoạn cần giữ thế thủ. Mặt xấu: những nỗ lực mở rộng dễ quay lại thành gánh nặng cho chính mình, sức nặng khá lớn."
  },
  "trungDiepCat": {
   "ten": "Trùng điệp cát",
   "ky": "Trùng điệp cát (tốt chồng tốt): Hóa Lộc hoặc Hóa Quyền của vận rơi đúng chỗ đã có Lộc, Quyền năm sinh ở {A} (Lộc gặp Lộc, Lộc gặp Quyền), tăng thuận lợi; Lộc của vận vào chỗ có Kỵ năm sinh còn có thể làm dịu Kỵ.",
   "de": "Mặt tốt: bạn có xu hướng gặp nhiều thuận lợi cộng dồn ở {A} trong giai đoạn này. Mặt xấu: thuận nhiều dễ chủ quan, mở rộng quá sức."
  },
  "trungDiepKy": {
   "ten": "Trùng điệp Kỵ",
   "ky": "Trùng điệp Kỵ: Hóa Kỵ của vận chồng lên Hóa Kỵ năm sinh, hoặc gặp Hóa Lộc ở {A} (Lộc Kỵ chiến khắc – điều tốt và điều vướng giằng co nhau); lo toan tăng lên ở mảng này.",
   "de": "Mặt tốt: bạn có xu hướng để tâm nhiều tới {A} trong giai đoạn này. Mặt xấu: lo toan về {A} dồn lên, cái tốt và cái vướng giằng co nhau."
  }
 },
 "dvLoc": {
  "Mệnh": {
   "ky": "Hóa Lộc của vận rơi vào Mệnh gốc: duyên và cơ hội của giai đoạn đổ về bản thân, tinh thần cởi mở, dễ được giúp.",
   "de": "Mặt tốt: bạn có xu hướng thấy mình cởi mở, nhiều cơ hội, được ủng hộ trong giai đoạn này. Mặt xấu: nhiều cơ hội dễ ôm đồm, tản sức."
  },
  "Huynh Đệ": {
   "ky": "Hóa Lộc của vận rơi vào Huynh Đệ gốc (anh chị em, bạn đồng trang lứa, đồng thời là ‘kho nhỏ’ của tiền bạc): có duyên với người thân, tích góp nhỏ thuận.",
   "de": "Mặt tốt: bạn có xu hướng gần anh chị em, bạn cùng lứa hơn và tích góp được khoản nhỏ trong giai đoạn này. Mặt xấu: tiền nhỏ dễ bị người thân hỏi mượn."
  },
  "Phu Thê": {
   "ky": "Hóa Lộc của vận rơi vào Phu Thê gốc: tình cảm, hôn nhân có duyên, dễ gặp người hợp ý.",
   "de": "Mặt tốt: bạn có xu hướng thuận tình cảm, hôn nhân, dễ gặp người hợp ý trong giai đoạn này. Mặt xấu: duyên nhiều dễ sinh rung động ngoài luồng."
  },
  "Tử Tức": {
   "ky": "Hóa Lộc của vận rơi vào Tử Tức gốc: vui với con cái, người nhỏ tuổi; có duyên hợp tác.",
   "de": "Mặt tốt: bạn có xu hướng vui với con cái, người nhỏ tuổi và có duyên hợp tác trong giai đoạn này. Mặt xấu: chi tiêu cho con và cho việc chung dễ tăng."
  },
  "Tài Bạch": {
   "ky": "Hóa Lộc của vận rơi vào Tài Bạch gốc: dòng tiền thuận, cơ hội kiếm tiền tốt.",
   "de": "Mặt tốt: bạn có xu hướng thuận dòng tiền, có cơ hội kiếm tiền tốt trong giai đoạn này. Mặt xấu: tiền dễ vào thì cũng dễ tiêu."
  },
  "Tật Ách": {
   "ky": "Hóa Lộc của vận rơi vào Tật Ách gốc: thể lực, nhịp sống và môi trường quanh mình dễ chịu.",
   "de": "Mặt tốt: bạn có xu hướng có thể lực, nhịp sống dễ chịu trong giai đoạn này. Mặt xấu: dễ ham hưởng thụ, lười vận động."
  },
  "Thiên Di": {
   "ky": "Hóa Lộc của vận rơi vào Thiên Di gốc: ra ngoài gặp thời, đi xa, mở rộng giao thiệp đều có duyên.",
   "de": "Mặt tốt: bạn có xu hướng ra ngoài gặp thời, đi xa, mở rộng giao thiệp thuận trong giai đoạn này. Mặt xấu: đi nhiều thì tốn kém, việc nhà bị lơ."
  },
  "Nô Bộc": {
   "ky": "Hóa Lộc của vận rơi vào Nô Bộc gốc: bạn bè, đồng nghiệp, khách hàng ủng hộ; làm việc nhóm thuận.",
   "de": "Mặt tốt: bạn có xu hướng được bạn bè, đồng nghiệp, khách hàng ủng hộ trong giai đoạn này. Mặt xấu: dựa vào người khác nhiều thì dễ thụ động."
  },
  "Quan Lộc": {
   "ky": "Hóa Lộc của vận rơi vào Quan Lộc gốc: công việc có duyên, dễ có dự án hoặc vị trí mới.",
   "de": "Mặt tốt: bạn có xu hướng thuận công việc, dễ có dự án hoặc vị trí mới trong giai đoạn này. Mặt xấu: nhận nhiều việc dễ quá tải."
  },
  "Điền Trạch": {
   "ky": "Hóa Lộc của vận rơi vào Điền Trạch gốc: gia đình ấm áp, thuận việc nhà cửa, có chỗ tích lũy.",
   "de": "Mặt tốt: bạn có xu hướng có gia đình ấm áp, thuận nhà cửa, có chỗ tích lũy trong giai đoạn này. Mặt xấu: dễ chi nhiều cho nhà."
  },
  "Phúc Đức": {
   "ky": "Hóa Lộc của vận rơi vào Phúc Đức gốc: tâm an, vui với sở thích, đời sống tinh thần phong phú.",
   "de": "Mặt tốt: bạn có xu hướng tâm an, vui với sở thích trong giai đoạn này. Mặt xấu: dễ ham vui mà lơ việc."
  },
  "Phụ Mẫu": {
   "ky": "Hóa Lộc của vận rơi vào Phụ Mẫu gốc: được người trên nâng đỡ, học hành và giấy tờ thuận.",
   "de": "Mặt tốt: bạn có xu hướng được người trên nâng đỡ, học hành, giấy tờ thuận trong giai đoạn này. Mặt xấu: dựa vào người trên thì dễ bị động."
  }
 },
 "dvKy": {
  "Mệnh": {
   "ky": "Hóa Kỵ của vận rơi vào Mệnh gốc: giai đoạn tự đặt nhiều trách nhiệm lên mình, để tâm và bỏ công nhiều; Kỵ nhập Mệnh thuộc dạng Kỵ nhập tam hợp, chủ bận rộn chứ không thành tổn thất lớn.",
   "de": "Mặt tốt: bạn có xu hướng có trách nhiệm, bận rộn có thu về trong giai đoạn này. Mặt xấu: tự đặt quá nhiều áp lực lên mình, dễ mệt và căng thẳng."
  },
  "Huynh Đệ": {
   "ky": "Hóa Kỵ của vận rơi vào Huynh Đệ gốc: để tâm tới anh chị em, bạn đồng trang lứa; ‘kho nhỏ’ tiền bạc phải bỏ công, chi dễ vượt dự tính.",
   "de": "Mặt tốt: bạn có xu hướng để tâm tới anh chị em, bạn cùng lứa trong giai đoạn này. Mặt xấu: phải lo nhiều cho họ, khoản tích góp tốn công và chi dễ vượt dự tính."
  },
  "Phu Thê": {
   "ky": "Hóa Kỵ của vận rơi vào Phu Thê gốc: để tâm nhiều tới chuyện tình cảm, hôn nhân; đồng thời xung Quan Lộc gốc nên công việc cũng dễ bị kéo theo.",
   "de": "Mặt tốt: bạn có xu hướng để tâm nhiều tới tình cảm, hôn nhân trong giai đoạn này. Mặt xấu: chuyện lứa đôi dễ thành áp lực, kéo theo công việc bị ảnh hưởng."
  },
  "Tử Tức": {
   "ky": "Hóa Kỵ của vận rơi vào Tử Tức gốc: bận lòng vì con cái, người nhỏ tuổi hoặc việc hợp tác; đồng thời xung Điền Trạch gốc nên chuyện nhà cũng cần giữ.",
   "de": "Mặt tốt: bạn có xu hướng sát sao với con cái, người nhỏ tuổi, việc hợp tác trong giai đoạn này. Mặt xấu: bận lòng nhiều, chuyện nhà cửa cũng dễ xáo trộn theo."
  },
  "Tài Bạch": {
   "ky": "Hóa Kỵ của vận rơi vào Tài Bạch gốc: để tâm nhiều tới tiền, phải bỏ công mới có thu; thuộc dạng Kỵ nhập tam hợp, chủ bận rộn vì tiền hơn là hao lớn.",
   "de": "Mặt tốt: bạn có xu hướng chuyên tâm kiếm tiền, bận rộn vì tiền hơn là hao lớn trong giai đoạn này. Mặt xấu: phải bỏ nhiều công mới có thu, dễ căng thẳng vì tiền."
  },
  "Tật Ách": {
   "ky": "Hóa Kỵ của vận rơi vào Tật Ách gốc: bận rộn, dễ làm quá sức, nhịp sống cần được giữ.",
   "de": "Mặt tốt: bạn có xu hướng siêng năng, bận rộn trong giai đoạn này. Mặt xấu: dễ làm quá sức, nhịp sống đảo lộn, sức khỏe sa sút; bệnh cũ dễ tái, dễ mắc đau dạ dày, mất ngủ, huyết áp. Gợi ý: có dấu hiệu lạ thì đi khám, hỏi bác sĩ."
  },
  "Thiên Di": {
   "ky": "Hóa Kỵ của vận rơi vào Thiên Di gốc: bôn ba, ra ngoài nhiều mà không phải lúc nào cũng thuận; đồng thời xung Mệnh gốc nên cần giữ thế thủ.",
   "de": "Mặt tốt: bạn có xu hướng chịu bôn ba, ra ngoài nhiều trong giai đoạn này. Mặt xấu: ra ngoài không phải lúc nào cũng thuận, bản thân chịu sức ép."
  },
  "Nô Bộc": {
   "ky": "Hóa Kỵ của vận rơi vào Nô Bộc gốc: bị cuốn vào chuyện bạn bè, đồng nghiệp; đồng thời xung Huynh Đệ gốc nên cẩn thận tiền tích góp.",
   "de": "Mặt tốt: bạn có xu hướng tận tình với bạn bè, đồng nghiệp trong giai đoạn này. Mặt xấu: bị cuốn vào chuyện của họ, tiền tích góp dễ hao."
  },
  "Quan Lộc": {
   "ky": "Hóa Kỵ của vận rơi vào Quan Lộc gốc: dồn sức cho công việc, trách nhiệm nặng; thuộc dạng Kỵ nhập tam hợp, chủ bận rộn có thu về.",
   "de": "Mặt tốt: bạn có xu hướng dồn sức cho công việc, bận rộn có thu về trong giai đoạn này. Mặt xấu: trách nhiệm nặng, dễ căng thẳng và lơ gia đình."
  },
  "Điền Trạch": {
   "ky": "Hóa Kỵ của vận rơi vào Điền Trạch gốc: lo nhiều việc nhà cửa, gia đình; Kỵ vào ‘kho’ cũng có ý thu giữ, tích lại.",
   "de": "Mặt tốt: bạn có xu hướng thu giữ, tích lại được trong nhà trong giai đoạn này. Mặt xấu: phải lo nhiều việc nhà cửa, gia đình, khá tốn sức."
  },
  "Phúc Đức": {
   "ky": "Hóa Kỵ của vận rơi vào Phúc Đức gốc: suy nghĩ nhiều, khó thảnh thơi; đồng thời xung Tài Bạch gốc nên chi tiêu cần giữ.",
   "de": "Mặt tốt: bạn có xu hướng suy nghĩ sâu trong giai đoạn này. Mặt xấu: khó thảnh thơi, lo nghĩ nhiều, chi tiêu theo cảm xúc dễ hụt."
  },
  "Phụ Mẫu": {
   "ky": "Hóa Kỵ của vận rơi vào Phụ Mẫu gốc: để tâm tới cha mẹ, người trên và giấy tờ, hợp đồng.",
   "de": "Mặt tốt: bạn có xu hướng để tâm tới cha mẹ, người trên trong giai đoạn này. Mặt xấu: giấy tờ, hợp đồng dễ vướng, chuyện cha mẹ cần lo."
  }
 },
 "dvKyXung": {
  "Mệnh": {
   "ky": "Hóa Kỵ của vận rơi vào Thiên Di gốc, xung Mệnh gốc (Kỵ xung tam hợp): bản thân chịu sức ép, dễ mệt và dao động; giai đoạn nên giữ thế thủ.",
   "de": "Mặt tốt: bạn có xu hướng biết trước giai đoạn cần giữ thế thủ. Mặt xấu: bản thân chịu sức ép, dễ mệt và dao động."
  },
  "Huynh Đệ": {
   "ky": "Hóa Kỵ của vận rơi vào Nô Bộc gốc, xung Huynh Đệ gốc: ‘kho nhỏ’ tiền bạc dễ hao, quan hệ anh chị em kém gắn kết.",
   "de": "Mặt tốt: bạn có xu hướng thấy rõ khoản nào cần giữ trong giai đoạn này. Mặt xấu: khoản tích góp nhỏ dễ hao, quan hệ với anh chị em kém gắn kết."
  },
  "Phu Thê": {
   "ky": "Hóa Kỵ của vận rơi vào Quan Lộc gốc, xung Phu Thê gốc: công việc chiếm nhiều sức nên ít thời gian và kiên nhẫn cho người phối ngẫu.",
   "de": "Mặt tốt: bạn có xu hướng dồn sức cho công việc trong giai đoạn này. Mặt xấu: ít thời gian và kiên nhẫn cho người bạn đời, tình cảm dễ nguội."
  },
  "Tử Tức": {
   "ky": "Hóa Kỵ của vận rơi vào Điền Trạch gốc, xung Tử Tức gốc: ít thời gian cho con cái, việc hợp tác dễ chững lại.",
   "de": "Mặt tốt: bạn có xu hướng lo nhiều cho nhà cửa trong giai đoạn này. Mặt xấu: ít thời gian cho con cái, việc hợp tác dễ chững lại."
  },
  "Tài Bạch": {
   "ky": "Hóa Kỵ của vận rơi vào Phúc Đức gốc, xung Tài Bạch gốc (Kỵ xung tam hợp): chi ngoài dự tính, tiền khó giữ.",
   "de": "Mặt tốt: bạn có xu hướng biết trước giai đoạn cần giữ tiền. Mặt xấu: chi ngoài dự tính, tiền khó giữ."
  },
  "Tật Ách": {
   "ky": "Hóa Kỵ của vận rơi vào Phụ Mẫu gốc, xung Tật Ách gốc: nhịp sống xáo trộn, dễ mỏi mệt; nên giữ nếp sinh hoạt an toàn, điều độ.",
   "de": "Mặt tốt: bạn có xu hướng biết trước giai đoạn cần giữ sức. Mặt xấu: nhịp sống xáo trộn, dễ mỏi mệt, suy nhược, mất ngủ. Gợi ý: có dấu hiệu lạ thì đi khám, hỏi bác sĩ."
  },
  "Thiên Di": {
   "ky": "Hóa Kỵ của vận rơi vào Mệnh gốc, xung Thiên Di gốc: ngại ra ngoài, các chuyến đi và cuộc gặp dễ trục trặc.",
   "de": "Mặt tốt: bạn có xu hướng tập trung vào bản thân trong giai đoạn này. Mặt xấu: ngại ra ngoài, các chuyến đi và cuộc gặp dễ trục trặc."
  },
  "Nô Bộc": {
   "ky": "Hóa Kỵ của vận rơi vào Huynh Đệ gốc, xung Nô Bộc gốc: quan hệ bạn bè, đồng nghiệp lỏng lẻo hoặc dễ hiểu lầm.",
   "de": "Mặt tốt: bạn có xu hướng gần anh em hơn trong giai đoạn này. Mặt xấu: quan hệ bạn bè, đồng nghiệp lỏng lẻo, dễ hiểu lầm."
  },
  "Quan Lộc": {
   "ky": "Hóa Kỵ của vận rơi vào Phu Thê gốc, xung Quan Lộc gốc (Kỵ xung tam hợp): công việc gặp trở ngại hoặc thay đổi; nên giữ vững vị trí.",
   "de": "Mặt tốt: bạn có xu hướng biết trước giai đoạn cần giữ vị trí. Mặt xấu: công việc gặp trở ngại hoặc thay đổi ngoài ý muốn."
  },
  "Điền Trạch": {
   "ky": "Hóa Kỵ của vận rơi vào Tử Tức gốc, xung Điền Trạch gốc: ‘kho’ bị lay, chuyện nhà cửa và của để dành xáo trộn.",
   "de": "Mặt tốt: bạn có xu hướng để tâm tới con cái, hợp tác trong giai đoạn này. Mặt xấu: nhà cửa và của để dành bị xáo trộn, dễ hao."
  },
  "Phúc Đức": {
   "ky": "Hóa Kỵ của vận rơi vào Tài Bạch gốc, xung Phúc Đức gốc: lo chuyện tiền nên khó thảnh thơi, ít thời gian cho bản thân.",
   "de": "Mặt tốt: bạn có xu hướng chuyên tâm chuyện tiền trong giai đoạn này. Mặt xấu: lo tiền nên khó thảnh thơi, ít thời gian cho bản thân."
  },
  "Phụ Mẫu": {
   "ky": "Hóa Kỵ của vận rơi vào Tật Ách gốc, xung Phụ Mẫu gốc: giấy tờ, quan hệ với người trên dễ vướng, ít thời gian cho cha mẹ.",
   "de": "Mặt tốt: bạn có xu hướng để tâm tới sức khỏe, nhịp sống trong giai đoạn này. Mặt xấu: giấy tờ, quan hệ với người trên dễ vướng, ít thời gian cho cha mẹ."
  }
 }
};

var PT_NGUON = [
 {
  "ten": "Lương Nhược Du – Phi Tinh Tử Vi Đẩu Số: 02",
  "url": "https://www.transtar-csft-liang.url.tw/hot_117577.html"
 },
 {
  "ten": "Lương Nhược Du",
  "url": "https://www.transtar-csft-liang.url.tw/hot_119411.html"
 },
 {
  "ten": "Lương Nhược Du",
  "url": "https://www.transtar-csft-liang.url.tw/hot_118673.html"
 },
 {
  "ten": "Lương Nhược Du",
  "url": "https://www.transtar-csft-liang.url.tw/hot_117791.html"
 },
 {
  "ten": "Trương Thế Hiền trên site Lương Nhược Du – (X/12, /12)",
  "url": "https://www.transtar-csft-liang.url.tw/hot_cg15066.html"
 },
 {
  "ten": "(dẫn Hứa Thuyên Nhân )",
  "url": "http://www.ziweicn.com/ziweibaike/4181.html"
 },
 {
  "ten": "(blog Sina)",
  "url": "https://blog.sina.com.cn/s/blog_133e591180102z53t.html"
 },
 {
  "ten": "ziwei.ist",
  "url": "https://ziwei.ist/learn/flying-stars"
 },
 {
  "ten": "108s.tw",
  "url": "https://www.108s.tw/article/info/45"
 },
 {
  "ten": "Threads @yxchen030 – (bảng can năm → chi)",
  "url": "https://www.threads.com/@yxchen030/post/C_xZdnKPZ4x"
 },
 {
  "ten": "(chỉ đọc qua kết quả tìm kiếm)",
  "url": "https://www.ziweitai.com/detail/8960"
 },
 {
  "ten": "",
  "url": "https://www.ziweicn.com/yiyuxinshu/baijiazatan/3868.html"
 },
 {
  "ten": "qqqtseng pixnet",
  "url": "https://qqqtseng.pixnet.net/blog/posts/9275425958"
 },
 {
  "ten": "",
  "url": "https://www.chinazwds.com/Home/ArticleDetails/7d3c35e43444489e8f3df6bb90a2ec50"
 },
 {
  "ten": "pixnet – (12 loại)",
  "url": "https://dyhnodsntbimhi.pixnet.net/blog/posts/7038142413"
 },
 {
  "ten": "jordanwwj pixnet – 09 (các điều đánh số)",
  "url": "https://jordanwwj.pixnet.net/blog/posts/10355545730"
 },
 {
  "ten": "(ghi theo )",
  "url": "https://www.ziweicn.com/show/3255.html"
 },
 {
  "ten": "",
  "url": "https://www.ziweitai.com/detail/8155"
 },
 {
  "ten": "jessietalk",
  "url": "https://jessietalk.com/2groupsindziwei/"
 },
 {
  "ten": "khamthientuhoa.com – Giới thiệu cơ bản về Tứ Hóa Phi Tinh và các cấp độ Tứ Hóa",
  "url": "https://khamthientuhoa.com/gioi-thieu-co-ban-ve-tu-hoa-phi-tinh-va-cac-cap-do-tu-hoa-trong-tu-vi-bac-phai/"
 },
 {
  "ten": "khamthientuhoa.com – Thể và Dụng, Đại Thái Cực, Tiểu Thái Cực",
  "url": "https://khamthientuhoa.com/khai-niem-the-va-dung-dai-thai-cuc-tieu-thai-cuc-trong-luan-giai-tu-vi-kham-thien-tu-hoa/"
 },
 {
  "ten": "hoc.kabala.vn – Bài sưu tầm các môn phái Tử Vi",
  "url": "https://hoc.kabala.vn/bai-suu-tam-cac-mon-phai-tu-vi/"
 },
 {
  "ten": "thayungkhiem.vn – Tổng quan các trường phái Tử Vi",
  "url": "https://thayungkhiem.vn/phai-tu-vi-tong-quan"
 },
 {
  "ten": "tradiculture",
  "url": "https://tradiculture.com/ziweisihuabiaowanzhengjiexi/"
 },
 {
  "ten": "qqqtseng pixnet",
  "url": "https://qqqtseng.pixnet.net/blog/posts/9292852613"
 },
 {
  "ten": "tuvi.cohoc.net – bài luận mẫu 'Bắc phái' (lá số riêng của chủ dự án; chỉ dùng để học cấu trúc & kiểm thuật toán)",
  "url": "https://tuvi.cohoc.net/ (trang luận Bắc phái)"
 },
 {
  "ten": "vocus",
  "url": "https://vocus.cc/article/69f2ccd8fd89780001782d08"
 },
 {
  "ten": "HackMD",
  "url": "https://hackmd.io/@2MOUppXTRLeCjH-jrb27NQ/HJnRgZ1T-e"
 },
 {
  "ten": "matphuoctu.com – Lập lá số Tử Vi Bắc phái (cách đọc nhãn 'Lộc Tài')",
  "url": "https://matphuoctu.com/tu-vi-bac-phai/"
 },
 {
  "ten": "blog udn bonniewu2 – (trang trả 403, chỉ đọc được đoạn trích trong kết quả tìm kiếm)",
  "url": "https://blog.udn.com/bonniewu2/5553074"
 }
];

/** Kho luận giải Bắc phái tổng hợp (nghien-cuu/phi-tinh/tong-hop/catalog.json, viết lại bằng lời mới): khóa -> [[nguồn, chuyên môn, dễ hiểu, cat|hung|trung]] */
var PT_KHO = {"xiHoa|duong":[["Kinh nghiệm cao thủ Bắc phái","Điểm xí hoa tổng dương: số lượng sao hỉ thần và cung khí tốt nhiều hơn, lá số được chấm tương đối khá.","Mặt tốt: bạn thuộc mẫu người có nền khá vững, nhiều mặt trong đời tự chạy thuận mà không phải gồng. Mặt xấu: chính sự thuận ấy dễ làm bạn chủ quan, ỷ vào may mắn và bỏ bê những mặt còn yếu cho tới lúc chúng thành chuyện.","cat"]],
"xiHoa|am":[["Kinh nghiệm cao thủ Bắc phái","Điểm xí hoa tổng âm: sao kỵ thần và cung khí hung chiếm ưu thế; cohoc khuyên đọc kỹ từng cung để tìm cách ứng xử.","Mặt tốt: bạn thuộc mẫu người tự gây dựng, chịu được khó và hiểu rõ giá trị của những gì mình làm ra. Mặt xấu: lá số nghiêng về phía bất lợi, ít được thuận buồm xuôi gió, nhiều việc phải làm gấp đôi người khác mới bằng và dễ thiệt nếu chọn sai thời điểm. Gợi ý: đọc kỹ từng mảng để biết chỗ nào nên giữ thế thủ.","trung"]],
"laiNhan|Thiên Di":[["Huy Hà Phan","Lai nhân cung tại Thiên Di: nhân duyên đời này đặt ở giao tiếp và đi xa; năng lực quyết định tầm 'xa' mà đương số vươn tới.","Mặt tốt: bạn có xu hướng tìm thấy cơ hội lớn nhất khi ra ngoài, giao tiếp rộng hoặc đi xa; càng mở rộng quan hệ càng vươn xa. Mặt xấu: ở yên một chỗ thì bạn dễ bị bó hẹp, thiếu động lực, và thành bại phụ thuộc nhiều vào môi trường bên ngoài mà mình không kiểm soát được.","cat"],["Lai Nhân Cung 144 quyết","Lai nhân thuộc tam hợp Phu–Di–Phúc, gắn với phúc phận; vận may đến từ việc đi xa và các mối giao thiệp ngoài xã hội.","Mặt tốt: bạn thuộc mẫu người gặp may khi đi xa và khi gặp người mới, vận tốt thường đến từ các mối giao thiệp bên ngoài. Mặt xấu: phúc phận gắn với bên ngoài nên khi quan hệ xã hội đổ vỡ hay mất uy tín, vận của bạn đi xuống rõ và khó tự gỡ một mình.","cat"]],
"laiNhan|Phu Thê":[["Lai Nhân Cung 144 quyết","Lai nhân tại Phu Thê: đời sống dựa nhiều vào người phối ngẫu, hôn nhân ảnh hưởng lớn đến cả cuộc đời; Phu–Di–Phúc là tam hợp liên quan phúc báo.","Mặt tốt: bạn có xu hướng được người bạn đời nâng đỡ, hôn nhân tốt thì cả đời được nhờ. Mặt xấu: đời sống dựa nhiều vào người kia nên chọn sai người hay hôn nhân trục trặc thì gần như mọi mặt khác đều bị kéo xuống theo. Gợi ý: chọn người đồng hành thật tỉnh táo.","trung"]],
"laiNhan|Điền Trạch":[["Huy Hà Phan","Khi lai nhân đóng ở Điền Trạch, gia đình giữ vai trò then chốt và đương số nên dựa vào sự trợ giúp của người nhà.","Mặt tốt: bạn thuộc mẫu người lấy gia đình làm chỗ dựa, được người nhà giúp vào lúc then chốt. Mặt xấu: bạn dễ phụ thuộc vào gia đình, khó tự đứng vững khi người nhà không còn đỡ được hoặc khi trong nhà có chuyện.","cat"],["Lai Nhân Cung 144 quyết","Tổ đức và món nợ để lại của dòng họ (gieo – gặt của thế hệ trước) ảnh hưởng gia đình, tài sản.","Mặt tốt: bạn có xu hướng được hưởng phần tốt mà nếp nhà và thế hệ trước để lại. Mặt xấu: cái chưa hay của dòng họ (nợ nần, bất hòa, thói quen xấu) cũng dội xuống gia đình và tài sản của bạn, có khi phải gánh thay việc mình không gây ra.","trung"]],
"laiNhan|Tài Bạch":[["Huy Hà Phan","Lai nhân đóng Tài Bạch: cần nền tài chính vững bền; đầu tư chập chờn hay thu không bù công dễ tạo sức ép.","Mặt tốt: bạn có xu hướng coi trọng nền tài chính vững, biết lo xa về tiền. Mặt xấu: tiền là thước đo an toàn của bạn nên đầu tư chập chờn hay thu không bù công là bạn chịu sức ép nặng, dễ lo âu và mất ngủ vì tiền. Gợi ý: ưu tiên nguồn thu ổn định.","trung"],["Lai Nhân Cung 144 quyết","Chú trọng tự lập, quản lý tài chính, tối đa hóa của cải; có Hóa Lộc, Hóa Quyền hội thì động lực kiếm tiền càng mạnh.","Mặt tốt: bạn thuộc mẫu người tự lập về tiền bạc, có ý chí làm giàu và biết quản lý của cải. Mặt xấu: đời bạn dễ xoay quanh chuyện tiền, đo mọi thứ bằng tiền và dễ căng thẳng hay lạnh lùng với người thân khi tài chính không như ý.","cat"]],
"mau|Thuận thủy Kỵ":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Cung X phi Kỵ sang cung Y (không phải đối cung): khí của X tiết sang Y, X dồn tâm sức cho việc của Y. Đọc chủ đề Y để biết năng lượng chảy về đâu.","Mặt tốt: bạn có xu hướng dồn hết tâm sức cho một việc mình chọn, làm tới nơi tới chốn. Mặt xấu: sức lực chảy hết sang chỗ đó nên phần gốc của chính mình bị bỏ bê, nhiều khi cho đi nhiều mà không giữ lại được gì.","trung"]],
"mau|Nghịch thủy Kỵ":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Kỵ phi vào cung đang có Kỵ năm sinh cùng sao (ví dụ Tài Bạch phi Kỵ nhập Phúc Đức): được xem là có thể phát đạt nhờ sản xuất, kinh doanh hoặc quan hệ đối ngoại; tài có thể tích trữ mà sinh lợi.","Mặt tốt: bạn có xu hướng bám chặt một mục tiêu và kiên trì tới khi có kết quả; tiền bạc có thể tích lại và sinh lời nhờ làm ăn hay quan hệ bên ngoài. Mặt xấu: sự bám chặt ấy dễ thành cố chấp, không chịu buông khi việc đã sai hướng và có thể mất nhiều năm cho một hướng không đúng.","cat"]],
"mau|Tiết xuất Kỵ":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Cung phi Kỵ sang đối cung, tự xung cung mình: điều cung này đại diện khó giữ lâu bên mình (ví dụ Phu Thê phi Kỵ nhập Quan Lộc: người phối ngẫu ít ở cạnh, hôn nhân có biến trong vận).","Mặt tốt: bạn có xu hướng không bị trói buộc bởi điều mình nắm giữ, dễ buông và đi tiếp. Mặt xấu: điều quan trọng mà mảng này đại diện khó giữ lâu bên mình; ví dụ người bạn đời ít ở cạnh, hôn nhân dễ có biến.","hung"]],
"mau|Lưu xuất Kỵ":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Cung kho (Điền Trạch, Tài Bạch) phi Kỵ sang đối cung: của cải trong nhà chảy ra ngoài, không nên tích trữ khư khư mà nên cho tiền vận động có mục đích.","Mặt tốt: bạn có xu hướng không ôm giữ của cải khư khư, biết cho tiền vận động. Mặt xấu: của cải trong nhà dễ chảy ra ngoài, tích không được lâu, chi ra nhiều hơn dự tính. Gợi ý: cho tiền đi có mục đích rõ thay vì để nó tự trôi.","hung"]],
"mau|Tứ mã Kỵ":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Kỵ năm sinh hoặc tự hóa Kỵ ở Dần, Thân, Tị, Hợi: chủ bôn ba, xa cách, dễ xung đột với người của cung đó.","Mặt tốt: bạn có xu hướng năng động, chịu đi xa, chịu dịch chuyển để tìm cơ hội. Mặt xấu: đời nhiều bôn ba, xa cách, ít yên ổn một chỗ và dễ xung đột với những người thuộc mảng này.","trung"]],
"mau|Nhập khố Kỵ":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Hóa Kỵ năm sinh rơi vào tứ mộ khố (Thìn, Tuất, Sửu, Mùi) mà cung ấy không tự hóa: mang nghĩa 'mang nợ', túi rủng rỉnh hay không vẫn phải gắng kiếm; đồng thời là cách cục giữ của tốt.","Mặt tốt: bạn có xu hướng giữ của tốt, tích được tài sản về lâu dài. Mặt xấu: bạn luôn có cảm giác mang nợ, dù túi rủng rỉnh hay không vẫn phải gắng kiếm, khó thảnh thơi với chuyện tiền.","trung"]],
"mau|Tứ chính Kỵ":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Kỵ năm sinh ở Tý, Ngọ, Mão, Dậu: người hay khoa trương, có chút thành tựu là ai cũng biết.","Mặt tốt: bạn có xu hướng dễ được biết tới, làm được gì là có tiếng. Mặt xấu: bạn hay phô trương, thích khoa trương thành tích, dễ bị người khác nhìn là khoe và tự rước thị phi.","trung"]],
"mau|Củ triền Kỵ":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Hai cung khác nhau phi Kỵ vào hai đầu của cùng một trục đối (ví dụ một cung Kỵ nhập Phu Thê, cung khác Kỵ nhập Quan Lộc): trục đó bị giằng co. Với trục Phu–Quan: vợ chồng hay va chạm đến già nhưng chưa chắc chia tay.","Mặt tốt: bạn có xu hướng gắn bó lâu dài với vợ hoặc chồng, va chạm nhiều nhưng chưa chắc chia tay. Mặt xấu: hai mặt trong đời bị giằng co liên tục, với hôn nhân và công việc thì vợ chồng hay cãi vã, căng thẳng kéo dài tới già.","hung"],["Tiên thiên tứ hóa phi tinh kỳ phổ","Với trục Tử–Điền (Phu Thê và Nô Bộc cùng phi Kỵ vào): xung đột giữa chuyện con cái và chuyện nhà; với trục Tài–Phúc (Phụ Mẫu, Huynh Đệ phi Kỵ vào): xung đột giữa kiếm tiền và hưởng thụ.","Mặt tốt: bạn có xu hướng quan tâm cùng lúc nhiều mặt quan trọng của đời mình. Mặt xấu: các mặt ấy kéo nhau, ví dụ chuyện con cái va với chuyện nhà, hoặc chuyện kiếm tiền va với nhu cầu hưởng thụ, khiến bạn thường xuyên mệt vì phải chọn.","hung"]],
"mau|Thị phi Kỵ":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Cung X phi Kỵ sang Y trong khi Y phi Lộc (hoặc cát) sang X: quan hệ hai bên lệch, một bên quan tâm còn bên kia thờ ơ, dễ sinh tranh chấp vì cho mà không được đáp.","Mặt tốt: bạn có xu hướng hết lòng quan tâm một mối quan hệ. Mặt xấu: quan hệ ấy lệch, một bên lo còn bên kia thờ ơ, cho mà không được đáp nên dễ sinh tranh chấp và tổn thương.","hung"]],
"mau|Điệp xuất Lộc":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Cung phi Lộc sang đối cung vốn đã có Lộc năm sinh: Lộc chồng lên rồi chảy ra ngoài, dễ hao tổn; ở đại vận cohoc đọc là 'Lộc mất do không trân quý'.","Mặt tốt: bạn có xu hướng có nhiều duyên lành, cái lợi đến dồi dào. Mặt xấu: cái lợi chồng lên rồi chảy ra ngoài, dễ hao vì không trân quý, có rồi để mất.","trung"]],
"mau|Tiết xuất Lộc":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Cung phi Lộc sang đối cung (không chồng Lộc): cái lợi tự nguyện đưa ra ngoài, tượng hao tổn nhẹ do mình chủ động cho.","Mặt tốt: bạn có xu hướng rộng rãi, tự nguyện chia phần lợi của mình ra ngoài. Mặt xấu: mất mát nhỏ thường do chính mình chủ động cho, lâu dần thành hao hụt thật.","trung"]],
"mau|Đối trì Lộc":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Hai đầu một trục đối cùng có Lộc (một đầu có/nhận Lộc, đầu kia phi Lộc sang): Lộc giằng hai đầu, tăng thêm lợi cho cung đối diện (ví dụ Lộc vào Mệnh giúp thêm cho Thiên Di; Lộc vào Điền giúp thêm cho Tử; Tài – Phụ Mẫu đối trì làm tăng cát lợi).","Mặt tốt: bạn có xu hướng được lợi ở cả hai đầu của một mối quan hệ, cái tốt bên này giúp thêm cho bên kia. Mặt xấu: hai đầu dựa vào nhau nên khi một đầu trục trặc thì cái lợi của đầu kia cũng giảm theo.","cat"]],
"mau|Lộc Lộc trao đổi":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Hai cung phi Lộc cho nhau (ví dụ Mệnh phi Lộc nhập Quan Lộc và Quan Lộc phi Lộc nhập Mệnh): hai bên cùng có lợi, công việc và bản thân nuôi nhau.","Mặt tốt: bạn có xu hướng để bản thân và công việc nuôi nhau, hai bên cùng có lợi. Mặt xấu: bạn dễ đồng nhất mình với công việc, việc chững lại là tinh thần sa sút theo.","cat"]],
"mau|Song Lộc":[["Từ Tăng Sinh","Lộc Tồn gặp Hóa Lộc (Song lộc triều viên, Lộc hợp uyên ương) tại Mệnh: tài lộc dồi dào nếu tiết kiệm; xa xỉ, ỷ tiền mà kiêu thì dễ trắng tay.","Mặt tốt: bạn có xu hướng có tài lộc dồi dào nếu biết tiết kiệm. Mặt xấu: nếu xa xỉ, ỷ tiền mà kiêu thì dễ trắng tay, tiền nhiều cũng không giữ được.","cat"],["","Song Lộc ở Điền Trạch (Lộc và Quyền năm sinh cùng tọa): lợi nhiều hơn danh, hợp cả văn lẫn võ và kinh doanh.","Mặt tốt: bạn có xu hướng được lợi nhiều hơn danh, hợp cả việc văn, việc võ lẫn kinh doanh. Mặt xấu: lợi lớn mà danh nhỏ nên công sức của bạn ít được ghi nhận, và dễ thiên về tiền mà xem nhẹ uy tín.","cat"]],
"mau|Hư lộc":[["","Hóa Lộc của vận (năm, tháng) bay ra tha cung, không vào tam hợp Mệnh: 'Lộc xuất', kiếm được nhưng tiêu hết, trống rỗng; Quyền xuất, Khoa xuất cũng rỗng.","Mặt tốt: bạn có xu hướng vẫn kiếm được tiền, vẫn có việc, có tiếng trong giai đoạn này. Mặt xấu: kiếm được bao nhiêu tiêu hết bấy nhiêu, cái được bay ra ngoài nên cuối kỳ thấy trống rỗng.","trung"]],
"mau|Dương phi nhập Âm":[["","Cung dương phi Hóa vào cung âm: cộng hưởng mạnh, tác động rõ; dương nhập dương: cộng hưởng yếu. Dùng để chỉnh độ nặng nhẹ của một dòng phi hóa ở vận tháng.","Mặt tốt: bạn có xu hướng thấy một số tác động trong thời gian này rõ và mạnh, dễ nhận ra. Mặt xấu: tác động mạnh thì cái xấu đi kèm cũng rõ, khó che hay làm nhẹ đi.","trung"]],
"mau|Lộc gặp Kỵ":[["","Lộc của vận rơi đúng chỗ có Kỵ (năm sinh, đại vận hoặc năm): không ổn định, được rồi lại mất; cohoc khuyên không cho vay tiền, không gánh nợ thay người.","Mặt tốt: bạn có xu hướng vẫn có cái lợi đến trong giai đoạn này. Mặt xấu: lợi đến đúng chỗ đang trục trặc nên không ổn định, được rồi lại mất. Gợi ý: không cho vay tiền, không gánh nợ thay người.","hung"]],
"mau|Song Kỵ":[["Trung Châu","Hai Kỵ chồng nhau (Kỵ vận trùng Kỵ năm sinh, hoặc Lộc năm sinh trùng Kỵ vận): hung, dễ hao tổn, xung mạnh cung đối diện; nếu quy vị thì có thể thành tụ tài.","Mặt tốt: nếu cái được quay về đúng chỗ, bạn có thể gom được của. Mặt xấu: hai điều bất lợi chồng lên nhau, dễ hao tổn và ảnh hưởng mạnh tới mặt đối diện trong đời.","hung"]],
"mau|Tuyệt mệnh Kỵ":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Thiên Di hoặc Mệnh của đại vận phi Kỵ xung Mệnh (hoặc Quan Lộc) nguyên cục khi Mệnh gốc không có Kỵ năm sinh: dấu hiệu hung hiểm của vận, xem cung phát Kỵ để biết việc gì rủi ro.","Mặt tốt: bạn có xu hướng thấy được rõ nguồn rủi ro, vì nó đến từ một mảng cụ thể. Mặt xấu: đây là giai đoạn có dấu hiệu nguy hiểm thật, bản thân hoặc công việc dễ chịu đòn nặng. Gợi ý: xem kỹ mảng gây rủi ro để giữ thế thủ.","hung"]],
"mau|Phá thể":[["","Cung có Thiên Hình hoặc Thiên Riêu là 'vị trí phá thể'; đại vận tới cung đó thì có điều không lành.","Mặt tốt: bạn có xu hướng được báo trước giai đoạn nào cần cẩn thận. Mặt xấu: khi đi vào giai đoạn ấy thường có chuyện không lành, dễ vướng thị phi, tai nạn nhỏ hay chuyện tình cảm rắc rối.","hung"]],
"mau|Tự hóa li tâm":[["Cửu cửu bí nghi","Cung tự hóa ra ngoài, năng lượng của cung bị đẩy đi: ở Tài, Điền ảnh hưởng cách dùng tiền; ở Phúc, Tật ảnh hưởng tu dưỡng tâm tính; ở Tử ảnh hưởng chuyện tình cảm.","Mặt tốt: bạn có xu hướng không bị trói vào mảng này, dễ buông. Mặt xấu: năng lượng của mảng ấy bị đẩy ra ngoài, ảnh hưởng cách bạn giữ tiền, giữ tâm tính hoặc giữ tình cảm.","trung"]],
"than|Thiên Di":[["","Cung Thân đóng ở Thiên Di: môi trường sống thường đổi thay, chỗ ở và chỗ làm hay biến động, cả đời gắn với việc xa nhà.","Mặt tốt: bạn có xu hướng thích nghi giỏi, chịu đi xa và đổi môi trường để tìm cơ hội. Mặt xấu: chỗ ở, chỗ làm hay biến động, cả đời gắn với xa nhà nên khó có cảm giác yên ổn, gắn bó.","trung"]],
"than|Phúc Đức":[["Trung Châu","Cung Thân đóng ở Phúc Đức: biết tận hưởng đời sống, xem trọng luật nhân quả và phúc ấm do tổ tiên để lại.","Mặt tốt: bạn thuộc mẫu người biết tận hưởng đời sống, sống có nhân quả và được hưởng phúc từ gia đình. Mặt xấu: bạn dễ thiên về hưởng thụ, dựa vào phúc sẵn có mà ngại cố gắng thêm.","cat"]],
"than|Mệnh":[["Nguyễn Anh Vũ","Cung Thân đóng ở Mệnh: tự chủ, tự lập rất mạnh, ít bị ngoại cảnh chi phối; hay dở đều do chính mình quyết.","Mặt tốt: bạn thuộc mẫu người tự chủ, tự lập rất mạnh, ít bị ngoại cảnh chi phối. Mặt xấu: hay dở đều do một mình bạn quyết nên ít nghe ai, sai thì cũng tự gánh hết.","trung"]],
"sao|Hóa Kỵ|Thân":[["Phi tinh Trần Đoàn; Hồng Khánh; Trần Bỉnh Húc","Hóa Kỵ năm sinh nằm ở cung Thân: chủ việc gặp trở ngại, dễ vướng thị phi, khó được như ý; có cát tinh đắc địa đi kèm thì nhẹ bớt.","Mặt tốt: bạn có xu hướng trưởng thành nhanh qua trở ngại. Mặt xấu: nửa sau đời dễ gặp trở ngại, vướng điều tiếng và khó được như ý; có người tốt giúp thì nhẹ bớt nhưng không hết.","hung"]],
"cungKhi|*|daiCat":[["Sở Hoàng","Cung khí đại cát (nạp âm là hỉ thần): cát tinh trong cung phát huy hết sức; sao tài dù tốt vẫn phải có cung khí hòa hợp mới tạo được giàu có.","Mặt tốt: bạn có xu hướng có nền vững ở mảng này, điểm mạnh phát huy hết sức. Mặt xấu: được thuận lợi lâu dễ sinh chủ quan, nghĩ mọi chuyện tự đến.","cat"]],
"cungKhi|*|danXen":[["Sở Hoàng","Cung khí cát hung đan xen: kết quả tùy đại vận; đại vận mạnh thì vẫn thành.","Mặt tốt: bạn có xu hướng vẫn có thể thành công ở mảng này khi gặp giai đoạn mạnh. Mặt xấu: kết quả không chắc chắn, lên xuống theo từng giai đoạn mười năm, khó dự liệu.","trung"]],
"cungKhi|*|daiHung":[["Sở Hoàng","Cung khí đại hung (nạp âm thuộc kỵ thần): sao tốt cũng giảm lực; vẫn có thể thành nếu đại vận tốt, nhất là đại vận mạnh thời trẻ.","Mặt tốt: bạn có xu hướng vẫn thành được nếu gặp giai đoạn tốt, nhất là thời trẻ. Mặt xấu: nền ở mảng này yếu, điểm mạnh vốn có cũng giảm lực, phải gắng nhiều hơn người khác.","trung"]],
"cungKhiLuan|Tài Bạch":[["Sở Hoàng","Nhóm mỹ tài tinh (Lộc Tồn, Vũ Khúc, Hữu Bật, Tả Phụ) phải có cung khí đắc vị mới thành giàu; nếu cung khí đại hung nhưng đại vận lúc trẻ mạnh thì vẫn có thể làm giàu; muốn đoán tài sản thì xét cung khí, can chi cùng đại vận.","Mặt tốt: bạn có xu hướng vẫn có thể làm giàu nếu gặp giai đoạn mạnh thời trẻ. Mặt xấu: tài năng làm ra tiền chưa đủ, nền tiền bạc không chắc thì giàu cũng khó bền.","trung"]],
"cungKhiLuan|Điền Trạch":[["Sở Hoàng","Cung khí Điền Trạch đại cát thì cuộc đời có nhà đất, không phải ở thuê; đại hung thì điền sản suy hoặc giá trị thấp trừ khi đại vận cứu; dùng để đoán số lượng, thời điểm sở hữu nhà đất; phải phối Mệnh, Thân, Tài và đại vận.","Mặt tốt: nếu nền mảng nhà cửa tốt, bạn có xu hướng có nhà đất riêng, không phải ở thuê. Mặt xấu: nếu nền yếu thì nhà đất dễ suy hao hoặc giá trị thấp, trừ khi gặp giai đoạn tốt cứu lại.","trung"]],
"cungKhiLuan|Phụ Mẫu":[["Sở Hoàng","Chỉ xem sao chỉ biết quan hệ với cha mẹ; cần cung khí để biết cha mẹ hanh thông, phú quý; cung khí đại hung thường cha mẹ không phát đạt hoặc sức khỏe kém.","Mặt tốt: bạn có xu hướng có thể đánh giá được khá rõ cha mẹ hanh thông hay không. Mặt xấu: nếu nền mảng này yếu thì cha mẹ thường không phát đạt hoặc sức khỏe kém, bạn ít được nhờ.","trung"]],
"cungKhiLuan|Huynh Đệ":[["Sở Hoàng","Cung khí Huynh Đệ đại hung thường ít anh em trai, anh em vận không thuận; hợp tác, mượn tiền, kết bạn cần xét đại hạn và lưu niên.","Mặt tốt: bạn có xu hướng biết chọn thời điểm để hợp tác, kết bạn. Mặt xấu: nếu nền mảng anh em yếu thì ít anh em trai, anh em vận không thuận, hợp tác hay cho mượn tiền dễ thiệt.","trung"]],
"cungKhiLuan|Tật Ách":[["Sở Hoàng","Mệnh, Thân là gốc, Tật Ách là phụ; Hóa Kỵ ở Tật Ách là dấu hiệu bất lợi; hành của cung khí cho biết thể trạng và loại bệnh cần phòng.","Mặt tốt: bạn có xu hướng biết trước mình thuộc thể trạng nào để phòng. Mặt xấu: nếu mảng sức khỏe có dấu hiệu bất lợi thì cơ thể có điểm yếu dễ thành bệnh. Gợi ý: khám định kỳ và hỏi bác sĩ khi có triệu chứng.","trung"]],
"cungKhiLuan|Phu Thê":[["Sở Hoàng","Luận hôn nhân không thể chỉ dựa vào sao hay cung khí, phải kết hợp đại vận và can cung; cung khí đại hung kèm Thái Âm/Thái Dương/Hóa Kỵ thường kết hôn muộn.","Mặt tốt: bạn có xu hướng không bị một dấu hiệu đơn lẻ định đoạt hôn nhân. Mặt xấu: nếu nền mảng vợ chồng yếu thì dễ kết hôn muộn, chuyện lứa đôi chậm và nhiều cân nhắc.","trung"]],
"cungKhiLuan|Thiên Di":[["Sở Hoàng","Xét cung khí Thiên Di để biết có xe cộ không, hình ảnh của mình trước đám đông ra sao, có phải xa quê mới làm nên chuyện; nên đối chiếu thêm đại vận và lưu niên.","Mặt tốt: bạn có xu hướng có thể làm nên chuyện khi xa quê, hình ảnh trước đám đông tốt nếu nền mảng này vững. Mặt xấu: nếu nền yếu thì ra ngoài dễ bất lợi, hình ảnh xã hội kém và chuyện đi lại hay trục trặc.","trung"]],
"cungKhiLuan|Quan Lộc":[["Sở Hoàng","Cung Quan Lộc dùng để xét việc học lúc nhỏ, đường sự nghiệp, lúc nào lập nghiệp, khi nào lên chức hay đổi việc; chủ tinh là hỉ thần mà cung khí đại cát thì học vấn cao, còn chủ tinh là kỵ thần thì phải chờ đại vận tốt.","Mặt tốt: bạn có xu hướng học vấn cao và sự nghiệp lên nhanh khi nền mảng công việc tốt. Mặt xấu: nếu nền yếu thì việc học và việc làm đều chậm, phải chờ giai đoạn tốt mới bứt lên được.","trung"]],
"cungKhiLuan|Phúc Đức":[["Sở Hoàng","Phúc Đức nên luận bằng sao (lao lực hay nhàn hạ, chăm hay lười); cung khí chỉ cho biết mức độ hưởng thụ, ít giá trị thực tiễn.","Mặt tốt: bạn có xu hướng có mức hưởng thụ cuộc sống tương xứng với nền mảng phúc của mình. Mặt xấu: đời bạn lao lực hay nhàn, chăm hay lười chủ yếu do tính cách, không dựa vào phúc mà có.","trung"]],
"cungKhiLuan|Nô Bộc":[["Sở Hoàng","Cung Nô Bộc phản ánh năng lực của bạn bè, người dưới quyền và tài lãnh đạo của đương số; người kinh doanh lớn thường có Nô Bộc vững.","Mặt tốt: bạn có xu hướng có bạn bè, người dưới quyền giỏi và có tài lãnh đạo nếu nền mảng này vững. Mặt xấu: nếu nền yếu thì bạn bè, cấp dưới kém sức, dễ bị kéo chân và khó làm việc lớn cần nhiều người.","trung"]],
"cungKhiLuan|Tử Tức":[["Sở Hoàng","Phải kết hợp cung khí, sao và lá số phối ngẫu mới luận chuyện con cái; không đoán chỉ từ một cung.","Mặt tốt: bạn có xu hướng không bị một dấu hiệu đơn lẻ định đoạt chuyện con cái. Mặt xấu: chuyện con cái của bạn phức tạp, phụ thuộc nhiều vào người bạn đời và hoàn cảnh, khó đoán trước.","trung"]],
"canTDN|thuong":[["Ông Phúc Dụ","Can cung thuộc thượng đẳng (Giáp, Ất, Bính): được cộng điểm khi chấm xí hoa; Giáp 'Thiên chi Thiên' chủ tự lập, tự cường; Ất 'Thiên chi Địa' chủ mềm mỏng, được nữ giới trợ giúp.","Mặt tốt: bạn có xu hướng tự lập, tự cường hoặc mềm mỏng và được phụ nữ giúp đỡ. Mặt xấu: tự lập quá thì cứng, mềm mỏng quá thì dễ dựa vào người khác.","cat"]],
"canTDN|trung":[["Ông Phúc Dụ","Can cung thuộc trung đẳng (Đinh, Mậu, Kỷ): cát hung đan xen; Kỷ thuộc tầng Nhân, mức trung.","Mặt tốt: bạn có xu hướng có mức nền ổn, không quá thiệt. Mặt xấu: tốt xấu đan xen, không có điểm nổi trội để dựa vào, kết quả phụ thuộc vào cách mình xoay xở.","trung"]],
"canTDN|ha":[["Ông Phúc Dụ","Can cung thuộc hạ đẳng (Canh, Tân, Nhâm): bị trừ điểm; Tân 'Địa lợi hạ đẳng', Nhâm 'Nhân chi Nhân' chủ độc lập, tự phụ, không chịu thiệt.","Mặt tốt: bạn có xu hướng độc lập, tự lo được cho mình. Mặt xấu: nền mảng này bị trừ điểm, bạn dễ tự phụ, không chịu thiệt nên hay va chạm với người xung quanh.","trung"]],
"canCung|Mệnh|Kỷ":[["Ma Y Cung","Mệnh can Kỷ: nội hàm, nhẫn nhịn, hay giúp người; dễ bị lừa hoặc hao tiền nhưng đời sống thường ổn định.","Mặt tốt: bạn thuộc mẫu người nội tâm, nhẫn nhịn, hay giúp người và đời sống thường ổn định. Mặt xấu: bạn dễ bị lừa hoặc hao tiền vì cả tin, nhịn nhiều nên thiệt về mình.","trung"]],
"canCung|Mệnh|Canh":[["Ma Y Cung","Can Canh ở Mệnh: tính độc lập, trọng hiệp nghĩa, cứng rắn, ưa hơn thua; giúp ai thì không mong đền đáp.","Mặt tốt: bạn thuộc mẫu người độc lập, trọng nghĩa, giúp ai không mong đền đáp. Mặt xấu: bạn cứng rắn, ưa hơn thua, dễ va chạm và khó chịu lùi khi cần.","cat"]],
"canCung|Mệnh|Ất":[["Ma Y Cung; Ông Phúc Dụ","Mệnh can Ất: mềm mỏng, hòa nhã, thích nghi tốt, thường được nữ giới che chở trợ giúp nhưng vẫn độc lập, sống vui.","Mặt tốt: bạn thuộc mẫu người mềm mỏng, hòa nhã, thích nghi tốt và thường được phụ nữ che chở. Mặt xấu: sự mềm mỏng dễ thành thiếu quyết đoán, và dựa vào người giúp nhiều thì khó tự gánh khi họ rút đi.","cat"]],
"snToa|Lộc|Mệnh":[["Nhiều tác giả","Hóa Lộc năm sinh tọa Mệnh: duyên tốt, lạc quan, ăn nói khéo, có phúc; nhược điểm là có thể thiếu chủ kiến, dễ bận rộn và hơi tự tư.","Mặt tốt: bạn thuộc mẫu người có duyên, lạc quan, ăn nói khéo và có phúc. Mặt xấu: bạn có thể thiếu chủ kiến, dễ bận rộn vô ích và hơi nghĩ cho mình trước.","cat"],["Kinh nghiệm cao thủ Bắc phái","Khi Hóa Lộc tại Mệnh mà sao mang Lộc thuộc hành kỵ thần thì điểm xí hoa vẫn bị trừ: hung nhiều hơn cát dù có Lộc.","Mặt tốt: bạn có xu hướng có duyên và cơ hội đến với bản thân. Mặt xấu: duyên ấy mang theo bất lợi nhiều hơn lợi, được cái này mất cái khác, tổng lại xấu nhiều hơn tốt.","trung"]],
"phi|Mệnh|Lộc|Tử Tức":[["Lai Nhân Cung; Trung Châu; giáo trình Tứ Hóa","Lộc phi từ Mệnh nhập Tử Tức (Lộc Tử): hợp với trẻ nhỏ, bao dung, giao tiếp dễ dàng; lưu ý chuyện quá chiều con và những mối tình ngoài lề.","Mặt tốt: bạn có xu hướng hợp với trẻ nhỏ, bao dung và dễ giao tiếp. Mặt xấu: bạn dễ quá chiều con và dễ vướng những mối tình ngoài lề.","cat"]],
"phi|Mệnh|Quyền|Huynh Đệ":[["","Quyền phi từ Mệnh nhập Huynh Đệ (Quyền Bào): nhiều chủ kiến, ưa quản anh em và bạn thân; dễ sinh tranh quyền, thị phi. Xét theo đại vận thì đây cũng là kiểu 'Khai quán nhân', có thành tựu trên trục Huynh–Nô.","Mặt tốt: bạn có xu hướng nhiều chủ kiến, có thể làm thủ lĩnh trong nhóm bạn, có thành tựu khi làm ăn chung. Mặt xấu: bạn ưa quản anh em và bạn thân nên dễ tranh quyền, sinh điều tiếng trong nhóm.","trung"]],
"phi|Mệnh|Khoa|Phúc Đức":[["","Khoa phi từ Mệnh nhập Phúc Đức (Khoa Phúc): tính điềm tĩnh, thiên về lý trí, tiền bạc ổn; gặp lúc gấp rút thì có quý nhân ra tay.","Mặt tốt: bạn thuộc mẫu người điềm tĩnh, lý trí, tiền bạc ổn và gặp lúc gấp có người tốt ra tay. Mặt xấu: lý trí quá thì khô khan, khó buông thả cảm xúc và dễ bị thấy là xa cách.","cat"]],
"phi|Mệnh|Kỵ|Quan Lộc":[["","Kỵ phi từ Mệnh nhập Quan Lộc (Kỵ Quan), thuộc dạng Thuận thủy Kỵ: dồn tâm sức cho sự nghiệp nên dễ lơ là tình cảm vợ chồng; đi làm công thích hợp hơn tự kinh doanh.","Mặt tốt: bạn có xu hướng dồn tâm sức cho sự nghiệp, chăm chỉ và chịu khó. Mặt xấu: bạn dễ lơ là tình cảm vợ chồng vì công việc, và tự kinh doanh thì dễ vấp hơn là đi làm công.","trung"],["","Trường hợp sao hóa Kỵ là Văn Khúc (can Kỷ): khó bước chân vào nhà quyền quý, nơi ở hay đổi.","Mặt tốt: bạn có xu hướng linh hoạt, dễ thích nghi khi đổi chỗ ở. Mặt xấu: khó bước chân vào giới quyền quý, nơi ở hay thay đổi, ít ổn định.","trung"]],
"phi|Mệnh|Lộc|Quan Lộc":[["Lương phái","Mệnh phi Lộc nhập Quan Lộc (Lộc Quan): công việc trôi chảy, nhưng thành tựu lớn nhỏ còn tùy cách cục.","Mặt tốt: bạn có xu hướng gặp công việc trôi chảy, dễ có việc. Mặt xấu: trôi chảy chưa chắc là thành tựu lớn; nếu nền tổng thể yếu thì chỉ dừng ở mức bình thường.","cat"],["Huy Hà Phan","Luôn tìm cách kiếm tiền, nhiều ý tưởng, sự nghiệp cao nhưng dễ chểnh mảng, lơ là.","Mặt tốt: bạn thuộc mẫu người luôn tìm cách kiếm tiền, nhiều ý tưởng và có thể đi cao trong sự nghiệp. Mặt xấu: bạn dễ chểnh mảng, lơ là khi việc đã ổn, ý tưởng nhiều mà không theo tới cùng.","cat"],["Phương Ngoại Nhân","Có công việc nhưng không chắc làm đến cùng, hoặc là việc nhàn.","Mặt tốt: bạn có xu hướng có công việc, hoặc có việc nhàn. Mặt xấu: bạn không chắc làm đến cùng, dễ bỏ dở hoặc an phận ở việc nhẹ mà không tiến.","trung"],["Lai Nhân Cung","Tự đứng trên chân mình, chịu khó làm, có óc sáng tạo, dễ hòa nhập nhưng thiếu sức ép để bứt lên.","Mặt tốt: bạn thuộc mẫu người tự đứng trên chân mình, chịu khó, sáng tạo và dễ hòa nhập. Mặt xấu: thiếu sức ép nên khó bứt lên, dễ dừng ở mức khá.","cat"],["Trung Châu","Nặng về sự nghiệp, hay thay đổi công việc, làm không chuyên nhất, quan tâm vợ/chồng.","Mặt tốt: bạn có xu hướng nặng về sự nghiệp và quan tâm vợ hoặc chồng. Mặt xấu: bạn hay đổi việc, làm không chuyên nhất nên khó tích lũy chiều sâu.","trung"],["Lương Nhược Du","Lạc quan, gặp may, dễ tìm được việc vừa ý, song nhiệt huyết khó giữ được lâu.","Mặt tốt: bạn thuộc mẫu người lạc quan, gặp may, dễ tìm được việc vừa ý. Mặt xấu: nhiệt huyết khó giữ lâu, việc tốt đến dễ rồi cũng dễ chán.","cat"],["Tử vi đẩu số tinh hoa","Việc bận rộn, lên chức nhiều lần, buôn bán thuận lợi, hết lòng chăm chút bạn đời; nếu Lộc rơi vào Vũ Khúc thì đi đường dài, thành tựu về tiền bạc nhưng đến muộn.","Mặt tốt: bạn có xu hướng bận rộn, lên chức nhiều lần, buôn bán thuận và hết lòng chăm bạn đời. Mặt xấu: thành tựu tiền bạc có thể đến muộn và phải đi đường dài, bận rộn nhiều nên dễ kiệt sức.","cat"]],
"phi|Mệnh|Quyền|Quan Lộc":[["Huy Hà Phan","Quyền phi từ Mệnh nhập Quan Lộc (Quyền Quan): năng nổ, muốn điều hành và nắm chặt công việc, giàu tham vọng; đôi khi tản mạn, đi lệch trọng tâm.","Mặt tốt: bạn thuộc mẫu người năng nổ, giàu tham vọng, muốn điều hành và nắm chặt công việc. Mặt xấu: bạn đôi khi tản mạn, ôm nhiều mà đi lệch trọng tâm.","cat"],["Lai Nhân Cung; Trung Châu","Theo đuổi thành công, thích lãnh đạo, dễ thăng tiến; có thể áp đặt hoặc quản thúc người thân, người phối ngẫu.","Mặt tốt: bạn có xu hướng theo đuổi thành công, thích lãnh đạo và dễ thăng tiến. Mặt xấu: bạn có thể áp đặt, quản thúc người thân và người bạn đời, làm họ ngột ngạt.","trung"],["Lương Nhược Du","Tự tin, nhiều mưu kế, hợp vai quản lý; khi Quyền gặp Kỵ thì dễ hành động liều.","Mặt tốt: bạn thuộc mẫu người tự tin, nhiều mưu kế, hợp vai quản lý. Mặt xấu: khi gặp bất lợi bạn dễ hành động liều, quyết lớn mà thiếu cân nhắc.","cat"],["Tử vi đẩu số tinh hoa","Có trách nhiệm, có chí sáng nghiệp, thiên về quản lý, học giỏi; nếu sao Quyền là Tham Lang thì thích nắm quyền tài chính, quản tiền theo ý mình.","Mặt tốt: bạn thuộc mẫu người có trách nhiệm, có chí lập nghiệp, học giỏi và thiên về quản lý. Mặt xấu: bạn có thể muốn nắm hết quyền tài chính, quản tiền theo ý mình, khiến người cùng làm khó chịu.","cat"]],
"phi|Mệnh|Khoa|Tật Ách":[["Huy Hà Phan","Mệnh phi Khoa nhập Tật Ách (Khoa Tật): lý trí, lễ độ, biết chăm sóc sức khỏe, thân thể hài hòa ít bệnh, khi bệnh dễ gặp thầy giỏi.","Mặt tốt: bạn thuộc mẫu người lý trí, lễ độ, biết chăm sức khỏe, khi bệnh dễ gặp thầy giỏi. Mặt xấu: bạn dễ quá cẩn trọng với cơ thể, lo lắng về sức khỏe nhiều hơn mức cần.","cat"],["Lai Nhân Cung","Tư chất tốt, sáng dạ, song thể lực có thể không dồi dào, cần biết tập trung.","Mặt tốt: bạn có xu hướng tư chất tốt, sáng dạ. Mặt xấu: thể lực có thể không dồi dào, dễ mệt và khó tập trung lâu.","trung"],["Trung Châu; Phương Ngoại Nhân","Thể chất tốt, được quý nhân giúp, tính hiền hòa, lễ độ, thích tìm thầy học dưỡng sinh.","Mặt tốt: bạn thuộc mẫu người có thể chất tốt, hiền hòa, lễ độ và được người tốt giúp. Mặt xấu: hiền quá thì dễ bị lấn, ít khi giành phần cho mình.","cat"],["Lương Nhược Du","Dáng vẻ ưu nhã, có bệnh thì chữa được; tính chậm, thiếu quyết liệt.","Mặt tốt: bạn có xu hướng dáng vẻ ưu nhã, có bệnh thì thường chữa được. Mặt xấu: tính chậm, thiếu quyết liệt, dễ lỡ việc cần làm nhanh.","trung"]],
"phi|Mệnh|Kỵ|Tài Bạch":[["Lương phái","Kỵ phi từ Mệnh nhập Tài Bạch (Kỵ Tài), thuộc Thuận thủy Kỵ: chú tâm tới tiền, gắng sức kiếm tiền, tính toán nhiều.","Mặt tốt: bạn có xu hướng chú tâm tới tiền, chịu khó gắng sức kiếm tiền. Mặt xấu: bạn tính toán nhiều, đầu óc lúc nào cũng xoay quanh tiền nên dễ căng thẳng và bị thấy là thực dụng.","trung"],["Huy Hà Phan","Ham tiền, biết tiết kiệm nhưng kiếm khó, hay phải vay mượn; bám chặt chuyện tiền nong, sẵn lòng hy sinh vì tài chính.","Mặt tốt: bạn có xu hướng biết tiết kiệm và sẵn lòng hy sinh vì tài chính. Mặt xấu: tiền kiếm khó, hay phải vay mượn, bám chặt chuyện tiền nong đến mức mệt mỏi.","hung"],["Phương Ngoại Nhân","Giữ của, khó tiêu tiền cho bản thân; nhưng cần xem thêm cung khác mới kết luận.","Mặt tốt: bạn có xu hướng giữ của, ít tiêu hoang. Mặt xấu: bạn khó tiêu tiền cho chính mình, có tiền mà không dám hưởng.","trung"],["Lai Nhân Cung; Tử vi đẩu số tinh hoa","Hay lo, chi tiêu chặt chẽ, kiếm tiền cực nhọc; đời sống tinh thần kém vui, ít hưởng thụ.","Mặt tốt: bạn có xu hướng chi tiêu chặt chẽ, ít khi để mình rơi vào cảnh vung tay quá trán. Mặt xấu: kiếm tiền cực nhọc, hay lo, đời sống tinh thần kém vui và ít hưởng thụ.","hung"],["Trung Châu","Kiếm tiền cực, dễ thất thoát, vợ chồng khó êm vì chuyện tiền.","Mặt tốt: bạn có xu hướng chịu khó, không ngại việc cực để làm ra tiền. Mặt xấu: tiền kiếm cực mà dễ thất thoát, vợ chồng hay căng thẳng vì chuyện tiền.","hung"],["Lương Nhược Du","Chăm chỉ kiếm tiền, tính toán, làm nhiều việc cùng lúc, dễ mạo hiểm vì tiền.","Mặt tốt: bạn thuộc mẫu người chăm chỉ, tính toán và làm được nhiều việc cùng lúc để kiếm tiền. Mặt xấu: bạn dễ mạo hiểm vì tiền, ôm quá nhiều việc nên dễ đuối sức.","trung"],["Ông Phúc Dụ","Tiền làm ra chỉ vừa đủ chi dùng; không coi đây là điềm xấu.","Mặt tốt: bạn có xu hướng luôn có tiền đủ chi dùng. Mặt xấu: tiền làm ra chỉ vừa đủ, khó có khoản dư lớn để tích lũy.","trung"]],
"phi|Mệnh|Lộc|Tật Ách":[["Nhiều tác giả","Lộc phi từ Mệnh nhập Tật Ách (Lộc Tật): cơ thể khỏe, ưa thoải mái, có điều ngại vận động nên dễ tăng cân.","Mặt tốt: bạn có xu hướng cơ thể khỏe, biết sống thoải mái. Mặt xấu: bạn ngại vận động nên dễ tăng cân, dễ mắc mỡ máu, huyết áp, tiểu đường. Gợi ý: có dấu hiệu lạ thì đi khám, hỏi bác sĩ.","cat"]],
"phi|Mệnh|Quyền|Thiên Di":[["Nhiều tác giả","Mệnh phi Quyền nhập Thiên Di (Quyền Di): năng lực, quyết đoán, thích lãnh đạo ở bên ngoài; dễ tự phụ, kết oán.","Mặt tốt: bạn thuộc mẫu người có năng lực, quyết đoán và thích dẫn dắt khi ra bên ngoài. Mặt xấu: bạn dễ tự phụ, mạnh tay với người ngoài nên dễ kết oán.","trung"]],
"phi|Mệnh|Khoa|Điền Trạch":[["Nhiều tác giả","Khoa phi từ Mệnh nhập Điền Trạch (Khoa Điền): nhà cửa ngăn nắp, thanh nhã; trong nhà êm ấm.","Mặt tốt: bạn có xu hướng giữ nhà cửa ngăn nắp, thanh nhã, trong nhà êm ấm. Mặt xấu: bạn dễ đòi hỏi sự chỉn chu, khó chịu khi người nhà không theo nếp của mình.","cat"]],
"phi|Mệnh|Kỵ|Nô Bộc":[["Nhiều tác giả","Kỵ phi từ Mệnh nhập Nô Bộc (Kỵ Nô), thuộc Thuận thủy Kỵ: trọng nghĩa khí, quý bạn bè, hay chi tiền cho bạn, dễ bị kéo vào rắc rối, hao tốn tiền bạc; sức cạnh tranh yếu, nên làm việc thiện, tích đức.","Mặt tốt: bạn thuộc mẫu người trọng nghĩa khí, quý bạn bè, sẵn lòng chi tiền cho bạn. Mặt xấu: bạn dễ bị kéo vào rắc rối của bạn bè, hao tiền vì người khác và sức cạnh tranh của bản thân yếu.","trung"]],
"phi|Mệnh|Quyền|Tử Tức":[["Lai Nhân Cung 144 quyết; giáo trình Tứ Hóa","Quyền phi từ Mệnh nhập Tử Tức (Quyền Tử): dạy con nghiêm khắc, khi hợp tác muốn cầm quyền; nên tránh độc đoán và chuyện tình cảm bên ngoài.","Mặt tốt: bạn có xu hướng dạy con nghiêm, khi hợp tác thì giữ được vai cầm trịch. Mặt xấu: bạn dễ độc đoán với con và với đối tác, và dễ vướng chuyện tình cảm bên ngoài.","trung"]],
"phi|Mệnh|Khoa|Phu Thê":[["Nhiều giáo trình","Khoa phi từ Mệnh nhập Phu Thê (Khoa Phối): người bạn đời có khí chất, tình duyên bền lâu; nên đề phòng người thứ ba.","Mặt tốt: bạn có xu hướng gặp người bạn đời có khí chất, tình duyên bền lâu. Mặt xấu: chính sự đẹp đẽ ấy dễ thu hút người thứ ba xen vào.","cat"]],
"mchat|Mệnh|chat":[["Trịnh Mục Đức","Mệnh có M chất (có Tứ Hóa năm sinh tọa): dựa vào nỗ lực bản thân trước, sau mới có quý nhân.","Mặt tốt: bạn thuộc mẫu người tự lực, dựa vào nỗ lực bản thân là chính. Mặt xấu: lúc đầu ít ai giúp, phải tự đi một mình khá lâu rồi mới gặp người nâng đỡ.","cat"]],
"mchat|Mệnh|Quan Lộc":[["Trịnh Mục Đức","M Quan có ở Mệnh: có chuyên môn, sự nghiệp dễ thành.","Mặt tốt: bạn có xu hướng có chuyên môn rõ và sự nghiệp dễ thành. Mặt xấu: bạn dễ đồng nhất giá trị bản thân với công việc, việc chững lại là bạn chao đảo.","cat"]],
"mchat|Mệnh|Tài Bạch":[["Trịnh Mục Đức","M Tài có ở Mệnh: giỏi kiếm tiền, tiền bạc dư dả.","Mặt tốt: bạn có xu hướng giỏi kiếm tiền, tiền bạc dư dả. Mặt xấu: tiền dễ trở thành trung tâm đời bạn, đo người đo việc bằng tiền.","cat"]],
"mchat|Mệnh|Tật Ách":[["Trịnh Mục Đức","M Tật có ở Mệnh: việc làm cực nhọc, hay phải làm một mình.","Mặt tốt: bạn có xu hướng chịu khó, làm được việc nặng một mình. Mặt xấu: việc làm cực nhọc, hay phải gánh một mình nên dễ kiệt sức và ít được chia sẻ.","trung"]],
"mchat|Mệnh|Nô Bộc":[["Trịnh Mục Đức","Mệnh có M Nô: bạn bè là quý nhân của đương số.","Mặt tốt: bạn có xu hướng có bạn bè là người giúp mình lúc cần. Mặt xấu: bạn dễ phụ thuộc vào bạn bè, khi các mối quan hệ rạn thì mất luôn chỗ dựa.","cat"]],
"mchat|Mệnh|Phu Thê":[["Trịnh Mục Đức","Mệnh có M Phối: người phối ngẫu là quý nhân.","Mặt tốt: bạn có xu hướng có người bạn đời là người nâng đỡ mình. Mặt xấu: bạn dựa vào người ấy nhiều, hôn nhân trục trặc thì bạn bị ảnh hưởng nặng.","cat"]],
"mchat|Mệnh|Tử Tức":[["Trịnh Mục Đức","Mệnh có M Tử: con cái (hoặc đối tác, người nhỏ tuổi) là quý nhân; có con thì đời nhiều màu sắc.","Mặt tốt: bạn có xu hướng có con cái, đối tác hay người nhỏ tuổi là người giúp mình, có con thì đời nhiều màu sắc. Mặt xấu: bạn dễ đặt kỳ vọng lớn lên con hay người trẻ, và hụt hẫng khi họ không đáp lại.","cat"]],
"cach|Văn quế văn hoa":[["","Văn Khúc và Văn Xương cùng hội ở Mệnh: sáng dạ, ham học, có khiếu văn chương nghệ thuật, dễ có danh; kỵ gặp sát tinh và Hóa Kỵ.","Mặt tốt: bạn thuộc mẫu người sáng dạ, ham học, có khiếu văn chương nghệ thuật và dễ có danh. Mặt xấu: khi gặp hoàn cảnh xấu thì tài năng bị cản, danh dễ thành tai tiếng.","cat"]],
"cach|Cơ Cự đồng lâm":[["","Cự Môn và Thiên Cơ đồng cung ở Mệnh: giỏi nghiên cứu, có tài ăn nói nhưng nhiều thị phi; lúc trẻ vất vả, đến trung niên mới khởi sắc.","Mặt tốt: bạn thuộc mẫu người giỏi nghiên cứu, có tài ăn nói, trung niên mới khởi sắc. Mặt xấu: lời nói nhiều thì điều tiếng nhiều, thời trẻ vất vả và chậm thành.","trung"]],
"cach|Lộc hợp uyên ương":[["","Hóa Lộc và Lộc Tồn cùng ở Mệnh: tiền của dồi dào, song đừng cậy giàu mà kiêu.","Mặt tốt: bạn có xu hướng tiền của dồi dào. Mặt xấu: dễ cậy giàu mà kiêu, làm mất lòng người và tự làm hao của.","cat"]],
"cach|Phủ Tướng triều viên":[["Từ Tăng Sinh","Thiên Tướng, Thiên Phủ triều Mệnh: được bề trên quý, dễ được cất nhắc; ngoài cứng trong mềm, dễ mất lòng đồng nghiệp. Mệnh vô chính diệu mà có Phủ Tướng hội chiếu thì vật chất đầy đủ.","Mặt tốt: bạn có xu hướng được bề trên quý, dễ được cất nhắc và vật chất đầy đủ. Mặt xấu: ngoài cứng trong mềm, bạn dễ mất lòng đồng nghiệp và bị ganh tị.","cat"]],
"sao|Vô chính diệu|Mệnh":[["Khai quán nhân; Từ Tăng Sinh","Mệnh vô chính diệu: phải mượn sao Thiên Di và xem thêm Phụ Mẫu; tuổi nhỏ nhiều biến đổi, lớn lên có thể thành đạt.","Mặt tốt: bạn có xu hướng linh hoạt, lớn lên có thể thành đạt. Mặt xấu: tuổi nhỏ nhiều biến đổi, tính cách dễ chịu ảnh hưởng của môi trường và cha mẹ, khó định hình sớm.","trung"]],
"sao|Cự Môn|Mệnh":[["Nhiều tác giả","Cự Môn tại Mệnh: 'ám tinh' che ánh sáng sao khác, chủ thị phi, khẩu thiệt, đa nghi; tốt xấu tùy miếu hãm và sao đi kèm (gặp Thái Dương, Lộc thì hóa giải).","Mặt tốt: bạn có xu hướng sâu sắc, nhìn ra chỗ khuất mà người khác bỏ qua. Mặt xấu: bạn dễ vướng thị phi, khẩu thiệt, đa nghi, lời nói hay gây hiểu lầm.","trung"]],
"sao|Lộc Tồn|Mệnh":[["Nhiều tác giả","Lộc Tồn ở Mệnh: chủ chính tài, tính phúc hậu, có tiền, hợp việc ổn định; về hình tướng thì các nguồn luận không thống nhất.","Mặt tốt: bạn thuộc mẫu người phúc hậu, có tiền từ nguồn chính đáng, hợp việc ổn định. Mặt xấu: bạn dễ an phận, ngại mạo hiểm nên khó bứt lên lớn.","cat"]],
"sao|Liêm Trinh|Mệnh":[["Vũ Mê Linh","Liêm Trinh tại Mệnh: có chí khí, thẳng thắn, chăm chỉ, tự trọng; hợp chính trị, công chức, có Lộc thì hợp tài chính.","Mặt tốt: bạn thuộc mẫu người có chí khí, thẳng thắn, chăm chỉ, tự trọng. Mặt xấu: thẳng quá dễ cứng nhắc, va chạm với người không cùng nguyên tắc.","cat"],["Hà Lạc phái; Trần Bỉnh Húc; Sở Hoàng","Liêm Trinh là thứ đào hoa, chủ tình cảm; gặp Kỵ thì tình cảm dễ tổn thương, hiếu thắng, dễ quá đà; gặp sát tinh dễ cờ bạc, kiện tụng; Lộc vào Liêm Trinh thì bảo thủ, hợp việc ổn định.","Mặt tốt: bạn có xu hướng giàu tình cảm, sức hút với người khác giới. Mặt xấu: tình cảm dễ tổn thương, hiếu thắng và dễ quá đà; gặp hoàn cảnh xấu thì dễ dính cờ bạc, kiện tụng.","trung"],["Phi tinh Trần Đoàn; Vương Đình Chi","Khí chất ngang tàng, cần Thiên Tướng hoặc Lộc Tồn chế hóa; hội cát thì phong nhã, hội hung thì lệch lạc.","Mặt tốt: gặp môi trường tốt thì bạn có xu hướng phong nhã, có khí chất riêng. Mặt xấu: khí chất ngang tàng, gặp môi trường xấu thì dễ lệch lạc, khó kiềm chế.","trung"],["Sở Hoàng","Liêm Trinh chủ đào hoa, quan lộc, đầu cơ, phóng túng; khi Liêm hành Hỏa là hỉ thần nên làm dịch vụ; thời điểm xét theo đại vận.","Mặt tốt: bạn có xu hướng giỏi giao tiếp, có duyên với nghề dịch vụ và công danh. Mặt xấu: bạn dễ phóng túng, ham đầu cơ và vướng chuyện tình cảm.","trung"]],
"sao|Phá Quân|Mệnh":[["Vũ Mê Linh; Nhiều tác giả","Phá Quân tại Mệnh: chính trực, hay đổi ý, thích cái mới, hiếu thắng, phần lớn xa quê; hợp kinh doanh, kỹ thuật, quân đội.","Mặt tốt: bạn thuộc mẫu người chính trực, thích cái mới, hợp kinh doanh, kỹ thuật, quân đội. Mặt xấu: hay đổi ý, hiếu thắng và phần lớn phải xa quê.","trung"],["Hà Lạc phái","Thời trẻ vất vả, đầu khó sau dễ; có thể thành lớn hoặc bại lớn; nữ mệnh dễ gặp rắc rối chuyện tình duyên.","Mặt tốt: bạn có xu hướng đầu khó sau dễ, có thể làm nên việc lớn. Mặt xấu: thời trẻ vất vả, có thể bại lớn như thành lớn; với nữ thì dễ rắc rối tình duyên.","trung"],["Tam Hợp phái; Vương Đình Chi","Có Lộc thì có gốc rễ; gặp Kình Đà, Hỏa Linh thì hại, dễ suy sụp; thiếu hung tinh thì sáng tạo; hội cát cương nghị, hội hung hao tán.","Mặt tốt: bạn có xu hướng sáng tạo, cương nghị khi có gốc rễ vững. Mặt xấu: gặp hoàn cảnh xấu thì dễ suy sụp, hao tán.","trung"],["Phụ lục cohoc","Phá Quân nhập Mệnh: kiêu ngạo, khó chịu quản thúc, độc đoán; miếu vượng thì cương cường, có chủ kiến; hãm thì cực đoan; Sát Phá Tham hội chiếu chủ cải cách, khai sáng; hội Lộc Mã thì phú quý.","Mặt tốt: bạn thuộc mẫu người có chủ kiến, cương quyết, hợp vai cải cách, mở đường. Mặt xấu: bạn kiêu, khó chịu bị quản, độc đoán; lúc yếu thế thì dễ cực đoan.","trung"]],
"sao|Thiên Riêu|Mệnh":[["Vương Đình Chi","Thiên Riêu (hành Thủy) tại Mệnh: phong lưu, dễ vướng họa sắc tình; kỵ đóng ở Sửu, Mùi.","Mặt tốt: bạn thuộc mẫu người phong lưu, có sức hút. Mặt xấu: bạn dễ vướng rắc rối chuyện tình ái, sắc dục.","trung"]],
"sao|Thất Nhân|Mệnh":[["Dương Trinh Tường","Mệnh có Thất nhân: tự đề cao bản thân, phúc họa tự chịu; ở Phu Thê thì coi trọng tình cảm và sắc đẹp.","Mặt tốt: bạn có xu hướng tự tin, coi trọng tình cảm và cái đẹp. Mặt xấu: bạn tự đề cao mình, phúc họa đều tự chịu, ít ai đỡ.","trung"]],
"snToa|Kỵ|Phu Thê":[["Nhiều tác giả","Hóa Kỵ năm sinh tọa Phu Thê: hôn nhân căng thẳng, ít giao tiếp, tiền của người phối ngẫu đi chỗ khác; nên kết hôn muộn. Nếu tại Thìn Tuất Sửu Mùi thì thành Nhập khố Kỵ.","Mặt tốt: bạn có xu hướng rất để tâm tới hôn nhân, gắn bó lâu nếu cưới muộn. Mặt xấu: hôn nhân căng thẳng, vợ chồng ít nói chuyện, tiền của người bạn đời dễ đi chỗ khác.","hung"],["Trần Bỉnh Húc","Kỵ tại Tý, Sửu ở Phu Thê kèm Thiên Hình: hay cãi vã; hội thêm sao xấu thì dễ chia ly.","Mặt tốt: bạn có xu hướng thẳng thắn trong chuyện vợ chồng, không giấu bất đồng. Mặt xấu: vợ chồng hay cãi vã; thêm hoàn cảnh xấu thì dễ chia ly.","hung"]],
"canCung|Phu Thê|Đinh":[["","Can Đinh ở Phu Thê: bạn đời có cá tính độc lập, nghĩ kỹ nhưng hay toan tính.","Mặt tốt: bạn có xu hướng gặp người bạn đời độc lập, suy nghĩ kỹ. Mặt xấu: người ấy hay toan tính, dễ khiến bạn thấy bị đề phòng.","trung"]],
"canCung|Phu Thê|Quý":[["Ông Phúc Dụ","Phu Thê ở Tị, can Quý: trước trung niên hôn nhân có thể phải bôn ba; can Quý dễ hao tổn, dễ lâm vào bế tắc.","Mặt tốt: bạn có xu hướng ổn định hôn nhân về sau trung niên. Mặt xấu: trước trung niên hôn nhân phải bôn ba, dễ hao tổn và rơi vào bế tắc.","trung"]],
"phi|Phu Thê|Kỵ|Quan Lộc":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Phu Thê phi Kỵ nhập Quan Lộc (Tiết xuất Kỵ, tự xung Phu Thê): người phối ngẫu không ở lâu bên mình, hay vì công việc mà xa; biến cố hôn nhân hiện ra trong vận tương ứng.","Mặt tốt: bạn có xu hướng có người bạn đời chăm lo sự nghiệp. Mặt xấu: người ấy không ở lâu bên mình, hay vì việc mà xa; hôn nhân dễ có biến trong giai đoạn tương ứng.","hung"]],
"phi|Phu Thê|Quyền|Huynh Đệ":[["","Phu Thê phi Quyền nhập Huynh Đệ (Quyền Bào): người phối ngẫu giỏi giang, quản tài chính gia đình; sự nghiệp thành công.","Mặt tốt: bạn có xu hướng có người bạn đời giỏi giang, biết quản tài chính gia đình và sự nghiệp thành công. Mặt xấu: người ấy nắm tiền nên bạn dễ mất tiếng nói trong chuyện chi tiêu.","cat"]],
"phi|Phu Thê|Khoa|Phúc Đức":[["","Khoa phi từ Phu Thê nhập Phúc Đức (Khoa Phúc): bạn đời thanh nhã, xem trọng đời sống tinh thần, có giúp đỡ về tiền bạc.","Mặt tốt: bạn có xu hướng có người bạn đời thanh nhã, trọng đời sống tinh thần, có giúp đỡ về tiền bạc. Mặt xấu: hai người dễ thiên về lý tưởng, ít thực tế khi gặp chuyện tiền lớn.","cat"]],
"phi|Phu Thê|Lộc|Tử Tức":[["","Phu Thê phi Lộc nhập Tử Tức (Lộc Tử): người phối ngẫu yêu con, gia đình ấm áp; cũng có nguy cơ bị cuốn hút ngoài hôn nhân.","Mặt tốt: bạn có xu hướng có người bạn đời yêu con, gia đình ấm áp. Mặt xấu: có nguy cơ một trong hai bị cuốn hút ngoài hôn nhân.","cat"]],
"phi|Phu Thê|Khoa|Tật Ách":[["Đồng bộ đoạn quyết","Phu Thê phi Khoa nhập Tật Ách (Khoa Tật): người phối ngẫu không hời hợt, có chút địa vị xã hội.","Mặt tốt: bạn có xu hướng có người bạn đời chín chắn, có chút địa vị xã hội. Mặt xấu: người ấy dễ giữ ý, khó thổ lộ, khiến bạn thấy khoảng cách.","cat"],["Huy Hà Phan","Tình cảm tốt; người phối ngẫu thanh tú, tình cảm kín đáo, dây dưa.","Mặt tốt: bạn có xu hướng có tình cảm tốt, người bạn đời thanh tú. Mặt xấu: tình cảm kín đáo, dây dưa, khó dứt khoát khi cần.","cat"],["Lai Nhân Cung","Người phối ngẫu quan tâm tinh thần, mệnh chủ thụ động.","Mặt tốt: bạn có xu hướng có người bạn đời quan tâm tinh thần của mình. Mặt xấu: bạn thụ động trong quan hệ, để người kia dẫn dắt.","trung"],["Trung Châu","Người phối ngẫu hiền hòa, hiếu thuận, tôn trọng bạn bè của mình.","Mặt tốt: bạn có xu hướng có người bạn đời hiền hòa, hiếu thuận, tôn trọng bạn bè của mình. Mặt xấu: hiền quá thì người ấy ít khi lên tiếng bảo vệ quyền lợi chung.","cat"],["Bản Hán-Việt","Tình cảm mềm mỏng, kín đáo, kiểu 'duyên đứt tình còn' – hay vương vấn người cũ.","Mặt tốt: bạn có xu hướng tình cảm mềm mỏng, chung tình. Mặt xấu: duyên đã đứt mà tình còn vương, hay nhớ người cũ, khó bước tiếp.","trung"]],
"phi|Phu Thê|Kỵ|Nô Bộc":[["Đồng bộ đoạn quyết","Kỵ phi từ Phu Thê nhập Nô Bộc (Kỵ Nô, Thuận thủy Kỵ): phát triển ra ngoài kém thuận, khó làm hàng xuất khẩu.","Mặt tốt: bạn có xu hướng tập trung vào việc trong nước, gần nhà. Mặt xấu: phát triển ra ngoài kém thuận, khó làm hàng xuất khẩu hay mở rộng thị trường xa.","hung"],["Huy Hà Phan; Thiên Hỏa Đồng Nhân Hội","Người phối ngẫu chú ý bạn bè hơn mình, can thiệp vào bạn bè của mình, ảnh hưởng quan hệ xã hội.","Mặt tốt: bạn có xu hướng có người bạn đời quan tâm tới các mối quan hệ của mình. Mặt xấu: người ấy can thiệp vào bạn bè của bạn, chú ý bạn bè hơn mình, làm quan hệ xã hội của bạn bị ảnh hưởng.","trung"],["Phương Ngoại Nhân","Đời sống chăn gối có lúc không hòa hợp.","Mặt tốt: bạn có xu hướng có hôn nhân vẫn giữ được về hình thức. Mặt xấu: đời sống chăn gối có lúc không hòa hợp, dễ lạnh nhạt.","trung"],["Lai Nhân Cung","Hay va chạm với gia đình hai bên; tiền bạc và sức khỏe dễ chao đảo.","Mặt tốt: bạn có xu hướng gắn bó với cả hai bên gia đình. Mặt xấu: hay va chạm với gia đình hai bên, tiền bạc và sức khỏe dễ chao đảo.","hung"],["Trung Châu","Bạn đời thể lực yếu, bạn bè lắm thị phi, tiền bạc dễ hao hụt.","Mặt tốt: bạn có xu hướng có người bạn đời cần mình chăm sóc, gắn bó vì nghĩa. Mặt xấu: người bạn đời thể lực yếu, bạn bè lắm thị phi, tiền bạc dễ hao hụt.","hung"],["Bản Hán-Việt","Bạn đời trọng tình nghĩa; hôn nhân dễ thấy bó buộc, sau cưới bạn bè thưa dần.","Mặt tốt: bạn có xu hướng có người bạn đời trọng tình nghĩa. Mặt xấu: hôn nhân dễ thấy bó buộc, sau cưới bạn bè thưa dần.","trung"]],
"phi|Phu Thê|Lộc|Điền Trạch":[["Huy Hà Phan","Lộc phi từ Phu Thê nhập Điền Trạch (Lộc Điền): cưới xin đem lại êm ấm, được gia đình chúc phúc, dễ có tài sản nhờ hôn nhân, vợ chồng tốt đẹp, dễ làm quen người thân và bạn bè của nhau.","Mặt tốt: bạn có xu hướng có hôn nhân êm ấm, được hai bên chúc phúc, dễ có tài sản nhờ hôn nhân. Mặt xấu: hạnh phúc dựa nhiều vào nhà cửa và gia đình, khi chuyện nhà có biến thì hôn nhân cũng chao.","cat"],["Phương Ngoại Nhân; Trung Châu","Người phối ngẫu hòa thuận với người nhà, chăm lo gia đình, hòa đồng, sự nghiệp có phát triển.","Mặt tốt: bạn có xu hướng có người bạn đời hòa thuận với người nhà, chăm lo gia đình. Mặt xấu: người ấy dồn sức cho gia đình nên dễ lơ phần riêng của hai vợ chồng.","cat"],["Lai Nhân Cung","Bạn đời chăm lo việc nhà, góp sức kiếm tiền; nên đề phòng lúc tiêu nhiều.","Mặt tốt: bạn có xu hướng có người bạn đời chăm việc nhà, góp sức kiếm tiền. Mặt xấu: có giai đoạn trong nhà tiêu nhiều quá tay.","cat"],["Bản Hán-Việt (AI dịch; Thiên Hỏa Đồng Nhân Hội)","Kết hôn rồi mua nhà, sống hòa thuận; cần cảnh giác người khác giới hoặc bên thứ ba xen vào.","Mặt tốt: bạn có xu hướng kết hôn rồi mua nhà, sống hòa thuận. Mặt xấu: dễ có người khác giới hoặc người thứ ba xen vào.","cat"]],
"phi|Phu Thê|Quyền|Điền Trạch":[["Huy Hà Phan; nhiều tác giả","Phu Thê phi Quyền nhập Điền Trạch (Quyền Điền): sau kết hôn dễ mua nhà, người phối ngẫu nắm quyền trong nhà, giỏi giữ nhà.","Mặt tốt: bạn có xu hướng dễ mua nhà sau kết hôn, người bạn đời giỏi giữ nhà. Mặt xấu: người ấy nắm quyền trong nhà, bạn dễ mất tiếng nói.","cat"],["Lai Nhân Cung","Người thân tính cách mạnh, quản lý gia đình nghiêm.","Mặt tốt: bạn có xu hướng có gia đình nề nếp, được quản lý nghiêm. Mặt xấu: người thân tính mạnh, quản chặt, dễ gây ngột ngạt.","trung"],["Trung Châu","Người phối ngẫu ra oai, nhưng có thể giúp mở tiệm, mua nhà; gia cảnh tốt, kiếm tiền thuận.","Mặt tốt: bạn có xu hướng được người bạn đời giúp mở tiệm, mua nhà, gia cảnh tốt. Mặt xấu: người ấy hay ra oai, dễ lấn lướt bạn.","cat"]],
"phi|Phu Thê|Lộc|Quan Lộc":[["Nhiều tác giả","Lộc phi từ Phu Thê nhập Quan Lộc: bạn đời hậu thuẫn sự nghiệp; qua công việc có quan hệ với người khác giới, nên giữ mình tránh ngoại tình.","Mặt tốt: bạn có xu hướng có người bạn đời hậu thuẫn sự nghiệp. Mặt xấu: qua công việc dễ có quan hệ với người khác giới, dễ dẫn tới ngoại tình.","cat"]],
"phi|Phu Thê|Khoa|Tài Bạch":[["Nhiều tác giả","Khoa phi từ Phu Thê nhập Tài Bạch: bạn đời quản tiền có kế hoạch, hôn nhân êm ổn.","Mặt tốt: bạn có xu hướng có người bạn đời quản tiền có kế hoạch, hôn nhân êm. Mặt xấu: chi tiêu chặt quá thì bạn dễ thấy bị kiểm soát.","cat"]],
"phi|Phu Thê|Kỵ|Tử Tức":[["Nhiều tác giả","Phu Thê phi Kỵ nhập Tử Tức: chuyện vợ chồng ảnh hưởng đến con cái; dễ có người thứ ba hoặc xa cách.","Mặt tốt: bạn có xu hướng rất để tâm tới con cái. Mặt xấu: chuyện vợ chồng ảnh hưởng xấu tới con, dễ có người thứ ba hoặc xa cách nhau.","hung"]],
"phi|Phu Thê|Khoa|Nô Bộc":[["Nhiều giáo trình","Phu Thê phi Khoa nhập Nô Bộc: có thành tựu bên ngoài nhờ quan hệ, người phối ngẫu có sự nghiệp riêng.","Mặt tốt: bạn có xu hướng có thành tựu nhờ quan hệ, người bạn đời có sự nghiệp riêng. Mặt xấu: hai người dễ bận việc riêng mà ít thời gian cho nhau.","cat"]],
"phi|Phu Thê|Quyền|Tật Ách":[["Nhiều giáo trình","Phu Thê phi Quyền nhập Tật Ách: người phối ngẫu chi phối đời sống, tạo áp lực nhưng cũng chăm lo cho mình.","Mặt tốt: bạn có xu hướng được người bạn đời chăm lo đời sống. Mặt xấu: người ấy chi phối nhiều, tạo áp lực lên bạn.","trung"]],
"phi|Phu Thê|Lộc|Phúc Đức":[["Nhiều giáo trình","Phu Thê phi Lộc nhập Phúc Đức: hôn nhân dễ thuận hòa, người phối ngẫu mang lại niềm vui tinh thần.","Mặt tốt: bạn có xu hướng có hôn nhân thuận hòa, người bạn đời mang lại niềm vui tinh thần. Mặt xấu: bạn dễ dựa vào người ấy để vui, khi xa nhau thì tinh thần sa sút.","cat"]],
"phi|Phu Thê|Kỵ|Thiên Di":[["Nhiều giáo trình","Phu Thê phi Kỵ nhập Thiên Di (Thuận thủy Kỵ, khí Phu Thê tiết sang Thiên Di): báo bất hòa hoặc hôn nhân muộn, ảnh hưởng sự ổn định ngoài xã hội.","Mặt tốt: bạn có xu hướng có thể ổn định hơn khi hôn nhân đến muộn. Mặt xấu: vợ chồng dễ bất hòa hoặc hôn nhân muộn, kéo theo bấp bênh ở ngoài xã hội.","hung"]],
"mchat|Phu Thê|Điền Trạch":[["Trịnh Mục Đức","Phu Thê có M Điền: người phối ngẫu có nhà đất, kết hôn sẽ có nhà.","Mặt tốt: bạn có xu hướng có người bạn đời có nhà đất, kết hôn là có nhà. Mặt xấu: tài sản chủ yếu từ phía người kia nên bạn dễ yếu thế trong nhà.","cat"]],
"mchat|Phu Thê|Nô Bộc":[["Trịnh Mục Đức","Phu Thê có M Nô: người phối ngẫu coi trọng bạn bè, nhờ bạn mà thành công; có thể quen nhau qua bạn bè giới thiệu.","Mặt tốt: bạn có xu hướng có người bạn đời coi trọng bạn bè, thành công nhờ bạn, có thể quen nhau qua người giới thiệu. Mặt xấu: người ấy dễ dành cho bạn bè nhiều hơn cho gia đình.","cat"]],
"mchat|Phu Thê|Tật Ách":[["Trịnh Mục Đức","Phu Thê có M Tật: người phối ngẫu lao tâm, khá cố chấp.","Mặt tốt: bạn có xu hướng có người bạn đời tận tâm, lo nghĩ chu đáo. Mặt xấu: người ấy lao tâm, khá cố chấp, khó thay đổi ý.","trung"]],
"sao|Thái Âm|Phu Thê":[["Nhiều tác giả","Thái Dương/Thái Âm ở Phu Thê: hôn nhân tốt xấu tùy độ sáng (miếu hay hãm) và có gặp Kỵ, sát tinh hay không; lập gia đình muộn thường tốt hơn.","Mặt tốt: bạn có xu hướng có hôn nhân tốt hơn khi lập gia đình muộn. Mặt xấu: hôn nhân lên xuống tùy hoàn cảnh, cưới sớm dễ trục trặc.","trung"]],
"sao|Văn Xương|Phu Thê":[["Khai quán nhân; Trần Bỉnh Húc","Xương Khúc ở Phu Thê: bạn đời thông minh, lãng mạn; nam mệnh có đủ cả hai sao, hay bị sát tinh chiếu, thì dễ xuất hiện người thứ ba và cãi vã.","Mặt tốt: bạn có xu hướng có người bạn đời thông minh, lãng mạn. Mặt xấu: với nam, dễ có người thứ ba xen vào và vợ chồng hay cãi vã.","trung"]],
"sao|Tử Vi|Phu Thê":[["Nhiều tác giả","Tử Vi tại Phu Thê: người phối ngẫu lớn tuổi hơn hoặc có uy, kết hôn có thể muộn; không hội sát thì hiền lương; gặp Thất Sát thì phối ngẫu cương cường, kết hôn sớm dễ khắc, nên muộn.","Mặt tốt: bạn có xu hướng có người bạn đời lớn tuổi hơn hoặc có uy, hiền lương. Mặt xấu: kết hôn muộn; cưới sớm dễ xung khắc, người kia cứng rắn.","trung"]],
"canCung|Tử Tức|Nhâm":[["Ông Phúc Dụ","Can Nhâm ở Tử Tức: con cái mạnh mẽ, có lòng hiệp nghĩa, ưa hơn thua; bản thân đương số thích phô bày, tự cho mình giỏi.","Mặt tốt: bạn có xu hướng có con mạnh mẽ, hiệp nghĩa. Mặt xấu: con ưa hơn thua, còn bạn thích phô bày, tự cho mình giỏi.","trung"]],
"phi|Tử Tức|Quyền|Phu Thê":[["","Tử Tức phi Quyền nhập Phu Thê (Quyền Phối): con cái thành đạt, có hỗ trợ cho cha mẹ.","Mặt tốt: bạn có xu hướng có con thành đạt, có hỗ trợ cho cha mẹ. Mặt xấu: con mạnh nên dễ can thiệp chuyện vợ chồng của bạn.","cat"],["Trung Châu; Lai Nhân Cung","Con cái cá tính mạnh; trong hôn nhân dễ có người thứ ba xen vào.","Mặt tốt: bạn có xu hướng có con cá tính, có chính kiến. Mặt xấu: trong hôn nhân dễ có người thứ ba xen vào.","trung"]],
"phi|Tử Tức|Lộc|Huynh Đệ":[["","Tử Tức phi Lộc nhập Huynh Đệ (Lộc Bào): con thân với anh chị em, kiếm tiền tốt, có thể hợp tác làm ăn. Ở đại vận là dạng Khai quán nhân (thành tựu tuyến Huynh–Nô).","Mặt tốt: bạn có xu hướng có con thân với anh chị em, kiếm tiền tốt, có thể hợp tác làm ăn. Mặt xấu: làm ăn chung trong nhà dễ làm lẫn tình với tiền, khi lỗ thì sứt mẻ tình thân.","cat"]],
"phi|Tử Tức|Khoa|Điền Trạch":[["Nhiều tác giả","Tử Tức phi Khoa nhập Điền Trạch (Khoa Điền): gia đình hòa thuận, gia phong tốt, con lễ phép, nhà có tiếng tốt.","Mặt tốt: bạn có xu hướng có gia đình hòa thuận, gia phong tốt, con lễ phép. Mặt xấu: nặng giữ tiếng tốt nên trong nhà dễ giấu chuyện không vui.","cat"]],
"phi|Tử Tức|Kỵ|Mệnh":[["Huy Hà Phan","Tử Tức phi Kỵ nhập Mệnh (Kỵ Mệnh): 'nợ con cái', phải lo nhiều cho con, con khó gần, ít báo đáp; đào hoa bị động (người khác tìm đến); con khác suy nghĩ, tiết kiệm.","Mặt tốt: bạn có xu hướng có con tiết kiệm, có suy nghĩ riêng. Mặt xấu: bạn phải lo nhiều cho con mà con khó gần, ít báo đáp; dễ có người khác giới tự tìm tới.","trung"],["Lai Nhân Cung; Trung Châu","Quan hệ với con dễ ngăn cách, con ỷ lại; hợp tác làm ăn dễ thất bại; sự nghiệp khó, nhiều đào hoa bị động.","Mặt tốt: bạn có xu hướng rất để tâm tới con và người dưới. Mặt xấu: quan hệ với con dễ ngăn cách, con ỷ lại, hợp tác làm ăn dễ thất bại, sự nghiệp khó.","hung"],["Bản Hán-Việt; Tinh hoa","Con cái cố chấp, duyên con chậm; kết hôn và sinh con muộn, tình cảm với con nhạt; hợp tác đình trệ.","Mặt tốt: bạn có xu hướng có con kiên định. Mặt xấu: con cố chấp, duyên con chậm, kết hôn và sinh con muộn, tình cảm với con nhạt, hợp tác đình trệ.","trung"],["Ông Phúc Dụ","Không nên xuất ngoại, đi xa dễ gặp việc không hay.","Mặt tốt: bạn có xu hướng ổn định khi ở gần nhà. Mặt xấu: đi xa, ra nước ngoài dễ gặp việc không hay.","trung"],["Tiên thiên tứ hóa phi tinh kỳ phổ","Nếu đồng thời Mệnh phi Lộc nhập Tử Tức thì thành Thị phi Kỵ: cho đi mà không được đáp lại; Kỵ này cũng là Thuận thủy Kỵ (khí Tử Tức chảy về Mệnh).","Mặt tốt: bạn có xu hướng hết lòng cho con và người dưới. Mặt xấu: cho đi mà không được đáp lại, dễ tổn thương và sinh tranh chấp.","trung"]],
"phi|Tử Tức|Khoa|Mệnh":[["Huy Hà Phan; Lai Nhân Cung","Tử Tức phi Khoa nhập Mệnh (Khoa Mệnh): con cái lễ độ, nhẹ nhàng, tôn kính và học theo cha mẹ, là quý nhân.","Mặt tốt: bạn có xu hướng có con lễ độ, nhẹ nhàng, kính và học theo cha mẹ. Mặt xấu: con dễ dựa vào khuôn của cha mẹ, ít dám khác.","cat"],["Trung Châu; Phương Ngoại Nhân","Con cái hòa thuận, dễ dạy; đương số có duyên với người khác giới, giao du theo khuôn phép, hợp với bạn bè.","Mặt tốt: bạn có xu hướng có con hòa thuận, dễ dạy, có duyên với người khác giới mà giữ khuôn phép. Mặt xấu: sự khuôn phép có khi làm bạn cứng nhắc, khó gần với người phóng khoáng.","cat"],["Bản Hán-Việt; Tinh hoa","Con cái có nét văn chất, điềm đạm; về già có chỗ dựa.","Mặt tốt: bạn có xu hướng có con điềm đạm, về già có chỗ dựa. Mặt xấu: con thiên về văn, có thể không mạnh về kiếm tiền.","cat"]],
"phi|Tử Tức|Lộc|Điền Trạch":[["Huy Hà Phan; Trung Châu","Lộc phi từ Tử Tức nhập Điền Trạch (Lộc Điền): con cái giúp nhà, lo việc gia đình, tậu đất; có con rồi thì gia vận khá hơn, tài sản thịnh vượng.","Mặt tốt: bạn có xu hướng có con giúp nhà, lo việc gia đình, có con rồi gia vận khá hơn. Mặt xấu: bạn dễ đặt gánh nhà lên con, con chịu áp lực.","cat"],["Lai Nhân Cung","Con cái mang lại lợi, nhiều quý nhân; nhưng dễ đầu tư sai, nóng tính.","Mặt tốt: bạn có xu hướng được con mang lại lợi, nhiều người giúp. Mặt xấu: dễ đầu tư sai và nóng tính.","trung"],["Bản Hán-Việt; Tinh hoa; nhiều tác giả","Nhà đông vui, họ hàng hay lui tới; cần phòng chuyện tình cảm ngoài lề; con có thể sống chung trước hôn nhân. Nếu đối cung Điền đã có Lộc năm sinh thì thành Điệp xuất Lộc, dễ hao.","Mặt tốt: bạn có xu hướng có nhà đông vui, họ hàng hay lui tới. Mặt xấu: dễ có chuyện tình cảm ngoài lề, và tiền nhà dễ hao vì đông người.","trung"]],
"phi|Tử Tức|Quyền|Tật Ách":[["Huy Hà Phan; bản Hán-Việt","Tử Tức phi Quyền nhập Tật Ách (Quyền Tật): con cái cá tính mạnh, hiếu động, dễ va vấp; nên tiết chế.","Mặt tốt: bạn có xu hướng có con hiếu động, mạnh mẽ. Mặt xấu: con dễ va vấp, chấn thương do cá tính mạnh.","trung"],["Lai Nhân Cung; Trung Châu; Tinh hoa","Con cái và người dưới quyền mạnh mẽ, dễ bị ghen ghét; nhu cầu chăn gối cao, nên điều độ; con có năng lực, có thể thành người tài.","Mặt tốt: bạn có xu hướng có con và cấp dưới giỏi, có thể thành người tài. Mặt xấu: họ mạnh nên dễ bị ghen ghét; bản thân bạn nhu cầu chăn gối cao, dễ quá độ.","trung"]],
"phi|Tử Tức|Quyền|Nô Bộc":[["Nhiều tác giả","Tử Tức phi Quyền nhập Nô Bộc: con cái tích cực, thích cạnh tranh, nhiều bạn bè.","Mặt tốt: bạn có xu hướng có con tích cực, nhiều bạn. Mặt xấu: con ham cạnh tranh, dễ va chạm với bạn bè.","cat"]],
"phi|Tử Tức|Kỵ|Nô Bộc":[["Nhiều tác giả","Tử Tức phi Kỵ nhập Nô Bộc: con cái dễ kết bạn xấu, tốn tiền cho bạn bè; quan hệ dễ thị phi, một bên tốt không được đáp lại.","Mặt tốt: bạn có xu hướng có con hào phóng với bạn. Mặt xấu: con dễ kết bạn xấu, tốn tiền vì bạn, quan hệ dễ thị phi, tốt mà không được đáp.","hung"]],
"phi|Tử Tức|Kỵ|Thiên Di":[["Nhiều giáo trình","Kỵ phi từ Tử Tức nhập Thiên Di: con cái sống xa hoặc ít ở gần, tuổi già khó nương nhờ; đừng hùn hạp làm ăn hay đứng ra bảo lãnh.","Mặt tốt: bạn có xu hướng có con tự lập, đi xa lập nghiệp. Mặt xấu: con sống xa, tuổi già khó nương nhờ; hùn hạp làm ăn hay bảo lãnh cho người khác dễ thiệt.","trung"]],
"tuHoa|Tử Tức|Khoa":[["Nhiều tác giả","Tử Tức tự hóa Khoa: con cái thanh tú, nho nhã, có điều hay lưỡng lự.","Mặt tốt: bạn có xu hướng có con thanh tú, nho nhã. Mặt xấu: con hay lưỡng lự, khó quyết.","cat"]],
"tuHoa|Tử Tức|Lộc":[["Cửu cửu bí nghi; Lai Nhân Cung","Tử Tức tự hóa Lộc: con cái tự lập, song dễ đào hoa và thiếu trách nhiệm.","Mặt tốt: bạn có xu hướng có con tự lập. Mặt xấu: con dễ đào hoa và thiếu trách nhiệm.","trung"]],
"tuHoa|Tử Tức|Kỵ":[["Cửu cửu bí nghi; giáo trình Tứ Hóa","Tử Tức tự hóa Kỵ hoặc tự hóa li tâm: phiền não tình cảm, tình duyên; nếu ở Dần Thân Tị Hợi thì thành Tứ mã Kỵ, bôn ba, xa cách người thân.","Mặt tốt: bạn có xu hướng sống tình cảm sâu. Mặt xấu: nhiều phiền não về tình cảm, tình duyên; có khi bôn ba, xa cách người thân.","hung"]],
"mchat|Tử Tức|Điền Trạch":[["Trịnh Mục Đức","M Điền có ở Tử Tức: con cái mong hoặc được hưởng thừa kế nhà đất.","Mặt tốt: bạn có xu hướng có con được hưởng nhà đất. Mặt xấu: chuyện thừa kế dễ thành gánh nặng hoặc mầm bất hòa giữa các con.","cat"]],
"mchat|Tử Tức|Mệnh":[["Trịnh Mục Đức","M Mệnh có ở Tử Tức: có con, đời sống nhiều sắc màu; con cái chính là quý nhân.","Mặt tốt: bạn có xu hướng có con và đời nhiều sắc màu, con là người giúp mình. Mặt xấu: bạn dễ xoay đời mình quanh con, khi con rời xa thì hụt hẫng.","cat"]],
"mchat|Tử Tức|Tật Ách":[["Trịnh Mục Đức","Tử Tức có M Tật: tự mình giáo dục con cái.","Mặt tốt: bạn có xu hướng tự tay dạy dỗ con, sát sao với con. Mặt xấu: việc dạy con dồn lên một mình bạn, dễ mệt và căng thẳng.","trung"]],
"mchat|Tử Tức|Huynh Đệ":[["Trịnh Mục Đức","Tử Tức có M Bào: anh em là quý nhân của con cái.","Mặt tốt: bạn có xu hướng có anh chị em giúp đỡ con mình. Mặt xấu: con dễ dựa vào họ hàng, và chuyện con cái dễ kéo cả nhà vào can thiệp.","cat"]],
"mchat|Tử Tức|Phu Thê":[["Trịnh Mục Đức","Tử Tức có M Phối: con cái lập gia đình là bước ngoặt.","Mặt tốt: bạn có xu hướng thấy con trưởng thành rõ khi con lập gia đình. Mặt xấu: việc con cưới xin là bước ngoặt lớn, có thể đảo lộn nếp nhà và tiền bạc của bạn.","trung"]],
"sao|Lộc Tồn|Tử Tức":[["Phương Ngoại Nhân; Phi tinh Trần Đoàn; Trần Bỉnh Húc","Lộc Tồn nằm ở cung lục thân (Tử Tức) thì khó thân cận, dễ tranh giành, cô quả; nếu đơn thủ thì lẻ loi, được cát tinh đi kèm thì giỏi quản lý tiền.","Mặt tốt: bạn có xu hướng giỏi quản tiền nếu có người tốt bên cạnh. Mặt xấu: với con cái thì khó thân, dễ tranh giành, có lúc lẻ loi.","trung"]],
"sao|Tả Phù|Tử Tức":[["","Hữu Bật, Tả Phù hội ở Tử Tức: lúc chọn người cưới dễ có nhiều phương án, cần thận trọng.","Mặt tốt: bạn có xu hướng có nhiều lựa chọn khi đến chuyện cưới hỏi. Mặt xấu: nhiều lựa chọn thì dễ phân vân, chọn nhầm hoặc vướng nhiều mối cùng lúc.","trung"]],
"phi|Tài Bạch|Lộc|Phu Thê":[["","Lộc phi từ Tài Bạch nhập Phu Thê: kiếm tiền suôn sẻ, rộng rãi với bạn đời; coi chừng chiều chuộng quá đà.","Mặt tốt: bạn có xu hướng kiếm tiền suôn sẻ, rộng rãi với người bạn đời. Mặt xấu: dễ chiều chuộng quá đà, tiền vào chuyện tình cảm nhiều hơn mức nên.","cat"]],
"tuHoa|Tài Bạch|Quyền":[["","Tài Bạch tự hóa Quyền: dòng tiền lên xuống, dễ chi lớn; nên tập thói quen để dành.","Mặt tốt: bạn có xu hướng dám chi lớn khi cần. Mặt xấu: dòng tiền lên xuống thất thường, chi lớn dễ làm hụt quỹ. Gợi ý: tập thói quen để dành.","trung"]],
"tuHoa|Tài Bạch|Khoa":[["Nhiều tác giả","Tài Bạch tự hóa Khoa: không cố theo đuổi tiền nhưng không lãng phí; thu nhập nhỏ, ổn định, đều đặn; tài vận nhìn chung ổn; có kế hoạch tiền bạc, lý trí, hòa thuận với bạn đời.","Mặt tốt: bạn có xu hướng không lãng phí, thu nhập ổn định đều đặn, có kế hoạch tiền bạc và hòa thuận với người bạn đời. Mặt xấu: thu nhập nhỏ, không cố theo đuổi tiền nên khó giàu nhanh.","cat"],["Nhiều tác giả","Không chú tâm quản tiền nên tiền luân chuyển dễ mà sinh phiền; hợp buôn bán nhỏ hoặc làm công; nếu sao Khoa là võ tinh hợp quân cảnh, văn tinh hợp văn hóa.","Mặt tốt: bạn có xu hướng hợp buôn bán nhỏ hoặc làm công, tiền luân chuyển dễ. Mặt xấu: không chú tâm quản tiền nên dễ sinh phiền vì thu chi lộn xộn.","trung"],["Cửu cửu bí nghi","Có thể cô độc, kiêu, duy tâm, hay do dự, cầu toàn, dễ rối.","Mặt tốt: bạn có xu hướng cẩn thận, cầu toàn trong chuyện tiền. Mặt xấu: bạn có thể cô độc, kiêu, hay do dự và dễ rối khi phải quyết.","trung"]],
"phi|Tài Bạch|Khoa|Mệnh":[["","Khoa phi từ Tài Bạch nhập Mệnh: thu nhập đều nhưng không lớn; tiêu theo mức kiếm được.","Mặt tốt: bạn có xu hướng có thu nhập đều đặn. Mặt xấu: thu nhập không lớn, kiếm bao nhiêu tiêu bấy nhiêu.","cat"]],
"phi|Tài Bạch|Kỵ|Mệnh":[["","Kỵ phi từ Tài Bạch nhập Mệnh: kiếm tiền cực nhọc, dễ bị đồng tiền sai khiến; nên tránh cờ bạc, rượu chè, sắc dục.","Mặt tốt: bạn có xu hướng chịu khó vì tiền. Mặt xấu: kiếm tiền cực nhọc, dễ bị đồng tiền sai khiến; dễ sa vào cờ bạc, rượu chè, sắc dục nếu không tự giữ.","hung"]],
"phi|Tài Bạch|Lộc|Tật Ách":[["Huy Hà Phan; Trung Châu","Tài Bạch phi Lộc nhập Tật Ách (Lộc Tật): kiếm tiền dễ, thích hưởng thụ, đầu tư cho bản thân và sức khỏe; thiếu kế hoạch tài chính.","Mặt tốt: bạn có xu hướng kiếm tiền dễ, chịu đầu tư cho bản thân và sức khỏe. Mặt xấu: thích hưởng thụ, thiếu kế hoạch tài chính.","cat"],["Lai Nhân Cung","Tiền vào tay dễ, phúc khí tốt nhưng dễ tăng cân vì ăn uống.","Mặt tốt: bạn có xu hướng tiền vào tay dễ, phúc khí tốt. Mặt xấu: dễ tăng cân vì ăn uống.","cat"],["Bản Hán-Việt; Tinh hoa","Tiền đến nhẹ, ít tích cực, có thể lương cao hoặc hưởng hoa hồng; lạc quan, không tính toán với người.","Mặt tốt: bạn thuộc mẫu người lạc quan, không tính toán với người, tiền đến nhẹ như lương cao hay hoa hồng. Mặt xấu: ít tích cực, dễ trông vào tiền nhẹ mà không xây nền dài hạn.","cat"],["","Nếu đồng thời Tài phi Kỵ nhập Điền: mạnh về thân thể, yếu về nhà cửa và tài sản tích lũy.","Mặt tốt: bạn có xu hướng mạnh về thể chất. Mặt xấu: yếu về nhà cửa và tài sản tích lũy.","trung"]],
"phi|Tài Bạch|Quyền|Tật Ách":[["Huy Hà Phan","Quyền phi từ Tài Bạch nhập Tật Ách (Quyền Tật): năng nổ, hăng say; kiếm tiền vất vả mà thu nhập khá, hợp việc lương cao hoặc ăn hoa hồng; chủ động, quyết đoán.","Mặt tốt: bạn thuộc mẫu người năng nổ, chủ động, quyết đoán, thu nhập khá. Mặt xấu: kiếm tiền vất vả, sức khỏe bị bào mòn vì làm nhiều.","cat"],["Lai Nhân Cung","Coi kiếm tiền là đích đến để thấy mình thành đạt và được nể phục; làm lụng cực nhọc, dạ dày dễ yếu.","Mặt tốt: bạn có xu hướng coi kiếm tiền là đích để thấy mình thành đạt, rất cố gắng. Mặt xấu: làm lụng cực nhọc, dễ đau dạ dày, viêm loét dạ dày. Gợi ý: có dấu hiệu lạ thì đi khám, hỏi bác sĩ.","trung"],["Trung Châu","Thích làm ra tiền rồi hưởng thụ, xài đồ cao cấp, hay đi chơi.","Mặt tốt: bạn có xu hướng làm ra tiền và biết hưởng thụ. Mặt xấu: hay xài đồ cao cấp, đi chơi nhiều nên tiền khó dư.","trung"],["Lương Nhược Du; bản Hán-Việt","Dẻo dai, làm được việc kỹ thuật nặng; khi cách cục đẹp thì thu nhập lớn, đủ sức tự lập nghiệp. Quyền vào Tật Ách cũng cho tính cách mạnh và chín chắn sớm.","Mặt tốt: bạn thuộc mẫu người dẻo dai, chín chắn sớm, làm được việc nặng, có thể thu nhập lớn và tự lập nghiệp. Mặt xấu: tính cách mạnh dễ cứng, và sức khỏe hao mòn vì việc nặng.","cat"]],
"phi|Tài Bạch|Kỵ|Điền Trạch":[["Nhiều tác giả","Kỵ phi từ Tài Bạch nhập Điền Trạch (Kỵ Điền, Thuận thủy Kỵ): giữ tiền kỹ, tằn tiện, tích góp nhờ cần kiệm; cách cục đẹp thì dễ khá giả; tiền phần lớn dành cho nhà cửa, đất đai; đầu tư và tậu nhà hợp mệnh, là tượng tốt.","Mặt tốt: bạn có xu hướng giữ tiền kỹ, cần kiệm, tích góp tốt và dồn tiền cho nhà cửa, đất đai. Mặt xấu: tằn tiện quá thì ít hưởng, tiền nằm im trong nhà đất khi cần lại khó xoay.","cat"],["Nhiều tác giả","Tiền khó đến, khó tụ; không đủ chu cấp gia đình nên hay tính toán; gánh trách nhiệm nhà nhưng cố chấp, mua nhà khó, dễ bủn xỉn, quan niệm bảo thủ khiến tiền dần hao.","Mặt tốt: bạn có xu hướng gánh trách nhiệm với gia đình. Mặt xấu: tiền khó đến, khó tụ, không đủ chu cấp nhà nên hay tính toán; dễ bủn xỉn, cố chấp, mua nhà khó và tiền dần hao.","hung"],["","Tính khép kín, ít giao tiếp xã hội; vất vả vì tiền, có thể hao tiền vì việc chăm sóc người nhà.","Mặt tốt: bạn có xu hướng tận tụy với người nhà. Mặt xấu: tính khép kín, ít giao tiếp, vất vả vì tiền và hao tiền vì chăm sóc người nhà.","trung"]],
"phi|Tài Bạch|Kỵ|Phúc Đức":[["Huy Hà Phan; Nguyễn Anh Vũ; Đại Đức Sơn Nhân","Tài Bạch phi Kỵ nhập Phúc Đức (tự xung Tài): ham hưởng thụ, chi tiêu tùy hứng, khó giữ tiền, dễ mê muội; cần tránh cờ bạc, đầu cơ.","Mặt tốt: bạn có xu hướng biết tận hưởng đời sống. Mặt xấu: chi tiêu tùy hứng, khó giữ tiền, dễ mê muội; dễ sa vào cờ bạc, đầu cơ.","hung"],["Lai Nhân Cung","Tính chao đảo, thu nhập thất thường, vợ chồng dễ cãi nhau vì tiền.","Mặt tốt: bạn có xu hướng linh hoạt theo cảm xúc. Mặt xấu: tính chao đảo, thu nhập thất thường, vợ chồng dễ cãi nhau vì tiền.","hung"],["Tiên thiên tứ hóa phi tinh kỳ phổ","Nếu Phúc Đức có Kỵ năm sinh cùng sao thì thành Nghịch thủy Kỵ: lại được xem là có thể phát đạt nhờ sản xuất, kinh doanh, ngoại giao; hợp kinh doanh, dịch vụ hoặc làm công.","Mặt tốt: bạn có xu hướng có thể phát đạt nhờ sản xuất, kinh doanh, ngoại giao hoặc dịch vụ. Mặt xấu: tiền gắn với cảm hứng nên lúc thịnh lúc suy, dễ mạo hiểm quá tay.","cat"]],
"phi|Tài Bạch|Lộc|Nô Bộc":[["Nhiều tác giả","Tài Bạch phi Lộc nhập Nô Bộc: hào phóng, chi tiêu nhiều cho bạn bè, dựa vào bạn bè kiếm tiền.","Mặt tốt: bạn thuộc mẫu người hào phóng, kiếm tiền nhờ bạn bè. Mặt xấu: chi nhiều cho bạn bè, tiền dễ đi theo các cuộc vui.","cat"]],
"phi|Tài Bạch|Quyền|Tử Tức":[["Nhiều tác giả","Tài Bạch phi Quyền nhập Tử Tức: đầu tư tiền cho con cái, dám tiêu, có thể hợp tác góp vốn.","Mặt tốt: bạn có xu hướng dám đầu tư cho con và có thể hợp tác góp vốn. Mặt xấu: dám tiêu thì dễ tiêu quá, góp vốn chung dễ mất kiểm soát.","trung"]],
"phi|Tài Bạch|Khoa|Phúc Đức":[["Nhiều tác giả","Khoa phi từ Tài Bạch nhập Phúc Đức: tiêu có kế hoạch, sống đơn giản, ít ham muốn.","Mặt tốt: bạn có xu hướng tiêu có kế hoạch, sống đơn giản, ít ham muốn. Mặt xấu: ít ham muốn thì cũng ít động lực làm giàu.","cat"]],
"phi|Tài Bạch|Khoa|Phu Thê":[["Huy Hà Phan; Lai Nhân Cung","Khoa phi từ Tài Bạch nhập Phu Thê: tiền bạc ổn, bạn đời là quý nhân; tiêu pha có tính toán, bỏ tiền học để nâng mình lên, vợ chồng hòa thuận.","Mặt tốt: bạn có xu hướng tiền bạc ổn, người bạn đời giúp mình, chịu bỏ tiền học để nâng mình lên. Mặt xấu: tính toán kỹ quá đôi khi làm chuyện tình cảm thành chuyện sổ sách.","cat"]],
"mchat|Tài Bạch|Điền Trạch":[["Trịnh Mục Đức","M Điền có ở Tài Bạch: tậu nhà đất thì giữ được tiền; đầu tư bất động sản là hợp nhất.","Mặt tốt: bạn có xu hướng giữ được tiền nhờ nhà đất, hợp đầu tư bất động sản. Mặt xấu: tiền dồn vào nhà đất thì kém linh hoạt, gặp lúc thị trường xấu là kẹt.","cat"]],
"mchat|Tài Bạch|Tật Ách":[["Trịnh Mục Đức","M Tật có ở Tài Bạch: sinh ra đã vất vả, phải lao lực cực nhọc mới giữ nổi tiền.","Mặt tốt: bạn có xu hướng chịu khó, giữ được tiền bằng sức mình. Mặt xấu: sinh ra đã vất vả, phải lao lực cực nhọc mới giữ nổi tiền.","trung"]],
"mchat|Tài Bạch|Nô Bộc":[["Trịnh Mục Đức","Tài Bạch có M Nô: kiếm tiền và thành bại đều nhờ bạn bè.","Mặt tốt: bạn có xu hướng kiếm tiền nhờ bạn bè. Mặt xấu: thành cũng nhờ bạn mà bại cũng do bạn, chọn sai người là thiệt.","trung"]],
"mchat|Tài Bạch|Phúc Đức":[["Trịnh Mục Đức","M Phúc có ở Tài Bạch: đầu tư vào chính mình, theo nghề mình thích thì dễ thành.","Mặt tốt: bạn có xu hướng dễ thành khi đầu tư vào chính mình và theo nghề mình thích. Mặt xấu: làm việc không thích thì khó ra tiền.","cat"]],
"mchat|Tài Bạch|Tử Tức":[["Trịnh Mục Đức","M Tử có ở Tài Bạch: khởi nghiệp theo lối hợp tác; tài sản để lại cho con.","Mặt tốt: bạn có xu hướng khởi nghiệp theo lối hợp tác và để lại tài sản cho con. Mặt xấu: phụ thuộc vào đối tác, và chuyện chia tài sản cho con dễ phức tạp.","trung"]],
"sao|Thiên Đồng|Tài Bạch":[["Phi tinh Trần Đoàn; nhiều tác giả","Thiên Đồng ở Tài Bạch: hiền lành, nhiều quý nhân, đa phần tay trắng dựng nghiệp, về sau mới giàu, sống thanh thản; gặp Thiên Mã/Hóa Lộc/Lộc Tồn có thể rất giàu; đầu tư chậm chạp thì dễ lỡ dịp; miếu vượng mà gặp sát thì lúc lên lúc xuống; nếu hãm địa lại gặp Tứ sát, Hình, Kỵ thì dễ đổ vỡ.","Mặt tốt: bạn thuộc mẫu người hiền lành, nhiều người giúp, tay trắng dựng nghiệp rồi về sau mới giàu. Mặt xấu: đầu tư chậm chạp nên dễ lỡ dịp; gặp hoàn cảnh xấu thì lúc lên lúc xuống, có thể đổ vỡ.","cat"]],
"sao|Thất Sát|Tài Bạch":[["Huy Hà Phan; Từ Tăng Sinh; Phi tinh Trần Đoàn; Trần Bỉnh Húc","Thất Sát tại Tài Bạch: tiền đến nhanh đi nhanh, gan dạ mạo hiểm, dễ mê xổ số, đầu cơ; tài vận theo tâm trạng; ở Dần Thân Tý Ngọ chủ hoạnh phát; có Lộc Quyền Khoa thì phú hào; hãm thì phải lao lực.","Mặt tốt: bạn thuộc mẫu người gan dạ, dám mạo hiểm, có thể phát nhanh. Mặt xấu: tiền đến nhanh đi nhanh, dễ mê xổ số, đầu cơ; tài vận theo tâm trạng, lúc yếu phải lao lực.","trung"]],
"sao|Tử Vi|Tài Bạch":[["Nhiều tác giả","Tử Vi tại Tài Bạch: chủ phúc lộc, giỏi tiêu tiền, thích phô trương; có năng lực lãnh đạo, kế hoạch thu tài kỹ, đầu tư chắc, dài hạn; gặp Tả Hữu, Quyền Khoa thì giàu; gặp sát tinh thì vất vả, dễ phá sản; hợp quản lý, kế toán, tiền tệ.","Mặt tốt: bạn có xu hướng có phúc lộc, có năng lực lãnh đạo, đầu tư chắc và dài hạn. Mặt xấu: thích phô trương, chi tiêu mạnh; gặp hoàn cảnh xấu thì vất vả, có nguy cơ đổ vỡ tài chính.","cat"]],
"sao|Văn Khúc|Tài Bạch":[["Từ Tăng Sinh; Phi tinh Trần Đoàn; Trần Bỉnh Húc","Xương Khúc ở Tài Bạch: hợp nghề thiết kế, nghệ thuật, văn chương, báo chí, giảng dạy; miếu vượng có cát tinh thì giàu bền, tiền đến nhờ quý nhân; hễ gặp Không Kiếp, Tứ sát, Hình Kỵ thì tiền khó gom.","Mặt tốt: bạn có xu hướng hợp nghề thiết kế, nghệ thuật, văn chương, báo chí, giảng dạy, tiền đến nhờ người tốt. Mặt xấu: gặp hoàn cảnh xấu thì tiền khó gom, thu nhập bấp bênh.","cat"]],
"sao|Thiên Tướng|Tài Bạch":[["Giáo trình Tứ Hóa; Trần Bỉnh Húc","Thiên Tướng tại Tài Bạch: quản tiền bảo thủ, đầu tư thận trọng, tích lũy dần; miếu vượng thì giàu; hãm hoặc gặp sát thì khó tích lũy, dễ hỏng vì sổ sách.","Mặt tốt: bạn có xu hướng quản tiền thận trọng, tích lũy dần. Mặt xấu: bảo thủ quá dễ lỡ cơ hội; gặp hoàn cảnh xấu thì khó tích lũy, dễ hỏng vì sổ sách.","cat"]],
"sao|Thiên Khôi|Tài Bạch":[["","Khôi Việt hội Tài Bạch: phát tài trong sự thanh nhã, khi khó có quý nhân giúp.","Mặt tốt: bạn có xu hướng kiếm tiền trong sự thanh nhã, khi khó có người giúp. Mặt xấu: bạn dễ trông vào người giúp mà ít tự lo trước.","cat"]],
"snToa|Quyền|Phúc Đức":[["Nhiều tác giả","Phúc Đức có Hóa Quyền năm sinh tọa thủ: chí lớn, thích tự khẳng định, chuộng sang trọng, bề ngoài và vị thế; dễ chi quá tay.","Mặt tốt: bạn thuộc mẫu người có chí lớn, thích tự khẳng định. Mặt xấu: chuộng sang trọng, bề ngoài và vị thế nên dễ chi quá tay.","trung"],["","Khi sao hóa Quyền là Thiên Lương: chú trọng tu dưỡng tâm hồn, thích được người khác phục vụ.","Mặt tốt: bạn có xu hướng chú trọng tu dưỡng tâm hồn. Mặt xấu: bạn thích được người khác phục vụ, dễ bị thấy là kiểu cách.","cat"]],
"snToa|Kỵ|Phúc Đức":[["Các sách Tứ Hóa","Phúc Đức có Hóa Kỵ năm sinh tọa thủ: tâm trí hay lo lắng, chi tiền theo cảm hứng, ít được hưởng phúc tổ.","Mặt tốt: bạn có xu hướng suy nghĩ sâu, để tâm nhiều. Mặt xấu: tâm trí hay lo lắng, chi tiền theo cảm hứng, ít được hưởng phúc từ gia đình.","hung"]],
"canCung|Phúc Đức|Nhâm":[["Ông Phúc Dụ","Phúc Đức can Nhâm (Nhân chi Nhân): độc lập, tự phụ, không chịu thiệt; Phúc tại Tuất (khố vị): cố chấp nhưng trung thành với một nghề.","Mặt tốt: bạn thuộc mẫu người độc lập, trung thành với một nghề. Mặt xấu: tự phụ, cố chấp, không chịu thiệt nên dễ va chạm.","trung"]],
"phi|Phúc Đức|Lộc|Mệnh":[["","Phúc Đức phi Lộc nhập Mệnh: rộng rãi, biết đủ, được tổ tiên phù hộ, sống thọ, thích nhàn; cũng tạo Đối trì Lộc có lợi cho Thiên Di.","Mặt tốt: bạn thuộc mẫu người rộng rãi, biết đủ, thích nhàn và được gia đình phù hộ. Mặt xấu: an nhàn quá dễ thiếu tham vọng, dừng ở mức đủ.","cat"]],
"phi|Phúc Đức|Quyền|Phu Thê":[["Huy Hà; Lai Nhân; Trung Châu; Lương Nhược Du","Quyền phi từ Phúc Đức nhập Phu Thê (Quyền Phối): trong tình cảm chủ động, muốn chi phối và chiếm hữu, có tài lãnh đạo; bạn đời có thể là trợ thủ hoặc lấn lướt.","Mặt tốt: bạn có xu hướng chủ động trong tình cảm, có tài dẫn dắt. Mặt xấu: bạn muốn chi phối và chiếm hữu người yêu; người bạn đời có thể giúp mà cũng có thể lấn lướt bạn.","trung"]],
"phi|Phúc Đức|Khoa|Quan Lộc":[["","Khoa phi từ Phúc Đức nhập Quan Lộc: làm việc đều tay, có kế hoạch; hợp lĩnh vực văn hóa, triết học.","Mặt tốt: bạn có xu hướng làm việc đều tay, có kế hoạch, hợp lĩnh vực văn hóa, triết học. Mặt xấu: nhịp làm đều nên khó bứt phá nhanh.","cat"]],
"phi|Phúc Đức|Kỵ|Quan Lộc":[["","Kỵ phi từ Phúc Đức nhập Quan Lộc (Thuận thủy Kỵ, khí Phúc dồn vào sự nghiệp): làm quá sức kéo theo ảnh hưởng tới hôn nhân; đường sự nghiệp vất vả; tránh hẹp hòi và chọn nhầm nghề.","Mặt tốt: bạn có xu hướng dồn tâm cho sự nghiệp. Mặt xấu: làm quá sức ảnh hưởng tới hôn nhân, đường sự nghiệp vất vả, dễ hẹp hòi và chọn nhầm nghề.","trung"]],
"phi|Phúc Đức|Lộc|Nô Bộc":[["Giáo trình Tứ Hóa; Lương Nhược Du","Phúc Đức phi Lộc nhập Nô Bộc: nhân duyên tốt, bạn bè hữu ích, có năng lực cạnh tranh, làm thiện dễ thành; thích náo nhiệt, lạc quan, kết bạn theo sở thích, ít so đo.","Mặt tốt: bạn thuộc mẫu người nhân duyên tốt, lạc quan, ít so đo, bạn bè hữu ích. Mặt xấu: thích náo nhiệt nên dễ tiêu thời gian, tiền bạc cho các cuộc vui.","cat"],["","Nhiệt tình, hiếu khách nhưng có thể làm việc quá mức thành gánh nặng; người phối ngẫu có danh tiếng, trí tuệ.","Mặt tốt: bạn thuộc mẫu người nhiệt tình, hiếu khách, người bạn đời có danh tiếng. Mặt xấu: làm quá mức cho người khác thành gánh nặng cho mình.","trung"]],
"phi|Phúc Đức|Quyền|Nô Bộc":[["Giáo trình Tứ Hóa","Phúc Đức phi Quyền nhập Nô Bộc: thích thể hiện, coi trọng thể diện, kết giao người có địa vị, nhà giàu; hào phóng nhưng dễ lãng phí, xa xỉ (Quyền xuất), cần đề phòng nịnh bợ.","Mặt tốt: bạn có xu hướng kết giao người có địa vị, hào phóng. Mặt xấu: thích thể hiện, trọng thể diện nên dễ lãng phí, xa xỉ và bị người nịnh bợ lợi dụng.","trung"],["","Giàu sức cạnh tranh và ý chí; bạn bè là người lãnh đạo hoặc chuyên gia; giúp gia đình giỏi, còn đối với người dưới thì thực dụng; hay cố chấp, giành quyền với bạn và đồng nghiệp.","Mặt tốt: bạn thuộc mẫu người giàu ý chí cạnh tranh, có bạn là người giỏi, giúp gia đình tốt. Mặt xấu: thực dụng với người dưới, cố chấp, hay giành quyền với bạn và đồng nghiệp.","trung"]],
"phi|Phúc Đức|Khoa|Tài Bạch":[["","Phúc Đức phi Khoa nhập Tài Bạch: ít ham tiền, chi tiêu có kế hoạch, ghi sổ; thu chi cân bằng, tiền nhỏ dễ xoay vòng; được tổ nghiệp hỗ trợ, tài chính ổn, thích việc ổn định như công chức.","Mặt tốt: bạn có xu hướng ít ham tiền, thu chi cân bằng, tài chính ổn, thích việc ổn định. Mặt xấu: an toàn quá nên tiền khó lớn.","cat"],["","Mặt tiêu cực: có khi cô độc, kiêu, cầu toàn, lưỡng lự, dễ rối.","Mặt tốt: bạn có xu hướng cẩn thận, cầu toàn. Mặt xấu: có khi cô độc, kiêu, lưỡng lự và dễ rối.","trung"]],
"phi|Phúc Đức|Kỵ|Mệnh":[["","Phúc Đức phi Kỵ nhập Mệnh (Thuận thủy Kỵ): cố chấp, dễ lo âu, tự chuốc phiền não; nên sống ẩn, buông bỏ dần.","Mặt tốt: bạn có xu hướng sống sâu, nghĩ kỹ. Mặt xấu: cố chấp, dễ lo âu, tự chuốc phiền não.","trung"],["","Khó hòa đồng với bạn đời, khó nắm tài chính của họ; có Quyền thì khó lấy tiền từ phối ngẫu.","Mặt tốt: bạn có xu hướng tự lo phần mình. Mặt xấu: khó hòa đồng với người bạn đời, khó nắm hay nhờ được tài chính của người ấy.","trung"],["","Mệnh đối Tật Ách nên dễ cực đoan: tự lập mà cô lập, kiếm tiền bằng đường chính đáng; cứng nhắc, vì chuyện nhỏ mà hỏng chuyện lớn.","Mặt tốt: bạn thuộc mẫu người tự lập, kiếm tiền bằng đường chính đáng. Mặt xấu: dễ cực đoan, tự lập mà thành cô lập, cứng nhắc, vì chuyện nhỏ hỏng chuyện lớn.","trung"],["Nhiều bản","Nền tâm thức nặng, nhiều lo âu, yêu ghét cực đoan; bụng dạ hẹp, hay so đo, tâm không yên, thích hưởng thụ, dễ tiêu tiền; nên tránh cờ bạc, đầu cơ.","Mặt tốt: bạn có xu hướng sống hết mình với cảm xúc. Mặt xấu: nhiều lo âu, yêu ghét cực đoan, hay so đo, tâm không yên, dễ tiêu tiền vào hưởng thụ; dễ sa vào cờ bạc, đầu cơ.","hung"]],
"phi|Phúc Đức|Lộc|Tật Ách":[["Huy Hà; Lai Nhân; Trung Châu; Lương Nhược Du","Phúc Đức phi Lộc nhập Tật Ách (Lộc Tật): phúc ấm, biết hưởng thụ nhưng dễ lười vận động.","Mặt tốt: bạn có xu hướng có phúc, biết hưởng thụ. Mặt xấu: dễ lười vận động.","cat"]],
"phi|Phúc Đức|Kỵ|Thiên Di":[["Huy Hà; Lai Nhân; Trung Châu; Lương Nhược Du","Phúc Đức phi Kỵ nhập Thiên Di: giao tế kém, ra ngoài dễ gặp sự cố, hôn nhân dễ rạn; nếu Thiên Di phi Lộc lại Phúc Đức thì thành Thị phi Kỵ.","Mặt tốt: bạn có xu hướng để tâm nhiều tới thế giới bên ngoài. Mặt xấu: giao tế kém, ra ngoài dễ gặp sự cố, hôn nhân dễ rạn.","hung"]],
"phi|Phúc Đức|Khoa|Tử Tức":[["Giáo trình Tứ Hóa","Khoa phi từ Phúc Đức nhập Tử Tức: con cái được dạy dỗ về văn hóa, tinh thần theo cách dân chủ.","Mặt tốt: bạn có xu hướng dạy con theo cách dân chủ, chú trọng văn hóa, tinh thần. Mặt xấu: lỏng tay quá thì con thiếu kỷ luật.","cat"]],
"phi|Phúc Đức|Kỵ|Tật Ách":[["Giáo trình Tứ Hóa","Kỵ phi từ Phúc Đức nhập Tật Ách: lo cho sức khỏe thái quá, dễ tự hành hạ mình; nếu sao hóa Kỵ là Thái Âm thì ưa sạch, thích chưng diện, hay ngờ vực sức khỏe bản thân.","Mặt tốt: bạn có xu hướng để ý sức khỏe. Mặt xấu: lo cho sức khỏe thái quá, dễ rối loạn lo âu, mất ngủ, hay ngờ vực cơ thể. Gợi ý: có triệu chứng thì hỏi bác sĩ thay vì tự đoán.","trung"]],
"tuHoa|Phúc Đức|Khoa":[["Cửu cửu; Huy Hà; Lai Nhân; Trung Châu; Lương Nhược Du","Phúc Đức tự hóa Khoa: có tu dưỡng nhưng lưỡng lự, hay sầu, dễ cô đơn.","Mặt tốt: bạn có xu hướng có tu dưỡng. Mặt xấu: lưỡng lự, hay sầu, dễ cô đơn.","trung"]],
"mchat|Phúc Đức|chat":[["Trịnh Mục Đức","M chất có ở Phúc Đức: được hưởng của cải gia đình, theo đuổi giấc mơ.","Mặt tốt: bạn có xu hướng được hưởng của cải gia đình và theo đuổi giấc mơ. Mặt xấu: dựa vào nền nhà thì dễ thiếu sức chịu khó khi phải tự lo.","cat"]],
"mchat|Phúc Đức|Mệnh":[["Trịnh Mục Đức","M Mệnh có ở Phúc Đức: hưởng phúc báo tổ tiên, theo đuổi giấc mơ.","Mặt tốt: bạn có xu hướng được hưởng phúc từ gia đình, có thể theo đuổi giấc mơ. Mặt xấu: mơ nhiều mà ít thực tế, dễ lơ chuyện cơm áo.","cat"]],
"mchat|Phúc Đức|Phu Thê":[["Trịnh Mục Đức","Phúc Đức có M Phối: hôn nhân ổn định; chọn bạn đời kỹ.","Mặt tốt: bạn có xu hướng có hôn nhân ổn định, chọn người kỹ. Mặt xấu: kỹ quá nên chậm, dễ bỏ lỡ.","cat"]],
"mchat|Phúc Đức|Quan Lộc":[["Trịnh Mục Đức","Phúc Đức có M Quan: sự nghiệp gắn với sở thích.","Mặt tốt: bạn có xu hướng làm sự nghiệp gắn với sở thích. Mặt xấu: gặp việc không thích thì chán nhanh, khó gắng.","cat"]],
"mchat|Phúc Đức|Nô Bộc":[["Trịnh Mục Đức","Phúc Đức có M Nô: nhờ bạn bè kiếm tiền, bạn bè là quý nhân.","Mặt tốt: bạn có xu hướng kiếm tiền nhờ bạn bè, bạn là người giúp. Mặt xấu: lệ thuộc vào quan hệ, mất bạn là mất đường kiếm.","cat"]],
"mchat|Phúc Đức|Tài Bạch":[["Trịnh Mục Đức","M Tài có ở Phúc Đức: tự bỏ vốn thì có phúc báo, chú tâm sự nghiệp để làm ra tiền.","Mặt tốt: bạn có xu hướng có phúc khi tự bỏ vốn và chú tâm vào sự nghiệp. Mặt xấu: tự bỏ vốn thì tự chịu rủi ro, lỗ là mất của mình.","cat"]],
"mchat|Phúc Đức|Thiên Di":[["Trịnh Mục Đức","Phúc Đức có M Di: thích xuất ngoại, đi xa.","Mặt tốt: bạn có xu hướng thích đi xa, ra nước ngoài, mở mang tầm nhìn. Mặt xấu: ham đi nên khó yên một chỗ, tốn kém cho việc đi lại.","cat"]],
"mchat|Phúc Đức|Tật Ách":[["Trịnh Mục Đức","Phúc Đức có M Tật: kiên trì sự nghiệp, lao tâm.","Mặt tốt: bạn có xu hướng kiên trì với sự nghiệp. Mặt xấu: lao tâm, đầu óc ít khi được nghỉ.","trung"]],
"sao|Thiên Lương|Phúc Đức":[["Nhiều tác giả","Thiên Lương tại Phúc Đức: tùy vị trí cho phúc, thọ hay vất vả; hội Thiên Đồng, Thái Âm, sát tinh, Hóa Kỵ thì thay đổi tính chất; nếu là kỵ thần thì bất lợi.","Mặt tốt: bạn có xu hướng có phúc hoặc thọ tùy hoàn cảnh. Mặt xấu: gặp hoàn cảnh xấu thì đời vất vả, phúc bị giảm.","trung"]],
"sao|Thiên Phủ|Phúc Đức":[["Trần Đoàn; Trần Bỉnh Húc; Sở Hoàng","Thiên Phủ ở Phúc Đức: cẩn trọng, điềm tĩnh, ôn hòa, được hưởng phúc; đứng riêng tại Tý, Hợi thì phúc thọ vẹn toàn, tại Sửu, Mùi, Mão, Dậu thì kém hơn; gặp Tử Vi thì đời vui; gặp sát tinh và Hóa Kỵ thì nhọc lòng.","Mặt tốt: bạn thuộc mẫu người cẩn trọng, điềm tĩnh, ôn hòa, được hưởng phúc. Mặt xấu: gặp hoàn cảnh xấu thì nhọc lòng, khó yên.","cat"]],
"sao|Liêm Trinh|Phúc Đức":[["Hà Lạc; Trần Đoàn; Trần Bỉnh Húc; Sở Hoàng","Liêm Trinh ở Phúc Đức: bôn ba, nhọc lòng; đồng cung với sao tốt thì có phúc; Liêm Phủ thì lộc hơn phúc, biết tự tìm vui; Liêm Tướng thì có phúc để hưởng mà lo chuyện con; Liêm Trinh hóa Kỵ thì trong lòng hay buồn phiền.","Mặt tốt: bạn có xu hướng biết tự tìm niềm vui, có lúc có phúc để hưởng. Mặt xấu: đời bôn ba, nhọc lòng, hay buồn phiền và lo chuyện con.","trung"]],
"sao|Tả Phù|Phúc Đức":[["Trần Đoàn; Trần Bỉnh Húc; Đẩu số cung vị","Tả Phù (và Hữu Bật) tại Phúc Đức: hậu vận yên ổn, biết hưởng thụ, lạc quan; gặp sát tinh thì phúc giảm.","Mặt tốt: bạn có xu hướng có hậu vận yên ổn, lạc quan, biết hưởng thụ. Mặt xấu: gặp hoàn cảnh xấu thì phúc giảm rõ.","cat"]],
"sao|Lộc Tồn|Phúc Đức":[["Phi tinh Trần Đoàn","Lộc Tồn tại Phúc Đức: cả đời được nhiều phúc, an nhàn, hòa thuận với người.","Mặt tốt: bạn có xu hướng cả đời được nhiều phúc, an nhàn, hòa thuận với người. Mặt xấu: an nhàn nên ít va chạm, dễ thiếu sức bật khi gặp biến.","cat"]],
"sao|Thiên Khôi|Phúc Đức":[["","Khôi Việt ở Phúc Đức: được quý nhân giúp đỡ.","Mặt tốt: bạn có xu hướng được người tốt giúp đỡ. Mặt xấu: dễ ỷ lại vào sự giúp đỡ ấy.","cat"]],
"sao|Thiên Riêu|Phúc Đức":[["","Thiên Riêu ở Phúc Đức: tâm trí dễ rối.","Mặt tốt: bạn có xu hướng nhạy cảm, giàu tưởng tượng. Mặt xấu: tâm trí dễ rối, khó tĩnh.","trung"]],
"sao|Linh Tinh|Phúc Đức":[["Sở Hoàng","Linh Tinh ở Phúc Đức: xử sự nhiều tâm cơ, đời không an tịnh.","Mặt tốt: bạn có xu hướng tinh ý, nhiều toan tính. Mặt xấu: xử sự nhiều tâm cơ, đời không yên tĩnh.","trung"]],
"sao|Văn Xương|Phúc Đức":[["Trần Bỉnh Húc; Sở Hoàng","Văn Xương ở Phúc Đức: phúc lộc vinh xương hoặc xử thế có nghệ thuật.","Mặt tốt: bạn có xu hướng có phúc lộc hoặc xử thế khéo léo. Mặt xấu: khéo quá đôi khi bị cho là màu mè.","cat"]],
"snToa|Lộc|Điền Trạch":[["Nhiều tác giả","Hóa Lộc năm sinh tọa Điền Trạch: gia đình đầm ấm, kinh tế tốt, dễ hưởng tổ nghiệp hoặc tự mua được nhà đất, hợp kinh doanh bất động sản; nhà đẹp nhưng hay bừa bộn; có duyên và trách nhiệm với gia đình.","Mặt tốt: bạn có xu hướng có gia đình đầm ấm, kinh tế tốt, dễ có nhà đất và có trách nhiệm với gia đình. Mặt xấu: nhà đẹp nhưng hay bừa bộn, dễ chi nhiều cho chuyện nhà.","cat"],["","Có nhà lớn nhưng không nhất thiết đứng tên; nhà ở nằm trong vòng kinh doanh là khởi đầu thành công.","Mặt tốt: bạn có xu hướng có nhà lớn, dùng nhà làm điểm khởi đầu kinh doanh. Mặt xấu: nhà không nhất thiết đứng tên mình, quyền sở hữu dễ lơ mơ.","cat"]],
"snToa|Quyền|Điền Trạch":[["Nhiều tác giả","Điền Trạch có Hóa Quyền năm sinh tọa thủ: cầm quyền trong nhà, ưa sắm nhiều bất động sản, trang hoàng và khoe nhà; có thể mở cửa hàng hoặc cho thuê ngay tại nhà; dễ va chạm với người thân; nhà khang trang là bước mở đầu sự nghiệp.","Mặt tốt: bạn có xu hướng cầm quyền trong nhà, ưa sắm bất động sản, có thể kinh doanh hay cho thuê ngay tại nhà. Mặt xấu: thích khoe nhà và dễ va chạm với người thân vì quyền trong nhà.","cat"],["","Lộc và Quyền năm sinh cùng tọa Điền: tài lợi phát đạt, lợi hơn danh, hợp kinh doanh nhanh; cách thành thì buôn bán giỏi, cách bại thì nhu nhược phải nhờ người.","Mặt tốt: bạn có xu hướng tài lợi phát đạt, hợp kinh doanh nhanh. Mặt xấu: lợi hơn danh; khi không thuận thì nhu nhược, phải nhờ người.","cat"]],
"tuHoa|Điền Trạch|Khoa":[["Nhiều tác giả","Điền Trạch tự hóa Khoa: chi tiêu khiêm tốn, đúng việc; gia đình có danh tiếng, khí chất thư hương, nhà trang nhã; nhờ người giúp mà có bất động sản. Lộc đi cùng Khoa thì biết tiết chế; Quyền đi cùng Khoa thì được quý nhân đề bạt nhưng phần nhiều là hỗ trợ tinh thần.","Mặt tốt: bạn có xu hướng chi tiêu khiêm tốn, gia đình có danh tiếng, nhà trang nhã, nhờ người giúp mà có nhà đất. Mặt xấu: sự giúp đỡ phần nhiều là tinh thần, thực lợi không lớn.","cat"]],
"phi|Điền Trạch|Kỵ|Tử Tức":[["Giáo trình Tứ Hóa","Kỵ phi từ Điền Trạch nhập Tử Tức (Lưu xuất Kỵ, tự xung Điền): tiền đi ra khỏi nhà, của cải chẳng nên ôm giữ; con cái gánh vác việc nhà; đời lắm thăng trầm, có lúc phải dọn nhà; nên tính chuyện hưu trí, mua bảo hiểm khi còn khỏe.","Mặt tốt: bạn có xu hướng không ôm giữ của, có con gánh vác việc nhà. Mặt xấu: tiền đi ra khỏi nhà, đời lắm thăng trầm, có lúc phải dọn nhà. Gợi ý: lo chuyện hưu trí, bảo hiểm khi còn khỏe.","hung"],["Trần Bỉnh Húc","Có tổ nghiệp hay không còn tùy sao tốt hay sát tinh chiếu vào; nhiều chuyện tình cảm, người phối ngẫu có thể đã từng có gia đình.","Mặt tốt: bạn có xu hướng có thể có nền gia đình tùy hoàn cảnh. Mặt xấu: nhiều chuyện tình cảm, người bạn đời có thể đã từng có gia đình.","trung"]],
"phi|Điền Trạch|Lộc|Phúc Đức":[["","Điền Trạch phi Lộc nhập Phúc Đức: gia đình hỗ trợ, có thừa kế tổ nghiệp, nhà rộng, sống thoải mái, nhà đất tăng giá.","Mặt tốt: bạn có xu hướng được gia đình hỗ trợ, có thừa kế, nhà rộng, sống thoải mái. Mặt xấu: sống thoải mái nhờ nhà dễ khiến bạn ít tự gắng.","cat"]],
"phi|Điền Trạch|Quyền|Phụ Mẫu":[["","Quyền phi từ Điền Trạch nhập Phụ Mẫu: nhà có thế lực trong xã hội, cha mẹ có uy tín, nhà đất đáng giá, hợp buôn bán bất động sản; tránh để gia tộc quá cứng rắn. Xét đại vận thì còn đọc là 'có thành tựu, quang minh'.","Mặt tốt: bạn có xu hướng có nhà có thế lực, cha mẹ có uy tín, nhà đất đáng giá. Mặt xấu: gia tộc cứng rắn, nhiều quy tắc, dễ ép bạn theo khuôn nhà.","cat"]],
"phi|Điền Trạch|Khoa|Nô Bộc":[["","Khoa phi từ Điền Trạch nhập Nô Bộc: nhà có tiếng tốt, hàng xóm êm thấm, bạn bè qua lại giúp nhau; hợp làm kế toán, quản lý tài vụ hoặc nghề nhà đất.","Mặt tốt: bạn có xu hướng có nhà tiếng tốt, hàng xóm êm thấm, hợp làm kế toán, tài vụ, nhà đất. Mặt xấu: lo giữ tiếng nhà nên dễ ngại va chạm cần thiết.","cat"]],
"phi|Điền Trạch|Lộc|Tật Ách":[["","Điền Trạch phi Lộc nhập Tật Ách: gia đình hòa thuận, cuộc sống an nhàn, hưởng khoái lạc thân thể; hợp kết hợp nhà ở với kinh doanh; được chiều nên dễ lười, thiếu tự lập, ăn nhiều dễ béo.","Mặt tốt: bạn có xu hướng có gia đình hòa thuận, sống an nhàn. Mặt xấu: được chiều nên dễ lười, thiếu tự lập, ăn nhiều dễ béo.","cat"]],
"phi|Điền Trạch|Quyền|Tài Bạch":[["","Điền Trạch phi Quyền nhập Tài Bạch: gia đình hoạt lực, kinh tế mạnh, giỏi quản tài chính, người nhà thích quyền và được ủng hộ; mua nhà dựa vào sức mình, đầu tư bằng tiền nhà; dễ xa xỉ vì Quyền xuất.","Mặt tốt: bạn có xu hướng có gia đình kinh tế mạnh, giỏi quản tài chính, tự mua nhà bằng sức mình. Mặt xấu: dễ xa xỉ, người nhà thích quyền nên hay tranh phần quyết định.","cat"]],
"phi|Điền Trạch|Kỵ|Quan Lộc":[["Huy Hà Phan; Lai Nhân Cung; Trung Châu; Lương Nhược Du","Điền Trạch phi Kỵ nhập Quan Lộc (Thuận thủy Kỵ): gánh trách nhiệm gia đình, thường là con trưởng; sự nghiệp bị kìm hãm, gia đình ít hỗ trợ, nên tự lập; hợp việc ổn định, dịch vụ hoặc buôn nhỏ, tách cửa hàng khỏi nhà ở; vợ chồng ít gần nhau.","Mặt tốt: bạn có xu hướng gánh trách nhiệm gia đình, tự lập. Mặt xấu: sự nghiệp bị kìm hãm, gia đình ít hỗ trợ, vợ chồng ít gần nhau.","trung"],["Ông Phúc Dụ; Trung Châu","Dùng vốn nhà để làm ăn, hụt vốn thì dễ rắc rối; khi tậu nhà chớ để bạn đời đứng tên.","Mặt tốt: bạn có xu hướng dám dùng vốn nhà để làm ăn. Mặt xấu: hụt vốn thì dễ rắc rối lớn trong nhà. Gợi ý: khi tậu nhà, cẩn trọng chuyện đứng tên.","hung"],["","Khi Kỵ là sao đồng loại (cùng loại với chủ đề) nhập Quan Lộc: đi làm kiếm tiền, thuộc tượng tốt.","Mặt tốt: bạn có xu hướng đi làm kiếm tiền thuận, đây là dấu hiệu tốt. Mặt xấu: tiền gắn chặt với công việc, nghỉ việc là hụt.","cat"]],
"phi|Điền Trạch|Lộc|Mệnh":[["Đồng bộ đoạn quyết; Huy Hà; Lai Nhân; Trung Châu; Lương Nhược Du","Lộc phi từ Điền Trạch nhập Mệnh: gia thế khá, được hưởng phúc, dễ có nhà đất; xét đại vận thì ứng vào những năm thuận.","Mặt tốt: bạn có xu hướng có gia thế khá, được hưởng phúc, dễ có nhà đất. Mặt xấu: dựa vào nền nhà thì dễ chủ quan.","cat"]],
"phi|Điền Trạch|Quyền|Nô Bộc":[["Huy Hà; Lai Nhân; Trung Châu; Lương Nhược Du","Quyền phi từ Điền Trạch nhập Nô Bộc: giao thiệp với người có quyền thế; buôn bán sỉ hoặc làm bất động sản thì có lời.","Mặt tốt: bạn có xu hướng giao thiệp với người có quyền thế, buôn sỉ hay làm nhà đất có lời. Mặt xấu: phụ thuộc vào người có quyền thì dễ bị cuốn theo thế của họ.","cat"]],
"phi|Điền Trạch|Lộc|Thiên Di":[["Giáo trình Tứ Hóa","Lộc phi từ Điền Trạch nhập Thiên Di: gia thế khá, tài sản tăng lên, hay đổi chỗ ở, có dịp đi xa.","Mặt tốt: bạn có xu hướng có gia thế khá, tài sản tăng, có dịp đi xa. Mặt xấu: hay đổi chỗ ở, khó yên một nơi.","cat"]],
"phi|Điền Trạch|Khoa|Tử Tức":[["Lai Nhân Cung 144 quyết","Khoa phi từ Điền Trạch nhập Tử Tức: nếp nhà thư hương, con cái lịch thiệp, có điều dễ mộng mơ xa rời thực tế.","Mặt tốt: bạn có xu hướng có nếp nhà thư hương, con cái lịch thiệp. Mặt xấu: con dễ mộng mơ, xa rời thực tế.","cat"]],
"mchat|Điền Trạch|chat":[["Trịnh Mục Đức","Điền Trạch có M chất: kiếm tiền từ bất động sản; hoặc ưu tiên ước mơ hơn tiền, được phúc tổ.","Mặt tốt: bạn có xu hướng kiếm tiền từ nhà đất, hoặc được phúc nhà để theo đuổi ước mơ. Mặt xấu: ưu tiên ước mơ hơn tiền thì dễ thiếu thực tế.","cat"]],
"mchat|Điền Trạch|Quan Lộc":[["Trịnh Mục Đức","Điền Trạch có M Quan: nhà gần chỗ làm, có thể mua đất tự xây công ty.","Mặt tốt: bạn có xu hướng có nhà gần chỗ làm, có thể mua đất xây công ty. Mặt xấu: nhà và việc dính nhau, khó tách đời riêng khỏi công việc.","cat"]],
"mchat|Điền Trạch|Tài Bạch":[["Trịnh Mục Đức","M Tài có ở Điền Trạch: có tiền là tậu nhà; làm bất động sản thu được nhiều.","Mặt tốt: bạn có xu hướng có tiền là tậu nhà, làm nhà đất thu được nhiều. Mặt xấu: tiền dồn hết vào nhà đất thì thiếu tiền mặt khi cần.","cat"]],
"mchat|Điền Trạch|Tật Ách":[["Trịnh Mục Đức","Điền Trạch có M Tật: tự mua đất, nhà, nhờ vậy giữ được tiền.","Mặt tốt: bạn có xu hướng tự mua đất, nhà và nhờ vậy giữ được tiền. Mặt xấu: tự lo hết nên vất vả, ít được ai đỡ.","cat"]],
"mchat|Điền Trạch|Nô Bộc":[["Trịnh Mục Đức","Điền Trạch có M Nô: mua nhà cùng bạn bè hoặc qua bạn bè.","Mặt tốt: bạn có xu hướng mua nhà cùng bạn bè hoặc qua bạn bè. Mặt xấu: tài sản chung với người ngoài dễ sinh tranh chấp về sau.","trung"]],
"mchat|Điền Trạch|Phụ Mẫu":[["Trịnh Mục Đức","Điền Trạch có M Phụ: nhận tiền hoặc nhà đất từ cha mẹ.","Mặt tốt: bạn có xu hướng nhận được tiền hoặc nhà đất từ cha mẹ. Mặt xấu: dễ bị ràng buộc bởi điều kiện của cha mẹ đi kèm.","cat"]],
"mchat|Điền Trạch|Phúc Đức":[["Trịnh Mục Đức","Điền Trạch có M Phúc: lo nhà cửa để kiếm tiền, nhà là nguồn vui.","Mặt tốt: bạn có xu hướng lấy nhà làm nguồn vui và nguồn kiếm tiền. Mặt xấu: dồn tâm cho nhà quá thì ít không gian cho việc khác.","cat"]],
"mchat|Điền Trạch|Tử Tức":[["Trịnh Mục Đức","Điền Trạch có M Tử: mua nhà đất cho con.","Mặt tốt: bạn có xu hướng mua được nhà đất cho con. Mặt xấu: lo cho con quá thì phần mình bị thiếu, nhất là lúc về già.","cat"]],
"sao|Thái Âm|Điền Trạch":[["Trần Đoàn; Trần Bỉnh Húc; Sở Hoàng","Thái Âm tại Điền Trạch: miếu vượng thì nhiều điền sản, có tổ nghiệp; hãm và gặp sát thì gần như không có, phải tự xây; Thái Âm Hóa Lộc là kho tiền, hợp tác làm cổ đông; cung khí đại cát thì có điền sản, đại hung cần đại vận cứu.","Mặt tốt: bạn có xu hướng có nhiều nhà đất, có của để lại, hợp góp vốn làm cổ đông. Mặt xấu: nếu nền yếu thì gần như không có sẵn, phải tự xây từ đầu.","cat"]],
"sao|Thiên Đồng|Điền Trạch":[["Nhiều tác giả","Thiên Đồng tại Điền Trạch: trước ít sau nhiều, tự lập thì thịnh; miếu thì trước khó sau thuận, hãm thì về già mới có; có tổ nghiệp nhưng không quá thích mua; gặp sát thì khó có; Đồng Âm ở Tý tay trắng làm nên giàu lớn.","Mặt tốt: bạn có xu hướng trước ít sau nhiều, tự lập thì thịnh, có thể tay trắng làm nên. Mặt xấu: thời trẻ khó, có người về già mới có nhà; gặp hoàn cảnh xấu thì khó có.","cat"]],
"sao|Thất Sát|Điền Trạch":[["","Thất Sát tại Điền Trạch: có Hóa Lộc có thể phát phú; miếu thì hưởng tổ nghiệp, hãm dễ trắng tay, làm hao tổ nghiệp.","Mặt tốt: bạn có xu hướng có thể phát mạnh nhờ nhà đất, có khi được hưởng của để lại. Mặt xấu: khi yếu thế thì dễ trắng tay, làm hao phần của cha ông.","trung"]],
"sao|Hỏa Tinh|Điền Trạch":[["","Hỏa Tinh ở Điền Trạch: đơn thủ thì rời bỏ tổ nghiệp; có cát tinh thì trước cực sau sướng; gặp Không Kiếp thì mất trắng.","Mặt tốt: bạn có xu hướng trước cực sau sướng nếu có người tốt giúp. Mặt xấu: dễ rời bỏ của nhà để lại; gặp hoàn cảnh xấu có thể mất trắng.","trung"]],
"sao|Đà La|Điền Trạch":[["Trần Đoàn; Trần Bỉnh Húc","Đà La, Không Kiếp ở Điền Trạch: xa quê, khó gây dựng sản nghiệp, gặp hung tinh dễ mất trắng; có Khôi Việt thì tùy cát hung mà hoặc thừa hưởng tổ nghiệp, hoặc tự gây dựng.","Mặt tốt: bạn có xu hướng tự gây dựng được ở nơi khác nếu có người giúp. Mặt xấu: xa quê, khó gây dựng sản nghiệp, gặp lúc xấu dễ mất trắng.","hung"]],
"sao|Âm Sát|Điền Trạch":[["","Âm Sát ở Điền Trạch: trong nhà dễ có chuyện tâm linh lạ hoặc còn ám ảnh vì mất người thân; hội Hỏa Tinh thì dễ bị trộm.","Mặt tốt: bạn có xu hướng nhạy cảm với không khí trong nhà. Mặt xấu: trong nhà dễ có cảm giác nặng nề, ám ảnh vì mất người thân, và dễ bị trộm.","trung"]],
"canCung|Tật Ách|Ất":[["Ông Phúc Dụ","Can Ất ở Tật Ách (Thiên chi Địa): thân và tâm dễ được phụ nữ quan tâm, chăm sóc.","Mặt tốt: bạn có xu hướng được phụ nữ quan tâm, chăm sóc cả thân lẫn tâm. Mặt xấu: dễ dựa vào sự chăm sóc ấy, tự lo cho mình kém.","cat"]],
"snToa|Khoa|Tật Ách":[["Nhiều tác giả","Tật Ách có Hóa Khoa năm sinh tọa thủ: dáng người thanh tú, cử chỉ hòa nhã, ít nóng tính; ít bệnh nặng, có bệnh thì gặp thầy thuốc giỏi (Khoa giải nạn sau khi sự việc xảy ra); sáng dạ, đa sầu đa cảm; mong được kế thừa, sự nghiệp có thể bước lên tầm cao mới.","Mặt tốt: bạn thuộc mẫu người thanh tú, hòa nhã, sáng dạ, ít bệnh nặng, có bệnh thì gặp thầy giỏi. Mặt xấu: đa sầu đa cảm, và cái tốt thường đến sau khi chuyện đã xảy ra chứ không chặn trước.","cat"]],
"phi|Tật Ách|Lộc|Tài Bạch":[["","Lộc phi từ Tật Ách nhập Tài Bạch: làm ra tiền nhẹ nhàng, thích hưởng thụ, quý nhân là người trên; dễ chi tiêu tùy hứng.","Mặt tốt: bạn có xu hướng làm ra tiền nhẹ nhàng, được người trên giúp. Mặt xấu: thích hưởng thụ, chi tiêu tùy hứng.","cat"]],
"phi|Tật Ách|Quyền|Mệnh":[["Nhiều tác giả","Tật Ách phi Quyền nhập Mệnh: thể chất khỏe, nhiều sức sống, chịu áp lực, thích vận động, dám chi; cá tính mạnh, thích nổi bật, hay chỉ huy, độc đoán, dễ va chạm lúc trẻ, vất vả vì gia đình.","Mặt tốt: bạn thuộc mẫu người khỏe, nhiều sức sống, chịu áp lực tốt, thích vận động. Mặt xấu: cá tính mạnh, thích chỉ huy, độc đoán, dễ va chạm lúc trẻ và vất vả vì gia đình.","trung"]],
"phi|Tật Ách|Khoa|Quan Lộc":[["Nhiều tác giả","Tật Ách phi Khoa nhập Quan Lộc: làm việc chậm rãi, tỉ mỉ, có hệ thống, kế hoạch rõ; việc nhẹ, hòa hợp đồng nghiệp, hài lòng công việc; chức vụ không lớn; dễ mệt nếu lao tâm.","Mặt tốt: bạn có xu hướng làm việc tỉ mỉ, có hệ thống, hòa hợp đồng nghiệp. Mặt xấu: chức vụ không lớn, và dễ mệt nếu phải lao tâm nhiều.","cat"]],
"phi|Tật Ách|Kỵ|Nô Bộc":[["Nhiều tác giả","Tật Ách phi Kỵ nhập Nô Bộc (Thuận thủy Kỵ): giao tiếp lạnh nhạt, nhân duyên kém, sức khỏe dễ sa sút; không tiết kiệm, chơi với bạn không tiếc tiền, có thể nợ bạn bè; thời trẻ dễ giao du bạn xấu; vợ chồng có thể đồng sàng dị mộng.","Mặt tốt: bạn có xu hướng chơi với bạn hết lòng, không tiếc tiền. Mặt xấu: giao tiếp lạnh nhạt, nhân duyên kém, sức khỏe dễ sa sút, có thể nợ bạn bè; vợ chồng dễ chung giường mà khác lòng.","hung"],["Bản Hán-Việt","Không thích thân mật vội vàng; nên chú ý sức khỏe; một số sách khuyên ngủ riêng để tránh vợ chồng xa cách.","Mặt tốt: bạn có xu hướng thận trọng, không thân mật vội. Mặt xấu: dễ bị thấy là xa cách, vợ chồng dễ nguội lạnh, sức khỏe cần để ý.","trung"],["Tiên thiên tứ hóa phi tinh kỳ phổ","Nếu Nô Bộc phi Lộc lại Tật Ách thì thành Thị phi Kỵ: hai bên đối đãi không cân xứng.","Mặt tốt: bạn có xu hướng để tâm nhiều tới bạn bè. Mặt xấu: quan hệ với bạn lệch, hai bên đối đãi không cân xứng nên dễ hụt hẫng.","trung"]],
"phi|Tật Ách|Lộc|Mệnh":[["Nhiều tác giả","Lộc phi từ Tật Ách nhập Mệnh: thân thể có phúc trạch, lạc quan, nhân duyên tốt, rộng lượng, sĩ diện; ham ăn, dễ mập, ngại vận động; vận nhà tốt, hiếm bệnh mãn tính, có lộc ăn uống.","Mặt tốt: bạn thuộc mẫu người lạc quan, rộng lượng, nhân duyên tốt, ít bệnh mãn tính, có lộc ăn uống. Mặt xấu: ham ăn, dễ mập, ngại vận động nên dễ mắc mỡ máu, gút, tiểu đường; sĩ diện. Gợi ý: có dấu hiệu lạ thì đi khám, hỏi bác sĩ.","cat"]],
"phi|Tật Ách|Lộc|Tử Tức":[["Huy Hà; Lai Nhân; Trung Châu; Lương Nhược Du","Lộc phi từ Tật Ách nhập Tử Tức: thương trẻ nhỏ, ôn hòa, ưa đi đây đó; dễ lười hoặc đa tình.","Mặt tốt: bạn thuộc mẫu người ôn hòa, thương trẻ nhỏ, ưa đi đây đó. Mặt xấu: dễ lười hoặc đa tình.","cat"]],
"tuHoa|Tật Ách|Quyền":[["Cửu cửu; Huy Hà; Lai Nhân; Trung Châu; Lương Nhược Du","Tật Ách tự hóa Quyền: tính cương, hay va chạm, dễ chấn thương.","Mặt tốt: bạn có xu hướng mạnh mẽ, dám xông pha. Mặt xấu: tính cương, hay va chạm, dễ chấn thương, bong gân, gãy xương khi vận động mạnh. Gợi ý: có dấu hiệu lạ thì đi khám, hỏi bác sĩ.","trung"]],
"phi|Tật Ách|Khoa|Phu Thê":[["Huy Hà; Lai Nhân; Trung Châu; Lương Nhược Du","Khoa phi từ Tật Ách nhập Phu Thê: vóc người cân đối, dáng điệu thanh lịch, vợ chồng hợp nhau.","Mặt tốt: bạn có xu hướng vóc người cân đối, thanh lịch, vợ chồng hợp nhau. Mặt xấu: chú ý hình thức nhiều, dễ khó chịu khi người kia không chỉn chu.","cat"]],
"phi|Tật Ách|Kỵ|Điền Trạch":[["Huy Hà; Lai Nhân; Trung Châu; Lương Nhược Du; Ông Phúc Dụ","Tật Ách phi Kỵ nhập Điền Trạch (Thuận thủy Kỵ): khép kín, thích ở nhà, gia vận trì trệ; cần lưu ý sức khỏe lâu dài.","Mặt tốt: bạn có xu hướng gắn bó với nhà. Mặt xấu: khép kín, thích ở nhà, việc nhà trì trệ và dễ mắc bệnh mạn tính kéo dài (xương khớp, tiêu hóa, mất ngủ). Gợi ý: khám sức khỏe định kỳ, hỏi bác sĩ khi có dấu hiệu lạ.","hung"]],
"mchat|Tật Ách|chat":[["Trịnh Mục Đức","Tật Ách có M chất: lao tâm lao lực; có duyên lành trời ban với người phối ngẫu.","Mặt tốt: bạn có xu hướng có duyên lành với người bạn đời. Mặt xấu: lao tâm lao lực, ít khi được thảnh thơi.","trung"]],
"mchat|Tật Ách|Mệnh":[["Trịnh Mục Đức","Tật Ách có M Mệnh: thiên sinh lao tâm lao bác, tự kiếm tiền một mình.","Mặt tốt: bạn có xu hướng tự lực kiếm tiền một mình. Mặt xấu: sinh ra đã lao tâm lao lực, việc gì cũng tự gánh.","trung"]],
"mchat|Tật Ách|Nô Bộc":[["Trịnh Mục Đức","Tật Ách có M Nô: bẩm sinh thích kết bạn, thành bại đều do bạn bè.","Mặt tốt: bạn có xu hướng thích kết bạn, nhiều quan hệ. Mặt xấu: thành bại đều do bạn bè, chọn sai bạn là thiệt.","trung"]],
"mchat|Tật Ách|Quan Lộc":[["Trịnh Mục Đức","Tật Ách có M Quan: lao tâm, chỉ khi tự chủ được sự nghiệp mới thành công.","Mặt tốt: bạn có xu hướng thành công khi tự làm chủ sự nghiệp. Mặt xấu: lao tâm, làm thuê cho người khác thì khó thành.","trung"]],
"mchat|Tật Ách|Điền Trạch":[["Trịnh Mục Đức","Tật Ách có M Điền, M Phối hoặc M Tử: thích ở nhà; khi lập gia đình và có con thì vận sẽ chuyển mạnh.","Mặt tốt: bạn có xu hướng vận chuyển mạnh khi lập gia đình và có con. Mặt xấu: thích ở nhà nên trước khi có gia đình dễ thu mình, chậm mở mang.","cat"]],
"sao|Phá Quân|Tật Ách":[["","Phá Quân ở Tật Ách: miếu vượng thì chỉ bệnh nhẹ; hãm địa dễ mắc bệnh đường tiết niệu, ngoài da, sinh lý; đi cùng Tứ sát dễ bị thương tật. (Chỉ dùng ở tầng chuyên môn.)","Mặt tốt: bạn có xu hướng chỉ mắc bệnh nhẹ khi cơ thể ở trạng thái tốt. Mặt xấu: lúc yếu dễ có bệnh đường tiết niệu, ngoài da, sinh lý và dễ bị thương. Gợi ý: có triệu chứng thì hỏi bác sĩ.","trung"]],
"sao|Thiên Cơ|Tật Ách":[["Nhiều tác giả","Thiên Cơ tại Tật Ách: liên quan gan mật, thần kinh, mắt, tứ chi, khớp; thời nhỏ nhiều va vấp; Cơ Lương thì hạ bộ; Cơ Khoa thì thích tôn giáo, triết học, thông minh nhưng không thích nghĩ nhiều. (Tầng chuyên môn.)","Mặt tốt: bạn có xu hướng thông minh, thích tìm hiểu tôn giáo, triết học. Mặt xấu: cần để ý gan mật, thần kinh, mắt, khớp; thời nhỏ hay va vấp. Gợi ý: khám định kỳ.","trung"]],
"sao|Thiên Lương|Tật Ách":[["Trần Đoàn; Trần Bỉnh Húc; Sở Hoàng","Thiên Lương tại Tật Ách: miếu thì ít bệnh; hãm gặp sát có tổn thương; liên quan tiêu hóa, da, mũi, xương. (Tầng chuyên môn.)","Mặt tốt: bạn có xu hướng ít bệnh khi cơ thể ở trạng thái tốt. Mặt xấu: lúc yếu dễ tổn thương ở tiêu hóa, da, mũi, xương. Gợi ý: có dấu hiệu lạ thì hỏi bác sĩ.","cat"]],
"sao|Thái Dương|Tật Ách":[["Hà Lạc; Trần Đoàn; Trần Bỉnh Húc; Sở Hoàng","Thái Dương tại Tật Ách: liên quan đầu, mắt, tim; hãm dễ bệnh mắt. (Tầng chuyên môn.)","Mặt tốt: bạn có xu hướng có thể lực ổn khi được chăm đúng. Mặt xấu: cần để ý đầu, mắt và tim, dễ có bệnh về mắt. Gợi ý: khám định kỳ.","trung"]],
"canCung|Thiên Di|Giáp":[["Ông Phúc Dụ","Thiên Di can Giáp (Thiên chi Thiên): tự lập, tự cường, tự giải quyết việc một mình.","Mặt tốt: bạn thuộc mẫu người tự lập, tự cường, tự giải quyết việc ngoài xã hội. Mặt xấu: ôm một mình nên ít nhờ được ai, dễ cô độc khi gặp khó.","cat"]],
"phi|Thiên Di|Lộc|Mệnh":[["Nhiều tác giả","Lộc phi từ Thiên Di nhập Mệnh (đối cung, Tiết xuất hoặc Điệp xuất Lộc): ra ngoài có vận và cơ hội, giao thiệp tốt, kiếm tiền nhờ quan hệ, hợp ngành dịch vụ, quan hệ công chúng, công quyền; sáng dạ, hướng ngoại, đi nước ngoài nhờ thực lực.","Mặt tốt: bạn thuộc mẫu người hướng ngoại, sáng dạ, ra ngoài có cơ hội, kiếm tiền nhờ quan hệ, hợp dịch vụ, quan hệ công chúng. Mặt xấu: cái lợi đến từ bên ngoài nên cũng dễ chảy ra ngoài.","cat"],["Bản Hán-Việt; nhiều tác giả","Lưu ý hư vinh, nịnh bợ, lời tâng bốc; quản tiền kém, dễ thất thoát vì giao tế rộng; có Song Lộc thì tùy Kỵ có bị chế hay không.","Mặt tốt: bạn có xu hướng giao tế rộng. Mặt xấu: dễ hư vinh, nghe lời tâng bốc, quản tiền kém và thất thoát vì giao tế.","trung"]],
"phi|Thiên Di|Quyền|Phúc Đức":[["","Quyền phi từ Thiên Di nhập Phúc Đức: ưa phô trương, xa hoa, hiếu thắng, chí mạnh; dễ tiêu quá tay, kiêu căng.","Mặt tốt: bạn thuộc mẫu người chí mạnh, dám nghĩ lớn. Mặt xấu: ưa phô trương, xa hoa, hiếu thắng, dễ tiêu quá tay và kiêu căng.","trung"]],
"phi|Thiên Di|Khoa|Phụ Mẫu":[["","Khoa phi từ Thiên Di nhập Phụ Mẫu: có của ông bà để lại, được thầy và bề trên nâng đỡ, học hành có tiếng, có thể đi du học.","Mặt tốt: bạn có xu hướng có của ông bà để lại, được thầy và bề trên nâng đỡ, học hành có tiếng. Mặt xấu: dựa vào nền tảng và người nâng đỡ thì dễ thiếu sức tự vượt khó.","cat"]],
"phi|Thiên Di|Kỵ|Phu Thê":[["","Kỵ phi từ Thiên Di nhập Phu Thê (Thuận thủy Kỵ): ra ngoài gặp trắc trở, vợ chồng xích mích, người thứ ba dễ chen vào, sự nghiệp bị ảnh hưởng; coi chừng cờ bạc. Nếu Quan Lộc cũng nhận thêm Kỵ thì hình thành Củ triền Kỵ.","Mặt tốt: bạn có xu hướng rất để tâm tới hôn nhân khi ra ngoài. Mặt xấu: ra ngoài gặp trắc trở, vợ chồng xích mích, người thứ ba dễ chen vào, sự nghiệp bị ảnh hưởng; dễ sa vào cờ bạc.","hung"]],
"phi|Thiên Di|Quyền|Nô Bộc":[["Nhiều tác giả","Thiên Di phi Quyền nhập Nô Bộc: năng lực xã giao, tổ chức, thể hiện; nhiều bạn ở ngoài, bạn và anh em có địa vị; giao du rộng, hào phóng, được người lớn giúp nhưng dễ tranh chấp; cảnh giác sĩ diện, phô trương.","Mặt tốt: bạn có xu hướng giỏi xã giao, tổ chức, có nhiều bạn có địa vị và được người lớn giúp. Mặt xấu: dễ tranh chấp, sĩ diện, phô trương.","cat"]],
"phi|Thiên Di|Khoa|Điền Trạch":[["Nhiều tác giả","Thiên Di phi Khoa nhập Điền Trạch: ra ngoài có biến động nhỏ, thuận; cẩn trọng, có danh, gia đình nhiều văn nhân, nhà yên tĩnh thanh nhã; hay dời nhà, mua tài sản nơi khác.","Mặt tốt: bạn có xu hướng ra ngoài thuận, có danh, nhà yên tĩnh thanh nhã. Mặt xấu: hay dời nhà, tài sản phân tán ở nơi khác.","cat"]],
"phi|Thiên Di|Kỵ|Quan Lộc":[["Nhiều tác giả","Kỵ phi từ Thiên Di nhập Quan Lộc (Thuận thủy Kỵ, xung Phu Thê): giao thiệp kém, sự nghiệp bên ngoài không thuận, thành ít hỏng nhiều, công nhiều lợi ít, bận việc nên vợ chồng xa cách; coi chừng tiểu nhân, rối loạn nhân sự, nên cẩn trọng lời ăn tiếng nói.","Mặt tốt: bạn có xu hướng rất để tâm tới công việc bên ngoài. Mặt xấu: sự nghiệp bên ngoài không thuận, thành ít hỏng nhiều, công nhiều lợi ít, vợ chồng xa cách vì bận việc; dễ gặp tiểu nhân.","hung"]],
"phi|Thiên Di|Lộc|Phúc Đức":[["Huy Hà; Lai Nhân; Trung Châu; Lương Nhược Du; Tinh hoa","Lộc phi từ Thiên Di nhập Phúc Đức: đi ra ngoài thì được hưởng thụ, gặp quý nhân, tài vận khá.","Mặt tốt: bạn có xu hướng ra ngoài được hưởng thụ, gặp người tốt, tài vận khá. Mặt xấu: ham đi chơi, dễ chi nhiều cho vui bên ngoài.","cat"]],
"phi|Thiên Di|Quyền|Mệnh":[["Huy Hà; Lai Nhân; Trung Châu; Lương Nhược Du; Tinh hoa","Quyền phi từ Thiên Di nhập Mệnh: có địa vị, giỏi lãnh đạo, dễ tranh giành.","Mặt tốt: bạn có xu hướng có địa vị, giỏi lãnh đạo. Mặt xấu: dễ tranh giành, va chạm vì vị trí.","cat"]],
"tuHoa|Thiên Di|Khoa":[["Cửu cửu; Huy Hà; Lai Nhân; Trung Châu; Lương Nhược Du; Tinh hoa","Thiên Di tự hóa Khoa: ra ngoài có tiếng tốt, có quý nhân, song hay lưỡng lự.","Mặt tốt: bạn có xu hướng ra ngoài có tiếng tốt, có người giúp. Mặt xấu: hay lưỡng lự, dễ lỡ dịp.","cat"]],
"phi|Thiên Di|Kỵ|Tật Ách":[["Huy Hà; Lai Nhân; Trung Châu; Lương Nhược Du; Tinh hoa","Thiên Di phi Kỵ nhập Tật Ách (Thuận thủy Kỵ): bôn ba, ra ngoài ít thuận, dễ tổn hại thân tâm.","Mặt tốt: bạn có xu hướng chịu bôn ba, xông pha. Mặt xấu: ra ngoài ít thuận, dễ tổn hại cả thân lẫn tâm.","hung"]],
"mchat|Thiên Di|Điền Trạch":[["Trịnh Mục Đức","Thiên Di có M Điền: xuất ngoại, rời quê, sau khi chuyển nhà vận mới mạnh lên.","Mặt tốt: bạn có xu hướng vận mạnh lên sau khi rời quê, chuyển nhà. Mặt xấu: ở yên chỗ cũ thì khó phát, phải đổi chỗ mới đi lên.","cat"]],
"mchat|Thiên Di|Mệnh":[["Trịnh Mục Đức","M Mệnh có ở Thiên Di: đi xa gặp quý nhân; ở yên một chỗ dễ gặp chuyện bất ngờ.","Mặt tốt: bạn có xu hướng đi xa gặp người tốt. Mặt xấu: ở yên một chỗ dễ gặp chuyện bất ngờ.","cat"]],
"mchat|Thiên Di|Nô Bộc":[["Trịnh Mục Đức","Thiên Di có M Nô: xuất ngoại nhờ bạn bè, thành bại do bạn bè.","Mặt tốt: bạn có xu hướng đi xa nhờ bạn bè. Mặt xấu: thành bại ở bên ngoài phụ thuộc bạn bè, dễ bị kéo theo cái sai của họ.","trung"]],
"mchat|Thiên Di|Quan Lộc":[["Trịnh Mục Đức","M Quan có ở Thiên Di: làm nghề giao dịch ngoài xã hội thì thành công; phải ra ngoài mới làm ra tiền.","Mặt tốt: bạn có xu hướng thành công với nghề giao dịch ngoài xã hội. Mặt xấu: phải ra ngoài mới làm ra tiền, ngồi yên thì thu nhập kém.","cat"]],
"mchat|Thiên Di|Phúc Đức":[["Trịnh Mục Đức","Thiên Di có M Phúc / M Tật / M Phối / M Phụ: thích đi xa, lao tâm; được cử công tác nước ngoài, gặp quý nhân.","Mặt tốt: bạn có xu hướng thích đi xa, được cử đi công tác, gặp người giúp. Mặt xấu: lao tâm, đi nhiều nên mệt và xa nhà.","cat"]],
"sao|Thiên Tướng|Thiên Di":[["Hà Lạc; Trần Đoàn; Trần Bỉnh Húc; Sở Hoàng","Thiên Tướng tại Thiên Di: ra ngoài được quý nhân phù trợ, có người theo; miếu vượng và cát tinh thì tốt, sát tinh thì xấu; cung khí đại cát và Thiên Tướng là hỉ thần thì sớm có xe, kỵ thần thì cần đại vận tốt.","Mặt tốt: bạn có xu hướng ra ngoài được người tốt phù trợ, có người theo. Mặt xấu: gặp hoàn cảnh xấu thì sự giúp đỡ ấy mất tác dụng, ra ngoài dễ bất lợi.","cat"]],
"sao|Vũ Khúc|Thiên Di":[["Hà Lạc; Trần Đoàn; Trần Bỉnh Húc; Sở Hoàng","Vũ Khúc ở Thiên Di: lập thân nhờ tay nghề, bôn ba, có thể phát tài nơi xa.","Mặt tốt: bạn có xu hướng lập thân nhờ tay nghề, có thể phát tài nơi xa. Mặt xấu: đời bôn ba, ít yên.","cat"]],
"sao|Âm Sát|Thiên Di":[["Tử vi tinh điển","Âm Sát tại Thiên Di: cô độc, khó hòa đồng, dễ mê muội vào điều hư ảo.","Mặt tốt: bạn có xu hướng có đời sống nội tâm riêng. Mặt xấu: cô độc, khó hòa đồng, dễ mê muội vào điều hư ảo.","trung"]],
"canCung|Quan Lộc|Giáp":[["Ông Phúc Dụ","Quan Lộc can Giáp (Thiên chi Thiên): sự nghiệp dựa vào nỗ lực bản thân.","Mặt tốt: bạn có xu hướng làm nên sự nghiệp bằng nỗ lực bản thân. Mặt xấu: ít được nâng đỡ, việc gì cũng phải tự đi.","cat"]],
"snToa|Kỵ|Quan Lộc":[["Huy Hà Phan; Lai Nhân Cung; Trịnh Mục Đức","Quan Lộc có Hóa Kỵ năm sinh tọa thủ: xem công việc là trách nhiệm, áp lực nặng, phải tự tay làm, làm dai dẳng; phải lao bác mới nên; hôn nhân dễ bị vạ lây.","Mặt tốt: bạn thuộc mẫu người có trách nhiệm, bền bỉ, tự tay làm tới nơi. Mặt xấu: áp lực công việc nặng, phải lao lực mới nên, và hôn nhân dễ bị vạ lây vì việc.","trung"],["Lưu Kim Phủ; Ông Phúc Dụ; Phi tinh Trần Đoàn","Việc làm nhiều biến động, hay nhảy việc, lúc lên lúc xuống thất thường; cẩn thận mà khó thăng tiến; nên buôn bán thu tiền mặt; học hành tầm trung bình; lập gia đình muộn.","Mặt tốt: bạn có xu hướng cẩn thận, hợp buôn bán thu tiền mặt. Mặt xấu: việc làm nhiều biến động, hay nhảy việc, lên xuống thất thường, khó thăng tiến và lập gia đình muộn.","trung"],["Trần Bỉnh Húc; Từ Tăng Sinh","Công việc dễ gặp sự cố, cát tinh chỉ giảm nhẹ; tâm lý dao động, cần chú tâm; nếu Kỵ là Tham Lang thì nhiều thị phi, dễ vướng rắc rối pháp lý nếu làm ăn không minh bạch, hợp giải trí nghệ thuật.","Mặt tốt: bạn có xu hướng hợp với lĩnh vực giải trí, nghệ thuật. Mặt xấu: công việc dễ gặp sự cố, tâm lý dao động, nhiều điều tiếng và có thể vướng rắc rối pháp lý nếu làm ăn không minh bạch. Gợi ý: việc giấy tờ, hợp đồng nên hỏi người có chuyên môn.","hung"]],
"phi|Quan Lộc|Lộc|Tật Ách":[["","Lộc phi từ Quan Lộc nhập Tật Ách: việc nhẹ, nhiều dịp may, có điều dễ thiếu chăm chỉ.","Mặt tốt: bạn có xu hướng có việc nhẹ, nhiều dịp may. Mặt xấu: dễ thiếu chăm chỉ.","cat"]],
"phi|Quan Lộc|Quyền|Mệnh":[["Huy Hà Phan; Lương Nhược Du; Lai Nhân Cung","Quan Lộc phi Quyền nhập Mệnh: năng lực lập nghiệp, tự tin, dễ thăng tiến, hợp lãnh đạo, thích thành tích; gặp Kỵ thì căng thẳng, làm quá sức.","Mặt tốt: bạn thuộc mẫu người tự tin, có năng lực lập nghiệp, dễ thăng tiến, hợp lãnh đạo. Mặt xấu: thích thành tích nên dễ căng thẳng, làm quá sức.","cat"]],
"phi|Quan Lộc|Khoa|Phu Thê":[["","Khoa phi từ Quan Lộc nhập Phu Thê: sự nghiệp vững, hợp làm công chức; coi trọng hình thức và truyền thông.","Mặt tốt: bạn có xu hướng có sự nghiệp vững, hợp làm nhà nước. Mặt xấu: coi trọng hình thức, dễ bận vì giữ hình ảnh.","cat"]],
"phi|Quan Lộc|Kỵ|Huynh Đệ":[["","Kỵ phi từ Quan Lộc nhập Huynh Đệ: đầu tư không thuận, dễ thị phi với bạn bè, người cộng sự; xét đại vận là 'không có thành tựu' trên trục Huynh–Nô.","Mặt tốt: bạn có xu hướng để tâm tới bạn bè, người cộng sự. Mặt xấu: đầu tư không thuận, dễ điều tiếng với bạn và người cộng sự, làm chung khó thành.","hung"]],
"phi|Quan Lộc|Lộc|Mệnh":[["Nhiều tác giả","Quan Lộc phi Lộc nhập Mệnh: tự kiếm tiền bằng năng lực, công việc như ý, có duyên với sự nghiệp, thăng tiến tự nhiên; thông minh, độc lập, sáng lập được cơ nghiệp; hợp nghề tự do, hoa hồng; dễ tự mãn.","Mặt tốt: bạn thuộc mẫu người thông minh, độc lập, tự kiếm tiền bằng năng lực, thăng tiến tự nhiên, có thể lập được cơ nghiệp. Mặt xấu: dễ tự mãn khi việc đã thuận.","cat"]],
"phi|Quan Lộc|Quyền|Nô Bộc":[["Nhiều tác giả","Quyền phi từ Quan Lộc nhập Nô Bộc: năng lực bộc lộ qua giao tế, hợp làm cố vấn, kinh doanh thương hiệu, buôn sỉ; trong sự nghiệp, quyền nằm ở tay bạn bè; người trên khắt khe, thường đổi ý; thành tựu thấp hơn trường hợp nhập thẳng Huynh Đệ; xét đại vận là thành tựu nhờ bạn bè và người dưới.","Mặt tốt: bạn có xu hướng thể hiện năng lực qua giao tế, hợp làm cố vấn, kinh doanh thương hiệu, buôn sỉ. Mặt xấu: quyền trong sự nghiệp nằm ở tay bạn bè, người trên khắt khe, hay đổi ý, thành tựu bị giới hạn.","cat"]],
"phi|Quan Lộc|Khoa|Điền Trạch":[["Nhiều tác giả","Quan Lộc phi Khoa nhập Điền Trạch: công việc bình ổn, thu nhập ổn định, tài sản tích lũy dần; hợp thiết kế nội thất, môi giới, kinh doanh nhà đất; hay lo việc nhà.","Mặt tốt: bạn có xu hướng có công việc bình ổn, thu nhập đều, tài sản tích lũy dần. Mặt xấu: hay lo việc nhà, khó dồn sức cho bước tiến lớn.","cat"]],
"tuHoa|Quan Lộc|Kỵ":[["Nhiều tác giả","Quan Lộc tự hóa Kỵ: khó làm nên việc lớn, nhìn chưa xa, sự nghiệp chông chênh, dễ đụng tiểu nhân; hợp đi làm ăn lương cố định, làm dịch vụ, đầu tư ngắn kỳ, tránh để vốn đọng; vì xung Phu Thê nên cũng phải giữ gìn hôn nhân.","Mặt tốt: bạn có xu hướng hợp việc lương cố định, dịch vụ, đầu tư ngắn hạn. Mặt xấu: khó làm nên việc lớn, nhìn chưa xa, sự nghiệp chông chênh, dễ đụng tiểu nhân và hôn nhân cũng bị ảnh hưởng.","hung"]],
"phi|Quan Lộc|Lộc|Phúc Đức":[["Huy Hà Phan; Lai Nhân; Lương Nhược Du; Trung Châu","Lộc phi từ Quan Lộc nhập Phúc Đức: sự nghiệp làm ra tiền, biết hưởng thụ, hợp nghề theo sở thích (du lịch, ẩm thực, giải trí, thời trang); lạc quan, biết đủ; có thể cùng bạn đời làm ăn; dễ ham vui, bị động.","Mặt tốt: bạn thuộc mẫu người lạc quan, biết đủ, kiếm tiền từ nghề theo sở thích như du lịch, ẩm thực, giải trí, thời trang. Mặt xấu: dễ ham vui, bị động.","cat"]],
"phi|Quan Lộc|Khoa|Thiên Di":[["Huy Hà Phan; Trung Châu; Lương Nhược Du; Lai Nhân Cung","Quan Lộc phi Khoa nhập Thiên Di: sự nghiệp phát triển bên ngoài, đi công tác xa, có quý nhân, hình ảnh tốt; hợp truyền thông, quảng bá.","Mặt tốt: bạn có xu hướng phát triển sự nghiệp ở bên ngoài, có hình ảnh tốt, hợp truyền thông. Mặt xấu: đi công tác xa nhiều, ít thời gian cho nhà.","cat"]],
"phi|Quan Lộc|Kỵ|Tật Ách":[["Huy Hà Phan; Lai Nhân; Lương Nhược Du; Phương Ngoại Nhân","Quan Lộc phi Kỵ nhập Tật Ách (Thuận thủy Kỵ, xung Phụ Mẫu): công việc vất vả, áp lực, dễ chán, làm đến già; hợp kỹ thuật hoặc buôn nhỏ; cố chấp, khó giao tiếp; ở đại vận là 'mất quang minh'.","Mặt tốt: bạn có xu hướng bền bỉ, hợp kỹ thuật hoặc buôn nhỏ. Mặt xấu: công việc vất vả, áp lực, dễ chán mà vẫn phải làm tới già; cố chấp, khó giao tiếp.","hung"]],
"sao|Tham Lang|Quan Lộc":[["Nhiều tác giả","Tham Lang tại Quan Lộc: sao tài nghệ, hợp ăn uống, thời trang, trang trí, giải trí, thương nghiệp, giao tế, đầu cơ; sự nghiệp khai sáng, thăng trầm, sau 30 tuổi dần tốt; miếu gặp Hỏa Linh thì nắm quyền lớn, hãm thì làm tham mưu.","Mặt tốt: bạn có xu hướng có tài nghệ, hợp ăn uống, thời trang, giải trí, giao tế, sự nghiệp dần tốt sau ba mươi tuổi. Mặt xấu: sự nghiệp thăng trầm, dễ đầu cơ.","cat"]],
"sao|Vũ Khúc|Quan Lộc":[["Nhiều tác giả","Vũ Khúc tại Quan Lộc: tài tinh, cô độc, hợp tài chính, ngân hàng, bảo hiểm, quân cảnh, ngành kim khí; miếu gặp Xương Khúc, Tả Hữu, Khoa Quyền Lộc thì chức cao; Vũ Tham ở Sửu Mùi sự nghiệp biến động, làm tham mưu, cố vấn.","Mặt tốt: bạn có xu hướng hợp tài chính, ngân hàng, bảo hiểm, quân cảnh, có thể lên chức cao. Mặt xấu: cô độc trong công việc, có giai đoạn sự nghiệp biến động.","cat"]],
"sao|Lộc Tồn|Quan Lộc":[["Phi tinh Trần Đoàn; Đẩu số cung vị","Lộc Tồn tại Quan Lộc: thuận lợi tài chính, giỏi quản tiền, hợp ngành tài chính.","Mặt tốt: bạn có xu hướng thuận lợi về tài chính, giỏi quản tiền. Mặt xấu: thận trọng quá nên ít dám bứt phá.","cat"]],
"sao|Văn Xương|Quan Lộc":[["","Xương Khúc ở Quan Lộc: hợp thiết kế, giáo dục, nghệ thuật, học thuật, văn chương, tôn giáo; nhập miếu thì nổi danh.","Mặt tốt: bạn có xu hướng hợp thiết kế, giáo dục, nghệ thuật, học thuật, văn chương, có thể nổi danh. Mặt xấu: nghề thiên về chữ nghĩa thường thu nhập không đều.","cat"]],
"sao|Kình Dương|Quan Lộc":[["","Kình Đà tại Quan Lộc: sự nghiệp trắc trở, dễ đối lập cấp trên; nhập miếu hợp võ chức.","Mặt tốt: bạn có xu hướng hợp việc cần sự cứng rắn như quân đội, an ninh. Mặt xấu: sự nghiệp trắc trở, dễ đối đầu cấp trên.","trung"]],
"phi|Phụ Mẫu|Khoa|Phu Thê":[["","Phụ Mẫu phi Khoa nhập Phu Thê: cha mẹ hòa nhã, thông minh, có danh, là quý nhân; hôn nhân được ủng hộ; có thể ở riêng nhưng giữ đạo hiếu.","Mặt tốt: bạn có xu hướng có cha mẹ hòa nhã, có danh, ủng hộ hôn nhân của mình. Mặt xấu: có thể phải ở riêng, xa cha mẹ.","cat"]],
"snToa|Khoa|Phụ Mẫu":[["","Hóa Khoa năm sinh tọa Phụ Mẫu: cha mẹ có học, có danh tiếng, là quý nhân; lợi cho học hành, giấy tờ.","Mặt tốt: bạn có xu hướng có cha mẹ có học, có danh, thuận lợi học hành, giấy tờ. Mặt xấu: chịu áp lực phải sống cho xứng với tiếng nhà.","cat"]],
"phi|Phụ Mẫu|Kỵ|Tài Bạch":[["","Kỵ phi từ Phụ Mẫu nhập Tài Bạch: tốn tiền vì cha mẹ, cho mượn khó lấy lại; cẩn trọng bảo lãnh, giấy tờ, hợp đồng; tự lo tiền học; nên chăm lo sức khỏe cho cha mẹ.","Mặt tốt: bạn có xu hướng có trách nhiệm với cha mẹ. Mặt xấu: tốn tiền vì cha mẹ, cho mượn khó lấy lại, phải tự lo tiền học; dễ rắc rối vì bảo lãnh, giấy tờ, hợp đồng.","hung"]],
"phi|Phụ Mẫu|Lộc|Phu Thê":[["","Lộc phi từ Phụ Mẫu nhập Phu Thê: cha mẹ vun vén hôn nhân, êm thấm với bạn đời của con, là chỗ dựa về tiền; chiều quá dễ làm con ỷ lại.","Mặt tốt: bạn có xu hướng được cha mẹ vun vén hôn nhân, làm chỗ dựa tiền bạc. Mặt xấu: được chiều quá dễ ỷ lại.","cat"]],
"phi|Phụ Mẫu|Quyền|Tử Tức":[["","Phụ Mẫu phi Quyền nhập Tử Tức: cha mẹ nghiêm khắc dạy con, có địa vị, giỏi quản tiền; con có năng lực lãnh đạo.","Mặt tốt: bạn có xu hướng có cha mẹ có địa vị, giỏi quản tiền; con bạn có năng lực lãnh đạo. Mặt xấu: cha mẹ nghiêm khắc, dễ áp đặt.","cat"]],
"phi|Phụ Mẫu|Lộc|Nô Bộc":[["Nhiều tác giả","Lộc phi từ Phụ Mẫu nhập Nô Bộc: cha mẹ cởi mở, hào phóng, hay giúp bạn bè, có lúc tiền bạc vượt tầm kiểm soát; được bề trên quý, thuận lợi thi cử; cấp trên hoặc bạn bè có vốn lớn.","Mặt tốt: bạn có xu hướng có cha mẹ cởi mở, hào phóng, được bề trên quý, thi cử thuận. Mặt xấu: tiền bạc trong nhà có lúc vượt tầm kiểm soát vì giúp người ngoài.","cat"]],
"phi|Phụ Mẫu|Quyền|Quan Lộc":[["Nhiều tác giả","Quyền phi từ Phụ Mẫu nhập Quan Lộc: cha mẹ hoặc cấp trên đỡ đầu sự nghiệp, giúp thăng tiến; thuận lợi về chứng chỉ, công chức; với bạn đời có thể không hòa.","Mặt tốt: bạn có xu hướng được cha mẹ hoặc cấp trên đỡ đầu sự nghiệp, thuận chứng chỉ, công chức. Mặt xấu: với người bạn đời có thể không hòa.","cat"]],
"phi|Phụ Mẫu|Khoa|Điền Trạch":[["Nhiều tác giả","Phụ Mẫu phi Khoa nhập Điền Trạch: cha mẹ hòa nhã, dạy bằng lý lẽ, sống giản dị, quan tâm gia đình; nhà có nếp thư hương, ít cãi vã; ít hỗ trợ kinh tế.","Mặt tốt: bạn có xu hướng có cha mẹ hòa nhã, dạy bằng lý lẽ, nhà ít cãi vã. Mặt xấu: ít được hỗ trợ kinh tế từ cha mẹ.","cat"]],
"phi|Phụ Mẫu|Kỵ|Điền Trạch":[["Nhiều tác giả","Phụ Mẫu phi Kỵ nhập Điền Trạch (Thuận thủy Kỵ, xung Tử Tức): cha mẹ lo kinh tế, tiết kiệm giữ nhà, phải hiếu dưỡng; thời nhỏ gia cảnh khó; cẩn thận giao dịch tiền bạc, vay ngân hàng.","Mặt tốt: bạn có xu hướng có cha mẹ tiết kiệm, giữ nhà. Mặt xấu: thời nhỏ gia cảnh khó, phải lo hiếu dưỡng; giao dịch tiền bạc, vay ngân hàng dễ rắc rối.","trung"]],
"phi|Phụ Mẫu|Khoa|Tài Bạch":[["Đồng bộ đoạn quyết; Lai Nhân; Trung Châu","Khoa phi từ Phụ Mẫu nhập Tài Bạch: cha mẹ khá giả, quản tiền có kế hoạch, được người trên khen ngợi.","Mặt tốt: bạn có xu hướng có cha mẹ khá giả, quản tiền có kế hoạch, được người trên khen. Mặt xấu: cha mẹ chặt chẽ chuyện tiền, ít cho con tự quyết.","cat"]],
"phi|Phụ Mẫu|Quyền|Tật Ách":[["Huy Hà Phan; Lai Nhân; Trung Châu; Lương Nhược Du","Phụ Mẫu phi Quyền nhập Tật Ách: cha mẹ quan tâm sức khỏe con, ý chí mạnh, cương quyết.","Mặt tốt: bạn có xu hướng có cha mẹ quan tâm sức khỏe con, ý chí mạnh. Mặt xấu: cha mẹ cương quyết, dễ áp đặt.","trung"]],
"phi|Phụ Mẫu|Kỵ|Phúc Đức":[["Huy Hà Phan; Lai Nhân; Trung Châu; Lương Nhược Du","Kỵ phi từ Phụ Mẫu nhập Phúc Đức (Thuận thủy Kỵ): cha mẹ dễ bất đồng, ít thành tựu, tiền bạc hụt dần, vướng rắc rối giấy tờ.","Mặt tốt: bạn có xu hướng để tâm nhiều tới cha mẹ. Mặt xấu: cha mẹ dễ bất đồng, ít thành tựu, tiền bạc hụt dần, vướng rắc rối giấy tờ.","hung"]],
"mchat|Phụ Mẫu|chat":[["Trịnh Mục Đức","Phụ Mẫu có M chất: nhiều quý nhân, phúc báo tổ tiên; đương số sẽ chăm sóc cha mẹ; rèn kỹ năng thì có quý nhân.","Mặt tốt: bạn có xu hướng nhiều người giúp, được phúc từ gia đình, rèn kỹ năng thì có người nâng đỡ. Mặt xấu: bạn sẽ phải chăm sóc cha mẹ, gánh này có thể nặng.","cat"]],
"mchat|Phụ Mẫu|Điền Trạch":[["Trịnh Mục Đức","Phụ Mẫu có M Điền: có nhà đất từ cha mẹ.","Mặt tốt: bạn có xu hướng có nhà đất từ cha mẹ. Mặt xấu: dễ ràng buộc với gia đình qua tài sản ấy.","cat"]],
"mchat|Phụ Mẫu|Nô Bộc":[["Trịnh Mục Đức","M Nô có ở Phụ Mẫu: bạn bè là quý nhân; sự nghiệp nương vào bạn bè.","Mặt tốt: bạn có xu hướng có bạn bè là người giúp, sự nghiệp nương vào bạn bè. Mặt xấu: dựa vào người ngoài thì dễ chao khi quan hệ đổi.","cat"]],
"mchat|Phụ Mẫu|Quan Lộc":[["Trịnh Mục Đức","Phụ Mẫu có M Quan: có cấp trên hoặc ông chủ nâng đỡ, nền tảng sự nghiệp từ gia đình.","Mặt tốt: bạn có xu hướng có cấp trên nâng đỡ, nền sự nghiệp từ gia đình. Mặt xấu: phụ thuộc vào người đỡ đầu, rời họ thì khó.","cat"]],
"sao|Tử Vi|Phụ Mẫu":[["","Thiên Tướng, Tử Vi miếu vượng ở Phụ Mẫu: cha mẹ mạnh khỏe, có phúc, bao bọc con; có Không Kiếp, Kình Đà thì dễ khắc cha mẹ; sát tinh hội nặng thì một số sách khuyên nên làm con nuôi.","Mặt tốt: bạn có xu hướng có cha mẹ khỏe, có phúc, bao bọc con. Mặt xấu: gặp hoàn cảnh xấu thì dễ xung khắc với cha mẹ.","cat"]],
"sao|Hỏa Tinh|Phụ Mẫu":[["Phi tinh Trần Đoàn","Hỏa Tinh đứng một mình tại Phụ Mẫu: sớm xa cha mẹ; có cát tinh thì bình hòa. Âm Sát tại Phụ Mẫu: hay vọng tưởng về nguồn gốc bản thân.","Mặt tốt: bạn có xu hướng tự lập sớm. Mặt xấu: sớm xa cha mẹ, hay vọng tưởng về nguồn gốc bản thân.","trung"]],
"canCung|Huynh Đệ|Mậu":[["","Huynh Đệ can Mậu: anh em hoặc mẹ cố chấp, vất vả; đương số dễ gặp tiểu nhân.","Mặt tốt: bạn có xu hướng có anh em hoặc mẹ chịu khó. Mặt xấu: họ cố chấp, vất vả, và bạn dễ gặp tiểu nhân.","trung"]],
"tuHoa|Huynh Đệ|Lộc":[["","Huynh Đệ tự hóa Lộc: dễ được lòng người, hay giúp bạn về tiền mà thiếu tính toán; anh em giỏi giang, khéo léo; dễ hao tài vì xã giao. Xét đại vận thì được coi là kiểu Khai quán nhân có thành tựu.","Mặt tốt: bạn có xu hướng được lòng người, có anh em giỏi giang, khéo léo. Mặt xấu: hay giúp bạn về tiền mà thiếu tính toán, dễ hao tài vì xã giao.","trung"]],
"phi|Huynh Đệ|Kỵ|Mệnh":[["","Kỵ phi từ Huynh Đệ nhập Mệnh: phải lo cho anh em, gánh nặng kinh tế; hợp đi làm công, làm dịch vụ; đời lắm sóng gió, khó gom tiền.","Mặt tốt: bạn có xu hướng có trách nhiệm với anh em, hợp đi làm công hoặc làm dịch vụ. Mặt xấu: phải lo cho anh em, gánh nặng kinh tế, đời lắm sóng gió, khó gom tiền.","trung"]],
"phi|Huynh Đệ|Quyền|Phu Thê":[["","Quyền phi từ Huynh Đệ nhập Phu Thê: anh em có sức lập nghiệp; có thể xen vào hôn nhân; chị em dâu dễ không hòa.","Mặt tốt: bạn có xu hướng có anh em có sức lập nghiệp. Mặt xấu: anh em có thể xen vào hôn nhân, chị em dâu dễ không hòa.","trung"]],
"phi|Huynh Đệ|Khoa|Điền Trạch":[["","Khoa phi từ Huynh Đệ nhập Điền Trạch: anh em chăm lo việc nhà, tiêu pha hợp lý, làm công chức hay nhân viên văn phòng; cuộc sống vững vàng.","Mặt tốt: bạn có xu hướng có anh em chăm lo việc nhà, tiêu pha hợp lý, cuộc sống vững. Mặt xấu: nếp sống an toàn nên ít bứt phá.","cat"]],
"phi|Huynh Đệ|Lộc|Quan Lộc":[["Nhiều tác giả","Huynh Đệ phi Lộc nhập Quan Lộc: sự nghiệp thuận, vốn sung túc, anh em và mẹ chủ động trợ giúp, có thể cộng tác với anh em; anh em được cấp trên khen.","Mặt tốt: bạn có xu hướng có sự nghiệp thuận, vốn sung túc, anh em và mẹ chủ động giúp. Mặt xấu: dựa vào anh em thì dễ lẫn tình với tiền.","cat"]],
"phi|Huynh Đệ|Quyền|Điền Trạch":[["Nhiều tác giả","Huynh Đệ phi Quyền nhập Điền Trạch: anh em nắm quyền trong nhà, dễ tranh chấp khi chia gia sản; đương số giỏi kinh doanh, tiền càng chảy càng nhiều, có thể làm nhà đất; anh em hay can thiệp việc nhà.","Mặt tốt: bạn có xu hướng giỏi kinh doanh, tiền càng chảy càng nhiều, có thể làm nhà đất. Mặt xấu: anh em nắm quyền và can thiệp việc nhà, dễ tranh chấp khi chia gia sản.","trung"]],
"phi|Huynh Đệ|Khoa|Nô Bộc":[["Nhiều tác giả","Huynh Đệ phi Khoa nhập Nô Bộc: quan hệ lễ nghĩa, giao dịch tiền có lý trí, thu chi cân bằng, thu nhập ổn định; anh em có tài, có danh, hợp văn giáo; mặt trái là dễ cô đơn, kiêu, thiếu quyết đoán.","Mặt tốt: bạn có xu hướng có quan hệ lễ nghĩa, thu chi cân bằng, anh em có tài, có danh. Mặt xấu: dễ cô đơn, kiêu, thiếu quyết đoán.","cat"]],
"phi|Huynh Đệ|Kỵ|Tật Ách":[["Nhiều tác giả","Huynh Đệ phi Kỵ nhập Tật Ách (Thuận thủy Kỵ, xung Phụ Mẫu): chăm lo anh em vất vả hoặc bị ỷ lại; cố chấp, bảo thủ; kiếm tiền vất vả, tốn chi phí sức khỏe.","Mặt tốt: bạn có xu hướng tận tụy với anh em. Mặt xấu: chăm lo anh em vất vả hoặc bị ỷ lại, cố chấp, kiếm tiền vất vả và tốn kém cho sức khỏe.","hung"]],
"phi|Huynh Đệ|Lộc|Thiên Di":[["Huy Hà Phan; Lai Nhân; Trung Châu; Lương Nhược Du","Lộc phi từ Huynh Đệ nhập Thiên Di: anh em giỏi giao thiệp xã hội, hỗ trợ từ bên ngoài, sự nghiệp suôn sẻ, kinh tế dư dật.","Mặt tốt: bạn có xu hướng có anh em giỏi giao thiệp, được giúp từ bên ngoài, kinh tế dư dật. Mặt xấu: dễ dựa vào quan hệ bên ngoài của anh em.","cat"]],
"phi|Huynh Đệ|Quyền|Quan Lộc":[["Huy Hà Phan; Lai Nhân; Trung Châu; Lương Nhược Du","Quyền phi từ Huynh Đệ nhập Quan Lộc: anh em làm nên việc, hùn hạp có lợi; có điều nếu quản quá chặt thì sinh áp lực.","Mặt tốt: bạn có xu hướng có anh em làm nên việc, hùn hạp có lợi. Mặt xấu: quản chặt quá thì sinh áp lực, va chạm.","cat"]],
"phi|Huynh Đệ|Khoa|Tật Ách":[["Huy Hà Phan; Lai Nhân; Trung Châu; Lương Nhược Du","Huynh Đệ phi Khoa nhập Tật Ách: anh em lịch sự, quan tâm sức khỏe nhau, đôi khi khách sáo.","Mặt tốt: bạn có xu hướng có anh em lịch sự, quan tâm sức khỏe nhau. Mặt xấu: đôi khi khách sáo, ít thân thật.","cat"]],
"phi|Huynh Đệ|Kỵ|Tài Bạch":[["Huy Hà Phan; Lai Nhân; Trung Châu; Lương Nhược Du","Kỵ phi từ Huynh Đệ nhập Tài Bạch (Thuận thủy Kỵ): anh em dễ làm hao tiền, cho vay mượn dễ chịu thiệt, khó gom góp.","Mặt tốt: bạn có xu hướng sẵn lòng giúp anh em. Mặt xấu: anh em dễ làm hao tiền, cho vay mượn dễ thiệt, khó gom góp.","hung"]],
"mchat|Huynh Đệ|chat":[["Trịnh Mục Đức","Huynh Đệ có M chất / M Quan / M Điền / M Nô / M Tật: anh em có thành tựu, có nhà đất, dựa vào bạn bè; anh em vất vả nhưng cũng là quý nhân của mình.","Mặt tốt: bạn có xu hướng có anh em có thành tựu, là người giúp mình. Mặt xấu: anh em vất vả, và quan hệ dễ nặng chuyện tiền, nhà đất.","cat"]],
"sao|Đà La|Huynh Đệ":[["Trần Bỉnh Húc","Các sao ở Huynh Đệ: có Đà La thì anh em ít khăng khít hoặc anh em phụ mình; Tham Lang miếu vượng thì có anh em mà không hòa; Không Kiếp thì duyên mỏng, có thể gặp thất bại lớn về tiền; Tả Hữu thì êm thấm, đỡ đần lẫn nhau; Khoa thì hòa thuận, Quyền thì trong anh em có quý nhân; Lộc thì anh em giàu có, Kỵ thì bị liên lụy.","Mặt tốt: khi thuận thì anh em bạn có xu hướng êm thấm, đỡ đần nhau, có người giàu hoặc có địa vị. Mặt xấu: khi nghịch thì anh em ít khăng khít, không hòa, duyên mỏng, có thể bị liên lụy hoặc thất bại lớn về tiền.","trung"]],
"canCung|Nô Bộc|Nhâm":[["","Nô Bộc can Nhâm: bạn bè hoặc đối thủ cao ngạo, khó lường, hay lấn lướt.","Mặt tốt: bạn có xu hướng gặp bạn bè, đối thủ có năng lực. Mặt xấu: họ cao ngạo, khó lường, hay lấn lướt.","trung"]],
"snToa|Kỵ|Nô Bộc":[["Nhiều tác giả","Hóa Kỵ năm sinh tọa Nô Bộc: mắc nợ ân tình với bạn bè, khó được giúp, dễ liên lụy; trọng nghĩa khinh tài; không nên hợp tác tiền bạc; khó có tri kỷ; là bài học về trách nhiệm, cần tích đức. Ở Dần Thân Tị Hợi thành Tứ mã Kỵ.","Mặt tốt: bạn thuộc mẫu người trọng nghĩa khinh tài. Mặt xấu: mắc nợ ân tình với bạn bè, khó được giúp, dễ liên lụy, khó có tri kỷ; hợp tác tiền bạc dễ thiệt.","trung"],["","Theo cách nhìn khác: bạn bè là quý nhân, kể cả người bán rẻ mình cũng là bài học giúp mình trưởng thành.","Mặt tốt: bạn có xu hướng trưởng thành nhờ bạn bè, kể cả qua người phụ mình. Mặt xấu: bài học ấy thường đến từ việc bị phản bội, mất mát thật.","trung"],["","Sao mang Kỵ: Cự Môn thì nhiều lời, tranh đúng sai với bạn; Thái Dương thì dễ gây thù, khó hòa với bạn nam, không hợp việc phục vụ công chúng.","Mặt tốt: bạn có xu hướng thẳng thắn, dám tranh luận. Mặt xấu: nhiều lời, tranh đúng sai với bạn, dễ gây thù, khó hòa với bạn nam và không hợp việc phục vụ đông người.","hung"]],
"snToa|Quyền|Nô Bộc":[["Nhiều tác giả","Hóa Quyền năm sinh tọa Nô Bộc: bạn bè có năng lực, có địa vị, thành đạt; dễ tranh cãi, cần chọn bạn kỹ; Cự Môn Quyền thì nhiều thị phi nhưng vẫn có bạn cùng làm; Thiên Đồng Quyền thì giao tiếp vui vẻ.","Mặt tốt: bạn có xu hướng có bạn bè có năng lực, địa vị, thành đạt. Mặt xấu: dễ tranh cãi, điều tiếng với bạn. Gợi ý: chọn bạn kỹ.","cat"]],
"tuHoa|Nô Bộc|Lộc":[["","Nô Bộc tự hóa Lộc: có bạn tri kỷ, hay cho mượn mà không đòi; quen biết rộng nhưng thiếu sàng lọc, dễ bị lợi dụng; bạn bè có tiền, có địa vị.","Mặt tốt: bạn có xu hướng có bạn tri kỷ, quen rộng, bạn có tiền có địa vị. Mặt xấu: hay cho mượn mà không đòi, thiếu sàng lọc nên dễ bị lợi dụng.","trung"]],
"phi|Nô Bộc|Quyền|Tật Ách":[["Nhiều tác giả","Nô Bộc phi Quyền nhập Tật Ách: bạn chủ động, mạnh mẽ, dễ tranh cãi, đeo bám hoặc làm phiền; cũng có người chủ động giúp mình.","Mặt tốt: bạn có xu hướng có người chủ động giúp mình. Mặt xấu: bạn bè mạnh mẽ, dễ tranh cãi, đeo bám hoặc làm phiền.","trung"]],
"phi|Nô Bộc|Khoa|Tử Tức":[["","Khoa phi từ Nô Bộc nhập Tử Tức: bạn bè giúp đỡ con cái, con gặp được thầy hay; bạn quan tâm tới gia đình; cuộc sống êm đềm.","Mặt tốt: bạn có xu hướng có bạn bè giúp con, con gặp thầy hay, cuộc sống êm đềm. Mặt xấu: bạn bè quan tâm gia đình nhiều thì dễ xen vào chuyện riêng.","cat"]],
"phi|Nô Bộc|Kỵ|Phu Thê":[["","Kỵ phi từ Nô Bộc nhập Phu Thê: bạn bè gây mâu thuẫn, hôn nhân nhạt nhẽo, người thứ ba chen vào; bạn cản đường sự nghiệp; tránh ghen quá mức.","Mặt tốt: bạn có xu hướng có nhiều bạn quan tâm. Mặt xấu: bạn bè gây mâu thuẫn, hôn nhân nhạt, người thứ ba chen vào, bạn cản đường sự nghiệp; bản thân dễ ghen quá mức.","hung"]],
"phi|Nô Bộc|Lộc|Tật Ách":[["Nhiều tác giả","Nô Bộc phi Lộc nhập Tật Ách: bạn bè gần gũi, chiếu cố, hay mời; nhân duyên tốt, duyên khác giới; hợp ẩm thực, giải trí, thời trang, cà phê; có lợi làm giàu nhưng dễ thụ động; ở đại vận là 'quang minh'.","Mặt tốt: bạn có xu hướng có bạn bè gần gũi, chiếu cố, nhân duyên tốt, hợp ẩm thực, giải trí, thời trang. Mặt xấu: dễ thụ động, trông vào người khác.","cat"]],
"phi|Nô Bộc|Quyền|Tài Bạch":[["Nhiều tác giả","Quyền phi từ Nô Bộc nhập Tài Bạch: bạn bè giúp làm ra tiền, hợp kinh doanh hàng giá trị cao, buôn sỉ; nhưng bạn cũng cạnh tranh, có thể đấu đá, rủ rê bỏ vốn hoặc gạt tiền; nếu cách cục tốt thì có bạn giúp, kém thì phải đề phòng kẻ gian.","Mặt tốt: bạn có xu hướng được bạn bè giúp làm ra tiền, hợp kinh doanh hàng giá trị cao, buôn sỉ. Mặt xấu: bạn bè cũng là đối thủ, có thể đấu đá, rủ bỏ vốn hoặc gạt tiền. Gợi ý: góp vốn với ai cũng nên có giấy tờ rõ.","trung"]],
"phi|Nô Bộc|Khoa|Điền Trạch":[["Nhiều tác giả","Nô Bộc phi Khoa nhập Điền Trạch: bạn hoặc khách hàng mang lợi đều đặn; bạn có khí chất văn nhã, đến nhà làm khách, quan tâm gia đình, bày mưu việc nhà đất; gia vận tốt, gặp khó có quý nhân; thích hợp tác.","Mặt tốt: bạn có xu hướng được bạn bè, khách hàng mang lợi đều đặn, gặp khó có người giúp, gia vận tốt. Mặt xấu: bạn bè lui tới nhà nhiều dễ xen vào chuyện nhà đất, chuyện riêng.","cat"]],
"phi|Nô Bộc|Kỵ|Quan Lộc":[["Nhiều tác giả","Nô Bộc phi Kỵ nhập Quan Lộc (Thuận thủy Kỵ, xung Phu Thê): cấp dưới lười, bạn lợi dụng gây khó; sự nghiệp không được giúp, tiểu nhân, đối thủ, khó thi cử thăng tiến; hôn nhân dễ biến động.","Mặt tốt: bạn có xu hướng rất để tâm tới người dưới và bạn đồng nghiệp. Mặt xấu: cấp dưới lười, bạn lợi dụng gây khó, sự nghiệp ít được giúp, gặp tiểu nhân, khó thi cử thăng tiến và hôn nhân dễ biến động.","hung"],["","Cách đọc khác: bạn bè che chở, dễ kết bạn trọng sự nghiệp.","Mặt tốt: bạn có xu hướng kết bạn trọng sự nghiệp, được bạn che chở. Mặt xấu: chuyện bạn bè và công việc dính nhau, quan hệ đổ là việc cũng chao.","trung"]],
"phi|Nô Bộc|Lộc|Tử Tức":[["Huy Hà Phan; Lai Nhân; Trung Châu; Lương Nhược Du","Lộc phi từ Nô Bộc nhập Tử Tức: bạn bè thân thiện, dễ gần gũi trẻ con, có duyên với người khác giới, có thể giúp làm ra tiền.","Mặt tốt: bạn có xu hướng có bạn bè thân thiện, dễ gần trẻ con, có duyên với người khác giới. Mặt xấu: duyên khác giới nhiều dễ sinh chuyện tình cảm rắc rối.","cat"]],
"phi|Nô Bộc|Khoa|Phu Thê":[["Huy Hà Phan; Lai Nhân; Trung Châu; Lương Nhược Du","Khoa phi từ Nô Bộc nhập Phu Thê: tình cảm êm dịu, lãng mạn; bạn bè nâng đỡ sự nghiệp; bạn đời có thể do bạn bè mai mối.","Mặt tốt: bạn có xu hướng có tình cảm êm dịu, lãng mạn, được bạn bè nâng đỡ sự nghiệp và mai mối. Mặt xấu: bạn bè xen vào chuyện lứa đôi nhiều thì dễ có lời ra tiếng vào.","cat"]],
"phi|Nô Bộc|Kỵ|Điền Trạch":[["Huy Hà Phan; Lai Nhân; Trung Châu; Lương Nhược Du","Kỵ phi từ Nô Bộc nhập Điền Trạch (Thuận thủy Kỵ): tiểu nhân lấn vào, hao tổn tài sản, mua bán dễ chịu thiệt.","Mặt tốt: bạn có xu hướng cởi mở, cho người ngoài vào chuyện nhà. Mặt xấu: tiểu nhân lấn vào, tài sản hao tổn, mua bán nhà đất dễ chịu thiệt.","hung"]],
"mchat|Nô Bộc|chat":[["Trịnh Mục Đức","M chất có ở Nô Bộc: thành công nhờ bạn bè và quý nhân; nên vun đắp người của mình; ra nước ngoài mới gặp thời.","Mặt tốt: bạn có xu hướng thành công nhờ bạn bè, người giúp, ra nước ngoài thì gặp thời. Mặt xấu: phụ thuộc vào người ngoài, ở yên trong nước thì khó phát.","cat"]],
"mchat|Nô Bộc|Tài Bạch":[["Trịnh Mục Đức","Nô Bộc có M Tài / M Quan / M Điền / M Tật: kiếm tiền nhờ bạn, hợp dịch vụ; hàng xóm là bạn, mua nhà nhờ bạn giới thiệu; bạn bè hay tìm đến mình.","Mặt tốt: bạn có xu hướng kiếm tiền nhờ bạn, hợp dịch vụ, mua nhà nhờ bạn giới thiệu. Mặt xấu: bạn bè hay tìm đến nhờ vả, tốn thời gian và tiền.","cat"]],
"sao|Cự Môn|Nô Bộc":[["Hà Lạc; Trần Đoàn; Trần Bỉnh Húc; Sở Hoàng","Cự Môn tại Nô Bộc: tính bài xích, duyên bạc với người thân, bạn bè thị phi; có thuộc hạ đắc lực nhưng có tranh chấp; nhập miếu thì cấp dưới dần tốt; nếu Cự hành kỵ thần dù cung khí tốt vẫn gặp rắc rối.","Mặt tốt: bạn có xu hướng có thuộc hạ đắc lực, về sau cấp dưới dần tốt. Mặt xấu: tính hay bài xích, duyên với người thân mỏng, bạn bè thị phi, dễ tranh chấp với người dưới.","trung"]],
"sao|Thái Dương|Nô Bộc":[["","Thái Dương tại Nô Bộc: hào sảng, giúp người nhiều nhưng tri kỷ ít, dễ bị hiểu lầm; nhiều thuộc hạ có năng lực, cung khí tốt và Thái Dương hỉ thần thì rất vượng.","Mặt tốt: bạn thuộc mẫu người hào sảng, giúp người nhiều, có nhiều thuộc hạ năng lực. Mặt xấu: tri kỷ ít, dễ bị hiểu lầm.","cat"]],
"sao|Thiên Đồng|Nô Bộc":[["Phi tinh Trần Đoàn; Đẩu số cung vị; Sở Hoàng","Thiên Đồng ở Nô Bộc: miếu vượng thì người dưới đắc lực, gặp sát thì dễ trở mặt; Kình Dương miếu thì về già mới có người đỡ, nếu hãm thì dễ phản chủ; Tả Phù, Liêm Trinh miếu vượng thì có nhiều bạn trợ giúp, hãm địa dễ bị phản bội.","Mặt tốt: bạn có xu hướng có người dưới đắc lực, bạn bè trợ giúp khi hoàn cảnh thuận. Mặt xấu: khi hoàn cảnh xấu thì người dưới dễ trở mặt, có người phản bội; có khi về già mới có người đỡ.","trung"]],
"dv|nhap|Lộc|Mệnh":[["Trung Châu","Hóa Lộc ĐV (từ ĐV Mệnh) nhập Mệnh nguyên cục: Hồi quy Lộc, mười năm có cơ hội đến tận tay, rất cát; nếu đồng thời Kỵ xung ngã cung thì Lộc không thực.","Mặt tốt: bạn có xu hướng gặp nhiều cơ hội đến tận tay trong giai đoạn này. Mặt xấu: nếu cùng lúc có áp lực đè lên bản thân thì cơ hội ấy không thực, dễ hụt.","cat"]],
"dv|nhap|Lộc|Huynh Đệ":[["Trung Châu","Lộc ĐV nhập tuyến Huynh–Nô (Huynh Đệ): thành tựu, tiêu xài, trợ lực, tình cảm; biến động với anh em, bạn thân, mẹ; là Lộc nhập tha cung nên lợi đi ra ngoài trước.","Mặt tốt: bạn có xu hướng có thành tựu, được trợ lực từ anh em, bạn thân trong giai đoạn này. Mặt xấu: lợi đi ra ngoài trước, tiêu xài nhiều và quan hệ với anh em, mẹ có biến động.","cat"]],
"dv|nhap|Lộc|Phu Thê":[["Trung Châu","Lộc ĐV nhập tuyến Phu–Quan (Phu Thê): tình cảm, hôn nhân thuận, người phối ngẫu mang lại lợi; Lộc nhập tha cung.","Mặt tốt: bạn có xu hướng thuận tình cảm, hôn nhân trong giai đoạn này, người bạn đời mang lại lợi. Mặt xấu: cái lợi nằm ở người kia nên bạn dễ phụ thuộc.","cat"]],
"dv|nhap|Lộc|Tử Tức":[["Trung Châu","Lộc ĐV nhập tuyến Tử–Điền (Tử Tức): đào hoa, giải trí, hợp tác, con cái mang niềm vui; Lộc nhập tha cung nên dễ chi ra ngoài; nếu đối cung có Lộc thì thành Điệp xuất hoặc 'Thị phi Lộc'.","Mặt tốt: bạn có xu hướng có nhiều niềm vui từ con cái, giải trí, hợp tác trong giai đoạn này. Mặt xấu: dễ chi ra ngoài, dễ có chuyện tình cảm ngoài lề.","trung"]],
"dv|nhap|Lộc|Tài Bạch":[["Trung Châu","Lộc ĐV nhập Tài Bạch nguyên cục: Hồi quy tam hợp, tiền bạc, kinh doanh thuận, càng nhiều Lộc hồi quy càng cát.","Mặt tốt: bạn có xu hướng thuận tiền bạc, kinh doanh trong giai đoạn này. Mặt xấu: thuận lâu dễ chủ quan, mở rộng quá tay.","cat"]],
"dv|nhap|Lộc|Tật Ách":[["Trung Châu","Lộc ĐV nhập tuyến Phụ–Tật (Tật Ách): thân thể thoải mái, có 'quang minh', hưởng thụ; dễ lười.","Mặt tốt: bạn có xu hướng thấy thân thể thoải mái, mọi việc sáng sủa trong giai đoạn này. Mặt xấu: dễ lười, ham hưởng thụ.","cat"]],
"dv|nhap|Lộc|Thiên Di":[["Trung Châu","Lộc ĐV nhập Thiên Di: cơ hội ở ngoài, đi xa thuận; Lộc nhập tha cung nên lợi đến từ bên ngoài nhưng dễ cho đi.","Mặt tốt: bạn có xu hướng có cơ hội ở bên ngoài, đi xa thuận trong giai đoạn này. Mặt xấu: lợi đến từ bên ngoài nhưng dễ cho đi, khó giữ lại.","cat"]],
"dv|nhap|Lộc|Nô Bộc":[["Trung Châu; Từ Tăng Sinh","Lộc ĐV nhập tuyến Huynh–Nô (Nô Bộc): thành tựu nhờ bạn bè, đồng sự; nhưng nếu Kỵ lại xung ngã cung thì 'giúp người, lúc khó họ mới tìm'; lợi bị đẩy cho người khác, nên biết đủ.","Mặt tốt: bạn có xu hướng có thành tựu nhờ bạn bè, đồng sự trong giai đoạn này. Mặt xấu: lợi dễ bị đẩy sang người khác, giúp người mà họ chỉ tìm khi gặp khó.","trung"]],
"dv|nhap|Lộc|Quan Lộc":[["Trung Châu","Lộc ĐV (ĐV Mệnh) nhập Quan Lộc nguyên cục: Hồi quy tam hợp, sự nghiệp thuận, có thể là Phản cung Lộc (lợi gấp đôi); thành bại do chính mình.","Mặt tốt: bạn có xu hướng thuận sự nghiệp trong giai đoạn này, có khi lợi gấp đôi. Mặt xấu: thành bại đều do chính mình, sai một bước thì cũng tự gánh.","cat"]],
"dv|nhap|Lộc|Điền Trạch":[["Trung Châu","Lộc ĐV nhập tuyến Tử–Điền (Điền Trạch): kho tiền, gia sản, nhà cửa thuận; thời điểm tốt để an cư.","Mặt tốt: bạn có xu hướng thuận nhà cửa, gia sản, đây là lúc tốt để an cư. Mặt xấu: dồn tiền vào nhà thì kém linh hoạt khi cần.","cat"]],
"dv|nhap|Lộc|Phúc Đức":[["Trung Châu","Lộc ĐV nhập Phúc Đức: tinh thần, hưởng thụ, quý nhân thuận; nếu đối cung Tài Bạch thì Lộc chiếu tài.","Mặt tốt: bạn có xu hướng tinh thần vui, được hưởng thụ, gặp người tốt, tiền bạc được hỗ trợ trong giai đoạn này. Mặt xấu: dễ ham vui, tiêu nhiều cho hưởng thụ.","cat"]],
"dv|nhap|Lộc|Phụ Mẫu":[["Trung Châu","Lộc ĐV nhập tuyến Phụ–Tật (Phụ Mẫu): cha mẹ, cấp trên, giấy tờ thuận, có 'quang minh'; lợi thi cử.","Mặt tốt: bạn có xu hướng thuận với cha mẹ, cấp trên, giấy tờ, thi cử trong giai đoạn này. Mặt xấu: dựa nhiều vào người trên thì dễ mất chủ động.","cat"]],
"dv|nhap|Kỵ|Mệnh":[["Trung Châu","Kỵ ĐV nhập Mệnh nguyên cục: vào ngã cung nên 'có thể thuận' – trách nhiệm dồn về mình; nếu Lộc ĐV đi tha cung thì 'trước khổ sau sướng'; trùng Lộc năm sinh thì thành Song Kỵ, hao tổn.","Mặt tốt: bạn có xu hướng có thể thuận, trách nhiệm dồn về mình giúp bạn trưởng thành, có khi trước khổ sau sướng. Mặt xấu: áp lực dồn lên bản thân, và nếu chồng với cái lợi gốc thì dễ hao tổn.","trung"]],
"dv|nhap|Kỵ|Huynh Đệ":[["Trung Châu","Kỵ ĐV nhập tuyến Huynh–Nô (Huynh Đệ): biến động với anh em, bạn thân, hợp tác; tránh vay mượn, thế chấp; 'không có thành tựu' trên tuyến đó.","Mặt tốt: bạn có xu hướng để tâm tới anh em, bạn thân trong giai đoạn này. Mặt xấu: quan hệ với anh em, bạn thân, hợp tác biến động, khó có thành tựu ở mảng này. Gợi ý: tránh vay mượn, thế chấp.","hung"]],
"dv|nhap|Kỵ|Phu Thê":[["Trung Châu","Kỵ ĐV nhập tuyến Phu–Quan (Phu Thê): xung Quan Lộc, tổn thất hôn nhân và sự nghiệp; trùng Kỵ năm sinh thành Song Kỵ, rất hung; đi xa phát sinh vấn đề.","Mặt tốt: bạn có xu hướng để tâm nhiều tới hôn nhân trong giai đoạn này. Mặt xấu: hôn nhân và sự nghiệp dễ tổn thất, đi xa phát sinh vấn đề; nếu chồng với bất lợi gốc thì rất xấu.","hung"]],
"dv|nhap|Kỵ|Tử Tức":[["Trung Châu","Kỵ ĐV nhập tuyến Tử–Điền (Tử Tức): xung Điền Trạch; có việc bất ngờ lớn liên quan con cái, hợp tác, gia sản.","Mặt tốt: bạn có xu hướng để tâm nhiều tới con cái, hợp tác trong giai đoạn này. Mặt xấu: dễ có việc bất ngờ lớn liên quan con cái, hợp tác, gia sản.","hung"]],
"dv|nhap|Kỵ|Tài Bạch":[["Trung Châu","Kỵ ĐV nhập Tài Bạch nguyên cục: vào ngã cung, cohoc đọc 'có phần thuận' – chuyên tâm kiếm tiền, giữ tiền; nhưng nếu xung Phúc thì vất vả.","Mặt tốt: bạn có xu hướng chuyên tâm kiếm tiền, giữ tiền trong giai đoạn này. Mặt xấu: kiếm tiền vất vả, tinh thần chịu sức ép vì tiền.","trung"]],
"dv|nhap|Kỵ|Tật Ách":[["Trung Châu","Kỵ ĐV nhập tuyến Phụ–Tật (Tật Ách): mất 'quang minh', lao lực, cần giữ sức; xung Phụ Mẫu ảnh hưởng giấy tờ, cha mẹ.","Mặt tốt: bạn có xu hướng thấy rõ giới hạn sức mình trong giai đoạn này. Mặt xấu: lao lực, dễ đau dạ dày, mất ngủ, bệnh cũ tái phát; giấy tờ và chuyện cha mẹ trục trặc. Gợi ý: giữ sức, khám sức khỏe và hỏi bác sĩ khi có dấu hiệu lạ.","hung"]],
"dv|nhap|Kỵ|Thiên Di":[["Trung Châu","Kỵ ĐV nhập Thiên Di: tự xung Mệnh, ra ngoài nhiều trở ngại, đi xa phát sinh vấn đề.","Mặt tốt: bạn có xu hướng được rèn bản lĩnh qua trở ngại bên ngoài. Mặt xấu: ra ngoài nhiều trở ngại, đi xa phát sinh vấn đề, bản thân chịu sức ép.","hung"]],
"dv|nhap|Kỵ|Nô Bộc":[["Trung Châu; Từ Tăng Sinh","Kỵ ĐV nhập tuyến Huynh–Nô (Nô Bộc): tiền bạc qua lại với bạn dễ mất, dễ đổ vỡ quan hệ; nếu tự hóa Lộc ở đó thì thành Song Kỵ; tránh cho vay.","Mặt tốt: bạn có xu hướng rất để tâm tới bạn bè trong giai đoạn này. Mặt xấu: tiền bạc qua lại với bạn dễ mất, quan hệ dễ đổ vỡ. Gợi ý: tránh cho vay.","hung"]],
"dv|nhap|Kỵ|Quan Lộc":[["Trung Châu","Kỵ ĐV nhập Quan Lộc nguyên cục: ngã cung nên có lúc được đọc 'có phần thuận' (chuyên tâm sự nghiệp); nhưng xung Phu Thê, vất vả, dễ là Củ triền Kỵ nếu Phu Thê cũng bị Kỵ.","Mặt tốt: bạn có xu hướng chuyên tâm sự nghiệp trong giai đoạn này. Mặt xấu: vất vả, hôn nhân bị ảnh hưởng vì việc, vợ chồng dễ giằng co.","trung"]],
"dv|nhap|Kỵ|Điền Trạch":[["Trung Châu","Kỵ ĐV nhập Điền Trạch nguyên cục: ngã cung, có thể thuận về giữ của; nhưng xung Tử Tức, cần phòng việc liên quan con cái, hợp tác.","Mặt tốt: bạn có xu hướng giữ của tốt trong giai đoạn này. Mặt xấu: dễ có chuyện với con cái hoặc người hợp tác.","trung"]],
"dv|nhap|Kỵ|Phúc Đức":[["Trung Châu","Kỵ ĐV nhập Phúc Đức: lo nghĩ, tinh thần nặng nề, xung Tài Bạch nên tiêu tiền theo cảm xúc.","Mặt tốt: bạn có xu hướng sống sâu với cảm xúc trong giai đoạn này. Mặt xấu: lo nghĩ, tinh thần nặng nề, tiêu tiền theo cảm xúc.","hung"]],
"dv|nhap|Kỵ|Phụ Mẫu":[["Trung Châu","Kỵ ĐV nhập tuyến Phụ–Tật (Phụ Mẫu): hôn nhân hoặc việc nhà bị ảnh hưởng từ phía cha mẹ; giấy tờ, cấp trên trục trặc; xung Tật Ách cần giữ sức.","Mặt tốt: bạn có xu hướng để tâm nhiều tới cha mẹ trong giai đoạn này. Mặt xấu: hôn nhân, việc nhà bị ảnh hưởng từ phía cha mẹ, giấy tờ và cấp trên trục trặc, sức khỏe cần giữ.","hung"]],
"dv|nhap|Quyền|*":[["Trung Châu","Hóa Quyền ĐV nhập một cung: chủ đề cung đó được đẩy mạnh, có chủ động, nắm quyền; nhập ngã cung thì cát rõ, nhập tha cung là Quyền xuất – thường trống rỗng, cộng hưởng yếu.","Mặt tốt: bạn có xu hướng chủ động, nắm quyền và đẩy mạnh mảng này trong giai đoạn này. Mặt xấu: nếu sức lực đổ ra mảng của người khác thì thường trống rỗng, công nhiều mà kết quả ít.","cat"]],
"dv|nhap|Khoa|*":[["Trung Châu","Hóa Khoa ĐV nhập một cung: danh tiếng, quý nhân, sự ổn định cho chủ đề cung đó; nhập tha cung là Khoa xuất, ít thực chất.","Mặt tốt: bạn có xu hướng có danh, có người giúp, ổn định ở mảng này trong giai đoạn này. Mặt xấu: nếu cái danh ấy thuộc về mảng của người khác thì ít thực chất.","cat"]],
"dv|chieu|Lộc|*":[["Từ Tăng Sinh","Lộc Dụng chiếu Thể (ĐV.X phi Lộc chiếu X thiên bàn): cát lợi rất mạnh cho chủ đề X; Lộc Thể chiếu Dụng (X phi Lộc chiếu ĐV.X): cát tượng, cần nghiệm.","Mặt tốt: bạn có xu hướng gặp lợi rất mạnh cho mảng này trong giai đoạn này. Mặt xấu: được thuận nhiều dễ chủ quan, cần nghiệm lại bằng việc thật.","cat"]],
"dv|chieu|Lộc|Thiên Di":[["Từ Tăng Sinh","ĐV Thiên Di phi Lộc chiếu Thiên Di thiên bàn: đối ngoại, đi xa, xuất ngoại rất thuận.","Mặt tốt: bạn có xu hướng rất thuận đối ngoại, đi xa, ra nước ngoài trong giai đoạn này. Mặt xấu: ham ra ngoài thì chuyện nhà dễ bị lơ.","cat"]],
"dv|chieu|Lộc|Phu Thê":[["Từ Tăng Sinh","Phu Thê phi Lộc chiếu (Dụng chiếu Thể hoặc Thể chiếu Dụng): hôn nhân, tình cảm cát lợi rất mạnh.","Mặt tốt: bạn có xu hướng thuận hôn nhân, tình cảm rất rõ trong giai đoạn này. Mặt xấu: dễ dồn hết tâm cho tình cảm mà lơ việc khác.","cat"]],
"dv|chieu|Lộc|Tử Tức":[["Từ Tăng Sinh","Tử Tức phi Lộc chiếu: con cái và sinh hoạt gia đình thuận lợi.","Mặt tốt: bạn có xu hướng thuận chuyện con cái và sinh hoạt gia đình trong giai đoạn này. Mặt xấu: chi tiêu cho con và cho vui chơi dễ tăng.","cat"]],
"dv|chieu|Lộc|Mệnh":[["Từ Tăng Sinh","ĐV Mệnh phi Lộc chiếu Mệnh thiên bàn: cát lợi rất mạnh cho bản thân.","Mặt tốt: bạn có xu hướng gặp nhiều cái lợi cho bản thân trong giai đoạn này. Mặt xấu: được lợi nhiều dễ chủ quan, tự tin quá mức.","cat"]],
"dv|chieu|Lộc|Huynh Đệ":[["Từ Tăng Sinh","ĐV Huynh Đệ phi Lộc chiếu Huynh Đệ thiên bàn: cát lợi rất mạnh cho anh em, bạn thân, hợp tác.","Mặt tốt: bạn có xu hướng rất thuận với anh em, bạn thân, hợp tác trong giai đoạn này. Mặt xấu: tin bạn nhiều thì dễ lơ là giấy tờ, phòng bị.","cat"]],
"dv|chieu|Lộc|Điền Trạch":[["Từ Tăng Sinh","Điền Trạch phi Lộc chiếu: gia sản, nhà cửa cát lợi rất mạnh.","Mặt tốt: bạn có xu hướng rất thuận gia sản, nhà cửa trong giai đoạn này. Mặt xấu: dễ dồn hết tiền vào nhà đất.","cat"]],
"dv|chieu|Lộc|Quan Lộc":[["Từ Tăng Sinh","Quan Lộc phi Lộc chiếu: sự nghiệp cát lợi rất mạnh.","Mặt tốt: bạn có xu hướng rất thuận sự nghiệp trong giai đoạn này. Mặt xấu: bận rộn nhiều, dễ lơ gia đình và sức khỏe.","cat"]],
"dv|chieu|Lộc|Phúc Đức":[["Từ Tăng Sinh","Phúc Đức phi Lộc chiếu: tinh thần, hưởng thụ, quý nhân cát lợi mạnh.","Mặt tốt: bạn có xu hướng tinh thần thoải mái, được hưởng thụ, gặp người giúp trong giai đoạn này. Mặt xấu: dễ ham vui mà lơ việc.","cat"]],
"dv|chieu|Lộc|Tài Bạch":[["Từ Tăng Sinh","Tài Bạch phi Lộc chiếu: tiền bạc cát lợi mạnh.","Mặt tốt: bạn có xu hướng thuận tiền bạc trong giai đoạn này. Mặt xấu: tiền dễ vào thì cũng dễ tiêu, ít khi giữ được hết.","cat"]],
"dv|chieu|Lộc|Nô Bộc":[["Từ Tăng Sinh","Nô Bộc phi Lộc chiếu: bạn bè, đồng sự, cấp dưới cát lợi.","Mặt tốt: bạn có xu hướng thuận với bạn bè, đồng sự, cấp dưới trong giai đoạn này. Mặt xấu: dựa nhiều vào người khác thì dễ thụ động.","cat"]],
"dv|chieu|Quyền|*":[["Từ Tăng Sinh","Quyền Dụng chiếu Thể / Quyền Thể chiếu Dụng: cát tượng cho chủ đề cung, cần nghiệm lý.","Mặt tốt: bạn có xu hướng có sức chủ động ở mảng này trong giai đoạn này. Mặt xấu: tín hiệu chưa chắc, cần nghiệm bằng kết quả thật mới biết.","cat"]],
"dv|chieu|Khoa|*":[["Từ Tăng Sinh","Khoa Dụng chiếu Thể / Khoa Thể chiếu Dụng: tín hiệu tốt, có quý nhân, danh tiếng; cát tượng cần nghiệm.","Mặt tốt: bạn có xu hướng có danh, có người giúp ở mảng này trong giai đoạn này. Mặt xấu: lợi thực có thể nhỏ hơn tiếng.","cat"]],
"dv|kyXungNc|*":[["Trịnh Mục Đức","Kỵ Dụng xung Thể (ĐV.X phi Kỵ xung X thiên bàn): báo động đỏ, rất xấu cho chủ đề X; ứng năm theo tam điểm của cung Kỵ đến.","Mặt tốt: bạn có xu hướng được cảnh báo rõ mảng nào dễ có chuyện trong giai đoạn này. Mặt xấu: đây là dấu hiệu rất xấu cho mảng ấy, khả năng gặp chuyện cao. Gợi ý: giữ thế thủ, tránh quyết lớn ở mảng này.","hung"]],
"dv|kyXungNc|Tài Bạch":[["Trịnh Mục Đức","ĐV Tài Bạch phi Kỵ xung Tài Bạch thiên bàn: tài chính báo động đỏ, kéo theo biến động công việc và sức khỏe.","Mặt tốt: bạn có xu hướng biết trước tài chính cần giữ chặt trong giai đoạn này. Mặt xấu: tiền bạc có dấu hiệu rất xấu, kéo theo biến động công việc và sức khỏe.","hung"]],
"dv|kyXungNc|Nô Bộc":[["Trịnh Mục Đức","ĐV Nô Bộc phi Kỵ xung Nô Bộc thiên bàn: bạn bè, đồng sự, người hợp tác rất xấu.","Mặt tốt: bạn có xu hướng biết cần dè chừng ai trong giai đoạn này. Mặt xấu: quan hệ với bạn bè, đồng sự, người hợp tác rất xấu, dễ bị phụ hoặc thiệt.","hung"]],
"dv|kyXungNc|Phúc Đức":[["Trịnh Mục Đức","Phúc Đức của đại vận phi Kỵ xung Phúc Đức thiên bàn: rất xấu cho tinh thần, sự hưởng thụ, quý nhân và gia nghiệp.","Mặt tốt: bạn có xu hướng biết trước giai đoạn cần giữ tinh thần. Mặt xấu: tinh thần, sự hưởng thụ, người giúp và gia nghiệp đều dễ đi xuống rõ.","hung"]],
"dv|kyXungNc|Huynh Đệ":[["Trịnh Mục Đức","ĐV Huynh Đệ phi Kỵ xung Huynh Đệ: anh em, bạn thân rất xấu.","Mặt tốt: bạn có xu hướng biết trước cần giữ khoảng cách hợp lý với anh em, bạn thân trong giai đoạn này. Mặt xấu: quan hệ với anh em, bạn thân rất xấu, dễ sứt mẻ.","hung"]],
"dv|kyXungNc|Thiên Di":[["Trịnh Mục Đức","ĐV Thiên Di phi Kỵ xung Thiên Di: đối ngoại, đi xa rất xấu.","Mặt tốt: bạn có xu hướng biết trước cần hạn chế đi xa trong giai đoạn này. Mặt xấu: đối ngoại, đi xa rất xấu, dễ gặp sự cố bên ngoài.","hung"]],
"dv|ncXungDv|*":[["Trịnh Mục Đức","Kỵ Thể xung Dụng (cung X nguyên cục phi Kỵ xung ĐV.X): báo động vàng, xấu vừa; ví dụ Điền Trạch: rủi ro gia sản, nhà cửa; Phu Thê: tình cảm; Tài Bạch: tài chính.","Mặt tốt: bạn có xu hướng thấy được mảng nào cần phòng trong giai đoạn này. Mặt xấu: mảng ấy xấu ở mức vừa, ví dụ nhà cửa, tình cảm hay tài chính có rủi ro.","hung"]],
"dv|ncNhapDv|Lộc|*":[["Ông Phúc Dụ","Lộc Thể nhập Dụng (cung X nguyên cục phi Lộc nhập ĐV.X): cát cho chủ đề X, cần nghiệm thêm.","Mặt tốt: bạn có xu hướng có cái lợi cho mảng này trong giai đoạn này. Mặt xấu: tín hiệu chưa chắc, cần nghiệm thêm.","cat"]],
"dv|ncNhapDv|Kỵ|*":[["Trịnh Mục Đức","Kỵ Thể nhập Dụng (cung X nguyên cục phi Kỵ nhập ĐV.X): hung cho chủ đề X, báo động vàng, cần khảo sát thêm.","Mặt tốt: bạn có xu hướng biết được mảng nào sẽ khó trong giai đoạn này. Mặt xấu: mảng ấy có dấu hiệu xấu ở mức vừa, cần khảo sát thêm trước khi quyết.","hung"]],
"dv|quyVi|Lộc|*":[["Ông Phúc Dụ","Quy vị Lộc (ĐV.X phi Lộc nhập X thiên bàn): cát cho chủ đề X; ứng năm có chi của ĐV Mệnh và Mệnh nguyên cục, cộng tam điểm cung nhận.","Mặt tốt: bạn có xu hướng có cái lợi cho mảng này trong giai đoạn này. Mặt xấu: cái lợi đến vào những năm cụ thể, không phải lúc nào cũng có.","cat"]],
"dv|quyVi|Quyền|*":[["Ông Phúc Dụ","Quy vị Quyền: cát cho chủ đề cung, có chủ động và kiểm soát.","Mặt tốt: bạn có xu hướng chủ động, kiểm soát tốt mảng này trong giai đoạn này. Mặt xấu: kiểm soát mạnh dễ thành áp đặt.","cat"]],
"dv|quyVi|Khoa|*":[["Ông Phúc Dụ","Quy vị Khoa: cát, có danh, quý nhân, ổn định cho chủ đề cung.","Mặt tốt: bạn có xu hướng có danh, có người giúp, ổn định ở mảng này trong giai đoạn này. Mặt xấu: ổn định thì ít bứt phá.","cat"]],
"dv|quyVi|Kỵ|*":[["Trịnh Mục Đức","Quy vị Kỵ (ĐV.X phi Kỵ nhập X thiên bàn): báo động vàngcho chủ đề X; nếu là Song Kỵ quy vị thì có sách đọc là tụ tài.","Mặt tốt: bạn có xu hướng để tâm nhiều vào mảng này, có trường hợp gom được của. Mặt xấu: mảng ấy có dấu hiệu xấu ở mức vừa trong giai đoạn này.","hung"]],
"dv|kyNhapMenh|*":[["Trịnh Mục Đức","ĐV.X phi Kỵ nhập Mệnh thiên bàn: 'vô duyên', gần ít xa nhiều, hao tổn, xấu vừa; ứng năm theo tam điểm của Mệnh gốc.","Mặt tốt: bạn có xu hướng tự gánh phần trách nhiệm của mảng này. Mặt xấu: quan hệ với mảng ấy gần ít xa nhiều, hao tổn, xấu ở mức vừa.","hung"]],
"dv|kyXungMenh|*":[["Trịnh Mục Đức","ĐV.X phi Kỵ xung Mệnh thiên bàn: chủ đề X xấu(ví dụ Tật Ách: sức khỏe; Thiên Di: quan hệ bên ngoài).","Mặt tốt: bạn có xu hướng biết rõ mảng nào cần phòng trong giai đoạn này. Mặt xấu: mảng ấy khá xấu và đè lên bản thân, ví dụ sức khỏe hay quan hệ bên ngoài.","hung"]],
"dv|catNhapMenh|*":[["Từ Tăng Sinh","ĐV.X phi Lộc/Quyền/Khoa nhập Mệnh thiên bàn: cát lợi cho chủ đề X, cần nghiệm (cohoc ghi 'Quyền Dụng nhập Mệnh' là cát).","Mặt tốt: bạn có xu hướng được lợi từ mảng này dồn về bản thân trong giai đoạn này. Mặt xấu: tín hiệu cần nghiệm bằng việc thật, chưa chắc.","cat"]],
"dv|hoiQuy|Mệnh":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Hồi quy Lộc về Mệnh gốc (hoặc Lộc từ Tài/Quan ĐV nhập Mệnh gốc – hồi quy tam hợp): rất cát, càng nhiều càng tốt.","Mặt tốt: bạn có xu hướng gặp cái lợi quay về chính mình, rất tốt trong giai đoạn này. Mặt xấu: thuận nhiều dễ chủ quan, tiêu xài vượt mức.","cat"]],
"dv|hoiQuy|Tài Bạch":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Lộc ĐV hồi quy về Tài Bạch gốc: tiền bạc rất cát.","Mặt tốt: bạn có xu hướng rất thuận tiền bạc trong giai đoạn này. Mặt xấu: tiền nhiều dễ mạnh tay chi tiêu, đầu tư quá sức.","cat"]],
"dv|hoiQuy|Quan Lộc":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Lộc ĐV hồi quy về Quan Lộc gốc: sự nghiệp rất cát.","Mặt tốt: bạn có xu hướng rất thuận sự nghiệp trong giai đoạn này. Mặt xấu: lao vào việc quá thì lơ gia đình, sức khỏe.","cat"]],
"dv|phanCung|Lộc":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Phản cung Lộc: tam hợp ĐV trùng tam hợp bản mệnh mà có Lộc nhập → cát lợi gấp đôi.","Mặt tốt: bạn có xu hướng gặp cái lợi gấp đôi trong giai đoạn này. Mặt xấu: lợi lớn dễ khiến bạn ôm đồm, mở rộng quá sức.","cat"]],
"dv|phanCung|Kỵ":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Phản cung Kỵ: Kỵ nhập tam hợp bản mệnh theo cách đó → tổn thương ngang Song Kỵ, cần dưỡng sức ba năm trở lên.","Mặt tốt: bạn có xu hướng biết trước giai đoạn cần nghỉ, giữ sức. Mặt xấu: tổn thương nặng, cần dưỡng sức từ ba năm trở lên mới hồi lại.","hung"]],
"dv|thaNga|LocTha_KyNga":[["Trung Châu","Lộc ĐV phi nhập tha cung còn Kỵ nhập ngã cung: 'khổ trước sướng sau', bỏ công sức ra ngoài thì về sau được báo đáp.","Mặt tốt: bạn có xu hướng về sau được báo đáp xứng với công sức bỏ ra ngoài. Mặt xấu: trước khổ, giai đoạn đầu phải bỏ công nhiều mà chưa thấy gì.","cat"]],
"dv|thaNga|LocNga_KyXungNga":[["Trung Châu","Lộc nhập ngã cung mà Kỵ lại xung ngã cung: Lộc không chắc, dễ mất; có lợi rồi thì chớ mở rộng đầu tư.","Mặt tốt: bạn có xu hướng có cái lợi đến với bản thân. Mặt xấu: lợi ấy không chắc, dễ mất. Gợi ý: có lợi rồi thì đừng mở rộng đầu tư.","hung"]],
"dv|thaNga|LocTha_KyXungNga":[["Trung Châu; Từ Tăng Sinh","Lộc nhập tha cung còn Kỵ xung ngã cung: hung – mình giúp người, đợi lúc họ gặp khó mới tìm đến; lợi ích bị đẩy sang tay người khác, nên đi làm công và biết đủ.","Mặt tốt: bạn có xu hướng giúp được nhiều người trong giai đoạn này. Mặt xấu: người ta chỉ tìm khi gặp khó, lợi ích bị đẩy sang tay người khác. Gợi ý: đi làm công và biết đủ an toàn hơn.","hung"]],
"dv|thaNga|KyXungNga":[["Trung Châu","Kỵ xung ngã cung: thiệt hại để lại hậu quả dài, áp lực nặng; Hóa nhập không đúng chỗ khiến đương số chịu sức ép.","Mặt tốt: bạn có xu hướng được tôi luyện sức chịu áp lực trong giai đoạn này. Mặt xấu: thiệt hại để lại hậu quả dài, áp lực nặng đè lên bản thân.","hung"]],
"dv|thaNga|LocTheoKyVeNga":[["Trung Châu","Lộc theo Kỵ quay về ngã cung: hưởng lợi lớn từ bên ngoài, vận rất tốt nhưng phải xem xét kỹ; ngã cung ấy không được tự hóa, nếu tự hóa thì thành tổn thất.","Mặt tốt: bạn có xu hướng hưởng lợi lớn từ bên ngoài, vận rất tốt. Mặt xấu: nếu chính bạn tự đẩy cái lợi ra thì lại thành tổn thất, cần xét kỹ.","cat"]],
"dv|thaNga|PhiThaTieuHao":[["Trung Châu","Lộc và Kỵ ĐV cùng phi tha cung: tiêu hao, để lại hậu quả lâu dài, Kỵ đặc biệt dai.","Mặt tốt: bạn có xu hướng bỏ sức nhiều cho người khác. Mặt xấu: tiêu hao, để lại hậu quả lâu dài, cái xấu đặc biệt dai dẳng.","hung"]],
"dv|cap|Lộc_TaiBach|Kỵ_NoBoc":[["Từ Tăng Sinh","Từ cung vận, Kỵ nhập Nô Bộc trong khi Lộc nhập Tài Bạch: chuyện tiền nong qua lại với bạn bè dễ hao hụt.","Mặt tốt: bạn có xu hướng có tiền vào trong giai đoạn này. Mặt xấu: chuyện tiền nong qua lại với bạn bè dễ hao hụt.","hung"]],
"dv|cap|Lộc_Mệnh|Kỵ_PhuThe":[["Từ Tăng Sinh","Cung vận phi Lộc nhập Mệnh, Kỵ nhập Phu Thê: Lộc không thực, cần cảnh giác.","Mặt tốt: bạn có xu hướng có cái lợi đến với bản thân. Mặt xấu: lợi ấy không thực, hôn nhân lại chịu áp lực. Gợi ý: cảnh giác với điều nghe quá tốt.","hung"]],
"dv|cap|Lộc_Tha|Kỵ_PhuThe":[["Từ Tăng Sinh","Từ cung vận, Kỵ nhập Phu Thê còn Lộc phi ra tha cung: có tình bạn nhưng cũng có kiếp nạn do bạn bè, ảnh hưởng tới hôn nhân.","Mặt tốt: bạn có xu hướng có tình bạn trong giai đoạn này. Mặt xấu: cũng có rắc rối do bạn bè gây ra, ảnh hưởng tới hôn nhân.","hung"]],
"tuyen|HuynhNo|cat":[["Khai quán nhân Tử Vi; Phương Ngoại Nhân","Cung khí số vị hóa Lộc/Quyền/Khoa nhập tuyến Huynh–Nô (kể cả tự hóa ở Huynh Đệ): vận này có thành tựu, nhờ bạn bè, cấp dưới.","Mặt tốt: bạn có xu hướng có thành tựu nhờ bạn bè, cấp dưới trong giai đoạn này. Mặt xấu: thành tựu dựa vào người khác thì dễ chao khi họ đổi.","cat"]],
"tuyen|HuynhNo|ky":[["Khai quán nhân Tử Vi; Phương Ngoại Nhân","Cung khí số vị hóa Kỵ nhập tuyến Huynh–Nô: vận này không có thành tựu trên tuyến đó.","Mặt tốt: bạn có xu hướng tự thấy rõ mảng bạn bè, anh em chưa phải chỗ dựa trong giai đoạn này. Mặt xấu: không có thành tựu ở mảng anh em, bạn bè, cấp dưới.","hung"]],
"tuyen|PhuTat|cat":[["Khai quán nhân Tử Vi; Phương Ngoại Nhân","Cung khí số vị hóa Lộc/Quyền/Khoa nhập tuyến Phụ–Tật: vận có 'quang minh', sáng sủa, minh bạch.","Mặt tốt: bạn có xu hướng thấy mọi việc sáng sủa, minh bạch trong giai đoạn này. Mặt xấu: thuận quá dễ chủ quan.","cat"]],
"tuyen|PhuTat|ky":[["Khai quán nhân Tử Vi; Phương Ngoại Nhân","Cung khí số vị hóa Kỵ nhập tuyến Phụ–Tật: mất quang minh, tổn hại tinh thần.","Mặt tốt: bạn có xu hướng biết trước cần giữ tinh thần trong giai đoạn này. Mặt xấu: mọi việc kém minh bạch, tinh thần bị tổn hại.","hung"]],
"dv|trung|Kỵ|Lộc":[["Trung Châu","Kỵ năm sinh trùng Lộc đại vận: biến xấu thành tốt, rất tốt.","Mặt tốt: bạn có xu hướng thấy điều vốn là gánh nặng biến thành điều tốt, rất tốt trong giai đoạn này. Mặt xấu: tốt đến từ chỗ khó nên vẫn phải bỏ công.","cat"]],
"dv|trung|Lộc|Khoa":[["Trung Châu","Lộc năm sinh trùng Khoa đại vận: danh và tiền đều có, thi cử thuận, thiên về chuyên môn, cần lao tâm.","Mặt tốt: bạn có xu hướng có cả danh lẫn tiền, thi cử thuận, thiên về chuyên môn trong giai đoạn này. Mặt xấu: phải lao tâm nhiều.","cat"]],
"dv|trung|Lộc|Kỵ":[["Trung Châu","Lộc năm sinh trùng Kỵ đại vận (Song Kỵ): hao tài, bất hòa, được rồi mất, thị phi nhiều, rất xấu.","Mặt tốt: bạn có xu hướng thấy rõ mảng nào cần giữ trong giai đoạn này. Mặt xấu: hao tài, bất hòa, được rồi mất, điều tiếng nhiều, rất xấu.","hung"]],
"dv|trung|Lộc|Quyền":[["Trung Châu","Lộc năm sinh gặp trùng Quyền của đại vận: tiền lợi thịnh vượng nhưng phải vất vả.","Mặt tốt: bạn có xu hướng thịnh tiền lợi trong giai đoạn này. Mặt xấu: phải vất vả mới có.","cat"]],
"dv|trung|Kỵ|Quyền":[["Trung Châu","Kỵ năm sinh trùng Quyền đại vận: bất hòa, tranh chấp, thị phi, lao lực, tài chính không thuận.","Mặt tốt: bạn có xu hướng được rèn sức chịu đựng. Mặt xấu: bất hòa, tranh chấp, thị phi, lao lực, tài chính không thuận.","hung"]],
"dv|trung|Quyền|Khoa":[["Trung Châu","Quyền năm sinh trùng Khoa đại vận: có địa vị, kỹ năng chuyên môn, danh lợi dễ được.","Mặt tốt: bạn có xu hướng có địa vị, chuyên môn, danh lợi dễ đến trong giai đoạn này. Mặt xấu: dễ tự mãn khi danh đến dễ.","cat"]],
"dv|trung|Quyền|Kỵ":[["Trung Châu","Quyền năm sinh gặp trùng Kỵ của đại vận: lao lực vất vả, gặt hái ít, giành giật, được mất khó lường.","Mặt tốt: bạn có xu hướng chịu khó giành phần mình. Mặt xấu: lao lực vất vả, gặt hái ít, giành giật, được mất khó lường.","hung"]],
"dv|trung|Khoa|Khoa":[["Trung Châu","Khoa năm sinh trùng Khoa đại vận: có quý nhân, danh tiếng nhưng dễ do dự, thiếu quyết đoán, ít được nâng đỡ thực chất; cần tự giải quyết.","Mặt tốt: bạn có xu hướng có người giúp, có danh tiếng trong giai đoạn này. Mặt xấu: dễ do dự, thiếu quyết đoán, sự nâng đỡ ít thực chất nên phải tự giải quyết.","trung"]],
"dv|trung|Kỵ|Kỵ":[["Trung Châu","Kỵ năm sinh gặp trùng Kỵ của đại vận (Song Kỵ): quy vị thì cát, gom được tiền; không quy vị thì hung, hao của; ứng nghiệm khi lưu niên đến.","Mặt tốt: nếu cái được quay về đúng chỗ, bạn có xu hướng gom được tiền. Mặt xấu: nếu không thì hao của, ứng vào những năm cụ thể.","trung"]],
"dv|mchat|Lộc":[["Trịnh Mục Đức","ĐV.X chồng lên cung có Lộc năm sinh (M chất Hóa Lộc): vận tốt cho chủ đề X.","Mặt tốt: bạn có xu hướng gặp vận tốt cho mảng này trong giai đoạn này. Mặt xấu: tốt có sẵn dễ khiến bạn ít chuẩn bị cho lúc hết thuận.","cat"]],
"dv|mchat|Quyền":[["Trịnh Mục Đức","ĐV.X chồng lên cung có Quyền năm sinh: vận tốt, chủ động cho chủ đề X.","Mặt tốt: bạn có xu hướng chủ động, vận tốt cho mảng này trong giai đoạn này. Mặt xấu: chủ động mạnh dễ thành áp đặt.","cat"]],
"dv|mchat|Khoa":[["Trịnh Mục Đức","ĐV.X chồng lên cung có Khoa năm sinh: vận tốt, có danh, quý nhân cho chủ đề X.","Mặt tốt: bạn có xu hướng có danh, có người giúp cho mảng này trong giai đoạn này. Mặt xấu: danh nhiều hơn lợi thực.","cat"]],
"dv|mchat|Kỵ":[["Trịnh Mục Đức","ĐV.X chồng lên cung có Kỵ năm sinh: cohoc vẫn chấm 'vận tốt' – sự gắn bó, chuyên tâm vào chủ đề X.","Mặt tốt: bạn có xu hướng gắn bó, chuyên tâm vào mảng này, vận được chấm tốt. Mặt xấu: chuyên tâm quá dễ thành ôm đồm, căng thẳng.","cat"]],
"dv|mchatTrung|2tang":[["Trịnh Mục Đức","Bản mệnh X có M chất và ĐV X có M chất (hoặc trùng ĐV Mệnh): thành công chủ đề X.","Mặt tốt: bạn có xu hướng thành công ở mảng này với khả năng cao. Mặt xấu: khả năng cao chưa phải chắc chắn, chủ quan vẫn có thể hỏng.","cat"]],
"dv|mchatTrung|3tang":[["Trịnh Mục Đức","Bản mệnh, ĐV và lưu niên X đều có M chất: thành công chủ đề X.","Mặt tốt: bạn có xu hướng thành công ở mảng này với khả năng rất cao. Mặt xấu: thuận nhiều tầng dễ sinh tự mãn.","cat"]],
"dv|phiPhuc|Lộc":[["Kinh nghiệm cao thủ Bắc phái","Cung X nguyên cục phi Lộc vào cung đại vận đang tới (hoặc đối cung, cung kề): Lộc tiên thiên của X hiện ra trong vận; ứng năm theo tam điểm.","Mặt tốt: bạn có xu hướng thấy cái lợi sẵn có của mảng này hiện ra trong giai đoạn này. Mặt xấu: cái lợi chỉ ứng vào một số năm, không đều suốt giai đoạn.","cat"]],
"dv|phiPhuc|Kỵ":[["Kinh nghiệm cao thủ Bắc phái","Cung X nguyên cục phi Kỵ vào cung đại vận đang tới: Kỵ tiên thiên của X hiện ra – món nợ, trách nhiệm của chủ đề X lộ diện trong vận; ứng theo tam điểm.","Mặt tốt: bạn có xu hướng có dịp trả xong món nợ, trách nhiệm của mảng này. Mặt xấu: món nợ, trách nhiệm ấy lộ ra trong giai đoạn này, phải gánh thật.","hung"]],
"dv|tongLuan|Mệnh|cat":[["Tính toán hệ thống","Chủ đề Mệnh trong ĐV tổng kết tốt (rất tốt / khá tốt / tốt nhiều, xấu không đáng lo).","Mặt tốt: bạn có xu hướng ở trong mười năm thuận cho chính mình, sức khỏe tinh thần và cơ hội đều khá. Mặt xấu: thuận lâu dễ chủ quan, đặt cược lớn rồi hụt khi giai đoạn đổi chiều.","cat"]],
"dv|tongLuan|Mệnh|binh":[["Tính toán hệ thống","Chủ đề Mệnh tốt xấu đan xen (mức không lớn hoặc biên độ lớn).","Mặt tốt: bạn có xu hướng có những đoạn thuận rõ trong mười năm này. Mặt xấu: xen giữa là những đoạn trầm, có lúc biên độ lớn, khiến kế hoạch dài hơi dễ đứt quãng.","trung"]],
"dv|tongLuan|Mệnh|hung":[["Tính toán hệ thống","Chủ đề Mệnh xấu hoặc mặt xấu đáng lo.","Mặt tốt: bạn có xu hướng hiểu rõ giới hạn của mình hơn sau mười năm này. Mặt xấu: đây là giai đoạn bất lợi cho bản thân, dễ mệt mỏi, dao động và vấp ở những việc quan trọng. Gợi ý: tránh mạo hiểm lớn.","hung"]],
"dv|tongLuan|Huynh Đệ|cat":[["Tính toán hệ thống","Chủ đề Huynh Đệ tổng kết tốt.","Mặt tốt: bạn có xu hướng được anh chị em, bạn thân hỗ trợ nhiều, làm việc chung thuận. Mặt xấu: dựa vào nhau nhiều thì dễ lẫn lộn tình với tiền.","cat"]],
"dv|tongLuan|Huynh Đệ|binh":[["Tính toán hệ thống","Chủ đề Huynh Đệ đan xen.","Mặt tốt: bạn có xu hướng có lúc gần gũi, giúp được nhau với anh em, bạn thân. Mặt xấu: cũng có lúc xa cách, hiểu lầm, nhất là khi dính tới tiền.","trung"]],
"dv|tongLuan|Huynh Đệ|hung":[["Tính toán hệ thống","Chủ đề Huynh Đệ xấu, đáng lo.","Mặt tốt: bạn có xu hướng nhìn rõ ai là người thật lòng qua giai đoạn này. Mặt xấu: bất đồng với anh em, bạn thân dễ nổ ra, góp vốn hay vay mượn chung dễ đổ vỡ.","hung"]],
"dv|tongLuan|Phu Thê|cat":[["Tính toán hệ thống","Chủ đề Phu Thê tổng kết tốt.","Mặt tốt: bạn có xu hướng có tình cảm, hôn nhân êm ấm trong giai đoạn này. Mặt xấu: êm lâu dễ thành nhàm, ít để ý tới nhu cầu của người kia.","cat"]],
"dv|tongLuan|Phu Thê|binh":[["Tính toán hệ thống","Chủ đề Phu Thê đan xen.","Mặt tốt: bạn có xu hướng có những đoạn tình cảm thuận hòa. Mặt xấu: xen kẽ là va chạm, giận dỗi, có lúc khá căng.","trung"]],
"dv|tongLuan|Phu Thê|hung":[["Tính toán hệ thống","Chủ đề Phu Thê xấu, đáng lo.","Mặt tốt: bạn có xu hướng thấy rõ điểm yếu của mối quan hệ để quyết định nghiêm túc. Mặt xấu: tình cảm, hôn nhân gặp thử thách thật, dễ lạnh nhạt, xa cách hoặc có người thứ ba.","hung"]],
"dv|tongLuan|Tử Tức|cat":[["Tính toán hệ thống","Chủ đề Tử Tức tổng kết tốt.","Mặt tốt: bạn có xu hướng có nhiều niềm vui từ con trẻ và các dự án chung. Mặt xấu: chi tiêu cho con và cho hợp tác dễ tăng mạnh.","cat"]],
"dv|tongLuan|Tử Tức|binh":[["Tính toán hệ thống","Chủ đề Tử Tức đan xen.","Mặt tốt: bạn có xu hướng có lúc thuận với con cái, hợp tác. Mặt xấu: có lúc vướng, con khó bảo hoặc đối tác trục trặc.","trung"]],
"dv|tongLuan|Tử Tức|hung":[["Tính toán hệ thống","Chủ đề Tử Tức xấu, đáng lo.","Mặt tốt: bạn có xu hướng sát sao hơn với con cái, việc hợp tác. Mặt xấu: chuyện con cái và các khoản hợp tác có dấu hiệu xấu, góp vốn dễ thiệt, con dễ có chuyện cần lo.","hung"]],
"dv|tongLuan|Tài Bạch|cat":[["Tính toán hệ thống","Chủ đề Tài Bạch tổng kết tốt.","Mặt tốt: bạn có xu hướng có tài chính khởi sắc trong giai đoạn này. Mặt xấu: tiền vào dễ thì tiêu cũng mạnh tay, không giữ thì cuối giai đoạn vẫn không dư bao nhiêu.","cat"]],
"dv|tongLuan|Tài Bạch|binh":[["Tính toán hệ thống","Chủ đề Tài Bạch đan xen.","Mặt tốt: bạn có xu hướng có những năm thu nhập tốt. Mặt xấu: thu nhập lên xuống thất thường, có năm hụt rõ.","trung"]],
"dv|tongLuan|Tài Bạch|hung":[["Tính toán hệ thống","Chủ đề Tài Bạch xấu, đáng lo.","Mặt tốt: bạn có xu hướng học được cách giữ tiền qua giai đoạn này. Mặt xấu: áp lực tiền bạc nặng, dễ hụt, dễ phải vay; đầu tư mạo hiểm dễ mất. Gợi ý: tránh vay nợ lớn.","hung"]],
"dv|tongLuan|Tật Ách|cat":[["Tính toán hệ thống","Chủ đề Tật Ách tổng kết tốt.","Mặt tốt: bạn có xu hướng có thể lực và tinh thần tốt trong giai đoạn này. Mặt xấu: khỏe nên dễ chủ quan, làm quá sức.","cat"]],
"dv|tongLuan|Tật Ách|binh":[["Tính toán hệ thống","Chủ đề Tật Ách đan xen.","Mặt tốt: bạn có xu hướng có những đoạn khỏe khoắn. Mặt xấu: xen kẽ là những lúc mệt, sức khỏe dễ chao khi áp lực tăng.","trung"]],
"dv|tongLuan|Tật Ách|hung":[["Tính toán hệ thống","Chủ đề Tật Ách xấu, đáng lo.","Mặt tốt: bạn có xu hướng để ý cơ thể hơn trong giai đoạn này. Mặt xấu: sức khỏe dễ đi xuống, dễ mệt, bệnh cũ dễ tái; dễ mắc bệnh tiêu hóa, huyết áp, xương khớp, suy nhược. Gợi ý: khám định kỳ và hỏi bác sĩ khi có dấu hiệu lạ.","hung"]],
"dv|tongLuan|Thiên Di|cat":[["Tính toán hệ thống","Chủ đề Thiên Di tổng kết tốt.","Mặt tốt: bạn có xu hướng gặp may khi đi xa và giao tiếp rộng. Mặt xấu: ham ra ngoài thì việc nhà và sức khỏe dễ bị bỏ bê.","cat"]],
"dv|tongLuan|Thiên Di|binh":[["Tính toán hệ thống","Chủ đề Thiên Di đan xen.","Mặt tốt: bạn có xu hướng có những chuyến đi, cuộc gặp thuận. Mặt xấu: cũng có lúc ra ngoài gặp trở ngại, mất công mất tiền.","trung"]],
"dv|tongLuan|Thiên Di|hung":[["Tính toán hệ thống","Chủ đề Thiên Di xấu, đáng lo.","Mặt tốt: bạn có xu hướng thấy rõ việc nào ở gần là chắc. Mặt xấu: đi xa hay làm việc với bên ngoài dễ trục trặc, có rủi ro khi di chuyển.","hung"]],
"dv|tongLuan|Nô Bộc|cat":[["Tính toán hệ thống","Chủ đề Nô Bộc tổng kết tốt.","Mặt tốt: bạn có xu hướng được bạn bè, đồng nghiệp giúp sức. Mặt xấu: dựa vào người khác nhiều thì dễ mắc nợ ân tình.","cat"]],
"dv|tongLuan|Nô Bộc|binh":[["Tính toán hệ thống","Chủ đề Nô Bộc đan xen.","Mặt tốt: bạn có xu hướng gặp được vài người bạn tốt. Mặt xấu: lẫn trong đó có người không đáng tin, dễ bị lợi dụng.","trung"]],
"dv|tongLuan|Nô Bộc|hung":[["Tính toán hệ thống","Chủ đề Nô Bộc xấu, đáng lo.","Mặt tốt: bạn có xu hướng nhận ra ai không nên tin qua giai đoạn này. Mặt xấu: phiền phức từ bạn bè, đồng nghiệp, dính tiền với người ngoài dễ thiệt.","hung"]],
"dv|tongLuan|Quan Lộc|cat":[["Tính toán hệ thống","Chủ đề Quan Lộc tổng kết tốt.","Mặt tốt: bạn có xu hướng có sự nghiệp thuận, có thể nhận trách nhiệm lớn hơn. Mặt xấu: lao vào việc dễ lơ gia đình và sức khỏe.","cat"]],
"dv|tongLuan|Quan Lộc|binh":[["Tính toán hệ thống","Chủ đề Quan Lộc đan xen.","Mặt tốt: bạn có xu hướng có những đoạn công việc thuận. Mặt xấu: cũng có lúc vướng, bị chặn hoặc phải đổi hướng.","trung"]],
"dv|tongLuan|Quan Lộc|hung":[["Tính toán hệ thống","Chủ đề Quan Lộc xấu, đáng lo.","Mặt tốt: bạn có xu hướng củng cố được chuyên môn khi việc chững. Mặt xấu: áp lực công việc nặng, dễ bị chèn ép hoặc mất vị trí, đổi việc vội dễ sai.","hung"]],
"dv|tongLuan|Điền Trạch|cat":[["Tính toán hệ thống","Chủ đề Điền Trạch tổng kết tốt.","Mặt tốt: bạn có xu hướng thuận nhà cửa, tài sản, tốt để an cư. Mặt xấu: dồn tiền cho nhà thì kém linh hoạt khi cần.","cat"]],
"dv|tongLuan|Điền Trạch|binh":[["Tính toán hệ thống","Chủ đề Điền Trạch đan xen.","Mặt tốt: bạn có xu hướng có lúc thuận chuyện nhà cửa. Mặt xấu: có lúc phải lo, mua bán lớn dễ sai.","trung"]],
"dv|tongLuan|Điền Trạch|hung":[["Tính toán hệ thống","Chủ đề Điền Trạch xấu, đáng lo.","Mặt tốt: bạn có xu hướng chặt chẽ hơn về giấy tờ nhà cửa. Mặt xấu: áp lực về nhà cửa, tài sản gia đình, dễ hao tổn hoặc tranh chấp; thế chấp, bảo lãnh dễ thiệt.","hung"]],
"dv|tongLuan|Phúc Đức|cat":[["Tính toán hệ thống","Chủ đề Phúc Đức tổng kết tốt.","Mặt tốt: bạn có xu hướng thấy lòng an vui và gặp người tốt. Mặt xấu: dễ ham vui, chi cho hưởng thụ nhiều.","cat"]],
"dv|tongLuan|Phúc Đức|binh":[["Tính toán hệ thống","Chủ đề Phúc Đức đan xen.","Mặt tốt: bạn có xu hướng có những lúc tâm trạng thoải mái. Mặt xấu: xen kẽ là những lúc lo âu, khó ngủ.","trung"]],
"dv|tongLuan|Phúc Đức|hung":[["Tính toán hệ thống","Chủ đề Phúc Đức xấu, đáng lo.","Mặt tốt: bạn có xu hướng hiểu sâu hơn về bản thân qua giai đoạn này. Mặt xấu: tinh thần nặng nề, hay lo nghĩ, ít niềm vui. Gợi ý: nói chuyện với người tin cậy hoặc chuyên gia tâm lý khi thấy quá tải.","hung"]],
"dv|tongLuan|Phụ Mẫu|cat":[["Tính toán hệ thống","Chủ đề Phụ Mẫu tổng kết tốt.","Mặt tốt: bạn có xu hướng được cha mẹ, cấp trên nâng đỡ, thuận học hành, giấy tờ. Mặt xấu: dựa vào người trên nhiều thì dễ mất chủ động.","cat"]],
"dv|tongLuan|Phụ Mẫu|binh":[["Tính toán hệ thống","Chủ đề Phụ Mẫu đan xen.","Mặt tốt: bạn có xu hướng có lúc hòa hợp với cha mẹ, cấp trên. Mặt xấu: có lúc vướng, va chạm, giấy tờ chậm.","trung"]],
"dv|tongLuan|Phụ Mẫu|hung":[["Tính toán hệ thống","Chủ đề Phụ Mẫu xấu, đáng lo.","Mặt tốt: bạn có xu hướng gần cha mẹ hơn qua giai đoạn này. Mặt xấu: cha mẹ dễ có chuyện cần lo, giấy tờ, thủ tục dễ trục trặc, quan hệ với cấp trên căng.","hung"]],
"nam|nhap|Lộc|*":[["Trung Châu","Lộc lưu niên nhập cung X của đại vận (ghi 'L. Hóa Lộc nhập cung Đv. X (L. Y)'): chủ đề X của vận và Y của năm được lợi; ứng tháng theo tam điểm.","Mặt tốt: bạn có xu hướng gặp thuận lợi ở mảng này trong năm. Mặt xấu: thuận lợi chỉ ứng vào vài tháng nhất định, không đều cả năm.","cat"]],
"nam|nhap|Kỵ|*":[["Trung Châu","Kỵ lưu niên nhập cung X của đại vận: chủ đề X bị áp lực; nếu xung Quan Lộc hoặc Tài Bạch thì 'nội lực yếu, tốt ít'; ứng tháng theo tam điểm.","Mặt tốt: bạn có xu hướng biết trước mảng nào cần giữ trong năm. Mặt xấu: mảng ấy chịu áp lực; nếu đè lên công việc hay tiền bạc thì nội lực yếu, tốt ít.","hung"]],
"ln|Dụng→Thể|chieu|Lộc|*":[["Từ Tăng Sinh","Lộc Dụng chiếu Thể (NV.X phi Lộc chiếu LN.X ở tháng; LN.X chiếu ĐV.X ở năm), dấu ****: cát lợi rất mạnh.","Mặt tốt: bạn có xu hướng gặp thuận lợi rất rõ ở mảng này trong thời gian này. Mặt xấu: thuận mạnh dễ khiến bạn ôm thêm việc quá sức.","cat"]],
"ln|Dụng→Thể|chieu|Quyền|*":[["Từ Tăng Sinh","Quyền Dụng chiếu Thể (****): cát tượng, cần nghiệm.","Mặt tốt: bạn có xu hướng có thêm sự chủ động ở mảng này. Mặt xấu: tín hiệu chưa chắc, chủ động quá dễ thành áp đặt.","cat"]],
"ln|Dụng→Thể|chieu|Khoa|*":[["Từ Tăng Sinh","Khoa Dụng chiếu Thể (****): cát tượng, cần nghiệm.","Mặt tốt: bạn có xu hướng được người giúp ở mảng này. Mặt xấu: tín hiệu chưa chắc, sự giúp đỡ có thể nhỏ hơn mong đợi.","cat"]],
"ln|Dụng→Thể|xung|Kỵ|*":[["Trịnh Mục Đức","Kỵ Dụng xung Thể (****): mức cảnh báo đỏ, rất xấu.","Mặt tốt: bạn có xu hướng biết trước mảng nào cần phòng nhất. Mặt xấu: mảng này có dấu hiệu rất xấu, khả năng gặp chuyện cao. Gợi ý: hoãn quyết định lớn nếu được.","hung"]],
"ln|Dụng→Thể|nhap|Lộc|*":[["Ông Phúc Dụ","Quy vị Lộc (NV.X nhập LN.X, dấu ***): cát.","Mặt tốt: bạn có xu hướng thấy mảng này thuận lợi trở lại. Mặt xấu: thuận lại dễ khiến bạn quên bài học lúc khó.","cat"]],
"ln|Dụng→Thể|nhap|Quyền|*":[["Ông Phúc Dụ","Quy vị Quyền (***): cát.","Mặt tốt: bạn có xu hướng làm chủ tốt mảng này. Mặt xấu: tự tin quá dễ lấn người khác.","cat"]],
"ln|Dụng→Thể|nhap|Khoa|*":[["Ông Phúc Dụ","Quy vị Khoa (***): cát.","Mặt tốt: bạn có xu hướng ổn định và có tiếng tốt ở mảng này. Mặt xấu: ổn định thì ít đột phá.","cat"]],
"ln|Dụng→Thể|nhap|Kỵ|*":[["Trịnh Mục Đức","Quy vị Kỵ (***): báo động vàng.","Mặt tốt: bạn có xu hướng có dịp xử lý dứt điểm việc tồn đọng ở mảng này. Mặt xấu: mảng này có dấu hiệu xấu ở mức vừa, việc tồn đọng đè nặng.","hung"]],
"ln|Thể→Dụng|chieu|Lộc|*":[["Từ Tăng Sinh","Lộc Thể chiếu Dụng (LN.X chiếu NV.X, dấu **): cát tượng, cần nghiệm.","Mặt tốt: bạn có xu hướng được nền tảng sẵn có hỗ trợ ở mảng này. Mặt xấu: tín hiệu chưa chắc, cần nghiệm bằng việc thật.","cat"]],
"ln|Thể→Dụng|chieu|Quyền|*":[["Từ Tăng Sinh","Quyền Thể chiếu Dụng (**): cát tượng.","Mặt tốt: bạn có xu hướng có thêm hậu thuẫn ở mảng này. Mặt xấu: hậu thuẫn yếu, không đủ để dựa hẳn.","cat"]],
"ln|Thể→Dụng|chieu|Khoa|*":[["Từ Tăng Sinh","Khoa Thể chiếu Dụng (**): cát tượng.","Mặt tốt: bạn có xu hướng có người nâng đỡ ở mảng này. Mặt xấu: sự nâng đỡ phần nhiều là tinh thần.","cat"]],
"ln|Thể→Dụng|xung|Kỵ|*":[["Trịnh Mục Đức","Kỵ Thể xung Dụng (**): báo động vàng.","Mặt tốt: bạn có xu hướng thấy trước trở ngại ở mảng này. Mặt xấu: mảng này có dấu hiệu xấu ở mức vừa, dễ vấp.","hung"]],
"ln|Thể→Dụng|nhap|Lộc|*":[["Ông Phúc Dụ","Lộc Thể nhập Dụng (LN.X nhập NV.X, dấu *): cát tượng, cần nghiệm.","Mặt tốt: bạn có xu hướng gặp thuận lợi nhẹ ở mảng này. Mặt xấu: lợi nhỏ, chưa chắc chắn.","cat"]],
"ln|Thể→Dụng|nhap|Quyền|*":[["Ông Phúc Dụ","Quyền Thể nhập Dụng (*): cát tượng.","Mặt tốt: bạn có xu hướng chủ động hơn ở mảng này. Mặt xấu: tác động yếu, khó tạo thay đổi lớn.","cat"]],
"ln|Thể→Dụng|nhap|Khoa|*":[["Ông Phúc Dụ","Khoa Thể nhập Dụng (*): cát tượng.","Mặt tốt: bạn có xu hướng thấy mảng này ổn định, nhẹ nhàng. Mặt xấu: ít chuyển biến, dễ trì trệ.","cat"]],
"ln|Thể→Dụng|nhap|Kỵ|*":[["Trịnh Mục Đức","Kỵ Thể nhập Dụng (*): báo động vàng.","Mặt tốt: bạn có xu hướng sớm nhận ra mảng này đang nặng. Mặt xấu: mảng này có dấu hiệu xấu ở mức vừa, nặng nề và tốn sức.","hung"]],
"ln|Dụng→Thể|xung|Kỵ|Mệnh":[["Trịnh Mục Đức","NV Mệnh phi Kỵ xung LN Mệnh (****): báo động đỏ cho bản thân trong tháng.","Mặt tốt: bạn có xu hướng biết trước tháng này cần giữ mình. Mặt xấu: áp lực đè lên bản thân rất rõ, dễ mệt, dao động và quyết sai. Gợi ý: tránh quyết định lớn.","hung"]],
"ln|Dụng→Thể|xung|Kỵ|Tử Tức":[["Trịnh Mục Đức","NV Tử Tức phi Kỵ xung LN Tử Tức: báo động đỏ cho con cái, hợp tác.","Mặt tốt: bạn có xu hướng sát sao với con trẻ và việc hợp tác trong tháng. Mặt xấu: con cái hoặc hợp tác có dấu hiệu rất xấu, góp vốn dễ thiệt.","hung"]],
"ln|Dụng→Thể|chieu|Lộc|Phúc Đức":[["Từ Tăng Sinh","NV Phúc Đức phi Lộc chiếu LN Phúc Đức (****): tinh thần, quý nhân, tiền bạc (chiếu Tài) cát lợi rất mạnh.","Mặt tốt: bạn có xu hướng có tâm trạng vui, gặp người tốt và may về tiền trong tháng. Mặt xấu: dễ ham vui, tiêu mạnh tay.","cat"]],
"ln|Dụng→Thể|chieu|Lộc|Quan Lộc":[["Từ Tăng Sinh","NV Quan Lộc phi Lộc chiếu LN Quan Lộc (****): sự nghiệp cát lợi rất mạnh.","Mặt tốt: bạn có xu hướng có tiến triển rất tốt trong công việc tháng này. Mặt xấu: dồn sức cho việc thì lơ gia đình.","cat"]],
"ln|Dụng→Thể|chieu|Lộc|Mệnh":[["Từ Tăng Sinh","NV Mệnh phi Lộc chiếu LN Mệnh: cát lợi rất mạnh cho bản thân.","Mặt tốt: bạn có xu hướng có một tháng rất thuận cho chính mình. Mặt xấu: thuận quá dễ chủ quan, hứa hẹn quá sức.","cat"]],
"ln|Dụng→Thể|chieu|Lộc|Phụ Mẫu":[["Từ Tăng Sinh","NV Phụ Mẫu phi Lộc chiếu LN Phụ Mẫu: cha mẹ, cấp trên, giấy tờ cát lợi rất mạnh.","Mặt tốt: bạn có xu hướng được người trên giúp, thuận giấy tờ, thi cử trong tháng. Mặt xấu: dựa vào người trên nhiều thì dễ bị động.","cat"]],
"thang|xuat|Lộc":[["","Lộc tháng xuất (vào tha cung): là hư lộc, làm ra mà rỗng; cộng hưởng sẽ mạnh khi Dương phi nhập Âm. Lộc vào trục Huynh–Nô: thành tựu, chi tiêu, trợ lực, biến động liên quan bạn bè, đồng nghiệp, cấp dưới, mẹ, cha mẹ vợ/chồng.","Mặt tốt: bạn có xu hướng có hoạt động, có thu trong tháng, nhất là qua các mối quan hệ. Mặt xấu: làm ra mà rỗng, chi tiêu nhiều cho bạn bè, đồng nghiệp, người thân.","trung"]],
"thang|xuat|Kỵ":[["","Kỵ tháng không nhập, không xung tam hợp Mệnh: chỉ 'một phen hú vía', cộng hưởng yếu. Kỵ nhập tuyến Tử–Điền: biến động con cái, nhà đất, gia sản; Thuận thủy Kỵ xung Tật Ách: tổn sức khỏe; Kỵ nhập Phụ–Tật: việc nhà bị ảnh hưởng từ phía cha mẹ.","Mặt tốt: bạn có xu hướng thấy chuyện lo trong tháng thường không nặng như tưởng. Mặt xấu: vẫn có một phen hú vía, có thể dính tới con cái, nhà đất, sức khỏe hoặc chuyện cha mẹ.","trung"]],
"thang|xuat|Quyền":[["","Quyền/Khoa tháng xuất, Dương phi nhập Dương: rỗng, cộng hưởng yếu.","Mặt tốt: bạn có xu hướng thấy tháng này trôi khá nhẹ ở mảng này. Mặt xấu: tác động yếu, công sức bỏ ra ít thành quả.","trung"]],
"thang|tangTac|KhoaKy":[["","Khoa lưu niên gặp trùng Kỵ nguyệt vận: việc kéo dài, khó xong nhanh. Khoa gặp trùng Khoa: có quý nhân nhưng dễ biến thành Khoa xuất. Mệnh nguyên cục chịu tác động mạnh khi Kỵ ĐV, LN, NV cùng dồn vào.","Mặt tốt: bạn có xu hướng có người giúp trong tháng. Mặt xấu: việc kéo dài, khó xong nhanh, sự giúp đỡ dễ thành hình thức.","trung"]],
"thang|tangTac|PhiLocKyXungNga":[["","Phi Kỵ và phi Lộc cùng từ tha cung xung ngã cung: hung, thiệt hại lớn; coi chừng khi xung vào Quan Lộc hoặc Tài Bạch.","Mặt tốt: bạn có xu hướng thấy rõ mình đang bị kéo từ nhiều phía. Mặt xấu: áp lực dồn từ nhiều phía, thiệt hại có thể lớn, nhất là ở công việc và tiền bạc.","hung"]],
"thang|tangTac|LocKyNgaGiup":[["","Lộc và Kỵ tháng cùng nhập ngã cung lưu niên: có ích cho tuyến cung, đời sống có thể phát triển.","Mặt tốt: bạn có xu hướng thấy mọi việc tập trung về mình và có tiến triển. Mặt xấu: dồn nhiều việc về mình thì dễ quá tải.","cat"]],
"ungKy|tamDiem":[["Kinh nghiệm cao thủ Bắc phái","Năm/tháng/ngày ứng của một Hóa = chi cung nhận, chi đối cung và chi liền trước (ví dụ vào Mão → Mão, Dậu, Dần). Quy vị: thêm năm chi ĐV Mệnh và chi Mệnh gốc.","Mặt tốt: bạn có xu hướng biết được sự việc thường ứng vào những thời điểm nhất định. Mặt xấu: thời điểm chỉ là ước tính, không chắc chắn.","trung"]],
"ungKy|taiThienDiaNhan":[["","Tài thiên / Tài địa / Tài nhân: Lộc hoặc Kỵ tháng trùng điệp với Lộc/Kỵ tầng khác – dấu hiệu sự việc ứng ngay trong tháng (chưa xác định rõ tầng nào ứng tên nào).","Mặt tốt: bạn có xu hướng thấy một việc đã chờ lâu có kết quả trong tháng này. Mặt xấu: kết quả có thể tốt mà cũng có thể xấu, đến nhanh nên khó trở tay.","trung"]],
"thang|ketLuan|Mệnh|cat":[["Tính toán hệ thống","Kết luận tháng: chủ đề Mệnh tốt.","Mặt tốt: bạn có xu hướng có một tháng thuận cho chính mình. Mặt xấu: thuận dễ chủ quan, ôm thêm việc.","cat"]],
"thang|ketLuan|Mệnh|binh":[["Tính toán hệ thống","Kết luận tháng: chủ đề Mệnh đan xen.","Mặt tốt: bạn có xu hướng có những ngày thuận trong tháng. Mặt xấu: xen kẽ là những ngày mệt, dễ chao.","trung"]],
"thang|ketLuan|Mệnh|hung":[["Tính toán hệ thống","Kết luận tháng: chủ đề Mệnh xấu hoặc mặt xấu đáng lo.","Mặt tốt: bạn có xu hướng biết tháng này cần giữ mình. Mặt xấu: áp lực lên bản thân rõ, dễ mệt và quyết vội sai.","hung"]],
"thang|ketLuan|Huynh Đệ|cat":[["Tính toán hệ thống","Chủ đề Huynh Đệ tốt.","Mặt tốt: bạn có xu hướng được anh em, bạn thân hỗ trợ trong tháng. Mặt xấu: dễ dính tiền bạc qua lại với nhau.","cat"]],
"thang|ketLuan|Huynh Đệ|binh":[["Tính toán hệ thống","Chủ đề Huynh Đệ đan xen.","Mặt tốt: bạn có xu hướng có lúc gần gũi anh em, bạn thân. Mặt xấu: có lúc vướng, lời qua tiếng lại.","trung"]],
"thang|ketLuan|Huynh Đệ|hung":[["Tính toán hệ thống","Chủ đề Huynh Đệ xấu.","Mặt tốt: bạn có xu hướng thấy rõ bất đồng để xử lý. Mặt xấu: va chạm với anh em, bạn thân trong tháng, vay mượn dễ sinh chuyện.","hung"]],
"thang|ketLuan|Phu Thê|cat":[["Tính toán hệ thống","Chủ đề Phu Thê tốt.","Mặt tốt: bạn có xu hướng có tình cảm êm ấm trong tháng. Mặt xấu: êm thì dễ lơ là, ít để ý người kia.","cat"]],
"thang|ketLuan|Phu Thê|binh":[["Tính toán hệ thống","Chủ đề Phu Thê đan xen.","Mặt tốt: bạn có xu hướng có những lúc tình cảm thuận. Mặt xấu: xen kẽ dỗi hờn, hiểu lầm.","trung"]],
"thang|ketLuan|Phu Thê|hung":[["Tính toán hệ thống","Chủ đề Phu Thê xấu.","Mặt tốt: bạn có xu hướng thấy rõ điều cần nói với người kia. Mặt xấu: tình cảm căng thẳng trong tháng, dễ cãi vã.","hung"]],
"thang|ketLuan|Tử Tức|cat":[["Tính toán hệ thống","Chủ đề Tử Tức tốt.","Mặt tốt: bạn có xu hướng có niềm vui từ con trẻ và việc hợp tác. Mặt xấu: chi tiêu cho con, cho vui chơi dễ tăng.","cat"]],
"thang|ketLuan|Tử Tức|binh":[["Tính toán hệ thống","Chủ đề Tử Tức đan xen.","Mặt tốt: bạn có xu hướng có lúc thuận với con cái, hợp tác. Mặt xấu: có lúc cần để ý, việc chung dễ vướng.","trung"]],
"thang|ketLuan|Tử Tức|hung":[["Tính toán hệ thống","Chủ đề Tử Tức xấu.","Mặt tốt: bạn có xu hướng sát sao với con trẻ và khoản hợp tác. Mặt xấu: chuyện con cái, hợp tác có dấu hiệu xấu, góp vốn dễ thiệt.","hung"]],
"thang|ketLuan|Tài Bạch|cat":[["Tính toán hệ thống","Chủ đề Tài Bạch tốt.","Mặt tốt: bạn có xu hướng có thu nhập thuận trong tháng. Mặt xấu: có tiền dễ chi mạnh tay.","cat"]],
"thang|ketLuan|Tài Bạch|binh":[["Tính toán hệ thống","Chủ đề Tài Bạch đan xen.","Mặt tốt: bạn có xu hướng có lúc tiền vào tốt. Mặt xấu: tiền vào ra thất thường, dễ hụt.","trung"]],
"thang|ketLuan|Tài Bạch|hung":[["Tính toán hệ thống","Chủ đề Tài Bạch xấu.","Mặt tốt: bạn có xu hướng giữ tiền chặt hơn trong tháng. Mặt xấu: áp lực tiền bạc, cho vay hay chi lớn dễ thiệt.","hung"]],
"thang|ketLuan|Tật Ách|cat":[["Tính toán hệ thống","Chủ đề Tật Ách tốt.","Mặt tốt: bạn có xu hướng khỏe khoắn trong tháng. Mặt xấu: khỏe thì dễ làm quá sức.","cat"]],
"thang|ketLuan|Tật Ách|binh":[["Tính toán hệ thống","Chủ đề Tật Ách đan xen.","Mặt tốt: bạn có xu hướng có những ngày khỏe. Mặt xấu: xen kẽ là những lúc mệt.","trung"]],
"thang|ketLuan|Tật Ách|hung":[["Tính toán hệ thống","Chủ đề Tật Ách xấu.","Mặt tốt: bạn có xu hướng để ý sức khỏe hơn trong tháng. Mặt xấu: dễ mệt mỏi, đi lại dễ có rủi ro.","hung"]],
"thang|ketLuan|Thiên Di|cat":[["Tính toán hệ thống","Chủ đề Thiên Di tốt.","Mặt tốt: bạn có xu hướng gặp may khi ra ngoài trong tháng. Mặt xấu: đi nhiều thì tốn kém và mệt.","cat"]],
"thang|ketLuan|Thiên Di|binh":[["Tính toán hệ thống","Chủ đề Thiên Di đan xen.","Mặt tốt: bạn có xu hướng có cuộc gặp, chuyến đi thuận. Mặt xấu: cũng có lúc ra ngoài gặp trở ngại.","trung"]],
"thang|ketLuan|Thiên Di|hung":[["Tính toán hệ thống","Chủ đề Thiên Di xấu.","Mặt tốt: bạn có xu hướng thấy rõ việc gì nên hoãn. Mặt xấu: đi xa dễ trục trặc trong tháng, chuyến đi không cần thiết dễ sinh chuyện.","hung"]],
"thang|ketLuan|Nô Bộc|cat":[["Tính toán hệ thống","Chủ đề Nô Bộc tốt.","Mặt tốt: bạn có xu hướng được bạn bè, đồng nghiệp giúp trong tháng. Mặt xấu: nhờ nhiều thì dễ mắc nợ ân tình.","cat"]],
"thang|ketLuan|Nô Bộc|binh":[["Tính toán hệ thống","Chủ đề Nô Bộc đan xen.","Mặt tốt: bạn có xu hướng gặp người giúp. Mặt xấu: lẫn trong đó có người gây phiền.","trung"]],
"thang|ketLuan|Nô Bộc|hung":[["Tính toán hệ thống","Chủ đề Nô Bộc xấu.","Mặt tốt: bạn có xu hướng nhận ra ai không đáng tin. Mặt xấu: rắc rối từ người ngoài trong tháng, dính tiền bạc dễ thiệt.","hung"]],
"thang|ketLuan|Quan Lộc|cat":[["Tính toán hệ thống","Chủ đề Quan Lộc tốt.","Mặt tốt: bạn có xu hướng có tiến triển trong công việc tháng này. Mặt xấu: bận nhiều dễ lơ việc nhà.","cat"]],
"thang|ketLuan|Quan Lộc|binh":[["Tính toán hệ thống","Chủ đề Quan Lộc đan xen.","Mặt tốt: bạn có xu hướng có lúc công việc thuận. Mặt xấu: có lúc vướng, chậm.","trung"]],
"thang|ketLuan|Quan Lộc|hung":[["Tính toán hệ thống","Chủ đề Quan Lộc xấu.","Mặt tốt: bạn có xu hướng làm chắc được việc chính. Mặt xấu: áp lực công việc trong tháng, dễ tranh cãi, bị chèn ép.","hung"]],
"thang|ketLuan|Điền Trạch|cat":[["Tính toán hệ thống","Chủ đề Điền Trạch tốt.","Mặt tốt: bạn có xu hướng thuận nhà cửa trong tháng. Mặt xấu: dễ chi nhiều cho sửa sang.","cat"]],
"thang|ketLuan|Điền Trạch|binh":[["Tính toán hệ thống","Chủ đề Điền Trạch đan xen.","Mặt tốt: bạn có xu hướng xử lý được việc nhà nhỏ. Mặt xấu: việc nhà lặt vặt tốn sức, tốn tiền.","trung"]],
"thang|ketLuan|Điền Trạch|hung":[["Tính toán hệ thống","Chủ đề Điền Trạch xấu.","Mặt tốt: bạn có xu hướng thận trọng hơn về nhà cửa. Mặt xấu: áp lực về nhà cửa, tài sản trong tháng, mua bán lớn dễ sai.","hung"]],
"thang|ketLuan|Phúc Đức|cat":[["Tính toán hệ thống","Chủ đề Phúc Đức tốt.","Mặt tốt: bạn có xu hướng thấy lòng an vui trong tháng. Mặt xấu: dễ ham vui, lơ việc.","cat"]],
"thang|ketLuan|Phúc Đức|binh":[["Tính toán hệ thống","Chủ đề Phúc Đức đan xen.","Mặt tốt: bạn có xu hướng có những lúc tâm trạng tốt. Mặt xấu: tâm trạng lên xuống, có lúc buồn bực vô cớ.","trung"]],
"thang|ketLuan|Phúc Đức|hung":[["Tính toán hệ thống","Chủ đề Phúc Đức xấu.","Mặt tốt: bạn có xu hướng nhìn lại mình nhiều hơn trong tháng. Mặt xấu: lo nghĩ nhiều, khó ngủ, tinh thần nặng.","hung"]],
"thang|ketLuan|Phụ Mẫu|cat":[["Tính toán hệ thống","Chủ đề Phụ Mẫu tốt.","Mặt tốt: bạn có xu hướng được người trên giúp trong tháng, thuận giấy tờ, học hành. Mặt xấu: dựa vào người trên thì dễ bị động.","cat"]],
"thang|ketLuan|Phụ Mẫu|binh":[["Tính toán hệ thống","Chủ đề Phụ Mẫu đan xen.","Mặt tốt: bạn có xu hướng có lúc hòa với người trên. Mặt xấu: có lúc vướng, giấy tờ chậm.","trung"]],
"thang|ketLuan|Phụ Mẫu|hung":[["Tính toán hệ thống","Chủ đề Phụ Mẫu xấu.","Mặt tốt: bạn có xu hướng gần cha mẹ hơn trong tháng. Mặt xấu: cha mẹ dễ có chuyện cần lo, giấy tờ dễ sai sót. Gợi ý: kiểm tra kỹ trước khi ký.","hung"]],
"than|Phu Thê":[["Tử Vi truyền thống","Thân cư Phu Thê: hậu vận chịu ảnh hưởng mạnh từ hôn nhân và người phối ngẫu; cát hung của nửa đời sau gắn với chất lượng cung Phu Thê và các Hóa nhập vào đó.","Mặt tốt: bạn có xu hướng được người bạn đời và đời sống lứa đôi định hướng tốt nửa sau cuộc đời. Mặt xấu: hôn nhân trục trặc thì nửa đời sau bị kéo xuống rõ, khó tự đứng vững riêng.","trung"]],
"than|Tài Bạch":[["Tử Vi truyền thống","Thân cư Tài Bạch: người trọng thực tế, lấy tiền bạc làm thước đo an toàn; nửa đời sau gắn chặt với việc tạo dựng và giữ của, nên tốt xấu của cung Tài Bạch phản ánh rõ lên hậu vận.","Mặt tốt: bạn thuộc mẫu người thực tế, coi trọng làm ra của cải, càng về sau càng gắn đời mình với tiền bạc. Mặt xấu: dễ lấy tiền làm thước đo mọi thứ, tài chính lung lay là hậu vận lung lay theo.","trung"]],
"than|Quan Lộc":[["Tử Vi truyền thống","Thân cư Quan Lộc: nặng chí sự nghiệp, lấy công danh làm thước đo giá trị bản thân; hậu vận thịnh suy theo đường công việc, cần xét kỹ các Hóa nhập Quan Lộc và trục Phu–Quan.","Mặt tốt: bạn thuộc mẫu người nặng chí sự nghiệp, càng về sau càng gắn đời mình với công danh. Mặt xấu: lấy công việc làm thước đo giá trị bản thân nên khi việc chững, tinh thần và hôn nhân dễ chao theo.","trung"]],
"cungKhi|*|cat":[["Sở Hoàng","Cung khí tiểu cát: nạp âm của can chi cung thuộc hành hỉ thần nhưng lực chưa mạnh, hoặc thuộc hành nhàn nghiêng về phía tốt; chủ đề cung này thuận ở mức vừa phải, có Hóa cát nhập thì dễ phát huy.","Mặt tốt: bạn có xu hướng thuận ở mảng này ở mức vừa phải. Mặt xấu: lực chưa mạnh, gặp hoàn cảnh xấu thì cái thuận dễ mất.","cat"]],
"cungKhi|*|hung":[["Sở Hoàng","Cung khí hung nhiều hơn cát: nạp âm của can chi cung nghiêng về hành kỵ thần nhưng chưa đến mức đại hung; chủ đề cung này hay gặp trở ngại nhỏ, nếu thêm Hóa Kỵ nhập thì cần thận trọng hơn.","Mặt tốt: bạn có xu hướng vẫn làm được việc ở mảng này nếu thận trọng. Mặt xấu: mảng này hay gặp trở ngại nhỏ, thêm áp lực thì dễ thành chuyện lớn hơn.","hung"]]};

/* ---------------------------------------------------------------- Bộ tính ---------------------------------------------------------------- */
var PT_CUNG = ['Mệnh', 'Huynh Đệ', 'Phu Thê', 'Tử Tức', 'Tài Bạch', 'Tật Ách', 'Thiên Di', 'Nô Bộc', 'Quan Lộc', 'Điền Trạch', 'Phúc Đức', 'Phụ Mẫu'];
var PT_NGA = { 'Mệnh': 1, 'Tài Bạch': 1, 'Tật Ách': 1, 'Quan Lộc': 1, 'Điền Trạch': 1, 'Phúc Đức': 1 };          // ngã cung (lục nội)
var PT_LUC_THAN = { 'Mệnh': 1, 'Huynh Đệ': 1, 'Phu Thê': 1, 'Tử Tức': 1, 'Nô Bộc': 1, 'Phụ Mẫu': 1 };
var PT_THU_TU = ['Mệnh', 'Quan Lộc', 'Tài Bạch', 'Thiên Di', 'Phúc Đức', 'Phu Thê', 'Tử Tức', 'Điền Trạch', 'Tật Ách', 'Phụ Mẫu', 'Huynh Đệ', 'Nô Bộc'];   // thứ tự luận của bài Bắc phái
var PT_H = ['Lộc', 'Quyền', 'Khoa', 'Kỵ'];
function ptD_(i) { return (i + 6) % 12; }
function ptLv_(cung) { return typeof tpLv_ === 'function' ? tpLv_(cung) : cung.toLowerCase(); }
function ptThay_(s, o) {
  var t = String(s || '').replace(/\{(\w+)\}/g, function (m, k) { return o[k] != null ? o[k] : m; });
  // Cung Mệnh thay vào khuôn thành "chính mình": nắn lại vài chỗ đọc vấp ("phần chính mình của mình", "góp ý … ở chính mình")
  return t.replace(/phần chính mình của mình/g, 'phần của chính mình').replace(/ ở chính mình(?=[,.;])/g, ' trong chuyện của bản thân')
    .replace(/thuộc chính mình/g, 'thuộc về bản thân').replace(/dồn cái tốt sang chính mình/g, 'dồn cái tốt vào việc riêng của bản thân');
}
/** Cung chức thứ k (0 = Mệnh) tính từ cung gốc g – đi nghịch địa chi */
function ptCungTu_(g, k) { return ((g - k) % 12 + 12) % 12; }
/** Tên cung chức của ô x khi coi ô g là Mệnh (chuyển cung / lập thái cực) */
function ptTenTu_(g, x) { return PT_CUNG[((g - x) % 12 + 12) % 12]; }

/** Tứ Hóa của một can: [{h, sao, toi}] – toi là ô địa chi chứa sao (null nếu sao không có trên lá số) */
function ptHoa_(tv, can) { return PT_TU_HOA[can].map(function (s, h) { var p = tv.pos[s]; return { h: h, sao: s, toi: p == null ? null : p }; }); }

/** Dựng toàn bộ dữ liệu Phi Tinh của nguyên cục */
function ptNguyenCuc_(tv) {
  var P = tv.palaces, I = tv.info, ten = P.map(function (p) { return p.cung; }), o = {};
  ten.forEach(function (c, i) { o[c] = i; });
  var phi = P.map(function (p) { return ptHoa_(tv, p.can); }), sn = ptHoa_(tv, I.yCan);
  var ln = -1; for (var i = 2; i < 12; i++) if (P[i].can === I.yCan) { ln = i; break; }   // Lai Nhân: bỏ Tý, Sửu
  var tuHoa = [];
  phi.forEach(function (ds, i) { ds.forEach(function (f) { if (f.toi === i) tuHoa.push({ o: i, h: f.h, sao: f.sao, loai: 'lyTam' }); else if (f.toi === ptD_(i)) tuHoa.push({ o: i, h: f.h, sao: f.sao, loai: 'huongTam' }); }); });
  function coLyTam(i) { return tuHoa.some(function (t) { return t.o === i && t.loai === 'lyTam'; }); }
  /** Kỵ chuyển Kỵ từ ô đầu: dừng khi lặp, khi tự hóa Kỵ (Kỵ xuất) hoặc sau 6 bước */
  function chuyenKy(dau) {
    var ds = [dau], cur = dau, kx = false;
    for (var n = 0; n < 6; n++) {
      var t = phi[cur][3].toi; if (t == null) break;
      if (t === cur) { kx = true; break; }
      if (ds.indexOf(t) >= 0) { ds.push(t); break; }
      ds.push(t); cur = t;
    }
    return { o: ds, kyXuat: kx };
  }
  return { P: P, I: I, ten: ten, o: o, phi: phi, sn: sn, ln: ln, tuHoa: tuHoa, coLyTam: coLyTam, chuyenKy: chuyenKy,
    tamHop: [o['Mệnh'], o['Tài Bạch'], o['Quan Lộc']] };
}

/** Các mẫu Kỵ có tên ở nguyên cục */
function ptMau_(N) {
  var ra = [], ten = N.ten, phi = N.phi, snKy = N.sn[3].toi, snLoc = N.sn[0].toi;
  function them(k, A, B, them2) { var x = { k: k, A: A != null ? ten[A] : null, B: B != null ? ten[B] : null }; if (them2) x.ky = them2; ra.push(x); }
  for (var i = 0; i < 12; i++) {
    var ky = phi[i][3].toi; if (ky == null) continue;
    if (ky === ptD_(i)) {
      them('luuXuat', i, ky);
      if (N.tamHop.indexOf(i) >= 0 && snKy === ky) them(N.coLyTam(ky) ? 'thuyTiet' : 'nghichThuy', i, ky);
    }
    for (var j = i + 1; j < 12; j++) if (ky === j && phi[j][3].toi === i && PT_LUC_THAN[ten[i]] && PT_LUC_THAN[ten[j]]) them('tuanHoan', i, j);
    for (var j2 = 0; j2 < 12; j2++) if (j2 !== i && j2 !== ptD_(i) && phi[i][0].toi === j2 && phi[j2][3].toi === i) them('thiPhi', i, j2);
  }
  if (snKy != null && [1, 4, 7, 10].indexOf(snKy) >= 0) them(N.coLyTam(snKy) ? 'tietKho' : 'nhapKho', snKy, null);
  if (snKy != null && [2, 5, 8, 11].indexOf(snKy) >= 0) them('sachMa', snKy, null);
  // Củ triền Kỵ: hai Kỵ từ hai cung khác nhau rơi vào hai đầu một trục có Mệnh/Tài/Quan/Điền
  var daXet = {};
  for (var a = 0; a < 12; a++) for (var b = 0; b < 12; b++) {
    var ka = phi[a][3].toi, kb = phi[b][3].toi;
    if (a === b || ka == null || kb == null || ka === a || kb === b || kb !== ptD_(ka)) continue;
    var truc = Math.min(ka, kb) + '-' + Math.max(ka, kb); if (daXet[truc]) continue;
    var cT = [ten[ka], ten[kb]];
    if (!['Mệnh', 'Tài Bạch', 'Quan Lộc', 'Điền Trạch'].some(function (c) { return cT.indexOf(c) >= 0; })) continue;
    daXet[truc] = 1;
    them(cT.indexOf('Phu Thê') >= 0 && cT.indexOf('Quan Lộc') >= 0 ? 'oanThan' : 'cuTrien', ka, kb, ten[a] + ' phi Kỵ nhập ' + ten[ka] + ', ' + ten[b] + ' phi Kỵ nhập ' + ten[kb]);
  }
  // Lộc theo Kỵ đi: Lộc năm sinh rơi vào B, B phi Kỵ sang C
  if (snLoc != null && phi[snLoc][3].toi != null && phi[snLoc][3].toi !== snLoc) {
    var C = phi[snLoc][3].toi, ngaB = !!PT_NGA[ten[snLoc]], ngaC = !!PT_NGA[ten[C]];
    if (ngaB && !ngaC) them('locVaoNgaKyRaTha', snLoc, C); else if (!ngaB && ngaC) them('locVaoThaKyVeNga', snLoc, C);
  }
  // Song Kỵ nguyên cục: Kỵ năm sinh và Mệnh phi Kỵ cùng trục
  var mk = phi[N.o['Mệnh']][3].toi;
  if (snKy != null && mk != null && (mk === snKy || mk === ptD_(snKy))) them('songKy', snKy, mk);
  return ra;
}

/** Luận một cung: hóa năm sinh tại cung, tự hóa, bốn phi hóa (kèm tên chuyển cung), cung khác phi vào, chuỗi chuyển Kỵ */
function ptCung_(N, i) {
  var ten = N.ten, X = ten[i], ky = [], de = [], van = PT_VAN || {};
  N.sn.forEach(function (f) {
    if (f.toi !== i) return;
    var v = ((van.snToa || {})[PT_H[f.h]] || {})[X] || {};
    ky.push('Hóa ' + PT_H[f.h] + ' năm sinh (' + f.sao + ') ngồi tại ' + X + '. ' + (v.ky || ''));
    if (v.de) de.push(v.de);
  });
  N.tuHoa.filter(function (t) { return t.o === i; }).forEach(function (t) {
    var v = (((van.tuHoa || {})[t.loai] || {})[PT_H[t.h]]) || {};
    ky.push(X + ' tự hóa ' + PT_H[t.h] + (t.loai === 'lyTam' ? ' ly tâm' : ' hướng tâm') + ' (' + t.sao + (t.loai === 'huongTam' ? ' ở cung đối ' + ten[ptD_(i)] : '') + '). ' + ptThay_(v.ky, { lv: ptLv_(X) }));
    if (v.de) de.push(ptThay_(v.de, { lv: ptLv_(X) }));
  });
  N.phi[i].forEach(function (f) {
    if (f.toi == null || f.toi === i || f.toi === ptD_(i)) return;   // tự hóa đã nói ở trên
    var Y = ten[f.toi], rieng = (PT_LUAN[X] || {})[PT_H[f.h] + '|' + Y], v = ((van.phi || {})[PT_H[f.h]]) || {};
    var chuyen = ptTenTu_(i, f.toi);
    ky.push(X + ' (can ' + CAN[N.P[i].can] + ') phi Hóa ' + PT_H[f.h] + ' (' + f.sao + ') nhập ' + Y + (X !== 'Mệnh' ? ' (' + Y + ' là cung ' + chuyen + ' tính từ ' + X + ')' : '') + '. ' + (rieng ? rieng.luan : ptThay_(v.ky, { A: X, B: Y })));
    if (f.h === 0 || f.h === 3) { var d = rieng ? rieng.de : ptThay_(v.de, { A: ptLv_(X), B: ptLv_(Y) }); if (d) de.push(d); }
  });
  var vao = [];
  for (var j = 0; j < 12; j++) if (j !== i) N.phi[j].forEach(function (f) { if (f.toi === i && (f.h === 0 || f.h === 3)) vao.push(ten[j] + ' phi ' + PT_H[f.h]); });
  if (vao.length) ky.push('Cung khác phi vào ' + X + ': ' + vao.join('; ') + '.');
  var ck = N.chuyenKy(i);
  if (ck.o.length > 2) ky.push('Chuỗi chuyển Kỵ: ' + ck.o.map(function (x) { return ten[x]; }).join(' → ') + (ck.kyXuat ? ' (dừng ở tự hóa Kỵ – Kỵ xuất)' : '') + '.');
  var gop = {}; de = de.filter(function (x) { if (gop[x]) return false; gop[x] = 1; return true; });
  return { cung: X, chi: CHI[i], can: CAN[N.P[i].can], ky: ky, de: de };
}

/** Một tầng vận (đại vận hoặc lưu niên): Tứ Hóa của tầng đọc chồng lên nguyên cục */
function ptTang_(N, tv, menhTang, canTang, dvMenh, laDaiVan) {
  var hoa = ptHoa_(tv, canTang), ten = N.ten, snKy = N.sn[3].toi, snLoc = N.sn[0].toi, snQuyen = N.sn[1].toi, van = PT_VAN || {}, nhan = laDaiVan ? 'vận' : 'năm';
  function vv(x) { return laDaiVan || !x ? x : x.replace(/của vận/g, 'của năm').replace(/Của vận/g, 'Của năm'); }   // văn đại vận dùng lại cho lưu niên
  var ky = [], de = [], diem = 0, co = {};
  hoa.forEach(function (f) {
    if (f.toi == null) return;
    var nc = ten[f.toi], tang = ptTenTu_(menhTang, f.toi), dvTen = dvMenh != null ? ptTenTu_(dvMenh, f.toi) : null;
    ky.push('Hóa ' + PT_H[f.h] + ' (' + f.sao + ') nhập ' + nc + ' nguyên cục' + (tang !== nc ? ' – là ' + tang + ' của ' + nhan : '') + (dvTen ? ' – ' + dvTen + ' của đại vận' : '') + '.');
    if (f.h === 0) {
      var v = (van.dvLoc || {})[nc] || {}; if (v.ky) ky.push(vv(v.ky)); if (v.de) de.push(v.de);
      diem += N.tamHop.indexOf(f.toi) >= 0 ? 1 : 0.5;
      if (snKy === f.toi) { ky.push('Lộc của ' + nhan + ' rơi đúng chỗ có Kỵ năm sinh (' + nc + ') – làm dịu Kỵ.'); diem += 0.5; }
    }
    if ((f.h === 0 || f.h === 1) && (f.toi === snLoc || f.toi === snQuyen)) { co.trungDiepCat = { A: nc }; diem += 0.5; }   // tốt chồng tốt
    if (f.h === 3) {
      var x = ptD_(f.toi), vk = (van.dvKy || {})[nc] || {}, vx = (van.dvKyXung || {})[ten[x]] || {};
      ky.push('Hóa Kỵ của ' + nhan + ' xung ' + ten[x] + ' nguyên cục.'); if (vk.ky) ky.push(vv(vk.ky)); if (vx.ky) ky.push(vv(vx.ky));
      if (vk.de) de.push(vk.de); if (vx.de) de.push(vx.de);
      if (N.tamHop.indexOf(f.toi) >= 0) co.kyNhapTamHop = { A: nc };
      var phan = laDaiVan && N.tamHop.indexOf(menhTang) >= 0 && ['Phu Thê', 'Thiên Di', 'Phúc Đức'].indexOf(nc) >= 0;
      if (N.tamHop.indexOf(x) >= 0) { co.kyXungTamHop = { A: ten[x] }; if (!phan) diem -= 1; }   // phản cung đã tính sức nặng – không trừ hai lần
      if (snKy != null && (f.toi === snKy || f.toi === ptD_(snKy))) { co.songKy = { A: nc }; diem -= 1; }
      if (snLoc === f.toi) { co.trungDiepKy = { A: nc }; diem -= 0.5; }
      if (phan) { co.phanCung = { A: nc, B: ten[x] }; diem -= 1.5; }
    }
  });
  var mau = Object.keys(co).map(function (k) { var m = (van.mau || {})[k] || {}; return { k: k, ten: m.ten || k, ky: vv(ptThay_(m.ky, { A: co[k].A, B: co[k].B })), de: ptThay_(m.de, { A: ptLv_(co[k].A || ''), B: ptLv_(co[k].B || '') }) }; });
  var gop = {}; de = de.filter(function (x) { if (gop[x]) return false; gop[x] = 1; return true; });
  var muc = diem >= 1.5 ? 'Thuận' : diem >= 0 ? 'Bình' : diem >= -1.5 ? 'Cần giữ nhịp' : 'Nên thận trọng';
  return { menh: ten[menhTang], menhO: menhTang, chi: CHI[menhTang], can: CAN[canTang], hoa: hoa.map(function (f) { return { h: PT_H[f.h], sao: f.sao, cung: f.toi == null ? null : ten[f.toi], o: f.toi }; }), ky: ky, de: de, mau: mau, diem: diem, muc: muc };
}

/** Hàm chính: luận Tứ Hóa Phi Tinh. vy = năm xem; soNam = số lưu niên tính từ vy */
function ptLap_(tv, vy, soNam) {
  var N = ptNguyenCuc_(tv), I = tv.info, P = tv.palaces, ten = N.ten, van = PT_VAN || {};
  vy = vy || I.viewYear; soNam = soNam || 5;
  var mau = ptMau_(N).map(function (m) {
    var v = (van.mau || {})[m.k] || {};
    return { k: m.k, ten: v.ten || m.k, ky: (m.ky ? m.ky + '. ' : '') + ptThay_(v.ky, { A: m.A, B: m.B }), de: ptThay_(v.de, { A: ptLv_(m.A || ''), B: ptLv_(m.B || '') }) };
  });
  var lnV = N.ln >= 0 ? ((van.laiNhan || {})[ten[N.ln]] || {}) : {};
  var dv = [];
  for (var i = 0; i < 12; i++) if (P[i].daiHan != null) {
    var t = ptTang_(N, tv, i, P[i].can, null, true);
    t.tuoi = P[i].daiHan; t.den = P[i].daiHan + 9; t.nam = I.lunar.year + P[i].daiHan - 1; t.nay = I.tuoi >= t.tuoi && I.tuoi <= t.den;
    dv.push(t);
  }
  dv.sort(function (a, b) { return a.tuoi - b.tuoi; });
  var ln = [];
  for (var y = vy; y < vy + soNam; y++) {
    var tuoi = y - I.lunar.year + 1, dvO = -1;
    for (var k = 0; k < 12; k++) if (P[k].daiHan != null && tuoi >= P[k].daiHan && tuoi <= P[k].daiHan + 9) dvO = k;
    var m = ((y + 8) % 12 + 12) % 12, c = ((y + 6) % 10 + 10) % 10;
    var tl = ptTang_(N, tv, m, c, dvO >= 0 ? dvO : null, false);
    tl.nam = y; tl.tuoi = tuoi; tl.dvMenh = dvO >= 0 ? ten[dvO] : null;
    ln.push(tl);
  }
  // Dữ liệu vẽ lá số 4×4 (chỉ số theo ô địa chi 0 = Tý): sao chính + 4 phụ tinh có Tứ Hóa, hóa năm sinh, tự hóa, phi hóa
  var PHU = ['Tả Phù', 'Hữu Bật', 'Văn Xương', 'Văn Khúc'], snSao = {};
  N.sn.forEach(function (f) { snSao[f.sao] = PT_H[f.h]; });
  var banDo = P.map(function (p, i) {
    var sao = (p.chinh || []).map(function (x) { return x.n; }).concat(PHU.filter(function (s) { return tv.pos[s] === i; }));
    return { cung: p.cung, chi: CHI[i], can: CAN[p.can],
      sao: sao.map(function (s) { return { n: s, sn: snSao[s] || '' }; }),
      tu: N.tuHoa.filter(function (t) { return t.o === i; }).map(function (t) { return { h: PT_H[t.h], loai: t.loai }; }),
      phi: N.phi[i].map(function (f) { return { h: PT_H[f.h], sao: f.sao, o: f.toi }; }) };
  });
  return {
    gioiThieu: van.gioiThieu || {}, banDo: banDo, menhO: I.menh, laiNhanO: N.ln,
    coBan: {
      canCung: P.map(function (p, i) { return { cung: p.cung, chi: CHI[i], can: CAN[p.can] }; }),
      sinhNien: N.sn.map(function (f) { return { h: PT_H[f.h], sao: f.sao, cung: f.toi == null ? null : ten[f.toi] }; }),
      laiNhan: N.ln >= 0 ? { cung: ten[N.ln], chi: CHI[N.ln], ky: lnV.ky || '', de: lnV.de || '' } : null,
      menh: ten[I.menh], than: P[I.than] ? P[I.than].cung : ''
    },
    tuHoa: N.tuHoa.map(function (t) { return { cung: ten[t.o], h: PT_H[t.h], sao: t.sao, loai: t.loai }; }),
    mau: mau,
    cung: PT_THU_TU.map(function (c) { return ptCung_(N, N.o[c]); }),
    daiVan: dv, luuNien: ln, nguon: PT_NGUON,
    bai: ptBai_(tv, vy)
  };
}

/** API cho giao diện – tab "Phi Tinh": hiện chỉ chủ sở hữu (chủ dự án chốt 31/10, thử trước rồi mới mở bán) */
function phiTinhLuan(input, token) {
  tkCan_(token, true);
  input = input || {};
  var tv = tuviLapLaSo_(input);
  return ptLap_(tv, parseInt(input.viewYear, 10) || tv.info.viewYear, 5);
}

/* ------------------------------------------------------------------------------------------------------------------------------------
 * Công thức bổ sung (1/11/2026) – chỉ những mục chuyên gia nghiên cứu xác nhận mức cao (xem nghien-cuu/phi-tinh/cong-thuc-bo-sung.md).
 * Chưa đưa vào (nguồn thấp/không có): điểm xí hoa, cung khí theo hỉ kỵ thần, Thiên–Địa–Nhân của can, Tài thiên/địa/nhân,
 * Phá thể, "Dương phi nhập Âm". Tuyệt mệnh Kỵ không hiển thị (quy tắc không đoán chết, bệnh).
 * ---------------------------------------------------------------------------------------------------------------------------------- */
/** Mệnh tháng (lưu nguyệt) theo Đẩu quân: Đẩu quân năm y = chi năm − (tháng sinh − 1) + chi giờ sinh = tháng Giêng; tháng n đi thuận.
 *  Can dùng cho Tứ Hóa tháng = can cung nguyên cục nơi Mệnh tháng đóng (cách của phái Tứ Hóa). Tháng sinh nhuận tính theo số tháng. */
function ptMenhThang_(tv, y, n) {
  var I = tv.info, chiNam = ((y + 8) % 12 + 12) % 12;
  var dq = ((chiNam - (I.thangAn - 1) + I.hourChi) % 12 + 12) % 12, o = (dq + n - 1) % 12;
  return { o: o, can: tv.palaces[o].can, dauQuan: dq };
}
/** Nghịch thủy Kỵ (≥4 nguồn): Mệnh, Tài Bạch hoặc Quan Lộc phi Kỵ sang cung đối, cung đối có Kỵ năm sinh và không tự hóa (ly tâm – thống nhất với Nhập khố).
 *  Thuận thủy Kỵ (mức trung bình – có lẽ là tên khác của Lưu thủy Kỵ): phi Kỵ sang cung khác, không phải cung đối. */
var PT_THUY_ = {
  nghich: function (N, i) {
    var k = N.phi[i][3].toi;
    return ['Mệnh', 'Tài Bạch', 'Quan Lộc'].indexOf(N.ten[i]) >= 0 && k === ptD_(i) && N.sn[3].toi === k && !N.coLyTam(k);
  },
  thuan: function (N, i) { var k = N.phi[i][3].toi; return k != null && k !== i && k !== ptD_(i); }
};

/* ------------------------------------------------------------------------------------------------------------------------------------
 * Bài luận Phi Tinh theo mục lục Bắc phái (dựng lại 1/11/2026): Tổng quan → Mệnh → Thân → 11 cung → 12 đại vận → vận năm → 12 tháng → phụ lục.
 * Lời luận lấy từ PT_KHO (kho tổng hợp catalog.json – đã viết lại bằng lời mới): tra khóa cụ thể trước, không có thì lùi về khóa "*".
 * Mỗi mục: { t: dòng căn cứ (thuật ngữ), chu: chủ đề đời thường, muc: cat|hung|trung, de: [lời dễ hiểu], cc: [ "nguồn – ý chuyên môn" ] }.
 * ---------------------------------------------------------------------------------------------------------------------------------- */
var PT_THUY_ = typeof PT_THUY_ !== 'undefined' ? PT_THUY_ : null;   // quy tắc Thuận/Nghịch thủy Kỵ (gen/cong-thuc.js)
var PT_THU_TU_BAI = ['Mệnh', 'Phu Thê', 'Tử Tức', 'Tài Bạch', 'Phúc Đức', 'Điền Trạch', 'Tật Ách', 'Thiên Di', 'Quan Lộc', 'Phụ Mẫu', 'Huynh Đệ', 'Nô Bộc'];   // thứ tự mục lục bài Bắc phái
var PT_KHO_TEN = { 'Lộc': 'Lộc', 'Quyền': 'Quyền', 'Khoa': 'Khoa', 'Kỵ': 'Kỵ' };
function ptO_(goc, ten) { return ptCungTu_(goc, PT_CUNG.indexOf(ten)); }          // ô của cung "ten" khi Mệnh tầng ở ô goc
function ptTamDiem_(o) { return [o, ptD_(o), (o + 11) % 12]; }                       // ứng kỳ: chi cung nhận, đối cung, chi liền trước
function ptThangCuaChi_(c) { return ((c - 2) % 12 + 12) % 12 + 1; }                  // tháng âm mang chi c (Dần = tháng Giêng)

/** Tra kho: thử lần lượt các khóa, trả về danh sách ý của khóa đầu tiên có */
function ptKho_(khoa) {
  for (var i = 0; i < khoa.length; i++) { var v = PT_KHO[khoa[i]]; if (v && v.length) return v; }
  return null;
}
/** Dựng một mục luận. ds = danh sách ý [nguồn, ky, de, muc]; chon = hàm lọc ý (tùy chọn); toiDa = số câu dễ hiểu tối đa */
function ptMuc_(t, ds, chu, chon, toiDa) {
  if (!ds) return null;
  if (chon) ds = ds.filter(chon);
  if (!ds.length) return null;
  var de = [], cc = [], dem = { cat: 0, hung: 0, trung: 0 };
  ds.forEach(function (y) {
    dem[y[3]] = (dem[y[3]] || 0) + 1;
    if (y[1] && cc.length < 4) cc.push((y[0] ? y[0] + ': ' : '') + y[1]);
    if (y[2] && de.indexOf(y[2]) < 0 && de.length < (toiDa || 2)) de.push(y[2]);
  });
  var muc = dem.cat > dem.hung ? 'cat' : dem.hung > dem.cat ? 'hung' : 'trung';
  return { t: t, chu: chu || '', muc: muc, de: de, cc: cc };
}
/** Mục lấy từ kho theo các khóa thử dần */
function ptMucK_(t, khoa, chu, chon, toiDa) { return ptMuc_(t, ptKho_(khoa), chu, chon, toiDa); }
/** Mục tự soạn (khi kho không có khóa – lùi về văn cũ PT_VAN/PT_LUAN) */
function ptMucTu_(t, ky, de, chu, muc, trong) { return ky || de || trong ? { t: t, chu: chu || '', muc: muc || 'trung', de: de ? [de] : [], cc: ky ? [ky] : [] } : null; }
function ptDay_(ds, m) { if (m) ds.push(m); }

/* ---------- Nguyên cục: các mẫu Lộc/Kỵ có tên (theo cung phát) ---------- */
function ptMauNC_(N, tv) {
  var ra = [], ten = N.ten, phi = N.phi, snKy = N.sn[3].toi, snLoc = N.sn[0].toi, snQuyen = N.sn[1].toi, snKySao = N.sn[3].sao;
  function them(cung, khoa, t, chon, an) { ra.push({ cung: cung, khoa: khoa, t: t, chon: chon, an: an }); }
  for (var i = 0; i < 12; i++) {
    var X = ten[i], ky = phi[i][3].toi, loc = phi[i][0].toi;
    if (ky != null && ky !== i) {
      if (PT_THUY_ && PT_THUY_.nghich(N, i)) them(X, 'Nghịch thủy Kỵ', X + ' phi Kỵ (' + phi[i][3].sao + ') sang cung đối ' + ten[ky] + ' – nơi có Kỵ năm sinh, không tự hóa');
      else if (ky === ptD_(i)) them(X, X === 'Điền Trạch' || X === 'Tài Bạch' ? 'Lưu xuất Kỵ' : 'Tiết xuất Kỵ', X + ' phi Kỵ sang cung đối ' + ten[ky]);
    }
    if (loc != null && loc === ptD_(i)) {
      if (snLoc === loc) them(X, 'Điệp xuất Lộc', X + ' phi Lộc sang ' + ten[loc] + ' – nơi đã có Lộc năm sinh');
      else them(X, 'Tiết xuất Lộc', X + ' phi Lộc sang cung đối ' + ten[loc]);
      if (phi[loc][0].toi === i || snLoc === i) them(X, 'Đối trì Lộc', 'Hai đầu trục ' + X + ' – ' + ten[loc] + ' cùng có Lộc');
    }
    for (var j = i + 1; j < 12; j++) {
      if (loc === j && phi[j][0].toi === i) them(X, 'Lộc Lộc trao đổi', X + ' và ' + ten[j] + ' phi Lộc cho nhau');
    }
    for (var j2 = 0; j2 < 12; j2++) if (j2 !== i && ky === j2 && phi[j2][0].toi === i) them(X, 'Thị phi Kỵ', X + ' phi Kỵ nhập ' + ten[j2] + ' trong khi ' + ten[j2] + ' phi Lộc về ' + X);
  }
  if (snKy != null) {
    var tuKy = N.tuHoa.some(function (t) { return t.o === snKy && t.h === 3 && t.loai === 'lyTam'; });
    if ([2, 5, 8, 11].indexOf(snKy) >= 0) them(ten[snKy], 'Tứ mã Kỵ', 'Kỵ năm sinh (' + snKySao + ') ở ' + CHI[snKy]);
    if ([1, 4, 7, 10].indexOf(snKy) >= 0 && !N.coLyTam(snKy)) them(ten[snKy], 'Nhập khố Kỵ', 'Kỵ năm sinh (' + snKySao + ') ở ' + CHI[snKy] + ', cung không tự hóa');
    if ([0, 3, 6, 9].indexOf(snKy) >= 0) them(ten[snKy], 'Tứ chính Kỵ', 'Kỵ năm sinh (' + snKySao + ') ở ' + CHI[snKy]);
  }
  N.tuHoa.forEach(function (t) {
    if (t.loai === 'lyTam' && t.h === 3 && [2, 5, 8, 11].indexOf(t.o) >= 0 && t.o !== snKy) them(ten[t.o], 'Tứ mã Kỵ', ten[t.o] + ' tự hóa Kỵ ở ' + CHI[t.o]);
  });
  // Củ triền Kỵ: hai cung khác nhau phi Kỵ vào hai đầu một trục đối
  var daXet = {};
  for (var a = 0; a < 12; a++) for (var b = 0; b < 12; b++) {
    var ka = phi[a][3].toi, kb = phi[b][3].toi;
    if (a === b || ka == null || kb == null || ka === a || kb === b || kb !== ptD_(ka)) continue;
    var truc = Math.min(ka, kb) + '-' + Math.max(ka, kb); if (daXet[truc]) continue; daXet[truc] = 1;
    var cT = [ten[ka], ten[kb]], chon = null;
    if (cT.indexOf('Tử Tức') >= 0 || cT.indexOf('Tài Bạch') >= 0) chon = function (y, n) { return n === 1; };
    else chon = function (y, n) { return n === 0; };
    them(ten[a], 'Củ triền Kỵ', ten[a] + ' phi Kỵ nhập ' + ten[ka] + ', ' + ten[b] + ' phi Kỵ nhập ' + ten[kb] + ' (trục ' + cT.join(' – ') + ')', chon);
  }
  // Song Lộc: Lộc năm sinh gặp Lộc Tồn (ngoài Mệnh – Mệnh dùng cách "Lộc hợp uyên ương"), hoặc Lộc và Quyền năm sinh cùng tọa
  if (snLoc != null && snLoc === snQuyen && ten[snLoc] === 'Điền Trạch') them(ten[snLoc], 'Song Lộc', 'Lộc và Quyền năm sinh cùng tọa ' + ten[snLoc], function (y, n) { return n === 1; });
  // Song Kỵ nguyên cục: Mệnh phi Kỵ trùng/xung Kỵ năm sinh
  var mk = phi[N.o['Mệnh']][3].toi;
  if (snKy != null && mk != null && (mk === snKy || mk === ptD_(snKy))) them('Mệnh', 'Song Kỵ', 'Mệnh phi Kỵ ' + (mk === snKy ? 'trùng' : 'xung') + ' Kỵ năm sinh ở ' + ten[snKy]);
  return ra;
}
/** Mẫu → mục luận (chọn ý theo chỉ số khi khóa có nhiều ý cho nhiều trường hợp) */
function ptMauMuc_(m) {
  var ds = PT_KHO['mau|' + m.khoa]; if (!ds) return null;
  if (m.chon) ds = ds.filter(function (y, n) { return m.chon(y, n); });
  var x = ptMuc_(m.khoa + ': ' + m.t, ds, ptLv_(m.cung));
  return x;
}

/* ---------- Cách cục tại Mệnh ---------- */
function ptCach_(N, tv) {
  var m = N.o['Mệnh'], p = tv.pos, ra = [], tp = [m, (m + 4) % 12, (m + 8) % 12, ptD_(m)];
  if (p['Văn Xương'] === m && p['Văn Khúc'] === m) ra.push('Văn quế văn hoa');
  if (p['Thiên Cơ'] === m && p['Cự Môn'] === m) ra.push('Cơ Cự đồng lâm');
  if (N.sn[0].toi === m && p['Lộc Tồn'] === m) ra.push('Lộc hợp uyên ương');
  if (tp.indexOf(p['Thiên Phủ']) >= 0 && tp.indexOf(p['Thiên Tướng']) >= 0) ra.push('Phủ Tướng triều viên');
  return ra;
}

/** Sao trong một ô (dùng tra khóa sao|<Sao>|<Cung>) */
function ptSaoO_(tv, o) {
  var ds = []; Object.keys(tv.pos).forEach(function (s) { if (tv.pos[s] === o) ds.push(s); });
  if (!(tv.palaces[o].chinh || []).length) ds.push('Vô chính diệu');
  return ds;
}

/* ---------- Luận một cung nguyên cục theo mục lục ---------- */
function ptCungBai_(N, tv, X, mauNC, ck) {
  var i = N.o[X], can = CAN[N.P[i].can], lv = ptLv_(X), van = PT_VAN || {}, phan = [];
  // 1. Cung khí, can cung
  var a = [];
  if (ck) ptDay_(a, ck.cung[i]);
  ptDay_(a, ptMucK_('Can cung ' + X + ': ' + can, ['canCung|' + X + '|' + can], lv));
  if (ck && ck.tdn) ptDay_(a, ck.tdn[i]);
  if (a.length) phan.push({ ten: 'Cung khí và can cung', muc: a });
  // 2. Mẫu phi hóa
  var b = mauNC.filter(function (m) { return m.cung === X; }).map(ptMauMuc_).filter(Boolean);
  if (X === 'Mệnh') ptCach_(N, tv).filter(function (c) { return c === 'Lộc hợp uyên ương'; }).forEach(function (c) { ptDay_(b, ptMucK_('Song Lộc tại Mệnh (' + c + ')', ['mau|Song Lộc'], lv, function (y, n) { return n === 0; })); });
  if (b.length) phan.push({ ten: 'Mẫu phi hóa', muc: b });
  // 3. Tứ Hóa năm sinh tọa, tự hóa
  var c = [];
  N.sn.forEach(function (f) {
    if (f.toi !== i) return;
    var H = PT_H[f.h], t = 'Hóa ' + H + ' năm sinh (' + f.sao + ') tọa ' + X, v = ((van.snToa || {})[H] || {})[X] || {};
    ptDay_(c, ptMucK_(t, ['snToa|' + H + '|' + X], lv) || ptMucTu_(t, v.ky, v.de, lv, H === 'Kỵ' ? 'trung' : 'cat'));
  });
  N.tuHoa.filter(function (t) { return t.o === i; }).forEach(function (t) {
    var H = PT_H[t.h], nhan = X + ' tự hóa ' + H + (t.loai === 'lyTam' ? ' ly tâm' : ' hướng tâm') + ' (' + t.sao + ')', v = (((van.tuHoa || {})[t.loai] || {})[H]) || {};
    var m = t.loai === 'lyTam' ? ptMucK_(nhan, ['tuHoa|' + X + '|' + H], lv) : null;
    ptDay_(c, m || ptMucTu_(nhan, ptThay_(v.ky, { lv: lv }), ptThay_(v.de, { lv: lv }), lv));
    if (t.loai === 'lyTam') ptDay_(c, ptMucK_('Tự hóa ly tâm ở ' + X, ['mau|Tự hóa li tâm'], lv));
  });
  if (c.length) phan.push({ ten: 'Tứ Hóa năm sinh và tự hóa', muc: c });
  // 4. Cung phi Lộc / Quyền / Khoa / Kỵ
  var d = [];
  N.phi[i].forEach(function (f) {
    if (f.toi == null || f.toi === i || f.toi === ptD_(i)) return;   // tự hóa (ly tâm/hướng tâm) đã nói ở trên
    var H = PT_H[f.h], Y = N.ten[f.toi], chuyen = ptTenTu_(i, f.toi);
    var t = X + ' (can ' + can + ') phi Hóa ' + H + ' (' + f.sao + ') nhập ' + Y + (X !== 'Mệnh' ? ' – ' + Y + ' là cung ' + chuyen + ' tính từ ' + X : '');
    var m = ptMucK_(t, ['phi|' + X + '|' + H + '|' + Y], lv, null, 2);
    if (!m) {
      var rieng = (PT_LUAN[X] || {})[H + '|' + Y], v = ((van.phi || {})[H]) || {};
      m = rieng ? ptMucTu_(t, rieng.luan, rieng.de, lv, H === 'Kỵ' ? 'hung' : 'cat') :
        ptMucTu_(t, ptThay_(v.ky, { A: X, B: Y }), f.h === 0 || f.h === 3 ? ptThay_(v.de, { A: lv, B: ptLv_(Y) }) : '', lv, H === 'Kỵ' ? 'trung' : 'cat');
    }
    ptDay_(d, m);
  });
  var ckChuoi = N.chuyenKy(i);
  if (ckChuoi.o.length > 2 && d.length) d[d.length - 1].cc.push('Chuỗi Kỵ chuyển Kỵ: ' + ckChuoi.o.map(function (x) { return N.ten[x]; }).join(' → ') + (ckChuoi.kyXuat ? ' (dừng ở tự hóa Kỵ)' : '') + '.');
  if (d.length) phan.push({ ten: X + ' phi Lộc – Quyền – Khoa – Kỵ', muc: d });
  // 5. M chất, sao, cách cục
  var e = [];
  if (N.sn.some(function (f) { return f.toi === i; })) ptDay_(e, ptMucK_(X + ' có M chất (có Tứ Hóa năm sinh tọa)', ['mchat|' + X + '|chat'], lv));
  var daM = {};
  N.phi[i].forEach(function (f) {
    if (f.toi == null || f.toi === i) return; var Y = N.ten[f.toi]; if (daM[Y]) return; daM[Y] = 1;
    ptDay_(e, ptMucK_('M ' + Y + ' của ' + X + ' (' + X + ' phi Hóa ' + PT_H[f.h] + ' vào ' + Y + ')', ['mchat|' + X + '|' + Y], lv));
  });
  ptSaoO_(tv, i).forEach(function (s) { if (!(X === 'Mệnh' && (tv.palaces[i].chinh || []).some(function (x) { return x.n === s; }))) ptDay_(e, ptMucK_(s + ' tại ' + X, ['sao|' + s + '|' + X], lv)); });
  if (ck) { var kl = ptMucK_('Cách dùng cung khí cho ' + X + ' (Sở Hoàng)', ['cungKhiLuan|' + X], lv); if (kl) { kl.de = []; ptDay_(e, kl); } }
  if (e.length) phan.push({ ten: 'M chất, sao và cách cục', muc: e });
  return { id: 'c-' + X, ten: 'Cung ' + X, phu: can + ' ' + CHI[i], chu: lv, phan: phan };
}

/* ---------- Thể – Dụng giữa hai tầng (đại vận/nguyên cục, năm/đại vận, tháng/năm) ---------- */
/** theGoc, dungGoc: ô Mệnh của tầng lớn (Thể) và tầng nhỏ (Dụng). Can 12 ô cố định (Ngũ Hổ Độn năm sinh). snO: {ô: [Hóa]} Hóa năm sinh. */
function ptTheDung_(N, tv, theGoc, dungGoc, tang, snO, dungHoa) {
  var dong = [], diem = {}, P = N.P, menhNC = N.o['Mệnh'];
  PT_CUNG.forEach(function (X) { diem[X] = { tot: 0, xau: 0, ds: [] }; });
  function cham(X, d, nhan) { var z = diem[X]; if (d > 0) z.tot = Math.max(z.tot, d); else z.xau = Math.max(z.xau, -d); z.ds.push(nhan); }
  PT_CUNG.forEach(function (X) {
    var uT = ptO_(theGoc, X), uD = ptO_(dungGoc, X);
    if (snO && snO[uD]) cham(X, 2, 'M chất (' + snO[uD].join(', ') + ')');  // tầng nhỏ chồng lên cung có Hóa năm sinh
    if (uT === uD) return;                                                 // hai tầng trùng cung: không có dòng Thể – Dụng riêng
    ptHoa_(tv, P[uD].can).forEach(function (f) {                            // Dụng → Thể
      if (f.toi == null) return; var H = PT_H[f.h];
      if (f.toi === uT) { dong.push({ X: X, huong: 'Dụng→Thể', loai: 'nhap', H: H, sao: f.sao, sao4: 3, o: f.toi, tu: uD }); cham(X, H === 'Kỵ' ? -2 : 2, (H === 'Kỵ' ? 'quy vị Kỵ' : 'quy vị ' + H)); }
      else if (f.toi === ptD_(uT)) { var lx = H === 'Kỵ' ? 'xung' : 'chieu'; dong.push({ X: X, huong: 'Dụng→Thể', loai: lx, H: H, sao: f.sao, sao4: 4, o: f.toi, tu: uD }); cham(X, H === 'Kỵ' ? -3 : H === 'Lộc' ? 3 : 1, H + ' Dụng ' + (H === 'Kỵ' ? 'xung' : 'chiếu') + ' Thể'); }
      if (X !== 'Mệnh' && X !== 'Thiên Di' && tang === 'dv') {           // Thiên Di: đối cung là Mệnh gốc – đã tính ở Dụng→Thể                                  // ĐV.X phi Hóa vào Mệnh nguyên cục
        if (f.toi === menhNC) { dong.push({ X: X, huong: 'Mệnh', loai: H === 'Kỵ' ? 'kyNhapMenh' : 'catNhapMenh', H: H, sao: f.sao, sao4: 0, o: f.toi, tu: uD }); cham(X, H === 'Kỵ' ? -1 : 1, H + ' nhập Mệnh gốc'); }
        else if (H === 'Kỵ' && f.toi === ptD_(menhNC)) { dong.push({ X: X, huong: 'Mệnh', loai: 'kyXungMenh', H: H, sao: f.sao, sao4: 0, o: f.toi, tu: uD }); cham(X, -2, 'Kỵ xung Mệnh gốc'); }
      }
    });
    ptHoa_(tv, P[uT].can).forEach(function (f) {                            // Thể → Dụng
      if (f.toi == null) return; var H = PT_H[f.h];
      if (f.toi === uD) { dong.push({ X: X, huong: 'Thể→Dụng', loai: 'nhap', H: H, sao: f.sao, sao4: 1, o: f.toi, tu: uT }); cham(X, H === 'Kỵ' ? -2 : 1, H + ' Thể nhập Dụng'); }
      else if (f.toi === ptD_(uD)) { var lx2 = H === 'Kỵ' ? 'xung' : 'chieu'; dong.push({ X: X, huong: 'Thể→Dụng', loai: lx2, H: H, sao: f.sao, sao4: 2, o: f.toi, tu: uT }); cham(X, H === 'Kỵ' ? -2 : 1, H + ' Thể ' + (H === 'Kỵ' ? 'xung' : 'chiếu') + ' Dụng'); }
    });
  });
  return { dong: dong, diem: diem, trung: theGoc === dungGoc };
}
/** Xếp mức tổng luận một chủ đề: cat / binh / hung (+ nhãn chữ theo cách cohoc chấm) */
function ptXep_(z) {
  if (!z.tot && !z.xau) return null;
  var T = ['', 'tốt bình thường', 'khá tốt', 'rất tốt'], X = ['', 'xấu bình thường', 'khá xấu', 'rất xấu'];
  if (z.tot && !z.xau) return { muc: 'cat', nhan: T[z.tot] };
  if (z.xau && !z.tot) return { muc: 'hung', nhan: X[z.xau] };
  var m = Math.max(z.tot, z.xau);
  return { muc: 'binh', nhan: m <= 1 ? 'tốt xấu đan xen, mức không lớn' : m === 2 ? 'tốt xấu đan xen, biên độ khá lớn' : 'tốt xấu đan xen, biên độ rất lớn' };
}
/** Dòng Thể – Dụng → mục luận */
function ptDongMuc_(d, tang, tenThe, tenDung) {
  var X = d.X, lv = ptLv_(X), H = d.H, sao = d.sao4 ? ' ' + new Array(d.sao4 + 1).join('*') : '';
  var t = d.huong === 'Mệnh' ? tenDung + '.' + X + ' phi ' + H + ' (' + d.sao + ') ' + (d.loai === 'kyXungMenh' ? 'xung' : 'nhập') + ' Mệnh ' + tenThe :
    d.huong === 'Dụng→Thể' ? tenDung + '.' + X + ' phi ' + H + ' (' + d.sao + ') ' + (d.loai === 'nhap' ? 'nhập (quy vị)' : d.loai === 'xung' ? 'xung' : 'chiếu') + ' ' + tenThe + '.' + X + ' – ' + H + ' Dụng ' + (d.loai === 'nhap' ? 'nhập' : d.loai === 'xung' ? 'xung' : 'chiếu') + ' Thể' + sao :
    tenThe + '.' + X + ' phi ' + H + ' (' + d.sao + ') ' + (d.loai === 'nhap' ? 'nhập' : d.loai === 'xung' ? 'xung' : 'chiếu') + ' ' + tenDung + '.' + X + ' – ' + H + ' Thể ' + (d.loai === 'nhap' ? 'nhập' : d.loai === 'xung' ? 'xung' : 'chiếu') + ' Dụng' + sao;
  var khoa;
  if (tang === 'dv') {
    if (d.huong === 'Mệnh') khoa = ['dv|' + d.loai + '|' + X, 'dv|' + d.loai + '|*'];
    else if (d.huong === 'Dụng→Thể') khoa = d.loai === 'nhap' ? ['dv|quyVi|' + H + '|*'] : d.loai === 'xung' ? ['dv|kyXungNc|' + X, 'dv|kyXungNc|*'] : ['dv|chieu|' + H + '|' + X, 'dv|chieu|' + H + '|*'];
    else khoa = d.loai === 'xung' ? ['dv|ncXungDv|*'] : d.loai === 'nhap' && (H === 'Lộc' || H === 'Kỵ') ? ['dv|ncNhapDv|' + H + '|*'] : ['dv|chieu|' + H + '|*'];
  } else khoa = ['ln|' + d.huong + '|' + d.loai + '|' + H + '|' + X, 'ln|' + d.huong + '|' + d.loai + '|' + H + '|*'];
  var m = ptMucK_(t, khoa, lv, null, 1);
  return m;
}
/** Tổng luận 12 chủ đề từ bảng điểm */
function ptTongLuan_(diem, tang) {
  var ra = [];
  PT_CUNG.forEach(function (X) {
    var x = ptXep_(diem[X]); if (!x) return;
    var khoa = tang === 'dv' ? 'dv|tongLuan|' + X + '|' + x.muc : 'thang|ketLuan|' + X + '|' + x.muc;
    var m = ptMucK_('Chủ đề ' + X + ': ' + x.nhan + ' (' + diem[X].ds.join('; ') + ')', [khoa], ptLv_(X), null, 1);
    if (m) {
      m.muc = x.muc;
      if (tang === 'nam') { m.de = m.de.map(function (s) { return s.replace(/tháng này/g, 'năm nay').replace(/trong tháng/g, 'trong năm').replace(/một tháng/g, 'một năm').replace(/tháng/g, 'năm'); }); m.t = m.t.replace('Kết luận tháng', 'Kết luận năm'); }
      m.cung = X; m.nhan = x.nhan; ra.push(m);
    }
  });
  return ra;
}
function ptSnO_(N) { var o = {}; N.sn.forEach(function (f) { if (f.toi != null) (o[f.toi] = o[f.toi] || []).push(PT_H[f.h]); }); return o; }

/* ---------- Một đại vận ---------- */
function ptDaiVanBai_(N, tv, d, ck) {
  var P = N.P, ten = N.ten, can = P[d].can, hoa = ptHoa_(tv, can), snO = ptSnO_(N), muc = [];
  var ngaNC = function (o) { return !!PT_NGA[ten[o]]; }, tenDV = function (o) { return ptTenTu_(d, o); };
  // 1. Thông tin chung: ĐV Mệnh phi Tứ Hóa nhập cung nguyên cục
  var a = [];
  hoa.forEach(function (f) {
    if (f.toi == null) return; var H = PT_H[f.h], Y = ten[f.toi];
    var t = 'ĐV Mệnh (can ' + CAN[can] + ') phi Hóa ' + H + ' (' + f.sao + ') nhập ' + Y + ' nguyên cục – là ĐV.' + tenDV(f.toi);
    var m = ptMucK_(t, ['dv|nhap|' + H + '|' + Y, 'dv|nhap|' + H + '|*'], ptLv_(Y), null, 1);
    if (m && (H === 'Quyền' || H === 'Khoa') && !ngaNC(f.toi)) m.cc.push(H + ' vào tha cung (' + Y + ') – ' + H + ' xuất, cộng hưởng yếu.');
    ptDay_(a, m);
  });
  if (ck && ck.cung[d]) a.unshift(ck.cung[d]);
  // 2. Tứ hóa nhập xuất: hồi quy, phản cung
  var b = [], L = hoa[0].toi, K = hoa[3].toi, tamHop = N.tamHop, daHQ = {};
  ['Mệnh', 'Tài Bạch', 'Quan Lộc'].forEach(function (X) {
    var u = ptO_(d, X), lc = ptHoa_(tv, P[u].can)[0];
    if (lc.toi != null && tamHop.indexOf(lc.toi) >= 0 && lc.toi !== N.o[X]) {
      var dich = ten[lc.toi]; if (daHQ[dich]) return; daHQ[dich] = 1;
      ptDay_(b, ptMucK_('Hồi quy: Lộc của ĐV.' + X + ' (' + lc.sao + ') về ' + dich + ' nguyên cục', ['dv|hoiQuy|' + dich], ptLv_(dich)));
    }
  });
  if (tamHop.indexOf(d) >= 0) {
    if (L != null && tamHop.indexOf(L) >= 0) ptDay_(b, ptMucK_('Phản cung Lộc: tam hợp vận trùng tam hợp gốc, Lộc vận vào ' + ten[L], ['dv|phanCung|Lộc'], ptLv_(ten[L])));
    if (K != null && tamHop.indexOf(K) >= 0) ptDay_(b, ptMucK_('Phản cung Kỵ: tam hợp vận trùng tam hợp gốc, Kỵ vận vào ' + ten[K], ['dv|phanCung|Kỵ'], ptLv_(ten[K])));
  }
  // 3. Phi hóa tha – ngã cung (cặp Lộc – Kỵ của ĐV Mệnh, đọc theo bàn nguyên cục)
  var c = [];
  if (L != null && K != null) {
    var lN = ngaNC(L), kN = ngaNC(K), kXN = ngaNC(ptD_(K)), mau = null;
    if (L === K && lN) mau = 'LocTheoKyVeNga'; else if (!lN && kN) mau = 'LocTha_KyNga'; else if (lN && kXN) mau = 'LocNga_KyXungNga';
    else if (!lN && kXN) mau = 'LocTha_KyXungNga'; else if (!lN && !kN) mau = 'PhiThaTieuHao';
    if (mau) ptDay_(c, ptMucK_('Lộc vận vào ' + ten[L] + ' (' + (lN ? 'ngã' : 'tha') + ' cung), Kỵ vận vào ' + ten[K] + ' (' + (kN ? 'ngã' : 'tha') + ' cung, xung ' + ten[ptD_(K)] + ')', ['dv|thaNga|' + mau], ''));
    var LT = ten[L], KT = ten[K], cap = LT === 'Tài Bạch' && KT === 'Nô Bộc' ? 'Lộc_TaiBach|Kỵ_NoBoc' : LT === 'Mệnh' && KT === 'Phu Thê' ? 'Lộc_Mệnh|Kỵ_PhuThe' : !lN && KT === 'Phu Thê' ? 'Lộc_Tha|Kỵ_PhuThe' : null;
    if (cap) ptDay_(c, ptMucK_('Cặp Lộc – Kỵ của cung vận: Lộc ' + LT + ', Kỵ ' + KT, ['dv|cap|' + cap], ''));
  }
  // 4. Trùng điệp năm sinh – đại vận
  var e = [];
  hoa.forEach(function (f) {
    N.sn.forEach(function (s) {
      if (s.sao !== f.sao || f.toi == null) return;
      ptDay_(e, ptMucK_('Hóa ' + PT_H[s.h] + ' năm sinh (' + s.sao + ', ở ' + ten[f.toi] + ') trùng Hóa ' + PT_H[f.h] + ' đại vận', ['dv|trung|' + PT_H[s.h] + '|' + PT_H[f.h]], ptLv_(ten[f.toi])));
    });
  });
  // 5. Thể – Dụng, M chất
  var TD = ptTheDung_(N, tv, N.o['Mệnh'], d, 'dv', snO);
  var g = [];
  PT_CUNG.forEach(function (X) {
    var u = ptO_(d, X); if (!snO[u]) return;
    snO[u].forEach(function (H) { ptDay_(g, ptMucK_('Đại vận ' + X + ' có M chất (chồng lên ' + ten[u] + ' gốc có Hóa ' + H + ' năm sinh)', ['dv|mchat|' + H], ptLv_(X))); });
    if (snO[N.o[X]]) ptDay_(g, ptMucK_('Bản mệnh ' + X + ' và đại vận ' + X + ' cùng có M chất', ['dv|mchatTrung|2tang'], ptLv_(X)));
  });
  var h = TD.dong.slice().sort(function (x, y) { return y.sao4 - x.sao4; }).map(function (x) { return ptDongMuc_(x, 'dv', 'thiên bàn', 'ĐV'); }).filter(Boolean);
  // 6. Kinh nghiệm Bắc phái: phi phục tam điểm
  var k = [];
  for (var i = 0; i < 12; i++) [0, 3].forEach(function (hh) {
    var f = N.phi[i][hh]; if (f.toi == null || f.toi === i) return;
    if (f.toi === d) ptDay_(k, ptMucK_(ten[i] + ' nguyên cục phi ' + PT_H[hh] + ' (' + f.sao + ') vào ' + ten[d] + ' – cung đại vận đang tới', ['dv|phiPhuc|' + PT_H[hh]], ptLv_(ten[i])));
  });
  if (ck && ck.tuyen) ck.tuyen(d).forEach(function (m) { ptDay_(k, m); });
  var tong = ptTongLuan_(TD.diem, 'dv');
  var phan = [];
  if (a.length) phan.push({ ten: '1. Thông tin chung – Mệnh vận phi Tứ Hóa', muc: a });
  if (b.length) phan.push({ ten: '2. Tứ Hóa nhập xuất – hồi quy, phản cung', muc: b });
  if (c.length) phan.push({ ten: '3. Phi hóa tha – ngã cung', muc: c });
  if (e.length) phan.push({ ten: 'Trùng điệp Tứ Hóa năm sinh – đại vận', muc: e });
  if (g.length) phan.push({ ten: 'M chất bản mệnh và đại vận', muc: g });
  if (h.length) phan.push({ ten: 'Thể – Dụng: Lộc, Quyền, Khoa nhập/chiếu; Kỵ nhập/xung; quy vị', muc: h });
  if (k.length) phan.push({ ten: 'Kinh nghiệm Bắc phái', muc: k });
  return { o: d, trung: TD.trung, menh: ten[d], can: CAN[can], chi: CHI[d], hoa: hoa.map(function (f) { return { h: PT_H[f.h], sao: f.sao, cung: f.toi == null ? null : ten[f.toi] }; }), phan: phan, tong: tong };
}

/* ---------- Vận năm (Thể = đại vận, Dụng = lưu niên) ---------- */
function ptNamBai_(N, tv, y, dvO) {
  var P = N.P, ten = N.ten, m = ((y + 8) % 12 + 12) % 12, can = ((y + 6) % 10 + 10) % 10, hoa = ptHoa_(tv, can), snO = ptSnO_(N), phan = [];
  var dvHoa = dvO != null ? ptHoa_(tv, P[dvO].can) : [];
  var a = [];
  hoa.forEach(function (f) {
    if (f.toi == null) return; var H = PT_H[f.h], tDV = dvO != null ? ptTenTu_(dvO, f.toi) : null, tLN = ptTenTu_(m, f.toi);
    var t = 'Hóa ' + H + ' năm ' + y + ' (can ' + CAN[can] + ', ' + f.sao + ') nhập ' + (tDV ? 'ĐV.' + tDV + ' (' : '') + 'LN.' + tLN + (tDV ? ')' : '') + ', nguyên cục ' + ten[f.toi];
    var mm = H === 'Lộc' || H === 'Kỵ' ? ptMucK_(t, ['nam|nhap|' + H + '|*'], ptLv_(tDV || tLN), null, 1) : ptMucTu_(t, '', '', ptLv_(tDV || tLN), 'trung', true);
    if (mm) {
      var thang = ptTamDiem_(f.toi).map(ptThangCuaChi_);
      if (H === 'Lộc' || H === 'Kỵ') mm.cc.push('Ứng kỳ theo tam điểm (' + ptTamDiem_(f.toi).map(function (o) { return CHI[o]; }).join(', ') + '): tháng âm ' + thang.join(', ') + '.');
      ptDay_(a, mm);
    }
  });
  // Lộc gặp Kỵ / Song Kỵ / Hư lộc của năm
  var b = [], kyO = {}; N.sn.concat(dvHoa).forEach(function (f) { if (f.h === 3 && f.toi != null) kyO[f.toi] = 1; });
  var L = hoa[0].toi, K = hoa[3].toi, thM = [m, (m + 4) % 12, (m + 8) % 12];
  if (L != null && kyO[L]) ptDay_(b, ptMucK_('Lộc năm rơi vào ' + ten[L] + ' – nơi đã có Kỵ (năm sinh/đại vận)', ['mau|Lộc gặp Kỵ'], ptLv_(ptTenTu_(m, L))));
  if (K != null && kyO[K]) ptDay_(b, ptMucK_('Kỵ năm chồng lên Kỵ tầng khác ở ' + ten[K], ['mau|Song Kỵ'], ptLv_(ptTenTu_(m, K))));
  if (L != null && thM.indexOf(L) < 0 && !PT_NGA[ptTenTu_(m, L)]) ptDay_(b, ptMucK_('Lộc năm bay ra tha cung (LN.' + ptTenTu_(m, L) + '), không vào tam hợp Mệnh năm', ['mau|Hư lộc'], ''));
  // M chất ba tầng
  PT_CUNG.forEach(function (X) {
    var uN = N.o[X], uD = dvO != null ? ptO_(dvO, X) : null, uL = ptO_(m, X);
    if (snO[uN] && uD != null && snO[uD] && hoa.some(function (f) { return f.toi === uL; })) ptDay_(b, ptMucK_('Bản mệnh, đại vận và lưu niên ' + X + ' đều có M chất', ['dv|mchatTrung|3tang'], ptLv_(X)));
  });
  if (dvO == null) return { nam: y, can: CAN[can], chi: CHI[m], menh: ten[m], o: m, phan: [].concat(a.length ? [{ ten: 'Thông tin lưu niên', muc: a }] : [], b.length ? [{ ten: 'Mẫu Lộc – Kỵ trong năm', muc: b }] : []), tong: [], chuaVaoVan: true };
  var TD = ptTheDung_(N, tv, dvO, m, 'nam', null);
  var h = TD.dong.slice().sort(function (x, z) { return z.sao4 - x.sao4; }).map(function (x) { return ptDongMuc_(x, 'nam', 'ĐV', 'LN'); }).filter(Boolean);
  if (a.length) phan.push({ ten: 'Thông tin lưu niên – Tứ Hóa năm vào cung nào của đại vận', muc: a });
  if (b.length) phan.push({ ten: 'Mẫu Lộc – Kỵ trong năm, M chất ba tầng', muc: b });
  if (h.length) phan.push({ ten: 'Thể – Dụng giữa lưu niên và đại vận', muc: h });
  return { nam: y, trung: TD.trung, can: CAN[can], chi: CHI[m], menh: ten[m], o: m, dvMenh: ten[dvO], phan: phan, tong: ptTongLuan_(TD.diem, 'nam') };
}

/* ---------- Vận tháng (Thể = lưu niên, Dụng = nguyệt vận) ---------- */
function ptThangBai_(N, tv, y, k, mNam, nv, canThang) {
  var ten = N.ten, P = N.P, hoa = ptHoa_(tv, canThang), phan = [], canNam = ((y + 6) % 10 + 10) % 10, hoaNam = ptHoa_(tv, canNam);
  var tenLN = function (o) { return ptTenTu_(mNam, o); }, ngaLN = function (o) { return !!PT_NGA[tenLN(o)]; }, thLN = [mNam, (mNam + 4) % 12, (mNam + 8) % 12];
  var a = [];
  hoa.forEach(function (f) {
    if (f.toi == null) return; var H = PT_H[f.h], Y = tenLN(f.toi);
    var t = 'Hóa ' + H + ' tháng ' + k + ' (can ' + CAN[canThang] + ', ' + f.sao + ') nhập LN.' + Y + ' (NV.' + ptTenTu_(nv, f.toi) + ')';
    var xuat = !ngaLN(f.toi) && thLN.indexOf(f.toi) < 0;
    var m = xuat ? ptMucK_(t + ' – ' + H + ' xuất', ['thang|xuat|' + (H === 'Khoa' ? 'Quyền' : H)], ptLv_(Y), null, 1) : ptMucTu_(t, '', '', ptLv_(Y), 'trung', true);
    ptDay_(a, m);
  });
  var b = [], kyO = {};
  N.sn.concat(hoaNam).forEach(function (f) { if (f.h === 3 && f.toi != null) kyO[f.toi] = 1; });
  var L = hoa[0].toi, K = hoa[3].toi;
  if (L != null && kyO[L]) ptDay_(b, ptMucK_('Lộc tháng gặp Kỵ (năm sinh/năm) ở LN.' + tenLN(L), ['mau|Lộc gặp Kỵ'], ptLv_(tenLN(L))));
  if (K != null && kyO[K]) ptDay_(b, ptMucK_('Kỵ tháng chồng Kỵ tầng khác ở LN.' + tenLN(K), ['mau|Song Kỵ'], ptLv_(tenLN(K))));
  if (hoaNam[2].toi != null && hoaNam[2].toi === K) ptDay_(b, ptMucK_('Khoa năm gặp Kỵ tháng ở LN.' + tenLN(K), ['thang|tangTac|KhoaKy'], ptLv_(tenLN(K))));
  if (L != null && K != null && ngaLN(L) && ngaLN(K)) ptDay_(b, ptMucK_('Lộc và Kỵ tháng cùng vào ngã cung của năm (' + tenLN(L) + ', ' + tenLN(K) + ')', ['thang|tangTac|LocKyNgaGiup'], ''));
  if (L != null && K != null && !ngaLN(L) && !ngaLN(K) && ngaLN(ptD_(K)) && ngaLN(ptD_(L))) ptDay_(b, ptMucK_('Lộc và Kỵ tháng cùng từ tha cung xung ngã cung', ['thang|tangTac|PhiLocKyXungNga'], ''));
  if (L != null && thLN.indexOf(L) < 0 && !ngaLN(L)) ptDay_(b, ptMucK_('Lộc tháng là hư lộc (bay ra LN.' + tenLN(L) + ')', ['mau|Hư lộc'], ''));
  var TD = ptTheDung_(N, tv, mNam, nv, 'thang', null);
  var h = TD.dong.slice().sort(function (x, z) { return z.sao4 - x.sao4; }).map(function (x) { return ptDongMuc_(x, 'thang', 'LN', 'NV'); }).filter(Boolean);
  if (a.length) phan.push({ ten: '1–2. Thông tin chung, Tứ Hóa nhập xuất', muc: a });
  if (b.length) phan.push({ ten: '3–4. Tha – ngã cung, tương tác các tầng', muc: b });
  if (h.length) phan.push({ ten: 'Các dòng Thể – Dụng (* nhẹ → **** nặng)', muc: h });
  return { thang: k, trung: TD.trung, o: nv, menh: ten[nv], chi: CHI[nv], can: CAN[canThang], phan: phan, tong: ptTongLuan_(TD.diem, 'thang') };
}

/** Ghép cả bài theo mục lục. vy = năm xem */
function ptBai_(tv, vy) {
  var N = ptNguyenCuc_(tv), I = tv.info, P = tv.palaces, ten = N.ten, van = PT_VAN || {};
  var ck = typeof ptCungKhi_ === 'function' ? ptCungKhi_(N, tv) : null;
  var mauNC = ptMauNC_(N, tv);
  // Tổng quan
  var tq = [];
  if (ck && ck.tong) tq.push({ ten: 'Điểm xí hoa và hỉ – kỵ thần', muc: ck.tong });
  if (N.ln >= 0) {
    var X = ten[N.ln], v = (van.laiNhan || {})[X] || {};
    var lm = ptMucK_('Lai Nhân cung: ' + X + ' (' + CAN[P[N.ln].can] + ' ' + CHI[N.ln] + ')', ['laiNhan|' + X], ptLv_(X)) || ptMucTu_('Lai Nhân cung: ' + X + ' (' + CAN[P[N.ln].can] + ' ' + CHI[N.ln] + ')', v.ky, v.de, ptLv_(X), 'cat');
    if (lm) tq.push({ ten: 'Lai Nhân cung', muc: [lm] });
  }
  var dsMau = mauNC.filter(function (m) { return !m.an; }).map(function (m) { return { ten: m.khoa, cung: m.cung }; });
  var phan = [{ id: 'tq', ten: 'Tổng quan', phan: tq, mau: dsMau, gioiThieu: van.gioiThieu || {} }];
  PT_THU_TU_BAI.forEach(function (X, n) {
    phan.push(ptCungBai_(N, tv, X, mauNC, ck));
    if (n === 0) {                                                                     // Cung Thân ngay sau Mệnh
      var t = I.than, Xt = ten[t], th = [];
      ptDay_(th, ptMucK_('Thân cư ' + Xt, ['than|' + Xt], ptLv_(Xt)));
      ptSaoO_(tv, t).forEach(function (s) { ptDay_(th, ptMucK_(s + ' tại cung Thân', ['sao|' + s + '|Thân'], '')); });
      if (N.sn[3].toi === t) ptDay_(th, ptMucK_('Hóa Kỵ năm sinh tại cung Thân', ['sao|Hóa Kỵ|Thân'], ''));
      phan.push({ id: 'c-Thân', ten: 'Cung Thân', phu: 'cư ' + Xt + ' · ' + CHI[t], phan: th.length ? [{ ten: 'Thân cư cung nào, sao tại Thân', muc: th }] : [] });
    }
  });
  // Đại vận
  var dv = [];
  for (var i = 0; i < 12; i++) if (P[i].daiHan != null) {
    var b = ptDaiVanBai_(N, tv, i, ck);
    b.tuoi = P[i].daiHan; b.den = P[i].daiHan + 9; b.nay = I.tuoi >= b.tuoi && I.tuoi <= b.den;
    dv.push(b);
  }
  dv.sort(function (x, y) { return x.tuoi - y.tuoi; });
  // Vận năm + 12 tháng của năm xem
  var tuoi = vy - I.lunar.year + 1, dvO = null;
  for (var k = 0; k < 12; k++) if (P[k].daiHan != null && tuoi >= P[k].daiHan && tuoi <= P[k].daiHan + 9) dvO = k;
  var nam = ptNamBai_(N, tv, vy, dvO); nam.tuoi = tuoi;
  var thang = [];
  if (typeof ptMenhThang_ === 'function') {
    var mNam = ((vy + 8) % 12 + 12) % 12;
    for (var t2 = 1; t2 <= 12; t2++) { var q = ptMenhThang_(tv, vy, t2); if (q) thang.push(ptThangBai_(N, tv, vy, t2, mNam, q.o, q.can)); }
  }
  // Phụ lục: chính tinh và cách cục tại Mệnh
  var pl = [], mO = N.o['Mệnh'];
  (P[mO].chinh || []).forEach(function (s) { ptDay_(pl, ptMucK_(s.n + ' tại Mệnh', ['sao|' + s.n + '|Mệnh'], 'chính mình')); });
  if (!(P[mO].chinh || []).length) ptDay_(pl, ptMucK_('Mệnh vô chính diệu', ['sao|Vô chính diệu|Mệnh'], 'chính mình'));
  ptCach_(N, tv).forEach(function (c) { ptDay_(pl, ptMucK_('Cách ' + c, ['cach|' + c], 'chính mình')); });
  var thangGhiChu = thang.length ? 'Mệnh tháng an theo Đẩu quân (tháng Giêng ở ' + CHI[ptMenhThang_(tv, vy, 1).o] + ', các tháng sau đi thuận); Tứ Hóa tháng lấy can của cung nơi Mệnh tháng đóng.' : '';
  return { phan: phan, daiVan: dv, nam: nam, thang: thang, thangGhiChu: thangGhiChu, phuLuc: pl, namXem: vy };
}
