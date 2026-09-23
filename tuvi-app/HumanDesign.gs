/**
 * ============================================================
 *  HumanDesign.gs — HUMAN DESIGN (THIẾT KẾ CON NGƯỜI)
 *  - 13 thiên thể × 2 phía: Tính cách (lúc sinh, màu đen) và Thiết kế
 *    (khi Mặt Trời lùi 88° cung, màu đỏ)
 *  - Bánh xe 64 cổng: cổng 41 bắt đầu tại 2° Bảo Bình (302°), mỗi cổng 5,625°, mỗi hào 0,9375°
 *  - 36 kênh, 9 trung tâm → Loại (Type), Chiến lược, Thẩm quyền, Hồ sơ (Profile),
 *    Định nghĩa (Definition), Giao điểm hóa thân (Incarnation Cross)
 *  - Đối chiếu với hd-chart-engine & natalengine (MIT)
 * ============================================================
 */

var HD_WHEEL = [41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3, 27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53,
  62, 56, 31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50, 28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60];

var HD_CENTERS = {
  head: { ten: 'Đỉnh đầu (Head)', gates: [64, 61, 63] },
  ajna: { ten: 'Luận giải (Ajna)', gates: [47, 24, 4, 17, 43, 11] },
  throat: { ten: 'Cổ họng (Throat)', gates: [62, 23, 56, 35, 12, 45, 33, 8, 31, 20, 16] },
  g: { ten: 'Bản thể (G)', gates: [7, 1, 13, 10, 25, 15, 46, 2] },
  heart: { ten: 'Ý chí (Heart/Ego)', gates: [21, 40, 26, 51] },
  spleen: { ten: 'Lá lách (Spleen)', gates: [48, 57, 44, 50, 32, 28, 18] },
  sacral: { ten: 'Xương cùng (Sacral)', gates: [5, 14, 29, 59, 9, 3, 42, 27, 34] },
  solar: { ten: 'Đám rối mặt trời (Solar Plexus)', gates: [6, 37, 22, 36, 49, 55, 30] },
  root: { ten: 'Gốc (Root)', gates: [53, 60, 52, 19, 39, 41, 58, 38, 54] }
};
var HD_MOTORS = ['sacral', 'solar', 'heart', 'root'];

var HD_CHANNELS = [
  [1, 8, 'Cảm hứng', 'sáng tạo độc đáo, làm gương cho người khác'], [2, 14, 'Người giữ nhịp (Giả kim)', 'định hướng và nguồn lực để đi theo hướng đó'],
  [3, 60, 'Đột biến', 'đổi mới theo nhịp bất ngờ, chịu áp lực trước khi bứt phá'], [4, 63, 'Logic', 'tư duy mẫu hình, nghi vấn và tìm công thức'],
  [5, 15, 'Nhịp điệu', 'hòa vào dòng chảy tự nhiên, nhịp sống riêng'], [6, 59, 'Thân mật', 'khả năng gắn kết, sinh sản, phá rào cản cảm xúc'],
  [7, 31, 'Người dẫn đầu (Alpha)', 'lãnh đạo bằng tầm nhìn, được bầu chọn'], [9, 52, 'Tập trung', 'khả năng tập trung bền bỉ vào chi tiết'],
  [10, 20, 'Thức tỉnh', 'sống đúng mình ngay trong hiện tại'], [10, 34, 'Khám phá', 'đi theo niềm tin của riêng mình'],
  [10, 57, 'Hình thái hoàn hảo', 'trực giác sinh tồn, yêu cái đẹp'], [11, 56, 'Tò mò', 'người tìm kiếm, kể chuyện, truyền cảm hứng bằng ý tưởng'],
  [12, 22, 'Cởi mở', 'biểu đạt cảm xúc cuốn hút, nghệ sĩ xã hội'], [13, 33, 'Kẻ lãng tử (Nhân chứng)', 'lắng nghe, ghi nhớ và kể lại bài học'],
  [16, 48, 'Bước sóng (Tài năng)', 'chiều sâu kỹ năng qua luyện tập'], [17, 62, 'Chấp nhận (Tổ chức)', 'sắp xếp chi tiết thành hệ thống quan điểm'],
  [18, 58, 'Phán xét', 'nhìn ra chỗ cần sửa, thúc đẩy hoàn thiện'], [19, 49, 'Tổng hợp', 'nhạy cảm với nhu cầu, nguyên tắc gắn kết cộng đồng'],
  [20, 34, 'Sức hút (Charisma)', 'bận rộn, làm ngay, năng lượng biểu hiện mạnh'], [20, 57, 'Sóng não', 'trực giác nhạy bén tức thời'],
  [21, 45, 'Tiền bạc', 'quản lý tài nguyên, tư chất ông chủ'], [23, 43, 'Cấu trúc (Thiên tài)', 'thấu hiểu đột phá, giải thích ý tưởng mới'],
  [24, 61, 'Nhận thức (Người suy tư)', 'chiêm nghiệm những câu hỏi lớn'], [25, 51, 'Khởi xướng', 'tinh thần cạnh tranh, dám nhảy vào điều mới'],
  [26, 44, 'Đầu hàng (Truyền đạt)', 'tiếp thị, thuyết phục, truyền lại bài học quá khứ'], [27, 50, 'Bảo tồn', 'chăm lo, giữ gìn giá trị, trách nhiệm'],
  [28, 38, 'Đấu tranh', 'kiên cường, đi tìm ý nghĩa cuộc sống'], [29, 46, 'Khám phá thành công', 'dấn thân trọn vẹn, thành công nhờ trải nghiệm'],
  [30, 41, 'Nhận biết (Mơ mộng)', 'khát khao trải nghiệm, trí tưởng tượng'], [32, 54, 'Chuyển hóa', 'tham vọng đi lên, bền bỉ vươn tới thành công'],
  [34, 57, 'Quyền năng', 'phản ứng trực giác mạnh mẽ, sống sót'], [35, 36, 'Nhất thời (Thạo đời)', 'khao khát trải nghiệm mới, học từ biến cố'],
  [37, 40, 'Cộng đồng', 'thỏa thuận, gắn kết gia đình – cộng đồng'], [39, 55, 'Cảm xúc (Tâm trạng)', 'nhạy cảm, sáng tạo từ cảm xúc thăng trầm'],
  [42, 53, 'Trưởng thành', 'hoàn tất chu kỳ, trưởng thành qua trải nghiệm'], [47, 64, 'Trừu tượng', 'suy ngẫm quá khứ, tìm ý nghĩa từ hình ảnh tư duy']
];

var HD_GATE_TEN = {
  1: 'Sáng tạo – tự biểu đạt', 2: 'Tiếp nhận – định hướng bản thể', 3: 'Khởi đầu gian nan – sắp đặt trật tự', 4: 'Mông muội – tìm công thức',
  5: 'Chờ đợi – nhịp điệu cố định', 6: 'Tranh tụng – ma sát, thân mật', 7: 'Quân đội – vai trò dẫn dắt', 8: 'Thân cận – đóng góp',
  9: 'Tiểu súc – tập trung chi tiết', 10: 'Lý – hành xử của bản thể', 11: 'Thái – ý tưởng', 12: 'Bĩ – thận trọng, biểu đạt',
  13: 'Đồng nhân – người lắng nghe', 14: 'Đại hữu – nắm giữ nguồn lực', 15: 'Khiêm – nhịp của nhân loại', 16: 'Dự – kỹ năng, nhiệt huyết',
  17: 'Tùy – quan điểm', 18: 'Cổ – sửa chữa', 19: 'Lâm – nhu cầu, gần gũi', 20: 'Quán – hiện tại',
  21: 'Phệ hạp – kiểm soát', 22: 'Bí – duyên dáng', 23: 'Bác – đồng hóa, giải thích', 24: 'Phục – quay về, hợp lý hóa',
  25: 'Vô vọng – tình yêu thuần khiết', 26: 'Đại súc – người tiếp thị', 27: 'Di – chăm sóc', 28: 'Đại quá – ý nghĩa sống',
  29: 'Khảm – nói "có", kiên trì', 30: 'Ly – ngọn lửa khát khao', 31: 'Hàm – ảnh hưởng', 32: 'Hằng – bền vững',
  33: 'Độn – rút lui, riêng tư', 34: 'Đại tráng – sức mạnh', 35: 'Tấn – tiến bộ, thay đổi', 36: 'Minh di – khủng hoảng, trải nghiệm',
  37: 'Gia nhân – tình thân', 38: 'Khuê – đối lập, đấu tranh', 39: 'Kiển – khiêu khích', 40: 'Giải – một mình, giải thoát',
  41: 'Tổn – tưởng tượng', 42: 'Ích – tăng trưởng, hoàn tất', 43: 'Quải – đột phá, thấu hiểu', 44: 'Cấu – cảnh giác, gặp gỡ',
  45: 'Tụy – người thu thập', 46: 'Thăng – yêu thân thể', 47: 'Khốn – nhận thức', 48: 'Tỉnh – chiều sâu',
  49: 'Cách – cách mạng, nguyên tắc', 50: 'Đỉnh – giá trị', 51: 'Chấn – chấn động, khởi xướng', 52: 'Cấn – tĩnh lặng',
  53: 'Tiệm – khởi đầu', 54: 'Quy muội – tham vọng', 55: 'Phong – dồi dào tinh thần', 56: 'Lữ – kể chuyện, kích thích',
  57: 'Tốn – trực giác', 58: 'Đoài – niềm vui, sức sống', 59: 'Hoán – phá rào cản', 60: 'Tiết – chấp nhận giới hạn',
  61: 'Trung phu – sự thật bên trong', 62: 'Tiểu quá – chi tiết', 63: 'Ký tế – hoài nghi', 64: 'Vị tế – mơ hồ, trăn trở'
};

var HD_TYPES = {
  'Generator': { ten: 'Người Kiến Tạo (Generator)', tl: '~37%', chienLuoc: 'Chờ để phản hồi – để cuộc sống đến với mình rồi lắng nghe phản ứng của xương cùng', dauHieu: 'Thỏa mãn', saiLech: 'Bực bội',
    moTa: 'Nguồn sinh lực bền bỉ của thế giới. Khi làm điều mình thực sự yêu thích (được "bật đèn" từ xương cùng), bạn có năng lượng gần như vô tận và thành thạo dần theo thời gian. Khó khăn đến khi chủ động ép mình vào việc không hứng thú.' },
  'Manifesting Generator': { ten: 'Người Kiến Tạo Biểu Hiện (Manifesting Generator)', tl: '~33%', chienLuoc: 'Chờ để phản hồi, rồi thông báo trước khi hành động', dauHieu: 'Thỏa mãn và bình an', saiLech: 'Bực bội và giận dữ',
    moTa: 'Nhanh, đa nhiệm, hay "nhảy bước". Kết hợp sinh lực của Generator và tốc độ của Manifestor; hiệu quả nhất khi phản hồi đúng cơ hội rồi báo cho người liên quan để giảm va chạm.' },
  'Manifestor': { ten: 'Người Khởi Xướng (Manifestor)', tl: '~9%', chienLuoc: 'Thông báo trước khi hành động', dauHieu: 'Bình an', saiLech: 'Giận dữ',
    moTa: 'Người mở đường, có khả năng khởi động mọi thứ một cách độc lập. Hào quang khép kín, tạo tác động mạnh; thông báo trước giúp người xung quanh không cảm thấy bị bất ngờ hay chống đối.' },
  'Projector': { ten: 'Người Dẫn Dắt (Projector)', tl: '~20%', chienLuoc: 'Chờ được công nhận và mời', dauHieu: 'Thành công', saiLech: 'Cay đắng',
    moTa: 'Người nhìn thấu hệ thống và con người, sinh ra để hướng dẫn năng lượng của người khác. Không có sinh lực bền bỉ nên cần nghỉ ngơi đủ; thành công khi được mời đúng người, đúng việc.' },
  'Reflector': { ten: 'Người Phản Chiếu (Reflector)', tl: '~1%', chienLuoc: 'Chờ một chu kỳ Mặt Trăng (~28 ngày) trước quyết định lớn', dauHieu: 'Ngạc nhiên', saiLech: 'Thất vọng',
    moTa: 'Tấm gương của cộng đồng: mọi trung tâm để mở, cảm nhận và phản chiếu sức khỏe của môi trường. Chọn đúng nơi chốn và con người là điều quan trọng nhất.' }
};

var HD_AUTH = {
  emotional: { ten: 'Thẩm quyền Cảm xúc (Solar Plexus)', moTa: 'Không có sự thật ngay lúc này. Hãy để cảm xúc đi hết một "sóng" (vui – buồn – bình), quyết định khi đã rõ ràng, thường sau vài ngày ngủ một đêm.' },
  sacral: { ten: 'Thẩm quyền Xương cùng (Sacral)', moTa: 'Tin vào phản ứng bụng tức thì – âm thanh "ừ-hứ" (có) hay "ừm-ừm" (không) khi được hỏi câu có/không.' },
  splenic: { ten: 'Thẩm quyền Lá lách (Splenic)', moTa: 'Trực giác thoáng qua, nói nhỏ một lần ngay khoảnh khắc; tin vào "cảm giác an toàn/không an toàn" ban đầu.' },
  egoM: { ten: 'Thẩm quyền Ý chí biểu hiện (Ego Manifested)', moTa: 'Nghe điều bạn nói ra từ ý chí: "tôi muốn", "tôi sẽ" – quyết định đúng là điều trái tim thực sự muốn và giữ được lời hứa.' },
  egoP: { ten: 'Thẩm quyền Ý chí phóng chiếu (Ego Projected)', moTa: 'Khi được mời, hãy hỏi "điều này có lợi cho tôi không, tôi có thực sự muốn không?" – ý chí và giá trị bản thân dẫn lối.' },
  self: { ten: 'Thẩm quyền Tự phóng chiếu (Self-Projected)', moTa: 'Nói ra thành tiếng với người tin cậy và lắng nghe chính giọng mình; sự thật về hướng đi nằm trong lời bạn nói.' },
  mental: { ten: 'Thẩm quyền Môi trường/Tâm trí (Mental)', moTa: 'Không có thẩm quyền bên trong: bàn bạc với nhiều người tin cậy, cảm nhận nơi chốn; tâm trí là để quan sát, không để quyết định cho bản thân.' },
  lunar: { ten: 'Thẩm quyền Mặt Trăng (Lunar)', moTa: 'Đợi Mặt Trăng đi hết 28 ngày qua 64 cổng, bàn bạc với người tin cậy rồi mới quyết định việc lớn.' }
};

var HD_LINE = {
  1: ['Người điều tra', 'cần nền tảng vững, nghiên cứu kỹ trước khi hành động'],
  2: ['Ẩn sĩ', 'tài năng bẩm sinh, cần không gian riêng, được người khác "gọi ra"'],
  3: ['Người thử nghiệm', 'học qua thử – sai, va vấp để khám phá điều hiệu quả'],
  4: ['Người kết nối', 'sức ảnh hưởng qua mạng lưới quan hệ thân thiết'],
  5: ['Người giải cứu', 'được kỳ vọng mang giải pháp thực tế, sức hút xa lạ'],
  6: ['Hình mẫu', 'ba giai đoạn đời (thử nghiệm → quan sát → hình mẫu), sống làm gương']
};

var HD_CENTER_Y = {
  head: ['Nguồn cảm hứng và câu hỏi ổn định, có cách suy nghĩ riêng.', 'Cởi mở với cảm hứng; dễ bị cuốn vào câu hỏi của người khác – hãy chọn điều đáng nghĩ.'],
  ajna: ['Cách tư duy nhất quán, có quan điểm chắc chắn.', 'Tư duy linh hoạt, nhìn nhiều góc; không cần giả vờ chắc chắn.'],
  throat: ['Giọng nói và cách biểu đạt ổn định, lời nói có sức hành động.', 'Biểu đạt đa dạng; tránh cố nói để được chú ý – lời đúng lúc có sức nặng.'],
  g: ['Bản sắc và định hướng rõ ràng, biết mình là ai.', 'Bản sắc linh hoạt, nhạy với nơi chốn – môi trường đúng sẽ đưa người đúng đến.'],
  heart: ['Ý chí mạnh, giữ lời hứa, có giá trị bản thân vững.', 'Không cần chứng minh giá trị bản thân; tránh hứa quá sức.'],
  spleen: ['Trực giác và hệ miễn dịch ổn định, cảm giác an toàn tự thân.', 'Nhạy cảm sức khỏe và cảm xúc sợ hãi; dễ giữ những gì không tốt quá lâu.'],
  sacral: ['Sinh lực bền bỉ, làm việc được lâu khi đúng đam mê.', 'Không có sinh lực bền bỉ; biết khi nào là "đủ", cần nghỉ trước khi kiệt sức.'],
  solar: ['Sóng cảm xúc riêng – cần thời gian để rõ ràng, có sức hút cảm xúc.', 'Hấp thụ và khuếch đại cảm xúc người khác; hay né tránh đối đầu.'],
  root: ['Xử lý áp lực đều đặn, có nhịp làm việc riêng.', 'Dễ bị thúc ép, vội vàng để thoát áp lực; học cách không vội.']
};

var HD_BODIES = ['sun', 'earth', 'northNode', 'southNode', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
var HD_BODY_TEN = { sun: 'Mặt Trời', earth: 'Trái Đất', northNode: 'Nút Bắc', southNode: 'Nút Nam', moon: 'Mặt Trăng', mercury: 'Sao Thủy',
  venus: 'Sao Kim', mars: 'Sao Hỏa', jupiter: 'Sao Mộc', saturn: 'Sao Thổ', uranus: 'Sao Thiên Vương', neptune: 'Sao Hải Vương', pluto: 'Sao Diêm Vương' };

function hdCong_(lon) {
  var off = astNorm_(lon - 302);
  var idx = Math.floor(off / 5.625);
  var trong = off - idx * 5.625;
  return { gate: HD_WHEEL[idx], line: Math.min(6, Math.floor(trong / 0.9375) + 1) };
}

/**
 * Lập biểu đồ Human Design.
 * @param {number} jdUT thời điểm sinh (JD UT)
 */
function hdLap(jdUT) {
  var pPos = astToanBo(jdUT);
  var jdD = astTimMatTroi_(astNorm_(pPos.sun - 88), jdUT - 88.5);
  var dPos = astToanBo(jdD);
  var act = { p: {}, d: {} }, gates = {};
  HD_BODIES.forEach(function (b) {
    act.p[b] = hdCong_(pPos[b]); act.d[b] = hdCong_(dPos[b]);
    gates[act.p[b].gate] = (gates[act.p[b].gate] || '') + 'p';
    gates[act.d[b].gate] = (gates[act.d[b].gate] || '') + 'd';
  });
  var gateCenter = {};
  Object.keys(HD_CENTERS).forEach(function (c) { HD_CENTERS[c].gates.forEach(function (g) { gateCenter[g] = c; }); });
  var kenh = HD_CHANNELS.filter(function (ch) { return gates[ch[0]] && gates[ch[1]]; }).map(function (ch) {
    return { a: ch[0], b: ch[1], ten: ch[2], moTa: ch[3], c1: gateCenter[ch[0]], c2: gateCenter[ch[1]] };
  });
  var dinh = {};
  kenh.forEach(function (k) { dinh[k.c1] = true; dinh[k.c2] = true; });
  // đồ thị kết nối
  var adj = {};
  kenh.forEach(function (k) { (adj[k.c1] = adj[k.c1] || []).push(k.c2); (adj[k.c2] = adj[k.c2] || []).push(k.c1); });
  function lienThong(from) {
    var seen = {}, st = [from]; seen[from] = true;
    while (st.length) { var c = st.pop(); (adj[c] || []).forEach(function (n) { if (!seen[n]) { seen[n] = true; st.push(n); } }); }
    return seen;
  }
  var tuThroat = dinh.throat ? lienThong('throat') : {};
  var motorThroat = HD_MOTORS.some(function (m) { return tuThroat[m]; });
  var loai;
  if (!Object.keys(dinh).length) loai = 'Reflector';
  else if (dinh.sacral) loai = motorThroat ? 'Manifesting Generator' : 'Generator';
  else loai = motorThroat ? 'Manifestor' : 'Projector';

  var coKenh = function (a, b) { return kenh.some(function (k) { return (k.a === a && k.b === b) || (k.a === b && k.b === a); }); };
  var tq;
  if (dinh.solar) tq = 'emotional';
  else if (dinh.sacral) tq = 'sacral';
  else if (dinh.spleen) tq = 'splenic';
  else if (dinh.heart) tq = coKenh(21, 45) ? 'egoM' : 'egoP';
  else if (dinh.g && tuThroat.g) tq = 'self';
  else if (loai === 'Reflector') tq = 'lunar';
  else tq = 'mental';

  // định nghĩa: số thành phần liên thông
  var conLai = Object.keys(dinh), soNhom = 0, daXet = {};
  conLai.forEach(function (c) { if (!daXet[c]) { soNhom++; var s = lienThong(c); Object.keys(s).forEach(function (x) { daXet[x] = true; }); } });
  var dinhNghia = ['Không định nghĩa', 'Định nghĩa đơn (Single)', 'Định nghĩa tách đôi (Split)', 'Tách ba (Triple Split)', 'Tách bốn (Quadruple Split)'][Math.min(4, soNhom)];

  var l1 = act.p.sun.line, l2 = act.d.sun.line;
  var goc = (l1 === 4 && l2 === 1) ? 'Góc Kề (Juxtaposition) – số mệnh cố định, con đường riêng rõ nét' :
    (l1 >= 5) ? 'Góc Trái (Left Angle) – nghiệp chuyển giao, định mệnh gắn với người khác' : 'Góc Phải (Right Angle) – định mệnh cá nhân, tự trải nghiệm đời mình';
  var cross = 'Cổng ' + act.p.sun.gate + '/' + act.p.earth.gate + ' | ' + act.d.sun.gate + '/' + act.d.earth.gate;

  return { act: act, gates: gates, kenh: kenh, dinh: dinh, loai: loai, thamQuyen: tq, profile: l1 + '/' + l2, l1: l1, l2: l2,
    dinhNghia: dinhNghia, soNhom: soNhom, goc: goc, cross: cross, jdDesign: jdD };
}

/** Luận giải Human Design */
function hdLuan(hd) {
  var T = HD_TYPES[hd.loai], A = HD_AUTH[hd.thamQuyen];
  var secs = [];
  secs.push({ tieuDe: 'Loại năng lượng – ' + T.ten, items: [
    T.moTa, 'Tỷ lệ dân số: ' + T.tl + '.', 'Chiến lược: ' + T.chienLuoc + '.',
    'Dấu hiệu đang sống đúng: ' + T.dauHieu + '. Dấu hiệu lệch hướng (not-self): ' + T.saiLech + '.'] });
  secs.push({ tieuDe: A.ten, items: [A.moTa] });
  var L1 = HD_LINE[hd.l1], L2 = HD_LINE[hd.l2];
  var prof = ['Hồ sơ ' + hd.profile + ' – ' + L1[0] + ' / ' + L2[0] + '.',
    'Hào ' + hd.l1 + ' (ý thức – Tính cách): ' + L1[1] + '.', 'Hào ' + hd.l2 + ' (vô thức – Thiết kế): ' + L2[1] + '.'];
  if (hd.l1 === 6 || hd.l2 === 6) prof.push('Có hào 6: khoảng 0–30 tuổi sống như hào 3 (thử nghiệm), 30–50 "lên mái nhà" quan sát, sau 50 trở thành hình mẫu.');
  secs.push({ tieuDe: 'Hồ sơ (Profile)', items: prof });
  secs.push({ tieuDe: 'Định nghĩa & Giao điểm hóa thân', items: [
    hd.dinhNghia + (hd.soNhom === 2 ? ' – thường tìm người "bắc cầu" để cảm thấy trọn vẹn.' : hd.soNhom >= 3 ? ' – cần nhiều người/môi trường khác nhau, quyết định chậm mà chắc.' : hd.soNhom === 1 ? ' – tự đủ, xử lý thông tin liền mạch.' : ''),
    'Giao điểm hóa thân: ' + hd.cross + ' – ' + hd.goc + '.',
    'Mặt Trời Tính cách cổng ' + hd.act.p.sun.gate + ' (' + HD_GATE_TEN[hd.act.p.sun.gate] + ') là chủ đề sống ý thức; Mặt Trời Thiết kế cổng ' + hd.act.d.sun.gate + ' (' + HD_GATE_TEN[hd.act.d.sun.gate] + ') là chủ đề của cơ thể/vô thức.'] });
  var ce = Object.keys(HD_CENTERS).map(function (c) {
    return (hd.dinh[c] ? '■ ' + HD_CENTERS[c].ten + ' – xác định: ' + HD_CENTER_Y[c][0] : '□ ' + HD_CENTERS[c].ten + ' – mở: ' + HD_CENTER_Y[c][1]);
  });
  secs.push({ tieuDe: '9 trung tâm', items: ce });
  secs.push({ tieuDe: 'Kênh xác định (' + hd.kenh.length + ')', items: hd.kenh.length ? hd.kenh.map(function (k) { return 'Kênh ' + k.a + '–' + k.b + ' ' + k.ten + ': ' + k.moTa + '.'; }) : ['Không có kênh nào – toàn bộ trung tâm mở.'] });
  var gl = [];
  HD_BODIES.forEach(function (b) {
    var P = hd.act.p[b], D = hd.act.d[b];
    gl.push(HD_BODY_TEN[b] + ': Tính cách ' + P.gate + '.' + P.line + ' (' + HD_GATE_TEN[P.gate] + ') · Thiết kế ' + D.gate + '.' + D.line + ' (' + HD_GATE_TEN[D.gate] + ')');
  });
  secs.push({ tieuDe: '26 kích hoạt (Tính cách – ý thức · Thiết kế – vô thức, 88° trước)', items: gl });
  var tr = Object.keys(HD_CENTERS).filter(function (c) { return !hd.dinh[c]; });
  secs.push({ tieuDe: 'Sinh học các trung tâm', items: Object.keys(HD_CENTERS).map(function (c) {
    return (hd.dinh[c] ? '■ ' : '□ ') + HD_CENTERS[c].ten + ' ↔ ' + HD_CENTER_BIO[c] + (hd.dinh[c] ? ' – vận hành ổn định.' : ' – nhạy cảm, dễ bị ảnh hưởng từ môi trường; nên chú ý.');
  }).concat(['Theo HD, ' + tr.length + ' trung tâm mở là nơi bạn "học" từ người khác – vừa là trí tuệ, vừa là nơi dễ bị điều kiện hóa (conditioning).']) });
  secs.push({ tieuDe: 'Ba giai đoạn đời theo HD', items: [
    '0–~29 tuổi (trước Sao Thổ hồi quy): giai đoạn bị điều kiện hóa – học từ gia đình, môi trường.',
    '~29–~40 (Sao Thổ hồi quy → Thiên Vương đối): trưởng thành, thử sống theo chiến lược & thẩm quyền.',
    '~40–~50 (Thiên Vương đối → Chiron hồi quy): khủng hoảng giữa đời, thử xem có đang sống "not-self".',
    'Sau ~50 (Chiron hồi quy): giai đoạn "hình mẫu" – sống thuần với thiết kế, trao lại kinh nghiệm.'] });
  return secs;
}
var HD_CENTER_BIO = {
  head: 'tuyến tùng (giấc ngủ, nhịp sinh học)', ajna: 'tuyến yên, mắt, não bộ', throat: 'tuyến giáp – cận giáp, họng, chuyển hóa',
  g: 'gan, máu', heart: 'tim, dạ dày, túi mật, tuyến ức', spleen: 'lá lách, hệ bạch huyết, miễn dịch',
  sacral: 'buồng trứng/tinh hoàn, sinh lực', solar: 'thận, tụy, tuyến tiền liệt, hệ thần kinh', root: 'tuyến thượng thận (hormone căng thẳng)'
};
