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
    yNghia: 'Bạn sinh ra đã mang khí chất của một người đứng đầu — người khác tự nhiên nể trọng và tìm đến bạn khi cần một quyết định.',
    trongSo: 1.6,
    tags: ['tinh_cach', 'lanh_dao', 'uy_quyen'],
    doiTuong: 'ban_than'
  },
  'Thiên Cơ': {
    yNghia: 'Bạn có đầu óc nhanh nhạy, giỏi phân tích và lên kế hoạch, thích tìm tòi, đặt câu hỏi và khéo tay.',
    trongSo: 1.5,
    tags: ['tinh_cach', 'tri_tue', 'phan_tich'],
    doiTuong: 'ban_than'
  },
  'Thái Dương': {
    yNghia: 'Bạn là người nhiệt tình, cởi mở, thích giúp đỡ người khác và sống hướng ngoại.',
    trongSo: 1.5,
    tags: ['tinh_cach', 'huong_ngoai', 'danh_tieng'],
    doiTuong: 'ban_than'
  },
  'Vũ Khúc': {
    yNghia: 'Bạn quyết đoán, thực tế, giỏi xoay xở chuyện tiền bạc, không thích vòng vo.',
    trongSo: 1.5,
    tags: ['tinh_cach', 'tai_chinh', 'quyet_doan'],
    doiTuong: 'ban_than'
  },
  'Thiên Đồng': {
    yNghia: 'Bạn hiền hòa, lạc quan, dễ gần, biết cách tận hưởng cuộc sống.',
    trongSo: 1.3,
    tags: ['tinh_cach', 'hiem_hoa', 'huong_thu'],
    doiTuong: 'ban_than'
  },
  'Liêm Trinh': {
    yNghia: 'Bạn sống có nguyên tắc, cứng rắn, có tài tổ chức và không chấp nhận sự dễ dãi.',
    trongSo: 1.4,
    tags: ['tinh_cach', 'nguyen_tac', 'ky_luat'],
    doiTuong: 'ban_than'
  },
  'Thiên Phủ': {
    yNghia: 'Bạn điềm đạm, đáng tin, giỏi giữ của, làm gì cũng chắc chắn.',
    trongSo: 1.5,
    tags: ['tinh_cach', 'on_dinh', 'tich_luy'],
    doiTuong: 'ban_than'
  },
  'Thái Âm': {
    yNghia: 'Bạn dịu dàng, tinh tế, giỏi chăm lo cho người khác và có con mắt thẩm mỹ.',
    trongSo: 1.4,
    tags: ['tinh_cach', 'tinh_te', 'cham_soc'],
    doiTuong: 'ban_than'
  },
  'Tham Lang': {
    yNghia: 'Bạn đa tài, giao tiếp giỏi, thích khám phá cái mới và ham học hỏi.',
    trongSo: 1.4,
    tags: ['tinh_cach', 'da_tai', 'giao_te'],
    doiTuong: 'ban_than'
  },
  'Cự Môn': {
    yNghia: 'Bạn nói giỏi, lập luận sắc bén, thích tìm hiểu sự thật.',
    trongSo: 1.3,
    tags: ['tinh_cach', 'ngon_luan', 'phan_bien'],
    doiTuong: 'ban_than'
  },
  'Thiên Tướng': {
    yNghia: 'Bạn chính trực, nghĩa hiệp, sống đàng hoàng, hay đứng ra bênh vực kẻ yếu.',
    trongSo: 1.5,
    tags: ['tinh_cach', 'chinh_truc', 'nghia_hip'],
    doiTuong: 'ban_than'
  },
  'Thiên Lương': {
    yNghia: 'Bạn nhân hậu, thích che chở người khác, có duyên với người lớn tuổi.',
    trongSo: 1.5,
    tags: ['tinh_cach', 'nhan_hau', 'che_cho'],
    doiTuong: 'ban_than'
  },
  'Thất Sát': {
    yNghia: 'Bạn dũng cảm, quyết liệt, dám đương đầu và không chịu khuất phục.',
    trongSo: 1.5,
    tags: ['tinh_cach', 'dung_manh', 'quyet_liet'],
    doiTuong: 'ban_than'
  },
  'Phá Quân': {
    yNghia: 'Bạn thích đổi mới, dám phá bỏ cái cũ, không thích gò bó.',
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
  'Tả Phù':     { yNghia: 'Bạn có duyên được người khác giúp đỡ khi cần.', loai: 'manh', trongSo: 1.2, tags: ['quy_nhan', 'tro_giup'] },
  'Hữu Bật':    { yNghia: 'Bạn có duyên được người khác giúp đỡ khi cần.', loai: 'manh', trongSo: 1.2, tags: ['quy_nhan', 'tro_giup'] },
  'Văn Xương':  { yNghia: 'Bạn có duyên với học hành, chữ nghĩa và các lĩnh vực cần sự tinh tế.', loai: 'manh', trongSo: 1.1, tags: ['hoc_van', 'tri_tue'] },
  'Văn Khúc':   { yNghia: 'Bạn ăn nói có duyên và có khiếu với nghệ thuật, cái đẹp.', loai: 'manh', trongSo: 1.1, tags: ['nghe_thuat', 'giao_te'] },
  'Thiên Khôi': { yNghia: 'Bạn thường được những người bề trên nâng đỡ.', loai: 'manh', trongSo: 1.3, tags: ['quy_nhan', 'be_tren'] },
  'Thiên Việt': { yNghia: 'Bạn thường gặp được người tốt sẵn lòng giúp mình.', loai: 'manh', trongSo: 1.3, tags: ['quy_nhan'] },
  'Lộc Tồn':    { yNghia: 'Cuộc sống của bạn tương đối ổn định về vật chất.', loai: 'manh', trongSo: 1.5, tags: ['tai_loc', 'on_dinh'] },
  'Thiên Mã':   { yNghia: 'Bạn là người năng động, thích di chuyển và đổi mới.', loai: 'manh', trongSo: 0.9, tags: ['di_chuyen', 'nang_dong'] },
  'Hóa Lộc':    { yNghia: 'Tiền bạc của bạn thường hanh thông, có nhiều cơ hội kiếm tiền.', loai: 'manh', trongSo: 1.7, tags: ['tai_loc', 'may_man'] },
  'Hóa Quyền':  { yNghia: 'Bạn có uy tự nhiên, thường được người khác nghe theo.', loai: 'manh', trongSo: 1.6, tags: ['uy_quyen', 'lanh_dao'] },
  'Hóa Khoa':   { yNghia: 'Bạn có duyên với học vấn và khi gặp khó thường có người giúp giải quyết.', loai: 'manh', trongSo: 1.5, tags: ['hoc_van', 'danh_tieng'] },
  'Thiên Đức':  { yNghia: 'Bạn được phù hộ, gặp khó khăn thường có người giúp đỡ.', loai: 'manh', trongSo: 1.0, tags: ['phuc_duc'] },
  'Nguyệt Đức': { yNghia: 'Bạn là người hiền lành và được hưởng phúc.', loai: 'manh', trongSo: 1.0, tags: ['phuc_duc'] },
  'Long Trì':   { yNghia: 'Bạn có khí chất thanh nhã, dễ được người khác quý mến.', loai: 'manh', trongSo: 0.9, tags: ['khi_chat'] },
  'Phượng Các': { yNghia: 'Bạn có khí chất thanh nhã, dễ được người khác quý mến.', loai: 'manh', trongSo: 0.9, tags: ['khi_chat'] },
  'Hồng Loan':  { yNghia: 'Bạn có duyên về ngoại hình, dễ được người khác yêu mến.', loai: 'manh', trongSo: 1.0, tags: ['tinh_duyen', 'ngoai_hinh'] },
  'Thiên Hỷ':   { yNghia: 'Bạn có duyên với chuyện vui, hỷ sự.', loai: 'manh', trongSo: 1.0, tags: ['hy_su', 'tinh_duyen'] },

  // --- Hung tinh ---
  'Kình Dương': { yNghia: 'Bạn có cá tính mạnh mẽ và quyết đoán, nhưng đôi khi điều đó khiến bạn dễ va chạm với người xung quanh.', loai: 'yeu', trongSo: 1.3, tags: ['ca_tinh', 'va_cham'] },
  'Đà La':      { yNghia: 'Bạn dễ bị trì hoãn, dây dưa, đôi khi bỏ lỡ cơ hội vì do dự quá lâu.', loai: 'yeu', trongSo: 1.2, tags: ['tri_hoan', 'do_du'] },
  'Hỏa Tinh':   { yNghia: 'Bạn có thể nóng tính, hành động nhanh và đôi khi hối hận vì đã quá vội vàng.', loai: 'yeu', trongSo: 1.2, tags: ['nong_tinh', 'boc_phat'] },
  'Linh Tinh':  { yNghia: 'Bạn hay lo nghĩ và đôi khi gặp những chuyện bất ngờ không lường trước.', loai: 'yeu', trongSo: 1.1, tags: ['lo_nghi', 'bat_ngo'] },
  'Địa Không':  { yNghia: 'Bạn có những suy nghĩ khác người, thích những điều lớn lao, nhưng cũng dễ hụt hẫng khi thực tế không như mơ.', loai: 'yeu', trongSo: 1.2, tags: ['khac_nguoi', 'hut_hang'] },
  'Địa Kiếp':   { yNghia: 'Cuộc đời bạn có những lúc thăng trầm, đôi khi gặp mất mát đột ngột.', loai: 'yeu', trongSo: 1.3, tags: ['thang_tram', 'mat_mat'] },
  'Hóa Kỵ':     { yNghia: 'Bạn dễ bị hiểu lầm và đôi khi gặp chuyện không như ý — quan trọng là giữ được sự kiên nhẫn.', loai: 'yeu', trongSo: 1.5, tags: ['hieu_lam', 'tro_ngai'] },
  'Thiên Hình': { yNghia: 'Bạn là người nghiêm khắc với chính mình và đôi khi cả với người khác.', loai: 'yeu', trongSo: 1.0, tags: ['nghiem_khac'] },
  'Thiên Riêu': { yNghia: 'Bạn dễ vướng vào những chuyện tình cảm phức tạp.', loai: 'yeu', trongSo: 0.9, tags: ['tinh_cam', 'phuc_tap'] },
  'Tang Môn':   { yNghia: 'Bạn nhạy cảm và đôi khi hay buồn phiền về những chuyện nhỏ.', loai: 'yeu', trongSo: 0.9, tags: ['buon_phien'] },
  'Bạch Hổ':    { yNghia: 'Bạn nên cẩn thận với những chuyện bất ngờ — đề phòng tai nạn nhỏ khi đi lại.', loai: 'yeu', trongSo: 1.0, tags: ['tai_nan', 'bat_ngo'] },
  'Thiên Khốc': { yNghia: 'Bạn là người nhạy cảm, dễ xúc động và hay lo lắng.', loai: 'yeu', trongSo: 0.9, tags: ['nhao_cam'] },
  'Thiên Hư':   { yNghia: 'Bạn có thể gặp những lúc hao tổn hoặc hụt hẫng không rõ lý do.', loai: 'yeu', trongSo: 0.9, tags: ['hao_ton'] },
  'Cô Thần':    { yNghia: 'Bạn thích sống độc lập và đôi khi cảm thấy cô đơn — nhưng bạn không yếu đuối, chỉ là không muốn phụ thuộc ai.', loai: 'yeu', trongSo: 0.8, tags: ['doc_lap', 'co_don'] },
  'Quả Tú':     { yNghia: 'Bạn thích sống độc lập và đôi khi cảm thấy cô đơn — nhưng bạn không yếu đuối, chỉ là không muốn phụ thuộc ai.', loai: 'yeu', trongSo: 0.8, tags: ['doc_lap', 'co_don'] }
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
  'tuan':  'Cung này có Tuần đóng — bạn sẽ gặp một số trở ngại trong giai đoạn đầu, nhưng sau đó mọi việc hanh thông dần.',
  'triet': 'Cung này có Triệt đóng — tuổi trẻ thường gặp khó khăn ở lĩnh vực này, sau 30 tuổi mới ổn định rõ.',
  'ca_hai':'Cung này bị cả Tuần và Triệt — đây là điểm "mờ" của bạn: càng lớn tuổi càng sáng rõ, nhưng cần kiên nhẫn vượt qua giai đoạn đầu.'
};

/**
 * Ngũ hành cung so với bản mệnh — 5 trường hợp.
 */
var TUVI_FACT_NGUHANH_CUNG = {
  'sinh':     { yNghia: 'Ngũ hành của cung này sinh cho bản mệnh của bạn — đây là điểm thuận tự nhiên, mọi việc hanh thông.', loai: 'manh', trongSo: 1.0, tags: ['thuan_loi'] },
  'duoc_sinh':{ yNghia: 'Bản mệnh của bạn sinh cho cung này — bạn phải bỏ công sức nhiều hơn mức bình thường, nhưng vẫn đạt được.', loai: 'trung', trongSo: 0.8, tags: ['hao_cong'] },
  'binh':     { yNghia: 'Ngũ hành cung và bản mệnh đồng hành — mọi việc ở mức ổn định, không quá thuận cũng không quá trở ngại.', loai: 'trung', trongSo: 0.6, tags: ['on_dinh'] },
  'khac':     { yNghia: 'Ngũ hành cung khắc bản mệnh của bạn — lĩnh vực này có thể tạo áp lực, cần sự cẩn trọng và kiên trì.', loai: 'yeu', trongSo: 1.0, tags: ['ap_luc'] },
  'bi_khac':  { yNghia: 'Bản mệnh của bạn khắc ngũ hành cung — bạn có thể chủ động chế ngự lĩnh vực này, nhưng phải bỏ nhiều công sức.', loai: 'trung', trongSo: 0.9, tags: ['chu_dong'] }
};

/* ============================================================
 *  BẢNG DỮ LIỆU VÒNG SAO (dùng ở phần facts nâng cao)
 * ============================================================ */

/**
 * Ý nghĩa dễ hiểu của 12 sao vòng Tràng Sinh.
 * Tràng Sinh mô tả "khí" của cung — đang sinh sôi, đang thịnh, hay đang suy.
 */
var TUVI_FACT_TRANG_SINH = {
  'Tràng Sinh': { yNghia: 'Tràng Sinh (sinh sôi, khởi đầu): cung này đang ở giai đoạn khởi sinh — có sức sống, phát triển bền, nhiều tiềm năng.', loai: 'manh', trongSo: 0.9 },
  'Mộc Dục':    { yNghia: 'Mộc Dục (tắm gội – thay đổi, đào hoa): cung này đang ở giai đoạn chuyển tiếp, chưa ổn định — có thể có chuyện tình cảm, hoặc mới bắt đầu chưa chắc chắn.', loai: 'trung', trongSo: 0.7 },
  'Quan Đới':   { yNghia: 'Quan Đới (chuẩn bị thành đạt): cung này đang tích lũy — sắp đến lúc bứt phá.', loai: 'manh', trongSo: 0.8 },
  'Lâm Quan':   { yNghia: 'Lâm Quan (thành đạt, có vị trí): cung này đang trên đà thăng tiến — năng lực được thể hiện rõ.', loai: 'manh', trongSo: 1.0 },
  'Đế Vượng':   { yNghia: 'Đế Vượng (cực thịnh): cung này đang ở đỉnh cao của chu kỳ — đây là điểm sáng nhất. Nhưng cũng cần phòng khi quá đà.', loai: 'manh', trongSo: 1.2 },
  'Suy':        { yNghia: 'Suy (suy giảm): cung này đang ở giai đoạn suy yếu — nên giữ gìn hơn là mở rộng.', loai: 'yeu', trongSo: 0.7 },
  'Bệnh':       { yNghia: 'Bệnh (trì trệ): cung này đang ở giai đoạn trì trệ — cần chăm chút, không nên bỏ mặc.', loai: 'yeu', trongSo: 0.8 },
  'Tử':         { yNghia: 'Tử (ngưng trệ): cung này ít biến động, thiếu sinh khí — có thể coi là "vùng tĩnh" trong cuộc đời bạn.', loai: 'trung', trongSo: 0.7 },
  'Mộ':         { yNghia: 'Mộ (tàng trữ, tích lũy): cung này mang tính tàng trữ — giữ được nhưng không bung ra mạnh.', loai: 'trung', trongSo: 0.7 },
  'Tuyệt':      { yNghia: 'Tuyệt (cùng cực, đứt đoạn): cung này ở thế cùng cực — dễ đứt đoạn, nhưng cũng là cơ hội để bắt đầu lại từ đầu.', loai: 'yeu', trongSo: 0.8 },
  'Thai':       { yNghia: 'Thai (thai nghén): cung này đang trong giai đoạn ấp ủ — có ý tưởng nhưng chưa thành hình, cần thời gian.', loai: 'trung', trongSo: 0.7 },
  'Dưỡng':      { yNghia: 'Dưỡng (nuôi dưỡng): cung này đang được bồi đắp — phát triển chậm nhưng chắc, có người nâng đỡ.', loai: 'manh', trongSo: 0.8 }
};

/**
 * Ý nghĩa dễ hiểu của 12 sao vòng Bác Sĩ.
 */
var TUVI_FACT_BAC_SI = {
  'Bác Sĩ':     { yNghia: 'Bác Sĩ (thông minh, học rộng): có yếu tố thông minh, học rộng ở lĩnh vực này.', loai: 'manh', trongSo: 0.7 },
  'Lực Sĩ':     { yNghia: 'Lực Sĩ (sức mạnh): có sức mạnh, có khả năng đảm nhận việc khó.', loai: 'manh', trongSo: 0.6 },
  'Thanh Long': { yNghia: 'Thanh Long (hỷ sự, may mắn): có may mắn, có hỷ sự trong lĩnh vực này.', loai: 'manh', trongSo: 0.9 },
  'Tiểu Hao':   { yNghia: 'Tiểu Hao (hao tán nhỏ): dễ có hao tán nhỏ, chi tiêu lặt vặt.', loai: 'yeu', trongSo: 0.5 },
  'Tướng Quân': { yNghia: 'Tướng Quân (uy dũng, quyền hành): có uy dũng, có quyền hành trong lĩnh vực này.', loai: 'manh', trongSo: 0.8 },
  'Tấu Thư':    { yNghia: 'Tấu Thư (văn thư, ăn nói): có duyên với giấy tờ, văn thư, ăn nói.', loai: 'manh', trongSo: 0.5 },
  'Phi Liêm':   { yNghia: 'Phi Liêm (thị phi, nhanh nhẹn): dễ có thị phi, chuyện ong bướm.', loai: 'yeu', trongSo: 0.5 },
  'Hỷ Thần':    { yNghia: 'Hỷ Thần (vui vẻ, hỷ sự): có niềm vui, có hỷ sự ở lĩnh vực này.', loai: 'manh', trongSo: 0.7 },
  'Bệnh Phù':   { yNghia: 'Bệnh Phù (bệnh tật): sức khỏe ở lĩnh vực này cần chú ý.', loai: 'yeu', trongSo: 0.7 },
  'Đại Hao':    { yNghia: 'Đại Hao (hao tán lớn): dễ có hao tán lớn, mất mát đáng kể.', loai: 'yeu', trongSo: 0.9 },
  'Phục Binh':  { yNghia: 'Phục Binh (tiểu nhân ngầm): cần đề phòng tiểu nhân ngầm phá.', loai: 'yeu', trongSo: 0.8 },
  'Quan Phủ':   { yNghia: 'Quan Phủ (kiện tụng, giấy tờ): dễ dính vào giấy tờ, kiện tụng, tranh chấp.', loai: 'yeu', trongSo: 0.8 }
};

/**
 * Ý nghĩa dễ hiểu của 12 sao vòng Thái Tuế.
 */
var TUVI_FACT_THAI_TUE = {
  'Thái Tuế':    { yNghia: 'Thái Tuế (uy nghi, thị phi): có uy nghi, có tiếng nói, nhưng cũng dễ có thị phi.', loai: 'trung', trongSo: 0.6 },
  'Thiếu Dương': { yNghia: 'Thiếu Dương (thông minh, vui vẻ): có sự thông minh, có niềm vui trong lĩnh vực này.', loai: 'manh', trongSo: 0.7 },
  'Tang Môn':    { yNghia: 'Tang Môn (tang thương, buồn phiền): dễ có buồn phiền, chuyện không vui.', loai: 'yeu', trongSo: 0.8 },
  'Thiếu Âm':    { yNghia: 'Thiếu Âm (hiền hòa, phúc nhẹ): có sự hiền hòa, có chút phúc nhẹ.', loai: 'manh', trongSo: 0.6 },
  'Quan Phù':    { yNghia: 'Quan Phù (kiện cáo, giấy tờ): dễ dính đến giấy tờ, kiện cáo.', loai: 'yeu', trongSo: 0.7 },
  'Tử Phù':      { yNghia: 'Tử Phù (buồn thương, trở ngại): dễ có chuyện buồn thương, trở ngại.', loai: 'yeu', trongSo: 0.8 },
  'Tuế Phá':     { yNghia: 'Tuế Phá (phá tán, bướng bỉnh): có xu hướng phá tán, bướng bỉnh.', loai: 'yeu', trongSo: 0.7 },
  'Long Đức':    { yNghia: 'Long Đức (phúc đức, giải hung): được phúc đức che chở, gặp dữ hóa lành.', loai: 'manh', trongSo: 0.9 },
  'Bạch Hổ':     { yNghia: 'Bạch Hổ (tai nạn, tang sự): đề phòng tai nạn, tang sự, kiện tụng.', loai: 'yeu', trongSo: 0.9 },
  'Phúc Đức':    { yNghia: 'Phúc Đức (phúc đức, giải hung): được phúc đức che chở, gặp khó có người giúp.', loai: 'manh', trongSo: 0.9 },
  'Điếu Khách':  { yNghia: 'Điếu Khách (tin buồn, khoác lác): dễ có tin buồn, chuyện không như ý.', loai: 'yeu', trongSo: 0.6 },
  'Trực Phù':    { yNghia: 'Trực Phù (buồn phiền, trở ngại): dễ có buồn phiền, trở ngại.', loai: 'yeu', trongSo: 0.6 }
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
    yNghia: 'Bạn đời của bạn thuộc mẫu người có uy, tự trọng cao, thích được tôn trọng. Họ thường giữ vai trò chủ động trong gia đình. Hôn nhân có xu hướng ổn định nếu cả hai biết nhường nhịn nhau.',
    trongSo: 1.5, tags: ['phoi_ngau_uy_quyen', 'hon_nhan_huong_on_dinh']
  },
  'Thiên Cơ': {
    yNghia: 'Bạn đời của bạn thuộc mẫu người có đầu óc, nhạy bén, thích suy nghĩ. Cuộc sống hôn nhân có xu hướng có nhiều thay đổi — có thể đổi chỗ ở hoặc thay đổi công việc vài lần.',
    trongSo: 1.4, tags: ['phoi_ngau_tri_tue', 'hon_nhan_co_thay_doi']
  },
  'Thái Dương': {
    yNghia: 'Bạn đời của bạn thuộc mẫu người hướng ngoại, nhiệt tình, thích giúp đỡ người khác. Hôn nhân có xu hướng rạng rỡ nếu cả hai cùng vun đắp.',
    trongSo: 1.5, tags: ['phoi_ngau_huong_ngoai', 'hon_nhan_co_the_rang_ro']
  },
  'Vũ Khúc': {
    yNghia: 'Bạn đời của bạn thuộc mẫu người cương nghị, thực tế, ít nói lời tình cảm nhưng hành động thiết thực. Nếu kết hôn muộn, hôn nhân có xu hướng bền vững hơn.',
    trongSo: 1.4, tags: ['phoi_ngau_thuc_te', 'nen_ket_hon_muon']
  },
  'Thiên Đồng': {
    yNghia: 'Bạn đời của bạn thuộc mẫu người hiền hòa, vui vẻ, dễ gần, thích cuộc sống nhẹ nhàng. Hôn nhân có xu hướng êm ấm nếu cả hai cùng vun đắp.',
    trongSo: 1.3, tags: ['phoi_ngau_hiem_hoa', 'hon_nhan_huong_em_am']
  },
  'Liêm Trinh': {
    yNghia: 'Bạn đời của bạn thuộc mẫu người có cá tính mạnh, sống nguyên tắc, có sức hút tự nhiên. Hôn nhân nhiều đam mê nhưng cần tránh ghen tuông và nóng nảy.',
    trongSo: 1.4, tags: ['phoi_ngau_ca_tinh', 'hon_nhan_nong_nan']
  },
  'Thiên Phủ': {
    yNghia: 'Bạn đời của bạn thuộc mẫu người điềm đạm, chín chắn, biết lo liệu. Đây là mẫu người bạn đời phù hợp với hôn nhân bền vững, coi trọng sự ổn định.',
    trongSo: 1.5, tags: ['phoi_ngau_dang_tin', 'phu_hop_hon_nhan_ben_vung']
  },
  'Thái Âm': {
    yNghia: 'Bạn đời của bạn thuộc mẫu người dịu dàng, tinh tế, giàu cảm xúc. Hôn nhân có xu hướng êm ấm, nhưng đôi khi bạn đời có tâm sự riêng mà ít chia sẻ.',
    trongSo: 1.4, tags: ['phoi_ngau_tinh_te', 'hon_nhan_huong_em_am']
  },
  'Tham Lang': {
    yNghia: 'Bạn đời của bạn thuộc mẫu người đa tài, có sức hút, thích khám phá. Tình duyên phong phú — hôn nhân đòi hỏi sự chung thủy và tin tưởng từ cả hai phía.',
    trongSo: 1.4, tags: ['phoi_ngau_hao_hoa', 'can_chung_thuy']
  },
  'Cự Môn': {
    yNghia: 'Bạn đời của bạn thuộc mẫu người sắc sảo, giỏi lý luận. Hôn nhân cần lắng nghe nhiều hơn nói để tránh bất đồng do lời ăn tiếng nói.',
    trongSo: 1.3, tags: ['phoi_ngau_ngon_luan', 'can_lang_nghe']
  },
  'Thiên Tướng': {
    yNghia: 'Bạn đời của bạn thuộc mẫu người chính trực, đàng hoàng, chu đáo, biết quan tâm. Hôn nhân có xu hướng hòa thuận, bạn đời thường giúp đỡ bạn nhiều.',
    trongSo: 1.5, tags: ['phoi_ngau_chinh_truc', 'hon_nhan_hoa_thuan']
  },
  'Thiên Lương': {
    yNghia: 'Bạn đời của bạn thuộc mẫu người nhân hậu, chín chắn, có tinh thần che chở — thường lớn tuổi hơn hoặc trưởng thành sớm. Hôn nhân có xu hướng bền vững.',
    trongSo: 1.5, tags: ['phoi_ngau_nhan_hau', 'hon_nhan_ben_vung']
  },
  'Thất Sát': {
    yNghia: 'Bạn đời của bạn thuộc mẫu người mạnh mẽ, quyết đoán, có tham vọng — nhưng cũng dễ nóng tính. Duyên tình có xu hướng đến muộn hoặc trải qua vài biến cố trước khi ổn định.',
    trongSo: 1.4, tags: ['phoi_ngau_dung_manh', 'duyen_tinh_muon']
  },
  'Phá Quân': {
    yNghia: 'Bạn đời của bạn thuộc mẫu người phóng khoáng, thích đổi mới, không chịu gò bó. Hôn nhân có thể có nhiều thay đổi — nên kết hôn muộn và bao dung cho nhau.',
    trongSo: 1.4, tags: ['phoi_ngau_pha_cach', 'can_bao_dung']
  }
};

/**
 * Ý nghĩa các phụ tinh đặc thù tại cung Phu Thê — bổ trợ cho chân dung.
 */
var TUVI_FACT_PHUTHE_PHUTINH = {
  // Cát tinh — hôn nhân tốt đẹp hơn
  'Đào Hoa':    { yNghia: 'Bạn đời của bạn duyên dáng, được nhiều người yêu mến. Tình cảm đến sớm và nồng nàn.', loai: 'manh', trongSo: 1.0, tags: ['phoi_ngau_duyen_dang', 'tinh_cam_som'] },
  'Hồng Loan':  { yNghia: 'Hôn nhân có duyên — bạn dễ lập gia đình, bạn đời ưa nhìn và được lòng người.', loai: 'manh', trongSo: 1.1, tags: ['hon_nhan_co_duyen'] },
  'Thiên Hỷ':   { yNghia: 'Hôn nhân có nhiều niềm vui, hỷ sự — vợ chồng biết cách mang lại tiếng cười cho nhau.', loai: 'manh', trongSo: 1.0, tags: ['hon_nhan_vui_ve'] },
  'Tả Phù':     { yNghia: 'Bạn đời của bạn giúp đỡ bạn nhiều — nhưng cũng là dấu hiệu cần đề phòng người thứ ba xuất hiện.', loai: 'manh', trongSo: 0.9, tags: ['phoi_ngau_ho_tro', 'canh_bao_nguoi_thu_ba'] },
  'Hữu Bật':    { yNghia: 'Bạn đời của bạn hỗ trợ bạn trong cuộc sống — nhưng cần cẩn thận chuyện tình cảm phức tạp.', loai: 'manh', trongSo: 0.9, tags: ['phoi_ngau_ho_tro', 'canh_bao_nguoi_thu_ba'] },
  'Văn Xương':  { yNghia: 'Bạn đời của bạn có học thức, ăn nói nhã nhặn, có khiếu văn nghệ.', loai: 'manh', trongSo: 1.0, tags: ['phoi_ngau_hoc_thuc'] },
  'Văn Khúc':   { yNghia: 'Bạn đời của bạn khéo ăn nói, có duyên giao tiếp và có khiếu nghệ thuật.', loai: 'manh', trongSo: 1.0, tags: ['phoi_ngau_kheo_an_noi'] },
  'Thiên Khôi': { yNghia: 'Bạn đời của bạn có địa vị, được người bề trên nâng đỡ — bạn được nhờ qua hôn nhân.', loai: 'manh', trongSo: 1.1, tags: ['phoi_ngau_quy_nhan'] },
  'Thiên Việt': { yNghia: 'Bạn đời của bạn là quý nhân của bạn — mang lại cơ hội và may mắn.', loai: 'manh', trongSo: 1.1, tags: ['phoi_ngau_quy_nhan'] },
  'Lộc Tồn':    { yNghia: 'Bạn đời của bạn giỏi giữ của, mang lại ổn định tài chính cho gia đình.', loai: 'manh', trongSo: 1.3, tags: ['phoi_ngau_tai_loc'] },
  'Hóa Lộc':    { yNghia: 'Bạn đời của bạn mang lại tài lộc — hôn nhân thịnh vượng và ấm no.', loai: 'manh', trongSo: 1.5, tags: ['phoi_ngau_tai_loc'] },
  'Hóa Quyền':  { yNghia: 'Bạn đời của bạn có năng lực, thích nắm quyền quyết định trong gia đình.', loai: 'manh', trongSo: 1.3, tags: ['phoi_ngau_uy_quyen'] },
  'Hóa Khoa':   { yNghia: 'Bạn đời của bạn có danh tiếng, học vấn — hôn nhân được nể trọng.', loai: 'manh', trongSo: 1.3, tags: ['phoi_ngau_danh_tieng'] },
  'Long Trì':   { yNghia: 'Bạn đời của bạn có phong thái thanh nhã, lịch sự.', loai: 'manh', trongSo: 0.8, tags: ['phoi_ngau_thanh_nha'] },
  'Phượng Các': { yNghia: 'Bạn đời của bạn có khí chất cao quý, biết cách cư xử.', loai: 'manh', trongSo: 0.8, tags: ['phoi_ngau_thanh_nha'] },

  // Hung tinh — hôn nhân có thử thách
  'Kình Dương': { yNghia: 'Bạn đời của bạn cá tính mạnh — có thể có va chạm trong hôn nhân. Đề phòng tai nạn cho bạn đời.', loai: 'yeu', trongSo: 1.3, tags: ['phoi_ngau_ca_tinh', 'hon_nhan_va_cham'] },
  'Đà La':      { yNghia: 'Duyên tình đến chậm, dây dưa — có thể trải qua vài mối tình trước khi ổn định.', loai: 'yeu', trongSo: 1.2, tags: ['hon_nhan_muon', 'duyen_cham'] },
  'Hỏa Tinh':   { yNghia: 'Hôn nhân có thể bùng nổ cãi vã — vợ chồng nóng nảy, dễ to tiếng.', loai: 'yeu', trongSo: 1.2, tags: ['hon_nhan_nong_nay'] },
  'Linh Tinh':  { yNghia: 'Hôn nhân có những lúc âm ỉ, khó chịu — cần học cách buông bỏ.', loai: 'yeu', trongSo: 1.1, tags: ['hon_nhan_am_i'] },
  'Địa Không':  { yNghia: 'Tình cảm có lúc hụt hẫng, cảm giác trống vắng — dù bên nhau vẫn thấy cô đơn.', loai: 'yeu', trongSo: 1.2, tags: ['hon_nhan_hut_hang'] },
  'Địa Kiếp':   { yNghia: 'Hôn nhân có thể gặp biến cố, mất mát — cần kiên nhẫn vượt qua.', loai: 'yeu', trongSo: 1.3, tags: ['hon_nhan_bien_co'] },
  'Hóa Kỵ':     { yNghia: 'Vợ chồng dễ hiểu lầm, ghen tuông — nên kết hôn muộn và nói rõ ràng với nhau.', loai: 'yeu', trongSo: 1.5, tags: ['hon_nhan_hieu_lam', 'can_ket_hon_muon'] },
  'Thiên Riêu': { yNghia: 'Bạn đời của bạn đa tình — dễ có người thứ ba, cần giữ gìn hôn nhân.', loai: 'yeu', trongSo: 1.1, tags: ['phoi_ngau_da_tinh'] },
  'Cô Thần':    { yNghia: 'Có những lúc bạn cảm thấy cô đơn ngay trong hôn nhân — cần chủ động chia sẻ.', loai: 'yeu', trongSo: 1.0, tags: ['hon_nhan_co_don'] },
  'Quả Tú':     { yNghia: 'Dễ xa cách, đơn chiếc — có thể có giai đoạn vợ chồng ở xa nhau.', loai: 'yeu', trongSo: 1.0, tags: ['hon_nhan_xa_cach'] },
  'Tang Môn':   { yNghia: 'Hôn nhân có thể gặp chuyện buồn — cần kiên nhẫn và thấu hiểu nhau.', loai: 'yeu', trongSo: 0.9, tags: ['hon_nhan_buon'] },
  'Bạch Hổ':    { yNghia: 'Đề phòng tai nạn cho bạn đời — cần quan tâm sức khỏe của nhau hơn.', loai: 'yeu', trongSo: 1.0, tags: ['suc_khoe_phoi_ngau'] },
  'Thiên Hình': { yNghia: 'Bạn đời của bạn nghiêm khắc, kỷ luật — có thể làm ngành luật, y, quân đội.', loai: 'trung', trongSo: 0.8, tags: ['phoi_ngau_nghiem_khac'] }
};

/**
 * KHO VĂN CHO CUNG PHU THÊ — 6 nhóm tính cách.
 * Mỗi nhóm có 5 đoạn: Tóm tắt, Người bạn đời, Kiểu hôn nhân, Điều lưu ý, Lời khuyên.
 */
var TUVI_VAN_PHUTHE = {

  // NHÓM A — Uy quyền (Tử Vi, Thái Dương, Thiên Tướng)
  'A': {
    tomTat: 'Hôn nhân của bạn thuộc nhóm "uy quyền" — bạn đời thuộc mẫu người có uy, tự trọng cao, sống nguyên tắc. Hôn nhân có xu hướng ổn định nếu cả hai biết tôn trọng nhau.',
    nguoiBanDoi: 'Bạn đời của bạn có khí chất của người đứng đầu — tự trọng cao, chững chạc, thích được tôn trọng. Họ thường giữ vai trò chủ động trong gia đình, có trách nhiệm với vợ/chồng và con cái. Về ngoại hình, người này thường toát lên vẻ đàng hoàng, đường bệ.',
    kieuHonNhan: 'Hôn nhân của bạn có xu hướng ổn định — hai người dễ thống nhất về mục tiêu gia đình. Tuy nhiên, bạn đời có thể hơi gia trưởng — bạn cần học cách nhường nhịn và nói lên quan điểm của mình.',
    dieuLuuY: 'Sự tự trọng cao của bạn đời đôi khi khiến họ khó nhận sai hoặc khó nói lời xin lỗi. Bạn cần khéo léo để không biến những chuyện nhỏ thành xung đột lớn.',
    loiKhuyen: [
      'Tôn trọng không gian riêng và vị trí của bạn đời — điều đó khiến họ càng trân trọng bạn.',
      'Chủ động bày tỏ cảm xúc bằng lời — bạn đời cần được nghe yêu thương, không chỉ cảm nhận.',
      'Khi có mâu thuẫn, hãy nói về vấn đề, không nói về con người — tránh làm tổn thương lòng tự trọng của nhau.'
    ]
  },

  // NHÓM B — Trí tuệ (Thiên Cơ, Cự Môn, Thái Âm)
  'B': {
    tomTat: 'Hôn nhân của bạn thuộc nhóm "trí tuệ" — bạn đời là người thông minh, nhạy cảm, hôn nhân thường có nhiều trao đổi sâu sắc nhưng cũng cần lắng nghe nhiều.',
    nguoiBanDoi: 'Bạn đời của bạn có đầu óc nhạy bén, thích tìm hiểu và có trực giác tốt. Họ quan sát tinh tế, biết cách an ủi người khác bằng lời nói. Về ngoại hình, người này thường thanh tú, ánh mắt sáng, dáng vẻ tri thức.',
    kieuHonNhan: 'Hôn nhân của bạn thiên về trò chuyện và chia sẻ suy nghĩ hơn là những cử chỉ lãng mạn. Hai người dễ hiểu nhau khi trò chuyện thẳng thắn, nhưng đôi khi bạn đời nói quá nhiều hoặc suy nghĩ quá nhiều khiến bạn thấy mệt. Hôn nhân thường bền nếu bạn biết cách trò chuyện cùng nhau.',
    dieuLuuY: 'Bạn đời của bạn dễ bị ảnh hưởng bởi cảm xúc và lời nói của người khác. Cần tránh để người ngoài can thiệp vào chuyện gia đình. Đôi khi bạn đời ăn nói sắc sảo quá mức khiến bạn hoặc người xung quanh tổn thương.',
    loiKhuyen: [
      'Lắng nghe nhiều hơn nói — bạn đời cần được hiểu hơn là được phân tích.',
      'Tạo không gian yên tĩnh cho bạn đời mỗi khi họ cần suy nghĩ — đừng ép họ phải luôn vui vẻ.',
      'Đôi khi hãy nói bằng hành động thay vì lời — một cái ôm đôi khi hiệu quả hơn cả cuộc trò chuyện dài.'
    ]
  },

  // NHÓM C — Thực tế (Vũ Khúc, Thiên Phủ, Thiên Đồng, Liêm Trinh)
  'C': {
    tomTat: 'Hôn nhân của bạn thuộc nhóm "thực tế" — bạn đời thuộc mẫu người đáng tin, giỏi lo liệu. Hôn nhân có xu hướng vững vàng về vật chất và tình cảm.',
    nguoiBanDoi: 'Bạn đời của bạn là người thực tế, chín chắn, không thích viển vông. Họ coi trọng sự ổn định, biết quản lý tiền bạc, và làm gì cũng có kế hoạch. Về ngoại hình, người này thường đầy đặn, điềm tĩnh, hoặc có vẻ nghiêm túc. Họ có thể hơi ít nói về chuyện tình cảm, nhưng thể hiện tình yêu bằng hành động thiết thực.',
    kieuHonNhan: 'Hôn nhân của bạn vững vàng và ổn định — hai người cùng nhau xây dựng tài chính, con cái, nhà cửa. Ít sóng gió lớn, nhưng cũng ít những bất ngờ lãng mạn. Đây là kiểu hôn nhân "cơm sôi, canh ngọt" — bền bỉ và ấm áp nhưng không ồn ào.',
    dieuLuuY: 'Bạn đời của bạn có xu hướng coi trọng vật chất, đôi khi đánh giá mọi việc bằng giá trị hữu hình. Bạn cần chú ý để hôn nhân không trở thành sự "hợp tác kinh doanh" mà thiếu đi tình cảm lãng mạn. Ngoài ra, nếu bạn đời có Liêm Trinh thì có thể hơi cứng nhắc, khó tính.',
    loiKhuyen: [
      'Tạo thêm những khoảnh khắc lãng mạn nhỏ — một bữa tối bất ngờ, một chuyến đi ngắn — để hôn nhân không chỉ là "cơm áo gạo tiền".',
      'Đừng để chuyện tiền bạc trở thành trung tâm của mọi cuộc trò chuyện — hãy hỏi nhau về cảm xúc, mong muốn, ước mơ.',
      'Khen ngợi bạn đời thường xuyên — họ không cần những lời hoa mỹ, chỉ cần được công nhận những gì họ đã làm cho gia đình.'
    ]
  }

  ,

  // NHÓM D — Quyết liệt (Thất Sát, Phá Quân)
  'D': {
    tomTat: 'Hôn nhân của bạn thuộc nhóm "quyết liệt" — bạn đời thuộc mẫu người cá tính mạnh. Hôn nhân có xu hướng nhiều biến động nhưng cũng đầy đam mê.',
    nguoiBanDoi: 'Bạn đời của bạn là người mạnh mẽ, quyết đoán, không chịu khuất phục. Họ sống mãnh liệt, yêu ghét rõ ràng, và sẵn sàng đương đầu với khó khăn. Về ngoại hình, người này thường rắn chắc, ánh mắt sắc, có uy tự nhiên. Họ có thể hơi nóng tính, nhưng cũng rất trung thành với người họ đã chọn.',
    kieuHonNhan: 'Hôn nhân của bạn có nhiều sóng gió nhưng cũng đầy cảm xúc — không nhàm chán, không tẻ nhạt. Hai người dễ cãi vã to tiếng nhưng cũng nhanh làm lành. Nếu biết kiềm chế cái tôi và học cách nhường nhịn, đây có thể là kiểu hôn nhân bền bỉ nhất — vì hai người đã cùng nhau vượt qua nhiều thử thách.',
    dieuLuuY: 'Cả hai đều có xu hướng nóng nảy và muốn mình đúng — dễ dẫn đến những cuộc cãi vã không đáng có. Bạn đời có thể có giai đoạn thay đổi lớn trong sự nghiệp hoặc cuộc sống, khiến hôn nhân bị ảnh hưởng. Cần đặc biệt chú ý sức khỏe và tai nạn của bạn đời.',
    loiKhuyen: [
      'Học cách hạ giọng trước khi nói — chỉ cần 1 câu nhẹ nhàng có thể tránh cả cuộc cãi vã.',
      'Đừng bao giờ dùng lời nói để làm tổn thương nhau — dù tức giận đến đâu.',
      'Có ít nhất 1 sở thích chung — đây sẽ là sợi dây gắn kết khi cả hai đều mệt mỏi.'
    ]
  },

  // NHÓM E — Đa tài (Tham Lang, Thiên Lương)
  'E': {
    tomTat: 'Hôn nhân của bạn thuộc nhóm "đa tài" — bạn đời thuộc mẫu người phong phú, thú vị. Hôn nhân có nhiều trải nghiệm nhưng cần sự chung thủy từ cả hai phía.',
    nguoiBanDoi: 'Bạn đời của bạn là người đa tài, có sức hút tự nhiên, dễ được người khác yêu mến. Họ ham học hỏi, thích trải nghiệm và có nhiều mối quan tâm khác nhau. Về ngoại hình, người này thường có sức hút — ánh mắt linh hoạt, nụ cười duyên, hoặc có phong cách riêng. Họ có thể vừa dịu dàng, vừa khó đoán.',
    kieuHonNhan: 'Hôn nhân của bạn phong phú và thú vị — không bao giờ nhàm chán vì bạn đời luôn có điều mới để chia sẻ. Hai người dễ dàng hòa hợp về mặt cảm xúc và trải nghiệm. Tuy nhiên, vì bạn đời có sức hút và nhiều mối quan hệ, hôn nhân cần sự tin tưởng và chung thủy cao từ cả hai phía.',
    dieuLuuY: 'Bạn đời của bạn dễ bị phân tán vì thích nhiều thứ cùng lúc — đôi khi không dành đủ thời gian cho gia đình. Cần chú ý chuyện "đào hoa" — không phải vì họ không chung thủy, mà vì có nhiều người theo đuổi. Ngoài ra, nếu bạn đời là Thiên Lương, họ có thể có xu hướng che chở người ngoài nhiều hơn vợ/chồng.',
    loiKhuyen: [
      'Tôn trọng sự đa dạng của bạn đời — họ không cần thay đổi để phù hợp với bạn.',
      'Xây dựng sự tin tưởng bằng hành động cụ thể, không chỉ bằng lời nói.',
      'Cùng nhau trải nghiệm điều mới — đây là cách tốt nhất để giữ lửa cho cả hai.'
    ]
  },

  // NHÓM F — Vô chính diệu
  'F': {
    tomTat: 'Hôn nhân của bạn thuộc nhóm đặc biệt — cung Phu Thê không có chính tinh. Hôn nhân phụ thuộc nhiều vào hoàn cảnh và chính bản thân bạn.',
    nguoiBanDoi: 'Bạn đời của bạn là người khó đoán — họ có thể thay đổi tùy hoàn cảnh, không có một bản chất cố định nào. Điều này vừa thú vị vừa thách thức: bạn sẽ liên tục khám phá con người thật của họ. Về ngoại hình, người này thường không có nét đặc trưng nào nổi bật, nhưng toát lên vẻ dễ chịu, dễ gần.',
    kieuHonNhan: 'Hôn nhân của bạn phụ thuộc rất nhiều vào hoàn cảnh bên ngoài — nếu môi trường tốt, hôn nhân sẽ tốt; nếu có biến động, hôn nhân dễ bị ảnh hưởng theo. Đây không phải là kiểu hôn nhân "định mệnh cố định" mà là kiểu cần hai người cùng nhau vun đắp. Nếu bạn kiên định, bạn đời cũng sẽ kiên định.',
    dieuLuuY: 'Vì cung Phu Thê VCD, bạn dễ bị cuốn theo cảm xúc của bạn đời — khi họ vui bạn vui, khi họ buồn bạn buồn. Cần giữ được "cái tôi" của mình trong hôn nhân. Ngoài ra, bạn cần đặc biệt chú ý việc chọn bạn đời — vì không có chính tinh định hướng, bạn cần dựa vào quan sát thực tế nhiều hơn.',
    loiKhuyen: [
      'Dành thời gian tìm hiểu kỹ trước khi kết hôn — không nên quyết định vội vàng.',
      'Giữ một phần cuộc sống riêng (sở thích, bạn bè, sự nghiệp) — đừng để hôn nhân chiếm trọn con người bạn.',
      'Chủ động tạo dựng hạnh phúc thay vì chờ đợi — hôn nhân của bạn phụ thuộc nhiều vào nỗ lực của chính bạn.'
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
    yNghia: 'Bạn kiếm tiền nhờ uy tín và vị trí — tài chính thường đến từ vai trò lãnh đạo, quản lý, hoặc từ các mối quan hệ cấp cao. Bạn giữ tiền bằng cách đầu tư vào tài sản có giá trị và duy trì quan hệ đáng tin cậy.',
    trongSo: 1.5, tags: ['tai_chinh_uy_tin', 'tich_luy_ben_vung']
  },
  'Thiên Cơ': {
    yNghia: 'Bạn kiếm tiền bằng trí tuệ, sự nhanh nhạy và khả năng phân tích — thu nhập thường biến động, có thể đến từ nhiều nguồn khác nhau. Bạn giữ tiền bằng cách tính toán kỹ lưỡng trước khi chi tiêu.',
    trongSo: 1.4, tags: ['tai_chinh_tri_tue', 'thu_nhap_bien_dong']
  },
  'Thái Dương': {
    yNghia: 'Bạn kiếm tiền nhờ danh tiếng và sự nổi bật — tài chính thường gắn với hình ảnh công chúng hoặc uy tín xã hội. Bạn có xu hướng chi tiêu hào phóng, đôi khi rộng tay hơn mức cần thiết.',
    trongSo: 1.5, tags: ['tai_chinh_danh_tieng', 'chi_tieu_rong_rai']
  },
  'Vũ Khúc': {
    yNghia: 'Bạn kiếm tiền bằng sự cương nghị và quyết đoán — đây là tài tinh, rất giỏi kiếm và giữ tiền. Bạn thường tự gây dựng tài sản bằng nỗ lực của mình, không ỷ lại vào ai.',
    trongSo: 1.7, tags: ['tai_chinh_vung_manh', 'tu_luc_giau_co']
  },
  'Thiên Đồng': {
    yNghia: 'Tài chính của bạn thường trải qua giai đoạn đầu vất vả, sau đó mới ổn định và khá lên — đây là kiểu "tiền hung hậu cát".',
    trongSo: 1.3, tags: ['tai_chinh_tien_kho', 'hau_van_kha']
  },
  'Liêm Trinh': {
    yNghia: 'Bạn kiếm tiền vất vả, thường phải trải qua nhiều thử thách — nên làm ăn minh bạch, tránh đầu cơ. Bạn giữ tiền bằng cách kỷ luật chi tiêu và làm việc có nguyên tắc.',
    trongSo: 1.4, tags: ['tai_chinh_vat_va', 'can_lam_an_minh_bach']
  },
  'Thiên Phủ': {
    yNghia: 'Bạn thuộc mẫu người giỏi tích lũy — biết cách quản lý chi tiêu và giữ của. Tài chính có xu hướng ổn định nếu bạn duy trì kỷ luật tài chính.',
    trongSo: 1.6, tags: ['tai_chinh_kho_loc', 'tich_luy_dao_dao']
  },
  'Thái Âm': {
    yNghia: 'Bạn giàu nhờ tích góp và các tài sản cố định (nhà đất, vàng bạc). Tài chính thường đến từ nguồn thu nhập phụ ổn định, hoặc từ tài sản thừa hưởng.',
    trongSo: 1.5, tags: ['tai_chinh_dien_san', 'tich_gop']
  },
  'Tham Lang': {
    yNghia: 'Bạn kiếm tiền nhanh qua giao tế, kinh doanh, và các cơ hội xã hội — nhưng cũng chi tiêu nhanh. Bạn cần kỷ luật tài chính rõ ràng để không "kiếm nhiều mà vẫn thiếu".',
    trongSo: 1.4, tags: ['tai_chinh_giao_te', 'kiem_nhanh_tieu_nhanh']
  },
  'Cự Môn': {
    yNghia: 'Bạn kiếm tiền bằng lời nói, lý luận, hoặc các nghề liên quan đến giao tiếp. Tài chính đôi khi có tranh chấp — cần cẩn thận giấy tờ, hợp đồng.',
    trongSo: 1.3, tags: ['tai_chinh_ngon_luan', 'can_giay_to']
  },
  'Thiên Tướng': {
    yNghia: 'Tài chính của bạn đủ đầy và ổn định — tiền đến từ công việc chính thức, có uy tín. Bạn hào phóng với người thân nhưng không hoang phí với bản thân.',
    trongSo: 1.5, tags: ['tai_chinh_on_dinh', 'hao_phong_co_chung']
  },
  'Thiên Lương': {
    yNghia: 'Bạn có lộc ấm — tài chính thường đến từ nguồn thừa hưởng, hoặc từ công việc có tính chất phục vụ, che chở. Không nên đầu cơ, hãy tích lũy đường dài.',
    trongSo: 1.4, tags: ['tai_chinh_loc_am', 'khong_nen_dau_co']
  },
  'Thất Sát': {
    yNghia: 'Bạn kiếm tiền từ sự mạo hiểm và các cơ hội táo bạo — tài chính thường lúc được lúc mất. Cần học cách quản lý rủi ro, không nên dồn hết vốn vào một chỗ.',
    trongSo: 1.4, tags: ['tai_chinh_mao_hiem', 'luc_duoc_luc_mat']
  },
  'Phá Quân': {
    yNghia: 'Bạn kiếm nhiều nhưng cũng tiêu nhiều — tài chính thường thăng trầm, ít khi ổn định. Cần kỷ luật chi tiêu rõ ràng và tránh đầu tư cảm tính.',
    trongSo: 1.4, tags: ['tai_chinh_thang_tram', 'can_ky_luat']
  }
};

/**
 * Ý nghĩa phụ tinh đặc thù tại cung Tài Bạch.
 */
var TUVI_FACT_TAIBACH_PHUTINH = {
  // Cát tinh — tài lộc
  'Lộc Tồn':    { yNghia: 'Có Lộc Tồn — tiền vào đều đặn, bạn biết cách tiết kiệm và giữ của. Tài chính thường ổn định, ít bị thất thoát.', loai: 'manh', trongSo: 1.7, tags: ['tai_loc', 'tiet_kiem'] },
  'Hóa Lộc':    { yNghia: 'Có Hóa Lộc — tài lộc hanh thông, nhiều cơ hội kiếm tiền mới mở ra. Đây là điểm sáng lớn về tiền bạc.', loai: 'manh', trongSo: 1.7, tags: ['tai_loc', 'nhieu_nguon'] },
  'Hóa Quyền':  { yNghia: 'Có Hóa Quyền — bạn chủ động nắm quyền quản lý tài chính, tiền thường đến từ vị trí có trách nhiệm.', loai: 'manh', trongSo: 1.5, tags: ['tai_chinh_chu_dong'] },
  'Hóa Khoa':   { yNghia: 'Có Hóa Khoa — kiếm tiền bằng danh tiếng và học vấn. Khi khó khăn tài chính thường có người giúp.', loai: 'manh', trongSo: 1.4, tags: ['tai_chinh_danh_tieng'] },
  'Thiên Mã':   { yNghia: 'Có Thiên Mã — kiếm tiền nhờ di chuyển, đi xa, buôn bán hoặc kinh doanh ở nơi khác.', loai: 'manh', trongSo: 1.1, tags: ['tai_chinh_di_chuyen'] },
  'Đào Hoa':    { yNghia: 'Tiền có thể đến qua các mối quan hệ tình cảm, giao tế hoặc nghề nghiệp liên quan đến sắc đẹp, nghệ thuật.', loai: 'manh', trongSo: 0.9, tags: ['tai_chinh_giao_te'] },

  // Sao khác — có thể tốt hoặc cần chú ý
  'Vũ Khúc':    { yNghia: 'Có Vũ Khúc ở Tài — đây là tài tinh ở đúng vị trí. Bạn có tố chất làm kinh tế, giỏi kiếm và giữ tiền.', loai: 'manh', trongSo: 1.8, tags: ['tai_chinh_vung_manh'] },
  'Thiên Phủ':  { yNghia: 'Có Thiên Phủ ở Tài — như kho trời đóng tại cung tiền, tài chính ổn định và biết tích lũy lâu dài.', loai: 'manh', trongSo: 1.6, tags: ['tai_chinh_on_dinh'] },
  'Đại Hao':    { yNghia: 'Có Đại Hao — chi tiêu lớn, khó giữ tiền. Cần kỷ luật tài chính chặt chẽ.', loai: 'yeu', trongSo: 1.1, tags: ['chi_tieu_lon'] },
  'Tiểu Hao':   { yNghia: 'Có Tiểu Hao — hao hụt lặt vặt, tiền cứ vơi dần mà không rõ lý do.', loai: 'yeu', trongSo: 0.8, tags: ['hao_hut_nho'] },

  // Hung tinh — rủi ro tài chính
  'Kình Dương': { yNghia: 'Có Kình Dương — kiếm tiền bằng cạnh tranh, nhưng dễ xảy ra tranh chấp tiền bạc. Cẩn thận khi cho vay hoặc hùn vốn.', loai: 'yeu', trongSo: 1.3, tags: ['tranh_chap_tien'] },
  'Đà La':      { yNghia: 'Có Đà La — tiền bạc dây dưa, khó dứt khoát. Việc thu nợ hoặc đòi tiền thường kéo dài.', loai: 'yeu', trongSo: 1.2, tags: ['tien_bac_day_dua'] },
  'Hỏa Tinh':   { yNghia: 'Có Hỏa Tinh — tài chính có thể bùng nổ bất ngờ theo cả hai hướng: thắng lớn hoặc thua đậm. Cần thận trọng với quyết định nhanh.', loai: 'yeu', trongSo: 1.1, tags: ['tai_chinh_bung_no'] },
  'Linh Tinh':  { yNghia: 'Có Linh Tinh — tài chính âm ỉ, khó khăn kéo dài. Cần kiên nhẫn và không nên đầu tư dài hạn khi chưa chắc chắn.', loai: 'yeu', trongSo: 1.1, tags: ['tai_chinh_kho_khan'] },
  'Địa Không':  { yNghia: 'Có Địa Không — tiền đến rồi đi, tránh đầu cơ, tránh cho vay. Nên tập trung vào thu nhập ổn định thay vì làm giàu nhanh.', loai: 'yeu', trongSo: 1.2, tags: ['tien_den_roi_di', 'tranh_dau_co'] },
  'Địa Kiếp':   { yNghia: 'Có Địa Kiếp — dễ mất tiền đột ngột, cẩn thận cho vay hoặc đầu tư rủi ro cao. Cần có quỹ dự phòng.', loai: 'yeu', trongSo: 1.3, tags: ['mat_tien_dot_ngot'] },
  'Hóa Kỵ':     { yNghia: 'Có Hóa Kỵ — tiền bạc dây dưa, dễ nợ nần hoặc bị hiểu lầm về tài chính. Cẩn trọng giấy tờ, hợp đồng liên quan đến tiền.', loai: 'yeu', trongSo: 1.5, tags: ['no_nan', 'giay_to_tien'] }
};

/**
 * KHO VĂN CHO CUNG TÀI BẠCH — 5 nhóm tính cách (A, B, C, D, F).
 * Mỗi nhóm có 6 đoạn: Tóm tắt, Cách kiếm tiền, Cách giữ tiền, 
 * Cơ hội, Rủi ro, Lời khuyên.
 */
var TUVI_VAN_TAIBACH = {

  // NHÓM A — Tài tinh (Tử Vi, Vũ Khúc, Thiên Phủ, Thái Âm)
  'A': {
    tomTat: 'Tài chính của bạn thuộc nhóm "tài tinh" — bạn có tố chất làm kinh tế, giỏi kiếm và giữ tiền. Tài vận có xu hướng ổn định nếu bạn duy trì kỷ luật tài chính.',
    cachKiem: 'Bạn kiếm tiền bằng năng lực thật và sự chăm chỉ — không ỷ lại vào may mắn hay người khác. Thu nhập thường đến từ công việc chính thức, có uy tín. Bạn cũng có khả năng nhìn ra cơ hội tài chính mà người khác bỏ qua, và biết cách tận dụng nó một cách thận trọng.',
    cachGiu: 'Bạn giữ tiền rất tốt — biết phân bổ thành các khoản khác nhau (chi tiêu, tiết kiệm, đầu tư), không tiêu hoang phí. Bạn cũng thích tích lũy tài sản có giá trị lâu dài như nhà đất, vàng bạc thay vì chỉ gửi tiết kiệm.',
    coHoi: 'Cơ hội tài chính của bạn thường đến từ việc đầu tư dài hạn và các mối quan hệ đáng tin cậy. Bạn hợp với việc tự kinh doanh, đầu tư bất động sản, hoặc giữ vị trí quản lý tài chính trong tổ chức.',
    ruiRo: 'Rủi ro chính là sự bảo thủ quá mức — đôi khi bạn bỏ lỡ cơ hội lớn vì quá thận trọng. Ngoài ra, bạn có thể bị "đóng băng" tài sản vào những khoản đầu tư không sinh lời, khiến tiền không luân chuyển.',
    loiKhuyen: [
      'Đa dạng hóa đầu tư — đừng dồn hết tiền vào một kênh dù nó an toàn đến đâu.',
      'Đầu tư vào bản thân (học hỏi, sức khỏe, mở rộng quan hệ) cũng là một cách sinh lời lâu dài.',
      'Đôi khi chấp nhận rủi ro có tính toán — cơ hội lớn chỉ đến với người dám thử.'
    ]
  },

  // NHÓM B — Trí tuệ (Thiên Cơ, Cự Môn, Thiên Tướng)
  'B': {
    tomTat: 'Tài chính của bạn thuộc nhóm "trí tuệ" — bạn kiếm tiền bằng đầu óc, sự phân tích và khả năng giao tiếp. Thu nhập thường đa dạng nhưng biến động.',
    cachKiem: 'Bạn kiếm tiền chủ yếu bằng kiến thức, kỹ năng phân tích và lời nói. Công việc phù hợp thường liên quan đến tư vấn, giảng dạy, luật, truyền thông, hoặc các ngành cần lý luận. Bạn có thể có nhiều nguồn thu nhập cùng lúc vì tính linh hoạt cao.',
    cachGiu: 'Bạn giữ tiền bằng cách tính toán kỹ lưỡng trước khi chi tiêu, không thích lãng phí. Tuy nhiên, vì tính hay thay đổi, bạn có thể khó duy trì một kế hoạch tài chính dài hạn. Bạn cần kỷ luật hơn trong việc tiết kiệm đều đặn.',
    coHoi: 'Cơ hội tài chính của bạn thường đến từ việc tận dụng tri thức và kỹ năng đặc thù — làm chuyên gia, cố vấn, hoặc phát triển sản phẩm dựa trên chuyên môn. Bạn cũng giỏi nhìn ra xu hướng thị trường trước người khác.',
    ruiRo: 'Rủi ro chính là sự phân tán — vì có nhiều ý tưởng và cơ hội, bạn dễ đầu tư vào quá nhiều thứ mà không tập trung vào cái nào. Ngoài ra, bạn có thể mất tiền vì tin vào những lời hứa hẹn hấp dẫn mà không kiểm chứng kỹ.',
    loiKhuyen: [
      'Chọn 1-2 lĩnh vực chính để tập trung — đừng dàn trải vốn và thời gian vào quá nhiều thứ.',
      'Kiểm chứng kỹ lưỡng trước khi đầu tư — trực giác tốt nhưng vẫn cần dữ liệu thật.',
      'Lập quỹ dự phòng 6 tháng chi tiêu — vì thu nhập biến động, bạn cần tấm đệm an toàn.'
    ]
  },

  // NHÓM C — Thực tế - uy tín (Thiên Đồng, Thái Dương, Thiên Lương, Liêm Trinh)
  'C': {
    tomTat: 'Tài chính của bạn thuộc nhóm "thực tế - uy tín" — bạn kiếm tiền từ danh tiếng, sự phục vụ và công việc chính thức. Tài vận thường trải qua giai đoạn đầu vất vả, sau đó mới ổn định.',
    cachKiem: 'Bạn kiếm tiền nhờ uy tín và sự đáng tin cậy — người khác tìm đến bạn vì biết bạn làm việc có trách nhiệm. Công việc phù hợp thường liên quan đến phục vụ, giáo dục, y tế, hành chính, hoặc các lĩnh vực cần sự chính trực. Bạn không kiếm tiền bằng cách chộp giật.',
    cachGiu: 'Bạn giữ tiền bằng cách sống tiết kiệm và có kỷ luật — không tiêu vào những thứ không cần thiết. Bạn ưu tiên tích lũy cho tương lai hơn là hưởng thụ trước mắt. Tuy nhiên, đôi khi bạn hào phóng với người khác hơn với chính mình.',
    coHoi: 'Cơ hội tài chính của bạn thường đến từ các mối quan hệ lâu dài, uy tín tích lũy theo năm tháng. Càng lớn tuổi, tài chính của bạn càng vững — đây là kiểu "phát muộn nhưng bền". Bạn cũng hợp với các công việc có thu nhập ổn định, ít rủi ro.',
    ruiRo: 'Rủi ro chính là sự thiếu chủ động — bạn có xu hướng chờ đợi cơ hội đến thay vì tự tạo ra. Ngoài ra, bạn có thể bị lợi dụng lòng tốt — người khác vay tiền hoặc nhờ vả mà không trả. Cần học cách nói "không".',
    loiKhuyen: [
      'Chủ động tìm kiếm cơ hội thay vì chờ đợi — uy tín của bạn xứng đáng được đền đáp.',
      'Học cách nói "không" với những lời vay mượn không chính đáng — bảo vệ tài chính của mình trước.',
      'Đầu tư sớm cho tương lai (bảo hiểm, quỹ hưu trí) — vì bạn sống thọ và cần chuẩn bị dài hạn.'
    ]
  }

  ,

  // NHÓM D — Mạo hiểm (Thất Sát, Phá Quân, Tham Lang)
  'D': {
    tomTat: 'Tài chính của bạn thuộc nhóm "mạo hiểm" — bạn có xu hướng kiếm tiền từ những cơ hội táo bạo. Tài vận thường thăng trầm, nhưng có thể đạt đỉnh cao nếu bạn biết quản lý rủi ro.',
    cachKiem: 'Bạn kiếm tiền bằng sự quyết đoán và dám thử những điều mới — không thích lối mòn, không chịu an phận. Thu nhập thường đến từ kinh doanh, đầu tư, hoặc những lĩnh vực có tính cạnh tranh cao. Bạn có khả năng nhìn ra cơ hội lớn và dám dấn thân, đôi khi vượt qua cả người có vốn nhiều hơn.',
    cachGiu: 'Bạn giữ tiền không giỏi bằng kiếm tiền — dễ tiêu vào những thứ lớn, đầu tư cảm tính, hoặc bị cuốn theo những cơ hội hấp dẫn. Cần kỷ luật tài chính chặt chẽ: tách rõ vốn đầu tư và tiền sinh hoạt, không dùng lẫn lộn.',
    coHoi: 'Cơ hội tài chính lớn của bạn thường đến từ việc nắm bắt xu hướng mới, mở rộng thị trường, hoặc kinh doanh trong lĩnh vực ít cạnh tranh. Bạn hợp với vai trò tiên phong — người mở đường, người khai phá. Càng dấn thân, bạn càng học được nhiều và càng có cơ hội lớn.',
    ruiRo: 'Rủi ro chính là sự thiếu kiên nhẫn — bạn dễ bỏ dở giữa chừng khi chưa thấy kết quả, hoặc đầu tư quá nhiều vào một cơ hội chưa chín muồi. Cần học cách chia nhỏ rủi ro và luôn có "kế hoạch B".',
    loiKhuyen: [
      'Luôn có quỹ dự phòng 6-12 tháng trước khi đầu tư mạo hiểm — vì tài chính của bạn sẽ có lúc thăng lúc trầm.',
      'Chia vốn thành nhiều phần — không bao giờ đặt tất cả vào một cược dù bạn tin chắc đến đâu.',
      'Học cách dừng đúng lúc — khi đã đạt mục tiêu đề ra, hãy chốt lời thay vì tham lam.'
    ]
  },

  // NHÓM F — Vô chính diệu
  'F': {
    tomTat: 'Tài chính của bạn thuộc nhóm đặc biệt — cung Tài Bạch không có chính tinh. Tài vận có xu hướng phụ thuộc nhiều vào hoàn cảnh và các cung khác chiếu về.',
    cachKiem: 'Bạn kiếm tiền theo cách linh hoạt, không có một mô hình cố định. Thu nhập có thể đến từ nhiều nguồn khác nhau tùy từng giai đoạn cuộc đời. Bạn dễ thích nghi với môi trường mới và có thể thành công trong nhiều lĩnh vực, nhưng cần tránh việc "đứng núi này trông núi nọ" khiến không đi đến đâu.',
    cachGiu: 'Bạn giữ tiền phụ thuộc vào cung đối chiếu (Phúc Đức) và các cung tam hợp — nếu các cung này tốt thì tài chính ổn định, nếu không thì dễ hao hụt. Đặc biệt, bạn cần một người cố vấn tài chính đáng tin cậy — vì bản thân bạn dễ dao động.',
    coHoi: 'Cơ hội tài chính của bạn thường đến bất ngờ, từ những mối quan hệ hoặc hoàn cảnh bạn không ngờ tới. Bạn hợp với vai trò kết nối — làm trung gian, môi giới, hoặc phát triển trong môi trường đa dạng. Càng giao tiếp rộng, bạn càng có cơ hội tốt.',
    ruiRo: 'Rủi ro chính là sự phụ thuộc vào người khác — bạn dễ bị cuốn theo những lời khuyên đầu tư thiếu chính xác, hoặc để người khác quản lý tiền của mình. Cần học cách tự đưa ra quyết định tài chính, dù có thể chậm hơn một chút.',
    loiKhuyen: [
      'Xây dựng mối quan hệ với 1-2 người cố vấn tài chính đáng tin — họ sẽ giúp bạn tránh sai lầm lớn.',
      'Luôn kiểm chứng thông tin trước khi đầu tư — đừng tin vào lời hứa hấp dẫn mà không có bằng chứng.',
      'Đặt mục tiêu tài chính rõ ràng theo từng giai đoạn 3-5 năm — giúp bạn tập trung thay vì chạy theo nhiều hướng.'
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
    yNghia: 'Bạn thuộc mẫu người phù hợp với vai trò lãnh đạo, quản lý — có tố chất tổ chức và điều hành. Sự nghiệp có xu hướng phát triển nếu bạn được đặt trong môi trường cho phép bạn quyết định và dẫn dắt tập thể.',
    trongSo: 1.6, tags: ['nghe_lanh_dao', 'moi_truong_to_chuc', 'thang_tien_cao']
  },
  'Thiên Cơ': {
    yNghia: 'Bạn phù hợp với nghề cần trí tuệ và phân tích — kỹ thuật, kế hoạch, tư vấn, công nghệ, nghiên cứu, hoặc thiết kế hệ thống. Sự nghiệp thường phát triển qua chuyên môn sâu, và có xu hướng thay đổi công việc vài lần trong đời.',
    trongSo: 1.5, tags: ['nghe_chuyen_mon', 'thay_doi_cong_viec', 'tri_tue']
  },
  'Thái Dương': {
    yNghia: 'Bạn phù hợp với công việc công quyền, giáo dục, truyền thông, ngoại giao, hoặc các vị trí cần uy tín xã hội. Sự nghiệp thường rạng rỡ, được nhiều người biết đến. Môi trường lý tưởng là nơi bạn được giao tiếp rộng và tỏa sáng.',
    trongSo: 1.6, tags: ['nghe_danh_tieng', 'moi_truong_xa_hoi', 'uy_tin_cao']
  },
  'Vũ Khúc': {
    yNghia: 'Bạn phù hợp với tài chính, ngân hàng, kinh doanh, kế toán, cơ khí, hoặc kỹ thuật — những lĩnh vực cần sự cương nghị và thực tế. Sự nghiệp thường tự gây dựng, ít ỷ lại vào người khác. Đây là tài tinh, rất tốt cho sự nghiệp làm chủ.',
    trongSo: 1.7, tags: ['nghe_tai_chinh', 'tu_luc_su_nghiep', 'lam_chu']
  },
  'Thiên Đồng': {
    yNghia: 'Bạn phù hợp với dịch vụ, văn hóa, y tế, giáo dục mầm non, hoặc các công việc nhẹ nhàng, ít áp lực. Sự nghiệp thường có xu hướng đổi nghề vài lần trước khi ổn định. Môi trường lý tưởng là nơi vui vẻ, thoải mái, có đồng nghiệp thân thiện.',
    trongSo: 1.3, tags: ['nghe_dich_vu', 'moi_truong_nhe_nhang', 'hay_doi_nghe']
  },
  'Liêm Trinh': {
    yNghia: 'Bạn phù hợp với luật, quân đội, công an, quản trị, hoặc các lĩnh vực có kỷ luật cao. Sự nghiệp thường gắn với nguyên tắc, pháp lý, tổ chức chặt chẽ. Cần cẩn trọng tránh tranh chấp và kiện tụng trong công việc.',
    trongSo: 1.5, tags: ['nghe_phap_luat', 'ky_luat_cao', 'can_giay_to']
  },
  'Thiên Phủ': {
    yNghia: 'Bạn phù hợp với quản lý tài sản, kế toán, kho vận, hành chính nhà nước, hoặc các vị trí giữ của trong tổ chức. Sự nghiệp thường ổn định, ít biến động, phát triển từ từ nhưng bền. Môi trường lý tưởng là nơi có cấu trúc rõ ràng.',
    trongSo: 1.6, tags: ['nghe_quan_ly', 'on_dinh_ben_vung', 'moi_truong_to_chuc']
  },
  'Thái Âm': {
    yNghia: 'Bạn phù hợp với bất động sản, nghệ thuật, tài chính, hoặc các công việc liên quan đến làm đẹp, chăm sóc, giáo dục. Sự nghiệp thường phát triển nhờ sự tinh tế và khéo léo. Có thể thành công với công việc làm về đêm hoặc làm việc độc lập.',
    trongSo: 1.5, tags: ['nghe_nghe_thuat', 'thanh_cong_tinh_te', 'lam_doc_lap']
  },
  'Tham Lang': {
    yNghia: 'Bạn phù hợp với kinh doanh, giải trí, ngoại giao, ẩm thực, nghệ thuật, hoặc các ngành cần giao tiếp rộng. Sự nghiệp thường đa dạng, có thể làm nhiều nghề khác nhau trong đời. Môi trường lý tưởng là nơi đông người và có cơ hội kết nối.',
    trongSo: 1.5, tags: ['nghe_kinh_doanh', 'giao_te_rong', 'da_nghe']
  },
  'Cự Môn': {
    yNghia: 'Bạn phù hợp với luật sư, giảng dạy, truyền thông, bán hàng, tư vấn, hoặc các nghề cần ăn nói và lý luận. Sự nghiệp thường phát triển nhờ khẩu tài và khả năng thuyết phục. Cần cẩn trọng tránh thị phi nơi công sở.',
    trongSo: 1.4, tags: ['nghe_ngon_luan', 'kheo_an_noi', 'can_tranh_thi_phi']
  },
  'Thiên Tướng': {
    yNghia: 'Bạn phù hợp với hành chính, nhân sự, thời trang, dịch vụ cao cấp, hoặc các vị trí cần uy nghi và chính trực. Sự nghiệp thường ổn định và được nể trọng. Môi trường lý tưởng là nơi cần sự chỉn chu, đàng hoàng.',
    trongSo: 1.5, tags: ['nghe_hanh_chinh', 'chinh_truc', 'duoc_ne_trong']
  },
  'Thiên Lương': {
    yNghia: 'Bạn phù hợp với y dược, giáo dục, bảo hiểm, tư vấn, hoặc các công việc có tính chất che chở, giúp đỡ người khác. Sự nghiệp thường phát triển nhờ uy tín và lòng nhân hậu. Càng lớn tuổi càng được nể trọng.',
    trongSo: 1.5, tags: ['nghe_y_te_giao_duc', 'uy_tin_tich_luy', 'phat_muon']
  },
  'Thất Sát': {
    yNghia: 'Bạn phù hợp với quân sự, kỹ thuật nặng, khởi nghiệp, hoặc các lĩnh vực cạnh tranh cao. Sự nghiệp thường trải qua nhiều thử thách và biến động — nhưng nếu kiên trì thì đạt được thành tựu lớn. Cần cẩn trọng tránh va chạm và tai nạn nghề nghiệp.',
    trongSo: 1.5, tags: ['nghe_mao_hiem', 'khoi_nghiep', 'trai_qua_thu_thach']
  },
  'Phá Quân': {
    yNghia: 'Bạn phù hợp với đổi mới, sáng tạo, xây dựng, kinh doanh mạo hiểm, hoặc các lĩnh vực cần phá cách. Sự nghiệp thường thay đổi nhiều lần — có thể đổi nghề, đổi chỗ làm, hoặc chuyển hướng lớn. Cần kỷ luật để tránh thất bại vì thay đổi quá nhiều.',
    trongSo: 1.5, tags: ['nghe_sang_tao', 'thay_doi_lon', 'can_ky_luat']
  }
};

/**
 * Ý nghĩa phụ tinh đặc thù tại cung Quan Lộc.
 */
var TUVI_FACT_QUANLOC_PHUTINH = {
  // Cát tinh — sự nghiệp thuận lợi
  'Hóa Quyền':  { yNghia: 'Có Hóa Quyền — bạn có uy trong công việc, dễ thăng chức, được giao quyền quyết định. Đây là điểm sáng lớn cho sự nghiệp.', loai: 'manh', trongSo: 1.7, tags: ['thang_chuc', 'co_uy'] },
  'Hóa Khoa':   { yNghia: 'Có Hóa Khoa — danh tiếng nghề nghiệp, bằng cấp, học vấn được công nhận. Công việc dễ được nể trọng và có quý nhân giúp.', loai: 'manh', trongSo: 1.6, tags: ['danh_tieng', 'bang_cap'] },
  'Hóa Lộc':    { yNghia: 'Có Hóa Lộc — công việc sinh lợi, thu nhập tốt. Bạn có thể kiếm tiền từ chính công việc mình yêu thích.', loai: 'manh', trongSo: 1.6, tags: ['cong_viec_sinh_loi'] },
  'Quốc Ấn':    { yNghia: 'Có Quốc Ấn — có chức vụ, được giao ấn tín, trọng trách trong tổ chức. Sự nghiệp có tính chính danh cao.', loai: 'manh', trongSo: 1.5, tags: ['chuc_vu', 'an_tin'] },
  'Thai Phụ':   { yNghia: 'Có Thai Phụ — được khen thưởng, công nhận trong công việc. Có thể được đề bạt, bổ nhiệm.', loai: 'manh', trongSo: 1.3, tags: ['duoc_khen_thuong'] },
  'Phong Cáo':  { yNghia: 'Có Phong Cáo — được bằng khen, bổ nhiệm, có danh vị chính thức trong tổ chức.', loai: 'manh', trongSo: 1.3, tags: ['bang_khen', 'bo_nhiem'] },
  'Thiên Khôi': { yNghia: 'Có Thiên Khôi — cấp trên nâng đỡ, được người có quyền giúp đỡ trong sự nghiệp.', loai: 'manh', trongSo: 1.4, tags: ['quy_nhan_cap_tren'] },
  'Thiên Việt': { yNghia: 'Có Thiên Việt — có cơ hội thăng tiến từ những mối quan hệ bên ngoài, hoặc được giới thiệu vào vị trí tốt.', loai: 'manh', trongSo: 1.4, tags: ['co_hoi_thang_tien'] },
  'Tả Phù':     { yNghia: 'Có Tả Phù — có người trợ lực trong công việc, làm việc nhóm hiệu quả, được đồng nghiệp ủng hộ.', loai: 'manh', trongSo: 1.2, tags: ['tro_luc', 'dong_nghiep_tot'] },
  'Hữu Bật':    { yNghia: 'Có Hữu Bật — có cộng sự đắc lực, được lãnh đạo tin tưởng. Hợp làm việc trong tổ chức có cấu trúc.', loai: 'manh', trongSo: 1.2, tags: ['cong_su_tot'] },
  'Văn Xương':  { yNghia: 'Có Văn Xương — hợp với công việc văn thư, giấy tờ, học thuật, hoặc cần bằng cấp. Sự nghiệp gắn với tri thức.', loai: 'manh', trongSo: 1.2, tags: ['van_thu', 'hoc_thuat'] },
  'Văn Khúc':   { yNghia: 'Có Văn Khúc — hợp với công việc giao tiếp, nghệ thuật, sáng tạo. Khéo léo trong ứng xử nơi công sở.', loai: 'manh', trongSo: 1.2, tags: ['giao_tiep', 'sang_tao'] },
  'Tướng Quân': { yNghia: 'Có Tướng Quân — có uy trong công việc, hợp vai trò chỉ huy, lãnh đạo đội nhóm.', loai: 'manh', trongSo: 1.3, tags: ['uy_chi_huy'] },
  'Thiên Mã':   { yNghia: 'Có Thiên Mã — công việc thường gắn với di chuyển, công tác xa, hoặc đổi chỗ làm nhiều lần.', loai: 'manh', trongSo: 1.1, tags: ['di_chuyen', 'doi_viec'] },
  'Đào Hoa':    { yNghia: 'Có Đào Hoa — hợp với nghề cần giao tiếp, ngoại giao, hoặc liên quan đến cái đẹp, nghệ thuật.', loai: 'manh', trongSo: 1.0, tags: ['giao_te', 'dep'] },

  // Hung tinh — khó khăn trong sự nghiệp
  'Hóa Kỵ':     { yNghia: 'Có Hóa Kỵ — công việc trắc trở, dễ bị đố kỵ hoặc gặp thị phi. Cần kiên nhẫn và cẩn trọng giấy tờ.', loai: 'yeu', trongSo: 1.6, tags: ['cong_viec_trac_tro', 'thi_phi'] },
  'Kình Dương': { yNghia: 'Có Kình Dương — công việc cạnh tranh gay gắt, hoặc hợp với võ nghiệp, kỹ thuật. Cẩn trọng tai nạn nghề nghiệp.', loai: 'yeu', trongSo: 1.3, tags: ['canh_tranh', 'vo_nghiep'] },
  'Đà La':      { yNghia: 'Có Đà La — công việc trì trệ, dễ bị chậm trễ trong thăng tiến. Cần kiên nhẫn và không nên nóng vội.', loai: 'yeu', trongSo: 1.2, tags: ['tri_tre', 'cham_thang_tien'] },
  'Hỏa Tinh':   { yNghia: 'Có Hỏa Tinh — công việc có thể bùng nổ bất ngờ theo cả hai hướng: cơ hội lớn hoặc biến cố. Cần thận trọng với quyết định nhanh.', loai: 'yeu', trongSo: 1.2, tags: ['bung_no'] },
  'Linh Tinh':  { yNghia: 'Có Linh Tinh — công việc âm ỉ khó khăn, cần kiên nhẫn vượt qua. Tránh đầu tư dài hạn khi chưa chắc chắn.', loai: 'yeu', trongSo: 1.1, tags: ['kho_khan_am_i'] },
  'Địa Không':  { yNghia: 'Có Địa Không — sự nghiệp có thể thay đổi bất ngờ, không theo kế hoạch. Đôi khi hợp với nghề tự do, sáng tạo.', loai: 'yeu', trongSo: 1.2, tags: ['thay_doi_bat_ngo'] },
  'Địa Kiếp':   { yNghia: 'Có Địa Kiếp — dễ gặp biến cố trong sự nghiệp, có thể mất việc hoặc chuyển hướng đột ngột. Cần quỹ dự phòng.', loai: 'yeu', trongSo: 1.3, tags: ['bien_co_su_nghiep'] },
  'Thiên Hình': { yNghia: 'Có Thiên Hình — công việc nghiêm khắc, kỷ luật. Hợp với ngành luật, y, quân đội, hoặc công việc có tính pháp lý cao.', loai: 'trung', trongSo: 1.0, tags: ['ky_luat_cao', 'nghe_phap_ly'] },
  'Tang Môn':   { yNghia: 'Có Tang Môn — công việc có thể gặp chuyện buồn, hoặc liên quan đến tang sự, hiếu hỷ.', loai: 'yeu', trongSo: 0.9, tags: ['buon_cong_viec'] },
  'Bạch Hổ':    { yNghia: 'Có Bạch Hổ — cẩn trọng tai nạn nghề nghiệp, đặc biệt nếu làm việc trong môi trường nguy hiểm.', loai: 'yeu', trongSo: 1.0, tags: ['tai_nan_nghe'] }
};

/**
 * KHO VĂN CHO CUNG QUAN LỘC — 6 nhóm tính cách (A, B, C, D, E, F).
 * Mỗi nhóm có 7 đoạn: Tóm tắt, Nghề nghiệp, Môi trường, 
 * Thăng tiến, Khó khăn, Lời khuyên.
 */
var TUVI_VAN_QUANLOC = {

  // NHÓM A — Lãnh đạo (Tử Vi, Thái Dương, Thiên Tướng)
  'A': {
    tomTat: 'Sự nghiệp của bạn thuộc nhóm "lãnh đạo" — bạn có tố chất đứng đầu và phù hợp với vai trò quản lý. Sự nghiệp có xu hướng phát triển nếu bạn được đặt trong môi trường cho phép phát huy năng lực.',
    ngheNghiep: 'Bạn phù hợp với các vị trí quản lý, lãnh đạo, hành chính, nhà nước, giáo dục, hoặc truyền thông. Cụ thể, bạn có thể làm giám đốc, trưởng phòng, hiệu trưởng, hoặc các vị trí quản trị cấp cao. Bạn cũng hợp với các công việc cần uy tín xã hội và khả năng truyền cảm hứng cho người khác.',
    moiTruong: 'Môi trường lý tưởng của bạn là tổ chức có cấu trúc rõ ràng, nơi bạn được giao quyền quyết định và có không gian để thể hiện năng lực lãnh đạo. Bạn không hợp với môi trường quá nhỏ hẹp, thiếu cơ hội thăng tiến, hoặc nơi bạn bị kèm cặp quá mức.',
    thangTien: 'Con đường thăng tiến của bạn thường đi từ vị trí chuyên môn lên quản lý, sau đó lên cấp cao hơn. Bạn thường được đề bạt nhờ uy tín tích lũy và khả năng dẫn dắt tập thể. Đỉnh cao sự nghiệp có thể đến sau tuổi 40.',
    khoKhan: 'Khó khăn chính là cái tôi lớn — bạn có thể va chạm với cấp trên hoặc đồng nghiệp khi bất đồng quan điểm. Ngoài ra, bạn dễ gánh vác quá nhiều trách nhiệm, dẫn đến kiệt sức. Cần học cách phân quyền và chấp nhận sự giúp đỡ.',
    loiKhuyen: [
      'Học cách lắng nghe và tôn trọng ý kiến khác biệt — lãnh đạo giỏi là người biết dùng người giỏi hơn mình.',
      'Đừng cố gắng làm hết mọi việc — phân quyền cho cấp dưới để họ cùng phát triển.',
      'Xây dựng uy tín bằng hành động cụ thể, không chỉ bằng chức vụ — đó là cách giữ được lòng người lâu dài.'
    ]
  },

  // NHÓM B — Chuyên môn (Thiên Cơ, Cự Môn, Thái Âm)
  'B': {
    tomTat: 'Sự nghiệp của bạn thuộc nhóm "chuyên môn" — bạn có xu hướng phát triển nhờ tri thức, sự phân tích và kỹ năng đặc thù. Càng chuyên sâu, bạn càng có cơ hội thành công.',
    ngheNghiep: 'Bạn phù hợp với các ngành cần trí tuệ và chuyên môn sâu: nghiên cứu, kỹ thuật, công nghệ, giảng dạy, luật, tư vấn, kế toán, hoặc thiết kế. Cụ thể, bạn có thể làm chuyên gia, nhà nghiên cứu, giáo viên, luật sư, kỹ sư, hoặc chuyên viên phân tích. Bạn không hợp với công việc tay chân đơn giản hoặc đòi hỏi sức lực.',
    moiTruong: 'Môi trường lý tưởng của bạn là nơi coi trọng chất xám, cho bạn không gian tự học và phát triển chuyên môn. Bạn hợp với môi trường học thuật, tổ chức nghiên cứu, hoặc công ty công nghệ. Không hợp môi trường đòi hỏi giao tiếp quá nhiều hoặc làm việc theo quy trình cứng nhắc.',
    thangTien: 'Con đường thăng tiến của bạn thường đi theo chiều sâu — từ nhân viên lên chuyên viên, chuyên gia, trưởng nhóm chuyên môn. Bạn cũng có thể mở công ty tư vấn hoặc làm freelancer khi đã đủ uy tín. Sự nghiệp có thể biến động vài lần trước khi ổn định.',
    khoKhan: 'Khó khăn chính là sự thiếu kiên nhẫn — bạn dễ chán khi công việc trở nên lặp lại, hoặc bỏ dở khi chưa thấy kết quả. Ngoài ra, bạn có thể bị hiểu lầm là "khó gần" hoặc "lý thuyết suông". Cần học cách giao tiếp cởi mở hơn với đồng nghiệp.',
    loiKhuyen: [
      'Chọn một lĩnh vực chuyên môn và đi thật sâu — đây là con đường phát triển bền vững nhất của bạn.',
      'Đầu tư vào bằng cấp và chứng chỉ chuyên môn — chúng là chìa khóa mở ra cơ hội lớn.',
      'Học cách giao tiếp và chia sẻ kiến thức với người khác — chuyên gia giỏi cũng cần được hiểu và công nhận.'
    ]
  },

  // NHÓM C — Kinh doanh (Vũ Khúc, Thiên Phủ, Thiên Đồng)
  'C': {
    tomTat: 'Sự nghiệp của bạn thuộc nhóm "kinh doanh" — bạn phù hợp với các công việc liên quan đến tài chính, quản lý, hoặc tự làm chủ. Sự nghiệp có xu hướng ổn định và phát triển dần theo thời gian.',
    ngheNghiep: 'Bạn phù hợp với tài chính, ngân hàng, kế toán, quản lý tài sản, kinh doanh, hoặc các lĩnh vực thương mại. Cụ thể, bạn có thể làm giám đốc tài chính, kế toán trưởng, chủ doanh nghiệp, hoặc quản lý chuỗi cung ứng. Bạn cũng hợp với các công việc cần tính toán, quản lý nguồn lực, và ra quyết định dựa trên dữ liệu.',
    moiTruong: 'Môi trường lý tưởng của bạn là nơi công việc có cấu trúc rõ ràng, đo lường được kết quả, và có cơ hội phát triển thu nhập. Bạn hợp với công ty lớn, tổ chức tài chính, hoặc tự kinh doanh khi đã đủ vốn và kinh nghiệm. Không hợp môi trường hỗn loạn, thiếu quy tắc.',
    thangTien: 'Con đường thăng tiến của bạn thường từ nhân viên lên chuyên viên, sau đó lên quản lý và giám đốc. Nếu có ý định làm chủ, bạn nên tích lũy vốn và kinh nghiệm ít nhất 5-7 năm trước khi khởi nghiệp. Sự nghiệp thường phát triển chậm nhưng bền.',
    khoKhan: 'Khó khăn chính là sự chậm chạp — bạn có xu hướng thận trọng quá mức, bỏ lỡ cơ hội lớn vì chờ đợi điều kiện hoàn hảo. Ngoài ra, bạn dễ bị "tù túng" khi làm việc trong môi trường quá khuôn khổ. Cần học cách chấp nhận rủi ro có tính toán.',
    loiKhuyen: [
      'Đừng chờ đợi điều kiện hoàn hảo — cơ hội lớn thường đến khi bạn chưa sẵn sàng hoàn toàn.',
      'Xây dựng mạng lưới quan hệ trong ngành — nhiều cơ hội đến từ người quen hơn từ CV.',
      'Nếu có ý định khởi nghiệp, hãy bắt đầu từ quy mô nhỏ rồi mở rộng — đừng đặt cược tất cả một lần.'
    ]
  }

  ,

  // NHÓM D — Tiên phong (Thất Sát, Phá Quân, Liêm Trinh)
  'D': {
    tomTat: 'Sự nghiệp của bạn thuộc nhóm "tiên phong" — bạn có xu hướng phù hợp với những công việc cần sự quyết liệt, dám đổi mới và không ngại thử thách.',
    ngheNghiep: 'Bạn phù hợp với quân sự, công an, luật, kỹ thuật nặng, khởi nghiệp, hoặc các lĩnh vực cạnh tranh cao. Cụ thể, bạn có thể làm chỉ huy, giám đốc vận hành, kỹ sư xây dựng, chủ doanh nghiệp, hoặc chuyên gia cải cách. Bạn không hợp với công việc nhàm chán, lặp lại, hoặc bị gò bó quá mức.',
    moiTruong: 'Môi trường lý tưởng của bạn là nơi có tính cạnh tranh, cần sự quyết đoán, và cho phép bạn tự quyết định. Bạn hợp với startup, doanh nghiệp đang chuyển đổi, hoặc tổ chức có tính đột phá. Không hợp môi trường quan liêu, chậm chạp, hoặc đầy thủ tục rườm rà.',
    thangTien: 'Con đường thăng tiến của bạn thường gắn với những bước ngoặt lớn — có thể nhảy vọt, có thể tụt dốc, nhưng luôn có cơ hội làm lại. Bạn thường được giao trọng trách khi tổ chức cần cải cách hoặc cần người dám làm. Đỉnh cao sự nghiệp có thể đến bất ngờ sau tuổi 35.',
    khoKhan: 'Khó khăn chính là sự nóng nảy — bạn dễ va chạm với đồng nghiệp hoặc cấp trên khi bất đồng quan điểm. Ngoài ra, bạn dễ bị cuốn vào cạnh tranh mà quên mất mục tiêu dài hạn. Cần học cách kiềm chế và nhìn xa hơn.',
    loiKhuyen: [
      'Học cách chờ đợi đúng thời điểm — không phải cơ hội nào cũng cần nắm bắt ngay.',
      'Xây dựng uy tín bằng kết quả cụ thể — đừng chỉ nói về kế hoạch.',
      'Cẩn trọng với các mối quan hệ nơi công sở — bạn dễ tạo kẻ thù hơn là đồng minh nếu không khéo léo.'
    ]
  },

  // NHÓM E — Sáng tạo (Tham Lang, Thiên Lương)
  'E': {
    tomTat: 'Sự nghiệp của bạn thuộc nhóm "sáng tạo" — bạn phù hợp với công việc cần sự đa dạng, giao tiếp rộng, và cơ hội thể hiện bản thân.',
    ngheNghiep: 'Bạn phù hợp với kinh doanh, giải trí, nghệ thuật, truyền thông, ngoại giao, giáo dục, y tế, hoặc các lĩnh vực phục vụ con người. Cụ thể, bạn có thể làm MC, diễn viên, nhà thiết kế, marketing, tư vấn, hoặc chuyên gia chăm sóc sức khỏe. Bạn không hợp với công việc đơn điệu hoặc ít tương tác với người khác.',
    moiTruong: 'Môi trường lý tưởng của bạn là nơi có nhiều người, nhiều ý tưởng, và bạn được tự do sáng tạo. Bạn hợp với agency, studio, trường học, bệnh viện, hoặc các tổ chức có văn hóa cởi mở. Không hợp môi trường cứng nhắc, ít giao tiếp, hoặc đòi hỏi sự im lặng kéo dài.',
    thangTien: 'Con đường thăng tiến của bạn thường đi qua nhiều vị trí khác nhau — bạn có thể đổi nghề 2-3 lần trước khi tìm được công việc thực sự phù hợp. Mỗi lần đổi là một lần tích lũy thêm kỹ năng và mối quan hệ. Đỉnh cao sự nghiệp có thể đến muộn nhưng rất rực rỡ.',
    khoKhan: 'Khó khăn chính là sự phân tán — bạn dễ bị cuốn theo nhiều cơ hội cùng lúc mà không đi đến đâu. Ngoài ra, bạn dễ bị ảnh hưởng bởi cảm xúc — khi vui thì làm hết mình, khi buồn thì bỏ dở. Cần học cách duy trì nhịp độ ổn định.',
    loiKhuyen: [
      'Chọn 1-2 nghề chính và đi sâu — đừng dàn trải quá nhiều hướng.',
      'Xây dựng thương hiệu cá nhân — trong ngành sáng tạo, uy tín cá nhân quan trọng hơn chức danh.',
      'Luôn giữ một khoản thu nhập ổn định ngoài công việc sáng tạo — đây là điểm tựa để bạn tự do sáng tạo.'
    ]
  },

  // NHÓM F — Vô chính diệu (VCD)
  'F': {
    tomTat: 'Sự nghiệp của bạn thuộc nhóm đặc biệt — cung Quan Lộc không có chính tinh. Sự nghiệp phụ thuộc nhiều vào hoàn cảnh và các cung xung quanh.',
    ngheNghiep: 'Bạn phù hợp với những công việc linh hoạt, ít gò bó, và cho phép bạn thích nghi với nhiều môi trường khác nhau. Cụ thể, bạn có thể làm freelance, tư vấn tự do, kinh doanh online, hoặc các công việc dự án ngắn hạn. Bạn cũng có thể thành công trong vai trò kết nối — làm cầu nối giữa các bộ phận, hoặc giữa công ty với khách hàng.',
    moiTruong: 'Môi trường lý tưởng của bạn là nơi có nhiều cơ hội thay đổi, không cố định một vị trí. Bạn hợp với công ty đa quốc gia, tổ chức phi lợi nhuận, hoặc môi trường làm việc từ xa. Không hợp môi trường có lộ trình thăng tiến cứng nhắc, hoặc đòi hỏi bạn phải giữ một vai trò cố định trong nhiều năm.',
    thangTien: 'Con đường thăng tiến của bạn thường đến từ việc nắm bắt cơ hội hơn là theo lộ trình. Bạn có thể được trao cơ hội lớn khi người khác không ngờ tới — nhờ sự linh hoạt và khả năng thích nghi. Sự nghiệp thường chuyển biến mạnh sau tuổi 30, khi bạn đã tích lũy đủ kinh nghiệm và hiểu mình muốn gì.',
    khoKhan: 'Khó khăn chính là sự thiếu định hướng — bạn dễ cảm thấy mất phương hướng khi không có ai hướng dẫn hoặc không có mục tiêu rõ ràng. Ngoài ra, bạn dễ bị ảnh hưởng bởi người khác — thấy ai làm gì thành công thì muốn làm theo. Cần học cách tự vạch ra con đường của mình.',
    loiKhuyen: [
      'Đặt ra một mục tiêu nghề nghiệp cụ thể 3-5 năm — dù có thể thay đổi, nhưng cần có để bám vào.',
      'Tìm một người cố vấn (mentor) có kinh nghiệm — họ sẽ giúp bạn tránh sai lầm lớn.',
      'Tận dụng sự linh hoạt của bản thân — đây là lợi thế lớn trong thời đại thay đổi nhanh.'
    ]
  }

};

/* ============================================================
 *  BẢNG DỮ LIỆU + KHO VĂN CHO CUNG TỬ TỨC (con cái)
 * ============================================================ */

var TUVI_FACT_TUTUC_CHINHTINH = {
  'Tử Vi':      { yNghia: 'Con của bạn thuộc mẫu người có khí chất, tự tin từ nhỏ. Con thường có tố chất nổi bật trong tập thể và có xu hướng vươn tới vị trí dẫn dắt.', trongSo: 1.5, tags: ['con_co_khi_chat', 'tu_tin', 'co_to_chat_lanh_dao'] },
  'Thiên Cơ':   { yNghia: 'Con của bạn thuộc mẫu người thông minh, lanh lợi, hiếu động và thích khám phá. Nếu sinh con muộn (sau 30 tuổi), con cái thường ổn định và dễ nuôi hơn.', trongSo: 1.4, tags: ['con_thong_minh', 'hieu_dong', 'sinh_muon_tot_hon'] },
  'Thái Dương': { yNghia: 'Con của bạn thuộc mẫu người nhiệt tình, hướng ngoại, có tố chất lãnh đạo. Con trai thường bộc lộ rõ nét này hơn con gái.', trongSo: 1.5, tags: ['con_nhiet_tinh', 'huong_ngoai', 'con_trai_noi_bat'] },
  'Vũ Khúc':    { yNghia: 'Con của bạn thuộc mẫu người cứng rắn, thực tế, có xu hướng tự lập sớm. Con không thích dựa dẫm cha mẹ và thường có chí hướng riêng từ nhỏ.', trongSo: 1.4, tags: ['con_cung_ran', 'thuc_te', 'tu_lap_som'] },
  'Thiên Đồng': { yNghia: 'Con của bạn thuộc mẫu người hiền hòa, vui vẻ, dễ gần, thích cuộc sống nhẹ nhàng. Con thường hòa đồng với mọi người và biết cách tận hưởng cuộc sống.', trongSo: 1.4, tags: ['con_hien_hoa', 'vui_ve', 'de_gan'] },
  'Liêm Trinh': { yNghia: 'Con của bạn thuộc mẫu người có nguyên tắc, cá tính mạnh. Lúc nhỏ con có thể khó dạy vì bướng bỉnh — cha mẹ cần nhiều kiên nhẫn. Khi lớn, con có xu hướng sống có kỷ luật và rõ ràng.', trongSo: 1.3, tags: ['con_nguyen_tac', 'ca_tinh', 'can_kien_nhan'] },
  'Thiên Phủ':  { yNghia: 'Con của bạn thuộc mẫu người hiếu thảo, biết lo toan. Con thường sống ổn định, biết giữ gìn và có xu hướng quan tâm đến gia đình nhiều hơn bạn bè cùng trang lứa.', trongSo: 1.5, tags: ['con_hieu_thao', 'biet_lo_toan', 'quan_tam_gia_dinh'] },
  'Thái Âm':    { yNghia: 'Con của bạn thuộc mẫu người hiền lành, tinh tế, giàu cảm xúc. Con gái thường bộc lộ rõ nét này hơn con trai. Con cái có xu hướng gắn bó với mẹ nhiều hơn.', trongSo: 1.4, tags: ['con_hien_lanh', 'tinh_te', 'gan_bo_voi_me'] },
  'Tham Lang':  { yNghia: 'Con của bạn thuộc mẫu người đa tài, giao tiếp rộng. Lúc nhỏ con có thể khó hòa hợp với anh chị em trong nhà. Nếu sinh con muộn, con cái thường ổn định và dễ dạy hơn.', trongSo: 1.4, tags: ['con_da_tai', 'giao_te_rong', 'sinh_muon_tot_hon'] },
  'Cự Môn':     { yNghia: 'Con của bạn thuộc mẫu người khẩu tài sắc sảo, thích lý luận. Con có thể hay cãi và đặt câu hỏi ngược lại cha mẹ — cần dạy bằng lý lẽ thay vì áp đặt.', trongSo: 1.3, tags: ['con_khau_tai', 'hay_cai', 'day_bang_ly_le'] },
  'Thiên Tướng':{ yNghia: 'Con của bạn thuộc mẫu người ngoan ngoãn, nghĩa khí, sống ngay thẳng. Con có xu hướng bênh vực kẻ yếu và coi trọng công bằng từ nhỏ.', trongSo: 1.4, tags: ['con_ngoan', 'nghia_khi', 'trong_cong_bang'] },
  'Thiên Lương':{ yNghia: 'Con của bạn thuộc mẫu người hiếu thảo, sống đạo đức, có xu hướng quan tâm cha mẹ khi về già. Con có thiên hướng về tôn giáo, triết lý, hoặc những lĩnh vực mang tính nhân văn.', trongSo: 1.4, tags: ['con_hieu_thao', 'song_dao_duc', 'thien_huong_tam_linh'] },
  'Thất Sát':   { yNghia: 'Con của bạn thuộc mẫu người có cá tính mạnh, độc lập sớm, không thích gò bó. Việc sinh nở có thể gặp chút trở ngại — nên chuẩn bị tốt về sức khỏe sinh sản. Cha mẹ cần tôn trọng sự tự do của con.', trongSo: 1.3, tags: ['con_ca_tinh', 'doc_lap_som', 'can_chuan_bi_sinh_no'] },
  'Phá Quân':   { yNghia: 'Con của bạn thuộc mẫu người độc lập, có xu hướng thay đổi. Con đầu lòng có thể khó nuôi khi nhỏ. Khi lớn, con thường thay đổi nghề nghiệp hoặc chỗ ở nhiều lần.', trongSo: 1.3, tags: ['con_doc_lap', 'hay_thay_doi', 'con_dau_kho_nuoi'] }
};

var TUVI_FACT_TUTUC_PHUTINH = {
  // Cát tinh — con cái tốt
  'Tả Phù':     { yNghia: 'Con cái có quý nhân phù trợ từ nhỏ, dễ được người khác giúp đỡ.', loai: 'manh', trongSo: 1.1, tags: ['con_quy_nhan'] },
  'Hữu Bật':    { yNghia: 'Con cái được nhiều người yêu mến, có anh chị em hỗ trợ lẫn nhau.', loai: 'manh', trongSo: 1.1, tags: ['con_duoc_yeu'] },
  'Thiên Khôi': { yNghia: 'Con cái có quý nhân nâng đỡ, dễ gặp cơ hội tốt trong học tập và sự nghiệp.', loai: 'manh', trongSo: 1.2, tags: ['con_quy_nhan'] },
  'Thiên Việt': { yNghia: 'Con cái có cơ hội thăng tiến, được người bên ngoài giúp.', loai: 'manh', trongSo: 1.2, tags: ['con_co_hoi'] },
  'Thai':       { yNghia: 'Con cái sớm — dễ có thai, dễ sinh. Đây là dấu hiệu tốt cho duyên con.', loai: 'manh', trongSo: 1.3, tags: ['con_som', 'de_sinh'] },
  'Hồng Loan':  { yNghia: 'Con cái xinh xắn, dễ thương, được nhiều người yêu mến.', loai: 'manh', trongSo: 1.0, tags: ['con_dep'] },
  'Thiên Hỷ':   { yNghia: 'Có tin vui con cái sớm — con cái đem lại niềm vui cho gia đình.', loai: 'manh', trongSo: 1.1, tags: ['con_tin_vui'] },
  'Long Trì':   { yNghia: 'Con cái có khí chất thanh nhã, thông minh, dễ học.', loai: 'manh', trongSo: 1.0, tags: ['con_thong_minh'] },
  'Phượng Các': { yNghia: 'Con cái có khí chất thanh nhã, có khiếu nghệ thuật.', loai: 'manh', trongSo: 1.0, tags: ['con_nghe_thuat'] },
  'Hóa Lộc':    { yNghia: 'Con cái mang lại tài lộc — con thành đạt và giúp đỡ cha mẹ về già.', loai: 'manh', trongSo: 1.4, tags: ['con_tai_loc'] },
  'Hóa Khoa':   { yNghia: 'Con cái học giỏi, có bằng cấp, có danh tiếng. Cha mẹ được nở mặt với con.', loai: 'manh', trongSo: 1.4, tags: ['con_hoc_gioi'] },
  'Hóa Quyền':  { yNghia: 'Con cái có uy, có tố chất lãnh đạo, thành đạt trong xã hội.', loai: 'manh', trongSo: 1.4, tags: ['con_lanh_dao'] },
  'Văn Xương':  { yNghia: 'Con cái có duyên với học hành, văn chương, sách vở.', loai: 'manh', trongSo: 1.1, tags: ['con_hoc_gioi'] },
  'Văn Khúc':   { yNghia: 'Con cái khéo ăn nói, có khiếu nghệ thuật và giao tiếp.', loai: 'manh', trongSo: 1.1, tags: ['con_kheo_an_noi'] },

  // Hung tinh — khó khăn về con
  'Kình Dương': { yNghia: 'Con cái có cá tính mạnh, dễ va chạm với cha mẹ khi lớn. Cần dạy con bằng sự tôn trọng thay vì áp đặt.', loai: 'yeu', trongSo: 1.3, tags: ['con_ca_tinh'] },
  'Đà La':      { yNghia: 'Duyên con đến chậm — có thể khó có con hoặc sinh con muộn. Cần kiên nhẫn.', loai: 'yeu', trongSo: 1.2, tags: ['con_muon'] },
  'Hỏa Tinh':   { yNghia: 'Con cái có thể nóng tính, hiếu động — cần dạy con kiểm soát cảm xúc.', loai: 'yeu', trongSo: 1.1, tags: ['con_nong_tinh'] },
  'Linh Tinh':  { yNghia: 'Con cái có giai đoạn khó nuôi, dễ ốm khi nhỏ. Cần chú ý sức khỏe con.', loai: 'yeu', trongSo: 1.1, tags: ['con_kho_nuoi'] },
  'Địa Không':  { yNghia: 'Duyên con mỏng — có thể hiếm muộn hoặc có con muộn. Nên chủ động chăm sóc sức khỏe sinh sản.', loai: 'yeu', trongSo: 1.3, tags: ['hiem_muon'] },
  'Địa Kiếp':   { yNghia: 'Sinh nở có thể trắc trở — cần chú ý sức khỏe khi mang thai và sinh.', loai: 'yeu', trongSo: 1.3, tags: ['sinh_no_trac_tro'] },
  'Hóa Kỵ':     { yNghia: 'Cha mẹ lo lắng nhiều về con — có thể con ốm đau hoặc gặp khó khăn trong học tập. Cần kiên nhẫn đồng hành.', loai: 'yeu', trongSo: 1.5, tags: ['lo_lang_ve_con'] },
  'Cô Thần':    { yNghia: 'Con cái có thể sống xa cha mẹ hoặc ít gần gũi. Cần chủ động kết nối tình cảm.', loai: 'yeu', trongSo: 1.0, tags: ['con_xa_cach'] },
  'Quả Tú':     { yNghia: 'Duyên con mỏng — có thể ít con hoặc con cái ở xa. Cần vun đắp tình cảm gia đình từ sớm.', loai: 'yeu', trongSo: 1.0, tags: ['it_con'] },
  'Thiên Hình': { yNghia: 'Con cái có thể cứng tính — cần dạy bằng kỷ luật mềm mỏng, tránh roi vọt.', loai: 'yeu', trongSo: 1.0, tags: ['con_cung_tinh'] },
  'Thiên Riêu': { yNghia: 'Con cái đa tình — cần uốn nắn sớm để tránh sa đà chuyện tình cảm.', loai: 'yeu', trongSo: 0.9, tags: ['con_da_tinh'] }
};

/* KHO VĂN CHO CUNG TỬ TỨC — 5 nhóm A-E */
var TUVI_VAN_TUTUC = {
  'A': { // Uy quyền: Tử Vi, Thiên Phủ, Thiên Tướng, Thái Dương
    tomTat: 'Con cái của bạn thuộc nhóm "quý hiển" — con có khí chất tự tin, có tố chất nổi bật. Con cái có xu hướng thành đạt nếu được nuôi dạy đúng cách.',
    duyenCon: 'Duyên con của bạn khá tốt — có thể có con sớm và thuận lợi. Con đầu lòng thường dễ nuôi, ít ốm đau.',
    conCai: 'Con của bạn thường có khí chất tự tin từ nhỏ, có tố chất lãnh đạo hoặc nổi bật trong tập thể. Con học hành tử tế và có xu hướng thành đạt trong xã hội. Về già, bạn được nhờ con nhiều.',
    nuoiDay: 'Bạn nên dạy con bằng cách nêu gương và tôn trọng — không nên áp đặt. Con cần được khuyến khích phát huy cá tính nhưng cũng cần học cách khiêm tốn.',
    loiKhuyen: ['Dành thời gian chất lượng cho con mỗi ngày — 30 phút trò chuyện thật sự tốt hơn 3 giờ ngồi cạnh nhưng không tương tác.', 'Dạy con bằng cách làm gương — con học từ hành động của bạn nhiều hơn từ lời nói.', 'Khuyến khích con theo đuổi đam mê, kể cả khi đam mê đó khác với kỳ vọng của bạn.']
  },
  'B': { // Trí tuệ: Thiên Cơ, Cự Môn, Thái Âm
    tomTat: 'Con cái của bạn thuộc nhóm "trí tuệ" — con có đầu óc nhạy bén, thích tìm tòi và đặt câu hỏi. Nếu được khuyến khích, con cái thường học hành tốt.',
    duyenCon: 'Duyên con của bạn có thể đến muộn — nên sinh con sau 30 tuổi để thuận lợi hơn. Con đầu lòng có thể hơi khó nuôi khi nhỏ nhưng lớn lên khỏe mạnh.',
    conCai: 'Con của bạn nhạy bén, thích khám phá và đặt câu hỏi từ nhỏ. Con có xu hướng học giỏi, đặc biệt với các môn cần tư duy. Con cũng khá độc lập — có thể sớm rời nhà đi học xa.',
    nuoiDay: 'Bạn nên nuôi dạy con bằng cách khuyến khích tò mò và sáng tạo. Tránh gò bó con theo khuôn khổ cứng — con cần không gian tự do để phát triển. Đặc biệt, hãy trò chuyện với con như người lớn, không coi con là trẻ con.',
    loiKhuyen: ['Đọc sách cùng con mỗi tối — nuôi dưỡng tình yêu tri thức từ nhỏ.', 'Cho con tham gia nhiều hoạt động khám phá — không chỉ học kiến thức, mà còn học kỹ năng sống.', 'Khi con đặt câu hỏi khó, hãy công nhận sự thông minh của con — đừng trả lời qua loa.']
  },
  'C': { // Thực tế: Vũ Khúc, Thiên Đồng, Liêm Trinh
    tomTat: 'Con cái của bạn thuộc nhóm "thực tế - hiếu thuận" — con thuộc mẫu người chăm chỉ, biết lo toan. Khi lớn lên, con cái thường quan tâm đến gia đình.',
    duyenCon: 'Duyên con của bạn ổn định — có thể có con ở độ tuổi trung bình (25-30). Con cái thường thuận lợi khi sinh, ít biến chứng.',
    conCai: 'Con của bạn thực tế, chăm chỉ và biết nghe lời từ nhỏ. Con quan tâm đến gia đình, thích giúp đỡ cha mẹ. Khi lớn lên, con thường chọn nghề ổn định và sống gần cha mẹ — đây là phúc lớn của bạn.',
    nuoiDay: 'Bạn nên nuôi dạy con bằng kỷ luật mềm mỏng và khuyến khích tính tự lập. Đừng bao bọc quá mức — con cần học cách tự xoay xở để trưởng thành. Đặc biệt, hãy để con tự chọn con đường của mình thay vì ép theo kỳ vọng của cha mẹ.',
    loiKhuyen: ['Giao cho con việc nhà từ nhỏ — dạy con tinh thần trách nhiệm thay vì chỉ chăm sóc.', 'Khen ngợi khi con làm việc tốt — nhưng đừng thưởng vật chất mọi lúc, hãy để con biết giá trị của nỗ lực.', 'Giữ kết nối với con khi con trưởng thành — đừng để khoảng cách làm mất đi sự gần gũi.']
  },
  'D': { // Cá tính: Thất Sát, Phá Quân
    tomTat: 'Con cái của bạn thuộc nhóm "cá tính mạnh" — con có xu hướng độc lập, có chí hướng riêng. Cha mẹ cần nhiều kiên nhẫn, nhưng nếu nuôi dạy đúng cách, con sẽ thành đạt.',
    duyenCon: 'Duyên con của bạn có thể gặp trở ngại — con đầu lòng có thể khó nuôi hoặc sinh nở có chút trắc trở. Nên sinh con muộn (sau 30) để thuận lợi hơn.',
    conCai: 'Con của bạn có cá tính mạnh từ nhỏ — không thích bị sai khiến, có suy nghĩ riêng, có thể hơi bướng bỉnh. Khi lớn lên, con độc lập sớm, có thể đi xa lập nghiệp. Đây là mẫu con cái mà cha mẹ cần nhiều kiên nhẫn, nhưng nếu nuôi dạy đúng cách, con sẽ thành đạt.',
    nuoiDay: 'Bạn nên nuôi dạy con bằng cách tôn trọng sự độc lập của con. Đừng áp đặt, đừng roi vọt — con càng bị ép càng phản kháng. Hãy cho con quyền quyết định trong những việc phù hợp với tuổi, và hướng dẫn thay vì ra lệnh.',
    loiKhuyen: ['Cho con tham gia thể thao hoặc hoạt động mạnh — giải phóng năng lượng và học kỷ luật.', 'Trò chuyện với con như bạn bè khi con ở tuổi teen — đừng chỉ làm cha mẹ nghiêm khắc.', 'Chấp nhận rằng con sẽ có con đường riêng — đừng ép con theo khuôn mẫu của bạn.']
  },
  'E': { // Đa tài: Tham Lang, Thiên Lương
    tomTat: 'Con cái của bạn thuộc nhóm "đa tài - sáng tạo" — con có năng khiếu và thích khám phá nhiều lĩnh vực. Nếu được định hướng tốt, con cái có triển vọng về nghệ thuật hoặc tri thức.',
    duyenCon: 'Duyên con của bạn có thể khá tốt — nhưng con cái dễ đến muộn hoặc có khoảng cách tuổi với cha mẹ. Con đầu lòng thường khỏe mạnh.',
    conCai: 'Con của bạn đa tài từ nhỏ — có thể giỏi nhiều thứ nhưng không chuyên sâu một thứ. Con cũng nhân hậu, biết quan tâm đến người khác. Khi lớn lên, con có thể theo con đường nghệ thuật, giáo dục, y tế, hoặc các lĩnh vực cần sự sáng tạo và tình cảm.',
    nuoiDay: 'Bạn nên nuôi dạy con bằng cách khuyến khích sự đa dạng nhưng cũng dạy con tính kiên trì. Đừng để con bỏ dở giữa chừng khi gặp khó khăn — hãy dạy con rằng "đi đến cùng một việc" quan trọng hơn "làm nhiều việc dở dang".',
    loiKhuyen: ['Cho con thử nhiều môn năng khiếu — nhưng mỗi môn hãy học ít nhất 1 năm trước khi quyết định bỏ.', 'Dạy con lòng biết ơn và sự sẻ chia — đây là nền tảng đạo đức quan trọng của nhóm "đa tài".', 'Hãy là người bạn đồng hành, không chỉ là người giám sát — con cái nhóm này cần được thấu hiểu.']
  }
};

/* ============================================================
 *  BẢNG DỮ LIỆU + KHO VĂN CHO CUNG TẬT ÁCH (sức khỏe)
 * ============================================================ */

var TUVI_FACT_TATACH_CHINHTINH = {
  'Tử Vi':      { yNghia: 'Bạn thuộc mẫu người có thể chất khá vững vàng, nhìn chung ít bệnh nặng. Cần chú ý hệ tiêu hóa và tỳ vị, đặc biệt khi ăn uống thất thường.', trongSo: 1.4, tags: ['the_chat_vung_vang', 'it_benh_nang', 'tieu_hoa'] },
  'Thiên Cơ':   { yNghia: 'Bạn thuộc mẫu người nhạy cảm với căng thẳng — dễ bị ảnh hưởng đến gan, thần kinh và chân tay khi lo nghĩ nhiều. Cần chú ý nghỉ ngơi hợp lý và giữ tinh thần thoải mái.', trongSo: 1.4, tags: ['nhao_cam_cang_thang', 'gan_than_kinh', 'can_nghi_ngoi'] },
  'Thái Dương': { yNghia: 'Bạn thuộc mẫu người có xu hướng cần chú ý đến mắt, tim, huyết áp và đầu. Có thể bị đau nửa đầu hoặc các vấn đề về mắt khi lớn tuổi. Nên kiểm tra sức khỏe định kỳ.', trongSo: 1.5, tags: ['can_chu_y_mat_tim', 'co_the_dau_nua_dau', 'can_kiem_tra_dinh_ky'] },
  'Vũ Khúc':    { yNghia: 'Bạn thuộc mẫu người có xu hướng gặp các vấn đề về phổi, hô hấp, răng và xương. Có thể bị đau lưng hoặc các vấn đề về khớp khi có tuổi.', trongSo: 1.4, tags: ['can_chu_y_ho_hap', 'co_the_dau_lung', 'xuong_khop'] },
  'Thiên Đồng': { yNghia: 'Bạn thuộc mẫu người cần chú ý đến thận, bàng quang và tai. Có thể gặp các vấn đề tiết niệu hoặc nghe kém khi lớn tuổi.', trongSo: 1.3, tags: ['can_chu_y_than_tai', 'tiet_nieu', 'nghe_kem_khi_gia'] },
  'Liêm Trinh': { yNghia: 'Bạn thuộc mẫu người cần chú ý đến máu huyết, các vấn đề về da, và hệ sinh dục. Nên tránh rượu bia và các chất kích thích để bảo vệ sức khỏe.', trongSo: 1.4, tags: ['can_chu_y_mau_huyet', 'can_tranh_ruou_bia', 'he_sinh_duc'] },
  'Thiên Phủ':  { yNghia: 'Bạn thuộc mẫu người có thể chất khá vững vàng, nhìn chung ít bệnh nặng. Cần chú ý dạ dày và tỳ vị — ăn uống điều độ là chìa khóa giữ gìn sức khỏe.', trongSo: 1.4, tags: ['the_chat_vung_vang', 'can_chu_y_da_day', 'an_uong_dieu_do'] },
  'Thái Âm':    { yNghia: 'Bạn thuộc mẫu người cần chú ý đến thận, mắt và hệ nội tiết. Có thể bị mất ngủ hoặc rối loạn nội tiết tố khi căng thẳng kéo dài.', trongSo: 1.4, tags: ['can_chu_y_than_mat', 'co_the_mat_ngu', 'noi_tiet_to'] },
  'Tham Lang':  { yNghia: 'Bạn thuộc mẫu người cần đặc biệt chú ý đến gan, thận và hệ sinh dục — nhất là khi lạm dụng rượu bia hoặc sinh hoạt thất thường. Sống điều độ là cách bảo vệ sức khỏe tốt nhất.', trongSo: 1.5, tags: ['can_chu_y_gan_than', 'can_song_dieu_do', 'he_sinh_duc'] },
  'Cự Môn':     { yNghia: 'Bạn thuộc mẫu người cần chú ý đến miệng, họng và dạ dày. Có thể bị viêm họng tái phát hoặc các vấn đề tiêu hóa khi căng thẳng kéo dài.', trongSo: 1.3, tags: ['can_chu_y_mieng_hong', 'co_the_viem_hong', 'tieu_hoa_khi_stress'] },
  'Thiên Tướng':{ yNghia: 'Bạn thuộc mẫu người cần chú ý đến da và bàng quang. Có thể gặp dị ứng da hoặc các vấn đề tiết niệu nhẹ khi cơ thể suy nhược.', trongSo: 1.3, tags: ['can_chu_y_da', 'bang_quang', 'de_di_ung'] },
  'Thiên Lương':{ yNghia: 'Bạn thuộc mẫu người có xu hướng ít bệnh và sống thọ. Cần chú ý dạ dày và ăn uống điều độ. Có duyên với y dược — dễ tìm được thầy thuốc tốt khi cần.', trongSo: 1.4, tags: ['it_benh_tho', 'can_chu_y_da_day', 'co_duyen_y_duoc'] },
  'Thất Sát':   { yNghia: 'Bạn thuộc mẫu người cần chú ý đến phổi, đại tràng và đề phòng tai nạn liên quan đến kim khí. Nên cẩn thận khi làm việc với máy móc hoặc dao kéo.', trongSo: 1.4, tags: ['can_chu_y_phoi', 'can_de_phong_tai_nan', 'can_than_voi_kim_khi'] },
  'Phá Quân':   { yNghia: 'Bạn thuộc mẫu người cần chú ý đến thận, khí huyết và đề phòng tai nạn cần phẫu thuật. Nên kiểm tra sức khỏe định kỳ và tránh các hoạt động nguy hiểm.', trongSo: 1.4, tags: ['can_chu_y_than', 'can_de_phong_tai_nan', 'kiem_tra_dinh_ky'] }
};

var TUVI_FACT_TATACH_PHUTINH = {
  // Cát tinh — sức khỏe tốt hơn
  'Thiên Y':     { yNghia: 'Có Thiên Y — gặp thầy gặp thuốc, có duyên với y dược. Khi ốm dễ tìm được thầy thuốc giỏi và thuốc hiệu nghiệm.', loai: 'manh', trongSo: 1.3, tags: ['thay_thuoc_tot'] },
  'Giải Thần':   { yNghia: 'Có Giải Thần — tai ách, bệnh tật dễ được hóa giải. Bệnh nặng có thể chuyển thành nhẹ.', loai: 'manh', trongSo: 1.3, tags: ['giai_tai_ach'] },
  'Thiên Giải':  { yNghia: 'Có Thiên Giải — gặp hung hóa cát, bệnh tật dễ qua. Đặc biệt tốt cho các ca bệnh cấp tính.', loai: 'manh', trongSo: 1.2, tags: ['giai_benh'] },
  'Địa Giải':    { yNghia: 'Có Địa Giải — bệnh mãn tính có cơ hội thuyên giảm. Cần kiên trì điều trị.', loai: 'manh', trongSo: 1.2, tags: ['giai_benh_man'] },
  'Hóa Khoa':    { yNghia: 'Có Hóa Khoa — gặp nạn có người giúp, bệnh tật có thầy giỏi chữa. Tinh thần lạc quan hỗ trợ quá trình hồi phục.', loai: 'manh', trongSo: 1.4, tags: ['quy_nhan_y_te'] },
  'Long Trì':    { yNghia: 'Có Long Trì — thể chất thanh tao, ít bệnh nặng. Sức đề kháng khá tốt.', loai: 'manh', trongSo: 0.8, tags: ['the_chat_tot'] },
  'Phượng Các':  { yNghia: 'Có Phượng Các — thể chất thanh tao, da dẻ hồng hào. Sức khỏe tổng quát tốt.', loai: 'manh', trongSo: 0.8, tags: ['the_chat_tot'] },
  'Thiên Đức':   { yNghia: 'Có Thiên Đức — được phù hộ, tai ách dễ qua. Sức khỏe tinh thần ổn định.', loai: 'manh', trongSo: 1.0, tags: ['phu_ho'] },
  'Nguyệt Đức':  { yNghia: 'Có Nguyệt Đức — nhân hậu, phúc dày, bệnh tật dễ qua. Tinh thần an nhiên hỗ trợ chữa bệnh.', loai: 'manh', trongSo: 1.0, tags: ['phuc_duc'] },
  'Hóa Lộc':     { yNghia: 'Có Hóa Lộc — sức khỏe tốt nhờ điều kiện sống đầy đủ. Có tiền chăm sóc sức khỏe và dinh dưỡng.', loai: 'manh', trongSo: 1.2, tags: ['suc_khoe_tot'] },

  // Hung tinh — sức khỏe cần chú ý
  'Kình Dương':  { yNghia: 'Có Kình Dương — đề phòng thương tích, tai nạn, phẫu thuật. Đặc biệt cẩn thận khi làm việc với kim khí.', loai: 'yeu', trongSo: 1.5, tags: ['thuong_tich_phau_thuat'] },
  'Đà La':       { yNghia: 'Có Đà La — bệnh dai dẳng, khó dứt. Cần chú ý răng, xương và các bệnh mãn tính.', loai: 'yeu', trongSo: 1.4, tags: ['benh_man'] },
  'Hỏa Tinh':    { yNghia: 'Có Hỏa Tinh — đề phòng sốt cao, viêm nhiễm, bỏng. Cơ thể dễ bị "nóng trong".', loai: 'yeu', trongSo: 1.3, tags: ['sot_viem'] },
  'Linh Tinh':   { yNghia: 'Có Linh Tinh — bệnh âm ỉ, dễ tái phát, đặc biệt về thần kinh. Cần kiểm tra sức khỏe định kỳ.', loai: 'yeu', trongSo: 1.3, tags: ['benh_than_kinh'] },
  'Địa Không':   { yNghia: 'Có Địa Không — sức khỏe có thể biến động bất ngờ. Cần chú ý các bệnh liên quan đến khí huyết và tinh thần.', loai: 'yeu', trongSo: 1.3, tags: ['bien_dong_suc_khoe'] },
  'Địa Kiếp':    { yNghia: 'Có Địa Kiếp — đề phòng tai nạn và các bệnh cấp tính. Nên có bảo hiểm y tế và quỹ dự phòng.', loai: 'yeu', trongSo: 1.4, tags: ['tai_nan_benh_cap'] },
  'Hóa Kỵ':      { yNghia: 'Có Hóa Kỵ — bệnh kinh niên, khó dứt, dễ tái phát. Cần kiên trì điều trị và chú ý sức khỏe tinh thần.', loai: 'yeu', trongSo: 1.6, tags: ['benh_kinh_nien'] },
  'Bệnh Phù':    { yNghia: 'Có Bệnh Phù — sức đề kháng yếu, dễ mắc bệnh. Cần tăng cường dinh dưỡng và tập thể dục.', loai: 'yeu', trongSo: 1.3, tags: ['de_khang_yeu'] },
  'Thiên Hình':  { yNghia: 'Có Thiên Hình — có thể phải phẫu thuật hoặc điều trị xâm lấn. Cần chú ý sức khỏe định kỳ.', loai: 'yeu', trongSo: 1.2, tags: ['phau_thuat'] },
  'Lưu Hà':      { yNghia: 'Có Lưu Hà — cẩn thận tai nạn sông nước và các vấn đề về máu huyết. Không nên bơi ở nơi nguy hiểm.', loai: 'yeu', trongSo: 1.2, tags: ['tai_nan_song_nuoc'] },
  'Tang Môn':    { yNghia: 'Có Tang Môn — tinh thần dễ buồn phiền, ảnh hưởng đến sức khỏe. Cần chú ý sức khỏe tinh thần.', loai: 'yeu', trongSo: 1.0, tags: ['tinh_than'] },
  'Bạch Hổ':     { yNghia: 'Có Bạch Hổ — đề phòng tai nạn, thương tích, đặc biệt liên quan đến máu huyết. Cẩn thận khi đi lại.', loai: 'yeu', trongSo: 1.3, tags: ['tai_nan_mau'] },
  'Thiên Khốc':  { yNghia: 'Có Thiên Khốc — nhạy cảm, dễ xúc động, ảnh hưởng đến tim mạch và hô hấp. Cần giữ tinh thần thoải mái.', loai: 'yeu', trongSo: 1.0, tags: ['tim_mach'] },
  'Thiên Hư':    { yNghia: 'Có Thiên Hư — sức khỏe có thể suy nhược. Cần chú ý dinh dưỡng và nghỉ ngơi.', loai: 'yeu', trongSo: 1.0, tags: ['suy_nhuoc'] },
  'Kiếp Sát':    { yNghia: 'Có Kiếp Sát — đề phòng tai nạn bất ngờ. Cẩn thận khi tham gia giao thông hoặc làm việc nguy hiểm.', loai: 'yeu', trongSo: 1.2, tags: ['tai_nan'] },
  'Phá Toái':    { yNghia: 'Có Phá Toái — đề phòng hao tổn sức khỏe. Cần chú ý các bệnh liên quan đến xương khớp.', loai: 'yeu', trongSo: 1.0, tags: ['xuong_khop'] }
};

/* KHO VĂN CHO CUNG TẬT ÁCH — 6 nhóm A-F */
var TUVI_VAN_TATACH = {
  'A': { // Thể chất tốt: Tử Vi, Thiên Phủ, Thiên Tướng, Thái Dương
    tomTat: 'Sức khỏe của bạn nhìn chung khá tốt — thể chất ổn định, ít bệnh nặng. Cần chú ý các bệnh liên quan đến tiêu hóa và huyết áp khi lớn tuổi.',
    theChat: 'Bạn có thể chất khá vững vàng, sức đề kháng tốt. Cơ thể thường cân đối, dễ hồi phục sau bệnh. Tuy nhiên, khi căng thẳng kéo dài, bạn dễ bị ảnh hưởng đến hệ tiêu hóa và tim mạch.',
    coQuan: 'Các cơ quan bạn cần chú ý: dạ dày – tỳ vị (liên quan đến ăn uống), tim – huyết áp (liên quan đến căng thẳng), và mắt (liên quan đến tuổi tác).',
    phongBenh: 'Cách phòng bệnh hiệu quả cho bạn: ăn uống điều độ (tránh bỏ bữa, tránh ăn khuya), kiểm tra huyết áp định kỳ sau tuổi 40, và dành thời gian thư giãn mỗi ngày để giảm căng thẳng.',
    loiKhuyen: [
      'Khám sức khỏe tổng quát mỗi năm một lần — phòng bệnh hơn chữa bệnh.',
      'Duy trì thói quen ăn uống điều độ — không bỏ bữa sáng, hạn chế ăn khuya.',
      'Tập thể dục đều đặn 30 phút mỗi ngày — đi bộ, yoga, hoặc bơi lội đều tốt.'
    ]
  },
  'B': { // Căng thẳng: Thiên Cơ, Cự Môn, Thái Âm
    tomTat: 'Sức khỏe của bạn chịu ảnh hưởng nhiều từ tinh thần — khi căng thẳng, cơ thể dễ phản ứng. Cần chú ý gan, thần kinh và giấc ngủ.',
    theChat: 'Bạn có thể chất nhạy cảm, dễ bị ảnh hưởng bởi môi trường và cảm xúc. Khi lo lắng, bạn dễ mất ngủ, đau đầu, và mệt mỏi. Ngược lại, khi tinh thần thoải mái, sức khỏe của bạn rất tốt.',
    coQuan: 'Các cơ quan bạn cần chú ý: gan (do căng thẳng và lo nghĩ nhiều), thần kinh (dễ đau đầu, mất ngủ), và hệ tiêu hóa (dễ bị đau dạ dày khi stress).',
    phongBenh: 'Cách phòng bệnh cho bạn: giữ tinh thần thoải mái (thiền, viết nhật ký, trò chuyện với người tin cậy), đảm bảo ngủ đủ 7-8 tiếng, và hạn chế cà phê – rượu bia.',
    loiKhuyen: [
      'Thực hành thiền hoặc hít thở sâu 10 phút mỗi ngày — giảm căng thẳng hiệu quả.',
      'Đi ngủ trước 23h và duy trì giờ ngủ cố định — giấc ngủ tốt giúp gan hồi phục.',
      'Học cách nói "không" với những việc không cần thiết — đừng ôm đồm quá nhiều.'
    ]
  },
  'C': { // Vững chắc: Vũ Khúc, Thiên Đồng, Liêm Trinh
    tomTat: 'Sức khỏe của bạn thuộc nhóm "vững chắc" — thể chất ổn định, ít bệnh nặng. Cần chú ý hô hấp, xương khớp và da khi lớn tuổi.',
    theChat: 'Bạn có thể chất rắn chắc, sức bền tốt. Cơ thể thường chịu được áp lực công việc. Tuy nhiên, khi làm việc quá sức, bạn dễ bị các vấn đề về xương khớp và hô hấp.',
    coQuan: 'Các cơ quan bạn cần chú ý: phổi – hô hấp (nhất là khi sống ở thành phố lớn), xương – khớp (do làm việc nhiều), và da (dễ bị dị ứng hoặc nổi mẩn).',
    phongBenh: 'Cách phòng bệnh cho bạn: tập thể dục đều đặn để duy trì khớp (bơi lội, đi bộ), hạn chế hút thuốc và môi trường ô nhiễm, và chăm sóc da đúng cách.',
    loiKhuyen: [
      'Bơi lội hoặc yoga 2-3 lần mỗi tuần — tốt cho cả xương khớp và hô hấp.',
      'Uống đủ 2 lít nước mỗi ngày — giúp da khỏe và thận hoạt động tốt.',
      'Khám răng định kỳ 6 tháng một lần — răng tốt là nền tảng sức khỏe.'
    ]
  },
  'D': { // Cần chú ý: Thất Sát, Phá Quân
    tomTat: 'Sức khỏe của bạn cần chú ý nhiều hơn — thể chất khá nhưng dễ gặp tai nạn hoặc bệnh cấp tính. Cần đặc biệt cẩn trọng.',
    theChat: 'Bạn có thể chất mạnh mẽ nhưng dễ bị tổn thương do tai nạn hoặc bệnh cấp tính. Cơ thể bạn phản ứng nhanh nhưng cũng dễ kiệt sức khi làm việc quá độ. Cần chú ý cân bằng giữa làm việc và nghỉ ngơi.',
    coQuan: 'Các cơ quan bạn cần chú ý: phổi – đại tràng (do căng thẳng), thận – khí huyết (do làm việc nhiều), và xương khớp (dễ gặp chấn thương).',
    phongBenh: 'Cách phòng bệnh cho bạn: tránh làm việc quá sức, cẩn thận khi tham gia giao thông và làm việc nguy hiểm, kiểm tra sức khỏe định kỳ 6 tháng một lần.',
    loiKhuyen: [
      'Luôn chú ý an toàn khi đi lại và làm việc — tai nạn là rủi ro chính của bạn.',
      'Ngủ đủ giấc và nghỉ ngơi hợp lý — đừng ép cơ thể làm việc quá sức.',
      'Duy trì bảo hiểm y tế và quỹ dự phòng — đề phòng chi phí điều trị bất ngờ.'
    ]
  },
  'E': { // Nhạy cảm: Tham Lang, Thiên Lương
    tomTat: 'Sức khỏe của bạn thuộc nhóm "nhạy cảm" — thể chất khá nhưng dễ bị ảnh hưởng bởi lối sống. Cần chú ý gan, thận và hệ sinh dục.',
    theChat: 'Bạn có thể chất khá tốt nhưng dễ bị ảnh hưởng bởi lối sống không điều độ. Khi sinh hoạt thất thường (ăn uống, ngủ nghỉ, quan hệ), sức khỏe của bạn dễ suy giảm. Ngược lại, khi sống điều độ, bạn rất khỏe mạnh.',
    coQuan: 'Các cơ quan bạn cần chú ý: gan – mật (do ăn uống), thận – tiết niệu (do sinh hoạt), và hệ sinh dục (do quan hệ).',
    phongBenh: 'Cách phòng bệnh cho bạn: sống điều độ (ăn uống, ngủ nghỉ, sinh hoạt), tránh rượu bia và các chất kích thích, và kiểm tra sức khỏe định kỳ (đặc biệt gan và thận).',
    loiKhuyen: [
      'Hạn chế tối đa rượu bia và các chất kích thích — gan và thận của bạn dễ bị tổn thương.',
      'Duy trì lối sống điều độ: ăn uống cân bằng, ngủ đủ giấc, sinh hoạt đều đặn.',
      'Kiểm tra chức năng gan – thận mỗi 6 tháng một lần nếu thường xuyên tiếp xúc với rượu bia.'
    ]
  },
  'F': { // VCD
    tomTat: 'Sức khỏe của bạn thuộc nhóm đặc biệt — cung Tật Ách không có chính tinh. Sức khỏe phụ thuộc nhiều vào cung xung chiếu và lối sống.',
    theChat: 'Bạn có thể chất linh hoạt, dễ thích nghi với môi trường. Sức khỏe thường khá ổn định nhưng có thể bị ảnh hưởng bởi tinh thần và chế độ sinh hoạt. Cần chú ý lắng nghe cơ thể mình.',
    coQuan: 'Các cơ quan cần chú ý phụ thuộc vào cung xung chiếu — cần kiểm tra định kỳ để phát hiện sớm vấn đề. Cần chú ý các bệnh liên quan đến tinh thần và tiêu hóa.',
    phongBenh: 'Cách phòng bệnh cho bạn: duy trì lối sống lành mạnh (ăn uống, ngủ nghỉ, tập thể dục), chú ý lắng nghe cơ thể, và khám sức khỏe định kỳ 1-2 lần mỗi năm.',
    loiKhuyen: [
      'Lắng nghe cơ thể mình — bạn dễ bỏ qua các dấu hiệu cảnh báo của cơ thể.',
      'Xây dựng thói quen sinh hoạt điều độ — đây là nền tảng sức khỏe của bạn.',
      'Khám sức khỏe tổng quát định kỳ 1-2 lần mỗi năm để phát hiện sớm vấn đề.'
    ]
  }
};

/* ============================================================
 *  BẢNG DỮ LIỆU + KHO VĂN CHO CUNG ĐIỀN TRẠCH (nhà cửa)
 * ============================================================ */

var TUVI_FACT_DIENTRACH_CHINHTINH = {
  'Tử Vi':      { yNghia: 'Nhà cửa của bạn thuộc mẫu người hướng đến không gian khang trang, đàng hoàng. Bạn có xu hướng sống ở nơi được nhiều người nể trọng và coi trọng phong thái bên ngoài của ngôi nhà.', trongSo: 1.5, tags: ['nha_cua_huong_khang_trang', 'coi_trong_phong_thai', 'huong_dang_hoang'] },
  'Thiên Cơ':   { yNghia: 'Bạn thuộc mẫu người hay thay đổi chỗ ở, thích sửa sang nhà cửa. Nhà ở của bạn có xu hướng thay đổi nhiều lần trong đời — có thể chuyển nhà vài lần.', trongSo: 1.4, tags: ['hay_doi_nha', 'thich_sua_sang', 'nhieu_lan_chuyen_nha'] },
  'Thái Dương': { yNghia: 'Bạn thuộc mẫu người coi trọng không gian sáng sủa, thoáng đãng. Nhà cửa có xu hướng ở nơi nhiều ánh sáng tự nhiên. Có thể được thừa hưởng nhà đất từ gia đình nếu sao đắc địa.', trongSo: 1.5, tags: ['nha_sang_sua', 'co_the_huong_to_nghiep', 'thoang_dang'] },
  'Vũ Khúc':    { yNghia: 'Bạn thuộc mẫu người tự gây dựng nhà cửa bằng sức mình hơn là dựa vào thừa hưởng. Nhà cửa có xu hướng vững chắc và có giá trị tài chính cao theo thời gian.', trongSo: 1.5, tags: ['tu_tao_nha', 'khong_dua_thua_huong', 'gia_tri_tai_chinh_cao'] },
  'Thiên Đồng': { yNghia: 'Nhà cửa của bạn có xu hướng thay đổi theo chiều hướng tích cực — ban đầu có thể chật vật nhưng về sau càng ổn định. Bạn thường tự lập trong việc nhà cửa, ít nhờ vả.', trongSo: 1.3, tags: ['tien_kho_hau_kha', 'tu_lap_trong_nha_cua', 'on_dinh_dan_ve_sau'] },
  'Liêm Trinh': { yNghia: 'Nhà đất của bạn cần đặc biệt cẩn thận về giấy tờ pháp lý — dễ có tranh chấp với anh em hoặc họ hàng về quyền thừa kế. Nên rõ ràng pháp lý ngay từ đầu.', trongSo: 1.4, tags: ['can_ro_rang_phap_ly', 'de_tranh_chap', 'can_kiem_tra_giay_to'] },
  'Thiên Phủ':  { yNghia: 'Bạn thuộc mẫu người có khả năng giữ và phát triển tài sản nhà đất tốt. Nhà cửa có xu hướng mang tính "kho tàng" — càng ở lâu càng có giá trị.', trongSo: 1.6, tags: ['giu_tai_san_tot', 'co_kha_nang_phat_trien', 'cang_o_lau_cang_co_gia'] },
  'Thái Âm':    { yNghia: 'Bạn thuộc mẫu người có duyên lớn với nhà đất — bất động sản có xu hướng là kênh tích lũy tài sản chủ lực. Nhà cửa thường ở nơi yên tĩnh, có không gian xanh.', trongSo: 1.6, tags: ['co_duyen_nha_dat', 'dien_san_chu_luc', 'thich_khong_gian_yen_tinh'] },
  'Tham Lang':  { yNghia: 'Nhà cửa của bạn có xu hướng lúc thịnh lúc suy — trung niên mới ổn định. Không nên đầu tư bất động sản khi còn trẻ, nên tích lũy và đợi thời điểm phù hợp.', trongSo: 1.3, tags: ['luc_thinh_luc_suy', 'trung_nien_on_dinh', 'nen_doi_thoi_diem'] },
  'Cự Môn':     { yNghia: 'Nhà đất của bạn cần cẩn thận về ranh giới và giấy tờ — có thể xảy ra tranh chấp với hàng xóm. Nên kiểm tra kỹ pháp lý trước khi mua và giữ hòa khí với hàng xóm.', trongSo: 1.3, tags: ['can_hoa_khi_hang_xom', 'can_kiem_tra_phap_ly', 'de_tranh_chap'] },
  'Thiên Tướng':{ yNghia: 'Nhà cửa của bạn thuộc mẫu người coi trọng sự ngăn nắp, chỉn chu. Không gian sống thường có gu thẩm mỹ và dễ có người giúp trong việc mua sắm, sửa sang.', trongSo: 1.4, tags: ['coi_trong_ngan_nap', 'co_gu_tham_my', 'duoc_giup_nha_cua'] },
  'Thiên Lương':{ yNghia: 'Bạn thuộc mẫu người có duyên với nhà cửa tổ nghiệp. Nhà ở thường ở nơi gần thiên nhiên, yên tĩnh — phù hợp với người thích cuộc sống thanh bình.', trongSo: 1.4, tags: ['co_duyen_to_nghiep', 'thich_gan_thien_nhien', 'song_thanh_binh'] },
  'Thất Sát':   { yNghia: 'Tổ nghiệp khó giữ — bạn thuộc mẫu người phải tự lập mới có nhà cửa vững chắc. Nhà đất của bạn có thể phải đổi chủ vài lần trước khi ổn định.', trongSo: 1.3, tags: ['kho_giu_to_nghiep', 'phai_tu_lap', 'doi_chu_nhieu_lan'] },
  'Phá Quân':   { yNghia: 'Bạn thuộc mẫu người phá cũ xây mới — hay mua bán nhà đất, đổi chỗ ở. Nhà cửa có xu hướng thay đổi nhiều lần trong đời, không cố định một chỗ.', trongSo: 1.3, tags: ['phá_cu_xay_moi', 'hay_mua_ban_nha', 'thay_doi_nhieu'] }
};

var TUVI_FACT_DIENTRACH_PHUTINH = {
  // Cát tinh — nhà cửa tốt
  'Lộc Tồn':   { yNghia: 'Có Lộc Tồn — bạn giữ được nhà đất, có của để dành. Đây là sao tốt cho Điền Trạch.', loai: 'manh', trongSo: 1.7, tags: ['giu_nha_dat'] },
  'Hóa Lộc':   { yNghia: 'Có Hóa Lộc — tăng thêm tài sản bất động sản. Nhà đất của bạn có xu hướng sinh lời theo thời gian.', loai: 'manh', trongSo: 1.6, tags: ['tai_san_tang'] },
  'Hóa Khoa':  { yNghia: 'Có Hóa Khoa — giấy tờ nhà đất thuận lợi, mua bán dễ dàng, ít tranh chấp.', loai: 'manh', trongSo: 1.4, tags: ['giay_to_thuan'] },
  'Thiên Trù': { yNghia: 'Có Thiên Trù — nhà đủ ăn, bếp núc ấm cúng. Không khí gia đình ấm áp, dễ chịu.', loai: 'manh', trongSo: 1.2, tags: ['nha_am_cung'] },
  'Long Trì':  { yNghia: 'Có Long Trì — nhà cửa thanh nhã, phong thủy tốt. Ở đâu cũng tạo được không gian đẹp.', loai: 'manh', trongSo: 1.0, tags: ['nha_dep'] },
  'Phượng Các':{ yNghia: 'Có Phượng Các — nhà cửa có không gian đẹp, sang trọng. Môi trường sống thanh lịch.', loai: 'manh', trongSo: 1.0, tags: ['nha_dep'] },
  'Tả Phù':    { yNghia: 'Có Tả Phù — được người khác giúp đỡ trong việc nhà cửa, mua bán thuận lợi.', loai: 'manh', trongSo: 1.1, tags: ['duoc_giup_nha'] },
  'Hữu Bật':   { yNghia: 'Có Hữu Bật — có người hỗ trợ về nhà đất, anh em giúp đỡ lẫn nhau.', loai: 'manh', trongSo: 1.1, tags: ['duoc_giup_nha'] },

  // Hung tinh — nhà cửa cần chú ý
  'Địa Không': { yNghia: 'Có Địa Không — nhà cửa dễ hao hụt, không nên đầu tư bất động sản quy mô lớn.', loai: 'yeu', trongSo: 1.4, tags: ['hao_hut_nha'] },
  'Địa Kiếp':  { yNghia: 'Có Địa Kiếp — đề phòng mất nhà đất hoặc tranh chấp. Cần rõ ràng giấy tờ pháp lý.', loai: 'yeu', trongSo: 1.5, tags: ['mat_nha_dat', 'tranh_chap'] },
  'Hỏa Tinh':  { yNghia: 'Có Hỏa Tinh — đề phòng hỏa hoạn. Cần kiểm tra hệ thống điện, bếp gas định kỳ.', loai: 'yeu', trongSo: 1.4, tags: ['hoa_hoan'] },
  'Linh Tinh': { yNghia: 'Có Linh Tinh — nhà cửa có thể có vấn đề ngầm (ẩm mốc, dột, nứt). Cần bảo trì thường xuyên.', loai: 'yeu', trongSo: 1.2, tags: ['nha_hu_hong'] },
  'Kình Dương':{ yNghia: 'Có Kình Dương — nhà cửa có thể có tranh chấp với hàng xóm. Cần giữ hòa khí và rõ ràng ranh giới.', loai: 'yeu', trongSo: 1.3, tags: ['tranh_chap_hang_xom'] },
  'Đà La':     { yNghia: 'Có Đà La — nhà đất dây dưa, mua bán khó dứt khoát. Cần kiên nhẫn trong giao dịch.', loai: 'yeu', trongSo: 1.2, tags: ['giao_dich_cham'] },
  'Hóa Kỵ':    { yNghia: 'Có Hóa Kỵ — giấy tờ nhà đất rắc rối, dễ có vấn đề pháp lý. Cần kiểm tra kỹ trước khi ký kết.', loai: 'yeu', trongSo: 1.5, tags: ['giay_to_rac_roi'] },
  'Thiên Hình':{ yNghia: 'Có Thiên Hình — nhà cửa có thể gặp vấn đề pháp lý hoặc kiện tụng. Cần minh bạch từ đầu.', loai: 'yeu', trongSo: 1.1, tags: ['kien_tung_nha'] }
};

var TUVI_VAN_DIENTRACH = {
  'A': { // Nhà cửa vững vàng: Tử Vi, Thiên Phủ, Thái Âm
    tomTat: 'Nhà cửa của bạn thuộc nhóm "vững vàng" — bạn có lộc về nhà đất, tài sản ổn định và có xu hướng tăng theo thời gian.',
    nhaCua: 'Bạn có duyên với nhà đất — thường sở hữu bất động sản có giá trị và giữ được lâu dài. Nhà cửa của bạn khang trang, được nhiều người nể trọng. Có thể bạn được thừa hưởng từ cha mẹ hoặc tự gây dựng từ sớm.',
    moiTruong: 'Môi trường sống lý tưởng của bạn là nơi yên tĩnh, có không gian xanh, an ninh tốt. Bạn hợp với nhà ở khu dân trí cao, gần công viên hoặc sông nước. Không hợp nơi ồn ào, chật chội.',
    tichLuy: 'Cách tích lũy của bạn là đầu tư vào bất động sản dài hạn — nhà đất, đất nền, hoặc căn hộ cho thuê. Bạn có xu hướng mua để giữ, ít bán. Đây là cách tích lũy an toàn và bền vững cho bạn.',
    loiKhuyen: [
      'Ưu tiên mua nhà đất ở vị trí tốt — vị trí quan trọng hơn diện tích.',
      'Giữ nhà cửa ngăn nắp, sạch sẽ — phong thủy tốt giúp tài lộc hanh thông.',
      'Không nên bán nhà đất vội vàng — càng giữ lâu, giá trị càng tăng.'
    ]
  },
  'B': { // Tự tạo: Vũ Khúc, Tham Lang, Thiên Đồng
    tomTat: 'Nhà cửa của bạn thuộc nhóm "tự tạo" — bạn tự gây dựng nhà đất bằng sức mình, không ỷ lại vào thừa hưởng.',
    nhaCua: 'Bạn có xu hướng tự lập trong việc nhà cửa — ít được thừa hưởng, phải tự tay gây dựng. Ban đầu có thể khó khăn, phải thuê nhà hoặc ở nhờ, nhưng càng về sau càng ổn định. Nhà cửa của bạn có giá trị tài chính cao.',
    moiTruong: 'Môi trường sống lý tưởng của bạn là nơi có không gian làm việc, gần trung tâm thương mại hoặc khu công nghiệp. Bạn hợp với nhà phố, căn hộ tiện nghi hơn là nhà vườn yên tĩnh. Không hợp nơi quá xa trung tâm, khó di chuyển.',
    tichLuy: 'Cách tích lũy của bạn là vừa làm vừa mua — không chờ đủ tiền mới mua, mà mua trả góp hoặc vay ngân hàng. Bạn cũng có thể đầu tư nhiều bất động sản nhỏ rồi bán lại. Đây là cách tích lũy nhanh nhưng cần quản lý rủi ro tốt.',
    loiKhuyen: [
      'Mua nhà sớm nhất có thể — giá bất động sản thường tăng theo thời gian.',
      'Không nên vay quá nhiều để mua nhà — giữ tỷ lệ nợ dưới 50% thu nhập.',
      'Cải tạo nhà cũ thành nhà mới — tiết kiệm hơn mua nhà mới.'
    ]
  },
  'C': { // Hưởng tổ nghiệp: Thái Dương, Thiên Lương, Thiên Tướng
    tomTat: 'Nhà cửa của bạn thuộc nhóm "hưởng tổ nghiệp" — bạn có duyên được thừa hưởng nhà đất từ gia đình, hoặc sống ở nơi có truyền thống lâu đời.',
    nhaCua: 'Bạn có thể được thừa hưởng nhà đất từ ông bà, cha mẹ. Nhà cửa của bạn thường ở nơi có truyền thống, gần họ hàng. Bạn cũng có khả năng giữ gìn và phát triển tài sản thừa hưởng thành tài sản lớn hơn.',
    moiTruong: 'Môi trường sống lý tưởng của bạn là nơi gần gia đình, họ hàng, có không gian sinh hoạt chung. Bạn hợp với nhà có sân vườn, gần chùa hoặc đình làng. Không hợp nơi quá xa quê hương, xa gia đình.',
    tichLuy: 'Cách tích lũy của bạn là giữ gìn và phát triển tài sản thừa hưởng — cải tạo nhà cũ, mua thêm đất liền kề. Bạn cũng có thể đầu tư vào nhà đất ở quê để giữ gìn cội nguồn. Đây là cách tích lũy mang tính truyền thống.',
    loiKhuyen: [
      'Giữ gìn nhà cửa tổ nghiệp — đó là tài sản tinh thần quý giá.',
      'Cải tạo nhà cũ thành không gian sống hiện đại — vừa giữ truyền thống vừa tiện nghi.',
      'Đầu tư vào nhà đất gần gia đình — vừa tăng tài sản vừa giữ kết nối họ hàng.'
    ]
  },
  'D': { // Biến động: Thất Sát, Phá Quân, Thiên Cơ, Cự Môn, Liêm Trinh
    tomTat: 'Nhà cửa của bạn thuộc nhóm "biến động" — nhà đất thay đổi nhiều lần trong đời, có thể gặp tranh chấp hoặc biến động.',
    nhaCua: 'Bạn có xu hướng thay đổi chỗ ở nhiều lần — mua bán, chuyển nhà, hoặc đổi thành phố sinh sống. Nhà cửa của bạn ít khi cố định một chỗ lâu dài. Có thể gặp tranh chấp với anh em về tài sản thừa kế, hoặc với hàng xóm về ranh giới.',
    moiTruong: 'Môi trường sống lý tưởng của bạn là nơi có nhiều cơ hội thay đổi — gần trung tâm kinh tế, có thể di chuyển linh hoạt. Bạn hợp với căn hộ hơn là nhà cố định. Không hợp nơi quá yên tĩnh, ít biến động.',
    tichLuy: 'Cách tích lũy của bạn là mua đi bán lại — kiếm lời từ chênh lệch giá bất động sản. Bạn cũng có thể đầu tư vào đất nền chờ tăng giá. Đây là cách tích lũy nhanh nhưng rủi ro cao, cần kiểm tra pháp lý kỹ.',
    loiKhuyen: [
      'Kiểm tra giấy tờ pháp lý kỹ càng trước khi mua bán — nhóm biến động dễ gặp tranh chấp.',
      'Không nên đầu tư dài hạn vào một bất động sản duy nhất — chia nhỏ rủi ro.',
      'Giữ một khoản tiền mặt dự phòng — vì nhà cửa của bạn có thể thay đổi bất ngờ.'
    ]
  },
  'F': { // VCD
    tomTat: 'Nhà cửa của bạn thuộc nhóm đặc biệt — cung Điền Trạch không có chính tinh. Nhà cửa phụ thuộc nhiều vào hoàn cảnh và các cung xung quanh.',
    nhaCua: 'Bạn có xu hướng linh hoạt về chỗ ở — có thể sống ở nhiều nơi khác nhau trong đời. Nhà cửa thường thay đổi theo hoàn cảnh. Bạn dễ thích nghi với môi trường mới, nhưng cũng dễ mất gốc nếu không giữ được nơi chốn ổn định.',
    moiTruong: 'Môi trường sống lý tưởng của bạn là nơi có nhiều cơ hội thay đổi, gần trung tâm hoặc gần người thân. Bạn hợp với nhà thuê hoặc căn hộ hơn là nhà cố định. Không hợp nơi quá xa xôi, khó thay đổi.',
    tichLuy: 'Cách tích lũy của bạn phụ thuộc nhiều vào nền tảng phúc đức và thu nhập ổn định. Bạn nên tập trung xây dựng thu nhập đều đặn trước, rồi mới nghĩ đến việc mua nhà. Tránh vay nợ lớn để mua bất động sản khi chưa có nguồn thu vững chắc.',
    loiKhuyen: [
      'Không nên vội vàng mua nhà — hãy thuê ở thử nhiều nơi để hiểu mình muốn gì.',
      'Xây dựng quỹ tiết kiệm dài hạn — nhà cửa của bạn có thể đến muộn, cần kiên nhẫn.',
      'Tham khảo ý kiến người có kinh nghiệm trước khi quyết định mua bất động sản.'
    ]
  }
};

/* ============================================================
 *  BẢNG DỮ LIỆU + KHO VĂN CHO CUNG PHÚC ĐỨC (tinh thần + tiền kiếp)
 * ============================================================ */

var TUVI_FACT_PHUCDUC_CHINHTINH = {
  'Tử Vi':      { yNghia: 'Dòng họ của bạn thuộc mẫu người coi trọng uy tín và nền nếp. Bạn được hưởng phúc ấm từ tổ tiên — cuộc đời có xu hướng có quý nhân nâng đỡ khi khó khăn.', linhHon: 'Linh hồn mang ký ức của một bậc lãnh đạo hoặc người đứng đầu trong quá khứ. Bạn sinh ra đã có khí chất khác biệt và khao khát được công nhận.', trongSo: 1.6, tags: ['phuc_day', 'dong_ho_co_uy_tin', 'co_quy_nhan'] },
  'Thiên Cơ':   { yNghia: 'Tinh thần của bạn thuộc mẫu người hay lo nghĩ, suy tư nhiều. Bạn dễ tìm thấy bình an qua học hỏi, nghiên cứu. Phúc phần ở mức trung bình — cần tu tâm tích đức để tăng phúc.', linhHon: 'Linh hồn từng là một học giả hoặc người luôn tìm tòi chân lý. Bạn mang theo nỗi băn khoăn về sự vô thường của vạn vật.', trongSo: 1.3, tags: ['lo_nghi', 'can_tu_tam', 'thich_hoc_hoi'] },
  'Thái Dương': { yNghia: 'Bạn thuộc mẫu người hưởng phúc từ bên nội, tinh thần lạc quan, hào sảng. Dòng họ bên cha có xu hướng có người thành đạt, bạn có thể được thừa hưởng uy tín và mối quan hệ.', linhHon: 'Linh hồn từng là người mang ánh sáng — có thể là một nhà lãnh đạo tinh thần hoặc người phụng sự cộng đồng.', trongSo: 1.5, tags: ['phuc_ben_noi', 'lac_quan', 'co_the_thua_huong_uy_tin'] },
  'Vũ Khúc':    { yNghia: 'Phúc của bạn gắn với tài chính — bạn có xu hướng có duyên kiếm tiền và giữ của. Tinh thần thực tế, không viển vông, sống tự lập từ sớm.', linhHon: 'Linh hồn của một người thợ cả hoặc một chiến binh. Bạn tin vào sức mạnh của hành động và sự kiên trì.', trongSo: 1.4, tags: ['phuc_tai', 'thuc_te', 'tu_lap'] },
  'Thiên Đồng': { yNghia: 'Bạn thuộc mẫu người hưởng phúc an nhàn, tinh thần thoải mái. Cuộc sống có xu hướng ít sóng gió, dễ tìm thấy niềm vui trong những điều giản dị. Về già càng an nhàn.', linhHon: 'Linh hồn của một người từng trải qua nhiều biến cố và giờ tìm kiếm sự bình yên.', trongSo: 1.5, tags: ['phuc_an_nhan', 'tinh_than_nhe', 'de_tim_niem_vui'] },
  'Liêm Trinh': { yNghia: 'Dòng họ của bạn có thể ít gắn kết, có xu hướng ly tán. Tinh thần dễ căng thẳng — cần tu tâm tích đức để hóa giải. Bạn thuộc mẫu người sống nguyên tắc, đôi khi khắt khe với chính mình.', linhHon: 'Linh hồn từng là một quan chức hoặc người sống rất nguyên tắc. Bạn mang theo bài học về sự cân bằng giữa lý trí và cảm xúc.', trongSo: 1.3, tags: ['dong_ho_it_gan_ket', 'can_tu_tam', 'song_nguyen_tac'] },
  'Thiên Phủ':  { yNghia: 'Bạn thuộc mẫu người có phúc phần khá dày — dòng họ có xu hướng đông đúc và biết lo toan. Bạn được thừa hưởng nền tảng tinh thần vững vàng từ gia đình, sống điềm đạm và an nhiên.', linhHon: 'Linh hồn từng là người quản lý hoặc người bảo tồn văn hóa. Bạn mang theo năng khiếu về quản lý và giữ gìn.', trongSo: 1.6, tags: ['phuc_day', 'dong_ho_dong_duc', 'diem_dam'] },
  'Thái Âm':    { yNghia: 'Bạn thuộc mẫu người hưởng phúc từ bên ngoại, đời sống tinh thần phong phú. Có duyên với nghệ thuật, tâm linh và những điều tinh tế. Về già tinh thần càng sâu sắc.', linhHon: 'Linh hồn của một nghệ sĩ hoặc người có đời sống nội tâm phong phú. Bạn mang theo nỗi nhớ về một vẻ đẹp đã mất.', trongSo: 1.5, tags: ['phuc_ben_ngoai', 'tinh_than_phong_phu', 'co_duyen_nghe_thuat'] },
  'Tham Lang':  { yNghia: 'Bạn thuộc mẫu người ham vui, dễ bị cuốn theo thú vui vật chất. Cần tu dưỡng để giữ phúc — nếu chỉ chạy theo ham muốn, phúc sẽ mỏng dần. Nếu biết tiết chế, phúc về già có xu hướng dày lên.', linhHon: 'Linh hồn của một người đam mê khám phá hoặc nghệ sĩ đa tài. Bạn mang theo khao khát trải nghiệm mọi hương vị của cuộc sống.', trongSo: 1.3, tags: ['ham_vui', 'can_tu_duong', 'can_tiet_che'] },
  'Cự Môn':     { yNghia: 'Dòng họ của bạn có thể có thị phi, bất hòa. Tinh thần của bạn dễ bất an, hay lo lắng chuyện không đâu. Cần học cách buông bỏ và giữ tâm tĩnh.', linhHon: 'Linh hồn từng là một nhà hùng biện hoặc người hay hoài nghi. Bạn mang theo bài học về việc sử dụng ngôn ngữ và sự thật.', trongSo: 1.3, tags: ['dong_ho_thi_phi', 'tam_bat_an', 'can_buong_bo'] },
  'Thiên Tướng':{ yNghia: 'Bạn thuộc mẫu người được tổ tiên che chở, phúc hậu và đàng hoàng. Tinh thần vững vàng, sống có nguyên tắc, ít khi làm điều trái với lương tâm.', linhHon: 'Linh hồn của một vị quan hoặc người phò tá trung thành. Bạn mang theo tinh thần phụng sự và bảo vệ.', trongSo: 1.5, tags: ['to_tien_che_cho', 'tinh_than_vung', 'song_nguyen_tac'] },
  'Thiên Lương':{ yNghia: 'Bạn thuộc mẫu người có phúc thọ, được âm đức phù hộ. Tinh thần an nhiên, sống nhân hậu và thích giúp đỡ người khác. Càng lớn tuổi càng được kính trọng.', linhHon: 'Linh hồn của một bậc trưởng lão hoặc người tu hành. Bạn mang theo sự từng trải và lòng từ bi.', trongSo: 1.6, tags: ['phuc_tho', 'nhan_hau', 'duoc_am_duc_phu_ho'] },
  'Thất Sát':   { yNghia: 'Tinh thần của bạn có xu hướng vất vả, ít khi được an nhàn. Phúc phần phải tự tạo — không ỷ lại tổ tiên. Nếu biết tu dưỡng và làm việc thiện, về già có xu hướng an ổn.', linhHon: 'Linh hồn của một chiến binh hoặc người luôn đấu tranh cho lý tưởng. Bạn mang theo sự quyết liệt và tinh thần bất khuất.', trongSo: 1.3, tags: ['tinh_than_vat_va', 'tu_tao_phuc', 'co_the_an_on_ve_gia'] },
  'Phá Quân':   { yNghia: 'Dòng họ của bạn có xu hướng biến động, ít gắn kết lâu dài. Tinh thần dễ bôn ba, hay thay đổi. Cần học cách ổn định nội tâm trước khi tìm kiếm sự bình an bên ngoài.', linhHon: 'Linh hồn của một nhà cải cách hoặc người tiên phong. Bạn mang theo sự bất an và khát vọng đổi mới.', trongSo: 1.3, tags: ['dong_ho_bien_dong', 'tinh_than_bon_ba', 'can_on_dinh_noi_tam'] }
};

var TUVI_FACT_PHUCDUC_PHUTINH = {
  'Thiên Đức':   { yNghia: 'Có Thiên Đức — được âm đức phù hộ, tâm thiện, gặp dữ hóa lành. Đây là sao tốt bậc nhất cho Phúc Đức.', loai: 'manh', trongSo: 1.6, tags: ['am_duc_phu_ho'] },
  'Nguyệt Đức':  { yNghia: 'Có Nguyệt Đức — tâm thiện, phúc hậu, dòng họ có người tu hành hoặc làm việc thiện. Gặp nạn có người giúp.', loai: 'manh', trongSo: 1.6, tags: ['tam_thien', 'phuc_hau'] },
  'Hoa Cái':     { yNghia: 'Có Hoa Cái — thiên hướng tâm linh, tôn giáo, triết học. Bạn dễ tìm thấy bình an qua thiền định. Đôi khi có xu hướng sống cô độc.', loai: 'manh', trongSo: 1.3, tags: ['tam_linh', 'chiem_nghiem'] },
  'Tả Phù':      { yNghia: 'Có Tả Phù — được người khác giúp đỡ, dòng họ có người đỡ đầu. Tinh thần vững vàng nhờ có hậu thuẫn.', loai: 'manh', trongSo: 1.1, tags: ['duoc_giup_do'] },
  'Hữu Bật':     { yNghia: 'Có Hữu Bật — anh em họ hàng gắn kết, giúp đỡ lẫn nhau. Dòng họ đông vui, tình thân bền chặt.', loai: 'manh', trongSo: 1.1, tags: ['dong_ho_gan_ket'] },
  'Long Trì':    { yNghia: 'Có Long Trì — tinh thần thanh cao, có gu thẩm mỹ. Dòng họ có truyền thống văn hóa.', loai: 'manh', trongSo: 1.0, tags: ['thanh_cao'] },
  'Phượng Các':  { yNghia: 'Có Phượng Các — tinh thần thanh lịch, sống có phong cách. Dòng họ có người làm nghệ thuật hoặc văn hóa.', loai: 'manh', trongSo: 1.0, tags: ['thanh_lich'] },
  'Hóa Khoa':    { yNghia: 'Có Hóa Khoa — tinh thần sáng suốt, học vấn cao. Dòng họ có truyền thống học hành. Gặp khó có người giải giúp.', loai: 'manh', trongSo: 1.4, tags: ['hoc_van_cao'] },
  'Hóa Lộc':     { yNghia: 'Có Hóa Lộc — phúc lộc dồi dào, đời sống tinh thần và vật chất đều đủ đầy. Dòng họ khá giả.', loai: 'manh', trongSo: 1.4, tags: ['phuc_loc'] },
  'Thiên Quan':  { yNghia: 'Có Thiên Quan — dòng họ có người làm quan hoặc có địa vị. Bạn được thừa hưởng uy tín từ tổ tiên.', loai: 'manh', trongSo: 1.1, tags: ['dong_ho_uy_tin'] },
  'Thiên Phúc':  { yNghia: 'Có Thiên Phúc — phúc thiện, may mắn. Bạn thường gặp được người tốt giúp đỡ trong cuộc sống.', loai: 'manh', trongSo: 1.2, tags: ['phuc_thien'] },
  'Địa Không':   { yNghia: 'Có Địa Không — tinh thần hay trống trải, dễ cảm thấy hư vô. Cần tu tâm và tìm ý nghĩa sống để lấp đầy khoảng trống.', loai: 'yeu', trongSo: 1.4, tags: ['tinh_than_trong_trai'] },
  'Địa Kiếp':    { yNghia: 'Có Địa Kiếp — phúc mỏng, cần tu tâm tích đức để bồi đắp. Dòng họ có thể có nghiệp chướng cần hóa giải.', loai: 'yeu', trongSo: 1.4, tags: ['phuc_mong', 'can_tu_tam'] },
  'Thiên Hư':    { yNghia: 'Có Thiên Hư — tinh thần hay lo âu, dễ bất an. Cần học cách sống chậm và buông bỏ.', loai: 'yeu', trongSo: 1.1, tags: ['lo_au'] },
  'Thiên Khốc':  { yNghia: 'Có Thiên Khốc — tinh thần nhạy cảm, dễ buồn phiền. Cần học cách chuyển hóa cảm xúc, không nên giữ trong lòng.', loai: 'yeu', trongSo: 1.1, tags: ['nhao_cam_buon'] },
  'Hóa Kỵ':      { yNghia: 'Có Hóa Kỵ — nội tâm nặng nề, dễ mang cảm xúc tiêu cực. Dòng họ có thể có thị phi. Cần tu tâm để hóa giải.', loai: 'yeu', trongSo: 1.5, tags: ['noi_tam_nang', 'dong_ho_thi_phi'] },
  'Tang Môn':    { yNghia: 'Có Tang Môn — tinh thần dễ buồn thương, dễ nhớ chuyện cũ. Cần học cách buông bỏ quá khứ.', loai: 'yeu', trongSo: 1.1, tags: ['buon_qua_khu'] },
  'Bạch Hổ':     { yNghia: 'Có Bạch Hổ — tinh thần có thể bị ảnh hưởng bởi tang sự trong họ. Cần giữ tâm bình thản.', loai: 'yeu', trongSo: 1.0, tags: ['anh_huong_tang_su'] },
  'Cô Thần':     { yNghia: 'Có Cô Thần — tinh thần dễ cô đơn, ít chia sẻ với người khác. Cần chủ động kết nối để không bị cô lập.', loai: 'yeu', trongSo: 1.0, tags: ['co_don_tinh_than'] },
  'Quả Tú':      { yNghia: 'Có Quả Tú — tinh thần đơn chiếc, dễ cảm thấy lạc lõng. Nên tham gia cộng đồng, hoạt động thiện nguyện.', loai: 'yeu', trongSo: 1.0, tags: ['don_chiec'] }
};

var TUVI_VAN_PHUCDUC = {
  'A': {
    tomTat: 'Phúc phần của bạn thuộc nhóm "phúc dày" — dòng họ có nền tảng tốt, đời sống tinh thần phong phú, cuộc đời nhiều may mắn và được che chở.',
    dongHo: 'Dòng họ của bạn có truyền thống tốt — ông bà, cha mẹ thường là người có đức, có uy tín trong làng xóm hoặc cộng đồng. Bạn được thừa hưởng không chỉ vật chất mà còn cả uy tín và các mối quan hệ quý giá. Trong họ có người thành đạt, có thể là người làm quan, giáo viên, hoặc người có vị trí trong xã hội.',
    linhHon: 'Nhìn sâu vào cung Phúc Đức, có thể thấy dấu vết của một tiền kiếp tốt đẹp. Bạn có thể từng là người có địa vị, một bậc trưởng bối được kính trọng, hoặc người sống có đạo đức và được nhiều người quý mến. Những phẩm chất tốt đẹp đó vẫn còn lưu lại trong tâm thức bạn ngày nay — thể hiện qua trực giác về những điều đúng đắn và sự an nhiên tự tại trong tâm hồn. Đây là món quà quý từ kiếp trước, nên tiếp tục vun đắp để phúc ngày càng dày.',
    tinhThan: 'Đời sống tinh thần của bạn phong phú, ít khi cảm thấy trống trải. Bạn có xu hướng lạc quan, biết tận hưởng những điều giản dị, và dễ tìm thấy bình an trong nội tâm. Bạn cũng có duyên với nghệ thuật, tâm linh, hoặc các hoạt động văn hóa.',
    motMinh: 'Những lúc một mình, bạn thường cảm thấy bình yên chứ không cô đơn. Bạn có thể ngồi hàng giờ đọc sách, thiền, hoặc suy ngẫm mà không cảm thấy bứt rứt. Đây là món quà lớn — vì nội tâm an nhiên là nền tảng của hạnh phúc bền vững.',
    loiKhuyen: [
      'Giữ gìn và phát huy truyền thống tốt đẹp của dòng họ — đây là tài sản tinh thần quý giá.',
      'Dành thời gian tĩnh tâm mỗi ngày — thiền, viết nhật ký, hoặc đi dạo — để nuôi dưỡng đời sống tinh thần.',
      'Làm việc thiện nguyện ít nhất mỗi năm một lần — vừa tích đức, vừa làm phong phú tâm hồn.'
    ]
  },
  'B': {
    tomTat: 'Phúc phần của bạn thuộc nhóm "trung bình" — dòng họ có nền tảng khá, đời sống tinh thần ổn định nhưng đôi khi lo nghĩ nhiều.',
    dongHo: 'Dòng họ của bạn ở mức khá — không quá giàu sang nhưng cũng không thiếu thốn. Ông bà, cha mẹ là người sống đức độ, được hàng xóm quý mến. Bạn được thừa hưởng nền nếp gia đình và sự giáo dục cẩn thận.',
    linhHon: 'Cung Phúc Đức cho thấy tiền kiếp của bạn có nhiều trăn trở — có thể từng là người hay suy nghĩ, tìm tòi, hoặc có tâm hồn nghệ sĩ. Bạn mang theo nỗi băn khoăn về ý nghĩa cuộc sống, và kiếp này là cơ hội để tìm ra câu trả lời. Đây không phải nghiệp xấu — mà là bài học về sự cân bằng giữa lý trí và trực giác.',
    tinhThan: 'Đời sống tinh thần của bạn khá ổn định, nhưng đôi khi bị chi phối bởi lo lắng và suy nghĩ quá nhiều. Bạn là người hay tư duy, thích tìm hiểu sâu về mọi vấn đề. Khi buồn, bạn có xu hướng thu mình lại thay vì chia sẻ.',
    motMinh: 'Những lúc một mình, tâm trí bạn thường không yên — hay suy nghĩ về quá khứ, lo lắng cho tương lai. Cần học cách sống trong hiện tại và buông bỏ những điều không thể kiểm soát. Khi đã học được điều này, bạn sẽ thấy bình an hơn rất nhiều.',
    loiKhuyen: [
      'Thực hành thiền hoặc hít thở sâu 10 phút mỗi ngày để làm dịu tâm trí.',
      'Viết ra giấy những điều lo lắng — khi nhìn thấy, bạn sẽ thấy chúng nhỏ hơn tưởng tượng.',
      'Chủ động chia sẻ cảm xúc với người tin cậy — đừng để tâm trí tự gặm nhấm.'
    ]
  },
  'C': {
    tomTat: 'Phúc phần của bạn thuộc nhóm "phúc mỏng" — dòng họ ít nền tảng, cuộc đời phải tự lực nhiều. Nhưng đây cũng là cơ hội để tự tạo phúc cho chính mình và con cháu.',
    dongHo: 'Dòng họ của bạn có thể ít nền tảng, hoặc có biến cố trong quá khứ. Ông bà, cha mẹ vất vả gây dựng. Bạn thừa hưởng ít hơn về vật chất, nhưng lại học được tinh thần tự lực và chịu khó — đây là tài sản vô giá.',
    linhHon: 'Cung Phúc Đức cho thấy tiền kiếp của bạn có thể đã trải qua nhiều thử thách, hoặc chưa tích đủ phúc. Kiếp này là cơ hội để bắt đầu lại — bằng cách tu tâm, làm việc thiện, và tự xây dựng phúc đức. Đừng buồn vì phúc mỏng; hãy xem đây là bài học quý để rèn luyện bản thân.',
    tinhThan: 'Đời sống tinh thần của bạn không mấy phong phú, đôi khi cảm thấy trống trải. Bạn thường bận rộn với cuộc sống vật chất, ít có thời gian chăm sóc đời sống nội tâm. Đây là điểm cần cân bằng — vì tinh thần không vững sẽ khó đi đường dài.',
    motMinh: 'Những lúc một mình, bạn có thể cảm thấy trống vắng hoặc lo lắng về tương lai. Đây là dấu hiệu cho thấy bạn cần xây dựng đời sống tinh thần — qua đọc sách, học hỏi, hoặc kết nối với người tích cực. Đừng để cuộc sống vật chất lấn át tâm hồn.',
    loiKhuyen: [
      'Bắt đầu xây dựng đời sống tinh thần từ những việc nhỏ — đọc 10 trang sách mỗi ngày.',
      'Tham gia một cộng đồng tích cực — nhóm học tập, thiện nguyện, hoặc thể thao — để mở rộng tâm hồn.',
      'Làm việc thiện nguyện định kỳ — đây là cách nhanh nhất để tích đức cho bản thân và con cháu.'
    ]
  },
  'D': {
    tomTat: 'Phúc phần của bạn thuộc nhóm "biến động" — dòng họ có thăng trầm, đời sống tinh thần cần nhiều công phu tu dưỡng. Nếu biết tu tâm, về già sẽ an ổn.',
    dongHo: 'Dòng họ của bạn có thể có nhiều biến động — thịnh rồi suy, hợp rồi ly. Không có truyền thống ổn định. Bạn thừa hưởng ít hơn về nề nếp, nhưng đổi lại bạn có bản lĩnh và khả năng tự lực cao — đây là tài sản đáng quý.',
    linhHon: 'Cung Phúc Đức cho thấy tiền kiếp của bạn có thể đã trải qua những biến cố lớn — có thể từng là chiến binh, người cải cách, hoặc người sống mãnh liệt. Bạn mang theo sự bất an và khát vọng đổi mới. Kiếp này là cơ hội để học cách ổn định nội tâm — đây là bài học quan trọng nhất của bạn.',
    tinhThan: 'Đời sống tinh thần của bạn thăng trầm theo cảm xúc — khi vui thì rất sôi nổi, khi buồn thì trầm uất. Bạn dễ bị cuốn theo ham muốn và thú vui vật chất. Cần tu dưỡng để giữ tâm ổn định — thiền, yoga, hoặc các hoạt động tâm linh sẽ giúp bạn nhiều.',
    motMinh: 'Những lúc một mình, bạn dễ cảm thấy bứt rứt, muốn làm gì đó thay vì ngồi yên. Đây là dấu hiệu tâm chưa tĩnh. Cần học cách ngồi yên với chính mình — đây là bài học quan trọng nhất để chuyển hóa phúc phần về già.',
    loiKhuyen: [
      'Học cách ngồi yên 15 phút mỗi ngày — không điện thoại, không suy nghĩ — chỉ để tâm nghỉ ngơi.',
      'Tìm một người thầy tinh thần (tâm linh, triết học, hoặc thiền định) để hướng dẫn bạn tu tập.',
      'Làm việc thiện nguyện và tránh xa các thú vui độc hại — đây là cách chuyển hóa nghiệp lực nhanh nhất.'
    ]
  },
  'F': {
    tomTat: 'Phúc phần của bạn thuộc nhóm đặc biệt — cung Phúc Đức không có chính tinh. Đời sống tinh thần phụ thuộc nhiều vào cung xung chiếu và sự tu dưỡng của bản thân.',
    dongHo: 'Dòng họ của bạn không có nền tảng nổi bật — không quá giàu cũng không quá nghèo. Bạn thừa hưởng ít về cả vật chất lẫn tinh thần, nhưng đổi lại bạn có sự tự do — không bị ràng buộc bởi truyền thống dòng họ.',
    linhHon: 'Cung Phúc Đức không có chính tinh là dấu hiệu đặc biệt — có thể tiền kiếp của bạn chưa định hình rõ, hoặc đang trong giai đoạn chuyển hóa. Bạn có nhiều tự do để tự tạo phúc cho chính mình — không bị trói buộc bởi nghiệp cũ. Đây là cơ hội lớn để bắt đầu lại từ đầu.',
    tinhThan: 'Đời sống tinh thần của bạn linh hoạt — dễ thay đổi tùy môi trường và người xung quanh. Khi gần người tích cực, bạn thấy vui vẻ; khi gần người tiêu cực, bạn dễ bị cuốn theo. Cần chủ động chọn môi trường sống và bạn bè để nuôi dưỡng tinh thần.',
    motMinh: 'Những lúc một mình, tâm trạng của bạn phụ thuộc vào cung xung chiếu (Tật Ách). Nếu Tật Ách tốt, bạn thấy bình an; nếu không, bạn dễ lo lắng. Cần học cách tĩnh tâm bằng các phương pháp cụ thể — thiền, viết nhật ký, hoặc đi dạo trong thiên nhiên.',
    loiKhuyen: [
      'Chọn bạn mà chơi — môi trường xung quanh ảnh hưởng lớn đến tinh thần của bạn.',
      'Xây dựng thói quen tĩnh tâm hàng ngày — đây là cách tốt nhất để ổn định đời sống nội tâm.',
      'Tự tạo phúc cho chính mình — đừng trông chờ vào thừa hưởng, vì phúc của bạn phụ thuộc vào nỗ lực bản thân.'
    ]
  }
};

/* ============================================================
 *  BẢNG DỮ LIỆU RIÊNG CHO CUNG THIÊN DI (ra ngoài, xã hội)
 *  Chủ thể là BẢN THÂN khi bước ra khỏi vùng an toàn
 * ============================================================ */

var TUVI_FACT_THIENDI_CHINHTINH = {
  'Tử Vi':      { yNghia: 'Khi ra ngoài, bạn toát lên phong thái tự tin và được người khác nể trọng. Bạn có xu hướng giữ vai trò chủ động trong các tình huống xã hội và dễ tạo được lòng tin.', trongSo: 1.6, tags: ['phong_thai_tu_tin', 'duoc_ne_trong', 'chu_dong'] },
  'Thiên Cơ':   { yNghia: 'Khi ra ngoài, bạn thuộc mẫu người hay di chuyển, thích nghi nhanh với môi trường mới. Bạn có xu hướng thay đổi chỗ ở hoặc công việc nhiều lần trong đời.', trongSo: 1.4, tags: ['hay_di_chuyen', 'thich_nghi_nhanh', 'hay_thay_doi'] },
  'Thái Dương': { yNghia: 'Khi ra ngoài, bạn thuộc mẫu người hướng ngoại, nhiệt tình, thích giao tiếp. Bạn có xu hướng giao du rộng và được nhiều người biết đến.', trongSo: 1.5, tags: ['huong_ngoai', 'nhiet_tinh', 'giao_tiep_rong'] },
  'Vũ Khúc':    { yNghia: 'Khi ra ngoài, bạn thuộc mẫu người thực tế, quyết đoán, tập trung vào mục tiêu cụ thể. Bạn đi xa thường vì mục đích rõ ràng — công việc, mưu sinh, hoặc phát triển bản thân.', trongSo: 1.5, tags: ['thuc_te', 'quyet_doan', 'co_muc_tieu'] },
  'Thiên Đồng': { yNghia: 'Khi ra ngoài, bạn thuộc mẫu người dễ được lòng người khác. Bạn có xu hướng làm quen nhanh và được quý mến, nhưng thành công khi đi xa thường đến muộn hơn so với người khác.', trongSo: 1.3, tags: ['duoc_long_nguoi', 'de_lam_quen', 'thanh_cong_muon'] },
  'Liêm Trinh': { yNghia: 'Khi ra ngoài, bạn thuộc mẫu người có nguyên tắc, đôi khi cứng nhắc. Bạn có xu hướng va chạm nhiều hơn với người khác vì tính cách nguyên tắc. Cần cẩn trọng về pháp lý và giao thông khi đi xa.', trongSo: 1.4, tags: ['nguyen_tac', 'de_va_cham', 'can_phap_ly'] },
  'Thiên Phủ':  { yNghia: 'Khi ra ngoài, bạn thuộc mẫu người điềm đạm, đáng tin cậy. Bạn có xu hướng tạo dựng mối quan hệ bền vững với người khác và thường có người đỡ đầu khi đi xa.', trongSo: 1.5, tags: ['diem_dam', 'dang_tin', 'co_nguoi_do_dau'] },
  'Thái Âm':    { yNghia: 'Khi ra ngoài, bạn thuộc mẫu người nhạy cảm với môi trường mới và có khả năng thích nghi tốt. Bạn có duyên với việc đi xa, đặc biệt là xuất ngoại, nhưng đôi khi nhớ nhà và dễ u sầu khi ở nơi xa.', trongSo: 1.4, tags: ['nhao_cam', 'thich_nghi_tot', 'co_duyen_xuat_ngoai'] },
  'Tham Lang':  { yNghia: 'Khi ra ngoài, bạn thuộc mẫu người giao du rộng, có sức hút tự nhiên. Bạn có xu hướng gặp nhiều cám dỗ bên ngoài — cần giữ mình để không sa đà vào những thú vui không lành mạnh.', trongSo: 1.4, tags: ['giao_du_rong', 'co_suc_hut', 'can_giu_minh'] },
  'Cự Môn':     { yNghia: 'Khi ra ngoài, bạn thuộc mẫu người sắc sảo, hay lý luận. Bạn có xu hướng gặp thị phi, lời ra tiếng vào nhiều hơn người khác. Cần uốn lưỡi bảy lần trước khi nói khi ra ngoài xã hội.', trongSo: 1.3, tags: ['sac_sao', 'hay_ly_luan', 'de_thi_phi'] },
  'Thiên Tướng':{ yNghia: 'Khi ra ngoài, bạn thuộc mẫu người đàng hoàng, chỉn chu, dễ tạo thiện cảm. Bạn có xu hướng được người khác nể trọng vì tác phong đáng tin cậy của mình.', trongSo: 1.5, tags: ['dang_hoang', 'chin_chu', 'duoc_ne_trong'] },
  'Thiên Lương':{ yNghia: 'Khi ra ngoài, bạn thuộc mẫu người nhân hậu, có xu hướng được người lớn tuổi che chở. Bạn có duyên với công tác xã hội, giúp đỡ cộng đồng, hoặc những hoạt động có tính nhân văn.', trongSo: 1.5, tags: ['nhan_hau', 'duoc_che_cho', 'co_duyen_cong_tac_xa_hoi'] },
  'Thất Sát':   { yNghia: 'Khi ra ngoài, bạn thuộc mẫu người dám dấn thân, không ngại thử thách. Bạn có xu hướng bôn ba, vất vả mới thành công, nhưng bù lại bạn có bản lĩnh hơn người. Cần đề phòng tai nạn khi đi lại.', trongSo: 1.5, tags: ['dam_dan_than', 'bon_ba', 'can_tai_nan'] },
  'Phá Quân':   { yNghia: 'Khi ra ngoài, bạn thuộc mẫu người không thích an phận, thích thay đổi môi trường. Bạn có xu hướng đổi chỗ ở, công việc nhiều lần trong đời. Cần học cách ổn định trước khi quá muộn.', trongSo: 1.4, tags: ['khong_an_phan', 'thich_thay_doi', 'can_on_dinh'] }
};

var TUVI_FACT_THIENDI_PHUTINH = {
  // Cát tinh — ra ngoài thuận lợi
  'Thiên Mã':   { yNghia: 'Có Thiên Mã — ra ngoài nhiều, đi xa thường xuyên. Đây là sao của sự di chuyển, xuất ngoại, thay đổi chỗ ở. Rất hợp với người làm nghề phải đi lại nhiều.', loai: 'manh', trongSo: 1.4, tags: ['di_chuyen_nhieu', 'xuat_ngoai'] },
  'Tả Phù':     { yNghia: 'Có Tả Phù — ra ngoài được người khác giúp đỡ, có quý nhân phò trợ. Đi xa không lo bơ vơ.', loai: 'manh', trongSo: 1.3, tags: ['quy_nhan', 'duoc_giup'] },
  'Hữu Bật':    { yNghia: 'Có Hữu Bật — ra ngoài có người hỗ trợ, gặp gỡ thuận lợi. Bạn dễ tạo dựng được mạng lưới quan hệ khi ở nơi mới.', loai: 'manh', trongSo: 1.3, tags: ['duoc_ho_tro', 'mo_rong_quan_he'] },
  'Thiên Khôi': { yNghia: 'Có Thiên Khôi — ra ngoài gặp quý nhân là nam giới, người bề trên. Đi xa dễ được nâng đỡ, dìu dắt.', loai: 'manh', trongSo: 1.4, tags: ['quy_nhan_nam', 'be_tren_giup'] },
  'Thiên Việt': { yNghia: 'Có Thiên Việt — ra ngoài gặp quý nhân là nữ giới, người ngoài. Đi xa dễ gặp cơ hội tốt từ những mối quan hệ mới.', loai: 'manh', trongSo: 1.4, tags: ['quy_nhan_nu', 'co_hoi_moi'] },
  'Hóa Lộc':    { yNghia: 'Có Hóa Lộc — ra ngoài có tài lộc, đi xa dễ kiếm tiền. Đây là điểm sáng lớn cho việc làm ăn xa hoặc xuất ngoại lao động.', loai: 'manh', trongSo: 1.6, tags: ['tai_loc_khi_di_xa'] },
  'Hóa Khoa':   { yNghia: 'Có Hóa Khoa — ra ngoài được nể trọng, danh tiếng tốt. Đi xa gặp khó có người giải giúp, giấy tờ thuận lợi.', loai: 'manh', trongSo: 1.5, tags: ['danh_tieng', 'giay_to_thuan'] },
  'Long Trì':   { yNghia: 'Có Long Trì — ra ngoài toát lên khí chất thanh nhã, được người khác quý mến. Đi xa dễ được tiếp đón nồng hậu.', loai: 'manh', trongSo: 1.0, tags: ['khi_chat_thanh_nha'] },
  'Phượng Các': { yNghia: 'Có Phượng Các — ra ngoài có phong thái cao quý, giao tiếp lịch sự. Đi xa dễ gây ấn tượng tốt với người mới.', loai: 'manh', trongSo: 1.0, tags: ['phong_thai_cao_quy'] },

  // Hung tinh — ra ngoài cần chú ý
  'Kình Dương': { yNghia: 'Có Kình Dương — ra ngoài dễ va chạm, cần đề phòng tai nạn giao thông khi đi xa. Tính cách cương mãnh khi ra xã hội dễ gây xung đột.', loai: 'yeu', trongSo: 1.4, tags: ['tai_nan_giao_thong', 'de_va_cham'] },
  'Đà La':      { yNghia: 'Có Đà La — đi lại trắc trở, dễ bị trì hoãn, dây dưa. Ra ngoài cần kiên nhẫn, không nên nóng vội vì dễ gặp trở ngại.', loai: 'yeu', trongSo: 1.3, tags: ['di_lai_trac_tro', 'tri_hoan'] },
  'Hỏa Tinh':   { yNghia: 'Có Hỏa Tinh — ra ngoài dễ gặp chuyện bất ngờ, nóng nảy. Đi xa cần giữ bình tĩnh, tránh quyết định vội vàng khi gặp sự cố.', loai: 'yeu', trongSo: 1.2, tags: ['bat_ngo', 'nong_nay'] },
  'Linh Tinh':  { yNghia: 'Có Linh Tinh — ra ngoài dễ gặp chuyện âm ỉ, khó chịu. Đi xa cần chú ý sức khỏe, tránh làm việc quá sức ở môi trường mới.', loai: 'yeu', trongSo: 1.2, tags: ['am_i', 'suc_khoe'] },
  'Địa Không':  { yNghia: 'Có Địa Không — ra ngoài dễ gặp hụt hẫng, mất mát. Cẩn thận bị lừa đảo khi đi xa, không nên tin người quá dễ dàng ở nơi mới.', loai: 'yeu', trongSo: 1.3, tags: ['hut_hang', 'can_lua_dao'] },
  'Địa Kiếp':   { yNghia: 'Có Địa Kiếp — ra ngoài dễ gặp biến cố bất ngờ, mất mát tài sản. Đi xa cần cẩn trọng hành lý, giấy tờ, tránh mang theo nhiều tiền mặt.', loai: 'yeu', trongSo: 1.4, tags: ['bien_co', 'mat_mat'] },
  'Hóa Kỵ':     { yNghia: 'Có Hóa Kỵ — ra ngoài dễ bị hiểu lầm, thị phi. Đi xa cần giữ lời ăn tiếng nói, tránh tranh cãi với người lạ. Giấy tờ, hợp đồng cần kiểm tra kỹ.', loai: 'yeu', trongSo: 1.5, tags: ['hieu_lam', 'thi_phi', 'giay_to'] }
};

var TUVI_VAN_THIENDI = {
  'A': {
    tomTat: 'Cung Thiên Di của bạn thuộc nhóm "uy tín" — ra ngoài xã hội, bạn toát lên phong thái tự tin, đàng hoàng, và dễ được nể trọng.',
    raNgoai: 'Khi bước ra khỏi nhà, bạn thuộc mẫu người tự tin, đàng hoàng, dễ tạo được lòng tin với người khác. Bạn không ngại giao tiếp, thích mở rộng mối quan hệ và thường giữ vai trò chủ động trong các tình huống xã hội. Phong thái của bạn khiến người đối diện cảm thấy đáng tin cậy.',
    moiTruong: 'Môi trường bên ngoài lý tưởng của bạn là nơi có nhiều người, có cơ hội giao lưu và thể hiện bản thân. Bạn hợp với việc ra ngoài làm ăn, công tác, hoặc sinh sống ở thành phố lớn. Không hợp với môi trường quá nhỏ hẹp, ít người.',
    coHoi: 'Cơ hội của bạn thường đến từ bên ngoài — từ những mối quan hệ xã hội, từ việc đi xa, hoặc từ việc thay đổi môi trường sống. Bạn có duyên với quý nhân nơi đất khách, đặc biệt là những người có địa vị hoặc lớn tuổi hơn.',
    luuY: 'Bạn nên chú ý giữ khiêm tốn khi ra ngoài — đôi khi sự tự tin thái quá có thể gây va chạm. Đi xa cần chuẩn bị kỹ về giấy tờ, thủ tục, tránh chủ quan.',
    loiKhuyen: [
      'Tận dụng các mối quan hệ xã hội — đây là tài sản lớn nhất khi bạn ra ngoài.',
      'Đi xa nên có kế hoạch cụ thể — bạn dễ thành công khi có mục tiêu rõ ràng.',
      'Ra ngoài nhớ giữ sức khỏe, đặc biệt là khi thay đổi môi trường sống đột ngột.'
    ]
  },
  'B': {
    tomTat: 'Cung Thiên Di của bạn thuộc nhóm "trí tuệ" — ra ngoài, bạn nhạy bén, thích nghi nhanh, và dễ hòa nhập với môi trường mới.',
    raNgoai: 'Khi ra ngoài, bạn thuộc mẫu người nhạy bén, quan sát tốt và biết cách ứng biến linh hoạt. Bạn thích khám phá môi trường mới, dễ thích nghi với văn hóa và con người khác. Tuy nhiên, bạn cũng dễ bị ảnh hưởng bởi không khí xung quanh — khi vui thì hòa đồng, khi buồn thì thu mình.',
    moiTruong: 'Môi trường bên ngoài lý tưởng của bạn là nơi có nhiều thông tin, nhiều điều mới để học hỏi. Bạn hợp với việc đi công tác, du học, hoặc làm việc ở nơi có nhiều người thông minh.',
    coHoi: 'Cơ hội của bạn thường đến từ việc học hỏi và quan sát — đi xa giúp bạn mở mang kiến thức, gặp gỡ những người thú vị. Bạn dễ thành công trong các lĩnh vực cần phân tích, tư vấn, hoặc làm việc với thông tin.',
    luuY: 'Bạn nên chú ý lời ăn tiếng nói khi ra ngoài — sự sắc sảo quá mức có thể gây hiểu lầm. Đi xa nhớ giữ liên lạc với gia đình, vì bạn dễ bị cuốn theo công việc mà quên người thân.',
    loiKhuyen: [
      'Ghi chép lại những trải nghiệm khi đi xa — bạn dễ quên những bài học quý.',
      'Đi xa nên tìm hiểu trước về văn hóa và phong tục địa phương — bạn sẽ hòa nhập nhanh hơn.',
      'Ra ngoài nhớ dành thời gian cho bản thân — đừng để công việc chiếm hết tâm trí.'
    ]
  },
  'C': {
    tomTat: 'Cung Thiên Di của bạn thuộc nhóm "thực tế" — ra ngoài, bạn tập trung vào mục tiêu cụ thể, và mỗi bước đi đều có ý nghĩa.',
    raNgoai: 'Khi ra ngoài, bạn thuộc mẫu người thực tế, không viển vông. Bạn đi xa thường vì mục tiêu cụ thể — công việc, mưu sinh, hoặc phát triển bản thân. Bạn không thích những chuyến đi vô nghĩa, mà muốn mỗi bước đi đều mang lại giá trị. Tác phong của bạn khi ra ngoài là chững chạc, đáng tin cậy.',
    moiTruong: 'Môi trường bên ngoài lý tưởng của bạn là nơi có cơ hội phát triển, có thể xây dựng sự nghiệp. Bạn hợp với việc đi xa để làm ăn, buôn bán, hoặc công tác ở nơi có tiềm năng.',
    coHoi: 'Cơ hội của bạn thường đến từ việc nắm bắt thời cơ, từ những mối quan hệ làm ăn, hoặc từ việc mở rộng phạm vi hoạt động. Bạn có duyên trong việc phát triển sự nghiệp khi đi xa, đặc biệt nếu biết tính toán và thận trọng.',
    luuY: 'Bạn nên chú ý đừng quá tập trung vào mục tiêu mà quên đi trải nghiệm và mối quan hệ. Đi xa nhớ giữ sức khỏe, tránh làm việc quá độ.',
    loiKhuyen: [
      'Đi xa nên kết hợp giữa công việc và trải nghiệm — đừng chỉ chăm chăm vào mục tiêu.',
      'Xây dựng mối quan hệ với người bản địa — họ sẽ giúp bạn rất nhiều trong công việc.',
      'Giữ liên lạc với gia đình — công việc không thay thế được tình cảm.'
    ]
  },
  'D': {
    tomTat: 'Cung Thiên Di của bạn thuộc nhóm "bôn ba" — ra ngoài, bạn dám dấn thân, không ngại thử thách, và cuộc đời gắn với nhiều chuyến đi.',
    raNgoai: 'Khi ra ngoài, bạn thuộc mẫu người dám nghĩ dám làm, không ngại khó khăn. Bạn có xu hướng lao vào những thử thách mới, thích khám phá vùng đất mới, không chịu ngồi yên một chỗ. Tuy nhiên, bạn cũng dễ gặp tai nạn hoặc biến cố bất ngờ khi đi lại, nên cần cẩn trọng.',
    moiTruong: 'Môi trường bên ngoài lý tưởng của bạn là nơi có nhiều thử thách, cạnh tranh, hoặc đang trong giai đoạn phát triển mạnh. Bạn hợp với việc đi xa để khởi nghiệp, đầu tư, hoặc làm những việc chưa ai làm.',
    coHoi: 'Cơ hội của bạn thường đến từ những bước ngoặt lớn — đi xa có thể là bước ngoặt thay đổi cả cuộc đời. Bạn dễ thành công trong các lĩnh vực mạo hiểm, kinh doanh, hoặc những ngành nghề đòi hỏi sự dấn thân.',
    luuY: 'Bạn nên đặc biệt cẩn thận về tai nạn giao thông và sức khỏe khi đi xa. Nên mua bảo hiểm, chuẩn bị thuốc men, và luôn có phương án dự phòng. Tránh đi xa một mình vào những nơi nguy hiểm.',
    loiKhuyen: [
      'Đi xa cần có "kế hoạch B" — bạn dễ gặp biến cố bất ngờ.',
      'Ra ngoài nhớ giữ bình tĩnh trước mọi tình huống — sự nóng nảy có thể khiến bạn trả giá.',
      'Xây dựng một mạng lưới hỗ trợ ở nơi mới — đừng dấn thân một mình.'
    ]
  },
  'E': {
    tomTat: 'Cung Thiên Di của bạn thuộc nhóm "giao du" — ra ngoài, bạn có duyên với con người, dễ tạo thiện cảm, và mở ra nhiều mối quan hệ mới.',
    raNgoai: 'Khi ra ngoài, bạn thuộc mẫu người hòa đồng, thích giao tiếp, dễ được lòng người. Bạn có sức hút tự nhiên, dễ tạo thiện cảm với người mới gặp. Đi xa, bạn thường gặp những người tốt bụng, sẵn sàng giúp đỡ, đặc biệt là những người lớn tuổi hoặc có kinh nghiệm sống.',
    moiTruong: 'Môi trường bên ngoài lý tưởng của bạn là nơi có nhiều người, nhiều hoạt động xã hội, văn hóa. Bạn hợp với việc đi xa để giao lưu, học hỏi, hoặc tham gia các hoạt động cộng đồng.',
    coHoi: 'Cơ hội của bạn thường đến từ các mối quan hệ — đi xa giúp bạn gặp gỡ những người có thể thay đổi cuộc đời bạn. Bạn dễ thành công trong các lĩnh vực cần giao tiếp, ngoại giao, hoặc làm việc với con người.',
    luuY: 'Bạn nên chú ý đừng quá tin người — sự cởi mở quá mức có thể khiến bạn bị lợi dụng. Đi xa nhớ giữ một khoảng cách an toàn với người lạ, đừng vội vàng đầu tư tình cảm hay tiền bạc.',
    loiKhuyen: [
      'Đi xa nên ghi lại thông tin liên lạc của những người bạn gặp — biết đâu sau này cần.',
      'Ra ngoài nhớ giữ sự tỉnh táo — không phải ai tỏ ra tốt bụng cũng thật lòng.',
      'Tận dụng các hoạt động cộng đồng để mở rộng mạng lưới quan hệ — đây là thế mạnh của bạn.'
    ]
  },
  'F': {
    tomTat: 'Cung Thiên Di không có chính tinh — ra ngoài, bạn linh hoạt, dễ thích nghi, nhưng cũng dễ bị ảnh hưởng bởi môi trường.',
    raNgoai: 'Bạn không có một "khuôn mẫu" cố định nào khi ra ngoài — bạn có thể thích nghi với bất kỳ môi trường nào, nhưng cũng dễ bị cuốn theo hoàn cảnh. Bạn như tấm gương — phản chiếu điều mà môi trường bên ngoài mang đến cho bạn. Nếu gặp người tốt, bạn sẽ được nâng đỡ; nếu gặp người xấu, bạn dễ bị lợi dụng.',
    moiTruong: 'Môi trường bên ngoài lý tưởng của bạn là nơi có nhiều cơ hội thay đổi, không cố định. Bạn hợp với những công việc linh hoạt, làm việc từ xa, hoặc những công việc cần kết nối nhiều bên.',
    coHoi: 'Cơ hội của bạn thường đến bất ngờ, từ những mối quan hệ hoặc hoàn cảnh bạn không ngờ tới. Đi xa giúp bạn khám phá những khả năng tiềm ẩn của bản thân.',
    luuY: 'Bạn nên đặc biệt chú ý chọn bạn mà chơi — bạn dễ bị ảnh hưởng bởi người xung quanh. Đi xa nên tìm hiểu kỹ về nơi đến và người mình sẽ gặp, tránh đặt niềm tin sai chỗ.',
    loiKhuyen: [
      'Ra ngoài nên có một nguyên tắc sống rõ ràng — bạn cần "la bàn" khi ở môi trường mới.',
      'Đi xa nhớ giữ liên lạc với người thân — họ là điểm tựa tinh thần của bạn.',
      'Cẩn thận khi kết giao — không phải ai tốt với bạn cũng là người tốt.'
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
  if (dsHoa.indexOf('Lộc') >= 0) text.push('Có Hóa Lộc tại Thiên Di — ra ngoài có tài lộc, đi xa dễ kiếm tiền. Đây là điểm sáng lớn cho việc làm ăn xa hoặc xuất ngoại lao động.');
  if (dsHoa.indexOf('Quyền') >= 0) text.push('Có Hóa Quyền — ra ngoài có uy, được người khác nghe theo. Đi xa dễ nắm quyền chủ động trong công việc và các mối quan hệ.');
  if (dsHoa.indexOf('Khoa') >= 0) text.push('Có Hóa Khoa — ra ngoài được nể trọng, danh tiếng tốt. Đi xa gặp khó có người giải giúp, giấy tờ thuận lợi.');
  if (dsHoa.indexOf('Kỵ') >= 0) text.push('Có Hóa Kỵ tại Thiên Di — ra ngoài dễ bị hiểu lầm, thị phi. Đi xa cần giữ lời ăn tiếng nói, tránh tranh cãi với người lạ. Giấy tờ, hợp đồng cần kiểm tra kỹ trước khi ký kết.');
  if (!text.length) return null;
  return { tieuDe: 'Tứ Hóa tại Thiên Di', text: text.join(' ') };
}

function taoDoanCanhBaoThienDi_(chart, pi) {
  var P = chart.palaces;
  var C = P[pi];
  var dsSao = [].concat(C.chinh, C.cat, C.hung, C.tieu).map(function(s){ return s.n; });
  var canhBao = [];

  if (dsSao.indexOf('Kình Dương') >= 0 || dsSao.indexOf('Đà La') >= 0) {
    canhBao.push('Có Kình Dương hoặc Đà La — đề phòng tai nạn giao thông khi đi xa. Nên cẩn thận khi tham gia giao thông, tránh đi đêm ở nơi xa lạ.');
  }
  if (dsSao.indexOf('Địa Không') >= 0 || dsSao.indexOf('Địa Kiếp') >= 0) {
    canhBao.push('Có Địa Không hoặc Địa Kiếp — ra ngoài dễ gặp hụt hẫng, mất mát. Cẩn thận bị lừa đảo khi đi xa, không nên tin người quá dễ dàng ở nơi mới. Mang theo ít tiền mặt và giấy tờ tùy thân cẩn thận.');
  }
  if (dsSao.indexOf('Hỏa Tinh') >= 0 || dsSao.indexOf('Linh Tinh') >= 0) {
    canhBao.push('Có Hỏa Tinh hoặc Linh Tinh — ra ngoài dễ gặp chuyện bất ngờ, nóng nảy. Đi xa cần giữ bình tĩnh, tránh quyết định vội vàng khi gặp sự cố.');
  }

  var gl = mod12(pi - 1), gr = mod12(pi + 1);
  var saoL = [].concat(P[gl].chinh, P[gl].cat, P[gl].hung).map(function(s){ return s.n; });
  var saoR = [].concat(P[gr].chinh, P[gr].cat, P[gr].hung).map(function(s){ return s.n; });
  var badL = saoL.indexOf('Kình Dương') >= 0 || saoL.indexOf('Địa Không') >= 0 || saoL.indexOf('Địa Kiếp') >= 0;
  var badR = saoR.indexOf('Kình Dương') >= 0 || saoR.indexOf('Địa Không') >= 0 || saoR.indexOf('Địa Kiếp') >= 0;
  if (badL && badR) canhBao.push('Sát tinh kẹp hai bên cung Thiên Di — ra ngoài bị kìm kẹp, khó phát huy. Cần đặc biệt cẩn trọng khi đi xa một mình.');

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
  var input = { name: 'Test', gender: 'nam', calendar: 'duong', day: 16, month: 6, year: 1995, hour: 4, minute: 0, viewYear: 2026 };
  var chart = tuviLapLaSo(input);
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
  'Tử Vi':      { yNghia: 'Bạn bè, đồng nghiệp của bạn thuộc mẫu người có uy, sống nguyên tắc. Bạn có xu hướng giữ khoảng cách nhất định trong quan hệ xã hội — ít thân thiết sâu sắc nhưng những mối quan hệ bạn có thường bền vững.', trongSo: 1.5, tags: ['ban_co_uy', 'nguyen_tac', 'giu_khoang_cach'] },
  'Thiên Cơ':   { yNghia: 'Bạn bè của bạn thuộc mẫu người có đầu óc, thích khám phá. Nhóm bạn của bạn thường thay đổi theo từng giai đoạn cuộc đời — người đến rồi đi tùy theo mối quan tâm chung.', trongSo: 1.3, tags: ['ban_thong_minh', 'thich_kham_pha', 'thay_doi_nhom'] },
  'Thái Dương': { yNghia: 'Bạn bè của bạn thuộc mẫu người hướng ngoại, hào phóng, nhiệt tình. Bạn có xu hướng có nhiều mối quan hệ xã hội và được mọi người yêu mến.', trongSo: 1.5, tags: ['ban_huong_ngoai', 'hao_phong', 'nhieu_moi_quan_he'] },
  'Vũ Khúc':    { yNghia: 'Bạn bè của bạn thuộc mẫu người thực tế, quyết đoán. Quan hệ của bạn thiên về hợp tác cùng chí hướng hơn là tình cảm thân thiết kiểu bạn thân.', trongSo: 1.4, tags: ['ban_thuc_te', 'quyet_doan', 'hop_tac_cung_chi_huong'] },
  'Thiên Đồng': { yNghia: 'Bạn bè của bạn thuộc mẫu người hiền hòa, vui vẻ, dễ hợp tác. Mối quan hệ bạn bè có xu hướng thoải mái và dễ chịu, ít áp lực.', trongSo: 1.3, tags: ['ban_hien_hoa', 'vui_ve', 'de_hop_tac'] },
  'Liêm Trinh': { yNghia: 'Bạn bè của bạn thuộc mẫu người có nguyên tắc, đôi khi cứng nhắc. Quan hệ xã hội có thể có những căng thẳng nhất định do sự khác biệt trong quan điểm sống.', trongSo: 1.4, tags: ['ban_nguyen_tac', 'cung_nhac', 'de_cang_thang'] },
  'Thiên Phủ':  { yNghia: 'Bạn bè của bạn thuộc mẫu người biết giữ lời, đáng tin cậy. Nhóm bạn của bạn có xu hướng ổn định, ít thay đổi, và giúp đỡ lẫn nhau trong công việc.', trongSo: 1.5, tags: ['ban_dang_tin', 'on_dinh', 'giup_do_cong_viec'] },
  'Thái Âm':    { yNghia: 'Bạn bè của bạn thuộc mẫu người tinh tế, biết quan tâm. Bạn có xu hướng thân thiết với bạn bè là nữ giới và nhận được sự giúp đỡ từ họ.', trongSo: 1.4, tags: ['ban_tinh_te', 'biet_quan_tam', 'than_thiet_voi_nu'] },
  'Tham Lang':  { yNghia: 'Bạn bè của bạn thuộc mẫu người đa dạng, thích giao du. Bạn có xu hướng quen biết nhiều người nhưng không phải ai cũng là bạn thật sự — nhiều người chỉ là quan hệ xã giao.', trongSo: 1.4, tags: ['ban_da_dang', 'giao_du_rong', 'can_chon_loc'] },
  'Cự Môn':     { yNghia: 'Bạn bè của bạn thuộc mẫu người sắc sảo, hay lý luận. Quan hệ bạn bè có thể nảy sinh thị phi hoặc hiểu lầm do lời ăn tiếng nói. Cần giữ mình và tránh ba phải.', trongSo: 1.3, tags: ['ban_sac_sao', 'de_thi_phi', 'can_giu_minh'] },
  'Thiên Tướng':{ yNghia: 'Bạn bè của bạn thuộc mẫu người nghĩa khí, đàng hoàng, biết giúp đỡ. Nếu bạn là quản lý, cấp dưới của bạn có xu hướng trung thành và đáng tin cậy.', trongSo: 1.5, tags: ['ban_nghia_khi', 'dang_hoang', 'nguoi_duoi_trung_thanh'] },
  'Thiên Lương':{ yNghia: 'Bạn bè của bạn thuộc mẫu người nhân hậu, chững chạc. Bạn có xu hướng thân thiết với những người lớn tuổi hoặc có kinh nghiệm sống hơn — họ thường là người dìu dắt bạn.', trongSo: 1.5, tags: ['ban_nhan_hau', 'chung_chac', 'than_thiet_lon_tuoi'] },
  'Thất Sát':   { yNghia: 'Bạn bè của bạn thuộc mẫu người có cá tính mạnh, quyết liệt. Quan hệ xã hội có thể có những va chạm, đôi khi căng thẳng. Nếu vượt qua được, đây có thể là tình bạn bền chặt.', trongSo: 1.4, tags: ['ban_ca_tinh', 'quyet_liet', 'co_the_va_cham'] },
  'Phá Quân':   { yNghia: 'Bạn bè của bạn thuộc mẫu người thay đổi liên tục, ít ổn định. Nhóm bạn của bạn có xu hướng thay đổi theo từng giai đoạn — ơn nghĩa với bạn bè thường khó bền nếu không được vun đắp.', trongSo: 1.4, tags: ['ban_thay_doi', 'it_on_dinh', 'can_vun_dap'] }
};

var TUVI_FACT_NOBOC_PHUTINH = {
  'Tả Phù':     { yNghia: 'Có Tả Phù — bạn có người giúp việc đắc lực, đồng nghiệp hỗ trợ nhiệt tình. Đây là điểm sáng lớn cho quan hệ với người xung quanh.', loai: 'manh', trongSo: 1.4, tags: ['nguoi_giup_dac_luc'] },
  'Hữu Bật':    { yNghia: 'Có Hữu Bật — bạn bè hỗ trợ, cộng sự đáng tin. Bạn dễ tìm được người đồng hành trong công việc.', loai: 'manh', trongSo: 1.4, tags: ['ban_ho_tro'] },
  'Thiên Khôi': { yNghia: 'Có Thiên Khôi — bạn bè là quý nhân, sẵn sàng nâng đỡ bạn. Gặp khó khăn thường có người đứng ra giúp.', loai: 'manh', trongSo: 1.5, tags: ['ban_quy_nhan'] },
  'Thiên Việt': { yNghia: 'Có Thiên Việt — bạn bè mang lại cơ hội cho bạn. Những mối quan hệ xã hội thường mở ra con đường mới.', loai: 'manh', trongSo: 1.5, tags: ['ban_mang_co_hoi'] },
  'Hóa Lộc':    { yNghia: 'Có Hóa Lộc — bạn bè mang lại tài lộc, có thể cùng nhau làm ăn. Quan hệ xã hội giúp bạn kiếm tiền.', loai: 'manh', trongSo: 1.6, tags: ['ban_mang_tai_loc'] },
  'Hóa Khoa':   { yNghia: 'Có Hóa Khoa — bạn bè giúp bạn giải quyết khó khăn, giấy tờ thuận lợi. Bạn có duyên với người có học thức.', loai: 'manh', trongSo: 1.5, tags: ['ban_giai_kho'] },
  'Lộc Tồn':    { yNghia: 'Có Lộc Tồn — bạn bè giúp bạn giữ của, mang lại sự ổn định tài chính. Quan hệ bạn bè bền vững.', loai: 'manh', trongSo: 1.4, tags: ['ban_on_dinh'] },
  'Kình Dương': { yNghia: 'Có Kình Dương — bạn bè tranh giành, dễ xảy ra xung đột. Cẩn thận khi hợp tác làm ăn với người khác.', loai: 'yeu', trongSo: 1.4, tags: ['ban_tranh_gianh', 'can_hop_tac'] },
  'Đà La':      { yNghia: 'Có Đà La — quan hệ bạn bè dây dưa, khó dứt khoát. Có thể bị bạn bè làm phiền hoặc lợi dụng lòng tốt.', loai: 'yeu', trongSo: 1.3, tags: ['ban_day_dua', 'bi_lam_phien'] },
  'Hỏa Tinh':   { yNghia: 'Có Hỏa Tinh — bạn bè nóng nảy, dễ xảy ra cãi vã. Cần giữ bình tĩnh khi giao tiếp với người xung quanh.', loai: 'yeu', trongSo: 1.3, tags: ['ban_nong_nay', 'de_cai_va'] },
  'Linh Tinh':  { yNghia: 'Có Linh Tinh — bạn bè âm ỉ, có thể có chuyện hiểu lầm kéo dài. Cần chủ động nói chuyện để giải tỏa.', loai: 'yeu', trongSo: 1.3, tags: ['ban_am_i', 'hieu_lam'] },
  'Địa Không':  { yNghia: 'Có Địa Không — bạn bè đến rồi đi, khó giữ người ở lâu dài. Nhóm bạn thường thay đổi theo thời gian.', loai: 'yeu', trongSo: 1.2, tags: ['ban_den_roi_di'] },
  'Địa Kiếp':   { yNghia: 'Có Địa Kiếp — cẩn thận bị bạn bè lợi dụng, mất tiền hoặc mất cơ hội. Không nên tin người quá mức.', loai: 'yeu', trongSo: 1.3, tags: ['bi_loi_dung', 'mat_mat'] },
  'Hóa Kỵ':     { yNghia: 'Có Hóa Kỵ — bạn bè đố kỵ, quan hệ xã hội dễ nảy sinh thị phi. Cần giữ lời ăn tiếng nói và tránh tranh chấp.', loai: 'yeu', trongSo: 1.6, tags: ['ban_do_ky', 'thi_phi'] },
  'Phục Binh':  { yNghia: 'Có Phục Binh — đề phòng bạn bè phản trắc, tiểu nhân ngầm phá. Cần cẩn trọng khi chia sẻ thông tin quan trọng.', loai: 'yeu', trongSo: 1.4, tags: ['ban_phan_trac', 'tieu_nhan_ngam'] },
  'Thiên Hình': { yNghia: 'Có Thiên Hình — quan hệ với người dưới dễ căng thẳng, có thể dẫn đến kiện tụng. Cần minh bạch trong công việc.', loai: 'yeu', trongSo: 1.2, tags: ['cang_thang', 'kien_tung'] }
};

/* ============================================================
 *  BẢNG DỮ LIỆU CUNG PHỤ MẪU — cha mẹ, bề trên, giấy tờ
 * ============================================================ */

var TUVI_FACT_PHUMau_CHINHTINH = {
  'Tử Vi':      { yNghia: 'Cha mẹ bạn thuộc mẫu người có uy, sống nguyên tắc, đặt ra chuẩn mực rõ ràng trong gia đình. Họ nghiêm khắc nhưng thương con theo cách của người đứng đầu gia đình.', trongSo: 1.5, tags: ['cha_me_co_uy', 'nguyen_tac', 'nghiem_khac'] },
  'Thiên Cơ':   { yNghia: 'Cha mẹ bạn thuộc mẫu người có đầu óc, thích suy nghĩ và tìm tòi. Họ có xu hướng dạy con bằng lý lẽ hơn là bằng lời mắng. Mối quan hệ cha mẹ con cái thiên về trao đổi hơn là gần gũi cảm xúc.', trongSo: 1.4, tags: ['cha_me_thong_minh', 'day_con_bang_ly', 'trao_doi'] },
  'Thái Dương': { yNghia: 'Cha mẹ bạn thuộc mẫu người hướng ngoại, nhiệt tình, thích giúp đỡ người khác. Họ thường là người chủ động trong gia đình và có xu hướng sống vì người khác.', trongSo: 1.5, tags: ['cha_me_huong_ngoai', 'nhiet_tinh', 'chu_dong'] },
  'Vũ Khúc':    { yNghia: 'Cha mẹ bạn thuộc mẫu người cương nghị, thực tế, ít bộc lộ tình cảm bằng lời. Họ dạy con bằng hành động và nêu gương. Mối quan hệ cha mẹ con cái thiên về trách nhiệm hơn là biểu đạt cảm xúc.', trongSo: 1.4, tags: ['cha_me_cung_ran', 'thuc_te', 'it_boc_lo'] },
  'Thiên Đồng': { yNghia: 'Cha mẹ bạn thuộc mẫu người hiền hòa, dễ gần, thích cuộc sống nhẹ nhàng. Không khí gia đình thường thân thiện, ít áp lực.', trongSo: 1.3, tags: ['cha_me_hien_hoa', 'de_gan', 'khong_khi_than_thien'] },
  'Liêm Trinh': { yNghia: 'Cha mẹ bạn thuộc mẫu người nghiêm khắc, sống có nguyên tắc và kỷ luật cao. Họ có xu hướng đặt ra kỳ vọng rõ ràng cho con cái. Mối quan hệ cha mẹ con cái đôi khi có khoảng cách vì sự nghiêm khắc.', trongSo: 1.4, tags: ['cha_me_nghiem_khac', 'ky_luat_cao', 'co_ky_vong'] },
  'Thiên Phủ':  { yNghia: 'Cha mẹ bạn thuộc mẫu người điềm đạm, biết lo toan, giữ gìn. Họ sống thực tế, chắc chắn, không thích phô trương. Đây là mẫu cha mẹ coi trọng sự ổn định.', trongSo: 1.5, tags: ['cha_me_biet_lo', 'diem_dam', 'coi_trong_on_dinh'] },
  'Thái Âm':    { yNghia: 'Cha mẹ bạn thuộc mẫu người dịu dàng, tinh tế, giàu cảm xúc. Mẹ thường đóng vai trò quan trọng trong việc giáo dục và chăm sóc con cái. Mối quan hệ thiên về tình cảm hơn là lý trí.', trongSo: 1.5, tags: ['cha_me_diu_dang', 'tinh_te', 'trong_tinh_cam'] },
  'Tham Lang':  { yNghia: 'Cha mẹ bạn thuộc mẫu người phóng khoáng, thích tự do, ít quản con cái. Họ cho con không gian để tự phát triển nhưng đôi khi thiếu sự hướng dẫn sát sao.', trongSo: 1.3, tags: ['cha_me_phong_khoang', 'cho_tu_do', 'it_quan'] },
  'Cự Môn':     { yNghia: 'Cha mẹ bạn thuộc mẫu người sắc sảo, hay lý luận, có xu hướng nói thẳng. Đôi khi lời nói của họ có thể gây tổn thương — nhưng đó thường là vì họ muốn tốt cho con.', trongSo: 1.3, tags: ['cha_me_sac_sao', 'hay_ly_luan', 'noi_thang'] },
  'Thiên Tướng':{ yNghia: 'Cha mẹ bạn thuộc mẫu người chính trực, đàng hoàng, chu đáo. Họ quan tâm đến con cái và có xu hướng bảo bọc. Không khí gia đình thường trang nghiêm, có nền nếp.', trongSo: 1.5, tags: ['cha_me_chinh_truc', 'chu_dao', 'co_nen_nep'] },
  'Thiên Lương':{ yNghia: 'Cha mẹ bạn thuộc mẫu người nhân hậu, thích che chở, sống đạo đức. Họ có xu hướng dạy con bằng nêu gương hơn là lời nói. Mối quan hệ cha mẹ con cái thường ấm áp, có sự bao dung.', trongSo: 1.6, tags: ['cha_me_nhan_hau', 'che_cho', 'song_dao_duc'] },
  'Thất Sát':   { yNghia: 'Cha mẹ bạn thuộc mẫu người mạnh mẽ, có cá tính, ít bộc lộ cảm xúc. Bạn có xu hướng tự lập sớm và trưởng thành nhanh hơn bạn bè cùng trang lứa.', trongSo: 1.4, tags: ['cha_me_manh_me', 'ca_tinh', 'it_boc_lo'] },
  'Phá Quân':   { yNghia: 'Cha mẹ bạn thuộc mẫu người phóng khoáng, có xu hướng phá cách và ít theo khuôn khổ. Họ có thể có những giai đoạn thay đổi lớn trong cuộc đời, khiến gia đình có nhiều biến động.', trongSo: 1.4, tags: ['cha_me_phong_khoang', 'pha_cach', 'co_bien_dong'] }
};

var TUVI_FACT_PHUMau_PHUTINH = {
  'Văn Xương':  { yNghia: 'Có Văn Xương — cha mẹ có học thức, giấy tờ thuận lợi. Bạn được hưởng nền tảng giáo dục tốt và có duyên học hành.', loai: 'manh', trongSo: 1.2, tags: ['cha_me_hoc_thuc', 'giay_to_thuan'] },
  'Văn Khúc':   { yNghia: 'Có Văn Khúc — cha mẹ khéo ăn nói, có gu thẩm mỹ. Bạn được nuôi dưỡng trong môi trường văn hóa.', loai: 'manh', trongSo: 1.2, tags: ['cha_me_kheo_an_noi'] },
  'Thiên Khôi': { yNghia: 'Có Thiên Khôi — cha mẹ hoặc bề trên nâng đỡ bạn. Bạn được hưởng quý nhân từ phía gia đình.', loai: 'manh', trongSo: 1.3, tags: ['quy_nhan_gia_dinh'] },
  'Hóa Lộc':    { yNghia: 'Có Hóa Lộc — bạn được thừa hưởng tài sản từ cha mẹ, cuộc sống đủ đầy. Đây là điểm sáng lớn.', loai: 'manh', trongSo: 1.6, tags: ['thua_huong_tai_san'] },
  'Hóa Quyền':  { yNghia: 'Có Hóa Quyền — cha mẹ mạnh mẽ, có uy. Bạn được hưởng phúc ấm nhưng cũng chịu áp lực kỳ vọng từ cha mẹ.', loai: 'manh', trongSo: 1.5, tags: ['cha_me_manh_me', 'ap_luc_ky_vong'] },
  'Hóa Khoa':   { yNghia: 'Có Hóa Khoa — gia đình có giáo dục, cha mẹ văn nhã. Bạn có học lực cao và được hưởng danh tiếng từ gia đình.', loai: 'manh', trongSo: 1.5, tags: ['gia_giao', 'hoc_luc_cao'] },
  'Thiên Việt': { yNghia: 'Có Thiên Việt — bề trên, người ngoài giúp đỡ bạn. Bạn có duyên với quý nhân ngoài gia đình.', loai: 'manh', trongSo: 1.2, tags: ['quy_nhan_ngoai'] },
  'Tang Môn':   { yNghia: 'Có Tang Môn — chú ý sức khỏe cha mẹ, có thể có tin buồn. Cần quan tâm cha mẹ nhiều hơn.', loai: 'yeu', trongSo: 1.2, tags: ['suc_khoe_cha_me', 'tin_buon'] },
  'Bạch Hổ':    { yNghia: 'Có Bạch Hổ — cha mẹ vất vả, giấy tờ liên quan đến gia đình có thể rắc rối. Cẩn thận thủ tục hành chính.', loai: 'yeu', trongSo: 1.2, tags: ['cha_me_vat_va', 'giay_to_rac_roi'] },
  'Thiên Khốc': { yNghia: 'Có Thiên Khốc — buồn phiền về cha mẹ, có thể có chuyện không vui trong gia đình. Cần giữ tinh thần lạc quan.', loai: 'yeu', trongSo: 1.1, tags: ['buon_phien_gia_dinh'] },
  'Kình Dương': { yNghia: 'Có Kình Dương — bất đồng với cha mẹ, dễ xảy ra xung đột. Cần học cách lắng nghe và nhường nhịn.', loai: 'yeu', trongSo: 1.3, tags: ['bat_dong_cha_me', 'xung_dot'] },
  'Đà La':      { yNghia: 'Có Đà La — mối quan hệ cha mẹ con cái dây dưa, khó giải quyết. Có thể có hiểu lầm kéo dài.', loai: 'yeu', trongSo: 1.2, tags: ['hieu_lam_keo_dai'] },
  'Hóa Kỵ':     { yNghia: 'Có Hóa Kỵ — dễ xung khắc với bề trên, giấy tờ liên quan đến gia đình vướng mắc. Cần kiên nhẫn trong các thủ tục.', loai: 'yeu', trongSo: 1.6, tags: ['xung_khac_be_tren', 'giay_to_vuong'] },
  'Địa Không':  { yNghia: 'Có Địa Không — cha mẹ có thể mất sớm hoặc bạn phải tự lập sớm. Không nên ỷ lại vào gia đình.', loai: 'yeu', trongSo: 1.4, tags: ['cha_me_mat_som', 'tu_lap'] },
  'Địa Kiếp':   { yNghia: 'Có Địa Kiếp — gia đình có thể gặp biến cố, tài sản thất thoát. Bạn phải tự lực nhiều hơn.', loai: 'yeu', trongSo: 1.4, tags: ['bien_co_gia_dinh', 'tu_luc'] }
};

/* ============================================================
 *  BẢNG DỮ LIỆU CUNG HUYNH ĐỆ — anh chị em ruột
 * ============================================================ */

var TUVI_FACT_HUYNHDE_CHINHTINH = {
  'Tử Vi':      { yNghia: 'Anh chị em của bạn thuộc mẫu người có uy, sống nguyên tắc. Bạn có xu hướng nhận được sự dìu dắt từ anh/chị lớn trong gia đình.', trongSo: 1.5, tags: ['anh_em_co_uy', 'nguyen_tac', 'duoc_diu_dat'] },
  'Thiên Cơ':   { yNghia: 'Anh chị em của bạn thuộc mẫu người có đầu óc, thích suy nghĩ độc lập. Mối quan hệ anh em có xu hướng trao đổi bằng lý lẽ hơn là chia sẻ cảm xúc. Đôi khi quan điểm khác biệt dẫn đến bất đồng nhỏ.', trongSo: 1.3, tags: ['anh_em_thong_minh', 'doc_lap', 'trao_doi_ly_le'] },
  'Thái Dương': { yNghia: 'Anh chị em của bạn thuộc mẫu người hướng ngoại, hào phóng, nhiệt tình. Mối quan hệ anh em thường có xu hướng gắn bó và hỗ trợ lẫn nhau.', trongSo: 1.5, tags: ['anh_em_huong_ngoai', 'hao_phong', 'gan_bo'] },
  'Vũ Khúc':    { yNghia: 'Anh chị em của bạn thuộc mẫu người cương nghị, thực tế. Mối quan hệ anh em có xu hướng thiên về trách nhiệm hơn là tình cảm biểu đạt. Đôi khi có thể phát sinh bất đồng quan điểm xung quanh vấn đề tiền bạc, tài sản.', trongSo: 1.4, tags: ['anh_em_cung_ran', 'thuc_te', 'can_minh_bach_tien'] },
  'Thiên Đồng': { yNghia: 'Anh chị em của bạn thuộc mẫu người hiền hòa, vui vẻ, dễ gần. Mối quan hệ anh em thường thân thiện, ít sóng gió.', trongSo: 1.3, tags: ['anh_em_hien_hoa', 'vui_ve', 'it_song_gio'] },
  'Liêm Trinh': { yNghia: 'Anh chị em của bạn thuộc mẫu người có nguyên tắc, đôi khi cứng nhắc. Mối quan hệ anh em có thể có khoảng cách do tính cách khác biệt. Cần sự nhường nhịn để giữ hòa khí.', trongSo: 1.4, tags: ['anh_em_nguyen_tac', 'co_khoang_cach', 'can_nhuong_nhin'] },
  'Thiên Phủ':  { yNghia: 'Anh chị em của bạn thuộc mẫu người biết lo toan, giữ gìn, sống thực tế. Mối quan hệ anh em có xu hướng bền vững và ít sóng gió.', trongSo: 1.5, tags: ['anh_em_biet_lo', 'thuc_te', 'ben_vung'] },
  'Thái Âm':    { yNghia: 'Anh chị em của bạn thuộc mẫu người dịu dàng, tinh tế, giàu cảm xúc. Bạn có xu hướng gần gũi và nhận được sự quan tâm từ chị em gái nhiều hơn.', trongSo: 1.4, tags: ['anh_em_diu_dang', 'tinh_te', 'chi_em_gai_gan_gui'] },
  'Tham Lang':  { yNghia: 'Anh chị em của bạn thuộc mẫu người giao du rộng, thích trải nghiệm. Mối quan hệ anh em có xu hướng thoải mái nhưng ít khi dựa vào nhau về vật chất.', trongSo: 1.3, tags: ['anh_em_giao_du_rong', 'thoai_mai', 'it_nuong_tua'] },
  'Cự Môn':     { yNghia: 'Anh chị em của bạn thuộc mẫu người sắc sảo, hay lý luận. Mối quan hệ anh em có thể có những cuộc tranh luận, đôi khi lời nói qua lại gây tổn thương lẫn nhau.', trongSo: 1.3, tags: ['anh_em_sac_sao', 'hay_tranh_luan', 'can_giu_loi'] },
  'Thiên Tướng':{ yNghia: 'Anh chị em của bạn thuộc mẫu người nghĩa khí, đàng hoàng, biết quan tâm. Mối quan hệ anh em có xu hướng gắn bó và hỗ trợ nhau khi cần.', trongSo: 1.5, tags: ['anh_em_nghia_khi', 'dang_hoang', 'ho_tro_nhau'] },
  'Thiên Lương':{ yNghia: 'Anh chị em của bạn thuộc mẫu người nhân hậu, chững chạc, có xu hướng che chở. Bạn có thể nhận được sự bảo ban từ người lớn tuổi hơn trong gia đình.', trongSo: 1.5, tags: ['anh_em_nhan_hau', 'chung_chac', 'duoc_bao_ban'] },
  'Thất Sát':   { yNghia: 'Anh chị em của bạn thuộc mẫu người có cá tính mạnh, độc lập, ít gắn kết. Mối quan hệ anh em có xu hướng xa cách — mỗi người một ngả, ít khi gặp gỡ.', trongSo: 1.4, tags: ['anh_em_ca_tinh', 'doc_lap', 'xa_cach'] },
  'Phá Quân':   { yNghia: 'Anh chị em của bạn thuộc mẫu người khác biệt về tính cách và quan điểm. Mối quan hệ anh em có thể có khoảng cách, ít khi tìm được tiếng nói chung trong các vấn đề gia đình.', trongSo: 1.4, tags: ['anh_em_khac_biet', 'co_khoang_cach', 'it_tieng_noi_chung'] }
};

var TUVI_FACT_HUYNHDE_PHUTINH = {
  'Tả Phù':     { yNghia: 'Có Tả Phù — anh em giúp đỡ lẫn nhau, có sự hỗ trợ qua lại. Đây là điểm sáng cho mối quan hệ anh em.', loai: 'manh', trongSo: 1.3, tags: ['anh_em_giup_do'] },
  'Hữu Bật':    { yNghia: 'Có Hữu Bật — anh em đông, đỡ đần nhau. Bạn có thể nhờ cậy anh em khi gặp khó khăn.', loai: 'manh', trongSo: 1.3, tags: ['anh_em_dong', 'do_dan'] },
  'Thiên Khôi': { yNghia: 'Có Thiên Khôi — anh em là quý nhân của bạn, sẵn sàng nâng đỡ. Bạn được nhờ anh em về nhiều mặt.', loai: 'manh', trongSo: 1.4, tags: ['anh_em_quy_nhan'] },
  'Thiên Việt': { yNghia: 'Có Thiên Việt — anh em mang lại cơ hội cho bạn. Mối quan hệ anh em mở ra con đường mới.', loai: 'manh', trongSo: 1.4, tags: ['anh_em_mang_co_hoi'] },
  'Văn Xương':  { yNghia: 'Có Văn Xương — anh em có học thức, giúp đỡ nhau trong học hành và công việc.', loai: 'manh', trongSo: 1.1, tags: ['anh_em_hoc_thuc'] },
  'Văn Khúc':   { yNghia: 'Có Văn Khúc — anh em khéo ăn nói, có duyên. Mối quan hệ anh em có sự thấu hiểu nhất định.', loai: 'manh', trongSo: 1.1, tags: ['anh_em_kheo_an_noi'] },
  'Hóa Lộc':    { yNghia: 'Có Hóa Lộc — anh em khá giả, giúp đỡ bạn về tài chính. Bạn có thể được thừa hưởng hoặc hỗ trợ từ anh em.', loai: 'manh', trongSo: 1.5, tags: ['anh_em_tai_loc'] },
  'Hóa Khoa':   { yNghia: 'Có Hóa Khoa — anh em có học vấn, danh tiếng. Bạn được nhờ anh em trong các vấn đề giấy tờ, học hành.', loai: 'manh', trongSo: 1.4, tags: ['anh_em_danh_tieng'] },
  'Kình Dương': { yNghia: 'Có Kình Dương — anh em bất hòa, dễ xảy ra tranh chấp. Cần tránh bàn chuyện tiền bạc với anh em.', loai: 'yeu', trongSo: 1.4, tags: ['anh_em_bat_hoa', 'tranh_chap'] },
  'Đà La':      { yNghia: 'Có Đà La — mối quan hệ anh em dây dưa, khó giải quyết. Hiểu lầm có thể kéo dài dai dẳng.', loai: 'yeu', trongSo: 1.3, tags: ['day_dua', 'hieu_lam'] },
  'Hóa Kỵ':     { yNghia: 'Có Hóa Kỵ — hiểu lầm với anh em, dễ xảy ra xung đột. Cần chủ động hóa giải, tránh để mâu thuẫn tích tụ.', loai: 'yeu', trongSo: 1.6, tags: ['hieu_lam', 'xung_dot'] },
  'Cô Thần':    { yNghia: 'Có Cô Thần — anh em sống khép kín, ít qua lại. Mối quan hệ anh em thiếu sự gắn kết tự nhiên.', loai: 'yeu', trongSo: 1.2, tags: ['anh_em_khep_kin', 'it_qua_lai'] },
  'Quả Tú':     { yNghia: 'Có Quả Tú — anh em đơn chiếc, ít gắn kết. Bạn có thể cảm thấy cô đơn ngay trong gia đình.', loai: 'yeu', trongSo: 1.2, tags: ['anh_em_don_chiec', 'co_don'] },
  'Địa Không':  { yNghia: 'Có Địa Không — anh em ly tán, ít giúp đỡ nhau. Mỗi người có cuộc sống riêng, ít khi gặp gỡ.', loai: 'yeu', trongSo: 1.2, tags: ['ly_tan', 'it_gap_go'] },
  'Địa Kiếp':   { yNghia: 'Có Địa Kiếp — anh em có thể gặp biến cố, mất mát. Cần quan tâm đến anh em nhiều hơn.', loai: 'yeu', trongSo: 1.3, tags: ['bien_co', 'quan_tam'] },
  'Thiên Hình': { yNghia: 'Có Thiên Hình — anh em nghiêm khắc với nhau, có thể dẫn đến kiện tụng. Cần giữ hòa khí và minh bạch.', loai: 'yeu', trongSo: 1.2, tags: ['nghiem_khac', 'kien_tung'] }
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
    luuY: 'Bạn nên chú ý giữ sự tự tin vào giá trị bản thân — đôi khi bạn bè có địa vị cao có thể khiến bạn cảm thấy áp lực. Hãy nhớ rằng giá trị của bạn không phụ thuộc vào vị trí xã hội.',
    loiKhuyen: [
      'Duy trì mạng lưới quan hệ chất lượng hơn số lượng — vài người bạn thật sự tốt hơn nhiều người quen xã giao.',
      'Chủ động giúp đỡ người khác trước khi cần nhờ họ — quan hệ bền vững được xây từ sự cho đi.',
      'Trong công việc, hãy công bằng và minh bạch với cấp dưới — đó là cách giữ người tài.'
    ]
  },
  'B': {
    tomTat: 'Cung Nô Bộc của bạn thuộc nhóm "trí tuệ" — bạn bè thường là người có đầu óc, hay thay đổi, và quan hệ xã hội có tính linh hoạt cao.',
    quanHe: 'Bạn thích kết giao với người thông minh, có chiều sâu. Tuy nhiên, nhóm bạn của bạn có xu hướng thay đổi theo từng giai đoạn — người đến rồi đi tùy theo mối quan tâm và hoàn cảnh. Bạn cần chọn lọc bạn bè kỹ càng hơn.',
    nguoiDuoi: 'Cấp dưới của bạn thuộc mẫu người thông minh nhưng có thể hay thay đổi ý kiến. Bạn nên khéo léo trong việc quản lý và giữ chân người tài.',
    coHoi: 'Cơ hội của bạn thường đến từ việc học hỏi qua bạn bè — những cuộc trò chuyện với người thông minh mở ra nhiều ý tưởng mới.',
    luuY: 'Bạn nên chú ý lời ăn tiếng nói trong giao tiếp xã hội — sự sắc sảo quá mức có thể gây hiểu lầm. Tránh tham gia vào những cuộc tranh luận vô bổ.',
    loiKhuyen: [
      'Chọn bạn mà chơi — chất lượng quan trọng hơn số lượng.',
      'Giữ liên lạc với những người bạn thật sự tốt dù ít gặp — họ là chỗ dựa tinh thần quan trọng.',
      'Trong công việc, hãy rõ ràng trong giao tiếp với đồng nghiệp để tránh hiểu lầm.'
    ]
  },
  'C': {
    tomTat: 'Cung Nô Bộc của bạn thuộc nhóm "thực tế" — quan hệ bạn bè thiên về hợp tác, cùng chí hướng, và có tính xây dựng cao.',
    quanHe: 'Bạn thuộc mẫu người không thích những mối quan hệ hời hợt — bạn muốn có những người bạn có thể cùng nhau làm việc, cùng nhau phát triển. Quan hệ của bạn bền vững vì dựa trên sự tin cậy lẫn nhau.',
    nguoiDuoi: 'Cấp dưới của bạn thuộc mẫu người làm việc hiệu quả, đáng tin cậy. Bạn có khả năng quản lý tốt và được nhân viên tôn trọng vì sự công bằng.',
    coHoi: 'Cơ hội của bạn thường đến từ hợp tác — những người bạn cùng chí hướng có thể trở thành đối tác đáng tin cậy.',
    luuY: 'Bạn nên chú ý đừng để quan hệ bạn bè trở thành quan hệ thuần túy lợi ích. Đôi khi cần dành thời gian cho tình bạn không vụ lợi.',
    loiKhuyen: [
      'Xây dựng quan hệ dựa trên sự tin cậy, không chỉ lợi ích.',
      'Khi hợp tác làm ăn với bạn bè, hãy rõ ràng ngay từ đầu để tránh mất tình cảm.',
      'Dành thời gian cho những người bạn cũ — họ là những người hiểu bạn nhất.'
    ]
  },
  'D': {
    tomTat: 'Cung Nô Bộc của bạn thuộc nhóm "biến động" — bạn bè có cá tính mạnh, và quan hệ xã hội có thể có những va chạm nhất định.',
    quanHe: 'Bạn thuộc mẫu người gặp nhiều người có cá tính mạnh trong đời. Các cuộc tranh luận, thậm chí xung đột, có thể xảy ra thường xuyên hơn so với người khác. Tuy nhiên, nếu vượt qua được, đây có thể là những tình bạn rất bền chặt.',
    nguoiDuoi: 'Cấp dưới của bạn có thể có cá tính cứng đầu, khó bảo. Bạn nên kiên nhẫn và khéo léo trong quản lý để tránh xung đột không đáng có.',
    coHoi: 'Cơ hội của bạn thường đến từ việc dấn thân — tham gia các hoạt động có tính cạnh tranh. Bạn bè có thể là người đồng hành trong những dự án mạo hiểm.',
    luuY: 'Bạn nên đặc biệt chú ý giữ bình tĩnh trong giao tiếp — sự nóng nảy có thể phá hủy những mối quan hệ tốt đẹp. Tránh hợp tác làm ăn với người quá nóng tính.',
    loiKhuyen: [
      'Học cách lắng nghe trước khi phản hồi — nhiều xung đột bắt nguồn từ hiểu lầm.',
      'Chọn bạn đồng hành cẩn thận — không phải ai cá tính cũng phù hợp với bạn.',
      'Giữ khoảng cách với những người bạn thường xuyên gây căng thẳng — sức khỏe tinh thần của bạn quan trọng.'
    ]
  },
  'E': {
    tomTat: 'Cung Nô Bộc của bạn thuộc nhóm "giao du" — bạn bè đa dạng, có sức hút tự nhiên, và mạng lưới quan hệ xã hội rộng.',
    quanHe: 'Bạn thuộc mẫu người hòa đồng, dễ kết bạn, và có sức hút tự nhiên với người xung quanh. Bạn có nhiều mối quan hệ xã hội và thường tham gia các hoạt động cộng đồng. Tuy nhiên, không phải ai cũng là bạn thật sự — nhiều người chỉ là quen biết xã giao.',
    nguoiDuoi: 'Cấp dưới của bạn đa dạng về tính cách. Bạn có thể quản lý được nếu biết cách giao việc phù hợp với từng người.',
    coHoi: 'Cơ hội của bạn thường đến từ các hoạt động cộng đồng, sự kiện xã hội. Những người bạn quen biết có thể giới thiệu cơ hội bất ngờ.',
    luuY: 'Bạn nên cẩn thận khi kết giao — đừng vội vàng tin tưởng người mới quen. Kiểm chứng thông tin trước khi đầu tư tiền bạc hoặc tình cảm vào một mối quan hệ mới.',
    loiKhuyen: [
      'Tham gia các hoạt động cộng đồng để mở rộng quan hệ — đây là thế mạnh của bạn.',
      'Học cách nói "không" với những lời nhờ vả không chính đáng.',
      'Dành thời gian cho những người bạn thật sự — họ xứng đáng hơn những mối quan hệ xã giao.'
    ]
  },
  'F': {
    tomTat: 'Cung Nô Bộc không có chính tinh — quan hệ xã hội linh hoạt, phụ thuộc nhiều vào môi trường và sự chủ động của bạn.',
    quanHe: 'Bạn không có một "khuôn mẫu" cố định nào trong quan hệ bạn bè — bạn có thể thích nghi với nhiều nhóm bạn khác nhau, nhưng cũng dễ bị ảnh hưởng bởi người xung quanh. Nếu gặp bạn tốt, bạn sẽ được nâng đỡ; nếu gặp bạn xấu, bạn dễ bị lợi dụng.',
    nguoiDuoi: 'Cấp dưới của bạn thay đổi tùy theo hoàn cảnh. Bạn nên linh hoạt trong quản lý và không nên kỳ vọng quá nhiều vào một người.',
    coHoi: 'Cơ hội của bạn thường đến bất ngờ từ những mối quan hệ mới. Điều quan trọng là bạn phải chủ động tạo dựng quan hệ thay vì chờ đợi người khác đến với mình.',
    luuY: 'Bạn nên đặc biệt chú ý chọn bạn mà chơi — bạn dễ bị ảnh hưởng bởi người xung quanh. Tránh xa những người bạn tiêu cực, hay than vãn.',
    loiKhuyen: [
      'Chủ động tìm kiếm bạn bè có cùng giá trị sống — đừng để hoàn cảnh quyết định bạn của bạn.',
      'Xây dựng một vài mối quan hệ sâu sắc thay vì nhiều mối quan hệ hời hợt.',
      'Khi gặp khó khăn, hãy mạnh dạn nhờ bạn bè giúp đỡ — họ sẵn lòng nếu bạn thật lòng.'
    ]
  }
};

var TUVI_VAN_PHUMAU = {
  'A': {
    tomTat: 'Cha mẹ của bạn thuộc mẫu người sống đàng hoàng, có nguyên tắc và trách nhiệm. Quan hệ cha mẹ – con cái thường dựa trên sự tôn trọng và tôn ti trật tự rõ ràng.',
    chaMe: 'Cha mẹ bạn thuộc mẫu người sống có kỷ luật, đặt ra những chuẩn mực rõ ràng trong gia đình. Họ nghiêm khắc nhưng yêu thương con theo cách riêng của mình — ít nói lời ngọt ngào, nhưng luôn lo toan cho con từng li từng tí. Cách yêu thương của họ thiên về trách nhiệm và nêu gương.',
    quanHe: 'Mối quan hệ giữa bạn và cha mẹ nhìn chung ổn định — dù đôi khi có bất đồng quan điểm, nhưng cả hai phía đều giữ sự tôn trọng. Cha mẹ thường là chỗ dựa tinh thần quan trọng của bạn.',
    giayTo: 'Các vấn đề giấy tờ, thủ tục hành chính trong gia đình nhìn chung thuận lợi. Nếu có thừa kế, khả năng cao là được giải quyết êm thấm.',
    luuY: 'Bạn nên dành thời gian quan tâm cha mẹ nhiều hơn — đặc biệt khi họ về già. Đừng để công việc cuốn bạn đi mà quên mất gia đình.',
    loiKhuyen: [
      'Trân trọng cách yêu thương của cha mẹ — dù không ngọt ngào, đó là tình cảm chân thành nhất.',
      'Chủ động hỏi thăm sức khỏe cha mẹ thường xuyên — họ cần sự quan tâm hơn là tiền bạc.',
      'Khi có con, hãy truyền lại những giá trị tốt đẹp mà cha mẹ đã dạy cho bạn.'
    ]
  },
  'B': {
    tomTat: 'Cha mẹ của bạn thuộc mẫu người lao động chân chính, sống đàng hoàng. Quan hệ cha mẹ – con cái ở mức ổn định, ít sóng gió lớn.',
    chaMe: 'Cha mẹ bạn thuộc mẫu người chăm chỉ, sống đàng hoàng, được hàng xóm quý mến. Họ không cầu kỳ trong cách dạy con, mà dạy bằng chính tấm gương lao động và cách sống của mình. Tình cảm dành cho con chân thành nhưng giản dị.',
    quanHe: 'Mối quan hệ cha mẹ – con cái ổn định — có những lúc bất đồng quan điểm nhưng đều có thể hóa giải. Không khí gia đình thường bình thường, không quá khắt khe cũng không quá nuông chiều.',
    giayTo: 'Các thủ tục hành chính gia đình nhìn chung suôn sẻ, đôi khi có chút lằng nhằng cần kiên nhẫn giải quyết.',
    luuY: 'Bạn nên tự lập sớm để đỡ đần cha mẹ — và luôn có kế hoạch tài chính rõ ràng cho bản thân.',
    loiKhuyen: [
      'Chủ động san sẻ gánh nặng tài chính với cha mẹ khi có thể.',
      'Giữ liên lạc thường xuyên — dù bận đến đâu cũng nên gọi hỏi thăm cha mẹ.',
      'Học hỏi từ cha mẹ sự chăm chỉ và đức tính tiết kiệm — đó là tài sản quý giá.'
    ]
  },
  'C': {
    tomTat: 'Cha mẹ của bạn thuộc mẫu người vất vả, sống giản dị và chịu thương chịu khó. Quan hệ cha mẹ – con cái có thể ít gần gũi nhưng chân thành.',
    chaMe: 'Cha mẹ bạn thuộc mẫu người lao động cực nhọc, sống vì con cái nhiều hơn vì bản thân. Họ có thể ít có thời gian dành cho con vì phải mưu sinh, nhưng tình thương luôn trọn vẹn. Cách dạy con của họ thiên về "làm gương" hơn là dạy bằng lời.',
    quanHe: 'Mối quan hệ cha mẹ – con cái có thể không mấy gần gũi về mặt biểu đạt tình cảm — có thể có những lúc căng thẳng hoặc hiểu lầm. Tuy nhiên, tình thân vẫn được giữ gìn bằng cách này hay cách khác.',
    giayTo: 'Các vấn đề giấy tờ của gia đình có thể gặp chút trắc trở — cần kiểm tra kỹ và kiên nhẫn xử lý.',
    luuY: 'Bạn nên chú ý sức khỏe tinh thần của chính mình — những trải nghiệm tuổi thơ có thể để lại dấu ấn. Hãy dành thời gian chữa lành và tìm những người có thể lắng nghe bạn.',
    loiKhuyen: [
      'Học cách tha thứ cho cha mẹ — họ cũng chỉ là những con người bình thường với những giới hạn riêng.',
      'Tự lập sớm để giảm gánh nặng cho cha mẹ — đây vừa là trách nhiệm vừa là cơ hội trưởng thành.',
      'Xây dựng nền tảng tài chính riêng vững chắc — đừng để con cái bạn sau này phải trải qua những gì bạn đã trải qua.'
    ]
  },
  'D': {
    tomTat: 'Cha mẹ của bạn thuộc mẫu người có tính cách khác biệt, dễ xảy ra xung đột trong gia đình. Quan hệ cha mẹ – con cái có thể để lại những dấu ấn sâu sắc trong lòng bạn.',
    chaMe: 'Cha mẹ bạn có tính cách khác biệt và thường xuyên bất đồng quan điểm. Cách thể hiện cảm xúc của họ thiên về bộc phát — có thể là lời qua tiếng lại, hoặc giữ im lặng. Bạn lớn lên trong một môi trường có thể thiếu an toàn cảm xúc.',
    quanHe: 'Mối quan hệ cha mẹ – con cái có thể để lại những tổn thương nhất định. Bạn có thể mang theo những ký ức không vui từ tuổi thơ, đôi khi ảnh hưởng đến cách bạn nhìn nhận hôn nhân và gia đình. Việc chữa lành là một hành trình dài, cần kiên nhẫn và có thể cần đến sự hỗ trợ chuyên môn.',
    giayTo: 'Các vấn đề giấy tờ, thừa kế, tài sản có thể cần sự rõ ràng ngay từ đầu. Tốt nhất là có người thứ ba đứng ra làm chứng trong các thỏa thuận.',
    luuY: 'Bạn nên đặc biệt chú ý sức khỏe tinh thần — tổn thương tuổi thơ có thể ảnh hưởng đến hạnh phúc hôn nhân và cách bạn nuôi dạy con. Tìm hiểu về tâm lý học và chữa lành nội tâm là việc quan trọng của cuộc đời bạn. Nếu cần, hãy tìm chuyên gia tâm lý — điều đó không có gì đáng xấu hổ.',
    loiKhuyen: [
      'Học cách tha thứ — không phải vì cha mẹ xứng đáng, mà vì bạn xứng đáng được giải thoát khỏi gánh nặng quá khứ.',
      'Khi lập gia đình, chủ động học cách yêu thương lành mạnh để không lặp lại vòng lặp tổn thương.',
      'Nếu có con, hãy cố gắng trở thành người cha/mẹ khác biệt — người mà bạn từng khao khát có được khi còn nhỏ.'
    ]
  },
  'F': {
    tomTat: 'Cung Phụ Mẫu không có chính tinh — mối quan hệ cha mẹ con cái linh hoạt, phụ thuộc nhiều vào hoàn cảnh và cung đối chiếu.',
    chaMe: 'Bạn không có một "khuôn mẫu" cố định nào về cha mẹ — tính cách và mối quan hệ với cha mẹ có thể thay đổi tùy từng giai đoạn cuộc đời. Có thể cha mẹ bạn không có nét gì thật nổi bật, nhưng luôn cố gắng theo cách của riêng họ.',
    quanHe: 'Mối quan hệ cha mẹ – con cái mang tính "phản chiếu" — phụ thuộc nhiều vào cách bạn đối xử với họ. Nếu bạn chủ động quan tâm, mối quan hệ sẽ tốt hơn; nếu bạn thờ ơ, mọi thứ sẽ nhạt nhòa dần.',
    giayTo: 'Các vấn đề giấy tờ phụ thuộc vào cung đối chiếu. Cần kiểm tra kỹ trước khi ký kết bất cứ điều gì.',
    luuY: 'Bạn nên chú ý đến sự cân bằng giữa tự lập và kết nối với cha mẹ. Đừng để tự lập trở thành xa cách. Hãy học cách chấp nhận những gì mình có thay vì so sánh với người khác.',
    loiKhuyen: [
      'Dù hoàn cảnh thế nào, cha mẹ vẫn là cha mẹ — hãy trân trọng thời gian bên họ.',
      'Chủ động tạo dựng mối quan hệ với cha mẹ từ những việc nhỏ nhất.',
      'Nếu không có cha mẹ hoặc cha mẹ không còn, hãy tìm một người bề trên để học hỏi và nương tựa tinh thần.'
    ]
  }
};

var TUVI_VAN_HUYNHDE = {
  'A': {
    tomTat: 'Anh chị em của bạn thuộc mẫu người sống có trách nhiệm, biết nghĩ cho nhau. Mối quan hệ anh em thường dựa trên sự tôn trọng và tôn ti trật tự.',
    anhChiEm: 'Anh chị em của bạn thuộc mẫu người chững chạc, biết lo toan và có tinh thần trách nhiệm với gia đình. Họ thường giữ vai trò "anh/chị lớn" — sẵn sàng bảo ban, dìu dắt các em. Tình cảm anh em thiên về sự tôn trọng hơn là gần gũi kiểu bạn bè.',
    quanHe: 'Tình cảm anh em trong gia đình bạn nhìn chung tốt đẹp — mọi người biết nhường nhịn và giúp đỡ lẫn nhau. Đây là mối quan hệ đáng trân trọng.',
    hoTro: 'Anh em có xu hướng giúp đỡ nhau trong những lúc cần thiết — từ tinh thần đến vật chất. Đây là chỗ dựa quan trọng của bạn.',
    luuY: 'Bạn nên chú ý không so sánh bản thân với anh em quá nhiều — mỗi người có con đường riêng. Hãy trân trọng những gì bạn đang có.',
    loiKhuyen: [
      'Duy trì liên lạc thường xuyên với anh em — đừng để khoảng cách địa lý làm phai nhạt tình cảm.',
      'Trong các vấn đề tài sản chung, hãy minh bạch và công bằng — tránh để tiền bạc làm rạn nứt tình cảm.',
      'Khi anh em gặp khó khăn, hãy chủ động giúp đỡ — cho đi sẽ nhận lại.'
    ]
  },
  'B': {
    tomTat: 'Anh chị em của bạn thuộc mẫu người thông minh, sống nội tâm. Mối quan hệ anh em có thể có khoảng cách nhưng vẫn giữ sự tôn trọng.',
    anhChiEm: 'Anh chị em của bạn thuộc mẫu người có đầu óc, thích suy nghĩ độc lập và ít bộc lộ cảm xúc. Họ có thể không biểu đạt tình cảm bằng lời, nhưng luôn quan tâm theo cách riêng. Mối quan hệ anh em thiên về sự tôn trọng hơn là chia sẻ.',
    quanHe: 'Tình cảm anh em có thể không thật sự gần gũi — mỗi người có cuộc sống và suy nghĩ riêng. Tuy nhiên, sự tôn trọng lẫn nhau vẫn được giữ gìn.',
    hoTro: 'Anh em có thể hỗ trợ nhau về mặt tri thức, lời khuyên, hoặc những lúc cần người đồng cảm. Sự hỗ trợ mang tính tinh thần nhiều hơn vật chất.',
    luuY: 'Bạn nên chú ý lời ăn tiếng nói khi giao tiếp với anh em — sự sắc sảo quá mức có thể gây hiểu lầm. Hãy học cách lắng nghe nhiều hơn.',
    loiKhuyen: [
      'Tìm điểm chung với anh em thay vì tập trung vào sự khác biệt.',
      'Tôn trọng quan điểm của anh em, kể cả khi bạn không đồng ý.',
      'Dành thời gian cho những cuộc trò chuyện sâu sắc — điều này giúp gắn kết hơn là gặp gỡ xã giao.'
    ]
  },
  'C': {
    tomTat: 'Anh chị em của bạn thuộc mẫu người thực tế, chăm chỉ và biết lo cho gia đình. Mối quan hệ anh em thường bền vững và ít sóng gió.',
    anhChiEm: 'Anh chị em của bạn thuộc mẫu người thực tế, sống có trách nhiệm với gia đình. Họ quan tâm đến những điều thiết thực hơn là lời nói hoa mỹ. Tình cảm anh em được thể hiện qua hành động hơn là lời nói.',
    quanHe: 'Tình cảm anh em nhìn chung ổn định — mọi người biết nhường nhịn và cùng nhau vun đắp. Không khí gia đình thường bình yên, ít xung đột.',
    hoTro: 'Anh em có xu hướng giúp đỡ nhau trong công việc và đời sống — sự hỗ trợ thiết thực và đáng tin cậy.',
    luuY: 'Bạn nên chú ý không lạm dụng sự giúp đỡ của anh em — hãy tự lập và đáp đền khi có cơ hội.',
    loiKhuyen: [
      'Giữ mối quan hệ anh em hòa thuận bằng cách tôn trọng lẫn nhau.',
      'Trong các vấn đề tài chính chung, hãy rõ ràng từ đầu để tránh hiểu lầm.',
      'Đừng để tiền bạc làm mất đi tình cảm anh em — đó là điều quý giá nhất.'
    ]
  },
  'D': {
    tomTat: 'Anh chị em của bạn thuộc mẫu người có tính cách khác biệt, ít tìm được tiếng nói chung. Mối quan hệ anh em có thể có khoảng cách.',
    anhChiEm: 'Anh chị em của bạn thuộc mẫu người có cá tính mạnh, quan điểm khác biệt. Mỗi người có con đường riêng và ít khi hòa hợp trong các vấn đề chung. Mối quan hệ anh em thiên về sự chấp nhận khác biệt hơn là gắn kết.',
    quanHe: 'Tình cảm anh em có thể không mấy gắn kết — có thể có những xung đột hoặc hiểu lầm trong quá khứ. Cần sự kiên nhẫn và thấu hiểu để giữ hòa khí. Đôi khi giữ khoảng cách hợp lý lại là cách tốt nhất.',
    hoTro: 'Sự hỗ trợ từ anh em có thể không ổn định — bạn nên tự lực nhiều hơn và không nên đặt quá nhiều kỳ vọng.',
    luuY: 'Bạn nên chú ý đặc biệt trong các vấn đề thừa kế, tài sản chung — cần minh bạch ngay từ đầu để tránh tranh chấp sau này.',
    loiKhuyen: [
      'Học cách chấp nhận sự khác biệt của anh em — không ai giống ai.',
      'Nếu có thể, hãy tìm cách hàn gắn — đừng để mâu thuẫn kéo dài đến khi quá muộn.',
      'Tập trung vào cuộc sống của mình thay vì bận tâm quá nhiều đến chuyện anh em.'
    ]
  },
  'F': {
    tomTat: 'Cung Huynh Đệ không có chính tinh — mối quan hệ anh chị em linh hoạt, phụ thuộc vào hoàn cảnh và cung xung chiếu.',
    anhChiEm: 'Bạn không có một "định hình" rõ ràng về anh chị em — mối quan hệ có thể thay đổi tùy từng giai đoạn cuộc đời. Có thể bạn có ít anh em, hoặc anh em ở xa, hoặc mối quan hệ không có nét gì thật đặc biệt.',
    quanHe: 'Tình cảm anh em có thể lúc gần lúc xa, tùy thuộc vào hoàn cảnh sống. Bạn cần chủ động duy trì kết nối để mối quan hệ không bị phai nhạt theo thời gian.',
    hoTro: 'Sự hỗ trợ từ anh em không ổn định — bạn nên xây dựng mạng lưới hỗ trợ bên ngoài gia đình để không bị động.',
    luuY: 'Bạn nên chú ý đến sự cân bằng giữa việc giữ kết nối với anh em và việc tự lập. Đừng để mối quan hệ anh em trở thành gánh nặng.',
    loiKhuyen: [
      'Dù hoàn cảnh thế nào, anh em vẫn là anh em — hãy trân trọng khi còn có thể.',
      'Tìm cách kết nối với anh em qua những hoạt động chung — du lịch, họp mặt gia đình.',
      'Nếu không có anh em ruột, hãy xây dựng tình bạn thân thiết như anh em — đó cũng là một dạng gia đình.'
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
  if (dsHoa.indexOf('Lộc') >= 0) text.push('Có Hóa Lộc tại ' + tenCung + ' — ' + (yL.loc || 'điểm sáng lớn, nhiều thuận lợi.'));
  if (dsHoa.indexOf('Quyền') >= 0) text.push('Có Hóa Quyền tại ' + tenCung + ' — ' + (yL.quyen || 'có uy, chủ động trong lĩnh vực này.'));
  if (dsHoa.indexOf('Khoa') >= 0) text.push('Có Hóa Khoa tại ' + tenCung + ' — ' + (yL.khoa || 'danh tiếng, học vấn, gặp khó có người giải.'));
  if (dsHoa.indexOf('Kỵ') >= 0) text.push('Có Hóa Kỵ tại ' + tenCung + ' — ' + (yL.ky || 'điểm cần lưu ý, dễ gặp trở ngại và hiểu lầm.'));
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
    { sao: ['Kình Dương','Đà La'], text: 'Kình Đà tại Nô Bộc — bạn bè tranh giành, dễ xảy ra xung đột. Cẩn thận khi hợp tác làm ăn.' },
    { sao: ['Địa Không','Địa Kiếp'], text: 'Không Kiếp tại Nô Bộc — cẩn thận bị bạn bè lợi dụng, mất tiền hoặc mất cơ hội.' },
    { sao: ['Hóa Kỵ'], text: 'Hóa Kỵ tại Nô Bộc — bạn bè đố kỵ, quan hệ xã hội dễ nảy sinh thị phi.' }
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
    cau.push('Không khí gia đình có lúc căng thẳng, dễ bùng phát thành cãi vã hoặc xô xát. Những ký ức tuổi thơ về tiếng to tiếng nhỏ có thể còn in đậm trong tâm trí bạn.');
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
    cau.push('Cung Phụ Mẫu bị ' + (palace.triet ? 'Triệt' : 'Tuần') + ' chặn — tuổi thơ có thể thiếu thốn cả vật chất lẫn tình cảm, phải tự lập sớm. Mọi việc liên quan đến cha mẹ thường chậm trễ, dở dang.');
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
    { sao: ['Tang Môn','Bạch Hổ'], text: 'Tang Môn hoặc Bạch Hổ tại Phụ Mẫu — chú ý sức khỏe cha mẹ, có thể có tin buồn.' },
    { sao: ['Kình Dương','Hóa Kỵ'], text: 'Kình Dương hoặc Hóa Kỵ tại Phụ Mẫu — dễ xung khắc với cha mẹ, cần kiên nhẫn hóa giải.' },
    { sao: ['Địa Không','Địa Kiếp'], text: 'Không Kiếp tại Phụ Mẫu — cha mẹ có thể mất sớm hoặc bạn phải tự lập sớm.' }
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
    { sao: ['Kình Dương','Đà La'], text: 'Kình Đà tại Huynh Đệ — anh em bất hòa, dễ tranh chấp. Tránh bàn chuyện tiền bạc với anh em.' },
    { sao: ['Cô Thần','Quả Tú'], text: 'Cô Thần, Quả Tú tại Huynh Đệ — anh em sống khép kín, ít qua lại, thiếu gắn kết.' },
    { sao: ['Hóa Kỵ'], text: 'Hóa Kỵ tại Huynh Đệ — hiểu lầm với anh em, cần chủ động hóa giải.' }
  ]);
  if (dCB) doan.push(dCB);
  doan.push({ tieuDe: 'Lời khuyên cụ thể', text: '', list: van.loiKhuyen.slice() });
  return doan;
}

function testVan3Cung() {
  var input = { name: 'Test', gender: 'nam', calendar: 'duong', day: 16, month: 6, year: 1995, hour: 4, minute: 0, viewYear: 2026 };
  var chart = tuviLapLaSo(input);
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
  var input = {
    name: 'Test', gender: 'nam', calendar: 'duong',
    day: 16, month: 6, year: 1995, hour: 4, minute: 0, viewYear: 2026
  };
  var chart = tuviLapLaSo(input);
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
  var input = {
    name: 'Test', gender: 'nam', calendar: 'duong',
    day: 16, month: 6, year: 1995, hour: 4, minute: 0, viewYear: 2026
  };
  var chart = tuviLapLaSo(input);
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
 * Kho văn Tầng 2 — mỗi cung có 5 mức độ, câu văn nhẹ nhàng,
 * không phán xét, luôn có hướng vượt qua hoặc cái nhìn tích cực.
 */
var TUVI_VAN_HOANCANH = {
  'Mệnh': {
    tieuDe: 'Bối cảnh cuộc đời bạn',
    rat_tot: 'Nhìn chung cuộc đời bạn có nhiều thuận lợi — bạn được hưởng nền tảng tốt cả về thể chất lẫn tinh thần. Đây là điểm tựa quan trọng để bạn phát huy bản thân.',
    tot: 'Cuộc đời bạn nhìn chung khá thuận — có thuận lợi, có đôi chút trở ngại nhưng không đáng kể. Đây là nền tảng tốt để bạn xây dựng cuộc sống.',
    trung_binh: 'Cuộc đời bạn ở mức trung bình — không quá thuận cũng không quá khó. Thành bại của bạn phụ thuộc nhiều vào nỗ lực và lựa chọn của chính mình.',
    kho_khan: 'Cuộc đời bạn trải qua một số thử thách — có những giai đoạn khó khăn đòi hỏi bạn phải nỗ lực nhiều hơn người khác. Nhưng chính nghịch cảnh sẽ rèn luyện cho bạn bản lĩnh và sự kiên cường.',
    rat_kho: 'Cuộc đời bạn có nhiều thử thách lớn — từ nhỏ đã có thể gặp nhiều khó khăn. Đây không phải là bất lợi hoàn toàn: nghịch cảnh thường hun đúc nên những con người mạnh mẽ và sâu sắc nhất.'
  },
  'Phụ Mẫu': {
    tieuDe: 'Hoàn cảnh thực tế của gia đình bạn',
    rat_tot: 'Nhìn chung gia đình bạn rất êm ấm — cha mẹ có nền tảng tốt, che chở cho con cái chu đáo. Đây là điểm tựa lớn của cuộc đời bạn.',
    tot: 'Gia đình bạn khá êm ấm — cha mẹ lo toan cho con cái đầy đủ, tuy có lúc căng thẳng nhưng nhìn chung hòa thuận. Bạn có nền tảng gia đình tốt.',
    trung_binh: 'Gia đình bạn ở mức trung bình — cha mẹ lo cho con cái vừa đủ, cuộc sống không dư dả cũng không túng thiếu. Quan hệ cha mẹ – con cái có lúc căng thẳng nhưng vẫn giữ được sự tôn trọng.',
    kho_khan: 'Trong thực tế cuộc sống, gia đình bạn có những giai đoạn vất vả — có thể về kinh tế hoặc về tình cảm. Mối quan hệ cha mẹ – con cái có lúc căng thẳng, có thể có những cuộc cãi vã. Đây là điều mà nhiều gia đình gặp phải, và việc thấu hiểu để chấp nhận là một hành trình quan trọng — vì cha mẹ cũng chỉ là người bình thường với những giới hạn riêng.',
    rat_kho: 'Gia đình bạn trải qua nhiều biến động — có thể từng gặp khó khăn về kinh tế, hoặc cha mẹ có những xung đột. Tuổi thơ của bạn có thể không yên ả, và điều này có thể đã để lại những dấu ấn trong lòng bạn. Việc chữa lành những tổn thương này là một hành trình quan trọng của cuộc đời bạn — hãy dành thời gian cho chính mình, và nếu cần, tìm đến những người có thể lắng nghe bạn.'
  },
  'Huynh Đệ': {
    tieuDe: 'Thực tế mối quan hệ anh chị em',
    rat_tot: 'Anh chị em của bạn rất gắn bó — mọi người yêu thương, giúp đỡ lẫn nhau. Đây là mối quan hệ quý giá mà không phải ai cũng có.',
    tot: 'Anh chị em của bạn khá hòa thuận — có sự hỗ trợ qua lại, dù đôi khi có những bất đồng nhỏ. Đây là nền tảng tốt cho gia đình.',
    trung_binh: 'Tình cảm anh chị em của bạn ở mức trung bình — mỗi người có cuộc sống riêng, ít khi gặp gỡ nhưng không đến mức xa cách. Đây là điều bình thường trong nhiều gia đình.',
    kho_khan: 'Anh chị em của bạn có những khoảng cách nhất định — có thể ít liên lạc, hoặc có những bất đồng trong quá khứ. Mối quan hệ anh em đôi khi cần thời gian và sự chủ động để hàn gắn.',
    rat_kho: 'Mối quan hệ anh chị em của bạn trải qua nhiều thử thách — có thể có những hiểu lầm hoặc khoảng cách khó hàn gắn. Đây là điều không dễ dàng, và bạn không cần phải cố gắng quá mức — đôi khi chấp nhận và tập trung vào cuộc sống của chính mình là điều khôn ngoan.'
  },
  'Phu Thê': {
    tieuDe: 'Thực tế đường hôn nhân',
    rat_tot: 'Đường hôn nhân của bạn rất thuận lợi — bạn dễ gặp được người bạn đời phù hợp, và cuộc sống hôn nhân thường êm ấm. Đây là điểm sáng lớn của cuộc đời bạn.',
    tot: 'Đường hôn nhân của bạn khá thuận — bạn có duyên gặp được người phù hợp, hôn nhân ổn định, dù đôi khi có những sóng gió nhỏ.',
    trung_binh: 'Đường hôn nhân của bạn ở mức trung bình — bạn có thể phải trải qua một vài mối tình trước khi gặp được người phù hợp, và hôn nhân cần sự vun đắp từ cả hai phía.',
    kho_khan: 'Đường hôn nhân của bạn có nhiều thử thách — bạn có thể trải qua vài mối tình, hoặc hôn nhân gặp những khó khăn nhất định. Điều quan trọng là chọn đúng người và dành thời gian tìm hiểu kỹ trước khi quyết định.',
    rat_kho: 'Đường hôn nhân của bạn trải qua nhiều biến động — có thể hôn nhân đến muộn, hoặc trải qua những sóng gió lớn. Đây là điều không dễ dàng, và bạn không cần phải chịu đựng một mình — hãy tìm đến những người có thể đồng hành và chia sẻ. Hôn nhân của bạn đòi hỏi sự kiên nhẫn và thấu hiểu từ cả hai phía.'
  },
  'Tử Tức': {
    tieuDe: 'Thực tế duyên con cái',
    rat_tot: 'Duyên con của bạn rất tốt — con cái khỏe mạnh, ngoan ngoãn, mang lại nhiều niềm vui cho gia đình. Đây là điểm sáng trong cuộc đời bạn.',
    tot: 'Duyên con của bạn khá thuận — con cái thường khỏe mạnh, ngoan ngoãn, ít gặp trở ngại lớn trong việc sinh nở và nuôi dạy.',
    trung_binh: 'Duyên con của bạn ở mức trung bình — bạn có thể gặp một vài trở ngại nhỏ trong việc sinh nở hoặc nuôi dạy con, nhưng nhìn chung vẫn thuận lợi.',
    kho_khan: 'Duyên con của bạn có chút trở ngại — có thể sinh con muộn, hoặc con cái có giai đoạn khó nuôi. Đây là điều nhiều gia đình gặp phải, và với sự chuẩn bị tốt về sức khỏe, bạn vẫn có thể có con như ý.',
    rat_kho: 'Duyên con của bạn trải qua nhiều thử thách — có thể gặp khó khăn trong việc có con, hoặc con cái có những vấn đề sức khỏe. Đây là hành trình không dễ dàng, và bạn xứng đáng được hỗ trợ. Hãy tìm đến bác sĩ chuyên khoa và những người có kinh nghiệm để đồng hành cùng bạn.'
  },
  'Tài Bạch': {
    tieuDe: 'Thực tế tài chính của bạn',
    rat_tot: 'Tài chính của bạn rất thuận lợi — bạn dễ kiếm tiền, biết giữ của, và cuộc sống thường đủ đầy. Đây là điểm mạnh lớn của bạn.',
    tot: 'Tài chính của bạn khá thuận — bạn có khả năng kiếm tiền ổn định, biết tiết kiệm, và ít gặp khó khăn về tiền bạc.',
    trung_binh: 'Tài chính của bạn ở mức trung bình — đủ ăn đủ mặc nhưng khó dư giả. Bạn cần có kế hoạch tài chính rõ ràng để ổn định cuộc sống.',
    kho_khan: 'Tài chính của bạn có nhiều thử thách — có thể bạn vất vả kiếm tiền mà khó giữ được của, hoặc gặp những biến cố về tiền bạc. Điều quan trọng là học cách quản lý tài chính và luôn có quỹ dự phòng.',
    rat_kho: 'Tài chính của bạn trải qua nhiều biến động — có thể bạn từng gặp khó khăn lớn về tiền bạc, hoặc tiền vào rồi lại ra. Đây là điều không dễ dàng, và bạn không cần tự trách mình — tài chính phụ thuộc vào rất nhiều yếu tố khách quan. Hãy học cách quản lý tài chính, và nếu cần, tìm đến chuyên gia để được tư vấn.'
  },
  'Tật Ách': {
    tieuDe: 'Thực tế sức khỏe của bạn',
    rat_tot: 'Sức khỏe của bạn rất tốt — thể chất vững vàng, ít bệnh tật, tinh thần lạc quan. Đây là tài sản quý giá nhất của bạn.',
    tot: 'Sức khỏe của bạn khá tốt — thể chất ổn định, thỉnh thoảng có những vấn đề nhỏ nhưng không đáng lo.',
    trung_binh: 'Sức khỏe của bạn ở mức trung bình — có những giai đoạn mệt mỏi hoặc ốm đau nhẹ, nhưng nhìn chung vẫn ổn. Cần chú ý nghỉ ngơi và ăn uống điều độ.',
    kho_khan: 'Sức khỏe của bạn có những vấn đề cần chú ý — có thể bạn hay ốm vặt, hoặc có những cơ quan cần được chăm sóc đặc biệt. Điều quan trọng là khám sức khỏe định kỳ và duy trì lối sống lành mạnh.',
    rat_kho: 'Sức khỏe của bạn trải qua nhiều thử thách — có thể bạn từng gặp vấn đề sức khỏe nghiêm trọng, hoặc thể chất yếu hơn người khác. Đây là điều bạn không cần phải chịu đựng một mình — hãy tìm đến bác sĩ và những người có chuyên môn. Sức khỏe là vốn quý nhất, và bạn xứng đáng được chăm sóc tốt nhất.'
  },
  'Thiên Di': {
    tieuDe: 'Thực tế khi bạn ra ngoài',
    rat_tot: 'Việc ra ngoài của bạn rất thuận lợi — đi đâu cũng gặp quý nhân, công việc làm ăn xa phát đạt. Đây là điểm sáng của cuộc đời bạn.',
    tot: 'Việc ra ngoài của bạn khá thuận — đi xa thường có người giúp đỡ, công việc làm ăn xa có triển vọng.',
    trung_binh: 'Việc ra ngoài của bạn ở mức trung bình — đi xa có thuận có nghịch, không quá nổi bật nhưng cũng không có trở ngại lớn.',
    kho_khan: 'Việc ra ngoài của bạn có chút trở ngại — có thể đi xa gặp khó khăn, hoặc ra ngoài làm ăn không được như ý. Điều quan trọng là chuẩn bị kỹ trước khi đi và luôn có phương án dự phòng.',
    rat_kho: 'Việc ra ngoài của bạn trải qua nhiều thử thách — có thể bạn từng gặp biến cố khi đi xa, hoặc cảm thấy bơ vơ nơi đất khách. Đây là điều không dễ dàng, và bạn cần đặc biệt chú ý đến an toàn và sức khỏe khi ra ngoài.'
  },
  'Nô Bộc': {
    tieuDe: 'Thực tế quan hệ bạn bè',
    rat_tot: 'Quan hệ bạn bè và đồng nghiệp của bạn rất tốt — bạn có nhiều bạn tốt, đồng nghiệp hỗ trợ, và gặp quý nhân khi cần. Đây là nguồn lực quan trọng của cuộc đời bạn.',
    tot: 'Quan hệ bạn bè và đồng nghiệp của bạn khá tốt — bạn có bạn bè đáng tin, đồng nghiệp thân thiện, và được mọi người yêu mến.',
    trung_binh: 'Quan hệ bạn bè và đồng nghiệp của bạn ở mức trung bình — có bạn tốt, có bạn xã giao, mọi thứ ở mức ổn định.',
    kho_khan: 'Quan hệ bạn bè và đồng nghiệp của bạn có chút trở ngại — có thể bạn từng bị bạn bè phản bội, hoặc gặp chuyện thị phi nơi công sở. Điều quan trọng là học cách chọn lọc bạn bè và giữ khoảng cách phù hợp.',
    rat_kho: 'Quan hệ bạn bè và đồng nghiệp của bạn trải qua nhiều thử thách — có thể bạn từng bị lợi dụng hoặc tổn thương bởi người mình tin tưởng. Đây là điều đau lòng, và bạn không cần phải chịu đựng một mình. Hãy giữ lại những người thật sự tốt, và đừng để quá khứ khiến bạn mất niềm tin vào con người.'
  },
  'Quan Lộc': {
    tieuDe: 'Thực tế sự nghiệp',
    rat_tot: 'Sự nghiệp của bạn rất thuận lợi — bạn dễ thăng tiến, công việc hanh thông, và có uy tín trong ngành. Đây là điểm mạnh lớn của bạn.',
    tot: 'Sự nghiệp của bạn khá thuận — công việc ổn định, có cơ hội thăng tiến, và được đồng nghiệp nể trọng.',
    trung_binh: 'Sự nghiệp của bạn ở mức trung bình — công việc ổn định nhưng khó đột phá, cần thời gian để phát triển.',
    kho_khan: 'Sự nghiệp của bạn có nhiều thử thách — có thể công việc không thuận, hoặc bạn phải trải qua nhiều lần đổi nghề mới tìm được hướng đi. Điều quan trọng là kiên nhẫn và không ngừng học hỏi.',
    rat_kho: 'Sự nghiệp của bạn trải qua nhiều biến động — có thể bạn từng mất việc, hoặc công việc gặp nhiều khó khăn kéo dài. Đây là điều không dễ dàng, và bạn không cần tự trách mình — sự nghiệp phụ thuộc vào nhiều yếu tố khách quan. Hãy tiếp tục học hỏi và giữ niềm tin vào bản thân.'
  },
  'Điền Trạch': {
    tieuDe: 'Thực tế nhà cửa của bạn',
    rat_tot: 'Nhà cửa của bạn rất thuận lợi — bạn có duyên về nhà đất, dễ sở hữu bất động sản giá trị, và giữ được của. Đây là điểm sáng lớn của cuộc đời bạn.',
    tot: 'Nhà cửa của bạn khá thuận — bạn có thể tự gây dựng hoặc thừa hưởng nhà đất, mọi việc về nhà cửa nhìn chung hanh thông.',
    trung_binh: 'Nhà cửa của bạn ở mức trung bình — có thể bạn phải vất vả một thời gian mới có nhà, hoặc nhà cửa bình thường không có gì nổi bật.',
    kho_khan: 'Nhà cửa của bạn có nhiều trở ngại — có thể bạn phải chuyển nhà nhiều lần, hoặc gặp khó khăn trong việc mua nhà. Điều quan trọng là kiên nhẫn tích lũy và chọn thời điểm phù hợp.',
    rat_kho: 'Nhà cửa của bạn trải qua nhiều biến động — có thể bạn từng gặp khó khăn lớn về nhà đất, hoặc phải ở nhờ, ở thuê nhiều năm. Đây là điều không dễ dàng, và bạn không cần phải tự ti — nhà cửa phụ thuộc vào nhiều yếu tố khách quan. Hãy tiếp tục xây dựng nền tảng tài chính, và cơ hội sẽ đến.'
  },
  'Phúc Đức': {
    tieuDe: 'Thực tế phúc phần của bạn',
    rat_tot: 'Phúc phần của bạn rất dày — dòng họ có nền tảng tốt, đời sống tinh thần phong phú, cuộc đời nhiều may mắn. Đây là món quà từ tổ tiên.',
    tot: 'Phúc phần của bạn khá tốt — dòng họ có nền tảng, đời sống tinh thần ổn định, cuộc đời ít sóng gió lớn.',
    trung_binh: 'Phúc phần của bạn ở mức trung bình — dòng họ không có gì đặc biệt, đời sống tinh thần ổn định nhưng không quá phong phú.',
    kho_khan: 'Phúc phần của bạn có phần mỏng — có thể dòng họ ít nền tảng, hoặc bạn phải tự lực nhiều trong cuộc sống. Điều này không có nghĩa là bạn thiếu may mắn — mà là bạn có cơ hội tự tạo phúc cho chính mình và con cháu.',
    rat_kho: 'Phúc phần của bạn trải qua nhiều thử thách — có thể dòng họ có biến cố, hoặc bạn phải tự tạo dựng mọi thứ từ đầu. Đây là hành trình không dễ dàng, nhưng cũng là cơ hội để bạn viết nên câu chuyện riêng của mình. Việc tu tâm, làm việc thiện, và sống có ích sẽ giúp bạn tích lũy phúc đức cho bản thân và các thế hệ sau.'
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
function tuviFactsTuHoaSao_(tenSao, hoa, palace, lv, nhom) {
  var map = {
    'Lộc': {
      yNghia: 'Sao ' + tenSao + ' Hóa Lộc — tài lộc và may mắn đến với lĩnh vực này. Bạn được hưởng lợi tự nhiên.',
      loai: 'manh', trongSo: 1.7, tags: ['tai_loc', 'may_man']
    },
    'Quyền': {
      yNghia: 'Sao ' + tenSao + ' Hóa Quyền — bạn có quyền, có uy trong lĩnh vực này. Người khác nể trọng và nghe theo.',
      loai: 'manh', trongSo: 1.6, tags: ['uy_quyen', 'lanh_dao']
    },
    'Khoa': {
      yNghia: 'Sao ' + tenSao + ' Hóa Khoa — danh tiếng và học vấn tỏa sáng. Khi gặp khó sẽ có người giúp giải.',
      loai: 'manh', trongSo: 1.5, tags: ['danh_tieng', 'hoc_van']
    },
    'Kỵ': {
      yNghia: 'Sao ' + tenSao + ' Hóa Kỵ — đây là điểm cần đặc biệt lưu ý. Dễ gặp trở ngại, hiểu lầm, hoặc hao tổn ở lĩnh vực này.',
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
      'Cung đối diện — nói về ' + tenLv(xc) + ' — rất mạnh mẽ. Đây là nguồn lực lớn mà bạn có thể dựa vào khi cần.',
      Math.round((dxc - 5) * 0.6 * 10) / 10,
      { nguon: 'Xung chiếu mạnh (' + dxc + '/10)', tags: ['xung_chieu_manh'] }));
  } else if (dxc <= 3.5) {
    facts.push(taoFact_('Tu Vi', lv, nhom, 'yeu',
      'Cung đối diện — nói về ' + tenLv(xc) + ' — khá yếu. Đây là điểm bạn cần tự lực nhiều hơn, không nên ỷ lại.',
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
      'Hai cung tam hợp — nói về ' + tenLv(th1) + ' và ' + tenLv(th2) + ' — khá yếu. Bạn cần tự lực nhiều hơn, đừng trông chờ vào bên ngoài.',
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
     'Cung nhị hợp — nói về ' + tenLv + ' — khá yếu. Có thể có yếu tố âm thầm đang kéo lùi bạn ở lĩnh vực ' + tenLv + ', cần quan sát.',
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
      'Cung này được hai cung bên cạnh "kẹp" bằng cát tinh — dấu hiệu được nâng đỡ từ hai phía, có quý nhân bảo vệ.',
      1.4, { nguon: 'Giáp cát: ' + catL.join(',') + ' / ' + catR.join(','), tags: ['giap_cat'] }));
  } else if (hungL.length && hungR.length) {
    facts.push(taoFact_('Tu Vi', lv, nhom, 'yeu',
      'Cung này bị hai cung bên cạnh "kẹp" bằng sát tinh — dấu hiệu bị kìm hãm, khó phát huy. Cần kiên nhẫn và cẩn trọng.',
      1.3, { nguon: 'Giáp sát: ' + hungL.join(',') + ' / ' + hungR.join(','), tags: ['giap_sat'] }));
  } else if (catL.length || catR.length) {
    facts.push(taoFact_('Tu Vi', lv, nhom, 'manh',
      'Có một bên được cát tinh nâng đỡ — bạn nhận được trợ lực từ một phía, không đầy đủ nhưng vẫn đáng quý.',
      0.7, { nguon: 'Giáp nửa cát', tags: ['giap_nua_cat'] }));
  } else if (hungL.length || hungR.length) {
    facts.push(taoFact_('Tu Vi', lv, nhom, 'yeu',
      'Có một bên có sát tinh — có thể có người hoặc hoàn cảnh âm thầm gây khó cho bạn.',
      0.7, { nguon: 'Giáp nửa hung', tags: ['giap_nua_hung'] }));
  }

  var tuanL = P[gl].tuan || P[gl].triet, tuanR = P[gr].tuan || P[gr].triet;
  if (tuanL && tuanR) {
    facts.push(taoFact_('Tu Vi', lv, nhom, 'trung',
      'Cả hai cung bên cạnh đều bị Tuần/Triệt chặn — bạn bị "bọc kín" hai bên, ít được nhưng cũng ít mất.',
      0.9, { nguon: 'Giáp Tuần/Triệt hai bên', tags: ['giap_tuan_triet'] }));
  } else if (tuanL || tuanR) {
    facts.push(taoFact_('Tu Vi', lv, nhom, 'trung',
      'Một bên bị Tuần/Triệt chặn — ảnh hưởng từ hai phía không đồng đều, bạn cần tự quan sát để cân bằng.',
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
      moi.yNghia = moi.yNghia.replace('mà bạn có thể dựa vào khi cần', 'cho hôn nhân của bạn, cần phát huy');
    } else if (t.indexOf('xung_chieu_yeu') >= 0) {
      moi.yNghia = moi.yNghia.replace('bạn cần tự lực nhiều hơn, không nên ỷ lại', 'hôn nhân của bạn cần tự lực nhiều hơn, không nên ỷ lại vào người ngoài');
    } else if (t.indexOf('tam_hop_manh') >= 0) {
      moi.yNghia = moi.yNghia.replace('Bạn có hai nguồn nâng đỡ đáng kể trong cuộc sống', 'Hôn nhân của bạn được hai phía nâng đỡ đáng kể');
    } else if (t.indexOf('tam_hop_yeu') >= 0) {
      moi.yNghia = moi.yNghia.replace('Bạn cần tự lực nhiều hơn, đừng trông chờ vào bên ngoài', 'Hôn nhân của bạn cần tự lực nhiều hơn, đừng trông chờ vào bên ngoài');
    } else if (t.indexOf('nhi_hop_manh') >= 0) {
      moi.yNghia = moi.yNghia.replace('mà bạn chưa chắc đã nhận ra', 'mà bạn chưa chắc đã nhận ra — ảnh hưởng tốt đến hôn nhân');
    } else if (t.indexOf('nhi_hop_yeu') >= 0) {
      moi.yNghia = moi.yNghia.replace('đang kéo lùi bạn ở lĩnh vực', 'đang kéo lùi hôn nhân của bạn ở lĩnh vực');
    } else if (t.indexOf('giap_cat') >= 0) {
      moi.yNghia = moi.yNghia.replace('dấu hiệu được nâng đỡ từ hai phía', 'hôn nhân của bạn được nâng đỡ từ hai phía');
    } else if (t.indexOf('giap_sat') >= 0) {
      moi.yNghia = moi.yNghia.replace('dấu hiệu bị kìm hãm, khó phát huy', 'hôn nhân của bạn bị kìm hãm, khó phát huy');
    } else if (t.indexOf('giap_nua_cat') >= 0) {
      moi.yNghia = moi.yNghia.replace('bạn nhận được trợ lực từ một phía', 'hôn nhân của bạn nhận được trợ lực từ một phía');
    } else if (t.indexOf('giap_nua_hung') >= 0) {
      moi.yNghia = moi.yNghia.replace('gây khó cho bạn', 'gây khó cho hôn nhân của bạn');
    } else if (t.indexOf('giap_tuan_triet') >= 0) {
      moi.yNghia = moi.yNghia.replace('bạn bị "bọc kín" hai bên', 'hôn nhân của bạn bị "bọc kín" hai bên');
    } else if (t.indexOf('giap_mot_ben') >= 0) {
      moi.yNghia = moi.yNghia.replace('bạn cần tự quan sát để cân bằng', 'hôn nhân của bạn cần tự quan sát để cân bằng');
    } else if (t.indexOf('tuan') >= 0 || t.indexOf('triet') >= 0) {
      moi.yNghia = moi.yNghia.replace('Cung này có', 'Cung Phu Thê có').replace('bạn sẽ gặp', 'hôn nhân của bạn sẽ gặp').replace('tuổi trẻ thường gặp', 'giai đoạn đầu hôn nhân thường gặp');
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
    textKhoKhan += ' Cung Quan Lộc của bạn có ' + (palace.triet ? 'Triệt' : 'Tuần') + ' đóng — giai đoạn đầu sự nghiệp thường mờ nhạt, sau 30 tuổi mới rõ nét.';
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
  else soCon = 'ít con (1 con hoặc hiếm muộn)';

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
    textDuyen = 'Duyên con của bạn thuận lợi. ' + factsDuyenCat.map(function(f){ return f.yNghia; }).join(' ');
  } else if (!factsDuyenCat.length && factsDuyenHung.length) {
    // Chỉ có điểm hung
    textDuyen = 'Duyên con của bạn cần chú ý. ' + factsDuyenHung.map(function(f){ return f.yNghia; }).join(' ') + ' Tuy vậy, với sự chuẩn bị tốt về sức khỏe và tinh thần, bạn vẫn có thể có con thuận lợi.';
  } else if (factsDuyenCat.length && factsDuyenHung.length) {
    // Có cả hai — ghi rõ ràng
    textDuyen = 'Duyên con của bạn có cả thuận lợi lẫn điểm cần lưu ý. ';
    textDuyen += 'Thuận lợi: ' + factsDuyenCat.map(function(f){ return f.yNghia; }).join(' ') + ' ';
    textDuyen += 'Cần lưu ý: ' + factsDuyenHung.map(function(f){ return f.yNghia; }).join(' ') + ' ';
    textDuyen += 'Với sự chuẩn bị tốt về sức khỏe sinh sản, bạn có thể vượt qua các điểm cần lưu ý này.';
  } else {
    textDuyen = van.duyenCon;
  }
  doan.push({ tieuDe: 'Duyên con cái', text: textDuyen });

  // === ĐOẠN 3: SỐ CON & GIỚI TÍNH ===
  var sg = tuviTinhSoConGioiTinh_(chart, palace, pi);
  var textSG = 'Theo phân tích kết hợp Tử Vi và Bát Tự: xu hướng <b>' + sg.soCon + '</b>, ' + sg.gioiTinh + ' (tỷ lệ khoảng ' + sg.pTrai + '% trai / ' + (100 - sg.pTrai) + '% gái). ';
  if (sg.batiKet) textSG += sg.batiKet + ' ';
  textSG += '<i>Cơ sở: ' + sg.chiTiet + '</i>';
  textSG += ' <b>Lưu ý:</b> Đây chỉ là xu hướng tham khảo — thực tế còn phụ thuộc vào kế hoạch gia đình, sức khỏe sinh sản, và nguyện vọng của cả hai vợ chồng.';
  doan.push({ tieuDe: 'Số con & giới tính (tham khảo)', text: textSG });

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
  doan.push({ tieuDe: 'Thể chất tổng quát', text: van.theChat });

  // Đoạn 3: Cơ quan cần chú ý
  var textCoQuan = van.coQuan;
  var factsCoQuan = facts.filter(function(f) {
    return f.nguon && f.nguon.indexOf('Chính tinh') === 0;
  });
  if (factsCoQuan.length) {
    textCoQuan += ' Cụ thể: ' + factsCoQuan.map(function(f){ return f.yNghia; }).join(' ');
  }
  doan.push({ tieuDe: 'Cơ quan cần chú ý', text: textCoQuan });

  // Đoạn 4: Cách phòng bệnh
  var textPhong = van.phongBenh;
  var factsGiai = facts.filter(function(f) {
    var t = f.tags || [];
    return t.some(function(x){ return x.indexOf('giai') >= 0 || x.indexOf('thay_thuoc') >= 0 || x.indexOf('quy_nhan_y_te') >= 0; });
  });
  if (factsGiai.length) {
    textPhong += ' Điểm sáng: ' + factsGiai.map(function(f){ return f.yNghia; }).join(' ');
  }
  doan.push({ tieuDe: 'Cách phòng bệnh', text: textPhong });

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
      doan.push('Cung Điền Trạch của bạn không có chính tinh — phải mượn sao từ cung đối diện là ' + tenLv + ' (có ' + saoDoi.join(', ') + '). ');
      // Dịch sao đối cung thành ý nghĩa nhà đất
      var yNghiaDoi = {
        'Tử Vi':      'Nhà cửa mượn được khí chất uy nghi — có thể có bất động sản giá trị khi lớn tuổi.',
        'Thiên Cơ':   'Nhà cửa hay thay đổi, dễ chuyển chỗ. Nên mua nhà khi đã ổn định công việc.',
        'Thái Dương': 'Nhà cửa sáng sủa, có thể được thừa hưởng từ cha mẹ.',
        'Vũ Khúc':    'Tự gây dựng nhà đất — không ỷ lại thừa kế. Nhà cửa vững chắc.',
        'Thiên Đồng': 'Nhà cửa trước ít sau nhiều — càng về già càng ổn định.',
        'Liêm Trinh': 'Nhà đất cần cẩn thận giấy tờ, dễ tranh chấp.',
        'Thiên Phủ':  'Giàu nhà đất, giữ được sản nghiệp lâu dài.',
        'Thái Âm':    'Rất tốt về điền sản — có lộc về nhà đất.',
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
        doan.push('Cung bị ' + (palace.triet ? 'Triệt' : 'Tuần') + ' chặn — giai đoạn đầu càng mờ nhạt, phải sau 30 tuổi mới rõ nét.');
      }
      return doan.join(' ');
    } else {
      return 'Cả Điền Trạch và cung đối diện đều không có chính tinh — nhà cửa của bạn phụ thuộc hoàn toàn vào hoàn cảnh và nỗ lực bản thân. Cần tích lũy dần theo thời gian.';
    }
  }

  // Có chính tinh — xét cặp sao trước, rồi đến sao đơn (giữ nguyên phần cũ)
  if (sao.indexOf('Tử Vi') >= 0 && sao.indexOf('Phá Quân') >= 0) {
    doan.push('Tổ nghiệp của bạn có xu hướng mai một dần — nhà đất thừa hưởng từ cha mẹ dễ bị bán hoặc đổi chủ. Tuy vậy, nếu có Lộc Tồn hoặc Hóa Lộc đi kèm, bạn có thể nhận được tài sản bất ngờ từ họ hàng hoặc mua được nhà với giá tốt.');
  } else if (sao.indexOf('Tử Vi') >= 0 && sao.indexOf('Thiên Phủ') >= 0) {
    doan.push('Đây là cách cục rất tốt cho nhà đất — bạn có cả uy tín lẫn kho tàng. Nhà cửa của bạn khang trang, giữ được lâu dài, và có xu hướng tăng giá trị theo thời gian.');
  } else if (sao.indexOf('Vũ Khúc') >= 0 && sao.indexOf('Thiên Tướng') >= 0) {
    doan.push('Bạn có duyên mua nhà đất giá trị cao — thường sở hữu bất động sản ở vị trí đắc địa. Nếu có Hóa Lộc, tài sản sẽ sinh lời tốt; nếu có Hóa Kỵ, cần kiểm tra kỹ giấy tờ pháp lý.');
  } else if (sao.indexOf('Thiên Cơ') >= 0 && sao.indexOf('Cự Môn') >= 0) {
    doan.push('Nhà cửa của bạn hay thay đổi — có thể chuyển nhà hoặc sửa sang nhiều lần. Không nên mua nhà quá gần hàng xóm ồn ào — dễ xảy ra tranh chấp.');
  } else if (sao.indexOf('Thái Dương') >= 0 && sao.indexOf('Cự Môn') >= 0) {
    doan.push('Bạn có duyên thừa hưởng nhà đất từ cha mẹ, đặc biệt nếu sinh ở vùng quê hoặc có tổ nghiệp. Nhà cửa thường sáng sủa, thoáng đãng.');
  } else if (sao.indexOf('Thái Âm') >= 0) {
    if (palace.tuan || palace.triet) {
      doan.push('Bạn có duyên lớn với nhà đất — đây là kênh tích lũy tài sản chủ lực của bạn. Tuy nhiên, cung Điền Trạch bị Tuần/Triệt chặn, nên giai đoạn đầu sẽ khó khăn, phải sau 30 tuổi mới hanh thông.');
    } else {
      doan.push('Bạn là người có duyên lớn với nhà đất — bất động sản là kênh tích lũy tài sản chủ lực của bạn. Nhà cửa thường ở nơi yên tĩnh, có không gian xanh, và giá trị tăng đều theo thời gian.');
    }
  } else if (sao.indexOf('Vũ Khúc') >= 0) {
    doan.push('Bạn có xu hướng tự mua nhà bằng sức mình hơn là dựa vào thừa kế. Nhà cửa của bạn vững chắc về kết cấu, giá trị tài chính cao — đây là loại tài sản "giữ được" qua biến động.');
  } else if (sao.indexOf('Thiên Phủ') >= 0) {
    doan.push('Bạn có khả năng giữ và phát triển tài sản nhà đất tốt — thường không bán nhà mà mua thêm. Nhà cửa của bạn mang tính "kho tàng", càng ở lâu càng có giá.');
  } else if (sao.indexOf('Thất Sát') >= 0 || sao.indexOf('Phá Quân') >= 0) {
    doan.push('Nhà đất của bạn thường biến động — có thể đổi chủ vài lần trước khi ổn định. Bạn phải tự lập mới có nhà cửa vững chắc, không nên ỷ lại vào tổ nghiệp.');
  } else if (sao.indexOf('Tham Lang') >= 0) {
    doan.push('Nhà cửa của bạn lúc thịnh lúc suy — trung niên mới có nhà đất ổn định. Không nên đầu tư bất động sản khi còn trẻ, đợi đến tuổi 35 trở đi sẽ thuận hơn.');
  } else if (sao.indexOf('Liêm Trinh') >= 0) {
    doan.push('Nhà đất của bạn cần đặc biệt cẩn thận về giấy tờ — dễ tranh chấp với anh em hoặc họ hàng về quyền thừa kế. Cần rõ ràng pháp lý từ đầu, không nên mua bán bằng giấy tay.');
  } else if (sao.indexOf('Thiên Đồng') >= 0) {
    doan.push('Nhà cửa của bạn trước ít sau nhiều — ban đầu có thể chật vật phải thuê nhà, nhưng càng về sau càng ổn định. Bạn thường tự lập trong việc nhà cửa, ít nhờ vả.');
  } else if (sao.indexOf('Thiên Lương') >= 0) {
    doan.push('Bạn có duyên được thừa hưởng nhà đất tổ nghiệp, hoặc sống ở nơi có truyền thống lâu đời. Nhà cửa thường ở nơi gần thiên nhiên, yên tĩnh, ít xô bồ.');
  } else if (sao.indexOf('Thiên Tướng') >= 0) {
    doan.push('Nhà cửa của bạn đẹp, ngăn nắp, có người giúp trong việc mua sắm và sửa sang. Môi trường sống thường chỉn chu, có gu thẩm mỹ.');
  } else {
    doan.push('Cung Điền Trạch của bạn ở mức trung bình — nhà cửa ổn định nhưng không có điểm gì đặc biệt nổi bật. Cần tích lũy dần theo thời gian.');
  }

  // Độ sáng (miếu/vượng/hãm)
  var ham = palace.chinh.filter(function(s){ return s.b === 'H'; }).length;
  var sang = palace.chinh.filter(function(s){ return s.b === 'M' || s.b === 'V'; }).length;
  if (ham >= 2) {
    doan.push('Các sao chính ở đây đều hãm địa — nhà cửa của bạn thường kém về phong thủy hoặc vị trí. Nên chọn nhà hướng Đông Nam hoặc Nam để cân bằng khí.');
  } else if (sang >= 2) {
    doan.push('Các sao chính ở đây đều miếu vượng — nhà cửa của bạn có phong thủy tốt, ở đâu cũng gặp may mắn về nhà đất.');
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
    text.push('Có Hóa Lộc tại Điền Trạch — gia đình bạn có duyên về tài sản, nhà cửa có xu hướng tăng thêm theo thời gian. Đây là điểm sáng lớn, nên tận dụng để mua thêm bất động sản.');
  }
  if (dsHoa.indexOf('Quyền') >= 0) {
    text.push('Có Hóa Quyền — bạn có xu hướng mở rộng nhà đất, nhưng cũng dễ phát sinh tranh chấp về quyền sở hữu trong gia đình. Cần rõ ràng giấy tờ từ đầu, đặc biệt với anh em ruột.');
  }
  if (dsHoa.indexOf('Khoa') >= 0) {
    text.push('Có Hóa Khoa — việc mua bán, sang tên nhà đất của bạn thuận lợi hơn người khác. Nhà cửa của bạn thường được bài trí gọn gàng, có gu thẩm mỹ.');
  }
  if (dsHoa.indexOf('Kỵ') >= 0) {
    text.push('Có Hóa Kỵ tại Điền Trạch — đây là điểm cần lưu ý. Nhà đất của bạn dễ gặp rắc rối về giấy tờ, hoặc bạn có thể bị "kẹt" vốn vào bất động sản không sinh lời.');
    text.push('Tuy nhiên, cần phân biệt 2 trường hợp: nếu Kỵ này là "Kỵ nhập kho" (đi vào nơi có Lộc Tồn hoặc Hóa Lộc) thì lại là tốt — tiền vào nhà khó thoát ra, tức là giữ được của. Ngược lại, nếu Kỵ đi vào nơi trống vắng thì tài sản dễ tiêu tán.');
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
    canhBao.push('Có Hỏa Tinh hoặc Linh Tinh — đề phòng hỏa hoạn hoặc hư hỏng nhà cửa do điện, nước. Nên kiểm tra hệ thống điện và bảo trì định kỳ, đặc biệt là bếp gas và ổ cắm.');
  }
  if (coKhong || coKiep) {
    canhBao.push('Có Địa Không hoặc Địa Kiếp — nhà đất của bạn dễ bị hao hụt hoặc mất giá. Tránh đầu tư bất động sản quy mô lớn khi chưa có kinh nghiệm, không nên vay ngân hàng để mua nhà khi chưa đủ khả năng trả.');
  }
  if (dsSao.indexOf('Đà La') >= 0) {
    canhBao.push('Có Đà La — nhà cửa có thể gặp vấn đề ngầm như ẩm mốc, dột, hoặc tranh chấp dây dưa với hàng xóm. Cần bảo trì thường xuyên và giữ hòa khí với hàng xóm.');
  }

  // Kiểm tra giáp cung
  var giapL = mod12(pi - 1), giapR = mod12(pi + 1);
  var saoL = [].concat(P[giapL].chinh, P[giapL].cat, P[giapL].hung).map(function(s){ return s.n; });
  var saoR = [].concat(P[giapR].chinh, P[giapR].cat, P[giapR].hung).map(function(s){ return s.n; });
  var khongKiepL = saoL.indexOf('Địa Không') >= 0 || saoL.indexOf('Địa Kiếp') >= 0;
  var khongKiepR = saoR.indexOf('Địa Không') >= 0 || saoR.indexOf('Địa Kiếp') >= 0;
  if (khongKiepL && khongKiepR) {
    canhBao.push('Địa Không và Địa Kiếp kẹp hai bên cung Điền Trạch — dấu hiệu tổ nghiệp không vững, khó giữ được nhà đất thừa hưởng. Bạn nên tập trung vào thu nhập ổn định thay vì kỳ vọng vào thừa kế hoặc đầu cơ bất động sản.');
  }

  var tuanL = P[giapL].tuan || P[giapL].triet;
  var tuanR = P[giapR].tuan || P[giapR].triet;
  if (tuanL && tuanR) {
    canhBao.push('Cả hai cung bên cạnh đều bị Tuần/Triệt chặn — nhà cửa của bạn bị "bọc kín", ít được nhưng cũng ít mất. Đây là dấu hiệu của sự ổn định lâu dài, không có biến động lớn về nhà đất.');
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
 *  XỬ LÝ CUNG PHÚC ĐỨC — Facts + Văn 7 đoạn (có tiền kiếp)
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
        { nguon: 'Tiền kiếp (từ ' + s.n + ')', doiTuong: 'ban_than', tags: ['tien_kiep'] }));
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
  if (dsHoa.indexOf('Lộc') >= 0) text.push('Có Hóa Lộc tại Phúc Đức — phúc lộc dồi dào, đời sống tinh thần và vật chất đều đủ đầy. Dòng họ có nền tảng khá, bạn được hưởng nhiều may mắn.');
  if (dsHoa.indexOf('Quyền') >= 0) text.push('Có Hóa Quyền — bạn có uy tín trong dòng họ, thường được giao trọng trách họ tộc. Tinh thần vững vàng, ít bị dao động.');
  if (dsHoa.indexOf('Khoa') >= 0) text.push('Có Hóa Khoa — tinh thần sáng suốt, học vấn cao. Dòng họ có truyền thống học hành, bạn được thừa hưởng sự giáo dục tốt.');
  if (dsHoa.indexOf('Kỵ') >= 0) text.push('Có Hóa Kỵ tại Phúc Đức — nội tâm nặng nề, dễ mang cảm xúc tiêu cực. Dòng họ có thể có thị phi hoặc nghiệp chướng cần hóa giải. Nên tu tâm và làm việc thiện để chuyển hóa.');

  if (!text.length) return null;
  return { tieuDe: 'Tứ Hóa tại Phúc Đức', text: text.join(' ') };
}

function taoDoanDacBietPhucDuc_(chart, pi) {
  var P = chart.palaces;
  var C = P[pi];
  var dsSao = [].concat(C.chinh, C.cat, C.hung, C.tieu).map(function(s){ return s.n; });
  var dacBiet = [];

  if (dsSao.indexOf('Thiên Đức') >= 0 && dsSao.indexOf('Nguyệt Đức') >= 0) {
    dacBiet.push('Có cả Thiên Đức và Nguyệt Đức — đây là cách cục rất tốt cho Phúc Đức. Bạn được âm đức phù hộ mạnh mẽ, gặp dữ hóa lành, tâm hồn an nhiên. Nên duy trì việc thiện để phúc ngày càng dày.');
  }
  if (dsSao.indexOf('Hoa Cái') >= 0) {
    dacBiet.push('Có Hoa Cái — bạn có thiên hướng tâm linh, tôn giáo, hoặc triết học. Đây là món quà quý — bạn dễ tìm thấy bình an qua thiền định và chiêm nghiệm.');
  }
  var coKhong = dsSao.indexOf('Địa Không') >= 0;
  var coKiep = dsSao.indexOf('Địa Kiếp') >= 0;
  if (coKhong && coKiep) {
    dacBiet.push('Có cả Địa Không và Địa Kiếp tại Phúc Đức — phúc phần mỏng, tinh thần dễ trống trải. Cần đặc biệt chú trọng tu tâm tích đức để bồi đắp. Nên làm việc thiện định kỳ và tránh xa các thú vui độc hại.');
  }
  if (C.tuan || C.triet) {
    dacBiet.push('Cung Phúc Đức bị ' + (C.triet ? 'Triệt' : 'Tuần') + ' chặn — phúc phần có thể bị giảm nhẹ. Nhưng nếu biết tu dưỡng, đây lại là cơ hội để chuyển hóa — sau 30 tuổi phúc sẽ dần dày lên.');
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

  // Đoạn 3 (MỚI): Tiền kiếp và nghiệp lực
  var textTienKiep = van.linhHon;
  var factsTK = facts.filter(function(f){
    var t = f.tags || [];
    return t.indexOf('tien_kiep') >= 0;
  });
  if (factsTK.length) {
    textTienKiep += ' ' + factsTK.map(function(f){ return f.yNghia; }).join(' ');
  }
  textTienKiep += ' <i>(Đây là góc nhìn tâm linh tham khảo — không nên xem là định mệnh cố định. Bạn luôn có thể chuyển hóa nghiệp lực bằng cách tu tâm và làm việc thiện.)</i>';
  doan.push({ tieuDe: 'Tiền kiếp và nghiệp lực (tham khảo)', text: textTienKiep });

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
  var input = {
    name: 'Test',
    gender: 'nam',
    calendar: 'duong',
    day: 16, month: 6, year: 1995,
    hour: 4, minute: 0,
    viewYear: 2026
  };

  var chart = tuviLapLaSo(input);
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
  var input = {
    name: 'Test', gender: 'nam', calendar: 'duong',
    day: 16, month: 6, year: 1995, hour: 4, minute: 0, viewYear: 2026
  };

  var chart = tuviLapLaSo(input);

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
  var input = {
    name: 'Test', gender: 'nam', calendar: 'duong',
    day: 16, month: 6, year: 1995, hour: 4, minute: 0, viewYear: 2026
  };

  var chart = tuviLapLaSo(input);

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
  var input = {
    name: 'Test', gender: 'nam', calendar: 'duong',
    day: 16, month: 6, year: 1995, hour: 4, minute: 0, viewYear: 2026
  };

  var chart = tuviLapLaSo(input);
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
  var input = {
    name: 'Test', gender: 'nam', calendar: 'duong',
    day: 16, month: 6, year: 1995, hour: 4, minute: 0, viewYear: 2026
  };

  var chart = tuviLapLaSo(input);
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
  var input = {
    name: 'Test', gender: 'nam', calendar: 'duong',
    day: 16, month: 6, year: 1995, hour: 4, minute: 0, viewYear: 2026
  };

  var chart = tuviLapLaSo(input);
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
  var input = {
    name: 'Test', gender: 'nam', calendar: 'duong',
    day: 16, month: 6, year: 1995, hour: 4, minute: 0, viewYear: 2026
  };

  var chart = tuviLapLaSo(input);
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
  var input = { name: 'Test', gender: 'nam', calendar: 'duong', day: 16, month: 6, year: 1995, hour: 4, minute: 0, viewYear: 2026 };
  var chart = tuviLapLaSo(input);
  var bt = batTuLap(input);
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
  var input = { name: 'Test', gender: 'nam', calendar: 'duong', day: 16, month: 6, year: 1995, hour: 4, minute: 0, viewYear: 2026 };
  var chart = tuviLapLaSo(input);
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
  var input = { name: 'Test', gender: 'nam', calendar: 'duong', day: 16, month: 6, year: 1995, hour: 4, minute: 0, viewYear: 2026 };
  var chart = tuviLapLaSo(input);
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
  var input = {
    name: 'Test', gender: 'nam', calendar: 'duong',
    day: 16, month: 6, year: 1995, hour: 4, minute: 0, viewYear: 2026
  };

  Logger.log('=== BƯỚC 1: An sao ===');
  var chart = tuviLapLaSo(input);
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