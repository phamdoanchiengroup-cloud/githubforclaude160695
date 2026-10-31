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
var DH_TABS = ['DEALER', 'KHO', 'WEB LẺ CUSTOM', 'WEB LẺ ĐƠN THƯỜNG', 'OEM', 'A ĐÔNG', 'POD-A.BÁCH'];
var DH_NHAN_TAB = { 'DEALER': 'Dealer', 'KHO': 'Kho', 'WEB LẺ CUSTOM': 'Web lẻ – Custom', 'WEB LẺ ĐƠN THƯỜNG': 'Web lẻ – Thường', 'OEM': 'OEM', 'A ĐÔNG': 'A Đông', 'POD-A.BÁCH': 'POD – A.Bách' };
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
  ['NG-BREAK', 'Ngọn phá carbon', 'NGON', ['BREAK SHAFT', 'KOMET BREAK SHAFT', 'KOMET II'], 'KHONG', 'FCPHA', 'BAK', 'R388', 1],
  ['NG-CAROM', 'Ngọn carom carbon', 'NGON', ['CAROM SINGLE SHAFT'], 'KHONG', 'CAROM', 'TIME4', '', 1],
  ['NG-ZWAVE', 'Ngọn Z-Wave', 'NGON', ['Z-WAVE CARBON SINGLE SHAFT', 'NGON DANH ZWAVE'], 'KHONG', 'G750CB', 'DEN7', '', 1],
  ['NG-ZNITRO', 'Ngọn Cuebots Z-Nitro', 'NGON', ['Z NITRO', 'Z-NITRO'], 'KHONG', 'FC', 'CB8', 'R388', 1],
  ['NG-HORNET', 'Ngọn nhảy Hornet', 'NGON', ['HORNET'], 'KHONG', 'NHAY139', 'BAK', 'R388', 0],
  ['NG-CREST', 'Ngọn đánh Crest', 'NGON', ['CREST S'], 'KHONG', 'FC', 'ZAN', 'R388', 0],
  ['NG-CHUNG', 'Ngọn lẻ (chưa rõ dòng)', 'NGON', [], 'KHONG', 'FC', 'TIME3', '', 0],
  // Chuôi bán lẻ
  ['CH-LUMINAX', 'Chuôi Luminax / Racing', 'CHUOI', ['LUMINAX CUE BUTT', 'RACING CUE BUTT'], 'GFCBFOAM', 'KHONG', 'KHONG', 'R388', 1],
  ['CH-RHINO', 'Chuôi Rhino (Must / Retro)', 'CHUOI', ['MUST CUE BUTT', 'RETRO POOL CUE BUTT', 'CUE BUTT'], 'MIXCB', 'KHONG', 'KHONG', 'R388', 0],
  ['NOI', 'Tay nối (extension)', 'NOI', [], 'KHONG', 'KHONG', 'KHONG', 'KHONG', 1],
  ['PK', 'Phụ kiện', 'PK', [], 'KHONG', 'KHONG', 'KHONG', 'KHONG', 1]
];

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
function plPhanLoai_(ten, ghiChu, sua) {
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
  if (o.loai === 'NGON' && !o.dau && o.tin === 'xanh') { o.tin = 'vang'; o.lyDo.push('chưa đọc được đường kính đầu'); }
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
function dhDocTab_(sh, tab, nam) {
  // Chỉ đọc tới cột cần dùng (Sheet có hàng trăm cột "ngày nhận hàng" phía sau)
  var nr = sh.getLastRow(), nc = Math.min(sh.getLastColumn(), 60);
  if (nr < 2 || nc < 2) return [];
  var dau = sh.getRange(1, 1, Math.min(nr, 10), nc).getValues(), hi = -1;
  for (var r = 0; r < dau.length; r++) {
    var j = dau[r].join('|').toUpperCase();
    if (j.indexOf('LOẠI HÀNG') >= 0 || j.indexOf('SL ĐẶT') >= 0) { hi = r; break; }
  }
  if (hi < 0) return [];
  var h = dau[hi].map(function(x) { return String(x == null ? '' : x).trim().toUpperCase(); });
  var tim = function(ks) { for (var i = 0; i < h.length; i++) for (var k = 0; k < ks.length; k++) if (h[i].indexOf(ks[k]) >= 0) return i; return -1; };
  var cTen = tim(['LOẠI HÀNG']), cPhoi = tim(['LOẠI PHÔI']), cSL = tim(['SỐ LƯỢNG ĐẶT', 'SL ĐẶT']), cThieu = tim(['CÒN THIẾU']), cDL = tim(['DEADLINE']), cCT = tim(['CHÚ THÍCH']);
  if (cTen < 0) cTen = 1;
  var chang = {}, hong = {};
  DH_CHANG.forEach(function(c) {
    for (var i = 0; i < h.length; i++) if (c[1].test(h[i])) {
      chang[c[0]] = i;
      for (var k = i + 1; k <= i + 3 && k < h.length; k++) if (/HỎNG/.test(h[k])) { hong[c[0]] = k; break; }   // "Hỏng cần làm bù" đứng ngay sau cột bộ phận
      break;
    }
  });
  var cMax = Math.max.apply(null, [cTen, cPhoi, cSL, cThieu, cDL, cCT].concat(Object.keys(chang).map(function(k) { return chang[k]; }), Object.keys(hong).map(function(k) { return hong[k]; }))) + 1;
  var v = sh.getRange(1, 1, nr, Math.max(1, cMax)).getValues();
  var out = [], ma = '', trong = 0;
  for (var r2 = hi + 1; r2 < v.length; r2++) {
    var row = v[r2], ten = String(row[cTen] == null ? '' : row[cTen]).trim(), m0 = String(row[0] == null ? '' : row[0]).trim();
    if (!ten && !m0) { if (++trong >= 200) break; continue; }
    trong = 0;
    if (m0 && /[0-9]/.test(m0)) ma = m0;
    var sl = dhSo_(row[cSL]);
    if (!ten || sl <= 0) continue;
    var o = { tab: tab, kenh: DH_NHAN_TAB[tab] || tab, maDon: m0 || ma, ten: ten.replace(/\s+/g, ' '), ghiChu: [cPhoi >= 0 ? row[cPhoi] : '', cCT >= 0 ? row[cCT] : ''].map(function(x) { return String(x == null ? '' : x).replace(/\s+/g, ' ').trim(); }).filter(Boolean).join(' · ').slice(0, 300),
      sl: sl, thieu: Math.max(0, dhSo_(row[cThieu])), dl: cDL >= 0 ? dhNgay_(row[cDL], nam) : '', qua: {}, hong: {} };
    Object.keys(chang).forEach(function(k) {   // ô trống = chưa ghi (bỏ qua), khác với ghi số 0
      var cell = row[chang[k]];
      if (typeof cell === 'number' || /^\s*\d+(\.\d+)?\s*$/.test(String(cell == null ? '' : cell))) o.qua[k] = Math.min(sl, Math.max(0, dhSo_(cell)));
    });
    Object.keys(hong).forEach(function(k) { var x = dhSo_(row[hong[k]]); if (x > 0) o.hong[k] = Math.min(sl, x); });
    out.push(o);
  }
  return out;
}
/* Mọi dòng đơn (đã gộp 7 tab). Nhớ tạm DH_CACHE_GIAY giây, chia mảnh < 100 KB */
function dhDocDon_(lamMoi) {
  var c = CacheService.getScriptCache(), k = 'DH_DON_v1';
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
  var kq = { luc: Utilities.formatDate(new Date(), TZ_VN, 'yyyy-MM-dd HH:mm'), don: ds };
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
  var d;
  try { d = dhDocDon_(!!lamMoi); }
  catch (e) { return sach_({ ok: false, msg: 'Không đọc được Sheet "Trạng thái đơn hàng": ' + (e && e.message || e) + '. Kiểm tra tài khoản chạy web còn được chia sẻ Sheet đó.' }); }
  var sua = {};
  docAnToan_(PL_SHEET).forEach(function(r) { if (r.TenChuan) sua[String(r.TenChuan)] = r; });   // khóa dạng 'K:<tên chuẩn>' (không bị Sheet đổi thành số)
  var don = d.don.map(function(o) {
    var x = {}; for (var k in o) x[k] = o[k];
    x.tenChuan = plChuan_(o.ten);
    x.pl = plPhanLoai_(o.ten, o.ghiChu, sua['K:' + x.tenChuan]);
    return x;
  });
  return sach_({ ok: true, luc: d.luc, don: don, nhan: { loai: PL_LOAI, chuoi: PL_CHUOI, ngon: PL_NGON, tip: PL_TIP, ren: PL_REN,
    dong: PL_DONG.map(function(x) { return [x[0], x[1], x[2]]; }) } });
}

/* Chủ sở hữu sửa phân loại 1 tên hàng (áp cho mọi đơn cùng tên). bo = true -> xóa bản sửa, về tự động */
function luuPhanLoaiSKU(token, o) {
  var q = qtQuyen_(token); if (q.loi) return q.loi;
  o = o || {};
  var ten = String(o.ten || '').trim();
  if (!ten || ten.length > 300) return sach_({ ok: false, msg: 'Thiếu tên hàng.' });
  var co = function(bang, v) { return Object.prototype.hasOwnProperty.call(bang, String(v)); };
  if (!o.bo) {
    if (!co(PL_LOAI, o.loai)) return sach_({ ok: false, msg: 'Loại hàng không hợp lệ.' });
    if (o.dong && !plTimDong_(String(o.dong))) return sach_({ ok: false, msg: 'Dòng gậy không hợp lệ.' });
    if (!co(PL_CHUOI, o.chuoi) || !co(PL_NGON, o.ngon) || !co(PL_TIP, o.tip) || !co(PL_REN, o.ren)) return sach_({ ok: false, msg: 'Chọn đủ 4 thông số (chuôi, ngọn, tip, ren).' });
  }
  khoa_();
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
