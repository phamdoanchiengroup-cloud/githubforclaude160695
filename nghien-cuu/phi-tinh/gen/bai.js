
/* ------------------------------------------------------------------------------------------------------------------------------------
 * Bài luận Phi Tinh theo mục lục Bắc phái (dựng lại 1/11/2026): Tổng quan → Mệnh → Thân → 11 cung → 12 đại vận → vận năm → 12 tháng → phụ lục.
 * Lời luận lấy từ PT_KHO (kho tổng hợp catalog.json – đã viết lại bằng lời mới): tra khóa cụ thể trước, không có thì lùi về khóa "*".
 * Mỗi mục: { t: dòng căn cứ (thuật ngữ), chu: chủ đề đời thường, muc: cat|hung|trung, de: [lời dễ hiểu], cc: [ "nguồn – ý chuyên môn" ] }.
 * ---------------------------------------------------------------------------------------------------------------------------------- */
var PT_THUY_ = typeof PT_THUY_ !== 'undefined' ? PT_THUY_ : null;   // quy tắc Thuận/Nghịch thủy Kỵ (gen/cong-thuc.js)
var PT_THU_TU_BAI = ['Mệnh', 'Phu Thê', 'Tử Tức', 'Tài Bạch', 'Phúc Đức', 'Điền Trạch', 'Tật Ách', 'Thiên Di', 'Quan Lộc', 'Phụ Mẫu', 'Huynh Đệ', 'Nô Bộc'];   // thứ tự mục lục bài Bắc phái
var PT_KHO_TEN = { 'Lộc': 'Lộc', 'Quyền': 'Quyền', 'Khoa': 'Khoa', 'Kỵ': 'Kỵ' };
function ptO_(goc, ten) { return ptCungTu_(goc, PT_CUNG.indexOf(ten)); }          // ô của cung "ten" khi Mệnh tầng ở ô goc
function ptTamDiem_(o) { return [o, ptD_(o), (o + 11) % 12]; }                       // ứng kỳ: chi cung nhận, đối cung, chi liền trước
function ptThangCuaChi_(c) { return ((c - 2) % 12 + 12) % 12 + 1; }                  // tháng âm mang chi c (Dần = tháng Giêng)

/** Tra kho: thử lần lượt các khóa, trả về danh sách ý của khóa đầu tiên có */
function ptKho_(khoa) {
  for (var i = 0; i < khoa.length; i++) { var v = PT_KHO[khoa[i]]; if (v && v.length) return v; }
  return null;
}
/** Dựng một mục luận. ds = danh sách ý [nguồn, ky, de, muc]; chon = hàm lọc ý (tùy chọn); toiDa = số câu dễ hiểu tối đa */
function ptMuc_(t, ds, chu, chon, toiDa) {
  if (!ds) return null;
  if (chon) ds = ds.filter(chon);
  if (!ds.length) return null;
  var de = [], cc = [], dem = { cat: 0, hung: 0, trung: 0 };
  ds.forEach(function (y) {
    dem[y[3]] = (dem[y[3]] || 0) + 1;
    if (y[1] && cc.length < 4) cc.push((y[0] ? y[0] + ': ' : '') + y[1]);
    if (y[2] && de.indexOf(y[2]) < 0 && de.length < (toiDa || 2)) de.push(y[2]);
  });
  var muc = dem.cat > dem.hung ? 'cat' : dem.hung > dem.cat ? 'hung' : 'trung';
  return { t: t, chu: chu || '', muc: muc, de: de, cc: cc };
}
/** Mục lấy từ kho theo các khóa thử dần */
function ptMucK_(t, khoa, chu, chon, toiDa) { return ptMuc_(t, ptKho_(khoa), chu, chon, toiDa); }
/** Mục tự soạn (khi kho không có khóa – lùi về văn cũ PT_VAN/PT_LUAN) */
function ptMucTu_(t, ky, de, chu, muc, trong) { return ky || de || trong ? { t: t, chu: chu || '', muc: muc || 'trung', de: de ? [de] : [], cc: ky ? [ky] : [] } : null; }
function ptDay_(ds, m) { if (m) ds.push(m); }

/* ---------- Nguyên cục: các mẫu Lộc/Kỵ có tên (theo cung phát) ---------- */
function ptMauNC_(N, tv) {
  var ra = [], ten = N.ten, phi = N.phi, snKy = N.sn[3].toi, snLoc = N.sn[0].toi, snQuyen = N.sn[1].toi, snKySao = N.sn[3].sao;
  function them(cung, khoa, t, chon, an) { ra.push({ cung: cung, khoa: khoa, t: t, chon: chon, an: an }); }
  for (var i = 0; i < 12; i++) {
    var X = ten[i], ky = phi[i][3].toi, loc = phi[i][0].toi;
    if (ky != null && ky !== i) {
      if (PT_THUY_ && PT_THUY_.nghich(N, i)) them(X, 'Nghịch thủy Kỵ', X + ' phi Kỵ (' + phi[i][3].sao + ') sang cung đối ' + ten[ky] + ' – nơi có Kỵ năm sinh, không tự hóa');
      else if (ky === ptD_(i)) them(X, X === 'Điền Trạch' || X === 'Tài Bạch' ? 'Lưu xuất Kỵ' : 'Tiết xuất Kỵ', X + ' phi Kỵ sang cung đối ' + ten[ky]);
    }
    if (loc != null && loc === ptD_(i)) {
      if (snLoc === loc) them(X, 'Điệp xuất Lộc', X + ' phi Lộc sang ' + ten[loc] + ' – nơi đã có Lộc năm sinh');
      else them(X, 'Tiết xuất Lộc', X + ' phi Lộc sang cung đối ' + ten[loc]);
      if (phi[loc][0].toi === i || snLoc === i) them(X, 'Đối trì Lộc', 'Hai đầu trục ' + X + ' – ' + ten[loc] + ' cùng có Lộc');
    }
    for (var j = i + 1; j < 12; j++) {
      if (loc === j && phi[j][0].toi === i) them(X, 'Lộc Lộc trao đổi', X + ' và ' + ten[j] + ' phi Lộc cho nhau');
    }
    for (var j2 = 0; j2 < 12; j2++) if (j2 !== i && ky === j2 && phi[j2][0].toi === i) them(X, 'Thị phi Kỵ', X + ' phi Kỵ nhập ' + ten[j2] + ' trong khi ' + ten[j2] + ' phi Lộc về ' + X);
  }
  if (snKy != null) {
    var tuKy = N.tuHoa.some(function (t) { return t.o === snKy && t.h === 3 && t.loai === 'lyTam'; });
    if ([2, 5, 8, 11].indexOf(snKy) >= 0) them(ten[snKy], 'Tứ mã Kỵ', 'Kỵ năm sinh (' + snKySao + ') ở ' + CHI[snKy]);
    if ([1, 4, 7, 10].indexOf(snKy) >= 0 && !N.coLyTam(snKy)) them(ten[snKy], 'Nhập khố Kỵ', 'Kỵ năm sinh (' + snKySao + ') ở ' + CHI[snKy] + ', cung không tự hóa');
    if ([0, 3, 6, 9].indexOf(snKy) >= 0) them(ten[snKy], 'Tứ chính Kỵ', 'Kỵ năm sinh (' + snKySao + ') ở ' + CHI[snKy]);
  }
  N.tuHoa.forEach(function (t) {
    if (t.loai === 'lyTam' && t.h === 3 && [2, 5, 8, 11].indexOf(t.o) >= 0 && t.o !== snKy) them(ten[t.o], 'Tứ mã Kỵ', ten[t.o] + ' tự hóa Kỵ ở ' + CHI[t.o]);
  });
  // Củ triền Kỵ: hai cung khác nhau phi Kỵ vào hai đầu một trục đối
  var daXet = {};
  for (var a = 0; a < 12; a++) for (var b = 0; b < 12; b++) {
    var ka = phi[a][3].toi, kb = phi[b][3].toi;
    if (a === b || ka == null || kb == null || ka === a || kb === b || kb !== ptD_(ka)) continue;
    var truc = Math.min(ka, kb) + '-' + Math.max(ka, kb); if (daXet[truc]) continue; daXet[truc] = 1;
    var cT = [ten[ka], ten[kb]], chon = null;
    if (cT.indexOf('Tử Tức') >= 0 || cT.indexOf('Tài Bạch') >= 0) chon = function (y, n) { return n === 1; };
    else chon = function (y, n) { return n === 0; };
    them(ten[a], 'Củ triền Kỵ', ten[a] + ' phi Kỵ nhập ' + ten[ka] + ', ' + ten[b] + ' phi Kỵ nhập ' + ten[kb] + ' (trục ' + cT.join(' – ') + ')', chon);
  }
  // Song Lộc: Lộc năm sinh gặp Lộc Tồn (ngoài Mệnh – Mệnh dùng cách "Lộc hợp uyên ương"), hoặc Lộc và Quyền năm sinh cùng tọa
  if (snLoc != null && snLoc === snQuyen && ten[snLoc] === 'Điền Trạch') them(ten[snLoc], 'Song Lộc', 'Lộc và Quyền năm sinh cùng tọa ' + ten[snLoc], function (y, n) { return n === 1; });
  // Song Kỵ nguyên cục: Mệnh phi Kỵ trùng/xung Kỵ năm sinh
  var mk = phi[N.o['Mệnh']][3].toi;
  if (snKy != null && mk != null && (mk === snKy || mk === ptD_(snKy))) them('Mệnh', 'Song Kỵ', 'Mệnh phi Kỵ ' + (mk === snKy ? 'trùng' : 'xung') + ' Kỵ năm sinh ở ' + ten[snKy]);
  return ra;
}
/** Mẫu → mục luận (chọn ý theo chỉ số khi khóa có nhiều ý cho nhiều trường hợp) */
function ptMauMuc_(m) {
  var ds = PT_KHO['mau|' + m.khoa]; if (!ds) return null;
  if (m.chon) ds = ds.filter(function (y, n) { return m.chon(y, n); });
  var x = ptMuc_(m.khoa + ': ' + m.t, ds, ptLv_(m.cung));
  return x;
}

/* ---------- Cách cục tại Mệnh ---------- */
function ptCach_(N, tv) {
  var m = N.o['Mệnh'], p = tv.pos, ra = [], tp = [m, (m + 4) % 12, (m + 8) % 12, ptD_(m)];
  if (p['Văn Xương'] === m && p['Văn Khúc'] === m) ra.push('Văn quế văn hoa');
  if (p['Thiên Cơ'] === m && p['Cự Môn'] === m) ra.push('Cơ Cự đồng lâm');
  if (N.sn[0].toi === m && p['Lộc Tồn'] === m) ra.push('Lộc hợp uyên ương');
  if (tp.indexOf(p['Thiên Phủ']) >= 0 && tp.indexOf(p['Thiên Tướng']) >= 0) ra.push('Phủ Tướng triều viên');
  return ra;
}

/** Sao trong một ô (dùng tra khóa sao|<Sao>|<Cung>) */
function ptSaoO_(tv, o) {
  var ds = []; Object.keys(tv.pos).forEach(function (s) { if (tv.pos[s] === o) ds.push(s); });
  if (!(tv.palaces[o].chinh || []).length) ds.push('Vô chính diệu');
  return ds;
}

/* ---------- Luận một cung nguyên cục theo mục lục ---------- */
function ptCungBai_(N, tv, X, mauNC, ck) {
  var i = N.o[X], can = CAN[N.P[i].can], lv = ptLv_(X), van = PT_VAN || {}, phan = [];
  // 1. Cung khí, can cung
  var a = [];
  if (ck) ptDay_(a, ck.cung[i]);
  ptDay_(a, ptMucK_('Can cung ' + X + ': ' + can, ['canCung|' + X + '|' + can], lv));
  if (ck && ck.tdn) ptDay_(a, ck.tdn[i]);
  if (a.length) phan.push({ ten: 'Cung khí và can cung', muc: a });
  // 2. Mẫu phi hóa
  var b = mauNC.filter(function (m) { return m.cung === X; }).map(ptMauMuc_).filter(Boolean);
  if (X === 'Mệnh') ptCach_(N, tv).filter(function (c) { return c === 'Lộc hợp uyên ương'; }).forEach(function (c) { ptDay_(b, ptMucK_('Song Lộc tại Mệnh (' + c + ')', ['mau|Song Lộc'], lv, function (y, n) { return n === 0; })); });
  if (b.length) phan.push({ ten: 'Mẫu phi hóa', muc: b });
  // 3. Tứ Hóa năm sinh tọa, tự hóa
  var c = [];
  N.sn.forEach(function (f) {
    if (f.toi !== i) return;
    var H = PT_H[f.h], t = 'Hóa ' + H + ' năm sinh (' + f.sao + ') tọa ' + X, v = ((van.snToa || {})[H] || {})[X] || {};
    ptDay_(c, ptMucK_(t, ['snToa|' + H + '|' + X], lv) || ptMucTu_(t, v.ky, v.de, lv, H === 'Kỵ' ? 'trung' : 'cat'));
  });
  N.tuHoa.filter(function (t) { return t.o === i; }).forEach(function (t) {
    var H = PT_H[t.h], nhan = X + ' tự hóa ' + H + (t.loai === 'lyTam' ? ' ly tâm' : ' hướng tâm') + ' (' + t.sao + ')', v = (((van.tuHoa || {})[t.loai] || {})[H]) || {};
    var m = t.loai === 'lyTam' ? ptMucK_(nhan, ['tuHoa|' + X + '|' + H], lv) : null;
    ptDay_(c, m || ptMucTu_(nhan, ptThay_(v.ky, { lv: lv }), ptThay_(v.de, { lv: lv }), lv));
    if (t.loai === 'lyTam') ptDay_(c, ptMucK_('Tự hóa ly tâm ở ' + X, ['mau|Tự hóa li tâm'], lv));
  });
  if (c.length) phan.push({ ten: 'Tứ Hóa năm sinh và tự hóa', muc: c });
  // 4. Cung phi Lộc / Quyền / Khoa / Kỵ
  var d = [];
  N.phi[i].forEach(function (f) {
    if (f.toi == null || f.toi === i || f.toi === ptD_(i)) return;   // tự hóa (ly tâm/hướng tâm) đã nói ở trên
    var H = PT_H[f.h], Y = N.ten[f.toi], chuyen = ptTenTu_(i, f.toi);
    var t = X + ' (can ' + can + ') phi Hóa ' + H + ' (' + f.sao + ') nhập ' + Y + (X !== 'Mệnh' ? ' – ' + Y + ' là cung ' + chuyen + ' tính từ ' + X : '');
    var m = ptMucK_(t, ['phi|' + X + '|' + H + '|' + Y], lv, null, 2);
    if (!m) {
      var rieng = (PT_LUAN[X] || {})[H + '|' + Y], v = ((van.phi || {})[H]) || {};
      m = rieng ? ptMucTu_(t, rieng.luan, rieng.de, lv, H === 'Kỵ' ? 'hung' : 'cat') :
        ptMucTu_(t, ptThay_(v.ky, { A: X, B: Y }), f.h === 0 || f.h === 3 ? ptThay_(v.de, { A: lv, B: ptLv_(Y) }) : '', lv, H === 'Kỵ' ? 'trung' : 'cat');
    }
    ptDay_(d, m);
  });
  var ckChuoi = N.chuyenKy(i);
  if (ckChuoi.o.length > 2 && d.length) d[d.length - 1].cc.push('Chuỗi Kỵ chuyển Kỵ: ' + ckChuoi.o.map(function (x) { return N.ten[x]; }).join(' → ') + (ckChuoi.kyXuat ? ' (dừng ở tự hóa Kỵ)' : '') + '.');
  if (d.length) phan.push({ ten: X + ' phi Lộc – Quyền – Khoa – Kỵ', muc: d });
  // 5. M chất, sao, cách cục
  var e = [];
  if (N.sn.some(function (f) { return f.toi === i; })) ptDay_(e, ptMucK_(X + ' có M chất (có Tứ Hóa năm sinh tọa)', ['mchat|' + X + '|chat'], lv));
  var daM = {};
  N.phi[i].forEach(function (f) {
    if (f.toi == null || f.toi === i) return; var Y = N.ten[f.toi]; if (daM[Y]) return; daM[Y] = 1;
    ptDay_(e, ptMucK_('M ' + Y + ' của ' + X + ' (' + X + ' phi Hóa ' + PT_H[f.h] + ' vào ' + Y + ')', ['mchat|' + X + '|' + Y], lv));
  });
  ptSaoO_(tv, i).forEach(function (s) { if (!(X === 'Mệnh' && (tv.palaces[i].chinh || []).some(function (x) { return x.n === s; }))) ptDay_(e, ptMucK_(s + ' tại ' + X, ['sao|' + s + '|' + X], lv)); });
  if (ck) { var kl = ptMucK_('Cách dùng cung khí cho ' + X + ' (Sở Hoàng)', ['cungKhiLuan|' + X], lv); if (kl) { kl.de = []; ptDay_(e, kl); } }
  if (e.length) phan.push({ ten: 'M chất, sao và cách cục', muc: e });
  return { id: 'c-' + X, ten: 'Cung ' + X, phu: can + ' ' + CHI[i], chu: lv, phan: phan };
}

/* ---------- Thể – Dụng giữa hai tầng (đại vận/nguyên cục, năm/đại vận, tháng/năm) ---------- */
/** theGoc, dungGoc: ô Mệnh của tầng lớn (Thể) và tầng nhỏ (Dụng). Can 12 ô cố định (Ngũ Hổ Độn năm sinh). snO: {ô: [Hóa]} Hóa năm sinh. */
function ptTheDung_(N, tv, theGoc, dungGoc, tang, snO, dungHoa) {
  var dong = [], diem = {}, P = N.P, menhNC = N.o['Mệnh'];
  PT_CUNG.forEach(function (X) { diem[X] = { tot: 0, xau: 0, ds: [] }; });
  function cham(X, d, nhan) { var z = diem[X]; if (d > 0) z.tot = Math.max(z.tot, d); else z.xau = Math.max(z.xau, -d); z.ds.push(nhan); }
  PT_CUNG.forEach(function (X) {
    var uT = ptO_(theGoc, X), uD = ptO_(dungGoc, X);
    if (snO && snO[uD]) cham(X, 2, 'M chất (' + snO[uD].join(', ') + ')');  // tầng nhỏ chồng lên cung có Hóa năm sinh
    if (uT === uD) return;                                                 // hai tầng trùng cung: không có dòng Thể – Dụng riêng
    ptHoa_(tv, P[uD].can).forEach(function (f) {                            // Dụng → Thể
      if (f.toi == null) return; var H = PT_H[f.h];
      if (f.toi === uT) { dong.push({ X: X, huong: 'Dụng→Thể', loai: 'nhap', H: H, sao: f.sao, sao4: 3, o: f.toi, tu: uD }); cham(X, H === 'Kỵ' ? -2 : 2, (H === 'Kỵ' ? 'quy vị Kỵ' : 'quy vị ' + H)); }
      else if (f.toi === ptD_(uT)) { var lx = H === 'Kỵ' ? 'xung' : 'chieu'; dong.push({ X: X, huong: 'Dụng→Thể', loai: lx, H: H, sao: f.sao, sao4: 4, o: f.toi, tu: uD }); cham(X, H === 'Kỵ' ? -3 : H === 'Lộc' ? 3 : 1, H + ' Dụng ' + (H === 'Kỵ' ? 'xung' : 'chiếu') + ' Thể'); }
      if (X !== 'Mệnh' && X !== 'Thiên Di' && tang === 'dv') {           // Thiên Di: đối cung là Mệnh gốc – đã tính ở Dụng→Thể                                  // ĐV.X phi Hóa vào Mệnh nguyên cục
        if (f.toi === menhNC) { dong.push({ X: X, huong: 'Mệnh', loai: H === 'Kỵ' ? 'kyNhapMenh' : 'catNhapMenh', H: H, sao: f.sao, sao4: 0, o: f.toi, tu: uD }); cham(X, H === 'Kỵ' ? -1 : 1, H + ' nhập Mệnh gốc'); }
        else if (H === 'Kỵ' && f.toi === ptD_(menhNC)) { dong.push({ X: X, huong: 'Mệnh', loai: 'kyXungMenh', H: H, sao: f.sao, sao4: 0, o: f.toi, tu: uD }); cham(X, -2, 'Kỵ xung Mệnh gốc'); }
      }
    });
    ptHoa_(tv, P[uT].can).forEach(function (f) {                            // Thể → Dụng
      if (f.toi == null) return; var H = PT_H[f.h];
      if (f.toi === uD) { dong.push({ X: X, huong: 'Thể→Dụng', loai: 'nhap', H: H, sao: f.sao, sao4: 1, o: f.toi, tu: uT }); cham(X, H === 'Kỵ' ? -2 : 1, H + ' Thể nhập Dụng'); }
      else if (f.toi === ptD_(uD)) { var lx2 = H === 'Kỵ' ? 'xung' : 'chieu'; dong.push({ X: X, huong: 'Thể→Dụng', loai: lx2, H: H, sao: f.sao, sao4: 2, o: f.toi, tu: uT }); cham(X, H === 'Kỵ' ? -2 : 1, H + ' Thể ' + (H === 'Kỵ' ? 'xung' : 'chiếu') + ' Dụng'); }
    });
  });
  return { dong: dong, diem: diem, trung: theGoc === dungGoc };
}
/** Xếp mức tổng luận một chủ đề: cat / binh / hung (+ nhãn chữ theo cách cohoc chấm) */
function ptXep_(z) {
  if (!z.tot && !z.xau) return null;
  var T = ['', 'tốt bình thường', 'khá tốt', 'rất tốt'], X = ['', 'xấu bình thường', 'khá xấu', 'rất xấu'];
  if (z.tot && !z.xau) return { muc: 'cat', nhan: T[z.tot] };
  if (z.xau && !z.tot) return { muc: 'hung', nhan: X[z.xau] };
  var m = Math.max(z.tot, z.xau);
  return { muc: 'binh', nhan: m <= 1 ? 'tốt xấu đan xen, mức không lớn' : m === 2 ? 'tốt xấu đan xen, biên độ khá lớn' : 'tốt xấu đan xen, biên độ rất lớn' };
}
/** Dòng Thể – Dụng → mục luận */
function ptDongMuc_(d, tang, tenThe, tenDung) {
  var X = d.X, lv = ptLv_(X), H = d.H, sao = d.sao4 ? ' ' + new Array(d.sao4 + 1).join('*') : '';
  var t = d.huong === 'Mệnh' ? tenDung + '.' + X + ' phi ' + H + ' (' + d.sao + ') ' + (d.loai === 'kyXungMenh' ? 'xung' : 'nhập') + ' Mệnh ' + tenThe :
    d.huong === 'Dụng→Thể' ? tenDung + '.' + X + ' phi ' + H + ' (' + d.sao + ') ' + (d.loai === 'nhap' ? 'nhập (quy vị)' : d.loai === 'xung' ? 'xung' : 'chiếu') + ' ' + tenThe + '.' + X + ' – ' + H + ' Dụng ' + (d.loai === 'nhap' ? 'nhập' : d.loai === 'xung' ? 'xung' : 'chiếu') + ' Thể' + sao :
    tenThe + '.' + X + ' phi ' + H + ' (' + d.sao + ') ' + (d.loai === 'nhap' ? 'nhập' : d.loai === 'xung' ? 'xung' : 'chiếu') + ' ' + tenDung + '.' + X + ' – ' + H + ' Thể ' + (d.loai === 'nhap' ? 'nhập' : d.loai === 'xung' ? 'xung' : 'chiếu') + ' Dụng' + sao;
  var khoa;
  if (tang === 'dv') {
    if (d.huong === 'Mệnh') khoa = ['dv|' + d.loai + '|' + X, 'dv|' + d.loai + '|*'];
    else if (d.huong === 'Dụng→Thể') khoa = d.loai === 'nhap' ? ['dv|quyVi|' + H + '|*'] : d.loai === 'xung' ? ['dv|kyXungNc|' + X, 'dv|kyXungNc|*'] : ['dv|chieu|' + H + '|' + X, 'dv|chieu|' + H + '|*'];
    else khoa = d.loai === 'xung' ? ['dv|ncXungDv|*'] : d.loai === 'nhap' && (H === 'Lộc' || H === 'Kỵ') ? ['dv|ncNhapDv|' + H + '|*'] : ['dv|chieu|' + H + '|*'];
  } else khoa = ['ln|' + d.huong + '|' + d.loai + '|' + H + '|' + X, 'ln|' + d.huong + '|' + d.loai + '|' + H + '|*'];
  var m = ptMucK_(t, khoa, lv, null, 1);
  return m;
}
/** Tổng luận 12 chủ đề từ bảng điểm */
function ptTongLuan_(diem, tang) {
  var ra = [];
  PT_CUNG.forEach(function (X) {
    var x = ptXep_(diem[X]); if (!x) return;
    var khoa = tang === 'dv' ? 'dv|tongLuan|' + X + '|' + x.muc : 'thang|ketLuan|' + X + '|' + x.muc;
    var m = ptMucK_('Chủ đề ' + X + ': ' + x.nhan + ' (' + diem[X].ds.join('; ') + ')', [khoa], ptLv_(X), null, 1);
    if (m) {
      m.muc = x.muc;
      if (tang === 'nam') { m.de = m.de.map(function (s) { return s.replace(/tháng này/g, 'năm nay').replace(/trong tháng/g, 'trong năm').replace(/một tháng/g, 'một năm').replace(/tháng/g, 'năm'); }); m.t = m.t.replace('Kết luận tháng', 'Kết luận năm'); }
      m.cung = X; m.nhan = x.nhan; ra.push(m);
    }
  });
  return ra;
}
function ptSnO_(N) { var o = {}; N.sn.forEach(function (f) { if (f.toi != null) (o[f.toi] = o[f.toi] || []).push(PT_H[f.h]); }); return o; }

/* ---------- Một đại vận ---------- */
function ptDaiVanBai_(N, tv, d, ck) {
  var P = N.P, ten = N.ten, can = P[d].can, hoa = ptHoa_(tv, can), snO = ptSnO_(N), muc = [];
  var ngaNC = function (o) { return !!PT_NGA[ten[o]]; }, tenDV = function (o) { return ptTenTu_(d, o); };
  // 1. Thông tin chung: ĐV Mệnh phi Tứ Hóa nhập cung nguyên cục
  var a = [];
  hoa.forEach(function (f) {
    if (f.toi == null) return; var H = PT_H[f.h], Y = ten[f.toi];
    var t = 'ĐV Mệnh (can ' + CAN[can] + ') phi Hóa ' + H + ' (' + f.sao + ') nhập ' + Y + ' nguyên cục – là ĐV.' + tenDV(f.toi);
    var m = ptMucK_(t, ['dv|nhap|' + H + '|' + Y, 'dv|nhap|' + H + '|*'], ptLv_(Y), null, 1);
    if (m && (H === 'Quyền' || H === 'Khoa') && !ngaNC(f.toi)) m.cc.push(H + ' vào tha cung (' + Y + ') – ' + H + ' xuất, cộng hưởng yếu.');
    ptDay_(a, m);
  });
  if (ck && ck.cung[d]) a.unshift(ck.cung[d]);
  // 2. Tứ hóa nhập xuất: hồi quy, phản cung
  var b = [], L = hoa[0].toi, K = hoa[3].toi, tamHop = N.tamHop, daHQ = {};
  ['Mệnh', 'Tài Bạch', 'Quan Lộc'].forEach(function (X) {
    var u = ptO_(d, X), lc = ptHoa_(tv, P[u].can)[0];
    if (lc.toi != null && tamHop.indexOf(lc.toi) >= 0 && lc.toi !== N.o[X]) {
      var dich = ten[lc.toi]; if (daHQ[dich]) return; daHQ[dich] = 1;
      ptDay_(b, ptMucK_('Hồi quy: Lộc của ĐV.' + X + ' (' + lc.sao + ') về ' + dich + ' nguyên cục', ['dv|hoiQuy|' + dich], ptLv_(dich)));
    }
  });
  if (tamHop.indexOf(d) >= 0) {
    if (L != null && tamHop.indexOf(L) >= 0) ptDay_(b, ptMucK_('Phản cung Lộc: tam hợp vận trùng tam hợp gốc, Lộc vận vào ' + ten[L], ['dv|phanCung|Lộc'], ptLv_(ten[L])));
    if (K != null && tamHop.indexOf(K) >= 0) ptDay_(b, ptMucK_('Phản cung Kỵ: tam hợp vận trùng tam hợp gốc, Kỵ vận vào ' + ten[K], ['dv|phanCung|Kỵ'], ptLv_(ten[K])));
  }
  // 3. Phi hóa tha – ngã cung (cặp Lộc – Kỵ của ĐV Mệnh, đọc theo bàn nguyên cục)
  var c = [];
  if (L != null && K != null) {
    var lN = ngaNC(L), kN = ngaNC(K), kXN = ngaNC(ptD_(K)), mau = null;
    if (L === K && lN) mau = 'LocTheoKyVeNga'; else if (!lN && kN) mau = 'LocTha_KyNga'; else if (lN && kXN) mau = 'LocNga_KyXungNga';
    else if (!lN && kXN) mau = 'LocTha_KyXungNga'; else if (!lN && !kN) mau = 'PhiThaTieuHao';
    if (mau) ptDay_(c, ptMucK_('Lộc vận vào ' + ten[L] + ' (' + (lN ? 'ngã' : 'tha') + ' cung), Kỵ vận vào ' + ten[K] + ' (' + (kN ? 'ngã' : 'tha') + ' cung, xung ' + ten[ptD_(K)] + ')', ['dv|thaNga|' + mau], ''));
    var LT = ten[L], KT = ten[K], cap = LT === 'Tài Bạch' && KT === 'Nô Bộc' ? 'Lộc_TaiBach|Kỵ_NoBoc' : LT === 'Mệnh' && KT === 'Phu Thê' ? 'Lộc_Mệnh|Kỵ_PhuThe' : !lN && KT === 'Phu Thê' ? 'Lộc_Tha|Kỵ_PhuThe' : null;
    if (cap) ptDay_(c, ptMucK_('Cặp Lộc – Kỵ của cung vận: Lộc ' + LT + ', Kỵ ' + KT, ['dv|cap|' + cap], ''));
  }
  // 4. Trùng điệp năm sinh – đại vận
  var e = [];
  hoa.forEach(function (f) {
    N.sn.forEach(function (s) {
      if (s.sao !== f.sao || f.toi == null) return;
      ptDay_(e, ptMucK_('Hóa ' + PT_H[s.h] + ' năm sinh (' + s.sao + ', ở ' + ten[f.toi] + ') trùng Hóa ' + PT_H[f.h] + ' đại vận', ['dv|trung|' + PT_H[s.h] + '|' + PT_H[f.h]], ptLv_(ten[f.toi])));
    });
  });
  // 5. Thể – Dụng, M chất
  var TD = ptTheDung_(N, tv, N.o['Mệnh'], d, 'dv', snO);
  var g = [];
  PT_CUNG.forEach(function (X) {
    var u = ptO_(d, X); if (!snO[u]) return;
    snO[u].forEach(function (H) { ptDay_(g, ptMucK_('Đại vận ' + X + ' có M chất (chồng lên ' + ten[u] + ' gốc có Hóa ' + H + ' năm sinh)', ['dv|mchat|' + H], ptLv_(X))); });
    if (snO[N.o[X]]) ptDay_(g, ptMucK_('Bản mệnh ' + X + ' và đại vận ' + X + ' cùng có M chất', ['dv|mchatTrung|2tang'], ptLv_(X)));
  });
  var h = TD.dong.slice().sort(function (x, y) { return y.sao4 - x.sao4; }).map(function (x) { return ptDongMuc_(x, 'dv', 'thiên bàn', 'ĐV'); }).filter(Boolean);
  // 6. Kinh nghiệm Bắc phái: phi phục tam điểm
  var k = [];
  for (var i = 0; i < 12; i++) [0, 3].forEach(function (hh) {
    var f = N.phi[i][hh]; if (f.toi == null || f.toi === i) return;
    if (f.toi === d) ptDay_(k, ptMucK_(ten[i] + ' nguyên cục phi ' + PT_H[hh] + ' (' + f.sao + ') vào ' + ten[d] + ' – cung đại vận đang tới', ['dv|phiPhuc|' + PT_H[hh]], ptLv_(ten[i])));
  });
  if (ck && ck.tuyen) ck.tuyen(d).forEach(function (m) { ptDay_(k, m); });
  var tong = ptTongLuan_(TD.diem, 'dv');
  var phan = [];
  if (a.length) phan.push({ ten: '1. Thông tin chung – Mệnh vận phi Tứ Hóa', muc: a });
  if (b.length) phan.push({ ten: '2. Tứ Hóa nhập xuất – hồi quy, phản cung', muc: b });
  if (c.length) phan.push({ ten: '3. Phi hóa tha – ngã cung', muc: c });
  if (e.length) phan.push({ ten: 'Trùng điệp Tứ Hóa năm sinh – đại vận', muc: e });
  if (g.length) phan.push({ ten: 'M chất bản mệnh và đại vận', muc: g });
  if (h.length) phan.push({ ten: 'Thể – Dụng: Lộc, Quyền, Khoa nhập/chiếu; Kỵ nhập/xung; quy vị', muc: h });
  if (k.length) phan.push({ ten: 'Kinh nghiệm Bắc phái', muc: k });
  return { o: d, trung: TD.trung, menh: ten[d], can: CAN[can], chi: CHI[d], hoa: hoa.map(function (f) { return { h: PT_H[f.h], sao: f.sao, cung: f.toi == null ? null : ten[f.toi] }; }), phan: phan, tong: tong };
}

/* ---------- Vận năm (Thể = đại vận, Dụng = lưu niên) ---------- */
function ptNamBai_(N, tv, y, dvO) {
  var P = N.P, ten = N.ten, m = ((y + 8) % 12 + 12) % 12, can = ((y + 6) % 10 + 10) % 10, hoa = ptHoa_(tv, can), snO = ptSnO_(N), phan = [];
  var dvHoa = dvO != null ? ptHoa_(tv, P[dvO].can) : [];
  var a = [];
  hoa.forEach(function (f) {
    if (f.toi == null) return; var H = PT_H[f.h], tDV = dvO != null ? ptTenTu_(dvO, f.toi) : null, tLN = ptTenTu_(m, f.toi);
    var t = 'Hóa ' + H + ' năm ' + y + ' (can ' + CAN[can] + ', ' + f.sao + ') nhập ' + (tDV ? 'ĐV.' + tDV + ' (' : '') + 'LN.' + tLN + (tDV ? ')' : '') + ', nguyên cục ' + ten[f.toi];
    var mm = H === 'Lộc' || H === 'Kỵ' ? ptMucK_(t, ['nam|nhap|' + H + '|*'], ptLv_(tDV || tLN), null, 1) : ptMucTu_(t, '', '', ptLv_(tDV || tLN), 'trung', true);
    if (mm) {
      var thang = ptTamDiem_(f.toi).map(ptThangCuaChi_);
      if (H === 'Lộc' || H === 'Kỵ') mm.cc.push('Ứng kỳ theo tam điểm (' + ptTamDiem_(f.toi).map(function (o) { return CHI[o]; }).join(', ') + '): tháng âm ' + thang.join(', ') + '.');
      ptDay_(a, mm);
    }
  });
  // Lộc gặp Kỵ / Song Kỵ / Hư lộc của năm
  var b = [], kyO = {}; N.sn.concat(dvHoa).forEach(function (f) { if (f.h === 3 && f.toi != null) kyO[f.toi] = 1; });
  var L = hoa[0].toi, K = hoa[3].toi, thM = [m, (m + 4) % 12, (m + 8) % 12];
  if (L != null && kyO[L]) ptDay_(b, ptMucK_('Lộc năm rơi vào ' + ten[L] + ' – nơi đã có Kỵ (năm sinh/đại vận)', ['mau|Lộc gặp Kỵ'], ptLv_(ptTenTu_(m, L))));
  if (K != null && kyO[K]) ptDay_(b, ptMucK_('Kỵ năm chồng lên Kỵ tầng khác ở ' + ten[K], ['mau|Song Kỵ'], ptLv_(ptTenTu_(m, K))));
  if (L != null && thM.indexOf(L) < 0 && !PT_NGA[ptTenTu_(m, L)]) ptDay_(b, ptMucK_('Lộc năm bay ra tha cung (LN.' + ptTenTu_(m, L) + '), không vào tam hợp Mệnh năm', ['mau|Hư lộc'], ''));
  // M chất ba tầng
  PT_CUNG.forEach(function (X) {
    var uN = N.o[X], uD = dvO != null ? ptO_(dvO, X) : null, uL = ptO_(m, X);
    if (snO[uN] && uD != null && snO[uD] && hoa.some(function (f) { return f.toi === uL; })) ptDay_(b, ptMucK_('Bản mệnh, đại vận và lưu niên ' + X + ' đều có M chất', ['dv|mchatTrung|3tang'], ptLv_(X)));
  });
  if (dvO == null) return { nam: y, can: CAN[can], chi: CHI[m], menh: ten[m], o: m, phan: [].concat(a.length ? [{ ten: 'Thông tin lưu niên', muc: a }] : [], b.length ? [{ ten: 'Mẫu Lộc – Kỵ trong năm', muc: b }] : []), tong: [], chuaVaoVan: true };
  var TD = ptTheDung_(N, tv, dvO, m, 'nam', null);
  var h = TD.dong.slice().sort(function (x, z) { return z.sao4 - x.sao4; }).map(function (x) { return ptDongMuc_(x, 'nam', 'ĐV', 'LN'); }).filter(Boolean);
  if (a.length) phan.push({ ten: 'Thông tin lưu niên – Tứ Hóa năm vào cung nào của đại vận', muc: a });
  if (b.length) phan.push({ ten: 'Mẫu Lộc – Kỵ trong năm, M chất ba tầng', muc: b });
  if (h.length) phan.push({ ten: 'Thể – Dụng giữa lưu niên và đại vận', muc: h });
  return { nam: y, trung: TD.trung, can: CAN[can], chi: CHI[m], menh: ten[m], o: m, dvMenh: ten[dvO], phan: phan, tong: ptTongLuan_(TD.diem, 'nam') };
}

/* ---------- Vận tháng (Thể = lưu niên, Dụng = nguyệt vận) ---------- */
function ptThangBai_(N, tv, y, k, mNam, nv, canThang) {
  var ten = N.ten, P = N.P, hoa = ptHoa_(tv, canThang), phan = [], canNam = ((y + 6) % 10 + 10) % 10, hoaNam = ptHoa_(tv, canNam);
  var tenLN = function (o) { return ptTenTu_(mNam, o); }, ngaLN = function (o) { return !!PT_NGA[tenLN(o)]; }, thLN = [mNam, (mNam + 4) % 12, (mNam + 8) % 12];
  var a = [];
  hoa.forEach(function (f) {
    if (f.toi == null) return; var H = PT_H[f.h], Y = tenLN(f.toi);
    var t = 'Hóa ' + H + ' tháng ' + k + ' (can ' + CAN[canThang] + ', ' + f.sao + ') nhập LN.' + Y + ' (NV.' + ptTenTu_(nv, f.toi) + ')';
    var xuat = !ngaLN(f.toi) && thLN.indexOf(f.toi) < 0;
    var m = xuat ? ptMucK_(t + ' – ' + H + ' xuất', ['thang|xuat|' + (H === 'Khoa' ? 'Quyền' : H)], ptLv_(Y), null, 1) : ptMucTu_(t, '', '', ptLv_(Y), 'trung', true);
    ptDay_(a, m);
  });
  var b = [], kyO = {};
  N.sn.concat(hoaNam).forEach(function (f) { if (f.h === 3 && f.toi != null) kyO[f.toi] = 1; });
  var L = hoa[0].toi, K = hoa[3].toi;
  if (L != null && kyO[L]) ptDay_(b, ptMucK_('Lộc tháng gặp Kỵ (năm sinh/năm) ở LN.' + tenLN(L), ['mau|Lộc gặp Kỵ'], ptLv_(tenLN(L))));
  if (K != null && kyO[K]) ptDay_(b, ptMucK_('Kỵ tháng chồng Kỵ tầng khác ở LN.' + tenLN(K), ['mau|Song Kỵ'], ptLv_(tenLN(K))));
  if (hoaNam[2].toi != null && hoaNam[2].toi === K) ptDay_(b, ptMucK_('Khoa năm gặp Kỵ tháng ở LN.' + tenLN(K), ['thang|tangTac|KhoaKy'], ptLv_(tenLN(K))));
  if (L != null && K != null && ngaLN(L) && ngaLN(K)) ptDay_(b, ptMucK_('Lộc và Kỵ tháng cùng vào ngã cung của năm (' + tenLN(L) + ', ' + tenLN(K) + ')', ['thang|tangTac|LocKyNgaGiup'], ''));
  if (L != null && K != null && !ngaLN(L) && !ngaLN(K) && ngaLN(ptD_(K)) && ngaLN(ptD_(L))) ptDay_(b, ptMucK_('Lộc và Kỵ tháng cùng từ tha cung xung ngã cung', ['thang|tangTac|PhiLocKyXungNga'], ''));
  if (L != null && thLN.indexOf(L) < 0 && !ngaLN(L)) ptDay_(b, ptMucK_('Lộc tháng là hư lộc (bay ra LN.' + tenLN(L) + ')', ['mau|Hư lộc'], ''));
  var TD = ptTheDung_(N, tv, mNam, nv, 'thang', null);
  var h = TD.dong.slice().sort(function (x, z) { return z.sao4 - x.sao4; }).map(function (x) { return ptDongMuc_(x, 'thang', 'LN', 'NV'); }).filter(Boolean);
  if (a.length) phan.push({ ten: '1–2. Thông tin chung, Tứ Hóa nhập xuất', muc: a });
  if (b.length) phan.push({ ten: '3–4. Tha – ngã cung, tương tác các tầng', muc: b });
  if (h.length) phan.push({ ten: 'Các dòng Thể – Dụng (* nhẹ → **** nặng)', muc: h });
  return { thang: k, trung: TD.trung, o: nv, menh: ten[nv], chi: CHI[nv], can: CAN[canThang], phan: phan, tong: ptTongLuan_(TD.diem, 'thang') };
}

/** Ghép cả bài theo mục lục. vy = năm xem */
function ptBai_(tv, vy) {
  var N = ptNguyenCuc_(tv), I = tv.info, P = tv.palaces, ten = N.ten, van = PT_VAN || {};
  var ck = typeof ptCungKhi_ === 'function' ? ptCungKhi_(N, tv) : null;
  var mauNC = ptMauNC_(N, tv);
  // Tổng quan
  var tq = [];
  if (ck && ck.tong) tq.push({ ten: 'Điểm xí hoa và hỉ – kỵ thần', muc: ck.tong });
  if (N.ln >= 0) {
    var X = ten[N.ln], v = (van.laiNhan || {})[X] || {};
    var lm = ptMucK_('Lai Nhân cung: ' + X + ' (' + CAN[P[N.ln].can] + ' ' + CHI[N.ln] + ')', ['laiNhan|' + X], ptLv_(X)) || ptMucTu_('Lai Nhân cung: ' + X + ' (' + CAN[P[N.ln].can] + ' ' + CHI[N.ln] + ')', v.ky, v.de, ptLv_(X), 'cat');
    if (lm) tq.push({ ten: 'Lai Nhân cung', muc: [lm] });
  }
  var dsMau = mauNC.filter(function (m) { return !m.an; }).map(function (m) { return { ten: m.khoa, cung: m.cung }; });
  var phan = [{ id: 'tq', ten: 'Tổng quan', phan: tq, mau: dsMau, gioiThieu: van.gioiThieu || {} }];
  PT_THU_TU_BAI.forEach(function (X, n) {
    phan.push(ptCungBai_(N, tv, X, mauNC, ck));
    if (n === 0) {                                                                     // Cung Thân ngay sau Mệnh
      var t = I.than, Xt = ten[t], th = [];
      ptDay_(th, ptMucK_('Thân cư ' + Xt, ['than|' + Xt], ptLv_(Xt)));
      ptSaoO_(tv, t).forEach(function (s) { ptDay_(th, ptMucK_(s + ' tại cung Thân', ['sao|' + s + '|Thân'], '')); });
      if (N.sn[3].toi === t) ptDay_(th, ptMucK_('Hóa Kỵ năm sinh tại cung Thân', ['sao|Hóa Kỵ|Thân'], ''));
      phan.push({ id: 'c-Thân', ten: 'Cung Thân', phu: 'cư ' + Xt + ' · ' + CHI[t], phan: th.length ? [{ ten: 'Thân cư cung nào, sao tại Thân', muc: th }] : [] });
    }
  });
  // Đại vận
  var dv = [];
  for (var i = 0; i < 12; i++) if (P[i].daiHan != null) {
    var b = ptDaiVanBai_(N, tv, i, ck);
    b.tuoi = P[i].daiHan; b.den = P[i].daiHan + 9; b.nay = I.tuoi >= b.tuoi && I.tuoi <= b.den;
    dv.push(b);
  }
  dv.sort(function (x, y) { return x.tuoi - y.tuoi; });
  // Vận năm + 12 tháng của năm xem
  var tuoi = vy - I.lunar.year + 1, dvO = null;
  for (var k = 0; k < 12; k++) if (P[k].daiHan != null && tuoi >= P[k].daiHan && tuoi <= P[k].daiHan + 9) dvO = k;
  var nam = ptNamBai_(N, tv, vy, dvO); nam.tuoi = tuoi;
  var thang = [];
  if (typeof ptMenhThang_ === 'function') {
    var mNam = ((vy + 8) % 12 + 12) % 12;
    for (var t2 = 1; t2 <= 12; t2++) { var q = ptMenhThang_(tv, vy, t2); if (q) thang.push(ptThangBai_(N, tv, vy, t2, mNam, q.o, q.can)); }
  }
  // Phụ lục: chính tinh và cách cục tại Mệnh
  var pl = [], mO = N.o['Mệnh'];
  (P[mO].chinh || []).forEach(function (s) { ptDay_(pl, ptMucK_(s.n + ' tại Mệnh', ['sao|' + s.n + '|Mệnh'], 'chính mình')); });
  if (!(P[mO].chinh || []).length) ptDay_(pl, ptMucK_('Mệnh vô chính diệu', ['sao|Vô chính diệu|Mệnh'], 'chính mình'));
  ptCach_(N, tv).forEach(function (c) { ptDay_(pl, ptMucK_('Cách ' + c, ['cach|' + c], 'chính mình')); });
  var thangGhiChu = thang.length ? 'Mệnh tháng an theo Đẩu quân (tháng Giêng ở ' + CHI[ptMenhThang_(tv, vy, 1).o] + ', các tháng sau đi thuận); Tứ Hóa tháng lấy can của cung nơi Mệnh tháng đóng.' : '';
  return { phan: phan, daiVan: dv, nam: nam, thang: thang, thangGhiChu: thangGhiChu, phuLuc: pl, namXem: vy };
}
