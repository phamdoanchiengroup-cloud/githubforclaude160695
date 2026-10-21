/**
 * TuViTamPhap.gs – Tử Vi đối chiếu các phái (bổ sung cho LuanGiai.gs)
 *
 *  1. Ba vòng nhân sinh (phái Thiên Lương – "Tử Vi Nghiệm Lý"; Tử Vi Chân Cơ):
 *     - Vòng Thái Tuế = thế đứng, tư tưởng, cách sống (4 nhóm tam hợp)
 *     - Vòng Lộc Tồn (Bác Sĩ) = thực lực, của cải, phương tiện (4 nhóm)
 *     - Vòng Tràng Sinh = nhịp sức sống, thịnh suy (4 nhóm)
 *     - Tám thế Mệnh – Thân so với hành tam hợp của Thái Tuế; Mệnh – Di; Tuế Lộc
 *     - Đại vận đi qua tam hợp Thái Tuế = "đắc thời" (Thái Tuế chính danh, Quan Phù nhờ
 *       tính toán, Bạch Hổ vất vả)
 *  2. Phi Tinh (phái Tứ Hóa / Khâm Thiên – Đài Loan, hiện đại, cổ thư ít ghi → tham khảo,
 *     không cộng điểm): Lai Nhân cung, tự hóa, phi hóa từ – vào cung Mệnh, Kỵ xung Mệnh.
 *
 *  Gọi từ LuanGiai.gs › luanChiTiet (có typeof, thiếu file vẫn chạy).
 *  Văn "de" (dễ hiểu) không nêu tên sao; tên sao chỉ nằm trong "ky" (cơ sở kỹ thuật).
 */

// Nhóm tam hợp vòng Thái Tuế, theo (chi cung − chi năm) mod 4
var TP_TT_NHOM = [
  { ten: 'Tuế – Hổ – Phù', sao: 'Thái Tuế, Quan Phù, Bạch Hổ', the: 'chính danh',
    de: 'Bạn thuộc mẫu người sống theo lẽ phải, coi trọng nguyên tắc và danh dự; nói thẳng, dám nhận trách nhiệm, thường được người khác nể trọng dù có lúc chưa thấy mình may mắn.',
    luu: 'Sự thẳng thắn dễ thành cứng nhắc hoặc va chạm lời nói. Giữ lý tưởng nhưng mềm cách nói, linh hoạt cách làm thì đi được xa.' },
  { ten: 'Dương – Phù – Đức', sao: 'Thiếu Dương, Tử Phù, Phúc Đức', the: 'lanh lợi',
    de: 'Bạn có xu hướng sáng dạ, nhanh nhạy, biết nắm thời cơ và thường gặp thuận lợi sớm.',
    luu: 'Dễ muốn phần hơn hoặc quá tin vào sự khôn ngoan của mình. Giữ lòng tốt và sự ngay thẳng thì thành quả mới bền, tuổi già mới yên.' },
  { ten: 'Tang – Phá – Điếu', sao: 'Tang Môn, Tuế Phá, Điếu Khách', the: 'đấu tranh',
    de: 'Bạn có xu hướng nhạy cảm với điều bất công, hay thấy chưa vừa ý với hoàn cảnh và muốn thay đổi cái cũ; có năng lượng, tháo vát, ăn nói có sức thuyết phục.',
    luu: 'Bất mãn kéo dài dễ dẫn tới tranh cãi, kiện tụng hoặc làm việc trái ý mình. Thành công đến khi bạn biến sự không hài lòng thành quyết tâm có kế hoạch, thay vì phàn nàn.' },
  { ten: 'Âm – Long – Trực', sao: 'Thiếu Âm, Long Đức, Trực Phù', the: 'nhẫn nại',
    de: 'Bạn thuộc mẫu người khiêm nhường, chân thành, nhẫn nại, biết tiến biết lui và làm tròn bổn phận.',
    luu: 'Hiền quá dễ bị lấn át, công sức bị người khác nhận phần, hoặc cả tin. Hãy nói rõ đóng góp của mình và thận trọng trước lời hứa hẹn; biết đủ thì an vui.' }
];

// Nhóm tam hợp vòng Lộc Tồn (Bác Sĩ), theo chỉ số vòng mod 4 (Bác Sĩ luôn đồng cung Lộc Tồn)
var TP_LT_NHOM = [
  { ten: 'Lộc – Tướng – Bệnh', sao: 'Lộc Tồn (Bác Sĩ), Tướng Quân, Bệnh Phù',
    de: 'Thực lực vững: có khả năng tích lũy của cải và đứng ở vị trí dẫn dắt; tính sáng sủa, rộng rãi.',
    luu: 'Khi đã có vị thế, tránh độc đoán, áp đặt – đó chính là lúc dễ đi xuống.' },
  { ten: 'Lực – Tấu – Hao', sao: 'Lực Sĩ, Tấu Thư, Đại Hao',
    de: 'Thực lực đến từ học hỏi cộng trải nghiệm: chữ nghĩa phải đi kèm va chạm thực tế mới thành uy tín.',
    luu: 'Đừng chỉ học trên sách; chấp nhận đi ra ngoài để lấy kinh nghiệm, nhưng giữ kỷ luật chi tiêu.' },
  { ten: 'Long – Liêm – Phục', sao: 'Thanh Long, Phi Liêm, Phục Binh',
    de: 'Trực giác tốt, hay gặp may, cơ hội thường đến nhanh.',
    luu: 'Khi thời cơ tới dễ hành động vội mà bỏ qua rủi ro ẩn; hãy dừng lại kiểm tra trước khi quyết.' },
  { ten: 'Hao – Hỷ – Phủ', sao: 'Tiểu Hao, Hỷ Thần, Quan Phủ',
    de: 'Vui vẻ, hào phóng, dễ được lòng người.',
    luu: 'Hào phóng quá đà dễ hối tiếc; cẩn thận giấy tờ và lời hứa để tránh thị phi, tranh chấp.' }
];

// Nhóm tam hợp vòng Tràng Sinh, theo chỉ số vòng mod 4
var TP_TS_NHOM = [
  { ten: 'Sinh – Vượng – Mộ', sao: 'Tràng Sinh, Đế Vượng, Mộ',
    de: 'Sức sống bền: từ lúc khởi đầu tới khi chín muồi đều có người nâng đỡ, qua khó khăn thường gặp quý nhân.',
    luu: 'Thuận lợi dễ làm chủ quan; giữ nhịp đều đặn thì phúc dày thêm.' },
  { ten: 'Dục – Suy – Tuyệt', sao: 'Mộc Dục, Suy, Tuyệt',
    de: 'Tuổi trẻ dễ chao đảo, cần gia đình làm chỗ dựa; gặp vận kém dễ hụt hơi.',
    luu: 'Xây nền ổn định sớm (nghề vững, quỹ dự phòng) và tránh liều lĩnh khi vận chưa thuận.' },
  { ten: 'Đới – Bệnh – Thai', sao: 'Quan Đới, Bệnh, Thai',
    de: 'Rủi ro thường nhiều hơn may; việc lớn cần tìm hiểu kỹ và hỏi người có kinh nghiệm.',
    luu: 'Tham vọng quá sức dễ ảnh hưởng sức khỏe; biết đủ là phúc.' },
  { ten: 'Quan – Tử – Dưỡng', sao: 'Lâm Quan, Tử, Dưỡng',
    de: 'Có những lúc thành đạt rõ rệt, nhưng thịnh rồi dễ chững lại.',
    luu: 'Thành công chớ khoe khoang; giữ khiêm tốn thì sau mỗi lần chững lại sẽ hồi phục mạnh hơn.' }
];

// Hành tam hợp cục theo chi mod 4: Thân-Tý-Thìn Thủy, Tỵ-Dậu-Sửu Kim, Dần-Ngọ-Tuất Hỏa, Hợi-Mão-Mùi Mộc
var TP_HANH_TAM_HOP = ['Thủy', 'Kim', 'Hỏa', 'Mộc'];

// Lĩnh vực đời thường của 12 cung (dùng cho văn dễ hiểu Phi Tinh)
var TP_LV = {
  'Mệnh': 'chính mình', 'Huynh Đệ': 'anh chị em, cộng sự gần', 'Phu Thê': 'hôn nhân, người bạn đời',
  'Tử Tức': 'con cái, sự sáng tạo', 'Tài Bạch': 'tiền bạc, nguồn lực', 'Tật Ách': 'sức khỏe, thân thể',
  'Thiên Di': 'môi trường bên ngoài, đi xa', 'Nô Bộc': 'bạn bè, đồng nghiệp, khách hàng',
  'Quan Lộc': 'công việc, sự nghiệp', 'Điền Trạch': 'nhà cửa, gia đình, tài sản tích lũy',
  'Phúc Đức': 'đời sống tinh thần, phúc phần dòng họ', 'Phụ Mẫu': 'cha mẹ, cấp trên, giấy tờ, học vấn'
};

var TP_TU_HOA_Y = [
  'có duyên tự nhiên trong chuyện {lv}, rộng rãi, nhưng cái được dễ đến rồi đi – nên giữ lại một phần',
  'muốn tự quyết, tự nắm phần chủ động trong chuyện {lv}; tốt nhất khi vẫn biết lắng nghe',
  'coi trọng sự chỉn chu, thể diện trong chuyện {lv}; được tiếng tốt nhưng đôi khi cầu toàn',
  'hay tự lo, tự ôm chuyện {lv}, dễ hụt hoặc thu hẹp lại; nên chia sẻ bớt và có phương án dự phòng'
];
var TP_HOA = ['Lộc', 'Quyền', 'Khoa', 'Kỵ'];

function tpMod4_(x) { return ((x % 4) + 4) % 4; }
function tpLv_(cung) { return (TP_LV[cung] || cung.toLowerCase()); }

/** Ba vòng của một cung pi */
function tpBaVong_(chart, pi) {
  var P = chart.palaces[pi], I = chart.info;
  var tt = tpMod4_(pi - I.yChi);
  var lt = P.bacSi ? tpMod4_(VONG_BAC_SI.indexOf(P.bacSi)) : -1;
  var ts = P.trangSinh ? tpMod4_(VONG_TRANG_SINH.indexOf(P.trangSinh)) : -1;
  return { tt: tt, lt: lt, ts: ts, ttSao: P.thaiTue || '', ltSao: P.bacSi || '', tsSao: P.trangSinh || '' };
}

/** Tám thế Mệnh – Thân so với Thái Tuế (theo hành tam hợp) – phái Thiên Lương */
function tpTheMenhThan_(I) {
  var hTT = TP_HANH_TAM_HOP[I.yChi % 4], hM = TP_HANH_TAM_HOP[I.menh % 4], hT = TP_HANH_TAM_HOP[I.than % 4];
  var rM = quanHeHanh(hM, hTT), rT = quanHeHanh(hT, hTT);
  var khac = function (r) { return r === 'khac' || r === 'bi_khac'; };
  var cung = hM === hT, ma = 0, ten = '', de = '';
  if (rM === 'binh' && rT === 'binh') { ma = 3; ten = 'Quân tử chính danh'; de = 'Suy nghĩ (Mệnh) và việc làm về sau (Thân) cùng nhịp với thế chính danh: lời nói và hành động đi cùng một hướng. Càng sống ngay, chỗ đứng của bạn càng vững.'; }
  else if (rM === 'binh' && khac(rT)) { ma = 1; ten = 'Lý tưởng một đằng, cách làm một nẻo'; de = 'Lý tưởng của bạn chính danh, nhưng cách làm ở nửa sau cuộc đời dễ lệch khỏi lý tưởng ấy; người ngoài có thể thấy lời và việc chưa khớp. Thỉnh thoảng hãy tự soát: việc mình đang làm có đúng điều mình vẫn nói không.'; }
  else if (rT === 'binh' && khac(rM)) { ma = 2; ten = 'Lời cứng, việc ngay'; de = 'Lời nói có thể gai góc, cứng rắn, nhưng việc làm lại quang minh, đàng hoàng. Mềm lời đi một chút để người khác thấy được cái tâm của bạn.'; }
  else if (cung && khac(rM)) { ma = 4; ten = 'Người phản biện'; de = 'Cả trong suy nghĩ lẫn hành động đều hay đi ngược dòng chung: dễ bất mãn kéo dài, thường đứng ở phía phản biện, đối lập. Năng lượng này rất hợp vai trò cải tổ, góp ý – miễn là có mục tiêu xây dựng.'; }
  else if (rM === 'duoc_sinh' && rT === 'sinh') { ma = 5; ten = 'Khôn khéo, mềm ngoài cứng trong'; de = 'Ngoài mặt nhún nhường, nhưng khi hành động lại chủ động giành phần. Khéo léo là lợi thế lớn, chỉ cần giữ minh bạch để không mất lòng tin.'; }
  else if (cung && rM === 'sinh') { ma = 6; ten = 'Người có tham vọng'; de = 'Có tham vọng, hay chủ động tiến lên, muốn dẫn dắt. Tôn trọng không gian của người khác thì tham vọng sẽ thành sức kéo chứ không thành áp đặt.'; }
  else if (cung && rM === 'duoc_sinh') { ma = 7; ten = 'Hiền hòa, hay nhường'; de = 'Hiền lành, dễ nhường nhịn đến mức chịu thiệt. Hãy học cách từ chối và bảo vệ quyền lợi chính đáng của mình.'; }
  else if (rM === 'sinh' && rT === 'duoc_sinh') { ma = 8; ten = 'Nghĩ hay hơn làm'; de = 'Nghĩ hay, nói hay nhưng đến lúc làm dễ hụt hơi. Chia mục tiêu thành từng bước nhỏ và làm đến nơi đến chốn sẽ bù được điểm này.'; }
  else {
    var mo = { binh: 'hợp với thế chính danh', sinh: 'hướng ra đóng góp cho cái chung, dễ hao sức', duoc_sinh: 'được hoàn cảnh nâng đỡ, đôi khi dễ ỷ lại', khac: 'hay đi ngược dòng, dễ va chạm', bi_khac: 'thường chịu sức ép của hoàn cảnh, phải gồng mình' };
    ten = 'Mệnh – Thân khác nhịp';
    de = 'Về suy nghĩ, bạn ' + mo[rM] + '; về cách làm ở nửa sau cuộc đời, bạn ' + mo[rT] + '. Nhận ra hai nhịp này giúp bạn chủ động cân bằng giữa điều mình nghĩ và điều mình làm.';
  }
  return { ma: ma, ten: ten, de: de,
    ky: 'Hành tam hợp: Thái Tuế (chi năm ' + CHI[I.yChi] + ') ' + hTT + ', Mệnh (' + CHI[I.menh] + ') ' + hM + ' → ' + rM + ', Thân (' + CHI[I.than] + ') ' + hT + ' → ' + rT + (ma ? ' – thế ' + ma + '/8 của phái Thiên Lương.' : ' – ngoài 8 thế điển hình, luận theo từng vế.') };
}

var TP_MENH_DI = [
  'Bên trong bạn sống theo lẽ phải, nhưng môi trường bên ngoài hay có người phản bác, chống đối. Bản lĩnh cộng với sự khéo léo sẽ biến đối thủ thành người tôn trọng bạn.',
  'Bạn lanh lợi, nhưng môi trường bên ngoài thường chậm và cần sự nhẫn nại. Kiên nhẫn hơn một nhịp, bạn sẽ được việc hơn.',
  'Bạn hay thấy chưa vừa ý, nhưng ra ngoài lại gặp những khuôn phép và người có thế lực. Học cách hợp tác với "người có quyền" thay vì đối đầu sẽ mở đường cho bạn.',
  'Bạn hiền và chân thành, còn môi trường bên ngoài nhiều người lanh lợi, dễ lấn lướt. Giữ sự tỉnh táo, đừng vội tin lời hứa hẹn.'
];

var TP_VAN_TT = [
  null, // nhóm Tuế – Hổ – Phù: xử lý riêng theo sao
  'vận thuận nhờ lanh lợi, cơ hội đến sớm; giữ sự ngay thẳng để tránh "được rồi lại mất".',
  'vận dễ bất mãn, va chạm, muốn thay đổi; nên kiên trì theo kế hoạch, tránh kiện tụng, tranh cãi.',
  'vận cần mẫn, ít được ghi nhận; nên tích lũy lặng lẽ và biết đủ.'
];
var TP_VAN_TUE = {
  'Thái Tuế': 'vận đắc thời một cách chính đáng – việc làm được thừa nhận, có tiếng nói.',
  'Quan Phù': 'vận đắc thời nhờ tính toán, giấy tờ, thủ tục – nên làm việc có phương án rõ ràng.',
  'Bạch Hổ': 'vận đắc thời nhưng phải làm việc vất vả, xông pha – giữ sức khỏe.'
};
var TP_VAN_LT = ['tài lực dồi dào', 'thực lực đến từ học hỏi, trải nghiệm', 'nhiều cơ hội bất ngờ, cần thận trọng', 'chi tiêu, giao tế nhiều'];

/** Lai Nhân cung: cung có can trùng can năm sinh (bỏ Tý, Sửu) */
function tpLaiNhan_(chart) {
  var I = chart.info;
  for (var i = 2; i < 12; i++) if (chart.palaces[i].can === I.yCan) return i;
  return -1;
}

/** Tập hợp phi hóa: từ cung pi, bốn hóa theo can cung rơi vào cung nào */
function tpPhi_(chart, pi) {
  var can = chart.palaces[pi].can, sao = chart.tuHoa[can], out = [];
  for (var h = 0; h < 4; h++) out.push({ hoa: h, sao: sao[h], toi: chart.pos[sao[h]] });
  return out;
}

function tpPhiTinh_(chart) {
  var P = chart.palaces, I = chart.info, menh = I.menh, di = mod12(menh + 6);
  var ln = tpLaiNhan_(chart), res = { laiNhan: null, tuHoa: [], menhPhi: [], nhapMenh: [], kyXung: [], khac: [], ky: [] };
  if (ln >= 0) {
    var cn = P[ln].cung;
    res.laiNhan = { cung: cn, chi: CHI[ln],
      de: cn === 'Mệnh'
        ? 'Cung "nguồn cội" nằm ngay ở bản thân bạn: đời bạn thuộc kiểu tự lập, phúc họa phần lớn do chính mình quyết định, ít phải dựa vào gia đình hay người khác.'
        : 'Cung "nguồn cội" nằm ở ' + cn + ': chủ đề xuyên suốt đời bạn hay xoay quanh ' + tpLv_(cn) + '; nhiều cơ hội và cả bài học lớn đều khởi từ đây.' };
    res.ky.push('Lai Nhân cung: can năm ' + CAN[I.yCan] + ' trùng can cung ' + CAN[P[ln].can] + ' ' + CHI[ln] + ' (' + cn + '); bỏ qua Tý, Sửu vì can lặp với Dần, Mão.');
  }
  for (var pi = 0; pi < 12; pi++) {
    tpPhi_(chart, pi).forEach(function (f) {
      if (f.toi === pi) {
        res.tuHoa.push({ cung: P[pi].cung, hoa: TP_HOA[f.hoa], de: P[pi].cung + ' tự hóa ' + TP_HOA[f.hoa] + ': ' + TP_TU_HOA_Y[f.hoa].replace('{lv}', tpLv_(P[pi].cung)) + '.' });
        res.ky.push('Cung ' + P[pi].cung + ' (can ' + CAN[P[pi].can] + ') tự hóa ' + TP_HOA[f.hoa] + ' tại ' + f.sao + '.');
      } else if (pi === menh && (f.hoa === 0 || f.hoa === 3) && f.toi != null) {
        var c2 = P[f.toi].cung;
        res.menhPhi.push(f.hoa === 0
          ? 'Bạn dồn tình cảm, công sức (và thường được đền đáp) vào chuyện ' + tpLv_(c2) + '.'
          : 'Điều bạn hay canh cánh, thấy như mình còn "nợ", là chuyện ' + tpLv_(c2) + '.');
        res.ky.push('Mệnh (can ' + CAN[P[pi].can] + ') phi Hóa ' + TP_HOA[f.hoa] + ' (' + f.sao + ') nhập ' + c2 + '.');
      } else if (pi !== menh && f.toi === menh && (f.hoa === 0 || f.hoa === 3)) {
        res.nhapMenh.push(f.hoa === 0
          ? 'Chuyện ' + tpLv_(P[pi].cung) + ' thường mang lại lợi ích, niềm vui cho bạn.'
          : 'Chuyện ' + tpLv_(P[pi].cung) + ' là nơi dễ đem phiền lụy, trách nhiệm đến cho bạn.');
        res.ky.push(P[pi].cung + ' (can ' + CAN[P[pi].can] + ') phi Hóa ' + TP_HOA[f.hoa] + ' (' + f.sao + ') nhập Mệnh.');
      } else if (pi !== menh && pi !== di && f.hoa === 3 && f.toi === di) {
        res.kyXung.push('Chuyện ' + tpLv_(P[pi].cung) + ' dễ gây xáo trộn, đẩy bạn ra khỏi vùng an toàn – nên chủ động chuẩn bị.');
        res.ky.push(P[pi].cung + ' phi Hóa Kỵ (' + f.sao + ') nhập Thiên Di, xung Mệnh.');
      }
      if ((P[pi].cung === 'Tài Bạch' || P[pi].cung === 'Quan Lộc') && f.hoa === 3 && f.toi != null && f.toi !== pi) {
        var dich = P[f.toi].cung;
        res.khac.push(P[pi].cung === 'Tài Bạch'
          ? 'Tiền bạc của bạn hay bị cuốn vào, hoặc hao vì chuyện ' + tpLv_(dich) + ' – nên có ngân sách riêng cho khoản này.'
          : 'Công việc hay khiến bạn bận lòng về chuyện ' + tpLv_(dich) + '.');
        res.ky.push(P[pi].cung + ' (can ' + CAN[P[pi].can] + ') phi Hóa Kỵ (' + f.sao + ') nhập ' + dich + '.');
      }
    });
  }
  return res;
}

/** Hàm chính: trả về chiTiet.tamPhap */
function tpLap_(chart, daiVan) {
  var I = chart.info, P = chart.palaces;
  var M = tpBaVong_(chart, I.menh), T = tpBaVong_(chart, I.than), D = tpBaVong_(chart, mod12(I.menh + 6));
  var de = [], ky = [];
  var nTT = TP_TT_NHOM[M.tt], nLT = M.lt >= 0 ? TP_LT_NHOM[M.lt] : null, nTS = M.ts >= 0 ? TP_TS_NHOM[M.ts] : null;
  de.push({ t: 'Thế đứng (cách nghĩ, cách sống)', v: nTT.de + ' ' + nTT.luu });
  if (nLT) de.push({ t: 'Thực lực (của cải, phương tiện)', v: nLT.de + ' ' + nLT.luu });
  if (nTS) de.push({ t: 'Nhịp sức sống', v: nTS.de + ' ' + nTS.luu });
  if (I.than !== I.menh) {
    var tT = TP_TT_NHOM[T.tt];
    de.push({ t: 'Nửa sau cuộc đời', v: T.tt === M.tt ? 'Về sau bạn vẫn giữ nguyên thế đứng này – tính cách nhất quán từ trẻ đến già.' : 'Về sau thế đứng của bạn chuyển sang kiểu "' + tT.the + '": ' + tT.de.replace(/^Bạn (thuộc mẫu người|có xu hướng) /, '').replace(/^./, function (c) { return c.toLowerCase(); }) });
  } else {
    de.push({ t: 'Nửa sau cuộc đời', v: 'Thân và Mệnh cùng một cung: tính cách nhất quán từ trẻ đến già, "nói sao làm vậy".' });
  }
  var the = tpTheMenhThan_(I);
  de.push({ t: 'Lời nói và việc làm', v: the.de });
  de.push({ t: 'Bên trong và bên ngoài', v: TP_MENH_DI[M.tt] });

  // Tuế Lộc: Lộc Tồn nằm trong tam hợp Thái Tuế
  var lt = chart.pos['Lộc Tồn'], tueLoc = lt != null && tpMod4_(lt - I.yChi) === 0;
  var dvSong = (daiVan || []).filter(function (d) { return parseInt(d.khoang, 10) <= 90; });
  var dvLoc = dvSong.filter(function (d) { var pi = CHI.indexOf(d.chi); return pi >= 0 && lt != null && tpMod4_(pi - lt) === 0; }).map(function (d) { return d.khoang; });
  de.push({ t: 'Lộc thực', v: tueLoc
    ? 'Nguồn lộc nằm đúng trong thế chính danh của bạn: làm đúng việc của mình là có thực lộc, của cải bền theo suốt đời.'
    : 'Nguồn lộc không nằm sẵn trong thế đứng gốc, nên thực lộc rõ nhất vào những giai đoạn vận đi qua vùng có lộc' + (dvLoc.length ? ' (khoảng ' + dvLoc.join(', ') + ')' : '') + '. Hãy tích lũy mạnh trong những giai đoạn ấy.' });

  ky.push('Vòng Thái Tuế tại Mệnh: ' + (M.ttSao || '?') + ' – nhóm ' + nTT.ten + ' (' + nTT.sao + ').');
  if (nLT) ky.push('Vòng Lộc Tồn tại Mệnh: ' + M.ltSao + ' – nhóm ' + nLT.ten + ' (' + nLT.sao + ').');
  if (nTS) ky.push('Vòng Tràng Sinh tại Mệnh: ' + M.tsSao + ' – nhóm ' + nTS.ten + ' (' + nTS.sao + ').');
  if (I.than !== I.menh) ky.push('Thân cư ' + I.thanCu + ': Thái Tuế ' + T.ttSao + ' (nhóm ' + TP_TT_NHOM[T.tt].ten + '), Lộc Tồn ' + T.ltSao + ', Tràng Sinh ' + T.tsSao + '.');
  ky.push('Thiên Di: ' + D.ttSao + ' (nhóm ' + TP_TT_NHOM[D.tt].ten + ') – Mệnh và Di luôn đối nhau: Tuế ↔ Tang, Dương ↔ Âm.');
  ky.push(the.ky);
  ky.push('Lộc Tồn tại ' + (lt != null ? CHI[lt] : '?') + (tueLoc ? ' nằm trong tam hợp Thái Tuế → cách "Tuế Lộc" (cụ Thiên Lương xếp trên cách Mã Lộc).' : ' không nằm trong tam hợp Thái Tuế.'));

  // Đại vận theo vòng Thái Tuế
  var van = dvSong.map(function (d) {
    var pi = CHI.indexOf(d.chi);
    if (pi < 0) return null;
    var bv = tpBaVong_(chart, pi);
    var loi = bv.tt === 0 ? (TP_VAN_TUE[bv.ttSao] || 'vận đắc thời.') : TP_VAN_TT[bv.tt];
    if (bv.lt >= 0) loi += ' Về tiền bạc: ' + TP_VAN_LT[bv.lt] + '.';
    return { khoang: d.khoang, nam: d.nam, cung: d.cung, isNow: d.isNow, dacThoi: bv.tt === 0, nhom: TP_TT_NHOM[bv.tt].the, de: loi.charAt(0).toUpperCase() + loi.slice(1),
      ky: 'Cung ' + d.cung + ' (' + d.chi + '): ' + bv.ttSao + ' · ' + bv.ltSao + ' · ' + bv.tsSao };
  }).filter(Boolean);

  return {
    baVong: { de: de, ky: ky, menh: { tt: nTT.ten, lt: nLT && nLT.ten, ts: nTS && nTS.ten }, the: { ma: the.ma, ten: the.ten }, tueLoc: tueLoc },
    vanThaiTue: van,
    phiTinh: tpPhiTinh_(chart),
    coSo: [
      'Ba vòng nhân sinh theo phái Thiên Lương (sách "Tử Vi Nghiệm Lý") và bài giảng "Ba vòng nhân sinh" của Tử Vi Chân Cơ: vòng Thái Tuế là thế đứng – tư tưởng, vòng Lộc Tồn là thực lực, vòng Tràng Sinh là nhịp thịnh suy; mỗi vòng chia 4 nhóm tam hợp.',
      'Tám thế Mệnh – Thân so với hành tam hợp của Thái Tuế (Thân Tý Thìn Thủy, Tỵ Dậu Sửu Kim, Dần Ngọ Tuất Hỏa, Hợi Mão Mùi Mộc) theo tâm pháp phái Thiên Lương.',
      'Đại vận đi qua tam hợp Thái Tuế là "đắc thời": tại Thái Tuế thì chính đáng, tại Quan Phù nhờ tính toán, tại Bạch Hổ phải vất vả.',
      'Phi Tinh (Tứ Hóa phái, Khâm Thiên môn) là trường phái hiện đại phát triển ở Đài Loan từ thập niên 1980; sách cổ ("Tử Vi Đẩu Số Toàn Thư") chỉ có Tứ Hóa năm sinh, không có phi hóa theo can cung. Phần này chỉ để tham khảo, không cộng vào điểm cung.',
      'Văn luận nêu các nhóm theo nghĩa phổ biến; cụ Thiên Lương nhấn mạnh phải phối với cách cục và chính tinh mới quyết đoán được – xem thêm Phần 1 và từng cung.'
    ]
  };
}
