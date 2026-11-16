/**
 * GiaDinh.gs – Tab "👪 Gia đình": mỗi tài khoản lưu danh sách người nhà để mở nhanh lá số, xem quan hệ (qua Cặp đôi)
 * và bảng vận năm cả nhà. 1/11/2026: mở cho mọi thành viên đã đăng nhập (chủ dự án chốt); cột Phi Tinh chỉ chủ sở hữu thấy.
 * Lưu ở trang tính "GiaDinh" của Google Sheet dự án (mỗi tài khoản một dòng JSON).
 * Danh sách mặc định của chủ sở hữu (GD_MAC_DINH) – chủ dự án đồng ý đưa thông tin gia đình lên mã (1/11).
 * Giờ Tý muộn (23–24h) luôn tính sang ngày âm hôm sau (chủ dự án nhắc 1/11) – không tắt chuyển ngày để khớp trang khác.
 */
var GD_TOI_DA = 30;
var GD_QUAN_HE = ['Bản thân', 'Vợ', 'Chồng', 'Con trai', 'Con gái', 'Cha', 'Mẹ', 'Anh', 'Chị', 'Em trai', 'Em gái', 'Ông', 'Bà', 'Họ hàng', 'Bạn bè', 'Khác'];
var GD_SH = ['Tài khoản', 'Danh sách (JSON)', 'Cập nhật'];
/** Gia đình chủ sở hữu – lấy từ 4 lá số Bắc phái trên tuvi.cohoc.net chủ dự án gửi (đã đối chiếu Mệnh/Cục/Lai Nhân khớp) */
var GD_MAC_DINH = [
  { id: 'gdmd1', ten: 'Phạm Doãn Chiến', quanHe: 'Bản thân', input: { name: 'Phạm Doãn Chiến', gender: 'nam', calendar: 'am', day: 19, month: 5, year: 1995, hour: 6, minute: 0 } },
  { id: 'gdmd2', ten: 'Vợ', quanHe: 'Vợ', input: { name: 'Vợ', gender: 'nu', calendar: 'am', day: 20, month: 9, year: 1997, hour: 2, minute: 0 } },
  { id: 'gdmd3', ten: 'Con gái', quanHe: 'Con gái', input: { name: 'Con gái', gender: 'nu', calendar: 'duong', day: 22, month: 8, year: 2023, hour: 23, minute: 30 } },   // giờ Tý muộn → sang ngày âm hôm sau (8/7 Quý Mão), chủ dự án xác nhận
  { id: 'gdmd4', ten: 'Em gái', quanHe: 'Em gái', input: { name: 'Em gái', gender: 'nu', calendar: 'am', day: 19, month: 7, year: 2001, hour: 2, minute: 0 } }
];

function gdSh_() {
  var ss = laySS_(), sh = ss.getSheetByName('GiaDinh');
  if (!sh) { sh = ss.insertSheet('GiaDinh'); sh.appendRow(GD_SH); sh.setFrozenRows(1); }
  return sh;
}
function gdDong_(sh, ten) {
  var n = sh.getLastRow(); if (n < 2) return 0;
  var f = sh.getRange(2, 1, n - 1, 1).createTextFinder(ten).matchEntireCell(true).findAll();
  return f.length ? f[0].getRow() : 0;
}
function gdDoc_(u) {
  var sh = gdSh_(), r = gdDong_(sh, u.ten);
  if (r) { try { var v = JSON.parse(sh.getRange(r, 2).getValue() || '[]'); if (Array.isArray(v)) return v; } catch (e) {} return []; }
  if (u.vaiTro === 'chu') return GD_MAC_DINH.map(gdChuan_);   // chủ sở hữu chưa lưu gì: dùng danh sách mặc định
  return [];
}
function gdGhi_(u, ds) {
  var sh = gdSh_(), r = gdDong_(sh, u.ten), v = [shO_(u.ten), JSON.stringify(ds), new Date()];
  if (r) sh.getRange(r, 1, 1, 3).setValues([v]); else sh.appendRow(v);
}
function gdChuan_(x, i) {
  var n = function (v, lo, hi) { v = parseInt(v, 10); return v >= lo && v <= hi ? v : null; };
  var inp = x && x.input || {};
  var o = {
    id: String(x && x.id || ('gd' + Date.now() + '_' + i)).slice(0, 40),
    ten: String(x && x.ten || inp.name || '').trim().slice(0, 60),
    quanHe: GD_QUAN_HE.indexOf(x && x.quanHe) >= 0 ? x.quanHe : 'Khác',
    input: { name: String(inp.name || x && x.ten || '').trim().slice(0, 60), gender: inp.gender === 'nu' ? 'nu' : 'nam', calendar: inp.calendar === 'am' ? 'am' : 'duong',
      day: n(inp.day, 1, 31), month: n(inp.month, 1, 12), year: n(inp.year, 1800, 2200), leap: inp.leap === true || inp.leap === 'true',
      hour: n(inp.hour, 0, 23) == null ? 0 : n(inp.hour, 0, 23), minute: n(inp.minute, 0, 59) == null ? 0 : n(inp.minute, 0, 59),
      lateRat: !(inp.lateRat === false || inp.lateRat === 'false'),
      place: String(inp.place || '').slice(0, 80), tz: inp.tz != null ? String(inp.tz).slice(0, 4) : '7' }
  };
  if (!o.input.day || !o.input.month || !o.input.year) throw new Error('Người thứ ' + (i + 1) + ' (' + (o.ten || 'chưa có tên') + ') thiếu ngày, tháng hoặc năm sinh.');
  if (!o.ten) o.ten = o.quanHe;
  return o;
}

/** Danh sách người nhà của tài khoản đang đăng nhập */
function giaDinhDs(token) { var u = tkCan_(token); return { ds: gdDoc_(u), quanHe: GD_QUAN_HE }; }

/** Lưu cả danh sách (thêm / sửa / xóa / sắp xếp làm ở giao diện rồi gửi lên một lần) */
function giaDinhLuu(ds, token) {
  var u = tkCan_(token);
  if (!Array.isArray(ds)) throw new Error('Danh sách không hợp lệ.');
  if (ds.length > GD_TOI_DA) throw new Error('Tối đa ' + GD_TOI_DA + ' người.');
  var sach = ds.map(gdChuan_);
  gdGhi_(u, sach);
  return { ds: sach };
}

/** Bảng vận năm cả nhà: mỗi người một dòng – tuổi, năm với tuổi, Bát Tự lưu niên (+ Phi Tinh lưu niên cho chủ sở hữu) */
function giaDinhVanNam(nam, token) {
  var u = tkCan_(token), chu = u.vaiTro === 'chu';
  nam = parseInt(nam, 10) || new Date().getFullYear();
  var chiNam = ((nam + 8) % 12 + 12) % 12;
  return { nam: nam, canChi: CAN[((nam + 6) % 10 + 10) % 10] + ' ' + CHI[chiNam], phiTinh: chu, ds: gdDoc_(u).map(function (p) {
    var o = { id: p.id, ten: p.ten, quanHe: p.quanHe };
    try {
      var inp = JSON.parse(JSON.stringify(p.input)); inp.viewYear = nam; inp.save = false;
      var tv = tuviLapLaSo_(inp), I = tv.info;
      o.tuoi = nam - I.lunar.year + 1; o.conGiap = I.conGiap || ''; o.namSinh = I.namCanChi || '';
      var d = (chiNam - I.yChi + 12) % 12;   // quan hệ chi năm xem với chi tuổi
      o.thaiTue = d === 0 ? 'Trùng tuổi (năm tuổi)' : d === 6 ? 'Xung tuổi' : (d === 3 || d === 9) ? 'Hình tuổi' : (d === 4 || d === 8) ? 'Tam hợp' : '';
      if (chu && typeof ptLap_ === 'function') {
        var ln = ptLap_(tv, nam, 1).luuNien[0];
        o.phiTinh = { muc: ln.muc, menh: ln.menh, loi: (ln.de || [])[0] || '' };
      }
      var bt = batTuLap_(inp);
      if (bt && bt.luuNien) o.batTu = { canChi: bt.luuNien.canChi, danhGia: bt.luuNien.danhGia, loi: (bt.luuNien.ghiChu || [])[0] || '' };
    } catch (e) { o.loi = String(e && e.message || e); }
    return o;
  }) };
}

/* ======================================================================================================
 * QUAN HỆ GIA ĐÌNH (1/11/2026 – chủ dự án: "xem giữa tôi và con gái mà lại có mục kết hôn, sinh con" → sửa)
 * Luận theo ĐÚNG vai: cha mẹ – con, anh chị em, ông bà – cháu, dâu rể – nhà chồng/vợ, vợ chồng, người thân khác.
 * Không còn mượn phần Cặp đôi (vốn để xem hôn nhân); vợ chồng vẫn có nút mở Cặp đôi để xem sâu.
 * Căn cứ (mỗi ý ghi ở "Căn cứ"):
 *  - Tuổi: nạp âm năm sinh (sinh/khắc theo chiều bề trên – bề dưới), thiên can, địa chi năm.
 *  - Bát Tự (Tử Bình, lục thân): con xem ngôi Ấn (mẹ) / Tài (cha); cha xem Quan Sát (con), mẹ xem Thực Thương (con);
 *    anh em là Tỷ Kiếp. Ngôi đó là hỷ dụng → người thân nâng đỡ; kỵ thần → thương nhau nhưng dễ thành áp lực.
 *    Thêm: ngũ hành mạnh nhất của người này có phải hỷ dụng của người kia (ai "tiếp sức" cho ai).
 *  - Tử Vi: cung Tử Tức của cha mẹ ↔ cung Mệnh/Phụ Mẫu của con; Huynh Đệ của anh chị em; chi cung Mệnh hai người.
 * 3–4 người (đơn vị gia đình): ma trận từng cặp, ngũ hành chung cả nhà (hành thiếu, ai bù cho ai),
 * thế tam hợp / xung của tuổi, tam giác cha – mẹ – con (con gần ai hơn, con là cầu nối hay phúc tinh), năm cả nhà cần giữ nhịp.
 * Lời "dễ hiểu" không nêu tên sao, tên cung; luôn kèm cách làm. Không phán bệnh tật, sinh tử, ly hôn.
 * ====================================================================================================== */
var GD_VAI = {
  'Bản thân': ['S', 0], 'Vợ': ['P', 0], 'Chồng': ['P', 0], 'Con trai': ['C', -1], 'Con gái': ['C', -1], 'Cha': ['M', 1], 'Mẹ': ['M', 1],
  'Anh': ['E', 0], 'Chị': ['E', 0], 'Em trai': ['E', 0], 'Em gái': ['E', 0], 'Ông': ['O', 2], 'Bà': ['O', 2]
};
/** Loại quan hệ giữa hai người theo quan hệ của mỗi người với chủ danh sách. tren = chỉ số người bề trên (0/1) hoặc -1 */
function gdLoaiCap_(qa, qb) {
  var a = GD_VAI[qa], b = GD_VAI[qb];
  if (!a || !b) return { loai: 'chung', tren: -1, ten: 'Người thân' };
  var k = a[0] + b[0], co = function (x, y) { return k === x + y ? 0 : k === y + x ? 1 : -1; }, i;
  if (co('S', 'P') >= 0 || (k === 'MM' && qa !== qb) || (k === 'OO' && qa !== qb)) return { loai: 'vc', tren: -1, ten: 'Vợ chồng' };
  if ((i = co('S', 'C')) >= 0 || (i = co('P', 'C')) >= 0) return { loai: 'cm', tren: i, ten: 'Cha mẹ – con' };
  if ((i = co('M', 'S')) >= 0 || (i = co('M', 'E')) >= 0) return { loai: 'cm', tren: i, ten: 'Cha mẹ – con' };
  if (k === 'CC' || co('S', 'E') >= 0 || k === 'EE') return { loai: 'ae', tren: -1, ten: 'Anh chị em' };
  if ((i = co('M', 'C')) >= 0 || (i = co('O', 'S')) >= 0 || (i = co('O', 'E')) >= 0) return { loai: 'ob', tren: i, ten: 'Ông bà – cháu' };
  if ((i = co('M', 'P')) >= 0) return { loai: 'dau', tren: i, ten: 'Dâu/rể – cha mẹ chồng/vợ' };
  if (co('P', 'E') >= 0) return { loai: 'ngang', tren: -1, ten: 'Anh chị em bên chồng/vợ' };
  if ((i = co('E', 'C')) >= 0) return { loai: 'tren', tren: i, ten: 'Cô/dì/chú/bác – cháu' };
  if (a[1] !== b[1]) return { loai: 'tren', tren: a[1] > b[1] ? 0 : 1, ten: 'Bề trên – bề dưới' };
  return { loai: 'ngang', tren: -1, ten: 'Người thân cùng vai' };
}
function gdNguoi_(p, vy) {
  var inp = JSON.parse(JSON.stringify(p.input)); inp.viewYear = vy; inp.save = false;
  var tv = tuviLapLaSo_(inp), bt = batTuLap_(inp), I = tv.info;
  return { p: p, ten: p.ten, quanHe: p.quanHe, tv: tv, bt: bt, male: !!I.male, nam: I.lunar.year, can: I.yCan, chi: I.yChi,
    napAm: I.banMenh, manh: cdHanhManh_(bt), tuoiTen: CAN[I.yCan] + ' ' + CHI[I.yChi] };
}
/** Ngôi lục thân (Tử Bình) của người y trong Bát Tự người x: hành nào tượng trưng cho y */
function gdNgoiLucThan_(x, L, laTren) {
  var h = x.bt.nhatChuHanh, i = HANH_SINH.indexOf(h);
  if (L.loai === 'ae' || L.loai === 'ngang') return { hanh: h, ten: 'Tỷ Kiếp (anh chị em, bạn ngang vai)' };
  if (L.loai === 'cm' || L.loai === 'ob') {
    if (laTren) { var cc = L.loai === 'ob' ? ' – ngôi con cháu, tham khảo' : ''; return x.male ? { hanh: HANH_SINH[(i + 3) % 5], ten: 'Quan Sát (con cái của người cha' + cc + ')' } : { hanh: HANH_SINH[(i + 1) % 5], ten: 'Thực Thương (con cái của người mẹ' + cc + ')' }; }
    return null;   // ngôi cha / mẹ xét theo giới của bề trên ở hàm gọi
  }
  return null;
}
/** Luận một cặp. X, Y = gdNguoi_; L = gdLoaiCap_ */
function gdCap_(X, Y, L) {
  var ds = [], tA = X.ten, tB = Y.ten;
  var T = L.tren === 1 ? Y : X, D = L.tren === 1 ? X : Y, coTren = L.tren >= 0;
  function y(loai, de, cs) { ds.push({ loai: loai, de: de, cs: cs }); }
  // 1. Tuổi năm sinh
  var q = quanHeHanh(D.napAm.hanh, T.napAm.hanh), m;
  var tT = T.ten, tD = D.ten;
  if (coTren) {
    m = q === 'sinh' ? [2, 'tot', tD + ' có xu hướng hiếu thuận, mang niềm vui và may mắn về cho ' + tT + '.'] :
      q === 'duoc_sinh' ? [1.5, 'tot', tT + ' có xu hướng hết lòng nâng đỡ, che chở ' + tD + '.'] :
      q === 'binh' ? [1.5, 'tot', 'Hai người giống tính nhau nên dễ hiểu ý; lúc căng thì cả hai cùng khó lùi bước – một người nhường trước là êm.'] :
      q === 'bi_khac' ? [0.5, 'xau', tT + ' có xu hướng nghiêm khắc, ' + tD + ' dễ thấy áp lực. Cách làm: khen trước góp ý sau, nói lý do thay vì ra lệnh.'] :
      [0, 'xau', tD + ' cá tính, hay có ý riêng khác ' + tT + '. Cách làm: cho ' + tD + ' được chọn trong giới hạn rõ ràng, kiên nhẫn lắng nghe.'];
  } else {
    m = q === 'sinh' ? [2, 'tot', tB + ' hay chăm lo, vun vén cho ' + tA + '.'] : q === 'duoc_sinh' ? [2, 'tot', tA + ' hay chăm lo, vun vén cho ' + tB + '.'] :
      q === 'binh' ? [1.5, 'tot', 'Hai người giống tính nhau nên dễ đồng cảm; lúc bất đồng thì cả hai cùng khó lùi bước.'] :
      [0, 'xau', 'Cách nghĩ hai người khá khác nhau. Cách làm: tôn trọng khác biệt, nói rõ điều mình cần thay vì để bụng.'];
  }
  y(m[1], m[2], 'Nạp âm năm sinh: ' + T.ten + ' ' + T.napAm.ten + ' (' + T.napAm.hanh + ') – ' + D.ten + ' ' + D.napAm.ten + ' (' + D.napAm.hanh + ')' + (coTren ? ', xét theo chiều bề dưới với bề trên.' : '.'));
  var c = pnQuanHeCan_(X.can, Y.can), z = pnQuanHeChi_(X.chi, Y.chi);
  if (z.d >= 2) y('tot', 'Hai tuổi thuộc cùng một nhóm hợp: ở cạnh nhau thấy dễ chịu, dễ cùng làm việc chung.', 'Địa chi năm ' + CHI[X.chi] + ' – ' + CHI[Y.chi] + ': ' + z.t + '.');
  else if (z.d === 0) y('xau', 'Hai tuổi xung nhau: dễ "đụng" nhau ở chuyện nhỏ hằng ngày. Cách làm: hẹn giờ nói chuyện khi cả hai bình tĩnh, mỗi người có góc riêng.', 'Địa chi năm ' + CHI[X.chi] + ' – ' + CHI[Y.chi] + ': ' + z.t + '.');
  else if (z.d < 1) y('xau', 'Hai tuổi dễ để bụng nhau chuyện nhỏ. Cách làm: nói thẳng nhẹ nhàng ngay khi có điều chưa vui.', 'Địa chi năm ' + CHI[X.chi] + ' – ' + CHI[Y.chi] + ': ' + z.t + '.');
  else y('ct', '', 'Địa chi năm ' + CHI[X.chi] + ' – ' + CHI[Y.chi] + ': ' + z.t + '.');
  y(c.d >= 1.5 ? 'tot' : c.d === 0 ? 'xau' : 'ct', c.d >= 2 ? 'Hai người dễ "bắt sóng" nhau, nói ít hiểu nhiều.' : c.d === 0 ? 'Đôi lúc hai người nói cùng một chuyện mà hiểu khác nhau – nên hỏi lại cho rõ.' : '', 'Thiên can năm ' + CAN[X.can] + ' – ' + CAN[Y.can] + ': ' + c.t + '.');
  var dTuoi = cdKep_((m[0] + c.d + z.d) / 6 * 8 + 1);
  // 2. Bát Tự
  var dBt = 5;
  function tiep(x, yv, tx, ty) {
    if (x.bt.goiY.hy.indexOf(yv.manh) >= 0) { dBt += 1.2; y('tot', ty + ' mang nguồn năng lượng ' + tx + ' đang cần: ở gần ' + ty + ', ' + tx + ' thấy vững vàng, có thêm động lực.', 'Ngũ hành mạnh nhất trong Bát Tự ' + ty + ' là ' + yv.manh + ' – hỷ dụng thần của ' + tx + ' (dụng thần ' + x.bt.goiY.dung + ').'); }
    else if (x.bt.goiY.ky.indexOf(yv.manh) >= 0) { dBt -= 0.6; y('xau', 'Ở gần ' + ty + ' lâu, ' + tx + ' dễ thấy mệt hoặc bị cuốn theo nhịp của ' + ty + '. Cách làm: mỗi người giữ thói quen riêng giúp mình cân bằng (giờ nghỉ, sở thích), không ép nhau sống giống mình.', 'Ngũ hành mạnh nhất của ' + ty + ' là ' + yv.manh + ' – kỵ thần của ' + tx + '.'); }
  }
  tiep(X, Y, tA, tB); tiep(Y, X, tB, tA);
  var nc = quanHeHanh(X.bt.nhatChuHanh, Y.bt.nhatChuHanh), csNc = 'Nhật chủ ' + tA + ' ' + X.bt.nhatChu + ' – ' + tB + ' ' + Y.bt.nhatChu + '.';
  if (nc === 'sinh') { dBt += 0.6; y('tot', tA + ' có xu hướng chủ động quan tâm, lo cho ' + tB + '.', csNc + ' ' + X.bt.nhatChuHanh + ' sinh ' + Y.bt.nhatChuHanh + '.'); }
  else if (nc === 'duoc_sinh') { dBt += 0.6; y('tot', tB + ' có xu hướng chủ động quan tâm, lo cho ' + tA + '.', csNc + ' ' + Y.bt.nhatChuHanh + ' sinh ' + X.bt.nhatChuHanh + '.'); }
  else if (nc === 'binh') y('ct', '', csNc + ' Cùng hành – ngang vai, dễ đồng cảm cũng dễ không ai chịu ai.');
  else { dBt -= 0.5; y('xau', 'Cách nhìn vấn đề của hai người khác nhau rõ. Cách làm: coi khác biệt là bổ sung cho nhau, phân việc theo thế mạnh của mỗi người.', csNc + ' Hai nhật chủ tương khắc.'); }
  // Lục thân Tử Bình
  function lucThan(x, hanh, ten, tx, ty, vai, tuQuyet) {
    if (!hanh) return;
    if (x.bt.goiY.hy.indexOf(hanh) >= 0) { dBt += 0.9; y('tot', 'Trong lá số của ' + tx + ', ' + vai + ' là nguồn nâng đỡ: ' + ty + ' có xu hướng là chỗ dựa, lời khuyên của ' + ty + ' dễ đi vào lòng ' + tx + '.', 'Bát Tự ' + tx + ': ngôi ' + ten + ' hành ' + hanh + ' là hỷ dụng thần.'); }
    else if (x.bt.goiY.ky.indexOf(hanh) >= 0) { dBt -= 0.5; y('xau', 'Trong lá số của ' + tx + ', tình cảm với ' + vai + ' sâu nhưng dễ thành áp lực (lo quá, kỳ vọng nhiều). Cách làm: thương bằng sự tin tưởng, ' + (tuQuyet ? 'để ' + tuQuyet + ' tự quyết dần những việc của mình.' : 'mỗi người tự quyết việc của mình, giúp khi được nhờ.'), 'Bát Tự ' + tx + ': ngôi ' + ten + ' hành ' + hanh + ' là kỵ thần.'); }
    else y('ct', '', 'Bát Tự ' + tx + ': ngôi ' + ten + ' hành ' + hanh + ' trung tính.');
  }
  var iD = D ? HANH_SINH.indexOf(D.bt.nhatChuHanh) : 0;
  if (L.loai === 'cm' || L.loai === 'ob') {
    var nT = gdNgoiLucThan_(T, L, true);
    lucThan(T, nT.hanh, nT.ten, T.ten, D.ten, L.loai === 'cm' ? 'đường con cái' : 'con cháu', D.ten);
    if (L.loai === 'cm') {
      var nD = T.male ? { hanh: HANH_SINH[(iD + 2) % 5], ten: 'Tài (người cha)' } : { hanh: HANH_SINH[(iD + 4) % 5], ten: 'Ấn (người mẹ)' };
      lucThan(D, nD.hanh, nD.ten, D.ten, T.ten, T.male ? 'người cha' : 'người mẹ', D.ten);
      if (T.bt.nhatChuHanh === nD.hanh) { dBt += 0.4; y('tot', 'Hai lá số "nhận ra nhau": tính cách của ' + T.ten + ' đúng kiểu ' + (T.male ? 'người cha' : 'người mẹ') + ' mà lá số của ' + D.ten + ' mô tả – gắn bó, dễ hiểu nhau.', 'Nhật chủ ' + T.ten + ' (' + T.bt.nhatChuHanh + ') trùng hành ngôi ' + nD.ten + ' trong Bát Tự ' + D.ten + '.'); }
    }
  } else if (L.loai === 'ae' || L.loai === 'ngang') {
    lucThan(X, X.bt.nhatChuHanh, 'Tỷ Kiếp (anh chị em)', tA, tB, 'anh chị em'); lucThan(Y, Y.bt.nhatChuHanh, 'Tỷ Kiếp (anh chị em)', tB, tA, 'anh chị em');
  }
  dBt = cdKep_(dBt);
  // 3. Tử Vi lục thân
  var dTv = 5;
  function d10(tv, ten) { return diem10_(thDiemCung_(tv, ten)); }
  function menhSao(tv) { return thChinhTinh_(tv, tv.palaces[tv.info.menh]).map(function (s) { return s.n; }); }
  function soi(x, yv, cung, tx, ty, vai) {   // cung lục thân của x (vd Tử Tức) đối với Mệnh của yv
    var p = thCungTheoTen_(x.tv, cung); if (!p) return;
    var sao = thChinhTinh_(x.tv, p).map(function (s) { return s.n; }), my = menhSao(yv.tv), chung = my.filter(function (n) { return sao.indexOf(n) >= 0; });
    var zc = pnQuanHeChi_(p.chi, yv.tv.info.menh), dc = d10(x.tv, cung);
    var cs = 'Cung ' + cung + ' của ' + tx + ' (' + CHI[p.chi] + ', ' + (sao.join(', ') || 'vô chính diệu') + ', ' + dc + '/10) – Mệnh ' + ty + ' (' + CHI[yv.tv.info.menh] + ', ' + (my.join(', ') || 'vô chính diệu') + ')';
    if (chung.length || p.chi === yv.tv.info.menh) { dTv += 1.2; y('tot', 'Lá số của ' + tx + ' "vẽ" khá đúng chân dung ' + ty + ': duyên ' + vai + ' rõ, hai người hiểu nhau từ bản tính.', cs + ': ' + (chung.length ? 'cùng chính tinh ' + chung.join(', ') : 'cùng chi') + '.'); }
    else if (zc.d >= 2) { dTv += 0.6; y('tot', 'Duyên ' + vai + ' giữa ' + tx + ' và ' + ty + ' thuận: dễ thông cảm, dễ giúp nhau.', cs + ': ' + zc.t + '.'); }
    else if (zc.d === 0) { dTv -= 0.4; y('xau', 'Giữa ' + tx + ' và ' + ty + ' có lúc như "hai thế giới". Cách làm: dành thời gian riêng hai người (đi dạo, ăn cùng) để kết nối lại.', cs + ': ' + zc.t + '.'); }
    else y('ct', '', cs + ': ' + zc.t + '.');
    dTv += (dc - 5) * 0.15;
  }
  if (L.loai === 'cm') { soi(T, D, 'Tử Tức', T.ten, D.ten, 'cha mẹ – con'); soi(D, T, 'Phụ Mẫu', D.ten, T.ten, 'cha mẹ – con'); }
  else if (L.loai === 'ae' || L.loai === 'ngang') { soi(X, Y, 'Huynh Đệ', tA, tB, 'anh chị em'); soi(Y, X, 'Huynh Đệ', tB, tA, 'anh chị em'); }
  else if (L.loai === 'vc') { soi(X, Y, 'Phu Thê', tA, tB, 'vợ chồng'); soi(Y, X, 'Phu Thê', tB, tA, 'vợ chồng'); }
  else if (L.loai === 'ob') { soi(T, D, 'Phúc Đức', T.ten, D.ten, 'ông bà – cháu'); }
  var zm = pnQuanHeChi_(X.tv.info.menh, Y.tv.info.menh), csM = 'Cung Mệnh ' + tA + ' ' + CHI[X.tv.info.menh] + ' – ' + tB + ' ' + CHI[Y.tv.info.menh] + ': ' + zm.t + '.';
  dTv += (zm.d - 1) * 0.8;
  if (zm.d >= 2) y('tot', 'Bản tính hai người hòa nhau, ở cạnh nhau thấy thoải mái.', csM);
  else if (zm.d === 0) y('xau', 'Tính khí hai người trái chiều: một người nhanh thì người kia muốn chậm. Cách làm: thống nhất trước "luật chơi" chung trong nhà.', csM);
  else y('ct', '', csM);
  dTv = cdKep_(dTv);
  var diem = cdKep_(dTuoi * 0.35 + dBt * 0.35 + dTv * 0.3);
  var xep = diem >= 8 ? 'Rất gắn bó' : diem >= 6.5 ? 'Gắn bó' : diem >= 5 ? 'Hòa hợp vừa phải' : diem >= 3.5 ? 'Cần vun đắp' : 'Cần nhiều kiên nhẫn';
  var tot = ds.filter(function (x) { return x.loai === 'tot' && x.de; }), xau = ds.filter(function (x) { return x.loai === 'xau' && x.de; });
  var tomTat = [tA + ' và ' + tB + ' (' + L.ten.toLowerCase() + ') có mức gắn bó: ' + xep.toLowerCase() + ' (' + diem + '/10).'];
  if (tot.length) tomTat.push('Điểm sáng: ' + tot.slice(0, 2).map(function (x) { return x.de.replace(/\.$/, ''); }).join('; ') + '.');
  if (xau.length) tomTat.push('Điều nên lưu ý: ' + xau[0].de);
  return { a: tA, b: tB, quanHe: [X.quanHe, Y.quanHe], loai: L.loai, loaiTen: L.ten, tren: L.tren, diem: diem, xep: xep,
    tieuChi: [{ ten: 'Tuổi năm sinh', diem: dTuoi }, { ten: 'Ngũ hành Bát Tự', diem: dBt }, { ten: 'Lá số Tử Vi', diem: dTv }],
    tomTat: tomTat, tot: tot, xau: xau, canCu: ds.map(function (x) { return x.cs; }), capDoi: L.loai === 'vc' };
}
var GD_TAM_HOP = [[8, 0, 4, 'Thân – Tý – Thìn'], [2, 6, 10, 'Dần – Ngọ – Tuất'], [5, 9, 1, 'Tỵ – Dậu – Sửu'], [11, 3, 7, 'Hợi – Mão – Mùi']];
var GD_BU_HANH = { 'Mộc': 'cây xanh, đồ gỗ, màu xanh lá', 'Hỏa': 'ánh sáng ấm, màu đỏ – cam, hoạt động ngoài trời', 'Thổ': 'gốm sứ, đá, màu vàng – nâu, nếp sinh hoạt đều đặn', 'Kim': 'đồ kim loại, màu trắng – xám, góc nhà gọn gàng', 'Thủy': 'bể cá, tranh nước, màu xanh dương – đen, trò chuyện cởi mở' };
/** Đơn vị gia đình 3–4 người */
function gdNhom_(N, caps, vy) {
  var out = { nguHanh: null, tuoi: [], tamGiac: [], vaiTro: [], nam: [] };
  // Ngũ hành cả nhà
  var tb = {}; HANH_SINH.forEach(function (h) { tb[h] = Math.round(N.reduce(function (s, x) { return s + (x.bt.phanTram[h] || 0); }, 0) / N.length * 10) / 10; });
  var sx = HANH_SINH.slice().sort(function (a, b) { return tb[b] - tb[a]; }), thieu = HANH_SINH.filter(function (h) { return tb[h] < 8; });
  var tiepSuc = N.map(function (x) {
    var ai = N.filter(function (yv) { return yv !== x && x.bt.goiY.hy.indexOf(yv.manh) >= 0; }).map(function (yv) { return yv.ten; });
    return { ten: x.ten, can: x.bt.goiY.dung, boi: ai };
  });
  out.nguHanh = { tb: tb, manh: sx[0], thieu: thieu,
    de: ['Không khí chung của cả nhà nghiêng về hành ' + sx[0] + ' (' + tb[sx[0]] + '%).' + (thieu.length ? ' Cả nhà cùng thiếu hành ' + thieu.join(', ') + ': nên bổ sung ' + thieu.map(function (h) { return GD_BU_HANH[h]; }).join('; ') + '.' : ' Năm hành trong nhà khá đủ, không thiếu hẳn hành nào.')]
      .concat(tiepSuc.map(function (t) { return t.boi.length ? t.ten + ' được ' + t.boi.join(', ') + ' tiếp sức nhiều nhất – ở gần những người này ' + t.ten + ' thấy vững vàng hơn.' : t.ten + ' ít được ai trong nhóm "tiếp sức" sẵn về năng lượng – nên tự nạp lại bằng ' + (GD_BU_HANH[t.can] || 'thói quen hợp mình') + '.'; })),
    cs: 'Trung bình tỷ lệ ngũ hành Bát Tự: ' + HANH_SINH.map(function (h) { return h + ' ' + tb[h] + '%'; }).join(', ') + '. Hỷ dụng từng người: ' + N.map(function (x) { return x.ten + ' ' + x.bt.goiY.hy.join('/'); }).join('; ') + '.' };
  // Thế tuổi: tam hợp, xung
  GD_TAM_HOP.forEach(function (g) {
    var ai = N.filter(function (x) { return g.indexOf(x.chi) >= 0 && g.indexOf(x.chi) < 3; });
    var khac = {}; ai.forEach(function (x) { khac[x.chi] = 1; });
    if (Object.keys(khac).length >= 3) out.tuoi.push({ loai: 'tot', de: ai.map(function (x) { return x.ten; }).join(', ') + ' tạo thành bộ ba tuổi hợp trọn vẹn: khi cả nhà cùng làm một việc, sức mạnh được nhân lên.', cs: 'Tam hợp ' + g[3] + '.' });
    else if (ai.length >= 2 && Object.keys(khac).length === 2) out.tuoi.push({ loai: 'tot', de: ai.map(function (x) { return x.ten; }).join(' và ') + ' hợp tuổi, dễ đứng về một phía hỗ trợ nhau.', cs: 'Bán tam hợp ' + g[3] + '.' });
  });
  for (var i = 0; i < N.length; i++) for (var j = i + 1; j < N.length; j++) {
    var z = pnQuanHeChi_(N[i].chi, N[j].chi);
    if (z.d === 0) out.tuoi.push({ loai: 'xau', de: N[i].ten + ' và ' + N[j].ten + ' xung tuổi: khi hai người căng thẳng, người thứ ba trong nhà nên làm "cầu nối" thay vì đứng về một bên.', cs: 'Lục xung ' + CHI[N[i].chi] + ' – ' + CHI[N[j].chi] + '.' });
  }
  // Tam giác cha – mẹ – con
  var capCua = function (a, b) { return caps.filter(function (c) { return (c.ia === a && c.ib === b) || (c.ia === b && c.ib === a); })[0]; };
  N.forEach(function (con, ic) {
    var chaMe = [];
    N.forEach(function (pm, ip) { var c = capCua(ic, ip); if (c && c.loai === 'cm' && ((c.ia === ip && c.tren === 0) || (c.ib === ip && c.tren === 1))) chaMe.push({ i: ip, cap: c }); });
    if (chaMe.length < 2) return;
    var a = chaMe[0], b = chaMe[1], vc = capCua(a.i, b.i), pa = N[a.i], pb = N[b.i], de = [], cs = [];
    var lech = Math.round((a.cap.diem - b.cap.diem) * 10) / 10;
    if (Math.abs(lech) < 0.5) de.push(con.ten + ' gắn bó với ' + pa.ten + ' và ' + pb.ten + ' gần như ngang nhau.');
    else { var gan = lech > 0 ? pa : pb, xa = lech > 0 ? pb : pa; de.push(con.ten + ' có xu hướng gần ' + gan.ten + ' hơn; với ' + xa.ten + ' cần thêm thời gian riêng hai người (chơi cùng, trò chuyện trước giờ ngủ) để cân bằng.'); }
    var hyCa = [pa, pb].every(function (pm) { return pm.bt.goiY.hy.indexOf(con.manh) >= 0; });
    if (hyCa) de.push(con.ten + ' mang nguồn năng lượng mà cả ' + pa.ten + ' và ' + pb.ten + ' đều cần: ' + con.ten + ' có xu hướng là người mang may mắn, niềm vui chung của cả nhà.');
    if (vc && vc.diem < Math.min(a.cap.diem, b.cap.diem)) de.push(con.ten + ' hợp với từng người hơn mức ' + pa.ten + ' và ' + pb.ten + ' hợp nhau: ' + con.ten + ' dễ thành "cầu nối" trong nhà. Lưu ý: đừng để con phải chọn phe hay làm người truyền lời khi bố mẹ chưa vui.');
    var x3 = GD_TAM_HOP.filter(function (g) { return [con.chi, pa.chi, pb.chi].every(function (c) { return g.slice(0, 3).indexOf(c) >= 0; }) && con.chi !== pa.chi && con.chi !== pb.chi && pa.chi !== pb.chi; })[0];
    if (x3) de.push('Ba người tuổi hợp trọn bộ: nhà ba người dễ đồng lòng, con lớn lên trong không khí ấm.');
    cs.push(con.ten + '–' + pa.ten + ' ' + a.cap.diem + '/10; ' + con.ten + '–' + pb.ten + ' ' + b.cap.diem + '/10' + (vc ? '; ' + pa.ten + '–' + pb.ten + ' ' + vc.diem + '/10' : '') + '. Ngũ hành mạnh của ' + con.ten + ': ' + con.manh + '.');
    out.tamGiac.push({ con: con.ten, chaMe: [pa.ten, pb.ten], de: de, cs: cs.join(' ') });
  });
  // Vai trò theo thế thân Bát Tự: người lớn (≥ 18 tuổi mụ) mới xét "giữ nhịp"; trẻ thân vượng → cá tính mạnh
  var lon = N.filter(function (x) { return vy - x.nam + 1 >= 18; }).sort(function (a, b) { return b.bt.tyLeTro - a.bt.tyLeTro; });
  if (lon.length) out.vaiTro.push({ de: lon[0].ten + ' có xu hướng là người giữ nhịp, quyết đoán trong nhà – nên nhớ hỏi ý mọi người trước khi chốt.', cs: 'Tỷ lệ trợ thân Bát Tự cao nhất trong người lớn: ' + lon[0].bt.tyLeTro + '% (' + lon[0].bt.cuong + ').' });
  if (lon.length > 1) { var mem = lon[lon.length - 1]; out.vaiTro.push({ de: mem.ten + ' có xu hướng mềm mỏng, dễ nhường – cả nhà nên chủ động hỏi ' + mem.ten + ' muốn gì.', cs: 'Tỷ lệ trợ thân thấp nhất trong người lớn: ' + mem.bt.tyLeTro + '% (' + mem.bt.cuong + ').' }); }
  N.filter(function (x) { return vy - x.nam + 1 < 18 && x.bt.tyLeTro >= 58; }).forEach(function (x) {
    out.vaiTro.push({ de: x.ten + ' có cá tính mạnh từ nhỏ: dạy bằng cách giải thích lý do và cho chọn trong giới hạn, tránh áp đặt.', cs: 'Bát Tự ' + x.ten + ': trợ thân ' + x.bt.tyLeTro + '% (' + x.bt.cuong + ').' });
  });
  // 5 năm tới: năm nhiều người phạm tuổi / năm hợp nhiều người
  for (var Y = vy; Y < vy + 5; Y++) {
    var cy = ((Y + 8) % 12 + 12) % 12, pham = [], hop = [];
    N.forEach(function (x) { var d = (cy - x.chi + 12) % 12; if (d === 0 || d === 6 || d === 3 || d === 9) pham.push(x.ten); else if (d === 4 || d === 8) hop.push(x.ten); });
    out.nam.push({ nam: Y, canChi: CAN[((Y + 6) % 10 + 10) % 10] + ' ' + CHI[cy], pham: pham, hop: hop,
      de: pham.length >= 2 ? 'Nhiều người cùng cần giữ nhịp (' + pham.join(', ') + '): việc lớn của cả nhà nên bàn kỹ, chia nhau gánh việc.' : hop.length >= 2 ? 'Năm thuận cho việc chung của ' + hop.join(', ') + ' (sửa nhà, đi chơi xa, học thêm).' : '' });
  }
  return out;
}
/* ---------- Phần lẻ "Bạn và người thân: hiểu nhau hơn" (quan_he, 9 xu/cặp – chủ dự án chốt 16/11) ----------
 * 5 mục theo đề xuất 07: cách thể hiện tình thương · chỗ dễ va chạm · cách nói chuyện · năm thuận để gắn bó · 3 việc nên làm.
 * Ghép tự động từ tín hiệu của gdCap_ (không có mục kết hôn / sinh con). canViet = true: content-creator viết văn riêng cho từng vai. */
/* Văn riêng cho từng vai (content-creator 16/11/2026). {T} = người bề trên / người lớn hơn, {D} = người bề dưới / nhỏ hơn,
 * {A}, {B} = hai người khi ngang vai; {g} = cách gọi bề trên (cha/mẹ, ông/bà…). Giai đoạn tuổi của người nhỏ:
 * nho ≤ 6, hoc 7–12, lon 13–18, truong ≥ 19 (tuổi mụ năm xem). Không có nội dung kết hôn / sinh con; không nêu tên sao, thuật ngữ. */
var GD_VIEC_VAI = {
  cm: {
    nho: ['Mỗi ngày dành 15 phút chơi cùng {D} theo cách {D} chọn, không điện thoại.', 'Khen cụ thể việc {D} vừa làm được ("con tự cất đồ chơi rồi") thay vì khen chung chung.', 'Giữ một nghi thức nhỏ trước giờ ngủ: kể chuyện, ôm, nói "{g} thương con".'],
    hoc: ['Mỗi tuần một buổi riêng hai người: đi ăn sáng, đi dạo hay làm một việc nhỏ cùng nhau, không điện thoại.', 'Cùng {D} đặt luật màn hình và giờ học – luật cùng đặt thì dễ giữ.', 'Khi góp ý, nói điều mình thấy và điều mình mong, tránh so sánh {D} với bạn bè.'],
    lon: ['Giữ một thói quen chung không áp lực: ăn sáng cuối tuần, xem chung một bộ phim, đi xe cùng nhau.', 'Hỏi ý {D} trước những việc lớn liên quan đến {D}, dù {T} là người quyết.', 'Tin trước, nhắc sau: giao cho {D} một việc thật và để {D} tự chịu trách nhiệm.'],
    truong: ['Gọi điện hoặc ghé thăm đều đặn, không chỉ khi có việc.', 'Nói lời cảm ơn và ghi nhận nhau – điều người trong nhà thường nghĩ mà ít nói ra.', 'Bàn trước những việc lớn của gia đình để không ai thấy mình bị đặt trước sự đã rồi.']
  },
  ae: {
    nho: ['Cho hai anh chị em một việc chung (dọn phòng, chăm cây) và khen cả hai cùng lúc.', 'Tránh so sánh hai anh chị em trước mặt nhau.', 'Mỗi người có một góc đồ riêng được tôn trọng – không ai phải "nhường vì là anh chị".'],
    truong: ['Giữ một thói quen liên lạc đều đặn: một cuộc gọi mỗi tuần, một bữa cơm mỗi tháng.', 'Chuyện tiền bạc giữa anh chị em nên rõ ràng, có ghi lại, để tình cảm không bị ảnh hưởng.', 'Cùng nhau lo một việc cho cha mẹ – làm chung là cách gắn bó tự nhiên nhất.']
  },
  ob: {
    nho: ['Để {T} kể chuyện hoặc hát ru cho {D} nghe – đó là món quà mà chỉ {g} mới có.', 'Cho {D} phụ {T} một việc nhỏ: tưới cây, nhặt rau, xếp đồ.', 'Chụp ảnh {T} và {D} cùng nhau mỗi dịp về thăm – sau này đó là kỷ niệm quý.'],
    truong: ['Dành thời gian nghe {T} kể chuyện xưa – đó là cách gắn bó tự nhiên nhất.', 'Nhờ {T} dạy {D} một việc nhỏ (nấu món quen, trồng cây) để hai thế hệ có việc chung.', 'Gọi điện hoặc ghé thăm đều đặn; một cuộc gọi video ngắn cũng làm {T} vui cả ngày.']
  },
  dau: ['Chủ động hỏi thăm, nhớ những dịp quan trọng của người kia (ngày sinh, ngày giỗ, Tết).', 'Có điều chưa vui thì nói trực tiếp, nhẹ nhàng, lúc chỉ có hai người – tránh để người thứ ba truyền lời.', 'Tôn trọng nếp nhà của nhau, thống nhất trước những việc chung.'],
  tren: ['Giữ liên lạc vào những dịp quan trọng trong năm.', 'Khi cần lời khuyên, hỏi thẳng và lắng nghe trọn vẹn trước khi trả lời.', 'Cùng làm một việc nhỏ chung (đi chơi, nấu ăn) để có kỷ niệm riêng.'],
  ngang: ['Giữ một thói quen liên lạc đều đặn.', 'Nói rõ từ đầu điều mình có thể góp và không thể góp cho việc chung.', 'Tôn trọng khác biệt, phân việc chung theo thế mạnh của mỗi người.'],
  chung: ['Giữ liên lạc đều đặn, nhất là vào những dịp cả họ gặp nhau.', 'Hỏi thẳng người trong cuộc thay vì nghe chuyện qua người khác.', 'Tôn trọng chuyện riêng của mỗi nhà.']
};
/** Cách thể hiện tình thương / lúc căng thẳng / cách nói chuyện hợp – theo hành mạnh nhất trong lá số mỗi người */
var GD_HANH_THUONG = { 'Mộc': 'thương bằng sự khích lệ: muốn người kia lớn lên, hay động viên và chỉ đường', 'Hỏa': 'thương bằng sự nhiệt tình: nói ra, làm ngay, vui cùng người kia một cách rõ ràng',
  'Thổ': 'thương bằng sự chăm lo thầm lặng: bữa ăn, chỗ ở, những việc thiết thực hằng ngày', 'Kim': 'thương bằng sự chu đáo có nguyên tắc: giữ lời, lo trước, nhắc nhở đúng lúc', 'Thủy': 'thương bằng sự lắng nghe: để ý cảm xúc, hiểu cả điều người kia chưa nói' };
var GD_HANH_CANG = { 'Mộc': 'dễ giữ ý mình đến cùng', 'Hỏa': 'dễ nói nhanh, nói thẳng rồi mới nghĩ', 'Thổ': 'dễ im lặng và ôm chuyện trong lòng', 'Kim': 'dễ góp ý thẳng, khó nhân nhượng khi thấy sai nguyên tắc', 'Thủy': 'dễ lảng đi, thu mình vào suy nghĩ riêng' };
var GD_HANH_NOI = { 'Mộc': 'nói về hướng đi và điều có thể làm tốt hơn, tránh chê trước mặt người khác', 'Hỏa': 'nói ngắn, rõ, vào lúc vui; chuyện khó thì đợi cơn nóng qua rồi mới bàn',
  'Thổ': 'cho thời gian nghĩ, vài hôm sau hỏi lại nhẹ nhàng', 'Kim': 'nói có lý do, có ví dụ cụ thể và giữ đúng điều đã hứa', 'Thủy': 'hỏi mở, để họ tự nói ra, không ép trả lời ngay' };
/** Văn theo vai: thuong (bề trên, bề dưới), vaCham, noiChuyen, nam (việc hợp làm trong năm thuận) – cm/ob theo giai đoạn tuổi người nhỏ */
var GD_VAN_VAI = {
  cm: {
    thuongT: '{T} có xu hướng thương {D} theo kiểu lo xa: luôn nghĩ trước một bước cho {D}, đôi khi lo nhiều hơn cả điều {D} thật sự cần.',
    thuongD: { nho: '{D} còn nhỏ nên thương rất thật: tìm {g} khi vui, bám {g} khi mệt – đó là cách {D} nói "con tin {g}".',
      hoc: '{D} ở tuổi đi học thường thương {g} bằng cách muốn được khen, muốn khoe với {g} điều mình vừa làm được.',
      lon: '{D} ở tuổi lớn thường thương theo cách kín đáo hơn: ít nói ra, nhưng vẫn để ý từng lời {g} nói về mình.',
      truong: '{D} đã trưởng thành thường thương {g} bằng việc làm: hỏi han, đỡ đần, mong {g} bớt vất vả.' },
    vaCham: { nho: 'Chỗ dễ va chạm thường là giờ ăn, giờ ngủ và những lần {D} muốn tự làm theo ý mình. Với trẻ nhỏ, đó là cách tập lớn chứ không phải cãi lời.',
      hoc: 'Chỗ dễ va chạm thường là chuyện học, chuyện màn hình và việc giữ lời hứa của cả hai bên.',
      lon: 'Chỗ dễ va chạm thường là khoảng riêng tư, bạn bè và những lựa chọn của {D}: {D} cần được tin, còn {T} cần được yên tâm.',
      truong: 'Chỗ dễ va chạm thường là lời khuyên được nhắc quá nhiều lần, chuyện nghề nghiệp, tiền bạc hay nhịp sống riêng của mỗi người – cả hai đều thương, nhưng mỗi người một cách.' },
    noiChuyen: { nho: 'Với {D} còn nhỏ, nói ngắn, ngồi ngang tầm mắt và cho {D} chọn một trong hai cách sẽ hiệu quả hơn ra lệnh.',
      hoc: 'Hỏi {D} "hôm nay có chuyện gì vui nhất" thay vì chỉ hỏi chuyện học – câu hỏi nhẹ mở ra câu chuyện dài.',
      lon: 'Nói chuyện lúc cùng làm một việc (đi xe, nấu ăn) thường dễ hơn ngồi đối diện; nghe hết rồi mới góp ý.',
      truong: 'Khi góp ý, hỏi trước "có muốn nghe ý kiến không" – một câu hỏi nhỏ giữ được sự tôn trọng hai chiều.' },
    nam: { nho: 'cùng đi chơi xa, cho {D} trải nghiệm điều mới bên {g}', hoc: 'cùng đi một chuyến xa hoặc học chung một điều mới', lon: 'cùng làm một dự án nhỏ hay đi một chuyến chỉ hai người',
      truong: 'cùng về thăm quê, đi một chuyến xa hoặc ngồi lại nói chuyện về dự định của mỗi người' }
  },
  ae: {
    thuongT: '{T} có xu hướng thương {D} theo kiểu người đi trước: nhường, che chắn và hay nhắc nhở.',
    thuongD: { nho: '{D} thương {T} bằng cách bắt chước, muốn đi theo và chơi cùng {T}.', truong: '{D} thường thương {T} bằng sự tin cậy: có chuyện là tìm đến {T} trước tiên, dù ngoài miệng ít nói.' },
    ngang: '{A} và {B} gần tuổi nhau nên thương nhau như bạn: vừa thân vừa hay so bì, giận nhanh mà làm lành cũng nhanh.',
    vaCham: { nho: 'Chỗ dễ va chạm thường là đồ dùng, góc riêng và cảm giác ai được chiều hơn; khi lớn hơn, đó dễ thành sự so sánh ai giỏi hơn.',
      truong: 'Chỗ dễ va chạm giữa anh chị em thường là sự so sánh, chuyện tiền bạc và cách chia nhau lo cho cha mẹ.' },
    noiChuyen: { nho: 'Khi hai anh chị em giành nhau, để mỗi người kể phần mình trước khi người lớn phân xử – được nghe là đã nguôi một nửa.',
      truong: 'Giữa anh chị em, nói thẳng nhẹ nhàng với nhau tốt hơn nhờ người khác truyền lời; người lớn hơn bớt giọng "dạy bảo", người nhỏ hơn nói rõ mình cần được giúp hay chỉ cần được nghe.' },
    nam: { nho: 'cho hai anh chị em một chuyến đi chơi hay một việc chung', truong: 'cùng tổ chức một dịp sum họp, đi một chuyến chung hoặc cùng lo một việc cho cha mẹ' }
  },
  ob: {
    thuongT: '{T} có xu hướng thương {D} theo kiểu bao dung: dễ chiều, dễ bỏ qua, luôn để dành phần ngon cho cháu.',
    thuongD: { nho: '{D} thương {g} rất hồn nhiên: thích được kể chuyện, được dắt đi chơi, được ôm.', hoc: '{D} thương {g} hồn nhiên: thích được kể chuyện, được {g} khen trước mặt mọi người.',
      lon: '{D} ở tuổi lớn thương {g} kín đáo hơn – ít nói, nhưng nhớ những món {g} hay nấu, những câu {g} hay dặn.', truong: '{D} đã trưởng thành thường thương {g} bằng sự biết ơn: muốn về thăm, muốn {g} vui khỏe.' },
    vaCham: { nho: 'Chỗ dễ khác ý thường không nằm giữa hai người mà ở cách chiều cháu: {T} thương nên dễ chiều, khác với nếp cha mẹ đang dạy.',
      truong: 'Chỗ dễ khác ý thường là khoảng cách thế hệ: cách ăn mặc, giờ giấc, cách dùng điện thoại và những lời dặn lặp lại nhiều lần.' },
    noiChuyen: { nho: 'Với cháu nhỏ, {T} kể bằng câu chuyện sẽ dễ vào hơn lời dặn; cha mẹ và {T} nên thống nhất vài nếp chung để {D} không bị rối.',
      truong: 'Với ông bà, nói chậm, nói rõ và hỏi về chuyện ngày xưa là cách mở lòng nhanh nhất; với cháu đã lớn, {T} nên kể bằng câu chuyện hơn là lời dặn.' },
    nam: { nho: 'đưa {D} về thăm {g} lâu hơn thường lệ', truong: 'về thăm {g}, cùng đi một chuyến ngắn hoặc ghi lại chuyện xưa của {g}' }
  },
  dau: {
    thuongT: '{T} có xu hướng thương {D} theo cách của người đi trước: muốn chỉ bảo, muốn {D} sớm hòa vào nếp nhà.',
    thuongD: '{D} thường thể hiện tình cảm với {T} bằng sự chu đáo và tôn trọng; tình thân lớn dần theo thời gian, không cần vội.',
    vaCham: 'Chỗ dễ khác ý thường là nếp sinh hoạt của hai gia đình: cách nấu ăn, cách chi tiêu, cách sắp xếp nhà cửa và chuyện ai quyết việc gì.',
    noiChuyen: 'Có điều chưa vui thì nói trực tiếp, nhẹ nhàng, lúc chỉ có hai người; một lời hỏi "con làm thế này đã đúng ý chưa" mở ra nhiều hơn mười lần im lặng.',
    nam: 'cùng chuẩn bị một dịp sum họp, đi một chuyến chung hoặc học nhau một món ăn của mỗi nhà'
  },
  tren: {
    thuongT: '{T} có xu hướng thương {D} như một người đi trước: sẵn lòng góp ý, chỉ đường khi {D} cần.',
    thuongD: '{D} thường quý {T} theo cách tin cậy: có chuyện khó nói với cha mẹ, {T} lại là người dễ tâm sự.',
    vaCham: 'Chỗ dễ khác ý thường là khi lời khuyên đi xa hơn điều {D} hỏi, hoặc khi chuyện giữa các nhà trong họ xen vào.',
    noiChuyen: 'Khi {D} hỏi ý, {T} nghe trọn trước khi trả lời; khi {T} góp ý, {D} nghe đến hết rồi hãy giải thích.',
    nam: 'gặp nhau nhiều hơn, cùng làm một việc chung hoặc đi một chuyến ngắn'
  },
  ngang: {
    thuong: '{A} và {B} là người thân "qua một người khác", nên tình cảm thường bắt đầu từ sự lịch sự rồi lớn dần thành tin cậy.',
    vaCham: 'Chỗ dễ khác ý thường là chuyện góp sức, góp tiền cho việc chung của gia đình và cảm giác ai làm nhiều, ai làm ít.',
    noiChuyen: 'Nói rõ điều mình có thể làm và không thể làm ngay từ đầu; rõ ràng giữ hòa khí lâu hơn khéo léo.',
    nam: 'cùng lo một việc chung của gia đình hoặc gặp nhau ngoài những dịp bắt buộc'
  },
  chung: {
    thuong: '{A} và {B} là người thân trong họ hàng; tình cảm thể hiện qua những lần có mặt đúng lúc: ngày giỗ, ngày Tết, lúc nhà có việc.',
    vaCham: 'Chỗ dễ khác ý thường là lời ra tiếng vào trong họ và những chuyện được kể lại qua người khác.',
    noiChuyen: 'Hỏi thẳng người trong cuộc thay vì nghe qua người khác; chuyện riêng của mỗi nhà để mỗi nhà tự quyết.',
    nam: 'gặp nhau nhiều hơn vào những dịp cả họ sum họp'
  }
};
function gdLuanQH_(X, Y, L, c, vy) {
  var tA = X.ten, tB = Y.ten;
  function boCach(t) { return String(t).split(/\s*Cách làm:\s*/)[0].trim(); }
  var cachLam = []; c.xau.forEach(function (x) { var m = String(x.de).split(/Cách làm:\s*/)[1]; if (m && cachLam.indexOf(m.trim()) < 0) cachLam.push(m.trim()); });
  // Ai là bề trên / người lớn hơn (anh chị em: theo năm sinh), giai đoạn tuổi của người nhỏ, cách gọi bề trên
  var loai = GD_VAN_VAI[L.loai] ? L.loai : 'chung', V = GD_VAN_VAI[loai];
  var T = L.tren === 1 ? Y : L.tren === 0 ? X : (X.nam <= Y.nam ? X : Y), D = T === X ? Y : X;
  var ngang = loai === 'ngang' || loai === 'chung' || (loai === 'ae' && T.nam === D.nam);
  var tuoiD = vy - D.nam + 1, gd = tuoiD <= 6 ? 'nho' : tuoiD <= 12 ? 'hoc' : tuoiD <= 18 ? 'lon' : 'truong';
  var g = loai === 'ob' ? (T.male ? 'ông' : 'bà') : loai === 'cm' ? (T.male ? 'bố' : 'mẹ') : T.ten;
  function thay(s) { return String(s).replace(/\{T\}/g, T.ten).replace(/\{D\}/g, D.ten).replace(/\{A\}/g, tA).replace(/\{B\}/g, tB).replace(/\{g\}/g, g); }
  // Bảng chỉ có nho/truong: 7–12 tuổi dùng câu "nho"; 13–18 tuổi dùng "truong" (anh chị em tuổi lớn vẫn dùng "nho")
  function theoTuoi(o) { if (typeof o === 'string' || Array.isArray(o)) return o; return o[gd] || (gd === 'hoc' || (gd === 'lon' && loai === 'ae') ? o.nho : null) || o.truong; }
  function hanh(bang, p) { return bang[p.manh] || ''; }
  // 1. Cách mỗi người thể hiện tình thương: câu theo vai + câu theo hành của từng người + điểm sáng từ lá số
  var thuong = [];
  if (ngang) thuong.push(thay(V.thuong || GD_VAN_VAI.ae.ngang));
  else { thuong.push(thay(V.thuongT)); thuong.push(thay(theoTuoi(V.thuongD))); }
  var hT = hanh(GD_HANH_THUONG, T), hD = hanh(GD_HANH_THUONG, D);
  if (hT && hD) thuong.push(T.manh === D.manh ? 'Hai người giống nhau ở cách thương: cùng ' + hT + '. Vì giống nên dễ hiểu nhau, chỉ cần nhớ đôi khi người kia cũng cần được thương theo kiểu khác.' :
    T.ten + ' có xu hướng ' + hT + '; còn ' + D.ten + ' có xu hướng ' + hD + '. Nhận ra "ngôn ngữ thương" của nhau, hai người sẽ bớt hiểu lầm những lúc người kia lo theo cách của mình.');
  c.tot.slice(0, 2).forEach(function (x) { thuong.push(x.de); });
  // 2. Chỗ dễ va chạm: câu theo vai + lúc căng thẳng mỗi người phản ứng thế nào + điều lá số nhắc, kết bằng hướng nhẹ nhàng
  var vaCham = [thay(theoTuoi(V.vaCham))];
  var cT = hanh(GD_HANH_CANG, T), cD = hanh(GD_HANH_CANG, D);
  if (cT && cD && !(gd === 'nho' && !ngang)) vaCham.push(T.manh === D.manh ? 'Khi căng thẳng, cả hai cùng ' + cT + ' – vì vậy một người nên chủ động dịu trước, không cần chờ ai đúng ai sai.' :
    'Khi căng thẳng, ' + T.ten + ' ' + cT + ', còn ' + D.ten + ' ' + cD + '; biết trước điều này, mỗi người sẽ đỡ thấy bị tổn thương.');
  c.xau.slice(0, 2).forEach(function (x) { vaCham.push(boCach(x.de)); });
  vaCham.push(c.xau.length ? 'Những chỗ này không làm tình thân mỏng đi; biết trước để nhường nhau đúng lúc là đủ (cách làm ở mục kế tiếp).' : 'Hai người ít điểm va chạm lớn – chỉ cần giữ thói quen nói rõ điều mình cần.');
  // 3. Cách nói chuyện: câu theo vai + cách nói hợp với từng người + cách làm lá số gợi ý
  var noiChuyen = [thay(theoTuoi(V.noiChuyen))];
  var nT = hanh(GD_HANH_NOI, T), nD = hanh(GD_HANH_NOI, D);
  if (nT && nD && !(gd === 'nho' && !ngang)) noiChuyen.push('Muốn ' + T.ten + ' nghe, nên ' + nT + '. Muốn ' + D.ten + ' mở lòng, nên ' + nD + '.');
  else if (nT) noiChuyen.push('Muốn ' + T.ten + ' nghe, nên ' + nT + '.');
  cachLam.slice(0, 2).forEach(function (x) { noiChuyen.push(x.charAt(0).toUpperCase() + x.slice(1)); });
  // 4. Năm thuận để gắn bó (giữ cách tính: năm hợp tuổi một trong hai người, không năm nào phạm tuổi)
  var viecNam = thay(theoTuoi(V.nam)), namGanBo = [];
  for (var Y2 = vy; Y2 < vy + 6; Y2++) {
    var cy = ((Y2 + 8) % 12 + 12) % 12, d = function (p) { return (cy - p.chi + 12) % 12; };
    var phamA = [0, 6, 3, 9].indexOf(d(X)) >= 0, phamB = [0, 6, 3, 9].indexOf(d(Y)) >= 0, hopA = [4, 8].indexOf(d(X)) >= 0, hopB = [4, 8].indexOf(d(Y)) >= 0;
    if ((hopA || hopB) && !phamA && !phamB) namGanBo.push({ nam: Y2, canChi: CAN[((Y2 + 6) % 10 + 10) % 10] + ' ' + CHI[cy],
      de: 'Năm ' + Y2 + ' thuận cho ' + (hopA && hopB ? 'cả hai' : hopA ? tA : tB) + ' – hợp để ' + viecNam + '.' });
  }
  // ds giữ đúng 1 dòng cho mỗi năm (khớp thứ tự với nam[]); lời dẫn và lời kết gắn vào dòng đầu / dòng cuối
  var namDs = namGanBo.length ? namGanBo.map(function (x) { return x.de; }) :
    ['Sáu năm tới không có năm nào nổi bật hẳn – sự gắn bó đến từ thói quen đều đặn hơn là thời điểm. Mỗi năm, hãy chọn một dịp để ' + viecNam + '.'];
  if (namGanBo.length) {
    namDs[0] = namDs[0] + ' Đây là năm không ai trong hai người phải giữ nhịp, lại có người gặp năm hợp tuổi – lúc thuận để có thêm kỷ niệm chung.';
    namDs[namDs.length - 1] += ' Những năm không có trong danh sách không phải năm xấu; chỉ là lúc nên giữ nếp quen thay vì bày việc lớn.';
  }
  // 5. 3 việc nên làm: một cách làm lá số gợi ý + việc theo vai (và giai đoạn tuổi)
  var VV = theoTuoi(GD_VIEC_VAI[loai] || GD_VIEC_VAI.chung), viec = [];
  cachLam.slice(0, 1).concat(VV.map(thay)).forEach(function (x) { x = x.charAt(0).toUpperCase() + x.slice(1); if (viec.length < 3 && viec.indexOf(x) < 0) viec.push(x); });
  return { canViet: false, muc: [
    { k: 'thuong', ten: 'Cách mỗi người thể hiện tình thương', ds: thuong },
    { k: 'vaCham', ten: 'Chỗ dễ va chạm', ds: vaCham },
    { k: 'noiChuyen', ten: 'Cách nói chuyện để hiểu nhau', ds: noiChuyen },
    { k: 'namGanBo', ten: 'Năm thuận để gắn bó', ds: namDs, nam: namGanBo },
    { k: 'viec', ten: '3 việc nên làm', ds: viec }
  ] };
}
/** Bản xem thử của một cặp chưa mở quan_he: giữ điểm, xếp loại, 1 dòng tóm tắt, 1 điểm sáng + 1 điều lưu ý */
function gdQhRutGon_(c) {
  c.tot = c.tot.slice(0, 1); c.xau = c.xau.slice(0, 1); c.canCu = []; c.tomTat = c.tomTat.slice(0, 1);
  c.luan = { khoa: true, muc: c.luan ? c.luan.muc.map(function (m) { return { k: m.k, ten: m.ten }; }) : [] };
  return c;
}
/** API: luận quan hệ 2–4 người trong danh sách gia đình (theo id). Mọi thành viên đã đăng nhập xem được bản xem thử;
 *  bản đầy đủ của từng cặp (không phải vợ chồng) mở bằng phần lẻ quan_he: muaPhan(token, { ids: [idA, idB] }, 'quan_he'). */
function giaDinhQuanHe(ids, token) {
  var u = tkCan_(token), ds = gdDoc_(u);
  if (!Array.isArray(ids)) throw new Error('Chọn người cần xem.');
  var chon = []; ids.forEach(function (id) { var p = ds.filter(function (x) { return x.id === id; })[0]; if (p && chon.indexOf(p) < 0) chon.push(p); });
  if (chon.length < 2 || chon.length > 4) throw new Error('Chọn từ 2 đến 4 người trong danh sách.');
  var vy = new Date().getFullYear(), N = chon.map(function (p) { return gdNguoi_(p, vy); });
  var caps = [], toan = ttToanQuyen_(u), giaQH = (ttBangGia_().phan.quan_he || {}).xu;
  for (var i = 0; i < N.length; i++) for (var j = i + 1; j < N.length; j++) {
    var L = gdLoaiCap_(N[i].quanHe, N[j].quanHe), c = gdCap_(N[i], N[j], L); c.ia = i; c.ib = j; caps.push(c);
    if (c.capDoi) { c.tot = c.tot.slice(0, 1); c.xau = c.xau.slice(0, 1); c.canCu = []; c.tomTat = c.tomTat.slice(0, 1).concat(['Phần hợp hôn chi tiết (tuổi, Bát Tự, lá số vợ chồng, năm thuận) xem ở tab Cặp đôi.']); continue; }   // giữ phần Cặp đôi đang bán
    // 16/11: phần lẻ quan_he theo từng cặp (khóa giống Cặp đôi – không phụ thuộc thứ tự)
    c.luan = gdLuanQH_(N[i], N[j], L, c, vy);
    c.ids = [chon[i].id, chon[j].id]; c.giaQH = giaQH;
    c.moQH = toan || ttCoPhanKhoa_(u.ten, ttKhoaCapDoi_(chon[i].input, chon[j].input), 'quan_he');
    if (!c.moQH) gdQhRutGon_(c);
  }
  var out = { nguoi: N.map(function (x) { return { id: x.p.id, ten: x.ten, quanHe: x.quanHe, tuoi: x.tuoiTen, napAm: x.napAm.ten, nhatChu: x.bt.nhatChu, manh: x.manh, dung: x.bt.goiY.dung }; }), cap: caps, nam: vy };
  if (N.length >= 3) out.nhom = gdNhom_(N, caps, vy);
  return out;
}
