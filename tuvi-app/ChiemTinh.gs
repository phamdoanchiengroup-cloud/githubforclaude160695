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
    chuTinh: chuKey, chuTinhMoi: chuMoi, demNha: demNha, chuKy: ctChuKy_(jd, pos, T), nhap: { gender: input.gender } };
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
  try { out.phanTich = ctPhanTich_(ct, viewYear, ct.nhap); } catch (e) { out.phanTichLoi = String(e && e.message || e) + ' @ ' + String(e && e.stack || '').split('\n')[1]; }
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

/* ============================================================
 *  ĐIỂM PHỤ: CHIRON, LILITH (Trăng Đen trung bình), NÚT NAM
 * ============================================================ */
/** Chiron (2060): quỹ đạo Kepler hai vật từ phần tử J2000 (q 8,533 AU; a 13,70 AU; i 6,93°; Ω 209,27°; ω 339,71°;
 *  qua điểm cận nhật 14/2/1996). Sai số cỡ 1° trong giai đoạn 1940–2040 do nhiễu động của Sao Thổ. */
function ctChiron_(jd) {
  var d = jd - 2451543.5, a = 13.70, e = 1 - 8.533 / 13.70, i = 6.93, N = 209.27, w = 339.71;
  var n = 0.9856076686 / Math.pow(a, 1.5);
  function helio(jj) {
    var MM = astNorm_(n * (jj - 2450128.0)), E = astKepler_(MM, e);
    var xv = a * (astCos_(E) - e), yv = a * Math.sqrt(1 - e * e) * astSin_(E), v = astAtan2_(yv, xv), r = Math.sqrt(xv * xv + yv * yv);
    var xh = r * (astCos_(N) * astCos_(v + w) - astSin_(N) * astSin_(v + w) * astCos_(i));
    var yh = r * (astSin_(N) * astCos_(v + w) + astCos_(N) * astSin_(v + w) * astCos_(i));
    var zh = r * astSin_(v + w) * astSin_(i);
    var lon = astAtan2_(yh, xh) + 1.396971 * (jj - 2451545.0) / 36525, lat = astAtan2_(zh, Math.sqrt(xh * xh + yh * yh));
    return { x: r * astCos_(lon) * astCos_(lat), y: r * astSin_(lon) * astCos_(lat), z: r * astSin_(lat) };
  }
  var sun = astSun_(d), h = helio(jd), gx = h.x + sun.x, gy = h.y + sun.y, gz = h.z;
  var tau = Math.sqrt(gx * gx + gy * gy + gz * gz) * 0.0057755183;
  h = helio(jd - tau);
  return astNorm_(astAtan2_(h.y + sun.y, h.x + sun.x) - 0.0057);
}
/** Lilith – Trăng Đen trung bình = viễn điểm trung bình của quỹ đạo Mặt Trăng (Meeus, cận điểm trung bình + 180°) */
function ctLilith_(jd) {
  var T = (jd - 2451545.0) / 36525;
  return astNorm_(83.3532465 + 4069.0137287 * T - 0.0103200 * T * T - T * T * T / 80053 + 180);
}

/* ============================================================
 *  PHÂN TÍCH ĐẦY ĐỦ THEO QUY TRÌNH 7 BƯỚC (xem docs/quy-trinh-chiem-tinh.md)
 *  B1 dữ liệu & giờ sao · B2 lá số (kể cả Nút Nam, Chiron, Lilith) · B3 Big Three, hành tinh,
 *  12 nhà, góc chiếu, cấu hình (Stellium, T-Square, Grand Trine, Grand Cross, Yod)
 *  B4 tám lĩnh vực · B5 transit, tiến triển thứ cấp, Solar Arc, Solar Return, Lunar Return
 *  B7 luận tổng hợp + lời khuyên · trường hợp đặc biệt (nghịch hành, phẩm chất, nhà trống) · ứng dụng.
 *  B6 (so sánh hai lá số, Composite, Davison) nằm ở CapDoi.gs › cdChiemTinh_ (dùng ctSoSanh_).
 * ============================================================ */
var CT_PHAM_TEN = { 'Vượng': 'Vượng (Exaltation) – mạnh nhất', 'Miếu': 'Miếu (Domicile) – mạnh', 'Hãm': 'Hãm (Detriment) – yếu', 'Tù': 'Tù (Fall) – yếu nhất' };
var CT_PHAM_DIEM2 = { 'Vượng': 2, 'Miếu': 1.5, 'Hãm': -1, 'Tù': -1.5 };
var CT_NGHICH = {
  mercury: ['3–4 lần/năm', 'giao tiếp hướng nội: nghĩ kỹ rồi mới nói, học sâu hơn học nhanh; hay xem lại, sửa lại'],
  venus: ['1 lần/18 tháng', 'tình yêu hướng nội: chậm mở lòng, giá trị riêng khác số đông; hay nhìn lại chuyện cũ'],
  mars: ['1 lần/2 năm', 'hành động hướng nội: dồn nén rồi bùng; hợp làm việc âm thầm, bền bỉ'],
  jupiter: ['1 lần/năm', 'mở rộng hướng nội: niềm tin tự tìm lấy, may mắn đến qua chiêm nghiệm'],
  saturn: ['1 lần/năm', 'kỷ luật hướng nội: tự đặt chuẩn rất cao cho mình, trách nhiệm nặng trong lòng'],
  uranus: ['1 lần/năm', 'đổi mới hướng nội: cách mạng trong suy nghĩ trước khi thể hiện ra ngoài'],
  neptune: ['1 lần/năm', 'tâm linh hướng nội: trực giác mạnh, đời sống tinh thần phong phú'],
  pluto: ['1 lần/năm', 'chuyển hóa hướng nội: sức mạnh ngầm, tự "lột xác" từ bên trong']
};
var CT_CAU_HINH = {
  stellium: 'năng lượng tập trung – chủ đề này nổi bật suốt đời',
  tSquare: 'căng thẳng tạo động lực phát triển – đỉnh chữ T là nơi phải nỗ lực nhiều nhất',
  grandTrine: 'tài năng bẩm sinh, may mắn tự nhiên – cần chủ động dùng, kẻo dễ dãi',
  grandCross: 'bốn phía giằng co – đời nhiều thử thách nhưng rèn nên bản lĩnh lớn',
  yod: '"ngón tay của định mệnh" – cần điều chỉnh liên tục, có sứ mệnh đặc biệt ở hành tinh đỉnh'
};
var CT_HT_TRON = { sun: 'tự tin, nổi bật', moon: 'nhạy cảm, dễ biểu lộ cảm xúc', mercury: 'lanh lợi, hoạt ngôn', venus: 'duyên dáng, dễ mến', mars: 'mạnh mẽ, nhanh nhẹn, hơi nóng',
  jupiter: 'hào phóng, lạc quan', saturn: 'nghiêm túc, dè dặt, chín chắn', uranus: 'khác biệt, độc lập', neptune: 'mơ mộng, khó đoán', pluto: 'bí ẩn, có sức hút mạnh', northNode: 'hướng về sự trưởng thành' };
var CT_HT_CN_TRON = { sun: 'sức sống và ý chí', moon: 'sự nhạy cảm, thấu hiểu cảm xúc', mercury: 'trí óc và cách giao tiếp', venus: 'sức hút, gu thẩm mỹ và chuyện tình cảm', mars: 'năng lượng hành động',
  jupiter: 'sự lạc quan và may mắn', saturn: 'kỷ luật và sự bền bỉ', uranus: 'óc sáng tạo, đổi mới', neptune: 'trí tưởng tượng, lòng trắc ẩn', pluto: 'nội lực và khả năng tái sinh' };
var CT_TRANSIT_Y = {
  jupiter: ['mở rộng, gặp may, quý nhân nâng đỡ', 'dễ quá đà, hứa nhiều, tiêu nhiều'],
  saturn: ['xây nền vững, được ghi nhận nhờ bền bỉ', 'thử thách, trì hoãn, cần kỷ luật và kiên nhẫn'],
  uranus: ['đổi mới bất ngờ theo hướng tốt, cơ hội lạ', 'xáo trộn đột ngột, muốn phá khuôn'],
  neptune: ['cảm hứng, trực giác, lòng trắc ẩn', 'mơ hồ, dễ nhầm lẫn hoặc bị lừa – kiểm tra kỹ'],
  pluto: ['chuyển hóa sâu, nắm lại quyền chủ động', 'khủng hoảng buộc thay đổi tận gốc']
};
var CT_DIEM_CHU_DE = { sun: 'bản thân, mục tiêu sống, sức khỏe', moon: 'gia đình, cảm xúc, nhà ở', mercury: 'học tập, giấy tờ, giao tiếp', venus: 'tình cảm, tiền bạc, niềm vui',
  mars: 'năng lượng, cạnh tranh, dự án mới', asc: 'hình ảnh bản thân, thể lực', mc: 'sự nghiệp, danh tiếng' };
function ctDuyNhat_(a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }); }
var CT_NHA_NGAN = ['bản thân', 'tiền bạc', 'học tập, giao tiếp', 'gia đình, nhà cửa', 'sáng tạo, tình yêu, con cái', 'công việc hằng ngày, sức khỏe', 'hôn nhân, đối tác', 'tài chính chung, chuyển hóa', 'học vấn cao, đi xa', 'sự nghiệp, danh tiếng', 'bạn bè, cộng đồng', 'đời sống tinh thần, điều thầm kín'];
var CT_TEN_BU = { 'Lửa': 'ánh sáng, sức nóng: Minh, Quang, Huy, Dương, Hỏa, Nhật, Hồng', 'Đất': 'đất đá, núi, ruộng: Sơn, Thạch, Điền, Khôi, An, Kiên, Ngọc',
  'Khí': 'gió, mây, bầu trời: Phong, Vân, Thiên, Không, Tú, Linh, Khang', 'Nước': 'sông, biển, mưa: Hải, Giang, Hà, Thủy, Tuyết, Băng, Uyên' };

function ctPhamDiem_(ph) { return CT_PHAM_DIEM2[ph] || 0; }
function ctJdNgay_(jd, tz) { var x = jd + (tz || 0) / 24 + 0.5, z = Math.floor(x), f = x - z, dmy = jdToDate(z), h = Math.floor(f * 24), mi = Math.floor((f * 24 - h) * 60); return { d: dmy[0], m: dmy[1], y: dmy[2], h: h, mi: mi, t: dmy[0] + '/' + dmy[1] + '/' + dmy[2] + ' ' + (h < 10 ? '0' : '') + h + ':' + (mi < 10 ? '0' : '') + mi }; }
function ctGocGiua_(a, b, dsG) {
  var dist = ctKhoang_(a, b);
  for (var k = 0; k < dsG.length; k++) if (Math.abs(dist - dsG[k][0]) <= dsG[k][1]) return { deg: dsG[k][0], orb: Math.round(Math.abs(dist - dsG[k][0]) * 10) / 10 };
  return null;
}
var CT_GOC_TEN = { 0: ['Hợp', '☌'], 60: ['Lục hợp', '⚹'], 90: ['Vuông', '□'], 120: ['Tam hợp', '△'], 150: ['Lệch', '⚻'], 180: ['Đối', '☍'] };
function ctBac_(d) { return d >= 0.6 ? 'tot' : d >= -0.6 ? 'vua' : 'kho'; }

function ctPhanTich_(ct, viewYear, input) {
  var T = ct.thoiDiem, by = ct.by, cuspLon = ct.cusp.map(function (c) { return c.lon; }), out = {};
  var HT10 = ct.hanhTinh.filter(function (p) { return p.key !== 'northNode'; });
  // ---- B1: dữ liệu, đổi giờ
  var ut = ctJdNgay_(T.jd, 0), lst = astNorm_(astGMST_(T.jd) + T.lon) / 15, lh = Math.floor(lst), lm = Math.floor((lst - lh) * 60), ls = Math.round(((lst - lh) * 60 - lm) * 60);
  out.duLieu = { ngay: T.d + '/' + T.m + '/' + T.y, gio: (T.h < 10 ? '0' : '') + T.h + ':' + (T.mi < 10 ? '0' : '') + T.mi, tz: T.tz, gmt: ut.t, gioSao: lh + 'h' + (lm < 10 ? '0' : '') + lm + 'm' + (ls < 10 ? '0' : '') + ls + 's',
    jd: Math.round(T.jd * 10000) / 10000, noiSinh: T.noiSinh, lat: T.lat, lon: T.lon, heNha: ct.heNha, gioiTinh: input && /nu|nữ/i.test(String(input.gender || '')) ? 'Nữ' : 'Nam' };
  // ---- B2: điểm phụ
  function diem(key, ten, ky, lon) { var s = ctCung_(lon); return { key: key, ten: ten, ky: ky, lon: lon, cung: s, cungTen: CT_CUNG[s].ten, do: ctFmtDo_(lon), nha: ctNhaCua_(lon, cuspLon) }; }
  var nn = by.northNode;
  var phu = [diem('southNode', 'Nút Nam', '☋', astNorm_(nn.lon + 180)), diem('chiron', 'Chiron', '⚷', ctChiron_(T.jd)), diem('lilith', 'Lilith', '⚸', ctLilith_(T.jd))];
  out.diemPhu = phu.map(function (p) {
    var Y = { southNode: 'thói quen, sở trường cũ – vùng an toàn cần bước ra', chiron: 'vết thương sâu nhất, cũng là nơi bạn có khả năng chữa lành người khác', lilith: 'phần bản năng bị dồn nén, khao khát tự do không muốn bị kiểm soát' }[p.key];
    return { key: p.key, ten: p.ten, ky: p.ky, cungTen: p.cungTen, do: p.do, nha: p.nha, y: Y, t: p.ten + ' ở ' + p.cungTen + ' ' + p.do + ', nhà ' + p.nha + ': ' + Y + ' – thể hiện qua ' + CT_CUNG[p.cung].tuKhoa + ', trong lĩnh vực ' + CT_NHA[p.nha - 1].y + '.' };
  });
  // ---- Góc chiếu giữa 10 hành tinh (dùng cho cấu hình và chấm điểm)
  var G = [[0, 8], [60, 5], [90, 7], [120, 7], [150, 3], [180, 8]], M = {};
  HT10.forEach(function (a) { M[a.key] = {}; });
  HT10.forEach(function (a, i) { HT10.forEach(function (b, j) { if (j > i) { var g = ctGocGiua_(a.lon, b.lon, G); if (g) { M[a.key][b.key] = g.deg; M[b.key][a.key] = g.deg; } } }); });
  function co(a, b, deg) { return M[a] && M[a][b] === deg; }
  // Điểm sức mạnh từng hành tinh: phẩm chất + góc với cát tinh / hung tinh + nghịch hành
  var CAT = ['venus', 'jupiter'], HUNG = ['mars', 'saturn', 'pluto', 'uranus', 'neptune'];
  function sucHT(k) {
    var p = by[k]; if (!p) return 0;
    var d = ctPhamDiem_(p.pham) + (p.nghich ? -0.2 : 0);
    Object.keys(M[k] || {}).forEach(function (o) {
      var g = M[k][o];
      if (CAT.indexOf(o) >= 0) d += g === 120 || g === 60 ? 0.6 : g === 0 ? 0.4 : g === 90 || g === 180 ? -0.1 : 0;
      if (HUNG.indexOf(o) >= 0) d += g === 90 || g === 180 ? -0.6 : g === 150 ? -0.3 : g === 0 ? -0.3 : 0.2;
    });
    return Math.round(d * 10) / 10;
  }
  function trongNha(n) { return HT10.filter(function (p) { return p.nha === n; }); }
  function chuNha(n) { return CT_CUNG[ct.cusp[n - 1].cung].chuCo; }
  var WN = { venus: 0.8, jupiter: 0.9, sun: 0.3, moon: 0.2, mercury: 0.1, mars: -0.5, saturn: -0.7, pluto: -0.4, uranus: -0.3, neptune: -0.3 };
  function sucNha(n) { var d = 0; trongNha(n).forEach(function (p) { d += WN[p.key] || 0; }); d += sucHT(chuNha(n)) * 0.4; return Math.round(d * 10) / 10; }
  // ---- B3: Big Three, hành tinh, 12 nhà, góc chiếu, cấu hình
  var S = CT_CUNG, sun = by.sun, moon = by.moon, asc = ct.asc;
  out.bigThree = {
    ket: 'Mặt Trời ' + sun.cungTen + ' + Mặt Trăng ' + moon.cungTen + ' + Mọc ' + asc.cungTen + ' → bề ngoài ' + S[asc.cung].tuKhoa + '; bên trong ' + S[sun.cung].tuKhoa + '; cảm xúc ' + S[moon.cung].tuKhoa + '.',
    ds: [{ ten: 'Mặt Trời', cung: sun.cungTen, nha: sun.nha, vai: 'bản ngã, mục đích sống', t: S[sun.cung].sun }, { ten: 'Mặt Trăng', cung: moon.cungTen, nha: moon.nha, vai: 'cảm xúc, nhu cầu an toàn', t: S[moon.cung].moon },
      { ten: 'Điểm Mọc', cung: asc.cungTen, nha: 1, vai: 'vẻ ngoài, cách khởi đầu', t: S[asc.cung].asc }]
  };
  out.hanhTinh = ct.hanhTinh.map(function (p) {
    var gs = ct.goc.filter(function (g) { return g.a === p.key || g.b === p.key; }).map(function (g) { return g.ky + ' ' + (g.a === p.key ? g.bTen : g.aTen); });
    return { key: p.key, ten: p.ten, ky: p.ky, cungTen: p.cungTen, do: p.do, nha: p.nha, pham: p.pham ? CT_PHAM_TEN[p.pham] : '', nghich: p.nghich, suc: p.key === 'northNode' ? null : sucHT(p.key), goc: gs, t: ctPlanetInSign_(p) };
  });
  out.nha12 = ct.cusp.map(function (c, i) {
    var n = i + 1, ds = trongNha(n), ck = chuNha(n), cp = by[ck];
    return { nha: n, ten: CT_NHA[i].ten, y: CT_NHA[i].y, cungTen: c.cungTen, do: c.do, hanhTinh: ds.map(function (p) { return p.ten; }), chu: CT_HT[ck].ten, chuO: cp.cungTen + ', nhà ' + cp.nha, trong: !ds.length, diem: sucNha(n),
      t: 'Nhà ' + n + ' khởi ở ' + c.cungTen + ' (' + S[c.cung].tuKhoa + ')' + (ds.length ? '; có ' + ds.map(function (p) { return p.ten; }).join(', ') : '; nhà trống – chủ đề ít được kích hoạt trực tiếp, xem chủ tinh') + '. Chủ tinh ' + CT_HT[ck].ten + ' ở ' + cp.cungTen + ', nhà ' + cp.nha + '.' };
  });
  var soTot = ct.goc.filter(function (g) { return g.loai === 'tot'; }).length, soXau = ct.goc.filter(function (g) { return g.loai === 'xau'; }).length;
  out.gocTom = 'Có ' + ct.goc.length + ' góc chiếu: ' + soTot + ' góc hài hòa, ' + soXau + ' góc căng, ' + (ct.goc.length - soTot - soXau) + ' góc hợp. ' +
    (soTot > soXau + 2 ? 'Lá số thiên về thuận – năng lực đến dễ, cần tự đặt thử thách để không dễ dãi.' : soXau > soTot + 2 ? 'Lá số nhiều góc căng – đời nhiều thử thách, nhưng đó cũng là nguồn động lực và bản lĩnh.' : 'Thuận và căng khá cân bằng.');
  // Cấu hình đặc biệt
  var ch = [], keys = HT10.map(function (p) { return p.key; });
  var theoCung = {}, theoNha = {};
  HT10.forEach(function (p) { (theoCung[p.cung] = theoCung[p.cung] || []).push(p.ten); (theoNha[p.nha] = theoNha[p.nha] || []).push(p.ten); });
  Object.keys(theoCung).forEach(function (c) { if (theoCung[c].length >= 3) ch.push({ loai: 'stellium', ten: 'Stellium cung ' + S[c].ten, ds: theoCung[c], t: theoCung[c].length + ' hành tinh (' + theoCung[c].join(', ') + ') cùng ở ' + S[c].ten + ': ' + CT_CAU_HINH.stellium + ' – ' + S[c].tuKhoa + '.' }); });
  Object.keys(theoNha).forEach(function (n) { if (theoNha[n].length >= 3) ch.push({ loai: 'stellium', ten: 'Stellium nhà ' + n, ds: theoNha[n], t: theoNha[n].length + ' hành tinh (' + theoNha[n].join(', ') + ') cùng ở nhà ' + n + ': ' + CT_CAU_HINH.stellium + ' – ' + CT_NHA[n - 1].y + '.' }); });
  var ten = function (k) { return CT_HT[k].ten; };
  for (var i = 0; i < keys.length; i++) for (var j = i + 1; j < keys.length; j++) for (var k = j + 1; k < keys.length; k++) {
    var a = keys[i], b = keys[j], c = keys[k];
    if (co(a, b, 120) && co(b, c, 120) && co(a, c, 120)) ch.push({ loai: 'grandTrine', ten: 'Grand Trine (tam hợp lớn)', ds: [ten(a), ten(b), ten(c)], t: ten(a) + ' – ' + ten(b) + ' – ' + ten(c) + ' tam hợp nhau: ' + CT_CAU_HINH.grandTrine + '.' });
    [[a, b, c], [a, c, b], [b, c, a]].forEach(function (x) {
      if (co(x[0], x[1], 180) && co(x[0], x[2], 90) && co(x[1], x[2], 90)) ch.push({ loai: 'tSquare', ten: 'T-Square (chữ T)', ds: [ten(x[0]), ten(x[1]), ten(x[2])], dinh: ten(x[2]), t: ten(x[0]) + ' đối ' + ten(x[1]) + ', cùng vuông ' + ten(x[2]) + ' (đỉnh): ' + CT_CAU_HINH.tSquare + '.' });
      if (co(x[0], x[1], 60) && co(x[0], x[2], 150) && co(x[1], x[2], 150)) ch.push({ loai: 'yod', ten: 'Yod', ds: [ten(x[0]), ten(x[1]), ten(x[2])], dinh: ten(x[2]), t: ten(x[0]) + ' lục hợp ' + ten(x[1]) + ', cùng lệch 150° tới ' + ten(x[2]) + ' (đỉnh): ' + CT_CAU_HINH.yod + '.' });
    });
  }
  for (i = 0; i < keys.length; i++) for (j = i + 1; j < keys.length; j++) if (co(keys[i], keys[j], 180)) for (k = 0; k < keys.length; k++) for (var l = k + 1; l < keys.length; l++) {
    if ([i, j].indexOf(k) >= 0 || [i, j].indexOf(l) >= 0 || k < i) continue;
    var A2 = keys[i], B2 = keys[j], C2 = keys[k], D2 = keys[l];
    if (co(C2, D2, 180) && co(A2, C2, 90) && co(A2, D2, 90) && co(B2, C2, 90) && co(B2, D2, 90)) ch.push({ loai: 'grandCross', ten: 'Grand Cross (thập tự lớn)', ds: [ten(A2), ten(B2), ten(C2), ten(D2)], t: ten(A2) + ', ' + ten(B2) + ', ' + ten(C2) + ', ' + ten(D2) + ' tạo hai cặp đối vuông nhau: ' + CT_CAU_HINH.grandCross + '.' });
  }
  out.cauHinh = ch;
  // ---- B4: tám lĩnh vực
  function tenDs(ds) { return ds.length ? ds.map(function (p) { return p.ten; }).join(', ') : 'không có hành tinh'; }
  function tronDs(ds) { return ds.map(function (p) { return CT_HT_TRON[p.key]; }).join('; '); }
  function boNgoac(s) { return String(s).replace(/\s*\([^)]*\)/g, ''); }
  var c4 = ct.cusp[3], c3 = ct.cusp[2], c5 = ct.cusp[4], c7 = ct.cusp[6], c2 = ct.cusp[1], c8 = ct.cusp[7], c6 = ct.cusp[5], c12 = ct.cusp[11], c10 = ct.cusp[9];
  var h1 = trongNha(1), h3 = trongNha(3), h4 = trongNha(4), h5 = trongNha(5), h7 = trongNha(7), h2 = trongNha(2), h8 = trongNha(8), h6 = trongNha(6), h12 = trongNha(12), h10 = trongNha(10);
  var me = by.mercury, ve = by.venus, ma = by.mars, ju = by.jupiter, sa = by.saturn, mc = ct.mc;
  var NGHE = ['quân đội, thể thao, khởi nghiệp, cơ khí, cấp cứu', 'tài chính – ngân hàng, bất động sản, ẩm thực, làm đẹp', 'truyền thông, báo chí, giảng dạy, bán hàng, công nghệ thông tin', 'giáo dục, y tế – điều dưỡng, nhà hàng, bất động sản',
    'giải trí, lãnh đạo, thiết kế, thời trang', 'y tế, dinh dưỡng, kế toán, biên tập, phân tích dữ liệu', 'luật, ngoại giao, thiết kế, tư vấn, nhân sự', 'tâm lý, điều tra, nghiên cứu, y khoa, đầu tư, bảo hiểm',
    'giáo dục đại học, du lịch, xuất bản, luật, xuất nhập khẩu', 'quản lý, hành chính, xây dựng, kỹ thuật, doanh nghiệp lớn', 'công nghệ, khoa học, cải cách xã hội, phi lợi nhuận', 'nghệ thuật, âm nhạc, điện ảnh, chữa lành, từ thiện'];
  var LV = [
    { k: 'tinhCach', ten: 'Tính cách', icon: '🧭', dua: 'Mặt Trời · Điểm Mọc · nhà 1 · hành tinh trong nhà 1', diem: sucHT('sun') * 0.5 + sucHT(ct.chuTinh) * 0.4 + sucNha(1) * 0.5,
      ky: ['Mặt Trời ' + sun.cungTen + ' nhà ' + sun.nha + (sun.pham ? ' (' + sun.pham + ')' : '') + ': ' + S[sun.cung].tuKhoa + '.', 'Mọc ' + asc.cungTen + ': ' + S[asc.cung].tuKhoa + '. Chủ tinh lá số ' + CT_HT[ct.chuTinh].ten + ' ở ' + by[ct.chuTinh].cungTen + ', nhà ' + by[ct.chuTinh].nha + '.', 'Nhà 1: ' + tenDs(h1) + '.'],
      tron: 'Bạn có xu hướng bề ngoài ' + S[asc.cung].tuKhoa + ', nhưng bên trong ' + S[sun.cung].tuKhoa + '.' + (h1.length ? ' Người khác còn thấy ở bạn nét ' + tronDs(h1) + '.' : '') },
    { k: 'camXuc', ten: 'Cảm xúc', icon: '🌙', dua: 'Mặt Trăng · nhà 4 · hành tinh trong nhà 4', diem: sucHT('moon') * 0.7 + sucNha(4) * 0.5,
      ky: ['Mặt Trăng ' + moon.cungTen + ' nhà ' + moon.nha + (moon.pham ? ' (' + moon.pham + ')' : '') + ': ' + S[moon.cung].moon, 'Nhà 4 khởi ở ' + c4.cungTen + ' (' + S[c4.cung].tuKhoa + '); có ' + tenDs(h4) + '.'],
      tron: 'Về cảm xúc, bạn có xu hướng ' + S[moon.cung].tuKhoa + '. Tổ ấm với bạn mang màu sắc ' + S[c4.cung].tuKhoa + '.' + (h4.length ? ' Gia đình để lại dấu ấn ' + tronDs(h4) + '.' : '') },
    { k: 'tuDuy', ten: 'Tư duy', icon: '💭', dua: 'Sao Thủy · nhà 3 · hành tinh trong nhà 3', diem: sucHT('mercury') * 0.7 + sucNha(3) * 0.5,
      ky: ['Sao Thủy ' + me.cungTen + ' nhà ' + me.nha + (me.nghich ? ' (nghịch hành)' : '') + ': ' + CT_PHONG_CACH.mercury[me.cung] + '.', 'Nhà 3 khởi ở ' + c3.cungTen + '; có ' + tenDs(h3) + '.'],
      tron: 'Cách bạn suy nghĩ và nói chuyện: ' + boNgoac(CT_PHONG_CACH.mercury[me.cung]) + '.' + (me.nghich ? ' Bạn hay nghĩ kỹ rồi mới nói, học chậm mà sâu.' : '') },
    { k: 'tinhYeu', ten: 'Tình yêu', icon: '💞', dua: 'Sao Kim · Sao Hỏa · nhà 5 · nhà 7', diem: sucHT('venus') * 0.5 + sucHT('mars') * 0.3 + sucNha(5) * 0.3 + sucNha(7) * 0.5,
      ky: ['Sao Kim ' + ve.cungTen + ' nhà ' + ve.nha + (ve.pham ? ' (' + ve.pham + ')' : '') + ': ' + CT_PHONG_CACH.venus[ve.cung] + '.', 'Sao Hỏa ' + ma.cungTen + ' nhà ' + ma.nha + ': ' + CT_PHONG_CACH.mars[ma.cung] + '.',
        'Nhà 5 (tình yêu lãng mạn) khởi ở ' + c5.cungTen + '; có ' + tenDs(h5) + '.', 'Nhà 7 (hôn nhân) khởi ở ' + c7.cungTen + ' (' + S[c7.cung].tuKhoa + '); có ' + tenDs(h7) + '.'],
      tron: 'Khi yêu, bạn ' + boNgoac(CT_PHONG_CACH.venus[ve.cung]) + '. Mẫu người bạn đời hợp với bạn mang nét ' + S[c7.cung].tuKhoa + '.' },
    { k: 'hanhDong', ten: 'Hành động', icon: '⚡', dua: 'Sao Hỏa · nhà 1 · hành tinh trong nhà 1', diem: sucHT('mars') * 0.7 + sucNha(1) * 0.4,
      ky: ['Sao Hỏa ' + ma.cungTen + ' nhà ' + ma.nha + (ma.pham ? ' (' + ma.pham + ')' : '') + (ma.nghich ? ', nghịch hành' : '') + ': ' + CT_PHONG_CACH.mars[ma.cung] + '.', 'Nhà 1: ' + tenDs(h1) + '.'],
      tron: 'Cách bạn hành động: ' + boNgoac(CT_PHONG_CACH.mars[ma.cung]) + '.' },
    { k: 'suNghiep', ten: 'Sự nghiệp', icon: '🏛', dua: 'MC · nhà 10 · Sao Thổ · Sao Mộc', diem: sucNha(10) * 0.6 + sucHT('saturn') * 0.3 + sucHT('jupiter') * 0.3 + sucHT(CT_CUNG[mc.cung].chuCo) * 0.3,
      ky: ['MC ở ' + mc.cungTen + ' ' + mc.do + ': hợp ' + NGHE[mc.cung] + '.', 'Nhà 10: ' + tenDs(h10) + '. Chủ tinh MC ' + CT_HT[CT_CUNG[mc.cung].chuCo].ten + ' ở ' + by[CT_CUNG[mc.cung].chuCo].cungTen + ', nhà ' + by[CT_CUNG[mc.cung].chuCo].nha + '.',
        'Sao Thổ ' + sa.cungTen + ' nhà ' + sa.nha + ': kỷ luật và thành tựu muộn về ' + CT_NHA[sa.nha - 1].y + '.', 'Sao Mộc ' + ju.cungTen + ' nhà ' + ju.nha + ': mở rộng, gặp quý nhân qua ' + CT_NHA[ju.nha - 1].y + '.'],
      tron: 'Nghề hợp với bạn: ' + NGHE[mc.cung] + '. Con đường sự nghiệp mang màu sắc ' + S[mc.cung].tuKhoa + '; bạn thường gặp may qua chuyện ' + CT_NHA_NGAN[ju.nha - 1] + ', còn thành tựu bền vững đến từ sự kiên trì ở chuyện ' + CT_NHA_NGAN[sa.nha - 1] + '.' },
    { k: 'taiChinh', ten: 'Tài chính', icon: '💰', dua: 'nhà 2 · nhà 8 · Sao Kim · Sao Mộc', diem: sucNha(2) * 0.5 + sucNha(8) * 0.3 + sucHT('venus') * 0.3 + sucHT('jupiter') * 0.3,
      ky: ['Nhà 2 (tiền tự kiếm) khởi ở ' + c2.cungTen + ' (' + S[c2.cung].tuKhoa + '); có ' + tenDs(h2) + '.', 'Nhà 8 (tiền chung, đầu tư, thừa kế) khởi ở ' + c8.cungTen + '; có ' + tenDs(h8) + '.',
        'Sao Kim (giá trị) ' + ve.cungTen + ' nhà ' + ve.nha + '; Sao Mộc (may mắn) ' + ju.cungTen + ' nhà ' + ju.nha + '.'],
      tron: 'Cách bạn kiếm tiền mang màu sắc ' + S[c2.cung].tuKhoa + '; chuyện tiền chung, đầu tư thì ' + S[c8.cung].tuKhoa + '.' + (h2.some(function (p) { return p.key === 'jupiter' || p.key === 'venus'; }) ? ' Bạn có duyên với tiền bạc.' : h2.some(function (p) { return p.key === 'saturn'; }) ? ' Tiền đến chậm, cần tích lũy đều đặn.' : '') },
    { k: 'sucKhoe', ten: 'Sức khỏe', icon: '🌿', dua: 'nhà 6 · nhà 12 · hành tinh trong nhà 6, 12', diem: sucNha(6) * 0.6 + sucNha(12) * 0.4 + sucHT('sun') * 0.2 + 0.2,
      ky: ['Nhà 6 khởi ở ' + c6.cungTen + ' → vùng ' + S[c6.cung].bp + '; có ' + tenDs(h6) + '.', 'Nhà 12 khởi ở ' + c12.cungTen + ' → vùng ' + S[c12.cung].bp + '; có ' + tenDs(h12) + '.'],
      tron: 'Vùng cơ thể nên chăm sóc: ' + S[c6.cung].bp + '; khi căng thẳng kéo dài, để ý thêm ' + S[c12.cung].bp + '.' + (h6.concat(h12).some(function (p) { return p.key === 'saturn' || p.key === 'mars'; }) ? ' Nên khám định kỳ và không làm việc quá sức.' : '') }
  ];
  var KHUYEN = {
    tinhCach: ['Hãy để bề ngoài và con người thật bên trong cùng xuất hiện – người khác sẽ tin bạn hơn.', 'Cho người mới quen thời gian để biết con người thật của bạn.', 'Tự tin là thứ rèn được: bắt đầu từ việc nhỏ và giữ lời với chính mình.'],
    camXuc: ['Giữ những thói quen khiến bạn thấy an toàn – đó là "pin sạc" của bạn.', 'Gọi tên cảm xúc của mình thay vì để nó tích tụ.', 'Cảm xúc không sai – hãy tìm người để chia sẻ và cho mình khoảng lặng.'],
    tuDuy: ['Viết, dạy hoặc chia sẻ điều bạn biết – trí óc bạn sáng nhất khi được dùng.', 'Ghi chép lại ý tưởng; chọn một hướng học sâu.', 'Học theo cách của mình – chậm không có nghĩa là kém.'],
    tinhYeu: ['Nói rõ cách bạn cần được yêu để người ấy không phải đoán.', 'Dành thời gian hiểu nhu cầu của người kia trước khi đòi hỏi.', 'Đừng vội – chọn người hiểu mình hơn người khiến mình say mê nhất thời.'],
    hanhDong: ['Dùng năng lượng dồi dào vào mục tiêu dài hạn.', 'Chia nhỏ việc lớn và làm đều mỗi ngày.', 'Vận động thể chất đều đặn để giải tỏa năng lượng dồn nén.'],
    suNghiep: ['Chọn nơi cho bạn thể hiện thế mạnh và có đường thăng tiến rõ.', 'Đầu tư vào chuyên môn; thành tựu đến từ sự bền bỉ.', 'Thành công của bạn có thể đến muộn – mỗi bước nhỏ đều đang xây nền.'],
    taiChinh: ['Dùng lúc thuận để tích lũy và đa dạng tài sản.', 'Trích tiết kiệm ngay khi nhận tiền.', 'Tránh đầu tư theo cảm hứng; ưu tiên thu nhập ổn định trước.'],
    sucKhoe: ['Giữ nếp ngủ và vận động – thể trạng tốt cũng cần bảo dưỡng.', 'Khám định kỳ và để ý những vùng nêu trên.', 'Đừng lo lắng quá – phát hiện sớm là chữa được; nghỉ ngơi đúng lúc là thuốc.']
  };
  out.linhVuc = LV.map(function (x) { var d = Math.round(x.diem * 10) / 10, b = ctBac_(d); return { k: x.k, ten: x.ten, icon: x.icon, dua: x.dua, diem: d, bac: b, ky: x.ky, tron: x.tron, khuyen: KHUYEN[x.k][['tot', 'vua', 'kho'].indexOf(b)] }; });
  // ---- B5: chu kỳ thời gian
  out.chuKy = ctChuKyThoiGian_(ct, viewYear, M);
  // ---- Bài học linh hồn (Nút Bắc – Nút Nam)
  var sn = phu[0];
  out.nut = { bac: 'Nút Bắc ' + nn.cungTen + ', nhà ' + nn.nha + ': bài học đời này là phát triển ' + S[nn.cung].tuKhoa + ', qua ' + CT_NHA[nn.nha - 1].y + '.',
    nam: 'Nút Nam ' + sn.cungTen + ', nhà ' + sn.nha + ': sở trường sẵn có nhưng dễ thành vùng an toàn – ' + S[sn.cung].bong + '.',
    tron: 'Bài học lớn của bạn là hướng tới ' + S[nn.cung].tuKhoa + ', bớt dựa vào thói quen cũ (' + S[sn.cung].bong + ').' };
  // ---- B7: điểm mạnh / yếu, lời khuyên
  var xep = HT10.map(function (p) { return { k: p.key, d: sucHT(p.key) }; }).sort(function (a, b) { return b.d - a.d; });
  var manh = xep.filter(function (x) { return x.d >= 0.8; }).slice(0, 3), yeu = xep.slice().reverse().filter(function (x) { return x.d <= -0.6; }).slice(0, 3);
  out.manhYeu = {
    manh: manh.map(function (x) { return CT_HT[x.k].ten + ' ' + by[x.k].cungTen + (by[x.k].pham ? ' (' + by[x.k].pham + ')' : '') + ': ' + CT_HT[x.k].cn + ' được phát huy.'; }),
    yeu: yeu.map(function (x) { return CT_HT[x.k].ten + ' ' + by[x.k].cungTen + (by[x.k].pham ? ' (' + by[x.k].pham + ')' : '') + ': ' + CT_HT[x.k].cn + ' cần rèn luyện nhiều hơn.'; }),
    manhTron: manh.map(function (x) { return CT_HT_CN_TRON[x.k]; }), yeuTron: yeu.map(function (x) { return CT_HT_CN_TRON[x.k]; }),
    nhinNhan: 'Người khác thường thấy bạn ' + S[asc.cung].tuKhoa + (h1.length ? ', ' + tronDs(h1) : '') + '.'
  };
  var CK = out.chuKy, tot = CK.suKien.filter(function (e) { return e.tot; }).slice(0, 4), kho = CK.suKien.filter(function (e) { return !e.tot; }).slice(0, 4);
  out.loiKhuyen = [
    { ten: 'Phát huy điểm mạnh', t: manh.length ? 'Dựa vào ' + manh.map(function (x) { return CT_HT_CN_TRON[x.k]; }).join(', ') + ' – đây là những điều đến với bạn tự nhiên nhất.' : 'Các năng lượng khá cân bằng – thế mạnh đến từ sự đều tay; hãy chọn một lĩnh vực và đi sâu.' },
    { ten: 'Khắc phục điểm yếu', t: yeu.length ? 'Rèn ' + yeu.map(function (x) { return CT_HT_CN_TRON[x.k]; }).join(', ') + ' – từng bước nhỏ, đều đặn; đây cũng là nơi bạn trưởng thành nhiều nhất.' : 'Không có điểm yếu nổi bật – hãy để ý bài học từ Nút Bắc bên dưới.' },
    { ten: 'Thời điểm hành động', t: 'Năm ' + viewYear + ': chủ đề chính ở ' + CT_NHA[CK.solarReturn.nhaMatTroi - 1].y.split(',').slice(0, 2).join(',') + ' (Mặt Trời hồi quy ở nhà ' + CK.solarReturn.nhaMatTroi + ').' +
      (tot.length ? ' Thời điểm thuận: ' + ctDuyNhat_(tot.map(function (e) { return e.thang; })).join(', ') + '.' : '') + (kho.length ? ' Cần thận trọng: ' + ctDuyNhat_(kho.map(function (e) { return e.thang; })).join(', ') + '.' : '') },
    { ten: 'Bài học linh hồn', t: out.nut.tron }
  ];
  // ---- Trường hợp đặc biệt
  var ngh = HT10.filter(function (p) { return p.nghich && CT_NGHICH[p.key]; }), pham = HT10.filter(function (p) { return p.pham; }), trong = out.nha12.filter(function (h) { return h.trong; });
  out.dacBiet = {
    nghich: ngh.map(function (p) { return { ten: p.ten, tanSuat: CT_NGHICH[p.key][0], y: CT_NGHICH[p.key][1] }; }),
    pham: pham.map(function (p) { return { ten: p.ten, cung: p.cungTen, pham: CT_PHAM_TEN[p.pham], tot: p.pham === 'Vượng' || p.pham === 'Miếu' }; }),
    cauHinh: ch, nhaTrong: trong.map(function (h) { return { nha: h.nha, y: h.y, chu: h.chu, chuO: h.chuO }; })
  };
  // ---- Ứng dụng: tên bổ sung năng lượng thiếu
  var ntT = 0; Object.keys(ct.nguyenTo).forEach(function (x) { ntT += ct.nguyenTo[x]; });
  var thieu = Object.keys(ct.nguyenTo).filter(function (x) { return ct.nguyenTo[x] / ntT < 0.14; });
  out.ungDung = { thieu: thieu, tenBu: thieu.map(function (x) { return 'Thiếu ' + x + ' → tên mang nghĩa ' + CT_TEN_BU[x]; }) };
  return out;
}

/** B5 – transit, tiến triển thứ cấp, Solar Arc, Solar Return, Lunar Return */
function ctChuKyThoiGian_(ct, viewYear, M) {
  var T = ct.thoiDiem, by = ct.by, cuspLon = ct.cusp.map(function (c) { return c.lon; }), out = {};
  var hom = new Date(), jdNay = hom.getFullYear() === viewYear ? astJD_(hom.getFullYear(), hom.getMonth() + 1, hom.getDate(), 12, 0, T.tz) : astJD_(viewYear, 7, 1, 12, 0, T.tz);
  var TR = ['jupiter', 'saturn', 'uranus', 'neptune', 'pluto'], DIEM = ['sun', 'moon', 'mercury', 'venus', 'mars', 'asc', 'mc'];
  function lonCua(k) { return by[k].lon; }
  // Transit hiện tại
  var P = astToanBo(jdNay);
  out.ngayXet = ctJdNgay_(jdNay, T.tz).t.split(' ')[0];
  out.transit = ['sun', 'moon', 'mercury', 'venus', 'mars'].concat(TR).map(function (k) {
    var lon = P[k], n = ctNhaCua_(lon, cuspLon), gs = [];
    DIEM.forEach(function (d) { var g = ctGocGiua_(lon, lonCua(d), [[0, 3], [90, 3], [120, 3], [180, 3]]); if (g && TR.indexOf(k) >= 0) gs.push(CT_GOC_TEN[g.deg][1] + ' ' + (by[d].ten || d)); });
    return { key: k, ten: CT_HT[k].ten, cungTen: CT_CUNG[ctCung_(lon)].ten, do: ctFmtDo_(lon), nha: n, goc: gs,
      t: TR.indexOf(k) >= 0 ? CT_HT[k].ten + ' qua nhà ' + n + ' → ' + CT_HT[k].nha + ' ' + CT_NHA[n - 1].y + '.' : '' };
  });
  // Sự kiện transit trong năm (quét 5 ngày một lần, bắt thời điểm góc chính xác)
  var ev = [], j0 = astJD_(viewYear, 1, 1, 0, 0, T.tz), j1 = astJD_(viewYear + 1, 1, 1, 0, 0, T.tz), prev = {};
  for (var jd = j0; jd <= j1; jd += 5) {
    var Q = {}, dd0 = jd - 2451543.5; TR.forEach(function (k) { Q[k] = astPlanetLon_(k, dd0); });
    TR.forEach(function (k) {
      DIEM.forEach(function (d) {
        [0, 90, 120, 180].forEach(function (g) {
          var diff = astNorm_(Q[k] - lonCua(d)), key = k + d + g;
          var s1 = ((diff - g + 540) % 360) - 180, s2 = ((diff + g + 540) % 360) - 180, s = Math.abs(s1) < Math.abs(s2) ? s1 : s2;
          if (prev[key] != null && Math.abs(s) < 3 && Math.abs(prev[key]) < 3 && (s === 0 || (s > 0) !== (prev[key] > 0))) {
            var dt = ctJdNgay_(jd, T.tz), tot = g === 120 || (g === 0 && (k === 'jupiter')), Y = CT_TRANSIT_Y[k][tot ? 0 : 1];
            if (!ev.some(function (e) { return e.key === key && Math.abs(e.jd - jd) < 60; }))
              ev.push({ key: key, jd: jd, thang: 'tháng ' + dt.m, tot: tot, t: CT_HT[k].ten + ' ' + CT_GOC_TEN[g][0].toLowerCase() + ' ' + (by[d].ten || d) + ' gốc (' + dt.d + '/' + dt.m + '): ' + Y + ' – về ' + CT_DIEM_CHU_DE[d] + '.' });
          }
          prev[key] = s;
        });
      });
    });
  }
  ev.sort(function (a, b) { return a.jd - b.jd; });
  out.suKien = ev.map(function (e) { return { thang: e.thang, tot: e.tot, t: e.t }; });
  // Tiến triển thứ cấp (1 ngày sau sinh = 1 năm đời)
  var tuoi = (jdNay - T.jd) / 365.2422, jdP = T.jd + tuoi, PP = astToanBo(jdP);
  out.tienTrien = { tuoi: Math.round(tuoi * 10) / 10, ds: ['sun', 'moon', 'mercury', 'venus', 'mars'].map(function (k) {
    var lon = PP[k], s = ctCung_(lon); return { ten: CT_HT[k].ten, cungTen: CT_CUNG[s].ten, do: ctFmtDo_(lon), nha: ctNhaCua_(lon, cuspLon), doiCung: s !== by[k].cung };
  }) };
  // Mặt Trời tiến triển đổi cung: các mốc trong đời
  var ms = [], sPrev = by.sun.cung;
  for (var a = 0; a <= 90; a += 0.25) { var sc = ctCung_(astToanBoSun_(T.jd + a)); if (sc !== sPrev) { ms.push({ tuoi: Math.round(a), nam: T.y + Math.round(a), cung: CT_CUNG[sc].ten }); sPrev = sc; } }
  out.tienTrien.matTroi = ms.map(function (x) { return 'Khoảng ' + x.tuoi + ' tuổi (' + x.nam + '): Mặt Trời tiến triển sang ' + x.cung + ' – bản ngã chuyển dần sang nét ' + CT_CUNG[CT_CUNG.map(function (c) { return c.ten; }).indexOf(x.cung)].tuKhoa + '.'; });
  var mm = [], mPrev = ctCung_(astMoonLonJD_(jdP));
  for (var b = tuoi; b <= tuoi + 10; b += 0.05) { var mc2 = ctCung_(astMoonLonJD_(T.jd + b)); if (mc2 !== mPrev) { mm.push({ nam: T.y + Math.floor(b + (T.m - 1) / 12), cung: CT_CUNG[mc2].ten }); mPrev = mc2; } }
  out.tienTrien.matTrang = mm.map(function (x) { return 'Năm ' + x.nam + ': Mặt Trăng tiến triển sang ' + x.cung + ' – nhu cầu cảm xúc chuyển sang ' + CT_CUNG[CT_CUNG.map(function (c) { return c.ten; }).indexOf(x.cung)].tuKhoa + '.'; });
  // Solar Arc: mọi điểm dịch cùng cung Mặt Trời tiến triển
  var arc = astNorm_(PP.sun - by.sun.lon), sa = [];
  DIEM.forEach(function (x) {
    DIEM.forEach(function (y) {
      if (x === y) return;
      [0, 60, 90, 120, 180].forEach(function (g) {
        var dir = astNorm_(lonCua(x) + arc), diff = astNorm_(dir - lonCua(y));
        var s1 = ((diff - g + 540) % 360) - 180, s2 = ((diff + g + 540) % 360) - 180, s = Math.abs(s1) < Math.abs(s2) ? s1 : s2;
        var namCon = -s / 0.9856, tot = g === 60 || g === 120;
        if (namCon > -1 && namCon <= 10) sa.push({ nam: Math.round(viewYear + namCon), tot: tot, t: (by[x].ten || x) + ' (Solar Arc) ' + CT_GOC_TEN[g][0].toLowerCase() + ' ' + (by[y].ten || y) + ' gốc – khoảng năm ' + Math.round(viewYear + namCon) + ': ' + (tot ? 'thuận lợi' : g === 0 ? 'bước ngoặt' : 'thử thách') + ' về ' + CT_DIEM_CHU_DE[y] + '.' });
      });
    });
  });
  sa.sort(function (p, q) { return p.nam - q.nam; });
  out.solarArc = { cung: Math.round(arc * 10) / 10, ds: sa.slice(0, 10) };
  // Solar Return năm xem
  var jdSR = astTimMatTroi_(by.sun.lon, astJD_(viewYear, T.m, T.d, 12, 0, T.tz)), H = ctPlacidus_(jdSR, T.lat, T.lon), R = astToanBo(jdSR);
  var srNha = function (k) { return ctNhaCua_(R[k], H.cusp); };
  var n1 = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'].filter(function (k) { return srNha(k) === 1; });
  out.solarReturn = { ngay: ctJdNgay_(jdSR, T.tz).t, moc: CT_CUNG[ctCung_(H.asc)].ten, nhaMatTroi: srNha('sun'), matTrang: CT_CUNG[ctCung_(R.moon)].ten + ', nhà ' + srNha('moon'),
    nha1: n1.map(function (k) { return CT_HT[k].ten; }),
    ds: ['Lá số hồi quy lúc ' + ctJdNgay_(jdSR, T.tz).t + ' (tại nơi sinh): Mọc ' + CT_CUNG[ctCung_(H.asc)].ten + ' – năm này bạn thể hiện mình theo lối ' + CT_CUNG[ctCung_(H.asc)].tuKhoa + '.',
      'Mặt Trời ở nhà ' + srNha('sun') + ' → chủ đề năm: ' + CT_NHA[srNha('sun') - 1].y + '.',
      'Mặt Trăng ở ' + CT_CUNG[ctCung_(R.moon)].ten + ', nhà ' + srNha('moon') + ' → nhu cầu cảm xúc năm nay xoay quanh ' + CT_NHA[srNha('moon') - 1].y + '.',
      n1.length ? 'Hành tinh ở nhà 1: ' + n1.map(function (k) { return CT_HT[k].ten + ' (' + CT_HT_TRON[k] + ')'; }).join(', ') + ' → năng lượng cá nhân năm nay.' : 'Không có hành tinh ở nhà 1 – năm hướng ra ngoài hơn là tập trung vào bản thân.'] };
  // Lunar Return: lần gần nhất trước ngày xét và lần kế tiếp
  function timLR(tu) {
    var jj = tu, pv = null;
    for (var t = 0; t < 30; t += 0.25) {
      var d = astNorm_(astMoonLonJD_(jj + t) - by.moon.lon); if (d > 180) d -= 360;
      if (pv != null && pv < 0 && d >= 0) { var lo = jj + t - 0.25, hi = jj + t; for (var z = 0; z < 30; z++) { var mid = (lo + hi) / 2, dm = astNorm_(astMoonLonJD_(mid) - by.moon.lon); if (dm > 180) dm -= 360; if (dm < 0) lo = mid; else hi = mid; } return (lo + hi) / 2; }
      pv = d;
    }
    return null;
  }
  var lr0 = timLR(jdNay - 28), lr1 = lr0 && lr0 < jdNay ? timLR(lr0 + 1) : null;
  out.lunarReturn = [lr0, lr1].filter(Boolean).map(function (jj) {
    var HL = ctPlacidus_(jj, T.lat, T.lon), n = ctNhaCua_(astMoonLonJD_(jj), HL.cusp);
    return { ngay: ctJdNgay_(jj, T.tz).t, moc: CT_CUNG[ctCung_(HL.asc)].ten, nha: n, t: 'Từ ' + ctJdNgay_(jj, T.tz).t + ': Mặt Trăng hồi quy ở nhà ' + n + ' → tháng này chú ý ' + CT_NHA[n - 1].y + '; Mọc ' + CT_CUNG[ctCung_(HL.asc)].ten + '.' };
  });
  return out;
}


/* ============================================================
 *  B6 – SO SÁNH HAI LÁ SỐ: nhà chồng lấn, Composite (trung điểm), Davison (thời gian – nơi chốn trung bình)
 *  A, B = moRong.chiemTinh (hanhTinh, asc, mc, cusp, thoiDiem); tA, tB = tên gọi
 * ============================================================ */
var CT_SS_NHA = { 1: 'bản thân – người kia tác động mạnh tới hình ảnh, sức sống của', 4: 'gia đình – người kia mang cảm giác "về nhà" cho', 5: 'tình yêu, niềm vui – lãng mạn, vui vẻ với', 7: 'hôn nhân – người kia là "người phối ngẫu" tự nhiên của',
  8: 'gắn kết sâu, tiền chung – hấp dẫn và chuyển hóa mạnh với', 10: 'sự nghiệp – người kia nâng đỡ hoặc đặt yêu cầu cho sự nghiệp của', 11: 'tình bạn – người kia là bạn đồng hành của', 12: 'tiềm thức – mối nối khó gọi tên, có thể hy sinh cho' };
function ctTrungDiem_(a, b) { var d = astNorm_(b - a); return astNorm_(d > 180 ? a + (d - 360) / 2 : a + d / 2); }
function ctSoSanh_(A, B, tA, tB) {
  var KEY = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'], out = {};
  function by(X) { var m = {}; X.hanhTinh.forEach(function (p) { m[p.key] = p; }); m.asc = X.asc; m.mc = X.mc; return m; }
  var a = by(A), b = by(B), ca = A.cusp.map(function (c) { return c.lon; }), cb = B.cusp.map(function (c) { return c.lon; });
  function chong(X, Y, cY, tX, tY) {
    var r = [];
    ['sun', 'moon', 'venus', 'mars', 'jupiter', 'saturn'].forEach(function (k) {
      var n = ctNhaCua_(X[k].lon, cY);
      if (CT_SS_NHA[n]) r.push({ k: k, nha: n, t: CT_HT[k].ten + ' của ' + tX + ' rơi vào nhà ' + n + ' của ' + tY + ' (' + CT_SS_NHA[n] + ' ' + tY + ').' });
    });
    return r;
  }
  out.nhaAB = chong(a, b, cb, tA, tB); out.nhaBA = chong(b, a, ca, tB, tA);
  // Composite: trung điểm từng hành tinh; nhà theo hệ nhà đều từ Mọc composite
  var comp = {}; KEY.concat(['asc', 'mc']).forEach(function (k) { comp[k] = ctTrungDiem_(a[k].lon, b[k].lon); });
  var cAsc = comp.asc, nhaC = function (lon) { return Math.floor(astNorm_(lon - cAsc) / 30) + 1; }, gc = [];
  for (var i = 0; i < KEY.length; i++) for (var j = i + 1; j < KEY.length; j++) {
    var g = ctGocGiua_(comp[KEY[i]], comp[KEY[j]], [[0, 6], [60, 4], [90, 5], [120, 5], [180, 6]]);
    if (g && (/sun|moon|venus|mars/.test(KEY[i]) || /sun|moon|venus|mars/.test(KEY[j]))) gc.push(CT_HT[KEY[i]].ten + ' ' + CT_GOC_TEN[g.deg][0].toLowerCase() + ' ' + CT_HT[KEY[j]].ten + (g.deg === 60 || g.deg === 120 ? ' (hài hòa)' : g.deg === 0 ? ' (gắn kết)' : ' (cần điều chỉnh)'));
  }
  out.composite = { ds: ['sun', 'moon', 'venus', 'mars'].map(function (k) { return CT_HT[k].ten + ' chung ở ' + CT_CUNG[ctCung_(comp[k])].ten + ', nhà ' + nhaC(comp[k]); }),
    moc: CT_CUNG[ctCung_(cAsc)].ten, goc: gc.slice(0, 6),
    t: 'Lá số Composite (trung điểm hai lá số): Mặt Trời chung ở ' + CT_CUNG[ctCung_(comp.sun)].ten + ', nhà ' + nhaC(comp.sun) + ' → mục đích chung của cặp đôi xoay quanh ' + CT_NHA_NGAN[nhaC(comp.sun) - 1] + '; Mặt Trăng chung ở ' + CT_CUNG[ctCung_(comp.moon)].ten + ' → không khí cảm xúc ' + CT_CUNG[ctCung_(comp.moon)].tuKhoa + '.' };
  // Davison: thời điểm và nơi chốn trung bình
  var TA = A.thoiDiem, TB = B.thoiDiem, jd = (TA.jd + TB.jd) / 2, lat = (TA.lat + TB.lat) / 2, lon = (TA.lon + TB.lon) / 2;
  var P = astToanBo(jd), H = ctPlacidus_(jd, lat, lon), nd = function (k) { return ctNhaCua_(P[k], H.cusp); };
  out.davison = { ngay: ctJdNgay_(jd, 7).t, moc: CT_CUNG[ctCung_(H.asc)].ten,
    t: 'Lá số Davison (' + ctJdNgay_(jd, 7).t + ', giữa hai nơi sinh): Mọc ' + CT_CUNG[ctCung_(H.asc)].ten + ' – mối quan hệ hiện ra với người ngoài theo lối ' + CT_CUNG[ctCung_(H.asc)].tuKhoa + '; Mặt Trời ở nhà ' + nd('sun') + ' (' + CT_NHA_NGAN[nd('sun') - 1] + '), Sao Kim ở nhà ' + nd('venus') + ' (' + CT_NHA_NGAN[nd('venus') - 1] + ').' };
  out.tomTat = out.nhaAB.concat(out.nhaBA).filter(function (x) { return x.nha === 7 || x.nha === 5 || x.nha === 1; }).slice(0, 4).map(function (x) { return x.t; });
  return out;
}
