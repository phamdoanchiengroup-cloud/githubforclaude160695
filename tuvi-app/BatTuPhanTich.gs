/**
 * ============================================================
 *  BatTuPhanTich.gs — PHÂN TÍCH BÁT TỰ THEO QUY TRÌNH 9 BƯỚC
 *
 *  Bước 3 – Tàng can, Thập thần (đã lập ở BatTu.gs)
 *  Bước 4 – Vượng suy Nhật can: Được lệnh · Đắc địa · Được sinh · Được trợ
 *           + tính điểm theo Thiệu Vĩ Hoa (can 36°, chi 30° chia cho tàng can 60/30/10,
 *           nhân hệ số mùa theo nguyệt lệnh: vượng 100% · tướng 80% · hưu 60% · tù 40% · tử 20%)
 *  Bước 5 – Dụng thần: Ức phù (Tích Thiên Tủy) theo bảng ưu tiên, Điều hậu (Cùng Thông Bảo Giám),
 *           Thông quan, Bệnh dược (Tử Bình)
 *  Bước 6 – Cách cục: Chính cách (nguyệt lệnh), Kiến Lộc / Dương Nhận, Ngoại cách
 *           (Tòng Tài / Tòng Sát / Tòng Nhi, Chuyên vượng, Hóa khí)
 *  Bước 7 – Cát hung: giàu sang, nghèo khó, quý hiển, cát tường, hung hiểm + 5 phương diện
 *  Bước 8 – Đại vận (chiều vận, tuổi khởi vận, luận từng vận: can 5 năm đầu, chi 5 năm sau)
 *           và Lưu niên (Thái Tuế, Tuế vận tịnh lâm, Thiên khắc địa xung, Tam hình, Thiên La Địa Võng)
 *  Bước 9 – Tổng hợp, trường hợp đặc biệt & lời khuyên
 *
 *  Hàm chính: btPhanTich_(bt, input) – gọi từ batTuLap (BatTu.gs). Kết quả gắn vào bt.phanTich và
 *  cập nhật bt.vuong / bt.cuong / bt.tyLeTro / bt.phanTram / bt.goiY để mọi module dùng chung.
 * ============================================================
 */

var BTP_HE_SO_MUA = { 'Vượng': 1, 'Tướng': 0.8, 'Hưu': 0.6, 'Tù': 0.4, 'Tử': 0.2 };
var BTP_HOP_CAN = ['Thổ', 'Kim', 'Thủy', 'Mộc', 'Hỏa'];   // Giáp–Kỷ Thổ, Ất–Canh Kim, Bính–Tân Thủy, Đinh–Nhâm Mộc, Mậu–Quý Hỏa
var BTP_TINH_CACH = {
  'Mộc': 'Nhân từ, thẳng thắn, có chí vươn lên, trọng đạo lý',
  'Hỏa': 'Nhiệt tình, sôi nổi, lễ độ, dễ nóng nảy',
  'Thổ': 'Trung hậu, ổn định, giữ chữ tín, hơi chậm đổi thay',
  'Kim': 'Cương trực, quyết đoán, trọng nghĩa, đôi khi cứng rắn',
  'Thủy': 'Thông minh, linh hoạt, giỏi xoay xở, dễ thay đổi'
};
var BTP_TANG_PHU = { 'Mộc': 'gan, mật, gân cốt', 'Hỏa': 'tim, ruột non, mạch máu', 'Thổ': 'tỳ, vị, dạ dày', 'Kim': 'phổi, ruột già, da', 'Thủy': 'thận, bàng quang, hệ sinh dục' };
var BTP_MUA_CHUYEN = { 'Mộc': [2, 3, 4], 'Hỏa': [5, 6, 7], 'Thổ': [4, 10, 1, 7], 'Kim': [8, 9, 10], 'Thủy': [11, 0, 1] };
var BTP_TEN_CHUYEN = { 'Mộc': 'Khúc Trực cách', 'Hỏa': 'Viêm Thượng cách', 'Thổ': 'Gia Tường (Giá Sắc) cách', 'Kim': 'Tòng Cách (Kim)', 'Thủy': 'Nhuận Hạ cách' };

function btpHanhSau_(h, n) { return HANH_SINH[(HANH_SINH.indexOf(h) + n + 5) % 5]; }   // +1: h sinh; +2: h khắc; -1: sinh h; -2: khắc h
function btpKhac_(a, b) { return btpHanhSau_(a, 2) === b; }                             // a khắc b
function btpSinh_(a, b) { return btpHanhSau_(a, 1) === b; }                             // a sinh b
function btpTrangThai_(hanh, lenh) {
  return { 'binh': 'Vượng', 'duoc_sinh': 'Tướng', 'sinh': 'Hưu', 'khac': 'Tù', 'bi_khac': 'Tử' }[quanHeHanh(hanh, lenh)];
}
function btpR_(x) { return Math.round(x * 10) / 10; }

/* ============================================================
 *  HÀM CHÍNH
 * ============================================================ */
function btPhanTich_(bt, input) {
  var P = bt.pillars, dCan = bt.nhatChuCan, dm = CAN_HANH[dCan];
  var mChi = P[1].chi, lenh = CAN_HANH[TANG_CAN[mChi][0]];
  var male = (input && input.gender) !== 'nu';
  var H = { tyKiep: dm, an: btpHanhSau_(dm, -1), thucThuong: btpHanhSau_(dm, 1), tai: btpHanhSau_(dm, 2), quanSat: btpHanhSau_(dm, -2) };
  var TEN_NHOM = { tyKiep: 'Tỷ Kiếp', an: 'Ấn', thucThuong: 'Thực Thương', tai: 'Tài', quanSat: 'Quan Sát' };
  var nhomCua = {}; Object.keys(H).forEach(function (k) { nhomCua[H[k]] = k; });

  /* ---------- BƯỚC 4a: bốn tiêu chí ---------- */
  var ttNC = btpTrangThai_(dm, lenh);
  var goc = [];
  P.forEach(function (p, i) { p.tangCan.forEach(function (t, j) { if (t.hanh === dm) goc.push({ tru: p.tru, can: t.ten, loai: j === 0 ? 'bản khí' : j === 1 ? 'trung khí' : 'dư khí' }); }); });
  function hienTai(hanh) {   // can thấu (trừ Nhật can) và bản khí địa chi mang hành này
    var o = [];
    P.forEach(function (p, i) { if (i !== 2 && p.canHanh === hanh) o.push(p.canTen + ' (can ' + p.tru.toLowerCase() + ')'); });
    P.forEach(function (p) { if (CAN_HANH[p.tangCan[0].can] === hanh) o.push(p.tangCan[0].ten + ' (bản khí chi ' + p.tru.toLowerCase() + ')'); });
    return o;
  }
  var tieuChi = [
    { ten: 'Được lệnh (nguyệt lệnh)', dat: ttNC === 'Vượng' || ttNC === 'Tướng',
      ly: 'Sinh tháng ' + P[1].chiTen + ' – lệnh ' + lenh + '; Nhật can ' + dm + ' ở thế ' + ttNC + (ttNC === 'Vượng' ? ' (cùng hành với lệnh)' : ttNC === 'Tướng' ? ' (lệnh sinh cho)' : ttNC === 'Hưu' ? ' (Nhật can sinh cho lệnh – bị tiết)' : ttNC === 'Tù' ? ' (Nhật can khắc lệnh – hao lực)' : ' (lệnh khắc Nhật can)') + '.' },
    { ten: 'Đắc địa (có gốc ở địa chi)', dat: goc.length > 0,
      ly: goc.length ? 'Có gốc: ' + goc.map(function (g) { return g.can + ' – ' + g.loai + ' chi ' + g.tru.toLowerCase(); }).join('; ') + '.' : 'Không có tàng can nào cùng hành ' + dm + ' trong bốn địa chi – Nhật can "lơ lửng".' },
    { ten: 'Được sinh (có Ấn tinh)', dat: hienTai(H.an).length > 0,
      ly: hienTai(H.an).length ? 'Ấn (' + H.an + ') sinh phù: ' + hienTai(H.an).join(', ') + '.' : 'Không có Ấn (' + H.an + ') thấu can hay làm bản khí.' },
    { ten: 'Được trợ (có Tỷ Kiếp)', dat: hienTai(H.tyKiep).length > 0,
      ly: hienTai(H.tyKiep).length ? 'Tỷ Kiếp (' + dm + ') giúp sức: ' + hienTai(H.tyKiep).join(', ') + '.' : 'Không có Tỷ Kiếp thấu can hay làm bản khí.' }
  ];

  /* ---------- BƯỚC 4b: tính điểm Thiệu Vĩ Hoa ---------- */
  var chiBanKhi = P.map(function (p) { return CAN_HANH[TANG_CAN[p.chi][0]]; });
  var coTrongTang = {}; P.forEach(function (p) { p.tangCan.forEach(function (t) { coTrongTang[t.hanh] = true; }); });
  // ngũ hợp giữa hai can kề nhau
  var hop = [];
  for (var i = 0; i < 3; i++) {
    var a = P[i].can, b = P[i + 1].can;
    if (Math.abs(a - b) === 5) {
      var hh = BTP_HOP_CAN[Math.min(a, b) % 5];
      var biKhac = P.some(function (p, k) { return k !== i && k !== i + 1 && btpKhac_(p.canHanh, hh); });
      hop.push({ i: i, j: i + 1, hanh: hh, hoa: lenh === hh && !biKhac, ly: lenh === hh ? (biKhac ? 'hóa thần nắm lệnh nhưng bị can khác khắc – không hóa' : 'hóa thần ' + hh + ' nắm lệnh, không bị khắc – thành hóa') : 'hóa thần ' + hh + ' không nắm lệnh – hợp mà không hóa' });
    }
  }
  var dong = [];   // từng "đơn vị lực": can và tàng can
  P.forEach(function (p, i) {
    var r = { loai: 'Can', tru: p.tru, ten: p.canTen, hanh: p.canHanh, goc: 36, dc: [], nhom: i === 2 ? 'Nhật can' : p.thapThan };
    if (coTrongTang[p.canHanh]) { r.goc += 6; r.dc.push('có gốc +6'); }
    [i - 1, i + 1].forEach(function (k) {
      if (k < 0 || k > 3) return;
      if (btpKhac_(P[k].canHanh, p.canHanh)) { r.goc -= 12; r.dc.push('bị ' + P[k].canTen + ' khắc gần −12'); }
      if (btpSinh_(p.canHanh, P[k].canHanh)) { r.goc -= 6; r.dc.push('xì hơi sang ' + P[k].canTen + ' −6'); }
    });
    if (btpKhac_(chiBanKhi[i], p.canHanh)) { r.goc -= 12; r.dc.push('chi dưới (' + p.chiTen + ') khắc gần −12'); }
    P.forEach(function (q, k) { if (Math.abs(k - i) >= 2 && btpKhac_(q.canHanh, p.canHanh)) { r.goc -= 6; r.dc.push('bị ' + q.canTen + ' khắc xa −6'); } });
    hop.forEach(function (h) {
      if (h.i !== i && h.j !== i) return;
      if (h.hoa) { r.hanh = h.hanh; r.dc.push('ngũ hợp thành hóa → tính theo ' + h.hanh); }
      else { r.goc = r.goc * 2 / 3; r.dc.push('ngũ hợp không hóa −1/3'); }
    });
    r.goc = Math.max(0, r.goc);
    dong.push(r);
    p.tangCan.forEach(function (t, j) {
      var w = TANG_CAN_TRONG_SO[p.chi][j];
      dong.push({ loai: 'Tàng can', tru: p.tru, ten: t.ten + ' (' + (j === 0 ? 'bản khí' : j === 1 ? 'trung khí' : 'dư khí') + ' chi ' + p.chiTen + ')', hanh: t.hanh, goc: 30 * w, dc: [], nhom: t.thapThan });
    });
  });
  var tongHanh = { 'Mộc': 0, 'Hỏa': 0, 'Thổ': 0, 'Kim': 0, 'Thủy': 0 }, tong = 0;
  dong.forEach(function (r) {
    r.mua = btpTrangThai_(r.hanh, lenh); r.heSo = BTP_HE_SO_MUA[r.mua];
    r.diem = btpR_(r.goc * r.heSo);
    tongHanh[r.hanh] += r.diem; tong += r.diem;
  });
  var pct = {}; HANH_SINH.forEach(function (h) { pct[h] = tong ? btpR_(tongHanh[h] / tong * 100) : 0; tongHanh[h] = btpR_(tongHanh[h]); });
  var nhomPct = {}; Object.keys(H).forEach(function (k) { nhomPct[k] = pct[H[k]]; });
  var phe = btpR_(pct[H.tyKiep] + pct[H.an]);
  var vuong = phe >= 40;
  var cuong = phe >= 62 ? 'Thân cường (vượng mạnh)' : phe >= 40 ? 'Trung hòa thiên vượng' : phe >= 26 ? 'Trung hòa thiên nhược' : 'Thân nhược';
  var soTieuChi = tieuChi.filter(function (t) { return t.dat; }).length;
  var ketLuanVS = 'Phe ta (Tỷ Kiếp ' + pct[H.tyKiep] + '% + Ấn ' + pct[H.an] + '%) = ' + phe + '% ' + (vuong ? '≥' : '<') + ' 40% tổng lực → ' + (vuong ? 'THÂN VƯỢNG' : 'THÂN NHƯỢC') +
    ' (' + cuong + '). Đạt ' + soTieuChi + '/4 tiêu chí' + (soTieuChi >= 3 && !vuong ? ' – tiêu chí nghiêng về vượng nhưng điểm lực thấp: nên xét kỹ khi luận vận.' : soTieuChi <= 1 && vuong ? ' – ít tiêu chí nhưng lực tổng vẫn đủ: vượng nhờ số lượng.' : '.');

  /* ---------- BƯỚC 5: Dụng thần ---------- */
  var ducPhu = {}, dung, hy = [], ky = [], nguyenTac = '';
  if (vuong) {
    if (nhomPct.an >= nhomPct.tyKiep) {
      ducPhu = { cuc: 'Ấn nhiều', d1: 'tai', d2: 'thucThuong' };
      nguyenTac = 'Thân vượng do Ấn nhiều → lấy Tài phá Ấn làm dụng thần, Thực Thương (hoặc Quan) làm hỷ thần.';
    } else {
      ducPhu = { cuc: 'Tỷ Kiếp nhiều', d1: 'quanSat', d2: 'thucThuong' };
      nguyenTac = 'Thân vượng do Tỷ Kiếp nhiều → lấy Quan Sát chế Tỷ Kiếp làm dụng thần, Thực Thương tiết khí làm hỷ thần.';
    }
    ky = [H.an, H.tyKiep];
  } else {
    var dich = ['quanSat', 'tai', 'thucThuong'].sort(function (x, y) { return nhomPct[y] - nhomPct[x]; })[0];
    if (dich === 'quanSat') { ducPhu = { cuc: 'Quan Sát nhiều', d1: 'an', d2: 'tyKiep' }; nguyenTac = 'Thân nhược vì Quan Sát nhiều → lấy Ấn hóa Sát sinh thân làm dụng, Tỷ Kiếp làm hỷ.'; }
    else if (dich === 'tai') { ducPhu = { cuc: 'Tài nhiều', d1: 'tyKiep', d2: 'an' }; nguyenTac = 'Thân nhược vì Tài nhiều → lấy Tỷ Kiếp giúp thân gánh Tài làm dụng, Ấn làm hỷ.'; }
    else { ducPhu = { cuc: 'Thực Thương nhiều', d1: 'an', d2: 'tyKiep' }; nguyenTac = 'Thân nhược vì Thực Thương tiết khí nhiều → lấy Ấn chế Thực Thương sinh thân làm dụng, Tỷ Kiếp làm hỷ.'; }
    ky = [H[dich]].concat(['quanSat', 'tai', 'thucThuong'].filter(function (k) { return k !== dich; }).sort(function (x, y) { return nhomPct[y] - nhomPct[x]; }).map(function (k) { return H[k]; }));
  }
  dung = H[ducPhu.d1]; hy = [H[ducPhu.d2]];
  var phuongPhap = [{ ten: 'Ức phù (Tích Thiên Tủy)', ket: 'Mệnh cục "' + ducPhu.cuc + '" → dụng ' + TEN_NHOM[ducPhu.d1] + ' (' + dung + '), hỷ ' + TEN_NHOM[ducPhu.d2] + ' (' + H[ducPhu.d2] + ').', ly: nguyenTac }];

  // Điều hậu
  var dieuHau = null;
  if ([11, 0, 1].indexOf(mChi) >= 0) dieuHau = { can: 'Hỏa', mua: 'đông', ly: 'Sinh mùa đông (tháng ' + P[1].chiTen + ') – mệnh cục hàn lạnh, cần Hỏa sưởi ấm.' };
  else if ([5, 6, 7].indexOf(mChi) >= 0) dieuHau = { can: 'Thủy', mua: 'hè', ly: 'Sinh mùa hè (tháng ' + P[1].chiTen + ') – mệnh cục khô nóng, cần Thủy giải nhiệt.' };
  if (dieuHau) {
    var thieu = pct[dieuHau.can];
    var khiHau = dieuHau.can === 'Hỏa' ? pct['Thủy'] : pct['Hỏa'];   // mùa đông xét Thủy hàn, mùa hè xét Hỏa viêm
    dieuHau.capThiet = thieu < 5 && khiHau >= 30;
    if (dieuHau.capThiet) {
      phuongPhap.push({ ten: 'Điều hậu (Cùng Thông Bảo Giám)', ket: dieuHau.can + ' chỉ ' + thieu + '% trong khi ' + (dieuHau.can === 'Hỏa' ? 'Thủy hàn' : 'Hỏa viêm') + ' chiếm ' + khiHau + '% – điều hậu CẤP THIẾT: ' + dieuHau.can + ' được đặt làm dụng thần, dụng thần ức phù lùi làm hỷ.', ly: dieuHau.ly });
      if (dung !== dieuHau.can) { hy = [dung].concat(hy); dung = dieuHau.can; }
      ky = ky.filter(function (x) { return x !== dieuHau.can; });
    } else {
      phuongPhap.push({ ten: 'Điều hậu (Cùng Thông Bảo Giám)', ket: dieuHau.can + ' có ' + thieu + '% – khí hậu đã được điều hòa phần nào; ' + (ky.indexOf(dieuHau.can) < 0 ? dieuHau.can + ' là hỷ thần bổ trợ.' : dieuHau.can + ' vốn là kỵ theo ức phù nên chỉ cần vừa đủ.'), ly: dieuHau.ly });
      if (ky.indexOf(dieuHau.can) < 0 && dung !== dieuHau.can && hy.indexOf(dieuHau.can) < 0) hy.push(dieuHau.can);
    }
  } else phuongPhap.push({ ten: 'Điều hậu (Cùng Thông Bảo Giám)', ket: 'Sinh mùa ' + (['Dần', 'Mão', 'Thìn'].indexOf(P[1].chiTen) >= 0 ? 'xuân' : 'thu') + ' – khí hậu ôn hòa, xét sinh khắc thông thường (không cần điều hậu).', ly: '' });

  // Thông quan
  var thongQuan = null;
  HANH_SINH.forEach(function (a2) {
    var b2 = btpHanhSau_(a2, 2);
    if (pct[a2] >= 25 && pct[b2] >= 25 && (!thongQuan || pct[a2] + pct[b2] > thongQuan.luc)) thongQuan = { a: a2, b: b2, x: btpHanhSau_(a2, 1), luc: pct[a2] + pct[b2] };
  });
  if (thongQuan) {
    phuongPhap.push({ ten: 'Thông quan', ket: thongQuan.a + ' (' + pct[thongQuan.a] + '%) khắc ' + thongQuan.b + ' (' + pct[thongQuan.b] + '%) gay gắt → cần ' + thongQuan.x + ' làm cầu nối (' + thongQuan.a + ' sinh ' + thongQuan.x + ', ' + thongQuan.x + ' sinh ' + thongQuan.b + ').', ly: '' });
    if (ky.indexOf(thongQuan.x) < 0 && dung !== thongQuan.x && hy.indexOf(thongQuan.x) < 0) hy.push(thongQuan.x);
  } else phuongPhap.push({ ten: 'Thông quan', ket: 'Không có hai hành đối đầu gay gắt (cùng ≥ 25% và khắc nhau) – không cần thông quan.', ly: '' });

  // Bệnh dược
  var benh = [], duoc = [];
  HANH_SINH.forEach(function (h) {
    if (pct[h] >= 35) { benh.push(h + ' thái quá (' + pct[h] + '%)'); duoc.push(ky.indexOf(btpHanhSau_(h, -2)) < 0 ? btpHanhSau_(h, -2) + ' (khắc chế ' + h + ')' : btpHanhSau_(h, 1) + ' (tiết bớt ' + h + ')'); }
    else if (pct[h] < 3) { benh.push(h + ' bất cập (' + pct[h] + '%)'); if (h === dung || hy.indexOf(h) >= 0) duoc.push(btpHanhSau_(h, -1) + ' (sinh cho ' + h + ')'); }
  });
  phuongPhap.push({ ten: 'Bệnh dược (Tử Bình)', ket: benh.length ? 'Bệnh: ' + benh.join('; ') + '. Thuốc: ' + (duoc.length ? duoc.join('; ') : 'bổ sung qua vận – năm – môi trường sống') + '.' : 'Ngũ hành không có hành nào thái quá (≥ 35%) hay bất cập (< 3%) – mệnh cục tương đối điều hòa.', ly: '' });

  /* ---------- BƯỚC 6: Cách cục ---------- */
  function thauCan(hanh) { return P.some(function (p, k) { return k !== 2 && p.canHanh === hanh; }); }
  var gocBanKhi = P.some(function (p) { return CAN_HANH[p.tangCan[0].can] === dm; });
  var kiemTra = [];   // từng điều kiện ngoại cách
  var cach = null;
  // Hóa khí
  hop.filter(function (h) { return h.i === 2 || h.j === 2; }).forEach(function (h) {
    var ben = h.i === 2 ? h.j : h.i, tranh = P.some(function (p, k) { return k !== 2 && k !== ben && p.can === P[ben].can; });
    var doiHanh = dm !== h.hanh;   // Nhật can vốn cùng hành hóa thần thì chỉ là được trợ, không thành Hóa khí cách
    var dat = h.hoa && !tranh && doiHanh && !P.some(function (p) { return CAN_HANH[p.tangCan[0].can] === dm; });
    kiemTra.push({ ten: 'Hóa ' + h.hanh + ' cách', dat: dat, ly: 'Nhật can ' + P[2].canTen + ' hợp can ' + P[ben].tru.toLowerCase() + ' ' + P[ben].canTen + ': ' + h.ly + (tranh ? '; có can khác tranh hợp' : '') + (!doiHanh ? '; Nhật can vốn là ' + dm + ' nên chỉ là được trợ, không thành hóa' : '') + '; Nhật can phải không có gốc bản khí.' });
    if (dat && !cach) cach = { ten: 'Hóa ' + h.hanh + ' cách', loai: 'Ngoại cách – Hóa khí', dung: h.hanh, hy: [btpHanhSau_(h.hanh, -1), btpHanhSau_(h.hanh, 1)], ky: [btpHanhSau_(h.hanh, -2)],
      yNghia: 'Nhật chủ "hóa" theo khí ' + h.hanh + ' – sống thuận theo môi trường, dễ thành công nhờ thời thế; kỵ vận khắc hóa thần.' };
  });
  // Tòng cách
  var coAnTyThau = thauCan(H.an) || thauCan(H.tyKiep);
  [['tai', 'Tòng Tài cách', function () { return !coAnTyThau; }, 'không có Ấn/Tỷ thấu can', ['tai', 'thucThuong'], ['an', 'tyKiep'], 'Theo Tài – phát tài nhờ thuận thế, nhưng bản thân vất vả, dễ bị cuốn theo đồng tiền.'],
   ['quanSat', 'Tòng Sát cách', function () { return !thauCan(H.an) && !thauCan(H.thucThuong); }, 'không có Ấn/Thực thấu can', ['quanSat', 'tai'], ['an', 'tyKiep', 'thucThuong'], 'Theo Sát – có quyền, được trọng dụng trong tổ chức, nhưng áp lực lớn.'],
   ['thucThuong', 'Tòng Nhi cách', function () { return !thauCan(H.an); }, 'không có Ấn thấu can', ['thucThuong', 'tai'], ['an', 'quanSat'], 'Theo "con" (Thực Thương) – tài hoa, có phúc, sống bằng tài năng; không hợp quyền chức.']
  ].forEach(function (x) {
    var dat = phe < 20 && !goc.length && nhomPct[x[0]] >= 35 && x[2]();
    kiemTra.push({ ten: x[1], dat: dat, ly: 'Cần: Nhật chủ rất nhược (phe ta ' + phe + '% < 20%), vô căn – không có gốc ở bất kỳ địa chi nào (' + (goc.length ? 'có ' + goc.length + ' gốc' : 'đạt') + '), ' + TEN_NHOM[x[0]] + ' vượng (' + nhomPct[x[0]] + '% ≥ 35%), ' + x[3] + '.' });
    if (dat && !cach) cach = { ten: x[1], loai: 'Ngoại cách – Tòng cách', dung: H[x[4][0]], hy: [H[x[4][1]]], ky: x[5].map(function (k) { return H[k]; }), yNghia: x[6] };
  });
  // Chuyên vượng
  var khacDm = H.quanSat, chuyenDat = BTP_MUA_CHUYEN[dm].indexOf(mChi) >= 0 && pct[dm] >= 55 && phe >= 80 && pct[khacDm] < 5 && !thauCan(khacDm);
  kiemTra.push({ ten: BTP_TEN_CHUYEN[dm] + ' (Chuyên vượng)', dat: chuyenDat,
    ly: 'Cần: ' + P[2].canTen + ' sinh đúng mùa của ' + dm + ' (' + (BTP_MUA_CHUYEN[dm].indexOf(mChi) >= 0 ? 'đạt' : 'tháng ' + P[1].chiTen + ' không đạt') + '), ' + dm + ' ≥ 55% (' + pct[dm] + '%), phe ta ≥ 80% (' + phe + '%), hành khắc chế ' + khacDm + ' < 5% và không thấu can (' + pct[khacDm] + '%).' });
  if (chuyenDat && !cach) cach = { ten: BTP_TEN_CHUYEN[dm], loai: 'Ngoại cách – Chuyên vượng', dung: dm, hy: [H.thucThuong, H.an], ky: [H.quanSat],
    yNghia: 'Một hành độc vượng – ý chí mạnh, chuyên sâu một lĩnh vực; thuận thế thì thành đạt lớn, gặp vận khắc chế thì trắc trở.' };
  // Chính cách theo nguyệt lệnh
  var tang = P[1].tangCan, thau = tang.filter(function (t) { return P.some(function (p, k) { return k !== 2 && p.can === t.can; }); });
  var chon = P.some(function (p, k) { return k !== 2 && p.can === tang[0].can; }) || !thau.length ? tang[0] : thau[0];
  var tt = chon.thapThan, chinhCach;
  if (tt === 'Tỷ Kiên' || tt === 'Kiếp Tài') chinhCach = BAZI_LOC[dCan] === mChi ? 'Kiến Lộc cách' : BAZI_DUONG_NHAN[dCan] === mChi ? 'Kinh Dương (Dương Nhận) cách' : 'Nguyệt Kiếp cách';
  else chinhCach = tt + ' cách';
  var chinhLy = 'Nguyệt lệnh ' + P[1].chiTen + ' tàng ' + tang.map(function (t) { return t.ten; }).join(', ') + '; ' + (chon === tang[0] ? 'lấy bản khí ' + chon.ten : chon.ten + ' thấu can nên lấy làm cách') + ' → ' + tt + ' → ' + chinhCach + '.';
  var cachCuc = cach ? { ten: cach.ten, loai: cach.loai, yNghia: cach.yNghia, chinhCach: chinhCach, chinhLy: chinhLy, kiemTra: kiemTra, dacBiet: true }
    : { ten: chinhCach, loai: /Kiến Lộc|Kinh Dương|Nguyệt Kiếp/.test(chinhCach) ? 'Chính cách – Lộc/Nhận (ngoại cách phổ thông)' : 'Chính cách (Bát chính cách)', yNghia: '', chinhCach: chinhCach, chinhLy: chinhLy, kiemTra: kiemTra, dacBiet: false };
  if (cach) {   // Ngoại cách: dụng thần theo thế cách, không theo ức phù
    phuongPhap.unshift({ ten: 'Theo ngoại cách', ket: cach.ten + ' → dụng ' + cach.dung + ', hỷ ' + cach.hy.join(', ') + ', kỵ ' + cach.ky.join(', ') + ' (thay cho ức phù thông thường).', ly: cach.yNghia });
    dung = cach.dung; hy = cach.hy.slice(); ky = cach.ky.slice();
  }
  hy = hy.filter(function (h, k) { return h !== dung && hy.indexOf(h) === k; });
  ky = ky.filter(function (h, k) { return h !== dung && hy.indexOf(h) < 0 && ky.indexOf(h) === k; });
  var nhan = HANH_SINH.filter(function (h) { return h !== dung && hy.indexOf(h) < 0 && ky.indexOf(h) < 0; });
  function vaiTro(h) { return h === dung ? 'Dụng' : hy.indexOf(h) >= 0 ? 'Hỷ' : ky.indexOf(h) >= 0 ? 'Kỵ' : 'Nhàn'; }

  /* ---------- BƯỚC 7: Cát hung & phương diện ---------- */
  var xung = (bt.quanHe || []).filter(function (q) { return q.loai === 'xung'; }).length;
  var khacDung = btpHanhSau_(dung, -2);
  var dungCoLuc = pct[dung] >= 15 && pct[khacDung] < 25, dungVoLuc = pct[dung] < 8 || pct[khacDung] >= 30;
  function dk(c, t) { return c ? t : null; }
  var catHung = [
    { ten: 'Giàu sang', dau: '✓', ds: [dk(vuong && nhomPct.tai >= 20 && nhomPct.quanSat > 0, 'Thân vượng, Tài vượng (' + nhomPct.tai + '%), có Quan bảo vệ Tài.'),
      dk(!vuong && nhomPct.tyKiep >= 20 && nhomPct.tai >= 25, 'Thân nhược nhưng Tỷ Kiếp vượng (' + nhomPct.tyKiep + '%) giúp thân thắng Tài.'),
      dk(dungCoLuc, 'Dụng thần ' + dung + ' có lực (' + pct[dung] + '%), không bị khắc phá nặng.')] },
    { ten: 'Nghèo khó – hao tài', dau: '✗', ds: [dk(!vuong && nhomPct.tai >= 30 && nhomPct.tyKiep < 10, 'Thân nhược, Tài vượng (' + nhomPct.tai + '%) mà thiếu Tỷ Kiếp – "tài đa thân nhược", có tiền khó giữ.'),
      dk(vuong && nhomPct.tai < 10 && nhomPct.tyKiep >= 30, 'Thân vượng, Tài nhược mà Tỷ Kiếp nhiều – tiền dễ bị chia, bị tranh.'),
      dk(dungVoLuc, 'Dụng thần ' + dung + ' ' + (pct[dung] < 8 ? 'vô lực (' + pct[dung] + '%)' : 'bị ' + khacDung + ' (' + pct[khacDung] + '%) khắc phá') + '.')] },
    { ten: 'Quý hiển – địa vị', dau: '✓', ds: [dk((vaiTro(H.quanSat) === 'Dụng' || vaiTro(H.quanSat) === 'Hỷ') && nhomPct.quanSat >= 15, 'Quan tinh là ' + vaiTro(H.quanSat).toLowerCase() + ' thần và có lực (' + nhomPct.quanSat + '%).'),
      dk(vuong && nhomPct.quanSat >= 20 && nhomPct.an > 0, 'Thân vượng, Quan vượng, có Ấn bảo vệ.'),
      dk(!vuong && nhomPct.quanSat >= 25 && nhomPct.an >= 10, 'Thân nhược, Quan vượng, có Ấn hóa Quan sinh thân (Sát Ấn tương sinh).')] },
    { ten: 'Cát tường – thuận lợi', dau: '✓', ds: [dk(pct[btpHanhSau_(dung, -1)] >= 15, 'Dụng thần được sinh phù (' + btpHanhSau_(dung, -1) + ' ' + pct[btpHanhSau_(dung, -1)] + '%).'),
      dk(xung <= 1, 'Ít hình xung khắc hại (' + xung + ').'),
      dk(HANH_SINH.every(function (h) { return pct[h] > 0; }) && Math.max.apply(null, HANH_SINH.map(function (h) { return pct[h]; })) < 40, 'Đủ ngũ hành, không hành nào quá 40% – lưu thông, trung hòa.')] },
    { ten: 'Hung hiểm – cần phòng', dau: '✗', ds: [dk(pct[khacDung] >= 30, 'Dụng thần bị khắc phá (' + khacDung + ' ' + pct[khacDung] + '%).'),
      dk(ky.length && pct[ky[0]] >= 35 && pct[btpHanhSau_(ky[0], -2)] < 10, 'Kỵ thần ' + ky[0] + ' vượng (' + pct[ky[0]] + '%) mà không bị chế ngự.'),
      dk(xung >= 3, 'Nhiều hình xung khắc hại (' + xung + ') – đời nhiều biến động.')] }
  ].map(function (x) { x.ds = x.ds.filter(Boolean); return x; });

  var saoPhoi = male ? 'tai' : 'quanSat', pc = P[2].tangCan[0];
  var chiNgayQH = (bt.quanHe || []).filter(function (q) { return /Ngày/.test(q.txt) && q.loai !== 'binh'; }).map(function (q) { return q.txt; });
  var gio = P[3], gioTT = gio.thapThan;
  var conSao = male ? [['Thất Sát', 'con trai'], ['Chính Quan', 'con gái']] : [['Thương Quan', 'con trai'], ['Thực Thần', 'con gái']];
  var phuongDien = [
    { ten: 'Tính cách', ds: [
      'Nhật can ' + P[2].canTen + ' ' + dm + ': ' + BTP_TINH_CACH[dm] + '.',
      vuong ? 'Thân vượng: chủ kiến mạnh, tự tin, dám làm; cần tránh cố chấp, áp đặt.' : 'Thân nhược: mềm mỏng, biết lắng nghe, dựa vào tập thể; cần rèn sự quyết đoán.',
      'Hành mạnh nhất ' + HANH_SINH.slice().sort(function (x, y) { return pct[y] - pct[x]; })[0] + ' chi phối cách hành xử bên ngoài.'] },
    { ten: 'Sự nghiệp', ds: ['quanSat', 'tai', 'an', 'thucThuong'].map(function (k) { return { k: k, v: nhomPct[k] + (vaiTro(H[k]) === 'Dụng' ? 30 : vaiTro(H[k]) === 'Hỷ' ? 15 : vaiTro(H[k]) === 'Kỵ' ? -15 : 0) }; })
      .sort(function (x, y) { return y.v - x.v; }).slice(0, 2).map(function (x, i) {
        var Y = { quanSat: 'công danh, quyền lực, làm trong tổ chức – nhà nước', tai: 'kinh doanh, tài chính, buôn bán', an: 'học vấn, giáo dục, văn hóa, nghiên cứu', thucThuong: 'nghệ thuật, kỹ thuật, sáng tạo, dịch vụ' }[x.k];
        return (i === 0 ? 'Hướng chính: ' : 'Hướng phụ: ') + TEN_NHOM[x.k] + ' (' + H[x.k] + ', ' + nhomPct[x.k] + '%, ' + vaiTro(H[x.k]).toLowerCase() + ' thần) → ' + Y + '.';
      }) },
    { ten: 'Hôn nhân', ds: [
      (male ? 'Nam xem Tài tinh (vợ)' : 'Nữ xem Quan tinh (chồng)') + ': ' + H[saoPhoi] + ' chiếm ' + nhomPct[saoPhoi] + '%, là ' + vaiTro(H[saoPhoi]).toLowerCase() + ' thần → ' +
        (vaiTro(H[saoPhoi]) === 'Dụng' || vaiTro(H[saoPhoi]) === 'Hỷ' ? 'người phối ngẫu mang lại trợ lực.' : vaiTro(H[saoPhoi]) === 'Kỵ' ? 'hôn nhân dễ nhiều áp lực, cần nhường nhịn.' : 'hôn nhân bình ổn.') +
        (nhomPct[saoPhoi] < 5 ? ' Sao phối ngẫu yếu – duyên đến muộn.' : nhomPct[saoPhoi] >= 35 ? ' Sao phối ngẫu quá vượng – nhiều mối duyên, cần chọn kỹ.' : ''),
      'Cung phu thê (chi ngày ' + P[2].chiTen + ') tàng ' + pc.ten + ' – ' + pc.thapThan + ', hành ' + pc.hanh + ' là ' + vaiTro(pc.hanh).toLowerCase() + ' thần' + (chiNgayQH.length ? '; ' + chiNgayQH.join('; ') : '; không bị xung hình') + '.'] },
    { ten: 'Con cái', ds: [
      (male ? 'Nam xem Quan Sát (Thất Sát – con trai, Chính Quan – con gái); không có thì xem Thực Thương' : 'Nữ xem Thực Thương (Thương Quan – con trai, Thực Thần – con gái)') + ': ' +
        conSao.map(function (c) { var n = P.filter(function (p, k) { return k !== 2 && p.thapThan === c[0]; }).length + P.filter(function (p) { return p.tangCan.some(function (t) { return t.thapThan === c[0]; }); }).length * 0.5; return c[0] + ' (' + c[1] + ') ×' + n; }).join(', ') + '.',
      'Cung tử tức (trụ giờ ' + gio.canTen + ' ' + gio.chiTen + '): can giờ là ' + gioTT + ', hành ' + gio.canHanh + ' là ' + vaiTro(gio.canHanh).toLowerCase() + ' thần → ' +
        (vaiTro(gio.canHanh) === 'Dụng' || vaiTro(gio.canHanh) === 'Hỷ' ? 'con cái hiếu thuận, về già được nhờ.' : vaiTro(gio.canHanh) === 'Kỵ' ? 'con cái tự lập sớm, cha mẹ cần kiên nhẫn.' : 'con cái bình ổn.') +
        (Math.abs(gio.chi - P[2].chi) === 6 ? ' Chi giờ xung chi ngày – quan điểm hai thế hệ dễ khác biệt.' : '')] },
    { ten: 'Sức khỏe', ds: HANH_SINH.filter(function (h) { return pct[h] >= 35 || pct[h] < 5; }).map(function (h) {
      return h + (pct[h] >= 35 ? ' thái quá (' + pct[h] + '%)' : ' bất cập (' + pct[h] + '%)') + ' → chú ý ' + BTP_TANG_PHU[h] + '.'; })
      .concat(['Kỵ thần ' + (ky[0] || '—') + ' vượng lên (vận/năm ' + (ky[0] || '') + ') thì ' + (ky[0] ? BTP_TANG_PHU[ky[0]] : '') + ' dễ bị ảnh hưởng.']) }
  ];

  /* ---------- BƯỚC 8: Đại vận ---------- */
  function hangVan(s) { return s >= 3 ? 'Đại cát' : s >= 1 ? 'Cát' : s > -1 ? 'Bình' : s > -3 ? 'Hơi kém' : 'Cẩn trọng'; }
  function diemHanh(h) { var v = vaiTro(h); return v === 'Dụng' ? 2 : v === 'Hỷ' ? 1 : v === 'Kỵ' ? -1.5 : 0; }
  var daiVan = (bt.daiVan || []).map(function (d) {
    var sCan = diemHanh(d.hanhCan), sChi = diemHanh(d.hanhChi), gc = [];
    if (Math.abs(d.can - dCan) === 5) gc.push('Can vận hợp Nhật can – duyên phận, hợp tác, có thể bị ràng buộc.');
    if (btpKhac_(d.hanhCan, dm)) gc.push('Can vận khắc Nhật can – áp lực, trách nhiệm tăng.');
    if (Math.abs(d.chi - P[2].chi) === 6) { sChi -= 0.5; gc.push('Chi vận xung chi ngày (cung phu thê) – biến động gia đạo, chỗ ở.'); }
    if (Math.abs(d.chi - mChi) === 6) { sChi -= 0.5; gc.push('Chi vận xung nguyệt lệnh (đề cương) – bước ngoặt lớn về môi trường, công việc.'); }
    if (d.can === P[2].can && d.chi === P[2].chi) gc.push('Vận phục ngâm trụ ngày – chuyện cũ lặp lại.');
    var dau = sCan * 0.7 + sChi * 0.3, cuoi = sCan * 0.3 + sChi * 0.7;
    return { canChi: d.canChi, tuoi: d.tuoi, nam: d.nam, thapThan: d.thapThan, chiThapThan: d.chiThapThan, hanhCan: d.hanhCan, hanhChi: d.hanhChi,
      vaiCan: vaiTro(d.hanhCan), vaiChi: vaiTro(d.hanhChi), dau: hangVan(dau * 1.5), cuoi: hangVan(cuoi * 1.5), danhGia: hangVan((sCan + sChi) * 0.9), ghiChu: gc };
  });

  /* ---------- BƯỚC 9: Trường hợp đặc biệt & tổng hợp ---------- */
  var dacBiet = [];
  var hienDung = thauCan(dung) || P.some(function (p) { return CAN_HANH[p.tangCan[0].can] === dung; });
  if (!hienDung) dacBiet.push({ ten: 'Mệnh vô dụng thần (dụng thần ẩn)', y: 'Dụng thần ' + dung + ' không thấu can, không làm bản khí – phải chờ đại vận/lưu niên mang ' + dung + ' mới phát; ' + (hy[0] ? 'trong lúc chờ, dựa vào hỷ thần ' + hy[0] + '.' : '') });
  var khuyet = HANH_SINH.filter(function (h) { return !P.some(function (p) { return p.canHanh === h || p.tangCan.some(function (t) { return t.hanh === h; }); }); });
  if (khuyet.length) dacBiet.push({ ten: 'Mệnh cục khuyết hành', y: 'Thiếu hẳn ' + khuyet.join(', ') + ' – bổ sung qua tên, màu sắc, phương hướng, nghề nghiệp mang hành này (nếu không phải kỵ thần).' });
  if (xung >= 3) dacBiet.push({ ten: 'Mệnh cục xung khắc nhiều', y: xung + ' quan hệ hình – xung – hại: cuộc đời nhiều biến động, vất vả; nên chọn môi trường ổn định.' });
  var vy = parseInt(input && input.viewYear, 10) || new Date().getFullYear();
  var dvNay = daiVan.filter(function (d) { return vy >= d.nam && vy < d.nam + 10; })[0];
  if (phe >= 62 && dvNay && (dvNay.hanhCan === H.tyKiep || dvNay.hanhCan === H.an || dvNay.hanhChi === H.tyKiep || dvNay.hanhChi === H.an))
    dacBiet.push({ ten: 'Thân cường địa vượng', y: 'Nhật chủ đã vượng lại đang gặp đại vận ' + dvNay.canChi + ' sinh phù – dễ kiêu ngạo, độc đoán; nên tiết chế, san sẻ.' });
  if (!vuong && nhomPct.tai >= 30) dacBiet.push({ ten: 'Thân nhược tài vượng', y: 'Tài chiếm ' + nhomPct.tai + '% khi thân nhược – dễ gặp rắc rối vì tiền bạc; hợp làm công hưởng lương, tránh đầu cơ.' });

  var loiKhuyen = [
    'Sống gần hành ' + dung + ' (dụng thần): màu ' + HANH_INFO[dung].mau.toLowerCase() + ', hướng ' + HANH_INFO[dung].huong + ', nghề ' + HANH_INFO[dung].nghe + '.',
    hy.length ? 'Hỷ thần ' + hy.join(', ') + ' – các năm, vận mang hành này là thời điểm nên tiến.' : '',
    ky.length ? 'Kỵ thần ' + ky.join(', ') + ' – vận, năm mang hành này nên giữ, tránh mạo hiểm lớn.' : '',
    dvNay ? 'Đại vận hiện tại ' + dvNay.canChi + ' (' + dvNay.nam + '–' + (dvNay.nam + 9) + '): 5 năm đầu ' + dvNay.dau.toLowerCase() + ', 5 năm sau ' + dvNay.cuoi.toLowerCase() + '.' : ''
  ].filter(Boolean);

  return {
    tieuChi: tieuChi, soTieuChi: soTieuChi,
    diem: { dong: dong, tongHanh: tongHanh, pct: pct, tong: btpR_(tong), phe: phe, nhomPct: nhomPct, hop: hop, lenh: lenh, trangThaiNC: ttNC },
    vuong: vuong, cuong: cuong, ketLuanVS: ketLuanVS,
    dungThan: { dung: dung, hy: hy, ky: ky, nhan: nhan, phuongPhap: phuongPhap, dieuHau: dieuHau, thongQuan: thongQuan, ducPhu: ducPhu, nhomHanh: H, tenNhom: TEN_NHOM },
    cachCuc: cachCuc, catHung: catHung, phuongDien: phuongDien, daiVan: daiVan, dacBiet: dacBiet, loiKhuyen: loiKhuyen
  };
}

/**
 * Trường hợp đặc biệt của một lưu niên (Bước 8): Tuế vận tịnh lâm, Thiên khắc địa xung, Tam hình, Thiên La Địa Võng.
 * dv: đại vận đang chạy {can, chi} (có thể null). Trả về mảng câu.
 */
function btpLuuNienDacBiet_(bt, nam, dv) {
  var can = ((nam - 4) % 10 + 10) % 10, chi = ((nam - 4) % 12 + 12) % 12, P = bt.pillars, o = [];
  if (dv && dv.can === can && dv.chi === chi) o.push('Tuế vận tịnh lâm – năm trùng can chi đại vận: biến động lớn.');
  P.forEach(function (p) {
    if (btpKhac_(CAN_HANH[can], p.canHanh) && Math.abs(chi - p.chi) === 6) o.push('Thiên khắc địa xung trụ ' + p.tru.toLowerCase() + ' (' + p.canTen + ' ' + p.chiTen + ') – hung, việc thuộc trụ này dễ đổ vỡ.');
  });
  if (dv && btpKhac_(CAN_HANH[can], CAN_HANH[dv.can]) && Math.abs(chi - dv.chi) === 6) o.push('Thiên khắc địa xung đại vận – năm chuyển mình gấp.');
  var chis = P.map(function (p) { return p.chi; }).concat([chi]);
  [[[2, 5, 8], 'Dần – Tỵ – Thân (vô ân chi hình)'], [[1, 10, 7], 'Sửu – Tuất – Mùi (trì thế chi hình)']].forEach(function (th) {
    if (th[0].indexOf(chi) >= 0 && th[0].every(function (x) { return chis.indexOf(x) >= 0; })) o.push('Năm hoàn thành tam hình ' + th[1] + ' – đề phòng tai họa, kiện tụng, phẫu thuật.');
  });
  if ((chi === 0 && P.some(function (p) { return p.chi === 3; })) || (chi === 3 && P.some(function (p) { return p.chi === 0; }))) o.push('Tý – Mão tương hình (vô lễ chi hình) – dễ bất hòa, thị phi.');
  if ([4, 6, 9, 11].indexOf(chi) >= 0 && P.some(function (p) { return p.chi === chi; })) o.push('Tự hình ' + CHI[chi] + ' – tự làm khó mình, dễ buồn phiền.');
  var naYear = P[0].napAmHanh;
  if (naYear === 'Hỏa' && ((chi === 10 && chis.indexOf(11) >= 0) || (chi === 11 && chis.indexOf(10) >= 0))) o.push('Thiên La (Tuất – Hợi) với mệnh nạp âm Hỏa – dễ vướng rắc rối, tai nạn, pháp lý.');
  if ((naYear === 'Thủy' || naYear === 'Thổ') && ((chi === 4 && chis.indexOf(5) >= 0) || (chi === 5 && chis.indexOf(4) >= 0))) o.push('Địa Võng (Thìn – Tỵ) với mệnh nạp âm ' + naYear + ' – dễ vướng rắc rối, tai nạn, pháp lý.');
  return o;
}
