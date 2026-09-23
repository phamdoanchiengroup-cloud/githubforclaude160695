/**
 * ============================================================
 *  TongHop.gs — LUẬN GIẢI TỔNG HỢP ĐA HỆ THỐNG
 *  Kết hợp 5 hệ: Tử Vi Đẩu Số · Bát Tự (Tứ Trụ) · Chiêm tinh phương Tây ·
 *  Thần số học Pythagoras · Human Design để mô tả đương số qua:
 *    1. Xuất thân – gia cảnh      2. Vóc dáng – diện mạo
 *    3. Đặc điểm nổi bật trên cơ thể & vùng sức khỏe cần giữ
 *    4. Tính cách (5 trục, đo mức đồng thuận giữa các hệ)
 *    5. Đường đời: chủ đề sống, nghề nghiệp, các chặng đời và mốc chuyển
 *  Nguyên tắc: mỗi hệ "bỏ phiếu" độc lập trên cùng một thang đo; kết luận nào
 *  được nhiều hệ cùng chỉ ra thì độ tin cậy cao hơn (phương pháp đối chiếu chéo
 *  – triangulation). Hệ nào không có lý thuyết cho khía cạnh đó thì không bỏ phiếu.
 * ============================================================
 */

var TH_VUNG = {
  dau: 'Đầu – mặt', mat: 'Mắt', tai: 'Tai', co: 'Cổ – họng – tuyến giáp', tay: 'Vai – cánh tay – bàn tay', phoi: 'Phổi – hô hấp – mũi',
  thanKinh: 'Thần kinh – giấc ngủ', nguc: 'Ngực – vú', daDay: 'Dạ dày – tiêu hóa – miệng', tim: 'Tim – huyết áp', lung: 'Lưng – cột sống',
  than: 'Thận – thắt lưng – tiết niệu', sinhDuc: 'Sinh dục – bài tiết', gan: 'Gan – mật – gân', chan: 'Hông – đùi – đầu gối – bàn chân',
  da: 'Da – tì vết – nốt ruồi', xuong: 'Xương – răng – khớp', mienDich: 'Miễn dịch – bạch huyết', mau: 'Máu – huyết'
};

/** Chính tinh Tử Vi: hình tướng (cổ thư) + phiếu hình thể + bộ phận + trục tính cách + nghề */
var TH_SAO = {
  'Tử Vi': { hinh: 'thân hình đầy đặn, vừa tầm, mặt vuông tròn, da hồng hào, lưng dày, dáng đường bệ', v: { cao: 0, beo: 1, mat: 'vuông tròn', da: 'hồng' }, bp: ['daDay', 'dau'], tc: [1, 0.5, 1, 2, 0.5], nghe: ['qly', 'kd'] },
  'Thiên Cơ': { hinh: 'người cao, gầy, mặt dài trái xoan, da trắng xanh, mắt sáng, tay chân dài', v: { cao: 1, beo: -1, mat: 'trái xoan', da: 'sáng' }, bp: ['gan', 'chan', 'thanKinh'], tc: [0, 1.5, -1, -0.5, 0], nghe: ['kt', 'gd', 'tt'] },
  'Thái Dương': { hinh: 'thân hình nở nang, mặt vuông hoặc tròn đầy, da hồng hào, mắt sáng, dáng hoạt bát', v: { cao: 0.5, beo: 0.5, mat: 'vuông tròn', da: 'hồng' }, bp: ['mat', 'dau', 'tim'], tc: [2, 0.5, 0, 1, 0], nghe: ['qly', 'gd', 'tt'] },
  'Vũ Khúc': { hinh: 'thân hình nhỏ gọn mà chắc, xương cứng, mặt vuông, giọng nói vang, da hơi ngăm', v: { cao: -1, beo: 0, mat: 'vuông', da: 'ngăm' }, bp: ['phoi', 'xuong'], tc: [-0.5, 1, 1, 1, 2], nghe: ['kd', 'kt'] },
  'Thiên Đồng': { hinh: 'thân hình tròn trịa đầy đặn, mặt tròn, da trắng, trông phúc hậu và trẻ lâu', v: { cao: -0.5, beo: 1, mat: 'tròn', da: 'sáng' }, bp: ['than', 'tai'], tc: [0.5, -1, -1, -1, -0.5], nghe: ['yt', 'gd', 'nt'] },
  'Liêm Trinh': { hinh: 'dáng cao dong dỏng, xương to, lông mày rậm, mắt lộ, mặt dài, da ngăm', v: { cao: 0.5, beo: -0.5, mat: 'dài', da: 'ngăm' }, bp: ['mau', 'sinhDuc'], tc: [0.5, 0, 0, 1, 0.5], nghe: ['pl', 'qly', 'kt'] },
  'Thiên Phủ': { hinh: 'thân hình đẫy đà, mặt vuông tròn, da trắng, răng đều, dáng điềm đạm', v: { cao: 0, beo: 1, mat: 'vuông tròn', da: 'sáng' }, bp: ['daDay'], tc: [0, 0.5, 2, 1, 1.5], nghe: ['kd', 'qly'] },
  'Thái Âm': { hinh: 'dáng thanh tú, mặt tròn hoặc trái xoan, da trắng mịn, mắt đẹp, cử chỉ nhẹ nhàng', v: { cao: 0, beo: 0, mat: 'tròn', da: 'sáng' }, bp: ['mat', 'than', 'sinhDuc'], tc: [-1.5, -1.5, 0.5, -1, -1], nghe: ['nt', 'kd', 'gd'] },
  'Tham Lang': { hinh: 'thân hình cao lớn hoặc đầy đặn, xương to, mặt dài/vuông, lông mày đậm, nhiều lông tóc', v: { cao: 0.5, beo: 0.5, mat: 'dài', da: 'ngăm' }, bp: ['gan', 'than', 'sinhDuc'], tc: [1.5, -0.5, -1, 0.5, 1], nghe: ['kd', 'tt', 'nt'] },
  'Cự Môn': { hinh: 'thân hình đầy đặn, mặt vuông dài, môi dày, miệng rộng, da ngăm', v: { cao: 0, beo: 0.5, mat: 'vuông', da: 'ngăm' }, bp: ['daDay', 'phoi'], tc: [0.5, 1, -0.5, 0, 0], nghe: ['pl', 'gd', 'tt'] },
  'Thiên Tướng': { hinh: 'dáng khôi ngô, vừa tầm hoặc đầy đặn, mặt vuông tròn, da trắng, ăn mặc chỉnh tề', v: { cao: 0, beo: 0.5, mat: 'vuông tròn', da: 'sáng' }, bp: ['da', 'than'], tc: [0.5, 0.5, 1, -0.5, 0.5], nghe: ['qly', 'pl', 'yt'] },
  'Thiên Lương': { hinh: 'người cao, thanh, mặt vuông dài, da trắng, dáng hiền từ chững chạc', v: { cao: 1, beo: -0.5, mat: 'dài', da: 'sáng' }, bp: ['daDay', 'nguc'], tc: [0, 1, 1, 0.5, -1], nghe: ['yt', 'gd', 'tl'] },
  'Thất Sát': { hinh: 'thân hình vừa tầm, rắn chắc, mặt dài hoặc chữ điền, mắt to sáng, lông mày rậm, da ngăm, có uy', v: { cao: 0, beo: 0, mat: 'dài', da: 'ngăm' }, bp: ['phoi', 'xuong'], tc: [0.5, 0.5, -1.5, 2, 1], nghe: ['pl', 'qly', 'kt'] },
  'Phá Quân': { hinh: 'lưng dày, vai rộng, thân hình thấp đậm, mặt vuông, lông mày thưa, mắt to, da ngăm', v: { cao: -0.5, beo: 0.5, mat: 'vuông', da: 'ngăm' }, bp: ['than', 'sinhDuc', 'mau'], tc: [1, -0.5, -2, 1.5, 0], nghe: ['pl', 'kt', 'dl'] }
};

/** Dấu hiệu trên cơ thể theo phụ tinh/sát tinh tại Mệnh – Thân – Tật */
var TH_DAU_HIEU = {
  'Kình Dương': ['sẹo hoặc vết thương do vật sắc/kim khí, thường ở đầu – mặt – tay', 'dau'],
  'Đà La': ['răng khểnh/răng lệch hoặc sẹo ở tay chân, dễ đau lưng – xương', 'xuong'],
  'Hỏa Tinh': ['vết bớt, sẹo bỏng hoặc da dễ nổi mụn, nóng trong', 'da'],
  'Linh Tinh': ['vết bớt, tì vết sẫm màu, dễ bỏng/giật mình', 'da'],
  'Thiên Hình': ['vết sẹo do dao kéo – phẫu thuật, hoặc có dấu vết tai nạn', 'da'],
  'Địa Không': ['tì vết nhỏ, cơ thể có chỗ "khuyết" hoặc hay hao tổn khí lực', 'da'],
  'Địa Kiếp': ['tì vết, vết thâm hoặc sẹo nhỏ khó giải thích', 'da'],
  'Hóa Kỵ': ['nốt ruồi hoặc tì vết rõ trên mặt/cơ thể (đặc biệt vùng bộ phận của chính tinh bị Kỵ)', 'da'],
  'Văn Xương': ['nốt ruồi ẩn (ở chỗ kín hoặc khó thấy), nét mặt thanh', 'da'],
  'Văn Khúc': ['nốt ruồi ẩn, giọng nói hay, mắt sáng', 'da'],
  'Đào Hoa': ['mắt đẹp, môi tươi, nét duyên thu hút người khác phái', 'mat'],
  'Hồng Loan': ['má hồng, tóc đẹp, nét mặt tươi tắn', 'dau'],
  'Thiên Riêu': ['nét mặt đa tình, có thể có nốt ruồi duyên', 'da'],
  'Thiên Khốc': ['dễ bệnh hô hấp – mũi họng, giọng trầm', 'phoi'],
  'Thiên Hư': ['dễ hư hao khí lực, bệnh hô hấp', 'phoi'],
  'Thiên Mã': ['chân tay nhanh nhẹn, dáng đi nhanh; dễ chấn thương khi di chuyển', 'chan'],
  'Lực Sĩ': ['cơ bắp khỏe, sức lực tốt', 'xuong'],
  'Tả Phù': ['dáng người đôn hậu, dễ nhìn', ''],
  'Hữu Bật': ['dáng người đôn hậu, dễ nhìn', '']
};

var TH_NGU_HANH_HINH = {
  'Mộc': { hinh: 'người thon dài, thẳng, tay chân dài, tóc đẹp, mặt dài (hình Mộc)', v: { cao: 1, beo: -1, mat: 'dài', da: 'sáng' }, bp: ['gan', 'mat'] },
  'Hỏa': { hinh: 'trên nhọn dưới đầy, cằm/trán nhọn, da hồng, tóc thưa hoặc xoăn, mắt sáng, nhanh nhẹn (hình Hỏa)', v: { cao: 0, beo: -0.5, mat: 'trái xoan', da: 'hồng' }, bp: ['tim', 'mau'] },
  'Thổ': { hinh: 'dày dặn, lưng dày, mặt vuông tròn, da vàng, dáng trầm chắc (hình Thổ)', v: { cao: -0.5, beo: 1, mat: 'vuông tròn', da: 'ngăm' }, bp: ['daDay'] },
  'Kim': { hinh: 'vuông vắn, xương chắc, da trắng, mặt vuông chữ điền (hình Kim)', v: { cao: 0, beo: 0, mat: 'vuông', da: 'sáng' }, bp: ['phoi', 'da'] },
  'Thủy': { hinh: 'tròn trịa, đầy đặn, da sẫm, mặt tròn, mắt linh hoạt (hình Thủy)', v: { cao: -0.5, beo: 1, mat: 'tròn', da: 'ngăm' }, bp: ['than', 'tai', 'xuong'] }
};

var TH_TRUC = [
  { k: 'ngoai', ten: 'Hướng ngoại ↔ Hướng nội', duong: 'Hướng ngoại: thích giao tiếp, lấy năng lượng từ đám đông, dễ tạo ảnh hưởng', am: 'Hướng nội: cần không gian riêng, nạp năng lượng khi ở một mình, sâu sắc hơn ồn ào' },
  { k: 'lyTri', ten: 'Lý trí ↔ Cảm xúc', duong: 'Thiên lý trí: phân tích, logic, cân nhắc kỹ trước khi hành động', am: 'Thiên cảm xúc – trực giác: cảm nhận nhanh, sống tình cảm, quyết định bằng trái tim' },
  { k: 'onDinh', ten: 'Kiên định ↔ Biến động', duong: 'Kiên định: bền bỉ, thích ổn định, trung thành với lựa chọn', am: 'Linh hoạt – biến động: ưa đổi mới, thích trải nghiệm, dễ thay đổi hướng đi' },
  { k: 'lanhDao', ten: 'Độc lập ↔ Hợp tác', duong: 'Độc lập: thích tự quyết, có tố chất thủ lĩnh, không thích bị chỉ huy', am: 'Hợp tác: mạnh khi làm cùng người khác, giỏi hỗ trợ và điều phối' },
  { k: 'thucTe', ten: 'Thực tế ↔ Lý tưởng', duong: 'Thực tế: coi trọng kết quả hữu hình, tiền bạc, hiệu quả', am: 'Lý tưởng – tâm linh: coi trọng ý nghĩa, giá trị tinh thần và niềm tin' }
];

var TH_CAN_TC = { 0: [0.5, 0.5, 1, 1.5, 0], 1: [0, -0.5, -0.5, -1, 0.5], 2: [2, -0.5, 0, 1, 0], 3: [-0.5, -0.5, 0.5, -0.5, -0.5], 4: [-0.5, 0.5, 2, 1, 1],
  5: [-0.5, 0, 1, -1, 1], 6: [0.5, 1, 0, 2, 1], 7: [0, 0.5, 0, 0, -0.5], 8: [1, 0.5, -1.5, 1, -0.5], 9: [-1, -0.5, -0.5, -1, -1] };
var TH_CAN_MO = ['Giáp Mộc – cây đại thụ: ngay thẳng, cầu tiến, có chí lớn', 'Ất Mộc – hoa cỏ dây leo: mềm mỏng, khéo léo, thích nghi giỏi', 'Bính Hỏa – mặt trời: nhiệt tình, cởi mở, hào phóng',
  'Đinh Hỏa – ngọn đèn: tinh tế, chu đáo, nội tâm ấm áp', 'Mậu Thổ – núi lớn: trầm ổn, đáng tin, bao dung', 'Kỷ Thổ – đất ruộng: khiêm nhường, chăm chỉ, giỏi nuôi dưỡng',
  'Canh Kim – kim loại thô: cương quyết, trọng nghĩa khí, thẳng tính', 'Tân Kim – châu ngọc: tinh tế, trọng thể diện, nhạy cảm', 'Nhâm Thủy – sông lớn: phóng khoáng, thông minh, thích tự do',
  'Quý Thủy – mưa sương: trầm lặng, trực giác, giàu tưởng tượng'];
var TH_NT_TC = { 'Lửa': [1, 0, -0.5, 1, 0], 'Đất': [-0.5, 0.5, 1, 0, 1.5], 'Khí': [1, 1.5, -0.5, 0, -0.5], 'Nước': [-1, -1.5, 0, -0.5, -1] };
var TH_SO_TC = { 1: [1, 0.5, 0, 2, 0.5], 2: [-1, -1, 0.5, -1.5, 0], 3: [1.5, -0.5, -0.5, 0, -0.5], 4: [-0.5, 1, 2, 0, 2], 5: [1.5, 0, -2, 0.5, 0], 6: [0, -1, 1, -0.5, 0.5],
  7: [-1.5, 1.5, 0, 0.5, -1.5], 8: [0, 1, 1, 1.5, 2], 9: [0.5, -1, 0, 0.5, -1.5], 10: [1, 0.5, -0.5, 1.5, 0.5], 11: [0, -1.5, -0.5, 0, -2], 22: [0, 1, 1.5, 1.5, 1], 33: [0.5, -1.5, 0.5, -0.5, -1] };
var TH_HD_TYPE_TC = { 'Manifestor': [0.5, 0, 0, 2, 0], 'Generator': [0, 0, 1.5, 0, 0.5], 'Manifesting Generator': [1, 0, -1.5, 0.5, 0.5], 'Projector': [0, 1, 0, -1, 0], 'Reflector': [-0.5, 0, -1, -1.5, -0.5] };
var TH_HD_AUTH_TC = { emotional: [0, -1.5, 0, 0, 0], sacral: [0, -0.5, 0, 0, 0.5], splenic: [0, -0.5, 0, 0, 0.5], mental: [0, 1.5, 0, 0, 0], egoM: [0, 0, 0, 1, 0.5], egoP: [0, 0, 0, 1, 0.5], self: [0, -0.5, 0, 0.5, -0.5], lunar: [-0.5, 0, -0.5, -0.5, -0.5] };

var TH_QUAI_TC = { 'Càn': [0.5, 0.5, 0.5, 2, 0.5], 'Khôn': [-0.5, -0.5, 1, -1.5, 1], 'Chấn': [1, -0.5, -1.5, 1, 0.5], 'Tốn': [0.5, 0.5, -0.5, -0.5, 0.5],
  'Khảm': [-1, 1, 0, 0, -0.5], 'Ly': [1.5, -0.5, -0.5, 0.5, -0.5], 'Cấn': [-1, 0.5, 2, 0, 1], 'Đoài': [1.5, -0.5, 0, 0, 0] };
var TH_QUAI_NGHE = { 'Càn': ['qly', 'pl'], 'Khôn': ['kd', 'yt'], 'Chấn': ['kt', 'tt'], 'Tốn': ['kd', 'tt'], 'Khảm': ['kt', 'dl'], 'Ly': ['nt', 'gd'], 'Cấn': ['kd', 'tl'], 'Đoài': ['tt', 'gd'] };
var TH_NGHE = {
  qly: 'Lãnh đạo – quản lý – hành chính', kd: 'Kinh doanh – tài chính – đầu tư', nt: 'Nghệ thuật – sáng tạo – thiết kế', gd: 'Giáo dục – đào tạo – tư vấn',
  kt: 'Kỹ thuật – công nghệ – nghiên cứu', yt: 'Y tế – chăm sóc – chữa lành', tt: 'Truyền thông – ngoại giao – bán hàng', pl: 'Pháp luật – quân sự – an ninh',
  tl: 'Tâm linh – triết học – văn hóa', dl: 'Du lịch – vận tải – xuất nhập khẩu'
};
var TH_NGHE_HANH = { 'Mộc': ['gd', 'nt'], 'Hỏa': ['tt', 'nt', 'kt'], 'Thổ': ['kd', 'qly'], 'Kim': ['kd', 'pl', 'kt'], 'Thủy': ['dl', 'tt', 'kd'] };
var TH_NGHE_CUNG = [['pl', 'qly'], ['kd', 'nt'], ['tt', 'gd'], ['yt', 'gd'], ['nt', 'qly'], ['yt', 'kt'], ['nt', 'pl', 'tt'], ['kt', 'yt', 'kd'], ['gd', 'dl', 'tl'], ['qly', 'kd'], ['kt', 'tl'], ['nt', 'yt', 'tl']];
var TH_NGHE_SO = { 1: ['qly', 'kd'], 2: ['yt', 'gd', 'tt'], 3: ['tt', 'nt', 'gd'], 4: ['kt', 'kd'], 5: ['tt', 'dl'], 6: ['yt', 'gd', 'nt'], 7: ['kt', 'tl'], 8: ['kd', 'qly'], 9: ['gd', 'yt', 'tl'], 10: ['qly', 'kd'], 11: ['tl', 'gd', 'nt'], 22: ['qly', 'kt'], 33: ['gd', 'yt'] };
var TH_NGHE_HD = { 'Manifestor': ['qly', 'kd'], 'Generator': ['kt', 'nt'], 'Manifesting Generator': ['kd', 'tt'], 'Projector': ['gd', 'qly'], 'Reflector': ['tl', 'gd'] };
var TH_NGHE_KENH = { '21-45': ['kd'], '7-31': ['qly'], '13-33': ['tt'], '16-48': ['nt', 'kt'], '4-63': ['kt'], '17-62': ['kt'], '1-8': ['nt'], '12-22': ['nt', 'tt'], '11-56': ['tt', 'gd'],
  '26-44': ['tt', 'kd'], '23-43': ['kt'], '27-50': ['yt'], '19-49': ['yt'], '37-40': ['qly'], '18-58': ['kt'], '24-61': ['tl'], '47-64': ['tl'], '28-38': ['pl'], '20-34': ['kd'], '34-57': ['pl'] };

/* ---------------------- tiện ích ---------------------- */
function thSaoCung_(p) { return [].concat(p.chinh || [], p.cat || [], p.hung || [], p.tieu || []); }
function thCoSao_(p, ten) { return thSaoCung_(p).some(function (s) { return s.n === ten || s.hoa === ten.replace('Hóa ', ''); }); }
function thCungTheoTen_(tv, ten) { for (var i = 0; i < 12; i++) if (tv.palaces[i].cung === ten) return tv.palaces[i]; return null; }
function thDiemCung_(tv, ten) { var c = (tv.luanGiai.cung || []).filter(function (x) { return x.cung === ten; })[0]; return c ? c.diem : 0; }
function thChinhTinh_(tv, p) {
  var ds = p.chinh.map(function (s) { return { n: s.n, b: s.b, muon: false }; });
  if (!ds.length) { // vô chính diệu: mượn sao cung đối
    ds = tv.palaces[(p.chi + 6) % 12].chinh.map(function (s) { return { n: s.n, b: s.b, muon: true }; });
  }
  return ds;
}
function thSign_(x) { return x > 0.35 ? 1 : x < -0.35 ? -1 : 0; }
function thVuong_(bt) { return bt.tyLeTro >= 58 ? 1 : bt.tyLeTro < 36 ? -1 : 0; }
function thDGVan_(s) { return { 'Đại cát': 2, 'Cát': 1, 'Bình': 0, 'Hơi kém': -1, 'Cẩn trọng': -2 }[s] || 0; }

/* =========================================================
 * 1. XUẤT THÂN – GIA CẢNH
 * ========================================================= */
function thXuatThan_(C) {
  var tv = C.tv, bt = C.bt, ct = C.ct, ts = C.ts;
  var he = [], giau = [], am = [], tuLap = [];
  function vote(arr, he, v) { arr.push({ he: he, v: v }); }

  // Tử Vi
  var tvi = [], pm = thCungTheoTen_(tv, 'Phụ Mẫu'), pd = thCungTheoTen_(tv, 'Phúc Đức'), dt = thCungTheoTen_(tv, 'Điền Trạch'), menh = tv.palaces[tv.info.menh];
  var dPM = thDiemCung_(tv, 'Phụ Mẫu'), dPD = thDiemCung_(tv, 'Phúc Đức'), dDT = thDiemCung_(tv, 'Điền Trạch');
  tvi.push('Cung Phụ Mẫu (cha mẹ) ' + pm.canTen + ' ' + pm.chiTen + ' – điểm ' + dPM + ': ' + (pm.chinh.map(function (s) { return s.n + (s.b ? '(' + s.b + ')' : ''); }).join(', ') || 'vô chính diệu') + '.');
  tvi.push('Cung Phúc Đức (dòng họ, phúc ấm) – điểm ' + dPD + '; cung Điền Trạch (nhà cửa, tài sản gia đình) – điểm ' + dDT + '.');
  var dGiau = (dDT * 0.5 + dPD * 0.3 + dPM * 0.2) / 3;
  if (thCoSao_(dt, 'Lộc Tồn') || thCoSao_(dt, 'Hóa Lộc')) { dGiau += 0.8; tvi.push('✓ Lộc tinh ở Điền Trạch: gia đình có của để, nhà cửa ổn định từ nhỏ.'); }
  if (thCoSao_(dt, 'Địa Không') || thCoSao_(dt, 'Địa Kiếp')) { dGiau -= 0.8; tvi.push('✗ Không/Kiếp ở Điền Trạch: tài sản gia đình hao hụt, nhiều khả năng tự tay gây dựng nhà cửa.'); }
  ['Tử Vi', 'Thiên Phủ'].forEach(function (s) { if (thCoSao_(menh, s) || thCoSao_(pm, s)) { dGiau += 0.4; tvi.push('✓ ' + s + ' ở Mệnh/Phụ Mẫu: gia đình có nền nếp, vị thế trong họ hàng.'); } });
  vote(giau, 'Tử Vi', Math.max(-2, Math.min(2, dGiau)));
  var dAm = dPM / 3;
  ['Kình Dương', 'Đà La', 'Hóa Kỵ', 'Thiên Hình', 'Hỏa Tinh', 'Linh Tinh'].forEach(function (s) { if (thCoSao_(pm, s)) { dAm -= 0.5; tvi.push('✗ ' + s + ' ở Phụ Mẫu: cha mẹ nghiêm khắc hoặc bất đồng, dễ có khoảng cách thế hệ.'); } });
  ['Thiên Khôi', 'Thiên Việt', 'Tả Phù', 'Hữu Bật', 'Thiên Quan', 'Thiên Phúc', 'Hóa Khoa', 'Thiên Đức', 'Nguyệt Đức'].forEach(function (s) { if (thCoSao_(pm, s)) { dAm += 0.3; } });
  vote(am, 'Tử Vi', Math.max(-2, Math.min(2, dAm)));
  var dTL = 0;
  if (menh.tuan || menh.triet) { dTL += 1; tvi.push('◇ Mệnh gặp ' + (menh.triet ? 'Triệt' : 'Tuần') + ': thuở nhỏ gặp trắc trở/ thiếu thốn, sớm phải tự lo – càng về sau càng khá.'); }
  if (thCoSao_(menh, 'Thiên Mã') || thCoSao_(thCungTheoTen_(tv, 'Thiên Di'), 'Thiên Mã')) { dTL += 0.8; tvi.push('◇ Thiên Mã chiếu Mệnh/Di: hay xa quê, thay đổi chỗ ở.'); }
  if (thCoSao_(menh, 'Cô Thần') || thCoSao_(menh, 'Quả Tú') || thCoSao_(pm, 'Cô Thần') || thCoSao_(pm, 'Quả Tú')) { dTL += 0.5; tvi.push('◇ Cô/Quả ở Mệnh hoặc Phụ Mẫu: tính tự lập, ít nhờ cậy gia đình.'); }
  if (dPM < -1) dTL += 0.5;
  vote(tuLap, 'Tử Vi', Math.min(2, dTL));
  he.push({ he: 'Tử Vi', items: tvi });

  // Bát Tự
  var bti = [], cv = C.btct.cungVi, nien = cv[0], nguyet = cv[1];
  bti.push('Niên trụ ' + nien.canChi + ' (tổ nghiệp, ông bà, 1–16 tuổi) – ' + nien.danhGia + ' (điểm ' + nien.diem + ').');
  bti.push('Nguyệt trụ ' + nguyet.canChi + ' (cha mẹ, anh chị em, 17–32 tuổi) – ' + nguyet.danhGia + ' (điểm ' + nguyet.diem + ').');
  var hy = bt.goiY.hy, gB = (nien.diem * 0.6 + nguyet.diem * 0.4) / 2.5;
  var ttNam = bt.pillars[0].thapThan, ttThang = bt.pillars[1].thapThan;
  if (/Ấn/.test(ttNam) || /Ấn/.test(ttThang)) bti.push('Ấn tinh ở trụ năm/tháng: gia đình coi trọng học hành, được cha mẹ (nhất là mẹ) bao bọc' + (hy.indexOf(bt.pillars[/Ấn/.test(ttNam) ? 0 : 1].canHanh) >= 0 ? ' – là hỷ dụng nên được hưởng nhiều.' : ' – nhưng là kỵ thần nên sự bao bọc có khi thành ràng buộc.'));
  if (/Tài/.test(ttNam) || /Tài/.test(ttThang)) { bti.push('Tài tinh ở trụ năm/tháng: gia đình có nền kinh tế hoặc truyền thống buôn bán; cha có vai trò lớn.'); gB += hy.indexOf(bt.pillars[/Tài/.test(ttNam) ? 0 : 1].canHanh) >= 0 ? 0.6 : 0.2; }
  if (/Kiếp|Thương/.test(ttThang)) { bti.push('◇ Kiếp Tài/Thương Quan ở trụ tháng: sớm độc lập, có cạnh tranh trong anh em hoặc bất đồng với khuôn phép gia đình.'); vote(tuLap, 'Bát Tự', 1); }
  else vote(tuLap, 'Bát Tự', 0);
  if (/Quan|Sát/.test(ttNam)) bti.push('Quan/Sát ở trụ năm: gia đình nề nếp, có người làm việc nhà nước hoặc gia phong nghiêm.');
  (bt.thanSat || []).forEach(function (t) { if (t.ten === 'Dịch Mã') { bti.push('◇ Dịch Mã (' + t.o + '): hay di chuyển, dễ rời quê lập nghiệp.'); tuLap[tuLap.length - 1].v += 0.8; } });
  vote(giau, 'Bát Tự', Math.max(-2, Math.min(2, gB)));
  vote(am, 'Bát Tự', Math.max(-2, Math.min(2, nguyet.diem / 3)));
  he.push({ he: 'Bát Tự', items: bti });

  // Chiêm tinh
  var ci = C.ctL.gocGac.slice(), h4 = ct.hanhTinh.filter(function (p) { return p.nha === 4; }).map(function (p) { return p.key; });
  var gA = 0, aA = 0, tA = 0;
  if (h4.indexOf('jupiter') >= 0) { gA += 1; aA += 0.5; } if (h4.indexOf('venus') >= 0) { gA += 0.7; aA += 0.7; }
  if (h4.indexOf('saturn') >= 0) { gA -= 0.8; aA -= 0.5; tA += 1; } if (h4.indexOf('mars') >= 0) { aA -= 0.8; tA += 0.5; }
  if (h4.indexOf('uranus') >= 0) { aA -= 0.5; tA += 1; } if (h4.indexOf('pluto') >= 0) { aA -= 0.8; } if (h4.indexOf('moon') >= 0) { aA += 0.5; }
  var ic = CT_CUNG[ct.cusp[3].cung], icR = ct.by[ic.chuCo];
  gA += ctDiemPham_(icR.pham) * 0.4;
  var mp = ctDiemPham_(ct.by.moon.pham); aA += mp * 0.4;
  ct.goc.forEach(function (g) {
    var ks = [g.a, g.b].sort().join('-');
    if (ks === 'moon-saturn') { aA += g.loai === 'tot' ? 0.3 : -0.9; if (g.loai !== 'tot') tA += 0.5; }
    if (ks === 'jupiter-moon') { aA += 0.7; gA += 0.4; }
    if (ks === 'saturn-sun' && g.loai !== 'tot') { aA -= 0.4; tA += 0.4; }
  });
  if (ct.by.moon.nha === 9 || ct.by.sun.nha === 9 || ct.by.moon.cung === 8) tA += 0.6;
  vote(giau, 'Chiêm tinh', Math.max(-2, Math.min(2, gA))); vote(am, 'Chiêm tinh', Math.max(-2, Math.min(2, aA))); vote(tuLap, 'Chiêm tinh', Math.min(2, tA));
  he.push({ he: 'Chiêm tinh', items: ci });

  // Thần số học
  var tsi = [], d6 = ts.bieuDo[6], d4 = ts.bieuDo[4], aT = 0, tT = 0;
  if (d6 >= 1) { aT += 0.5; tsi.push('Có số 6 trên biểu đồ: gắn bó, có trách nhiệm với gia đình.'); } else { tT += 0.5; tsi.push('Thiếu số 6: ít phụ thuộc gia đình, có xu hướng rời nhà sớm hoặc sống theo cách riêng.'); }
  if (d6 >= 3) { aT -= 0.5; tsi.push('◇ Nhiều số 6: lo toan gia đình quá mức, dễ căng thẳng với người thân.'); }
  if (d4 >= 1) tsi.push('Có số 4: được dạy nề nếp, trật tự từ nhỏ.');
  if (ts.duongDoi === 5 || ts.dinhCao[0].so === 5) { tT += 0.8; tsi.push('Số 5 ở chủ đạo/đỉnh 1: tuổi trẻ nhiều thay đổi, di chuyển, thích tự do khỏi khuôn khổ gia đình.'); }
  if (ts.dinhCao[0].thuThach === 6 || ts.dinhCao[0].thuThach === 4) { aT -= 0.3; tsi.push('◇ Thử thách tuổi trẻ ' + ts.dinhCao[0].thuThach + ': ' + TS_THU_THACH[ts.dinhCao[0].thuThach] + '.'); }
  vote(am, 'Thần số học', aT); vote(tuLap, 'Thần số học', tT);
  he.push({ he: 'Thần số học', items: tsi });
  if (C.hlL && C.hlL.daiVan[0]) {
    var v0 = C.hlL.daiVan[0];
    vote(giau, 'Hà Lạc', Math.max(-2, Math.min(2, v0.diem / 1.5)));
    he.push({ he: 'Hà Lạc', items: ['Vận hào đầu đời ' + v0.khoang + ': ' + v0.ten + ' – ' + v0.danhGia + '. ' + v0.items[1]] });
  }
  he.push({ he: 'Human Design', items: ['Human Design không luận gia cảnh; hồ sơ ' + C.hd.profile + ' cho biết cách bạn học từ môi trường tuổi nhỏ: ' + HD_LINE[C.hd.l2][0] + ' (vô thức) – ' + HD_LINE[C.hd.l2][1] + '.'] });

  function tb(arr) { var s = 0; arr.forEach(function (x) { s += x.v; }); return arr.length ? s / arr.length : 0; }
  function dong(arr, sg) { if (!sg) return 0; var n = 0, t = 0; arr.forEach(function (x) { if (Math.abs(x.v) > 0.2) { t++; if (thSign_(x.v) === sg || (sg && x.v * sg > 0)) n++; } }); return t ? Math.round(n / t * 100) : 0; }
  var G = tb(giau), A = tb(am), T = tb(tuLap);
  var kl = [];
  kl.push((G > 0.6 ? 'Gia cảnh khá giả, có nền tảng vật chất và nề nếp; được thừa hưởng điều kiện học hành tốt.' : G > 0.15 ? 'Gia cảnh trung bình khá, đủ đầy nhưng không dư dả; cha mẹ chịu khó vun vén.' : G > -0.4 ? 'Gia cảnh bình thường, có giai đoạn chật vật; phần lớn thành quả về sau do tự thân gây dựng.' : 'Xuất thân khó khăn hoặc gia đình biến động về kinh tế khi còn nhỏ; tuổi thơ sớm biết lo toan.') + ' (đồng thuận ' + dong(giau, thSign_(G)) + '%)');
  kl.push((A > 0.5 ? 'Tình cảm gia đình ấm áp, cha mẹ hòa thuận và quan tâm; là chỗ dựa tinh thần vững.' : A > 0 ? 'Gia đình tình cảm nhưng có khoảng cách thế hệ hoặc cha mẹ nghiêm; hiểu nhau hơn khi trưởng thành.' : A > -0.5 ? 'Quan hệ với cha mẹ có va chạm, khác quan điểm; cần chủ động hàn gắn.' : 'Tuổi nhỏ thiếu hơi ấm hoặc gia đình có biến cố (xa cách, bất hòa, mất mát); đây là vết thương cần chữa lành để trưởng thành.') + ' (đồng thuận ' + dong(am, thSign_(A)) + '%)');
  kl.push((T > 0.7 ? 'Dấu hiệu tự lập sớm/ly hương rất rõ: nhiều khả năng rời quê hoặc tự lo liệu từ trẻ, thành công ở nơi xa.' : T > 0.3 ? 'Có xu hướng tự lập, thay đổi chỗ ở vài lần; không phụ thuộc gia đình.' : 'Gắn bó quê hương – gia đình, dễ phát triển gần nơi sinh ra.'));
  return { tieuDe: 'Xuất thân – gia cảnh', diem: G + A, ketLuan: kl, nguon: he, chiSo: { giaCanh: G, tinhCam: A, tuLap: T } };
}

/* =========================================================
 * 2. VÓC DÁNG – DIỆN MẠO
 * ========================================================= */
function thVocDang_(C) {
  var tv = C.tv, bt = C.bt, ct = C.ct, he = [], phieu = [];
  function add(he, v, w) { phieu.push({ he: he, v: v, w: w }); }

  // Tử Vi – Mệnh (trọng số 2) và Thân (1)
  var tvi = [], menh = tv.palaces[tv.info.menh], than = tv.palaces[tv.info.than];
  [[menh, 'Mệnh', 2], [than, 'Thân', 1]].forEach(function (x) {
    if (x[1] === 'Thân' && tv.info.than === tv.info.menh) return;
    thChinhTinh_(tv, x[0]).forEach(function (s) {
      var S = TH_SAO[s.n]; if (!S) return;
      var ham = s.b === 'H', w = x[2] * (s.muon ? 0.5 : 1);
      var v = { cao: S.v.cao - (ham ? 0.5 : 0), beo: S.v.beo - (ham ? 0.5 : 0), mat: S.v.mat, da: S.v.da };
      add('Tử Vi', v, w / Math.max(1, x[0].chinh.length || 2));
      tvi.push(s.n + (s.b ? ' (' + s.b + ')' : '') + ' ở ' + x[1] + (s.muon ? ' (mượn cung đối vì vô chính diệu)' : '') + ': ' + S.hinh + (ham ? '; hãm địa nên dáng gầy/nhỏ hơn, kém tươi' : '') + '.');
    });
  });
  if (menh.tuan || menh.triet) tvi.push('Mệnh gặp ' + (menh.triet ? 'Triệt' : 'Tuần') + ': thân hình thường gọn/nhỏ hơn mô tả của chính tinh, thuở nhỏ dễ ốm.');
  if (thCoSao_(menh, 'Lộc Tồn') || thCoSao_(menh, 'Thiên Phủ')) add('Tử Vi', { beo: 0.5 }, 0.5);
  he.push({ he: 'Tử Vi', items: tvi });

  // Bát Tự – hình tướng ngũ hành
  var bti = [], nh = bt.nhatChuHanh, tro = Object.keys(bt.phanTram).sort(function (a, b) { return bt.phanTram[b] - bt.phanTram[a]; })[0];
  bti.push('Nhật chủ ' + bt.nhatChu + ' – ' + TH_NGU_HANH_HINH[nh].hinh + '.');
  add('Bát Tự', TH_NGU_HANH_HINH[nh].v, 1.5);
  if (tro !== nh) { bti.push('Ngũ hành vượng nhất trong tứ trụ là ' + tro + ' (' + bt.phanTram[tro] + '%) pha thêm nét ' + TH_NGU_HANH_HINH[tro].hinh + '.'); add('Bát Tự', TH_NGU_HANH_HINH[tro].v, 1); }
  bti.push(thVuong_(bt) > 0 ? 'Thân vượng: thể chất khỏe, xương cốt chắc, sức bền tốt.' : thVuong_(bt) < 0 ? 'Thân nhược: thể chất mảnh, dễ mệt khi làm quá sức; cần bồi bổ theo dụng thần ' + bt.goiY.dung + '.' : 'Thân trung hòa: thể chất cân đối.');
  if (thVuong_(bt) < 0) add('Bát Tự', { beo: -0.5 }, 0.7); else if (thVuong_(bt) > 0) add('Bát Tự', { beo: 0.3 }, 0.7);
  he.push({ he: 'Bát Tự', items: bti });

  // Chiêm tinh
  var S = CT_CUNG[ct.asc.cung];
  add('Chiêm tinh', S.hinh, 2);
  var chu = ct.by[ct.chuTinh]; add('Chiêm tinh', CT_CUNG[chu.cung].hinh, 0.8);
  ct.hanhTinh.forEach(function (p) {
    if (p.nha !== 1) return;
    if (p.key === 'jupiter') add('Chiêm tinh', { cao: 0.5, beo: 1 }, 1);
    if (p.key === 'saturn') add('Chiêm tinh', { beo: -1, da: 'ngăm' }, 1);
    if (p.key === 'moon') add('Chiêm tinh', { beo: 0.5, mat: 'tròn' }, 0.7);
    if (p.key === 'mars') add('Chiêm tinh', { da: 'hồng', beo: -0.3 }, 0.7);
    if (p.key === 'venus') add('Chiêm tinh', { da: 'sáng' }, 0.5);
  });
  he.push({ he: 'Chiêm tinh', items: C.ctL.ngoaiHinh });
  he.push({ he: 'Thần số học & Human Design', items: ['Hai hệ này không mô tả hình thể. Số thái độ ' + C.ts.thaiDo + ' (' + TS_SO[C.ts.thaiDo].tk + ') cho biết "thần thái" người khác cảm nhận lần đầu; Human Design loại ' + HD_TYPES[C.hd.loai].ten + ' có hào quang ' +
    ({ 'Generator': 'cởi mở, ấm, cuốn hút', 'Manifesting Generator': 'cởi mở, năng động, nhanh', 'Manifestor': 'khép kín, mạnh, gây ấn tượng', 'Projector': 'tập trung, "nhìn thấu" người đối diện', 'Reflector': 'nhẹ, phản chiếu, khó nắm bắt' }[C.hd.loai]) + '.'] });

  // Tổng hợp phiếu
  var tong = { cao: 0, beo: 0, wc: 0, wb: 0 }, mat = {}, da = {};
  phieu.forEach(function (p) {
    if (p.v.cao != null) { tong.cao += p.v.cao * p.w; tong.wc += p.w; }
    if (p.v.beo != null) { tong.beo += p.v.beo * p.w; tong.wb += p.w; }
    if (p.v.mat) mat[p.v.mat] = (mat[p.v.mat] || 0) + p.w;
    if (p.v.da) da[p.v.da] = (da[p.v.da] || 0) + p.w;
  });
  var cao = tong.wc ? tong.cao / tong.wc : 0, beo = tong.wb ? tong.beo / tong.wb : 0;
  function top(o) { return Object.keys(o).sort(function (a, b) { return o[b] - o[a]; }); }
  function pct(o, k) { var t = 0; Object.keys(o).forEach(function (x) { t += o[x]; }); return t ? Math.round(o[k] / t * 100) : 0; }
  function dongHe(key, sg) { // số hệ cùng chiều
    var hs = {}; phieu.forEach(function (p) { if (p.v[key] != null) { hs[p.he] = (hs[p.he] || 0) + p.v[key] * p.w; } });
    var n = 0, t = 0; Object.keys(hs).forEach(function (h) { if (Math.abs(hs[h]) > 0.1) { t++; if (hs[h] * sg > 0) n++; } });
    return t ? n + '/' + t + ' hệ' : '';
  }
  var gioi = C.tv.info.male;
  var tCao = cao > 0.45 ? 'Dáng cao hơn trung bình' : cao > 0.1 ? 'Chiều cao trung bình khá' : cao > -0.3 ? 'Chiều cao trung bình' : 'Dáng nhỏ nhắn, thấp hơn trung bình';
  var tBeo = beo > 0.55 ? 'thân hình đầy đặn, chắc thịt (dễ tăng cân khi trung niên)' : beo > 0.15 ? 'thân hình cân đối hơi đầy, săn chắc' : beo > -0.3 ? 'thân hình cân đối, gọn' : 'thân hình thon gầy, xương rõ';
  var m = top(mat), d = top(da);
  var kl = [
    tCao + ' (' + dongHe('cao', cao >= 0 ? 1 : -1) + ' cùng chiều), ' + tBeo + ' (' + dongHe('beo', beo >= 0 ? 1 : -1) + ' cùng chiều).',
    'Khuôn mặt: thiên về ' + m[0] + ' (' + pct(mat, m[0]) + '% phiếu)' + (m[1] ? ', có nét ' + m[1] : '') + '. Nước da: ' + ({ 'sáng': 'sáng/trắng', 'hồng': 'hồng hào', 'ngăm': 'ngăm/bánh mật' }[d[0]] || d[0]) + ' (' + pct(da, d[0]) + '% phiếu).',
    'Thần thái: ' + CT_CUNG[ct.asc.cung].asc.split(':')[1].split('.')[0].trim() + '; ' + (TH_SAO[(thChinhTinh_(tv, menh)[0] || {}).n] ? 'khí chất ' + (thChinhTinh_(tv, menh)[0].n) + ' – ' + TH_SAO[thChinhTinh_(tv, menh)[0].n].hinh.split(',').slice(-1)[0].trim() : 'khí chất hòa nhã') + '.',
    (gioi ? 'Với nam giới, ' : 'Với nữ giới, ') + 'các mô tả trên thể hiện rõ nhất ở độ tuổi 25–45; trước đó dáng thường gọn hơn, sau đó chịu ảnh hưởng thói quen sống.'
  ];
  return { tieuDe: 'Vóc dáng – diện mạo', ketLuan: kl, nguon: he, chiSo: { cao: Math.round(cao * 100) / 100, beo: Math.round(beo * 100) / 100, mat: m[0], da: d[0] } };
}

/* =========================================================
 * 3. ĐẶC ĐIỂM TRÊN CƠ THỂ & VÙNG CẦN GIỮ GÌN
 * ========================================================= */
function thCoThe_(C) {
  var tv = C.tv, bt = C.bt, ct = C.ct, hd = C.hd, he = [], dem = {};
  function tag(vung, h) { if (!vung) return; (dem[vung] = dem[vung] || {})[h] = true; }

  var tvi = [], menh = tv.palaces[tv.info.menh], tat = thCungTheoTen_(tv, 'Tật Ách'), than = tv.palaces[tv.info.than];
  [[menh, 'Mệnh'], [than, 'Thân'], [tat, 'Tật Ách']].forEach(function (x, i) {
    if (i === 1 && tv.info.than === tv.info.menh) return;
    thSaoCung_(x[0]).forEach(function (s) {
      var D = TH_DAU_HIEU[s.n]; if (!D || !D[0]) return;
      if (x[1] === 'Tật Ách' && ['Đào Hoa', 'Hồng Loan', 'Văn Xương', 'Văn Khúc', 'Tả Phù', 'Hữu Bật', 'Thiên Mã', 'Lực Sĩ'].indexOf(s.n) >= 0) return;
      tvi.push((x[1] === 'Tật Ách' ? '◇ ' : '') + s.n + ' ở ' + x[1] + ': ' + D[0] + '.'); tag(D[1], 'Tử Vi');
    });
    thSaoCung_(x[0]).forEach(function (s) { if (s.hoa === 'Kỵ' && TH_SAO[s.n]) { tvi.push('✗ ' + s.n + ' hóa Kỵ ở ' + x[1] + ': chú ý vùng ' + TH_SAO[s.n].bp.map(function (b) { return TH_VUNG[b]; }).join(', ') + '.'); TH_SAO[s.n].bp.forEach(function (b) { tag(b, 'Tử Vi'); }); } });
  });
  thChinhTinh_(tv, tat).forEach(function (s) { var S = TH_SAO[s.n]; if (!S) return; tvi.push('Chính tinh cung Tật Ách ' + s.n + (s.muon ? ' (mượn)' : '') + ' → bộ phận cần giữ: ' + S.bp.map(function (b) { return TH_VUNG[b]; }).join(', ') + '.'); S.bp.forEach(function (b) { tag(b, 'Tử Vi'); }); });
  if (!tvi.length) tvi.push('Mệnh – Tật không có sát tinh đánh dấu: cơ thể ít tì vết nổi bật.');
  he.push({ he: 'Tử Vi', items: tvi });

  // Bát Tự: ngũ hành thái quá / bất cập
  var bti = [], pt = bt.phanTram, HB = { 'Mộc': ['gan', 'mat'], 'Hỏa': ['tim', 'mau'], 'Thổ': ['daDay'], 'Kim': ['phoi', 'da'], 'Thủy': ['than', 'tai', 'xuong'] };
  var TEN_BP = { 'Mộc': 'gan – mật, gân, mắt', 'Hỏa': 'tim, mạch máu, lưỡi, huyết áp', 'Thổ': 'tỳ vị (dạ dày – tiêu hóa), cơ bắp, miệng', 'Kim': 'phổi, đại tràng, da, mũi', 'Thủy': 'thận – bàng quang, tai, xương, tóc' };
  Object.keys(pt).forEach(function (h) {
    if (pt[h] >= 32) { bti.push('✗ ' + h + ' thái quá (' + pt[h] + '%): ' + TEN_BP[h] + ' dễ "nóng" – viêm, cường, quá tải.'); HB[h].forEach(function (b) { tag(b, 'Bát Tự'); }); }
    if (pt[h] <= 8) { bti.push('✗ ' + h + ' bất cập (' + pt[h] + '%): ' + TEN_BP[h] + ' là điểm yếu bẩm sinh.'); HB[h].forEach(function (b) { tag(b, 'Bát Tự'); }); }
  });
  (C.btct.sucKhoe || []).slice(0, 3).forEach(function (x) { if (!/thái quá|bất cập/.test(String(x))) bti.push(String(x)); });
  he.push({ he: 'Bát Tự', items: bti });

  // Chiêm tinh
  var ci = C.ctL.coThe.slice();
  CT_CUNG[ct.by.mars.cung].vung.forEach(function (v) { tag(v, 'Chiêm tinh'); });
  CT_CUNG[ct.by.saturn.cung].vung.forEach(function (v) { tag(v, 'Chiêm tinh'); });
  CT_CUNG[ct.asc.cung].vung.forEach(function (v) { tag(v, 'Chiêm tinh'); });
  CT_CUNG[ct.cusp[5].cung].vung.forEach(function (v) { tag(v, 'Chiêm tinh'); });
  he.push({ he: 'Chiêm tinh', items: ci });

  // Human Design
  // chỉ Lá lách (miễn dịch) và Gốc (tuyến thượng thận) được tính phiếu – các trung tâm khác mở rất phổ biến nên chỉ ghi chú
  var hi = [], HM = { spleen: ['mienDich'], root: ['than'] };
  ['spleen', 'sacral', 'solar', 'heart', 'root'].forEach(function (c) {
    if (!hd.dinh[c]) { hi.push('□ ' + HD_CENTERS[c].ten + ' mở ↔ ' + HD_CENTER_BIO[c] + ': ' + HD_CENTER_Y[c][1]); (HM[c] || []).forEach(function (b) { tag(b, 'Human Design'); }); }
  });
  if (!hi.length) hi.push('Các trung tâm động cơ và lá lách đều xác định – thể chất vận hành ổn định theo HD.');
  he.push({ he: 'Human Design', items: hi });

  // Thần số học
  var ti = [];
  if (C.ts.bieuDo[5] === 0) ti.push('Thiếu số 5 (trung tâm biểu đồ): dễ mất cân bằng năng lượng, cần vận động đều.');
  if (C.ts.bieuDo[2] >= 3) { ti.push('Nhiều số 2: hệ thần kinh nhạy, dễ mất ngủ khi căng thẳng.'); tag('thanKinh', 'Thần số học'); }
  if (C.ts.bieuDo[3] >= 3) { ti.push('Nhiều số 3: đầu óc hoạt động liên tục, dễ đau đầu/căng thẳng.'); tag('thanKinh', 'Thần số học'); }
  if (C.ts.bieuDo[4] === 0 && C.ts.bieuDo[1] && C.ts.bieuDo[7] === 0) ti.push('Mũi tên trống 1-4-7: cơ thể dễ "lộn xộn" nhịp sinh hoạt.');
  if (ti.length) he.push({ he: 'Thần số học', items: ti });

  var xep = Object.keys(dem).map(function (k) { return { k: k, n: Object.keys(dem[k]).length, he: Object.keys(dem[k]) }; }).sort(function (a, b) { return b.n - a.n; });
  var kl = [];
  var nhieu = xep.filter(function (x) { return x.n >= 2; });
  if (nhieu.length) nhieu.slice(0, 5).forEach(function (x) { kl.push('✗ ' + TH_VUNG[x.k] + ' – được ' + x.n + ' hệ cùng chỉ ra (' + x.he.join(', ') + '): vùng dễ có dấu vết (sẹo, nốt ruồi, bớt) hoặc cần chăm sóc sức khỏe lâu dài.'); });
  else kl.push('Không có vùng cơ thể nào được từ hai hệ trở lên cùng chỉ ra – thể chất tương đối cân bằng.');
  var dauHieu = [];
  thSaoCung_(menh).forEach(function (s) { if (TH_DAU_HIEU[s.n] && TH_DAU_HIEU[s.n][0] && ['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh', 'Thiên Hình', 'Hóa Kỵ', 'Văn Xương', 'Văn Khúc', 'Đào Hoa'].indexOf(s.n) >= 0) dauHieu.push(TH_DAU_HIEU[s.n][0]); });
  if (ct.by.mars.nha === 1 || ctKhoang_(ct.by.mars.lon, ct.asc.lon) < 8) dauHieu.push('sẹo/vết đỏ vùng đầu – mặt (Sao Hỏa sát cung Mọc)');
  if (ct.by.saturn.nha === 1) dauHieu.push('nốt ruồi/đốm sẫm hoặc xương hàm – gò má rõ (Sao Thổ nhà 1)');
  kl.push(dauHieu.length ? 'Dấu hiệu dễ nhận ra: ' + dauHieu.join('; ') + '.' : 'Không có dấu hiệu tì vết mạnh trên Mệnh; nét nổi bật là vùng ' + CT_CUNG[ct.asc.cung].bp + ' (theo cung Mọc).');
  kl.push('Sẹo/vết thương dễ gặp ở vùng ' + CT_CUNG[ct.by.mars.cung].bp + ' (Sao Hỏa ' + ct.by.mars.cungTen + '); điểm yếu mạn tính ở ' + CT_CUNG[ct.by.saturn.cung].bp + ' (Sao Thổ ' + ct.by.saturn.cungTen + ').');
  return { tieuDe: 'Đặc điểm cơ thể & sức khỏe', ketLuan: kl, nguon: he, vung: xep.slice(0, 8).map(function (x) { return { ten: TH_VUNG[x.k], n: x.n, he: x.he }; }) };
}

/* =========================================================
 * 4. TÍNH CÁCH – 5 TRỤC
 * ========================================================= */
function thTinhCach_(C) {
  var tv = C.tv, bt = C.bt, ct = C.ct, ts = C.ts, hd = C.hd;
  var heV = {}, he = [];
  function cong(h, v, w) { var a = heV[h] = heV[h] || { s: [0, 0, 0, 0, 0], w: 0 }; for (var i = 0; i < 5; i++) a.s[i] += v[i] * w; a.w += w; }

  // Tử Vi
  var menh = tv.palaces[tv.info.menh], than = tv.palaces[tv.info.than], tvi = [];
  thChinhTinh_(tv, menh).forEach(function (s) {
    var S = TH_SAO[s.n]; if (!S) return; cong('Tử Vi', S.tc, s.muon ? 1 : 2);
    tvi.push((LUAN_CHINH_TINH_MENH[s.n] || s.n) + (s.muon ? ' (Mệnh vô chính diệu, mượn sao cung đối – tính cách linh hoạt, chịu ảnh hưởng môi trường.)' : ''));
  });
  if (tv.info.than !== tv.info.menh) thChinhTinh_(tv, than).forEach(function (s) { var S = TH_SAO[s.n]; if (S) { cong('Tử Vi', S.tc, 0.7); tvi.push('Thân cư ' + tv.info.thanCu + ' có ' + s.n + ': nửa sau cuộc đời tính cách nghiêng về ' + ['hướng ngoại', 'lý trí', 'kiên định', 'độc lập', 'thực tế'][S.tc.map(Math.abs).indexOf(Math.max.apply(null, S.tc.map(Math.abs)))] + '.'); } });
  if (thCoSao_(menh, 'Hóa Kỵ')) { cong('Tử Vi', [-0.7, 0, 0, 0, 0], 1); tvi.push('Hóa Kỵ ở Mệnh: hay suy nghĩ, ôm lo lắng, cầu toàn.'); }
  if (thCoSao_(menh, 'Kình Dương') || thCoSao_(menh, 'Đà La')) { cong('Tử Vi', [0.5, 0, -0.5, 1, 0], 0.7); tvi.push('Kình/Đà ở Mệnh: cứng rắn, quyết liệt, không chịu thua.'); }
  if (thCoSao_(menh, 'Văn Xương') || thCoSao_(menh, 'Văn Khúc')) { cong('Tử Vi', [0, 0.7, 0, 0, -0.3], 0.7); tvi.push('Xương/Khúc ở Mệnh: thông minh, ưa học, có khiếu văn chương.'); }
  if (thCoSao_(menh, 'Thiên Không') || thCoSao_(menh, 'Địa Không') || thCoSao_(menh, 'Địa Kiếp')) { cong('Tử Vi', [0, 0, -0.7, 0.3, -0.8], 0.7); tvi.push('Không/Kiếp ở Mệnh: tư tưởng khác người, lúc lên lúc xuống, thiên hướng triết lý.'); }
  he.push({ he: 'Tử Vi', items: tvi });

  // Bát Tự
  var bti = [TH_CAN_MO[bt.nhatChuCan] + ' (' + bt.cuong + ').'];
  cong('Bát Tự', TH_CAN_TC[bt.nhatChuCan], 2);
  var nhom = { ty: 0, thuc: 0, tai: 0, quan: 0, an: 0 };
  bt.pillars.forEach(function (p, i) {
    [p.thapThan].concat((p.tangCan || []).slice(0, 1).map(function (t) { return t.thapThan; })).forEach(function (t) {
      if (i === 2 && t === p.thapThan) return;
      if (/Tỷ|Kiếp/.test(t)) nhom.ty++; else if (/Thực|Thương/.test(t)) nhom.thuc++; else if (/Tài/.test(t)) nhom.tai++; else if (/Quan|Sát/.test(t)) nhom.quan++; else if (/Ấn/.test(t)) nhom.an++;
    });
  });
  var NV = { ty: [0.5, 0, 0, 1.5, 0.3], thuc: [1, -0.5, -0.7, 0.3, -0.3], tai: [0.3, 0.5, 0, 0, 1.5], quan: [0, 0.7, 1, 0.3, 0.5], an: [-1, 0.3, 0.5, -0.5, -1] };
  var NT = { ty: 'Tỷ Kiếp (tự lập, cạnh tranh, trọng bạn bè)', thuc: 'Thực Thương (sáng tạo, biểu đạt, phá cách)', tai: 'Tài tinh (thực tế, giỏi xoay xở vật chất)', quan: 'Quan Sát (kỷ luật, trách nhiệm, trọng danh dự)', an: 'Ấn tinh (ham học, trầm tư, nhân hậu, hướng nội)' };
  Object.keys(nhom).forEach(function (k) { if (nhom[k] >= 2) { cong('Bát Tự', NV[k], nhom[k] * 0.4); bti.push('Thập thần nổi bật: ' + NT[k] + ' × ' + nhom[k] + '.'); } });
  if (thVuong_(bt) > 0) cong('Bát Tự', [0.3, 0, 0.3, 0.8, 0], 1); else if (thVuong_(bt) < 0) cong('Bát Tự', [-0.3, 0, 0, -0.8, 0], 1);
  he.push({ he: 'Bát Tự', items: bti.concat((C.btct.tinhCach || []).slice(0, 3)) });

  // Chiêm tinh
  var tong = 0; Object.keys(ct.nguyenTo).forEach(function (k) { tong += ct.nguyenTo[k]; });
  Object.keys(ct.nguyenTo).forEach(function (k) { var dev = ct.nguyenTo[k] / tong - 0.25; cong('Chiêm tinh', TH_NT_TC[k], dev * 8); });
  var tt = 0; Object.keys(ct.tinhChat).forEach(function (k) { tt += ct.tinhChat[k]; });
  cong('Chiêm tinh', [0, 0, -1, 1.5, 0], (ct.tinhChat['Tiên phong'] / tt - 0.33) * 5);
  cong('Chiêm tinh', [0, 0, 2, 0, 0.3], (ct.tinhChat['Kiên định'] / tt - 0.33) * 5);
  cong('Chiêm tinh', [0.3, 0, -2, -0.5, 0], (ct.tinhChat['Linh hoạt'] / tt - 0.33) * 5);
  ['sun', 'moon', 'asc'].forEach(function (k) { cong('Chiêm tinh', TH_NT_TC[CT_CUNG[ct.by[k].cung].nt], 0.8); });
  he.push({ he: 'Chiêm tinh', items: C.ctL.boBa.map(function (b) { return b.tieuDe + ': ' + b.items[0]; }) });

  // Thần số học
  cong('Thần số học', TH_SO_TC[ts.duongDoi], 2);
  cong('Thần số học', TH_SO_TC[ts.ngaySinh] || TH_SO_TC[tsGoc_(ts.ngaySinh)], 0.7);
  if (ts.coTen) { cong('Thần số học', TH_SO_TC[ts.linhHon], 0.8); cong('Thần số học', TH_SO_TC[ts.suMenh], 0.8); }
  ts.muiTen.forEach(function (a) {
    var MT = { 'Mũi tên Ý chí': [0, 0, 1, 0.5, 0], 'Mũi tên Quyết tâm': [0, 0, 1, 0.5, 0], 'Mũi tên Hoạt động': [0.7, 0, -0.3, 0.3, 0.5], 'Mũi tên Kế hoạch': [0, 1, 0.5, 0, 0.3], 'Mũi tên Trí tuệ': [0, 1, 0, 0, -0.3],
      'Mũi tên Cân bằng cảm xúc': [0, -0.3, 0.7, 0, 0], 'Mũi tên Thực tế (Thể chất)': [0, 0, 0.5, 0, 1], 'Mũi tên Tâm linh (Nhạy bén)': [-0.3, -0.5, 0, 0, -1],
      'Mũi tên Uất giận (trống 4-5-6)': [-0.5, -0.5, 0, 0, 0], 'Mũi tên Thụ động (trống 7-8-9)': [-0.7, 0, 0.3, -0.5, 0], 'Mũi tên Nhạy cảm (trống 2-5-8)': [-0.5, -0.7, -0.3, 0, 0],
      'Mũi tên Trì hoãn (trống 1-5-9)': [0, 0, -0.5, -0.3, 0], 'Mũi tên Hoài nghi (trống 3-5-7)': [0, 0.7, 0, 0, 0.7], 'Mũi tên Hỗn loạn (trống 1-4-7)': [0, 0, -0.7, 0, -0.7], 'Mũi tên Trí nhớ ngắn hạn (trống 3-6-9)': [0, -0.5, 0, 0, 0.5] }[a.ten];
    if (MT) cong('Thần số học', MT, 0.6);
  });
  he.push({ he: 'Thần số học', items: ['Số chủ đạo ' + ts.duongDoi + ' – ' + TS_SO[ts.duongDoi].ten + ': ' + TS_SO[ts.duongDoi].manh + '.', 'Mặt cần rèn: ' + TS_SO[ts.duongDoi].yeu + '.'].concat(ts.coTen ? ['Linh hồn ' + ts.linhHon + ' (' + TS_SO[ts.linhHon].tk + ') · Nhân cách ' + ts.nhanCach + ' (' + TS_SO[ts.nhanCach].tk + ').'] : []) });

  // Human Design
  cong('Human Design', TH_HD_TYPE_TC[hd.loai], 2);
  cong('Human Design', TH_HD_AUTH_TC[hd.thamQuyen], 1.2);
  var LV = { 1: [0, 1, 0.3, 0, 0.3], 2: [-1, 0, 0, 0, 0], 3: [0.3, 0, -1, 0, 0.5], 4: [1, 0, 0.3, -0.5, 0], 5: [0, 0, 0, 0.7, 0.5], 6: [0, 0.3, 0.5, 0, -0.7] };
  cong('Human Design', LV[hd.l1], 0.8); cong('Human Design', LV[hd.l2], 0.5);
  if (hd.dinh.head && hd.dinh.ajna) cong('Human Design', [0, 1, 0.3, 0, 0], 0.7);
  if (!hd.dinh.g) cong('Human Design', [0.3, 0, -0.5, -0.3, 0], 0.5);
  he.push({ he: 'Human Design', items: [HD_TYPES[hd.loai].ten + ' · ' + HD_AUTH[hd.thamQuyen].ten + ' · Hồ sơ ' + hd.profile + ' (' + HD_LINE[hd.l1][0] + ' / ' + HD_LINE[hd.l2][0] + ').', HD_TYPES[hd.loai].moTa] });

  // Hà Lạc
  if (C.hl) {
    var TQ = C.hl.tien, HQ = C.hl.hau;
    cong('Hà Lạc', TH_QUAI_TC[TQ.tren], 1); cong('Hà Lạc', TH_QUAI_TC[TQ.duoi], 1.2); cong('Hà Lạc', TH_QUAI_TC[HQ.duoi], 0.5);
    he.push({ he: 'Hà Lạc', items: ['Quẻ Tiên thiên ' + TQ.ten + ': ' + TQ.y + '.', 'Nội quái ' + TQ.duoi + ' (' + HL_QUAI[TQ.duoi].y + ') là bản chất bên trong; ngoại quái ' + TQ.tren + ' (' + HL_QUAI[TQ.tren].y + ') là cách bạn thể hiện ra ngoài.'] });
  }
  // Tính trục
  var hs = Object.keys(heV), truc = TH_TRUC.map(function (T, i) {
    var vals = hs.map(function (h) { return { he: h, v: heV[h].s[i] / heV[h].w }; });
    var tb = 0; vals.forEach(function (x) { tb += x.v; }); tb /= vals.length || 1;
    var sg = thSign_(tb), dong = vals.filter(function (x) { return Math.abs(x.v) > 0.15 && x.v * tb > 0; }).map(function (x) { return x.he; });
    var nguoc = vals.filter(function (x) { return x.v * tb < 0 && Math.abs(x.v) > 0.35; }).map(function (x) { return x.he; });
    var mo = sg > 0 ? T.duong : sg < 0 ? T.am : 'Cân bằng giữa hai cực (' + T.duong.split(':')[0] + ' / ' + T.am.split(':')[0] + ') – linh hoạt theo hoàn cảnh';
    var muc = Math.abs(tb) > 1 ? 'rất rõ' : Math.abs(tb) > 0.6 ? 'rõ' : Math.abs(tb) > 0.35 ? 'nhẹ' : '';
    return { ten: T.ten, gt: Math.round(tb * 100) / 100, moTa: mo + (muc ? ' (mức ' + muc + ')' : ''), dong: dong, nguoc: nguoc,
      tyLe: vals.length ? Math.round(dong.length / vals.length * 100) : 0, chiTiet: vals.map(function (x) { return x.he + ' ' + (x.v >= 0 ? '+' : '') + (Math.round(x.v * 10) / 10); }).join(' · ') };
  });
  var kl = truc.filter(function (t) { return Math.abs(t.gt) > 0.35; }).sort(function (a, b) { return b.tyLe - a.tyLe || Math.abs(b.gt) - Math.abs(a.gt); }).map(function (t) {
    return (t.tyLe >= 60 ? '✓ ' : '◇ ') + t.moTa + ' – ' + t.dong.length + '/' + hs.length + ' hệ đồng thuận (' + t.dong.join(', ') + ')' + (t.nguoc.length ? '; riêng ' + t.nguoc.join(', ') + ' cho thấy mặt ngược lại – đây là chiều sâu/mâu thuẫn nội tâm.' : '.');
  });
  truc.forEach(function (t) { if (Math.abs(t.gt) <= 0.35 && t.nguoc.length >= 2) kl.push('◇ ' + t.ten + ': các hệ chia đôi (' + t.chiTiet + ') – con người hai mặt ở trục này: biểu hiện ra ngoài và cảm nhận bên trong có thể khác nhau.'); });
  // Chân dung
  var menhSao = thChinhTinh_(tv, menh).map(function (s) { return s.n; }).join(' – ') || 'vô chính diệu';
  var chanDung = 'Chân dung: mang Mệnh ' + menhSao + ', nhật chủ ' + bt.nhatChu + ', Mặt Trời ' + ct.by.sun.cungTen + ' – Mặt Trăng ' + ct.by.moon.cungTen + ' – Mọc ' + ct.asc.cungTen +
    ', số chủ đạo ' + ts.duongDoi + ', ' + HD_TYPES[hd.loai].ten.split(' (')[0] + ' ' + hd.profile + '. ' +
    'Bên ngoài người khác thấy ' + CT_CUNG[ct.asc.cung].tuKhoa + ' (cung Mọc) và ' + TS_SO[ts.thaiDo].tk.split(',').slice(0, 2).join(',') + ' (số thái độ); bên trong là ' + CT_CUNG[ct.by.moon.cung].tuKhoa + ' (Mặt Trăng)' +
    (ts.coTen ? ' cùng khát khao ' + TS_SO[ts.linhHon].tk.split(',').slice(0, 2).join(',') + ' (số linh hồn)' : '') + '.';
  var manh = [], yeu = [];
  manh.push(TS_SO[ts.duongDoi].manh); manh.push(CT_CUNG[ct.by.sun.cung].tuKhoa);
  yeu.push(TS_SO[ts.duongDoi].yeu); yeu.push(CT_CUNG[ct.by.sun.cung].bong); yeu.push('Dấu hiệu lệch hướng theo HD: ' + HD_TYPES[hd.loai].saiLech.toLowerCase());
  return { tieuDe: 'Tính cách', ketLuan: [chanDung].concat(kl), truc: truc, nguon: he, manh: manh, yeu: yeu, soHe: hs.length };
}

/* =========================================================
 * 5. ĐƯỜNG ĐỜI – NGHỀ NGHIỆP – CÁC CHẶNG ĐỜI
 * ========================================================= */
function thNghe_(C) {
  var tv = C.tv, bt = C.bt, ct = C.ct, ts = C.ts, hd = C.hd, dem = {};
  function add(ks, he, w) { (ks || []).forEach(function (k) { var o = dem[k] = dem[k] || { d: 0, he: {} }; o.d += w; o.he[he] = true; }); }
  var ql = thCungTheoTen_(tv, 'Quan Lộc');
  thChinhTinh_(tv, ql).forEach(function (s) { if (TH_SAO[s.n]) add(TH_SAO[s.n].nghe, 'Tử Vi', 1.5); });
  thChinhTinh_(tv, tv.palaces[tv.info.menh]).forEach(function (s) { if (TH_SAO[s.n]) add(TH_SAO[s.n].nghe, 'Tử Vi', 1); });
  add(TH_NGHE_HANH[bt.goiY.dung], 'Bát Tự', 1.5);
  (bt.goiY.hy || []).slice(1, 2).forEach(function (h) { add(TH_NGHE_HANH[h], 'Bát Tự', 0.7); });
  add(TH_NGHE_CUNG[ct.mc.cung], 'Chiêm tinh', 1.5); add(TH_NGHE_CUNG[ct.by.sun.cung], 'Chiêm tinh', 0.8);
  add(TH_NGHE_SO[ts.duongDoi], 'Thần số học', 1.5); if (ts.coTen) add(TH_NGHE_SO[ts.suMenh], 'Thần số học', 1);
  add(TH_NGHE_HD[hd.loai], 'Human Design', 1);
  if (C.hl) { add(TH_QUAI_NGHE[C.hl.tien.tren], 'Hà Lạc', 1); add(TH_QUAI_NGHE[C.hl.tien.duoi], 'Hà Lạc', 0.7); }
  hd.kenh.forEach(function (k) { add(TH_NGHE_KENH[[k.a, k.b].sort(function (x, y) { return x - y; }).join('-')], 'Human Design', 0.8); });
  return Object.keys(dem).map(function (k) { return { k: k, ten: TH_NGHE[k], diem: Math.round(dem[k].d * 10) / 10, he: Object.keys(dem[k].he) }; })
    .sort(function (a, b) { return b.he.length - a.he.length || b.diem - a.diem; });
}

function thDuongDoi_(C) {
  var tv = C.tv, bt = C.bt, ts = C.ts, hd = C.hd, dd = C.duDoan, y0 = tv.info.solar.year;
  var chang = (C.daiVanTV || []).filter(function (dv) { return +String(dv.khoang).match(/\d+/)[0] <= 85; }).map(function (dv) {
    var m = String(dv.khoang).match(/(\d+)\D+(\d+)/), a = +m[1], b = +m[2];
    var btv = bt.daiVan.filter(function (x) { return x.tuoi <= b && x.tuoi + 9 >= a; });
    var btD = btv.length ? btv.reduce(function (s, x) { return s + thDGVan_(x.danhGia); }, 0) / btv.length : 0;
    var pin = ts.dinhCao.filter(function (p) { return p.tu <= b && p.den >= a; });
    var chuKy = (C.ct.chuKy || []).filter(function (c) { return c.tuoi >= a && c.tuoi < b + 1 && /hồi quy|đối/.test(c.ten); });
    var suKien = [];
    Object.keys(dd.chuDe).forEach(function (k) {
      var CD = dd.chuDe[k];
      (CD.top || []).forEach(function (t) { if (t.tuoi >= a && t.tuoi <= b) suKien.push({ nam: t.nam, tuoi: t.tuoi, ten: CD.ten, loai: CD.loai }); });
    });
    suKien.sort(function (x, y) { return x.nam - y.nam; });
    var hlv = (C.hlL ? C.hlL.daiVan : []).filter(function (x) { var t = String(x.khoang).match(/(\d+)\D+(\d+)/); return +t[1] <= b && +t[2] >= a; });
    var hlD = hlv.length ? hlv.reduce(function (s0, x) { return s0 + x.diem; }, 0) / hlv.length : 0;
    var diem = dv.diem * 0.5 + btD * 1.4 + hlD * 0.8;
    var lines = [];
    lines.push('Tử Vi: đại hạn cung ' + dv.cung + ' (' + dv.canChi + ', ' + (dv.sao || 'VCD') + ') – ' + dv.danhGia + ' (điểm ' + dv.diem + ').');
    if (btv.length) lines.push('Bát Tự: ' + btv.map(function (x) { return 'đại vận ' + x.canChi + ' từ ' + x.tuoi + ' tuổi (' + x.thapThan + ') – ' + x.danhGia; }).join('; ') + '.');
    if (pin.length) lines.push('Thần số học: ' + pin.map(function (p) { return 'đỉnh cao số ' + p.so + ' (' + TS_SO[p.so].tk.split(',').slice(0, 2).join(',') + ')' + ', thử thách ' + p.thuThach; }).join('; ') + '.');
    if (hlv.length) lines.push('Hà Lạc: ' + hlv.map(function (x) { return x.ten + ' ' + x.khoang + ' – ' + x.danhGia + ' (quẻ biến ' + x.items[1].split(' – ')[0].replace('Quẻ biến của vận: ', '') + ')'; }).join('; ') + '.');
    if (chuKy.length) lines.push('Chiêm tinh: ' + chuKy.map(function (c) { return c.ten + ' ~' + Math.round(c.tuoi) + ' tuổi (' + c.nam + ')'; }).join('; ') + '.');
    if (a <= 30 && b >= 27) lines.push('Human Design: Sao Thổ hồi quy ~29 tuổi – bắt đầu sống theo chiến lược ' + HD_TYPES[hd.loai].chienLuoc.toLowerCase() + '.');
    if (a <= 50 && b >= 48) lines.push('Human Design: Chiron hồi quy ~50 tuổi – bước vào giai đoạn "hình mẫu".' + (hd.l1 === 6 || hd.l2 === 6 ? ' Với hào 6, đây là lúc "xuống mái nhà" làm gương.' : ''));
    var tot = suKien.filter(function (s) { return s.loai !== 'xau'; }), xau = suKien.filter(function (s) { return s.loai === 'xau'; });
    if (tot.length) lines.push('✓ Năm nổi bật: ' + tot.slice(0, 6).map(function (s) { return s.nam + ' (' + s.ten.toLowerCase() + ')'; }).join(', ') + '.');
    if (xau.length) lines.push('✗ Năm cần phòng: ' + xau.slice(0, 5).map(function (s) { return s.nam + ' (' + s.ten.toLowerCase() + ')'; }).join(', ') + '.');
    var dg = diem >= 4 ? 'Rất thuận' : diem >= 2 ? 'Thuận' : diem >= 0 ? 'Bình' : diem >= -2 ? 'Nhiều thử thách' : 'Gian nan';
    return { khoang: dv.khoang, nam: dv.nam, diem: Math.round(diem * 10) / 10, danhGia: dg, isNow: dv.isNow, lines: lines, dongThuan: (dv.diem >= 0) === (btD >= 0) };
  });
  // Chủ đề đời
  var cc = (tv.luanGiai.cachCuc || []).filter(function (c) { return c.tot === true; }).map(function (c) { return c.ten; }).slice(0, 3);
  var chuDe = [
    'Tử Vi: Mệnh ' + (tv.palaces[tv.info.menh].chinh.map(function (s) { return s.n; }).join(' – ') || 'vô chính diệu') + ', Thân cư ' + tv.info.thanCu + (cc.length ? '; cách cục đẹp: ' + cc.join(', ') : '') + '.',
    'Bát Tự: ' + C.btct.cachCuc.ten + ' (' + C.btct.cachCuc.loai + ') – ' + C.btct.cachCuc.ketLuan,
    'Chiêm tinh: Mặt Trời ' + C.ct.by.sun.cungTen + ' nhà ' + C.ct.by.sun.nha + '; Nút Bắc ' + C.ct.by.northNode.cungTen + ' nhà ' + C.ct.by.northNode.nha + ' → hướng trưởng thành: ' + CT_CUNG[C.ct.by.northNode.cung].tuKhoa + ', qua lĩnh vực ' + CT_NHA[C.ct.by.northNode.nha - 1].y + '.',
    'Thần số học: số chủ đạo ' + ts.duongDoi + ' – bài học "' + TS_SO[ts.duongDoi].bh + '"' + (ts.coTen ? '; sứ mệnh ' + ts.suMenh + ' (' + TS_SO[ts.suMenh].tk + ')' : '') + '.',
    'Human Design: giao điểm hóa thân ' + hd.cross + ' – ' + hd.goc + '; chủ đề ý thức cổng ' + hd.act.p.sun.gate + ' "' + HD_GATE_TEN[hd.act.p.sun.gate] + '".'
  ];
  var tot3 = chang.slice().sort(function (a, b) { return b.diem - a.diem; }).slice(0, 3), xau2 = chang.slice().sort(function (a, b) { return a.diem - b.diem; }).slice(0, 2);
  var kl = [
    'Giai đoạn rực rỡ nhất (các hệ cùng xác nhận): ' + tot3.map(function (c) { return c.khoang + ' (' + c.nam + ')'; }).join(', ') + '.',
    'Giai đoạn nhiều thử thách: ' + xau2.map(function (c) { return c.khoang + ' (' + c.nam + ')'; }).join(', ') + ' – nên giữ an toàn tài chính – sức khỏe, học hỏi và chuẩn bị.',
    'Bước ngoặt trưởng thành: Sao Thổ hồi quy ' + ((C.ct.chuKy.filter(function (c) { return c.ten === 'Sao Thổ hồi quy'; })[0] || {}).nam || '~' + (y0 + 29)) + '; khủng hoảng – thức tỉnh giữa đời (Thiên Vương đối) ' + ((C.ct.chuKy.filter(function (c) { return /Thiên Vương đối/.test(c.ten); })[0] || {}).nam || '~' + (y0 + 42)) + '; đỉnh cao thần số thứ 2 bắt đầu ' + (y0 + ts.dinhCao[1].tu) + '.'
  ];
  return { tieuDe: 'Đường đời', chuDe: chuDe, chang: chang, ketLuan: kl };
}


/* =========================================================
 * 6. NĂM ĐANG XEM THEO 5 HỆ
 * ========================================================= */
var TH_NAM_CN = { 1: 1, 2: 0, 3: 0.8, 4: -0.4, 5: 0.4, 6: 0.5, 7: -0.5, 8: 1.4, 9: -0.4 };
function thNamNay_(C, ctL) {
  var tv = C.tv, bt = C.bt, ts = C.ts, dd = C.duDoan, vy = tv.info.viewYear, idx = vy - dd.namBatDau, he = [], diem = [];
  var tot = ['taiLoc', 'quanLoc', 'ketHon', 'sinhCon'], xau = ['sucKhoe', 'taiChinh', 'giaDao'], linhVuc = [];
  var sT = 0, sX = 0;
  Object.keys(dd.chuDe).forEach(function (k) {
    var cd = dd.chuDe[k], v = (cd.diem || [])[idx]; if (v == null) return;
    linhVuc.push({ ten: cd.ten, loai: cd.loai, diem: v });
    if (tot.indexOf(k) >= 0) sT += v / tot.length; else sX += v / xau.length;
  });
  var tvD = Math.max(-2, Math.min(2, (sT - sX) / 2));
  he.push({ he: 'Tử Vi', items: (tv.luanGiai.han || []).concat(linhVuc.map(function (l) { return (l.loai === 'xau' ? (l.diem > 1.5 ? '✗ ' : '') : (l.diem > 1.5 ? '✓ ' : '')) + l.ten + ': ' + l.diem; })) });
  diem.push({ he: 'Tử Vi', v: tvD });
  var ln = bt.luuNien; he.push({ he: 'Bát Tự', items: ['Lưu niên ' + ln.canChi + ': can ' + ln.thapThan + ', chi ' + ln.chiThapThan + ' – ' + ln.danhGia + '.'].concat(ln.ghiChu || []) });
  diem.push({ he: 'Bát Tự', v: thDGVan_(ln.danhGia) });
  he.push({ he: 'Thần số học', items: ['Năm cá nhân ' + ts.namNay + ': ' + TS_NAM[ts.namNay]] });
  diem.push({ he: 'Thần số học', v: TH_NAM_CN[ts.namNay] });
  var ai = ctL.namXem.items, aS = 0; ai.forEach(function (x) { if (x.charAt(0) === '✓') aS += 0.5; if (x.charAt(0) === '✗') aS -= 0.6; });
  he.push({ he: 'Chiêm tinh', items: ai }); diem.push({ he: 'Chiêm tinh', v: Math.max(-2, Math.min(2, aS)) });
  if (C.hlL && C.hlL.namNay) {
    var hn = C.hlL.namNay;
    he.push({ he: 'Hà Lạc', items: ['Quẻ lưu niên ' + hn.que + ' (hào động ' + hn.hao + ') – ' + hn.danhGia + ': ' + hn.y + '. Nên ' + hn.khuyen + '.'].concat(hn.ghi) });
    diem.push({ he: 'Hà Lạc', v: Math.max(-2, Math.min(2, hn.diem)) });
  }
  he.push({ he: 'Human Design', items: ['Chiến lược vẫn là kim chỉ nam mỗi năm: ' + HD_TYPES[C.hd.loai].chienLuoc + '. Khi thấy ' + HD_TYPES[C.hd.loai].saiLech.toLowerCase() + ' kéo dài – đó là tín hiệu đang đi lệch.'] });
  var t = 0; diem.forEach(function (x) { t += x.v; }); t /= diem.length;
  var cung = diem.filter(function (x) { return x.v * t > 0; }).map(function (x) { return x.he; });
  var dg = t > 0.8 ? 'Năm thuận lợi' : t > 0.2 ? 'Năm khá' : t > -0.3 ? 'Năm bình ổn, có cơ hội lẫn thử thách' : 'Năm nhiều thử thách – nên thủ hơn công';
  var manh = linhVuc.filter(function (l) { return l.loai !== 'xau'; }).sort(function (a, b) { return b.diem - a.diem; })[0];
  var yeu = linhVuc.filter(function (l) { return l.loai === 'xau'; }).sort(function (a, b) { return b.diem - a.diem; })[0];
  var kl = [dg + ' (điểm ' + (Math.round(t * 10) / 10) + '; ' + cung.length + '/' + diem.length + ' hệ cùng chiều: ' + cung.join(', ') + ').'];
  if (manh) kl.push('Lĩnh vực sáng nhất: ' + manh.ten.toLowerCase() + ' (' + manh.diem + ').');
  if (yeu && yeu.diem > 1) kl.push('✗ Cần phòng: ' + yeu.ten.toLowerCase() + ' (' + yeu.diem + ').');
  kl.push('Chủ đề thần số: ' + TS_NAM[ts.namNay].split(':')[0] + '; chiêm tinh kích hoạt nhà ' + ctL.namXem.nha + ' (' + CT_NHA[ctL.namXem.nha - 1].y.split(',')[0] + ').');
  return { tieuDe: 'Năm ' + vy + ' theo 6 hệ', diem: t, ketLuan: kl, nguon: he, linhVuc: linhVuc };
}

/* =========================================================
 * 7. BẢNG MAY MẮN
 * ========================================================= */
var TH_DA_QUY = ['Kim cương, hồng ngọc', 'Ngọc lục bảo, thạch anh hồng', 'Mã não, ngọc trai', 'Ngọc trai, đá mặt trăng', 'Hồng ngọc, peridot', 'Sapphire xanh, ngọc bích',
  'Opal, tourmaline', 'Topaz, thạch anh tím', 'Topaz xanh, ngọc lam', 'Garnet, onyx đen', 'Thạch anh tím, aquamarine', 'Aquamarine, đá mặt trăng'];
var TH_THU = { sun: 'Chủ nhật', moon: 'Thứ Hai', mars: 'Thứ Ba', mercury: 'Thứ Tư', jupiter: 'Thứ Năm', venus: 'Thứ Sáu', saturn: 'Thứ Bảy' };
var TH_HUONG_QUAI = { 'Khảm': 'Bắc', 'Ly': 'Nam', 'Chấn': 'Đông', 'Tốn': 'Đông Nam', 'Càn': 'Tây Bắc', 'Đoài': 'Tây', 'Cấn': 'Đông Bắc', 'Khôn': 'Tây Nam' };
function thMayMan_(C) {
  var bt = C.bt, ct = C.ct, ts = C.ts, tv = C.tv, male = tv.info.male;
  var quai = pnCungPhi_(tv.info.lunar.year, male), du = PN_DU_NIEN[quai];
  var huongTot = du.slice(0, 4).map(function (q, i) { return PN_DU_TEN[i] + ': ' + TH_HUONG_QUAI[q]; });
  var huongXau = du.slice(4).map(function (q, i) { return PN_DU_TEN[i + 4] + ': ' + TH_HUONG_QUAI[q]; });
  var so = [String(bt.goiY.so), String(tsGoc_(ts.duongDoi)), String(tsGoc_(ts.ngaySinh))].join(', ');
  return { tieuDe: 'Bảng may mắn', dong: [
    ['Ngũ hành dụng thần', bt.goiY.dung + ' (hỷ: ' + bt.goiY.hy.join(', ') + '; kỵ: ' + bt.goiY.ky.join(', ') + ')'],
    ['Màu hợp', bt.goiY.mauHy.join(' · ')],
    ['Hướng tốt (Bát Tự)', bt.goiY.huong],
    ['Cung phi – hướng nhà, bàn làm việc', quai + ' (' + (['Khảm', 'Ly', 'Chấn', 'Tốn'].indexOf(quai) >= 0 ? 'Đông tứ mệnh' : 'Tây tứ mệnh') + ') · Tốt: ' + huongTot.join('; ')],
    ['Hướng nên tránh', huongXau.join('; ')],
    ['Con số', so + ' (Bát Tự · số chủ đạo · số ngày sinh)'],
    ['Ngày trong tuần', TH_THU[ct.chuTinh] + ' (ngày của ' + CT_HT[ct.chuTinh].ten + ' – chủ tinh lá số)' + (CT_CUNG[ct.by.sun.cung].chuCo !== ct.chuTinh ? ', ' + TH_THU[CT_CUNG[ct.by.sun.cung].chuCo] + ' (chủ tinh cung Mặt Trời)' : '')],
    ['Đá quý hợp', TH_DA_QUY[ct.by.sun.cung] + ' (theo Mặt Trời ' + ct.by.sun.cungTen + ')'],
    ['Nghề hợp dụng thần', bt.goiY.nghe],
    ['Năm cá nhân tốt để khởi sự', 'các năm cá nhân 1, 3, 8 – gần nhất: ' + ts.chuKy.filter(function (c) { return [1, 3, 8].indexOf(c.so) >= 0 && c.nam >= tv.info.viewYear; }).slice(0, 3).map(function (c) { return c.nam + ' (số ' + c.so + ')'; }).join(', ')]
  ] };
}

/* =========================================================
 * HÀM CHÍNH
 * ========================================================= */
function tongHopLuan(C) {
  var nghe = thNghe_(C);
  var dd = thDuongDoi_(C);
  var T = {
    xuatThan: thXuatThan_(C),
    phoiNgau: phoiNgauLuan(C),
    namNay: thNamNay_(C, C.ctL),
    mayMan: thMayMan_(C),
    vocDang: thVocDang_(C),
    coThe: thCoThe_(C),
    tinhCach: thTinhCach_(C),
    duongDoi: dd,
    nghe: nghe.slice(0, 6),
    coSo: [
      'Sáu hệ: Tử Vi, Bát Tự, Bát Tự Hà Lạc, Chiêm tinh, Thần số học, Human Design. Mỗi hệ luận "bỏ phiếu" độc lập trên cùng một thang đo (ví dụ trục Hướng ngoại ↔ Hướng nội từ −2 đến +2); kết quả chung là trung bình các hệ, độ đồng thuận là tỷ lệ hệ cùng chiều.',
      'Xuất thân: Tử Vi (Phụ Mẫu – Phúc Đức – Điền Trạch, Tuần/Triệt ở Mệnh, Thiên Mã), Bát Tự (niên trụ = tổ nghiệp, nguyệt trụ = cha mẹ; Ấn/Tài/Kiếp ở trụ năm – tháng, Dịch Mã), Chiêm tinh (nhà 4/IC, Mặt Trăng, Sao Thổ, Sao Mộc), Thần số học (số 4, 6, đỉnh cao thứ nhất).',
      'Vóc dáng: hình tướng chính tinh Mệnh – Thân (cổ thư Tử Vi), hình tướng ngũ hành của nhật chủ và hành vượng (Bát Tự – "Ngũ hành hình tướng"), cung Mọc – chủ tinh lá số – hành tinh nhà 1 (chiêm tinh cổ điển, Ptolemy/Alan Leo).',
      'Đặc điểm cơ thể: sát tinh/Hóa Kỵ/Xương Khúc ở Mệnh – Thân – Tật (Tử Vi), ngũ hành thái quá/bất cập ↔ tạng phủ (Hoàng Đế Nội Kinh), Sao Hỏa – Sao Thổ – cung Mọc – nhà 6 ↔ bộ phận theo cung (Melothesia), trung tâm mở ↔ tuyến nội tiết (Human Design).',
      'Phối ngẫu: cung Phu Thê (Tử Vi), nhật chi & sao phối ngẫu – Tài tinh với nam, Quan tinh với nữ (Bát Tự), cung Lặn/nhà 7, Sao Kim – Sao Hỏa (chiêm tinh), nhóm số chủ đạo (Thần số), trung tâm mở – cổng treo (Human Design); năm sinh phù hợp chấm thang 10 theo 5 tiêu chí xem tuổi truyền thống.',
      'Đường đời: chồng lớp đại hạn Tử Vi, đại vận Bát Tự, 4 đỉnh cao Thần số, chu kỳ Sao Thổ/Thiên Vương/Nút (chiêm tinh) và ba giai đoạn của Human Design; năm nổi bật lấy từ tab Dự Đoán.',
      'Kết luận chỉ mang tính tham khảo – xu hướng, không phải định mệnh; điểm càng nhiều hệ đồng thuận thì càng đáng lưu tâm.'
    ]
  };
  T.tomLuoc = thTomLuoc_(C, T);
  return T;
}

/* =========================================================
 * 8. BẢN TÓM LƯỢC CHÂN DUNG (viết theo lối copywriting: rõ, cụ thể,
 *    nói trực tiếp với "bạn", mỗi ý một lợi ích/hành động)
 * ========================================================= */
var TH_NGUYEN_MAU = {
  'Tử Vi': ['Đế Vương', 'sinh ra để dẫn dắt – người khác tự nhiên tìm đến bạn khi cần một quyết định'],
  'Thiên Cơ': ['Quân Sư', 'bộ óc chiến lược – bạn nhìn thấy nước đi tiếp theo trước người khác'],
  'Thái Dương': ['Mặt Trời', 'nguồn năng lượng tỏa ra – bạn làm ấm và kéo mọi người lại gần'],
  'Vũ Khúc': ['Tài Thần', 'bản năng tiền bạc và kỷ luật thép – bạn biến nỗ lực thành tài sản'],
  'Thiên Đồng': ['Phúc Tinh', 'người mang niềm vui – bạn khiến mọi thứ nhẹ nhàng hơn'],
  'Liêm Trinh': ['Chiến Binh Nguyên Tắc', 'bạn sống theo luật của riêng mình và không chấp nhận sự dễ dãi'],
  'Thiên Phủ': ['Người Giữ Kho', 'bạn tích lũy, bảo toàn và làm mọi thứ vững chãi lâu dài'],
  'Thái Âm': ['Nguyệt Quang', 'trực giác tinh tế và chiều sâu cảm xúc – bạn cảm nhận điều người khác bỏ lỡ'],
  'Tham Lang': ['Kẻ Chinh Phục', 'khát khao trải nghiệm và sức hút tự nhiên – bạn mở ra mọi cánh cửa'],
  'Cự Môn': ['Nhà Hùng Biện', 'lời nói là vũ khí – bạn thuyết phục, phân tích và vạch trần sự thật'],
  'Thiên Tướng': ['Người Bảo Hộ', 'công bằng và che chở – bạn là chỗ dựa mà người khác tin cậy'],
  'Thiên Lương': ['Bậc Hiền Triết', 'bạn mang tâm thế người thầy – cho lời khuyên và chữa lành'],
  'Thất Sát': ['Tướng Quân', 'dũng mãnh, quyết đoán – bạn mạnh nhất khi phải vượt nghịch cảnh'],
  'Phá Quân': ['Người Phá Cách', 'bạn phá bỏ cái cũ để dựng cái mới – sinh ra cho những cuộc đổi thay']
};
var TH_NT_TINH = { 'Lửa': 'Rực Lửa', 'Đất': 'Vững Chãi', 'Khí': 'Phóng Khoáng', 'Nước': 'Sâu Thẳm' };

function thTomLuoc_(C, T) {
  var tv = C.tv, bt = C.bt, ct = C.ct, ts = C.ts, hd = C.hd;
  var menh = thChinhTinh_(tv, tv.palaces[tv.info.menh]), s0 = menh[0] ? menh[0].n : null;
  var NM = TH_NGUYEN_MAU[s0] || ['Kẻ Lữ Hành', 'bạn linh hoạt, học từ mọi hoàn cảnh và tự định hình con đường của mình'];
  var nt = CT_CUNG[ct.by.sun.cung].nt, ten = NM[0] + ' ' + TH_NT_TINH[nt];
  var truc = T.tinhCach.truc.filter(function (x) { return Math.abs(x.gt) > 0.35; }).sort(function (a, b) { return b.tyLe - a.tyLe; });
  var nghe = T.nghe[0], dd = T.duongDoi, vang = dd.chang.slice().sort(function (a, b) { return b.diem - a.diem; })[0];
  var nay = dd.chang.filter(function (c) { return c.isNow; })[0];
  var sang = [], canh = [], khuyen = [];
  sang.push(NM[1].charAt(0).toUpperCase() + NM[1].slice(1) + '.');
  if (truc[0]) sang.push(truc[0].moTa.split(':')[0] + ' là nét rõ nhất ở bạn – ' + truc[0].dong.length + ' trên ' + T.tinhCach.soHe + ' hệ cùng xác nhận.');
  if (nghe) sang.push('Đất dụng võ: ' + nghe.ten.toLowerCase() + ' (' + nghe.he.length + ' hệ cùng gợi ý).');
  if (sang.length < 3) sang.push('Tài sản bẩm sinh (số chủ đạo ' + ts.duongDoi + '): ' + TS_SO[ts.duongDoi].manh + '.');
  var x = T.coThe.vung && T.coThe.vung[0];
  if (x && x.n >= 2) canh.push('Giữ gìn vùng ' + x.ten.toLowerCase() + ' – ' + x.n + ' hệ cùng cảnh báo.');
  canh.push('Mặt tối cần canh chừng: ' + CT_CUNG[ct.by.sun.cung].bong + '.');
  canh.push('Tín hiệu bạn đang đi lệch hướng (Human Design): cảm giác ' + HD_TYPES[hd.loai].saiLech.toLowerCase() + ' kéo dài.');
  khuyen.push('Ra quyết định lớn theo cách của bạn: ' + HD_TYPES[hd.loai].chienLuoc.toLowerCase() + '.');
  khuyen.push('Tận dụng dụng thần ' + bt.goiY.dung + ': màu ' + bt.goiY.mau.toLowerCase() + ', hướng ' + bt.goiY.huong + '.');
  khuyen.push('Bài học đường đời (số ' + ts.duongDoi + '): ' + TS_SO[ts.duongDoi].bh + '.');
  var pn = T.phoiNgau;
  return {
    nguyenMau: ten,
    tieuDe: 'Bạn là ' + ten,
    phuDe: NM[1].charAt(0).toUpperCase() + NM[1].slice(1) + '. Mệnh ' + (menh.map(function (s) { return s.n; }).join(' – ') || 'vô chính diệu') + ', nhật chủ ' + bt.nhatChu +
      ', Mặt Trời ' + ct.by.sun.cungTen + ', số chủ đạo ' + ts.duongDoi + ', ' + HD_TYPES[hd.loai].ten.split(' (')[0] + ' ' + hd.profile + (C.hl ? ', quẻ Hà Lạc ' + C.hl.tien.ten + ' → ' + C.hl.hau.ten : '') + '.',
    chiSo: [
      { nhan: 'Giai đoạn vàng', gt: vang ? vang.khoang.replace(' tuổi', '') : '—', phu: vang ? vang.nam : '' },
      { nhan: 'Năm ' + tv.info.viewYear, gt: T.namNay ? (T.namNay.diem > 0.8 ? 'Thuận lợi' : T.namNay.diem > 0.2 ? 'Khá' : T.namNay.diem > -0.3 ? 'Bình ổn' : 'Thử thách') : '—', phu: nay ? 'chặng ' + nay.khoang : '' },
      { nhan: 'Tuổi hợp nhất', gt: pn && pn.tuoiHop.tot[0] ? String(pn.tuoiHop.tot[0].nam) : '—', phu: pn && pn.tuoiHop.tot[0] ? pn.tuoiHop.tot[0].canChi + ' · ' + pn.tuoiHop.tot[0].diem + '/10' : '' },
      { nhan: 'Nghề nổi bật', gt: nghe ? nghe.ten.split(' – ')[0] : '—', phu: nghe ? nghe.he.length + '/6 hệ đồng thuận' : '' }
    ],
    diemSang: sang, canhBao: canh, loiKhuyen: khuyen,
    thoiDiem: 'Thời điểm vàng của bạn: ' + (vang ? vang.khoang + ' (' + vang.nam + ')' : '—') + '. ' + dd.ketLuan[2]
  };
}
