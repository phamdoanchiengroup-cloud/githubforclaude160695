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
  var line = Math.min(6, Math.floor(trong / 0.9375) + 1), inL = trong - (line - 1) * 0.9375;
  var color = Math.min(6, Math.floor(inL / 0.15625) + 1), inC = inL - (color - 1) * 0.15625, tone = Math.min(6, Math.floor(inC / 0.0260417) + 1);
  return { gate: HD_WHEEL[idx], line: line, color: color, tone: tone };
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

/* ============================================================
 *  PHÂN TÍCH ĐẦY ĐỦ THEO QUY TRÌNH 11 BƯỚC (docs/quy-trinh-human-design.md)
 *  B2 bodygraph · B3 5 loại · B4 7 thẩm quyền · B5 định nghĩa (cầu nối) · B6 12 hồ sơ · B7 9 trung tâm
 *  B8 36 kênh theo mạch (cá nhân / hợp tác) · B9 64 cổng (đen – đỏ, treo, trống)
 *  B10 Nút, 4 biến số (Môi trường, Quan điểm, Động lực, Tiêu hóa), Solar Return, chu kỳ 7 năm, transit
 *  B11 luận tổng hợp 10 mục + ứng dụng.
 * ============================================================ */
var HD_MACH = {
  'Cá nhân – Hiểu biết (Knowing)': [[1, 8], [2, 14], [3, 60], [12, 22], [23, 43], [24, 61], [28, 38], [39, 55]],
  'Cá nhân – Định tâm (Centering)': [[10, 34], [25, 51]],
  'Cá nhân – Tích hợp (Integration)': [[10, 20], [10, 57], [20, 34], [20, 57], [34, 57]],
  'Tập thể – Logic (Understanding)': [[4, 63], [5, 15], [7, 31], [9, 52], [16, 48], [17, 62], [18, 58]],
  'Tập thể – Cảm nhận (Sensing)': [[11, 56], [13, 33], [29, 46], [30, 41], [35, 36], [42, 53], [47, 64]],
  'Bộ tộc – Bản ngã (Ego)': [[19, 49], [21, 45], [26, 44], [32, 54], [37, 40]],
  'Bộ tộc – Bảo vệ (Defense)': [[6, 59], [27, 50]]
};
var HD_MACH_Y = { 'Cá nhân': 'kênh cá nhân (Individuality) – tạo đột biến, khác biệt, truyền cảm hứng bằng cách là chính mình', 'Tập thể': 'kênh hợp tác (Collective) – chia sẻ, học hỏi và phục vụ số đông', 'Bộ tộc': 'kênh hợp tác (Tribal) – gắn kết, hỗ trợ lẫn nhau trong gia đình, cộng đồng' };
var HD_TYPE_DS = ['Generator', 'Manifesting Generator', 'Projector', 'Manifestor', 'Reflector'];
var HD_TYPE_VN = { 'Generator': 'Người Sản Xuất', 'Manifesting Generator': 'Người Sản Xuất Biểu Hiện', 'Projector': 'Người Chiếu', 'Manifestor': 'Người Biểu Hiện', 'Reflector': 'Người Phản Chiếu' };
var HD_TYPE_LAM = { 'Generator': 'làm việc bền bỉ, thành thạo dần khi yêu thích công việc; hợp nghề cần chuyên sâu và sức bền',
  'Manifesting Generator': 'đa nhiệm, nhanh, hợp môi trường nhiều dự án song song; cần được đổi hướng khi hết hứng',
  'Projector': 'hướng dẫn, quản lý, tư vấn, nhìn ra cách tối ưu người và hệ thống; làm ít giờ mà hiệu quả',
  'Manifestor': 'khởi xướng, mở đường, làm chủ; hợp vai trò độc lập, không bị giám sát sát sao',
  'Reflector': 'đánh giá, phản chiếu sức khỏe tổ chức; hợp vai trò quan sát, tư vấn cộng đồng' };
var HD_TYPE_QH = { 'Generator': 'cần người hỏi mình câu có/không để phản hồi; dễ bực khi phải chủ động theo đuổi',
  'Manifesting Generator': 'nhớ báo trước cho người thân khi đổi kế hoạch; tìm người chấp nhận nhịp nhanh của mình',
  'Projector': 'cần được nhìn nhận và mời vào mối quan hệ; tránh cho lời khuyên khi chưa được hỏi',
  'Manifestor': 'thông báo trước để người thân không thấy bất ngờ; cần khoảng tự do riêng',
  'Reflector': 'cần thời gian dài để chắc chắn về một người; môi trường sống chung quyết định cảm xúc' };
var HD_AUTH_DS = [['sacral', 'Xương cùng (Sacral)'], ['emotional', 'Cảm xúc (Emotional)'], ['splenic', 'Lách (Splenic)'], ['egoM', 'Bản ngã/Tim (Ego)'], ['egoP', 'Bản ngã/Tim (Ego)'], ['self', 'Tự chiếu (Self-Projected)'], ['mental', 'Tâm trí/Môi trường (Mental)'], ['lunar', 'Mặt Trăng (Lunar)']];
var HD_DN_DS = [['Định nghĩa đơn (Single)', 'mọi trung tâm xác định nối liền – tự đủ, xử lý thông tin liền mạch, ít cần người khác để thấy trọn vẹn'],
  ['Định nghĩa tách đôi (Split)', 'hai nhóm trung tâm tách rời – hay tìm người "bắc cầu", dễ bị thu hút bởi người có cổng nối hai nhóm'],
  ['Tách ba (Triple Split)', 'ba nhóm – cần tiếp xúc nhiều người, nhiều nơi; quyết định chậm mà chắc'],
  ['Tách bốn (Quadruple Split)', 'bốn nhóm – rất hiếm, cần thời gian và nhiều môi trường khác nhau'],
  ['Không định nghĩa (Reflector)', 'mọi trung tâm mở – phản chiếu môi trường, cần chọn nơi chốn thật kỹ']];
var HD_PROFILE_Y = {
  '1/3': 'Người điều tra – thử nghiệm: xây nền vững bằng nghiên cứu và học qua va vấp', '1/4': 'Người điều tra – kết nối: kiến thức vững, lan tỏa qua mạng lưới thân quen',
  '2/4': 'Ẩn sĩ – kết nối: tài năng tự nhiên, được bạn bè "gọi ra" đúng lúc', '2/5': 'Ẩn sĩ – giải cứu: tài năng ẩn, người lạ kỳ vọng bạn giải quyết vấn đề',
  '3/5': 'Thử nghiệm – giải cứu: học qua thử – sai, trở thành người có giải pháp thực tế', '3/6': 'Thử nghiệm – hình mẫu: nửa đời đầu nhiều trải nghiệm, về sau thành người làm gương',
  '4/6': 'Kết nối – hình mẫu: ảnh hưởng qua quan hệ thân thiết, dần thành hình mẫu đáng tin', '4/1': 'Kết nối – điều tra: con đường cố định, nền tảng vững, ảnh hưởng qua người quen',
  '5/1': 'Giải cứu – điều tra: được kỳ vọng mang giải pháp, cần nền kiến thức vững để giữ uy tín', '5/2': 'Giải cứu – ẩn sĩ: sức hút với người lạ nhưng cần không gian riêng',
  '6/2': 'Hình mẫu – ẩn sĩ: sống làm gương, tài năng tự nhiên được mời ra', '6/3': 'Hình mẫu – thử nghiệm: trải nghiệm nhiều, trưởng thành thành người thông thái'
};
var HD_DONG_LUC = ['Sợ hãi (Fear)', 'Hy vọng (Hope)', 'Khao khát (Desire)', 'Nhu cầu (Need)', 'Áy náy (Guilt)', 'Ngây thơ (Innocence)'];
var HD_DONG_LUC_Y = ['động lực từ việc muốn hiểu và vượt qua nỗi sợ', 'động lực từ niềm hy vọng vào điều tốt hơn', 'động lực từ khao khát trải nghiệm, sở hữu', 'động lực từ nhu cầu thực tế cần được đáp ứng', 'động lực từ ý thức trách nhiệm, không muốn ai bị bỏ lại', 'động lực tự nhiên, không toan tính'];
var HD_QUAN_DIEM = ['Sinh tồn (Survival)', 'Khả năng (Possibility)', 'Quyền lực (Power)', 'Mong muốn (Wanting)', 'Xác suất (Probability)', 'Cá nhân (Personal)'];
var HD_QUAN_DIEM_Y = ['nhìn đời qua câu hỏi "điều gì giúp tồn tại, an toàn"', 'nhìn thấy mọi khả năng có thể xảy ra', 'nhìn ra ai nắm quyền, sức mạnh vận hành ra sao', 'nhìn qua điều mình và người khác mong muốn', 'nhìn qua khả năng thành – bại, số liệu', 'nhìn qua trải nghiệm cá nhân, câu chuyện riêng'];
var HD_MOI_TRUONG = ['Hang động (Caves)', 'Chợ (Markets)', 'Bếp (Kitchens)', 'Núi (Mountains)', 'Thung lũng (Valleys)', 'Bờ biển (Shores)'];
var HD_MOI_TRUONG_Y = ['không gian an toàn, có "lưng tựa", ít người, được che chắn', 'nơi nhộn nhịp, trao đổi, nhiều người qua lại', 'nơi có hoạt động tạo tác, cộng tác nhỏ, "nấu" ý tưởng',
  'nơi cao, thoáng, nhìn xa, được quan sát từ trên', 'nơi thấp, thoải mái, giữa thiên nhiên, bình yên', 'nơi chuyển tiếp giữa hai thế giới, ven sông biển, gần nước'];
var HD_TIEU_HOA = ['Khẩu vị (Appetite)', 'Nếm (Taste)', 'Khát (Thirst)', 'Chạm (Touch)', 'Âm thanh (Sound)', 'Ánh sáng (Light)'];
var HD_TIEU_HOA_Y = ['ăn theo từng món/lần, không trộn lẫn nhiều thứ', 'ăn theo cảm nhận vị giác, chọn lọc kỹ', 'để ý đồ uống và độ ẩm, nhiệt độ thức ăn', 'ăn trong không khí bình yên, không căng thẳng',
  'ăn trong không gian có âm thanh phù hợp (yên tĩnh hoặc có tiếng động nhẹ)', 'ăn khi có ánh sáng tự nhiên, tránh ăn tối muộn'];
var HD_7NAM = ['nền móng cơ thể, học từ gia đình', 'hình thành cá tính, bạn bè, trường học', 'tìm bản sắc, thử nghiệm', 'lập thân, sự nghiệp và quan hệ đầu tiên', 'định hình nghề nghiệp, gia đình', 'đánh giá lại những gì đã xây, sống thật với mình hơn',
  'khủng hoảng giữa đời – thay đổi hướng đi nếu đang sống lệch', 'chín chắn, chia sẻ kinh nghiệm', 'giai đoạn "hình mẫu", trao truyền', 'thu hoạch, tĩnh tại', 'an nhiên, tổng kết đời', 'truyền lại di sản'];

function hdPhanTich_(hd, T, viewYear) {
  var out = {}, gateCenter = {}, gc = function (g) { return gateCenter[g]; };
  Object.keys(HD_CENTERS).forEach(function (c) { HD_CENTERS[c].gates.forEach(function (g) { gateCenter[g] = c; }); });
  var coKenh = function (a, b) { return hd.kenh.some(function (k) { return (k.a === a && k.b === b) || (k.a === b && k.b === a); }); };
  // ---- B2: bodygraph
  var dz = ctJdNgay_(hd.jdDesign, T.tz);
  out.duLieu = { sinh: T.d + '/' + T.m + '/' + T.y + ' ' + (T.h < 10 ? '0' : '') + T.h + ':' + (T.mi < 10 ? '0' : '') + T.mi, noiSinh: T.noiSinh, thietKe: dz.t, tz: T.tz,
    kichHoat: HD_BODIES.map(function (b) { var P = hd.act.p[b], D = hd.act.d[b]; return { ten: HD_BODY_TEN[b], p: P.gate + '.' + P.line, d: D.gate + '.' + D.line, pTen: HD_GATE_TEN[P.gate], dTen: HD_GATE_TEN[D.gate] }; }),
    coLoi: [['Loại (Type)', HD_TYPE_VN[hd.loai] + ' – ' + hd.loai], ['Thẩm quyền (Authority)', HD_AUTH[hd.thamQuyen].ten], ['Định nghĩa (Definition)', hd.dinhNghia], ['Hồ sơ (Profile)', hd.profile]] };
  // ---- B3: 5 loại
  out.loai = { hienTai: hd.loai, ds: HD_TYPE_DS.map(function (k) { var X = HD_TYPES[k]; return { k: k, ten: HD_TYPE_VN[k] + ' (' + k + ')', tl: X.tl, chienLuoc: X.chienLuoc, dauHieu: X.dauHieu, saiLech: X.saiLech, la: k === hd.loai }; }),
    lam: HD_TYPE_LAM[hd.loai], qh: HD_TYPE_QH[hd.loai] };
  // ---- B4: 7 thẩm quyền
  out.thamQuyen = { k: hd.thamQuyen, ds: HD_AUTH_DS.filter(function (x) { return x[0] !== 'egoP' || hd.thamQuyen === 'egoP'; }).filter(function (x) { return !(x[0] === 'egoM' && hd.thamQuyen === 'egoP'); })
    .map(function (x) { return { ten: x[1], moTa: HD_AUTH[x[0]].moTa, la: x[0] === hd.thamQuyen }; }) };
  // ---- B5: định nghĩa + cầu nối
  var nhom = [], da = {}, adj = {};
  hd.kenh.forEach(function (k) { (adj[k.c1] = adj[k.c1] || []).push(k.c2); (adj[k.c2] = adj[k.c2] || []).push(k.c1); });
  Object.keys(hd.dinh).forEach(function (c) {
    if (da[c]) return; var st = [c], g = []; da[c] = 1;
    while (st.length) { var x = st.pop(); g.push(x); (adj[x] || []).forEach(function (n) { if (!da[n]) { da[n] = 1; st.push(n); } }); }
    nhom.push(g);
  });
  var cau = [];
  if (nhom.length >= 2) HD_CHANNELS.forEach(function (ch) {
    if (coKenh(ch[0], ch[1])) return;
    var n1 = -1, n2 = -1; nhom.forEach(function (g, i) { if (g.indexOf(gc(ch[0])) >= 0) n1 = i; if (g.indexOf(gc(ch[1])) >= 0) n2 = i; });
    if (n1 >= 0 && n2 >= 0 && n1 !== n2) { var thieu = [ch[0], ch[1]].filter(function (g) { return !hd.gates[g]; }); if (thieu.length === 1) cau.push({ cong: thieu[0], kenh: ch[0] + '–' + ch[1] + ' ' + ch[2] }); }
  });
  out.dinhNghia = { hienTai: hd.dinhNghia, nhom: nhom.map(function (g) { return g.map(function (c) { return HD_CENTERS[c].ten.split(' (')[0]; }); }), cau: cau,
    ds: HD_DN_DS.map(function (x, i) { return { ten: x[0], y: x[1], la: (hd.soNhom === 0 && i === 4) || hd.soNhom === i + 1 }; }) };
  // ---- B6: 12 hồ sơ
  out.hoSo = { hienTai: hd.profile, ds: Object.keys(HD_PROFILE_Y).map(function (k) { return { k: k, y: HD_PROFILE_Y[k], la: k === hd.profile }; }),
    y: HD_PROFILE_Y[hd.profile] || '', l1: HD_LINE[hd.l1], l2: HD_LINE[hd.l2] };
  // ---- B7: 9 trung tâm
  out.trungTam = Object.keys(HD_CENTERS).map(function (c) {
    var cong = HD_CENTERS[c].gates.filter(function (g) { return hd.gates[g]; });
    return { k: c, ten: HD_CENTERS[c].ten, dinh: !!hd.dinh[c], moHoanToan: !hd.dinh[c] && !cong.length, cong: cong, sinhHoc: HD_CENTER_BIO[c],
      t: hd.dinh[c] ? 'Sức mạnh: ' + HD_CENTER_Y[c][0] : 'Bài học: ' + HD_CENTER_Y[c][1] + (cong.length ? '' : ' (Mở hoàn toàn – không có cổng nào, bạn học được nhiều nhất và dễ bị ảnh hưởng nhất ở đây.)') };
  });
  // ---- B8: 36 kênh theo mạch
  var machCua = function (a, b) { for (var m in HD_MACH) if (HD_MACH[m].some(function (x) { return (x[0] === a && x[1] === b) || (x[0] === b && x[1] === a); })) return m; return ''; };
  out.kenh = { ds: HD_CHANNELS.map(function (ch) { var m = machCua(ch[0], ch[1]); return { k: ch[0] + '–' + ch[1], ten: ch[2], moTa: ch[3], mach: m, loai: m.split(' – ')[0], co: coKenh(ch[0], ch[1]), treo: !coKenh(ch[0], ch[1]) && (!!hd.gates[ch[0]] || !!hd.gates[ch[1]]) }; }) };
  var dem = { 'Cá nhân': 0, 'Tập thể': 0, 'Bộ tộc': 0 };
  out.kenh.ds.forEach(function (k) { if (k.co) dem[k.loai]++; });
  out.kenh.dem = dem;
  out.kenh.ketLuan = hd.kenh.length ? (dem['Cá nhân'] > dem['Tập thể'] + dem['Bộ tộc'] ? 'Thiên về kênh cá nhân: ' + HD_MACH_Y['Cá nhân'] + '.' : 'Thiên về kênh hợp tác: ' + (dem['Bộ tộc'] >= dem['Tập thể'] ? HD_MACH_Y['Bộ tộc'] : HD_MACH_Y['Tập thể']) + '.') : 'Không có kênh xác định – bạn cảm nhận năng lượng của mọi người xung quanh.';
  // ---- B9: 64 cổng
  var kh = [], trong = [], treo = [];
  for (var g = 1; g <= 64; g++) {
    if (hd.gates[g]) {
      var mau = hd.gates[g].indexOf('p') >= 0 && hd.gates[g].indexOf('d') >= 0 ? 'cả hai' : hd.gates[g].indexOf('p') >= 0 ? 'đen' : 'đỏ';
      kh.push({ g: g, ten: HD_GATE_TEN[g], mau: mau, tt: HD_CENTERS[gc(g)].ten.split(' (')[0] });
      var ch2 = HD_CHANNELS.filter(function (c) { return (c[0] === g || c[1] === g) && !coKenh(c[0], c[1]); });
      if (ch2.length && !HD_CHANNELS.some(function (c) { return (c[0] === g || c[1] === g) && coKenh(c[0], c[1]); })) treo.push({ g: g, ten: HD_GATE_TEN[g], canCong: ch2.map(function (c) { return c[0] === g ? c[1] : c[0]; }) });
    } else trong.push({ g: g, ten: HD_GATE_TEN[g], tt: HD_CENTERS[gc(g)].ten.split(' (')[0] });
  }
  out.cong = { kichHoat: kh, trong: trong, treo: treo, soDen: kh.filter(function (x) { return x.mau !== 'đỏ'; }).length, soDo: kh.filter(function (x) { return x.mau !== 'đen'; }).length };
  // ---- B10: nút, biến số, solar return, chu kỳ 7 năm, transit
  var pS = hd.act.p.sun, dS = hd.act.d.sun, pN = hd.act.p.northNode, dN = hd.act.d.northNode;
  out.bienSo = [
    { ten: 'Động lực (Motivation)', gt: HD_DONG_LUC[pS.color - 1], y: HD_DONG_LUC_Y[pS.color - 1], nguon: 'màu của Mặt Trời Tính cách', mui: pS.tone <= 3 ? 'trái – tập trung, chủ động' : 'phải – thụ cảm, mở' },
    { ten: 'Quan điểm (Perspective)', gt: HD_QUAN_DIEM[pN.color - 1], y: HD_QUAN_DIEM_Y[pN.color - 1], nguon: 'màu của Nút Bắc Tính cách', mui: pN.tone <= 3 ? 'trái – nhìn tập trung' : 'phải – nhìn bao quát' },
    { ten: 'Môi trường (Environment)', gt: HD_MOI_TRUONG[dN.color - 1], y: HD_MOI_TRUONG_Y[dN.color - 1], nguon: 'màu của Nút Bắc Thiết kế', mui: dN.tone <= 3 ? 'trái – nơi quen thuộc, cố định' : 'phải – nơi thay đổi, đa dạng' },
    { ten: 'Tiêu hóa (Determination)', gt: HD_TIEU_HOA[dS.color - 1], y: HD_TIEU_HOA_Y[dS.color - 1], nguon: 'màu của Mặt Trời Thiết kế', mui: dS.tone <= 3 ? 'trái – ăn theo nếp cố định' : 'phải – ăn linh hoạt theo cảm nhận' }
  ];
  out.nut = { p: 'Nút Bắc Tính cách cổng ' + pN.gate + ' (' + HD_GATE_TEN[pN.gate] + '), Nút Nam cổng ' + hd.act.p.southNode.gate + ' – chủ đề môi trường và con đường ý thức, nổi bật sau khoảng 38–40 tuổi.',
    d: 'Nút Bắc Thiết kế cổng ' + dN.gate + ' (' + HD_GATE_TEN[dN.gate] + ') – môi trường và những người cơ thể bạn cần gặp.' };
  function chartTam(jd) {
    var pos = astToanBo(jd), gs = {}; HD_BODIES.forEach(function (b) { gs[hdCong_(pos[b]).gate] = 1; });
    var moi = HD_CHANNELS.filter(function (c) { return !coKenh(c[0], c[1]) && (hd.gates[c[0]] || gs[c[0]]) && (hd.gates[c[1]] || gs[c[1]]); });
    return { sun: hdCong_(pos.sun), moi: moi.map(function (c) { return 'Kênh ' + c[0] + '–' + c[1] + ' ' + c[2] + ' (' + c[3] + ')'; }), ttMoi: Object.keys(HD_CENTERS).filter(function (c) { return !hd.dinh[c] && moi.some(function (k) { return gc(k[0]) === c || gc(k[1]) === c; }); }) };
  }
  var jdSR = astTimMatTroi_(astToanBoSun_(T.jd), astJD_(viewYear, T.m, T.d, 12, 0, T.tz)), sr = chartTam(jdSR);
  out.solarReturn = { ngay: ctJdNgay_(jdSR, T.tz).t, kenh: sr.moi, trungTam: sr.ttMoi.map(function (c) { return HD_CENTERS[c].ten.split(' (')[0]; }),
    t: 'Năm ' + viewYear + ' (từ ' + ctJdNgay_(jdSR, T.tz).t.split(' ')[0] + '): ' + (sr.moi.length ? 'các hành tinh lúc Mặt Trời hồi quy nối thêm ' + sr.moi.length + ' kênh cho bạn – chủ đề năm: ' + sr.moi.slice(0, 3).join('; ') + '.' : 'không nối thêm kênh mới – năm sống đúng với thiết kế gốc.') };
  var hom = new Date(), jdNay = hom.getFullYear() === viewYear ? astJD_(hom.getFullYear(), hom.getMonth() + 1, hom.getDate(), 12, 0, T.tz) : astJD_(viewYear, 7, 1, 12, 0, T.tz), tr = chartTam(jdNay);
  out.transit = { ngay: ctJdNgay_(jdNay, T.tz).t.split(' ')[0], matTroi: tr.sun.gate + '.' + tr.sun.line + ' (' + HD_GATE_TEN[tr.sun.gate] + ')', kenh: tr.moi, trungTam: tr.ttMoi.map(function (c) { return HD_CENTERS[c].ten.split(' (')[0]; }) };
  var tuoi = viewYear - T.y, ky = Math.floor(tuoi / 7);
  out.chuKy7 = HD_7NAM.map(function (y, i) { return { tu: i * 7, den: i * 7 + 6, nam: T.y + i * 7, y: y, nay: i === ky }; }).slice(0, 12);
  // ---- B11: luận tổng hợp
  var mo = out.trungTam.filter(function (c) { return !c.dinh; }), xd = out.trungTam.filter(function (c) { return c.dinh; });
  var X = HD_TYPES[hd.loai], A = HD_AUTH[hd.thamQuyen];
  out.tongHop = [
    { k: 'tongQuan', ten: 'Tổng quan', items: [HD_TYPE_VN[hd.loai] + ' (' + hd.loai + ', ' + X.tl + ' dân số) · ' + A.ten + ' · hồ sơ ' + hd.profile + ' · ' + hd.dinhNghia + '.', X.moTa] },
    { k: 'chienLuoc', ten: 'Chiến lược', items: ['Cách sống đúng Loại: ' + X.chienLuoc + '.', 'Khi sống đúng bạn cảm thấy ' + X.dauHieu.toLowerCase() + '; khi lệch hướng dễ ' + X.saiLech.toLowerCase() + '.'] },
    { k: 'thamQuyen', ten: 'Thẩm quyền', items: [A.moTa] },
    { k: 'chuDe', ten: 'Chủ đề cuộc đời', items: ['Giao điểm hóa thân ' + hd.cross + ' – ' + hd.goc + '.', 'Mặt Trời Tính cách cổng ' + pS.gate + ' – ' + HD_GATE_TEN[pS.gate] + ': chủ đề sống ý thức. Mặt Trời Thiết kế cổng ' + dS.gate + ' – ' + HD_GATE_TEN[dS.gate] + ': chủ đề của cơ thể.', 'Hồ sơ ' + hd.profile + ': ' + (HD_PROFILE_Y[hd.profile] || '') + '.'] },
    { k: 'baiHoc', ten: 'Bài học', items: mo.map(function (c) { return '□ ' + c.ten + ': ' + HD_CENTER_Y[c.k][1]; }).concat(treo.length ? ['Cổng treo ' + treo.slice(0, 6).map(function (x) { return x.g; }).join(', ') + ': bạn bị thu hút bởi người có cổng đối ứng – vừa là quà, vừa là bài học phụ thuộc.'] : []) },
    { k: 'quanHe', ten: 'Mối quan hệ', items: ['Cách tương tác: ' + HD_TYPE_QH[hd.loai] + '.', out.dinhNghia.ds.filter(function (x) { return x.la; }).map(function (x) { return x.ten + ': ' + x.y; })[0] + '.', cau.length ? 'Người có cổng ' + cau.map(function (x) { return x.cong; }).join(', ') + ' sẽ "bắc cầu" nối các phần của bạn – bạn thấy trọn vẹn khi ở gần họ.' : 'Hồ sơ hào ' + hd.l2 + ' (' + HD_LINE[hd.l2][0] + ') cho biết cách người khác nhìn bạn trong quan hệ.'] },
    { k: 'suNghiep', ten: 'Sự nghiệp', items: ['Cách làm việc: ' + HD_TYPE_LAM[hd.loai] + '.', 'Vai trò (hồ sơ): ' + HD_LINE[hd.l1][0] + ' / ' + HD_LINE[hd.l2][0] + '.'].concat(hd.kenh.length ? ['Tài năng từ kênh: ' + hd.kenh.map(function (k) { return k.ten + ' (' + k.moTa + ')'; }).join('; ') + '.'] : []) },
    { k: 'sucKhoe', ten: 'Sức khỏe', items: mo.map(function (c) { return 'Trung tâm mở ' + c.ten.split(' (')[0] + ' ↔ ' + c.sinhHoc + ': dễ nhạy cảm, nên chăm sóc.'; }).concat(['Chế độ ăn hợp (' + out.bienSo[3].gt + '): ' + out.bienSo[3].y + '.']) },
    { k: 'vanTrinh', ten: 'Vận trình', items: [out.solarReturn.t, 'Chu kỳ 7 năm hiện tại (' + out.chuKy7[Math.min(ky, 11)].tu + '–' + out.chuKy7[Math.min(ky, 11)].den + ' tuổi): ' + out.chuKy7[Math.min(ky, 11)].y + '.', 'Transit hôm nay: Mặt Trời ở cổng ' + out.transit.matTroi + (tr.moi.length ? '; tạm nối ' + tr.moi.length + ' kênh.' : '.')] }
  ];
  out.loiKhuyen = [
    { ten: 'Phát huy điểm mạnh', t: (xd.length ? 'Tin vào ' + xd.map(function (c) { return c.ten.split(' (')[0].toLowerCase(); }).join(', ') + ' – đây là phần ổn định, đáng tin của bạn. ' : '') + (hd.kenh.length ? 'Dùng tài năng: ' + hd.kenh.slice(0, 3).map(function (k) { return k.moTa; }).join('; ') + '.' : '') },
    { ten: 'Khắc phục điểm yếu', t: 'Ở các trung tâm mở (' + mo.map(function (c) { return c.ten.split(' (')[0].toLowerCase(); }).join(', ') + '), đừng để năng lượng của người khác quyết định thay bạn – quay về chiến lược và thẩm quyền.' },
    { ten: 'Thời điểm hành động', t: 'Việc lớn: ' + X.chienLuoc.toLowerCase() + '; quyết định theo ' + A.ten.replace('Thẩm quyền ', '').toLowerCase() + '. Năm nay: ' + out.solarReturn.t.split(': ').slice(1).join(': ') }
  ];
  return out;
}
