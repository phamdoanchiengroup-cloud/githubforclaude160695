/**
 * ============================================================
 *  NghiemChung.gs — NGHIỆM CHỨNG LÁ SỐ (ĐỊNH BÀN)
 *  Sinh 8 đoạn mô tả từ 6 hệ: Tử Vi · Bát Tự · Chiêm tinh ·
 *  Hà Lạc · Thần số · Human Design
 * ============================================================
 */

/* -------- BẢNG TRỌNG SỐ 6 HỆ THEO NHÓM -------- */
var NC_TRONG_SO = {
  'A': { tuvi: 3, batu: 3, chiemtinh: 4, halac: 0.5, thanso: 0.5, hd: 1 },
  'B': { tuvi: 3, batu: 3, chiemtinh: 3, halac: 1, thanso: 1, hd: 1 },
  'C': { tuvi: 4, batu: 3, chiemtinh: 1, halac: 0.5, thanso: 0.5, hd: 0.5 },
  'D': { tuvi: 2, batu: 5, chiemtinh: 1, halac: 1, thanso: 0.5, hd: 0.5 },
  'E': { tuvi: 2, batu: 4, chiemtinh: 3, halac: 1, thanso: 0.5, hd: 0.5 },
  'F': { tuvi: 2, batu: 4, chiemtinh: 3, halac: 1, thanso: 1, hd: 1 },
  'G': { tuvi: 3, batu: 3, chiemtinh: 2, halac: 1, thanso: 1, hd: 0.5 },
  'H': { tuvi: 3, batu: 3, chiemtinh: 2, halac: 1, thanso: 2, hd: 1 }
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
 *  NHÓM A — VÓC DÁNG & CƠ THỂ
 * ============================================================ */
function sinhDoanNhomA_(D) {
  var tv = D.tv, bt = D.bt, ct = D.ct;
  var P = tv.palaces, I = tv.info;
  var chinhM = P[I.menh].chinh;
  var saoM = chinhM.map(function(s){ return s.n; });
  var cau = [];

  /* TỬ VI: chính tinh tại Mệnh */
  if (!saoM.length) {
    var xc = P[(I.menh + 6) % 12];
    var saoDoi = xc.chinh.map(function(s){ return s.n; });
    if (saoDoi.indexOf('Thiên Cơ') >= 0 || saoDoi.indexOf('Thiên Lương') >= 0) cau.push('Thân hình mảnh khảnh, khó tăng cân.');
    else if (saoDoi.indexOf('Tử Vi') >= 0 || saoDoi.indexOf('Thiên Phủ') >= 0) cau.push('Thân hình đầy đặn, dễ tăng cân.');
    else if (saoDoi.indexOf('Thái Dương') >= 0) cau.push('Thân hình trung bình, gương mặt sáng.');
    else if (saoDoi.indexOf('Liêm Trinh') >= 0 || saoDoi.indexOf('Phá Quân') >= 0) cau.push('Thân hình săn chắc, có góc cạnh, ánh mắt sắc.');
    else if (saoDoi.indexOf('Vũ Khúc') >= 0 || saoDoi.indexOf('Thất Sát') >= 0) cau.push('Thân hình rắn chắc, xương rõ.');
    else if (saoDoi.indexOf('Thiên Tướng') >= 0) cau.push('Thân hình cân đối, thanh tú.');
    else cau.push('Thân hình trung bình.');
  } else {
    var sang = chinhM.some(function(s){ return s.b === 'M' || s.b === 'V' || s.b === 'Đ'; });
    var them = sang ? ' Gương mặt sáng, khí chất tươi trẻ.' : ' Nét mặt trầm.';
    if (saoM.indexOf('Thiên Cơ') >= 0 || saoM.indexOf('Thiên Lương') >= 0) cau.push('Thân hình mảnh khảnh, ăn nhiều nhưng khó tăng cân.' + them);
    else if (saoM.indexOf('Tử Vi') >= 0 || saoM.indexOf('Thiên Phủ') >= 0) cau.push('Thân hình đầy đặn, dễ tăng cân.' + them);
    else if (saoM.indexOf('Vũ Khúc') >= 0 || saoM.indexOf('Thất Sát') >= 0) cau.push('Thân hình rắn chắc, xương rõ.' + them);
    else if (saoM.indexOf('Liêm Trinh') >= 0 || saoM.indexOf('Phá Quân') >= 0) cau.push('Thân hình săn chắc, góc cạnh.' + them);
    else if (saoM.indexOf('Thái Dương') >= 0) cau.push('Thân hình trung bình, da hồng hào.' + them);
    else if (saoM.indexOf('Thái Âm') >= 0) cau.push('Thân hình mềm mại, dễ tích nước.' + them);
    else if (saoM.indexOf('Tham Lang') >= 0) cau.push('Thân hình có sức hút.' + them);
    else if (saoM.indexOf('Cự Môn') >= 0) cau.push('Thân hình mảnh hoặc trung bình.' + them);
    else if (saoM.indexOf('Thiên Tướng') >= 0) cau.push('Thân hình cân đối.' + them);
    else if (saoM.indexOf('Thiên Đồng') >= 0) cau.push('Thân hình tròn đầy nhẹ, dễ chịu.' + them);
    else cau.push('Thân hình trung bình.' + them);
  }

  /* BÁT TỰ */
  if (bt.nhatChuHanh === 'Thổ' && bt.vuong) cau.push('Cơ thể vững chãi, ít ốm.');
  else if (bt.nhatChuHanh === 'Mộc' && !bt.vuong) cau.push('Dáng mảnh, khó tăng cân.');
  else if (bt.nhatChuHanh === 'Kim' && bt.vuong) cau.push('Cơ thể rắn chắc, xương to.');
  else if (bt.nhatChuHanh === 'Hỏa') cau.push('Cơ thể nóng, dễ ra mồ hôi, gầy tự nhiên.');
  else if (bt.nhatChuHanh === 'Thủy') cau.push('Cơ thể thiên về ẩm, dễ tích nước.');
  if (bt.phanTram['Kim'] < 5) cau.push('Kim khuyết — da dễ khô, tóc dễ gãy.');

  /* CHIÊM TINH */
  if (ct && ct.asc) {
    var moTaAsc = [
      'Dáng săn chắc, bước đi nhanh, trán cao.',
      'Thân hình đầy đặn, dễ tăng cân.',
      'Dáng mảnh khảnh, trông trẻ hơn tuổi.',
      'Mặt tròn, da sáng, dễ tích nước.',
      'Dáng đứng thẳng, vai rộng, tóc dày.',
      'Dáng thanh mảnh, gọn gàng, trẻ lâu.',
      'Thân hình cân đối, nụ cười duyên.',
      'Ánh mắt sâu, thần thái mạnh.',
      'Dáng cao, chân dài.',
      'Xương gò má rõ, trông chín chắn.',
      'Dáng cao, nét độc đáo.',
      'Mắt to long lanh, nét mềm.'
    ];
    if (moTaAsc[ct.asc.cung]) cau.push(moTaAsc[ct.asc.cung]);
  }
  return cau.join(' ');
}


/* ============================================================
 *  NHÓM C — ANH CHỊ EM
 * ============================================================ */
function sinhDoanNhomC_(D) {
  var tv = D.tv, bt = D.bt;
  var P = tv.palaces, I = tv.info;
  var cau = [];
  var pi = -1;
  for (var i = 0; i < 12; i++) if (P[i].cung === 'Huynh Đệ') { pi = i; break; }
  if (pi < 0) return '';

  var HD = P[pi];
  var saoHD = HD.chinh.map(function(s){ return s.n; });

  /* VCD — mượn cung đối */
  if (!saoHD.length) {
    var xc = P[(pi + 6) % 12];
    var saoDoi = xc.chinh.map(function(s){ return s.n; });
    var diemDoi = xc.diem10 || 0;
    if (saoDoi.indexOf('Thiên Cơ') >= 0 || saoDoi.indexOf('Thiên Lương') >= 0) {
      cau.push('Bạn thuộc mẫu người ít anh em (1-2 người).');
      cau.push('Anh em hiền lành, đàng hoàng, có học thức. Mối quan hệ tốt nhưng không ồn ào.');
    } else if (diemDoi >= 6) {
      cau.push('Số anh em ít (1-2 người) nhưng chất lượng quan hệ tốt.');
    } else if (diemDoi <= 3) {
      cau.push('Số anh em ít và mối quan hệ có khoảng cách.');
    } else {
      cau.push('Số anh em ít, quan hệ ở mức trung bình.');
    }
  } else {
    /* Có chính tinh — đếm số theo sao */
    var soAnhEm = 1;
    if (saoHD.indexOf('Thiên Đồng') >= 0 || saoHD.indexOf('Thiên Phủ') >= 0) soAnhEm = 3;
    else if (saoHD.indexOf('Thái Âm') >= 0) soAnhEm = 2;
    else if (saoHD.indexOf('Thiên Cơ') >= 0) soAnhEm = 1;
    else if (saoHD.indexOf('Thất Sát') >= 0 || saoHD.indexOf('Phá Quân') >= 0) soAnhEm = 1;
    else if (saoHD.indexOf('Vũ Khúc') >= 0 || saoHD.indexOf('Liêm Trinh') >= 0) soAnhEm = 1;
    cau.push('Số anh em khoảng ' + soAnhEm + ' người.');
  }

  /* Đếm số âm — sao tang môn, thiên khốc, thiên hư, thai */
  var dsSao = [].concat(HD.chinh, HD.cat, HD.hung, HD.tieu).map(function(s){ return s.n; });
  if (dsSao.indexOf('Tang Môn') >= 0 || dsSao.indexOf('Thiên Khốc') >= 0 || dsSao.indexOf('Thiên Hư') >= 0) {
    cau.push('Có thể trong gia đình từng có mất mát liên quan đến em út (sảy thai, lưu thai, hoặc em mất sớm).');
  }
  if (dsSao.indexOf('Long Trì') >= 0 || dsSao.indexOf('Thiên Tài') >= 0 || dsSao.indexOf('Bác Sĩ') >= 0) {
    cau.push('Thực tế có thể nhiều hơn con số dương — có "số âm" ẩn.');
  }

  /* Tuần/Triệt */
  if (HD.tuan || HD.triet) cau.push('Tuần/Triệt chặn cung — mối quan hệ có thể gián đoạn hoặc xa cách.');

  /* BÁT TỰ — Tỷ Kiếp */
  var soTyKiep = 0;
  bt.pillars.forEach(function(p, i) {
    if (p.thapThan === 'Tỷ Kiên' || p.thapThan === 'Kiếp Tài') soTyKiep++;
    p.tangCan.forEach(function(t) {
      if (t.thapThan === 'Tỷ Kiên' || t.thapThan === 'Kiếp Tài') soTyKiep += 0.5;
    });
  });
  if (soTyKiep >= 2.5) cau.push('Bát Tự: Tỷ Kiếp vượng — có nhiều anh em nhưng dễ cạnh tranh, ít nhờ cậy.');
  else if (soTyKiep >= 1) cau.push('Bát Tự: Tỷ Kiếp vừa phải — anh em có qua lại, mỗi người tự lo.');
  else cau.push('Bát Tự: Tỷ Kiếp ít — có thể chỉ có anh chị em ruột hoặc không thân thiết.');

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
  if (soTai < 1) cau.push('Bát Tự: Tài tinh (cha) nhược — cha vất vả, kinh tế khó khăn.');
  if (soAn < 1) cau.push('Bát Tự: Ấn tinh (mẹ) nhược — mẹ vất vả hoặc không được nhờ mẹ nhiều.');

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
    saoM.indexOf('Liêm Trinh') >= 0 ||
    saoM.indexOf('Thiên Tướng') >= 0 ||
    saoM.indexOf('Thiên Lương') >= 0 ||
    !saoM.length ||
    P[I.menh].tuan || P[I.menh].triet
  );

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
  if (ttMax) cau.push('Nổi bật thập thần ' + ttMax + ' — ' + (THAP_THAN_Y_NGHIA[ttMax] || '') + '.');

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
    if (moTaSun[ct.by.sun.cung]) cau.push(moTaSun[ct.by.sun.cung]);
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
 *  NHÓM E — SỨC KHỎE (v3 — thêm khuyết hành + sát tinh tại Mệnh)
 * ============================================================ */
function sinhDoanNhomE_(D) {
  var tv = D.tv, bt = D.bt, ct = D.ct;
  var P = tv.palaces, I = tv.info;
  var cau = [];
  var pi = -1;
  for (var i = 0; i < 12; i++) if (P[i].cung === 'Tật Ách') { pi = i; break; }
  if (pi < 0) return '';

  var TA = P[pi];
  var chinhTA = TA.chinh.map(function(s){ return s.n; });
  var dsSao = [].concat(TA.chinh, TA.cat, TA.hung, TA.tieu).map(function(s){ return s.n; });

  /* --- Sát tinh trong Tật Ách --- */
  var satNang = [];
  ['Kình Dương','Đà La','Hỏa Tinh','Linh Tinh','Địa Không','Địa Kiếp',
   'Hóa Kỵ','Thiên Hình','Bệnh Phù','Tang Môn','Thiên Khốc','Thiên Hư','Thiên Riêu'].forEach(function(s){
    if (dsSao.indexOf(s) >= 0) satNang.push(s);
  });

  var coBenhAn = dsSao.indexOf('Thiên Riêu') >= 0 ||
                 dsSao.indexOf('Thiên Hư') >= 0 ||
                 dsSao.indexOf('Bệnh Phù') >= 0;

  /* --- Sát tinh tại Mệnh (dấu vết biến cố đã qua) --- */
  var dsSaoMenh = [].concat(P[I.menh].chinh, P[I.menh].cat, P[I.menh].hung).map(function(s){ return s.n; });
  var coSatMenh = false;
  ['Kình Dương','Đà La','Thiên Hình','Hóa Kỵ','Địa Không','Địa Kiếp'].forEach(function(s){
    if (dsSaoMenh.indexOf(s) >= 0) coSatMenh = true;
  });

  /* --- Bát Tự: hành khuyết --- */
  var khuyetHanh = [];
  if (bt.phanTram) {
    ['Kim','Mộc','Thủy','Hỏa','Thổ'].forEach(function(h){
      if (bt.phanTram[h] < 5) khuyetHanh.push(h);
    });
  }

  var coTuanTriet = TA.tuan || TA.triet;

  /* --- Xếp mức --- */
  if (satNang.length >= 3) {
    cau.push('Sức khỏe có giai đoạn yếu, dễ gặp bệnh nặng hoặc biến cố bất ngờ.');
    if (dsSao.indexOf('Thiên Hình') >= 0) cau.push('Có dấu hiệu phải can thiệp y tế (mổ, tiểu phẫu).');
    if (coBenhAn) cau.push('Có bệnh ẩn hoặc bệnh tái phát — cần khám định kỳ.');
  } else if (satNang.length >= 1 || coBenhAn || khuyetHanh.length >= 1 || coSatMenh || coTuanTriet) {
    cau.push('Sức khỏe ở mức trung bình — có vài vấn đề cần chú ý, đặc biệt giai đoạn sức đề kháng yếu.');
    if (coBenhAn) cau.push('Từng có giai đoạn bệnh nặng hoặc bệnh mãn tính âm ỉ.');
    else if (coSatMenh) cau.push('Có giai đoạn cơ thể suy nhược, dễ mắc bệnh nặng bất ngờ.');
    else if (khuyetHanh.length >= 1) cau.push('Bát Tự khuyết hành ' + khuyetHanh.join(', ') + ' — cơ quan tương ứng dễ yếu, bệnh dễ phát khi sức đề kháng giảm.');
    else if (coTuanTriet) cau.push('Tật Ách có Tuần/Triệt — bệnh dễ dai dẳng hoặc tái phát.');
  } else {
    cau.push('Sức khỏe nền tảng khá tốt, ít ốm đau.');
  }

  /* --- Cơ quan theo chính tinh Tật Ách --- */
  if (chinhTA.indexOf('Thiên Cơ') >= 0) cau.push('Cơ quan cần chú ý: thần kinh, tiêu hóa, gan.');
  else if (chinhTA.indexOf('Thái Âm') >= 0) cau.push('Cơ quan cần chú ý: thận, hệ bài tiết, mắt.');
  else if (chinhTA.indexOf('Thái Dương') >= 0) cau.push('Cơ quan cần chú ý: tim, mắt, huyết áp.');
  else if (chinhTA.indexOf('Vũ Khúc') >= 0) cau.push('Cơ quan cần chú ý: phổi, hô hấp, xương khớp.');
  else if (chinhTA.indexOf('Cự Môn') >= 0) cau.push('Cơ quan cần chú ý: miệng, dạ dày, đường ruột.');

  /* --- Cơ quan theo khuyết hành Bát Tự --- */
  if (bt.phanTram) {
    var coQuanKhuyet = [];
    if (bt.phanTram['Kim'] < 5) coQuanKhuyet.push('phổi, hô hấp');
    if (bt.phanTram['Mộc'] < 5) coQuanKhuyet.push('gan, mật');
    if (bt.phanTram['Thủy'] < 5) coQuanKhuyet.push('thận, tiết niệu');
    if (bt.phanTram['Hỏa'] < 5) coQuanKhuyet.push('tim, huyết áp');
    if (bt.phanTram['Thổ'] < 5) coQuanKhuyet.push('dạ dày, tiêu hóa');
    if (coQuanKhuyet.length) {
      cau.push('Bát Tự: cơ quan dễ yếu gồm ' + coQuanKhuyet.join('; ') + '.');
    }
  }

  if (bt.nhatChuHanh === 'Kim') cau.push('Nhật chủ Kim — chú ý phổi, hô hấp.');
  else if (bt.nhatChuHanh === 'Mộc') cau.push('Nhật chủ Mộc — chú ý gan, mật.');
  else if (bt.nhatChuHanh === 'Thủy') cau.push('Nhật chủ Thủy — chú ý thận, hệ bài tiết.');
  else if (bt.nhatChuHanh === 'Hỏa') cau.push('Nhật chủ Hỏa — chú ý tim, huyết áp.');
  else if (bt.nhatChuHanh === 'Thổ') cau.push('Nhật chủ Thổ — chú ý dạ dày, tiêu hóa.');

  if (ct && ct.asc) {
    var coQuan = ['đầu, não','cổ họng, tuyến giáp','phổi, vai, tay','ngực, dạ dày',
                  'tim, lưng','hệ tiêu hóa, ruột','thận, eo','cơ quan sinh dục',
                  'hông, đùi','đầu gối, xương','bắp chân, mắt cá','bàn chân, hệ miễn dịch'];
    if (coQuan[ct.asc.cung]) cau.push('Chiêm tinh: cơ quan nhạy cảm là ' + coQuan[ct.asc.cung] + '.');
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
 *  NHÓM G — CON CÁI (v2 — bỏ mâu thuẫn "2 con" + "ít con")
 * ============================================================ */
function sinhDoanNhomG_(D) {
  var tv = D.tv, bt = D.bt;
  var P = tv.palaces;
  var cau = [];
  var pi = -1;
  for (var i = 0; i < 12; i++) if (P[i].cung === 'Tử Tức') { pi = i; break; }
  if (pi < 0) return '';

  var TT = P[pi];
  var saoTT = TT.chinh.map(function(s){ return s.n; });
  var dsSao = [].concat(TT.chinh, TT.cat, TT.hung, TT.tieu).map(function(s){ return s.n; });

  var soCon = 1;
  if (saoTT.indexOf('Thiên Đồng') >= 0 || saoTT.indexOf('Thiên Phủ') >= 0 || saoTT.indexOf('Thái Âm') >= 0) soCon = 3;
  else if (saoTT.indexOf('Thiên Cơ') >= 0) soCon = 1;
  else if (saoTT.indexOf('Thất Sát') >= 0 || saoTT.indexOf('Phá Quân') >= 0) soCon = 2;
  else if (saoTT.indexOf('Tử Vi') >= 0) soCon = 2;
  else if (saoTT.indexOf('Tham Lang') >= 0) soCon = 2;

  var moTaSoCon;
  if (!saoTT.length) {
    var xc = P[(pi + 6) % 12];
    var saoDoi = xc.chinh.map(function(s){ return s.n; });
    if (saoDoi.indexOf('Thiên Cơ') >= 0 || saoDoi.indexOf('Thiên Lương') >= 0) moTaSoCon = 'Số con ít (1-2), con ngoan, hiếu học.';
    else if (saoDoi.indexOf('Tử Vi') >= 0 || saoDoi.indexOf('Thiên Phủ') >= 0) moTaSoCon = 'Số con ít nhưng con có triển vọng.';
    else moTaSoCon = 'Số con ít (1-2).';
  } else {
    if (soCon === 1) moTaSoCon = 'Số con ít (khoảng 1 người).';
    else if (soCon === 2) moTaSoCon = 'Số con khoảng 2 người.';
    else moTaSoCon = 'Số con có thể 2-3 người.';
  }
  cau.push(moTaSoCon);

  if (saoTT.indexOf('Thiên Đồng') >= 0 || saoTT.indexOf('Thiên Lương') >= 0) cau.push('Con hiền lành, ngoan ngoãn.');
  if (saoTT.indexOf('Thất Sát') >= 0 || saoTT.indexOf('Phá Quân') >= 0) cau.push('Con cá tính mạnh, khó dạy nhưng có chí.');
  if (saoTT.indexOf('Thiên Cơ') >= 0) cau.push('Con thông minh, hiếu động.');
  if (saoTT.indexOf('Vũ Khúc') >= 0 || saoTT.indexOf('Thiên Tướng') >= 0) {
    cau.push('Con có tố chất lãnh đạo hoặc kinh doanh.');
  }

  if (dsSao.indexOf('Hồng Loan') >= 0 && dsSao.indexOf('Thiên Hỷ') >= 0) {
    cau.push('Có dấu hiệu con gái đầu lòng.');
  } else if (dsSao.indexOf('Long Trì') >= 0 || dsSao.indexOf('Phượng Các') >= 0) {
    cau.push('Có dấu hiệu con trai đầu lòng.');
  }

  var satList = ['Kình Dương','Đà La','Hỏa Tinh','Linh Tinh','Địa Không','Địa Kiếp','Hóa Kỵ','Thiên Hình'];
  var demSat = 0;
  satList.forEach(function(s){ if (dsSao.indexOf(s) >= 0) demSat++; });
  if (demSat >= 3) cau.push('Có thể có chuyện buồn liên quan đến con — sảy thai, lưu thai, hoặc con yếu.');
  else if (demSat >= 1) cau.push('Cần chú ý sức khỏe của con giai đoạn nhỏ.');

  if (TT.tuan || TT.triet) cau.push('Tuần/Triệt tại Tử Tức — số con có thể ít hơn dự kiến.');

  /* --- Bát Tự — DIỄN ĐẠT KHÔNG MÂU THUẪN --- */
  var soThucThuong = 0;
  bt.pillars.forEach(function(p){
    if (p.thapThan === 'Thực Thần' || p.thapThan === 'Thương Quan') soThucThuong++;
    p.tangCan.forEach(function(t){
      if (t.thapThan === 'Thực Thần' || t.thapThan === 'Thương Quan') soThucThuong += 0.5;
    });
  });
  if (soThucThuong >= 2) {
    cau.push('Bát Tự: Thực Thương vượng — có duyên với con, con cái hiếu thuận.');
  } else if (soThucThuong < 0.5) {
    if (soCon >= 2) cau.push('Bát Tự: Thực Thương nhược — con cái có thể đến muộn hơn dự kiến, nhưng số lượng vẫn đủ.');
    else cau.push('Bát Tự: Thực Thương nhược — con cái có thể muộn hoặc ít.');
  } else {
    cau.push('Bát Tự: Thực Thương vừa phải — con cái ở mức ổn định.');
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
  if (soQuanSat >= 2) cau.push('Bát Tự: Quan Sát vượng — phù hợp làm công ăn lương, có cấp bậc.');
  else if (soQuanSat < 0.5) cau.push('Bát Tự: Quan Sát nhược — nên làm tự do hoặc khởi nghiệp.');

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