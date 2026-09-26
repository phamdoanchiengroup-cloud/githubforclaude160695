/**
 * ============================================================
 *  CapDoi.gs — XEM HỢP ĐÔI: KẾT HỢP LÁ SỐ CỦA HAI NGƯỜI
 *  Phương pháp: mỗi hệ tự chấm độ hợp theo cách truyền thống của hệ đó, rồi gộp có trọng số;
 *  các lĩnh vực (tình cảm, tài chính, công danh, gia đạo) và thời điểm (cưới, sinh con)
 *  được ghép từ cả hai lá số, không chỉ từ một người.
 *   1. Tuổi & ngũ hành năm sinh (xem tuổi truyền thống): nạp âm, thiên can, địa chi,
 *      cung phi Bát trạch, thiên mệnh – chấm hai chiều.
 *   2. Bát Tự hợp hôn: nhật can ngũ hợp/sinh khắc, nhật chi (cung phu thê) hợp – xung – hình – hại,
 *      "dụng thần trao đổi" (ngũ hành mạnh của người này có phải hỷ dụng của người kia),
 *      nguyệt trụ (nếp nhà hai bên), thế cân bằng thân vượng – thân nhược.
 *   3. Tử Vi: cung Mệnh hai người (tam hợp/lục hợp/xung), chính tinh Mệnh người này có nằm trong
 *      cung Phu Thê người kia, chất lượng cung Phu Thê mỗi người, Tuần/Triệt.
 *   4. Chiêm tinh so sánh (synastry): góc chiếu giữa hành tinh hai người – Mặt Trời/Mặt Trăng,
 *      Sao Kim/Sao Hỏa, Sao Thủy, Sao Thổ (cam kết), Sao Mộc (may mắn), cung Mọc.
 *   5. Thần số học: nhóm số chủ đạo (tư duy 1-5-7, thực tế 2-4-8, cảm xúc 3-6-9), số linh hồn.
 *   6. Human Design: kênh điện từ (mỗi người một cổng → hút nhau), kênh đồng hành, kênh áp đảo,
 *      kênh thỏa hiệp (dễ va chạm), cặp Loại, trung tâm cùng mở.
 *  Thời điểm cưới / sinh con: nhân phân phối xác suất theo năm của hai lá số (năm cả hai cùng báo
 *  mới nổi bật), trừ năm Kim Lâu của cô dâu và năm xung tuổi; năm sinh con nhân thêm khả năng
 *  đã cưới trước đó.
 * ============================================================
 */
var CD_TRONG_SO = { tuoi: 0.18, battu: 0.24, tuvi: 0.18, chiemTinh: 0.18, thanSo: 0.1, hd: 0.12 };
var CD_KIM_LAU = { 1: 'Kim Lâu Thân (kỵ bản thân)', 3: 'Kim Lâu Thê (kỵ người vợ)', 6: 'Kim Lâu Tử (kỵ con cái)', 8: 'Kim Lâu Súc (kỵ kinh tế)' };
/** Cặp hành tinh so sánh: [của người 1, của người 2, trọng số, lĩnh vực, ý nghĩa] */
var CD_CAP_HT = [
  ['sun', 'moon', 2, 'tinh', 'cặp kinh điển của hôn nhân – một người soi đường, một người nâng đỡ cảm xúc'],
  ['venus', 'mars', 1.8, 'tinh', 'sức hút, đam mê và sự lãng mạn'],
  ['moon', 'moon', 1.5, 'nha', 'nhịp cảm xúc và thói quen sinh hoạt hằng ngày'],
  ['venus', 'moon', 1.2, 'tinh', 'sự dịu dàng, cảm giác được yêu thương'],
  ['mercury', 'mercury', 1, 'giao', 'cách nói chuyện, trao đổi và giải quyết bất đồng'],
  ['venus', 'venus', 0.9, 'tinh', 'gu thẩm mỹ, cách thể hiện tình cảm, cách tiêu tiền cho niềm vui'],
  ['sun', 'sun', 0.9, 'nghiep', 'mục tiêu sống và cái tôi'],
  ['saturn', 'sun', 1.2, 'cam', 'cam kết, trách nhiệm – cũng là áp lực'],
  ['saturn', 'moon', 1.1, 'cam', 'gắn bó lâu dài nhưng dễ khô khan cảm xúc'],
  ['saturn', 'venus', 1, 'cam', 'chung thủy, bền lâu – căng thì lạnh nhạt'],
  ['jupiter', 'sun', 0.9, 'nghiep', 'người này mở rộng cơ hội, may mắn cho người kia'],
  ['jupiter', 'mc', 0.7, 'nghiep', 'nâng đỡ sự nghiệp, danh tiếng'],
  ['mars', 'mars', 0.8, 'giao', 'cách hành động – dễ cãi nhau khi căng'],
  ['sun', 'asc', 0.8, 'tinh', 'ấn tượng đầu tiên, cảm giác "đúng người"'],
  ['moon', 'asc', 0.6, 'nha', 'thấy dễ chịu, an toàn khi ở gần nhau']
];
var CD_GOC = [[0, 8, 'trùng tụ'], [60, 5, 'lục hợp'], [90, 6, 'vuông góc'], [120, 7, 'tam hợp'], [180, 7, 'đối đỉnh']];
var CD_NHOM_SO = { '157': 'tư duy – độc lập', '248': 'thực tế – xây dựng', '369': 'cảm xúc – sáng tạo' };

/* ---------------- Tiện ích ---------------- */
function cdKep_(x) { return Math.max(0, Math.min(10, Math.round(x * 10) / 10)); }
function cdGoi_(ten, mac) { var w = String(ten || '').trim().split(/\s+/).filter(Boolean); return w.length ? w[w.length - 1] : mac; }
function cdSelf_(r) {
  var tv = r.tuvi, bt = r.battu;
  return { male: tv.info.male, nam: tv.info.lunar.year, can: tv.info.yCan, chi: tv.info.yChi, napAm: tv.info.banMenh,
    quai: pnCungPhi_(tv.info.lunar.year, tv.info.male), hy: bt.goiY.hy, ky: bt.goiY.ky };
}
function cdHanhManh_(bt) { return HANH_SINH.slice().sort(function (a, b) { return (bt.phanTram[b] || 0) - (bt.phanTram[a] || 0); })[0]; }
function cdHanhTai_(h) { return HANH_SINH[(HANH_SINH.indexOf(h) + 2) % 5]; }   // hành mình khắc = Tài
function cdHanhQuan_(h) { return HANH_SINH[(HANH_SINH.indexOf(h) + 3) % 5]; }  // hành khắc mình = Quan
function cdKhoangCach_(l1, l2) { var s = Math.abs(((l1 - l2) % 360 + 360) % 360); return s > 180 ? 360 - s : s; }
function cdViTri_(r) {
  var ct = r.moRong.chiemTinh, m = {};
  ct.hanhTinh.forEach(function (p) { m[p.key] = p; });
  m.asc = ct.asc; m.mc = ct.mc;
  return m;
}
/** Năm tương lai có từ 3 hệ cùng báo theo chủ đề (Biến cố hội tụ) → {năm: số hệ} */
function cdNamChuDe_(r, k, vy, den) {
  var H = r.moRong.tongHop.hoiTu, out = {};
  if (!H) return out;
  (H.chuDe.filter(function (c) { return c.k === k; })[0] || { nam: [] }).nam.forEach(function (x) {
    if (x.nam >= vy && x.nam <= den) out[x.nam] = x.soHe;
  });
  return out;
}
function cdChia_(ds) {
  var tot = [], xau = [];
  ds.forEach(function (t) { if (/\((2|1\.5)\)$/.test(t)) tot.push(t); else if (/\(0\)$/.test(t)) xau.push(t); });
  return { tot: tot, xau: xau };
}

/* ---------------- 1. Tuổi & ngũ hành năm sinh ---------------- */
function cdTuoi_(A, B, tA, tB) {
  var sA = cdSelf_(A), sB = cdSelf_(B), ab = pnChamNam_(sA, sB.nam, 0), ba = pnChamNam_(sB, sA.nam, 0);
  var d = (ab.diem + ba.diem) / 2, g = cdChia_(ab.chiTiet.slice(0, 5));
  return { k: 'tuoi', ten: 'Tuổi & ngũ hành năm sinh', he: 'Xem tuổi (Tử Vi)', diem: cdKep_(d),
    chiTiet: [tA + ' tuổi ' + CAN[sA.can] + ' ' + CHI[sA.chi] + ' (' + sA.napAm.ten + ', cung phi ' + sA.quai + ') – ' + tB + ' tuổi ' + ab.canChi + ' (' + ab.napAm + ', cung phi ' + ab.cungPhi + ').']
      .concat(ab.chiTiet.slice(0, 5)).concat(['Chấm theo ' + tA + ': ' + ab.diem + '/10 · theo ' + tB + ': ' + ba.diem + '/10.']),
    tot: g.tot.map(function (t) { return 'Tuổi: ' + t.replace(/ \([\d.]+\)$/, ''); }),
    xau: g.xau.map(function (t) { return 'Tuổi: ' + t.replace(/ \([\d.]+\)$/, '') + ' – cần nhường nhịn, tránh quyết định lớn khi đang giận.'; }) };
}

/* ---------------- 2. Bát Tự hợp hôn ---------------- */
function cdBatTu_(A, B, tA, tB) {
  var a = A.battu, b = B.battu, d = 5, ct = [], tot = [], xau = [], ca = a.nhatChuCan, cb = b.nhatChuCan;
  ct.push('Nhật chủ ' + tA + ': ' + a.nhatChu + ' (' + a.cuong + ') · ' + tB + ': ' + b.nhatChu + ' (' + b.cuong + ').');
  if (PN_CAN_HOP[ca] === cb) { d += 2; tot.push('Nhật can ' + CAN[ca] + ' – ' + CAN[cb] + ' ngũ hợp: tâm đầu ý hợp, dễ hiểu ý nhau không cần nói nhiều.'); }
  else {
    var q = quanHeHanh(a.nhatChuHanh, b.nhatChuHanh);
    if (q === 'sinh') { d += 1; tot.push(tA + ' (' + a.nhatChuHanh + ') sinh cho ' + tB + ' (' + b.nhatChuHanh + '): ' + tA + ' hay chăm lo, vun vén cho ' + tB + '.'); }
    else if (q === 'duoc_sinh') { d += 1; tot.push(tB + ' (' + b.nhatChuHanh + ') sinh cho ' + tA + ' (' + a.nhatChuHanh + '): ' + tB + ' hay chăm lo, vun vén cho ' + tA + '.'); }
    else if (q === 'binh') { d += 0.4; ct.push('Hai nhật chủ cùng hành ' + a.nhatChuHanh + ': giống nhau nên dễ đồng cảm, nhưng cũng dễ "không ai chịu ai".'); }
    else { d -= 0.8; xau.push('Nhật chủ ' + a.nhatChuHanh + ' – ' + b.nhatChuHanh + ' tương khắc: cách nghĩ khác nhau, cần tôn trọng khác biệt thay vì cố thay đổi nhau.'); }
  }
  var z = pnQuanHeChi_(a.pillars[2].chi, b.pillars[2].chi), zt = 'Cung phu thê (nhật chi) ' + CHI[a.pillars[2].chi] + ' – ' + CHI[b.pillars[2].chi] + ': ' + z.t;
  d += (z.d - 1) * 1.3;
  if (z.d >= 2) tot.push(zt + ' – trong nhà hòa thuận, gắn bó.');
  else if (z.d === 0) xau.push(zt + ' – dễ va chạm trong sinh hoạt, "mỗi người một ý"; nên có không gian riêng và phân việc rõ.');
  else if (z.d < 1) xau.push(zt + ' – hay để bụng chuyện nhỏ; nói thẳng nhẹ nhàng sẽ tốt hơn im lặng.');
  else ct.push(zt + '.');
  // Dụng thần trao đổi: ngũ hành mạnh nhất của người này có phải hỷ dụng của người kia
  var mA = cdHanhManh_(a), mB = cdHanhManh_(b), vuong = { ab: 0, ba: 0 };
  function trao(x, y, tx, ty, my) {
    if (x.goiY.hy.indexOf(my) >= 0) { d += 1.1; tot.push(ty + ' mang năng lượng ' + my + ' – đúng hỷ dụng thần của ' + tx + ': ở cạnh ' + ty + ', ' + tx + ' vững vàng và vượng hơn ("vượng phu / ích thê").'); return 1; }
    if (x.goiY.ky.indexOf(my) >= 0) { d -= 0.7; xau.push(ty + ' mang năng lượng ' + my + ' – là kỵ thần của ' + tx + ': ' + tx + ' dễ mệt, bị áp lực khi ở gần lâu; cân bằng bằng màu sắc, hướng nhà hợp hành ' + x.goiY.dung + '.'); return -1; }
    return 0;
  }
  vuong.ab = trao(a, b, tA, tB, mB); vuong.ba = trao(b, a, tB, tA, mA);
  var ng = pnQuanHeChi_(a.pillars[1].chi, b.pillars[1].chi);
  if (ng.d === 0) { d -= 0.4; xau.push('Nguyệt trụ ' + CHI[a.pillars[1].chi] + ' – ' + CHI[b.pillars[1].chi] + ' xung: nếp nhà hai bên khác nhau – cần khéo khi ra mắt, về chung.'); }
  else if (ng.d >= 2) { d += 0.4; tot.push('Nguyệt trụ ' + ng.t.toLowerCase() + ': hai gia đình dễ hòa hợp, ủng hộ hai người.'); }
  var vA = /vượng|cường/i.test(a.cuong), vB = /vượng|cường/i.test(b.cuong);
  if (vA !== vB) { d += 0.5; tot.push('Một người thân vượng, một người thân nhược: một cứng một mềm – bù trừ tốt, dễ phân vai.'); }
  else ct.push(vA ? 'Cả hai đều thân vượng: đều mạnh, đều có chính kiến – cần phân rõ việc ai quyết.' : 'Cả hai đều thân nhược: tình cảm, dễ nhường nhau nhưng dễ cùng do dự – nên có người chủ động kế hoạch.');
  return { k: 'battu', ten: 'Bát Tự hợp hôn', he: 'Bát Tự', diem: cdKep_(d), chiTiet: ct.concat(tot, xau), tot: tot, xau: xau, vuong: vuong, manh: [mA, mB] };
}

/* ---------------- 3. Tử Vi: Mệnh – Phu Thê ---------------- */
function cdTuVi_(A, B, tA, tB) {
  var a = A.tuvi, b = B.tuvi, d = 5, ct = [], tot = [], xau = [];
  var z = pnQuanHeChi_(a.info.menh, b.info.menh), zt = 'Cung Mệnh ' + CHI[a.info.menh] + ' – ' + CHI[b.info.menh] + ': ' + z.t;
  d += (z.d - 1) * 1.2;
  if (z.d >= 2) tot.push(zt + ' – cùng "tần số", dễ đồng hành lâu dài.'); else if (z.d === 0) xau.push(zt + ' – hai cá tính đối lập, hút nhau nhưng dễ tranh cãi.'); else ct.push(zt + '.');
  function khop(x, y, tx, ty) {
    var pt = thCungTheoTen_(x, 'Phu Thê'), sx = thChinhTinh_(x, pt).map(function (s) { return s.n; });
    var my = y.palaces[y.info.menh].chinh.map(function (s) { return s.n; }), chung = my.filter(function (n) { return sx.indexOf(n) >= 0; });
    if (chung.length) { d += 1.4; tot.push('Chính tinh Mệnh của ' + ty + ' (' + chung.join(', ') + ') trùng sao cung Phu Thê của ' + tx + ': ' + ty + ' đúng "mẫu người" lá số ' + tx + ' chờ đợi.'); }
    else if (pnQuanHeChi_(pt.chi, y.info.menh).d >= 2 || pt.chi === y.info.menh) { d += 0.7; tot.push('Cung Phu Thê của ' + tx + ' (' + CHI[pt.chi] + ') hợp với cung Mệnh của ' + ty + ': duyên tiền định, dễ gắn bó.'); }
    if (pt.tuan || pt.triet) { d -= 0.4; xau.push('Phu Thê của ' + tx + ' gặp ' + (pt.triet ? 'Triệt' : 'Tuần') + ': giai đoạn đầu dễ trắc trở, xa cách – qua được thì bền.'); }
  }
  khop(a, b, tA, tB); khop(b, a, tB, tA);
  var ptA = diem10_(thDiemCung_(a, 'Phu Thê')), ptB = diem10_(thDiemCung_(b, 'Phu Thê'));
  d += ((ptA + ptB) / 2 - 5) * 0.45;
  ct.push('Chất lượng cung Phu Thê (thang 10): ' + tA + ' ' + ptA + ' · ' + tB + ' ' + ptB + '.');
  var cA = a.info.banMenh.hanh, cB = b.info.banMenh.hanh, q = quanHeHanh(cA, cB);
  if (q === 'sinh' || q === 'duoc_sinh') { d += 0.4; tot.push('Bản mệnh ' + cA + ' – ' + cB + ' tương sinh.'); }
  return { k: 'tuvi', ten: 'Tử Vi: Mệnh – Phu Thê', he: 'Tử Vi', diem: cdKep_(d), chiTiet: ct.concat(tot, xau), tot: tot, xau: xau, phuThe: [ptA, ptB] };
}

/* ---------------- 4. Chiêm tinh so sánh (synastry) ---------------- */
function cdChiemTinh_(A, B, tA, tB) {
  var pa = cdViTri_(A), pb = cdViTri_(B), ds = [], S = 0;
  function xet(k1, k2, w, lv, y, x, yv, tx, ty) {
    var p1 = x[k1], p2 = yv[k2];
    if (!p1 || !p2) return;
    var s = cdKhoangCach_(p1.lon, p2.lon);
    for (var i = 0; i < CD_GOC.length; i++) {
      var g = CD_GOC[i], lech = Math.abs(s - g[0]);
      if (lech > g[1]) continue;
      var diem, nang = /saturn|mars/.test(k1 + k2);
      if (g[0] === 120 || g[0] === 60) diem = 1;
      else if (g[0] === 0) diem = k1 === 'mars' && k2 === 'mars' ? 0.2 : nang ? 0.4 : 1;
      else if (g[0] === 90) diem = -0.9;
      else diem = /sun.*moon|moon.*sun|venus.*mars|mars.*venus|asc/.test(k1 + '.' + k2) ? 0.4 : -0.6;
      var chat = 0.55 + 0.45 * (1 - lech / (g[1] + 1)), v = diem * w * chat;
      S += v;
      ds.push({ v: v, lv: lv, t: (p1.ten || k1) + ' của ' + tx + ' ' + g[2] + ' ' + (p2.ten || k2) + ' của ' + ty + ' (lệch ' + Math.round(lech) + '°): ' + y + (diem > 0.5 ? ' – hài hòa.' : diem > 0 ? ' – gắn kết mạnh nhưng cần giữ nhịp.' : ' – căng, cần học cách nhường.') });
      return;
    }
  }
  CD_CAP_HT.forEach(function (c) {
    xet(c[0], c[1], c[2], c[3], c[4], pa, pb, tA, tB);
    if (c[0] !== c[1]) xet(c[0], c[1], c[2], c[3], c[4], pb, pa, tB, tA);
  });
  ds.sort(function (x, y) { return Math.abs(y.v) - Math.abs(x.v); });
  var ntA = CT_CUNG[pa.sun.cung].nt, ntB = CT_CUNG[pb.sun.cung].nt, HOP = { 'Lửa': 'Khí', 'Khí': 'Lửa', 'Đất': 'Nước', 'Nước': 'Đất' };
  var ntT = 'Mặt Trời ' + tA + ' ở ' + pa.sun.cungTen + ' (' + ntA + ') – ' + tB + ' ở ' + pb.sun.cungTen + ' (' + ntB + ')';
  if (ntA === ntB || HOP[ntA] === ntB) S += 0.8;
  var mA = CT_CUNG[pa.moon.cung].nt, mB = CT_CUNG[pb.moon.cung].nt;
  if (mA === mB || HOP[mA] === mB) S += 0.6;
  var tot = ds.filter(function (x) { return x.v > 0.3; }).map(function (x) { return x.t; }), xau = ds.filter(function (x) { return x.v < -0.3; }).map(function (x) { return x.t; });
  var SS = null;
  try { if (typeof ctSoSanh_ === 'function') SS = ctSoSanh_(A.moRong.chiemTinh, B.moRong.chiemTinh, tA, tB); } catch (e) { SS = null; }
  if (SS) { SS.nhaAB.concat(SS.nhaBA).forEach(function (x) { S += x.nha === 7 || x.nha === 5 ? 0.3 : x.nha === 12 ? -0.1 : 0.1; }); }
  return { k: 'chiemTinh', ten: 'Chiêm tinh so sánh', he: 'Chiêm tinh', diem: cdKep_(5 + S * 0.42), soSanh: SS,
    chiTiet: [ntT + (ntA === ntB || HOP[ntA] === ntB ? ' – nguyên tố hòa hợp.' : ' – nguyên tố khác nhau, bổ sung cho nhau nếu biết lắng nghe.'),
      'Mặt Trăng ' + tA + ' ở ' + pa.moon.cungTen + ' – ' + tB + ' ở ' + pb.moon.cungTen + (mA === mB || HOP[mA] === mB ? ': nhu cầu cảm xúc giống nhau.' : ': cách được vỗ về khác nhau – hỏi nhau "em/anh cần gì lúc buồn".')]
      .concat(ds.slice(0, 10).map(function (x) { return x.t; }))
      .concat(SS ? SS.tomTat.concat([SS.composite.t, SS.davison.t]) : []),
    tot: tot.slice(0, 5), xau: xau.slice(0, 4), goc: ds };
}

/* ---------------- 5. Thần số học ---------------- */
function cdThanSo_(A, B, tA, tB) {
  var a = A.moRong.thanSo, b = B.moRong.thanSo, ga = tsGoc_(a.duongDoi), gb = tsGoc_(b.duongDoi);
  var na = pnNhomSo_(a.duongDoi).join(''), nb = pnNhomSo_(b.duongDoi).join(''), d, y, tot = [], xau = [];
  if (ga === gb) { d = 7.5; y = 'Cùng số chủ đạo ' + ga + ': hiểu nhau như "soi gương" – nhưng cũng giống cả điểm yếu, dễ cùng cực đoan.'; }
  else if (na === nb) { d = 8.5; y = 'Cùng nhóm ' + CD_NHOM_SO[na] + ' (' + ga + ' & ' + gb + '): chung cách nhìn đời – nhóm hòa hợp tự nhiên.'; }
  else {
    var cap = [na, nb].sort().join('-');
    d = { '248-369': 7, '157-369': 6.2, '157-248': 5 }[cap] || 6;
    y = 'Số ' + ga + ' (' + CD_NHOM_SO[na] + ') & số ' + gb + ' (' + CD_NHOM_SO[nb] + '): ' +
      ({ '248-369': 'người thực tế giữ nền, người cảm xúc giữ lửa – bổ trợ tốt.', '157-369': 'một người lý trí, một người cảm xúc – cần kiên nhẫn giải thích cho nhau.', '157-248': 'cả hai đều cứng, ít bày tỏ cảm xúc – cần chủ động nói lời yêu thương.' }[cap] || 'khác nhóm, cần dung hòa.');
  }
  (d >= 7 ? tot : d < 6 ? xau : []).push('Thần số: ' + y);
  var ct = [y];
  if (a.linhHon && b.linhHon) {
    var lh = pnNhomSo_(a.linhHon).indexOf(tsGoc_(b.linhHon)) >= 0;
    if (lh) { d += 0.5; tot.push('Số linh hồn ' + a.linhHon + ' & ' + b.linhHon + ' cùng nhóm: khao khát sâu bên trong giống nhau.'); }
    ct.push('Số linh hồn: ' + tA + ' ' + a.linhHon + ' · ' + tB + ' ' + b.linhHon + (lh ? ' – đồng điệu.' : '.'));
  }
  [[a, tA], [b, tB]].forEach(function (p) { if ([11, 22, 33].indexOf(p[0].duongDoi) >= 0) ct.push(p[1] + ' mang số bậc thầy ' + p[0].duongDoi + ': nhạy cảm, lý tưởng cao – cần được thấu hiểu.'); });
  return { k: 'thanSo', ten: 'Thần số học', he: 'Thần số học', diem: cdKep_(d), chiTiet: ct, tot: tot, xau: xau };
}

/* ---------------- 6. Human Design ---------------- */
function cdHD_(A, B, tA, tB) {
  var a = A.moRong.hd, b = B.moRong.hd, em = [], dong = [], ap = [], thoa = [], tot = [], xau = [], ct = [];
  HD_CHANNELS.forEach(function (ch) {
    var a1 = !!a.gates[ch[0]], a2 = !!a.gates[ch[1]], b1 = !!b.gates[ch[0]], b2 = !!b.gates[ch[1]], fa = a1 && a2, fb = b1 && b2;
    if (fa && fb) dong.push(ch);
    else if (!fa && !fb && (a1 || b1) && (a2 || b2)) em.push(ch);
    else if ((fa && !b1 && !b2) || (fb && !a1 && !a2)) ap.push(ch);
    else if (fa || fb) thoa.push(ch);
  });
  var d = 5 + Math.min(3, em.length * 0.75) + Math.min(0.9, dong.length * 0.3) - Math.min(1.5, thoa.length * 0.5);
  if (em.length) tot.push(em.length + ' kênh điện từ (' + em.slice(0, 3).map(function (c) { return c[2]; }).join(', ') + '): mỗi người giữ một nửa – ở cạnh nhau thấy "được hoàn thiện", sức hút mạnh.');
  if (dong.length) tot.push(dong.length + ' kênh đồng hành (' + dong.slice(0, 2).map(function (c) { return c[2]; }).join(', ') + '): hiểu nhau như bạn thân.');
  if (thoa.length) xau.push(thoa.length + ' kênh thỏa hiệp (' + thoa.slice(0, 2).map(function (c) { return c[2]; }).join(', ') + '): một người luôn "lấn" người kia ở chủ đề này – dễ ấm ức ngầm.');
  if (ap.length) ct.push(ap.length + ' kênh áp đảo: ở các chủ đề đó một người dẫn dắt, người kia học hỏi.');
  var L = [a.loai, b.loai].sort().join('+'), gen = /Generator/;
  var cap = gen.test(a.loai) && b.loai === 'Projector' || gen.test(b.loai) && a.loai === 'Projector' ? [0.5, 'Generator & Projector: người có năng lượng, người biết dẫn hướng – cặp bổ trợ kinh điển; Projector cần được "mời" góp ý.'] :
    gen.test(a.loai) && gen.test(b.loai) ? [0.3, 'Cả hai đều là Generator: năng lượng bền, cùng làm cùng vui; hãy hỏi nhau câu có/không để nghe phản hồi xương cùng.'] :
    /Manifestor/.test(L) ? [0, 'Có Manifestor: người này cần thông báo trước khi hành động để người kia không bị bất ngờ.'] :
    /Reflector/.test(L) ? [0, 'Có Reflector: việc lớn nên để người Reflector có khoảng một chu kỳ trăng (28 ngày) để quyết.'] :
    a.loai === 'Projector' && b.loai === 'Projector' ? [0.1, 'Hai Projector: thấu hiểu sâu nhưng cần nghỉ ngơi đủ, tránh cùng kiệt sức.'] : [0, ''];
  d += cap[0]; if (cap[1]) ct.push(cap[1]);
  var cungMo = Object.keys(HD_CENTERS).filter(function (c) { return !a.dinh[c] && !b.dinh[c]; });
  if (cungMo.length) ct.push('Cùng mở trung tâm ' + cungMo.map(function (c) { return HD_CENTERS[c].ten.split(' (')[0]; }).join(', ') + ': ở những chủ đề này cả hai dễ cùng bị môi trường cuốn theo – nên có người thứ ba khách quan khi cần quyết.');
  if (a.dinh.solar && b.dinh.solar) ct.push('Cả hai có trung tâm Cảm xúc xác định: đừng quyết chuyện lớn lúc cảm xúc đang lên xuống – đợi "sóng" lắng.');
  return { k: 'hd', ten: 'Human Design', he: 'Human Design', diem: cdKep_(d), chiTiet: ['Loại: ' + tA + ' ' + a.loaiTen + ' · ' + tB + ' ' + b.loaiTen + '.'].concat(tot, xau, ct), tot: tot, xau: xau,
    so: { em: em.length, dong: dong.length, thoa: thoa.length, ap: ap.length } };
}

/* ---------------- Thời điểm: năm cưới & năm sinh con ---------------- */
function cdThoiDiem_(A, B, tA, tB, namCuoi, con) {
  con = con || [];
  var conCuoi = con.reduce(function (m, c) { return Math.max(m, c.nam); }, 0);
  var vy = A.tuvi.info.viewYear, male = [A, B].filter(function (r) { return r.tuvi.info.male; }), nu = [A, B].filter(function (r) { return !r.tuvi.info.male; });
  var coDau = nu.length === 1 ? nu[0] : null, tdA = A.moRong.tongHop.phoiNgau && A.moRong.tongHop.phoiNgau.thoiDiem, tdB = B.moRong.tongHop.phoiNgau && B.moRong.tongHop.phoiNgau.thoiDiem;
  function bd(td, k) { var m = {}; ((td && td[k] && td[k].bieuDo) || []).forEach(function (x) { m[x.nam] = x; }); return m; }
  function chuan(ds) {
    var t = ds.reduce(function (s, x) { return s + x.w; }, 0) || 1, tb = ds.length ? 100 / ds.length : 0;
    ds.forEach(function (x) { x.pct = Math.round(x.w / t * 1000) / 10; x.muc = x.pct >= tb * 2.2 ? 'Rất cao' : x.pct >= tb * 1.4 ? 'Cao' : x.pct >= tb * 0.8 ? 'Trung bình' : 'Thấp'; });
    return ds;
  }
  var chiNam = [A.tuvi.info.yChi, B.tuvi.info.yChi], ten = [tA, tB];
  function canhBao(Y) {
    var cb = [], h = 1, cy = ((Y - 4) % 12 + 12) % 12;
    if (coDau) {
      var tm = Y - coDau.tuvi.info.lunar.year + 1, kl = CD_KIM_LAU[tm % 9];
      if (kl) { cb.push('cô dâu ' + tm + ' tuổi mụ phạm ' + kl); h *= 0.6; }
    }
    chiNam.forEach(function (c, i) { if ((cy - c + 12) % 12 === 6) { cb.push('năm ' + CHI[cy] + ' xung tuổi ' + ten[i]); h *= 0.8; } });
    return { cb: cb, h: h, canChi: CAN[((Y - 4) % 10 + 10) % 10] + ' ' + CHI[cy] };
  }
  var kA = bd(tdA, 'ketHon'), kB = bd(tdB, 'ketHon'), ket = null;
  if (!namCuoi && !con.length) {
    var ds = [];
    for (var Y = vy; Y <= vy + 15; Y++) {
      if (!kA[Y] && !kB[Y]) continue;
      var pa = kA[Y] ? kA[Y].pct : 0.3, pb = kB[Y] ? kB[Y].pct : 0.3, c = canhBao(Y);
      ds.push({ nam: Y, canChi: c.canChi, w: pa * pb * c.h, pA: pa, pB: pb, heA: kA[Y] ? kA[Y].soHe || 0 : 0, heB: kB[Y] ? kB[Y].soHe || 0 : 0, canhBao: c.cb,
        tuoi: [Y - A.tuvi.info.lunar.year + 1, Y - B.tuvi.info.lunar.year + 1] });
    }
    chuan(ds);
    var tich = function (n) { return Math.round(ds.filter(function (x) { return x.nam < vy + n; }).reduce(function (s, x) { return s + x.pct; }, 0)); };
    ket = { nam: ds, top: ds.slice().sort(function (x, y) { return y.pct - x.pct; }).slice(0, 5).sort(function (x, y) { return x.nam - y.nam; }), tichLuy: ds.length ? { n1: tich(1), n3: tich(3), n5: tich(5) } : null };
  }
  // Sinh con: nhân khả năng đã cưới trước năm đó
  var cA = bd(tdA, 'sinhCon'), cB = bd(tdB, 'sinhCon'), F = {}, cum = 0;
  for (var y = vy; y <= vy + 16; y++) {
    F[y] = namCuoi ? (y > namCuoi ? 1 : 0.05) : con.length ? 1 : cum / 100;
    if (ket) ket.nam.forEach(function (x) { if (x.nam === y) cum += x.pct; });
  }
  var dc = [];
  for (var Y2 = vy; Y2 <= vy + 16; Y2++) {
    if (!cA[Y2] && !cB[Y2]) continue;
    var qa = cA[Y2] ? cA[Y2].pct : 0.3, qb = cB[Y2] ? cB[Y2].pct : 0.3;
    var gian = conCuoi && Y2 <= conCuoi ? 0.1 : conCuoi && Y2 < conCuoi + 2 ? 0.35 : 1;   // cách con trước ít nhất ~2 năm
    dc.push({ nam: Y2, canChi: canhBao(Y2).canChi, w: qa * qb * (0.08 + F[Y2]) * gian, heA: cA[Y2] ? cA[Y2].soHe || 0 : 0, heB: cB[Y2] ? cB[Y2].soHe || 0 : 0,
      tuoi: [Y2 - A.tuvi.info.lunar.year + 1, Y2 - B.tuvi.info.lunar.year + 1] });
  }
  chuan(dc);
  return { ketHon: ket, namCuoi: namCuoi || null, daCoCon: con.length, coDau: coDau ? (coDau === A ? tA : tB) : '',
    sinhCon: { nam: dc, top: dc.slice().sort(function (x, y) { return y.pct - x.pct; }).slice(0, 5).sort(function (x, y) { return x.nam - y.nam; }) } };
}

/* ---------------- Con cái ---------------- */
/** Tuổi con (năm âm lịch Y) với một người cha/mẹ: nạp âm, thiên can, địa chi + dụng thần Bát Tự của cha/mẹ */
function cdConVoi_(Y, P, tenP, hanhManhCon) {
  var can = ((Y - 4) % 10 + 10) % 10, chi = ((Y - 4) % 12 + 12) % 12, na = napAm(can, chi), I = P.tuvi.info, pm = I.banMenh.hanh, q = quanHeHanh(na.hanh, pm);
  var m = q === 'sinh' ? [2, 'Mệnh con (' + na.ten + ') sinh mệnh ' + tenP + ' (' + I.banMenh.ten + '): con mang phúc, hiếu thuận với ' + tenP + '.'] :
    q === 'binh' ? [1.5, 'Mệnh con cùng hành ' + pm + ' với ' + tenP + ': tính giống nhau, dễ hiểu nhau.'] :
    q === 'duoc_sinh' ? [1.5, 'Mệnh ' + tenP + ' (' + I.banMenh.ten + ') sinh mệnh con: ' + tenP + ' hết lòng nâng đỡ, con được che chở.'] :
    q === 'bi_khac' ? [0.5, 'Mệnh ' + tenP + ' khắc mệnh con: ' + tenP + ' dễ nghiêm khắc, con chịu áp lực – nên mềm mỏng.'] :
    [0, 'Mệnh con (' + na.ten + ') khắc mệnh ' + tenP + ': con cá tính, hay trái ý ' + tenP + ' – cần kiên nhẫn.'];
  var c = pnQuanHeCan_(I.yCan, can), z = pnQuanHeChi_(I.yChi, chi), bonus = 0, ly = [m[1], 'Thiên can ' + CAN[I.yCan] + ' – ' + CAN[can] + ': ' + c.t + '.', 'Địa chi ' + CHI[I.yChi] + ' – ' + CHI[chi] + ': ' + z.t + '.'];
  var hy = P.battu.goiY.hy, ky = P.battu.goiY.ky;
  if (hy.indexOf(CAN_HANH[can]) >= 0) { bonus += 0.5; ly.push('Can năm của con (' + CAN_HANH[can] + ') là hỷ dụng thần của ' + tenP + '.'); }
  else if (ky.indexOf(CAN_HANH[can]) >= 0) { bonus -= 0.4; ly.push('Can năm của con (' + CAN_HANH[can] + ') là kỵ thần của ' + tenP + '.'); }
  if (hanhManhCon) {
    if (hy.indexOf(hanhManhCon) >= 0) { bonus += 0.8; ly.push('Ngũ hành mạnh nhất trong Bát Tự của con (' + hanhManhCon + ') là hỷ dụng của ' + tenP + ': con là "phúc tinh" của ' + tenP + '.'); }
    else if (ky.indexOf(hanhManhCon) >= 0) { bonus -= 0.5; ly.push('Ngũ hành mạnh của con (' + hanhManhCon + ') là kỵ thần của ' + tenP + ': hai người dễ "nghịch nhau" – cần thêm thời gian thấu hiểu.'); }
  }
  return { ten: tenP, diem: cdKep_((m[0] + c.d + z.d) / 6 * 8 + 1 + bonus), ly: ly };
}
function cdConNam_(Y, A, B, tA, tB, hanhManhCon) {
  var can = ((Y - 4) % 10 + 10) % 10, chi = ((Y - 4) % 12 + 12) % 12, voi = [cdConVoi_(Y, A, tA, hanhManhCon), cdConVoi_(Y, B, tB, hanhManhCon)];
  return { canChi: CAN[can] + ' ' + CHI[chi], chi: chi, napAm: napAm(can, chi).ten, voi: voi, diem: cdKep_((voi[0].diem + voi[1].diem) / 2) };
}
/** Tín hiệu có con năm Y trên lá số một người: số hệ báo và hạng của năm đó trong giai đoạn đã qua (xác suất theo năm) */
function cdHeConNam_(r, Y) {
  var td = r.moRong.tongHop.phoiNgau && r.moRong.tongHop.phoiNgau.thoiDiem, q = td && td.sinhCon && td.sinhCon.quaKhu, bd = q ? q.bieuDo : [];
  var x = bd.filter(function (n) { return n.nam === Y; })[0];
  if (x) return { he: x.soHe || 0, hang: 1 + bd.filter(function (n) { return n.pct > x.pct; }).length, tong: bd.length, pct: x.pct };
  var H = r.moRong.tongHop.hoiTu, c = H && H.chuDe.filter(function (k) { return k.k === 'sinhCon'; })[0], y = c && c.nam.filter(function (n) { return n.nam === Y; })[0];
  return { he: y ? y.soHe : 0, hang: 0, tong: 0 };
}
/** Chuẩn hóa thông tin con đã có: năm âm lịch, Bát Tự nếu có ngày sinh */
function cdChuanCon_(ds, vy) {
  return (ds || []).filter(function (c) { return c && +c.nam >= 1900 && +c.nam <= vy; }).slice(0, 6).map(function (c, i) {
    var o = { ten: String(c.ten || '').trim() || 'Con thứ ' + (i + 1), gioiTinh: c.gioiTinh === 'gai' ? 'gai' : c.gioiTinh === 'trai' ? 'trai' : '', nam: +c.nam, namAm: +c.nam, day: +c.ngay || 0, thang: +c.thang || 0, gio: c.gio === '' || c.gio == null ? null : +c.gio };
    if (o.day && o.thang) {
      try {
        var inp = { name: o.ten, gender: o.gioiTinh === 'gai' ? 'nu' : 'nam', calendar: 'duong', day: o.day, month: o.thang, year: o.nam, hour: o.gio == null ? 12 : o.gio, minute: 0, viewYear: vy };
        var tv = tuviLapLaSo(inp), bt = batTuLap(inp);
        o.namAm = tv.info.lunar.year; o.hanhManh = cdHanhManh_(bt);
        o.moTa = 'Mệnh ' + (tv.palaces[tv.info.menh].chinh.map(function (x) { return x.n; }).join(', ') || 'vô chính diệu') + ' · nhật chủ ' + bt.nhatChu + ' (' + bt.cuong + ')' + (o.gio == null ? ' · chưa rõ giờ sinh' : '');
      } catch (e) { /* thiếu dữ liệu → chỉ xét năm */ }
    }
    return o;
  }).sort(function (x, y) { return x.nam - y.nam; });
}
function cdConCai_(A, B, tA, tB, bt, con, td) {
  var ca = A.moRong.tongHop.phoiNgau && A.moRong.tongHop.phoiNgau.conCai, cb = B.moRong.tongHop.phoiNgau && B.moRong.tongHop.phoiNgau.conCai;
  if (!ca || !cb) return null;
  var S = (ca.chiSo.soCon + cb.chiSo.soCon) / 2, cha = A.tuvi.info.male && !B.tuvi.info.male ? ca : !A.tuvi.info.male && B.tuvi.info.male ? cb : null;
  var me = cha === ca ? cb : cha === cb ? ca : null;
  var pTrai = cha ? Math.round(cha.chiSo.pTrai * 0.6 + me.chiSo.pTrai * 0.4) : Math.round((ca.chiSo.pTrai + cb.chiSo.pTrai) / 2);
  if (/xung/.test(bt.chiTiet.join(' ')) && /nhật chi|phu thê/i.test(bt.xau.join(' '))) S -= 0.15;
  var soCon = S > 0.4 ? '3 con trở lên (nếu điều kiện cho phép)' : S > 0.05 ? '2 – 3 con' : S > -0.25 ? '2 con' : '1 – 2 con, hoặc con đến muộn';
  var duKien = S > 0.4 ? 3 : S > 0.05 ? 2.5 : S > -0.25 ? 2 : 1.5;
  function netCon(c) { var k = (c.ketLuan || []).filter(function (x) { return /^Tính cách con/.test(x); })[0]; return k ? k.replace(/^Tính cách con:\s*/, '').replace(/\.$/, '') : ''; }
  var kl = ['Số con xu hướng khi ghép hai lá số: ' + soCon + '.'];
  if (con.length) {
    var them = duKien - con.length;
    kl.push('Hai bạn đã có ' + con.length + ' con (' + con.map(function (c) { return c.ten + (c.gioiTinh ? ' – ' + (c.gioiTinh === 'trai' ? 'trai' : 'gái') : '') + ', ' + c.nam; }).join('; ') + '). ' +
      (them >= 0.9 ? 'Lá số còn "duyên con": có thể thêm khoảng ' + Math.round(them) + ' con nữa.' : them > 0.2 ? 'Lá số còn khả năng thêm 1 con nếu hai bạn mong muốn.' : 'Số con đã khá đủ so với lá số – nếu sinh thêm nên chọn năm hợp tuổi và chăm sóc sức khỏe người mẹ kỹ.'));
  }
  kl.push((con.length ? 'Con tiếp theo: trai' : 'Con đầu: trai') + ' khoảng ' + pTrai + '%, gái ' + (100 - pTrai) + '%' + (cha ? ' (lá số người cha nặng hơn 60/40 theo truyền thống)' : '') + '.');
  kl.push('Nét con thừa hưởng từ ' + tA + ': ' + (netCon(ca) || 'hài hòa') + '.', 'Nét con thừa hưởng từ ' + tB + ': ' + (netCon(cb) || 'hài hòa') + '.');
  // Con đã có: tuổi con với cha mẹ + đối chiếu lá số
  var daCo = con.map(function (c) {
    var t = cdConNam_(c.namAm, A, B, tA, tB, c.hanhManh), hA = cdHeConNam_(A, c.nam), hB = cdHeConNam_(B, c.nam);
    function mo(h, ten) { return ten + ' ' + h.he + ' hệ' + (h.tong ? ' (năm này xếp hạng ' + h.hang + '/' + h.tong + ')' : ''); }
    var khop = (hA.hang && hA.hang <= 3) || (hB.hang && hB.hang <= 3) || hA.he >= 3 || hB.he >= 3, motPhan = hA.he + hB.he >= 2 || (hA.hang && hA.hang <= 5) || (hB.hang && hB.hang <= 5);
    return { ten: c.ten, gioiTinh: c.gioiTinh, nam: c.nam, namAm: c.namAm, canChi: t.canChi, napAm: t.napAm, diem: t.diem, voi: t.voi, moTa: c.moTa || '',
      doiChieu: 'Năm ' + c.nam + ' – tín hiệu tin vui con cái: ' + mo(hA, tA) + ', ' + mo(hB, tB) + (khop ? ' → khớp, độ tin cậy của lá số cao.' : motPhan ? ' → khớp một phần.' : ' → tín hiệu yếu (có thể lệch giờ sinh của bố/mẹ).'),
      ghiChu: c.day ? '' : 'Chỉ nhập năm: tính theo năm âm lịch ' + c.nam + ' – nếu con sinh trước Tết, hãy nhập đủ ngày tháng để chính xác.' };
  });
  if (daCo.length > 1) for (var i = 1; i < daCo.length; i++) {
    var z = pnQuanHeChi_(((daCo[i - 1].namAm - 4) % 12 + 12) % 12, ((daCo[i].namAm - 4) % 12 + 12) % 12);
    daCo[i].anhEm = daCo[i - 1].ten + ' & ' + daCo[i].ten + ': ' + z.t + (z.d >= 2 ? ' – anh chị em thương nhau, hay bênh nhau.' : z.d === 0 ? ' – dễ tranh giành, cha mẹ nên công bằng.' : '.');
  }
  // Gợi ý năm sinh con hợp tuổi: điểm hợp tuổi với cha mẹ + xác suất hai lá số + hòa hợp với anh chị
  var dsSC = td && td.sinhCon ? td.sinhCon.nam : [], mxP = Math.max.apply(null, dsSC.map(function (x) { return x.pct; }).concat([1]));
  var goiY = dsSC.map(function (x) {
    var t = cdConNam_(x.nam, A, B, tA, tB, null), anh = [], d = t.diem;
    daCo.forEach(function (c) {
      var z = pnQuanHeChi_(((c.namAm - 4) % 12 + 12) % 12, t.chi);
      if (z.d === 0) { d -= 0.6; anh.push('xung tuổi ' + c.ten); } else if (z.d >= 2) { d += 0.3; anh.push(z.t.toLowerCase() + ' với ' + c.ten); }
    });
    var tong = cdKep_(Math.max(0, d) * 0.65 + (x.pct / mxP) * 10 * 0.35);
    return { nam: x.nam, canChi: t.canChi, napAm: t.napAm, hopTuoi: cdKep_(d), pct: x.pct, tong: tong, voi: t.voi.map(function (v) { return { ten: v.ten, diem: v.diem }; }), anhEm: anh,
      ly: t.voi.map(function (v) { return v.ten + ' ' + v.diem + '/10: ' + v.ly[0]; }) };
  }).filter(function (x) { return x.pct > 0.2 || x.hopTuoi >= 7; });
  var topGoi = goiY.slice().sort(function (x, y) { return y.tong - x.tong; }).slice(0, 5).sort(function (x, y) { return x.nam - y.nam; });
  return { soCon: soCon, chiSo: Math.round(S * 100) / 100, pTrai: pTrai, ketLuan: kl, daCo: daCo, goiY: goiY, goiYTop: topGoi };
}

/* ---------------- Lĩnh vực ảnh hưởng lẫn nhau ---------------- */
function cdLinhVuc_(A, B, tA, tB, P) {
  var vy = A.tuvi.info.viewYear, den = vy + 20, a = A.tuvi, b = B.tuvi, bt = P.battu, ct = P.chiemTinh;
  function d10(tv, c) { return diem10_(thDiemCung_(tv, c)); }
  function chung(k) {
    var x = cdNamChuDe_(A, k, vy, den), y = cdNamChuDe_(B, k, vy, den);
    return Object.keys(x).filter(function (n) { return y[n]; }).map(function (n) { return { nam: +n, he: [x[n], y[n]] }; });
  }
  function gocLv(lv) { return (ct.goc || []).filter(function (g) { return g.lv === lv; }).slice(0, 3).map(function (g) { return g.t; }); }
  function namTxt(ds) { return ds.slice(0, 6).map(function (x) { return x.nam; }).join(', '); }
  // Tài chính
  var taiA = d10(a, 'Tài Bạch'), taiB = d10(b, 'Tài Bạch'), dtA = d10(a, 'Điền Trạch'), dtB = d10(b, 'Điền Trạch');
  var ptA = A.battu.phanTram[cdHanhTai_(A.battu.nhatChuHanh)] || 0, ptB = B.battu.phanTram[cdHanhTai_(B.battu.nhatChuHanh)] || 0;
  var gA = taiA * 0.45 + dtA * 0.3 + ptA / 10, gB = taiB * 0.45 + dtB * 0.3 + ptB / 10;
  var tc = { diem: cdKep_((taiA + taiB) / 2 + bt.vuong.ab * 0.5 + bt.vuong.ba * 0.5), y: [] };
  tc.y.push('Tài Bạch (thang 10): ' + tA + ' ' + taiA + ' · ' + tB + ' ' + taiB + '; Điền Trạch: ' + dtA + ' · ' + dtB + '. Tài tinh Bát Tự: ' + tA + ' ' + ptA + '% · ' + tB + ' ' + ptB + '%.');
  tc.y.push('Người nên giữ quỹ chung: ' + (Math.abs(gA - gB) < 0.4 ? 'hai người ngang nhau – nên lập quỹ chung minh bạch, mỗi người giữ một khoản riêng.' : (gA > gB ? tA : tB) + ' – giữ tiền và tích lũy tốt hơn; người kia hợp vai tạo nguồn thu, mở rộng.'));
  if (bt.vuong.ab > 0) tc.y.push('✓ ' + tB + ' vượng tài cho ' + tA + ' (mang hỷ dụng thần ' + bt.manh[1] + ').'); if (bt.vuong.ba > 0) tc.y.push('✓ ' + tA + ' vượng tài cho ' + tB + ' (mang hỷ dụng thần ' + bt.manh[0] + ').');
  if (bt.vuong.ab < 0) tc.y.push('◇ Năng lượng ' + bt.manh[1] + ' của ' + tB + ' là kỵ thần của ' + tA + ': việc tiền lớn nên để ' + tA + ' tự quyết phần của mình.');
  if (bt.vuong.ba < 0) tc.y.push('◇ Năng lượng ' + bt.manh[0] + ' của ' + tA + ' là kỵ thần của ' + tB + ': việc tiền lớn nên để ' + tB + ' tự quyết phần của mình.');
  var tl = chung('taiLoc'), ht = chung('taiChinh');
  if (tl.length) tc.y.push('✓ Năm cả hai cùng có tín hiệu tài lộc (≥3 hệ mỗi người): ' + namTxt(tl) + ' – hợp để cùng đầu tư, mua nhà, mở việc chung.');
  if (ht.length) tc.y.push('✗ Năm cả hai cùng dễ hao tài: ' + namTxt(ht) + ' – tránh vay mượn lớn, bảo lãnh, đầu tư mạo hiểm.');
  // Công danh
  var qA = d10(a, 'Quan Lộc'), qB = d10(b, 'Quan Lộc'), cd = { diem: cdKep_((qA + qB) / 2), y: [] };
  cd.y.push('Quan Lộc (thang 10): ' + tA + ' ' + qA + ' · ' + tB + ' ' + qB + '.');
  function quyNhan(x, y, tx, ty, my) {
    var quan = cdHanhQuan_(x.battu.nhatChuHanh);
    if (my === quan || x.battu.goiY.hy.indexOf(my) >= 0) { cd.diem = cdKep_(cd.diem + 0.4); cd.y.push('✓ ' + ty + ' là quý nhân sự nghiệp của ' + tx + ' (hành ' + my + (my === quan ? ' là Quan tinh – giúp ' + tx + ' có địa vị, kỷ luật' : ' là hỷ dụng') + ').'); }
  }
  quyNhan(A, B, tA, tB, bt.manh[1]); quyNhan(B, A, tB, tA, bt.manh[0]);
  gocLv('nghiep').forEach(function (t) { cd.y.push('☉ ' + t); });
  var ql = chung('quanLoc');
  if (ql.length) cd.y.push('✓ Năm cả hai cùng có chuyển động sự nghiệp: ' + namTxt(ql) + ' – nên bàn trước việc ai "tăng tốc", ai giữ hậu phương.');
  var riengA = Object.keys(cdNamChuDe_(A, 'quanLoc', vy, vy + 10)), riengB = Object.keys(cdNamChuDe_(B, 'quanLoc', vy, vy + 10));
  if (riengA.length || riengB.length) cd.y.push('Năm thăng tiến riêng (10 năm tới): ' + tA + ' ' + (riengA.slice(0, 4).join(', ') || '—') + ' · ' + tB + ' ' + (riengB.slice(0, 4).join(', ') || '—') + ' – năm của người này thì người kia làm hậu phương.');
  // Gia đạo
  var dA = (d10(a, 'Điền Trạch') + d10(a, 'Phúc Đức')) / 2, dB = (d10(b, 'Điền Trạch') + d10(b, 'Phúc Đức')) / 2, gd = { diem: cdKep_((dA + dB) / 2), y: [] };
  gd.y.push('Điền Trạch & Phúc Đức (trung bình, thang 10): ' + tA + ' ' + Math.round(dA * 10) / 10 + ' · ' + tB + ' ' + Math.round(dB * 10) / 10 + '.');
  bt.tot.concat(bt.xau).filter(function (t) { return /phu thê|Nguyệt trụ/i.test(t); }).forEach(function (t) { gd.y.push((/xung|hại|hình|để bụng/.test(t) ? '✗ ' : '✓ ') + t); });
  gocLv('nha').concat(gocLv('cam')).slice(0, 3).forEach(function (t) { gd.y.push('☽ ' + t); });
  var gdx = chung('giaDao'), sk = chung('sucKhoe');
  if (gdx.length) { gd.diem = cdKep_(gd.diem - 0.3); gd.y.push('✗ Năm cả hai cùng có tín hiệu biến động gia đạo: ' + namTxt(gdx) + ' – năm cần giữ hòa khí, tránh quyết định chia tách, bán nhà vội.'); }
  if (sk.length) gd.y.push('◇ Năm cả hai cùng cần giữ sức khỏe: ' + namTxt(sk) + ' – chăm sóc nhau, khám định kỳ.');
  // Tình cảm – giao tiếp
  var tinh = gocLv('tinh'), giao = gocLv('giao'), tcm = { diem: cdKep_((P.chiemTinh.diem + P.thanSo.diem + P.hd.diem) / 3), y: [] };
  tinh.forEach(function (t) { tcm.y.push('♥ ' + t); }); giao.forEach(function (t) { tcm.y.push('✎ ' + t); });
  P.thanSo.chiTiet.slice(0, 1).forEach(function (t) { tcm.y.push('❖ ' + t); });
  if (P.hd.so.em) tcm.y.push('◈ ' + P.hd.so.em + ' kênh điện từ Human Design – sức hút tự nhiên.');
  var kh = chung('ketHon'); if (kh.length) tcm.y.push('✓ Năm cả hai cùng có tín hiệu hỷ sự: ' + namTxt(kh) + '.');
  return { tinhCam: tcm, taiChinh: tc, congDanh: cd, giaDao: gd };
}

/* ---------------- Luận hợp đôi ---------------- */
function capDoiLuan_(A, B, inA, inB) {
  var tA = cdGoi_(inA.name, 'Người 1'), tB = cdGoi_(inB.name, 'Người 2');
  if (tA === tB) { tA = String(inA.name || 'Người 1').trim(); tB = String(inB.name || 'Người 2').trim(); if (tA === tB) { tA += ' (1)'; tB += ' (2)'; } }
  var P = { tuoi: cdTuoi_(A, B, tA, tB), battu: cdBatTu_(A, B, tA, tB), tuvi: cdTuVi_(A, B, tA, tB), chiemTinh: cdChiemTinh_(A, B, tA, tB), thanSo: cdThanSo_(A, B, tA, tB), hd: cdHD_(A, B, tA, tB) };
  var tong = 0; Object.keys(CD_TRONG_SO).forEach(function (k) { tong += P[k].diem * CD_TRONG_SO[k]; });
  tong = cdKep_(tong);
  var namCuoi = +inA.namCuoi || +inB.namCuoi || 0;
  (inA.events || []).forEach(function (e) { if (e && e.loai === 'ketHon' && +e.nam && !namCuoi) namCuoi = +e.nam; });
  var dsCon = cdChuanCon_(inA.con, A.tuvi.info.viewYear);
  var td = cdThoiDiem_(A, B, tA, tB, namCuoi, dsCon), con = cdConCai_(A, B, tA, tB, P.battu, dsCon, td), lv = cdLinhVuc_(A, B, tA, tB, P);
  var hoa = [], va = [];
  ['battu', 'tuvi', 'tuoi', 'chiemTinh', 'hd', 'thanSo'].forEach(function (k) { hoa = hoa.concat(P[k].tot.slice(0, 3)); va = va.concat(P[k].xau.slice(0, 3)); });
  var yeu = Object.keys(CD_TRONG_SO).sort(function (x, y) { return P[x].diem - P[y].diem; }), loi = [];
  var LK = {
    tuoi: 'Tuổi chưa thật hợp: khi cưới hỏi, xem kỹ ngày giờ; trong nhà dùng màu, hướng hợp dụng thần của cả hai để hóa giải.',
    battu: 'Ngũ hành chưa bổ trợ nhiều: mỗi người giữ một "góc riêng" hợp hành của mình (màu sắc, sở thích), tránh ép nhau sống giống mình.',
    tuvi: 'Cung Phu Thê còn điểm yếu: đặt quy ước chung về tiền bạc, gia đình hai bên ngay từ đầu; kiên nhẫn qua giai đoạn đầu.',
    chiemTinh: 'Góc chiếu căng giữa hai lá số: học cách nói "anh/em cần…" thay cho trách móc; hẹn giờ nói chuyện khi cả hai bình tĩnh.',
    thanSo: 'Cách nhìn đời khác nhau: dành thời gian hiểu "ngôn ngữ" của nhau – người lý trí cần lý lẽ, người cảm xúc cần sự vỗ về.',
    hd: 'Năng lượng dễ "lấn" nhau ở vài chủ đề: phân chia việc theo thế mạnh, tôn trọng cách ra quyết định riêng của mỗi người.'
  };
  yeu.slice(0, 2).forEach(function (k) { if (P[k].diem < 6.5) loi.push(LK[k]); });
  if (td.ketHon && td.ketHon.top.length) {
    var dep = td.ketHon.top.slice().sort(function (x, y) { return y.pct - x.pct; })[0];
    loi.push('Năm cưới đẹp nhất theo hai lá số: ' + dep.nam + ' (' + dep.canChi + ', ' + dep.pct + '%)' + (dep.canhBao.length ? ' – lưu ý: ' + dep.canhBao.join('; ') + '.' : '.'));
  }
  if (con && con.goiYTop.length) { var gy = con.goiYTop.slice().sort(function (x, y) { return y.tong - x.tong; })[0]; loi.push('Năm sinh ' + (dsCon.length ? 'thêm con' : 'con') + ' đẹp nhất (hợp tuổi bố mẹ + lá số cùng báo): ' + gy.nam + ' ' + gy.canChi + ' (hợp tuổi ' + gy.hopTuoi + '/10, xác suất ' + gy.pct + '%).'); }
  loi.push('Kết quả là xu hướng tham khảo từ lá số – sự thấu hiểu, tôn trọng và vun đắp mỗi ngày mới quyết định hạnh phúc.');
  var tt = function (r, i) {
    var I = r.tuvi.info, s = r.tuvi.info.solar, inp = i ? inB : inA;
    return { ten: String(inp.name || (i ? 'Người 2' : 'Người 1')), goi: i ? tB : tA, gioiTinh: I.male ? 'Nam' : 'Nữ', ngay: s.day + '/' + s.month + '/' + s.year + ' ' + (inp.hour || 0) + ':' + ('0' + (inp.minute || 0)).slice(-2),
      tuoi: CAN[I.yCan] + ' ' + CHI[I.yChi], menh: I.banMenh.ten, cungPhi: pnCungPhi_(I.lunar.year, I.male), nhatChu: r.battu.nhatChu, duongDoi: r.moRong.thanSo.duongDoi,
      hd: r.moRong.hd.loaiTen, sun: cdViTri_(r).sun.cungTen };
  };
  var tieuChi = Object.keys(CD_TRONG_SO).map(function (k) { var p = P[k]; return { k: k, ten: p.ten, he: p.he, diem: p.diem, trongSo: Math.round(CD_TRONG_SO[k] * 100), chiTiet: p.chiTiet }; });
  return {
    ten: [tA, tB], thongTin: [tt(A, 0), tt(B, 1)], tong: tong, pct: Math.round(tong * 10), xep: pnXepLoai_(tong), tieuChi: tieuChi,
    linhVuc: lv, thoiDiem: td, conCai: con, hoaHop: hoa.slice(0, 8), vaCham: va.slice(0, 7), loiKhuyen: loi,
    coSo: ['Điểm tổng (thang 10) = trung bình có trọng số 6 tiêu chí: ' + tieuChi.map(function (t) { return t.ten + ' ' + t.trongSo + '%'; }).join(', ') + '. % hợp = điểm × 10.',
      'Tuổi: 5 tiêu chí xem tuổi truyền thống (nạp âm, thiên can, địa chi, cung phi Bát trạch, thiên mệnh), chấm hai chiều. Bát Tự hợp hôn: nhật can, nhật chi (cung phu thê), dụng thần trao đổi, nguyệt trụ, thế thân vượng – nhược. Tử Vi: cung Mệnh hai người, sao Mệnh người này trong Phu Thê người kia, chất lượng cung Phu Thê.',
      'Chiêm tinh so sánh (synastry): 15 cặp hành tinh chủ chốt, góc trùng tụ/lục hợp/tam hợp/vuông/đối với sai số cho phép, góc càng sát càng mạnh. Thần số: nhóm số chủ đạo và số linh hồn. Human Design: kênh điện từ, đồng hành, áp đảo, thỏa hiệp và cặp Loại.',
      'Năm cưới: tích xác suất theo năm của hai lá số (năm cả hai cùng báo mới nổi bật), giảm 40% năm cô dâu phạm Kim Lâu (tuổi mụ chia 9 dư 1, 3, 6, 8) và 20% năm xung tuổi. Năm sinh con: tích xác suất của hai lá số × khả năng đã cưới trước năm đó; đã có con thì các năm sát con trước bị giảm (khoảng cách ~2 năm).',
      'Tuổi con với cha mẹ: mệnh nạp âm (con sinh cha mẹ = mang phúc; cha mẹ sinh con = nâng đỡ; khắc = dễ trái ý), thiên can, địa chi, can năm và ngũ hành mạnh của con so với hỷ/kỵ thần Bát Tự của cha mẹ. Gợi ý năm sinh con = 65% điểm hợp tuổi (có xét xung – hợp với anh chị) + 35% xác suất theo hai lá số. Năm chung thuận/khó lấy từ Biến cố hội tụ (≥3 hệ) của từng người.']
  };
}

/** Bản xem thử (chưa mở khóa): điểm tổng, 2 tiêu chí đầu, năm cưới bị che */
function cdRutGon_(cd) {
  var dep = cd.thoiDiem.ketHon && cd.thoiDiem.ketHon.top.slice().sort(function (x, y) { return y.pct - x.pct; })[0];
  return { biKhoa: true, ten: cd.ten, thongTin: cd.thongTin, tong: cd.tong, pct: cd.pct, xep: cd.xep,
    tieuChi: cd.tieuChi.map(function (t, i) { return { k: t.k, ten: t.ten, he: t.he, trongSo: t.trongSo, diem: i < 2 ? t.diem : null, chiTiet: i < 2 ? t.chiTiet.slice(0, 2) : [] }; }),
    hoaHop: cd.hoaHop.slice(0, 2), soVaCham: cd.vaCham.length,
    heLo: [dep ? 'Năm cưới đẹp nhất: ' + String(dep.nam).slice(0, 2) + '██ (' + dep.pct + '%)' : '', cd.conCai ? 'Số con dự kiến: ██ · con đầu trai ' + cd.conCai.pTrai + '%' : '',
      cd.conCai && cd.conCai.goiYTop.length ? 'Năm sinh con hợp tuổi bố mẹ nhất: ' + String(cd.conCai.goiYTop[0].nam).slice(0, 2) + '██' : '',
      cd.conCai && cd.conCai.daCo.length ? 'Đối chiếu ' + cd.conCai.daCo.length + ' con đã có: tuổi con hợp bố hay mẹ hơn ███' : '',
      'Người nên giữ quỹ chung: ███', cd.vaCham.length + ' điểm va chạm cần lưu ý và cách hóa giải'].filter(Boolean) };
}

/** Khóa mở cặp đôi – không phụ thuộc thứ tự nhập */
function ttKhoaCapDoi_(a, b) { return 'CD' + tkSha_([ttKhoaLaSo_(a), ttKhoaLaSo_(b)].sort().join('|')).slice(0, 24); }

/**
 * API: xem hợp đôi. inputA = lá số đang xem (form chính), inputB = người thứ hai.
 * Chưa đăng nhập / chưa mở "Xem cặp đôi" → trả bản xem thử.
 */
function lapCapDoi(inputA, inputB, token) {
  var u = tkPhien_(token);
  inputA = JSON.parse(JSON.stringify(inputA || {})); inputB = JSON.parse(JSON.stringify(inputB || {}));
  if (!inputA.day || !inputA.month || !inputA.year) throw new Error('Hãy nhập ngày sinh của người thứ nhất ở khung "Nhập thông tin".');
  if (!inputB.day || !inputB.month || !inputB.year) throw new Error('Hãy nhập đủ ngày sinh của người thứ hai.');
  ['viewYear', 'viewDate', 'lateRat', 'leapMode', 'tuHoaCanh', 'hoangDao', 'trueSolar'].forEach(function (k) { if (inputB[k] == null) inputB[k] = inputA[k]; });
  inputA.save = false; inputB.save = false; inputB.events = [];
  var A = lapLaSoDayDu_(inputA), B = lapLaSoDayDu_(inputB);
  if (A.moRongLoi || B.moRongLoi) throw new Error('Chưa lập được lá số mở rộng: ' + (A.moRongLoi || B.moRongLoi));
  var cd = capDoiLuan_(A, B, inputA, inputB), khoa = ttKhoaCapDoi_(inputA, inputB), full = false, soDu = null;
  if (u) { var q = ttQuyen_(u, khoa); full = !!(q.toanQuyen || q.cap_doi); soDu = q.toanQuyen ? null : ttSoDu_(u.ten); }
  var out = full ? cd : cdRutGon_(cd);
  out.khoa = khoa; out.bangGia = ttBangGia_(); out.soDu = soDu; out.dangNhap = !!u; out.moKhoa = full;
  return out;
}
