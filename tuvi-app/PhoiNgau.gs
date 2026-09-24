/**
 * ============================================================
 *  PhoiNgau.gs — CHÂN DUNG NGƯỜI VỢ / CHỒNG TƯƠNG LAI (tổng hợp 5 hệ)
 *  - Tử Vi: cung Phu Thê (chính tinh, phụ tinh, Tứ Hóa, Tuần/Triệt), hướng cung
 *  - Bát Tự: cung phu thê = nhật chi; sao phối ngẫu (nam: Tài tinh, nữ: Quan tinh),
 *    vị trí trụ xuất hiện, hỷ/kỵ, xung – hợp nhật chi
 *  - Chiêm tinh: cung Lặn (Descendant – đỉnh nhà 7), chủ tinh nhà 7, hành tinh
 *    trong nhà 7; nam xét Sao Kim & Mặt Trăng, nữ xét Sao Hỏa & Mặt Trời
 *  - Thần số học: nhóm số chủ đạo hòa hợp, bài học quan hệ
 *  - Human Design: trung tâm mở & cổng treo – điều người kia sẽ "bù" cho mình
 *  Cho ra: ngoại hình, tính cách, nghề – hoàn cảnh, chênh lệch tuổi,
 *  nơi/cách gặp gỡ, thời điểm dễ kết hôn, chất lượng hôn nhân và lời khuyên.
 * ============================================================
 */

/** Phu Thê theo chính tinh: [tính cách phối ngẫu, chênh tuổi (+ lớn hơn / − nhỏ hơn / 0 ít chênh), đặc điểm hôn nhân] */
var PN_SAO = {
  'Tử Vi': ['có uy, tự trọng cao, chững chạc, thích được tôn trọng, đôi khi gia trưởng; thường có địa vị hoặc xuất thân khá', 1, 'hôn nhân bền nếu nhường nhịn; phối ngẫu nắm quyền trong nhà'],
  'Thiên Cơ': ['thông minh, nhanh nhẹn, khéo léo, hay lo nghĩ, thích thay đổi; có thể làm kỹ thuật, kế hoạch, tư vấn', 0, 'hợp nhau về trí tuệ; dễ có giai đoạn xa cách hoặc thay đổi chỗ ở'],
  'Thái Dương': ['cởi mở, nhiệt tình, hào phóng, sống vì gia đình và xã hội; hoạt động bên ngoài nhiều', 1, 'sáng sủa thì phối ngẫu giỏi giang, có danh; hãm thì vất vả, ít thời gian cho nhau'],
  'Vũ Khúc': ['cương nghị, thực tế, giỏi tiền bạc, ít nói chuyện tình cảm; khá độc lập', 1, 'nên lấy muộn để tránh cô khắc; kinh tế gia đình vững'],
  'Thiên Đồng': ['hiền hòa, vui vẻ, dễ tính, thích hưởng thụ, đôi khi thiếu quyết đoán; trẻ trung', -1, 'êm ấm, ít sóng gió; cần cùng nhau lập mục tiêu'],
  'Liêm Trinh': ['cá tính mạnh, nguyên tắc, có sức hút, nóng nảy khi bị trái ý', 0, 'nhiều đam mê nhưng dễ va chạm; tránh ghen tuông'],
  'Thiên Phủ': ['điềm đạm, chín chắn, biết lo liệu, giỏi quản lý tiền, nhân hậu', 1, 'rất tốt cho hôn nhân – phối ngẫu là "kho" giữ gìn gia sản'],
  'Thái Âm': ['dịu dàng, tinh tế, giàu cảm xúc, chu đáo, có thẩm mỹ; ưa sạch sẽ', -1, 'sáng sủa thì đẹp đôi, êm ấm; hãm thì hay buồn giận âm thầm'],
  'Tham Lang': ['khéo giao tế, đa tài, hấp dẫn, ham trải nghiệm, nhiều mối quan hệ', 0, 'dễ có trắc trở tình cảm lúc trẻ; lấy muộn và giữ chung thủy thì tốt'],
  'Cự Môn': ['ăn nói sắc sảo, giỏi lý luận, hay nghi ngờ, kỹ tính', 0, 'dễ bất đồng lời nói; nên học cách lắng nghe, tránh khẩu thiệt'],
  'Thiên Tướng': ['chính trực, chỉn chu, tốt bụng, ăn mặc đẹp, trọng danh dự', 0, 'hôn nhân hòa thuận, phối ngẫu giúp đỡ nhiều; gặp Tuần/Triệt thì lận đận lúc đầu'],
  'Thiên Lương': ['hiền lành, đứng đắn, có đạo đức, thích che chở – như người anh/chị', 1, 'phối ngẫu thường lớn tuổi hơn hoặc chín chắn hơn; hôn nhân bền'],
  'Thất Sát': ['mạnh mẽ, quyết đoán, nóng tính, độc lập, có tham vọng', 1, 'duyên đến muộn hoặc trắc trở; hai người đều mạnh nên cần phân vai rõ'],
  'Phá Quân': ['phóng khoáng, thích đổi mới, cá tính, dám phá bỏ khuôn khổ', 1, 'dễ thay đổi trong tình cảm; nên kết hôn muộn, tránh quyết định vội']
};
var PN_PHU = {
  'Tả Phù': '◇ Tả Phù/Hữu Bật ở Phu Thê: phối ngẫu giỏi giúp đỡ; nhưng cũng là dấu hiệu "hai lần đò" hoặc có người thứ ba nếu gặp sát tinh.',
  'Hữu Bật': null,
  'Văn Xương': '✓ Xương/Khúc ở Phu Thê: phối ngẫu có học thức, ăn nói nhã nhặn, có khiếu văn nghệ.',
  'Văn Khúc': null,
  'Thiên Khôi': '✓ Khôi/Việt ở Phu Thê: phối ngẫu là quý nhân, có địa vị, được người trên nâng đỡ.',
  'Thiên Việt': null,
  'Lộc Tồn': '✓ Lộc Tồn ở Phu Thê: phối ngẫu giỏi giữ của, nhờ hôn nhân mà khá giả; tính hơi dè dặt.',
  'Hóa Lộc': '✓ Hóa Lộc ở Phu Thê: tình cảm nồng thắm, phối ngẫu mang lộc đến.',
  'Hóa Quyền': '◇ Hóa Quyền ở Phu Thê: phối ngẫu có năng lực, thích nắm quyền quyết định.',
  'Hóa Khoa': '✓ Hóa Khoa ở Phu Thê: phối ngẫu có danh tiếng, học vấn, được nể trọng.',
  'Hóa Kỵ': '✗ Hóa Kỵ ở Phu Thê: dễ hiểu lầm, lấn cấn, ghen tuông; cần nói rõ ràng, tránh giữ trong lòng.',
  'Đào Hoa': '◇ Đào Hoa ở Phu Thê: phối ngẫu đẹp, duyên dáng; mình yêu sớm, nhiều người theo đuổi.',
  'Hồng Loan': '✓ Hồng Loan ở Phu Thê: phối ngẫu ưa nhìn, dễ thương; duyên đến tự nhiên.',
  'Thiên Hỷ': '✓ Thiên Hỷ ở Phu Thê: hôn nhân vui vẻ, dễ có tin vui cưới hỏi.',
  'Thiên Mã': '◇ Thiên Mã ở Phu Thê: phối ngẫu hay đi xa/làm xa; dễ quen nhau khi đi lại, du lịch, ở nơi khác.',
  'Kình Dương': '✗ Kình Dương ở Phu Thê: phối ngẫu cứng rắn, dễ cãi vã; đề phòng tai nạn cho người kia.',
  'Đà La': '✗ Đà La ở Phu Thê: duyên chậm, lằng nhằng; hôn nhân có giai đoạn trì trệ.',
  'Hỏa Tinh': '✗ Hỏa/Linh ở Phu Thê: nóng nảy, dễ bùng lên cãi nhau; cưới nhanh hoặc chia tay nhanh.',
  'Linh Tinh': null,
  'Địa Không': '✗ Không/Kiếp ở Phu Thê: tình cảm lúc có lúc không, dễ hụt hẫng; tránh hứa hẹn viển vông.',
  'Địa Kiếp': null,
  'Thiên Hình': '◇ Thiên Hình ở Phu Thê: phối ngẫu nghiêm khắc, kỷ luật; có thể làm ngành luật, y, quân đội.',
  'Cô Thần': '◇ Cô Thần/Quả Tú ở Phu Thê: kết hôn muộn, có lúc cảm thấy cô đơn ngay trong hôn nhân.',
  'Quả Tú': null,
  'Thiên Riêu': '◇ Thiên Riêu ở Phu Thê: đa tình, dễ vướng chuyện tình cảm ngoài lề.',
  'Long Trì': '✓ Long Trì/Phượng Các ở Phu Thê: phối ngẫu có thẩm mỹ, lịch sự.',
  'Thiên Quan': '✓ Thiên Quan/Thiên Phúc ở Phu Thê: phối ngẫu hiền lành, có phúc, tín ngưỡng.'
};
var PN_HUONG_CHI = ['Bắc', 'Bắc – Đông Bắc', 'Đông Bắc', 'Đông', 'Đông – Đông Nam', 'Đông Nam', 'Nam', 'Nam – Tây Nam', 'Tây Nam', 'Tây', 'Tây – Tây Bắc', 'Tây Bắc'];
var PN_NHA7 = {
  1: 'tự mình chủ động tìm đến; gặp khi đang khẳng định bản thân', 2: 'qua công việc liên quan tiền bạc, mua bán', 3: 'qua học hành, hàng xóm, anh chị em giới thiệu, mạng xã hội',
  4: 'qua gia đình, người thân mai mối, gần nhà', 5: 'khi vui chơi, sự kiện, sở thích nghệ thuật – thể thao', 6: 'ở nơi làm việc, đồng nghiệp, môi trường y tế – dịch vụ',
  7: 'qua đối tác, hợp tác, được giới thiệu trực tiếp', 8: 'qua biến cố, chuyện tài chính chung, mối quan hệ sâu kín', 9: 'khi đi xa, du học, nước ngoài, lớp học – tôn giáo',
  10: 'qua công việc, cấp trên – môi trường nghề nghiệp', 11: 'qua bạn bè, hội nhóm, cộng đồng', 12: 'trong hoàn cảnh kín đáo, bệnh viện, nơi xa, hoặc mối quan hệ lúc đầu phải giữ bí mật'
};
var PN_SO_NHOM = [[1, 5, 7], [2, 4, 8], [3, 6, 9]];

function pnNhomSo_(n) { var g = tsGoc_(n); for (var i = 0; i < 3; i++) if (PN_SO_NHOM[i].indexOf(g) >= 0) return PN_SO_NHOM[i]; return [g]; }

function phoiNgauLuan(C) {
  var tv = C.tv, bt = C.bt, ct = C.ct, ts = C.ts, hd = C.hd, male = tv.info.male;
  var goi = male ? 'người vợ' : 'người chồng';
  var he = [], phieu = [], tuoiP = [], chatP = [];
  function add(h, v, w) { phieu.push({ he: h, v: v, w: w }); }

  /* ---------- Tử Vi ---------- */
  var pt = thCungTheoTen_(tv, 'Phu Thê'), tvi = [], tinhCach = [];
  var sao = thChinhTinh_(tv, pt);
  tvi.push('Cung Phu Thê tại ' + pt.canTen + ' ' + pt.chiTen + ' (hướng ' + PN_HUONG_CHI[pt.chi] + '), ' + diem10_(thDiemCung_(tv, 'Phu Thê')) + '/10' + (pt.chinh.length ? '' : ' – vô chính diệu, mượn sao cung đối (Quan Lộc)') + '.');
  sao.forEach(function (s) {
    var P = PN_SAO[s.n], S = TH_SAO[s.n]; if (!P) return;
    var ham = s.b === 'H';
    tvi.push(s.n + (s.b ? ' (' + s.b + ')' : '') + (s.muon ? ' (mượn)' : '') + ': ' + goi + ' ' + P[0] + '. Ngoại hình: ' + S.hinh + (ham ? ' (hãm: kém tươi, gầy hơn)' : '') + '. Hôn nhân: ' + P[2] + '.');
    tinhCach.push(P[0]);
    add('Tử Vi', { cao: S.v.cao - (ham ? 0.5 : 0), beo: S.v.beo - (ham ? 0.5 : 0), mat: S.v.mat, da: S.v.da }, s.muon ? 0.7 : 1.5);
    tuoiP.push({ he: 'Tử Vi', v: P[1] });
  });
  var daIn = {};
  thSaoCung_(pt).forEach(function (s) {
    var k = s.n, txt = PN_PHU[k];
    if (txt === null) { k = { 'Hữu Bật': 'Tả Phù', 'Văn Khúc': 'Văn Xương', 'Thiên Việt': 'Thiên Khôi', 'Linh Tinh': 'Hỏa Tinh', 'Địa Kiếp': 'Địa Không', 'Quả Tú': 'Cô Thần' }[k]; txt = PN_PHU[k]; }
    if (txt && !daIn[k]) { daIn[k] = true; tvi.push(txt); }
  });
  if (pt.tuan || pt.triet) { tvi.push('◇ Phu Thê gặp ' + (pt.triet ? 'Triệt' : 'Tuần') + ': duyên đến muộn hoặc mối tình đầu dang dở; kết hôn sau 28–30 tuổi thì bền hơn.'); tuoiP.push({ he: 'Tử Vi', v: 0.5 }); }
  var dPT = thDiemCung_(tv, 'Phu Thê'); chatP.push({ he: 'Tử Vi', v: Math.max(-2, Math.min(2, dPT / 3)) });
  if (thCoSao_(pt, 'Cô Thần') || thCoSao_(pt, 'Quả Tú') || thCoSao_(pt, 'Đà La')) tuoiP.push({ he: 'Tử Vi', v: 0.4 });
  he.push({ he: 'Tử Vi', items: tvi });

  /* ---------- Bát Tự ---------- */
  var bti = [], nc = bt.pillars[2], chiTT = nc.tangCan[0] ? nc.tangCan[0].thapThan : '';
  var saoPN = male ? ['Chính Tài', 'Thiên Tài'] : ['Chính Quan', 'Thất Sát'];
  bti.push('Cung phu thê (nhật chi) ' + nc.chiTen + ' – hành ' + nc.chiHanh + ', chính khí ' + (nc.tangCan[0] ? nc.tangCan[0].ten + ' (' + chiTT + ')' : '') + '; nhật trụ đánh giá ' + C.btct.cungVi[2].danhGia + '.');
  var TT_PN = {
    'Chính Tài': 'phối ngẫu đảm đang, thực tế, biết vun vén, chung thủy', 'Thiên Tài': 'phối ngẫu hào phóng, giao thiệp rộng, hấp dẫn, thích tự do',
    'Chính Quan': 'phối ngẫu đứng đắn, có trách nhiệm, nề nếp, có địa vị', 'Thất Sát': 'phối ngẫu mạnh mẽ, quyết liệt, nóng tính nhưng che chở',
    'Chính Ấn': 'phối ngẫu hiền hậu, chăm lo như mẹ/cha, ham học', 'Thiên Ấn': 'phối ngẫu trầm lặng, có năng khiếu đặc biệt, hơi cô độc',
    'Thực Thần': 'phối ngẫu vui vẻ, dễ chịu, thích ăn ngon – hưởng thụ', 'Thương Quan': 'phối ngẫu thông minh, cá tính, hay phê phán – dễ va chạm lời nói',
    'Tỷ Kiên': 'phối ngẫu như bạn bè, ngang tính, độc lập', 'Kiếp Tài': 'phối ngẫu cá tính mạnh, dễ tranh giành; đề phòng người thứ ba hoặc hao tài vì hôn nhân'
  };
  if (TT_PN[chiTT]) { bti.push('Thập thần tọa cung phu thê: ' + chiTT + ' → ' + TT_PN[chiTT] + '.'); tinhCach.push(TT_PN[chiTT].replace('phối ngẫu ', '')); }
  add('Bát Tự', TH_NGU_HANH_HINH[nc.chiHanh].v, 1);
  bti.push('Hình tướng theo hành nhật chi (' + nc.chiHanh + '): ' + TH_NGU_HANH_HINH[nc.chiHanh].hinh + '.');
  // sao phối ngẫu xuất hiện ở đâu
  var tim = [];
  bt.pillars.forEach(function (p, i) {
    if (saoPN.indexOf(p.thapThan) >= 0) tim.push({ i: i, lo: 'can', t: p.thapThan, h: p.canHanh });
    (p.tangCan || []).forEach(function (tc, j) { if (saoPN.indexOf(tc.thapThan) >= 0) tim.push({ i: i, lo: j === 0 ? 'chi' : 'tàng', t: tc.thapThan, h: tc.hanh }); });
  });
  var TRU = ['năm', 'tháng', 'ngày', 'giờ'];
  if (tim.length) {
    var hS = tim[0].h, hy = bt.goiY.hy.indexOf(hS) >= 0;
    bti.push('Sao phối ngẫu (' + saoPN[0] + '/' + saoPN[1] + ', hành ' + hS + ') xuất hiện ở trụ ' + tim.map(function (x) { return TRU[x.i] + ' (' + x.lo + ')'; }).join(', ') + ' – là ' + (hy ? 'hỷ dụng thần: phối ngẫu giúp mình, hôn nhân mang lại may mắn.' : bt.goiY.ky.indexOf(hS) >= 0 ? 'kỵ thần: hôn nhân nhiều áp lực, cần dung hòa.' : 'trung tính.'));
    add('Bát Tự', TH_NGU_HANH_HINH[hS].v, 0.8);
    var dauTien = tim[0].i;
    bti.push(['Sao phối ngẫu ở trụ năm: dễ gặp sớm, qua quen biết gia đình/đồng hương; phối ngẫu có thể lớn tuổi hơn.', 'Sao phối ngẫu ở trụ tháng: gặp qua trường lớp, công việc, bạn bè; tuổi kết hôn trung bình.', 'Sao phối ngẫu ngay cạnh nhật chủ: gắn bó chặt chẽ, dễ gặp đúng người.', 'Sao phối ngẫu ở trụ giờ: duyên đến muộn; phối ngẫu thường trẻ hơn.'][dauTien]);
    tuoiP.push({ he: 'Bát Tự', v: dauTien === 0 ? 1 : dauTien === 3 ? -1 : 0 });
    chatP.push({ he: 'Bát Tự', v: (hy ? 1 : -0.5) + C.btct.cungVi[2].diem / 5 });
    if (tim.filter(function (x) { return x.lo === 'can'; }).length >= 2 || tim.map(function (x) { return x.t; }).filter(function (v, i, a) { return a.indexOf(v) === i; }).length === 2) bti.push('◇ Chính – Thiên (hoặc sao phối ngẫu) hiện nhiều lần: nhiều mối duyên, dễ phân vân chọn lựa; cần chung thủy.');
  } else {
    bti.push('◇ Sao phối ngẫu không lộ trong tứ trụ: duyên đến muộn, thường được kích hoạt khi đại vận/lưu niên mang hành ' + (male ? 'Tài' : 'Quan') + ' tinh.');
    tuoiP.push({ he: 'Bát Tự', v: 0.5 }); chatP.push({ he: 'Bát Tự', v: C.btct.cungVi[2].diem / 5 });
  }
  var XUNG = [6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5];
  bt.pillars.forEach(function (p, i) { if (i !== 2 && p.chi === XUNG[nc.chi]) bti.push('✗ Trụ ' + TRU[i] + ' ' + p.chiTen + ' xung nhật chi ' + nc.chiTen + ': cung phu thê bị động – hôn nhân có giai đoạn xa cách/biến động; tránh cưới vào năm ' + nc.chiTen + '/' + p.chiTen + ' xung.'); });
  he.push({ he: 'Bát Tự', items: bti });

  /* ---------- Chiêm tinh ---------- */
  var ci = [], ds = ct.cusp[6], DS = CT_CUNG[ds.cung], r7 = ct.by[DS.chuCo];
  ci.push('Cung Lặn (Descendant – đỉnh nhà 7) ở ' + DS.ten + ' ' + ds.do + ': ' + goi + ' thường mang nét ' + DS.tuKhoa + '. Hình dáng: ' + DS.asc.split(':').slice(1).join(':').trim());
  add('Chiêm tinh', DS.hinh, 1.5);
  ci.push('Chủ tinh nhà 7 (' + CT_HT[DS.chuCo].ten + ') ở ' + r7.cungTen + ', nhà ' + r7.nha + (r7.pham ? ' (' + r7.pham + ')' : '') + ' → dễ gặp ' + PN_NHA7[r7.nha] + '.');
  var h7 = ct.hanhTinh.filter(function (p) { return p.nha === 7 && p.key !== 'northNode'; });
  var Y7 = { sun: 'phối ngẫu nổi bật, tự tin; bản thân tìm thấy mình qua hôn nhân', moon: 'phối ngẫu chu đáo, giàu cảm xúc, gắn bó gia đình', mercury: 'phối ngẫu trẻ trung, nói nhiều, thông minh; có thể chênh ít tuổi',
    venus: 'phối ngẫu đẹp, duyên dáng – hôn nhân hạnh phúc', mars: 'phối ngẫu mạnh mẽ, nhiệt huyết nhưng dễ cãi nhau', jupiter: 'phối ngẫu rộng lượng, có học thức hoặc khá giả – hôn nhân may mắn',
    saturn: 'phối ngẫu lớn tuổi hơn hoặc nghiêm túc; kết hôn muộn nhưng bền', uranus: 'phối ngẫu khác thường; quen nhau bất ngờ, cần tự do trong hôn nhân', neptune: 'phối ngẫu nghệ sĩ/tâm linh; dễ lý tưởng hóa – cần tỉnh táo',
    pluto: 'mối quan hệ mãnh liệt, chuyển hóa sâu; đề phòng kiểm soát lẫn nhau' };
  h7.forEach(function (p) { ci.push((['venus', 'jupiter'].indexOf(p.key) >= 0 ? '✓ ' : ['mars', 'saturn', 'uranus', 'pluto'].indexOf(p.key) >= 0 ? '◇ ' : '') + p.ten + ' ở nhà 7: ' + Y7[p.key] + '.'); });
  if (h7.some(function (p) { return p.key === 'saturn'; })) tuoiP.push({ he: 'Chiêm tinh', v: 1 });
  if (h7.some(function (p) { return p.key === 'mercury'; })) tuoiP.push({ he: 'Chiêm tinh', v: -0.5 });
  var k1 = male ? 'venus' : 'mars', k2 = male ? 'moon' : 'sun', p1 = ct.by[k1], p2 = ct.by[k2];
  ci.push((male ? 'Sao Kim (hình mẫu người phụ nữ mình yêu)' : 'Sao Hỏa (hình mẫu người đàn ông mình bị thu hút)') + ' ở ' + p1.cungTen + ': ' + CT_CUNG[p1.cung].tuKhoa + '; ' +
    (male ? 'Mặt Trăng (người vợ lý tưởng)' : 'Mặt Trời (người chồng lý tưởng)') + ' ở ' + p2.cungTen + ': ' + CT_CUNG[p2.cung].tuKhoa + '.');
  add('Chiêm tinh', CT_CUNG[p1.cung].hinh, 0.6);
  var cS = 0;
  ct.goc.forEach(function (g) {
    if (g.a !== k1 && g.b !== k1 && g.a !== 'venus' && g.b !== 'venus') return;
    var o = [g.a, g.b].filter(function (x) { return x !== k1 && x !== 'venus'; })[0];
    if (o === 'saturn') { ci.push('◇ ' + g.aTen + ' ' + g.goc + ' ' + g.bTen + ': tình cảm nghiêm túc, đến muộn; thường chọn người lớn tuổi/chín chắn.'); tuoiP.push({ he: 'Chiêm tinh', v: 0.8 }); cS += g.loai === 'tot' ? 0.3 : -0.5; }
    if (o === 'jupiter') { ci.push('✓ ' + g.aTen + ' ' + g.goc + ' ' + g.bTen + ': may mắn trong tình yêu, phối ngẫu rộng lượng.'); cS += 0.6; }
    if (o === 'uranus') { ci.push('◇ ' + g.aTen + ' ' + g.goc + ' ' + g.bTen + ': yêu bất ngờ, "tiếng sét ái tình"; cần không gian riêng.'); cS -= 0.2; }
    if (o === 'neptune' && g.loai !== 'tot') { ci.push('◇ ' + g.aTen + ' ' + g.goc + ' ' + g.bTen + ': dễ mơ mộng trong tình yêu – nên tìm hiểu kỹ.'); cS -= 0.3; }
  });
  chatP.push({ he: 'Chiêm tinh', v: Math.max(-2, Math.min(2, cS + ctDiemPham_(r7.pham) * 0.4 + ctDiemPham_(ct.by.venus.pham) * 0.4 + (h7.some(function (p) { return p.key === 'venus' || p.key === 'jupiter'; }) ? 0.6 : 0))) });
  he.push({ he: 'Chiêm tinh', items: ci });

  /* ---------- Thần số học ---------- */
  var nhom = pnNhomSo_(ts.duongDoi), tsi = [];
  tsi.push('Số chủ đạo ' + ts.duongDoi + ' thuộc nhóm ' + nhom.join('-') + ': hợp tự nhiên với người có số chủ đạo ' + nhom.filter(function (x) { return x !== tsGoc_(ts.duongDoi); }).join(' hoặc ') +
    ' (cùng tần số), bổ trợ tốt với số ' + (tsGoc_(ts.duongDoi) % 2 ? '2, 4, 6' : '3, 5, 7') + '.');
  var bh = { 1: 'học cách để người kia cùng quyết định', 2: 'tránh phụ thuộc cảm xúc, tự tin vào giá trị bản thân', 3: 'giữ cam kết khi hết cảm giác mới lạ', 4: 'bớt cứng nhắc, thêm lãng mạn', 5: 'cân bằng tự do và gắn bó', 6: 'bớt kiểm soát, đừng ôm hết trách nhiệm', 7: 'mở lòng chia sẻ, đừng khép mình', 8: 'dành thời gian, không chỉ lo vật chất', 9: 'yêu người thật chứ không yêu hình mẫu lý tưởng' };
  tsi.push('Bài học trong tình yêu: ' + bh[tsGoc_(ts.duongDoi)] + '.');
  if (ts.bieuDo[2] === 0) tsi.push('◇ Thiếu số 2: cần tinh tế hơn trong cảm nhận nhu cầu của người kia.');
  if (ts.bieuDo[5] === 0) tsi.push('◇ Thiếu số 5 (tình yêu – cảm xúc): hay ngại bày tỏ, cần chủ động nói lời yêu thương.');
  if (ts.coTen) tsi.push('Số linh hồn ' + ts.linhHon + ': trong hôn nhân bạn khao khát ' + TS_SO[ts.linhHon].tk.split(',').slice(0, 2).join(',') + '.');
  he.push({ he: 'Thần số học', items: tsi });

  /* ---------- Human Design ---------- */
  var hdi = [], treo = [], allCh = HD_CHANNELS;
  Object.keys(hd.gates).forEach(function (g) {
    g = +g;
    allCh.forEach(function (ch) {
      var o = ch[0] === g ? ch[1] : ch[1] === g ? ch[0] : null;
      if (o && !hd.gates[o]) treo.push({ g: g, o: o, ten: ch[2] });
    });
  });
  var mo = Object.keys(HD_CENTERS).filter(function (c) { return !hd.dinh[c]; });
  hdi.push('Bạn dễ bị hút về người có các trung tâm xác định ở chỗ bạn để mở: ' + mo.map(function (c) { return HD_CENTERS[c].ten.split(' (')[0]; }).join(', ') + ' – họ mang lại cảm giác "đủ đầy" nhưng cũng dễ khiến bạn sống theo năng lượng của họ.');
  if (treo.length) hdi.push('Cổng treo (người phối ngẫu thường có cổng còn lại để nối thành kênh – "điện từ" hấp dẫn): ' + treo.slice(0, 6).map(function (t) { return t.g + '→' + t.o + ' (' + t.ten + ')'; }).join('; ') + '.');
  var hopLoai = { 'Generator': 'Projector hoặc Generator khác – bạn cung cấp sinh lực, họ định hướng', 'Manifesting Generator': 'Projector hoặc Manifestor – người biết dẫn dắt tốc độ của bạn',
    'Manifestor': 'Generator – họ tiếp sức cho điều bạn khởi xướng; nhớ "thông báo" cho người thương', 'Projector': 'Generator/Manifesting Generator – người có sinh lực và biết "mời" bạn',
    'Reflector': 'người ổn định, kiên nhẫn, sống trong môi trường lành mạnh' };
  hdi.push('Loại hợp tác tự nhiên: ' + hopLoai[hd.loai] + '. Thẩm quyền của bạn nhắc: ' + (hd.thamQuyen === 'emotional' ? 'đừng nhận lời cầu hôn khi đang ở đỉnh/đáy cảm xúc – chờ rõ ràng.' : hd.thamQuyen === 'sacral' ? 'hãy tin phản hồi "ừ-hứ" từ bụng khi được hỏi.' : 'lắng nghe trực giác/nơi chốn khi chọn bạn đời.'));
  he.push({ he: 'Human Design', items: hdi });

  /* ---------- Hà Lạc ---------- */
  if (C.hl) {
    var ng = C.hl.tien.tren, Q = TH_QUAI_HINH[ng], nd = C.hl.tien.nguyenDuong, dh = hlDiemHao_(C.hl.tien, nd), hli = [];
    add('Hà Lạc', Q.v, 1);
    hli.push('Ngoại quái Tiên thiên ' + ng + ' tượng cho "người kia": ' + Q.hinh + '; tính chất ' + HL_QUAI[ng].y + '.');
    hli.push(dh.ung ? '✓ Hào nguyên đường có ứng (âm – dương tương cầu): dễ gặp người bổ khuyết cho mình, hôn nhân có hậu thuẫn.' : '◇ Hào nguyên đường không ứng: duyên đến chậm hoặc phải tự chủ động, hai người dễ "cùng cực" nên cần nhường.');
    chatP.push({ he: 'Hà Lạc', v: (dh.ung ? 0.6 : -0.3) + C.hl.hau.diem * 0.3 });
    var qhn = (C.hlL ? C.hlL.nam : []).filter(function (n) { return n.tuoi >= 20 && n.tuoi <= 45 && HT_QUE.ketHon.indexOf(n.que) >= 0; }).slice(0, 5);
    if (qhn.length) hli.push('Năm quẻ lưu niên chủ hôn nhân (20–45 tuổi): ' + qhn.map(function (n) { return n.nam + ' (' + n.que + ')'; }).join(', ') + '.');
    he.push({ he: 'Hà Lạc', items: hli });
  }
  /* ---------- Tổng hợp ---------- */
  var tong = { cao: 0, beo: 0, wc: 0, wb: 0 }, mat = {}, da = {};
  phieu.forEach(function (p) {
    if (p.v.cao != null) { tong.cao += p.v.cao * p.w; tong.wc += p.w; }
    if (p.v.beo != null) { tong.beo += p.v.beo * p.w; tong.wb += p.w; }
    if (p.v.mat) mat[p.v.mat] = (mat[p.v.mat] || 0) + p.w; if (p.v.da) da[p.v.da] = (da[p.v.da] || 0) + p.w;
  });
  var cao = tong.wc ? tong.cao / tong.wc : 0, beo = tong.wb ? tong.beo / tong.wb : 0;
  var m = Object.keys(mat).sort(function (a, b) { return mat[b] - mat[a]; }), d = Object.keys(da).sort(function (a, b) { return da[b] - da[a]; });
  function tb(a) { var s = 0; a.forEach(function (x) { s += x.v; }); return a.length ? s / a.length : 0; }
  function dong(a, v) { var n = 0; a.forEach(function (x) { if (x.v * v > 0) n++; }); return n + '/' + a.length; }
  var T = tb(tuoiP), Q = tb(chatP);
  var kh = (C.duDoan.chuDe.ketHon.top || []).slice().sort(function (a, b) { return b.diem - a.diem; });
  var namNay = C.duDoan.namNay, sap = kh.filter(function (x) { return x.nam >= namNay; }).slice(0, 4).map(function (x) { return x.nam; }).sort();
  var tot = kh.slice(0, 5).map(function (x) { return x.nam + ' (' + x.tuoi + ' tuổi)'; });
  var kl = [
    'Ngoại hình ' + goi + ': ' + (cao > 0.4 ? 'dáng cao' : cao < -0.3 ? 'dáng nhỏ nhắn' : 'chiều cao trung bình') + ', ' + (beo > 0.5 ? 'đầy đặn, chắc' : beo > 0.1 ? 'cân đối hơi đầy' : beo > -0.3 ? 'cân đối, gọn' : 'thon gầy') +
      '; khuôn mặt ' + (m[0] || 'hài hòa') + (m[1] ? ' pha nét ' + m[1] : '') + '; nước da ' + ({ 'sáng': 'sáng', 'hồng': 'hồng hào', 'ngăm': 'ngăm/bánh mật' }[d[0]] || 'trung bình') + '.',
    'Tính cách: ' + tinhCach.slice(0, 3).join('; ') + '.',
    'Chênh lệch tuổi: ' + (T > 0.6 ? (male ? 'vợ' : 'chồng') + ' nhiều khả năng lớn tuổi hơn hoặc chín chắn vượt tuổi' : T > 0.2 ? (male ? 'vợ ngang tuổi hoặc tính cách già dặn' : 'chồng lớn hơn vài tuổi') : T < -0.3 ? (male ? 'vợ kém khá nhiều tuổi' : 'chồng bằng tuổi hoặc trẻ hơn') : 'chênh ít tuổi') + ' (' + dong(tuoiP, T || 1) + ' dấu hiệu cùng chiều).',
    'Nơi/cách gặp: ' + PN_NHA7[r7.nha] + '; hướng cung Phu Thê là ' + PN_HUONG_CHI[pt.chi] + ' (so với nơi ở của bạn).',
    'Chất lượng hôn nhân: ' + (Q > 0.8 ? 'rất tốt – phối ngẫu là phúc tinh' : Q > 0.2 ? 'khá – hòa thuận, có vun đắp thì bền' : Q > -0.4 ? 'trung bình – có sóng gió, cần nhẫn nại và giao tiếp' : 'nhiều thử thách – nên kết hôn muộn, chọn kỹ, học cách dung hòa') + ' (điểm tổng ' + (Math.round(Q * 10) / 10) + ').',
    'Năm tín hiệu cưới hỏi mạnh nhất theo Tử Vi: ' + (tot.join(', ') || 'chưa rõ') + (sap.length ? '. Sắp tới: ' + sap.join(', ') : '') + '.'
  ];
  var hop = pnTuoiThangHop_(C, T);
  kl.push('Tuổi hợp nhất (năm âm lịch): ' + hop.tot.slice(0, 5).map(function (x) { return x.nam + ' ' + x.canChi + ' – ' + x.diem + '/10'; }).join('; ') + '.');
  var ta = hop.thangAm.slice().sort(function (a, b) { return b.diem - a.diem; }).slice(0, 3), tdg = hop.thangDuong.slice().sort(function (a, b) { return b.diem - a.diem; }).slice(0, 3);
  kl.push('Tháng sinh hợp: âm lịch tháng ' + ta.map(function (x) { return x.thang + ' (' + x.chi + ')'; }).join(', ') + '; dương lịch tháng ' + tdg.map(function (x) { return x.thang + ' (' + x.cung + ')'; }).join(', ') + '.');
  he.push({ he: 'Xem tuổi (Bát trạch – Ngũ hành)', items: ['Bản mệnh ' + hop.napAm + ', cung phi ' + hop.cungPhi + ' (' + PN_QUAI_HANH[hop.cungPhi] + ') – ' + (['Khảm', 'Ly', 'Chấn', 'Tốn'].indexOf(hop.cungPhi) >= 0 ? 'Đông tứ mệnh: hợp người cùng Đông tứ mệnh (Khảm, Ly, Chấn, Tốn).' : 'Tây tứ mệnh: hợp người cùng Tây tứ mệnh (Càn, Khôn, Cấn, Đoài).'),
    'Chấm điểm thang 10 theo 5 tiêu chí (mỗi tiêu chí 0–2): ngũ hành nạp âm, thiên can, địa chi, cung phi Bát trạch (Sinh khí/Diên niên tốt nhất), thiên mệnh năm sinh; cộng/trừ theo dụng thần Bát Tự và xu hướng chênh tuổi.'] });
  return { tieuDe: 'Chân dung ' + goi + ' tương lai', ketLuan: kl, nguon: he, chiSo: { tuoi: T, chatLuong: Q, cao: cao, beo: beo }, tuoiHop: hop };
}

/* =========================================================
 *  CHẤM ĐIỂM NĂM SINH & THÁNG SINH NGƯỜI PHỐI NGẪU
 *  Thang 10 theo 5 tiêu chí xem tuổi vợ chồng truyền thống (mỗi tiêu chí 0–2):
 *  Ngũ hành nạp âm · Thiên can · Địa chi · Cung phi Bát trạch · Thiên mệnh năm sinh
 *  + điều chỉnh theo dụng thần Bát Tự và xu hướng chênh tuổi của lá số.
 * ========================================================= */
var PN_QUAI = { 1: 'Khảm', 2: 'Khôn', 3: 'Chấn', 4: 'Tốn', 6: 'Càn', 7: 'Đoài', 8: 'Cấn', 9: 'Ly' };
var PN_QUAI_HANH = { 'Khảm': 'Thủy', 'Ly': 'Hỏa', 'Chấn': 'Mộc', 'Tốn': 'Mộc', 'Càn': 'Kim', 'Đoài': 'Kim', 'Khôn': 'Thổ', 'Cấn': 'Thổ' };
/** Du niên Bát trạch: thứ tự [Sinh khí, Thiên y, Diên niên, Phục vị, Họa hại, Lục sát, Ngũ quỷ, Tuyệt mệnh] */
var PN_DU_NIEN = {
  'Khảm': ['Tốn', 'Chấn', 'Ly', 'Khảm', 'Đoài', 'Càn', 'Cấn', 'Khôn'], 'Ly': ['Chấn', 'Tốn', 'Khảm', 'Ly', 'Cấn', 'Khôn', 'Đoài', 'Càn'],
  'Chấn': ['Ly', 'Khảm', 'Tốn', 'Chấn', 'Khôn', 'Cấn', 'Càn', 'Đoài'], 'Tốn': ['Khảm', 'Ly', 'Chấn', 'Tốn', 'Càn', 'Đoài', 'Khôn', 'Cấn'],
  'Càn': ['Đoài', 'Cấn', 'Khôn', 'Càn', 'Tốn', 'Khảm', 'Chấn', 'Ly'], 'Khôn': ['Cấn', 'Đoài', 'Càn', 'Khôn', 'Chấn', 'Ly', 'Tốn', 'Khảm'],
  'Cấn': ['Khôn', 'Càn', 'Đoài', 'Cấn', 'Ly', 'Chấn', 'Khảm', 'Tốn'], 'Đoài': ['Càn', 'Khôn', 'Cấn', 'Đoài', 'Khảm', 'Tốn', 'Ly', 'Chấn']
};
var PN_DU_TEN = ['Sinh khí', 'Thiên y', 'Diên niên', 'Phục vị', 'Họa hại', 'Lục sát', 'Ngũ quỷ', 'Tuyệt mệnh'];
var PN_DU_DIEM = [2, 1.5, 2, 1, 0.5, 0, 0, 0];
var PN_CAN_HOP = { 0: 5, 5: 0, 1: 6, 6: 1, 2: 7, 7: 2, 3: 8, 8: 3, 4: 9, 9: 4 };
var PN_LUC_HOP = { 0: 1, 1: 0, 2: 11, 11: 2, 3: 10, 10: 3, 4: 9, 9: 4, 5: 8, 8: 5, 6: 7, 7: 6 };
var PN_HAI = { 0: 7, 7: 0, 1: 6, 6: 1, 2: 5, 5: 2, 3: 4, 4: 3, 8: 11, 11: 8, 9: 10, 10: 9 };
var PN_HINH = [[2, 5], [5, 8], [2, 8], [1, 10], [10, 7], [1, 7], [0, 3]];

function pnCungPhi_(namAm, male) {
  var s = tsTongChuSo_(namAm); while (s > 9) s = tsTongChuSo_(s);
  var k = male ? 11 - s : 4 + s; while (k > 9) k -= 9; if (k <= 0) k += 9;
  if (k === 5) k = male ? 2 : 8;
  return PN_QUAI[k];
}
function pnQuanHeChi_(a, b) {
  if (PN_LUC_HOP[a] === b) return { d: 2, t: 'Lục hợp' };
  if (a !== b && (a - b + 12) % 4 === 0) return { d: 2, t: 'Tam hợp' };
  if ((a - b + 12) % 12 === 6) return { d: 0, t: 'Lục xung' };
  if (PN_HAI[a] === b) return { d: 0.5, t: 'Tương hại' };
  if (PN_HINH.some(function (p) { return (p[0] === a && p[1] === b) || (p[0] === b && p[1] === a); }) || (a === b && [4, 6, 9, 11].indexOf(a) >= 0)) return { d: 0.5, t: 'Tương hình' };
  return { d: 1, t: a === b ? 'Đồng chi' : 'Bình hòa' };
}
function pnQuanHeHanh_(a, b) {
  var q = quanHeHanh(a, b);
  return q === 'sinh' || q === 'duoc_sinh' ? { d: 2, t: a + ' – ' + b + ' tương sinh' } : q === 'binh' ? { d: 1, t: 'cùng hành ' + a } : { d: 0, t: a + ' – ' + b + ' tương khắc' };
}
function pnQuanHeCan_(a, b) {
  if (PN_CAN_HOP[a] === b) return { d: 2, t: CAN[a] + ' – ' + CAN[b] + ' ngũ hợp' };
  var q = quanHeHanh(CAN_HANH[a], CAN_HANH[b]);
  return q === 'sinh' || q === 'duoc_sinh' ? { d: 1.5, t: 'can tương sinh' } : q === 'binh' ? { d: 1, t: 'can bình hòa' } : { d: 0, t: CAN[a] + ' – ' + CAN[b] + ' tương khắc' };
}

/** Chấm điểm một năm sinh (âm lịch) của người phối ngẫu */
function pnChamNam_(self, Y, xuHuong) {
  var can = ((Y - 4) % 10 + 10) % 10, chi = ((Y - 4) % 12 + 12) % 12;
  var na = napAm(can, chi), qS = pnCungPhi_(Y, !self.male);
  var m = pnQuanHeHanh_(self.napAm.hanh, na.hanh), c = pnQuanHeCan_(self.can, can), z = pnQuanHeChi_(self.chi, chi);
  var du = PN_DU_NIEN[self.quai].indexOf(qS), cp = { d: PN_DU_DIEM[du], t: self.quai + ' – ' + qS + ': ' + PN_DU_TEN[du] };
  var tm = pnQuanHeHanh_(PN_QUAI_HANH[self.quai], PN_QUAI_HANH[qS]);
  var diem = m.d + c.d + z.d + cp.d + tm.d, ghi = [];
  if (self.hy.indexOf(CAN_HANH[can]) >= 0) { diem += 0.4; ghi.push('can năm là hỷ dụng thần Bát Tự'); }
  if (self.ky.indexOf(CAN_HANH[can]) >= 0) { diem -= 0.3; ghi.push('can năm là kỵ thần'); }
  if (self.hy.indexOf(na.hanh) >= 0) { diem += 0.3; ghi.push('nạp âm hợp dụng thần'); }
  var lech = Y - self.nam; // >0: phối ngẫu trẻ hơn
  if ((xuHuong > 0.2 && lech < 0) || (xuHuong < -0.2 && lech > 0) || (Math.abs(xuHuong) <= 0.2 && Math.abs(lech) <= 3)) { diem += 0.3; ghi.push('khớp xu hướng tuổi của lá số'); }
  diem = Math.max(0, Math.min(10, Math.round(diem * 10) / 10));
  return { nam: Y, canChi: CAN[can] + ' ' + CHI[chi], napAm: na.ten, cungPhi: qS, diem: diem, lech: lech,
    chiTiet: ['Mệnh: ' + m.t + ' (' + m.d + ')', 'Thiên can: ' + c.t + ' (' + c.d + ')', 'Địa chi: ' + z.t + ' (' + z.d + ')', 'Cung phi: ' + cp.t + ' (' + cp.d + ')', 'Thiên mệnh: ' + tm.t + ' (' + tm.d + ')'].concat(ghi) };
}

function pnXepLoai_(d) { return d >= 8 ? 'Rất hợp' : d >= 6.5 ? 'Hợp' : d >= 5 ? 'Khá' : d >= 3.5 ? 'Trung bình' : 'Kém hợp'; }

/** Năm sinh & tháng sinh phù hợp */
function pnTuoiThangHop_(C, xuHuong) {
  var tv = C.tv, bt = C.bt, ct = C.ct, male = tv.info.male, namAm = tv.info.lunar.year;
  var self = { male: male, nam: namAm, can: tv.info.yCan, chi: tv.info.yChi, napAm: tv.info.banMenh, quai: pnCungPhi_(namAm, male), hy: bt.goiY.hy, ky: bt.goiY.ky };
  // Khoảng năm sinh xét: nam từ hơn 10 tuổi đến kém 15 tuổi, nữ từ hơn 15 tuổi đến kém 10 tuổi (26 năm),
  // nới thêm 3 năm theo xu hướng chênh tuổi của lá số; người phối ngẫu phải đủ 18 tuổi vào năm xem.
  var tu = male ? -10 : -15, den = male ? 15 : 10, nam = [], toiDa = Math.max(tv.info.viewYear, namAm + 20) - 18; // phối ngẫu đủ 18 tuổi vào năm xem (hoặc khi đương số 20 tuổi nếu còn nhỏ)
  if (xuHuong > 0.4) tu -= 3; else if (xuHuong < -0.4) den += 3;
  for (var Y = namAm + tu; Y <= Math.min(namAm + den, toiDa); Y++) nam.push(pnChamNam_(self, Y, xuHuong));
  var xep = nam.slice().sort(function (a, b) { return b.diem - a.diem || Math.abs(a.lech) - Math.abs(b.lech); });
  // Tháng âm lịch: chi tháng (tháng 1 = Dần) so với nhật chi (cung phu thê) và chi năm
  var nc = bt.pillars[2].chi, thangAm = [];
  for (var k = 1; k <= 12; k++) {
    var chi = (k + 1) % 12, a = pnQuanHeChi_(nc, chi), b = pnQuanHeChi_(tv.info.yChi, chi), h = CHI_HANH[chi];
    var d = 3 + a.d * 1.5 + b.d + (bt.goiY.hy.indexOf(h) >= 0 ? 1.5 : bt.goiY.ky.indexOf(h) >= 0 ? -0.5 : 0.5);
    thangAm.push({ thang: k, chi: CHI[chi], diem: Math.max(0, Math.min(10, Math.round(d * 10) / 10)), ly: 'với cung phu thê ' + CHI[nc] + ': ' + a.t + '; với tuổi ' + CHI[tv.info.yChi] + ': ' + b.t + '; hành tháng ' + h + (bt.goiY.hy.indexOf(h) >= 0 ? ' (hỷ dụng)' : bt.goiY.ky.indexOf(h) >= 0 ? ' (kỵ)' : '') });
  }
  // Tháng dương lịch: cung Mặt Trời chiếm phần lớn tháng (tháng m ≈ cung (m+8)%12)
  var NT = ['Lửa', 'Đất', 'Khí', 'Nước'], HOP = { 'Lửa': 'Khí', 'Khí': 'Lửa', 'Đất': 'Nước', 'Nước': 'Đất' };
  var sun = ct.by.sun.cung, moon = ct.by.moon.cung, ds = ct.cusp[6].cung, v = ct.by[male ? 'venus' : 'mars'].cung;
  function hopCung(a, b) {
    var na = CT_CUNG[a].nt, nb = CT_CUNG[b].nt, kc = (b - a + 12) % 12;
    if (kc === 0) return 1.2; if (kc === 6) return 1.3; if (na === nb) return 1.5; if (HOP[na] === nb) return 1.1; if (kc === 3 || kc === 9) return -0.8; return 0;
  }
  var thangDuong = [];
  for (var m = 1; m <= 12; m++) {
    var sg = (m + 8) % 12, d2 = 3.5 + hopCung(sun, sg) * 1.2 + hopCung(moon, sg) * 0.8 + (sg === ds ? 1.5 : hopCung(ds, sg) * 0.6) + (sg === v ? 1 : hopCung(v, sg) * 0.5);
    thangDuong.push({ thang: m, cung: CT_CUNG[sg].ten, diem: Math.max(0, Math.min(10, Math.round(d2 * 10) / 10)),
      ly: 'Mặt Trời phần lớn ở ' + CT_CUNG[sg].ten + ' (' + CT_CUNG[sg].nt + ')' + (sg === ds ? ' – trùng cung Lặn (nhà 7) của bạn' : '') + (sg === v ? ' – trùng ' + (male ? 'Sao Kim' : 'Sao Hỏa') + ' của bạn' : '') });
  }
  return { cungPhi: self.quai, napAm: self.napAm.ten, nam: nam, tot: xep.slice(0, 8), tranh: xep.filter(function (x) { return x.diem < 4; }).sort(function (a, b) { return a.nam - b.nam; }),
    thangAm: thangAm, thangDuong: thangDuong };
}

/* =========================================================
 *  THỜI ĐIỂM KẾT HÔN / SINH CON – XÁC SUẤT THEO NĂM
 *  Mô hình Bayes đơn giản, minh bạch:
 *   - Tiên nghiệm theo tuổi: đường chuông quanh tuổi phổ biến (kết hôn: nam 28, nữ 25; con đầu: nam 30, nữ 27),
 *     dịch theo xu hướng "sớm/muộn" của lá số (Tử Vi, Bát Tự, Chiêm tinh – xem phoiNgauLuan.chiSo.tuoi).
 *   - Bằng chứng: tổng cường độ tín hiệu của 5 hệ có lịch năm (Tử Vi, Bát Tự, Hà Lạc, Chiêm tinh, Thần số)
 *     trong năm đó, mỗi hệ tối đa ~1,4 → hệ số exp(0,55 × tổng).
 *   - Hai nhánh: "nếu chưa" chuẩn hóa trên các năm còn lại; "nếu đã có" chuẩn hóa trên 10 năm vừa qua;
 *     cộng thêm tỷ lệ "đã diễn ra trước năm xem" và đối chiếu năm người dùng đã khai (Sự kiện đã biết).
 * ========================================================= */
var PN_TD = {
  ketHon: { ten: 'kết hôn', tuoi: [18, 45], tam: [28, 25], sd: 5 },
  sinhCon: { ten: 'sinh con', tuoi: [20, 45], tam: [30, 27], sd: 5.5 }
};
function pnThoiDiem_(C, namTin, xuHuong) {
  var male = C.tv.info.male, vy = C.tv.info.viewYear, out = {}, QUA = 10;
  /* Sự kiện người dùng đã khai (mục "Sự kiện đã biết" trong form) */
  var ev = ((C.input && C.input.events) || []).filter(function (e) { return e && +e.nam && +e.nam <= vy; });
  function daBiet(k) { return ev.filter(function (e) { return e.loai === k; }).map(function (e) { return +e.nam; }).sort(); }
  var tuoiNam = {}; namTin.forEach(function (n) { tuoiNam[n.nam] = n.tuoi; });
  function mucOf(p, tb) { return p >= tb * 2.2 ? 'Rất cao' : p >= tb * 1.4 ? 'Cao' : p >= tb * 0.8 ? 'Trung bình' : 'Thấp'; }
  function chuan(arr) {
    var t = arr.reduce(function (s, x) { return s + x.w; }, 0) || 1, tb = arr.length ? 100 / arr.length : 0;
    arr.forEach(function (x) { x.pct = Math.round(x.w / t * 1000) / 10; x.muc = mucOf(x.pct, tb); });
    return arr;
  }
  var cuoi = daBiet('ketHon');
  Object.keys(PN_TD).forEach(function (k) {
    var M = PN_TD[k], tam = M.tam[male ? 0 : 1] + (k === 'ketHon' ? xuHuong * 2 : xuHuong * 1.5), ds = [], biet = daBiet(k);
    /* Đã biết năm cưới → con đầu thường 1–3 năm sau cưới; năm trước khi cưới giảm trọng số */
    var namCuoi = k === 'sinhCon' && cuoi.length ? cuoi[0] : 0;
    if (namCuoi && tuoiNam[namCuoi]) tam = Math.max(tam, tuoiNam[namCuoi] + 1.5);
    namTin.forEach(function (n) {
      if (n.tuoi < M.tuoi[0] || n.tuoi > M.tuoi[1]) return;
      var o = n.tin[k] || {}, E = 0, he = [];
      Object.keys(o).forEach(function (h) { E += Math.min(1.4, o[h].v); if (o[h].v >= 0.8) he.push(h); });
      var prior = 0.06 + Math.exp(-Math.pow(n.tuoi - tam, 2) / (2 * M.sd * M.sd)); // sàn nhỏ: muộn hơn tuổi phổ biến vẫn có thể xảy ra
      if (namCuoi && n.nam < namCuoi) prior *= 0.25;
      ds.push({ nam: n.nam, tuoi: n.tuoi, canChi: n.canChi, soHe: he.length, he: he, E: Math.round(E * 10) / 10, w: prior * Math.exp(0.55 * E),
        ly: Object.keys(o).sort(function (a, b) { return o[b].v - o[a].v; }).slice(0, 4).map(function (h) { return o[h].ly; }), qua: n.nam < vy });
    });
    /* Khả năng việc này (nếu có trong đời) đã diễn ra trước năm xem – theo toàn cửa sổ tuổi */
    var tongAll = ds.reduce(function (s, x) { return s + x.w; }, 0) || 1;
    var pDaQua = Math.round(ds.filter(function (x) { return x.qua; }).reduce(function (s, x) { return s + x.w; }, 0) / tongAll * 100);
    /* Nhánh "nếu chưa": chuẩn hóa trên các năm còn lại. Nhánh "nếu đã có": chuẩn hóa trên 10 năm vừa qua */
    var sap = chuan(ds.filter(function (x) { return !x.qua; }).map(function (x) { return JSON.parse(JSON.stringify(x)); }));
    var daQua = ds.filter(function (x) { return x.qua; }), gan = daQua.filter(function (x) { return x.nam >= vy - QUA; });
    if (gan.length < 5) gan = daQua; // đã qua độ tuổi phổ biến từ lâu → nhìn lại cả cửa sổ tuổi
    var qua = chuan(gan.map(function (x) { return JSON.parse(JSON.stringify(x)); }));
    function tich(n) { return Math.round(sap.filter(function (x) { return x.nam < vy + n; }).reduce(function (s, x) { return s + x.pct; }, 0)); }
    function top(a, n) { return a.slice().sort(function (x, y) { return y.pct - x.pct; }).slice(0, n).sort(function (x, y) { return x.nam - y.nam; }); }
    /* Đối chiếu năm đã biết: lá số xếp năm đó hạng mấy trong 10 năm vừa qua */
    var doiChieu = biet.map(function (Y) {
      var x = qua.filter(function (q) { return q.nam === Y; })[0];
      if (!x) return { nam: Y, ngoai: true };
      var hang = 1 + qua.filter(function (q) { return q.pct > x.pct; }).length;
      return { nam: Y, tuoi: x.tuoi, pct: x.pct, muc: x.muc, soHe: x.soHe, he: x.he, hang: hang, tong: qua.length };
    });
    var daCuoi = k === 'ketHon' && biet.length > 0;
    out[k] = {
      ten: M.ten, tuoiDinh: Math.round(tam), daBiet: biet, doiChieu: doiChieu, pDaQua: ds.length ? pDaQua : null,
      nam: daCuoi ? [] : top(sap, 8),
      bieuDo: daCuoi ? [] : sap.map(function (x) { return { nam: x.nam, tuoi: x.tuoi, pct: x.pct }; }),
      quaKhu: { nam: top(qua, 5), bieuDo: qua.map(function (x) { return { nam: x.nam, tuoi: x.tuoi, pct: x.pct, soHe: x.soHe, he: x.he }; }), tu: qua.length ? qua[0].nam : null, den: qua.length ? qua[qua.length - 1].nam : null },
      qua: top(qua, 3),
      tichLuy: sap.length && !daCuoi ? { n3: tich(3), n5: tich(5), n10: tich(10) } : null,
      hetCuaSo: !sap.length, khongCoQua: !qua.length
    };
  });
  out.coSo = 'Xác suất từng năm = (khả năng theo độ tuổi) × (sức mạnh tín hiệu của 5 hệ trong năm đó). Vì không biết bạn đã kết hôn/có con hay chưa, kết quả chia hai nhánh: ' +
    '"nếu đã có" – chuẩn hóa trên ' + QUA + ' năm vừa qua (người lớn tuổi: cả giai đoạn ' + PN_TD.ketHon.tuoi[0] + '–' + PN_TD.ketHon.tuoi[1] + ' tuổi) để xem năm nào khả năng nhất; "nếu chưa" – chuẩn hóa trên các năm còn lại đến ' + PN_TD.ketHon.tuoi[1] + ' tuổi. ' +
    'Ô "đã diễn ra trước năm nay" là phần xác suất của cả cửa sổ tuổi rơi vào các năm đã qua. Nếu bạn khai năm kết hôn/sinh con ở mục "Sự kiện đã biết", lá số sẽ đối chiếu năm đó và tính năm có con sau năm cưới. ' +
    'Tuổi đỉnh được dịch theo xu hướng sớm/muộn của lá số. Đây là mô hình thống kê tham khảo, không phải chắc chắn.';
  return out;
}

/* =========================================================
 *  CHÂN DUNG CON CÁI
 * ========================================================= */
var PN_CON_TRAI = ['Thái Dương', 'Thất Sát', 'Phá Quân', 'Tử Vi', 'Vũ Khúc', 'Tham Lang', 'Liêm Trinh'];
var PN_CON_GAI = ['Thái Âm', 'Thiên Đồng', 'Cự Môn', 'Thiên Lương', 'Thiên Phủ', 'Thiên Tướng', 'Thiên Cơ'];
var PN_CON_NHA5 = { sun: 'con tự tin, thích dẫn dắt, là niềm tự hào của cha mẹ', moon: 'con giàu cảm xúc, gắn bó gia đình, cần được vỗ về', mercury: 'con lanh lợi, nói sớm, ham học hỏi',
  venus: 'con xinh xắn, có năng khiếu nghệ thuật, dễ thương', mars: 'con hiếu động, mạnh mẽ, thích thể thao', jupiter: 'con may mắn, rộng lượng; duyên con đông',
  saturn: 'con đến muộn hoặc ít; con chín chắn, có trách nhiệm', uranus: 'con độc lập, khác thường, sáng tạo', neptune: 'con nhạy cảm, mơ mộng, có năng khiếu nghệ thuật/tâm linh', pluto: 'con có ý chí mạnh, sâu sắc' };
/** Lấy nét tính cách con từ câu luận, bỏ các vế nói về số lượng/thời điểm */
function pnNetCon_(y) {
  return String(y).split(/[,;.]/).map(function (x) { return x.trim().replace(/^con (cái )?/, ''); })
    .filter(function (x) { return x && !/(ít|đông|muộn|sớm|nhiều con|khó nuôi|sinh khó)/.test(x); }).slice(0, 2);
}
function pnConCai_(C, td) {
  var tv = C.tv, bt = C.bt, ct = C.ct, male = tv.info.male, nguon = [], soP = [], traiP = [], tc = [];
  /* Tử Vi – cung Tử Tức */
  var tt = thCungTheoTen_(tv, 'Tử Tức'), sao = thChinhTinh_(tv, tt), tvi = [];
  tvi.push('Cung Tử Tức tại ' + tt.canTen + ' ' + tt.chiTen + ' – ' + diem10_(thDiemCung_(tv, 'Tử Tức')) + '/10' + (tt.chinh.length ? '' : ' (vô chính diệu, mượn sao cung đối)') + '.');
  sao.forEach(function (s) {
    var y = (LG_CUNG_SAO['Tử Tức'] || {})[s.n];
    if (y) { tvi.push(s.n + (s.b ? ' (' + s.b + ')' : '') + ': ' + y); tc = tc.concat(pnNetCon_(y)); }
    if (PN_CON_TRAI.indexOf(s.n) >= 0) traiP.push({ he: 'Tử Vi', v: 1 }); else if (PN_CON_GAI.indexOf(s.n) >= 0) traiP.push({ he: 'Tử Vi', v: -1 });
    if (/đông/.test(y || '')) soP.push({ he: 'Tử Vi', v: 1 }); else if (/ít|muộn/.test(y || '')) soP.push({ he: 'Tử Vi', v: -1 });
  });
  thSaoCung_(tt).forEach(function (s) {
    var y = (LG_DAC_THU['Tử Tức'] || {})[s.n];
    if (y) tvi.push(y);
    if (['Tả Phù', 'Hữu Bật', 'Thiên Hỷ', 'Thai', 'Long Trì', 'Phượng Các'].indexOf(s.n) >= 0) soP.push({ he: 'Tử Vi', v: 0.5 });
    if (['Địa Không', 'Địa Kiếp', 'Cô Thần', 'Quả Tú', 'Kình Dương', 'Đà La'].indexOf(s.n) >= 0) soP.push({ he: 'Tử Vi', v: -0.6 });
  });
  if (tt.tuan || tt.triet) { tvi.push('◇ Tử Tức gặp ' + (tt.triet ? 'Triệt' : 'Tuần') + ': con đầu lòng thường đến muộn, hoặc có một lần lỡ.'); soP.push({ he: 'Tử Vi', v: -0.5 }); }
  nguon.push({ he: 'Tử Vi', items: tvi });
  /* Bát Tự – sao con + thời trụ */
  var bti = [], sTrai = male ? 'Thất Sát' : 'Thương Quan', sGai = male ? 'Chính Quan' : 'Thực Thần', dT = 0, dG = 0;
  bt.pillars.forEach(function (p, i) {
    if (i !== 2) { if (p.thapThan === sTrai) dT += 1; if (p.thapThan === sGai) dG += 1; }
    p.tangCan.forEach(function (t, j) { var w = j ? 0.3 : 0.6; if (t.thapThan === sTrai) dT += w; if (t.thapThan === sGai) dG += w; });
  });
  bti.push('Sao con trai: ' + sTrai + ' (lực ' + Math.round(dT * 10) / 10 + '), sao con gái: ' + sGai + ' (lực ' + Math.round(dG * 10) / 10 + ') – ' +
    (dT > dG + 0.4 ? 'nghiêng về con trai.' : dG > dT + 0.4 ? 'nghiêng về con gái.' : 'khá cân bằng trai – gái.'));
  if (dT + dG) traiP.push({ he: 'Bát Tự', v: Math.max(-1, Math.min(1, (dT - dG) / (dT + dG) * 1.5)) });
  soP.push({ he: 'Bát Tự', v: dT + dG >= 2 ? 1 : dT + dG < 0.5 ? -1 : 0 });
  var gio = bt.pillars[3], hk = btctHyKy_(bt, CAN_HANH[gio.tangCan[0].can]);
  bti.push('Thời trụ (cung con cái) ' + gio.canTen + ' ' + gio.chiTen + ' là ' + hk + ' thần – ' + (hk === 'Kỵ' ? 'con cái cần nhiều công dạy dỗ, về già nên tự lo là chính.' : 'con cái hiếu thuận, về già được con đỡ đần.'));
  if (bt.pillars[3].chi === (bt.pillars[2].chi + 6) % 12) bti.push('✗ Thời chi xung nhật chi: con cái có chí hướng riêng, lớn lên thường ở xa cha mẹ.');
  nguon.push({ he: 'Bát Tự', items: bti });
  /* Chiêm tinh – nhà 5 */
  var ci = [], c5 = ct.cusp[4], S5 = CT_CUNG[c5.cung], h5 = ct.hanhTinh.filter(function (p) { return p.nha === 5 && PN_CON_NHA5[p.key]; });
  ci.push('Nhà 5 (con cái) bắt đầu ở ' + S5.ten + ': con mang nét ' + S5.tuKhoa + '.');
  tc.push('theo chiêm tinh: ' + S5.tuKhoa.split(',').slice(0, 2).join(','));
  h5.forEach(function (p) { ci.push(p.ten + ' ở nhà 5: ' + PN_CON_NHA5[p.key] + '.'); if (p.key === 'jupiter' || p.key === 'moon') soP.push({ he: 'Chiêm tinh', v: 0.8 }); if (p.key === 'saturn') soP.push({ he: 'Chiêm tinh', v: -0.8 }); });
  if (['Cự Giải', 'Bọ Cạp', 'Song Ngư'].indexOf(S5.ten) >= 0) soP.push({ he: 'Chiêm tinh', v: 0.6 });
  if (['Song Tử', 'Sư Tử', 'Xử Nữ'].indexOf(S5.ten) >= 0) soP.push({ he: 'Chiêm tinh', v: -0.4 });
  nguon.push({ he: 'Chiêm tinh', items: ci });
  /* Thần số */
  var ts = C.ts, tsi = [];
  if (ts.bieuDo && ts.bieuDo[6]) tsi.push('Có số 6 trong ngày sinh (' + ts.bieuDo[6] + ' lần): yêu gia đình, chăm con chu đáo' + (ts.bieuDo[6] >= 3 ? ' – nhưng dễ bao bọc quá mức.' : '.'));
  else tsi.push('Thiếu số 6: cần học cách thể hiện tình thương bằng hành động, dành thời gian cho con.');
  if (tsGoc_(ts.duongDoi) === 6 || tsGoc_(ts.duongDoi) === 2) soP.push({ he: 'Thần số học', v: 0.6 });
  nguon.push({ he: 'Thần số học', items: tsi });
  function tb(a) { var s = 0; a.forEach(function (x) { s += x.v; }); return a.length ? s / a.length : 0; }
  var S = tb(soP), Tr = tb(traiP), pTrai = Math.round(50 + Tr * 18);
  var sinh = td && td.sinhCon, dau = sinh && sinh.nam.slice().sort(function (a, b) { return b.pct - a.pct; })[0];
  var kl = [
    'Số con xu hướng: ' + (S > 0.4 ? 'đông con (3 trở lên nếu điều kiện cho phép)' : S > -0.2 ? '2 con' : 'ít con (1–2), hoặc con đến muộn') + '.',
    'Trai – gái: khả năng con đầu là con trai khoảng ' + pTrai + '%, con gái ' + (100 - pTrai) + '% (Tử Vi + Bát Tự; tham khảo).',
    'Tính cách con: ' + (tc.filter(Boolean).slice(0, 4).join(', ') || 'hài hòa, dễ dạy') + '.',
    'Quan hệ cha mẹ – con: ' + (hk === 'Kỵ' ? 'cần kiên nhẫn, dạy bằng lý lẽ; tránh áp đặt.' : 'gắn bó, con là chỗ dựa hậu vận.'),
    dau ? 'Năm dễ có tin vui con cái nhất phía trước: ' + dau.nam + ' (' + dau.tuoi + ' tuổi, ' + dau.pct + '%).' : ''
  ].filter(Boolean);
  return { tieuDe: 'Chân dung con cái', ketLuan: kl, nguon: nguon, chiSo: { soCon: S, pTrai: pTrai } };
}
