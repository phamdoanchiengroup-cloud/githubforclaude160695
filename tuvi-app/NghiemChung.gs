/**
 * ============================================================
 *  NghiemChung.gs — NGHIỆM CHỨNG LÁ SỐ (ĐỊNH BÀN)
 *  Sinh 8 đoạn mô tả để người dùng tự chấm, từ đó biết GIỜ SINH có đúng không.
 *  Nguyên tắc định bàn: giờ sinh đổi → cung Mệnh (Tử Vi), trụ giờ (Bát Tự) và cung Mọc
 *  (Chiêm tinh) đổi theo, kéo theo cả 12 cung. Vì vậy câu mô tả ưu tiên dựa trên các yếu tố
 *  ĐỔI THEO GIỜ: tướng mạo, tính cách, lục thân (cha mẹ, anh em, vợ chồng, con cái), sức khỏe.
 *  Thần số & Human Design gần như không đổi theo giờ → chỉ tham khảo, trọng số thấp.
 *  Hà Lạc không dùng ở đây.
 * ============================================================
 */

/* -------- BẢNG TRỌNG SỐ 6 HỆ THEO NHÓM -------- */
// Trọng số = hệ nào thực sự có câu trong đoạn và câu đó đổi theo GIỜ sinh đến đâu.
// Thần số & Human Design gần như không đổi theo giờ → chỉ giữ ở đoạn có câu của chúng (B, H), trọng số thấp.
var NC_TRONG_SO = {
  'A': { tuvi: 4, batu: 0, chiemtinh: 4, halac: 0, thanso: 0, hd: 0 },
  'B': { tuvi: 3, batu: 2, chiemtinh: 3, halac: 0, thanso: 0, hd: 1 },
  'C': { tuvi: 4, batu: 3, chiemtinh: 0, halac: 0, thanso: 0, hd: 0 },
  'D': { tuvi: 4, batu: 3, chiemtinh: 0, halac: 0, thanso: 0, hd: 0 },
  'E': { tuvi: 3, batu: 2, chiemtinh: 2, halac: 0, thanso: 0, hd: 0 },
  'F': { tuvi: 4, batu: 3, chiemtinh: 0, halac: 0, thanso: 0, hd: 0 },
  'G': { tuvi: 4, batu: 3, chiemtinh: 0, halac: 0, thanso: 0, hd: 0 },
  'H': { tuvi: 3, batu: 3, chiemtinh: 0, halac: 0, thanso: 1, hd: 1 }
};

var NC_MUC_DIEM = {
  'dung_het': 1.0,
  'dung_phan_lon': 0.75,
  'dung_mot_nua': 0.5,
  'sai_phan_lon': 0.25,
  'sai_hoan_toan': 0
};

var NC_MUC_TEN = {
  'dung_het': '✓ Đúng hết',
  'dung_phan_lon': '◐ Đúng phần lớn',
  'dung_mot_nua': '◑ Đúng một nửa',
  'sai_phan_lon': '◒ Sai phần lớn',
  'sai_hoan_toan': '✗ Sai hoàn toàn'
};

var NC_TEN_NHOM = {
  'A': 'Vóc dáng & cơ thể',
  'B': 'Tính cách',
  'C': 'Anh chị em',
  'D': 'Cha mẹ',
  'E': 'Sức khỏe & biến cố',
  'F': 'Hôn nhân',
  'G': 'Con cái',
  'H': 'Sự nghiệp'
};

/* -------- HÀM CHÍNH: LẬP NGHIỆM CHỨNG -------- */
function nghiemChungLap(input) {
  var tv = tuviLapLaSo(input);
  var bt = batTuLap(input);
  var ct = chiemTinhLap(input);
  var hl = haLacLap(bt, tv);
  var ts = thanSoHocLap(input, tv.info.solar, tv.info.viewYear);
  var hd = hdLap(ct.thoiDiem.jd);

  var D = { tv: tv, bt: bt, ct: ct, hl: hl, ts: ts, hd: hd, input: input };

  return {
    data: D,
    doan: [
      { ma: 'A', ten: NC_TEN_NHOM.A, text: sinhDoanNhomA_(D) },
      { ma: 'B', ten: NC_TEN_NHOM.B, text: sinhDoanNhomB_(D) },
      { ma: 'C', ten: NC_TEN_NHOM.C, text: sinhDoanNhomC_(D) },
      { ma: 'D', ten: NC_TEN_NHOM.D, text: sinhDoanNhomD_(D) },
      { ma: 'E', ten: NC_TEN_NHOM.E, text: sinhDoanNhomE_(D) },
      { ma: 'F', ten: NC_TEN_NHOM.F, text: sinhDoanNhomF_(D) },
      { ma: 'G', ten: NC_TEN_NHOM.G, text: sinhDoanNhomG_(D) },
      { ma: 'H', ten: NC_TEN_NHOM.H, text: sinhDoanNhomH_(D) }
    ]
  };
}

/* -------- TÍNH ĐIỂM KHỚP -------- */
function nghiemChungTinhDiem_(cauTraLoi) {
  var diemMax = 0, diemDuoc = 0;
  var chiTiet = [];
  var soDungCao = 0, soSai = 0;

  ['A','B','C','D','E','F','G','H'].forEach(function(ma) {
    var muc = cauTraLoi[ma];
    if (!muc || !NC_MUC_DIEM.hasOwnProperty(muc)) return;

    var ts = NC_TRONG_SO[ma];
    var tongTS = 0;
    Object.keys(ts).forEach(function(k) { tongTS += ts[k]; });

    var diem = NC_MUC_DIEM[muc];
    diemMax += tongTS;
    diemDuoc += diem * tongTS;

    if (muc === 'dung_het' || muc === 'dung_phan_lon') soDungCao++;
    if (muc === 'sai_phan_lon' || muc === 'sai_hoan_toan') soSai++;

    chiTiet.push({ ma: ma, ten: NC_TEN_NHOM[ma], muc: muc, mucTen: NC_MUC_TEN[muc], diem: diem, trongSo: tongTS });
  });

  var pct = diemMax > 0 ? Math.round(diemDuoc / diemMax * 100) : 0;

  var ketLuan, khuyen, mau, soNhom = chiTiet.length, tyLe = soNhom ? soDungCao / soNhom : 0;
  // Ngưỡng gốc: ≥ 6/8 nhóm "đúng cao" → xác nhận; 4–5/8 → có thể đúng. Quy ra tỷ lệ (≥ 75% / ≥ 50%) để người chỉ chấm 4–7 nhóm
  // vẫn được đánh giá công bằng, và đòi thêm % khớp tương ứng để kết luận không mâu thuẫn với con số hiển thị.
  if (tyLe >= 0.75 && pct >= 70) {
    ketLuan = 'XAC_NHAN';
    khuyen = 'Lá số của bạn RẤT KHỚP với giờ sinh đã nhập (' + soDungCao + '/' + soNhom + ' nhóm đúng cao). Yên tâm sử dụng.';
    mau = 'jade';
  } else if (tyLe >= 0.5 && pct >= 55) {
    ketLuan = 'CO_THE_DUNG';
    khuyen = 'Lá số CÓ THỂ ĐÚNG nhưng chưa hoàn toàn (' + soDungCao + '/' + soNhom + ' nhóm đúng cao). Bạn có thể tiếp tục, hoặc kiểm tra lại giờ sinh.';
    mau = 'gold';
  } else {
    ketLuan = 'CO_THE_SAI';
    khuyen = 'Lá số CHƯA KHỚP với giờ sinh (' + soDungCao + '/' + soNhom + ' nhóm đúng cao). Nên thử các giờ sinh lân cận để tìm giờ khớp nhất.';
    mau = 'coral';
  }

  return { pct: pct, ketLuan: ketLuan, khuyen: khuyen, mau: mau, soDungCao: soDungCao, soSai: soSai, chiTiet: chiTiet };
}

/* ============================================================
 *  NHÓM A — VÓC DÁNG & CƠ THỂ (v2 — hình tướng chính tinh theo độ sáng; cung Mọc)
 * ============================================================ */
// [khi sáng (miếu/vượng/đắc), khi tối (bình/hãm)]
var NC_HINH_SAO = {
  'Tử Vi': ['Vóc người đầy đặn, mặt vuông hoặc tròn, dáng đĩnh đạc.', 'Vóc người trung bình, hơi đậm.'],
  'Thiên Phủ': ['Vóc người đầy đặn, mặt vuông tròn, dễ tăng cân.', 'Vóc người trung bình, hơi đậm.'],
  'Thiên Cơ': ['Dáng cao gầy, mảnh khảnh, khó tăng cân.', 'Dáng nhỏ gầy, hay lo nên khó lên cân.'],
  'Thiên Lương': ['Dáng cao, thanh mảnh, trông chín chắn.', 'Dáng gầy, trông già dặn hơn tuổi.'],
  'Thái Dương': ['Vóc người đầy đặn, mặt vuông tròn, da hồng hào.', 'Vóc người trung bình, sắc mặt kém tươi.'],
  'Thái Âm': ['Vóc người đầy đặn, da trắng, nét thanh tú.', 'Dáng mảnh, da hơi xanh, nét buồn.'],
  'Vũ Khúc': ['Vóc người không cao nhưng rắn chắc, giọng nói vang.', 'Vóc người nhỏ, gầy nhưng dẻo dai.'],
  'Thất Sát': ['Vóc người vừa phải, rắn rỏi, mắt to sáng.', 'Vóc người nhỏ, gầy, cơ thể dễ có sẹo.'],
  'Liêm Trinh': ['Dáng cao, lộ xương, lông mày rậm.', 'Dáng gầy, góc cạnh, dễ có sẹo.'],
  'Phá Quân': ['Vóc người vạm vỡ, lưng dày, lông mày thưa.', 'Vóc người thấp, gầy, dễ có sẹo.'],
  'Tham Lang': ['Vóc người cao lớn, có sức hút.', 'Vóc người thấp, đậm.'],
  'Cự Môn': ['Vóc người đầy đặn, miệng rộng, nói nhiều.', 'Dáng gầy, nét mặt hay lo.'],
  'Thiên Tướng': ['Vóc người đầy đặn, cân đối, dung mạo đoan chính.', 'Vóc người trung bình, gọn gàng.'],
  'Thiên Đồng': ['Vóc người tròn đầy, mặt phúc hậu, trông trẻ.', 'Vóc người hơi mập, tay chân ngắn.']
};
function sinhDoanNhomA_(D) {
  var tv = D.tv, bt = D.bt, ct = D.ct;
  var P = tv.palaces, I = tv.info;
  var cau = [];
  /* TỬ VI: chính tinh tại Mệnh (VCD mượn cung xung chiếu). Hai sao khác dáng → mô tả trung dung. */
  var ds = P[I.menh].chinh, muon = false;
  if (!ds.length) { ds = P[(I.menh + 6) % 12].chinh; muon = true; }
  // chính tinh đứng đầu là sao chủ của cung → lấy hình tướng theo sao đó (tránh ghép hai mô tả trái nhau)
  var s0 = ds.filter(function (s) { return NC_HINH_SAO[s.n]; })[0];
  cau.push(s0 ? NC_HINH_SAO[s0.n][ncSang_(s0) && !muon ? 0 : 1] : 'Vóc người trung bình.');
  if (muon) cau.push('Mệnh không có chính tinh — dáng vẻ thay đổi theo từng giai đoạn, lúc nhỏ thường yếu hơn về sau.');

  // Không dùng hình tướng theo nhật chủ Bát Tự: không đổi theo giờ sinh và hay trái với Tử Vi/cung Mọc.

  /* CHIÊM TINH — cung Mọc đổi khoảng mỗi 2 giờ nên rất nhạy với giờ sinh */
  if (ct && ct.asc) {
    var moTaAsc = [
      'Dáng săn chắc, bước đi nhanh, trán cao.', 'Thân hình đầy đặn, cổ chắc, dễ tăng cân.', 'Dáng mảnh khảnh, linh hoạt, trông trẻ hơn tuổi.',
      'Mặt tròn, da sáng, dáng mềm.', 'Dáng đứng thẳng, vai rộng, tóc dày.', 'Dáng thanh mảnh, gọn gàng, trẻ lâu.',
      'Thân hình cân đối, nụ cười duyên.', 'Ánh mắt sâu, thần thái mạnh.', 'Dáng cao, chân dài.',
      'Xương gò má rõ, trông chín chắn.', 'Dáng cao, nét độc đáo.', 'Mắt to long lanh, nét mềm.'
    ];
    if (moTaAsc[ct.asc.cung]) cau.push('Chiêm tinh (cung Mọc): ' + moTaAsc[ct.asc.cung].charAt(0).toLowerCase() + moTaAsc[ct.asc.cung].slice(1));
  }
  return cau.join(' ');
}

/* -------- BẢNG SỐ LƯỢNG THEO CHÍNH TINH (Tử Vi Đẩu Số Toàn Thư – bản lưu truyền) --------
 * [sáng (miếu/vượng/đắc), tối (bình/hãm)] = [min, max]. Sách cổ đếm theo "nhân khẩu" thời xưa;
 * ngày nay số người thường ít hơn → chỉ dùng như xu hướng NHIỀU / VỪA / ÍT. */
var NC_SO_ANH_EM = {
  'Tử Vi': [[3, 4], [2, 3]], 'Thiên Cơ': [[2, 3], [1, 1]], 'Thái Dương': [[3, 4], [2, 2]], 'Vũ Khúc': [[2, 2], [1, 1]],
  'Thiên Đồng': [[4, 5], [2, 3]], 'Liêm Trinh': [[2, 2], [1, 1]], 'Thiên Phủ': [[4, 5], [3, 4]], 'Thái Âm': [[4, 5], [2, 3]],
  'Tham Lang': [[3, 3], [1, 2]], 'Cự Môn': [[2, 3], [1, 2]], 'Thiên Tướng': [[2, 3], [2, 2]], 'Thiên Lương': [[2, 3], [1, 2]],
  'Thất Sát': [[2, 3], [1, 1]], 'Phá Quân': [[2, 3], [1, 2]]
};
var NC_SO_CON = {
  'Tử Vi': [[3, 3], [2, 2]], 'Thiên Cơ': [[1, 2], [1, 1]], 'Thái Dương': [[3, 3], [1, 2]], 'Vũ Khúc': [[1, 2], [1, 1]],
  'Thiên Đồng': [[3, 5], [2, 2]], 'Liêm Trinh': [[1, 2], [1, 1]], 'Thiên Phủ': [[3, 5], [2, 3]], 'Thái Âm': [[3, 5], [1, 2]],
  'Tham Lang': [[2, 3], [1, 1]], 'Cự Môn': [[2, 3], [1, 2]], 'Thiên Tướng': [[2, 3], [1, 2]], 'Thiên Lương': [[2, 3], [1, 2]],
  'Thất Sát': [[1, 2], [1, 1]], 'Phá Quân': [[2, 3], [1, 2]]
};
var NC_LUC_SAT = ['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh', 'Địa Không', 'Địa Kiếp'];
function ncSang_(s) { return s.b === 'M' || s.b === 'V' || s.b === 'Đ'; }
/** Ước lượng khoảng số người từ chính tinh của cung (VCD mượn cung xung chiếu, giảm 1). Có ≥2 sát tinh → giảm 1. */
function ncUocSo_(P, pi, bang) {
  var cung = P[pi], chinh = cung.chinh, muon = false;
  if (!chinh.length) { chinh = P[(pi + 6) % 12].chinh; muon = true; }
  var lo = 0, hi = 0, n = 0;
  chinh.forEach(function (s) { var t = bang[s.n]; if (!t) return; var r = t[ncSang_(s) ? 0 : 1]; lo += r[0]; hi += r[1]; n++; });
  if (!n) return null;
  lo = Math.round(lo / n); hi = Math.round(hi / n);
  var ten = [].concat(cung.chinh, cung.cat, cung.hung, cung.tieu).map(function (s) { return s.n; });
  var sat = NC_LUC_SAT.filter(function (x) { return ten.indexOf(x) >= 0; }).length;
  var giam = (muon ? 1 : 0) + (sat >= 2 ? 1 : 0) + (cung.tuan || cung.triet ? 1 : 0);
  lo = Math.max(0, lo - giam); hi = Math.max(1, hi - giam); if (lo > hi) lo = hi;
  return { lo: lo, hi: hi, muon: muon, sat: sat, ten: ten };
}
function ncKhoang_(u) { return u.lo === u.hi ? String(u.hi) : u.lo + '–' + u.hi; }

/* ============================================================
 *  NHÓM C — ANH CHỊ EM (v3 — bảng số theo sách cổ + độ sáng + sát tinh)
 * ============================================================ */
function sinhDoanNhomC_(D) {
  var tv = D.tv, bt = D.bt;
  var P = tv.palaces;
  var cau = [];
  var pi = -1;
  for (var i = 0; i < 12; i++) if (P[i].cung === 'Huynh Đệ') { pi = i; break; }
  if (pi < 0) return '';
  var HD = P[pi], u = ncUocSo_(P, pi, NC_SO_ANH_EM);
  var chinh = (HD.chinh.length ? HD.chinh : P[(pi + 6) % 12].chinh).map(function (s) { return s.n; });

  if (u) {
    var muc = u.hi >= 4 ? 'đông anh chị em' : u.hi >= 2 ? 'số anh chị em vừa phải' : 'ít anh chị em';
    cau.push('Gia đình bạn thuộc dạng ' + muc + ' (sách cổ ước khoảng ' + ncKhoang_(u) + ' người, tính cả những lần mang thai không thành).');
  }
  // Tính chất quan hệ
  if (chinh.indexOf('Cự Môn') >= 0) cau.push('Anh em dễ bất đồng, hay tranh luận, mỗi người một ý.');
  else if (chinh.indexOf('Thiên Phủ') >= 0 || chinh.indexOf('Thiên Tướng') >= 0 || chinh.indexOf('Thiên Đồng') >= 0) cau.push('Anh em hòa thuận, có thể nâng đỡ nhau.');
  else if (chinh.indexOf('Tử Vi') >= 0) cau.push('Trong anh em có người khá giả hoặc có vị thế, là chỗ dựa được.');
  else if (chinh.indexOf('Thất Sát') >= 0 || chinh.indexOf('Phá Quân') >= 0 || chinh.indexOf('Liêm Trinh') >= 0) cau.push('Anh em mỗi người mỗi ngả, cá tính mạnh, ít nương tựa nhau.');
  else if (chinh.indexOf('Thiên Cơ') >= 0 || chinh.indexOf('Thiên Lương') >= 0) cau.push('Anh em hiền lành, có học, quan hệ tốt nhưng không ồn ào.');
  if (u && u.sat >= 2) cau.push('Có lúc xa cách hoặc va chạm với anh em.');
  if (u && u.ten.indexOf('Hóa Kỵ') >= 0) cau.push('Dễ có hiểu lầm hoặc chuyện tiền bạc với anh em.');
  if (HD.tuan || HD.triet) cau.push('Có giai đoạn anh em sống xa nhau hoặc ít liên lạc.');

  /* BÁT TỰ — Tỷ Kiên/Kiếp Tài là sao anh em */
  var soTyKiep = 0;
  bt.pillars.forEach(function (p, i) {
    if (i !== 2 && (p.thapThan === 'Tỷ Kiên' || p.thapThan === 'Kiếp Tài')) soTyKiep++;
    p.tangCan.forEach(function (t) { if (t.thapThan === 'Tỷ Kiên' || t.thapThan === 'Kiếp Tài') soTyKiep += 0.5; });
  });
  if (soTyKiep >= 2.5) cau.push('Bát Tự: sao anh em (Tỷ Kiếp) mạnh — đông anh em hoặc bạn bè thân như anh em, nhưng dễ cạnh tranh.');
  else if (soTyKiep >= 1) cau.push('Bát Tự: sao anh em ở mức vừa — anh em có qua lại, mỗi người tự lo.');
  else cau.push('Bát Tự: sao anh em yếu — ít anh em hoặc ít nhờ được anh em, phải tự lập sớm.');
  return cau.join(' ');
}

/* ============================================================
 *  NHÓM D — CHA MẸ (v2 — hạ ngưỡng sát tinh, thêm Bệnh Phù/Thiên Y)
 * ============================================================ */
function sinhDoanNhomD_(D) {
  var tv = D.tv, bt = D.bt;
  var P = tv.palaces, I = tv.info;
  var cau = [];
  var pi = -1;
  for (var i = 0; i < 12; i++) if (P[i].cung === 'Phụ Mẫu') { pi = i; break; }
  if (pi < 0) return '';

  var PM = P[pi];
  var dsSao = [].concat(PM.chinh, PM.cat, PM.hung, PM.tieu).map(function(s){ return s.n; });

  var satNang = [];
  ['Thiên Riêu','Thiên Hư','Phục Binh','Tuế Phá','Tang Môn','Thiên Khốc',
   'Kình Dương','Đà La','Hỏa Tinh','Linh Tinh','Địa Không','Địa Kiếp',
   'Hóa Kỵ','Thiên Hình','Bệnh Phù'].forEach(function(s) {
    if (dsSao.indexOf(s) >= 0) satNang.push(s);
  });

  var coThienY = dsSao.indexOf('Thiên Y') >= 0;
  var coBenh = dsSao.indexOf('Bệnh Phù') >= 0 ||
                dsSao.indexOf('Thiên Riêu') >= 0 ||
                dsSao.indexOf('Thiên Hư') >= 0;

  /* --- Xếp loại theo ngưỡng mới --- */
  if (satNang.length >= 3 || (satNang.length >= 2 && (coThienY || coBenh))) {
    cau.push('Cha mẹ thuộc mẫu người vất vả, kinh tế khó khăn, không có địa vị xã hội cao.');
    if (dsSao.indexOf('Hỏa Tinh') >= 0 || dsSao.indexOf('Linh Tinh') >= 0 ||
        dsSao.indexOf('Kình Dương') >= 0 || dsSao.indexOf('Đà La') >= 0) {
      cau.push('Gia đình có lúc căng thẳng, cha mẹ hay cãi vã — đặc biệt giai đoạn bạn nhỏ.');
    }
    if (dsSao.indexOf('Thiên Riêu') >= 0 || dsSao.indexOf('Thiên Hư') >= 0 || coBenh) {
      cau.push('Có chuyện buồn hoặc bệnh tật ẩn trong gia đình.');
    }
    if (coThienY) {
      cau.push('Có dấu hiệu liên quan đến y dược — thường là cha mẹ hay gặp bác sĩ, có bệnh cần chữa.');
    }
  } else if (satNang.length >= 1) {
    cau.push('Cha mẹ ở mức trung bình — vất vả vừa phải, không quá khó khăn.');
    if (coThienY) cau.push('Có dấu hiệu liên quan đến y dược — cha mẹ hay gặp bác sĩ.');
  } else {
    var saoCM = PM.chinh.map(function(s){ return s.n; });
    if (saoCM.indexOf('Tử Vi') >= 0 || saoCM.indexOf('Thiên Phủ') >= 0) cau.push('Cha mẹ có uy tín, khá giả.');
    else if (saoCM.indexOf('Thiên Lương') >= 0) cau.push('Cha mẹ hiền hậu, che chở con cái.');
    else if (saoCM.indexOf('Thái Dương') >= 0) cau.push('Cha thành đạt, mẹ hiền.');
    else cau.push('Cha mẹ ở mức bình thường.');
  }

  if (PM.tuan || PM.triet) cau.push('Tuần/Triệt tại Phụ Mẫu — tuổi thơ có thể thiếu thốn, cha mẹ vất vả.');

  /* --- Bát Tự --- */
  var soTai = 0, soAn = 0;
  bt.pillars.forEach(function(p) {
    if (p.thapThan === 'Chính Tài' || p.thapThan === 'Thiên Tài') soTai++;
    if (p.thapThan === 'Chính Ấn' || p.thapThan === 'Thiên Ấn') soAn++;
    p.tangCan.forEach(function(t) {
      if (t.thapThan === 'Chính Tài' || t.thapThan === 'Thiên Tài') soTai += 0.5;
      if (t.thapThan === 'Chính Ấn' || t.thapThan === 'Thiên Ấn') soAn += 0.5;
    });
  });
  if (soTai < 1) cau.push('Bát Tự: sao cha (Tài) yếu — ít gần cha, hoặc cha vất vả, bận rộn.');
  if (soAn < 1) cau.push('Bát Tự: sao mẹ (Ấn) yếu — mẹ vất vả, hoặc bạn tự lập sớm, ít được bao bọc.');

  /* --- Nhật Nguyệt --- */
  var pos = tv.pos;
  var nhat = P[pos['Thái Dương']].chinh.filter(function(s){ return s.n === 'Thái Dương'; })[0];
  var nguyet = P[pos['Thái Âm']].chinh.filter(function(s){ return s.n === 'Thái Âm'; })[0];
  if (nhat && nhat.b === 'H') cau.push('Thái Dương hãm — hình ảnh người cha mờ nhạt, cha vất vả.');
  if (nguyet && nguyet.b === 'H') cau.push('Thái Âm hãm — mẹ có giai đoạn sức khỏe yếu.');

  return cau.join(' ');
}

/* ============================================================
 *  NHÓM B — TÍNH CÁCH (v3 — "việc nhỏ quyết, việc lớn lưỡng lự")
 * ============================================================ */
function sinhDoanNhomB_(D) {
  var tv = D.tv, bt = D.bt, ct = D.ct, hd = D.hd;
  var P = tv.palaces, I = tv.info;
  var chinhM = P[I.menh].chinh;
  var saoM = chinhM.map(function(s){ return s.n; });
  var cau = [];

  /* --- Tầng 1: nét tính cách nền --- */
  var net = [];
  if (saoM.indexOf('Tử Vi') >= 0) net.push('tự trọng cao, có uy tự nhiên');
  if (saoM.indexOf('Thiên Cơ') >= 0) net.push('thông minh, giỏi phân tích');
  if (saoM.indexOf('Thiên Lương') >= 0) net.push('nhân hậu, hay giúp người');
  if (saoM.indexOf('Thái Âm') >= 0) net.push('tinh tế, giàu cảm xúc, kín đáo');
  if (saoM.indexOf('Cự Môn') >= 0) net.push('sắc sảo, khẩu tài tốt');
  if (saoM.indexOf('Thiên Tướng') >= 0) net.push('sống đúng mực, chu đáo');
  if (saoM.indexOf('Tham Lang') >= 0) net.push('đa tài, giao tiếp khéo');
  if (saoM.indexOf('Vũ Khúc') >= 0) net.push('thực tế, chắc chắn');
  if (saoM.indexOf('Thiên Đồng') >= 0) net.push('hiền hòa, lạc quan, dễ tính');
  if (saoM.indexOf('Liêm Trinh') >= 0) net.push('sống nguyên tắc, đúng mực');
  if (saoM.indexOf('Thái Dương') >= 0) net.push('sáng sủa, nhiệt tình');
  if (net.length) cau.push('Bạn thuộc mẫu người ' + net.join(', ') + '.');

  /* --- Tầng 2: "quyết đoán" CHỈ khi có sao dương tính mạnh --- */
  var dsSao = [].concat(P[I.menh].chinh, P[I.menh].cat, P[I.menh].hung).map(function(s){ return s.n; });
  var coQuyetDoan = (
    saoM.indexOf('Thất Sát') >= 0 ||
    saoM.indexOf('Phá Quân') >= 0 ||
    saoM.indexOf('Kình Dương') >= 0 ||
    dsSao.indexOf('Hóa Quyền') >= 0
  );

  /* --- Tầng 3: "lưỡng lự việc lớn" — nhận diện riêng --- */
  var coLuongLu = (
    saoM.indexOf('Thiên Cơ') >= 0 ||
    saoM.indexOf('Thiên Đồng') >= 0 ||
    saoM.indexOf('Thái Âm') >= 0 ||
    saoM.indexOf('Thiên Lương') >= 0
  );   // bỏ VCD / Tuần-Triệt / Liêm Trinh / Thiên Tướng: khiến câu này đúng với >60% lá số, mất tính phân biệt

  /* --- Kết hợp 2 tín hiệu --- */
  if (coQuyetDoan && coLuongLu) {
    cau.push('Với việc nhỏ thì khá nhanh nhẹn, quyết đoán. Nhưng khi phải quyết việc lớn, bạn thường cân nhắc nhiều lần, đôi khi lưỡng lự — cần thời gian mới dám chốt.');
  } else if (coQuyetDoan) {
    cau.push('Cá tính mạnh, quyết đoán, dám nghĩ dám làm.');
  } else if (coLuongLu) {
    cau.push('Bề ngoài có vẻ điềm tĩnh, nhưng khi phải quyết việc lớn thì hay cân nhắc nhiều lần, đôi khi lưỡng lự — cần thời gian mới dám chốt.');
  }

  /* --- Phụ tinh --- */
  if (dsSao.indexOf('Hóa Khoa') >= 0) cau.push('Có duyên học vấn, gặp khó có người giải.');
  if (dsSao.indexOf('Hóa Lộc') >= 0) cau.push('Dễ được lòng người.');
  if (dsSao.indexOf('Hóa Kỵ') >= 0) cau.push('Dễ bị hiểu lầm, cần kiên nhẫn.');
  if (dsSao.indexOf('Cô Thần') >= 0 || dsSao.indexOf('Quả Tú') >= 0) cau.push('Ưa độc lập, đôi khi cô đơn.');
  if (dsSao.indexOf('Hồng Loan') >= 0) cau.push('Duyên dáng, dễ được yêu mến.');

  /* --- Bát Tự --- */
  var ttCount = {};
  bt.pillars.forEach(function(p, i) {
    if (i !== 2) ttCount[p.thapThan] = (ttCount[p.thapThan] || 0) + 1;
    ttCount[p.tangCan[0].thapThan] = (ttCount[p.tangCan[0].thapThan] || 0) + 0.8;
  });
  var ttMax = Object.keys(ttCount).sort(function(a,b){ return ttCount[b] - ttCount[a]; })[0];
  if (ttMax) {
    var yn = String(THAP_THAN_Y_NGHIA[ttMax] || '').split(/,\s*/).filter(function (x) { return I.male ? !/\(nữ\)/.test(x) : !/\(nam\)/.test(x); })
      .map(function (x) { return x.replace(/\s*\((nam|nữ)\)/, ''); }).join(', ');
    cau.push('Bát Tự: nổi bật năng lượng ' + ttMax + (yn ? ' — ' + yn : '') + '.');
  }

  /* --- Chiêm tinh --- */
  if (ct && ct.by) {
    var moTaSun = [
      'Sun Bạch Dương: bản ngã chiến binh, dám nghĩ dám làm.',
      'Sun Kim Ngưu: bản ngã người xây dựng, kiên nhẫn, thực tế.',
      'Sun Song Tử: bản ngã người đưa tin, thông minh, đa tài.',
      'Sun Cự Giải: bản ngã người che chở, giàu tình thương.',
      'Sun Sư Tử: bản ngã vị vua, hào phóng, cần tỏa sáng.',
      'Sun Xử Nữ: bản ngã người thợ cả, phân tích, cầu toàn.',
      'Sun Thiên Bình: bản ngã nhà ngoại giao, duyên dáng, ngại va chạm.',
      'Sun Bọ Cạp: bản ngã người chuyển hóa, sâu sắc.',
      'Sun Nhân Mã: bản ngã nhà thám hiểm, tự do, lạc quan.',
      'Sun Ma Kết: bản ngã người leo núi, kỷ luật, bền bỉ.',
      'Sun Bảo Bình: bản ngã nhà cải cách, độc đáo.',
      'Sun Song Ngư: bản ngã nghệ sĩ, thấu cảm, mơ mộng.'
    ];
    if (moTaSun[ct.by.sun.cung]) cau.push(moTaSun[ct.by.sun.cung].replace(/^Sun /, 'Mặt Trời '));
  }
  if (ct && ct.asc) {
    var moTaAscB = ['xông xáo, thẳng thắn', 'điềm đạm, chắc chắn', 'nhanh nhẹn, hoạt ngôn', 'dịu dàng, dè dặt',
      'tự tin, đường hoàng', 'chỉn chu, khiêm tốn', 'hòa nhã, lịch thiệp', 'kín đáo, khó đoán', 'cởi mở, vui vẻ',
      'nghiêm túc, chững chạc', 'thân thiện nhưng giữ khoảng cách', 'mơ màng, dễ gần'];
    if (moTaAscB[ct.asc.cung]) cau.push('Cung Mọc: lần đầu gặp, người khác thấy bạn ' + moTaAscB[ct.asc.cung] + '.');
  }

  /* --- Human Design --- */
  if (hd && hd.loai) {
    var moTaHD = {
      'Generator': 'Bạn là Người Kiến Tạo — sinh lực bền bỉ, thành công khi làm điều mình thực sự thích.',
      'Manifesting Generator': 'Bạn là Người Kiến Tạo Biểu Hiện — nhanh, đa nhiệm, hay nhảy bước.',
      'Manifestor': 'Bạn là Người Khởi Xướng — mở đường, tác động mạnh.',
      'Projector': 'Bạn là Người Dẫn Dắt — nhìn thấu hệ thống, hướng dẫn người khác.',
      'Reflector': 'Bạn là Người Phản Chiếu — tấm gương của cộng đồng.'
    };
    if (moTaHD[hd.loai]) cau.push(moTaHD[hd.loai]);
  }
  return cau.join(' ');
}

/* ============================================================
 *  NHÓM E — SỨC KHỎE (v4 — chấm điểm hung/giải tinh thay vì "có 1 sao xấu là trung bình")
 * ============================================================ */
var NC_TANG_SAO = {
  'Tử Vi': 'dạ dày, tiêu hóa', 'Thiên Phủ': 'dạ dày, tiêu hóa', 'Thiên Lương': 'dạ dày, tiêu hóa',
  'Thiên Cơ': 'gan, thần kinh, tay chân', 'Thái Dương': 'mắt, tim, huyết áp, đầu', 'Liêm Trinh': 'máu, tim, cơ quan sinh sản',
  'Vũ Khúc': 'phổi, hô hấp, xương', 'Thất Sát': 'phổi, xương, dễ thương tích', 'Thiên Đồng': 'thận, bàng quang, tai',
  'Thái Âm': 'thận, mắt, nội tiết', 'Tham Lang': 'gan, thận, sinh dục', 'Cự Môn': 'miệng, răng, dạ dày',
  'Thiên Tướng': 'da, bàng quang', 'Phá Quân': 'thận, máu, dễ hao tổn'
};
var NC_TANG_HANH = { 'Kim': 'phổi, hô hấp, da', 'Mộc': 'gan, mật', 'Thủy': 'thận, tiết niệu', 'Hỏa': 'tim, huyết áp', 'Thổ': 'dạ dày, tiêu hóa' };
function sinhDoanNhomE_(D) {
  var tv = D.tv, bt = D.bt, ct = D.ct;
  var P = tv.palaces, I = tv.info;
  var cau = [];
  var pi = -1;
  for (var i = 0; i < 12; i++) if (P[i].cung === 'Tật Ách') { pi = i; break; }
  if (pi < 0) return '';
  var TA = P[pi];
  var ten = [].concat(TA.chinh, TA.cat, TA.hung, TA.tieu).map(function (s) { return s.n; });
  function co(x) { return ten.indexOf(x) >= 0; }
  var nang = ['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh', 'Địa Không', 'Địa Kiếp', 'Hóa Kỵ', 'Thiên Hình'].filter(co);
  var nhe = ['Bệnh Phù', 'Thiên Hư', 'Thiên Riêu', 'Tang Môn', 'Thiên Khốc'].filter(co);
  var giai = ['Thiên Giải', 'Địa Giải', 'Giải Thần', 'Thiên Quan', 'Thiên Phúc', 'Hóa Khoa', 'Thiên Đức', 'Nguyệt Đức', 'Thiên Y'].filter(co);
  var d = nang.length + nhe.length * 0.5 - giai.length * 0.5;
  if (TA.tuan || TA.triet) d -= 0.5;   // Tuần/Triệt ở Tật Ách chặn bớt hung tinh (quan điểm phổ biến)
  var menh = [].concat(P[I.menh].chinh, P[I.menh].cat, P[I.menh].hung).map(function (s) { return s.n; });
  if (['Kình Dương', 'Đà La', 'Thiên Hình', 'Hóa Kỵ', 'Địa Không', 'Địa Kiếp'].some(function (x) { return menh.indexOf(x) >= 0; })) d += 0.5;

  if (d >= 2.5) {
    cau.push('Sức khỏe có giai đoạn yếu rõ rệt, từng ốm nặng hoặc gặp biến cố về thân thể.');
    if (co('Thiên Hình') || co('Kình Dương')) cau.push('Có dấu hiệu từng phải can thiệp y tế (mổ, khâu) hoặc có sẹo.');
  } else if (d >= 1) {
    cau.push('Sức khỏe nhìn chung ổn nhưng có một hai bệnh hay tái lại, cần theo dõi.');
    if (co('Bệnh Phù') || co('Thiên Hư')) cau.push('Hay mệt vặt, bệnh âm ỉ khi làm việc quá sức.');
  } else {
    cau.push('Sức khỏe nền tảng khá tốt, ít ốm vặt' + (giai.length ? ', gặp bệnh thường gặp thầy gặp thuốc' : '') + '.');
  }
  var chinh = (TA.chinh.length ? TA.chinh : P[(pi + 6) % 12].chinh).map(function (s) { return s.n; });
  var tang = chinh.map(function (x) { return NC_TANG_SAO[x]; }).filter(Boolean);
  if (tang.length) cau.push('Tử Vi: bộ phận cần chú ý là ' + tang.join('; ') + '.');

  /* BÁT TỰ — hành khuyết (<5%) hoặc quá vượng (>35%) mới nêu; nhật chủ yếu thì tạng của chính nó yếu */
  if (bt.phanTram) {
    var yeu = [], du = [];
    ['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'].forEach(function (h) {
      if (bt.phanTram[h] < 5) yeu.push(h); else if (bt.phanTram[h] > 35) du.push(h);
    });
    if (yeu.length) cau.push('Bát Tự: thiếu hành ' + yeu.join(', ') + ' — dễ yếu ở ' + yeu.map(function (h) { return NC_TANG_HANH[h]; }).join('; ') + '.');
    if (du.length) cau.push('Bát Tự: hành ' + du.join(', ') + ' quá mạnh — dễ quá tải ở ' + du.map(function (h) { return NC_TANG_HANH[h]; }).join('; ') + '.');
    if (!bt.vuong && NC_TANG_HANH[bt.nhatChuHanh] && yeu.indexOf(bt.nhatChuHanh) < 0) cau.push('Nhật chủ ' + bt.nhatChuHanh + ' hơi yếu — chú ý ' + NC_TANG_HANH[bt.nhatChuHanh] + '.');
  }
  if (ct && ct.asc) {
    var coQuan = ['đầu, não', 'cổ họng, tuyến giáp', 'phổi, vai, tay', 'ngực, dạ dày', 'tim, lưng', 'ruột, tiêu hóa',
      'thận, thắt lưng', 'cơ quan sinh dục, bài tiết', 'hông, đùi, gan', 'đầu gối, xương, răng', 'bắp chân, mắt cá, tuần hoàn', 'bàn chân, hệ miễn dịch'];
    if (coQuan[ct.asc.cung]) cau.push('Chiêm tinh (cung Mọc): vùng nhạy cảm là ' + coQuan[ct.asc.cung] + '.');
  }
  return cau.join(' ');
}
/* ============================================================
 *  NHÓM F — HÔN NHÂN (v2 — Cự+Nhật cùng cung = kín đáo)
 * ============================================================ */
function sinhDoanNhomF_(D) {
  var tv = D.tv, bt = D.bt;
  var P = tv.palaces, I = tv.info;
  var cau = [];
  var pi = -1;
  for (var i = 0; i < 12; i++) if (P[i].cung === 'Phu Thê') { pi = i; break; }
  if (pi < 0) return '';

  var PT = P[pi];
  var chinh = PT.chinh.map(function(s){ return s.n; });
  var dsSao = [].concat(PT.chinh, PT.cat, PT.hung, PT.tieu).map(function(s){ return s.n; });

  /* --- Ưu tiên 1: Cự Môn + Thái Dương cùng cung --- */
  var coCuNhat = (chinh.indexOf('Cự Môn') >= 0 && chinh.indexOf('Thái Dương') >= 0);

  if (!chinh.length) {
    var xc = P[(pi + 6) % 12];
    var saoDoi = xc.chinh.map(function(s){ return s.n; });
    if (saoDoi.indexOf('Thiên Cơ') >= 0 || saoDoi.indexOf('Thiên Lương') >= 0) {
      cau.push('Bạn đời thuộc mẫu người hiền lành, đàng hoàng, có học thức.');
      cau.push('Tình cảm bền nhưng không ồn ào — quan tâm nhau bằng hành động.');
    } else if (saoDoi.indexOf('Tử Vi') >= 0 || saoDoi.indexOf('Thiên Phủ') >= 0) {
      cau.push('Bạn đời chín chắn, có thể hơn tuổi hoặc trưởng thành hơn bạn.');
    } else if (saoDoi.indexOf('Thái Âm') >= 0 || saoDoi.indexOf('Thiên Đồng') >= 0) {
      cau.push('Bạn đời dịu dàng, hơi hướng nội, chăm lo gia đình.');
    } else {
      cau.push('Hôn nhân ở mức trung bình — cần vun đắp.');
    }
  } else if (coCuNhat) {
    cau.push('Bạn đời có vẻ ngoài sáng sủa, giao tiếp tốt, nhưng nội tâm kín đáo, ít chia sẻ chuyện riêng.');
    cau.push('Cần chủ động hỏi han, tạo không gian an toàn để bạn đời mở lòng.');
  } else if (chinh.indexOf('Thiên Đồng') >= 0 || chinh.indexOf('Thái Âm') >= 0) {
    cau.push('Bạn đời dịu dàng, tinh tế, hơi hướng nội, chăm lo gia đình.');
  } else if (chinh.indexOf('Cự Môn') >= 0) {
    cau.push('Bạn đời sắc sảo, kín đáo, ít nói khi ở nhà.');
  } else if (chinh.indexOf('Thiên Phủ') >= 0) {
    cau.push('Bạn đời đảm đang, chín chắn, biết lo toan.');
  } else if (chinh.indexOf('Vũ Khúc') >= 0) {
    cau.push('Bạn đời cương nghị, thực tế, ít nói lời tình cảm.');
  } else if (chinh.indexOf('Tử Vi') >= 0) {
    cau.push('Bạn đời có uy, tự trọng cao, thích được tôn trọng.');
  } else if (chinh.indexOf('Thiên Tướng') >= 0) {
    cau.push('Bạn đời chính trực, đàng hoàng, chu đáo.');
  } else if (chinh.indexOf('Thiên Lương') >= 0) {
    cau.push('Bạn đời lớn tuổi hơn hoặc chín chắn, hay giúp người.');
  } else if (chinh.indexOf('Thiên Cơ') >= 0) {
    cau.push('Bạn đời thông minh, nhiều ý tưởng, đôi khi hay lo.');
  } else if (chinh.indexOf('Thái Dương') >= 0) {
    cau.push('Bạn đời hướng ngoại, nhiệt tình.');
  } else if (chinh.indexOf('Tham Lang') >= 0) {
    cau.push('Bạn đời có sức hút, đa tài.');
  } else if (chinh.indexOf('Thất Sát') >= 0 || chinh.indexOf('Phá Quân') >= 0) {
    cau.push('Bạn đời cá tính mạnh, hôn nhân có sóng gió.');
  } else {
    cau.push('Bạn đời tính tình ở mức trung bình, hôn nhân ổn định.');
  }

  /* --- Sát tinh --- */
  var satNang = [];
  ['Kình Dương','Đà La','Hỏa Tinh','Linh Tinh','Địa Không','Địa Kiếp','Hóa Kỵ','Cô Thần','Quả Tú'].forEach(function(s){
    if (dsSao.indexOf(s) >= 0) satNang.push(s);
  });
  if (satNang.length >= 3) cau.push('Hôn nhân có nhiều thử thách — cần kiên nhẫn và bao dung.');
  else if (satNang.length >= 1) cau.push('Hôn nhân có vài trục trặc nhỏ, không đáng lo.');

  if (PT.tuan || PT.triet) cau.push('Tuần/Triệt tại Phu Thê — hôn nhân có thể đến muộn hoặc trải qua giai đoạn xa cách.');

  /* --- Bát Tự --- */
  var viTri = I.male ? ['Chính Tài','Thiên Tài'] : ['Chính Quan','Thất Sát'];   // nam: Tài tinh = vợ; nữ: Quan/Sát = chồng (info.gender là 'Nam'/'Nữ' nên dùng info.male)
  var soPhoi = 0;
  bt.pillars.forEach(function(p){
    if (viTri.indexOf(p.thapThan) >= 0) soPhoi++;
    p.tangCan.forEach(function(t){
      if (viTri.indexOf(t.thapThan) >= 0) soPhoi += 0.5;
    });
  });
  if (soPhoi < 1) cau.push('Bát Tự: sao phối ngẫu nhược — duyên đến muộn hoặc phải chủ động.');
  else if (soPhoi >= 3) cau.push('Bát Tự: sao phối ngẫu vượng — có nhiều mối duyên, cần chọn kỹ.');

  return cau.join(' ');
}

/* ============================================================
 *  NHÓM G — CON CÁI (v3 — bảng số theo sách cổ; Bát Tự: nam xem Quan Sát, nữ xem Thực Thương, trụ giờ = cung con)
 * ============================================================ */
function sinhDoanNhomG_(D) {
  var tv = D.tv, bt = D.bt;
  var P = tv.palaces, I = tv.info;
  var cau = [];
  var pi = -1;
  for (var i = 0; i < 12; i++) if (P[i].cung === 'Tử Tức') { pi = i; break; }
  if (pi < 0) return '';
  var TT = P[pi], u = ncUocSo_(P, pi, NC_SO_CON);
  var chinh = (TT.chinh.length ? TT.chinh : P[(pi + 6) % 12].chinh).map(function (s) { return s.n; });

  if (u) {
    var muc = u.hi >= 4 ? 'đông con' : u.hi >= 2 ? 'số con vừa phải' : 'ít con';
    cau.push('Lá số thuộc dạng ' + muc + ' (sách cổ ước khoảng ' + ncKhoang_(u) + ' người con' + (u.muon ? ', cung trống nên mượn cung đối diện' : '') + ').');
  }
  if (chinh.indexOf('Thiên Cơ') >= 0 || chinh.indexOf('Thiên Tướng') >= 0 || chinh.indexOf('Vũ Khúc') >= 0 || chinh.indexOf('Tham Lang') >= 0) cau.push('Thường có con hơi muộn.');
  if (chinh.indexOf('Thất Sát') >= 0 || chinh.indexOf('Phá Quân') >= 0) cau.push('Con đầu lòng dễ vất vả khi nuôi (hay ốm, hoặc khó mang thai lần đầu); con cá tính mạnh, có chí.');
  if (chinh.indexOf('Thiên Đồng') >= 0 || chinh.indexOf('Thiên Lương') >= 0) cau.push('Con hiền lành, ngoan, tình cảm.');
  if (chinh.indexOf('Thái Âm') >= 0) cau.push('Con tinh tế, có năng khiếu văn nghệ; thường có con gái.');
  if (chinh.indexOf('Thiên Cơ') >= 0) cau.push('Con thông minh, hiếu động.');
  if (chinh.indexOf('Cự Môn') >= 0) cau.push('Cha mẹ và con dễ khác quan điểm, cần kiên nhẫn trò chuyện.');
  if (u && u.sat >= 2) cau.push('Cần chú ý sức khỏe của con lúc nhỏ và sức khỏe khi mang thai.');
  if (TT.tuan || TT.triet) cau.push('Con có thể đến muộn hoặc ít hơn mong muốn.');

  /* --- Bát Tự: sao con cái theo giới tính + trụ giờ --- */
  var saoCon = I.male ? ['Chính Quan', 'Thất Sát'] : ['Thực Thần', 'Thương Quan'];
  var soCon = 0;
  bt.pillars.forEach(function (p, i) {
    if (i !== 2 && saoCon.indexOf(p.thapThan) >= 0) soCon++;
    p.tangCan.forEach(function (t) { if (saoCon.indexOf(t.thapThan) >= 0) soCon += 0.5; });
  });
  var tenSao = I.male ? 'Quan Sát' : 'Thực Thương';
  if (soCon >= 2) cau.push('Bát Tự: sao con cái (' + tenSao + ') mạnh — có duyên con cái, con dễ thành đạt.');
  else if (soCon < 0.5) cau.push('Bát Tự: sao con cái (' + tenSao + ') yếu — con có thể đến muộn hoặc ít' + (u && u.hi >= 2 ? ', dù Tử Vi cho số con vừa phải' : '') + '.');
  else cau.push('Bát Tự: sao con cái ở mức vừa — con cái ổn định.');
  var gio = bt.pillars[3];
  if (gio && gio.thapThan) {
    var tt = gio.thapThan;
    if (saoCon.indexOf(tt) >= 0) cau.push('Trụ giờ (cung con cái của Bát Tự) mang đúng sao con cái — gắn bó với con, về già được nhờ con.');
    else if (tt === 'Chính Ấn' || tt === 'Thiên Ấn') cau.push(I.male ? 'Trụ giờ là Ấn — con hiếu học, nhưng bạn dễ lo lắng, bao bọc con quá mức.' : 'Trụ giờ là Ấn (khắc sao con của nữ) — con dễ đến muộn; nên thả lỏng, bớt lo.');
    else if (tt === 'Tỷ Kiên' || tt === 'Kiếp Tài') cau.push('Trụ giờ là Tỷ Kiếp — con độc lập, sớm tự lo cho bản thân.');
    else if (tt === 'Chính Tài' || tt === 'Thiên Tài') cau.push('Trụ giờ là Tài — về già có của để dành, con cái giúp kinh tế.');
  }
  return cau.join(' ');
}

/* ============================================================
 *  NHÓM H — SỰ NGHIỆP
 * ============================================================ */
function sinhDoanNhomH_(D) {
  var tv = D.tv, bt = D.bt, ts = D.ts, hd = D.hd;
  var P = tv.palaces;
  var cau = [];
  var pi = -1;
  for (var i = 0; i < 12; i++) if (P[i].cung === 'Quan Lộc') { pi = i; break; }
  if (pi < 0) return '';

  var QL = P[pi];
  var saoQL = QL.chinh.map(function(s){ return s.n; });
  var dsSao = [].concat(QL.chinh, QL.cat, QL.hung, QL.tieu).map(function(s){ return s.n; });

  if (!saoQL.length) {
    var xc = P[(pi + 6) % 12];
    var saoDoi = xc.chinh.map(function(s){ return s.n; });
    if (saoDoi.indexOf('Tử Vi') >= 0 || saoDoi.indexOf('Thiên Phủ') >= 0) {
      cau.push('Sự nghiệp vững vàng, có thể làm quản lý.');
    } else if (saoDoi.indexOf('Thiên Cơ') >= 0 || saoDoi.indexOf('Thiên Lương') >= 0) {
      cau.push('Sự nghiệp thiên về trí tuệ, cố vấn, giáo dục.');
    } else {
      cau.push('Sự nghiệp ở mức trung bình, phụ thuộc nỗ lực bản thân.');
    }
  } else {
    if (saoQL.indexOf('Tử Vi') >= 0) cau.push('Có tố chất lãnh đạo, làm chủ.');
    else if (saoQL.indexOf('Vũ Khúc') >= 0) cau.push('Phù hợp với kinh doanh, tài chính.');
    else if (saoQL.indexOf('Thiên Tướng') >= 0) cau.push('Phù hợp với hành chính, luật, quản lý.');
    else if (saoQL.indexOf('Thiên Cơ') >= 0) cau.push('Phù hợp với nghiên cứu, kỹ thuật, tư vấn.');
    else if (saoQL.indexOf('Thái Dương') >= 0) cau.push('Phù hợp với đối ngoại, giáo dục, y tế.');
    else if (saoQL.indexOf('Cự Môn') >= 0) cau.push('Phù hợp với kinh doanh, nói, thuyết trình.');
    else if (saoQL.indexOf('Thất Sát') >= 0 || saoQL.indexOf('Phá Quân') >= 0) {
      cau.push('Sự nghiệp có tính đột phá, dễ thay đổi ngành.');
    } else if (saoQL.indexOf('Tham Lang') >= 0) cau.push('Đa tài, có thể làm nhiều nghề.');
    else cau.push('Sự nghiệp ổn định.');
  }

  var satList = ['Kình Dương','Đà La','Hỏa Tinh','Linh Tinh','Địa Không','Địa Kiếp','Hóa Kỵ'];
  var demSat = 0;
  satList.forEach(function(s){ if (dsSao.indexOf(s) >= 0) demSat++; });
  if (demSat >= 3) cau.push('Sự nghiệp nhiều trắc trở, dễ đổi việc.');
  else if (demSat >= 1) cau.push('Sự nghiệp có vài lần chuyển hướng.');

  if (dsSao.indexOf('Hóa Quyền') >= 0) cau.push('Có quyền trong công việc, dễ được đề bạt.');
  if (dsSao.indexOf('Hóa Lộc') >= 0) cau.push('Kiếm tiền thuận lợi, thu nhập ổn định.');
  if (dsSao.indexOf('Hóa Khoa') >= 0) cau.push('Được quý nhân giúp đỡ trong sự nghiệp.');

  if (QL.tuan || QL.triet) cau.push('Tuần/Triệt tại Quan Lộc — sự nghiệp cần tích lũy lâu dài.');

  var soQuanSat = 0;
  bt.pillars.forEach(function(p){
    if (p.thapThan === 'Chính Quan' || p.thapThan === 'Thất Sát') soQuanSat++;
    p.tangCan.forEach(function(t){
      if (t.thapThan === 'Chính Quan' || t.thapThan === 'Thất Sát') soQuanSat += 0.5;
    });
  });
  var soThuongTai = 0;
  bt.pillars.forEach(function(p, i){
    var ok = function(x){ return ['Thực Thần','Thương Quan','Chính Tài','Thiên Tài'].indexOf(x) >= 0; };
    if (i !== 2 && ok(p.thapThan)) soThuongTai++;
    p.tangCan.forEach(function(t){ if (ok(t.thapThan)) soThuongTai += 0.5; });
  });
  if (soQuanSat >= 2) cau.push('Bát Tự: sao quyền chức (Quan Sát) mạnh — hợp môi trường có tổ chức, cấp bậc, dễ lên vị trí quản lý.');
  else if (soQuanSat < 0.5 && soThuongTai >= 2) cau.push('Bát Tự: sao tài năng & tiền bạc (Thực Thương, Tài) mạnh hơn sao quyền chức — hợp kinh doanh, làm tự do, nghề chuyên môn.');
  else if (soQuanSat < 0.5) cau.push('Bát Tự: sao quyền chức yếu — không thích bị ràng buộc, hợp công việc tự chủ.');

  if (ts && ts.duongDoi) {
    var so = ts.duongDoi, g = tsGoc_(so);   // xét theo số gốc 1–9; 11/22/33 là số bậc thầy
    var ten = 'Thần số: số chủ đạo ' + so + ([11, 22, 33].indexOf(so) >= 0 ? ' (số bậc thầy, gốc ' + g + ')' : so !== g ? ' (gốc ' + g + ')' : '');
    if (g === 1 || g === 8) cau.push(ten + ' — có tố chất lãnh đạo, tự làm chủ.');
    else if (g === 2 || g === 6) cau.push(ten + ' — phù hợp làm việc nhóm, chăm sóc, hỗ trợ con người.');
    else if (g === 3 || g === 5) cau.push(ten + ' — sáng tạo, giao tiếp, cần môi trường linh hoạt.');
    else if (g === 4) cau.push(ten + ' — kiên nhẫn, kỷ luật, phù hợp kỹ thuật và quy trình.');
    else if (g === 7) cau.push(ten + ' — thích nghiên cứu, phân tích, chuyên môn sâu.');
    else if (g === 9) cau.push(ten + ' — phù hợp công việc nhân đạo, giáo dục, xã hội.');
  }

  if (hd && hd.loai) {
    var moTaHD = {
      'Generator': 'Human Design: Người Kiến Tạo — thành công khi làm điều mình thích.',
      'Manifesting Generator': 'Human Design: Kiến Tạo Biểu Hiện — nhanh, đa nhiệm.',
      'Manifestor': 'Human Design: Người Khởi Xướng — tự mở đường.',
      'Projector': 'Human Design: Người Dẫn Dắt — hướng dẫn người khác.',
      'Reflector': 'Human Design: Người Phản Chiếu — nhạy với môi trường.'
    };
    if (moTaHD[hd.loai]) cau.push(moTaHD[hd.loai]);
  }

  return cau.join(' ');
}
/* ============================================================
 *  TEST — Chạy 8 đoạn mô tả cho 3 lá số
 * ============================================================ */
function testNghiemChung3Nguoi() {
  var ds = [
    { ten: 'BẠN', input: { name: 'Ban', gender: 'nam', calendar: 'duong', day: 16, month: 6, year: 1995, hour: 4, minute: 30, place: '20.45|106.34|Thái Bình', tz: 7, viewYear: 2026 } },
    { ten: 'VỢ', input: { name: 'Vo', gender: 'nu', calendar: 'duong', day: 20, month: 10, year: 1997, hour: 2, minute: 0, place: '20.45|106.34|Hưng Hà', tz: 7, viewYear: 2026 } },
    { ten: 'EM GÁI', input: { name: 'EmGai', gender: 'nu', calendar: 'duong', day: 6, month: 9, year: 2001, hour: 4, minute: 0, place: '20.45|106.34|Thái Bình', tz: 7, viewYear: 2026 } }
  ];

  Logger.log('=== NGHIỆM CHỨNG 3 LÁ SỐ ===\n');

  ds.forEach(function(x) {
    Logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    Logger.log('  ' + x.ten);
    Logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    try {
      var r = nghiemChungLap(x.input);
      r.doan.forEach(function(d) {
        Logger.log('');
        Logger.log('【' + d.ma + '】 ' + d.ten);
        Logger.log(d.text);
      });
    } catch (e) {
      Logger.log('✗ Lỗi: ' + e.message);
    }
    Logger.log('');
    Logger.log('');
  });

  Logger.log('✓ Nếu 3 lá số đều có 8 đoạn mô tả, Patch 8a đã hoạt động.');
}

/* ============================================================
 *  PATCH 8D — UI NGHIỆM CHỨNG (wrappers cho google.script.run)
 * ============================================================ */

/**
 * Mở dialog UI nghiệm chứng trong Apps Script editor.
 * Chạy hàm này từ editor để xem trước giao diện.
 */
function showNghiemChungUI() {
  var html = HtmlService.createHtmlOutputFromFile('NghiemChungUI')
    .setWidth(720)
    .setHeight(760)
    .setTitle('Nghiệm Chứng Lá Số');
  SpreadsheetApp.getUi().showModalDialog(html, 'Nghiệm Chứng Lá Số');
}

/**
 * Client gọi: lập lá số → trả về 8 đoạn (bỏ phần data nặng).
 * @param {Object} input — { name, gender, calendar, day, month, year, hour, minute, place, tz, viewYear }
 * @return {Array} — 8 đoạn { ma, ten, text }
 */
function getDoanNghiemChung(input) {
  if (!input) throw new Error('Thiếu input.');
  var r = nghiemChungLap(input);
  return r.doan;
}

/**
 * Client gọi: tính điểm khớp từ 8 mức đã chọn.
 * @param {Object} cauTraLoi — { A: 'dung_het', B: 'dung_phan_lon', ... }
 * @return {Object} — { pct, ketLuan, khuyen, mau, soDungCao, soSai, chiTiet }
 */
function tinhDiemNghiemChung(cauTraLoi) {
  if (!cauTraLoi) throw new Error('Thiếu câu trả lời.');
  return nghiemChungTinhDiem_(cauTraLoi);
}