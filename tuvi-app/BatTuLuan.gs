/**
 * ============================================================
 *  BatTuLuan.gs — LUẬN TỨ TRỤ THEO 12 LĨNH VỰC & LƯU NIÊN TỪNG NĂM
 *
 *  Nguyên tắc "cung vị vi thể, thập thần vi dụng" (宫位为体、十神为用):
 *   - Thập thần (sao đại diện lục thân / sự việc): cha = Thiên Tài, mẹ = Chính Ấn,
 *     anh em = Tỷ Kiếp, vợ = Chính Tài (nam), chồng = Chính Quan (nữ),
 *     con = Quan Sát (nam) / Thực Thương (nữ), tiền = Tài, công danh = Quan Sát,
 *     học vấn – nhà cửa = Ấn, tài năng = Thực Thương.
 *   - Cung vị: Niên trụ = tổ nghiệp; Nguyệt trụ = cha mẹ, anh em, môn hộ sự nghiệp;
 *     Nhật chi = cung phu thê; Thời trụ = con cái, hậu vận.
 *   - Hỷ/Kỵ theo dụng thần; hợp – xung – hình – hại – phá; Không Vong; thần sát.
 *  Lưu niên: thập thần của can chi năm, hỷ/kỵ, "dẫn động" tứ trụ (xung, hợp, hình,
 *  phục ngâm, phản ngâm / thiên khắc địa xung), tuế vận tịnh lâm, thần sát năm.
 *  Tham khảo: Tử Bình Chân Thuyên, Tích Thiên Tủy, Tam Mệnh Thông Hội;
 *  các dự án mở china-testing/bazi, ruanxiaoer888/bazi-engine, qianye-wuyu/yueyuan-bazi.
 * ============================================================
 */

var BTL_TR = ['Niên trụ', 'Nguyệt trụ', 'Nhật trụ', 'Thời trụ'];
var BTL_G = { TK: ['Tỷ Kiên', 'Kiếp Tài'], TT: ['Thực Thần', 'Thương Quan'], Tai: ['Chính Tài', 'Thiên Tài'], QS: ['Chính Quan', 'Thất Sát'], An: ['Chính Ấn', 'Thiên Ấn'] };
var BTL_PHA = ['0-9', '3-6', '1-4', '7-10', '2-11', '5-8'];
var BTL_KHO = { 'Thủy': 4, 'Thổ': 4, 'Hỏa': 10, 'Kim': 1, 'Mộc': 7 };           // mộ khố: Thìn, Tuất, Sửu, Mùi
var BTL_HONG_DIEM = [6, 8, 2, 7, 4, 4, 10, 9, 0, 8];                           // Hồng Diễm theo can ngày
var BTL_NHAT_DUC = ['Giáp Dần', 'Bính Thìn', 'Mậu Thìn', 'Canh Thìn', 'Nhâm Tuất'];
var BTL_TS_Y = {
  'Trường Sinh': 'được nuôi dưỡng, lạc quan, dễ được giúp đỡ; mặt trái là dễ ỷ lại, ngây thơ trước người xấu',
  'Mộc Dục': 'đa cảm, thích cái mới, duyên dáng; mặt trái là dễ dao động tình cảm, thiếu kiên định',
  'Quan Đới': 'cầu tiến, thích được công nhận; mặt trái là sĩ diện, nóng vội muốn thành',
  'Lâm Quan': 'tự lập, có năng lực thực thi, sớm đứng trên đôi chân mình; mặt trái là tự phụ, ít chịu nhờ ai',
  'Đế Vượng': 'mạnh mẽ, tự tin; mặt trái là cố chấp, khó nghe người khác',
  'Suy': 'ôn hòa, chín chắn; mặt trái là bảo thủ, thiếu sức bật',
  'Bệnh': 'nhạy cảm, giàu lòng trắc ẩn; mặt trái là hay lo, tinh thần và sức khỏe dễ yếu',
  'Tử': 'trầm tĩnh, sâu sắc; mặt trái là ít bộc lộ, thiếu sinh khí, dễ bế tắc',
  'Mộ': 'kín đáo, giỏi tích lũy, giữ của; mặt trái là khép kín, chặt chẽ quá mức, ôm chuyện trong lòng',
  'Tuyệt': 'linh hoạt, tự thân vận động; mặt trái là dễ thay đổi, thiếu gốc tựa, thất thường',
  'Thai': 'ấp ủ nhiều ý tưởng, hồn nhiên; mặt trái là non nớt, ý tưởng khó thành hình',
  'Dưỡng': 'được che chở, sống tình cảm, hưởng phúc gia đình; mặt trái là dựa dẫm, kém tự lập'
};
var BTL_PHOI = {                                                                  // tính chất phối ngẫu theo thập thần chính khí nhật chi
  'Chính Tài': 'thực tế, chu đáo, biết vun vén nhưng dễ tính toán, khô khan', 'Thiên Tài': 'hào phóng, năng động, giỏi giao tiếp nhưng tiêu xài mạnh, dễ đa tình',
  'Chính Quan': 'đứng đắn, có trách nhiệm, trọng danh dự nhưng nghiêm khắc, cứng nhắc', 'Thất Sát': 'quyết đoán, bản lĩnh nhưng nóng tính, dễ áp đặt',
  'Chính Ấn': 'nhân hậu, biết chăm sóc, trọng học vấn nhưng hay bao bọc, chậm thực tế', 'Thiên Ấn': 'sâu sắc, độc lập nhưng khó đoán, lạnh lùng',
  'Thực Thần': 'hiền hòa, biết hưởng thụ, dễ chịu nhưng thiếu chí tiến thủ', 'Thương Quan': 'thông minh, sắc sảo nhưng thích tranh luận, lời nói dễ làm tổn thương',
  'Tỷ Kiên': 'ngang hàng, độc lập, giống tính bạn nên dễ giành phần hơn', 'Kiếp Tài': 'mạnh mẽ, thích cạnh tranh nhưng tiêu xài thoáng, dễ hao tiền chung'
};

/* ---------------- Nền dữ liệu dùng chung ---------------- */
function btlNen_(bt, male, ts) {
  var P = bt.pillars, dCan = bt.nhatChuCan, i0 = HANH_SINH.indexOf(bt.nhatChuHanh);
  var H = { TK: HANH_SINH[i0], TT: HANH_SINH[(i0 + 1) % 5], Tai: HANH_SINH[(i0 + 2) % 5], QS: HANH_SINH[(i0 + 3) % 5], An: HANH_SINH[(i0 + 4) % 5] };
  var dem = {}, can = {}, tru = {};
  P.forEach(function (p, i) {
    if (i !== 2) { dem[p.thapThan] = (dem[p.thapThan] || 0) + 1; (can[p.thapThan] = can[p.thapThan] || []).push(i); (tru[p.thapThan] = tru[p.thapThan] || []).push(i); }
    p.tangCan.forEach(function (t, j) { dem[t.thapThan] = (dem[t.thapThan] || 0) + (j ? 0.3 : 0.6); (tru[t.thapThan] = tru[t.thapThan] || []).push(i); });
  });
  function S(list) {
    var d = 0, c = [], t = [];
    list.forEach(function (n) { d += dem[n] || 0; c = c.concat(can[n] || []); t = t.concat(tru[n] || []); });
    return { dem: Math.round(d * 10) / 10, thau: c.filter(function (x, k) { return c.indexOf(x) === k; }), tru: t.filter(function (x, k) { return t.indexOf(x) === k; }) };
  }
  function qh(a, b) {
    var r = lgQuanHeChi_(a, b).map(function (x) { return x === 'tam hợp' ? 'bán tam hợp' : x; });
    if (BTL_PHA.indexOf(Math.min(a, b) + '-' + Math.max(a, b)) >= 0) r.push('tương phá');
    return r.filter(function (x) { return x !== 'trùng (đồng chi)'; });
  }
  var xs = mod12(P[2].chi - P[2].can);
  // bổ sung Đào Hoa, Dịch Mã, Hoa Cái (theo chi năm & chi ngày) vào danh sách thần sát
  ts = ts.slice();
  [['Đào Hoa', [9, 6, 3, 0], 'duyên dáng, được yêu mến; mặt trái là dễ đa tình, vướng chuyện tình cảm rắc rối.', true], ['Dịch Mã', [2, 11, 8, 5], 'hay di chuyển, đi xa, thay đổi môi trường; mặt trái là bôn ba, khó yên một chỗ.', true],
    ['Hoa Cái', [4, 1, 10, 7], 'thiên hướng nghệ thuật, tôn giáo, triết học; mặt trái là cô độc, khó hòa đồng.', true]].forEach(function (x) {
    var tr = []; [P[0].chi, P[2].chi].forEach(function (b) { P.forEach(function (p, i) { if (p.chi === x[1][b % 4] && tr.indexOf(i) < 0) tr.push(i); }); });
    if (tr.length) ts.push({ ten: x[0], tru: tr, moTa: x[2].charAt(0).toUpperCase() + x[2].slice(1), tot: x[3] });
  });
  return {
    P: P, bt: bt, dCan: dCan, male: male, H: H, dem: dem, S: S, qh: qh, ts: ts,
    g: function (k) { return S(BTL_G[k]).dem; },
    hk: function (h) { return btctHyKy_(bt, h); },
    kv: [mod12(xs - 2), mod12(xs - 1)],
    chiQH: function (i) {
      var out = [];
      P.forEach(function (p, j) { if (j !== i) qh(P[i].chi, p.chi).forEach(function (x) { out.push({ j: j, loai: x }); }); });
      return out;
    },
    tsTai: function (i) { return ts.filter(function (t) { return t.tru.indexOf(i) >= 0; }); },
    coTS: function (ten) { return ts.filter(function (t) { return t.ten.indexOf(ten) === 0; }); },
    goc: function (hanh) { var r = []; P.forEach(function (p, i) { if (p.tangCan.some(function (t) { return CAN_HANH[t.can] === hanh; })) r.push(i); }); return r; }
  };
}
function btlKhoi_(key, ten, han, y) {
  var o = { key: key, ten: ten, han: han, yNghia: y, d: 0, coSo: [], sao: [], cung: [], ts: [], ket: [] };
  o.add = function (sec, w, txt) { o.d += w; o[sec].push((w > 0.05 ? '✓ ' : w < -0.05 ? '✗ ' : '◇ ') + txt); };
  return o;
}
function btlXong_(o) {
  var d = Math.round(Math.max(-7, Math.min(9, o.d)) * 10) / 10, secs = [];
  if (o.coSo.length) secs.push({ tieuDe: 'Căn cứ', items: o.coSo });
  if (o.sao.length) secs.push({ tieuDe: 'Thập thần – sao đại diện', items: o.sao });
  if (o.cung.length) secs.push({ tieuDe: 'Cung vị & hợp – xung – hình', items: o.cung });
  if (o.ts.length) secs.push({ tieuDe: 'Thần sát liên quan', items: o.ts });
  o.ket.unshift('Đánh giá theo Tứ Trụ: ' + lgXepHang_(d) + ' (' + diem10_(d) + '/10).');
  secs.push({ tieuDe: 'Kết luận', items: o.ket });
  return { key: o.key, ten: o.ten, han: o.han, yNghia: o.yNghia, diem: d, danhGia: lgXepHang_(d), secs: secs };
}
function btlTruTen_(ds) { return ds.map(function (i) { return BTL_TR[i]; }).join(', '); }

/** Phân tích một "sao lục thân" */
function btlSao_(N, o, ten, list, hanh, cungTru) {
  var s = N.S(list), k = N.hk(hanh);
  o.coSo.push(ten + ': ' + list.join('/') + ' (hành ' + hanh + ', là ' + k + ' thần)' +
    (s.dem ? ' – lực ' + s.dem + ' tại ' + btlTruTen_(s.tru) + (s.thau.length ? ', có thấu can' : ', chỉ tàng trong chi') : ' – không có trong tứ trụ') + '.');
  if (!s.dem) o.add('sao', -0.6, ten + ' ẩn – duyên mờ nhạt hoặc đến muộn; sẽ "hiện" vào đại vận/lưu niên mang sao này.');
  else if (s.dem >= 2.5) o.add('sao', -0.4, ten + ' quá nhiều (' + s.dem + ') – "đa mà loạn": quan hệ phức tạp, dễ phân tán.');
  else o.add('sao', 0.6, ten + ' hiện rõ (' + s.dem + ') – quan hệ minh bạch, dễ nhận biết.');
  if (s.thau.length) o.add('sao', 0.3, 'Thấu can tại ' + btlTruTen_(s.thau) + ' – lộ ra ngoài, vai trò rõ ràng.');
  if (k === 'Dụng' || k === 'Hỷ') o.add('sao', 1.2, ten + ' mang hành ' + k + ' thần – là nguồn trợ lực.');
  else if (k === 'Kỵ') o.add('sao', -1.1, ten + ' mang hành Kỵ thần – dễ thành áp lực, hao tổn.');
  if (cungTru != null && s.tru.indexOf(cungTru) >= 0) o.add('sao', 0.5, 'Nằm đúng cung vị (' + BTL_TR[cungTru] + ') – gắn bó, ứng nghiệm rõ.');
  return s;
}
/** Phân tích một cung vị (trụ) */
function btlCung_(N, o, i, nhan) {
  var p = N.P[i], kc = i === 2 ? null : N.hk(p.canHanh), kz = N.hk(CAN_HANH[p.tangCan[0].can]);
  o.coSo.push(nhan + ': ' + BTL_TR[i] + ' ' + p.canTen + ' ' + p.chiTen + ' – ' + (kc ? 'can ' + p.canHanh + ' (' + kc + '), ' : '') +
    'chi chính khí ' + p.tangCan[0].ten + ' ' + p.tangCan[0].thapThan + ' (' + kz + '); Nhật chủ tại đây ở thế "' + p.truongSinh + '".');
  var w = 0;
  [kc, kz].forEach(function (k) { if (k === 'Dụng') w += 0.9; else if (k === 'Hỷ') w += 0.6; else if (k === 'Kỵ') w -= 0.7; });
  if (w > 0.3) o.add('cung', w, nhan + ' mang hỷ khí – môi trường của lĩnh vực này nâng đỡ bạn.');
  else if (w < -0.3) o.add('cung', w, nhan + ' mang kỵ khí – lĩnh vực này dễ mang lại áp lực, hao tổn và thất vọng.');
  N.chiQH(i).forEach(function (r) {
    var xau = /xung|hình|hại|phá/.test(r.loai);
    o.add('cung', xau ? (r.loai === 'lục xung' ? -0.9 : -0.45) : 0.35, BTL_TR[i] + ' ' + r.loai + ' ' + BTL_TR[r.j] + ' (' + p.chiTen + ' – ' + N.P[r.j].chiTen + ')' +
      (xau ? ' – biến động, va chạm.' : ' – gắn kết, hòa hợp.'));
  });
  if (i !== 2 && N.kv.indexOf(p.chi) >= 0) o.add('cung', -0.6, BTL_TR[i] + ' rơi vào Không Vong – việc/lục thân thuộc cung này dễ hụt hẫng, có mà như không, duyên mỏng.');
  N.tsTai(i).forEach(function (t) { o.add('ts', t.tot ? 0.4 : -0.4, t.ten + ' tại ' + BTL_TR[i] + ': ' + t.moTa); });
}

/* ================= 12 LĨNH VỰC ================= */
function btlLinhVuc_(bt, input, ts, cc) {
  var male = input.gender !== 'nu', N = btlNen_(bt, male, ts), P = N.P, H = N.H, out = [];
  var dm = bt.nhatChuHanh, ty = bt.tyLeTro / 100;
  var dp = P[2].canTen + ' ' + P[2].chiTen;

  /* 1. MỆNH – bản thân & tính cách */
  var o = btlKhoi_('Mệnh', 'Bản mệnh & tính cách', '命', 'Nhật chủ, vượng suy, cách cục, khí chất');
  o.coSo.push('Nhật chủ ' + bt.nhatChu + ' sinh tháng ' + P[1].chiTen + ' – trạng thái ' + bt.trangThai + ', lực trợ thân ' + bt.tyLeTro + '% → ' + bt.cuong + '.');
  o.coSo.push('Dụng thần ' + bt.goiY.dung + '; hỷ thần ' + bt.goiY.hy.join(', ') + '; kỵ thần ' + bt.goiY.ky.join(', ') + '. Cách cục: ' + cc.ten + ' (' + cc.loai + ').');
  if (ty >= 0.4 && ty <= 0.62) o.add('sao', 1, 'Thân gần trung hòa – "trung hòa vi quý": gánh được tài quan, ít cực đoan; mặt trái là ít nét nổi trội, khó bứt phá.');
  else if ((ty < 0.25 || ty > 0.78) && cc.loai !== 'Ngoại cách') o.add('sao', -0.6, 'Nhật chủ ' + (ty < 0.25 ? 'quá nhược' : 'quá vượng') + ' – dễ cực đoan, đời lên xuống mạnh; vận không đúng dụng thần thì vất vả kéo dài.');
  if (cc.thanh === true) o.add('sao', 1.2, 'Cách cục thành – đời có "khung xương" rõ, phát triển thuận theo hướng của cách; mặt trái là đi lệch hướng ấy thì khó thành.');
  else if (cc.thanh === false) o.add('sao', -0.8, 'Cách cục bị phá/chưa đủ điều kiện – thành công đến chậm, dễ làm nhiều mà không thành hình; phải chờ vận tốt mới khá.');
  var tuToa = P[2].tuTruongSinh;
  o.add('cung', ['Trường Sinh', 'Lâm Quan', 'Đế Vượng', 'Quan Đới'].indexOf(tuToa) >= 0 ? 0.5 : ['Tuyệt', 'Tử', 'Bệnh'].indexOf(tuToa) >= 0 ? -0.3 : 0,
    'Nhật chủ tự tọa "' + tuToa + '" – ' + (BTL_TS_Y[tuToa] || '') + '.');
  var goc = N.goc(dm);
  if (!goc.length) o.add('cung', -0.8, 'Nhật chủ không thông căn (không có gốc cùng hành ở địa chi) – dễ bị hoàn cảnh cuốn theo, thiếu chỗ dựa, sức chịu áp lực yếu.');
  else o.add('cung', goc.indexOf(1) >= 0 ? 0.7 : 0.4, 'Nhật chủ có gốc tại ' + btlTruTen_(goc) + (goc.indexOf(1) >= 0 ? ' (gốc ở nguyệt lệnh – vững nhất)' : '') + '.');
  var g5 = ['TK', 'TT', 'Tai', 'QS', 'An'].map(function (k) { return { k: k, v: N.g(k) }; }).sort(function (a, b) { return b.v - a.v; });
  var TEN5 = { TK: 'Tỷ Kiếp', TT: 'Thực Thương', Tai: 'Tài', QS: 'Quan Sát', An: 'Ấn' };
  o.add('sao', 0, 'Thập thần mạnh nhất: ' + TEN5[g5[0].k] + ' (' + g5[0].v + ') – ' + BTCT_NHOM_Y[TEN5[g5[0].k]].tc + '; kế đến ' + TEN5[g5[1].k] + ' – ' + BTCT_NHOM_Y[TEN5[g5[1].k]].tc + '.');
  var ptMax = HANH_SINH.slice().sort(function (a, b) { return bt.phanTram[b] - bt.phanTram[a]; });
  if (bt.phanTram[ptMax[0]] >= 40) o.add('sao', -0.5, 'Ngũ hành lệch về ' + ptMax[0] + ' (' + bt.phanTram[ptMax[0]] + '%) – tính cách thiên một cực, dễ cực đoan và lệch về sức khỏe; hành ' + bt.goiY.dung + ' là hành cân bằng.');
  if ([11, 0, 1].indexOf(P[1].chi) >= 0 && bt.phanTram['Hỏa'] < 10) o.add('sao', -0.5, 'Sinh mùa đông mà thiếu Hỏa (điều hầu) – dễ trầm tư, bi quan, thiếu động lực; hợp môi trường ấm áp, năng động.');
  if ([5, 6, 7].indexOf(P[1].chi) >= 0 && bt.phanTram['Thủy'] < 10) o.add('sao', -0.5, 'Sinh mùa hạ mà thiếu Thủy (điều hầu) – dễ nóng vội, bốc đồng, quyết sai lúc nóng; hợp nhịp sống tĩnh.');
  if (BTL_NHAT_DUC.indexOf(dp) >= 0) o.add('ts', 0.6, 'Nhật Đức (' + dp + ') – nhân hậu, phúc dày, gặp dữ hóa lành; mặt trái là hiền quá dễ chịu thiệt.');
  N.tsTai(2).filter(function (t) { return /Khôi Cương|Kim Thần/.test(t.ten); }).forEach(function (t) { o.add('ts', 0.3, t.ten + ': ' + t.moTa); });
  o.ket.push('Khí chất: ' + BTCT_NHOM_Y[TEN5[g5[0].k]].tc + '. Muốn "thuận mệnh" hãy sống gần hành ' + bt.goiY.dung + ' (' + HANH_INFO[bt.goiY.dung].mau + ', hướng ' + HANH_INFO[bt.goiY.dung].huong + ').');
  out.push(btlXong_(o));

  /* 2. PHỤ MẪU */
  o = btlKhoi_('Phụ Mẫu', 'Cha mẹ – tổ nghiệp', '父母', 'Cha (Thiên Tài), mẹ (Chính Ấn), Niên & Nguyệt trụ');
  btlSao_(N, o, 'Cha – Thiên Tài', ['Thiên Tài'], H.Tai, 0);
  btlSao_(N, o, 'Mẹ – Chính Ấn', ['Chính Ấn'], H.An, 1);
  if (N.g('TK') >= 2.5 && N.g('Tai') < 1.2) o.add('sao', -0.8, 'Tỷ Kiếp vượng khắc Tài – theo cổ học, cha dễ vất vả, công việc hoặc sức khỏe của cha nhiều trắc trở, cha con ít gần gũi; bạn hãy đối chiếu với trải nghiệm thật.');
  if (N.g('Tai') >= 2.5 && N.g('An') < 1.2) o.add('sao', -0.8, 'Tài tinh vượng phá Ấn – theo cổ học, mẹ dễ vất vả, nhiều lo toan, sức khỏe mẹ là điểm yếu, mẹ con dễ bất đồng; bạn hãy tự đối chiếu.');
  if (N.S(['Chính Ấn']).thau.length && N.hk(H.An) !== 'Kỵ') o.add('sao', 0.5, 'Chính Ấn thấu can – được mẹ và bề trên che chở rõ rệt; mặt trái là dễ dựa dẫm, chậm tự lập.');
  btlCung_(N, o, 0, 'Cung tổ nghiệp');
  btlCung_(N, o, 1, 'Cung cha mẹ');
  if (N.qh(P[1].chi, P[2].chi).indexOf('lục xung') >= 0) o.add('cung', -0.6, 'Nguyệt chi xung Nhật chi – dễ bất đồng với cha mẹ, va chạm khi sống chung, lập gia đình thường phải ra ở riêng.');
  if (N.qh(P[0].chi, P[2].chi).indexOf('lục xung') >= 0) o.add('cung', -0.4, 'Niên chi xung Nhật chi – ít được tổ nghiệp đỡ, quan hệ với họ hàng dễ lỏng; rời quê lập nghiệp thường thuận hơn.');
  o.ket.push(o.d >= 1.5 ? 'Lá số gợi ý được cha mẹ nâng đỡ, gia đình là bệ phóng; mặt trái là dễ dựa dẫm và chịu kỳ vọng nặng từ gia đình – bạn hãy đối chiếu với trải nghiệm thật của mình.' : o.d >= -0.5 ? 'Lá số gợi ý quan hệ với cha mẹ bình thường, trưởng thành bằng tự lực là chính; được đỡ ít nên những bước đầu vất vả hơn người – bạn hãy tự đối chiếu.' : 'Lá số gợi ý duyên với cha mẹ/tổ nghiệp mỏng: ít được đỡ đần, dễ xa cách hoặc bất đồng, phải tự lập sớm – bạn hãy tự đối chiếu.');
  out.push(btlXong_(o));

  /* 3. HUYNH ĐỆ */
  o = btlKhoi_('Huynh Đệ', 'Anh chị em – bạn đồng lứa', '兄弟', 'Tỷ Kiên, Kiếp Tài, Nguyệt trụ');
  var sTK = btlSao_(N, o, 'Anh em – Tỷ Kiếp', BTL_G.TK, H.TK, 1);
  if (N.g('QS') >= N.g('TK') + 1.5) o.add('sao', -0.6, 'Quan Sát khắc Tỷ Kiếp – anh em mỗi người một hướng, ít nương tựa được nhau, có lúc xa cách hẳn.');
  if (N.S(['Kiếp Tài']).thau.length) o.add('sao', -0.4, 'Kiếp Tài thấu can – dễ bị anh em/bạn chiếm lợi, mất tiền vì hùn hạp; giấy tờ cần rạch ròi.');
  if (sTK.dem >= 1 && N.hk(H.TK) !== 'Kỵ') o.add('sao', 0.3, 'Anh em/bạn bè là chỗ dựa khi cần; mặt trái là dễ nể nang, vướng tiền bạc chung.');
  btlCung_(N, o, 1, 'Cung huynh đệ (nguyệt chi)');
  o.ket.push(o.d >= 1 ? 'Lá số gợi ý anh em hòa thuận, hỗ trợ nhau; mặt trái là dễ vướng tiền bạc chung, nể nang khó từ chối – bạn hãy đối chiếu với thực tế.' : o.d >= -0.5 ? 'Lá số gợi ý anh em có qua lại nhưng mỗi người tự lo, lúc khó ít trông cậy được – bạn hãy đối chiếu với thực tế.' : 'Lá số gợi ý anh em dễ cạnh tranh, va chạm tiền bạc hoặc xa cách – bạn hãy tự đối chiếu; tiền bạc với anh em nên rạch ròi.');
  out.push(btlXong_(o));

  /* 4. PHU THÊ */
  o = btlKhoi_('Phu Thê', 'Hôn nhân – người phối ngẫu', '夫妻', male ? 'Chính Tài (vợ), Nhật chi – cung phu thê' : 'Chính Quan (chồng), Nhật chi – cung phu thê');
  if (male) {
    btlSao_(N, o, 'Vợ – Chính Tài', ['Chính Tài'], H.Tai, 2);
    if (N.S(['Chính Tài']).thau.length && N.S(['Thiên Tài']).thau.length) o.add('sao', -0.6, 'Chính – Thiên Tài cùng thấu – có sức hút với nhiều người, dễ có người thứ ba chen vào hôn nhân.');
    if (N.g('TK') >= 2.2 && N.g('Tai') < 1.5) o.add('sao', -0.9, 'Tỷ Kiếp đoạt Tài – hôn nhân dễ bị người ngoài chen vào, vợ chồng bất hòa vì tiền bạc, bạn bè; nguy cơ rạn nứt cao hơn bình thường.');
  } else {
    btlSao_(N, o, 'Chồng – Chính Quan', ['Chính Quan'], H.QS, 2);
    if (N.S(['Chính Quan']).dem && N.S(['Thất Sát']).dem) o.add('sao', -0.7, 'Quan Sát hỗn tạp – tình cảm nhiều mối, dễ chọn nhầm người, có thể trải qua đổ vỡ trước khi ổn định.');
    if (N.S(['Thương Quan']).thau.length && N.S(['Chính Quan']).dem) o.add('sao', -1, 'Thương Quan kiến Quan – vợ chồng dễ cãi vã, lời nói làm tổn thương nhau, dễ coi nhẹ chồng; hôn nhân dễ rạn nứt.');
    if (N.g('TT') >= 2.5 && N.g('QS') < 1) o.add('sao', -0.7, 'Thực Thương vượng, Quan tinh yếu – kén chọn, kỳ vọng cao, dễ muộn chồng hoặc không hài lòng với chồng.');
  }
  btlCung_(N, o, 2, 'Cung phu thê');
  var ttNC = P[2].tangCan[0].thapThan;
  o.add('cung', 0, 'Nhật chi chính khí là ' + ttNC + ' – người phối ngẫu thường ' + (BTL_PHOI[ttNC] || '') + '.');
  if (BAZI_DUONG_NHAN[N.dCan] === P[2].chi) o.add('cung', -0.6, 'Nhật chi là Dương Nhận – hai vợ chồng đều cá tính mạnh, dễ cãi to và làm tổn thương nhau.');
  if (BTL_HONG_DIEM[N.dCan] === P[2].chi || BTL_HONG_DIEM[N.dCan] === P[3].chi) o.add('ts', 0.2, 'Hồng Diễm – duyên dáng, có sức hút; mặt trái là dễ vướng chuyện tình cảm ngoài luồng.');
  N.coTS('Đào Hoa').forEach(function (t) { o.add('ts', 0.2, 'Đào Hoa tại ' + btlTruTen_(t.tru) + ' – duyên tình cảm đến nhiều' + (t.tru.indexOf(2) >= 0 || t.tru.indexOf(3) >= 0 ? ', "đào hoa trong tường": dễ gặp người hợp ý qua các mối quan hệ gần, nhưng cũng dễ lẫn tình cảm với công việc.' : ', "đào hoa ngoài tường": dễ bị người ngoài hấp dẫn, có nguy cơ ngoại tình.')); });
  N.coTS('Cô Thần').concat(N.coTS('Quả Tú')).forEach(function (t) { o.add('ts', -0.3, t.ten + ' tại ' + btlTruTen_(t.tru) + ': ' + t.moTa); });
  o.ket.push(o.d >= 1.5 ? 'Hôn nhân thuận, người phối ngẫu là quý nhân; mặt trái là dễ dựa dẫm vào bạn đời.' : o.d >= -0.5 ? 'Hôn nhân ổn nhưng có va chạm, phải nhường nhịn nhiều; hợp kết hôn khi vận/năm có sao phối ngẫu.' : 'Hôn nhân nhiều trắc trở: dễ bất hòa, lạnh nhạt hoặc đổ vỡ, có thể cưới muộn. Gợi ý: không cưới vội.');
  out.push(btlXong_(o));

  /* 5. TỬ TỨC */
  o = btlKhoi_('Tử Tức', 'Con cái – hậu duệ', '子女', male ? 'Quan Sát (con), Thời trụ' : 'Thực Thương (con), Thời trụ');
  if (male) {
    btlSao_(N, o, 'Con – Quan Sát', BTL_G.QS, H.QS, 3);
    if (N.g('TT') >= 2.5 && N.g('QS') < 1) o.add('sao', -0.8, 'Thực Thương vượng khắc Quan Sát – theo cổ học, đường con cái muộn hoặc ít, cha con dễ bất đồng, con khó dạy.');
  } else {
    btlSao_(N, o, 'Con – Thực Thương', BTL_G.TT, H.TT, 3);
    if (N.S(['Thiên Ấn']).dem >= 1.3 && N.S(['Thực Thần']).dem) o.add('sao', -0.9, 'Kiêu thần đoạt Thực – theo cổ học, đường con cái khó: dễ muộn con, sinh nở vất vả; có dự định nên hỏi bác sĩ.');
  }
  btlCung_(N, o, 3, 'Cung tử tức');
  if (N.qh(P[3].chi, P[2].chi).indexOf('lục xung') >= 0) o.add('cung', -0.5, 'Thời chi xung Nhật chi – con cái có chí hướng riêng, dễ bất đồng với cha mẹ, lớn lên thường sống xa.');
  o.ket.push(o.d >= 1.5 ? 'Duyên con tốt, con cái là niềm tự hào và chỗ dựa hậu vận; mặt trái là dễ kỳ vọng và bao bọc con quá mức.' : o.d >= -0.5 ? 'Duyên con bình thường: con không quá vất vả nhưng cũng ít gánh đỡ được cha mẹ; đầu tư giáo dục thường được đáp đền.' : 'Duyên con mỏng: dễ muộn con, ít con hoặc con cái xa cách, khó gần; chuyện sinh nở nên hỏi bác sĩ sớm.');
  out.push(btlXong_(o));

  /* 6. TÀI BẠCH */
  o = btlKhoi_('Tài Bạch', 'Tiền bạc – tài lộc', '財帛', 'Chính Tài, Thiên Tài, Thực Thương sinh Tài, tài khố');
  var sTai = btlSao_(N, o, 'Tài tinh', BTL_G.Tai, H.Tai, null);
  if (bt.vuong && sTai.dem >= 1 && N.hk(H.Tai) !== 'Kỵ') o.add('sao', 1.4, 'Thân vượng gánh được Tài – "thân vượng tài vượng", có năng lực làm giàu; mặt trái là dễ tự tin quá mà liều.');
  if (!bt.vuong && sTai.dem >= 2) o.add('sao', -1, 'Tài đa thân nhược – thấy tiền mà khó giữ, dễ mất vì tham; hợp làm công hưởng lương hơn tự đầu tư.');
  if (N.g('TT') >= 0.9 && sTai.dem >= 0.9) o.add('sao', 0.8, 'Thực Thương sinh Tài – kiếm tiền bằng tài năng, sản phẩm, ý tưởng.');
  if (N.g('TK') >= 2 && sTai.dem && N.hk(H.TK) === 'Kỵ') o.add('sao', -0.9, 'Tỷ Kiếp đoạt Tài – dễ hao vì bạn bè, hùn hạp, cho vay không đòi được.');
  if (N.S(['Chính Tài']).dem > N.S(['Thiên Tài']).dem + 0.3) o.add('sao', 0, 'Chính Tài trội – nguồn thu ổn định từ lương, công việc đều đặn, hợp tích lũy dài hạn; mặt trái là khó giàu nhanh, ngại mạo hiểm.');
  else if (N.S(['Thiên Tài']).dem > N.S(['Chính Tài']).dem + 0.3) o.add('sao', 0, 'Thiên Tài trội – tiền đến từ kinh doanh, đầu tư, cơ hội bất ngờ; thu chi mạnh tay, có năm được lớn có năm mất lớn.');
  var kho = BTL_KHO[H.Tai], khoTru = P.map(function (p, i) { return p.chi === kho ? i : -1; }).filter(function (i) { return i >= 0; });
  if (khoTru.length) {
    var moKho = P.some(function (p) { return mod12(p.chi - kho) === 6; });
    o.add('cung', moKho ? 0.3 : 0.6, 'Có Tài khố (' + CHI[kho] + ') tại ' + btlTruTen_(khoTru) + ' – ' + (moKho ? 'khố bị xung mở: tiền lớn đến rồi đi, khó giữ lâu.' : 'biết tích lũy, của để dành; mặt trái là giữ chặt quá, ngại chi.'));
  }
  if (sTai.tru.length) o.add('cung', 0, 'Vị trí Tài tinh: ' + sTai.tru.map(function (i) { return ['Niên trụ – tiền từ gia đình/tổ nghiệp', 'Nguyệt trụ – tự kiếm tiền từ trẻ', 'Nhật trụ – tiền gắn với bạn đời/bản thân', 'Thời trụ – giàu về hậu vận'][i]; }).join('; ') + '.');
  N.coTS('Lộc Thần').concat(N.coTS('Kim Dư')).forEach(function (t) { o.add('ts', 0.4, t.ten + ' tại ' + btlTruTen_(t.tru) + ': ' + t.moTa); });
  o.ket.push(o.d >= 2 ? 'Tài vận tốt – có khả năng tích lũy tài sản đáng kể; mặt trái là dễ chủ quan, liều tay khi đang thuận.' : o.d >= 0 ? 'Tài vận khá – không giàu nhanh, phải có kỷ luật và nghề vững mới tích được.' : 'Tài vận yếu – tiền khó giữ, dễ hao vì đầu cơ, hùn hạp, cho vay; hợp thu nhập ổn định.');
  out.push(btlXong_(o));

  /* 7. TẬT ÁCH */
  o = btlKhoi_('Tật Ách', 'Sức khỏe – tật ách', '疾厄', 'Ngũ hành thái quá/bất cập, hình – xung, Dương Nhận, điều hầu');
  o.d = 1;
  o.coSo.push('Ngũ hành: ' + HANH_SINH.map(function (h) { return h + ' ' + bt.phanTram[h] + '%'; }).join(' · ') + '. Theo cổ học, Nhật chủ ' + dm + ' gắn với ' + BTCT_TANG_PHU[dm] + '.');
  HANH_SINH.forEach(function (h) {
    if (bt.phanTram[h] >= 35) o.add('sao', -0.7, h + ' thái quá (' + bt.phanTram[h] + '%) – ' + BTCT_TANG_PHU[h] + ' dễ là điểm yếu, nhất là khi làm quá sức; hành bị ' + h + ' khắc (' + HANH_SINH[(HANH_SINH.indexOf(h) + 2) % 5] + ') yếu theo.');
    else if (bt.phanTram[h] <= 6) o.add('sao', -0.6, h + ' bất cập (' + bt.phanTram[h] + '%) – ' + BTCT_TANG_PHU[h] + ' là điểm yếu bẩm sinh, dễ có vấn đề khi về già hoặc gặp vận xấu.');
  });
  bt.goiY.ky.slice(0, 1).forEach(function (h) { o.add('sao', 0, 'Kỵ thần ' + h + ' – khi vận/năm ' + h + ' vượng, ' + BTCT_TANG_PHU[h] + ' dễ yếu đi.'); });
  var chis = P.map(function (p) { return p.chi; });
  if ([2, 5, 8].filter(function (c) { return chis.indexOf(c) >= 0; }).length >= 2) o.add('cung', -0.7, 'Dần – Tỵ – Thân hình – dễ gặp tai nạn khi di chuyển, chấn thương do máy móc, có khi phải can thiệp y tế.');
  if ([1, 10, 7].filter(function (c) { return chis.indexOf(c) >= 0; }).length >= 2) o.add('cung', -0.5, 'Sửu – Tuất – Mùi hình – dễ có bệnh đường tiêu hóa, bệnh dai dẳng, và vướng thị phi, tranh chấp.');
  if (N.coTS('Dương Nhận').length && N.S(['Thất Sát']).dem) o.add('ts', -0.6, 'Dương Nhận gặp Thất Sát – dễ chấn thương, chảy máu do va chạm hoặc dụng cụ sắc, nóng giận dễ gây chuyện.');
  N.coTS('Thiên Y').forEach(function (t) { o.add('ts', 0.4, 'Thiên Y tại ' + btlTruTen_(t.tru) + ' – sức hồi phục tốt, có duyên với nghề chăm sóc sức khỏe; mặt trái là bản thân hay có bệnh phải theo dõi.'); });
  if (N.qh(P[2].chi, P[1].chi).indexOf('lục xung') >= 0 || N.qh(P[2].chi, P[3].chi).indexOf('lục xung') >= 0) o.add('cung', -0.4, 'Nhật chi bị xung – nhịp sinh hoạt dễ xáo trộn, mất ngủ, sức khỏe lên xuống thất thường.');
  o.ket.push('Theo cổ học, nên sống gần hành ' + bt.goiY.dung + ' (dụng thần), giữ nếp sinh hoạt điều độ và nghỉ ngơi đủ; ' + (o.d >= 1 ? 'nền tảng nhìn chung vững, vẫn nên khám sức khỏe định kỳ.' : 'có vài điểm yếu rõ, nên khám sức khỏe định kỳ và hỏi bác sĩ khi có dấu hiệu.'));
  out.push(btlXong_(o));

  /* 8. THIÊN DI */
  o = btlKhoi_('Thiên Di', 'Di chuyển – xuất ngoại – môi trường', '遷移', 'Dịch Mã, xung trụ, Thực Thương & Tài');
  var maNam = [2, 11, 8, 5][P[0].chi % 4], maNgay = [2, 11, 8, 5][P[2].chi % 4];
  var coMa = P.map(function (p, i) { return (p.chi === maNam || p.chi === maNgay) ? i : -1; }).filter(function (i) { return i >= 0; });
  if (coMa.length) {
    var maTot = coMa.some(function (i) { return N.hk(P[i].chiHanh) !== 'Kỵ'; }), maXung = coMa.some(function (i) { return P.some(function (q) { return mod12(q.chi - P[i].chi) === 6; }); });
    o.add('ts', maTot ? 0.9 : 0, 'Dịch Mã tại ' + btlTruTen_(coMa) + ' – hay đi lại, làm việc xa, thích đổi môi trường' + (maTot ? '; đi xa gặp may nhưng khó yên một chỗ.' : '; đi xa vất vả, tốn kém, dễ gặp trục trặc.'));
    if (maXung) o.add('ts', 0.3, 'Dịch Mã gặp xung – "mã động": thường xuyên di chuyển, có thể sống/làm việc ở nơi khác quê.');
  } else o.add('ts', 0, 'Không có Dịch Mã – thiên về ổn định; mặt trái là ít cơ hội từ bên ngoài, ngại đổi môi trường.');
  if (N.qh(P[0].chi, P[1].chi).indexOf('lục xung') >= 0 || N.qh(P[0].chi, P[2].chi).indexOf('lục xung') >= 0) o.add('cung', 0.5, 'Niên trụ bị xung – ly hương lập nghiệp thường thuận hơn ở quê.');
  if (N.g('TT') >= 1.5 && N.g('Tai') >= 1) o.add('sao', 0.5, 'Thực Thương sinh Tài – hợp kinh doanh, giao thương xa, làm việc với người nước ngoài.');
  if (N.g('An') >= 2.5) o.add('sao', -0.3, 'Ấn nặng – thích ổn định, ngại thay đổi môi trường, dễ bỏ lỡ cơ hội ở xa.');
  o.ket.push(o.d >= 1 ? 'Ra ngoài/đi xa dễ gặp cơ hội, hợp môi trường năng động; mặt trái là bôn ba, xa gia đình.' : 'Phát triển tốt khi có nền tảng ổn định; đi xa thường vất vả, ít được việc như mong.');
  out.push(btlXong_(o));

  /* 9. NÔ BỘC */
  o = btlKhoi_('Nô Bộc', 'Quý nhân – bạn bè – cộng sự', '貴人', 'Thiên Ất, Thiên/Nguyệt Đức, Tỷ Kiếp, tiểu nhân');
  ['Thiên Ất', 'Thiên Đức', 'Nguyệt Đức', 'Thái Cực', 'Tướng Tinh'].forEach(function (n) { N.coTS(n).forEach(function (t) { o.add('ts', 0.6, t.ten + ' tại ' + btlTruTen_(t.tru) + ': ' + t.moTa); }); });
  ['Kiếp Sát', 'Vong Thần'].forEach(function (n) { N.coTS(n).forEach(function (t) { o.add('ts', -0.4, t.ten + ' tại ' + btlTruTen_(t.tru) + ': ' + t.moTa); }); });
  var kTK = N.hk(H.TK);
  if (N.g('TK') >= 0.9) o.add('sao', kTK === 'Kỵ' ? -0.7 : 0.6, 'Tỷ Kiếp (bạn bè, đồng nghiệp) là ' + kTK + ' thần – ' + (kTK === 'Kỵ' ? 'bạn bè dễ cạnh tranh, kéo hao, có khi trở mặt.' : 'bạn bè, đồng nghiệp giúp đỡ đắc lực.'));
  if (N.g('QS') >= 2.5 && !bt.vuong) o.add('sao', -0.6, 'Quan Sát nặng mà thân nhược – dễ gặp tiểu nhân, cấp trên khắt khe, bị chèn ép.');
  if (N.g('An') >= 1 && N.hk(H.An) !== 'Kỵ') o.add('sao', 0.5, 'Ấn hỷ – được bề trên, thầy cô, người lớn tuổi nâng đỡ; mặt trái là dễ ỷ lại.');
  o.ket.push(o.d >= 1.5 ? 'Quý nhân nhiều – khi khó có người chìa tay; mặt trái là dễ ỷ lại và nợ ân tình.' : o.d >= 0 ? 'Có quý nhân nhưng không tự đến, phải chủ động kết nối; người giúp có lúc kèm điều kiện.' : 'Ít quý nhân, dễ gặp người cạnh tranh hoặc lợi dụng – phải tự lực là chính, hợp tác nên có giấy tờ.');
  out.push(btlXong_(o));

  /* 10. QUAN LỘC */
  o = btlKhoi_('Quan Lộc', 'Sự nghiệp – công danh', '官祿', 'Quan Sát, Ấn, Thực Thương, cách cục, nguyệt lệnh');
  var sQS = btlSao_(N, o, 'Công danh – Quan Sát', BTL_G.QS, H.QS, 1);
  var coQ = N.S(['Chính Quan']).dem, coS = N.S(['Thất Sát']).dem, coA = N.g('An'), coTh = N.S(['Thực Thần']).dem, coTQ = N.S(['Thương Quan']).dem;
  if (coQ && coA) o.add('sao', 1.2, 'Quan Ấn tương sinh – thăng tiến qua học vấn, uy tín, hợp tổ chức, nhà nước, quản lý; mặt trái là dễ cứng nhắc, phụ thuộc tổ chức.');
  if (coS && coA) o.add('sao', 1, 'Sát Ấn tương sinh – biến áp lực thành quyền lực, hợp vị trí lãnh đạo, chuyên môn cao; mặt trái là áp lực thường trực, dễ căng thẳng.');
  if (coS && coTh) o.add('sao', 1, 'Thực Thần chế Sát – bản lĩnh xử lý khủng hoảng, hợp kỹ thuật, quân sự, pháp luật; mặt trái là quen sống trong áp lực, khó nghỉ.');
  if (coTQ && coA && !coQ) o.add('sao', 0.8, 'Thương Quan phối Ấn – tài năng có kỷ luật, hợp nghiên cứu, sáng tạo chuyên sâu; mặt trái là kén việc, khó làm việc đại trà.');
  if (coTQ && coQ) o.add('sao', -0.8, 'Thương Quan kiến Quan – dễ va chạm cấp trên, luật lệ; hợp làm tự do/chuyên gia.');
  if (coQ && coS) o.add('sao', -0.5, 'Quan Sát hỗn tạp – nhiều hướng đi, dễ phân tán, đổi việc nhiều mà khó lên cao.');
  if (coS >= 1.5 && !bt.vuong && !coA && !coTh) o.add('sao', -1.1, 'Sát nặng thân nhược không chế – áp lực công việc lớn, dễ kiệt sức, bị cấp trên chèn ép; phải chờ vận Ấn/Tỷ mới đỡ.');
  if (!sQS.dem) o.add('sao', 0, 'Không có Quan Sát – hợp nghề tự do, kinh doanh, chuyên môn; mặt trái là khó leo thang trong tổ chức, ít chức vụ.');
  btlCung_(N, o, 1, 'Cung môn hộ – sự nghiệp (nguyệt trụ)');
  N.coTS('Văn Xương').concat(N.coTS('Học Đường')).forEach(function (t) { o.add('ts', 0.3, t.ten + ' – lợi thi cử, nghề chữ nghĩa; mặt trái là dễ nặng lý thuyết.'); });
  o.ket.push('Nghề hợp dụng thần ' + bt.goiY.dung + ': ' + bt.goiY.nghe + '. Theo thập thần mạnh: ' + BTCT_NHOM_Y[TEN5[g5[0].k]].nghe + '.');
  out.push(btlXong_(o));

  /* 11. ĐIỀN TRẠCH */
  o = btlKhoi_('Điền Trạch', 'Nhà cửa – đất đai – tài sản', '田宅', 'Ấn (nhà cửa), tài khố, Niên & Thời trụ');
  var sAn = btlSao_(N, o, 'Nhà cửa – Ấn tinh', BTL_G.An, H.An, null);
  if (N.g('Tai') >= 2.2 && sAn.dem < 1) o.add('sao', -0.6, 'Tài phá Ấn – nhà cửa hay thay đổi, mua bán nhiều lần, dễ hao khi sang tay.');
  if (sAn.dem >= 1 && N.goc(H.An).length) o.add('sao', 0.5, 'Ấn có gốc – dễ có nhà cửa vững, tài sản cố định; mặt trái là vốn dễ chôn vào nhà đất.');
  var hkT = N.hk(CAN_HANH[P[3].tangCan[0].can]);
  o.add('cung', hkT === 'Kỵ' ? -0.5 : hkT === 'Bình' ? 0 : 0.6, 'Thời trụ (hậu vận) ' + P[3].canTen + ' ' + P[3].chiTen + ' là ' + hkT + ' – ' + (hkT === 'Kỵ' ? 'về già tài sản dễ hao, đầu tư rủi ro dễ mất.' : 'về già an cư, tài sản tăng dần.'));
  N.coTS('Thập ác').forEach(function () { o.add('ts', -0.6, 'Thập ác đại bại – theo cổ học, ít được hưởng của gia đình, tiền khó giữ, tài sản phải tự gây dựng.'); });
  if (khoTru.length) o.add('cung', 0.3, 'Có Tài khố – thiên về tích lũy bất động sản, của để dành; mặt trái là ít tiền mặt xoay xở.');
  o.ket.push(o.d >= 1 ? 'Có phúc về nhà đất; mặt trái là dễ dồn hết vốn vào tài sản cố định, thiếu tiền mặt.' : 'Nhà cửa phải tự lực mới có, thường muộn và vất vả; hợp mua khi vận/năm Ấn – Tài thuận.');
  out.push(btlXong_(o));

  /* 12. PHÚC ĐỨC */
  o = btlKhoi_('Phúc Đức', 'Phúc phần – học vấn – đời sống tinh thần', '福德', 'Ấn, Thực Thần, Hoa Cái, Văn Xương, Thiên/Nguyệt Đức');
  var kA = N.hk(H.An);
  if (N.g('An') >= 0.9) o.add('sao', kA === 'Kỵ' ? -0.3 : 0.7, 'Ấn tinh ' + (kA === 'Kỵ' ? 'là Kỵ – học nhiều nhưng dễ ỷ lại, chậm hành động.' : 'hỷ – ham học, được che chở, tâm hồn an định; mặt trái là dễ sống trong sách vở.'));
  if (N.S(['Thiên Ấn']).dem >= 1.3) o.add('sao', 0, 'Thiên Ấn (Kiêu) mạnh – thiên về triết học, huyền học, nghệ thuật; học lệch nhưng sâu, dễ cô độc trong suy nghĩ.');
  if (N.S(['Thực Thần']).dem >= 0.9) o.add('sao', 0.6, 'Thực Thần – biết hưởng thụ, lạc quan, đời sống tinh thần phong phú; mặt trái là dễ ham vui, lười gắng sức.');
  if (N.g('Tai') >= 2.2 && N.g('An') < 1) o.add('sao', -0.6, 'Tài phá Ấn – việc học dễ đứt đoạn vì mưu sinh, bằng cấp thua người.');
  ['Hoa Cái', 'Văn Xương', 'Học Đường', 'Thái Cực', 'Thiên Đức', 'Nguyệt Đức'].forEach(function (n) { N.coTS(n).forEach(function (t) { o.add('ts', 0.35, t.ten + ': ' + t.moTa); }); });
  o.ket.push(o.d >= 1.5 ? 'Phúc dày, trí tuệ sáng – đời sống tinh thần là thế mạnh; mặt trái là dễ sống trong ý nghĩ, xa thực tế.' : 'Phúc phần không dày: tinh thần dễ bất an, ít được che chở; học tập và thực hành đều đặn là cách "đức năng thắng số".');
  out.push(btlXong_(o));
  return out;
}

/* ================= LƯU NIÊN TỪNG NĂM ================= */
function btlMotNam_(N, bt, y, namSinh, cachTot) {
  var P = N.P, dCan = N.dCan, male = N.male, H = N.H;
  var c = mod10(y + 6), z = mod12(y + 8), tt1 = thapThanTen_(dCan, c), tt2 = thapThanTen_(dCan, TANG_CAN[z][0]);
  var hC = CAN_HANH[c], hZ = CHI_HANH[z], kC = N.hk(hC), kZ = N.hk(CAN_HANH[TANG_CAN[z][0]]);
  var tuoi = y - namSinh + 1, d = 0, coSo = [], dan = [], thanSat = [], su = { nghe: [], tai: [], tinh: [], con: [], khoe: [], nha: [], di: [], hoc: [] };
  var W = { 'Dụng': 1.4, 'Hỷ': 1, 'Bình': 0, 'Kỵ': -1.2 };
  d += (W[kC] || 0) * 0.8 + (W[kZ] || 0);
  var dv = null; (bt.daiVan || []).forEach(function (v) { if (y >= v.nam && y < v.nam + 10) dv = v; });
  coSo.push('Năm ' + y + ' ' + CAN[c] + ' ' + CHI[z] + ' (' + tuoi + ' tuổi): can ' + CAN[c] + ' là ' + tt1 + ' (hành ' + hC + ' – ' + kC + '), chi ' + CHI[z] + ' chính khí ' + tt2 + ' (' + kZ + ').' +
    (dv ? ' Đang trong đại vận ' + dv.canChi + ' (' + dv.thapThan + ', ' + dv.danhGia + ').' : ' Chưa vào đại vận (tiểu vận).'));
  var nhom = function (t) { return BTCT_TT_NHOM[t]; };
  var g1 = nhom(tt1), g2 = nhom(tt2);
  function co(g) { return g1 === g || g2 === g; }
  function tot(h) { var k = N.hk(h); return k === 'Dụng' || k === 'Hỷ'; }
  // dẫn động tứ trụ
  P.forEach(function (p, i) {
    var r = N.qh(z, p.chi), canHop = Math.abs(c - p.can) === 5, canKhac = quanHeHanh(hC, p.canHanh) === 'khac';
    var ten = BTL_TR[i] + ' ' + p.canTen + ' ' + p.chiTen;
    if (c === p.can && z === p.chi) { d -= 0.6; dan.push('✗ Phục ngâm ' + ten + ' – việc cũ lặp lại, buồn phiền, dễ "giậm chân tại chỗ" ở lĩnh vực của trụ này.'); }
    if (canKhac && r.indexOf('lục xung') >= 0) { d -= 1; dan.push('✗ Thiên khắc địa xung (phản ngâm) ' + ten + ' – biến động mạnh ở lĩnh vực của trụ này.'); }
    else if (r.indexOf('lục xung') >= 0) { d -= i === 2 ? 0.8 : 0.5; dan.push('✗ Năm xung ' + ten + '.'); }
    if (r.indexOf('lục hợp') >= 0) { d += 0.4; dan.push('✓ Năm lục hợp ' + ten + ' – gắn kết, có duyên hợp tác.'); }
    if (r.indexOf('bán tam hợp') >= 0) dan.push('◇ Năm bán hợp với ' + ten + '.');
    if (r.some(function (x) { return /hình/.test(x); })) { d -= 0.4; dan.push('✗ Năm hình ' + ten + ' – thị phi, tổn thương.'); }
    if (r.indexOf('lục hại') >= 0) { d -= 0.3; dan.push('✗ Năm hại ' + ten + ' – tiểu nhân ngầm.'); }
    if (canHop && i === 2) { d += 0.3; dan.push('✓ Can năm hợp Nhật chủ – có duyên, được mời gọi, hợp tác.'); }
  });
  if (dv) {
    if (dv.can === c && dv.chi === z) { d -= 0.8; dan.push('✗ Tuế vận tịnh lâm (năm trùng đại vận ' + dv.canChi + ') – năng lượng vận bị đẩy lên cực điểm: ' + (tot(hC) ? 'cát càng cát nhưng dễ quá đà.' : 'xấu càng xấu, dễ có biến cố lớn và hao tổn.')); }
    else if (mod12(dv.chi - z) === 6) { d -= 0.5; dan.push('✗ Năm xung đại vận (' + CHI[z] + ' – ' + CHI[dv.chi] + ') – đổi hướng, dao động kế hoạch.'); }
    else if (N.qh(z, dv.chi).indexOf('lục hợp') >= 0) { d += 0.3; dan.push('✓ Năm hợp đại vận – thuận dòng vận 10 năm.'); }
  }
  if (z === P[0].chi) { d -= 0.3; dan.push('◇ Năm tuổi (trực Thái Tuế) – dễ có biến động, việc lớn dễ sai lệch.'); }
  else if (mod12(z - P[0].chi) === 6) { d -= 0.3; dan.push('✗ Năm xung Thái Tuế (chi năm sinh) – dễ thay đổi chỗ ở, công việc.'); }
  // thần sát lưu niên
  var qn = BAZI_QUY_NHAN[dCan];
  if (qn.indexOf(z) >= 0) { d += 0.6; thanSat.push('✓ Thiên Ất quý nhân lâm năm – gặp người giúp, gỡ khó; mặt trái là dễ mang ơn.'); }
  if (BAZI_VAN_XUONG[dCan] === z) { d += 0.3; thanSat.push('✓ Văn Xương – thuận thi cử, giấy tờ, học tập.'); su.hoc.push('✓ Văn Xương năm – thi cử, bằng cấp, viết lách thuận.'); }
  if (BAZI_LOC[dCan] === z) { d += 0.4; thanSat.push('✓ Lộc thần – có lộc ăn, thu nhập ổn.'); su.tai.push('✓ Lộc năm – thu nhập đều, có lộc.'); }
  // Dương Nhẫn = Lộc tiến 1 cả can âm (Tam Mệnh Thông Hội), cùng cách với BatTuThanSat.gs
  if ((typeof thsTheoTru_ === 'function' ? mod12(BAZI_LOC[dCan] + 1) : BAZI_DUONG_NHAN[dCan]) === z) { d -= 0.5; thanSat.push('✗ Dương Nhận – dễ nóng vội, hao tài, va chạm.'); su.khoe.push('✗ Dương Nhận năm – dễ chấn thương, va quệt khi di chuyển và làm việc nặng.'); }
  [[P[0].chi, 'năm'], [P[2].chi, 'ngày']].forEach(function (b) {
    if ([9, 6, 3, 0][b[0] % 4] === z) { thanSat.push('◇ Đào Hoa (theo ' + b[1] + ') – duyên tình cảm, được chú ý; dễ vướng rắc rối tình cảm.'); su.tinh.push('✓ Đào Hoa năm (theo ' + b[1] + ') – dễ có mối quan hệ mới, được yêu mến; người đã có đôi dễ bị cám dỗ.'); }
    if ([2, 11, 8, 5][b[0] % 4] === z) { thanSat.push('◇ Dịch Mã (theo ' + b[1] + ') – di chuyển, đổi môi trường.'); su.di.push('◇ Dịch Mã năm – đi xa, công tác, chuyển chỗ.'); }
  });
  if (mod12(3 - P[0].chi) === z || mod12(9 - P[0].chi) === z) { d += 0.3; thanSat.push('✓ ' + (mod12(3 - P[0].chi) === z ? 'Hồng Loan' : 'Thiên Hỷ') + ' – hỷ sự, cưới hỏi, sinh nở.'); su.tinh.push('✓ Hồng Loan/Thiên Hỷ năm – thuận cưới hỏi, tin vui.'); }
  if (N.kv.indexOf(z) >= 0) { d -= 0.3; thanSat.push('✗ Chi năm rơi Không Vong – việc dễ "hữu danh vô thực" (có tiếng mà không có miếng), kế hoạch dễ hụt.'); }
  // sự kiện theo lĩnh vực
  var xungNgay = mod12(z - P[2].chi) === 6, xungThang = mod12(z - P[1].chi) === 6, xungGio = mod12(z - P[3].chi) === 6, xungNam = mod12(z - P[0].chi) === 6;
  var hopNgay = N.qh(z, P[2].chi).indexOf('lục hợp') >= 0 || N.qh(z, P[2].chi).indexOf('bán tam hợp') >= 0;
  if (co('Quan Sát')) su.nghe.push((tot(H.QS) ? '✓ Quan Sát đến và là hỷ – cơ hội thăng chức, nhận trọng trách, được tổ chức ghi nhận; áp lực cũng tăng theo.' : '✗ Quan Sát đến mà là kỵ – áp lực công việc, cấp trên khắt khe, dễ vướng rắc rối giấy tờ, hợp đồng, quy định.'));
  if (co('Ấn')) su.nghe.push(tot(H.An) ? '✓ Ấn đến – được cấp trên nâng đỡ, học thêm, bằng cấp, giấy phép thuận.' : '◇ Ấn đến nhưng là kỵ – trì trệ, ỷ lại, giấy tờ dễ vướng.');
  if (co('Thực Thương')) su.nghe.push(tot(H.TT) ? '✓ Thực Thương đến – ý tưởng, sáng tạo, thể hiện tài năng được đón nhận.' : '◇ Thực Thương đến – dễ nói thẳng mất lòng, bất mãn và muốn nhảy việc.');
  if ((tt1 === 'Thương Quan' || tt2 === 'Thương Quan') && N.S(['Chính Quan']).dem) su.nghe.push('✗ Thương Quan gặp Chính Quan gốc – thị phi nơi làm việc, dễ bất mãn và nghỉ việc.');
  if (xungThang) su.nghe.push('✗ Xung nguyệt trụ (môn hộ) – thay đổi môi trường làm việc, chuyển ngành hoặc chuyển nơi.');
  if (co('Tài')) su.tai.push(tot(H.Tai) ? '✓ Tài tinh đến và là hỷ – kiếm tiền tốt, có thêm nguồn thu.' : (bt.vuong ? '◇ Tài tinh đến – tiền ra vào nhiều, giữ được ít.' : '✗ Tài đến mà thân nhược – thấy tiền mà khó giữ, dễ hao vì tham hoặc vì người khác.'));
  if (co('Tỷ Kiếp') && N.g('Tai') > 0.5) su.tai.push(tot(H.TK) ? '◇ Tỷ Kiếp đến – bạn bè giúp sức, nhưng tiền dễ chia sẻ.' : '✗ Tỷ Kiếp đoạt Tài – hao tài vì bạn bè, hùn hạp, cho vay khó đòi.');
  if (co('Thực Thương') && N.g('Tai') > 0.5) su.tai.push('✓ Thực Thương sinh Tài – kiếm tiền bằng tài năng, sản phẩm.');
  var kho = BTL_KHO[H.Tai];
  if (P.some(function (p) { return p.chi === kho; }) && mod12(z - kho) === 6) su.tai.push('◇ Năm xung mở Tài khố – tiền lớn ra vào (mua nhà, đầu tư, chi lớn).');
  var saoPhoi = male ? 'Tài' : 'Quan Sát';
  if (co(saoPhoi)) su.tinh.push('✓ Sao phối ngẫu (' + (male ? 'Tài tinh' : 'Quan tinh') + ') xuất hiện – năm dễ có người yêu, đính hôn/kết hôn' + (tot(male ? H.Tai : H.QS) ? ', thuận lợi.' : ', nhưng dễ gặp người không hợp hoặc quan hệ nhiều sóng gió.'));
  if (hopNgay) su.tinh.push('✓ Chi năm hợp cung phu thê – tình cảm gắn kết, thuận cưới hỏi.');
  if (xungNgay) su.tinh.push('✗ Xung cung phu thê (nhật chi) – vợ chồng dễ cãi vã, xa cách, quan hệ dễ rạn nứt; có thể đổi chỗ ở; người độc thân dễ chia tay.');
  if (!male && (tt1 === 'Thương Quan' || tt2 === 'Thương Quan') && N.S(['Chính Quan']).dem) su.tinh.push('✗ Thương Quan kiến Quan (nữ) – vợ chồng dễ cãi vã, lời nói làm tổn thương nhau.');
  var saoCon = male ? 'Quan Sát' : 'Thực Thương';
  if (co(saoCon)) su.con.push('✓ Sao con cái (' + (male ? 'Quan Sát' : 'Thực Thương') + ') đến – năm có duyên tin vui con cái, hoặc việc con cái nổi bật.');
  if (xungGio) su.con.push('✗ Xung thời trụ – con cái có thay đổi (học hành, đi xa), dễ bất đồng với cha mẹ hoặc có việc phải lo.');
  if (!male && (tt1 === 'Thiên Ấn' || tt2 === 'Thiên Ấn') && N.S(['Thực Thần']).dem) su.con.push('✗ Kiêu đoạt Thực – chuyện con cái dễ trắc trở, sinh nở vất vả; có dự định nên hỏi bác sĩ.');
  if (!tot(hC) && !tot(hZ)) su.khoe.push('✗ Cả can lẫn chi năm đều chưa thuận – năng lượng dễ hụt, dễ ốm, ' + BTCT_TANG_PHU[bt.goiY.ky[0]] + ' là chỗ yếu; nên khám định kỳ, hỏi bác sĩ khi có dấu hiệu lạ.');
  if (xungNgay || P.some(function (p, i) { return i === 2 && quanHeHanh(hC, p.canHanh) === 'khac'; })) su.khoe.push('◇ Nhật trụ bị năm khắc/xung – bản thân chịu áp lực, dễ mệt mỏi, căng thẳng kéo dài.');
  if (xungNam || xungThang) su.nha.push('◇ Xung niên/nguyệt trụ – gia đình gốc có việc phải lo, cha mẹ dễ đau ốm hoặc bất hòa; có thể đổi chỗ ở.');
  if (co('Tài') && N.g('An') > 0.5 && !tot(H.An)) su.nha.push('◇ Tài đến khắc Ấn – mẹ/bề trên có việc lo; nhà cửa có thay đổi.');
  if (co('Ấn') && tot(H.An)) su.nha.push('✓ Ấn hỷ – thuận mua nhà, sửa nhà, giấy tờ đất đai.');
  if (xungNam && !su.di.length) su.di.push('◇ Xung Thái Tuế – dễ di chuyển, thay đổi nơi ở/làm việc.');
  var linhVuc = [['Sự nghiệp', su.nghe], ['Tài lộc', su.tai], ['Tình cảm – hôn nhân', su.tinh], ['Con cái', su.con], ['Sức khỏe', su.khoe], ['Gia đình – nhà cửa', su.nha], ['Di chuyển', su.di], ['Học tập – giấy tờ', su.hoc]]
    .filter(function (x) { return x[1].length; }).map(function (x) { return x[0] + ': ' + x[1].map(function (t) { return t.replace(/^[✓✗◇]\s*/, ''); }).join(' '); });
  d = Math.round(Math.max(-7, Math.min(9, d * 1.3)) * 10) / 10;
  var dg = lgXepHang_(d);
  var secs = [{ tieuDe: 'Căn cứ', items: coSo }];
  if (dan.length) secs.push({ tieuDe: 'Năm dẫn động tứ trụ & đại vận', items: dan });
  if (thanSat.length) secs.push({ tieuDe: 'Thần sát lưu niên', items: thanSat });
  var suItems = [].concat(su.nghe, su.tai, su.tinh, su.con, su.khoe, su.nha, su.di, su.hoc);
  secs.push({ tieuDe: 'Sự việc dễ ứng theo lĩnh vực', items: suItems.length ? suItems : ['Năm bình ổn, không có tín hiệu nổi bật – ít cơ hội lớn mà cũng ít biến cố.'] });
  secs.push({ tieuDe: 'Kết luận', items: ['Đánh giá năm ' + y + ' theo Tứ Trụ: ' + dg + ' (' + diem10_(d) + '/10).',
    d >= 2.5 ? 'Năm thuận, hợp mở rộng, ký kết, đầu tư vừa sức; mặt trái là dễ quá đà, ôm quá sức.' : d >= 0 ? 'Năm ổn định nhưng khó bứt phá – làm chắc từng bước.' : 'Năm xấu: dễ hao tài, đau ốm, xung đột – nên thủ, giữ sức khỏe và tài chính.'] });
  var tom = [];
  if (su.nghe.length) tom.push('công việc'); if (su.tai.length) tom.push('tiền bạc'); if (su.tinh.length) tom.push('tình cảm'); if (su.con.length) tom.push('con cái'); if (su.di.length) tom.push('di chuyển');
  return { nam: y, canChi: CAN[c] + ' ' + CHI[z], tuoi: tuoi, thapThan: tt1 + ' / ' + tt2, diem: d, danhGia: dg, dong: tom, linhVuc: linhVuc, secs: secs,
    ketHon: [tt1, tt2].indexOf(male ? 'Chính Tài' : 'Chính Quan') >= 0 || N.qh(z, P[2].chi).indexOf('lục hợp') >= 0 || mod12(3 - P[0].chi) === z || mod12(9 - P[0].chi) === z };
}
function btlLuuNien_(bt, input, ts, vy, namSinh) {
  var N = btlNen_(bt, input.gender !== 'nu', ts), list = [];
  for (var y = vy - 3; y <= vy + 10; y++) if (y - namSinh >= 0) list.push(btlMotNam_(N, bt, y, namSinh));
  return list;
}
