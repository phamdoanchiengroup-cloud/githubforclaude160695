
/* ---------------------------------------------------------------- Bộ tính ---------------------------------------------------------------- */
var PT_CUNG = ['Mệnh', 'Huynh Đệ', 'Phu Thê', 'Tử Tức', 'Tài Bạch', 'Tật Ách', 'Thiên Di', 'Nô Bộc', 'Quan Lộc', 'Điền Trạch', 'Phúc Đức', 'Phụ Mẫu'];
var PT_NGA = { 'Mệnh': 1, 'Tài Bạch': 1, 'Tật Ách': 1, 'Quan Lộc': 1, 'Điền Trạch': 1, 'Phúc Đức': 1 };          // ngã cung (lục nội)
var PT_LUC_THAN = { 'Mệnh': 1, 'Huynh Đệ': 1, 'Phu Thê': 1, 'Tử Tức': 1, 'Nô Bộc': 1, 'Phụ Mẫu': 1 };
var PT_THU_TU = ['Mệnh', 'Quan Lộc', 'Tài Bạch', 'Thiên Di', 'Phúc Đức', 'Phu Thê', 'Tử Tức', 'Điền Trạch', 'Tật Ách', 'Phụ Mẫu', 'Huynh Đệ', 'Nô Bộc'];   // thứ tự luận của bài Bắc phái
var PT_H = ['Lộc', 'Quyền', 'Khoa', 'Kỵ'];
function ptD_(i) { return (i + 6) % 12; }
function ptLv_(cung) { return typeof tpLv_ === 'function' ? tpLv_(cung) : cung.toLowerCase(); }
function ptThay_(s, o) { return String(s || '').replace(/\{(\w+)\}/g, function (m, k) { return o[k] != null ? o[k] : m; }); }
/** Cung chức thứ k (0 = Mệnh) tính từ cung gốc g – đi nghịch địa chi */
function ptCungTu_(g, k) { return ((g - k) % 12 + 12) % 12; }
/** Tên cung chức của ô x khi coi ô g là Mệnh (chuyển cung / lập thái cực) */
function ptTenTu_(g, x) { return PT_CUNG[((g - x) % 12 + 12) % 12]; }

/** Tứ Hóa của một can: [{h, sao, toi}] – toi là ô địa chi chứa sao (null nếu sao không có trên lá số) */
function ptHoa_(tv, can) { return PT_TU_HOA[can].map(function (s, h) { var p = tv.pos[s]; return { h: h, sao: s, toi: p == null ? null : p }; }); }

/** Dựng toàn bộ dữ liệu Phi Tinh của nguyên cục */
function ptNguyenCuc_(tv) {
  var P = tv.palaces, I = tv.info, ten = P.map(function (p) { return p.cung; }), o = {};
  ten.forEach(function (c, i) { o[c] = i; });
  var phi = P.map(function (p) { return ptHoa_(tv, p.can); }), sn = ptHoa_(tv, I.yCan);
  var ln = -1; for (var i = 2; i < 12; i++) if (P[i].can === I.yCan) { ln = i; break; }   // Lai Nhân: bỏ Tý, Sửu
  var tuHoa = [];
  phi.forEach(function (ds, i) { ds.forEach(function (f) { if (f.toi === i) tuHoa.push({ o: i, h: f.h, sao: f.sao, loai: 'lyTam' }); else if (f.toi === ptD_(i)) tuHoa.push({ o: i, h: f.h, sao: f.sao, loai: 'huongTam' }); }); });
  function coLyTam(i) { return tuHoa.some(function (t) { return t.o === i && t.loai === 'lyTam'; }); }
  /** Kỵ chuyển Kỵ từ ô đầu: dừng khi lặp, khi tự hóa Kỵ (Kỵ xuất) hoặc sau 6 bước */
  function chuyenKy(dau) {
    var ds = [dau], cur = dau, kx = false;
    for (var n = 0; n < 6; n++) {
      var t = phi[cur][3].toi; if (t == null) break;
      if (t === cur) { kx = true; break; }
      if (ds.indexOf(t) >= 0) { ds.push(t); break; }
      ds.push(t); cur = t;
    }
    return { o: ds, kyXuat: kx };
  }
  return { P: P, I: I, ten: ten, o: o, phi: phi, sn: sn, ln: ln, tuHoa: tuHoa, coLyTam: coLyTam, chuyenKy: chuyenKy,
    tamHop: [o['Mệnh'], o['Tài Bạch'], o['Quan Lộc']] };
}

/** Các mẫu Kỵ có tên ở nguyên cục */
function ptMau_(N) {
  var ra = [], ten = N.ten, phi = N.phi, snKy = N.sn[3].toi, snLoc = N.sn[0].toi;
  function them(k, A, B, them2) { var x = { k: k, A: A != null ? ten[A] : null, B: B != null ? ten[B] : null }; if (them2) x.ky = them2; ra.push(x); }
  for (var i = 0; i < 12; i++) {
    var ky = phi[i][3].toi; if (ky == null) continue;
    if (ky === ptD_(i)) {
      them('luuXuat', i, ky);
      if (N.tamHop.indexOf(i) >= 0 && snKy === ky) them(N.coLyTam(ky) ? 'thuyTiet' : 'nghichThuy', i, ky);
    }
    for (var j = i + 1; j < 12; j++) if (ky === j && phi[j][3].toi === i && PT_LUC_THAN[ten[i]] && PT_LUC_THAN[ten[j]]) them('tuanHoan', i, j);
    for (var j2 = 0; j2 < 12; j2++) if (j2 !== i && j2 !== ptD_(i) && phi[i][0].toi === j2 && phi[j2][3].toi === i) them('thiPhi', i, j2);
  }
  if (snKy != null && [1, 4, 7, 10].indexOf(snKy) >= 0) them(N.coLyTam(snKy) ? 'tietKho' : 'nhapKho', snKy, null);
  if (snKy != null && [2, 5, 8, 11].indexOf(snKy) >= 0) them('sachMa', snKy, null);
  // Củ triền Kỵ: hai Kỵ từ hai cung khác nhau rơi vào hai đầu một trục có Mệnh/Tài/Quan/Điền
  var daXet = {};
  for (var a = 0; a < 12; a++) for (var b = 0; b < 12; b++) {
    var ka = phi[a][3].toi, kb = phi[b][3].toi;
    if (a === b || ka == null || kb == null || ka === a || kb === b || kb !== ptD_(ka)) continue;
    var truc = Math.min(ka, kb) + '-' + Math.max(ka, kb); if (daXet[truc]) continue;
    var cT = [ten[ka], ten[kb]];
    if (!['Mệnh', 'Tài Bạch', 'Quan Lộc', 'Điền Trạch'].some(function (c) { return cT.indexOf(c) >= 0; })) continue;
    daXet[truc] = 1;
    them(cT.indexOf('Phu Thê') >= 0 && cT.indexOf('Quan Lộc') >= 0 ? 'oanThan' : 'cuTrien', ka, kb, ten[a] + ' phi Kỵ nhập ' + ten[ka] + ', ' + ten[b] + ' phi Kỵ nhập ' + ten[kb]);
  }
  // Lộc theo Kỵ đi: Lộc năm sinh rơi vào B, B phi Kỵ sang C
  if (snLoc != null && phi[snLoc][3].toi != null && phi[snLoc][3].toi !== snLoc) {
    var C = phi[snLoc][3].toi, ngaB = !!PT_NGA[ten[snLoc]], ngaC = !!PT_NGA[ten[C]];
    if (ngaB && !ngaC) them('locVaoNgaKyRaTha', snLoc, C); else if (!ngaB && ngaC) them('locVaoThaKyVeNga', snLoc, C);
  }
  // Song Kỵ nguyên cục: Kỵ năm sinh và Mệnh phi Kỵ cùng trục
  var mk = phi[N.o['Mệnh']][3].toi;
  if (snKy != null && mk != null && (mk === snKy || mk === ptD_(snKy))) them('songKy', snKy, mk);
  return ra;
}

/** Luận một cung: hóa năm sinh tại cung, tự hóa, bốn phi hóa (kèm tên chuyển cung), cung khác phi vào, chuỗi chuyển Kỵ */
function ptCung_(N, i) {
  var ten = N.ten, X = ten[i], ky = [], de = [], van = PT_VAN || {};
  N.sn.forEach(function (f) {
    if (f.toi !== i) return;
    var v = ((van.snToa || {})[PT_H[f.h]] || {})[X] || {};
    ky.push('Hóa ' + PT_H[f.h] + ' năm sinh (' + f.sao + ') ngồi tại ' + X + '. ' + (v.ky || ''));
    if (v.de) de.push(v.de);
  });
  N.tuHoa.filter(function (t) { return t.o === i; }).forEach(function (t) {
    var v = (((van.tuHoa || {})[t.loai] || {})[PT_H[t.h]]) || {};
    ky.push(X + ' tự hóa ' + PT_H[t.h] + (t.loai === 'lyTam' ? ' ly tâm' : ' hướng tâm') + ' (' + t.sao + (t.loai === 'huongTam' ? ' ở cung đối ' + ten[ptD_(i)] : '') + '). ' + ptThay_(v.ky, { lv: ptLv_(X) }));
    if (v.de) de.push(ptThay_(v.de, { lv: ptLv_(X) }));
  });
  N.phi[i].forEach(function (f) {
    if (f.toi == null || f.toi === i || f.toi === ptD_(i)) return;   // tự hóa đã nói ở trên
    var Y = ten[f.toi], rieng = (PT_LUAN[X] || {})[PT_H[f.h] + '|' + Y], v = ((van.phi || {})[PT_H[f.h]]) || {};
    var chuyen = ptTenTu_(i, f.toi);
    ky.push(X + ' (can ' + CAN[N.P[i].can] + ') phi Hóa ' + PT_H[f.h] + ' (' + f.sao + ') nhập ' + Y + (X !== 'Mệnh' ? ' (' + Y + ' là cung ' + chuyen + ' tính từ ' + X + ')' : '') + '. ' + (rieng ? rieng.luan : ptThay_(v.ky, { A: X, B: Y })));
    if (f.h === 0 || f.h === 3) { var d = rieng ? rieng.de : ptThay_(v.de, { A: ptLv_(X), B: ptLv_(Y) }); if (d) de.push(d); }
  });
  var vao = [];
  for (var j = 0; j < 12; j++) if (j !== i) N.phi[j].forEach(function (f) { if (f.toi === i && (f.h === 0 || f.h === 3)) vao.push(ten[j] + ' phi ' + PT_H[f.h]); });
  if (vao.length) ky.push('Cung khác phi vào ' + X + ': ' + vao.join('; ') + '.');
  var ck = N.chuyenKy(i);
  if (ck.o.length > 2) ky.push('Chuỗi chuyển Kỵ: ' + ck.o.map(function (x) { return ten[x]; }).join(' → ') + (ck.kyXuat ? ' (dừng ở tự hóa Kỵ – Kỵ xuất)' : '') + '.');
  var gop = {}; de = de.filter(function (x) { if (gop[x]) return false; gop[x] = 1; return true; });
  return { cung: X, chi: CHI[i], can: CAN[N.P[i].can], ky: ky, de: de };
}

/** Một tầng vận (đại vận hoặc lưu niên): Tứ Hóa của tầng đọc chồng lên nguyên cục */
function ptTang_(N, tv, menhTang, canTang, dvMenh, laDaiVan) {
  var hoa = ptHoa_(tv, canTang), ten = N.ten, snKy = N.sn[3].toi, snLoc = N.sn[0].toi, snQuyen = N.sn[1].toi, van = PT_VAN || {}, nhan = laDaiVan ? 'vận' : 'năm';
  function vv(x) { return laDaiVan || !x ? x : x.replace(/của vận/g, 'của năm').replace(/Của vận/g, 'Của năm'); }   // văn đại vận dùng lại cho lưu niên
  var ky = [], de = [], diem = 0, co = {};
  hoa.forEach(function (f) {
    if (f.toi == null) return;
    var nc = ten[f.toi], tang = ptTenTu_(menhTang, f.toi), dvTen = dvMenh != null ? ptTenTu_(dvMenh, f.toi) : null;
    ky.push('Hóa ' + PT_H[f.h] + ' (' + f.sao + ') nhập ' + nc + ' nguyên cục' + (tang !== nc ? ' – là ' + tang + ' của ' + nhan : '') + (dvTen ? ' – ' + dvTen + ' của đại vận' : '') + '.');
    if (f.h === 0) {
      var v = (van.dvLoc || {})[nc] || {}; if (v.ky) ky.push(vv(v.ky)); if (v.de) de.push(v.de);
      diem += N.tamHop.indexOf(f.toi) >= 0 ? 1 : 0.5;
      if (snKy === f.toi) { ky.push('Lộc của ' + nhan + ' rơi đúng chỗ có Kỵ năm sinh (' + nc + ') – làm dịu Kỵ.'); diem += 0.5; }
    }
    if ((f.h === 0 || f.h === 1) && (f.toi === snLoc || f.toi === snQuyen)) { co.trungDiepCat = { A: nc }; diem += 0.5; }   // tốt chồng tốt
    if (f.h === 3) {
      var x = ptD_(f.toi), vk = (van.dvKy || {})[nc] || {}, vx = (van.dvKyXung || {})[ten[x]] || {};
      ky.push('Hóa Kỵ của ' + nhan + ' xung ' + ten[x] + ' nguyên cục.'); if (vk.ky) ky.push(vv(vk.ky)); if (vx.ky) ky.push(vv(vx.ky));
      if (vk.de) de.push(vk.de); if (vx.de) de.push(vx.de);
      if (N.tamHop.indexOf(f.toi) >= 0) co.kyNhapTamHop = { A: nc };
      var phan = laDaiVan && N.tamHop.indexOf(menhTang) >= 0 && ['Phu Thê', 'Thiên Di', 'Phúc Đức'].indexOf(nc) >= 0;
      if (N.tamHop.indexOf(x) >= 0) { co.kyXungTamHop = { A: ten[x] }; if (!phan) diem -= 1; }   // phản cung đã tính sức nặng – không trừ hai lần
      if (snKy != null && (f.toi === snKy || f.toi === ptD_(snKy))) { co.songKy = { A: nc }; diem -= 1; }
      if (snLoc === f.toi) { co.trungDiepKy = { A: nc }; diem -= 0.5; }
      if (phan) { co.phanCung = { A: nc, B: ten[x] }; diem -= 1.5; }
    }
  });
  var mau = Object.keys(co).map(function (k) { var m = (van.mau || {})[k] || {}; return { k: k, ten: m.ten || k, ky: vv(ptThay_(m.ky, { A: co[k].A, B: co[k].B })), de: ptThay_(m.de, { A: ptLv_(co[k].A || ''), B: ptLv_(co[k].B || '') }) }; });
  var gop = {}; de = de.filter(function (x) { if (gop[x]) return false; gop[x] = 1; return true; });
  var muc = diem >= 1.5 ? 'Thuận' : diem >= 0 ? 'Bình' : diem >= -1.5 ? 'Cần giữ nhịp' : 'Nên thận trọng';
  return { menh: ten[menhTang], menhO: menhTang, chi: CHI[menhTang], can: CAN[canTang], hoa: hoa.map(function (f) { return { h: PT_H[f.h], sao: f.sao, cung: f.toi == null ? null : ten[f.toi], o: f.toi }; }), ky: ky, de: de, mau: mau, diem: diem, muc: muc };
}

/** Hàm chính: luận Tứ Hóa Phi Tinh. vy = năm xem; soNam = số lưu niên tính từ vy */
function ptLap_(tv, vy, soNam) {
  var N = ptNguyenCuc_(tv), I = tv.info, P = tv.palaces, ten = N.ten, van = PT_VAN || {};
  vy = vy || I.viewYear; soNam = soNam || 5;
  var mau = ptMau_(N).map(function (m) {
    var v = (van.mau || {})[m.k] || {};
    return { k: m.k, ten: v.ten || m.k, ky: (m.ky ? m.ky + '. ' : '') + ptThay_(v.ky, { A: m.A, B: m.B }), de: ptThay_(v.de, { A: ptLv_(m.A || ''), B: ptLv_(m.B || '') }) };
  });
  var lnV = N.ln >= 0 ? ((van.laiNhan || {})[ten[N.ln]] || {}) : {};
  var dv = [];
  for (var i = 0; i < 12; i++) if (P[i].daiHan != null) {
    var t = ptTang_(N, tv, i, P[i].can, null, true);
    t.tuoi = P[i].daiHan; t.den = P[i].daiHan + 9; t.nam = I.lunar.year + P[i].daiHan - 1; t.nay = I.tuoi >= t.tuoi && I.tuoi <= t.den;
    dv.push(t);
  }
  dv.sort(function (a, b) { return a.tuoi - b.tuoi; });
  var ln = [];
  for (var y = vy; y < vy + soNam; y++) {
    var tuoi = y - I.lunar.year + 1, dvO = -1;
    for (var k = 0; k < 12; k++) if (P[k].daiHan != null && tuoi >= P[k].daiHan && tuoi <= P[k].daiHan + 9) dvO = k;
    var m = ((y + 8) % 12 + 12) % 12, c = ((y + 6) % 10 + 10) % 10;
    var tl = ptTang_(N, tv, m, c, dvO >= 0 ? dvO : null, false);
    tl.nam = y; tl.tuoi = tuoi; tl.dvMenh = dvO >= 0 ? ten[dvO] : null;
    ln.push(tl);
  }
  // Dữ liệu vẽ lá số 4×4 (chỉ số theo ô địa chi 0 = Tý): sao chính + 4 phụ tinh có Tứ Hóa, hóa năm sinh, tự hóa, phi hóa
  var PHU = ['Tả Phù', 'Hữu Bật', 'Văn Xương', 'Văn Khúc'], snSao = {};
  N.sn.forEach(function (f) { snSao[f.sao] = PT_H[f.h]; });
  var banDo = P.map(function (p, i) {
    var sao = (p.chinh || []).map(function (x) { return x.n; }).concat(PHU.filter(function (s) { return tv.pos[s] === i; }));
    return { cung: p.cung, chi: CHI[i], can: CAN[p.can],
      sao: sao.map(function (s) { return { n: s, sn: snSao[s] || '' }; }),
      tu: N.tuHoa.filter(function (t) { return t.o === i; }).map(function (t) { return { h: PT_H[t.h], loai: t.loai }; }),
      phi: N.phi[i].map(function (f) { return { h: PT_H[f.h], sao: f.sao, o: f.toi }; }) };
  });
  return {
    gioiThieu: van.gioiThieu || {}, banDo: banDo, menhO: I.menh, laiNhanO: N.ln,
    coBan: {
      canCung: P.map(function (p, i) { return { cung: p.cung, chi: CHI[i], can: CAN[p.can] }; }),
      sinhNien: N.sn.map(function (f) { return { h: PT_H[f.h], sao: f.sao, cung: f.toi == null ? null : ten[f.toi] }; }),
      laiNhan: N.ln >= 0 ? { cung: ten[N.ln], chi: CHI[N.ln], ky: lnV.ky || '', de: lnV.de || '' } : null,
      menh: ten[I.menh], than: P[I.than] ? P[I.than].cung : ''
    },
    tuHoa: N.tuHoa.map(function (t) { return { cung: ten[t.o], h: PT_H[t.h], sao: t.sao, loai: t.loai }; }),
    mau: mau,
    cung: PT_THU_TU.map(function (c) { return ptCung_(N, N.o[c]); }),
    daiVan: dv, luuNien: ln, nguon: PT_NGUON
  };
}

/** API cho giao diện – tab "Phi Tinh": hiện chỉ chủ sở hữu (chủ dự án chốt 31/10, thử trước rồi mới mở bán) */
function phiTinhLuan(input, token) {
  tkCan_(token, true);
  input = input || {};
  var tv = tuviLapLaSo(input);
  return ptLap_(tv, parseInt(input.viewYear, 10) || tv.info.viewYear, 5);
}
