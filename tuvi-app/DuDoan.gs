/**
 * ============================================================
 *  DuDoan.gs — SUY LUẬN CÁC MỐC VẬN HẠN TRONG ĐỜI
 *  Quét từng năm (tuổi 1 → 90), chấm điểm theo quy tắc Tử Vi (tiểu hạn,
 *  lưu tinh, Tứ Hóa đại vận, sao gốc) kết hợp Bát Tự (thập thần lưu niên,
 *  hợp – xung với tứ trụ, hỷ – kỵ thần), mỗi điểm đều kèm lý do.
 *
 *  Chủ đề:
 *    sucKhoe  – năm dễ có biến cố sức khỏe
 *    taiChinh – năm dễ hao tán, biến cố tài chính
 *    giaDao   – năm dễ biến động gia đạo
 *    ketHon   – năm khả năng kết hôn cao
 *    sinhCon  – năm khả năng sinh con
 *    taiLoc   – năm tài lộc sáng nhất
 *    quanLoc  – năm đường quan lộc động mạnh
 * ============================================================
 */

var DD_CHU_DE = {
  sucKhoe: { ten: 'Biến cố sức khỏe', icon: '✚', loai: 'xau',
    coSo: 'Xét cung Tật Ách của năm (cung thứ 6 tính từ tiểu hạn) và bản thân cung tiểu hạn: lưu Kình Dương, Đà La, Hóa Kỵ, Tang Môn, Bạch Hổ nhập vào; hiện tượng "trùng phùng" (lưu sát tinh gặp sát tinh gốc); tiểu hạn đi vào cung Tật Ách gốc hoặc gặp Thiên Thương – Thiên Sứ; năm xung/trùng Thái Tuế. Bát Tự: năm mang hành Kỵ thần khắc Nhật chủ, chi năm xung chi ngày. Các sao giải (Thiên Giải, Địa Giải, Giải Thần, Nhị Đức, Hóa Khoa) làm giảm mức độ.' },
  taiChinh: { ten: 'Biến cố tài chính', icon: '⚠', loai: 'xau',
    coSo: 'Xét cung Tài Bạch của năm (cung thứ 5 tính từ tiểu hạn): lưu Hóa Kỵ, lưu Kình – Đà, Địa Không – Địa Kiếp gốc, Đại Hao – Tiểu Hao; Hóa Kỵ đại vận nhập Tài. Bát Tự: năm Tỷ Kiên – Kiếp Tài ("Tỷ Kiếp đoạt Tài"), năm mang hành Kỵ thần. Lưu Lộc tại cung Tài làm giảm rủi ro.' },
  giaDao: { ten: 'Biến động gia đạo', icon: '⌂', loai: 'xau',
    coSo: 'Xét các cung gia đình của năm: Phu Thê (thứ 3), Điền Trạch (thứ 10), Phụ Mẫu (thứ 12 tính từ tiểu hạn): lưu Tang Môn, Bạch Hổ, Khốc – Hư, Hóa Kỵ, Kình – Đà; Cô Thần – Quả Tú tại hạn. Bát Tự: chi năm xung – hình – hại chi ngày (cung phu thê) và chi năm sinh (tổ nghiệp).' },
  ketHon: { ten: 'Khả năng kết hôn', icon: '❤', loai: 'tot',
    coSo: 'Xét hỷ tinh: lưu Hồng Loan – Thiên Hỷ và Hồng Loan – Thiên Hỷ – Đào Hoa gốc gặp tiểu hạn hoặc cung Phu Thê của năm; tiểu hạn/Lưu Thái Tuế đi vào cung Phu Thê gốc; Hóa Lộc – Hóa Khoa nhập Phu Thê. Bát Tự: năm xuất hiện "phối ngẫu tinh" (nam: Chính Tài – Thiên Tài; nữ: Chính Quan – Thất Sát), chi năm lục hợp/tam hợp chi ngày, năm Đào Hoa. Điều chỉnh theo độ tuổi thường kết hôn.' },
  sinhCon: { ten: 'Khả năng sinh con', icon: '✿', loai: 'tot',
    coSo: 'Xét cung Tử Tức của năm (thứ 4 tính từ tiểu hạn) và cung Tử Tức gốc: tiểu hạn nhập Tử Tức, lưu Thiên Hỷ – Hồng Loan, sao Thai, Hóa Lộc – Khoa nhập Tử Tức. Bát Tự: năm "tử tức tinh" (nữ: Thực Thần – Thương Quan; nam: Chính Quan – Thất Sát), chi năm hợp chi giờ (cung tử tức). Trừ điểm khi Không Kiếp, Hóa Kỵ ở Tử Tức. Điều chỉnh theo độ tuổi sinh nở.' },
  taiLoc: { ten: 'Tài lộc sáng', icon: '✦', loai: 'tot',
    coSo: 'Xét cung tiểu hạn và cung Tài Bạch của năm: lưu Lộc Tồn, lưu Hóa Lộc, Song Lộc (lưu Lộc gặp Lộc gốc), Lộc Mã giao trì, Hóa Lộc đại vận; chất lượng cung Tài gốc. Bát Tự: năm Tài tinh khi Nhật chủ đủ vượng để "gánh tài", năm mang hành Dụng/Hỷ thần. Trừ điểm khi Kỵ, Không Kiếp nhập Tài.' },
  quanLoc: { ten: 'Quan lộc động mạnh', icon: '⚑', loai: 'dong',
    coSo: 'Xét cung Quan Lộc của năm (thứ 9 tính từ tiểu hạn) và cung tiểu hạn: lưu Hóa Quyền – Khoa – Lộc (thăng tiến), lưu Thiên Mã (điều chuyển), Lưu Thái Tuế hoặc tiểu hạn nhập Quan Lộc gốc, lưu Kình – Kỵ (cạnh tranh, áp lực); quý tinh gốc tại Quan. Bát Tự: năm Chính Quan – Thất Sát – Ấn, chi năm xung chi tháng (môn hộ sự nghiệp). Điểm thể hiện mức độ "động"; chiều hướng tốt/xấu ghi riêng.' }
};

function ddTuoiHeSo_(cd, tuoi) {
  if (cd === 'ketHon') return tuoi < 17 ? 0 : tuoi < 20 ? 0.5 : tuoi <= 35 ? 1 : tuoi <= 45 ? 0.7 : tuoi <= 60 ? 0.35 : 0.15;
  if (cd === 'sinhCon') return tuoi < 18 ? 0 : tuoi < 22 ? 0.4 : tuoi <= 38 ? 1 : tuoi <= 44 ? 0.5 : tuoi <= 50 ? 0.15 : 0;
  if (cd === 'quanLoc') return tuoi < 18 ? 0.3 : tuoi > 70 ? 0.4 : 1;
  if (cd === 'taiLoc' || cd === 'taiChinh') return tuoi < 16 ? 0.4 : 1;
  if (cd === 'sucKhoe') return tuoi >= 60 ? 1.2 : tuoi >= 50 ? 1.1 : 1;
  return 1;
}

/** Tạo bộ đếm điểm có lưu lý do */
function ddBo_() {
  var o = { d: 0, ly: [], tot: 0, xau: 0 };
  o.add = function (w, txt, huong) {
    if (!w) return;
    o.d += w;
    o.ly.push((w > 0 ? '+' : '') + (Math.round(w * 10) / 10) + ' · ' + txt);
    if (huong === 'tot') o.tot += Math.abs(w); else if (huong === 'xau') o.xau += Math.abs(w);
  };
  return o;
}

/** Phân tích một năm (năm âm lịch Y) cho mọi chủ đề */
function ddPhanTichNam_(chart, bt, Y, dvCache) {
  var P = chart.palaces, I = chart.info;
  var tuoi = Y - I.lunar.year + 1;
  var th = lgTieuHanCung_(chart, Y);
  var L = lgLuuTinh_(chart, Y);
  var dh = lgDaiHanCung_(chart, tuoi);
  var dv = dh >= 0 ? dvCache[dh] : { hoa: {} };
  var ext = L.ex;

  var yPT = mod12(th - 2), yTT = mod12(th - 3), yTai = mod12(th - 4), yTat = mod12(th - 5),
    yQuan = mod12(th - 8), yDien = mod12(th - 9), yPM = mod12(th + 1);
  var tptc = lgTPTC_(th);

  function goc(p, n) { return lgSaoTrongCung_(chart, p).indexOf(n) >= 0; }
  function luu(p, n) { return (ext[p] || []).indexOf('L.' + n) >= 0; }
  function dvh(p, n) { return (dv.hoa[p] || []).indexOf(n) >= 0; }
  function luuTP(n) { return tptc.filter(function (p) { return luu(p, n); }).length > 0; }
  function ten(p) { return P[p].cung + ' gốc (' + P[p].chiTen + ')'; }

  var dCan = bt.nhatChuCan;
  var ttCan = thapThanTen_(dCan, L.can);
  var ttChi = thapThanTen_(dCan, TANG_CAN[L.chi][0]);
  var hanhCan = CAN_HANH[L.can], hanhChi = CHI_HANH[L.chi];
  var chiNgay = bt.pillars[2].chi, chiGio = bt.pillars[3].chi, chiThang = bt.pillars[1].chi, chiNamSinh = I.yChi;
  var qhNgay = lgQuanHeChi_(L.chi, chiNgay), qhNam = lgQuanHeChi_(L.chi, chiNamSinh),
    qhGio = lgQuanHeChi_(L.chi, chiGio), qhThang = lgQuanHeChi_(L.chi, chiThang);
  var isKy = bt.goiY.ky.indexOf(hanhCan) >= 0 || bt.goiY.ky.indexOf(hanhChi) >= 0;
  var isDung = hanhCan === bt.goiY.dung || hanhChi === bt.goiY.dung;
  var male = I.male;
  var dm = CAN_HANH[dCan], quanHanh = HANH_SINH[(HANH_SINH.indexOf(dm) + 3) % 5];

  var R = {};

  /* ---------- SỨC KHỎE ---------- */
  var s = ddBo_();
  ['Kình Dương', 'Đà La'].forEach(function (n) {
    if (luu(yTat, n)) s.add(2, 'Lưu ' + n + ' nhập cung Tật Ách của năm (' + ten(yTat) + ')');
    else if (luu(th, n)) s.add(1.8, 'Lưu ' + n + ' tại cung tiểu hạn');
    else if (luuTP(n)) s.add(0.8, 'Lưu ' + n + ' chiếu tiểu hạn');
    // trùng phùng
    ['Kình Dương', 'Đà La'].forEach(function (m) {
      var gp = chart.pos[m];
      if (luu(gp, n) && (gp === th || gp === yTat)) s.add(1.5, 'Trùng phùng: lưu ' + n + ' gặp ' + m + ' gốc tại ' + (gp === th ? 'cung tiểu hạn' : 'Tật Ách năm'));
    });
  });
  if (luu(yTat, 'Hóa Kỵ')) s.add(2, 'Lưu Hóa Kỵ nhập Tật Ách năm – bệnh dai dẳng, khó dứt');
  else if (luu(th, 'Hóa Kỵ')) s.add(1.2, 'Lưu Hóa Kỵ tại cung tiểu hạn');
  if (luu(th, 'Tang Môn') || luu(yTat, 'Tang Môn')) s.add(1.3, 'Lưu Tang Môn nhập hạn/Tật – buồn phiền, hao tổn sức');
  if (luu(th, 'Bạch Hổ') || luu(yTat, 'Bạch Hổ')) s.add(1.5, 'Lưu Bạch Hổ nhập hạn/Tật – đề phòng tai nạn, phẫu thuật');
  if (th === chart.pos['Thiên Sứ'] || th === chart.pos['Thiên Thương']) s.add(1.3, 'Tiểu hạn gặp ' + (th === chart.pos['Thiên Sứ'] ? 'Thiên Sứ' : 'Thiên Thương') + ' – "hạn gặp Thương Sứ"');
  if (P[th].cung === 'Tật Ách') s.add(1.2, 'Tiểu hạn đi vào cung Tật Ách gốc');
  if (dvh(yTat, 'Hóa Kỵ')) s.add(1.2, 'Hóa Kỵ đại vận nhập Tật Ách năm');
  ['Thiên Hình', 'Kiếp Sát', 'Lưu Hà'].forEach(function (n) { if (goc(th, n)) s.add(0.6, n + ' gốc tại cung tiểu hạn'); });
  if (goc(yTat, 'Địa Kiếp') || goc(yTat, 'Địa Không')) s.add(0.7, 'Không/Kiếp gốc ở Tật Ách năm');
  if (qhNam.indexOf('lục xung') >= 0) s.add(0.9, 'Năm xung Thái Tuế (chi năm xung tuổi)');
  if (qhNam.indexOf('trùng (đồng chi)') >= 0) s.add(0.6, 'Năm tuổi (trùng Thái Tuế)');
  if (isKy && (hanhCan === quanHanh || hanhChi === quanHanh)) s.add(1, 'Bát Tự: năm ' + CAN[L.can] + ' ' + CHI[L.chi] + ' mang hành ' + quanHanh + ' (Kỵ thần) khắc Nhật chủ');
  if (qhNgay.indexOf('lục xung') >= 0) s.add(0.6, 'Bát Tự: chi năm xung chi ngày sinh');
  var giai = ['Thiên Giải', 'Địa Giải', 'Giải Thần', 'Thiên Đức', 'Nguyệt Đức', 'Hóa Khoa', 'Thiên Y'].filter(function (n) { return goc(th, n) || goc(yTat, n); });
  if (giai.length) s.add(-Math.min(1.8, giai.length * 0.6), 'Có sao giải: ' + giai.join(', '));
  if (P[yTat].diem >= 2.5) s.add(-0.6, 'Cung Tật Ách năm (gốc ' + P[yTat].cung + ') vững');
  R.sucKhoe = s;

  /* ---------- TÀI CHÍNH ---------- */
  s = ddBo_();
  if (luu(yTai, 'Hóa Kỵ')) s.add(2.5, 'Lưu Hóa Kỵ nhập Tài Bạch năm (' + ten(yTai) + ') – tiền bạc vướng mắc, nợ nần');
  else if (luuTP('Hóa Kỵ')) s.add(1, 'Lưu Hóa Kỵ trong tam phương tiểu hạn');
  ['Kình Dương', 'Đà La'].forEach(function (n) { if (luu(yTai, n)) s.add(1.4, 'Lưu ' + n + ' nhập Tài Bạch năm – tranh chấp tiền bạc'); });
  ['Địa Không', 'Địa Kiếp'].forEach(function (n) {
    if (goc(yTai, n)) s.add(1.3, n + ' gốc tại Tài Bạch năm – dễ mất tiền đột ngột');
    else if (goc(th, n)) s.add(1, n + ' gốc tại cung tiểu hạn');
  });
  if (P[yTai].bacSi === 'Đại Hao' || P[th].bacSi === 'Đại Hao') s.add(1, 'Đại Hao tại ' + (P[th].bacSi === 'Đại Hao' ? 'tiểu hạn' : 'Tài năm') + ' – chi tiêu lớn');
  if (P[yTai].bacSi === 'Tiểu Hao') s.add(0.5, 'Tiểu Hao tại Tài năm');
  if (dvh(yTai, 'Hóa Kỵ')) s.add(1.3, 'Hóa Kỵ đại vận nhập Tài Bạch năm');
  if (ttCan === 'Kiếp Tài' || ttCan === 'Tỷ Kiên') s.add(bt.vuong ? 1.5 : 0.6, 'Bát Tự: năm ' + ttCan + (bt.vuong ? ' khi Nhật chủ đã vượng – "Tỷ Kiếp đoạt Tài"' : ''));
  if (isKy) s.add(0.6, 'Bát Tự: năm mang hành Kỵ thần (' + bt.goiY.ky.join(', ') + ')');
  if (luu(yTai, 'Lộc Tồn') || luu(yTai, 'Hóa Lộc')) s.add(-1.2, 'Có lưu Lộc tại Tài năm giữ lại nguồn thu');
  R.taiChinh = s;

  /* ---------- GIA ĐẠO ---------- */
  s = ddBo_();
  [[yPT, 'Phu Thê'], [yDien, 'Điền Trạch'], [yPM, 'Phụ Mẫu']].forEach(function (x) {
    var p = x[0];
    if (luu(p, 'Tang Môn')) s.add(1.4, 'Lưu Tang Môn nhập ' + x[1] + ' năm (' + ten(p) + ')');
    if (luu(p, 'Bạch Hổ')) s.add(1.4, 'Lưu Bạch Hổ nhập ' + x[1] + ' năm (' + ten(p) + ')');
    if (luu(p, 'Hóa Kỵ')) s.add(1.8, 'Lưu Hóa Kỵ nhập ' + x[1] + ' năm – bất hòa, lo lắng');
    if (luu(p, 'Thiên Khốc') || luu(p, 'Thiên Hư')) s.add(0.6, 'Lưu Khốc/Hư nhập ' + x[1] + ' năm');
    if (luu(p, 'Kình Dương') || luu(p, 'Đà La')) s.add(0.8, 'Lưu Kình/Đà nhập ' + x[1] + ' năm');
    if (dvh(p, 'Hóa Kỵ')) s.add(0.8, 'Hóa Kỵ đại vận nhập ' + x[1] + ' năm');
  });
  if (goc(th, 'Cô Thần') || goc(th, 'Quả Tú')) s.add(0.6, 'Cô Thần/Quả Tú tại tiểu hạn');
  if (qhNgay.indexOf('lục xung') >= 0) s.add(1.5, 'Bát Tự: chi năm xung chi ngày (cung phu thê) – dễ bất hòa, thay đổi chỗ ở');
  if (qhNgay.indexOf('lục hại') >= 0 || qhNgay.indexOf('tương hình') >= 0) s.add(0.7, 'Bát Tự: chi năm ' + qhNgay.join('/') + ' chi ngày');
  if (qhNam.indexOf('lục xung') >= 0) s.add(0.8, 'Bát Tự: chi năm xung chi năm sinh (tổ nghiệp, cha mẹ)');
  if (ttCan === 'Kiếp Tài' && male) s.add(0.6, 'Bát Tự: Kiếp Tài khắc Chính Tài (thê tinh của nam)');
  if (ttCan === 'Thương Quan' && !male) s.add(0.6, 'Bát Tự: Thương Quan khắc Chính Quan (phu tinh của nữ)');
  R.giaDao = s;

  /* ---------- KẾT HÔN ---------- */
  s = ddBo_();
  ['Hồng Loan', 'Thiên Hỷ'].forEach(function (n) {
    if (luu(th, n)) s.add(2.5, 'Lưu ' + n + ' tại cung tiểu hạn');
    else if (luu(yPT, n)) s.add(2.2, 'Lưu ' + n + ' nhập Phu Thê năm');
    else if (luuTP(n)) s.add(1.2, 'Lưu ' + n + ' chiếu tiểu hạn');
    if (goc(th, n)) s.add(1.8, n + ' gốc tại cung tiểu hạn – "hạn gặp Hồng Hỷ"');
  });
  if (goc(th, 'Đào Hoa')) s.add(1, 'Đào Hoa gốc tại cung tiểu hạn');
  if (goc(th, 'Long Trì') || goc(th, 'Phượng Các')) s.add(0.4, 'Long Trì/Phượng Các tại hạn – hỷ sự');
  if (P[th].cung === 'Phu Thê') s.add(1.8, 'Tiểu hạn đi vào cung Phu Thê gốc');
  if (P[L.chi].cung === 'Phu Thê') s.add(1.2, 'Lưu Thái Tuế đóng tại cung Phu Thê gốc');
  if (luu(yPT, 'Hóa Lộc') || luu(yPT, 'Hóa Khoa')) s.add(1, 'Lưu Hóa Lộc/Khoa nhập Phu Thê năm');
  var ptGoc = I.menh - 2; ptGoc = mod12(ptGoc);
  if (dvh(ptGoc, 'Hóa Lộc') || dvh(ptGoc, 'Hóa Khoa')) s.add(0.6, 'Tứ Hóa đại vận (Lộc/Khoa) nhập Phu Thê gốc – cả đại vận thuận duyên');
  if (qhNgay.indexOf('lục hợp') >= 0 || qhNgay.indexOf('tam hợp') >= 0) s.add(1.2, 'Bát Tự: chi năm ' + qhNgay.join('/') + ' với chi ngày (cung phu thê)');
  var phoi = male ? ['Chính Tài', 'Thiên Tài'] : ['Chính Quan', 'Thất Sát'];
  if (phoi.indexOf(ttCan) >= 0) s.add(ttCan === phoi[0] ? 1.8 : 1.3, 'Bát Tự: phối ngẫu tinh xuất hiện (' + ttCan + ' – ' + (male ? 'thê tinh' : 'phu tinh') + ')');
  else if (phoi.indexOf(ttChi) >= 0) s.add(0.8, 'Bát Tự: phối ngẫu tinh ẩn trong chi năm (' + ttChi + ')');
  if ([9, 6, 3, 0][chiNamSinh % 4] === L.chi || [9, 6, 3, 0][chiNgay % 4] === L.chi) s.add(0.8, 'Năm Đào Hoa theo tuổi/ngày sinh');
  if (luu(yPT, 'Hóa Kỵ')) s.add(-1.4, 'Lưu Hóa Kỵ ở Phu Thê năm – duyên trắc trở');
  if (goc(th, 'Cô Thần') || goc(th, 'Quả Tú')) s.add(-0.7, 'Cô/Quả tại hạn – khó thành đôi');
  R.ketHon = s;

  /* ---------- SINH CON ---------- */
  s = ddBo_();
  var ttGoc = mod12(I.menh - 3);
  if (th === ttGoc) s.add(2, 'Tiểu hạn đi vào cung Tử Tức gốc');
  if (L.chi === ttGoc) s.add(1, 'Lưu Thái Tuế đóng tại Tử Tức gốc');
  ['Thiên Hỷ', 'Hồng Loan'].forEach(function (n) {
    if (luu(yTT, n)) s.add(1.8, 'Lưu ' + n + ' nhập Tử Tức năm');
    else if (luu(ttGoc, n)) s.add(1.4, 'Lưu ' + n + ' nhập Tử Tức gốc');
  });
  if (P[th].trangSinh === 'Thai' || P[yTT].trangSinh === 'Thai') s.add(1.4, 'Sao Thai (vòng Tràng Sinh) tại ' + (P[th].trangSinh === 'Thai' ? 'tiểu hạn' : 'Tử Tức năm') + ' – dấu hiệu thai nghén');
  if (goc(th, 'Thiên Hỷ')) s.add(0.8, 'Thiên Hỷ gốc tại tiểu hạn');
  if (luu(yTT, 'Hóa Lộc') || luu(yTT, 'Hóa Khoa') || luu(ttGoc, 'Hóa Lộc')) s.add(0.9, 'Lưu Hóa Lộc/Khoa nhập Tử Tức');
  if (goc(yTT, 'Long Trì') || goc(yTT, 'Phượng Các')) s.add(0.4, 'Long Phượng ở Tử Tức năm');
  var tuTinh = male ? ['Chính Quan', 'Thất Sát'] : ['Thực Thần', 'Thương Quan'];
  if (tuTinh.indexOf(ttCan) >= 0) s.add(1.5, 'Bát Tự: tử tức tinh xuất hiện (' + ttCan + ')');
  else if (tuTinh.indexOf(ttChi) >= 0) s.add(0.7, 'Bát Tự: tử tức tinh ẩn trong chi năm (' + ttChi + ')');
  if (qhGio.indexOf('lục hợp') >= 0 || qhGio.indexOf('tam hợp') >= 0) s.add(1, 'Bát Tự: chi năm hợp chi giờ (cung tử tức)');
  if (qhGio.indexOf('lục xung') >= 0) s.add(-0.8, 'Bát Tự: chi năm xung chi giờ (cung tử tức)');
  if (goc(yTT, 'Địa Không') || goc(yTT, 'Địa Kiếp')) s.add(-1, 'Không/Kiếp tại Tử Tức năm');
  if (luu(yTT, 'Hóa Kỵ')) s.add(-1, 'Lưu Hóa Kỵ tại Tử Tức năm');
  R.sinhCon = s;

  /* ---------- TÀI LỘC ---------- */
  s = ddBo_();
  [['Hóa Lộc', 3, 1.5], ['Lộc Tồn', 2.5, 1]].forEach(function (x) {
    if (luu(th, x[0])) s.add(x[1], 'Lưu ' + x[0] + ' tại cung tiểu hạn');
    else if (luu(yTai, x[0])) s.add(x[1], 'Lưu ' + x[0] + ' nhập Tài Bạch năm (' + ten(yTai) + ')');
    else if (luuTP(x[0])) s.add(x[2], 'Lưu ' + x[0] + ' chiếu tiểu hạn');
  });
  [th, yTai].forEach(function (p) {
    var lu = luu(p, 'Hóa Lộc') || luu(p, 'Lộc Tồn');
    if (lu && (goc(p, 'Lộc Tồn') || goc(p, 'Hóa Lộc'))) s.add(1.5, 'Song Lộc: lưu Lộc gặp Lộc gốc tại ' + P[p].cung);
    if (lu && (luu(p, 'Thiên Mã') || goc(p, 'Thiên Mã'))) s.add(1.5, 'Lộc Mã giao trì tại ' + P[p].cung + ' – phát tài nhờ năng động');
  });
  if (dvh(yTai, 'Hóa Lộc') || dvh(th, 'Hóa Lộc')) s.add(1.3, 'Hóa Lộc đại vận chiếu Tài/hạn năm');
  if (luu(yTai, 'Hóa Quyền')) s.add(0.8, 'Lưu Hóa Quyền nhập Tài năm – chủ động nguồn tiền');
  s.add(Math.max(-1, Math.min(1.5, P[yTai].diem * 0.25)), 'Chất lượng cung Tài năm (gốc ' + P[yTai].cung + ': ' + (P[yTai].chinh.length ? lgSaoMoTa_(P[yTai]) : 'VCD') + ')');
  if (['Chính Tài', 'Thiên Tài'].indexOf(ttCan) >= 0) s.add(bt.vuong ? 1.5 : 0.4, 'Bát Tự: năm ' + ttCan + (bt.vuong ? ' – thân vượng gánh được tài' : ' – thân nhược, tài đến nhưng khó giữ'));
  if (isDung) s.add(1, 'Bát Tự: năm mang hành Dụng thần ' + bt.goiY.dung);
  if (luu(yTai, 'Hóa Kỵ')) s.add(-2, 'Lưu Hóa Kỵ tại Tài năm');
  if (goc(yTai, 'Địa Không') || goc(yTai, 'Địa Kiếp')) s.add(-0.8, 'Không/Kiếp gốc tại Tài năm');
  R.taiLoc = s;

  /* ---------- QUAN LỘC ---------- */
  s = ddBo_();
  [['Hóa Quyền', 2.5], ['Hóa Khoa', 2], ['Hóa Lộc', 1.4]].forEach(function (x) {
    if (luu(yQuan, x[0])) s.add(x[1], 'Lưu ' + x[0] + ' nhập Quan Lộc năm (' + ten(yQuan) + ')', 'tot');
    else if (luu(th, x[0])) s.add(x[1] * 0.7, 'Lưu ' + x[0] + ' tại tiểu hạn', 'tot');
  });
  if (luu(yQuan, 'Thiên Mã') || luu(th, 'Thiên Mã')) s.add(1.4, 'Lưu Thiên Mã tại ' + (luu(th, 'Thiên Mã') ? 'tiểu hạn' : 'Quan năm') + ' – điều chuyển, đổi việc');
  if (P[L.chi].cung === 'Quan Lộc') s.add(1.5, 'Lưu Thái Tuế đóng tại Quan Lộc gốc – năm công việc là tâm điểm');
  if (P[th].cung === 'Quan Lộc') s.add(1.8, 'Tiểu hạn đi vào Quan Lộc gốc');
  if (luu(yQuan, 'Kình Dương')) s.add(1, 'Lưu Kình Dương nhập Quan năm – cạnh tranh gay gắt', 'xau');
  if (luu(yQuan, 'Hóa Kỵ')) s.add(1.4, 'Lưu Hóa Kỵ nhập Quan năm – áp lực, thị phi công việc', 'xau');
  if (dvh(yQuan, 'Hóa Quyền') || dvh(yQuan, 'Hóa Khoa')) s.add(0.9, 'Quyền/Khoa đại vận nhập Quan năm', 'tot');
  var quy = ['Thiên Khôi', 'Thiên Việt', 'Tả Phù', 'Hữu Bật', 'Quốc Ấn', 'Thai Phụ', 'Phong Cáo'].filter(function (n) { return goc(yQuan, n); });
  if (quy.length) s.add(Math.min(1.5, quy.length * 0.5), 'Quý tinh gốc ở Quan năm: ' + quy.join(', '), 'tot');
  if (['Chính Quan', 'Thất Sát'].indexOf(ttCan) >= 0) s.add(1.2, 'Bát Tự: năm ' + ttCan + ' – ' + (ttCan === 'Chính Quan' ? 'chức vụ, trách nhiệm tăng' : 'áp lực, thử thách quyền lực'), ttCan === 'Chính Quan' ? 'tot' : 'xau');
  if (['Chính Ấn', 'Thiên Ấn'].indexOf(ttCan) >= 0) s.add(0.6, 'Bát Tự: năm Ấn – bằng cấp, được cấp trên nâng đỡ', 'tot');
  if (qhThang.indexOf('lục xung') >= 0) s.add(1, 'Bát Tự: chi năm xung chi tháng (môn hộ sự nghiệp) – thay đổi môi trường', 'xau');
  R.quanLoc = s;

  return {
    nam: Y, tuoi: tuoi, canChi: CAN[L.can] + ' ' + CHI[L.chi], th: th, cungTH: P[th].cung,
    daiHan: dh >= 0 ? P[dh].cung + ' ' + P[dh].daiHan + '–' + (P[dh].daiHan + 9) : '—', R: R
  };
}

/** Tổng hợp dự đoán cả đời */
function duDoanCuocDoi(chart, bt, input, daiVanList) {
  var I = chart.info, P = chart.palaces;
  // cache Tứ Hóa đại vận theo cung đại hạn
  var dvCache = {};
  for (var i = 0; i < 12; i++) {
    var hoa = {};
    for (var h = 0; h < 4; h++) {
      var sp = chart.pos[chart.tuHoa[P[i].can][h]];
      (hoa[sp] = hoa[sp] || []).push(HOA_TEN[h]);
    }
    dvCache[i] = { hoa: hoa };
  }
  var namNay = (input && parseInt(input.viewYear, 10)) || new Date().getFullYear();
  var years = [];
  for (var t = 1; t <= 90; t++) years.push(ddPhanTichNam_(chart, bt, I.lunar.year + t - 1, dvCache));

  var chuDe = {};
  Object.keys(DD_CHU_DE).forEach(function (cd) {
    var arr = years.map(function (y) {
      var r = y.R[cd];
      var hs = ddTuoiHeSo_(cd, y.tuoi);
      return {
        nam: y.nam, tuoi: y.tuoi, canChi: y.canChi, cungTH: y.cungTH, daiHan: y.daiHan,
        diem: Math.round(r.d * hs * 10) / 10, ly: r.ly, huong: cd === 'quanLoc' ? (r.tot >= r.xau ? 'thăng tiến' : 'biến động, áp lực') : '',
        qua: y.nam < namNay
      };
    });
    var sorted = arr.filter(function (x) { return x.diem > 0; }).slice().sort(function (a, b) { return b.diem - a.diem; });
    var nguong = sorted.length ? Math.max(2.5, sorted[Math.min(7, sorted.length - 1)].diem) : 2.5;
    var top = sorted.filter(function (x) { return x.diem >= nguong; }).slice(0, 10)
      .sort(function (a, b) { return a.nam - b.nam; });
    var sapToi = arr.filter(function (x) { return !x.qua && x.nam <= namNay + 15 && x.diem >= 2.5; })
      .sort(function (a, b) { return b.diem - a.diem; }).slice(0, 5).sort(function (a, b) { return a.nam - b.nam; });
    var maxD = arr.reduce(function (m, x) { return Math.max(m, x.diem); }, 0.1);
    chuDe[cd] = {
      key: cd, ten: DD_CHU_DE[cd].ten, icon: DD_CHU_DE[cd].icon, loai: DD_CHU_DE[cd].loai, coSo: DD_CHU_DE[cd].coSo,
      top: top, sapToi: sapToi,
      heat: arr.map(function (x) { return Math.round(Math.max(0, x.diem) / maxD * 100); })
    };
  });

  // Vận hạn lớn: xếp hạng đại vận + mốc giao vận
  var dv = daiVanList || lgDaiVan_(chart, bt);
  var sortedDV = dv.slice().filter(function (d) { return parseInt(d.khoang, 10) <= 85; }).sort(function (a, b) { return b.diem - a.diem; });
  var giaoVan = dv.map(function (d) {
    var y0 = parseInt(d.nam, 10);
    return { nam: y0, tuoi: parseInt(d.khoang, 10), cung: d.cung, danhGia: d.danhGia, diem: d.diem };
  }).filter(function (x) { return x.tuoi <= 85; });
  var bzGiao = (bt.daiVan || []).map(function (v) { return { nam: v.nam, canChi: v.canChi, danhGia: v.danhGia }; });

  var vanLon = {
    tot: sortedDV.slice(0, 3).map(function (d) { return ddTomTatDV_(d); }),
    xau: sortedDV.slice(-3).reverse().map(function (d) { return ddTomTatDV_(d); }),
    giaoVan: giaoVan, giaoVanBT: bzGiao,
    coSo: 'Vận hạn lớn được xếp theo điểm đại vận (sao cung hạn và tam phương, Tứ Hóa và Lộc – Kình – Đà đại vận, đối chiếu đại vận Bát Tự). Năm giao vận (đầu mỗi đại hạn/đại vận Bát Tự) thường là thời điểm chuyển hướng: công việc, chỗ ở hoặc quan hệ dễ thay đổi; hai năm cuối của một đại vận xấu thường đã bắt đầu "hé mở".'
  };

  return { chuDe: chuDe, vanLon: vanLon, namBatDau: I.lunar.year, namNay: namNay,
    ghiChu: 'Điểm là mức độ tương đối trong chính lá số này (so các năm với nhau), không phải xác suất. Nên đối chiếu các năm đã qua để hiệu chỉnh cảm nhận trước khi xem các năm tới.' };
}

function ddTomTatDV_(d) {
  var hoa = [], ly = [];
  d.secs.forEach(function (s) {
    if (s.tieuDe.indexOf('Tứ Hóa') === 0) hoa = s.items.slice(0, 4);
    if (s.tieuDe === 'Các lĩnh vực trong đại vận') ly = s.items;
  });
  return { khoang: d.khoang, nam: d.nam, cung: d.cung, canChi: d.canChi, sao: d.sao, diem: d.diem, danhGia: d.danhGia, hoa: hoa, linhVuc: ly };
}
