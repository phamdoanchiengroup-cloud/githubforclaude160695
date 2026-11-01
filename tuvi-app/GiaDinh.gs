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
  var sh = gdSh_(), r = gdDong_(sh, u.ten), v = [u.ten, JSON.stringify(ds), new Date()];
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
      var tv = tuviLapLaSo(inp), I = tv.info;
      o.tuoi = nam - I.lunar.year + 1; o.conGiap = I.conGiap || ''; o.namSinh = I.namCanChi || '';
      var d = (chiNam - I.yChi + 12) % 12;   // quan hệ chi năm xem với chi tuổi
      o.thaiTue = d === 0 ? 'Trùng tuổi (năm tuổi)' : d === 6 ? 'Xung tuổi' : (d === 3 || d === 9) ? 'Hình tuổi' : (d === 4 || d === 8) ? 'Tam hợp' : '';
      if (chu && typeof ptLap_ === 'function') {
        var ln = ptLap_(tv, nam, 1).luuNien[0];
        o.phiTinh = { muc: ln.muc, menh: ln.menh, loi: (ln.de || [])[0] || '' };
      }
      var bt = batTuLap(inp);
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
  var tv = tuviLapLaSo(inp), bt = batTuLap(inp), I = tv.info;
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
/** API: luận quan hệ 2–4 người trong danh sách gia đình (theo id). Mọi thành viên đã đăng nhập. */
function giaDinhQuanHe(ids, token) {
  var u = tkCan_(token), ds = gdDoc_(u);
  if (!Array.isArray(ids)) throw new Error('Chọn người cần xem.');
  var chon = []; ids.forEach(function (id) { var p = ds.filter(function (x) { return x.id === id; })[0]; if (p && chon.indexOf(p) < 0) chon.push(p); });
  if (chon.length < 2 || chon.length > 4) throw new Error('Chọn từ 2 đến 4 người trong danh sách.');
  var vy = new Date().getFullYear(), N = chon.map(function (p) { return gdNguoi_(p, vy); });
  var caps = [];
  for (var i = 0; i < N.length; i++) for (var j = i + 1; j < N.length; j++) {
    var L = gdLoaiCap_(N[i].quanHe, N[j].quanHe), c = gdCap_(N[i], N[j], L); c.ia = i; c.ib = j; caps.push(c);
    if (c.capDoi) { c.tot = c.tot.slice(0, 1); c.xau = c.xau.slice(0, 1); c.canCu = []; c.tomTat = c.tomTat.slice(0, 1).concat(['Phần hợp hôn chi tiết (tuổi, Bát Tự, lá số vợ chồng, năm thuận) xem ở tab Cặp đôi.']); }   // giữ phần Cặp đôi đang bán
  }
  var out = { nguoi: N.map(function (x) { return { id: x.p.id, ten: x.ten, quanHe: x.quanHe, tuoi: x.tuoiTen, napAm: x.napAm.ten, nhatChu: x.bt.nhatChu, manh: x.manh, dung: x.bt.goiY.dung }; }), cap: caps, nam: vy };
  if (N.length >= 3) out.nhom = gdNhom_(N, caps, vy);
  return out;
}
