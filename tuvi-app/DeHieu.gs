/**
 * ============================================================
 *  DeHieu.gs — LUẬN GIẢI DỄ HIỂU CHO 5 HỆ CÒN LẠI + TỔNG HỢP 6 HỆ
 *  (Bát Tự · Chiêm tinh · Thần số học · Human Design · Hà Lạc)
 *
 *  Cùng kiến trúc với Tử Vi (TuViHeThong.gs):
 *   - TẦNG 1 DATA   : dữ liệu thô từ từng hệ (đã có sẵn ở các file hệ)
 *   - TẦNG 2 FACTS  : mỗi hệ xuất mảng facts theo format chung (Facts.gs)
 *   - TẦNG 3 VĂN    : kho văn → đoạn { tieuDe, text, list } như 12 cung
 *                     · Văn tầng 1 = bản chất ("thuộc mẫu người…", "có xu hướng…")
 *                     · Văn tầng 2 = hoàn cảnh theo mức mạnh/yếu, nêu song song mặt tốt – mặt xấu (quy tắc 24/11)
 *   - TẦNG 4 TỔNG HỢP: gom facts 6 hệ theo nhóm chủ đề, đếm hệ đồng thuận
 *
 *  Quy ước văn phong (theo bản ghi nhớ dự án): chỉ tiếng Việt, hạn chế thuật ngữ,
 *  thuật ngữ cổ phải kèm lời giải thích, không phán xét, không khẳng định tuyệt đối.
 *
 *  Nguồn tham khảo khi soạn kho văn:
 *   - Bát Tự: đặc tính 10 nhật chủ (hình tượng cây lớn / dây leo / mặt trời / ngọn nến /
 *     núi / ruộng / kiếm / trang sức / sông biển / mưa sương), thân vượng – nhược, dụng thần,
 *     ý nghĩa thập thần (tổng hợp từ các bài giảng Bát Tự phổ biến tiếng Việt và tiếng Anh).
 *   - Chiêm tinh: ý nghĩa Mặt Trời (bản ngã), Mặt Trăng (nhu cầu cảm xúc), cung Mọc (ấn tượng
 *     ban đầu), Sao Kim/Sao Hỏa theo nguyên tố, Sao Mộc/Sao Thổ theo nhà (chiêm tinh hiện đại).
 *   - Human Design: Loại – Chiến lược – Dấu hiệu đúng/lệch, Thẩm quyền, 6 hào Hồ sơ,
 *     trung tâm mở (tài liệu Jovian Archive và các hướng dẫn phổ biến).
 *   - Thần số học Pythagoras & Bát tự Hà Lạc: dùng lại dữ liệu đã có trong ThanSoHoc.gs, HaLac.gs.
 * ============================================================
 */

/* ---------------- Tiện ích chung ---------------- */
function dhD10_(raw) { return chuanHoa10_(raw); }
/** Mức tầng 2 theo điểm thang 10 */
function dhMuc_(x) { return x >= 7.5 ? 'rat_tot' : x >= 6 ? 'tot' : x >= 4.5 ? 'trung_binh' : x >= 3 ? 'kho_khan' : 'rat_kho'; }
function dhLoai_(x) { return x >= 6.5 ? 'manh' : x <= 4 ? 'yeu' : 'trung'; }
function dhHoa_(s) { s = String(s || '').trim(); return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
function dhCau_(s) { s = dhHoa_(s); return s && !/[.!?…]$/.test(s) ? s + '.' : s; }
/** Bỏ ký hiệu kỹ thuật đầu dòng (✓ ✗ ◇ ☉ …) */
function dhSach_(s) { return String(s || '').replace(/^[\s✓✗◇◆☉☽♥✎❖◈•\-–]+/, '').trim(); }
function dhDoan_(tieuDe, text, list) { var d = { tieuDe: tieuDe, text: text || '' }; if (list && list.length) d.list = list; return d; }
var DH_MUC_TEN = { rat_tot: 'rất thuận', tot: 'khá thuận', trung_binh: 'trung bình', kho_khan: 'còn nhiều thử thách', rat_kho: 'cần đặc biệt lưu tâm' };

/* ============================================================
 *  1. BÁT TỰ (TỨ TRỤ)
 * ============================================================ */
var DH_BT_NHAT_CHU = [
  { ten: 'Giáp Mộc', hinh: 'cây đại thụ',
    tomTat: 'Bạn sinh vào ngày Giáp – hình tượng cây đại thụ vươn thẳng lên trời. Người Giáp thường ngay thẳng, có chí hướng, muốn làm chỗ dựa cho người khác – và cũng thường khó uốn mình.',
    banChat: 'Bạn thuộc mẫu người sống có nguyên tắc, nhìn xa, thích đi con đường rõ ràng và tự mình gây dựng. Mặt tốt: bạn vững, đáng tin, đi đường dài không dễ bỏ cuộc. Mặt xấu: bạn cứng nhắc, khó nhận mình sai, và khi hoàn cảnh đổi chiều thì thường gãy chứ không chịu uốn.',
    manh: 'Chính trực, có trách nhiệm, thích che chở người yếu hơn; có khả năng tự lập và dẫn dắt; kiên trì theo đuổi mục tiêu dài hạn.',
    luuY: 'Bảo thủ, khó đổi quan điểm kể cả khi đã thấy sai; ngại nhờ giúp nên hay gánh một mình đến kiệt sức; bị ép là phản ứng cứng, dễ làm hỏng quan hệ với cấp trên và người thân.',
    nghe: 'quản lý, giáo dục, xây dựng tổ chức, pháp lý, lâm nghiệp – cây trồng, các vai trò dẫn dắt dài hạn',
    loiKhuyen: ['Khi bị phản đối, nghe hết rồi mới trả lời.', 'Nhờ giúp sớm, trước khi việc vượt sức mình.', 'Chọn mục tiêu dài hạn và chấp nhận đi chậm.'] },
  { ten: 'Ất Mộc', hinh: 'hoa cỏ, dây leo',
    tomTat: 'Bạn sinh vào ngày Ất – hình tượng hoa cỏ, dây leo mềm mại. Người Ất thường khéo léo, linh hoạt, biết tìm đường vươn lên – nhưng hay phải dựa vào một "giàn đỡ".',
    banChat: 'Bạn thuộc mẫu người mềm mỏng bên ngoài, dẻo dai bên trong. Mặt tốt: bạn giỏi thích nghi, biết uốn mình theo người và việc, thường thành công nhờ kết nối đúng người. Mặt xấu: bạn dễ phụ thuộc vào người nâng đỡ; chỗ dựa mất là bạn chao đảo, và vì chiều người nên hay bị lợi dụng.',
    manh: 'Khéo ăn nói, giỏi ngoại giao, có óc thẩm mỹ và sáng tạo; nhạy bén với cảm xúc người khác; bền bỉ, ít khi bỏ cuộc.',
    luuY: 'Do dự, ngại va chạm nên hay để việc kéo dài; dễ dựa dẫm, chọn sai người là kéo cả mình xuống; giữ bực trong lòng thay vì nói thẳng, rồi bùng ra lúc không ngờ.',
    nghe: 'nghệ thuật, thiết kế, tư vấn, dịch vụ khách hàng, ngoại giao – truyền thông, chăm sóc sắc đẹp',
    loiKhuyen: ['Chọn kỹ môi trường, cộng sự và người bạn đời – đó là "giàn leo" của bạn.', 'Tập nói điều mình muốn ngay khi còn nhỏ chuyện.', 'Luôn có một nguồn sống không phụ thuộc vào ai.'] },
  { ten: 'Bính Hỏa', hinh: 'mặt trời',
    tomTat: 'Bạn sinh vào ngày Bính – hình tượng mặt trời rực rỡ. Người Bính thường nhiệt tình, cởi mở, sưởi ấm người xung quanh – và cũng dễ cháy quá tay.',
    banChat: 'Bạn thuộc mẫu người hướng ra ngoài, thích chia sẻ, cần mục tiêu rõ và cần được nhìn thấy. Mặt tốt: bạn cho đi tự nhiên, truyền được cảm hứng cho cả tập thể. Mặt xấu: bạn nóng vội, sĩ diện, ôm quá nhiều việc cùng lúc rồi kiệt sức, và lời nói thẳng lúc nóng dễ làm mất lòng người thân.',
    manh: 'Nhiệt huyết, rộng lượng, lạc quan; ý chí tiến thủ mạnh; có sức hút và tố chất lãnh đạo.',
    luuY: 'Nóng vội, bộc trực quá mức nên dễ gây xích mích; trọng thể diện, có lúc chi tiền hoặc nhận việc chỉ để giữ hình ảnh; dàn trải, hay "cháy" hết sức rồi bỏ dở.',
    nghe: 'truyền thông, giảng dạy, lãnh đạo – quản lý, giải trí, kinh doanh hướng ngoại, năng lượng',
    loiKhuyen: ['Giữ lịch nghỉ cố định, không đợi mệt mới nghỉ.', 'Đang giận thì chưa trả lời.', 'Chỉ giữ vài mục tiêu lớn mỗi năm.'] },
  { ten: 'Đinh Hỏa', hinh: 'ngọn đèn, ngọn nến',
    tomTat: 'Bạn sinh vào ngày Đinh – hình tượng ngọn đèn, ngọn nến trong bóng tối. Người Đinh thường tinh tế, sâu sắc, bền bỉ lặng lẽ – và dễ chao đảo khi có "gió".',
    banChat: 'Bạn thuộc mẫu người nhạy cảm, trực giác tốt, để ý chi tiết và cảm xúc người khác. Mặt tốt: ánh sáng của bạn ấm và lâu bền, bạn hay giúp người khác tìm được lối đi. Mặt xấu: bạn lo nghĩ nhiều, dễ tổn thương, giữ chuyện trong lòng đến mức mệt cả thân lẫn tâm, và môi trường căng thẳng làm bạn sa sút rất nhanh.',
    manh: 'Chu đáo, tinh ý, giàu cảm xúc; kiên trì âm thầm; có khả năng dạy dỗ, tư vấn, nuôi dưỡng tinh thần người khác.',
    luuY: 'Lo nghĩ quá mức, đa cảm; hay để bụng, ôm buồn một mình nên dễ mất ngủ, suy nhược; không được thấu hiểu là thu mình lại, quan hệ nguội dần mà không nói ra.',
    nghe: 'giáo dục, nghiên cứu, tư vấn – tâm lý, y tế, nghệ thuật, văn hóa, công việc cần sự tỉ mỉ',
    loiKhuyen: ['Tránh môi trường nhiều thị phi, căng thẳng kéo dài.', 'Có ít nhất một người để nói thật lòng.', 'Ghi lại linh cảm rồi kiểm chứng bằng việc nhỏ.'] },
  { ten: 'Mậu Thổ', hinh: 'núi lớn, đất dày',
    tomTat: 'Bạn sinh vào ngày Mậu – hình tượng ngọn núi, lớp đất dày. Người Mậu thường vững vàng, đáng tin, là chỗ dựa cho người xung quanh – và cũng chậm thay đổi như núi.',
    banChat: 'Bạn thuộc mẫu người điềm tĩnh, giữ chữ tín, thích ổn định và rõ ràng. Mặt tốt: bạn ít dao động trước sóng gió, biết đặt giới hạn và bảo vệ người mình trân trọng. Mặt xấu: bạn chậm thích nghi, cố chấp, ít nói cảm xúc nên người thân thấy bạn lạnh và xa; khi thời thế đổi, bạn dễ bị bỏ lại phía sau.',
    manh: 'Trung thực, bao dung, chịu đựng tốt; biết giữ gìn tài sản và các mối quan hệ; làm việc chắc chắn, có trách nhiệm.',
    luuY: 'Chậm thay đổi, cố chấp với cách làm cũ nên lỡ cơ hội; ít bày tỏ cảm xúc, vợ chồng con cái dễ thấy thiếu gần gũi; chịu đựng quá lâu rồi mới lên tiếng, lúc đó chuyện đã khó gỡ.',
    nghe: 'bất động sản, xây dựng, quản trị – hành chính, tài chính – bảo hiểm, nông nghiệp',
    loiKhuyen: ['Mỗi năm thử một cách làm mới.', 'Nói ra cảm xúc bằng lời, không chỉ bằng việc làm.', 'Dùng sự đáng tin để giữ các mối hợp tác dài.'] },
  { ten: 'Kỷ Thổ', hinh: 'ruộng vườn màu mỡ',
    tomTat: 'Bạn sinh vào ngày Kỷ – hình tượng thửa ruộng màu mỡ. Người Kỷ thường biết nuôi dưỡng, thấu hiểu, chăm chút cho người khác cùng lớn lên – và hay quên phần mình.',
    banChat: 'Bạn thuộc mẫu người khéo léo, chu đáo, thấy điểm tốt ở người khác và dễ bỏ qua lỗi lầm. Mặt tốt: bạn giỏi sắp xếp, gắn kết người và việc. Mặt xấu: bạn thiếu quyết đoán, ôm việc của người khác, dễ bị lợi dụng lòng tốt và thường để sức khỏe, tiền bạc của chính mình hụt dần.',
    manh: 'Chăm chỉ, tận tụy, giỏi tổ chức; bao dung, dễ gần; có tài chăm sóc và vun đắp.',
    luuY: 'Do dự, chần chừ khi cần quyết nhanh nên lỡ thời điểm; hay ôm việc, lo nghĩ nhiều, dễ đau dạ dày và mệt mỏi kéo dài; cho đi quá mức, đến lúc mình cần thì ít người đáp lại.',
    nghe: 'nhân sự, giáo dục, y tế – chăm sóc, dịch vụ, quản lý vận hành, nông nghiệp – thực phẩm',
    loiKhuyen: ['Lo sức khỏe, thời gian và tiền của mình trước.', 'Đặt hạn chót cho mỗi quyết định.', 'Chọn cộng sự quyết đoán để bù cho nhau.'] },
  { ten: 'Canh Kim', hinh: 'thanh kiếm, sắt thép',
    tomTat: 'Bạn sinh vào ngày Canh – hình tượng thanh kiếm, khối sắt thép. Người Canh thường quyết đoán, dũng cảm, trọng nghĩa khí – và sắc đến mức dễ làm người khác đau.',
    banChat: 'Bạn thuộc mẫu người thẳng thắn, yêu ghét rõ ràng, không lùi trước khó khăn. Mặt tốt: như thép qua lửa thành kiếm, bạn mạnh lên qua thử thách và dám đứng ra khi người khác lùi. Mặt xấu: bạn nóng, nói thẳng đến mất lòng, khó nghe ý trái chiều, nên hay gây thù ở chỗ làm và va chạm trong nhà.',
    manh: 'Kiên cường, kỷ luật, trung thành; dám đứng ra bảo vệ lẽ phải và người yếu; chịu được gian khổ.',
    luuY: 'Nói thẳng đến mức làm tổn thương, dễ bị cô lập trong tập thể; nóng tính, quyết vội lúc giận rồi phải trả giá; khó chấp nhận ý kiến trái chiều nên hay mất người giỏi bên cạnh.',
    nghe: 'kỹ thuật – cơ khí, quân đội – công an, luật, quản lý, thể thao, phẫu thuật, tài chính',
    loiKhuyen: ['Nói điều đúng nhưng chọn lời và chọn lúc.', 'Không phải chuyện gì cũng cần thắng.', 'Dùng sự cứng rắn để dẫn dắt, không để áp đặt.'] },
  { ten: 'Tân Kim', hinh: 'trang sức, kim loại quý',
    tomTat: 'Bạn sinh vào ngày Tân – hình tượng món trang sức, kim loại quý đã được mài giũa. Người Tân thường tinh tế, có thẩm mỹ, sắc sảo – và rất nhạy với lời chê.',
    banChat: 'Bạn thuộc mẫu người chú trọng chi tiết, hình ảnh và chất lượng. Mặt tốt: bạn tinh mắt, ăn nói có duyên, làm gì cũng chỉn chu. Mặt xấu: bạn cầu toàn, tự tạo áp lực, dễ tự ái, và có lúc mải lo vẻ ngoài, chi tiết nhỏ mà bỏ lỡ việc lớn hoặc tiêu tốn tiền cho hình thức.',
    manh: 'Tỉ mỉ, chính xác, có gu thẩm mỹ; nhanh trí, giỏi phân tích; có khí chất thu hút.',
    luuY: 'Cầu toàn đến mức chậm việc và căng thẳng kéo dài; nhạy cảm với lời chê, dễ tự ái và giận lâu; mải chi tiết mà quên bức tranh lớn, có khi tốn kém vì hình thức.',
    nghe: 'tài chính – ngân hàng, thiết kế, làm đẹp – thời trang, trang sức, phân tích, luật, công nghệ chính xác',
    loiKhuyen: ['Việc nhỏ làm "đủ tốt" rồi chuyển sang việc khác.', 'Nghe góp ý, lấy phần dùng được.', 'Đặt hạn mức chi cho hình thức.'] },
  { ten: 'Nhâm Thủy', hinh: 'sông lớn, biển cả',
    tomTat: 'Bạn sinh vào ngày Nhâm – hình tượng dòng sông lớn, biển cả. Người Nhâm thường thông minh, linh hoạt, tầm nhìn rộng – và khó giữ một hướng lâu.',
    banChat: 'Bạn thuộc mẫu người luôn chuyển động, ham khám phá, thích tự do, ghét gò bó. Mặt tốt: bạn phản ứng nhanh, giỏi xoay xở, nhìn ra cơ hội trước người khác. Mặt xấu: bạn dễ phân tán, bỏ dở giữa chừng, đổi hướng nhanh làm người cùng làm mất niềm tin; nước không có bờ thì tràn, tiền và sức đều dễ trôi đi.',
    manh: 'Nhanh trí, giao tiếp tốt, nhiều ý tưởng; thích nghi nhanh; có óc chiến lược và kinh doanh.',
    luuY: 'Phân tán, thiếu tập trung, nhiều việc dở dang; khó chịu với khuôn phép nên hay va chạm với tổ chức; đổi quá nhanh làm người khác theo không kịp, dễ mất cộng sự và mất tiền vì quyết vội.',
    nghe: 'kinh doanh – thương mại, logistics – xuất nhập khẩu, truyền thông, du lịch, tư vấn chiến lược, công nghệ',
    loiKhuyen: ['Có kế hoạch, thời hạn và người theo dõi tiến độ.', 'Xong một việc rồi mới mở việc mới.', 'Mỗi ngày dành một khoảng yên tĩnh để nghĩ.'] },
  { ten: 'Quý Thủy', hinh: 'mưa, sương',
    tomTat: 'Bạn sinh vào ngày Quý – hình tượng hạt mưa, màn sương thấm vào vạn vật. Người Quý thường trực giác tốt, sâu sắc, dịu dàng – và dễ thấm cả điều xấu từ người xung quanh.',
    banChat: 'Bạn thuộc mẫu người hướng nội, quan sát nhiều hơn nói, hiểu tâm lý người khác rất nhanh. Mặt tốt: bạn làm âm thầm mà bền, có hoài bão lớn giữ trong lòng. Mặt xấu: bạn dễ lo âu, thiếu tự tin, chờ đợi quá lâu nên lỡ thời cơ; vì kín đáo mà người khác khó hiểu và khó giúp bạn.',
    manh: 'Trực giác nhạy, tinh tế; nói năng nhẹ nhàng, dễ được yêu mến; kiên nhẫn, biết chờ thời.',
    luuY: 'Lo âu, thiếu tự tin, hay nghĩ đến điều xấu nhất; giữ bí mật quá mức nên dễ bị hiểu lầm và cô đơn; thụ động chờ "thời điểm hoàn hảo" mà để cơ hội qua tay.',
    nghe: 'nghiên cứu, tư vấn – tâm lý, y dược, nghệ thuật – viết lách, công việc phía sau hậu trường, chiến lược',
    loiKhuyen: ['Có linh cảm thì thử bằng một bước nhỏ ngay.', 'Đặt hạn cho việc chờ đợi.', 'Tránh xa người hay than thở, tiêu cực.'] }
];
var DH_BT_THE = {
  vuong: 'Mặt tốt: năng lượng bản thân dồi dào – bạn tự lập, gánh được việc lớn, ít phải dựa vào ai. Mặt xấu: sức mạnh dư không có chỗ thoát thì thành cố chấp, nóng nảy, hay tranh phần hơn, dễ va chạm với người cùng làm và người thân. Gợi ý: dồn sức vào công việc, sáng tạo và việc giúp người.',
    trungVuong: 'Mặt tốt: năng lượng bản thân khá cân bằng, hơi nghiêng về mạnh – bạn vừa tự chủ vừa biết phối hợp, gánh được trách nhiệm. Mặt xấu: khi thuận lợi kéo dài, bạn dễ chủ quan, ôm thêm việc và đánh giá thấp rủi ro.',
    trungNhuoc: 'Mặt tốt: năng lượng bản thân khá cân bằng, hơi nghiêng về mềm – bạn biết lắng nghe, dễ hòa hợp. Mặt xấu: bạn thiếu chủ động, dễ bị người mạnh hơn lấn át, và môi trường bất ổn làm bạn đuối nhanh hơn người khác.',
    nhuoc: 'Mặt tốt: bạn tiếp thu tốt, làm việc hiệu quả khi có người nâng đỡ và môi trường ổn định. Mặt xấu: năng lượng bản thân mỏng – ôm nhiều việc là kiệt sức, gặp áp lực lớn dễ chùn bước, và chọn sai người đồng hành thì tụt lùi rõ. Gợi ý: chọn kỹ nơi làm và người cùng đi.' };
var DH_BT_HANH = {
  'Mộc': { ban: 'sự phát triển, học hỏi và lòng nhân hậu', lam: 'trồng cây, đọc sách, học kỹ năng mới, đi bộ nơi nhiều cây xanh; làm việc có tính gieo trồng – phát triển lâu dài' },
  'Hỏa': { ban: 'nhiệt huyết, sự giao tiếp và ánh sáng', lam: 'vận động buổi sáng, đón nắng, giao lưu, giữ không gian sáng sủa; làm việc cần truyền cảm hứng, trình bày, kết nối' },
  'Thổ': { ban: 'sự ổn định, tin cậy và nền tảng vững chắc', lam: 'sinh hoạt điều độ, tích lũy đều đặn, giữ nhà cửa ngăn nắp, gần gũi thiên nhiên đất đai; làm việc cần sự bền bỉ, quản lý' },
  'Kim': { ban: 'kỷ luật, sự rõ ràng và quyết đoán', lam: 'lập kế hoạch, làm theo quy trình, chơi thể thao có luật, giữ lời hứa, giữ không gian gọn gàng; làm việc cần chính xác, nguyên tắc' },
  'Thủy': { ban: 'trí tuệ, sự linh hoạt và giao lưu', lam: 'đọc – suy ngẫm, bơi lội, đi du lịch gần sông biển, mở rộng quan hệ; làm việc cần tư duy, di chuyển, trao đổi thông tin' } };
var DH_BT_TT = {
  'Tỷ Kiếp': { ten: 'tự lập – anh em bạn bè', manh: 'Bạn có tinh thần tự lập cao, ý chí mạnh và nhiều bạn bè, anh em cùng chí hướng.', luuY: 'Hay cạnh tranh, khó chịu khi người khác hơn mình; ngại nhờ vả; tiền bạc dễ hao vì bạn bè, anh em – cho vay khó đòi, hùn hạp dễ mất cả tiền lẫn tình.' },
  'Thực Thương': { ten: 'sáng tạo – thể hiện', manh: 'Bạn có tài năng thể hiện: ăn nói, sáng tạo, nghệ thuật, nghĩ ra cách làm mới.', luuY: 'Nói thẳng, thích phản biện, coi thường khuôn phép – dễ mất lòng cấp trên, bị đánh giá là khó bảo và mất cơ hội thăng tiến.' },
  'Tài': { ten: 'kiếm tiền – thực tế', manh: 'Bạn có đầu óc thực tế, nhạy với cơ hội và biết quản lý tiền bạc, tài sản.', luuY: 'Dễ bị cuốn vào chuyện tiền, làm quá sức vì tiền; tính toán được mất quá kỹ khiến người thân thấy lạnh nhạt, sức khỏe hao mòn theo năm tháng.' },
  'Quan Sát': { ten: 'kỷ luật – trách nhiệm', manh: 'Bạn có tinh thần trách nhiệm, kỷ luật và khả năng chịu áp lực, hợp với vai trò có cấp bậc, quản lý.', luuY: 'Tự gây áp lực, sợ bị đánh giá; sống theo kỳ vọng của người khác nhiều hơn mong muốn của mình, dễ căng thẳng, mất ngủ.' },
  'Ấn': { ten: 'học hỏi – được che chở', manh: 'Bạn ham học, có chiều sâu, thường được người lớn, thầy cô, người có vị thế nâng đỡ.', luuY: 'Ngại hành động, nghĩ nhiều làm ít; quen được che chở nên khi phải tự đứng thì lúng túng, chậm hơn người cùng xuất phát.' } };
var DH_BT_TT_NHOM = { 'Tỷ Kiên': 'Tỷ Kiếp', 'Kiếp Tài': 'Tỷ Kiếp', 'Thực Thần': 'Thực Thương', 'Thương Quan': 'Thực Thương', 'Chính Tài': 'Tài', 'Thiên Tài': 'Tài', 'Chính Quan': 'Quan Sát', 'Thất Sát': 'Quan Sát', 'Chính Ấn': 'Ấn', 'Thiên Ấn': 'Ấn' };
/** 12 lĩnh vực theo Tứ Trụ – văn tầng 2 theo 5 mức (rất thuận → cần đặc biệt lưu tâm); mỗi câu nêu cả mặt tốt lẫn mặt xấu */
var DH_BT_LV = {
  'Mệnh': ['Bản mệnh', ['Bản thân vững, có nhiều thuận lợi trời cho. Mặt trái: dễ chủ quan, ít chịu khổ luyện nên có lúc hụt hơi khi gặp đối thủ thật sự.', 'Bản thân khá vững, có nền để phát triển. Mặt trái: thuận lợi vừa đủ nên dễ dừng ở mức "khá" nếu không tự đẩy mình.', 'Bản thân ở mức cân bằng – có điểm mạnh nhưng không nổi trội; thành hay bại phụ thuộc nhiều vào nỗ lực và lựa chọn của bạn.', 'Bạn có xu hướng gặp nhiều thử thách hơn người khác: dễ mệt, dễ chùn bước, công sức bỏ ra nhiều mà kết quả chậm. Mặt tốt: mỗi lần vượt qua là một lần lì và vững hơn. Gợi ý: chia việc lớn thành từng bước nhỏ.', 'Bản thân yếu thế: sức khỏe, tinh thần và vận may đều mỏng, gặp áp lực lớn dễ gục. Mặt tốt: bạn biết khiêm nhường, dễ học hỏi và dễ nhận giúp đỡ. Gợi ý: ưu tiên sức khỏe và chọn môi trường ổn định.']],
  'Phụ Mẫu': ['Cha mẹ – bề trên', ['Lá số gợi ý cha mẹ, người lớn là chỗ dựa lớn, nâng đỡ bạn nhiều. Mặt trái: được lo nhiều nên có thể chậm tự lập hoặc chịu sự sắp đặt của cha mẹ – bạn hãy đối chiếu với trải nghiệm thật.', 'Lá số gợi ý bạn được cha mẹ, người lớn quan tâm và giúp vừa phải; có lúc vẫn phải tự lo – bạn hãy tự đối chiếu.', 'Lá số gợi ý quan hệ với cha mẹ ở mức bình thường: có gần gũi nhưng cũng có giai đoạn xa cách, ít chia sẻ – bạn hãy tự đối chiếu.', 'Lá số gợi ý cha mẹ có giai đoạn nhiều lo toan, hoặc hai bên vênh quan điểm, dễ to tiếng và ít được nâng đỡ khi cần – bạn hãy tự đối chiếu. Mặt tốt: bạn sớm biết tự xoay xở.', 'Lá số gợi ý bạn ít được nhờ cha mẹ, phải tự lập sớm; quan hệ với bề trên dễ căng hoặc có khoảng trống tình cảm – bạn hãy đối chiếu với trải nghiệm thật. Mặt tốt: bạn cứng cáp và tự chủ hơn người cùng tuổi.']],
  'Huynh Đệ': ['Anh chị em – bạn bè', ['Lá số gợi ý anh chị em, bạn bè gắn bó, hay giúp nhau. Mặt trái: tình thân sâu nên chuyện của anh em dễ kéo bạn vào, kể cả chuyện tiền – bạn hãy đối chiếu với thực tế.', 'Lá số gợi ý anh em, bạn bè qua lại hòa thuận; giúp nhau vừa phải, không nên kỳ vọng quá nhiều – bạn hãy đối chiếu với thực tế.', 'Lá số gợi ý anh em mỗi người một hướng: ít xung khắc nhưng cũng ít nhờ cậy được nhau.', 'Lá số gợi ý dễ có cạnh tranh, hiểu lầm với anh em, bạn bè; chuyện tiền bạc chung dễ làm sứt mẻ tình cảm. Mặt tốt: bạn học được cách tự lực và rõ ràng. Gợi ý: tiền nong với người thân luôn có giấy tờ.', 'Lá số gợi ý anh em, bạn bè khó nhờ cậy, có thể xa cách hoặc va chạm kéo dài; dễ bị thiệt khi hùn hạp. Mặt tốt: những người bạn chọn kỹ thường rất đáng tin.']],
  'Phu Thê': ['Hôn nhân', ['Bạn có xu hướng tìm được sự gắn bó ấm áp; người đồng hành dễ là nguồn vui và trợ lực lớn. Mặt trái: dựa vào nhau nhiều nên khi có biến cố, bạn dễ hụt hẫng hơn người khác.', 'Chuyện tình cảm khá thuận, mối quan hệ có nền để bền lâu. Mặt trái: vẫn có giai đoạn nhạt hoặc bất đồng nếu cả hai lơ là.', 'Chuyện tình cảm ở mức bình thường – có ngọt có mặn, có những lần căng thẳng thật; bền hay không phụ thuộc vào cả hai.', 'Bạn có xu hướng muộn duyên hoặc trải qua vài mối tình dang dở trước khi gặp người hợp; trong hôn nhân dễ có lúc lạnh nhạt, hiểu lầm kéo dài. Mặt tốt: khi đã chọn được người, bạn trân trọng hơn. Gợi ý: nói rõ mong muốn từ đầu.', 'Đường tình cảm nhiều trắc trở: dễ chọn nhầm người, hôn nhân có giai đoạn căng thẳng nặng, có thể chia xa hoặc cô đơn kéo dài. Mặt tốt: bạn sống độc lập được và hiểu rõ mình cần gì. Gợi ý: không vội cưới khi đang ở giai đoạn rối.']],
  'Tử Tức': ['Con cái', ['Bạn có xu hướng gần gũi trẻ nhỏ, quan hệ với con dễ mang lại nhiều niềm vui. Mặt trái: thương con nhiều dễ thành nuông chiều, bao bọc quá mức.', 'Quan hệ cha mẹ – con có xu hướng gắn bó, dễ hiểu nhau. Mặt trái: vẫn có giai đoạn con xa cách, nhất là tuổi lớn.', 'Chuyện con cái ở mức bình thường: có niềm vui, có nỗi lo, có lúc hai thế hệ không hiểu nhau.', 'Chuyện con cái có xu hướng vất vả: có thể muộn con, con khó dạy hoặc hai bên hay bất đồng; tốn nhiều công sức và tiền bạc. Mặt tốt: sự kiên nhẫn bỏ ra thường được đền đáp về sau. Gợi ý: lắng nghe con trước khi răn dạy.', 'Chuyện con cái nhiều lo toan: dễ muộn hoặc ít con, con có giai đoạn ốm yếu hay xa cha mẹ, quan hệ có khoảng cách. Mặt tốt: bạn trân trọng từng khoảnh khắc bên con. Gợi ý: chuyện sinh nở, sức khỏe của con hãy hỏi bác sĩ.']],
  'Tài Bạch': ['Tiền bạc', ['Tiền bạc hanh thông, tích lũy tốt. Mặt trái: có tiền dễ chủ quan, đầu tư lớn khi chưa tìm hiểu kỹ hoặc bị người khác nhờ vả, vay mượn.', 'Tài chính khá ổn, kiếm được và giữ được. Mặt trái: khó giàu nhanh, có những khoản chi lớn bất ngờ làm vơi quỹ.', 'Tiền bạc ở mức đủ dùng – không túng nhưng cũng khó dư nhiều; tăng hay giảm tùy cách bạn quản lý.', 'Bạn có xu hướng tiền vào nhanh ra cũng nhanh, dễ hụt khi có việc gấp và dễ mất tiền vì đầu tư theo phong trào. Mặt tốt: bạn kiếm lại được khá nhanh. Gợi ý: lập quỹ dự phòng không được động tới.', 'Tài chính bấp bênh: dễ nợ nần, mất tiền vì vay mượn, bảo lãnh hoặc tin người; có giai đoạn túng thiếu thật sự. Mặt tốt: bạn biết sống tiết kiệm khi cần. Gợi ý: không vay lớn, không đứng ra bảo lãnh.']],
  'Tật Ách': ['Sức khỏe', ['Nền thể chất có xu hướng vững, ít ốm vặt. Mặt trái: khỏe nên dễ chủ quan, làm quá sức, bỏ qua dấu hiệu sớm của bệnh.', 'Sức khỏe khá. Mặt trái: vẫn có những điểm yếu nhỏ dễ thành bệnh mạn nếu sinh hoạt thất thường.', 'Sức khỏe ở mức vừa – không yếu nhưng có lúc mệt mỏi kéo dài; nên giữ nếp sinh hoạt điều độ và khám định kỳ.', 'Sức khỏe là điểm yếu: dễ ốm lặt vặt, mệt mỏi, có thể có bệnh kéo dài nếu không chăm sóc. Mặt tốt: bạn biết lắng nghe cơ thể sớm hơn người khác. Gợi ý: khám định kỳ, có gì bất thường hỏi bác sĩ.', 'Sức khỏe cần được ưu tiên hàng đầu: thể trạng mỏng, dễ suy nhược khi làm quá sức, bệnh dễ dây dưa. Mặt tốt: bạn có ý thức giữ gìn từ sớm. Gợi ý: nghỉ ngơi đủ và theo lời khuyên của bác sĩ.']],
  'Thiên Di': ['Ra ngoài – đi xa', ['Ra ngoài gặp nhiều may mắn, đi xa phát triển tốt. Mặt trái: mải bên ngoài dễ xa gia đình, gốc gác ở nhà bị bỏ trống.', 'Đi xa, môi trường mới khá thuận. Mặt trái: chi phí và sức lực cho việc di chuyển không nhỏ.', 'Đi xa hay ở gần đều được: không có thuận lợi lớn, cũng không có trở ngại đáng kể.', 'Ra ngoài dễ gặp trục trặc: lạ nước lạ cái, khó hòa nhập, có thể bị người ngoài chèn ép hoặc thiệt về tiền khi đi xa. Mặt tốt: mỗi lần như vậy bạn lại thạo đời hơn. Gợi ý: chuẩn bị kỹ và có người quen dẫn đường.', 'Đi xa, đổi môi trường nhiều rủi ro: dễ thất bại khi lập nghiệp nơi lạ, gặp người xấu hoặc mất mát trên đường. Mặt tốt: ở gần nơi quen, bạn lại phát huy được. Gợi ý: ổn định gốc rễ trước rồi mới mở rộng.']],
  'Nô Bộc': ['Bạn bè – đồng nghiệp – cộng sự', ['Có nhiều người giúp, cộng sự đáng tin. Mặt trái: quen dựa vào người khác nên khi họ rời đi, việc dễ chững lại.', 'Quan hệ đồng nghiệp, cấp dưới khá tốt. Mặt trái: vẫn có người chỉ đến khi có lợi.', 'Các mối quan hệ xã hội ở mức bình thường: có người tốt, có người chỉ lợi dụng; bạn nhận lại tương xứng với những gì mình vun đắp.', 'Bạn có xu hướng tin người nhanh nên hay bị phụ lòng: cộng sự bỏ ngang, bạn bè vay không trả, cấp dưới không hết lòng. Mặt tốt: bạn rộng lượng nên vẫn có người quý. Gợi ý: thỏa thuận quyền lợi rõ từ đầu.', 'Dễ gặp người xấu trong hợp tác: bị lừa, bị phản, bị lấy công hoặc lấy khách; bạn bè khó nhờ lúc cần. Mặt tốt: bạn học được cách tự làm chủ phần việc của mình. Gợi ý: giữ phần việc chính trong tay mình.']],
  'Quan Lộc': ['Sự nghiệp', ['Sự nghiệp có tiềm năng lớn, dễ thăng tiến hoặc tự làm chủ. Mặt trái: áp lực và trách nhiệm cũng lớn, dễ lấn hết thời gian cho gia đình và sức khỏe.', 'Công việc khá thuận, có cơ hội phát triển. Mặt trái: phải cạnh tranh thật sự mới giữ được chỗ.', 'Sự nghiệp ổn định ở mức vừa – không nhanh, không đột phá; thăng tiến chủ yếu nhờ kiên trì.', 'Công việc nhiều áp lực, dễ thay đổi, có giai đoạn thất nghiệp hoặc làm trái nghề. Mặt tốt: bạn tích được nhiều kỹ năng khác nhau. Gợi ý: chọn một hướng và tích chuyên môn sâu.', 'Sự nghiệp nhiều trắc trở: hay đi đường vòng, dễ bị chèn ép, mất việc hoặc làm ăn thua lỗ trước khi ổn định. Mặt tốt: thành quả muộn nhưng là của chính bạn. Gợi ý: lấy kỹ năng làm vốn, đi chậm mà chắc.']],
  'Điền Trạch': ['Nhà cửa – tài sản', ['Có phúc về nhà cửa, đất đai, dễ sở hữu tài sản. Mặt trái: tài sản lớn kéo theo chuyện giấy tờ, chia chác, dễ va chạm trong gia đình.', 'Nhà cửa, tài sản khá thuận. Mặt trái: phải gánh nợ hoặc tích lũy lâu mới có được chỗ ở như ý.', 'Nhà cửa đủ ở, tài sản tích lũy dần theo thời gian; không dư dả nhưng cũng không thiếu.', 'Nhà cửa dễ phải chuyển đổi nhiều lần, có thể mua bán lỗ hoặc vướng giấy tờ nhà đất. Mặt tốt: bạn linh hoạt, không bị giam vào một chỗ. Gợi ý: cân nhắc kỹ trước khi mua bán lớn.', 'Tài sản cố định khó giữ: dễ mất nhà đất vì nợ, tranh chấp hoặc đầu tư sai, có giai đoạn ở nhờ, ở thuê lâu. Mặt tốt: bạn không quá bám vào của cải. Gợi ý: an cư vừa sức trước rồi mới đầu tư.']],
  'Phúc Đức': ['Phúc đức – đời sống tinh thần', ['Phúc dày, tinh thần an ổn, hay gặp người tốt. Mặt trái: quen được che chở nên dễ ỷ lại, ít tự rèn.', 'Đời sống tinh thần khá tốt, biết đủ và vui sống. Mặt trái: có lúc an phận quá mà bỏ lỡ cơ hội.', 'Phúc đức bình thường – có lúc được giúp, có lúc phải tự gánh; tinh thần có giai đoạn trĩu nặng.', 'Bạn có xu hướng hay lo nghĩ, bất an, ít được che chở từ gia đình, dòng họ khi gặp khó. Mặt tốt: bạn tự xây được điểm tựa cho mình. Gợi ý: giữ thói quen tĩnh tâm mỗi ngày.', 'Đời sống tinh thần nặng nề: dễ buồn, cô đơn, có giai đoạn mất phương hướng; gặp khó thường ít người giúp. Mặt tốt: bạn có chiều sâu và biết thương người cùng cảnh. Gợi ý: tìm điểm tựa ở gia đình, cộng đồng hoặc người có chuyên môn tâm lý.']]
};
var DH_BT_LV_IDX = { rat_tot: 0, tot: 1, trung_binh: 2, kho_khan: 3, rat_kho: 4 };

function dhThapThanNhom_(bt) {
  var w = { 'Tỷ Kiếp': 0, 'Thực Thương': 0, 'Tài': 0, 'Quan Sát': 0, 'Ấn': 0 };
  bt.pillars.forEach(function (p, i) {
    if (i !== 2 && DH_BT_TT_NHOM[p.thapThan]) w[DH_BT_TT_NHOM[p.thapThan]] += 1;
    (p.tangCan || []).forEach(function (t, j) { var g = DH_BT_TT_NHOM[t.thapThan]; if (g) w[g] += j === 0 ? 0.6 : 0.3; });
  });
  return Object.keys(w).map(function (k) { return { k: k, v: Math.round(w[k] * 10) / 10 }; }).sort(function (a, b) { return b.v - a.v; });
}
function dhBatTu_(bt, btct) {
  var nc = DH_BT_NHAT_CHU[bt.nhatChuCan], khoi = [], facts = [], he = 'Bat Tu';
  var cuong = String(bt.cuong || ''), the = /nhược|yếu/i.test(cuong) ? (/trung hòa/i.test(cuong) ? 'trungNhuoc' : 'nhuoc') : /trung hòa/i.test(cuong) ? 'trungVuong' : 'vuong';
  khoi.push({ ten: 'Bản mệnh theo Bát Tự', doan: [
    dhDoan_('Tóm tắt', nc.tomTat),
    dhDoan_('Bản chất con người bạn', nc.banChat),
    dhDoan_('Điểm mạnh nổi bật', nc.manh),
    dhDoan_('Điểm cần lưu ý', nc.luuY),
    dhDoan_('Sức mạnh bản thân', DH_BT_THE[the]),
    dhDoan_('Công việc hợp với bản chất', 'Những lĩnh vực hợp với khí chất ' + nc.hinh + ': ' + nc.nghe + '.'),
    dhDoan_('Lời khuyên cụ thể', '', nc.loiKhuyen.slice())
  ] });
  facts.push(taoFact_(he, 'Menh', 'tinh_cach', 'manh', nc.manh, 1.4, { nguon: 'Nhật chủ ' + nc.ten, tags: ['tinh_cach'] }));
  facts.push(taoFact_(he, 'Menh', 'tinh_cach', 'yeu', nc.luuY, 1.0, { nguon: 'Nhật chủ ' + nc.ten, tags: ['tinh_cach'] }));
  facts.push(taoFact_(he, 'Quan Loc', 'cong_danh', 'trung', 'Công việc hợp bản chất: ' + nc.nghe + '.', 1.0, { nguon: 'Nhật chủ ' + nc.ten, tags: ['nghe'] }));
  // Năng lượng nổi bật + ngũ hành cần bổ sung
  var tt = dhThapThanNhom_(bt), top = tt.filter(function (x) { return x.v >= 1.2; }).slice(0, 2);
  if (!top.length) top = tt.slice(0, 1);
  var pt = bt.phanTram || {}, hs = Object.keys(pt).sort(function (a, b) { return pt[b] - pt[a]; }), thieu = hs.filter(function (h) { return pt[h] < 8; });
  var dung = bt.goiY.dung, hy = bt.goiY.hy, ky = bt.goiY.ky, info = (typeof HANH_INFO === 'object' && HANH_INFO[dung]) || {};
  var nl = [dhDoan_('Năng lượng nổi bật trong lá số', top.map(function (x) { return DH_BT_TT[x.k].manh; }).join(' ')),
    dhDoan_('Mặt trái cần để ý', top.map(function (x) { return DH_BT_TT[x.k].luuY; }).join(' ')),
    dhDoan_('Cán cân ngũ hành', 'Trong lá số, hành ' + hs[0] + ' mạnh nhất (' + pt[hs[0]] + '%), hành ' + hs[hs.length - 1] + ' yếu nhất (' + pt[hs[hs.length - 1]] + '%).' +
      (thieu.length ? ' Hành ' + thieu.join(', ') + ' gần như vắng mặt – những gì thuộc về ' + thieu.map(function (h) { return DH_BT_HANH[h].ban; }).join('; ') + ' là phần bạn thiếu tự nhiên, dễ thành điểm yếu khi gặp áp lực.' : ' Các hành khá đầy đủ – lợi thế về sự cân bằng, nhưng cũng ít có một thế mạnh thật sự nổi trội.')),
    dhDoan_('Yếu tố giúp bạn cân bằng (dụng thần)', 'Hành ' + dung + ' – tượng trưng cho ' + DH_BT_HANH[dung].ban + ' – là "vị thuốc" lá số của bạn cần nhất. Cách bổ sung trong đời sống: ' + DH_BT_HANH[dung].lam + '.' +
      (info.mau ? ' Màu hợp: ' + info.mau + '.' : '') + (info.huong ? ' Hướng tốt: ' + info.huong + '.' : '') + (hy.length > 1 ? ' Ngoài ra hành ' + hy.filter(function (h) { return h !== dung; }).join(', ') + ' cũng hỗ trợ bạn.' : '')),
    dhDoan_('Điều nên tiết chế', ky.length ? 'Hành ' + ky.join(', ') + ' là phần năng lượng không có lợi cho lá số: gặp nhiều (qua môi trường, giai đoạn vận, thói quen) thì đẩy bạn đi quá đà, dễ mất cân bằng về tính khí và sức khỏe. Gợi ý: những việc như ' + ky.map(function (h) { return DH_BT_HANH[h].lam.split(';')[0]; }).join('; ') + ' chỉ nên ở mức vừa phải.' : 'Lá số không có hành nào quá lấn át.')];
  // Khí hậu của lá số (điều hậu theo Cùng Thông Bảo Giám): mùa sinh cần thêm hành nào
  var DHB = bt.phanTich && bt.phanTich.dungThan && bt.phanTich.dungThan.dieuHauBang;
  if (DHB && DHB.chu && DH_BT_HANH[DHB.chu.hanh]) {
    var mc = bt.pillars[1].chi, mua = [11, 0, 1].indexOf(mc) >= 0 ? 'mùa đông' : [2, 3, 4].indexOf(mc) >= 0 ? 'mùa xuân' : [5, 6, 7].indexOf(mc) >= 0 ? 'mùa hè' : 'mùa thu';
    var hc = DHB.chu.hanh, coMat = DHB.chu.thau.length || DHB.chu.tang.length, coRoi = coMat && pt[hc] >= 8;   // cùng ngưỡng 8% với "Cán cân ngũ hành"
    nl.push(dhDoan_('Khí hậu của lá số', 'Bạn sinh vào ' + mua + '. Sách cổ xem lá số như một khu vườn cần đúng "thời tiết": với người sinh như bạn, năng lượng hành ' + hc + ' – tượng trưng cho ' + DH_BT_HANH[hc].ban + ' – giúp lá số được điều hòa. ' +
      (coRoi ? 'Lá số của bạn đã có sẵn yếu tố này – một lợi thế về sự điều hòa; mặt trái là dễ chủ quan với nhịp sống của mình.' : (coMat ? 'Lá số của bạn có yếu tố này nhưng còn mỏng: thời tiết lá số chưa điều hòa, tính khí và sức khỏe dễ lệch theo mùa sinh. Gợi ý bồi thêm: ' : 'Lá số của bạn thiếu yếu tố này: thời tiết lá số lệch hẳn về một phía, tính khí và sức khỏe dễ mất cân bằng. Gợi ý bổ sung: ') + DH_BT_HANH[hc].lam + '.') + (hc === dung ? '' : ' Đây là điều bổ trợ, đi cùng với yếu tố cân bằng chính ở trên.') + (ky.indexOf(hc) >= 0 ? ' Hành ' + hc + ' cũng nằm trong phần "nên tiết chế" ở trên: lá số cần một ít để điều hòa, nhưng không nên dùng quá nhiều.' : '')));
  }
  khoi.push({ ten: 'Năng lượng & cách cân bằng', doan: nl });
  top.forEach(function (x) { facts.push(taoFact_(he, 'Menh', 'tinh_cach', 'manh', DH_BT_TT[x.k].manh, 1.0, { nguon: 'Thập thần ' + x.k })); });
  facts.push(taoFact_(he, 'ALL', 'suc_khoe', thieu.length ? 'yeu' : 'trung', thieu.length ? 'Hành ' + thieu.join(', ') + ' yếu – cơ thể và tinh thần dễ lệch về một phía.' : 'Ngũ hành khá cân bằng.', 0.8, { nguon: 'Ngũ hành' }));
  // 12 lĩnh vực
  var lv = (btct && btct.linhVuc) || [], dong = [];
  lv.forEach(function (x) {
    var D = DH_BT_LV[x.key]; if (!D) return;
    var d10 = dhD10_(x.diem), muc = dhMuc_(d10), txt = D[1][DH_BT_LV_IDX[muc]];
    dong.push(D[0] + ' (' + String(d10).replace('.', ',') + '/10): ' + txt);
    facts.push(taoFact_(he, factLinhVucTuCung_(x.key), factNhomTuCung_(x.key), dhLoai_(d10), txt, 1.1, { nguon: 'Tứ Trụ – ' + x.ten, tags: ['linh_vuc'] }));
  });
  if (dong.length) khoi.push({ ten: '12 lĩnh vực cuộc sống theo Tứ Trụ', doan: [dhDoan_('Tổng quan', 'Mỗi lĩnh vực được chấm từ cung vị trong tứ trụ và "ngôi sao đại diện" của lĩnh vực đó, quy về thang 10. Đây là xu hướng – không phải định mệnh cố định.'), dhDoan_('Từng lĩnh vực', '', dong)] });
  return { he: 'Bát Tự', khoi: khoi, facts: facts };
}

/* ============================================================
 *  2. CHIÊM TINH
 * ============================================================ */
var DH_CT_SUN = [
  'Bạn mang tinh thần người tiên phong: thích bắt đầu, dám nghĩ dám làm, thẳng thắn và nhiều năng lượng; mặt trái là nóng vội, hay bỏ dở giữa chừng và dễ va chạm vì nói thẳng.',
  'Bạn mang tinh thần người xây dựng: kiên nhẫn, thực tế, yêu sự ổn định và những giá trị bền lâu; mặt trái là chậm đổi, cố chấp và bám chặt vào vật chất, thói quen cũ.',
  'Bạn mang tinh thần người đưa tin: tò mò, nhanh trí, giỏi giao tiếp và thích học nhiều thứ; mặt trái là cả thèm chóng chán, biết rộng mà không sâu, nói nhiều dễ sinh chuyện.',
  'Bạn mang tinh thần người che chở: giàu tình cảm, gắn bó gia đình, luôn muốn bảo vệ người thân; mặt trái là dễ tủi thân, bám víu quá khứ và kiểm soát người mình thương.',
  'Bạn mang tinh thần người tỏa sáng: hào phóng, tự tin, sáng tạo và cần được ghi nhận; mặt trái là sĩ diện, thích được chiều và tự ái khi bị xem nhẹ.',
  'Bạn mang tinh thần người thợ cả: tỉ mỉ, phân tích giỏi, thích giúp ích và làm mọi thứ tốt hơn; mặt trái là hay bắt lỗi, cầu toàn, tự làm mình căng thẳng.',
  'Bạn mang tinh thần nhà ngoại giao: duyên dáng, công bằng, yêu cái đẹp và sự hài hòa; mặt trái là thiếu quyết đoán, sợ mất lòng nên hay chiều người mà thiệt mình.',
  'Bạn mang tinh thần người chuyển hóa: sâu sắc, mãnh liệt, trung thành và có ý chí mạnh; mặt trái là đa nghi, ghen, giữ thù lâu và muốn kiểm soát.',
  'Bạn mang tinh thần nhà thám hiểm: lạc quan, yêu tự do, thích đi xa và tìm ý nghĩa cuộc sống; mặt trái là hứa nhiều làm ít, ngại cam kết và tiêu xài thiếu tính toán.',
  'Bạn mang tinh thần người leo núi: kỷ luật, có trách nhiệm, kiên trì với mục tiêu dài hạn; mặt trái là khô khan, quá nghiêm với mình và người khác, dễ coi công việc hơn tình cảm.',
  'Bạn mang tinh thần nhà cải cách: độc lập, khác biệt, nghĩ cho cộng đồng và tương lai; mặt trái là xa cách, bướng, khó gần gũi trong chuyện tình cảm riêng.',
  'Bạn mang tinh thần người nghệ sĩ: giàu trí tưởng tượng, thấu cảm và nhạy cảm với cảm xúc người khác; mặt trái là dễ trốn tránh thực tế, thiếu ranh giới và dễ bị lợi dụng.'];
var DH_CT_MOON = [
  'Cảm xúc của bạn đến nhanh và đi nhanh; bạn nói thẳng điều mình cảm thấy và cần được tự do hành động để thấy an toàn. Mặt trái: nóng giận bộc phát, dễ nói lời làm tổn thương rồi mới hối.',
  'Bạn cần sự ổn định, quen thuộc và thoải mái vật chất để thấy an lòng; cảm xúc bền. Mặt trái: khó thay đổi, ôm giận lâu, và thiếu tiền hay mất chỗ quen là bất an rõ rệt.',
  'Bạn xử lý cảm xúc bằng lời nói – cần được trò chuyện, chia sẻ. Mặt trái: tâm trạng thay đổi nhanh, dễ chán, hay nghĩ quá nhiều mà khó yên lòng.',
  'Bạn rất giàu cảm xúc, gắn bó với gia đình và kỷ niệm, cần một "tổ ấm" thật sự. Mặt trái: dễ tủi thân, hay lo cho người thân đến mức ngột ngạt cho cả hai bên.',
  'Bạn cần được trân trọng và ghi nhận; cảm xúc ấm áp, hào phóng. Mặt trái: không được để ý là buồn, dễ tự ái và đòi hỏi sự quan tâm.',
  'Bạn xử lý cảm xúc bằng cách phân tích và giúp đỡ; cần trật tự và người chân thành. Mặt trái: hay lo lắng, bắt lỗi chính mình, khó thả lỏng.',
  'Bạn thấy an lòng khi mọi thứ hài hòa và có người tin cậy để chia sẻ. Mặt trái: sợ xung đột nên nén cảm xúc, chiều người khác rồi tự thấy thiệt.',
  'Cảm xúc của bạn sâu và mãnh liệt; bạn cần sự chân thật, lòng trung thành và không gian riêng. Mặt trái: đa nghi, ghen, tổn thương thì khó tha thứ.',
  'Bạn cần tự do cảm xúc và ý nghĩa; lạc quan, thích phiêu lưu. Mặt trái: ngại ràng buộc, có lúc lảng tránh khi người thân cần mình ở lại.',
  'Bạn kiềm chế cảm xúc, ít bộc lộ; thấy an toàn khi đạt thành tựu và được tôn trọng. Mặt trái: người thân thấy bạn lạnh, bạn cũng dễ cô đơn mà không nói ra.',
  'Bạn tiếp cận cảm xúc bằng lý trí; cần tự do và sự khác biệt. Mặt trái: ngại những đòi hỏi tình cảm dồn dập, dễ bị cho là hờ hững.',
  'Bạn thấm cảm xúc của môi trường rất nhanh; cần không gian sáng tạo hoặc tâm linh để "lọc" lại năng lượng. Mặt trái: dễ kiệt sức vì gánh buồn của người khác, khó phân biệt đâu là cảm xúc của mình.'];
var DH_CT_ASC = [
  'Người khác thường thấy bạn năng động, nhanh nhẹn, thẳng thắn – theo cách luận truyền thống, dáng vẻ hay toát lên sự quyết đoán; mặt trái là dễ bị coi là nóng nảy, hiếu thắng. Bạn hãy tự đối chiếu.',
  'Người khác thường thấy bạn điềm tĩnh, dễ chịu, đáng tin – theo cách luận truyền thống, dáng vẻ hay toát lên sự chắc chắn, thích thoải mái; mặt trái là dễ bị coi là chậm, bảo thủ. Bạn hãy tự đối chiếu.',
  'Người khác thường thấy bạn lanh lợi, hoạt ngôn, trẻ trung – theo cách luận truyền thống, phong thái hay trẻ hơn tuổi; mặt trái là dễ bị coi là thiếu nghiêm túc, hay đổi ý. Bạn hãy tự đối chiếu.',
  'Người khác thường thấy bạn hiền hòa, gần gũi, biết quan tâm – dễ tạo cảm giác an toàn; mặt trái là dễ bị coi là nhút nhát, dễ bị bắt nạt.',
  'Người khác thường thấy bạn nổi bật, tự tin, có khí chất – dễ gây ấn tượng ngay lần đầu; mặt trái là dễ bị coi là kiêu, phô trương.',
  'Người khác thường thấy bạn chỉn chu, khiêm tốn, gọn gàng – nhìn là biết người cẩn thận; mặt trái là dễ bị coi là khó tính, xét nét.',
  'Người khác thường thấy bạn duyên dáng, lịch sự, dễ mến – dễ tạo thiện cảm; mặt trái là dễ bị coi là xã giao, khó biết thật lòng nghĩ gì.',
  'Người khác thường thấy bạn bí ẩn, sâu sắc, có sức hút – khó đoán; mặt trái là dễ bị coi là lạnh lùng, khó tin cậy lúc đầu.',
  'Người khác thường thấy bạn vui vẻ, cởi mở, phóng khoáng – dễ bắt chuyện; mặt trái là dễ bị coi là thiếu chín chắn, hứa suông.',
  'Người khác thường thấy bạn chín chắn, nghiêm túc, có trách nhiệm – phong thái "người lớn" từ sớm; mặt trái là dễ bị coi là khô khan, khó gần.',
  'Người khác thường thấy bạn độc đáo, thân thiện nhưng có khoảng cách – phong cách riêng, khó lẫn; mặt trái là dễ bị coi là lập dị, khó hòa vào nhóm.',
  'Người khác thường thấy bạn mơ mộng, dịu dàng, nhạy cảm – dễ khiến người khác muốn che chở; mặt trái là dễ bị coi là yếu đuối, thiếu thực tế.'];
var DH_CT_NT_TEN = { 'Lửa': 'Lửa (nhiệt huyết, hành động)', 'Đất': 'Đất (thực tế, bền bỉ)', 'Khí': 'Khí (tư duy, giao tiếp)', 'Nước': 'Nước (cảm xúc, trực giác)' };
var DH_CT_NT_THIEU = { 'Lửa': 'thiếu nhiệt huyết và sự chủ động, hay chờ cảm hứng nên chậm bắt tay vào việc (gợi ý: bắt đầu ngay một việc nhỏ)',
  'Đất': 'thiếu tính thực tế, dễ hụt tiền và bỏ dở việc giữa chừng (gợi ý: lập kế hoạch, theo dõi thu chi)',
  'Khí': 'thiếu góc nhìn khách quan, dễ quyết theo cảm tính (gợi ý: viết ra suy nghĩ trước khi quyết)',
  'Nước': 'thiếu kết nối cảm xúc, người thân dễ thấy bạn khô khan (gợi ý: nói ra cảm xúc của mình)' };
var DH_CT_VENUS = { 'Lửa': 'Trong tình yêu, bạn thích sự chủ động, bất ngờ, cử chỉ mạnh mẽ; bạn yêu thẳng thắn và cần tiếng cười. Mặt trái: yêu nhanh chán nhanh, dễ ghen và nổi nóng khi bị lạnh nhạt.',
  'Đất': 'Trong tình yêu, bạn thể hiện bằng hành động và sự chăm sóc thực tế; bạn cần chung thủy, ổn định và gần gũi. Mặt trái: ít lời ngọt, dễ bị cho là khô khan, có lúc giữ người yêu như giữ của.',
  'Khí': 'Trong tình yêu, bạn cần được trò chuyện, được khen và cùng chia sẻ ý tưởng; bạn yêu bằng trí óc trước. Mặt trái: dễ hờ hững với cảm xúc sâu, hay lý lẽ khi người kia chỉ cần được thương.',
  'Nước': 'Trong tình yêu, bạn cần gắn kết cảm xúc sâu, thời gian bên nhau và sự thấu hiểu không cần nói. Mặt trái: dễ bám víu, tủi thân, hy sinh quá mức rồi thấy mình bị thiệt.' };
var DH_CT_MARS = { 'Lửa': 'Khi theo đuổi điều mình muốn, bạn hành động nhanh, thích thử thách và cạnh tranh; mặt trái là bốc đồng, dễ gây hấn và bỏ cuộc khi hết hứng.',
  'Đất': 'Khi theo đuổi điều mình muốn, bạn bền bỉ, có kế hoạch và muốn thấy kết quả cụ thể; mặt trái là chậm, cứng, ngại rủi ro nên lỡ thời cơ.',
  'Khí': 'Khi theo đuổi điều mình muốn, bạn dùng lý lẽ, ý tưởng và sự thuyết phục; mặt trái là bàn nhiều làm ít, dễ đổi hướng giữa chừng.',
  'Nước': 'Khi theo đuổi điều mình muốn, bạn hành động theo cảm xúc và trực giác, âm thầm mà dai dẳng; mặt trái là thất thường theo tâm trạng, hay giận ngầm thay vì nói thẳng.' };
var DH_CT_MC = { 'Lửa': 'Bạn hợp với công việc được dẫn dắt, sáng tạo, xuất hiện trước công chúng hoặc tự khởi nghiệp; mặt trái là khó chịu khi làm dưới quyền người khác, dễ nhảy việc.',
  'Đất': 'Bạn hợp với công việc ổn định, có cấp bậc rõ, tạo ra giá trị cụ thể: quản lý, tài chính, kỹ thuật, xây dựng; mặt trái là thăng tiến chậm và dễ bị cuốn vào làm việc quá sức.',
  'Khí': 'Bạn hợp với công việc cần giao tiếp, ý tưởng, kết nối con người: truyền thông, giáo dục, công nghệ, tư vấn; mặt trái là dễ dàn trải, thiếu một chuyên môn sâu.',
  'Nước': 'Bạn hợp với công việc chăm sóc, chữa lành, sáng tạo nghệ thuật hoặc thấu hiểu con người; mặt trái là dễ kiệt sức vì gánh cảm xúc của người khác, thu nhập có lúc bấp bênh.' };
var DH_CT_NHA_LV = { 1: ['Menh', 'tinh_cach', 'bản thân'], 2: ['Tai Bach', 'tai_chinh', 'tiền bạc'], 3: ['Huynh De', 'gia_dao', 'anh em, học tập, giao tiếp'], 4: ['Dien Trach', 'gia_dao', 'gia đình, nhà cửa'],
  5: ['Tu Tuc', 'con_cai', 'tình yêu, con cái, sáng tạo'], 6: ['Tat Ach', 'suc_khoe', 'sức khỏe và công việc hằng ngày'], 7: ['Phu The', 'tinh_duyen', 'hôn nhân, đối tác'], 8: ['Tai Bach', 'tai_chinh', 'tài sản chung, những biến đổi lớn'],
  9: ['Thien Di', 'xa_hoi', 'học vấn cao, đi xa, niềm tin'], 10: ['Quan Loc', 'cong_danh', 'sự nghiệp, danh tiếng'], 11: ['No Boc', 'xa_hoi', 'bạn bè, cộng đồng, ước mơ'], 12: ['Phuc Duc', 'tam_linh', 'đời sống nội tâm, tâm linh'] };
var DH_CT_MOC = { 1: 'bạn lạc quan, rộng lượng và dễ được quý mến; mặt trái là dễ chủ quan, tăng cân và hứa quá khả năng', 2: 'bạn có duyên kiếm tiền và tích lũy của cải; mặt trái là cũng dễ tiêu rộng tay, ỷ vào vận may', 3: 'bạn có tài ăn nói, viết lách, học hỏi nhanh; mặt trái là biết nhiều mà khó đi sâu',
  4: 'gia đình, nhà cửa mang lại phúc lành cho bạn; mặt trái là dễ ỷ vào nhà, chậm tự lập', 5: 'sáng tạo, tình yêu và con cái mang lại niềm vui lớn; mặt trái là dễ ham vui, chi tiêu nhiều cho hưởng thụ', 6: 'bạn có tài chăm sóc, chữa lành và làm việc chăm chỉ được đền đáp; mặt trái là dễ ôm việc, ăn uống quá đà', 7: 'hôn nhân, đối tác giúp bạn mở rộng cơ hội; mặt trái là dễ trông cậy vào người kia quá nhiều', 8: 'bạn có lộc từ tài sản chung, thừa kế hoặc hợp tác; mặt trái là dễ dính nợ chung hoặc tranh chấp chia phần',
  9: 'may mắn đến khi bạn học cao, đi xa, mở rộng tầm nhìn; mặt trái là dễ mải lý tưởng xa mà bỏ việc gần', 10: 'bạn có vận may trong sự nghiệp và danh tiếng; mặt trái là dễ tự mãn khi đang lên', 11: 'bạn bè, cộng đồng là nguồn may mắn lớn; mặt trái là dễ bị bạn bè kéo vào chi tiêu, hứa hẹn', 12: 'may mắn đến qua đời sống nội tâm, lòng tốt và sự giúp đỡ âm thầm; mặt trái là dễ né tránh thực tế, cho đi quá sức' };
var DH_CT_THO = { 1: 'bạn nghiêm khắc với bản thân, trưởng thành sớm nhưng hay tự ti, gánh nặng trách nhiệm từ nhỏ; mặt tốt là bản lĩnh vững dần theo tuổi', 2: 'tiền bạc đến chậm, có giai đoạn túng thiếu và lo âu về vật chất; mặt tốt là của cải tự tay gây dựng thì giữ được lâu', 3: 'việc học và giao tiếp vất vả, dễ bị hiểu sai hoặc ngại nói; mặt tốt là đã nói điều gì thì chắc chắn',
  4: 'gia đình, tuổi thơ có thể nhiều trách nhiệm, thiếu hơi ấm hoặc phải lo cho cha mẹ sớm; mặt tốt là bạn xây tổ ấm của mình rất vững', 5: 'niềm vui, tình yêu và chuyện con cái đến muộn hoặc nặng nề, bạn khó thả lỏng; mặt tốt là khi đã yêu thì nghiêm túc', 6: 'công việc hằng ngày nặng nhọc, sức khỏe dễ có bệnh dai dẳng nếu sinh hoạt thất thường; mặt tốt là có kỷ luật thì giữ sức rất bền',
  7: 'hôn nhân, đối tác đến muộn hoặc nhiều thử thách, dễ có giai đoạn lạnh nhạt; mặt tốt là khi đã vững thì rất bền', 8: 'chuyện tài sản chung, nợ nần dễ rắc rối, có thể mất mát vì người khác; mặt tốt là bạn học được cách quản lý rủi ro', 9: 'niềm tin và học vấn cao đòi hỏi nhiều công sức, dễ gián đoạn; mặt tốt là bạn trở thành người hiểu biết sâu',
  10: 'sự nghiệp lên chậm, có thể vấp ngã hoặc bị cấp trên kìm; mặt tốt là danh tiếng đến muộn nhưng bền', 11: 'bạn bè ít, dễ thấy lạc lõng trong đám đông; mặt tốt là những người bạn có được rất chất lượng', 12: 'nội tâm nặng nề, dễ lo âu, cô đơn mà không nói ra; mặt tốt là biết tĩnh lặng thì bạn mạnh mẽ từ bên trong' };

function dhChiemTinh_(ct, ctl) {
  var by = {}, khoi = [], facts = [], he = 'Chiem Tinh';
  (ct.hanhTinh || []).forEach(function (p) { by[p.key] = p; });
  var sun = by.sun, moon = by.moon, asc = ct.asc, mc = ct.mc;
  function nt(c) { return CT_CUNG[c].nt; }
  var ntv = ct.nguyenTo || {}, ks = Object.keys(ntv).sort(function (a, b) { return ntv[b] - ntv[a]; }), tong = ks.reduce(function (s, k) { return s + ntv[k]; }, 0) || 1;
  var thieu = ks.filter(function (k) { return ntv[k] / tong < 0.14; });
  khoi.push({ ten: 'Con người bạn qua bản đồ sao', doan: [
    dhDoan_('Tóm tắt', 'Lúc bạn chào đời, Mặt Trời ở cung ' + sun.cungTen + ', Mặt Trăng ở cung ' + moon.cungTen + ' và cung ' + asc.cungTen + ' đang mọc ở chân trời phía đông. Ba điểm này lần lượt nói về bản chất, thế giới cảm xúc và vẻ ngoài của bạn.'),
    dhDoan_('Bản chất con người bạn', DH_CT_SUN[sun.cung]),
    dhDoan_('Thế giới cảm xúc bên trong', DH_CT_MOON[moon.cung]),
    dhDoan_('Ấn tượng đầu tiên với người khác', DH_CT_ASC[asc.cung]),
    dhDoan_('Cán cân tính khí', 'Nguyên tố ' + DH_CT_NT_TEN[ks[0]] + ' nổi trội nhất trong bản đồ sao của bạn.' + (thieu.length ? ' Nguyên tố ' + thieu.map(function (k) { return DH_CT_NT_TEN[k]; }).join(', ') + ' khá ít: bạn ' + thieu.map(function (k) { return DH_CT_NT_THIEU[k]; }).join('; ') + '.' : ' Các nguyên tố khá cân đối – bạn linh hoạt trong nhiều hoàn cảnh, nhưng cũng ít có một nét nổi trội rõ.')),
    dhDoan_('Lời khuyên cụ thể', '', ['Sống đúng "Mặt Trời": ' + DH_CT_SUN[sun.cung].split(':')[1].split(';')[0].trim().replace(/\.$/, '') + '.',
      'Chăm sóc "Mặt Trăng": cho mình những điều khiến bạn thấy an toàn, như đã nói ở trên.', 'Người khác thường gặp "cung Mọc" của bạn trước – ấn tượng ban đầu có thể khác con người thật bên trong.'])
  ] });
  var PL = ctl && ctl.phanTich && ctl.phanTich.phucLoc;
  if (PL) khoi.push({ ten: 'Nguồn may mắn và chí hướng', doan: [dhDoan_('Thế mạnh tự nhiên', PL.tronSect), dhDoan_('Nơi phúc lộc đến', PL.tronF), dhDoan_('Điều bạn thấy ý nghĩa', PL.tronS)] });
  facts.push(taoFact_(he, 'Menh', 'tinh_cach', 'manh', DH_CT_SUN[sun.cung], 1.3, { nguon: 'Mặt Trời ' + sun.cungTen }));
  facts.push(taoFact_(he, 'Menh', 'tinh_cach', 'trung', DH_CT_MOON[moon.cung], 1.0, { nguon: 'Mặt Trăng ' + moon.cungTen }));
  // Tình yêu
  var ve = by.venus, ma = by.mars, ds = ct.cusp && ct.cusp[6];
  khoi.push({ ten: 'Tình yêu & các mối quan hệ', doan: [
    dhDoan_('Cách bạn yêu', DH_CT_VENUS[nt(ve.cung)]),
    dhDoan_('Cách bạn theo đuổi điều mình muốn', DH_CT_MARS[nt(ma.cung)]),
    dhDoan_('Người bạn dễ bị thu hút', ds ? 'Bạn thường bị thu hút bởi người mang nét của cung ' + ds.cungTen + ': ' + DH_CT_SUN[ds.cung].split(':')[1].trim() : ''),
    dhDoan_('Lời khuyên', '', ['Nói rõ cách mình muốn được yêu thương cho người ấy biết.', 'Khi bất đồng, nói ra sớm thay vì để dồn lại.'])
  ].filter(function (d) { return d.text || d.list; }) });
  facts.push(taoFact_(he, 'Phu The', 'tinh_duyen', 'trung', DH_CT_VENUS[nt(ve.cung)], 1.0, { nguon: 'Sao Kim ' + ve.cungTen, doiTuong: 'ban_than' }));
  // Sự nghiệp & may mắn
  var ju = by.jupiter, sa = by.saturn, jn = ju && ju.nha, sn = sa && sa.nha;
  khoi.push({ ten: 'Sự nghiệp, may mắn & bài học', doan: [
    dhDoan_('Hướng sự nghiệp', DH_CT_MC[nt(mc.cung)]),
    jn ? dhDoan_('Nơi may mắn tìm đến bạn', 'Về ' + DH_CT_NHA_LV[jn][2] + ': ' + DH_CT_MOC[jn] + '.') : null,
    sn ? dhDoan_('Bài học lớn của đời bạn', 'Về ' + DH_CT_NHA_LV[sn][2] + ': ' + DH_CT_THO[sn] + '.') : null,
    dhDoan_('Lời khuyên', '', ['Đầu tư công sức vào lĩnh vực may mắn, nhưng đừng ỷ vào vận may.', 'Ở lĩnh vực bài học lớn, chuẩn bị kỹ và đi chậm hơn người khác.'])
  ].filter(Boolean) });
  facts.push(taoFact_(he, 'Quan Loc', 'cong_danh', 'trung', DH_CT_MC[nt(mc.cung)], 1.0, { nguon: 'Thiên đỉnh ' + mc.cungTen }));
  if (jn) facts.push(taoFact_(he, DH_CT_NHA_LV[jn][0], DH_CT_NHA_LV[jn][1], 'manh', dhCau_(DH_CT_MOC[jn]), 1.2, { nguon: 'Sao Mộc nhà ' + jn }));
  if (sn) facts.push(taoFact_(he, DH_CT_NHA_LV[sn][0], DH_CT_NHA_LV[sn][1], 'yeu', dhCau_(DH_CT_THO[sn]), 1.1, { nguon: 'Sao Thổ nhà ' + sn }));
  // Luận 8 lĩnh vực theo quy trình 7 bước (văn không nêu tên hành tinh)
  var P = ctl && ctl.phanTich;
  if (P && P.linhVuc) {
    khoi.push({ ten: 'Tám mặt đời sống qua bản đồ sao', doan: P.linhVuc.map(function (x) { return dhDoan_(x.ten, x.tron + ' Gợi ý: ' + x.khuyen); }) });
    var MY = P.manhYeu, CK = P.chuKy, sr = CK && CK.solarReturn, tot = (CK.suKien || []).filter(function (e) { return e.tot; }), kho = (CK.suKien || []).filter(function (e) { return !e.tot; });
    var uniq = function (a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }); };
    khoi.push({ ten: 'Điểm mạnh, bài học và năm nay', doan: [
      MY.manhTron.length ? dhDoan_('Điểm mạnh nên phát huy', 'Bạn có lợi thế tự nhiên về ' + MY.manhTron.join(', ') + '; mặt trái là dễ chủ quan ở chính những chỗ mình giỏi.') : null,
      MY.yeuTron.length ? dhDoan_('Điều cần rèn thêm', 'Bạn có xu hướng yếu hơn người khác ở ' + MY.yeuTron.join(', ') + ': làm nhiều mà kết quả chậm, dễ nản hoặc vấp lại cùng một lỗi. Gợi ý: rèn đều từng chút.') : null,
      dhDoan_('Cách người khác nhìn bạn', MY.nhinNhan),
      dhDoan_('Bài học của đời này', P.nut.tron),
      sr ? dhDoan_('Năm nay', 'Chủ đề nổi bật của năm là chuyện ' + CT_NHA_NGAN[sr.nhaMatTroi - 1] + '.' + (tot.length ? ' Thời điểm thuận: ' + uniq(tot.map(function (e) { return e.thang; })).join(', ') + '.' : '') + (kho.length ? ' Nên thận trọng: ' + uniq(kho.map(function (e) { return e.thang; })).join(', ') + '.' : '')) : null
    ].filter(Boolean) });
    var LVF = { tinhCach: ['Menh', 'tinh_cach'], camXuc: ['Phuc Duc', 'tam_linh'], tuDuy: ['Menh', 'tinh_cach'], tinhYeu: ['Phu The', 'tinh_duyen'], suNghiep: ['Quan Loc', 'cong_danh'], taiChinh: ['Tai Bach', 'tai_chinh'], sucKhoe: ['Tat Ach', 'suc_khoe'] };
    P.linhVuc.forEach(function (x) { var f = LVF[x.k]; if (f) facts.push(taoFact_(he, f[0], f[1], dhLoai_(dhD10_(x.diem * 1.5)), x.tron, 0.6, { nguon: 'Chiêm tinh – ' + x.ten })); });
  }
  return { he: 'Chiêm tinh', khoi: khoi, facts: facts };
}

/* ============================================================
 *  3. THẦN SỐ HỌC (dùng lại lời luận đã có, sắp lại theo cấu trúc dễ đọc)
 * ============================================================ */
function dhThanSo_(ts, tsl) {
  var khoi = [], facts = [], he = 'Than So', s0 = (tsl && tsl[0]) || { tieuDe: '', items: [] };
  function lay(re) { var x = s0.items.filter(function (t) { return re.test(dhSach_(t)); })[0]; return x ? dhSach_(x).replace(re, '').replace(/^[:\s]+/, '').trim() : ''; }
  var tuKhoa = lay(/^Từ khóa/i), manh = lay(/^Điểm mạnh/i), yeu = lay(/^Điểm cần khắc phục/i), nghe = lay(/^Nghề nghiệp hợp/i), baiHoc = lay(/^Bài học/i);
  var ten = s0.tieuDe.replace(/^Số chủ đạo\s*/i, '').replace(/\s*\([^)]*\)\s*$/, '');
  var s1 = (tsl || []).filter(function (x) { return /ngày sinh/i.test(x.tieuDe) && !/Biểu đồ/.test(x.tieuDe); })[0], s6 = (tsl || []).filter(function (x) { return /Năm cá nhân/i.test(x.tieuDe); })[0];
  var doan = [dhDoan_('Tóm tắt', 'Con số chủ đạo – tính từ ngày tháng năm sinh – của bạn là ' + ten + '. Đây là "bài học chính" và năng lượng nền mà bạn mang theo suốt đời.')];
  if (tuKhoa) doan.push(dhDoan_('Bản chất con người bạn', 'Bạn thuộc mẫu người gắn với ' + tuKhoa.replace(/\.$/, '') + '.'));
  if (manh) doan.push(dhDoan_('Điểm mạnh nổi bật', dhCau_(manh)));
  if (yeu) doan.push(dhDoan_('Điểm cần lưu ý', dhCau_(yeu)));
  if (s1) doan.push(dhDoan_('Năng khiếu bẩm sinh', s1.items.map(dhSach_).join(' ')));
  if (nghe) doan.push(dhDoan_('Công việc hợp với bạn', dhCau_(nghe)));
  if (baiHoc) doan.push(dhDoan_('Bài học đường đời', dhCau_(baiHoc)));
  var P = ts.phanTich;
  if (P && P.luan) {
    // Văn đời thường từ phần luận tổng hợp: bỏ chú thích "(Linh Hồn 8)"… và ký hiệu đầu dòng
    var gon = function (t) { return dhSach_(t).replace(/\s*\((Đường Đời|Nhân Cách|Linh Hồn|Ngày Sinh|Định Mệnh|Thái Độ|Thách Thức|Nợ nghiệp|Món nợ công sức|Bài học mang theo|Đỉnh Cao|số vắng)[^)]*\)/gi, '').replace(/\s+([,.;:])/g, '$1'); };
    khoi.push({ ten: 'Con người bạn qua các con số', doan: [doan[0]].concat(P.luan.filter(function (x) { return x.k !== 'vanTrinh'; }).map(function (x) { return dhDoan_(x.ten, '', x.items.map(gon)); })) });
    var vt = P.luan.filter(function (x) { return x.k === 'vanTrinh'; })[0];
    if (vt) khoi.push({ ten: 'Năm nay và chặng đời hiện tại', doan: [dhDoan_('Nhịp thời gian', '', vt.items.map(gon))].concat(P.chuyenTiep ? [dhDoan_('Chủ đề năm theo tên của bạn', P.chuyenTiep.tron)] : []) });
    khoi.push({ ten: 'Lời khuyên theo thần số', doan: P.loiKhuyen.map(function (x) { return dhDoan_(x.ten, gon(x.t)); }) });
  } else {
    khoi.push({ ten: 'Con số chủ đạo của bạn', doan: doan });
    if (s6 && s6.items.length) khoi.push({ ten: 'Năm nay theo thần số', doan: [dhDoan_('Nhịp năm cá nhân', s6.items.map(dhSach_).join(' '))] });
  }
  if (manh) facts.push(taoFact_(he, 'Menh', 'tinh_cach', 'manh', dhCau_(manh), 1.0, { nguon: 'Số chủ đạo ' + ts.duongDoi }));
  if (yeu) facts.push(taoFact_(he, 'Menh', 'tinh_cach', 'yeu', dhCau_(yeu), 0.8, { nguon: 'Số chủ đạo ' + ts.duongDoi }));
  if (nghe) facts.push(taoFact_(he, 'Quan Loc', 'cong_danh', 'trung', 'Công việc hợp: ' + nghe.replace(/\.$/, '') + '.', 0.9, { nguon: 'Số chủ đạo ' + ts.duongDoi }));
  return { he: 'Thần số học', khoi: khoi, facts: facts };
}

/* ============================================================
 *  4. HUMAN DESIGN
 * ============================================================ */
var DH_HD_LOAI = {
  'Generator': { tomTat: 'Bạn thuộc nhóm "Người Kiến Tạo" – nhóm đông nhất, có nguồn sinh lực bền bỉ để xây dựng; mặt trái là dễ làm việc mình không thích quá lâu rồi bực bội, mắc kẹt.', loi: ['Đợi cơ hội đến rồi lắng nghe cảm giác "có/không" từ bụng, thay vì ép mình khởi xướng mọi thứ.', 'Làm việc mình thật sự thích – làm việc không thích lâu ngày thì sinh lực cạn và dễ cáu.', 'Bực bội kéo dài là dấu hiệu bạn đang làm sai việc hoặc sai cách; xem lại ngay, đừng gồng tiếp.'] },
  'Manifesting Generator': { tomTat: 'Bạn thuộc nhóm "Người Kiến Tạo Biểu Hiện" – nhanh, đa năng, làm nhiều việc cùng lúc và tìm ra đường tắt; mặt trái là hay bỏ sót bước, bỏ dở và làm người xung quanh hụt hơi.', loi: ['Phản hồi trước, rồi báo cho người liên quan trước khi hành động.', 'Bỏ bước thừa thì nhanh, nhưng phải quay lại kiểm tra bước bị sót.', 'Đổi hướng là cách bạn tìm ra điều đúng, nhưng mỗi lần đổi hãy báo rõ cho người cùng làm.'] },
  'Manifestor': { tomTat: 'Bạn thuộc nhóm "Người Khởi Xướng" – nhóm khá hiếm, mở đường và tạo tác động; mặt trái là hay làm một mình, ít báo trước nên dễ bị phản đối, cô lập.', loi: ['Báo trước khi hành động để người xung quanh không bị bất ngờ.', 'Làm theo từng đợt năng lượng, nghỉ xen kẽ – cố chạy liên tục là kiệt sức.', 'Hay bực tức là dấu hiệu bạn đang bị kìm quá nhiều; tìm chỗ cho phép bạn tự quyết.'] },
  'Projector': { tomTat: 'Bạn thuộc nhóm "Người Dẫn Dắt" – nhóm không nhiều, nhìn thấu con người và hệ thống; mặt trái là sức bền thấp, góp ý khi chưa được hỏi thì bị gạt đi và dễ thấy chạnh lòng.', loi: ['Chờ được mời hoặc được công nhận cho những việc lớn (công việc, tình yêu, nơi ở).', 'Học sâu một lĩnh vực – đó là lý do để người khác mời bạn.', 'Nghỉ trước khi mệt; chạnh lòng kéo dài là dấu hiệu bạn đang ở nơi không biết ghi nhận mình.'] },
  'Reflector': { tomTat: 'Bạn thuộc nhóm "Người Phản Chiếu" – nhóm rất hiếm, phản chiếu bầu không khí của cộng đồng quanh mình; mặt trái là dễ mất phương hướng, hay thất vọng khi ở sai môi trường.', loi: ['Cho mình khoảng một tháng (một chu kỳ trăng) trước những quyết định lớn.', 'Chọn nơi sống và làm việc thật kỹ – môi trường sai thì bạn sa sút rất nhanh.', 'Thất vọng kéo dài là dấu hiệu nên đổi không gian sống hoặc nhóm người xung quanh.'] }
};
var DH_HD_MO = {
  head: 'Đầu (cảm hứng): mặt tốt là hiểu được câu hỏi của nhiều người; mặt xấu là bị áp lực phải trả lời mọi câu hỏi, đầu óc ít khi được yên.',
  ajna: 'Tư duy: mặt tốt là linh hoạt quan điểm; mặt xấu là hay cố tỏ ra chắc chắn, bám vào ý kiến không phải của mình.',
  throat: 'Cổ họng (lời nói): mặt tốt là nói được nhiều kiểu; mặt xấu là dễ nói nhiều để được chú ý, nói lúc chưa ai hỏi nên lời mất sức nặng.',
  g: 'Bản sắc – định hướng: mặt tốt là thích nghi với nhiều môi trường; mặt xấu là hay phân vân "mình là ai", dễ đi lạc khi ở sai nơi, sai người.',
  heart: 'Ý chí: mặt tốt là không bị cái tôi chi phối; mặt xấu là hay cố chứng minh giá trị bản thân, hứa quá sức rồi không làm được.',
  sacral: 'Sinh lực: mặt tốt là cảm được sức làm việc của người khác; mặt xấu là không biết khi nào là "đủ", làm đến kiệt sức.',
  solar: 'Cảm xúc: mặt tốt là thấu cảm rất nhanh; mặt xấu là né xung đột, chiều lòng người khác và mang cả nỗi buồn của họ về mình.',
  spleen: 'Trực giác – sức khỏe: mặt tốt là nhạy với điều bất ổn; mặt xấu là hay bám víu những thứ không còn tốt cho mình vì sợ mất.',
  root: 'Áp lực: mặt tốt là làm được việc gấp; mặt xấu là hay vội làm cho xong để thoát áp lực, quyết vội rồi phải sửa.' };
var DH_HD_HAO = { 1: 'người tìm hiểu nền tảng – cần biết thật chắc trước khi làm, đổi lại hay bất an khi thiếu thông tin', 2: 'người có tài bẩm sinh – cần thời gian riêng, thường được người khác "gọi ra", đổi lại dễ bị làm phiền và khó chịu khi bị kéo ra quá sớm', 3: 'người học qua trải nghiệm – thử, sai, rồi tìm ra điều đúng, đổi lại đời nhiều đổ vỡ, làm lại',
  4: 'người kết nối – cơ hội đến qua các mối quan hệ quen biết, đổi lại khi vòng quen biết tan thì dễ chao đảo', 5: 'người giải quyết vấn đề – hay được kỳ vọng, tìm đến lúc khó khăn, đổi lại làm hỏng là bị trách nặng', 6: 'người làm gương – đời chia 3 giai đoạn, càng về sau càng thành hình mẫu, đổi lại giai đoạn đầu nhiều va vấp và có lúc tách mình khỏi mọi người' };
var DH_HD_TQ = { 'Cảm xúc': 'Đừng quyết định lúc cảm xúc đang lên cao hay xuống thấp – hãy "ngủ một đêm", chờ cảm xúc lắng rồi mới chốt; quyết lúc nóng thường phải hối.',
  'Xương cùng': 'Hãy tin vào phản ứng tức thì từ bụng ("ừ-hứ" hay "ư-ừ") khi được hỏi – nghĩ lý lẽ đè lên cảm giác này thường dẫn bạn vào việc không hợp.',
  'Lá lách': 'Hãy tin vào linh cảm thoáng qua ngay lúc đó – trực giác chỉ nói một lần, bỏ qua thì dễ gặp đúng điều bạn từng thấy bất ổn.',
  'Ý chí': 'Hãy hỏi: mình có thật sự muốn điều này không? Chỉ hứa những gì trái tim mình cam kết được; hứa theo áp lực thì dễ thất hứa.',
  'Bản thân': 'Hãy nói ra suy nghĩ với người tin cậy và lắng nghe chính giọng mình – câu trả lời hiện ra khi bạn nói; quyết một mình trong im lặng dễ lệch.',
  'Môi trường': 'Hãy trao đổi với nhiều người ở những môi trường khác nhau – bạn sáng tỏ khi được nghe chính mình nói ở đúng nơi; ở sai nơi thì dễ quyết sai.',
  'Mặt Trăng': 'Hãy chờ khoảng một chu kỳ trăng (28 ngày) trước những quyết định lớn; quyết vội thường không đúng với bạn.' };
function dhHD_(hd) {
  var khoi = [], facts = [], he = 'HD', L = DH_HD_LOAI[hd.loai] || DH_HD_LOAI.Generator, luan = hd.luan || [];
  var s0 = luan[0] || { items: [] }, sTq = luan[1] || { items: [] }, sProf = luan[2] || { items: [] };
  var tq = String(hd.thamQuyen || ''), tqKey = Object.keys(DH_HD_TQ).filter(function (k) { return new RegExp(k, 'i').test(tq); })[0] ||
    (/Solar/i.test(tq) ? 'Cảm xúc' : /Sacral/i.test(tq) ? 'Xương cùng' : /Splenic|Spleen/i.test(tq) ? 'Lá lách' : /Ego|Heart/i.test(tq) ? 'Ý chí' : /Self|G/i.test(tq) ? 'Bản thân' : /Mental|Outer/i.test(tq) ? 'Môi trường' : /Lunar/i.test(tq) ? 'Mặt Trăng' : null);
  var p = String(hd.profile || '').split('/').map(Number), mo = Object.keys(DH_HD_MO).filter(function (c) { return !(hd.dinh || {})[c]; });
  khoi.push({ ten: 'Thiết kế con người bạn', doan: [
    dhDoan_('Tóm tắt', L.tomTat),
    dhDoan_('Bản chất năng lượng', s0.items[0] ? dhSach_(s0.items[0]) : ''),
    dhDoan_('Cách ra quyết định đúng với bạn', (tqKey ? DH_HD_TQ[tqKey] + ' ' : '') + (sTq.items[0] ? dhSach_(sTq.items[0]) : '')),
    p.length === 2 && p[0] ? dhDoan_('Vai trò của bạn trong cuộc đời', 'Hồ sơ ' + hd.profile + ': bạn vừa là ' + DH_HD_HAO[p[0]] + ', vừa là ' + DH_HD_HAO[p[1]] + '.') : null,
    mo.length ? dhDoan_('Nơi bạn dễ bị người khác ảnh hưởng', 'Những vùng "mở" dưới đây giúp bạn hiểu người khác rất sâu, nhưng cũng dễ khiến bạn nhận nhầm năng lượng của người khác là của mình:', mo.map(function (c) { return DH_HD_MO[c]; })) : null,
    mo.length && typeof HD_CENTER_HOI === 'object' ? dhDoan_('Câu hỏi giúp bạn sống đúng mình', 'Khi thấy mệt mỏi hay lạc hướng, hãy dừng lại và tự hỏi:', mo.map(function (c) { return HD_CENTER_HOI[c][0]; })) : null,
    dhDoan_('Lời khuyên cụ thể', '', L.loi.slice())
  ].filter(function (d) { return d && (d.text || d.list); }) });
  facts.push(taoFact_(he, 'Menh', 'tinh_cach', 'manh', L.tomTat, 1.0, { nguon: 'Loại ' + hd.loai }));
  facts.push(taoFact_(he, 'Quan Loc', 'cong_danh', 'trung', L.loi[0], 0.8, { nguon: 'Chiến lược ' + hd.loai }));
  if (mo.indexOf('solar') >= 0) facts.push(taoFact_(he, 'Menh', 'tinh_cach', 'yeu', DH_HD_MO.solar, 0.6, { nguon: 'Trung tâm cảm xúc mở' }));
  var P = hd.phanTich;
  if (P && P.bienSo) {
    var bs = P.bienSo, c7 = (P.chuKy7 || []).filter(function (c) { return c.nay; })[0], gon = function (t) { return String(t).split(' (')[0]; };
    khoi.push({ ten: 'Sống hợp với thiết kế của bạn', doan: [
      dhDoan_('Điều thúc đẩy bạn', 'Bạn có xu hướng hành động vì ' + bs[0].y.replace(/^động lực từ /, '') + '.'),
      dhDoan_('Cách bạn nhìn cuộc sống', 'Bạn thường ' + bs[1].y + '.'),
      dhDoan_('Môi trường hợp với bạn', 'Bạn làm việc và sống tốt nhất ở ' + bs[2].y + ' (kiểu "' + gon(bs[2].gt).toLowerCase() + '").'),
      dhDoan_('Cách ăn uống hợp cơ thể', 'Bạn có thể thử để ý xem mình có thấy dễ chịu hơn khi ' + bs[3].y + ' – đây là gợi ý để tự quan sát, không phải chỉ dẫn y khoa.'),
      P.dinhNghia && P.dinhNghia.cau && P.dinhNghia.cau.length ? dhDoan_('Người giúp bạn thấy trọn vẹn', 'Bạn có hai "vùng" năng lượng tách rời; ở gần những người bổ sung được phần nối giữa hai vùng này, bạn thấy mình trọn vẹn và quyết định dễ hơn. Hãy để ý ai khiến bạn thấy "liền mạch" khi ở cạnh.') : null,
      c7 ? dhDoan_('Giai đoạn đời hiện tại', 'Bạn đang ở chu kỳ 7 năm ' + c7.tu + '–' + c7.den + ' tuổi: ' + c7.y + '.') : null,
      dhDoan_('Lời khuyên', '', P.loiKhuyen.slice(0, 2).map(function (x) { return x.ten + ': ' + x.t.replace(/\s*\([^)]*\)/g, ''); }))
    ].filter(Boolean) });
  }
  return { he: 'Human Design', khoi: khoi, facts: facts };
}

/* ============================================================
 *  5. BÁT TỰ HÀ LẠC
 * ============================================================ */
function dhHaLacMuc_(d) { return d >= 1.5 ? 'rat_tot' : d >= 0.5 ? 'tot' : d > -0.5 ? 'trung_binh' : d > -1.5 ? 'kho_khan' : 'rat_kho'; }
var DH_HL_MUC = { rat_tot: 'Đây là quẻ tốt – giai đoạn nhiều thuận lợi, cơ hội đến dễ; mặt trái là dễ chủ quan, làm quá tay khi đang thuận.', tot: 'Quẻ khá thuận – có cơ hội nhưng không tự đến, phải kiên trì mới thành; lơi tay là lỡ.', trung_binh: 'Quẻ ở mức bình ổn – không có thuận lợi lớn, cũng không có trở ngại lớn; thành bại tùy cách bạn ứng xử.',
  kho_khan: 'Quẻ có thử thách – việc dễ tắc, người dễ ngáng, cố tiến nhanh thì thiệt; mặt tốt là đây là lúc học được nhiều nhất. Gợi ý: đi chậm, giữ mình.', rat_kho: 'Quẻ báo giai đoạn khó – dễ mất mát, thất bại hoặc bế tắc nếu liều; mặt tốt là giữ được thế thủ thì ít tổn thất. Gợi ý: chưa vội quyết định lớn.' };
var DH_HL_LV = { banThan: 'Menh', chaMe: 'Phu Mau', anhEm: 'Huynh De', conCai: 'Tu Tuc', tienBac: 'Tai Bach', honNhan: 'Phu The', congDanh: 'Quan Loc', sucKhoe: 'Tat Ach' };
function dhHaLac_(hl) {
  if (!hl || !hl.tien) return null;
  var khoi = [], facts = [], he = 'Ha Lac', L = hl.luan || {}, now = (L.daiVan || []).filter(function (d) { return d.isNow; })[0], nn = L.namNay;
  function que(q) { return 'quẻ ' + q.ten + ' – ' + String(q.y || '').replace(/\.$/, '').toLowerCase(); }
  var doan = [dhDoan_('Tóm tắt', 'Bát tự Hà Lạc đổi giờ, ngày, tháng, năm sinh thành hai quẻ Kinh Dịch: quẻ đầu nói về nửa đầu đời (khoảng trước 30 tuổi), quẻ sau nói về nửa sau đời.'),
    dhDoan_('Nửa đầu đời', 'Bạn mang ' + que(hl.tien) + '. ' + DH_HL_MUC[dhHaLacMuc_(hl.tien.diem)] + (hl.tien.khuyen ? ' Lời quẻ khuyên: ' + hl.tien.khuyen + '.' : '')),
    dhDoan_('Nửa sau đời', hl.hau ? 'Bạn chuyển sang ' + que(hl.hau) + '. ' + DH_HL_MUC[dhHaLacMuc_(hl.hau.diem)] + (hl.hau.khuyen ? ' Lời quẻ khuyên: ' + hl.hau.khuyen + '.' : '') : '')];
  // So theo mức (không theo điểm lẻ) để hai quẻ cùng mức "khó" không bị gọi là "hậu thuận" – tránh mâu thuẫn với hai đoạn ngay trên
  var MUC_TT = ['rat_kho', 'kho_khan', 'trung_binh', 'tot', 'rat_tot'], mTien = MUC_TT.indexOf(dhHaLacMuc_(hl.tien.diem)), mHau = hl.hau ? MUC_TT.indexOf(dhHaLacMuc_(hl.hau.diem)) : 0;
  if (hl.hau) doan.push(dhDoan_('Nhịp đời của bạn', mTien < mHau ? 'Đời bạn có xu hướng "tiền khó – hậu thuận": tuổi trẻ vất vả, thiếu thốn hoặc lận đận lâu hơn người khác; về sau khá lên rõ.' :
    mTien > mHau ? 'Đời bạn có xu hướng "tiền thuận – hậu giữ": tuổi trẻ nhiều cơ hội; về sau vận chậm lại, dễ hao hụt nếu không tích lũy từ sớm.' :
    mTien <= 1 ? 'Đời bạn có xu hướng vất vả kéo dài qua cả hai nửa đời: khó khăn không tự hết theo tuổi, thành quả đến chậm và phải giữ thế thủ nhiều hơn người khác. Mặt tốt: bạn quen chịu áp lực, ít bị cú sốc nào quật ngã hẳn.' :
    mTien >= 3 ? 'Đời bạn có xu hướng thuận khá đều qua cả hai nửa đời. Mặt trái: quen thuận thì dễ chủ quan, ít được rèn để đối phó khi có biến lớn.' : 'Đời bạn khá đều tay – ổn định qua các giai đoạn, nhưng cũng ít có bước bứt phá lớn.'));
  if (now) doan.push(dhDoan_('Giai đoạn bạn đang đi qua', 'Từ ' + now.khoang + ' (' + now.nam + '): giai đoạn được đánh giá "' + now.danhGia + '". ' + DH_HL_MUC[dhHaLacMuc_(now.diem)]));
  if (nn) doan.push(dhDoan_('Năm ' + nn.nam, 'Quẻ năm nay là ' + nn.que + ' – ' + String(nn.y || '').toLowerCase() + '. ' + DH_HL_MUC[dhHaLacMuc_(nn.diem)] + (nn.khuyen ? ' Lời khuyên: ' + nn.khuyen + '.' : '')));
  if (L.thoiVi) doan.push(dhDoan_('Thời vận bẩm sinh', L.thoiVi.ketLuan.replace(/^Mệnh "([^"]+)": /, 'Lá số của bạn thuộc dạng "$1": ').replace(' (có Hóa công)', '').replace('có gốc từ cả can và chi năm sinh', 'được năm sinh nâng đỡ').replace('chỉ có một nguyên khí', 'chỉ được năm sinh nâng đỡ một phần').replace(', không có nguyên khí', '')));
  if (L.thapCat) doan.push(dhDoan_('Nền mệnh bẩm sinh', 'Sách cổ đếm 10 điều kiện tốt bẩm sinh của một lá số (quẻ đẹp, sinh đúng mùa, có chỗ dựa…). Lá số của bạn có ' + L.thapCat.so + '/10, ở mức ' + L.thapCat.bac + '. ' + L.thapCat.ketLuan.replace(/^Đạt [^.]*\. /, '')));
  khoi.push({ ten: 'Hai nửa cuộc đời theo Kinh Dịch', doan: doan });
  // Luận lục thân theo 6 hào → văn đời thường cho từng mặt đời sống
  if (L.linhVuc && L.linhVuc.length) {
    khoi.push({ ten: 'Các mặt đời sống theo 6 hào của quẻ', doan: L.linhVuc.map(function (x) {
      return dhDoan_(x.ten, x.van + (x.them.length ? ' ' + x.them.join(' ') : '') + ' ' + (/^Gợi ý:/.test(x.khuyen) ? x.khuyen : 'Gợi ý: ' + x.khuyen));
    }) });
    L.linhVuc.forEach(function (x) {
      var lv = DH_HL_LV[x.k]; if (!lv) return;
      facts.push(taoFact_(he, lv, x.nhom, dhLoai_(dhD10_(x.diem * 1.5)), x.ten + ': ' + x.van, 0.6, { nguon: 'Lục thân theo 6 hào' }));
    });
  }
  facts.push(taoFact_(he, 'ALL', 'tinh_cach', dhLoai_(5 + hl.tien.diem * 1.5), 'Nửa đầu đời: ' + que(hl.tien) + '.', 0.8, { nguon: 'Quẻ Tiên thiên', thoiDiem: 'tien_van' }));
  if (hl.hau) facts.push(taoFact_(he, 'ALL', 'tam_linh', dhLoai_(5 + hl.hau.diem * 1.5), 'Nửa sau đời: ' + que(hl.hau) + '.', 0.8, { nguon: 'Quẻ Hậu thiên', thoiDiem: 'hau_van' }));
  return { he: 'Hà Lạc', khoi: khoi, facts: facts };
}

/* ============================================================
 *  6. TỬ VI → FACTS (đọc từ TuViHeThong.gs) + TẦNG 4 TỔNG HỢP
 * ============================================================ */
/** Bỏ tên sao ở đầu câu fact Tử Vi ("Có Hỏa Tinh — …" → "…") để văn tổng hợp không chứa thuật ngữ */
function dhBoTenSao_(s) {
  s = String(s || '').trim();
  // "Tướng Quân (uy dũng…): có uy dũng…" / "Có Hóa Lộc — …" → chỉ giữ phần nghĩa
  var m = s.match(/^([^—:.;]{2,50})\s*(—|:)\s*(.+)$/);
  if (m && (/\(|^(Có |Sao |Hóa |Tuần|Triệt|Vô chính|VCD)/.test(m[1]) || m[1].split(/\s+/).length <= 4)) s = m[3];
  s = s.replace(/\s*(trong|ở|tại) (lĩnh vực|cung) này/gi, '').replace(/\s+([.,;])/g, '$1');
  return dhCau_(s);
}
function dhTuViFacts_(tv) {
  var out = [];
  if (typeof tuviSinhFactsCung_ !== 'function') return out;
  for (var i = 0; i < 12; i++) { try { out = out.concat(tuviSinhFactsCung_(tv, i)); } catch (e) { /* bỏ qua cung lỗi */ } }
  return out;
}
var DH_TH_NHOM = [
  { k: 'tinh_cach', ten: 'Tính cách & con người', loi: ['Điểm mạnh nhiều hệ cùng nhắc là phần đáng tin nhất.', 'Điểm yếu nhiều hệ cùng nhắc là điều dễ lặp lại nhất trong đời bạn.'] },
  { k: 'cong_danh', ten: 'Công danh – sự nghiệp', loi: ['Chọn nghề nằm ở giao điểm các gợi ý của nhiều hệ.', 'Tích lũy chuyên môn sâu trước, mở rộng sau.'] },
  { k: 'tai_chinh', ten: 'Tiền bạc – tài sản', loi: ['Lập quỹ dự phòng trước khi đầu tư.', 'Năm thuận thì tích lũy, năm khó thì giữ.'] },
  { k: 'tinh_duyen', ten: 'Tình duyên – hôn nhân', loi: ['Nói rõ nhu cầu tình cảm của mình cho người ấy.', 'Chọn người bù được điểm yếu của mình thay vì giống hệt mình.'] },
  { k: 'con_cai', ten: 'Con cái', loi: ['Dành thời gian chất lượng thay vì chỉ lo vật chất.', 'Quan sát tính cách riêng của con để dạy cho phù hợp.'] },
  { k: 'suc_khoe', ten: 'Sức khỏe', loi: ['Giữ nếp sinh hoạt điều độ và khám sức khỏe định kỳ.', 'Ngủ đủ, vận động đều.'] },
  { k: 'gia_dao', ten: 'Gia đình – cha mẹ – anh em', loi: ['Giữ kết nối đều đặn với người thân.', 'Rõ ràng chuyện tiền bạc trong gia đình để giữ tình.'] },
  { k: 'xa_hoi', ten: 'Bạn bè – quan hệ xã hội – đi xa', loi: ['Chọn bạn đồng hành kỹ; một người đúng hơn mười người quen.'] },
  { k: 'tam_linh', ten: 'Đời sống tinh thần', loi: ['Dành thời gian tĩnh lặng mỗi ngày.', 'Làm việc thiện nhỏ đều đặn.'] }
];
var DH_HE_TEN = { 'Tu Vi': 'Tử Vi', 'Bat Tu': 'Bát Tự', 'Chiem Tinh': 'Chiêm tinh', 'Ha Lac': 'Hà Lạc', 'Than So': 'Thần số', 'HD': 'Human Design' };
var DH_TV_CUNG_NHOM = { 'Menh': 'tinh_cach', 'Tai Bach': 'tai_chinh', 'Quan Loc': 'cong_danh', 'Phu The': 'tinh_duyen', 'Tu Tuc': 'con_cai',
  'Tat Ach': 'suc_khoe', 'Phu Mau': 'gia_dao', 'Huynh De': 'gia_dao', 'Dien Trach': 'tai_chinh', 'No Boc': 'xa_hoi', 'Thien Di': 'xa_hoi', 'Phuc Duc': 'tam_linh' };
// Câu Tử Vi nói về "cấu trúc lá số" (cung kẹp, cung đối diện…) khó hiểu khi đứng riêng → không đưa vào phần tổng hợp
var DH_TV_BO = /(^|\s)(cung này|cung đối diện|kẹp|tam hợp|nhị hợp|chính tinh|vô chính diệu|tuần|triệt)(\s|$|,|\.)/i;
var DH_TV_CUNG_TEN = { 'Mệnh': ['Menh', 'bản thân'], 'Huynh Đệ': ['Huynh De', 'anh chị em'], 'Phu Thê': ['Phu The', 'vợ chồng'], 'Tử Tức': ['Tu Tuc', 'con cái'],
  'Tài Bạch': ['Tai Bach', 'tiền bạc'], 'Tật Ách': ['Tat Ach', 'sức khỏe'], 'Thiên Di': ['Thien Di', 'ra ngoài, đi xa'], 'Nô Bộc': ['No Boc', 'bạn bè, cộng sự'],
  'Quan Lộc': ['Quan Loc', 'sự nghiệp'], 'Điền Trạch': ['Dien Trach', 'nhà cửa'], 'Phúc Đức': ['Phuc Duc', 'phúc phần, tinh thần'], 'Phụ Mẫu': ['Phu Mau', 'cha mẹ'] };
/** Mỗi cung Tử Vi đã được chấm điểm → thành một câu tổng quát cho phần tổng hợp */
function dhTuViDiem_(chiTiet) {
  var out = [];
  ((chiTiet && chiTiet.cung) || []).forEach(function (c) {
    var m = DH_TV_CUNG_TEN[c.cung]; if (!m || !isFinite(c.diem)) return;
    var x = dhD10_(c.diem), loai = dhLoai_(x);
    var f = taoFact_('Tu Vi', m[0], DH_TV_CUNG_NHOM[m[0]], loai,
      'Cung ' + c.cung + ' (' + m[1] + ') được chấm ' + String(x).replace('.', ',') + '/10 – mức ' + String(c.danhGia || '').toLowerCase() + '.', 3);
    f.tvDiem = true; out.push(f);
  });
  return out;
}
function dhTongHop_(facts) {
  var khoi = [];
  facts = facts.filter(function (f) {
    if (!f || !f.yNghia) return false;
    if (f.he !== 'Tu Vi') return true;
    if (DH_TV_BO.test(f.yNghia)) return false;
    if (DH_TV_CUNG_NHOM[f.linhVuc]) f.nhom = DH_TV_CUNG_NHOM[f.linhVuc];
    // Ngoài cung Mệnh, câu "Bạn …" là tính chất sao (thường tả người/việc của cung đó) – dễ gây hiểu nhầm khi gộp
    if (!f.tvDiem && f.nhom !== 'tinh_cach' && /^Bạn\s(?!có xu hướng)/.test(dhBoTenSao_(f.yNghia))) return false;
    // Câu mô tả sao vòng Trường Sinh / Thái Tuế ("Bệnh Phù (bệnh tật): …") là tính chất chung, không nói riêng về lĩnh vực → bỏ khỏi phần gộp
    if (!f.tvDiem && f.nhom !== 'tinh_cach' && /^[^:—.]{2,25}\([^)]*\):/.test(f.yNghia)) return false;
    return true;
  });
  DH_TH_NHOM.forEach(function (N) {
    var ds = facts.filter(function (f) { return f.nhom === N.k; });
    if (!ds.length) return;
    var heM = {}, heY = {}, heAll = {}, wM = 0, wY = 0, wT = 0;
    ds.forEach(function (f) {
      heAll[f.he] = 1; var w = Math.abs(Number(f.trongSo) || 1);
      if (f.loai === 'manh') { heM[f.he] = 1; wM += w; } else if (f.loai === 'yeu') { heY[f.he] = 1; wY += w; } else wT += w;
    });
    var nAll = Object.keys(heAll).length, nM = Object.keys(heM).length, nY = Object.keys(heY).length;
    // Điểm /10: 5 là cân bằng; càng nhiều điểm thuận (có trọng số) càng gần 10
    // nhận định trung tính tính nửa trọng số ở mẫu số → vài câu "yếu" không kéo điểm xuống sát 0 khi các hệ khác chỉ mô tả trung tính
    var d10 = Math.round((5 + 5 * (wM - wY) / (wM + wY + wT * 0.5 + 1)) * 10) / 10;
    function chon(loai, max, boTuVi) {
      var daHe = {}, kq = [];
      ds.filter(function (f) { return f.loai === loai && !(boTuVi && f.he === 'Tu Vi' && !f.tvDiem); })
        .sort(function (a, b) { return Math.abs(b.trongSo) - Math.abs(a.trongSo); }).forEach(function (f) {
          if (daHe[f.he] || kq.length >= max) return; daHe[f.he] = 1;
          var t = f.he === 'Tu Vi' ? dhBoTenSao_(f.yNghia) : f.yNghia;
          kq.push(dhCau_(t) + ' (' + DH_HE_TEN[f.he] + ')');
        });
      return kq;
    }
    var tot = chon('manh', 5), xau = chon('yeu', 5), khac = chon('trung', 4, true);
    var xu = d10 >= 7.5 ? 'rất thuận lợi' : d10 >= 6 ? 'nhìn chung thuận lợi' : d10 >= 4.5 ? 'cân bằng giữa thuận lợi và thử thách' : d10 >= 3 ? 'nghiêng về khó khăn' : 'là điểm yếu rõ của lá số';
    var tt = 'Có ' + nAll + ' trên 6 hệ cùng nói về ' + N.ten.toLowerCase() + '. Gộp lại, lĩnh vực này ' + xu + ' (' + String(d10).replace('.', ',') + '/10).';
    if (nM >= 3) tt += ' Điểm thuận được ' + nM + ' hệ cùng xác nhận – đây là phần đáng tin cậy nhất.';
    if (nY >= 3) tt += ' Điểm yếu cũng được ' + nY + ' hệ cùng nhắc – đây là phần dễ xảy ra nhất.';
    if (nM >= 2 && nY >= 2) tt += ' Thuận và khó cùng xuất hiện: lĩnh vực này có cả cơ hội lẫn rủi ro thật.';
    var doan = [dhDoan_('Tóm tắt', tt)];
    if (tot.length) doan.push(dhDoan_('Điều nhiều hệ cùng thấy tốt', '', tot));
    if (xau.length) doan.push(dhDoan_('Điều cần lưu ý', '', xau));
    if (khac.length) doan.push(dhDoan_('Các hệ khác mô tả thêm', '', khac));
    doan.push(dhDoan_('Lời khuyên', '', N.loi.slice()));
    khoi.push({ ten: N.ten, nhom: N.k, diem: d10, soHe: nAll, doan: doan });
  });
  return khoi;
}

/**
 * Hàm chính – gọi trong lapMoRong_ (Code.gs). Trả về văn dễ hiểu từng hệ + tổng hợp 6 hệ.
 * C = { tv, chiTiet, bt, btct, ct, ts, tsl, hdOut, hl }
 */
function deHieuLap_(C) {
  var out = {}, all = [];
  function chay(k, f) { try { var r = f(); if (r) { out[k] = { he: r.he, khoi: r.khoi }; all = all.concat(r.facts || []); } } catch (e) { out[k] = { loi: String(e && e.message || e) }; } }
  chay('battu', function () { return dhBatTu_(C.bt, C.btct); });
  chay('chiemTinh', function () { return dhChiemTinh_(C.ct, C.ctl); });
  chay('thanSo', function () { return dhThanSo_(C.ts, C.tsl); });
  chay('hd', function () { return dhHD_(C.hdOut); });
  chay('haLac', function () { return dhHaLac_(C.hl); });
  var tv = [];
  try { tv = dhTuViDiem_(C.chiTiet).concat(dhTuViFacts_(C.tv)); } catch (e) { tv = []; }
  all = tv.concat(all);
  out.tongHop = dhTongHop_(all);
  try { out.th6 = th6Lap_(C); } catch (e) { out.th6 = { loi: String(e && e.message || e) }; }
  out.soFacts = { tuVi: tv.length, tong: all.length };
  return out;
}

/* ============================================================
 *  7. TỔNG HỢP 6 HỆ (bản 2) – ghép PHÂN TÍCH CHI TIẾT của từng hệ theo 9 lĩnh vực
 *  Mỗi lĩnh vực lấy: điểm /10 + câu văn dễ hiểu của Tử Vi (điểm cung), Bát Tự (12 lĩnh vực),
 *  Hà Lạc (lục thân 8 lĩnh vực), Chiêm tinh (8 lĩnh vực); Thần số và HD góp góc nhìn (không chấm điểm).
 *  → điểm chung (trung bình có trọng số), độ đồng thuận (số hệ cùng chiều), kết luận hai tầng,
 *    điểm sáng / điều cần lưu ý (ghi rõ hệ), lời khuyên, năm nổi bật sắp tới và đã qua (Biến cố hội tụ).
 * ============================================================ */
var TH6_LV = [
  { k: 'tinh_cach', ten: 'Tính cách & con người', icon: '🧭', tv: ['Mệnh'], bt: ['Mệnh'], hl: ['banThan'], ct: ['tinhCach'], ts: 'tinhCach', hd: 'chienLuoc', hoi: [] },
  { k: 'cong_danh', ten: 'Công danh – sự nghiệp', icon: '🏛', tv: ['Quan Lộc'], bt: ['Quan Lộc'], hl: ['congDanh'], ct: ['suNghiep'], ts: 'suNghiep', hd: 'suNghiep', hoi: ['quanLoc'] },
  { k: 'tai_chinh', ten: 'Tiền bạc – tài sản', icon: '💰', tv: ['Tài Bạch', 'Điền Trạch'], bt: ['Tài Bạch', 'Điền Trạch'], hl: ['tienBac'], ct: ['taiChinh'], ts: 'suNghiep', tsLoc: /^Tài chính/, hoi: ['taiLoc', 'taiChinh'] },
  { k: 'tinh_duyen', ten: 'Tình duyên – hôn nhân', icon: '💞', tv: ['Phu Thê'], bt: ['Phu Thê'], hl: ['honNhan'], ct: ['tinhYeu'], ts: 'tinhDuyen', hd: 'quanHe', hoi: ['ketHon'] },
  { k: 'con_cai', ten: 'Con cái', icon: '👶', tv: ['Tử Tức'], bt: ['Tử Tức'], hl: ['conCai'], hoi: ['sinhCon'] },
  { k: 'suc_khoe', ten: 'Sức khỏe', icon: '🌿', tv: ['Tật Ách'], bt: ['Tật Ách'], hl: ['sucKhoe'], ct: ['sucKhoe'], ts: 'sucKhoe', hd: 'sucKhoe', hoi: ['sucKhoe'] },
  { k: 'gia_dao', ten: 'Gia đình – cha mẹ – anh em', icon: '🏠', tv: ['Phụ Mẫu', 'Huynh Đệ'], bt: ['Phụ Mẫu', 'Huynh Đệ'], hl: ['chaMe', 'anhEm'], ct: ['camXuc'], hoi: ['giaDao'] },
  { k: 'xa_hoi', ten: 'Bạn bè – quý nhân – đi xa', icon: '🤝', tv: ['Nô Bộc', 'Thiên Di'], bt: ['Nô Bộc', 'Thiên Di'], hd: 'quanHe', hoi: ['buocNgoat'] },
  { k: 'tam_linh', ten: 'Đời sống tinh thần – bài học', icon: '🕯', tv: ['Phúc Đức'], bt: ['Phúc Đức'], ts: 'linhHon', hd: 'baiHoc', ctNut: true, hoi: [] }
];
var TH6_W = { 'Tử Vi': 1.2, 'Bát Tự': 1.1, 'Chiêm tinh': 1.0, 'Hà Lạc': 0.8 };
/** Câu Tử Vi theo cung và mức (thuận / vừa / cần lưu ý) – viết riêng cho phần tổng hợp, không nêu tên sao */
var TH6_TV_CAU = {
  'Mệnh': ['Bạn có nền tảng bản thân vững, dễ được người khác tin cậy; mặt trái là dễ tự tin quá mức, ít chịu nghe góp ý.', 'Bạn có nền tảng bản thân ở mức khá: không nổi bật sẵn, thành công đến từ rèn luyện; lơ là là tụt lại.', 'Bạn có xu hướng phải tự nỗ lực nhiều hơn người khác để khẳng định mình, dễ tự ti và mệt mỏi; mặt tốt là bản lĩnh có được là của chính bạn.'],
  'Quan Lộc': ['Đường công danh thuận, dễ có vị trí và được ghi nhận; mặt trái là áp lực, trách nhiệm lớn và dễ bị ghen tị.', 'Công việc lên xuống theo giai đoạn, có lúc chững lại hoặc phải đổi chỗ; cần kiên trì và chọn đúng thời điểm.', 'Bạn có xu hướng thử vài hướng đi trước khi tìm được chỗ đứng, có giai đoạn thất nghiệp hoặc làm trái nghề; mặt tốt là tích được nhiều kỹ năng. Gợi ý: giữ một chuyên môn chắc.'],
  'Tài Bạch': ['Tiền bạc đến tương đối thuận, có khả năng tích lũy; mặt trái là dễ tiêu rộng tay hoặc bị người khác vay mượn.', 'Tài chính đủ dùng nhưng khó dư dả; không có kế hoạch thì cuối tháng vẫn hụt.', 'Tiền bạc có xu hướng vào ra thất thường, dễ hụt khi có việc gấp và dễ mất vì đầu tư sai; mặt tốt là bạn xoay xở nhanh. Gợi ý: lập quỹ dự phòng.'],
  'Điền Trạch': ['Bạn có xu hướng thuận về chuyện nhà cửa, chỗ ở; mặt trái là tài sản lớn kéo theo chuyện giấy tờ, chia chác.', 'Nhà cửa có được nhờ tích lũy dần, phải chờ lâu hoặc gánh nợ một thời gian.', 'Chuyện nhà cửa đến chậm, có thể đổi chỗ ở nhiều lần, ở thuê lâu hoặc vướng giấy tờ nhà đất; mặt tốt là bạn linh hoạt nơi ở. Gợi ý: chọn chỗ ở vừa sức trước.'],
  'Phu Thê': ['Chuyện tình cảm có xu hướng thuận, người đồng hành dễ là chỗ dựa; mặt trái là dựa nhau nhiều nên biến cố đến thì hụt hẫng.', 'Chuyện tình cảm có lúc thuận lúc nghịch, có những giai đoạn nhạt hoặc căng thẳng thật.', 'Chuyện tình cảm nhiều trắc trở: dễ muộn duyên, chọn nhầm người hoặc hôn nhân có giai đoạn lạnh nhạt, xa cách; mặt tốt là bạn sống độc lập được. Gợi ý: tìm hiểu kỹ trước khi gắn bó.'],
  'Tử Tức': ['Chuyện con cái có xu hướng thuận, gắn bó với con dễ mang lại niềm vui; mặt trái là dễ nuông chiều, bao bọc quá mức.', 'Chuyện con cái bình thường: có vui, có lo, có lúc hai thế hệ không hiểu nhau.', 'Chuyện con cái vất vả: có thể muộn con, con khó dạy hoặc xa cách cha mẹ; mặt tốt là công sức bỏ ra thường được đền đáp về sau. Gợi ý: lắng nghe con nhiều hơn răn dạy.'],
  'Tật Ách': ['Nền tảng sức khỏe có xu hướng vững; mặt trái là dễ chủ quan, làm quá sức và bỏ qua dấu hiệu bệnh sớm.', 'Sức khỏe ở mức vừa, có lúc mệt mỏi kéo dài; nên nghỉ ngơi đủ và khám định kỳ.', 'Sức khỏe là điểm yếu: dễ ốm vặt, suy nhược, bệnh dễ dây dưa nếu không chăm sóc; mặt tốt là bạn biết giữ gìn sớm. Gợi ý: khám định kỳ, hỏi bác sĩ khi có dấu hiệu lạ.'],
  'Phụ Mẫu': ['Lá số gợi ý được cha mẹ che chở, nâng đỡ; mặt trái là dễ chậm tự lập hoặc chịu sự sắp đặt – bạn hãy tự đối chiếu.', 'Lá số gợi ý quan hệ với cha mẹ ở mức bình thường, có lúc xa cách, có lúc phải tự lo – bạn hãy tự đối chiếu.', 'Lá số gợi ý bạn ít được nhờ cha mẹ, sớm tự lập, quan hệ với bề trên dễ căng – bạn hãy tự đối chiếu; mặt tốt là bạn cứng cáp sớm.'],
  'Huynh Đệ': ['Lá số gợi ý anh chị em hòa thuận, có lúc nâng đỡ nhau; mặt trái là chuyện của anh em dễ kéo bạn vào.', 'Lá số gợi ý anh chị em mỗi người tự lo, qua lại vừa phải, ít nhờ cậy được nhau.', 'Lá số gợi ý anh chị em dễ có khoảng cách, cạnh tranh hoặc va chạm vì tiền; mặt tốt là bạn tự lực sớm. Gợi ý: tiền nong với người thân luôn rõ ràng.'],
  'Nô Bộc': ['Có bạn bè, cộng sự tốt giúp đỡ; mặt trái là quen dựa vào họ nên khi họ rời đi việc dễ chững lại.', 'Bạn bè ở mức vừa phải: có người tốt, có người chỉ đến khi có lợi.', 'Bạn có xu hướng hay bị phụ lòng trong hợp tác: cộng sự bỏ ngang, bạn bè vay không trả, dễ bị lấy công; mặt tốt là người bạn chọn kỹ thì rất bền. Gợi ý: thỏa thuận rõ từ đầu.'],
  'Thiên Di': ['Ra ngoài, đi xa dễ gặp may và người giúp; mặt trái là mải bên ngoài dễ xa gia đình.', 'Đi xa thuận hay không tùy giai đoạn; có chuyến được, có chuyến hao tiền tốn sức.', 'Ra ngoài dễ gặp trục trặc: lạ nước lạ cái, khó hòa nhập, có thể thiệt về tiền hoặc gặp người xấu nơi xa; mặt tốt là bạn thạo đời dần. Gợi ý: chuẩn bị kỹ và có người quen dẫn đường.'],
  'Phúc Đức': ['Có phúc phần, đời sống tinh thần an ổn; mặt trái là dễ ỷ lại, ít tự rèn.', 'Phúc phần ở mức vừa: có lúc được giúp, có lúc phải tự gánh; tinh thần có giai đoạn trĩu nặng.', 'Bạn có xu hướng hay lo nghĩ, bất an, gặp khó ít được che chở; mặt tốt là bạn tự xây được điểm tựa riêng. Gợi ý: dành ít phút tĩnh tâm mỗi ngày.']
};
function th6Huong_(d) { return d >= 6.2 ? 'tot' : d <= 4.3 ? 'xau' : 'vua'; }
/** Ngưỡng cho điểm CHUNG của lĩnh vực: trung bình nhiều hệ dồn về giữa nên ngưỡng hẹp hơn */
function th6HuongChung_(d) { return d >= 6 ? 'tot' : d <= 4.8 ? 'xau' : 'vua'; }
function th6Gon_(s) {
  return dhSach_(s).replace(/\s*\((Đường Đời|Nhân Cách|Linh Hồn|Ngày Sinh|Định Mệnh|Thái Độ|Thách Thức|Nợ nghiệp|Món nợ công sức|Bài học mang theo|Đỉnh Cao|số vắng)[^)]*\)/gi, '')
    .replace(/\s*\([A-Z][A-Za-z\- ]+\)/g, '').replace(/\s+([,.;:])/g, '$1').trim();
}
function th6Lap_(C) {
  var tv = C.tv, vy = tv.info.viewYear, cungTV = {}, lvBT = {};
  ((C.chiTiet && C.chiTiet.cung) || []).forEach(function (c) { cungTV[c.cung] = c; });
  ((C.btct && C.btct.linhVuc) || []).forEach(function (l) { lvBT[l.key] = l; });
  var HL = {}, CT = {}, TS = {}, HD = {};
  (((C.hl && C.hl.luan) || {}).linhVuc || []).forEach(function (x) { HL[x.k] = x; });
  (((C.ctl && C.ctl.phanTich) || {}).linhVuc || []).forEach(function (x) { CT[x.k] = x; });
  ((C.ts && C.ts.phanTich && C.ts.phanTich.luan) || []).forEach(function (x) { TS[x.k] = x; });
  ((C.hdOut && C.hdOut.phanTich && C.hdOut.phanTich.tongHop) || []).forEach(function (x) { HD[x.k] = x; });
  var H = (C.th && C.th.hoiTu) || { chuDe: [] }, CD = {}; (H.chuDe || []).forEach(function (c) { CD[c.k] = c; });
  var ketQua = TH6_LV.map(function (L) {
    var sig = [];
    (L.tv || []).forEach(function (ten) { var c = cungTV[ten]; if (!c || !isFinite(c.diem)) return; var d = chuanHoa10_(c.diem), h = th6Huong_(d); sig.push({ he: 'Tử Vi', nguon: 'cung ' + ten, d10: d, huong: h, t: TH6_TV_CAU[ten] ? TH6_TV_CAU[ten][['tot', 'vua', 'xau'].indexOf(h)] : '' }); });
    (L.bt || []).forEach(function (key) {
      var l = lvBT[key]; if (!l) return;
      var kl = (l.secs || []).filter(function (s) { return /Kết luận/.test(s.tieuDe); })[0], it = kl ? kl.items : [];
      var m = String(it[0] || '').match(/\(([\d.]+)\/10\)/), d = m ? +m[1] : chuanHoa10_(l.diem);
      sig.push({ he: 'Bát Tự', nguon: l.ten, d10: d, huong: th6Huong_(d), t: dhCau_(String(it[1] || '').replace(/\s*Muốn "thuận mệnh".*$/, '')) });
    });
    (L.hl || []).forEach(function (k) { var x = HL[k]; if (!x) return; var d = chuanHoa10_(x.diem * 1.5); sig.push({ he: 'Hà Lạc', nguon: x.ten, d10: d, huong: th6Huong_(d), t: x.van, khuyen: x.khuyen }); });
    var ctMoTa = [];
    (L.ct || []).forEach(function (k) { var x = CT[k]; if (!x) return; var d = chuanHoa10_(x.diem * 1.8); sig.push({ he: 'Chiêm tinh', nguon: x.ten, d10: d, huong: th6Huong_(d), t: '', khuyen: x.khuyen }); ctMoTa.push(x.tron); });
    // gộp theo hệ (một hệ có 2 nguồn → trung bình) để mỗi hệ chỉ có một phiếu
    var theoHe = {};
    sig.forEach(function (s) { (theoHe[s.he] = theoHe[s.he] || []).push(s); });
    var phieu = Object.keys(theoHe).map(function (he) {
      var a = theoHe[he], d = Math.round(a.reduce(function (t, s) { return t + s.d10; }, 0) / a.length * 10) / 10;
      return { he: he, d10: d, huong: th6Huong_(d), nguon: a.map(function (s) { return s.nguon; }).join(', ') };
    });
    var wT = 0, sT = 0; phieu.forEach(function (p) { var w = TH6_W[p.he] || 1; wT += w; sT += p.d10 * w; });
    var diem = wT ? Math.round(sT / wT * 10) / 10 : 5, huong = th6HuongChung_(diem);
    var dong = phieu.filter(function (p) { return p.huong === huong; }).length;
    var chieu = huong === 'vua' ? phieu.filter(function (p) { return p.huong !== 'vua'; }).length : dong;
    // câu tốt / câu cần lưu ý (mỗi hệ một câu, bỏ trùng)
    var da = {};
    function chon(h, n, sx) {
      return sig.filter(function (s) { return s.huong === h && s.t; }).sort(sx).filter(function (s) { if (da[s.t]) return false; da[s.t] = 1; return true; })
        .filter(function (s, i, a) { return a.map(function (x) { return x.he; }).indexOf(s.he) === i; }).slice(0, n).map(function (s) { return { he: s.he, t: dhCau_(s.t) }; });
    }
    var manh = chon('tot', 3, function (a, b) { return b.d10 - a.d10; }), yeu = chon('xau', 3, function (a, b) { return a.d10 - b.d10; });
    var them = [];
    if (ctMoTa[0]) them.push({ he: 'Chiêm tinh', t: ctMoTa[0] });
    if (L.ts && TS[L.ts]) { var it = TS[L.ts].items.filter(function (x) { return !L.tsLoc || L.tsLoc.test(dhSach_(x)); })[0] || TS[L.ts].items[0]; if (it) them.push({ he: 'Thần số', t: dhCau_(th6Gon_(it)) }); }
    if (L.hd && HD[L.hd] && HD[L.hd].items[0]) them.push({ he: 'Human Design', t: dhCau_(th6Gon_(HD[L.hd].items[0])) });
    if (L.ctNut && C.ctl && C.ctl.phanTich && C.ctl.phanTich.nut) them.push({ he: 'Chiêm tinh', t: C.ctl.phanTich.nut.tron });
    // kết luận hai tầng
    var soP = phieu.length, tieu = soP ? dong + '/' + soP + ' hệ' : '';
    // 16/11 (rà soát logic): chỉ gọi "thế mạnh"/"nên chăm chút" khi đủ chắc – ≥3 hệ chấm, ≥ nửa số hệ cùng chiều, không hệ nào ngược chiều.
    // Trước có 9,5% câu kiểu "thế mạnh – 1/4 hệ cùng chiều" (điểm chung bị một hệ điểm rất cao kéo lên).
    var nguoc = phieu.filter(function (p) { return (huong === 'tot' && p.huong === 'xau') || (huong === 'xau' && p.huong === 'tot'); }).length;
    var chac = huong !== 'vua' && soP >= 3 && dong * 2 >= soP && !nguoc;
    var coSoHe = soP <= 2 ? soP + ' hệ có chấm điểm lĩnh vực này' : tieu + ' cùng chiều';
    var ket = huong === 'tot' && chac ? 'Đây là một thế mạnh của bạn – ' + tieu + ' có điểm cùng chiều thuận; mặt trái là dễ chủ quan ở chính lĩnh vực này.' :
      huong === 'xau' && chac ? 'Đây là điểm yếu của bạn – ' + tieu + ' cùng nhắc; khó khăn ở đây dễ lặp lại nhiều lần trong đời.' :
      huong === 'tot' ? 'Lĩnh vực này nghiêng về thuận' + (soP ? ' (' + coSoHe + (nguoc ? ', có hệ nhìn khác chiều' : '') + ')' : '') + ' – nền tảng khá, nhưng vẫn có hệ chỉ ra mặt yếu; đọc từng hệ bên dưới.' :
      huong === 'xau' ? 'Lĩnh vực này nghiêng về cần chăm chút' + (soP ? ' (' + coSoHe + (nguoc ? ', có hệ nhìn thuận hơn' : '') + ')' : '') + ' – khó khăn có thật nhưng chưa đến mức nặng, vẫn có hệ chỉ ra mặt thuận.' :
      (!manh.length && yeu.length ? 'Lĩnh vực này nghiêng về thử thách – có khó khăn thật, chưa thấy điểm tựa rõ từ các hệ.' :
       manh.length && !yeu.length ? 'Lĩnh vực này nghiêng về thuận – có nền tảng tốt, nhưng chưa đủ mạnh để tự bứt lên nếu không nỗ lực.' :
       'Lĩnh vực này có cả thuận lẫn khó: có điểm mạnh thật và điểm yếu thật; kết quả phụ thuộc nhiều vào lựa chọn và thời điểm.');
    var noiBat = (huong === 'xau' ? yeu[0] || manh[0] : manh[0] || yeu[0]);
    var khuyen = [];
    sig.filter(function (s) { return s.khuyen; }).sort(function (a, b) { return huong === 'tot' ? b.d10 - a.d10 : a.d10 - b.d10; })
      .forEach(function (s) { if (khuyen.indexOf(s.khuyen) < 0 && khuyen.length < 2) khuyen.push(s.khuyen); });
    if (!khuyen.length) { var bt0 = sig.filter(function (s) { return s.he === 'Bát Tự' && s.t; })[0]; if (bt0) khuyen.push(dhCau_(bt0.t)); }
    // năm nổi bật sắp tới / đã qua
    var toi = [], qua = [];
    (L.hoi || []).forEach(function (k) {
      var c = CD[k]; if (!c) return;
      (c.dinh || []).forEach(function (x) { if (x.nam >= vy) toi.push({ k: c.k, nam: x.nam, tuoi: x.tuoi, soHe: x.soHe, he: x.he, tot: c.loai === 'tot', ten: c.ten }); });
      (c.qua || []).forEach(function (x) { qua.push({ k: c.k, nam: x.nam, soHe: x.soHe, he: x.he, tot: c.loai === 'tot', ten: c.ten }); });
    });
    toi.sort(function (a, b) { return a.nam - b.nam; });
    return { k: L.k, ten: L.ten, icon: L.icon, diem: diem, huong: huong, chac: chac, nguoc: nguoc, phieu: phieu, dong: dong, soHe: soP, chieu: chieu,
      doDong: soP ? Math.round(dong / soP * 100) : 0, ket: ket, noiBat: noiBat, manh: manh, yeu: yeu, them: them, khuyen: khuyen,
      namToi: toi.slice(0, 3), namQua: qua.sort(function (a, b) { return b.nam - a.nam; }).slice(0, 3) };
  });
  var xep = ketQua.slice().sort(function (a, b) { return b.diem - a.diem; });
  var theManh = xep.filter(function (x) { return x.diem >= 6; }).slice(0, 3), canChuY = xep.slice().reverse().filter(function (x) { return x.diem < 5; }).slice(0, 2);
  var doTin = Math.round(ketQua.reduce(function (t, x) { return t + x.doDong; }, 0) / ketQua.length);
  var namToi = []; ketQua.forEach(function (x) { x.namToi.forEach(function (n) { if (n.nam >= vy && n.nam <= vy + 5) namToi.push({ nam: n.nam, ten: n.ten, tot: n.tot, soHe: n.soHe, lv: x.ten }); }); });
  namToi.sort(function (a, b) { return a.nam - b.nam || b.soHe - a.soHe; });
  return {
    linhVuc: ketQua, theManh: theManh.map(function (x) { return x.ten; }), canChuY: canChuY.map(function (x) { return x.ten; }), doTin: doTin,
    tomTat: (theManh.filter(function (x) { return x.chac; }).length ? 'Thế mạnh nổi bật: ' + theManh.filter(function (x) { return x.chac; }).map(function (x) { return x.ten.toLowerCase(); }).join(', ') + '. ' : '') +
      (theManh.filter(function (x) { return !x.chac; }).length ? 'Nghiêng về thuận: ' + theManh.filter(function (x) { return !x.chac; }).map(function (x) { return x.ten.toLowerCase(); }).join(', ') + '. ' : '') +
      (canChuY.length ? 'Cần chăm chút: ' + canChuY.map(function (x) { return x.ten.toLowerCase(); }).join(', ') + '. ' : '') +
      'Mức đồng thuận trung bình giữa các hệ: ' + doTin + '%.',
    namToi: namToi.slice(0, 6),
    coSo: ['Mỗi lĩnh vực lấy điểm /10 của Tử Vi (cung tương ứng), Bát Tự (12 lĩnh vực), Hà Lạc (lục thân theo 6 hào) và Chiêm tinh (8 lĩnh vực); trọng số Tử Vi 1,2 · Bát Tự 1,1 · Chiêm tinh 1,0 · Hà Lạc 0,8.',
      'Điểm từng hệ: từ 6,2 là thuận, từ 4,3 trở xuống là cần lưu ý. Điểm chung (đã gộp): từ 6,0 là thuận, từ 4,8 trở xuống là cần lưu ý. "x/y hệ" = số hệ có điểm cùng chiều với kết luận chung.',
      'Thần số học và Human Design không chấm điểm lĩnh vực, được dùng làm "góc nhìn thêm". Năm nổi bật lấy từ Biến cố hội tụ (từ 3 hệ cùng báo).']
  };
}
