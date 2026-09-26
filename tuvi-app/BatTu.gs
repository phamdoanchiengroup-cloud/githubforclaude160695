/**
 * ============================================================
 *  BatTu.gs — BÁT TỰ (TỨ TRỤ) & LUẬN NGŨ HÀNH
 *  - Trụ năm / tháng theo Tiết khí (Lập Xuân, 12 Tiết)
 *  - Trụ ngày theo JD, trụ giờ theo Ngũ Thử Độn
 *  - Tàng can, Thập thần, Trường sinh, Nạp âm, Thần sát
 *  - Vượng suy Nhật chủ, Dụng thần – Hỷ – Kỵ, Đại vận
 * ============================================================
 */

var TANG_CAN = [
  [9], [5, 9, 7], [0, 2, 4], [1], [4, 1, 9], [2, 6, 4],
  [3, 5], [5, 3, 1], [6, 8, 4], [7], [4, 7, 3], [8, 0]
];
var TANG_CAN_TRONG_SO = [[1], [0.6, 0.3, 0.1], [0.6, 0.3, 0.1], [1], [0.6, 0.3, 0.1], [0.6, 0.3, 0.1],
  [0.7, 0.3], [0.6, 0.3, 0.1], [0.6, 0.3, 0.1], [1], [0.6, 0.3, 0.1], [0.7, 0.3]];

var THAP_THAN = [
  ['Tỷ Kiên', 'Kiếp Tài'], ['Thực Thần', 'Thương Quan'], ['Thiên Tài', 'Chính Tài'],
  ['Thất Sát', 'Chính Quan'], ['Thiên Ấn', 'Chính Ấn']
];
var THAP_THAN_Y_NGHIA = {
  'Tỷ Kiên': 'anh em, bạn bè, tự lập, cạnh tranh ngang hàng',
  'Kiếp Tài': 'bạn bè, mạo hiểm, hao tài vì người khác',
  'Thực Thần': 'tài năng, hưởng thụ, sáng tạo, con cái (nữ)',
  'Thương Quan': 'thông minh, phá cách, nổi loạn, khẩu tài',
  'Thiên Tài': 'tiền bất ngờ, kinh doanh, cha, tình duyên (nam)',
  'Chính Tài': 'thu nhập ổn định, tiết kiệm, vợ (nam)',
  'Thất Sát': 'áp lực, quyền uy, dũng cảm, tiểu nhân',
  'Chính Quan': 'kỷ luật, danh dự, chức vị, chồng (nữ)',
  'Thiên Ấn': 'tư duy độc đáo, huyền học, cô độc',
  'Chính Ấn': 'học vấn, mẹ, sự che chở, bằng cấp'
};
var TRUONG_SINH_BAZI = ['Trường Sinh', 'Mộc Dục', 'Quan Đới', 'Lâm Quan', 'Đế Vượng', 'Suy',
  'Bệnh', 'Tử', 'Mộ', 'Tuyệt', 'Thai', 'Dưỡng'];
var TS_KHOI = [11, 6, 2, 9, 2, 9, 5, 0, 8, 3]; // nơi Trường Sinh của từng Thiên can

var HANH_INFO = {
  'Mộc': { mau: 'Xanh lá, xanh ngọc', huong: 'Đông, Đông Nam', so: '3, 8', nghe: 'giáo dục, xuất bản, nông lâm, thiết kế, thời trang, y dược thảo mộc', mua: 'Xuân', tang: 'Gan – mật' },
  'Hỏa': { mau: 'Đỏ, hồng, cam, tím', huong: 'Nam', so: '2, 7', nghe: 'năng lượng, điện tử, truyền thông, ẩm thực, làm đẹp, biểu diễn', mua: 'Hạ', tang: 'Tim – ruột non' },
  'Thổ': { mau: 'Vàng, nâu đất', huong: 'Trung tâm, Đông Bắc, Tây Nam', so: '5, 0', nghe: 'bất động sản, xây dựng, nông nghiệp, bảo hiểm, tư vấn, quản lý', mua: 'Tứ quý', tang: 'Tỳ – vị' },
  'Kim': { mau: 'Trắng, bạc, xám, ánh kim', huong: 'Tây, Tây Bắc', so: '4, 9', nghe: 'tài chính, ngân hàng, cơ khí, luật, kỹ thuật, trang sức', mua: 'Thu', tang: 'Phổi – đại tràng' },
  'Thủy': { mau: 'Đen, xanh dương, xanh navy', huong: 'Bắc', so: '1, 6', nghe: 'thương mại, logistics, du lịch, truyền thông, công nghệ, thủy sản', mua: 'Đông', tang: 'Thận – bàng quang' }
};

var NHAT_CHU_LUAN = [
  'Giáp Mộc – cây đại thụ: chính trực, có chí tiến thủ, trọng danh dự, thích làm người dẫn đầu; nhược điểm là cứng nhắc, khó uốn mình.',
  'Ất Mộc – hoa cỏ, dây leo: mềm mỏng, khéo léo, giàu tính thích nghi, biết nương tựa để vươn lên; đôi khi thiếu quyết đoán.',
  'Bính Hỏa – mặt trời: nhiệt tình, hào phóng, sáng sủa, thích được chú ý, lan tỏa năng lượng; dễ nóng vội, bốc đồng.',
  'Đinh Hỏa – ngọn đèn: tinh tế, chu đáo, nội tâm sâu sắc, soi sáng cho người khác; hay suy nghĩ nhiều, nhạy cảm.',
  'Mậu Thổ – núi lớn: vững chãi, đáng tin, bao dung, chịu trách nhiệm; đôi khi bảo thủ, chậm thay đổi.',
  'Kỷ Thổ – đất ruộng vườn: chăm chỉ, thực tế, giỏi nuôi dưỡng và tổ chức; hay lo xa, đa nghi.',
  'Canh Kim – kim loại thô, đao kiếm: cương trực, quyết đoán, trọng nghĩa khí, dám làm; dễ cứng rắn, thẳng thắn quá mức.',
  'Tân Kim – châu báu: thanh lịch, tinh tế, trọng hình thức và thẩm mỹ, tự trọng cao; nhạy cảm với lời phê bình.',
  'Nhâm Thủy – sông biển: thông minh, phóng khoáng, năng động, tầm nhìn rộng; dễ phóng túng, thiếu kiên nhẫn.',
  'Quý Thủy – mưa móc: dịu dàng, sâu sắc, giàu trực giác, kiên nhẫn thấm dần; dễ bi quan, khép kín.'
];

var BAZI_QUY_NHAN = [[1, 7], [0, 8], [11, 9], [11, 9], [1, 7], [0, 8], [1, 7], [6, 2], [3, 5], [3, 5]];
var BAZI_VAN_XUONG = [5, 6, 8, 9, 8, 9, 11, 0, 2, 3];
var BAZI_LOC = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0];
var BAZI_DUONG_NHAN = [3, -1, 6, -1, 6, -1, 9, -1, 0, -1];

function thapThan(nhatCan, can) {
  if (nhatCan === can) return 'Nhật Chủ';
  var eD = Math.floor(nhatCan / 2), eS = Math.floor(can / 2);
  // thứ tự can: Mộc(0) Hỏa(1) Thổ(2) Kim(3) Thủy(4) — trùng vòng tương sinh
  var rel = (eS - eD + 5) % 5;
  var samePol = (nhatCan % 2) === (can % 2);
  return THAP_THAN[rel][samePol ? 0 : 1];
}
function thapThanTen_(nhatCan, can) {
  var t = thapThan(nhatCan, can);
  return t === 'Nhật Chủ' ? 'Tỷ Kiên' : t;
}

function truongSinhBazi(can, chi) {
  var start = TS_KHOI[can];
  var idx = can % 2 === 0 ? mod12(chi - start) : mod12(start - chi);
  return TRUONG_SINH_BAZI[idx];
}

/* ============================================================
 *  HÀM CHÍNH: LẬP BÁT TỰ
 * ============================================================ */
function batTuLap(input) {
  var t = chuanHoaThoiGian_(input);
  var male = input.gender !== 'nu';

  // thời điểm vật lý (UT) theo giờ đồng hồ
  var jd0 = jdFromDate(t.solar.day, t.solar.month, t.solar.year);
  var clockMin = (parseInt(input.hour, 10) || 0) * 60 + (parseInt(input.minute, 10) || 0);
  var jdUT = jd0 - 0.5 + clockMin / 1440 - LUNAR_TZ / 24;
  var L = sunLongitudeDeg(jdUT);

  // --- Trụ năm (đổi tại Lập Xuân 315°) ---
  var y = t.solar.year;
  if (t.solar.month <= 2 && L > 250 && L < 315) y -= 1;
  var yCan = mod10(y + 6), yChi = mod12(y + 8);

  // --- Trụ tháng (theo 12 Tiết) ---
  var mIdx = Math.floor((((L - 315) % 360) + 360) % 360 / 30); // 0 = Dần
  var mCan = mod10((yCan % 5) * 2 + 2 + mIdx), mChi = mod12(mIdx + 2);

  // --- Trụ ngày & giờ ---
  var dCan = mod10(t.jd + 9), dChi = mod12(t.jd + 1);
  var hChi = Math.floor((t.hour + 1) / 2) % 12;
  var hCan = mod10((dCan % 5) * 2 + hChi);

  var truNames = ['Năm', 'Tháng', 'Ngày', 'Giờ'];
  var raw = [[yCan, yChi], [mCan, mChi], [dCan, dChi], [hCan, hChi]];
  var pillars = raw.map(function (cc, i) {
    var na = napAm(cc[0], cc[1]);
    return {
      tru: truNames[i], can: cc[0], chi: cc[1],
      canTen: CAN[cc[0]], chiTen: CHI[cc[1]],
      canHanh: CAN_HANH[cc[0]], chiHanh: CHI_HANH[cc[1]],
      thapThan: i === 2 ? 'Nhật Chủ' : thapThanTen_(dCan, cc[0]),
      tangCan: TANG_CAN[cc[1]].map(function (tc) {
        return { can: tc, ten: CAN[tc], hanh: CAN_HANH[tc], thapThan: thapThanTen_(dCan, tc) };
      }),
      napAm: na.ten, napAmHanh: na.hanh,
      truongSinh: truongSinhBazi(dCan, cc[1]),
      tuTruongSinh: truongSinhBazi(cc[0], cc[1])
    };
  });

  // --- Ngũ hành lực lượng ---
  var score = { 'Kim': 0, 'Mộc': 0, 'Thủy': 0, 'Hỏa': 0, 'Thổ': 0 };
  var dem = { 'Kim': 0, 'Mộc': 0, 'Thủy': 0, 'Hỏa': 0, 'Thổ': 0 };
  pillars.forEach(function (p, i) {
    score[p.canHanh] += 1;
    dem[p.canHanh] += 1;
    dem[p.chiHanh] += 1;
    var heSo = i === 1 ? 2 : 1.2; // lệnh tháng mạnh nhất
    TANG_CAN[p.chi].forEach(function (tc, j) {
      score[CAN_HANH[tc]] += TANG_CAN_TRONG_SO[p.chi][j] * heSo;
    });
  });
  var tong = 0;
  for (var h in score) tong += score[h];
  var phanTram = {};
  for (h in score) phanTram[h] = Math.round(score[h] / tong * 1000) / 10;

  var dmHanh = CAN_HANH[dCan];
  var iDm = HANH_SINH.indexOf(dmHanh);
  var anHanh = HANH_SINH[(iDm + 4) % 5];      // sinh ta
  var thucHanh = HANH_SINH[(iDm + 1) % 5];    // ta sinh
  var taiHanh = HANH_SINH[(iDm + 2) % 5];     // ta khắc
  var quanHanh = HANH_SINH[(iDm + 3) % 5];    // khắc ta

  var tro = score[dmHanh] + score[anHanh];
  var tyLe = tro / tong;

  // Vượng tướng hưu tù tử theo lệnh tháng
  var lenhHanh = CAN_HANH[TANG_CAN[mChi][0]];
  // quanHeHanh(ta, lệnh): cùng hành -> Vượng, lệnh sinh ta -> Tướng, ta sinh lệnh -> Hưu,
  // ta khắc lệnh -> Tù, lệnh khắc ta -> Tử
  var trangThai = { 'binh': 'Vượng', 'duoc_sinh': 'Tướng', 'sinh': 'Hưu', 'khac': 'Tù', 'bi_khac': 'Tử' }[quanHeHanh(dmHanh, lenhHanh)];
  var dacLenh = trangThai === 'Vượng' || trangThai === 'Tướng';
  var dacDia = pillars.some(function (p) { return ['Trường Sinh', 'Lâm Quan', 'Đế Vượng'].indexOf(p.truongSinh) >= 0 && p.tru !== 'Tháng'; }) ||
    pillars.some(function (p, i) { return i !== 1 && TANG_CAN[p.chi].some(function (tc) { return CAN_HANH[tc] === dmHanh; }); });
  var dacThe = pillars.filter(function (p, i) { return i !== 2 && (p.canHanh === dmHanh || p.canHanh === anHanh); }).length >= 2;

  var cuong;
  if (tyLe >= 0.58) cuong = 'Thân cường (vượng)';
  else if (tyLe >= 0.45) cuong = 'Trung hòa thiên vượng';
  else if (tyLe >= 0.36) cuong = 'Trung hòa thiên nhược';
  else cuong = 'Thân nhược';
  var vuong = tyLe >= 0.45;

  // --- Dụng thần ---
  var hy, ky, dung, lyDo;
  if (vuong) {
    var candidates = [quanHanh, thucHanh, taiHanh].sort(function (a, b) { return score[a] - score[b]; });
    // nếu Tỷ Kiếp quá nhiều -> ưu tiên Quan Sát; nếu Ấn nhiều -> Tài phá Ấn
    if (score[anHanh] > score[dmHanh]) dung = taiHanh;
    else dung = score[quanHanh] > 0.5 ? quanHanh : thucHanh;
    hy = [dung].concat(candidates.filter(function (x) { return x !== dung; }));
    ky = [anHanh, dmHanh];
    lyDo = 'Nhật chủ ' + dmHanh + ' vượng (lực trợ ' + Math.round(tyLe * 100) + '%) nên cần tiết bớt/khắc chế: ưu tiên ' + dung + '.';
  } else {
    if (score[quanHanh] > score[thucHanh] && score[quanHanh] > score[taiHanh]) dung = anHanh; // Sát nặng dùng Ấn hóa
    else dung = score[anHanh] >= 1 ? anHanh : dmHanh;
    hy = [dung, dung === anHanh ? dmHanh : anHanh];
    ky = [quanHanh, taiHanh, thucHanh].sort(function (a, b) { return score[b] - score[a]; });
    lyDo = 'Nhật chủ ' + dmHanh + ' nhược (lực trợ ' + Math.round(tyLe * 100) + '%) nên cần sinh phù: ưu tiên ' + dung + '.';
  }
  // Điều hầu
  var dieuHau = '';
  if ([11, 0, 1].indexOf(mChi) >= 0) dieuHau = 'Sinh mùa Đông (lệnh ' + CHI[mChi] + ') khí hậu hàn lạnh – rất cần Hỏa sưởi ấm (điều hầu).';
  else if ([5, 6, 7].indexOf(mChi) >= 0) dieuHau = 'Sinh mùa Hạ (lệnh ' + CHI[mChi] + ') khí hậu nóng khô – rất cần Thủy làm mát (điều hầu).';

  // --- Quan hệ can chi ---
  var quanHe = batTuQuanHe_(pillars);

  // --- Thần sát ---
  var thanSat = [];
  var chis = pillars.map(function (p) { return p.chi; });
  function coChi(c) { return chis.map(function (x, i) { return x === c ? truNames[i] : null; }).filter(Boolean); }
  BAZI_QUY_NHAN[dCan].forEach(function (c) {
    var w = coChi(c);
    if (w.length) thanSat.push({ ten: 'Thiên Ất Quý Nhân', o: w.join(', '), moTa: 'Quý nhân phù trợ, gặp nạn có người giúp.' });
  });
  var vx = coChi(BAZI_VAN_XUONG[dCan]);
  if (vx.length) thanSat.push({ ten: 'Văn Xương', o: vx.join(', '), moTa: 'Thông minh, học giỏi, có văn tài.' });
  var lc = coChi(BAZI_LOC[dCan]);
  if (lc.length) thanSat.push({ ten: 'Lộc Thần', o: lc.join(', '), moTa: 'Có lộc ăn, tài chính vững.' });
  if (BAZI_DUONG_NHAN[dCan] >= 0) {
    var dn = coChi(BAZI_DUONG_NHAN[dCan]);
    if (dn.length) thanSat.push({ ten: 'Dương Nhận', o: dn.join(', '), moTa: 'Cương mãnh, quyết liệt; cần tránh nóng nảy, tai nạn.' });
  }
  [yChi, dChi].forEach(function (base, bi) {
    var nh = base % 4;
    var MA = [2, 11, 8, 5], DAO = [9, 6, 3, 0], CAI = [4, 1, 10, 7];
    var sets = [['Dịch Mã', MA[nh], 'Hay di chuyển, đi xa, thay đổi môi trường.'],
      ['Đào Hoa', DAO[nh], 'Duyên dáng, được yêu mến, đời sống tình cảm phong phú.'],
      ['Hoa Cái', CAI[nh], 'Thiên hướng nghệ thuật, tôn giáo, triết học; hơi cô độc.']];
    sets.forEach(function (s) {
      var w = coChi(s[1]);
      if (w.length) thanSat.push({ ten: s[0] + ' (theo ' + (bi ? 'ngày' : 'năm') + ')', o: w.join(', '), moTa: s[2] });
    });
  });
  // Không vong theo trụ ngày
  var xunStart = mod12(dChi - dCan);
  var kv = [mod12(xunStart - 2), mod12(xunStart - 1)];
  var kvTru = [];
  chis.forEach(function (c, i) { if (i !== 2 && kv.indexOf(c) >= 0) kvTru.push(truNames[i]); });
  thanSat.push({ ten: 'Không Vong', o: CHI[kv[0]] + ' ' + CHI[kv[1]] + (kvTru.length ? ' (gặp ở trụ ' + kvTru.join(', ') + ')' : ''),
    moTa: kvTru.length ? 'Trụ gặp Không Vong thì lục thân/sự việc liên quan dễ hư hao, không trọn vẹn.' : 'Tứ trụ không phạm Không Vong.' });

  // --- Đại vận ---
  var yangYear = yCan % 2 === 0;
  var forward = (yangYear && male) || (!yangYear && !male);
  var jdTerm;
  if (forward) {
    var target = (315 + 30 * (mIdx + 1)) % 360;
    var dDeg = ((target - L) % 360 + 360) % 360;
    jdTerm = findSolarTermJD(target, jdUT + dDeg * 365.2422 / 360);
  } else {
    var target2 = (315 + 30 * mIdx) % 360;
    var dDeg2 = ((L - target2) % 360 + 360) % 360;
    jdTerm = findSolarTermJD(target2, jdUT - dDeg2 * 365.2422 / 360);
  }
  var soNgay = Math.abs(jdTerm - jdUT);
  var tuoiNam = Math.floor(soNgay / 3);
  var tuoiThang = Math.floor(((soNgay / 3) - tuoiNam) * 12);
  var termLocal = jdToLocalDateTime(jdTerm, LUNAR_TZ);
  var daiVan = [];
  for (var i = 1; i <= 8; i++) {
    var c2 = mod10(mCan + (forward ? i : -i)), z2 = mod12(mChi + (forward ? i : -i));
    var startAge = tuoiNam + (i - 1) * 10 + (tuoiThang >= 6 ? 1 : 0);
    daiVan.push({
      can: c2, chi: z2, canChi: canChiText(c2, z2),
      tuoi: startAge, nam: t.solar.year + startAge,
      thapThan: thapThanTen_(dCan, c2),
      chiThapThan: thapThanTen_(dCan, TANG_CAN[z2][0]),
      hanhCan: CAN_HANH[c2], hanhChi: CHI_HANH[z2],
      danhGia: danhGiaVan_(CAN_HANH[c2], CHI_HANH[z2], hy, ky)
    });
  }

  // --- Lưu niên bát tự ---
  var vy = parseInt(input.viewYear, 10) || new Date().getFullYear();
  var lnCan = mod10(vy + 6), lnChi = mod12(vy + 8);
  var luuNien = {
    nam: vy, canChi: canChiText(lnCan, lnChi),
    thapThan: thapThanTen_(dCan, lnCan), chiThapThan: thapThanTen_(dCan, TANG_CAN[lnChi][0]),
    danhGia: danhGiaVan_(CAN_HANH[lnCan], CHI_HANH[lnChi], hy, ky),
    ghiChu: []
  };
  if (mod12(lnChi - dChi) === 6) luuNien.ghiChu.push('Năm xung chi ngày (cung phu thê) – dễ thay đổi trong gia đạo, chỗ ở.');
  if (mod12(lnChi - yChi) === 6) luuNien.ghiChu.push('Năm xung chi năm sinh – biến động công việc, di chuyển.');
  if (lnChi === yChi) luuNien.ghiChu.push('Năm bản mệnh (trùng tuổi) – nên cẩn trọng, giữ sức khỏe.');
  if (lnCan + 5 === dCan || dCan + 5 === lnCan) luuNien.ghiChu.push('Can năm hợp Nhật chủ – có quý nhân, duyên phận, hợp tác thuận.');

  // --- Thai nguyên, Mệnh cung, Thân cung (đối chiếu lunar-javascript) ---
  var thaiNguyen = { can: mod10(mCan + 1), chi: mod12(mChi + 3) };
  var soThang = mIdx + 1, soGio = mod12(hChi - 2) + 1;       // đánh số Dần = 1
  var tongMG = soThang + soGio;
  var mgSo = tongMG < 14 ? 14 - tongMG : 26 - tongMG;
  var tgSo = mod12(tongMG - 10); if (tgSo === 0) tgSo = 12;
  var canDanBT = mod10((yCan % 5) * 2 + 2);
  function cungBT(so) { var c = mod12(so + 1); return { can: mod10(canDanBT + mod12(c - 2)), chi: c }; }
  var menhCungBT = cungBT(mgSo), thanCungBT = cungBT(tgSo);
  var phuTru = [
    { ten: 'Thai nguyên', cc: thaiNguyen, moTa: 'Trụ thụ thai (tháng + 1 can, + 3 chi) – bổ sung căn khí tiên thiên.' },
    { ten: 'Mệnh cung', cc: menhCungBT, moTa: 'Cung Mệnh Bát Tự (theo tháng & giờ sinh) – phản ánh khí chất bẩm sinh.' },
    { ten: 'Thân cung', cc: thanCungBT, moTa: 'Cung Thân Bát Tự – thiên về hậu vận, sự nghiệp thực tế.' }
  ].map(function (x) {
    var na = napAm(x.cc.can, x.cc.chi);
    return { ten: x.ten, can: x.cc.can, chi: x.cc.chi, canChi: canChiText(x.cc.can, x.cc.chi), napAm: na.ten, napAmHanh: na.hanh,
      thapThan: thapThanTen_(dCan, x.cc.can), moTa: x.moTa };
  });

  // --- Tiết khí lúc sinh ---
  var tietKhi = getTietKhiName(L);

  // --- Luận ---
  var luan = [];
  luan.push('Nhật chủ ' + CAN[dCan] + ' ' + dmHanh + ': ' + NHAT_CHU_LUAN[dCan]);
  luan.push('Sinh tháng ' + CHI[mChi] + ' (lệnh ' + lenhHanh + '), Nhật chủ ở trạng thái ' + trangThai + ' – ' + (dacLenh ? 'đắc lệnh' : 'thất lệnh') +
    ', ' + (dacDia ? 'đắc địa' : 'thất địa') + ', ' + (dacThe ? 'đắc thế' : 'thiếu trợ thế') + '. Kết luận: ' + cuong + '.');
  luan.push(lyDo + (dieuHau ? ' ' + dieuHau : ''));
  var thieu = HANH_SINH.filter(function (x) { return dem[x] === 0; });
  if (thieu.length) luan.push('Tứ trụ khuyết hành ' + thieu.join(', ') + ' (không xuất hiện trên can chi) – có thể bổ sung qua màu sắc, phương hướng, nghề nghiệp.');
  var manh = HANH_SINH.slice().sort(function (a, b) { return score[b] - score[a]; });
  luan.push('Ngũ hành mạnh nhất: ' + manh[0] + ' (' + phanTram[manh[0]] + '%), yếu nhất: ' + manh[4] + ' (' + phanTram[manh[4]] + '%).');

  // Thập thần nổi bật
  var ttCount = {};
  pillars.forEach(function (p, i) {
    if (i !== 2) ttCount[p.thapThan] = (ttCount[p.thapThan] || 0) + 1;
    ttCount[p.tangCan[0].thapThan] = (ttCount[p.tangCan[0].thapThan] || 0) + 0.8;
  });
  var ttSort = Object.keys(ttCount).sort(function (a, b) { return ttCount[b] - ttCount[a]; });
  luan.push('Thập thần nổi bật: ' + ttSort.slice(0, 3).map(function (x) { return x + ' (' + THAP_THAN_Y_NGHIA[x] + ')'; }).join('; ') + '.');

  var dungInfo = HANH_INFO[dung];
  var goiY = {
    dung: dung, hy: hy, ky: ky,
    mau: dungInfo.mau, huong: dungInfo.huong, so: dungInfo.so, nghe: dungInfo.nghe,
    mauHy: hy.map(function (x) { return x + ': ' + HANH_INFO[x].mau; }),
    tang: HANH_INFO[manh[0]].tang + ' (hành vượng), ' + HANH_INFO[manh[4]].tang + ' (hành suy)'
  };

  var R = {
    pillars: pillars, nhatChu: CAN[dCan] + ' ' + dmHanh, nhatChuCan: dCan, nhatChuHanh: dmHanh,
    score: score, phanTram: phanTram, dem: dem, tyLeTro: Math.round(tyLe * 1000) / 10,
    trangThai: trangThai, cuong: cuong, vuong: vuong,
    quanHe: quanHe, thanSat: thanSat,
    daiVan: daiVan, khoiVan: { nam: tuoiNam, thang: tuoiThang, thuan: forward, soNgay: Math.round(soNgay * 10) / 10,
      tiet: termLocal.d + '/' + termLocal.m + '/' + termLocal.y + ' ' + pad2_(termLocal.h) + ':' + pad2_(termLocal.mi) },
    luuNien: luuNien, tietKhi: tietKhi, kinhDoMatTroi: Math.round(L * 100) / 100,
    luan: luan, goiY: goiY, phuTru: phuTru
  };
  // Phân tích 9 bước (BatTuPhanTich.gs): vượng suy theo điểm Thiệu Vĩ Hoa, dụng thần nhiều phương pháp, cách cục đủ ngoại cách.
  // Kết quả thay cho ước lượng nhanh ở trên để MỌI module (Tử Vi × Bát Tự, cặp đôi, dự đoán, hội tụ…) dùng chung một kết luận.
  if (typeof btPhanTich_ === 'function') {
    try {
      var PT = btPhanTich_(R, input), dt = PT.dungThan;
      R.phanTich = PT;
      R.vuong = PT.vuong; R.cuong = PT.cuong; R.tyLeTro = PT.diem.phe;
      R.phanTram = PT.diem.pct; R.score = PT.diem.tongHanh;
      var hyMoi = [dt.dung].concat(dt.hy);            // quy ước cũ: hy[0] là dụng thần
      var manhMoi = HANH_SINH.slice().sort(function (a, b) { return PT.diem.pct[b] - PT.diem.pct[a]; });
      R.goiY = { dung: dt.dung, hy: hyMoi, ky: dt.ky.slice(), nhan: dt.nhan.slice(),
        mau: HANH_INFO[dt.dung].mau, huong: HANH_INFO[dt.dung].huong, so: HANH_INFO[dt.dung].so, nghe: HANH_INFO[dt.dung].nghe,
        mauHy: hyMoi.map(function (x) { return x + ': ' + HANH_INFO[x].mau; }),
        tang: HANH_INFO[manhMoi[0]].tang + ' (hành vượng), ' + HANH_INFO[manhMoi[4]].tang + ' (hành suy)' };
      R.daiVan.forEach(function (d, k) { if (PT.daiVan[k]) { d.danhGia = PT.daiVan[k].danhGia; d.dau = PT.daiVan[k].dau; d.cuoi = PT.daiVan[k].cuoi; } });
      R.luuNien.danhGia = danhGiaVan_(CAN_HANH[lnCan], CHI_HANH[lnChi], R.goiY.hy, R.goiY.ky);
      R.luuNien.ghiChu = R.luuNien.ghiChu.concat(btpLuuNienDacBiet_(R, vy, R.daiVan.filter(function (d) { return vy >= d.nam && vy < d.nam + 10; })[0]));
      R.luan = [
        'Nhật chủ ' + CAN[dCan] + ' ' + dmHanh + ': ' + NHAT_CHU_LUAN[dCan],
        PT.ketLuanVS,
        'Dụng thần ' + dt.dung + ', hỷ thần ' + (dt.hy.join(', ') || '—') + ', kỵ thần ' + (dt.ky.join(', ') || '—') + '.',
        'Cách cục: ' + PT.cachCuc.ten + ' (' + PT.cachCuc.loai + ').'
      ].concat(luan.slice(3));
    } catch (e) { R.phanTichLoi = String(e && e.message || e); }
  }
  return R;
}

function pad2_(n) { return (n < 10 ? '0' : '') + n; }

function danhGiaVan_(hCan, hChi, hy, ky) {
  var s = 0;
  if (hy.indexOf(hCan) >= 0) s += hy.indexOf(hCan) === 0 ? 2 : 1;
  if (ky.indexOf(hCan) >= 0) s -= 1;
  if (hy.indexOf(hChi) >= 0) s += hy.indexOf(hChi) === 0 ? 2 : 1;
  if (ky.indexOf(hChi) >= 0) s -= 1;
  return s >= 3 ? 'Đại cát' : s >= 1 ? 'Cát' : s === 0 ? 'Bình' : s >= -1 ? 'Hơi kém' : 'Cẩn trọng';
}

function batTuQuanHe_(pillars) {
  var res = [];
  var n = pillars.length;
  var LUC_HOP = { '0-1': 'Thổ', '2-11': 'Mộc', '3-10': 'Hỏa', '4-9': 'Kim', '5-8': 'Thủy', '6-7': 'Hỏa/Thổ' };
  var LUC_HAI = ['0-7', '1-6', '2-5', '3-4', '8-11', '9-10'];
  var HOP_CAN = ['Thổ', 'Kim', 'Thủy', 'Mộc', 'Hỏa'];
  for (var i = 0; i < n; i++) {
    for (var j = i + 1; j < n; j++) {
      var a = pillars[i], b = pillars[j];
      var ten = 'Trụ ' + a.tru + ' – ' + b.tru;
      if (Math.abs(a.can - b.can) === 5) res.push({ loai: 'hop', txt: ten + ': ' + a.canTen + ' – ' + b.canTen + ' ngũ hợp hóa ' + HOP_CAN[Math.min(a.can, b.can)] });
      if (Math.abs(a.can - b.can) === 6 && Math.floor(a.can / 2) !== 2 && Math.floor(b.can / 2) !== 2)
        res.push({ loai: 'xung', txt: ten + ': ' + a.canTen + ' – ' + b.canTen + ' tương xung (can)' });
      var lo = Math.min(a.chi, b.chi), hi = Math.max(a.chi, b.chi), key = lo + '-' + hi;
      if (LUC_HOP[key]) res.push({ loai: 'hop', txt: ten + ': ' + a.chiTen + ' – ' + b.chiTen + ' lục hợp (' + LUC_HOP[key] + ')' });
      if (hi - lo === 6) res.push({ loai: 'xung', txt: ten + ': ' + a.chiTen + ' – ' + b.chiTen + ' lục xung' });
      if (LUC_HAI.indexOf(key) >= 0) res.push({ loai: 'xung', txt: ten + ': ' + a.chiTen + ' – ' + b.chiTen + ' lục hại' });
      if (key === '0-3') res.push({ loai: 'xung', txt: ten + ': Tý – Mão tương hình (vô lễ chi hình)' });
      if (a.chi === b.chi && [4, 6, 9, 11].indexOf(a.chi) >= 0) res.push({ loai: 'xung', txt: ten + ': ' + a.chiTen + ' tự hình' });
    }
  }
  // Tam hợp, tam hình
  var chis = pillars.map(function (p) { return p.chi; });
  var TAM_HOP = [[[8, 0, 4], 'Thân Tý Thìn hợp Thủy cục'], [[2, 6, 10], 'Dần Ngọ Tuất hợp Hỏa cục'],
    [[5, 9, 1], 'Tỵ Dậu Sửu hợp Kim cục'], [[11, 3, 7], 'Hợi Mão Mùi hợp Mộc cục']];
  TAM_HOP.forEach(function (th) {
    var c = th[0].filter(function (x) { return chis.indexOf(x) >= 0; }).length;
    if (c === 3) res.push({ loai: 'hop', txt: 'Tam hợp: ' + th[1] });
    else if (c === 2 && chis.indexOf(th[0][1]) >= 0) res.push({ loai: 'hop', txt: 'Bán tam hợp: ' + th[1] + ' (thiếu 1)' });
  });
  var TAM_HOI = [[[2, 3, 4], 'Dần Mão Thìn hội phương Đông (Mộc)'], [[5, 6, 7], 'Tỵ Ngọ Mùi hội phương Nam (Hỏa)'],
    [[8, 9, 10], 'Thân Dậu Tuất hội phương Tây (Kim)'], [[11, 0, 1], 'Hợi Tý Sửu hội phương Bắc (Thủy)']];
  TAM_HOI.forEach(function (th) {
    if (th[0].every(function (x) { return chis.indexOf(x) >= 0; })) res.push({ loai: 'hop', txt: 'Tam hội: ' + th[1] });
  });
  var TAM_HINH = [[[2, 5, 8], 'Dần Tỵ Thân – vô ân chi hình'], [[1, 10, 7], 'Sửu Tuất Mùi – trì thế chi hình']];
  TAM_HINH.forEach(function (th) {
    var c = th[0].filter(function (x) { return chis.indexOf(x) >= 0; }).length;
    if (c >= 2) res.push({ loai: 'xung', txt: (c === 3 ? 'Tam hình đủ: ' : 'Bán hình: ') + th[1] });
  });
  if (!res.length) res.push({ loai: 'binh', txt: 'Tứ trụ không có hợp – xung – hình – hại đáng kể: cục diện ổn định.' });
  return res;
}

/**
 * Kết hợp Tử Vi & Bát Tự: tổng luận
 */
function ketHopLuan(tv, bt) {
  var out = [];
  var I = tv.info;
  var dung = bt.goiY.dung;
  out.push('Tử Vi cho thấy "bản đồ" 12 lĩnh vực đời người; Bát Tự đo "năng lượng" ngũ hành. Hai hệ thống bổ sung cho nhau.');
  // Cục vs dụng thần
  if (I.cucHanh === dung) out.push('Hành của Cục (' + I.cuc + ') trùng Dụng thần Bát Tự (' + dung + ') – môi trường sống/hoàn cảnh hỗ trợ đúng nhu cầu năng lượng, rất thuận.');
  else if (bt.goiY.ky.indexOf(I.cucHanh) >= 0) out.push('Hành của Cục (' + I.cucHanh + ') là hành Kỵ trong Bát Tự – hoàn cảnh dễ gây áp lực; nên chủ động bổ sung hành ' + dung + '.');
  else out.push('Hành của Cục (' + I.cucHanh + ') trung tính với Dụng thần ' + dung + '.');
  // Bản mệnh vs dụng thần
  if (I.banMenh.hanh === dung) out.push('Bản mệnh nạp âm ' + I.banMenh.ten + ' đồng hành Dụng thần – căn cơ vững.');
  // Mệnh chính tinh ngũ hành
  var ms = tv.palaces[I.menh].chinh;
  if (ms.length) {
    var hanhs = ms.map(function (s) { return s.n + ' (' + s.h + ')'; }).join(', ');
    var hop = ms.filter(function (s) { return bt.goiY.hy.indexOf(s.h) >= 0; });
    out.push('Chính tinh thủ Mệnh: ' + hanhs + '. ' + (hop.length ? 'Có sao thuộc hành Hỷ/Dụng (' + hop.map(function (s) { return s.n; }).join(', ') + ') – tính cách tự nhiên đã hướng về điều có lợi.' : 'Các sao không thuộc hành Hỷ – nên rèn luyện thêm phẩm chất của hành ' + dung + '.'));
  }
  // Vượng nhược vs điểm cung mệnh
  var dm = tv.palaces[I.menh].diem;
  if (bt.vuong && dm >= 1) out.push('Nhật chủ vượng + cung Mệnh tốt: nội lực mạnh, hợp làm chủ, khởi nghiệp, lãnh đạo.');
  else if (bt.vuong && dm < 1) out.push('Nhật chủ vượng nhưng cung Mệnh kém: năng lượng dồi dào nhưng dễ dùng sai chỗ – cần định hướng rõ ràng.');
  else if (!bt.vuong && dm >= 1) out.push('Nhật chủ nhược nhưng cung Mệnh tốt: nhờ quý nhân và môi trường tốt mà thành; hợp làm việc trong tổ chức.');
  else out.push('Nhật chủ nhược và cung Mệnh không mạnh: nên đi đường vững chắc, tích lũy chuyên môn, chọn cộng sự tốt.');
  // Vận hiện tại
  var vy = I.viewYear;
  var dvNow = bt.daiVan.filter(function (d) { return vy >= d.nam && vy < d.nam + 10; })[0];
  if (dvNow) out.push('Năm ' + vy + ' đang ở Đại vận Bát Tự ' + dvNow.canChi + ' (' + dvNow.thapThan + ') – ' + dvNow.danhGia + '; Lưu niên ' + bt.luuNien.canChi + ' – ' + bt.luuNien.danhGia + '.');
  out.push('Gợi ý cân bằng: màu ' + bt.goiY.mau + '; hướng ' + bt.goiY.huong + '; số ' + bt.goiY.so + '; ngành nghề hợp: ' + bt.goiY.nghe + '.');
  return out;
}
