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
  "de": "Đây là một cách xem hiện đại, hình thành ở Đài Loan vài chục năm gần đây, tập trung vào dòng chảy của sự quan tâm, cơ hội và trách nhiệm giữa các mảng đời sống như bản thân, tiền bạc, công việc, gia đình và các mối quan hệ. Thay vì tả tính cách chung chung, nó cho thấy bạn dễ có duyên ở đâu và hay để tâm, bỏ công vào đâu. Nơi bạn để tâm nhiều không phải là điều xấu, đó thường là nơi bạn gắn bó nhất. Mọi điều dưới đây chỉ là xu hướng để tham khảo, không phải định mệnh; cách bạn chọn sống mới quyết định kết quả."
 },
 "snToa": {
  "Lộc": {
   "Mệnh": {
    "ky": "Hóa Lộc năm sinh ngồi Mệnh: duyên lành tiên thiên (có sẵn từ lúc sinh) đặt ở chính bản thân, chủ đầu óc linh hoạt, dễ gần, tinh thần thường vui.",
    "de": "Bạn thuộc mẫu người dễ gần, linh hoạt và thường giữ được tinh thần vui vẻ. Hãy dùng sự cởi mở ấy để chủ động kết nối, mở ra cơ hội cho chính mình."
   },
   "Huynh Đệ": {
    "ky": "Hóa Lộc năm sinh ngồi Huynh Đệ: có duyên với anh chị em, bạn đồng trang lứa; Huynh Đệ còn là ‘kho nhỏ’ của tiền bạc (Điền Trạch của Tài Bạch) nên chủ tích góp khá.",
    "de": "Bạn có xu hướng hợp với anh chị em, bạn bè cùng lứa và có khả năng tích góp từ những khoản nhỏ. Hãy giữ liên lạc đều với người thân và duy trì một khoản để dành hằng tháng."
   },
   "Phu Thê": {
    "ky": "Hóa Lộc năm sinh ngồi Phu Thê: tình duyên sâu, người phối ngẫu chu đáo, hai bên có duyên với nhau.",
    "de": "Bạn có xu hướng gặp được người bạn đời chu đáo và có tình cảm sâu đậm. Hãy nuôi dưỡng mối quan hệ bằng sự ghi nhận và lời cảm ơn mỗi ngày."
   },
   "Tử Tức": {
    "ky": "Hóa Lộc năm sinh ngồi Tử Tức: gần gũi con cái, người nhỏ tuổi; Tử Tức cũng là cung hợp tác nên chủ làm ăn chung thuận.",
    "de": "Bạn có xu hướng gần gũi con trẻ, người nhỏ tuổi và làm việc chung khá thuận. Hãy dành thời gian chất lượng cho người nhỏ tuổi và chọn đối tác cùng chí hướng để phát huy."
   },
   "Tài Bạch": {
    "ky": "Hóa Lộc năm sinh ngồi Tài Bạch: có duyên với tiền mặt, kiếm tiền tương đối nhẹ nhàng.",
    "de": "Bạn có xu hướng kiếm tiền tương đối nhẹ nhàng, dòng tiền thường dễ chịu. Hãy biến cái thuận này thành tài sản bền bằng thói quen để dành và đầu tư có kế hoạch."
   },
   "Tật Ách": {
    "ky": "Hóa Lộc năm sinh ngồi Tật Ách: ở Bắc phái, Tật Ách chỉ thân thể, nhịp sống và môi trường quanh mình; Lộc ở đây chủ thể lực có phúc, nơi sống và làm việc dễ chịu.",
    "de": "Bạn có xu hướng có sức bền tốt và dễ tạo được không gian sống, làm việc dễ chịu. Hãy giữ nếp vận động và ngủ nghỉ đều để nền tảng ấy bền lâu."
   },
   "Thiên Di": {
    "ky": "Hóa Lộc năm sinh ngồi Thiên Di: ra ngoài dễ gặp quý nhân (người giúp đỡ), ứng xử tròn trịa, được xã hội đón nhận.",
    "de": "Bạn có xu hướng ra ngoài dễ gặp người giúp đỡ và ứng xử khéo léo. Hãy mạnh dạn mở rộng giao thiệp, đi xa và học hỏi ở môi trường mới."
   },
   "Nô Bộc": {
    "ky": "Hóa Lộc năm sinh ngồi Nô Bộc: nhiều bạn tốt, cộng sự hợp ý, cạnh tranh thuận lợi.",
    "de": "Bạn có xu hướng có nhiều bạn tốt và làm việc nhóm thuận lợi. Hãy vun đắp mạng lưới ấy bằng sự tử tế có qua có lại."
   },
   "Quan Lộc": {
    "ky": "Hóa Lộc năm sinh ngồi Quan Lộc: công việc có duyên, dễ gặp thời, sự nghiệp thuận.",
    "de": "Bạn có xu hướng thuận lợi trong công việc và dễ gặp việc hợp với mình. Hãy đặt mục tiêu nghề nghiệp rõ ràng để cái thuận ấy đưa bạn đi xa hơn."
   },
   "Điền Trạch": {
    "ky": "Hóa Lộc năm sinh ngồi Điền Trạch: gia đình hòa thuận, nơi ở dễ chịu; Điền Trạch là ‘kho’ của Tài Bạch nên cũng chủ có chỗ tích lũy.",
    "de": "Bạn có xu hướng có gia đình êm ấm và nơi ở dễ chịu. Hãy đầu tư cho tổ ấm và tích lũy tài sản dài hạn từng bước."
   },
   "Phúc Đức": {
    "ky": "Hóa Lộc năm sinh ngồi Phúc Đức: Phúc Đức chỉ đời sống tinh thần và phúc phần; Lộc ở đây chủ tâm an, biết đủ, dễ vui với điều nhỏ.",
    "de": "Bạn thuộc mẫu người biết đủ và có tâm tương đối an. Hãy nuôi dưỡng sở thích lành mạnh và những khoảng tĩnh lặng để giữ sự bình an ấy."
   },
   "Phụ Mẫu": {
    "ky": "Hóa Lộc năm sinh ngồi Phụ Mẫu: có duyên với cha mẹ, người trên, cấp trên; uy tín và giấy tờ thuận.",
    "de": "Bạn có xu hướng được người trên quý mến và có uy tín. Hãy giữ chữ tín và chăm học hỏi từ người đi trước để nhận thêm cơ hội."
   }
  },
  "Quyền": {
   "Mệnh": {
    "ky": "Hóa Quyền năm sinh ngồi Mệnh: Quyền là sức nắm giữ, thành tựu; ở Mệnh chủ người có chủ kiến, năng lực tự quyết, muốn làm chủ việc của mình.",
    "de": "Bạn thuộc mẫu người có chủ kiến, dám quyết và muốn tự làm chủ. Hãy phát huy bằng cách nhận vai dẫn dắt, đồng thời lắng nghe để quyết định được lòng người."
   },
   "Huynh Đệ": {
    "ky": "Hóa Quyền năm sinh ngồi Huynh Đệ: giữ vai đầu tàu giữa anh chị em, bạn đồng trang lứa; với ‘kho nhỏ’ tiền bạc thì quản lý chặt.",
    "de": "Bạn có xu hướng giữ vai trò đầu tàu giữa anh chị em, bạn cùng lứa và quản lý khoản tích góp khá chặt. Hãy dùng sự quyết đoán ấy để vun vén chung, đồng thời để mọi người cùng góp ý khi bàn việc."
   },
   "Phu Thê": {
    "ky": "Hóa Quyền năm sinh ngồi Phu Thê: người phối ngẫu có năng lực, mạnh mẽ, có tiếng nói trong nhà.",
    "de": "Bạn có xu hướng gắn bó với người bạn đời có năng lực và chủ kiến. Hãy chia vai rõ ràng để cả hai cùng phát huy thế mạnh của mình."
   },
   "Tử Tức": {
    "ky": "Hóa Quyền năm sinh ngồi Tử Tức: kỳ vọng cao và nghiêm với con cái, người nhỏ tuổi; việc hợp tác có sức bật.",
    "de": "Bạn có xu hướng đặt kỳ vọng cao với người nhỏ tuổi và làm việc chung có sức bật. Hãy khuyến khích con trẻ tự quyết từng phần và trao đổi rõ vai trò với người cùng làm."
   },
   "Tài Bạch": {
    "ky": "Hóa Quyền năm sinh ngồi Tài Bạch: kiếm tiền bằng năng lực, dám làm lớn, muốn nắm chủ động dòng tiền.",
    "de": "Bạn có xu hướng kiếm tiền bằng năng lực và dám làm lớn. Hãy phát huy với một kế hoạch tài chính rõ ràng và mức an toàn trước khi mở rộng."
   },
   "Tật Ách": {
    "ky": "Hóa Quyền năm sinh ngồi Tật Ách: thể lực và sức làm việc mạnh, thích tự tay xử lý mọi việc.",
    "de": "Bạn có xu hướng có sức làm việc mạnh và thích tự tay xử lý. Hãy dồn năng lượng ấy vào vận động đều đặn và nhớ nghỉ đúng lúc."
   },
   "Thiên Di": {
    "ky": "Hóa Quyền năm sinh ngồi Thiên Di: ra ngoài thể hiện năng lực tốt, có sức ảnh hưởng, dễ được nể trọng.",
    "de": "Bạn có xu hướng thể hiện năng lực tốt khi ra bên ngoài và dễ được nể trọng. Hãy nhận những việc cần đi lại, giao thiệp để tỏa sáng."
   },
   "Nô Bộc": {
    "ky": "Hóa Quyền năm sinh ngồi Nô Bộc: bạn bè, cộng sự giỏi giang, có tiếng nói; nếu không phân vai rõ thì dễ bị lấn tiếng.",
    "de": "Bạn có xu hướng có bạn bè, đồng nghiệp giỏi giang và có tiếng nói. Hãy hợp tác với họ trên tinh thần tôn trọng và phân vai rõ để cùng đi xa."
   },
   "Quan Lộc": {
    "ky": "Hóa Quyền năm sinh ngồi Quan Lộc: năng lực chuyên môn mạnh, muốn nắm vai trò chính trong công việc.",
    "de": "Bạn thuộc mẫu người có năng lực chuyên môn và muốn giữ vai trò chính trong công việc. Hãy hướng tới vị trí quản lý hoặc tự chủ, đồng thời rèn thêm kỹ năng phối hợp."
   },
   "Điền Trạch": {
    "ky": "Hóa Quyền năm sinh ngồi Điền Trạch: làm chủ việc nhà, quyết đoán trong chuyện nhà cửa và tài sản.",
    "de": "Bạn có xu hướng làm chủ chuyện nhà và quyết đoán trong việc xây dựng tổ ấm. Hãy lên kế hoạch tài sản dài hạn và bàn bạc cùng người nhà trước khi quyết."
   },
   "Phúc Đức": {
    "ky": "Hóa Quyền năm sinh ngồi Phúc Đức: ý chí mạnh, theo đuổi sở thích và niềm tin của mình đến cùng.",
    "de": "Bạn có xu hướng có ý chí mạnh và theo đuổi điều mình thích đến cùng. Hãy đặt năng lượng ấy vào một mục tiêu tinh thần dài hạn như học một môn hay rèn một kỹ năng."
   },
   "Phụ Mẫu": {
    "ky": "Hóa Quyền năm sinh ngồi Phụ Mẫu: người trên nghiêm khắc nhưng có sức đỡ; học hành, giấy tờ làm có bài bản.",
    "de": "Bạn có xu hướng có người trên nghiêm khắc nhưng sẵn lòng nâng đỡ, và làm việc giấy tờ, học hành có bài bản. Hãy tận dụng sự dìu dắt ấy và chủ động trao đổi thẳng thắn với người trên."
   }
  },
  "Khoa": {
   "Mệnh": {
    "ky": "Hóa Khoa năm sinh ngồi Mệnh: Khoa là lý trí, hòa hoãn và tiếng tốt; ở Mệnh chủ người điềm đạm, giữ được hình ảnh đứng đắn.",
    "de": "Bạn thuộc mẫu người điềm đạm, lý trí và giữ được hình ảnh đứng đắn. Hãy phát huy bằng việc học hỏi và chia sẻ kiến thức để tạo uy tín."
   },
   "Huynh Đệ": {
    "ky": "Hóa Khoa năm sinh ngồi Huynh Đệ: quan hệ với anh chị em, bạn đồng trang lứa êm đềm, lúc cần dễ được giúp.",
    "de": "Bạn có xu hướng có quan hệ êm đềm với anh chị em, bạn cùng lứa và dễ được giúp lúc cần. Hãy giữ sự tôn trọng nhẹ nhàng ấy và tích góp đều tay."
   },
   "Phu Thê": {
    "ky": "Hóa Khoa năm sinh ngồi Phu Thê: người phối ngẫu hiểu biết, nhã nhặn; tình cảm êm, ít sóng gió.",
    "de": "Bạn có xu hướng gắn bó với người bạn đời hiểu biết, nhã nhặn và có tình cảm êm đềm. Hãy cùng nhau học hỏi và trò chuyện sâu để giữ sự gắn kết."
   },
   "Tử Tức": {
    "ky": "Hóa Khoa năm sinh ngồi Tử Tức: dạy con bằng lý lẽ, kiên nhẫn; hợp tác văn minh, rõ ràng.",
    "de": "Bạn có xu hướng dạy con trẻ bằng sự kiên nhẫn và làm việc chung một cách văn minh. Hãy đầu tư cho việc học của người nhỏ tuổi và giữ thỏa thuận rõ ràng với người cùng làm."
   },
   "Tài Bạch": {
    "ky": "Hóa Khoa năm sinh ngồi Tài Bạch: quản lý tiền điềm tĩnh, thu nhập đều, kiếm tiền nhờ uy tín và chuyên môn.",
    "de": "Bạn có xu hướng quản lý tiền điềm tĩnh, thu nhập đều và có người chỉ dẫn. Hãy phát huy bằng việc học thêm kiến thức tài chính và dựa vào uy tín để kiếm tiền."
   },
   "Tật Ách": {
    "ky": "Hóa Khoa năm sinh ngồi Tật Ách: nhịp sống điều độ, gặp khó thường có người hỗ trợ đúng lúc.",
    "de": "Bạn có xu hướng giữ được nhịp sống điều độ và gặp khó thường có người hỗ trợ. Hãy duy trì lịch sinh hoạt đều đặn để giữ phong độ lâu dài."
   },
   "Thiên Di": {
    "ky": "Hóa Khoa năm sinh ngồi Thiên Di: ra ngoài để lại ấn tượng tốt, có tiếng thơm, dễ gặp người chỉ đường.",
    "de": "Bạn có xu hướng để lại ấn tượng tốt và có tiếng thơm khi ra ngoài. Hãy chăm chút hình ảnh nghề nghiệp và mạng lưới quen biết của mình."
   },
   "Nô Bộc": {
    "ky": "Hóa Khoa năm sinh ngồi Nô Bộc: bạn bè lịch sự, đáng tin, sẵn lòng góp ý và chỉ dẫn.",
    "de": "Bạn có xu hướng có bạn bè lịch sự, đáng tin và sẵn lòng chỉ dẫn. Hãy giữ những mối quan hệ chất lượng này bằng sự chân thành."
   },
   "Quan Lộc": {
    "ky": "Hóa Khoa năm sinh ngồi Quan Lộc: làm việc có nề nếp, dễ được ghi nhận về chuyên môn, danh tiếng nghề nghiệp tốt.",
    "de": "Bạn có xu hướng làm việc có nề nếp và dễ được ghi nhận về chuyên môn. Hãy đầu tư cho bằng cấp, chứng chỉ hoặc tên tuổi nghề nghiệp."
   },
   "Điền Trạch": {
    "ky": "Hóa Khoa năm sinh ngồi Điền Trạch: nếp nhà nền nã, nơi ở ngăn nắp, yên ổn.",
    "de": "Bạn có xu hướng có nếp nhà nền nã và nơi ở ngăn nắp, yên ổn. Hãy giữ nếp nhà ấy và tích lũy tài sản theo kế hoạch đều đặn."
   },
   "Phúc Đức": {
    "ky": "Hóa Khoa năm sinh ngồi Phúc Đức: đời sống tinh thần thanh nhã, biết điều tiết cảm xúc.",
    "de": "Bạn thuộc mẫu người có đời sống tinh thần thanh nhã và biết điều tiết cảm xúc. Hãy nuôi dưỡng điều đó bằng đọc sách, nghệ thuật hoặc những phút tĩnh tâm."
   },
   "Phụ Mẫu": {
    "ky": "Hóa Khoa năm sinh ngồi Phụ Mẫu: thuận học hành, thi cử, giấy tờ; được người trên nâng đỡ.",
    "de": "Bạn có xu hướng thuận lợi trong học hành, thi cử, giấy tờ và được người trên nâng đỡ. Hãy tiếp tục học tập suốt đời và giữ hồ sơ ngăn nắp."
   }
  },
  "Kỵ": {
   "Mệnh": {
    "ky": "Hóa Kỵ năm sinh ngồi Mệnh: Kỵ là nơi để tâm, chấp giữ và phải bỏ công, không đồng nghĩa với xấu; ở Mệnh chủ người kiên định đến mức có lúc cố chấp, giao tiếp tốn sức.",
    "de": "Bạn có xu hướng kiên định, đã nghĩ là theo đến cùng, nên đôi khi giao tiếp tốn nhiều sức. Thử hỏi thêm một ý kiến khác trước khi chốt việc lớn sẽ giúp bạn nhẹ nhàng hơn."
   },
   "Huynh Đệ": {
    "ky": "Hóa Kỵ năm sinh ngồi Huynh Đệ: để tâm nhiều tới anh chị em, bạn đồng trang lứa; việc góp chung cần nhiều công, ‘kho nhỏ’ tiền bạc phải vun vén.",
    "de": "Bạn có xu hướng để tâm nhiều đến anh chị em, bạn cùng lứa và việc góp chung thường cần nhiều công. Rõ ràng phần ai nấy làm và giữ một khoản tích lũy riêng sẽ giúp mọi thứ êm hơn."
   },
   "Phu Thê": {
    "ky": "Hóa Kỵ năm sinh ngồi Phu Thê: đặt nhiều tâm sức và trách nhiệm vào hôn nhân, có xu hướng lập gia đình trước rồi mới lập nghiệp.",
    "de": "Bạn có xu hướng đặt nhiều tâm sức và trách nhiệm vào chuyện lứa đôi. Cho nhau khoảng riêng và nói ra mong muốn sớm sẽ giúp tình cảm không thành áp lực."
   },
   "Tử Tức": {
    "ky": "Hóa Kỵ năm sinh ngồi Tử Tức: nhiều trách nhiệm với con cái, người nhỏ tuổi; việc hợp tác dễ thay đổi.",
    "de": "Bạn có xu hướng mang nhiều trách nhiệm với con trẻ và việc làm chung dễ thay đổi. Tin để người nhỏ tuổi tự lập dần và thỏa thuận rõ ràng với người cùng làm sẽ giúp bạn nhẹ lòng hơn."
   },
   "Tài Bạch": {
    "ky": "Hóa Kỵ năm sinh ngồi Tài Bạch: để tâm nhiều tới tiền, dòng tiền cần quản chặt, phải bỏ công mới có thu.",
    "de": "Bạn có xu hướng để tâm nhiều về tiền và phải bỏ công mới có thu nhập. Lập ngân sách đơn giản và một quỹ dự phòng sẽ giúp bạn bớt lo."
   },
   "Tật Ách": {
    "ky": "Hóa Kỵ năm sinh ngồi Tật Ách: khó ngồi yên, dễ làm quá sức; cần giữ nhịp làm và nghỉ đều.",
    "de": "Bạn có xu hướng làm quá sức vì khó ngồi yên. Đặt lịch nghỉ cố định như một cuộc hẹn với chính mình sẽ giúp bạn đi đường dài."
   },
   "Thiên Di": {
    "ky": "Hóa Kỵ năm sinh ngồi Thiên Di (xung Mệnh): tính thẳng, hay bôn ba, ra ngoài không phải lúc nào cũng suôn sẻ.",
    "de": "Bạn có xu hướng sống thẳng thắn, hay phải đi lại và ra ngoài không phải lúc nào cũng suôn sẻ. Chuẩn bị kỹ trước mỗi chuyến đi, mỗi cuộc gặp và luyện cách nói mềm sẽ giúp mọi việc trơn tru hơn."
   },
   "Nô Bộc": {
    "ky": "Hóa Kỵ năm sinh ngồi Nô Bộc: dễ bị cuốn vào chuyện của bạn bè, cộng sự; càng cho đi có chừng mực càng nhẹ.",
    "de": "Bạn có xu hướng dễ bị cuốn vào chuyện của bạn bè, đồng nghiệp. Giúp người trong sức mình và biết nói ‘không’ nhẹ nhàng sẽ giữ được tình bạn lâu dài."
   },
   "Quan Lộc": {
    "ky": "Hóa Kỵ năm sinh ngồi Quan Lộc: coi công việc là trách nhiệm nặng, việc gì cũng muốn tự làm.",
    "de": "Bạn thuộc mẫu người coi công việc là trách nhiệm lớn, việc gì cũng muốn tự làm. Học cách giao việc và chia nhỏ mục tiêu sẽ giúp bạn bớt căng thẳng."
   },
   "Điền Trạch": {
    "ky": "Hóa Kỵ năm sinh ngồi Điền Trạch: gánh nhiều việc nhà, lo toan cho gia đình và chỗ ở.",
    "de": "Bạn có xu hướng gánh nhiều việc nhà và lo toan cho gia đình. Chia sẻ việc nhà với các thành viên và giữ nơi ở thoáng, sáng, gọn gàng sẽ giúp tâm trạng nhẹ hơn."
   },
   "Phúc Đức": {
    "ky": "Hóa Kỵ năm sinh ngồi Phúc Đức: hay lo nghĩ, kỹ tính, khó thảnh thơi (xung Tài Bạch nên cũng hay lo chuyện tiền).",
    "de": "Bạn có xu hướng suy nghĩ nhiều, kỹ tính và khó thảnh thơi. Viết ra điều đang lo và dành thời gian cho một sở thích nhẹ nhàng sẽ giúp đầu óc thư thái."
   },
   "Phụ Mẫu": {
    "ky": "Hóa Kỵ năm sinh ngồi Phụ Mẫu: duyên với người trên cần vun đắp, phải cẩn thận giấy tờ, hợp đồng liên quan tiền bạc.",
    "de": "Bạn có xu hướng phải tự nỗ lực nhiều hơn là chờ người trên nâng đỡ, và cần để tâm tới giấy tờ. Chủ động trao đổi với cấp trên và đọc kỹ mọi văn bản trước khi ký sẽ giúp bạn vững vàng."
   }
  }
 },
 "laiNhan": {
  "Mệnh": {
   "ky": "Lai Nhân cung (cung có thiên can trùng can năm sinh, nơi phát ra Tứ Hóa năm sinh, tức ‘lý do đến với đời này’) ở Mệnh: tự làm chủ, thành bại do chính mình.",
   "de": "Bạn thuộc mẫu người tự làm chủ cuộc đời, thành hay bại phần lớn do chính mình. Chủ động gây dựng quan hệ và bớt cố chấp sẽ giúp con đường của bạn rộng hơn."
  },
  "Huynh Đệ": {
   "ky": "Lai Nhân cung ở Huynh Đệ: động lực đời này đến từ quan hệ với mẹ, anh chị em, bạn đồng trang lứa; hợp kiểu làm ăn chung.",
   "de": "Bạn có xu hướng lấy động lực từ anh chị em, bạn bè cùng lứa và hợp với việc làm cùng nhau. Hãy chọn người cùng chí hướng và thỏa thuận rõ ràng ngay từ đầu."
  },
  "Phu Thê": {
   "ky": "Lai Nhân cung ở Phu Thê: coi trọng tình cảm, gắn bó lứa đôi; cảm xúc dễ bị ảnh hưởng bởi sự lạnh nhạt của người kia.",
   "de": "Bạn có xu hướng coi tình cảm lứa đôi là điều quan trọng nhất, và dễ chạnh lòng khi người kia lạnh nhạt. Nuôi dưỡng niềm vui riêng bên cạnh tình yêu sẽ giúp bạn vững vàng hơn."
  },
  "Tử Tức": {
   "ky": "Lai Nhân cung ở Tử Tức: mong gia đình trọn vẹn, gần gũi người nhỏ tuổi, thích hợp tác.",
   "de": "Bạn có xu hướng mong một gia đình trọn vẹn và thích gần gũi người nhỏ tuổi, thích làm việc cùng người khác. Hãy dành thời gian cho con trẻ và chọn đối tác tin cậy để phát huy."
  },
  "Tài Bạch": {
   "ky": "Lai Nhân cung ở Tài Bạch: nhạy với tiền và thị trường, coi trọng sự đủ đầy; dễ tự trách khi chưa đạt mục tiêu tài chính.",
   "de": "Bạn có xu hướng nhạy bén với tiền bạc và coi trọng sự đủ đầy. Đặt mục tiêu tài chính vừa sức và ghi nhận từng bước tiến sẽ giúp bạn bớt tự trách."
  },
  "Tật Ách": {
   "ky": "Lai Nhân cung ở Tật Ách: thích tự tay làm, dồn sức vào việc; cần chú ý nhịp làm và nghỉ.",
   "de": "Bạn thuộc mẫu người thích tự tay làm mọi việc. Giữ nhịp làm và nghỉ cân bằng sẽ giúp bạn bền sức trên đường dài."
  },
  "Thiên Di": {
   "ky": "Lai Nhân cung ở Thiên Di: quan tâm hình ảnh bên ngoài, dám đi xa; gặp bế tắc thì mở rộng ra ngoài sẽ có lợi.",
   "de": "Bạn có xu hướng chú ý hình ảnh bên ngoài và dám đi xa. Khi thấy bế tắc, hãy thử mở rộng ra môi trường mới, đi xa hoặc gặp gỡ người mới."
  },
  "Nô Bộc": {
   "ky": "Lai Nhân cung ở Nô Bộc: đặt bạn bè lên trước, khó từ chối người khác; cần cân bằng với gia đình.",
   "de": "Bạn có xu hướng đặt bạn bè lên trước và khó từ chối người khác. Dành lịch cố định cho gia đình và tập từ chối nhẹ nhàng sẽ giúp bạn cân bằng."
  },
  "Quan Lộc": {
   "ky": "Lai Nhân cung ở Quan Lộc: coi trọng mục tiêu sự nghiệp, cần lịch làm việc đầy đủ; dễ nản khi vấp váp.",
   "de": "Bạn có xu hướng coi sự nghiệp là động lực chính và thích lịch làm việc kín. Chia mục tiêu lớn thành từng chặng nhỏ sẽ giúp bạn giữ lửa khi gặp vấp váp."
  },
  "Điền Trạch": {
   "ky": "Lai Nhân cung ở Điền Trạch: hướng về gia đình, sự ủng hộ của người nhà là động lực; dễ lập gia đình sớm.",
   "de": "Bạn có xu hướng hướng về gia đình và lấy sự ủng hộ của người nhà làm động lực. Hãy vun đắp tổ ấm, đồng thời giữ cho mình những mục tiêu riêng."
  },
  "Phúc Đức": {
   "ky": "Lai Nhân cung ở Phúc Đức: đề cao đời sống tinh thần hơn vật chất; may mắn đến từ phúc phần.",
   "de": "Bạn thuộc mẫu người đề cao đời sống tinh thần hơn vật chất. Nuôi dưỡng tâm an và sống tử tế là cách giữ may mắn bền lâu."
  },
  "Phụ Mẫu": {
   "ky": "Lai Nhân cung ở Phụ Mẫu: ảnh hưởng của cha, người trên lớn, định hình cách hành xử và cách làm cha mẹ sau này.",
   "de": "Bạn có xu hướng chịu ảnh hưởng lớn từ cha mẹ, người trên trong cách sống. Hãy giữ lại điều tốt và tự chọn cách riêng cho những điều bạn muốn khác đi."
  }
 },
 "tuHoa": {
  "lyTam": {
   "Lộc": {
    "ky": "Tự hóa Lộc ly tâm ở mảng {lv}: can của cung làm chính sao trong cung hóa Lộc, năng lượng tỏa ra ngoài – có duyên nhưng dễ cho đi, có rồi khó giữ; nên xem tiếp cung này chuyển Kỵ về đâu để thấy kết quả.",
    "de": "Bạn có xu hướng rộng rãi, có được niềm vui hay cơ hội ở {lv} là sẵn lòng chia ra. Hãy giữ lại một phần cho mình trước khi cho đi để điều tốt được bền."
   },
   "Quyền": {
    "ky": "Tự hóa Quyền ly tâm ở mảng {lv}: sức nắm giữ bung ra ngoài, hay tự đánh giá cao và muốn thể hiện; mạnh lúc đầu nhưng khó bền.",
    "de": "Bạn có xu hướng thể hiện năng lực mạnh mẽ và muốn chứng tỏ ở {lv}. Hãy phát huy bằng mục tiêu dài hơi và đo bằng kết quả thật để sức mạnh ấy bền bỉ."
   },
   "Khoa": {
    "ky": "Tự hóa Khoa ly tâm ở mảng {lv}: lý trí và tiếng tốt tỏa ra nhẹ nhàng, có tiết chế; tiếng tốt đến nhanh nhưng cũng dễ phai nếu không vun đắp.",
    "de": "Bạn có xu hướng cư xử chừng mực và dễ tạo ấn tượng tốt ở {lv}. Hãy vun đắp uy tín đều đặn để tiếng tốt không chỉ là thoáng qua."
   },
   "Kỵ": {
    "ky": "Tự hóa Kỵ ly tâm ở mảng {lv}, còn gọi Kỵ xuất: sự chấp giữ được buông ra một cách vô tình, có rồi để trôi; không tính thêm một Kỵ, chỉ luận tượng ‘ra mà không giữ’.",
    "de": "Bạn có xu hướng để những gì thuộc {lv} trôi đi lúc nào không hay, dù không cố ý. Ghi chép, đặt nhắc nhở và xem lại định kỳ sẽ giúp bạn giữ được điều mình quý."
   }
  },
  "huongTam": {
   "Lộc": {
    "ky": "Hướng tâm Lộc ở mảng {lv}: can của cung làm sao ở cung đối diện hóa Lộc, năng lượng hướng vào trong – duyên khởi, gom tụ, được nhận về.",
    "de": "Bạn có xu hướng nhận được cơ hội và niềm vui ở {lv} từ bên ngoài tìm đến. Hãy đón nhận chủ động và đáp lại tử tế để dòng thuận lợi ấy tiếp tục."
   },
   "Quyền": {
    "ky": "Hướng tâm Quyền ở mảng {lv}: sức đẩy từ cung đối diện dồn về, được trao vai trò, được thúc tới thành tựu.",
    "de": "Bạn có xu hướng được bên ngoài trao thêm vai trò và động lực ở {lv}. Hãy nhận trách nhiệm vừa sức và chứng minh bằng kết quả cụ thể."
   },
   "Khoa": {
    "ky": "Hướng tâm Khoa ở mảng {lv}: lý trí, quý nhân (người giúp đỡ) và tiếng tốt từ cung đối diện hướng về.",
    "de": "Bạn có xu hướng được người khác nâng đỡ, góp ý đúng lúc ở {lv}. Hãy cởi mở học hỏi và ghi nhận người giúp mình để giữ những mối quan hệ quý ấy."
   },
   "Kỵ": {
    "ky": "Hướng tâm Kỵ ở mảng {lv}: Hóa Kỵ nhập cung đối diện tức là xung ngược về chính cung (Lưu xuất Kỵ) – điều của mảng này chảy thẳng ra ngoài, khó giữ nhưng không tích nợ.",
    "de": "Bạn có xu hướng để những gì thuộc {lv} đến nhanh và đi cũng nhanh. Bạn hợp với cách làm gọn, quay vòng nhanh, và nên giữ lại một phần cố định mỗi lần có được."
   }
  }
 },
 "phi": {
  "Lộc": {
   "ky": "Mảng {A} phi Hóa Lộc nhập mảng {B}: can của cung xuất làm sao ở cung nhập hóa Lộc, nghĩa là {A} mang duyên, niềm vui tới {B} và cũng vui nhờ {B} (quan hệ hai chiều).",
   "de": "Bạn có xu hướng để những gì liên quan tới {A} mang lại niềm vui và cơ hội cho {B}. Hãy chủ động kết nối hai mảng này, vì đây là chỗ bạn dễ có duyên."
  },
  "Quyền": {
   "ky": "Mảng {A} phi Hóa Quyền nhập mảng {B}: {A} muốn nắm giữ, đẩy {B} tới thành tựu, đặt năng lực và sức quyết vào {B}.",
   "de": "Bạn có xu hướng dùng năng lực từ {A} để thúc đẩy {B}. Hãy đặt mục tiêu rõ cho {B} và lắng nghe người cùng tham gia để sức đẩy không thành áp đặt."
  },
  "Khoa": {
   "ky": "Mảng {A} phi Hóa Khoa nhập mảng {B}: {A} đối với {B} nhẹ nhàng, lý trí, có chừng mực; dễ có quý nhân và tiếng tốt ở {B}.",
   "de": "Bạn có xu hướng đối đãi với {B} bằng sự điềm tĩnh, chừng mực xuất phát từ {A}. Hãy dùng sự lý trí ấy để giữ uy tín và hóa giải những va chạm nhỏ."
  },
  "Kỵ": {
   "ky": "Mảng {A} phi Hóa Kỵ nhập mảng {B}: {A} để tâm, gắn bó và phải bỏ công cho {B}; đồng thời Kỵ ở {B} xung sang cung đối diện của {B}. Kỵ ở đây là sự gắn bó, không đồng nghĩa với xấu.",
   "de": "Bạn có xu hướng dành nhiều tâm sức từ {A} cho {B}, đó là nơi bạn gắn bó và chịu bỏ công. Đặt giới hạn thời gian và sức lực cho {B} sẽ giúp bạn cân bằng mà không thấy kiệt."
  }
 },
 "mau": {
  "luuXuat": {
   "ten": "Lưu xuất Kỵ",
   "ky": "Lưu xuất Kỵ (Kỵ chảy ra): mảng {A} phi Hóa Kỵ vào cung đối diện nên Kỵ xung ngược về chính nó – điều {A} đại diện chảy ra ngoài, khó giữ nhưng cũng không tích nợ. Nếu rơi vào Mệnh, Tài Bạch hoặc Quan Lộc thì gọi Thủy mệnh Kỵ (tính chất như nước chảy), hợp nghề dịch vụ, mua bán, nhận lương hơn là ôm hàng tồn.",
   "de": "Bạn có xu hướng để những gì thuộc {A} đến rồi đi khá nhanh, khó giữ lâu nhưng cũng ít vướng nợ. Bạn hợp với cách làm gọn, quay vòng nhanh, và nên đặt một khoản giữ lại cố định mỗi lần có thu."
  },
  "nghichThuy": {
   "ten": "Nghịch thủy Kỵ",
   "ky": "Nghịch thủy Kỵ (nước chảy ngược): mảng {A} (Mệnh, Tài Bạch hoặc Quan Lộc) có Lưu xuất Kỵ, nhưng cung đối diện đã có Hóa Kỵ năm sinh và không tự hóa, nên dòng chảy gặp ‘bức tường’ và dội ngược về thành tích tụ. Thuận cho tích lũy, hợp sản xuất, làm chuỗi; không tính là Song Kỵ.",
   "de": "Bạn có xu hướng thấy những gì bỏ ra ở {A} thường quay về và tích tụ dần. Hãy chọn con đường xây dựng từng bước, tích lũy dài hạn để tận dụng thế mạnh này."
  },
  "thuyTiet": {
   "ten": "Thủy tiết Kỵ",
   "ky": "Thủy tiết Kỵ (nước rò): đủ điều kiện Nghịch thủy Kỵ nhưng cung đối diện (nơi có Kỵ năm sinh) lại tự hóa, ‘bức tường’ bị thủng nên dòng chảy thoát đi – kiếm bao nhiêu tiêu bấy nhiêu.",
   "de": "Bạn có xu hướng có được ở {A} rồi lại chi ra gần hết. Trích một phần cố định để dành ngay khi có thu nhập là cách giữ lại hiệu quả nhất."
  },
  "nhapKho": {
   "ten": "Nhập khố Kỵ",
   "ky": "Nhập khố Kỵ (Kỵ vào kho): Hóa Kỵ năm sinh ngồi ở một trong bốn cung mộ Thìn, Tuất, Sửu, Mùi (bốn ‘kho’ theo ngũ hành) và cung đó không tự hóa, ở đây là {A}; chủ giữ của, cần mẫn, kèm ý ‘khiếm trái’ (thấy mình mắc nợ, phải đáp đền) với mảng này.",
   "de": "Bạn có xu hướng chắt chiu, cần mẫn và mang cảm giác phải đáp đền với {A}. Hãy xem đó là sự gắn bó tự nguyện, và nhớ chăm lo cho bản thân bên cạnh trách nhiệm."
  },
  "tietKho": {
   "ten": "Tiết khố Kỵ",
   "ky": "Tiết khố Kỵ (kho rò): như Nhập khố Kỵ ở {A} nhưng cung đó có tự hóa, kho bị ‘rò’ nên của gom được khó giữ.",
   "de": "Bạn có xu hướng chăm vun vén {A} nhưng thứ gom được lại dễ rò rỉ. Tách riêng một tài khoản để dành và hạn chế rút ra là cách giữ của thiết thực."
  },
  "sachMa": {
   "ten": "Sách mã Kỵ (Tứ mã Kỵ)",
   "ky": "Sách mã Kỵ hay Tứ mã Kỵ: Hóa Kỵ năm sinh ngồi ở Dần, Thân, Tị, Hợi – bốn cung ‘ngựa’ tượng di chuyển, ở đây là {A}; chủ bôn ba, với mảng này thì gặp ít xa nhiều, gần lâu dễ va chạm.",
   "de": "Bạn có xu hướng hay phải di chuyển, và với {A} thì xa nhau đôi chút lại dễ hòa hợp hơn ở sát bên. Giữ liên lạc đều khi xa và tôn trọng không gian riêng khi gần sẽ giúp mọi thứ êm ả."
  },
  "tuanHoan": {
   "ten": "Tuần hoàn Kỵ",
   "ky": "Tuần hoàn Kỵ (Kỵ đi rồi Kỵ về): {A} phi Hóa Kỵ nhập {B} và {B} phi Hóa Kỵ ngược về {A}; quan hệ có qua có lại, mình đối đãi thế nào thì bên kia đáp lại như thế.",
   "de": "Bạn có xu hướng có mối quan hệ có qua có lại giữa {A} và {B}: mình để tâm bao nhiêu thì nhận lại bấy nhiêu. Chủ động tử tế trước sẽ khiến vòng qua lại ấy thành vòng tốt."
  },
  "thiPhi": {
   "ten": "Thị phi Kỵ",
   "ky": "Thị phi Kỵ (Lộc đi, Kỵ về): {A} phi Hóa Lộc nhập {B}, còn {B} phi Hóa Kỵ trở về {A}, hai cung không đối nhau; một bên cho đi mà chưa được đáp lại tương xứng nên dễ sinh than phiền.",
   "de": "Bạn có xu hướng dành nhiều thiện ý từ {A} cho {B} nhưng chưa được đáp lại như mong đợi. Nói rõ kỳ vọng và cho đi vừa sức sẽ giúp bạn bớt hụt hẫng."
  },
  "cuTrien": {
   "ten": "Củ triền Kỵ",
   "ky": "Củ triền Kỵ (Kỵ quấn nhau, còn gọi hỗ xung Kỵ): hai Hóa Kỵ do hai cung khác nhau phát ra rơi vào hai đầu trục {A} – {B} nên xung lẫn nhau; chủ dây dưa, giằng co quanh việc của trục này.",
   "de": "Bạn có xu hướng dễ giằng co qua lại giữa {A} và {B}. Tách bạch từng việc, ghi rõ thỏa thuận và giải quyết dứt điểm từng điểm vướng sẽ giúp gỡ nút."
  },
  "oanThan": {
   "ten": "Oán thán Kỵ",
   "ky": "Oán thán Kỵ: Củ triền Kỵ nằm trên trục Phu Thê – Quan Lộc, hai người dễ bất đồng kéo dài khi chuyện nhà lẫn với chuyện làm; đây là tượng cần học cách đối thoại, không phải lời đoán kết cục.",
   "de": "Bạn và người bạn đời có xu hướng hay bất đồng, nhất là khi chuyện công việc lẫn vào chuyện nhà. Hãy tranh luận về việc chứ không về người, và hẹn một lúc bình tĩnh để nói những chuyện khó."
  },
  "songKy": {
   "ten": "Song Kỵ",
   "ky": "Song Kỵ (hai Kỵ chồng nhau): hai Hóa Kỵ khác nguồn (năm sinh, phi hóa, vận) cùng rơi vào {A} hoặc vào hai đầu trục đối của nó; một Kỵ là để tâm bình thường, hai Kỵ là đã quá mức, cần sắp xếp lại.",
   "de": "Bạn có xu hướng dồn quá nhiều tâm sức và lo toan vào {A}. Hãy nhờ người cùng gánh, chia nhỏ việc và cho mình khoảng nghỉ để không bị quá tải."
  },
  "locVaoNgaKyRaTha": {
   "ten": "Lộc vào mình, Kỵ ra người",
   "ky": "Lộc tùy Kỵ tẩu (Lộc đi theo Kỵ): Hóa Lộc rơi vào ngã cung (mảng của mình) là {A}, nhưng can của cung đó chuyển Kỵ sang tha cung (mảng của người khác) là {B}; cái lợi dễ chỉ là lợi tạm, về sau có thể chảy sang người khác.",
   "de": "Bạn có xu hướng có được cái lợi ở {A} nhưng về sau dễ chảy sang {B}. Hãy chốt lại thành quả sớm và giữ phần của mình rõ ràng trước khi chia sẻ."
  },
  "locVaoThaKyVeNga": {
   "ten": "Lộc vào người, Kỵ về mình",
   "ky": "Hóa Lộc rơi vào tha cung (mảng của người khác) là {A}, rồi can của cung đó chuyển Kỵ về ngã cung (mảng của mình) là {B}; khổ trước ngọt sau, cuối cùng phần được thuộc về mình.",
   "de": "Bạn có xu hướng bỏ công với {A} trước rồi mới thu kết quả về {B}. Hãy kiên nhẫn giữ cam kết, vì phần thành quả về sau thường thuộc về bạn."
  },
  "kyNhapTamHop": {
   "ten": "Kỵ nhập tam hợp",
   "ky": "Kỵ nhập tam hợp: Hóa Kỵ (nhất là của vận) rơi vào tam hợp Mệnh – Tài Bạch – Quan Lộc gốc (ba trụ chính: bản thân, tiền bạc, công việc), ở đây là {A}; chủ thu giữ, bận rộn, không thành tổn thất lớn.",
   "de": "Bạn có xu hướng bận rộn và dồn tâm sức vào {A} trong giai đoạn này. Đây là sự bận rộn có thu về, chỉ cần sắp lịch hợp lý để không quá tải."
  },
  "kyXungTamHop": {
   "ten": "Kỵ xung tam hợp",
   "ky": "Kỵ xung tam hợp (Kỵ xuất): Hóa Kỵ rơi vào cung đối diện của tam hợp Mệnh – Tài Bạch – Quan Lộc (tức Thiên Di, Phúc Đức, Phu Thê) nên xung thẳng vào {A}; chủ hao tổn, nặng nhẹ tùy cung bị xung.",
   "de": "Bạn có xu hướng thấy {A} bị kéo căng và dễ hao hụt trong giai đoạn này. Giữ thế thủ, có quỹ dự phòng và tránh cam kết lớn mới sẽ giúp bạn đi qua êm."
  },
  "phanCung": {
   "ten": "Phản cung Kỵ",
   "ky": "Phản cung Kỵ (hồi lực Kỵ – lực bật ngược như boomerang): vận đi vào tam hợp Mệnh – Tài Bạch – Quan Lộc gốc, rồi Mệnh của vận phi Hóa Kỵ vào cung đối diện của tam hợp gốc, xung ngược chính mình; sức nặng ngang Song Kỵ, nên giữ thế thủ.",
   "de": "Bạn có xu hướng thấy những nỗ lực mở rộng quay lại thành gánh nặng cho chính mình trong giai đoạn này. Giữ nhịp an toàn, củng cố cái đang có và tránh mở rộng liều là lựa chọn khôn ngoan."
  },
  "trungDiepCat": {
   "ten": "Trùng điệp cát",
   "ky": "Trùng điệp cát (tốt chồng tốt): Hóa Lộc hoặc Hóa Quyền của vận rơi đúng chỗ đã có Lộc, Quyền năm sinh ở {A} (Lộc gặp Lộc, Lộc gặp Quyền), tăng thuận lợi; Lộc của vận vào chỗ có Kỵ năm sinh còn có thể làm dịu Kỵ.",
   "de": "Bạn có xu hướng gặp nhiều thuận lợi cộng dồn ở {A} trong giai đoạn này. Hãy mạnh dạn đầu tư công sức vào đây vì đây là lúc dễ gặt hái."
  },
  "trungDiepKy": {
   "ten": "Trùng điệp Kỵ",
   "ky": "Trùng điệp Kỵ: Hóa Kỵ của vận chồng lên Hóa Kỵ năm sinh, hoặc gặp Hóa Lộc ở {A} (Lộc Kỵ chiến khắc – điều tốt và điều vướng giằng co nhau); lo toan tăng lên ở mảng này.",
   "de": "Bạn có xu hướng thấy lo toan về {A} dồn lên trong giai đoạn này. Chia nhỏ việc, ưu tiên điều thiết yếu và nhờ người hỗ trợ sẽ giúp bạn nhẹ gánh."
  }
 },
 "dvLoc": {
  "Mệnh": {
   "ky": "Hóa Lộc của vận rơi vào Mệnh gốc: duyên và cơ hội của giai đoạn đổ về bản thân, tinh thần cởi mở, dễ được giúp.",
   "de": "Bạn có xu hướng thấy mình cởi mở, nhiều cơ hội và được ủng hộ trong giai đoạn này. Hãy chủ động bắt đầu những việc ấp ủ, vì đây là lúc dễ được đón nhận."
  },
  "Huynh Đệ": {
   "ky": "Hóa Lộc của vận rơi vào Huynh Đệ gốc (anh chị em, bạn đồng trang lứa, đồng thời là ‘kho nhỏ’ của tiền bạc): có duyên với người thân, tích góp nhỏ thuận.",
   "de": "Bạn có xu hướng gần gũi anh chị em, bạn cùng lứa hơn và tích góp được những khoản nhỏ trong giai đoạn này. Hãy tận dụng để gắn kết người thân và lập thói quen để dành."
  },
  "Phu Thê": {
   "ky": "Hóa Lộc của vận rơi vào Phu Thê gốc: tình cảm, hôn nhân có duyên, dễ gặp người hợp ý.",
   "de": "Bạn có xu hướng có chuyện tình cảm êm đẹp và dễ gặp người hợp ý trong giai đoạn này. Hãy dành thời gian vun vén cho người thương và cùng nhau lên kế hoạch chung."
  },
  "Tử Tức": {
   "ky": "Hóa Lộc của vận rơi vào Tử Tức gốc: vui với con cái, người nhỏ tuổi; có duyên hợp tác.",
   "de": "Bạn có xu hướng vui với con trẻ, người nhỏ tuổi và có duyên làm việc chung trong giai đoạn này. Hãy mở rộng hợp tác có chọn lọc và dành thời gian cho người nhỏ tuổi."
  },
  "Tài Bạch": {
   "ky": "Hóa Lộc của vận rơi vào Tài Bạch gốc: dòng tiền thuận, cơ hội kiếm tiền tốt.",
   "de": "Bạn có xu hướng có dòng tiền dễ chịu và cơ hội kiếm tiền tốt trong giai đoạn này. Hãy biến khoản thu thêm thành tích lũy thay vì tiêu ngay."
  },
  "Tật Ách": {
   "ky": "Hóa Lộc của vận rơi vào Tật Ách gốc: thể lực, nhịp sống và môi trường quanh mình dễ chịu.",
   "de": "Bạn có xu hướng thấy cơ thể khỏe khoắn và nhịp sống dễ chịu trong giai đoạn này. Hãy tận dụng để xây thói quen vận động, ăn ngủ tốt cho lâu dài."
  },
  "Thiên Di": {
   "ky": "Hóa Lộc của vận rơi vào Thiên Di gốc: ra ngoài gặp thời, đi xa, mở rộng giao thiệp đều có duyên.",
   "de": "Bạn có xu hướng gặp nhiều cơ hội khi ra ngoài, đi xa hoặc mở rộng giao thiệp trong giai đoạn này. Hãy mạnh dạn đi, gặp gỡ và học hỏi ở môi trường mới."
  },
  "Nô Bộc": {
   "ky": "Hóa Lộc của vận rơi vào Nô Bộc gốc: bạn bè, đồng nghiệp, khách hàng ủng hộ; làm việc nhóm thuận.",
   "de": "Bạn có xu hướng được bạn bè, đồng nghiệp ủng hộ trong giai đoạn này. Hãy làm việc nhóm nhiều hơn, vì sức mạnh tập thể đang thuận."
  },
  "Quan Lộc": {
   "ky": "Hóa Lộc của vận rơi vào Quan Lộc gốc: công việc có duyên, dễ có dự án hoặc vị trí mới.",
   "de": "Bạn có xu hướng thuận lợi trong công việc và dễ có dự án hoặc vị trí mới trong giai đoạn này. Hãy nhận thêm trách nhiệm phù hợp để bứt lên."
  },
  "Điền Trạch": {
   "ky": "Hóa Lộc của vận rơi vào Điền Trạch gốc: gia đình ấm áp, thuận việc nhà cửa, có chỗ tích lũy.",
   "de": "Bạn có xu hướng có không khí gia đình ấm áp và thuận việc nhà cửa trong giai đoạn này. Hãy tính chuyện an cư, sửa sang nơi ở hoặc tích lũy tài sản."
  },
  "Phúc Đức": {
   "ky": "Hóa Lộc của vận rơi vào Phúc Đức gốc: tâm an, vui với sở thích, đời sống tinh thần phong phú.",
   "de": "Bạn có xu hướng thấy tâm an và vui với sở thích trong giai đoạn này. Hãy dành thời gian nuôi dưỡng tinh thần để có thêm năng lượng cho việc khác."
  },
  "Phụ Mẫu": {
   "ky": "Hóa Lộc của vận rơi vào Phụ Mẫu gốc: được người trên nâng đỡ, học hành và giấy tờ thuận.",
   "de": "Bạn có xu hướng được người trên nâng đỡ, học hành và giấy tờ thuận lợi trong giai đoạn này. Hãy học thêm, thi chứng chỉ hoặc xin ý kiến người đi trước."
  }
 },
 "dvKy": {
  "Mệnh": {
   "ky": "Hóa Kỵ của vận rơi vào Mệnh gốc: giai đoạn tự đặt nhiều trách nhiệm lên mình, để tâm và bỏ công nhiều; Kỵ nhập Mệnh thuộc dạng Kỵ nhập tam hợp, chủ bận rộn chứ không thành tổn thất lớn.",
   "de": "Bạn có xu hướng tự đặt nhiều áp lực và trách nhiệm lên mình trong giai đoạn này. Hãy chọn vài việc chính để dồn sức và cho phép mình nghỉ ngơi đúng lúc."
  },
  "Huynh Đệ": {
   "ky": "Hóa Kỵ của vận rơi vào Huynh Đệ gốc: để tâm tới anh chị em, bạn đồng trang lứa; ‘kho nhỏ’ tiền bạc phải bỏ công, chi dễ vượt dự tính.",
   "de": "Bạn có xu hướng phải lo nhiều cho anh chị em, bạn cùng lứa và chi tiêu dễ vượt dự tính trong giai đoạn này. Giúp trong sức mình và giữ riêng một khoản dự phòng sẽ giúp bạn yên tâm."
  },
  "Phu Thê": {
   "ky": "Hóa Kỵ của vận rơi vào Phu Thê gốc: để tâm nhiều tới chuyện tình cảm, hôn nhân; đồng thời xung Quan Lộc gốc nên công việc cũng dễ bị kéo theo.",
   "de": "Bạn có xu hướng dành nhiều tâm sức cho chuyện tình cảm, lứa đôi trong giai đoạn này. Lắng nghe nhiều hơn và hẹn lúc trò chuyện riêng sẽ giúp hai người hiểu nhau."
  },
  "Tử Tức": {
   "ky": "Hóa Kỵ của vận rơi vào Tử Tức gốc: bận lòng vì con cái, người nhỏ tuổi hoặc việc hợp tác; đồng thời xung Điền Trạch gốc nên chuyện nhà cũng cần giữ.",
   "de": "Bạn có xu hướng bận lòng nhiều vì con trẻ hoặc việc làm chung trong giai đoạn này. Giao việc rõ ràng, kiên nhẫn đồng hành và giữ thỏa thuận minh bạch sẽ giúp mọi việc suôn sẻ."
  },
  "Tài Bạch": {
   "ky": "Hóa Kỵ của vận rơi vào Tài Bạch gốc: để tâm nhiều tới tiền, phải bỏ công mới có thu; thuộc dạng Kỵ nhập tam hợp, chủ bận rộn vì tiền hơn là hao lớn.",
   "de": "Bạn có xu hướng để tâm nhiều tới chuyện tiền và phải bỏ công mới có thu trong giai đoạn này. Lập ngân sách, tránh vay mượn mạo hiểm và kiên trì sẽ giúp bạn vững."
  },
  "Tật Ách": {
   "ky": "Hóa Kỵ của vận rơi vào Tật Ách gốc: bận rộn, dễ làm quá sức, nhịp sống cần được giữ.",
   "de": "Bạn có xu hướng bận rộn và dễ làm quá sức trong giai đoạn này. Ưu tiên giấc ngủ, vận động nhẹ đều đặn và lắng nghe cơ thể."
  },
  "Thiên Di": {
   "ky": "Hóa Kỵ của vận rơi vào Thiên Di gốc: bôn ba, ra ngoài nhiều mà không phải lúc nào cũng thuận; đồng thời xung Mệnh gốc nên cần giữ thế thủ.",
   "de": "Bạn có xu hướng phải đi lại nhiều mà không phải chuyến nào cũng suôn sẻ trong giai đoạn này. Chuẩn bị kỹ trước khi đi và giữ thái độ mềm mỏng khi làm việc với người lạ."
  },
  "Nô Bộc": {
   "ky": "Hóa Kỵ của vận rơi vào Nô Bộc gốc: bị cuốn vào chuyện bạn bè, đồng nghiệp; đồng thời xung Huynh Đệ gốc nên cẩn thận tiền tích góp.",
   "de": "Bạn có xu hướng bị cuốn vào chuyện của bạn bè, đồng nghiệp trong giai đoạn này. Giúp đỡ có giới hạn và tách bạch tiền nong sẽ giữ được quan hệ tốt."
  },
  "Quan Lộc": {
   "ky": "Hóa Kỵ của vận rơi vào Quan Lộc gốc: dồn sức cho công việc, trách nhiệm nặng; thuộc dạng Kỵ nhập tam hợp, chủ bận rộn có thu về.",
   "de": "Bạn có xu hướng dồn sức cho công việc và gánh nhiều trách nhiệm trong giai đoạn này. Đây là lúc chăm chỉ được ghi nhận, chỉ cần sắp lịch hợp lý để còn thời gian cho gia đình."
  },
  "Điền Trạch": {
   "ky": "Hóa Kỵ của vận rơi vào Điền Trạch gốc: lo nhiều việc nhà cửa, gia đình; Kỵ vào ‘kho’ cũng có ý thu giữ, tích lại.",
   "de": "Bạn có xu hướng lo nhiều việc nhà cửa và gia đình trong giai đoạn này. Chia việc cho các thành viên và lập kế hoạch chi tiêu cho nhà cửa vừa sức."
  },
  "Phúc Đức": {
   "ky": "Hóa Kỵ của vận rơi vào Phúc Đức gốc: suy nghĩ nhiều, khó thảnh thơi; đồng thời xung Tài Bạch gốc nên chi tiêu cần giữ.",
   "de": "Bạn có xu hướng suy nghĩ nhiều và khó thảnh thơi trong giai đoạn này. Viết ra điều lo lắng, vận động nhẹ hoặc trò chuyện với người tin cậy sẽ giúp bạn nhẹ lòng."
  },
  "Phụ Mẫu": {
   "ky": "Hóa Kỵ của vận rơi vào Phụ Mẫu gốc: để tâm tới cha mẹ, người trên và giấy tờ, hợp đồng.",
   "de": "Bạn có xu hướng phải để tâm tới cha mẹ, người trên và giấy tờ trong giai đoạn này. Đọc kỹ văn bản trước khi ký, tránh đứng ra bảo lãnh và dành thời gian thăm hỏi cha mẹ."
  }
 },
 "dvKyXung": {
  "Mệnh": {
   "ky": "Hóa Kỵ của vận rơi vào Thiên Di gốc, xung Mệnh gốc (Kỵ xung tam hợp): bản thân chịu sức ép, dễ mệt và dao động; giai đoạn nên giữ thế thủ.",
   "de": "Bạn có xu hướng thấy áp lực và dễ dao động tinh thần trong giai đoạn này. Giữ nhịp sống đều, ưu tiên việc chính và tránh quyết định vội sẽ giúp bạn vững hơn."
  },
  "Huynh Đệ": {
   "ky": "Hóa Kỵ của vận rơi vào Nô Bộc gốc, xung Huynh Đệ gốc: ‘kho nhỏ’ tiền bạc dễ hao, quan hệ anh chị em kém gắn kết.",
   "de": "Bạn có xu hướng thấy khoản tích góp nhỏ dễ hao và quan hệ với anh chị em kém gắn kết trong giai đoạn này. Hạn chế cho vay, giữ khoản dự phòng và chủ động hỏi han người thân sẽ giúp ổn định."
  },
  "Phu Thê": {
   "ky": "Hóa Kỵ của vận rơi vào Quan Lộc gốc, xung Phu Thê gốc: công việc chiếm nhiều sức nên ít thời gian và kiên nhẫn cho người phối ngẫu.",
   "de": "Bạn có xu hướng ít thời gian và kiên nhẫn cho người bạn đời trong giai đoạn này. Hẹn những buổi trò chuyện ngắn đều đặn và lắng nghe trước khi góp ý sẽ giữ được sự gắn kết."
  },
  "Tử Tức": {
   "ky": "Hóa Kỵ của vận rơi vào Điền Trạch gốc, xung Tử Tức gốc: ít thời gian cho con cái, việc hợp tác dễ chững lại.",
   "de": "Bạn có xu hướng ít thời gian cho con trẻ và việc làm chung dễ chững lại trong giai đoạn này. Dành những khoảng ngắn nhưng trọn vẹn cho người nhỏ tuổi và rà soát lại các thỏa thuận làm chung."
  },
  "Tài Bạch": {
   "ky": "Hóa Kỵ của vận rơi vào Phúc Đức gốc, xung Tài Bạch gốc (Kỵ xung tam hợp): chi ngoài dự tính, tiền khó giữ.",
   "de": "Bạn có xu hướng gặp những khoản chi ngoài dự tính và tiền khó giữ trong giai đoạn này. Giữ quỹ dự phòng, tạm hoãn khoản chi lớn chưa cần thiết và tránh đầu tư liều."
  },
  "Tật Ách": {
   "ky": "Hóa Kỵ của vận rơi vào Phụ Mẫu gốc, xung Tật Ách gốc: nhịp sống xáo trộn, dễ mỏi mệt; nên giữ nếp sinh hoạt an toàn, điều độ.",
   "de": "Bạn có xu hướng thấy nhịp sống xáo trộn và dễ mỏi mệt trong giai đoạn này. Giữ giấc ngủ đều, vận động nhẹ và duy trì kiểm tra sức khỏe định kỳ như một thói quen sẽ giúp bạn giữ phong độ."
  },
  "Thiên Di": {
   "ky": "Hóa Kỵ của vận rơi vào Mệnh gốc, xung Thiên Di gốc: ngại ra ngoài, các chuyến đi và cuộc gặp dễ trục trặc.",
   "de": "Bạn có xu hướng ngại ra ngoài và các chuyến đi, cuộc gặp dễ trục trặc trong giai đoạn này. Lên kế hoạch kỹ, chừa thời gian dự phòng và chọn môi trường quen thuộc cho việc quan trọng."
  },
  "Nô Bộc": {
   "ky": "Hóa Kỵ của vận rơi vào Huynh Đệ gốc, xung Nô Bộc gốc: quan hệ bạn bè, đồng nghiệp lỏng lẻo hoặc dễ hiểu lầm.",
   "de": "Bạn có xu hướng thấy quan hệ bạn bè, đồng nghiệp lỏng lẻo hoặc dễ hiểu lầm trong giai đoạn này. Giữ lời hứa, nói rõ ràng và đừng đặt kỳ vọng quá cao vào người khác sẽ giúp bạn nhẹ lòng."
  },
  "Quan Lộc": {
   "ky": "Hóa Kỵ của vận rơi vào Phu Thê gốc, xung Quan Lộc gốc (Kỵ xung tam hợp): công việc gặp trở ngại hoặc thay đổi; nên giữ vững vị trí.",
   "de": "Bạn có xu hướng gặp trở ngại hoặc thay đổi trong công việc trong giai đoạn này. Củng cố chuyên môn, giữ vị trí hiện tại vững vàng và cân nhắc kỹ trước khi đổi việc."
  },
  "Điền Trạch": {
   "ky": "Hóa Kỵ của vận rơi vào Tử Tức gốc, xung Điền Trạch gốc: ‘kho’ bị lay, chuyện nhà cửa và của để dành xáo trộn.",
   "de": "Bạn có xu hướng thấy chuyện nhà cửa và của để dành bị xáo trộn trong giai đoạn này. Hạn chế khoản vay lớn, giữ giấy tờ nhà cẩn thận và chi tiêu gia đình có kế hoạch."
  },
  "Phúc Đức": {
   "ky": "Hóa Kỵ của vận rơi vào Tài Bạch gốc, xung Phúc Đức gốc: lo chuyện tiền nên khó thảnh thơi, ít thời gian cho bản thân.",
   "de": "Bạn có xu hướng khó thảnh thơi vì lo chuyện tiền và ít thời gian cho bản thân trong giai đoạn này. Dành riêng thời gian thư giãn mỗi tuần và nhìn vào con số thật sẽ giúp bạn bớt lo."
  },
  "Phụ Mẫu": {
   "ky": "Hóa Kỵ của vận rơi vào Tật Ách gốc, xung Phụ Mẫu gốc: giấy tờ, quan hệ với người trên dễ vướng, ít thời gian cho cha mẹ.",
   "de": "Bạn có xu hướng gặp vướng mắc với giấy tờ, người trên hoặc ít thời gian cho cha mẹ trong giai đoạn này. Kiểm tra kỹ hồ sơ, giữ quan hệ tôn trọng với cấp trên và thăm hỏi cha mẹ đều đặn."
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

/* ---------------------------------------------------------------- Bộ tính ---------------------------------------------------------------- */
var PT_CUNG = ['Mệnh', 'Huynh Đệ', 'Phu Thê', 'Tử Tức', 'Tài Bạch', 'Tật Ách', 'Thiên Di', 'Nô Bộc', 'Quan Lộc', 'Điền Trạch', 'Phúc Đức', 'Phụ Mẫu'];
var PT_NGA = { 'Mệnh': 1, 'Tài Bạch': 1, 'Tật Ách': 1, 'Quan Lộc': 1, 'Điền Trạch': 1, 'Phúc Đức': 1 };          // ngã cung (lục nội)
var PT_LUC_THAN = { 'Mệnh': 1, 'Huynh Đệ': 1, 'Phu Thê': 1, 'Tử Tức': 1, 'Nô Bộc': 1, 'Phụ Mẫu': 1 };
var PT_THU_TU = ['Mệnh', 'Quan Lộc', 'Tài Bạch', 'Thiên Di', 'Phúc Đức', 'Phu Thê', 'Tử Tức', 'Điền Trạch', 'Tật Ách', 'Phụ Mẫu', 'Huynh Đệ', 'Nô Bộc'];   // thứ tự luận của bài Bắc phái
var PT_H = ['Lộc', 'Quyền', 'Khoa', 'Kỵ'];
function ptD_(i) { return (i + 6) % 12; }
function ptLv_(cung) { return typeof tpLv_ === 'function' ? tpLv_(cung) : cung.toLowerCase(); }
function ptThay_(s, o) { return String(s || '').replace(/\{(\w+)\}/g, function (m, k) { return o[k] != null ? o[k] : m; }); }
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
function ptTang_(N, tv, menhTang, canTang, dvMenh) {
  var hoa = ptHoa_(tv, canTang), ten = N.ten, snKy = N.sn[3].toi, snLoc = N.sn[0].toi, van = PT_VAN || {};
  var ky = [], de = [], diem = 0, co = {};
  hoa.forEach(function (f) {
    if (f.toi == null) return;
    var nc = ten[f.toi], tang = ptTenTu_(menhTang, f.toi), dvTen = dvMenh != null ? ptTenTu_(dvMenh, f.toi) : null;
    ky.push('Hóa ' + PT_H[f.h] + ' (' + f.sao + ') nhập ' + nc + ' nguyên cục' + (tang !== nc ? ' – là ' + tang + ' của vận' : '') + (dvTen ? ' – ' + dvTen + ' của đại vận' : '') + '.');
    if (f.h === 0) {
      var v = (van.dvLoc || {})[nc] || {}; if (v.ky) ky.push(v.ky); if (v.de) de.push(v.de);
      diem += N.tamHop.indexOf(f.toi) >= 0 ? 1 : 0.5;
      if (snKy === f.toi) { co.trungDiepCat = { A: nc }; diem += 0.5; }
    }
    if (f.h === 3) {
      var x = ptD_(f.toi), vk = (van.dvKy || {})[nc] || {}, vx = (van.dvKyXung || {})[ten[x]] || {};
      ky.push('Hóa Kỵ của vận xung ' + ten[x] + ' nguyên cục.'); if (vk.ky) ky.push(vk.ky); if (vx.ky) ky.push(vx.ky);
      if (vk.de) de.push(vk.de); if (vx.de) de.push(vx.de);
      if (N.tamHop.indexOf(f.toi) >= 0) co.kyNhapTamHop = { A: nc };
      if (N.tamHop.indexOf(x) >= 0) { co.kyXungTamHop = { A: ten[x] }; diem -= 1; }
      if (snKy != null && (f.toi === snKy || f.toi === ptD_(snKy))) { co.songKy = { A: nc }; diem -= 1; }
      if (snLoc === f.toi) { co.trungDiepKy = { A: nc }; diem -= 0.5; }
      if (dvMenh == null && N.tamHop.indexOf(menhTang) >= 0 && ['Phu Thê', 'Thiên Di', 'Phúc Đức'].indexOf(nc) >= 0) { co.phanCung = { A: nc, B: ten[x] }; diem -= 1; }
    }
  });
  var mau = Object.keys(co).map(function (k) { var m = (van.mau || {})[k] || {}; return { k: k, ten: m.ten || k, ky: ptThay_(m.ky, { A: co[k].A, B: co[k].B }), de: ptThay_(m.de, { A: ptLv_(co[k].A || ''), B: ptLv_(co[k].B || '') }) }; });
  var gop = {}; de = de.filter(function (x) { if (gop[x]) return false; gop[x] = 1; return true; });
  var muc = diem >= 1.5 ? 'Thuận' : diem >= 0 ? 'Bình' : diem >= -1.5 ? 'Cần giữ nhịp' : 'Nên thận trọng';
  return { menh: ten[menhTang], chi: CHI[menhTang], can: CAN[canTang], hoa: hoa.map(function (f) { return { h: PT_H[f.h], sao: f.sao, cung: f.toi == null ? null : ten[f.toi] }; }), ky: ky, de: de, mau: mau, diem: diem, muc: muc };
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
    var t = ptTang_(N, tv, i, P[i].can, null);
    t.tuoi = P[i].daiHan; t.den = P[i].daiHan + 9; t.nam = I.lunar.year + P[i].daiHan - 1; t.nay = I.tuoi >= t.tuoi && I.tuoi <= t.den;
    dv.push(t);
  }
  dv.sort(function (a, b) { return a.tuoi - b.tuoi; });
  var ln = [];
  for (var y = vy; y < vy + soNam; y++) {
    var tuoi = y - I.lunar.year + 1, dvO = -1;
    for (var k = 0; k < 12; k++) if (P[k].daiHan != null && tuoi >= P[k].daiHan && tuoi <= P[k].daiHan + 9) dvO = k;
    var m = ((y + 8) % 12 + 12) % 12, c = ((y + 6) % 10 + 10) % 10;
    var tl = ptTang_(N, tv, m, c, dvO >= 0 ? dvO : null);
    tl.nam = y; tl.tuoi = tuoi; tl.dvMenh = dvO >= 0 ? ten[dvO] : null;
    ln.push(tl);
  }
  return {
    gioiThieu: van.gioiThieu || {},
    coBan: {
      canCung: P.map(function (p, i) { return { cung: p.cung, chi: CHI[i], can: CAN[p.can] }; }),
      sinhNien: N.sn.map(function (f) { return { h: PT_H[f.h], sao: f.sao, cung: f.toi == null ? null : ten[f.toi] }; }),
      laiNhan: N.ln >= 0 ? { cung: ten[N.ln], chi: CHI[N.ln], ky: lnV.ky || '', de: lnV.de || '' } : null,
      menh: ten[I.menh], than: P[I.than] ? P[I.than].cung : ''
    },
    tuHoa: N.tuHoa.map(function (t) { return { cung: ten[t.o], h: PT_H[t.h], sao: t.sao, loai: t.loai }; }),
    mau: mau,
    cung: PT_THU_TU.map(function (c) { return ptCung_(N, N.o[c]); }),
    daiVan: dv, luuNien: ln, nguon: PT_NGUON
  };
}

/** API cho giao diện – tab "Phi Tinh": hiện chỉ chủ sở hữu (chủ dự án chốt 31/10, thử trước rồi mới mở bán) */
function phiTinhLuan(input, token) {
  tkCan_(token, true);
  input = input || {};
  var tv = tuviLapLaSo(input);
  return ptLap_(tv, parseInt(input.viewYear, 10) || tv.info.viewYear, 5);
}
