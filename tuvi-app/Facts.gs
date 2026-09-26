/**
 * ============================================================
 *  Facts.gs — ĐỊNH DẠNG CHUẨN "FACTS" DÙNG CHUNG 6 HỆ
 *
 *  Mỗi hệ (Tử Vi, Bát Tự, Chiêm tinh, Hà Lạc, Thần số, HD)
 *  đều chuyển dữ liệu thô của mình thành mảng FACTS theo
 *  cùng một format. Nhờ đó Tầng Tổng hợp 6 hệ có thể đếm
 *  số hệ đồng thuận mà không cần hiểu sâu từng hệ.
 *
 *  Cấu trúc 1 fact — 12 trường:
 *    he         : 'Tu Vi' | 'Bat Tu' | 'Chiem Tinh' | 'Ha Lac' | 'Than So' | 'HD'
 *    linhVuc    : 12 lĩnh vực chuẩn, hoặc 'ALL' nếu hệ không chia theo lĩnh vực
 *    nhom       : nhóm chủ đề rộng hơn (tinh_cach, tai_chinh, tinh_duyen, ...)
 *    loai       : 'manh' (tốt) | 'yeu' (cần lưu ý) | 'trung' (trung tính)
 *    yNghia     : câu văn dễ hiểu cho người đọc
 *    trongSo    : độ mạnh 0.1 → 2.0
 *    nguon      : ghi chú kỹ thuật (không hiển thị, để debug)
 *    thoiDiem   : 'toan_doi' | 'tien_van' | 'trung_van' | 'hau_van'
 *    doiTuong   : 'ban_than' | 'phoi_ngau' | 'con_cai' | 'cha_me' | 'anh_em' | 'ban_be'
 *    tags       : mảng từ khóa để Tầng 4 lọc nhanh
 *    tuongTac   : mô tả xung đột với fact khác (nếu có), hoặc null
 *    ghiChu     : ghi chú tùy chọn
 * ============================================================
 */

/* ============================================================
 *  PHẦN 1 — CONSTANTS
 * ============================================================ */

// 6 hệ huyền học đang dùng
var FACT_HE = {
  TU_VI:      'Tu Vi',
  BAT_TU:     'Bat Tu',
  CHIEM_TINH: 'Chiem Tinh',
  HA_LAC:     'Ha Lac',
  THAN_SO:    'Than So',
  HD:         'HD'
};

// 12 lĩnh vực chuẩn — dùng tên cung Tử Vi để dễ map
// (mọi hệ sẽ quy đổi về đây)
var FACT_LINHVUC = {
  MENH:       'Menh',
  HUYNH_DE:   'Huynh De',
  PHU_THE:    'Phu The',
  TU_TUC:     'Tu Tuc',
  TAI_BACH:   'Tai Bach',
  TAT_ACH:    'Tat Ach',
  THIEN_DI:   'Thien Di',
  NO_BOC:     'No Boc',
  QUAN_LOC:   'Quan Loc',
  DIEN_TRACH: 'Dien Trach',
  PHUC_DUC:   'Phuc Duc',
  PHU_MAU:    'Phu Mau',
  // Dùng cho hệ không map được 12 lĩnh vực (Hà Lạc, Thần số, HD)
  ALL:        'ALL'
};

// Nhóm chủ đề rộng — dùng để Tầng 4 gộp nhiều lĩnh vực liên quan
var FACT_NHOM = {
  TINH_CACH:   'tinh_cach',
  TAI_CHINH:   'tai_chinh',
  TINH_DUYEN:  'tinh_duyen',
  CON_CAI:     'con_cai',
  CONG_DANH:   'cong_danh',
  SUC_KHOE:    'suc_khoe',
  GIA_DAO:     'gia_dao',
  XA_HOI:      'xa_hoi',
  TAM_LINH:    'tam_linh'
};

// Loại fact
var FACT_LOAI = {
  MANH:  'manh',
  YEU:   'yeu',
  TRUNG: 'trung'
};

// Thời điểm ảnh hưởng
var FACT_THOIDIEM = {
  TOAN_DOI:  'toan_doi',
  TIEN_VAN:  'tien_van',   // trước ~30 tuổi
  TRUNG_VAN: 'trung_van',  // 30–55 tuổi
  HAU_VAN:   'hau_van'     // sau 55 tuổi
};

// Đối tượng fact nói về ai
var FACT_DOITUONG = {
  BAN_THAN:  'ban_than',
  PHOI_NGAU: 'phoi_ngau',
  CON_CAI:   'con_cai',
  CHA_ME:    'cha_me',
  ANH_EM:    'anh_em',
  BAN_BE:    'ban_be'
};

/* ============================================================
 *  PHẦN 2 — TẠO VÀ KIỂM TRA FACT
 * ============================================================ */

/**
 * Tạo một fact với đầy đủ 12 trường.
 * Chỉ cần truyền các trường chính, các trường còn lại tự mặc định.
 *
 * Ví dụ:
 *   taoFact_('Tu Vi', 'Tai Bach', 'tai_chinh', 'manh',
 *            'Tài lộc đến tự nhiên, bạn dễ có người giúp về tiền bạc.',
 *            1.5, { nguon: 'Hóa Lộc cung Tài', tags: ['tai_loc'] })
 */
function taoFact_(he, linhVuc, nhom, loai, yNghia, trongSo, opt) {
  opt = opt || {};
  return {
    he:        he,
    linhVuc:   linhVuc,
    nhom:      nhom,
    loai:      loai,
    yNghia:    String(yNghia || '').trim(),
    trongSo:   Math.max(0.1, Math.min(2.0, Number(trongSo) || 1.0)),
    nguon:     opt.nguon || '',
    thoiDiem:  opt.thoiDiem || FACT_THOIDIEM.TOAN_DOI,
    doiTuong:  opt.doiTuong || FACT_DOITUONG.BAN_THAN,
    tags:      opt.tags || [],
    tuongTac:  opt.tuongTac || null,
    ghiChu:    opt.ghiChu || ''
  };
}

/**
 * Kiểm tra fact có hợp lệ không (đủ trường bắt buộc + giá trị hợp lệ).
 * Trả về true nếu OK, false nếu lỗi.
 */
function kiemTraFact_(f) {
  if (!f) return false;
  var heHopLe = Object.keys(FACT_HE).map(function(k){ return FACT_HE[k]; });
  var lvHopLe = Object.keys(FACT_LINHVUC).map(function(k){ return FACT_LINHVUC[k]; });
  var loaiHopLe = [FACT_LOAI.MANH, FACT_LOAI.YEU, FACT_LOAI.TRUNG];
  if (heHopLe.indexOf(f.he) < 0) return false;
  if (lvHopLe.indexOf(f.linhVuc) < 0) return false;
  if (loaiHopLe.indexOf(f.loai) < 0) return false;
  if (!f.yNghia) return false;
  return true;
}

/**
 * Lọc bỏ các fact lỗi khỏi mảng.
 */
function locFactLoi_(arr) {
  return (arr || []).filter(kiemTraFact_);
}

/* ============================================================
 *  PHẦN 3 — LỌC VÀ TRUY VẤN
 * ============================================================ */

/**
 * Lọc facts theo nhiều tiêu chí. Bỏ tiêu chí nào thì không lọc theo tiêu chí đó.
 * Ví dụ:
 *   locFacts_(facts, { linhVuc: 'Tai Bach' })          → tất cả facts về Tài Bạch
 *   locFacts_(facts, { he: 'Tu Vi', loai: 'manh' })    → facts tốt của Tử Vi
 *   locFacts_(facts, { tags: ['tai_loc'] })            → facts có tag tai_loc
 */
function locFacts_(facts, tieuChi) {
  tieuChi = tieuChi || {};
  return (facts || []).filter(function(f) {
    if (tieuChi.he && f.he !== tieuChi.he) return false;
    if (tieuChi.linhVuc && f.linhVuc !== tieuChi.linhVuc) return false;
    if (tieuChi.nhom && f.nhom !== tieuChi.nhom) return false;
    if (tieuChi.loai && f.loai !== tieuChi.loai) return false;
    if (tieuChi.thoiDiem && f.thoiDiem !== tieuChi.thoiDiem) return false;
    if (tieuChi.doiTuong && f.doiTuong !== tieuChi.doiTuong) return false;
    if (tieuChi.trongSoToiThieu && f.trongSo < tieuChi.trongSoToiThieu) return false;
    if (tieuChi.tags && tieuChi.tags.length) {
      var hasTag = tieuChi.tags.some(function(t){ return f.tags.indexOf(t) >= 0; });
      if (!hasTag) return false;
    }
    return true;
  });
}

/**
 * Lấy tất cả facts liên quan đến một lĩnh vực cụ thể — bao gồm:
 *   - facts có linhVuc === lĩnh vực đó
 *   - facts có linhVuc === 'ALL' nhưng nhom khớp với lĩnh vực
 * Dùng cho Tầng 4 khi cần đếm đồng thuận.
 */
function factsTheoLinhVuc_(facts, linhVuc) {
  // Map lĩnh vực → nhóm tương ứng
  var map = {
    'Menh':       [FACT_NHOM.TINH_CACH],
    'Huynh De':   [FACT_NHOM.GIA_DAO, FACT_NHOM.XA_HOI],
    'Phu The':    [FACT_NHOM.TINH_DUYEN],
    'Tu Tuc':     [FACT_NHOM.CON_CAI],
    'Tai Bach':   [FACT_NHOM.TAI_CHINH],
    'Tat Ach':    [FACT_NHOM.SUC_KHOE],
    'Thien Di':   [FACT_NHOM.XA_HOI],
    'No Boc':     [FACT_NHOM.XA_HOI],
    'Quan Loc':   [FACT_NHOM.CONG_DANH],
    'Dien Trach': [FACT_NHOM.TAI_CHINH, FACT_NHOM.GIA_DAO],
    'Phuc Duc':   [FACT_NHOM.TAM_LINH],
    'Phu Mau':    [FACT_NHOM.GIA_DAO]
  };
  var nhomLQ = map[linhVuc] || [];
  return (facts || []).filter(function(f) {
    if (f.linhVuc === linhVuc) return true;
    if (f.linhVuc === 'ALL' && nhomLQ.indexOf(f.nhom) >= 0) return true;
    return false;
  });
}

/* ============================================================
 *  PHẦN 4 — TỔNG HỢP (dùng cho Tầng 4 — Tổng hợp 6 hệ)
 * ============================================================ */

/**
 * Đếm số hệ đồng thuận một lĩnh vực theo hướng "tốt" (manh) hoặc "cần lưu ý" (yeu).
 * Trả về object: { manh: { so: N, he: [...] }, yeu: {...} }
 */
function demDongThuan_(facts, linhVuc) {
  var ds = factsTheoLinhVuc_(facts, linhVuc);
  var ket = { manh: { so: 0, he: [] }, yeu: { so: 0, he: [] } };
  var daGhi = { manh: {}, yeu: {} };
  ds.forEach(function(f) {
    if (f.loai === FACT_LOAI.MANH && !daGhi.manh[f.he]) {
      daGhi.manh[f.he] = true;
      ket.manh.so++;
      ket.manh.he.push(f.he);
    }
    if (f.loai === FACT_LOAI.YEU && !daGhi.yeu[f.he]) {
      daGhi.yeu[f.he] = true;
      ket.yeu.so++;
      ket.yeu.he.push(f.he);
    }
  });
  return ket;
}

/**
 * Tính "điểm đồng thuận" cho một lĩnh vực.
 * Mạnh cộng, yếu trừ, có trọng số. Kết quả từ -10 đến +10.
 */
function diemDongThuan_(facts, linhVuc) {
  var ds = factsTheoLinhVuc_(facts, linhVuc);
  var diem = 0;
  ds.forEach(function(f) {
    var dau = f.loai === FACT_LOAI.MANH ? 1 : f.loai === FACT_LOAI.YEU ? -1 : 0;
    diem += dau * f.trongSo;
  });
  return Math.round(Math.max(-10, Math.min(10, diem)) * 10) / 10;
}

/**
 * Gộp facts từ nhiều hệ thành một mảng phẳng — dùng khi cần xử lý chung.
 * Đầu vào: { tuvi: [...], battu: [...], chiemtinh: [...] }
 * Đầu ra:  [..., ..., ...]
 */
function gopFacts_(factsTheoHe) {
  var out = [];
  Object.keys(factsTheoHe || {}).forEach(function(k) {
    var arr = factsTheoHe[k] || [];
    arr.forEach(function(f) { out.push(f); });
  });
  return out;
}

/**
 * Lấy top N fact mạnh nhất theo trọng số.
 */
function topFactsManh_(facts, n) {
  return (facts || [])
    .filter(function(f) { return f.loai === FACT_LOAI.MANH; })
    .sort(function(a, b) { return b.trongSo - a.trongSo; })
    .slice(0, n || 5);
}

/**
 * Lấy top N fact cần lưu ý nhất theo trọng số.
 */
function topFactsYeu_(facts, n) {
  return (facts || [])
    .filter(function(f) { return f.loai === FACT_LOAI.YEU; })
    .sort(function(a, b) { return b.trongSo - a.trongSo; })
    .slice(0, n || 5);
}

/* ============================================================
 *  PHẦN 5 — TEST NHANH
 * ============================================================ */

/**
 * Chạy hàm này trong Apps Script để kiểm tra Facts.gs đã hoạt động chưa.
 * Chọn testFacts → bấm ▶ Run → xem Execution log.
 */
function testFacts() {
  var f1 = taoFact_('Tu Vi', 'Tai Bach', 'tai_chinh', 'manh',
    'Tài lộc đến tự nhiên, dễ có người giúp về tiền bạc.', 1.5,
    { nguon: 'Hóa Lộc cung Tài', tags: ['tai_loc'] });

  var f2 = taoFact_('Bat Tu', 'Tai Bach', 'tai_chinh', 'manh',
    'Nhật chủ vượng gánh được Tài, có khả năng làm giàu.', 1.8,
    { nguon: 'Thân vượng tài vượng', tags: ['tai_loc'] });

  var f3 = taoFact_('Chiem Tinh', 'ALL', 'tai_chinh', 'yeu',
    'Sao Thổ đi qua nhà tài chính, cần thắt chặt chi tiêu.', 1.0,
    { nguon: 'Saturn transit nha 2', tags: ['tai_chinh'] });

  var all = [f1, f2, f3];

  Logger.log('--- Kiểm tra tạo fact ---');
  Logger.log('Tổng số fact: ' + all.length);
  Logger.log('Số fact hợp lệ: ' + locFactLoi_(all).length);

  Logger.log('--- Lọc theo lĩnh vực Tài Bạch ---');
  var dsTaiBach = factsTheoLinhVuc_(all, 'Tai Bach');
  Logger.log('Số fact Tài Bạch: ' + dsTaiBach.length);
  dsTaiBach.forEach(function(f) { Logger.log('  · [' + f.he + '] ' + f.yNghia); });

  Logger.log('--- Đếm đồng thuận Tài Bạch ---');
  var dt = demDongThuan_(all, 'Tai Bach');
  Logger.log('Số hệ nói MẠNH: ' + dt.manh.so + ' (' + dt.manh.he.join(', ') + ')');
  Logger.log('Số hệ nói YẾU: ' + dt.yeu.so + ' (' + dt.yeu.he.join(', ') + ')');

  Logger.log('--- Điểm đồng thuận Tài Bạch ---');
  Logger.log('Điểm: ' + diemDongThuan_(all, 'Tai Bach'));

  Logger.log('✓ Nếu bạn thấy các con số và câu ở trên, Facts.gs đã hoạt động.');
}