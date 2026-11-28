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
  0: ['Tử Vi độc tọa ở Tý – Ngọ', 'người có tầm nhìn, thích tự mình làm chủ; mặt trái là thiếu người phò tá giỏi thì dễ lẻ loi, tham vọng vượt sức'],
  1: ['Tử Vi – Phá Quân đồng cung ở Sửu – Mùi', 'người dám phá cũ lập mới; mặt trái là đời nhiều lần làm lại từ đầu, hao tiền hao sức theo mỗi lần đổi'],
  2: ['Tử Vi – Thiên Phủ đồng cung ở Dần – Thân', 'người vững vàng, biết lo xa và giữ của, dễ được tin giao việc lớn; mặt trái là bảo thủ, dễ tự mãn'],
  3: ['Tử Vi – Tham Lang đồng cung ở Mão – Dậu', 'người đa tài, giao tiếp giỏi; mặt trái là nhiều ham muốn, dễ sa vào hưởng thụ và tình cảm phức tạp'],
  4: ['Tử Vi – Thiên Tướng đồng cung ở Thìn – Tuất', 'người trọng danh dự, thích giúp đỡ và quản lý; mặt trái là hay bị khuôn khổ kìm giữ, giỏi mà chậm gặp thời'],
  5: ['Tử Vi – Thất Sát đồng cung ở Tỵ – Hợi', 'người có quyền uy và ý chí mạnh, dám nhận việc khó; mặt trái là dễ độc đoán, khó nghe người khác']
};
var TT_THAN_CU = {
  'Mệnh': 'Bạn có xu hướng sống đúng như bản chất ban đầu, ít thay đổi theo hoàn cảnh. Mặt tốt: nhất quán, giữ được mình. Mặt xấu: chậm thích nghi, điểm yếu từ trẻ dễ theo đến già.',
  'Phúc Đức': 'Nửa sau cuộc đời, bạn có xu hướng đặt trọng tâm vào gia đình và đời sống tinh thần. Mặt tốt: gia đình, dòng họ là chỗ dựa. Mặt xấu: chuyện họ hàng dễ kéo bạn vào trách nhiệm và phiền lụy.',
  'Quan Lộc': 'Nửa sau cuộc đời, bạn có xu hướng đặt trọng tâm vào sự nghiệp. Mặt tốt: thấy mình có giá trị khi làm việc. Mặt xấu: dễ thành người nghiện việc, sức khỏe và gia đình bị lơ là.',
  'Thiên Di': 'Nửa sau cuộc đời, bạn có xu hướng hay di chuyển, mở rộng giao thiệp. Mặt tốt: cơ hội đến từ bên ngoài, xa nơi sinh. Mặt xấu: ít ở nhà, khó giữ gốc rễ, bôn ba mệt.',
  'Tài Bạch': 'Nửa sau cuộc đời, bạn có xu hướng coi trọng tài chính và sự tự lập về kinh tế. Mặt tốt: biết kiếm, biết giữ. Mặt xấu: dễ đặt tiền lên trên tình cảm, lo âu về vật chất.',
  'Phu Thê': 'Nửa sau cuộc đời, bạn có xu hướng chịu ảnh hưởng nhiều từ người đồng hành. Mặt tốt: người hợp thì đời thuận hẳn. Mặt xấu: chọn sai người thì cả sự nghiệp lẫn tinh thần đi xuống theo.'
};
var TT_TU_SINH = { ten: ['Tứ chính (Tý Ngọ Mão Dậu)', 'Tứ mộ (Thìn Tuất Sửu Mùi)', 'Tứ sinh (Dần Thân Tỵ Hợi)'],
  y: ['Bạn có tính cách rõ ràng, chính trực, thích minh bạch, giữ lập trường vững; mặt trái là cứng nhắc, khó thỏa hiệp nên dễ va chạm.',
    'Bạn có xu hướng tích lũy, chín chắn, biết giữ của và giữ nếp; mặt trái là thành công đến muộn, có giai đoạn dài thấy mình giậm chân.',
    'Bạn năng động, nhiều ý tưởng, thích khởi sự cái mới; mặt trái là hay bỏ dở, nhiều việc bắt đầu mà ít việc xong.'] };
var TT_THAI_TUE = {
  'Thái Tuế': 'thẳng thắn, có chính kiến, hay đứng ra nói lẽ phải – đổi lại dễ mất lòng, bị cho là khó tính', 'Quan Phù': 'chính trực, coi trọng lẽ phải và luật lệ – đổi lại dễ dính chuyện giấy tờ, kiện cáo', 'Bạch Hổ': 'cương quyết, dám làm, chịu được áp lực – đổi lại vất vả, dễ va chạm',
  'Thiếu Dương': 'thông minh, lanh lợi, được may mắn bất ngờ – đổi lại dễ cậy khôn, được rồi lại mất', 'Tử Phù': 'kín đáo, hay lo xa – đổi lại dễ buồn lo, khó vui trọn', 'Phúc Đức': 'hiền hòa, có phúc, được người giúp – đổi lại dễ ỷ lại, an phận',
  'Tang Môn': 'nhạy cảm, hay lo nghĩ, dễ buồn và bi quan kéo dài – đổi lại hiểu nỗi khổ của người khác', 'Tuế Phá': 'thích phản biện, không chịu khuôn phép, dễ va chạm với cấp trên và tổ chức – đổi lại dám nói điều sai', 'Điếu Khách': 'giỏi ăn nói, nhiệt tình góp ý nhưng hay nói quá, dễ mang tiếng nhiều chuyện – đổi lại có sức thuyết phục',
  'Thiếu Âm': 'ôn hòa, tình cảm, khéo léo – đổi lại dễ bị lấn lướt, công sức bị người khác nhận phần', 'Long Đức': 'nhân hậu, được che chở – đổi lại hiền quá dễ bị lợi dụng', 'Trực Phù': 'thẳng tính, hay gánh việc thay người – đổi lại dễ chịu thiệt, ít được ghi nhận'
};
var TT_LOC_TON = {
  'Bác Sĩ': 'thông minh, ham học, có uy tín; mặt trái là dễ tự cao về hiểu biết', 'Lực Sĩ': 'khỏe mạnh, có sức làm việc lớn; mặt trái là dễ làm quá sức, nóng nảy', 'Thanh Long': 'hay gặp chuyện vui, tin mừng; mặt trái là dễ chủ quan khi đang thuận', 'Tiểu Hao': 'có xu hướng chi tiêu rộng tay, tiền hao lặt vặt khó giữ; mặt tốt là hào phóng, dễ được lòng người',
  'Tướng Quân': 'cương nghị, có khí thế lãnh đạo; mặt trái là dễ áp đặt, khó chịu khi bị chỉ huy', 'Tấu Thư': 'giỏi văn chương, lời nói có sức thuyết phục; mặt trái là nói hay hơn làm', 'Phi Liêm': 'nhanh nhẹn, xoay xở giỏi; mặt trái là dễ vướng lời ra tiếng vào, bị nói xấu sau lưng',
  'Hỷ Thần': 'vui vẻ, lạc quan, hay gặp tin mừng; mặt trái là ham vui, tiêu nhiều cho hưởng thụ', 'Bệnh Phù': 'sức khỏe dễ có bệnh vặt, mệt mỏi, kéo theo hao tiền; mặt tốt là biết giữ gìn sớm', 'Đại Hao': 'chi tiêu dễ lớn, có những khoản hao hụt mạnh khó bù; mặt tốt là dám chi cho cơ hội',
  'Phục Binh': 'dễ bị người khác ngáng, lộ kế hoạch hoặc bị phản; mặt tốt là quen thận trọng, giữ bí mật', 'Quan Phủ': 'dễ vướng giấy tờ, hợp đồng, tranh chấp; mặt tốt là quen làm việc có thủ tục rõ ràng'
};
var TT_TRANG_SINH = {
  'Tràng Sinh': 'sức sống mới, dễ khởi đầu; mặt trái là còn non, dễ hăng quá đà', 'Mộc Dục': 'thích làm đẹp, nhiều cảm xúc; mặt trái là dễ chao đảo, sa vào chuyện tình cảm', 'Quan Đới': 'trưởng thành, có danh phận; mặt trái là dễ trọng hình thức', 'Lâm Quan': 'đang lên, gặt hái thành quả; mặt trái là dễ tự mãn, khoe khoang',
  'Đế Vượng': 'sung mãn, mạnh mẽ nhất; mặt trái là thịnh quá dễ cứng, khó nghe ai', 'Suy': 'sinh lực đi xuống, dễ mệt và chùn bước; mặt tốt là chín chắn, biết tiết chế', 'Bệnh': 'nhịp chậm lại, sức khỏe dễ yếu, hay mệt; mặt tốt là biết lắng nghe cơ thể', 'Tử': 'năng lượng lặng, thiếu sức bật, dễ trì trệ; mặt tốt là hợp suy ngẫm, nghiên cứu',
  'Mộ': 'tích lũy, giữ gìn; mặt trái là khép kín, chậm bộc lộ', 'Tuyệt': 'hay đứt quãng, việc đang làm dễ gãy giữa chừng; mặt tốt là dứt khoát bỏ cái cũ được', 'Thai': 'ấp ủ ý tưởng mới; mặt trái là còn mơ hồ, chưa thành hình', 'Dưỡng': 'được nuôi dưỡng, chờ thời; mặt trái là dễ thụ động, dựa dẫm'
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
function tuviTrinhTu_(tv, ct) {
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
  var y1 = { binh: 'Gốc và ngọn cùng một hành: bạn thuộc mẫu người nhất quán, nghĩ sao làm vậy, ít mâu thuẫn nội tâm; mặt trái là một chiều, khó xoay khi hoàn cảnh đổi.',
    sinh: 'Gốc nuôi ngọn: nỗ lực sớm của bạn dễ đơm hoa kết trái; mặt trái là bạn hay cho đi nhiều, dễ hao sức vì người khác.',
    duoc_sinh: 'Ngọn nuôi gốc: bạn có xu hướng được hoàn cảnh, người xung quanh nâng đỡ; mặt trái là dễ ỷ lại, tự lực kém.',
    khac: 'Gốc lấn ngọn: ý chí mạnh, tự gánh được việc; mặt trái là hay gồng một mình, cứng với người thân, đời vất vả hơn cần thiết.',
    bi_khac: 'Ngọn lấn gốc: hoàn cảnh hay chi phối kế hoạch của bạn, dự định dễ bị đảo lộn, thấy mình bị động; mặt tốt là bạn quen thích nghi. Gợi ý: chuẩn bị kỹ và chọn thời điểm.' }[q1];
  buoc('Can – Chi năm sinh', [y1], ['Năm ' + I.namCanChi + ': can ' + I.canNam + ' hành ' + hc + ', chi ' + I.chiNam + ' hành ' + hch + ' → ' + ttQuanHe_(hc, hch, 'can', 'chi').txt + '.'], q1 === 'bi_khac' || q1 === 'khac' ? 'xau' : 'tot');

  // 2. Mệnh cục, mùa sinh, chính tinh thủ mệnh
  var mua = TT_MUA[Math.floor(((I.lunar.month || 1) - 1) / 3)];
  buoc('Mệnh, Cục, mùa sinh và sao thủ Mệnh', ['Bạn mang bản mệnh hành ' + mh + ', sinh vào mùa ' + mua[0].toLowerCase() + ' (khí ' + mua[1] + ' vượng). ' + ((M.chinh || []).length ? 'Phần bản thân có yếu tố chủ đạo: tính cách định hình rõ từ sớm, đổi lại khó thay đổi khi cần.' : 'Phần bản thân không có yếu tố chủ đạo: bạn mềm dẻo, dễ thích nghi; mặt trái là thiếu chính kiến, dễ bị môi trường và người xung quanh kéo theo.')],
    ['Bản mệnh ' + I.banMenh.ten + ' (' + mh + ') · ' + I.cuc + ' (' + I.cucHanh + ') · sinh tháng ' + I.lunar.month + ' âm lịch, mùa ' + mua[0] + ' (' + mua[1] + ').', 'Mệnh an tại ' + M.chiTen + ': ' + chinhTxt(M) + '.']);

  // 3. Các tương quan
  var ky3 = [], tot3 = 0, tong3 = 0;
  function tq(a, b, ta, tb) { var r = ttQuanHe_(a, b, ta, tb); ky3.push(r.txt + (r.tot ? ' – thuận' : ' – nghịch') + '.'); tong3++; if (r.tot) tot3++; }
  tq(mh, I.cucHanh, 'Mệnh', 'Cục');
  tq(mh, mua[1], 'Mệnh', 'mùa sinh');
  if ((M.chinh || [])[0]) tq(mh, M.chinh[0].h, 'Mệnh', 'sao ' + M.chinh[0].n);
  tq(mh, ['Thủy', 'Kim', 'Hỏa', 'Mộc'][I.menh % 4], 'Mệnh', 'tam hợp cung Mệnh');
  tq(mh, CHI_HANH[I.menh], 'Mệnh', 'cung Mệnh ' + M.chiTen);
  buoc('Tương quan Mệnh – Cục – mùa – sao – tam hợp', [tot3 >= tong3 - 1 ? 'Các yếu tố gốc của bạn phần lớn hòa hợp: bạn có xu hướng gặp thuận lợi tự nhiên, ít phải chống chọi; mặt trái là ít bị thử thách nên khi gặp biến cố lớn dễ lúng túng.' : tot3 >= tong3 / 2 ? 'Các yếu tố gốc nửa thuận nửa nghịch: đời có giai đoạn suôn sẻ và có giai đoạn vấp ngã thật; thành bại phụ thuộc nhiều vào lựa chọn của bạn.' : 'Nhiều yếu tố gốc nghịch nhau: bạn thường phải tự lực vượt khó, làm nhiều được ít, dễ mệt mỏi và thấy mình kém may. Mặt tốt: bản lĩnh và kinh nghiệm tích lũy rất dày. Gợi ý: chọn môi trường hợp hành ' + mh + '.'],
    ky3, tot3 >= tong3 - 1 ? 'tot' : tot3 >= tong3 / 2 ? 'vua' : 'xau');

  // 4. Khí chất âm dương ngũ hành
  var hanhChinh = (M.chinh || []).map(function (s) { return s.h; });
  var hanhTroi = hanhChinh[0] || CHI_HANH[I.menh];
  var lyThuan = (I.menh % 2 === 0) === (I.yCan % 2 === 0);
  buoc('Khí chất âm dương – ngũ hành', ['Bạn thuộc mẫu người ' + (TT_KHI_CHAT[hanhTroi] || '') + '. ' + (lyThuan ? 'Nhịp âm dương của lá số cùng chiều: việc dễ thuận khi bạn làm đúng sở trường; ra ngoài sở trường thì không có lợi thế gì.' : 'Nhịp âm dương của lá số không cùng chiều: bạn có xu hướng phải đi đường vòng, tốn công hơn người khác cho cùng một kết quả; mặt tốt là quen kiên trì.')],
    [I.amDuong + ', Mệnh đóng cung ' + (I.menh % 2 === 0 ? 'dương' : 'âm') + ' → ' + (lyThuan ? 'thuận lý' : 'nghịch lý') + '.', 'Ngũ hành chính tinh Mệnh: ' + (hanhChinh.join(', ') || '— (mượn hành cung ' + CHI_HANH[I.menh] + ')') + '.'], lyThuan ? 'tot' : 'vua');

  // 5. Tinh hệ Tử Vi
  var tvc = pos['Tử Vi'], he = TT_TU_VI_HE[tvc % 6];   // Tý/Ngọ, Sửu/Mùi, Dần/Thân, Mão/Dậu, Thìn/Tuất, Tỵ/Hợi
  buoc('Tinh hệ Tử Vi', ['Lá số thuộc một trong sáu "bộ khung" lớn – bộ của bạn cho thấy: ' + he[1] + '.'], [he[0] + ' (sao Tử Vi tại ' + CHI[tvc] + ', cung ' + byChi[tvc].cung + ').']);

  // 6. Chính tinh thủ mệnh
  var sang = (M.chinh || []).filter(function (s) { return /^[MVĐ]$/.test(s.b || ''); }).length, ham = (M.chinh || []).filter(function (s) { return s.b === 'H'; }).length;
  buoc('Chính tinh thủ Mệnh', [(M.chinh || []).length === 0 ? 'Phần bản thân không có yếu tố chủ, nên đọc thêm cung đối diện (ra ngoài): bạn có xu hướng mượn sức hoàn cảnh để định hình bản thân; mặt trái là dễ dao động, phụ thuộc môi trường.' : sang && !ham ? 'Yếu tố chủ của bản thân đắc thế: năng lực bẩm sinh dễ phát huy và được công nhận; mặt trái là dễ chủ quan, ít chịu rèn.' : ham ? 'Yếu tố chủ của bản thân ở thế yếu: tài năng có nhưng mặt xấu của tính cách lộ rõ hơn, dễ bị đánh giá thấp và lận đận; mặt tốt là rèn được thì rất bền.' : 'Yếu tố chủ của bản thân ở mức bình: không có lợi thế sẵn, cũng không có điểm yếu lớn; thành quả tỷ lệ thuận với công sức bỏ ra.'],
    ['Mệnh (' + M.chiTen + '): ' + chinhTxt(M) + '.', 'Điểm cung Mệnh: ' + M.diem10 + '/10.'], sang && !ham ? 'tot' : ham ? 'xau' : 'vua');

  // 7. Cung an Thân
  buoc('Cung an Thân', [TT_THAN_CU[I.thanCu] || 'Thân là nơi bạn "sống" nửa sau cuộc đời.'], ['Thân cư ' + I.thanCu + ' (' + CHI[I.than] + '): ' + chinhTxt(byChi[I.than]) + '.']);

  // 8. Tứ sinh – tứ mộ – tứ chính
  var nhom = I.menh % 3 === 0 ? 0 : I.menh % 3 === 1 ? 1 : 2;
  buoc('Mệnh ở Tứ sinh – Tứ mộ – Tứ chính', [TT_TU_SINH.y[nhom]], ['Mệnh tại ' + M.chiTen + ' thuộc ' + TT_TU_SINH.ten[nhom] + '.']);

  // 9. Cung Phúc
  var PH = cungTen['Phúc Đức'];
  buoc('Cung Phúc Đức', ['Phúc phần của bạn ở mức ' + muc(PH.diem10) + '. ' + (PH.diem10 >= 5.5 ? 'Lá số gợi ý bạn có chỗ dựa từ gia đình, dòng họ, gặp khó thường có người giúp; mặt trái là dễ ỷ lại – bạn hãy đối chiếu với trải nghiệm thật.' : 'Lá số gợi ý chỗ dựa từ gia đình, dòng họ mỏng: gặp khó ít người đỡ, tinh thần dễ chông chênh – bạn hãy đối chiếu với trải nghiệm thật. Mặt tốt: bạn tự xây được điểm tựa riêng.')],
    ['Phúc Đức (' + PH.chiTen + '): ' + chinhTxt(PH) + ' · điểm ' + PH.diem10 + '/10.'], PH.diem10 >= 5.5 ? 'tot' : 'vua');

  // 10–12. Ba vòng sao tại Mệnh
  var tt = M.thaiTue || '', lt = M.bacSi || '', ts = M.trangSinh || '';
  buoc('Vòng Thái Tuế', ['Về thái độ sống, bạn có xu hướng ' + (TT_THAI_TUE[tt] || 'cân bằng') + '.'], ['Mệnh gặp ' + tt + ' (vòng Thái Tuế).'], /Tang Môn|Tuế Phá|Điếu Khách/.test(tt) ? 'vua' : 'tot');
  buoc('Vòng Lộc Tồn', ['Về tài lực và cơ hội, bạn ' + (TT_LOC_TON[lt] || 'ở mức trung bình') + '.'], ['Mệnh gặp ' + lt + ' (vòng Lộc Tồn – Bác Sĩ).' + (trongTP('Lộc Tồn') ? ' Lộc Tồn chiếu Mệnh (' + cungCo('Lộc Tồn') + ').' : '')], /Đại Hao|Tiểu Hao|Phục Binh|Quan Phủ|Phi Liêm|Bệnh Phù/.test(lt) ? 'vua' : 'tot');
  buoc('Vòng Tràng Sinh', ['Sinh lực của Mệnh: ' + (TT_TRANG_SINH[ts] || '') + '.'], ['Mệnh gặp ' + ts + ' (vòng Tràng Sinh).'], /Tràng Sinh|Quan Đới|Lâm Quan|Đế Vượng|Dưỡng/.test(ts) ? 'tot' : 'vua');

  // 13–16. Các nhóm sao trong Mệnh và tam phương tứ chính
  function nhomSao(ds) { return ds.filter(function (n) { return trongTP(n); }).map(function (n) { return ttTenSao_(n) + ' (' + cungCo(n) + ')'; }); }
  var cat = nhomSao(TT_LUC_CAT), sat = nhomSao(TT_LUC_SAT), quy = nhomSao(TT_LUC_QUY), duc = nhomSao(TT_TU_DUC);
  buoc('Lục cát tinh', [cat.length >= 3 ? 'Bạn có xu hướng được người tốt giúp đỡ, học hành – thi cử – giấy tờ thuận lợi; mặt trái là quen có người đỡ nên tự lực kém đi.' : cat.length ? 'Có một vài yếu tố trợ lực: có người giúp nhưng không thường xuyên, phần lớn vẫn phải tự lo.' : 'Bạn có xu hướng tự thân lập nghiệp, ít được ai đỡ, học hành – giấy tờ phải tự lo nhiều; mặt tốt là thành quả hoàn toàn là của bạn.'],
    [cat.length ? 'Trong Mệnh – tam phương tứ chính: ' + cat.join(', ') + ' (' + cat.length + '/6).' : 'Không có lục cát tinh trong Mệnh – tam phương tứ chính.'], cat.length >= 3 ? 'tot' : cat.length ? 'vua' : 'xau');
  buoc('Lục sát tinh', [sat.length >= 3 ? 'Bạn có xu hướng gặp nhiều thử thách, va chạm, biến cố hơn người khác, dễ hao tiền, hao sức và có rủi ro thân thể khi liều; mặt tốt là có sức bật và bản lĩnh.' : sat.length ? 'Có một vài áp lực, biến động thật: có giai đoạn bị ngáng, va chạm hoặc hao hụt; mặt tốt là quen chịu áp lực.' : 'Ít yếu tố gây trở ngại: đời khá êm; mặt trái là ít bị rèn nên dễ chủ quan.'],
    [sat.length ? 'Trong Mệnh – tam phương tứ chính: ' + sat.join(', ') + ' (' + sat.length + '/6).' : 'Không có lục sát tinh trong Mệnh – tam phương tứ chính.'], sat.length >= 3 ? 'xau' : sat.length ? 'vua' : 'tot');
  buoc('Lục quý tinh', [quy.length >= 2 ? 'Bạn có xu hướng được trọng vọng, có ân nhân và danh dự; mặt trái là áp lực giữ hình ảnh, nợ ân tình.' : 'Ít được ai nâng đỡ về danh tiếng: được biết đến chậm hơn người khác; mặt tốt là thành quả đều do chính bạn tạo ra.'],
    [quy.length ? quy.join(', ') + '.' : 'Không có lục quý tinh trong Mệnh – tam phương tứ chính.'], quy.length >= 2 ? 'tot' : 'vua');
  buoc('Nhóm tứ đức', [duc.length ? 'Bạn có xu hướng hiền lành, biết nghĩ cho người khác, gặp chuyện xấu thường nhẹ đi; mặt trái là hiền quá dễ bị lợi dụng.' : 'Ít yếu tố che chở: gặp chuyện xấu thường phải tự chịu, không có gì làm nhẹ đi; mặt tốt là bạn quen tự đứng vững.'],
    [duc.length ? duc.join(', ') + '.' : 'Không có sao tứ đức trong Mệnh – tam phương tứ chính.'], duc.length ? 'tot' : 'vua');

  // 17. Tuần – Triệt
  var tuan = P.filter(function (p) { return p.tuan; }).map(function (p) { return p.cung; }), triet = P.filter(function (p) { return p.triet; }).map(function (p) { return p.cung; });
  var tTrMenh = M.tuan || M.triet, tTrThan = byChi[I.than].tuan || byChi[I.than].triet;
  buoc('Tuần – Triệt', [tTrMenh ? 'Phần bản thân trong lá số bị "chặn" một phần: theo cách luận truyền thống, bạn có xu hướng lận đận, bị cản ở giai đoạn đầu, việc dễ đứt giữa chừng, và bứt lên rõ hơn từ khoảng 30 tuổi – bạn hãy đối chiếu với trải nghiệm thật. Mặt tốt: điểm xấu của lá số cũng bị giảm bớt.' : 'Phần bản thân không bị chặn: năng lực được thể hiện trực tiếp, không phải chờ thời; mặt trái là điểm xấu cũng lộ ra trực tiếp, không được giảm nhẹ.' + (tTrThan ? ' Riêng nửa sau cuộc đời có lúc chững lại, kế hoạch dễ đứt quãng.' : '')],
    ['Tuần tại ' + (tuan.join(', ') || '—') + ' · Triệt tại ' + (triet.join(', ') || '—') + '.'], tTrMenh ? 'vua' : 'tot');

  // 18. Không vong
  var kv = [];
  if (M.tuan) kv.push('Tuần'); if (M.triet) kv.push('Triệt');
  if (M.bacSi === 'Đại Hao' || cungCo('Đại Hao') === 'Mệnh') kv.push('Đại Hao');
  if (M.trangSinh === 'Tuyệt') kv.push('Tuyệt');
  if (o(I.menh, 'Thiên Hư')) kv.push('Thiên Hư');
  if (o(I.menh, 'Địa Không')) kv.push('Địa Không');
  buoc('Nhóm sao Không vong', [kv.length >= 2 ? 'Bạn có xu hướng sống thiên về tinh thần, ít bám chấp vật chất, hợp nghề sáng tạo, nghiên cứu, tâm linh; mặt trái là thành quả hay đến rồi đi, tiền khó giữ, đầu cơ dễ mất.' : kv.length ? 'Có một chút "khoảng trống" trong phần bản thân: có lúc hụt hẫng, mất phương hướng, cái có được dễ vơi; mặt tốt là ít bị vật chất trói buộc.' : 'Phần bản thân không vướng nhóm không vong: bạn thực tế, giữ được thành quả; mặt trái là dễ nặng về vật chất.'],
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
  chuDe('Công việc – nguy cơ gián đoạn', 'Quan Lộc', 'Sự nghiệp có xu hướng ổn định và thăng tiến, hợp vị trí được giao trách nhiệm; mặt trái là áp lực lớn, dễ lấn thời gian cho gia đình.', 'Sự nghiệp đi lên từng bước, có lúc chững lại hoặc bị người khác vượt qua; lơ là chuyên môn là mất chỗ đứng.', 'Công việc dễ thay đổi, có giai đoạn gián đoạn, mất việc hoặc thu nhập tụt hẳn; mặt tốt là bạn tích được nhiều kỹ năng. Gợi ý: giữ một nghề tay trái và quỹ dự phòng 6 tháng.',
    function (c, sc) { return sc.indexOf('Địa Không') >= 0 || sc.indexOf('Địa Kiếp') >= 0 ? 'Sự nghiệp có xu hướng có những khúc rẽ bất ngờ, có lần mất trắng công sức hoặc phải làm lại; mặt tốt là hợp nghề tự do, sáng tạo hơn là một đường thẳng.' : ''; });
  chuDe('Tiền tài – lúc thiếu hụt', 'Tài Bạch', 'Tiền bạc có xu hướng đến đều, bạn biết kiếm và biết giữ; mặt trái là dễ bị người khác nhờ vả, vay mượn.', 'Tiền bạc đủ dùng nhưng khó dư dả; có những khoản chi bất ngờ làm vơi quỹ.', 'Tài chính có xu hướng lên xuống mạnh: có giai đoạn hụt tiền, nợ nần hoặc mất tiền vì đầu tư theo phong trào; mặt tốt là bạn xoay xở nhanh. Gợi ý: lập ngân sách, tránh vay mượn lớn.',
    function (c, sc) { return trongTP('Lộc Tồn') || sc.indexOf('Hóa Lộc') >= 0 ? 'Có "lộc" chiếu về: cơ hội tài chính thường đến qua chính công việc chuyên môn; mặt trái là dễ chủ quan, tiêu trước khi tiền về.' : ''; });
  chuDe('Tình duyên – đa tình hay muộn duyên', 'Phu Thê', 'Tình duyên có xu hướng êm ấm, người đồng hành dễ là chỗ dựa; mặt trái là dựa nhau nhiều nên biến cố đến thì hụt hẫng.', 'Tình cảm có lúc êm lúc sóng, có giai đoạn căng thẳng, lạnh nhạt thật sự.', 'Đường tình nhiều trắc trở: dễ muộn duyên, chọn nhầm người, hôn nhân có giai đoạn xa cách hoặc đổ vỡ; mặt tốt là bạn sống độc lập được. Gợi ý: không vội quyết khi đang rối.',
    function (c) {
      var dh = TT_DAO_HOA.filter(function (n) { return o(I.menh, n) || o(c.chi, n); }).length, co = ['Cô Thần', 'Quả Tú'].filter(function (n) { return o(I.menh, n) || o(c.chi, n); }).length;
      return dh >= 2 ? 'Bạn có sức hút, nhiều người để ý; mặt trái là dễ rối chuyện tình cảm, ghen tuông, người thứ ba.' : co ? 'Bạn có xu hướng kén chọn hoặc ngại mở lòng, dễ muộn duyên và có giai đoạn cô đơn kéo dài.' : '';
    });
  chuDe('Con cái – muộn hay ít con', 'Tử Tức', 'Chuyện con cái có xu hướng thuận, gắn bó với con là nguồn vui lâu dài; mặt trái là dễ nuông chiều.', 'Con cái tốn nhiều thời gian, công sức và tiền bạc; có giai đoạn hai thế hệ không hiểu nhau.', 'Chuyện con cái vất vả: có thể muộn con, con khó dạy hoặc xa cách cha mẹ; mặt tốt là công sức bỏ ra thường được đền đáp về sau. Gợi ý: lắng nghe con nhiều hơn răn dạy.');
  chuDe('Sức khỏe và gieo – gặt', 'Tật Ách', 'Theo cổ học, sức khỏe của bạn khá nhẹ: nền thể chất vững, sống điều độ thì dễ được đáp lại bằng sức bền; mặt trái là khỏe nên dễ chủ quan, làm quá sức, bệnh âm thầm tới khi có tuổi. Có dấu hiệu lạ hãy đi khám, hỏi bác sĩ.', 'Sức khỏe ở mức vừa: có lúc mệt mỏi kéo dài hoặc bệnh vặt, sức bền kém dần nếu sinh hoạt thất thường. Lá số không thay lời bác sĩ – nên khám định kỳ.', 'Sức khỏe là điểm yếu: dễ ốm, suy nhược, bệnh dễ dây dưa và tái đi tái lại nếu sinh hoạt thất thường; mặt tốt là bạn biết giữ gìn sớm. Lá số không thay lời bác sĩ – có dấu hiệu lạ hãy đi khám.',
    function (c) {
      var BENH = { 'Tử Vi': 'dạ dày, tỳ vị, đầy bụng khó tiêu', 'Thiên Phủ': 'dạ dày, tiêu hóa, thừa cân', 'Thiên Cơ': 'gan mật, thần kinh, mất ngủ, đau đầu', 'Thái Dương': 'mắt, tim mạch, huyết áp cao, đau nửa đầu', 'Thái Âm': 'thận, mắt, nội tiết, rối loạn kinh nguyệt hoặc tiểu đường', 'Vũ Khúc': 'phổi, hô hấp, ho kéo dài, xương khớp', 'Thiên Đồng': 'thận, bàng quang, tiết niệu, tai', 'Liêm Trinh': 'máu huyết, bệnh phụ khoa – sinh dục, da, trĩ', 'Tham Lang': 'gan, thận, sinh dục, bệnh do rượu bia', 'Cự Môn': 'miệng họng, viêm họng, dạ dày, đường ruột', 'Thiên Tướng': 'da, dị ứng, bàng quang, tiết niệu', 'Thiên Lương': 'dạ dày, tim, bệnh vặt kéo dài khi về già', 'Thất Sát': 'phổi, hô hấp, đường ruột, trĩ, thương tích', 'Phá Quân': 'thận, đường ruột, sinh dục, thương tích' };
      var ds = (c.chinh || []).map(function (s) { return BENH[s.n]; }).filter(function (x) { return x; });
      var cau = ds.length ? 'Theo sách cổ, bạn có xu hướng dễ mắc bệnh về ' + ds.join('; ') + ' – đây là điểm nên khám định kỳ, không phải chẩn đoán. ' : '';
      return cau + (PH.diem10 >= 5.5 ? 'Phúc phần tốt nên gặp khó dễ có người giúp.' : 'Phúc phần mỏng nên lúc ốm đau ít người đỡ, phải tự lo nhiều.');
    });
  chuDe('Xa quê lập nghiệp', 'Thiên Di', 'Ra ngoài dễ gặp may, xa quê lập nghiệp thuận lợi; mặt trái là xa gia đình, gốc rễ ở quê dễ lỏng.', 'Ở quê hay đi xa đều được: không có lợi thế lớn, cũng không có trở ngại lớn.', 'Ra ngoài dễ gặp trục trặc: khó hòa nhập, có thể thiệt về tiền hoặc gặp người xấu nơi xa; mặt tốt là bạn thạo đời dần. Gợi ý: có người quen dẫn đường.',
    function (c) { return o(I.menh, 'Thiên Mã') || o(c.chi, 'Thiên Mã') || I.thanCu === 'Thiên Di' ? 'Lá số có dấu hiệu hay di chuyển, đổi chỗ ở: càng đi càng mở mang, nhưng khó ổn định một chỗ.' : ''; });
  var NB = cungTen['Nô Bộc'], TD = cungTen['Thiên Di'];
  buoc('Quan hệ xã hội (Di – Nô)', [(NB.diem10 + TD.diem10) / 2 >= 6 ? 'Bạn có xu hướng được bạn bè, đồng nghiệp quý mến và giúp đỡ; mặt trái là quan hệ rộng thì tốn thời gian, tiền bạc và dễ bị nhờ vả.' : (NB.diem10 + TD.diem10) / 2 >= 4.5 ? 'Quan hệ xã hội ở mức vừa: có người tốt, có người chỉ đến khi có lợi.' : 'Bạn có xu hướng hay bị phụ lòng trong quan hệ: cộng sự bỏ ngang, bạn bè khó nhờ lúc cần, dễ bị lợi dụng; mặt tốt là người chọn kỹ thì rất bền. Gợi ý: thỏa thuận rõ ràng từ đầu.'],
    ['Thiên Di (' + TD.chiTen + '): ' + chinhTxt(TD) + ' · ' + TD.diem10 + '/10.', 'Nô Bộc (' + NB.chiTen + '): ' + chinhTxt(NB) + ' · ' + NB.diem10 + '/10.'], (NB.diem10 + TD.diem10) / 2 >= 6 ? 'tot' : 'vua');

  // 26. Vận hạn: đại vận, tiểu hạn, năm xung, tam tai
  var vy = I.viewYear, chiNam = ttMod_(vy - 4), DH = byChi[I.daiHanNow], TH = byChi[I.tieuHanNow];
  var xung = ttMod_(chiNam - I.yChi) === 6, tamTai = (TT_TAM_TAI[I.yChi] || []).indexOf(chiNam) >= 0;
  var thSao = TH ? [].concat(TH.chinh || [], TH.cat || [], TH.hung || []).filter(function (s) { return !s.hoaOf; }).map(function (s) { return s.n; }).slice(0, 10) : [];
  var de26 = [];
  // 16/11 (rà soát logic): mức vận lấy đúng từ mục Đại vận / Tiểu vận (điểm vận có lưu tinh, Tứ Hóa vận) – trước lấy điểm gốc
  // của cung nên lệch bậc với mục Tiểu vận ở 53% lá số. Không có chiTiet thì lùi về điểm cung như cũ.
  var dvNay = ct && (ct.daiVan || []).filter(function (d) { return d.isNow; })[0], tvNay = ct && ct.tieuVan;
  function mucVan(v, cung) { return v && v.danhGia ? '"' + String(v.danhGia).toLowerCase() + '"' : muc(cung.diem10); }
  if (DH) de26.push('Đại vận 10 năm hiện tại (từ ' + DH.daiHan + ' tuổi) ở mức ' + mucVan(dvNay, DH) + '.');
  if (TH) de26.push('Vận năm ' + vy + ' ở mức ' + mucVan(tvNay && tvNay.nam === vy ? tvNay : null, TH) + '.');
  if (xung) de26.push('Năm ' + vy + ' xung tuổi (theo lịch cổ, năm này đối nhau với tuổi của bạn): nhiều chuyển động hơn thường lệ, dễ có thay đổi ngoài ý muốn về chỗ ở, công việc hoặc quan hệ. Gợi ý: cân nhắc kỹ trước quyết định lớn.');
  if (tamTai) de26.push('Năm ' + vy + ' rơi vào hạn tam tai: theo quan niệm xưa, đây là một trong ba năm liền dễ gặp trục trặc về tiền bạc, đi lại hoặc sức khỏe. Gợi ý: cân nhắc kỹ việc lớn.');
  if (!xung && !tamTai) de26.push('Năm ' + vy + ' không phạm năm xung hay tam tai.');
  buoc('Đại vận và tiểu vận', de26, [
    DH ? 'Đại vận tại ' + DH.cung + ' (' + DH.chiTen + ', ' + DH.daiHan + '–' + (DH.daiHan + 9) + ' tuổi): ' + chinhTxt(DH) + ' · ' + DH.diem10 + '/10.' : '',
    TH ? 'Tiểu hạn ' + vy + ' (' + I.viewCanChi + ', ' + I.tuoi + ' tuổi) tại ' + TH.cung + ' (' + TH.chiTen + ')' + (thSao.length ? ': ' + thSao.join(', ') : '') + '.' : '',
    'Năm xung: ' + (xung ? 'có (' + CHI[chiNam] + ' xung ' + CHI[I.yChi] + ')' : 'không') + ' · Tam tai tuổi ' + CHI[I.yChi] + ': các năm ' + (TT_TAM_TAI[I.yChi] || []).map(function (c) { return CHI[c]; }).join(', ') + (tamTai ? ' – năm nay phạm' : '') + '.'
  ].filter(Boolean), xung || tamTai ? 'xau' : (dvNay ? chuanHoa10_(dvNay.diem) >= 6 : DH && DH.diem10 >= 6)   /* chiTiet.daiVan.diem là điểm thô → quy thang 10 (rà soát Đợt 2) */ ? 'tot' : 'vua');

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
  'Sức khỏe và gieo – gặt': { cung: ['Tật Ách'] },
  'Xa quê lập nghiệp': { cung: ['Thiên Di'], tp: ['Bên trong và bên ngoài'] },
  'Quan hệ xã hội (Di – Nô)': { cung: ['Nô Bộc'] },
  'Đại vận và tiểu vận': { vanThaiTue: 1, saoHan: 1 }
};
