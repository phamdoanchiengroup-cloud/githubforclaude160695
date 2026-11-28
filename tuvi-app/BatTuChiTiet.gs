/**
 * ============================================================
 *  BatTuChiTiet.gs — LUẬN BÁT TỰ CHI TIẾT THEO CUNG VỊ
 *  1. Cung vị tứ trụ: Niên (tổ nghiệp, 1–16t), Nguyệt (cha mẹ, anh em, 17–32t),
 *     Nhật (bản thân & phu thê, 33–48t), Thời (con cái, hậu vận, 49t+)
 *  2. Lục thân theo thập thần (cha, mẹ, vợ/chồng, con, anh em)
 *  3. Cách cục: chính cách theo nguyệt lệnh thấu can (Tử Bình Chân Thuyên),
 *     ngoại cách (Tòng, Chuyên vượng, Hóa khí) – điều kiện thành/bại
 *  4. Thập thần & tính cách – nghề nghiệp
 *  5. Ngũ hành & tạng phủ
 *  6. Thần sát mở rộng
 *  7. Đại vận tác động lên cung vị
 * ============================================================
 */

var BTCT_CUNG_VI = [
  { tru: 'Năm', ten: 'Niên trụ', tuoi: '1–16 tuổi', can: 'ông bà, tổ nghiệp, cha (theo cung)', chi: 'gốc gác, quê hương, mẹ (theo cung)',
    y: 'Tổ nghiệp, gia thế, môi trường tuổi thơ; theo cổ học, hỷ thần ở đây gợi ý nền tảng gia đình thuận, tuổi nhỏ yên ổn; kỵ thần ở đây thì tuổi nhỏ thiếu thốn, gia đình nhiều lo toan – bạn hãy đối chiếu với trải nghiệm thật.' },
  { tru: 'Tháng', ten: 'Nguyệt trụ', tuoi: '17–32 tuổi', can: 'cha, anh chị em cùng giới', chi: 'mẹ, anh chị em khác giới – "môn hộ", nền tảng sự nghiệp',
    y: 'Cha mẹ, anh em, môi trường học tập – lập nghiệp thời thanh niên; nguyệt lệnh là gốc sức mạnh của cả lá số.' },
  { tru: 'Ngày', ten: 'Nhật trụ', tuoi: '33–48 tuổi', can: 'bản thân (Nhật chủ)', chi: 'người phối ngẫu – cung phu thê',
    y: 'Bản thân và hôn nhân, giai đoạn trung niên; nhật chi là cung phu thê, cho biết tính cách và mức hòa hợp của vợ/chồng.' },
  { tru: 'Giờ', ten: 'Thời trụ', tuoi: '49 tuổi trở đi', can: 'con cái (con trưởng)', chi: 'con cái, hậu vận, cấp dưới – học trò',
    y: 'Con cái, hậu vận, thành quả cuối đời; hỷ thần ở đây gợi ý tuổi già an nhàn, con cái đỡ đần; kỵ thần ở đây thì về già vẫn phải lo toan, ít được con cái đỡ.' }
];

var BTCT_TT_NHOM = { 'Tỷ Kiên': 'Tỷ Kiếp', 'Kiếp Tài': 'Tỷ Kiếp', 'Thực Thần': 'Thực Thương', 'Thương Quan': 'Thực Thương',
  'Thiên Tài': 'Tài', 'Chính Tài': 'Tài', 'Thất Sát': 'Quan Sát', 'Chính Quan': 'Quan Sát', 'Thiên Ấn': 'Ấn', 'Chính Ấn': 'Ấn' };

var BTCT_NHOM_Y = {
  'Tỷ Kiếp': { tc: 'tự lập, cá tính mạnh, trọng bạn bè, thích cạnh tranh, nhưng cố chấp, dễ hao tiền vì bạn bè', nghe: 'kinh doanh độc lập, thể thao, hợp tác nhóm, môi giới', thieu: 'thiếu tự tin, dễ bị lấn, ít người hỗ trợ ngang hàng' },
  'Thực Thương': { tc: 'sáng tạo, khéo léo, ăn nói, thích thể hiện, tư duy phản biện, nhưng dễ nói quá lời, khó chịu gò bó', nghe: 'nghệ thuật, truyền thông, giảng dạy, ẩm thực, công nghệ, tư vấn', thieu: 'khó bộc lộ tài năng, ít ý tưởng mới, dễ bị coi là nhạt' },
  'Tài': { tc: 'thực tế, nhạy bén tiền bạc, giỏi quản lý nguồn lực, nhưng dễ thực dụng, nặng tính toán', nghe: 'tài chính, kinh doanh, thương mại, kế toán, đầu tư', thieu: 'ít duyên tiền bạc, quản lý tiền kém, dễ túng thiếu' },
  'Quan Sát': { tc: 'kỷ luật, trách nhiệm, có tổ chức, chịu áp lực tốt, nhưng cứng nhắc, hay tự gây áp lực cho mình', nghe: 'quản lý, hành chính, quân đội – công an, luật, kỹ thuật', thieu: 'thiếu kỷ luật, khó gắn bó tổ chức, ít chức vụ' },
  'Ấn': { tc: 'ham học, nhân hậu, sâu sắc, thiên về tinh thần, nhưng dễ ỷ lại, chậm hành động', nghe: 'giáo dục, nghiên cứu, y dược, văn hóa, tôn giáo – tâm linh', thieu: 'ít được che chở, học vấn phải tự lực, tinh thần dễ bất an' }
};

var BTCT_TANG_PHU = {
  // 24/11: chủ dự án chốt nêu thẳng nhóm bệnh sách cổ gắn với từng hành (vẫn là "dễ", kèm lời nhắc bác sĩ ở câu cuối mục)
  'Mộc': 'vùng gan – mật, gân cơ, mắt và cảm xúc (dễ mắc bệnh gan, men gan cao, sỏi mật, đau mắt, co rút gân cơ, cáu giận – trầm uất)',
  'Hỏa': 'tim – mạch, huyết áp và giấc ngủ (dễ mắc bệnh tim mạch, huyết áp cao, hồi hộp, mất ngủ, nhiệt miệng)',
  'Thổ': 'dạ dày – tiêu hóa (dễ mắc đau dạ dày, viêm loét dạ dày, khó tiêu, đại tràng, tiểu đường, thừa cân)',
  'Kim': 'phổi, đường hô hấp và da (dễ mắc viêm phế quản, ho kéo dài, hen, viêm mũi xoang, bệnh ngoài da, táo bón)',
  'Thủy': 'thận – tiết niệu, xương khớp và sức chịu lạnh (dễ mắc bệnh thận, sỏi thận, viêm đường tiết niệu, bệnh sinh dục, đau lưng mỏi gối, ù tai)'
};

// Thiên Đức quý nhân theo chi tháng: {t: 'can'|'chi', v: index}
var BTCT_THIEN_DUC = { 2: ['can', 3], 3: ['chi', 8], 4: ['can', 8], 5: ['can', 7], 6: ['chi', 11], 7: ['can', 0],
  8: ['can', 9], 9: ['chi', 2], 10: ['can', 2], 11: ['can', 1], 0: ['chi', 5], 1: ['can', 6] };
var BTCT_NGUYET_DUC = [8, 6, 2, 0]; // theo nhóm tam hợp chi tháng: Thân Tý Thìn→Nhâm, Tỵ Dậu Sửu→Canh, Dần Ngọ Tuất→Bính, Hợi Mão Mùi→Giáp
var BTCT_THAI_CUC = [[0, 6], [0, 6], [3, 9], [3, 9], [1, 4, 7, 10], [1, 4, 7, 10], [2, 11], [2, 11], [5, 8], [5, 8]];

function btctHyKy_(bt, hanh) {
  if (hanh === bt.goiY.dung) return 'Dụng';
  if (bt.goiY.hy.indexOf(hanh) >= 0) return 'Hỷ';
  if (bt.goiY.ky.indexOf(hanh) >= 0) return 'Kỵ';
  return 'Bình';
}

/** Hàm chính */
function batTuChiTiet_(bt, input, tv) {
  var male = input.gender !== 'nu';
  var P = bt.pillars, dCan = bt.nhatChuCan, dm = bt.nhatChuHanh;
  var truTen = ['năm', 'tháng', 'ngày', 'giờ'];

  // --- thống kê thập thần ---
  var ttDem = {}, ttThau = {}, ttViTri = {};
  P.forEach(function (p, i) {
    if (i !== 2) {
      ttDem[p.thapThan] = (ttDem[p.thapThan] || 0) + 1;
      ttThau[p.thapThan] = (ttThau[p.thapThan] || 0) + 1;
      (ttViTri[p.thapThan] = ttViTri[p.thapThan] || []).push('can ' + truTen[i]);
    }
    p.tangCan.forEach(function (t, j) {
      var w = j === 0 ? 0.6 : 0.3;
      ttDem[t.thapThan] = (ttDem[t.thapThan] || 0) + w;
      (ttViTri[t.thapThan] = ttViTri[t.thapThan] || []).push('tàng ' + (j === 0 ? 'chính khí ' : '') + 'chi ' + truTen[i]);
    });
  });
  var nhomDem = {};
  Object.keys(ttDem).forEach(function (k) { var g = BTCT_TT_NHOM[k]; nhomDem[g] = (nhomDem[g] || 0) + ttDem[k]; });
  function co(tt) { return (ttDem[tt] || 0) > 0; }
  function thau(tt) { return (ttThau[tt] || 0) > 0; }

  var out = {};
  out.coSo = [
    'Cung vị: Niên trụ – tổ nghiệp (1–16 tuổi), Nguyệt trụ – cha mẹ, anh em, môn hộ (17–32), Nhật trụ – bản thân và phu thê (33–48), Thời trụ – con cái, hậu vận (49+). "Cung vị định chỗ, thập thần định người": cung cho biết lĩnh vực/giai đoạn, thập thần cho biết lục thân và tính chất.',
    'Hỷ – Kỵ: can chi mang hành Dụng/Hỷ thần ở trụ nào thì lĩnh vực và giai đoạn đó thuận; mang hành Kỵ thần thì trắc trở. Hợp – xung – hình – hại chạm vào trụ nào thì lục thân/giai đoạn đó biến động.',
    'Cách cục (Tử Bình Chân Thuyên): lấy chính khí tàng can của nguyệt lệnh; nếu thấu ra thiên can thì định cách theo đó, nếu không thì xét tàng can khác có thấu. Chính Quan, Tài, Ấn, Thực Thần là "thuận dụng" (cần bảo vệ); Thất Sát, Thương Quan, Kiến Lộc, Dương Nhận là "nghịch dụng" (cần chế hóa).',
    'Lục thân (nam): cha = Thiên Tài, mẹ = Chính Ấn, vợ = Chính Tài, con trai = Thất Sát, con gái = Chính Quan, anh em = Tỷ Kiếp. (nữ): chồng = Chính Quan, người tình = Thất Sát, con trai = Thương Quan, con gái = Thực Thần.'
  ];

  /* ---------- 1. CUNG VỊ ---------- */
  var thanSatMoRong = btctThanSat_(bt, tv);
  out.cungVi = P.map(function (p, i) {
    var cv = BTCT_CUNG_VI[i];
    var hkCan = btctHyKy_(bt, p.canHanh), hkChi = btctHyKy_(bt, CAN_HANH[p.tangCan[0].can]);
    var secs = [];
    var coSo = [cv.ten + ' ' + p.canTen + ' ' + p.chiTen + ' – ' + cv.tuoi + '. ' + cv.y,
      'Thiên can ' + p.canTen + ' (' + p.canHanh + ', ' + (i === 2 ? 'Nhật chủ' : p.thapThan) + ') chủ về ' + cv.can + '; địa chi ' + p.chiTen + ' (' + p.chiHanh + ') chủ về ' + cv.chi + '.',
      'Nạp âm ' + p.napAm + ' (' + p.napAmHanh + '). Nhật chủ ở ' + p.chiTen + ' là "' + p.truongSinh + '"; can ' + p.canTen + ' tự tọa "' + p.tuTruongSinh + '".'];
    secs.push({ tieuDe: 'Cơ sở', items: coSo });

    var tt = [];
    if (i !== 2) tt.push('Can lộ ' + p.thapThan + ' (' + THAP_THAN_Y_NGHIA[p.thapThan] + ') – ' + (hkCan === 'Kỵ' ? '✗ ' : hkCan === 'Bình' ? '◇ ' : '✓ ') + 'hành ' + p.canHanh + ' là ' + hkCan + ' thần.');
    tt.push('Tàng can: ' + p.tangCan.map(function (t, j) { return t.ten + ' ' + t.thapThan + (j === 0 ? ' (chính khí)' : ''); }).join(', ') +
      '. Chính khí hành ' + CAN_HANH[p.tangCan[0].can] + ' là ' + hkChi + ' thần.');
    tt = tt.concat(btctLuanCungRieng_(i, p, bt, male, co, thau));
    secs.push({ tieuDe: 'Thập thần tại cung', items: tt });

    var tuong = bt.quanHe.filter(function (q) { return q.txt.indexOf(p.tru) >= 0 || q.txt.indexOf(p.chiTen) >= 0 && q.txt.indexOf('Tam') === 0; })
      .map(function (q) { return (q.loai === 'hop' ? '✓ ' : q.loai === 'xung' ? '✗ ' : '◇ ') + q.txt; });
    var kv = bt.thanSat.filter(function (t) { return t.ten === 'Không Vong' && t.o.indexOf(p.tru) >= 0 && t.o.indexOf('gặp') >= 0; });
    if (kv.length) tuong.push('✗ Trụ ' + truTen[i] + ' rơi vào Không Vong – lục thân/giai đoạn này dễ hụt hẫng, có mà như không, duyên mỏng.');
    if (!tuong.length) tuong.push('Không có hợp – xung – hình – hại đáng kể chạm vào trụ này: tương đối ổn định, nhưng cũng ít trợ lực từ các trụ khác.');
    secs.push({ tieuDe: 'Tương tác với các trụ khác', items: tuong });

    var ts = thanSatMoRong.filter(function (t) { return t.tru.indexOf(i) >= 0; })
      .map(function (t) { return (t.tot ? '✓ ' : '✗ ') + t.ten + ': ' + t.moTa; });
    if (ts.length) secs.push({ tieuDe: 'Thần sát tại trụ', items: ts });

    var d = (hkCan === 'Dụng' ? 2 : hkCan === 'Hỷ' ? 1.2 : hkCan === 'Kỵ' ? -1.2 : 0) * (i === 2 ? 0 : 1) +
      (hkChi === 'Dụng' ? 2 : hkChi === 'Hỷ' ? 1.2 : hkChi === 'Kỵ' ? -1.4 : 0) +
      tuong.filter(function (x) { return x.charAt(0) === '✗'; }).length * -0.8 + tuong.filter(function (x) { return x.charAt(0) === '✓'; }).length * 0.4 +
      ts.filter(function (x) { return x.charAt(0) === '✓'; }).length * 0.5 - ts.filter(function (x) { return x.charAt(0) === '✗'; }).length * 0.5;
    d = Math.round(d * 10) / 10;
    var ket = d >= 2 ? 'Giai đoạn ' + cv.tuoi + ' thuận lợi, lục thân ở cung này hỗ trợ tốt; mặt trái là dễ ỷ lại.' : d >= 0.5 ? 'Giai đoạn ' + cv.tuoi + ' khá, có trợ lực nhưng vẫn có lúc trắc trở.' :
      d > -1 ? 'Giai đoạn ' + cv.tuoi + ' bình ổn, ít được đỡ, thành bại do nỗ lực.' : 'Giai đoạn ' + cv.tuoi + ' nhiều thử thách: dễ thiếu thốn, vất vả, quan hệ lục thân ở cung này dễ căng thẳng hoặc xa cách.';
    secs.push({ tieuDe: 'Kết luận', items: [ket] });
    return { ten: cv.ten, tru: p.tru, canChi: p.canTen + ' ' + p.chiTen, tuoi: cv.tuoi, diem: d, danhGia: lgXepHang_(d * 1.6), secs: secs };
  });

  /* ---------- 2. LỤC THÂN ---------- */
  out.lucThan = btctLucThan_(bt, male, ttDem, ttThau, ttViTri);

  /* ---------- 3. CÁCH CỤC ---------- */
  out.cachCuc = btctCachCuc_(bt, co, thau, ttDem, nhomDem);

  /* ---------- 4. THẬP THẦN & TÍNH CÁCH ---------- */
  var nhomSort = ['Tỷ Kiếp', 'Thực Thương', 'Tài', 'Quan Sát', 'Ấn'].map(function (g) { return { g: g, v: Math.round((nhomDem[g] || 0) * 10) / 10 }; })
    .sort(function (a, b) { return b.v - a.v; });
  var tc = [];
  tc.push('Phân bố thập thần (can = 1, chính khí tàng can = 0,6, tạp khí = 0,3): ' + nhomSort.map(function (x) { return x.g + ' ' + x.v; }).join(' · ') + '.');
  nhomSort.slice(0, 2).forEach(function (x) {
    if (x.v >= 1) tc.push('✓ ' + x.g + ' nổi bật – tính cách ' + BTCT_NHOM_Y[x.g].tc + '; hợp nghề ' + BTCT_NHOM_Y[x.g].nghe + '.');
  });
  nhomSort.filter(function (x) { return x.v < 0.3; }).forEach(function (x) { tc.push('◇ Thiếu ' + x.g + ' – ' + BTCT_NHOM_Y[x.g].thieu + '; có thể bù bằng môi trường, nghề nghiệp.'); });
  if (co('Thương Quan') && co('Chính Quan')) tc.push('✗ Thương Quan và Chính Quan cùng hiện – dễ va chạm với cấp trên, luật lệ, dễ bất mãn bỏ việc; hợp nghề tự do hoặc chuyên môn.');
  if (co('Thiên Ấn') && co('Thực Thần')) tc.push('✗ Thiên Ấn gặp Thực Thần (kiêu đoạt thực) – dễ bỏ dở, tinh thần u uất, ăn uống – sinh hoạt thất thường.');
  if (co('Thất Sát') && co('Chính Quan')) tc.push('✗ Quan Sát hỗn tạp – dễ phân tâm, nhiều áp lực; (nữ) tình cảm nhiều mối, dễ chọn nhầm người, có thể trải qua đổ vỡ.');
  if ((nhomDem['Tỷ Kiếp'] || 0) >= 2.5 && (nhomDem['Tài'] || 0) > 0) tc.push('✗ Tỷ Kiếp vượng mà có Tài – dễ tranh tài, mất tiền vì hùn hạp, bạn bè.');
  if (co('Thực Thần') && co('Thất Sát')) tc.push('✓ Thực Thần chế Sát – có bản lĩnh xử lý áp lực, hợp vị trí quyền lực; mặt trái là quen sống trong áp lực.');
  if (co('Thất Sát') && co('Chính Ấn')) tc.push('✓ Sát Ấn tương sinh – biến áp lực thành uy tín, hợp quản lý, chuyên môn cao; mặt trái là áp lực thường trực.');
  if (co('Thương Quan') && co('Chính Tài')) tc.push('✓ Thương Quan sinh Tài – kiếm tiền bằng tài năng, sáng tạo; mặt trái là thu nhập lên xuống theo cảm hứng.');
  out.tinhCach = tc;

  /* ---------- 5. NGŨ HÀNH & TẠNG PHỦ ---------- */
  var sk = [];
  HANH_SINH.forEach(function (h) {
    var pct = bt.phanTram[h];
    if (pct >= 30) sk.push('✗ ' + h + ' thái quá (' + pct + '%) – ' + BTCT_TANG_PHU[h] + ' là điểm dễ yếu; đồng thời hành bị ' + h + ' khắc (' + HANH_SINH[(HANH_SINH.indexOf(h) + 2) % 5] + ': ' + BTCT_TANG_PHU[HANH_SINH[(HANH_SINH.indexOf(h) + 2) % 5]] + ') dễ bị lấn át, cũng dễ yếu theo.');
    else if (pct < 8) sk.push('✗ ' + h + ' bất cập (' + pct + '%) – ' + BTCT_TANG_PHU[h] + ' là điểm yếu bẩm sinh; theo cổ học có thể bù bằng màu sắc, thực phẩm, môi trường hành ' + h + '.');
  });
  if (!sk.length) sk.push('✓ Ngũ hành tương đối cân bằng (không hành nào > 30% hay < 8%) – không có điểm yếu nổi bật, nhưng cũng không có thế mạnh vượt trội.');
  sk.push('Nhật chủ ' + dm + ' – theo cổ học gắn với: ' + BTCT_TANG_PHU[dm] + '. Hành Kỵ thần (' + bt.goiY.ky.join(', ') + ') vượng ở đại vận/lưu niên là lúc sức khỏe dễ sa sút; nên khám định kỳ và hỏi bác sĩ khi có dấu hiệu.');
  out.sucKhoe = sk;

  /* ---------- 6. THẦN SÁT MỞ RỘNG ---------- */
  out.thanSat = thanSatMoRong.map(function (t) { return { ten: t.ten, o: t.tru.map(function (i) { return 'trụ ' + truTen[i]; }).join(', '), moTa: t.moTa, tot: t.tot }; });

  /* ---------- 7. ĐẠI VẬN × CUNG VỊ ---------- */
  out.daiVanCungVi = (bt.daiVan || []).map(function (v) {
    var items = [];
    P.forEach(function (p, i) {
      var q = lgQuanHeChi_(v.chi, p.chi);
      var hopCan = Math.abs(v.can - p.can) === 5, khacCan = quanHeHanh(CAN_HANH[v.can], CAN_HANH[p.can]) === 'khac';
      var tenCung = BTCT_CUNG_VI[i].ten + ' (' + ['tổ nghiệp, cha mẹ', 'cha mẹ, anh em, công việc', 'bản thân, hôn nhân', 'con cái, hậu vận'][i] + ')';
      if (khacCan && q.indexOf('lục xung') >= 0) items.push('✗ Thiên khắc địa xung ' + tenCung + ' – biến động lớn ở lĩnh vực này.');
      else if (q.indexOf('lục xung') >= 0) items.push('✗ Chi vận xung ' + tenCung + '.');
      if (q.indexOf('tương hình') >= 0 || q.indexOf('tự hình') >= 0) items.push('✗ Chi vận hình ' + tenCung + ' – thị phi, tổn thương.');
      if (q.indexOf('lục hợp') >= 0 || q.indexOf('tam hợp') >= 0) items.push('✓ Chi vận ' + q.join('/') + ' với ' + tenCung + ' – gắn kết, hỗ trợ; nhưng hợp cũng dễ bị ràng buộc.');
      if (v.can === p.can && v.chi === p.chi) items.push('✗ Đại vận phục ngâm ' + tenCung + ' – giai đoạn lặp lại chuyện cũ, dễ buồn phiền ở lĩnh vực này.');
      if (hopCan) items.push('✓ Can vận hợp can ' + truTen[i] + (i === 2 ? ' (hợp Nhật chủ – duyên phận, hợp tác)' : '') + '.');
    });
    var tt = v.thapThan, nh = BTCT_TT_NHOM[tt];
    var lucThanVan = {
      'Tài': male ? 'vận Tài tinh – tiền bạc, (nam) duyên vợ, cha' : 'vận Tài tinh – tiền bạc, cha',
      'Quan Sát': male ? 'vận Quan Sát – công danh, áp lực, (nam) con cái' : 'vận Quan Sát – công danh, (nữ) duyên chồng',
      'Thực Thương': male ? 'vận Thực Thương – tài năng, sáng tạo, thị phi lời nói' : 'vận Thực Thương – tài năng, (nữ) con cái',
      'Ấn': 'vận Ấn – học vấn, bằng cấp, mẹ, quý nhân che chở',
      'Tỷ Kiếp': 'vận Tỷ Kiếp – bạn bè, cạnh tranh, hùn hạp, dễ hao tài'
    }[nh];
    items.unshift('Can vận ' + CAN[v.can] + ' là ' + tt + ': ' + lucThanVan + '. Hành ' + v.hanhCan + ' (' + btctHyKy_(bt, v.hanhCan) + '), chi ' + CHI[v.chi] + ' hành ' + v.hanhChi + ' (' + btctHyKy_(bt, v.hanhChi) + ').');
    return { canChi: v.canChi, tuoi: v.tuoi, nam: v.nam, danhGia: v.danhGia, items: items };
  });

  /* ---------- 8. LUẬN 12 LĨNH VỰC & LƯU NIÊN TỪNG NĂM (BatTuLuan.gs) ---------- */
  var vyBT = (tv && tv.info && tv.info.viewYear) || parseInt(input.viewYear, 10) || new Date().getFullYear();
  var namAm = (tv && tv.info && tv.info.lunar && tv.info.lunar.year) || parseInt(input.year, 10);
  out.linhVuc = btlLinhVuc_(bt, input, thanSatMoRong, out.cachCuc);
  out.luuNien = btlLuuNien_(bt, input, thanSatMoRong, vyBT, namAm);
  return out;
}

/** Lời luận riêng cho từng cung vị */
function btctLuanCungRieng_(i, p, bt, male, co, thau) {
  var r = [];
  var chinh = p.tangCan[0].thapThan;
  if (i === 0) {
    var k0 = btctHyKy_(bt, p.canHanh) === 'Kỵ', k1 = btctHyKy_(bt, p.chiHanh) === 'Kỵ';
    if (!k0 && !k1) r.push('✓ Niên trụ mang hỷ khí – lá số gợi ý xuất thân ổn, được gia đình nâng đỡ lúc nhỏ; mặt trái là dễ được bao bọc, chậm va chạm đời – bạn hãy đối chiếu với trải nghiệm thật.');
    else if (k0 && k1) r.push('✗ Niên trụ mang kỵ khí cả can lẫn chi – theo cổ học, thuở nhỏ dễ thiếu thốn, gia đình nhiều sóng gió, phải tự lập sớm; bạn hãy tự đối chiếu.');
    else r.push('◇ Niên trụ ' + (k0 ? 'can kỵ, chi hỷ – gợi ý gia đình có lúc áp lực nhưng nền tảng vẫn đỡ đần; bạn hãy tự đối chiếu' : 'can hỷ, chi kỵ – gợi ý gia đình có tiếng nhưng bên trong nhiều lo toan; bạn hãy tự đối chiếu') + '.');
    if (p.thapThan === 'Chính Ấn' || p.thapThan === 'Chính Quan') r.push('✓ Gợi ý tổ nghiệp có nề nếp, gia đình trọng học vấn/danh dự; mặt trái là khuôn phép nặng, kỳ vọng cao.');
    if (p.thapThan === 'Kiếp Tài' || p.thapThan === 'Thương Quan') r.push('◇ Gợi ý tổ nghiệp hay thay đổi, ít được thừa hưởng, phải tự tạo dựng là chính.');
  }
  if (i === 1) {
    r.push('Nguyệt lệnh chính khí ' + p.tangCan[0].ten + ' (' + chinh + ') là "đề cương" của lá số – quyết định cách cục (xem mục Cách cục).');
    if (chinh === 'Chính Ấn' || chinh === 'Thiên Ấn') r.push('✓ Ấn ở nguyệt lệnh – gợi ý được mẹ và bề trên che chở, học hành thuận; mặt trái là dễ dựa dẫm.');
    if (chinh === 'Chính Quan' || chinh === 'Thất Sát') r.push('◇ Quan Sát ở nguyệt lệnh – gợi ý gia đình nề nếp, nghiêm khắc; sớm có ý thức trách nhiệm nhưng tuổi trẻ nhiều áp lực, gò bó.');
    if (chinh === 'Kiếp Tài' || chinh === 'Tỷ Kiên') r.push('◇ Tỷ Kiếp ở nguyệt lệnh – gợi ý anh em, bạn bè dễ cạnh tranh, tranh phần; tự lập sớm.');
    if (chinh === 'Chính Tài' || chinh === 'Thiên Tài') r.push('✓ Tài ở nguyệt lệnh – gợi ý gia đình chú trọng kinh tế, bạn sớm biết kiếm tiền; mặt trái là việc học dễ bị xem nhẹ.');
  }
  if (i === 2) {
    var y = {
      'Chính Tài': male ? '✓ Chính Tài tọa cung phu thê – vợ đảm đang, biết vun vén, hôn nhân ổn định; mặt trái là vợ dễ quản chặt, chuyện tiền bạc hay căng.' : '◇ Chính Tài tọa cung phu thê – chồng thực tế, coi trọng kinh tế gia đình, nhưng dễ khô khan, ít lãng mạn.',
      'Thiên Tài': male ? '◇ Thiên Tài tọa cung phu thê – vợ năng động, hào phóng; nam có sức hút, dễ có người thứ ba chen vào.' : '◇ Thiên Tài tọa cung phu thê – chồng năng động, giao tiếp rộng, nhưng tiêu xài mạnh và dễ đa tình.',
      'Chính Quan': male ? '✓ Chính Quan tọa cung phu thê – vợ đoan chính, gia giáo, nhưng nghiêm, hay đòi hỏi.' : '✓ Chính Quan tọa cung phu thê – chồng đứng đắn, có địa vị, hôn nhân tốt; mặt trái là chồng nghiêm khắc, gia đình nặng khuôn phép.',
      'Thất Sát': male ? '✗ Thất Sát tọa cung phu thê – vợ cá tính mạnh, dễ va chạm, cãi to.' : '✗ Thất Sát tọa cung phu thê – chồng cá tính mạnh, quyết liệt, dễ nóng nảy áp đặt; hôn nhân nhiều sóng gió.',
      'Chính Ấn': '✓ Ấn tọa cung phu thê – người phối ngẫu chu đáo, biết chăm sóc, như người che chở; mặt trái là dễ bao bọc quá mức, mình dễ ỷ lại.',
      'Thiên Ấn': '◇ Thiên Ấn tọa cung phu thê – người phối ngẫu sâu sắc nhưng khó hiểu, ít chia sẻ, vợ chồng dễ lạnh nhạt.',
      'Thực Thần': '✓ Thực Thần tọa cung phu thê – vợ chồng hòa thuận, biết hưởng thụ; mặt trái là dễ an phận, ít cùng nhau phấn đấu.',
      'Thương Quan': male ? '◇ Thương Quan tọa cung phu thê – vợ thông minh, sắc sảo nhưng dễ lời qua tiếng lại, cãi vã.' : '✗ Thương Quan tọa cung phu thê (nữ) – vợ chồng dễ cãi vã, lời nói làm tổn thương nhau, dễ coi nhẹ chồng.',
      'Tỷ Kiên': '◇ Tỷ Kiên tọa cung phu thê – vợ chồng ngang hàng, độc lập; mặt trái là không ai chịu ai, Tỷ Kiếp nhiều thì dễ có người ngoài chen vào.',
      'Kiếp Tài': male ? '✗ Kiếp Tài tọa cung phu thê (nam) – hôn nhân dễ bất hòa vì tiền bạc, dễ có người ngoài chen vào, nguy cơ rạn nứt cao.' : '◇ Kiếp Tài tọa cung phu thê – vợ chồng cạnh tranh, dễ va chạm chuyện tiền bạc.'
    }[chinh];
    if (y) r.push(y);
    var sao = male ? ['Chính Tài', 'Thiên Tài'] : ['Chính Quan', 'Thất Sát'];
    if (p.tangCan.some(function (t) { return sao.indexOf(t.thapThan) >= 0; })) r.push('✓ Phối ngẫu tinh (' + sao.join('/') + ') nằm ngay trong cung phu thê – duyên vợ chồng gắn bó; mặt trái là dễ phụ thuộc vào nhau.');
    if (bt.quanHe.some(function (q) { return q.txt.indexOf('Ngày') >= 0 && q.txt.indexOf('lục xung') >= 0; })) r.push('✗ Cung phu thê bị xung – hôn nhân dễ cãi vã, xa cách, có nguy cơ đổ vỡ; theo cổ học, cưới muộn hoặc mỗi người có không gian riêng (công tác xa…) lại đỡ hơn.');
    r.push('Nhật chủ ' + bt.nhatChu + ' tọa "' + p.truongSinh + '" – ' + (['Trường Sinh', 'Lâm Quan', 'Đế Vượng', 'Quan Đới'].indexOf(p.truongSinh) >= 0 ? 'bản thân có gốc, tự chủ; mặt trái là dễ cố chấp.' : ['Tử', 'Tuyệt', 'Bệnh', 'Mộ'].indexOf(p.truongSinh) >= 0 ? 'gốc rễ yếu, dễ bị hoàn cảnh chi phối, phải dựa vào môi trường và quý nhân.' : 'trung bình.'));
  }
  if (i === 3) {
    var tuTinh = male ? ['Thất Sát', 'Chính Quan'] : ['Thương Quan', 'Thực Thần'];
    var coTuTinh = [p.thapThan].concat(p.tangCan.map(function (t) { return t.thapThan; })).filter(function (x) { return tuTinh.indexOf(x) >= 0; });
    if (coTuTinh.length) r.push('✓ Tử tức tinh (' + coTuTinh.join(', ') + ') có mặt ở cung con cái – con cái hiện diện rõ, có duyên con; mặt trái là con cái cũng là mối bận tâm lớn.');
    else r.push('◇ Cung con cái không có tử tức tinh – duyên con mờ, dễ muộn con hoặc con cái ít gần gũi.');
    var h0 = btctHyKy_(bt, p.canHanh) === 'Kỵ', h1 = btctHyKy_(bt, p.chiHanh) === 'Kỵ';
    if (!h0 && !h1) r.push('✓ Thời trụ mang hỷ khí – hậu vận an nhàn, con cái đỡ đần; mặt trái là về già dễ dựa vào con.');
    else if (h0 && h1) r.push('✗ Thời trụ mang kỵ khí – hậu vận vẫn phải lo toan, ít được con đỡ, tiền bạc tuổi già dễ thiếu.');
    else r.push('◇ Thời trụ nửa hỷ nửa kỵ – hậu vận ổn nhưng còn bận tâm về con cái, sức khỏe tuổi già có điểm yếu.');
  }
  return r;
}

/** Lục thân */
function btctLucThan_(bt, male, ttDem, ttThau, ttViTri) {
  var ds = male ? [
    ['Cha', ['Thiên Tài'], 1], ['Mẹ', ['Chính Ấn'], 1], ['Vợ', ['Chính Tài'], 2], ['Người yêu / vợ lẽ', ['Thiên Tài'], 2],
    ['Con trai', ['Thất Sát'], 3], ['Con gái', ['Chính Quan'], 3], ['Anh chị em', ['Tỷ Kiên', 'Kiếp Tài'], 1]
  ] : [
    ['Cha', ['Thiên Tài'], 1], ['Mẹ', ['Chính Ấn'], 1], ['Chồng', ['Chính Quan'], 2], ['Người tình', ['Thất Sát'], 2],
    ['Con trai', ['Thương Quan'], 3], ['Con gái', ['Thực Thần'], 3], ['Anh chị em', ['Tỷ Kiên', 'Kiếp Tài'], 1]
  ];
  // sao khắc từng thập thần
  var khac = { 'Tài': 'Tỷ Kiếp', 'Ấn': 'Tài', 'Quan Sát': 'Thực Thương', 'Thực Thương': 'Ấn', 'Tỷ Kiếp': 'Quan Sát' };
  var nhom = {};
  Object.keys(ttDem).forEach(function (k) { var g = BTCT_TT_NHOM[k]; nhom[g] = (nhom[g] || 0) + ttDem[k]; });
  var dmIdx = HANH_SINH.indexOf(bt.nhatChuHanh);
  var hanhNhom = { 'Tỷ Kiếp': HANH_SINH[dmIdx], 'Thực Thương': HANH_SINH[(dmIdx + 1) % 5], 'Tài': HANH_SINH[(dmIdx + 2) % 5], 'Quan Sát': HANH_SINH[(dmIdx + 3) % 5], 'Ấn': HANH_SINH[(dmIdx + 4) % 5] };
  var cungTen = ['', 'cung cha mẹ (Niên/Nguyệt trụ)', 'cung phu thê (Nhật chi)', 'cung con cái (Thời trụ)'];
  return ds.map(function (x) {
    var ten = x[0], sao = x[1];
    var dem = sao.reduce(function (a, s) { return a + (ttDem[s] || 0); }, 0);
    var thauN = sao.reduce(function (a, s) { return a + (ttThau[s] || 0); }, 0);
    var vt = [].concat.apply([], sao.map(function (s) { return ttViTri[s] || []; }));
    var g = BTCT_TT_NHOM[sao[0]], hanh = hanhNhom[g];
    var hk = btctHyKy_(bt, hanh);
    var biKhac = (nhom[khac[g]] || 0);
    var items = [];
    items.push('Sao đại diện: ' + sao.join('/') + ' (hành ' + hanh + ', là ' + hk + ' thần). ' +
      (dem ? 'Xuất hiện ' + Math.round(dem * 10) / 10 + ' lần (' + (thauN ? thauN + ' lần thấu can' : 'chỉ tàng trong chi') + '): ' + vt.join(', ') + '.' : 'Không xuất hiện trong tứ trụ.'));
    var d = 0;
    if (!dem) { items.push('◇ Sao ẩn/khuyết – duyên với ' + ten.toLowerCase() + ' mờ nhạt hoặc đến muộn, ít nương tựa được; xét thêm qua đại vận có sao này.'); d -= 0.5; }
    else if (dem >= 2.2) { items.push('◇ Sao quá nhiều – quan hệ phức tạp, "đa ' + ten.toLowerCase() + '" hoặc lệ thuộc, dễ rối và tổn thương.'); d -= 0.3; }
    else { items.push('✓ Sao hiện diện vừa phải – quan hệ rõ ràng, không quá gần cũng không quá xa.'); d += 0.8; }
    if (thauN) { items.push('✓ Thấu lên thiên can – ' + ten.toLowerCase() + ' có vai trò nổi bật, dễ thấy; ảnh hưởng lên bạn cũng mạnh, cả tốt lẫn xấu.'); d += 0.4; }
    if (hk === 'Dụng' || hk === 'Hỷ') { items.push('✓ Là Hỷ/Dụng thần – ' + ten.toLowerCase() + ' mang lại trợ lực, quan hệ tốt đẹp; mặt trái là dễ dựa dẫm.'); d += 1.2; }
    if (hk === 'Kỵ') { items.push('✗ Là Kỵ thần – quan hệ với ' + ten.toLowerCase() + ' dễ gây áp lực, bất đồng, có lúc tổn thương nhau.'); d -= 1; }
    if (dem && biKhac >= dem + 1) { items.push('✗ Bị ' + khac[g] + ' khắc mạnh (' + Math.round(biKhac * 10) / 10 + ') – quan hệ với ' + ten.toLowerCase() + ' dễ trắc trở, xa cách hoặc người đó vất vả.'); d -= 1; }
    // vị trí đúng cung
    if (x[2] === 2 && bt.pillars[2].tangCan.some(function (t) { return sao.indexOf(t.thapThan) >= 0; })) { items.push('✓ Nằm đúng ' + cungTen[2] + ' – gắn bó, chung sống lâu dài; mặt trái là ràng buộc chặt, khó có khoảng riêng.'); d += 0.8; }
    if (x[2] === 3 && [bt.pillars[3].thapThan].concat(bt.pillars[3].tangCan.map(function (t) { return t.thapThan; })).some(function (t) { return sao.indexOf(t) >= 0; })) { items.push('✓ Nằm đúng ' + cungTen[3] + ' – duyên con rõ.'); d += 0.6; }
    if (x[2] === 1 && [0, 1].some(function (i) { var p = bt.pillars[i]; return [p.thapThan].concat(p.tangCan.map(function (t) { return t.thapThan; })).some(function (t) { return sao.indexOf(t) >= 0; }); })) { items.push('✓ Nằm ở ' + cungTen[1] + ' – quan hệ gần gũi từ nhỏ; mặt trái là dễ bị gia đình chi phối.'); d += 0.4; }
    d = Math.round(d * 10) / 10;
    return { ten: ten, sao: sao.join('/'), diem: d, danhGia: lgXepHang_(d * 1.6), secs: [{ tieuDe: 'Phân tích', items: items }] };
  });
}

/** Cách cục */
function btctCachCuc_(bt, co, thau, ttDem, nhomDem) {
  var P = bt.pillars, mc = P[1].chi, dCan = bt.nhatChuCan;
  var items = [], ten = '', loai = '', thanh = null;
  var tang = P[1].tangCan;
  // 1. ngoại cách – lấy từ bộ phân tích 9 bước (BatTuPhanTich.gs) để mọi nơi cùng một kết luận
  var PTC = bt.phanTich && bt.phanTich.cachCuc;
  if (PTC && PTC.dacBiet) {
    ten = PTC.ten; loai = PTC.loai; thanh = true;
    items.push(PTC.yNghia);
    PTC.kiemTra.filter(function (k) { return k.ten === PTC.ten; }).forEach(function (k) { items.push('✓ ' + k.ly); });
    var dtC = bt.phanTich.dungThan;
    items.push('Ngoại cách dùng thần theo thế cách: dụng ' + dtC.dung + ', hỷ ' + dtC.hy.join(', ') + ', kỵ ' + dtC.ky.join(', ') + '.');
  }

  // 2. chính cách (luôn tính để tham khảo)
  var chinhCach = '', lyDoCach = '';
  var thauTang = tang.filter(function (t) { return P.some(function (p, i) { return i !== 2 && p.can === t.can; }); });
  var chon = tang[0];
  if (thauTang.length && thauTang[0].can !== tang[0].can && !P.some(function (p, i) { return i !== 2 && p.can === tang[0].can; })) {
    chon = thauTang[0]; lyDoCach = 'chính khí ' + tang[0].ten + ' không thấu, lấy ' + chon.ten + ' thấu can';
  } else lyDoCach = P.some(function (p, i) { return i !== 2 && p.can === tang[0].can; }) ? 'chính khí ' + tang[0].ten + ' thấu can' : 'chính khí ' + tang[0].ten + ' (không thấu, vẫn lấy chính khí)';
  var tt = chon.thapThan;
  if (tt === 'Tỷ Kiên' || tt === 'Kiếp Tài') {
    if (BAZI_LOC[dCan] === mc) chinhCach = 'Kiến Lộc cách';
    else if (BAZI_DUONG_NHAN[dCan] === mc) chinhCach = 'Dương Nhận cách';
    else chinhCach = 'Nguyệt Kiếp cách';
  } else chinhCach = tt + ' cách';

  var dieuKien = btctDieuKienCach_(chinhCach, co, bt);
  if (!ten) { ten = chinhCach; loai = 'Chính cách (Bát chính cách)'; thanh = dieuKien.thanh; }
  items.push('Chính cách: nguyệt lệnh ' + P[1].chiTen + ' – ' + lyDoCach + ' → ' + chinhCach + '.');
  items = items.concat(dieuKien.items);
  return { ten: ten, loai: loai, thanh: thanh, chinhCach: chinhCach, items: items,
    ketLuan: thanh === true ? 'Cách cục thành – lá số có "khung" rõ ràng, phát triển thuận theo hướng của cách; đi lệch hướng ấy thì khó thành.' : thanh === false ? 'Cách cục bị phá hoặc chưa đủ điều kiện – thành công đến chậm, làm nhiều mà khó thành hình; phải gặp đại vận mang thần cứu ứng (xem Dụng/Hỷ thần) mới phát.' : 'Cần xét thêm đại vận để xác định thành/bại.' };
}

function btctDieuKienCach_(cach, co, bt) {
  var it = [], thanh = true;
  function tot(c, t) { if (c) it.push('✓ ' + t); return c; }
  function xau(c, t) { if (c) { it.push('✗ ' + t); thanh = false; } return c; }
  var thanVuong = bt.vuong;
  switch (cach) {
    case 'Chính Quan cách':
      it.push('Thuận dụng: hỷ Tài sinh Quan, Ấn hộ Quan; kỵ Thương Quan khắc Quan, Thất Sát hỗn tạp, bị xung.');
      tot(co('Chính Tài') || co('Thiên Tài'), 'Có Tài sinh Quan.'); tot(co('Chính Ấn') || co('Thiên Ấn'), 'Có Ấn hộ Quan (Quan Ấn tương sinh).');
      if (co('Thương Quan') && !(co('Chính Ấn') || co('Thiên Ấn'))) xau(true, 'Thương Quan kiến Quan mà không có Ấn chế – phá cách.');
      xau(co('Thất Sát'), 'Quan Sát hỗn tạp – cần hợp Sát hoặc chế Sát mới thanh.');
      break;
    case 'Thất Sát cách':
      it.push('Nghịch dụng: cần Thực Thần chế Sát hoặc Ấn hóa Sát; kỵ Tài sinh Sát khi thân nhược.');
      var che = tot(co('Thực Thần'), 'Thực Thần chế Sát – cách thành, có uy quyền.');
      var hoa = tot(co('Chính Ấn') || co('Thiên Ấn'), 'Ấn hóa Sát (Sát Ấn tương sinh).');
      if (!che && !hoa) xau(true, 'Không chế không hóa – Sát công thân: áp lực đè nặng, dễ bị chèn ép, sức khỏe và tinh thần dễ kiệt.');
      if (!thanVuong) xau(co('Chính Tài') || co('Thiên Tài'), 'Thân nhược mà Tài sinh Sát – gánh nặng quá sức.');
      break;
    case 'Chính Tài cách': case 'Thiên Tài cách':
      it.push('Thuận dụng: hỷ thân vượng gánh Tài, Thực Thương sinh Tài, Quan hộ Tài; kỵ Tỷ Kiếp đoạt Tài.');
      tot(thanVuong, 'Thân vượng đủ sức gánh Tài.');
      if (!thanVuong) xau(true, 'Thân nhược Tài đa – thấy tiền mà khó giữ, dễ hao vì tham; phải chờ vận Ấn/Tỷ trợ thân.');
      tot(co('Thực Thần') || co('Thương Quan'), 'Có Thực Thương sinh Tài – nguồn tiền bền.');
      if ((co('Kiếp Tài') || co('Tỷ Kiên')) && !(co('Chính Quan') || co('Thất Sát'))) xau(true, 'Tỷ Kiếp đoạt Tài mà không có Quan Sát chế.');
      break;
    case 'Chính Ấn cách': case 'Thiên Ấn cách':
      it.push('Thuận dụng: hỷ Quan Sát sinh Ấn; kỵ Tài phá Ấn' + (cach === 'Thiên Ấn cách' ? ', và Thiên Ấn gặp Thực Thần (kiêu đoạt thực) cần Tài chế Kiêu.' : '.'));
      tot(co('Chính Quan') || co('Thất Sát'), 'Có Quan Sát sinh Ấn – học vấn thành danh.');
      if ((co('Chính Tài') || co('Thiên Tài')) && thanVuong === false) xau(true, 'Thân nhược mà Tài phá Ấn.');
      if (cach === 'Thiên Ấn cách' && co('Thực Thần') && !(co('Chính Tài') || co('Thiên Tài'))) xau(true, 'Kiêu đoạt Thực, không có Tài chế Kiêu.');
      if (thanVuong && bt.tyLeTro > 70) xau(true, 'Ấn quá vượng thân quá mạnh – cần Tài chế Ấn mới lưu thông.');
      break;
    case 'Thực Thần cách':
      it.push('Thuận dụng: hỷ Thực Thần sinh Tài, Thực Thần chế Sát; kỵ Thiên Ấn đoạt Thực.');
      tot(co('Chính Tài') || co('Thiên Tài'), 'Thực Thần sinh Tài – phúc lộc, hưởng thụ.');
      tot(co('Thất Sát'), 'Thực Thần chế Sát – có uy quyền.');
      if (co('Thiên Ấn') && !(co('Chính Tài') || co('Thiên Tài'))) xau(true, 'Thiên Ấn đoạt Thực mà không có Tài cứu.');
      break;
    case 'Thương Quan cách':
      it.push('Nghịch dụng: hỷ Thương Quan sinh Tài hoặc Thương Quan bội Ấn (khi thân nhược); kỵ gặp Chính Quan.');
      var sinhTai = tot(co('Chính Tài') || co('Thiên Tài'), 'Thương Quan sinh Tài – kiếm tiền bằng tài năng.');
      var boiAn = tot(!thanVuong && (co('Chính Ấn') || co('Thiên Ấn')), 'Thương Quan bội Ấn – học vấn, danh tiếng.');
      var kimThuyDong = bt.nhatChuHanh === 'Kim' && [11, 0, 1].indexOf(bt.pillars[1].chi) >= 0;
      if (co('Chính Quan') && !kimThuyDong) xau(true, 'Thương Quan kiến Quan – dễ thị phi, va chạm cấp trên, vướng giấy tờ, hợp đồng.');
      if (co('Chính Quan') && kimThuyDong) it.push('✓ Kim Thủy Thương Quan sinh mùa Đông "hỷ kiến Quan" – ngoại lệ, gặp Quan lại tốt.');
      if (!sinhTai && !boiAn) xau(true, 'Thương Quan không sinh Tài cũng không bội Ấn – tài năng khó thành quả.');
      break;
    default: // Kiến Lộc, Dương Nhận, Nguyệt Kiếp
      it.push('Nghịch dụng (Nguyệt kiếp/Lộc/Nhận): Nhật chủ đã mạnh – hỷ Quan Sát chế, Tài để dụng, Thực Thương tiết tú; kỵ thêm Ấn, Tỷ Kiếp.');
      var coChe = tot(co('Chính Quan') || co('Thất Sát'), 'Có Quan Sát chế ngự – cương mà có kỷ luật.');
      var coTai = tot(co('Chính Tài') || co('Thiên Tài'), 'Có Tài để dụng.');
      tot(co('Thực Thần') || co('Thương Quan'), 'Có Thực Thương tiết tú.');
      if (cach === 'Dương Nhận cách' && !co('Thất Sát') && !co('Chính Quan')) xau(true, 'Dương Nhận không có Quan Sát chế – quá cương, dễ tranh chấp, hao tiền vì người khác, dễ chấn thương.');
      if (!coChe && !coTai) xau(true, 'Không có Quan Sát cũng không có Tài – năng lượng dư thừa, thiếu định hướng.');
  }
  return { thanh: thanh, items: it };
}

/** Thần sát mở rộng: trả về [{ten, tru:[i], moTa, tot}] */
/**
 * Thần sát theo trụ cho Cung vị, 12 lĩnh vực, lưu niên. 31/10: vị trí lấy từ BatTuThanSat.gs (bt.thanSatTru) để mọi phần của bài
 * luận nói cùng một điều; giữ tên gọi và lời cũ (btlNen_ tra theo tiền tố tên). Thiếu dữ liệu mới thì dùng cách an cũ.
 */
var BTCT_TEN_MOI = { 'Thiên Đức Quý Nhân': 'Thiên Đức quý nhân', 'Nguyệt Đức Quý Nhân': 'Nguyệt Đức quý nhân', 'Thiên Ất Quý Nhân': 'Thiên Ất quý nhân',
  'Thái Cực Quý Nhân': 'Thái Cực quý nhân', 'Lộc Thần (Kiến Lộc)': 'Lộc Thần', 'Dương Nhẫn': 'Dương Nhận', 'Âm Dương Sai Thố': 'Âm Dương sai thác',
  'Thập Ác Đại Bại': 'Thập ác đại bại', 'Cô Loan Sát': 'Cô Loan sát', 'Đào Hoa (Hàm Trì)': 'Đào Hoa' };
function btctThanSat_(bt, tv) {
  var cu = btctThanSatCu_(bt, tv);
  if (!bt.thanSatTru || !bt.thanSatNghia) return cu;
  var loiCu = {}, gom = {}, thu = [];
  cu.forEach(function (t) { var k = t.ten.replace(/ \(theo (năm|ngày)\)$/, ''); if (!loiCu[k]) loiCu[k] = t.moTa; });
  bt.thanSatTru.forEach(function (ds, i) {
    ds.forEach(function (x) {
      if (x.n !== 'tb' && x.n !== 'tt') return;                       // nhóm sao chọn ngày không đưa vào luận cung vị / lĩnh vực
      if (!gom[x.t]) { gom[x.t] = { t: x.t, l: x.l, tru: [] }; thu.push(gom[x.t]); }
      if (gom[x.t].tru.indexOf(i) < 0) gom[x.t].tru.push(i);
    });
  });
  return thu.map(function (g) {
    var ten = BTCT_TEN_MOI[g.t] || g.t, y = bt.thanSatNghia[g.t] || {};
    return { ten: ten, tru: g.tru, moTa: loiCu[ten] || y.y || '', tot: g.l !== 'hung' };
  });
}
function btctThanSatCu_(bt, tv) {
  var P = bt.pillars, dCan = bt.nhatChuCan, mc = P[1].chi, yc = P[0].chi, dc = P[2].chi;
  var res = [];
  function push(ten, tru, moTa, tot) { if (tru.length) res.push({ ten: ten, tru: tru, moTa: moTa, tot: tot }); }
  function truChi(c) { var r = []; P.forEach(function (p, i) { if (p.chi === c) r.push(i); }); return r; }
  function truCan(c) { var r = []; P.forEach(function (p, i) { if (i !== 2 && p.can === c) r.push(i); }); return r; }
  var td = BTCT_THIEN_DUC[mc];
  push('Thiên Đức quý nhân', td[0] === 'can' ? truCan(td[1]) : truChi(td[1]), 'Được che chở, gặp dữ hóa lành, nhân hậu; mặt trái là hiền quá dễ chịu thiệt.', true);
  push('Nguyệt Đức quý nhân', truCan(BTCT_NGUYET_DUC[mc % 4]), 'Phúc đức, giải hung, tính ôn hòa; mặt trái là ngại xung đột, hay nhún nhường.', true);
  push('Thiên Ất quý nhân', [].concat(truChi(BAZI_QUY_NHAN[dCan][0]), truChi(BAZI_QUY_NHAN[dCan][1])), 'Quý nhân lớn nhất – gặp khó có người giúp; mặt trái là dễ ỷ lại, mang ơn khó từ chối.', true);
  push('Thái Cực quý nhân', [].concat.apply([], BTCT_THAI_CUC[dCan].map(truChi)), 'Thông minh, thích huyền học – triết lý, được phúc báo; mặt trái là dễ xa thực tế.', true);
  push('Văn Xương', truChi(BAZI_VAN_XUONG[dCan]), 'Học giỏi, văn tài; mặt trái là dễ nặng lý thuyết, tự cao về chữ nghĩa.', true);
  push('Học Đường', truChi(TS_KHOI[dCan]), 'Có năng khiếu học thuật, trí tuệ bẩm sinh; mặt trái là học rộng mà dễ thiếu chuyên.', true);
  push('Kim Dư', truChi(mod12(BAZI_LOC[dCan] + 2)), 'Xe vàng – phúc lộc, được hưởng tiện nghi, hôn nhân tốt; mặt trái là quen tiện nghi, kém chịu khổ.', true);
  push('Lộc Thần', truChi(BAZI_LOC[dCan]), 'Có lộc ăn, tài chính vững; mặt trái là tiền chủ yếu do tự làm, khó giàu nhanh.', true);
  if (BAZI_DUONG_NHAN[dCan] >= 0) push('Dương Nhận', truChi(BAZI_DUONG_NHAN[dCan]), 'Cương mãnh, quyết liệt; mặt xấu là nóng nảy, dễ xung đột, hao tiền vì người gần và dễ chấn thương.', false);
  push('Thiên Y', truChi(mod12(mc - 1)), 'Duyên với nghề chăm sóc sức khỏe, sức hồi phục tốt; mặt trái là bản thân hay có bệnh phải theo dõi.', true);
  [yc, dc].forEach(function (base, bi) {
    var nh = base % 4, src = bi ? ' (theo ngày)' : ' (theo năm)';
    var triad = { 0: [0, 5, 6, 11], 1: [9, 2, 3, 8], 2: [6, 11, 0, 5], 3: [3, 8, 9, 2] }[nh]; // [tướng tinh, kiếp sát, tai sát, vong thần]
    push('Tướng Tinh' + src, truChi(triad[0]).filter(function (i) { return i !== (bi ? 2 : 0); }), 'Có tài lãnh đạo, được nể trọng; mặt trái là dễ độc đoán.', true);
    push('Kiếp Sát' + src, truChi(triad[1]), 'Quyết đoán, dám làm; mặt xấu là dễ hao tài do bị lừa, mất cắp, tranh giành và gặp rủi ro khi đi lại.', false);
    push('Tai Sát' + src, truChi(triad[2]), 'Xoay xở giỏi khi có việc bất ngờ; mặt xấu là dễ gặp tai nạn nhỏ, bệnh bất ngờ, rắc rối giấy tờ, hợp đồng.', false);
    push('Vong Thần' + src, truChi(triad[3]), 'Toan tính sâu; mặt xấu là dễ thất thoát ngầm, bị người quen làm hại, vướng thị phi sau lưng.', false);
  });
  var dp = CAN[P[2].can] + ' ' + CHI[dc];
  if (['Canh Thìn', 'Canh Tuất', 'Nhâm Thìn', 'Mậu Tuất'].indexOf(dp) >= 0) push('Khôi Cương', [2], 'Thông minh, quyết đoán, cá tính mạnh; mặt xấu là cứng quá dễ cô độc, hôn nhân nhiều sóng gió.', true);
  if (['Ất Sửu', 'Kỷ Tỵ', 'Quý Dậu'].indexOf(dp) >= 0 || ['Ất Sửu', 'Kỷ Tỵ', 'Quý Dậu'].indexOf(CAN[P[3].can] + ' ' + CHI[P[3].chi]) >= 0)
    push('Kim Thần', ['Ất Sửu', 'Kỷ Tỵ', 'Quý Dậu'].indexOf(dp) >= 0 ? [2] : [3], 'Cương nghị, sắc sảo; mặt xấu là cứng nhắc, dễ va chạm, thiếu vận Hỏa (lửa) thì chậm thành.', true);
  if (['Bính Tý', 'Đinh Sửu', 'Mậu Dần', 'Tân Mão', 'Nhâm Thìn', 'Quý Tỵ', 'Bính Ngọ', 'Đinh Mùi', 'Mậu Thân', 'Tân Dậu', 'Nhâm Tuất', 'Quý Hợi'].indexOf(dp) >= 0)
    push('Âm Dương sai thác', [2], 'Có cách nghĩ riêng; mặt xấu là dễ lệch nhịp với bạn đời và gia đình bên ấy, hiểu lầm, tình cảm dễ lạnh.', false);
  if (['Giáp Thìn', 'Ất Tỵ', 'Bính Thân', 'Đinh Hợi', 'Mậu Tuất', 'Kỷ Sửu', 'Canh Thìn', 'Tân Tỵ', 'Nhâm Thân', 'Quý Hợi'].indexOf(dp) >= 0)
    push('Thập ác đại bại', [2], 'Rộng rãi; mặt xấu là theo cổ học khó giữ tiền, ít được hưởng của gia đình, tài sản phải tự gây dựng (nhẹ đi nếu cách cục tốt).', false);
  if (['Ất Tỵ', 'Đinh Tỵ', 'Tân Hợi', 'Mậu Thân', 'Giáp Dần', 'Nhâm Tý', 'Bính Ngọ', 'Mậu Ngọ'].indexOf(dp) >= 0)
    push('Cô Loan sát', [2], 'Độc lập về cảm xúc; mặt xấu là tình duyên trắc trở, vợ chồng dễ xa cách, lạnh nhạt.', false);
  var phuong = Math.floor(mod12(yc - 2) / 3);
  push('Cô Thần', truChi([5, 8, 11, 2][phuong]), 'Tự lập, quen tự lo; mặt xấu là dễ xa cách người thân, chuyện vợ chồng dễ lạnh (nam rõ hơn).', false);
  push('Quả Tú', truChi([1, 4, 7, 10][phuong]), 'Tự chủ cảm xúc, chịu đựng giỏi; mặt xấu là dễ cô đơn trong hôn nhân, ít gần gũi (nữ rõ hơn).', false);
  push('Hồng Loan', truChi(mod12(3 - yc)), 'Duyên dáng, dễ có hôn nhân sớm; mặt trái là dễ yêu vội, cưới vội.', true);
  push('Thiên Hỷ', truChi(mod12(9 - yc)), 'Vui vẻ, hỷ sự; mặt trái là dễ chủ quan khi đang thuận.', true);
  return res;
}
