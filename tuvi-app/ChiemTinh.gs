/**
 * ============================================================
 *  ChiemTinh.gs — CHIÊM TINH PHƯƠNG TÂY (cung hoàng đạo)
 *  - Bản đồ sao nhiệt đới: 10 hành tinh + Nút Bắc, Mọc (ASC), Thiên đỉnh (MC)
 *  - Hệ nhà Placidus (tự chuyển Porphyry ở vĩ độ cực), phẩm chất hành tinh
 *    (miếu/vượng/hãm/tù), góc chiếu (aspect) có orb, cân bằng Nguyên tố – Tính chất,
 *    pha Mặt Trăng, chủ tinh lá số, nhà trọng điểm, nghịch hành.
 *  - Chu kỳ đời người: Sao Mộc hồi quy, Sao Thổ vuông/đối/hồi quy, Thiên Vương đối,
 *    Nút hồi quy – tính NGÀY THỰC theo vị trí hành tinh (không lấy tuổi trung bình).
 *  - Hồ sơ năm (Annual profection – chiêm tinh Hy Lạp cổ) và quá cảnh Mộc/Thổ năm xem.
 *  Nguồn tham khảo: Ptolemy "Tetrabiblos"; Vettius Valens "Anthology" (profection);
 *  Liz Greene "Saturn"; Stephen Arroyo "Astrology, Psychology & the Four Elements";
 *  Robert Hand "Planets in Transit"; Alan Leo (hình thể theo cung Mọc).
 * ============================================================
 */

var CT_CUNG = [
  { ten: 'Bạch Dương', ky: '♈', nt: 'Lửa', tc: 'Tiên phong', chu: 'mars', chuCo: 'mars', bp: 'đầu, mặt, não, răng trên',
    vung: ['dau'], tuKhoa: 'khởi xướng, can đảm, thẳng thắn, nóng vội',
    sun: 'Bản ngã chiến binh: sống để khởi đầu, thích cạnh tranh và tự mình mở đường. Dám nghĩ dám làm, nhưng dễ nóng vội và bỏ dở khi hết hứng.',
    moon: 'Cảm xúc bùng lên nhanh và tắt nhanh; cần được hành động để giải tỏa. Không chịu được bị kìm kẹp, dễ cáu nhưng không để bụng.',
    asc: 'Ấn tượng đầu tiên: năng động, thẳng thắn, hơi "gắt". Dáng săn chắc, bước đi nhanh, trán cao hoặc nổi rõ, lông mày đậm, nét mặt góc cạnh, da dễ hồng/đỏ khi nóng; hay có vết sẹo nhỏ vùng đầu – mặt do va chạm.',
    hinh: { cao: 0, beo: -0.5, mat: 'góc cạnh', da: 'hồng' },
    bong: 'bốc đồng, thiếu kiên nhẫn, ích kỷ khi bị thách thức' },
  { ten: 'Kim Ngưu', ky: '♉', nt: 'Đất', tc: 'Kiên định', chu: 'venus', chuCo: 'venus', bp: 'cổ, họng, thanh quản, tuyến giáp',
    vung: ['co'], tuKhoa: 'bền bỉ, thực tế, hưởng thụ, chung thủy',
    sun: 'Bản ngã người xây dựng: cần sự an toàn vật chất, làm chậm mà chắc, tích lũy tài sản và giá trị bền vững. Kiên nhẫn, đáng tin, nhưng bảo thủ khi bị ép.',
    moon: 'Mặt Trăng vượng địa: cảm xúc ổn định, cần tiện nghi, ăn ngon, cảm giác chạm. Chung thủy, ghét thay đổi đột ngột; khi tổn thương thì im lặng rất lâu.',
    asc: 'Ấn tượng đầu tiên: điềm tĩnh, dễ chịu, "chắc chắn". Thân hình đầy đặn, cổ ngắn và chắc, vai rộng, mắt to hiền, giọng nói ấm/trầm, dáng đi chậm rãi; dễ tăng cân khi lớn tuổi.',
    hinh: { cao: -0.5, beo: 1, mat: 'tròn vuông', da: 'sáng' },
    bong: 'cố chấp, chiếm hữu, lười thay đổi' },
  { ten: 'Song Tử', ky: '♊', nt: 'Khí', tc: 'Linh hoạt', chu: 'mercury', chuCo: 'mercury', bp: 'vai, cánh tay, bàn tay, phổi, hệ thần kinh',
    vung: ['tay', 'phoi', 'thanKinh'], tuKhoa: 'tò mò, lanh lợi, giao tiếp, đa năng',
    sun: 'Bản ngã người đưa tin: sống bằng ý tưởng, thông tin và kết nối. Học nhanh, nói hay, đa tài, nhưng dễ tản mạn và thiếu chiều sâu nếu không rèn tập trung.',
    moon: 'Cảm xúc được xử lý bằng lời nói và lý lẽ; cần trò chuyện để thấy an toàn. Tâm trạng thay đổi nhanh, dễ chán, sợ bị nhàm chán hơn sợ cô đơn.',
    asc: 'Ấn tượng đầu tiên: trẻ trung, hoạt bát, nói nhiều. Dáng mảnh khảnh, tay chân dài, cử chỉ tay nhiều, ánh mắt linh lợi đảo nhanh; trông trẻ hơn tuổi thật.',
    hinh: { cao: 0.5, beo: -1, mat: 'trái xoan', da: 'sáng' },
    bong: 'hời hợt, thiếu nhất quán, lo âu thần kinh' },
  { ten: 'Cự Giải', ky: '♋', nt: 'Nước', tc: 'Tiên phong', chu: 'moon', chuCo: 'moon', bp: 'ngực, vú, dạ dày, dịch thể',
    vung: ['nguc', 'daDay'], tuKhoa: 'che chở, gia đình, nhạy cảm, hoài niệm',
    sun: 'Bản ngã người che chở: gia đình, cội nguồn và cảm giác "nhà" là trung tâm. Giàu tình thương, trí nhớ cảm xúc tốt, nhưng dễ tự ái và co vào vỏ khi bị tổn thương.',
    moon: 'Mặt Trăng miếu địa: cảm xúc sâu, trực giác mạnh, gắn bó mẹ và gia đình. Cần được chăm sóc và chăm sóc người khác; tâm trạng lên xuống theo môi trường.',
    asc: 'Ấn tượng đầu tiên: hiền, e dè, dễ gần khi đã quen. Mặt tròn, da sáng hoặc hơi nhợt, mắt to "ướt", thân trên nở hơn thân dưới, dễ tích nước; nét mặt đổi theo tâm trạng.',
    hinh: { cao: -0.5, beo: 0.5, mat: 'tròn', da: 'sáng' },
    bong: 'đa sầu, bám víu quá khứ, thao túng bằng cảm xúc' },
  { ten: 'Sư Tử', ky: '♌', nt: 'Lửa', tc: 'Kiên định', chu: 'sun', chuCo: 'sun', bp: 'tim, lưng trên, cột sống',
    vung: ['tim', 'lung'], tuKhoa: 'tự tin, hào phóng, sáng tạo, thích được công nhận',
    sun: 'Mặt Trời miếu địa: bản ngã vị vua – cần tỏa sáng, sáng tạo và được công nhận. Hào phóng, trung thành, có khí chất lãnh đạo; tự ái cao khi bị xem nhẹ.',
    moon: 'Cảm xúc ấm áp, kịch tính; cần được yêu thương và khen ngợi. Rộng lượng với người thân, nhưng buồn sâu khi không được chú ý.',
    asc: 'Ấn tượng đầu tiên: nổi bật, tự tin, "có khí chất". Dáng đứng thẳng, vai rộng, mái tóc dày hoặc ấn tượng, nụ cười rạng rỡ, bước đi đĩnh đạc; thích trang phục nổi bật.',
    hinh: { cao: 0.5, beo: 0.5, mat: 'vuông', da: 'hồng' },
    bong: 'kiêu ngạo, háo danh, độc đoán' },
  { ten: 'Xử Nữ', ky: '♍', nt: 'Đất', tc: 'Linh hoạt', chu: 'mercury', chuCo: 'mercury', bp: 'ruột, hệ tiêu hóa, lá lách',
    vung: ['daDay'], tuKhoa: 'tỉ mỉ, phân tích, phục vụ, cầu toàn',
    sun: 'Bản ngã người thợ cả: tìm ý nghĩa qua công việc hữu ích và sự hoàn thiện. Óc phân tích sắc, chăm chỉ, tận tụy; dễ lo lắng và tự phê bình quá mức.',
    moon: 'Cảm xúc được kiểm soát bằng lý trí và trật tự; thấy an toàn khi mọi thứ ngăn nắp và có ích. Hay lo nghĩ vặt, thể hiện yêu thương qua việc làm cụ thể.',
    asc: 'Ấn tượng đầu tiên: gọn gàng, chỉn chu, khiêm tốn. Dáng thanh mảnh, gương mặt thanh tú, trán cao, ánh mắt quan sát kỹ; trẻ lâu, ăn mặc sạch sẽ, đơn giản.',
    hinh: { cao: 0, beo: -1, mat: 'trái xoan', da: 'sáng' },
    bong: 'soi mói, lo âu, cầu toàn tê liệt' },
  { ten: 'Thiên Bình', ky: '♎', nt: 'Khí', tc: 'Tiên phong', chu: 'venus', chuCo: 'venus', bp: 'thận, thắt lưng, da',
    vung: ['than', 'lung', 'da'], tuKhoa: 'hài hòa, công bằng, thẩm mỹ, quan hệ',
    sun: 'Bản ngã nhà ngoại giao: sống qua các mối quan hệ, tìm cân bằng và cái đẹp. Duyên dáng, biết lắng nghe, có óc thẩm mỹ; khó quyết định và sợ xung đột.',
    moon: 'Cảm xúc cần sự hài hòa, cần một người đồng hành. Dễ chịu ảnh hưởng tâm trạng người khác, nhún nhường để giữ hòa khí.',
    asc: 'Ấn tượng đầu tiên: dễ mến, lịch thiệp, ưa nhìn. Thân hình cân đối, gương mặt hài hòa, hay có lúm đồng tiền hoặc nụ cười duyên, làn da đẹp; phong cách ăn mặc có gu.',
    hinh: { cao: 0, beo: 0, mat: 'trái xoan', da: 'sáng' },
    bong: 'do dự, chiều lòng người, phụ thuộc quan hệ' },
  { ten: 'Bọ Cạp', ky: '♏', nt: 'Nước', tc: 'Kiên định', chu: 'pluto', chuCo: 'mars', bp: 'cơ quan sinh dục, bài tiết, trực tràng',
    vung: ['sinhDuc'], tuKhoa: 'sâu sắc, mãnh liệt, bí ẩn, chuyển hóa',
    sun: 'Bản ngã người chuyển hóa: sống sâu, yêu hết mình, không chấp nhận hời hợt. Ý chí thép, trực giác soi thấu, hồi phục mạnh sau khủng hoảng; đa nghi và khó tha thứ.',
    moon: 'Mặt Trăng tù: cảm xúc mãnh liệt nhưng giấu kín, cần sự tin cậy tuyệt đối. Ghen, nhớ lâu, sợ bị phản bội; khi đã gắn bó thì trung thành trọn vẹn.',
    asc: 'Ấn tượng đầu tiên: bí ẩn, khó đoán, có sức hút. Ánh mắt sâu và sắc, lông mày rậm, nét mặt kín đáo, thân hình rắn chắc; thần thái mạnh khiến người khác e dè.',
    hinh: { cao: 0, beo: 0.5, mat: 'vuông', da: 'ngăm' },
    bong: 'đa nghi, thù dai, kiểm soát' },
  { ten: 'Nhân Mã', ky: '♐', nt: 'Lửa', tc: 'Linh hoạt', chu: 'jupiter', chuCo: 'jupiter', bp: 'hông, đùi, gan',
    vung: ['chan', 'gan'], tuKhoa: 'tự do, lạc quan, khám phá, triết lý',
    sun: 'Bản ngã nhà thám hiểm: tìm chân lý, tự do và chân trời mới (du lịch, học thuật, tín ngưỡng). Lạc quan, thẳng thắn, hài hước; hứa nhiều và ngại ràng buộc.',
    moon: 'Cảm xúc cần không gian và phiêu lưu; tự chữa lành bằng lạc quan, đi xa, học điều mới. Ghét bị giam hãm, đôi khi né tránh cảm xúc nặng nề.',
    asc: 'Ấn tượng đầu tiên: cởi mở, vui tính, phóng khoáng. Dáng cao, chân dài, trán rộng, nụ cười tươi, cử chỉ rộng; dễ tăng cân vùng hông – đùi khi lớn tuổi.',
    hinh: { cao: 1, beo: 0, mat: 'dài', da: 'hồng' },
    bong: 'vô trách nhiệm, nói quá, thiếu kiên trì' },
  { ten: 'Ma Kết', ky: '♑', nt: 'Đất', tc: 'Tiên phong', chu: 'saturn', chuCo: 'saturn', bp: 'đầu gối, xương, răng, da',
    vung: ['xuong', 'chan', 'da'], tuKhoa: 'kỷ luật, tham vọng, trách nhiệm, bền bỉ',
    sun: 'Bản ngã người leo núi: đặt mục tiêu dài hạn và leo từng bậc. Kỷ luật, có trách nhiệm, chín chắn sớm; khó thư giãn, sợ thất bại, thành công rõ nét về sau.',
    moon: 'Mặt Trăng hãm: cảm xúc bị kiềm chế, thấy an toàn khi kiểm soát được hoàn cảnh. Thường sớm gánh trách nhiệm trong nhà, khó bộc lộ yếu đuối.',
    asc: 'Ấn tượng đầu tiên: nghiêm túc, đứng đắn, kiệm lời. Xương gò má – cằm rõ, dáng gầy hoặc rắn chắc, trông già dặn khi trẻ nhưng trẻ lâu khi già; cần lưu ý răng, khớp gối, da.',
    hinh: { cao: 0, beo: -1, mat: 'góc cạnh', da: 'ngăm' },
    bong: 'lạnh lùng, bi quan, thực dụng quá mức' },
  { ten: 'Bảo Bình', ky: '♒', nt: 'Khí', tc: 'Kiên định', chu: 'uranus', chuCo: 'saturn', bp: 'cẳng chân, mắt cá, hệ tuần hoàn',
    vung: ['chan', 'tim'], tuKhoa: 'độc lập, cải cách, nhân văn, khác biệt',
    sun: 'Mặt Trời hãm: bản ngã nhà cải cách – đề cao tự do, lý tưởng cộng đồng và ý tưởng tiến bộ. Độc đáo, bạn bè nhiều, nhưng giữ khoảng cách cảm xúc và cứng đầu về quan điểm.',
    moon: 'Cảm xúc được lý trí hóa, cần không gian riêng và tình bạn hơn sự quấn quýt. Có lòng trắc ẩn với số đông, khó diễn đạt tình cảm riêng tư.',
    asc: 'Ấn tượng đầu tiên: khác người, thân thiện nhưng hơi xa cách. Dáng cao, gương mặt có nét riêng độc đáo, ánh mắt xa xăm; phong cách ăn mặc cá tính, không theo khuôn.',
    hinh: { cao: 1, beo: -0.5, mat: 'dài', da: 'sáng' },
    bong: 'lạnh lùng, nổi loạn vô cớ, cố chấp tư tưởng' },
  { ten: 'Song Ngư', ky: '♓', nt: 'Nước', tc: 'Linh hoạt', chu: 'neptune', chuCo: 'jupiter', bp: 'bàn chân, hệ bạch huyết, miễn dịch',
    vung: ['chan', 'mienDich'], tuKhoa: 'thấu cảm, mơ mộng, nghệ thuật, hy sinh',
    sun: 'Bản ngã nghệ sĩ – người chữa lành: giàu tưởng tượng, thấu cảm, dễ hòa tan vào người khác. Có năng khiếu nghệ thuật, tâm linh; dễ trốn tránh thực tế và thiếu ranh giới.',
    moon: 'Cảm xúc như bọt biển – hấp thụ tâm trạng xung quanh. Trực giác, lãng mạn, hay mơ; cần thời gian ở một mình để "vắt khô" năng lượng.',
    asc: 'Ấn tượng đầu tiên: dịu dàng, mơ màng, dễ đồng cảm. Mắt to long lanh, nét mặt mềm, dáng không quá cao, bàn chân nhỏ hoặc có đặc điểm riêng; thần thái như nghệ sĩ.',
    hinh: { cao: -0.5, beo: 0.5, mat: 'tròn', da: 'sáng' },
    bong: 'trốn tránh, mơ hồ, dễ làm nạn nhân' }
];

var CT_HT = {
  sun: { ten: 'Mặt Trời', ky: '☉', cn: 'bản ngã, ý chí, sức sống, người cha', nha: 'tìm bản sắc và muốn tỏa sáng trong lĩnh vực' },
  moon: { ten: 'Mặt Trăng', ky: '☽', cn: 'cảm xúc, nhu cầu an toàn, thói quen, người mẹ', nha: 'cần sự an toàn cảm xúc, thay đổi theo chu kỳ trong lĩnh vực' },
  mercury: { ten: 'Sao Thủy', ky: '☿', cn: 'tư duy, học tập, giao tiếp, anh chị em', nha: 'suy nghĩ, học hỏi và trao đổi nhiều về' },
  venus: { ten: 'Sao Kim', ky: '♀', cn: 'tình yêu, giá trị, thẩm mỹ, tiền bạc', nha: 'được yêu mến, gặp may và tìm thấy niềm vui qua' },
  mars: { ten: 'Sao Hỏa', ky: '♂', cn: 'hành động, dục vọng, dũng khí, xung đột', nha: 'dồn năng lượng, cạnh tranh và dễ va chạm trong' },
  jupiter: { ten: 'Sao Mộc', ky: '♃', cn: 'mở rộng, may mắn, niềm tin, học vấn cao', nha: 'được phúc, mở rộng và gặp quý nhân trong' },
  saturn: { ten: 'Sao Thổ', ky: '♄', cn: 'kỷ luật, giới hạn, trách nhiệm, thời gian', nha: 'gặp thử thách, trì hoãn nhưng thành tựu bền vững muộn trong' },
  uranus: { ten: 'Sao Thiên Vương', ky: '♅', cn: 'đột biến, tự do, sáng tạo, cách mạng', nha: 'gặp biến động bất ngờ và muốn phá khuôn trong' },
  neptune: { ten: 'Sao Hải Vương', ky: '♆', cn: 'mơ mộng, tâm linh, ảo tưởng, hy sinh', nha: 'lý tưởng hóa, dễ mơ hồ hoặc hy sinh trong' },
  pluto: { ten: 'Sao Diêm Vương', ky: '♇', cn: 'quyền lực, chuyển hóa, sinh tử, vô thức', nha: 'trải qua những cuộc "lột xác" sâu sắc về' },
  northNode: { ten: 'Nút Bắc', ky: '☊', cn: 'hướng phát triển của linh hồn', nha: 'được thúc đẩy trưởng thành qua' }
};
var CT_THU_TU = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'northNode'];

/** Phẩm chất (dignity): miếu (domicile), vượng (exaltation), hãm (detriment), tù (fall) */
var CT_PHAM = {
  sun: { mieu: [4], vuong: [0], ham: [10], tu: [6] },
  moon: { mieu: [3], vuong: [1], ham: [9], tu: [7] },
  mercury: { mieu: [2, 5], vuong: [5], ham: [8, 11], tu: [11] },
  venus: { mieu: [1, 6], vuong: [11], ham: [7, 0], tu: [5] },
  mars: { mieu: [0, 7], vuong: [9], ham: [6, 1], tu: [3] },
  jupiter: { mieu: [8, 11], vuong: [3], ham: [2, 5], tu: [9] },
  saturn: { mieu: [9, 10], vuong: [6], ham: [3, 4], tu: [0] },
  uranus: { mieu: [10], vuong: [7], ham: [4], tu: [1] },
  neptune: { mieu: [11], vuong: [3], ham: [5], tu: [9] },
  pluto: { mieu: [7], vuong: [0], ham: [1], tu: [6] }
};

/** Phong cách của 3 hành tinh cá nhân theo cung (Thủy – tư duy; Kim – yêu; Hỏa – hành động) */
var CT_PHONG_CACH = {
  mercury: ['nghĩ nhanh nói thẳng, quyết đoán, dễ tranh cãi', 'chậm mà chắc, thực tế, nhớ lâu, khó đổi ý', 'lanh lợi, đa năng, hiếu kỳ, nói giỏi viết hay', 'tư duy bằng cảm xúc và ký ức, trí nhớ tốt, hay hoài niệm',
    'nói có sức thuyết phục, thích trình bày lớn, hơi chủ quan', 'phân tích tỉ mỉ, logic, chú ý chi tiết, giỏi sửa lỗi', 'cân nhắc hai mặt, khéo ngoại giao, khó chốt quyết định', 'sắc sảo, điều tra, nói ít hiểu nhiều, lời có gai',
    'tư duy khái quát, triết lý, lạc quan, hay bỏ qua chi tiết', 'có hệ thống, thực dụng, nghiêm túc, tính đường dài', 'độc đáo, khoa học, tư duy đi trước thời đại, cứng quan điểm', 'trực giác, giàu hình ảnh, thơ mộng, dễ lạc đề'],
  venus: ['yêu nhanh, chủ động theo đuổi, thích chinh phục', 'chung thủy, gợi cảm, trọng vật chất và sự thoải mái', 'yêu bằng trò chuyện, thích sự mới mẻ, khó gắn một người', 'yêu che chở, gắn bó gia đình, cần cảm giác an toàn',
    'yêu hào phóng, lãng mạn, thích được ngưỡng mộ', 'yêu bằng hành động chăm sóc, kín đáo, hay kén chọn', 'yêu lịch lãm, coi trọng hòa hợp, có gu thẩm mỹ cao', 'yêu mãnh liệt, sở hữu, ghen, trọn vẹn hoặc không gì',
    'yêu tự do, thích phiêu lưu, trọng sự chân thành', 'yêu nghiêm túc, chậm mở lòng, coi trọng địa vị và cam kết', 'yêu như bạn tri kỷ, cần không gian, thích sự khác biệt', 'yêu lãng mạn vô điều kiện, dễ hy sinh, dễ lý tưởng hóa'],
  mars: ['hành động bộc phát, dũng cảm, sức bật lớn (miếu địa)', 'chậm khởi động nhưng bền bỉ, giận thì khó nguôi', 'năng lượng tản mạn, làm nhiều việc cùng lúc, chiến bằng lời', 'hành động theo cảm xúc, bảo vệ gia đình, dễ dồn nén (tù)',
    'hành động phô trương, tự tin, cần sân khấu', 'làm việc chính xác, chăm chỉ, dễ căng thẳng vì chi tiết', 'thích hợp tác, né đối đầu trực tiếp, hay do dự (hãm)', 'ý chí sắt đá, bền bỉ, chiến lược, không bỏ cuộc (miếu địa)',
    'hành động vì lý tưởng, thích thể thao – du lịch, nóng vội', 'kỷ luật, tham vọng, hiệu quả cao (vượng địa)', 'hành động vì tập thể, nổi loạn, làm theo cách riêng', 'hành động theo cảm hứng, dễ mất phương hướng, mạnh ở nghệ thuật']
};

var CT_NHA = [
  { ten: 'Nhà 1 – Bản thân', y: 'ngoại hình, cơ thể, ấn tượng đầu tiên, cách khởi đầu mọi việc', vung: ['dau'] },
  { ten: 'Nhà 2 – Tài sản', y: 'tiền bạc tự kiếm, giá trị bản thân, của cải, ăn uống', vung: ['co'] },
  { ten: 'Nhà 3 – Giao tiếp', y: 'anh chị em, học phổ thông, đi lại gần, giao tiếp, hàng xóm', vung: ['tay'] },
  { ten: 'Nhà 4 – Gia đình', y: 'cha mẹ (thường là cha/mẹ nuôi dưỡng), gốc gác, nhà cửa, tuổi già', vung: ['nguc'] },
  { ten: 'Nhà 5 – Sáng tạo', y: 'tình yêu lãng mạn, con cái, sáng tạo, vui chơi, đầu cơ', vung: ['tim'] },
  { ten: 'Nhà 6 – Công việc hằng ngày', y: 'sức khỏe, thói quen, công việc thường nhật, đồng nghiệp, thú nuôi', vung: ['daDay'] },
  { ten: 'Nhà 7 – Hôn nhân', y: 'vợ/chồng, đối tác, hợp đồng, kẻ thù công khai', vung: ['than'] },
  { ten: 'Nhà 8 – Chuyển hóa', y: 'tiền chung, thừa kế, nợ, tình dục, khủng hoảng, sinh tử', vung: ['sinhDuc'] },
  { ten: 'Nhà 9 – Chân trời', y: 'học vấn cao, du lịch xa, nước ngoài, tôn giáo, triết lý', vung: ['chan'] },
  { ten: 'Nhà 10 – Sự nghiệp', y: 'nghề nghiệp, danh tiếng, địa vị xã hội, cấp trên, cha/mẹ nghiêm', vung: ['xuong'] },
  { ten: 'Nhà 11 – Cộng đồng', y: 'bạn bè, hội nhóm, hy vọng, thu nhập từ sự nghiệp, quý nhân', vung: ['chan'] },
  { ten: 'Nhà 12 – Tiềm thức', y: 'điều ẩn giấu, bệnh viện, cô độc, tâm linh, kẻ thù ngầm, hy sinh', vung: ['chan', 'mienDich'] }
];

var CT_GOC = [
  { deg: 0, ten: 'Hợp', ky: '☌', orb: 8, loai: 'hop', y: 'hòa trộn hai năng lượng thành một – tăng cường mạnh (tốt hay xấu tùy hành tinh)' },
  { deg: 60, ten: 'Lục hợp', ky: '⚹', orb: 5, loai: 'tot', y: 'cơ hội, hỗ trợ nhẹ nhàng – cần chủ động nắm bắt' },
  { deg: 90, ten: 'Vuông', ky: '□', orb: 7, loai: 'xau', y: 'căng thẳng nội tâm, thúc ép hành động – thử thách tạo nên sức mạnh' },
  { deg: 120, ten: 'Tam hợp', ky: '△', orb: 7, loai: 'tot', y: 'hài hòa, tài năng bẩm sinh, dòng chảy thuận lợi – đôi khi dễ dãi' },
  { deg: 150, ten: 'Lệch (quincunx)', ky: '⚻', orb: 3, loai: 'xau', y: 'hai năng lượng khó "nói chuyện" với nhau, cần điều chỉnh liên tục' },
  { deg: 180, ten: 'Đối', ky: '☍', orb: 8, loai: 'xau', y: 'phân cực, giằng co – thường thể hiện qua người khác, cần tìm cân bằng' }
];

var CT_NT = {
  'Lửa': { y: 'nhiệt huyết, hành động, tự tin, truyền cảm hứng', thieu: 'thiếu Lửa: dễ thiếu động lực, ngại khởi đầu, cần người "châm ngòi"', du: 'dư Lửa: nóng vội, bốc đồng, dễ kiệt sức' },
  'Đất': { y: 'thực tế, bền bỉ, giỏi vật chất, tin vào điều thấy được', thieu: 'thiếu Đất: khó quản lý tiền và thời gian, thiếu kiên nhẫn với việc tay chân', du: 'dư Đất: cứng nhắc, bảo thủ, quá thực dụng' },
  'Khí': { y: 'lý trí, giao tiếp, ý tưởng, kết nối xã hội', thieu: 'thiếu Khí: khó diễn đạt ý nghĩ, ít khách quan, dễ bị cảm xúc cuốn', du: 'dư Khí: sống trong đầu, lý thuyết, xa rời cảm xúc' },
  'Nước': { y: 'cảm xúc, trực giác, thấu cảm, trí nhớ cảm xúc', thieu: 'thiếu Nước: khó nhận biết cảm xúc của mình và người, dễ bị cho là lạnh', du: 'dư Nước: nhạy cảm quá mức, dễ tổn thương, trốn vào nội tâm' }
};
var CT_TC = {
  'Tiên phong': { y: 'khởi xướng, chủ động, định hướng mục tiêu', du: 'bắt đầu nhiều, hoàn thành ít; thích chỉ huy' },
  'Kiên định': { y: 'duy trì, bền bỉ, trung thành, tập trung', du: 'cứng nhắc, chống lại thay đổi' },
  'Linh hoạt': { y: 'thích nghi, đa năng, dễ thay đổi', du: 'thiếu nhất quán, dễ bị phân tán' }
};

var CT_PHA_TRANG = [
  ['Trăng non', 'bản năng, hướng tới cái mới, sống tự phát – "người gieo hạt"'],
  ['Trăng lưỡi liềm', 'nỗ lực thoát khỏi quá khứ, kiên trì xây dựng từ con số không'],
  ['Thượng huyền', 'khủng hoảng hành động – quyết đoán, thích xây dựng cấu trúc, vượt khó'],
  ['Trăng khuyết lồi', 'cầu toàn, không ngừng hoàn thiện, phân tích và điều chỉnh'],
  ['Trăng tròn', 'nhận thức qua quan hệ, cảm xúc mạnh, cần cân bằng hai cực, dễ nổi bật'],
  ['Trăng phổ biến', 'chia sẻ, truyền dạy điều đã học, có thông điệp muốn lan tỏa'],
  ['Hạ huyền', 'khủng hoảng niềm tin – tái cấu trúc tư tưởng, bỏ cái cũ để đi con đường riêng'],
  ['Trăng tàn', 'kết thúc chu kỳ, trực giác, tâm linh, hướng tới tương lai và buông bỏ']
];

/* ======================= TÍNH TOÁN ======================= */

function ctFmtDo_(lon) {
  var d = lon % 30, deg = Math.floor(d), min = Math.floor((d - deg) * 60);
  return deg + '°' + (min < 10 ? '0' : '') + min + '′';
}
function ctCung_(lon) { return Math.floor(astNorm_(lon) / 30); }
function ctKhoang_(a, b) { var d = Math.abs(astNorm_(a) - astNorm_(b)); return d > 180 ? 360 - d : d; }

/** RA -> kinh độ hoàng đạo của điểm trên hoàng đạo có xích kinh đó */
function ctRaToLon_(ra, eps) { return astNorm_(astAtan2_(astSin_(ra), astCos_(ra) * astCos_(eps))); }

/** Đỉnh 12 nhà Placidus (tự chuyển Porphyry nếu không hội tụ – vùng cực) */
function ctPlacidus_(jd, lat, lon) {
  var g = astGoc_(jd, lat, lon), eps = astObliquity_(jd), ramc = g.ramc;
  var cusp = new Array(12);
  cusp[0] = g.asc; cusp[9] = g.mc; cusp[6] = astNorm_(g.asc + 180); cusp[3] = astNorm_(g.mc + 180);
  var ok = Math.abs(lat) < 66;
  function giai(F, tren) {
    var l = tren ? astNorm_(g.mc + F * 90) : astNorm_(g.mc + 180 - F * 90);
    for (var i = 0; i < 50; i++) {
      var dec = Math.asin(astSin_(eps) * astSin_(l)) / AST_RAD;
      var x = Math.tan(lat * AST_RAD) * Math.tan(dec * AST_RAD);
      if (Math.abs(x) >= 1) { ok = false; return l; }
      var ad = Math.asin(x) / AST_RAD;
      var ra = tren ? ramc + F * (90 + ad) : ramc + 180 - F * (90 - ad);
      var l2 = ctRaToLon_(ra, eps);
      if (Math.abs(ctKhoang_(l2, l)) < 1e-6) { l = l2; break; }
      l = l2;
    }
    return l;
  }
  cusp[10] = giai(1 / 3, true); cusp[11] = giai(2 / 3, true);
  cusp[1] = giai(2 / 3, false); cusp[2] = giai(1 / 3, false);
  var he = 'Placidus';
  if (!ok) { // Porphyry
    he = 'Porphyry';
    var q1 = astNorm_(g.asc - g.mc), q2 = astNorm_(cusp[3] - g.asc);
    cusp[10] = astNorm_(g.mc + q1 / 3); cusp[11] = astNorm_(g.mc + 2 * q1 / 3);
    cusp[1] = astNorm_(g.asc + q2 / 3); cusp[2] = astNorm_(g.asc + 2 * q2 / 3);
  }
  cusp[4] = astNorm_(cusp[10] + 180); cusp[5] = astNorm_(cusp[11] + 180);
  cusp[7] = astNorm_(cusp[1] + 180); cusp[8] = astNorm_(cusp[2] + 180);
  return { cusp: cusp, asc: g.asc, mc: g.mc, he: he };
}
function ctNhaCua_(lon, cusp) {
  for (var i = 0; i < 12; i++) {
    var a = cusp[i], b = cusp[(i + 1) % 12];
    var span = astNorm_(b - a), off = astNorm_(lon - a);
    if (off < span) return i + 1;
  }
  return 1;
}
function ctPham_(key, sign) {
  var p = CT_PHAM[key];
  if (!p) return '';
  if (p.mieu.indexOf(sign) >= 0) return 'Miếu';
  if (p.vuong.indexOf(sign) >= 0) return 'Vượng';
  if (p.ham.indexOf(sign) >= 0) return 'Hãm';
  if (p.tu.indexOf(sign) >= 0) return 'Tù';
  return '';
}
function ctDiemPham_(ph) { return ph === 'Miếu' ? 2 : ph === 'Vượng' ? 1.5 : ph === 'Hãm' ? -1.5 : ph === 'Tù' ? -1 : 0; }

/** Thời điểm sinh (giờ đồng hồ) từ input của form */
function ctThoiDiem_(input) {
  var t = chuanHoaThoiGian_({ day: input.day, month: input.month, year: input.year, calendar: input.calendar, leap: input.leap, hour: input.hour, minute: input.minute });
  var tz = parseFloat(input.tz); if (isNaN(tz)) tz = 7;
  var noi = ctNoiSinh_(input);
  return { y: t.solar.year, m: t.solar.month, d: t.solar.day, h: parseInt(input.hour, 10) || 0, mi: parseInt(input.minute, 10) || 0, tz: tz,
    jd: astJD_(t.solar.year, t.solar.month, t.solar.day, parseInt(input.hour, 10) || 0, parseInt(input.minute, 10) || 0, tz),
    lat: noi.lat, lon: noi.lon, noiSinh: noi.ten };
}
function ctNoiSinh_(input) {
  var s = String(input.place || '').split('|'); // "lat|lon|tên"
  var lat = parseFloat(s[0]), lon = parseFloat(s[1]);
  if (isNaN(lat) || isNaN(lon)) {
    lat = 21.03; lon = parseFloat(input.longitude); if (isNaN(lon)) lon = 105.85;
    return { lat: lat, lon: lon, ten: 'Hà Nội (mặc định)' };
  }
  return { lat: lat, lon: lon, ten: s[2] || (lat.toFixed(2) + '°, ' + lon.toFixed(2) + '°') };
}

/** Lập bản đồ sao */
function chiemTinhLap(input) {
  var T = ctThoiDiem_(input);
  var jd = T.jd;
  var pos = astToanBo(jd), pos2 = astToanBo(jd + 0.5), pos0 = astToanBo(jd - 0.5);
  var H = ctPlacidus_(jd, T.lat, T.lon);
  var ht = CT_THU_TU.map(function (k) {
    var lon = pos[k], s = ctCung_(lon);
    var v = astNorm_(pos2[k] - pos0[k]); if (v > 180) v -= 360;
    return { key: k, ten: CT_HT[k].ten, ky: CT_HT[k].ky, lon: lon, cung: s, cungTen: CT_CUNG[s].ten, do: ctFmtDo_(lon),
      nha: ctNhaCua_(lon, H.cusp), nghich: k !== 'sun' && k !== 'moon' && k !== 'northNode' && v < 0, pham: ctPham_(k, s) };
  });
  var diem = { key: 'asc', ten: 'Mọc (ASC)', ky: 'AC', lon: H.asc, cung: ctCung_(H.asc), cungTen: CT_CUNG[ctCung_(H.asc)].ten, do: ctFmtDo_(H.asc), nha: 1 };
  var mc = { key: 'mc', ten: 'Thiên đỉnh (MC)', ky: 'MC', lon: H.mc, cung: ctCung_(H.mc), cungTen: CT_CUNG[ctCung_(H.mc)].ten, do: ctFmtDo_(H.mc), nha: 10 };
  var by = {}; ht.forEach(function (p) { by[p.key] = p; }); by.asc = diem; by.mc = mc;

  // Góc chiếu
  var ds = ht.concat([diem, mc]), goc = [];
  for (var i = 0; i < ds.length; i++) for (var j = i + 1; j < ds.length; j++) {
    var a = ds[i], b = ds[j];
    if ((a.key === 'asc' || a.key === 'mc') && (b.key === 'asc' || b.key === 'mc')) continue;
    var dist = ctKhoang_(a.lon, b.lon);
    for (var k = 0; k < CT_GOC.length; k++) {
      var G = CT_GOC[k];
      if ((a.key === 'northNode' || b.key === 'northNode') && G.deg !== 0) continue;
      var orb = G.orb + ((a.key === 'sun' || a.key === 'moon' || b.key === 'sun' || b.key === 'moon') && G.deg !== 150 ? 2 : 0);
      if (a.key === 'asc' || a.key === 'mc' || b.key === 'asc' || b.key === 'mc') orb = Math.min(orb, 6);
      if (Math.abs(dist - G.deg) <= orb) {
        goc.push({ a: a.key, b: b.key, aTen: a.ten, bTen: b.ten, goc: G.ten, ky: G.ky, loai: G.loai, deg: G.deg, orb: Math.round(Math.abs(dist - G.deg) * 10) / 10, y: G.y });
        break;
      }
    }
  }
  goc.sort(function (x, y) { return x.orb - y.orb; });

  // Nguyên tố & tính chất (trọng số)
  var W = { sun: 3, moon: 3, mercury: 2, venus: 2, mars: 2, jupiter: 1, saturn: 1, uranus: 0.5, neptune: 0.5, pluto: 0.5 };
  var nt = { 'Lửa': 0, 'Đất': 0, 'Khí': 0, 'Nước': 0 }, tc = { 'Tiên phong': 0, 'Kiên định': 0, 'Linh hoạt': 0 };
  ht.forEach(function (p) { if (W[p.key]) { nt[CT_CUNG[p.cung].nt] += W[p.key]; tc[CT_CUNG[p.cung].tc] += W[p.key]; } });
  nt[CT_CUNG[diem.cung].nt] += 3; tc[CT_CUNG[diem.cung].tc] += 3;
  nt[CT_CUNG[mc.cung].nt] += 1; tc[CT_CUNG[mc.cung].tc] += 1;

  // Bán cầu
  var ban = { dong: 0, tay: 0, tren: 0, duoi: 0 };
  ht.forEach(function (p) { if (p.key === 'northNode') return; if ([10, 11, 12, 1, 2, 3].indexOf(p.nha) >= 0) ban.dong++; else ban.tay++; if (p.nha >= 7) ban.tren++; else ban.duoi++; });

  // Pha Mặt Trăng
  var goc2 = astNorm_(by.moon.lon - by.sun.lon), pha = Math.floor(goc2 / 45);

  // Chủ tinh lá số (theo chủ tinh cổ điển của cung Mọc)
  var chuKey = CT_CUNG[diem.cung].chuCo, chuMoi = CT_CUNG[diem.cung].chu;

  // Nhà trọng điểm
  var demNha = {}; ht.forEach(function (p) { if (p.key !== 'northNode') demNha[p.nha] = (demNha[p.nha] || 0) + 1; });

  return { thoiDiem: T, heNha: H.he, cusp: H.cusp.map(function (c) { return { lon: c, cung: ctCung_(c), cungTen: CT_CUNG[ctCung_(c)].ten, do: ctFmtDo_(c) }; }),
    hanhTinh: ht, asc: diem, mc: mc, by: by, goc: goc, nguyenTo: nt, tinhChat: tc, banCau: ban,
    phaTrang: { idx: pha, ten: CT_PHA_TRANG[pha][0], y: CT_PHA_TRANG[pha][1], goc: Math.round(goc2) },
    chuTinh: chuKey, chuTinhMoi: chuMoi, demNha: demNha, chuKy: ctChuKy_(jd, pos, T) };
}

/** Chu kỳ đời người: tìm ngày quá cảnh chính xác */
function ctChuKy_(jd0, natal, T) {
  var out = [];
  function tim(key, offsets, maxNam, ten, moTa) {
    var step = key === 'jupiter' ? 5 : 10, prev = null, dem = {};
    for (var t = jd0 + 200; t < jd0 + maxNam * 365.25; t += step) {
      var L = astPlanetLon_(key, t - 2451543.5);
      offsets.forEach(function (o, idx) {
        var target = astNorm_(natal[key] + o.deg);
        var diff = astNorm_(L - target); if (diff > 180) diff -= 360;
        var pd = prev ? prev[idx] : null;
        if (pd != null && pd < 0 && diff >= 0 && Math.abs(diff) < 5) {
          var nam = (t - jd0) / 365.25, lan = dem[o.ten] || (o.deg === 0 ? [0] : []);
          if (!lan.length || nam - lan[lan.length - 1] > o.cach) {
            lan.push(nam); dem[o.ten] = lan;
            out.push({ tuoi: Math.round(nam * 10) / 10, nam: T.y + Math.floor(nam + (T.m - 1) / 12), ten: o.ten, hanh: key, moTa: o.moTa });
          }
        }
      });
      prev = offsets.map(function (o) { var d = astNorm_(L - astNorm_(natal[key] + o.deg)); return d > 180 ? d - 360 : d; });
    }
  }
  tim('saturn', [
    { deg: 90, ten: 'Sao Thổ vuông tăng', cach: 25, moTa: 'phép thử kỷ luật – va chạm quy tắc, phải xây nền móng mới (≈7, 36, 66 tuổi)' },
    { deg: 180, ten: 'Sao Thổ đối', cach: 25, moTa: 'đối diện giới hạn: tuổi dậy thì (lần 1) hoặc khủng hoảng giữa đời (lần 2) – đánh giá lại những gì đã xây' },
    { deg: 270, ten: 'Sao Thổ vuông giảm', cach: 25, moTa: 'áp lực tái cấu trúc – chọn hướng đi, bỏ cái không còn phù hợp, gánh trách nhiệm thật sự (≈22, 51, 80 tuổi)' },
    { deg: 0, ten: 'Sao Thổ hồi quy', cach: 25, moTa: 'bước ngoặt trưởng thành lớn: cấu trúc sai sẽ sụp để dựng cái đúng – thường gắn với sự nghiệp, hôn nhân, chuyển nhà, trách nhiệm mới' }
  ], 90, '', '');
  tim('jupiter', [{ deg: 0, ten: 'Sao Mộc hồi quy', cach: 10, moTa: 'chu kỳ 12 năm mở rộng – cơ hội học tập, đi xa, thăng tiến, gặp quý nhân; gieo hạt cho 12 năm tới' }], 85, '', '');
  tim('uranus', [
    { deg: 90, ten: 'Thiên Vương vuông', cach: 30, moTa: 'nổi loạn, khao khát tự do, thay đổi đột ngột lối sống' },
    { deg: 180, ten: 'Thiên Vương đối (khủng hoảng tuổi trung niên)', cach: 30, moTa: 'thức tỉnh: phá bỏ lối mòn, thay đổi nghề nghiệp/quan hệ để sống thật với mình' }
  ], 85, '', '');
  // Nút hồi quy (chu kỳ 18,6 năm)
  [1, 2, 3, 4].forEach(function (n) {
    var nam = 18.6 * n;
    out.push({ tuoi: Math.round(nam * 10) / 10, nam: T.y + Math.floor(nam + (T.m - 1) / 12), ten: 'Nút Bắc hồi quy lần ' + n, hanh: 'northNode', moTa: 'định hướng lại sứ mệnh đời – dễ gặp người/cơ hội "định mệnh", thay đổi hướng đi' });
  });
  out.sort(function (a, b) { return a.tuoi - b.tuoi; });
  return out.filter(function (x) { return x.tuoi > 0.5; });
}

/* ======================= LUẬN GIẢI ======================= */

function ctPlanetInSign_(p) {
  var S = CT_CUNG[p.cung], H = CT_HT[p.key], txt;
  if (p.key === 'sun') txt = S.sun;
  else if (p.key === 'moon') txt = S.moon;
  else if (CT_PHONG_CACH[p.key]) txt = H.ten + ' (' + H.cn + ') thể hiện theo lối ' + S.ten + ': ' + CT_PHONG_CACH[p.key][p.cung] + '.';
  else if (p.key === 'northNode') txt = 'Hướng trưởng thành của linh hồn mang màu sắc ' + S.ten + ' (' + S.tuKhoa + '); Nút Nam ở ' + CT_CUNG[(p.cung + 6) % 12].ten + ' là thói quen cũ cần vượt qua (' + CT_CUNG[(p.cung + 6) % 12].bong + ').';
  else if (p.key === 'jupiter') txt = 'Phúc lộc và niềm tin đến qua phẩm chất ' + S.ten + ' (' + S.tuKhoa + ').';
  else if (p.key === 'saturn') txt = 'Bài học đời và nỗi sợ sâu nằm ở chủ đề ' + S.ten + ' (' + S.tuKhoa + ') – vượt qua được sẽ thành sở trường vững chắc.';
  else txt = H.ten + ' ở ' + S.ten + ' mang dấu ấn thế hệ (' + S.tuKhoa + '); cá nhân rõ nét khi nó hợp góc với Mặt Trời, Mặt Trăng hoặc Mọc.';
  var ph = p.pham ? ' [' + p.pham + (p.pham === 'Miếu' || p.pham === 'Vượng' ? ' – phát huy mạnh, tự nhiên' : ' – năng lượng bị cản trở, phải rèn luyện nhiều hơn') + ']' : '';
  var ng = p.nghich ? ' (Nghịch hành: năng lượng hướng vào trong, xử lý lại, chậm mà sâu.)' : '';
  return (p.pham === 'Miếu' || p.pham === 'Vượng' ? '✓ ' : p.pham === 'Hãm' || p.pham === 'Tù' ? '◇ ' : '') + H.ky + ' ' + H.ten + ' ' + p.do + ' ' + S.ten + ' – nhà ' + p.nha + ph + ': ' + txt + ng;
}

function ctGocY_(g) {
  var A = CT_HT[g.a] || { ten: g.aTen, cn: g.a === 'asc' ? 'hình ảnh bản thân, cơ thể' : 'sự nghiệp, danh tiếng' };
  var B = CT_HT[g.b] || { ten: g.bTen, cn: g.b === 'asc' ? 'hình ảnh bản thân, cơ thể' : 'sự nghiệp, danh tiếng' };
  var dac = CT_GOC_DAC[[g.a, g.b].sort().join('-')];
  var nen = A.ten + ' ' + g.ky + ' ' + B.ten + ' (' + g.goc + ', orb ' + g.orb + '°): ' + A.cn + ' ↔ ' + B.cn + ' – ' + g.y + '.';
  if (dac) nen += ' ' + (g.loai === 'tot' ? dac[0] : g.loai === 'xau' ? dac[1] : dac[2] || dac[0]);
  return (g.loai === 'tot' ? '✓ ' : g.loai === 'xau' ? '✗ ' : '◇ ') + nen;
}
/** Góc chiếu kinh điển: [hài hòa, căng thẳng, hợp] */
var CT_GOC_DAC = {
  'moon-sun': ['Ý chí và cảm xúc đồng lòng: nội tâm yên ổn, cha mẹ hòa hợp, dễ đạt điều mình muốn.', 'Ý chí và cảm xúc giằng co: điều mình muốn khác điều mình cần; tuổi thơ có thể chứng kiến cha mẹ bất hòa.', 'Trăng non khi sinh: tính cách nhất quán, chủ quan, tập trung vào một hướng.'],
  'mars-venus': ['Hấp dẫn giới tính tự nhiên, tình yêu và dục vọng đồng điệu, có tài nghệ thuật.', 'Đam mê mãnh liệt nhưng hay va chạm trong tình yêu, yêu – ghét lẫn lộn.', 'Sức quyến rũ mạnh, nhiệt tình trong tình yêu, dễ yêu nhanh.'],
  'moon-saturn': ['Cảm xúc ổn định, chín chắn, trung thành, biết tự chăm sóc.', 'Cảm xúc bị kiềm nén, sớm gánh trách nhiệm, tuổi nhỏ thiếu sự ấm áp; dễ u sầu – cần học cách tự yêu thương.', 'Nghiêm túc với cảm xúc, có khuynh hướng cô đơn, thận trọng trong gắn bó.'],
  'saturn-sun': ['Kỷ luật, bền bỉ, được người lớn tin cậy, thành công chắc chắn theo thời gian.', 'Tự ti hoặc cảm thấy bị giới hạn (thường liên quan đến cha), phải nỗ lực gấp đôi; thành tựu thật sự sau 30 tuổi.', 'Nghiêm túc sớm, có trách nhiệm, đường đời "leo núi".'],
  'jupiter-sun': ['Lạc quan, hào phóng, may mắn, được quý nhân nâng đỡ.', 'Kỳ vọng quá cao, phô trương, dễ phung phí – cần tiết chế.', 'Tự tin lớn, có phúc, rộng lượng.'],
  'mars-saturn': ['Làm việc bền bỉ có kỷ luật, giỏi kỹ thuật, chịu khó.', 'Giận dữ dồn nén, dễ chấn thương xương khớp/tai nạn khi vội; cần kiên nhẫn và thể thao đều đặn.', 'Sức chịu đựng lớn nhưng dễ bực bội vì bị cản trở.'],
  'mars-pluto': ['Sức mạnh ý chí phi thường, khả năng phục hồi lớn.', 'Xung đột quyền lực, cơn giận dữ dội; cần kênh xả năng lượng lành mạnh.', 'Nghị lực lớn, quyết liệt, có thể cực đoan.'],
  'neptune-venus': ['Lãng mạn, tài nghệ thuật – âm nhạc, lòng trắc ẩn.', 'Dễ ảo tưởng trong tình yêu, bị lừa dối hoặc yêu người không có thật.', 'Tình yêu lý tưởng, tâm hồn nghệ sĩ.'],
  'moon-venus': ['Dịu dàng, duyên dáng, được yêu mến, có gu thẩm mỹ.', 'Cảm xúc và mong muốn tình yêu mâu thuẫn, dễ chiều chuộng bản thân quá mức.', 'Rất có duyên, ưa cái đẹp, gắn bó gia đình.'],
  'mercury-saturn': ['Tư duy chín chắn, kiên nhẫn học tập, giỏi tổ chức.', 'Tự ti về trí tuệ hoặc học tập gặp trắc trở thời nhỏ; bù lại bằng sự kỹ lưỡng.', 'Nghiêm túc, suy nghĩ sâu, nói ít mà chắc.'],
  'jupiter-venus': ['Rất may mắn trong tình cảm và tiền bạc, dễ được quý mến.', 'Hưởng thụ quá mức, chi tiêu phung phí.', 'Duyên dáng, được hưởng phúc, dễ gặp may về tiền và tình.'],
  'moon-pluto': ['Trực giác sâu, thấu hiểu tâm lý người khác.', 'Cảm xúc dữ dội, quan hệ với mẹ phức tạp, sợ mất kiểm soát.', 'Cảm xúc mãnh liệt, gắn bó sâu và sở hữu.'],
  'sun-uranus': ['Độc đáo, sáng tạo, tư duy tiến bộ.', 'Bất kham, thay đổi đột ngột, khó chịu gò bó.', 'Cá tính khác thường, cần tự do tuyệt đối.'],
  'asc-saturn': ['Phong thái đáng tin, trưởng thành.', 'Thời nhỏ nhút nhát hoặc ốm yếu; vẻ ngoài nghiêm, lớn tuổi càng mạnh mẽ.', 'Vóc dáng gầy/xương rõ, trông nghiêm và già dặn trước tuổi.'],
  'asc-jupiter': ['Thân thiện, dễ gây thiện cảm.', 'Dễ tăng cân, thiếu điều độ.', 'Dáng to cao hoặc đầy đặn, nụ cười rộng, phúc hậu.'],
  'asc-mars': ['Năng động, khỏe khoắn.', 'Hay va chạm, dễ có sẹo vùng đầu mặt.', 'Cơ thể săn chắc, da hồng/đỏ, dễ có sẹo, tính nhanh nhẹn.'],
  'asc-venus': ['Ưa nhìn, duyên dáng.', 'Hơi phù phiếm, quá chú trọng vẻ ngoài.', 'Gương mặt đẹp, cân đối, dễ thương.'],
  'asc-moon': ['Dễ gần, được lòng số đông.', 'Tâm trạng lộ ra mặt, dễ thay đổi cân nặng.', 'Gương mặt tròn, biểu cảm, nhạy cảm với môi trường.'],
  'asc-sun': ['Tự tin, sức sống mạnh.', 'Tự cao, đôi khi áp đặt.', 'Ngoại hình rạng rỡ, có sức hút, thể lực tốt.'],
  'mc-sun': ['Sự nghiệp nổi bật, có danh.', 'Áp lực thành công lớn, xung đột với cấp trên.', 'Sinh ra để được nhìn thấy – danh tiếng gắn với bản ngã.'],
  'jupiter-mc': ['Thuận lợi thăng tiến, được đề bạt.', 'Tham vọng quá sức.', 'Sự nghiệp rộng mở, có danh tiếng tốt.'],
  'mc-saturn': ['Sự nghiệp bền vững, leo từng bậc.', 'Trắc trở sự nghiệp, danh tiếng đến muộn, sợ thất bại công khai.', 'Tham vọng lớn, thành tựu muộn nhưng chắc.']
};

function ctPhysique_(ct) {
  var S = CT_CUNG[ct.asc.cung], items = ['Cung Mọc ' + S.ten + ' ' + ct.asc.do + ': ' + S.asc];
  var chu = ct.by[ct.chuTinh];
  items.push('Chủ tinh lá số (chủ của cung Mọc): ' + CT_HT[ct.chuTinh].ten + ' ở ' + CT_CUNG[chu.cung].ten + ', nhà ' + chu.nha + ' – nét ngoại hình pha thêm màu ' + CT_CUNG[chu.cung].ten + ' (' + CT_CUNG[chu.cung].tuKhoa + '); cuộc đời tập trung vào ' + CT_NHA[chu.nha - 1].y + '.');
  var nha1 = ct.hanhTinh.filter(function (p) { return p.nha === 1 || (p.nha === 12 && ctKhoang_(p.lon, ct.asc.lon) < 5); });
  var mo = {
    sun: 'Mặt Trời gần cung Mọc: sức sống mạnh, dáng đường hoàng, gương mặt sáng.', moon: 'Mặt Trăng gần cung Mọc: mặt tròn, da sáng, cân nặng dễ dao động, nét mặt biểu cảm.',
    mercury: 'Sao Thủy gần cung Mọc: trông trẻ, nhanh nhẹn, nói nhiều, cử chỉ tay linh hoạt.', venus: 'Sao Kim gần cung Mọc: ưa nhìn, làn da đẹp, nụ cười duyên, cân đối.',
    mars: 'Sao Hỏa gần cung Mọc: cơ bắp săn, da hồng/đỏ, dễ có sẹo vùng đầu – mặt, tóc có ánh đỏ hoặc cứng.', jupiter: 'Sao Mộc gần cung Mọc: vóc dáng lớn hoặc đầy đặn, trán rộng, phúc hậu, dễ tăng cân.',
    saturn: 'Sao Thổ gần cung Mọc: xương rõ, dáng gầy hoặc cứng, da khô/ngăm, trông nghiêm; thuở nhỏ có thể yếu hoặc nhút nhát.', uranus: 'Thiên Vương gần cung Mọc: nét ngoại hình khác thường, cao, phong cách lạ, ánh mắt sắc.',
    neptune: 'Hải Vương gần cung Mọc: ánh mắt mơ màng, nét mềm, vẻ ngoài khó nắm bắt, nhạy cảm thuốc men.', pluto: 'Diêm Vương gần cung Mọc: ánh mắt xuyên thấu, thần thái mạnh, bí ẩn.',
    northNode: 'Nút Bắc ở nhà 1: vẻ ngoài và bản thân là con đường phát triển – càng tự khẳng định càng may mắn.'
  };
  nha1.forEach(function (p) { if (mo[p.key]) items.push(mo[p.key]); });
  return items;
}

function ctDauHieuCoThe_(ct) {
  var items = [], by = ct.by;
  var ma = by.mars, sa = by.saturn, mo = by.moon, n6 = ct.cusp[5];
  items.push('Sao Hỏa (vết thương, sẹo, viêm, sốt) ở ' + ma.cungTen + ' → vùng ' + CT_CUNG[ma.cung].bp + ' dễ có sẹo, vết cắt/bỏng hoặc hay bị viêm' + (ma.nha === 1 ? '; Hỏa ở nhà 1 nên sẹo thường ở vùng dễ thấy (đầu, mặt).' : '.'));
  items.push('Sao Thổ (xương, răng, da, mãn tính) ở ' + sa.cungTen + ' → vùng ' + CT_CUNG[sa.cung].bp + ' là điểm yếu bền lâu: dễ khô, cứng, đau mạn hoặc có nốt ruồi/đốm sẫm.');
  items.push('Mặt Trăng (dịch thể, nhạy cảm) ở ' + mo.cungTen + ' → vùng ' + CT_CUNG[mo.cung].bp + ' phản ứng mạnh với căng thẳng cảm xúc.');
  items.push('Cung Mọc ' + ct.asc.cungTen + ' làm nổi bật vùng ' + CT_CUNG[ct.asc.cung].bp + ' – thường là nét dễ nhận ra trên cơ thể.');
  items.push('Nhà 6 (sức khỏe) khởi ở ' + n6.cungTen + ' → cần chăm sóc ' + CT_CUNG[n6.cung].bp + '.');
  return items;
}

function ctGocGac_(ct) {
  var by = ct.by, c4 = ct.cusp[3], items = [];
  var h4 = ct.hanhTinh.filter(function (p) { return p.nha === 4; });
  items.push('Đáy trời (IC – nhà 4) ở ' + c4.cungTen + ': gốc gác mang màu sắc ' + CT_CUNG[c4.cung].tuKhoa + '. Chủ tinh nhà 4 (' + CT_HT[CT_CUNG[c4.cung].chuCo].ten + ') ở ' + by[CT_CUNG[c4.cung].chuCo].cungTen + ', nhà ' + by[CT_CUNG[c4.cung].chuCo].nha + '.');
  var y4 = { sun: 'Mặt Trời nhà 4: gia đình là trung tâm đời sống, cha có ảnh hưởng lớn; về già vững vàng.', moon: 'Mặt Trăng nhà 4: gắn bó sâu với mẹ, quê nhà; hay chuyển chỗ ở thời nhỏ.',
    mercury: 'Sao Thủy nhà 4: nhà có truyền thống học hành/buôn bán, hay đọc sách, dịch chuyển.', venus: 'Sao Kim nhà 4: gia đình êm ấm, nhà đẹp, có thể được thừa hưởng tài sản.',
    mars: 'Sao Hỏa nhà 4: gia đình nhiều va chạm hoặc cha mẹ nghiêm khắc, nóng tính; có thể sớm rời nhà.', jupiter: 'Sao Mộc nhà 4: xuất thân có phúc, nhà rộng, gia giáo tốt; được gia đình nâng đỡ.',
    saturn: 'Sao Thổ nhà 4: tuổi thơ nhiều trách nhiệm hoặc thiếu thốn tình cảm/vật chất, cha mẹ nghiêm; tự lập sớm, về già mới yên.', uranus: 'Thiên Vương nhà 4: gia đình khác thường, hay xáo trộn chỗ ở, có thể cha mẹ ly tán.',
    neptune: 'Hải Vương nhà 4: gia đình mơ hồ, có bí mật hoặc một thành viên cần hy sinh chăm sóc; tâm linh trong nhà.', pluto: 'Diêm Vương nhà 4: biến cố lớn trong gia đình thời nhỏ, quyền lực gia trưởng, gốc rễ phải được chữa lành.',
    northNode: 'Nút Bắc nhà 4: bài học đời là xây tổ ấm và kết nối cội nguồn.' };
  h4.forEach(function (p) { items.push(y4[p.key]); });
  var ms = ct.goc.filter(function (g) { return (g.a === 'moon' || g.b === 'moon') && (g.a === 'saturn' || g.b === 'saturn' || g.a === 'jupiter' || g.b === 'jupiter'); });
  ms.forEach(function (g) {
    var other = g.a === 'moon' ? g.b : g.a;
    items.push((other === 'jupiter' ? (g.loai === 'xau' ? '◇ Mặt Trăng ' + g.goc + ' Sao Mộc: mẹ/gia đình bao bọc, nuông chiều quá mức.' : '✓ Mặt Trăng ' + g.goc + ' Sao Mộc: mẹ hiền, được bao bọc, tuổi thơ đầy đủ.')
      : (g.loai === 'tot' ? '✓ Mặt Trăng ' + g.goc + ' Sao Thổ: được dạy dỗ nền nếp, sớm chín chắn.' : '✗ Mặt Trăng ' + g.goc + ' Sao Thổ: tuổi thơ khá kham khổ hoặc thiếu hơi ấm, mẹ vất vả.')));
  });
  var sn = by.sun;
  items.push('Mặt Trời (hình ảnh người cha) ở ' + sn.cungTen + ' nhà ' + sn.nha + (sn.pham ? ' (' + sn.pham + ')' : '') + '; Mặt Trăng (người mẹ) ở ' + mo_(by) + '.');
  return items;
}
function mo_(by) { return by.moon.cungTen + ' nhà ' + by.moon.nha + (by.moon.pham ? ' (' + by.moon.pham + ')' : ''); }

/** Hồ sơ năm (profection) & quá cảnh Mộc – Thổ năm xem */
function ctNamXem_(ct, viewYear) {
  var T = ct.thoiDiem, tuoi = viewYear - T.y;
  var nha = (tuoi % 12) + 1, cung = (ct.asc.cung + tuoi) % 12, chuNam = CT_CUNG[cung].chuCo;
  var jdMid = astJD_(viewYear, 7, 1, 12, 0, 7), d = jdMid - 2451543.5;
  var ju = astPlanetLon_('jupiter', d), sa = astPlanetLon_('saturn', d);
  var items = ['Hồ sơ năm (profection): năm ' + viewYear + ' (tròn ' + tuoi + ' tuổi) kích hoạt nhà ' + nha + ' – ' + CT_NHA[nha - 1].y + '. Cung ' + CT_CUNG[cung].ten + ', "chủ năm" là ' + CT_HT[chuNam].ten +
    ' (gốc ở ' + ct.by[chuNam].cungTen + ', nhà ' + ct.by[chuNam].nha + (ct.by[chuNam].pham ? ', ' + ct.by[chuNam].pham : '') + ') – mọi quá cảnh chạm vào hành tinh này trong năm đều nổi bật.'];
  var jn = ctNhaCua_(ju, ct.cusp.map(function (c) { return c.lon; })), sn = ctNhaCua_(sa, ct.cusp.map(function (c) { return c.lon; }));
  items.push('✓ Sao Mộc quá cảnh ' + CT_CUNG[ctCung_(ju)].ten + ', nhà ' + jn + ' gốc: mở rộng và gặp may về ' + CT_NHA[jn - 1].y + '.');
  items.push('◇ Sao Thổ quá cảnh ' + CT_CUNG[ctCung_(sa)].ten + ', nhà ' + sn + ' gốc: sắp xếp lại, chịu trách nhiệm và kiên nhẫn về ' + CT_NHA[sn - 1].y + '.');
  ['sun', 'moon', 'asc', 'mc'].forEach(function (k) {
    [['jupiter', ju], ['saturn', sa]].forEach(function (x) {
      var dist = ctKhoang_(x[1], ct.by[k].lon);
      [0, 90, 180].forEach(function (g) {
        if (Math.abs(dist - g) < 4) items.push((x[0] === 'jupiter' ? '✓ ' : '✗ ') + CT_HT[x[0]].ten + ' quá cảnh ' + (g === 0 ? 'hợp' : g === 90 ? 'vuông' : 'đối') + ' ' + ct.by[k].ten + ' gốc – ' +
          (x[0] === 'jupiter' ? 'năm được nâng đỡ rõ về ' + { sun: 'uy tín, sức sống', moon: 'gia đình, cảm xúc', asc: 'bản thân, sức khỏe, hình ảnh', mc: 'sự nghiệp, danh tiếng' }[k] : 'năm thử thách/sắp xếp lại ' + { sun: 'mục tiêu sống, sức khỏe tim mạch', moon: 'gia đình, cảm xúc, nhà ở', asc: 'thể lực, hình ảnh bản thân', mc: 'sự nghiệp, vị trí xã hội' }[k]) + '.');
      });
    });
  });
  return { tuoi: tuoi, nha: nha, items: items };
}

/** Luận giải đầy đủ */
function chiemTinhLuan(ct, viewYear) {
  var by = ct.by, S = CT_CUNG, out = { secs: [] };
  var sun = by.sun, moon = by.moon, asc = ct.asc;
  out.tomTat = 'Mặt Trời ' + sun.cungTen + ' · Mặt Trăng ' + moon.cungTen + ' · Mọc ' + asc.cungTen;
  out.boBa = [
    { tieuDe: '☉ Mặt Trời ' + S[sun.cung].ky + ' ' + sun.cungTen + ' – con người cốt lõi', items: [S[sun.cung].sun, 'Nhà ' + sun.nha + ': ' + CT_HT.sun.nha + ' ' + CT_NHA[sun.nha - 1].y + '.', 'Nguyên tố ' + S[sun.cung].nt + ', tính chất ' + S[sun.cung].tc + '. Mặt tối cần tránh: ' + S[sun.cung].bong + '.'] },
    { tieuDe: '☽ Mặt Trăng ' + S[moon.cung].ky + ' ' + moon.cungTen + ' – thế giới cảm xúc', items: [S[moon.cung].moon, 'Nhà ' + moon.nha + ': ' + CT_HT.moon.nha + ' ' + CT_NHA[moon.nha - 1].y + '.', 'Pha Mặt Trăng khi sinh: ' + ct.phaTrang.ten + ' (' + ct.phaTrang.goc + '°) – ' + ct.phaTrang.y + '.'] },
    { tieuDe: '↑ Cung Mọc ' + S[asc.cung].ky + ' ' + asc.cungTen + ' – mặt nạ & cơ thể', items: [S[asc.cung].asc, 'Thiên đỉnh (MC) ở ' + ct.mc.cungTen + ' ' + ct.mc.do + ': hình ảnh nghề nghiệp mang màu ' + S[ct.mc.cung].tuKhoa + '.'] }
  ];
  out.secs.push({ tieuDe: 'Hành tinh trong cung & nhà', items: ct.hanhTinh.map(ctPlanetInSign_) });
  var nhaItems = [];
  Object.keys(ct.demNha).sort(function (a, b) { return ct.demNha[b] - ct.demNha[a]; }).forEach(function (n) {
    if (ct.demNha[n] >= 2) nhaItems.push('Nhà ' + n + ' có ' + ct.demNha[n] + ' hành tinh (stellium nhỏ) – ' + CT_NHA[n - 1].y + ' là sân khấu chính của đời.');
  });
  ct.hanhTinh.forEach(function (p) { if (p.key !== 'northNode' && ['sun', 'moon', 'venus', 'mars', 'jupiter', 'saturn'].indexOf(p.key) >= 0) nhaItems.push(p.ky + ' ' + p.ten + ' nhà ' + p.nha + ': ' + CT_HT[p.key].nha + ' ' + CT_NHA[p.nha - 1].y + '.'); });
  var b = ct.banCau;
  nhaItems.push(b.dong > b.tay ? 'Bán cầu Đông (' + b.dong + '/10): tự quyết định số phận, chủ động tạo cơ hội.' : 'Bán cầu Tây (' + b.tay + '/10): thành công qua người khác, hợp tác và thời cơ.');
  nhaItems.push(b.tren > b.duoi ? 'Nửa trên (' + b.tren + '/10): hướng ra xã hội, sự nghiệp và hình ảnh công chúng.' : 'Nửa dưới (' + b.duoi + '/10): hướng về nội tâm, gia đình và đời sống riêng.');
  out.secs.push({ tieuDe: 'Nhà (hệ ' + ct.heNha + ') & bán cầu', items: nhaItems });
  out.secs.push({ tieuDe: 'Góc chiếu (' + ct.goc.length + ')', items: ct.goc.slice(0, 24).map(ctGocY_) });

  var tong = 0; Object.keys(ct.nguyenTo).forEach(function (k) { tong += ct.nguyenTo[k]; });
  var ntItems = Object.keys(ct.nguyenTo).map(function (k) {
    var pc = Math.round(ct.nguyenTo[k] / tong * 100);
    return k + ' ' + pc + '% – ' + CT_NT[k].y + (pc < 10 ? '. ◇ ' + CT_NT[k].thieu : pc > 40 ? '. ◇ ' + CT_NT[k].du : '');
  });
  var tcMax = Object.keys(ct.tinhChat).sort(function (a, b) { return ct.tinhChat[b] - ct.tinhChat[a]; })[0];
  ntItems.push('Tính chất trội: ' + tcMax + ' – ' + CT_TC[tcMax].y + '; khi quá mức: ' + CT_TC[tcMax].du + '.');
  out.secs.push({ tieuDe: 'Cân bằng Nguyên tố – Tính chất', items: ntItems });
  out.ngoaiHinh = ctPhysique_(ct);
  out.coThe = ctDauHieuCoThe_(ct);
  out.gocGac = ctGocGac_(ct);
  out.chuKy = ct.chuKy.map(function (c) { return { tuoi: c.tuoi, nam: c.nam, ten: c.ten, moTa: c.moTa }; });
  out.namXem = ctNamXem_(ct, viewYear);
  out.nghe = ctNghe_(ct);
  out.coSo = [
    'Hoàng đạo nhiệt đới (tropical) tính từ điểm xuân phân của ngày sinh; vị trí hành tinh tính bằng quỹ đạo Kepler + nhiễu động, Mặt Trăng theo chuỗi Meeus (sai số < 5′ so với astronomy-engine).',
    'Nhà Placidus theo nửa cung ban ngày/ban đêm (tự chuyển Porphyry ở vĩ độ trên 66°). Giờ sinh cần chính xác: cung Mọc dịch 1° mỗi ~4 phút.',
    'Phẩm chất (dignity) theo Ptolemy: Miếu – Vượng mạnh, Hãm – Tù yếu. Góc chiếu chính (Ptolemaic) + lệch 150°; orb 8° cho hợp/đối, 7° cho vuông/tam hợp, 5° cho lục hợp, +2° với Mặt Trời/Mặt Trăng.',
    'Nguyên tố – tính chất có trọng số: Mặt Trời, Mặt Trăng, cung Mọc = 3; Thủy, Kim, Hỏa = 2; Mộc, Thổ = 1; hành tinh ngoài = 0,5.',
    'Hồ sơ năm (annual profection – Vettius Valens): mỗi năm tuổi tiến 1 nhà tính từ cung Mọc; chủ tinh cung đó là "chủ năm".',
    'Chu kỳ đời người tính theo ngày quá cảnh thực (Sao Thổ 29,5 năm, Sao Mộc 11,9 năm, Thiên Vương 84 năm, Nút 18,6 năm).'
  ];
  return out;
}

function ctNghe_(ct) {
  var mcS = CT_CUNG[ct.mc.cung], items = [];
  var nghe = ['quân đội, thể thao, khởi nghiệp, cơ khí, cấp cứu', 'tài chính – ngân hàng, bất động sản, ẩm thực, nghệ thuật thủ công, làm đẹp', 'truyền thông, báo chí, giảng dạy, bán hàng, công nghệ thông tin', 'giáo dục mầm non, y tế – điều dưỡng, nhà hàng, bất động sản, lịch sử',
    'giải trí, lãnh đạo, thiết kế, giáo dục trẻ em, thời trang', 'y tế, dinh dưỡng, kế toán, biên tập, phân tích dữ liệu, dịch vụ', 'luật, ngoại giao, thiết kế, thời trang, tư vấn, nhân sự', 'tâm lý, điều tra, nghiên cứu, y khoa – phẫu thuật, tài chính đầu tư, bảo hiểm',
    'giáo dục đại học, du lịch, xuất bản, luật, tôn giáo, xuất nhập khẩu', 'quản lý, hành chính nhà nước, xây dựng, kỹ thuật, doanh nghiệp lớn', 'công nghệ, khoa học, cải cách xã hội, hàng không, phi lợi nhuận', 'nghệ thuật, âm nhạc, điện ảnh, y tế – chữa lành, tâm linh, từ thiện'];
  items.push('Thiên đỉnh (MC) ' + mcS.ten + ': hợp ' + nghe[ct.mc.cung] + '.');
  var h10 = ct.hanhTinh.filter(function (p) { return p.nha === 10; });
  h10.forEach(function (p) { items.push(p.ten + ' ở nhà 10 – sự nghiệp mang dấu ấn ' + CT_HT[p.key].cn + '.'); });
  items.push('Mặt Trời ' + ct.by.sun.cungTen + ' gợi ý thêm: ' + nghe[ct.by.sun.cung] + '.');
  return { items: items, mcCung: ct.mc.cung, sunCung: ct.by.sun.cung };
}
