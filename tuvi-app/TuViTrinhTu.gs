/**
 * ============================================================
 *  TuViTrinhTu.gs — LUẬN TỬ VI THEO TRÌNH TỰ 26 BƯỚC (24/10/2026, theo gợi ý của chủ dự án)
 *  Gốc vận mệnh (can chi năm, mệnh – cục – mùa – mệnh tinh, âm dương ngũ hành) → cốt cách
 *  (tinh hệ Tử Vi, chính tinh, cung Thân, tứ sinh/mộ/chính, cung Phúc) → ba vòng sao →
 *  các nhóm sao (lục cát, lục sát, lục quý, tứ đức, Tuần Triệt, không vong) → chủ đề đời sống → vận hạn.
 *  Mỗi bước: de = lời dễ hiểu (không nêu tên sao), ky = căn cứ thuật ngữ (thu gọn trên giao diện).
 *  Chỉ đọc dữ liệu lá số đã an (tuviLapLaSo) – không an lại sao.
 * ============================================================
 */
var TT_NHOM_BUOC = [
  { ten: 'Gốc vận mệnh', tu: 1, den: 4 }, { ten: 'Cốt cách lá số', tu: 5, den: 9 }, { ten: 'Ba vòng sao', tu: 10, den: 12 },
  { ten: 'Các nhóm sao', tu: 13, den: 18 }, { ten: 'Chủ đề đời sống', tu: 19, den: 25 }, { ten: 'Vận hạn', tu: 26, den: 26 }
];
var TT_KHI_CHAT = {
  'Kim': 'cứng cỏi, quyết đoán, coi trọng nguyên tắc', 'Mộc': 'nhân hậu, thích vươn lên và học hỏi', 'Thủy': 'linh hoạt, nhạy bén, giỏi thích nghi',
  'Hỏa': 'nhiệt huyết, thẳng thắn, hành động nhanh', 'Thổ': 'điềm đạm, chắc chắn, đáng tin cậy'
};
var TT_MUA = [['Xuân', 'Mộc'], ['Hạ', 'Hỏa'], ['Thu', 'Kim'], ['Đông', 'Thủy']];
var TT_TU_VI_HE = {
  0: ['Tử Vi độc tọa ở Tý – Ngọ', 'người có tầm nhìn, thích tự mình làm chủ; cần người phò tá giỏi mới phát huy hết'],
  1: ['Tử Vi – Phá Quân đồng cung ở Sửu – Mùi', 'người dám phá cũ lập mới, nhiều thay đổi lớn trong đời; thành công khi biết giữ nhịp'],
  2: ['Tử Vi – Thiên Phủ đồng cung ở Dần – Thân', 'người vững vàng, biết lo xa và giữ của; dễ được tin cậy giao việc lớn'],
  3: ['Tử Vi – Tham Lang đồng cung ở Mão – Dậu', 'người đa tài, đa giao tiếp, nhiều ham muốn; cần tu dưỡng để tài năng đi đúng hướng'],
  4: ['Tử Vi – Thiên Tướng đồng cung ở Thìn – Tuất', 'người trọng danh dự, thích giúp đỡ và quản lý; hợp vai trò điều phối'],
  5: ['Tử Vi – Thất Sát đồng cung ở Tỵ – Hợi', 'người có quyền uy và ý chí mạnh, biến hóa khó khăn thành cơ hội']
};
var TT_THAN_CU = {
  'Mệnh': 'Thân và Mệnh cùng một cung: bạn sống đúng như bản chất ban đầu, ít thay đổi theo hoàn cảnh – giữ được mình nhưng cũng nên mềm dẻo hơn.',
  'Phúc Đức': 'Thân ở cung Phúc: nửa sau cuộc đời coi trọng gia đình, đời sống tinh thần; phúc phần dòng họ là chỗ dựa lớn.',
  'Quan Lộc': 'Thân ở cung Quan: nửa sau cuộc đời đặt nặng sự nghiệp, danh vị; bạn thấy mình có giá trị khi được làm việc.',
  'Thiên Di': 'Thân ở cung Di: hay di chuyển, mở rộng giao thiệp; cơ hội thường đến từ bên ngoài, xa nơi sinh.',
  'Tài Bạch': 'Thân ở cung Tài: coi trọng tài chính, tự lập về kinh tế; biết kiếm và biết giữ là chìa khóa.',
  'Phu Thê': 'Thân ở cung Phối: người bạn đời ảnh hưởng lớn tới nửa sau cuộc đời; hôn nhân hòa hợp thì mọi việc thuận.'
};
var TT_TU_SINH = { ten: ['Tứ chính (Tý Ngọ Mão Dậu)', 'Tứ mộ (Thìn Tuất Sửu Mùi)', 'Tứ sinh (Dần Thân Tỵ Hợi)'],
  y: ['Bạn có tính cách rõ ràng, chính trực, thích sự minh bạch; giữ lập trường vững nhưng đôi khi cứng nhắc.',
    'Bạn có xu hướng tích lũy, chín chắn, thành công đến muộn mà bền; biết giữ của và giữ nếp.',
    'Bạn năng động, nhiều ý tưởng, thích khởi sự cái mới; cần kiên trì đến cùng để gặt quả.'] };
var TT_THAI_TUE = {
  'Thái Tuế': 'thẳng thắn, có chính kiến, hay đứng ra nói lẽ phải', 'Quan Phù': 'chính trực, coi trọng lẽ phải và luật lệ', 'Bạch Hổ': 'cương quyết, dám làm, chịu được áp lực',
  'Thiếu Dương': 'thông minh, lanh lợi, được may mắn bất ngờ', 'Tử Phù': 'kín đáo, hay lo xa', 'Phúc Đức': 'hiền hòa, có phúc, được người giúp',
  'Tang Môn': 'nhạy cảm, hay lo nghĩ, trải nhiều thăng trầm', 'Tuế Phá': 'thích phản biện, không chịu khuôn phép', 'Điếu Khách': 'giỏi ăn nói, hay can thiệp chuyện người',
  'Thiếu Âm': 'ôn hòa, tình cảm, khéo léo', 'Long Đức': 'nhân hậu, được che chở', 'Trực Phù': 'thẳng tính, hay gánh việc thay người'
};
var TT_LOC_TON = {
  'Bác Sĩ': 'thông minh, ham học, có uy tín', 'Lực Sĩ': 'khỏe mạnh, có sức làm việc lớn', 'Thanh Long': 'gặp chuyện vui, được hỷ tín', 'Tiểu Hao': 'dễ hao hụt nhỏ, chi tiêu rộng tay',
  'Tướng Quân': 'cương nghị, có khí thế lãnh đạo', 'Tấu Thư': 'giỏi văn chương, lời nói có sức thuyết phục', 'Phi Liêm': 'nhanh nhẹn nhưng dễ vướng lời ra tiếng vào',
  'Hỷ Thần': 'vui vẻ, lạc quan, hay gặp tin mừng', 'Bệnh Phù': 'nên giữ nếp sinh hoạt điều độ, nghỉ ngơi đủ', 'Đại Hao': 'chi tiêu dễ lớn, cần quản lý tài chính chặt, tích lũy đều',
  'Phục Binh': 'nên đề phòng người ngấm ngầm cạnh tranh', 'Quan Phủ': 'nên cẩn trọng giấy tờ, hợp đồng'
};
var TT_TRANG_SINH = {
  'Tràng Sinh': 'sức sống mới, dễ khởi đầu', 'Mộc Dục': 'thích làm đẹp, nhiều cảm xúc', 'Quan Đới': 'trưởng thành, có danh phận', 'Lâm Quan': 'đang lên, gặt hái thành quả',
  'Đế Vượng': 'sung mãn, mạnh mẽ nhất', 'Suy': 'trầm lắng, cần giữ sức', 'Bệnh': 'nhịp chậm lại, cần nghỉ ngơi đủ', 'Tử': 'năng lượng lặng, hợp suy ngẫm',
  'Mộ': 'tích lũy, giữ gìn', 'Tuyệt': 'dễ đứt đoạn, cần bền chí', 'Thai': 'ấp ủ ý tưởng mới', 'Dưỡng': 'được nuôi dưỡng, chờ thời'
};
var TT_LUC_CAT = ['Tả Phù', 'Hữu Bật', 'Văn Xương', 'Văn Khúc', 'Thiên Khôi', 'Thiên Việt'];
var TT_LUC_SAT = ['Kình Dương', 'Đà La', 'Địa Không', 'Địa Kiếp', 'Hỏa Tinh', 'Linh Tinh'];
var TT_LUC_QUY = ['Ân Quang', 'Thiên Quý', 'Thiên Quan', 'Thiên Phúc', 'Tam Thai', 'Bát Tọa'];
var TT_TU_DUC = ['Thiên Đức', 'Nguyệt Đức', 'TT.Phúc Đức', 'TT.Long Đức'];
var TT_DAO_HOA = ['Đào Hoa', 'Hồng Loan', 'Thiên Hỷ', 'Thiên Riêu'];
var TT_TAM_TAI = { 0: [2, 3, 4], 4: [2, 3, 4], 8: [2, 3, 4], 2: [8, 9, 10], 6: [8, 9, 10], 10: [8, 9, 10], 5: [11, 0, 1], 9: [11, 0, 1], 1: [11, 0, 1], 11: [5, 6, 7], 3: [5, 6, 7], 7: [5, 6, 7] };

function ttMod_(x) { return ((x % 12) + 12) % 12; }
function ttTenSao_(n) { return String(n).replace(/^TT\./, ''); }
function ttQuanHe_(a, b, tenA, tenB) {
  var q = quanHeHanh(a, b);
  return { q: q, tot: q === 'binh' || q === 'duoc_sinh' || q === 'sinh',
    txt: q === 'binh' ? tenA + ' và ' + tenB + ' cùng hành ' + a + ' (bình hòa)' : q === 'sinh' ? tenA + ' (' + a + ') sinh ' + tenB + ' (' + b + ')' :
      q === 'duoc_sinh' ? tenB + ' (' + b + ') sinh ' + tenA + ' (' + a + ')' : q === 'khac' ? tenA + ' (' + a + ') khắc ' + tenB + ' (' + b + ')' : tenB + ' (' + b + ') khắc ' + tenA + ' (' + a + ')' };
}

/** tv: kết quả tuviLapLaSo; ct: chiTiet (đại vận, tiểu vận) */
function tuviTrinhTu(tv, ct) {
  var I = tv.info, P = tv.palaces, pos = tv.pos || {}, out = [];
  var byChi = {}; P.forEach(function (p) { byChi[p.chi] = p; });
  var cungTen = {}; P.forEach(function (p) { cungTen[p.cung] = p; });
  var M = byChi[I.menh], mh = (I.banMenh || {}).hanh;
  var tamPhuong = [I.menh, ttMod_(I.menh + 4), ttMod_(I.menh + 8), ttMod_(I.menh + 6)];
  function sao(p) { return [].concat(p.chinh || [], p.cat || [], p.hung || [], p.tieu || []).filter(function (s) { return !s.hoaOf; }).map(function (s) { return s.n; }); }
  function o(chi, ten) { var x = pos[ten]; return x === chi; }
  function trongTP(ten) { return tamPhuong.filter(function (c) { return pos[ten] === c; }).length > 0; }
  function cungCo(ten) { var c = pos[ten]; return c == null ? '' : byChi[c].cung; }
  function chinhTxt(p) { return (p.chinh || []).length ? p.chinh.map(function (s) { return s.n + (s.b ? ' (' + s.b + ')' : '') + (s.hoa ? ' hóa ' + s.hoa : ''); }).join(', ') : 'vô chính diệu'; }
  function muc(d) { return d >= 7 ? 'thuận lợi rõ rệt' : d >= 5.5 ? 'khá thuận' : d >= 4 ? 'trung bình, có lúc lên xuống' : 'cần nhiều cố gắng'; }
  function buoc(ten, de, ky, h) { out.push({ so: out.length + 1, ten: ten, de: de, ky: ky || [], huong: h || 'vua' }); }

  // 1. Can – Chi năm sinh
  var hc = CAN_HANH[I.yCan], hch = CHI_HANH[I.yChi], q1 = quanHeHanh(hc, hch);
  var y1 = { binh: 'Gốc và ngọn cùng một hành: bạn thuộc mẫu người nhất quán, nghĩ sao làm vậy; đời ít mâu thuẫn nội tâm.',
    sinh: 'Gốc nuôi ngọn: nền tảng gia đình và nỗ lực sớm của bạn dễ đơm hoa kết trái; điều bạn gieo thường được gặt.',
    duoc_sinh: 'Ngọn nuôi gốc: bạn có xu hướng được hoàn cảnh, người xung quanh nâng đỡ; biết đón nhận và đáp đền là phúc.',
    khac: 'Gốc lấn ngọn: ý chí mạnh, hay tự mình gồng gánh; nên biết buông bớt và chia sẻ việc để đời nhẹ nhàng hơn.',
    bi_khac: 'Ngọn lấn gốc: hoàn cảnh hay chi phối kế hoạch của bạn; kiên nhẫn, chuẩn bị kỹ và chọn thời điểm là cách vượt qua.' }[q1];
  buoc('Can – Chi năm sinh', [y1], ['Năm ' + I.namCanChi + ': can ' + I.canNam + ' hành ' + hc + ', chi ' + I.chiNam + ' hành ' + hch + ' → ' + ttQuanHe_(hc, hch, 'can', 'chi').txt + '.'], q1 === 'bi_khac' || q1 === 'khac' ? 'xau' : 'tot');

  // 2. Mệnh cục, mùa sinh, chính tinh thủ mệnh
  var mua = TT_MUA[Math.floor(((I.lunar.month || 1) - 1) / 3)];
  buoc('Mệnh, Cục, mùa sinh và sao thủ Mệnh', ['Bạn mang bản mệnh hành ' + mh + ', sinh vào mùa ' + mua[0].toLowerCase() + ' (khí ' + mua[1] + ' vượng). ' + ((M.chinh || []).length ? 'Cung Mệnh có sao chủ đạo, tính cách định hình rõ từ sớm.' : 'Cung Mệnh không có sao chủ đạo: bạn mềm dẻo, dễ thích nghi, chịu ảnh hưởng nhiều từ môi trường – nên chọn môi trường tốt mà sống.')],
    ['Bản mệnh ' + I.banMenh.ten + ' (' + mh + ') · ' + I.cuc + ' (' + I.cucHanh + ') · sinh tháng ' + I.lunar.month + ' âm lịch, mùa ' + mua[0] + ' (' + mua[1] + ').', 'Mệnh an tại ' + M.chiTen + ': ' + chinhTxt(M) + '.']);

  // 3. Các tương quan
  var ky3 = [], tot3 = 0, tong3 = 0;
  function tq(a, b, ta, tb) { var r = ttQuanHe_(a, b, ta, tb); ky3.push(r.txt + (r.tot ? ' – thuận' : ' – nghịch') + '.'); tong3++; if (r.tot) tot3++; }
  tq(mh, I.cucHanh, 'Mệnh', 'Cục');
  tq(mh, mua[1], 'Mệnh', 'mùa sinh');
  if ((M.chinh || [])[0]) tq(mh, M.chinh[0].h, 'Mệnh', 'sao ' + M.chinh[0].n);
  tq(mh, ['Thủy', 'Kim', 'Hỏa', 'Mộc'][I.menh % 4], 'Mệnh', 'tam hợp cung Mệnh');
  tq(mh, CHI_HANH[I.menh], 'Mệnh', 'cung Mệnh ' + M.chiTen);
  buoc('Tương quan Mệnh – Cục – mùa – sao – tam hợp', [tot3 >= tong3 - 1 ? 'Các yếu tố gốc của bạn phần lớn hòa hợp: bạn có xu hướng gặp thuận lợi tự nhiên, ít phải chống chọi với hoàn cảnh.' : tot3 >= tong3 / 2 ? 'Các yếu tố gốc nửa thuận nửa nghịch: đời có lúc dễ có lúc khó, thành bại phụ thuộc nhiều vào lựa chọn của bạn.' : 'Nhiều yếu tố gốc nghịch nhau: bạn thường phải tự lực vượt khó; bù lại, bản lĩnh và kinh nghiệm tích lũy rất dày. Chọn đúng môi trường hợp hành ' + mh + ' sẽ giúp bạn nhẹ gánh.'],
    ky3, tot3 >= tong3 - 1 ? 'tot' : tot3 >= tong3 / 2 ? 'vua' : 'xau');

  // 4. Khí chất âm dương ngũ hành
  var hanhChinh = (M.chinh || []).map(function (s) { return s.h; });
  var hanhTroi = hanhChinh[0] || CHI_HANH[I.menh];
  var lyThuan = (I.menh % 2 === 0) === (I.yCan % 2 === 0);
  buoc('Khí chất âm dương – ngũ hành', ['Bạn thuộc mẫu người ' + (TT_KHI_CHAT[hanhTroi] || '') + '. ' + (lyThuan ? 'Âm dương thuận lý: việc gì cũng dễ thuận chiều khi bạn làm đúng sở trường.' : 'Âm dương nghịch lý: hay phải đi đường vòng – kiên trì và chuẩn bị kỹ sẽ bù lại.')],
    [I.amDuong + ', Mệnh đóng cung ' + (I.menh % 2 === 0 ? 'dương' : 'âm') + ' → ' + (lyThuan ? 'thuận lý' : 'nghịch lý') + '.', 'Ngũ hành chính tinh Mệnh: ' + (hanhChinh.join(', ') || '— (mượn hành cung ' + CHI_HANH[I.menh] + ')') + '.'], lyThuan ? 'tot' : 'vua');

  // 5. Tinh hệ Tử Vi
  var tvc = pos['Tử Vi'], he = TT_TU_VI_HE[tvc % 6];   // Tý/Ngọ, Sửu/Mùi, Dần/Thân, Mão/Dậu, Thìn/Tuất, Tỵ/Hợi
  buoc('Tinh hệ Tử Vi', ['Lá số thuộc một trong sáu "bộ khung" lớn – bộ của bạn cho thấy: ' + he[1] + '.'], [he[0] + ' (sao Tử Vi tại ' + CHI[tvc] + ', cung ' + byChi[tvc].cung + ').']);

  // 6. Chính tinh thủ mệnh
  var sang = (M.chinh || []).filter(function (s) { return /^[MVĐ]$/.test(s.b || ''); }).length, ham = (M.chinh || []).filter(function (s) { return s.b === 'H'; }).length;
  buoc('Chính tinh thủ Mệnh', [(M.chinh || []).length === 0 ? 'Mệnh không có sao chủ, nên đọc thêm cung đối diện (Thiên Di): bạn có xu hướng mượn sức hoàn cảnh để định hình bản thân.' : sang && !ham ? 'Sao chủ của Mệnh đắc thế: năng lực bẩm sinh của bạn được phát huy thuận lợi, dễ được công nhận.' : ham ? 'Sao chủ của Mệnh ở thế yếu: tài năng có nhưng cần môi trường phù hợp và rèn luyện bền bỉ mới tỏa sáng.' : 'Sao chủ của Mệnh ở mức bình: thành quả tỷ lệ thuận với công sức bạn bỏ ra.'],
    ['Mệnh (' + M.chiTen + '): ' + chinhTxt(M) + '.', 'Điểm cung Mệnh: ' + M.diem10 + '/10.'], sang && !ham ? 'tot' : ham ? 'xau' : 'vua');

  // 7. Cung an Thân
  buoc('Cung an Thân', [TT_THAN_CU[I.thanCu] || 'Thân là nơi bạn "sống" nửa sau cuộc đời.'], ['Thân cư ' + I.thanCu + ' (' + CHI[I.than] + '): ' + chinhTxt(byChi[I.than]) + '.']);

  // 8. Tứ sinh – tứ mộ – tứ chính
  var nhom = I.menh % 3 === 0 ? 0 : I.menh % 3 === 1 ? 1 : 2;
  buoc('Mệnh ở Tứ sinh – Tứ mộ – Tứ chính', [TT_TU_SINH.y[nhom]], ['Mệnh tại ' + M.chiTen + ' thuộc ' + TT_TU_SINH.ten[nhom] + '.']);

  // 9. Cung Phúc
  var PH = cungTen['Phúc Đức'];
  buoc('Cung Phúc Đức', ['Phúc phần của bạn ở mức ' + muc(PH.diem10) + '. ' + (PH.diem10 >= 5.5 ? 'Lá số gợi ý bạn có chỗ dựa từ gia đình, dòng họ – bạn hãy đối chiếu với trải nghiệm thật; gặp khó thường có người giúp.' : 'Phúc cần được vun thêm: sống tử tế, giữ hòa khí gia đình và làm việc thiện là cách "tích phúc" bền nhất.')],
    ['Phúc Đức (' + PH.chiTen + '): ' + chinhTxt(PH) + ' · điểm ' + PH.diem10 + '/10.'], PH.diem10 >= 5.5 ? 'tot' : 'vua');

  // 10–12. Ba vòng sao tại Mệnh
  var tt = M.thaiTue || '', lt = M.bacSi || '', ts = M.trangSinh || '';
  buoc('Vòng Thái Tuế', ['Về thái độ sống, bạn có xu hướng ' + (TT_THAI_TUE[tt] || 'cân bằng') + '.'], ['Mệnh gặp ' + tt + ' (vòng Thái Tuế).'], /Tang Môn|Tuế Phá|Điếu Khách/.test(tt) ? 'vua' : 'tot');
  buoc('Vòng Lộc Tồn', ['Về tài lực và cơ hội, bạn ' + (TT_LOC_TON[lt] || 'ở mức trung bình') + '.'], ['Mệnh gặp ' + lt + ' (vòng Lộc Tồn – Bác Sĩ).' + (trongTP('Lộc Tồn') ? ' Lộc Tồn chiếu Mệnh (' + cungCo('Lộc Tồn') + ').' : '')], /Đại Hao|Tiểu Hao|Phục Binh|Quan Phủ|Phi Liêm|Bệnh Phù/.test(lt) ? 'vua' : 'tot');
  buoc('Vòng Tràng Sinh', ['Sinh lực của Mệnh: ' + (TT_TRANG_SINH[ts] || '') + '.'], ['Mệnh gặp ' + ts + ' (vòng Tràng Sinh).'], /Tràng Sinh|Quan Đới|Lâm Quan|Đế Vượng|Dưỡng/.test(ts) ? 'tot' : 'vua');

  // 13–16. Các nhóm sao trong Mệnh và tam phương tứ chính
  function nhomSao(ds) { return ds.filter(function (n) { return trongTP(n); }).map(function (n) { return ttTenSao_(n) + ' (' + cungCo(n) + ')'; }); }
  var cat = nhomSao(TT_LUC_CAT), sat = nhomSao(TT_LUC_SAT), quy = nhomSao(TT_LUC_QUY), duc = nhomSao(TT_TU_DUC);
  buoc('Lục cát tinh', [cat.length >= 3 ? 'Bạn có xu hướng được quý nhân giúp đỡ, học hành – thi cử – giấy tờ thuận lợi; làm việc nhóm phát huy tốt.' : cat.length ? 'Có một vài sao trợ lực: thêm người giúp đúng lúc nếu bạn chủ động kết nối.' : 'Ít sao trợ lực: bạn chủ yếu tự thân lập nghiệp – xây dựng mạng lưới quan hệ sẽ bù đắp rất tốt.'],
    [cat.length ? 'Trong Mệnh – tam phương tứ chính: ' + cat.join(', ') + ' (' + cat.length + '/6).' : 'Không có lục cát tinh trong Mệnh – tam phương tứ chính.'], cat.length >= 3 ? 'tot' : cat.length ? 'vua' : 'xau');
  buoc('Lục sát tinh', [sat.length >= 3 ? 'Đời bạn có nhiều thử thách, va chạm; bù lại bạn có sức bật và bản lĩnh hơn người. Giữ bình tĩnh, tránh liều lĩnh là chìa khóa.' : sat.length ? 'Có một vài áp lực, biến động: biết lường trước rủi ro thì áp lực hóa thành động lực.' : 'Ít sao gây trở ngại: đời khá êm, tránh chủ quan là đủ.'],
    [sat.length ? 'Trong Mệnh – tam phương tứ chính: ' + sat.join(', ') + ' (' + sat.length + '/6).' : 'Không có lục sát tinh trong Mệnh – tam phương tứ chính.'], sat.length >= 3 ? 'xau' : sat.length ? 'vua' : 'tot');
  buoc('Lục quý tinh', [quy.length >= 2 ? 'Bạn có xu hướng được trọng vọng, có ân nhân và danh dự; giữ chữ tín là cách nhân đôi phúc này.' : 'Danh vọng đến từ thực lực hơn là quý nhân – mỗi thành quả đều do chính bạn tạo ra.'],
    [quy.length ? quy.join(', ') + '.' : 'Không có lục quý tinh trong Mệnh – tam phương tứ chính.'], quy.length >= 2 ? 'tot' : 'vua');
  buoc('Nhóm tứ đức', [duc.length ? 'Bạn có xu hướng hiền lành, biết nghĩ cho người khác, gặp dữ hóa lành.' : 'Phúc đức cần tự vun: lòng tốt bạn trao đi sẽ quay về đúng lúc bạn cần.'],
    [duc.length ? duc.join(', ') + '.' : 'Không có sao tứ đức trong Mệnh – tam phương tứ chính.'], duc.length ? 'tot' : 'vua');

  // 17. Tuần – Triệt
  var tuan = P.filter(function (p) { return p.tuan; }).map(function (p) { return p.cung; }), triet = P.filter(function (p) { return p.triet; }).map(function (p) { return p.cung; });
  var tTrMenh = M.tuan || M.triet, tTrThan = byChi[I.than].tuan || byChi[I.than].triet;
  buoc('Tuần – Triệt', [tTrMenh ? 'Mệnh bị "chặn" một phần: theo cách luận truyền thống, giai đoạn trẻ dễ vất vả, thành công có thể đến muộn hơn – bạn hãy đối chiếu với trải nghiệm thật; sau khoảng 30 tuổi mọi thứ thường mở dần. Đừng nản ở giai đoạn đầu.' : 'Mệnh không bị chặn: năng lực được thể hiện trực tiếp, không phải chờ thời.' + (tTrThan ? ' Riêng nửa sau cuộc đời có lúc chững lại – nên có kế hoạch dự phòng.' : '')],
    ['Tuần tại ' + (tuan.join(', ') || '—') + ' · Triệt tại ' + (triet.join(', ') || '—') + '.'], tTrMenh ? 'vua' : 'tot');

  // 18. Không vong
  var kv = [];
  if (M.tuan) kv.push('Tuần'); if (M.triet) kv.push('Triệt');
  if (M.bacSi === 'Đại Hao' || cungCo('Đại Hao') === 'Mệnh') kv.push('Đại Hao');
  if (M.trangSinh === 'Tuyệt') kv.push('Tuyệt');
  if (o(I.menh, 'Thiên Hư')) kv.push('Thiên Hư');
  if (o(I.menh, 'Địa Không')) kv.push('Địa Không');
  buoc('Nhóm sao Không vong', [kv.length >= 2 ? 'Bạn có xu hướng sống thiên về tinh thần, ít bám chấp vật chất; dễ thấy "được rồi lại mất". Hợp với nghề sáng tạo, nghiên cứu, tâm linh; tài chính nên tích lũy đều, tránh đầu cơ.' : kv.length ? 'Có một chút "khoảng trống" trong Mệnh: đôi lúc thấy hụt hẫng – nuôi dưỡng một niềm tin hay mục tiêu dài hạn sẽ lấp đầy.' : 'Mệnh không vướng nhóm không vong: bạn thực tế, giữ được thành quả.'],
    [kv.length ? 'Tại Mệnh: ' + kv.join(', ') + '.' : 'Không có sao nhóm không vong tại Mệnh.'], kv.length >= 2 ? 'vua' : 'tot');

  // 19–25. Chủ đề đời sống
  function chuDe(ten, cung, tot, vua, xau, them) {
    var c = cungTen[cung]; if (!c) return;
    var sc = sao(c), coSat = TT_LUC_SAT.filter(function (n) { return sc.indexOf(n) >= 0; }), coKy = [].concat(c.chinh || [], c.cat || [], c.hung || []).some(function (s) { return s.hoa === 'Kỵ' || s.n === 'Hóa Kỵ'; });
    var d = c.diem10, h = d >= 6 ? 'tot' : d < 4.5 ? 'xau' : 'vua';
    var de = [h === 'tot' ? tot : h === 'xau' ? xau : vua];
    var t = them ? them(c, sc) : ''; if (t) de.push(t);
    buoc(ten, de, [cung + ' (' + c.chiTen + '): ' + chinhTxt(c) + ' · điểm ' + d + '/10' + (coSat.length ? ' · sát tinh: ' + coSat.join(', ') : '') + (coKy ? ' · có Hóa Kỵ' : '') + '.'], h);
  }
  chuDe('Công việc – nguy cơ gián đoạn', 'Quan Lộc', 'Sự nghiệp có xu hướng ổn định và thăng tiến; bạn hợp vị trí được giao trách nhiệm.', 'Sự nghiệp đi lên từng bước, có lúc chững lại; trau dồi chuyên môn đều đặn sẽ giữ được chỗ đứng.', 'Công việc dễ thay đổi, có giai đoạn gián đoạn; nên giữ một kỹ năng "nghề tay trái" và quỹ dự phòng 6 tháng.',
    function (c, sc) { return sc.indexOf('Địa Không') >= 0 || sc.indexOf('Địa Kiếp') >= 0 ? 'Cung sự nghiệp có dấu hiệu thăng trầm bất ngờ – hợp nghề tự do, sáng tạo hơn là đường thẳng.' : ''; });
  chuDe('Tiền tài – lúc thiếu hụt', 'Tài Bạch', 'Tiền bạc có xu hướng đến đều, bạn biết kiếm và biết giữ.', 'Tiền bạc đủ dùng nhưng khó dư dả nhanh; tích lũy nhỏ mà đều sẽ thành vốn lớn.', 'Tài chính có xu hướng lên xuống, cần quản lý chặt và tích lũy đều; chủ động lập ngân sách, giữ quỹ dự phòng, tránh vay mượn và đầu tư theo phong trào.',
    function (c, sc) { return trongTP('Lộc Tồn') || sc.indexOf('Hóa Lộc') >= 0 ? 'Có "lộc" chiếu về: cơ hội tài chính thường đến qua chính công việc chuyên môn.' : ''; });
  chuDe('Tình duyên – đa tình hay muộn duyên', 'Phu Thê', 'Tình duyên có xu hướng êm ấm, người bạn đời là chỗ dựa.', 'Tình cảm có lúc êm lúc sóng; lắng nghe và nhường nhịn đúng lúc giúp hai người đi xa.', 'Đường tình có xu hướng nhiều thử thách, cần nhiều thấu hiểu; chủ động hiểu mình trước khi chọn người và nói chuyện thẳng thắn là chìa khóa.',
    function (c) {
      var dh = TT_DAO_HOA.filter(function (n) { return o(I.menh, n) || o(c.chi, n); }).length, co = ['Cô Thần', 'Quả Tú'].filter(function (n) { return o(I.menh, n) || o(c.chi, n); }).length;
      return dh >= 2 ? 'Bạn có sức hút, nhiều người để ý – nên chung thủy và rõ ràng để tránh rắc rối tình cảm.' : co ? 'Bạn có xu hướng kén chọn hoặc hay ngại mở lòng – chủ động hơn một chút sẽ khác.' : '';
    });
  chuDe('Con cái – muộn hay ít con', 'Tử Tức', 'Con cái có xu hướng ngoan, hiếu thảo, là niềm vui tuổi già.', 'Con cái cần nhiều thời gian và sự kiên nhẫn của bạn; đồng hành cùng con là cách nuôi phúc.', 'Con cái là chuyện cần thời gian và sự vun đắp; hai vợ chồng chủ động chăm sóc sức khỏe, kiên nhẫn đồng hành cùng con là cách tốt nhất.');
  chuDe('Sức khỏe và nghiệp quả', 'Tật Ách', 'Theo cổ học, phúc phần – nghiệp quả của bạn khá nhẹ nhàng: điều tốt bạn gieo dễ được đáp lại. Giữ nếp sinh hoạt điều độ, nghỉ ngơi và khám định kỳ để giữ phúc lâu bền.', 'Phúc phần – nghiệp quả ở mức vừa: sống điều độ, giữ tâm an và làm việc tử tế là đủ để mọi việc êm thuận. Nên nghỉ ngơi hợp lý và khám định kỳ như mọi người.', 'Phần này nhắc bạn sống chậm lại và chăm chút bản thân hơn: giữ nếp sinh hoạt điều độ, nghỉ ngơi đủ, khám định kỳ. Lá số không thay lời bác sĩ.',
    function () { return PH.diem10 >= 5.5 ? 'Phúc phần tốt nên gặp khó dễ có người giúp.' : 'Sống thiện, giữ hòa khí là cách "trả nghiệp" nhẹ nhàng nhất theo quan niệm xưa.'; });
  chuDe('Xa quê lập nghiệp', 'Thiên Di', 'Ra ngoài dễ gặp may, xa quê lập nghiệp thuận lợi.', 'Ở quê hay đi xa đều được; điều quan trọng là chọn nơi có người đỡ đầu.', 'Ra ngoài hay gặp trắc trở; nên chuẩn bị kỹ, có người quen dẫn đường khi đi xa.',
    function (c) { return o(I.menh, 'Thiên Mã') || o(c.chi, 'Thiên Mã') || I.thanCu === 'Thiên Di' ? 'Lá số có dấu hiệu hay di chuyển, đổi chỗ ở – càng đi càng mở mang.' : ''; });
  var NB = cungTen['Nô Bộc'], TD = cungTen['Thiên Di'];
  buoc('Quan hệ xã hội (Di – Nô)', [(NB.diem10 + TD.diem10) / 2 >= 6 ? 'Bạn có xu hướng được bạn bè, đồng nghiệp quý mến và giúp đỡ; mạng lưới quan hệ là tài sản lớn.' : (NB.diem10 + TD.diem10) / 2 >= 4.5 ? 'Quan hệ xã hội ở mức vừa: chọn bạn mà chơi, giữ khoảng cách với người hay đòi hỏi.' : 'Dễ gặp người không như ý trong hợp tác; làm gì cũng nên có giấy tờ rõ ràng và tin vừa đủ.'],
    ['Thiên Di (' + TD.chiTen + '): ' + chinhTxt(TD) + ' · ' + TD.diem10 + '/10.', 'Nô Bộc (' + NB.chiTen + '): ' + chinhTxt(NB) + ' · ' + NB.diem10 + '/10.'], (NB.diem10 + TD.diem10) / 2 >= 6 ? 'tot' : 'vua');

  // 26. Vận hạn: đại vận, tiểu hạn, năm xung, tam tai
  var vy = I.viewYear, chiNam = ttMod_(vy - 4), DH = byChi[I.daiHanNow], TH = byChi[I.tieuHanNow];
  var xung = ttMod_(chiNam - I.yChi) === 6, tamTai = (TT_TAM_TAI[I.yChi] || []).indexOf(chiNam) >= 0;
  var thSao = TH ? [].concat(TH.chinh || [], TH.cat || [], TH.hung || []).filter(function (s) { return !s.hoaOf; }).map(function (s) { return s.n; }).slice(0, 10) : [];
  var de26 = [];
  if (DH) de26.push('Đại vận 10 năm hiện tại (từ ' + DH.daiHan + ' tuổi) ở mức ' + muc(DH.diem10) + '.');
  if (TH) de26.push('Vận năm ' + vy + ' ở mức ' + muc(TH.diem10) + '.');
  if (xung) de26.push('Năm ' + vy + ' xung tuổi: dễ thay đổi, nên giữ sức khỏe và tránh quyết định vội.');
  if (tamTai) de26.push('Năm ' + vy + ' rơi vào hạn tam tai: theo quan niệm xưa nên cẩn trọng việc lớn, đi lại và tài chính; làm việc thiện, sống chậm lại để "giải hạn".');
  if (!xung && !tamTai) de26.push('Năm ' + vy + ' không phạm năm xung hay tam tai.');
  buoc('Đại vận và tiểu vận', de26, [
    DH ? 'Đại vận tại ' + DH.cung + ' (' + DH.chiTen + ', ' + DH.daiHan + '–' + (DH.daiHan + 9) + ' tuổi): ' + chinhTxt(DH) + ' · ' + DH.diem10 + '/10.' : '',
    TH ? 'Tiểu hạn ' + vy + ' (' + I.viewCanChi + ', ' + I.tuoi + ' tuổi) tại ' + TH.cung + ' (' + TH.chiTen + ')' + (thSao.length ? ': ' + thSao.join(', ') : '') + '.' : '',
    'Năm xung: ' + (xung ? 'có (' + CHI[chiNam] + ' xung ' + CHI[I.yChi] + ')' : 'không') + ' · Tam tai tuổi ' + CHI[I.yChi] + ': các năm ' + (TT_TAM_TAI[I.yChi] || []).map(function (c) { return CHI[c]; }).join(', ') + (tamTai ? ' – năm nay phạm' : '') + '.'
  ].filter(Boolean), xung || tamTai ? 'xau' : DH && DH.diem10 >= 6 ? 'tot' : 'vua');

  // Gộp các phần luận khác vào đúng bước (25/10 – chủ dự án chọn "26 bước là bài luận chính"): giao diện đọc trường gop
  // để chèn văn dễ hiểu của cung (chiTiet.cung), bộ sao (chiTiet.boSao), ba vòng nhân sinh (chiTiet.tamPhap), cách cục, sao hạn đại vận.
  out.forEach(function (b) { if (TT_GOP[b.ten]) b.gop = TT_GOP[b.ten]; });
  return { nhom: TT_NHOM_BUOC, buoc: out };
}
var TT_GOP = {
  'Tương quan Mệnh – Cục – mùa – sao – tam hợp': { tongQuan: 1 },
  'Tinh hệ Tử Vi': { cachCuc: 1 },
  'Chính tinh thủ Mệnh': { cung: ['Mệnh'] },
  'Cung an Thân': { than: 1, tp: ['Nửa sau cuộc đời', 'Lời nói và việc làm'] },
  'Cung Phúc Đức': { cung: ['Phúc Đức', 'Phụ Mẫu', 'Huynh Đệ'] },
  'Vòng Thái Tuế': { tp: ['Thế đứng (cách nghĩ, cách sống)'], tpKy: 1 },
  'Vòng Lộc Tồn': { tp: ['Thực lực (của cải, phương tiện)', 'Lộc thực'] },
  'Vòng Tràng Sinh': { tp: ['Nhịp sức sống'] },
  'Công việc – nguy cơ gián đoạn': { cung: ['Quan Lộc'] },
  'Tiền tài – lúc thiếu hụt': { cung: ['Tài Bạch', 'Điền Trạch'] },
  'Tình duyên – đa tình hay muộn duyên': { cung: ['Phu Thê'] },
  'Con cái – muộn hay ít con': { cung: ['Tử Tức'] },
  'Sức khỏe và nghiệp quả': { cung: ['Tật Ách'] },
  'Xa quê lập nghiệp': { cung: ['Thiên Di'], tp: ['Bên trong và bên ngoài'] },
  'Quan hệ xã hội (Di – Nô)': { cung: ['Nô Bộc'] },
  'Đại vận và tiểu vận': { vanThaiTue: 1, saoHan: 1 }
};
