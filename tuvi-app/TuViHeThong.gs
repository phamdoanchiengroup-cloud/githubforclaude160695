/**
 * ============================================================
 *  TuViHeThong.gs — HỆ THỐNG TỬ VI THEO KIẾN TRÚC 4 TẦNG
 *
 *  File này gồm 3 phần:
 *    PHẦN 1 — SINH FACTS  (đang hoàn thiện — patch 2a)
 *    PHẦN 2 — KHO VĂN    (sẽ bổ sung ở patch 3)
 *    PHẦN 3 — RENDER     (sẽ bổ sung ở patch 3)
 *
 *  File TuVi.gs (an sao) và LuanGiai.gs (luận chuyên sâu)
 *  được giữ nguyên — không đụng tới.
 * ============================================================
 */


/* ============================================================
 *  PHẦN 1 — BẢNG DỮ LIỆU SAO (dùng để sinh facts)
 * ============================================================ */

/**
 * Bảng thông tin 14 chính tinh — mỗi sao có:
 *   yNghia  : câu văn dễ hiểu (không thuật ngữ)
 *   trongSo : độ mạnh cơ bản (sẽ điều chỉnh theo miếu/hãm)
 *   tags    : nhóm để Tầng 4 lọc
 *   doiTuong: fact nói về ai (mặc định là bản thân)
 */
var TUVI_FACT_CHINHTINH = {
  'Tử Vi': {
    yNghia: 'Bạn sinh ra đã mang khí chất của một người đứng đầu — người khác tự nhiên nể trọng và tìm đến bạn khi cần một quyết định. Mặt trái là tự trọng cao, khó nhận sai, thích người khác chiều theo ý mình và dễ cô lập khi xung quanh chỉ còn người nói thuận.',
    trongSo: 1.6,
    tags: ['tinh_cach', 'lanh_dao', 'uy_quyen'],
    doiTuong: 'ban_than'
  },
  'Thiên Cơ': {
    yNghia: 'Bạn có đầu óc nhanh nhạy, giỏi phân tích và lên kế hoạch, thích tìm tòi, đặt câu hỏi và khéo tay. Mặt trái là nghĩ nhiều hơn làm, hay đổi ý, dễ lo âu và khó theo một việc đến cùng.',
    trongSo: 1.5,
    tags: ['tinh_cach', 'tri_tue', 'phan_tich'],
    doiTuong: 'ban_than'
  },
  'Thái Dương': {
    yNghia: 'Bạn là người nhiệt tình, cởi mở, thích giúp đỡ người khác và sống hướng ngoại. Mặt trái là hay ôm việc của người khác, sĩ diện, cho đi nhiều mà ít được đáp lại và dễ kiệt sức.',
    trongSo: 1.5,
    tags: ['tinh_cach', 'huong_ngoai', 'danh_tieng'],
    doiTuong: 'ban_than'
  },
  'Vũ Khúc': {
    yNghia: 'Bạn quyết đoán, thực tế, giỏi xoay xở chuyện tiền bạc, không thích vòng vo. Mặt trái là cứng nhắc, nói thẳng đến mức mất lòng, khô khan trong tình cảm và dễ cô đơn.',
    trongSo: 1.5,
    tags: ['tinh_cach', 'tai_chinh', 'quyet_doan'],
    doiTuong: 'ban_than'
  },
  'Thiên Đồng': {
    yNghia: 'Bạn hiền hòa, lạc quan, dễ gần, biết cách tận hưởng cuộc sống. Mặt trái là ngại khó, dễ an phận, thiếu ý chí khi phải cạnh tranh và hay để việc trôi.',
    trongSo: 1.3,
    tags: ['tinh_cach', 'hiem_hoa', 'huong_thu'],
    doiTuong: 'ban_than'
  },
  'Liêm Trinh': {
    yNghia: 'Bạn sống có nguyên tắc, cứng rắn, có tài tổ chức và không chấp nhận sự dễ dãi. Mặt trái là nóng nảy, cố chấp, khó tha thứ và dễ va chạm với cấp trên hoặc vướng chuyện giấy tờ, kiện cáo.',
    trongSo: 1.4,
    tags: ['tinh_cach', 'nguyen_tac', 'ky_luat'],
    doiTuong: 'ban_than'
  },
  'Thiên Phủ': {
    yNghia: 'Bạn điềm đạm, đáng tin, giỏi giữ của, làm gì cũng chắc chắn. Mặt trái là bảo thủ, chậm thay đổi, đôi khi tính toán quá kỹ mà lỡ cơ hội.',
    trongSo: 1.5,
    tags: ['tinh_cach', 'on_dinh', 'tich_luy'],
    doiTuong: 'ban_than'
  },
  'Thái Âm': {
    yNghia: 'Bạn dịu dàng, tinh tế, giỏi chăm lo cho người khác và có con mắt thẩm mỹ. Mặt trái là đa sầu, dễ tủi thân, hay giữ trong lòng và thiếu quyết đoán khi cần dứt khoát.',
    trongSo: 1.4,
    tags: ['tinh_cach', 'tinh_te', 'cham_soc'],
    doiTuong: 'ban_than'
  },
  'Tham Lang': {
    yNghia: 'Bạn đa tài, giao tiếp giỏi, thích khám phá cái mới và ham học hỏi. Mặt trái là ham vui, nhiều ham muốn, dễ sa vào ăn chơi, tình cảm phức tạp và làm nhiều mà không tinh một việc.',
    trongSo: 1.4,
    tags: ['tinh_cach', 'da_tai', 'giao_te'],
    doiTuong: 'ban_than'
  },
  'Cự Môn': {
    yNghia: 'Bạn nói giỏi, lập luận sắc bén, thích tìm hiểu sự thật. Mặt trái là hay nghi ngờ, lời nói dễ gây mất lòng, thường vướng thị phi và tranh cãi.',
    trongSo: 1.3,
    tags: ['tinh_cach', 'ngon_luan', 'phan_bien'],
    doiTuong: 'ban_than'
  },
  'Thiên Tướng': {
    yNghia: 'Bạn chính trực, nghĩa hiệp, sống đàng hoàng, hay đứng ra bênh vực kẻ yếu. Mặt trái là dễ bị lợi dụng, hay gánh việc thay người và trọng hình thức, sĩ diện.',
    trongSo: 1.5,
    tags: ['tinh_cach', 'chinh_truc', 'nghia_hip'],
    doiTuong: 'ban_than'
  },
  'Thiên Lương': {
    yNghia: 'Bạn nhân hậu, thích che chở người khác, có duyên với người lớn tuổi. Mặt trái là hay dạy đời, ôm chuyện thiên hạ và dễ thành người gánh hết trách nhiệm.',
    trongSo: 1.5,
    tags: ['tinh_cach', 'nhan_hau', 'che_cho'],
    doiTuong: 'ban_than'
  },
  'Thất Sát': {
    yNghia: 'Bạn dũng cảm, quyết liệt, dám đương đầu và không chịu khuất phục. Mặt trái là nóng vội, liều, đời nhiều thăng trầm và hay một mình gánh áp lực.',
    trongSo: 1.5,
    tags: ['tinh_cach', 'dung_manh', 'quyet_liet'],
    doiTuong: 'ban_than'
  },
  'Phá Quân': {
    yNghia: 'Bạn thích đổi mới, dám phá bỏ cái cũ, không thích gò bó. Mặt trái là tiêu hao tiền bạc và các mối quan hệ, khó giữ cái đã có và hay phải làm lại từ đầu.',
    trongSo: 1.4,
    tags: ['tinh_cach', 'pha_cach', 'doi_moi'],
    doiTuong: 'ban_than'
  }
};

/**
 * Bảng thông tin phụ tinh quan trọng — chỉ liệt kê các sao hay gặp.
 * Mỗi entry có: yNghia, loai (manh/yeu), trongSo, tags
 */
var TUVI_FACT_PHUTINH = {
  // --- Cát tinh ---
  'Tả Phù':     { yNghia: 'Bạn có duyên được người khác giúp đỡ khi cần. Mặt trái là dễ dựa dẫm và chậm tự đứng một mình khi người giúp rút đi.', loai: 'manh', trongSo: 1.2, tags: ['quy_nhan', 'tro_giup'] },
  'Hữu Bật':    { yNghia: 'Bạn có duyên được người khác giúp đỡ khi cần. Mặt trái là dễ dựa dẫm và chậm tự đứng một mình khi người giúp rút đi.', loai: 'manh', trongSo: 1.2, tags: ['quy_nhan', 'tro_giup'] },
  'Văn Xương':  { yNghia: 'Bạn có duyên với học hành, chữ nghĩa và các lĩnh vực cần sự tinh tế. Mặt trái là dễ nặng lý thuyết, hơi kiểu cách và ngại việc tay chân.', loai: 'manh', trongSo: 1.1, tags: ['hoc_van', 'tri_tue'] },
  'Văn Khúc':   { yNghia: 'Bạn ăn nói có duyên và có khiếu với nghệ thuật, cái đẹp. Mặt trái là dễ đa tình, dễ xao lòng và hứa nhiều hơn làm.', loai: 'manh', trongSo: 1.1, tags: ['nghe_thuat', 'giao_te'] },
  'Thiên Khôi': { yNghia: 'Bạn thường được những người bề trên nâng đỡ. Mặt trái là dễ quen chờ người kéo lên, và hụt hẫng khi chỗ dựa thay đổi.', loai: 'manh', trongSo: 1.3, tags: ['quy_nhan', 'be_tren'] },
  'Thiên Việt': { yNghia: 'Bạn thường gặp được người tốt sẵn lòng giúp mình. Mặt trái là dễ cả tin, có lúc nhận nhầm người tốt.', loai: 'manh', trongSo: 1.3, tags: ['quy_nhan'] },
  'Lộc Tồn':    { yNghia: 'Cuộc sống của bạn tương đối ổn định về vật chất. Mặt trái là dễ chặt chẽ quá mức với tiền, ngại rủi ro và có lúc sống khép kín, ít bạn.', loai: 'manh', trongSo: 1.5, tags: ['tai_loc', 'on_dinh'] },
  'Thiên Mã':   { yNghia: 'Bạn là người năng động, thích di chuyển và đổi mới. Mặt trái là khó ngồi yên một chỗ, bôn ba vất vả và dễ mệt vì đi lại nhiều.', loai: 'manh', trongSo: 0.9, tags: ['di_chuyen', 'nang_dong'] },
  'Hóa Lộc':    { yNghia: 'Tiền bạc của bạn thường hanh thông, có nhiều cơ hội kiếm tiền. Mặt trái là tiền đến dễ thì cũng dễ tiêu, và hay bị người khác nhờ vả, vay mượn.', loai: 'manh', trongSo: 1.7, tags: ['tai_loc', 'may_man'] },
  'Hóa Quyền':  { yNghia: 'Bạn có uy tự nhiên, thường được người khác nghe theo. Mặt trái là dễ áp đặt, thích kiểm soát và gây căng thẳng với người cũng muốn nắm quyền.', loai: 'manh', trongSo: 1.6, tags: ['uy_quyen', 'lanh_dao'] },
  'Hóa Khoa':   { yNghia: 'Bạn có duyên với học vấn và khi gặp khó thường có người giúp giải quyết. Mặt trái là trọng danh tiếng, dễ bận lòng vì lời đánh giá của người khác.', loai: 'manh', trongSo: 1.5, tags: ['hoc_van', 'danh_tieng'] },
  'Thiên Đức':  { yNghia: 'Bạn được phù hộ, gặp khó khăn thường có người giúp đỡ. Mặt trái là dễ ỷ lại vào may mắn mà chậm chuẩn bị.', loai: 'manh', trongSo: 1.0, tags: ['phuc_duc'] },
  'Nguyệt Đức': { yNghia: 'Bạn là người hiền lành và được hưởng phúc. Mặt trái là hiền quá dễ bị lấn lướt, ngại từ chối.', loai: 'manh', trongSo: 1.0, tags: ['phuc_duc'] },
  'Long Trì':   { yNghia: 'Bạn có khí chất thanh nhã, dễ được người khác quý mến. Mặt trái là chuộng vẻ ngoài, dễ chi nhiều cho hình thức.', loai: 'manh', trongSo: 0.9, tags: ['khi_chat'] },
  'Phượng Các': { yNghia: 'Bạn có khí chất thanh nhã, dễ được người khác quý mến. Mặt trái là chuộng vẻ ngoài, dễ chi nhiều cho hình thức.', loai: 'manh', trongSo: 0.9, tags: ['khi_chat'] },
  'Hồng Loan':  { yNghia: 'Bạn có duyên về ngoại hình, dễ được người khác yêu mến. Mặt trái là dễ vướng chuyện tình cảm rắc rối, bị người khác ghen hoặc đeo bám.', loai: 'manh', trongSo: 1.0, tags: ['tinh_duyen', 'ngoai_hinh'] },
  'Thiên Hỷ':   { yNghia: 'Bạn có duyên với chuyện vui, hỷ sự. Mặt trái là vui quá dễ chi tiêu theo cảm hứng và quyết vội.', loai: 'manh', trongSo: 1.0, tags: ['hy_su', 'tinh_duyen'] },

  // --- Hung tinh ---
  'Kình Dương': { yNghia: 'Mặt tốt: bạn có cá tính mạnh mẽ, quyết đoán, dám tranh. Mặt xấu: dễ va chạm, gây gổ với người xung quanh và dễ bị thương do vội vàng, va quẹt.', loai: 'yeu', trongSo: 1.3, tags: ['ca_tinh', 'va_cham'] },
  'Đà La':      { yNghia: 'Mặt tốt: bạn bền, lì, đã theo việc thì không bỏ. Mặt xấu: việc hay bị trì hoãn, dây dưa, dễ bỏ lỡ cơ hội vì do dự và vướng những chuyện kéo dài khó dứt.', loai: 'yeu', trongSo: 1.2, tags: ['tri_hoan', 'do_du'] },
  'Hỏa Tinh':   { yNghia: 'Mặt tốt: bạn hành động nhanh, dám làm ngay. Mặt xấu: nóng tính, bộc phát, dễ nói lời làm tổn thương và hay hối hận vì quyết quá vội.', loai: 'yeu', trongSo: 1.2, tags: ['nong_tinh', 'boc_phat'] },
  'Linh Tinh':  { yNghia: 'Mặt tốt: bạn nhạy, phản ứng nhanh với biến động. Mặt xấu: hay lo nghĩ, bứt rứt trong lòng và dễ gặp chuyện bất ngờ không lường trước.', loai: 'yeu', trongSo: 1.1, tags: ['lo_nghi', 'bat_ngo'] },
  'Địa Không':  { yNghia: 'Mặt tốt: bạn có suy nghĩ khác người, dám nghĩ điều lớn. Mặt xấu: kế hoạch dễ đổ vỡ giữa chừng, tiền và công sức dễ mất trắng, hay hụt hẫng khi thực tế không như mơ.', loai: 'yeu', trongSo: 1.2, tags: ['khac_nguoi', 'hut_hang'] },
  'Địa Kiếp':   { yNghia: 'Mặt tốt: bạn chịu được biến động, ngã rồi vẫn đứng dậy làm lại. Mặt xấu: đời có những giai đoạn lên xuống rõ rệt, dễ mất tiền bất ngờ, làm ăn đổ vỡ và hao tổn công sức. Gợi ý: luôn giữ một khoản dự phòng.', loai: 'yeu', trongSo: 1.3, tags: ['thang_tram', 'mat_mat'] },
  'Hóa Kỵ':     { yNghia: 'Mặt tốt: bạn kiên trì, để tâm sâu vào điều mình theo đuổi. Mặt xấu: dễ bị hiểu lầm, vướng thị phi, việc hay trắc trở, không như ý và hay day dứt, ám ảnh một chuyện.', loai: 'yeu', trongSo: 1.5, tags: ['hieu_lam', 'tro_ngai'] },
  'Thiên Hình': { yNghia: 'Mặt tốt: bạn nghiêm khắc, kỷ luật, giữ được nguyên tắc. Mặt xấu: khắt khe với người khác, dễ va chạm, vướng chuyện kiện tụng, giấy tờ hoặc phải can thiệp y tế, phẫu thuật.', loai: 'yeu', trongSo: 1.0, tags: ['nghiem_khac'] },
  'Thiên Riêu': { yNghia: 'Mặt tốt: bạn có sức hút trong tình cảm. Mặt xấu: dễ vướng chuyện tình phức tạp, tai tiếng, người thứ ba và những cám dỗ khó dứt.', loai: 'yeu', trongSo: 0.9, tags: ['tinh_cam', 'phuc_tap'] },
  'Tang Môn':   { yNghia: 'Mặt tốt: bạn nhạy cảm, biết đồng cảm với nỗi buồn của người khác. Mặt xấu: hay buồn phiền, dễ gặp chuyện buồn, mất mát trong nhà và tâm trạng nặng nề kéo dài.', loai: 'yeu', trongSo: 0.9, tags: ['buon_phien'] },
  'Bạch Hổ':    { yNghia: 'Mặt tốt: bạn có gan, dám đối mặt chuyện khó. Mặt xấu: dễ gặp tai nạn, va chạm khi đi lại, xung đột hoặc vướng chuyện pháp lý bất ngờ.', loai: 'yeu', trongSo: 1.0, tags: ['tai_nan', 'bat_ngo'] },
  'Thiên Khốc': { yNghia: 'Mặt tốt: bạn sống tình cảm, dễ rung động trước cái đẹp. Mặt xấu: dễ xúc động, hay lo lắng, buồn bã và có những giai đoạn ưu phiền kéo dài.', loai: 'yeu', trongSo: 0.9, tags: ['nhao_cam'] },
  'Thiên Hư':   { yNghia: 'Mặt tốt: bạn không quá bám vào vật chất. Mặt xấu: hay hụt năng lượng, chi tiêu lặt vặt khó kiểm soát, tiền hao dần mà không rõ đi đâu.', loai: 'yeu', trongSo: 0.9, tags: ['hao_ton'] },
  'Cô Thần':    { yNghia: 'Mặt tốt: bạn độc lập, tự lo được cho mình, không phụ thuộc ai. Mặt xấu: dễ cô đơn, khó mở lòng, quan hệ gia đình và tình cảm có khoảng cách.', loai: 'yeu', trongSo: 0.8, tags: ['doc_lap', 'co_don'] },
  'Quả Tú':     { yNghia: 'Mặt tốt: bạn độc lập, tự lo được cho mình, không phụ thuộc ai. Mặt xấu: dễ cô đơn, khó mở lòng, quan hệ gia đình và tình cảm có khoảng cách.', loai: 'yeu', trongSo: 0.8, tags: ['doc_lap', 'co_don'] }
};

/**
 * Map độ sáng Miếu/Vượng/Đắc/Bình/Hãm → hệ số điều chỉnh trọng số.
 * VD: Tử Vi miếu (M) → 1.2 × trongSo gốc. Tử Vi hãm (H) → 0.6 ×.
 */
var TUVI_FACT_DOSANG_HE_SO = {
  'M': 1.2,
  'V': 1.1,
  'Đ': 1.0,
  'B': 0.9,
  'H': 0.6
};

/**
 * Ý nghĩa Tuần / Triệt khi đóng tại cung.
 */
var TUVI_FACT_TUAN_TRIET = {
  'tuan':  'Lĩnh vực này có xu hướng bị cản ở giai đoạn đầu: việc chậm, kết quả không tương xứng công sức; về sau thường thông dần. Mặt khác, điều xấu ở cung cũng bị giảm bớt.',
  'triet': 'Tuổi trẻ có xu hướng gặp khó rõ ở lĩnh vực này: dễ đứt đoạn, làm dở dang hoặc mất cái đang có; càng về sau càng ổn định hơn. Mặt khác, điều xấu ở cung cũng bị chặn bớt.',
  'ca_hai':'Đây là điểm "mờ" của bạn: giai đoạn đầu đời lĩnh vực này dễ bế tắc, thiếu hụt kéo dài; càng lớn tuổi càng sáng rõ hơn.'
};

/**
 * Ngũ hành cung so với bản mệnh — 5 trường hợp.
 */
var TUVI_FACT_NGUHANH_CUNG = {
  'sinh':     { yNghia: 'Ngũ hành của cung này sinh cho bản mệnh của bạn — đây là điểm thuận tự nhiên, việc ở lĩnh vực này thường trôi chảy. Mặt trái là dễ quen được đỡ, chủ quan khi hoàn cảnh đổi.', loai: 'manh', trongSo: 1.0, tags: ['thuan_loi'] },
  'duoc_sinh':{ yNghia: 'Bản mệnh của bạn sinh cho cung này — vẫn đạt được việc, nhưng bạn phải bỏ công sức nhiều hơn mức bình thường và dễ hao sức, cho nhiều hơn nhận.', loai: 'trung', trongSo: 0.8, tags: ['hao_cong'] },
  'binh':     { yNghia: 'Ngũ hành cung và bản mệnh đồng hành — mọi việc ở mức ổn định, không quá thuận cũng không quá trở ngại; ngược lại cũng ít cú hích để bứt lên.', loai: 'trung', trongSo: 0.6, tags: ['on_dinh'] },
  'khac':     { yNghia: 'Ngũ hành cung khắc bản mệnh của bạn — lĩnh vực này thường gây áp lực, hay va vấp và hao tâm sức; mặt được là nó rèn cho bạn sức chịu đựng.', loai: 'yeu', trongSo: 1.0, tags: ['ap_luc'] },
  'bi_khac':  { yNghia: 'Bản mệnh của bạn khắc ngũ hành cung — bạn có thể chủ động chế ngự lĩnh vực này, nhưng phải bỏ nhiều công sức và dễ căng thẳng vì phải gồng.', loai: 'trung', trongSo: 0.9, tags: ['chu_dong'] }
};

/* ============================================================
 *  BẢNG DỮ LIỆU VÒNG SAO (dùng ở phần facts nâng cao)
 * ============================================================ */

/**
 * Ý nghĩa dễ hiểu của 12 sao vòng Tràng Sinh.
 * Tràng Sinh mô tả "khí" của cung — đang sinh sôi, đang thịnh, hay đang suy.
 */
var TUVI_FACT_TRANG_SINH = {
  'Tràng Sinh': { yNghia: 'Cung này đang ở giai đoạn khởi sinh — có sức sống, phát triển bền, nhiều tiềm năng; mặt trái là còn non, chưa có thành quả ngay.', loai: 'manh', trongSo: 0.9 },
  'Mộc Dục':    { yNghia: 'Cung này đang ở giai đoạn chuyển tiếp, chưa ổn định — có thể có chuyện tình cảm, hoặc mới bắt đầu chưa chắc chắn.', loai: 'trung', trongSo: 0.7 },
  'Quan Đới':   { yNghia: 'Cung này đang tích lũy — sắp đến lúc bứt phá; mặt trái là dễ nóng vội muốn có kết quả sớm.', loai: 'manh', trongSo: 0.8 },
  'Lâm Quan':   { yNghia: 'Cung này đang trên đà thăng tiến — năng lực được thể hiện rõ; mặt trái là dễ tự tin quá mức, va chạm với người cạnh tranh.', loai: 'manh', trongSo: 1.0 },
  'Đế Vượng':   { yNghia: 'Cung này đang ở đỉnh cao của chu kỳ — đây là điểm sáng nhất. Mặt trái là thịnh quá dễ chủ quan, quá đà, và sau đỉnh là đoạn đi xuống.', loai: 'manh', trongSo: 1.2 },
  'Suy':        { yNghia: 'Cung này đang ở giai đoạn suy yếu — sức bật giảm, việc mở rộng dễ hụt; mặt được là đã có kinh nghiệm để giữ cái đang có.', loai: 'yeu', trongSo: 0.7 },
  'Bệnh':       { yNghia: 'Cung này đang ở giai đoạn trì trệ — việc ì ạch, dễ sinh trục trặc nếu bỏ mặc; mặt được là vấn đề lộ ra sớm để kịp sửa.', loai: 'yeu', trongSo: 0.8 },
  'Tử':         { yNghia: 'Cung này ít biến động, thiếu sinh khí — là "vùng tĩnh" trong cuộc đời bạn: yên nhưng khó khởi sắc.', loai: 'trung', trongSo: 0.7 },
  'Mộ':         { yNghia: 'Cung này mang tính tàng trữ — giữ được của nhưng khó bung ra mạnh, dễ bí bách, chậm.', loai: 'trung', trongSo: 0.7 },
  'Tuyệt':      { yNghia: 'Cung này ở thế cùng cực — dễ đứt đoạn, mất cái đang có và phải bắt đầu lại từ đầu.', loai: 'yeu', trongSo: 0.8 },
  'Thai':       { yNghia: 'Cung này đang trong giai đoạn ấp ủ — có ý tưởng nhưng chưa thành hình, cần thời gian.', loai: 'trung', trongSo: 0.7 },
  'Dưỡng':      { yNghia: 'Cung này đang được bồi đắp — phát triển chậm nhưng chắc, có người nâng đỡ; mặt trái là dễ dựa dẫm, chậm tự lập.', loai: 'manh', trongSo: 0.8 }
};

/**
 * Ý nghĩa dễ hiểu của 12 sao vòng Bác Sĩ.
 */
var TUVI_FACT_BAC_SI = {
  'Bác Sĩ':     { yNghia: 'Có yếu tố thông minh, học rộng ở lĩnh vực này.', loai: 'manh', trongSo: 0.7 },
  'Lực Sĩ':     { yNghia: 'Có sức mạnh, có khả năng đảm nhận việc khó.', loai: 'manh', trongSo: 0.6 },
  'Thanh Long': { yNghia: 'Có may mắn, có hỷ sự trong lĩnh vực này.', loai: 'manh', trongSo: 0.9 },
  'Tiểu Hao':   { yNghia: 'Dễ có hao tán nhỏ, chi tiêu lặt vặt.', loai: 'yeu', trongSo: 0.5 },
  'Tướng Quân': { yNghia: 'Có uy dũng, có quyền hành trong lĩnh vực này.', loai: 'manh', trongSo: 0.8 },
  'Tấu Thư':    { yNghia: 'Có duyên với giấy tờ, văn thư, ăn nói.', loai: 'manh', trongSo: 0.5 },
  'Phi Liêm':   { yNghia: 'Dễ có thị phi, chuyện ong bướm.', loai: 'yeu', trongSo: 0.5 },
  'Hỷ Thần':    { yNghia: 'Có niềm vui, có hỷ sự ở lĩnh vực này.', loai: 'manh', trongSo: 0.7 },
  'Bệnh Phù':   { yNghia: 'Dễ mệt mỏi, sức khỏe lặt vặt và việc ì ạch ở lĩnh vực này.', loai: 'yeu', trongSo: 0.7 },
  'Đại Hao':    { yNghia: 'Chi tiêu dễ vượt dự tính, có những khoản hao tiền lớn bất ngờ; mặt được là dám chi khi cần.', loai: 'yeu', trongSo: 0.9 },
  'Phục Binh':  { yNghia: 'Dễ bị người ngầm chơi xấu, bị phản hoặc lộ thông tin ở lĩnh vực này.', loai: 'yeu', trongSo: 0.8 },
  'Quan Phủ':   { yNghia: 'Dễ vướng tranh chấp, kiện cáo, rắc rối giấy tờ, hợp đồng.', loai: 'yeu', trongSo: 0.8 }
};

/**
 * Ý nghĩa dễ hiểu của 12 sao vòng Thái Tuế.
 */
var TUVI_FACT_THAI_TUE = {
  'Thái Tuế':    { yNghia: 'Có uy nghi, có tiếng nói, nhưng cũng dễ có thị phi.', loai: 'trung', trongSo: 0.6 },
  'Thiếu Dương': { yNghia: 'Có sự thông minh, có niềm vui trong lĩnh vực này.', loai: 'manh', trongSo: 0.7 },
  'Tang Môn':    { yNghia: 'Dễ có chuyện buồn, mất mát và tâm trạng nặng nề trong năm.', loai: 'yeu', trongSo: 0.8 },
  'Thiếu Âm':    { yNghia: 'Có sự hiền hòa, có chút phúc nhẹ.', loai: 'manh', trongSo: 0.6 },
  'Quan Phù':    { yNghia: 'Dễ vướng rắc rối giấy tờ, hợp đồng, tranh chấp.', loai: 'yeu', trongSo: 0.7 },
  'Tử Phù':      { yNghia: 'Tâm trạng dễ trầm xuống, việc chậm lại, có chuyện buồn trong nhà.', loai: 'yeu', trongSo: 0.8 },
  'Tuế Phá':     { yNghia: 'Có xu hướng ngang bướng, hay chống lại khuôn phép và dễ làm hao hụt cái đang có.', loai: 'yeu', trongSo: 0.7 },
  'Long Đức':    { yNghia: 'Được phúc đức che chở, gặp dữ hóa lành.', loai: 'manh', trongSo: 0.9 },
  'Bạch Hổ':     { yNghia: 'Dễ va chạm, tai nạn khi đi lại hoặc rắc rối giấy tờ, hợp đồng.', loai: 'yeu', trongSo: 0.9 },
  'Phúc Đức':    { yNghia: 'Được phúc đức che chở, gặp khó có người giúp.', loai: 'manh', trongSo: 0.9 },
  'Điếu Khách':  { yNghia: 'Dễ vướng tin đồn, lời ra tiếng vào và chuyện hứa rồi không thành.', loai: 'yeu', trongSo: 0.6 },
  'Trực Phù':    { yNghia: 'Việc hay vướng víu, chậm, gặp trở ngại lặt vặt kéo dài.', loai: 'yeu', trongSo: 0.6 }
};

/* ============================================================
 *  BẢNG DỮ LIỆU RIÊNG CHO CUNG PHU THÊ
 *  (Chủ thể của cung là NGƯỜI PHỐI NGẪU, không phải bản thân)
 * ============================================================ */

/**
 * Ý nghĩa 14 chính tinh tại cung Phu Thê — mô tả người bạn đời.
 */
var TUVI_FACT_PHUTHE_CHINHTINH = {
  'Tử Vi': {
    yNghia: 'Bạn đời của bạn thuộc mẫu người có uy, tự trọng cao, thích được tôn trọng. Họ thường giữ vai trò chủ động trong gia đình. Mặt tốt: hôn nhân có chỗ dựa, có người cầm lái. Mặt xấu: bạn đời dễ gia trưởng, khó nhận sai và bạn hay phải nhường để giữ hòa khí.',
    trongSo: 1.5, tags: ['phoi_ngau_uy_quyen', 'hon_nhan_huong_on_dinh']
  },
  'Thiên Cơ': {
    yNghia: 'Bạn đời của bạn thuộc mẫu người có đầu óc, nhạy bén, thích suy nghĩ. Mặt tốt: hai người nói chuyện được với nhau, cùng tính toán việc nhà. Mặt xấu: hôn nhân nhiều xáo trộn, hay đổi chỗ ở, đổi việc, và bạn đời dễ lo nghĩ, thay đổi ý định.',
    trongSo: 1.4, tags: ['phoi_ngau_tri_tue', 'hon_nhan_co_thay_doi']
  },
  'Thái Dương': {
    yNghia: 'Bạn đời của bạn thuộc mẫu người hướng ngoại, nhiệt tình, thích giúp đỡ người khác. Mặt tốt: gia đình vui, có tiếng tốt bên ngoài. Mặt xấu: bạn đời lo việc người ngoài nhiều hơn việc nhà, sĩ diện, và bạn dễ thấy mình đứng sau.',
    trongSo: 1.5, tags: ['phoi_ngau_huong_ngoai', 'hon_nhan_co_the_rang_ro']
  },
  'Vũ Khúc': {
    yNghia: 'Bạn đời của bạn thuộc mẫu người cương nghị, thực tế, ít nói lời tình cảm nhưng hành động thiết thực. Mặt tốt: kinh tế gia đình vững. Mặt xấu: hôn nhân khô khan, dễ căng vì tiền và tính cứng của nhau; cưới sớm dễ trắc trở, cưới muộn thường bền hơn.',
    trongSo: 1.4, tags: ['phoi_ngau_thuc_te', 'nen_ket_hon_muon']
  },
  'Thiên Đồng': {
    yNghia: 'Bạn đời của bạn thuộc mẫu người hiền hòa, vui vẻ, dễ gần, thích cuộc sống nhẹ nhàng. Mặt tốt: nhà ít cãi vã, không khí dễ chịu. Mặt xấu: bạn đời dễ ỷ lại, ngại gánh việc lớn, và bạn thường phải là người lo toan.',
    trongSo: 1.3, tags: ['phoi_ngau_hiem_hoa', 'hon_nhan_huong_em_am']
  },
  'Liêm Trinh': {
    yNghia: 'Bạn đời của bạn thuộc mẫu người có cá tính mạnh, sống nguyên tắc, có sức hút tự nhiên. Mặt tốt: hôn nhân nhiều đam mê, gắn bó mạnh. Mặt xấu: dễ ghen tuông, nóng nảy, cãi vã gay gắt và có giai đoạn lạnh nhạt.',
    trongSo: 1.4, tags: ['phoi_ngau_ca_tinh', 'hon_nhan_nong_nan']
  },
  'Thiên Phủ': {
    yNghia: 'Bạn đời của bạn thuộc mẫu người điềm đạm, chín chắn, biết lo liệu. Mặt tốt: hôn nhân có xu hướng bền, nhà cửa ổn định. Mặt xấu: bạn đời bảo thủ, nắm chặt tiền, ít lãng mạn và hay muốn mọi việc theo cách của họ.',
    trongSo: 1.5, tags: ['phoi_ngau_dang_tin', 'phu_hop_hon_nhan_ben_vung']
  },
  'Thái Âm': {
    yNghia: 'Bạn đời của bạn thuộc mẫu người dịu dàng, tinh tế, giàu cảm xúc. Mặt tốt: hôn nhân êm, được chăm sóc chu đáo. Mặt xấu: bạn đời hay giữ tâm sự riêng, dễ tủi thân, và những điều không nói ra tích tụ thành khoảng cách.',
    trongSo: 1.4, tags: ['phoi_ngau_tinh_te', 'hon_nhan_huong_em_am']
  },
  'Tham Lang': {
    yNghia: 'Bạn đời của bạn thuộc mẫu người đa tài, có sức hút, thích khám phá. Mặt tốt: hôn nhân sôi nổi, không nhàm chán. Mặt xấu: tình duyên phức tạp, dễ có người thứ ba, ham vui và chi tiêu cho hưởng thụ.',
    trongSo: 1.4, tags: ['phoi_ngau_hao_hoa', 'can_chung_thuy']
  },
  'Cự Môn': {
    yNghia: 'Bạn đời của bạn thuộc mẫu người sắc sảo, giỏi lý luận. Mặt tốt: hai người nói thẳng, ít giấu nhau. Mặt xấu: hay cãi vã, lời nói làm tổn thương, dễ nghi ngờ nhau và bất hòa kéo dài.',
    trongSo: 1.3, tags: ['phoi_ngau_ngon_luan', 'can_lang_nghe']
  },
  'Thiên Tướng': {
    yNghia: 'Bạn đời của bạn thuộc mẫu người chính trực, đàng hoàng, chu đáo, biết quan tâm. Mặt tốt: hôn nhân hòa thuận, bạn đời giúp bạn nhiều. Mặt xấu: bạn đời trọng thể diện, hay lo cho người ngoài và dễ bị người khác lợi dụng lòng tốt.',
    trongSo: 1.5, tags: ['phoi_ngau_chinh_truc', 'hon_nhan_hoa_thuan']
  },
  'Thiên Lương': {
    yNghia: 'Bạn đời của bạn thuộc mẫu người nhân hậu, chín chắn, có tinh thần che chở — thường lớn tuổi hơn hoặc trưởng thành sớm. Mặt tốt: hôn nhân có xu hướng bền. Mặt xấu: bạn đời hay dạy bảo, kiểm soát như cha mẹ, khiến bạn thấy bị coi nhẹ.',
    trongSo: 1.5, tags: ['phoi_ngau_nhan_hau', 'hon_nhan_ben_vung']
  },
  'Thất Sát': {
    yNghia: 'Bạn đời của bạn thuộc mẫu người mạnh mẽ, quyết đoán, có tham vọng. Mặt tốt: bạn đời gánh vác được việc lớn. Mặt xấu: nóng tính, áp đặt; duyên tình dễ đến muộn, có thể đổ vỡ hoặc xa cách trước khi ổn định.',
    trongSo: 1.4, tags: ['phoi_ngau_dung_manh', 'duyen_tinh_muon']
  },
  'Phá Quân': {
    yNghia: 'Bạn đời của bạn thuộc mẫu người phóng khoáng, thích đổi mới, không chịu gò bó. Mặt tốt: hôn nhân không đơn điệu, dám làm lại khi cần. Mặt xấu: nhiều biến động, dễ chia tay rồi tái hợp hoặc phải làm lại từ đầu; cưới sớm dễ đổ vỡ hơn cưới muộn.',
    trongSo: 1.4, tags: ['phoi_ngau_pha_cach', 'can_bao_dung']
  }
};

/**
 * Ý nghĩa các phụ tinh đặc thù tại cung Phu Thê — bổ trợ cho chân dung.
 */
var TUVI_FACT_PHUTHE_PHUTINH = {
  // Cát tinh — hôn nhân tốt đẹp hơn
  'Đào Hoa':    { yNghia: 'Bạn đời của bạn duyên dáng, được nhiều người yêu mến; tình cảm đến sớm và nồng nàn. Mặt trái là nhiều người để ý, dễ sinh ghen tuông và cám dỗ.', loai: 'manh', trongSo: 1.0, tags: ['phoi_ngau_duyen_dang', 'tinh_cam_som'] },
  'Hồng Loan':  { yNghia: 'Hôn nhân có duyên — bạn dễ lập gia đình, bạn đời ưa nhìn và được lòng người.', loai: 'manh', trongSo: 1.1, tags: ['hon_nhan_co_duyen'] },
  'Thiên Hỷ':   { yNghia: 'Hôn nhân có nhiều niềm vui, hỷ sự — vợ chồng biết cách mang lại tiếng cười cho nhau.', loai: 'manh', trongSo: 1.0, tags: ['hon_nhan_vui_ve'] },
  'Tả Phù':     { yNghia: 'Mặt tốt: bạn đời giúp đỡ bạn nhiều. Mặt xấu: dễ có người thứ ba xen vào, hoặc một trong hai có thêm mối quan hệ ngoài hôn nhân.', loai: 'manh', trongSo: 0.9, tags: ['phoi_ngau_ho_tro', 'canh_bao_nguoi_thu_ba'] },
  'Hữu Bật':    { yNghia: 'Mặt tốt: bạn đời hỗ trợ bạn trong cuộc sống. Mặt xấu: dễ có chuyện tình cảm phức tạp, người thứ ba hoặc hai lần đò.', loai: 'manh', trongSo: 0.9, tags: ['phoi_ngau_ho_tro', 'canh_bao_nguoi_thu_ba'] },
  'Văn Xương':  { yNghia: 'Bạn đời của bạn có học thức, ăn nói nhã nhặn, có khiếu văn nghệ.', loai: 'manh', trongSo: 1.0, tags: ['phoi_ngau_hoc_thuc'] },
  'Văn Khúc':   { yNghia: 'Bạn đời của bạn khéo ăn nói, có duyên giao tiếp và có khiếu nghệ thuật.', loai: 'manh', trongSo: 1.0, tags: ['phoi_ngau_kheo_an_noi'] },
  'Thiên Khôi': { yNghia: 'Bạn đời của bạn có địa vị, được người bề trên nâng đỡ — bạn được nhờ qua hôn nhân.', loai: 'manh', trongSo: 1.1, tags: ['phoi_ngau_quy_nhan'] },
  'Thiên Việt': { yNghia: 'Bạn đời của bạn là quý nhân của bạn — mang lại cơ hội và may mắn.', loai: 'manh', trongSo: 1.1, tags: ['phoi_ngau_quy_nhan'] },
  'Lộc Tồn':    { yNghia: 'Bạn đời của bạn giỏi giữ của, mang lại ổn định tài chính cho gia đình.', loai: 'manh', trongSo: 1.3, tags: ['phoi_ngau_tai_loc'] },
  'Hóa Lộc':    { yNghia: 'Bạn đời của bạn mang lại tài lộc — hôn nhân thịnh vượng và ấm no.', loai: 'manh', trongSo: 1.5, tags: ['phoi_ngau_tai_loc'] },
  'Hóa Quyền':  { yNghia: 'Bạn đời của bạn có năng lực, thích nắm quyền quyết định trong gia đình; mặt trái là dễ lấn át, tranh quyền với bạn.', loai: 'manh', trongSo: 1.3, tags: ['phoi_ngau_uy_quyen'] },
  'Hóa Khoa':   { yNghia: 'Bạn đời của bạn có danh tiếng, học vấn — hôn nhân được nể trọng.', loai: 'manh', trongSo: 1.3, tags: ['phoi_ngau_danh_tieng'] },
  'Long Trì':   { yNghia: 'Bạn đời của bạn có phong thái thanh nhã, lịch sự.', loai: 'manh', trongSo: 0.8, tags: ['phoi_ngau_thanh_nha'] },
  'Phượng Các': { yNghia: 'Bạn đời của bạn có khí chất cao quý, biết cách cư xử.', loai: 'manh', trongSo: 0.8, tags: ['phoi_ngau_thanh_nha'] },

  // Hung tinh — hôn nhân có thử thách
  'Kình Dương': { yNghia: 'Mặt tốt: bạn đời cá tính mạnh, dám đứng ra bảo vệ gia đình. Mặt xấu: hôn nhân dễ va chạm, cãi vã gay gắt, có lúc tổn thương nhau; sức khỏe bạn đời cũng dễ gặp chuyện do tai nạn, va quẹt.', loai: 'yeu', trongSo: 1.3, tags: ['phoi_ngau_ca_tinh', 'hon_nhan_va_cham'] },
  'Đà La':      { yNghia: 'Mặt tốt: khi đã gắn bó thì khó rời. Mặt xấu: duyên tình đến chậm, dây dưa, dễ trải qua vài mối tình dang dở và những mâu thuẫn kéo dài không dứt.', loai: 'yeu', trongSo: 1.2, tags: ['hon_nhan_muon', 'duyen_cham'] },
  'Hỏa Tinh':   { yNghia: 'Mặt tốt: tình cảm nồng nhiệt, giận nhanh mà cũng nguôi nhanh. Mặt xấu: hai bạn dễ bùng nổ khi bất đồng, nói lời nặng và có những trận cãi làm sứt mẻ tình cảm.', loai: 'yeu', trongSo: 1.2, tags: ['hon_nhan_nong_nay'] },
  'Linh Tinh':  { yNghia: 'Mặt tốt: hai người nhạy với cảm xúc của nhau. Mặt xấu: hôn nhân hay có bực bội âm ỉ, giận ngầm, chuyện cũ bị nhắc lại nhiều lần.', loai: 'yeu', trongSo: 1.1, tags: ['hon_nhan_am_i'] },
  'Địa Không':  { yNghia: 'Mặt tốt: hai người không quá nặng vật chất trong tình cảm. Mặt xấu: tình cảm dễ hụt hẫng, nguội lạnh, kỳ vọng vào nhau đổ vỡ và có lúc thấy hôn nhân trống rỗng.', loai: 'yeu', trongSo: 1.2, tags: ['hon_nhan_hut_hang'] },
  'Địa Kiếp':   { yNghia: 'Mặt tốt: qua sóng gió thì hai người hiểu nhau hơn. Mặt xấu: hôn nhân dễ có biến cố lớn — hao tiền chung, đổ vỡ hoặc phải xa nhau một thời gian.', loai: 'yeu', trongSo: 1.3, tags: ['hon_nhan_bien_co'] },
  'Hóa Kỵ':     { yNghia: 'Mặt tốt: hai người để tâm nhiều đến nhau. Mặt xấu: vợ chồng dễ hiểu lầm, ghen tuông, trách móc và có giai đoạn lạnh nhạt; cưới sớm dễ trắc trở hơn cưới muộn.', loai: 'yeu', trongSo: 1.5, tags: ['hon_nhan_hieu_lam', 'can_ket_hon_muon'] },
  'Thiên Riêu': { yNghia: 'Mặt tốt: bạn đời có sức hút, hôn nhân không nhạt. Mặt xấu: dễ có chuyện trăng hoa, người thứ ba hoặc tai tiếng tình cảm.', loai: 'yeu', trongSo: 1.1, tags: ['phoi_ngau_da_tinh'] },
  'Cô Thần':    { yNghia: 'Mặt tốt: mỗi người giữ được không gian riêng. Mặt xấu: dễ cô đơn ngay trong hôn nhân, ít tâm sự, sống cạnh nhau mà xa cách.', loai: 'yeu', trongSo: 1.0, tags: ['hon_nhan_co_don'] },
  'Quả Tú':     { yNghia: 'Mặt tốt: hai người tự lập, không dựa dẫm nhau. Mặt xấu: dễ có giai đoạn vợ chồng ở xa nhau, tình cảm nguội dần và thấy lẻ loi.', loai: 'yeu', trongSo: 1.0, tags: ['hon_nhan_xa_cach'] },
  'Tang Môn':   { yNghia: 'Mặt tốt: hai người cùng nhau đi qua chuyện buồn thì gắn bó hơn. Mặt xấu: hôn nhân dễ có giai đoạn nặng nề, buồn phiền, chuyện không vui từ gia đình hai bên.', loai: 'yeu', trongSo: 0.9, tags: ['hon_nhan_buon'] },
  'Bạch Hổ':    { yNghia: 'Mặt tốt: bạn đời gan dạ, chịu được việc nặng. Mặt xấu: sức khỏe bạn đời dễ có vấn đề, dễ gặp va chạm, tai nạn hoặc hai người xung khắc gay gắt.', loai: 'yeu', trongSo: 1.0, tags: ['suc_khoe_phoi_ngau'] },
  'Thiên Hình': { yNghia: 'Bạn đời của bạn nghiêm khắc, kỷ luật — có thể làm ngành luật, y, quân đội; mặt trái là khắt khe, ít mềm mỏng, dễ làm bạn thấy bị phán xét.', loai: 'trung', trongSo: 0.8, tags: ['phoi_ngau_nghiem_khac'] }
};

/**
 * KHO VĂN CHO CUNG PHU THÊ — 6 nhóm tính cách.
 * Mỗi nhóm có 5 đoạn: Tóm tắt, Người bạn đời, Kiểu hôn nhân, Điều lưu ý, Lời khuyên.
 */
var TUVI_VAN_PHUTHE = {

  // NHÓM A — Uy quyền (Tử Vi, Thái Dương, Thiên Tướng)
  'A': {
    tomTat: 'Hôn nhân của bạn thuộc nhóm "uy quyền" — bạn đời thuộc mẫu người có uy, tự trọng cao, sống nguyên tắc. Mặt tốt: gia đình có trụ cột, có nề nếp. Mặt xấu: bạn đời dễ gia trưởng, khó nhận sai, và tiếng nói của bạn dễ bị lấn át.',
    nguoiBanDoi: 'Bạn đời của bạn có khí chất của người đứng đầu — tự trọng cao, chững chạc, thích được tôn trọng. Họ thường giữ vai trò chủ động trong gia đình, có trách nhiệm với vợ/chồng và con cái. Theo cách luận truyền thống, người này thường toát lên vẻ đàng hoàng, đường bệ — bạn hãy đối chiếu với thực tế.',
    kieuHonNhan: 'Hôn nhân của bạn có xu hướng ổn định — hai người dễ thống nhất về mục tiêu gia đình. Mặt xấu: bạn đời hay gia trưởng, quyết thay cả nhà; nếu bạn cũng cứng thì dễ thành tranh quyền, nếu bạn mềm thì dễ thấy mình bị coi nhẹ.',
    dieuLuuY: 'Sự tự trọng cao của bạn đời khiến họ khó nhận sai, khó nói lời xin lỗi; chuyện nhỏ dễ bị đẩy thành xung đột lớn vì không ai chịu xuống nước.',
    loiKhuyen: [
      'Tôn trọng không gian riêng và vị trí của bạn đời.',
      'Chủ động bày tỏ cảm xúc bằng lời.',
      'Khi có mâu thuẫn, hãy nói về vấn đề, không nói về con người.'
    ]
  },

  // NHÓM B — Trí tuệ (Thiên Cơ, Cự Môn, Thái Âm)
  'B': {
    tomTat: 'Hôn nhân của bạn thuộc nhóm "trí tuệ" — bạn đời là người thông minh, nhạy cảm. Mặt tốt: hôn nhân có nhiều trao đổi sâu sắc. Mặt xấu: hay tranh luận, nghĩ nhiều, dễ nghi ngờ và tổn thương nhau bằng lời.',
    nguoiBanDoi: 'Bạn đời của bạn có đầu óc nhạy bén, thích tìm hiểu và có trực giác tốt. Họ quan sát tinh tế, biết cách an ủi người khác bằng lời nói. Theo cách luận truyền thống, người này thường có dáng vẻ thanh tú, tri thức — bạn hãy đối chiếu với thực tế.',
    kieuHonNhan: 'Hôn nhân của bạn thiên về trò chuyện và chia sẻ suy nghĩ hơn là những cử chỉ lãng mạn. Hai người dễ hiểu nhau khi trò chuyện thẳng thắn, nhưng bạn đời hay nói quá nhiều hoặc suy nghĩ quá nhiều khiến bạn thấy mệt, và những cuộc tranh luận dễ kéo dài thành bất hòa.',
    dieuLuuY: 'Bạn đời của bạn dễ bị ảnh hưởng bởi cảm xúc và lời nói của người khác. Người ngoài dễ xen vào chuyện gia đình và gây hiểu lầm giữa hai người. Bạn đời có lúc ăn nói sắc quá mức khiến bạn hoặc người xung quanh tổn thương.',
    loiKhuyen: [
      'Lắng nghe nhiều hơn nói.',
      'Tạo không gian yên tĩnh cho bạn đời mỗi khi họ cần suy nghĩ.',
      'Đôi khi hãy nói bằng hành động thay vì lời.'
    ]
  },

  // NHÓM C — Thực tế (Vũ Khúc, Thiên Phủ, Thiên Đồng, Liêm Trinh)
  'C': {
    tomTat: 'Hôn nhân của bạn thuộc nhóm "thực tế" — bạn đời thuộc mẫu người đáng tin, giỏi lo liệu. Mặt tốt: hôn nhân vững về vật chất. Mặt xấu: dễ khô khan, ít lãng mạn, và tiền bạc hay thành chuyện căng giữa hai người.',
    nguoiBanDoi: 'Bạn đời của bạn là người thực tế, chín chắn, không thích viển vông. Họ coi trọng sự ổn định, biết quản lý tiền bạc, và làm gì cũng có kế hoạch. Theo cách luận truyền thống, người này thường có vẻ điềm tĩnh, nghiêm túc. Họ có thể hơi ít nói về chuyện tình cảm, nhưng thể hiện tình yêu bằng hành động thiết thực.',
    kieuHonNhan: 'Hôn nhân của bạn vững vàng và ổn định — hai người cùng nhau xây dựng tài chính, con cái, nhà cửa. Ít sóng gió lớn, nhưng cũng ít những bất ngờ lãng mạn. Đây là kiểu hôn nhân "cơm sôi, canh ngọt" — bền bỉ và ấm áp nhưng không ồn ào.',
    dieuLuuY: 'Bạn đời của bạn có xu hướng coi trọng vật chất, đôi khi đánh giá mọi việc bằng giá trị hữu hình. Hôn nhân dễ trở thành kiểu "hợp tác làm ăn", thiếu tình cảm, và bạn có lúc thấy mình được đối xử như một khoản chi. Ngoài ra bạn đời có thể cứng nhắc, khó tính.',
    loiKhuyen: [
      'Tạo thêm những khoảnh khắc lãng mạn nhỏ.',
      'Đừng để chuyện tiền bạc trở thành trung tâm của mọi cuộc trò chuyện.',
      'Khen ngợi bạn đời thường xuyên.'
    ]
  }

  ,

  // NHÓM D — Quyết liệt (Thất Sát, Phá Quân)
  'D': {
    tomTat: 'Hôn nhân của bạn thuộc nhóm "quyết liệt" — bạn đời thuộc mẫu người cá tính mạnh. Mặt tốt: hôn nhân đầy đam mê, không nhàm chán. Mặt xấu: nhiều biến động, cãi vã gay gắt, có thể chia xa hoặc đổ vỡ rồi làm lại.',
    nguoiBanDoi: 'Bạn đời của bạn là người mạnh mẽ, quyết đoán, không chịu khuất phục. Họ sống mãnh liệt, yêu ghét rõ ràng, và sẵn sàng đương đầu với khó khăn. Theo cách luận truyền thống, người này thường toát lên vẻ mạnh mẽ, có uy tự nhiên. Họ có thể hơi nóng tính, nhưng cũng rất trung thành với người họ đã chọn.',
    kieuHonNhan: 'Hôn nhân của bạn có nhiều chuyển động nhưng cũng đầy cảm xúc — không nhàm chán, không tẻ nhạt. Hai người bất đồng thẳng thắn và cũng nhanh làm lành. Mặt xấu: cái tôi của cả hai đều lớn, những trận cãi để lại vết, và hôn nhân dễ có giai đoạn ly thân hoặc suýt tan vỡ.',
    dieuLuuY: 'Cả hai đều có xu hướng nóng nảy và muốn mình đúng — dễ dẫn đến những cuộc cãi vã không đáng có. Bạn đời có thể có giai đoạn thay đổi lớn trong sự nghiệp hoặc cuộc sống, kéo hôn nhân chao đảo theo. Sức khỏe của bạn đời cũng dễ hao mòn vì sống quá sức.',
    loiKhuyen: [
      'Hạ giọng trước khi nói.',
      'Đừng bao giờ dùng lời nói để làm tổn thương nhau.',
      'Có ít nhất 1 sở thích chung.'
    ]
  },

  // NHÓM E — Đa tài (Tham Lang, Thiên Lương)
  'E': {
    tomTat: 'Hôn nhân của bạn thuộc nhóm "đa tài" — bạn đời thuộc mẫu người phong phú, thú vị. Mặt tốt: hôn nhân nhiều trải nghiệm, không tẻ nhạt. Mặt xấu: dễ có người thứ ba, ghen tuông và những lần niềm tin bị lung lay.',
    nguoiBanDoi: 'Bạn đời của bạn là người đa tài, có sức hút tự nhiên, dễ được người khác yêu mến. Họ ham học hỏi, thích trải nghiệm và có nhiều mối quan tâm khác nhau. Theo cách luận truyền thống, người này thường có sức hút hoặc phong cách riêng. Họ có thể vừa dịu dàng, vừa khó đoán.',
    kieuHonNhan: 'Hôn nhân của bạn phong phú và thú vị — không bao giờ nhàm chán vì bạn đời luôn có điều mới để chia sẻ. Hai người dễ dàng hòa hợp về mặt cảm xúc và trải nghiệm. Mặt xấu: bạn đời có sức hút và nhiều mối quan hệ, nên hôn nhân thường xuyên đối mặt với cám dỗ, ghen tuông và nghi ngờ.',
    dieuLuuY: 'Bạn đời của bạn dễ bị phân tán vì thích nhiều thứ cùng lúc — đôi khi không dành đủ thời gian cho gia đình. Chuyện "đào hoa" (nhiều người để ý, dễ vướng tình cảm ngoài luồng) là điểm yếu thật của hôn nhân này: nhiều người theo đuổi, và bạn đời không phải lúc nào cũng giữ được khoảng cách. Một số người bạn đời kiểu này còn hay che chở người ngoài nhiều hơn vợ/chồng.',
    loiKhuyen: [
      'Tôn trọng sự đa dạng của bạn đời.',
      'Xây dựng sự tin tưởng bằng hành động cụ thể, không chỉ bằng lời nói.',
      'Cùng nhau trải nghiệm điều mới.'
    ]
  },

  // NHÓM F — Vô chính diệu
  'F': {
    tomTat: 'Hôn nhân của bạn thuộc nhóm đặc biệt — phần hôn nhân trên lá số để trống (không có sao chính). Hôn nhân phụ thuộc nhiều vào hoàn cảnh và chính bản thân bạn.',
    nguoiBanDoi: 'Bạn đời của bạn là người khó đoán — họ có thể thay đổi tùy hoàn cảnh, không có một bản chất cố định nào. Mặt tốt: họ linh hoạt, dễ thích nghi. Mặt xấu: khó đoán, có lúc bạn không biết họ thật sự nghĩ gì, và người bạn cưới có thể khác hẳn người bạn từng quen. Theo cách luận truyền thống, người này thường toát lên vẻ dễ chịu, dễ gần.',
    kieuHonNhan: 'Hôn nhân của bạn phụ thuộc rất nhiều vào hoàn cảnh bên ngoài — nếu môi trường tốt, hôn nhân sẽ tốt; nếu có biến động, hôn nhân dễ lung lay theo, thậm chí rạn vỡ khi gặp cú sốc lớn về tiền bạc hay nơi ở. Mặt được là hôn nhân không bị đóng khung, hai người có thể tự định hình nó.',
    dieuLuuY: 'Vì cung hôn nhân trống (không có sao chính), bạn dễ bị cuốn theo cảm xúc của bạn đời — khi họ vui bạn vui, khi họ buồn bạn buồn, và dễ đánh mất mình trong hôn nhân. Bạn cũng dễ chọn nhầm người vì lá số không cho một hình mẫu rõ.',
    loiKhuyen: [
      'Dành thời gian tìm hiểu kỹ trước khi kết hôn.',
      'Giữ một phần cuộc sống riêng (sở thích, bạn bè, sự nghiệp).',
      'Chủ động tạo dựng hạnh phúc thay vì chờ đợi.'
    ]
  }

};
/* ============================================================
 *  BẢNG DỮ LIỆU RIÊNG CHO CUNG TÀI BẠCH (tiền bạc)
 *  Chủ thể là BẢN THÂN — tập trung vào cách kiếm & giữ tiền
 * ============================================================ */

/**
 * Ý nghĩa 14 chính tinh tại cung Tài Bạch.
 * Mỗi entry gồm 2 phần: cách kiếm tiền + cách giữ tiền.
 */
var TUVI_FACT_TAIBACH_CHINHTINH = {
  'Tử Vi': {
    yNghia: 'Bạn kiếm tiền nhờ uy tín và vị trí — tài chính thường đến từ vai trò lãnh đạo, quản lý, hoặc từ các mối quan hệ cấp cao. Mặt trái là chi nhiều cho thể diện, vị thế, và khi mất vị trí thì nguồn thu dễ hụt theo.',
    trongSo: 1.5, tags: ['tai_chinh_uy_tin', 'tich_luy_ben_vung']
  },
  'Thiên Cơ': {
    yNghia: 'Bạn kiếm tiền bằng trí tuệ, sự nhanh nhạy và khả năng phân tích — thu nhập thường biến động, có thể đến từ nhiều nguồn khác nhau. Mặt trái là tiền vào không đều, có tháng hụt, và hay đổi hướng làm ăn nên khó tích lũy lớn.',
    trongSo: 1.4, tags: ['tai_chinh_tri_tue', 'thu_nhap_bien_dong']
  },
  'Thái Dương': {
    yNghia: 'Bạn kiếm tiền nhờ danh tiếng và sự nổi bật — tài chính thường gắn với hình ảnh công chúng hoặc uy tín xã hội. Mặt trái là chi tiêu rộng tay vì thể diện, cho mượn dễ, và tiền làm ra nhiều mà giữ lại ít.',
    trongSo: 1.5, tags: ['tai_chinh_danh_tieng', 'chi_tieu_rong_rai']
  },
  'Vũ Khúc': {
    yNghia: 'Bạn kiếm tiền bằng sự cương nghị và quyết đoán — đây là tài tinh, rất giỏi kiếm và giữ tiền. Bạn thường tự gây dựng tài sản bằng nỗ lực của mình. Mặt trái là quá đặt nặng tiền, làm quá sức và dễ lạnh nhạt với người thân vì mải kiếm.',
    trongSo: 1.7, tags: ['tai_chinh_vung_manh', 'tu_luc_giau_co']
  },
  'Thiên Đồng': {
    yNghia: 'Tài chính của bạn thường trải qua giai đoạn đầu vất vả, sau đó mới ổn định và khá lên — đây là kiểu "tiền hung hậu cát" (trước khó sau dễ). Mặt trái là thời trẻ dễ túng thiếu, và tính an phận khiến bạn chậm nắm cơ hội tăng thu nhập.',
    trongSo: 1.3, tags: ['tai_chinh_tien_kho', 'hau_van_kha']
  },
  'Liêm Trinh': {
    yNghia: 'Mặt tốt: bạn làm tiền có nguyên tắc, kỷ luật chi tiêu tốt. Mặt xấu: kiếm tiền vất vả, nhiều trắc trở, dễ vướng tranh chấp hoặc rắc rối pháp lý nếu làm ăn không rõ ràng.',
    trongSo: 1.4, tags: ['tai_chinh_vat_va', 'can_lam_an_minh_bach']
  },
  'Thiên Phủ': {
    yNghia: 'Bạn thuộc mẫu người giỏi tích lũy — biết cách quản lý chi tiêu và giữ của. Mặt trái là quá thận trọng, giữ tiền chặt đến mức bỏ lỡ cơ hội sinh lời và bị cho là keo kiệt.',
    trongSo: 1.6, tags: ['tai_chinh_kho_loc', 'tich_luy_dao_dao']
  },
  'Thái Âm': {
    yNghia: 'Bạn giàu nhờ tích góp và các tài sản cố định (nhà đất, vàng bạc). Tài chính thường đến từ nguồn thu nhập phụ ổn định, hoặc có thể từ tài sản gia đình. Mặt trái là tiền đến chậm, ngại mạo hiểm, và dễ lo âu khi thu nhập không chắc chắn.',
    trongSo: 1.5, tags: ['tai_chinh_dien_san', 'tich_gop']
  },
  'Tham Lang': {
    yNghia: 'Bạn kiếm tiền nhanh qua giao tế, kinh doanh, và các cơ hội xã hội — nhưng cũng chi tiêu nhanh. Mặt xấu: tiền hay đổ vào ăn chơi, hưởng thụ, quan hệ, nên thường "kiếm nhiều mà vẫn thiếu".',
    trongSo: 1.4, tags: ['tai_chinh_giao_te', 'kiem_nhanh_tieu_nhanh']
  },
  'Cự Môn': {
    yNghia: 'Bạn kiếm tiền bằng lời nói, lý luận, hoặc các nghề liên quan đến giao tiếp. Mặt xấu: tiền bạc dễ vướng tranh chấp, cãi cọ, hợp đồng rắc rối và mất tiền vì lời hứa miệng.',
    trongSo: 1.3, tags: ['tai_chinh_ngon_luan', 'can_giay_to']
  },
  'Thiên Tướng': {
    yNghia: 'Tài chính của bạn đủ đầy và ổn định — tiền đến từ công việc chính thức, có uy tín. Mặt trái là hay gánh tiền cho người thân, bạn bè, và khó giàu đột phá vì thiên về lương ổn định.',
    trongSo: 1.5, tags: ['tai_chinh_on_dinh', 'hao_phong_co_chung']
  },
  'Thiên Lương': {
    yNghia: 'Bạn có lộc ấm — tài chính thường đến từ nguồn thừa hưởng, hoặc từ công việc có tính chất phục vụ, che chở. Mặt xấu: đầu cơ thường thua, tiền dễ đội nón ra đi vì giúp người khác, và hiếm khi giàu nhanh.',
    trongSo: 1.4, tags: ['tai_chinh_loc_am', 'khong_nen_dau_co']
  },
  'Thất Sát': {
    yNghia: 'Bạn kiếm tiền từ sự mạo hiểm và các cơ hội táo bạo — tài chính thường lúc được lúc mất. Mặt xấu: có những lần mất lớn vì liều, dồn vốn một chỗ, và giai đoạn trắng tay phải gây dựng lại.',
    trongSo: 1.4, tags: ['tai_chinh_mao_hiem', 'luc_duoc_luc_mat']
  },
  'Phá Quân': {
    yNghia: 'Mặt tốt: bạn kiếm được nhiều, dám mở hướng mới. Mặt xấu: tiêu cũng nhiều, tài chính thăng trầm, ít khi ổn định và dễ mất tiền vì đầu tư cảm tính.',
    trongSo: 1.4, tags: ['tai_chinh_thang_tram', 'can_ky_luat']
  }
};

/**
 * Ý nghĩa phụ tinh đặc thù tại cung Tài Bạch.
 */
var TUVI_FACT_TAIBACH_PHUTINH = {
  // Cát tinh — tài lộc
  'Lộc Tồn':    { yNghia: 'Tiền vào đều đặn, bạn biết cách tiết kiệm và giữ của. Mặt trái là chặt chẽ quá, ngại đầu tư và khó có cú tăng lớn.', loai: 'manh', trongSo: 1.7, tags: ['tai_loc', 'tiet_kiem'] },
  'Hóa Lộc':    { yNghia: 'Tài lộc hanh thông, nhiều cơ hội kiếm tiền mới mở ra. Mặt trái là tiền dễ đến thì dễ tiêu, và dễ ôm quá nhiều việc cùng lúc.', loai: 'manh', trongSo: 1.7, tags: ['tai_loc', 'nhieu_nguon'] },
  'Hóa Quyền':  { yNghia: 'Bạn chủ động nắm quyền quản lý tài chính, tiền thường đến từ vị trí có trách nhiệm.', loai: 'manh', trongSo: 1.5, tags: ['tai_chinh_chu_dong'] },
  'Hóa Khoa':   { yNghia: 'Kiếm tiền bằng danh tiếng và học vấn. Khi khó khăn tài chính thường có người giúp.', loai: 'manh', trongSo: 1.4, tags: ['tai_chinh_danh_tieng'] },
  'Thiên Mã':   { yNghia: 'Kiếm tiền nhờ di chuyển, đi xa, buôn bán hoặc kinh doanh ở nơi khác.', loai: 'manh', trongSo: 1.1, tags: ['tai_chinh_di_chuyen'] },
  'Đào Hoa':    { yNghia: 'Tiền có thể đến qua các mối quan hệ tình cảm, giao tế hoặc nghề nghiệp liên quan đến sắc đẹp, nghệ thuật.', loai: 'manh', trongSo: 0.9, tags: ['tai_chinh_giao_te'] },

  // Sao khác — có thể tốt hoặc cần chú ý
  'Vũ Khúc':    { yNghia: 'Tiền bạc là thế mạnh tự nhiên của bạn. Bạn có tố chất làm kinh tế, giỏi kiếm và giữ tiền.', loai: 'manh', trongSo: 1.8, tags: ['tai_chinh_vung_manh'] },
  'Thiên Phủ':  { yNghia: 'Như kho trời đóng tại cung tiền, tài chính ổn định và biết tích lũy lâu dài.', loai: 'manh', trongSo: 1.6, tags: ['tai_chinh_on_dinh'] },
  'Đại Hao':    { yNghia: 'Chi tiêu lớn, khó giữ tiền, có những khoản hao hụt nặng ngoài dự tính.', loai: 'yeu', trongSo: 1.1, tags: ['chi_tieu_lon'] },
  'Tiểu Hao':   { yNghia: 'Tiền rò rỉ qua những khoản chi lặt vặt cộng dồn lại, cuối tháng thường không rõ tiền đi đâu.', loai: 'yeu', trongSo: 0.8, tags: ['hao_hut_nho'] },

  // Hung tinh — rủi ro tài chính
  'Kình Dương': { yNghia: 'Kiếm tiền bằng cạnh tranh, nhưng dễ xảy ra tranh chấp tiền bạc, mất tiền khi cho vay hoặc hùn vốn với người khác.', loai: 'yeu', trongSo: 1.3, tags: ['tranh_chap_tien'] },
  'Đà La':      { yNghia: 'Tiền bạc dây dưa, khó dứt khoát. Việc thu nợ hoặc đòi tiền thường kéo dài.', loai: 'yeu', trongSo: 1.2, tags: ['tien_bac_day_dua'] },
  'Hỏa Tinh':   { yNghia: 'Tài chính lên xuống nhanh theo cả hai hướng: có lúc được bất ngờ, nhưng cũng dễ mất nhanh vì quyết tiền lớn trong lúc nóng.', loai: 'yeu', trongSo: 1.1, tags: ['tai_chinh_bung_no'] },
  'Linh Tinh':  { yNghia: 'Tài chính âm ỉ khó khăn, túng thiếu kéo dài và hay có khoản lo lắng không dứt.', loai: 'yeu', trongSo: 1.1, tags: ['tai_chinh_kho_khan'] },
  'Địa Không':  { yNghia: 'Tiền đến rồi đi, đầu cơ hay mất trắng, cho vay khó đòi lại. Mặt được là bạn có ý tưởng kiếm tiền khác người.', loai: 'yeu', trongSo: 1.2, tags: ['tien_den_roi_di', 'tranh_dau_co'] },
  'Địa Kiếp':   { yNghia: 'Dễ mất tiền đột ngột qua khoản chi bất ngờ, cho vay hoặc đầu tư rủi ro cao; có giai đoạn hao hụt nặng.', loai: 'yeu', trongSo: 1.3, tags: ['mat_tien_dot_ngot'] },
  'Hóa Kỵ':     { yNghia: 'Tiền bạc dễ dây dưa, nợ nần, bị hiểu lầm về tài chính và vướng rắc rối giấy tờ, hợp đồng liên quan đến tiền.', loai: 'yeu', trongSo: 1.5, tags: ['no_nan', 'giay_to_tien'] }
};

/**
 * KHO VĂN CHO CUNG TÀI BẠCH — 5 nhóm tính cách (A, B, C, D, F).
 * Mỗi nhóm có 6 đoạn: Tóm tắt, Cách kiếm tiền, Cách giữ tiền, 
 * Cơ hội, Rủi ro, Lời khuyên.
 */
var TUVI_VAN_TAIBACH = {

  // NHÓM A — Tài tinh (Tử Vi, Vũ Khúc, Thiên Phủ, Thái Âm)
  'A': {
    tomTat: 'Tài chính của bạn thuộc nhóm "tài tinh" — bạn có tố chất làm kinh tế, giỏi kiếm và giữ tiền. Mặt xấu: bảo thủ với tiền, dễ bỏ lỡ cơ hội lớn, và có xu hướng để tiền chi phối các mối quan hệ.',
    cachKiem: 'Bạn kiếm tiền bằng năng lực thật và sự chăm chỉ — không ỷ lại vào may mắn hay người khác. Thu nhập thường đến từ công việc chính thức, có uy tín. Bạn cũng có khả năng nhìn ra cơ hội tài chính mà người khác bỏ qua, và biết cách tận dụng nó một cách thận trọng.',
    cachGiu: 'Bạn giữ tiền rất tốt — biết phân bổ thành các khoản khác nhau (chi tiêu, tiết kiệm, đầu tư), không tiêu hoang phí. Bạn cũng thích tích lũy tài sản có giá trị lâu dài như nhà đất, vàng bạc thay vì chỉ gửi tiết kiệm.',
    coHoi: 'Cơ hội tài chính của bạn thường đến từ việc đầu tư dài hạn và các mối quan hệ đáng tin cậy. Bạn hợp với việc tự kinh doanh, xây dựng tài sản lâu dài, hoặc giữ vị trí quản lý tài chính trong tổ chức.',
    ruiRo: 'Rủi ro chính là sự bảo thủ quá mức — đôi khi bạn bỏ lỡ cơ hội lớn vì quá thận trọng. Ngoài ra, bạn có thể bị "đóng băng" tài sản vào những khoản đầu tư không sinh lời, khiến tiền không luân chuyển.',
    loiKhuyen: [
      'Đa dạng hóa đầu tư.',
      'Đầu tư vào bản thân (học hỏi, sức khỏe, mở rộng quan hệ) cũng là một cách sinh lời lâu dài.',
      'Chấp nhận rủi ro có tính toán khi cơ hội đủ rõ.'
    ]
  },

  // NHÓM B — Trí tuệ (Thiên Cơ, Cự Môn, Thiên Tướng)
  'B': {
    tomTat: 'Tài chính của bạn thuộc nhóm "trí tuệ" — bạn kiếm tiền bằng đầu óc, sự phân tích và khả năng giao tiếp. Mặt tốt: thu nhập đa dạng, nhiều nguồn. Mặt xấu: biến động, khó tích lũy lớn và dễ mất tiền vì tin lời hứa hẹn.',
    cachKiem: 'Bạn kiếm tiền chủ yếu bằng kiến thức, kỹ năng phân tích và lời nói. Công việc phù hợp thường liên quan đến tư vấn, giảng dạy, luật, truyền thông, hoặc các ngành cần lý luận. Bạn có thể có nhiều nguồn thu nhập cùng lúc vì tính linh hoạt cao.',
    cachGiu: 'Bạn giữ tiền bằng cách tính toán kỹ lưỡng trước khi chi tiêu, không thích lãng phí. Tuy nhiên, vì tính hay thay đổi, bạn có thể khó duy trì một kế hoạch tài chính dài hạn. Bạn cần kỷ luật hơn trong việc tiết kiệm đều đặn.',
    coHoi: 'Cơ hội tài chính của bạn thường đến từ việc tận dụng tri thức và kỹ năng đặc thù — làm chuyên gia, cố vấn, hoặc phát triển sản phẩm dựa trên chuyên môn. Bạn cũng giỏi nhìn ra xu hướng thị trường trước người khác.',
    ruiRo: 'Rủi ro chính là sự phân tán — vì có nhiều ý tưởng và cơ hội, bạn dễ đầu tư vào quá nhiều thứ mà không tập trung vào cái nào. Ngoài ra, bạn có thể mất tiền vì tin vào những lời hứa hẹn hấp dẫn mà không kiểm chứng kỹ.',
    loiKhuyen: [
      'Chọn 1-2 lĩnh vực chính để tập trung.',
      'Kiểm chứng kỹ lưỡng trước khi đầu tư.',
      'Lập quỹ dự phòng 6 tháng chi tiêu.'
    ]
  },

  // NHÓM C — Thực tế - uy tín (Thiên Đồng, Thái Dương, Thiên Lương, Liêm Trinh)
  'C': {
    tomTat: 'Tài chính của bạn thuộc nhóm "thực tế - uy tín" — bạn kiếm tiền từ danh tiếng, sự phục vụ và công việc chính thức. Mặt tốt: về sau tài chính vững, bền. Mặt xấu: giai đoạn đầu vất vả, thu nhập thấp kéo dài và dễ bị người khác lợi dụng lòng tốt về tiền.',
    cachKiem: 'Bạn kiếm tiền nhờ uy tín và sự đáng tin cậy — người khác tìm đến bạn vì biết bạn làm việc có trách nhiệm. Công việc phù hợp thường liên quan đến phục vụ, giáo dục, y tế, hành chính, hoặc các lĩnh vực cần sự chính trực. Bạn không kiếm tiền bằng cách chộp giật.',
    cachGiu: 'Bạn giữ tiền bằng cách sống tiết kiệm và có kỷ luật — không tiêu vào những thứ không cần thiết. Bạn ưu tiên tích lũy cho tương lai hơn là hưởng thụ trước mắt. Tuy nhiên, đôi khi bạn hào phóng với người khác hơn với chính mình.',
    coHoi: 'Cơ hội tài chính của bạn thường đến từ các mối quan hệ lâu dài, uy tín tích lũy theo năm tháng. Càng lớn tuổi, tài chính của bạn càng vững — đây là kiểu "phát muộn nhưng bền". Bạn cũng hợp với các công việc có thu nhập ổn định, ít rủi ro.',
    ruiRo: 'Rủi ro chính là sự thiếu chủ động — bạn có xu hướng chờ đợi cơ hội đến thay vì tự tạo ra. Ngoài ra, bạn có thể bị lợi dụng lòng tốt — người khác vay tiền hoặc nhờ vả mà không trả, và bạn hay ngại đòi nên mất luôn khoản đó.',
    loiKhuyen: [
      'Chủ động tìm kiếm cơ hội thay vì chờ đợi.',
      'Học cách nói "không" với những lời vay mượn không chính đáng.',
      'Đầu tư sớm cho tương lai (bảo hiểm, quỹ hưu trí).'
    ]
  }

  ,

  // NHÓM D — Mạo hiểm (Thất Sát, Phá Quân, Tham Lang)
  'D': {
    tomTat: 'Tài chính của bạn thuộc nhóm "mạo hiểm" — bạn có xu hướng kiếm tiền từ những cơ hội táo bạo. Mặt tốt: có thể có những cú thắng lớn. Mặt xấu: tài vận thăng trầm, có những lần mất lớn, nợ nần hoặc phải làm lại từ đầu.',
    cachKiem: 'Bạn kiếm tiền bằng sự quyết đoán và dám thử những điều mới — không thích lối mòn, không chịu an phận. Thu nhập thường đến từ kinh doanh, đầu tư, hoặc những lĩnh vực có tính cạnh tranh cao. Bạn có khả năng nhìn ra cơ hội lớn và dám dấn thân, đôi khi vượt qua cả người có vốn nhiều hơn.',
    cachGiu: 'Bạn giữ tiền không giỏi bằng kiếm tiền — dễ tiêu vào những thứ lớn, đầu tư cảm tính, hoặc bị cuốn theo những cơ hội hấp dẫn. Cần kỷ luật tài chính chặt chẽ: tách rõ vốn đầu tư và tiền sinh hoạt, không dùng lẫn lộn.',
    coHoi: 'Cơ hội tài chính lớn của bạn thường đến từ việc nắm bắt xu hướng mới, mở rộng thị trường, hoặc kinh doanh trong lĩnh vực ít cạnh tranh. Bạn hợp với vai trò tiên phong — người mở đường, người khai phá. Cái giá là càng dấn thân thì mức rủi ro càng lớn theo.',
    ruiRo: 'Rủi ro chính là sự thiếu kiên nhẫn — bạn dễ bỏ dở giữa chừng khi chưa thấy kết quả, hoặc đầu tư quá nhiều vào một cơ hội chưa chín muồi, dẫn tới thua lỗ nặng, nợ nần và mất cả vốn sinh hoạt.',
    loiKhuyen: [
      'Giữ một quỹ dự phòng trước khi thử những việc nhiều rủi ro.',
      'Đừng dồn hết mọi thứ vào một hướng dù bạn tin chắc đến đâu.',
      'Đặt mục tiêu rõ trước khi bắt đầu, và biết dừng khi đã đạt.'
    ]
  },

  // NHÓM F — Vô chính diệu
  'F': {
    tomTat: 'Tài chính của bạn thuộc nhóm đặc biệt — phần tiền bạc trên lá số để trống (không có sao chính). Mặt tốt: kiếm tiền linh hoạt, nhiều ngả. Mặt xấu: tài chính phụ thuộc hoàn cảnh, dễ dao động và hao hụt khi môi trường xấu đi.',
    cachKiem: 'Bạn kiếm tiền theo cách linh hoạt, không có một mô hình cố định. Thu nhập có thể đến từ nhiều nguồn khác nhau tùy từng giai đoạn cuộc đời. Bạn dễ thích nghi với môi trường mới và có thể thành công trong nhiều lĩnh vực, nhưng cần tránh việc "đứng núi này trông núi nọ" khiến không đi đến đâu.',
    cachGiu: 'Bạn giữ tiền phụ thuộc vào cung đối chiếu (Phúc Đức) và các cung tam hợp — nếu các cung này tốt thì tài chính ổn định, nếu không thì dễ hao hụt. Đặc biệt, bạn cần một người cố vấn tài chính đáng tin cậy — vì bản thân bạn dễ dao động.',
    coHoi: 'Cơ hội tài chính của bạn thường đến bất ngờ, từ những mối quan hệ hoặc hoàn cảnh bạn không ngờ tới. Bạn hợp với vai trò kết nối — làm trung gian, môi giới, hoặc phát triển trong môi trường đa dạng. Càng giao tiếp rộng, bạn càng có cơ hội tốt.',
    ruiRo: 'Rủi ro chính là sự phụ thuộc vào người khác — bạn dễ bị cuốn theo những lời khuyên đầu tư thiếu chính xác, hoặc để người khác quản lý tiền của mình rồi mất tiền vì tin nhầm người.',
    loiKhuyen: [
      'Xây dựng mối quan hệ với 1-2 người cố vấn tài chính đáng tin.',
      'Luôn kiểm chứng thông tin trước khi đầu tư.',
      'Đặt mục tiêu tài chính rõ ràng theo từng giai đoạn 3-5 năm.'
    ]
  }

};

/* ============================================================
 *  BẢNG DỮ LIỆU RIÊNG CHO CUNG QUAN LỘC (sự nghiệp)
 *  Chủ thể là BẢN THÂN — tập trung nghề nghiệp & công danh
 * ============================================================ */

/**
 * Ý nghĩa 14 chính tinh tại cung Quan Lộc.
 * Mỗi entry gồm: nghề nghiệp phù hợp + đặc điểm sự nghiệp + môi trường.
 */
var TUVI_FACT_QUANLOC_CHINHTINH = {
  'Tử Vi': {
    yNghia: 'Bạn thuộc mẫu người phù hợp với vai trò lãnh đạo, quản lý — có tố chất tổ chức và điều hành. Mặt xấu: khó làm dưới quyền người khác, dễ va chạm cấp trên, và hay hụt hẫng khi không được trao quyền.',
    trongSo: 1.6, tags: ['nghe_lanh_dao', 'moi_truong_to_chuc', 'thang_tien_cao']
  },
  'Thiên Cơ': {
    yNghia: 'Bạn phù hợp với nghề cần trí tuệ và phân tích — kỹ thuật, kế hoạch, tư vấn, công nghệ, nghiên cứu, hoặc thiết kế hệ thống. Sự nghiệp thường phát triển qua chuyên môn sâu. Mặt xấu: hay đổi việc, dễ chán, nghĩ nhiều mà ít quyết, và dễ làm phó hơn làm chính.',
    trongSo: 1.5, tags: ['nghe_chuyen_mon', 'thay_doi_cong_viec', 'tri_tue']
  },
  'Thái Dương': {
    yNghia: 'Bạn phù hợp với công việc công quyền, giáo dục, truyền thông, ngoại giao, hoặc các vị trí cần uy tín xã hội. Sự nghiệp thường rạng rỡ, được nhiều người biết đến. Mặt xấu: hay ôm việc, làm nhiều mà tiền không tương xứng, và dễ hao sức vì lo cho người khác.',
    trongSo: 1.6, tags: ['nghe_danh_tieng', 'moi_truong_xa_hoi', 'uy_tin_cao']
  },
  'Vũ Khúc': {
    yNghia: 'Bạn phù hợp với tài chính, ngân hàng, kinh doanh, kế toán, cơ khí, hoặc kỹ thuật — những lĩnh vực cần sự cương nghị và thực tế. Sự nghiệp thường tự gây dựng, hợp làm chủ. Mặt xấu: cứng nhắc, khó hợp tác, dễ cô độc ở vị trí cao và làm việc quá sức.',
    trongSo: 1.7, tags: ['nghe_tai_chinh', 'tu_luc_su_nghiep', 'lam_chu']
  },
  'Thiên Đồng': {
    yNghia: 'Bạn phù hợp với dịch vụ, văn hóa, y tế, giáo dục mầm non, hoặc các công việc nhẹ nhàng, ít áp lực. Mặt tốt: dễ hòa nhập, được đồng nghiệp quý. Mặt xấu: hay đổi nghề trước khi ổn định, ngại áp lực, và thăng tiến chậm vì thiếu tham vọng.',
    trongSo: 1.3, tags: ['nghe_dich_vu', 'moi_truong_nhe_nhang', 'hay_doi_nghe']
  },
  'Liêm Trinh': {
    yNghia: 'Bạn phù hợp với luật, quân đội, công an, quản trị, hoặc các lĩnh vực có kỷ luật cao. Sự nghiệp thường gắn với nguyên tắc, pháp lý, tổ chức chặt chẽ. Mặt xấu: dễ vướng tranh chấp, kiện tụng, va chạm cấp trên và mang tiếng khó tính.',
    trongSo: 1.5, tags: ['nghe_phap_luat', 'ky_luat_cao', 'can_giay_to']
  },
  'Thiên Phủ': {
    yNghia: 'Bạn phù hợp với quản lý tài sản, kế toán, kho vận, hành chính nhà nước, hoặc các vị trí giữ của trong tổ chức. Sự nghiệp thường ổn định, ít biến động, phát triển từ từ nhưng bền. Mặt xấu: ngại đổi mới, dễ bị đứng yên ở một vị trí quá lâu.',
    trongSo: 1.6, tags: ['nghe_quan_ly', 'on_dinh_ben_vung', 'moi_truong_to_chuc']
  },
  'Thái Âm': {
    yNghia: 'Bạn phù hợp với bất động sản, nghệ thuật, tài chính, hoặc các công việc liên quan đến làm đẹp, chăm sóc, giáo dục. Sự nghiệp thường phát triển nhờ sự tinh tế và khéo léo. Có thể thành công với công việc làm về đêm hoặc làm việc độc lập. Mặt xấu: thiếu quyết đoán, ngại cạnh tranh trực diện và dễ để người khác lấy công.',
    trongSo: 1.5, tags: ['nghe_nghe_thuat', 'thanh_cong_tinh_te', 'lam_doc_lap']
  },
  'Tham Lang': {
    yNghia: 'Bạn phù hợp với kinh doanh, giải trí, ngoại giao, ẩm thực, nghệ thuật, hoặc các ngành cần giao tiếp rộng. Sự nghiệp thường đa dạng, có thể làm nhiều nghề khác nhau trong đời. Mặt xấu: dàn trải, khó tinh một nghề và dễ sa vào tiệc tùng, quan hệ làm hỏng việc.',
    trongSo: 1.5, tags: ['nghe_kinh_doanh', 'giao_te_rong', 'da_nghe']
  },
  'Cự Môn': {
    yNghia: 'Bạn phù hợp với luật sư, giảng dạy, truyền thông, bán hàng, tư vấn, hoặc các nghề cần ăn nói và lý luận. Sự nghiệp thường phát triển nhờ khẩu tài và khả năng thuyết phục. Mặt xấu: hay vướng thị phi, bị nói xấu hoặc mất lòng người vì lời nói thẳng.',
    trongSo: 1.4, tags: ['nghe_ngon_luan', 'kheo_an_noi', 'can_tranh_thi_phi']
  },
  'Thiên Tướng': {
    yNghia: 'Bạn phù hợp với hành chính, nhân sự, thời trang, dịch vụ cao cấp, hoặc các vị trí cần uy nghi và chính trực. Sự nghiệp thường ổn định và được nể trọng. Mặt xấu: dễ gánh trách nhiệm thay người khác, bị lợi dụng sự tận tụy và chậm bứt lên.',
    trongSo: 1.5, tags: ['nghe_hanh_chinh', 'chinh_truc', 'duoc_ne_trong']
  },
  'Thiên Lương': {
    yNghia: 'Bạn phù hợp với y dược, giáo dục, bảo hiểm, tư vấn, hoặc các công việc có tính chất che chở, giúp đỡ người khác. Sự nghiệp thường phát triển nhờ uy tín và lòng nhân hậu, càng lớn tuổi càng được nể trọng. Mặt xấu: thời trẻ dễ chậm, thu nhập không cao, và hay ôm việc của người khác.',
    trongSo: 1.5, tags: ['nghe_y_te_giao_duc', 'uy_tin_tich_luy', 'phat_muon']
  },
  'Thất Sát': {
    yNghia: 'Bạn phù hợp với quân sự, kỹ thuật nặng, khởi nghiệp, hoặc các lĩnh vực cạnh tranh cao. Mặt tốt: có thể đạt thành tựu lớn nhờ dám làm. Mặt xấu: sự nghiệp nhiều biến động, có lúc thất bại nặng, dễ va chạm và dễ gặp tai nạn lao động nếu làm ngành nguy hiểm.',
    trongSo: 1.5, tags: ['nghe_mao_hiem', 'khoi_nghiep', 'trai_qua_thu_thach']
  },
  'Phá Quân': {
    yNghia: 'Bạn phù hợp với đổi mới, sáng tạo, xây dựng, kinh doanh mạo hiểm, hoặc các lĩnh vực cần phá cách. Sự nghiệp thường thay đổi nhiều lần — có thể đổi nghề, đổi chỗ làm, hoặc chuyển hướng lớn. Mặt xấu: thay đổi quá nhiều dễ dẫn tới thất bại, mất thành quả cũ và phải làm lại từ đầu.',
    trongSo: 1.5, tags: ['nghe_sang_tao', 'thay_doi_lon', 'can_ky_luat']
  }
};

/**
 * Ý nghĩa phụ tinh đặc thù tại cung Quan Lộc.
 */
var TUVI_FACT_QUANLOC_PHUTINH = {
  // Cát tinh — sự nghiệp thuận lợi
  'Hóa Quyền':  { yNghia: 'Bạn có uy trong công việc, dễ thăng chức, được giao quyền quyết định. Mặt trái là dễ bị ganh ghét, va chạm với người tranh quyền.', loai: 'manh', trongSo: 1.7, tags: ['thang_chuc', 'co_uy'] },
  'Hóa Khoa':   { yNghia: 'Danh tiếng nghề nghiệp, bằng cấp, học vấn được công nhận. Công việc dễ được nể trọng và có quý nhân giúp.', loai: 'manh', trongSo: 1.6, tags: ['danh_tieng', 'bang_cap'] },
  'Hóa Lộc':    { yNghia: 'Công việc sinh lợi, thu nhập tốt. Bạn có thể kiếm tiền từ chính công việc mình yêu thích.', loai: 'manh', trongSo: 1.6, tags: ['cong_viec_sinh_loi'] },
  'Quốc Ấn':    { yNghia: 'Có chức vụ, được giao ấn tín, trọng trách trong tổ chức. Sự nghiệp có tính chính danh cao.', loai: 'manh', trongSo: 1.5, tags: ['chuc_vu', 'an_tin'] },
  'Thai Phụ':   { yNghia: 'Được khen thưởng, công nhận trong công việc. Có thể được đề bạt, bổ nhiệm.', loai: 'manh', trongSo: 1.3, tags: ['duoc_khen_thuong'] },
  'Phong Cáo':  { yNghia: 'Được bằng khen, bổ nhiệm, có danh vị chính thức trong tổ chức.', loai: 'manh', trongSo: 1.3, tags: ['bang_khen', 'bo_nhiem'] },
  'Thiên Khôi': { yNghia: 'Cấp trên nâng đỡ, được người có quyền giúp đỡ trong sự nghiệp.', loai: 'manh', trongSo: 1.4, tags: ['quy_nhan_cap_tren'] },
  'Thiên Việt': { yNghia: 'Có cơ hội thăng tiến từ những mối quan hệ bên ngoài, hoặc được giới thiệu vào vị trí tốt.', loai: 'manh', trongSo: 1.4, tags: ['co_hoi_thang_tien'] },
  'Tả Phù':     { yNghia: 'Có người trợ lực trong công việc, làm việc nhóm hiệu quả, được đồng nghiệp ủng hộ.', loai: 'manh', trongSo: 1.2, tags: ['tro_luc', 'dong_nghiep_tot'] },
  'Hữu Bật':    { yNghia: 'Có cộng sự đắc lực, được lãnh đạo tin tưởng. Hợp làm việc trong tổ chức có cấu trúc.', loai: 'manh', trongSo: 1.2, tags: ['cong_su_tot'] },
  'Văn Xương':  { yNghia: 'Hợp với công việc văn thư, giấy tờ, học thuật, hoặc cần bằng cấp. Sự nghiệp gắn với tri thức.', loai: 'manh', trongSo: 1.2, tags: ['van_thu', 'hoc_thuat'] },
  'Văn Khúc':   { yNghia: 'Hợp với công việc giao tiếp, nghệ thuật, sáng tạo. Khéo léo trong ứng xử nơi công sở.', loai: 'manh', trongSo: 1.2, tags: ['giao_tiep', 'sang_tao'] },
  'Tướng Quân': { yNghia: 'Có uy trong công việc, hợp vai trò chỉ huy, lãnh đạo đội nhóm.', loai: 'manh', trongSo: 1.3, tags: ['uy_chi_huy'] },
  'Thiên Mã':   { yNghia: 'Công việc thường gắn với di chuyển, công tác xa, hoặc đổi chỗ làm nhiều lần.', loai: 'manh', trongSo: 1.1, tags: ['di_chuyen', 'doi_viec'] },
  'Đào Hoa':    { yNghia: 'Hợp với nghề cần giao tiếp, ngoại giao, hoặc liên quan đến cái đẹp, nghệ thuật.', loai: 'manh', trongSo: 1.0, tags: ['giao_te', 'dep'] },

  // Hung tinh — khó khăn trong sự nghiệp
  'Hóa Kỵ':     { yNghia: 'Công việc trắc trở, dễ bị đố kỵ, nói xấu, gặp thị phi và rắc rối giấy tờ; có giai đoạn bị đánh giá thấp dù đã cố.', loai: 'yeu', trongSo: 1.6, tags: ['cong_viec_trac_tro', 'thi_phi'] },
  'Kình Dương': { yNghia: 'Hợp với võ nghiệp, kỹ thuật, việc cần gan dạ; mặt xấu là cạnh tranh gay gắt, dễ va chạm đồng nghiệp và dễ bị thương khi làm việc.', loai: 'yeu', trongSo: 1.3, tags: ['canh_tranh', 'vo_nghiep'] },
  'Đà La':      { yNghia: 'Công việc trì trệ, thăng tiến chậm, hồ sơ và thủ tục hay bị ách lại kéo dài.', loai: 'yeu', trongSo: 1.2, tags: ['tri_tre', 'cham_thang_tien'] },
  'Hỏa Tinh':   { yNghia: 'Công việc có thể bùng nổ bất ngờ theo cả hai hướng: cơ hội lớn hoặc biến cố, mất việc, đổ vỡ do quyết định nóng.', loai: 'yeu', trongSo: 1.2, tags: ['bung_no'] },
  'Linh Tinh':  { yNghia: 'Công việc âm ỉ khó khăn, hay bức bối, mâu thuẫn ngầm với đồng nghiệp và khó thấy lối ra.', loai: 'yeu', trongSo: 1.1, tags: ['kho_khan_am_i'] },
  'Địa Không':  { yNghia: 'Hợp với nghề tự do, sáng tạo; mặt xấu là sự nghiệp dễ đổ vỡ bất ngờ, kế hoạch hay hỏng giữa chừng.', loai: 'yeu', trongSo: 1.2, tags: ['thay_doi_bat_ngo'] },
  'Địa Kiếp':   { yNghia: 'Sự nghiệp dễ có biến động lớn, mất việc hoặc phải chuyển hướng đột ngột; mặt được là bạn chịu được việc làm lại.', loai: 'yeu', trongSo: 1.3, tags: ['bien_co_su_nghiep'] },
  'Thiên Hình': { yNghia: 'Công việc nghiêm khắc, kỷ luật. Hợp với ngành luật, y, quân đội, hoặc công việc có tính pháp lý cao.', loai: 'trung', trongSo: 1.0, tags: ['ky_luat_cao', 'nghe_phap_ly'] },
  'Tang Môn':   { yNghia: 'Công việc hay có chuyện buồn phiền, bất mãn và tâm trạng nặng nề.', loai: 'yeu', trongSo: 0.9, tags: ['buon_cong_viec'] },
  'Bạch Hổ':    { yNghia: 'Dễ gặp tai nạn nghề nghiệp, va chạm hoặc tranh chấp pháp lý trong công việc; mặt được là bạn gan, dám nhận việc khó.', loai: 'yeu', trongSo: 1.0, tags: ['tai_nan_nghe'] }
};

/**
 * KHO VĂN CHO CUNG QUAN LỘC — 6 nhóm tính cách (A, B, C, D, E, F).
 * Mỗi nhóm có 7 đoạn: Tóm tắt, Nghề nghiệp, Môi trường, 
 * Thăng tiến, Khó khăn, Lời khuyên.
 */
var TUVI_VAN_QUANLOC = {

  // NHÓM A — Lãnh đạo (Tử Vi, Thái Dương, Thiên Tướng)
  'A': {
    tomTat: 'Sự nghiệp của bạn thuộc nhóm "lãnh đạo" — bạn có tố chất đứng đầu và phù hợp với vai trò quản lý. Mặt xấu: cái tôi lớn, dễ va chạm cấp trên, ôm quá nhiều trách nhiệm đến kiệt sức.',
    ngheNghiep: 'Bạn phù hợp với các vị trí quản lý, lãnh đạo, hành chính, nhà nước, giáo dục, hoặc truyền thông. Cụ thể, bạn có thể làm giám đốc, trưởng phòng, hiệu trưởng, hoặc các vị trí quản trị cấp cao. Bạn cũng hợp với các công việc cần uy tín xã hội và khả năng truyền cảm hứng cho người khác.',
    moiTruong: 'Môi trường lý tưởng của bạn là tổ chức có cấu trúc rõ ràng, nơi bạn được giao quyền quyết định và có không gian để thể hiện năng lực lãnh đạo. Bạn không hợp với môi trường quá nhỏ hẹp, thiếu cơ hội thăng tiến, hoặc nơi bạn bị kèm cặp quá mức.',
    thangTien: 'Con đường thăng tiến của bạn thường đi từ vị trí chuyên môn lên quản lý, sau đó lên cấp cao hơn. Bạn thường được đề bạt nhờ uy tín tích lũy và khả năng dẫn dắt tập thể. Đỉnh cao sự nghiệp có thể đến sau tuổi 40.',
    khoKhan: 'Khó khăn chính là cái tôi lớn — bạn có thể va chạm với cấp trên hoặc đồng nghiệp khi bất đồng quan điểm. Ngoài ra, bạn dễ gánh vác quá nhiều trách nhiệm, dẫn đến kiệt sức, và khó nhờ ai giúp vì sợ mất mặt.',
    loiKhuyen: [
      'Học cách lắng nghe và tôn trọng ý kiến khác biệt.',
      'Đừng cố gắng làm hết mọi việc.',
      'Xây dựng uy tín bằng hành động cụ thể, không chỉ bằng chức vụ.'
    ]
  },

  // NHÓM B — Chuyên môn (Thiên Cơ, Cự Môn, Thái Âm)
  'B': {
    tomTat: 'Sự nghiệp của bạn thuộc nhóm "chuyên môn" — bạn có xu hướng phát triển nhờ tri thức, sự phân tích và kỹ năng đặc thù. Mặt xấu: dễ chán, hay đổi việc, và có thể bị xem là khó gần, nặng lý thuyết.',
    ngheNghiep: 'Bạn phù hợp với các ngành cần trí tuệ và chuyên môn sâu: nghiên cứu, kỹ thuật, công nghệ, giảng dạy, luật, tư vấn, kế toán, hoặc thiết kế. Cụ thể, bạn có thể làm chuyên gia, nhà nghiên cứu, giáo viên, luật sư, kỹ sư, hoặc chuyên viên phân tích. Bạn không hợp với công việc tay chân đơn giản hoặc đòi hỏi sức lực.',
    moiTruong: 'Môi trường lý tưởng của bạn là nơi coi trọng chất xám, cho bạn không gian tự học và phát triển chuyên môn. Bạn hợp với môi trường học thuật, tổ chức nghiên cứu, hoặc công ty công nghệ. Không hợp môi trường đòi hỏi giao tiếp quá nhiều hoặc làm việc theo quy trình cứng nhắc.',
    thangTien: 'Con đường thăng tiến của bạn thường đi theo chiều sâu — từ nhân viên lên chuyên viên, chuyên gia, trưởng nhóm chuyên môn. Bạn cũng có thể mở công ty tư vấn hoặc làm freelancer khi đã đủ uy tín. Sự nghiệp có thể biến động vài lần trước khi ổn định.',
    khoKhan: 'Khó khăn chính là sự thiếu kiên nhẫn — bạn dễ chán khi công việc trở nên lặp lại, hoặc bỏ dở khi chưa thấy kết quả. Ngoài ra, bạn dễ bị xem là "khó gần" hoặc "lý thuyết suông", và vì thế bị gạt khỏi các vị trí cần quan hệ.',
    loiKhuyen: [
      'Chọn một lĩnh vực chuyên môn và đi thật sâu.',
      'Đầu tư vào bằng cấp và chứng chỉ chuyên môn.',
      'Học cách giao tiếp và chia sẻ kiến thức với người khác.'
    ]
  },

  // NHÓM C — Kinh doanh (Vũ Khúc, Thiên Phủ, Thiên Đồng)
  'C': {
    tomTat: 'Sự nghiệp của bạn thuộc nhóm "kinh doanh" — bạn phù hợp với các công việc liên quan đến tài chính, quản lý, hoặc tự làm chủ. Mặt tốt: phát triển dần, chắc. Mặt xấu: chậm, quá thận trọng nên hay lỡ thời cơ.',
    ngheNghiep: 'Bạn phù hợp với tài chính, ngân hàng, kế toán, quản lý tài sản, kinh doanh, hoặc các lĩnh vực thương mại. Cụ thể, bạn có thể làm giám đốc tài chính, kế toán trưởng, chủ doanh nghiệp, hoặc quản lý chuỗi cung ứng. Bạn cũng hợp với các công việc cần tính toán, quản lý nguồn lực, và ra quyết định dựa trên dữ liệu.',
    moiTruong: 'Môi trường lý tưởng của bạn là nơi công việc có cấu trúc rõ ràng, đo lường được kết quả, và có cơ hội phát triển thu nhập. Bạn hợp với công ty lớn, tổ chức tài chính, hoặc tự kinh doanh khi đã đủ vốn và kinh nghiệm. Không hợp môi trường hỗn loạn, thiếu quy tắc.',
    thangTien: 'Con đường thăng tiến của bạn thường từ nhân viên lên chuyên viên, sau đó lên quản lý và giám đốc. Nếu có ý định làm chủ, bạn nên tích lũy vốn và kinh nghiệm ít nhất 5-7 năm trước khi khởi nghiệp. Sự nghiệp thường phát triển chậm nhưng bền.',
    khoKhan: 'Khó khăn chính là sự chậm chạp — bạn có xu hướng thận trọng quá mức, bỏ lỡ cơ hội lớn vì chờ đợi điều kiện hoàn hảo. Ngoài ra, bạn dễ bị "tù túng" khi làm việc trong môi trường quá khuôn khổ, lâu dần mất động lực.',
    loiKhuyen: [
      'Đừng chờ đợi điều kiện hoàn hảo.',
      'Xây dựng mạng lưới quan hệ trong ngành.',
      'Nếu có ý định khởi nghiệp, hãy bắt đầu từ quy mô nhỏ rồi mở rộng.'
    ]
  }

  ,

  // NHÓM D — Tiên phong (Thất Sát, Phá Quân, Liêm Trinh)
  'D': {
    tomTat: 'Sự nghiệp của bạn thuộc nhóm "tiên phong" — bạn có xu hướng phù hợp với những công việc cần sự quyết liệt, dám đổi mới và không ngại thử thách. Mặt xấu: sự nghiệp lên xuống mạnh, dễ va chạm và có lúc thất bại nặng.',
    ngheNghiep: 'Bạn phù hợp với quân sự, công an, luật, kỹ thuật nặng, khởi nghiệp, hoặc các lĩnh vực cạnh tranh cao. Cụ thể, bạn có thể làm chỉ huy, giám đốc vận hành, kỹ sư xây dựng, chủ doanh nghiệp, hoặc chuyên gia cải cách. Bạn không hợp với công việc nhàm chán, lặp lại, hoặc bị gò bó quá mức.',
    moiTruong: 'Môi trường lý tưởng của bạn là nơi có tính cạnh tranh, cần sự quyết đoán, và cho phép bạn tự quyết định. Bạn hợp với startup, doanh nghiệp đang chuyển đổi, hoặc tổ chức có tính đột phá. Không hợp môi trường quan liêu, chậm chạp, hoặc đầy thủ tục rườm rà.',
    thangTien: 'Con đường thăng tiến của bạn thường gắn với những bước ngoặt lớn — có thể nhảy vọt, có thể tụt dốc mạnh và mất vị trí đang có. Bạn thường được giao trọng trách khi tổ chức cần cải cách hoặc cần người dám làm. Đỉnh cao sự nghiệp có thể đến bất ngờ sau tuổi 35.',
    khoKhan: 'Khó khăn chính là sự nóng nảy — bạn dễ va chạm với đồng nghiệp hoặc cấp trên khi bất đồng quan điểm. Ngoài ra, bạn dễ bị cuốn vào cạnh tranh mà quên mất mục tiêu dài hạn, và gây thù chuốc oán nơi làm việc.',
    loiKhuyen: [
      'Học cách chờ đợi đúng thời điểm.',
      'Xây dựng uy tín bằng kết quả cụ thể.',
      'Cẩn trọng với các mối quan hệ nơi công sở.'
    ]
  },

  // NHÓM E — Sáng tạo (Tham Lang, Thiên Lương)
  'E': {
    tomTat: 'Sự nghiệp của bạn thuộc nhóm "sáng tạo" — bạn phù hợp với công việc cần sự đa dạng, giao tiếp rộng, và cơ hội thể hiện bản thân. Mặt xấu: dàn trải, cảm hứng lên xuống, và dễ đổi nghề nhiều lần mà chưa tới đâu.',
    ngheNghiep: 'Bạn phù hợp với kinh doanh, giải trí, nghệ thuật, truyền thông, ngoại giao, giáo dục, y tế, hoặc các lĩnh vực phục vụ con người. Cụ thể, bạn có thể làm MC, diễn viên, nhà thiết kế, marketing, tư vấn, hoặc chuyên gia chăm sóc sức khỏe. Bạn không hợp với công việc đơn điệu hoặc ít tương tác với người khác.',
    moiTruong: 'Môi trường lý tưởng của bạn là nơi có nhiều người, nhiều ý tưởng, và bạn được tự do sáng tạo. Bạn hợp với agency, studio, trường học, bệnh viện, hoặc các tổ chức có văn hóa cởi mở. Không hợp môi trường cứng nhắc, ít giao tiếp, hoặc đòi hỏi sự im lặng kéo dài.',
    thangTien: 'Con đường thăng tiến của bạn thường đi qua nhiều vị trí khác nhau — bạn có thể đổi nghề 2-3 lần trước khi tìm được công việc thực sự phù hợp. Mỗi lần đổi tích thêm kỹ năng nhưng cũng mất thâm niên và thu nhập. Đỉnh cao sự nghiệp, nếu đến, thường đến muộn.',
    khoKhan: 'Khó khăn chính là sự phân tán — bạn dễ bị cuốn theo nhiều cơ hội cùng lúc mà không đi đến đâu. Ngoài ra, bạn dễ bị ảnh hưởng bởi cảm xúc — khi vui thì làm hết mình, khi buồn thì bỏ dở, nên uy tín dễ bị ảnh hưởng.',
    loiKhuyen: [
      'Chọn 1-2 nghề chính và đi sâu.',
      'Xây dựng thương hiệu cá nhân.',
      'Luôn giữ một khoản thu nhập ổn định ngoài công việc sáng tạo.'
    ]
  },

  // NHÓM F — Vô chính diệu (VCD)
  'F': {
    tomTat: 'Sự nghiệp của bạn thuộc nhóm đặc biệt — phần công việc trên lá số để trống (không có sao chính). Mặt tốt: linh hoạt, thích nghi nhiều nghề. Mặt xấu: dễ thiếu định hướng, sự nghiệp trồi sụt theo hoàn cảnh và người dẫn dắt.',
    ngheNghiep: 'Bạn phù hợp với những công việc linh hoạt, ít gò bó, và cho phép bạn thích nghi với nhiều môi trường khác nhau. Cụ thể, bạn có thể làm freelance, tư vấn tự do, kinh doanh online, hoặc các công việc dự án ngắn hạn. Bạn cũng có thể thành công trong vai trò kết nối — làm cầu nối giữa các bộ phận, hoặc giữa công ty với khách hàng.',
    moiTruong: 'Môi trường lý tưởng của bạn là nơi có nhiều cơ hội thay đổi, không cố định một vị trí. Bạn hợp với công ty đa quốc gia, tổ chức phi lợi nhuận, hoặc môi trường làm việc từ xa. Không hợp môi trường có lộ trình thăng tiến cứng nhắc, hoặc đòi hỏi bạn phải giữ một vai trò cố định trong nhiều năm.',
    thangTien: 'Con đường thăng tiến của bạn thường đến từ việc nắm bắt cơ hội hơn là theo lộ trình. Bạn có thể được trao cơ hội lớn khi người khác không ngờ tới — nhờ sự linh hoạt và khả năng thích nghi. Sự nghiệp thường chuyển biến mạnh sau tuổi 30, khi bạn đã tích lũy đủ kinh nghiệm và hiểu mình muốn gì.',
    khoKhan: 'Khó khăn chính là sự thiếu định hướng — bạn dễ cảm thấy mất phương hướng khi không có ai hướng dẫn hoặc không có mục tiêu rõ ràng. Ngoài ra, bạn dễ bị ảnh hưởng bởi người khác — thấy ai làm gì thành công thì muốn làm theo, nên nhiều năm trôi qua mà chưa có nghề vững.',
    loiKhuyen: [
      'Đặt ra một mục tiêu nghề nghiệp cụ thể 3-5 năm.',
      'Tìm một người cố vấn (mentor) có kinh nghiệm.',
      'Tận dụng sự linh hoạt của bản thân.'
    ]
  }

};

/* ============================================================
 *  BẢNG DỮ LIỆU + KHO VĂN CHO CUNG TỬ TỨC (con cái)
 * ============================================================ */

var TUVI_FACT_TUTUC_CHINHTINH = {
  'Tử Vi':      { yNghia: 'Con của bạn thuộc mẫu người có khí chất, tự tin từ nhỏ. Con thường có tố chất nổi bật trong tập thể và có xu hướng vươn tới vị trí dẫn dắt. Mặt trái là con tự cao, khó bảo, và hay muốn cha mẹ chiều theo.', trongSo: 1.5, tags: ['con_co_khi_chat', 'tu_tin', 'co_to_chat_lanh_dao'] },
  'Thiên Cơ':   { yNghia: 'Con của bạn thuộc mẫu người thông minh, lanh lợi, hiếu động và thích khám phá. Mặt trái là con hay lo, khó tập trung, cả thèm chóng chán; theo cổ học, sinh con muộn khi cha mẹ đã vững thường thuận hơn sinh sớm.', trongSo: 1.4, tags: ['con_thong_minh', 'hieu_dong', 'sinh_muon_tot_hon'] },
  'Thái Dương': { yNghia: 'Con của bạn thuộc mẫu người nhiệt tình, hướng ngoại, có tố chất lãnh đạo. Con trai thường bộc lộ rõ nét này hơn con gái. Mặt trái là con sĩ diện, thích được khen và dễ ôm việc quá sức.', trongSo: 1.5, tags: ['con_nhiet_tinh', 'huong_ngoai', 'con_trai_noi_bat'] },
  'Vũ Khúc':    { yNghia: 'Con của bạn thuộc mẫu người cứng rắn, thực tế, có xu hướng tự lập sớm. Con không thích dựa dẫm cha mẹ và thường có chí hướng riêng từ nhỏ. Mặt trái là con ít bộc lộ tình cảm, cứng đầu, và cha mẹ con dễ xa cách.', trongSo: 1.4, tags: ['con_cung_ran', 'thuc_te', 'tu_lap_som'] },
  'Thiên Đồng': { yNghia: 'Con của bạn thuộc mẫu người hiền hòa, vui vẻ, dễ gần, thích cuộc sống nhẹ nhàng. Con thường hòa đồng với mọi người và biết cách tận hưởng cuộc sống. Mặt trái là con ham chơi, ngại khó, dễ ỷ lại cha mẹ.', trongSo: 1.4, tags: ['con_hien_hoa', 'vui_ve', 'de_gan'] },
  'Liêm Trinh': { yNghia: 'Con của bạn thuộc mẫu người có nguyên tắc, cá tính mạnh. Mặt xấu: lúc nhỏ con khó dạy, bướng, dễ xung khắc với cha mẹ. Mặt tốt: khi lớn, con có xu hướng sống có kỷ luật và rõ ràng.', trongSo: 1.3, tags: ['con_nguyen_tac', 'ca_tinh', 'can_kien_nhan'] },
  'Thiên Phủ':  { yNghia: 'Con của bạn thuộc mẫu người hiếu thảo, biết lo toan. Con thường sống ổn định, biết giữ gìn và có xu hướng quan tâm đến gia đình nhiều hơn bạn bè cùng trang lứa. Mặt trái là con dè dặt, bảo thủ, ít dám thử điều mới.', trongSo: 1.5, tags: ['con_hieu_thao', 'biet_lo_toan', 'quan_tam_gia_dinh'] },
  'Thái Âm':    { yNghia: 'Con của bạn thuộc mẫu người hiền lành, tinh tế, giàu cảm xúc. Con gái thường bộc lộ rõ nét này hơn con trai. Con cái có xu hướng gắn bó với mẹ nhiều hơn. Mặt trái là con dễ tủi thân, hay giữ trong lòng và yếu bóng vía khi gặp áp lực.', trongSo: 1.4, tags: ['con_hien_lanh', 'tinh_te', 'gan_bo_voi_me'] },
  'Tham Lang':  { yNghia: 'Con của bạn thuộc mẫu người đa tài, giao tiếp rộng. Mặt xấu: con ham chơi, dễ bị bạn bè lôi kéo, anh chị em dễ bất hòa; sinh con khi cha mẹ còn chưa vững thường vất vả hơn.', trongSo: 1.4, tags: ['con_da_tai', 'giao_te_rong', 'sinh_muon_tot_hon'] },
  'Cự Môn':     { yNghia: 'Con của bạn thuộc mẫu người khẩu tài sắc sảo, thích lý luận. Mặt xấu: con hay cãi, bất đồng với cha mẹ, lời qua tiếng lại trong nhà nhiều. Gợi ý: dạy bằng lý lẽ thay vì áp đặt.', trongSo: 1.3, tags: ['con_khau_tai', 'hay_cai', 'day_bang_ly_le'] },
  'Thiên Tướng':{ yNghia: 'Con của bạn thuộc mẫu người ngoan ngoãn, nghĩa khí, sống ngay thẳng. Con có xu hướng bênh vực kẻ yếu và coi trọng công bằng từ nhỏ. Mặt trái là con dễ bị bạn bè lợi dụng, hay nhận phần thiệt.', trongSo: 1.4, tags: ['con_ngoan', 'nghia_khi', 'trong_cong_bang'] },
  'Thiên Lương':{ yNghia: 'Con của bạn thuộc mẫu người hiếu thảo, sống đạo đức, có xu hướng quan tâm cha mẹ khi về già. Con có thiên hướng về tôn giáo, triết lý, hoặc những lĩnh vực mang tính nhân văn. Mặt trái là con hay già trước tuổi, nói đạo lý với cả cha mẹ.', trongSo: 1.4, tags: ['con_hieu_thao', 'song_dao_duc', 'thien_huong_tam_linh'] },
  'Thất Sát':   { yNghia: 'Con của bạn thuộc mẫu người có cá tính mạnh, độc lập sớm, không thích gò bó. Mặt xấu: duyên con dễ muộn hoặc trắc trở khi mang thai, sinh nở; con cứng đầu, dễ xung khắc và sớm rời xa cha mẹ.', trongSo: 1.3, tags: ['con_ca_tinh', 'doc_lap_som', 'can_chuan_bi_sinh_no'] },
  'Phá Quân':   { yNghia: 'Con của bạn thuộc mẫu người độc lập, có xu hướng thay đổi. Mặt xấu: con đầu lòng thường khó nuôi, hay ốm vặt; khi lớn, con hay đổi nghề, đổi chỗ ở, tiêu tiền mạnh và khiến cha mẹ lo nhiều.', trongSo: 1.3, tags: ['con_doc_lap', 'hay_thay_doi', 'con_dau_kho_nuoi'] }
};

var TUVI_FACT_TUTUC_PHUTINH = {
  // Cát tinh — con cái tốt
  'Tả Phù':     { yNghia: 'Con cái có quý nhân phù trợ từ nhỏ, dễ được người khác giúp đỡ.', loai: 'manh', trongSo: 1.1, tags: ['con_quy_nhan'] },
  'Hữu Bật':    { yNghia: 'Con cái được nhiều người yêu mến, có anh chị em hỗ trợ lẫn nhau.', loai: 'manh', trongSo: 1.1, tags: ['con_duoc_yeu'] },
  'Thiên Khôi': { yNghia: 'Con cái có quý nhân nâng đỡ, dễ gặp cơ hội tốt trong học tập và sự nghiệp.', loai: 'manh', trongSo: 1.2, tags: ['con_quy_nhan'] },
  'Thiên Việt': { yNghia: 'Con cái có cơ hội thăng tiến, được người bên ngoài giúp.', loai: 'manh', trongSo: 1.2, tags: ['con_co_hoi'] },
  'Thai':       { yNghia: 'Theo cổ học, đây là dấu hiệu thuận cho duyên con — tin vui có thể đến sớm.', loai: 'manh', trongSo: 1.3, tags: ['con_som', 'de_sinh'] },
  'Hồng Loan':  { yNghia: 'Con cái xinh xắn, dễ thương, được nhiều người yêu mến.', loai: 'manh', trongSo: 1.0, tags: ['con_dep'] },
  'Thiên Hỷ':   { yNghia: 'Có tin vui con cái sớm — con cái đem lại niềm vui cho gia đình.', loai: 'manh', trongSo: 1.1, tags: ['con_tin_vui'] },
  'Long Trì':   { yNghia: 'Con cái có khí chất thanh nhã, thông minh, dễ học.', loai: 'manh', trongSo: 1.0, tags: ['con_thong_minh'] },
  'Phượng Các': { yNghia: 'Con cái có khí chất thanh nhã, có khiếu nghệ thuật.', loai: 'manh', trongSo: 1.0, tags: ['con_nghe_thuat'] },
  'Hóa Lộc':    { yNghia: 'Con cái mang lại tài lộc — con thành đạt và giúp đỡ cha mẹ về già; mặt trái là chi phí nuôi con thường lớn.', loai: 'manh', trongSo: 1.4, tags: ['con_tai_loc'] },
  'Hóa Khoa':   { yNghia: 'Con cái học giỏi, có bằng cấp, có danh tiếng. Cha mẹ được nở mặt với con.', loai: 'manh', trongSo: 1.4, tags: ['con_hoc_gioi'] },
  'Hóa Quyền':  { yNghia: 'Con cái có uy, có tố chất lãnh đạo, thành đạt trong xã hội; mặt trái là con hay muốn tự quyết, ít nghe lời cha mẹ.', loai: 'manh', trongSo: 1.4, tags: ['con_lanh_dao'] },
  'Văn Xương':  { yNghia: 'Con cái có duyên với học hành, văn chương, sách vở.', loai: 'manh', trongSo: 1.1, tags: ['con_hoc_gioi'] },
  'Văn Khúc':   { yNghia: 'Con cái khéo ăn nói, có khiếu nghệ thuật và giao tiếp.', loai: 'manh', trongSo: 1.1, tags: ['con_kheo_an_noi'] },

  // Hung tinh — khó khăn về con
  'Kình Dương': { yNghia: 'Mặt tốt: con gan dạ, dám tranh. Mặt xấu: con cá tính mạnh, dễ va chạm gay gắt với cha mẹ khi lớn và dễ bị thương do hiếu động.', loai: 'yeu', trongSo: 1.3, tags: ['con_ca_tinh'] },
  'Đà La':      { yNghia: 'Mặt tốt: khi đã có con thì gắn bó lâu dài. Mặt xấu: duyên con dễ đến chậm, mong mãi chưa có, hoặc việc nuôi dạy dây dưa nhiều mệt mỏi.', loai: 'yeu', trongSo: 1.2, tags: ['con_muon'] },
  'Hỏa Tinh':   { yNghia: 'Mặt tốt: con nhanh nhẹn, dám làm. Mặt xấu: con nóng tính, hiếu động quá mức, hay cáu bẳn và dễ gây chuyện với bạn bè.', loai: 'yeu', trongSo: 1.1, tags: ['con_nong_tinh'] },
  'Linh Tinh':  { yNghia: 'Mặt tốt: con nhạy, tinh ý. Mặt xấu: lúc nhỏ con khó nuôi, hay ốm vặt, quấy, và cha mẹ thường xuyên lo lắng về con.', loai: 'yeu', trongSo: 1.1, tags: ['con_kho_nuoi'] },
  'Địa Không':  { yNghia: 'Mặt tốt: khi có con thường là con mong đợi, được trân quý. Mặt xấu: duyên con dễ muộn, có thể hiếm muộn hoặc ít con. Gợi ý: nếu chờ lâu, nên đi khám chuyên khoa sớm.', loai: 'yeu', trongSo: 1.3, tags: ['hiem_muon'] },
  'Địa Kiếp':   { yNghia: 'Mặt tốt: vượt qua được khó khăn thì gia đình gắn bó hơn. Mặt xấu: việc mang thai, sinh nở dễ trắc trở, nhiều lo lắng hơn bình thường. Gợi ý: theo dõi thai kỳ với bác sĩ chặt chẽ.', loai: 'yeu', trongSo: 1.3, tags: ['sinh_no_trac_tro'] },
  'Hóa Kỵ':     { yNghia: 'Mặt tốt: cha mẹ rất để tâm đến con. Mặt xấu: hay lo nghĩ về con, con dễ gặp trục trặc học hành, hiểu lầm với cha mẹ và có giai đoạn quan hệ căng.', loai: 'yeu', trongSo: 1.5, tags: ['lo_lang_ve_con'] },
  'Cô Thần':    { yNghia: 'Mặt tốt: con tự lập sớm. Mặt xấu: con dễ sống xa cha mẹ, ít gần gũi, về già cha mẹ có thể thấy lẻ loi.', loai: 'yeu', trongSo: 1.0, tags: ['con_xa_cach'] },
  'Quả Tú':     { yNghia: 'Mặt tốt: con không dựa dẫm. Mặt xấu: dễ ít con, con sống xa cha mẹ và tình cảm gia đình có khoảng cách.', loai: 'yeu', trongSo: 1.0, tags: ['it_con'] },
  'Thiên Hình': { yNghia: 'Mặt tốt: con có kỷ luật, nguyên tắc. Mặt xấu: con cứng tính, dễ xung khắc với cha mẹ và dễ bị thương, phải can thiệp y tế khi nhỏ.', loai: 'yeu', trongSo: 1.0, tags: ['con_cung_tinh'] },
  'Thiên Riêu': { yNghia: 'Mặt tốt: con có duyên, dễ được yêu mến. Mặt xấu: con dễ vướng chuyện tình cảm sớm, phức tạp và khiến cha mẹ phiền lòng.', loai: 'yeu', trongSo: 0.9, tags: ['con_da_tinh'] }
};

/* KHO VĂN CHO CUNG TỬ TỨC — 5 nhóm A-E */
var TUVI_VAN_TUTUC = {
  'A': { // Uy quyền: Tử Vi, Thiên Phủ, Thiên Tướng, Thái Dương
    tomTat: 'Con cái của bạn thuộc nhóm "quý hiển" — con có khí chất tự tin, có tố chất nổi bật. Mặt xấu: con tự cao, khó bảo, và cha mẹ dễ đặt kỳ vọng quá lớn gây áp lực cho cả hai bên.',
    duyenCon: 'Duyên con của bạn có xu hướng thuận — con cái thường dễ nuôi; mặt trái là con lớn lên hay muốn tự quyết, ít nghe cha mẹ.',
    conCai: 'Con của bạn thường có khí chất tự tin từ nhỏ, có tố chất lãnh đạo hoặc nổi bật trong tập thể. Con học hành tử tế và có xu hướng thành đạt trong xã hội, về già bạn được nhờ con. Mặt xấu: con dễ kiêu, coi nhẹ ý kiến cha mẹ.',
    nuoiDay: 'Bạn nên dạy con bằng cách nêu gương và tôn trọng — không nên áp đặt. Con cần được khuyến khích phát huy cá tính nhưng cũng cần học cách khiêm tốn.',
    loiKhuyen: ['Dành thời gian chất lượng cho con mỗi ngày.', 'Dạy con bằng cách làm gương.', 'Khuyến khích con theo đuổi đam mê, kể cả khi đam mê đó khác với kỳ vọng của bạn.']
  },
  'B': { // Trí tuệ: Thiên Cơ, Cự Môn, Thái Âm
    tomTat: 'Con cái của bạn thuộc nhóm "trí tuệ" — con có đầu óc nhạy bén, thích tìm tòi và đặt câu hỏi. Mặt xấu: con hay lo nghĩ, nhạy cảm, dễ cãi lý với cha mẹ.',
    duyenCon: 'Duyên con của bạn có thể đến muộn. Lúc nhỏ con dễ yếu, hay ốm vặt và cần chăm nhiều; lớn lên thường cứng cáp hơn.',
    conCai: 'Con của bạn nhạy bén, thích khám phá và đặt câu hỏi từ nhỏ. Con có xu hướng học giỏi, đặc biệt với các môn cần tư duy. Con cũng khá độc lập — có thể sớm rời nhà đi học xa, và cha mẹ ít được gần con.',
    nuoiDay: 'Bạn nên nuôi dạy con bằng cách khuyến khích tò mò và sáng tạo. Tránh gò bó con theo khuôn khổ cứng — con cần không gian tự do để phát triển. Đặc biệt, hãy trò chuyện với con như người lớn, không coi con là trẻ con.',
    loiKhuyen: ['Đọc sách cùng con mỗi tối.', 'Cho con tham gia nhiều hoạt động khám phá.', 'Khi con đặt câu hỏi khó, hãy công nhận sự thông minh của con.']
  },
  'C': { // Thực tế: Vũ Khúc, Thiên Đồng, Liêm Trinh
    tomTat: 'Con cái của bạn thuộc nhóm "thực tế - hiếu thuận" — con thuộc mẫu người chăm chỉ, biết lo toan. Mặt xấu: con dễ khô khan, cứng nhắc, ít thể hiện tình cảm và có lúc bướng với cha mẹ.',
    duyenCon: 'Duyên con của bạn có xu hướng ổn định, việc đón con thường thuận; mặt trái là ít khi đông con.',
    conCai: 'Con của bạn thực tế, chăm chỉ và biết nghe lời từ nhỏ. Con quan tâm đến gia đình, thích giúp đỡ cha mẹ. Khi lớn lên, con thường chọn nghề ổn định và sống gần cha mẹ; mặt trái là con dễ thiếu mạo hiểm và ỷ vào gia đình.',
    nuoiDay: 'Bạn nên nuôi dạy con bằng kỷ luật mềm mỏng và khuyến khích tính tự lập. Đừng bao bọc quá mức — con cần học cách tự xoay xở để trưởng thành. Đặc biệt, hãy để con tự chọn con đường của mình thay vì ép theo kỳ vọng của cha mẹ.',
    loiKhuyen: ['Giao cho con việc nhà từ nhỏ.', 'Khen ngợi khi con làm việc tốt.', 'Giữ kết nối với con khi con trưởng thành.']
  },
  'D': { // Cá tính: Thất Sát, Phá Quân
    tomTat: 'Con cái của bạn thuộc nhóm "cá tính mạnh" — con có xu hướng độc lập, có chí hướng riêng. Mặt xấu: con bướng, khó dạy, dễ xung khắc với cha mẹ và sớm rời nhà.',
    duyenCon: 'Duyên con của bạn dễ muộn hoặc trắc trở khi mang thai, sinh nở; con đầu thường khó nuôi hơn.',
    conCai: 'Con của bạn có cá tính mạnh từ nhỏ — không thích bị sai khiến, có suy nghĩ riêng, có thể hơi bướng bỉnh. Khi lớn lên, con độc lập sớm, có thể đi xa lập nghiệp. Mặt tốt: con có chí, dám làm việc lớn. Mặt xấu: cha mẹ con dễ có giai đoạn căng thẳng, ít nói chuyện với nhau.',
    nuoiDay: 'Bạn nên nuôi dạy con bằng cách tôn trọng sự độc lập của con. Đừng áp đặt, đừng roi vọt — con càng bị ép càng phản kháng. Hãy cho con quyền quyết định trong những việc phù hợp với tuổi, và hướng dẫn thay vì ra lệnh.',
    loiKhuyen: ['Cho con tham gia thể thao hoặc hoạt động mạnh.', 'Trò chuyện với con như bạn bè khi con ở tuổi teen.', 'Chấp nhận rằng con sẽ có con đường riêng.']
  },
  'E': { // Đa tài: Tham Lang, Thiên Lương
    tomTat: 'Con cái của bạn thuộc nhóm "đa tài - sáng tạo" — con có năng khiếu và thích khám phá nhiều lĩnh vực. Mặt xấu: con dàn trải, cả thèm chóng chán, dễ bị bạn bè lôi kéo vào ăn chơi.',
    duyenCon: 'Duyên con của bạn khá, con mang lại niềm vui cho gia đình; mặt trái là có thể đến muộn hơn dự tính.',
    conCai: 'Con của bạn đa tài từ nhỏ — có thể giỏi nhiều thứ nhưng không chuyên sâu một thứ. Con cũng nhân hậu, biết quan tâm đến người khác. Khi lớn lên, con có thể theo con đường nghệ thuật, giáo dục, y tế, hoặc các lĩnh vực cần sự sáng tạo và tình cảm.',
    nuoiDay: 'Bạn nên nuôi dạy con bằng cách khuyến khích sự đa dạng nhưng cũng dạy con tính kiên trì. Đừng để con bỏ dở giữa chừng khi gặp khó khăn — hãy dạy con rằng "đi đến cùng một việc" quan trọng hơn "làm nhiều việc dở dang".',
    loiKhuyen: ['Cho con thử nhiều môn năng khiếu.', 'Dạy con lòng biết ơn và sự sẻ chia.', 'Hãy là người bạn đồng hành, không chỉ là người giám sát.']
  }
};

/* ============================================================
 *  BẢNG DỮ LIỆU + KHO VĂN CHO CUNG TẬT ÁCH (sức khỏe)
 * ============================================================ */

var TUVI_FACT_TATACH_CHINHTINH = {
  'Tử Vi':      { yNghia: 'Bạn thuộc mẫu người có nền tảng thể chất khá vững, ít bệnh nặng. Mặt xấu: theo sách cổ, bạn dễ mắc bệnh dạ dày, tỳ vị (đầy bụng, khó tiêu, viêm loét dạ dày) và hay chủ quan nên bệnh dễ phát hiện muộn. Gợi ý: có dấu hiệu bất thường thì đi khám bác sĩ sớm.', trongSo: 1.4, tags: ['the_chat_vung_vang', 'it_benh_nang', 'tieu_hoa'] },
  'Thiên Cơ':   { yNghia: 'Mặt tốt: bạn nhạy, sớm nhận ra cơ thể có vấn đề. Mặt xấu: bạn thuộc mẫu người dễ suy nhược vì lo nghĩ; theo sách cổ, dễ mắc bệnh gan mật, suy nhược thần kinh, mất ngủ, đau đầu, và đau nhức tay chân khi căng thẳng.', trongSo: 1.4, tags: ['nhao_cam_cang_thang', 'gan_than_kinh', 'can_nghi_ngoi'] },
  'Thái Dương': { yNghia: 'Bạn thuộc mẫu người năng động, sức bật tốt. Mặt xấu: hay dốc sức quá mức; theo sách cổ, dễ mắc bệnh về mắt (cận, viễn, đau mắt), tim mạch, huyết áp cao và đau đầu, đau nửa đầu. Gợi ý: kiểm tra mắt và huyết áp định kỳ.', trongSo: 1.5, tags: ['can_chu_y_mat_tim', 'co_the_dau_nua_dau', 'can_kiem_tra_dinh_ky'] },
  'Vũ Khúc':    { yNghia: 'Bạn thuộc mẫu người làm việc bền bỉ, chịu được áp lực. Mặt xấu: hay quên chăm sóc bản thân; theo sách cổ, dễ mắc bệnh phổi, hô hấp (ho kéo dài, viêm phế quản), bệnh răng, đau lưng và xương khớp.', trongSo: 1.4, tags: ['can_chu_y_ho_hap', 'co_the_dau_lung', 'xuong_khop'] },
  'Thiên Đồng': { yNghia: 'Bạn thuộc mẫu người tinh thần thoải mái, ít bị căng thẳng làm hại. Mặt xấu: hay chủ quan; theo sách cổ, dễ mắc bệnh thận, bàng quang, đường tiết niệu, và tai kém, nghe kém khi lớn tuổi.', trongSo: 1.3, tags: ['can_chu_y_than_tai', 'tiet_nieu', 'nghe_kem_khi_gia'] },
  'Liêm Trinh': { yNghia: 'Bạn thuộc mẫu người sống mạnh mẽ, chịu đựng giỏi. Mặt xấu: theo sách cổ, dễ mắc bệnh về máu huyết, bệnh phụ khoa – sinh dục, bệnh ngoài da, trĩ, và sức khỏe sa sút nhanh nếu dùng nhiều rượu bia, chất kích thích.', trongSo: 1.4, tags: ['can_chu_y_mau_huyet', 'can_tranh_ruou_bia', 'he_sinh_duc'] },
  'Thiên Phủ':  { yNghia: 'Bạn thuộc mẫu người có nền tảng thể chất khá vững. Mặt xấu: theo sách cổ, dễ mắc bệnh dạ dày, tiêu hóa, và ăn uống thất thường, ăn nhiều dễ dẫn tới thừa cân, mỡ máu.', trongSo: 1.4, tags: ['the_chat_vung_vang', 'can_chu_y_da_day', 'an_uong_dieu_do'] },
  'Thái Âm':    { yNghia: 'Bạn thuộc mẫu người giàu cảm xúc, biết lắng nghe cơ thể. Mặt xấu: dễ mất ngủ khi căng thẳng; theo sách cổ, dễ mắc bệnh thận, mắt, rối loạn nội tiết (với nữ là kinh nguyệt không đều), và có xu hướng tiểu đường khi lớn tuổi.', trongSo: 1.4, tags: ['can_chu_y_than_mat', 'co_the_mat_ngu', 'noi_tiet_to'] },
  'Tham Lang':  { yNghia: 'Bạn thuộc mẫu người ham vui, sức sống dồi dào. Mặt xấu: theo sách cổ, dễ mắc bệnh gan, thận, sinh dục, bệnh do rượu bia (gan nhiễm mỡ, gút), và sức khỏe sa sút do tiệc tùng, sinh hoạt thất thường.', trongSo: 1.5, tags: ['can_chu_y_gan_than', 'can_song_dieu_do', 'he_sinh_duc'] },
  'Cự Môn':     { yNghia: 'Bạn thuộc mẫu người tỉnh táo, để ý chi tiết. Mặt xấu: hay suy nghĩ, nói nhiều; theo sách cổ, dễ mắc bệnh miệng họng (viêm họng, viêm amidan, bệnh răng miệng) và dạ dày, đường ruột khi căng thẳng.', trongSo: 1.3, tags: ['can_chu_y_mieng_hong', 'co_the_viem_hong', 'tieu_hoa_khi_stress'] },
  'Thiên Tướng':{ yNghia: 'Bạn thuộc mẫu người chỉn chu, giữ gìn. Mặt xấu: hay lo cho người khác hơn bản thân; theo sách cổ, dễ mắc bệnh ngoài da, dị ứng, mẩn ngứa và bệnh bàng quang, tiết niệu.', trongSo: 1.3, tags: ['can_chu_y_da', 'bang_quang', 'de_di_ung'] },
  'Thiên Lương':{ yNghia: 'Theo cổ học, bạn thuộc mẫu người có nền tảng sức khỏe khá tốt và dễ gặp thầy thuốc giỏi. Mặt xấu: dễ mắc bệnh dạ dày, tim, và về già hay có bệnh vặt kéo dài.', trongSo: 1.4, tags: ['it_benh_tho', 'can_chu_y_da_day', 'co_duyen_y_duoc'] },
  'Thất Sát':   { yNghia: 'Bạn thuộc mẫu người hành động nhanh, mạnh, phục hồi tốt. Mặt xấu: theo sách cổ, dễ mắc bệnh phổi, hô hấp, đường ruột, trĩ, và dễ bị thương do máy móc, dụng cụ sắc hoặc khi đi lại.', trongSo: 1.4, tags: ['can_chu_y_phoi', 'can_de_phong_tai_nan', 'can_than_voi_kim_khi'] },
  'Phá Quân':   { yNghia: 'Bạn thuộc mẫu người thích thử thách, sức bền khá. Mặt xấu: hay liều, dễ bị thương khi chơi môn mạo hiểm; theo sách cổ, dễ mắc bệnh thận, đường ruột, sinh dục, và sức khỏe hao mòn vì sống quá sức.', trongSo: 1.4, tags: ['can_chu_y_than', 'can_de_phong_tai_nan', 'kiem_tra_dinh_ky'] }
};

var TUVI_FACT_TATACH_PHUTINH = {
  // Cát tinh — sức khỏe tốt hơn
  'Thiên Y':     { yNghia: 'Gặp thầy gặp thuốc, có duyên với y dược. Khi ốm dễ tìm được thầy thuốc giỏi và thuốc hiệu nghiệm.', loai: 'manh', trongSo: 1.3, tags: ['thay_thuoc_tot'] },
  'Giải Thần':   { yNghia: 'Theo cổ học, gặp khó khăn dễ được hóa giải, mọi việc có xu hướng nhẹ đi.', loai: 'manh', trongSo: 1.3, tags: ['giai_tai_ach'] },
  'Thiên Giải':  { yNghia: 'Gặp hung hóa cát (chuyện xấu chuyển thành tốt), khi mệt mỏi thường mau hồi phục.', loai: 'manh', trongSo: 1.2, tags: ['giai_benh'] },
  'Địa Giải':    { yNghia: 'Bệnh có xu hướng nhẹ dần theo thời gian; mặt trái là hồi phục chậm, cần kiên trì.', loai: 'manh', trongSo: 1.2, tags: ['giai_benh_man'] },
  'Hóa Khoa':    { yNghia: 'Gặp khó có người giúp, khi cần chăm sóc sức khỏe dễ gặp thầy giỏi. Tinh thần lạc quan hỗ trợ quá trình hồi phục.', loai: 'manh', trongSo: 1.4, tags: ['quy_nhan_y_te'] },
  'Long Trì':    { yNghia: 'Thể chất thanh tao, nền tảng sức khỏe khá tốt.', loai: 'manh', trongSo: 0.8, tags: ['the_chat_tot'] },
  'Phượng Các':  { yNghia: 'Thể chất thanh tao, sức khỏe tổng quát có xu hướng tốt.', loai: 'manh', trongSo: 0.8, tags: ['the_chat_tot'] },
  'Thiên Đức':   { yNghia: 'Được phù hộ, tai ách dễ qua. Sức khỏe tinh thần ổn định.', loai: 'manh', trongSo: 1.0, tags: ['phu_ho'] },
  'Nguyệt Đức':  { yNghia: 'Nhân hậu, phúc dày, khó khăn dễ qua. Tinh thần an nhiên giúp bạn mau hồi phục.', loai: 'manh', trongSo: 1.0, tags: ['phuc_duc'] },
  'Hóa Lộc':     { yNghia: 'Sức khỏe tốt nhờ điều kiện sống đầy đủ. Có tiền chăm sóc sức khỏe và dinh dưỡng.', loai: 'manh', trongSo: 1.2, tags: ['suc_khoe_tot'] },

  // Hung tinh — sức khỏe cần chú ý
  'Kình Dương':  { yNghia: 'Dễ bị thương do máy móc, dụng cụ sắc hoặc khi vận động mạnh, và có thể có lần phải mổ, khâu; mặt được là bạn chịu đau, hồi phục nhanh.', loai: 'yeu', trongSo: 1.5, tags: ['thuong_tich_phau_thuat'] },
  'Đà La':       { yNghia: 'Bệnh hay dây dưa, lâu khỏi; dễ mắc bệnh răng, đau nhức xương khớp, và bệnh dễ thành mạn tính nếu để lâu.', loai: 'yeu', trongSo: 1.4, tags: ['benh_man'] },
  'Hỏa Tinh':    { yNghia: 'Theo cách nói dân gian, cơ thể dễ bị "nóng trong": hay sốt, viêm nhiễm, nổi mụn, nhiệt miệng, táo bón; cũng dễ bị bỏng do lửa và đồ nóng.', loai: 'yeu', trongSo: 1.3, tags: ['sot_viem'] },
  'Linh Tinh':   { yNghia: 'Dễ căng thẳng, lo nghĩ âm ỉ; dễ suy nhược thần kinh, mất ngủ, hồi hộp, đánh trống ngực.', loai: 'yeu', trongSo: 1.3, tags: ['benh_than_kinh'] },
  'Địa Không':   { yNghia: 'Sức khỏe dễ biến động bất ngờ, có bệnh khó tìm ra nguyên nhân, tinh thần dễ trống rỗng.', loai: 'yeu', trongSo: 1.3, tags: ['bien_dong_suc_khoe'] },
  'Địa Kiếp':    { yNghia: 'Dễ gặp tai nạn hoặc bệnh cấp phát đột ngột, kéo theo chi phí lớn. Gợi ý: nên có bảo hiểm y tế.', loai: 'yeu', trongSo: 1.4, tags: ['tai_nan_benh_cap'] },
  'Hóa Kỵ':      { yNghia: 'Dễ có bệnh kéo dài, tái đi tái lại, và tinh thần hay bị ám ảnh bởi chuyện sức khỏe.', loai: 'yeu', trongSo: 1.6, tags: ['benh_kinh_nien'] },
  'Bệnh Phù':    { yNghia: 'Sức đề kháng yếu, hay ốm vặt, cảm cúm, dễ mệt mỏi khi giao mùa.', loai: 'yeu', trongSo: 1.3, tags: ['de_khang_yeu'] },
  'Thiên Hình':  { yNghia: 'Dễ có lần phải phẫu thuật, can thiệp y tế hoặc bị thương do vật sắc.', loai: 'yeu', trongSo: 1.2, tags: ['phau_thuat'] },
  'Lưu Hà':      { yNghia: 'Dễ gặp rủi ro ở sông nước, khi bơi lội hoặc đi đường thủy.', loai: 'yeu', trongSo: 1.2, tags: ['tai_nan_song_nuoc'] },
  'Tang Môn':    { yNghia: 'Tinh thần dễ buồn phiền kéo dài, kéo sức khỏe đi xuống theo.', loai: 'yeu', trongSo: 1.0, tags: ['tinh_than'] },
  'Bạch Hổ':     { yNghia: 'Dễ gặp va chạm, chảy máu, thương tích khi đi lại và vận động mạnh.', loai: 'yeu', trongSo: 1.3, tags: ['tai_nan_mau'] },
  'Thiên Khốc':  { yNghia: 'Nhạy cảm, dễ xúc động; theo sách cổ dễ mắc bệnh phổi, hô hấp (ho, hen) và tim mạch khi buồn lo kéo dài.', loai: 'yeu', trongSo: 1.0, tags: ['tim_mach'] },
  'Thiên Hư':    { yNghia: 'Dễ suy nhược, hụt sức, thiếu máu; có giai đoạn sức khỏe giảm sút rõ.', loai: 'yeu', trongSo: 1.0, tags: ['suy_nhuoc'] },
  'Kiếp Sát':    { yNghia: 'Dễ gặp tai nạn giao thông hoặc tai nạn khi làm việc nhiều rủi ro.', loai: 'yeu', trongSo: 1.2, tags: ['tai_nan'] },
  'Phá Toái':    { yNghia: 'Sức khỏe dễ hao mòn, xương khớp dễ tổn thương khi làm việc quá sức.', loai: 'yeu', trongSo: 1.0, tags: ['xuong_khop'] }
};

/* KHO VĂN CHO CUNG TẬT ÁCH — 6 nhóm A-F */
var TUVI_VAN_TATACH = {
  'A': { // Thể chất tốt: Tử Vi, Thiên Phủ, Thiên Tướng, Thái Dương
    tomTat: 'Sức khỏe của bạn có xu hướng khá tốt — nền tảng thể chất ổn định. Mặt xấu: vì khỏe nên hay chủ quan, bệnh tiêu hóa, huyết áp dễ âm thầm phát khi có tuổi.',
    theChat: 'Bạn có thể chất khá vững vàng, dễ hồi phục khi mệt. Mặt xấu: khi căng thẳng kéo dài, cơ thể xuống sức nhanh và dễ phát bệnh dạ dày, đau đầu.',
    coQuan: 'Theo sách cổ, nhóm này dễ mắc bệnh dạ dày, tỳ vị (viêm dạ dày, khó tiêu), huyết áp cao, mỡ máu và bệnh về mắt khi có tuổi. Mặt xấu nằm ở nếp sống: bỏ bữa, ăn khuya, căng thẳng kéo dài làm bệnh phát sớm hơn.',
    phongBenh: 'Cách giữ gìn sức khỏe hiệu quả cho bạn: ăn uống điều độ (tránh bỏ bữa, tránh ăn khuya), khám sức khỏe định kỳ, và dành thời gian thư giãn mỗi ngày để giảm căng thẳng. Lá số chỉ gợi ý xu hướng, không thay chẩn đoán — có dấu hiệu lạ hãy đi khám và hỏi bác sĩ.',
    loiKhuyen: [
      'Khám sức khỏe tổng quát mỗi năm, nhất là dạ dày, huyết áp, mỡ máu.',
      'Không bỏ bữa sáng, không ăn khuya.',
      'Tập thể dục đều 30 phút mỗi ngày.'
    ]
  },
  'B': { // Căng thẳng: Thiên Cơ, Cự Môn, Thái Âm
    tomTat: 'Sức khỏe của bạn chịu ảnh hưởng nhiều từ tinh thần — khi căng thẳng, cơ thể dễ phản ứng bằng mất ngủ, đau đầu, rối loạn tiêu hóa. Mặt được là khi tinh thần ổn thì sức khỏe hồi lại nhanh.',
    theChat: 'Bạn có thể chất nhạy cảm, dễ bị ảnh hưởng bởi môi trường và cảm xúc. Khi lo lắng, bạn dễ ngủ không ngon và mệt mỏi. Ngược lại, khi tinh thần thoải mái, sức khỏe của bạn rất tốt.',
    coQuan: 'Theo sách cổ, nhóm này dễ mắc bệnh thần kinh (suy nhược, mất ngủ, đau đầu), gan mật, rối loạn tiêu hóa – đại tràng co thắt, bệnh miệng họng, và với một số người là thận, mắt, nội tiết. Mặt xấu: bệnh lên xuống theo tâm trạng nên dễ bị xem nhẹ.',
    phongBenh: 'Cách giữ gìn sức khỏe cho bạn: giữ tinh thần thoải mái (thiền, viết nhật ký, trò chuyện với người tin cậy), đảm bảo ngủ đủ 7-8 tiếng, và hạn chế cà phê – rượu bia. Lá số chỉ gợi ý xu hướng, không thay chẩn đoán — có dấu hiệu lạ hãy đi khám và hỏi bác sĩ.',
    loiKhuyen: [
      'Ngủ trước 23 giờ, giờ ngủ cố định.',
      'Bớt cà phê, rượu bia khi đang căng thẳng.',
      'Mất ngủ, đau đầu kéo dài trên hai tuần thì đi khám.'
    ]
  },
  'C': { // Vững chắc: Vũ Khúc, Thiên Đồng, Liêm Trinh
    tomTat: 'Sức khỏe của bạn thuộc nhóm "vững chắc" — thể chất có xu hướng ổn định. Mặt xấu: hay làm quá sức, và hô hấp, xương khớp, thận dễ yếu đi khi lớn tuổi.',
    theChat: 'Bạn có thể chất rắn chắc, sức bền tốt, chịu được áp lực công việc. Mặt xấu: vì chịu được nên hay gồng, đến khi xuống sức thì xuống nhanh và lâu hồi.',
    coQuan: 'Theo sách cổ, nhóm này dễ mắc bệnh phổi, hô hấp (viêm phế quản, ho kéo dài), thận – tiết niệu, xương khớp, và với một số người là bệnh máu huyết, phụ khoa – sinh dục. Mặt xấu: vì chịu đựng giỏi nên hay gồng, bệnh phát thì đã nặng.',
    phongBenh: 'Cách giữ gìn sức khỏe cho bạn: tập thể dục đều đặn (bơi lội, đi bộ), hạn chế hút thuốc và môi trường ô nhiễm, và khám sức khỏe định kỳ. Lá số chỉ gợi ý xu hướng, không thay chẩn đoán — có dấu hiệu lạ hãy đi khám và hỏi bác sĩ.',
    loiKhuyen: [
      'Không làm quá sức nhiều ngày liền.',
      'Tránh khói thuốc, môi trường bụi, hóa chất.',
      'Khám phổi, thận, xương khớp định kỳ khi qua tuổi 40.'
    ]
  },
  'D': { // Cần chú ý: Thất Sát, Phá Quân
    tomTat: 'Sức khỏe của bạn cần được chăm chút nhiều hơn — thể chất khá nhưng bạn hay dốc sức, dễ chủ quan. Mặt xấu: dễ gặp tai nạn, thương tích, và sức khỏe hao mòn nhanh vì sống quá sức.',
    theChat: 'Bạn có thể chất mạnh mẽ, phản ứng nhanh, hồi phục tốt. Mặt xấu: hay hoạt động mạnh, chủ quan, dễ kiệt sức khi làm việc quá độ và dễ bị thương khi vận động.',
    coQuan: 'Theo sách cổ, nhóm này dễ mắc bệnh phổi, thận, đường ruột, trĩ, và dễ bị thương tích do va chạm, máy móc, vật sắc. Mặt xấu: hay liều và chủ quan nên chấn thương, kiệt sức đến nhiều hơn người khác.',
    phongBenh: 'Cách giữ gìn sức khỏe cho bạn: tránh làm việc quá sức, cẩn thận khi tham gia giao thông và làm việc nguy hiểm, kiểm tra sức khỏe định kỳ 6 tháng một lần. Lá số chỉ gợi ý xu hướng, không thay chẩn đoán — có dấu hiệu lạ hãy đi khám và hỏi bác sĩ.',
    loiKhuyen: [
      'Đội mũ bảo hiểm, đồ bảo hộ, không đi nhanh khi mệt.',
      'Không làm việc quá sức nhiều ngày liền.',
      'Giữ bảo hiểm y tế và một khoản dự phòng chữa bệnh.'
    ]
  },
  'E': { // Nhạy cảm: Tham Lang, Thiên Lương
    tomTat: 'Sức khỏe của bạn thuộc nhóm "nhạy cảm" — thể chất khá nhưng dễ bị lối sống làm hại. Mặt xấu: gan, thận, hệ sinh dục dễ yếu đi nếu ăn chơi, rượu bia nhiều.',
    theChat: 'Mặt tốt: bạn có thể chất khá tốt, khi sống điều độ thì rất khỏe. Mặt xấu: khi sinh hoạt thất thường (ăn uống, ngủ nghỉ, quan hệ), sức khỏe suy giảm nhanh và dễ thành bệnh kéo dài.',
    coQuan: 'Theo sách cổ, nhóm này dễ mắc bệnh gan (gan nhiễm mỡ, men gan cao), thận, sinh dục, gút, tiểu đường và bệnh dạ dày, tim khi về già. Mặt xấu: bệnh phần lớn đến từ lối sống — rượu bia, tiệc tùng, thức khuya.',
    phongBenh: 'Cách giữ gìn sức khỏe cho bạn: sống điều độ (ăn uống, ngủ nghỉ, sinh hoạt), tránh rượu bia và các chất kích thích, và kiểm tra sức khỏe định kỳ. Lá số chỉ gợi ý xu hướng, không thay chẩn đoán — có dấu hiệu lạ hãy đi khám và hỏi bác sĩ.',
    loiKhuyen: [
      'Hạn chế rượu bia và chất kích thích.',
      'Ăn ngủ đúng giờ.',
      'Xét nghiệm gan, đường huyết, axit uric định kỳ.'
    ]
  },
  'F': { // VCD
    tomTat: 'Sức khỏe của bạn thuộc nhóm đặc biệt — phần sức khỏe trên lá số để trống (không có sao chính). Mặt tốt: ít bệnh đặc trưng rõ. Mặt xấu: sức khỏe dao động theo lối sống và tinh thần, dấu hiệu bệnh dễ bị bỏ qua.',
    theChat: 'Bạn có thể chất linh hoạt, dễ thích nghi với môi trường. Mặt xấu: sức khỏe dễ chao đảo khi tinh thần và chế độ sinh hoạt xáo trộn, và bạn hay bỏ qua dấu hiệu sớm của cơ thể.',
    coQuan: 'Cung sức khỏe trống nên nhóm bệnh dễ mắc lấy theo cung đối diện; theo sách cổ, hay gặp là suy nhược, rối loạn tiêu hóa, mất ngủ khi tinh thần xáo trộn. Mặt xấu: dấu hiệu bệnh mờ nên dễ bị bỏ qua tới khi nặng.',
    phongBenh: 'Cách giữ gìn sức khỏe cho bạn: duy trì lối sống lành mạnh (ăn uống, ngủ nghỉ, tập thể dục), chú ý lắng nghe cơ thể, và khám sức khỏe định kỳ 1-2 lần mỗi năm. Lá số chỉ gợi ý xu hướng, không thay chẩn đoán — có dấu hiệu lạ hãy đi khám và hỏi bác sĩ.',
    loiKhuyen: [
      'Ghi lại dấu hiệu lạ của cơ thể, đừng bỏ qua.',
      'Sinh hoạt đều giờ.',
      'Khám tổng quát 1–2 lần mỗi năm.'
    ]
  }
};

/* ============================================================
 *  BẢNG DỮ LIỆU + KHO VĂN CHO CUNG ĐIỀN TRẠCH (nhà cửa)
 * ============================================================ */

var TUVI_FACT_DIENTRACH_CHINHTINH = {
  'Tử Vi':      { yNghia: 'Nhà cửa của bạn thuộc mẫu người hướng đến không gian khang trang, đàng hoàng. Bạn có xu hướng sống ở nơi được nhiều người nể trọng và coi trọng phong thái bên ngoài của ngôi nhà. Mặt trái là chi phí nhà cửa cao, dễ vì thể diện mà mua, sửa quá sức.', trongSo: 1.5, tags: ['nha_cua_huong_khang_trang', 'coi_trong_phong_thai', 'huong_dang_hoang'] },
  'Thiên Cơ':   { yNghia: 'Bạn thuộc mẫu người hay thay đổi chỗ ở, thích sửa sang nhà cửa. Mặt xấu: chỗ ở thay đổi nhiều lần trong đời, tốn kém, khó tích được nhà đất lớn.', trongSo: 1.4, tags: ['hay_doi_nha', 'thich_sua_sang', 'nhieu_lan_chuyen_nha'] },
  'Thái Dương': { yNghia: 'Bạn thuộc mẫu người coi trọng không gian sáng sủa, thoáng đãng. Nhà cửa có xu hướng ở nơi nhiều ánh sáng tự nhiên. Có thể được thừa hưởng nhà đất từ gia đình nếu thế sao tốt; nếu thế sao yếu thì dễ hao tổ nghiệp, nhà cửa phải tự lo.', trongSo: 1.5, tags: ['nha_sang_sua', 'co_the_huong_to_nghiep', 'thoang_dang'] },
  'Vũ Khúc':    { yNghia: 'Bạn thuộc mẫu người tự gây dựng nhà cửa bằng sức mình hơn là dựa vào thừa hưởng. Nhà cửa có xu hướng vững chắc và có giá trị theo thời gian; mặt trái là ít được gia đình đỡ, phải gồng gánh một mình.', trongSo: 1.5, tags: ['tu_tao_nha', 'khong_dua_thua_huong', 'gia_tri_tai_chinh_cao'] },
  'Thiên Đồng': { yNghia: 'Mặt xấu: chuyện nhà cửa ban đầu chật vật, có thể phải ở thuê, ở nhờ khá lâu. Mặt tốt: về sau càng ổn định, và bạn tự lập được, ít phải nhờ vả.', trongSo: 1.3, tags: ['tien_kho_hau_kha', 'tu_lap_trong_nha_cua', 'on_dinh_dan_ve_sau'] },
  'Liêm Trinh': { yNghia: 'Mặt xấu: nhà đất dễ vướng rắc rối pháp lý, tranh chấp thừa kế trong gia đình, có thể mất hòa khí với người thân vì đất. Mặt tốt: bạn đủ cứng rắn để giữ phần của mình.', trongSo: 1.4, tags: ['can_ro_rang_phap_ly', 'de_tranh_chap', 'can_kiem_tra_giay_to'] },
  'Thiên Phủ':  { yNghia: 'Bạn thuộc mẫu người có khả năng giữ và phát triển tài sản nhà đất tốt. Nhà cửa có xu hướng mang tính "kho tàng" — càng ở lâu càng có giá trị. Mặt trái là ngại thay đổi, giữ nhà cũ quá lâu dù đã không còn hợp.', trongSo: 1.6, tags: ['giu_tai_san_tot', 'co_kha_nang_phat_trien', 'cang_o_lau_cang_co_gia'] },
  'Thái Âm':    { yNghia: 'Bạn thuộc mẫu người có duyên lớn với nhà đất — bất động sản có xu hướng là kênh tích lũy tài sản chủ lực. Nhà cửa thường ở nơi yên tĩnh, có không gian xanh. Mặt trái là dễ dồn quá nhiều tiền vào nhà đất, kẹt vốn khi cần tiền mặt.', trongSo: 1.6, tags: ['co_duyen_nha_dat', 'dien_san_chu_luc', 'thich_khong_gian_yen_tinh'] },
  'Tham Lang':  { yNghia: 'Nhà cửa của bạn có xu hướng lúc thịnh lúc suy — trung niên mới ổn định. Mặt xấu: thời trẻ dễ mua bán nhà đất thua lỗ, hao tài sản vì ăn chơi hoặc đầu tư theo phong trào.', trongSo: 1.3, tags: ['luc_thinh_luc_suy', 'trung_nien_on_dinh', 'nen_doi_thoi_diem'] },
  'Cự Môn':     { yNghia: 'Mặt xấu: nhà đất dễ có tranh chấp ranh giới, giấy tờ, cãi cọ với hàng xóm hoặc mua phải nhà có vấn đề pháp lý. Gợi ý: kiểm tra pháp lý kỹ trước khi mua.', trongSo: 1.3, tags: ['can_hoa_khi_hang_xom', 'can_kiem_tra_phap_ly', 'de_tranh_chap'] },
  'Thiên Tướng':{ yNghia: 'Nhà cửa của bạn thuộc mẫu người coi trọng sự ngăn nắp, chỉn chu. Không gian sống thường có gu thẩm mỹ và dễ có người giúp trong việc mua sắm, sửa sang. Mặt trái là chi nhiều cho hình thức nhà cửa.', trongSo: 1.4, tags: ['coi_trong_ngan_nap', 'co_gu_tham_my', 'duoc_giup_nha_cua'] },
  'Thiên Lương':{ yNghia: 'Bạn thuộc mẫu người có duyên với nhà cửa tổ nghiệp. Nhà ở thường ở nơi gần thiên nhiên, yên tĩnh — phù hợp với người thích cuộc sống thanh bình. Mặt trái là dễ bị ràng buộc trách nhiệm với nhà thờ họ, đất hương hỏa.', trongSo: 1.4, tags: ['co_duyen_to_nghiep', 'thich_gan_thien_nhien', 'song_thanh_binh'] },
  'Thất Sát':   { yNghia: 'Theo cổ học, bạn thuộc mẫu người tự lập mới có nhà cửa vững chắc. Mặt xấu: khó giữ tổ nghiệp, nhà đất dễ phải bán, đổi chủ vài lần trước khi ổn định.', trongSo: 1.3, tags: ['kho_giu_to_nghiep', 'phai_tu_lap', 'doi_chu_nhieu_lan'] },
  'Phá Quân':   { yNghia: 'Bạn thuộc mẫu người phá cũ xây mới — hay mua bán nhà đất, đổi chỗ ở. Mặt xấu: nhà cửa thay đổi nhiều lần, hao tài sản qua mỗi lần mua bán, sửa chữa và khó giữ được nhà tổ.', trongSo: 1.3, tags: ['phá_cu_xay_moi', 'hay_mua_ban_nha', 'thay_doi_nhieu'] }
};

var TUVI_FACT_DIENTRACH_PHUTINH = {
  // Cát tinh — nhà cửa tốt
  'Lộc Tồn':   { yNghia: 'Bạn giữ được nhà đất, có của để dành. Nhà đất là chỗ tích lũy chắc nhất của bạn.', loai: 'manh', trongSo: 1.7, tags: ['giu_nha_dat'] },
  'Hóa Lộc':   { yNghia: 'Bạn có duyên với nhà cửa, dễ gây dựng được không gian sống ưng ý theo thời gian.', loai: 'manh', trongSo: 1.6, tags: ['tai_san_tang'] },
  'Hóa Khoa':  { yNghia: 'Giấy tờ nhà đất thuận lợi, mua bán dễ dàng, ít tranh chấp.', loai: 'manh', trongSo: 1.4, tags: ['giay_to_thuan'] },
  'Thiên Trù': { yNghia: 'Nhà đủ ăn, bếp núc ấm cúng. Không khí gia đình ấm áp, dễ chịu.', loai: 'manh', trongSo: 1.2, tags: ['nha_am_cung'] },
  'Long Trì':  { yNghia: 'Nhà cửa thanh nhã, phong thủy tốt. Ở đâu cũng tạo được không gian đẹp.', loai: 'manh', trongSo: 1.0, tags: ['nha_dep'] },
  'Phượng Các':{ yNghia: 'Nhà cửa có không gian đẹp, sang trọng. Môi trường sống thanh lịch.', loai: 'manh', trongSo: 1.0, tags: ['nha_dep'] },
  'Tả Phù':    { yNghia: 'Được người khác giúp đỡ trong việc nhà cửa, mua bán thuận lợi.', loai: 'manh', trongSo: 1.1, tags: ['duoc_giup_nha'] },
  'Hữu Bật':   { yNghia: 'Có người hỗ trợ về nhà đất, anh em giúp đỡ lẫn nhau.', loai: 'manh', trongSo: 1.1, tags: ['duoc_giup_nha'] },

  // Hung tinh — nhà cửa cần chú ý
  'Địa Không': { yNghia: 'Chuyện nhà cửa dễ tốn kém hơn dự tính, có khoản đầu tư nhà đất mất trắng hoặc kẹt lâu không thoát được.', loai: 'yeu', trongSo: 1.4, tags: ['hao_hut_nha'] },
  'Địa Kiếp':  { yNghia: 'Dễ hao mất nhà đất, gặp tranh chấp hoặc giao dịch đổ vỡ gây thiệt hại lớn.', loai: 'yeu', trongSo: 1.5, tags: ['mat_nha_dat', 'tranh_chap'] },
  'Hỏa Tinh':  { yNghia: 'Nhà cửa dễ gặp sự cố về điện, bếp, lửa; không khí trong nhà cũng hay nóng nảy, cãi cọ.', loai: 'yeu', trongSo: 1.4, tags: ['hoa_hoan'] },
  'Linh Tinh': { yNghia: 'Nhà cửa hay có hư hỏng ngầm (ẩm mốc, dột, nứt) và chi phí sửa chữa lặt vặt kéo dài.', loai: 'yeu', trongSo: 1.2, tags: ['nha_hu_hong'] },
  'Kình Dương':{ yNghia: 'Nhà cửa dễ có tranh chấp, va chạm với hàng xóm hoặc người trong nhà về phần chia.', loai: 'yeu', trongSo: 1.3, tags: ['tranh_chap_hang_xom'] },
  'Đà La':     { yNghia: 'Nhà đất dây dưa, mua bán chậm, thủ tục kéo dài và dễ bị ép giá.', loai: 'yeu', trongSo: 1.2, tags: ['giao_dich_cham'] },
  'Hóa Kỵ':    { yNghia: 'Giấy tờ nhà đất rắc rối, dễ có vấn đề pháp lý, mua bán vướng mắc và gây bất hòa trong nhà.', loai: 'yeu', trongSo: 1.5, tags: ['giay_to_rac_roi'] },
  'Thiên Hình':{ yNghia: 'Chuyện nhà cửa dễ dẫn đến kiện tụng, phải ra chính quyền hoặc tòa để phân xử.', loai: 'yeu', trongSo: 1.1, tags: ['kien_tung_nha'] }
};

var TUVI_VAN_DIENTRACH = {
  'A': { // Nhà cửa vững vàng: Tử Vi, Thiên Phủ, Thái Âm
    tomTat: 'Nhà cửa của bạn thuộc nhóm "vững vàng" — bạn có lộc về nhà đất, tài sản ổn định và có xu hướng tăng theo thời gian. Mặt xấu: dễ dồn vốn vào nhà đất, kẹt tiền mặt, và ngại thay đổi chỗ ở dù cần.',
    nhaCua: 'Bạn có duyên với nhà đất — thường sở hữu bất động sản có giá trị và giữ được lâu dài. Nhà cửa của bạn khang trang, được nhiều người nể trọng. Có thể bạn được thừa hưởng từ cha mẹ hoặc tự gây dựng từ sớm.',
    moiTruong: 'Môi trường sống lý tưởng của bạn là nơi yên tĩnh, có không gian xanh, an ninh tốt. Bạn hợp với nhà ở khu dân trí cao, gần công viên hoặc sông nước. Không hợp nơi ồn ào, chật chội.',
    tichLuy: 'Bạn có xu hướng tích lũy chậm mà chắc — thích những thứ bền lâu, giữ gìn kỹ những gì mình đã có. Nếp quản lý tài sản của bạn thiên về an toàn và ổn định hơn là nhanh.',
    loiKhuyen: [
      'Ưu tiên một chỗ ở yên ổn, hợp nhu cầu thật của mình trước rồi mới tính chuyện khác.',
      'Giữ nhà cửa ngăn nắp, sạch sẽ.',
      'Mọi quyết định lớn về nhà cửa, tài sản nên được cân nhắc kỹ, hỏi người có chuyên môn và đọc kỹ giấy tờ trước khi ký.'
    ]
  },
  'B': { // Tự tạo: Vũ Khúc, Tham Lang, Thiên Đồng
    tomTat: 'Nhà cửa của bạn thuộc nhóm "tự tạo" — bạn tự gây dựng nhà đất bằng sức mình. Mặt xấu: ít được gia đình đỡ, giai đoạn đầu chật vật, có thể phải vay nợ lớn để có nhà.',
    nhaCua: 'Bạn có xu hướng tự lập trong việc nhà cửa — theo cách luận truyền thống, bạn ít dựa vào thừa hưởng mà tự tay gây dựng (bạn hãy đối chiếu với thực tế). Ban đầu có thể khó khăn, nhưng càng về sau càng ổn định. Nhà cửa của bạn có giá trị tài chính cao.',
    moiTruong: 'Môi trường sống lý tưởng của bạn là nơi có không gian làm việc, gần trung tâm thương mại hoặc khu công nghiệp. Bạn hợp với nhà phố, căn hộ tiện nghi hơn là nhà vườn yên tĩnh. Không hợp nơi quá xa trung tâm, khó di chuyển.',
    tichLuy: 'Bạn có xu hướng tích lũy bằng sức mình, từng bước một — vừa làm vừa xây dần nền tảng. Nếp quản lý tài sản hợp với bạn là có kế hoạch rõ, biết mình đang ở đâu và cần gì tiếp theo.',
    loiKhuyen: [
      'Ưu tiên chỗ ở vừa sức, không vay quá khả năng.',
      'Lập kế hoạch thu chi rõ ràng và giữ quỹ dự phòng trước khi tính các việc lớn.',
      'Chăm chút, sửa sang dần không gian đang ở.'
    ]
  },
  'C': { // Hưởng tổ nghiệp: Thái Dương, Thiên Lương, Thiên Tướng
    tomTat: 'Nhà cửa của bạn thuộc nhóm "hưởng tổ nghiệp" — bạn có duyên được thừa hưởng nhà đất từ gia đình, hoặc sống ở nơi có truyền thống lâu đời. Mặt xấu: tài sản chung dễ sinh chuyện chia chác, và bạn bị ràng buộc trách nhiệm với họ hàng.',
    nhaCua: 'Lá số gợi ý bạn có duyên được thừa hưởng nhà đất từ ông bà, cha mẹ — bạn hãy đối chiếu với thực tế gia đình mình. Nhà cửa của bạn có xu hướng ở nơi có truyền thống, gần họ hàng. Bạn cũng có khả năng giữ gìn và phát triển tài sản thừa hưởng thành tài sản lớn hơn.',
    moiTruong: 'Môi trường sống lý tưởng của bạn là nơi gần gia đình, họ hàng, có không gian sinh hoạt chung. Bạn hợp với nhà có sân vườn, gần chùa hoặc đình làng. Không hợp nơi quá xa quê hương, xa gia đình.',
    tichLuy: 'Bạn có xu hướng trân trọng và giữ gìn những gì gia đình để lại, kể cả kỷ vật và nếp nhà. Nếp quản lý tài sản của bạn mang tính truyền thống — giữ gốc trước, phát triển sau.',
    loiKhuyen: [
      'Giữ gìn nhà cửa tổ nghiệp.',
      'Cải tạo nhà cũ thành không gian sống hiện đại.',
      'Giữ kết nối thường xuyên với gia đình, họ hàng.'
    ]
  },
  'D': { // Biến động: Thất Sát, Phá Quân, Thiên Cơ, Cự Môn, Liêm Trinh
    tomTat: 'Nhà cửa của bạn thuộc nhóm "biến động" — bạn có xu hướng thay đổi chỗ ở nhiều lần trong đời. Mặt tốt: linh hoạt, đi theo cơ hội. Mặt xấu: hao tiền qua mỗi lần chuyển, khó giữ nhà tổ và dễ vướng tranh chấp giấy tờ.',
    nhaCua: 'Bạn có xu hướng thay đổi chỗ ở nhiều lần — mua bán, chuyển nhà, hoặc đổi thành phố sinh sống. Nhà cửa của bạn ít khi cố định một chỗ lâu dài. Chuyện thừa kế trong gia đình và ranh giới với hàng xóm là chỗ dễ phát sinh tranh chấp nhất.',
    moiTruong: 'Môi trường sống lý tưởng của bạn là nơi có nhiều cơ hội thay đổi — gần trung tâm kinh tế, có thể di chuyển linh hoạt. Bạn hợp với căn hộ hơn là nhà cố định. Không hợp nơi quá yên tĩnh, ít biến động.',
    tichLuy: 'Bạn có xu hướng sống linh hoạt, sẵn sàng thay đổi chỗ ở theo công việc và cơ hội. Nếp quản lý tài sản hợp với bạn là gọn nhẹ, dễ xoay xở, ưu tiên sự an toàn hơn những khoản lời nhanh.',
    loiKhuyen: [
      'Đọc kỹ giấy tờ, hợp đồng thuê hoặc chuyển nhà trước khi ký.',
      'Giữ đồ đạc gọn nhẹ, dễ mang theo.',
      'Giữ một khoản dự phòng cho những lần chuyển chỗ ở.'
    ]
  },
  'F': { // VCD
    tomTat: 'Nhà cửa của bạn thuộc nhóm đặc biệt — phần nhà cửa trên lá số để trống (không có sao chính). Mặt tốt: dễ thích nghi chỗ ở mới. Mặt xấu: nhà cửa phụ thuộc hoàn cảnh, dễ đến muộn và khó có chỗ ở ổn định lâu dài.',
    nhaCua: 'Bạn có xu hướng linh hoạt về chỗ ở — có thể sống ở nhiều nơi khác nhau trong đời. Nhà cửa thường thay đổi theo hoàn cảnh. Bạn dễ thích nghi với môi trường mới, nhưng cũng dễ mất gốc nếu không giữ được nơi chốn ổn định.',
    moiTruong: 'Môi trường sống lý tưởng của bạn là nơi có nhiều cơ hội thay đổi, gần trung tâm hoặc gần người thân. Bạn hợp với nhà thuê hoặc căn hộ hơn là nhà cố định. Không hợp nơi quá xa xôi, khó thay đổi.',
    tichLuy: 'Cách tích lũy của bạn phụ thuộc nhiều vào nền tảng phúc đức và thu nhập ổn định. Bạn nên tập trung xây dựng thu nhập đều đặn trước, rồi mới nghĩ đến việc mua nhà. Tránh vay nợ lớn để mua bất động sản khi chưa có nguồn thu vững chắc.',
    loiKhuyen: [
      'Không nên vội vàng mua nhà.',
      'Xây dựng quỹ tiết kiệm dài hạn.',
      'Tham khảo ý kiến người có kinh nghiệm trước khi quyết định mua bất động sản.'
    ]
  }
};

/* ============================================================
 *  BẢNG DỮ LIỆU + KHO VĂN CHO CUNG PHÚC ĐỨC (tinh thần + nền tâm thức)
 * ============================================================ */

var TUVI_FACT_PHUCDUC_CHINHTINH = {
  'Tử Vi':      { yNghia: 'Lá số gợi ý dòng họ của bạn coi trọng uy tín và nền nếp (bạn hãy đối chiếu với gia đình mình). Bạn có xu hướng được hưởng phúc ấm từ tổ tiên — cuộc đời có xu hướng có quý nhân nâng đỡ khi khó khăn. Mặt trái là gánh nặng giữ thể diện dòng họ, và bạn dễ tự đặt áp lực phải hơn người.', linhHon: 'Nền tâm thức của bạn mang khí chất người đứng đầu: sinh ra đã muốn được công nhận và tự thấy mình phải gánh vác. Bài học mang theo là bớt cái tôi — mặt xấu của nét này là khó chịu khi bị đặt dưới người khác và hay cô độc trên vị trí của mình.', trongSo: 1.6, tags: ['phuc_day', 'dong_ho_co_uy_tin', 'co_quy_nhan'] },
  'Thiên Cơ':   { yNghia: 'Tinh thần của bạn thuộc mẫu người hay lo nghĩ, suy tư nhiều. Bạn dễ tìm thấy bình an qua học hỏi, nghiên cứu. Mặt xấu: phúc phần ở mức trung bình, tâm khó yên, hay mất ngủ vì nghĩ ngợi.', linhHon: 'Nền tâm thức của bạn là người tìm tòi, thích hỏi "tại sao". Bài học mang theo là sống chung với sự vô thường — mặt xấu là hay băn khoăn, nghĩ nhiều mà làm ít, khó yên lòng với lựa chọn của mình.', trongSo: 1.3, tags: ['lo_nghi', 'can_tu_tam', 'thich_hoc_hoi'] },
  'Thái Dương': { yNghia: 'Bạn thuộc mẫu người hưởng phúc từ bên nội, tinh thần lạc quan, hào sảng. Theo cách luận truyền thống, bên cha có thể có người thành đạt, bạn có thể được thừa hưởng uy tín và mối quan hệ — bạn hãy đối chiếu với thực tế. Mặt trái là dễ phải gánh kỳ vọng của bên nội và hay hao sức lo việc họ.', linhHon: 'Nền tâm thức của bạn hướng ra ngoài, muốn soi sáng và phụng sự người khác. Bài học mang theo là biết giữ sức cho mình — mặt xấu là cho đi quá mức, kiệt sức và tự ái khi không được ghi nhận.', trongSo: 1.5, tags: ['phuc_ben_noi', 'lac_quan', 'co_the_thua_huong_uy_tin'] },
  'Vũ Khúc':    { yNghia: 'Phúc của bạn gắn với tài chính — bạn có xu hướng có duyên kiếm tiền và giữ của. Tinh thần thực tế, sống tự lập từ sớm. Mặt trái là đời sống tinh thần khô, ít được an ủi, và tình thân trong họ khá lạnh.', linhHon: 'Nền tâm thức của bạn tin vào hành động và sự bền bỉ, thích tự tay làm ra. Bài học mang theo là mềm lòng hơn — mặt xấu là khô khan, cứng nhắc, khó bày tỏ tình cảm với người thân.', trongSo: 1.4, tags: ['phuc_tai', 'thuc_te', 'tu_lap'] },
  'Thiên Đồng': { yNghia: 'Bạn thuộc mẫu người hưởng phúc an nhàn, tinh thần thoải mái. Cuộc sống có xu hướng ít sóng gió, dễ tìm thấy niềm vui trong những điều giản dị. Mặt trái là dễ an phận, thiếu ý chí vươn lên khi cuộc sống đòi hỏi.', linhHon: 'Nền tâm thức của bạn hướng về sự bình yên, như người đã mỏi vì biến cố. Bài học mang theo là dám đối mặt — mặt xấu là hay né tránh việc khó, an phận và chậm lớn về tinh thần.', trongSo: 1.5, tags: ['phuc_an_nhan', 'tinh_than_nhe', 'de_tim_niem_vui'] },
  'Liêm Trinh': { yNghia: 'Theo cách luận truyền thống, tình thân trong họ cần được vun đắp nhiều hơn — bạn hãy đối chiếu với trải nghiệm thật. Mặt xấu: tinh thần dễ căng thẳng, khắt khe với chính mình, họ hàng ít gắn kết. Mặt tốt: bạn sống nguyên tắc, giữ được mình.', linhHon: 'Nền tâm thức của bạn sống nguyên tắc, khắt khe với đúng – sai. Bài học mang theo là cân bằng lý trí và cảm xúc — mặt xấu là dễ cực đoan, tự dằn vặt và làm người thân thấy ngột ngạt.', trongSo: 1.3, tags: ['dong_ho_it_gan_ket', 'can_tu_tam', 'song_nguyen_tac'] },
  'Thiên Phủ':  { yNghia: 'Bạn thuộc mẫu người có phúc phần khá dày — lá số gợi ý dòng họ đông đúc và biết lo toan (bạn hãy đối chiếu thực tế). Bạn có xu hướng được thừa hưởng nền tảng tinh thần vững vàng từ gia đình, sống điềm đạm và an nhiên. Mặt trái là dễ bảo thủ, ngại thay đổi nếp cũ của gia đình.', linhHon: 'Nền tâm thức của bạn là người giữ gìn, quản lý, thích nề nếp. Bài học mang theo là chấp nhận thay đổi — mặt xấu là bảo thủ, sợ mất cái đang có nên bỏ lỡ cơ hội mới.', trongSo: 1.6, tags: ['phuc_day', 'dong_ho_dong_duc', 'diem_dam'] },
  'Thái Âm':    { yNghia: 'Bạn thuộc mẫu người hưởng phúc từ bên ngoại, đời sống tinh thần phong phú. Có duyên với nghệ thuật, tâm linh và những điều tinh tế. Mặt trái là đa sầu, dễ buồn vô cớ và hay sống trong hoài niệm.', linhHon: 'Nền tâm thức của bạn giàu nội tâm, nhạy với cái đẹp và nỗi buồn. Bài học mang theo là sống ở hiện tại — mặt xấu là hay hoài niệm, đa sầu, buồn vô cớ kéo dài.', trongSo: 1.5, tags: ['phuc_ben_ngoai', 'tinh_than_phong_phu', 'co_duyen_nghe_thuat'] },
  'Tham Lang':  { yNghia: 'Bạn thuộc mẫu người biết hưởng thụ, sống có niềm vui. Mặt xấu: dễ bị cuốn theo thú vui vật chất, hao tiền và sức khỏe vì ham muốn, tinh thần trống rỗng sau những cuộc vui.', linhHon: 'Nền tâm thức của bạn khát trải nghiệm, muốn nếm đủ mọi thứ của đời. Bài học mang theo là biết đủ — mặt xấu là dễ sa đà ham muốn, hao tiền hao sức rồi thấy trống rỗng.', trongSo: 1.3, tags: ['ham_vui', 'can_tu_duong', 'can_tiet_che'] },
  'Cự Môn':     { yNghia: 'Theo cách luận truyền thống, trong họ có thể có lúc bất đồng — bạn hãy đối chiếu thực tế. Mặt xấu: tinh thần dễ bất an, hay lo lắng và nghi ngờ chuyện không đâu, họ hàng hay có lời ra tiếng vào. Mặt tốt: bạn tỉnh táo, khó bị lừa.', linhHon: 'Nền tâm thức của bạn hay hoài nghi, sắc về lời nói. Bài học mang theo là dùng lời đúng chỗ — mặt xấu là nói thẳng làm tổn thương người khác, nghi ngờ nhiều nên khó tin ai.', trongSo: 1.3, tags: ['dong_ho_thi_phi', 'tam_bat_an', 'can_buong_bo'] },
  'Thiên Tướng':{ yNghia: 'Bạn thuộc mẫu người được tổ tiên che chở, phúc hậu và đàng hoàng. Tinh thần vững vàng, sống có nguyên tắc, ít khi làm điều trái với lương tâm. Mặt trái là hay gánh việc của họ hàng và khó từ chối.', linhHon: 'Nền tâm thức của bạn là người phò tá, trung thành, muốn bảo vệ người khác. Bài học mang theo là biết từ chối — mặt xấu là gánh việc thiên hạ, bị lợi dụng lòng tốt.', trongSo: 1.5, tags: ['to_tien_che_cho', 'tinh_than_vung', 'song_nguyen_tac'] },
  'Thiên Lương':{ yNghia: 'Bạn thuộc mẫu người có phúc phần dày, được âm đức phù hộ. Tinh thần an nhiên, sống nhân hậu và thích giúp đỡ người khác, càng lớn tuổi càng được kính trọng. Mặt trái là ôm chuyện thiên hạ, tốn sức tốn tiền cho người khác.', linhHon: 'Nền tâm thức của bạn già dặn, từ bi, thích che chở. Bài học mang theo là không ôm hết chuyện người — mặt xấu là hay dạy đời, tốn sức tốn tiền cho việc không phải của mình.', trongSo: 1.6, tags: ['phuc_tho', 'nhan_hau', 'duoc_am_duc_phu_ho'] },
  'Thất Sát':   { yNghia: 'Mặt xấu: tinh thần của bạn có xu hướng vất vả, ít khi được an nhàn, ít được nhờ tổ tiên. Mặt tốt: phúc phần bạn tự tạo nên ít ai lấy đi được, và về già có xu hướng an ổn hơn.', linhHon: 'Nền tâm thức của bạn quyết liệt, luôn muốn đấu tranh cho điều mình tin. Bài học mang theo là biết dừng — mặt xấu là nóng vội, cô độc vì đi một mình, dễ làm đổ vỡ quan hệ.', trongSo: 1.3, tags: ['tinh_than_vat_va', 'tu_tao_phuc', 'co_the_an_on_ve_gia'] },
  'Phá Quân':   { yNghia: 'Lá số gợi ý dòng họ có nhiều thay đổi qua các thế hệ — bạn hãy đối chiếu thực tế. Mặt xấu: tinh thần dễ bôn ba, bất an, khó tìm được chỗ yên. Mặt tốt: bạn dám bỏ nếp cũ không hợp của gia đình.', linhHon: 'Nền tâm thức của bạn là người phá cũ dựng mới, không chịu đứng yên. Bài học mang theo là xây cho xong cái đã bắt đầu — mặt xấu là bất an thường trực, bỏ dở và làm người thân mệt mỏi.', trongSo: 1.3, tags: ['dong_ho_bien_dong', 'tinh_than_bon_ba', 'can_on_dinh_noi_tam'] }
};

var TUVI_FACT_PHUCDUC_PHUTINH = {
  'Thiên Đức':   { yNghia: 'Được âm đức phù hộ, tâm thiện, gặp dữ hóa lành. Đây là dấu hiệu phúc phần rất dày.', loai: 'manh', trongSo: 1.6, tags: ['am_duc_phu_ho'] },
  'Nguyệt Đức':  { yNghia: 'Tâm thiện, phúc hậu, lá số gợi ý trong họ có người hướng thiện. Gặp nạn có người giúp.', loai: 'manh', trongSo: 1.6, tags: ['tam_thien', 'phuc_hau'] },
  'Hoa Cái':     { yNghia: 'Thiên hướng tâm linh, tôn giáo, triết học. Bạn dễ tìm thấy bình an qua thiền định. Mặt trái là dễ sống cô độc, tự tách mình khỏi người khác.', loai: 'manh', trongSo: 1.3, tags: ['tam_linh', 'chiem_nghiem'] },
  'Tả Phù':      { yNghia: 'Được người khác giúp đỡ, dòng họ có người đỡ đầu. Tinh thần vững vàng nhờ có hậu thuẫn.', loai: 'manh', trongSo: 1.1, tags: ['duoc_giup_do'] },
  'Hữu Bật':     { yNghia: 'Anh em họ hàng có xu hướng gắn kết, giúp đỡ lẫn nhau, tình thân bền chặt.', loai: 'manh', trongSo: 1.1, tags: ['dong_ho_gan_ket'] },
  'Long Trì':    { yNghia: 'Tinh thần thanh cao, có gu thẩm mỹ. Lá số gợi ý dòng họ coi trọng văn hóa.', loai: 'manh', trongSo: 1.0, tags: ['thanh_cao'] },
  'Phượng Các':  { yNghia: 'Tinh thần thanh lịch, sống có phong cách. Lá số gợi ý trong họ có thể có người theo nghệ thuật hoặc văn hóa.', loai: 'manh', trongSo: 1.0, tags: ['thanh_lich'] },
  'Hóa Khoa':    { yNghia: 'Tinh thần sáng suốt, học vấn cao. Lá số gợi ý dòng họ coi trọng học hành. Gặp khó có người giải giúp.', loai: 'manh', trongSo: 1.4, tags: ['hoc_van_cao'] },
  'Hóa Lộc':     { yNghia: 'Phúc lộc dồi dào, đời sống tinh thần và vật chất có xu hướng đủ đầy.', loai: 'manh', trongSo: 1.4, tags: ['phuc_loc'] },
  'Thiên Quan':  { yNghia: 'Có Thiên Quan — lá số gợi ý trong họ có người có địa vị, uy tín — bạn hãy đối chiếu với gia đình mình.', loai: 'manh', trongSo: 1.1, tags: ['dong_ho_uy_tin'] },
  'Thiên Phúc':  { yNghia: 'Có Thiên Phúc — phúc thiện, may mắn. Bạn thường gặp được người tốt giúp đỡ trong cuộc sống.', loai: 'manh', trongSo: 1.2, tags: ['phuc_thien'] },
  'Địa Không':   { yNghia: 'Tinh thần hay trống trải, dễ cảm thấy hư vô, mất phương hướng sống; mặt được là bạn ít bám chấp vật chất.', loai: 'yeu', trongSo: 1.4, tags: ['tinh_than_trong_trai'] },
  'Địa Kiếp':    { yNghia: 'Phúc phần mỏng, dòng họ dễ có thăng trầm, hao tán, và bạn ít được nhờ nền tảng gia đình khi gặp khó.', loai: 'yeu', trongSo: 1.4, tags: ['phuc_mong', 'can_tu_tam'] },
  'Thiên Hư':    { yNghia: 'Tinh thần hay lo âu, dễ bất an, thấy cuộc sống thiếu chỗ bám.', loai: 'yeu', trongSo: 1.1, tags: ['lo_au'] },
  'Thiên Khốc':  { yNghia: 'Tinh thần nhạy cảm, dễ buồn phiền, hay ôm nỗi buồn trong lòng lâu ngày.', loai: 'yeu', trongSo: 1.1, tags: ['nhao_cam_buon'] },
  'Hóa Kỵ':      { yNghia: 'Nội tâm nặng nề, dễ mang cảm xúc tiêu cực, và trong họ hay có thị phi, hiềm khích.', loai: 'yeu', trongSo: 1.5, tags: ['noi_tam_nang', 'dong_ho_thi_phi'] },
  'Tang Môn':    { yNghia: 'Tinh thần dễ buồn thương, hay day dứt chuyện cũ và mất mát trong gia đình.', loai: 'yeu', trongSo: 1.1, tags: ['buon_qua_khu'] },
  'Bạch Hổ':     { yNghia: 'Tinh thần hay chịu áp lực từ chuyện gia đình, họ hàng, có những việc buồn trong họ phải đứng ra gánh vác.', loai: 'yeu', trongSo: 1.0, tags: ['anh_huong_tang_su'] },
  'Cô Thần':     { yNghia: 'Tinh thần dễ cô đơn, ít chia sẻ với người khác và dễ bị cô lập; mặt được là bạn tự lập về tinh thần.', loai: 'yeu', trongSo: 1.0, tags: ['co_don_tinh_than'] },
  'Quả Tú':      { yNghia: 'Tinh thần đơn chiếc, dễ thấy lạc lõng ngay giữa người thân; mặt được là bạn chịu được cô độc.', loai: 'yeu', trongSo: 1.0, tags: ['don_chiec'] }
};

var TUVI_VAN_PHUCDUC = {
  'A': {
    tomTat: 'Phúc phần của bạn thuộc nhóm "phúc dày" — lá số gợi ý nền tảng gia đình tốt, đời sống tinh thần phong phú, cuộc đời nhiều may mắn và được che chở. Mặt trái là dễ quen được đỡ, chủ quan, và gánh kỳ vọng giữ tiếng cho dòng họ.',
    dongHo: 'Lá số gợi ý dòng họ của bạn có truyền thống tốt — ông bà, cha mẹ thường là người có đức, có uy tín trong làng xóm hoặc cộng đồng; bạn có xu hướng được thừa hưởng không chỉ vật chất mà còn cả uy tín và các mối quan hệ quý giá. Trong họ có thể có người thành đạt, có vị trí trong xã hội — bạn hãy đối chiếu với thực tế gia đình mình.',
    linhHon: 'Lá số gợi ý nền tâm thức của bạn khá lành: trực giác tốt về điều đúng – sai, tâm dễ an, ít bị cuốn vào thù oán. Theo lối nói gieo – gặt, bạn đang được gặt phần tốt mà người trước đã gieo. Mặt trái là dễ tự mãn với cái có sẵn; phúc không được vun thêm thì mỏng dần, và bài học mang theo của bạn là tự gieo tiếp chứ không chỉ hưởng.',
    tinhThan: 'Đời sống tinh thần của bạn phong phú, ít khi cảm thấy trống trải. Bạn có xu hướng lạc quan, biết tận hưởng những điều giản dị, và dễ tìm thấy bình an trong nội tâm. Bạn cũng có duyên với nghệ thuật, tâm linh, hoặc các hoạt động văn hóa.',
    motMinh: 'Những lúc một mình, bạn thường cảm thấy bình yên chứ không cô đơn. Bạn có thể ngồi hàng giờ đọc sách, thiền, hoặc suy ngẫm mà không cảm thấy bứt rứt. Mặt trái là bạn dễ thu mình quá lâu, khiến người thân thấy bạn xa cách.',
    loiKhuyen: [
      'Giữ gìn và phát huy truyền thống tốt đẹp của dòng họ.',
      'Dành thời gian tĩnh tâm mỗi ngày.',
      'Làm việc thiện nguyện ít nhất mỗi năm một lần.'
    ]
  },
  'B': {
    tomTat: 'Phúc phần của bạn thuộc nhóm "trung bình" — lá số gợi ý nền tảng gia đình ở mức khá, đời sống tinh thần ổn định nhưng hay lo nghĩ, khó thật sự thảnh thơi.',
    dongHo: 'Theo cách luận truyền thống, dòng họ của bạn ở mức khá — không quá giàu sang nhưng cũng không thiếu thốn; ông bà, cha mẹ sống đức độ, được hàng xóm quý mến. Bạn có xu hướng được thừa hưởng nền nếp gia đình và sự giáo dục cẩn thận — hãy đối chiếu với trải nghiệm thật của mình.',
    linhHon: 'Nền tâm thức của bạn nhiều trăn trở: hay suy nghĩ, tìm tòi ý nghĩa cuộc sống, có chất nghệ sĩ. Bài học mang theo là sống yên với câu hỏi chưa có lời đáp. Mặt xấu: nỗi băn khoăn đó khiến bạn khó yên lòng, hay hoài nghi chính lựa chọn của mình và mất ngủ vì nghĩ.',
    tinhThan: 'Đời sống tinh thần của bạn khá ổn định, nhưng đôi khi bị chi phối bởi lo lắng và suy nghĩ quá nhiều. Bạn là người hay tư duy, thích tìm hiểu sâu về mọi vấn đề. Khi buồn, bạn có xu hướng thu mình lại thay vì chia sẻ.',
    motMinh: 'Những lúc một mình, tâm trí bạn thường không yên — hay suy nghĩ về quá khứ, lo lắng cho tương lai. Những vòng suy nghĩ đó làm bạn mất ngủ, mệt mỏi và đánh giá thấp chính mình.',
    loiKhuyen: [
      'Thực hành thiền hoặc hít thở sâu 10 phút mỗi ngày để làm dịu tâm trí.',
      'Viết ra giấy những điều lo lắng.',
      'Chủ động chia sẻ cảm xúc với người tin cậy.'
    ]
  },
  'C': {
    tomTat: 'Phúc phần của bạn thuộc nhóm "phúc mỏng" — theo cổ học, cuộc đời bạn có xu hướng phải tự lực nhiều, ít được gia đình đỡ khi gặp khó. Mặt tốt: những gì có được là do chính bạn làm ra, khó ai lấy đi.',
    dongHo: 'Lá số gợi ý dòng họ của bạn có thể ít nền tảng, hoặc từng trải qua thăng trầm; ông bà, cha mẹ có thể đã vất vả gây dựng — bạn hãy đối chiếu với thực tế. Mặt xấu: thừa hưởng ít, lúc khó thường không có chỗ dựa. Mặt tốt: bạn học được tinh thần tự lực và chịu khó.',
    linhHon: 'Nền tâm thức của bạn mang dấu thử thách: theo lối nói gieo – gặt, phần phúc có sẵn mỏng nên đời này dễ gặp cảnh làm nhiều mà ít được hưởng, gặp khó ít người đỡ. Mặt tốt: cái gì bạn tự gieo thì tự gặt, ít phụ thuộc ai. Bài học mang theo của bạn là món nợ công sức — phải bỏ công trước rồi mới thấy quả.',
    tinhThan: 'Đời sống tinh thần của bạn không mấy phong phú, đôi khi cảm thấy trống trải. Bạn thường bận rộn với cuộc sống vật chất, ít có thời gian chăm sóc đời sống nội tâm. Tinh thần không vững thì dễ kiệt sức, chán nản giữa đường.',
    motMinh: 'Những lúc một mình, bạn có thể cảm thấy trống vắng hoặc lo lắng về tương lai. Bạn hay lấp khoảng trống đó bằng việc bận rộn, nên khi dừng lại thì nỗi trống vắng càng rõ.',
    loiKhuyen: [
      'Bắt đầu xây dựng đời sống tinh thần từ những việc nhỏ.',
      'Tham gia một cộng đồng tích cực.',
      'Làm việc thiện nguyện định kỳ.'
    ]
  },
  'D': {
    tomTat: 'Phúc phần của bạn thuộc nhóm "biến động" — lá số gợi ý gia đình có thăng trầm, đời sống tinh thần lên xuống mạnh, khó có được sự yên ổn lâu dài. Mặt tốt: bản lĩnh và khả năng tự lực cao.',
    dongHo: 'Lá số gợi ý dòng họ của bạn có thể trải qua nhiều thay đổi qua các thế hệ — bạn hãy đối chiếu với thực tế gia đình mình. Mặt xấu: nền tảng gia đình không vững, có giai đoạn ly tán. Mặt tốt: bạn có bản lĩnh và khả năng tự lực cao.',
    linhHon: 'Nền tâm thức của bạn mãnh liệt, bất an, luôn khát đổi mới như người từng qua nhiều biến cố. Mặt tốt: dám phá cái cũ không hợp. Mặt xấu: đời này bạn dễ sống trong trạng thái bồn chồn, ít khi thấy đủ, quyết vội rồi hối. Bài học mang theo là học cách đứng yên.',
    tinhThan: 'Đời sống tinh thần của bạn thăng trầm theo cảm xúc — khi vui thì rất sôi nổi, khi buồn thì dễ chùng xuống. Bạn dễ bị cuốn theo ham muốn và thú vui vật chất, hao tiền, hao sức rồi thấy trống rỗng.',
    motMinh: 'Những lúc một mình, bạn dễ cảm thấy bứt rứt, muốn làm gì đó thay vì ngồi yên. Tâm khó tĩnh khiến bạn hay quyết vội và chạy theo những thứ không thật sự cần.',
    loiKhuyen: [
      'Ngồi yên 15 phút mỗi ngày, không điện thoại.',
      'Tìm một người thầy tinh thần (tâm linh, triết học, hoặc thiền định) để hướng dẫn bạn tu tập.',
      'Làm việc thiện nguyện và tránh xa các thú vui độc hại.'
    ]
  },
  'F': {
    tomTat: 'Phúc phần của bạn thuộc nhóm đặc biệt — phần phúc phần trên lá số để trống (không có sao chính). Mặt tốt: ít bị ràng buộc bởi dòng họ. Mặt xấu: tinh thần dễ dao động theo môi trường, ít chỗ dựa vững.',
    dongHo: 'Lá số không cho thấy nét nổi bật về dòng họ — bạn hãy đối chiếu với thực tế gia đình mình. Mặt tốt: bạn tự do, không bị ràng buộc bởi truyền thống. Mặt xấu: ít được dòng họ nâng đỡ khi cần.',
    linhHon: 'Nền tâm thức của bạn chưa có nét định hình rõ, dễ thay đổi theo môi trường. Mặt tốt: bạn tự do tự tạo phúc cho mình, không bị gánh nặng dòng họ đè lên. Mặt xấu: thiếu một nền móng có sẵn để dựa, gặp người xấu thì dễ bị kéo theo. Bài học mang theo là tự chọn chỗ đứng cho mình.',
    tinhThan: 'Đời sống tinh thần của bạn linh hoạt — dễ thay đổi tùy môi trường và người xung quanh. Khi gần người tích cực, bạn thấy vui vẻ; khi gần người tiêu cực, bạn dễ bị cuốn theo, sa vào thói xấu hoặc tâm trạng u ám của họ.',
    motMinh: 'Những lúc một mình, tâm trạng của bạn phụ thuộc vào cung xung chiếu (Tật Ách). Nếu Tật Ách tốt, bạn thấy bình an; nếu không, bạn dễ lo lắng, bồn chồn và mất ngủ.',
    loiKhuyen: [
      'Chọn bạn mà chơi.',
      'Xây dựng thói quen tĩnh tâm hàng ngày.',
      'Đừng trông chờ vào thừa hưởng; phần phúc của bạn phải tự làm ra.'
    ]
  }
};

/* ============================================================
 *  BẢNG DỮ LIỆU RIÊNG CHO CUNG THIÊN DI (ra ngoài, xã hội)
 *  Chủ thể là BẢN THÂN khi bước ra khỏi vùng an toàn
 * ============================================================ */

var TUVI_FACT_THIENDI_CHINHTINH = {
  'Tử Vi':      { yNghia: 'Khi ra ngoài, bạn toát lên phong thái tự tin và được người khác nể trọng. Bạn có xu hướng giữ vai trò chủ động trong các tình huống xã hội và dễ tạo được lòng tin. Mặt trái là dễ bị cho là kiêu, va chạm với người cũng muốn đứng đầu.', trongSo: 1.6, tags: ['phong_thai_tu_tin', 'duoc_ne_trong', 'chu_dong'] },
  'Thiên Cơ':   { yNghia: 'Khi ra ngoài, bạn thuộc mẫu người hay di chuyển, thích nghi nhanh với môi trường mới. Mặt xấu: hay thay đổi chỗ ở hoặc công việc, khó bám rễ một nơi và dễ thấy mình chông chênh.', trongSo: 1.4, tags: ['hay_di_chuyen', 'thich_nghi_nhanh', 'hay_thay_doi'] },
  'Thái Dương': { yNghia: 'Khi ra ngoài, bạn thuộc mẫu người hướng ngoại, nhiệt tình, thích giao tiếp. Bạn có xu hướng giao du rộng và được nhiều người biết đến. Mặt trái là tốn sức, tốn tiền cho quan hệ và hay bị nhờ vả.', trongSo: 1.5, tags: ['huong_ngoai', 'nhiet_tinh', 'giao_tiep_rong'] },
  'Vũ Khúc':    { yNghia: 'Khi ra ngoài, bạn thuộc mẫu người thực tế, quyết đoán, tập trung vào mục tiêu cụ thể. Bạn đi xa thường vì mục đích rõ ràng — công việc, mưu sinh, hoặc phát triển bản thân. Mặt trái là khô khan, ít bạn bè thân ở nơi xa và dễ bị coi là thực dụng.', trongSo: 1.5, tags: ['thuc_te', 'quyet_doan', 'co_muc_tieu'] },
  'Thiên Đồng': { yNghia: 'Khi ra ngoài, bạn thuộc mẫu người dễ được lòng người khác. Bạn có xu hướng làm quen nhanh và được quý mến, nhưng thành công khi đi xa thường đến muộn hơn so với người khác, và tính dễ dãi khiến bạn hay bị lợi dụng.', trongSo: 1.3, tags: ['duoc_long_nguoi', 'de_lam_quen', 'thanh_cong_muon'] },
  'Liêm Trinh': { yNghia: 'Khi ra ngoài, bạn thuộc mẫu người có nguyên tắc, đôi khi cứng nhắc. Bạn có xu hướng va chạm nhiều hơn với người khác vì tính cách nguyên tắc. Ra ngoài dễ vướng rắc rối giấy tờ, hợp đồng, kiện cáo và va chạm khi đi lại. Mặt tốt: người ta tin bạn vì bạn giữ chữ tín.', trongSo: 1.4, tags: ['nguyen_tac', 'de_va_cham', 'can_phap_ly'] },
  'Thiên Phủ':  { yNghia: 'Khi ra ngoài, bạn thuộc mẫu người điềm đạm, đáng tin cậy. Bạn có xu hướng tạo dựng mối quan hệ bền vững với người khác và thường có người đỡ đầu khi đi xa. Mặt trái là ngại mạo hiểm, dễ bỏ lỡ cơ hội ở nơi mới.', trongSo: 1.5, tags: ['diem_dam', 'dang_tin', 'co_nguoi_do_dau'] },
  'Thái Âm':    { yNghia: 'Khi ra ngoài, bạn thuộc mẫu người nhạy cảm với môi trường mới và có khả năng thích nghi tốt. Bạn có duyên với việc đi xa, đặc biệt là xuất ngoại, nhưng đôi khi nhớ nhà và dễ u sầu khi ở nơi xa.', trongSo: 1.4, tags: ['nhao_cam', 'thich_nghi_tot', 'co_duyen_xuat_ngoai'] },
  'Tham Lang':  { yNghia: 'Khi ra ngoài, bạn thuộc mẫu người giao du rộng, có sức hút tự nhiên. Mặt xấu: ra ngoài gặp nhiều cám dỗ, dễ sa đà vào ăn chơi, rượu chè, tình cảm ngoài luồng và hao tiền vì chúng.', trongSo: 1.4, tags: ['giao_du_rong', 'co_suc_hut', 'can_giu_minh'] },
  'Cự Môn':     { yNghia: 'Khi ra ngoài, bạn thuộc mẫu người sắc sảo, hay lý luận. Mặt xấu: ra ngoài hay gặp thị phi, bị nói xấu, cãi vã và mất lòng người vì lời nói. Mặt tốt: bạn khó bị lừa bằng lời đường mật.', trongSo: 1.3, tags: ['sac_sao', 'hay_ly_luan', 'de_thi_phi'] },
  'Thiên Tướng':{ yNghia: 'Khi ra ngoài, bạn thuộc mẫu người đàng hoàng, chỉn chu, dễ tạo thiện cảm. Bạn có xu hướng được người khác nể trọng vì tác phong đáng tin cậy của mình. Mặt trái là hay nhận gánh việc của người khác và bị lợi dụng sự tử tế.', trongSo: 1.5, tags: ['dang_hoang', 'chin_chu', 'duoc_ne_trong'] },
  'Thiên Lương':{ yNghia: 'Khi ra ngoài, bạn thuộc mẫu người nhân hậu, có xu hướng được người lớn tuổi che chở. Bạn có duyên với công tác xã hội, giúp đỡ cộng đồng, hoặc những hoạt động có tính nhân văn. Mặt trái là hay ôm chuyện người ngoài, tốn sức mà ít được đền đáp.', trongSo: 1.5, tags: ['nhan_hau', 'duoc_che_cho', 'co_duyen_cong_tac_xa_hoi'] },
  'Thất Sát':   { yNghia: 'Khi ra ngoài, bạn thuộc mẫu người dám dấn thân, không ngại thử thách. Bạn có xu hướng bôn ba, vất vả mới thành công, dễ gặp tai nạn khi đi lại và va chạm với người lạ. Mặt tốt: bạn có bản lĩnh hơn người.', trongSo: 1.5, tags: ['dam_dan_than', 'bon_ba', 'can_tai_nan'] },
  'Phá Quân':   { yNghia: 'Khi ra ngoài, bạn thuộc mẫu người không thích an phận, thích thay đổi môi trường. Mặt xấu: đổi chỗ ở, công việc nhiều lần, mỗi lần đổi hao tiền và mất các mối quan hệ cũ, khó có điểm tựa ổn định.', trongSo: 1.4, tags: ['khong_an_phan', 'thich_thay_doi', 'can_on_dinh'] }
};

var TUVI_FACT_THIENDI_PHUTINH = {
  // Cát tinh — ra ngoài thuận lợi
  'Thiên Mã':   { yNghia: 'Ra ngoài nhiều, đi xa thường xuyên. Đời bạn gắn với di chuyển, xuất ngoại, thay đổi chỗ ở. Hợp với nghề phải đi lại nhiều; mặt trái là bôn ba, mệt mỏi và ít thời gian cho gia đình.', loai: 'manh', trongSo: 1.4, tags: ['di_chuyen_nhieu', 'xuat_ngoai'] },
  'Tả Phù':     { yNghia: 'Ra ngoài được người khác giúp đỡ, có quý nhân phò trợ. Đi xa không lo bơ vơ.', loai: 'manh', trongSo: 1.3, tags: ['quy_nhan', 'duoc_giup'] },
  'Hữu Bật':    { yNghia: 'Ra ngoài có người hỗ trợ, gặp gỡ thuận lợi. Bạn dễ tạo dựng được mạng lưới quan hệ khi ở nơi mới.', loai: 'manh', trongSo: 1.3, tags: ['duoc_ho_tro', 'mo_rong_quan_he'] },
  'Thiên Khôi': { yNghia: 'Ra ngoài gặp quý nhân là nam giới, người bề trên. Đi xa dễ được nâng đỡ, dìu dắt.', loai: 'manh', trongSo: 1.4, tags: ['quy_nhan_nam', 'be_tren_giup'] },
  'Thiên Việt': { yNghia: 'Ra ngoài gặp quý nhân là nữ giới, người ngoài. Đi xa dễ gặp cơ hội tốt từ những mối quan hệ mới.', loai: 'manh', trongSo: 1.4, tags: ['quy_nhan_nu', 'co_hoi_moi'] },
  'Hóa Lộc':    { yNghia: 'Ra ngoài có tài lộc, đi xa dễ kiếm tiền. Đây là điểm sáng lớn cho việc làm ăn xa hoặc xuất ngoại lao động.', loai: 'manh', trongSo: 1.6, tags: ['tai_loc_khi_di_xa'] },
  'Hóa Khoa':   { yNghia: 'Ra ngoài được nể trọng, danh tiếng tốt. Đi xa gặp khó có người giải giúp, giấy tờ thuận lợi.', loai: 'manh', trongSo: 1.5, tags: ['danh_tieng', 'giay_to_thuan'] },
  'Long Trì':   { yNghia: 'Ra ngoài toát lên khí chất thanh nhã, được người khác quý mến. Đi xa dễ được tiếp đón nồng hậu.', loai: 'manh', trongSo: 1.0, tags: ['khi_chat_thanh_nha'] },
  'Phượng Các': { yNghia: 'Ra ngoài có phong thái cao quý, giao tiếp lịch sự. Đi xa dễ gây ấn tượng tốt với người mới.', loai: 'manh', trongSo: 1.0, tags: ['phong_thai_cao_quy'] },

  // Hung tinh — ra ngoài cần chú ý
  'Kình Dương': { yNghia: 'Ra ngoài dễ va chạm, dễ gặp tai nạn giao thông khi đi xa, và tính cương mãnh dễ gây xung đột với người lạ.', loai: 'yeu', trongSo: 1.4, tags: ['tai_nan_giao_thong', 'de_va_cham'] },
  'Đà La':      { yNghia: 'Đi lại trắc trở, hay bị trì hoãn, lỡ chuyến, việc ở nơi xa dây dưa khó xong.', loai: 'yeu', trongSo: 1.3, tags: ['di_lai_trac_tro', 'tri_hoan'] },
  'Hỏa Tinh':   { yNghia: 'Ra ngoài dễ gặp chuyện bất ngờ, nóng nảy, cãi vã với người lạ và quyết vội khi gặp sự cố.', loai: 'yeu', trongSo: 1.2, tags: ['bat_ngo', 'nong_nay'] },
  'Linh Tinh':  { yNghia: 'Ra ngoài dễ gặp chuyện âm ỉ, khó chịu, và sức khỏe dễ sa sút khi ở môi trường mới.', loai: 'yeu', trongSo: 1.2, tags: ['am_i', 'suc_khoe'] },
  'Địa Không':  { yNghia: 'Ra ngoài dễ gặp hụt hẫng, mất mát, dễ bị lừa đảo khi đi xa hoặc khi tin người lạ ở nơi mới.', loai: 'yeu', trongSo: 1.3, tags: ['hut_hang', 'can_lua_dao'] },
  'Địa Kiếp':   { yNghia: 'Ra ngoài dễ mất tiền, mất đồ, thất lạc giấy tờ hoặc gặp chuyện bất ngờ làm hao tài.', loai: 'yeu', trongSo: 1.4, tags: ['bien_co', 'mat_mat'] },
  'Hóa Kỵ':     { yNghia: 'Ra ngoài dễ bị hiểu lầm, thị phi, tranh cãi với người lạ và vướng rắc rối giấy tờ, hợp đồng.', loai: 'yeu', trongSo: 1.5, tags: ['hieu_lam', 'thi_phi', 'giay_to'] }
};

var TUVI_VAN_THIENDI = {
  'A': {
    tomTat: 'Cung Thiên Di của bạn thuộc nhóm "uy tín" — ra ngoài xã hội, bạn toát lên phong thái tự tin, đàng hoàng, và dễ được nể trọng.',
    raNgoai: 'Khi bước ra khỏi nhà, bạn thuộc mẫu người tự tin, đàng hoàng, dễ tạo được lòng tin với người khác. Bạn không ngại giao tiếp, thích mở rộng mối quan hệ và thường giữ vai trò chủ động trong các tình huống xã hội. Phong thái của bạn khiến người đối diện cảm thấy đáng tin cậy.',
    moiTruong: 'Môi trường bên ngoài lý tưởng của bạn là nơi có nhiều người, có cơ hội giao lưu và thể hiện bản thân. Bạn hợp với việc ra ngoài làm ăn, công tác, hoặc sinh sống ở thành phố lớn. Không hợp với môi trường quá nhỏ hẹp, ít người.',
    coHoi: 'Cơ hội của bạn thường đến từ bên ngoài — từ những mối quan hệ xã hội, từ việc đi xa, hoặc từ việc thay đổi môi trường sống. Bạn có duyên với quý nhân nơi đất khách, đặc biệt là những người có địa vị hoặc lớn tuổi hơn.',
    luuY: 'Mặt xấu: sự tự tin của bạn dễ thành thái quá, gây va chạm và bị người khác ganh ghét; khi đi xa hay chủ quan về giấy tờ, thủ tục rồi gặp rắc rối.',
    loiKhuyen: [
      'Tận dụng các mối quan hệ xã hội.',
      'Đi xa nên có kế hoạch cụ thể.',
      'Ra ngoài nhớ giữ sức khỏe, đặc biệt là khi thay đổi môi trường sống đột ngột.'
    ]
  },
  'B': {
    tomTat: 'Cung Thiên Di của bạn thuộc nhóm "trí tuệ" — ra ngoài, bạn nhạy bén, thích nghi nhanh, và dễ hòa nhập với môi trường mới.',
    raNgoai: 'Khi ra ngoài, bạn thuộc mẫu người nhạy bén, quan sát tốt và biết cách ứng biến linh hoạt. Bạn thích khám phá môi trường mới, dễ thích nghi với văn hóa và con người khác. Tuy nhiên, bạn cũng dễ bị ảnh hưởng bởi không khí xung quanh — khi vui thì hòa đồng, khi buồn thì thu mình.',
    moiTruong: 'Môi trường bên ngoài lý tưởng của bạn là nơi có nhiều thông tin, nhiều điều mới để học hỏi. Bạn hợp với việc đi công tác, du học, hoặc làm việc ở nơi có nhiều người thông minh.',
    coHoi: 'Cơ hội của bạn thường đến từ việc học hỏi và quan sát — đi xa giúp bạn mở mang kiến thức, gặp gỡ những người thú vị. Bạn dễ thành công trong các lĩnh vực cần phân tích, tư vấn, hoặc làm việc với thông tin.',
    luuY: 'Mặt xấu: sự sắc sảo quá mức dễ gây hiểu lầm, mất lòng người; khi đi xa bạn dễ bị cuốn theo công việc mà xa cách người thân.',
    loiKhuyen: [
      'Ghi chép lại những trải nghiệm khi đi xa.',
      'Đi xa nên tìm hiểu trước về văn hóa và phong tục địa phương.',
      'Ra ngoài nhớ dành thời gian cho bản thân.'
    ]
  },
  'C': {
    tomTat: 'Cung Thiên Di của bạn thuộc nhóm "thực tế" — ra ngoài, bạn tập trung vào mục tiêu cụ thể, và mỗi bước đi đều có ý nghĩa.',
    raNgoai: 'Khi ra ngoài, bạn thuộc mẫu người thực tế, không viển vông. Bạn đi xa thường vì mục tiêu cụ thể — công việc, mưu sinh, hoặc phát triển bản thân. Bạn không thích những chuyến đi vô nghĩa, mà muốn mỗi bước đi đều mang lại giá trị. Tác phong của bạn khi ra ngoài là chững chạc, đáng tin cậy.',
    moiTruong: 'Môi trường bên ngoài lý tưởng của bạn là nơi có cơ hội phát triển, có thể xây dựng sự nghiệp. Bạn hợp với việc đi xa để làm ăn, buôn bán, hoặc công tác ở nơi có tiềm năng.',
    coHoi: 'Cơ hội của bạn thường đến từ việc nắm bắt thời cơ, từ những mối quan hệ làm ăn, hoặc từ việc mở rộng phạm vi hoạt động. Bạn có duyên trong việc phát triển sự nghiệp khi đi xa, đặc biệt nếu biết tính toán và thận trọng.',
    luuY: 'Mặt xấu: bạn hay quá tập trung vào mục tiêu mà bỏ quên các mối quan hệ, và dễ làm việc quá độ khi ở xa.',
    loiKhuyen: [
      'Đi xa nên kết hợp giữa công việc và trải nghiệm.',
      'Xây dựng mối quan hệ với người bản địa.',
      'Giữ liên lạc với gia đình.'
    ]
  },
  'D': {
    tomTat: 'Cung Thiên Di của bạn thuộc nhóm "bôn ba" — ra ngoài, bạn dám dấn thân, không ngại thử thách, và cuộc đời gắn với nhiều chuyến đi.',
    raNgoai: 'Khi ra ngoài, bạn thuộc mẫu người dám nghĩ dám làm, không ngại khó khăn. Bạn có xu hướng lao vào những thử thách mới, thích khám phá vùng đất mới, không chịu ngồi yên một chỗ. Mặt xấu: bạn cũng dễ gặp tai nạn hoặc biến cố bất ngờ khi đi lại, và hay liều ở những chỗ không đáng.',
    moiTruong: 'Môi trường bên ngoài lý tưởng của bạn là nơi có nhiều thử thách, cạnh tranh, hoặc đang trong giai đoạn phát triển mạnh. Bạn hợp với việc đi xa để khởi nghiệp, đầu tư, hoặc làm những việc chưa ai làm.',
    coHoi: 'Cơ hội của bạn thường đến từ những bước ngoặt lớn — đi xa có thể là bước ngoặt thay đổi cả cuộc đời. Bạn dễ thành công trong các lĩnh vực mạo hiểm, kinh doanh, hoặc những ngành nghề đòi hỏi sự dấn thân.',
    luuY: 'Mặt xấu: đời bôn ba nhiều, vất vả, dễ gặp tai nạn hoặc biến cố khi đi lại, và có những chuyến đi mất nhiều hơn được. Gợi ý: luôn có bảo hiểm và phương án dự phòng.',
    loiKhuyen: [
      'Đi xa nên có "kế hoạch B".',
      'Ra ngoài nhớ giữ bình tĩnh trước mọi tình huống.',
      'Xây dựng một mạng lưới hỗ trợ ở nơi mới.'
    ]
  },
  'E': {
    tomTat: 'Cung Thiên Di của bạn thuộc nhóm "giao du" — ra ngoài, bạn có duyên với con người, dễ tạo thiện cảm, và mở ra nhiều mối quan hệ mới.',
    raNgoai: 'Khi ra ngoài, bạn thuộc mẫu người hòa đồng, thích giao tiếp, dễ được lòng người. Bạn có sức hút tự nhiên, dễ tạo thiện cảm với người mới gặp. Đi xa, bạn thường gặp những người tốt bụng, sẵn sàng giúp đỡ, đặc biệt là những người lớn tuổi hoặc có kinh nghiệm sống.',
    moiTruong: 'Môi trường bên ngoài lý tưởng của bạn là nơi có nhiều người, nhiều hoạt động xã hội, văn hóa. Bạn hợp với việc đi xa để giao lưu, học hỏi, hoặc tham gia các hoạt động cộng đồng.',
    coHoi: 'Cơ hội của bạn thường đến từ các mối quan hệ — đi xa giúp bạn gặp gỡ những người có thể thay đổi cuộc đời bạn. Bạn dễ thành công trong các lĩnh vực cần giao tiếp, ngoại giao, hoặc làm việc với con người.',
    luuY: 'Mặt xấu: bạn dễ tin người, sự cởi mở quá mức khiến bạn bị lợi dụng, mất tiền hoặc vướng tình cảm phức tạp ở nơi xa.',
    loiKhuyen: [
      'Đi xa nên ghi lại thông tin liên lạc của những người bạn gặp.',
      'Ra ngoài nhớ giữ sự tỉnh táo.',
      'Tận dụng các hoạt động cộng đồng để mở rộng mạng lưới quan hệ.'
    ]
  },
  'F': {
    tomTat: 'Phần ra ngoài trên lá số để trống — ra ngoài, bạn linh hoạt, dễ thích nghi, nhưng cũng dễ bị ảnh hưởng bởi môi trường.',
    raNgoai: 'Bạn không có một "khuôn mẫu" cố định nào khi ra ngoài — bạn có thể thích nghi với bất kỳ môi trường nào, nhưng cũng dễ bị cuốn theo hoàn cảnh. Bạn như tấm gương — phản chiếu điều mà môi trường bên ngoài mang đến cho bạn. Nếu gặp người tốt, bạn sẽ được nâng đỡ; nếu gặp người xấu, bạn dễ bị lợi dụng.',
    moiTruong: 'Môi trường bên ngoài lý tưởng của bạn là nơi có nhiều cơ hội thay đổi, không cố định. Bạn hợp với những công việc linh hoạt, làm việc từ xa, hoặc những công việc cần kết nối nhiều bên.',
    coHoi: 'Cơ hội của bạn thường đến bất ngờ, từ những mối quan hệ hoặc hoàn cảnh bạn không ngờ tới. Đi xa giúp bạn khám phá những khả năng tiềm ẩn của bản thân.',
    luuY: 'Mặt xấu: bạn dễ bị người xung quanh kéo theo, đặt niềm tin sai chỗ và bị lợi dụng khi ở môi trường lạ.',
    loiKhuyen: [
      'Ra ngoài nên có một nguyên tắc sống rõ ràng.',
      'Đi xa nhớ giữ liên lạc với người thân.',
      'Cẩn thận khi kết giao.'
    ]
  }
};

/* ============================================================
 *  HÀM SINH FACTS + VĂN CHO CUNG THIÊN DI
 * ============================================================ */

function tuviSinhFactsThienDi_(chart, pi) {
  var facts = [];
  var P = chart.palaces;
  var C = P[pi];
  var lv = 'Thien Di', nhom = 'xa_hoi';

  C.chinh.forEach(function(s) {
    var info = TUVI_FACT_THIENDI_CHINHTINH[s.n];
    if (!info) return;
    var heSo = s.b ? (TUVI_FACT_DOSANG_HE_SO[s.b] || 1.0) : 1.0;
    var trongSo = Math.round(info.trongSo * heSo * 10) / 10;
    var loai = (s.b === 'H') ? 'trung' : 'manh';
    facts.push(taoFact_('Tu Vi', lv, nhom, loai, info.yNghia, trongSo,
      { nguon: 'Chính tinh ' + s.n + (s.b ? ' (' + s.b + ')' : '') + ' tại Thiên Di', doiTuong: 'ban_than', tags: info.tags.slice() }));
    if (s.hoa) {
      var fHoa = tuviFactsTuHoaSao_(s.n, s.hoa, C, lv, nhom);
      if (fHoa) facts.push(fHoa);
    }
  });

  var dsSao = [].concat(C.cat, C.hung, C.tieu);
  var daXuat = {};
  dsSao.forEach(function(s) {
    if (s.hoaOf) return;
    var info = TUVI_FACT_THIENDI_PHUTINH[s.n];
    if (!info) return;
    var key = info.yNghia.slice(0, 30);
    if (daXuat[key]) return;
    daXuat[key] = true;
    facts.push(taoFact_('Tu Vi', lv, nhom, info.loai, info.yNghia, info.trongSo,
      { nguon: 'Phụ tinh ' + s.n + ' tại Thiên Di', doiTuong: 'ban_than', tags: info.tags }));
  });

  facts = facts.concat(tuviFactsTuanTriet_(C, lv, nhom));
  facts = facts.concat(tuviFactsTamPhuongTuChinh_(chart, pi, lv, nhom));
  facts = facts.concat(tuviFactsNhiHop_(chart, pi, lv, nhom));
  facts = facts.concat(tuviFactsGiapCung_(chart, pi, lv, nhom));
  facts = facts.concat(tuviFactsVongSao_(C, lv, nhom));

  return locFactLoi_(facts);
}

function xacDinhNhomThienDi_(palace, P, pi) {
  var sao = palace.chinh.map(function(s){ return s.n; });
  if (!sao.length) {
    var xc = mod12(pi + 6);
    sao = P[xc].chinh.map(function(s){ return s.n; });
    if (!sao.length) return 'F';
  }
  if (sao.some(function(s){ return ['Tử Vi','Thái Dương','Thiên Tướng'].indexOf(s) >= 0; })) return 'A';
  if (sao.some(function(s){ return ['Thiên Cơ','Cự Môn','Thái Âm'].indexOf(s) >= 0; })) return 'B';
  if (sao.some(function(s){ return ['Vũ Khúc','Thiên Phủ','Thiên Đồng','Liêm Trinh'].indexOf(s) >= 0; })) return 'C';
  if (sao.some(function(s){ return ['Thất Sát','Phá Quân'].indexOf(s) >= 0; })) return 'D';
  if (sao.some(function(s){ return ['Tham Lang','Thiên Lương'].indexOf(s) >= 0; })) return 'E';
  return 'C';
}

function taoDoanTuHoaThienDi_(palace) {
  var dsHoa = [];
  [].concat(palace.chinh, palace.cat, palace.hung, palace.tieu).forEach(function(s) {
    if (s.hoa && dsHoa.indexOf(s.hoa) < 0) dsHoa.push(s.hoa);
  });
  if (!dsHoa.length) return null;
  var text = [];
  if (dsHoa.indexOf('Lộc') >= 0) text.push('Ra ngoài có tài lộc, đi xa dễ kiếm tiền, hợp làm ăn xa hoặc xuất ngoại lao động; mặt trái là tiền kiếm xa dễ tiêu ngay tại chỗ.');
  if (dsHoa.indexOf('Quyền') >= 0) text.push('Ra ngoài có uy, được người khác nghe theo. Đi xa dễ nắm quyền chủ động trong công việc và các mối quan hệ; mặt trái là dễ bị cho là áp đặt, gây va chạm với người sở tại.');
  if (dsHoa.indexOf('Khoa') >= 0) text.push('Ra ngoài được nể trọng, danh tiếng tốt. Đi xa gặp khó có người giải giúp, giấy tờ thuận lợi.');
  if (dsHoa.indexOf('Kỵ') >= 0) text.push('Ra ngoài dễ bị hiểu lầm, thị phi, tranh cãi với người lạ và vướng rắc rối giấy tờ, hợp đồng. Gợi ý: đọc kỹ trước khi ký.');
  if (!text.length) return null;
  return { tieuDe: 'Tứ Hóa tại Thiên Di', text: text.join(' ') };
}

function taoDoanCanhBaoThienDi_(chart, pi) {
  var P = chart.palaces;
  var C = P[pi];
  var dsSao = [].concat(C.chinh, C.cat, C.hung, C.tieu).map(function(s){ return s.n; });
  var canhBao = [];

  if (dsSao.indexOf('Kình Dương') >= 0 || dsSao.indexOf('Đà La') >= 0) {
    canhBao.push('Khi đi xa dễ gặp va chạm, tai nạn giao thông hoặc trễ nải, lỡ việc. Gợi ý: hạn chế đi đêm ở nơi xa lạ.');
  }
  if (dsSao.indexOf('Địa Không') >= 0 || dsSao.indexOf('Địa Kiếp') >= 0) {
    canhBao.push('Khi ra ngoài, bạn có xu hướng gặp việc đổ vỡ so với kỳ vọng, dễ bị lừa tiền hoặc mất đồ ở nơi mới. Gợi ý: chưa hiểu rõ thì chưa giao tiền.');
  }
  if (dsSao.indexOf('Hỏa Tinh') >= 0 || dsSao.indexOf('Linh Tinh') >= 0) {
    canhBao.push('Ra ngoài dễ gặp chuyện bất ngờ, nóng nảy, cãi vã và quyết vội khi gặp sự cố.');
  }

  var gl = mod12(pi - 1), gr = mod12(pi + 1);
  var saoL = [].concat(P[gl].chinh, P[gl].cat, P[gl].hung).map(function(s){ return s.n; });
  var saoR = [].concat(P[gr].chinh, P[gr].cat, P[gr].hung).map(function(s){ return s.n; });
  var badL = saoL.indexOf('Kình Dương') >= 0 || saoL.indexOf('Địa Không') >= 0 || saoL.indexOf('Địa Kiếp') >= 0;
  var badR = saoR.indexOf('Kình Dương') >= 0 || saoR.indexOf('Địa Không') >= 0 || saoR.indexOf('Địa Kiếp') >= 0;
  if (badL && badR) canhBao.push('Sát tinh kẹp hai bên cung Thiên Di — khi ra ngoài, bạn dễ bị chèn ép, khó thể hiện hết mình và hay gặp người gây khó dễ. Gợi ý: đi xa nên có bạn đồng hành.');

  if (!canhBao.length) return null;
  return { tieuDe: 'Cảnh báo đặc biệt khi ra ngoài', text: canhBao.join(' ') };
}

function sinhVanCungThienDi_(chart, pi) {
  var P = chart.palaces;
  var palace = P[pi];
  var nhom = xacDinhNhomThienDi_(palace, P, pi);
  var van = TUVI_VAN_THIENDI[nhom] || TUVI_VAN_THIENDI['C'];
  var facts = tuviSinhFactsThienDi_(chart, pi);
  var doan = [];

  doan.push({ tieuDe: 'Tóm tắt', text: van.tomTat });

  var textRaNgoai = van.raNgoai;
  var factsChinh = facts.filter(function(f) {
    return f.nguon && f.nguon.indexOf('Chính tinh') === 0;
  }).sort(function(a, b){ return b.trongSo - a.trongSo; });
  if (factsChinh.length) textRaNgoai += ' Cụ thể: ' + factsChinh.slice(0, 2).map(function(f){ return f.yNghia; }).join(' ');
  doan.push({ tieuDe: 'Khi bạn bước ra ngoài', text: textRaNgoai });

  doan.push({ tieuDe: 'Môi trường bên ngoài phù hợp', text: van.moiTruong });

  var textCoHoi = van.coHoi;
  var factsQuyNhan = facts.filter(function(f) {
    var t = f.tags || [];
    return t.some(function(x) {
      return x.indexOf('quy_nhan') >= 0 || x.indexOf('duoc_giup') >= 0
        || x.indexOf('duoc_ho_tro') >= 0 || x.indexOf('duoc_che_cho') >= 0;
    });
  });
  if (factsQuyNhan.length) textCoHoi += ' Các yếu tố hỗ trợ: ' + factsQuyNhan.map(function(f){ return f.yNghia; }).join(' ');
  doan.push({ tieuDe: 'Cơ hội & quý nhân nơi xa', text: textCoHoi });

  var textLuuY = van.luuY;
  var factsLuuY = facts.filter(function(f) {
    if (f.loai !== 'yeu') return false;
    if (f.nguon && f.nguon.indexOf('Chính tinh') === 0) return false;
    return true;
  }).sort(function(a, b){ return b.trongSo - a.trongSo; });
  if (factsLuuY.length) textLuuY += ' Cụ thể: ' + factsLuuY.slice(0, 3).map(function(f){ return f.yNghia; }).join(' ');
  doan.push({ tieuDe: 'Điều cần lưu ý khi ra ngoài', text: textLuuY });

  var doanHoa = taoDoanTuHoaThienDi_(palace);
  if (doanHoa) doan.push(doanHoa);

  var doanCB = taoDoanCanhBaoThienDi_(chart, pi);
  if (doanCB) doan.push(doanCB);

  doan.push({ tieuDe: 'Lời khuyên cụ thể', text: '', list: van.loiKhuyen.slice() });
  return doan;
}

function testVanCungThienDi() {
  chiChayNoiBo_(arguments[0]);
  var input = { name: 'Test', gender: 'nam', calendar: 'duong', day: 16, month: 6, year: 1995, hour: 4, minute: 0, viewYear: 2026 };
  var chart = tuviLapLaSo_(input);
  var pi = -1;
  for (var i = 0; i < 12; i++) { if (chart.palaces[i].cung === 'Thiên Di') { pi = i; break; } }
  if (pi < 0) { Logger.log('✗ Không tìm thấy cung Thiên Di'); return; }
  var doan = sinhVanCungThienDi_(chart, pi);
  Logger.log('=== VĂN CUNG THIÊN DI ===');
  Logger.log('Cung ở: ' + chart.palaces[pi].canTen + ' ' + chart.palaces[pi].chiTen);
  Logger.log('Chính tinh: ' + (chart.palaces[pi].chinh.map(function(s){return s.n;}).join(', ') || 'VCD'));
  Logger.log('Số đoạn: ' + doan.length);
  doan.forEach(function(d, i) {
    Logger.log('');
    Logger.log('--- ' + (i + 1) + '. ' + d.tieuDe + ' ---');
    if (d.text) Logger.log(d.text);
    if (d.list) d.list.forEach(function(x){ Logger.log('  • ' + x); });
  });
  Logger.log('');
  Logger.log('✓ Nếu bạn thấy các đoạn văn trên, Patch 5a đã hoạt động.');
}

/* ============================================================
 *  BẢNG DỮ LIỆU CUNG NÔ BỘC — bạn bè, đồng nghiệp, cấp dưới
 * ============================================================ */

var TUVI_FACT_NOBOC_CHINHTINH = {
  'Tử Vi':      { yNghia: 'Bạn bè, đồng nghiệp của bạn thuộc mẫu người có uy, sống nguyên tắc. Bạn có xu hướng giữ khoảng cách nhất định trong quan hệ xã hội — những mối quan hệ bạn có thường bền, nhưng ít bạn tri kỷ và dễ thấy cô độc ở vị trí cao.', trongSo: 1.5, tags: ['ban_co_uy', 'nguyen_tac', 'giu_khoang_cach'] },
  'Thiên Cơ':   { yNghia: 'Bạn bè của bạn thuộc mẫu người có đầu óc, thích khám phá. Nhóm bạn của bạn thường thay đổi theo từng giai đoạn cuộc đời — người đến rồi đi tùy theo mối quan tâm chung, ít người ở lại lâu.', trongSo: 1.3, tags: ['ban_thong_minh', 'thich_kham_pha', 'thay_doi_nhom'] },
  'Thái Dương': { yNghia: 'Bạn bè của bạn thuộc mẫu người hướng ngoại, hào phóng, nhiệt tình. Bạn có xu hướng có nhiều mối quan hệ xã hội và được mọi người yêu mến; mặt trái là tốn kém cho giao tế và hay bị nhờ vả.', trongSo: 1.5, tags: ['ban_huong_ngoai', 'hao_phong', 'nhieu_moi_quan_he'] },
  'Vũ Khúc':    { yNghia: 'Bạn bè của bạn thuộc mẫu người thực tế, quyết đoán. Quan hệ của bạn thiên về hợp tác cùng chí hướng hơn là tình cảm thân thiết kiểu bạn thân; dễ sứt mẻ khi có chuyện tiền bạc.', trongSo: 1.4, tags: ['ban_thuc_te', 'quyet_doan', 'hop_tac_cung_chi_huong'] },
  'Thiên Đồng': { yNghia: 'Bạn bè của bạn thuộc mẫu người hiền hòa, vui vẻ, dễ hợp tác. Mối quan hệ bạn bè có xu hướng thoải mái, ít áp lực; mặt trái là lúc cần việc lớn thì ít ai gánh được cùng bạn.', trongSo: 1.3, tags: ['ban_hien_hoa', 'vui_ve', 'de_hop_tac'] },
  'Liêm Trinh': { yNghia: 'Bạn bè của bạn thuộc mẫu người có nguyên tắc, đôi khi cứng nhắc. Quan hệ xã hội có thể có những căng thẳng nhất định do sự khác biệt trong quan điểm sống.', trongSo: 1.4, tags: ['ban_nguyen_tac', 'cung_nhac', 'de_cang_thang'] },
  'Thiên Phủ':  { yNghia: 'Bạn bè của bạn thuộc mẫu người biết giữ lời, đáng tin cậy. Nhóm bạn của bạn có xu hướng ổn định, ít thay đổi, và giúp đỡ lẫn nhau trong công việc; mặt trái là vòng bạn hẹp, ít người mới.', trongSo: 1.5, tags: ['ban_dang_tin', 'on_dinh', 'giup_do_cong_viec'] },
  'Thái Âm':    { yNghia: 'Bạn bè của bạn thuộc mẫu người tinh tế, biết quan tâm. Bạn có xu hướng thân thiết với bạn bè là nữ giới và nhận được sự giúp đỡ từ họ; mặt trái là dễ bị tổn thương khi bạn bè thay lòng.', trongSo: 1.4, tags: ['ban_tinh_te', 'biet_quan_tam', 'than_thiet_voi_nu'] },
  'Tham Lang':  { yNghia: 'Bạn bè của bạn thuộc mẫu người đa dạng, thích giao du. Bạn có xu hướng quen biết nhiều người nhưng không phải ai cũng là bạn thật sự — nhiều người chỉ là quan hệ xã giao.', trongSo: 1.4, tags: ['ban_da_dang', 'giao_du_rong', 'can_chon_loc'] },
  'Cự Môn':     { yNghia: 'Bạn bè của bạn thuộc mẫu người sắc sảo, hay lý luận. Mặt xấu: quan hệ bạn bè hay nảy sinh thị phi, nói xấu sau lưng hoặc hiểu lầm do lời ăn tiếng nói. Mặt tốt: bạn bè dám nói thật với bạn.', trongSo: 1.3, tags: ['ban_sac_sao', 'de_thi_phi', 'can_giu_minh'] },
  'Thiên Tướng':{ yNghia: 'Bạn bè của bạn thuộc mẫu người nghĩa khí, đàng hoàng, biết giúp đỡ. Nếu bạn là quản lý, cấp dưới của bạn có xu hướng trung thành và đáng tin cậy; mặt trái là bạn hay phải đứng ra gánh chuyện cho người khác.', trongSo: 1.5, tags: ['ban_nghia_khi', 'dang_hoang', 'nguoi_duoi_trung_thanh'] },
  'Thiên Lương':{ yNghia: 'Bạn bè của bạn thuộc mẫu người nhân hậu, chững chạc. Bạn có xu hướng thân thiết với những người lớn tuổi hoặc có kinh nghiệm sống hơn — họ thường là người dìu dắt bạn; mặt trái là ít bạn đồng trang lứa thật thân.', trongSo: 1.5, tags: ['ban_nhan_hau', 'chung_chac', 'than_thiet_lon_tuoi'] },
  'Thất Sát':   { yNghia: 'Bạn bè của bạn thuộc mẫu người có cá tính mạnh, quyết liệt. Mặt xấu: quan hệ xã hội hay va chạm, căng thẳng, có lúc đổ vỡ hoặc bị bạn bè quay lưng. Mặt tốt: tình bạn nào qua được sóng gió thì rất bền.', trongSo: 1.4, tags: ['ban_ca_tinh', 'quyet_liet', 'co_the_va_cham'] },
  'Phá Quân':   { yNghia: 'Bạn bè của bạn thuộc mẫu người thay đổi liên tục, ít ổn định. Nhóm bạn của bạn có xu hướng thay đổi theo từng giai đoạn — ơn nghĩa với bạn bè thường khó bền, dễ gặp cảnh giúp người rồi bị phụ.', trongSo: 1.4, tags: ['ban_thay_doi', 'it_on_dinh', 'can_vun_dap'] }
};

var TUVI_FACT_NOBOC_PHUTINH = {
  'Tả Phù':     { yNghia: 'Bạn có người giúp việc đắc lực, đồng nghiệp hỗ trợ nhiệt tình. Mặt trái là dễ dựa dẫm vào người giúp, hụt hẫng khi họ rời đi.', loai: 'manh', trongSo: 1.4, tags: ['nguoi_giup_dac_luc'] },
  'Hữu Bật':    { yNghia: 'Bạn bè hỗ trợ, cộng sự đáng tin. Bạn dễ tìm được người đồng hành trong công việc.', loai: 'manh', trongSo: 1.4, tags: ['ban_ho_tro'] },
  'Thiên Khôi': { yNghia: 'Bạn bè là quý nhân, sẵn sàng nâng đỡ bạn. Gặp khó khăn thường có người đứng ra giúp.', loai: 'manh', trongSo: 1.5, tags: ['ban_quy_nhan'] },
  'Thiên Việt': { yNghia: 'Bạn bè mang lại cơ hội cho bạn. Những mối quan hệ xã hội thường mở ra con đường mới.', loai: 'manh', trongSo: 1.5, tags: ['ban_mang_co_hoi'] },
  'Hóa Lộc':    { yNghia: 'Bạn bè mang lại tài lộc, có thể cùng nhau làm ăn. Quan hệ xã hội giúp bạn kiếm tiền; mặt trái là tiền bạc dễ làm sứt mẻ tình bạn.', loai: 'manh', trongSo: 1.6, tags: ['ban_mang_tai_loc'] },
  'Hóa Khoa':   { yNghia: 'Bạn bè giúp bạn giải quyết khó khăn, giấy tờ thuận lợi. Bạn có duyên với người có học thức.', loai: 'manh', trongSo: 1.5, tags: ['ban_giai_kho'] },
  'Lộc Tồn':    { yNghia: 'Bạn bè giúp bạn giữ của, mang lại sự ổn định tài chính. Quan hệ bạn bè bền vững.', loai: 'manh', trongSo: 1.4, tags: ['ban_on_dinh'] },
  'Kình Dương': { yNghia: 'Quan hệ bạn bè có tính cạnh tranh, dễ va chạm, tranh giành quyền lợi và có lúc bị bạn bè chơi xấu. Gợi ý: hợp tác thì thỏa thuận rõ từ đầu.', loai: 'yeu', trongSo: 1.4, tags: ['ban_tranh_gianh', 'can_hop_tac'] },
  'Đà La':      { yNghia: 'Quan hệ bạn bè dây dưa, khó dứt khoát. Có thể bị bạn bè làm phiền hoặc lợi dụng lòng tốt.', loai: 'yeu', trongSo: 1.3, tags: ['ban_day_dua', 'bi_lam_phien'] },
  'Hỏa Tinh':   { yNghia: 'Bạn bè nóng nảy, dễ xảy ra cãi vã, có tình bạn đổ vỡ chỉ vì một lần to tiếng.', loai: 'yeu', trongSo: 1.3, tags: ['ban_nong_nay', 'de_cai_va'] },
  'Linh Tinh':  { yNghia: 'Quan hệ bạn bè âm ỉ, có chuyện hiểu lầm, ghen ghét ngầm kéo dài.', loai: 'yeu', trongSo: 1.3, tags: ['ban_am_i', 'hieu_lam'] },
  'Địa Không':  { yNghia: 'Bạn bè đến rồi đi, khó giữ người ở lâu dài. Nhóm bạn thường thay đổi theo thời gian.', loai: 'yeu', trongSo: 1.2, tags: ['ban_den_roi_di'] },
  'Địa Kiếp':   { yNghia: 'Mặt tốt: bạn tốt bụng, dễ nhận lời giúp người. Mặt xấu: dễ bị bạn bè lợi dụng, mất tiền khi cho vay hoặc cùng làm ăn.', loai: 'yeu', trongSo: 1.3, tags: ['bi_loi_dung', 'mat_mat'] },
  'Hóa Kỵ':     { yNghia: 'Quan hệ xã hội dễ có hiểu lầm, đố kỵ, thị phi; có người bạn tin lại nói xấu sau lưng.', loai: 'yeu', trongSo: 1.6, tags: ['ban_do_ky', 'thi_phi'] },
  'Phục Binh':  { yNghia: 'Dễ bị người quen phản, lộ kế hoạch, có kẻ ngầm cản trở. Gợi ý: chưa chắc thì chưa kể.', loai: 'yeu', trongSo: 1.4, tags: ['ban_phan_trac', 'tieu_nhan_ngam'] },
  'Thiên Hình': { yNghia: 'Quan hệ với người cộng tác, cấp dưới hay căng thẳng, có thể dẫn đến tranh chấp, kiện cáo.', loai: 'yeu', trongSo: 1.2, tags: ['cang_thang', 'kien_tung'] }
};

/* ============================================================
 *  BẢNG DỮ LIỆU CUNG PHỤ MẪU — cha mẹ, bề trên, giấy tờ
 * ============================================================ */

var TUVI_FACT_PHUMau_CHINHTINH = {
  'Tử Vi':      { yNghia: 'Cha mẹ bạn thuộc mẫu người có uy, sống nguyên tắc, đặt ra chuẩn mực rõ ràng trong gia đình. Mặt tốt: thương con theo cách của người đứng đầu gia đình, lo được cho con. Mặt xấu: nghiêm khắc, áp đặt, ít lắng nghe, và con dễ sống dưới áp lực kỳ vọng.', trongSo: 1.5, tags: ['cha_me_co_uy', 'nguyen_tac', 'nghiem_khac'] },
  'Thiên Cơ':   { yNghia: 'Cha mẹ bạn thuộc mẫu người có đầu óc, thích suy nghĩ và tìm tòi. Họ có xu hướng dạy con bằng lý lẽ hơn là bằng lời mắng. Mặt xấu: quan hệ cha mẹ con cái thiên về lý lẽ, ít gần gũi cảm xúc, và cha mẹ hay lo nghĩ, thay đổi.', trongSo: 1.4, tags: ['cha_me_thong_minh', 'day_con_bang_ly', 'trao_doi'] },
  'Thái Dương': { yNghia: 'Cha mẹ bạn thuộc mẫu người hướng ngoại, nhiệt tình, thích giúp đỡ người khác. Họ thường là người chủ động trong gia đình và có xu hướng sống vì người khác; mặt trái là lo việc bên ngoài nhiều, có lúc ít thời gian cho con.', trongSo: 1.5, tags: ['cha_me_huong_ngoai', 'nhiet_tinh', 'chu_dong'] },
  'Vũ Khúc':    { yNghia: 'Cha mẹ bạn thuộc mẫu người cương nghị, thực tế, ít bộc lộ tình cảm bằng lời. Họ dạy con bằng hành động và nêu gương. Mặt xấu: quan hệ cha mẹ con cái thiên về trách nhiệm, khô khan, con ít được nghe lời yêu thương và dễ thấy cha mẹ xa cách.', trongSo: 1.4, tags: ['cha_me_cung_ran', 'thuc_te', 'it_boc_lo'] },
  'Thiên Đồng': { yNghia: 'Cha mẹ bạn thuộc mẫu người hiền hòa, dễ gần, thích cuộc sống nhẹ nhàng. Không khí gia đình thường thân thiện, ít áp lực; mặt trái là cha mẹ ít định hướng, con phải tự xoay khi gặp việc lớn.', trongSo: 1.3, tags: ['cha_me_hien_hoa', 'de_gan', 'khong_khi_than_thien'] },
  'Liêm Trinh': { yNghia: 'Cha mẹ bạn thuộc mẫu người nghiêm khắc, sống có nguyên tắc và kỷ luật cao. Họ có xu hướng đặt ra kỳ vọng rõ ràng cho con cái. Mặt xấu: cha mẹ con cái dễ có khoảng cách, xung khắc vì sự nghiêm khắc, và con có thể mang cảm giác chưa bao giờ đủ tốt.', trongSo: 1.4, tags: ['cha_me_nghiem_khac', 'ky_luat_cao', 'co_ky_vong'] },
  'Thiên Phủ':  { yNghia: 'Cha mẹ bạn thuộc mẫu người điềm đạm, biết lo toan, giữ gìn. Họ sống thực tế, chắc chắn, không thích phô trương. Mặt trái là bảo thủ, ngại con thay đổi hay chọn hướng đi khác.', trongSo: 1.5, tags: ['cha_me_biet_lo', 'diem_dam', 'coi_trong_on_dinh'] },
  'Thái Âm':    { yNghia: 'Cha mẹ bạn thuộc mẫu người dịu dàng, tinh tế, giàu cảm xúc. Mẹ thường đóng vai trò quan trọng trong việc giáo dục và chăm sóc con cái. Mặt trái là cha mẹ dễ lo lắng, đa cảm, có khi bao bọc quá mức.', trongSo: 1.5, tags: ['cha_me_diu_dang', 'tinh_te', 'trong_tinh_cam'] },
  'Tham Lang':  { yNghia: 'Cha mẹ bạn thuộc mẫu người phóng khoáng, thích tự do, ít quản con cái. Mặt tốt: con có không gian tự phát triển. Mặt xấu: thiếu hướng dẫn sát sao, con dễ lạc hướng lúc còn trẻ.', trongSo: 1.3, tags: ['cha_me_phong_khoang', 'cho_tu_do', 'it_quan'] },
  'Cự Môn':     { yNghia: 'Cha mẹ bạn thuộc mẫu người sắc sảo, hay lý luận, có xu hướng nói thẳng. Mặt xấu: lời nói của họ dễ gây tổn thương, trong nhà hay có cãi vã. Mặt tốt: họ thẳng thắn, không giấu con điều gì.', trongSo: 1.3, tags: ['cha_me_sac_sao', 'hay_ly_luan', 'noi_thang'] },
  'Thiên Tướng':{ yNghia: 'Cha mẹ bạn thuộc mẫu người chính trực, đàng hoàng, chu đáo. Họ quan tâm đến con cái và có xu hướng bảo bọc. Không khí gia đình thường trang nghiêm, có nền nếp; mặt trái là nặng hình thức, con ít dám bày tỏ.', trongSo: 1.5, tags: ['cha_me_chinh_truc', 'chu_dao', 'co_nen_nep'] },
  'Thiên Lương':{ yNghia: 'Cha mẹ bạn thuộc mẫu người nhân hậu, thích che chở, sống đạo đức. Họ có xu hướng dạy con bằng nêu gương hơn là lời nói. Mối quan hệ cha mẹ con cái thường ấm áp, có sự bao dung; mặt trái là cha mẹ hay dạy bảo, can thiệp vào lựa chọn của con.', trongSo: 1.6, tags: ['cha_me_nhan_hau', 'che_cho', 'song_dao_duc'] },
  'Thất Sát':   { yNghia: 'Cha mẹ bạn thuộc mẫu người mạnh mẽ, có cá tính, ít bộc lộ cảm xúc. Mặt xấu: cha mẹ con cái dễ xung khắc, xa cách, có thể ít được gần cha mẹ. Mặt tốt: bạn tự lập sớm và trưởng thành nhanh hơn bạn bè cùng trang lứa.', trongSo: 1.4, tags: ['cha_me_manh_me', 'ca_tinh', 'it_boc_lo'] },
  'Phá Quân':   { yNghia: 'Cha mẹ bạn thuộc mẫu người phóng khoáng, có xu hướng phá cách và ít theo khuôn khổ. Mặt xấu: cha mẹ có những giai đoạn biến động lớn, gia đình xáo trộn, con dễ thiếu sự ổn định lúc nhỏ.', trongSo: 1.4, tags: ['cha_me_phong_khoang', 'pha_cach', 'co_bien_dong'] }
};

var TUVI_FACT_PHUMau_PHUTINH = {
  'Văn Xương':  { yNghia: 'Cha mẹ có học thức, giấy tờ thuận lợi. Bạn được hưởng nền tảng giáo dục tốt và có duyên học hành.', loai: 'manh', trongSo: 1.2, tags: ['cha_me_hoc_thuc', 'giay_to_thuan'] },
  'Văn Khúc':   { yNghia: 'Cha mẹ khéo ăn nói, có gu thẩm mỹ. Bạn được nuôi dưỡng trong môi trường văn hóa.', loai: 'manh', trongSo: 1.2, tags: ['cha_me_kheo_an_noi'] },
  'Thiên Khôi': { yNghia: 'Cha mẹ hoặc bề trên nâng đỡ bạn. Bạn được hưởng quý nhân từ phía gia đình.', loai: 'manh', trongSo: 1.3, tags: ['quy_nhan_gia_dinh'] },
  'Hóa Lộc':    { yNghia: 'Bạn được thừa hưởng tài sản từ cha mẹ, cuộc sống đủ đầy; mặt trái là dễ ỷ vào gia đình, chậm tự lập.', loai: 'manh', trongSo: 1.6, tags: ['thua_huong_tai_san'] },
  'Hóa Quyền':  { yNghia: 'Cha mẹ mạnh mẽ, có uy. Bạn được hưởng phúc ấm nhưng cũng chịu áp lực kỳ vọng từ cha mẹ.', loai: 'manh', trongSo: 1.5, tags: ['cha_me_manh_me', 'ap_luc_ky_vong'] },
  'Hóa Khoa':   { yNghia: 'Gia đình có giáo dục, cha mẹ văn nhã. Bạn có học lực cao và được hưởng danh tiếng từ gia đình.', loai: 'manh', trongSo: 1.5, tags: ['gia_giao', 'hoc_luc_cao'] },
  'Thiên Việt': { yNghia: 'Bề trên, người ngoài giúp đỡ bạn. Bạn có duyên với quý nhân ngoài gia đình.', loai: 'manh', trongSo: 1.2, tags: ['quy_nhan_ngoai'] },
  'Tang Môn':   { yNghia: 'Bạn nặng lòng với gia đình; mặt xấu là sức khỏe cha mẹ dễ có vấn đề và trong nhà hay có chuyện buồn khiến bạn lo lắng.', loai: 'yeu', trongSo: 1.2, tags: ['suc_khoe_cha_me', 'tin_buon'] },
  'Bạch Hổ':    { yNghia: 'Cha mẹ vất vả, sức khỏe dễ hao, và giấy tờ liên quan đến gia đình hay rắc rối.', loai: 'yeu', trongSo: 1.2, tags: ['cha_me_vat_va', 'giay_to_rac_roi'] },
  'Thiên Khốc': { yNghia: 'Bạn nhạy cảm với không khí gia đình, hay buồn phiền vì chuyện nhà và dễ mang nỗi buồn từ cha mẹ.', loai: 'yeu', trongSo: 1.1, tags: ['buon_phien_gia_dinh'] },
  'Kình Dương': { yNghia: 'Bất đồng với cha mẹ, dễ xảy ra xung đột gay gắt, có giai đoạn ít nói chuyện với nhau.', loai: 'yeu', trongSo: 1.3, tags: ['bat_dong_cha_me', 'xung_dot'] },
  'Đà La':      { yNghia: 'Mối quan hệ cha mẹ con cái dây dưa, khó giải quyết. Có thể có hiểu lầm kéo dài.', loai: 'yeu', trongSo: 1.2, tags: ['hieu_lam_keo_dai'] },
  'Hóa Kỵ':     { yNghia: 'Dễ xung khắc với cha mẹ, bề trên, và giấy tờ liên quan đến gia đình hay vướng mắc kéo dài.', loai: 'yeu', trongSo: 1.6, tags: ['xung_khac_be_tren', 'giay_to_vuong'] },
  'Địa Không':  { yNghia: 'Mặt xấu: bạn ít được nhờ cha mẹ, có thể sớm thiếu vắng sự chăm lo của gia đình. Mặt tốt: bạn tự lập sớm, quen tự lo liệu cho mình.', loai: 'yeu', trongSo: 1.4, tags: ['cha_me_mat_som', 'tu_lap'] },
  'Địa Kiếp':   { yNghia: 'Mặt xấu: gia đình dễ có biến cố, hao tán tiền bạc, có giai đoạn túng thiếu. Mặt tốt: bạn có xu hướng tự lực tốt.', loai: 'yeu', trongSo: 1.4, tags: ['bien_co_gia_dinh', 'tu_luc'] }
};

/* ============================================================
 *  BẢNG DỮ LIỆU CUNG HUYNH ĐỆ — anh chị em ruột
 * ============================================================ */

var TUVI_FACT_HUYNHDE_CHINHTINH = {
  'Tử Vi':      { yNghia: 'Anh chị em của bạn thuộc mẫu người có uy, sống nguyên tắc. Bạn có xu hướng nhận được sự dìu dắt từ anh/chị lớn trong gia đình; mặt trái là anh chị em dễ áp đặt, tranh phần quyết định.', trongSo: 1.5, tags: ['anh_em_co_uy', 'nguyen_tac', 'duoc_diu_dat'] },
  'Thiên Cơ':   { yNghia: 'Anh chị em của bạn thuộc mẫu người có đầu óc, thích suy nghĩ độc lập. Mối quan hệ anh em có xu hướng trao đổi bằng lý lẽ hơn là chia sẻ cảm xúc. Quan điểm khác biệt hay dẫn đến bất đồng, và mỗi người dễ đi một hướng.', trongSo: 1.3, tags: ['anh_em_thong_minh', 'doc_lap', 'trao_doi_ly_le'] },
  'Thái Dương': { yNghia: 'Anh chị em của bạn thuộc mẫu người hướng ngoại, hào phóng, nhiệt tình. Mối quan hệ anh em thường có xu hướng gắn bó và hỗ trợ lẫn nhau; mặt trái là hay có người phải gánh phần nhiều hơn.', trongSo: 1.5, tags: ['anh_em_huong_ngoai', 'hao_phong', 'gan_bo'] },
  'Vũ Khúc':    { yNghia: 'Anh chị em của bạn thuộc mẫu người cương nghị, thực tế. Mối quan hệ anh em có xu hướng thiên về trách nhiệm hơn là tình cảm biểu đạt. Mặt xấu: dễ phát sinh bất hòa, tính toán thiệt hơn quanh chuyện tiền bạc, tài sản.', trongSo: 1.4, tags: ['anh_em_cung_ran', 'thuc_te', 'can_minh_bach_tien'] },
  'Thiên Đồng': { yNghia: 'Anh chị em của bạn thuộc mẫu người hiền hòa, vui vẻ, dễ gần. Mối quan hệ anh em thường thân thiện, ít sóng gió; mặt trái là khi có việc lớn thì ít ai đứng ra gánh.', trongSo: 1.3, tags: ['anh_em_hien_hoa', 'vui_ve', 'it_song_gio'] },
  'Liêm Trinh': { yNghia: 'Anh chị em của bạn thuộc mẫu người có nguyên tắc, đôi khi cứng nhắc. Mặt xấu: anh em dễ có khoảng cách, va chạm vì ai cũng cứng. Mặt tốt: anh em giữ chữ tín với nhau.', trongSo: 1.4, tags: ['anh_em_nguyen_tac', 'co_khoang_cach', 'can_nhuong_nhin'] },
  'Thiên Phủ':  { yNghia: 'Anh chị em của bạn thuộc mẫu người biết lo toan, giữ gìn, sống thực tế. Mối quan hệ anh em có xu hướng bền vững và ít sóng gió; mặt trái là ít khi chia sẻ chuyện riêng sâu.', trongSo: 1.5, tags: ['anh_em_biet_lo', 'thuc_te', 'ben_vung'] },
  'Thái Âm':    { yNghia: 'Anh chị em của bạn thuộc mẫu người dịu dàng, tinh tế, giàu cảm xúc. Bạn có xu hướng gần gũi và nhận được sự quan tâm từ chị em gái nhiều hơn; mặt trái là anh em dễ tủi hờn, giận nhau ngầm.', trongSo: 1.4, tags: ['anh_em_diu_dang', 'tinh_te', 'chi_em_gai_gan_gui'] },
  'Tham Lang':  { yNghia: 'Anh chị em của bạn thuộc mẫu người giao du rộng, thích trải nghiệm. Mối quan hệ anh em có xu hướng thoải mái nhưng ít khi dựa vào nhau được về vật chất, và có người dễ sa vào ăn chơi.', trongSo: 1.3, tags: ['anh_em_giao_du_rong', 'thoai_mai', 'it_nuong_tua'] },
  'Cự Môn':     { yNghia: 'Anh chị em của bạn thuộc mẫu người sắc sảo, hay lý luận. Mối quan hệ anh em có thể có những cuộc tranh luận, đôi khi lời nói qua lại gây tổn thương lẫn nhau.', trongSo: 1.3, tags: ['anh_em_sac_sao', 'hay_tranh_luan', 'can_giu_loi'] },
  'Thiên Tướng':{ yNghia: 'Anh chị em của bạn thuộc mẫu người nghĩa khí, đàng hoàng, biết quan tâm. Mối quan hệ anh em có xu hướng gắn bó và hỗ trợ nhau khi cần; mặt trái là trọng thể diện, chuyện nhà dễ bị giấu đi.', trongSo: 1.5, tags: ['anh_em_nghia_khi', 'dang_hoang', 'ho_tro_nhau'] },
  'Thiên Lương':{ yNghia: 'Anh chị em của bạn thuộc mẫu người nhân hậu, chững chạc, có xu hướng che chở. Bạn có thể nhận được sự bảo ban từ người lớn tuổi hơn trong gia đình; mặt trái là hay bị dạy bảo, can thiệp.', trongSo: 1.5, tags: ['anh_em_nhan_hau', 'chung_chac', 'duoc_bao_ban'] },
  'Thất Sát':   { yNghia: 'Anh chị em của bạn thuộc mẫu người có cá tính mạnh, độc lập, ít gắn kết. Mặt xấu: anh em dễ xa cách, mỗi người một ngả, ít khi gặp gỡ và khó nhờ nhau. Mặt tốt: ai cũng tự đứng được.', trongSo: 1.4, tags: ['anh_em_ca_tinh', 'doc_lap', 'xa_cach'] },
  'Phá Quân':   { yNghia: 'Anh chị em của bạn thuộc mẫu người khác biệt về tính cách và quan điểm. Mối quan hệ anh em có thể có khoảng cách, ít khi tìm được tiếng nói chung trong các vấn đề gia đình; mặt tốt là mỗi người có hướng đi riêng, không ràng buộc nhau.', trongSo: 1.4, tags: ['anh_em_khac_biet', 'co_khoang_cach', 'it_tieng_noi_chung'] }
};

var TUVI_FACT_HUYNHDE_PHUTINH = {
  'Tả Phù':     { yNghia: 'Anh em giúp đỡ lẫn nhau, có sự hỗ trợ qua lại; mặt trái là dễ dựa dẫm nhau, khó tách bạch chuyện tiền.', loai: 'manh', trongSo: 1.3, tags: ['anh_em_giup_do'] },
  'Hữu Bật':    { yNghia: 'Anh em đông, đỡ đần nhau. Bạn có thể nhờ cậy anh em khi gặp khó khăn.', loai: 'manh', trongSo: 1.3, tags: ['anh_em_dong', 'do_dan'] },
  'Thiên Khôi': { yNghia: 'Anh em là quý nhân của bạn, sẵn sàng nâng đỡ. Bạn được nhờ anh em về nhiều mặt.', loai: 'manh', trongSo: 1.4, tags: ['anh_em_quy_nhan'] },
  'Thiên Việt': { yNghia: 'Anh em mang lại cơ hội cho bạn. Mối quan hệ anh em mở ra con đường mới.', loai: 'manh', trongSo: 1.4, tags: ['anh_em_mang_co_hoi'] },
  'Văn Xương':  { yNghia: 'Anh em có học thức, giúp đỡ nhau trong học hành và công việc.', loai: 'manh', trongSo: 1.1, tags: ['anh_em_hoc_thuc'] },
  'Văn Khúc':   { yNghia: 'Anh em khéo ăn nói, có duyên. Mối quan hệ anh em có sự thấu hiểu nhất định.', loai: 'manh', trongSo: 1.1, tags: ['anh_em_kheo_an_noi'] },
  'Hóa Lộc':    { yNghia: 'Anh em khá giả, giúp đỡ bạn về tài chính. Bạn có thể được thừa hưởng hoặc hỗ trợ từ anh em.', loai: 'manh', trongSo: 1.5, tags: ['anh_em_tai_loc'] },
  'Hóa Khoa':   { yNghia: 'Anh em có học vấn, danh tiếng. Bạn được nhờ anh em trong các vấn đề giấy tờ, học hành.', loai: 'manh', trongSo: 1.4, tags: ['anh_em_danh_tieng'] },
  'Kình Dương': { yNghia: 'Anh em bất hòa, dễ xảy ra tranh chấp, nhất là chuyện tiền bạc, tài sản chung.', loai: 'yeu', trongSo: 1.4, tags: ['anh_em_bat_hoa', 'tranh_chap'] },
  'Đà La':      { yNghia: 'Mối quan hệ anh em dây dưa, khó giải quyết. Hiểu lầm có thể kéo dài dai dẳng.', loai: 'yeu', trongSo: 1.3, tags: ['day_dua', 'hieu_lam'] },
  'Hóa Kỵ':     { yNghia: 'Hiểu lầm với anh em, dễ xảy ra xung đột, mâu thuẫn tích tụ lâu năm khó gỡ.', loai: 'yeu', trongSo: 1.6, tags: ['hieu_lam', 'xung_dot'] },
  'Cô Thần':    { yNghia: 'Anh em sống khép kín, ít qua lại. Mối quan hệ anh em thiếu sự gắn kết tự nhiên.', loai: 'yeu', trongSo: 1.2, tags: ['anh_em_khep_kin', 'it_qua_lai'] },
  'Quả Tú':     { yNghia: 'Anh em đơn chiếc, ít gắn kết. Bạn có thể cảm thấy cô đơn ngay trong gia đình.', loai: 'yeu', trongSo: 1.2, tags: ['anh_em_don_chiec', 'co_don'] },
  'Địa Không':  { yNghia: 'Anh em ly tán, ít giúp đỡ nhau. Mỗi người có cuộc sống riêng, ít khi gặp gỡ.', loai: 'yeu', trongSo: 1.2, tags: ['ly_tan', 'it_gap_go'] },
  'Địa Kiếp':   { yNghia: 'Anh em dễ gặp biến cố, hao tài, và bạn có thể phải gánh đỡ cho họ.', loai: 'yeu', trongSo: 1.3, tags: ['bien_co', 'quan_tam'] },
  'Thiên Hình': { yNghia: 'Anh em khắt khe với nhau, có thể dẫn đến tranh chấp, kiện tụng.', loai: 'yeu', trongSo: 1.2, tags: ['nghiem_khac', 'kien_tung'] }
};

/* ============================================================
 *  KHO VĂN 3 CUNG — NÔ BỘC · PHỤ MẪU · HUYNH ĐỆ
 * ============================================================ */

var TUVI_VAN_NOBOC = {
  'A': {
    tomTat: 'Cung Nô Bộc của bạn thuộc nhóm "tôn trọng" — bạn bè, đồng nghiệp thường là người chững chạc, có nguyên tắc, và quan hệ dựa trên sự tôn trọng lẫn nhau.',
    quanHe: 'Bạn thuộc mẫu người giữ khoảng cách nhất định trong quan hệ xã hội — bạn không thân thiết sâu sắc với nhiều người, nhưng những mối quan hệ bạn có thường bền vững và có chất lượng. Người xung quanh nể trọng bạn vì sự chững chạc và đáng tin.',
    nguoiDuoi: 'Nếu bạn làm quản lý, bạn thuộc mẫu người lãnh đạo có uy tự nhiên — cấp dưới nể phục và làm việc nghiêm túc. Bạn không cần phải quát tháo mà vẫn giữ được kỷ luật.',
    coHoi: 'Cơ hội của bạn thường đến từ các mối quan hệ xã hội có chất lượng — những người bạn quen biết có thể giới thiệu cơ hội quan trọng.',
    luuY: 'Mặt xấu: bạn ít bạn tri kỷ, dễ bị xem là khó gần; bạn bè có địa vị cao dễ khiến bạn thấy áp lực, tự so sánh và mặc cảm.',
    loiKhuyen: [
      'Duy trì mạng lưới quan hệ chất lượng hơn số lượng.',
      'Chủ động giúp đỡ người khác trước khi cần nhờ họ.',
      'Trong công việc, hãy công bằng và minh bạch với cấp dưới.'
    ]
  },
  'B': {
    tomTat: 'Cung Nô Bộc của bạn thuộc nhóm "trí tuệ" — bạn bè thường là người có đầu óc, hay thay đổi, và quan hệ xã hội có tính linh hoạt cao.',
    quanHe: 'Bạn thích kết giao với người thông minh, có chiều sâu. Tuy nhiên, nhóm bạn của bạn có xu hướng thay đổi theo từng giai đoạn — người đến rồi đi tùy theo mối quan tâm và hoàn cảnh, nên lúc khó ít người ở lại bên bạn.',
    nguoiDuoi: 'Cấp dưới của bạn thuộc mẫu người thông minh nhưng có thể hay thay đổi ý kiến. Bạn nên khéo léo trong việc quản lý và giữ chân người tài.',
    coHoi: 'Cơ hội của bạn thường đến từ việc học hỏi qua bạn bè — những cuộc trò chuyện với người thông minh mở ra nhiều ý tưởng mới.',
    luuY: 'Mặt xấu: sự sắc sảo quá mức dễ gây hiểu lầm, mất lòng bạn bè, và bạn hay bị cuốn vào những cuộc tranh luận vô bổ.',
    loiKhuyen: [
      'Chọn bạn mà chơi.',
      'Giữ liên lạc với những người bạn thật sự tốt dù ít gặp.',
      'Trong công việc, hãy rõ ràng trong giao tiếp với đồng nghiệp để tránh hiểu lầm.'
    ]
  },
  'C': {
    tomTat: 'Cung Nô Bộc của bạn thuộc nhóm "thực tế" — quan hệ bạn bè thiên về hợp tác, cùng chí hướng, và có tính xây dựng cao.',
    quanHe: 'Bạn thuộc mẫu người không thích những mối quan hệ hời hợt — bạn muốn có những người bạn có thể cùng nhau làm việc, cùng nhau phát triển. Quan hệ của bạn bền vững vì dựa trên sự tin cậy lẫn nhau.',
    nguoiDuoi: 'Cấp dưới của bạn thuộc mẫu người làm việc hiệu quả, đáng tin cậy. Bạn có khả năng quản lý tốt và được nhân viên tôn trọng vì sự công bằng.',
    coHoi: 'Cơ hội của bạn thường đến từ hợp tác — những người bạn cùng chí hướng có thể trở thành đối tác đáng tin cậy.',
    luuY: 'Mặt xấu: quan hệ bạn bè dễ trở thành thuần túy lợi ích, hết việc là hết bạn, và chuyện tiền bạc dễ làm mất tình cảm.',
    loiKhuyen: [
      'Xây dựng quan hệ dựa trên sự tin cậy, không chỉ lợi ích.',
      'Khi hợp tác làm ăn với bạn bè, hãy rõ ràng ngay từ đầu để tránh mất tình cảm.',
      'Dành thời gian cho những người bạn cũ.'
    ]
  },
  'D': {
    tomTat: 'Cung Nô Bộc của bạn thuộc nhóm "biến động" — bạn bè có cá tính mạnh, và quan hệ xã hội có thể có những va chạm nhất định.',
    quanHe: 'Bạn thuộc mẫu người gặp nhiều người có cá tính mạnh trong đời. Các cuộc tranh luận, thậm chí xung đột, có thể xảy ra thường xuyên hơn so với người khác. Có những tình bạn đổ vỡ, thậm chí thành thù; những tình bạn vượt qua được thì rất bền chặt.',
    nguoiDuoi: 'Cấp dưới của bạn dễ cứng đầu, khó bảo, có người chống đối hoặc bỏ đi giữa chừng.',
    coHoi: 'Cơ hội của bạn thường đến từ việc dấn thân — tham gia các hoạt động có tính cạnh tranh. Bạn bè có thể là người đồng hành trong những dự án mạo hiểm.',
    luuY: 'Mặt xấu: sự nóng nảy của cả hai phía dễ phá hỏng những mối quan hệ tốt, và hợp tác làm ăn với bạn bè dễ đổ vỡ, mất tiền.',
    loiKhuyen: [
      'Học cách lắng nghe trước khi phản hồi.',
      'Chọn bạn đồng hành cẩn thận.',
      'Giữ khoảng cách với những người bạn thường xuyên gây căng thẳng.'
    ]
  },
  'E': {
    tomTat: 'Cung Nô Bộc của bạn thuộc nhóm "giao du" — bạn bè đa dạng, có sức hút tự nhiên, và mạng lưới quan hệ xã hội rộng.',
    quanHe: 'Bạn thuộc mẫu người hòa đồng, dễ kết bạn, và có sức hút tự nhiên với người xung quanh. Bạn có nhiều mối quan hệ xã hội và thường tham gia các hoạt động cộng đồng. Tuy nhiên, không phải ai cũng là bạn thật sự — nhiều người chỉ là quen biết xã giao.',
    nguoiDuoi: 'Cấp dưới của bạn đa dạng về tính cách. Bạn có thể quản lý được nếu biết cách giao việc phù hợp với từng người.',
    coHoi: 'Cơ hội của bạn thường đến từ các hoạt động cộng đồng, sự kiện xã hội. Những người bạn quen biết có thể giới thiệu cơ hội bất ngờ.',
    luuY: 'Mặt xấu: bạn dễ tin người mới quen, có lúc mất tiền hoặc tổn thương vì đặt tình cảm sai chỗ, và bị bạn bè nhờ vả quá mức.',
    loiKhuyen: [
      'Tham gia các hoạt động cộng đồng để mở rộng quan hệ.',
      'Học cách nói "không" với những lời nhờ vả không chính đáng.',
      'Dành thời gian cho những người bạn thật sự.'
    ]
  },
  'F': {
    tomTat: 'Phần bạn bè trên lá số để trống — quan hệ xã hội linh hoạt, phụ thuộc nhiều vào môi trường và sự chủ động của bạn.',
    quanHe: 'Bạn không có một "khuôn mẫu" cố định nào trong quan hệ bạn bè — bạn có thể thích nghi với nhiều nhóm bạn khác nhau, nhưng cũng dễ bị ảnh hưởng bởi người xung quanh. Nếu gặp bạn tốt, bạn sẽ được nâng đỡ; nếu gặp bạn xấu, bạn dễ bị lợi dụng.',
    nguoiDuoi: 'Cấp dưới của bạn thay đổi tùy theo hoàn cảnh. Bạn nên linh hoạt trong quản lý và không nên kỳ vọng quá nhiều vào một người.',
    coHoi: 'Cơ hội của bạn thường đến bất ngờ từ những mối quan hệ mới. Điều quan trọng là bạn phải chủ động tạo dựng quan hệ thay vì chờ đợi người khác đến với mình.',
    luuY: 'Mặt xấu: bạn dễ bị người xung quanh kéo theo, gặp bạn xấu thì bị lợi dụng hoặc nhiễm thói quen tiêu cực của họ.',
    loiKhuyen: [
      'Chủ động tìm kiếm bạn bè có cùng giá trị sống.',
      'Xây dựng một vài mối quan hệ sâu sắc thay vì nhiều mối quan hệ hời hợt.',
      'Khi gặp khó khăn, hãy mạnh dạn nhờ bạn bè giúp đỡ.'
    ]
  }
};

var TUVI_VAN_PHUMAU = {
  'A': {
    tomTat: 'Cha mẹ của bạn thuộc mẫu người sống đàng hoàng, có nguyên tắc và trách nhiệm. Quan hệ cha mẹ – con cái thường dựa trên sự tôn trọng và tôn ti trật tự rõ ràng.',
    chaMe: 'Cha mẹ bạn thuộc mẫu người sống có kỷ luật, đặt ra những chuẩn mực rõ ràng trong gia đình. Họ nghiêm khắc nhưng yêu thương con theo cách riêng của mình — ít nói lời ngọt ngào, nhưng luôn lo toan cho con từng li từng tí. Cách yêu thương của họ thiên về trách nhiệm và nêu gương.',
    quanHe: 'Mặt tốt: quan hệ với cha mẹ nhìn chung ổn định, cha mẹ là chỗ dựa tinh thần quan trọng. Mặt xấu: bất đồng quan điểm khá thường xuyên, và bạn dễ thấy mình bị kiểm soát hoặc phải sống theo kỳ vọng của cha mẹ.',
    giayTo: 'Các vấn đề giấy tờ, thủ tục hành chính trong gia đình nhìn chung thuận lợi. Nếu có thừa kế, khả năng cao là được giải quyết êm thấm.',
    luuY: 'Mặt xấu: bạn dễ bị công việc cuốn đi, ít thời gian cho cha mẹ khi họ về già, và sau này có thể day dứt vì điều đó.',
    loiKhuyen: [
      'Trân trọng cách yêu thương của cha mẹ.',
      'Chủ động hỏi thăm sức khỏe cha mẹ thường xuyên.',
      'Khi có con, hãy truyền lại những giá trị tốt đẹp mà cha mẹ đã dạy cho bạn.'
    ]
  },
  'B': {
    tomTat: 'Cha mẹ của bạn thuộc mẫu người lao động chân chính, sống đàng hoàng. Quan hệ cha mẹ – con cái ở mức ổn định, ít sóng gió lớn; mặt trái là gia đình ít điều kiện, bạn phải tự lo sớm.',
    chaMe: 'Cha mẹ bạn thuộc mẫu người chăm chỉ, sống đàng hoàng, được hàng xóm quý mến. Họ không cầu kỳ trong cách dạy con, mà dạy bằng chính tấm gương lao động và cách sống của mình. Tình cảm dành cho con chân thành nhưng giản dị.',
    quanHe: 'Mối quan hệ cha mẹ – con cái ổn định — có những lúc bất đồng quan điểm nhưng đều có thể hóa giải. Không khí gia đình thường bình thường, không quá khắt khe cũng không quá nuông chiều.',
    giayTo: 'Các thủ tục hành chính gia đình nhìn chung suôn sẻ, đôi khi có chút lằng nhằng cần kiên nhẫn giải quyết.',
    luuY: 'Mặt xấu: gia đình ít nguồn lực để đỡ bạn khi khó, và bạn dễ phải gánh thêm phần lo cho cha mẹ khi còn trẻ.',
    loiKhuyen: [
      'Chủ động san sẻ gánh nặng tài chính với cha mẹ khi có thể.',
      'Gọi hỏi thăm cha mẹ đều đặn dù bận.',
      'Học hỏi từ cha mẹ sự chăm chỉ và đức tính tiết kiệm.'
    ]
  },
  'C': {
    tomTat: 'Cha mẹ của bạn thuộc mẫu người vất vả, sống giản dị và chịu thương chịu khó. Quan hệ cha mẹ – con cái có thể ít gần gũi nhưng chân thành.',
    chaMe: 'Cha mẹ bạn thuộc mẫu người lao động cực nhọc, sống vì con cái nhiều hơn vì bản thân. Họ có thể ít có thời gian dành cho con vì phải mưu sinh, nhưng tình thương luôn trọn vẹn. Cách dạy con của họ thiên về "làm gương" hơn là dạy bằng lời.',
    quanHe: 'Mối quan hệ cha mẹ – con cái có thể không mấy gần gũi về mặt biểu đạt tình cảm — có thể có những lúc căng thẳng hoặc hiểu lầm. Mặt tốt là tình thân vẫn còn, dù ít khi nói ra.',
    giayTo: 'Các vấn đề giấy tờ của gia đình có thể gặp chút trắc trở — cần kiểm tra kỹ và kiên nhẫn xử lý.',
    luuY: 'Mặt xấu: tuổi thơ thiếu vắng sự gần gũi của cha mẹ dễ để lại dấu ấn — cảm giác tự lo một mình, khó mở lòng với người thân. Gợi ý: tìm người có thể lắng nghe bạn.',
    loiKhuyen: [
      'Học cách tha thứ cho cha mẹ.',
      'Tự lập sớm để giảm gánh nặng cho cha mẹ.',
      'Xây dựng nền tảng tài chính riêng vững chắc.'
    ]
  },
  'D': {
    tomTat: 'Cha mẹ của bạn thuộc mẫu người có tính cách khác biệt, dễ xảy ra xung đột trong gia đình. Quan hệ cha mẹ – con cái có thể để lại những dấu ấn sâu sắc trong lòng bạn.',
    chaMe: 'Cha mẹ bạn có tính cách khác biệt và thường xuyên bất đồng quan điểm. Cách thể hiện cảm xúc của họ thiên về bộc phát — có thể là lời qua tiếng lại, hoặc giữ im lặng. Bạn lớn lên trong một môi trường có thể thiếu an toàn cảm xúc.',
    quanHe: 'Mối quan hệ cha mẹ – con cái có thể để lại những tổn thương nhất định. Bạn có thể mang theo những ký ức không vui từ tuổi thơ, đôi khi ảnh hưởng đến cách bạn nhìn nhận hôn nhân và gia đình. Việc chữa lành là một hành trình dài, cần kiên nhẫn và có thể cần đến sự hỗ trợ chuyên môn.',
    giayTo: 'Các vấn đề giấy tờ, thừa kế, tài sản có thể cần sự rõ ràng ngay từ đầu. Tốt nhất là có người thứ ba đứng ra làm chứng trong các thỏa thuận.',
    luuY: 'Bạn nên đặc biệt chú ý sức khỏe tinh thần — tổn thương tuổi thơ có thể ảnh hưởng đến hạnh phúc hôn nhân và cách bạn nuôi dạy con. Tìm hiểu về tâm lý học và chữa lành nội tâm là việc quan trọng của cuộc đời bạn. Nếu cần, hãy tìm chuyên gia tâm lý — điều đó không có gì đáng xấu hổ.',
    loiKhuyen: [
      'Tha thứ để cắt gánh nặng quá khứ, không phải để xóa lỗi của cha mẹ.',
      'Khi lập gia đình, chủ động học cách yêu thương lành mạnh để không lặp lại vòng lặp tổn thương.',
      'Nếu có con, hãy cố gắng trở thành người cha/mẹ khác biệt.'
    ]
  },
  'F': {
    tomTat: 'Phần cha mẹ trên lá số để trống — mối quan hệ cha mẹ con cái linh hoạt, phụ thuộc nhiều vào hoàn cảnh và cung đối chiếu.',
    chaMe: 'Bạn không có một "khuôn mẫu" cố định nào về cha mẹ — tính cách và mối quan hệ với cha mẹ có thể thay đổi tùy từng giai đoạn cuộc đời. Có thể cha mẹ bạn không có nét gì thật nổi bật, nhưng luôn cố gắng theo cách của riêng họ.',
    quanHe: 'Mối quan hệ cha mẹ – con cái mang tính "phản chiếu" — phụ thuộc nhiều vào cách bạn đối xử với họ. Mặt xấu: tình cảm dễ nhạt dần nếu không ai chủ động, và có giai đoạn bạn thấy cha mẹ như người xa.',
    giayTo: 'Các vấn đề giấy tờ phụ thuộc vào cung đối chiếu. Cần kiểm tra kỹ trước khi ký kết bất cứ điều gì.',
    luuY: 'Mặt xấu: tự lập của bạn dễ thành xa cách, và bạn hay so sánh gia đình mình với người khác rồi tủi thân. Mặt tốt: bạn không bị gia đình ràng buộc.',
    loiKhuyen: [
      'Dành thời gian bên cha mẹ khi họ còn khỏe.',
      'Chủ động tạo dựng mối quan hệ với cha mẹ từ những việc nhỏ nhất.',
      'Nếu không có cha mẹ hoặc cha mẹ không còn, hãy tìm một người bề trên để học hỏi và nương tựa tinh thần.'
    ]
  }
};

var TUVI_VAN_HUYNHDE = {
  'A': {
    tomTat: 'Anh chị em của bạn thuộc mẫu người sống có trách nhiệm, biết nghĩ cho nhau. Mối quan hệ anh em thường dựa trên sự tôn trọng và tôn ti trật tự.',
    anhChiEm: 'Anh chị em của bạn thuộc mẫu người chững chạc, biết lo toan và có tinh thần trách nhiệm với gia đình. Họ thường giữ vai trò "anh/chị lớn" — sẵn sàng bảo ban, dìu dắt các em. Tình cảm anh em thiên về sự tôn trọng hơn là gần gũi kiểu bạn bè.',
    quanHe: 'Mặt tốt: tình cảm anh em nhìn chung tốt, biết nhường nhịn và giúp đỡ lẫn nhau. Mặt xấu: tôn ti nặng, người nhỏ ít có tiếng nói, và người lớn dễ phải gánh quá nhiều.',
    hoTro: 'Anh em có xu hướng giúp đỡ nhau trong những lúc cần thiết — từ tinh thần đến vật chất. Đây là chỗ dựa quan trọng của bạn.',
    luuY: 'Mặt xấu: bạn dễ bị so sánh hoặc tự so sánh với anh em, sinh mặc cảm hoặc ganh đua ngầm.',
    loiKhuyen: [
      'Duy trì liên lạc thường xuyên với anh em.',
      'Trong các vấn đề tài sản chung, hãy minh bạch và công bằng.',
      'Khi anh em gặp khó khăn, hãy chủ động giúp đỡ.'
    ]
  },
  'B': {
    tomTat: 'Anh chị em của bạn thuộc mẫu người thông minh, sống nội tâm. Mối quan hệ anh em có thể có khoảng cách nhưng vẫn giữ sự tôn trọng.',
    anhChiEm: 'Anh chị em của bạn thuộc mẫu người có đầu óc, thích suy nghĩ độc lập và ít bộc lộ cảm xúc. Họ có thể không biểu đạt tình cảm bằng lời, nhưng luôn quan tâm theo cách riêng. Mối quan hệ anh em thiên về sự tôn trọng hơn là chia sẻ.',
    quanHe: 'Tình cảm anh em có thể không thật sự gần gũi — mỗi người có cuộc sống và suy nghĩ riêng. Tuy nhiên, sự tôn trọng lẫn nhau vẫn được giữ gìn.',
    hoTro: 'Anh em có thể hỗ trợ nhau về mặt tri thức, lời khuyên, hoặc những lúc cần người đồng cảm. Sự hỗ trợ mang tính tinh thần nhiều hơn vật chất.',
    luuY: 'Mặt xấu: lời qua tiếng lại giữa anh em dễ sắc, gây hiểu lầm, và mỗi người hay giữ ý mình.',
    loiKhuyen: [
      'Tìm điểm chung với anh em thay vì tập trung vào sự khác biệt.',
      'Tôn trọng quan điểm của anh em, kể cả khi bạn không đồng ý.',
      'Dành thời gian cho những cuộc trò chuyện sâu sắc.'
    ]
  },
  'C': {
    tomTat: 'Anh chị em của bạn thuộc mẫu người thực tế, chăm chỉ và biết lo cho gia đình. Mối quan hệ anh em thường bền vững và ít sóng gió.',
    anhChiEm: 'Anh chị em của bạn thuộc mẫu người thực tế, sống có trách nhiệm với gia đình. Họ quan tâm đến những điều thiết thực hơn là lời nói hoa mỹ. Tình cảm anh em được thể hiện qua hành động hơn là lời nói.',
    quanHe: 'Mặt tốt: tình cảm anh em ổn định, ít xung đột. Mặt xấu: dễ khô khan, ít tâm sự, và chuyện tiền bạc chung là chỗ dễ sinh tính toán.',
    hoTro: 'Anh em có xu hướng giúp đỡ nhau trong công việc và đời sống — sự hỗ trợ thiết thực và đáng tin cậy.',
    luuY: 'Mặt xấu: được giúp nhiều thì dễ quen dựa dẫm, và sự giúp đỡ không cân dễ thành điều tiếng giữa anh em.',
    loiKhuyen: [
      'Giữ mối quan hệ anh em hòa thuận bằng cách tôn trọng lẫn nhau.',
      'Trong các vấn đề tài chính chung, hãy rõ ràng từ đầu để tránh hiểu lầm.',
      'Đừng để tiền bạc làm mất đi tình cảm anh em.'
    ]
  },
  'D': {
    tomTat: 'Anh chị em của bạn thuộc mẫu người có tính cách khác biệt, ít tìm được tiếng nói chung. Mối quan hệ anh em có thể có khoảng cách.',
    anhChiEm: 'Anh chị em của bạn thuộc mẫu người có cá tính mạnh, quan điểm khác biệt. Mỗi người có con đường riêng và ít khi hòa hợp trong các vấn đề chung. Mối quan hệ anh em thiên về sự chấp nhận khác biệt hơn là gắn kết.',
    quanHe: 'Tình cảm anh em có thể không mấy gắn kết — có thể có những xung đột hoặc hiểu lầm trong quá khứ. Có thể có giai đoạn anh em không nhìn mặt nhau. Mặt tốt: mỗi người tự đứng được, không lệ thuộc nhau.',
    hoTro: 'Sự hỗ trợ từ anh em có thể không ổn định — bạn nên tự lực nhiều hơn và không nên đặt quá nhiều kỳ vọng.',
    luuY: 'Mặt xấu: thừa kế, tài sản chung là chỗ dễ phát sinh tranh chấp nhất giữa anh em. Gợi ý: rõ ràng giấy tờ ngay từ đầu.',
    loiKhuyen: [
      'Học cách chấp nhận sự khác biệt của anh em.',
      'Hàn gắn sớm, đừng để mâu thuẫn kéo dài.',
      'Tập trung vào cuộc sống của mình thay vì bận tâm quá nhiều đến chuyện anh em.'
    ]
  },
  'F': {
    tomTat: 'Phần anh em trên lá số để trống — mối quan hệ anh chị em linh hoạt, phụ thuộc vào hoàn cảnh và cung xung chiếu.',
    anhChiEm: 'Bạn không có một "định hình" rõ ràng về anh chị em — mối quan hệ có thể thay đổi tùy từng giai đoạn cuộc đời. Có thể bạn có ít anh em, hoặc anh em ở xa, hoặc mối quan hệ không có nét gì thật đặc biệt.',
    quanHe: 'Tình cảm anh em có thể lúc gần lúc xa, tùy thuộc vào hoàn cảnh sống. Mặt xấu: tình cảm dễ phai nhạt theo thời gian, lúc cần ít khi nhờ được nhau.',
    hoTro: 'Sự hỗ trợ từ anh em không ổn định — bạn nên xây dựng mạng lưới hỗ trợ bên ngoài gia đình để không bị động.',
    luuY: 'Mặt xấu: quan hệ anh em có thể trở thành gánh nặng khi một người gặp khó và trông vào bạn. Mặt tốt: bạn tự lập, ít bị ràng buộc.',
    loiKhuyen: [
      'Giữ liên lạc với anh em, kể cả khi đang có khúc mắc.',
      'Tìm cách kết nối với anh em qua những hoạt động chung.',
      'Nếu không có anh em ruột, hãy xây dựng tình bạn thân thiết như anh em.'
    ]
  }
};

/* ============================================================
 *  HÀM SINH FACTS + VĂN — NÔ BỘC · PHỤ MẪU · HUYNH ĐỆ
 * ============================================================ */

function tuviSinhFactsNoBoc_(chart, pi) {
  var facts = [], P = chart.palaces, C = P[pi], lv = 'No Boc', nhom = 'xa_hoi';
  C.chinh.forEach(function(s) {
    var info = TUVI_FACT_NOBOC_CHINHTINH[s.n]; if (!info) return;
    var heSo = s.b ? (TUVI_FACT_DOSANG_HE_SO[s.b] || 1.0) : 1.0;
    facts.push(taoFact_('Tu Vi', lv, nhom, (s.b === 'H') ? 'trung' : 'manh', info.yNghia, Math.round(info.trongSo * heSo * 10) / 10,
      { nguon: 'Chính tinh ' + s.n + (s.b ? ' (' + s.b + ')' : '') + ' tại Nô Bộc', tags: info.tags.slice() }));
    if (s.hoa) { var f = tuviFactsTuHoaSao_(s.n, s.hoa, C, lv, nhom); if (f) facts.push(f); }
  });
  var ds = [].concat(C.cat, C.hung, C.tieu), daXuat = {};
  ds.forEach(function(s) {
    if (s.hoaOf) return; var info = TUVI_FACT_NOBOC_PHUTINH[s.n]; if (!info) return;
    var k = info.yNghia.slice(0, 30); if (daXuat[k]) return; daXuat[k] = true;
    facts.push(taoFact_('Tu Vi', lv, nhom, info.loai, info.yNghia, info.trongSo, { nguon: 'Phụ tinh ' + s.n + ' tại Nô Bộc', tags: info.tags }));
  });
  facts = facts.concat(tuviFactsTuanTriet_(C, lv, nhom));
  facts = facts.concat(tuviFactsTamPhuongTuChinh_(chart, pi, lv, nhom));
  facts = facts.concat(tuviFactsNhiHop_(chart, pi, lv, nhom));
  facts = facts.concat(tuviFactsGiapCung_(chart, pi, lv, nhom));
  facts = facts.concat(tuviFactsVongSao_(C, lv, nhom));
  return locFactLoi_(facts);
}

function tuviSinhFactsPhuMau_(chart, pi) {
  var facts = [], P = chart.palaces, C = P[pi], lv = 'Phu Mau', nhom = 'gia_dao';
  C.chinh.forEach(function(s) {
    var info = TUVI_FACT_PHUMau_CHINHTINH[s.n]; if (!info) return;
    var heSo = s.b ? (TUVI_FACT_DOSANG_HE_SO[s.b] || 1.0) : 1.0;
    facts.push(taoFact_('Tu Vi', lv, nhom, (s.b === 'H') ? 'trung' : 'manh', info.yNghia, Math.round(info.trongSo * heSo * 10) / 10,
      { nguon: 'Chính tinh ' + s.n + (s.b ? ' (' + s.b + ')' : '') + ' tại Phụ Mẫu', tags: info.tags.slice() }));
    if (s.hoa) { var f = tuviFactsTuHoaSao_(s.n, s.hoa, C, lv, nhom); if (f) facts.push(f); }
  });
  var ds = [].concat(C.cat, C.hung, C.tieu), daXuat = {};
  ds.forEach(function(s) {
    if (s.hoaOf) return; var info = TUVI_FACT_PHUMau_PHUTINH[s.n]; if (!info) return;
    var k = info.yNghia.slice(0, 30); if (daXuat[k]) return; daXuat[k] = true;
    facts.push(taoFact_('Tu Vi', lv, nhom, info.loai, info.yNghia, info.trongSo, { nguon: 'Phụ tinh ' + s.n + ' tại Phụ Mẫu', tags: info.tags }));
  });
  facts = facts.concat(tuviFactsTuanTriet_(C, lv, nhom));
  facts = facts.concat(tuviFactsTamPhuongTuChinh_(chart, pi, lv, nhom));
  facts = facts.concat(tuviFactsNhiHop_(chart, pi, lv, nhom));
  facts = facts.concat(tuviFactsGiapCung_(chart, pi, lv, nhom));
  facts = facts.concat(tuviFactsVongSao_(C, lv, nhom));
  return locFactLoi_(facts);
}

function tuviSinhFactsHuynhDe_(chart, pi) {
  var facts = [], P = chart.palaces, C = P[pi], lv = 'Huynh De', nhom = 'gia_dao';
  C.chinh.forEach(function(s) {
    var info = TUVI_FACT_HUYNHDE_CHINHTINH[s.n]; if (!info) return;
    var heSo = s.b ? (TUVI_FACT_DOSANG_HE_SO[s.b] || 1.0) : 1.0;
    facts.push(taoFact_('Tu Vi', lv, nhom, (s.b === 'H') ? 'trung' : 'manh', info.yNghia, Math.round(info.trongSo * heSo * 10) / 10,
      { nguon: 'Chính tinh ' + s.n + (s.b ? ' (' + s.b + ')' : '') + ' tại Huynh Đệ', tags: info.tags.slice() }));
    if (s.hoa) { var f = tuviFactsTuHoaSao_(s.n, s.hoa, C, lv, nhom); if (f) facts.push(f); }
  });
  var ds = [].concat(C.cat, C.hung, C.tieu), daXuat = {};
  ds.forEach(function(s) {
    if (s.hoaOf) return; var info = TUVI_FACT_HUYNHDE_PHUTINH[s.n]; if (!info) return;
    var k = info.yNghia.slice(0, 30); if (daXuat[k]) return; daXuat[k] = true;
    facts.push(taoFact_('Tu Vi', lv, nhom, info.loai, info.yNghia, info.trongSo, { nguon: 'Phụ tinh ' + s.n + ' tại Huynh Đệ', tags: info.tags }));
  });
  facts = facts.concat(tuviFactsTuanTriet_(C, lv, nhom));
  facts = facts.concat(tuviFactsTamPhuongTuChinh_(chart, pi, lv, nhom));
  facts = facts.concat(tuviFactsNhiHop_(chart, pi, lv, nhom));
  facts = facts.concat(tuviFactsGiapCung_(chart, pi, lv, nhom));
  facts = facts.concat(tuviFactsVongSao_(C, lv, nhom));
  return locFactLoi_(facts);
}

function xacDinhNhomNoBoc_(palace, P, pi) {
  var sao = palace.chinh.map(function(s){ return s.n; });
  if (!sao.length) { var xc = mod12(pi + 6); sao = P[xc].chinh.map(function(s){ return s.n; }); if (!sao.length) return 'F'; }
  if (sao.some(function(s){ return ['Tử Vi','Thái Dương','Thiên Tướng'].indexOf(s) >= 0; })) return 'A';
  if (sao.some(function(s){ return ['Thiên Cơ','Cự Môn','Thái Âm'].indexOf(s) >= 0; })) return 'B';
  if (sao.some(function(s){ return ['Vũ Khúc','Thiên Phủ','Thiên Đồng'].indexOf(s) >= 0; })) return 'C';
  if (sao.some(function(s){ return ['Thất Sát','Phá Quân','Liêm Trinh'].indexOf(s) >= 0; })) return 'D';
  if (sao.some(function(s){ return ['Tham Lang','Thiên Lương'].indexOf(s) >= 0; })) return 'E';
  return 'C';
}

function xacDinhNhomPhuMau_(palace, P, pi) {
  // Điểm tổng lực cung (đã tính sẵn ở TuVi.gs): 0-10
  var diem10 = palace.diem10 != null ? palace.diem10 : chuanHoa10_(palace.diem);

  // Đếm sát tinh nặng — đây là "chìa khóa" luận Phụ Mẫu
  var dsSao = [].concat(palace.chinh, palace.cat, palace.hung, palace.tieu).map(function(s){ return s.n; });
  var satNang = 0;
  ['Kình Dương','Đà La','Hỏa Tinh','Linh Tinh','Địa Không','Địa Kiếp','Hóa Kỵ','Thiên Hình'].forEach(function(s){
    if (dsSao.indexOf(s) >= 0) satNang++;
  });

  // Chính tinh hãm địa — đảo ngược ý nghĩa
  var soHam = palace.chinh.filter(function(s){ return s.b === 'H'; }).length;
  var soSang = palace.chinh.filter(function(s){ return s.b === 'M' || s.b === 'V' || s.b === 'Đ'; }).length;

  // Điều chỉnh điểm theo yếu tố đặc thù Phụ Mẫu
  var d = diem10;
  if (palace.tuan || palace.triet) d -= 0.8;
  if (soHam >= 2) d -= 1.2;
  if (satNang >= 3) d -= 1.0;

  // VCD + Tuần/Triệt → nhóm F (đặc biệt)
  if (!palace.chinh.length && (palace.tuan || palace.triet)) return 'F';

  // VCD thuần (không Tuần/Triệt) → mượn cung đối
  if (!palace.chinh.length) {
    var xc = mod12(pi + 6);
    var saoDoi = P[xc].chinh.map(function(s){ return s.n; });
    if (!saoDoi.length) return 'F';
    // Nếu cung đối cũng VCD → F
    return 'F';
  }

  // Nếu có >=3 sát tinh nặng → chắc chắn nhóm D (xung khắc), bất kể điểm
  if (satNang >= 3) return 'D';

  // Xếp nhóm theo điểm tổng lực
  if (d >= 6.5) return 'A'; // Phúc ấm — cha mẹ tốt, có địa vị
  if (d >= 5.0) return 'B'; // Bình thường — cha mẹ trung bình, ít sóng gió
  if (d >= 3.5) return 'C'; // Vất vả — cha mẹ nghèo khó, căng thẳng
  return 'D';               // Xung khắc — cha mẹ bất hòa, đánh nhau, xa cách
}

function xacDinhNhomHuynhDe_(palace, P, pi) {
  var sao = palace.chinh.map(function(s){ return s.n; });
  if (!sao.length) { var xc = mod12(pi + 6); sao = P[xc].chinh.map(function(s){ return s.n; }); if (!sao.length) return 'F'; }
  if (sao.some(function(s){ return ['Tử Vi','Thiên Tướng','Thiên Lương','Thái Dương'].indexOf(s) >= 0; })) return 'A';
  if (sao.some(function(s){ return ['Thiên Cơ','Cự Môn','Thái Âm'].indexOf(s) >= 0; })) return 'B';
  if (sao.some(function(s){ return ['Thiên Đồng','Thiên Phủ','Vũ Khúc'].indexOf(s) >= 0; })) return 'C';
  if (sao.some(function(s){ return ['Thất Sát','Phá Quân','Liêm Trinh','Tham Lang'].indexOf(s) >= 0; })) return 'D';
  return 'C';
}

function taoDoanTuHoaChung_(palace, tenCung, yL) {
  var dsHoa = [];
  [].concat(palace.chinh, palace.cat, palace.hung, palace.tieu).forEach(function(s) {
    if (s.hoa && dsHoa.indexOf(s.hoa) < 0) dsHoa.push(s.hoa);
  });
  if (!dsHoa.length) return null;
  var text = [];
  if (dsHoa.indexOf('Lộc') >= 0) text.push(tvhVietHoa_(yL.loc || 'điểm sáng lớn, nhiều thuận lợi.'));
  if (dsHoa.indexOf('Quyền') >= 0) text.push(tvhVietHoa_(yL.quyen || 'có uy, chủ động trong lĩnh vực này.'));
  if (dsHoa.indexOf('Khoa') >= 0) text.push(tvhVietHoa_(yL.khoa || 'danh tiếng, học vấn, gặp khó có người giải.'));
  if (dsHoa.indexOf('Kỵ') >= 0) text.push(tvhVietHoa_(yL.ky || 'điểm cần lưu ý, dễ gặp trở ngại và hiểu lầm.'));
  if (!text.length) return null;
  return { tieuDe: 'Tứ Hóa tại ' + tenCung, text: text.join(' ') };
}

function taoDoanCanhBaoChung_(chart, pi, tenCung, canhBaoList) {
  var P = chart.palaces, C = P[pi];
  var dsSao = [].concat(C.chinh, C.cat, C.hung, C.tieu).map(function(s){ return s.n; });
  var canhBao = [];
  canhBaoList.forEach(function(cb) {
    if (dsSao.some(function(s){ return cb.sao.indexOf(s) >= 0; })) canhBao.push(cb.text);
  });
  if (!canhBao.length) return null;
  return { tieuDe: 'Cảnh báo đặc biệt — ' + tenCung, text: canhBao.join(' ') };
}

function sinhVanCungNoBoc_(chart, pi) {
  var P = chart.palaces, palace = P[pi];
  var nhom = xacDinhNhomNoBoc_(palace, P, pi);
  var van = TUVI_VAN_NOBOC[nhom] || TUVI_VAN_NOBOC['C'];
  var facts = tuviSinhFactsNoBoc_(chart, pi);
  var doan = [];
  doan.push({ tieuDe: 'Tóm tắt', text: van.tomTat });
  var textQH = van.quanHe;
  var fC = facts.filter(function(f){ return f.nguon && f.nguon.indexOf('Chính tinh') === 0; }).sort(function(a,b){ return b.trongSo - a.trongSo; });
  if (fC.length) textQH += ' Cụ thể: ' + fC.slice(0,2).map(function(f){ return f.yNghia; }).join(' ');
  doan.push({ tieuDe: 'Quan hệ bạn bè & đồng nghiệp', text: textQH });
  doan.push({ tieuDe: 'Người dưới quyền & cộng sự', text: van.nguoiDuoi });
  var textCH = van.coHoi;
  var fQN = facts.filter(function(f){ var t = f.tags || []; return t.some(function(x){ return x.indexOf('quy_nhan') >= 0 || x.indexOf('duoc_giup') >= 0 || x.indexOf('ban_mang') >= 0; }); });
  if (fQN.length) textCH += ' Yếu tố hỗ trợ: ' + fQN.map(function(f){ return f.yNghia; }).join(' ');
  doan.push({ tieuDe: 'Cơ hội & quý nhân từ bạn bè', text: textCH });
  var textLY = van.luuY;
  var fLY = facts.filter(function(f){ return f.loai === 'yeu' && (!f.nguon || f.nguon.indexOf('Chính tinh') !== 0); }).sort(function(a,b){ return b.trongSo - a.trongSo; });
  if (fLY.length) textLY += ' Cụ thể: ' + fLY.slice(0,3).map(function(f){ return f.yNghia; }).join(' ');
  doan.push({ tieuDe: 'Điều cần lưu ý', text: textLY });
  var dH = taoDoanTuHoaChung_(palace, 'Nô Bộc', { loc: 'bạn bè mang lại tài lộc, cùng nhau làm ăn có lợi.', quyen: 'bạn bè nể trọng, có uy trong nhóm.', khoa: 'bạn bè giúp giải quyết khó khăn.', ky: 'bạn bè đố kỵ, dễ nảy sinh thị phi.' });
  if (dH) doan.push(dH);
  var dCB = taoDoanCanhBaoChung_(chart, pi, 'Nô Bộc', [
    { sao: ['Kình Dương','Đà La'], text: 'Bạn bè tranh giành, dễ xảy ra xung đột, hợp tác làm ăn dễ đổ vỡ.' },
    { sao: ['Địa Không','Địa Kiếp'], text: 'Dễ bị bạn bè lợi dụng, mất tiền hoặc mất cơ hội vì người quen.' },
    { sao: ['Hóa Kỵ'], text: 'Bạn bè đố kỵ, quan hệ xã hội dễ nảy sinh thị phi.' }
  ]);
  if (dCB) doan.push(dCB);
  doan.push({ tieuDe: 'Lời khuyên cụ thể', text: '', list: van.loiKhuyen.slice() });
  return doan;
}

function taoDoanDacDiemPhuMau_(palace) {
  var dsSao = [].concat(palace.chinh, palace.cat, palace.hung, palace.tieu).map(function(s){ return s.n; });
  var cau = [];

  // Nghèo khó, mất mát tài sản
  if (dsSao.indexOf('Địa Không') >= 0 || dsSao.indexOf('Địa Kiếp') >= 0 || dsSao.indexOf('Đại Hao') >= 0 || dsSao.indexOf('Tiểu Hao') >= 0) {
    cau.push('Kinh tế gia đình khó khăn, tiền bạc hay bị thất thoát. Cha mẹ vất vả lo toan mà khó dư giả.');
  }

  // Cãi cọ, xô xát
  if (dsSao.indexOf('Kình Dương') >= 0 || dsSao.indexOf('Đà La') >= 0) {
    cau.push('Cha mẹ dễ xảy ra xung đột, có thể có lời qua tiếng lại hoặc căng thẳng kéo dài trong gia đình.');
  }
  if (dsSao.indexOf('Hỏa Tinh') >= 0 || dsSao.indexOf('Linh Tinh') >= 0) {
    cau.push('Không khí gia đình có lúc căng thẳng, dễ bùng phát thành cãi vã to tiếng. Những ký ức tuổi thơ về tiếng to tiếng nhỏ có thể còn in đậm trong tâm trí bạn.');
  }
  if (dsSao.indexOf('Thiên Hình') >= 0) {
    cau.push('Cha mẹ có thể nghiêm khắc quá mức, hoặc dùng kỷ luật cứng rắn trong gia đình — điều này có thể để lại vết thương tinh thần cho con cái.');
  }

  // Cãi cọ bằng lời nói
  if (dsSao.indexOf('Cự Môn') >= 0) {
    cau.push('Cha mẹ có thể hay bất đồng quan điểm, lời nói qua lại làm tổn thương nhau. Tiếng cãi vã có thể là âm thanh quen thuộc trong tuổi thơ bạn.');
  }

  // Hiểu lầm, thị phi
  if (dsSao.indexOf('Hóa Kỵ') >= 0) {
    cau.push('Gia đình có thể gặp chuyện hiểu lầm, thị phi, hoặc điều tiếng không hay từ bên ngoài. Những hiểu lầm giữa cha mẹ có thể kéo dài dai dẳng.');
  }

  // Buồn thảm, biến cố
  if (dsSao.indexOf('Tang Môn') >= 0 || dsSao.indexOf('Bạch Hổ') >= 0) {
    cau.push('Gia đình có thể trải qua biến cố, không khí có lúc nặng nề, buồn thảm. Đây là dấu hiệu của những giai đoạn khó khăn mà cả nhà phải cùng nhau vượt qua.');
  }
  if (dsSao.indexOf('Thiên Khốc') >= 0 || dsSao.indexOf('Thiên Hư') >= 0) {
    cau.push('Có những giai đoạn gia đình gặp chuyện buồn, thiếu thốn hoặc hao tổn không rõ lý do.');
  }

  // Xa cách
  if (dsSao.indexOf('Cô Thần') >= 0 || dsSao.indexOf('Quả Tú') >= 0) {
    cau.push('Cha mẹ và con cái có thể ít gần gũi, không khí gia đình thiếu sự ấm áp tự nhiên. Bạn có thể cảm thấy cô đơn ngay trong chính gia đình mình.');
  }

  // Tuần/Triệt
  if (palace.tuan || palace.triet) {
    cau.push('Phần cha mẹ trong lá số bị "che mờ" (một dấu hiệu làm chậm, làm giảm lực của cung) — tuổi thơ có thể thiếu thốn cả vật chất lẫn tình cảm, phải tự lập sớm. Mọi việc liên quan đến cha mẹ thường chậm trễ, dở dang.');
  }

  // Sao hãm
  var soHam = palace.chinh.filter(function(s){ return s.b === 'H'; }).length;
  if (soHam >= 1) {
    cau.push('Chính tinh hãm địa tại Phụ Mẫu — cha mẹ vất vả, không được hưởng nhiều phúc lộc từ gia đình. Bạn có thể phải tự lập và tự tạo dựng cuộc sống từ sớm.');
  }

  // Cha mẹ cứng rắn
  if (dsSao.indexOf('Vũ Khúc') >= 0 || dsSao.indexOf('Liêm Trinh') >= 0) {
    cau.push('Cha mẹ có thể cứng rắn, ít bộc lộ tình cảm — mối quan hệ thiên về trách nhiệm hơn là sự gần gũi. Bạn có thể cảm thấy thiếu sự ấm áp từ cha mẹ dù họ vẫn lo cho bạn đầy đủ về vật chất.');
  }

  return cau;
}

function sinhVanCungPhuMau_(chart, pi) {
  var P = chart.palaces, palace = P[pi];
  var nhom = xacDinhNhomPhuMau_(palace, P, pi);
  var van = TUVI_VAN_PHUMAU[nhom] || TUVI_VAN_PHUMAU['C'];
  var facts = tuviSinhFactsPhuMau_(chart, pi);
  var doan = [];

  doan.push({ tieuDe: 'Tóm tắt', text: van.tomTat });

  // Cha mẹ của bạn
  var textCM = van.chaMe;
  var fC = facts.filter(function(f){ return f.nguon && f.nguon.indexOf('Chính tinh') === 0; }).sort(function(a,b){ return b.trongSo - a.trongSo; });
  if (fC.length) textCM += ' Cụ thể: ' + fC.slice(0,2).map(function(f){ return f.yNghia; }).join(' ');
  doan.push({ tieuDe: 'Cha mẹ của bạn', text: textCM });

  // ĐẶC ĐIỂM CỤ THỂ — đoạn mới, quan trọng nhất
  var cauDacDiem = taoDoanDacDiemPhuMau_(palace);
  if (cauDacDiem.length) {
    doan.push({ tieuDe: 'Đặc điểm cụ thể của gia đình bạn', text: cauDacDiem.join(' ') });
  }

  // Mối quan hệ
  doan.push({ tieuDe: 'Mối quan hệ cha mẹ – con cái', text: van.quanHe });

  // Giấy tờ
  doan.push({ tieuDe: 'Giấy tờ & thừa kế', text: van.giayTo });

  // Lưu ý
  var textLY = van.luuY;
  var fLY = facts.filter(function(f){ return f.loai === 'yeu' && (!f.nguon || f.nguon.indexOf('Chính tinh') !== 0); }).sort(function(a,b){ return b.trongSo - a.trongSo; });
  if (fLY.length) textLY += ' Cụ thể: ' + fLY.slice(0,3).map(function(f){ return f.yNghia; }).join(' ');
  doan.push({ tieuDe: 'Điều cần lưu ý', text: textLY });

  // Tứ Hóa
  var dH = taoDoanTuHoaChung_(palace, 'Phụ Mẫu', { loc: 'được thừa hưởng tài sản, gia đình khá giả.', quyen: 'cha mẹ có uy, bạn được hưởng phúc ấm.', khoa: 'gia đình có giáo dục, học vấn cao.', ky: 'dễ xung khắc với bề trên, giấy tờ vướng mắc.' });
  if (dH) doan.push(dH);

  // Cảnh báo
  var dCB = taoDoanCanhBaoChung_(chart, pi, 'Phụ Mẫu', [
    { sao: ['Tang Môn','Bạch Hổ'], text: 'Sức khỏe cha mẹ dễ có vấn đề, trong nhà có thể có chuyện buồn.' },
    { sao: ['Kình Dương','Hóa Kỵ'], text: 'Dễ xung khắc với cha mẹ, có giai đoạn căng thẳng kéo dài.' },
    { sao: ['Địa Không','Địa Kiếp'], text: 'Bạn dễ sớm thiếu chỗ dựa từ cha mẹ (cha mẹ vất vả, sức khỏe yếu hoặc ở xa) và phải tự lập sớm.' }
  ]);
  if (dCB) doan.push(dCB);

  doan.push({ tieuDe: 'Lời khuyên cụ thể', text: '', list: van.loiKhuyen.slice() });
  return doan;
}

function sinhVanCungHuynhDe_(chart, pi) {
  var P = chart.palaces, palace = P[pi];
  var nhom = xacDinhNhomHuynhDe_(palace, P, pi);
  var van = TUVI_VAN_HUYNHDE[nhom] || TUVI_VAN_HUYNHDE['C'];
  var facts = tuviSinhFactsHuynhDe_(chart, pi);
  var doan = [];
  doan.push({ tieuDe: 'Tóm tắt', text: van.tomTat });
  var textACE = van.anhChiEm;
  var fC = facts.filter(function(f){ return f.nguon && f.nguon.indexOf('Chính tinh') === 0; }).sort(function(a,b){ return b.trongSo - a.trongSo; });
  if (fC.length) textACE += ' Cụ thể: ' + fC.slice(0,2).map(function(f){ return f.yNghia; }).join(' ');
  doan.push({ tieuDe: 'Anh chị em của bạn', text: textACE });
  doan.push({ tieuDe: 'Mối quan hệ anh chị em', text: van.quanHe });
  doan.push({ tieuDe: 'Sự hỗ trợ qua lại', text: van.hoTro });
  var textLY = van.luuY;
  var fLY = facts.filter(function(f){ return f.loai === 'yeu' && (!f.nguon || f.nguon.indexOf('Chính tinh') !== 0); }).sort(function(a,b){ return b.trongSo - a.trongSo; });
  if (fLY.length) textLY += ' Cụ thể: ' + fLY.slice(0,3).map(function(f){ return f.yNghia; }).join(' ');
  doan.push({ tieuDe: 'Điều cần lưu ý', text: textLY });
  var dH = taoDoanTuHoaChung_(palace, 'Huynh Đệ', { loc: 'anh em khá giả, giúp đỡ bạn về tài chính.', quyen: 'anh em có uy, bạn được nhờ.', khoa: 'anh em có học vấn, danh tiếng.', ky: 'hiểu lầm với anh em, dễ xảy ra xung đột.' });
  if (dH) doan.push(dH);
  var dCB = taoDoanCanhBaoChung_(chart, pi, 'Huynh Đệ', [
    { sao: ['Kình Dương','Đà La'], text: 'Anh em bất hòa, dễ tranh chấp. Tránh bàn chuyện tiền bạc với anh em.' },
    { sao: ['Cô Thần','Quả Tú'], text: 'Anh em sống khép kín, ít qua lại, thiếu gắn kết.' },
    { sao: ['Hóa Kỵ'], text: 'Hiểu lầm với anh em, cần chủ động hóa giải.' }
  ]);
  if (dCB) doan.push(dCB);
  doan.push({ tieuDe: 'Lời khuyên cụ thể', text: '', list: van.loiKhuyen.slice() });
  return doan;
}

function testVan3Cung() {
  chiChayNoiBo_(arguments[0]);
  var input = { name: 'Test', gender: 'nam', calendar: 'duong', day: 16, month: 6, year: 1995, hour: 4, minute: 0, viewYear: 2026 };
  var chart = tuviLapLaSo_(input);
  ['Nô Bộc','Phụ Mẫu','Huynh Đệ'].forEach(function(ten) {
    var pi = -1;
    for (var i = 0; i < 12; i++) { if (chart.palaces[i].cung === ten) { pi = i; break; } }
    if (pi < 0) return;
    var doan;
    if (ten === 'Nô Bộc') doan = sinhVanCungNoBoc_(chart, pi);
    else if (ten === 'Phụ Mẫu') doan = sinhVanCungPhuMau_(chart, pi);
    else doan = sinhVanCungHuynhDe_(chart, pi);
    Logger.log('=== ' + ten + ' (' + chart.palaces[pi].canTen + ' ' + chart.palaces[pi].chiTen + ') ===');
    doan.forEach(function(d, i) {
      Logger.log('--- ' + (i+1) + '. ' + d.tieuDe + ' ---');
      if (d.text) Logger.log(d.text);
      if (d.list) d.list.forEach(function(x){ Logger.log('  • ' + x); });
    });
    Logger.log('');
  });
}
function testTang2ToanBo12Cung() {
  chiChayNoiBo_(arguments[0]);
  var input = {
    name: 'Test', gender: 'nam', calendar: 'duong',
    day: 16, month: 6, year: 1995, hour: 4, minute: 0, viewYear: 2026
  };
  var chart = tuviLapLaSo_(input);
  var TEN12 = ['Mệnh','Huynh Đệ','Phu Thê','Tử Tức','Tài Bạch','Tật Ách',
    'Thiên Di','Nô Bộc','Quan Lộc','Điền Trạch','Phúc Đức','Phụ Mẫu'];

  Logger.log('=== KIỂM TRA TẦNG 2 — 12 CUNG ===\n');

  TEN12.forEach(function(ten) {
    var pi = -1;
    for (var i = 0; i < 12; i++) if (chart.palaces[i].cung === ten) { pi = i; break; }
    if (pi < 0) return;

    var dg = danhGiaTongLuc_(chart.palaces[pi]);
    var doan = sinhDoanHoanCanh_(chart, pi, ten);

    Logger.log('─── ' + ten + ' (' + chart.palaces[pi].canTen + ' ' + chart.palaces[pi].chiTen + ') ───');
    Logger.log('  Điểm gốc: ' + dg.diemGoc + ' → điều chỉnh: ' + dg.diem10);
    Logger.log('  Sát tinh nặng: ' + dg.satNang + ' · Tuần/Triệt: ' + (dg.coTuanTriet ? 'CÓ' : 'không') + ' · Số hãm: ' + dg.soHam);
    Logger.log('  → Mức: ' + dg.mucDo);
    if (doan) {
      Logger.log('  Tiêu đề: ' + doan.tieuDe);
      Logger.log('  Nội dung: ' + doan.text);
    }
    Logger.log('');
  });

  Logger.log('✓ Nếu bạn thấy 12 cung đều có đoạn hoàn cảnh, Tầng 2 đã hoạt động.');
}
function testTang1Tang2KhongMauThuan() {
  chiChayNoiBo_(arguments[0]);
  var input = {
    name: 'Test', gender: 'nam', calendar: 'duong',
    day: 16, month: 6, year: 1995, hour: 4, minute: 0, viewYear: 2026
  };
  var chart = tuviLapLaSo_(input);
  var TEN4 = ['Phụ Mẫu', 'Huynh Đệ', 'Nô Bộc', 'Thiên Di'];

  Logger.log('=== KIỂM TRA TẦNG 1 + TẦNG 2 KHÔNG MÂU THUẪN ===\n');

  TEN4.forEach(function(ten) {
    var pi = -1;
    for (var i = 0; i < 12; i++) if (chart.palaces[i].cung === ten) { pi = i; break; }
    if (pi < 0) return;

    Logger.log('━━━━━━━━━ ' + ten + ' ━━━━━━━━━');
    var dg = danhGiaTongLuc_(chart.palaces[pi]);
    Logger.log('  Mức Tầng 2: ' + dg.mucDo + ' (điểm ' + dg.diem10 + '/10)');
    Logger.log('');
    Logger.log('  --- TẦNG 1 (bản chất) ---');
    var doan;
    if (ten === 'Phụ Mẫu') doan = sinhVanCungPhuMau_(chart, pi);
    else if (ten === 'Huynh Đệ') doan = sinhVanCungHuynhDe_(chart, pi);
    else if (ten === 'Nô Bộc') doan = sinhVanCungNoBoc_(chart, pi);
    else doan = sinhVanCungThienDi_(chart, pi);

    doan.slice(0, 2).forEach(function(d, i) {
      Logger.log('  [' + (i+1) + '] ' + d.tieuDe);
      if (d.text) Logger.log('      ' + d.text.substring(0, 200) + '...');
    });
    Logger.log('');
    Logger.log('  --- TẦNG 2 (hoàn cảnh) ---');
    var hc = sinhDoanHoanCanh_(chart, pi, ten);
    if (hc) {
      Logger.log('  [' + hc.tieuDe + ']');
      Logger.log('      ' + hc.text);
    }
    Logger.log('');
  });
  Logger.log('✓ Đọc kỹ xem Tầng 1 và Tầng 2 có mâu thuẫn không.');
}
/* ============================================================
 *  TẦNG 2 — ĐÁNH GIÁ HOÀN CẢNH THỰC TẾ CỦA CUNG
 *  Dùng chung cho cả 12 cung — phân tích độc lập với Tầng 1
 * ============================================================ */

/**
 * Đánh giá tổng lực thực tế của một cung.
 * Dùng điểm tổng lực (palace.diem10) + số sát tinh nặng + Tuần/Triệt
 * để phân loại thành 5 mức: rat_tot / tot / trung_binh / kho_khan / rat_kho
 */
function danhGiaTongLuc_(palace) {
  var diem10 = palace.diem10 != null ? palace.diem10 : chuanHoa10_(palace.diem);

  var dsSao = [].concat(palace.chinh, palace.cat, palace.hung, palace.tieu).map(function(s){ return s.n; });
  var satNang = 0;
  ['Kình Dương','Đà La','Hỏa Tinh','Linh Tinh','Địa Không','Địa Kiếp',
   'Hóa Kỵ','Thiên Hình','Thiên Riêu','Tang Môn','Bạch Hổ'].forEach(function(s){
    if (dsSao.indexOf(s) >= 0) satNang++;
  });

  var coTuanTriet = !!(palace.tuan || palace.triet);
  var soHam = palace.chinh.filter(function(s){ return s.b === 'H'; }).length;

  // Điều chỉnh nhẹ — không làm thay đổi bản chất, chỉ tinh chỉnh
  var d = diem10;
  if (coTuanTriet) d -= 0.5;
  if (satNang >= 3) d -= 0.7;
  else if (satNang >= 2) d -= 0.4;
  if (soHam >= 2) d -= 0.3;

  var mucDo;
  if (d >= 7) mucDo = 'rat_tot';
  else if (d >= 5.5) mucDo = 'tot';
  else if (d >= 4) mucDo = 'trung_binh';
  else if (d >= 2.5) mucDo = 'kho_khan';
  else mucDo = 'rat_kho';

  return {
    mucDo: mucDo,
    diem10: Math.round(d * 10) / 10,
    diemGoc: diem10,
    satNang: satNang,
    coTuanTriet: coTuanTriet,
    soHam: soHam
  };
}

/**
 * Kho văn Tầng 2 — mỗi cung có 5 mức độ; quy tắc 24/11: nêu song song
 * mặt tốt và mặt xấu, mặt xấu nói thẳng, tôn trọng, gợi ý (nếu có) ngắn đặt sau.
 */
var TUVI_VAN_HOANCANH = {
  'Mệnh': {
    tieuDe: 'Bối cảnh cuộc đời bạn',
    rat_tot: 'Mặt tốt: cuộc đời bạn có nhiều thuận lợi, nền tảng tốt cả về thể chất lẫn tinh thần. Mặt xấu: thuận quá dễ chủ quan, ít được rèn qua khó khăn nên khi gặp cú sốc lớn thì dễ chao đảo.',
    tot: 'Mặt tốt: cuộc đời bạn nhìn chung khá thuận, nền tảng đủ vững để xây dựng cuộc sống. Mặt xấu: vẫn có những trở ngại thật — chậm việc, hao sức, lỡ cơ hội — nếu bạn coi nhẹ chúng.',
    trung_binh: 'Cuộc đời bạn ở mức trung bình. Mặt tốt: không có cản trở lớn, thành bại nằm nhiều trong tay bạn. Mặt xấu: cũng ít được nâng đỡ, muốn hơn mức bình thường thì phải bỏ công nhiều hơn người khác.',
    kho_khan: 'Mặt xấu: cuộc đời bạn có những giai đoạn khó khăn rõ rệt — thiếu thốn, vấp ngã, phải nỗ lực gấp đôi người khác mà kết quả vẫn chậm. Mặt tốt: những gì bạn có được sau đó thường bền, và bạn có sức chịu đựng cao.',
    rat_kho: 'Mặt xấu: cuộc đời bạn có nhiều thử thách lớn, từ nhỏ đã có thể gặp khó khăn về gia cảnh, sức khỏe hoặc tình cảm, và có những giai đoạn thấy mình đơn độc. Mặt tốt: người đi qua nhiều nghịch cảnh thường có bản lĩnh và chiều sâu hiếm có. Gợi ý: đừng gánh một mình những lúc khó nhất.'
  },
  'Phụ Mẫu': {
    tieuDe: 'Hoàn cảnh thực tế của gia đình bạn',
    rat_tot: 'Mặt tốt: gia đình bạn êm ấm, cha mẹ có nền tảng tốt và che chở con chu đáo. Mặt xấu: được bao bọc nhiều dễ chậm tự lập, và bạn có thể mang áp lực phải xứng với kỳ vọng của gia đình.',
    tot: 'Mặt tốt: gia đình bạn khá êm ấm, cha mẹ lo cho con đầy đủ. Mặt xấu: vẫn có những lúc căng thẳng, bất đồng quan điểm với cha mẹ, có chuyện không nói ra được.',
    trung_binh: 'Gia đình bạn ở mức trung bình. Mặt tốt: không túng thiếu, vẫn giữ được sự tôn trọng giữa cha mẹ và con. Mặt xấu: cha mẹ chỉ lo được vừa đủ, bạn phải tự xoay nhiều, và quan hệ có lúc căng.',
    kho_khan: 'Mặt xấu: gia đình bạn có những giai đoạn vất vả rõ — thiếu thốn về kinh tế hoặc lạnh nhạt về tình cảm; cha mẹ con cái có lúc căng thẳng, cãi vã, có điều tổn thương chưa nói ra. Mặt tốt: bạn sớm tự lập và hiểu giá trị của đồng tiền, của sự tử tế.',
    rat_kho: 'Mặt xấu: gia đình bạn trải qua nhiều biến động — khó khăn kinh tế kéo dài, cha mẹ xung đột hoặc xa cách; tuổi thơ không yên ả và để lại những vết hằn ảnh hưởng tới cách bạn yêu thương, tin người. Mặt tốt: bạn trưởng thành sớm, có sức chịu đựng và biết mình không muốn lặp lại điều gì. Gợi ý: tìm người có thể lắng nghe bạn, kể cả chuyên gia tâm lý.'
  },
  'Huynh Đệ': {
    tieuDe: 'Thực tế mối quan hệ anh chị em',
    rat_tot: 'Mặt tốt: anh chị em của bạn rất gắn bó, yêu thương và giúp đỡ lẫn nhau. Mặt xấu: gắn bó quá dễ can thiệp vào chuyện riêng của nhau, và tiền bạc chung dễ khó tách bạch.',
    tot: 'Mặt tốt: anh chị em khá hòa thuận, có hỗ trợ qua lại. Mặt xấu: vẫn có bất đồng, so bì, và người gánh nhiều thường thấy thiệt.',
    trung_binh: 'Tình cảm anh chị em ở mức trung bình. Mặt tốt: không có xung đột lớn, mỗi người tự lo được. Mặt xấu: ít gặp gỡ, khó nhờ cậy nhau khi cần.',
    kho_khan: 'Mặt xấu: anh chị em có khoảng cách rõ — ít liên lạc, bất đồng cũ chưa giải, có thể vì tiền bạc hay cách cư xử. Mặt tốt: bạn quen tự lực, không trông chờ vào ai.',
    rat_kho: 'Mặt xấu: quan hệ anh chị em nhiều sóng gió — hiểu lầm sâu, tranh chấp hoặc khoảng cách khó hàn gắn, có giai đoạn không nhìn mặt nhau. Mặt tốt: bạn học được cách tự đứng vững và chọn người thân theo nghĩa tình chứ không chỉ huyết thống.'
  },
  'Phu Thê': {
    tieuDe: 'Thực tế đường hôn nhân',
    rat_tot: 'Mặt tốt: đường hôn nhân thuận, dễ gặp người phù hợp, cuộc sống chung êm ấm. Mặt xấu: êm lâu dễ nhàm, dễ coi nhau là hiển nhiên mà quên vun đắp.',
    tot: 'Mặt tốt: bạn có duyên gặp người phù hợp, hôn nhân ổn định. Mặt xấu: vẫn có những trận giận, những giai đoạn lạnh nhạt mà hai người phải tự gỡ.',
    trung_binh: 'Đường hôn nhân ở mức trung bình. Mặt tốt: không có biến cố lớn định sẵn. Mặt xấu: dễ trải qua vài mối tình dang dở trước khi ổn định, và hôn nhân có những va chạm thường xuyên.',
    kho_khan: 'Mặt xấu: đường hôn nhân nhiều thử thách — dễ trải qua vài mối tình đổ vỡ, chọn nhầm người, hoặc hôn nhân có giai đoạn căng thẳng, lạnh nhạt kéo dài. Mặt tốt: qua đó bạn biết rõ mình cần ai. Gợi ý: đừng cưới khi đang ở giai đoạn rối.',
    rat_kho: 'Mặt xấu: đường hôn nhân nhiều biến động — dễ đến muộn, dễ có sóng gió lớn như ly thân, đổ vỡ hoặc phải làm lại; có những giai đoạn cô đơn và tổn thương khó lành. Mặt tốt: người đi qua những điều đó thường yêu tỉnh táo và chân thành hơn. Gợi ý: tìm hiểu thật kỹ trước khi quyết định gắn bó.'
  },
  'Tử Tức': {
    tieuDe: 'Thực tế duyên con cái',
    rat_tot: 'Mặt tốt: duyên con tốt, con cái khỏe mạnh, mang lại nhiều niềm vui. Mặt xấu: dễ nuông chiều, đặt kỳ vọng lớn lên con, và con lớn lên có thể ít chịu được khó.',
    tot: 'Mặt tốt: duyên con khá thuận, con thường khỏe, ngoan. Mặt xấu: vẫn có giai đoạn con ốm vặt, bướng hoặc học hành trục trặc khiến cha mẹ mệt.',
    trung_binh: 'Duyên con ở mức trung bình. Mặt tốt: không có trở ngại lớn định sẵn. Mặt xấu: việc sinh nở hoặc nuôi dạy có những trục trặc thật, tốn sức và tiền hơn dự tính.',
    kho_khan: 'Mặt xấu: duyên con có trở ngại — dễ sinh con muộn, mang thai vất vả hoặc con có giai đoạn khó nuôi, khó dạy. Mặt tốt: con đến muộn thường được cha mẹ chăm chút kỹ hơn. Gợi ý: nên khám sức khỏe sinh sản sớm.',
    rat_kho: 'Mặt xấu: duyên con nhiều thử thách — có thể khó có con, ít con, hoặc con có vấn đề sức khỏe cần theo dõi lâu dài; quan hệ cha mẹ con cái cũng dễ căng thẳng. Mặt tốt: những gia đình qua được hành trình này thường gắn bó sâu. Gợi ý: tìm bác sĩ chuyên khoa đồng hành từ sớm.'
  },
  'Tài Bạch': {
    tieuDe: 'Thực tế tài chính của bạn',
    rat_tot: 'Mặt tốt: tài chính thuận, dễ kiếm tiền, biết giữ của, cuộc sống đủ đầy. Mặt xấu: dễ chủ quan với rủi ro, tiêu rộng tay và hay bị người quen nhờ vả, vay mượn.',
    tot: 'Mặt tốt: thu nhập khá ổn định, biết tiết kiệm. Mặt xấu: khó có bước nhảy lớn, và vẫn có những khoản hao bất ngờ nếu lơ là.',
    trung_binh: 'Tài chính ở mức trung bình. Mặt tốt: đủ ăn đủ mặc, ít biến cố lớn. Mặt xấu: khó dư giả, gặp việc gấp là hụt, dễ phải vay mượn. Gợi ý: tách riêng một khoản không được động tới.',
    kho_khan: 'Mặt xấu: tài chính nhiều thử thách — vất vả kiếm tiền mà khó giữ, tiền vào bao nhiêu ra bấy nhiêu, có những lần mất tiền vì cho vay, đầu tư hoặc chuyện bất ngờ. Mặt tốt: bạn chịu khó và biết xoay xở khi kẹt.',
    rat_kho: 'Mặt xấu: tài chính nhiều biến động — dễ có giai đoạn túng thiếu, nợ nần, làm ăn thua lỗ hoặc tiền vào rồi lại ra hết. Mặt tốt: bạn có sức bật, nhiều lần làm lại được từ đầu. Gợi ý: quyết định tiền lớn nên hỏi người có chuyên môn.'
  },
  'Tật Ách': {
    tieuDe: 'Thực tế sức khỏe của bạn',
    rat_tot: 'Mặt tốt: sức khỏe tốt, thể chất vững, ít bệnh. Mặt xấu: vì khỏe nên hay chủ quan, làm quá sức, và bệnh dễ âm thầm tới khi có tuổi.',
    tot: 'Mặt tốt: sức khỏe khá, thể chất ổn định. Mặt xấu: vẫn có những điểm yếu lặp lại (mệt mỏi, đau vặt) dễ thành bệnh kéo dài nếu bỏ qua.',
    trung_binh: 'Sức khỏe ở mức trung bình. Mặt tốt: không có điểm yếu quá nặng. Mặt xấu: hay có giai đoạn mệt mỏi, ốm vặt, sức bền kém hơn người cùng tuổi.',
    kho_khan: 'Mặt xấu: sức khỏe có điểm yếu rõ — hay ốm vặt, có cơ quan dễ có vấn đề và hồi phục chậm. Mặt tốt: bạn sớm biết cơ thể mình nên có thể giữ gìn đúng chỗ. Gợi ý: khám định kỳ và hỏi bác sĩ khi có dấu hiệu lạ.',
    rat_kho: 'Mặt xấu: sức khỏe nhiều thử thách — thể chất yếu hơn người khác, dễ có bệnh cần điều trị lâu hoặc có giai đoạn sức khỏe đi xuống rõ. Mặt tốt: người chăm sóc sức khỏe nghiêm túc từ sớm thường giữ được thể trạng ổn lâu dài. Gợi ý: mọi dấu hiệu bất thường nên hỏi bác sĩ, không tự đoán.'
  },
  'Thiên Di': {
    tieuDe: 'Thực tế khi bạn ra ngoài',
    rat_tot: 'Mặt tốt: ra ngoài thuận, đi đâu cũng dễ gặp người giúp, làm ăn xa phát đạt. Mặt xấu: ham ra ngoài dễ xao nhãng gia đình, và thành công bên ngoài dễ khiến bạn chủ quan.',
    tot: 'Mặt tốt: đi xa thường có người giúp, làm ăn xa có triển vọng. Mặt xấu: vẫn có những chuyến đi tốn kém, mệt mỏi mà không được như kỳ vọng.',
    trung_binh: 'Việc ra ngoài ở mức trung bình. Mặt tốt: không có trở ngại lớn. Mặt xấu: đi xa có thuận có nghịch, ít quý nhân, phải tự xoay là chính.',
    kho_khan: 'Mặt xấu: ra ngoài có trở ngại rõ — đi xa dễ gặp khó, làm ăn xa không như ý, dễ bị chèn ép hoặc lừa ở nơi lạ. Mặt tốt: ở gần nhà, trong môi trường quen bạn làm tốt hơn.',
    rat_kho: 'Mặt xấu: ra ngoài nhiều thử thách — dễ gặp biến cố khi đi xa, tai nạn khi đi lại, hoặc cảm giác bơ vơ, bị cô lập nơi đất khách. Mặt tốt: bạn biết trân trọng chỗ dựa gần nhà. Gợi ý: đi xa nên có bạn đồng hành và bảo hiểm.'
  },
  'Nô Bộc': {
    tieuDe: 'Thực tế quan hệ bạn bè',
    rat_tot: 'Mặt tốt: bạn có nhiều bạn tốt, đồng nghiệp hỗ trợ, gặp quý nhân khi cần. Mặt xấu: dễ dựa vào người khác, và lòng tốt rộng rãi dễ bị vài người lợi dụng.',
    tot: 'Mặt tốt: bạn bè đáng tin, đồng nghiệp thân thiện. Mặt xấu: vẫn có người nói một đằng làm một nẻo, và giúp người không phải lúc nào cũng được đáp lại.',
    trung_binh: 'Quan hệ bạn bè ở mức trung bình. Mặt tốt: ít biến cố lớn. Mặt xấu: bạn xã giao nhiều hơn bạn thật, lúc khó ít người ở lại.',
    kho_khan: 'Mặt xấu: quan hệ bạn bè, đồng nghiệp có trở ngại rõ — dễ bị phản bội, nói xấu, thị phi nơi công sở hoặc mất tiền vì người quen. Mặt tốt: bạn học được cách nhìn người tỉnh táo.',
    rat_kho: 'Mặt xấu: quan hệ bạn bè nhiều sóng gió — dễ bị lợi dụng, bị người mình tin làm tổn thương, có lúc cô lập nơi làm việc. Mặt tốt: những người ở lại sau tất cả là bạn thật. Gợi ý: hợp tác tiền bạc với bạn bè nên có giấy tờ rõ.'
  },
  'Quan Lộc': {
    tieuDe: 'Thực tế sự nghiệp',
    rat_tot: 'Mặt tốt: sự nghiệp thuận, dễ thăng tiến, có uy tín trong ngành. Mặt xấu: lên nhanh dễ bị ganh ghét, và công việc dễ lấn hết thời gian cho gia đình, sức khỏe.',
    tot: 'Mặt tốt: công việc ổn định, có cơ hội thăng tiến, được nể trọng. Mặt xấu: vẫn có giai đoạn chững lại, va chạm cấp trên hoặc thấy công sức chưa được ghi nhận.',
    trung_binh: 'Sự nghiệp ở mức trung bình. Mặt tốt: ổn định, ít biến cố. Mặt xấu: khó đột phá, dễ đứng yên ở một vị trí khá lâu.',
    kho_khan: 'Mặt xấu: sự nghiệp nhiều thử thách — công việc hay trục trặc, đổi nghề nhiều lần mới tìm ra hướng, có giai đoạn thu nhập bấp bênh. Mặt tốt: bạn tích được kỹ năng ở nhiều mảng.',
    rat_kho: 'Mặt xấu: sự nghiệp nhiều biến động — dễ có lần mất việc, làm ăn đổ vỡ hoặc khó khăn kéo dài, cảm giác bế tắc. Mặt tốt: mỗi lần đứng dậy bạn vững hơn, và có thể rẽ sang hướng hợp mình hơn. Gợi ý: luôn giữ một nghề tay trái hoặc khoản dự phòng.'
  },
  'Điền Trạch': {
    tieuDe: 'Thực tế nhà cửa của bạn',
    rat_tot: 'Mặt tốt: có duyên với nhà đất, dễ sở hữu tài sản giá trị và giữ được của. Mặt xấu: dễ dồn vốn vào nhà đất, kẹt tiền mặt, và tài sản lớn dễ kéo theo chuyện chia chác trong nhà.',
    tot: 'Mặt tốt: nhà cửa khá thuận, tự gây dựng hoặc được thừa hưởng. Mặt xấu: vẫn có những khoản sửa chữa, giấy tờ, vay nợ làm bạn mệt.',
    trung_binh: 'Nhà cửa ở mức trung bình. Mặt tốt: không có trở ngại lớn định sẵn. Mặt xấu: phải vất vả một thời gian mới có nhà, có thể phải vay nhiều.',
    kho_khan: 'Mặt xấu: nhà cửa nhiều trở ngại — chuyển chỗ ở nhiều lần, mua nhà khó, dễ vướng giấy tờ hoặc mua phải nhà có vấn đề. Mặt tốt: bạn linh hoạt, không bị một chỗ ở trói buộc.',
    rat_kho: 'Mặt xấu: nhà cửa nhiều biến động — dễ phải ở nhờ, ở thuê nhiều năm, mất nhà đất hoặc tranh chấp tài sản. Mặt tốt: thứ bạn tự gây dựng được về sau thường giữ được lâu. Gợi ý: giao dịch nhà đất nên hỏi người có chuyên môn pháp lý.'
  },
  'Phúc Đức': {
    tieuDe: 'Thực tế phúc phần của bạn',
    rat_tot: 'Mặt tốt: phúc phần dày, dòng họ có nền tảng, đời sống tinh thần phong phú, nhiều may mắn. Mặt xấu: dễ quen được đỡ, chủ quan, và mang gánh nặng giữ tiếng cho gia đình.',
    tot: 'Mặt tốt: dòng họ có nền tảng, tinh thần ổn định, ít sóng gió lớn. Mặt xấu: vẫn có những lúc lo nghĩ, buồn phiền chuyện họ hàng.',
    trung_binh: 'Phúc phần ở mức trung bình. Mặt tốt: ít ràng buộc từ dòng họ. Mặt xấu: ít được che chở, đời sống tinh thần dễ trống trải khi bận rộn.',
    kho_khan: 'Mặt xấu: phúc phần mỏng — dòng họ ít nền tảng, lúc khó ít người đỡ, bạn phải tự lực gần như mọi việc. Mặt tốt: những gì có được là do chính bạn làm ra.',
    rat_kho: 'Mặt xấu: phúc phần nhiều thử thách — dòng họ có biến cố, ly tán, bạn phải tự gây dựng từ đầu và dễ thấy mình cô độc. Mặt tốt: bạn có sức tự lực hiếm có. Gợi ý: sống tử tế, làm việc thiện là cách vun lại nền tảng cho cả con cháu.'
  }
};

/**
 * Sinh đoạn văn Tầng 2 cho một cung — chỉ 1 đoạn duy nhất.
 */
function sinhDoanHoanCanh_(chart, pi, tenCung) {
  var P = chart.palaces;
  var palace = P[pi];
  var danhGia = danhGiaTongLuc_(palace);

  var van = TUVI_VAN_HOANCANH[tenCung];
  if (!van) return null;

  var text = van[danhGia.mucDo] || '';
  if (!text) return null;

  return {
    tieuDe: van.tieuDe || ('Hoàn cảnh thực tế — ' + tenCung),
    text: text
  };
}

/**
 * Chèn đoạn Tầng 2 vào mảng đoạn văn đã sinh (sau đoạn "Tóm tắt" — tức vị trí 2).
 */
function chenHoanCanh_(doan, chart, pi, tenCung) {
  var doanHoanCanh = sinhDoanHoanCanh_(chart, pi, tenCung);
  if (!doanHoanCanh) return doan;

  var doanMoi = [];
  doan.forEach(function(d, i) {
    doanMoi.push(d);
    if (i === 0) doanMoi.push(doanHoanCanh);
  });
  return doanMoi;
}
/* ============================================================
 *  PHẦN 2 — HÀM SINH FACTS (cho 1 cung bất kỳ)
 * ============================================================ */

/**
 * Sinh mảng facts cho một cung.
 *
 * @param {Object} chart  — kết quả của tuviLapLaSo
 * @param {Number} pi     — chỉ số cung (0–11)
 * @returns {Array}       — mảng fact (mỗi fact đủ 12 trường theo Facts.gs)
 */
function tuviSinhFactsCung_(chart, pi) {
  var facts = [];
  var P = chart.palaces;
  var C = P[pi];
  var cung = C.cung;
  var lv = factLinhVucTuCung_(cung);
  var nhom = factNhomTuCung_(cung);

  // 1. Chính tinh bản cung
  facts = facts.concat(tuviFactsChinhTinh_(C, lv, nhom));

  // 2. Phụ tinh bản cung (cát + hung + tieu)
  facts = facts.concat(tuviFactsPhuTinh_(C, lv, nhom));

  // 3. Tuần / Triệt
  facts = facts.concat(tuviFactsTuanTriet_(C, lv, nhom));

  // 4. Ngũ hành cung vs bản mệnh
  var f4 = tuviFactsNguHanhCung_(chart, pi, lv, nhom);
  if (f4) facts.push(f4);

  // 5. Tam phương tứ chính (xung chiếu + 2 tam hợp)
  facts = facts.concat(tuviFactsTamPhuongTuChinh_(chart, pi, lv, nhom));

  // 6. Nhị hợp
  facts = facts.concat(tuviFactsNhiHop_(chart, pi, lv, nhom));

  // 7. Giáp cung (2 bên kẹp)
  facts = facts.concat(tuviFactsGiapCung_(chart, pi, lv, nhom));

  // 8. Vòng sao (Tràng Sinh, Bác Sĩ, Thái Tuế)
  facts = facts.concat(tuviFactsVongSao_(C, lv, nhom));

  // Lọc bỏ fact lỗi trước khi trả về
  return locFactLoi_(facts);
}

/**
 * Map tên cung Tử Vi → lĩnh vực chuẩn trong Facts.gs
 */
function factLinhVucTuCung_(cung) {
  var map = {
    'Mệnh':       'Menh',
    'Huynh Đệ':   'Huynh De',
    'Phu Thê':    'Phu The',
    'Tử Tức':     'Tu Tuc',
    'Tài Bạch':   'Tai Bach',
    'Tật Ách':    'Tat Ach',
    'Thiên Di':   'Thien Di',
    'Nô Bộc':     'No Boc',
    'Quan Lộc':   'Quan Loc',
    'Điền Trạch': 'Dien Trach',
    'Phúc Đức':   'Phuc Duc',
    'Phụ Mẫu':    'Phu Mau'
  };
  return map[cung] || 'ALL';
}

/**
 * Map tên cung Tử Vi → nhóm chủ đề chuẩn
 */
function factNhomTuCung_(cung) {
  var map = {
    'Mệnh':       'tinh_cach',
    'Huynh Đệ':   'gia_dao',
    'Phu Thê':    'tinh_duyen',
    'Tử Tức':     'con_cai',
    'Tài Bạch':   'tai_chinh',
    'Tật Ách':    'suc_khoe',
    'Thiên Di':   'xa_hoi',
    'Nô Bộc':     'xa_hoi',
    'Quan Lộc':   'cong_danh',
    'Điền Trạch': 'tai_chinh',
    'Phúc Đức':   'tam_linh',
    'Phụ Mẫu':    'gia_dao'
  };
  return map[cung] || 'tinh_cach';
}

/**
 * Sinh facts từ chính tinh bản cung.
 */
function tuviFactsChinhTinh_(palace, lv, nhom) {
  var facts = [];
  palace.chinh.forEach(function(s) {
    var info = TUVI_FACT_CHINHTINH[s.n];
    if (!info) return;
    var heSo = s.b ? (TUVI_FACT_DOSANG_HE_SO[s.b] || 1.0) : 1.0;
    var trongSo = Math.round(info.trongSo * heSo * 10) / 10;

    // Xác định loại: Miếu/Vượng/Đắc → manh; Hãm → yeu nhẹ (nhưng vẫn là tính cách)
    var loai = 'manh';
    if (s.b === 'H') loai = 'trung'; // hãm thì vẫn có nét đó, nhưng yếu hơn

    facts.push(taoFact_(
      'Tu Vi', lv, nhom, loai,
      info.yNghia, trongSo,
      {
        nguon: 'Chính tinh ' + s.n + (s.b ? ' (' + s.b + ')' : '') + ' tại ' + palace.cung,
        doiTuong: info.doiTuong,
        tags: info.tags.slice()
      }
    ));

    // Nếu có Hóa (Lộc/Quyền/Khoa/Kỵ) → thêm fact riêng
    if (s.hoa) {
      var fHoa = tuviFactsTuHoaSao_(s.n, s.hoa, palace, lv, nhom);
      if (fHoa) facts.push(fHoa);
    }
  });
  return facts;
}

/**
 * Sinh fact cho Tứ Hóa gắn trên một sao cụ thể.
 * (Hóa Lộc/Quyền/Khoa/Kỵ khiến sao đó tỏa sáng hoặc bị chặn)
 */
/** Viết hoa chữ đầu (dùng cho câu Tứ Hóa dễ hiểu, không nêu tên sao). */
function tvhVietHoa_(t) { t = String(t || ''); return t.charAt(0).toUpperCase() + t.slice(1); }

function tuviFactsTuHoaSao_(tenSao, hoa, palace, lv, nhom) {
  var map = {
    'Lộc': {
      yNghia: 'Tài lộc và may mắn đến với lĩnh vực này, bạn được hưởng lợi tự nhiên. Mặt trái là dễ quen thuận lợi mà chủ quan, tiền đến dễ đi dễ.',
      loai: 'manh', trongSo: 1.7, tags: ['tai_loc', 'may_man']
    },
    'Quyền': {
      yNghia: 'Bạn có quyền, có uy trong lĩnh vực này, người khác nể trọng và nghe theo. Mặt trái là dễ áp đặt, tranh quyền, gây căng thẳng.',
      loai: 'manh', trongSo: 1.6, tags: ['uy_quyen', 'lanh_dao']
    },
    'Khoa': {
      yNghia: 'Danh tiếng và học vấn tỏa sáng, khi gặp khó có người giúp giải. Mặt trái là trọng danh, dễ bận lòng vì lời đánh giá.',
      loai: 'manh', trongSo: 1.5, tags: ['danh_tieng', 'hoc_van']
    },
    'Kỵ': {
      yNghia: 'Lĩnh vực này dễ gặp trở ngại, hiểu lầm, hao tổn và những chuyện day dứt khó buông. Mặt được là bạn để tâm sâu, kiên trì với nó.',
      loai: 'yeu', trongSo: 1.5, tags: ['tro_ngai', 'hieu_lam']
    }
  };
  var info = map[hoa];
  if (!info) return null;
  return taoFact_(
    'Tu Vi', lv, nhom, info.loai,
    info.yNghia, info.trongSo,
    { nguon: 'Hóa ' + hoa + ' của ' + tenSao, tags: info.tags.concat(['tu_hoa']) }
  );
}

/**
 * Sinh facts từ phụ tinh bản cung (cát + hung + tieu).
 * Lưu ý: bỏ qua các sao Hóa (đã xử lý riêng ở phần chính tinh).
 */
function tuviFactsPhuTinh_(palace, lv, nhom) {
  var facts = [];
  var dsSao = [].concat(palace.cat, palace.hung, palace.tieu);
  var daXuat = {}; // tránh trùng ý nghĩa (Tả Phù + Hữu Bật cùng câu)

  dsSao.forEach(function(s) {
    if (s.hoaOf) return; // bỏ qua Hóa sinh ra — đã có fact riêng
    var info = TUVI_FACT_PHUTINH[s.n];
    if (!info) return;

    // Tránh trùng câu — nếu sao cùng cặp (Tả Phù / Hữu Bật) chỉ xuất 1 lần
    var key = info.yNghia;
    if (daXuat[key]) return;
    daXuat[key] = true;

    facts.push(taoFact_(
      'Tu Vi', lv, nhom, info.loai,
      info.yNghia, info.trongSo,
      { nguon: 'Phụ tinh ' + s.n + ' tại ' + palace.cung, tags: info.tags }
    ));
  });
  return facts;
}

/**
 * Sinh facts từ Tuần / Triệt.
 */
function tuviFactsTuanTriet_(palace, lv, nhom) {
  var facts = [];
  var coTuan = palace.tuan, coTriet = palace.triet;
  if (!coTuan && !coTriet) return facts;

  var yNghia, tags;
  if (coTuan && coTriet) {
    yNghia = TUVI_FACT_TUAN_TRIET['ca_hai'];
    tags = ['tuan_triet', 'tien_van_kho'];
  } else if (coTriet) {
    yNghia = TUVI_FACT_TUAN_TRIET['triet'];
    tags = ['triet', 'tien_van_kho'];
  } else {
    yNghia = TUVI_FACT_TUAN_TRIET['tuan'];
    tags = ['tuan', 'tien_van_kho'];
  }

  facts.push(taoFact_(
    'Tu Vi', lv, nhom, 'trung',
    yNghia, 0.9,
    {
      nguon: 'Tuần/Triệt tại ' + palace.cung,
      thoiDiem: 'tien_van',
      tags: tags
    }
  ));
  return facts;
}

/**
 * Sinh fact từ tương quan ngũ hành cung vs bản mệnh.
 */
function tuviFactsNguHanhCung_(chart, pi, lv, nhom) {
  var menhChi = chart.info.menh;
  var pi_menh = chart.info.menh;
  if (pi === pi_menh) return null; // không nói chính cung Mệnh

  var P = chart.palaces;
  var chiHanhCung = CHI_HANH[P[pi].chi];
  var chiHanhMenh = CHI_HANH[P[pi_menh].chi];
  var qh = quanHeHanh(chiHanhCung, chiHanhMenh);
  var info = TUVI_FACT_NGUHANH_CUNG[qh];
  if (!info) return null;

  return taoFact_(
    'Tu Vi', lv, nhom, info.loai,
    info.yNghia, info.trongSo,
    { nguon: 'Ngũ hành cung ' + chiHanhCung + ' vs Mệnh ' + chiHanhMenh, tags: info.tags }
  );
}

/**
 * Sinh facts từ TAM PHƯƠNG TỨ CHÍNH (xung chiếu + 2 tam hợp).
 * Nguyên tắc: nếu cung đối/ tam hợp rõ rệt tốt hoặc yếu → sinh fact.
 */
function tuviFactsTamPhuongTuChinh_(chart, pi, lv, nhom) {
  var facts = [];
  var P = chart.palaces;
  var xc = mod12(pi + 6), th1 = mod12(pi + 4), th2 = mod12(pi + 8);
  var tenLv = function(p) { return LG_LINH_VUC[P[p].cung] || P[p].cung; };

  // 1. Xung chiếu (đối cung)
  var dxc = P[xc].diem10 != null ? P[xc].diem10 : chuanHoa10_(P[xc].diem);
  if (dxc >= 6.5) {
    facts.push(taoFact_('Tu Vi', lv, nhom, 'manh',
      'Cung đối diện — nói về ' + tenLv(xc) + ' — rất mạnh mẽ. Đây là nguồn lực lớn bạn có thể dựa vào; mặt trái là dễ trông vào đó mà ít tự gây dựng.',
      Math.round((dxc - 5) * 0.6 * 10) / 10,
      { nguon: 'Xung chiếu mạnh (' + dxc + '/10)', tags: ['xung_chieu_manh'] }));
  } else if (dxc <= 3.5) {
    facts.push(taoFact_('Tu Vi', lv, nhom, 'yeu',
      'Cung đối diện — nói về ' + tenLv(xc) + ' — khá yếu. Ở mảng này bạn ít được hỗ trợ, gặp khó thường phải tự xoay một mình.',
      Math.round((5 - dxc) * 0.5 * 10) / 10,
      { nguon: 'Xung chiếu yếu (' + dxc + '/10)', tags: ['xung_chieu_yeu'] }));
  }

  // 2. Tam hợp (gộp 2 cung)
  var dt1 = P[th1].diem10 != null ? P[th1].diem10 : chuanHoa10_(P[th1].diem);
  var dt2 = P[th2].diem10 != null ? P[th2].diem10 : chuanHoa10_(P[th2].diem);
  var dtb = (dt1 + dt2) / 2;
  if (dtb >= 6.5) {
    facts.push(taoFact_('Tu Vi', lv, nhom, 'manh',
      'Hai cung tam hợp — nói về ' + tenLv(th1) + ' và ' + tenLv(th2) + ' — đều tốt. Bạn có hai nguồn nâng đỡ đáng kể trong cuộc sống.',
      Math.round((dtb - 5) * 0.5 * 10) / 10,
      { nguon: 'Tam hợp mạnh (' + dt1 + ' + ' + dt2 + ')', tags: ['tam_hop_manh'] }));
  } else if (dtb <= 4) {
    facts.push(taoFact_('Tu Vi', lv, nhom, 'yeu',
      'Hai cung tam hợp — nói về ' + tenLv(th1) + ' và ' + tenLv(th2) + ' — khá yếu. Hai mảng này ít đỡ được bạn, dễ kéo theo trục trặc dây chuyền khi một việc hỏng.',
      Math.round((5 - dtb) * 0.4 * 10) / 10,
      { nguon: 'Tam hợp yếu (' + dt1 + ' + ' + dt2 + ')', tags: ['tam_hop_yeu'] }));
  }

  return facts;
}

/**
 * Sinh facts từ NHỊ HỢP (cung lục hợp) — ảnh hưởng ngầm.
 */
function tuviFactsNhiHop_(chart, pi, lv, nhom) {
  var facts = [];
  var P = chart.palaces;
  var nh = mod12(1 - pi);
  var dnh = P[nh].diem10 != null ? P[nh].diem10 : chuanHoa10_(P[nh].diem);
  var tenLv = LG_LINH_VUC[P[nh].cung] || P[nh].cung;

  if (dnh >= 6.5) {
    facts.push(taoFact_('Tu Vi', lv, nhom, 'manh',
      'Cung nhị hợp — nói về ' + tenLv + ' — khá tốt. Đây là nguồn trợ lực âm thầm nhưng bền bỉ mà bạn chưa chắc đã nhận ra.',
      Math.round((dnh - 5) * 0.4 * 10) / 10,
      { nguon: 'Nhị hợp mạnh (' + dnh + '/10)', tags: ['nhi_hop_manh'] }));
  } else if (dnh <= 4) {
    facts.push(taoFact_('Tu Vi', lv, nhom, 'yeu',
     'Cung nhị hợp — nói về ' + tenLv + ' — khá yếu. Có yếu tố âm thầm đang kéo lùi bạn từ phía ' + tenLv + ', thường khó nhận ra cho tới khi đã gây hao tổn.',
      Math.round((5 - dnh) * 0.35 * 10) / 10,
      { nguon: 'Nhị hợp yếu (' + dnh + '/10)', tags: ['nhi_hop_yeu'] }));
  }
  return facts;
}

/**
 * Sinh facts từ GIÁP CUNG (2 cung bên cạnh kẹp).
 */
function tuviFactsGiapCung_(chart, pi, lv, nhom) {
  var facts = [];
  var P = chart.palaces;
  var gl = mod12(pi - 1), gr = mod12(pi + 1);
  var catGood = ['Tả Phù','Hữu Bật','Văn Xương','Văn Khúc','Thiên Khôi','Thiên Việt','Hóa Lộc','Hóa Quyền','Hóa Khoa','Lộc Tồn'];
  var hungBad = ['Kình Dương','Đà La','Hỏa Tinh','Linh Tinh','Địa Không','Địa Kiếp','Hóa Kỵ'];

  function saoTrongCung_(p) {
    return [].concat(P[p].chinh, P[p].cat, P[p].hung, P[p].tieu).map(function(s){ return s.n; });
  }
  var saoL = saoTrongCung_(gl), saoR = saoTrongCung_(gr);
  var catL = catGood.filter(function(s){ return saoL.indexOf(s) >= 0; });
  var catR = catGood.filter(function(s){ return saoR.indexOf(s) >= 0; });
  var hungL = hungBad.filter(function(s){ return saoL.indexOf(s) >= 0; });
  var hungR = hungBad.filter(function(s){ return saoR.indexOf(s) >= 0; });

  if (catL.length && catR.length) {
    facts.push(taoFact_('Tu Vi', lv, nhom, 'manh',
      'Cung này được hai cung bên cạnh "kẹp" bằng những yếu tố tốt — dấu hiệu được nâng đỡ từ hai phía, có quý nhân bảo vệ.',
      1.4, { nguon: 'Giáp cát: ' + catL.join(',') + ' / ' + catR.join(','), tags: ['giap_cat'] }));
  } else if (hungL.length && hungR.length) {
    facts.push(taoFact_('Tu Vi', lv, nhom, 'yeu',
      'Cung này bị hai cung bên cạnh "kẹp" bằng những yếu tố xấu — dấu hiệu bị kìm hãm, chèn ép từ hai phía, khó phát huy và dễ bị người khác gây khó.',
      1.3, { nguon: 'Giáp sát: ' + hungL.join(',') + ' / ' + hungR.join(','), tags: ['giap_sat'] }));
  } else if (catL.length || catR.length) {
    facts.push(taoFact_('Tu Vi', lv, nhom, 'manh',
      'Có một cung bên cạnh mang yếu tố tốt nâng đỡ — bạn nhận được trợ lực từ một phía, nhưng không đầy đủ và không phải lúc nào cũng có.',
      0.7, { nguon: 'Giáp nửa cát', tags: ['giap_nua_cat'] }));
  } else if (hungL.length || hungR.length) {
    facts.push(taoFact_('Tu Vi', lv, nhom, 'yeu',
      'Có một cung bên cạnh mang yếu tố xấu — có thể có người hoặc hoàn cảnh âm thầm gây khó cho bạn.',
      0.7, { nguon: 'Giáp nửa hung', tags: ['giap_nua_hung'] }));
  }

  var tuanL = P[gl].tuan || P[gl].triet, tuanR = P[gr].tuan || P[gr].triet;
  if (tuanL && tuanR) {
    facts.push(taoFact_('Tu Vi', lv, nhom, 'trung',
      'Bạn bị "bọc kín" hai bên, ít được nhưng cũng ít mất.',
      0.9, { nguon: 'Giáp Tuần/Triệt hai bên', tags: ['giap_tuan_triet'] }));
  } else if (tuanL || tuanR) {
    facts.push(taoFact_('Tu Vi', lv, nhom, 'trung',
      'Ảnh hưởng từ hai phía không đồng đều, một bên dễ bị hụt, chậm.',
      0.7, { nguon: 'Giáp một bên Tuần/Triệt', tags: ['giap_mot_ben'] }));
  }
  return facts;
}

/**
 * Sinh facts từ 3 vòng sao: Tràng Sinh, Bác Sĩ, Thái Tuế.
 */
/**
 * Hàm sinh facts riêng cho cung PHU THÊ.
 * Chủ thể là người phối ngẫu, không phải bản thân.
 * Tái dùng các hàm facts chung: Tuần/Triệt, TPTC, nhị hợp, giáp cung, vòng sao.
 */
/**
 * Hàm sinh facts riêng cho cung TÀI BẠCH.
 * Chủ thể là BẢN THÂN — tập trung vào tiền bạc.
 */
/**
 * Hàm sinh facts riêng cho cung QUAN LỘC.
 * Chủ thể là BẢN THÂN — tập trung sự nghiệp, công danh.
 */
function tuviSinhFactsQuanLoc_(chart, pi) {
  var facts = [];
  var P = chart.palaces;
  var C = P[pi];
  var lv = 'Quan Loc';
  var nhom = 'cong_danh';

  // 1. Chính tinh Quan Lộc
  C.chinh.forEach(function(s) {
    var info = TUVI_FACT_QUANLOC_CHINHTINH[s.n];
    if (!info) return;
    var heSo = s.b ? (TUVI_FACT_DOSANG_HE_SO[s.b] || 1.0) : 1.0;
    var trongSo = Math.round(info.trongSo * heSo * 10) / 10;
    var loai = (s.b === 'H') ? 'trung' : 'manh';
    facts.push(taoFact_(
      'Tu Vi', lv, nhom, loai,
      info.yNghia, trongSo,
      {
        nguon: 'Chính tinh ' + s.n + (s.b ? ' (' + s.b + ')' : '') + ' tại Quan Lộc',
        doiTuong: 'ban_than',
        tags: info.tags.slice()
      }
    ));
    if (s.hoa) {
      var fHoa = tuviFactsTuHoaSao_(s.n, s.hoa, C, lv, nhom);
      if (fHoa) facts.push(fHoa);
    }
  });

  // 2. Phụ tinh Quan Lộc
  var dsSao = [].concat(C.cat, C.hung, C.tieu);
  var daXuat = {};
  dsSao.forEach(function(s) {
    if (s.hoaOf) return;
    var info = TUVI_FACT_QUANLOC_PHUTINH[s.n];
    if (!info) return;
    var key = info.yNghia.slice(0, 30);
    if (daXuat[key]) return;
    daXuat[key] = true;
    facts.push(taoFact_(
      'Tu Vi', lv, nhom, info.loai,
      info.yNghia, info.trongSo,
      { nguon: 'Phụ tinh ' + s.n + ' tại Quan Lộc', doiTuong: 'ban_than', tags: info.tags }
    ));
  });

  // 3-7. Tái dùng các hàm chung
  facts = facts.concat(tuviFactsTuanTriet_(C, lv, nhom));
  facts = facts.concat(tuviFactsTamPhuongTuChinh_(chart, pi, lv, nhom));
  facts = facts.concat(tuviFactsNhiHop_(chart, pi, lv, nhom));
  facts = facts.concat(tuviFactsGiapCung_(chart, pi, lv, nhom));
  facts = facts.concat(tuviFactsVongSao_(C, lv, nhom));

  return locFactLoi_(facts);
}

function tuviSinhFactsTaiBach_(chart, pi) {
  var facts = [];
  var P = chart.palaces;
  var C = P[pi];
  var lv = 'Tai Bach';
  var nhom = 'tai_chinh';

  // 1. Chính tinh Tài Bạch
  C.chinh.forEach(function(s) {
    var info = TUVI_FACT_TAIBACH_CHINHTINH[s.n];
    if (!info) return;
    var heSo = s.b ? (TUVI_FACT_DOSANG_HE_SO[s.b] || 1.0) : 1.0;
    var trongSo = Math.round(info.trongSo * heSo * 10) / 10;
    var loai = (s.b === 'H') ? 'trung' : 'manh';
    facts.push(taoFact_(
      'Tu Vi', lv, nhom, loai,
      info.yNghia, trongSo,
      {
        nguon: 'Chính tinh ' + s.n + (s.b ? ' (' + s.b + ')' : '') + ' tại Tài Bạch',
        doiTuong: 'ban_than',
        tags: info.tags.slice()
      }
    ));
    if (s.hoa) {
      var fHoa = tuviFactsTuHoaSao_(s.n, s.hoa, C, lv, nhom);
      if (fHoa) facts.push(fHoa);
    }
  });

  // 2. Phụ tinh Tài Bạch
  var dsSao = [].concat(C.cat, C.hung, C.tieu);
  var daXuat = {};
  dsSao.forEach(function(s) {
    if (s.hoaOf) return;
    var info = TUVI_FACT_TAIBACH_PHUTINH[s.n];
    if (!info) return;
    var key = info.yNghia.slice(0, 30);
    if (daXuat[key]) return;
    daXuat[key] = true;
    facts.push(taoFact_(
      'Tu Vi', lv, nhom, info.loai,
      info.yNghia, info.trongSo,
      { nguon: 'Phụ tinh ' + s.n + ' tại Tài Bạch', doiTuong: 'ban_than', tags: info.tags }
    ));
  });

  // 3-7. Tái dùng các hàm chung (Tuần/Triệt, TPTC, nhị hợp, giáp, vòng sao)
  facts = facts.concat(tuviFactsTuanTriet_(C, lv, nhom));
  facts = facts.concat(tuviFactsTamPhuongTuChinh_(chart, pi, lv, nhom));
  facts = facts.concat(tuviFactsNhiHop_(chart, pi, lv, nhom));
  facts = facts.concat(tuviFactsGiapCung_(chart, pi, lv, nhom));
  facts = facts.concat(tuviFactsVongSao_(C, lv, nhom));

  return locFactLoi_(facts);
}

function tuviSinhFactsPhuThe_(chart, pi) {
  var facts = [];
  var P = chart.palaces;
  var C = P[pi];
  var lv = 'Phu The';
  var nhom = 'tinh_duyen';

  // 1. Chính tinh Phu Thê — bảng riêng
  C.chinh.forEach(function(s) {
    var info = TUVI_FACT_PHUTHE_CHINHTINH[s.n];
    if (!info) return;
    var heSo = s.b ? (TUVI_FACT_DOSANG_HE_SO[s.b] || 1.0) : 1.0;
    var trongSo = Math.round(info.trongSo * heSo * 10) / 10;
    var loai = (s.b === 'H') ? 'trung' : 'manh';
    facts.push(taoFact_(
      'Tu Vi', lv, nhom, loai,
      info.yNghia, trongSo,
      {
        nguon: 'Chính tinh ' + s.n + (s.b ? ' (' + s.b + ')' : '') + ' tại Phu Thê',
        doiTuong: 'phoi_ngau',
        tags: info.tags.slice()
      }
    ));

    // Tứ Hóa gắn trên sao
    if (s.hoa) {
      var fHoa = tuviFactsTuHoaSao_(s.n, s.hoa, C, lv, nhom);
      if (fHoa) { fHoa.doiTuong = 'phoi_ngau'; facts.push(fHoa); }
    }
  });

  // 2. Phụ tinh Phu Thê — bảng riêng
  var dsSao = [].concat(C.cat, C.hung, C.tieu);
  var daXuat = {};
  dsSao.forEach(function(s) {
    if (s.hoaOf) return;
    var info = TUVI_FACT_PHUTHE_PHUTINH[s.n];
    if (!info) return;
    var key = info.yNghia.slice(0, 30);
    if (daXuat[key]) return;
    daXuat[key] = true;
    facts.push(taoFact_(
      'Tu Vi', lv, nhom, info.loai,
      info.yNghia, info.trongSo,
      {
        nguon: 'Phụ tinh ' + s.n + ' tại Phu Thê',
        doiTuong: 'phoi_ngau',
        tags: info.tags
      }
    ));
  });

  // 3. Tuần / Triệt — dùng chung nhưng đổi doiTuong
  var ft = tuviFactsTuanTriet_(C, lv, nhom);
  ft.forEach(function(f) { f.doiTuong = 'phoi_ngau'; });
  facts = facts.concat(ft);

  // 4. Tam phương tứ chính — dùng chung
  facts = facts.concat(tuviFactsTamPhuongTuChinh_(chart, pi, lv, nhom));

  // 5. Nhị hợp — dùng chung
  facts = facts.concat(tuviFactsNhiHop_(chart, pi, lv, nhom));

  // 6. Giáp cung — dùng chung
  facts = facts.concat(tuviFactsGiapCung_(chart, pi, lv, nhom));

  // 7. Vòng sao — dùng chung
  facts = facts.concat(tuviFactsVongSao_(C, lv, nhom));

  return locFactLoi_(facts);
}

function tuviFactsVongSao_(palace, lv, nhom) {
  var facts = [];

  // Vòng Tràng Sinh
  if (palace.trangSinh && TUVI_FACT_TRANG_SINH[palace.trangSinh]) {
    var ts = TUVI_FACT_TRANG_SINH[palace.trangSinh];
    facts.push(taoFact_('Tu Vi', lv, nhom, ts.loai, ts.yNghia, ts.trongSo,
      { nguon: 'Vòng Tràng Sinh: ' + palace.trangSinh, tags: ['trang_sinh'] }));
  }

  // Vòng Bác Sĩ — chỉ sinh fact nếu trọng số đủ mạnh (≥ 0.7)
  if (palace.bacSi && TUVI_FACT_BAC_SI[palace.bacSi]) {
    var bs = TUVI_FACT_BAC_SI[palace.bacSi];
    if (bs.trongSo >= 0.7) {
      facts.push(taoFact_('Tu Vi', lv, nhom, bs.loai, bs.yNghia, bs.trongSo,
        { nguon: 'Vòng Bác Sĩ: ' + palace.bacSi, tags: ['bac_si'] }));
    }
  }

  // Vòng Thái Tuế — chỉ sinh fact nếu trọng số ≥ 0.7
  if (palace.thaiTue && TUVI_FACT_THAI_TUE[palace.thaiTue]) {
    var tt = TUVI_FACT_THAI_TUE[palace.thaiTue];
    if (tt.trongSo >= 0.7) {
      facts.push(taoFact_('Tu Vi', lv, nhom, tt.loai, tt.yNghia, tt.trongSo,
        { nguon: 'Vòng Thái Tuế: ' + palace.thaiTue, tags: ['thai_tue'] }));
    }
  }
  return facts;
}

/* ============================================================
 *  PHẦN 3 — SINH ĐOẠN VĂN TỪ FACTS
 *  (Dùng cho Tầng 3 — Narrative. Các hàm này nhận mảng facts
 *   và trả về câu văn dễ hiểu, sẵn sàng để render.)
 * ============================================================ */

/**
 * Sinh đoạn "Điểm mạnh nổi bật" — lấy top facts mạnh.
 * Ưu tiên: chính tinh + Hóa Lộc/Quyền/Khoa + cát tinh lớn.
 */
/**
 * Phân loại một fact vào 1 trong 3 nhóm duy nhất:
 *   - 'tinh_cach'  : chính tinh, phụ tinh bản cung, Tuần/Triệt, ngũ hành cung
 *   - 'anh_huong'  : xung chiếu, tam hợp, nhị hợp, giáp cung
 *   - 'dac_biet'   : Tứ Hóa, vòng Tràng Sinh / Bác Sĩ / Thái Tuế
 * Mỗi fact chỉ thuộc đúng 1 nhóm — tránh lặp giữa các đoạn văn.
 */
function factThuocNhom_(f, nhom) {
  if (!f || !f.tags) return false;
  var t = f.tags;

  var laDacBiet = t.indexOf('tu_hoa') >= 0
    || t.indexOf('trang_sinh') >= 0
    || t.indexOf('bac_si') >= 0
    || t.indexOf('thai_tue') >= 0;

  var laAnhHuong = t.some(function(x) {
    return x.indexOf('xung_chieu') === 0
      || x.indexOf('tam_hop') === 0
      || x.indexOf('nhi_hop') === 0
      || x.indexOf('giap_') === 0;
  });

  if (nhom === 'dac_biet') return laDacBiet;
  if (nhom === 'anh_huong') return laAnhHuong && !laDacBiet;
  if (nhom === 'tinh_cach') return !laDacBiet && !laAnhHuong;
  return false;
}

/**
 * Sinh đoạn "Điểm mạnh nổi bật" — chỉ lấy fact nhóm "tính cách".
 */
function tuviSinhDoanDiemManh_(facts) {
  var manh = (facts || []).filter(function(f) {
    return f.loai === 'manh' && factThuocNhom_(f, 'tinh_cach');
  });
  if (!manh.length) return '';
  manh.sort(function(a, b) { return b.trongSo - a.trongSo; });
  var daXuat = {}, ds = [];
  manh.forEach(function(f) {
    if (ds.length >= 5) return;
    var key = f.yNghia.slice(0, 30);
    if (daXuat[key]) return;
    daXuat[key] = true;
    ds.push(f.yNghia);
  });
  return ds.join(' ');
}

/**
 * Sinh đoạn "Điểm cần lưu ý" — chỉ lấy fact nhóm "tính cách".
 */
function tuviSinhDoanDiemYeu_(facts) {
  var yeu = (facts || []).filter(function(f) {
    return f.loai === 'yeu' && factThuocNhom_(f, 'tinh_cach');
  });
  if (!yeu.length) return '';
  yeu.sort(function(a, b) { return b.trongSo - a.trongSo; });
  var daXuat = {}, ds = [];
  yeu.forEach(function(f) {
    if (ds.length >= 4) return;
    var key = f.yNghia.slice(0, 30);
    if (daXuat[key]) return;
    daXuat[key] = true;
    ds.push(f.yNghia);
  });
  return ds.join(' ');
}

/**
 * Sinh đoạn "Ảnh hưởng từ các cung xung quanh" — chỉ lấy fact nhóm "ảnh hưởng".
 */
function tuviSinhDoanAnhHuong_(facts) {
  var ds = (facts || []).filter(function(f) { return factThuocNhom_(f, 'anh_huong'); });
  if (!ds.length) return '';
  var thuTu = [
    'xung_chieu_manh', 'xung_chieu_yeu',
    'tam_hop_manh', 'tam_hop_yeu',
    'nhi_hop_manh', 'nhi_hop_yeu',
    'giap_cat', 'giap_sat',
    'giap_nua_cat', 'giap_nua_hung',
    'giap_tuan_triet', 'giap_mot_ben'
  ];
  function uuTien_(f) {
    if (!f.tags) return 999;
    for (var i = 0; i < thuTu.length; i++) {
      if (f.tags.indexOf(thuTu[i]) >= 0) return i;
    }
    return 999;
  }
  ds.sort(function(a, b) { return uuTien_(a) - uuTien_(b); });
  return ds.map(function(f) { return f.yNghia; }).join(' ');
}

/**
 * Sinh đoạn "Những yếu tố đặc biệt" — chỉ lấy fact nhóm "đặc biệt".
 * Sắp xếp: Tứ Hóa trước, vòng sao sau (theo trọng số giảm).
 */
function tuviSinhDoanDacBiet_(facts) {
  var ds = (facts || []).filter(function(f) { return factThuocNhom_(f, 'dac_biet'); });
  if (!ds.length) return '';
  ds.sort(function(a, b) {
    var aHoa = (a.tags && a.tags.indexOf('tu_hoa') >= 0) ? 1 : 0;
    var bHoa = (b.tags && b.tags.indexOf('tu_hoa') >= 0) ? 1 : 0;
    if (aHoa !== bHoa) return bHoa - aHoa;
    return b.trongSo - a.trongSo;
  });
  return ds.map(function(f) { return f.yNghia; }).join(' ');
}


/**
 * Sinh đoạn "Đầu đời và hậu vận" — lấy facts có thoiDiem tiền vận.
 * (Bổ trợ cho đoạn gốc từ kho văn theo nhóm tính cách.)
 */
function tuviSinhDoanThoiDiem_(facts, thoiDiem) {
  var ds = (facts || []).filter(function(f) {
    return f.thoiDiem === thoiDiem;
  });
  if (!ds.length) return '';
  return ds.map(function(f) { return f.yNghia; }).join(' ');
}

/* ============================================================
 *  SINH VĂN CHO CUNG PHU THÊ — 7 đoạn
 *  (Tóm tắt / Người bạn đời / Kiểu hôn nhân / Điều lưu ý
 *   / Ảnh hưởng / Yếu tố đặc biệt / Lời khuyên)
 * ============================================================ */

/**
 * Xác định nhóm tính cách Phu Thê (A–F) từ chính tinh.
 */
function xacDinhNhomPhuThe_(palace) {
  if (!palace.chinh.length) return 'F';
  var sao = palace.chinh.map(function(s){ return s.n; });
  if (sao.some(function(s){ return ['Tử Vi','Thái Dương','Thiên Tướng'].indexOf(s) >= 0; })) return 'A';
  if (sao.some(function(s){ return ['Thiên Cơ','Cự Môn','Thái Âm'].indexOf(s) >= 0; })) return 'B';
  if (sao.some(function(s){ return ['Vũ Khúc','Thiên Phủ','Thiên Đồng','Liêm Trinh'].indexOf(s) >= 0; })) return 'C';
  if (sao.some(function(s){ return ['Thất Sát','Phá Quân'].indexOf(s) >= 0; })) return 'D';
  if (sao.some(function(s){ return ['Tham Lang','Thiên Lương'].indexOf(s) >= 0; })) return 'E';
  return 'F';
}

/**
 * Dịch lại câu văn của một số facts từ chủ thể "bạn" → "bạn đời/hôn nhân".
 * Chỉ dịch facts từ TPTC, nhị hợp, giáp cung, Tuần/Triệt.
 * Facts chính tinh / phụ tinh Phu Thê đã đúng chủ thể — không đụng.
 */
function tuviDichFactsPhuThe_(facts) {
  var out = [];
  facts.forEach(function(f) {
    var moi = {};
    for (var k in f) moi[k] = f[k];

    if (moi.doiTuong === 'phoi_ngau') { out.push(moi); return; }

    var t = (f.tags || []).join(' ');
    if (t.indexOf('xung_chieu_manh') >= 0) {
      moi.yNghia = moi.yNghia.replace('nguồn lực lớn bạn có thể dựa vào', 'nguồn lực lớn mà hôn nhân của bạn có thể dựa vào');
    } else if (t.indexOf('xung_chieu_yeu') >= 0) {
      moi.yNghia = moi.yNghia.replace('Ở mảng này bạn ít được hỗ trợ', 'Ở mảng này hôn nhân của bạn ít được hỗ trợ');
    } else if (t.indexOf('tam_hop_manh') >= 0) {
      moi.yNghia = moi.yNghia.replace('Bạn có hai nguồn nâng đỡ đáng kể trong cuộc sống', 'Hôn nhân của bạn được hai phía nâng đỡ đáng kể');
    } else if (t.indexOf('tam_hop_yeu') >= 0) {
      moi.yNghia = moi.yNghia.replace('ít đỡ được bạn', 'ít đỡ được hôn nhân của bạn');
    } else if (t.indexOf('nhi_hop_manh') >= 0) {
      moi.yNghia = moi.yNghia.replace('mà bạn chưa chắc đã nhận ra', 'mà bạn chưa chắc đã nhận ra — ảnh hưởng tốt đến hôn nhân');
    } else if (t.indexOf('nhi_hop_yeu') >= 0) {
      moi.yNghia = moi.yNghia.replace('đang kéo lùi bạn từ phía', 'đang kéo lùi hôn nhân của bạn từ phía');
    } else if (t.indexOf('giap_cat') >= 0) {
      moi.yNghia = moi.yNghia.replace('dấu hiệu được nâng đỡ từ hai phía', 'hôn nhân của bạn được nâng đỡ từ hai phía');
    } else if (t.indexOf('giap_sat') >= 0) {
      moi.yNghia = moi.yNghia.replace('dấu hiệu bị kìm hãm', 'hôn nhân của bạn bị kìm hãm');
    } else if (t.indexOf('giap_nua_cat') >= 0) {
      moi.yNghia = moi.yNghia.replace('bạn nhận được trợ lực từ một phía', 'hôn nhân của bạn nhận được trợ lực từ một phía');
    } else if (t.indexOf('giap_nua_hung') >= 0) {
      moi.yNghia = moi.yNghia.replace('gây khó cho bạn', 'gây khó cho hôn nhân của bạn');
    } else if (t.indexOf('giap_tuan_triet') >= 0) {
      moi.yNghia = moi.yNghia.replace('Bạn bị "bọc kín" hai bên', 'Hôn nhân của bạn bị "bọc kín" hai bên');
    } else if (t.indexOf('giap_mot_ben') >= 0) {
      moi.yNghia = moi.yNghia.replace('Ảnh hưởng từ hai phía không đồng đều', 'Ảnh hưởng đến hôn nhân từ hai phía không đồng đều');
    } else if (t.indexOf('tuan') >= 0 || t.indexOf('triet') >= 0) {
      moi.yNghia = moi.yNghia.replace('Lĩnh vực này có xu hướng bị cản ở giai đoạn đầu', 'Hôn nhân có xu hướng bị cản ở giai đoạn đầu').replace('Tuổi trẻ có xu hướng gặp khó rõ ở lĩnh vực này', 'Giai đoạn đầu hôn nhân có xu hướng gặp khó rõ');
    }

    out.push(moi);
  });
  return out;
}

/**
 * Sinh 7 đoạn văn dễ hiểu cho cung Phu Thê.
 */
function sinhVanCungPhuThe_(chart, pi) {
  var P = chart.palaces;
  var palace = P[pi];

  var nhom = xacDinhNhomPhuThe_(palace);
  var van = TUVI_VAN_PHUTHE[nhom] || TUVI_VAN_PHUTHE['F'];

  // Sinh facts gốc + dịch chủ thể
  var factsGoc = tuviSinhFactsPhuThe_(chart, pi);
  var facts = tuviDichFactsPhuThe_(factsGoc);

  var doan = [];

  // === 1. TÓM TẮT ===
  doan.push({ tieuDe: 'Tóm tắt', text: van.tomTat });

  // === 2. NGƯỜI BẠN ĐỜI ===
  var textNBD = van.nguoiBanDoi;
  var chinhFacts = facts.filter(function(f) {
    return f.nguon && f.nguon.indexOf('Chính tinh') === 0;
  }).sort(function(a, b){ return b.trongSo - a.trongSo; });
  if (chinhFacts.length) {
    textNBD += ' Cụ thể: ' + chinhFacts.slice(0, 2).map(function(f){ return f.yNghia; }).join(' ');
  }
  doan.push({ tieuDe: 'Người bạn đời của bạn', text: textNBD });

  // === 3. KIỂU HÔN NHÂN ===
  doan.push({ tieuDe: 'Kiểu hôn nhân bạn sẽ có', text: van.kieuHonNhan });

  // === 4. ĐIỀU CẦN LƯU Ý ===
  var textLuuY = van.dieuLuuY;
  var yeuFacts = facts.filter(function(f) {
    return f.loai === 'yeu' && f.nguon && f.nguon.indexOf('Phụ tinh') === 0;
  }).sort(function(a, b){ return b.trongSo - a.trongSo; });
  if (yeuFacts.length) {
    textLuuY += ' Ngoài ra: ' + yeuFacts.slice(0, 3).map(function(f){ return f.yNghia; }).join(' ');
  }
  doan.push({ tieuDe: 'Điều cần lưu ý trong tình cảm', text: textLuuY });

  // === 5. ẢNH HƯỞNG TỪ CÁC CUNG XUNG QUANH ===
  var anhHuong = facts.filter(function(f) {
    var t = f.tags || [];
    return t.some(function(x) {
      return x.indexOf('xung_chieu') === 0 || x.indexOf('tam_hop') === 0
        || x.indexOf('nhi_hop') === 0 || x.indexOf('giap_') === 0;
    });
  });
  if (anhHuong.length) {
    doan.push({ tieuDe: 'Ảnh hưởng từ các cung xung quanh', text: anhHuong.map(function(f){ return f.yNghia; }).join(' ') });
  }

  // === 6. YẾU TỐ ĐẶC BIỆT ===
  var dacBiet = facts.filter(function(f) {
    var t = f.tags || [];
    return t.indexOf('tu_hoa') >= 0 || t.indexOf('trang_sinh') >= 0
      || t.indexOf('bac_si') >= 0 || t.indexOf('thai_tue') >= 0;
  });
  if (dacBiet.length) {
    doan.push({ tieuDe: 'Yếu tố đặc biệt của cung này', text: dacBiet.map(function(f){ return f.yNghia; }).join(' ') });
  }

  // === 7. LỜI KHUYÊN ===
  doan.push({ tieuDe: 'Lời khuyên cụ thể', text: '', list: van.loiKhuyen.slice() });

  return doan;
}
/* ============================================================
 *  SINH VĂN CHO CUNG TÀI BẠCH — 6 đoạn
 *  (Tóm tắt / Cách kiếm tiền / Cách giữ tiền / Cơ hội 
 *   / Rủi ro / Lời khuyên)
 * ============================================================ */

/**
 * Xác định nhóm tính cách Tài Bạch (A–F) từ chính tinh.
 */
function xacDinhNhomTaiBach_(palace) {
  if (!palace.chinh.length) return 'F';
  var sao = palace.chinh.map(function(s){ return s.n; });
  if (sao.some(function(s){ return ['Tử Vi','Vũ Khúc','Thiên Phủ','Thái Âm'].indexOf(s) >= 0; })) return 'A';
  if (sao.some(function(s){ return ['Thiên Cơ','Cự Môn','Thiên Tướng'].indexOf(s) >= 0; })) return 'B';
  if (sao.some(function(s){ return ['Thiên Đồng','Thái Dương','Thiên Lương','Liêm Trinh'].indexOf(s) >= 0; })) return 'C';
  if (sao.some(function(s){ return ['Thất Sát','Phá Quân','Tham Lang'].indexOf(s) >= 0; })) return 'D';
  return 'C';
}

/**
 * Sinh 6 đoạn văn dễ hiểu cho cung Tài Bạch.
 */
function sinhVanCungTaiBach_(chart, pi) {
  var P = chart.palaces;
  var palace = P[pi];

  var nhom = xacDinhNhomTaiBach_(palace);
  var van = TUVI_VAN_TAIBACH[nhom] || TUVI_VAN_TAIBACH['F'];

  var facts = tuviSinhFactsTaiBach_(chart, pi);
  var doan = [];

  // === 1. TÓM TẮT ===
  doan.push({ tieuDe: 'Tóm tắt', text: van.tomTat });

  // === 2. CÁCH BẠN KIẾM TIỀN ===
  var textKiem = van.cachKiem;
  var factsKiem = facts.filter(function(f) {
    return f.loai === 'manh' && f.nguon && f.nguon.indexOf('Chính tinh') === 0;
  }).sort(function(a, b){ return b.trongSo - a.trongSo; });
  if (factsKiem.length) {
    textKiem += ' Cụ thể: ' + factsKiem.slice(0, 2).map(function(f){ return f.yNghia; }).join(' ');
  }
  doan.push({ tieuDe: 'Cách bạn kiếm tiền', text: textKiem });

  // === 3. CÁCH BẠN GIỮ TIỀN ===
  var textGiu = van.cachGiu;
  var factsGiu = facts.filter(function(f) {
    return f.nguon && (f.nguon.indexOf('Lộc Tồn') >= 0 || f.nguon.indexOf('Thiên Phủ') >= 0
      || f.nguon.indexOf('Đại Hao') >= 0 || f.nguon.indexOf('Tiểu Hao') >= 0);
  });
  if (factsGiu.length) {
    textGiu += ' Ngoài ra: ' + factsGiu.slice(0, 2).map(function(f){ return f.yNghia; }).join(' ');
  }
  doan.push({ tieuDe: 'Cách bạn giữ tiền', text: textGiu });

  // === 4. CƠ HỘI TÀI CHÍNH ===
  var textCoHoi = van.coHoi;
  var factsCoHoi = facts.filter(function(f) {
    var t = f.tags || [];
    return t.some(function(x) {
      return x.indexOf('xung_chieu_manh') === 0 || x.indexOf('tam_hop_manh') === 0 
        || x.indexOf('nhi_hop_manh') === 0 || x.indexOf('giap_cat') === 0;
    });
  });
  if (factsCoHoi.length) {
    textCoHoi += ' Các yếu tố hỗ trợ: ' + factsCoHoi.map(function(f){ return f.yNghia; }).join(' ');
  }
  doan.push({ tieuDe: 'Cơ hội tài chính', text: textCoHoi });

  // === 5. RỦI RO TÀI CHÍNH CẦN TRÁNH ===
  var textRuiRo = van.ruiRo;
  var factsRuiRo = facts.filter(function(f) {
    if (f.loai !== 'yeu') return false;
    if (f.nguon && f.nguon.indexOf('Chính tinh') === 0) return false;
    return true;
  }).sort(function(a, b){ return b.trongSo - a.trongSo; });
  if (factsRuiRo.length) {
    textRuiRo += ' Cụ thể: ' + factsRuiRo.slice(0, 4).map(function(f){ return f.yNghia; }).join(' ');
  }
  doan.push({ tieuDe: 'Rủi ro tài chính cần tránh', text: textRuiRo });

  // === 6. LỜI KHUYÊN ===
  doan.push({ tieuDe: 'Lời khuyên cụ thể', text: '', list: van.loiKhuyen.slice() });

  return doan;
}

/* ============================================================
 *  SINH VĂN CHO CUNG QUAN LỘC — 7 đoạn
 *  (Tóm tắt / Nghề nghiệp / Môi trường / Thăng tiến
 *   / Khó khăn / Yếu tố đặc biệt / Lời khuyên)
 * ============================================================ */

/**
 * Xác định nhóm tính cách Quan Lộc (A–F) từ chính tinh.
 * Đặc biệt: nếu VCD không Tuần/Triệt → mượn nhóm từ sao đối cung.
 */
function xacDinhNhomQuanLoc_(palace, P, pi) {
  function phanNhom_(saoArr) {
    if (saoArr.some(function(s){ return ['Tử Vi','Thái Dương','Thiên Tướng'].indexOf(s) >= 0; })) return 'A';
    if (saoArr.some(function(s){ return ['Thiên Cơ','Cự Môn','Thái Âm'].indexOf(s) >= 0; })) return 'B';
    if (saoArr.some(function(s){ return ['Vũ Khúc','Thiên Phủ','Thiên Đồng'].indexOf(s) >= 0; })) return 'C';
    if (saoArr.some(function(s){ return ['Thất Sát','Phá Quân','Liêm Trinh'].indexOf(s) >= 0; })) return 'D';
    if (saoArr.some(function(s){ return ['Tham Lang','Thiên Lương'].indexOf(s) >= 0; })) return 'E';
    return 'F';
  }

  if (palace.chinh.length) {
    return phanNhom_(palace.chinh.map(function(s){ return s.n; }));
  }

  // VCD
  if (palace.tuan || palace.triet) return 'F';
  var xc = mod12(pi + 6);
  var chinhDoi = P[xc].chinh.map(function(s){ return s.n; });
  if (!chinhDoi.length) return 'F';
  return phanNhom_(chinhDoi);
}

/**
 * Sinh 7 đoạn văn dễ hiểu cho cung Quan Lộc.
 */
function sinhVanCungQuanLoc_(chart, pi) {
  var P = chart.palaces;
  var palace = P[pi];

  var nhom = xacDinhNhomQuanLoc_(palace, P, pi);
  var van = TUVI_VAN_QUANLOC[nhom] || TUVI_VAN_QUANLOC['F'];

  var facts = tuviSinhFactsQuanLoc_(chart, pi);
  var doan = [];

  // === 1. TÓM TẮT ===
  doan.push({ tieuDe: 'Tóm tắt', text: van.tomTat });

  // === 2. NGHỀ NGHIỆP PHÙ HỢP ===
  var textNghe = van.ngheNghiep;
  var factsNghe = facts.filter(function(f) {
    return f.loai === 'manh' && f.nguon && f.nguon.indexOf('Chính tinh') === 0;
  }).sort(function(a, b){ return b.trongSo - a.trongSo; });
  if (factsNghe.length) {
    textNghe += ' Cụ thể: ' + factsNghe.slice(0, 2).map(function(f){ return f.yNghia; }).join(' ');
  }
  doan.push({ tieuDe: 'Nghề nghiệp phù hợp', text: textNghe });

  // === 3. MÔI TRƯỜNG LÀM VIỆC ===
  doan.push({ tieuDe: 'Môi trường làm việc lý tưởng', text: van.moiTruong });

  // === 4. CON ĐƯỜNG THĂNG TIẾN ===
  var textThangTien = van.thangTien;
  var factsThangTien = facts.filter(function(f) {
    var t = f.tags || [];
    return t.some(function(x) {
      return x.indexOf('thang_chuc') >= 0 || x.indexOf('thang_tien') >= 0 
        || x.indexOf('chuc_vu') >= 0 || x.indexOf('bo_nhiem') >= 0 
        || x.indexOf('bang_khen') >= 0 || x.indexOf('duoc_khen_thuong') >= 0;
    });
  });
  if (factsThangTien.length) {
    textThangTien += ' Yếu tố hỗ trợ: ' + factsThangTien.map(function(f){ return f.yNghia; }).join(' ');
  }
  doan.push({ tieuDe: 'Con đường thăng tiến', text: textThangTien });

  // === 5. KHÓ KHĂN CẦN VƯỢT QUA ===
  var textKhoKhan = van.khoKhan;
  var factsKhoKhan = facts.filter(function(f) {
    if (f.loai !== 'yeu') return false;
    if (f.nguon && f.nguon.indexOf('Chính tinh') === 0) return false;
    return true;
  }).sort(function(a, b){ return b.trongSo - a.trongSo; });
  if (factsKhoKhan.length) {
    textKhoKhan += ' Cụ thể: ' + factsKhoKhan.slice(0, 3).map(function(f){ return f.yNghia; }).join(' ');
  }
  // Thêm Tuần/Triệt nếu có
  if (palace.tuan || palace.triet) {
    textKhoKhan += ' Cung Quan Lộc của bạn còn bị "che mờ" (một dấu hiệu làm chậm, làm giảm lực của cung) — giai đoạn đầu sự nghiệp thường mờ nhạt, công sức bỏ ra chưa được ghi nhận, việc dễ dở dang; sau 30 tuổi mới rõ nét hơn.';
  }
  doan.push({ tieuDe: 'Khó khăn cần vượt qua', text: textKhoKhan });

  // === 6. YẾU TỐ ĐẶC BIỆT ===
  var dacBiet = facts.filter(function(f) {
    var t = f.tags || [];
    return t.indexOf('tu_hoa') >= 0 || t.indexOf('trang_sinh') >= 0
      || t.indexOf('bac_si') >= 0 || t.indexOf('thai_tue') >= 0;
  });
  if (dacBiet.length) {
    doan.push({ tieuDe: 'Yếu tố đặc biệt của cung này', text: dacBiet.map(function(f){ return f.yNghia; }).join(' ') });
  }

  // === 7. LỜI KHUYÊN ===
  doan.push({ tieuDe: 'Lời khuyên cụ thể', text: '', list: van.loiKhuyen.slice() });

  return doan;
}

/* ============================================================
 *  XỬ LÝ CUNG TỬ TỨC — Facts + Số con/Giới tính + Văn 6 đoạn
 * ============================================================ */

function tuviSinhFactsTuTuc_(chart, pi) {
  var facts = [];
  var P = chart.palaces;
  var C = P[pi];
  var lv = 'Tu Tuc', nhom = 'con_cai';

  C.chinh.forEach(function(s) {
    var info = TUVI_FACT_TUTUC_CHINHTINH[s.n];
    if (!info) return;
    var heSo = s.b ? (TUVI_FACT_DOSANG_HE_SO[s.b] || 1.0) : 1.0;
    var trongSo = Math.round(info.trongSo * heSo * 10) / 10;
    var loai = (s.b === 'H') ? 'trung' : 'manh';
    facts.push(taoFact_('Tu Vi', lv, nhom, loai, info.yNghia, trongSo,
      { nguon: 'Chính tinh ' + s.n + (s.b ? ' (' + s.b + ')' : '') + ' tại Tử Tức', doiTuong: 'con_cai', tags: info.tags.slice() }));
    if (s.hoa) {
      var fHoa = tuviFactsTuHoaSao_(s.n, s.hoa, C, lv, nhom);
      if (fHoa) facts.push(fHoa);
    }
  });

  var dsSao = [].concat(C.cat, C.hung, C.tieu);
  var daXuat = {};
  dsSao.forEach(function(s) {
    if (s.hoaOf) return;
    var info = TUVI_FACT_TUTUC_PHUTINH[s.n];
    if (!info) return;
    var key = info.yNghia.slice(0, 30);
    if (daXuat[key]) return;
    daXuat[key] = true;
    facts.push(taoFact_('Tu Vi', lv, nhom, info.loai, info.yNghia, info.trongSo,
      { nguon: 'Phụ tinh ' + s.n + ' tại Tử Tức', doiTuong: 'con_cai', tags: info.tags }));
  });

  facts = facts.concat(tuviFactsTuanTriet_(C, lv, nhom));
  facts = facts.concat(tuviFactsTamPhuongTuChinh_(chart, pi, lv, nhom));
  facts = facts.concat(tuviFactsNhiHop_(chart, pi, lv, nhom));
  facts = facts.concat(tuviFactsGiapCung_(chart, pi, lv, nhom));
  facts = facts.concat(tuviFactsVongSao_(C, lv, nhom));

  return locFactLoi_(facts);
}

/** Tính số con + giới tính (Tử Vi + Bát Tự) */
function tuviTinhSoConGioiTinh_(chart, palace, pi) {
  var diem = palace.diem10 != null ? palace.diem10 : chuanHoa10_(palace.diem);

  var catTang = ['Tả Phù','Hữu Bật','Thai','Hồng Loan','Thiên Hỷ','Long Trì','Phượng Các','Hóa Lộc','Hóa Khoa'];
  var hungGiam = ['Kình Dương','Đà La','Hỏa Tinh','Linh Tinh','Địa Không','Địa Kiếp','Hóa Kỵ','Cô Thần','Quả Tú','Thiên Hình','Thiên Riêu'];
  var dsSao = [].concat(palace.chinh, palace.cat, palace.hung, palace.tieu).map(function(s){ return s.n; });

  var soCat = dsSao.filter(function(n){ return catTang.indexOf(n) >= 0; }).length;
  var soHung = dsSao.filter(function(n){ return hungGiam.indexOf(n) >= 0; }).length;

  var diemSoCon = diem + soCat * 0.8 - soHung * 1.0;
  if (palace.tuan || palace.triet) diemSoCon -= 2;

  // Giới tính
  var cungDuong = [0, 2, 4, 6, 8, 10].indexOf(palace.chi) >= 0;
  var chinhDuong = 0, chinhAm = 0;
  palace.chinh.forEach(function(s) {
    if (['Tử Vi','Thái Dương','Vũ Khúc','Thất Sát','Phá Quân','Thiên Phủ','Thiên Tướng','Thiên Lương'].indexOf(s.n) >= 0) chinhDuong++;
    if (['Thiên Cơ','Thiên Đồng','Thái Âm','Tham Lang','Cự Môn','Liêm Trinh'].indexOf(s.n) >= 0) chinhAm++;
  });
  var tongDuong = (cungDuong ? 1 : 0) + chinhDuong;
  var tongAm = (cungDuong ? 0 : 1) + chinhAm;
  var tong = tongDuong + tongAm;
  var pTrai = tong > 0 ? Math.round(tongDuong / tong * 100) : 50;
  pTrai = Math.max(30, Math.min(70, pTrai));

  // Đối chiếu Bát Tự
  var batiKet = null;
  if (chart._bt) {
    var bt = chart._bt;
    var tuTinh = chart.info.male ? ['Quan Sát','Thất Sát','Chính Quan'] : ['Thực Thương','Thực Thần','Thương Quan'];
    var soTuTinh = 0;
    bt.pillars.forEach(function(p) {
      [p.thapThan].concat((p.tangCan || []).map(function(t){ return t.thapThan; })).forEach(function(t) {
        if (tuTinh.indexOf(t) >= 0) soTuTinh++;
      });
    });
    if (soTuTinh >= 3) { diemSoCon += 1.5; batiKet = 'Bát Tự cho thấy sao con cái xuất hiện nhiều — ủng hộ hướng con đông.'; }
    else if (soTuTinh === 0) { diemSoCon -= 1.5; batiKet = 'Bát Tự cho thấy sao con cái ẩn hoặc thiếu — có thể con đến muộn.'; }
    else if (soTuTinh >= 2) { batiKet = 'Bát Tự cho thấy sao con cái xuất hiện vừa phải — phù hợp hướng 2 con.'; }
  }

  // Kết luận số con
  var soCon;
  if (diemSoCon >= 8) soCon = '4 con trở lên (nếu điều kiện cho phép)';
  else if (diemSoCon >= 6.5) soCon = '3-4 con';
  else if (diemSoCon >= 5) soCon = '2-3 con';
  else if (diemSoCon >= 3.5) soCon = '1-2 con';
  else soCon = 'ít con';

  // Kết luận giới tính
  var gioiTinh;
  if (pTrai >= 60) gioiTinh = 'nghiêng về con trai';
  else if (pTrai <= 40) gioiTinh = 'nghiêng về con gái';
  else gioiTinh = 'khá cân bằng trai - gái';

  return {
    soCon: soCon, diemSoCon: Math.round(diemSoCon * 10) / 10,
    gioiTinh: gioiTinh, pTrai: pTrai, batiKet: batiKet,
    chiTiet: 'Điểm cung Tử Tức ' + Math.round(diem * 10) / 10 + '/10; ' + soCat + ' cát tinh (+), ' + soHung + ' hung tinh (-)' + (palace.tuan || palace.triet ? ', Tuần/Triệt đóng (-2)' : '') + '. Tỷ lệ trai/gái: ' + pTrai + '/' + (100 - pTrai) + '.'
  };
}

function xacDinhNhomTuTuc_(palace) {
  if (!palace.chinh.length) return 'C';
  var sao = palace.chinh.map(function(s){ return s.n; });
  if (sao.some(function(s){ return ['Tử Vi','Thiên Phủ','Thiên Tướng','Thái Dương'].indexOf(s) >= 0; })) return 'A';
  if (sao.some(function(s){ return ['Thiên Cơ','Cự Môn','Thái Âm'].indexOf(s) >= 0; })) return 'B';
  if (sao.some(function(s){ return ['Vũ Khúc','Thiên Đồng','Liêm Trinh'].indexOf(s) >= 0; })) return 'C';
  if (sao.some(function(s){ return ['Thất Sát','Phá Quân'].indexOf(s) >= 0; })) return 'D';
  if (sao.some(function(s){ return ['Tham Lang','Thiên Lương'].indexOf(s) >= 0; })) return 'E';
  return 'C';
}

function sinhVanCungTuTuc_(chart, pi) {
  var P = chart.palaces;
  var palace = P[pi];
  var nhom = xacDinhNhomTuTuc_(palace);
  var van = TUVI_VAN_TUTUC[nhom] || TUVI_VAN_TUTUC['C'];
  var facts = tuviSinhFactsTuTuc_(chart, pi);
  var doan = [];

  doan.push({ tieuDe: 'Tóm tắt', text: van.tomTat });

  // === ĐOẠN 2: DUYÊN CON ===
  var factsDuyenCat = facts.filter(function(f) {
    var t = f.tags || [];
    return f.loai === 'manh' && t.some(function(x) {
      return x.indexOf('con_som') >= 0 || x.indexOf('de_sinh') >= 0 || x.indexOf('con_tin_vui') >= 0;
    });
  });
  var factsDuyenHung = facts.filter(function(f) {
    var t = f.tags || [];
    return f.loai === 'yeu' && t.some(function(x) {
      return x.indexOf('con_muon') >= 0 || x.indexOf('hiem_muon') >= 0 || x.indexOf('sinh_no_trac_tro') >= 0 || x.indexOf('con_kho_nuoi') >= 0 || x.indexOf('con_dau_kho_nuoi') >= 0;
    });
  });

  var textDuyen;
  if (factsDuyenCat.length && !factsDuyenHung.length) {
    // Chỉ có điểm cát
    textDuyen = 'Duyên con của bạn thuận lợi. ' + factsDuyenCat.map(function(f){ return f.yNghia; }).join(' ') + ' Mặt trái là con đến sớm khi cha mẹ chưa vững thì việc nuôi dạy sẽ vất vả hơn.';
  } else if (!factsDuyenCat.length && factsDuyenHung.length) {
    // Chỉ có điểm hung
    textDuyen = 'Duyên con của bạn cần chú ý. ' + factsDuyenHung.map(function(f){ return f.yNghia; }).join(' ') + ' Gợi ý: nếu chờ lâu, nên khám chuyên khoa sớm.';
  } else if (factsDuyenCat.length && factsDuyenHung.length) {
    // Có cả hai — ghi rõ ràng
    textDuyen = 'Duyên con của bạn có cả thuận lợi lẫn điểm cần lưu ý. ';
    textDuyen += 'Thuận lợi: ' + factsDuyenCat.map(function(f){ return f.yNghia; }).join(' ') + ' ';
    textDuyen += 'Cần lưu ý: ' + factsDuyenHung.map(function(f){ return f.yNghia; }).join(' ') + ' ';
    textDuyen += 'Gợi ý: theo dõi sức khỏe sinh sản với bác sĩ.';
  } else {
    textDuyen = van.duyenCon;
  }
  doan.push({ tieuDe: 'Duyên con cái', text: textDuyen });

  // 24/10: bỏ đoạn 'Số con & giới tính' (số con cụ thể, % trai/gái – không có cơ sở, dễ gây áp lực)

  // === ĐOẠN 4: CON CÁI CỦA BẠN ===
  // Chỉ lấy facts chính tinh, sắp xếp theo trọng số, lấy 2 câu mạnh nhất
  // và KIỂM TRA mâu thuẫn (không lấy đồng thời câu "ít con" và "đông con")
  var factsConAll = facts.filter(function(f) {
    return f.nguon && f.nguon.indexOf('Chính tinh') === 0;
  }).sort(function(a, b){ return b.trongSo - a.trongSo; });

  var ketQuaCon = [];
  var coItCon = false, coDongCon = false;
  factsConAll.forEach(function(f) {
    if (ketQuaCon.length >= 2) return;
    var y = f.yNghia.toLowerCase();
    var laItCon = /(ít|sinh muộn|khó nuôi)/.test(y);
    var laDongCon = /(đông)/.test(y);
    if (laItCon && coDongCon) return; // bỏ nếu mâu thuẫn
    if (laDongCon && coItCon) return; // bỏ nếu mâu thuẫn
    if (laItCon) coItCon = true;
    if (laDongCon) coDongCon = true;
    ketQuaCon.push(f.yNghia);
  });

  var textCon = van.conCai;
  if (ketQuaCon.length) {
    textCon += ' Cụ thể: ' + ketQuaCon.join(' ');
  }
  doan.push({ tieuDe: 'Con cái của bạn', text: textCon });

  // === ĐOẠN 5: CÁCH NUÔI DẠY ===
  // Chỉ lấy facts về TÍNH CÁCH CON (tags con_*), bỏ facts giáp cung/tam phương
  var factsNuoi = facts.filter(function(f) {
    if (f.loai !== 'yeu') return false;
    if (f.nguon && (f.nguon.indexOf('Giáp') >= 0 || f.nguon.indexOf('Xung') >= 0 || f.nguon.indexOf('Tam hợp') >= 0 || f.nguon.indexOf('Nhị hợp') >= 0 || f.nguon.indexOf('Tuần') >= 0)) return false;
    if (f.nguon && f.nguon.indexOf('Chính tinh') === 0) return false;
    var t = f.tags || [];
    return t.some(function(x) {
      return x.indexOf('con_') === 0 || x.indexOf('sinh_no') >= 0;
    });
  }).sort(function(a, b){ return b.trongSo - a.trongSo; });

  var textNuoi = van.nuoiDay;
  if (factsNuoi.length) {
    textNuoi += ' Lưu ý thêm: ' + factsNuoi.slice(0, 2).map(function(f){ return f.yNghia; }).join(' ');
  }
  doan.push({ tieuDe: 'Cách nuôi dạy phù hợp', text: textNuoi });

  doan.push({ tieuDe: 'Lời khuyên cụ thể', text: '', list: van.loiKhuyen.slice() });

  return doan;
}

/* ============================================================
 *  XỬ LÝ CUNG TẬT ÁCH — Facts + Văn 5 đoạn
 * ============================================================ */

function tuviSinhFactsTatAch_(chart, pi) {
  var facts = [];
  var P = chart.palaces;
  var C = P[pi];
  var lv = 'Tat Ach', nhom = 'suc_khoe';

  C.chinh.forEach(function(s) {
    var info = TUVI_FACT_TATACH_CHINHTINH[s.n];
    if (!info) return;
    var heSo = s.b ? (TUVI_FACT_DOSANG_HE_SO[s.b] || 1.0) : 1.0;
    var trongSo = Math.round(info.trongSo * heSo * 10) / 10;
    var loai = (s.b === 'H') ? 'trung' : 'manh';
    facts.push(taoFact_('Tu Vi', lv, nhom, loai, info.yNghia, trongSo,
      { nguon: 'Chính tinh ' + s.n + (s.b ? ' (' + s.b + ')' : '') + ' tại Tật Ách', doiTuong: 'ban_than', tags: info.tags.slice() }));
  });

  var dsSao = [].concat(C.cat, C.hung, C.tieu);
  var daXuat = {};
  dsSao.forEach(function(s) {
    if (s.hoaOf) return;
    var info = TUVI_FACT_TATACH_PHUTINH[s.n];
    if (!info) return;
    var key = info.yNghia.slice(0, 30);
    if (daXuat[key]) return;
    daXuat[key] = true;
    facts.push(taoFact_('Tu Vi', lv, nhom, info.loai, info.yNghia, info.trongSo,
      { nguon: 'Phụ tinh ' + s.n + ' tại Tật Ách', doiTuong: 'ban_than', tags: info.tags }));
  });

  facts = facts.concat(tuviFactsTuanTriet_(C, lv, nhom));
  facts = facts.concat(tuviFactsTamPhuongTuChinh_(chart, pi, lv, nhom));
  facts = facts.concat(tuviFactsNhiHop_(chart, pi, lv, nhom));
  facts = facts.concat(tuviFactsGiapCung_(chart, pi, lv, nhom));
  facts = facts.concat(tuviFactsVongSao_(C, lv, nhom));

  return locFactLoi_(facts);
}

function xacDinhNhomTatAch_(palace) {
  if (!palace.chinh.length) return 'F';
  var sao = palace.chinh.map(function(s){ return s.n; });
  if (sao.some(function(s){ return ['Tử Vi','Thiên Phủ','Thiên Tướng','Thái Dương'].indexOf(s) >= 0; })) return 'A';
  if (sao.some(function(s){ return ['Thiên Cơ','Cự Môn','Thái Âm'].indexOf(s) >= 0; })) return 'B';
  if (sao.some(function(s){ return ['Vũ Khúc','Thiên Đồng','Liêm Trinh'].indexOf(s) >= 0; })) return 'C';
  if (sao.some(function(s){ return ['Thất Sát','Phá Quân'].indexOf(s) >= 0; })) return 'D';
  if (sao.some(function(s){ return ['Tham Lang','Thiên Lương'].indexOf(s) >= 0; })) return 'E';
  return 'C';
}

function sinhVanCungTatAch_(chart, pi) {
  var P = chart.palaces;
  var palace = P[pi];
  var nhom = xacDinhNhomTatAch_(palace);
  var van = TUVI_VAN_TATACH[nhom] || TUVI_VAN_TATACH['C'];
  var facts = tuviSinhFactsTatAch_(chart, pi);
  var doan = [];

  doan.push({ tieuDe: 'Tóm tắt', text: van.tomTat });
  doan.push({ tieuDe: 'Nếp sống tổng quát', text: van.theChat });

  // Đoạn 3: Cơ quan cần chú ý
  var textCoQuan = van.coQuan;
  var factsCoQuan = facts.filter(function(f) {
    return f.nguon && f.nguon.indexOf('Chính tinh') === 0;
  });
  if (factsCoQuan.length) {
    textCoQuan += ' Cụ thể: ' + factsCoQuan.map(function(f){ return f.yNghia; }).join(' ');
  }
  doan.push({ tieuDe: 'Điều nên để ý', text: textCoQuan });

  // Đoạn 4: Cách phòng bệnh
  var textPhong = van.phongBenh;
  var factsGiai = facts.filter(function(f) {
    var t = f.tags || [];
    return t.some(function(x){ return x.indexOf('giai') >= 0 || x.indexOf('thay_thuoc') >= 0 || x.indexOf('quy_nhan_y_te') >= 0; });
  });
  if (factsGiai.length) {
    textPhong += ' Điểm sáng: ' + factsGiai.map(function(f){ return f.yNghia; }).join(' ');
  }
  doan.push({ tieuDe: 'Cách giữ gìn sức khỏe', text: textPhong });

  doan.push({ tieuDe: 'Lời khuyên cụ thể', text: '', list: van.loiKhuyen.slice() });

  return doan;
}
/* ============================================================
 *  XỬ LÝ CUNG ĐIỀN TRẠCH — Facts + Văn 5 đoạn
 * ============================================================ */

function tuviSinhFactsDienTrach_(chart, pi) {
  var facts = [];
  var P = chart.palaces;
  var C = P[pi];
  var lv = 'Dien Trach', nhom = 'tai_chinh';

  C.chinh.forEach(function(s) {
    var info = TUVI_FACT_DIENTRACH_CHINHTINH[s.n];
    if (!info) return;
    var heSo = s.b ? (TUVI_FACT_DOSANG_HE_SO[s.b] || 1.0) : 1.0;
    var trongSo = Math.round(info.trongSo * heSo * 10) / 10;
    var loai = (s.b === 'H') ? 'trung' : 'manh';
    facts.push(taoFact_('Tu Vi', lv, nhom, loai, info.yNghia, trongSo,
      { nguon: 'Chính tinh ' + s.n + (s.b ? ' (' + s.b + ')' : '') + ' tại Điền Trạch', doiTuong: 'ban_than', tags: info.tags.slice() }));
    if (s.hoa) {
      var fHoa = tuviFactsTuHoaSao_(s.n, s.hoa, C, lv, nhom);
      if (fHoa) facts.push(fHoa);
    }
  });

  var dsSao = [].concat(C.cat, C.hung, C.tieu);
  var daXuat = {};
  dsSao.forEach(function(s) {
    if (s.hoaOf) return;
    var info = TUVI_FACT_DIENTRACH_PHUTINH[s.n];
    if (!info) return;
    var key = info.yNghia.slice(0, 30);
    if (daXuat[key]) return;
    daXuat[key] = true;
    facts.push(taoFact_('Tu Vi', lv, nhom, info.loai, info.yNghia, info.trongSo,
      { nguon: 'Phụ tinh ' + s.n + ' tại Điền Trạch', doiTuong: 'ban_than', tags: info.tags }));
  });

  facts = facts.concat(tuviFactsTuanTriet_(C, lv, nhom));
  facts = facts.concat(tuviFactsTamPhuongTuChinh_(chart, pi, lv, nhom));
  facts = facts.concat(tuviFactsNhiHop_(chart, pi, lv, nhom));
  facts = facts.concat(tuviFactsGiapCung_(chart, pi, lv, nhom));
  facts = facts.concat(tuviFactsVongSao_(C, lv, nhom));

  return locFactLoi_(facts);
}

function xacDinhNhomDienTrach_(palace) {
  if (!palace.chinh.length) return 'F';
  var sao = palace.chinh.map(function(s){ return s.n; });
  if (sao.some(function(s){ return ['Tử Vi','Thiên Phủ','Thái Âm'].indexOf(s) >= 0; })) return 'A';
  if (sao.some(function(s){ return ['Vũ Khúc','Tham Lang','Thiên Đồng'].indexOf(s) >= 0; })) return 'B';
  if (sao.some(function(s){ return ['Thái Dương','Thiên Lương','Thiên Tướng'].indexOf(s) >= 0; })) return 'C';
  if (sao.some(function(s){ return ['Thất Sát','Phá Quân','Thiên Cơ','Cự Môn','Liêm Trinh'].indexOf(s) >= 0; })) return 'D';
  return 'C';
}

/* ============================================================
 *  NÂNG CẤP ĐIỀN TRẠCH — 3 tầng: Sao → Tứ Hóa → Cảnh báo
 * ============================================================ */

/**
 * Tầng 1 — Luận nhà cửa động theo cặp sao + sao đơn.
 * Thay thế van.nhaCua cố định.
 */
function taoDoanNhaCuaDienTrach_(palace, P, pi) {
  var sao = palace.chinh.map(function(s){ return s.n; });
  var doan = [];

  // VCD — mượn sao đối cung
  if (!sao.length) {
    var xc = mod12(pi + 6);
    var saoDoi = P[xc].chinh.map(function(s){ return s.n; });
    var tenLv = LG_LINH_VUC[P[xc].cung] || P[xc].cung;
    if (saoDoi.length) {
      doan.push('Phần nhà cửa trên lá số của bạn để trống, nên phải mượn nét từ mảng đối diện (' + tenLv + '). ');
      // Dịch sao đối cung thành ý nghĩa nhà đất
      var yNghiaDoi = {
        'Tử Vi':      'Nhà cửa mượn được khí chất uy nghi — có thể có bất động sản giá trị khi lớn tuổi.',
        'Thiên Cơ':   'Nhà cửa hay thay đổi, dễ chuyển chỗ. Nên mua nhà khi đã ổn định công việc.',
        'Thái Dương': 'Nhà cửa sáng sủa, có thể được thừa hưởng từ cha mẹ; mặt trái là dễ chi nhiều vì thể diện.',
        'Vũ Khúc':    'Tự gây dựng nhà đất — không ỷ lại thừa kế. Nhà cửa vững chắc.',
        'Thiên Đồng': 'Nhà cửa trước ít sau nhiều — càng về già càng ổn định.',
        'Liêm Trinh': 'Nhà đất cần cẩn thận giấy tờ, dễ tranh chấp.',
        'Thiên Phủ':  'Giàu nhà đất, giữ được sản nghiệp lâu dài; mặt trái là bảo thủ, ngại thay đổi.',
        'Thái Âm':    'Rất tốt về điền sản — có lộc về nhà đất; mặt trái là dễ kẹt vốn vào nhà đất.',
        'Tham Lang':  'Nhà cửa lúc thịnh lúc suy, trung niên mới ổn định.',
        'Cự Môn':     'Nhà đất dễ tranh chấp với hàng xóm, cẩn thận giấy tờ.',
        'Thiên Tướng':'Nhà cửa đẹp, ngăn nắp.',
        'Thiên Lương':'Được hưởng nhà cửa tổ nghiệp, ở nơi yên tĩnh.',
        'Thất Sát':   'Tổ nghiệp khó giữ, phải tự lập mới có nhà.',
        'Phá Quân':   'Phá cũ xây mới, hay mua bán nhà đất.'
      };
      var yD = saoDoi.map(function(s){ return yNghiaDoi[s]; }).filter(Boolean);
      if (yD.length) doan.push(yD.join(' '));
      // Cảnh báo mượn nửa lực
      doan.push('Lưu ý: vì mượn sao, sức mạnh chỉ còn khoảng một nửa — nhà cửa của bạn phụ thuộc nhiều vào nỗ lực bản thân và hoàn cảnh sống.');
      if (palace.tuan || palace.triet) {
        doan.push('Cung này còn bị "che mờ" (một dấu hiệu làm chậm, làm giảm lực của cung) — giai đoạn đầu càng mờ nhạt, phải sau 30 tuổi mới rõ nét.');
      }
      return doan.join(' ');
    } else {
      return 'Cả phần nhà cửa lẫn mảng đối diện trên lá số đều để trống — nhà cửa của bạn phụ thuộc hoàn toàn vào hoàn cảnh và nỗ lực bản thân. Mặt xấu: khó có nhà sớm, dễ ở thuê lâu. Mặt tốt: không bị ràng buộc bởi tài sản gia đình.';
    }
  }

  // Có chính tinh — xét cặp sao trước, rồi đến sao đơn (giữ nguyên phần cũ)
  if (sao.indexOf('Tử Vi') >= 0 && sao.indexOf('Phá Quân') >= 0) {
    doan.push('Tổ nghiệp của bạn có xu hướng mai một dần — nhà đất thừa hưởng từ cha mẹ dễ bị bán hoặc đổi chủ. Mặt được: nếu lá số có thêm dấu hiệu giữ của, bạn vẫn có thể nhận tài sản bất ngờ từ họ hàng hoặc mua được nhà giá tốt.');
  } else if (sao.indexOf('Tử Vi') >= 0 && sao.indexOf('Thiên Phủ') >= 0) {
    doan.push('Đây là cách cục rất tốt cho nhà đất — bạn có cả uy tín lẫn kho tàng. Nhà cửa của bạn khang trang, giữ được lâu dài, và có xu hướng tăng giá trị theo thời gian. Mặt trái là chi phí giữ nhà lớn, và bạn dễ dồn quá nhiều vốn vào nhà đất.');
  } else if (sao.indexOf('Vũ Khúc') >= 0 && sao.indexOf('Thiên Tướng') >= 0) {
    doan.push('Bạn có duyên mua nhà đất giá trị cao — thường sở hữu bất động sản ở vị trí đắc địa. Mặt xấu: tiền dồn hết vào nhà đất thì dễ kẹt vốn, và mua bán lớn dễ vướng giấy tờ pháp lý. Gợi ý: hỏi người có chuyên môn trước khi xuống tiền.');
  } else if (sao.indexOf('Thiên Cơ') >= 0 && sao.indexOf('Cự Môn') >= 0) {
    doan.push('Nhà cửa của bạn hay thay đổi — có thể chuyển nhà hoặc sửa sang nhiều lần. Không nên mua nhà quá gần hàng xóm ồn ào — dễ xảy ra tranh chấp.');
  } else if (sao.indexOf('Thái Dương') >= 0 && sao.indexOf('Cự Môn') >= 0) {
    doan.push('Bạn có duyên thừa hưởng nhà đất từ cha mẹ, đặc biệt nếu sinh ở vùng quê hoặc có tổ nghiệp. Nhà cửa thường sáng sủa, thoáng đãng.');
  } else if (sao.indexOf('Thái Âm') >= 0) {
    if (palace.tuan || palace.triet) {
      doan.push('Bạn có duyên lớn với nhà đất — đây là kênh tích lũy tài sản chủ lực của bạn. Mặt xấu: phần nhà đất của bạn bị chặn bớt, nên giai đoạn đầu khó khăn, thường sau 30 tuổi mới hanh thông.');
    } else {
      doan.push('Bạn là người có duyên lớn với nhà đất — bất động sản là kênh tích lũy tài sản chủ lực của bạn. Nhà cửa thường ở nơi yên tĩnh, có không gian xanh, và giá trị tăng đều theo thời gian. Mặt trái là dễ kẹt vốn vào nhà đất khi cần tiền mặt.');
    }
  } else if (sao.indexOf('Vũ Khúc') >= 0) {
    doan.push('Bạn có xu hướng tự mua nhà bằng sức mình hơn là dựa vào thừa kế. Nhà cửa của bạn vững chắc về kết cấu, giá trị tài chính cao — đây là loại tài sản "giữ được" qua biến động.');
  } else if (sao.indexOf('Thiên Phủ') >= 0) {
    doan.push('Bạn có khả năng giữ và phát triển tài sản nhà đất tốt — thường không bán nhà mà mua thêm. Nhà cửa của bạn mang tính "kho tàng", càng ở lâu càng có giá. Mặt trái là bạn dễ giữ của quá chặt, ngại thay đổi chỗ ở dù đã không còn hợp.');
  } else if (sao.indexOf('Thất Sát') >= 0 || sao.indexOf('Phá Quân') >= 0) {
    doan.push('Nhà đất của bạn thường biến động — có thể đổi chủ vài lần trước khi ổn định. Tổ nghiệp khó giữ, mỗi lần đổi chủ thường hao tài sản; mặt tốt là bạn đủ sức tự gây dựng chỗ ở vững chắc.');
  } else if (sao.indexOf('Tham Lang') >= 0) {
    doan.push('Nhà cửa của bạn lúc thịnh lúc suy — trung niên mới có nhà đất ổn định. Thời trẻ dễ mua bán nhà đất thua lỗ hoặc hao tài sản vì ăn chơi; từ khoảng 35 tuổi trở đi thường thuận hơn.');
  } else if (sao.indexOf('Liêm Trinh') >= 0) {
    doan.push('Nhà đất của bạn cần đặc biệt cẩn thận về giấy tờ — dễ tranh chấp với anh em hoặc họ hàng về quyền thừa kế. Cần rõ ràng pháp lý từ đầu, không nên mua bán bằng giấy tay.');
  } else if (sao.indexOf('Thiên Đồng') >= 0) {
    doan.push('Nhà cửa của bạn trước ít sau nhiều — ban đầu có thể chật vật phải thuê nhà, nhưng càng về sau càng ổn định. Bạn thường tự lập trong việc nhà cửa, ít nhờ vả.');
  } else if (sao.indexOf('Thiên Lương') >= 0) {
    doan.push('Bạn có duyên được thừa hưởng nhà đất tổ nghiệp, hoặc sống ở nơi có truyền thống lâu đời. Nhà cửa thường ở nơi gần thiên nhiên, yên tĩnh, ít xô bồ.');
  } else if (sao.indexOf('Thiên Tướng') >= 0) {
    doan.push('Nhà cửa của bạn đẹp, ngăn nắp, có người giúp trong việc mua sắm và sửa sang. Môi trường sống thường chỉn chu, có gu thẩm mỹ; mặt trái là chi nhiều cho hình thức nhà cửa.');
  } else {
    doan.push('Cung Điền Trạch của bạn ở mức trung bình — nhà cửa ổn định nhưng không có điểm gì đặc biệt nổi bật. Cần tích lũy dần theo thời gian.');
  }

  // Độ sáng (miếu/vượng/hãm)
  var ham = palace.chinh.filter(function(s){ return s.b === 'H'; }).length;
  var sang = palace.chinh.filter(function(s){ return s.b === 'M' || s.b === 'V'; }).length;
  if (ham >= 2) {
    doan.push('Các sao chính ở đây đều hãm địa — nhà cửa của bạn thường kém về phong thủy hoặc vị trí. Nên chọn nhà hướng Đông Nam hoặc Nam để cân bằng khí.');
  } else if (sang >= 2) {
    doan.push('Các sao chính ở đây đều miếu vượng — nhà cửa của bạn có phong thủy tốt, dễ gặp may về nhà đất; mặt trái là dễ chủ quan khi giao dịch lớn.');
  }

  return doan.join(' ');
}

/**
 * Tầng 2 — Đoạn Tứ Hóa tại Điền Trạch (chỉ sinh khi có Tứ Hóa).
 */
function taoDoanTuHoaDienTrach_(palace) {
  var dsHoa = [];
  [].concat(palace.chinh, palace.cat, palace.hung, palace.tieu).forEach(function(s) {
    if (s.hoa && dsHoa.indexOf(s.hoa) < 0) dsHoa.push(s.hoa);
  });
  if (!dsHoa.length) return null;

  var text = [];
  if (dsHoa.indexOf('Lộc') >= 0) {
    text.push('Gia đình bạn có duyên về tài sản, nhà cửa có xu hướng tăng thêm theo thời gian. Mặt trái là dễ hào hứng mua thêm quá sức, gánh nợ vay.');
  }
  if (dsHoa.indexOf('Quyền') >= 0) {
    text.push('Bạn có xu hướng mở rộng nhà đất, nhưng cũng dễ phát sinh tranh chấp về quyền sở hữu trong gia đình. Cần rõ ràng giấy tờ từ đầu, đặc biệt với anh em ruột.');
  }
  if (dsHoa.indexOf('Khoa') >= 0) {
    text.push('Việc mua bán, sang tên nhà đất của bạn thuận lợi hơn người khác. Nhà cửa của bạn thường được bài trí gọn gàng, có gu thẩm mỹ.');
  }
  if (dsHoa.indexOf('Kỵ') >= 0) {
    text.push('Đây là điểm cần lưu ý. Nhà đất của bạn dễ gặp rắc rối về giấy tờ, hoặc bạn có thể bị "kẹt" vốn vào bất động sản không sinh lời.');
    text.push('Tuy nhiên, cần phân biệt 2 trường hợp: nếu điểm vướng này rơi vào chỗ có sẵn của cải thì lại thành tốt — tiền vào nhà khó thoát ra, tức là giữ được của; ngược lại, rơi vào chỗ trống thì tài sản dễ tiêu tán.');
  }

  if (!text.length) return null;
  return { tieuDe: 'Tứ Hóa tại Điền Trạch', text: text.join(' ') };
}

/**
 * Tầng 3 — Đoạn Cảnh báo đặc biệt (chỉ sinh khi có sao xấu hoặc giáp cung).
 */
function taoDoanCanhBaoDienTrach_(chart, pi) {
  var P = chart.palaces;
  var C = P[pi];
  var dsSao = [].concat(C.chinh, C.cat, C.hung, C.tieu).map(function(s){ return s.n; });
  var canhBao = [];

  var coHoa = dsSao.indexOf('Hỏa Tinh') >= 0;
  var coLinh = dsSao.indexOf('Linh Tinh') >= 0;
  var coKhong = dsSao.indexOf('Địa Không') >= 0;
  var coKiep = dsSao.indexOf('Địa Kiếp') >= 0;

  if (coHoa || coLinh) {
    canhBao.push('Đề phòng hỏa hoạn hoặc hư hỏng nhà cửa do điện, nước. Gợi ý: kiểm tra điện, bếp gas định kỳ.');
  }
  if (coKhong || coKiep) {
    canhBao.push('Nhà đất của bạn dễ bị hao hụt, mất giá hoặc mất trắng khi đầu tư lớn, vay quá sức. Gợi ý: chỉ vay mua nhà trong mức trả được.');
  }
  if (dsSao.indexOf('Đà La') >= 0) {
    canhBao.push('Nhà cửa có thể gặp vấn đề ngầm như ẩm mốc, dột, hoặc tranh chấp dây dưa với hàng xóm, tốn công tốn tiền mà khó dứt.');
  }

  // Kiểm tra giáp cung
  var giapL = mod12(pi - 1), giapR = mod12(pi + 1);
  var saoL = [].concat(P[giapL].chinh, P[giapL].cat, P[giapL].hung).map(function(s){ return s.n; });
  var saoR = [].concat(P[giapR].chinh, P[giapR].cat, P[giapR].hung).map(function(s){ return s.n; });
  var khongKiepL = saoL.indexOf('Địa Không') >= 0 || saoL.indexOf('Địa Kiếp') >= 0;
  var khongKiepR = saoR.indexOf('Địa Không') >= 0 || saoR.indexOf('Địa Kiếp') >= 0;
  if (khongKiepL && khongKiepR) {
    canhBao.push('Dấu hiệu tổ nghiệp không vững, khó giữ được nhà đất thừa hưởng. Bạn nên tập trung vào thu nhập ổn định thay vì kỳ vọng vào thừa kế hoặc đầu cơ bất động sản.');
  }

  var tuanL = P[giapL].tuan || P[giapL].triet;
  var tuanR = P[giapR].tuan || P[giapR].triet;
  if (tuanL && tuanR) {
    canhBao.push('Nhà cửa của bạn bị "bọc kín", ít được nhưng cũng ít mất. Mặt tốt là ít biến động lớn; mặt xấu là khó mở rộng, nhà cửa dễ đứng yên nhiều năm.');
  }

  if (!canhBao.length) return null;
  return { tieuDe: 'Cảnh báo đặc biệt về nhà đất', text: canhBao.join(' ') };
}

function sinhVanCungDienTrach_(chart, pi) {
  var P = chart.palaces;
  var palace = P[pi];
  var nhom = xacDinhNhomDienTrach_(palace);
  var van = TUVI_VAN_DIENTRACH[nhom] || TUVI_VAN_DIENTRACH['C'];
  var facts = tuviSinhFactsDienTrach_(chart, pi);
  var doan = [];

  // Đoạn 1: Tóm tắt
  doan.push({ tieuDe: 'Tóm tắt', text: van.tomTat });

  // Đoạn 2: Nhà cửa, tài sản (Tầng 1 mới — động theo sao)
  var textNha = taoDoanNhaCuaDienTrach_(palace, P, pi);
  var factsCat = facts.filter(function(f){
    var t = f.tags || [];
    return f.loai === 'manh' && t.some(function(x){
      return x.indexOf('nha') >= 0 || x.indexOf('giu') >= 0 || x.indexOf('giau') >= 0 || x.indexOf('loc') >= 0;
    });
  }).slice(0, 1);
  if (factsCat.length) textNha += ' ' + factsCat[0].yNghia;
  doan.push({ tieuDe: 'Nhà cửa, tài sản', text: textNha });

  // Đoạn 3: Môi trường sống phù hợp
  doan.push({ tieuDe: 'Môi trường sống phù hợp', text: van.moiTruong });

  // Đoạn 4: Cách tích lũy
  doan.push({ tieuDe: 'Cách tích lũy', text: van.tichLuy });

  // Đoạn 5 (MỚI): Tứ Hóa — chỉ thêm khi có
  var doanTuHoa = taoDoanTuHoaDienTrach_(palace);
  if (doanTuHoa) doan.push(doanTuHoa);

  // Đoạn 6 (MỚI): Cảnh báo đặc biệt — chỉ thêm khi có
  var doanCanhBao = taoDoanCanhBaoDienTrach_(chart, pi);
  if (doanCanhBao) doan.push(doanCanhBao);

  // Đoạn cuối: Lời khuyên
  doan.push({ tieuDe: 'Lời khuyên cụ thể', text: '', list: van.loiKhuyen.slice() });

  return doan;
}
/* ============================================================
 *  XỬ LÝ CUNG PHÚC ĐỨC — Facts + Văn 7 đoạn (có nền tâm thức)
 * ============================================================ */

function tuviSinhFactsPhucDuc_(chart, pi) {
  var facts = [];
  var P = chart.palaces;
  var C = P[pi];
  var lv = 'Phuc Duc', nhom = 'tam_linh';

  C.chinh.forEach(function(s) {
    var info = TUVI_FACT_PHUCDUC_CHINHTINH[s.n];
    if (!info) return;
    var heSo = s.b ? (TUVI_FACT_DOSANG_HE_SO[s.b] || 1.0) : 1.0;
    var trongSo = Math.round(info.trongSo * heSo * 10) / 10;
    var loai = (s.b === 'H') ? 'trung' : 'manh';
    facts.push(taoFact_('Tu Vi', lv, nhom, loai, info.yNghia, trongSo,
      { nguon: 'Chính tinh ' + s.n + (s.b ? ' (' + s.b + ')' : '') + ' tại Phúc Đức', doiTuong: 'ban_than', tags: info.tags.slice() }));
    if (info.linhHon) {
      facts.push(taoFact_('Tu Vi', lv, 'tam_linh', 'trung', info.linhHon, 1.0,
        { nguon: 'Nền tâm thức (từ ' + s.n + ')', doiTuong: 'ban_than', tags: ['tien_kiep'] }));
    }
    if (s.hoa) {
      var fHoa = tuviFactsTuHoaSao_(s.n, s.hoa, C, lv, nhom);
      if (fHoa) facts.push(fHoa);
    }
  });

  var dsSao = [].concat(C.cat, C.hung, C.tieu);
  var daXuat = {};
  dsSao.forEach(function(s) {
    if (s.hoaOf) return;
    var info = TUVI_FACT_PHUCDUC_PHUTINH[s.n];
    if (!info) return;
    var key = info.yNghia.slice(0, 30);
    if (daXuat[key]) return;
    daXuat[key] = true;
    facts.push(taoFact_('Tu Vi', lv, nhom, info.loai, info.yNghia, info.trongSo,
      { nguon: 'Phụ tinh ' + s.n + ' tại Phúc Đức', doiTuong: 'ban_than', tags: info.tags }));
  });

  facts = facts.concat(tuviFactsTuanTriet_(C, lv, nhom));
  facts = facts.concat(tuviFactsTamPhuongTuChinh_(chart, pi, lv, nhom));
  facts = facts.concat(tuviFactsNhiHop_(chart, pi, lv, nhom));
  facts = facts.concat(tuviFactsGiapCung_(chart, pi, lv, nhom));
  facts = facts.concat(tuviFactsVongSao_(C, lv, nhom));

  return locFactLoi_(facts);
}

function xacDinhNhomPhucDuc_(palace, P, pi) {
  var sao = palace.chinh.map(function(s){ return s.n; });

  if (!sao.length) {
    var xc = mod12(pi + 6);
    sao = P[xc].chinh.map(function(s){ return s.n; });
    if (!sao.length) return 'F';
  }

  if (sao.some(function(s){ return ['Tử Vi','Thiên Phủ','Thiên Lương','Thái Âm'].indexOf(s) >= 0; })) return 'A';
  if (sao.some(function(s){ return ['Thiên Cơ','Thiên Đồng','Thiên Tướng'].indexOf(s) >= 0; })) return 'B';
  if (sao.some(function(s){ return ['Vũ Khúc','Thái Dương','Cự Môn'].indexOf(s) >= 0; })) return 'C';
  if (sao.some(function(s){ return ['Thất Sát','Phá Quân','Tham Lang','Liêm Trinh'].indexOf(s) >= 0; })) return 'D';
  return 'B';
}

function taoDoanTuHoaPhucDuc_(palace) {
  var dsHoa = [];
  [].concat(palace.chinh, palace.cat, palace.hung, palace.tieu).forEach(function(s) {
    if (s.hoa && dsHoa.indexOf(s.hoa) < 0) dsHoa.push(s.hoa);
  });
  if (!dsHoa.length) return null;

  var text = [];
  if (dsHoa.indexOf('Lộc') >= 0) text.push('Phúc lộc dồi dào, đời sống tinh thần và vật chất đều đủ đầy. Dòng họ có nền tảng khá, bạn được hưởng nhiều may mắn; mặt trái là dễ quen được đỡ mà chủ quan.');
  if (dsHoa.indexOf('Quyền') >= 0) text.push('Bạn có uy tín trong dòng họ, thường được giao trọng trách họ tộc, tinh thần vững vàng. Mặt trái là gánh nặng việc họ và dễ va chạm với người cũng muốn có tiếng nói.');
  if (dsHoa.indexOf('Khoa') >= 0) text.push('Tinh thần sáng suốt, học vấn cao. Dòng họ có truyền thống học hành, bạn được thừa hưởng sự giáo dục tốt.');
  if (dsHoa.indexOf('Kỵ') >= 0) text.push('Nội tâm nặng nề, dễ mang cảm xúc tiêu cực. Dòng họ dễ có thị phi, hiềm khích kéo dài giữa các nhánh. Mặt được là bạn nhìn rõ chỗ hỏng của gia đình để không lặp lại.');

  if (!text.length) return null;
  return { tieuDe: 'Tứ Hóa tại Phúc Đức', text: text.join(' ') };
}

function taoDoanDacBietPhucDuc_(chart, pi) {
  var P = chart.palaces;
  var C = P[pi];
  var dsSao = [].concat(C.chinh, C.cat, C.hung, C.tieu).map(function(s){ return s.n; });
  var dacBiet = [];

  if (dsSao.indexOf('Thiên Đức') >= 0 && dsSao.indexOf('Nguyệt Đức') >= 0) {
    dacBiet.push('Phúc phần rất dày. Bạn được âm đức phù hộ mạnh mẽ, gặp dữ hóa lành, tâm hồn an nhiên. Mặt trái là dễ ỷ vào may mắn mà chậm chuẩn bị.');
  }
  if (dsSao.indexOf('Hoa Cái') >= 0) {
    dacBiet.push('Bạn có thiên hướng tâm linh, tôn giáo, hoặc triết học. Bạn dễ tìm thấy bình an qua thiền định và chiêm nghiệm; mặt trái là dễ sống tách biệt, cô độc.');
  }
  var coKhong = dsSao.indexOf('Địa Không') >= 0;
  var coKiep = dsSao.indexOf('Địa Kiếp') >= 0;
  if (coKhong && coKiep) {
    dacBiet.push('Phúc phần mỏng, tinh thần dễ trống trải, lúc khó ít chỗ dựa và dễ sa vào thú vui để khỏa lấp. Gợi ý: tránh xa các thú vui độc hại.');
  }
  if (C.tuan || C.triet) {
    dacBiet.push('Cung Phúc Đức bị "che mờ" (một dấu hiệu làm chậm, làm giảm lực của cung) — phúc phần bị giảm, giai đoạn đầu đời ít được nhờ gia đình; mặt khác, điều xấu cũng bị chặn bớt, và sau khoảng 30 tuổi thường nhẹ hơn.');
  }

  if (!dacBiet.length) return null;
  return { tieuDe: 'Yếu tố đặc biệt của Phúc Đức', text: dacBiet.join(' ') };
}

function sinhVanCungPhucDuc_(chart, pi) {
  var P = chart.palaces;
  var palace = P[pi];
  var nhom = xacDinhNhomPhucDuc_(palace, P, pi);
  var van = TUVI_VAN_PHUCDUC[nhom] || TUVI_VAN_PHUCDUC['B'];
  var facts = tuviSinhFactsPhucDuc_(chart, pi);
  var doan = [];

  doan.push({ tieuDe: 'Tóm tắt', text: van.tomTat });

  // Đoạn 2: Phúc dòng họ
  var textDongHo = van.dongHo;
  var factsDH = facts.filter(function(f){
    var t = f.tags || [];
    return f.loai === 'manh' && t.some(function(x){
      return x.indexOf('phuc_day') >= 0 || x.indexOf('dong_ho') >= 0 || x.indexOf('to_tien') >= 0 || x.indexOf('am_duc') >= 0;
    });
  }).slice(0, 2);
  if (factsDH.length) textDongHo += ' Cụ thể: ' + factsDH.map(function(f){ return f.yNghia; }).join(' ');
  doan.push({ tieuDe: 'Phúc phần dòng họ', text: textDongHo });

  // Đoạn 3: Nền tâm thức và bài học mang theo (24/11: không dùng chữ tiền kiếp/nghiệp lực)
  var textTienKiep = van.linhHon;
  var factsTK = facts.filter(function(f){
    var t = f.tags || [];
    return t.indexOf('tien_kiep') >= 0;
  });
  if (factsTK.length) {
    textTienKiep += ' ' + factsTK.map(function(f){ return f.yNghia; }).join(' ');
  }
  textTienKiep += ' <i>(Đây là góc nhìn tâm linh tham khảo — không nên xem là định mệnh cố định.)</i>';
  doan.push({ tieuDe: 'Nền tâm thức và bài học mang theo (tham khảo)', text: textTienKiep });

  // Đoạn 4: Đời sống tinh thần
  doan.push({ tieuDe: 'Đời sống tinh thần của bạn', text: van.tinhThan });

  // Đoạn 5: Những lúc một mình
  doan.push({ tieuDe: 'Những lúc một mình', text: van.motMinh });

  // Đoạn 6: Tứ Hóa
  var doanHoa = taoDoanTuHoaPhucDuc_(palace);
  if (doanHoa) doan.push(doanHoa);

  // Đoạn 7: Đặc biệt
  var doanDB = taoDoanDacBietPhucDuc_(chart, pi);
  if (doanDB) doan.push(doanDB);

  // Đoạn cuối: Lời khuyên
  doan.push({ tieuDe: 'Lời khuyên cụ thể', text: '', list: van.loiKhuyen.slice() });

  return doan;
}
/* ============================================================
 *  PHẦN 4 — HÀM TEST
 * ============================================================ */
/* ============================================================
 *  PHẦN 3 — HÀM TEST (chạy để xem facts sinh ra thế nào)
 * ============================================================ */

/**
 * Test sinh facts cho cung Mệnh của lá số 16/06/1995 4h sáng.
 */
function testFactsTuVi() {
  chiChayNoiBo_(arguments[0]);
  var input = {
    name: 'Test',
    gender: 'nam',
    calendar: 'duong',
    day: 16, month: 6, year: 1995,
    hour: 4, minute: 0,
    viewYear: 2026
  };

  var chart = tuviLapLaSo_(input);
  var pi = chart.info.menh;

  Logger.log('=== FACTS CHO CUNG MỆNH (' + chart.palaces[pi].cung + ') ===');
  Logger.log('');

  var facts = tuviSinhFactsCung_(chart, pi);

  Logger.log('Tổng số facts sinh ra: ' + facts.length);
  Logger.log('');

  // Nhóm theo loại
  var manh = locFacts_(facts, { loai: 'manh' });
  var yeu = locFacts_(facts, { loai: 'yeu' });
  var trung = locFacts_(facts, { loai: 'trung' });

  Logger.log('--- ĐIỂM MẠNH (' + manh.length + ' facts) ---');
  manh.forEach(function(f, i) {
    Logger.log('  ' + (i + 1) + '. [' + f.nguon + '] (trọng số ' + f.trongSo + ')');
    Logger.log('     ' + f.yNghia);
  });

  Logger.log('');
  Logger.log('--- CẦN LƯU Ý (' + yeu.length + ' facts) ---');
  yeu.forEach(function(f, i) {
    Logger.log('  ' + (i + 1) + '. [' + f.nguon + '] (trọng số ' + f.trongSo + ')');
    Logger.log('     ' + f.yNghia);
  });

  Logger.log('');
  Logger.log('--- TRUNG TÍNH (' + trung.length + ' facts) ---');
  trung.forEach(function(f, i) {
    Logger.log('  ' + (i + 1) + '. [' + f.nguon + '] (trọng số ' + f.trongSo + ')');
    Logger.log('     ' + f.yNghia);
  });

  Logger.log('');
  Logger.log('✓ Nếu bạn thấy danh sách facts như trên, TuViHeThong.gs đã hoạt động.');
}


/**
 * Test sinh facts cho cung Phu Thê — kiểm tra trước khi viết kho văn.
 */
function testFactsPhuThe() {
  chiChayNoiBo_(arguments[0]);
  var input = {
    name: 'Test', gender: 'nam', calendar: 'duong',
    day: 16, month: 6, year: 1995, hour: 4, minute: 0, viewYear: 2026
  };

  var chart = tuviLapLaSo_(input);

  // Tìm cung Phu Thê (không phải cung Mệnh)
  var pi = -1;
  for (var i = 0; i < 12; i++) {
    if (chart.palaces[i].cung === 'Phu Thê') { pi = i; break; }
  }
  if (pi < 0) { Logger.log('✗ Không tìm thấy cung Phu Thê'); return; }

  Logger.log('=== FACTS CHO CUNG PHU THÊ ===');
  Logger.log('Cung ở vị trí index: ' + pi);
  Logger.log('Cung Phu Thê tại: ' + chart.palaces[pi].canTen + ' ' + chart.palaces[pi].chiTen);
  Logger.log('Chính tinh: ' + (chart.palaces[pi].chinh.map(function(s){return s.n;}).join(', ') || 'VCD'));
  Logger.log('');

  var facts = tuviSinhFactsPhuThe_(chart, pi);

  Logger.log('Tổng số facts: ' + facts.length);
  Logger.log('');

  var manh = locFacts_(facts, { loai: 'manh' });
  var yeu = locFacts_(facts, { loai: 'yeu' });
  var trung = locFacts_(facts, { loai: 'trung' });

  Logger.log('--- ĐIỂM MẠNH (' + manh.length + ' facts) ---');
  manh.forEach(function(f, i) {
    Logger.log('  ' + (i + 1) + '. [' + f.nguon + '] (trọng số ' + f.trongSo + ')');
    Logger.log('     ' + f.yNghia);
  });

  Logger.log('');
  Logger.log('--- CẦN LƯU Ý (' + yeu.length + ' facts) ---');
  yeu.forEach(function(f, i) {
    Logger.log('  ' + (i + 1) + '. [' + f.nguon + '] (trọng số ' + f.trongSo + ')');
    Logger.log('     ' + f.yNghia);
  });

  Logger.log('');
  Logger.log('--- TRUNG TÍNH (' + trung.length + ' facts) ---');
  trung.forEach(function(f, i) {
    Logger.log('  ' + (i + 1) + '. [' + f.nguon + '] (trọng số ' + f.trongSo + ')');
    Logger.log('     ' + f.yNghia);
  });

  Logger.log('');
  Logger.log('✓ Nếu bạn thấy danh sách facts cho Phu Thê, Patch 4a-1 đã hoạt động.');
}

/**
 * Test sinh 7 đoạn văn cung Phu Thê.
 */
function testVanCungPhuThe() {
  chiChayNoiBo_(arguments[0]);
  var input = {
    name: 'Test', gender: 'nam', calendar: 'duong',
    day: 16, month: 6, year: 1995, hour: 4, minute: 0, viewYear: 2026
  };

  var chart = tuviLapLaSo_(input);

  // Tìm cung Phu Thê
  var pi = -1;
  for (var i = 0; i < 12; i++) {
    if (chart.palaces[i].cung === 'Phu Thê') { pi = i; break; }
  }
  if (pi < 0) { Logger.log('✗ Không tìm thấy cung Phu Thê'); return; }

  var doan = sinhVanCungPhuThe_(chart, pi);

  Logger.log('=== 7 ĐOẠN VĂN CUNG PHU THÊ ===');
  Logger.log('Cung ở: ' + chart.palaces[pi].canTen + ' ' + chart.palaces[pi].chiTen);
  Logger.log('Chính tinh: ' + (chart.palaces[pi].chinh.map(function(s){return s.n;}).join(', ') || 'VCD'));
  Logger.log('Số đoạn: ' + doan.length);

  doan.forEach(function(d, i) {
    Logger.log('');
    Logger.log('--- ' + (i + 1) + '. ' + d.tieuDe + ' ---');
    if (d.text) Logger.log(d.text);
    if (d.list) d.list.forEach(function(x){ Logger.log('  • ' + x); });
  });

  Logger.log('');
  Logger.log('✓ Nếu bạn thấy 7 đoạn văn trên, Patch 4a-4 đã hoạt động.');
}

/**
 * Test sinh facts cho cung Tài Bạch.
 */
function testFactsTaiBach() {
  chiChayNoiBo_(arguments[0]);
  var input = {
    name: 'Test', gender: 'nam', calendar: 'duong',
    day: 16, month: 6, year: 1995, hour: 4, minute: 0, viewYear: 2026
  };

  var chart = tuviLapLaSo_(input);
  var pi = -1;
  for (var i = 0; i < 12; i++) {
    if (chart.palaces[i].cung === 'Tài Bạch') { pi = i; break; }
  }
  if (pi < 0) { Logger.log('✗ Không tìm thấy cung Tài Bạch'); return; }

  Logger.log('=== FACTS CHO CUNG TÀI BẠCH ===');
  Logger.log('Cung ở vị trí index: ' + pi);
  Logger.log('Cung Tài Bạch tại: ' + chart.palaces[pi].canTen + ' ' + chart.palaces[pi].chiTen);
  Logger.log('Chính tinh: ' + (chart.palaces[pi].chinh.map(function(s){return s.n;}).join(', ') || 'VCD'));
  Logger.log('');

  var facts = tuviSinhFactsTaiBach_(chart, pi);

  Logger.log('Tổng số facts: ' + facts.length);
  Logger.log('');

  var manh = locFacts_(facts, { loai: 'manh' });
  var yeu = locFacts_(facts, { loai: 'yeu' });
  var trung = locFacts_(facts, { loai: 'trung' });

  Logger.log('--- ĐIỂM MẠNH (' + manh.length + ' facts) ---');
  manh.forEach(function(f, i) {
    Logger.log('  ' + (i + 1) + '. [' + f.nguon + '] (trọng số ' + f.trongSo + ')');
    Logger.log('     ' + f.yNghia);
  });

  Logger.log('');
  Logger.log('--- CẦN LƯU Ý (' + yeu.length + ' facts) ---');
  yeu.forEach(function(f, i) {
    Logger.log('  ' + (i + 1) + '. [' + f.nguon + '] (trọng số ' + f.trongSo + ')');
    Logger.log('     ' + f.yNghia);
  });

  Logger.log('');
  Logger.log('--- TRUNG TÍNH (' + trung.length + ' facts) ---');
  trung.forEach(function(f, i) {
    Logger.log('  ' + (i + 1) + '. [' + f.nguon + '] (trọng số ' + f.trongSo + ')');
    Logger.log('     ' + f.yNghia);
  });

  Logger.log('');
  Logger.log('✓ Nếu bạn thấy danh sách facts cho Tài Bạch, Patch 4b-1 đã hoạt động.');
}

/**
 * Test sinh 6 đoạn văn cung Tài Bạch.
 */
function testVanCungTaiBach() {
  chiChayNoiBo_(arguments[0]);
  var input = {
    name: 'Test', gender: 'nam', calendar: 'duong',
    day: 16, month: 6, year: 1995, hour: 4, minute: 0, viewYear: 2026
  };

  var chart = tuviLapLaSo_(input);
  var pi = -1;
  for (var i = 0; i < 12; i++) {
    if (chart.palaces[i].cung === 'Tài Bạch') { pi = i; break; }
  }
  if (pi < 0) { Logger.log('✗ Không tìm thấy cung Tài Bạch'); return; }

  var doan = sinhVanCungTaiBach_(chart, pi);

  Logger.log('=== 6 ĐOẠN VĂN CUNG TÀI BẠCH ===');
  Logger.log('Cung ở: ' + chart.palaces[pi].canTen + ' ' + chart.palaces[pi].chiTen);
  Logger.log('Chính tinh: ' + (chart.palaces[pi].chinh.map(function(s){return s.n;}).join(', ') || 'VCD'));
  Logger.log('Số đoạn: ' + doan.length);

  doan.forEach(function(d, i) {
    Logger.log('');
    Logger.log('--- ' + (i + 1) + '. ' + d.tieuDe + ' ---');
    if (d.text) Logger.log(d.text);
    if (d.list) d.list.forEach(function(x){ Logger.log('  • ' + x); });
  });

  Logger.log('');
  Logger.log('✓ Nếu bạn thấy 6 đoạn văn trên, Patch 4b-4 đã hoạt động.');
}

/**
 * Test sinh facts cho cung Quan Lộc.
 */
function testFactsQuanLoc() {
  chiChayNoiBo_(arguments[0]);
  var input = {
    name: 'Test', gender: 'nam', calendar: 'duong',
    day: 16, month: 6, year: 1995, hour: 4, minute: 0, viewYear: 2026
  };

  var chart = tuviLapLaSo_(input);
  var pi = -1;
  for (var i = 0; i < 12; i++) {
    if (chart.palaces[i].cung === 'Quan Lộc') { pi = i; break; }
  }
  if (pi < 0) { Logger.log('✗ Không tìm thấy cung Quan Lộc'); return; }

  Logger.log('=== FACTS CHO CUNG QUAN LỘC ===');
  Logger.log('Cung ở vị trí index: ' + pi);
  Logger.log('Cung Quan Lộc tại: ' + chart.palaces[pi].canTen + ' ' + chart.palaces[pi].chiTen);
  Logger.log('Chính tinh: ' + (chart.palaces[pi].chinh.map(function(s){return s.n;}).join(', ') || 'VCD'));
  Logger.log('');

  var facts = tuviSinhFactsQuanLoc_(chart, pi);

  Logger.log('Tổng số facts: ' + facts.length);
  Logger.log('');

  var manh = locFacts_(facts, { loai: 'manh' });
  var yeu = locFacts_(facts, { loai: 'yeu' });
  var trung = locFacts_(facts, { loai: 'trung' });

  Logger.log('--- ĐIỂM MẠNH (' + manh.length + ' facts) ---');
  manh.forEach(function(f, i) {
    Logger.log('  ' + (i + 1) + '. [' + f.nguon + '] (trọng số ' + f.trongSo + ')');
    Logger.log('     ' + f.yNghia);
  });

  Logger.log('');
  Logger.log('--- CẦN LƯU Ý (' + yeu.length + ' facts) ---');
  yeu.forEach(function(f, i) {
    Logger.log('  ' + (i + 1) + '. [' + f.nguon + '] (trọng số ' + f.trongSo + ')');
    Logger.log('     ' + f.yNghia);
  });

  Logger.log('');
  Logger.log('--- TRUNG TÍNH (' + trung.length + ' facts) ---');
  trung.forEach(function(f, i) {
    Logger.log('  ' + (i + 1) + '. [' + f.nguon + '] (trọng số ' + f.trongSo + ')');
    Logger.log('     ' + f.yNghia);
  });

  Logger.log('');
  Logger.log('✓ Nếu bạn thấy danh sách facts cho Quan Lộc, Patch 4c-1 đã hoạt động.');
}

/**
 * Test sinh 7 đoạn văn cung Quan Lộc.
 */
function testVanCungQuanLoc() {
  chiChayNoiBo_(arguments[0]);
  var input = {
    name: 'Test', gender: 'nam', calendar: 'duong',
    day: 16, month: 6, year: 1995, hour: 4, minute: 0, viewYear: 2026
  };

  var chart = tuviLapLaSo_(input);
  var pi = -1;
  for (var i = 0; i < 12; i++) {
    if (chart.palaces[i].cung === 'Quan Lộc') { pi = i; break; }
  }
  if (pi < 0) { Logger.log('✗ Không tìm thấy cung Quan Lộc'); return; }

  var doan = sinhVanCungQuanLoc_(chart, pi);

  Logger.log('=== 7 ĐOẠN VĂN CUNG QUAN LỘC ===');
  Logger.log('Cung ở: ' + chart.palaces[pi].canTen + ' ' + chart.palaces[pi].chiTen);
  Logger.log('Chính tinh: ' + (chart.palaces[pi].chinh.map(function(s){return s.n;}).join(', ') || 'VCD'));
  Logger.log('Số đoạn: ' + doan.length);

  doan.forEach(function(d, i) {
    Logger.log('');
    Logger.log('--- ' + (i + 1) + '. ' + d.tieuDe + ' ---');
    if (d.text) Logger.log(d.text);
    if (d.list) d.list.forEach(function(x){ Logger.log('  • ' + x); });
  });

  Logger.log('');
  Logger.log('✓ Nếu bạn thấy 7 đoạn văn trên, Patch 4c-4 đã hoạt động.');
}

function testVanCungTuTuc() {
  chiChayNoiBo_(arguments[0]);
  var input = { name: 'Test', gender: 'nam', calendar: 'duong', day: 16, month: 6, year: 1995, hour: 4, minute: 0, viewYear: 2026 };
  var chart = tuviLapLaSo_(input);
  var bt = batTuLap_(input);
  chart._bt = bt;

  var pi = -1;
  for (var i = 0; i < 12; i++) { if (chart.palaces[i].cung === 'Tử Tức') { pi = i; break; } }
  if (pi < 0) { Logger.log('✗ Không tìm thấy cung Tử Tức'); return; }

  var doan = sinhVanCungTuTuc_(chart, pi);
  Logger.log('=== 6 ĐOẠN VĂN CUNG TỬ TỨC ===');
  Logger.log('Cung ở: ' + chart.palaces[pi].canTen + ' ' + chart.palaces[pi].chiTen);
  Logger.log('Chính tinh: ' + (chart.palaces[pi].chinh.map(function(s){return s.n;}).join(', ') || 'VCD'));
  Logger.log('Số đoạn: ' + doan.length);
  doan.forEach(function(d, i) {
    Logger.log('');
    Logger.log('--- ' + (i + 1) + '. ' + d.tieuDe + ' ---');
    if (d.text) Logger.log(d.text);
    if (d.list) d.list.forEach(function(x){ Logger.log('  • ' + x); });
  });
  Logger.log('');
  Logger.log('✓ Nếu bạn thấy 6 đoạn văn trên, Patch 4d đã hoạt động.');
}

function testVanCungTatAch() {
  chiChayNoiBo_(arguments[0]);
  var input = { name: 'Test', gender: 'nam', calendar: 'duong', day: 16, month: 6, year: 1995, hour: 4, minute: 0, viewYear: 2026 };
  var chart = tuviLapLaSo_(input);
  var pi = -1;
  for (var i = 0; i < 12; i++) { if (chart.palaces[i].cung === 'Tật Ách') { pi = i; break; } }
  if (pi < 0) { Logger.log('✗ Không tìm thấy cung Tật Ách'); return; }

  var doan = sinhVanCungTatAch_(chart, pi);
  Logger.log('=== 5 ĐOẠN VĂN CUNG TẬT ÁCH ===');
  Logger.log('Cung ở: ' + chart.palaces[pi].canTen + ' ' + chart.palaces[pi].chiTen);
  Logger.log('Chính tinh: ' + (chart.palaces[pi].chinh.map(function(s){return s.n;}).join(', ') || 'VCD'));
  Logger.log('Số đoạn: ' + doan.length);
  doan.forEach(function(d, i) {
    Logger.log('');
    Logger.log('--- ' + (i + 1) + '. ' + d.tieuDe + ' ---');
    if (d.text) Logger.log(d.text);
    if (d.list) d.list.forEach(function(x){ Logger.log('  • ' + x); });
  });
  Logger.log('');
  Logger.log('✓ Nếu bạn thấy 5 đoạn văn trên, Patch 4e đã hoạt động.');
}

function testVanCungDienTrach() {
  chiChayNoiBo_(arguments[0]);
  var input = { name: 'Test', gender: 'nam', calendar: 'duong', day: 16, month: 6, year: 1995, hour: 4, minute: 0, viewYear: 2026 };
  var chart = tuviLapLaSo_(input);
  var pi = -1;
  for (var i = 0; i < 12; i++) { if (chart.palaces[i].cung === 'Điền Trạch') { pi = i; break; } }
  if (pi < 0) { Logger.log('✗ Không tìm thấy cung Điền Trạch'); return; }

  var doan = sinhVanCungDienTrach_(chart, pi);
  Logger.log('=== 5 ĐOẠN VĂN CUNG ĐIỀN TRẠCH ===');
  Logger.log('Cung ở: ' + chart.palaces[pi].canTen + ' ' + chart.palaces[pi].chiTen);
  Logger.log('Chính tinh: ' + (chart.palaces[pi].chinh.map(function(s){return s.n;}).join(', ') || 'VCD'));
  Logger.log('Số đoạn: ' + doan.length);
  doan.forEach(function(d, i) {
    Logger.log('');
    Logger.log('--- ' + (i + 1) + '. ' + d.tieuDe + ' ---');
    if (d.text) Logger.log(d.text);
    if (d.list) d.list.forEach(function(x){ Logger.log('  • ' + x); });
  });
  Logger.log('');
  Logger.log('✓ Nếu bạn thấy 5 đoạn văn trên, Patch 4f đã hoạt động.');
}
/**
 * Test sinh 9 đoạn văn cung Mệnh — kiểm tra 4 đoạn mới từ facts.
 * Chạy hàm này để xem văn trước khi hiển thị lên giao diện.
 */
/**
 * Kiểm tra toàn bộ chuỗi: sinh facts → sinh văn → đóng gói object.
 * Chạy hàm này để xác định lỗi nằm ở tầng nào.
 */
function testVanCungMenh() {
  chiChayNoiBo_(arguments[0]);
  var input = {
    name: 'Test', gender: 'nam', calendar: 'duong',
    day: 16, month: 6, year: 1995, hour: 4, minute: 0, viewYear: 2026
  };

  Logger.log('=== BƯỚC 1: An sao ===');
  var chart = tuviLapLaSo_(input);
  var pi = chart.info.menh;
  Logger.log('Cung Mệnh index: ' + pi + ' (' + chart.palaces[pi].cung + ')');

  Logger.log('=== BƯỚC 2: Sinh facts ===');
  var facts = tuviSinhFactsCung_(chart, pi);
  Logger.log('Tổng số facts: ' + facts.length);

  Logger.log('=== BƯỚC 3: Sinh 4 đoạn văn ===');
  var van = {
    diemManh: tuviSinhDoanDiemManh_(facts),
    diemYeu:  tuviSinhDoanDiemYeu_(facts),
    anhHuong: tuviSinhDoanAnhHuong_(facts),
    dacBiet:  tuviSinhDoanDacBiet_(facts)
  };
  Logger.log('van = ' + JSON.stringify(van, null, 2));

  Logger.log('=== BƯỚC 4: Lập lá số đầy đủ → kiểm tra cung[0].vanFacts ===');
  var r = lapLaSoDayDu_(input);
  if (!r.chiTiet) {
    Logger.log('✗ r.chiTiet = null/undefined → lỗi ở luanChiTiet');
    return;
  }
  if (!r.chiTiet.cung) {
    Logger.log('✗ r.chiTiet.cung = null/undefined → lỗi ở lgLuan12Cung_');
    return;
  }
  Logger.log('r.chiTiet.cung[0].cung = ' + r.chiTiet.cung[0].cung);
  Logger.log('r.chiTiet.cung[0].vanFacts = ' + JSON.stringify(r.chiTiet.cung[0].vanFacts));
  Logger.log('Các key của cung[0]: ' + Object.keys(r.chiTiet.cung[0]).join(', '));

  Logger.log('=== KẾT LUẬN ===');
  if (r.chiTiet.cung[0].vanFacts) {
    Logger.log('✓ vanFacts có giá trị → backend OK. Lỗi nằm ở frontend (Script.html).');
  } else {
    Logger.log('✗ vanFacts undefined → LuanGiai.gs chưa được sửa đúng.');
  }
}