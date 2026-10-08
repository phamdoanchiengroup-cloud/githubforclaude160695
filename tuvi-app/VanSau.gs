/**
 * ============================================================
 *  VanSau.gs — VẬN HẠN CHUYÊN SÂU (bổ sung cho HoiTu.gs và LuanGiai.gs)
 *
 *   1. Hồ sơ 12 tháng (vsHoSoThang_): 19 sự kiện × 12 tháng âm lịch của năm xem, 4 hệ có lịch tháng
 *      · Tử Vi  – nguyệt hạn (cung tháng tính từ tiểu hạn: đếm nghịch tháng sinh, thuận giờ sinh – cách
 *                 an "Đẩu quân" quen dùng ở Việt Nam), Tứ Hóa lưu nguyệt theo can tháng (Ngũ hổ độn),
 *                 lưu tinh năm rơi vào cung tháng
 *      · Bát Tự – can chi tháng so với tứ trụ: thập thần, hỷ – kỵ, xung – hợp – hình, phục ngâm – phản ngâm
 *                 (Thiệu Vĩ Hoa "Tứ trụ dự đoán học"; Thẩm Hiếu Chiêm "Tử Bình chân thuyên")
 *      · Chiêm tinh – quá cảnh Mặt Trời, Sao Kim, Sao Hỏa qua 12 nhà; Sao Thủy (và Kim, Hỏa) nghịch hành;
 *                 trăng non, trăng tròn, nhật – nguyệt thực (Robert Hand "Planets in Transit")
 *      · Thần số – tháng cá nhân = năm cá nhân + tháng dương lịch
 *      Hà Lạc không chia tháng (quẻ lưu niên giữ cả năm) nên không bỏ phiếu tháng.
 *      Xác suất tháng = xác suất năm phân bổ cho 12 tháng theo sức mạnh tín hiệu tháng.
 *   2. Hiệu chỉnh theo người xem (vsHieuChinh_): đối chiếu "Sự kiện đã biết" → hệ nào báo trúng thì tăng trọng số.
 *   3. Đại vận nhìn từ 5 hệ (vsDaiVan_): Tử Vi đại hạn, Bát Tự đại vận, Hà Lạc vận hào, Chiêm tinh chu kỳ lớn,
 *      Thần số đỉnh cao – thử thách; năm đỉnh của từng sự kiện trong 10 năm.
 *   4. Tử Vi lưu niên 12 cung + Tứ Hóa năm phi nhập – xung chiếu (vsTieuVanThem_, gọi từ lgTieuVan_).
 *   5. Nhật vận thêm Bát Tự ngày, Mặt Trăng qua nhà, ngày cá nhân (vsNhatThem_).
 *   6. Mai Hoa: ý nghĩa hào động (Hệ Từ truyện) và ứng kỳ theo quái khí – quái số (vsUngKy_).
 *  Mọi phần chỉ mang tính tham khảo.
 * ============================================================
 */

var VS_HE_THANG = { 'Tử Vi': 1.2, 'Bát Tự': 1.1, 'Chiêm tinh': 1, 'Thần số học': 0.6 };
var VS_NHA_Y = { 1: 'bản thân, sức sống, hình ảnh', 2: 'tiền bạc, thu nhập', 3: 'học tập, giấy tờ, đi lại gần', 4: 'nhà cửa, gia đình',
  5: 'tình yêu, con cái, niềm vui', 6: 'công việc hằng ngày, sức khỏe', 7: 'hôn nhân, đối tác', 8: 'tài chính chung, nợ nần, thay đổi sâu',
  9: 'đi xa, học cao, niềm tin', 10: 'sự nghiệp, danh tiếng', 11: 'bạn bè, quý nhân, mục tiêu', 12: 'nghỉ ngơi, nội tâm, việc kín' };
var VS_NHA_K = { 1: ['buocNgoat'], 2: ['taiLoc'], 3: ['hocHanh'], 4: ['nhaDat', 'giaDao'], 5: ['ketHon', 'sinhCon'], 6: ['sucKhoe'], 7: ['ketHon'],
  8: ['taiChinh'], 9: ['diXa', 'hocHanh'], 10: ['quanLoc'], 11: ['quyNhan'], 12: ['tinhThan'] };
var VS_CUNG12 = ['Mệnh', 'Huynh Đệ', 'Phu Thê', 'Tử Tức', 'Tài Bạch', 'Tật Ách', 'Thiên Di', 'Nô Bộc', 'Quan Lộc', 'Điền Trạch', 'Phúc Đức', 'Phụ Mẫu'];

function vsNgay_(jd) { var d = jdToDate(jd); return d[0] + '/' + d[1]; }
function vsNgayDu_(jd) { var d = jdToDate(jd); return d[0] + '/' + d[1] + '/' + d[2]; }
function vsAstD_(jd) { return jd - 2451543.5; }
function vsKhoang_(a, b) { var x = Math.abs(astNorm_(a - b)); return x > 180 ? 360 - x : x; }

/* =================== 1. TÍN HIỆU THÁNG =================== */
/** Thiên văn trong một khoảng ngày: vị trí giữa tháng, nghịch hành, trăng non/tròn, thực */
function vsThienVan_(jd0, jd1, cusp) {
  var mid = Math.round((jd0 + jd1) / 2), d = vsAstD_(mid), out = { nha: {}, nghich: [], trang: [] };
  ['sun', 'venus', 'mars'].forEach(function (p) { out.nha[p] = ctNhaCua_(p === 'sun' ? astToanBoSun_(mid) : astPlanetLon_(p, d), cusp); });
  ['mercury', 'venus', 'mars'].forEach(function (p) {
    var dau = null, prev = astPlanetLon_(p, vsAstD_(jd0 - 1));
    for (var j = jd0; j <= jd1 + 1; j++) {
      var cur = astPlanetLon_(p, vsAstD_(j)), lui = astNorm_(cur - prev) > 180;
      if (lui && dau == null && j <= jd1) dau = j;
      if ((!lui || j > jd1) && dau != null) { out.nghich.push({ p: p, tu: dau, den: j - 1, nha: ctNhaCua_(cur, cusp) }); dau = null; }
      prev = cur;
    }
  });
  var eTruoc = astNorm_(astMoonLonJD_(jd0 - 1) - astToanBoSun_(jd0 - 1));
  for (var k = jd0; k <= jd1; k++) {
    var m = astMoonLonJD_(k), s = astToanBoSun_(k), e = astNorm_(m - s);
    var non = eTruoc > 300 && e < 60, tron = eTruoc < 180 && e >= 180;
    if (non || tron) {
      var nut = astTrueNode_(k), dn = Math.min(vsKhoang_(s, nut), vsKhoang_(s, nut + 180));
      out.trang.push({ loai: non ? 'non' : 'tron', jd: k, nha: ctNhaCua_(m, cusp), thuc: non ? dn < 15 : dn < 10 });
    }
    eTruoc = e;
  }
  return out;
}

/** Tín hiệu 4 hệ cho tháng âm lịch m của năm Y. Trả về { tin, info } cùng định dạng với htTinHieu_ */
function vsTinThang_(C, Y, m) {
  var tv = C.tv, bt = C.bt, P = tv.palaces, out = {}, info = { thang: m, ly: {} };
  function add(k, he, v, ly) { if (v <= 0) return; var o = out[k] = out[k] || {}; if (!o[he]) o[he] = { v: 0, ly: [] }; o[he].v = Math.min(1.4, Math.round((o[he].v + v) * 10) / 10); if (o[he].ly.indexOf(ly) < 0) o[he].ly.push(ly); }
  var L = lgLuuTinh_(tv, Y), canDan = mod10((L.can % 5) * 2 + 2), mc = mod10(canDan + m - 1), mz = mod12(m + 1);
  var s0 = lunarToSolar(1, m, Y, 0), s1 = m < 12 ? lunarToSolar(1, m + 1, Y, 0) : lunarToSolar(1, 1, Y + 1, 0);
  var jd0 = jdFromDate(s0.day, s0.month, s0.year), jd1 = jdFromDate(s1.day, s1.month, s1.year) - 1;
  info.canChi = CAN[mc] + ' ' + CHI[mz]; info.tu = vsNgay_(jd0); info.den = vsNgay_(jd1); info.jd0 = jd0; info.jd1 = jd1;
  // ---- Tử Vi: nguyệt hạn + Tứ Hóa lưu nguyệt ----
  var pi = lgNguyetCung_(tv, Y, m), tp = lgTPTC_(pi), ex = L.ex;
  var hoa = {}; for (var h = 0; h < 4; h++) hoa[HOA_TEN[h]] = tv.pos[tv.tuHoa[mc][h]];
  function o(p) { return mod12(pi + p); }  // cung tháng theo thứ tự nghịch: 0 Mệnh, −2 Phu Thê, −3 Tử Tức, −4 Tài, −5 Tật, +6 Di, −7 Nô, −8 Quan, −9 Điền, −10 Phúc, +1 Phụ Mẫu
  function luu(p, n) { return (ex[mod12(p)] || []).indexOf('L.' + n) >= 0; }
  var tvA = function (k, v, ly) { add(k, 'Tử Vi', v, 'Tử Vi: ' + ly); };
  info.cung = P[pi].cung;
  var gocCung = P[pi].cung, T = HOA_TEN;
  if (hoa[T[0]] === pi || hoa[T[0]] === o(-4)) tvA('taiLoc', 1.1, 'Hóa Lộc tháng (' + tv.tuHoa[mc][0] + ') nhập ' + (hoa[T[0]] === pi ? 'cung tháng' : 'Tài Bạch của tháng'));
  else if (tp.indexOf(hoa[T[0]]) >= 0) tvA('taiLoc', 0.5, 'Hóa Lộc tháng chiếu cung tháng');
  if (luu(pi, 'Lộc Tồn') || luu(pi, 'Hóa Lộc')) tvA('taiLoc', 0.5, 'lưu Lộc của năm nằm ở cung tháng');
  if (hoa[T[1]] === pi || hoa[T[1]] === o(-8)) tvA('quanLoc', 1, 'Hóa Quyền tháng (' + tv.tuHoa[mc][1] + ') nhập ' + (hoa[T[1]] === pi ? 'cung tháng' : 'Quan Lộc của tháng'));
  if (hoa[T[2]] === pi || hoa[T[2]] === o(-8)) tvA('hocHanh', 0.9, 'Hóa Khoa tháng (' + tv.tuHoa[mc][2] + ') nhập ' + (hoa[T[2]] === pi ? 'cung tháng' : 'Quan Lộc của tháng'));
  if (hoa[T[2]] === pi) tvA('quyNhan', 0.4, 'Hóa Khoa tháng tại cung tháng – có người giải nguy');
  if (luu(pi, 'Thiên Khôi') || luu(pi, 'Thiên Việt')) tvA('quyNhan', 0.6, 'lưu Khôi/Việt của năm nằm ở cung tháng');
  var ky = hoa[T[3]], kyTen = tv.tuHoa[mc][3];
  if (ky === o(-4)) tvA('taiChinh', 1.1, 'Hóa Kỵ tháng (' + kyTen + ') nhập Tài Bạch của tháng');
  if (ky === o(-5)) tvA('sucKhoe', 1.1, 'Hóa Kỵ tháng (' + kyTen + ') nhập Tật Ách của tháng');
  if (ky === o(-2) || ky === o(-9) || ky === o(1)) tvA('giaDao', 0.9, 'Hóa Kỵ tháng nhập ' + (ky === o(-2) ? 'Phu Thê' : ky === o(-9) ? 'Điền Trạch' : 'Phụ Mẫu') + ' của tháng');
  if (ky === pi || ky === o(-7)) tvA('thiPhi', 0.8, 'Hóa Kỵ tháng nhập ' + (ky === pi ? 'cung tháng' : 'Nô Bộc của tháng'));
  if (ky === o(6)) tvA('thiPhi', 0.6, 'Hóa Kỵ tháng ở Thiên Di, xung chiếu cung tháng');
  if (ky === o(-10)) tvA('tinhThan', 0.9, 'Hóa Kỵ tháng nhập Phúc Đức của tháng – lo nghĩ');
  if (luu(pi, 'Kình Dương') || luu(pi, 'Đà La')) tvA('sucKhoe', 0.6, 'lưu Kình/Đà của năm nằm ở cung tháng');
  if (luu(pi, 'Thiên Khốc') || luu(pi, 'Thiên Hư') || luu(pi, 'Tang Môn')) tvA('tinhThan', 0.5, 'lưu Khốc/Hư/Tang của năm ở cung tháng');
  if (luu(pi, 'Thiên Mã')) tvA('diXa', 0.9, 'lưu Thiên Mã của năm ở cung tháng');
  if (gocCung === 'Thiên Di') tvA('diXa', 0.6, 'nguyệt hạn vào cung Thiên Di gốc');
  if (hoa[T[0]] === o(-2) || hoa[T[2]] === o(-2)) tvA('ketHon', 0.8, 'Hóa ' + (hoa[T[0]] === o(-2) ? 'Lộc' : 'Khoa') + ' tháng nhập Phu Thê của tháng');
  if (gocCung === 'Phu Thê') tvA('ketHon', 0.6, 'nguyệt hạn vào cung Phu Thê gốc');
  if (luu(pi, 'Hồng Loan') || luu(pi, 'Thiên Hỷ')) tvA('ketHon', 0.6, 'lưu Hồng Loan/Thiên Hỷ ở cung tháng');
  if (hoa[T[0]] === o(-3) || gocCung === 'Tử Tức') tvA('sinhCon', 0.6, hoa[T[0]] === o(-3) ? 'Hóa Lộc tháng nhập Tử Tức của tháng' : 'nguyệt hạn vào cung Tử Tức gốc');
  if (hoa[T[0]] === o(-9) || hoa[T[1]] === o(-9)) tvA('nhaDat', 0.8, 'Hóa ' + (hoa[T[0]] === o(-9) ? 'Lộc' : 'Quyền') + ' tháng nhập Điền Trạch của tháng');
  if (gocCung === 'Điền Trạch') tvA('nhaDat', 0.6, 'nguyệt hạn vào cung Điền Trạch gốc');
  if (gocCung === 'Quan Lộc') tvA('quanLoc', 0.5, 'nguyệt hạn vào cung Quan Lộc gốc');
  if (gocCung === 'Tài Bạch') tvA('taiLoc', 0.4, 'nguyệt hạn vào cung Tài Bạch gốc');
  info.ly['Tử Vi'] = ['Nguyệt hạn tại cung ' + gocCung + ' (' + P[pi].chiTen + '), can tháng ' + CAN[mc] + ': Lộc ' + tv.tuHoa[mc][0] + ', Quyền ' + tv.tuHoa[mc][1] + ', Khoa ' + tv.tuHoa[mc][2] + ', Kỵ ' + kyTen + ' (tại ' + P[ky].cung + ' gốc).'];
  // ---- Bát Tự: can chi tháng so với tứ trụ ----
  var btAdd = function (k, he, v, ly) { add(k, he, v, ly); };
  htBtTin_(bt, tv.info.male, mc, mz, btAdd, 'tháng');
  var tC = thapThanTen_(bt.nhatChuCan, mc), tZ = thapThanTen_(bt.nhatChuCan, TANG_CAN[mz][0]);
  info.ly['Bát Tự'] = ['Tháng ' + info.canChi + ': can là ' + tC + ', chi tàng ' + tZ + ' – ' + danhGiaVan_(CAN_HANH[mc], CHI_HANH[mz], bt.goiY.hy, bt.goiY.ky) + ' theo dụng thần ' + bt.goiY.dung + '.'];
  // ---- Chiêm tinh: quá cảnh trong tháng ----
  var ct = C.ct, cusp = ct.cusp.map(function (c) { return c.lon; }), TVn = vsThienVan_(jd0, jd1, cusp), ctLy = [], dh = [];
  var ctA = function (k, v, ly) { add(k, 'Chiêm tinh', v, 'Chiêm tinh: ' + ly); };
  var nS = TVn.nha.sun, nV = TVn.nha.venus, nM = TVn.nha.mars;
  var MT = { 10: ['quanLoc', 0.7], 2: ['taiLoc', 0.6], 5: ['ketHon', 0.5], 7: ['ketHon', 0.6], 6: ['sucKhoe', 0.4], 4: ['nhaDat', 0.5], 9: ['diXa', 0.6], 3: ['hocHanh', 0.5], 11: ['quyNhan', 0.6], 12: ['tinhThan', 0.5], 8: ['taiChinh', 0.4] };
  if (MT[nS]) ctA(MT[nS][0], MT[nS][1], 'Mặt Trời qua nhà ' + nS + ' (' + VS_NHA_Y[nS] + ')');
  if (nS === 5) ctA('sinhCon', 0.4, 'Mặt Trời qua nhà 5');
  if (nS === 9) ctA('hocHanh', 0.4, 'Mặt Trời qua nhà 9');
  if (nV === 5 || nV === 7) ctA('ketHon', 0.8, 'Sao Kim qua nhà ' + nV + ' – tình cảm thuận');
  if (nV === 2) ctA('taiLoc', 0.6, 'Sao Kim qua nhà 2 – tiền vào dễ');
  if (nV === 11) ctA('quyNhan', 0.5, 'Sao Kim qua nhà 11');
  if (nV === 4) ctA('nhaDat', 0.4, 'Sao Kim qua nhà 4 – làm đẹp nhà cửa');
  if (nM === 6 || nM === 1 || nM === 12) ctA('sucKhoe', 0.7, 'Sao Hỏa qua nhà ' + nM + ' – dễ mệt, va chạm, viêm');
  if (nM === 7) { ctA('thiPhi', 0.6, 'Sao Hỏa qua nhà 7 – va chạm với đối tác'); ctA('giaDao', 0.4, 'Sao Hỏa qua nhà 7'); }
  if (nM === 10) { ctA('quanLoc', 0.5, 'Sao Hỏa qua nhà 10 – bứt tốc, cạnh tranh'); ctA('thiPhi', 0.3, 'Sao Hỏa qua nhà 10'); }
  if (nM === 8) ctA('taiChinh', 0.5, 'Sao Hỏa qua nhà 8 – chi tiêu lớn');
  if (nM === 4) ctA('giaDao', 0.6, 'Sao Hỏa qua nhà 4 – nóng nảy trong nhà');
  ctLy.push('Giữa tháng: Mặt Trời nhà ' + nS + ', Sao Kim nhà ' + nV + ', Sao Hỏa nhà ' + nM + '.');
  var TEN_P = { mercury: 'Sao Thủy', venus: 'Sao Kim', mars: 'Sao Hỏa' };
  TVn.nghich.forEach(function (r) {
    var kh = vsNgay_(r.tu) + '–' + vsNgay_(r.den);
    ctLy.push(TEN_P[r.p] + ' nghịch hành ' + kh + ' (nhà ' + r.nha + ').');
    if (r.p === 'mercury') { ctA('thiPhi', 0.6, 'Sao Thủy nghịch hành ' + kh); dh.push(kh + ': dễ chậm trễ, nhầm lẫn giấy tờ, liên lạc, đi lại – kiểm tra kỹ trước khi ký, sao lưu dữ liệu'); }
    if (r.p === 'venus') { ctA('giaDao', 0.5, 'Sao Kim nghịch hành ' + kh); dh.push(kh + ': chuyện tình cảm, tiền bạc dễ "quay lại" việc cũ – chưa nên mua sắm lớn, chưa vội cam kết'); }
    if (r.p === 'mars') { ctA('tinhThan', 0.5, 'Sao Hỏa nghịch hành ' + kh); dh.push(kh + ': sức bật chậm lại, dễ bực bội – làm lại việc dang dở hơn là khởi sự mới'); }
  });
  TVn.trang.forEach(function (t) {
    var nk = VS_NHA_K[t.nha] || [], ng = vsNgay_(t.jd);
    if (t.thuc) {
      ctLy.push((t.loai === 'non' ? 'Nhật thực' : 'Nguyệt thực') + ' ' + ng + ' tại nhà ' + t.nha + '.');
      nk.forEach(function (k) { ctA(k, 0.8, (t.loai === 'non' ? 'nhật thực' : 'nguyệt thực') + ' tại nhà ' + t.nha); });
      ctA('buocNgoat', 0.8, (t.loai === 'non' ? 'nhật thực' : 'nguyệt thực') + ' ' + ng);
      dh.push(ng + ': điểm ngoặt liên quan đến ' + VS_NHA_Y[t.nha] + ' – việc cũ khép lại, việc mới mở ra; tránh quyết định vội trong vài ngày quanh mốc này');
    } else {
      ctLy.push((t.loai === 'non' ? 'Trăng non' : 'Trăng tròn') + ' ' + ng + ' tại nhà ' + t.nha + '.');
      if (t.loai === 'non') { nk.forEach(function (k) { ctA(k, 0.3, 'trăng non tại nhà ' + t.nha); }); dh.push(ng + ': ngày đẹp để bắt đầu việc về ' + VS_NHA_Y[t.nha]); }
      else dh.push(ng + ': việc về ' + VS_NHA_Y[t.nha] + ' lên cao trào, cảm xúc dễ dâng – nên chốt, nên hoàn tất');
    }
  });
  info.ly['Chiêm tinh'] = ctLy; info.dauMoc = dh;
  // ---- Thần số: tháng cá nhân ----
  var midD = jdToDate(Math.round((jd0 + jd1) / 2)), py = htNamCaNhan_(C.ts, tv.info.solar, midD[2]), so = tsRutGon_(py + midD[1], false);
  Object.keys(HT_SO).forEach(function (k) { var v = HT_SO[k][so]; if (v) add(k, 'Thần số học', Math.round(v * 0.8 * 10) / 10, 'Thần số: tháng cá nhân ' + so); });
  info.soThang = so; info.ly['Thần số học'] = ['Tháng cá nhân ' + so + ' (năm cá nhân ' + py + ' + tháng ' + midD[1] + ' dương lịch).'];
  var tin = {}; Object.keys(out).forEach(function (k) { tin[k] = {}; Object.keys(out[k]).forEach(function (he) { tin[k][he] = { v: out[k][he].v, ly: out[k][he].ly.join('; ') }; }); });
  return { tin: tin, info: info };
}

var VS_TS_THANG = { 1: 'tháng khởi đầu – hợp mở việc mới, chủ động đề xuất', 2: 'tháng kiên nhẫn – hợp hợp tác, lắng nghe, chăm các mối quan hệ',
  3: 'tháng giao tiếp – hợp gặp gỡ, quảng bá, sáng tạo', 4: 'tháng xây nền – hợp làm việc chăm chỉ, sắp xếp giấy tờ, tiết kiệm',
  5: 'tháng thay đổi – hợp đi lại, thử cái mới, nhưng dễ tiêu tiền', 6: 'tháng gia đình – hợp lo việc nhà, chăm người thân, chuyện tình cảm',
  7: 'tháng nội tâm – hợp học hỏi, nghỉ ngơi, suy nghĩ kỹ; chưa nên mạo hiểm', 8: 'tháng tiền bạc – hợp đàm phán, kinh doanh, khẳng định vị trí',
  9: 'tháng khép lại – hợp dọn dẹp, kết thúc việc cũ, cho đi' };

/** Hồ sơ 12 tháng của năm xem */
function vsHoSoThang_(C, luoi, W, thangTH) {
  var vy = C.tv.info.viewYear, wT = {}; Object.keys(VS_HE_THANG).forEach(function (h) { wT[h] = VS_HE_THANG[h] * ((W && W[h] && HSN_W[h]) ? W[h] / HSN_W[h] : 1); });
  var TT = {}; (thangTH || []).forEach(function (m) { TT[m.thang] = m; });
  var thang = [];
  for (var m = 1; m <= 12; m++) { var r = vsTinThang_(C, vy, m); thang.push({ m: m, tin: r.tin, info: r.info }); }
  var idxNam = (luoi[HSN_SK[0].k] || []).map(function (x) { return x.nam; }).indexOf(vy);
  var suKien = HSN_SK.map(function (S) {
    var row = idxNam >= 0 ? luoi[S.k][idxNam] : null, lam = row ? row.lam : 0;
    var e = thang.map(function (t) { return htE_({ tin: t.tin }, S, wT); }), w = e.map(function (x) { return Math.exp(HSN_BETA * x); }), tw = w.reduce(function (a, b) { return a + b; }, 0) || 1;
    return { k: S.k, ngan: S.ngan, loai: S.loai, ngoai: !row || row.a <= 0, pNam: row ? Math.min(90, row.p) : 0,
      thang: thang.map(function (t, i) { var sh = w[i] / tw; return { p: Math.round((1 - Math.exp(-lam * sh)) * 1000) / 10, rel: Math.round(sh * 12 * 10) / 10, e: e[i] }; }) };
  });
  var out = thang.map(function (t, i) {
    var he = Object.keys(VS_HE_THANG).map(function (h) {
      var tot = 0, xau = 0;
      HSN_SK.forEach(function (S, j) { if (suKien[j].ngoai) return; var v = htNet_({ tin: t.tin }, S, h); if (S.loai === 'tot') tot += Math.max(0, v); else if (S.loai === 'xau') xau += Math.max(0, v); });
      var d = tot - xau;
      return { he: h, huong: d >= 0.8 ? 'tot' : d <= -0.8 ? 'xau' : 'vua', nhan: d >= 0.8 ? 'Nghiêng thuận' : d <= -0.8 ? 'Nghiêng thử thách' : 'Trung tính' };
    });
    var sk = HSN_SK.map(function (S, j) {
      var x = suKien[j].thang[i], ung = [], nghich = [];
      Object.keys(VS_HE_THANG).forEach(function (h) { var v = htNet_({ tin: t.tin }, S, h); if (v >= 0.5) ung.push(h); else if (v <= -0.4) nghich.push(h); });
      return { k: S.k, ngan: S.ngan, loai: S.loai, p: x.p, rel: x.rel, ung: ung, nghich: nghich, ngoai: suKien[j].ngoai,
        dong: ung.length >= 3 && !nghich.length ? 'Đồng thuận' : ung.length && nghich.length ? 'Đối lập' : ung.length >= 2 ? 'Nghiêng về' : ung.length === 1 ? 'Một hệ báo' : 'Ít tín hiệu' };
    }).filter(function (x) { return !x.ngoai; });
    var noiBat = sk.filter(function (x) { return x.loai !== 'xau' && x.rel >= 1.8 && x.ung.length; }).sort(function (a, b) { return b.rel * b.p - a.rel * a.p; }).slice(0, 3);
    var canPhong = sk.filter(function (x) { return x.loai === 'xau' && x.rel >= 1.6 && x.ung.length; }).sort(function (a, b) { return b.rel * b.p - a.rel * a.p; }).slice(0, 2);
    var ly = {}; Object.keys(t.info.ly).forEach(function (h) { ly[h] = t.info.ly[h].slice(); });
    Object.keys(t.tin).forEach(function (k) { Object.keys(t.tin[k]).forEach(function (h) { (ly[h] = ly[h] || []); t.tin[k][h].ly.split('; ').forEach(function (l) { l = l.replace(/^[^:]+:\s*/, ''); if (ly[h].indexOf(l) < 0) ly[h].push(l); }); }); });
    var tt = TT[t.m] || {}, soTot = he.filter(function (x) { return x.huong === 'tot'; }).length, soXau = he.filter(function (x) { return x.huong === 'xau'; }).length;
    var tom = ['Tháng ' + t.m + ' âm lịch (' + t.info.canChi + ', ' + t.info.tu + ' – ' + t.info.den + ')' + (tt.danhGia ? ': ' + tt.danhGia.toLowerCase() : '') + ' – ' +
      (soTot > soXau ? soTot + '/4 hệ nghiêng thuận.' : soXau > soTot ? soXau + '/4 hệ nghiêng thử thách.' : 'các hệ chia đều.')];
    if (noiBat.length) tom.push('Việc dễ đến trong tháng: ' + noiBat.map(function (x) { return x.ngan + ' (' + (x.rel >= 5 ? '×5+' : '×' + String(x.rel).replace('.', ',')) + ')'; }).join(', ') + '.');
    if (canPhong.length) tom.push('Cần để ý: ' + canPhong.map(function (x) { return x.ngan; }).join(', ') + '.');
    tom.push('Nhịp tháng theo con số cá nhân: ' + VS_TS_THANG[t.info.soThang] + '.');
    var dl = sk.filter(function (x) { return x.dong === 'Đối lập' && x.rel >= 1.3; });
    if (dl.length) tom.push('Các hệ chưa thống nhất về ' + dl.map(function (x) { return x.ngan; }).join(', ') + ' – việc có thể đến nhưng kèm điều kiện, đừng quyết vội.');
    var hn = new Date(), jdN = jdFromDate(hn.getDate(), hn.getMonth() + 1, hn.getFullYear());
    return { thang: t.m, nay: jdN >= t.info.jd0 && jdN <= t.info.jd1, canChi: t.info.canChi, tu: t.info.tu, den: t.info.den, cung: t.info.cung, soThang: t.info.soThang, danhGia: tt.danhGia || '', diem: tt.diem,
      he: he, noiBat: noiBat, canPhong: canPhong, dauMoc: t.info.dauMoc, tom: tom, ly: ly };
  });
  return { nam: vy, thang: out, suKien: suKien.filter(function (x) { return !x.ngoai; }).map(function (x) { return { k: x.k, ngan: x.ngan, loai: x.loai, pNam: x.pNam, p: x.thang.map(function (t) { return t.p; }), rel: x.thang.map(function (t) { return t.rel; }) }; }),
    coSo: 'Mỗi tháng âm lịch, 4 hệ có lịch tháng cùng bỏ phiếu: Tử Vi (cung nguyệt hạn tính từ tiểu hạn – đếm nghịch tháng sinh, thuận giờ sinh; Tứ Hóa lưu nguyệt theo can tháng; lưu tinh năm ở cung tháng), Bát Tự (can chi tháng so với tứ trụ: thập thần, hỷ – kỵ, xung – hợp – hình, phục ngâm – phản ngâm), Chiêm tinh (quá cảnh Mặt Trời, Sao Kim, Sao Hỏa qua 12 nhà; các đợt nghịch hành; trăng non, trăng tròn, nhật – nguyệt thực) và Thần số học (tháng cá nhân). ' +
      'Hà Lạc dùng một quẻ cho cả năm nên không chia tháng. Xác suất tháng lấy từ xác suất cả năm của Hồ sơ năm rồi chia cho 12 tháng theo sức mạnh tín hiệu từng tháng; "×2" là gấp đôi một tháng bình thường trong năm đó.' };
}

/* =================== 2. HIỆU CHỈNH THEO NGƯỜI XEM =================== */
var VS_EV_MAP = { ketHon: 'cuoiHoi', sinhCon: 'conCai', sucKhoe: 'omDau', taiChinh: 'haoTai', giaDao: 'nguoiThan', taiLoc: 'thuNhap', quanLoc: 'doiViec' };
function vsHieuChinh_(C, namTin) {
  var vy = C.tv.info.viewYear, idx = {}; namTin.forEach(function (n, i) { idx[n.nam] = i; });
  var SK = {}; HSN_SK.forEach(function (S) { SK[S.k] = S; });
  var ev = ((C.input && C.input.events) || []).map(function (e) { return { nam: +e.nam, k: SK[e.loai] ? e.loai : VS_EV_MAP[e.loai], goc: e.loai }; })
    .filter(function (e) { return e.k && SK[e.k] && idx[e.nam] != null && e.nam <= vy; });
  var W = {}; HSN_HE.forEach(function (h) { W[h] = HSN_W[h]; });
  if (!ev.length) return { W: W, ap: false, soSk: 0 };
  var bang = HSN_HE.map(function (h) {
    var pct = [], trung = 0;
    ev.forEach(function (e) {
      var S = SK[e.k], vals = [];
      namTin.forEach(function (n) { if (htTuoiA_(S, n.tuoi) > 0) vals.push(htNet_(n, S, h)); });
      var v = htNet_(namTin[idx[e.nam]], S, h), duoi = vals.filter(function (x) { return x < v; }).length, bang = vals.filter(function (x) { return x === v; }).length;
      var p = vals.length ? (duoi + bang / 2) / vals.length : 0.5; pct.push(p); if (p >= 0.75 && v > 0) trung++;
    });
    var tb = pct.reduce(function (a, b) { return a + b; }, 0) / pct.length, co = ev.length / (ev.length + 3);
    var hs = Math.max(0.6, Math.min(1.7, Math.exp(1.6 * (tb - 0.5) * co)));
    W[h] = Math.round(HSN_W[h] * hs * 100) / 100;
    return { he: h, trung: trung, tong: ev.length, pctTB: Math.round(tb * 100), heSo: Math.round(hs * 100) / 100 };
  });
  var tot = bang.slice().sort(function (a, b) { return b.pctTB - a.pctTB; });
  var TEN = {}; HSN_SK.forEach(function (S) { TEN[S.k] = S.ngan; });
  return { W: W, ap: ev.length >= 2, soSk: ev.length, bang: bang, suKien: ev.map(function (e) { return { nam: e.nam, ten: TEN[e.k] }; }),
    tom: 'Đối chiếu ' + ev.length + ' sự kiện bạn đã khai: ' + tot[0].he + ' báo trúng nhất (' + tot[0].trung + '/' + ev.length + ' sự kiện rơi vào nhóm 25% năm mạnh nhất của hệ này)' +
      (tot[tot.length - 1].pctTB < 50 ? ', ' + tot[tot.length - 1].he + ' ít khớp nhất' : '') + '. ' +
      (ev.length >= 2 ? 'Trọng số các hệ đã được điều chỉnh riêng cho lá số của bạn – xác suất năm, tháng và đại vận bên dưới dùng trọng số này.' : 'Khai thêm ít nhất một sự kiện nữa để bắt đầu hiệu chỉnh (cần từ 2 sự kiện).'),
    coSo: 'Với mỗi sự kiện bạn khai, xét tín hiệu của từng hệ ở năm đó đứng thứ mấy so với mọi năm khác trong đời (phân vị). Hệ có phân vị trung bình cao (báo đúng năm đã xảy ra) được tăng trọng số, hệ báo sai bị giảm; mức điều chỉnh tăng dần theo số sự kiện (co lại khi ít dữ liệu) và giới hạn trong khoảng ×0,6 – ×1,7.' };
}

/* =================== 3. ĐẠI VẬN NHÌN TỪ 5 HỆ =================== */
var VS_DC_Y = { 1: 'tự lập, khởi nghiệp, khẳng định bản thân', 2: 'hợp tác, kiên nhẫn, vun đắp quan hệ', 3: 'sáng tạo, giao tiếp, thể hiện', 4: 'xây nền, làm việc chăm chỉ, tích lũy',
  5: 'thay đổi, tự do, đi nhiều', 6: 'gia đình, trách nhiệm, chăm sóc', 7: 'học hỏi, chiêm nghiệm, chuyên sâu', 8: 'tiền bạc, quyền lực, thành tựu vật chất', 9: 'cống hiến, buông bỏ, bao dung',
  11: 'trực giác, truyền cảm hứng', 22: 'kiến tạo công trình lớn', 33: 'phụng sự, chữa lành' };
var VS_TT_Y = { 0: 'tự chọn hướng đi giữa nhiều lựa chọn', 1: 'tự tin mà không áp đặt', 2: 'bớt nhạy cảm, bớt phụ thuộc', 3: 'nói ra cảm xúc thay vì giấu', 4: 'kỷ luật mà không cứng nhắc',
  5: 'tự do mà không buông thả', 6: 'chăm người khác mà không ôm đồm', 7: 'tin người, mở lòng', 8: 'cân bằng tiền bạc và giá trị sống' };
var VS_DG = { 'Đại cát': 2, 'Cát': 1, 'Bình': 0, 'Hơi kém': -1, 'Cẩn trọng': -2 };
function vsDaiVan_(C, luoi, namTin) {
  var tv = C.tv, bt = C.bt, y0 = tv.info.solar.year, out = [];
  var idx = {}; namTin.forEach(function (n, i) { idx[n.nam] = i; });
  var hlDv = ((C.hlL && C.hlL.daiVan) || []).map(function (v) { var p = String(v.nam).split('–'); return { tu: +p[0], den: +p[1], diem: v.diem, ten: v.ten, danhGia: v.danhGia, lucThan: v.lucThan }; });
  var ck = (C.ct && C.ct.chuKy) || [], dc = (C.ts && C.ts.dinhCao) || [];
  ((C.chiTiet && C.chiTiet.daiVan) || []).forEach(function (d) {
    var bd = +String(d.nam).slice(0, 4), kt = bd + 9; if (!bd || parseInt(d.khoang, 10) >= 85) return;
    var nams = []; for (var y = bd; y <= kt; y++) if (idx[y] != null) nams.push(y);
    if (!nams.length) return;
    var he = [];
    // Tử Vi
    var d10 = chuanHoa10_(d.diem);
    he.push({ he: 'Tử Vi', huong: d10 >= 6.2 ? 'tot' : d10 <= 4.3 ? 'xau' : 'vua', y: 'Đại hạn tại cung ' + d.cung + (d.canChi ? ' (' + d.canChi + ')' : '') + ': ' + d.danhGia.toLowerCase() + ' (' + String(d10).replace('.', ',') + '/10).' });
    // Bát Tự
    var sBT = 0, nBT = 0, ten = [];
    nams.forEach(function (y) { var v = bt.daiVan.filter(function (x) { return x.nam <= y; }).slice(-1)[0]; if (!v) return; sBT += VS_DG[v.danhGia] || 0; nBT++; var t = v.canChi + ' (' + v.thapThan + ', ' + v.danhGia.toLowerCase() + ')'; if (ten.indexOf(t) < 0) ten.push(t); });
    if (nBT) { var aB = sBT / nBT; he.push({ he: 'Bát Tự', huong: aB >= 0.5 ? 'tot' : aB <= -0.5 ? 'xau' : 'vua', y: 'Đại vận ' + ten.join(' rồi ') + '.' }); }
    // Hà Lạc
    var sHL = 0, nHL = 0, tH = [];
    nams.forEach(function (y) { var v = hlDv.filter(function (x) { return x.tu <= y && y <= x.den; })[0]; if (!v) return; sHL += v.diem; nHL++; if (tH.indexOf(v.ten) < 0) tH.push(v.ten + ' – ' + String(v.danhGia || '').toLowerCase()); });
    if (nHL) { var aH = sHL / nHL; he.push({ he: 'Hà Lạc', huong: aH >= 0.6 ? 'tot' : aH <= -0.6 ? 'xau' : 'vua', y: 'Vận hào ' + tH.filter(function (x, i, a) { return a.indexOf(x) === i; }).join('; ') + '.' }); }
    // Chiêm tinh: chu kỳ lớn + trung bình tín hiệu năm
    var cks = ck.filter(function (c) { return c.nam >= bd && c.nam <= kt; }), sCK = 0;
    cks.forEach(function (c) { sCK += /Thổ/.test(c.ten) ? -0.8 : /Mộc/.test(c.ten) ? 0.6 : 0; });
    var sCT = 0; nams.forEach(function (y) { var n = namTin[idx[y]]; HSN_SK.forEach(function (S) { var v = Math.max(0, htNet_(n, S, 'Chiêm tinh')); if (S.loai === 'tot') sCT += v; else if (S.loai === 'xau') sCT -= v; }); });
    var aC = sCT / nams.length / 3 + sCK / 2;
    he.push({ he: 'Chiêm tinh', huong: aC >= 0.5 ? 'tot' : aC <= -0.5 ? 'xau' : 'vua', y: cks.length ? 'Chu kỳ lớn: ' + cks.map(function (c) { return c.ten + ' (' + c.nam + ')'; }).join('; ') + '.' : 'Không có chu kỳ lớn; xét các hành tinh chậm qua 12 nhà từng năm.' });
    // Thần số: đỉnh cao ở giữa vận
    var tuoiG = Math.round((bd + kt) / 2) - y0, dcx = dc.filter(function (p) { return tuoiG >= p.tu && tuoiG <= p.den; })[0];
    var sTS = 0; nams.forEach(function (y) { var n = namTin[idx[y]]; HSN_SK.forEach(function (S) { var v = Math.max(0, htNet_(n, S, 'Thần số học')); if (S.loai === 'tot') sTS += v; else if (S.loai === 'xau') sTS -= v; }); });
    var aT = sTS / nams.length / 3;
    he.push({ he: 'Thần số học', huong: aT >= 0.5 ? 'tot' : aT <= -0.5 ? 'xau' : 'vua', y: dcx ? 'Đỉnh cao số ' + dcx.so + ' (' + (dcx.tu) + '–' + (dcx.den > 90 ? 'cuối đời' : dcx.den) + ' tuổi): chủ đề ' + (VS_DC_Y[dcx.so] || '') + '; bài học (thử thách số ' + dcx.thuThach + '): ' + (VS_TT_Y[dcx.thuThach] || '') + '.' : 'Không xác định đỉnh cao.' });
    // Năm đỉnh từng sự kiện trong 10 năm
    var dinh = [];
    HSN_SK.forEach(function (S) {
      var best = null; nams.forEach(function (y) { var x = luoi[S.k][idx[y]]; if (x.a > 0 && (!best || x.rel > best.rel)) best = x; });
      if (best && best.rel >= 1.8) dinh.push({ k: S.k, ngan: S.ngan, loai: S.loai, nam: best.nam, p: Math.min(90, best.p), rel: Math.round(best.rel * 10) / 10 });
    });
    dinh.sort(function (a, b) { return b.rel - a.rel; }); dinh = dinh.slice(0, 7).sort(function (a, b) { return a.nam - b.nam; });
    var dem = {}; nams.forEach(function (y) { dem[y] = 0; HSN_SK.forEach(function (S) { if (luoi[S.k][idx[y]].rel >= 2) dem[y]++; }); });
    var banLe = nams.slice().sort(function (a, b) { return dem[b] - dem[a]; })[0];
    var soTot = he.filter(function (x) { return x.huong === 'tot'; }).length, soXau = he.filter(function (x) { return x.huong === 'xau'; }).length;
    var nhan = soTot >= 3 && !soXau ? 'Đồng thuận thuận lợi' : soXau >= 3 && !soTot ? 'Đồng thuận thử thách' : soTot && soXau ? 'Các hệ chưa thống nhất' : soTot > soXau ? 'Nghiêng thuận' : soXau > soTot ? 'Nghiêng thử thách' : 'Bình ổn';
    var tom = ['Mười năm ' + bd + '–' + kt + ' (' + d.khoang + '): ' + soTot + '/' + he.length + ' hệ nghiêng thuận, ' + soXau + ' hệ nghiêng thử thách.'];
    if (soTot && soXau) tom.push(he.filter(function (x) { return x.huong === 'tot'; }).map(function (x) { return x.he; }).join(', ') + ' thấy thuận; ' + he.filter(function (x) { return x.huong === 'xau'; }).map(function (x) { return x.he; }).join(', ') + ' thấy thử thách – thường nghĩa là giai đoạn có cơ hội lớn nhưng phải trả giá bằng công sức hoặc biến động; chọn đúng năm để tiến.');
    if (dinh.length) tom.push('Các năm đỉnh: ' + dinh.map(function (x) { return x.ngan + ' ' + x.nam; }).join(', ') + '.');
    if (dem[banLe] >= 2) tom.push('Năm bản lề của vận: ' + banLe + ' (' + dem[banLe] + ' việc cùng nổi lên).');
    out.push({ nam: bd, den: kt, khoang: d.khoang, isNow: !!d.isNow, he: he, nhan: nhan, huong: soTot > soXau ? 'tot' : soXau > soTot ? 'xau' : 'vua', dinh: dinh, banLe: dem[banLe] >= 2 ? banLe : null, tom: tom });
  });
  return { ds: out, coSo: 'Mỗi đại vận 10 năm (mốc theo Tử Vi) được xem qua 5 hệ: Tử Vi (điểm đại hạn), Bát Tự (các đại vận 10 năm phủ lên giai đoạn, đánh giá theo dụng – kỵ thần), Hà Lạc (vận hào 6 hoặc 9 năm), Chiêm tinh (chu kỳ lớn như Sao Thổ hồi quy và tín hiệu các hành tinh chậm từng năm) và Thần số học (đỉnh cao – thử thách đang đi qua). Năm đỉnh của từng sự kiện lấy từ Hồ sơ năm (gấp ≥1,8 lần mức thường).' };
}

/* =================== 4. TỬ VI LƯU NIÊN 12 CUNG + PHI HÓA =================== */
var VS_HOA_Y = { 'Hóa Lộc': 'thuận lợi, có lợi lộc, việc trôi chảy', 'Hóa Quyền': 'chủ động, tăng quyền – cũng dễ tranh giành', 'Hóa Khoa': 'danh tiếng, giấy tờ suôn sẻ, có người giúp', 'Hóa Kỵ': 'vướng mắc, trở ngại, hao tổn – điểm cần giữ của năm' };
function vsTieuVanThem_(chart, year, th, L) {
  var P = chart.palaces, secs = [];
  var it = VS_CUNG12.map(function (ten, i) {
    var p = mod12(th - i), C = P[p], sc = lgDiemVung_(chart, p, L.ex);
    return ten + ' năm → cung ' + C.cung + ' gốc (' + C.chiTen + '): ' + (C.chinh.length ? lgSaoMoTa_(C) : 'vô chính diệu') + (L.ex[p] ? '; lưu: ' + L.ex[p].map(function (n) { return n.replace('L.', ''); }).join(', ') : '') + ' – ' + lgXepHang_(sc).toLowerCase() + ' (' + LG_LINH_VUC[ten] + ').';
  });
  secs.push({ tieuDe: 'Mười hai cung của năm ' + year, items: it });
  var hoa = [], viTri = {};
  for (var h = 0; h < 4; h++) {
    var sao = chart.tuHoa[L.can][h], p = chart.pos[sao], k = mod12(th - p), x = mod12(p + 6), kx = mod12(th - x), tenH = HOA_TEN[h];
    viTri[tenH] = p;
    hoa.push(tenH + ' năm (' + sao + ') phi nhập cung ' + VS_CUNG12[k] + ' của năm (gốc ' + P[p].cung + '): ' + LG_LINH_VUC[VS_CUNG12[k]] + ' – ' + VS_HOA_Y[tenH] + '.' +
      (h === 3 ? ' Kỵ xung chiếu cung ' + VS_CUNG12[kx] + ' của năm (gốc ' + P[x].cung + '): ' + LG_LINH_VUC[VS_CUNG12[kx]] + ' dễ bị kéo theo, cần phòng.' : ''));
  }
  if (viTri['Hóa Lộc'] === viTri['Hóa Kỵ']) hoa.push('Lộc và Kỵ năm cùng một cung: được và mất đi liền nhau – có lợi nhưng kèm phiền, giữ chừng mực.');
  if (mod12(viTri['Hóa Lộc'] + 6) === viTri['Hóa Kỵ']) hoa.push('Lộc – Kỵ năm xung nhau: cơ hội và rủi ro đối diện, thắng thua tùy cách nắm bắt.');
  var kyGoc = chart.pos['Hóa Kỵ'];
  if (kyGoc != null && (viTri['Hóa Kỵ'] === kyGoc || mod12(viTri['Hóa Kỵ'] + 6) === kyGoc)) hoa.push('Kỵ năm ' + (viTri['Hóa Kỵ'] === kyGoc ? 'trùng' : 'xung') + ' Hóa Kỵ gốc (cung ' + P[kyGoc].cung + '): "song Kỵ" – việc ở cung này dễ vướng kéo dài.');
  var locGoc = chart.pos['Hóa Lộc'];
  if (locGoc != null && viTri['Hóa Lộc'] === locGoc) hoa.push('Lộc năm trùng Hóa Lộc gốc (cung ' + P[locGoc].cung + '): "song Lộc" – năm khai thác tốt thế mạnh sẵn có.');
  hoa.push('Cách đọc: Tứ Hóa của năm lấy theo can năm ' + CAN[L.can] + '; xem sao hóa rơi vào cung nào của năm (tính từ cung tiểu hạn) để biết việc gì được lợi, việc gì vướng; Hóa Kỵ còn xung sang cung đối diện (phép "phi hóa" của Tử Vi Đẩu Số, các phái Trung Châu – Phi tinh).');
  secs.push({ tieuDe: 'Tứ Hóa năm ' + year + ' phi nhập – xung chiếu', items: hoa });
  return secs;
}

/* =================== 5. NHẬT VẬN NHIỀU HỆ =================== */
var VS_TS_NGAY = { 1: 'ngày khởi sự', 2: 'ngày hợp tác, mềm mỏng', 3: 'ngày gặp gỡ, trình bày', 4: 'ngày làm việc chi tiết', 5: 'ngày linh hoạt, đi lại', 6: 'ngày gia đình, chăm sóc', 7: 'ngày suy nghĩ, nghỉ ngơi', 8: 'ngày đàm phán, tiền bạc', 9: 'ngày hoàn tất, cho đi' };
function vsNhatThem_(C) {
  var ds = (C.chiTiet && C.chiTiet.nhatVan) || []; if (!ds.length) return;
  var bt = C.bt, nc = bt.nhatChuCan, dChi = bt.pillars[2].chi, cusp = C.ct.cusp.map(function (c) { return c.lon; }), qn = HT_QUY_NHAN[nc] || [];
  ds.forEach(function (n) {
    var m = String(n.ngay).match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/); if (!m || !n.secs || !n.secs[0]) return;
    var jd = jdFromDate(+m[1], +m[2], +m[3]), dc = mod10(jd + 9), dz = mod12(jd + 1), it = n.secs[0].items;
    var tC = thapThanTen_(nc, dc), qh = lgQuanHeChi_(dz, dChi), dg = danhGiaVan_(CAN_HANH[dc], CHI_HANH[dz], bt.goiY.hy, bt.goiY.ky);
    it.push('Bát Tự: can ngày ' + CAN[dc] + ' là ' + tC + ' với bạn (' + (THAP_THAN_Y_NGHIA[tC] || '') + '); ngũ hành ngày ' + dg.toLowerCase() + ' theo dụng thần' + (qh.length ? '; chi ngày ' + qh.join(', ') + ' với chi ngày sinh' : '') + (qn.indexOf(dz) >= 0 ? '; ngày Thiên Ất quý nhân – dễ gặp người giúp' : '') + '.');
    var nha = ctNhaCua_(astMoonLonJD_(jd), cusp);
    it.push('Chiêm tinh: Mặt Trăng đi qua nhà ' + nha + ' – cảm xúc và sự chú ý dồn vào ' + VS_NHA_Y[nha] + '.');
    var py = htNamCaNhan_(C.ts, C.tv.info.solar, +m[3]), so = tsRutGon_(py + (+m[2]) + tsRutGon_(+m[1], false), false);
    it.push('Thần số: ngày cá nhân ' + so + ' – ' + VS_TS_NGAY[so] + '.');
  });
}

/* =================== 6. MAI HOA: HÀO ĐỘNG + ỨNG KỲ =================== */
// Hệ Từ hạ truyện: "Nhị đa dự, tứ đa cụ… tam đa hung, ngũ đa công" – hào 2 nhiều khen, hào 4 nhiều lo, hào 3 nhiều hung, hào 5 nhiều công
var VS_HAO_VI = ['Hào 1 động: việc mới manh nha, còn ở bước đầu – chuẩn bị kỹ, chưa nên vội',
  'Hào 2 động ("nhị đa dự" – hào nhiều tiếng khen): việc thuận ở nội bộ, gia đình, người gần – được lòng người',
  'Hào 3 động ("tam đa hung" – hào nhiều hung): giai đoạn chuyển tiếp, dễ sai sót – thận trọng, đừng liều',
  'Hào 4 động ("tứ đa cụ" – hào nhiều lo): sắp bước lên tầm mới, gần người có quyền – cần khéo léo, khiêm tốn',
  'Hào 5 động ("ngũ đa công" – hào nhiều công): vị trí đẹp nhất của quẻ – thời cơ tốt, nên nắm lấy',
  'Hào 6 động: việc đã đến cực điểm – biết dừng đúng lúc, giữ thành quả, tránh tham thêm'];
var VS_HANH_CAN = { 'Mộc': [0, 1], 'Hỏa': [2, 3], 'Thổ': [4, 5], 'Kim': [6, 7], 'Thủy': [8, 9] };
var VS_THANG_HANH = ['Mộc', 'Mộc', 'Thổ', 'Hỏa', 'Hỏa', 'Thổ', 'Kim', 'Kim', 'Thổ', 'Thủy', 'Thủy', 'Thổ'];
function vsUngKy_(Q, t) {
  var so = {}; Object.keys(TI_TIEN_THIEN).forEach(function (n) { so[TI_TIEN_THIEN[n]] = +n; });
  var hT = HL_QUAI[Q.the].hanh, cands = [['Dụng', Q.dung], ['Hỗ', Q.ho.tren], ['Hỗ', Q.ho.duoi], ['Biến', Q.bienDung]];
  var sinh = cands.filter(function (c) { return quanHeHanh(HL_QUAI[c[1]].hanh, hT) === 'sinh'; })[0];
  var khac = cands.filter(function (c) { return quanHeHanh(HL_QUAI[c[1]].hanh, hT) === 'khac'; })[0];
  var hanhSinhThe = HANH_SINH[(HANH_SINH.indexOf(hT) + 4) % 5];
  var dich = sinh ? HL_QUAI[sinh[1]].hanh : hanhSinhThe;
  var n = so[Q.tren] + so[Q.duoi] + Q.dong;
  var jd0 = jdFromDate(t.d, t.m, t.y), ngay = [];
  for (var k = 1; k <= 30 && ngay.length < 3; k++) {
    var jd = jd0 + k, c = mod10(jd + 9), z = mod12(jd + 1);
    if (CAN_HANH[c] === dich || CHI_HANH[z] === dich) ngay.push(vsNgayDu_(jd) + ' (' + CAN[c] + ' ' + CHI[z] + ')');
  }
  var thang = []; for (var j = 0; j < 12; j++) if (VS_THANG_HANH[j] === dich) thang.push(j + 1);
  var luan = [VS_HAO_VI[Q.dong - 1] + '.'];
  luan.push('Ứng kỳ theo quái khí: ' + (sinh ? 'quẻ ' + sinh[0] + ' (' + sinh[1] + ', hành ' + dich + ') sinh Thể – việc thường ứng vào ngày, tháng hành ' + dich : (khac ? 'quẻ ' + khac[0] + ' (' + khac[1] + ') khắc Thể – việc có trở ngại, thường phải đợi đến ngày, tháng hành ' + dich + ' (hành sinh Thể) mới thông' : 'không có quẻ sinh Thể – việc ứng khi gặp ngày, tháng hành ' + dich + ' (hành sinh Thể)')) +
    '. Ngày gần nhất: ' + (ngay.length ? ngay.join(', ') : '—') + '; tháng âm lịch hợp: ' + thang.join(', ') + '.');
  luan.push('Ứng kỳ theo quái số: số quẻ trên (' + Q.tren + ' ' + so[Q.tren] + ') + quẻ dưới (' + Q.duoi + ' ' + so[Q.duoi] + ') + hào động ' + Q.dong + ' = ' + n + ' – việc gấp tính khoảng ' + n + ' ngày, việc thường ' + n + ' tuần đến ' + n + ' tháng; người hỏi đang vội thì nhanh hơn (một nửa), đang thong thả thì chậm hơn (gấp đôi).');
  return { hao: VS_HAO_VI[Q.dong - 1], luan: luan, ngay: ngay, thang: thang, so: n, hanh: dich,
    coSo: 'Ứng kỳ theo "Mai Hoa Dịch Số": quẻ lập theo thời gian là quẻ tiên thiên, ứng kỳ chủ yếu xét quái khí – ngũ hành của quẻ sinh Thể (hoặc hành sinh Thể khi Thể bị khắc) ứng vào ngày, tháng cùng hành; phép quái số lấy tổng số Tiên thiên của hai quẻ đơn cộng hào động, nhanh chậm tùy tình thế người hỏi (đi – đứng – ngồi – nằm). Ý nghĩa hào theo Hệ Từ truyện: "nhị đa dự, tứ đa cụ, tam đa hung, ngũ đa công". Các bản Mai Hoa lưu hành có khác biệt về hệ số nhanh chậm.' };
}
