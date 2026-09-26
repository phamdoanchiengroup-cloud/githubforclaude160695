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
 *                     · Văn tầng 2 = hoàn cảnh theo mức mạnh/yếu, nhẹ nhàng, có hướng vượt qua
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
    tomTat: 'Bạn sinh vào ngày Giáp – hình tượng cây đại thụ vươn thẳng lên trời. Người Giáp thường ngay thẳng, có chí hướng và muốn làm chỗ dựa cho người khác.',
    banChat: 'Bạn thuộc mẫu người sống có nguyên tắc, nhìn xa, thích đi con đường rõ ràng và tự mình gây dựng. Giống cây lớn, bạn ít khi chịu "uốn mình" theo hoàn cảnh – điều đó cho bạn sự vững vàng, nhưng cũng khiến bạn đôi khi cứng nhắc.',
    manh: 'Chính trực, có trách nhiệm, thích che chở người yếu hơn; có khả năng tự lập và dẫn dắt; kiên trì theo đuổi mục tiêu dài hạn.',
    luuY: 'Dễ bảo thủ, khó thay đổi quan điểm; ngại xin giúp đỡ; khi bị ép buộc có thể phản ứng cứng rắn.',
    nghe: 'quản lý, giáo dục, xây dựng tổ chức, pháp lý, lâm nghiệp – cây trồng, các vai trò dẫn dắt dài hạn',
    loiKhuyen: ['Học cách lắng nghe và điều chỉnh – cây lớn đứng vững nhờ rễ sâu chứ không nhờ cứng thân.', 'Cho phép người khác giúp mình; tự lập không có nghĩa là một mình.', 'Chọn mục tiêu dài hạn và kiên nhẫn – bạn lớn lên chậm nhưng chắc.'] },
  { ten: 'Ất Mộc', hinh: 'hoa cỏ, dây leo',
    tomTat: 'Bạn sinh vào ngày Ất – hình tượng hoa cỏ, dây leo mềm mại. Người Ất thường khéo léo, linh hoạt và biết tìm đường vươn lên trong mọi hoàn cảnh.',
    banChat: 'Bạn thuộc mẫu người mềm mỏng bên ngoài nhưng dẻo dai bên trong. Bạn giỏi thích nghi, biết "uốn mình" để hợp với người và việc, và thường thành công nhờ kết nối đúng người, đúng môi trường.',
    manh: 'Khéo ăn nói, giỏi ngoại giao, có óc thẩm mỹ và sáng tạo; nhạy bén với cảm xúc người khác; bền bỉ, ít khi bỏ cuộc.',
    luuY: 'Dễ do dự, ngại va chạm; có xu hướng dựa dẫm hoặc để bụng thay vì nói thẳng.',
    nghe: 'nghệ thuật, thiết kế, tư vấn, dịch vụ khách hàng, ngoại giao – truyền thông, chăm sóc sắc đẹp',
    loiKhuyen: ['Chọn kỹ "giàn leo" – môi trường, người cộng sự, người bạn đời – vì đó là nơi bạn phát triển.', 'Tập nói điều mình muốn một cách nhẹ nhàng nhưng rõ ràng.', 'Tin vào sự mềm dẻo của mình: đó là sức mạnh, không phải yếu đuối.'] },
  { ten: 'Bính Hỏa', hinh: 'mặt trời',
    tomTat: 'Bạn sinh vào ngày Bính – hình tượng mặt trời rực rỡ. Người Bính thường nhiệt tình, cởi mở và mang năng lượng sưởi ấm những người xung quanh.',
    banChat: 'Bạn thuộc mẫu người hướng ra ngoài, thích chia sẻ, thích được làm việc có mục tiêu rõ ràng và được nhìn thấy. Như mặt trời, bạn cho đi rất tự nhiên và thường là người truyền cảm hứng trong tập thể.',
    manh: 'Nhiệt huyết, rộng lượng, lạc quan; ý chí tiến thủ mạnh; có sức hút và tố chất lãnh đạo.',
    luuY: 'Dễ nóng vội, bộc trực quá mức; coi trọng thể diện; đôi khi ôm đồm, "cháy" hết năng lượng rồi mệt mỏi.',
    nghe: 'truyền thông, giảng dạy, lãnh đạo – quản lý, giải trí, kinh doanh hướng ngoại, năng lượng',
    loiKhuyen: ['Giữ nhịp nghỉ ngơi – mặt trời cũng có lúc lặn để hôm sau mọc lại.', 'Nói chậm lại một nhịp khi đang nóng giận.', 'Đặt năng lượng vào vài mục tiêu lớn thay vì dàn trải.'] },
  { ten: 'Đinh Hỏa', hinh: 'ngọn đèn, ngọn nến',
    tomTat: 'Bạn sinh vào ngày Đinh – hình tượng ngọn đèn, ngọn nến soi sáng trong bóng tối. Người Đinh thường tinh tế, sâu sắc và bền bỉ một cách lặng lẽ.',
    banChat: 'Bạn thuộc mẫu người nhạy cảm, có trực giác tốt, quan tâm đến chi tiết và cảm xúc của người khác. Ánh sáng của bạn không chói lóa nhưng ấm áp và lâu bền – bạn hay là người giúp người khác "tìm được lối đi".',
    manh: 'Chu đáo, tinh ý, giàu cảm xúc; kiên trì âm thầm; có khả năng dạy dỗ, tư vấn, nuôi dưỡng tinh thần người khác.',
    luuY: 'Dễ lo nghĩ, đa cảm, hay giữ trong lòng; dễ tổn thương khi không được thấu hiểu.',
    nghe: 'giáo dục, nghiên cứu, tư vấn – tâm lý, y tế, nghệ thuật, văn hóa, công việc cần sự tỉ mỉ',
    loiKhuyen: ['Bảo vệ "ngọn lửa" của mình: tránh môi trường quá nhiều gió (căng thẳng, thị phi).', 'Chia sẻ cảm xúc với người tin cậy thay vì ôm một mình.', 'Tin vào trực giác – nó thường đúng hơn bạn nghĩ.'] },
  { ten: 'Mậu Thổ', hinh: 'núi lớn, đất dày',
    tomTat: 'Bạn sinh vào ngày Mậu – hình tượng ngọn núi, lớp đất dày. Người Mậu thường vững vàng, đáng tin cậy và là chỗ dựa cho người xung quanh.',
    banChat: 'Bạn thuộc mẫu người điềm tĩnh, giữ chữ tín, thích sự ổn định và rõ ràng. Như ngọn núi, bạn ít dao động trước sóng gió, biết đặt giới hạn và bảo vệ những gì mình trân trọng.',
    manh: 'Trung thực, bao dung, chịu đựng tốt; biết giữ gìn tài sản và các mối quan hệ; làm việc chắc chắn, có trách nhiệm.',
    luuY: 'Chậm thay đổi, đôi khi cố chấp; ít bày tỏ cảm xúc nên người khác khó hiểu mình.',
    nghe: 'bất động sản, xây dựng, quản trị – hành chính, tài chính – bảo hiểm, nông nghiệp',
    loiKhuyen: ['Mở lòng với cái mới – núi vững nhưng cây trên núi vẫn cần đổi mùa.', 'Nói ra cảm xúc thay vì chỉ thể hiện bằng hành động.', 'Tận dụng sự đáng tin của mình để xây dựng các mối hợp tác lâu dài.'] },
  { ten: 'Kỷ Thổ', hinh: 'ruộng vườn màu mỡ',
    tomTat: 'Bạn sinh vào ngày Kỷ – hình tượng thửa ruộng màu mỡ. Người Kỷ thường biết nuôi dưỡng, thấu hiểu và chăm chút cho người khác cùng lớn lên.',
    banChat: 'Bạn thuộc mẫu người khéo léo, chu đáo, hay nhìn thấy điểm tốt ở người khác và sẵn lòng bỏ qua lỗi lầm. Bạn giỏi sắp xếp, gắn kết con người và công việc lại với nhau.',
    manh: 'Chăm chỉ, tận tụy, giỏi tổ chức; bao dung, dễ gần; có tài chăm sóc và vun đắp.',
    luuY: 'Dễ do dự, thiếu quyết đoán khi cần nhanh; hay ôm việc, lo nghĩ nhiều; đôi khi quên chăm sóc chính mình.',
    nghe: 'nhân sự, giáo dục, y tế – chăm sóc, dịch vụ, quản lý vận hành, nông nghiệp – thực phẩm',
    loiKhuyen: ['Chăm "ruộng" của chính mình trước: sức khỏe, thời gian, tài chính cá nhân.', 'Đặt thời hạn cho quyết định để tránh chần chừ.', 'Chọn cộng sự quyết đoán để bù cho nhau.'] },
  { ten: 'Canh Kim', hinh: 'thanh kiếm, sắt thép',
    tomTat: 'Bạn sinh vào ngày Canh – hình tượng thanh kiếm, khối sắt thép. Người Canh thường quyết đoán, dũng cảm và trọng nghĩa khí.',
    banChat: 'Bạn thuộc mẫu người thẳng thắn, yêu ghét rõ ràng, không lùi bước trước khó khăn. Như thép phải qua lửa mới thành kiếm, bạn trưởng thành mạnh nhất qua thử thách.',
    manh: 'Kiên cường, kỷ luật, trung thành; dám đứng ra bảo vệ lẽ phải và người yếu; chịu được gian khổ.',
    luuY: 'Nói thẳng dễ làm mất lòng; cứng rắn, nóng tính; khó chấp nhận ý kiến trái chiều.',
    nghe: 'kỹ thuật – cơ khí, quân đội – công an, luật, quản lý, thể thao, phẫu thuật, tài chính',
    loiKhuyen: ['Mài giũa cách nói – lưỡi kiếm sắc cần có vỏ.', 'Chọn trận chiến đáng chiến; không phải chuyện gì cũng cần thắng.', 'Dùng sự kiên cường để dẫn dắt, không phải để áp đặt.'] },
  { ten: 'Tân Kim', hinh: 'trang sức, kim loại quý',
    tomTat: 'Bạn sinh vào ngày Tân – hình tượng món trang sức, kim loại quý đã được mài giũa. Người Tân thường tinh tế, có thẩm mỹ và sắc sảo.',
    banChat: 'Bạn thuộc mẫu người chú trọng chi tiết, hình ảnh và chất lượng. Bạn có con mắt tinh tường, ăn nói có duyên, và luôn muốn mọi thứ thật chỉn chu.',
    manh: 'Tỉ mỉ, chính xác, có gu thẩm mỹ; nhanh trí, giỏi phân tích; có khí chất thu hút.',
    luuY: 'Cầu toàn, dễ tự tạo áp lực; nhạy cảm với lời chê; đôi khi mải chi tiết mà quên bức tranh lớn.',
    nghe: 'tài chính – ngân hàng, thiết kế, làm đẹp – thời trang, trang sức, phân tích, luật, công nghệ chính xác',
    loiKhuyen: ['Chấp nhận "đủ tốt" ở những việc nhỏ để dành sức cho việc lớn.', 'Lời góp ý không phải lời chê – hãy lấy phần hữu ích.', 'Đầu tư vào môi trường đẹp, sạch – đó là nơi bạn tỏa sáng.'] },
  { ten: 'Nhâm Thủy', hinh: 'sông lớn, biển cả',
    tomTat: 'Bạn sinh vào ngày Nhâm – hình tượng dòng sông lớn, biển cả. Người Nhâm thường thông minh, linh hoạt và có tầm nhìn rộng.',
    banChat: 'Bạn thuộc mẫu người luôn chuyển động, ham khám phá, thích tự do và ghét bị gò bó. Bạn phản ứng nhanh, giỏi xoay xở và thường nghĩ bằng đầu nhiều hơn bằng tim.',
    manh: 'Nhanh trí, giao tiếp tốt, nhiều ý tưởng; thích nghi nhanh; có óc chiến lược và kinh doanh.',
    luuY: 'Dễ phân tán, thiếu tập trung; khó chịu với khuôn phép; đôi khi thay đổi quá nhanh làm người khác theo không kịp.',
    nghe: 'kinh doanh – thương mại, logistics – xuất nhập khẩu, truyền thông, du lịch, tư vấn chiến lược, công nghệ',
    loiKhuyen: ['Đắp "bờ" cho dòng sông: kế hoạch, thời hạn, người đồng hành giúp bạn chảy đúng hướng.', 'Hoàn thành trước khi bắt đầu việc mới.', 'Dành thời gian tĩnh lặng – nước lặng mới soi rõ.'] },
  { ten: 'Quý Thủy', hinh: 'mưa, sương',
    tomTat: 'Bạn sinh vào ngày Quý – hình tượng hạt mưa, màn sương len lỏi thấm vào vạn vật. Người Quý thường có trực giác tốt, sâu sắc và dịu dàng.',
    banChat: 'Bạn thuộc mẫu người hướng nội, quan sát nhiều hơn nói, thấu hiểu tâm lý người khác rất nhanh. Bạn làm việc âm thầm nhưng bền bỉ, và thường có hoài bão lớn giữ kín trong lòng.',
    manh: 'Trực giác nhạy, tinh tế; nói năng nhẹ nhàng, dễ được yêu mến; kiên nhẫn, biết chờ thời.',
    luuY: 'Dễ lo âu, thiếu tự tin; hay giữ bí mật nên người khác khó hiểu; đôi khi thụ động chờ đợi quá lâu.',
    nghe: 'nghiên cứu, tư vấn – tâm lý, y dược, nghệ thuật – viết lách, công việc phía sau hậu trường, chiến lược',
    loiKhuyen: ['Tin vào trực giác nhưng kiểm chứng bằng hành động nhỏ.', 'Chủ động nắm cơ hội thay vì chờ "thời điểm hoàn hảo".', 'Chọn bạn đồng hành tích cực – bạn dễ thấm năng lượng của người xung quanh.'] }
];
var DH_BT_THE = {
  vuong: 'Năng lượng bản thân của bạn khá dồi dào – bạn tự lập, gánh được việc lớn và ít khi dựa vào người khác. Điều cần làm là "xả" bớt năng lượng đúng chỗ: qua công việc, sáng tạo, cho đi và hợp tác, tránh để nó biến thành cố chấp hay nóng nảy.',
    trungVuong: 'Năng lượng bản thân của bạn khá cân bằng, hơi nghiêng về mạnh – đây là thế thuận lợi: bạn vừa tự chủ vừa biết phối hợp, gánh được trách nhiệm mà không quá cứng nhắc.',
    trungNhuoc: 'Năng lượng bản thân của bạn khá cân bằng, hơi nghiêng về mềm – bạn biết lắng nghe, dễ hòa hợp; chỉ cần thêm chút chủ động và một môi trường ổn định là phát huy tốt.',
    nhuoc: 'Năng lượng bản thân của bạn cần được bồi đắp – bạn làm tốt nhất khi có người nâng đỡ, môi trường ổn định và được học hỏi liên tục. Đừng ôm quá nhiều việc cùng lúc; chọn đúng người đồng hành sẽ giúp bạn đi xa hơn nhiều.' };
var DH_BT_HANH = {
  'Mộc': { ban: 'sự phát triển, học hỏi và lòng nhân hậu', lam: 'trồng cây, đọc sách, học kỹ năng mới, đi bộ nơi nhiều cây xanh; làm việc có tính gieo trồng – phát triển lâu dài' },
  'Hỏa': { ban: 'nhiệt huyết, sự giao tiếp và ánh sáng', lam: 'vận động buổi sáng, đón nắng, giao lưu, giữ không gian sáng sủa; làm việc cần truyền cảm hứng, trình bày, kết nối' },
  'Thổ': { ban: 'sự ổn định, tin cậy và nền tảng vững chắc', lam: 'sinh hoạt điều độ, tích lũy đều đặn, giữ nhà cửa ngăn nắp, gần gũi thiên nhiên đất đai; làm việc cần sự bền bỉ, quản lý' },
  'Kim': { ban: 'kỷ luật, sự rõ ràng và quyết đoán', lam: 'lập kế hoạch, làm theo quy trình, chơi thể thao có luật, giữ lời hứa, giữ không gian gọn gàng; làm việc cần chính xác, nguyên tắc' },
  'Thủy': { ban: 'trí tuệ, sự linh hoạt và giao lưu', lam: 'đọc – suy ngẫm, bơi lội, đi du lịch gần sông biển, mở rộng quan hệ; làm việc cần tư duy, di chuyển, trao đổi thông tin' } };
var DH_BT_TT = {
  'Tỷ Kiếp': { ten: 'tự lập – anh em bạn bè', manh: 'Bạn có tinh thần tự lập cao, ý chí mạnh và nhiều bạn bè, anh em cùng chí hướng.', luuY: 'Dễ cạnh tranh, ngại nhờ vả; tiền bạc dễ bị chia sẻ hoặc hao vì bạn bè – nên rõ ràng trong hợp tác.' },
  'Thực Thương': { ten: 'sáng tạo – thể hiện', manh: 'Bạn có tài năng thể hiện: ăn nói, sáng tạo, nghệ thuật, nghĩ ra cách làm mới.', luuY: 'Đôi khi nói thẳng, thích phản biện, không ưa khuôn phép – cần chọn lời và chọn lúc.' },
  'Tài': { ten: 'kiếm tiền – thực tế', manh: 'Bạn có đầu óc thực tế, nhạy với cơ hội và biết quản lý tiền bạc, tài sản.', luuY: 'Dễ bị cuốn vào vật chất hoặc làm quá sức vì tiền – nhớ cân bằng với sức khỏe và gia đình.' },
  'Quan Sát': { ten: 'kỷ luật – trách nhiệm', manh: 'Bạn có tinh thần trách nhiệm, kỷ luật và khả năng chịu áp lực, hợp với vai trò có cấp bậc, quản lý.', luuY: 'Dễ tự gây áp lực, lo lắng về đánh giá của người khác – hãy học cách buông bớt.' },
  'Ấn': { ten: 'học hỏi – được che chở', manh: 'Bạn ham học, có chiều sâu, thường được người lớn, thầy cô, quý nhân nâng đỡ.', luuY: 'Dễ ngại hành động, chờ đợi sự bảo bọc hoặc suy nghĩ quá nhiều trước khi làm.' } };
var DH_BT_TT_NHOM = { 'Tỷ Kiên': 'Tỷ Kiếp', 'Kiếp Tài': 'Tỷ Kiếp', 'Thực Thần': 'Thực Thương', 'Thương Quan': 'Thực Thương', 'Chính Tài': 'Tài', 'Thiên Tài': 'Tài', 'Chính Quan': 'Quan Sát', 'Thất Sát': 'Quan Sát', 'Chính Ấn': 'Ấn', 'Thiên Ấn': 'Ấn' };
/** 12 lĩnh vực theo Tứ Trụ – văn tầng 2 theo 5 mức (rất thuận → cần đặc biệt lưu tâm) */
var DH_BT_LV = {
  'Mệnh': ['Bản mệnh', ['Bản thân vững vàng, được trời phú nhiều thuận lợi – hãy dùng nó để đi xa.', 'Bản thân khá vững, có nền tảng tốt để phát triển.', 'Bản thân ở mức cân bằng – thành bại phụ thuộc nhiều vào nỗ lực và lựa chọn.', 'Bản thân gặp nhiều thử thách, nhưng đó là "lò rèn" giúp bạn trưởng thành.', 'Bản thân cần được bồi đắp nhiều – chăm sóc sức khỏe, tinh thần và chọn môi trường phù hợp là ưu tiên.']],
  'Phụ Mẫu': ['Cha mẹ – bề trên', ['Cha mẹ, người lớn là chỗ dựa lớn, nâng đỡ bạn nhiều.', 'Được cha mẹ, người lớn quan tâm và giúp đỡ vừa phải.', 'Quan hệ với cha mẹ ở mức bình thường, có lúc gần lúc xa.', 'Cha mẹ có giai đoạn vất vả, hoặc hai bên có khoảng cách quan điểm – cần kiên nhẫn thấu hiểu.', 'Tuổi nhỏ có thể thiếu sự che chở; bạn sớm tự lập – hãy trân trọng những gì còn có và chăm sóc cha mẹ khi có thể.']],
  'Huynh Đệ': ['Anh chị em – bạn bè', ['Anh chị em, bạn bè gắn bó, hay giúp đỡ nhau.', 'Có anh em, bạn bè tốt, qua lại hòa thuận.', 'Anh em mỗi người một hướng, ít nhờ cậy nhưng không xung khắc.', 'Dễ có cạnh tranh hoặc hiểu lầm với anh em, bạn bè – rõ ràng trong tiền bạc sẽ giữ được tình.', 'Anh em, bạn bè khó nương tựa; nên tự lực và chọn bạn thật kỹ.']],
  'Phu Thê': ['Hôn nhân', ['Hôn nhân là nguồn hạnh phúc và trợ lực lớn của bạn.', 'Duyên vợ chồng khá tốt, biết vun đắp thì bền lâu.', 'Hôn nhân ở mức bình thường – có ngọt có mặn, cần cả hai cùng góp sức.', 'Tình duyên có thử thách: dễ bất đồng hoặc đến muộn – lắng nghe và nhường nhịn là chìa khóa.', 'Đường tình cảm nhiều sóng gió – nên tìm hiểu kỹ, không vội vàng, và giữ không gian riêng cho nhau.']],
  'Tử Tức': ['Con cái', ['Có duyên với con, con cái ngoan và mang lại niềm vui lớn.', 'Con cái khá thuận, quan hệ cha mẹ – con gắn bó.', 'Con cái ở mức bình thường, cần dành thời gian đồng hành.', 'Con cái có thể đến muộn hoặc cần nhiều công dạy dỗ – kiên nhẫn sẽ được đền đáp.', 'Chuyện con cái cần đặc biệt quan tâm: sức khỏe sinh sản, thời điểm có con và cách nuôi dạy.']],
  'Tài Bạch': ['Tiền bạc', ['Tiền bạc hanh thông, có khả năng tích lũy tốt.', 'Tài chính khá ổn, kiếm được và giữ được.', 'Tiền bạc ở mức đủ dùng – tăng hay giảm tùy cách quản lý.', 'Tiền vào dễ ra nhanh – cần kế hoạch chi tiêu và tránh đầu tư mạo hiểm.', 'Tài chính cần thận trọng cao: không vay mượn lớn, không bảo lãnh, ưu tiên tích lũy từng bước.']],
  'Tật Ách': ['Sức khỏe', ['Thể chất tốt, ít ốm vặt, phục hồi nhanh.', 'Sức khỏe khá, chỉ cần giữ nếp sống điều độ.', 'Sức khỏe trung bình – có vài điểm yếu cần theo dõi.', 'Có điểm yếu sức khỏe rõ – nên khám định kỳ và chăm sóc cơ quan dễ tổn thương.', 'Sức khỏe cần ưu tiên hàng đầu: nghỉ ngơi đủ, tránh làm quá sức, khám sớm khi có dấu hiệu lạ.']],
  'Thiên Di': ['Ra ngoài – đi xa', ['Ra ngoài gặp nhiều may mắn, đi xa phát triển tốt.', 'Đi xa, môi trường mới khá thuận.', 'Đi xa hay ở gần đều được, không có gì đặc biệt.', 'Ra ngoài dễ gặp trở ngại hoặc thị phi – chuẩn bị kỹ trước mỗi chuyến đi, mỗi môi trường mới.', 'Nên thận trọng khi đi xa, đổi môi trường – ổn định gốc rễ trước rồi hãy mở rộng.']],
  'Nô Bộc': ['Bạn bè – đồng nghiệp – cộng sự', ['Có nhiều người giúp, cộng sự đáng tin.', 'Quan hệ đồng nghiệp, cấp dưới khá tốt.', 'Các mối quan hệ xã hội bình thường, được chăng hay chớ.', 'Dễ gặp người không hợp hoặc bị phụ lòng – chọn cộng sự kỹ, rõ ràng quyền lợi.', 'Nên dè dặt trong hợp tác, không giao phó hết cho người khác.']],
  'Quan Lộc': ['Sự nghiệp', ['Sự nghiệp có tiềm năng lớn, dễ thăng tiến hoặc tự làm chủ.', 'Công việc khá thuận, có cơ hội phát triển.', 'Sự nghiệp ổn định ở mức vừa – thăng tiến nhờ kiên trì.', 'Công việc nhiều áp lực, dễ thay đổi – nên chọn một hướng và tích lũy chuyên môn.', 'Con đường sự nghiệp gập ghềnh – đi chậm mà chắc, lấy kỹ năng làm vốn.']],
  'Điền Trạch': ['Nhà cửa – tài sản', ['Có phúc về nhà cửa, đất đai, dễ sở hữu tài sản.', 'Nhà cửa, tài sản khá thuận.', 'Nhà cửa đủ ở, tài sản tích lũy dần theo thời gian.', 'Nhà cửa có thể phải chuyển đổi nhiều lần – cân nhắc kỹ trước khi mua bán lớn.', 'Tài sản cố định cần giữ gìn cẩn thận; ưu tiên an cư trước rồi mới đầu tư.']],
  'Phúc Đức': ['Phúc đức – đời sống tinh thần', ['Phúc dày, tinh thần an lạc, hay gặp quý nhân.', 'Đời sống tinh thần khá tốt, biết đủ và vui sống.', 'Phúc đức bình thường – gieo nhân lành sẽ được quả tốt.', 'Tinh thần dễ bất an, hay lo nghĩ – thiền, đọc sách, làm việc thiện giúp cân bằng.', 'Cần chăm sóc đời sống tinh thần nhiều hơn: tìm điểm tựa tâm linh, gia đình, cộng đồng.']]
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
      (thieu.length ? ' Hành ' + thieu.join(', ') + ' gần như vắng mặt – những gì thuộc về ' + thieu.map(function (h) { return DH_BT_HANH[h].ban; }).join('; ') + ' là điều bạn cần chủ động bồi đắp.' : ' Các hành khá đầy đủ – một lợi thế về sự cân bằng.')),
    dhDoan_('Yếu tố giúp bạn cân bằng (dụng thần)', 'Hành ' + dung + ' – tượng trưng cho ' + DH_BT_HANH[dung].ban + ' – là "vị thuốc" lá số của bạn cần nhất. Cách bổ sung trong đời sống: ' + DH_BT_HANH[dung].lam + '.' +
      (info.mau ? ' Màu hợp: ' + info.mau + '.' : '') + (info.huong ? ' Hướng tốt: ' + info.huong + '.' : '') + (hy.length > 1 ? ' Ngoài ra các hành ' + hy.filter(function (h) { return h !== dung; }).join(', ') + ' cũng hỗ trợ bạn.' : '')),
    dhDoan_('Điều nên tiết chế', ky.length ? 'Hành ' + ky.join(', ') + ' đang dư hoặc gây áp lực cho lá số – không phải điều xấu, chỉ là nên tiết chế: ' + ky.map(function (h) { return DH_BT_HANH[h].lam.split(';')[0]; }).join('; ') + ' ở mức vừa phải thôi.' : 'Lá số không có hành nào quá lấn át.')];
  khoi.push({ ten: 'Năng lượng & cách cân bằng', doan: nl });
  top.forEach(function (x) { facts.push(taoFact_(he, 'Menh', 'tinh_cach', 'manh', DH_BT_TT[x.k].manh, 1.0, { nguon: 'Thập thần ' + x.k })); });
  facts.push(taoFact_(he, 'ALL', 'suc_khoe', thieu.length ? 'yeu' : 'trung', thieu.length ? 'Hành ' + thieu.join(', ') + ' yếu – nên bồi đắp để cơ thể và tinh thần cân bằng.' : 'Ngũ hành khá cân bằng.', 0.8, { nguon: 'Ngũ hành' }));
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
  'Bạn mang tinh thần người tiên phong: thích bắt đầu, dám nghĩ dám làm, thẳng thắn và nhiều năng lượng.',
  'Bạn mang tinh thần người xây dựng: kiên nhẫn, thực tế, yêu sự ổn định và những giá trị bền lâu.',
  'Bạn mang tinh thần người đưa tin: tò mò, nhanh trí, giỏi giao tiếp và thích học nhiều thứ.',
  'Bạn mang tinh thần người che chở: giàu tình cảm, gắn bó gia đình, luôn muốn bảo vệ người thân.',
  'Bạn mang tinh thần người tỏa sáng: hào phóng, tự tin, sáng tạo và cần được ghi nhận.',
  'Bạn mang tinh thần người thợ cả: tỉ mỉ, phân tích giỏi, thích giúp ích và làm mọi thứ tốt hơn.',
  'Bạn mang tinh thần nhà ngoại giao: duyên dáng, công bằng, yêu cái đẹp và sự hài hòa.',
  'Bạn mang tinh thần người chuyển hóa: sâu sắc, mãnh liệt, trung thành và có ý chí mạnh.',
  'Bạn mang tinh thần nhà thám hiểm: lạc quan, yêu tự do, thích đi xa và tìm ý nghĩa cuộc sống.',
  'Bạn mang tinh thần người leo núi: kỷ luật, có trách nhiệm, kiên trì với mục tiêu dài hạn.',
  'Bạn mang tinh thần nhà cải cách: độc lập, khác biệt, nghĩ cho cộng đồng và tương lai.',
  'Bạn mang tinh thần người nghệ sĩ: giàu trí tưởng tượng, thấu cảm và nhạy cảm với cảm xúc người khác.'];
var DH_CT_MOON = [
  'Cảm xúc của bạn đến nhanh và đi nhanh; bạn nói thẳng điều mình cảm thấy. Bạn cần được tự do hành động để thấy an toàn.',
  'Bạn cần sự ổn định, quen thuộc và thoải mái vật chất để thấy an lòng; cảm xúc bền nhưng khó thay đổi.',
  'Bạn xử lý cảm xúc bằng lời nói – cần được trò chuyện, chia sẻ; tâm trạng thay đổi nhanh và sợ nhàm chán.',
  'Bạn rất giàu cảm xúc, gắn bó với gia đình và kỷ niệm; cần được chăm sóc và có một "tổ ấm" thật sự.',
  'Bạn cần được trân trọng và ghi nhận; cảm xúc ấm áp, hào phóng, thích những khoảnh khắc được là trung tâm.',
  'Bạn xử lý cảm xúc bằng cách phân tích và giúp đỡ; cần trật tự, sự hữu ích và những người chân thành.',
  'Bạn thấy an lòng khi mọi thứ hài hòa; cần một người bạn tin cậy để cùng chia sẻ, ghét xung đột.',
  'Cảm xúc của bạn sâu và mãnh liệt; bạn cần sự chân thật, lòng trung thành và không gian riêng tư.',
  'Bạn cần tự do cảm xúc và ý nghĩa; lạc quan, thích phiêu lưu, ngại những ràng buộc quá chặt.',
  'Bạn kiềm chế cảm xúc, ít bộc lộ; thấy an toàn khi đạt được thành tựu và được tôn trọng.',
  'Bạn tiếp cận cảm xúc bằng lý trí; cần tự do và sự khác biệt, đôi khi ngại những đòi hỏi tình cảm dồn dập.',
  'Bạn thấm cảm xúc của môi trường rất nhanh; cần không gian sáng tạo hoặc tâm linh để "lọc" lại năng lượng.'];
var DH_CT_ASC = [
  'Người khác thấy bạn năng động, nhanh nhẹn, thẳng thắn – dáng đi nhanh, ánh mắt quyết đoán.',
  'Người khác thấy bạn điềm tĩnh, dễ chịu, đáng tin – dáng vẻ chắc chắn, thích sự thoải mái.',
  'Người khác thấy bạn lanh lợi, hoạt ngôn, trẻ trung – thường trông trẻ hơn tuổi.',
  'Người khác thấy bạn hiền hòa, gần gũi, biết quan tâm – gương mặt thân thiện, dễ tạo cảm giác an toàn.',
  'Người khác thấy bạn nổi bật, tự tin, có khí chất – dễ gây ấn tượng ngay lần đầu.',
  'Người khác thấy bạn chỉn chu, khiêm tốn, gọn gàng – nhìn là biết người cẩn thận.',
  'Người khác thấy bạn duyên dáng, lịch sự, dễ mến – nụ cười thu hút, biết cách cư xử.',
  'Người khác thấy bạn bí ẩn, sâu sắc, có sức hút – ánh mắt có "lực", khó đoán.',
  'Người khác thấy bạn vui vẻ, cởi mở, phóng khoáng – thích đi đây đó, dễ bắt chuyện.',
  'Người khác thấy bạn chín chắn, nghiêm túc, có trách nhiệm – trông "người lớn" từ sớm.',
  'Người khác thấy bạn độc đáo, thân thiện nhưng có khoảng cách – phong cách riêng, khó lẫn.',
  'Người khác thấy bạn mơ mộng, dịu dàng, nhạy cảm – ánh mắt hiền, dễ khiến người khác muốn che chở.'];
var DH_CT_NT_TEN = { 'Lửa': 'Lửa (nhiệt huyết, hành động)', 'Đất': 'Đất (thực tế, bền bỉ)', 'Khí': 'Khí (tư duy, giao tiếp)', 'Nước': 'Nước (cảm xúc, trực giác)' };
var DH_CT_NT_THIEU = { 'Lửa': 'thêm nhiệt huyết và sự chủ động – hãy tập vận động, bắt đầu việc nhỏ ngay thay vì chờ cảm hứng',
  'Đất': 'thêm tính thực tế – hãy lập kế hoạch, quản lý tiền bạc và hoàn thành việc đến cùng',
  'Khí': 'thêm góc nhìn khách quan – hãy đọc, trao đổi, viết ra suy nghĩ trước khi quyết định',
  'Nước': 'thêm sự kết nối cảm xúc – hãy lắng nghe cơ thể, cho phép mình buồn vui và chia sẻ với người thân' };
var DH_CT_VENUS = { 'Lửa': 'Trong tình yêu, bạn thích sự chủ động, bất ngờ và những cử chỉ mạnh mẽ; bạn yêu thẳng thắn và cần tiếng cười.',
  'Đất': 'Trong tình yêu, bạn thể hiện bằng hành động và sự chăm sóc thực tế; bạn cần sự chung thủy, ổn định và gần gũi.',
  'Khí': 'Trong tình yêu, bạn cần được trò chuyện, được khen ngợi và cùng nhau chia sẻ ý tưởng; bạn yêu bằng trí óc trước.',
  'Nước': 'Trong tình yêu, bạn cần sự gắn kết cảm xúc sâu, thời gian bên nhau và sự thấu hiểu không cần nói thành lời.' };
var DH_CT_MARS = { 'Lửa': 'Khi theo đuổi điều mình muốn, bạn hành động nhanh, thích thử thách và cạnh tranh.',
  'Đất': 'Khi theo đuổi điều mình muốn, bạn bền bỉ, có kế hoạch và muốn thấy kết quả cụ thể.',
  'Khí': 'Khi theo đuổi điều mình muốn, bạn dùng lý lẽ, ý tưởng và sự thuyết phục.',
  'Nước': 'Khi theo đuổi điều mình muốn, bạn hành động theo cảm xúc và trực giác, âm thầm nhưng dai dẳng.' };
var DH_CT_MC = { 'Lửa': 'Bạn hợp với công việc được dẫn dắt, sáng tạo, xuất hiện trước công chúng hoặc tự khởi nghiệp.',
  'Đất': 'Bạn hợp với công việc ổn định, có cấp bậc rõ, tạo ra giá trị cụ thể: quản lý, tài chính, kỹ thuật, xây dựng.',
  'Khí': 'Bạn hợp với công việc cần giao tiếp, ý tưởng, kết nối con người: truyền thông, giáo dục, công nghệ, tư vấn.',
  'Nước': 'Bạn hợp với công việc chăm sóc, chữa lành, sáng tạo nghệ thuật hoặc thấu hiểu con người.' };
var DH_CT_NHA_LV = { 1: ['Menh', 'tinh_cach', 'bản thân'], 2: ['Tai Bach', 'tai_chinh', 'tiền bạc'], 3: ['Huynh De', 'gia_dao', 'anh em, học tập, giao tiếp'], 4: ['Dien Trach', 'gia_dao', 'gia đình, nhà cửa'],
  5: ['Tu Tuc', 'con_cai', 'tình yêu, con cái, sáng tạo'], 6: ['Tat Ach', 'suc_khoe', 'sức khỏe và công việc hằng ngày'], 7: ['Phu The', 'tinh_duyen', 'hôn nhân, đối tác'], 8: ['Tai Bach', 'tai_chinh', 'tài sản chung, những biến đổi lớn'],
  9: ['Thien Di', 'xa_hoi', 'học vấn cao, đi xa, niềm tin'], 10: ['Quan Loc', 'cong_danh', 'sự nghiệp, danh tiếng'], 11: ['No Boc', 'xa_hoi', 'bạn bè, cộng đồng, ước mơ'], 12: ['Phuc Duc', 'tam_linh', 'đời sống nội tâm, tâm linh'] };
var DH_CT_MOC = { 1: 'bạn lạc quan, rộng lượng và dễ được quý mến', 2: 'bạn có duyên kiếm tiền và tích lũy của cải', 3: 'bạn có tài ăn nói, viết lách, học hỏi nhanh', 4: 'gia đình, nhà cửa mang lại phúc lành cho bạn',
  5: 'sáng tạo, tình yêu và con cái mang lại niềm vui lớn', 6: 'bạn có tài chăm sóc, chữa lành và làm việc chăm chỉ được đền đáp', 7: 'hôn nhân, đối tác giúp bạn mở rộng cơ hội', 8: 'bạn có lộc từ tài sản chung, thừa kế hoặc hợp tác',
  9: 'may mắn đến khi bạn học cao, đi xa, mở rộng tầm nhìn', 10: 'bạn có vận may trong sự nghiệp và danh tiếng', 11: 'bạn bè, cộng đồng là nguồn may mắn lớn', 12: 'may mắn đến qua đời sống nội tâm, lòng tốt và sự giúp đỡ âm thầm' };
var DH_CT_THO = { 1: 'bạn nghiêm khắc với bản thân, trưởng thành sớm; hãy nhẹ nhàng với chính mình hơn', 2: 'tiền bạc đến chậm nhưng chắc; hãy tích lũy kiên nhẫn, tránh lo âu về vật chất', 3: 'việc học và giao tiếp cần nỗ lực nhiều; bù lại bạn nói điều gì cũng chắc chắn',
  4: 'gia đình, tuổi thơ có thể nhiều trách nhiệm; bạn xây dựng tổ ấm của mình rất vững', 5: 'niềm vui, tình yêu, con cái đến muộn hoặc cần vun đắp; đừng quá nghiêm túc với bản thân', 6: 'công việc hằng ngày và sức khỏe cần kỷ luật; nếp sống điều độ là "thuốc bổ" của bạn',
  7: 'hôn nhân đến muộn hoặc đòi hỏi nhiều cam kết; khi đã vững thì rất bền', 8: 'chuyện tài sản chung, nợ nần cần rõ ràng; bạn học được cách quản lý rủi ro', 9: 'niềm tin và học vấn cao đòi hỏi nhiều công sức; bạn trở thành người hiểu biết sâu',
  10: 'sự nghiệp đi lên từng bậc bằng nỗ lực thật; danh tiếng đến muộn nhưng bền', 11: 'bạn bè ít nhưng chất; hãy chủ động kết nối cộng đồng', 12: 'bài học nằm ở thế giới nội tâm; thiền, tĩnh lặng giúp bạn mạnh mẽ' };

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
    dhDoan_('Cán cân tính khí', 'Nguyên tố ' + DH_CT_NT_TEN[ks[0]] + ' nổi trội nhất trong bản đồ sao của bạn.' + (thieu.length ? ' Nguyên tố ' + thieu.map(function (k) { return DH_CT_NT_TEN[k]; }).join(', ') + ' khá ít – bạn sẽ cân bằng hơn khi ' + thieu.map(function (k) { return DH_CT_NT_THIEU[k]; }).join('; ') + '.' : ' Các nguyên tố khá cân đối – bạn linh hoạt trong nhiều hoàn cảnh.')),
    dhDoan_('Lời khuyên cụ thể', '', ['Sống đúng "Mặt Trời": ' + DH_CT_SUN[sun.cung].split(':')[1].trim().replace(/\.$/, '') + ' – đó là nơi bạn tỏa sáng.',
      'Chăm sóc "Mặt Trăng": cho mình những điều khiến bạn thấy an toàn, như đã nói ở trên.', 'Nhớ rằng người khác thường gặp "cung Mọc" của bạn trước – hãy để họ có thời gian biết con người thật bên trong.'])
  ] });
  facts.push(taoFact_(he, 'Menh', 'tinh_cach', 'manh', DH_CT_SUN[sun.cung], 1.3, { nguon: 'Mặt Trời ' + sun.cungTen }));
  facts.push(taoFact_(he, 'Menh', 'tinh_cach', 'trung', DH_CT_MOON[moon.cung], 1.0, { nguon: 'Mặt Trăng ' + moon.cungTen }));
  // Tình yêu
  var ve = by.venus, ma = by.mars, ds = ct.cusp && ct.cusp[6];
  khoi.push({ ten: 'Tình yêu & các mối quan hệ', doan: [
    dhDoan_('Cách bạn yêu', DH_CT_VENUS[nt(ve.cung)]),
    dhDoan_('Cách bạn theo đuổi điều mình muốn', DH_CT_MARS[nt(ma.cung)]),
    dhDoan_('Người bạn dễ bị thu hút', ds ? 'Bạn thường bị thu hút bởi người mang nét của cung ' + ds.cungTen + ': ' + DH_CT_SUN[ds.cung].split(':')[1].trim() : ''),
    dhDoan_('Lời khuyên', '', ['Nói rõ "ngôn ngữ yêu thương" của mình cho người ấy biết – đừng để họ phải đoán.', 'Khi bất đồng, hiểu rằng mỗi người có cách hành động khác nhau – không ai sai.'])
  ].filter(function (d) { return d.text || d.list; }) });
  facts.push(taoFact_(he, 'Phu The', 'tinh_duyen', 'trung', DH_CT_VENUS[nt(ve.cung)], 1.0, { nguon: 'Sao Kim ' + ve.cungTen, doiTuong: 'ban_than' }));
  // Sự nghiệp & may mắn
  var ju = by.jupiter, sa = by.saturn, jn = ju && ju.nha, sn = sa && sa.nha;
  khoi.push({ ten: 'Sự nghiệp, may mắn & bài học', doan: [
    dhDoan_('Hướng sự nghiệp', DH_CT_MC[nt(mc.cung)]),
    jn ? dhDoan_('Nơi may mắn tìm đến bạn', 'Về ' + DH_CT_NHA_LV[jn][2] + ': ' + DH_CT_MOC[jn] + '.') : null,
    sn ? dhDoan_('Bài học lớn của đời bạn', 'Về ' + DH_CT_NHA_LV[sn][2] + ': ' + DH_CT_THO[sn] + '.') : null,
    dhDoan_('Lời khuyên', '', ['Đầu tư vào lĩnh vực may mắn của mình – công sức bỏ ra ở đó thường được đền đáp gấp đôi.', 'Bài học lớn không phải để sợ: vượt qua nó chính là nơi bạn trưởng thành bền vững nhất.'])
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
      MY.manhTron.length ? dhDoan_('Điểm mạnh nên phát huy', 'Bạn có lợi thế tự nhiên về ' + MY.manhTron.join(', ') + '.') : null,
      MY.yeuTron.length ? dhDoan_('Điều cần rèn thêm', 'Bạn có xu hướng cần nhiều công sức hơn người khác ở ' + MY.yeuTron.join(', ') + ' – rèn từng chút, đều đặn, đây cũng là nơi bạn trưởng thành nhất.') : null,
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
    var gon = function (t) { return dhSach_(t).replace(/\s*\((Đường Đời|Nhân Cách|Linh Hồn|Ngày Sinh|Định Mệnh|Thái Độ|Thách Thức|Nợ nghiệp|Đỉnh Cao|số vắng)[^)]*\)/gi, '').replace(/\s+([,.;:])/g, '$1'); };
    khoi.push({ ten: 'Con người bạn qua các con số', doan: [doan[0]].concat(P.luan.filter(function (x) { return x.k !== 'vanTrinh'; }).map(function (x) { return dhDoan_(x.ten, '', x.items.map(gon)); })) });
    var vt = P.luan.filter(function (x) { return x.k === 'vanTrinh'; })[0];
    if (vt) khoi.push({ ten: 'Năm nay và chặng đời hiện tại', doan: [dhDoan_('Nhịp thời gian', '', vt.items.map(gon))] });
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
  'Generator': { tomTat: 'Bạn thuộc nhóm "Người Kiến Tạo" – khoảng 37% dân số, những người có nguồn sinh lực bền bỉ để xây dựng thế giới.', loi: ['Đừng ép mình khởi xướng mọi thứ – hãy để cơ hội đến và lắng nghe cảm giác "có/không" từ bụng.', 'Làm điều bạn thật sự thích: khi đó sinh lực gần như không cạn.', 'Thấy bực bội kéo dài là dấu hiệu bạn đang làm sai việc hoặc sai cách.'] },
  'Manifesting Generator': { tomTat: 'Bạn thuộc nhóm "Người Kiến Tạo Biểu Hiện" – nhanh, đa năng, có thể làm nhiều việc cùng lúc và tìm ra đường tắt.', loi: ['Phản hồi trước, rồi thông báo cho người liên quan trước khi hành động.', 'Bỏ qua bước thừa là tài năng, nhưng hãy quay lại kiểm tra bước bị sót.', 'Cho phép mình thay đổi hướng – đó là cách bạn tìm ra điều đúng.'] },
  'Manifestor': { tomTat: 'Bạn thuộc nhóm "Người Khởi Xướng" – khoảng 9% dân số, những người mở đường và tạo tác động.', loi: ['Thông báo trước khi hành động để người xung quanh không bị bất ngờ.', 'Làm việc theo từng đợt năng lượng, nghỉ ngơi xen kẽ.', 'Cảm giác tức giận thường xuyên là dấu hiệu bạn đang bị cản trở – hãy tìm không gian tự do hơn.'] },
  'Projector': { tomTat: 'Bạn thuộc nhóm "Người Dẫn Dắt" – khoảng 20% dân số, những người nhìn thấu con người và hệ thống.', loi: ['Chờ được mời hoặc được công nhận cho những việc lớn (công việc, tình yêu, nơi ở).', 'Học sâu một hệ thống/lĩnh vực – đó là "tấm vé" để người khác mời bạn.', 'Nghỉ ngơi trước khi thấy mệt; cảm giác cay đắng là dấu hiệu bạn đang cho đi mà không được nhìn nhận.'] },
  'Reflector': { tomTat: 'Bạn thuộc nhóm "Người Phản Chiếu" – khoảng 1% dân số, tấm gương phản chiếu sức khỏe của cộng đồng quanh mình.', loi: ['Cho mình khoảng một tháng (một chu kỳ trăng) trước những quyết định lớn.', 'Chọn nơi sống và làm việc thật kỹ – môi trường quyết định bạn cảm thấy thế nào.', 'Cảm giác thất vọng là dấu hiệu bạn đang ở sai môi trường.'] }
};
var DH_HD_MO = {
  head: 'Đầu (cảm hứng): dễ bị áp lực phải trả lời mọi câu hỏi – hãy chọn lọc câu hỏi nào thật sự đáng nghĩ.',
  ajna: 'Tư duy: dễ cố tỏ ra chắc chắn – thật ra sự linh hoạt trong quan điểm là điểm mạnh của bạn.',
  throat: 'Cổ họng (lời nói): dễ nói nhiều để được chú ý – lời bạn có sức nặng nhất khi được mời nói.',
  g: 'Bản sắc – định hướng: dễ phân vân "mình là ai" – nơi chốn và con người xung quanh định hướng bạn rất nhiều.',
  heart: 'Ý chí: dễ cố chứng minh giá trị bản thân, hứa quá sức – bạn không cần chứng minh gì cả.',
  sacral: 'Sinh lực: dễ không biết khi nào là "đủ" – hãy nghỉ trước khi kiệt sức.',
  solar: 'Cảm xúc: dễ né tránh xung đột, làm vừa lòng người khác – bạn thấm cảm xúc người khác rất nhanh.',
  spleen: 'Trực giác – sức khỏe: dễ bám víu những điều không còn tốt cho mình – hãy dám buông.',
  root: 'Áp lực: dễ vội vàng làm cho xong để thoát áp lực – hãy tự hỏi có thật sự gấp không.' };
var DH_HD_HAO = { 1: 'người tìm hiểu nền tảng – cần biết thật chắc trước khi làm', 2: 'người có tài bẩm sinh – cần thời gian riêng, thường được người khác "gọi ra"', 3: 'người học qua trải nghiệm – thử, sai, rồi tìm ra điều đúng',
  4: 'người kết nối – cơ hội đến qua các mối quan hệ quen biết', 5: 'người giải quyết vấn đề – hay được người khác kỳ vọng, tìm đến lúc khó khăn', 6: 'người làm gương – đời chia 3 giai đoạn, càng về sau càng trở thành hình mẫu' };
var DH_HD_TQ = { 'Cảm xúc': 'Đừng quyết định lúc cảm xúc đang lên cao hay xuống thấp – hãy "ngủ một đêm", chờ cảm xúc lắng rồi mới chốt.',
  'Xương cùng': 'Hãy tin vào phản ứng tức thì từ bụng ("ừ-hứ" hay "ư-ừ") khi được hỏi – đó là câu trả lời đúng nhất.',
  'Lá lách': 'Hãy tin vào linh cảm thoáng qua ngay lúc đó – trực giác chỉ nói một lần.',
  'Ý chí': 'Hãy hỏi: mình có thật sự muốn điều này không? Chỉ hứa những gì trái tim mình cam kết được.',
  'Bản thân': 'Hãy nói ra suy nghĩ với người tin cậy và lắng nghe chính giọng mình – câu trả lời hiện ra khi bạn nói.',
  'Môi trường': 'Hãy trao đổi với nhiều người ở những môi trường khác nhau – bạn sáng tỏ khi được nghe chính mình nói ở đúng nơi.',
  'Mặt Trăng': 'Hãy chờ khoảng một chu kỳ trăng (28 ngày) trước những quyết định lớn.' };
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
      dhDoan_('Cách ăn uống hợp cơ thể', 'Cơ thể bạn tiêu hóa tốt khi ' + bs[3].y + '.'),
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
var DH_HL_MUC = { rat_tot: 'Đây là quẻ tốt – giai đoạn này nhiều thuận lợi, nên chủ động nắm bắt.', tot: 'Quẻ khá thuận – có cơ hội, cần kiên trì là thành.', trung_binh: 'Quẻ ở mức bình ổn – thành bại tùy cách bạn ứng xử.',
  kho_khan: 'Quẻ có thử thách – nên đi chậm, giữ mình, chờ thời.', rat_kho: 'Quẻ nhiều trở ngại – ưu tiên giữ an toàn, tránh quyết định lớn; qua giai đoạn này sẽ mở ra.' };
var DH_HL_LV = { banThan: 'Menh', chaMe: 'Phu Mau', anhEm: 'Huynh De', conCai: 'Tu Tuc', tienBac: 'Tai Bach', honNhan: 'Phu The', congDanh: 'Quan Loc', sucKhoe: 'Tat Ach' };
function dhHaLac_(hl) {
  if (!hl || !hl.tien) return null;
  var khoi = [], facts = [], he = 'Ha Lac', L = hl.luan || {}, now = (L.daiVan || []).filter(function (d) { return d.isNow; })[0], nn = L.namNay;
  function que(q) { return 'quẻ ' + q.ten + ' – ' + String(q.y || '').replace(/\.$/, '').toLowerCase(); }
  var doan = [dhDoan_('Tóm tắt', 'Bát tự Hà Lạc đổi giờ, ngày, tháng, năm sinh thành hai quẻ Kinh Dịch: quẻ đầu nói về nửa đầu đời (khoảng trước 30 tuổi), quẻ sau nói về nửa sau đời.'),
    dhDoan_('Nửa đầu đời', 'Bạn mang ' + que(hl.tien) + '. ' + DH_HL_MUC[dhHaLacMuc_(hl.tien.diem)] + (hl.tien.khuyen ? ' Lời quẻ khuyên: ' + hl.tien.khuyen + '.' : '')),
    dhDoan_('Nửa sau đời', hl.hau ? 'Bạn chuyển sang ' + que(hl.hau) + '. ' + DH_HL_MUC[dhHaLacMuc_(hl.hau.diem)] + (hl.hau.khuyen ? ' Lời quẻ khuyên: ' + hl.hau.khuyen + '.' : '') : '')];
  if (hl.hau) doan.push(dhDoan_('Nhịp đời của bạn', hl.tien.diem < hl.hau.diem ? 'Đời bạn có xu hướng "tiền khó – hậu thuận": càng về sau càng vững vàng, những vất vả ban đầu là nền móng.' :
    hl.tien.diem > hl.hau.diem ? 'Đời bạn có xu hướng "tiền thuận – hậu giữ": tuổi trẻ nhiều cơ hội, về sau nên giữ gìn và tích lũy.' : 'Đời bạn khá đều tay – ổn định qua các giai đoạn.'));
  if (now) doan.push(dhDoan_('Giai đoạn bạn đang đi qua', 'Từ ' + now.khoang + ' (' + now.nam + '): giai đoạn được đánh giá "' + now.danhGia + '". ' + DH_HL_MUC[dhHaLacMuc_(now.diem)]));
  if (nn) doan.push(dhDoan_('Năm ' + nn.nam, 'Quẻ năm nay là ' + nn.que + ' – ' + String(nn.y || '').toLowerCase() + '. ' + DH_HL_MUC[dhHaLacMuc_(nn.diem)] + (nn.khuyen ? ' Lời khuyên: ' + nn.khuyen + '.' : '')));
  if (L.thoiVi) doan.push(dhDoan_('Thời vận bẩm sinh', L.thoiVi.ketLuan.replace(/^Mệnh "([^"]+)": /, 'Lá số của bạn thuộc dạng "$1": ')));
  khoi.push({ ten: 'Hai nửa cuộc đời theo Kinh Dịch', doan: doan });
  // Luận lục thân theo 6 hào → văn đời thường cho từng mặt đời sống
  if (L.linhVuc && L.linhVuc.length) {
    khoi.push({ ten: 'Các mặt đời sống theo 6 hào của quẻ', doan: L.linhVuc.map(function (x) {
      return dhDoan_(x.ten, x.van + (x.them.length ? ' ' + x.them.join(' ') : '') + ' Gợi ý: ' + x.khuyen);
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
  { k: 'tinh_cach', ten: 'Tính cách & con người', loi: ['Phát huy điểm mạnh mà nhiều hệ cùng nhắc – đó là "vốn trời cho" đáng tin nhất.', 'Điểm cần lưu ý được nhiều hệ nhắc lại là bài học lớn nhất – thay đổi từng chút mỗi ngày.'] },
  { k: 'cong_danh', ten: 'Công danh – sự nghiệp', loi: ['Chọn nghề nằm ở giao điểm các gợi ý của nhiều hệ.', 'Tích lũy chuyên môn sâu trước, mở rộng sau.'] },
  { k: 'tai_chinh', ten: 'Tiền bạc – tài sản', loi: ['Lập quỹ dự phòng trước khi đầu tư.', 'Năm thuận thì tích lũy, năm khó thì giữ.'] },
  { k: 'tinh_duyen', ten: 'Tình duyên – hôn nhân', loi: ['Nói rõ nhu cầu tình cảm của mình cho người ấy.', 'Chọn người bù được điểm yếu của mình thay vì giống hệt mình.'] },
  { k: 'con_cai', ten: 'Con cái', loi: ['Dành thời gian chất lượng thay vì chỉ lo vật chất.', 'Quan sát tính cách riêng của con để dạy cho phù hợp.'] },
  { k: 'suc_khoe', ten: 'Sức khỏe', loi: ['Khám định kỳ những cơ quan được nhiều hệ nhắc tới.', 'Ngủ đủ, vận động đều – nền tảng của mọi vận may.'] },
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
    if (!f.tvDiem && f.nhom !== 'tinh_cach' && /^Bạn\s/.test(dhBoTenSao_(f.yNghia))) return false;
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
    var xu = d10 >= 7.5 ? 'rất thuận lợi' : d10 >= 6 ? 'nhìn chung thuận lợi' : d10 >= 4.5 ? 'cân bằng giữa thuận lợi và thử thách' : d10 >= 3 ? 'có nhiều điều cần lưu tâm' : 'là lĩnh vực cần đặc biệt quan tâm';
    var tt = 'Có ' + nAll + ' trên 6 hệ cùng nói về ' + N.ten.toLowerCase() + '. Gộp lại, lĩnh vực này ' + xu + ' (' + String(d10).replace('.', ',') + '/10).';
    if (nM >= 3) tt += ' Điểm thuận được ' + nM + ' hệ cùng xác nhận – đây là phần đáng tin cậy nhất.';
    if (nY >= 3) tt += ' Điều cần lưu ý cũng được ' + nY + ' hệ cùng nhắc – nên chú tâm.';
    if (nM >= 2 && nY >= 2) tt += ' Thuận và khó cùng xuất hiện nghĩa là kết quả phụ thuộc nhiều vào cách bạn lựa chọn.';
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
  out.soFacts = { tuVi: tv.length, tong: all.length };
  return out;
}
