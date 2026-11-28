/**
 * ============================================================
 *  ThaiAtVan.gs — THÁI ẤT THẦN KINH: VĂN LUẬN (4 phạm vi)
 *  Chỉ đọc kết quả của ThaiAt.gs (taLap_, taMenh_, taNamCaNhan_, taDanhGia_) rồi ghép văn.
 *  Đề xuất: nghien-cuu/thai-at/00-de-xuat.md mục 6 (nguyên tắc văn, chia phần bán).
 *  Hàm chính:
 *    - taVanMenh_(menh)               mệnh pháp: tóm tắt miễn phí + 12 cung (trả phí) + lời khuyên
 *    - taVanNam_(nam)                 vận năm cá nhân (cách ghép của Thiên Cơ Các)
 *    - taVanThoiCuoc_(ban)            khí thế chung năm/tháng – MIỄN PHÍ, giọng trung tính
 *    - taVanHoi_(ban, loai, danhGia)  hỏi một việc theo giờ – cùng khuôn kmVanLuan_ (KyMonVan.gs)
 *  Quy tắc văn (CLAUDE.md): phần dễ hiểu KHÔNG nêu tên thần/sao, không số toán, không chữ Hán,
 *  không dấu phần trăm, không hù dọa; thuật ngữ chỉ ở canCu và luôn kèm giải nghĩa.
 *  Tầng 1: "Bạn thuộc mẫu người… / có xu hướng… / Bạn đang ở thế…"; Tầng 2: song song mặt tốt – mặt xấu, mặt xấu nói thẳng; gợi ý ngắn đặt sau.
 *  Văn ghép từ tín hiệu của bàn (cách cục, thế nghiêng Chủ/Khách, cung được phúc/bị cản) nên mỗi bàn một bài.
 * ============================================================
 */

/* ---------- Lời lưu ý cố định ---------- */
var TAV_LUU_Y_ = 'Đây là góc nhìn theo cổ học Thái Ất (phép Thống Tông, giờ Việt Nam), để bạn tham khảo và tự cân nhắc. Quyết định cuối cùng là của bạn.';
var TAV_LUU_Y_THEM_ = {
  tai_loc: 'Với việc tiền bạc, hãy hỏi thêm người có chuyên môn tài chính trước khi xuống tiền.',
  suc_khoe: 'Với việc sức khỏe, hãy hỏi bác sĩ; lời này chỉ nói về nhịp sống, không thay lời khuyên y tế.',
  kien_tung: 'Với việc tranh chấp, hợp đồng, hãy hỏi thêm luật sư hoặc người am hiểu pháp lý.'
};
var TAV_LUU_Y_HOI_ = 'Thái Ất trả lời câu hỏi "nên chủ động hay nên chờ"; muốn chọn giờ, hướng cụ thể, bạn xem thêm phần Kỳ Môn.';
var TAV_LUU_Y_MENH_ = 'Phần xem đời người của Thái Ất (mệnh pháp) hiện chỉ đối chiếu được với một nguồn tính, ít hơn nhiều so với Tử Vi, nên Thiên Cơ Các xếp độ tin cậy của phần này ở mức thấp. Hãy đọc như một góc nhìn thêm: chỗ nào trùng với lá số Tử Vi hay Bát Tự của bạn thì đáng tin hơn, chỗ nào khác thì cứ để ngỏ. Phần hạn 10 năm sẽ được bổ sung ở bản sau.';
var TAV_GHI_CHU_NAM_ = 'Vận năm cá nhân là cách ghép của Thiên Cơ Các từ bàn năm Thái Ất và lá mệnh của bạn (xem các điểm nâng đỡ, điểm cản của năm rơi vào mảng đời nào), không phải phép cổ nguyên bản; độ tin cậy ở mức thấp, nên đọc như một góc nhìn tham khảo.';
var TAV_LUU_Y_THOI_CUOC_ = 'Đây là góc nhìn về nhịp chung theo cổ học, để tham khảo, không phải dự báo về bất kỳ sự kiện, nơi chốn hay con người cụ thể nào. Mỗi người một hoàn cảnh; cách bạn ứng xử quan trọng hơn nhịp chung.';

/* ---------- Thần → câu đời thường (không nêu tên) ----------
 * giup: thần lành (cụm động từ sau "bạn"); vuong: thần cản (cụm sau "ở mảng này");
 * nguoi: kiểu người hỗ trợ; trung: câu cho thần trung tính khi đứng ở một cung mệnh.
 */
var TAV_THAN_DE_ = {
  ngu_phuc: { giup: 'có một nguồn phúc lớn che chở', nguoi: 'một người có lòng tốt, sẵn lòng che chở' },
  quan_co: { giup: 'được người có vị thế cao nâng đỡ', nguoi: 'người có vị thế cao, người đứng đầu' },
  than_co: { giup: 'được người điều hành, người quản lý trực tiếp nâng đỡ', nguoi: 'người quản lý trực tiếp, người điều hành' },
  dan_co: { giup: 'được người xung quanh, người bình thường ủng hộ', nguoi: 'người xung quanh, khách hàng, bạn bè bình thường' },
  van_xuong: { giup: 'có sự sáng suốt, khả năng học và trình bày', nguoi: 'người hiểu biết, thầy cô, người hướng dẫn' },
  hop_than: { giup: 'dễ có sự gắn kết, hòa hợp', nguoi: 'người làm cầu nối, người giới thiệu' },
  dai_du: { vuong: 'dễ có biến động lớn, thay đổi ngoài dự tính' },
  tieu_du: { vuong: 'có những xáo trộn nhỏ theo từng giai đoạn ngắn' },
  thuy_kich: { vuong: 'có sức đẩy, va chạm từ bên ngoài tìm đến' },
  tu_than: { vuong: 'có trở ngại làm chậm bước' },
  thien_at: { vuong: 'có trở ngại đến từ người bên trên' },
  dia_at: { vuong: 'có trở ngại từ phần nền, từ khâu chuẩn bị' },
  truc_phu: { vuong: 'dễ vướng giấy tờ, thủ tục, phép tắc' },
  thai_at: { trung: 'Mảng này hay đặt bạn vào vị trí trung tâm, phải đứng ra lo liệu.' },
  chu_dai: { trung: 'Đây là mảng bạn có xu hướng tự tay giữ gìn.' },
  khach_dai: { trung: 'Mảng này hay có người ngoài tác động vào.' },
  dinh_muc: { trung: 'Mảng này thường là nơi nhiều chuyện trong đời đi đến kết cục.' }
};

/* Dụng thần của loại việc → điều việc đó cần (đời thường) */
var TAV_DUNG_DE_ = {
  than_co: 'sự nâng đỡ của người quản lý trực tiếp', quan_co: 'sự nâng đỡ của người có vị thế cao',
  ngu_phuc: 'phúc phần, sự che chở', dan_co: 'sự ủng hộ của người xung quanh, khách hàng',
  hop_than: 'sự gắn kết giữa hai người', thuy_kich: 'sức đi, sức chủ động của bạn',
  van_xuong: 'sự sáng suốt, khả năng học và trình bày'
};

/* ---------- Cách cục → đời thường ----------
 * de: mệnh đề cho hỏi việc / vận năm; menh: cho mệnh pháp ("Trong đời, …"); xh: cho thời cuộc chung;
 * khuyen: tầng 2, luôn có hướng khắc phục.
 */
var TAV_CACH_DE_ = {
  yem: { de: 'có một sức ép từ bên ngoài đè lên người đang giữ thế, bên có sẵn vị trí dễ bị động',
    menh: 'những lúc bạn đang giữ một vị trí, hay có sức ép từ bên ngoài tìm đến',
    xh: 'nhiều người đang giữ vị trí, nhất là người điều hành, cảm thấy sức ép từ bên ngoài dồn lên',
    khuyen: 'Gợi ý: khi đang giữ một vị trí, củng cố nền trước – rà lại cam kết, giữ khách quen, chưa vội mở thêm việc mới.' },
  kich: { de: 'dễ gặp cạnh tranh trực diện hoặc lời chỉ trích',
    menh: 'bạn hay phải đối mặt với cạnh tranh trực diện, và lời góp ý thẳng thắn đến với bạn nhiều hơn người khác',
    xh: 'cạnh tranh trực diện và lời qua tiếng lại dễ nhiều hơn thường lệ',
    khuyen: 'Gợi ý: trả lời góp ý bằng kết quả và giấy tờ rõ ràng thay vì tranh cãi.' },
  tu: { de: 'có cảm giác bị kẹt, việc chính chưa xoay được như ý và nhiều khâu phải chờ người khác',
    menh: 'có những giai đoạn bạn thấy mình bị kẹt, việc chính chậm xoay dù đã cố',
    xh: 'nhiều việc lớn có cảm giác chậm xoay, phải chờ qua nhiều khâu',
    khuyen: 'Gợi ý: chia việc lớn thành những bước nhỏ làm được ngay, và chăm phần nền trong lúc chờ.' },
  bach: { de: 'áp lực đến khá gần, có khi từ người ngoài, có khi từ chính người thân cận',
    menh: 'áp lực trong đời bạn thường đến sát và nhanh, nhiều việc hay dồn vào cùng một lúc',
    xh: 'áp lực đến gần, nhiều việc dồn hạn cùng lúc',
    khuyen: 'Gợi ý: làm trước những việc có hạn chót, nói rõ ràng với người thân cận.' },
  cach: { de: 'ý của bên trên và bên dưới khó gặp nhau, lời nói dễ bị truyền sai',
    menh: 'bạn hay gặp cảnh ý mình và ý người quyết định không gặp nhau, phải qua người trung gian',
    xh: 'ý của người quyết định và người thực hiện dễ lệch nhau, thông tin dễ bị truyền sai',
    khuyen: 'Gợi ý: nhờ một người trung gian đáng tin, ghi lại những điều đã thống nhất.' },
  doi: { de: 'lời hứa miệng, kể cả của người thân tín, dễ đổi khi hoàn cảnh đổi',
    menh: 'bạn dễ đặt lòng tin vào lời hứa miệng, trong khi hoàn cảnh đổi thì lời hứa cũng dễ đổi',
    xh: 'lời hứa miệng dễ đổi khi hoàn cảnh đổi, nên thỏa thuận rõ ràng trên giấy được coi trọng',
    khuyen: 'Gợi ý: với cam kết quan trọng, ghi rõ trên giấy.' },
  quan: { de: 'hai phía đang giằng co, chưa ai chịu lùi',
    menh: 'bạn hay ở trong những thế giằng co, nơi hai bên cùng chờ bên kia lùi trước',
    xh: 'nhiều chuyện ở thế giằng co, hai bên cùng chờ bên kia lùi trước',
    khuyen: 'Gợi ý: đừng ép kết quả; mở nút từ một điểm chung nhỏ trước.' },
  de_hiep: { de: 'bạn dễ bị kẹp giữa hai phía, bên nào cũng muốn bạn đứng về mình',
    menh: 'bạn hay đứng giữa hai phía, được cả hai tin nhưng cũng bị cả hai kéo',
    xh: 'nhiều người có cảm giác bị kẹp giữa hai phía, khó chọn bên',
    khuyen: 'Gợi ý: giữ trung lập, nói như nhau với cả hai bên, đừng hứa điều mình không chắc làm được.' },
  chu_hiep: { de: 'quyền quyết định đang nằm trong một nhóm nhỏ quanh người đứng đầu',
    menh: 'bạn hay làm việc trong những môi trường mà quyền quyết định nằm ở một nhóm nhỏ',
    xh: 'quyền quyết định dồn vào một nhóm nhỏ, người ngoài khó tiếp cận',
    khuyen: 'Gợi ý: tìm đúng người trong nhóm quyết định và trình bày ngắn gọn với họ.' },
  khach_hiep: { de: 'nhiều người cùng muốn tiếp cận một chỗ, cạnh tranh để được chú ý',
    menh: 'bạn hay ở giữa đám đông cùng nhắm vào một cơ hội',
    xh: 'nhiều người cùng chen về một chỗ, cạnh tranh để được chú ý',
    khuyen: 'Gợi ý: muốn nổi bật thì chuẩn bị khác người thay vì chen đông.' },
  tu_quach_co: { de: 'bốn bề như bị vây chặt, đây là lúc để giữ chứ chưa phải để mở rộng',
    menh: 'có những giai đoạn bốn bề như khép lại, bạn dễ thấy bế tắc, cô lập và khó xoay xở',
    xh: 'không khí chung thiên về giữ gìn, ít người dám mở rộng mạnh',
    khuyen: 'Gợi ý: giữ chắc cái đang có, giảm chi tiêu không cần thiết.' },
  tu_quach_do: { de: 'lối ra tạm khép, việc lớn khó thông trong lúc này',
    menh: 'có những giai đoạn lối ra tạm khép, việc lớn đứng im và bạn buộc phải chờ',
    xh: 'nhiều lối đi tạm khép, việc lớn khó thông nhanh',
    khuyen: 'Gợi ý: dùng thời gian này để học thêm, sửa nền, chưa mở việc lớn.' },
  tuong_giua: { de: 'sức chính của một bên đang đứng yên, chưa ra tay',
    menh: 'bạn có xu hướng quan sát lâu trước khi ra tay, nên ít sai vì vội nhưng dễ lỡ thời cơ',
    xh: 'một bên chọn đứng yên quan sát, chưa ra tay',
    khuyen: 'Gợi ý: đặt cho mình một mốc thời gian để quyết, tránh chờ mãi.' },
  hoa_thuan: { de: 'không có thế đè, ép hay vây nào đáng kể, không khí khá hòa thuận',
    menh: 'nhịp đời bạn khá hòa thuận, ít bị kẹp hay bị ép từ bên ngoài, nhưng cũng vì thế dễ chậm đổi, thiếu sức bật',
    xh: 'không khí khá hòa thuận, hợp những việc cần nhiều người cùng làm',
    khuyen: 'Tận dụng lúc êm để làm những việc cần hợp tác; đừng vì êm mà lơi tay.' }
};
/* Thứ tự ưu tiên khi chọn cách để nói (nặng trước) */
var TAV_CACH_THU_TU_ = ['tu_quach_co', 'tu_quach_do', 'yem', 'tu', 'kich', 'quan', 'cach', 'doi', 'de_hiep', 'bach', 'chu_hiep', 'khach_hiep', 'tuong_giua', 'hoa_thuan'];

/* Con số toán → đời thường (không nêu số) */
var TAV_TOAN_DE_ = {
  tam_tai: 'đủ cả thời, nền và người', toan_doan: 'đà ngắn, hợp làm nhanh gọn', vo_dia: 'nền (tiền, người, giấy tờ) còn mỏng',
  vo_nhan: 'thiếu người đồng hành', truong_toan: 'có sức bền', trung_duong: 'hơi cứng, dễ quá tay', trung_am: 'hơi mềm, dễ chần chừ'
};

/* ---------- 12 cung mệnh pháp ---------- */
var TAV_CUNG_ = {
  menh: {
    tot: 'Bạn có nền bản thân vững: khi đã chọn hướng thì ít bị lung lay, người xung quanh dễ tin bạn. Cái giá: dễ cứng, khó đổi hướng khi cần.',
    xau: 'Bạn có xu hướng tự gánh nhiều, hay lo trước cả những việc chưa đến; con đường của bạn thường phải tự mở chứ ít khi có sẵn.',
    tron: 'Bạn có hai mặt cân nhau: lúc quyết đoán, lúc lại cần thời gian cân nhắc; hướng đi rõ dần theo trải nghiệm.',
    khuyen: 'Gợi ý: mỗi năm chọn một mục tiêu chính cho bản thân và viết ra.' },
  huynh_de: {
    tot: 'Anh chị em và bạn bè ngang hàng có xu hướng là chỗ dựa thật của bạn; nhiều cơ hội đến qua những người cùng lứa. Cái giá: dễ nể nang, khó từ chối khi họ nhờ tiền.',
    xau: 'Quan hệ với anh chị em, bạn bè ngang hàng có xu hướng lúc gần lúc xa, mỗi người một hướng; chuyện tiền bạc chung dễ thành vướng mắc.',
    tron: 'Quan hệ anh chị em, bạn bè ở mức vừa phải: có người thân thiết, có người chỉ xã giao, và bạn tự chọn được ai để gần.',
    khuyen: 'Gợi ý: giữ rõ ràng chuyện tiền bạc với người ngang hàng.' },
  the_thiep: {
    tot: 'Chuyện bạn đời có xu hướng êm: người đi cùng bạn biết chia sẻ, hai người dễ cùng nhìn về một hướng. Cái giá: dễ coi sự êm là đương nhiên mà lơ vun đắp.',
    xau: 'Chuyện bạn đời có xu hướng trắc trở: hai người dễ khác nhịp, hay bất đồng, có giai đoạn xa cách, lạnh nhạt hoặc mỗi người một nơi.',
    tron: 'Chuyện bạn đời có cả lúc ấm lẫn lúc lạnh; mức hòa hợp phụ nhiều vào cách hai người nói chuyện với nhau hằng ngày.',
    khuyen: 'Gợi ý: dành một khoảng cố định mỗi tuần chỉ để hai người trò chuyện.' },
  tu_ton: {
    tot: 'Con cái, hoặc những người trẻ bạn dìu dắt, có xu hướng mang lại niềm vui và sự tự hào cho bạn. Cái giá: dễ kỳ vọng nhiều, đặt nặng thành tích của con.',
    xau: 'Chuyện con cái có xu hướng khiến bạn bận lòng nhiều: con muộn, khó dạy, hoặc khác quan điểm với bạn.',
    tron: 'Chuyện con cái ở mức bình thường: có lúc vui, có lúc lo, phần lớn nằm ở cách bạn đồng hành cùng con.',
    khuyen: 'Gợi ý: lắng nghe con (hoặc người trẻ bạn dìu dắt) nhiều hơn dặn dò.' },
  tai_bach: {
    tot: 'Tiền bạc có xu hướng đến với bạn khá đều, nhất là từ công sức và uy tín của chính bạn. Cái giá: dễ chủ quan, tiêu rộng tay lúc dư.',
    xau: 'Tiền bạc có xu hướng vào ra thất thường: có lúc dư, có lúc hụt, dễ mất tiền vì khoản phát sinh, cho vay hoặc đầu tư vội.',
    tron: 'Tiền bạc ở mức đủ dùng và tích lũy được nếu có kế hoạch; không tự nhiên nhiều, cũng không thiếu thốn.',
    khuyen: 'Gợi ý: tách riêng một khoản dự phòng, hỏi người có chuyên môn tài chính trước những khoản lớn.' },
  dien_trach: {
    tot: 'Nhà cửa, tài sản có xu hướng vững; bạn có duyên với việc giữ và làm tăng giá trị chỗ ở. Cái giá: dễ dồn quá nhiều tiền vào nhà đất, ít tiền mặt.',
    xau: 'Chuyện nhà cửa có xu hướng bất ổn: hay dời chỗ ở, sửa chữa tốn kém, dễ vướng giấy tờ hoặc tranh chấp tài sản.',
    tron: 'Nhà cửa ở mức ổn định vừa phải; tài sản tăng chậm nhưng chắc nếu bạn kiên nhẫn.',
    khuyen: 'Gợi ý: đọc kỹ giấy tờ nhà đất trước khi ký, chỉ mua bán lớn khi đã có dự phòng.' },
  quan_loc: {
    tot: 'Công việc có xu hướng thuận: bạn dễ được tin giao việc, sự nghiệp đi lên theo từng bậc. Cái giá: việc dồn nhiều, dễ quá tải.',
    xau: 'Công việc có xu hướng trắc trở: phải đổi hướng vài lần, làm nhiều mà không được ghi nhận đúng mức, có giai đoạn chững hoặc mất việc.',
    tron: 'Công việc ở mức ổn: tiến bộ đến từ sự bền bỉ hơn là từ cơ hội bất ngờ.',
    khuyen: 'Gợi ý: ghi lại kết quả cụ thể của mình mỗi quý.' },
  no_boc: {
    tot: 'Cấp dưới, cộng sự, người giúp việc có xu hướng hết lòng với bạn; bạn biết cách dùng người. Cái giá: dễ ỷ lại vào họ.',
    xau: 'Quan hệ với cộng sự, cấp dưới có xu hướng phức tạp: dễ giao nhầm người, bị hiểu sai ý hoặc bị phụ lòng.',
    tron: 'Cộng sự quanh bạn có người được việc, có người cần kèm; chọn người kỹ thì đỡ vất vả.',
    khuyen: 'Gợi ý: giao việc kèm mục tiêu và hạn rõ ràng bằng văn bản.' },
  tat_ach: {
    tot: 'Sức khỏe có nền khá tốt; cơ thể bạn hồi lại nhanh khi được nghỉ đúng cách. Cái giá: dễ chủ quan, làm quá sức.',
    xau: 'Sức khỏe có xu hướng yếu hơn người: dễ mệt, dễ ốm khi làm quá sức hoặc căng thẳng lâu, có vấn đề hay kéo dài.',
    tron: 'Sức khỏe ở mức bình thường, phụ nhiều vào nhịp ăn ngủ của bạn.',
    khuyen: 'Gợi ý: khám định kỳ; có điều lo lắng thì hỏi bác sĩ, vì đây chỉ là góc nhìn tham khảo.' },
  phuc_duc: {
    tot: 'Đời sống tinh thần có nền tốt: bạn biết tìm niềm vui ở việc nhỏ, thường gặp may lúc cần. Cái giá: dễ ỷ vào may mắn.',
    xau: 'Đời sống tinh thần có xu hướng hay nặng lòng: bạn dễ nghĩ nhiều, mang cả lo toan của người khác, có giai đoạn buồn bực kéo dài.',
    tron: 'Đời sống tinh thần cân bằng vừa phải; bình yên đến khi bạn biết dừng đúng lúc.',
    khuyen: 'Gợi ý: giữ một thói quen giúp lòng lắng xuống, như đi bộ hay đọc sách.' },
  tuong_mao: {
    tot: 'Bạn có xu hướng để lại ấn tượng tốt ngay từ đầu; dáng vẻ và cách nói của bạn tạo được tin cậy. Cái giá: người ta kỳ vọng cao, sơ suất nhỏ cũng dễ bị để ý.',
    xau: 'Người khác có xu hướng nhìn bạn khác với con người thật của bạn: dễ bị cho là khó gần hoặc quá nghiêm.',
    tron: 'Hình ảnh của bạn trong mắt người khác ở mức trung tính; càng tiếp xúc lâu, người ta càng hiểu bạn.',
    khuyen: 'Gợi ý: chủ động chào hỏi trước khi gặp người mới.' },
  phu_mau: {
    tot: 'Cha mẹ hoặc người đỡ đầu có xu hướng là chỗ dựa tốt; bạn được dạy dỗ, nâng đỡ đúng lúc. Cái giá: dễ dựa dẫm, chậm tự lập.',
    xau: 'Quan hệ với cha mẹ, người đỡ đầu có xu hướng căng: khác quan điểm, ít được nâng đỡ, hoặc bạn sớm phải tự lập.',
    tron: 'Quan hệ với cha mẹ, người đỡ đầu ở mức bình thường, gần gũi hơn khi bạn chủ động chia sẻ.',
    khuyen: 'Gợi ý: lắng nghe cha mẹ trước khi tranh luận.' }
};
var TAV_MENH_TOM_ = {
  tot: 'Phần bản thân của bạn có điểm tựa tốt: bạn có xu hướng đứng vững khi đã chọn hướng, nhưng dễ cứng, khó đổi khi cần.',
  xau: 'Bạn có xu hướng tự gánh nhiều việc và hay lo trước, dễ quá tải và thấy cô độc khi gánh một mình.',
  tron: 'Bạn có xu hướng cân nhắc kỹ trước khi quyết, và hướng đi rõ dần theo trải nghiệm.'
};

/* ---------- Thế bẩm sinh (giữ – xông pha – cân bằng) ---------- */
var TAV_THE_ = {
  giu_xay: {
    tom: 'Bạn thuộc mẫu người hợp giữ và xây hơn là xông pha: bạn làm tốt nhất khi có một nền chắc để đứng, và thành quả thường đến từ sự bền bỉ hơn là một cú bứt phá. Mặt trái: dễ ngại đổi, bỏ lỡ cơ hội mới.',
    khuyen: 'Gợi ý: khi cơ hội mới đến, thử ở quy mô nhỏ trước, giữ nền cũ song song.',
    viec: 'Mỗi quý tự hỏi một lần: mình có đang bỏ lỡ cơ hội nào chỉ vì ngại đổi không? Nếu có, thử cái mới ở quy mô nhỏ.',
    ten: 'người hợp giữ và xây' },
  xong_pha: {
    tom: 'Bạn thuộc mẫu người hợp chủ động, mở đường hơn là ngồi giữ: bạn sáng lên khi có việc mới để làm, và cơ hội thường đến khi bạn là người bước tới trước. Mặt trái: dễ đặt cược quá tay, thiếu đường lui.',
    khuyen: 'Gợi ý: mỗi lần xông pha, giữ một khoản dự phòng và chừa đường lui.',
    viec: 'Trước mỗi quyết định lớn, chờ một đêm rồi mới chốt, và hỏi ý một người bạn tin tưởng.',
    ten: 'người hợp chủ động, xông pha' },
  can_bang: {
    tom: 'Bạn thuộc mẫu người cân bằng giữa giữ và tiến: biết lúc nào nên bám nền, lúc nào nên mở lời, và đổi vai khá linh hoạt. Mặt trái: dễ lưng chừng, không hẳn giữ cũng không hẳn tiến.',
    khuyen: 'Gợi ý: trước mỗi việc lớn, tự hỏi "lần này mình giữ hay mở lời?" rồi chọn một vai.',
    viec: 'Trước mỗi việc lớn, ghi ra một dòng: lần này mình giữ hay mình tiến, vì sao.',
    ten: 'người cân bằng giữa giữ và tiến' }
};

/* ---------- Vận năm ---------- */
var TAV_NAM_HELO_ = { thuan: 'nên chủ động tiến', thuan_dk: 'nên tiến có chọn lọc', nen_cho: 'nên giữ và củng cố' };
var TAV_NAM_NGHIENG_ = {
  chu_ro: 'Nhịp chung của năm nghiêng rõ về phía người giữ thế, tức người đã có sẵn vị trí, nền tảng, khách quen. Bạn đang ở thế có thể dựa vào những gì mình đã xây.',
  chu: 'Nhịp chung của năm hơi nghiêng về phía người giữ thế. Những gì bạn đã xây có xu hướng đứng vững, còn việc mới cần thêm thời gian để thành hình.',
  giang_co: 'Nhịp chung của năm cân giữa người giữ thế và người mở lời; không bên nào trội hẳn, nên kết quả phụ nhiều vào sự chuẩn bị của bạn.',
  khach: 'Nhịp chung của năm hơi nghiêng về phía người chủ động, người mở lời. Cái mới dễ chen vào, nên bạn có xu hướng phải tự hỏi: giữ cái đang có, hay mở thêm?',
  khach_ro: 'Nhịp chung của năm nghiêng rõ về phía người chủ động: nhiều đề nghị, nhiều người muốn chen vào. Bạn đang ở thế người giữ thành trong một năm nhiều biến chuyển.'
};
var TAV_NAM_KET_ = {
  thuan: 'Đây là năm hợp để tiến: chọn một hai việc lớn nhất và làm cho trọn, đừng chia sức ra quá nhiều mặt. Mặt trái của năm thuận: dễ ôm quá nhiều việc và chủ quan; nên giữ một khoản dự phòng.',
  thuan_dk: 'Đây là năm tiến có chọn lọc: việc nào đã có nền thì đẩy mạnh, việc nào còn mới thì thử nhỏ trước, làm lớn ngay dễ hụt. Với đề nghị mới, hỏi kỹ điều kiện và ghi rõ trên giấy.',
  nen_cho: 'Đây là năm khó mở rộng: việc mới dễ chậm, tiền và sức dễ hao nếu ôm nhiều. Năm hợp củng cố: chọn một hai việc chính và làm thật chắc, sắp lại nền tảng.'
};
var TAV_NAM_VIEC1_ = {
  thuan: 'Chọn một việc lớn nhất của năm ở mảng {phuc} và bắt đầu sớm, ngay trong quý đầu.',
  thuan_dk: 'Liệt kê các việc muốn làm trong năm, giữ lại hai việc quan trọng nhất ở mảng {phuc}; việc còn lại để sau.',
  nen_cho: 'Dành nửa đầu năm để củng cố nền: trả bớt nợ, sắp lại giấy tờ, học thêm một kỹ năng; mảng {phuc} là chỗ nên chăm trước.'
};

/* ---------- Thời cuộc chung ---------- */
var TAV_TC_NGHIENG_ = {
  chu_ro: 'Khí chung của {ky} nghiêng rõ về phía người giữ thế: ai đã có nền, có nghề vững, có khách quen thì dễ giữ được nhịp. Đây là lúc hợp củng cố hơn mở rộng; cái mới vẫn có chỗ, nhưng cần đi chậm và chắc. Mặt tiêu cực: người mới, việc mới khó chen chân, dễ thấy bị gạt ra; người đang giữ thế dễ trì trệ, ngại đổi.',
  chu: 'Khí chung của {ky} hơi nghiêng về phía người giữ thế. Những gì đã xây có xu hướng đứng vững, còn việc mới cần thêm thời gian để được đón nhận. Nhịp hợp nhất là làm chắc phần đang có rồi mới mở thêm. Mặt tiêu cực: cái mới dễ bị chậm lại, nhiều kế hoạch phải chờ lâu hơn dự tính.',
  giang_co: 'Khí chung của {ky} cân giữa người giữ thế và người mở lời; chưa bên nào trội hẳn. Kết quả của mỗi việc phụ nhiều vào sự chuẩn bị hơn là vào nhịp chung. Mặt tiêu cực: nhiều chuyện giằng co, chậm ngã ngũ, dễ mệt vì chờ đợi.',
  khach: 'Khí chung của {ky} hơi nghiêng về phía người chủ động, người mở lời. Ý tưởng mới, cách làm mới dễ được chú ý; người đang giữ vị trí nên cởi mở hơn một chút để không đứng ngoài nhịp chung. Mặt tiêu cực: nhiều xáo trộn nhỏ, người đang giữ vị trí dễ bị cạnh tranh, mất khách hoặc mất chỗ.',
  khach_ro: 'Khí chung của {ky} nghiêng rõ về phía người chủ động: nhiều đề nghị mới, nhiều người muốn bước vào chỗ đã có người. Cái mới dễ chen vào; người giữ thế cần lắng nghe và thích nghi hơn là chỉ đứng giữ. Mặt tiêu cực: xáo trộn nhiều, thứ đã ổn dễ bị lung lay, người chậm thích nghi dễ bị bỏ lại.'
};
var TAV_TC_TOAN_THU_TU_ = ['tam_tai', 'hoa', 'vo_nhan', 'toan_doan', 'vo_dia', 'trung_duong', 'trung_am', 'truong_toan'];
var TAV_TC_TOAN_ = {
  tam_tai: 'Chuyện làm ăn, chi tiêu nói chung có đủ điều kiện để chạy đều: có thời, có nền, có người. Mặt trái: dễ chủ quan, mở rộng quá tay.',
  hoa: 'Các phần của đời sống chung khá ăn khớp với nhau; việc cần phối hợp nhiều bên dễ trôi hơn thường lệ. Mặt trái: ít sức ép nên dễ trì trệ.',
  vo_nhan: 'Chuyện làm ăn nói chung có cảm giác thiếu người đồng hành; hợp tác, kết nối và giữ người giỏi được coi trọng hơn.',
  toan_doan: 'Nhịp làm ăn nói chung ngắn: việc nhanh gọn dễ có lợi hơn kế hoạch kéo dài. Mặt trái: việc dài hơi dễ hụt hơi giữa chừng.',
  vo_dia: 'Nền chung còn mỏng: nhiều người ưu tiên giữ tiền, chi tiêu thận trọng, tính kỹ trước khi bỏ vốn.',
  trung_duong: 'Không khí làm ăn hơi gắt, dễ nóng vội; ai giữ được bình tĩnh thường đi xa hơn.',
  trung_am: 'Không khí làm ăn hơi chùng, dễ chần chừ; việc nhỏ làm đều đặn lợi hơn chờ cơ hội lớn.',
  truong_toan: 'Nhịp làm ăn nói chung có sức bền: việc dài hơi có chỗ để đi. Mặt trái: kết quả đến chậm, đòi hỏi kiên nhẫn.'
};
var TAV_TC_TAM_LY_ = {
  thuan: 'Tâm lý chung có xu hướng khá cởi mở, sẵn lòng thử cái mới; mặt trái: dễ chạy theo phong trào, quyết vội.',
  thuan_dk: 'Tâm lý chung có xu hướng thận trọng nhưng không bi quan: người ta vẫn làm, chỉ tính kỹ hơn; mặt trái: nhiều việc bị chần chừ, kéo dài.',
  nen_cho: 'Tâm lý chung có xu hướng dè dặt; nhiều người chọn quan sát thêm trước khi quyết việc lớn; mặt trái: chi tiêu, đầu tư chững lại, cơ hội nhỏ dễ bị bỏ qua.'
};
var TAV_TC_UNG_XU_ = {
  chu: 'Với mỗi người, cách ứng xử hợp nhịp là: người đi làm chăm vào việc chính và làm thật chắc; người kinh doanh giữ khách cũ, chi tiêu có kế hoạch, mở rộng từng bước nhỏ. Ai muốn đổi hướng thì cứ chuẩn bị, nhưng nên có nền dự phòng trước khi bước.',
  khach: 'Với mỗi người, cách ứng xử hợp nhịp là: người đi làm có thể chủ động đề xuất, học cái mới; người kinh doanh có thể thử sản phẩm, cách làm mới ở quy mô vừa sức. Chủ động không có nghĩa là vội: mỗi bước mới vẫn cần một khoản dự phòng.',
  giang_co: 'Với mỗi người, cách ứng xử hợp nhịp là chuẩn bị kỹ và chọn đúng việc: làm ít mà chắc, giữ quan hệ tốt với người cùng làm, và quyết định dựa trên con số cụ thể hơn là cảm giác chung.'
};

/* ---------- Hỏi việc: nhãn đoạn ---------- */
var TAV_NHAN_ = {
  thuan: { manh: 'Điểm mạnh của bạn: ', vuong: 'Chỗ nhỏ cần để ý: ', khongVuong: 'Không thấy điểm vướng lớn ở bàn này; mặt trái là thế thuận dễ làm bạn chủ quan, lơ khâu giấy tờ và chuẩn bị.' },
  thuan_dk: { manh: 'Điểm mạnh của bạn: ', vuong: 'Điều kiện cần lo trước: ' },
  nen_cho: { manh: 'Điểm tựa bạn vẫn có: ', vuong: 'Điểm vướng lúc này: ' }
};
var TAV_NHAN_HO_TRO_ = 'Người hoặc điều hỗ trợ: ';
var TAV_QUAN_DIEN_ = 'Việc dễ giằng co một thời gian trước khi ngã ngũ; ép kết quả sớm dễ thiệt.';

/* ---------- 7 loại việc × 3 mức (Thái Ất: chủ động hay chờ) ---------- */
var TAV_LOAI_ = {
  cong_viec: {
    canCu: 'Việc công việc xét thế Chủ – Khách của bàn giờ, cùng Thần Cơ (nền của người điều hành) và Quân Cơ (nền của người đứng đầu) là hai điểm trợ cho việc làm, thăng tiến.',
    manh: 'Bạn có nền nghề, và người làm cùng biết bạn làm được việc.',
    vuong: 'Điều kiện của việc chưa được nói rõ, mỗi bên dễ hiểu một kiểu.',
    hoTro: 'Người đi trước trong nghề, hoặc người giới thiệu bạn vào việc, là chỗ dựa tốt.',
    thuan: {
      mo: ['Bạn đang ở thế thuận cho việc công việc đang hỏi. Lúc này hợp để chủ động: nộp đơn, đề xuất, nhận thêm phần việc. Cái giá: việc dồn thêm nhanh, dễ nhận quá sức hoặc chủ quan ở khâu thỏa thuận.',
        'Chuyện công việc bạn hỏi có xu hướng thuận. Bạn thuộc mẫu người được việc khi dám lên tiếng, và thời điểm này đang mở cho sự lên tiếng đó. Cái giá: việc dồn thêm nhanh, dễ nhận quá sức hoặc chủ quan ở khâu thỏa thuận.'],
      dien: 'Diễn biến dễ gặp: phản hồi đến sớm, có thể kèm một yêu cầu bổ sung nhỏ; giữ nhịp, đừng đổi ý giữa chừng.',
      viec: ['Chủ động gửi hồ sơ hoặc đề xuất trong vài ngày tới, đừng chờ người khác mở lời trước.',
        'Chuẩn bị sẵn ba kết quả cụ thể bạn đã làm được để nói ngắn gọn khi được hỏi.',
        'Sau khi gửi, hỏi lại một lần sau vài ngày, giọng nhẹ nhàng, không thúc ép.']
    },
    thuan_dk: {
      mo: ['Bạn đang ở thế có thể tiến trong việc công việc, nhưng cần chuẩn bị thêm một bước. Cơ hội có thật, chỉ là người quyết định còn cần thêm bằng chứng về bạn.',
        'Chuyện công việc bạn hỏi có xu hướng thuận nếu đi đúng cách: có người giới thiệu, và điều kiện được nói rõ từ đầu.'],
      dien: 'Diễn biến dễ gặp: có thêm một vòng hỏi lại hoặc chờ duyệt, thời gian dài hơn bạn tính.',
      viec: ['Nhờ một người trong nghề đọc lại hồ sơ hoặc đề xuất trước khi gửi.',
        'Hỏi rõ phạm vi việc, đãi ngộ, thời gian thử việc bằng tin nhắn hoặc email để có văn bản.',
        'Giữ một phương án dự phòng song song, để không phải nhận điều kiện kém vì sốt ruột.']
    },
    nen_cho: {
      mo: ['Bạn đang ở thế nên chờ trong việc công việc. Thời điểm chưa mở: người quyết định đang bận việc khác, hoặc vị trí chưa thật sự trống.',
        'Chuyện công việc bạn hỏi lúc này có xu hướng nên giữ sức hơn là đổi chỗ hay đề nghị ngay. Một quyết định vội dễ khiến bạn phải làm lại từ đầu.'],
      dien: 'Diễn biến dễ gặp: tin tức đến chậm hoặc đổi vào phút cuối; vài ngày sau thế mới rõ hơn.',
      viec: ['Chưa gửi đề nghị lớn trong lúc này; dùng thời gian chờ để cập nhật hồ sơ và danh sách việc đã làm được.',
        'Học thêm một kỹ năng nhỏ còn thiếu, hoặc hỏi ý một người đi trước.',
        'Đặt một mốc xem lại sau vài ngày; khi có tin mới, nói ngắn gọn, rõ điều mình muốn.']
    }
  },
  tai_loc: {
    canCu: 'Việc tiền bạc xét thế Chủ – Khách của bàn giờ, cùng Ngũ Phúc (phúc lớn, nơi được che chở) và Dân Cơ (nền của người thường, khách hàng) là hai điểm trợ cho tiền vào.',
    manh: 'Bạn biết tính toán trước khi bỏ tiền ra, đó là điểm giữ cho bạn an toàn.',
    vuong: 'Cách chia phần và thời hạn thu hồi chưa được ghi rõ.',
    hoTro: 'Người có chuyên môn tài chính, hoặc người từng làm đúng loại việc này, nên được hỏi trước khi chốt.',
    thuan: {
      mo: ['Bạn đang ở thế thuận cho việc tiền bạc đang hỏi. Lúc này hợp để chủ động đặt điều kiện, chào hàng hay mở lời hợp tác. Cái giá: thấy thuận dễ xuống tiền quá tay, lơ khâu giấy tờ.',
        'Việc tiền bạc bạn hỏi có xu hướng mang lại lợi. Bạn thuộc mẫu người kiếm lợi tốt khi tính kỹ rồi mới làm, và thời điểm này đang thuận cho cách làm đó. Cái giá: thấy thuận dễ xuống tiền quá tay, lơ khâu giấy tờ.'],
      dien: 'Diễn biến dễ gặp: thỏa thuận chốt được khá nhanh, phần lợi về theo từng đợt chứ không một lần.',
      viec: ['Chốt các điểm chính bằng văn bản: số lượng, giá, thời hạn thanh toán.',
        'Giữ lại một khoản dự phòng, không dồn hết vốn vào một chỗ dù thế đang thuận.',
        'Ghi thu chi của việc này vào một bảng riêng để biết phần lợi thật.']
    },
    thuan_dk: {
      mo: ['Bạn đang ở thế có thể tiến trong việc tiền bạc, với điều kiện đi từng bước. Cơ hội sinh lời có, nhưng dồn sức một lần thì phần rủi ro lớn hơn phần lợi.',
        'Việc tiền bạc bạn hỏi có xu hướng mang lại lợi, nhưng lợi đến chậm hơn bạn mong. Chỗ cần lo nằm ở giấy tờ và cách chia phần.'],
      dien: 'Diễn biến dễ gặp: có một vòng mặc cả lại hoặc đổi điều khoản trước khi chốt.',
      viec: ['Trước khi ký, đề nghị ghi rõ tỷ lệ chia, thời hạn và cách rút vốn bằng văn bản.',
        'Chưa dồn hết vốn một lần; chia làm hai đợt, đợt hai chỉ vào khi đợt một đã rõ kết quả.',
        'Nhờ một người ngoài cuộc, tốt nhất là người có chuyên môn tài chính, đọc lại các con số; không vay thêm để dồn vào việc này.']
    },
    nen_cho: {
      mo: ['Bạn đang ở thế nên giữ tiền trong tay thêm một thời gian. Điều kiện hiện tại chưa có lợi cho bạn; xuống tiền lúc này dễ bị kẹt vốn hoặc mua đắt.',
        'Việc tiền bạc bạn hỏi lúc này có xu hướng nên chờ. Thế đang nghiêng về giữ của hơn là bỏ vốn ra; quyết định vội dễ khiến tiền nằm im lâu hơn bạn muốn.'],
      dien: 'Diễn biến dễ gặp: giá hoặc điều kiện còn thay đổi; vài ngày sau bức tranh rõ hơn.',
      viec: ['Chưa xuống tiền lúc này; ghi ra ba điều bạn cần biết thêm trước khi quyết.',
        'Hỏi ý kiến người có chuyên môn tài chính trước mọi khoản lớn.',
        'Khi thế đổi, chỉ bắt đầu với khoản nhỏ mà bạn chờ được nếu tiền về chậm.']
    }
  },
  tinh_cam: {
    canCu: 'Việc tình cảm xét Hợp Thần (sự gắn kết) và Ngũ Phúc (phúc lớn); các thế đối mặt, ngăn cách, giằng co được tính nặng hơn vì chạm thẳng vào chuyện hai người.',
    manh: 'Bạn chân thành, và người kia cảm nhận được điều đó.',
    vuong: 'Còn một điều hai người chưa nói ra với nhau.',
    hoTro: 'Một người bạn chung, biết lắng nghe và không đứng về phía nào, có thể giúp hai bạn hiểu nhau hơn.',
    thuan: {
      mo: ['Bạn đang ở thế thuận để bước tới gần hơn trong chuyện tình cảm. Hai bên đang có thiện cảm, và đây là lúc hợp để nói ra điều bạn muốn một cách nhẹ nhàng. Cái giá: dễ vội, nói quá đà hoặc đòi hỏi sớm làm người kia ngợp.',
        'Chuyện tình cảm bạn hỏi có xu hướng thuận. Bạn thuộc mẫu người tạo được sự ấm áp khi chủ động trước, và lúc này thế đang ủng hộ điều đó. Cái giá: dễ vội, nói quá đà hoặc đòi hỏi sớm làm người kia ngợp.'],
      dien: 'Diễn biến dễ gặp: một cuộc trò chuyện tự nhiên mở ra nhiều hơn bạn nghĩ; đừng vội đòi câu trả lời ngay.',
      viec: ['Hẹn gặp ở một nơi yên tĩnh, đủ thời gian để nói chuyện thong thả.',
        'Nói về cảm nhận của bạn thay vì hỏi dồn người kia.',
        'Giữ nhịp vừa phải: một lời hỏi thăm đúng lúc đủ giữ hơi ấm mà không tạo áp lực.']
    },
    thuan_dk: {
      mo: ['Bạn đang ở thế có thể tiến gần hơn trong chuyện tình cảm, với điều kiện đi chậm và lắng nghe nhiều hơn. Vội vàng lúc này dễ làm người kia lùi lại.',
        'Chuyện tình cảm bạn hỏi có xu hướng thuận nếu cả hai cùng nói rõ mong muốn. Thiện cảm có, nhưng còn một điều chưa được nói ra giữa hai người.'],
      dien: 'Diễn biến dễ gặp: có lúc ấm lúc lạnh; khoảng lặng không có nghĩa là hết quan tâm.',
      viec: ['Hẹn một cuộc gặp ngắn; mục tiêu là hiểu nhau thêm, chưa phải chốt chuyện.',
        'Hỏi một câu mở về điều người kia đang bận lòng, rồi lắng nghe.',
        'Nếu có hiểu lầm cũ, nhận phần của mình trước; một tin nhắn chân thành là đủ.']
    },
    nen_cho: {
      mo: ['Bạn đang ở thế nên chăm sóc bản thân trước khi chăm cho mối quan hệ. Ép chuyện lúc này dễ làm hai người xa nhau thêm.',
        'Chuyện tình cảm bạn hỏi lúc này có xu hướng nên chờ. Người kia có thể đang bận lòng chuyện riêng, nên lời bày tỏ bây giờ khó được đón nhận trọn vẹn.'],
      dien: 'Diễn biến dễ gặp: liên lạc thưa đi một thời gian; vài ngày sau không khí dễ dịu lại.',
      viec: ['Chưa hỏi chuyện quan trọng lúc này; giữ liên lạc nhẹ, không trách móc.',
        'Dành thời gian cho việc riêng và bạn bè; đừng dồn hết tâm trí vào chuyện này.',
        'Khi không khí dịu lại, hẹn gặp và nói chuyện ngắn, nhẹ.']
    }
  },
  di_xa: {
    canCu: 'Việc đi xa xét Thủy Kích (sức đi, phía chủ động) và Dân Cơ (đời sống hằng ngày); thế đánh và thế đè lên người đứng đầu được tính nặng hơn.',
    manh: 'Bạn thích nghi nhanh với nơi mới.',
    vuong: 'Khâu sắp xếp giờ giấc, giấy tờ dễ có trục trặc nhỏ.',
    hoTro: 'Người quen ở nơi đến, hoặc người đi cùng biết đường, giúp chuyến đi nhẹ hơn nhiều.',
    thuan: {
      mo: ['Bạn đang ở thế thuận để dịch chuyển. Đường đi thông, và việc ở nơi đến dễ suôn sẻ hơn bạn lo. Cái giá: thấy suôn dễ chủ quan với giấy tờ, an toàn và chi phí.',
        'Chuyến đi hay việc chuyển chỗ bạn hỏi có xu hướng thuận. Thay đổi lúc này dễ mở ra mối quen mới. Cái giá: thấy suôn dễ chủ quan với giấy tờ, an toàn và chi phí.'],
      dien: 'Diễn biến dễ gặp: lịch trình suôn sẻ, có thể đổi nhỏ về giờ giấc.',
      viec: ['Chốt ngày đi sớm và báo cho người ở nơi đến.',
        'Kiểm lại giấy tờ, vé, chỗ ở trước khi đi một ngày.',
        'Đến nơi, làm việc quan trọng nhất trước, việc phụ để sau.']
    },
    thuan_dk: {
      mo: ['Bạn đang ở thế có thể đi, với điều kiện có kế hoạch dự phòng. Đi theo nhóm hoặc có người đón sẽ giúp bạn yên tâm hơn.',
        'Chuyến đi hay việc chuyển chỗ có xu hướng thuận nếu bạn chuẩn bị kỹ phần giấy tờ và giờ giấc.'],
      dien: 'Diễn biến dễ gặp: trễ giờ hoặc đổi lịch nhỏ; chừa thời gian dư sẽ đỡ vội.',
      viec: ['Chuẩn bị một phương án khác: chuyến sau, chỗ ở thay thế.',
        'Báo lịch trình cho người thân và giữ liên lạc trong lúc đi.',
        'Đi chậm, giữ an toàn khi di chuyển; đừng xếp lịch quá sát.']
    },
    nen_cho: {
      mo: ['Bạn đang ở thế nên ở yên thêm ít ngày. Đi lúc này dễ tốn sức và thời gian hơn kết quả mang về.',
        'Chuyến đi hay việc chuyển chỗ lúc này có xu hướng nên chờ. Nhiều việc ở nơi đến chưa sẵn sàng đón bạn; đi lúc này dễ trễ, tốn kém và phải chờ đợi.'],
      dien: 'Diễn biến dễ gặp: lịch thay đổi, chờ đợi giữa chừng; vài ngày sau việc sắp xếp dễ hơn.',
      viec: ['Nếu việc cho phép, dời ngày đi thêm ít hôm; trong lúc chờ, chốt lại chỗ ở và người liên hệ.',
        'Nếu buộc phải đi, đi cùng người quen và giữ an toàn.',
        'Dùng thời gian chờ để chuẩn bị giấy tờ cho thật đủ.']
    }
  },
  suc_khoe: {
    canCu: 'Việc sức khỏe xét Ngũ Phúc (sự che chở) và các thần gây trở ngại đứng cạnh sức chính của bạn; đây là tín hiệu về nhịp sống, không phải kết luận về bệnh.',
    manh: 'Bạn biết lắng nghe cơ thể khi chịu chậm lại.',
    vuong: 'Nhịp làm việc đang nhiều hơn nhịp nghỉ.',
    hoTro: 'Bác sĩ hoặc người có chuyên môn y tế là người nên hỏi ý kiến trước tiên; người thân giúp bạn giữ nhịp ăn ngủ.',
    thuan: {
      mo: ['Bạn đang ở thế có thể chủ động chăm sóc bản thân. Cơ thể có sức hồi lại tốt, nên đây là lúc hợp để bắt đầu một thói quen lành mạnh vừa sức. Cái giá: thấy khỏe dễ làm quá sức, bỏ nhịp nghỉ.',
        'Nhịp sống của bạn lúc này có xu hướng thuận. Những thay đổi nhỏ trong ăn ngủ dễ thấy tác dụng. Cái giá: thấy khỏe dễ làm quá sức, bỏ nhịp nghỉ.'],
      dien: 'Diễn biến dễ gặp: tinh thần nhẹ hơn sau vài ngày giữ nhịp đều.',
      viec: ['Bắt đầu một buổi vận động nhẹ mỗi ngày, vừa sức.',
        'Nếu có điều muốn hỏi, đặt lịch khám hoặc hỏi bác sĩ; đây là lúc thuận để trao đổi kỹ.',
        'Giữ giờ ngủ đều trong vài ngày tới và uống đủ nước.']
    },
    thuan_dk: {
      mo: ['Bạn đang ở thế giữ được sức, với điều kiện cân lại giờ làm và giờ nghỉ. Cố thêm lúc này dễ khiến bạn mệt lâu hơn.',
        'Nhịp sống của bạn có xu hướng ổn nếu bạn chịu chậm lại một chút. Sức có, nhưng đang bị tiêu hao vì làm nhiều hơn nghỉ.'],
      dien: 'Diễn biến dễ gặp: có ngày thấy khỏe, có ngày uể oải; đó là lúc cơ thể nhắc bạn nghỉ.',
      viec: ['Bớt một việc không gấp trong tuần để có một khoảng nghỉ thật sự.',
        'Nếu có điều lo lắng, hẹn bác sĩ; ghi sẵn những gì bạn cảm thấy để trao đổi.',
        'Đi bộ nhẹ kết hợp hít thở chậm vào cuối ngày.']
    },
    nen_cho: {
      mo: ['Bạn đang ở thế nên giữ sức và lắng nghe cơ thể. Cố thêm lúc này dễ mệt kéo dài, sức đề kháng giảm.',
        'Giai đoạn này cơ thể bạn có xu hướng cần được nghỉ nhiều hơn là cố thêm. Kế hoạch tập nặng hay thức khuya để kịp việc nên tạm lùi lại.'],
      dien: 'Diễn biến dễ gặp: dễ thấy mệt nếu ép mình; vài ngày sau nhịp sống dễ cân lại.',
      viec: ['Đi ngủ trước 23 giờ và giảm cà phê buổi chiều trong mấy ngày tới.',
        'Nếu có điều lo lắng, đặt lịch khám sớm; đừng chờ nếu thấy khó chịu nhiều.',
        'Đi bộ nhẹ mỗi ngày để lấy lại nhịp.']
    }
  },
  kien_tung: {
    canCu: 'Việc tranh chấp, hợp đồng xét thế Chủ – Khách (bên nào nắm thế) là chính, và Trực Phù (thần của giấy tờ, phép tắc) có chắn sức của bạn hay không.',
    manh: 'Bạn có lý lẽ và giữ được bình tĩnh.',
    vuong: 'Bằng chứng còn rời rạc, chưa xếp thành một mạch rõ ràng.',
    hoTro: 'Luật sư hoặc người am hiểu pháp lý là người nên hỏi trước mọi bước quan trọng.',
    thuan: {
      mo: ['Bạn đang ở thế nắm phần chủ động trong việc tranh chấp hay hợp đồng. Đây là lúc hợp để đưa ra giấy tờ, bằng chứng và đề nghị một cách bình tĩnh. Cái giá: thấy mình có lý dễ cứng giọng, làm bên kia phản ứng mạnh hơn.',
        'Việc tranh chấp hay hợp đồng bạn hỏi có xu hướng nghiêng về phía có lý lẽ rõ ràng, và lúc này lý lẽ của bạn dễ được lắng nghe. Cái giá: thấy mình có lý dễ cứng giọng, làm bên kia phản ứng mạnh hơn.'],
      dien: 'Diễn biến dễ gặp: bên kia chịu ngồi lại nói chuyện sớm hơn bạn nghĩ.',
      viec: ['Xếp giấy tờ, tin nhắn, hóa đơn theo thứ tự thời gian, rồi mang đi hỏi luật sư.',
        'Đưa ra đề nghị bằng văn bản, lời lẽ ôn hòa.',
        'Giữ mọi trao đổi tiếp theo bằng văn bản.']
    },
    thuan_dk: {
      mo: ['Bạn đang ở thế có thể đi tiếp, với điều kiện ưu tiên dàn xếp trước khi đưa ra cơ quan giải quyết.',
        'Việc tranh chấp hay hợp đồng có xu hướng thuận nếu bạn đủ bằng chứng và chịu nhường ở chỗ không quan trọng. Lý có, nhưng còn một điểm bên kia có thể bắt bẻ.'],
      dien: 'Diễn biến dễ gặp: việc kéo thêm một vòng, có lúc tưởng bế tắc rồi lại mở.',
      viec: ['Hỏi luật sư về điểm yếu nhất trong hồ sơ của bạn.',
        'Chuẩn bị một phương án dàn xếp, ghi rõ mức bạn chấp nhận được.',
        'Không ký thêm giấy tờ nào khi chưa đọc kỹ.']
    },
    nen_cho: {
      mo: ['Bạn đang ở thế nên củng cố trước khi hành động. Chưa nên ký, chưa nên khởi kiện hay đáp trả gay gắt trong lúc này.',
        'Việc tranh chấp hay hợp đồng lúc này có xu hướng nên chờ. Đẩy mạnh bây giờ dễ làm việc căng thêm, và bạn dễ bị bắt bẻ ở chỗ chưa chuẩn bị.'],
      dien: 'Diễn biến dễ gặp: bên kia có thể đổi ý hoặc đưa thêm yêu cầu; vài ngày sau tình hình rõ hơn.',
      viec: ['Hỏi luật sư ngay về các hạn thời gian pháp lý bạn cần giữ; chờ không có nghĩa là để lỡ hạn.',
        'Gom đủ bằng chứng, ghi lại sự việc theo ngày.',
        'Khi thế đổi, mở lời trao đổi bằng văn bản và lời lẽ ôn hòa.']
    }
  },
  thi_cu: {
    canCu: 'Việc thi cử, hồ sơ xét Văn Xương (con mắt của phía giữ thế, cũng chủ sự sáng suốt, học hành); các thế giam, ép sát, đối mặt được tính nặng hơn.',
    manh: 'Bạn đã có nền kiến thức; điều cần là trình bày cho gọn.',
    vuong: 'Một chi tiết nhỏ trong giấy tờ hoặc bài làm dễ bị sót.',
    hoTro: 'Thầy cô, người hướng dẫn, hoặc người đã làm qua đúng thủ tục này là người nên hỏi.',
    thuan: {
      mo: ['Bạn đang ở thế thuận cho việc thi cử hay hồ sơ. Bạn đã có nền, và lúc này cách bạn trình bày dễ được đánh giá đúng. Cái giá: dễ chủ quan, ôn lơi tay hoặc sót chi tiết nhỏ.',
        'Việc thi cử hay hồ sơ bạn hỏi có xu hướng thuận. Bạn thuộc mẫu người làm bài tốt khi bình tĩnh, và thế đang ủng hộ sự bình tĩnh đó. Cái giá: dễ chủ quan, ôn lơi tay hoặc sót chi tiết nhỏ.'],
      dien: 'Diễn biến dễ gặp: kết quả hoặc phản hồi về đúng hẹn, có khi sớm hơn.',
      viec: ['Nộp hồ sơ sớm, hoặc ôn phần khó nhất trước.',
        'Đọc lại đề hoặc giấy tờ hai lần, đánh dấu chỗ hay nhầm.',
        'Ngủ đủ đêm trước ngày quan trọng; buổi ôn cuối nhẹ nhàng.']
    },
    thuan_dk: {
      mo: ['Bạn đang ở thế có thể đạt, với điều kiện ôn đúng phần trọng tâm thay vì ôn tràn lan.',
        'Việc thi cử hay hồ sơ có xu hướng thuận nếu bạn rà kỹ những chi tiết nhỏ. Nền tảng có, nhưng một sai sót nhỏ trong giấy tờ có thể làm chậm cả việc.'],
      dien: 'Diễn biến dễ gặp: được yêu cầu bổ sung giấy tờ hoặc làm thêm một bước.',
      viec: ['Lập danh sách giấy tờ cần nộp và kiểm từng mục.',
        'Nhờ một người đã làm qua việc này xem giúp.',
        'Ôn ba phần trọng tâm, bớt phần phụ.']
    },
    nen_cho: {
      mo: ['Bạn đang ở thế nên tích lũy thêm trước khi nộp hay đăng ký. Nộp lúc này dễ hụt ở đúng phần bạn còn yếu.',
        'Việc thi cử hay hồ sơ lúc này có xu hướng nên chờ thêm. Phần chuẩn bị hoặc thủ tục chưa đủ chín; nộp vội dễ bị trả lại hoặc kết quả kém hơn sức mình.'],
      dien: 'Diễn biến dễ gặp: thủ tục chậm hoặc cần sửa lại; vài ngày sau việc thông hơn.',
      viec: ['Nếu hạn còn cho phép, nộp muộn hơn một chút để bổ sung giấy tờ còn thiếu. Nếu ngày thi đã cố định, cứ đi thi và giữ tâm thế bình tĩnh.',
        'Mỗi ngày ôn một phần nhỏ thay vì dồn sức một lần.',
        'Hỏi thầy cô hoặc người hướng dẫn về phần bạn còn lo nhất.']
    }
  }
};
var TAV_LOAI_BI_DANH_ = { cong: 'cong_viec', xin_viec: 'cong_viec', tien: 'tai_loc', tien_bac: 'tai_loc', mua_ban: 'tai_loc', hop_tac: 'tai_loc',
  tinh: 'tinh_cam', di: 'di_xa', xuat_hanh: 'di_xa', chuyen_nha: 'di_xa', thi: 'thi_cu', giay_to: 'thi_cu', suc: 'suc_khoe', kien: 'kien_tung', hop_dong: 'kien_tung' };

/* ---------- Tiện ích ---------- */
function tavHoa_(s) { s = String(s || ''); return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
/** Nối danh sách kiểu tiếng Việt: "a, b và c" (bỏ phần tử rỗng, bỏ trùng) */
function tavDs_(a) {
  var ds = [];
  (a || []).forEach(function (x) { if (x && ds.indexOf(x) < 0) ds.push(x); });
  if (!ds.length) return '';
  if (ds.length === 1) return ds[0];
  return ds.slice(0, -1).join(', ') + ' và ' + ds[ds.length - 1];
}
function tavThay_(s, o) {
  for (var k in o) if (o.hasOwnProperty(k)) s = s.split('{' + k + '}').join(o[k]);
  return s;
}
/** Tên + nghĩa một thần cho phần Căn cứ */
function tavThanCC_(ma) {
  var t = (typeof TA_THAN !== 'undefined' && TA_THAN[ma]) || null;
  return t ? t.ten + ' (' + t.giai + ')' : ma;
}
function tavThanTen_(ma) {
  var t = (typeof TA_THAN !== 'undefined' && TA_THAN[ma]) || null;
  return t ? t.ten : ma;
}
/** Tên + nghĩa một cách cho phần Căn cứ */
function tavCachCC_(ma) {
  var c = (typeof TA_CACH !== 'undefined' && TA_CACH[ma]) || null;
  return c ? c.ten + ' (' + c.giai + ')' : ma;
}
/** Diễn giải "mảng đời" của một mã cung mệnh */
function tavDeHieu_(ma) {
  if (typeof TA_CUNG12 !== 'undefined') for (var i = 0; i < TA_CUNG12.length; i++) if (TA_CUNG12[i].ma === ma) return TA_CUNG12[i].de;
  return ma;
}
function tavTenCung_(ma) {
  if (typeof TA_CUNG12 !== 'undefined') for (var i = 0; i < TA_CUNG12.length; i++) if (TA_CUNG12[i].ma === ma) return TA_CUNG12[i].ten;
  return ma;
}
/** Các cách "cấu trúc" của bàn (bỏ các loại con số toán), theo thứ tự ưu tiên; ben: lọc theo phía (tùy chọn) */
function tavCachCauTruc_(dsCach, ben) {
  var co = {};
  (dsCach || []).forEach(function (c) {
    var ma = typeof c === 'string' ? c : c.ma, b = typeof c === 'string' ? null : c.ben;
    if (!TAV_CACH_DE_[ma]) return;
    if (ben && b && ben.indexOf(b) < 0) return;
    co[ma] = c;
  });
  var kq = [];
  TAV_CACH_THU_TU_.forEach(function (ma) { if (co[ma]) kq.push(ma); });
  return kq;
}
/** Câu đời thường cho thế nghiêng theo vai, không mâu thuẫn với mức kết luận */
function tavTheVai_(vai, l, muc) {
  var ben = vai === 'chu' ? 'Bạn ở vai người đang giữ (bên có sẵn vị trí, bên được đề nghị)' : 'Bạn ở vai người chủ động (bên mở lời, bên đến đề nghị)';
  var s;
  if (l > 0 && muc === 'nen_cho') s = ', và thế chung có phần nghiêng về phía bạn, nhưng riêng việc này còn vướng vài điểm nên chưa vội được.';
  else if (l >= 2) s = ', và thế chung nghiêng rõ về phía bạn.';
  else if (l === 1) s = ', và thế chung hơi nghiêng về phía bạn.';
  else if (l === 0) s = '; hai phía đang ngang nhau, chưa bên nào trội.';
  else if (muc === 'thuan') s = '; thế chung hơi nghiêng về bên kia, nhưng những điểm riêng của việc này đang bù lại cho bạn.';
  else if (l === -1) s = '; thế chung hơi nghiêng về bên kia, nên bạn cần chuẩn bị kỹ hơn.';
  else s = '; thế chung nghiêng rõ về bên kia, nên lúc này tính kỹ lợi hơn làm vội.';
  return ben + s;
}
/** Nhóm của thế nghiêng: chu | khach | giang_co */
function tavNhomNghieng_(ng) {
  if (ng === 'chu' || ng === 'chu_ro') return 'chu';
  if (ng === 'khach' || ng === 'khach_ro') return 'khach';
  return 'giang_co';
}
/** Dòng Căn cứ về ba con số toán */
function tavToanCC_(ban) {
  var t = ban.toan || {}, ss = ban.soSanh || {};
  return 'Chủ toán (sức của phía giữ thế) ' + (t.chu ? t.chu.so : '?') + ', Khách toán (sức của phía chủ động) ' + (t.khach ? t.khach.so : '?') +
    ', Định toán (kết cục chung) ' + (t.dinh ? t.dinh.so : '?') + (ss.nghiengTen ? ' – ' + ss.nghiengTen + '.' : '.');
}
/** Dòng Căn cứ về bàn và Thái Ất */
function tavBanCC_(ban) {
  var ta = ban.thaiAt || {};
  return (ban.keTen ? ban.keTen + ' (' + (ban.keGiai || '') + '), ' : '') + (ban.cucTen || '') +
    '; Thái Ất (thần chủ của bàn, tượng người đứng đầu) ở cung ' + (ta.cungTen || '?') + ' (' + (ta.huong || '') + ')' +
    (ta.namThu ? ', bước thứ ' + ta.namThu + ' trong 3 bước ở cung này' : '') + (ta.pheGiai ? '; ' + ta.pheGiai : '') + '.';
}

/* ============================================================
 * 1. MỆNH PHÁP
 * ============================================================ */
/**
 * menh: kết quả taMenh_.
 * Trả về { doTinCay, theBamSinh, cungTot[], cungXau[], tomTat, chiTiet: [12 × {cung, tieuDe, danhGia, van}], loiKhuyen[], canCu[], luuY }.
 */
function taVanMenh_(menh) {
  menh = menh || {};
  var c12 = menh.cung12 || [], the = (menh.theBamSinh && TAV_THE_[menh.theBamSinh.ma]) ? menh.theBamSinh.ma : 'can_bang';
  var T = TAV_THE_[the], banNam = menh.banNam || {};
  var cungMenh = c12[0] || { danhGia: 'tron' };
  var tot = [], xau = [];
  c12.forEach(function (c) { if (c.ma === 'menh') return; if (c.danhGia === 'tot') tot.push(c); else if (c.danhGia === 'xau') xau.push(c); });
  var cachMenh = tavCachCauTruc_(banNam.cach || menh.cachNamSinh, null);
  var cachHung = cachMenh.filter(function (m) { return m !== 'hoa_thuan' && m !== 'tuong_giua'; });

  // --- Tóm tắt miễn phí (tầng 1) ---
  var tom = [T.tom, TAV_MENH_TOM_[cungMenh.danhGia] || TAV_MENH_TOM_.tron];
  if (tot.length) tom.push('Những mảng đời có xu hướng thuận với bạn: ' + tavDs_(tot.slice(0, 3).map(function (c) { return c.deHieu; })) + '.');
  if (xau.length) tom.push('Mảng dễ vướng hơn: ' + tavDs_(xau.slice(0, 2).map(function (c) { return c.deHieu; })) + '.');
  if (cachHung.length) tom.push('Trong đời, ' + TAV_CACH_DE_[cachHung[0]].menh + '.');
  else if (cachMenh.indexOf('hoa_thuan') >= 0) tom.push('Nhìn chung, ' + TAV_CACH_DE_.hoa_thuan.menh + '.');

  // --- 12 cung (trả phí) ---
  var chiTiet = c12.map(function (c) {
    var B = TAV_CUNG_[c.ma] || { tot: '', xau: '', tron: '', khuyen: '' };
    var p = [B[c.danhGia] || B.tron];
    var giup = (c.cat || []).map(function (ma) { return TAV_THAN_DE_[ma] && TAV_THAN_DE_[ma].giup; });
    var vuong = (c.hung || []).map(function (ma) { return TAV_THAN_DE_[ma] && TAV_THAN_DE_[ma].vuong; });
    if (tavDs_(giup)) p.push('Ở mảng này bạn ' + tavDs_(giup) + '.');
    if (tavDs_(vuong)) p.push((c.danhGia === 'tot' ? 'Mặt trái cần biết: ở mảng này ' : 'Điều cần để ý: ở mảng này ') + tavDs_(vuong) + '.');
    var daTrung = 0;
    (c.than || []).forEach(function (ma) {
      if (daTrung < 1 && TAV_THAN_DE_[ma] && TAV_THAN_DE_[ma].trung) { p.push(TAV_THAN_DE_[ma].trung); daTrung++; }
    });
    if (c.laThan) p.push('Đây cũng là cung Thân, tức mảng đời bạn có xu hướng dồn sức nhiều hơn khi đã trưởng thành.');
    if (c.ma === 'menh') p.push('Về thế bẩm sinh, ' + T.ten.replace(/^người/, 'bạn là người') + ', nên ' + (the === 'giu_xay' ? 'nền chắc là điều kiện để bạn phát huy.' : the === 'xong_pha' ? 'cơ hội thường mở ra khi bạn bước tới trước.' : 'bạn hợp đổi vai theo từng việc.'));
    p.push(B.khuyen);
    return { cung: c.ma, tieuDe: c.ten + ' – ' + c.deHieu, danhGia: c.danhGia, van: p.join(' ') };
  });

  // --- Lời khuyên (tầng 2) ---
  var loiKhuyen = [T.khuyen];
  xau.slice(0, 2).forEach(function (c) { if (TAV_CUNG_[c.ma]) loiKhuyen.push('Với chuyện ' + c.deHieu + ': ' + String(TAV_CUNG_[c.ma].khuyen).replace(/^Gợi ý:\s*/, '')); });
  cachHung.slice(0, 2).forEach(function (m) { loiKhuyen.push(TAV_CACH_DE_[m].khuyen); });
  var chuLoai = (banNam.toan && banNam.toan.chu && banNam.toan.chu.loai) || [];
  if (chuLoai.indexOf('vo_dia') >= 0) loiKhuyen.push('Hãy xây nền trước khi tăng tốc: một khoản tiết kiệm, một kỹ năng chắc tay, giấy tờ gọn gàng; thiếu nền mà tăng tốc thì dễ hụt hơi giữa chừng.');
  else if (chuLoai.indexOf('toan_doan') >= 0) loiKhuyen.push('Bạn hợp những việc làm nhanh gọn, thấy kết quả sớm; với việc dài hơi, hãy chia thành từng chặng ngắn để giữ đà.');
  else if (chuLoai.indexOf('tam_tai') >= 0) loiKhuyen.push('Bạn có đủ điều kiện để đi đường dài; mặt trái là những năm đầu thường chậm, dễ nản.');
  loiKhuyen.push('Những điều trên là xu hướng, không phải định mệnh: cách bạn chọn và cách bạn sống mỗi ngày mới là điều quyết định.');

  // --- Căn cứ (được nêu thuật ngữ, kèm nghĩa) ---
  var canCu = [];
  canCu.push('Phép: ' + (menh.phep || 'Thái Ất nhân đạo mệnh pháp') + ' – cách xem đời người của môn Thái Ất.');
  if (menh.canChi) canCu.push('Tứ trụ (bốn cặp can chi của năm, tháng, ngày, giờ sinh): ' + menh.canChi.nam + ', ' + menh.canChi.thang + ', ' + menh.canChi.ngay + ', ' + menh.canChi.gio + '.');
  canCu.push('Năm sinh ' + (menh.namAmDuong === 'duong' ? 'dương' : 'âm') + ', ' + (menh.gioiTinh === 'nu' ? 'nữ' : 'nam') + ' → 12 cung xếp theo chiều ' + (menh.chieu === 'thuan' ? 'thuận' : 'nghịch') + '.');
  if (menh.menh && menh.thanCung) canCu.push('Cung Mệnh (bản thân) ở ô ' + menh.menh.chiTen + '; cung Thân (mảng đời dồn sức về sau) ở ô ' + menh.thanCung.chiTen + ', trùng cung ' + menh.thanCung.cungTen + '.');
  if (banNam.toan) canCu.push('Bàn năm sinh (Tuế kế – bàn theo năm): ' + (banNam.cucTen || '') + '. ' + tavToanCC_(banNam) + (menh.theBamSinh ? ' Thế bẩm sinh: ' + menh.theBamSinh.giai + '.' : ''));
  if (cachMenh.length) canCu.push('Cách của bàn năm sinh: ' + cachMenh.map(tavCachCC_).join('; ') + '.');
  if (chuLoai.length) canCu.push('Chủ toán năm sinh thuộc loại: ' + chuLoai.map(tavCachCC_).join('; ') + '.');
  var gap = [];
  c12.forEach(function (c) {
    if (!c.than || !c.than.length) return;
    canCu.push('Cung ' + c.ten + ' (' + c.deHieu + ', ô ' + c.chiTen + '): ' + c.than.map(tavThanTen_).join(', ') + '.');
    c.than.forEach(function (ma) { if (gap.indexOf(ma) < 0) gap.push(ma); });
  });
  if (gap.length) canCu.push('Nghĩa các thần (đặt lên 12 cung bằng bàn Thời kế – bàn theo giờ sinh): ' + gap.map(tavThanCC_).join('; ') + '.');

  return {
    doTinCay: menh.doTinCay || 'thap', theBamSinh: the,
    cungTot: tot.map(function (c) { return c.ma; }), cungXau: xau.map(function (c) { return c.ma; }),
    tomTat: tom.join(' '), chiTiet: chiTiet, loiKhuyen: loiKhuyen, canCu: canCu, luuY: TAV_LUU_Y_MENH_
  };
}

/* ============================================================
 * 2. VẬN NĂM CÁ NHÂN (cách ghép của Thiên Cơ Các)
 * ============================================================ */
/**
 * nam: kết quả taNamCaNhan_.
 * Trả về { namXem, muc, mucTen, heLo, van (đoạn cách dòng trống), doan[], viec[3], canCu[], ghiChu }.
 */
function taVanNam_(nam) {
  nam = nam || {};
  var ban = nam.ban || {}, menh = nam.menh || {}, dg = nam.danhGia || {};
  var muc = (dg.muc === 'thuan' || dg.muc === 'nen_cho') ? dg.muc : 'thuan_dk';
  var Y = nam.namXem || ban.namTiet || '';
  var the = (menh.theBamSinh && TAV_THE_[menh.theBamSinh.ma]) ? menh.theBamSinh.ma : 'can_bang';
  var ng = (ban.soSanh && ban.soSanh.nghieng) || 'giang_co', nhom = tavNhomNghieng_(ng);
  var vao = nam.thanVaoCung || [];
  var phuc = nam.cungDuocPhuc || [], can = nam.cungBiCan || [];

  // Gom thần lành / cản theo cung
  var giupTheoCung = {}, vuongTheoCung = {};
  vao.forEach(function (x) {
    var D = TAV_THAN_DE_[x.than];
    if (!D) return;
    if (x.loai === 'cat' && D.giup) (giupTheoCung[x.cung] = giupTheoCung[x.cung] || []).push(D.giup);
    if (x.loai === 'hung' && D.vuong) (vuongTheoCung[x.cung] = vuongTheoCung[x.cung] || []).push(D.vuong);
  });
  // Ưu tiên cung có phúc lớn khi nói mảng được nâng đỡ
  var npVao = vao.filter(function (x) { return x.than === 'ngu_phuc'; })[0];
  var phucThuTu = phuc.slice();
  if (npVao && phucThuTu.indexOf(npVao.cung) > 0) { phucThuTu.splice(phucThuTu.indexOf(npVao.cung), 1); phucThuTu.unshift(npVao.cung); }
  var chiPhuc = phucThuTu.filter(function (m) { return can.indexOf(m) < 0; }), chiCan = can.filter(function (m) { return phuc.indexOf(m) < 0; });
  var caHai = phuc.filter(function (m) { return can.indexOf(m) >= 0; });
  var phucChinh = (chiPhuc[0] || phucThuTu[0]) ? tavDeHieu_(chiPhuc[0] || phucThuTu[0]) : 'việc bạn coi trọng nhất';

  // --- Hé lộ (miễn phí) ---
  var heLo = 'Năm ' + Y + ' với bạn: ' + TAV_NAM_HELO_[muc] + '.';
  if (chiPhuc.length) heLo += ' Mảng có xu hướng được nâng đỡ rõ nhất: ' + tavDeHieu_(chiPhuc[0]) + '.';
  else if (muc === 'nen_cho') heLo += ' Đây là năm để làm chắc nền hơn là mở rộng.';

  // --- Đoạn văn (trả phí) ---
  var doan = [];
  var p1 = 'Năm ' + Y + (nam.namCanChi ? ' (' + nam.namCanChi + ')' : '') + (nam.tuoi ? ', bạn bước vào tuổi ' + nam.tuoi + ' (tính theo tuổi mụ)' : '') + '. ' + TAV_NAM_NGHIENG_[ng];
  if (nhom === 'giang_co' || the === 'can_bang') p1 += ' Bạn vốn cân bằng giữa giữ và tiến, nên dễ điều chỉnh theo nhịp năm.';
  else if ((nhom === 'chu' && the === 'giu_xay') || (nhom === 'khach' && the === 'xong_pha')) p1 += ' Điều này hợp với thế bẩm sinh của bạn, ' + TAV_THE_[the].ten + ', nên năm này bạn dễ thấy mình đứng đúng chỗ.';
  else if (the === 'giu_xay') p1 += ' Với ' + TAV_THE_[the].ten + ' như bạn, đây là năm cần linh hoạt hơn thường lệ: mở lòng với cái mới, nhưng vẫn giữ nền.';
  else p1 += ' Với ' + TAV_THE_[the].ten + ' như bạn, đây là năm cần kiên nhẫn hơn thường lệ: làm chắc phần đang có trước khi bước tiếp.';
  doan.push(p1);

  var p2;
  if (chiPhuc.length || caHai.length) {
    var ds2 = chiPhuc.concat(caHai).slice(0, 3).map(function (m) {
      var g = tavDs_(giupTheoCung[m] || []);
      return 'chuyện ' + tavDeHieu_(m) + (g ? ': bạn ' + g : '');
    });
    p2 = 'Những mảng đời có xu hướng được nâng đỡ trong năm: ' + ds2.join('; ') + '.';
    if (npVao && chiPhuc.indexOf(npVao.cung) >= 0) p2 += ' Mảng ' + tavDeHieu_(npVao.cung) + ' là nơi đáng dồn công sức nhất, vì sự che chở ở đó lớn hơn cả.';
    else p2 += ' Đây là những chỗ đáng dồn công sức, vì công bỏ ra dễ thấy kết quả.';
  } else {
    p2 = 'Năm nay không có mảng đời nào được nâng đỡ nổi bật; thành quả chủ yếu đến từ chính sức bạn bỏ ra, ít được ai đỡ, nên năm dễ thấy vất vả hơn công sức.';
  }
  doan.push(p2);

  var p3;
  if (chiCan.length || caHai.length) {
    var ds3 = chiCan.concat(caHai).slice(0, 3).map(function (m) {
      var v = tavDs_((vuongTheoCung[m] || []).slice(0, 2));
      return 'ở chuyện ' + tavDeHieu_(m) + (v ? ' ' + v : ' có chỗ vướng nhỏ');
    });
    p3 = 'Chỗ cần đi chậm trong năm: ' + ds3.join('; ') + '.';
    if (caHai.length) p3 += ' Riêng chuyện ' + tavDeHieu_(caHai[0]) + ' vừa có lực nâng vừa có lực cản, nên được hay không phụ nhiều vào sự chuẩn bị của bạn.';
    p3 += ' Ở những chỗ này dễ chậm việc, hao tiền hoặc va chạm nếu đi vội. Gợi ý: có phương án dự phòng.';
  } else {
    p3 = 'Không có mảng đời nào bị cản rõ trong năm; mặt trái của năm êm là dễ chủ quan, để việc nhỏ thành lớn.';
  }
  doan.push(p3);

  var menhGiup = [], menhVuong = [];
  (nam.menhGap || []).forEach(function (ma) {
    var D = TAV_THAN_DE_[ma]; if (!D) return;
    if (D.giup) menhGiup.push(D.giup); if (D.vuong) menhVuong.push(D.vuong);
  });
  var p4;
  if (menhGiup.length && menhVuong.length) p4 = 'Riêng phần bản thân, năm này bạn ' + tavDs_(menhGiup) + ', nhưng cũng ' + tavDs_(menhVuong) + '. Gợi ý: quyết định chậm một nhịp.';
  else if (menhGiup.length) p4 = 'Riêng phần bản thân, năm này bạn ' + tavDs_(menhGiup) + '. Mặt trái: dễ tự tin quá mức, quyết nhanh mà thiếu kiểm tra.';
  else if (menhVuong.length) p4 = 'Riêng phần bản thân, năm này ' + tavDs_(menhVuong) + '. Bạn dễ mệt, nặng lòng và quyết sai khi ôm việc. Gợi ý: bớt ôm việc, giữ nhịp ăn ngủ đều.';
  else p4 = 'Phần bản thân năm này khá yên: không có lực nâng hay lực cản lớn chạm thẳng vào bạn, nên năm đi đúng theo sức bạn bỏ ra.';
  var thanCung = menh.thanCung && menh.thanCung.cung;
  if (thanCung && thanCung !== 'menh' && (nam.thanCungGap || []).length) {
    var tg = [], tv = [];
    nam.thanCungGap.forEach(function (ma) { var D = TAV_THAN_DE_[ma]; if (!D) return; if (D.giup) tg.push(D.giup); if (D.vuong) tv.push(D.vuong); });
    if (tg.length) p4 += ' Ở mảng ' + tavDeHieu_(thanCung) + ', nơi bạn dồn sức về lâu dài, năm này bạn ' + tavDs_(tg) + '.';
    else if (tv.length) p4 += ' Ở mảng ' + tavDeHieu_(thanCung) + ', nơi bạn dồn sức về lâu dài, năm này ' + tavDs_(tv) + ', nên đi từng bước.';
  }
  doan.push(p4);

  var cachNam = tavCachCauTruc_(ban.cach, ['chu', 'chung']).filter(function (m) { return m !== 'hoa_thuan'; });
  var p5 = TAV_NAM_KET_[muc];
  if (cachNam.length) p5 += ' Không khí chung của năm còn một điểm: ' + TAV_CACH_DE_[cachNam[0]].de + '. ' + TAV_CACH_DE_[cachNam[0]].khuyen;
  else if (tavCachCauTruc_(ban.cach).indexOf('hoa_thuan') >= 0) p5 += ' Không khí chung của năm khá hòa thuận; ' + TAV_CACH_DE_.hoa_thuan.khuyen.charAt(0).toLowerCase() + TAV_CACH_DE_.hoa_thuan.khuyen.slice(1);
  doan.push(p5);

  // --- 3 việc ---
  var viec = [tavThay_(TAV_NAM_VIEC1_[muc], { phuc: phucChinh })];
  var canChinh = chiCan[0] || caHai[0];
  viec.push(canChinh ? 'Ở chuyện ' + tavDeHieu_(canChinh) + ', đi chậm và có kế hoạch dự phòng; việc gì quan trọng thì ghi rõ trên giấy.' :
    'Giữ một khoản dự phòng đủ vài tháng chi tiêu, để những thay đổi nhỏ trong năm không làm bạn chao đảo.');
  viec.push(TAV_THE_[the].viec);

  // --- Căn cứ ---
  var canCu = ['Vận năm theo cách ghép của Thiên Cơ Các: bàn năm (Tuế kế) đặt lên 12 cung của lá mệnh Thái Ất, xem thần lành, thần cản của năm rơi vào cung nào.'];
  canCu.push('Bàn năm ' + Y + (nam.namCanChi ? ' (' + nam.namCanChi + ')' : '') + ': ' + tavBanCC_(ban));
  if (ban.toan) canCu.push(tavToanCC_(ban));
  vao.filter(function (x) { return x.loai === 'cat' || x.loai === 'hung'; }).slice(0, 10).forEach(function (x) {
    canCu.push(tavThanCC_(x.than) + ' rơi vào cung ' + x.cungTen + ' (' + tavDeHieu_(x.cung) + ', ô ' + x.chiTen + ').');
  });
  if (cachNam.length) canCu.push('Cách của bàn năm chạm phía giữ thế: ' + cachNam.map(tavCachCC_).join('; ') + '.');
  canCu.push('Mức chấm chung của năm, xét ở vai người giữ thế: ' + (dg.mucTen || (typeof TA_MUC !== 'undefined' ? TA_MUC[muc].ten : muc)) + '.');
  if (menh.theBamSinh) canCu.push('Thế bẩm sinh (từ bàn năm sinh): ' + menh.theBamSinh.giai + '.');

  return { namXem: Y, muc: muc, mucTen: dg.mucTen || '', heLo: heLo, van: doan.join('\n\n'), doan: doan, viec: viec, canCu: canCu, ghiChu: TAV_GHI_CHU_NAM_ };
}

/* ============================================================
 * 3. THỜI CUỘC CHUNG (miễn phí; không quốc gia, lãnh đạo, thiên tai, chiến sự, dịch bệnh)
 * ============================================================ */
/**
 * ban: taLap_({ke:'nam', year}) hoặc taLap_({ke:'thang', ...}).
 * Trả về { ke, nghieng, tieuDe, van (đoạn cách dòng trống), doan[], canCu[], luuY }.
 */
function taVanThoiCuoc_(ban) {
  ban = ban || {};
  var laThang = ban.ke === 'thang';
  var ky = laThang ? 'tháng này' : 'năm ' + (ban.namTiet || '');
  var tieuDe = laThang ?
    'Khí thế tháng ' + (ban.thangTiet || '') + ' theo tiết' + (ban.thangChi ? ' (tháng ' + ban.thangChi + ')' : '') + ' năm ' + (ban.namTiet || '') :
    'Khí thế năm ' + (ban.namTiet || '') + (ban.namCanChi ? ' (' + ban.namCanChi + ')' : '');
  var ng = (ban.soSanh && ban.soSanh.nghieng) || 'giang_co', nhom = tavNhomNghieng_(ng);
  var dg = null;
  try { if (typeof taDanhGia_ === 'function' && ban.cach) dg = taDanhGia_(ban, 'chung', 'chu'); } catch (e) { dg = null; }
  var muc = dg && (dg.muc === 'thuan' || dg.muc === 'nen_cho') ? dg.muc : 'thuan_dk';

  var doan = [];
  doan.push(tavThay_(TAV_TC_NGHIENG_[ng], { ky: ky }));

  var cach = tavCachCauTruc_(ban.cach);
  var hung = cach.filter(function (m) { return m !== 'hoa_thuan'; });
  if (hung.length) {
    var xh = hung.slice(0, 2).map(function (m) { return TAV_CACH_DE_[m].xh; });
    doan.push('Trong đời sống chung, ' + tavDs_(xh) + '. ' + TAV_CACH_DE_[hung[0]].khuyen);
  } else if (cach.indexOf('hoa_thuan') >= 0) {
    doan.push('Trong đời sống chung, ' + TAV_CACH_DE_.hoa_thuan.xh + '. ' + TAV_CACH_DE_.hoa_thuan.khuyen);
  }

  var loaiDinh = (ban.toan && ban.toan.dinh && ban.toan.dinh.loai) || [], cauToan = '';
  for (var i = 0; i < TAV_TC_TOAN_THU_TU_.length && !cauToan; i++) {
    var k = TAV_TC_TOAN_THU_TU_[i];
    if (k === 'hoa') { if (loaiDinh.some(function (x) { return /_hoa$/.test(x); })) cauToan = TAV_TC_TOAN_.hoa; }
    else if (loaiDinh.indexOf(k) >= 0) cauToan = TAV_TC_TOAN_[k];
  }
  doan.push((cauToan ? cauToan + ' ' : '') + TAV_TC_TAM_LY_[muc]);
  doan.push(TAV_TC_UNG_XU_[nhom]);

  var canCu = ['Phép Thái Ất Thống Tông; ranh năm tính từ Lập xuân, tháng tính theo tiết khí, giờ Việt Nam.'];
  canCu.push(tavBanCC_(ban));
  if (ban.toan) canCu.push(tavToanCC_(ban));
  if (cach.length) canCu.push('Cách của bàn: ' + cach.map(tavCachCC_).join('; ') + '.');
  if (loaiDinh.length) canCu.push('Định toán (kết cục chung) thuộc loại: ' + loaiDinh.map(tavCachCC_).join('; ') + '.');
  if (ban.than && ban.than.ngu_phuc) canCu.push(tavThanCC_('ngu_phuc') + ' ở ' + ban.than.ngu_phuc.viTri + '.');
  if (dg) canCu.push('Mức chấm nhịp chung (xét ở vai người giữ thế): ' + dg.mucTen + '.');

  return { ke: laThang ? 'thang' : 'nam', nghieng: ng, tieuDe: tieuDe, van: doan.join('\n\n'), doan: doan, canCu: canCu, luuY: TAV_LUU_Y_THOI_CUOC_ };
}

/* ============================================================
 * 4. HỎI MỘT VIỆC (Thời kế) – cùng khuôn kmVanLuan_
 * ============================================================ */
/** Một mã lý do của taDanhGia_ → { loai: tot|xau|trung, de, nguoi? } (không nêu tên thần) */
function tavLyDe_(k) {
  var m;
  if (k === 'the_ve_ban') return { loai: 'tot', de: 'Thế chung của thời điểm này đang đứng về phía vai bạn chọn, nên công sức bỏ ra dễ thấy kết quả.' };
  if (k === 'the_ve_doi') return { loai: 'xau', de: 'Thế chung đang nghiêng về phía bên kia, nên bạn phải bỏ sức nhiều hơn để được cùng một kết quả.' };
  if (k === 'the_giang_co') return { loai: 'trung', de: 'Hai phía đang ngang sức; sự chuẩn bị sẽ quyết định phần hơn.' };
  if (k === 'hoa_thuan') return { loai: 'tot', de: 'Không có thế đè, ép hay vây nào đáng kể; không khí quanh việc khá êm.' };
  if (k === 'toan_tam_tai') return { loai: 'tot', de: 'Phía bạn đủ cả thời, nền và người, ba thứ cần để việc đi xa.' };
  if (k === 'toan_doan') return { loai: 'xau', de: 'Đà của phía bạn ngắn: làm nhanh gọn thì lợi, kéo dài thì dễ hụt hơi.' };
  if (k === 'dinh_vo_nhan') return { loai: 'xau', de: 'Kết cục của việc còn thiếu người đồng hành; một mình khó chốt được.' };
  if (k === 'tuong_giua') return { loai: 'xau', de: 'Sức chính của phía bạn đang ở thế đứng yên, hợp quan sát hơn ra tay.' };
  if (k === 'can_tro_sat') return { loai: 'xau', de: 'Giấy tờ, thủ tục, phép tắc đang chắn ngay chỗ bạn dồn sức.' };
  if (k === 'can_tro_xa') return { loai: 'tot', de: 'Giấy tờ, thủ tục không chắn đường bạn.' };
  if (k.indexOf('doi_bi_') === 0) return { loai: 'tot', de: 'Bên kia cũng đang có chỗ vướng riêng, nên sức ép lên bạn nhẹ bớt.' };
  if (k.indexOf('hung_than_') === 0) {
    m = k.slice(10);
    return TAV_THAN_DE_[m] && TAV_THAN_DE_[m].vuong ? { loai: 'xau', de: 'Ngay chỗ bạn dồn sức ' + TAV_THAN_DE_[m].vuong + '.' } : null;
  }
  if (k.indexOf('cat_than_') === 0) {
    m = k.slice(9);
    return TAV_THAN_DE_[m] && TAV_THAN_DE_[m].giup ? { loai: 'tot', de: 'Ngay chỗ bạn dồn sức, bạn ' + TAV_THAN_DE_[m].giup + '.', nguoi: TAV_THAN_DE_[m].nguoi } : null;
  }
  if (k.indexOf('dung_bi_ep_') === 0) {
    m = k.slice(11);
    return TAV_DUNG_DE_[m] ? { loai: 'xau', de: tavHoa_(TAV_DUNG_DE_[m]) + ' (điều việc này cần) đang bị đè nén, chưa phát huy được.' } : null;
  }
  if (k.indexOf('dung_vuong_') === 0) {
    m = k.slice(11);
    return TAV_DUNG_DE_[m] ? { loai: 'xau', de: tavHoa_(TAV_DUNG_DE_[m]) + ' (điều việc này cần) đang đứng cạnh một yếu tố cản, dùng được nhưng phải khéo.' } : null;
  }
  if (k.indexOf('dung_tot_') === 0) {
    m = k.slice(9);
    return TAV_DUNG_DE_[m] ? { loai: 'tot', de: tavHoa_(TAV_DUNG_DE_[m]) + ' (điều việc này cần) đang ở chỗ yên, bạn dựa vào được.', nguoi: TAV_THAN_DE_[m] && TAV_THAN_DE_[m].nguoi } : null;
  }
  m = k.split(':')[0];
  if (TAV_CACH_DE_[m]) return { loai: m === 'hoa_thuan' ? 'tot' : 'xau', de: tavHoa_(TAV_CACH_DE_[m].de) + '.' };
  return null;
}

/**
 * Ghép bài "Hỏi một việc theo Thái Ất".
 * ban: taLap_({ke:'gio', ...}); loai: cong_viec|tai_loc|tinh_cam|di_xa|suc_khoe|kien_tung|thi_cu;
 * danhGia: taDanhGia_(ban, loai, vai) – thiếu thì tự chấm với vai Khách.
 * Trả về { loai, muc, mucTen, vai, ketLuan (5 đoạn cách dòng trống), canCu[], viec[3], luuY }.
 */
function taVanHoi_(ban, loai, danhGia) {
  ban = ban || {};
  loai = TAV_LOAI_[loai] ? loai : (TAV_LOAI_BI_DANH_[loai] || 'cong_viec');
  var dg = danhGia;
  if (!dg && typeof taDanhGia_ === 'function' && ban.cach) { try { dg = taDanhGia_(ban, loai, 'khach'); } catch (e) { dg = null; } }
  dg = dg || {};
  var muc = (dg.muc === 'thuan' || dg.muc === 'nen_cho') ? dg.muc : 'thuan_dk';
  var vai = dg.vai === 'chu' ? 'chu' : 'khach';
  var L = TAV_LOAI_[loai], M = L[muc], nhan = TAV_NHAN_[muc];
  var lechVai = ban.soSanh ? (vai === 'chu' ? 1 : -1) * ban.soSanh.lech : 0;

  // Gom lý do: mạnh nhất trước
  var ly = (dg.ly || []).slice().sort(function (a, b) { return Math.abs(b.diem || 0) - Math.abs(a.diem || 0); });
  var manh = [], vuong = [], trung = [], nguoi = [], lyCanCu = [], coQuan = false;
  ly.forEach(function (x) {
    if (!x || !x.k) return;
    if (x.k === 'quan' || x.k.indexOf('quan:') === 0) coQuan = true;
    if (x.ta && x.k !== 'the_giang_co') lyCanCu.push(tavHoa_(x.ta) + '.');
    var r = tavLyDe_(x.k);
    if (!r) return;
    var ds = r.loai === 'tot' ? manh : r.loai === 'xau' ? vuong : trung;
    if (ds.indexOf(r.de) < 0) ds.push(r.de);
    if (r.nguoi && nguoi.indexOf(r.nguoi) < 0) nguoi.push(r.nguoi);
  });

  // Tầng 1: 5 đoạn
  var hat = ((ban.cuc || 0) + (ban.gio ? ban.gio.chi : 0)) % 2;
  var p = [];
  p.push(M.mo[hat] + ' ' + tavTheVai_(vai, lechVai, muc));
  p.push(nhan.manh + (manh.length ? manh.slice(0, 3).join(' ') : L.manh));
  if (vuong.length) p.push(nhan.vuong + vuong.slice(0, 3).join(' '));
  else p.push(muc === 'thuan' ? nhan.vuong + nhan.khongVuong : nhan.vuong + L.vuong);
  p.push(M.dien + (trung.length ? ' ' + trung[0] : '') + (coQuan ? ' ' + TAV_QUAN_DIEN_ : ''));
  p.push(TAV_NHAN_HO_TRO_ + (nguoi.length ? 'lúc này dễ có sự giúp từ ' + tavDs_(nguoi.slice(0, 2)) + '. ' : '') + L.hoTro);

  // Căn cứ
  var canCu = [L.canCu, tavBanCC_(ban)];
  if (ban.toan) canCu.push(tavToanCC_(ban));
  canCu.push('Vai bạn chọn: ' + (typeof TA_BEN !== 'undefined' ? TA_BEN[vai] : vai) + '; mức chấm: ' + (dg.mucTen || (typeof TA_MUC !== 'undefined' ? TA_MUC[muc].ten : muc)) + '.');
  canCu = canCu.concat(lyCanCu.slice(0, 4));

  // Lưu ý
  var luu = [TAV_LUU_Y_];
  if (TAV_LUU_Y_THEM_[loai]) luu.push(TAV_LUU_Y_THEM_[loai]);
  luu.push(TAV_LUU_Y_HOI_);

  return { loai: loai, muc: muc, mucTen: dg.mucTen || '', vai: vai, ketLuan: p.join('\n\n'), canCu: canCu, viec: M.viec.slice(), luuY: luu.join(' ') };
}
