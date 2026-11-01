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

/** Kho luận giải Bắc phái tổng hợp (nghien-cuu/phi-tinh/tong-hop/catalog.json, viết lại bằng lời mới): khóa -> [[nguồn, chuyên môn, dễ hiểu, cat|hung|trung]] */
var PT_KHO = {"xiHoa|duong":[["Kinh nghiệm cao thủ Bắc phái","Điểm xí hoa tổng dương: số lượng sao hỉ thần và cung khí tốt nhiều hơn, lá số được chấm tương đối khá.","Bạn thuộc mẫu người có nền tảng khá vững, nhiều mặt trong đời tự vận hành thuận. Hãy dùng lợi thế đó để đầu tư vào những mặt còn yếu thay vì chỉ dựa vào may mắn.","cat"]],
"xiHoa|am":[["Kinh nghiệm cao thủ Bắc phái","Điểm xí hoa tổng âm: sao kỵ thần và cung khí hung chiếm ưu thế; cohoc khuyên đọc kỹ từng cung để tìm cách ứng xử.","Bạn có xu hướng phải tự gây dựng nhiều hơn người khác, ít được thuận buồm xuôi gió ngay từ đầu. Biết rõ điểm mạnh, điểm yếu của mình và chọn đúng thời điểm sẽ bù lại được phần lớn thiệt thòi.","trung"]],
"laiNhan|Thiên Di":[["Huy Hà Phan","Lai nhân cung tại Thiên Di: nhân duyên kiếp này đặt ở giao tiếp và đi xa; năng lực quyết định tầm 'xa' mà đương số vươn tới.","Bạn có xu hướng tìm thấy cơ hội lớn nhất khi ra ngoài, giao tiếp rộng hoặc đi xa. Hãy chủ động mở rộng quan hệ và không ngại đổi môi trường khi thấy mình bị bó hẹp.","cat"],["Lai Nhân Cung 144 quyết","Lai nhân thuộc tam hợp Phu–Di–Phúc, gắn với phúc phận; vận may đến từ việc đi xa và các mối giao thiệp ngoài xã hội.","Bạn thuộc mẫu người được may mắn khi đi xa và gặp gỡ người mới. Giữ uy tín ở bên ngoài cũng chính là giữ vận tốt cho mình.","cat"]],
"laiNhan|Phu Thê":[["Lai Nhân Cung 144 quyết","Lai nhân tại Phu Thê: đời sống dựa nhiều vào người phối ngẫu, hôn nhân ảnh hưởng lớn đến cả cuộc đời; Phu–Di–Phúc là tam hợp liên quan phúc báo.","Bạn có xu hướng để chuyện tình cảm và người bạn đời ảnh hưởng mạnh đến mọi quyết định. Hãy chọn người đồng hành thật kỹ và vun đắp mối quan hệ như một tài sản lớn nhất.","trung"]],
"laiNhan|Điền Trạch":[["Huy Hà Phan","Khi lai nhân đóng ở Điền Trạch, gia đình giữ vai trò then chốt và đương số nên dựa vào sự trợ giúp của người nhà.","Bạn thuộc mẫu người lấy gia đình làm chỗ dựa và động lực. Dành thời gian chăm lo tổ ấm sẽ giúp mọi việc khác vững hơn.","cat"],["Lai Nhân Cung 144 quyết","Tổ đức và nghiệp chướng của dòng họ ảnh hưởng gia đình, tài sản.","Bạn có xu hướng chịu ảnh hưởng nhiều từ nếp nhà và những gì thế hệ trước để lại. Giữ gìn điều tốt, mạnh dạn sửa điều chưa hay của nếp nhà là cách tạo vận cho con cháu.","trung"]],
"laiNhan|Tài Bạch":[["Huy Hà Phan","Lai nhân đóng Tài Bạch: cần nền tài chính vững bền; đầu tư chập chờn hay thu không bù công dễ tạo sức ép.","Bạn có xu hướng xem tiền bạc là thước đo an toàn của đời mình. Hãy ưu tiên nguồn thu ổn định và tránh những khoản đầu tư khiến mình mất ngủ.","trung"],["Lai Nhân Cung 144 quyết","Chú trọng tự lập, quản lý tài chính, tối đa hóa của cải; có Hóa Lộc, Hóa Quyền hội thì động lực kiếm tiền càng mạnh.","Bạn thuộc mẫu người tự lập về tiền bạc và có ý chí làm giàu. Lập kế hoạch tài chính rõ ràng sẽ biến ý chí đó thành kết quả bền vững.","cat"]],
"mau|Thuận thủy Kỵ":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Cung X phi Kỵ sang cung Y (không phải đối cung): khí của X tiết sang Y, X dồn tâm sức cho việc của Y. Đọc chủ đề Y để biết năng lượng chảy về đâu.","Bạn có xu hướng dồn tâm sức của mảng này sang một mảng khác trong đời, nhiều khi quên chăm phần gốc. Thỉnh thoảng nhìn lại để giữ cân bằng giữa nơi mình cho đi và nơi mình cần giữ.","trung"]],
"mau|Nghịch thủy Kỵ":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Kỵ phi vào cung đang có Kỵ năm sinh cùng sao (ví dụ Tài Bạch phi Kỵ nhập Phúc Đức): được xem là có thể phát đạt nhờ sản xuất, kinh doanh hoặc quan hệ đối ngoại; tài có thể tích trữ mà sinh lợi.","Bạn có xu hướng bám rất chặt vào một mục tiêu và kiên trì đến khi có kết quả. Sự bền bỉ đó là lợi thế lớn trong làm ăn, chỉ cần đừng để nó biến thành cố chấp.","cat"]],
"mau|Tiết xuất Kỵ":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Cung phi Kỵ sang đối cung, tự xung cung mình: điều cung này đại diện khó giữ lâu bên mình (ví dụ Phu Thê phi Kỵ nhập Quan Lộc: người phối ngẫu ít ở cạnh, hôn nhân có biến trong vận).","Bạn có xu hướng để một mối quan tâm quan trọng bị cuốn ra ngoài, khó giữ ở gần. Chủ động dành thời gian và sự hiện diện cho điều mình quý sẽ giữ nó lại lâu hơn.","hung"]],
"mau|Lưu xuất Kỵ":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Cung kho (Điền Trạch, Tài Bạch) phi Kỵ sang đối cung: của cải trong nhà chảy ra ngoài, không nên tích trữ khư khư mà nên cho tiền vận động có mục đích.","Bạn có xu hướng thấy tiền trong nhà cứ lặng lẽ đội nón ra đi. Hãy biến tiền thành tài sản có giá trị hoặc kế hoạch dài hạn thay vì để nằm yên rồi hao dần.","hung"]],
"mau|Tứ mã Kỵ":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Kỵ năm sinh hoặc tự hóa Kỵ ở Dần, Thân, Tị, Hợi: chủ bôn ba, xa cách, dễ xung đột với người của cung đó.","Bạn có xu hướng phải di chuyển, đổi chỗ, chạy việc nhiều hơn người khác. Biến sự xê dịch thành trải nghiệm có chủ đích và giữ liên lạc đều với gia đình sẽ đỡ mệt hơn.","trung"]],
"mau|Nhập khố Kỵ":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Hóa Kỵ năm sinh rơi vào tứ mộ khố (Thìn, Tuất, Sửu, Mùi) mà cung ấy không tự hóa: mang nghĩa 'mang nợ', túi rủng rỉnh hay không vẫn phải gắng kiếm; đồng thời là cách cục giữ của tốt.","Bạn có xu hướng luôn thấy mình phải gánh vác và tích lũy, khó thảnh thơi. Ý thức trách nhiệm ấy giúp bạn giữ của tốt, chỉ cần cho phép mình nghỉ ngơi đúng lúc.","trung"]],
"mau|Tứ chính Kỵ":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Kỵ năm sinh ở Tý, Ngọ, Mão, Dậu: người hay khoa trương, có chút thành tựu là ai cũng biết.","Bạn thuộc mẫu người dễ được chú ý, việc mình làm thường lan nhanh. Hãy để kết quả tự nói thay mình, khiêm tốn một chút sẽ được quý trọng lâu hơn.","trung"]],
"mau|Củ triền Kỵ":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Hai cung khác nhau phi Kỵ vào hai đầu của cùng một trục đối (ví dụ một cung Kỵ nhập Phu Thê, cung khác Kỵ nhập Quan Lộc): trục đó bị giằng co. Với trục Phu–Quan: vợ chồng hay va chạm đến già nhưng chưa chắc chia tay.","Bạn có xu hướng bị kéo về hai phía trong cùng một chuyện, ví dụ giữa công việc và gia đình. Đặt ranh giới rõ và nói chuyện thẳng thắn sớm sẽ giảm hẳn những va chạm kéo dài.","hung"],["Tiên thiên tứ hóa phi tinh kỳ phổ","Với trục Tử–Điền (Phu Thê và Nô Bộc cùng phi Kỵ vào): xung đột giữa chuyện con cái và chuyện nhà; với trục Tài–Phúc (Phụ Mẫu, Huynh Đệ phi Kỵ vào): xung đột giữa kiếm tiền và hưởng thụ.","Bạn có xu hướng gặp áp lực từ hai phía trong gia đình cùng lúc. Hãy tách bạch từng việc, giải quyết từng mối thay vì gánh tất cả trong một lần.","hung"]],
"mau|Thị phi Kỵ":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Cung X phi Kỵ sang Y trong khi Y phi Lộc (hoặc cát) sang X: quan hệ hai bên lệch, một bên quan tâm còn bên kia thờ ơ, dễ sinh tranh chấp vì cho mà không được đáp.","Bạn có xu hướng gặp những mối quan hệ mà một người cho nhiều còn người kia nhận nhiều. Nói rõ mong đợi của mình từ đầu sẽ tránh được cảm giác thiệt thòi về sau.","hung"]],
"mau|Điệp xuất Lộc":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Cung phi Lộc sang đối cung vốn đã có Lộc năm sinh: Lộc chồng lên rồi chảy ra ngoài, dễ hao tổn; ở đại vận cohoc đọc là 'Lộc mất do không trân quý'.","Bạn có xu hướng có được nhiều thứ tốt nhưng cũng dễ cho đi hoặc để tuột mất. Biết trân trọng và giữ lại một phần cho mình là đủ để may mắn không trôi qua.","trung"]],
"mau|Tiết xuất Lộc":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Cung phi Lộc sang đối cung (không chồng Lộc): cái lợi tự nguyện đưa ra ngoài, tượng hao tổn nhẹ do mình chủ động cho.","Bạn thuộc mẫu người rộng rãi, sẵn lòng chia phần tốt cho người khác. Rộng lượng là đức tính đẹp, chỉ cần cân nhắc để không tự làm mình thiếu hụt.","trung"]],
"mau|Đối trì Lộc":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Hai đầu một trục đối cùng có Lộc (một đầu có/nhận Lộc, đầu kia phi Lộc sang): Lộc giằng hai đầu, tăng thêm lợi cho cung đối diện (ví dụ Lộc vào Mệnh giúp thêm cho Thiên Di; Lộc vào Điền giúp thêm cho Tử; Tài – Phụ Mẫu đối trì làm tăng cát lợi).","Bạn có xu hướng được hai phía cùng nâng đỡ, việc này thuận kéo theo việc kia thuận. Hãy tận dụng sự hỗ trợ đó để làm những việc lớn hơn thường ngày.","cat"]],
"mau|Lộc Lộc trao đổi":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Hai cung phi Lộc cho nhau (ví dụ Mệnh phi Lộc nhập Quan Lộc và Quan Lộc phi Lộc nhập Mệnh): hai bên cùng có lợi, công việc và bản thân nuôi nhau.","Bạn thuộc mẫu người làm việc mình thích và việc đó lại nuôi lại mình. Giữ được niềm vui trong công việc là chìa khóa để vòng tốt này kéo dài.","cat"]],
"mau|Song Lộc":[["Từ Tăng Sinh","Lộc Tồn gặp Hóa Lộc (Song lộc triều viên, Lộc hợp uyên ương) tại Mệnh: tài lộc dồi dào nếu tiết kiệm; xa xỉ, ỷ tiền mà kiêu thì dễ trắng tay.","Bạn có xu hướng gặp nhiều cơ hội về tiền bạc. Giữ thói quen tiết kiệm và khiêm tốn sẽ giúp phần may mắn này ở lại lâu.","cat"],["","Song Lộc ở Điền Trạch (Lộc và Quyền năm sinh cùng tọa): lợi nhiều hơn danh, hợp cả văn lẫn võ và kinh doanh.","Bạn thuộc mẫu người coi trọng hiệu quả thực tế hơn tiếng tăm. Đó là lợi thế khi làm ăn, chỉ cần giữ chữ tín để tiếng tốt đi cùng lợi ích.","cat"]],
"mau|Hư lộc":[["","Hóa Lộc của vận (năm, tháng) bay ra tha cung, không vào tam hợp Mệnh: 'Lộc xuất', kiếm được nhưng tiêu hết, trống rỗng; Quyền xuất, Khoa xuất cũng rỗng.","Bạn có xu hướng trong giai đoạn này thấy tiền vào rồi ra rất nhanh. Hãy để riêng một khoản tiết kiệm ngay khi có thu nhập để giữ lại thành quả.","trung"]],
"mau|Dương phi nhập Âm":[["","Cung dương phi Hóa vào cung âm: cộng hưởng mạnh, tác động rõ; dương nhập dương: cộng hưởng yếu. Dùng để chỉnh độ nặng nhẹ của một dòng phi hóa ở vận tháng.","Bạn có xu hướng cảm nhận rõ ảnh hưởng của sự việc này hơn bình thường. Chuẩn bị trước một chút sẽ giúp bạn đón nhận nó chủ động hơn.","trung"]],
"mau|Lộc gặp Kỵ":[["","Lộc của vận rơi đúng chỗ có Kỵ (năm sinh, đại vận hoặc năm): không ổn định, được rồi lại mất; cohoc khuyên không cho vay tiền, không gánh nợ thay người.","Bạn có xu hướng gặp cơ hội đi kèm rủi ro trong cùng một việc. Thận trọng với chuyện cho vay, bảo lãnh và đọc kỹ giấy tờ trước khi nhận lời.","hung"]],
"mau|Song Kỵ":[["Trung Châu","Hai Kỵ chồng nhau (Kỵ vận trùng Kỵ năm sinh, hoặc Lộc năm sinh trùng Kỵ vận): hung, dễ hao tổn, xung mạnh cung đối diện; nếu quy vị thì có thể thành tụ tài.","Bạn có xu hướng gặp áp lực dồn vào cùng một mảng trong giai đoạn này. Giảm bớt cam kết mới, giữ nhịp sống điều độ là cách đi qua nhẹ nhàng nhất.","hung"]],
"mau|Tuyệt mệnh Kỵ":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Thiên Di hoặc Mệnh của đại vận phi Kỵ xung Mệnh (hoặc Quan Lộc) nguyên cục khi Mệnh gốc không có Kỵ năm sinh: dấu hiệu hung hiểm của vận, xem cung phát Kỵ để biết việc gì rủi ro.","Bạn có xu hướng trong giai đoạn này dễ gặp việc ngoài ý muốn ở một mảng cụ thể. Sống chậm lại, không mạo hiểm và chăm sóc sức khỏe đều đặn là cách phòng tốt nhất.","hung"]],
"mau|Phá thể":[["","Cung có Thiên Hình hoặc Thiên Riêu là 'vị trí phá thể'; đại vận tới cung đó thì có điều không lành.","Bạn có xu hướng gặp một giai đoạn cần thận trọng hơn thường lệ. Giữ an toàn trong đi lại và tránh quyết định vội là đủ để vượt qua.","hung"]],
"mau|Tự hóa li tâm":[["Cửu cửu bí nghi","Cung tự hóa ra ngoài, năng lượng của cung bị đẩy đi: ở Tài, Điền ảnh hưởng cách dùng tiền; ở Phúc, Tật ảnh hưởng tu dưỡng tâm tính; ở Tử ảnh hưởng chuyện tình cảm.","Bạn có xu hướng khó giữ ổn định ở mảng này, hay thay đổi theo cảm hứng. Đặt cho mình vài nguyên tắc nhỏ và giữ đều sẽ giúp mọi thứ vững hơn.","trung"]],
"than|Thiên Di":[["","Cung Thân đóng ở Thiên Di: môi trường sống thường đổi thay, chỗ ở và chỗ làm hay biến động, cả đời gắn với việc xa nhà.","Bạn có xu hướng sống nhiều nơi, đổi môi trường nhiều lần. Hãy coi mỗi lần thay đổi là một bước học hỏi và giữ một vài thói quen cố định làm điểm tựa.","trung"]],
"than|Phúc Đức":[["Trung Châu","Cung Thân đóng ở Phúc Đức: biết tận hưởng đời sống, xem trọng luật nhân quả và phúc ấm do tổ tiên để lại.","Bạn thuộc mẫu người coi trọng sự an vui trong lòng và đạo lý sống. Giữ lối sống tử tế ấy sẽ là chỗ dựa tinh thần vững nhất của bạn.","cat"]],
"than|Mệnh":[["Nguyễn Anh Vũ","Cung Thân đóng ở Mệnh: tự chủ, tự lập rất mạnh, ít bị ngoại cảnh chi phối; hay dở đều do chính mình quyết.","Bạn thuộc mẫu người tự quyết và ít bị người khác lay chuyển. Lắng nghe thêm góp ý trước những quyết định lớn sẽ giúp bạn tránh đi đường vòng.","trung"]],
"sao|Hóa Kỵ|Thân":[["Phi tinh Trần Đoàn; Hồng Khánh; Trần Bỉnh Húc","Hóa Kỵ năm sinh nằm ở cung Thân: chủ việc gặp trở ngại, dễ vướng thị phi, khó được như ý; có cát tinh đắc địa đi kèm thì nhẹ bớt.","Bạn có xu hướng phải đi đường dài hơn người khác để đạt điều mình muốn. Kiên nhẫn và chọn đồng hành tốt sẽ rút ngắn chặng đường đó.","hung"]],
"cungKhi|*|daiCat":[["Sở Hoàng","Cung khí đại cát (nạp âm là hỉ thần): cát tinh trong cung phát huy hết sức; sao tài dù tốt vẫn phải có cung khí hòa hợp mới tạo được giàu có.","Bạn có xu hướng gặp thuận lợi tự nhiên ở mảng đời này. Hãy đầu tư công sức vào đây vì công bỏ ra thường được đền đáp xứng đáng.","cat"]],
"cungKhi|*|danXen":[["Sở Hoàng","Cung khí cát hung đan xen: kết quả tùy đại vận; đại vận mạnh thì vẫn thành.","Bạn có xu hướng thấy mảng đời này lúc thuận lúc nghịch. Chọn thời điểm thuận để làm việc lớn và tích lũy trong lúc chậm là cách đi bền.","trung"]],
"cungKhi|*|daiHung":[["Sở Hoàng","Cung khí đại hung (nạp âm thuộc kỵ thần): sao tốt cũng giảm lực; vẫn có thể thành nếu đại vận tốt, nhất là đại vận mạnh thời trẻ.","Bạn có xu hướng phải cố gắng nhiều hơn ở mảng đời này. Học hỏi kỹ năng và kiên trì chờ giai đoạn thuận sẽ giúp bạn bù đắp được.","trung"]],
"cungKhiLuan|Tài Bạch":[["Sở Hoàng","Nhóm mỹ tài tinh (Lộc Tồn, Vũ Khúc, Hữu Bật, Tả Phụ) phải có cung khí đắc vị mới thành giàu; nếu cung khí đại hung nhưng đại vận lúc trẻ mạnh thì vẫn có thể làm giàu; muốn đoán tài sản thì xét cung khí, can chi cùng đại vận.","Bạn có xu hướng giàu lên theo từng giai đoạn chứ không đều suốt đời. Nhận ra giai đoạn thuận để tích lũy mạnh tay là điều quan trọng nhất.","trung"]],
"cungKhiLuan|Điền Trạch":[["Sở Hoàng","Cung khí Điền Trạch đại cát thì cuộc đời có nhà đất, không phải ở thuê; đại hung thì điền sản suy hoặc giá trị thấp trừ khi đại vận cứu; dùng để đoán số lượng, thời điểm sở hữu nhà đất; phải phối Mệnh, Thân, Tài và đại vận.","Bạn có xu hướng gắn chuyện an cư với từng giai đoạn cụ thể của đời. Theo dõi thời điểm thuận lợi để mua sắm tài sản lớn sẽ giúp bạn quyết đúng.","trung"]],
"cungKhiLuan|Phụ Mẫu":[["Sở Hoàng","Chỉ xem sao chỉ biết quan hệ với cha mẹ; cần cung khí để biết cha mẹ hanh thông, phú quý; cung khí đại hung thường cha mẹ không phát đạt hoặc sức khỏe kém.","Bạn có xu hướng sớm phải tự lo và ít trông vào nền tảng từ cha mẹ. Chủ động quan tâm sức khỏe của cha mẹ và tự xây nền cho mình là hướng đi tốt.","trung"]],
"cungKhiLuan|Huynh Đệ":[["Sở Hoàng","Cung khí Huynh Đệ đại hung thường ít anh em trai, anh em vận không thuận; hợp tác, mượn tiền, kết bạn cần xét đại hạn và lưu niên.","Bạn có xu hướng phải tự lực nhiều hơn là trông vào anh chị em. Hãy hợp tác có giấy tờ rõ ràng và chọn đúng thời điểm thuận để cùng làm.","trung"]],
"cungKhiLuan|Tật Ách":[["Sở Hoàng","Mệnh, Thân là gốc, Tật Ách là phụ; Hóa Kỵ ở Tật Ách là dấu hiệu bất lợi; hành của cung khí cho biết thể trạng và loại bệnh cần phòng.","Bạn có xu hướng cần chú ý giữ gìn thể lực đều đặn. Ngủ đủ, vận động vừa sức và khám định kỳ là thói quen đáng đầu tư nhất.","trung"]],
"cungKhiLuan|Phu Thê":[["Sở Hoàng","Luận hôn nhân không thể chỉ dựa vào sao hay cung khí, phải kết hợp đại vận và can cung; cung khí đại hung kèm Thái Âm/Thái Dương/Hóa Kỵ thường kết hôn muộn.","Bạn có xu hướng có chuyện tình cảm chín muộn và cần thời gian tìm hiểu. Không vội vàng, chọn người hợp giá trị sống sẽ giúp hôn nhân bền vững.","trung"]],
"cungKhiLuan|Thiên Di":[["Sở Hoàng","Xét cung khí Thiên Di để biết có xe cộ không, hình ảnh của mình trước đám đông ra sao, có phải xa quê mới làm nên chuyện; nên đối chiếu thêm đại vận và lưu niên.","Bạn có xu hướng phát triển tốt hơn khi bước ra môi trường rộng. Chăm chút hình ảnh và uy tín bên ngoài sẽ mở thêm nhiều cơ hội.","trung"]],
"cungKhiLuan|Quan Lộc":[["Sở Hoàng","Cung Quan Lộc dùng để xét việc học lúc nhỏ, đường sự nghiệp, lúc nào lập nghiệp, khi nào lên chức hay đổi việc; chủ tinh là hỉ thần mà cung khí đại cát thì học vấn cao, còn chủ tinh là kỵ thần thì phải chờ đại vận tốt.","Bạn có xu hướng tiến bộ rõ trong học tập và sự nghiệp khi gặp đúng giai đoạn. Đầu tư học thêm trong lúc thuận sẽ cho kết quả gấp nhiều lần.","trung"]],
"cungKhiLuan|Phúc Đức":[["Sở Hoàng","Phúc Đức nên luận bằng sao (lao lực hay nhàn hạ, chăm hay lười); cung khí chỉ cho biết mức độ hưởng thụ, ít giá trị thực tiễn.","Bạn có xu hướng tìm niềm vui theo cách riêng của mình. Hiểu mình thích gì và dành thời gian cho nó là cách nuôi dưỡng tinh thần tốt nhất.","trung"]],
"cungKhiLuan|Nô Bộc":[["Sở Hoàng","Cung Nô Bộc phản ánh năng lực của bạn bè, người dưới quyền và tài lãnh đạo của đương số; người kinh doanh lớn thường có Nô Bộc vững.","Bạn có xu hướng thành công nhiều hay ít tùy vào những người mình quy tụ được. Đầu tư vào việc chọn người và giữ người là đầu tư sinh lời lâu dài.","trung"]],
"cungKhiLuan|Tử Tức":[["Sở Hoàng","Phải kết hợp cung khí, sao và lá số phối ngẫu mới luận chuyện con cái; không đoán chỉ từ một cung.","Bạn có xu hướng gắn bó với con trẻ theo cách rất riêng. Dành thời gian lắng nghe sẽ giúp mối quan hệ cha mẹ con cái thêm gần gũi.","trung"]],
"canTDN|thuong":[["Ông Phúc Dụ","Can cung thuộc thượng đẳng (Giáp, Ất, Bính): được cộng điểm khi chấm xí hoa; Giáp 'Thiên chi Thiên' chủ tự lập, tự cường; Ất 'Thiên chi Địa' chủ mềm mỏng, được nữ giới trợ giúp.","Bạn có xu hướng có sẵn một lợi thế tự nhiên ở mảng này. Biết tận dụng nó sớm sẽ giúp bạn đi trước người khác một bước.","cat"]],
"canTDN|trung":[["Ông Phúc Dụ","Can cung thuộc trung đẳng (Đinh, Mậu, Kỷ): cát hung đan xen; Kỷ thuộc tầng Nhân, mức trung.","Bạn có xu hướng gặt hái vừa phải, đều đặn ở mảng này. Sự bền bỉ sẽ quyết định bạn tiến xa đến đâu.","trung"]],
"canTDN|ha":[["Ông Phúc Dụ","Can cung thuộc hạ đẳng (Canh, Tân, Nhâm): bị trừ điểm; Tân 'Địa lợi hạ đẳng', Nhâm 'Nhân chi Nhân' chủ độc lập, tự phụ, không chịu thiệt.","Bạn có xu hướng phải tự xoay xở ở mảng này mà ít được nâng đỡ. Rèn kỹ năng và giữ thái độ cầu thị sẽ biến bất lợi thành sức mạnh riêng.","trung"]],
"canCung|Mệnh|Kỷ":[["Ma Y Cung","Mệnh can Kỷ: nội hàm, nhẫn nhịn, hay giúp người; dễ bị lừa hoặc hao tiền nhưng đời sống thường ổn định.","Bạn thuộc mẫu người kín đáo, nhẫn nại và sẵn lòng giúp người. Hãy học cách nói không với những lời nhờ vả về tiền để giữ được sự ổn định của mình.","trung"]],
"canCung|Mệnh|Canh":[["Ma Y Cung","Can Canh ở Mệnh: tính độc lập, trọng hiệp nghĩa, cứng rắn, ưa hơn thua; giúp ai thì không mong đền đáp.","Bạn thuộc mẫu người thẳng thắn, trọng nghĩa và dám đứng ra giúp người. Mềm mỏng hơn trong lời nói sẽ giúp lòng tốt của bạn được đón nhận trọn vẹn.","cat"]],
"canCung|Mệnh|Ất":[["Ma Y Cung; Ông Phúc Dụ","Mệnh can Ất: mềm mỏng, hòa nhã, thích nghi tốt, thường được nữ giới che chở trợ giúp nhưng vẫn độc lập, sống vui.","Bạn thuộc mẫu người mềm mỏng, dễ hòa nhập và hay được người khác giúp đỡ. Giữ sự độc lập trong quyết định sẽ giúp bạn không bị phụ thuộc.","cat"]],
"snToa|Lộc|Mệnh":[["Nhiều tác giả","Hóa Lộc năm sinh tọa Mệnh: duyên tốt, lạc quan, ăn nói khéo, có phúc; nhược điểm là có thể thiếu chủ kiến, dễ bận rộn và hơi tự tư.","Bạn thuộc mẫu người vui vẻ, dễ mến và thường gặp may. Hãy rèn thêm sự quyết đoán để không bị cuốn theo ý người khác.","cat"],["Kinh nghiệm cao thủ Bắc phái","Khi Hóa Lộc tại Mệnh mà sao mang Lộc thuộc hành kỵ thần thì điểm xí hoa vẫn bị trừ: hung nhiều hơn cát dù có Lộc.","Bạn có xu hướng có nhiều cơ hội nhưng không phải cơ hội nào cũng hợp với mình. Chọn lọc kỹ trước khi nhận việc sẽ giúp bạn tránh bận rộn vô ích.","trung"]],
"phi|Mệnh|Lộc|Tử Tức":[["Lai Nhân Cung; Trung Châu; giáo trình Tứ Hóa","Lộc phi từ Mệnh nhập Tử Tức (Lộc Tử): hợp với trẻ nhỏ, bao dung, giao tiếp dễ dàng; lưu ý chuyện quá chiều con và những mối tình ngoài lề.","Bạn thuộc mẫu người thương trẻ nhỏ và dễ gần gũi với người khác. Thương con nhưng đặt ranh giới rõ, đồng thời giữ chừng mực trong các mối quan hệ khác giới sẽ giữ được sự êm ấm.","cat"]],
"phi|Mệnh|Quyền|Huynh Đệ":[["","Quyền phi từ Mệnh nhập Huynh Đệ (Quyền Bào): nhiều chủ kiến, ưa quản anh em và bạn thân; dễ sinh tranh quyền, thị phi. Xét theo đại vận thì đây cũng là kiểu 'Khai quán nhân', có thành tựu trên trục Huynh–Nô.","Bạn có xu hướng muốn dẫn dắt và quyết định thay cho anh chị em, bạn thân. Lắng nghe ý họ trước khi quyết sẽ giữ được hòa khí mà vẫn phát huy vai trò của bạn.","trung"]],
"phi|Mệnh|Khoa|Phúc Đức":[["","Khoa phi từ Mệnh nhập Phúc Đức (Khoa Phúc): tính điềm tĩnh, thiên về lý trí, tiền bạc ổn; gặp lúc gấp rút thì có quý nhân ra tay.","Bạn thuộc mẫu người điềm tĩnh, suy nghĩ có lý lẽ. Giữ sự bình tâm ấy trong lúc khó khăn, người giúp đỡ sẽ xuất hiện đúng lúc.","cat"]],
"phi|Mệnh|Kỵ|Quan Lộc":[["","Kỵ phi từ Mệnh nhập Quan Lộc (Kỵ Quan), thuộc dạng Thuận thủy Kỵ: dồn tâm sức cho sự nghiệp nên dễ lơ là tình cảm vợ chồng; đi làm công thích hợp hơn tự kinh doanh.","Bạn có xu hướng đặt công việc lên hàng đầu và gánh trách nhiệm rất nặng. Hãy dành thời gian cố định cho gia đình để sự nghiệp và tình cảm cùng vững.","trung"],["","Trường hợp sao hóa Kỵ là Văn Khúc (can Kỷ): khó bước chân vào nhà quyền quý, nơi ở hay đổi.","Bạn có xu hướng hay đổi chỗ ở theo công việc. Chọn nơi sống gần chỗ làm và ổn định lâu sẽ giúp bạn đỡ hao sức.","trung"]],
"phi|Mệnh|Lộc|Quan Lộc":[["Lương phái","Mệnh phi Lộc nhập Quan Lộc (Lộc Quan): công việc trôi chảy, nhưng thành tựu lớn nhỏ còn tùy cách cục.","Bạn có xu hướng gặp thuận lợi trong công việc. Đặt mục tiêu rõ ràng sẽ biến sự thuận lợi đó thành thành tựu thật.","cat"],["Huy Hà Phan","Luôn tìm cách kiếm tiền, nhiều ý tưởng, sự nghiệp cao nhưng dễ chểnh mảng, lơ là.","Bạn thuộc mẫu người nhiều ý tưởng và nhạy với cơ hội. Theo đuổi đến cùng một hai ý tưởng tốt nhất sẽ hiệu quả hơn ôm đồm nhiều việc.","cat"],["Phương Ngoại Nhân","Có công việc nhưng không chắc làm đến cùng, hoặc là việc nhàn.","Bạn có xu hướng thích công việc nhẹ nhàng, dễ chịu. Chọn một hướng đi dài hạn và kiên trì sẽ giúp bạn có chỗ đứng vững.","trung"],["Lai Nhân Cung","Tự đứng trên chân mình, chịu khó làm, có óc sáng tạo, dễ hòa nhập nhưng thiếu sức ép để bứt lên.","Bạn thuộc mẫu người tự lực, sáng tạo và dễ hợp tác. Tự đặt cho mình hạn chót và mục tiêu sẽ giúp bạn phát huy hết khả năng.","cat"],["Trung Châu","Nặng về sự nghiệp, hay thay đổi công việc, làm không chuyên nhất, quan tâm vợ/chồng.","Bạn có xu hướng dồn nhiều tâm sức cho công việc và hay đổi hướng. Chọn một chuyên môn để đào sâu sẽ đưa bạn đi xa hơn.","trung"],["Lương Nhược Du","Lạc quan, gặp may, dễ tìm được việc vừa ý, song nhiệt huyết khó giữ được lâu.","Bạn thuộc mẫu người may mắn tìm được việc hợp ý. Nuôi dưỡng đam mê bằng những thử thách mới sẽ giữ lửa lâu dài.","cat"],["Tử vi đẩu số tinh hoa","Việc bận rộn, lên chức nhiều lần, buôn bán thuận lợi, hết lòng chăm chút bạn đời; nếu Lộc rơi vào Vũ Khúc thì đi đường dài, thành tựu về tiền bạc nhưng đến muộn.","Bạn có xu hướng thăng tiến đều nhờ chăm chỉ và biết quan tâm người bên cạnh. Kiên nhẫn với thành quả muộn sẽ được đền đáp xứng đáng.","cat"]],
"phi|Mệnh|Quyền|Quan Lộc":[["Huy Hà Phan","Quyền phi từ Mệnh nhập Quan Lộc (Quyền Quan): năng nổ, muốn điều hành và nắm chặt công việc, giàu tham vọng; đôi khi tản mạn, đi lệch trọng tâm.","Bạn thuộc mẫu người có chí tiến thủ và muốn làm chủ công việc. Tập trung vào việc chính sẽ giúp tham vọng của bạn thành kết quả.","cat"],["Lai Nhân Cung; Trung Châu","Theo đuổi thành công, thích lãnh đạo, dễ thăng tiến; có thể áp đặt hoặc quản thúc người thân, người phối ngẫu.","Bạn có xu hướng mang phong cách chỉ huy từ chỗ làm về nhà. Ở nhà hãy để người thân cùng quyết, như vậy gia đình sẽ là nơi bạn được nghỉ ngơi thật sự.","trung"],["Lương Nhược Du","Tự tin, nhiều mưu kế, hợp vai quản lý; khi Quyền gặp Kỵ thì dễ hành động liều.","Bạn thuộc mẫu người tự tin và nhiều mưu lược. Cân nhắc rủi ro kỹ trước khi quyết lớn sẽ giúp bạn tránh những bước liều.","cat"],["Tử vi đẩu số tinh hoa","Có trách nhiệm, có chí sáng nghiệp, thiên về quản lý, học giỏi; nếu sao Quyền là Tham Lang thì thích nắm quyền tài chính, quản tiền theo ý mình.","Bạn có xu hướng muốn tự gây dựng và tự quản lý mọi việc, kể cả tiền bạc. Minh bạch chi tiêu với người cùng làm sẽ giữ được lòng tin lâu dài.","cat"]],
"phi|Mệnh|Khoa|Tật Ách":[["Huy Hà Phan","Mệnh phi Khoa nhập Tật Ách (Khoa Tật): lý trí, lễ độ, biết chăm sóc sức khỏe, thân thể hài hòa ít bệnh, khi bệnh dễ gặp thầy giỏi.","Bạn thuộc mẫu người biết giữ gìn bản thân và cư xử nhã nhặn. Duy trì thói quen chăm sóc sức khỏe đều đặn sẽ giữ được sự cân bằng này lâu dài.","cat"],["Lai Nhân Cung","Tư chất tốt, sáng dạ, song thể lực có thể không dồi dào, cần biết tập trung.","Bạn có xu hướng mạnh về trí tuệ hơn sức bền. Rèn thể lực vừa sức sẽ giúp bạn theo kịp những ý tưởng của mình.","trung"],["Trung Châu; Phương Ngoại Nhân","Thể chất tốt, được quý nhân giúp, tính hiền hòa, lễ độ, thích tìm thầy học dưỡng sinh.","Bạn thuộc mẫu người hiền hòa, được người khác quý mến. Tìm hiểu cách sống lành mạnh sẽ là món quà lớn cho chính bạn.","cat"],["Lương Nhược Du","Dáng vẻ ưu nhã, có bệnh thì chữa được; tính chậm, thiếu quyết liệt.","Bạn thuộc mẫu người từ tốn, thanh lịch. Đôi lúc cần quyết nhanh hơn để không lỡ cơ hội.","trung"]],
"phi|Mệnh|Kỵ|Tài Bạch":[["Lương phái","Kỵ phi từ Mệnh nhập Tài Bạch (Kỵ Tài), thuộc Thuận thủy Kỵ: chú tâm tới tiền, gắng sức kiếm tiền, tính toán nhiều.","Bạn có xu hướng rất để tâm đến tiền bạc và chăm chỉ kiếm tiền. Sự chu đáo đó tốt, chỉ cần đừng để nó lấy mất niềm vui sống.","trung"],["Huy Hà Phan","Ham tiền, biết tiết kiệm nhưng kiếm khó, hay phải vay mượn; bám chặt chuyện tiền nong, sẵn lòng hy sinh vì tài chính.","Bạn có xu hướng gánh phần vất vả về tiền bạc cho mình. Lập ngân sách rõ ràng và tránh vay mượn sẽ giúp bạn nhẹ gánh hơn.","hung"],["Phương Ngoại Nhân","Giữ của, khó tiêu tiền cho bản thân; nhưng cần xem thêm cung khác mới kết luận.","Bạn thuộc mẫu người giữ của cẩn thận, ít chi cho chính mình. Thỉnh thoảng thưởng cho bản thân cũng là cách tiếp sức để đi đường dài.","trung"],["Lai Nhân Cung; Tử vi đẩu số tinh hoa","Hay lo, chi tiêu chặt chẽ, kiếm tiền cực nhọc; đời sống tinh thần kém vui, ít hưởng thụ.","Bạn có xu hướng lo xa về tiền nên khó thảnh thơi. Dành một khoản nhỏ cố định cho niềm vui sẽ giúp tinh thần nhẹ hơn mà không ảnh hưởng tiết kiệm.","hung"],["Trung Châu","Kiếm tiền cực, dễ thất thoát, vợ chồng khó êm vì chuyện tiền.","Bạn có xu hướng gặp căng thẳng trong gia đình xoay quanh chuyện tiền. Bàn bạc minh bạch các khoản chi với người bạn đời sẽ giảm hẳn va chạm.","hung"],["Lương Nhược Du","Chăm chỉ kiếm tiền, tính toán, làm nhiều việc cùng lúc, dễ mạo hiểm vì tiền.","Bạn thuộc mẫu người siêng năng, dám làm nhiều việc để kiếm thêm. Tránh những vụ làm ăn quá rủi ro là cách giữ thành quả.","trung"],["Ông Phúc Dụ","Tiền làm ra chỉ vừa đủ chi dùng; không coi đây là điềm xấu.","Bạn có xu hướng có thu nhập vừa đủ cho nhu cầu. Sống trong khả năng và tích lũy dần là đủ để an tâm.","trung"]],
"phi|Mệnh|Lộc|Tật Ách":[["Nhiều tác giả","Lộc phi từ Mệnh nhập Tật Ách (Lộc Tật): cơ thể khỏe, ưa thoải mái, có điều ngại vận động nên dễ tăng cân.","Bạn thuộc mẫu người biết tận hưởng và thích sự thoải mái. Duy trì vận động đều đặn sẽ giữ được thể trạng tốt lâu dài.","cat"]],
"phi|Mệnh|Quyền|Thiên Di":[["Nhiều tác giả","Mệnh phi Quyền nhập Thiên Di (Quyền Di): năng lực, quyết đoán, thích lãnh đạo ở bên ngoài; dễ tự phụ, kết oán.","Bạn thuộc mẫu người tự tin và muốn khẳng định mình ngoài xã hội. Khiêm tốn hơn một chút sẽ giúp bạn có thêm đồng minh thay vì đối thủ.","trung"]],
"phi|Mệnh|Khoa|Điền Trạch":[["Nhiều tác giả","Khoa phi từ Mệnh nhập Điền Trạch (Khoa Điền): nhà cửa ngăn nắp, thanh nhã; trong nhà êm ấm.","Bạn thuộc mẫu người yêu sự ngăn nắp và không khí êm ấm trong nhà. Giữ nếp sống ấy sẽ là nguồn bình yên cho cả gia đình.","cat"]],
"phi|Mệnh|Kỵ|Nô Bộc":[["Nhiều tác giả","Kỵ phi từ Mệnh nhập Nô Bộc (Kỵ Nô), thuộc Thuận thủy Kỵ: trọng nghĩa khí, quý bạn bè, hay chi tiền cho bạn, dễ bị kéo vào rắc rối, hao tốn tiền bạc; sức cạnh tranh yếu, nên làm việc thiện, tích đức.","Bạn thuộc mẫu người trọng tình nghĩa, sẵn lòng vì bạn bè. Hãy tách bạch tình bạn với tiền bạc và chọn bạn kỹ để lòng tốt không thành gánh nặng.","trung"]],
"phi|Mệnh|Quyền|Tử Tức":[["Lai Nhân Cung 144 quyết; giáo trình Tứ Hóa","Quyền phi từ Mệnh nhập Tử Tức (Quyền Tử): dạy con nghiêm khắc, khi hợp tác muốn cầm quyền; nên tránh độc đoán và chuyện tình cảm bên ngoài.","Bạn có xu hướng nghiêm khắc với con trẻ và muốn làm chủ khi hợp tác. Mềm mỏng hơn sẽ giúp con nghe lời và đối tác tin tưởng hơn.","trung"]],
"phi|Mệnh|Khoa|Phu Thê":[["Nhiều giáo trình","Khoa phi từ Mệnh nhập Phu Thê (Khoa Phối): người bạn đời có khí chất, tình duyên bền lâu; nên đề phòng người thứ ba.","Bạn có xu hướng trân trọng người bạn đời và giữ tình cảm lâu bền. Quan tâm đều đặn và minh bạch trong các mối quan hệ khác sẽ giữ được sự êm ấm.","cat"]],
"mchat|Mệnh|chat":[["Trịnh Mục Đức","Mệnh có M chất (có Tứ Hóa năm sinh tọa): dựa vào nỗ lực bản thân trước, sau mới có quý nhân.","Bạn thuộc mẫu người phải tự đi những bước đầu tiên. Khi đã chứng tỏ được mình, sự giúp đỡ sẽ tự tìm đến.","cat"]],
"mchat|Mệnh|Quan Lộc":[["Trịnh Mục Đức","M Quan có ở Mệnh: có chuyên môn, sự nghiệp dễ thành.","Bạn có xu hướng tìm thấy giá trị bản thân qua công việc. Đầu tư vào chuyên môn là con đường ngắn nhất để thành công.","cat"]],
"mchat|Mệnh|Tài Bạch":[["Trịnh Mục Đức","M Tài có ở Mệnh: giỏi kiếm tiền, tiền bạc dư dả.","Bạn thuộc mẫu người nhạy bén với chuyện kiếm tiền. Học thêm cách giữ và đầu tư sẽ giúp thành quả bền hơn.","cat"]],
"mchat|Mệnh|Tật Ách":[["Trịnh Mục Đức","M Tật có ở Mệnh: việc làm cực nhọc, hay phải làm một mình.","Bạn có xu hướng tự gánh việc và quen làm một mình. Học cách giao việc và nhờ hỗ trợ sẽ giúp bạn đỡ mệt mà làm được nhiều hơn.","trung"]],
"mchat|Mệnh|Nô Bộc":[["Trịnh Mục Đức","Mệnh có M Nô: bạn bè là quý nhân của đương số.","Bạn có xu hướng được bạn bè giúp đỡ vào những lúc quan trọng. Giữ gìn các mối quan hệ tốt chính là giữ vận may của mình.","cat"]],
"mchat|Mệnh|Phu Thê":[["Trịnh Mục Đức","Mệnh có M Phối: người phối ngẫu là quý nhân.","Bạn có xu hướng được người bạn đời nâng đỡ nhiều. Trân trọng và cùng nhau lên kế hoạch sẽ giúp cả hai cùng tiến.","cat"]],
"mchat|Mệnh|Tử Tức":[["Trịnh Mục Đức","Mệnh có M Tử: con cái (hoặc đối tác, người nhỏ tuổi) là quý nhân; có con thì đời nhiều màu sắc.","Bạn có xu hướng tìm thấy niềm vui và động lực từ thế hệ trẻ bên mình. Dành thời gian đồng hành với họ cũng là cách làm mới chính bạn.","cat"]],
"cach|Văn quế văn hoa":[["","Văn Khúc và Văn Xương cùng hội ở Mệnh: sáng dạ, ham học, có khiếu văn chương nghệ thuật, dễ có danh; kỵ gặp sát tinh và Hóa Kỵ.","Bạn thuộc mẫu người sáng dạ, yêu chữ nghĩa và cái đẹp. Theo đuổi học tập, viết lách hay nghệ thuật sẽ giúp bạn tỏa sáng.","cat"]],
"cach|Cơ Cự đồng lâm":[["","Cự Môn và Thiên Cơ đồng cung ở Mệnh: giỏi nghiên cứu, có tài ăn nói nhưng nhiều thị phi; lúc trẻ vất vả, đến trung niên mới khởi sắc.","Bạn thuộc mẫu người lý luận sắc sảo và ham tìm hiểu. Chọn lời cẩn thận sẽ giúp tài ăn nói của bạn thành lợi thế thay vì gây hiểu lầm.","trung"]],
"cach|Lộc hợp uyên ương":[["","Hóa Lộc và Lộc Tồn cùng ở Mệnh: tiền của dồi dào, song đừng cậy giàu mà kiêu.","Bạn có xu hướng có điều kiện vật chất khá. Giữ sự khiêm tốn sẽ giúp bạn được quý trọng và giữ của lâu.","cat"]],
"cach|Phủ Tướng triều viên":[["Từ Tăng Sinh","Thiên Tướng, Thiên Phủ triều Mệnh: được bề trên quý, dễ được cất nhắc; ngoài cứng trong mềm, dễ mất lòng đồng nghiệp. Mệnh vô chính diệu mà có Phủ Tướng hội chiếu thì vật chất đầy đủ.","Bạn có xu hướng được cấp trên tin tưởng và nâng đỡ. Hòa nhã với đồng nghiệp ngang hàng sẽ giúp con đường thăng tiến bằng phẳng hơn.","cat"]],
"sao|Vô chính diệu|Mệnh":[["Khai quán nhân; Từ Tăng Sinh","Mệnh vô chính diệu: phải mượn sao Thiên Di và xem thêm Phụ Mẫu; tuổi nhỏ nhiều biến đổi, lớn lên có thể thành đạt.","Bạn thuộc mẫu người linh hoạt, dễ thích nghi theo hoàn cảnh. Xây dựng vài giá trị cốt lõi cho riêng mình sẽ giúp bạn vững vàng hơn khi trưởng thành.","trung"]],
"sao|Cự Môn|Mệnh":[["Nhiều tác giả","Cự Môn tại Mệnh: 'ám tinh' che ánh sáng sao khác, chủ thị phi, khẩu thiệt, đa nghi; tốt xấu tùy miếu hãm và sao đi kèm (gặp Thái Dương, Lộc thì hóa giải).","Bạn thuộc mẫu người nói thẳng và hay đặt câu hỏi. Chọn thời điểm và cách nói khéo sẽ biến sự thẳng thắn thành điểm mạnh.","trung"]],
"sao|Lộc Tồn|Mệnh":[["Nhiều tác giả","Lộc Tồn ở Mệnh: chủ chính tài, tính phúc hậu, có tiền, hợp việc ổn định; về hình tướng thì các nguồn luận không thống nhất.","Bạn thuộc mẫu người hiền hậu, kiếm tiền bằng con đường chính đáng. Công việc ổn định lâu dài là nơi bạn phát huy tốt nhất.","cat"]],
"sao|Liêm Trinh|Mệnh":[["Vũ Mê Linh","Liêm Trinh tại Mệnh: có chí khí, thẳng thắn, chăm chỉ, tự trọng; hợp chính trị, công chức, có Lộc thì hợp tài chính.","Bạn thuộc mẫu người có nguyên tắc và lòng tự trọng cao. Môi trường có quy củ rõ ràng sẽ giúp bạn phát huy hết khả năng.","cat"],["Hà Lạc phái; Trần Bỉnh Húc; Sở Hoàng","Liêm Trinh là thứ đào hoa, chủ tình cảm; gặp Kỵ thì tình cảm dễ tổn thương, hiếu thắng, dễ quá đà; gặp sát tinh dễ cờ bạc, kiện tụng; Lộc vào Liêm Trinh thì bảo thủ, hợp việc ổn định.","Bạn có xu hướng sống tình cảm mãnh liệt và không chịu thua. Giữ chừng mực trong cảm xúc và tránh những trò may rủi sẽ giúp bạn tránh được rắc rối.","trung"],["Phi tinh Trần Đoàn; Vương Đình Chi","Khí chất ngang tàng, cần Thiên Tướng hoặc Lộc Tồn chế hóa; hội cát thì phong nhã, hội hung thì lệch lạc.","Bạn thuộc mẫu người mạnh mẽ, có cá tính riêng. Gần gũi những người điềm đạm, chính trực sẽ giúp cá tính ấy đi đúng hướng.","trung"],["Sở Hoàng","Liêm Trinh chủ đào hoa, quan lộc, đầu cơ, phóng túng; khi Liêm hành Hỏa là hỉ thần nên làm dịch vụ; thời điểm xét theo đại vận.","Bạn có xu hướng hợp với công việc giao tiếp, phục vụ con người. Chọn ngành dịch vụ và chờ giai đoạn thuận sẽ cho kết quả tốt.","trung"]],
"sao|Phá Quân|Mệnh":[["Vũ Mê Linh; Nhiều tác giả","Phá Quân tại Mệnh: chính trực, hay đổi ý, thích cái mới, hiếu thắng, phần lớn xa quê; hợp kinh doanh, kỹ thuật, quân đội.","Bạn thuộc mẫu người thích đổi mới và không ngại bắt đầu lại. Hoàn thành trọn vẹn từng việc trước khi chuyển sang việc mới sẽ giúp bạn đi xa.","trung"],["Hà Lạc phái","Thời trẻ vất vả, đầu khó sau dễ; có thể thành lớn hoặc bại lớn; nữ mệnh dễ gặp rắc rối chuyện tình duyên.","Bạn có xu hướng có cuộc đời nhiều thăng trầm, càng về sau càng vững. Tránh đặt cược tất cả vào một lần sẽ giữ cho bạn luôn có đường lui.","trung"],["Tam Hợp phái; Vương Đình Chi","Có Lộc thì có gốc rễ; gặp Kình Đà, Hỏa Linh thì hại, dễ suy sụp; thiếu hung tinh thì sáng tạo; hội cát cương nghị, hội hung hao tán.","Bạn thuộc mẫu người giàu năng lượng sáng tạo. Chọn môi trường ổn định và người đồng hành điềm tĩnh sẽ giúp năng lượng đó có ích nhất.","trung"],["Phụ lục cohoc","Phá Quân nhập Mệnh: kiêu ngạo, khó chịu quản thúc, độc đoán; miếu vượng thì cương cường, có chủ kiến; hãm thì cực đoan; Sát Phá Tham hội chiếu chủ cải cách, khai sáng; hội Lộc Mã thì phú quý.","Bạn có xu hướng thích tự do và không ưa bị kiểm soát. Tự đặt kỷ luật cho mình sẽ giúp bạn vừa tự do vừa thành công.","trung"]],
"sao|Thiên Riêu|Mệnh":[["Vương Đình Chi","Thiên Riêu (hành Thủy) tại Mệnh: phong lưu, dễ vướng họa sắc tình; kỵ đóng ở Sửu, Mùi.","Bạn thuộc mẫu người có sức hút với người khác. Giữ chừng mực và rõ ràng trong các mối quan hệ sẽ tránh được phiền phức.","trung"]],
"sao|Thất Nhân|Mệnh":[["Dương Trinh Tường","Mệnh có Thất nhân: tự đề cao bản thân, phúc họa tự chịu; ở Phu Thê thì coi trọng tình cảm và sắc đẹp.","Bạn thuộc mẫu người tự tin, tự chịu trách nhiệm cho lựa chọn của mình. Lắng nghe thêm người khác sẽ giúp những lựa chọn đó chín chắn hơn.","trung"]],
"snToa|Kỵ|Phu Thê":[["Nhiều tác giả","Hóa Kỵ năm sinh tọa Phu Thê: hôn nhân căng thẳng, ít giao tiếp, tiền của người phối ngẫu đi chỗ khác; nên kết hôn muộn. Nếu tại Thìn Tuất Sửu Mùi thì thành Nhập khố Kỵ.","Bạn có xu hướng mang nhiều trăn trở và trách nhiệm trong chuyện vợ chồng. Kết hôn khi đã đủ chín chắn và trò chuyện cởi mở thường xuyên sẽ giúp hôn nhân vững.","hung"],["Trần Bỉnh Húc","Kỵ tại Tý, Sửu ở Phu Thê kèm Thiên Hình: hay cãi vã; hội thêm sao xấu thì dễ chia ly.","Bạn có xu hướng dễ va chạm trong lời nói với người bạn đời. Học cách tạm dừng khi nóng giận là kỹ năng quý giá nhất cho hôn nhân.","hung"]],
"canCung|Phu Thê|Đinh":[["","Can Đinh ở Phu Thê: bạn đời có cá tính độc lập, nghĩ kỹ nhưng hay toan tính.","Bạn có xu hướng chọn người bạn đời độc lập và chín chắn. Tôn trọng không gian riêng của nhau sẽ giúp hai người gắn bó hơn.","trung"]],
"canCung|Phu Thê|Quý":[["Ông Phúc Dụ","Phu Thê ở Tị, can Quý: trước trung niên hôn nhân có thể phải bôn ba; can Quý dễ hao tổn, dễ lâm vào bế tắc.","Bạn có xu hướng có chuyện tình cảm ổn định dần sau tuổi trẻ nhiều xê dịch. Kiên nhẫn và cùng nhau đặt mục tiêu chung sẽ giúp vượt qua giai đoạn đầu.","trung"]],
"phi|Phu Thê|Kỵ|Quan Lộc":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Phu Thê phi Kỵ nhập Quan Lộc (Tiết xuất Kỵ, tự xung Phu Thê): người phối ngẫu không ở lâu bên mình, hay vì công việc mà xa; biến cố hôn nhân hiện ra trong vận tương ứng.","Bạn có xu hướng có người bạn đời bận rộn hoặc hay vắng nhà vì công việc. Giữ những khoảng thời gian chung cố định sẽ giữ được sự gắn kết.","hung"]],
"phi|Phu Thê|Quyền|Huynh Đệ":[["","Phu Thê phi Quyền nhập Huynh Đệ (Quyền Bào): người phối ngẫu giỏi giang, quản tài chính gia đình; sự nghiệp thành công.","Bạn có xu hướng có người bạn đời năng động, giỏi lo liệu. Phân chia vai trò rõ ràng sẽ giúp hai người phối hợp ăn ý.","cat"]],
"phi|Phu Thê|Khoa|Phúc Đức":[["","Khoa phi từ Phu Thê nhập Phúc Đức (Khoa Phúc): bạn đời thanh nhã, xem trọng đời sống tinh thần, có giúp đỡ về tiền bạc.","Bạn có xu hướng có người bạn đời tinh tế, biết vun đắp tinh thần. Cùng nhau nuôi một sở thích chung sẽ làm tình cảm thêm sâu.","cat"]],
"phi|Phu Thê|Lộc|Tử Tức":[["","Phu Thê phi Lộc nhập Tử Tức (Lộc Tử): người phối ngẫu yêu con, gia đình ấm áp; cũng có nguy cơ bị cuốn hút ngoài hôn nhân.","Bạn có xu hướng có một gia đình ấm cúng, nhiều tiếng cười trẻ nhỏ. Giữ sự quan tâm dành cho nhau, không chỉ cho con, sẽ giúp hôn nhân luôn tươi mới.","cat"]],
"phi|Phu Thê|Khoa|Tật Ách":[["Đồng bộ đoạn quyết","Phu Thê phi Khoa nhập Tật Ách (Khoa Tật): người phối ngẫu không hời hợt, có chút địa vị xã hội.","Bạn có xu hướng chọn người bạn đời đứng đắn, có chỗ đứng. Sự tôn trọng lẫn nhau là nền móng của mối quan hệ này.","cat"],["Huy Hà Phan","Tình cảm tốt; người phối ngẫu thanh tú, tình cảm kín đáo, dây dưa.","Bạn thuộc mẫu người yêu sâu sắc nhưng kín đáo. Bày tỏ tình cảm rõ hơn sẽ giúp người kia hiểu và đáp lại bạn.","cat"],["Lai Nhân Cung","Người phối ngẫu quan tâm tinh thần, mệnh chủ thụ động.","Bạn có xu hướng để người kia chủ động trong tình cảm. Thỉnh thoảng chủ động quan tâm sẽ khiến mối quan hệ cân bằng hơn.","trung"],["Trung Châu","Người phối ngẫu hiền hòa, hiếu thuận, tôn trọng bạn bè của mình.","Bạn có xu hướng gặp người bạn đời hiền lành, biết cư xử. Trân trọng sự hiền hòa ấy sẽ giữ được không khí êm ả.","cat"],["Bản Hán-Việt","Tình cảm mềm mỏng, kín đáo, kiểu 'duyên đứt tình còn' – hay vương vấn người cũ.","Bạn có xu hướng khó dứt những tình cảm cũ. Khép lại quá khứ trọn vẹn sẽ giúp bạn sống trọn với hiện tại.","trung"]],
"phi|Phu Thê|Kỵ|Nô Bộc":[["Đồng bộ đoạn quyết","Kỵ phi từ Phu Thê nhập Nô Bộc (Kỵ Nô, Thuận thủy Kỵ): phát triển ra ngoài kém thuận, khó làm hàng xuất khẩu.","Bạn có xu hướng gặp trở ngại khi mở rộng ra bên ngoài. Củng cố nền tảng trong nước, trong nhà trước khi vươn xa là bước đi chắc chắn.","hung"],["Huy Hà Phan; Thiên Hỏa Đồng Nhân Hội","Người phối ngẫu chú ý bạn bè hơn mình, can thiệp vào bạn bè của mình, ảnh hưởng quan hệ xã hội.","Bạn có xu hướng thấy người bạn đời dành nhiều thời gian cho bạn bè. Thống nhất thời gian riêng và thời gian chung sẽ giảm những hờn dỗi không đáng có.","trung"],["Phương Ngoại Nhân","Đời sống chăn gối có lúc không hòa hợp.","Bạn có xu hướng cần nhiều sự thấu hiểu trong đời sống riêng tư. Trò chuyện cởi mở và tôn trọng nhịp của nhau sẽ giúp gần gũi hơn.","trung"],["Lai Nhân Cung","Hay va chạm với gia đình hai bên; tiền bạc và sức khỏe dễ chao đảo.","Bạn có xu hướng phải dung hòa giữa gia đình hai bên. Giữ thái độ công bằng và bàn bạc trước với người bạn đời sẽ tránh được va chạm.","hung"],["Trung Châu","Bạn đời thể lực yếu, bạn bè lắm thị phi, tiền bạc dễ hao hụt.","Bạn có xu hướng cần quan tâm nhiều hơn đến sức khỏe người bạn đời và cẩn trọng với bạn bè mới. Chọn lọc quan hệ sẽ giữ được sự yên ổn.","hung"],["Bản Hán-Việt","Bạn đời trọng tình nghĩa; hôn nhân dễ thấy bó buộc, sau cưới bạn bè thưa dần.","Bạn có xu hướng thu hẹp các mối quan hệ sau khi lập gia đình. Giữ vài tình bạn lâu năm sẽ giúp bạn có thêm điểm tựa tinh thần.","trung"]],
"phi|Phu Thê|Lộc|Điền Trạch":[["Huy Hà Phan","Lộc phi từ Phu Thê nhập Điền Trạch (Lộc Điền): cưới xin đem lại êm ấm, được gia đình chúc phúc, dễ có tài sản nhờ hôn nhân, vợ chồng tốt đẹp, dễ làm quen người thân và bạn bè của nhau.","Bạn có xu hướng có hôn nhân gắn với một tổ ấm vững vàng. Cùng nhau xây dựng tài sản chung sẽ khiến gia đình ngày càng sung túc.","cat"],["Phương Ngoại Nhân; Trung Châu","Người phối ngẫu hòa thuận với người nhà, chăm lo gia đình, hòa đồng, sự nghiệp có phát triển.","Bạn có xu hướng gặp người bạn đời biết vun vén gia đình. Ghi nhận và cảm ơn những đóng góp đó sẽ giữ được sự ấm áp.","cat"],["Lai Nhân Cung","Bạn đời chăm lo việc nhà, góp sức kiếm tiền; nên đề phòng lúc tiêu nhiều.","Bạn có xu hướng cùng người bạn đời gánh kinh tế gia đình. Lập ngân sách chung sẽ giúp chi tiêu không vượt tầm.","cat"],["Bản Hán-Việt (AI dịch; Thiên Hỏa Đồng Nhân Hội)","Kết hôn rồi mua nhà, sống hòa thuận; cần cảnh giác người khác giới hoặc bên thứ ba xen vào.","Bạn có xu hướng an cư sớm sau khi lập gia đình. Giữ sự minh bạch trong các mối quan hệ bên ngoài sẽ bảo vệ tổ ấm.","cat"]],
"phi|Phu Thê|Quyền|Điền Trạch":[["Huy Hà Phan; nhiều tác giả","Phu Thê phi Quyền nhập Điền Trạch (Quyền Điền): sau kết hôn dễ mua nhà, người phối ngẫu nắm quyền trong nhà, giỏi giữ nhà.","Bạn có xu hướng có người bạn đời đảm đang, quán xuyến việc nhà. Phân vai rõ ràng và tôn trọng tiếng nói của nhau sẽ giữ hòa khí.","cat"],["Lai Nhân Cung","Người thân tính cách mạnh, quản lý gia đình nghiêm.","Bạn có xu hướng sống trong gia đình có nề nếp chặt chẽ. Góp ý nhẹ nhàng khi cần sẽ giúp không khí gia đình thoải mái hơn.","trung"],["Trung Châu","Người phối ngẫu ra oai, nhưng có thể giúp mở tiệm, mua nhà; gia cảnh tốt, kiếm tiền thuận.","Bạn có xu hướng có người bạn đời mạnh mẽ và có năng lực làm kinh tế. Cùng nhau bàn bạc trước khi quyết việc lớn sẽ phát huy thế mạnh đó.","cat"]],
"phi|Phu Thê|Lộc|Quan Lộc":[["Nhiều tác giả","Lộc phi từ Phu Thê nhập Quan Lộc: bạn đời hậu thuẫn sự nghiệp; qua công việc có quan hệ với người khác giới, nên giữ mình tránh ngoại tình.","Bạn có xu hướng được người bạn đời giúp đỡ trong công việc. Giữ ranh giới rõ ràng với đồng nghiệp khác giới sẽ giữ được lòng tin.","cat"]],
"phi|Phu Thê|Khoa|Tài Bạch":[["Nhiều tác giả","Khoa phi từ Phu Thê nhập Tài Bạch: bạn đời quản tiền có kế hoạch, hôn nhân êm ổn.","Bạn có xu hướng có người bạn đời chi tiêu khéo léo. Giao bớt việc quản lý tiền cho người giỏi hơn là cách hai người cùng lợi.","cat"]],
"phi|Phu Thê|Kỵ|Tử Tức":[["Nhiều tác giả","Phu Thê phi Kỵ nhập Tử Tức: chuyện vợ chồng ảnh hưởng đến con cái; dễ có người thứ ba hoặc xa cách.","Bạn có xu hướng để căng thẳng vợ chồng ảnh hưởng tới không khí gia đình. Giải quyết bất đồng riêng tư, không để trẻ nhỏ chứng kiến, sẽ giữ gìn được tổ ấm.","hung"]],
"phi|Phu Thê|Khoa|Nô Bộc":[["Nhiều giáo trình","Phu Thê phi Khoa nhập Nô Bộc: có thành tựu bên ngoài nhờ quan hệ, người phối ngẫu có sự nghiệp riêng.","Bạn có xu hướng cùng người bạn đời mở rộng quan hệ xã hội. Hỗ trợ sự nghiệp riêng của nhau sẽ giúp cả hai cùng phát triển.","cat"]],
"phi|Phu Thê|Quyền|Tật Ách":[["Nhiều giáo trình","Phu Thê phi Quyền nhập Tật Ách: người phối ngẫu chi phối đời sống, tạo áp lực nhưng cũng chăm lo cho mình.","Bạn có xu hướng có người bạn đời quan tâm sát sao. Nói ra nhu cầu được tự chủ một cách nhẹ nhàng sẽ giúp hai bên thoải mái.","trung"]],
"phi|Phu Thê|Lộc|Phúc Đức":[["Nhiều giáo trình","Phu Thê phi Lộc nhập Phúc Đức: hôn nhân dễ thuận hòa, người phối ngẫu mang lại niềm vui tinh thần.","Bạn có xu hướng tìm thấy niềm vui sống bên người bạn đời. Cùng nhau tạo những trải nghiệm mới sẽ giữ cho tình cảm luôn tươi.","cat"]],
"phi|Phu Thê|Kỵ|Thiên Di":[["Nhiều giáo trình","Phu Thê phi Kỵ nhập Thiên Di (Thuận thủy Kỵ, khí Phu Thê tiết sang Thiên Di): báo bất hòa hoặc hôn nhân muộn, ảnh hưởng sự ổn định ngoài xã hội.","Bạn có xu hướng có chuyện tình cảm đến muộn hoặc cần nhiều thời gian dung hòa. Kiên nhẫn tìm hiểu và giữ sự tôn trọng sẽ giúp mối quan hệ bền.","hung"]],
"mchat|Phu Thê|Điền Trạch":[["Trịnh Mục Đức","Phu Thê có M Điền: người phối ngẫu có nhà đất, kết hôn sẽ có nhà.","Bạn có xu hướng an cư cùng lúc với lập gia đình. Cùng nhau giữ gìn tổ ấm là mục tiêu chung đáng đầu tư.","cat"]],
"mchat|Phu Thê|Nô Bộc":[["Trịnh Mục Đức","Phu Thê có M Nô: người phối ngẫu coi trọng bạn bè, nhờ bạn mà thành công; có thể quen nhau qua bạn bè giới thiệu.","Bạn có xu hướng gặp được người bạn đời qua các mối quan hệ quen biết. Giữ gìn vòng bạn bè chung sẽ là chỗ dựa cho cả hai.","cat"]],
"mchat|Phu Thê|Tật Ách":[["Trịnh Mục Đức","Phu Thê có M Tật: người phối ngẫu lao tâm, khá cố chấp.","Bạn có xu hướng có người bạn đời hay lo nghĩ. Chia sẻ gánh nặng và khuyến khích họ nghỉ ngơi sẽ giúp cả nhà nhẹ nhõm.","trung"]],
"sao|Thái Âm|Phu Thê":[["Nhiều tác giả","Thái Dương/Thái Âm ở Phu Thê: hôn nhân tốt xấu tùy độ sáng (miếu hay hãm) và có gặp Kỵ, sát tinh hay không; lập gia đình muộn thường tốt hơn.","Bạn có xu hướng có hôn nhân bền hơn khi kết hôn lúc đã chín chắn. Đừng vội, hãy tìm hiểu kỹ trước khi quyết định.","trung"]],
"sao|Văn Xương|Phu Thê":[["Khai quán nhân; Trần Bỉnh Húc","Xương Khúc ở Phu Thê: bạn đời thông minh, lãng mạn; nam mệnh có đủ cả hai sao, hay bị sát tinh chiếu, thì dễ xuất hiện người thứ ba và cãi vã.","Bạn có xu hướng bị thu hút bởi người tinh tế, lãng mạn. Giữ sự chung thủy và rõ ràng trong cảm xúc là điều làm nên hôn nhân đẹp.","trung"]],
"sao|Tử Vi|Phu Thê":[["Nhiều tác giả","Tử Vi tại Phu Thê: người phối ngẫu lớn tuổi hơn hoặc có uy, kết hôn có thể muộn; không hội sát thì hiền lương; gặp Thất Sát thì phối ngẫu cương cường, kết hôn sớm dễ khắc, nên muộn.","Bạn có xu hướng hợp với người bạn đời chững chạc, có bản lĩnh. Tôn trọng cá tính của nhau và không vội cưới sẽ giúp hôn nhân thuận.","trung"]],
"canCung|Tử Tức|Nhâm":[["Ông Phúc Dụ","Can Nhâm ở Tử Tức: con cái mạnh mẽ, có lòng hiệp nghĩa, ưa hơn thua; bản thân đương số thích phô bày, tự cho mình giỏi.","Bạn có xu hướng nuôi dạy con theo hướng mạnh mẽ, tự tin. Làm gương về sự khiêm tốn sẽ giúp con vừa tự tin vừa được quý mến.","trung"]],
"phi|Tử Tức|Quyền|Phu Thê":[["","Tử Tức phi Quyền nhập Phu Thê (Quyền Phối): con cái thành đạt, có hỗ trợ cho cha mẹ.","Bạn có xu hướng được con cái hoặc lớp trẻ trong nhà góp sức khi trưởng thành. Đầu tư cho việc học của con là khoản đầu tư sinh lời nhất.","cat"],["Trung Châu; Lai Nhân Cung","Con cái cá tính mạnh; trong hôn nhân dễ có người thứ ba xen vào.","Bạn có xu hướng có con cá tính và một cuộc hôn nhân cần được giữ gìn cẩn thận. Dành thời gian riêng cho vợ chồng sẽ giữ được sự gắn bó.","trung"]],
"phi|Tử Tức|Lộc|Huynh Đệ":[["","Tử Tức phi Lộc nhập Huynh Đệ (Lộc Bào): con thân với anh chị em, kiếm tiền tốt, có thể hợp tác làm ăn. Ở đại vận là dạng Khai quán nhân (thành tựu tuyến Huynh–Nô).","Bạn có xu hướng có gia đình gắn bó, các thế hệ giúp đỡ nhau. Hợp tác trong gia đình nên có thỏa thuận rõ ràng để giữ tình thân.","cat"]],
"phi|Tử Tức|Khoa|Điền Trạch":[["Nhiều tác giả","Tử Tức phi Khoa nhập Điền Trạch (Khoa Điền): gia đình hòa thuận, gia phong tốt, con lễ phép, nhà có tiếng tốt.","Bạn có xu hướng xây được một nếp nhà hòa thuận, có giáo dục. Giữ những thói quen sinh hoạt chung sẽ nuôi dưỡng điều đó lâu dài.","cat"]],
"phi|Tử Tức|Kỵ|Mệnh":[["Huy Hà Phan","Tử Tức phi Kỵ nhập Mệnh (Kỵ Mệnh): 'nợ con cái', phải lo nhiều cho con, con khó gần, ít báo đáp; đào hoa bị động (người khác tìm đến); con khác suy nghĩ, tiết kiệm.","Bạn có xu hướng dành rất nhiều tâm sức cho con cái và cảm thấy mình luôn phải lo. Hãy coi đó là tình thương vô điều kiện và cho con không gian tự lập để giảm áp lực cho cả hai.","trung"],["Lai Nhân Cung; Trung Châu","Quan hệ với con dễ ngăn cách, con ỷ lại; hợp tác làm ăn dễ thất bại; sự nghiệp khó, nhiều đào hoa bị động.","Bạn có xu hướng gặp khó khi hợp tác làm ăn và trong việc dạy con tự lập. Làm ăn nên tự chủ, còn với con hãy giao việc nhỏ để con tập trách nhiệm.","hung"],["Bản Hán-Việt; Tinh hoa","Con cái cố chấp, duyên con chậm; kết hôn và sinh con muộn, tình cảm với con nhạt; hợp tác đình trệ.","Bạn có xu hướng có chuyện gia đình và con cái đến muộn hơn người khác. Đừng so sánh, mỗi người có nhịp riêng và tình cảm cần được vun dần.","trung"],["Ông Phúc Dụ","Không nên xuất ngoại, đi xa dễ gặp việc không hay.","Bạn có xu hướng gặp nhiều thuận lợi hơn khi ở gần nơi quen thuộc. Nếu phải đi xa, hãy chuẩn bị kỹ và có người đồng hành.","trung"],["Tiên thiên tứ hóa phi tinh kỳ phổ","Nếu đồng thời Mệnh phi Lộc nhập Tử Tức thì thành Thị phi Kỵ: cho đi mà không được đáp lại; Kỵ này cũng là Thuận thủy Kỵ (khí Tử Tức chảy về Mệnh).","Bạn thuộc mẫu người cho con và lớp trẻ rất nhiều mà ít đòi hỏi. Hãy nói rõ mong muốn của mình để tình thương được đáp lại tự nhiên.","trung"]],
"phi|Tử Tức|Khoa|Mệnh":[["Huy Hà Phan; Lai Nhân Cung","Tử Tức phi Khoa nhập Mệnh (Khoa Mệnh): con cái lễ độ, nhẹ nhàng, tôn kính và học theo cha mẹ, là quý nhân.","Bạn có xu hướng được con cái kính trọng và học theo. Sống mẫu mực chính là cách dạy con hiệu quả nhất.","cat"],["Trung Châu; Phương Ngoại Nhân","Con cái hòa thuận, dễ dạy; đương số có duyên với người khác giới, giao du theo khuôn phép, hợp với bạn bè.","Bạn thuộc mẫu người dễ mến và cư xử đúng mực. Giữ sự đúng mực ấy trong mọi mối quan hệ sẽ được người khác tin cậy.","cat"],["Bản Hán-Việt; Tinh hoa","Con cái có nét văn chất, điềm đạm; về già có chỗ dựa.","Bạn có xu hướng có con cái hiền hòa, ham học. Khuyến khích con đọc sách và chơi nghệ thuật sẽ nuôi lớn tố chất đó.","cat"]],
"phi|Tử Tức|Lộc|Điền Trạch":[["Huy Hà Phan; Trung Châu","Lộc phi từ Tử Tức nhập Điền Trạch (Lộc Điền): con cái giúp nhà, lo việc gia đình, tậu đất; có con rồi thì gia vận khá hơn, tài sản thịnh vượng.","Bạn có xu hướng thấy gia đình khấm khá hơn khi có thêm thành viên nhỏ. Cùng con xây dựng tổ ấm sẽ đem lại nhiều niềm vui.","cat"],["Lai Nhân Cung","Con cái mang lại lợi, nhiều quý nhân; nhưng dễ đầu tư sai, nóng tính.","Bạn có xu hướng gặp nhiều người giúp nhưng đôi khi quyết đầu tư vội. Bình tĩnh tham khảo trước khi xuống tiền sẽ giữ được thành quả.","trung"],["Bản Hán-Việt; Tinh hoa; nhiều tác giả","Nhà đông vui, họ hàng hay lui tới; cần phòng chuyện tình cảm ngoài lề; con có thể sống chung trước hôn nhân. Nếu đối cung Điền đã có Lộc năm sinh thì thành Điệp xuất Lộc, dễ hao.","Bạn có xu hướng có một ngôi nhà rộn ràng người ra vào. Giữ nếp nhà rõ ràng sẽ giúp sự đông vui không biến thành xáo trộn.","trung"]],
"phi|Tử Tức|Quyền|Tật Ách":[["Huy Hà Phan; bản Hán-Việt","Tử Tức phi Quyền nhập Tật Ách (Quyền Tật): con cái cá tính mạnh, hiếu động, dễ va vấp; nên tiết chế.","Bạn có xu hướng có con năng động, thích vận động mạnh. Hướng con vào thể thao có hướng dẫn sẽ giúp con vừa khỏe vừa an toàn.","trung"],["Lai Nhân Cung; Trung Châu; Tinh hoa","Con cái và người dưới quyền mạnh mẽ, dễ bị ghen ghét; nhu cầu chăn gối cao, nên điều độ; con có năng lực, có thể thành người tài.","Bạn có xu hướng có năng lượng dồi dào và con cái có tài. Giữ nhịp sống điều độ sẽ giúp năng lượng ấy bền lâu.","trung"]],
"phi|Tử Tức|Quyền|Nô Bộc":[["Nhiều tác giả","Tử Tức phi Quyền nhập Nô Bộc: con cái tích cực, thích cạnh tranh, nhiều bạn bè.","Bạn có xu hướng có con cái hoạt bát, nhiều bạn. Dạy con chọn bạn và biết hợp tác sẽ là hành trang quý.","cat"]],
"phi|Tử Tức|Kỵ|Nô Bộc":[["Nhiều tác giả","Tử Tức phi Kỵ nhập Nô Bộc: con cái dễ kết bạn xấu, tốn tiền cho bạn bè; quan hệ dễ thị phi, một bên tốt không được đáp lại.","Bạn có xu hướng cần để mắt nhiều hơn đến bạn bè của con. Trò chuyện cởi mở với con về cách chọn bạn sẽ hiệu quả hơn cấm đoán.","hung"]],
"phi|Tử Tức|Kỵ|Thiên Di":[["Nhiều giáo trình","Kỵ phi từ Tử Tức nhập Thiên Di: con cái sống xa hoặc ít ở gần, tuổi già khó nương nhờ; đừng hùn hạp làm ăn hay đứng ra bảo lãnh.","Bạn có xu hướng có con cái lập nghiệp xa nhà. Tự chuẩn bị chỗ dựa tài chính cho tuổi già và giữ liên lạc đều đặn với con là hướng đi khôn ngoan.","trung"]],
"tuHoa|Tử Tức|Khoa":[["Nhiều tác giả","Tử Tức tự hóa Khoa: con cái thanh tú, nho nhã, có điều hay lưỡng lự.","Bạn có xu hướng có con hiền lành, nho nhã. Khuyến khích con tự quyết những việc nhỏ sẽ giúp con mạnh dạn hơn.","cat"]],
"tuHoa|Tử Tức|Lộc":[["Cửu cửu bí nghi; Lai Nhân Cung","Tử Tức tự hóa Lộc: con cái tự lập, song dễ đào hoa và thiếu trách nhiệm.","Bạn có xu hướng có con sớm tự lập. Dạy con giữ lời hứa và có trách nhiệm với việc mình làm sẽ bổ sung điều còn thiếu.","trung"]],
"tuHoa|Tử Tức|Kỵ":[["Cửu cửu bí nghi; giáo trình Tứ Hóa","Tử Tức tự hóa Kỵ hoặc tự hóa li tâm: phiền não tình cảm, tình duyên; nếu ở Dần Thân Tị Hợi thì thành Tứ mã Kỵ, bôn ba, xa cách người thân.","Bạn có xu hướng gặp nhiều trăn trở trong chuyện tình cảm. Dành thời gian hiểu rõ bản thân trước khi gắn bó sẽ giúp bạn chọn đúng.","hung"]],
"mchat|Tử Tức|Điền Trạch":[["Trịnh Mục Đức","M Điền có ở Tử Tức: con cái mong hoặc được hưởng thừa kế nhà đất.","Bạn có xu hướng quan tâm việc để lại nền tảng cho con. Lập kế hoạch tài sản rõ ràng từ sớm sẽ tránh được tranh chấp sau này.","cat"]],
"mchat|Tử Tức|Mệnh":[["Trịnh Mục Đức","M Mệnh có ở Tử Tức: có con, đời sống nhiều sắc màu; con cái chính là quý nhân.","Bạn có xu hướng thấy cuộc sống phong phú hơn nhờ con trẻ. Trân trọng những khoảnh khắc bên con là món quà cho chính mình.","cat"]],
"mchat|Tử Tức|Tật Ách":[["Trịnh Mục Đức","Tử Tức có M Tật: tự mình giáo dục con cái.","Bạn thuộc mẫu người muốn tự tay dạy dỗ con. Kết hợp thêm thầy cô và môi trường tốt sẽ giúp con phát triển toàn diện.","trung"]],
"mchat|Tử Tức|Huynh Đệ":[["Trịnh Mục Đức","Tử Tức có M Bào: anh em là quý nhân của con cái.","Bạn có xu hướng được họ hàng giúp đỡ trong việc nuôi dạy con. Giữ quan hệ họ hàng gắn bó sẽ mang lại lợi ích cho cả thế hệ sau.","cat"]],
"mchat|Tử Tức|Phu Thê":[["Trịnh Mục Đức","Tử Tức có M Phối: con cái lập gia đình là bước ngoặt.","Bạn có xu hướng thấy gia đình bước sang trang mới khi con trưởng thành. Chuẩn bị tinh thần đồng hành cùng con trong giai đoạn đó sẽ rất ý nghĩa.","trung"]],
"sao|Lộc Tồn|Tử Tức":[["Phương Ngoại Nhân; Phi tinh Trần Đoàn; Trần Bỉnh Húc","Lộc Tồn nằm ở cung lục thân (Tử Tức) thì khó thân cận, dễ tranh giành, cô quả; nếu đơn thủ thì lẻ loi, được cát tinh đi kèm thì giỏi quản lý tiền.","Bạn có xu hướng giữ khoảng cách nhất định trong tình cảm gia đình. Chủ động bày tỏ sự quan tâm sẽ giúp gắn kết hơn.","trung"]],
"sao|Tả Phù|Tử Tức":[["","Hữu Bật, Tả Phù hội ở Tử Tức: lúc chọn người cưới dễ có nhiều phương án, cần thận trọng.","Bạn có xu hướng có nhiều lựa chọn trong tình cảm. Chọn người hợp giá trị sống hơn là chọn theo cảm xúc nhất thời.","trung"]],
"phi|Tài Bạch|Lộc|Phu Thê":[["","Lộc phi từ Tài Bạch nhập Phu Thê: kiếm tiền suôn sẻ, rộng rãi với bạn đời; coi chừng chiều chuộng quá đà.","Bạn thuộc mẫu người hào phóng với người mình thương. Chi tiêu cho gia đình có kế hoạch sẽ khiến sự hào phóng ấy bền lâu.","cat"]],
"tuHoa|Tài Bạch|Quyền":[["","Tài Bạch tự hóa Quyền: dòng tiền lên xuống, dễ chi lớn; nên tập thói quen để dành.","Bạn có xu hướng chi tiêu mạnh tay khi có tiền. Đặt quy tắc để riêng một phần thu nhập trước khi tiêu sẽ giúp tài chính ổn hơn.","trung"]],
"tuHoa|Tài Bạch|Khoa":[["Nhiều tác giả","Tài Bạch tự hóa Khoa: không cố theo đuổi tiền nhưng không lãng phí; thu nhập nhỏ, ổn định, đều đặn; tài vận nhìn chung ổn; có kế hoạch tiền bạc, lý trí, hòa thuận với bạn đời.","Bạn thuộc mẫu người tiêu tiền có chừng mực và thích sự ổn định. Duy trì kế hoạch tài chính đều đặn sẽ giúp bạn an tâm lâu dài.","cat"],["Nhiều tác giả","Không chú tâm quản tiền nên tiền luân chuyển dễ mà sinh phiền; hợp buôn bán nhỏ hoặc làm công; nếu sao Khoa là võ tinh hợp quân cảnh, văn tinh hợp văn hóa.","Bạn có xu hướng để tiền tự trôi mà ít theo dõi. Ghi chép thu chi đơn giản mỗi tháng sẽ tránh được những phiền phức nhỏ.","trung"],["Cửu cửu bí nghi","Có thể cô độc, kiêu, duy tâm, hay do dự, cầu toàn, dễ rối.","Bạn có xu hướng cầu toàn và cân nhắc rất lâu. Đặt hạn chót cho mỗi quyết định sẽ giúp bạn nhẹ đầu hơn.","trung"]],
"phi|Tài Bạch|Khoa|Mệnh":[["","Khoa phi từ Tài Bạch nhập Mệnh: thu nhập đều nhưng không lớn; tiêu theo mức kiếm được.","Bạn có xu hướng có nguồn thu đều và biết sống trong khả năng. Thói quen ấy là nền tảng vững để tích lũy dần.","cat"]],
"phi|Tài Bạch|Kỵ|Mệnh":[["","Kỵ phi từ Tài Bạch nhập Mệnh: kiếm tiền cực nhọc, dễ bị đồng tiền sai khiến; nên tránh cờ bạc, rượu chè, sắc dục.","Bạn có xu hướng để chuyện tiền chiếm nhiều tâm trí. Chọn cách kiếm tiền bền vững và tránh xa trò may rủi sẽ giúp bạn thảnh thơi hơn.","hung"]],
"phi|Tài Bạch|Lộc|Tật Ách":[["Huy Hà Phan; Trung Châu","Tài Bạch phi Lộc nhập Tật Ách (Lộc Tật): kiếm tiền dễ, thích hưởng thụ, đầu tư cho bản thân và sức khỏe; thiếu kế hoạch tài chính.","Bạn có xu hướng kiếm tiền khá nhẹ nhàng và biết chăm lo cho bản thân. Lập kế hoạch tiết kiệm sẽ giúp sự dễ dàng này không bị phung phí.","cat"],["Lai Nhân Cung","Tiền vào tay dễ, phúc khí tốt nhưng dễ tăng cân vì ăn uống.","Bạn thuộc mẫu người có lộc ăn uống và thích tận hưởng. Cân bằng ăn uống với vận động sẽ giữ được sức khỏe tốt.","cat"],["Bản Hán-Việt; Tinh hoa","Tiền đến nhẹ, ít tích cực, có thể lương cao hoặc hưởng hoa hồng; lạc quan, không tính toán với người.","Bạn thuộc mẫu người lạc quan, không so đo. Chọn công việc hưởng theo hiệu quả sẽ giúp bạn kiếm tốt mà vẫn thoải mái.","cat"],["","Nếu đồng thời Tài phi Kỵ nhập Điền: mạnh về thân thể, yếu về nhà cửa và tài sản tích lũy.","Bạn có xu hướng tiêu cho bản thân nhiều hơn là tích lũy tài sản. Dành một tỷ lệ cố định cho tài sản dài hạn sẽ giúp cân bằng.","trung"]],
"phi|Tài Bạch|Quyền|Tật Ách":[["Huy Hà Phan","Quyền phi từ Tài Bạch nhập Tật Ách (Quyền Tật): năng nổ, hăng say; kiếm tiền vất vả mà thu nhập khá, hợp việc lương cao hoặc ăn hoa hồng; chủ động, quyết đoán.","Bạn thuộc mẫu người làm việc hết mình vì mục tiêu tài chính. Xen kẽ nghỉ ngơi hợp lý sẽ giúp bạn giữ sức cho chặng đường dài.","cat"],["Lai Nhân Cung","Coi kiếm tiền là đích đến để thấy mình thành đạt và được nể phục; làm lụng cực nhọc, dạ dày dễ yếu.","Bạn có xu hướng đo thành công bằng thu nhập và gắng sức rất nhiều. Ăn uống đúng giờ và biết dừng đúng lúc là điều cần giữ.","trung"],["Trung Châu","Thích làm ra tiền rồi hưởng thụ, xài đồ cao cấp, hay đi chơi.","Bạn thuộc mẫu người làm hết sức và chơi hết mình. Để dành một phần cho tương lai sẽ giúp bạn hưởng thụ lâu dài.","trung"],["Lương Nhược Du; bản Hán-Việt","Dẻo dai, làm được việc kỹ thuật nặng; khi cách cục đẹp thì thu nhập lớn, đủ sức tự lập nghiệp. Quyền vào Tật Ách cũng cho tính cách mạnh và chín chắn sớm.","Bạn có xu hướng trưởng thành sớm và chịu được áp lực. Nếu muốn khởi nghiệp, hãy chọn lĩnh vực mình có tay nghề vững.","cat"]],
"phi|Tài Bạch|Kỵ|Điền Trạch":[["Nhiều tác giả","Kỵ phi từ Tài Bạch nhập Điền Trạch (Kỵ Điền, Thuận thủy Kỵ): giữ tiền kỹ, tằn tiện, tích góp nhờ cần kiệm; cách cục đẹp thì dễ khá giả; tiền phần lớn dành cho nhà cửa, đất đai; đầu tư và tậu nhà hợp mệnh, là tượng tốt.","Bạn thuộc mẫu người cần kiệm và muốn biến tiền thành tài sản cho gia đình. Đầu tư vào nhà cửa, tài sản bền vững là hướng rất hợp với bạn.","cat"],["Nhiều tác giả","Tiền khó đến, khó tụ; không đủ chu cấp gia đình nên hay tính toán; gánh trách nhiệm nhà nhưng cố chấp, mua nhà khó, dễ bủn xỉn, quan niệm bảo thủ khiến tiền dần hao.","Bạn có xu hướng lo lắng nhiều về tiền cho gia đình. Bàn bạc kế hoạch chi tiêu với người nhà sẽ giảm áp lực và tránh căng thẳng.","hung"],["","Tính khép kín, ít giao tiếp xã hội; vất vả vì tiền, có thể hao tiền vì việc chăm sóc người nhà.","Bạn có xu hướng thu mình vào việc nhà và ít ra ngoài. Mở rộng một vài mối quan hệ chất lượng sẽ mang thêm cơ hội cho bạn.","trung"]],
"phi|Tài Bạch|Kỵ|Phúc Đức":[["Huy Hà Phan; Nguyễn Anh Vũ; Đại Đức Sơn Nhân","Tài Bạch phi Kỵ nhập Phúc Đức (tự xung Tài): ham hưởng thụ, chi tiêu tùy hứng, khó giữ tiền, dễ mê muội; cần tránh cờ bạc, đầu cơ.","Bạn có xu hướng tiêu tiền theo cảm xúc. Đặt giới hạn chi tiêu cho giải trí và tránh trò may rủi sẽ giúp bạn giữ được tiền.","hung"],["Lai Nhân Cung","Tính chao đảo, thu nhập thất thường, vợ chồng dễ cãi nhau vì tiền.","Bạn có xu hướng có thu nhập lên xuống. Xây quỹ dự phòng và minh bạch tiền bạc với người bạn đời sẽ giảm căng thẳng.","hung"],["Tiên thiên tứ hóa phi tinh kỳ phổ","Nếu Phúc Đức có Kỵ năm sinh cùng sao thì thành Nghịch thủy Kỵ: lại được xem là có thể phát đạt nhờ sản xuất, kinh doanh, ngoại giao; hợp kinh doanh, dịch vụ hoặc làm công.","Bạn có xu hướng bám chặt mục tiêu làm giàu và kiên trì đến cùng. Chọn ngành sản xuất, kinh doanh thực tế sẽ phát huy được sức bền đó.","cat"]],
"phi|Tài Bạch|Lộc|Nô Bộc":[["Nhiều tác giả","Tài Bạch phi Lộc nhập Nô Bộc: hào phóng, chi tiêu nhiều cho bạn bè, dựa vào bạn bè kiếm tiền.","Bạn thuộc mẫu người rộng rãi với bạn bè và kiếm tiền nhờ quan hệ. Tách bạch tiền làm ăn với tiền giao tiếp sẽ giúp bạn giữ được của.","cat"]],
"phi|Tài Bạch|Quyền|Tử Tức":[["Nhiều tác giả","Tài Bạch phi Quyền nhập Tử Tức: đầu tư tiền cho con cái, dám tiêu, có thể hợp tác góp vốn.","Bạn có xu hướng sẵn sàng chi mạnh cho con cái và các dự án chung. Cân nhắc khả năng hoàn vốn trước khi góp sẽ giữ an toàn.","trung"]],
"phi|Tài Bạch|Khoa|Phúc Đức":[["Nhiều tác giả","Khoa phi từ Tài Bạch nhập Phúc Đức: tiêu có kế hoạch, sống đơn giản, ít ham muốn.","Bạn thuộc mẫu người giản dị, biết đủ. Đó là nền tảng để tâm luôn an và tài chính luôn vững.","cat"]],
"phi|Tài Bạch|Khoa|Phu Thê":[["Huy Hà Phan; Lai Nhân Cung","Khoa phi từ Tài Bạch nhập Phu Thê: tiền bạc ổn, bạn đời là quý nhân; tiêu pha có tính toán, bỏ tiền học để nâng mình lên, vợ chồng hòa thuận.","Bạn có xu hướng được người bạn đời giúp quản lý tiền bạc khéo léo. Cùng nhau đầu tư cho việc học sẽ giúp gia đình tiến xa.","cat"]],
"mchat|Tài Bạch|Điền Trạch":[["Trịnh Mục Đức","M Điền có ở Tài Bạch: tậu nhà đất thì giữ được tiền; đầu tư bất động sản là hợp nhất.","Bạn có xu hướng giữ tiền tốt nhất khi biến nó thành tài sản cố định. Tìm hiểu kỹ thị trường nhà đất sẽ giúp bạn đầu tư đúng.","cat"]],
"mchat|Tài Bạch|Tật Ách":[["Trịnh Mục Đức","M Tật có ở Tài Bạch: sinh ra đã vất vả, phải lao lực cực nhọc mới giữ nổi tiền.","Bạn có xu hướng phải tự tay làm ra từng đồng. Chăm sóc sức khỏe chính là bảo vệ khả năng kiếm tiền của bạn.","trung"]],
"mchat|Tài Bạch|Nô Bộc":[["Trịnh Mục Đức","Tài Bạch có M Nô: kiếm tiền và thành bại đều nhờ bạn bè.","Bạn có xu hướng kiếm tiền qua các mối quan hệ. Chọn đối tác uy tín là quyết định quan trọng nhất của bạn.","trung"]],
"mchat|Tài Bạch|Phúc Đức":[["Trịnh Mục Đức","M Phúc có ở Tài Bạch: đầu tư vào chính mình, theo nghề mình thích thì dễ thành.","Bạn thuộc mẫu người kiếm tiền tốt nhất từ việc mình yêu thích. Đầu tư học hỏi cho đam mê là khoản đầu tư xứng đáng.","cat"]],
"mchat|Tài Bạch|Tử Tức":[["Trịnh Mục Đức","M Tử có ở Tài Bạch: khởi nghiệp theo lối hợp tác; tài sản để lại cho con.","Bạn có xu hướng làm ăn hiệu quả khi có người cùng góp sức. Thỏa thuận rõ ràng ngay từ đầu sẽ giữ được hợp tác lâu dài.","trung"]],
"sao|Thiên Đồng|Tài Bạch":[["Phi tinh Trần Đoàn; nhiều tác giả","Thiên Đồng ở Tài Bạch: hiền lành, nhiều quý nhân, đa phần tay trắng dựng nghiệp, về sau mới giàu, sống thanh thản; gặp Thiên Mã/Hóa Lộc/Lộc Tồn có thể rất giàu; đầu tư chậm chạp thì dễ lỡ dịp; miếu vượng mà gặp sát thì lúc lên lúc xuống; nếu hãm địa lại gặp Tứ sát, Hình, Kỵ thì dễ đổ vỡ.","Bạn thuộc mẫu người hiền hòa, đi từ ít thành nhiều. Mạnh dạn hơn khi gặp cơ hội tốt sẽ giúp bạn không bỏ lỡ thời điểm.","cat"]],
"sao|Thất Sát|Tài Bạch":[["Huy Hà Phan; Từ Tăng Sinh; Phi tinh Trần Đoàn; Trần Bỉnh Húc","Thất Sát tại Tài Bạch: tiền đến nhanh đi nhanh, gan dạ mạo hiểm, dễ mê xổ số, đầu cơ; tài vận theo tâm trạng; ở Dần Thân Tý Ngọ chủ hoạnh phát; có Lộc Quyền Khoa thì phú hào; hãm thì phải lao lực.","Bạn thuộc mẫu người dám nghĩ dám làm với tiền bạc. Kiềm chế chi tiêu và chuyên tâm vào một nghề vững sẽ giúp bạn thu hoạch nhiều hơn.","trung"]],
"sao|Tử Vi|Tài Bạch":[["Nhiều tác giả","Tử Vi tại Tài Bạch: chủ phúc lộc, giỏi tiêu tiền, thích phô trương; có năng lực lãnh đạo, kế hoạch thu tài kỹ, đầu tư chắc, dài hạn; gặp Tả Hữu, Quyền Khoa thì giàu; gặp sát tinh thì vất vả, dễ phá sản; hợp quản lý, kế toán, tiền tệ.","Bạn thuộc mẫu người có tầm nhìn dài hạn về tiền bạc. Giữ chi tiêu cá nhân vừa phải sẽ giúp kế hoạch lớn của bạn thành công.","cat"]],
"sao|Văn Khúc|Tài Bạch":[["Từ Tăng Sinh; Phi tinh Trần Đoàn; Trần Bỉnh Húc","Xương Khúc ở Tài Bạch: hợp nghề thiết kế, nghệ thuật, văn chương, báo chí, giảng dạy; miếu vượng có cát tinh thì giàu bền, tiền đến nhờ quý nhân; hễ gặp Không Kiếp, Tứ sát, Hình Kỵ thì tiền khó gom.","Bạn có xu hướng kiếm tiền tốt từ chữ nghĩa, sáng tạo và lời nói. Đầu tư vào kỹ năng chuyên môn sẽ nâng giá trị của bạn.","cat"]],
"sao|Thiên Tướng|Tài Bạch":[["Giáo trình Tứ Hóa; Trần Bỉnh Húc","Thiên Tướng tại Tài Bạch: quản tiền bảo thủ, đầu tư thận trọng, tích lũy dần; miếu vượng thì giàu; hãm hoặc gặp sát thì khó tích lũy, dễ hỏng vì sổ sách.","Bạn thuộc mẫu người thận trọng với tiền bạc. Giữ sổ sách rõ ràng sẽ là tấm khiên bảo vệ thành quả của bạn.","cat"]],
"sao|Thiên Khôi|Tài Bạch":[["","Khôi Việt hội Tài Bạch: phát tài trong sự thanh nhã, khi khó có quý nhân giúp.","Bạn có xu hướng được người tốt giúp lúc cần. Giữ chữ tín sẽ khiến sự giúp đỡ đó luôn sẵn có.","cat"]],
"snToa|Quyền|Phúc Đức":[["Nhiều tác giả","Phúc Đức có Hóa Quyền năm sinh tọa thủ: chí lớn, thích tự khẳng định, chuộng sang trọng, bề ngoài và vị thế; dễ chi quá tay.","Bạn thuộc mẫu người có chính kiến và thích cuộc sống chỉn chu. Đặt ngân sách cho sở thích sẽ giúp bạn tận hưởng mà không lo.","trung"],["","Khi sao hóa Quyền là Thiên Lương: chú trọng tu dưỡng tâm hồn, thích được người khác phục vụ.","Bạn có xu hướng coi trọng đời sống tinh thần. Dành thời gian cho việc tu dưỡng sẽ giúp bạn bình an.","cat"]],
"snToa|Kỵ|Phúc Đức":[["Các sách Tứ Hóa","Phúc Đức có Hóa Kỵ năm sinh tọa thủ: tâm trí hay lo lắng, chi tiền theo cảm hứng, ít được hưởng phúc tổ.","Bạn có xu hướng hay lo nghĩ và khó thả lỏng. Tập thói quen thư giãn như đi bộ, thiền hay đọc sách sẽ giúp tâm trí nhẹ hơn.","hung"]],
"canCung|Phúc Đức|Nhâm":[["Ông Phúc Dụ","Phúc Đức can Nhâm (Nhân chi Nhân): độc lập, tự phụ, không chịu thiệt; Phúc tại Tuất (khố vị): cố chấp nhưng trung thành với một nghề.","Bạn thuộc mẫu người độc lập và kiên định với nghề đã chọn. Mềm mỏng hơn khi trao đổi sẽ giúp bạn được ủng hộ nhiều hơn.","trung"]],
"phi|Phúc Đức|Lộc|Mệnh":[["","Phúc Đức phi Lộc nhập Mệnh: rộng rãi, biết đủ, được tổ tiên phù hộ, sống thọ, thích nhàn; cũng tạo Đối trì Lộc có lợi cho Thiên Di.","Bạn thuộc mẫu người rộng lượng và biết hài lòng. Sự an nhiên đó là phúc lớn, hãy giữ gìn nó qua lối sống điều độ.","cat"]],
"phi|Phúc Đức|Quyền|Phu Thê":[["Huy Hà; Lai Nhân; Trung Châu; Lương Nhược Du","Quyền phi từ Phúc Đức nhập Phu Thê (Quyền Phối): trong tình cảm chủ động, muốn chi phối và chiếm hữu, có tài lãnh đạo; bạn đời có thể là trợ thủ hoặc lấn lướt.","Bạn có xu hướng muốn dẫn dắt trong tình cảm. Cho người kia cơ hội quyết định sẽ giúp mối quan hệ cân bằng.","trung"]],
"phi|Phúc Đức|Khoa|Quan Lộc":[["","Khoa phi từ Phúc Đức nhập Quan Lộc: làm việc đều tay, có kế hoạch; hợp lĩnh vực văn hóa, triết học.","Bạn thuộc mẫu người làm việc có kế hoạch và yêu tri thức. Công việc gắn với học thuật, văn hóa sẽ cho bạn niềm vui lâu dài.","cat"]],
"phi|Phúc Đức|Kỵ|Quan Lộc":[["","Kỵ phi từ Phúc Đức nhập Quan Lộc (Thuận thủy Kỵ, khí Phúc dồn vào sự nghiệp): làm quá sức kéo theo ảnh hưởng tới hôn nhân; đường sự nghiệp vất vả; tránh hẹp hòi và chọn nhầm nghề.","Bạn có xu hướng đặt cả tâm trí vào công việc. Chọn nghề mình thật sự yêu và giữ thời gian cho gia đình sẽ giúp bạn vừa thành công vừa hạnh thông.","trung"]],
"phi|Phúc Đức|Lộc|Nô Bộc":[["Giáo trình Tứ Hóa; Lương Nhược Du","Phúc Đức phi Lộc nhập Nô Bộc: nhân duyên tốt, bạn bè hữu ích, có năng lực cạnh tranh, làm thiện dễ thành; thích náo nhiệt, lạc quan, kết bạn theo sở thích, ít so đo.","Bạn thuộc mẫu người vui vẻ, dễ kết bạn và ít so đo. Chọn những người bạn cùng chí hướng sẽ giúp niềm vui ấy có ích.","cat"],["","Nhiệt tình, hiếu khách nhưng có thể làm việc quá mức thành gánh nặng; người phối ngẫu có danh tiếng, trí tuệ.","Bạn có xu hướng nhận lời giúp nhiều người. Biết từ chối đúng lúc sẽ giúp bạn không bị quá tải.","trung"]],
"phi|Phúc Đức|Quyền|Nô Bộc":[["Giáo trình Tứ Hóa","Phúc Đức phi Quyền nhập Nô Bộc: thích thể hiện, coi trọng thể diện, kết giao người có địa vị, nhà giàu; hào phóng nhưng dễ lãng phí, xa xỉ (Quyền xuất), cần đề phòng nịnh bợ.","Bạn có xu hướng muốn được nhìn nhận trong các mối quan hệ. Chọn bạn vì giá trị thật hơn là vì địa vị sẽ giúp bạn tránh tốn kém.","trung"],["","Giàu sức cạnh tranh và ý chí; bạn bè là người lãnh đạo hoặc chuyên gia; giúp gia đình giỏi, còn đối với người dưới thì thực dụng; hay cố chấp, giành quyền với bạn và đồng nghiệp.","Bạn thuộc mẫu người có ý chí mạnh và hay quen người giỏi. Nhẹ nhàng với người dưới quyền sẽ khiến bạn được kính trọng thật lòng.","trung"]],
"phi|Phúc Đức|Khoa|Tài Bạch":[["","Phúc Đức phi Khoa nhập Tài Bạch: ít ham tiền, chi tiêu có kế hoạch, ghi sổ; thu chi cân bằng, tiền nhỏ dễ xoay vòng; được tổ nghiệp hỗ trợ, tài chính ổn, thích việc ổn định như công chức.","Bạn thuộc mẫu người điều độ với tiền bạc và thích sự ổn định. Thói quen ghi chép thu chi sẽ giúp bạn luôn chủ động.","cat"],["","Mặt tiêu cực: có khi cô độc, kiêu, cầu toàn, lưỡng lự, dễ rối.","Bạn có xu hướng cầu toàn và hay do dự. Chấp nhận làm tốt thay vì hoàn hảo sẽ giúp bạn nhẹ nhàng hơn.","trung"]],
"phi|Phúc Đức|Kỵ|Mệnh":[["","Phúc Đức phi Kỵ nhập Mệnh (Thuận thủy Kỵ): cố chấp, dễ lo âu, tự chuốc phiền não; nên sống ẩn, buông bỏ dần.","Bạn có xu hướng suy nghĩ nhiều và tự tạo áp lực cho mình. Tập buông những điều ngoài tầm kiểm soát sẽ giúp tâm trí nhẹ hơn rất nhiều.","trung"],["","Khó hòa đồng với bạn đời, khó nắm tài chính của họ; có Quyền thì khó lấy tiền từ phối ngẫu.","Bạn có xu hướng ít chia sẻ chuyện tiền với người bạn đời. Minh bạch và bàn bạc sẽ tạo lòng tin cho cả hai.","trung"],["","Mệnh đối Tật Ách nên dễ cực đoan: tự lập mà cô lập, kiếm tiền bằng đường chính đáng; cứng nhắc, vì chuyện nhỏ mà hỏng chuyện lớn.","Bạn thuộc mẫu người tự lập và kiếm tiền chính đáng. Linh hoạt hơn trong việc nhỏ sẽ giúp bạn giữ được việc lớn.","trung"],["Nhiều bản","Nghiệp lực khá nặng, nhiều lo âu, yêu ghét cực đoan; bụng dạ hẹp, hay so đo, tâm không yên, thích hưởng thụ, dễ tiêu tiền; nên tránh cờ bạc, đầu cơ.","Bạn có xu hướng cảm xúc mạnh và dễ bị cuốn theo. Tránh các trò may rủi và tìm một hoạt động giúp tĩnh tâm sẽ giữ được cân bằng.","hung"]],
"phi|Phúc Đức|Lộc|Tật Ách":[["Huy Hà; Lai Nhân; Trung Châu; Lương Nhược Du","Phúc Đức phi Lộc nhập Tật Ách (Lộc Tật): phúc ấm, biết hưởng thụ nhưng dễ lười vận động.","Bạn thuộc mẫu người biết tận hưởng cuộc sống. Thêm chút vận động mỗi ngày sẽ giúp bạn tận hưởng lâu hơn.","cat"]],
"phi|Phúc Đức|Kỵ|Thiên Di":[["Huy Hà; Lai Nhân; Trung Châu; Lương Nhược Du","Phúc Đức phi Kỵ nhập Thiên Di: giao tế kém, ra ngoài dễ gặp sự cố, hôn nhân dễ rạn; nếu Thiên Di phi Lộc lại Phúc Đức thì thành Thị phi Kỵ.","Bạn có xu hướng thấy mệt khi phải giao tiếp nhiều bên ngoài. Giữ an toàn khi đi lại và chọn môi trường quen thuộc sẽ giúp bạn thoải mái hơn.","hung"]],
"phi|Phúc Đức|Khoa|Tử Tức":[["Giáo trình Tứ Hóa","Khoa phi từ Phúc Đức nhập Tử Tức: con cái được dạy dỗ về văn hóa, tinh thần theo cách dân chủ.","Bạn có xu hướng dạy con bằng sự lắng nghe và tôn trọng. Cách dạy đó sẽ giúp con tự tin và biết suy nghĩ độc lập.","cat"]],
"phi|Phúc Đức|Kỵ|Tật Ách":[["Giáo trình Tứ Hóa","Kỵ phi từ Phúc Đức nhập Tật Ách: lo cho sức khỏe thái quá, dễ tự hành hạ mình; nếu sao hóa Kỵ là Thái Âm thì ưa sạch, thích chưng diện, hay ngờ vực sức khỏe bản thân.","Bạn có xu hướng lo lắng nhiều về cơ thể mình. Khám định kỳ để yên tâm rồi buông bớt lo âu sẽ tốt cho cả thân lẫn tâm.","trung"]],
"tuHoa|Phúc Đức|Khoa":[["Cửu cửu; Huy Hà; Lai Nhân; Trung Châu; Lương Nhược Du","Phúc Đức tự hóa Khoa: có tu dưỡng nhưng lưỡng lự, hay sầu, dễ cô đơn.","Bạn thuộc mẫu người sâu sắc và có nội tâm. Chia sẻ với một vài người tin cậy sẽ giúp bạn bớt cô đơn.","trung"]],
"mchat|Phúc Đức|chat":[["Trịnh Mục Đức","M chất có ở Phúc Đức: được hưởng của cải gia đình, theo đuổi giấc mơ.","Bạn có xu hướng được nền tảng gia đình nâng đỡ để theo đuổi ước mơ. Trân trọng nền tảng đó bằng nỗ lực của chính mình.","cat"]],
"mchat|Phúc Đức|Mệnh":[["Trịnh Mục Đức","M Mệnh có ở Phúc Đức: hưởng phúc báo tổ tiên, theo đuổi giấc mơ.","Bạn thuộc mẫu người sống theo lý tưởng riêng. Kiên định với ước mơ sẽ đưa bạn đến nơi mình muốn.","cat"]],
"mchat|Phúc Đức|Phu Thê":[["Trịnh Mục Đức","Phúc Đức có M Phối: hôn nhân ổn định; chọn bạn đời kỹ.","Bạn có xu hướng chọn người bạn đời cẩn thận. Sự cẩn thận đó là nền móng của một hôn nhân êm ấm.","cat"]],
"mchat|Phúc Đức|Quan Lộc":[["Trịnh Mục Đức","Phúc Đức có M Quan: sự nghiệp gắn với sở thích.","Bạn thuộc mẫu người làm tốt nhất khi công việc là đam mê. Tìm cách biến sở thích thành nghề sẽ cho bạn cả niềm vui lẫn thu nhập.","cat"]],
"mchat|Phúc Đức|Nô Bộc":[["Trịnh Mục Đức","Phúc Đức có M Nô: nhờ bạn bè kiếm tiền, bạn bè là quý nhân.","Bạn có xu hướng gặp may qua bạn bè. Giữ gìn chữ tín với bạn bè sẽ mở thêm nhiều cánh cửa.","cat"]],
"mchat|Phúc Đức|Tài Bạch":[["Trịnh Mục Đức","M Tài có ở Phúc Đức: tự bỏ vốn thì có phúc báo, chú tâm sự nghiệp để làm ra tiền.","Bạn thuộc mẫu người đầu tư cho mình thì sinh lời. Học thêm kỹ năng là khoản đầu tư đáng giá nhất.","cat"]],
"mchat|Phúc Đức|Thiên Di":[["Trịnh Mục Đức","Phúc Đức có M Di: thích xuất ngoại, đi xa.","Bạn có xu hướng tìm niềm vui qua những chuyến đi. Lên kế hoạch du lịch đều đặn sẽ nạp lại năng lượng cho bạn.","cat"]],
"mchat|Phúc Đức|Tật Ách":[["Trịnh Mục Đức","Phúc Đức có M Tật: kiên trì sự nghiệp, lao tâm.","Bạn thuộc mẫu người kiên trì nhưng hay nghĩ nhiều. Cho mình những khoảng nghỉ sẽ giúp bạn bền bỉ hơn.","trung"]],
"sao|Thiên Lương|Phúc Đức":[["Nhiều tác giả","Thiên Lương tại Phúc Đức: tùy vị trí cho phúc, thọ hay vất vả; hội Thiên Đồng, Thái Âm, sát tinh, Hóa Kỵ thì thay đổi tính chất; nếu là kỵ thần thì bất lợi.","Bạn có xu hướng sống có nguyên tắc và hay lo cho người khác. Biết chăm sóc chính mình cũng quan trọng như chăm sóc người khác.","trung"]],
"sao|Thiên Phủ|Phúc Đức":[["Trần Đoàn; Trần Bỉnh Húc; Sở Hoàng","Thiên Phủ ở Phúc Đức: cẩn trọng, điềm tĩnh, ôn hòa, được hưởng phúc; đứng riêng tại Tý, Hợi thì phúc thọ vẹn toàn, tại Sửu, Mùi, Mão, Dậu thì kém hơn; gặp Tử Vi thì đời vui; gặp sát tinh và Hóa Kỵ thì nhọc lòng.","Bạn thuộc mẫu người điềm đạm và biết hưởng thụ vừa phải. Giữ sự ôn hòa đó sẽ đem lại bình an lâu dài.","cat"]],
"sao|Liêm Trinh|Phúc Đức":[["Hà Lạc; Trần Đoàn; Trần Bỉnh Húc; Sở Hoàng","Liêm Trinh ở Phúc Đức: bôn ba, nhọc lòng; đồng cung với sao tốt thì có phúc; Liêm Phủ thì lộc hơn phúc, biết tự tìm vui; Liêm Tướng thì có phúc để hưởng mà lo chuyện con; Liêm Trinh hóa Kỵ thì trong lòng hay buồn phiền.","Bạn có xu hướng bận rộn tâm trí và khó ngồi yên. Tìm một sở thích giúp tĩnh lại sẽ cân bằng nhịp sống của bạn.","trung"]],
"sao|Tả Phù|Phúc Đức":[["Trần Đoàn; Trần Bỉnh Húc; Đẩu số cung vị","Tả Phù (và Hữu Bật) tại Phúc Đức: hậu vận yên ổn, biết hưởng thụ, lạc quan; gặp sát tinh thì phúc giảm.","Bạn có xu hướng có cuộc sống về sau yên ổn. Giữ thái độ lạc quan sẽ giúp bạn tận hưởng trọn vẹn.","cat"]],
"sao|Lộc Tồn|Phúc Đức":[["Phi tinh Trần Đoàn","Lộc Tồn tại Phúc Đức: cả đời được nhiều phúc, an nhàn, hòa thuận với người.","Bạn thuộc mẫu người an nhiên, hòa thuận. Sự an nhiên đó là món quà, hãy chia sẻ nó với người xung quanh.","cat"]],
"sao|Thiên Khôi|Phúc Đức":[["","Khôi Việt ở Phúc Đức: được quý nhân giúp đỡ.","Bạn có xu hướng được người tốt giúp đỡ vào lúc cần. Biết ơn và đáp lại sẽ giữ vòng quan hệ tốt đẹp ấy.","cat"]],
"sao|Thiên Riêu|Phúc Đức":[["","Thiên Riêu ở Phúc Đức: tâm trí dễ rối.","Bạn có xu hướng có nhiều suy nghĩ đan xen. Viết ra và sắp xếp lại sẽ giúp đầu óc sáng hơn.","trung"]],
"sao|Linh Tinh|Phúc Đức":[["Sở Hoàng","Linh Tinh ở Phúc Đức: xử sự nhiều tâm cơ, đời không an tịnh.","Bạn có xu hướng tính toán nhiều trong cư xử. Sống thẳng thắn hơn sẽ giúp lòng bạn nhẹ nhõm.","trung"]],
"sao|Văn Xương|Phúc Đức":[["Trần Bỉnh Húc; Sở Hoàng","Văn Xương ở Phúc Đức: phúc lộc vinh xương hoặc xử thế có nghệ thuật.","Bạn thuộc mẫu người khéo léo trong cách sống. Sự tinh tế đó giúp bạn được quý mến ở bất cứ đâu.","cat"]],
"snToa|Lộc|Điền Trạch":[["Nhiều tác giả","Hóa Lộc năm sinh tọa Điền Trạch: gia đình đầm ấm, kinh tế tốt, dễ hưởng tổ nghiệp hoặc tự mua được nhà đất, hợp kinh doanh bất động sản; nhà đẹp nhưng hay bừa bộn; có duyên và trách nhiệm với gia đình.","Bạn thuộc mẫu người gắn bó với gia đình và có duyên với chuyện an cư. Giữ nhà cửa gọn gàng và tích lũy tài sản đều đặn sẽ nhân lên phần may mắn này.","cat"],["","Có nhà lớn nhưng không nhất thiết đứng tên; nhà ở nằm trong vòng kinh doanh là khởi đầu thành công.","Bạn có xu hướng gắn nơi ở với nơi làm ăn. Chú ý giấy tờ sở hữu rõ ràng sẽ giúp bạn yên tâm lâu dài.","cat"]],
"snToa|Quyền|Điền Trạch":[["Nhiều tác giả","Điền Trạch có Hóa Quyền năm sinh tọa thủ: cầm quyền trong nhà, ưa sắm nhiều bất động sản, trang hoàng và khoe nhà; có thể mở cửa hàng hoặc cho thuê ngay tại nhà; dễ va chạm với người thân; nhà khang trang là bước mở đầu sự nghiệp.","Bạn thuộc mẫu người quán xuyến việc nhà và thích tạo dựng tài sản. Lắng nghe ý kiến người trong nhà sẽ tránh được những va chạm không đáng có.","cat"],["","Lộc và Quyền năm sinh cùng tọa Điền: tài lợi phát đạt, lợi hơn danh, hợp kinh doanh nhanh; cách thành thì buôn bán giỏi, cách bại thì nhu nhược phải nhờ người.","Bạn có xu hướng giỏi nắm bắt cơ hội làm ăn thực tế. Thận trọng đánh giá cơ hội trước khi xuống tiền sẽ giúp bạn tránh sai lầm lớn.","cat"]],
"tuHoa|Điền Trạch|Khoa":[["Nhiều tác giả","Điền Trạch tự hóa Khoa: chi tiêu khiêm tốn, đúng việc; gia đình có danh tiếng, khí chất thư hương, nhà trang nhã; nhờ người giúp mà có bất động sản. Lộc đi cùng Khoa thì biết tiết chế; Quyền đi cùng Khoa thì được quý nhân đề bạt nhưng phần nhiều là hỗ trợ tinh thần.","Bạn thuộc mẫu người sống giản dị, coi trọng nếp nhà và danh dự gia đình. Giữ lối sống thanh nhã ấy sẽ được nhiều người quý trọng.","cat"]],
"phi|Điền Trạch|Kỵ|Tử Tức":[["Giáo trình Tứ Hóa","Kỵ phi từ Điền Trạch nhập Tử Tức (Lưu xuất Kỵ, tự xung Điền): tiền đi ra khỏi nhà, của cải chẳng nên ôm giữ; con cái gánh vác việc nhà; đời lắm thăng trầm, có lúc phải dọn nhà; nên tính chuyện hưu trí, mua bảo hiểm khi còn khỏe.","Bạn có xu hướng thấy tài sản gia đình khó đứng yên một chỗ. Chủ động lập kế hoạch cho tuổi già và đầu tư có mục đích sẽ giúp bạn an tâm.","hung"],["Trần Bỉnh Húc","Có tổ nghiệp hay không còn tùy sao tốt hay sát tinh chiếu vào; nhiều chuyện tình cảm, người phối ngẫu có thể đã từng có gia đình.","Bạn có xu hướng có những mối quan hệ phức tạp hơn người khác. Thẳng thắn và tôn trọng quá khứ của nhau là cách giữ hòa khí.","trung"]],
"phi|Điền Trạch|Lộc|Phúc Đức":[["","Điền Trạch phi Lộc nhập Phúc Đức: gia đình hỗ trợ, có thừa kế tổ nghiệp, nhà rộng, sống thoải mái, nhà đất tăng giá.","Bạn có xu hướng được gia đình làm điểm tựa vững chắc. Giữ gìn và phát triển những gì được trao lại là cách đền đáp tốt nhất.","cat"]],
"phi|Điền Trạch|Quyền|Phụ Mẫu":[["","Quyền phi từ Điền Trạch nhập Phụ Mẫu: nhà có thế lực trong xã hội, cha mẹ có uy tín, nhà đất đáng giá, hợp buôn bán bất động sản; tránh để gia tộc quá cứng rắn. Xét đại vận thì còn đọc là 'có thành tựu, quang minh'.","Bạn có xu hướng xuất thân từ nền nếp có uy tín. Kế thừa nền tảng đó với tinh thần cởi mở sẽ giúp bạn đi xa hơn.","cat"]],
"phi|Điền Trạch|Khoa|Nô Bộc":[["","Khoa phi từ Điền Trạch nhập Nô Bộc: nhà có tiếng tốt, hàng xóm êm thấm, bạn bè qua lại giúp nhau; hợp làm kế toán, quản lý tài vụ hoặc nghề nhà đất.","Bạn thuộc mẫu người được hàng xóm, bạn bè quý mến. Công việc cần sự cẩn trọng, chính xác như quản lý tài chính rất hợp với bạn.","cat"]],
"phi|Điền Trạch|Lộc|Tật Ách":[["","Điền Trạch phi Lộc nhập Tật Ách: gia đình hòa thuận, cuộc sống an nhàn, hưởng khoái lạc thân thể; hợp kết hợp nhà ở với kinh doanh; được chiều nên dễ lười, thiếu tự lập, ăn nhiều dễ béo.","Bạn có xu hướng có cuộc sống gia đình thoải mái, dễ chịu. Tự đặt mục tiêu rèn luyện sẽ giúp bạn không bị sự thoải mái làm chậm bước.","cat"]],
"phi|Điền Trạch|Quyền|Tài Bạch":[["","Điền Trạch phi Quyền nhập Tài Bạch: gia đình hoạt lực, kinh tế mạnh, giỏi quản tài chính, người nhà thích quyền và được ủng hộ; mua nhà dựa vào sức mình, đầu tư bằng tiền nhà; dễ xa xỉ vì Quyền xuất.","Bạn thuộc mẫu người năng động, dùng tài sản gia đình để làm ăn. Giữ chi tiêu ở mức hợp lý sẽ giúp vốn liếng không bị hao.","cat"]],
"phi|Điền Trạch|Kỵ|Quan Lộc":[["Huy Hà Phan; Lai Nhân Cung; Trung Châu; Lương Nhược Du","Điền Trạch phi Kỵ nhập Quan Lộc (Thuận thủy Kỵ): gánh trách nhiệm gia đình, thường là con trưởng; sự nghiệp bị kìm hãm, gia đình ít hỗ trợ, nên tự lập; hợp việc ổn định, dịch vụ hoặc buôn nhỏ, tách cửa hàng khỏi nhà ở; vợ chồng ít gần nhau.","Bạn có xu hướng gánh vác gia đình từ sớm và phải tự lực trong sự nghiệp. Tách bạch việc nhà với việc làm ăn và giữ thời gian cho vợ chồng sẽ giúp bạn bớt áp lực.","trung"],["Ông Phúc Dụ; Trung Châu","Dùng vốn nhà để làm ăn, hụt vốn thì dễ rắc rối; khi tậu nhà chớ để bạn đời đứng tên.","Bạn có xu hướng dùng vốn liếng gia đình để làm ăn. Rõ ràng giấy tờ, tính toán vốn kỹ trước khi đầu tư sẽ tránh rắc rối.","hung"],["","Khi Kỵ là sao đồng loại (cùng loại với chủ đề) nhập Quan Lộc: đi làm kiếm tiền, thuộc tượng tốt.","Bạn thuộc mẫu người chăm chỉ đi làm để lo cho gia đình. Sự chăm chỉ đó sẽ được đền đáp xứng đáng.","cat"]],
"phi|Điền Trạch|Lộc|Mệnh":[["Đồng bộ đoạn quyết; Huy Hà; Lai Nhân; Trung Châu; Lương Nhược Du","Lộc phi từ Điền Trạch nhập Mệnh: gia thế khá, được hưởng phúc, dễ có nhà đất; xét đại vận thì ứng vào những năm thuận.","Bạn có xu hướng được gia đình nâng đỡ và có duyên với nhà cửa. Gìn giữ tài sản và quan hệ gia đình sẽ giúp phần may mắn này bền lâu.","cat"]],
"phi|Điền Trạch|Quyền|Nô Bộc":[["Huy Hà; Lai Nhân; Trung Châu; Lương Nhược Du","Quyền phi từ Điền Trạch nhập Nô Bộc: giao thiệp với người có quyền thế; buôn bán sỉ hoặc làm bất động sản thì có lời.","Bạn có xu hướng quen biết những người có tầm ảnh hưởng. Dùng các mối quan hệ đó một cách tử tế sẽ mở ra cơ hội làm ăn.","cat"]],
"phi|Điền Trạch|Lộc|Thiên Di":[["Giáo trình Tứ Hóa","Lộc phi từ Điền Trạch nhập Thiên Di: gia thế khá, tài sản tăng lên, hay đổi chỗ ở, có dịp đi xa.","Bạn có xu hướng có cơ hội đổi chỗ ở theo hướng tốt lên. Đón nhận thay đổi với kế hoạch rõ ràng sẽ giúp bạn an cư ở nơi mới.","cat"]],
"phi|Điền Trạch|Khoa|Tử Tức":[["Lai Nhân Cung 144 quyết","Khoa phi từ Điền Trạch nhập Tử Tức: nếp nhà thư hương, con cái lịch thiệp, có điều dễ mộng mơ xa rời thực tế.","Bạn có xu hướng xây dựng một gia đình nề nếp, yêu tri thức. Khuyến khích con trải nghiệm thực tế sẽ cân bằng với sự mơ mộng.","cat"]],
"mchat|Điền Trạch|chat":[["Trịnh Mục Đức","Điền Trạch có M chất: kiếm tiền từ bất động sản; hoặc ưu tiên ước mơ hơn tiền, được phúc tổ.","Bạn có xu hướng gắn sự nghiệp hoặc ước mơ với tổ ấm. Biết rõ mình muốn gì sẽ giúp bạn đầu tư đúng chỗ.","cat"]],
"mchat|Điền Trạch|Quan Lộc":[["Trịnh Mục Đức","Điền Trạch có M Quan: nhà gần chỗ làm, có thể mua đất tự xây công ty.","Bạn có xu hướng gắn nơi ở với nơi làm việc. Bố trí không gian hợp lý sẽ giúp bạn vừa làm tốt vừa sống thoải mái.","cat"]],
"mchat|Điền Trạch|Tài Bạch":[["Trịnh Mục Đức","M Tài có ở Điền Trạch: có tiền là tậu nhà; làm bất động sản thu được nhiều.","Bạn thuộc mẫu người tin vào tài sản thật. Nghiên cứu kỹ trước khi mua sẽ giúp khoản đầu tư sinh lời.","cat"]],
"mchat|Điền Trạch|Tật Ách":[["Trịnh Mục Đức","Điền Trạch có M Tật: tự mua đất, nhà, nhờ vậy giữ được tiền.","Bạn có xu hướng giữ tiền bằng cách mua tài sản cố định. Đó là cách tích lũy rất hợp với bạn.","cat"]],
"mchat|Điền Trạch|Nô Bộc":[["Trịnh Mục Đức","Điền Trạch có M Nô: mua nhà cùng bạn bè hoặc qua bạn bè.","Bạn có xu hướng có cơ hội nhà cửa qua người quen. Làm giấy tờ rõ ràng dù là bạn thân sẽ giữ được tình bạn.","trung"]],
"mchat|Điền Trạch|Phụ Mẫu":[["Trịnh Mục Đức","Điền Trạch có M Phụ: nhận tiền hoặc nhà đất từ cha mẹ.","Bạn có xu hướng được cha mẹ hỗ trợ chuyện an cư. Trân trọng và chăm sóc cha mẹ là cách đáp lại trọn vẹn.","cat"]],
"mchat|Điền Trạch|Phúc Đức":[["Trịnh Mục Đức","Điền Trạch có M Phúc: lo nhà cửa để kiếm tiền, nhà là nguồn vui.","Bạn thuộc mẫu người tìm thấy niềm vui trong tổ ấm. Đầu tư cho không gian sống là đầu tư cho tinh thần.","cat"]],
"mchat|Điền Trạch|Tử Tức":[["Trịnh Mục Đức","Điền Trạch có M Tử: mua nhà đất cho con.","Bạn có xu hướng lo nền tảng cho thế hệ sau. Lên kế hoạch sớm và công bằng sẽ giữ được hòa khí trong nhà.","cat"]],
"sao|Thái Âm|Điền Trạch":[["Trần Đoàn; Trần Bỉnh Húc; Sở Hoàng","Thái Âm tại Điền Trạch: miếu vượng thì nhiều điền sản, có tổ nghiệp; hãm và gặp sát thì gần như không có, phải tự xây; Thái Âm Hóa Lộc là kho tiền, hợp tác làm cổ đông; cung khí đại cát thì có điền sản, đại hung cần đại vận cứu.","Bạn có xu hướng tích lũy tài sản theo cách chậm mà chắc. Kiên trì để dành và đầu tư dài hạn sẽ giúp bạn có nền tảng vững.","cat"]],
"sao|Thiên Đồng|Điền Trạch":[["Nhiều tác giả","Thiên Đồng tại Điền Trạch: trước ít sau nhiều, tự lập thì thịnh; miếu thì trước khó sau thuận, hãm thì về già mới có; có tổ nghiệp nhưng không quá thích mua; gặp sát thì khó có; Đồng Âm ở Tý tay trắng làm nên giàu lớn.","Bạn thuộc mẫu người đi từ ít thành nhiều về tài sản. Kiên nhẫn tích lũy, đừng so sánh với người khác, thành quả sẽ đến.","cat"]],
"sao|Thất Sát|Điền Trạch":[["","Thất Sát tại Điền Trạch: có Hóa Lộc có thể phát phú; miếu thì hưởng tổ nghiệp, hãm dễ trắng tay, làm hao tổ nghiệp.","Bạn có xu hướng có tài sản biến động mạnh. Đa dạng hóa và tránh đặt cược toàn bộ vào một chỗ sẽ giữ an toàn.","trung"]],
"sao|Hỏa Tinh|Điền Trạch":[["","Hỏa Tinh ở Điền Trạch: đơn thủ thì rời bỏ tổ nghiệp; có cát tinh thì trước cực sau sướng; gặp Không Kiếp thì mất trắng.","Bạn có xu hướng tự gây dựng tài sản thay vì nhờ vào gia đình. Đi từng bước chắc chắn sẽ giúp bạn có thành quả về sau.","trung"]],
"sao|Đà La|Điền Trạch":[["Trần Đoàn; Trần Bỉnh Húc","Đà La, Không Kiếp ở Điền Trạch: xa quê, khó gây dựng sản nghiệp, gặp hung tinh dễ mất trắng; có Khôi Việt thì tùy cát hung mà hoặc thừa hưởng tổ nghiệp, hoặc tự gây dựng.","Bạn có xu hướng lập nghiệp xa nơi chôn rau cắt rốn. Thận trọng với các khoản đầu tư lớn sẽ giúp bạn giữ được thành quả.","hung"]],
"sao|Âm Sát|Điền Trạch":[["","Âm Sát ở Điền Trạch: trong nhà dễ có chuyện tâm linh lạ hoặc còn ám ảnh vì mất người thân; hội Hỏa Tinh thì dễ bị trộm.","Bạn có xu hướng nhạy cảm với không khí trong nhà. Giữ nhà thoáng sáng, an toàn và ấm cúng sẽ giúp bạn an tâm.","trung"]],
"canCung|Tật Ách|Ất":[["Ông Phúc Dụ","Can Ất ở Tật Ách (Thiên chi Địa): thân và tâm dễ được phụ nữ quan tâm, chăm sóc.","Bạn có xu hướng được người thân nữ chăm sóc chu đáo. Biết ơn và đáp lại sự quan tâm đó sẽ giữ gia đình gắn bó.","cat"]],
"snToa|Khoa|Tật Ách":[["Nhiều tác giả","Tật Ách có Hóa Khoa năm sinh tọa thủ: dáng người thanh tú, cử chỉ hòa nhã, ít nóng tính; ít bệnh nặng, có bệnh thì gặp thầy thuốc giỏi (Khoa giải nạn sau khi sự việc xảy ra); sáng dạ, đa sầu đa cảm; mong được kế thừa, sự nghiệp có thể bước lên tầm cao mới.","Bạn thuộc mẫu người nhã nhặn, nhạy cảm và có nhiều cảm xúc. Chăm sóc sức khỏe chủ động và chia sẻ cảm xúc sẽ giúp bạn luôn cân bằng.","cat"]],
"phi|Tật Ách|Lộc|Tài Bạch":[["","Lộc phi từ Tật Ách nhập Tài Bạch: làm ra tiền nhẹ nhàng, thích hưởng thụ, quý nhân là người trên; dễ chi tiêu tùy hứng.","Bạn có xu hướng kiếm tiền khá dễ dàng nhờ được người trên giúp. Để dành trước khi tiêu sẽ giúp bạn không phung phí.","cat"]],
"phi|Tật Ách|Quyền|Mệnh":[["Nhiều tác giả","Tật Ách phi Quyền nhập Mệnh: thể chất khỏe, nhiều sức sống, chịu áp lực, thích vận động, dám chi; cá tính mạnh, thích nổi bật, hay chỉ huy, độc đoán, dễ va chạm lúc trẻ, vất vả vì gia đình.","Bạn thuộc mẫu người tràn đầy năng lượng và bản lĩnh. Vận động an toàn, biết nghỉ đúng lúc và mềm mỏng hơn với người khác sẽ giúp bạn đi đường dài.","trung"]],
"phi|Tật Ách|Khoa|Quan Lộc":[["Nhiều tác giả","Tật Ách phi Khoa nhập Quan Lộc: làm việc chậm rãi, tỉ mỉ, có hệ thống, kế hoạch rõ; việc nhẹ, hòa hợp đồng nghiệp, hài lòng công việc; chức vụ không lớn; dễ mệt nếu lao tâm.","Bạn thuộc mẫu người làm việc cẩn thận, có kế hoạch và hòa nhã. Chọn môi trường ổn định và biết thư giãn sẽ giúp bạn làm lâu dài.","cat"]],
"phi|Tật Ách|Kỵ|Nô Bộc":[["Nhiều tác giả","Tật Ách phi Kỵ nhập Nô Bộc (Thuận thủy Kỵ): giao tiếp lạnh nhạt, nhân duyên kém, sức khỏe dễ sa sút; không tiết kiệm, chơi với bạn không tiếc tiền, có thể nợ bạn bè; thời trẻ dễ giao du bạn xấu; vợ chồng có thể đồng sàng dị mộng.","Bạn có xu hướng tiêu hao sức lực và tiền bạc cho các mối quan hệ bên ngoài. Chọn bạn kỹ, giữ sức khỏe và dành nhiều thời gian hơn cho gia đình sẽ giúp bạn cân bằng.","hung"],["Bản Hán-Việt","Không thích thân mật vội vàng; nên chú ý sức khỏe; một số sách khuyên ngủ riêng để tránh vợ chồng xa cách.","Bạn thuộc mẫu người cần không gian riêng. Nói rõ nhu cầu này với người bạn đời sẽ giúp hai người hiểu và tôn trọng nhau.","trung"],["Tiên thiên tứ hóa phi tinh kỳ phổ","Nếu Nô Bộc phi Lộc lại Tật Ách thì thành Thị phi Kỵ: hai bên đối đãi không cân xứng.","Bạn có xu hướng gặp những tình bạn không cân bằng cho nhận. Giữ ranh giới rõ sẽ giúp bạn không bị thiệt.","trung"]],
"phi|Tật Ách|Lộc|Mệnh":[["Nhiều tác giả","Lộc phi từ Tật Ách nhập Mệnh: thân thể có phúc trạch, lạc quan, nhân duyên tốt, rộng lượng, sĩ diện; ham ăn, dễ mập, ngại vận động; vận nhà tốt, hiếm bệnh mãn tính, có lộc ăn uống.","Bạn thuộc mẫu người lạc quan và biết hưởng thụ. Vận động đều đặn và ăn uống điều độ sẽ giữ được sự thoải mái lâu dài.","cat"]],
"phi|Tật Ách|Lộc|Tử Tức":[["Huy Hà; Lai Nhân; Trung Châu; Lương Nhược Du","Lộc phi từ Tật Ách nhập Tử Tức: thương trẻ nhỏ, ôn hòa, ưa đi đây đó; dễ lười hoặc đa tình.","Bạn thuộc mẫu người hòa nhã và yêu trẻ. Giữ chừng mực trong tình cảm và tự đặt mục tiêu sẽ giúp bạn không chểnh mảng.","cat"]],
"tuHoa|Tật Ách|Quyền":[["Cửu cửu; Huy Hà; Lai Nhân; Trung Châu; Lương Nhược Du","Tật Ách tự hóa Quyền: tính cương, hay va chạm, dễ chấn thương.","Bạn có xu hướng hành động nhanh và mạnh. Chậm lại một nhịp, nhất là khi di chuyển hay vận động, sẽ giúp bạn an toàn hơn.","trung"]],
"phi|Tật Ách|Khoa|Phu Thê":[["Huy Hà; Lai Nhân; Trung Châu; Lương Nhược Du","Khoa phi từ Tật Ách nhập Phu Thê: vóc người cân đối, dáng điệu thanh lịch, vợ chồng hợp nhau.","Bạn thuộc mẫu người thanh lịch và dễ hòa hợp trong hôn nhân. Giữ sự tế nhị ấy là bí quyết của gia đình êm ấm.","cat"]],
"phi|Tật Ách|Kỵ|Điền Trạch":[["Huy Hà; Lai Nhân; Trung Châu; Lương Nhược Du; Ông Phúc Dụ","Tật Ách phi Kỵ nhập Điền Trạch (Thuận thủy Kỵ): khép kín, thích ở nhà, gia vận trì trệ; cần lưu ý sức khỏe lâu dài.","Bạn có xu hướng thu mình ở nhà và ít ra ngoài. Ra ngoài vận động, gặp gỡ thường xuyên hơn sẽ giúp tinh thần và sức khỏe tốt lên.","hung"]],
"mchat|Tật Ách|chat":[["Trịnh Mục Đức","Tật Ách có M chất: lao tâm lao lực; có duyên lành trời ban với người phối ngẫu.","Bạn có xu hướng làm việc hết sức mình. Biết giữ sức là cách để đi đường dài.","trung"]],
"mchat|Tật Ách|Mệnh":[["Trịnh Mục Đức","Tật Ách có M Mệnh: thiên sinh lao tâm lao bác, tự kiếm tiền một mình.","Bạn thuộc mẫu người tự lực cánh sinh. Tìm người hỗ trợ đáng tin sẽ giúp bạn đỡ vất vả.","trung"]],
"mchat|Tật Ách|Nô Bộc":[["Trịnh Mục Đức","Tật Ách có M Nô: bẩm sinh thích kết bạn, thành bại đều do bạn bè.","Bạn có xu hướng sống vì bạn bè. Chọn bạn tốt chính là chọn tương lai.","trung"]],
"mchat|Tật Ách|Quan Lộc":[["Trịnh Mục Đức","Tật Ách có M Quan: lao tâm, chỉ khi tự chủ được sự nghiệp mới thành công.","Bạn thuộc mẫu người làm tốt nhất khi được tự chủ. Hướng tới công việc độc lập hoặc vị trí được quyết định sẽ hợp với bạn.","trung"]],
"mchat|Tật Ách|Điền Trạch":[["Trịnh Mục Đức","Tật Ách có M Điền, M Phối hoặc M Tử: thích ở nhà; khi lập gia đình và có con thì vận sẽ chuyển mạnh.","Bạn có xu hướng thấy cuộc sống sang trang khi lập gia đình. Chuẩn bị tốt cho giai đoạn đó sẽ giúp bạn tận dụng vận mới.","cat"]],
"sao|Phá Quân|Tật Ách":[["","Phá Quân ở Tật Ách: miếu vượng thì chỉ bệnh nhẹ; hãm địa dễ mắc bệnh đường tiết niệu, ngoài da, sinh lý; đi cùng Tứ sát dễ bị thương tật. (Chỉ dùng ở tầng chuyên môn.)","Bạn có xu hướng cần chú ý giữ gìn thể lực hơn người khác. Khám định kỳ và vận động an toàn là thói quen nên giữ.","trung"]],
"sao|Thiên Cơ|Tật Ách":[["Nhiều tác giả","Thiên Cơ tại Tật Ách: liên quan gan mật, thần kinh, mắt, tứ chi, khớp; thời nhỏ nhiều va vấp; Cơ Lương thì hạ bộ; Cơ Khoa thì thích tôn giáo, triết học, thông minh nhưng không thích nghĩ nhiều. (Tầng chuyên môn.)","Bạn có xu hướng dễ căng thẳng thần kinh khi làm việc trí óc nhiều. Ngủ đủ và nghỉ mắt thường xuyên sẽ giúp bạn khỏe.","trung"]],
"sao|Thiên Lương|Tật Ách":[["Trần Đoàn; Trần Bỉnh Húc; Sở Hoàng","Thiên Lương tại Tật Ách: miếu thì ít bệnh; hãm gặp sát có tổn thương; liên quan tiêu hóa, da, mũi, xương. (Tầng chuyên môn.)","Bạn thuộc mẫu người có sức đề kháng khá. Ăn uống điều độ sẽ giữ được thế mạnh đó.","cat"]],
"sao|Thái Dương|Tật Ách":[["Hà Lạc; Trần Đoàn; Trần Bỉnh Húc; Sở Hoàng","Thái Dương tại Tật Ách: liên quan đầu, mắt, tim; hãm dễ bệnh mắt. (Tầng chuyên môn.)","Bạn có xu hướng làm việc hăng say mà quên nghỉ. Giữ nhịp sinh hoạt đều đặn sẽ giúp bạn luôn sung sức.","trung"]],
"canCung|Thiên Di|Giáp":[["Ông Phúc Dụ","Thiên Di can Giáp (Thiên chi Thiên): tự lập, tự cường, tự giải quyết việc một mình.","Bạn thuộc mẫu người tự lập khi ra ngoài xã hội. Biết nhờ giúp đỡ đúng lúc sẽ khiến bạn đi nhanh hơn.","cat"]],
"phi|Thiên Di|Lộc|Mệnh":[["Nhiều tác giả","Lộc phi từ Thiên Di nhập Mệnh (đối cung, Tiết xuất hoặc Điệp xuất Lộc): ra ngoài có vận và cơ hội, giao thiệp tốt, kiếm tiền nhờ quan hệ, hợp ngành dịch vụ, quan hệ công chúng, công quyền; sáng dạ, hướng ngoại, đi nước ngoài nhờ thực lực.","Bạn thuộc mẫu người gặp nhiều cơ hội khi ra ngoài và giỏi giao tiếp. Mở rộng quan hệ một cách chân thành sẽ đem lại nhiều thành quả.","cat"],["Bản Hán-Việt; nhiều tác giả","Lưu ý hư vinh, nịnh bợ, lời tâng bốc; quản tiền kém, dễ thất thoát vì giao tế rộng; có Song Lộc thì tùy Kỵ có bị chế hay không.","Bạn có xu hướng dễ nghe lời khen và tiêu nhiều cho giao tiếp. Tỉnh táo trước lời ngọt và đặt giới hạn chi tiêu sẽ giữ được thành quả.","trung"]],
"phi|Thiên Di|Quyền|Phúc Đức":[["","Quyền phi từ Thiên Di nhập Phúc Đức: ưa phô trương, xa hoa, hiếu thắng, chí mạnh; dễ tiêu quá tay, kiêu căng.","Bạn có xu hướng muốn thể hiện mình trước người khác. Giữ sự khiêm tốn và chi tiêu vừa phải sẽ giúp bạn được quý trọng thật lòng.","trung"]],
"phi|Thiên Di|Khoa|Phụ Mẫu":[["","Khoa phi từ Thiên Di nhập Phụ Mẫu: có của ông bà để lại, được thầy và bề trên nâng đỡ, học hành có tiếng, có thể đi du học.","Bạn có xu hướng được thầy cô, người đi trước nâng đỡ. Chăm chỉ học hỏi sẽ giúp bạn tận dụng tốt sự giúp đỡ đó.","cat"]],
"phi|Thiên Di|Kỵ|Phu Thê":[["","Kỵ phi từ Thiên Di nhập Phu Thê (Thuận thủy Kỵ): ra ngoài gặp trắc trở, vợ chồng xích mích, người thứ ba dễ chen vào, sự nghiệp bị ảnh hưởng; coi chừng cờ bạc. Nếu Quan Lộc cũng nhận thêm Kỵ thì hình thành Củ triền Kỵ.","Bạn có xu hướng mang áp lực bên ngoài về nhà. Chia sẻ thẳng thắn với người bạn đời và tránh các thú vui may rủi sẽ giữ được tổ ấm.","hung"]],
"phi|Thiên Di|Quyền|Nô Bộc":[["Nhiều tác giả","Thiên Di phi Quyền nhập Nô Bộc: năng lực xã giao, tổ chức, thể hiện; nhiều bạn ở ngoài, bạn và anh em có địa vị; giao du rộng, hào phóng, được người lớn giúp nhưng dễ tranh chấp; cảnh giác sĩ diện, phô trương.","Bạn thuộc mẫu người giỏi kết nối và tổ chức. Giữ sự chân thành, tránh phô trương sẽ giúp các mối quan hệ bền.","cat"]],
"phi|Thiên Di|Khoa|Điền Trạch":[["Nhiều tác giả","Thiên Di phi Khoa nhập Điền Trạch: ra ngoài có biến động nhỏ, thuận; cẩn trọng, có danh, gia đình nhiều văn nhân, nhà yên tĩnh thanh nhã; hay dời nhà, mua tài sản nơi khác.","Bạn có xu hướng có những thay đổi chỗ ở nhẹ nhàng, thuận lợi. Chọn nơi ở yên tĩnh sẽ giúp bạn làm việc và nghỉ ngơi tốt.","cat"]],
"phi|Thiên Di|Kỵ|Quan Lộc":[["Nhiều tác giả","Kỵ phi từ Thiên Di nhập Quan Lộc (Thuận thủy Kỵ, xung Phu Thê): giao thiệp kém, sự nghiệp bên ngoài không thuận, thành ít hỏng nhiều, công nhiều lợi ít, bận việc nên vợ chồng xa cách; coi chừng tiểu nhân, rối loạn nhân sự, nên cẩn trọng lời ăn tiếng nói.","Bạn có xu hướng gặp nhiều trở ngại khi làm việc ở môi trường bên ngoài. Cẩn trọng lời nói, chọn đồng nghiệp tin cậy và giữ thời gian cho gia đình sẽ giúp bạn vững vàng.","hung"]],
"phi|Thiên Di|Lộc|Phúc Đức":[["Huy Hà; Lai Nhân; Trung Châu; Lương Nhược Du; Tinh hoa","Lộc phi từ Thiên Di nhập Phúc Đức: đi ra ngoài thì được hưởng thụ, gặp quý nhân, tài vận khá.","Bạn có xu hướng gặp niềm vui và may mắn khi đi xa. Những chuyến đi cũng là cơ hội để bạn mở rộng quan hệ.","cat"]],
"phi|Thiên Di|Quyền|Mệnh":[["Huy Hà; Lai Nhân; Trung Châu; Lương Nhược Du; Tinh hoa","Quyền phi từ Thiên Di nhập Mệnh: có địa vị, giỏi lãnh đạo, dễ tranh giành.","Bạn thuộc mẫu người có uy tín ngoài xã hội. Dùng ảnh hưởng của mình một cách ôn hòa sẽ tránh được va chạm.","cat"]],
"tuHoa|Thiên Di|Khoa":[["Cửu cửu; Huy Hà; Lai Nhân; Trung Châu; Lương Nhược Du; Tinh hoa","Thiên Di tự hóa Khoa: ra ngoài có tiếng tốt, có quý nhân, song hay lưỡng lự.","Bạn có xu hướng được tiếng tốt ở bên ngoài. Quyết đoán hơn khi gặp cơ hội sẽ giúp bạn không bỏ lỡ.","cat"]],
"phi|Thiên Di|Kỵ|Tật Ách":[["Huy Hà; Lai Nhân; Trung Châu; Lương Nhược Du; Tinh hoa","Thiên Di phi Kỵ nhập Tật Ách (Thuận thủy Kỵ): bôn ba, ra ngoài ít thuận, dễ tổn hại thân tâm.","Bạn có xu hướng mệt mỏi khi phải di chuyển nhiều. Lên lịch hợp lý và giữ sức khỏe khi đi xa sẽ giúp bạn thoải mái hơn.","hung"]],
"mchat|Thiên Di|Điền Trạch":[["Trịnh Mục Đức","Thiên Di có M Điền: xuất ngoại, rời quê, sau khi chuyển nhà vận mới mạnh lên.","Bạn có xu hướng khởi sắc sau khi đổi nơi ở. Mạnh dạn thay đổi môi trường khi thấy bế tắc sẽ mở ra vận mới.","cat"]],
"mchat|Thiên Di|Mệnh":[["Trịnh Mục Đức","M Mệnh có ở Thiên Di: đi xa gặp quý nhân; ở yên một chỗ dễ gặp chuyện bất ngờ.","Bạn thuộc mẫu người gặp may khi ra ngoài. Chủ động mở rộng phạm vi hoạt động sẽ mang lại nhiều cơ hội.","cat"]],
"mchat|Thiên Di|Nô Bộc":[["Trịnh Mục Đức","Thiên Di có M Nô: xuất ngoại nhờ bạn bè, thành bại do bạn bè.","Bạn có xu hướng có cơ hội đi xa nhờ người quen. Chọn đúng người đồng hành sẽ quyết định thành công.","trung"]],
"mchat|Thiên Di|Quan Lộc":[["Trịnh Mục Đức","M Quan có ở Thiên Di: làm nghề giao dịch ngoài xã hội thì thành công; phải ra ngoài mới làm ra tiền.","Bạn thuộc mẫu người làm ăn tốt ở môi trường rộng. Công việc cần đi lại, giao dịch sẽ hợp với bạn.","cat"]],
"mchat|Thiên Di|Phúc Đức":[["Trịnh Mục Đức","Thiên Di có M Phúc / M Tật / M Phối / M Phụ: thích đi xa, lao tâm; được cử công tác nước ngoài, gặp quý nhân.","Bạn có xu hướng có những chuyến đi mang lại cơ hội. Chuẩn bị kỹ năng ngoại ngữ, giao tiếp sẽ giúp bạn tận dụng tốt.","cat"]],
"sao|Thiên Tướng|Thiên Di":[["Hà Lạc; Trần Đoàn; Trần Bỉnh Húc; Sở Hoàng","Thiên Tướng tại Thiên Di: ra ngoài được quý nhân phù trợ, có người theo; miếu vượng và cát tinh thì tốt, sát tinh thì xấu; cung khí đại cát và Thiên Tướng là hỉ thần thì sớm có xe, kỵ thần thì cần đại vận tốt.","Bạn có xu hướng được người khác giúp đỡ khi ra ngoài. Giữ uy tín và lòng biết ơn sẽ khiến sự giúp đỡ luôn sẵn có.","cat"]],
"sao|Vũ Khúc|Thiên Di":[["Hà Lạc; Trần Đoàn; Trần Bỉnh Húc; Sở Hoàng","Vũ Khúc ở Thiên Di: lập thân nhờ tay nghề, bôn ba, có thể phát tài nơi xa.","Bạn thuộc mẫu người lập nghiệp bằng tay nghề và sự chăm chỉ. Rèn chuyên môn vững sẽ giúp bạn thành công ở bất cứ đâu.","cat"]],
"sao|Âm Sát|Thiên Di":[["Tử vi tinh điển","Âm Sát tại Thiên Di: cô độc, khó hòa đồng, dễ mê muội vào điều hư ảo.","Bạn có xu hướng giữ khoảng cách với đám đông. Tìm một nhóm nhỏ hợp chí hướng sẽ giúp bạn hòa nhập tự nhiên.","trung"]],
"canCung|Quan Lộc|Giáp":[["Ông Phúc Dụ","Quan Lộc can Giáp (Thiên chi Thiên): sự nghiệp dựa vào nỗ lực bản thân.","Bạn thuộc mẫu người tự tay xây dựng sự nghiệp. Kiên trì với con đường đã chọn sẽ đưa bạn đến thành công.","cat"]],
"snToa|Kỵ|Quan Lộc":[["Huy Hà Phan; Lai Nhân Cung; Trịnh Mục Đức","Quan Lộc có Hóa Kỵ năm sinh tọa thủ: xem công việc là trách nhiệm, áp lực nặng, phải tự tay làm, làm dai dẳng; phải lao bác mới nên; hôn nhân dễ bị vạ lây.","Bạn thuộc mẫu người có tinh thần trách nhiệm cao với công việc. Chia sẻ bớt việc và dành thời gian cho gia đình sẽ giúp bạn bền bỉ hơn.","trung"],["Lưu Kim Phủ; Ông Phúc Dụ; Phi tinh Trần Đoàn","Việc làm nhiều biến động, hay nhảy việc, lúc lên lúc xuống thất thường; cẩn thận mà khó thăng tiến; nên buôn bán thu tiền mặt; học hành tầm trung bình; lập gia đình muộn.","Bạn có xu hướng trải qua nhiều thay đổi trong công việc. Mỗi lần thay đổi hãy giữ lại một kỹ năng, dần dần bạn sẽ có nền tảng vững.","trung"],["Trần Bỉnh Húc; Từ Tăng Sinh","Công việc dễ gặp sự cố, cát tinh chỉ giảm nhẹ; tâm lý dao động, cần chú tâm; nếu Kỵ là Tham Lang thì nhiều thị phi, dễ vướng rắc rối pháp lý nếu làm ăn không minh bạch, hợp giải trí nghệ thuật.","Bạn có xu hướng gặp va vấp trong công việc khi tâm trí phân tán. Làm việc minh bạch và tập trung từng việc sẽ giúp bạn tránh rắc rối.","hung"]],
"phi|Quan Lộc|Lộc|Tật Ách":[["","Lộc phi từ Quan Lộc nhập Tật Ách: việc nhẹ, nhiều dịp may, có điều dễ thiếu chăm chỉ.","Bạn có xu hướng có công việc khá dễ chịu. Giữ kỷ luật làm việc sẽ giúp bạn tận dụng hết cơ hội.","cat"]],
"phi|Quan Lộc|Quyền|Mệnh":[["Huy Hà Phan; Lương Nhược Du; Lai Nhân Cung","Quan Lộc phi Quyền nhập Mệnh: năng lực lập nghiệp, tự tin, dễ thăng tiến, hợp lãnh đạo, thích thành tích; gặp Kỵ thì căng thẳng, làm quá sức.","Bạn thuộc mẫu người có năng lực và chí tiến thủ. Biết nghỉ ngơi đúng lúc sẽ giúp bạn giữ phong độ lâu dài.","cat"]],
"phi|Quan Lộc|Khoa|Phu Thê":[["","Khoa phi từ Quan Lộc nhập Phu Thê: sự nghiệp vững, hợp làm công chức; coi trọng hình thức và truyền thông.","Bạn có xu hướng hợp với công việc ổn định, có quy củ. Chăm chút hình ảnh nghề nghiệp sẽ giúp bạn được tin tưởng.","cat"]],
"phi|Quan Lộc|Kỵ|Huynh Đệ":[["","Kỵ phi từ Quan Lộc nhập Huynh Đệ: đầu tư không thuận, dễ thị phi với bạn bè, người cộng sự; xét đại vận là 'không có thành tựu' trên trục Huynh–Nô.","Bạn có xu hướng gặp va chạm với người cùng làm. Hợp tác có thỏa thuận rõ và thận trọng khi góp vốn sẽ giúp bạn tránh thiệt.","hung"]],
"phi|Quan Lộc|Lộc|Mệnh":[["Nhiều tác giả","Quan Lộc phi Lộc nhập Mệnh: tự kiếm tiền bằng năng lực, công việc như ý, có duyên với sự nghiệp, thăng tiến tự nhiên; thông minh, độc lập, sáng lập được cơ nghiệp; hợp nghề tự do, hoa hồng; dễ tự mãn.","Bạn thuộc mẫu người có duyên với công việc và tự lực tốt. Giữ tinh thần cầu tiến sẽ giúp bạn không dừng lại ở thành công ban đầu.","cat"]],
"phi|Quan Lộc|Quyền|Nô Bộc":[["Nhiều tác giả","Quyền phi từ Quan Lộc nhập Nô Bộc: năng lực bộc lộ qua giao tế, hợp làm cố vấn, kinh doanh thương hiệu, buôn sỉ; trong sự nghiệp, quyền nằm ở tay bạn bè; người trên khắt khe, thường đổi ý; thành tựu thấp hơn trường hợp nhập thẳng Huynh Đệ; xét đại vận là thành tựu nhờ bạn bè và người dưới.","Bạn có xu hướng thành công nhờ mạng lưới quan hệ. Chọn cộng sự đáng tin và giữ quyền chủ động trong việc lớn sẽ giúp bạn vững.","cat"]],
"phi|Quan Lộc|Khoa|Điền Trạch":[["Nhiều tác giả","Quan Lộc phi Khoa nhập Điền Trạch: công việc bình ổn, thu nhập ổn định, tài sản tích lũy dần; hợp thiết kế nội thất, môi giới, kinh doanh nhà đất; hay lo việc nhà.","Bạn thuộc mẫu người làm việc ổn định và chăm lo tổ ấm. Công việc gắn với nhà cửa, không gian sống rất hợp với bạn.","cat"]],
"tuHoa|Quan Lộc|Kỵ":[["Nhiều tác giả","Quan Lộc tự hóa Kỵ: khó làm nên việc lớn, nhìn chưa xa, sự nghiệp chông chênh, dễ đụng tiểu nhân; hợp đi làm ăn lương cố định, làm dịch vụ, đầu tư ngắn kỳ, tránh để vốn đọng; vì xung Phu Thê nên cũng phải giữ gìn hôn nhân.","Bạn có xu hướng thay đổi công việc nhanh và khó gắn bó lâu. Chọn một công việc ổn định, học sâu một nghề sẽ giúp bạn vững vàng hơn.","hung"]],
"phi|Quan Lộc|Lộc|Phúc Đức":[["Huy Hà Phan; Lai Nhân; Lương Nhược Du; Trung Châu","Lộc phi từ Quan Lộc nhập Phúc Đức: sự nghiệp làm ra tiền, biết hưởng thụ, hợp nghề theo sở thích (du lịch, ẩm thực, giải trí, thời trang); lạc quan, biết đủ; có thể cùng bạn đời làm ăn; dễ ham vui, bị động.","Bạn thuộc mẫu người làm việc vui vẻ và biết tận hưởng thành quả. Đặt mục tiêu rõ ràng sẽ giúp niềm vui không biến thành sự thụ động.","cat"]],
"phi|Quan Lộc|Khoa|Thiên Di":[["Huy Hà Phan; Trung Châu; Lương Nhược Du; Lai Nhân Cung","Quan Lộc phi Khoa nhập Thiên Di: sự nghiệp phát triển bên ngoài, đi công tác xa, có quý nhân, hình ảnh tốt; hợp truyền thông, quảng bá.","Bạn có xu hướng tỏa sáng khi làm việc với bên ngoài. Công việc cần giao tiếp, giới thiệu, quảng bá sẽ hợp với bạn.","cat"]],
"phi|Quan Lộc|Kỵ|Tật Ách":[["Huy Hà Phan; Lai Nhân; Lương Nhược Du; Phương Ngoại Nhân","Quan Lộc phi Kỵ nhập Tật Ách (Thuận thủy Kỵ, xung Phụ Mẫu): công việc vất vả, áp lực, dễ chán, làm đến già; hợp kỹ thuật hoặc buôn nhỏ; cố chấp, khó giao tiếp; ở đại vận là 'mất quang minh'.","Bạn có xu hướng gánh nhiều áp lực công việc lên vai mình. Học cách nghỉ ngơi và chia sẻ việc sẽ giúp bạn làm lâu mà không kiệt sức.","hung"]],
"sao|Tham Lang|Quan Lộc":[["Nhiều tác giả","Tham Lang tại Quan Lộc: sao tài nghệ, hợp ăn uống, thời trang, trang trí, giải trí, thương nghiệp, giao tế, đầu cơ; sự nghiệp khai sáng, thăng trầm, sau 30 tuổi dần tốt; miếu gặp Hỏa Linh thì nắm quyền lớn, hãm thì làm tham mưu.","Bạn có xu hướng thành công nhờ tài khéo và giao tiếp. Kiên nhẫn qua giai đoạn đầu vất vả, sự nghiệp sẽ dần khởi sắc.","cat"]],
"sao|Vũ Khúc|Quan Lộc":[["Nhiều tác giả","Vũ Khúc tại Quan Lộc: tài tinh, cô độc, hợp tài chính, ngân hàng, bảo hiểm, quân cảnh, ngành kim khí; miếu gặp Xương Khúc, Tả Hữu, Khoa Quyền Lộc thì chức cao; Vũ Tham ở Sửu Mùi sự nghiệp biến động, làm tham mưu, cố vấn.","Bạn thuộc mẫu người quyết đoán, hợp với công việc liên quan đến tiền và kỷ luật. Học thêm chuyên môn tài chính sẽ giúp bạn tiến xa.","cat"]],
"sao|Lộc Tồn|Quan Lộc":[["Phi tinh Trần Đoàn; Đẩu số cung vị","Lộc Tồn tại Quan Lộc: thuận lợi tài chính, giỏi quản tiền, hợp ngành tài chính.","Bạn có xu hướng làm tốt các công việc liên quan đến quản lý tiền. Phát triển theo hướng đó sẽ giúp bạn thành công.","cat"]],
"sao|Văn Xương|Quan Lộc":[["","Xương Khúc ở Quan Lộc: hợp thiết kế, giáo dục, nghệ thuật, học thuật, văn chương, tôn giáo; nhập miếu thì nổi danh.","Bạn thuộc mẫu người hợp với công việc sáng tạo và tri thức. Theo đuổi học thuật, giáo dục hay nghệ thuật sẽ giúp bạn tỏa sáng.","cat"]],
"sao|Kình Dương|Quan Lộc":[["","Kình Đà tại Quan Lộc: sự nghiệp trắc trở, dễ đối lập cấp trên; nhập miếu hợp võ chức.","Bạn có xu hướng thẳng tính và dễ va chạm với cấp trên. Chọn cách góp ý khéo léo sẽ giúp bạn được lắng nghe.","trung"]],
"phi|Phụ Mẫu|Khoa|Phu Thê":[["","Phụ Mẫu phi Khoa nhập Phu Thê: cha mẹ hòa nhã, thông minh, có danh, là quý nhân; hôn nhân được ủng hộ; có thể ở riêng nhưng giữ đạo hiếu.","Bạn có xu hướng được cha mẹ ủng hộ trong chuyện gia đình riêng. Giữ liên lạc và quan tâm cha mẹ dù ở xa sẽ giữ trọn tình thân.","cat"]],
"snToa|Khoa|Phụ Mẫu":[["","Hóa Khoa năm sinh tọa Phụ Mẫu: cha mẹ có học, có danh tiếng, là quý nhân; lợi cho học hành, giấy tờ.","Bạn có xu hướng được cha mẹ, thầy cô dạy dỗ chu đáo. Phát huy nền tảng học vấn đó sẽ mở ra nhiều cơ hội.","cat"]],
"phi|Phụ Mẫu|Kỵ|Tài Bạch":[["","Kỵ phi từ Phụ Mẫu nhập Tài Bạch: tốn tiền vì cha mẹ, cho mượn khó lấy lại; cẩn trọng bảo lãnh, giấy tờ, hợp đồng; tự lo tiền học; nên chăm lo sức khỏe cho cha mẹ.","Bạn có xu hướng gánh một phần tài chính cho gia đình. Đọc kỹ giấy tờ trước khi ký và lập quỹ chăm sóc cha mẹ sẽ giúp bạn chủ động.","hung"]],
"phi|Phụ Mẫu|Lộc|Phu Thê":[["","Lộc phi từ Phụ Mẫu nhập Phu Thê: cha mẹ vun vén hôn nhân, êm thấm với bạn đời của con, là chỗ dựa về tiền; chiều quá dễ làm con ỷ lại.","Bạn có xu hướng được cha mẹ hỗ trợ nhiều khi lập gia đình. Tự lập dần về tài chính sẽ khiến cha mẹ yên lòng và bạn vững hơn.","cat"]],
"phi|Phụ Mẫu|Quyền|Tử Tức":[["","Phụ Mẫu phi Quyền nhập Tử Tức: cha mẹ nghiêm khắc dạy con, có địa vị, giỏi quản tiền; con có năng lực lãnh đạo.","Bạn có xu hướng lớn lên trong sự dạy dỗ nghiêm túc. Giữ lại kỷ luật tốt và thêm sự mềm mỏng khi dạy thế hệ sau.","cat"]],
"phi|Phụ Mẫu|Lộc|Nô Bộc":[["Nhiều tác giả","Lộc phi từ Phụ Mẫu nhập Nô Bộc: cha mẹ cởi mở, hào phóng, hay giúp bạn bè, có lúc tiền bạc vượt tầm kiểm soát; được bề trên quý, thuận lợi thi cử; cấp trên hoặc bạn bè có vốn lớn.","Bạn có xu hướng được người lớn tuổi quý mến và giúp đỡ. Giữ quan hệ tốt với thầy cô, cấp trên sẽ mở nhiều cánh cửa.","cat"]],
"phi|Phụ Mẫu|Quyền|Quan Lộc":[["Nhiều tác giả","Quyền phi từ Phụ Mẫu nhập Quan Lộc: cha mẹ hoặc cấp trên đỡ đầu sự nghiệp, giúp thăng tiến; thuận lợi về chứng chỉ, công chức; với bạn đời có thể không hòa.","Bạn có xu hướng được người đi trước dìu dắt trong sự nghiệp. Cân bằng giữa công việc và gia đình nhỏ sẽ giúp mọi mặt đều thuận.","cat"]],
"phi|Phụ Mẫu|Khoa|Điền Trạch":[["Nhiều tác giả","Phụ Mẫu phi Khoa nhập Điền Trạch: cha mẹ hòa nhã, dạy bằng lý lẽ, sống giản dị, quan tâm gia đình; nhà có nếp thư hương, ít cãi vã; ít hỗ trợ kinh tế.","Bạn có xu hướng lớn lên trong một gia đình ôn hòa, coi trọng học hỏi. Tự lập về kinh tế sẽ là bước tiếp theo bạn cần chủ động.","cat"]],
"phi|Phụ Mẫu|Kỵ|Điền Trạch":[["Nhiều tác giả","Phụ Mẫu phi Kỵ nhập Điền Trạch (Thuận thủy Kỵ, xung Tử Tức): cha mẹ lo kinh tế, tiết kiệm giữ nhà, phải hiếu dưỡng; thời nhỏ gia cảnh khó; cẩn thận giao dịch tiền bạc, vay ngân hàng.","Bạn có xu hướng sớm hiểu giá trị của đồng tiền và trách nhiệm với gia đình. Lập kế hoạch tài chính cẩn trọng sẽ giúp bạn vững vàng.","trung"]],
"phi|Phụ Mẫu|Khoa|Tài Bạch":[["Đồng bộ đoạn quyết; Lai Nhân; Trung Châu","Khoa phi từ Phụ Mẫu nhập Tài Bạch: cha mẹ khá giả, quản tiền có kế hoạch, được người trên khen ngợi.","Bạn có xu hướng học được cách quản lý tiền từ gia đình. Áp dụng nền nếp đó sẽ giúp tài chính của bạn ổn định.","cat"]],
"phi|Phụ Mẫu|Quyền|Tật Ách":[["Huy Hà Phan; Lai Nhân; Trung Châu; Lương Nhược Du","Phụ Mẫu phi Quyền nhập Tật Ách: cha mẹ quan tâm sức khỏe con, ý chí mạnh, cương quyết.","Bạn có xu hướng được cha mẹ quan tâm sát sao. Chia sẻ với cha mẹ về mong muốn tự lập sẽ giúp hai bên hiểu nhau.","trung"]],
"phi|Phụ Mẫu|Kỵ|Phúc Đức":[["Huy Hà Phan; Lai Nhân; Trung Châu; Lương Nhược Du","Kỵ phi từ Phụ Mẫu nhập Phúc Đức (Thuận thủy Kỵ): cha mẹ dễ bất đồng, ít thành tựu, tiền bạc hụt dần, vướng rắc rối giấy tờ.","Bạn có xu hướng phải chú ý giấy tờ, thủ tục nhiều hơn người khác. Kiểm tra kỹ và lưu trữ cẩn thận sẽ giúp bạn tránh phiền phức.","hung"]],
"mchat|Phụ Mẫu|chat":[["Trịnh Mục Đức","Phụ Mẫu có M chất: nhiều quý nhân, phúc báo tổ tiên; đương số sẽ chăm sóc cha mẹ; rèn kỹ năng thì có quý nhân.","Bạn thuộc mẫu người có nhiều người đi trước giúp đỡ. Không ngừng rèn kỹ năng sẽ giúp bạn xứng đáng với sự giúp đỡ đó.","cat"]],
"mchat|Phụ Mẫu|Điền Trạch":[["Trịnh Mục Đức","Phụ Mẫu có M Điền: có nhà đất từ cha mẹ.","Bạn có xu hướng được cha mẹ hỗ trợ về nơi ở. Giữ gìn và phát triển tài sản đó là cách đáp ơn.","cat"]],
"mchat|Phụ Mẫu|Nô Bộc":[["Trịnh Mục Đức","M Nô có ở Phụ Mẫu: bạn bè là quý nhân; sự nghiệp nương vào bạn bè.","Bạn có xu hướng được bạn bè nâng đỡ. Đối xử chân thành sẽ giữ được những người bạn quý.","cat"]],
"mchat|Phụ Mẫu|Quan Lộc":[["Trịnh Mục Đức","Phụ Mẫu có M Quan: có cấp trên hoặc ông chủ nâng đỡ, nền tảng sự nghiệp từ gia đình.","Bạn có xu hướng được cấp trên tin tưởng. Làm việc tận tâm sẽ giúp bạn nhanh được giao việc lớn.","cat"]],
"sao|Tử Vi|Phụ Mẫu":[["","Thiên Tướng, Tử Vi miếu vượng ở Phụ Mẫu: cha mẹ mạnh khỏe, có phúc, bao bọc con; có Không Kiếp, Kình Đà thì dễ khắc cha mẹ; sát tinh hội nặng thì một số sách khuyên nên làm con nuôi.","Bạn có xu hướng có cha mẹ là chỗ dựa vững chắc. Thường xuyên quan tâm, thăm hỏi cha mẹ sẽ giữ trọn tình thân.","cat"]],
"sao|Hỏa Tinh|Phụ Mẫu":[["Phi tinh Trần Đoàn","Hỏa Tinh đứng một mình tại Phụ Mẫu: sớm xa cha mẹ; có cát tinh thì bình hòa. Âm Sát tại Phụ Mẫu: hay vọng tưởng về nguồn gốc bản thân.","Bạn có xu hướng sớm phải tự lập. Chủ động giữ liên lạc với gia đình sẽ giúp bạn luôn có điểm tựa tinh thần.","trung"]],
"canCung|Huynh Đệ|Mậu":[["","Huynh Đệ can Mậu: anh em hoặc mẹ cố chấp, vất vả; đương số dễ gặp tiểu nhân.","Bạn có xu hướng có người thân tính cố chấp. Kiên nhẫn và tránh tranh cãi gay gắt sẽ giữ hòa khí trong nhà.","trung"]],
"tuHoa|Huynh Đệ|Lộc":[["","Huynh Đệ tự hóa Lộc: dễ được lòng người, hay giúp bạn về tiền mà thiếu tính toán; anh em giỏi giang, khéo léo; dễ hao tài vì xã giao. Xét đại vận thì được coi là kiểu Khai quán nhân có thành tựu.","Bạn thuộc mẫu người hào phóng với anh em, bạn bè. Lập kế hoạch tài chính rõ ràng sẽ giúp lòng tốt không làm hao hụt túi tiền.","trung"]],
"phi|Huynh Đệ|Kỵ|Mệnh":[["","Kỵ phi từ Huynh Đệ nhập Mệnh: phải lo cho anh em, gánh nặng kinh tế; hợp đi làm công, làm dịch vụ; đời lắm sóng gió, khó gom tiền.","Bạn có xu hướng gánh vác phần lớn trách nhiệm cho anh chị em. Đặt giới hạn hỗ trợ rõ ràng sẽ giúp bạn vừa giúp được người vừa giữ được mình.","trung"]],
"phi|Huynh Đệ|Quyền|Phu Thê":[["","Quyền phi từ Huynh Đệ nhập Phu Thê: anh em có sức lập nghiệp; có thể xen vào hôn nhân; chị em dâu dễ không hòa.","Bạn có xu hướng có anh chị em hay góp ý chuyện gia đình riêng. Giữ ranh giới nhẹ nhàng sẽ giữ được cả tình thân lẫn sự riêng tư.","trung"]],
"phi|Huynh Đệ|Khoa|Điền Trạch":[["","Khoa phi từ Huynh Đệ nhập Điền Trạch: anh em chăm lo việc nhà, tiêu pha hợp lý, làm công chức hay nhân viên văn phòng; cuộc sống vững vàng.","Bạn có xu hướng có anh chị em chu đáo với gia đình. Cùng nhau chăm lo cha mẹ sẽ khiến gia đình thêm gắn bó.","cat"]],
"phi|Huynh Đệ|Lộc|Quan Lộc":[["Nhiều tác giả","Huynh Đệ phi Lộc nhập Quan Lộc: sự nghiệp thuận, vốn sung túc, anh em và mẹ chủ động trợ giúp, có thể cộng tác với anh em; anh em được cấp trên khen.","Bạn có xu hướng được người thân hỗ trợ trong sự nghiệp. Hợp tác với gia đình nên có phân công rõ ràng để giữ tình cảm.","cat"]],
"phi|Huynh Đệ|Quyền|Điền Trạch":[["Nhiều tác giả","Huynh Đệ phi Quyền nhập Điền Trạch: anh em nắm quyền trong nhà, dễ tranh chấp khi chia gia sản; đương số giỏi kinh doanh, tiền càng chảy càng nhiều, có thể làm nhà đất; anh em hay can thiệp việc nhà.","Bạn có xu hướng có anh chị em mạnh mẽ, hay tham gia việc nhà. Phân chia tài sản minh bạch từ sớm sẽ giữ được hòa khí.","trung"]],
"phi|Huynh Đệ|Khoa|Nô Bộc":[["Nhiều tác giả","Huynh Đệ phi Khoa nhập Nô Bộc: quan hệ lễ nghĩa, giao dịch tiền có lý trí, thu chi cân bằng, thu nhập ổn định; anh em có tài, có danh, hợp văn giáo; mặt trái là dễ cô đơn, kiêu, thiếu quyết đoán.","Bạn thuộc mẫu người cư xử đúng mực và chi tiêu cân đối. Mạnh dạn hơn trong quyết định sẽ giúp bạn nắm bắt cơ hội.","cat"]],
"phi|Huynh Đệ|Kỵ|Tật Ách":[["Nhiều tác giả","Huynh Đệ phi Kỵ nhập Tật Ách (Thuận thủy Kỵ, xung Phụ Mẫu): chăm lo anh em vất vả hoặc bị ỷ lại; cố chấp, bảo thủ; kiếm tiền vất vả, tốn chi phí sức khỏe.","Bạn có xu hướng ôm việc của người thân vào mình. Khuyến khích anh chị em tự lập và giữ sức khỏe cho mình là điều cần thiết.","hung"]],
"phi|Huynh Đệ|Lộc|Thiên Di":[["Huy Hà Phan; Lai Nhân; Trung Châu; Lương Nhược Du","Lộc phi từ Huynh Đệ nhập Thiên Di: anh em giỏi giao thiệp xã hội, hỗ trợ từ bên ngoài, sự nghiệp suôn sẻ, kinh tế dư dật.","Bạn có xu hướng được anh chị em mở đường ra bên ngoài. Trân trọng và hỗ trợ lại họ sẽ giúp cả nhà cùng tiến.","cat"]],
"phi|Huynh Đệ|Quyền|Quan Lộc":[["Huy Hà Phan; Lai Nhân; Trung Châu; Lương Nhược Du","Quyền phi từ Huynh Đệ nhập Quan Lộc: anh em làm nên việc, hùn hạp có lợi; có điều nếu quản quá chặt thì sinh áp lực.","Bạn có xu hướng hợp tác hiệu quả với người thân. Tôn trọng vai trò của mỗi người sẽ giúp hợp tác lâu dài.","cat"]],
"phi|Huynh Đệ|Khoa|Tật Ách":[["Huy Hà Phan; Lai Nhân; Trung Châu; Lương Nhược Du","Huynh Đệ phi Khoa nhập Tật Ách: anh em lịch sự, quan tâm sức khỏe nhau, đôi khi khách sáo.","Bạn có xu hướng có anh chị em biết quan tâm nhau. Bớt khách sáo, chia sẻ thật lòng sẽ khiến tình thân thêm gần.","cat"]],
"phi|Huynh Đệ|Kỵ|Tài Bạch":[["Huy Hà Phan; Lai Nhân; Trung Châu; Lương Nhược Du","Kỵ phi từ Huynh Đệ nhập Tài Bạch (Thuận thủy Kỵ): anh em dễ làm hao tiền, cho vay mượn dễ chịu thiệt, khó gom góp.","Bạn có xu hướng mềm lòng khi anh chị em cần tiền. Giúp trong khả năng và có thỏa thuận rõ ràng sẽ giữ được cả tiền lẫn tình.","hung"]],
"mchat|Huynh Đệ|chat":[["Trịnh Mục Đức","Huynh Đệ có M chất / M Quan / M Điền / M Nô / M Tật: anh em có thành tựu, có nhà đất, dựa vào bạn bè; anh em vất vả nhưng cũng là quý nhân của mình.","Bạn có xu hướng có anh chị em là nguồn hỗ trợ đáng quý. Giữ gìn tình thân sẽ là tài sản lớn suốt đời.","cat"]],
"sao|Đà La|Huynh Đệ":[["Trần Bỉnh Húc","Các sao ở Huynh Đệ: có Đà La thì anh em ít khăng khít hoặc anh em phụ mình; Tham Lang miếu vượng thì có anh em mà không hòa; Không Kiếp thì duyên mỏng, có thể gặp thất bại lớn về tiền; Tả Hữu thì êm thấm, đỡ đần lẫn nhau; Khoa thì hòa thuận, Quyền thì trong anh em có quý nhân; Lộc thì anh em giàu có, Kỵ thì bị liên lụy.","Bạn có xu hướng có mối quan hệ anh em nhiều cung bậc. Giữ sự rõ ràng về tiền bạc và bao dung trong tình cảm sẽ giữ được hòa khí.","trung"]],
"canCung|Nô Bộc|Nhâm":[["","Nô Bộc can Nhâm: bạn bè hoặc đối thủ cao ngạo, khó lường, hay lấn lướt.","Bạn có xu hướng gặp người cạnh tranh mạnh mẽ. Giữ bình tĩnh và chuẩn bị kỹ sẽ giúp bạn không bị lấn át.","trung"]],
"snToa|Kỵ|Nô Bộc":[["Nhiều tác giả","Hóa Kỵ năm sinh tọa Nô Bộc: mắc nợ ân tình với bạn bè, khó được giúp, dễ liên lụy; trọng nghĩa khinh tài; không nên hợp tác tiền bạc; khó có tri kỷ; là bài học về trách nhiệm, cần tích đức. Ở Dần Thân Tị Hợi thành Tứ mã Kỵ.","Bạn thuộc mẫu người trọng tình bạn và hay chịu thiệt vì bạn. Giữ tình bạn trong sáng, không dính tiền bạc sẽ giúp bạn nhẹ lòng.","trung"],["","Theo cách nhìn khác: bạn bè là quý nhân, kể cả người bán rẻ mình cũng là bài học giúp mình trưởng thành.","Bạn có xu hướng học được nhiều nhất từ các mối quan hệ khó. Nhìn mỗi trải nghiệm như một bài học sẽ giúp bạn mạnh mẽ hơn.","trung"],["","Sao mang Kỵ: Cự Môn thì nhiều lời, tranh đúng sai với bạn; Thái Dương thì dễ gây thù, khó hòa với bạn nam, không hợp việc phục vụ công chúng.","Bạn có xu hướng thẳng tính trong tình bạn. Nhường nhịn chuyện nhỏ sẽ giữ được những người bạn quý.","hung"]],
"snToa|Quyền|Nô Bộc":[["Nhiều tác giả","Hóa Quyền năm sinh tọa Nô Bộc: bạn bè có năng lực, có địa vị, thành đạt; dễ tranh cãi, cần chọn bạn kỹ; Cự Môn Quyền thì nhiều thị phi nhưng vẫn có bạn cùng làm; Thiên Đồng Quyền thì giao tiếp vui vẻ.","Bạn có xu hướng quen biết những người giỏi giang. Học hỏi từ họ và tránh tranh hơn thua sẽ giúp bạn tiến bộ.","cat"]],
"tuHoa|Nô Bộc|Lộc":[["","Nô Bộc tự hóa Lộc: có bạn tri kỷ, hay cho mượn mà không đòi; quen biết rộng nhưng thiếu sàng lọc, dễ bị lợi dụng; bạn bè có tiền, có địa vị.","Bạn thuộc mẫu người rộng lượng với bạn bè. Chọn lọc bạn và cẩn trọng khi cho mượn tiền sẽ giúp bạn không bị lợi dụng.","trung"]],
"phi|Nô Bộc|Quyền|Tật Ách":[["Nhiều tác giả","Nô Bộc phi Quyền nhập Tật Ách: bạn chủ động, mạnh mẽ, dễ tranh cãi, đeo bám hoặc làm phiền; cũng có người chủ động giúp mình.","Bạn có xu hướng có những người bạn nhiệt tình đến mức áp đặt. Giữ khoảng cách vừa phải sẽ giúp tình bạn thoải mái hơn.","trung"]],
"phi|Nô Bộc|Khoa|Tử Tức":[["","Khoa phi từ Nô Bộc nhập Tử Tức: bạn bè giúp đỡ con cái, con gặp được thầy hay; bạn quan tâm tới gia đình; cuộc sống êm đềm.","Bạn có xu hướng có bạn bè quan tâm cả gia đình mình. Kết nối gia đình với những người bạn tốt sẽ mang lại nhiều điều hay.","cat"]],
"phi|Nô Bộc|Kỵ|Phu Thê":[["","Kỵ phi từ Nô Bộc nhập Phu Thê: bạn bè gây mâu thuẫn, hôn nhân nhạt nhẽo, người thứ ba chen vào; bạn cản đường sự nghiệp; tránh ghen quá mức.","Bạn có xu hướng để bạn bè ảnh hưởng đến chuyện gia đình riêng. Giữ chuyện vợ chồng trong nhà và tin tưởng nhau sẽ giúp hôn nhân yên ổn.","hung"]],
"phi|Nô Bộc|Lộc|Tật Ách":[["Nhiều tác giả","Nô Bộc phi Lộc nhập Tật Ách: bạn bè gần gũi, chiếu cố, hay mời; nhân duyên tốt, duyên khác giới; hợp ẩm thực, giải trí, thời trang, cà phê; có lợi làm giàu nhưng dễ thụ động; ở đại vận là 'quang minh'.","Bạn thuộc mẫu người dễ gần và được bạn bè quý. Giữ chừng mực trong các mối quan hệ khác giới và chủ động hơn trong công việc sẽ trọn vẹn.","cat"]],
"phi|Nô Bộc|Quyền|Tài Bạch":[["Nhiều tác giả","Quyền phi từ Nô Bộc nhập Tài Bạch: bạn bè giúp làm ra tiền, hợp kinh doanh hàng giá trị cao, buôn sỉ; nhưng bạn cũng cạnh tranh, có thể đấu đá, rủ rê bỏ vốn hoặc gạt tiền; nếu cách cục tốt thì có bạn giúp, kém thì phải đề phòng kẻ gian.","Bạn có xu hướng kiếm tiền qua bạn bè nhưng cũng gặp cạnh tranh. Tìm hiểu kỹ trước mọi lời mời đầu tư sẽ giúp bạn an toàn.","trung"]],
"phi|Nô Bộc|Khoa|Điền Trạch":[["Nhiều tác giả","Nô Bộc phi Khoa nhập Điền Trạch: bạn hoặc khách hàng mang lợi đều đặn; bạn có khí chất văn nhã, đến nhà làm khách, quan tâm gia đình, bày mưu việc nhà đất; gia vận tốt, gặp khó có quý nhân; thích hợp tác.","Bạn có xu hướng có những người bạn tử tế, gắn bó với cả gia đình. Mở cửa nhà đón bạn tốt sẽ mang lại nhiều điều may.","cat"]],
"phi|Nô Bộc|Kỵ|Quan Lộc":[["Nhiều tác giả","Nô Bộc phi Kỵ nhập Quan Lộc (Thuận thủy Kỵ, xung Phu Thê): cấp dưới lười, bạn lợi dụng gây khó; sự nghiệp không được giúp, tiểu nhân, đối thủ, khó thi cử thăng tiến; hôn nhân dễ biến động.","Bạn có xu hướng gặp cạnh tranh và người không thiện chí trong công việc. Làm việc minh bạch, lưu giữ bằng chứng và tự nâng năng lực sẽ giúp bạn đứng vững.","hung"],["","Cách đọc khác: bạn bè che chở, dễ kết bạn trọng sự nghiệp.","Bạn có xu hướng kết bạn qua công việc. Chọn bạn cùng chí hướng sẽ giúp sự nghiệp thuận lợi.","trung"]],
"phi|Nô Bộc|Lộc|Tử Tức":[["Huy Hà Phan; Lai Nhân; Trung Châu; Lương Nhược Du","Lộc phi từ Nô Bộc nhập Tử Tức: bạn bè thân thiện, dễ gần gũi trẻ con, có duyên với người khác giới, có thể giúp làm ra tiền.","Bạn có xu hướng được bạn bè giúp đỡ trong làm ăn. Giữ chừng mực trong các mối quan hệ sẽ giữ được sự êm ấm.","cat"]],
"phi|Nô Bộc|Khoa|Phu Thê":[["Huy Hà Phan; Lai Nhân; Trung Châu; Lương Nhược Du","Khoa phi từ Nô Bộc nhập Phu Thê: tình cảm êm dịu, lãng mạn; bạn bè nâng đỡ sự nghiệp; bạn đời có thể do bạn bè mai mối.","Bạn có xu hướng gặp duyên lành qua bạn bè. Giữ những tình bạn tốt sẽ mang lại nhiều điều đẹp.","cat"]],
"phi|Nô Bộc|Kỵ|Điền Trạch":[["Huy Hà Phan; Lai Nhân; Trung Châu; Lương Nhược Du","Kỵ phi từ Nô Bộc nhập Điền Trạch (Thuận thủy Kỵ): tiểu nhân lấn vào, hao tổn tài sản, mua bán dễ chịu thiệt.","Bạn có xu hướng cần cẩn trọng khi để người ngoài can dự vào tài sản gia đình. Giữ giấy tờ chặt chẽ sẽ giúp bạn an toàn.","hung"]],
"mchat|Nô Bộc|chat":[["Trịnh Mục Đức","M chất có ở Nô Bộc: thành công nhờ bạn bè và quý nhân; nên vun đắp người của mình; ra nước ngoài mới gặp thời.","Bạn thuộc mẫu người thành công nhờ người khác. Đầu tư vào việc nuôi dưỡng các mối quan hệ là chiến lược đúng của bạn.","cat"]],
"mchat|Nô Bộc|Tài Bạch":[["Trịnh Mục Đức","Nô Bộc có M Tài / M Quan / M Điền / M Tật: kiếm tiền nhờ bạn, hợp dịch vụ; hàng xóm là bạn, mua nhà nhờ bạn giới thiệu; bạn bè hay tìm đến mình.","Bạn có xu hướng có nhiều cơ hội đến từ bạn bè, hàng xóm. Giữ uy tín trong cộng đồng là cách giữ nguồn cơ hội đó.","cat"]],
"sao|Cự Môn|Nô Bộc":[["Hà Lạc; Trần Đoàn; Trần Bỉnh Húc; Sở Hoàng","Cự Môn tại Nô Bộc: tính bài xích, duyên bạc với người thân, bạn bè thị phi; có thuộc hạ đắc lực nhưng có tranh chấp; nhập miếu thì cấp dưới dần tốt; nếu Cự hành kỵ thần dù cung khí tốt vẫn gặp rắc rối.","Bạn có xu hướng gặp nhiều ý kiến trái chiều trong các mối quan hệ. Lắng nghe trước khi phản bác sẽ giúp bạn giữ được người giỏi bên mình.","trung"]],
"sao|Thái Dương|Nô Bộc":[["","Thái Dương tại Nô Bộc: hào sảng, giúp người nhiều nhưng tri kỷ ít, dễ bị hiểu lầm; nhiều thuộc hạ có năng lực, cung khí tốt và Thái Dương hỉ thần thì rất vượng.","Bạn thuộc mẫu người hào sảng và hay giúp đỡ. Chọn vài người bạn tri kỷ để chia sẻ sẽ giúp bạn không cô đơn giữa đám đông.","cat"]],
"sao|Thiên Đồng|Nô Bộc":[["Phi tinh Trần Đoàn; Đẩu số cung vị; Sở Hoàng","Thiên Đồng ở Nô Bộc: miếu vượng thì người dưới đắc lực, gặp sát thì dễ trở mặt; Kình Dương miếu thì về già mới có người đỡ, nếu hãm thì dễ phản chủ; Tả Phù, Liêm Trinh miếu vượng thì có nhiều bạn trợ giúp, hãm địa dễ bị phản bội.","Bạn có xu hướng có cấp dưới, cộng sự tốt nếu chọn đúng người. Đánh giá kỹ trước khi giao việc quan trọng sẽ giúp bạn yên tâm.","trung"]],
"dv|nhap|Lộc|Mệnh":[["Trung Châu","Hóa Lộc ĐV (từ ĐV Mệnh) nhập Mệnh nguyên cục: Hồi quy Lộc, mười năm có cơ hội đến tận tay, rất cát; nếu đồng thời Kỵ xung ngã cung thì Lộc không thực.","Bạn có xu hướng gặp nhiều cơ hội tự tìm đến trong giai đoạn mười năm này. Nắm lấy cơ hội nhưng giữ sự tỉnh táo sẽ giúp thành quả bền vững.","cat"]],
"dv|nhap|Lộc|Huynh Đệ":[["Trung Châu","Lộc ĐV nhập tuyến Huynh–Nô (Huynh Đệ): thành tựu, tiêu xài, trợ lực, tình cảm; biến động với anh em, bạn thân, mẹ; là Lộc nhập tha cung nên lợi đi ra ngoài trước.","Bạn có xu hướng trong giai đoạn này đầu tư nhiều cho anh em, bạn thân và nhận lại sự hỗ trợ. Hợp tác có thỏa thuận rõ sẽ giúp đôi bên cùng lợi.","cat"]],
"dv|nhap|Lộc|Phu Thê":[["Trung Châu","Lộc ĐV nhập tuyến Phu–Quan (Phu Thê): tình cảm, hôn nhân thuận, người phối ngẫu mang lại lợi; Lộc nhập tha cung.","Bạn có xu hướng có chuyện tình cảm, hôn nhân thuận hòa trong giai đoạn này. Dành thời gian vun đắp sẽ nhân lên niềm vui đó.","cat"]],
"dv|nhap|Lộc|Tử Tức":[["Trung Châu","Lộc ĐV nhập tuyến Tử–Điền (Tử Tức): đào hoa, giải trí, hợp tác, con cái mang niềm vui; Lộc nhập tha cung nên dễ chi ra ngoài; nếu đối cung có Lộc thì thành Điệp xuất hoặc 'Thị phi Lộc'.","Bạn có xu hướng có nhiều niềm vui, giao lưu và chi tiêu cho giải trí, con cái. Giữ chừng mực sẽ giúp niềm vui không thành hao tốn.","trung"]],
"dv|nhap|Lộc|Tài Bạch":[["Trung Châu","Lộc ĐV nhập Tài Bạch nguyên cục: Hồi quy tam hợp, tiền bạc, kinh doanh thuận, càng nhiều Lộc hồi quy càng cát.","Bạn có xu hướng có thu nhập khởi sắc trong giai đoạn này. Tích lũy đều đặn sẽ biến thời điểm thuận thành nền tảng lâu dài.","cat"]],
"dv|nhap|Lộc|Tật Ách":[["Trung Châu","Lộc ĐV nhập tuyến Phụ–Tật (Tật Ách): thân thể thoải mái, có 'quang minh', hưởng thụ; dễ lười.","Bạn có xu hướng có sức khỏe và tinh thần thoải mái trong giai đoạn này. Duy trì nếp sống lành mạnh sẽ giữ được sự dễ chịu đó.","cat"]],
"dv|nhap|Lộc|Thiên Di":[["Trung Châu","Lộc ĐV nhập Thiên Di: cơ hội ở ngoài, đi xa thuận; Lộc nhập tha cung nên lợi đến từ bên ngoài nhưng dễ cho đi.","Bạn có xu hướng gặp may khi đi xa và mở rộng quan hệ. Chủ động ra ngoài sẽ mang về nhiều cơ hội.","cat"]],
"dv|nhap|Lộc|Nô Bộc":[["Trung Châu; Từ Tăng Sinh","Lộc ĐV nhập tuyến Huynh–Nô (Nô Bộc): thành tựu nhờ bạn bè, đồng sự; nhưng nếu Kỵ lại xung ngã cung thì 'giúp người, lúc khó họ mới tìm'; lợi bị đẩy cho người khác, nên biết đủ.","Bạn có xu hướng giúp đỡ bạn bè nhiều trong giai đoạn này. Giúp trong khả năng và giữ phần cho mình sẽ khiến lòng tốt không thành thiệt thòi.","trung"]],
"dv|nhap|Lộc|Quan Lộc":[["Trung Châu","Lộc ĐV (ĐV Mệnh) nhập Quan Lộc nguyên cục: Hồi quy tam hợp, sự nghiệp thuận, có thể là Phản cung Lộc (lợi gấp đôi); thành bại do chính mình.","Bạn có xu hướng gặp thời điểm thuận cho sự nghiệp. Chủ động nhận việc lớn và học thêm sẽ giúp bạn bứt phá.","cat"]],
"dv|nhap|Lộc|Điền Trạch":[["Trung Châu","Lộc ĐV nhập tuyến Tử–Điền (Điền Trạch): kho tiền, gia sản, nhà cửa thuận; thời điểm tốt để an cư.","Bạn có xu hướng có điều kiện tốt cho chuyện nhà cửa, tài sản trong giai đoạn này. Đây là lúc thích hợp để tích lũy và an cư.","cat"]],
"dv|nhap|Lộc|Phúc Đức":[["Trung Châu","Lộc ĐV nhập Phúc Đức: tinh thần, hưởng thụ, quý nhân thuận; nếu đối cung Tài Bạch thì Lộc chiếu tài.","Bạn có xu hướng thấy lòng an vui và được người tốt giúp trong giai đoạn này. Dành thời gian cho sở thích sẽ nạp thêm năng lượng.","cat"]],
"dv|nhap|Lộc|Phụ Mẫu":[["Trung Châu","Lộc ĐV nhập tuyến Phụ–Tật (Phụ Mẫu): cha mẹ, cấp trên, giấy tờ thuận, có 'quang minh'; lợi thi cử.","Bạn có xu hướng được người đi trước nâng đỡ trong giai đoạn này. Đây là lúc tốt cho học hành, thi cử, thủ tục giấy tờ.","cat"]],
"dv|nhap|Kỵ|Mệnh":[["Trung Châu","Kỵ ĐV nhập Mệnh nguyên cục: vào ngã cung nên 'có thể thuận' – trách nhiệm dồn về mình; nếu Lộc ĐV đi tha cung thì 'trước khổ sau sướng'; trùng Lộc năm sinh thì thành Song Kỵ, hao tổn.","Bạn có xu hướng gánh nhiều trách nhiệm hơn trong giai đoạn này. Giữ sức và làm từng việc chắc chắn, thành quả sẽ đến sau.","trung"]],
"dv|nhap|Kỵ|Huynh Đệ":[["Trung Châu","Kỵ ĐV nhập tuyến Huynh–Nô (Huynh Đệ): biến động với anh em, bạn thân, hợp tác; tránh vay mượn, thế chấp; 'không có thành tựu' trên tuyến đó.","Bạn có xu hướng gặp chuyện cần giải quyết với anh em, bạn thân trong giai đoạn này. Tránh vay mượn và góp vốn chung sẽ giữ được hòa khí.","hung"]],
"dv|nhap|Kỵ|Phu Thê":[["Trung Châu","Kỵ ĐV nhập tuyến Phu–Quan (Phu Thê): xung Quan Lộc, tổn thất hôn nhân và sự nghiệp; trùng Kỵ năm sinh thành Song Kỵ, rất hung; đi xa phát sinh vấn đề.","Bạn có xu hướng gặp áp lực trong chuyện tình cảm và công việc trong giai đoạn này. Trò chuyện cởi mở với người bạn đời và không mở rộng quá sức sẽ giúp bạn vượt qua.","hung"]],
"dv|nhap|Kỵ|Tử Tức":[["Trung Châu","Kỵ ĐV nhập tuyến Tử–Điền (Tử Tức): xung Điền Trạch; có việc bất ngờ lớn liên quan con cái, hợp tác, gia sản.","Bạn có xu hướng cần quan tâm nhiều hơn đến con cái và các khoản hợp tác trong giai đoạn này. Thận trọng khi góp vốn và dành thời gian cho gia đình là điều nên làm.","hung"]],
"dv|nhap|Kỵ|Tài Bạch":[["Trung Châu","Kỵ ĐV nhập Tài Bạch nguyên cục: vào ngã cung, cohoc đọc 'có phần thuận' – chuyên tâm kiếm tiền, giữ tiền; nhưng nếu xung Phúc thì vất vả.","Bạn có xu hướng dồn tâm sức vào chuyện tiền bạc trong giai đoạn này. Kế hoạch chi tiêu chặt chẽ sẽ giúp bạn tích lũy được.","trung"]],
"dv|nhap|Kỵ|Tật Ách":[["Trung Châu","Kỵ ĐV nhập tuyến Phụ–Tật (Tật Ách): mất 'quang minh', lao lực, cần giữ sức; xung Phụ Mẫu ảnh hưởng giấy tờ, cha mẹ.","Bạn có xu hướng mệt mỏi hơn trong giai đoạn này. Ưu tiên nghỉ ngơi, khám định kỳ và giảm bớt việc không cần thiết.","hung"]],
"dv|nhap|Kỵ|Thiên Di":[["Trung Châu","Kỵ ĐV nhập Thiên Di: tự xung Mệnh, ra ngoài nhiều trở ngại, đi xa phát sinh vấn đề.","Bạn có xu hướng gặp trục trặc khi đi xa hoặc làm việc bên ngoài trong giai đoạn này. Chuẩn bị kỹ và ưu tiên những việc gần, chắc chắn.","hung"]],
"dv|nhap|Kỵ|Nô Bộc":[["Trung Châu; Từ Tăng Sinh","Kỵ ĐV nhập tuyến Huynh–Nô (Nô Bộc): tiền bạc qua lại với bạn dễ mất, dễ đổ vỡ quan hệ; nếu tự hóa Lộc ở đó thì thành Song Kỵ; tránh cho vay.","Bạn có xu hướng gặp rắc rối khi dính tiền bạc với bạn bè trong giai đoạn này. Tránh cho vay, đứng tên giúp và giữ tình bạn tách khỏi chuyện tiền.","hung"]],
"dv|nhap|Kỵ|Quan Lộc":[["Trung Châu","Kỵ ĐV nhập Quan Lộc nguyên cục: ngã cung nên có lúc được đọc 'có phần thuận' (chuyên tâm sự nghiệp); nhưng xung Phu Thê, vất vả, dễ là Củ triền Kỵ nếu Phu Thê cũng bị Kỵ.","Bạn có xu hướng tập trung cao độ vào công việc trong giai đoạn này. Giữ thời gian cho gia đình sẽ giúp bạn không phải đánh đổi.","trung"]],
"dv|nhap|Kỵ|Điền Trạch":[["Trung Châu","Kỵ ĐV nhập Điền Trạch nguyên cục: ngã cung, có thể thuận về giữ của; nhưng xung Tử Tức, cần phòng việc liên quan con cái, hợp tác.","Bạn có xu hướng tập trung lo cho gia đình, nhà cửa trong giai đoạn này. Chi tiêu cẩn thận và quan tâm con cái sẽ giữ được sự yên ổn.","trung"]],
"dv|nhap|Kỵ|Phúc Đức":[["Trung Châu","Kỵ ĐV nhập Phúc Đức: lo nghĩ, tinh thần nặng nề, xung Tài Bạch nên tiêu tiền theo cảm xúc.","Bạn có xu hướng lo nghĩ nhiều hơn trong giai đoạn này. Tìm cách thư giãn và tránh quyết định tài chính khi tâm trạng không tốt.","hung"]],
"dv|nhap|Kỵ|Phụ Mẫu":[["Trung Châu","Kỵ ĐV nhập tuyến Phụ–Tật (Phụ Mẫu): hôn nhân hoặc việc nhà bị ảnh hưởng từ phía cha mẹ; giấy tờ, cấp trên trục trặc; xung Tật Ách cần giữ sức.","Bạn có xu hướng cần chú ý nhiều đến cha mẹ, giấy tờ và quan hệ với cấp trên trong giai đoạn này. Kiểm tra kỹ thủ tục và quan tâm sức khỏe gia đình là điều nên làm.","hung"]],
"dv|nhap|Quyền|*":[["Trung Châu","Hóa Quyền ĐV nhập một cung: chủ đề cung đó được đẩy mạnh, có chủ động, nắm quyền; nhập ngã cung thì cát rõ, nhập tha cung là Quyền xuất – thường trống rỗng, cộng hưởng yếu.","Bạn có xu hướng chủ động và quyết liệt hơn ở mảng này trong giai đoạn này. Dùng sự quyết đoán đúng chỗ sẽ mang lại kết quả.","cat"]],
"dv|nhap|Khoa|*":[["Trung Châu","Hóa Khoa ĐV nhập một cung: danh tiếng, quý nhân, sự ổn định cho chủ đề cung đó; nhập tha cung là Khoa xuất, ít thực chất.","Bạn có xu hướng được tiếng tốt và người giúp ở mảng này trong giai đoạn này. Giữ uy tín sẽ khiến sự giúp đỡ đến đều.","cat"]],
"dv|chieu|Lộc|*":[["Từ Tăng Sinh","Lộc Dụng chiếu Thể (ĐV.X phi Lộc chiếu X thiên bàn): cát lợi rất mạnh cho chủ đề X; Lộc Thể chiếu Dụng (X phi Lộc chiếu ĐV.X): cát tượng, cần nghiệm.","Bạn có xu hướng gặp thuận lợi rõ rệt ở mảng này trong giai đoạn này. Hãy chủ động tận dụng vì cơ hội tốt không kéo dài mãi.","cat"]],
"dv|chieu|Lộc|Thiên Di":[["Từ Tăng Sinh","ĐV Thiên Di phi Lộc chiếu Thiên Di thiên bàn: đối ngoại, đi xa, xuất ngoại rất thuận.","Bạn có xu hướng gặp nhiều may mắn khi đi xa, giao tiếp rộng trong giai đoạn này. Đây là lúc tốt để mở rộng phạm vi hoạt động.","cat"]],
"dv|chieu|Lộc|Phu Thê":[["Từ Tăng Sinh","Phu Thê phi Lộc chiếu (Dụng chiếu Thể hoặc Thể chiếu Dụng): hôn nhân, tình cảm cát lợi rất mạnh.","Bạn có xu hướng có chuyện tình cảm rất thuận trong giai đoạn này. Vun đắp và trân trọng sẽ giữ được niềm vui đó.","cat"]],
"dv|chieu|Lộc|Tử Tức":[["Từ Tăng Sinh","Tử Tức phi Lộc chiếu: con cái và sinh hoạt gia đình thuận lợi.","Bạn có xu hướng có nhiều niềm vui bên con trẻ và gia đình trong giai đoạn này. Dành thời gian cho nhau sẽ là kỷ niệm đẹp.","cat"]],
"dv|chieu|Lộc|Mệnh":[["Từ Tăng Sinh","ĐV Mệnh phi Lộc chiếu Mệnh thiên bàn: cát lợi rất mạnh cho bản thân.","Bạn có xu hướng ở trong một giai đoạn rất thuận cho chính mình. Hãy đặt mục tiêu lớn và theo đuổi nó.","cat"]],
"dv|chieu|Lộc|Huynh Đệ":[["Từ Tăng Sinh","ĐV Huynh Đệ phi Lộc chiếu Huynh Đệ thiên bàn: cát lợi rất mạnh cho anh em, bạn thân, hợp tác.","Bạn có xu hướng được anh em, bạn thân hỗ trợ nhiều trong giai đoạn này. Đây là lúc tốt để cùng nhau làm việc lớn.","cat"]],
"dv|chieu|Lộc|Điền Trạch":[["Từ Tăng Sinh","Điền Trạch phi Lộc chiếu: gia sản, nhà cửa cát lợi rất mạnh.","Bạn có xu hướng có cơ hội tốt về nhà cửa, tài sản trong giai đoạn này. Cân nhắc an cư hoặc đầu tư dài hạn.","cat"]],
"dv|chieu|Lộc|Quan Lộc":[["Từ Tăng Sinh","Quan Lộc phi Lộc chiếu: sự nghiệp cát lợi rất mạnh.","Bạn có xu hướng có bước tiến rõ trong công việc giai đoạn này. Mạnh dạn nhận trách nhiệm lớn hơn.","cat"]],
"dv|chieu|Lộc|Phúc Đức":[["Từ Tăng Sinh","Phúc Đức phi Lộc chiếu: tinh thần, hưởng thụ, quý nhân cát lợi mạnh.","Bạn có xu hướng có tâm trạng an vui và gặp người tốt giúp đỡ. Hãy chia sẻ niềm vui đó với người xung quanh.","cat"]],
"dv|chieu|Lộc|Tài Bạch":[["Từ Tăng Sinh","Tài Bạch phi Lộc chiếu: tiền bạc cát lợi mạnh.","Bạn có xu hướng có thu nhập tốt lên trong giai đoạn này. Để dành một phần sẽ giúp bạn vững vàng lâu dài.","cat"]],
"dv|chieu|Lộc|Nô Bộc":[["Từ Tăng Sinh","Nô Bộc phi Lộc chiếu: bạn bè, đồng sự, cấp dưới cát lợi.","Bạn có xu hướng được bạn bè, đồng nghiệp giúp sức nhiều. Ghi nhận và đáp lại sẽ giữ được sự hỗ trợ đó.","cat"]],
"dv|chieu|Quyền|*":[["Từ Tăng Sinh","Quyền Dụng chiếu Thể / Quyền Thể chiếu Dụng: cát tượng cho chủ đề cung, cần nghiệm lý.","Bạn có xu hướng có thêm sức mạnh và tiếng nói ở mảng này. Dùng nó một cách ôn hòa sẽ mang lại kết quả tốt.","cat"]],
"dv|chieu|Khoa|*":[["Từ Tăng Sinh","Khoa Dụng chiếu Thể / Khoa Thể chiếu Dụng: tín hiệu tốt, có quý nhân, danh tiếng; cát tượng cần nghiệm.","Bạn có xu hướng được tiếng tốt và người giúp ở mảng này. Giữ uy tín là cách giữ vận tốt.","cat"]],
"dv|kyXungNc|*":[["Trịnh Mục Đức","Kỵ Dụng xung Thể (ĐV.X phi Kỵ xung X thiên bàn): báo động đỏ, rất xấu cho chủ đề X; ứng năm theo tam điểm của cung Kỵ đến.","Bạn có xu hướng gặp thử thách lớn ở mảng này trong giai đoạn này. Chuẩn bị phương án dự phòng, tránh quyết định mạo hiểm và nhờ người tin cậy góp ý.","hung"]],
"dv|kyXungNc|Tài Bạch":[["Trịnh Mục Đức","ĐV Tài Bạch phi Kỵ xung Tài Bạch thiên bàn: tài chính báo động đỏ, kéo theo biến động công việc và sức khỏe.","Bạn có xu hướng gặp áp lực tài chính trong giai đoạn này. Lập quỹ dự phòng, tránh vay nợ và đầu tư mạo hiểm.","hung"]],
"dv|kyXungNc|Nô Bộc":[["Trịnh Mục Đức","ĐV Nô Bộc phi Kỵ xung Nô Bộc thiên bàn: bạn bè, đồng sự, người hợp tác rất xấu.","Bạn có xu hướng gặp người không đáng tin trong giai đoạn này. Cẩn trọng khi hợp tác và giữ giấy tờ rõ ràng.","hung"]],
"dv|kyXungNc|Phúc Đức":[["Trịnh Mục Đức","Phúc Đức của đại vận phi Kỵ xung Phúc Đức thiên bàn: rất xấu cho tinh thần, sự hưởng thụ, quý nhân và gia nghiệp.","Bạn có xu hướng thấy tinh thần nặng nề trong giai đoạn này. Chăm sóc tâm trí, giữ nếp sinh hoạt và tìm người tâm sự sẽ giúp bạn vững vàng.","hung"]],
"dv|kyXungNc|Huynh Đệ":[["Trịnh Mục Đức","ĐV Huynh Đệ phi Kỵ xung Huynh Đệ: anh em, bạn thân rất xấu.","Bạn có xu hướng có bất đồng với anh em, bạn thân trong giai đoạn này. Nhường nhịn và không dính tiền bạc sẽ giữ được tình thân.","hung"]],
"dv|kyXungNc|Thiên Di":[["Trịnh Mục Đức","ĐV Thiên Di phi Kỵ xung Thiên Di: đối ngoại, đi xa rất xấu.","Bạn có xu hướng gặp trục trặc khi đi xa trong giai đoạn này. Hạn chế những chuyến đi không cần thiết và chuẩn bị kỹ khi phải đi.","hung"]],
"dv|ncXungDv|*":[["Trịnh Mục Đức","Kỵ Thể xung Dụng (cung X nguyên cục phi Kỵ xung ĐV.X): báo động vàng, xấu vừa; ví dụ Điền Trạch: rủi ro gia sản, nhà cửa; Phu Thê: tình cảm; Tài Bạch: tài chính.","Bạn có xu hướng gặp một vài trở ngại ở mảng này trong giai đoạn này. Thận trọng hơn thường lệ là đủ để vượt qua.","hung"]],
"dv|ncNhapDv|Lộc|*":[["Ông Phúc Dụ","Lộc Thể nhập Dụng (cung X nguyên cục phi Lộc nhập ĐV.X): cát cho chủ đề X, cần nghiệm thêm.","Bạn có xu hướng được nền tảng sẵn có hỗ trợ ở mảng này. Biết tận dụng sẽ mang lại kết quả tốt.","cat"]],
"dv|ncNhapDv|Kỵ|*":[["Trịnh Mục Đức","Kỵ Thể nhập Dụng (cung X nguyên cục phi Kỵ nhập ĐV.X): hung cho chủ đề X, báo động vàng, cần khảo sát thêm.","Bạn có xu hướng gặp áp lực ở mảng này trong giai đoạn này. Giữ sự kiên nhẫn và làm từng bước sẽ giúp bạn ổn định.","hung"]],
"dv|quyVi|Lộc|*":[["Ông Phúc Dụ","Quy vị Lộc (ĐV.X phi Lộc nhập X thiên bàn): cát cho chủ đề X; ứng năm có chi của ĐV Mệnh và Mệnh nguyên cục, cộng tam điểm cung nhận.","Bạn có xu hướng thấy mảng này trở lại đúng quỹ đạo và thuận lợi. Đây là lúc tốt để củng cố.","cat"]],
"dv|quyVi|Quyền|*":[["Ông Phúc Dụ","Quy vị Quyền: cát cho chủ đề cung, có chủ động và kiểm soát.","Bạn có xu hướng làm chủ tốt mảng này. Tự tin quyết định sẽ mang lại kết quả.","cat"]],
"dv|quyVi|Khoa|*":[["Ông Phúc Dụ","Quy vị Khoa: cát, có danh, quý nhân, ổn định cho chủ đề cung.","Bạn có xu hướng được người tốt giúp và có tiếng tốt ở mảng này. Giữ uy tín sẽ giữ được vận tốt.","cat"]],
"dv|quyVi|Kỵ|*":[["Trịnh Mục Đức","Quy vị Kỵ (ĐV.X phi Kỵ nhập X thiên bàn): báo động vàngcho chủ đề X; nếu là Song Kỵ quy vị thì có sách đọc là tụ tài.","Bạn có xu hướng phải tập trung giải quyết những việc tồn đọng ở mảng này. Xử lý dứt điểm từng việc sẽ giúp bạn nhẹ nhõm.","hung"]],
"dv|kyNhapMenh|*":[["Trịnh Mục Đức","ĐV.X phi Kỵ nhập Mệnh thiên bàn: 'vô duyên', gần ít xa nhiều, hao tổn, xấu vừa; ứng năm theo tam điểm của Mệnh gốc.","Bạn có xu hướng thấy mảng này đòi hỏi nhiều mà ít đem lại trong giai đoạn này. Giữ kỳ vọng vừa phải và chăm chút điều mình kiểm soát được.","hung"]],
"dv|kyXungMenh|*":[["Trịnh Mục Đức","ĐV.X phi Kỵ xung Mệnh thiên bàn: chủ đề X xấu(ví dụ Tật Ách: sức khỏe; Thiên Di: quan hệ bên ngoài).","Bạn có xu hướng gặp áp lực đáng kể ở mảng này. Chăm sóc bản thân và chuẩn bị kỹ sẽ giảm nhẹ ảnh hưởng.","hung"]],
"dv|catNhapMenh|*":[["Từ Tăng Sinh","ĐV.X phi Lộc/Quyền/Khoa nhập Mệnh thiên bàn: cát lợi cho chủ đề X, cần nghiệm (cohoc ghi 'Quyền Dụng nhập Mệnh' là cát).","Bạn có xu hướng nhận được sự hỗ trợ từ mảng này trong giai đoạn này. Đón nhận và đáp lại sẽ giúp mọi việc thuận hơn.","cat"]],
"dv|hoiQuy|Mệnh":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Hồi quy Lộc về Mệnh gốc (hoặc Lộc từ Tài/Quan ĐV nhập Mệnh gốc – hồi quy tam hợp): rất cát, càng nhiều càng tốt.","Bạn có xu hướng ở trong giai đoạn vận may quay về với chính mình. Đây là lúc tốt để đầu tư cho bản thân.","cat"]],
"dv|hoiQuy|Tài Bạch":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Lộc ĐV hồi quy về Tài Bạch gốc: tiền bạc rất cát.","Bạn có xu hướng có thu nhập khởi sắc. Tích lũy đều sẽ giữ được thành quả.","cat"]],
"dv|hoiQuy|Quan Lộc":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Lộc ĐV hồi quy về Quan Lộc gốc: sự nghiệp rất cát.","Bạn có xu hướng có bước tiến trong sự nghiệp. Chủ động nắm cơ hội thăng tiến.","cat"]],
"dv|phanCung|Lộc":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Phản cung Lộc: tam hợp ĐV trùng tam hợp bản mệnh mà có Lộc nhập → cát lợi gấp đôi.","Bạn có xu hướng gặp một giai đoạn mà mọi nỗ lực được nhân đôi kết quả. Hãy làm những việc quan trọng nhất trong thời gian này.","cat"]],
"dv|phanCung|Kỵ":[["Tiên thiên tứ hóa phi tinh kỳ phổ","Phản cung Kỵ: Kỵ nhập tam hợp bản mệnh theo cách đó → tổn thương ngang Song Kỵ, cần dưỡng sức ba năm trở lên.","Bạn có xu hướng cần sống chậm và giữ sức trong giai đoạn này. Ưu tiên ổn định, tránh mở rộng, mọi việc sẽ qua.","hung"]],
"dv|thaNga|LocTha_KyNga":[["Trung Châu","Lộc ĐV phi nhập tha cung còn Kỵ nhập ngã cung: 'khổ trước sướng sau', bỏ công sức ra ngoài thì về sau được báo đáp.","Bạn có xu hướng phải bỏ công sức trước rồi mới thu hoạch sau. Kiên nhẫn sẽ được đền đáp.","cat"]],
"dv|thaNga|LocNga_KyXungNga":[["Trung Châu","Lộc nhập ngã cung mà Kỵ lại xung ngã cung: Lộc không chắc, dễ mất; có lợi rồi thì chớ mở rộng đầu tư.","Bạn có xu hướng thấy cơ hội đến nhưng khó giữ. Được lợi thì nên dừng lại tích lũy, đừng mở rộng vội.","hung"]],
"dv|thaNga|LocTha_KyXungNga":[["Trung Châu; Từ Tăng Sinh","Lộc nhập tha cung còn Kỵ xung ngã cung: hung – mình giúp người, đợi lúc họ gặp khó mới tìm đến; lợi ích bị đẩy sang tay người khác, nên đi làm công và biết đủ.","Bạn có xu hướng cho đi nhiều mà nhận lại ít trong giai đoạn này. Giúp người trong khả năng và ưu tiên sự ổn định của mình.","hung"]],
"dv|thaNga|KyXungNga":[["Trung Châu","Kỵ xung ngã cung: thiệt hại để lại hậu quả dài, áp lực nặng; Hóa nhập không đúng chỗ khiến đương số chịu sức ép.","Bạn có xu hướng gặp áp lực kéo dài ở một mảng trong giai đoạn này. Chia nhỏ vấn đề và giải quyết dần sẽ giảm gánh nặng.","hung"]],
"dv|thaNga|LocTheoKyVeNga":[["Trung Châu","Lộc theo Kỵ quay về ngã cung: hưởng lợi lớn từ bên ngoài, vận rất tốt nhưng phải xem xét kỹ; ngã cung ấy không được tự hóa, nếu tự hóa thì thành tổn thất.","Bạn có xu hướng nhận được nhiều lợi ích từ bên ngoài trong giai đoạn này. Giữ ổn định và đừng để mọi thứ trôi đi nhanh như đến.","cat"]],
"dv|thaNga|PhiThaTieuHao":[["Trung Châu","Lộc và Kỵ ĐV cùng phi tha cung: tiêu hao, để lại hậu quả lâu dài, Kỵ đặc biệt dai.","Bạn có xu hướng dồn công sức cho người khác nhiều hơn cho mình. Giữ lại thời gian và nguồn lực cho bản thân là cần thiết.","hung"]],
"dv|cap|Lộc_TaiBach|Kỵ_NoBoc":[["Từ Tăng Sinh","Từ cung vận, Kỵ nhập Nô Bộc trong khi Lộc nhập Tài Bạch: chuyện tiền nong qua lại với bạn bè dễ hao hụt.","Bạn có xu hướng mất tiền vì bạn bè trong giai đoạn này. Giữ tiền bạc tách khỏi tình bạn.","hung"]],
"dv|cap|Lộc_Mệnh|Kỵ_PhuThe":[["Từ Tăng Sinh","Cung vận phi Lộc nhập Mệnh, Kỵ nhập Phu Thê: Lộc không thực, cần cảnh giác.","Bạn có xu hướng gặp cơ hội đi kèm rắc rối trong tình cảm. Cẩn trọng và minh bạch sẽ giữ được sự yên ổn.","hung"]],
"dv|cap|Lộc_Tha|Kỵ_PhuThe":[["Từ Tăng Sinh","Từ cung vận, Kỵ nhập Phu Thê còn Lộc phi ra tha cung: có tình bạn nhưng cũng có kiếp nạn do bạn bè, ảnh hưởng tới hôn nhân.","Bạn có xu hướng để bạn bè ảnh hưởng đến gia đình. Giữ ranh giới rõ ràng sẽ bảo vệ tổ ấm.","hung"]],
"tuyen|HuynhNo|cat":[["Khai quán nhân Tử Vi; Phương Ngoại Nhân","Cung khí số vị hóa Lộc/Quyền/Khoa nhập tuyến Huynh–Nô (kể cả tự hóa ở Huynh Đệ): vận này có thành tựu, nhờ bạn bè, cấp dưới.","Bạn có xu hướng đạt được thành tựu nhờ sự hợp sức của người khác. Trân trọng đội ngũ của mình là chìa khóa.","cat"]],
"tuyen|HuynhNo|ky":[["Khai quán nhân Tử Vi; Phương Ngoại Nhân","Cung khí số vị hóa Kỵ nhập tuyến Huynh–Nô: vận này không có thành tựu trên tuyến đó.","Bạn có xu hướng thấy việc hợp tác chưa mang lại kết quả. Tự lực nhiều hơn và chờ thời điểm thuận.","hung"]],
"tuyen|PhuTat|cat":[["Khai quán nhân Tử Vi; Phương Ngoại Nhân","Cung khí số vị hóa Lộc/Quyền/Khoa nhập tuyến Phụ–Tật: vận có 'quang minh', sáng sủa, minh bạch.","Bạn có xu hướng thấy mọi việc rõ ràng, sáng sủa hơn. Đây là lúc tốt để giải quyết giấy tờ và học hỏi.","cat"]],
"tuyen|PhuTat|ky":[["Khai quán nhân Tử Vi; Phương Ngoại Nhân","Cung khí số vị hóa Kỵ nhập tuyến Phụ–Tật: mất quang minh, tổn hại tinh thần.","Bạn có xu hướng thấy mọi việc mù mờ, mệt mỏi hơn. Giữ sức, nghỉ ngơi và tránh quyết định lớn khi chưa rõ ràng.","hung"]],
"dv|trung|Kỵ|Lộc":[["Trung Châu","Kỵ năm sinh trùng Lộc đại vận: biến xấu thành tốt, rất tốt.","Bạn có xu hướng thấy điều từng khó khăn nay chuyển thành thuận lợi. Đây là lúc gặt hái từ những nỗ lực cũ.","cat"]],
"dv|trung|Lộc|Khoa":[["Trung Châu","Lộc năm sinh trùng Khoa đại vận: danh và tiền đều có, thi cử thuận, thiên về chuyên môn, cần lao tâm.","Bạn có xu hướng được cả tiếng lẫn lợi trong giai đoạn này. Đầu tư vào chuyên môn sẽ nhân lên thành quả.","cat"]],
"dv|trung|Lộc|Kỵ":[["Trung Châu","Lộc năm sinh trùng Kỵ đại vận (Song Kỵ): hao tài, bất hòa, được rồi mất, thị phi nhiều, rất xấu.","Bạn có xu hướng thấy điều vốn thuận nay gặp trục trặc. Giữ chặt những gì đã có và tránh tranh cãi.","hung"]],
"dv|trung|Lộc|Quyền":[["Trung Châu","Lộc năm sinh gặp trùng Quyền của đại vận: tiền lợi thịnh vượng nhưng phải vất vả.","Bạn có xu hướng kiếm được nhiều nhưng cũng phải làm nhiều. Giữ sức khỏe để đi đường dài.","cat"]],
"dv|trung|Kỵ|Quyền":[["Trung Châu","Kỵ năm sinh trùng Quyền đại vận: bất hòa, tranh chấp, thị phi, lao lực, tài chính không thuận.","Bạn có xu hướng gặp va chạm khi cố giành phần đúng. Mềm mỏng và chọn trận đáng đấu sẽ giúp bạn đỡ hao sức.","hung"]],
"dv|trung|Quyền|Khoa":[["Trung Châu","Quyền năm sinh trùng Khoa đại vận: có địa vị, kỹ năng chuyên môn, danh lợi dễ được.","Bạn có xu hướng được công nhận về năng lực. Tiếp tục trau dồi chuyên môn sẽ nâng vị thế của bạn.","cat"]],
"dv|trung|Quyền|Kỵ":[["Trung Châu","Quyền năm sinh gặp trùng Kỵ của đại vận: lao lực vất vả, gặt hái ít, giành giật, được mất khó lường.","Bạn có xu hướng làm nhiều mà kết quả chưa như ý. Tập trung vào ít việc quan trọng sẽ hiệu quả hơn.","hung"]],
"dv|trung|Khoa|Khoa":[["Trung Châu","Khoa năm sinh trùng Khoa đại vận: có quý nhân, danh tiếng nhưng dễ do dự, thiếu quyết đoán, ít được nâng đỡ thực chất; cần tự giải quyết.","Bạn có xu hướng được tiếng tốt nhưng hay chần chừ. Quyết đoán hơn sẽ biến danh tiếng thành kết quả.","trung"]],
"dv|trung|Kỵ|Kỵ":[["Trung Châu","Kỵ năm sinh gặp trùng Kỵ của đại vận (Song Kỵ): quy vị thì cát, gom được tiền; không quy vị thì hung, hao của; ứng nghiệm khi lưu niên đến.","Bạn có xu hướng gặp giai đoạn mọi thứ dồn vào một mảng. Giữ kỷ luật tài chính và kiên nhẫn sẽ biến áp lực thành tích lũy.","trung"]],
"dv|mchat|Lộc":[["Trịnh Mục Đức","ĐV.X chồng lên cung có Lộc năm sinh (M chất Hóa Lộc): vận tốt cho chủ đề X.","Bạn có xu hướng gặp thuận lợi ở mảng này trong giai đoạn này. Chủ động tận dụng sẽ mang lại kết quả.","cat"]],
"dv|mchat|Quyền":[["Trịnh Mục Đức","ĐV.X chồng lên cung có Quyền năm sinh: vận tốt, chủ động cho chủ đề X.","Bạn có xu hướng làm chủ tốt mảng này. Tự tin hành động sẽ có kết quả.","cat"]],
"dv|mchat|Khoa":[["Trịnh Mục Đức","ĐV.X chồng lên cung có Khoa năm sinh: vận tốt, có danh, quý nhân cho chủ đề X.","Bạn có xu hướng được người tốt giúp ở mảng này. Giữ uy tín để duy trì điều đó.","cat"]],
"dv|mchat|Kỵ":[["Trịnh Mục Đức","ĐV.X chồng lên cung có Kỵ năm sinh: cohoc vẫn chấm 'vận tốt' – sự gắn bó, chuyên tâm vào chủ đề X.","Bạn có xu hướng chuyên tâm và gắn bó sâu với mảng này. Sự tập trung đó sẽ mang lại thành quả.","cat"]],
"dv|mchatTrung|2tang":[["Trịnh Mục Đức","Bản mệnh X có M chất và ĐV X có M chất (hoặc trùng ĐV Mệnh): thành công chủ đề X.","Bạn có xu hướng gặp thời điểm rất thuận cho mảng này. Đặt mục tiêu cụ thể và theo đuổi đến cùng.","cat"]],
"dv|mchatTrung|3tang":[["Trịnh Mục Đức","Bản mệnh, ĐV và lưu niên X đều có M chất: thành công chủ đề X.","Bạn có xu hướng ở đúng thời điểm vàng cho mảng này trong năm. Đừng do dự, hãy hành động.","cat"]],
"dv|phiPhuc|Lộc":[["Kinh nghiệm cao thủ Bắc phái","Cung X nguyên cục phi Lộc vào cung đại vận đang tới (hoặc đối cung, cung kề): Lộc tiên thiên của X hiện ra trong vận; ứng năm theo tam điểm.","Bạn có xu hướng thấy một điều may sẵn có trong đời mình bộc lộ rõ ở giai đoạn này. Nhận ra và tận dụng nó sẽ mang lại nhiều lợi ích.","cat"]],
"dv|phiPhuc|Kỵ":[["Kinh nghiệm cao thủ Bắc phái","Cung X nguyên cục phi Kỵ vào cung đại vận đang tới: Kỵ tiên thiên của X hiện ra – món nợ, trách nhiệm của chủ đề X lộ diện trong vận; ứng theo tam điểm.","Bạn có xu hướng phải đối diện một trách nhiệm cũ ở giai đoạn này. Giải quyết dứt điểm sẽ giúp bạn nhẹ gánh về sau.","hung"]],
"dv|tongLuan|Mệnh|cat":[["Tính toán hệ thống","Chủ đề Mệnh trong ĐV tổng kết tốt (rất tốt / khá tốt / tốt nhiều, xấu không đáng lo).","Bạn có xu hướng ở trong mười năm thuận cho chính mình. Hãy đặt mục tiêu lớn và chủ động theo đuổi.","cat"]],
"dv|tongLuan|Mệnh|binh":[["Tính toán hệ thống","Chủ đề Mệnh tốt xấu đan xen (mức không lớn hoặc biên độ lớn).","Bạn có xu hướng trải qua mười năm có cả thăng lẫn trầm. Giữ nhịp đều, tận dụng lúc thuận và tích lũy lúc chậm.","trung"]],
"dv|tongLuan|Mệnh|hung":[["Tính toán hệ thống","Chủ đề Mệnh xấu hoặc mặt xấu đáng lo.","Bạn có xu hướng cần nhiều kiên nhẫn trong mười năm này. Chăm sóc bản thân, tránh mạo hiểm và dựa vào người tin cậy sẽ giúp bạn vững.","hung"]],
"dv|tongLuan|Huynh Đệ|cat":[["Tính toán hệ thống","Chủ đề Huynh Đệ tổng kết tốt.","Bạn có xu hướng được anh chị em, bạn thân hỗ trợ nhiều. Đây là lúc tốt để cùng nhau làm việc chung.","cat"]],
"dv|tongLuan|Huynh Đệ|binh":[["Tính toán hệ thống","Chủ đề Huynh Đệ đan xen.","Bạn có xu hướng có quan hệ anh em, bạn thân lúc gần lúc xa. Giữ sự rõ ràng sẽ giữ được tình thân.","trung"]],
"dv|tongLuan|Huynh Đệ|hung":[["Tính toán hệ thống","Chủ đề Huynh Đệ xấu, đáng lo.","Bạn có xu hướng gặp bất đồng với anh em, bạn thân. Tránh góp vốn, vay mượn chung và nhường nhịn chuyện nhỏ.","hung"]],
"dv|tongLuan|Phu Thê|cat":[["Tính toán hệ thống","Chủ đề Phu Thê tổng kết tốt.","Bạn có xu hướng có chuyện tình cảm, hôn nhân êm ấm. Vun đắp đều đặn sẽ giữ được hạnh phúc.","cat"]],
"dv|tongLuan|Phu Thê|binh":[["Tính toán hệ thống","Chủ đề Phu Thê đan xen.","Bạn có xu hướng có tình cảm lúc thuận lúc va chạm. Lắng nghe và nhường nhau sẽ giúp vượt qua.","trung"]],
"dv|tongLuan|Phu Thê|hung":[["Tính toán hệ thống","Chủ đề Phu Thê xấu, đáng lo.","Bạn có xu hướng gặp thử thách trong chuyện tình cảm. Trò chuyện thẳng thắn và dành thời gian cho nhau là điều cần ưu tiên.","hung"]],
"dv|tongLuan|Tử Tức|cat":[["Tính toán hệ thống","Chủ đề Tử Tức tổng kết tốt.","Bạn có xu hướng có nhiều niềm vui từ con trẻ và các dự án chung. Hãy dành thời gian cho những điều đó.","cat"]],
"dv|tongLuan|Tử Tức|binh":[["Tính toán hệ thống","Chủ đề Tử Tức đan xen.","Bạn có xu hướng có chuyện con cái, hợp tác lúc thuận lúc vướng. Kiên nhẫn đồng hành là cách tốt nhất.","trung"]],
"dv|tongLuan|Tử Tức|hung":[["Tính toán hệ thống","Chủ đề Tử Tức xấu, đáng lo.","Bạn có xu hướng cần quan tâm nhiều hơn đến con trẻ và các khoản hợp tác. Thận trọng khi góp vốn và lắng nghe con nhiều hơn.","hung"]],
"dv|tongLuan|Tài Bạch|cat":[["Tính toán hệ thống","Chủ đề Tài Bạch tổng kết tốt.","Bạn có xu hướng có tài chính khởi sắc. Tích lũy đều đặn để thành quả bền lâu.","cat"]],
"dv|tongLuan|Tài Bạch|binh":[["Tính toán hệ thống","Chủ đề Tài Bạch đan xen.","Bạn có xu hướng có thu nhập lên xuống. Quỹ dự phòng sẽ giúp bạn yên tâm.","trung"]],
"dv|tongLuan|Tài Bạch|hung":[["Tính toán hệ thống","Chủ đề Tài Bạch xấu, đáng lo.","Bạn có xu hướng gặp áp lực tiền bạc. Chi tiêu tiết chế, tránh vay nợ và đầu tư mạo hiểm.","hung"]],
"dv|tongLuan|Tật Ách|cat":[["Tính toán hệ thống","Chủ đề Tật Ách tổng kết tốt.","Bạn có xu hướng có thể lực và tinh thần tốt. Duy trì thói quen lành mạnh để giữ phong độ.","cat"]],
"dv|tongLuan|Tật Ách|binh":[["Tính toán hệ thống","Chủ đề Tật Ách đan xen.","Bạn có xu hướng có sức khỏe lúc tốt lúc mệt. Ngủ đủ và vận động đều sẽ giúp ổn định.","trung"]],
"dv|tongLuan|Tật Ách|hung":[["Tính toán hệ thống","Chủ đề Tật Ách xấu, đáng lo.","Bạn có xu hướng cần chăm sóc bản thân kỹ hơn. Khám định kỳ, nghỉ ngơi hợp lý và giảm áp lực công việc.","hung"]],
"dv|tongLuan|Thiên Di|cat":[["Tính toán hệ thống","Chủ đề Thiên Di tổng kết tốt.","Bạn có xu hướng gặp may khi đi xa và giao tiếp rộng. Mở rộng phạm vi hoạt động sẽ mang lại cơ hội.","cat"]],
"dv|tongLuan|Thiên Di|binh":[["Tính toán hệ thống","Chủ đề Thiên Di đan xen.","Bạn có xu hướng gặp cả thuận lẫn trở ngại khi ra ngoài. Chuẩn bị kỹ trước mỗi chuyến đi, mỗi cuộc gặp.","trung"]],
"dv|tongLuan|Thiên Di|hung":[["Tính toán hệ thống","Chủ đề Thiên Di xấu, đáng lo.","Bạn có xu hướng gặp trục trặc khi đi xa hoặc làm việc với bên ngoài. Ưu tiên việc gần, chắc chắn và giữ an toàn khi di chuyển.","hung"]],
"dv|tongLuan|Nô Bộc|cat":[["Tính toán hệ thống","Chủ đề Nô Bộc tổng kết tốt.","Bạn có xu hướng được bạn bè, đồng nghiệp giúp sức. Ghi nhận và đáp lại sẽ giữ được sự hỗ trợ.","cat"]],
"dv|tongLuan|Nô Bộc|binh":[["Tính toán hệ thống","Chủ đề Nô Bộc đan xen.","Bạn có xu hướng gặp cả bạn tốt lẫn người không đáng tin. Chọn lọc quan hệ là điều cần làm.","trung"]],
"dv|tongLuan|Nô Bộc|hung":[["Tính toán hệ thống","Chủ đề Nô Bộc xấu, đáng lo.","Bạn có xu hướng gặp phiền phức từ bạn bè, đồng nghiệp. Giữ giấy tờ rõ ràng và tránh dính tiền bạc với người ngoài.","hung"]],
"dv|tongLuan|Quan Lộc|cat":[["Tính toán hệ thống","Chủ đề Quan Lộc tổng kết tốt.","Bạn có xu hướng có sự nghiệp thuận. Mạnh dạn nhận trách nhiệm lớn hơn.","cat"]],
"dv|tongLuan|Quan Lộc|binh":[["Tính toán hệ thống","Chủ đề Quan Lộc đan xen.","Bạn có xu hướng có công việc lúc thuận lúc vướng. Giữ chuyên môn vững để luôn có chỗ đứng.","trung"]],
"dv|tongLuan|Quan Lộc|hung":[["Tính toán hệ thống","Chủ đề Quan Lộc xấu, đáng lo.","Bạn có xu hướng gặp áp lực trong công việc. Tránh thay đổi vội, củng cố kỹ năng và chờ thời điểm thuận.","hung"]],
"dv|tongLuan|Điền Trạch|cat":[["Tính toán hệ thống","Chủ đề Điền Trạch tổng kết tốt.","Bạn có xu hướng thuận lợi về nhà cửa, tài sản. Đây là lúc tốt để an cư, tích lũy.","cat"]],
"dv|tongLuan|Điền Trạch|binh":[["Tính toán hệ thống","Chủ đề Điền Trạch đan xen.","Bạn có xu hướng có chuyện nhà cửa lúc thuận lúc phải lo. Cân nhắc kỹ trước khi mua bán lớn.","trung"]],
"dv|tongLuan|Điền Trạch|hung":[["Tính toán hệ thống","Chủ đề Điền Trạch xấu, đáng lo.","Bạn có xu hướng gặp áp lực về nhà cửa, tài sản gia đình. Giữ giấy tờ chặt chẽ và tránh thế chấp, bảo lãnh.","hung"]],
"dv|tongLuan|Phúc Đức|cat":[["Tính toán hệ thống","Chủ đề Phúc Đức tổng kết tốt.","Bạn có xu hướng thấy lòng an vui và gặp người tốt. Dành thời gian cho sở thích và người thân.","cat"]],
"dv|tongLuan|Phúc Đức|binh":[["Tính toán hệ thống","Chủ đề Phúc Đức đan xen.","Bạn có xu hướng có tâm trạng lúc vui lúc lo. Tìm hoạt động giúp tĩnh tâm sẽ giữ cân bằng.","trung"]],
"dv|tongLuan|Phúc Đức|hung":[["Tính toán hệ thống","Chủ đề Phúc Đức xấu, đáng lo.","Bạn có xu hướng thấy tinh thần nặng nề. Chia sẻ với người tin cậy và chăm sóc tâm trí là điều quan trọng.","hung"]],
"dv|tongLuan|Phụ Mẫu|cat":[["Tính toán hệ thống","Chủ đề Phụ Mẫu tổng kết tốt.","Bạn có xu hướng được cha mẹ, cấp trên nâng đỡ. Đây là lúc tốt cho học hành và giấy tờ.","cat"]],
"dv|tongLuan|Phụ Mẫu|binh":[["Tính toán hệ thống","Chủ đề Phụ Mẫu đan xen.","Bạn có xu hướng có quan hệ với cha mẹ, cấp trên lúc thuận lúc vướng. Mềm mỏng sẽ giữ được hòa khí.","trung"]],
"dv|tongLuan|Phụ Mẫu|hung":[["Tính toán hệ thống","Chủ đề Phụ Mẫu xấu, đáng lo.","Bạn có xu hướng cần quan tâm nhiều đến cha mẹ và cẩn trọng giấy tờ. Kiểm tra kỹ thủ tục và thăm hỏi gia đình thường xuyên.","hung"]],
"nam|nhap|Lộc|*":[["Trung Châu","Lộc lưu niên nhập cung X của đại vận (ghi 'L. Hóa Lộc nhập cung Đv. X (L. Y)'): chủ đề X của vận và Y của năm được lợi; ứng tháng theo tam điểm.","Bạn có xu hướng gặp thuận lợi ở mảng này trong năm. Chủ động nắm bắt vào đúng thời điểm.","cat"]],
"nam|nhap|Kỵ|*":[["Trung Châu","Kỵ lưu niên nhập cung X của đại vận: chủ đề X bị áp lực; nếu xung Quan Lộc hoặc Tài Bạch thì 'nội lực yếu, tốt ít'; ứng tháng theo tam điểm.","Bạn có xu hướng gặp áp lực ở mảng này trong năm. Chuẩn bị trước và giữ sự bình tĩnh sẽ giúp bạn vượt qua.","hung"]],
"ln|Dụng→Thể|chieu|Lộc|*":[["Từ Tăng Sinh","Lộc Dụng chiếu Thể (NV.X phi Lộc chiếu LN.X ở tháng; LN.X chiếu ĐV.X ở năm), dấu ****: cát lợi rất mạnh.","Bạn có xu hướng gặp thuận lợi rõ ở mảng này trong thời gian này. Hãy tận dụng ngay.","cat"]],
"ln|Dụng→Thể|chieu|Quyền|*":[["Từ Tăng Sinh","Quyền Dụng chiếu Thể (****): cát tượng, cần nghiệm.","Bạn có xu hướng có thêm sự chủ động ở mảng này. Quyết đoán đúng lúc sẽ có kết quả.","cat"]],
"ln|Dụng→Thể|chieu|Khoa|*":[["Từ Tăng Sinh","Khoa Dụng chiếu Thể (****): cát tượng, cần nghiệm.","Bạn có xu hướng được người giúp ở mảng này. Giữ uy tín để đón nhận.","cat"]],
"ln|Dụng→Thể|xung|Kỵ|*":[["Trịnh Mục Đức","Kỵ Dụng xung Thể (****): mức cảnh báo đỏ, rất xấu.","Bạn có xu hướng gặp thử thách lớn ở mảng này trong thời gian này. Thận trọng tối đa, hoãn quyết định lớn nếu được.","hung"]],
"ln|Dụng→Thể|nhap|Lộc|*":[["Ông Phúc Dụ","Quy vị Lộc (NV.X nhập LN.X, dấu ***): cát.","Bạn có xu hướng thấy mảng này thuận lợi trở lại. Củng cố những gì đang tốt.","cat"]],
"ln|Dụng→Thể|nhap|Quyền|*":[["Ông Phúc Dụ","Quy vị Quyền (***): cát.","Bạn có xu hướng làm chủ tốt mảng này. Tự tin hành động.","cat"]],
"ln|Dụng→Thể|nhap|Khoa|*":[["Ông Phúc Dụ","Quy vị Khoa (***): cát.","Bạn có xu hướng có sự ổn định và tiếng tốt ở mảng này. Giữ nhịp đều.","cat"]],
"ln|Dụng→Thể|nhap|Kỵ|*":[["Trịnh Mục Đức","Quy vị Kỵ (***): báo động vàng.","Bạn có xu hướng phải xử lý việc tồn đọng ở mảng này. Giải quyết dứt điểm từng việc.","hung"]],
"ln|Thể→Dụng|chieu|Lộc|*":[["Từ Tăng Sinh","Lộc Thể chiếu Dụng (LN.X chiếu NV.X, dấu **): cát tượng, cần nghiệm.","Bạn có xu hướng được nền tảng sẵn có hỗ trợ ở mảng này. Biết tận dụng sẽ có lợi.","cat"]],
"ln|Thể→Dụng|chieu|Quyền|*":[["Từ Tăng Sinh","Quyền Thể chiếu Dụng (**): cát tượng.","Bạn có xu hướng có thêm hậu thuẫn ở mảng này. Dùng nó đúng chỗ.","cat"]],
"ln|Thể→Dụng|chieu|Khoa|*":[["Từ Tăng Sinh","Khoa Thể chiếu Dụng (**): cát tượng.","Bạn có xu hướng có người nâng đỡ ở mảng này. Hãy đón nhận.","cat"]],
"ln|Thể→Dụng|xung|Kỵ|*":[["Trịnh Mục Đức","Kỵ Thể xung Dụng (**): báo động vàng.","Bạn có xu hướng gặp vài trở ngại ở mảng này. Thận trọng hơn thường lệ là đủ.","hung"]],
"ln|Thể→Dụng|nhap|Lộc|*":[["Ông Phúc Dụ","Lộc Thể nhập Dụng (LN.X nhập NV.X, dấu *): cát tượng, cần nghiệm.","Bạn có xu hướng gặp thuận lợi nhẹ ở mảng này. Tích lũy dần.","cat"]],
"ln|Thể→Dụng|nhap|Quyền|*":[["Ông Phúc Dụ","Quyền Thể nhập Dụng (*): cát tượng.","Bạn có xu hướng chủ động hơn ở mảng này. Giữ sự ôn hòa khi quyết.","cat"]],
"ln|Thể→Dụng|nhap|Khoa|*":[["Ông Phúc Dụ","Khoa Thể nhập Dụng (*): cát tượng.","Bạn có xu hướng thấy mảng này ổn định, nhẹ nhàng. Duy trì nhịp hiện tại.","cat"]],
"ln|Thể→Dụng|nhap|Kỵ|*":[["Trịnh Mục Đức","Kỵ Thể nhập Dụng (*): báo động vàng.","Bạn có xu hướng thấy mảng này hơi nặng nề. Giảm tải và giữ sức.","hung"]],
"ln|Dụng→Thể|xung|Kỵ|Mệnh":[["Trịnh Mục Đức","NV Mệnh phi Kỵ xung LN Mệnh (****): báo động đỏ cho bản thân trong tháng.","Bạn có xu hướng thấy tháng này nhiều áp lực với chính mình. Sống chậm, nghỉ ngơi và tránh quyết định lớn.","hung"]],
"ln|Dụng→Thể|xung|Kỵ|Tử Tức":[["Trịnh Mục Đức","NV Tử Tức phi Kỵ xung LN Tử Tức: báo động đỏ cho con cái, hợp tác.","Bạn có xu hướng cần quan tâm con trẻ và các việc hợp tác nhiều hơn trong tháng. Thận trọng khi góp vốn.","hung"]],
"ln|Dụng→Thể|chieu|Lộc|Phúc Đức":[["Từ Tăng Sinh","NV Phúc Đức phi Lộc chiếu LN Phúc Đức (****): tinh thần, quý nhân, tiền bạc (chiếu Tài) cát lợi rất mạnh.","Bạn có xu hướng có tâm trạng vui và gặp may về tiền trong tháng. Dành chút thời gian tận hưởng.","cat"]],
"ln|Dụng→Thể|chieu|Lộc|Quan Lộc":[["Từ Tăng Sinh","NV Quan Lộc phi Lộc chiếu LN Quan Lộc (****): sự nghiệp cát lợi rất mạnh.","Bạn có xu hướng có tiến triển tốt trong công việc tháng này. Mạnh dạn đề xuất ý tưởng.","cat"]],
"ln|Dụng→Thể|chieu|Lộc|Mệnh":[["Từ Tăng Sinh","NV Mệnh phi Lộc chiếu LN Mệnh: cát lợi rất mạnh cho bản thân.","Bạn có xu hướng có một tháng rất thuận cho chính mình. Hãy làm những việc quan trọng.","cat"]],
"ln|Dụng→Thể|chieu|Lộc|Phụ Mẫu":[["Từ Tăng Sinh","NV Phụ Mẫu phi Lộc chiếu LN Phụ Mẫu: cha mẹ, cấp trên, giấy tờ cát lợi rất mạnh.","Bạn có xu hướng được người trên giúp trong tháng. Đây là lúc tốt cho giấy tờ, thi cử.","cat"]],
"thang|xuat|Lộc":[["","Lộc tháng xuất (vào tha cung): là hư lộc, làm ra mà rỗng; cộng hưởng sẽ mạnh khi Dương phi nhập Âm. Lộc vào trục Huynh–Nô: thành tựu, chi tiêu, trợ lực, biến động liên quan bạn bè, đồng nghiệp, cấp dưới, mẹ, cha mẹ vợ/chồng.","Bạn có xu hướng chi tiêu nhiều cho các mối quan hệ trong tháng. Đặt giới hạn trước sẽ giữ được ngân sách.","trung"]],
"thang|xuat|Kỵ":[["","Kỵ tháng không nhập, không xung tam hợp Mệnh: chỉ 'một phen hú vía', cộng hưởng yếu. Kỵ nhập tuyến Tử–Điền: biến động con cái, nhà đất, gia sản; Thuận thủy Kỵ xung Tật Ách: tổn sức khỏe; Kỵ nhập Phụ–Tật: việc nhà bị ảnh hưởng từ phía cha mẹ.","Bạn có xu hướng gặp chuyện làm mình lo nhưng thường không nghiêm trọng như tưởng. Bình tĩnh xử lý từng việc là đủ.","trung"]],
"thang|xuat|Quyền":[["","Quyền/Khoa tháng xuất, Dương phi nhập Dương: rỗng, cộng hưởng yếu.","Bạn có xu hướng thấy tháng này trôi khá nhẹ ở mảng này. Duy trì nhịp hiện tại.","trung"]],
"thang|tangTac|KhoaKy":[["","Khoa lưu niên gặp trùng Kỵ nguyệt vận: việc kéo dài, khó xong nhanh. Khoa gặp trùng Khoa: có quý nhân nhưng dễ biến thành Khoa xuất. Mệnh nguyên cục chịu tác động mạnh khi Kỵ ĐV, LN, NV cùng dồn vào.","Bạn có xu hướng thấy công việc trong tháng kéo dài hơn dự kiến. Kiên nhẫn và theo dõi sát sẽ giúp mọi việc xong xuôi.","trung"]],
"thang|tangTac|PhiLocKyXungNga":[["","Phi Kỵ và phi Lộc cùng từ tha cung xung ngã cung: hung, thiệt hại lớn; coi chừng khi xung vào Quan Lộc hoặc Tài Bạch.","Bạn có xu hướng gặp áp lực dồn từ nhiều phía trong tháng. Ưu tiên giữ tiền và giữ việc, tránh mở rộng.","hung"]],
"thang|tangTac|LocKyNgaGiup":[["","Lộc và Kỵ tháng cùng nhập ngã cung lưu niên: có ích cho tuyến cung, đời sống có thể phát triển.","Bạn có xu hướng thấy mọi việc tập trung về mình và có tiến triển. Tận dụng để hoàn thành việc dang dở.","cat"]],
"ungKy|tamDiem":[["Kinh nghiệm cao thủ Bắc phái","Năm/tháng/ngày ứng của một Hóa = chi cung nhận, chi đối cung và chi liền trước (ví dụ vào Mão → Mão, Dậu, Dần). Quy vị: thêm năm chi ĐV Mệnh và chi Mệnh gốc.","Bạn có xu hướng thấy sự việc ứng vào những thời điểm nhất định. Ghi chú và theo dõi sẽ giúp bạn chủ động hơn.","trung"]],
"ungKy|taiThienDiaNhan":[["","Tài thiên / Tài địa / Tài nhân: Lộc hoặc Kỵ tháng trùng điệp với Lộc/Kỵ tầng khác – dấu hiệu sự việc ứng ngay trong tháng (chưa xác định rõ tầng nào ứng tên nào).","Bạn có xu hướng thấy một việc đã chờ lâu sẽ có kết quả trong tháng này. Chuẩn bị sẵn sàng để đón nhận.","trung"]],
"thang|ketLuan|Mệnh|cat":[["Tính toán hệ thống","Kết luận tháng: chủ đề Mệnh tốt.","Bạn có xu hướng có một tháng thuận cho chính mình. Hãy làm những việc quan trọng.","cat"]],
"thang|ketLuan|Mệnh|binh":[["Tính toán hệ thống","Kết luận tháng: chủ đề Mệnh đan xen.","Bạn có xu hướng có tháng lúc thuận lúc mệt. Giữ nhịp sinh hoạt đều.","trung"]],
"thang|ketLuan|Mệnh|hung":[["Tính toán hệ thống","Kết luận tháng: chủ đề Mệnh xấu hoặc mặt xấu đáng lo.","Bạn có xu hướng gặp áp lực trong tháng. Sống chậm và tránh quyết định vội.","hung"]],
"thang|ketLuan|Huynh Đệ|cat":[["Tính toán hệ thống","Chủ đề Huynh Đệ tốt.","Bạn có xu hướng được anh em, bạn thân hỗ trợ trong tháng. Hẹn gặp và cùng bàn việc chung.","cat"]],
"thang|ketLuan|Huynh Đệ|binh":[["Tính toán hệ thống","Chủ đề Huynh Đệ đan xen.","Bạn có xu hướng có quan hệ anh em lúc thuận lúc vướng. Giữ lời nói nhẹ nhàng.","trung"]],
"thang|ketLuan|Huynh Đệ|hung":[["Tính toán hệ thống","Chủ đề Huynh Đệ xấu.","Bạn có xu hướng có va chạm với anh em, bạn thân trong tháng. Tránh vay mượn và tranh luận gay gắt.","hung"]],
"thang|ketLuan|Phu Thê|cat":[["Tính toán hệ thống","Chủ đề Phu Thê tốt.","Bạn có xu hướng có tình cảm êm ấm trong tháng. Dành thời gian cho nhau.","cat"]],
"thang|ketLuan|Phu Thê|binh":[["Tính toán hệ thống","Chủ đề Phu Thê đan xen.","Bạn có xu hướng có tình cảm lúc thuận lúc dỗi hờn. Lắng nghe nhau nhiều hơn.","trung"]],
"thang|ketLuan|Phu Thê|hung":[["Tính toán hệ thống","Chủ đề Phu Thê xấu.","Bạn có xu hướng dễ căng thẳng trong tình cảm tháng này. Nhường nhịn và nói chuyện khi đã bình tĩnh.","hung"]],
"thang|ketLuan|Tử Tức|cat":[["Tính toán hệ thống","Chủ đề Tử Tức tốt.","Bạn có xu hướng có niềm vui từ con trẻ và việc hợp tác. Tận hưởng những khoảnh khắc đó.","cat"]],
"thang|ketLuan|Tử Tức|binh":[["Tính toán hệ thống","Chủ đề Tử Tức đan xen.","Bạn có xu hướng có chuyện con cái, hợp tác cần để ý. Đồng hành nhẹ nhàng.","trung"]],
"thang|ketLuan|Tử Tức|hung":[["Tính toán hệ thống","Chủ đề Tử Tức xấu.","Bạn có xu hướng cần quan tâm con trẻ và các khoản hợp tác. Thận trọng khi góp vốn.","hung"]],
"thang|ketLuan|Tài Bạch|cat":[["Tính toán hệ thống","Chủ đề Tài Bạch tốt.","Bạn có xu hướng có thu nhập thuận trong tháng. Để dành một phần.","cat"]],
"thang|ketLuan|Tài Bạch|binh":[["Tính toán hệ thống","Chủ đề Tài Bạch đan xen.","Bạn có xu hướng có tiền vào ra thất thường. Theo dõi chi tiêu sát hơn.","trung"]],
"thang|ketLuan|Tài Bạch|hung":[["Tính toán hệ thống","Chủ đề Tài Bạch xấu.","Bạn có xu hướng gặp áp lực tiền bạc trong tháng. Không cho vay, không chi lớn.","hung"]],
"thang|ketLuan|Tật Ách|cat":[["Tính toán hệ thống","Chủ đề Tật Ách tốt.","Bạn có xu hướng khỏe khoắn trong tháng. Giữ thói quen tốt.","cat"]],
"thang|ketLuan|Tật Ách|binh":[["Tính toán hệ thống","Chủ đề Tật Ách đan xen.","Bạn có xu hướng lúc khỏe lúc mệt. Ngủ đủ, ăn uống điều độ.","trung"]],
"thang|ketLuan|Tật Ách|hung":[["Tính toán hệ thống","Chủ đề Tật Ách xấu.","Bạn có xu hướng dễ mệt mỏi trong tháng. Ưu tiên nghỉ ngơi và đi lại an toàn.","hung"]],
"thang|ketLuan|Thiên Di|cat":[["Tính toán hệ thống","Chủ đề Thiên Di tốt.","Bạn có xu hướng gặp may khi ra ngoài trong tháng. Hẹn gặp, đi lại sẽ có ích.","cat"]],
"thang|ketLuan|Thiên Di|binh":[["Tính toán hệ thống","Chủ đề Thiên Di đan xen.","Bạn có xu hướng gặp cả thuận lẫn trở ngại khi ra ngoài. Chuẩn bị kỹ trước khi đi.","trung"]],
"thang|ketLuan|Thiên Di|hung":[["Tính toán hệ thống","Chủ đề Thiên Di xấu.","Bạn có xu hướng gặp trục trặc khi đi xa trong tháng. Hạn chế chuyến đi không cần thiết.","hung"]],
"thang|ketLuan|Nô Bộc|cat":[["Tính toán hệ thống","Chủ đề Nô Bộc tốt.","Bạn có xu hướng được bạn bè, đồng nghiệp giúp trong tháng. Ghi nhận và cảm ơn họ.","cat"]],
"thang|ketLuan|Nô Bộc|binh":[["Tính toán hệ thống","Chủ đề Nô Bộc đan xen.","Bạn có xu hướng gặp cả người giúp lẫn người gây phiền. Chọn lọc khi hợp tác.","trung"]],
"thang|ketLuan|Nô Bộc|hung":[["Tính toán hệ thống","Chủ đề Nô Bộc xấu.","Bạn có xu hướng gặp rắc rối từ người ngoài trong tháng. Giữ giấy tờ rõ ràng, tránh dính tiền bạc.","hung"]],
"thang|ketLuan|Quan Lộc|cat":[["Tính toán hệ thống","Chủ đề Quan Lộc tốt.","Bạn có xu hướng có tiến triển trong công việc tháng này. Mạnh dạn thể hiện.","cat"]],
"thang|ketLuan|Quan Lộc|binh":[["Tính toán hệ thống","Chủ đề Quan Lộc đan xen.","Bạn có xu hướng có công việc lúc thuận lúc vướng. Tập trung việc chính.","trung"]],
"thang|ketLuan|Quan Lộc|hung":[["Tính toán hệ thống","Chủ đề Quan Lộc xấu.","Bạn có xu hướng gặp áp lực công việc trong tháng. Làm chắc từng việc, tránh tranh cãi.","hung"]],
"thang|ketLuan|Điền Trạch|cat":[["Tính toán hệ thống","Chủ đề Điền Trạch tốt.","Bạn có xu hướng thuận lợi về nhà cửa trong tháng. Thời điểm tốt để sửa sang, sắp xếp.","cat"]],
"thang|ketLuan|Điền Trạch|binh":[["Tính toán hệ thống","Chủ đề Điền Trạch đan xen.","Bạn có xu hướng có việc nhà cần lo. Giải quyết từng việc nhỏ.","trung"]],
"thang|ketLuan|Điền Trạch|hung":[["Tính toán hệ thống","Chủ đề Điền Trạch xấu.","Bạn có xu hướng gặp áp lực về nhà cửa, tài sản trong tháng. Hoãn mua bán lớn nếu chưa chắc.","hung"]],
"thang|ketLuan|Phúc Đức|cat":[["Tính toán hệ thống","Chủ đề Phúc Đức tốt.","Bạn có xu hướng thấy lòng an vui trong tháng. Dành thời gian cho sở thích.","cat"]],
"thang|ketLuan|Phúc Đức|binh":[["Tính toán hệ thống","Chủ đề Phúc Đức đan xen.","Bạn có xu hướng có tâm trạng lên xuống. Tìm hoạt động giúp tĩnh tâm.","trung"]],
"thang|ketLuan|Phúc Đức|hung":[["Tính toán hệ thống","Chủ đề Phúc Đức xấu.","Bạn có xu hướng lo nghĩ nhiều trong tháng. Chia sẻ với người tin cậy và nghỉ ngơi.","hung"]],
"thang|ketLuan|Phụ Mẫu|cat":[["Tính toán hệ thống","Chủ đề Phụ Mẫu tốt.","Bạn có xu hướng được người trên giúp trong tháng. Tốt cho giấy tờ, học hành.","cat"]],
"thang|ketLuan|Phụ Mẫu|binh":[["Tính toán hệ thống","Chủ đề Phụ Mẫu đan xen.","Bạn có xu hướng có quan hệ với người trên lúc thuận lúc vướng. Mềm mỏng sẽ tốt hơn.","trung"]],
"thang|ketLuan|Phụ Mẫu|hung":[["Tính toán hệ thống","Chủ đề Phụ Mẫu xấu.","Bạn có xu hướng cần quan tâm cha mẹ và cẩn trọng giấy tờ trong tháng. Kiểm tra kỹ trước khi ký.","hung"]],
"than|Phu Thê":[["Tử Vi truyền thống","Thân cư Phu Thê: hậu vận chịu ảnh hưởng mạnh từ hôn nhân và người phối ngẫu; cát hung của nửa đời sau gắn với chất lượng cung Phu Thê và các Hóa nhập vào đó.","Bạn có xu hướng để người bạn đời và đời sống lứa đôi định hướng phần lớn nửa sau cuộc đời mình. Hãy chọn người đồng hành bằng sự tỉnh táo, cùng nhau vun đắp nhưng vẫn giữ những mục tiêu riêng để mình luôn vững vàng.","trung"]],
"than|Tài Bạch":[["Tử Vi truyền thống","Thân cư Tài Bạch: người trọng thực tế, lấy tiền bạc làm thước đo an toàn; nửa đời sau gắn chặt với việc tạo dựng và giữ của, nên tốt xấu của cung Tài Bạch phản ánh rõ lên hậu vận.","Bạn thuộc mẫu người thực tế, coi trọng việc làm ra của cải và càng về sau càng gắn đời mình với chuyện tiền bạc. Hãy lập kế hoạch chi tiêu, tích lũy rõ ràng và dành chỗ cho niềm vui, sức khỏe để tiền là phương tiện chứ không thành gánh nặng.","trung"]],
"than|Quan Lộc":[["Tử Vi truyền thống","Thân cư Quan Lộc: nặng chí sự nghiệp, lấy công danh làm thước đo giá trị bản thân; hậu vận thịnh suy theo đường công việc, cần xét kỹ các Hóa nhập Quan Lộc và trục Phu–Quan.","Bạn có xu hướng đặt công việc lên hàng đầu và đánh giá chính mình qua những gì làm được. Sự tận tụy ấy giúp bạn tiến xa, chỉ cần nhớ dành thời gian cho gia đình và nghỉ ngơi để thành công không phải đánh đổi bằng sự cân bằng.","trung"]],
"cungKhi|*|cat":[["Sở Hoàng","Cung khí tiểu cát: nạp âm của can chi cung thuộc hành hỉ thần nhưng lực chưa mạnh, hoặc thuộc hành nhàn nghiêng về phía tốt; chủ đề cung này thuận ở mức vừa phải, có Hóa cát nhập thì dễ phát huy.","Bạn có xu hướng gặp khá nhiều thuận lợi ở mảng đời này, dù chưa đến mức dễ dàng tuyệt đối. Chủ động góp thêm công sức và nắm đúng thời điểm sẽ biến nền tảng tốt ấy thành kết quả rõ ràng.","cat"]],
"cungKhi|*|hung":[["Sở Hoàng","Cung khí hung nhiều hơn cát: nạp âm của can chi cung nghiêng về hành kỵ thần nhưng chưa đến mức đại hung; chủ đề cung này hay gặp trở ngại nhỏ, nếu thêm Hóa Kỵ nhập thì cần thận trọng hơn.","Bạn có xu hướng gặp một số vướng mắc ở mảng đời này và phải bỏ nhiều công hơn mới đạt điều mong muốn. Đi chậm mà chắc, chuẩn bị kỹ và nhờ người có kinh nghiệm góp ý sẽ giúp bạn vượt qua phần lớn trở ngại.","hung"]]};

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
  var tv = tuviLapLaSo(input);
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
/** Nghịch thủy Kỵ (≥4 nguồn): Mệnh, Tài Bạch hoặc Quan Lộc phi Kỵ sang cung đối, cung đối có Kỵ năm sinh và không tự hóa.
 *  Thuận thủy Kỵ (mức trung bình – có lẽ là tên khác của Lưu thủy Kỵ): phi Kỵ sang cung khác, không phải cung đối. */
var PT_THUY_ = {
  nghich: function (N, i) {
    var k = N.phi[i][3].toi;
    return ['Mệnh', 'Tài Bạch', 'Quan Lộc'].indexOf(N.ten[i]) >= 0 && k === ptD_(i) && N.sn[3].toi === k && !N.tuHoa.some(function (t) { return t.o === k; });
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
    if (y[1]) cc.push((y[0] ? y[0] + ': ' : '') + y[1]);
    if (y[2] && de.indexOf(y[2]) < 0 && de.length < (toiDa || 2)) de.push(y[2]);
  });
  var muc = dem.cat > dem.hung ? 'cat' : dem.hung > dem.cat ? 'hung' : 'trung';
  return { t: t, chu: chu || '', muc: muc, de: de, cc: cc };
}
/** Mục lấy từ kho theo các khóa thử dần */
function ptMucK_(t, khoa, chu, chon, toiDa) { return ptMuc_(t, ptKho_(khoa), chu, chon, toiDa); }
/** Mục tự soạn (khi kho không có khóa – lùi về văn cũ PT_VAN/PT_LUAN) */
function ptMucTu_(t, ky, de, chu, muc) { return ky || de ? { t: t, chu: chu || '', muc: muc || 'trung', de: de ? [de] : [], cc: ky ? [ky] : [] } : null; }
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
      else if (PT_THUY_ && PT_THUY_.thuan(N, i)) them(X, 'Thuận thủy Kỵ', X + ' phi Kỵ nhập ' + ten[ky], null, true);
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
  if (snLoc != null && tv.pos['Lộc Tồn'] === snLoc && ten[snLoc] !== 'Mệnh') them(ten[snLoc], 'Song Lộc', 'Lộc năm sinh gặp Lộc Tồn tại ' + ten[snLoc], function (y, n) { return n === 0; });
  if (snLoc != null && snLoc === snQuyen) them(ten[snLoc], 'Song Lộc', 'Lộc và Quyền năm sinh cùng tọa ' + ten[snLoc], function (y, n) { return n === 1; });
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
    if (f.toi == null || f.toi === i) return;
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
    if (uT === uD) return;                                                 // hai tầng trùng cung: không xét Thể – Dụng
    ptHoa_(tv, P[uD].can).forEach(function (f) {                            // Dụng → Thể
      if (f.toi == null) return; var H = PT_H[f.h];
      if (f.toi === uT) { dong.push({ X: X, huong: 'Dụng→Thể', loai: 'nhap', H: H, sao: f.sao, sao4: 3, o: f.toi, tu: uD }); cham(X, H === 'Kỵ' ? -2 : 2, (H === 'Kỵ' ? 'quy vị Kỵ' : 'quy vị ' + H)); }
      else if (f.toi === ptD_(uT)) { var lx = H === 'Kỵ' ? 'xung' : 'chieu'; dong.push({ X: X, huong: 'Dụng→Thể', loai: lx, H: H, sao: f.sao, sao4: 4, o: f.toi, tu: uD }); cham(X, H === 'Kỵ' ? -3 : H === 'Lộc' ? 3 : 1, H + ' Dụng ' + (H === 'Kỵ' ? 'xung' : 'chiếu') + ' Thể'); }
      if (X !== 'Mệnh' && tang === 'dv') {                                  // ĐV.X phi Hóa vào Mệnh nguyên cục
        if (f.toi === menhNC) { dong.push({ X: X, huong: 'Mệnh', loai: H === 'Kỵ' ? 'kyNhapMenh' : 'catNhapMenh', H: H, sao: f.sao, sao4: 0, o: f.toi, tu: uD }); cham(X, H === 'Kỵ' ? -1 : 1, H + ' nhập Mệnh gốc'); }
        else if (H === 'Kỵ' && f.toi === ptD_(menhNC)) { dong.push({ X: X, huong: 'Mệnh', loai: 'kyXungMenh', H: H, sao: f.sao, sao4: 0, o: f.toi, tu: uD }); cham(X, -2, 'Kỵ xung Mệnh gốc'); }
      }
    });
    ptHoa_(tv, P[uT].can).forEach(function (f) {                            // Thể → Dụng
      if (f.toi == null) return; var H = PT_H[f.h];
      if (f.toi === uD) { dong.push({ X: X, huong: 'Thể→Dụng', loai: 'nhap', H: H, sao: f.sao, sao4: 1, o: f.toi, tu: uT }); cham(X, H === 'Kỵ' ? -1 : 1, H + ' Thể nhập Dụng'); }
      else if (f.toi === ptD_(uD)) { var lx2 = H === 'Kỵ' ? 'xung' : 'chieu'; dong.push({ X: X, huong: 'Thể→Dụng', loai: lx2, H: H, sao: f.sao, sao4: 2, o: f.toi, tu: uT }); cham(X, H === 'Kỵ' ? -1 : 1, H + ' Thể ' + (H === 'Kỵ' ? 'xung' : 'chiếu') + ' Dụng'); }
    });
    if (snO && snO[uD]) cham(X, 2, 'M chất (' + snO[uD].join(', ') + ')');  // tầng nhỏ chồng lên cung có Hóa năm sinh
  });
  return { dong: dong, diem: diem };
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
      if (tang === 'nam') { m.de = m.de.map(function (s) { return s.replace(/tháng này/g, 'năm nay').replace(/trong tháng/g, 'trong năm').replace(/một tháng/g, 'một năm').replace(/tháng/g, 'năm'); }); m.cc = m.cc.map(function (s) { return s.replace(/tháng/g, 'năm'); }); }
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
    if (lc.toi != null && tamHop.indexOf(lc.toi) >= 0 && !(X === 'Mệnh' && lc.toi === N.o['Mệnh'])) {
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
  return { o: d, menh: ten[d], can: CAN[can], chi: CHI[d], hoa: hoa.map(function (f) { return { h: PT_H[f.h], sao: f.sao, cung: f.toi == null ? null : ten[f.toi] }; }), phan: phan, tong: tong };
}

/* ---------- Vận năm (Thể = đại vận, Dụng = lưu niên) ---------- */
function ptNamBai_(N, tv, y, dvO) {
  var P = N.P, ten = N.ten, m = ((y + 8) % 12 + 12) % 12, can = ((y + 6) % 10 + 10) % 10, hoa = ptHoa_(tv, can), snO = ptSnO_(N), phan = [];
  var dvHoa = dvO != null ? ptHoa_(tv, P[dvO].can) : [];
  var a = [];
  hoa.forEach(function (f) {
    if (f.toi == null) return; var H = PT_H[f.h], tDV = dvO != null ? ptTenTu_(dvO, f.toi) : null, tLN = ptTenTu_(m, f.toi);
    var t = 'Hóa ' + H + ' năm ' + y + ' (can ' + CAN[can] + ', ' + f.sao + ') nhập ' + (tDV ? 'ĐV.' + tDV + ' (' : '') + 'LN.' + tLN + (tDV ? ')' : '') + ', nguyên cục ' + ten[f.toi];
    var mm = H === 'Lộc' || H === 'Kỵ' ? ptMucK_(t, ['nam|nhap|' + H + '|*'], ptLv_(tDV || tLN), null, 1) : ptMucTu_(t, '', '', '');
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
  if (dvO == null) return { nam: y, can: CAN[can], chi: CHI[m], menh: ten[m], o: m, phan: a.length ? [{ ten: 'Thông tin lưu niên', muc: a }] : [], tong: [], chuaVaoVan: true };
  var TD = ptTheDung_(N, tv, dvO, m, 'nam', null);
  var h = TD.dong.slice().sort(function (x, z) { return z.sao4 - x.sao4; }).map(function (x) { return ptDongMuc_(x, 'nam', 'ĐV', 'LN'); }).filter(Boolean);
  if (a.length) phan.push({ ten: 'Thông tin lưu niên – Tứ Hóa năm vào cung nào của đại vận', muc: a });
  if (b.length) phan.push({ ten: 'Mẫu Lộc – Kỵ trong năm, M chất ba tầng', muc: b });
  if (h.length) phan.push({ ten: 'Thể – Dụng giữa lưu niên và đại vận', muc: h });
  return { nam: y, can: CAN[can], chi: CHI[m], menh: ten[m], o: m, dvMenh: ten[dvO], phan: phan, tong: ptTongLuan_(TD.diem, 'nam') };
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
    var m = xuat ? ptMucK_(t + ' – ' + H + ' xuất', ['thang|xuat|' + (H === 'Khoa' ? 'Quyền' : H)], ptLv_(Y), null, 1) : ptMucTu_(t, '', '', ptLv_(Y));
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
  return { thang: k, o: nv, menh: ten[nv], chi: CHI[nv], can: CAN[canThang], phan: phan, tong: ptTongLuan_(TD.diem, 'thang') };
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
