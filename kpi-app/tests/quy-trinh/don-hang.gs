/* =====================================================================
   ĐƠN HÀNG → XƯỞNG (31/10, chủ dự án duyệt): đọc Sheet "Trạng thái đơn hàng" (CHỈ ĐỌC), phân loại từng SKU theo
   4 thông số chủ dự án chốt – LOẠI CHUÔI, LOẠI NGỌN, LOẠI TIP, LOẠI REN – rồi tách việc còn lại về từng xưởng:
     chuôi: Phôi Carbon → Phôi Thô → Sơn → In UV (nhận theo mã bán thành phẩm, giao Hoàn thiện theo SKU)
     ngọn : Phôi Carbon → Phôi Thô → Ngọn Taro → Ngọn Tip (CNC cấp típ / phíp)
     gậy  : Hoàn thiện → Đóng gói;  ngọn bán lẻ: Ngọn Tip → thẳng Đóng gói.
   Phân loại 3 lớp (chuyên gia vận hành 31/10):
     1. loại hàng (gậy / ngọn lẻ / chuôi lẻ / nối / phụ kiện)
     2. dòng gậy theo BẢNG TÊN GỌI – tên gọi dài (cụ thể) nhất thắng, hòa giữa 2 dòng -> chờ duyệt (đỏ)
     3. 4 thông số = mặc định của dòng (file THÔNG SỐ GẬY) + đọc từ tên / ghi chú đơn (ren, tip, đầu, tay)
   Độ tin cậy: xanh (chắc), vàng (dùng mặc định / dòng chung), đỏ (không xác định). Chủ sở hữu sửa tay -> sheet PhanLoaiSKU,
   lần sau gặp đúng tên đó dùng luôn. Giai đoạn đầu chỉ tài khoản chủ sở hữu (qtQuyen_).
   ===================================================================== */
var DH_SHEET_ID = '1FKrF_wyQcl0SpDhvoRBg7VoaBzgzhSJ7zZ5U2A5ReMU';   // Sheet "Trạng thái đơn hàng" (chia sẻ cho tài khoản chạy web)
var DH_TABS = ['DEALER', 'KHO', 'WEB LẺ CUSTOM', 'WEB LẺ ĐƠN THƯỜNG', 'OEM', 'A ĐÔNG', 'POD-A.BÁCH', 'POD-ECOMSTONE'];   // 07/11: thêm kênh POD-ECOMSTONE (chưa có đơn vẫn là kênh)
var DH_NHAN_TAB = { 'DEALER': 'Dealer', 'KHO': 'Kho', 'WEB LẺ CUSTOM': 'Web lẻ – Custom', 'WEB LẺ ĐƠN THƯỜNG': 'Web lẻ – Thường', 'OEM': 'OEM', 'A ĐÔNG': 'A Đông', 'POD-A.BÁCH': 'POD – A.Bách', 'POD-ECOMSTONE': 'POD – Ecomstone' };
var DH_CACHE_GIAY = 300;   // Sheet đơn thay đổi liên tục: nhớ tạm 5 phút, có nút "Làm mới"
var PL_SHEET = 'PhanLoaiSKU';
var PL_COT = ['TenChuan', 'TenHang', 'LoaiHang', 'Dong', 'Chuoi', 'Ngon', 'Tip', 'Ren', 'GhiChu', 'NguoiSua', 'ThoiDiem'];
/* Cột bộ phận trong Sheet đơn (dò theo tiêu đề) -> chặng */
var DH_CHANG = [['PHOI', /^PHÔI CỦA/], ['SON', /^SƠN CỦA/], ['TARO', /^TARO CỦA/], ['TIP', /LÀM ĐẦU/], ['UV', /^UV CỦA/], ['HT', /^HOÀN THIỆN CỦA/], ['DG', /TỔNG CỘNG HÀNG ĐG|ĐÓNG GÓI CỦA/]];

var PL_LOAI = { GAY: 'Gậy (ngọn + chuôi)', NGON: 'Ngọn bán lẻ', CHUOI: 'Chuôi bán lẻ', NOI: 'Tay nối', PK: 'Phụ kiện / không sản xuất' };
var PL_CHUOI = {
  GF736DP: 'GF 736 đánh phá', GF736HK: 'GF 736 hạ khấc (chỉ foam, có đạn)', GF740: 'GF 740 (1480/2) lót trắng – 5/16-18',
  GF1480: 'GF 1450/1480 chặt đôi', GFFOAM: 'GF 100% foam lót trắng (Cuebots CG)', GFCBFOAM: 'GF vỏ carbon 736 chỉ foam',
  GFCB313: 'GF vỏ carbon 31.3 (Cuebots Z)', MIXCB: 'Mix vỏ carbon 21.3/30.8 vách 2mm', MIXCB25: 'Mix vỏ carbon 21.3/30.8 vách 2.5mm (tay da)',
  MIXCBPHA: 'Mix vỏ carbon 21.3/31.3 (phá)', NHAY33013: 'Nhảy 330-130', NHAY28015: 'Nhảy 280-150', NHAY390: 'Nhảy 390', PHANHAY: 'Phá nhảy 350-385',
  NHAY305: 'Nhảy 305-205', VUTRU: 'Vũ trụ (Raptor)', ECL: 'Chuôi Eclipse lót bạc', CAROM: 'Carom 720', KHONG: '—'
};
var PL_NGON = {
  FC: 'Full carbon T700 747 (30")', FCPHA: 'Full carbon phá 13.0–13.2', FCNHAY: 'Full carbon nhảy 13.9', MIX: 'Mix carbon 29" 12.5 (EVO 1/2)',
  MIXFOAM: 'Mix chỉ foam T700 747', MIXPHA: 'Mix 29" phá 13.0–13.2', NHAY139: 'Nhảy 13.9 GF lõi / vỏ carbon', GF29: 'Glassfiber 29"',
  GF1480: 'GF 1480/2 – 1450/2', GFCB: 'GF vỏ carbon 736 12.5', G750CB: 'G750 bọc carbon (Z-Wave)', ZLUK: 'Mix carbon full foam (Z-Luk)',
  CAROM: 'Carom 710 12.0', KHONG: '—'
};
var PL_TIP = {
  TIME3: 'Time 3 (Crystal)', TIMEK: 'Time 9 xanh 1 đen', DEN7: 'Đen 7 lớp / microfiber', BAK: 'Bakelite (phá / nhảy)', NISHIKI: 'Nishiki',
  ZAN: 'Zan', KAMUI: 'Kamui', CB8: 'Cuebots 8 lớp da lợn', DALON: 'Da lợn', TIME4: 'Time 4 (carom)', KHONG: '—'
};
var PL_REN = { R388: '3/8-8', R3810: '3/8-10', R3811: '3/8-11', R3814: '3/8-14', R51614: '5/16-14', R51618: '5/16-18', UNI: 'Uniloc / UNI-QR',
  QLOC: 'Q-loc', RADIAL: 'Radial', VQR: 'Quick release (VQR)', PSJ: 'Speed joint (PSJ)', WAVY: 'Wavy', VP2: 'VP2', KHONG: '—' };

/* Bảng dòng gậy: [mã, tên, loại hàng, [tên gọi], chuôi, ngọn, tip, ren, chắc chắn?, chuôi khi tay da sport]
   Lấy từ file THÔNG SỐ GẬY (Rhino 2024/2025, EVO, Omega, Raptor, Cuebots, X-Billiards, A Ánh, Aplus) + tên hàng trong đơn 31/10. */
var PL_DONG = [
  ['EVO1', 'EVO 1 (Beast / Freedom / Rebel / Warrior)', 'GAY', ['EVO1', 'EVO 1', 'EVO BEAST', 'EVO FREEDOM', 'EVO REBEL', 'EVO WARRIOR'], 'GF736HK', 'MIX', 'TIMEK', 'R388', 1],
  ['EVO2', 'EVO 2 (Crown / Crystal / Recon)', 'GAY', ['EVO2', 'EVO 2', 'EVO CROWN', 'EVO RECON', 'EVO CRYSTAL'], 'GF736HK', 'MIX', 'TIMEK', 'R388', 1],
  ['EVO4', 'EVO 4 (Luna / Royale / Punisher / Camo)', 'GAY', ['EVO4', 'EVO 4', 'EVO LUNA', 'EVO ROYALE', 'EVO PUNISHER'], 'GF736HK', 'GF29', 'TIMEK', 'R3810', 1],
  ['EVO5', 'EVO 5 (Meg / Gemstone / Pirate)', 'GAY', ['EVO5', 'EVO 5', 'EVO MEG', 'EVO GEMSTONE', 'EVO PIRATE'], 'GF740', 'GF1480', 'DEN7', 'R51618', 1],
  ['EVOX', 'EVO phá X-1 / X-2 / X-Force', 'GAY', ['EVO/BREAK/X', 'X-FORCE', 'EVO X', 'GAY PHA TK'], 'GF736DP', 'MIXPHA', 'BAK', 'R388', 1],
  ['EVOVAL', 'EVO phá nhảy Valkyrie (VAL)', 'GAY', ['EVO/BREAK&JUMP/VAL', 'VALKYRIE', 'PHA NHAY EVO VAL', 'EVO VAL'], 'PHANHAY', 'MIXPHA', 'BAK', 'R388', 1],
  ['EVOPEG', 'EVO nhảy Pegasus (PEG, 3 khúc)', 'GAY', ['EVO/JUMP/PEG', 'PEGASUS', 'EVO PEG'], 'NHAY28015', 'NHAY139', 'BAK', 'R388', 1],
  ['EVOIG', 'EVO nhảy IG (2 khúc)', 'GAY', ['EVO/JUMP/IG', 'EVO IG'], 'NHAY390', 'NHAY139', 'BAK', 'R388', 1],
  ['EVOCHUNG', 'EVO (chưa rõ dòng)', 'GAY', ['EVO'], 'GF736HK', 'MIX', 'TIMEK', 'R388', 0],
  ['TKNHAY', 'Aplus SAM TK nhảy (390-100)', 'GAY', ['GAY NHAY TK', 'TK PRO', 'SAM TK'], 'NHAY390', 'NHAY139', 'BAK', 'R388', 1],
  ['PHANHAY2', 'Gậy phá nhảy chia 2 màu', 'GAY', ['GAY PHA NHAY CHIA 2 MAU', 'PHA NHAY CHIA 2 MAU'], 'PHANHAY', 'MIXPHA', 'BAK', 'R388', 0],
  ['CLUB', 'Gậy CLB / house (RHI68 / RHI88 / R68 / EVO6 Club)', 'GAY', ['RHI68', 'RHI88', 'R68', 'R88', 'CLUB & HOUSE', 'EVO6/CLUB', 'CLUB -', 'HOUSE CUE'], 'GF740', 'GF1480', 'DEN7', 'R51618', 1],
  ['CBCH', 'Cuebots CHS / CHL (1450 / 1480 chặt đôi)', 'GAY', ['CB-CH/', 'CHS1', 'CHS2', 'CHL1', 'CHL2', 'CHS', 'CHL'], 'GF1480', 'GF1480', 'DEN7', 'R51618', 1],
  ['CBCG', 'Cuebots CGW / CGC (ren 3/8-10)', 'GAY', ['CB-CG/', 'CGW', 'CGC'], 'GFFOAM', 'GF29', 'DEN7', 'R3810', 1],
  ['CBCGP', 'Cuebots CGP (Uniloc)', 'GAY', ['CB-CG/CGP', 'CGP'], 'GFFOAM', 'GF29', 'DEN7', 'UNI', 1],
  ['CBZ', 'Cuebots Z-Pure / Z Fusion (ZF)', 'GAY', ['CB-ZF/', 'Z FUSION', 'Z-FUSION', 'Z-PURE', 'Z PURE', 'Z-SP'], 'GFCB313', 'FC', 'CB8', 'R388', 1],
  ['CBZLUK', 'Cuebots Z-Luk', 'GAY', ['Z LUK', 'Z-LUK', 'ZLUK'], 'GFCB313', 'ZLUK', 'CB8', 'R388', 1],
  ['CBZW', 'Cuebots Z-Wave (ZW)', 'GAY', ['CB-ZW/', 'Z WAVE', 'Z-WAVE', 'ZWAVE'], 'GFCB313', 'G750CB', 'DEN7', 'RADIAL', 1],
  ['ALLINKS', 'Allin KS / Destiny (chuôi chỉ foam, ngọn G vỏ CB)', 'GAY', ['ALLIN-KS', 'ALLIN KS', 'ALLIN DESTINY'], 'GFCBFOAM', 'GFCB', 'DEN7', 'R388', 1],
  ['ALLINCRAZY', 'Allin Crazy', 'GAY', ['ALLIN CRAZY', 'CRAZY'], 'GF1480', 'GFCB', 'DEN7', 'R388', 1],
  ['WOLFWF', 'Wolf WF (poker)', 'GAY', ['WOLF-WF', 'WOLF WF'], 'GFCBFOAM', 'GFCB', 'DEN7', 'RADIAL', 1],
  ['WOLFCLB', 'Wolf CLB 1450/2', 'GAY', ['WOLF-CLB', 'WOLF CLB'], 'GF1480', 'GF1480', 'DEN7', 'R51618', 1],
  ['ALLINCHUNG', 'X-Billiards / Allin (chưa rõ dòng)', 'GAY', ['ALLIN', 'WOLF', 'LEGEND', 'CREST'], 'GF736HK', 'FC', 'DEN7', 'R388', 0],
  ['NEBULA', 'Rhino Nebula', 'GAY', ['NEBULA'], 'MIXCB', 'FC', 'TIME3', 'R388', 1, 'MIXCB25'],
  ['RETRO', 'Rhino Retro', 'GAY', ['RHI2-RETRO', 'RETRO II', 'RETRO'], 'MIXCB', 'FC', 'TIME3', 'R388', 1],
  ['MUST', 'Rhino Must', 'GAY', ['RHI2-MUST', 'RHINO MUST', 'MUST', 'MU1', 'MU2', 'MU3', 'MU4', 'MU5'], 'MIXCB', 'FC', 'TIME3', 'R388', 0],
  ['ECLIPSE', 'Rhino Eclipse II', 'GAY', ['RHI2-ECLIPSE', 'ECLIPSE II', 'ECLIPSE'], 'ECL', 'FC', 'NISHIKI', 'R388', 1],
  ['IRC', 'Rhino IRC', 'GAY', ['IRC'], 'ECL', 'FC', 'NISHIKI', 'R388', 1],
  ['BEER', 'Rhino Bia Hơi / Beer (cấu hình như Retro)', 'GAY', ['BIA HOI', 'GAY BEER'], 'MIXCB', 'FC', 'TIME3', 'R388', 1],
  ['KOMET', 'Rhino Komet 2 (phá)', 'GAY', ['KOMET', 'RHI2-KOMET'], 'MIXCBPHA', 'FCPHA', 'BAK', 'R388', 1],
  ['VOYAGER', 'Rhino Voyager đánh', 'GAY', ['VOYAGER', 'ALLSTAR'], 'MIXCB', 'FC', 'TIME3', 'R388', 1],
  ['VOYBREAK', 'Rhino Voyager phá', 'GAY', ['VOYAGER - USA BREAK', 'VOYAGER BREAK', 'USA BREAK'], 'MIXCBPHA', 'FCPHA', 'BAK', 'R388', 1],
  ['RHJUMP', 'Rhino nhảy (Jump / Parkour / Voyager Jump)', 'GAY', ['RHINO JUMP', 'PARKOUR', 'VOYAGER USA JUMP', 'USA JUMP'], 'NHAY33013', 'FCNHAY', 'BAK', 'R388', 1],
  ['LUMINAX', 'Rhino Luminax / Camo / Racing', 'GAY', ['LUMINAX', 'CAMO', 'RACING'], 'GFCBFOAM', 'MIXFOAM', 'TIME3', 'R388', 1],
  ['VIETNAM', 'Gậy Việt Nam (Tôi yêu VN / Lửa Việt)', 'GAY', ['LUA VIET', 'TOI YEU VN', 'VIET NAM'], 'MIXCB', 'FC', 'TIME3', 'R388', 0, 'MIXCB25'],
  ['OMEGA', 'Omega (Uniloc)', 'GAY', ['OMEGA'], 'GF736HK', 'MIXFOAM', 'TIMEK', 'UNI', 1],
  ['RAPTOR', 'Raptor', 'GAY', ['RAPTOR'], 'VUTRU', 'FC', 'KAMUI', 'UNI', 1],
  ['DRAGON', 'Dragon / Aileex Lux / Legend', 'GAY', ['DRAGON', 'AILEEX', 'LUX'], 'GF736HK', 'FC', 'TIME3', 'R388', 1],
  ['CAROM', 'Carom 2025', 'GAY', ['CAROM'], 'CAROM', 'CAROM', 'TIME4', 'R388', 1],
  ['THUE', 'Gậy thuê (chưa có thông số)', 'GAY', ['GAY THUE'], 'GF736DP', 'GFCB', 'DALON', 'R388', 0],
  // Ngọn bán lẻ (đi Phôi → Taro → Tip → thẳng Đóng gói)
  ['NG-RHINO', 'Ngọn carbon Rhino (single shaft)', 'NGON', ['SINGLE SHAFT', 'SNOOKER & ENGLISH POOL SHAFT', 'C30PT', 'NGON DANH CARBON RHINO', 'MUST SHAFT', 'SHAFT ONLY'], 'KHONG', 'FC', 'TIME3', '', 1],
  ['NG-BREAK', 'Ngọn phá carbon', 'NGON', ['BREAK SHAFT'], 'KHONG', 'FCPHA', 'BAK', 'R388', 1],
  ['NG-KOMET', 'Ngọn Komet 2 (phá, 13.0, ren 3/8-8)', 'NGON', ['KOMET BREAK SHAFT', 'KOMET II', 'KOMET'], 'KHONG', 'FCPHA', 'BAK', 'R388', 1],
  ['NG-CAROM', 'Ngọn carom carbon', 'NGON', ['CAROM SINGLE SHAFT'], 'KHONG', 'CAROM', 'TIME4', '', 1],
  ['NG-ZWAVE', 'Ngọn Z-Wave', 'NGON', ['Z-WAVE CARBON SINGLE SHAFT', 'NGON DANH ZWAVE'], 'KHONG', 'G750CB', 'DEN7', '', 1],
  ['NG-ZNITRO', 'Ngọn Cuebots Z-Nitro', 'NGON', ['Z NITRO', 'Z-NITRO'], 'KHONG', 'FC', 'CB8', 'R388', 1],
  ['NG-HORNET', 'Ngọn nhảy Hornet', 'NGON', ['HORNET'], 'KHONG', 'NHAY139', 'BAK', 'R388', 0],
  ['NG-CREST', 'Ngọn đánh Crest', 'NGON', ['CREST S'], 'KHONG', 'FC', 'ZAN', 'R388', 0],
  ['NG-CHUNG', 'Ngọn lẻ (chưa rõ dòng)', 'NGON', [], 'KHONG', 'FC', 'TIME3', '', 0],
  // Chuôi bán lẻ
  ['CH-LUMINAX', 'Chuôi Luminax / Racing', 'CHUOI', ['LUMINAX CUE BUTT', 'RACING CUE BUTT'], 'GFCBFOAM', 'KHONG', 'KHONG', 'R388', 1],
  ['CH-RETRO', 'Chuôi Retro (mix vỏ carbon, hạ khấc bạc)', 'CHUOI', ['RETRO POOL CUE BUTT', 'RETRO CUE BUTT'], 'MIXCB', 'KHONG', 'KHONG', 'R388', 1],
  ['CH-RHINO', 'Chuôi Rhino (chưa rõ dòng, vd. Must)', 'CHUOI', ['MUST CUE BUTT', 'CUE BUTT'], 'MIXCB', 'KHONG', 'KHONG', 'R388', 0],
  ['NOI', 'Tay nối (extension)', 'NOI', [], 'KHONG', 'KHONG', 'KHONG', 'KHONG', 1],
  ['PK', 'Phụ kiện', 'PK', [], 'KHONG', 'KHONG', 'KHONG', 'KHONG', 1]
];

var PL_DAU_MD = { 'NG-ZWAVE': '12.5', 'NG-KOMET': '13.0', 'KOMET': '13.0', 'CBZW': '12.5', 'CBZ': '12.5', 'CBZLUK': '12.5' };   // đầu mặc định theo Thông số gậy
function plChuan_(s) {   // HOA, bỏ dấu, gộp khoảng trắng – để so tên gọi
  return String(s || '').toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/Đ/g, 'D').replace(/[–—]/g, '-')
    .replace(/[“”"″]/g, '"').replace(/\s+/g, ' ').trim();
}
var __PL_RE = null;
function plDongRe_() {
  if (__PL_RE) return __PL_RE;
  __PL_RE = [];
  PL_DONG.forEach(function(d) {
    (d[3] || []).forEach(function(a) {
      var e = plChuan_(a).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      var sau = /[A-Z0-9]$/.test(plChuan_(a)) ? '(?=$|[^A-Z])' : '';   // sau tên gọi được có số (RHI2-KOMET2, VAL1); tên gọi kết thúc bằng "/" thì không cần ranh giới
      __PL_RE.push({ dong: d[0], loai: d[2], dai: a.length, re: new RegExp('(?:^|[^A-Z0-9])' + e + sau) });
    });
  });
  return __PL_RE;
}
function plTimDong_(ma) { for (var i = 0; i < PL_DONG.length; i++) if (PL_DONG[i][0] === ma) return PL_DONG[i]; return null; }

/* Loại hàng từ tên + ghi chú đơn */
function plLoaiHang_(t, g) {
  if (/CHI DAT NOI/.test(g)) return 'NOI';
  if (/GLOVE|CUE CASE|SOFT CUE CASE|HARD CUE CASE|T-SHIRT|POLO|PATCH|WEIGHT BOLT|JOINT TESTER|POOL CUE TIP|^NISHIKI|^ZAN TIP|BAO CO|GANG TAY/.test(t)) return 'PK';
  if (/EXTENSION|(^|[^A-Z])NOI([^A-Z]|$)|TAY NOI/.test(t)) return 'NOI';
  if (/CUE BUTT|BUTT ONLY/.test(t) || /CHI GUI CHUOI/.test(g)) return 'CHUOI';
  if (/SHAFT|^NGON|C30PT/.test(t) || /CHI GUI NGON/.test(g)) return 'NGON';
  return 'GAY';
}
/* Ren đọc từ tên / ghi chú. Trả mã PL_REN hoặc '' */
function plRen_(t, g) {
  var x = t + ' | ' + g;
  var m = x.match(/JOINT(?: TYPE)?:*\s*([^_|]+)/);   // "_Joint: 3/8-10" trong ghi chú đơn web ưu tiên
  var tim = function(s) {
    if (/UNI-?QR|UNILOC|\/U\//.test(s)) return 'UNI';
    if (/Q-?LOC/.test(s)) return 'QLOC';
    if (/VQR|QUICK RELEASE/.test(s)) return 'VQR';
    if (/PSJ|SPEED JOINT/.test(s)) return 'PSJ';
    if (/WAVY/.test(s)) return 'WAVY';
    if (/VP2/.test(s)) return 'VP2';
    if (/RADIAL/.test(s)) return 'RADIAL';
    if (/5\/16[-\/ ]?14/.test(s)) return 'R51614';
    if (/5\/16[-\/ ]?18|51618|\/18\//.test(s)) return 'R51618';
    if (/3\/8[-\/ ]?14/.test(s)) return 'R3814';
    if (/3\/8[-\/ ]?11/.test(s)) return 'R3811';
    if (/3\/8[-\/ ]?10|\/10\//.test(s)) return 'R3810';
    if (/3\/8[-\/ ]?8|\/388\/|\(3\/8-8\)/.test(s)) return 'R388';
    return '';
  };
  if (m) { var r1 = tim(m[1]); if (r1) return r1; }
  var r = tim(x);
  if (r) return r;
  var c = t.match(/C30PT[\d.]+\/[\d.,]+\/(\w+)/);   // RHI2-C30PT21.5/11.8/18
  if (c) return { '18': 'R51618', '10': 'R3810', '8': 'R388', 'QLOC': 'QLOC', 'U': 'UNI' }[c[1]] || '';
  return '';
}
function plTip_(t, g) {
  var x = t + ' | ' + g;
  if (/NISHIKI/.test(x)) return 'NISHIKI';
  if (/ZAN TIP|TIP ZAN/.test(x)) return 'ZAN';
  if (/KAMUI/.test(x)) return 'KAMUI';
  if (/TIP DA LON|PIG SKIN/.test(x)) return 'DALON';
  if (/TIME CRYSTAL|NEW TIME/.test(x)) return 'TIME3';
  return '';
}
function plDau_(t) {   // đường kính đầu ngọn
  var m = t.match(/(?:^|[^\d.])(9\.5|10\.5|1[0-4][.,]\d)(?:\s*MM)?(?=$|[^\d])/);
  if (m) return m[1].replace(',', '.');
  m = t.match(/(?:^|[^\d.])(1[0-4])\s*MM/);   // "Carom Single Shaft 12mm"
  return m ? m[1] + '.0' : '';
}
function plTay_(t) {
  if (/SPORT WRAP|SPORT/.test(t)) return 'SPORT';
  if (/WRAPLESS|\/NW\/|TAY TRON/.test(t)) return 'TRON';
  if (/LEATHER WRAP|\/LW|TAY DA/.test(t)) return 'DA';
  return '';
}

/* Phân loại 1 dòng hàng. sua = bản sửa tay (PhanLoaiSKU) nếu có */
/* Kiểu gậy + chất liệu (01/11, chủ dự án): Đánh / Nhảy / Phá / Phá nhảy; Full carbon → Mix carbon+GF → Glassfiber.
   GF vỏ carbon / G750 bọc carbon / nhảy 13.9 GF lõi vỏ carbon = Mix. Chuôi bán lẻ lấy chất liệu theo chuôi, còn lại theo ngọn. */
var PL_KIEU = { DANH: 'Đánh', NHAY: 'Nhảy', PHA: 'Phá', PHANHAY: 'Phá nhảy' };
var PL_VL = { FC: 'Full carbon', MIX: 'Mix carbon + glassfiber', GF: 'Glassfiber', KHAC: 'Khác / chưa rõ' };
var PL_VL_NGON = { FC: 'FC', FCPHA: 'FC', FCNHAY: 'FC', MIX: 'MIX', MIXFOAM: 'MIX', MIXPHA: 'MIX', NHAY139: 'MIX', GFCB: 'MIX', G750CB: 'MIX', ZLUK: 'MIX', GF29: 'GF', GF1480: 'GF' };
var PL_VL_CHUOI = { MIXCB: 'MIX', MIXCB25: 'MIX', MIXCBPHA: 'MIX', GFCBFOAM: 'MIX', GFCB313: 'MIX', GF736DP: 'GF', GF736HK: 'GF', GF740: 'GF', GF1480: 'GF', GFFOAM: 'GF' };
function plKieu_(o) {
  var c = o.chuoi || '', n = o.ngon || '';
  var kc = PL_KIEU_KHUC[c] || '', kn = PL_KIEU_KHUC[n] || '';   // 02/11: kiểu của loại chuôi / ngọn chủ dự án thêm trên web
  o.kieu = (c === 'PHANHAY' || kc === 'PHANHAY' || kn === 'PHANHAY') ? 'PHANHAY' : (/PHA$/.test(n) || c === 'GF736DP' || c === 'MIXCBPHA' || kc === 'PHA' || kn === 'PHA') ? 'PHA' : (/NHAY/.test(n) || /^NHAY/.test(c) || kc === 'NHAY' || kn === 'NHAY') ? 'NHAY' : 'DANH';
  o.vl = (o.loai === 'CHUOI' ? PL_VL_CHUOI[c] : (PL_VL_NGON[n] || PL_VL_CHUOI[c])) || 'KHAC';
  /* 02/11 (chủ dự án): 2 nhãn chất liệu – chuôi và ngọn có thể khác nhau. '' = SKU không có khúc đó */
  var coC = o.loai === 'GAY' || o.loai === 'CHUOI', coN = o.loai === 'GAY' || o.loai === 'NGON';
  o.vlC = coC ? (PL_VL_CHUOI[c] || 'KHAC') : '';
  o.vlN = coN ? (PL_VL_NGON[n] || 'KHAC') : '';
  return o;
}
function plPhanLoai_(ten, ghiChu, sua) { return plKieu_(plPhanLoai0_(ten, ghiChu, sua)); }
function plPhanLoai0_(ten, ghiChu, sua) {
  var t = plChuan_(ten), g = plChuan_(ghiChu);
  var o = { loai: '', dong: '', chuoi: '', ngon: '', tip: '', ren: '', dau: plDau_(t), tay: plTay_(t), tin: 'xanh', nguon: 'tu-dong', lyDo: [] };
  if (sua) {
    o.loai = sua.LoaiHang; o.dong = sua.Dong; o.chuoi = sua.Chuoi; o.ngon = sua.Ngon; o.tip = sua.Tip; o.ren = sua.Ren;
    o.nguon = 'duyet'; return o;
  }
  o.loai = plLoaiHang_(t, g);
  if (o.loai === 'NGON' && /C30PT/.test(t)) t = t + ' SINGLE SHAFT';   // RHI2-C30PT21.5/11.8/18 = ngọn carbon 30" bán lẻ
  if (o.loai === 'PK' || o.loai === 'NOI') { o.dong = o.loai; o.chuoi = o.ngon = o.tip = 'KHONG'; o.ren = 'KHONG'; return o; }
  // dòng: tên gọi dài nhất thắng, chỉ xét dòng cùng loại hàng (gậy / ngọn / chuôi)
  var best = 0, ds = {};
  plDongRe_().forEach(function(a) {
    if (a.loai !== o.loai || !a.re.test(t)) return;
    if (a.dai > best) { best = a.dai; ds = {}; }
    if (a.dai === best) ds[a.dong] = 1;
  });
  var tim = Object.keys(ds);
  if (tim.length > 1) { o.tin = 'do'; o.lyDo.push('khớp nhiều dòng: ' + tim.join(', ')); }
  var d = plTimDong_(tim[0] || (o.loai === 'NGON' ? 'NG-CHUNG' : ''));
  if (!d) { o.tin = 'do'; o.lyDo.push('không nhận ra dòng gậy'); o.chuoi = o.loai === 'NGON' ? 'KHONG' : ''; o.ngon = o.loai === 'CHUOI' ? 'KHONG' : ''; o.tip = ''; o.ren = plRen_(t, g); return o; }
  o.dong = d[0];
  o.chuoi = (o.tay === 'SPORT' && d[9]) ? d[9] : d[4];
  o.ngon = d[5]; o.tip = d[6];
  if (!d[8] && o.tin === 'xanh') { o.tin = 'vang'; o.lyDo.push('dòng chung / chưa có thông số chắc chắn'); }
  var ren = plRen_(t, g);
  if (ren) o.ren = ren;
  else if (d[7]) { o.ren = d[7]; if (o.loai === 'NGON' && o.tin === 'xanh') { o.tin = 'vang'; o.lyDo.push('ren lấy mặc định của dòng'); } }
  else { o.ren = ''; if (o.tin !== 'do') { o.tin = 'vang'; o.lyDo.push('chưa đọc được ren'); } }
  var tip = plTip_(t, g);
  if (tip) o.tip = tip;
  if (!o.dau && PL_DAU_MD[d[0]]) o.dau = PL_DAU_MD[d[0]];
  if (o.loai === 'NGON' && !o.dau && o.tin === 'xanh' && o.ngon !== 'FCPHA' && o.ngon !== 'NHAY139' && o.ngon !== 'FCNHAY') { o.tin = 'vang'; o.lyDo.push('chưa đọc được đường kính đầu'); }
  return o;
}

/* ---------- đọc Sheet đơn hàng (chỉ đọc) ---------- */
function dhSo_(v) {
  if (typeof v === 'number') return isFinite(v) ? v : 0;
  var s = String(v == null ? '' : v).replace(/,/g, '').trim();
  return /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : 0;   // chữ / ngày / "chờ phôi" -> 0 (không đoán số từ chuỗi lạ)
}
function dhNgay_(v, nam) {   // deadline dd/mm (Sheet hay đảo ngày/tháng) -> 'yyyy-mm-dd'
  var d, m;
  if (Object.prototype.toString.call(v) === '[object Date]') {
    if (isNaN(v.getTime())) return '';
    var dd = Number(Utilities.formatDate(v, TZ_VN, 'dd')), mm = Number(Utilities.formatDate(v, TZ_VN, 'MM'));
    if (dd > 12) { d = dd; m = mm; } else { d = mm; m = dd; }   // giống script đơn hàng: ngày ≤ 12 là bị đảo
  } else {
    var x = String(v || '').match(/(\d{1,2})\s*\/\s*(\d{1,2})/);
    if (!x) return '';
    d = Number(x[1]); m = Number(x[2]);
  }
  if (!(d >= 1 && d <= 31 && m >= 1 && m <= 12)) return '';
  return nam + '-' + ('0' + m).slice(-2) + '-' + ('0' + d).slice(-2);
}
function dhDocTab_(sh, tab, nam, gioiHan) {
  // Chỉ đọc tới cột cần dùng (Sheet có hàng trăm cột "ngày nhận hàng" phía sau); tab tự thêm: giới hạn số dòng (02/11)
  var nr = sh.getLastRow(), nc = Math.min(sh.getLastColumn(), 60);
  if (gioiHan && nr > gioiHan) nr = gioiHan;
  if (nr < 2 || nc < 2) return [];
  var dau = sh.getRange(1, 1, Math.min(nr, 10), nc).getValues(), hi = -1;
  for (var r = 0; r < dau.length; r++) {
    var j = dau[r].join('|').toUpperCase();
    if (j.indexOf('LOẠI HÀNG') >= 0 || j.indexOf('SL ĐẶT') >= 0) { hi = r; break; }
  }
  if (hi < 0) return [];
  var h = dau[hi].map(function(x) { return String(x == null ? '' : x).trim().toUpperCase(); });
  var tim = function(ks) { for (var i = 0; i < h.length; i++) for (var k = 0; k < ks.length; k++) if (h[i].indexOf(ks[k]) >= 0) return i; return -1; };
  var cTen = tim(['LOẠI HÀNG']), cPhoi = tim(['LOẠI PHÔI']), cSL = tim(['SỐ LƯỢNG ĐẶT', 'SL ĐẶT']), cThieu = tim(['CÒN THIẾU']), cDL = tim(['DEADLINE']), cCT = tim(['CHÚ THÍCH']), cKenh = tim(['KÊNH', 'NGUỒN ĐƠN']), cHanMoi = tim(['HẠN MỚI']), cGiao = tim(['CÓ THỂ GIAO']), cTra = tim(['ĐÃ TRẢ KHÁCH', 'HÀNG ĐI']);
  if (cTen < 0) cTen = 1;
  var chang = {}, hong = {}, hen = {};
  /* 07/11 (theo ORDER·FLOW): cột "Ngày hẹn trả …" của từng công đoạn (BP60 = Phôi) */
  h.forEach(function(x, i) { if (x.indexOf('NGÀY HẸN TRẢ') < 0) return; var k = /BP60|PHÔI/.test(x) ? 'PHOI' : /SƠN/.test(x) ? 'SON' : /TARO/.test(x) ? 'TARO' : /TIP|ĐẦU/.test(x) ? 'TIP' : /UV/.test(x) ? 'UV' : /HT|HOÀN THIỆN/.test(x) ? 'HT' : ''; if (k && hen[k] == null) hen[k] = i; });
  DH_CHANG.forEach(function(c) {
    for (var i = 0; i < h.length; i++) if (c[1].test(h[i])) {
      chang[c[0]] = i;
      for (var k = i + 1; k <= i + 3 && k < h.length; k++) if (/HỎNG/.test(h[k])) { hong[c[0]] = k; break; }   // "Hỏng cần làm bù" đứng ngay sau cột bộ phận
      break;
    }
  });
  var cMax = Math.max.apply(null, [cTen, cPhoi, cSL, cThieu, cDL, cCT, cKenh, cHanMoi, cGiao, cTra].concat(Object.keys(chang).map(function(k) { return chang[k]; }), Object.keys(hong).map(function(k) { return hong[k]; }), Object.keys(hen).map(function(k) { return hen[k]; }))) + 1;
  var v = sh.getRange(1, 1, nr, Math.max(1, cMax)).getValues();
  var out = [], ma = '', trong = 0, uuDon = '', nhom = '';   // nhom: dòng tiêu đề nhóm ghi tên kênh (tab HT chép nhiều kênh vào 1 tab)
  for (var r2 = hi + 1; r2 < v.length; r2++) {
    var row = v[r2], ten = String(row[cTen] == null ? '' : row[cTen]).trim(), m0 = String(row[0] == null ? '' : row[0]).trim();
    if (!ten && !m0) { if (++trong >= 200) break; continue; }
    trong = 0;
    if (dhSo_(row[cSL]) <= 0) { var kn0 = dhKenhTen_(m0) || dhKenhTen_(ten); if (kn0) { nhom = kn0; continue; } }
    if (dhLaGhiChu_(m0, ten, row)) continue;   // 07/11 (theo ORDER·FLOW): dòng ghi chú chung ("CẦN THÊM … 300PCS/TUẦN") không phải đơn, không đổi mã đơn
    if (m0 && dhLaMa_(m0)) { ma = m0; uuDon = dhUuTien_(m0) ? ma : ''; }   // 07/11: mã nhóm không có chữ số (vd #DEMO) vẫn là mã đơn   // 03/11: "ưu tiên" ở ô mã đơn -> cả đơn ưu tiên (các dòng sau cùng mã)
    var sl = dhSo_(row[cSL]);
    if (!ten || sl <= 0) continue;
    var o = { tab: tab, kenh: DH_NHAN_TAB[tab] || tab, maDon: m0 || ma, ten: ten.replace(/\s+/g, ' '), ghiChu: [cPhoi >= 0 ? row[cPhoi] : '', cCT >= 0 ? row[cCT] : ''].map(function(x) { return String(x == null ? '' : x).replace(/\s+/g, ' ').trim(); }).filter(Boolean).join(' · ').slice(0, 300),
      sl: sl, thieu: cThieu >= 0 ? Math.max(0, dhSo_(row[cThieu])) : Math.max(0, sl - (cTra >= 0 ? dhSo_(row[cTra]) : 0)),   // không có cột "Còn thiếu" -> đặt − đã trả (không coi là đã xong)
      dl: cDL >= 0 ? dhNgay_(row[cDL], nam) : '', qua: {}, hong: {},
      giao: cGiao >= 0 ? Math.max(0, dhSo_(row[cGiao])) : 0, daTra: cTra >= 0 ? Math.max(0, dhSo_(row[cTra])) : 0,
      phoi: cPhoi >= 0 ? String(row[cPhoi] == null ? '' : row[cPhoi]).replace(/\s+/g, ' ').trim().slice(0, 120) : '',
      chuThich: cCT >= 0 ? String(row[cCT] == null ? '' : row[cCT]).replace(/\s+/g, ' ').trim().slice(0, 200) : '' };
    dhMaDon_(o, nam);
    var uu = [];   // 03/11 (chủ dự án): mã có chữ "ưu tiên" ở bất kỳ ô nào của dòng (cột loại phôi, hạn mới, ghi chú…); giữ lời ghi kèm
    for (var cu = (m0 && dhLaMa_(m0)) ? 1 : 0; cu < row.length; cu++) { var t = row[cu]; if (typeof t === 'string' && dhUuTien_(t)) { t = t.replace(/\s+/g, ' ').trim(); if (uu.indexOf(t) < 0) uu.push(t); } }
    if (uu.length) o.uuTien = uu.join(' · ').slice(0, 160);
    if (uuDon && o.maDon === uuDon) { o.uuDon = 1; o.uuTien = 'Cả đơn ưu tiên' + (o.uuTien ? ' · ' + o.uuTien : ''); }
    Object.keys(chang).forEach(function(k) {   // ô trống = chưa ghi (bỏ qua), khác với ghi số 0
      var cell = row[chang[k]];
      if (typeof cell === 'number' || /^\s*\d+(\.\d+)?\s*$/.test(String(cell == null ? '' : cell))) o.qua[k] = Math.min(sl, Math.max(0, dhSo_(cell)));
    });
    Object.keys(hong).forEach(function(k) { var x = dhSo_(row[hong[k]]); if (x > 0) o.hong[k] = Math.min(sl, x); });
    Object.keys(hen).forEach(function(k) { var x = dhNgay_(row[hen[k]], nam); if (x) (o.hen = o.hen || {})[k] = x; });
    if (cHanMoi >= 0) { var hm = dhNgay_(row[cHanMoi], nam); if (hm) o.hanMoi = hm; }
    if (cKenh >= 0) { var kc = dhKenhTen_(row[cKenh]); if (kc) o.kenhCot = kc; }
    if (nhom) o.kenhNhom = nhom;
    out.push(o);
  }
  return out;
}
/* 07/11 (theo ORDER·FLOW): dòng ghi chú chung trong Sheet đơn – có từ khóa ghi chú và ít ô có dữ liệu */
var DH_GHI_CHU = /CHÚ Ý|\bNOTE\b|TẤT CẢ CÁC GẬY|DÙNG CHO|CẦN THÊM|STOCK KHO|CẬP NHẬT|TRỌNG LƯỢNG|1 TUẦN|\/TUẦN|HỢP ĐỒNG|\bHSG\b/;
function dhLaGhiChu_(m0, ten, row) {
  var t = (String(m0 || '') + ' ' + String(ten || '')).toUpperCase(); if (!DH_GHI_CHU.test(t)) return false;
  var n = 0; for (var i = 0; i < row.length && n <= 4; i++) if (String(row[i] == null ? '' : row[i]).trim() !== '') n++;
  return n <= 4;
}
/* 07/11: chữ trong ô -> tên tab kênh chuẩn (DEALER, KHO, … hoặc nhãn "Dealer", "POD – A.Bách") */
function dhKenhTen_(t) {
  var c = plChuan_(String(t == null ? '' : t)).replace(/[^A-Z0-9]/g, ''); if (!c || c.length > 24) return '';
  for (var i = 0; i < DH_TABS.length; i++) { var a = DH_TABS[i]; if (plChuan_(a).replace(/[^A-Z0-9]/g, '') === c || plChuan_(DH_NHAN_TAB[a] || '').replace(/[^A-Z0-9]/g, '') === c) return a; }
  return '';
}
/* mã đơn: ngắn, không phải câu ghi chú (ORDER·FLOW giữ cả mã không có chữ số như #DEMO) */
function dhLaMa_(m0) { m0 = String(m0 || '').trim(); return !!m0 && m0.length <= 40 && m0.split(/\s+/).length <= 4 && !DH_GHI_CHU.test(m0.toUpperCase()); }
/* 03/11: nhận chữ "ưu tiên" (hoa / thường, có / không dấu) */
function dhUuTien_(t) { return /\bUU\s*TIEN\b/.test(plChuan_(t)); }
/* Mã đơn "RHINO-22/06" -> người đặt + ngày đặt (giống web app đơn hàng); deadline trước ngày đặt -> sang năm sau */
var DH_HOM_ = '';
function dhMaDon_(o, nam) {
  var s = String(o.maDon || ''), m = s.match(/(\d{1,2})\s*\/\s*(\d{1,2})/);
  o.nguoiDat = s.replace(/^[#(\s]+/, '').split(/[-–]\s*\d{1,2}\s*\//)[0].replace(/\d+.*$/, '').replace(/[-–()\s]+$/, '').trim().slice(0, 40);
  if (!/[A-Za-zÀ-ỹ]/.test(o.nguoiDat)) o.nguoiDat = '';
  o.ngayDat = '';
  if (m && Number(m[1]) >= 1 && Number(m[1]) <= 31 && Number(m[2]) >= 1 && Number(m[2]) <= 12) {
    o.ngayDat = nam + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[1]).slice(-2);
    if (o.ngayDat > (DH_HOM_ || (DH_HOM_ = homNayVN_()))) o.ngayDat = (nam - 1) + o.ngayDat.slice(4);   // đặt tháng 12 năm trước
    if (o.dl && o.dl < o.ngayDat) o.dl = (Number(o.dl.slice(0, 4)) + 1) + o.dl.slice(4);
  }
  return o;
}
/* Mọi dòng đơn (đã gộp 7 tab). Nhớ tạm DH_CACHE_GIAY giây, chia mảnh < 100 KB */
var DH_DON_KHOA = 'DH_DON_v6';
function dhDocDon_(lamMoi) {
  var c = CacheService.getScriptCache(), k = DH_DON_KHOA;   // v6 (07/11): thêm kênh POD-ECOMSTONE   // v5 (07/11): thêm uu (tab ĐƠN ƯU TIÊN)   // v4 (03/11): thêm uuTien / uuDon
  if (!lamMoi) {
    try {
      var n = Number(c.get(k + '_n') || 0);
      if (n > 0) {
        var ks = []; for (var i = 0; i < n; i++) ks.push(k + '_' + i);
        var all = c.getAll(ks), s = '';
        for (var j = 0; j < n; j++) { if (all[k + '_' + j] == null) { s = null; break; } s += all[k + '_' + j]; }
        if (s) return JSON.parse(s);
      }
    } catch (e) {}
  }
  var ss = SpreadsheetApp.openById(DH_SHEET_ID), nam = Number(Utilities.formatDate(new Date(), TZ_VN, 'yyyy')), ds = [];
  DH_TABS.forEach(function(tab) { var sh = ss.getSheetByName(tab); if (sh) ds = ds.concat(dhDocTab_(sh, tab, nam)); });
  /* 02/11 (chủ dự án): tự đọc tab kênh mới có cột chuẩn ("Loại hàng…" + "Số lượng đặt") – bỏ tab lưu trữ và tab chủ dự án bấm "Bỏ qua" */
  var bo = dhTabBo_(), moi = [];
  ss.getSheets().forEach(function(sh) {
    var ten = String(sh.getName());
    if (moi.length >= DH_TAB_MOI_MAX || DH_TABS.indexOf(ten) >= 0 || bo.indexOf(ten) >= 0 || DH_TAB_LOAI.test(ten)) return;
    try { if (sh.isSheetHidden && sh.isSheetHidden()) return; } catch (e) {}   // tab ẩn (tổng hợp / nháp): không đọc
    if (!dhCoCotChuan_(sh)) return;
    var r = dhDocTab_(sh, ten, nam, DH_TAB_MOI_DONG);
    if (r.length) { ds = ds.concat(r); moi.push(ten); }
  });
  /* 07/11 (chủ dự án): tab "ĐƠN ƯU TIÊN" (bản chép các mã ưu tiên, có hạn riêng) = nguồn của mục Ưu tiên; không cộng vào tổng */
  var uu = [], kenhMa = {};
  ds.forEach(function(o) { if (o.maDon && !kenhMa[o.maDon]) kenhMa[o.maDon] = [o.tab, o.kenh]; });
  ss.getSheets().forEach(function(sh) {
    if (uu.length || plChuan_(sh.getName()) !== 'DON UU TIEN') return;
    uu = dhDocTab_(sh, sh.getName(), nam, DH_TAB_MOI_DONG).map(function(o) {
      var km = kenhMa[o.maDon]; o.tab = km ? km[0] : 'UU_TIEN'; o.kenh = km ? km[1] : 'Ưu tiên'; o.tuTabUu = 1;
      if (!o.uuTien) o.uuTien = 'Ưu tiên'; return o; });
  });
  var kq = { luc: Utilities.formatDate(new Date(), TZ_VN, 'yyyy-MM-dd HH:mm'), don: ds, uu: uu, tabMoi: moi, tabBo: bo };
  try {
    var str = JSON.stringify(kq), p = {}, m = 0;
    for (var x = 0; x < str.length; x += 30000) p[k + '_' + (m++)] = str.slice(x, x + 30000);   // 100 KB tính theo byte, chữ Việt 2–3 byte
    p[k + '_n'] = String(m);
    c.putAll(p, DH_CACHE_GIAY);
  } catch (e2) {}
  return kq;
}

/* Tab "Đơn hàng → xưởng": dòng đơn còn thiếu + phân loại + từ điển nhãn */
function layDonHangXuong(token, lamMoi) {
  var q = qtQuyen_(token); if (q.loi) return q.loi;
  try { dhCaiEmail_(); } catch (eT) {}   // 07/11: tự cài lịch email 8h (chủ sở hữu bật / tắt ở ⚙ Công suất)
  var d;
  try { d = dhDocDon_(!!lamMoi); }
  catch (e) { return sach_({ ok: false, msg: 'Không đọc được Sheet "Trạng thái đơn hàng": ' + (e && e.message || e) + '. Kiểm tra tài khoản chạy web còn được chia sẻ Sheet đó.' }); }
  plNapThem_();   // 02/11: cấu hình sản phẩm chủ dự án thêm / sửa trên web
  var sua = {};
  docAnToan_(PL_SHEET).forEach(function(r) { if (r.TenChuan) sua[String(r.TenChuan)] = r; });   // khóa dạng 'K:<tên chuẩn>' (không bị Sheet đổi thành số)
  var don = d.don.map(function(o) {
    var x = {}; for (var k in o) x[k] = o[k];
    x.tenChuan = plChuan_(o.ten);
    x.pl = plPhanLoai_(o.ten, o.ghiChu, sua['K:' + x.tenChuan]);
    return x;
  });
  var uu = (d.uu || []).map(function(o) { var x = {}; for (var k in o) x[k] = o[k]; x.tenChuan = plChuan_(o.ten); x.pl = plPhanLoai_(o.ten, o.ghiChu, sua['K:' + x.tenChuan]); return x; });
  return sach_({ ok: true, luc: d.luc, don: don, uu: uu, nhan: chNhan_(), tabMoi: d.tabMoi || [], tabBo: d.tabBo || [],
    kenhDs: DH_TABS.map(function(t) { return [t, DH_NHAN_TAB[t] || t]; }).concat((d.tabMoi || []).map(function(t) { return [t, t]; })),   // 07/11: đủ mọi kênh (kể cả kênh chưa có đơn) cho bộ lọc + báo cáo
    cs: dhCongSuat_(), email: dhEmailTT_() });
}

/* Chủ sở hữu sửa phân loại 1 tên hàng (áp cho mọi đơn cùng tên). bo = true -> xóa bản sửa, về tự động */
function luuPhanLoaiSKU(token, o) {
  var q = qtQuyen_(token); if (q.loi) return q.loi;
  o = o || {}; plNapThem_();
  var ten = String(o.ten || '').trim();
  if (!ten || ten.length > 300) return sach_({ ok: false, msg: 'Thiếu tên hàng.' });
  var co = function(bang, v) { return Object.prototype.hasOwnProperty.call(bang, String(v)); };
  if (!o.bo) {
    if (!co(PL_LOAI, o.loai)) return sach_({ ok: false, msg: 'Loại hàng không hợp lệ.' });
    if (o.dong && !plTimDong_(String(o.dong))) return sach_({ ok: false, msg: 'Dòng gậy không hợp lệ.' });
    if (!co(PL_CHUOI, o.chuoi) || !co(PL_NGON, o.ngon) || !co(PL_TIP, o.tip) || !co(PL_REN, o.ren)) return sach_({ ok: false, msg: 'Chọn đủ 4 thông số (chuôi, ngọn, tip, ren).' });
  }
  khoa_(); xoaCache_(PL_SHEET);   // đọc lại sheet sau khi khóa trước khi xóa theo số dòng
  var sh = ss_().getSheetByName(PL_SHEET);
  if (!sh) {
    sh = ss_().insertSheet(PL_SHEET);
    sh.getRange(1, 1, 1, PL_COT.length).setValues([PL_COT]).setFontWeight('bold');
    sh.setFrozenRows(1);
    sh.getRange(2, 1, sh.getMaxRows() - 1, PL_COT.length).setNumberFormat('@');
  }
  var k = 'K:' + plChuan_(ten), cu = docAnToan_(PL_SHEET).filter(function(r) { return String(r.TenChuan) === k; });
  cu.map(function(r) { return r._row; }).sort(function(a, b) { return b - a; }).forEach(function(r) { sh.deleteRow(r); });
  xoaCache_(PL_SHEET);
  if (!o.bo) {
    them_(PL_SHEET, { TenChuan: k, TenHang: ten, LoaiHang: String(o.loai), Dong: String(o.dong || ''), Chuoi: String(o.chuoi), Ngon: String(o.ngon), Tip: String(o.tip), Ren: String(o.ren),
      GhiChu: String(o.ghiChu || '').slice(0, 200), NguoiSua: q.me.tk, ThoiDiem: Utilities.formatDate(new Date(), TZ_VN, 'yyyy-MM-dd HH:mm') });
  }
  ghiLog_(q.me, 'Phân loại SKU', ten.slice(0, 120), '', o.bo ? 'về tự động' : [o.loai, o.dong, o.chuoi, o.ngon, o.tip, o.ren].join(' / '));
  return sach_({ ok: true, msg: o.bo ? 'Đã trả về phân loại tự động.' : 'Đã lưu phân loại cho "' + ten.slice(0, 60) + '".' });
}

/* ===== Tab "Đơn hàng" (01/11, chỉ chủ sở hữu): bản chụp mỗi ngày để xem "Thay đổi hôm nay" =====
   Sheet DonHangChup (trong file KPI, KHÔNG ghi vào Sheet đơn hàng): Ngay | Phan | DuLieu – mỗi ngày 1 bản, chia mảnh 40.000 ký tự, giữ 30 ngày.
   Chụp lúc 9h sáng cùng trigger snapshotKPIHangNgay, và lần đầu mở tab trong ngày nếu chưa có. */
var DH_CHUP = 'DonHangChup', DH_CHUP_COT = ['Ngay', 'Phan', 'DuLieu'], DH_CHUP_GIU = 30;
function dhKhoaDong_(o) { return [o.maDon || '', o.ten || '', o.tab || ''].map(function(x) { return String(x).replace(/[|#]/g, '/'); }).join('|'); }
/* Khóa riêng cho từng dòng: dòng trùng mã đơn + tên + tab (khác màu / ghi chú) được đánh số #2, #3… theo thứ tự trong Sheet */
function dhKhoaDs_(ds) { var dem = {}; return ds.map(function(o) { var k = dhKhoaDong_(o); dem[k] = (dem[k] || 0) + 1; return dem[k] > 1 ? k + '#' + dem[k] : k; }); }
function dhTrangThai_(o, homNay) {
  if (o.thieu <= 0 && o.daTra > 0 && o.daTra >= o.sl) return 'daGiao';
  if (o.thieu <= 0) return 'sanSang';
  if (o.dl && o.dl < homNay) return 'treHan';
  return 'dangSX';
}
function dhDocChup_() {   // -> { 'yyyy-MM-dd': [[k, sl, thieu, giao, dl, st], ...] }
  var sh = ss_().getSheetByName(DH_CHUP), out = {};
  if (!sh || sh.getLastRow() < 2) return out;
  var v = sh.getRange(2, 1, sh.getLastRow() - 1, 3).getValues(), p = {};
  v.forEach(function(r) { var d = r[0] instanceof Date ? Utilities.formatDate(r[0], TZ_VN, 'yyyy-MM-dd') : String(r[0]).trim(); if (!/^\d{4}-\d\d-\d\d$/.test(d)) return; (p[d] = p[d] || []).push([Number(r[1]) || 0, String(r[2] || '').replace(/^~/, '')]); });
  Object.keys(p).forEach(function(d) { try { out[d] = JSON.parse(p[d].sort(function(a, b) { return a[0] - b[0]; }).map(function(x) { return x[1]; }).join('')); } catch (e) {} });
  return out;
}
function dhChup_(lamMoi) {
  var hom = homNayVN_(), sh = ss_().getSheetByName(DH_CHUP);
  if (sh && sh.getLastRow() >= 2 && sh.getRange(2, 1, sh.getLastRow() - 1, 1).getDisplayValues().some(function(r) { return String(r[0]) === hom; })) return false;
  var d = dhDocDon_(!!lamMoi), ks = dhKhoaDs_(d.don), rowsC = d.don.map(function(o, i) { return [ks[i], o.sl, o.thieu, o.giao || 0, o.dl || '', dhTrangThai_(o, hom)]; });
  var su = [];   // 07/11: dòng hôm trước còn trong tab kênh, nay đã chuyển sang tab HT -> thêm vào bản chụp với cờ 1 (cột 7) để tính sản lượng + sự kiện hoàn thiện
  try { var kq = dhTimChuyenHT_(rowsC, hom); rowsC = rowsC.concat(kq.dong); su = kq.su; } catch (eHT) { try { ghiLog_({ tk: 'HE_THONG', ten: 'Hệ thống' }, 'Đọc tab HT lỗi', String(eHT && eHT.message || eHT).slice(0, 200), '', ''); } catch (e2) {} }
  var str = JSON.stringify(rowsC);
  khoa_();
  sh = ss_().getSheetByName(DH_CHUP);
  if (!sh) { sh = ss_().insertSheet(DH_CHUP); sh.getRange(1, 1, 1, 3).setValues([DH_CHUP_COT]).setFontWeight('bold'); sh.setFrozenRows(1); try { sh.hideSheet(); } catch (e) {} }
  if (sh.getLastRow() >= 2 && sh.getRange(2, 1, sh.getLastRow() - 1, 1).getDisplayValues().some(function(r) { return String(r[0]) === hom; })) return false;   // người khác vừa chụp
  var rows = []; for (var i = 0, n = 0; i < str.length; i += 40000) rows.push([hom, n++, '~' + str.slice(i, i + 40000)]);   // '~' đầu mảnh: ô không bao giờ bị hiểu là công thức
  sh.getRange(sh.getLastRow() + 1, 1, rows.length, 3).setNumberFormat('@').setValues(rows);
  // giữ DH_CHUP_GIU ngày gần nhất
  var v = sh.getRange(2, 1, sh.getLastRow() - 1, 1).getDisplayValues().map(function(r) { return String(r[0]); });
  var ngay = v.filter(function(x, i) { return v.indexOf(x) === i; }).sort();
  if (ngay.length > DH_CHUP_GIU) {
    var bo = {}; ngay.slice(0, ngay.length - DH_CHUP_GIU).forEach(function(x) { bo[x] = 1; });
    for (var r = v.length - 1; r >= 0; r--) if (bo[v[r]]) sh.deleteRow(r + 2);
  }
  try { dhGhiHoanThien_(su); } catch (e) {}
  try { dhGhiSanLuong_(dhDocChup_()); } catch (e) {}   // 07/11: lưu tổng sản lượng nhập theo ngày (giữ lâu dài)
  return true;
}
/* Gọi từ trigger 9h sáng (snapshotKPIHangNgay) – không cho gọi từ web */
function chupDonHangHangNgay_() { try { dhChup_(true); } catch (e) { try { ghiLog_({ tk: 'HE_THONG', ten: 'Hệ thống' }, 'Chụp đơn hàng lỗi', String(e && e.message || e).slice(0, 200), '', ''); } catch (e2) {} } }

/* Tab "Đơn hàng": thay đổi so với bản chụp gần nhất TRƯỚC hôm nay + lịch sử tổng để thống kê */
function layThayDoiDon(token) {
  var q = qtQuyen_(token); if (q.loi) return q.loi;
  var hom = homNayVN_(), d, ch;
  try { d = dhDocDon_(false); } catch (e) { return sach_({ ok: false, msg: 'Không đọc được Sheet "Trạng thái đơn hàng": ' + (e && e.message || e) }); }
  ch = dhDocChup_();
  var truoc = Object.keys(ch).filter(function(x) { return x < hom; }).sort().pop() || '';
  var thay = [];
  if (truoc) {
    var cu = {}, nay = {};
    ch[truoc].forEach(function(r) { cu[r[0]] = r; });
    var ks = dhKhoaDs_(d.don);
    d.don.forEach(function(o, i) {
      var k = ks[i], c = cu[k], st = dhTrangThai_(o, hom); nay[k] = 1;
      var x = { maDon: o.maDon, ten: o.ten, kenh: o.kenh, tab: o.tab, st: st };
      if (!c) { thay.push(Object.assign({ loai: 'moi', mota: 'Dòng đơn mới' }, x)); return; }
      if (Number(c[2]) !== Number(o.thieu)) thay.push(Object.assign({ loai: 'thieu', chieu: o.thieu < c[2] ? 'giam' : 'tang', mota: 'Còn thiếu ' + c[2] + ' → ' + o.thieu }, x));
      if (String(c[5]) !== st) thay.push(Object.assign({ loai: 'trangthai', truoc: c[5], mota: 'Trạng thái đổi' }, x));
      if (String(c[4] || '') !== String(o.dl || '')) thay.push(Object.assign({ loai: 'deadline', mota: 'Deadline ' + (c[4] || '—') + ' → ' + (o.dl || '—') }, x));
      if (Number(c[1]) !== Number(o.sl)) thay.push(Object.assign({ loai: 'sl', mota: 'SL đặt ' + c[1] + ' → ' + o.sl }, x));
    });
    var htNay = {}; (ch[hom] || []).forEach(function(r) { if (r[6] === 1) htNay[r[0]] = r; });
    ch[truoc].forEach(function(r) { if (r[6] === 1 || nay[r[0]]) return; var a = String(r[0]).replace(/#\d+$/, '').split('|'), h = htNay[r[0]];
      thay.push({ loai: h ? 'ht' : 'xoa', mota: h ? 'Đã hoàn thiện – chuyển sang tab HT' + (Number(h[2]) > 0 ? ' (giao thiếu ' + h[2] + ')' : '') : 'Không còn trong Sheet', maDon: a[0], ten: a[1], tab: a[2], kenh: DH_NHAN_TAB[a[2]] || a[2], st: h ? 'daGiao' : r[5] }); });
  }
  var lichSu = Object.keys(ch).sort().map(function(x) { var t = 0, tre = 0; ch[x].forEach(function(r) { if (r[6] === 1) return; t += Number(r[2]) || 0; if (r[5] === 'treHan') tre++; }); return [x, t, tre]; });
  var daChup = false;
  if (!ch[hom]) { try { daChup = dhChup_(false); } catch (e3) {} }
  if (daChup) ch = dhDocChup_();
  try { dhGhiSanLuong_(ch); } catch (e4) {}   // bù các ngày chưa ghi (bản chụp có từ trước 07/11)
  return sach_({ ok: true, luc: d.luc, truoc: truoc, thay: thay.slice(0, 2000), lichSu: lichSu, daChup: daChup, chay: dhDongChay_(ch), sanLuong: dhDocSanLuong_(), cs: dhCongSuat_(), ht: dhDocHoanThien_() });
}
/* 02/11 (Lean – quan-ly-van-hanh): Vào – Ra – Tồn và giao đúng hạn suy ra từ 2 bản chụp liền nhau (sai số ±1 ngày).
   vao = SL đặt của dòng mới xuất hiện; ra = phần còn thiếu giảm đi (dòng còn trong Sheet); ton = tổng còn thiếu;
   xong = dòng hôm trước còn thiếu, hôm nay hết thiếu (còn trong Sheet); dung = xong mà ngày chụp ≤ deadline (không có deadline: không tính);
   dòng biến mất khi còn thiếu: "không rõ" (có thể hủy) – không tính vào ra / xong. -> { ngay: [[d, vao, ra, ton, xong, dung, mat]], kenh: {tên: [xong, dung]} (28 ngày gần nhất) } */
function dhDongChay_(ch) {
  var ds = Object.keys(ch).sort(), ngay = [], kenh = {}, moc = '';
  if (ds.length) { var m = new Date(ds[ds.length - 1] + 'T00:00:00'); m.setDate(m.getDate() - 28); moc = Utilities.formatDate(m, TZ_VN, 'yyyy-MM-dd'); }
  for (var i = 1; i < ds.length; i++) {
    var cu = {}, nay = {}, vao = 0, ra = 0, ton = 0, xong = 0, dung = 0, mat = 0, d = ds[i];
    ch[ds[i - 1]].forEach(function(r) { cu[r[0]] = r; });
    ch[d].forEach(function(r) {
      nay[r[0]] = 1; var t = Number(r[2]) || 0, c = cu[r[0]]; if (r[6] !== 1) ton += t;   // dòng chuyển HT: phần thiếu còn lại là giao thiếu / hủy, không còn nợ
      if (!c) { if (r[6] !== 1) vao += Number(r[1]) || 0; return; }
      var t0 = Number(c[2]) || 0; if (t0 > t) ra += t0 - t;
      if (t0 > 0 && t <= 0 && r[4]) {
        xong++; var ok = d <= String(r[4]); if (ok) dung++;
        if (d > moc) { var tab = String(r[0]).replace(/#\d+$/, '').split('|')[2] || '', kn = DH_NHAN_TAB[tab] || tab, x = kenh[kn] || (kenh[kn] = [0, 0]); x[0]++; if (ok) x[1]++; }
      }
    });
    ch[ds[i - 1]].forEach(function(r) { if (!nay[r[0]] && r[6] !== 1 && (Number(r[2]) || 0) > 0) mat++; });
    ngay.push([d, vao, ra, ton, xong, dung, mat]);
  }
  return { ngay: ngay.slice(-60), kenh: kenh };
}

/* ===== 02/11: tab kênh mới + cấu hình sản phẩm sửa trên web + báo sản phẩm mới (Việc hôm nay) ===== */
var DH_TAB_HT = /^HT[\s\-_.]*\d{4}$/i;   // 07/11 (chủ dự án): đơn xong được chép cả đơn sang tab HT-<năm> (vd HT-2026) rồi xóa khỏi tab kênh
var DH_TAB_LOAI = /^_|SNAPSHOT|^ĐƠN HÀNG HT$|^DON HANG HT$|^HT[\s\-_.]*\d{4}$|HOÀN THIỆN|HOAN THIEN|LƯU TRỮ|LUU TRU|ARCHIVE|^SHEET\d*$|^ĐƠN ƯU TIÊN$|^DON UU TIEN$/i;   // 07/11: tab ĐƠN ƯU TIÊN là bản chép từ các tab kênh -> không cộng vào tổng (đọc riêng làm nguồn mục Ưu tiên)   // tab lưu trữ / nháp: không đọc
var DH_TAB_MOI_MAX = 15, DH_TAB_MOI_DONG = 5000;   // tab kênh tự thêm: tối đa 15 tab, mỗi tab đọc 5.000 dòng đầu (chống treo / cạn quota)
/* tab tự thêm phải có ĐỦ cột "Loại hàng" và "Số lượng đặt" trong 10 dòng đầu */
function dhCoCotChuan_(sh) {
  var nr = Math.min(sh.getLastRow(), 10), nc = Math.min(sh.getLastColumn(), 60);
  if (nr < 2 || nc < 2) return false;
  return sh.getRange(1, 1, nr, nc).getValues().some(function(r) { var j = r.join('|').toUpperCase(); return j.indexOf('LOẠI HÀNG') >= 0 && (j.indexOf('SỐ LƯỢNG ĐẶT') >= 0 || j.indexOf('SL ĐẶT') >= 0); });
}
function dhTabBo_() { try { var a = JSON.parse(PropertiesService.getScriptProperties().getProperty('DH_TAB_BO') || '[]'); return Array.isArray(a) ? a.map(String) : []; } catch (e) { return []; } }
/* Bỏ qua / đọc lại 1 tab kênh tự thêm */
function boQuaTabDon(token, tab, bo) {
  var q = qtQuyen_(token); if (q.loi) return q.loi;
  tab = String(tab || '').slice(0, 100);
  var cu = dhTabBo_();
  if (!tab || DH_TABS.indexOf(tab) >= 0) return sach_({ ok: false, msg: 'Tab không hợp lệ.' });
  if (cu.indexOf(tab) < 0) {   // chỉ nhận tab đang có trong Sheet đơn
    var coTab = false; try { coTab = SpreadsheetApp.openById(DH_SHEET_ID).getSheets().some(function(sh) { return String(sh.getName()) === tab; }); } catch (e) {}
    if (!coTab) return sach_({ ok: false, msg: 'Không thấy tab "' + tab + '" trong Sheet đơn.' });
  }
  var a = cu.filter(function(x) { return x !== tab; });
  if (bo) a.push(tab);
  try { PropertiesService.getScriptProperties().setProperty('DH_TAB_BO', JSON.stringify(a.slice(-40))); }
  catch (e) { return sach_({ ok: false, msg: 'Không lưu được danh sách tab bỏ qua.' }); }
  try { var c = CacheService.getScriptCache(); c.remove(DH_DON_KHOA + '_n'); } catch (e) {}   // 07/11: sửa khóa cũ (v3) – bỏ / đọc lại tab có hiệu lực ngay
  ghiLog_(q.me, 'Tab đơn hàng', tab, '', bo ? 'bỏ qua' : 'đọc lại');
  return sach_({ ok: true, msg: bo ? 'Đã bỏ qua tab "' + tab + '".' : 'Sẽ đọc lại tab "' + tab + '".' });
}

/* Cấu hình sản phẩm chủ dự án sửa trên web – sheet CauHinhSP (file KPI). Mỗi dòng ghi đè / thêm vào bảng gốc trong mã:
   Loai = DONG (dòng gậy) | CHUOI | NGON | TIP (loại khúc). Áp lại mỗi lần gọi từ bản gốc (plNapThem_), không đổi bảng gốc. */
var CH_SHEET = 'CauHinhSP';
var CH_COT = ['Loai', 'Ma', 'Ten', 'LoaiHang', 'TenGoi', 'Chuoi', 'Ngon', 'Tip', 'Ren', 'Dau', 'ChatLieu', 'Kieu', 'An', 'NguoiSua', 'ThoiDiem'];
var PL_KIEU_KHUC = {}, PL_AN = { CHUOI: {}, NGON: {}, TIP: {} }, PL_THEM = {}, __PL_GOC = null;
function plNapThem_() {
  if (!__PL_GOC) __PL_GOC = JSON.stringify({ d: PL_DONG, c: PL_CHUOI, n: PL_NGON, t: PL_TIP, vc: PL_VL_CHUOI, vn: PL_VL_NGON, dau: PL_DAU_MD });
  var g = JSON.parse(__PL_GOC);
  PL_DONG = g.d; PL_CHUOI = g.c; PL_NGON = g.n; PL_TIP = g.t; PL_VL_CHUOI = g.vc; PL_VL_NGON = g.vn; PL_DAU_MD = g.dau;
  PL_KIEU_KHUC = {}; PL_AN = { CHUOI: {}, NGON: {}, TIP: {} }; PL_THEM = {}; __PL_RE = null;
  var rows = docAnToan_(CH_SHEET);
  var bang = { CHUOI: function() { return PL_CHUOI; }, NGON: function() { return PL_NGON; }, TIP: function() { return PL_TIP; } };
  rows.forEach(function(r) {   // loại khúc trước (dòng gậy dùng mã khúc)
    var L = String(r.Loai), m = String(r.Ma || '');
    if (!bang[L] || !m) return;
    var b = bang[L]();
    if (!Object.prototype.hasOwnProperty.call(b, m)) PL_THEM[L + '|' + m] = 1;
    if (r.Ten) b[m] = String(r.Ten); else if (!b[m]) b[m] = m;
    var vl = String(r.ChatLieu || '');
    if (L === 'CHUOI' && /^(FC|MIX|GF)$/.test(vl)) PL_VL_CHUOI[m] = vl;
    if (L === 'NGON' && /^(FC|MIX|GF)$/.test(vl)) PL_VL_NGON[m] = vl;
    if (/^(NHAY|PHA|PHANHAY)$/.test(String(r.Kieu || ''))) PL_KIEU_KHUC[m] = String(r.Kieu);
    if (String(r.An) === '1' || r.An === true) PL_AN[L][m] = 1;
  });
  rows.forEach(function(r) {
    if (String(r.Loai) !== 'DONG' || !r.Ma) return;
    var m = String(r.Ma), d = plTimDong_(m), goi = String(r.TenGoi || '').split('|').map(function(x) { return x.trim(); }).filter(Boolean);
    if (!d) { d = [m, '', 'GAY', [], '', '', '', '', 1]; PL_DONG.push(d); PL_THEM['DONG|' + m] = 1; }
    if (r.Ten) d[1] = String(r.Ten);
    if (/^(GAY|NGON|CHUOI)$/.test(String(r.LoaiHang))) d[2] = String(r.LoaiHang);
    if (goi.length) d[3] = goi;
    if (r.Chuoi) d[4] = String(r.Chuoi); if (r.Ngon) d[5] = String(r.Ngon); if (r.Tip) d[6] = String(r.Tip); if (r.Ren) d[7] = String(r.Ren);
    d[8] = 1;   // chủ dự án khai báo = chắc chắn
    if (r.Dau) PL_DAU_MD[m] = String(r.Dau); else if (PL_THEM['DONG|' + m]) delete PL_DAU_MD[m];
  });
  return rows;
}
function chNhan_() {
  return { loai: PL_LOAI, chuoi: PL_CHUOI, ngon: PL_NGON, tip: PL_TIP, ren: PL_REN, kieu: PL_KIEU, vl: PL_VL,
    dong: PL_DONG.map(function(x) { return [x[0], x[1], x[2]]; }),
    dongDu: PL_DONG.map(function(x) { return { ma: x[0], ten: x[1], loai: x[2], goi: x[3] || [], chuoi: x[4], ngon: x[5], tip: x[6], ren: x[7], dau: PL_DAU_MD[x[0]] || '', them: !!PL_THEM['DONG|' + x[0]] }; }),
    vlChuoi: PL_VL_CHUOI, vlNgon: PL_VL_NGON, kieuKhuc: PL_KIEU_KHUC, an: PL_AN, them: PL_THEM };
}
function chChu_(v, n) { return String(v == null ? '' : v).replace(/^[=@\s]+/, '').replace(/\s+/g, ' ').trim().slice(0, n); }   // bỏ "=" / "@" đầu tên (them_ còn chặn công thức bằng chuAnToan_)
/* Lưu 1 dòng cấu hình. o = { loai: 'DONG'|'CHUOI'|'NGON'|'TIP', ma?, ten, loaiHang, tenGoi: [..], chuoi, ngon, tip, ren, dau, chatLieu, kieu, an, xoa } */
function luuCauHinhSP(token, o) {
  var q = qtQuyen_(token); if (q.loi) return q.loi;
  o = o || {};
  khoa_(); xoaCache_(CH_SHEET); xoaCache_(PL_SHEET);   // khóa trước khi sinh mã / kiểm đang dùng / xóa theo số dòng (tránh 2 lần lưu cùng lúc, dữ liệu nhớ tạm cũ)
  plNapThem_();
  var L = String(o.loai || ''), co = function(b, v) { return Object.prototype.hasOwnProperty.call(b, String(v)); };
  if (!/^(DONG|CHUOI|NGON|TIP)$/.test(L)) return sach_({ ok: false, msg: 'Loại cấu hình không hợp lệ.' });
  var bangK = { CHUOI: PL_CHUOI, NGON: PL_NGON, TIP: PL_TIP }[L];
  var ma = String(o.ma || '').toUpperCase().replace(/[^A-Z0-9_-]/g, '').slice(0, 24), moi = !ma;
  var ten = chChu_(o.ten, 80);
  if (moi) {
    if (!ten) return sach_({ ok: false, msg: 'Nhập tên.' });
    var goc = (L === 'DONG' ? 'D' : L.charAt(0)) + '-' + (plChuan_(ten).replace(/[^A-Z0-9]/g, '').slice(0, 14) || 'MOI'), i = 1;
    ma = goc; while ((L === 'DONG' ? plTimDong_(ma) : co(bangK, ma))) ma = goc + (++i);
  } else if (L === 'DONG' ? !plTimDong_(ma) : !co(bangK, ma)) return sach_({ ok: false, msg: 'Không thấy mã ' + ma + '.' });
  var rec = { Loai: L, Ma: ma, Ten: ten, LoaiHang: '', TenGoi: '', Chuoi: '', Ngon: '', Tip: '', Ren: '', Dau: '', ChatLieu: '', Kieu: '', An: o.an ? '1' : '' };
  if (o.xoa) {
    if (moi) return sach_({ ok: false, msg: 'Thiếu mã.' });
    if (PL_THEM[L + '|' + ma]) {   // loại / dòng tự thêm: chỉ xóa được khi chưa dùng
      var dung = docAnToan_(PL_SHEET).some(function(r) { return String(r.Dong) === ma || String(r.Chuoi) === ma || String(r.Ngon) === ma || String(r.Tip) === ma; }) ||
        (L !== 'DONG' && PL_DONG.some(function(d) { return d[4] === ma || d[5] === ma || d[6] === ma; }));
      if (dung) return sach_({ ok: false, msg: 'Mã ' + ma + ' đang được dùng – chỉ ẩn được, không xóa.' });
    }
  } else if (L === 'DONG') {
    var goi = (Array.isArray(o.tenGoi) ? o.tenGoi : String(o.tenGoi || '').split(/[,\n|]/)).map(function(x) { return chChu_(x, 40).replace(/\|/g, '/'); }).filter(function(x) { return plChuan_(x).replace(/[^A-Z0-9]/g, '').length >= 3; }).slice(0, 15);
    if (!goi.length) return sach_({ ok: false, msg: 'Nhập ít nhất 1 chữ nhận diện (từ 3 ký tự chữ / số) có trong tên sản phẩm.' });
    if (!/^(GAY|NGON|CHUOI)$/.test(String(o.loaiHang))) return sach_({ ok: false, msg: 'Chọn loại hàng (gậy / ngọn lẻ / chuôi lẻ).' });
    var lh = String(o.loaiHang), c = String(o.chuoi || ''), n = String(o.ngon || ''), t = String(o.tip || ''), r = String(o.ren || '');
    if (lh === 'NGON') c = 'KHONG'; if (lh === 'CHUOI') { n = 'KHONG'; t = 'KHONG'; }
    if (!co(PL_CHUOI, c) || !co(PL_NGON, n) || !co(PL_TIP, t) || (r && !co(PL_REN, r))) return sach_({ ok: false, msg: 'Chọn đủ chuôi, ngọn, tip (ren có thể để trống).' });
    if (lh === 'GAY' && (c === 'KHONG' || n === 'KHONG')) return sach_({ ok: false, msg: 'Gậy cần cả loại chuôi và loại ngọn.' });
    var dau = String(o.dau || '').replace(',', '.'); if (dau && !/^(9\.5|1[0-4]\.\d)$/.test(dau)) return sach_({ ok: false, msg: 'Đầu mặc định dạng 12.5 (để trống nếu không có).' });
    if (moi && !ten) return sach_({ ok: false, msg: 'Nhập tên dòng gậy.' });
    rec.LoaiHang = lh; rec.TenGoi = goi.join('|'); rec.Chuoi = c; rec.Ngon = n; rec.Tip = t; rec.Ren = r; rec.Dau = dau;
  } else {
    var vl = String(o.chatLieu || ''), kieu = String(o.kieu || '');
    if (vl && !/^(FC|MIX|GF)$/.test(vl)) return sach_({ ok: false, msg: 'Chất liệu không hợp lệ.' });
    if (kieu && !/^(NHAY|PHA|PHANHAY)$/.test(kieu)) return sach_({ ok: false, msg: 'Kiểu không hợp lệ.' });
    if (L !== 'TIP' && moi && !vl) return sach_({ ok: false, msg: 'Chọn chất liệu.' });
    rec.ChatLieu = L === 'TIP' ? '' : vl; rec.Kieu = L === 'TIP' ? '' : kieu;
  }
  var sh = ss_().getSheetByName(CH_SHEET);
  if (!sh) { sh = ss_().insertSheet(CH_SHEET); sh.getRange(1, 1, 1, CH_COT.length).setValues([CH_COT]).setFontWeight('bold'); sh.setFrozenRows(1); sh.getRange(2, 1, sh.getMaxRows() - 1, CH_COT.length).setNumberFormat('@'); }
  docAnToan_(CH_SHEET).filter(function(x) { return String(x.Loai) === L && String(x.Ma) === ma; }).map(function(x) { return x._row; }).sort(function(a, b) { return b - a; }).forEach(function(x) { sh.deleteRow(x); });
  xoaCache_(CH_SHEET);
  if (!o.xoa) { rec.NguoiSua = q.me.tk; rec.ThoiDiem = Utilities.formatDate(new Date(), TZ_VN, 'yyyy-MM-dd HH:mm'); them_(CH_SHEET, rec); }
  ghiLog_(q.me, 'Cấu hình sản phẩm', L + ' ' + ma, '', o.xoa ? 'xóa / về mặc định' : [rec.Ten, rec.TenGoi, rec.Chuoi, rec.Ngon, rec.Tip, rec.Ren, rec.ChatLieu, rec.Kieu, rec.An].join(' / ').slice(0, 300));
  plNapThem_();
  return sach_({ ok: true, ma: ma, msg: o.xoa ? 'Đã xóa / trả về mặc định ' + ma + '.' : 'Đã lưu ' + (ten || ma) + '.', nhan: chNhan_() });
}
/* Việc hôm nay (chủ sở hữu): tên hàng trong đơn còn thiếu mà web chưa nhận ra cấu hình + loại khúc chưa có chất liệu + tab kênh mới */
function demSanPhamMoi(token) {
  var q = qtQuyen_(token); if (q.loi) return q.loi;
  var d; try { d = dhDocDon_(false); } catch (e) { return sach_({ ok: false, msg: 'Không đọc được Sheet đơn hàng.' }); }
  plNapThem_();
  var sua = {}; docAnToan_(PL_SHEET).forEach(function(r) { if (r.TenChuan) sua[String(r.TenChuan)] = r; });
  var ten = {}, khuc = {};
  d.don.forEach(function(o) {
    if (!(o.thieu > 0)) return;
    var k = plChuan_(o.ten), p = plPhanLoai_(o.ten, o.ghiChu, sua['K:' + k]);
    if (p.loai === 'PK' || p.loai === 'NOI') return;
    if (p.tin === 'do') { var x = ten[k] || (ten[k] = { ten: o.ten, thieu: 0, dong: 0 }); x.thieu += o.thieu; x.dong++; return; }
    if (p.vlC === 'KHAC' && p.chuoi && p.chuoi !== 'KHONG') { var a = khuc['CHUOI|' + p.chuoi] || (khuc['CHUOI|' + p.chuoi] = { bang: 'CHUOI', ma: p.chuoi, ten: PL_CHUOI[p.chuoi] || p.chuoi, thieu: 0 }); a.thieu += o.thieu; }
    if (p.vlN === 'KHAC' && p.ngon && p.ngon !== 'KHONG') { var b = khuc['NGON|' + p.ngon] || (khuc['NGON|' + p.ngon] = { bang: 'NGON', ma: p.ngon, ten: PL_NGON[p.ngon] || p.ngon, thieu: 0 }); b.thieu += o.thieu; }
  });
  var ds = Object.keys(ten).map(function(k) { return ten[k]; }).sort(function(a, b) { return b.thieu - a.thieu; });
  var dk = Object.keys(khuc).map(function(k) { return khuc[k]; }).sort(function(a, b) { return b.thieu - a.thieu; });
  return sach_({ ok: true, n: ds.length, ten: ds.slice(0, 20), thieu: ds.reduce(function(a, x) { return a + x.thieu; }, 0), khuc: dk.slice(0, 20), tabMoi: d.tabMoi || [] });
}

/* ===== 07/11 (chủ dự án): sản lượng nhập theo ngày = tổng còn thiếu bản chụp trước − bản chụp sau, CÙNG các dòng đơn =====
   (quan-ly-van-hanh) chỉ so dòng có ở cả 2 bản chụp; dòng mới thêm không tính; còn thiếu TĂNG (sửa số / hỏng) ghi riêng "điều chỉnh", không trừ vào sản lượng;
   dòng biến mất khi còn thiếu ghi riêng "mất" (có thể đã giao rồi chuyển sang Đơn hàng HT, hoặc hủy); khoảng giữa 2 bản chụp có thể dài nhiều ngày (chủ nhật, ngày lễ, mất bản chụp).
   Sheet ẩn DonHangSanLuong (trong file KPI): Ngay | TuNgay | Ra | SX | Vao | Ton | Mat | Tang | ChiTiet – giữ lâu dài (bản chụp chỉ giữ 30 ngày). */
var DH_SL = 'DonHangSanLuong', DH_SL_COT = ['Ngay', 'TuNgay', 'Ra', 'SX', 'Vao', 'Ton', 'Mat', 'Tang', 'ChiTiet'];
function dhLoaiSL_(loai) { return loai === 'GAY' || loai === 'CHUOI' || loai === 'NGON' || loai === 'PK' || loai === 'NOI' ? loai : 'KHAC'; }
/* 07/11 (theo ORDER·FLOW): gộp các dòng trùng mã + tên + tab (#2, #3…) trước khi so -> xóa / chèn 1 dòng trùng không làm lệch sản lượng */
function dhGop_(rows, boHT) {
  var m = {}, out = [];
  rows.forEach(function(r) {
    if (boHT && r[6] === 1) return;
    var k = String(r[0]).replace(/#\d+$/, ''), g = m[k];
    if (!g) { g = m[k] = [k, 0, 0, Number(r[3]) || 0, r[4], r[5], 0, null]; g.n = 0; g.ht = 0; g.co7 = 0; out.push(g); }
    g[1] += Number(r[1]) || 0; g[2] += Number(r[2]) || 0; g.n++;
    if (r[6] === 1) { g.ht++; if (r[7] != null) { g.co7 = 1; g[7] = (g[7] || 0) + (Number(r[7]) || 0); } }
  });
  out.forEach(function(g) { g[6] = g.ht && g.ht === g.n ? 1 : 0; if (!g[6] || !g.co7) g[7] = null; });
  return out;
}
function dhTinhSanLuong_(cu, nay, plCache, sua) {   // cu, nay: mảng dòng bản chụp [k, sl, thieu, giao, dl, st]
  cu = dhGop_(cu, true); nay = dhGop_(nay, false);
  var m = {}, kq = { ra: 0, sx: 0, vao: 0, ton: 0, mat: 0, tang: 0, kenh: {}, loai: {}, don: {}, ht: { n: 0, sp: 0, thieu: 0 } };
  cu.forEach(function(r) { m[r[0]] = r; });
  var co = {};
  nay.forEach(function(r) {
    var t = Number(r[2]) || 0, c = m[r[0]], laHT = r[6] === 1; co[r[0]] = 1; if (!laHT) kq.ton += t;
    if (!c && laHT && r[7] != null) c = [r[0], r[1], r[7]];   // dòng chuyển HT chậm (đã vắng ở bản chụp trước): lấy số thiếu lần cuối còn thấy
    if (!c) { if (!laHT) kq.vao += Number(r[1]) || 0; return; }
    if (c && c[6] === 1) return;   // đã tính hôm chuyển
    var t0 = Number(c[2]) || 0;
    if (laHT) { kq.ht.n++; kq.ht.sp += Math.max(0, t0 - t); kq.ht.thieu += t; if (t >= t0) return; }   // phần thiếu khi chuyển = giao thiếu / hủy: không cộng sản lượng, không tính "điều chỉnh"
    if (t > t0) { kq.tang += t - t0; return; }
    if (t0 <= t) return;
    var ra = t0 - t, a = String(r[0]).replace(/#\d+$/, '').split('|'), tab = a[2] || '', kn = DH_NHAN_TAB[tab] || tab, ten = a[1] || '';
    var l = plCache[ten]; if (l == null) { try { var tc = plChuan_(ten); l = plCache[ten] = dhLoaiSL_(plPhanLoai_(ten, '', sua['K:' + tc]).loai); } catch (e) { l = plCache[ten] = 'KHAC'; } }
    kq.ra += ra; if (l !== 'PK' && l !== 'NOI') kq.sx += ra;
    kq.kenh[kn] = (kq.kenh[kn] || 0) + ra; kq.loai[l] = (kq.loai[l] || 0) + ra;
    var md = (a[0] || '(không mã)') + '|' + kn; kq.don[md] = (kq.don[md] || 0) + ra;
  });
  cu.forEach(function(r) { if (!co[r[0]] && r[6] !== 1 && (Number(r[2]) || 0) > 0) kq.mat += Number(r[2]) || 0; });
  return kq;
}
function dhGhiSanLuong_(ch) {
  var ds = Object.keys(ch || {}).sort(); if (ds.length < 2) return 0;
  var sh = ss_().getSheetByName(DH_SL), daCo = {};
  if (sh && sh.getLastRow() >= 2) sh.getRange(2, 1, sh.getLastRow() - 1, 1).getDisplayValues().forEach(function(r) { daCo[String(r[0])] = 1; });
  var thieu = []; for (var i = 1; i < ds.length; i++) if (!daCo[ds[i]]) thieu.push(i);
  if (!thieu.length) return 0;
  plNapThem_();
  var sua = {}; docAnToan_(PL_SHEET).forEach(function(r) { if (r.TenChuan) sua[String(r.TenChuan)] = r; });
  var pc = {}, rows = thieu.map(function(i) {
    var k = dhTinhSanLuong_(ch[ds[i - 1]], ch[ds[i]], pc, sua), top = Object.keys(k.don).map(function(x) { return [x, k.don[x]]; }).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 15);
    return [ds[i], ds[i - 1], k.ra, k.sx, k.vao, k.ton, k.mat, k.tang, '~' + JSON.stringify({ kenh: k.kenh, loai: k.loai, top: top, ht: k.ht })];
  });
  khoa_();
  sh = ss_().getSheetByName(DH_SL);
  if (!sh) { sh = ss_().insertSheet(DH_SL); sh.getRange(1, 1, 1, DH_SL_COT.length).setValues([DH_SL_COT]).setFontWeight('bold'); sh.setFrozenRows(1); try { sh.hideSheet(); } catch (e) {} }
  if (sh.getLastRow() >= 2) { var lai = {}; sh.getRange(2, 1, sh.getLastRow() - 1, 1).getDisplayValues().forEach(function(r) { lai[String(r[0])] = 1; }); rows = rows.filter(function(r) { return !lai[r[0]]; }); }   // người khác vừa ghi
  if (!rows.length) return 0;
  sh.getRange(sh.getLastRow() + 1, 1, rows.length, DH_SL_COT.length).setNumberFormat('@').setValues(rows.map(function(r) { return r.map(String); }));
  return rows.length;
}
function dhDocSanLuong_() {   // -> [[ngay, tuNgay, ra, sx, vao, ton, mat, tang, {kenh, loai, top}]] tăng dần theo ngày
  var sh = ss_().getSheetByName(DH_SL); if (!sh || sh.getLastRow() < 2) return [];
  return sh.getRange(2, 1, sh.getLastRow() - 1, DH_SL_COT.length).getDisplayValues().map(function(r) {
    var ct = {}; try { ct = JSON.parse(String(r[8]).replace(/^~/, '')); } catch (e) {}
    return [r[0], r[1], Number(r[2]) || 0, Number(r[3]) || 0, Number(r[4]) || 0, Number(r[5]) || 0, Number(r[6]) || 0, Number(r[7]) || 0, ct];
  }).filter(function(r) { return /^\d{4}-\d\d-\d\d$/.test(r[0]); }).sort(function(a, b) { return a[0] < b[0] ? -1 : 1; });
}

/* ===== 07/11 (chủ dự án + quan-ly-van-hanh): công suất và ngày nghỉ để phân tích độ hợp lý số lượng / deadline =====
   350 sp/ngày cho mọi hàng sản xuất (gậy + chuôi lẻ + ngọn lẻ; không tính phụ kiện, tay nối); làm thứ 2 – thứ 7; ngày lễ điền sẵn theo luật, chủ sở hữu sửa trên web. */
var DH_CS_MAC = 350;
/* 07/11 (theo ORDER·FLOW): ngày lễ tự tính mọi năm – Tết Dương lịch, Tết Nguyên đán (29 Tết → mùng 3, 5 ngày), Giỗ Tổ 10/3 âm, 30/4, 1/5, 2/9 + 3/9.
   Âm lịch → dương lịch theo thuật toán Hồ Ngọc Đức (múi giờ +7). Chủ sở hữu thêm ngày nghỉ riêng của công ty; ngày lễ tự tính nào công ty vẫn làm thì ghi "làm bù". */
function dhJd_(d, m, y) { var a = Math.floor((14 - m) / 12), yy = y + 4800 - a, mm = m + 12 * a - 3; return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045; }
function dhTuJd_(jd) { var a = jd + 32044, b = Math.floor((4 * a + 3) / 146097), c = a - Math.floor(b * 146097 / 4), d = Math.floor((4 * c + 3) / 1461), e = c - Math.floor(1461 * d / 4), m = Math.floor((5 * e + 2) / 153);
  return [e - Math.floor((153 * m + 2) / 5) + 1, m + 3 - 12 * Math.floor(m / 10), b * 100 + d - 4800 + Math.floor(m / 10)]; }
function dhSoc_(k) {
  var T = k / 1236.85, T2 = T * T, T3 = T2 * T, dr = Math.PI / 180, jd = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  jd += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  var M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3, Mp = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3, F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  var C = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M) - 0.4068 * Math.sin(Mp * dr) + 0.0161 * Math.sin(2 * dr * Mp) - 0.0004 * Math.sin(3 * dr * Mp) + 0.0104 * Math.sin(2 * dr * F)
    - 0.0051 * Math.sin(dr * (M + Mp)) - 0.0074 * Math.sin(dr * (M - Mp)) + 0.0004 * Math.sin(dr * (2 * F + M)) - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mp)) + 0.0010 * Math.sin(dr * (2 * F - Mp)) + 0.0005 * Math.sin(dr * (2 * Mp + M));
  var delta = T < -11 ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3 : -0.000278 + 0.000265 * T + 0.000262 * T2;
  return Math.floor(jd + C - delta + 0.5 + 7 / 24);
}
function dhKinhDo_(jdn) { var T = (jdn - 2451545.5 - 7 / 24) / 36525, T2 = T * T, dr = Math.PI / 180, M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2, L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  var DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M) + (0.019993 - 0.000101 * T) * Math.sin(2 * dr * M) + 0.000290 * Math.sin(3 * dr * M), L = (L0 + DL) * dr;
  L = L - Math.PI * 2 * Math.floor(L / (Math.PI * 2)); return Math.floor(L / Math.PI * 6); }
function dhThang11_(y) { var k = Math.floor((dhJd_(31, 12, y) - 2415021) / 29.530588853), nm = dhSoc_(k); return dhKinhDo_(nm) >= 9 ? dhSoc_(k - 1) : nm; }
function dhNhuan_(a11) { var k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5), last = 0, i = 1, arc = dhKinhDo_(dhSoc_(k + i)); do { last = arc; i++; arc = dhKinhDo_(dhSoc_(k + i)); } while (arc !== last && i < 14); return i - 1; }
function dhAmSangDuong_(d, m, y) {   // -> 'yyyy-mm-dd' (tháng không nhuận)
  var a11, b11; if (m < 11) { a11 = dhThang11_(y - 1); b11 = dhThang11_(y); } else { a11 = dhThang11_(y); b11 = dhThang11_(y + 1); }
  var k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5), off = m - 11; if (off < 0) off += 12;
  if (b11 - a11 > 365) { var lOff = dhNhuan_(a11); if (off >= lOff) off += 1; }
  var r = dhTuJd_(dhSoc_(k + off) + d - 1); return r[2] + '-' + ('0' + r[1]).slice(-2) + '-' + ('0' + r[0]).slice(-2);
}
function dhCongNgay_(s, n) { var p = s.split('-'), t = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2] + n)); return t.getUTCFullYear() + '-' + ('0' + (t.getUTCMonth() + 1)).slice(-2) + '-' + ('0' + t.getUTCDate()).slice(-2); }
function dhLeNam_(y) {
  var out = [[y + '-01-01', 'Tết Dương lịch'], [y + '-04-30', 'Giải phóng miền Nam'], [y + '-05-01', 'Quốc tế Lao động'], [y + '-09-02', 'Quốc khánh']];   // ngày nghỉ kèm Quốc khánh theo bảng NgayLe của công ty
  var tet = dhAmSangDuong_(1, 1, y);
  for (var i = -2; i <= 2; i++) out.push([dhCongNgay_(tet, i), 'Tết Nguyên đán' + (i === 0 ? ' (mùng 1)' : '')]);
  out.push([dhAmSangDuong_(10, 3, y), 'Giỗ Tổ Hùng Vương (10/3 âm)']);
  return out;
}
function dhCongSuat_() {
  var o = null; try { o = JSON.parse(PropertiesService.getScriptProperties().getProperty('DH_CONG_SUAT') || 'null'); } catch (e) {}
  if (!o || typeof o !== 'object') o = {};
  var sp = Number(o.sp); if (!(sp >= 1 && sp <= 100000)) sp = DH_CS_MAC;
  var re = /^\d{4}-\d\d-\d\d$/, tay = Array.isArray(o.nghi) ? o.nghi.filter(function(x) { return Array.isArray(x) && re.test(String(x[0])); }).map(function(x) { return [String(x[0]), String(x[1] || '').slice(0, 60)]; }) : [];
  var lam = Array.isArray(o.lam) ? o.lam.filter(function(x) { return re.test(String(x)); }).map(String) : [];   // ngày làm bù (chủ nhật đi làm, hoặc ngày lễ tự tính mà công ty vẫn làm)
  var nam = Number(Utilities.formatDate(new Date(), TZ_VN, 'yyyy')), tu = [], co = {};
  for (var y = nam - 1; y <= nam + 1; y++) dhLeNam_(y).forEach(function(x) { tu.push(x); });
  var le = [];   // 07/11: bảng NgayLe (lịch nghỉ công ty đang dùng cho KPI) – dòng không ghi xưởng = cả nhà máy
  try { docAnToan_('NgayLe').forEach(function(r) { var d = ngayVN_(r.Ngay); if (re.test(d) && !String(r.MaXuong || '').trim()) le.push([d, String(r.TenLe || 'Nghỉ lễ').slice(0, 60) + ' (lịch KPI)']); }); } catch (e) {}
  var nghi = [];
  tay.concat(le, tu).forEach(function(x) { if (!co[x[0]]) { co[x[0]] = 1; nghi.push(x); } });
  return { sp: sp, nghi: nghi.sort(function(a, b) { return a[0] < b[0] ? -1 : 1; }), nghiTay: tay.sort(function(a, b) { return a[0] < b[0] ? -1 : 1; }), nghiTuDong: tu.concat(le).sort(function(a, b) { return a[0] < b[0] ? -1 : 1; }), lam: lam.sort(), macDinh: !Array.isArray(o.nghi) };
}
function luuCongSuat(token, o) {
  var q = qtQuyen_(token); if (q.loi) return q.loi;
  o = o || {};
  var sp = Math.round(Number(o.sp)); if (!(sp >= 1 && sp <= 100000)) return sach_({ ok: false, msg: 'Công suất phải từ 1 đến 100.000 sp/ngày.' });
  var bad = '', nghi = (Array.isArray(o.nghi) ? o.nghi : []).slice(0, 200).map(function(x) {
    var d = String((x && x[0]) || '').trim(); if (!/^\d{4}-\d\d-\d\d$/.test(d) || isNaN(new Date(d + 'T00:00:00').getTime())) bad = d || '(trống)';
    return [d, String((x && x[1]) || '').replace(/^[=+\-@]+/, '').trim().slice(0, 60)];
  });
  var lam = (Array.isArray(o.lam) ? o.lam : []).slice(0, 100).map(function(d) { d = String(d || '').trim(); if (!/^\d{4}-\d\d-\d\d$/.test(d)) bad = d || '(trống)'; return d; });
  if (bad) return sach_({ ok: false, msg: 'Ngày không hợp lệ: ' + bad + ' (cần dạng năm-tháng-ngày).' });
  var gon = {}; nghi = nghi.filter(function(x) { if (gon[x[0]]) return false; gon[x[0]] = 1; return true; });
  try { PropertiesService.getScriptProperties().setProperty('DH_CONG_SUAT', JSON.stringify({ sp: sp, nghi: nghi, lam: lam })); }
  catch (e) { return sach_({ ok: false, msg: 'Không lưu được.' }); }
  ghiLog_(q.me, 'Công suất đơn hàng', sp + ' sp/ngày', '', nghi.length + ' ngày nghỉ, ' + lam.length + ' ngày làm bù');
  return sach_({ ok: true, msg: 'Đã lưu công suất ' + sp + ' sp/ngày và ' + nghi.length + ' ngày nghỉ.', cs: dhCongSuat_() });
}

/* ===== 07/11 (chủ dự án): đơn xong được chép CẢ ĐƠN sang tab HT-<năm> rồi xóa khỏi tab kênh; có khi chuyển khi còn thiếu (giao thiếu / hủy).
   Lúc chụp 9h: dòng có ở bản chụp trước, nay không còn ở tab kênh mà có ở tab HT (cùng mã đơn + tên) -> thêm vào bản chụp hôm nay
   [khóa cũ, SL, còn thiếu ghi ở HT, giao, deadline, 'daGiao', 1]: sản lượng = thiếu hôm trước − thiếu ghi ở HT; phần thiếu ghi ở HT = giao thiếu, không tính "mất".
   Tab HT chỉ đọc lúc chụp (1 lần / ngày), không đọc khi mở web. Sự kiện lưu ở sheet ẩn DonHangHoanThien để báo cáo "đã hoàn thiện". */
var DH_HT = 'DonHangHoanThien', DH_HT_COT = ['Ngay', 'TuNgay', 'MaDon', 'Ten', 'Kenh', 'NguoiDat', 'SL', 'ThieuTruoc', 'ThieuHT', 'Deadline', 'DungHan', 'NgayDat'];
/* (quan-ly-van-hanh) DungHan: 'dung' = đủ hàng + đúng hạn (OTIF), 'tre' = đủ nhưng trễ, 'giaoThieu' = chuyển khi còn thiếu (không tính OTIF);
   đúng hạn so với ngày CUỐI CÙNG còn thấy đơn ở tab kênh (cho lệch 1 lần chụp vì 9h hôm sau mới phát hiện) */
function dhDocHT_() {   // -> { 'maDon|ten': {thieu, sl, dl, nguoiDat} } từ tab HT năm nay + năm trước
  var ss = SpreadsheetApp.openById(DH_SHEET_ID), nam = Number(Utilities.formatDate(new Date(), TZ_VN, 'yyyy')), m = {};
  ss.getSheets().forEach(function(sh) {
    var ten = String(sh.getName()).trim(), y = Number((ten.match(/(\d{4})$/) || [])[1]);
    if (!DH_TAB_HT.test(ten) || (y !== nam && y !== nam - 1)) return;
    dhDocTab_(sh, ten, nam).forEach(function(o) { var k = dhKhoaDong_(o).split('|').slice(0, 2).join('|'); if (!m[k]) m[k] = { thieu: o.thieu, sl: o.sl, dl: o.dl || '', nguoiDat: o.nguoiDat || '', ngayDat: o.ngayDat || '' }; });
  });
  return m;
}
function dhTimChuyenHT_(rowsNay, hom) {
  /* xét 3 bản chụp gần nhất trước hôm nay: dòng xóa khỏi tab kênh mà hôm đó chưa chép sang HT vẫn được nhận khi HT có (quan-ly-van-hanh: "để treo, đối chiếu lại") */
  var ch = dhDocChup_(), ds = Object.keys(ch).filter(function(x) { return x < hom; }).sort().slice(-3);
  if (!ds.length) return { dong: [], su: [] };
  var co = {}, daHT = {}, cuoi = {};
  rowsNay.forEach(function(r) { co[r[0]] = 1; });
  ds.forEach(function(d) { ch[d].forEach(function(r) { if (r[6] === 1) daHT[r[0]] = 1; else cuoi[r[0]] = { r: r, d: d }; }); });   // lần cuối còn thấy ở tab kênh
  var mat = Object.keys(cuoi).filter(function(k) { return !co[k] && !daHT[k]; });
  if (!mat.length) return { dong: [], su: [] };
  var ht = dhDocHT_(), dong = [], su = [];
  mat.forEach(function(k) {
    var r = cuoi[k].r, tu = cuoi[k].d, a = String(k).replace(/#\d+$/, '').split('|'), h = ht[a[0] + '|' + a[1]]; if (!h) return;
    var t = Math.max(0, Math.min(Number(h.thieu) || 0, Number(r[1]) || 0)), t0 = Number(r[2]) || 0, dl = r[4] || h.dl || '';
    dong.push([k, r[1], t, r[3] || 0, dl, 'daGiao', 1, t0]);   // cột 8: còn thiếu lần cuối thấy ở tab kênh (khi lần cuối không phải bản chụp liền trước)
    su.push([hom, tu, a[0], a[1], DH_NHAN_TAB[a[2]] || a[2], h.nguoiDat, Number(r[1]) || 0, t0, t, dl, t > 0 ? 'giaoThieu' : (!dl ? '' : (tu <= dl ? 'dung' : 'tre')), h.ngayDat || '']);
  });
  return { dong: dong, su: su };
}
function dhGhiHoanThien_(su) {
  if (!su || !su.length) return 0;
  khoa_();
  var sh = ss_().getSheetByName(DH_HT);
  if (!sh) { sh = ss_().insertSheet(DH_HT); sh.getRange(1, 1, 1, DH_HT_COT.length).setValues([DH_HT_COT]).setFontWeight('bold'); sh.setFrozenRows(1); try { sh.hideSheet(); } catch (e) {} }
  if (sh.getLastRow() >= 2 && sh.getRange(2, 1, sh.getLastRow() - 1, 1).getDisplayValues().some(function(r) { return String(r[0]) === su[0][0]; })) return 0;   // ngày này đã ghi
  sh.getRange(sh.getLastRow() + 1, 1, su.length, DH_HT_COT.length).setNumberFormat('@').setValues(su.map(function(r) { return r.map(function(x) { return String(x == null ? '' : x).replace(/^[=+\-@]/, "'$&"); }); }));
  return su.length;
}
function dhDocHoanThien_() {   // -> [[ngay, tuNgay, maDon, ten, kenh, nguoiDat, sl, thieuTruoc, thieuHT, dl, dungHan, ngayDat]] 400 ngày gần nhất
  var sh = ss_().getSheetByName(DH_HT); if (!sh || sh.getLastRow() < 2) return [];
  var moc = Utilities.formatDate(new Date(Date.now() - 400 * 864e5), TZ_VN, 'yyyy-MM-dd');
  return sh.getRange(2, 1, sh.getLastRow() - 1, DH_HT_COT.length).getDisplayValues().filter(function(r) { return String(r[0]) >= moc; }).map(function(r) {
    return [r[0], r[1], String(r[2]).replace(/^'/, ''), String(r[3]).replace(/^'/, ''), r[4], String(r[5]).replace(/^'/, ''), Number(r[6]) || 0, Number(r[7]) || 0, Number(r[8]) || 0, r[9], r[10], r[11] || ''];
  });
}

/* ===== 07/11 (chủ dự án): đơn đã hoàn thiện đọc TRỰC TIẾP từ tab HT-<năm> (không phụ thuộc bản chụp) – cho báo cáo 3 tháng =====
   Tab HT không có ngày xong -> tháng tính theo HẠN (hạn mới HT nếu có, không thì deadline). Kênh: cột "Kênh" > dòng tiêu đề nhóm kênh
   > mã đơn còn ở tab kênh / bản chụp / sự kiện hoàn thiện > "Chưa xác định" (chủ dự án 07/11). Nhớ tạm 10 phút. */
function dhCacheLay_(k) { try { var c = CacheService.getScriptCache(), n = Number(c.get(k + '_n') || 0); if (!n) return null; var ks = []; for (var i = 0; i < n; i++) ks.push(k + '_' + i); var a = c.getAll(ks), s = ''; for (var j = 0; j < n; j++) { if (a[k + '_' + j] == null) return null; s += a[k + '_' + j]; } return JSON.parse(s); } catch (e) { return null; } }
function dhCacheGhi_(k, o, giay) { try { var s = JSON.stringify(o), p = {}, m = 0; for (var x = 0; x < s.length; x += 30000) p[k + '_' + (m++)] = s.slice(x, x + 30000); p[k + '_n'] = String(m); CacheService.getScriptCache().putAll(p, giay); } catch (e) {} }
function layDonHoanThien(token, lamMoi) {
  var q = qtQuyen_(token); if (q.loi) return q.loi;
  return sach_(dhHTTrucTiep_(lamMoi));
}
function dhHTTrucTiep_(lamMoi) {
  var K = 'DH_HT_v2', kq = lamMoi ? null : dhCacheLay_(K);
  if (kq) return kq;
  var ss, nam = Number(Utilities.formatDate(new Date(), TZ_VN, 'yyyy')), rows = [], tabs = [];
  try { ss = SpreadsheetApp.openById(DH_SHEET_ID); } catch (e) { return { ok: false, msg: 'Không mở được Sheet đơn hàng: ' + (e && e.message || e) }; }
  ss.getSheets().forEach(function(sh) {
    var ten = String(sh.getName()).trim(), y = Number((ten.match(/(\d{4})$/) || [])[1]);
    if (!DH_TAB_HT.test(ten) || (y !== nam && y !== nam - 1)) return;
    tabs.push(ten); rows = rows.concat(dhDocTab_(sh, ten, y));
  });
  var tabMa = {}, d = null;   // mã đơn -> tab kênh
  try { d = dhDocDon_(false); d.don.forEach(function(o) { if (o.maDon && !tabMa[o.maDon]) tabMa[o.maDon] = o.tab; }); } catch (e) {}
  try { var ch = dhDocChup_(); Object.keys(ch).forEach(function(x) { ch[x].forEach(function(r) { var a = String(r[0]).split('|'); if (a[0] && a[2] && !tabMa[a[0]]) tabMa[a[0]] = a[2]; }); }); } catch (e) {}
  try { dhDocHoanThien_().forEach(function(r) { if (r[2] && !tabMa[r[2]]) { for (var t in DH_NHAN_TAB) if (DH_NHAN_TAB[t] === r[4]) tabMa[r[2]] = t; } }); } catch (e) {}
  plNapThem_();
  var sua = {}; docAnToan_(PL_SHEET).forEach(function(r) { if (r.TenChuan) sua[String(r.TenChuan)] = r; });
  /* 07/11 (chủ dự án): tab HT không có cột kênh -> suy kênh theo TIỀN TỐ mã đơn (người đặt): luật cố định + kênh chiếm đa số của cùng tiền tố ở tab kênh / đơn HT đã biết kênh */
  var demTT = {}, dem = function(nd, tab) { nd = String(nd || '').trim().toUpperCase(); if (!nd || !tab) return; var x = demTT[nd] || (demTT[nd] = {}); x[tab] = (x[tab] || 0) + 1; };
  try { d && d.don.forEach(function(o) { dem(o.nguoiDat, o.tab); }); } catch (e) {}
  rows.forEach(function(o) { dem(o.nguoiDat, o.kenhCot || o.kenhNhom || tabMa[o.maDon]); });
  var tienTo = function(o) {
    var nd = String(o.nguoiDat || '').trim().toUpperCase(), ma = String(o.maDon || '').toUpperCase();
    if (/^#?KHO\b/.test(ma) || /\bKHO\b/.test(nd)) return 'KHO';   // KHO, EVO KHO, ĐƠN SX TRẢ KHO
    if (/ECOM/.test(nd) || /ECOM/.test(ma)) return 'POD-ECOMSTONE';
    if (/^POD/.test(nd)) return 'POD-A.BÁCH';
    var x = demTT[nd]; if (!x) return '';
    var ks = Object.keys(x).sort(function(a, b) { return x[b] - x[a]; }), tong = ks.reduce(function(s, k) { return s + x[k]; }, 0);
    return x[ks[0]] / tong >= 0.6 ? ks[0] : '';
  };
  var nguon = { cot: 0, nhom: 0, ma: 0, tienTo: 0, khong: 0 }, pc = {};
  var don = rows.map(function(o) {
    var tab = o.kenhCot || o.kenhNhom || tabMa[o.maDon] || '', n = o.kenhCot ? 'cot' : o.kenhNhom ? 'nhom' : tab ? 'ma' : 'khong';
    if (!tab) { tab = tienTo(o); if (tab) n = 'tienTo'; }
    nguon[n]++;
    var tc = plChuan_(o.ten), p = pc[tc] || (pc[tc] = plPhanLoai_(o.ten, o.ghiChu, sua['K:' + tc]));
    return { maDon: o.maDon, ten: o.ten, tab: tab || 'KHONG_RO', kenh: tab ? (DH_NHAN_TAB[tab] || tab) : 'Chưa xác định', nguoiDat: o.nguoiDat || '', ngayDat: o.ngayDat || '',
      dl: o.dl || '', hanMoi: o.hanMoi || '', thang: String(o.hanMoi || o.dl || '').slice(0, 7), sl: o.sl, thieu: o.thieu, daTra: o.daTra || 0, htTab: o.tab,
      pl: { loai: p.loai, kieu: p.kieu, vlC: p.vlC, vlN: p.vlN, tin: p.tin } };
  });
  kq = { ok: true, luc: Utilities.formatDate(new Date(), TZ_VN, 'yyyy-MM-dd HH:mm'), tabs: tabs, don: don, nguon: nguon };
  dhCacheGhi_(K, kq, 600);
  return kq;
}

/* ===== 07/11: sản lượng Đóng gói theo ngày từ NHẬT KÝ KPI (dữ liệu trực tiếp, đủ 3 tháng) – bước xuất của xưởng Đóng gói như tab Quy trình ===== */
var DH_DG_MD = /DONG GOI THANH PHAM|DONG DON LE (GAY|NGON|CUSTOM|COMBO)/;
function dhMaDongGoi_() {
  var cds = doc_('CongDoan'), qt = qtDocQT_(cds.filter(function(c) { return String(c.TrangThai).trim() !== 'Ngừng'; }));
  if (qt.xuat && qt.xuat.DG && qt.xuat.DG.length) return qt.xuat.DG.slice();
  return cds.filter(function(c) { return String(c.MaXuong) === 'DG' && DH_DG_MD.test(plChuan_(c.TenCD)); }).map(function(c) { return String(c.MaCD); });
}
function dhDongGoiNgay_(tu, den) {   // -> { ma: [...], ngay: { 'yyyy-mm-dd': sp } }
  var ma = dhMaDongGoi_(), co = {}, out = {}; ma.forEach(function(m) { co[m] = 1; });
  doc_('NhatKySanXuat').forEach(function(r) {
    if (!co[String(r.MaCD)] || String(r.TrangThai).trim() === 'Từ chối') return;
    var ng = ngayVN_(r.Ngay); if (ng < tu || ng > den) return;
    var sl = Number(r.SoLuongLamRa) || 0; if (sl > 0) out[ng] = (out[ng] || 0) + sl;
  });
  return { ma: ma, ngay: out };
}
/* 07/11 (chủ dự án: "phải có biểu đồ sản lượng của từng xưởng"): sản lượng ngày của MỌI xưởng = tổng ở bước xuất của xưởng (tab Quy trình → Sửa quy trình).
   Xưởng chưa khai bước xuất: In UV = In và phủ bóng + Phủ bóng bề mặt gậy; Hoàn thiện = Tổ check hàng (chủ dự án duyệt đề xuất của Claude 07/11); Đóng gói = như dhMaDongGoi_. */
var DH_XUONG_TT = ['PHOICB', 'PHOITHO', 'CNC', 'NGONTARO', 'NGONTIP', 'SON', 'INUV', 'HT', 'DG'];   // theo dòng chảy Phôi → Đóng gói
var DH_XUAT_MAC_DINH = { INUV: ['IN-BONG', 'BONG'], HT: ['HT-CHECK'] };
function dhSanLuongXuong_(tu, den) {   // -> { X: { ten, ma: [...], ngay: { 'yyyy-mm-dd': sl }, macDinh } }
  var cds = doc_('CongDoan'), dung = cds.filter(function(c) { return String(c.TrangThai).trim() !== 'Ngừng'; }), qt = qtDocQT_(dung), co = {}, out = {};
  var ten = {}; docAnToan_('PhongBan').forEach(function(r) { ten[String(r.MaXuong)] = String(r.TenXuong || r.MaXuong); });
  var coCD = {}, tenCD = {}; dung.forEach(function(c) { coCD[String(c.MaCD)] = String(c.MaXuong); tenCD[String(c.MaCD)] = String(c.TenCD || c.MaCD); });
  DH_XUONG_TT.forEach(function(X) {
    var ma = X === 'DG' ? dhMaDongGoi_() : ((qt.xuat && qt.xuat[X] && qt.xuat[X].length) ? qt.xuat[X].slice() : null), macDinh = false;
    if (!ma) { ma = (DH_XUAT_MAC_DINH[X] || []).filter(function(m) { return coCD[m] === X; }); macDinh = ma.length > 0; }
    out[X] = { ten: ten[X] || X, ma: ma, ngay: {}, buoc: {}, tenCD: {}, macDinh: macDinh };
    ma.forEach(function(m) { out[X].tenCD[m] = tenCD[m] || m; });
    ma.forEach(function(m) { (co[m] = co[m] || []).push(X); });
  });
  doc_('NhatKySanXuat').forEach(function(r) {
    var xs = co[String(r.MaCD)]; if (!xs || String(r.TrangThai).trim() === 'Từ chối') return;
    var ng = ngayVN_(r.Ngay); if (ng < tu || ng > den) return;
    var sl = Number(r.SoLuongLamRa) || 0, m = String(r.MaCD); if (sl > 0) xs.forEach(function(X) { out[X].ngay[ng] = (out[X].ngay[ng] || 0) + sl; var b = out[X].buoc[m] || (out[X].buoc[m] = {}); b[ng] = (b[ng] || 0) + sl; });   // từng bước: để thấy xưởng nào đang cộng nhiều loại hàng
  });
  return out;
}
function layDongGoiNgay(token, soNgay) {
  var q = qtQuyen_(token); if (q.loi) return q.loi;
  soNgay = Math.max(7, Math.min(200, Number(soNgay) || 100));
  var den = homNayVN_(), d0 = new Date(den + 'T12:00:00Z'); d0.setUTCDate(d0.getUTCDate() - soNgay + 1);
  var tu = Utilities.formatDate(d0, 'GMT', 'yyyy-MM-dd'), xu = dhSanLuongXuong_(tu, den);
  return sach_({ ok: true, ma: xu.DG.ma, ngay: xu.DG.ngay, xuong: xu, thuTu: DH_XUONG_TT, tu: tu, den: den });
}

/* ===== 07/11 (chủ dự án: "email báo cáo tự động – chỉ gửi cho tôi", 8h sáng T2–T7, học cách trình bày của ORDER·FLOW) =====
   Gửi tới email tài khoản chạy web (chủ sở hữu, không ghi cứng địa chỉ). Bỏ qua chủ nhật + ngày lễ (lịch công suất). Lịch tự cài khi chủ sở hữu mở tab. */
var DH_EMAIL_HAM = 'EMAIL_DON_HANG_8H';
function dhEmailTT_() { var p = PropertiesService.getScriptProperties(); return { bat: p.getProperty('DH_EMAIL_TAT') !== '1', lan: p.getProperty('DH_EMAIL_LAN') || '' }; }
function dhCaiEmail_() {
  var p = PropertiesService.getScriptProperties();
  if (p.getProperty('DH_EMAIL_TAT') === '1' || p.getProperty('DH_EMAIL_CAI') === '1') return;
  if (!ScriptApp.getProjectTriggers().some(function(t) { return t.getHandlerFunction() === DH_EMAIL_HAM; }))
    ScriptApp.newTrigger(DH_EMAIL_HAM).timeBased().atHour(8).everyDays(1).inTimezone(TZ_VN).create();
  p.setProperty('DH_EMAIL_CAI', '1');
}
function batTatEmailDonHang(token, bat) {
  var q = qtQuyen_(token); if (q.loi) return q.loi;
  var p = PropertiesService.getScriptProperties();
  if (bat) { p.deleteProperty('DH_EMAIL_TAT'); p.deleteProperty('DH_EMAIL_CAI'); try { dhCaiEmail_(); } catch (e) { return sach_({ ok: false, msg: 'Không cài được lịch gửi: ' + (e && e.message || e) }); } }
  else { p.setProperty('DH_EMAIL_TAT', '1'); try { ScriptApp.getProjectTriggers().forEach(function(t) { if (t.getHandlerFunction() === DH_EMAIL_HAM) ScriptApp.deleteTrigger(t); }); } catch (e) {} }
  ghiLog_(q.me, 'Email đơn hàng 8h', bat ? 'bật' : 'tắt', '', '');
  return sach_({ ok: true, msg: bat ? 'Đã bật email 8h sáng thứ 2 – thứ 7.' : 'Đã tắt email 8h.', email: dhEmailTT_() });
}
function guiThuEmailDonHang(token) {
  var q = qtQuyen_(token); if (q.loi) return q.loi;
  try { var to = dhGuiEmail_(true); return sach_({ ok: true, msg: 'Đã gửi thử tới ' + to + '.' }); }
  catch (e) { return sach_({ ok: false, msg: 'Không gửi được: ' + (e && e.message || e) }); }
}
function EMAIL_DON_HANG_8H(e) {
  if (!noiBo_(e)) return chanWeb_('EMAIL_DON_HANG_8H');
  try { dhGuiEmail_(false); } catch (x) { try { ghiLog_({ tk: 'HE_THONG', ten: 'Hệ thống' }, 'Email đơn hàng lỗi', String(x && x.message || x).slice(0, 200), '', ''); } catch (x2) {} }
}
function dhGuiEmail_(thu) {
  var hn = homNayVN_(), cs = dhCongSuat_(), nghi = {}; cs.nghi.forEach(function(x) { nghi[x[0]] = x[1]; });
  var lamBu = cs.lam.indexOf(hn) >= 0, cn = new Date(hn + 'T12:00:00Z').getUTCDay() === 0;
  if (!thu && !lamBu && (cn || nghi[hn])) return '';
  var p = PropertiesService.getScriptProperties(); if (!thu && p.getProperty('DH_EMAIL_LAN') === hn) return '';
  var to = Session.getEffectiveUser().getEmail(); if (!to) throw new Error('Không xác định được email chủ sở hữu.');
  var d = dhDocDon_(true), sua = {}; plNapThem_(); docAnToan_(PL_SHEET).forEach(function(r) { if (r.TenChuan) sua[String(r.TenChuan)] = r; });
  var pc = {}, don = {}, kenh = {}, tongSl = 0, tongThieu = 0, thieuSX = 0;
  d.don.forEach(function(o) {
    var tc = plChuan_(o.ten), l = (pc[tc] || (pc[tc] = plPhanLoai_(o.ten, o.ghiChu, sua['K:' + tc]))).loai;
    tongSl += o.sl; tongThieu += o.thieu; if (l !== 'PK' && l !== 'NOI') thieuSX += o.thieu;
    var k = o.maDon + '|' + o.tab, g = don[k] || (don[k] = { ma: o.maDon, kenh: o.kenh, nguoiDat: o.nguoiDat || '', sl: 0, thieu: 0, dl: '' });
    g.sl += o.sl; g.thieu += o.thieu; if (o.thieu > 0 && o.dl && (!g.dl || o.dl < g.dl)) g.dl = o.dl;
  });
  var ds = Object.keys(don).map(function(k) { return don[k]; }), soNgay = function(a, b) { return Math.round((new Date(b + 'T12:00:00Z') - new Date(a + 'T12:00:00Z')) / 864e5); };
  var tre = ds.filter(function(g) { return g.thieu > 0 && g.dl && g.dl < hn; }), sap = ds.filter(function(g) { return g.thieu > 0 && g.dl && g.dl >= hn && soNgay(hn, g.dl) <= 3; });
  ds.forEach(function(g) { var x = kenh[g.kenh] || (kenh[g.kenh] = { don: 0, dang: 0, tre: 0, thieu: 0 }); x.don++; if (g.thieu > 0) x.dang++; if (g.thieu > 0 && g.dl && g.dl < hn) x.tre++; x.thieu += g.thieu; });
  tre.forEach(function(g) { g.tre = soNgay(g.dl, hn); });
  var top = tre.slice().sort(function(a, b) { return b.thieu * b.tre - a.thieu * a.tre; }).slice(0, 8);
  var th = hn.slice(0, 7), dg = dhDongGoiNgay_(th + '-01' < dhCongNgay_(hn, -14) ? th + '-01' : dhCongNgay_(hn, -14), dhCongNgay_(hn, -1)).ngay, dgD = Object.keys(dg).sort();
  var homQua = dgD.length ? dgD[dgD.length - 1] : '', dgThang = 0; dgD.forEach(function(x) { if (x.slice(0, 7) === th) dgThang += dg[x]; });
  var d6 = dgD.slice(-6), tb6 = d6.length ? d6.reduce(function(s, x) { return s + dg[x]; }, 0) / d6.length : 0;
  var nl = 0; for (var x = th + '-01'; x < hn; x = dhCongNgay_(x, 1)) { var w = new Date(x + 'T12:00:00Z').getUTCDay(); if ((w !== 0 && !nghi[x]) || cs.lam.indexOf(x) >= 0) nl++; }
  /* 07/11 (chủ dự án): dòng HT có "SX còn thiếu" = cả số đặt là đơn hủy / dừng SX – không tính fill rate */
  var ht = { n: 0, sl: 0, thieu: 0, huy: 0 }; try { var H = dhHTTrucTiep_(false), seen = {}; (H.don || []).forEach(function(o) { if (o.thang !== th) return; if (o.sl > 0 && o.thieu >= o.sl) { ht.huy += o.sl; return; } ht.sl += o.sl; ht.thieu += o.thieu; if (!seen[o.maDon + '|' + o.kenh]) { seen[o.maDon + '|' + o.kenh] = 1; ht.n++; } }); } catch (eH) {}
  var so = function(n) { return Math.round(Number(n) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }, e = function(t) { return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var ng = function(x) { return x ? x.slice(8, 10) + '/' + x.slice(5, 7) : '–'; }, url = ''; try { url = ScriptApp.getService().getUrl(); } catch (eU) {}
  var thu7 = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][new Date(hn + 'T12:00:00Z').getUTCDay()];
  var o6 = [['Đóng gói ' + (homQua ? ng(homQua) : 'hôm qua'), so(homQua ? dg[homQua] : 0) + ' sp', 'TB 6 ngày ' + so(tb6) + ' · ' + Math.round(tb6 / cs.sp * 100) + '% công suất', '#0b7a73'],
    ['Đóng gói tháng ' + th.slice(5), so(dgThang) + ' sp', nl + ' ngày làm · TB ' + so(nl ? dgThang / nl : 0) + '/ngày', '#0b7a73'],
    ['Còn phải sản xuất', so(thieuSX) + ' sp', '≈ ' + Math.ceil(thieuSX / cs.sp) + ' ngày làm ở ' + so(cs.sp) + ' sp/ngày', '#b87500'],
    ['Đơn trễ hạn', so(tre.length) + ' đơn', so(tre.reduce(function(s, g) { return s + g.thieu; }, 0)) + ' sp còn thiếu', '#c0302b'],
    ['Sắp tới hạn (≤ 3 ngày)', so(sap.length) + ' đơn', so(sap.reduce(function(s, g) { return s + g.thieu; }, 0)) + ' sp còn thiếu', '#b87500'],
    ['Đã hoàn thiện (tab HT) tháng ' + th.slice(5), so(ht.n) + ' đơn', so(ht.sl - ht.thieu) + ' cây giao · fill rate ' + (ht.sl ? Math.floor((ht.sl - ht.thieu) / ht.sl * 1000) / 10 + '%' : '–') + (ht.huy ? ' · hủy / dừng SX ' + so(ht.huy) + ' cây' : ''), '#17643a']];
  var h = '<div style="max-width:640px;margin:0 auto;font-family:Segoe UI,Roboto,Arial,sans-serif;color:#1d2327;border:1px solid #d6dedd;border-radius:12px;overflow:hidden">' +
    '<div style="background:#0b4f4a;color:#fff;padding:16px 20px"><div style="font-size:11px;letter-spacing:2px;opacity:.85">CARBON BILLIARDS · BÁO CÁO SẢN XUẤT</div><div style="font-size:19px;font-weight:600;margin-top:4px">' + thu7 + ', ' + ng(hn) + '/' + hn.slice(0, 4) + '</div>' +
    '<div style="font-size:13px;opacity:.9;margin-top:4px">' + so(ds.length) + ' đơn đang theo dõi · <b>' + so(tre.length) + ' trễ hạn</b> · ' + so(tongThieu) + ' sp còn thiếu</div></div><div style="padding:16px 20px">';
  h += '<table style="width:100%;border-collapse:separate;border-spacing:8px"><tr>' + o6.map(function(x, i) { return (i === 3 ? '</tr><tr>' : '') + '<td style="width:33%;border:1px solid #d6dedd;border-left:4px solid ' + x[3] + ';border-radius:8px;padding:8px 10px;vertical-align:top"><div style="font-size:10px;color:#5b6670;text-transform:uppercase">' + e(x[0]) + '</div><div style="font-size:20px;font-weight:700;color:' + x[3] + '">' + e(x[1]) + '</div><div style="font-size:11px;color:#3d474f">' + e(x[2]) + '</div></td>'; }).join('') + '</tr></table>';
  h += '<div style="font-size:12px;font-weight:600;color:#0b4f4a;border-left:3px solid #0b7a73;padding-left:8px;margin:14px 0 6px">THEO KÊNH</div><table style="width:100%;border-collapse:collapse;font-size:12.5px"><tr style="color:#5b6670;font-size:11px;text-align:right"><td style="text-align:left;padding:4px">Kênh</td><td>Đơn</td><td>Đang làm</td><td>Trễ</td><td style="padding-right:4px">Còn thiếu</td></tr>' +
    DH_TABS.map(function(t) { var k = DH_NHAN_TAB[t] || t, x = kenh[k] || { don: 0, dang: 0, tre: 0, thieu: 0 }; return '<tr style="border-top:1px solid #e1e7e6;text-align:right"><td style="text-align:left;padding:5px 4px">' + e(k) + '</td><td>' + x.don + '</td><td>' + x.dang + '</td><td style="color:' + (x.tre ? '#b42a25' : '#889') + '">' + x.tre + '</td><td style="padding-right:4px">' + so(x.thieu) + '</td></tr>'; }).join('') + '</table>';
  h += '<div style="font-size:12px;font-weight:600;color:#b42a25;border-left:3px solid #c0302b;padding-left:8px;margin:14px 0 6px">8 ĐƠN TRỌNG ĐIỂM (trễ × còn thiếu lớn nhất)</div>' + (top.length ? '<table style="width:100%;border-collapse:collapse;font-size:12.5px"><tr style="color:#5b6670;font-size:11px"><td style="padding:4px">Mã đơn</td><td>Kênh · người đặt</td><td style="text-align:right">Deadline</td><td style="text-align:right">Trễ</td><td style="text-align:right;padding-right:4px">Thiếu</td></tr>' +
    top.map(function(g) { return '<tr style="border-top:1px solid #e1e7e6"><td style="padding:5px 4px;font-weight:600">' + e(g.ma) + '</td><td>' + e(g.kenh) + (g.nguoiDat ? ' · ' + e(g.nguoiDat) : '') + '</td><td style="text-align:right">' + ng(g.dl) + '</td><td style="text-align:right;color:#b42a25">' + g.tre + ' ngày</td><td style="text-align:right;padding-right:4px;font-weight:600">' + so(g.thieu) + '</td></tr>'; }).join('') + '</table>' : '<div style="font-size:12.5px;color:#5b6670">Không có đơn trễ.</div>');
  h += '</div><div style="background:#f1f5f4;padding:10px 20px;font-size:11px;color:#5b6670;text-align:center">Gửi tự động 8h sáng thứ 2 – thứ 7 (trừ ngày lễ) · Sheet đọc lúc ' + e(d.luc) + ' · Đóng gói theo nhật ký KPI' + (url ? ' · <a href="' + e(url) + '" style="color:#0b7a73">Mở web KPI</a>' : '') + '<br>Tắt / bật ở web: Đơn hàng → Sản xuất → Công suất &amp; deadline → ⚙</div></div>';
  MailApp.sendEmail({ to: to, subject: (thu ? '[Thử] ' : '') + 'Báo cáo sản xuất ' + ng(hn) + ' · ' + tre.length + ' đơn trễ · Đóng gói ' + (homQua ? so(dg[homQua]) : 0) + ' sp', htmlBody: h, name: 'Hệ thống KPI sản xuất' });
  if (!thu) p.setProperty('DH_EMAIL_LAN', hn);
  return to;
}

