/**
 * ============================================================
 *  NghiemChung.gs — NGHIỆM CHỨNG LÁ SỐ (ĐỊNH BÀN)
 *  Mục đích: khách tự chấm 8 nhóm mô tả để biết GIỜ SINH nhập vào có "đúng người" không.
 *
 *  v6 – NỀN TẢNG LÀ TỔNG HỢP 6 HỆ bản 2 (DeHieu.gs › th6Lap_): mỗi lĩnh vực có câu kết luận của hệ
 *   cùng chiều với đa số + tỷ lệ đồng thuận; NĂM ĐÃ QUA mà từ 3 hệ cùng báo (Biến cố hội tụ) được đưa vào để
 *   khách kiểm chứng bằng ký ức thật; anh em / cha mẹ lấy phiếu 3 hệ (Tử Vi, Bát Tự, Hà Lạc).
 *  v5 – LẤY KẾT LUẬN TỪ TỔNG HỢP 6 HỆ (TongHop.gs, BatTuChiTiet.gs, LuanGiai.gs):
 *   • Mỗi câu là kết luận đã được các hệ "bỏ phiếu" – kèm số hệ đồng thuận, không dùng luật đơn lẻ của 1 hệ.
 *   • Ưu tiên điều KIỂM CHỨNG ĐƯỢC: vóc dáng, dấu vết cơ thể, xuất thân, quan hệ với cha/mẹ/anh em,
 *     năm cưới – năm có con đã qua, chặng đời đã qua (thuận/khó).
 *   • Mỗi nhóm có "độ tin" = mức đồng thuận trung bình; nhóm đồng thuận cao nặng ký hơn khi tính điểm.
 *   • Nhóm không áp dụng (chưa lập gia đình, chưa có con) được bỏ qua, không làm sai kết quả.
 * ============================================================
 */

var NC_MUC_DIEM = { 'dung_het': 1.0, 'dung_phan_lon': 0.75, 'dung_mot_nua': 0.5, 'sai_phan_lon': 0.25, 'sai_hoan_toan': 0 };
var NC_MUC_TEN = { 'dung_het': '✓ Đúng hết', 'dung_phan_lon': '◐ Đúng phần lớn', 'dung_mot_nua': '◑ Đúng một nửa', 'sai_phan_lon': '◒ Sai phần lớn', 'sai_hoan_toan': '✗ Sai hoàn toàn', 'khong_ap_dung': '— Không áp dụng' };
var NC_TEN_NHOM = { 'A': 'Vóc dáng & dấu hiệu cơ thể', 'B': 'Tính cách', 'C': 'Anh chị em', 'D': 'Cha mẹ & xuất thân', 'E': 'Sức khỏe & giai đoạn khó đã qua',
  'F': 'Hôn nhân & người bạn đời', 'G': 'Con cái', 'H': 'Sự nghiệp & giai đoạn thuận đã qua' };
var NC_HE6 = ['Tử Vi', 'Bát Tự', 'Chiêm tinh', 'Thần số học', 'Human Design', 'Hà Lạc'];

/* -------- HÀM CHÍNH -------- */
function nghiemChungLap(input) {
  input = JSON.parse(JSON.stringify(input || {}));
  input.save = false;
  var r = lapLaSoDayDu_(input);
  var vy = r.tuvi.info.viewYear, tuoi = vy - r.tuvi.info.solar.year;
  var th6 = r.moRong && r.moRong.deHieu && r.moRong.deHieu.th6, lv = {}, hl = {};
  if (th6 && th6.linhVuc) th6.linhVuc.forEach(function (x) { lv[x.k] = x; });
  ((r.moRong && r.moRong.haLac && r.moRong.haLac.luan && r.moRong.haLac.luan.linhVuc) || []).forEach(function (x) { hl[x.k] = x; });
  var X = { r: r, T: (r.moRong && r.moRong.tongHop) || {}, vy: vy, tuoi: tuoi, nam: !!r.tuvi.info.male, lv: lv, hl: hl };
  var ds = [['A', ncNhomA_], ['B', ncNhomB_], ['C', ncNhomC_], ['D', ncNhomD_], ['E', ncNhomE_], ['F', ncNhomF_], ['G', ncNhomG_], ['H', ncNhomH_]];
  return {
    data: { tuoi: tuoi },
    doan: ds.map(function (x) {
      var g = { ma: x[0], ten: NC_TEN_NHOM[x[0]], dong: [], apDung: true, ghiChu: '' };
      try { x[1](X, g); } catch (e) { g.dong = []; g.ghiChu = 'Chưa đủ dữ liệu cho nhóm này.'; }
      // Chỉ giữ câu có từ 1/3 số hệ đồng thuận trở lên (câu "0% đồng thuận" là ý kiến thiểu số, không dùng để nghiệm chứng)
      g.dong = g.dong.filter(function (d) { return d && d.t && (d.so == null || d.so >= 0.34); }).slice(0, 5);
      var so = g.dong.map(function (d) { return d.so; }).filter(function (v) { return v != null; });
      g.doTin = so.length ? Math.round(so.reduce(function (a, b) { return a + b; }, 0) / so.length * 100) / 100 : 0.5;
      g.text = g.dong.map(function (d) { return d.t + (d.nhan ? ' (' + d.nhan + ')' : ''); }).join(' ');
      if (!g.text) g.text = g.ghiChu || 'Chưa đủ dữ liệu.';
      return g;
    })
  };
}

/* -------- TÍNH ĐIỂM KHỚP -------- */
function nghiemChungTinhDiem_(cauTraLoi) {
  cauTraLoi = cauTraLoi || {};
  var doTin = cauTraLoi._doTin || {};
  var diemMax = 0, diemDuoc = 0, chiTiet = [], soDungCao = 0, soSai = 0;
  ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].forEach(function (ma) {
    var muc = cauTraLoi[ma];
    if (muc === 'khong_ap_dung') { chiTiet.push({ ma: ma, ten: NC_TEN_NHOM[ma], muc: muc, mucTen: NC_MUC_TEN[muc], diem: null, trongSo: 0 }); return; }
    if (!muc || !NC_MUC_DIEM.hasOwnProperty(muc)) return;
    // Nhóm các hệ càng đồng thuận thì kết quả chấm càng có ý nghĩa → trọng số 1 … 2
    var dt = Number(doTin[ma]); if (!(dt >= 0 && dt <= 1)) dt = 0.5;
    var w = 1 + dt, diem = NC_MUC_DIEM[muc];
    diemMax += w; diemDuoc += diem * w;
    if (muc === 'dung_het' || muc === 'dung_phan_lon') soDungCao++;
    if (muc === 'sai_phan_lon' || muc === 'sai_hoan_toan') soSai++;
    chiTiet.push({ ma: ma, ten: NC_TEN_NHOM[ma], muc: muc, mucTen: NC_MUC_TEN[muc], diem: diem, trongSo: Math.round(w * 100) / 100 });
  });
  var pct = diemMax > 0 ? Math.round(diemDuoc / diemMax * 100) : 0;
  var soNhom = chiTiet.filter(function (c) { return c.diem != null; }).length, tyLe = soNhom ? soDungCao / soNhom : 0;
  var ketLuan, khuyen, mau;
  // Ngưỡng gốc: ≥ 6/8 nhóm "đúng cao" → xác nhận; 4–5/8 → có thể đúng. Quy ra tỷ lệ trên số nhóm được chấm, kèm % khớp có trọng số.
  if (soNhom >= 4 && tyLe >= 0.75 && pct >= 70) { ketLuan = 'XAC_NHAN'; mau = 'jade'; khuyen = 'Lá số của bạn RẤT KHỚP với giờ sinh đã nhập (' + soDungCao + '/' + soNhom + ' nhóm đúng cao). Yên tâm sử dụng.'; }
  else if (soNhom >= 4 && tyLe >= 0.5 && pct >= 55) { ketLuan = 'CO_THE_DUNG'; mau = 'gold'; khuyen = 'Lá số CÓ THỂ ĐÚNG nhưng chưa hoàn toàn (' + soDungCao + '/' + soNhom + ' nhóm đúng cao). Bạn có thể tiếp tục, hoặc kiểm tra lại giờ sinh.'; }
  else { ketLuan = 'CO_THE_SAI'; mau = 'coral'; khuyen = 'Lá số CHƯA KHỚP với giờ sinh (' + soDungCao + '/' + soNhom + ' nhóm đúng cao). Nên thử các giờ sinh lân cận để tìm giờ khớp nhất.'; }
  return { pct: pct, ketLuan: ketLuan, khuyen: khuyen, mau: mau, soDungCao: soDungCao, soSai: soSai, soNhom: soNhom, chiTiet: chiTiet };
}

/* -------- TIỆN ÍCH -------- */
/** Đọc mức đồng thuận có sẵn trong câu kết luận của TongHop: "3/4 hệ", "đồng thuận 75%", "58% phiếu", "được 3 hệ cùng chỉ ra" */
function ncMucDong_(s) {
  s = String(s || ''); var m;
  if ((m = s.match(/(\d)\s*\/\s*(\d)\s*(hệ|dấu hiệu)/))) return Math.min(1, +m[1] / +m[2]);
  if ((m = s.match(/đồng thuận\s*(\d+)\s*%/))) return +m[1] / 100;
  if ((m = s.match(/(\d+)\s*%\s*phiếu/))) return +m[1] / 100;
  if ((m = s.match(/được\s*(\d)\s*hệ cùng/))) return Math.min(1, +m[1] / 4);
  return null;
}
function ncSach_(s) { return String(s && s.t || s || '').replace(/^[✓✗◇•\s]+/, '').trim(); }
/** Rút gọn câu: bỏ phần chú thích kỹ thuật trong ngoặc cuối (tên sao, tên hệ) nhưng giữ mức đồng thuận để hiện riêng */
function ncGon_(s) {
  return ncSach_(s).replace(/\s*\((đồng thuận \d+%|\d\/\d (hệ|dấu hiệu) cùng chiều)\)/g, '')
    .replace(/;\s*khí chất [^.;]+/g, '')                          // không nêu tên sao trong câu cho khách chấm
    .replace(/\s*\((Sao|Mặt Trời|Mặt Trăng) [^)]*\)/g, '').replace(/\s+/g, ' ').replace(/\s+([.;,])/g, '$1').trim();
}
function ncDong_(t, so, nhan) { return { t: t, so: so == null ? null : Math.round(so * 100) / 100, nhan: nhan || (so != null ? Math.round(so * 100) + '% đồng thuận' : '') }; }
function ncDiemCung_(r, ten) { var c = (r.chiTiet && r.chiTiet.cung || []).filter(function (x) { return x.cung === ten; })[0]; return c ? chuanHoa10_(c.diem) : null; }
function ncLinhVucBT_(r, key) { var l = (r.battuChiTiet && r.battuChiTiet.linhVuc || []).filter(function (x) { return x.key === key; })[0]; return l ? chuanHoa10_(l.diem) : null; }
/** Hai hệ (Tử Vi cung, Bát Tự lĩnh vực) cùng chiều? trả {chieu: 1 tốt / -1 khó / 0 lệch, so} */
function ncHaiHe_(a, b) {
  if (a == null || b == null) return { chieu: 0, so: null };
  var ca = a >= 6 ? 1 : a <= 4.5 ? -1 : 0, cb = b >= 6 ? 1 : b <= 4.5 ? -1 : 0;
  if (ca && ca === cb) return { chieu: ca, so: 1 };
  if (ca && cb && ca !== cb) return { chieu: 0, so: 0.3 };
  return { chieu: ca || cb, so: 0.6 };
}
function ncChangQua_(X) {   // các chặng đời đã qua (kết thúc trước năm xem), có điểm
  return ((X.T.duongDoi && X.T.duongDoi.chang) || []).filter(function (c) { return +String(c.nam).split('–')[1] < X.vy && +String(c.nam).split('–')[0] >= X.r.tuvi.info.solar.year + 3; });
}

/** Câu kết luận đồng thuận của một lĩnh vực trong Tổng hợp 6 hệ (câu của hệ cùng chiều với đa số) */
function ncLv_(X, g, k, toiDa) {
  var x = X.lv[k]; if (!x) return;
  var soP = x.soHe || 0, so = soP ? x.dong / soP : null, ds = (x.huong === 'xau' ? x.yeu.concat(x.manh) : x.manh.concat(x.yeu));
  ds.slice(0, toiDa || 1).forEach(function (m, i) {
    g.dong.push(ncDong_(m.t, i === 0 ? so : so != null ? so * 0.8 : null, (i === 0 && soP ? x.dong + '/' + soP + ' hệ cùng chiều · ' : '') + m.he));
  });
}
var NC_NAM_MAU = {
  taiLoc: 'tiền bạc hoặc thu nhập khởi sắc rõ', quanLoc: 'công việc có chuyển động lớn (thăng tiến, đổi việc hoặc nhận trách nhiệm mới)',
  ketHon: 'có chuyện tình cảm quan trọng (bắt đầu yêu, cưới hỏi hoặc thay đổi lớn trong quan hệ)', sinhCon: 'có tin vui hoặc chuyện nổi bật về con cái',
  sucKhoe: 'sức khỏe đi xuống, mệt mỏi kéo dài hoặc phải chữa trị', taiChinh: 'hao tài – tiền bạc thất thoát hoặc chi lớn ngoài dự tính',
  giaDao: 'gia đình, nhà cửa có biến động (chuyển nhà, sửa nhà hoặc chuyện người thân)', buocNgoat: 'có bước ngoặt – đổi môi trường sống hoặc làm việc'
};
/** Năm đã qua mà từ 3 hệ cùng báo – bằng chứng kiểm chứng bằng ký ức (bỏ năm trước 16 tuổi) */
function ncNamQua_(X, g, keys, toiDa) {
  var ds = [], namSinh = X.r.tuvi.info.solar.year;
  Object.keys(X.lv).forEach(function (k) { (X.lv[k].namQua || []).forEach(function (n) { if (keys.indexOf(n.k) >= 0 && n.nam - namSinh >= 16 && !ds.some(function (d) { return d.nam === n.nam && d.k === n.k; })) ds.push(n); }); });
  // gộp các chủ đề cùng một năm thành một câu
  var theoNam = {};
  ds.forEach(function (n) { var x = theoNam[n.nam] = theoNam[n.nam] || { nam: n.nam, y: [], soHe: 0, he: [] }; x.y.push(NC_NAM_MAU[n.k]); x.soHe = Math.max(x.soHe, n.soHe); (n.he || []).forEach(function (h) { if (x.he.indexOf(h) < 0) x.he.push(h); }); });
  Object.keys(theoNam).map(function (k) { return theoNam[k]; }).sort(function (a, b) { return b.soHe - a.soHe || b.nam - a.nam; }).slice(0, toiDa || 2).forEach(function (n) {
    g.dong.push(ncDong_('Năm ' + n.nam + ' (' + (n.nam - namSinh) + ' tuổi): ' + n.y.join('; ') + '.', Math.min(1, n.soHe / 4), n.soHe + ' hệ cùng báo' + (n.he.length ? ': ' + n.he.join(', ') : '')));
  });
}
/** Phiếu 3 hệ cho một quan hệ gia đình: Tử Vi (cung), Bát Tự (lĩnh vực), Hà Lạc (lục thân) → {chieu, so, nhan} */
function ncBaHe_(X, cung, keyBT, keyHL) {
  var p = [], tv = ncDiemCung_(X.r, cung), bt = ncLinhVucBT_(X.r, keyBT), hl = X.hl[keyHL];
  if (tv != null) p.push(['Tử Vi', tv >= 6 ? 1 : tv <= 4.5 ? -1 : 0]);
  if (bt != null) p.push(['Bát Tự', bt >= 6 ? 1 : bt <= 4.5 ? -1 : 0]);
  if (hl) p.push(['Hà Lạc', hl.bac === 'tot' ? 1 : hl.bac === 'kho' ? -1 : 0]);
  var tong = p.reduce(function (t, x) { return t + x[1]; }, 0), chieu = tong > 0 ? 1 : tong < 0 ? -1 : 0;
  var dong = p.filter(function (x) { return x[1] === chieu; });
  return { chieu: chieu, so: p.length ? dong.length / p.length : null, nhan: dong.length + '/' + p.length + ' hệ: ' + dong.map(function (x) { return x[0]; }).join(', ') };
}
var NC_SO_ANH_EM = {
  'Tử Vi': [[3, 4], [2, 3]], 'Thiên Cơ': [[2, 3], [1, 1]], 'Thái Dương': [[3, 4], [2, 2]], 'Vũ Khúc': [[2, 2], [1, 1]],
  'Thiên Đồng': [[4, 5], [2, 3]], 'Liêm Trinh': [[2, 2], [1, 1]], 'Thiên Phủ': [[4, 5], [3, 4]], 'Thái Âm': [[4, 5], [2, 3]],
  'Tham Lang': [[3, 3], [1, 2]], 'Cự Môn': [[2, 3], [1, 2]], 'Thiên Tướng': [[2, 3], [2, 2]], 'Thiên Lương': [[2, 3], [1, 2]],
  'Thất Sát': [[2, 3], [1, 1]], 'Phá Quân': [[2, 3], [1, 2]]
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
 *  8 NHÓM – MỖI CÂU LÀ KẾT LUẬN ĐỒNG THUẬN NHIỀU HỆ
 * ============================================================ */
/** A. Vóc dáng & dấu hiệu cơ thể: TongHop.vocDang (bỏ phiếu 6 hệ, gồm cung Mọc) + dấu vết cơ thể được nhiều hệ chỉ ra */
function ncNhomA_(X, g) {
  var V = X.T.vocDang, C = X.T.coThe;
  (V && V.ketLuan || []).forEach(function (s) {
    var t = ncSach_(s); if (/^Với (nam|nữ) giới/.test(t)) return;
    g.dong.push(ncDong_(ncGon_(t), ncMucDong_(t)));
  });
  var dau = (C && C.ketLuan || []).map(ncSach_).filter(function (t) { return /được \d hệ cùng chỉ ra/.test(t); })[0];
  if (dau) { var m = dau.match(/^(.+?) – được (\d) hệ cùng chỉ ra \(([^)]+)\)/); if (m) g.dong.push(ncDong_('Vùng ' + m[1].toLowerCase() + ' dễ có dấu vết (sẹo, nốt ruồi, bớt) hoặc hay gặp vấn đề nhỏ.', Math.min(1, +m[2] / 4), m[2] + ' hệ: ' + m[3])); }
  var nhan = (C && C.ketLuan || []).map(ncSach_).filter(function (t) { return /^Dấu hiệu dễ nhận ra/.test(t); })[0];
  if (nhan) g.dong.push(ncDong_(nhan, 0.5, 'Tử Vi'));
}
/** B. Tính cách: các trục tính cách có nhiều hệ cùng chiều nhất (TongHop.tinhCach.truc) */
function ncNhomB_(X, g) {
  var TC = X.T.tinhCach; if (!TC) return;
  (TC.truc || []).filter(function (t) { return Math.abs(t.gt) >= 0.25 && t.tyLe >= 60 && !/^Cân bằng/.test(t.moTa); })   // "cân bằng" đúng với mọi người → không dùng để nghiệm chứng
    .sort(function (a, b) { return b.tyLe - a.tyLe || Math.abs(b.gt) - Math.abs(a.gt); }).slice(0, 3)
    .forEach(function (t) { g.dong.push(ncDong_(t.moTa.replace(/\s*\(mức [^)]+\)/, '') + '.', t.tyLe / 100, t.dong.length + '/' + (t.dong.length + t.nguoc.length) + ' hệ: ' + t.dong.join(', '))); });
  ncLv_(X, g, 'tinh_cach', 2);
  if (TC.yeu && TC.yeu[0]) g.dong.push(ncDong_('Điểm hay bị người thân góp ý: ' + TC.yeu[0] + '.', null, ''));
}
/** C. Anh chị em: Tử Vi (cung Huynh Đệ + bảng số theo sách cổ) × Bát Tự (lĩnh vực anh em + sao Tỷ Kiếp) */
function ncNhomC_(X, g) {
  var r = X.r, P = r.tuvi.palaces, pi = -1;
  for (var i = 0; i < 12; i++) if (P[i].cung === 'Huynh Đệ') pi = i;
  var tv = ncDiemCung_(r, 'Huynh Đệ'), bt = ncLinhVucBT_(r, 'Huynh Đệ'), h = ncHaiHe_(tv, bt);
  var u = pi >= 0 ? ncUocSo_(P, pi, NC_SO_ANH_EM) : null, tk = 0;
  r.battu.pillars.forEach(function (p, j) {
    if (j !== 2 && (p.thapThan === 'Tỷ Kiên' || p.thapThan === 'Kiếp Tài')) tk++;
    p.tangCan.forEach(function (t) { if (t.thapThan === 'Tỷ Kiên' || t.thapThan === 'Kiếp Tài') tk += 0.5; });
  });
  if (u) {
    var tvNhieu = u.hi >= 3 ? 1 : u.hi <= 1 ? -1 : 0, btNhieu = tk >= 2.5 ? 1 : tk < 1 ? -1 : 0;
    var dongY = tvNhieu && tvNhieu === btNhieu;
    var muc = (dongY ? tvNhieu : tvNhieu || btNhieu) > 0 ? 'đông anh chị em (từ 3 người trở lên)' : (dongY ? tvNhieu : tvNhieu || btNhieu) < 0 ? 'ít anh chị em (1–2 người, hoặc là con một)' : 'số anh chị em vừa phải (khoảng 2–3 người)';
    g.dong.push(ncDong_('Gia đình thuộc dạng ' + muc + '.', dongY ? 1 : tvNhieu === -btNhieu && tvNhieu ? 0.3 : 0.6, dongY ? '2/2 hệ: Tử Vi, Bát Tự' : 'Tử Vi' + (btNhieu ? ', Bát Tự khác chiều' : '')));
  }
  var b3 = ncBaHe_(X, 'Huynh Đệ', 'Huynh Đệ', 'anhEm');
  if (b3.chieu > 0) g.dong.push(ncDong_('Anh chị em hòa thuận, có lúc nâng đỡ nhau về công việc hoặc tiền bạc.', b3.so, b3.nhan));
  else if (b3.chieu < 0) g.dong.push(ncDong_('Anh chị em mỗi người một ngả, có khoảng cách hoặc bất đồng; ít nhờ cậy được nhau.', b3.so, b3.nhan));
  else g.dong.push(ncDong_('Quan hệ anh em có lúc gần lúc xa: thân thiết giai đoạn nhỏ, trưởng thành thì mỗi người tự lo.', b3.so == null ? 0.4 : Math.max(0.4, b3.so), 'các hệ chưa thống nhất'));
  if (tk >= 2.5) g.dong.push(ncDong_('Có sự cạnh tranh ngầm giữa anh em (so sánh, chuyện tài sản chung).', 0.5, 'Bát Tự'));
}
/** D. Cha mẹ & xuất thân: TongHop.xuatThan (bỏ phiếu nhiều hệ) + chênh lệch duyên cha – mẹ khi Tử Vi và Bát Tự cùng chỉ ra */
function ncNhomD_(X, g) {
  (X.T.xuatThan && X.T.xuatThan.ketLuan || []).slice(0, 2).forEach(function (s) { var t = ncSach_(s); g.dong.push(ncDong_(ncGon_(t), ncMucDong_(t))); });
  var b3 = ncBaHe_(X, 'Phụ Mẫu', 'Phụ Mẫu', 'chaMe');
  if (b3.chieu > 0) g.dong.push(ncDong_('Được cha mẹ che chở, nâng đỡ; việc học hành, nhà cửa lúc trẻ có gia đình hỗ trợ.', b3.so, b3.nhan));
  else if (b3.chieu < 0) {
    var khaGia = g.dong.some(function (d) { return /khá giả|nền tảng vật chất|điều kiện/.test(d.t); });
    g.dong.push(ncDong_((khaGia ? 'Dù gia đình có nền tảng, bạn vẫn sớm phải tự lập, ít dựa vào cha mẹ' : 'Sớm phải tự lập, ít dựa được vào cha mẹ') + '; học hành, nhà cửa chủ yếu tự gây dựng.', b3.so, b3.nhan));
  }
  var lt = (X.r.battuChiTiet && X.r.battuChiTiet.lucThan) || [];
  var cha = lt.filter(function (x) { return x.ten === 'Cha'; })[0], me = lt.filter(function (x) { return x.ten === 'Mẹ'; })[0];
  if (cha && me && Math.abs(cha.diem - me.diem) >= 2) {
    var P = X.r.tuvi.palaces, pos = X.r.tuvi.pos || {};
    function doSang(ten) { var c = pos[ten] != null ? P[pos[ten]].chinh.filter(function (s) { return s.n === ten; })[0] : null; return c ? (ncSang_(c) ? 1 : c.b === 'H' ? -1 : 0) : 0; }
    var tvCha = doSang('Thái Dương'), tvMe = doSang('Thái Âm'), btCha = cha.diem > me.diem;
    var tvCung = (tvCha - tvMe) !== 0 && ((tvCha > tvMe) === btCha);
    g.dong.push(ncDong_('Duyên với ' + (btCha ? 'cha' : 'mẹ') + ' sâu hơn; với ' + (btCha ? 'mẹ' : 'cha') + ' có giai đoạn xa cách hoặc khác quan điểm.', tvCung ? 1 : 0.5, tvCung ? '2/2 hệ: Bát Tự, Tử Vi (Nhật – Nguyệt)' : 'Bát Tự'));
  }
}
/** E. Sức khỏe & giai đoạn khó đã qua: vùng cơ thể được nhiều hệ chỉ ra + chặng đời đã qua có điểm thấp */
function ncNhomE_(X, g) {
  (X.T.coThe && X.T.coThe.ketLuan || []).map(ncSach_).filter(function (t) { return /được \d hệ cùng chỉ ra/.test(t); }).slice(0, 3).forEach(function (t) {
    var m = t.match(/^(.+?) – được (\d) hệ cùng chỉ ra \(([^)]+)\)/); if (!m) return;
    g.dong.push(ncDong_('Hay gặp vấn đề ở ' + m[1].toLowerCase() + ' (mệt, đau, bệnh vặt tái lại).', Math.min(1, +m[2] / 4), m[2] + ' hệ: ' + m[3]));
  });
  ncLv_(X, g, 'suc_khoe', 1);
  ncNamQua_(X, g, ['sucKhoe', 'taiChinh', 'giaDao'], 2);
  var qua = ncChangQua_(X).slice().sort(function (a, b) { return a.diem - b.diem; })[0];
  if (qua && qua.diem < 2) g.dong.push(ncDong_('Giai đoạn ' + qua.khoang + ' (' + qua.nam + ') từng vất vả hơn các chặng khác: áp lực tiền bạc, sức khỏe hoặc chuyện gia đình.', qua.dongThuan ? 1 : 0.5, qua.dongThuan ? 'Tử Vi & Bát Tự cùng chiều' : 'Tử Vi'));
}
/** F. Hôn nhân: chân dung người phối ngẫu + năm cưới đã qua (TongHop.phoiNgau – ghép 5 hệ) */
function ncNhomF_(X, g) {
  if (X.tuoi < 20) { g.apDung = false; g.ghiChu = 'Bạn chưa đến tuổi lập gia đình – chọn "Không áp dụng".'; }
  var L = (X.T.phoiNgau && X.T.phoiNgau.ketLuan || []).map(ncSach_);
  function lay(re, so, nhan) { var t = L.filter(function (x) { return re.test(x); })[0]; if (t) g.dong.push(ncDong_(t, so, nhan)); }
  ncLv_(X, g, 'tinh_duyen', 1);
  ncNamQua_(X, g, ['ketHon'], 1);
  lay(/^Ngoại hình người/, 0.6, 'ghép 5 hệ');
  lay(/^Tính cách:/, 0.6, 'ghép 5 hệ');
  var cl = L.filter(function (x) { return /^Chênh lệch tuổi/.test(x); })[0];
  if (cl) g.dong.push(ncDong_(ncGon_(cl), ncMucDong_(cl), (cl.match(/\((\d\/\d dấu hiệu) cùng chiều\)/) || [])[1]));
  lay(/^Nơi\/cách gặp/, 0.5, 'Tử Vi, Chiêm tinh');
  var da = L.filter(function (x) { return /^Nếu bạn đã kết hôn/.test(x); })[0];
  if (da) g.dong.push(ncDong_(da.replace(/^Nếu bạn đã kết hôn \(khả năng việc này đã diễn ra trước năm nay ≈ \d+%\), /, 'Nếu đã kết hôn: '), 0.7, 'xác suất tổng hợp 5 hệ'));
}
/** G. Con cái: TongHop.phoiNgau.conCai + năm có con đã qua */
function ncNhomG_(X, g) {
  if (X.tuoi < 22) { g.apDung = false; g.ghiChu = 'Chưa đến tuổi có con – chọn "Không áp dụng".'; }
  ncLv_(X, g, 'con_cai', 1);
  ncNamQua_(X, g, ['sinhCon'], 1);
  var CC = X.T.phoiNgau && X.T.phoiNgau.conCai;
  ((CC && CC.ketLuan) || []).map(ncSach_).forEach(function (t) {
    if (/^Số con/.test(t)) g.dong.push(ncDong_(t, 0.6, 'Tử Vi, Bát Tự'));
    else if (/^Trai – gái/.test(t)) g.dong.push(ncDong_(t.replace(/\s*\(Tử Vi \+ Bát Tự; tham khảo\)/, ''), 0.4, 'Tử Vi, Bát Tự'));
    else if (/^Quan hệ cha mẹ – con/.test(t)) g.dong.push(ncDong_(t, 0.5, ''));
  });
  var L = (X.T.phoiNgau && X.T.phoiNgau.ketLuan || []).map(ncSach_), co = L.filter(function (x) { return /^Nếu bạn đã có con/.test(x); })[0];
  if (co) g.dong.push(ncDong_(co.replace(/^Nếu bạn đã có con \(khả năng việc này đã diễn ra trước năm nay ≈ \d+%\), /, 'Nếu đã có con: '), 0.7, 'xác suất tổng hợp 5 hệ'));
}
/** H. Sự nghiệp: nghề được nhiều hệ cùng gợi ý + chặng đời đã qua thuận lợi nhất */
function ncNhomH_(X, g) {
  ncLv_(X, g, 'cong_danh', 1);
  ncNamQua_(X, g, ['quanLoc', 'taiLoc', 'buocNgoat'], 2);
  var N = (X.T.nghe || []).slice(0, 3);
  if (N.length) g.dong.push(ncDong_('Hợp nhất với: ' + N.map(function (n) { return n.ten.toLowerCase() + ' (' + n.he.length + '/6 hệ)'; }).join('; ') + '.', N[0].he.length / 6, ''));
  var qua = ncChangQua_(X).slice().sort(function (a, b) { return b.diem - a.diem; })[0];
  if (qua && qua.diem >= 3) g.dong.push(ncDong_('Giai đoạn ' + qua.khoang + ' (' + qua.nam + ') là thời kỳ thuận lợi nổi bật: học hành, công việc hoặc thu nhập lên rõ.', qua.dongThuan ? 1 : 0.5, qua.dongThuan ? 'Tử Vi & Bát Tự cùng chiều' : 'Tử Vi'));

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