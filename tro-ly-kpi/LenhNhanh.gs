/**
 * CÂU LỆNH SẴN – trả lời KHÔNG tốn tiền AI (Zalo, ô Trò chuyện của web app, tab Giọng nói).
 *
 * Hiểu câu nói tự nhiên theo từ khóa:
 *   chủ đề  : hiệu suất / sản lượng, xưởng nào cao – thấp nhất, dừng máy, nghỉ – đi muộn, KCS – lỗi, chờ duyệt,
 *             điểm danh, bảo trì máy, lịch họp, mấy giờ, "lệnh" (danh sách câu hỏi miễn phí)
 *   thời gian: hôm nay, hôm qua, hôm kia, 15/10, tuần này (7 ngày qua), tuần trước, tháng này, tháng trước, 10 ngày qua
 *   đối tượng: tên xưởng ("xưởng Ngọn", mã xưởng) hoặc họ tên công nhân
 * Ví dụ: "hôm qua xưởng nào thấp nhất", "hiệu suất xưởng Ngọn tuần này", "dừng máy tháng này", "hôm nay ai nghỉ",
 *        "lỗi KCS hôm qua", "còn bao nhiêu dòng chờ duyệt", "máy nào sắp bảo trì", "lịch hôm nay", "hiệu suất Nguyễn Văn An".
 *
 * Câu có "vì sao, phân tích, so sánh, đề xuất, viết…" vẫn chuyển cho AI (cần suy luận).
 *
 * Câu tự thêm: tab "LenhNhanh" trong sheet "Trợ lý – Công ty Agent" (tạo bằng hàm caiDatLenhNhanh):
 *   cột CachGoi = các cách gọi, ngăn bằng dấu ;   cột TraLoi = câu trả lời cố định,
 *   hoặc bắt đầu bằng "=" để chạy câu lệnh khác (vd "=hiệu suất xưởng Ngọn hôm qua", "=bc", "=tuần").
 */

var LN_AI = /(vi sao|tai sao|nguyen nhan|phan tich|so sanh|de xuat|giai phap|nen lam|lam sao|lam the nao|(^| )viet |soan|du bao|giai thich|danh gia|tu van|ke hoach|y kien|nhan xet|cai thien|slide|trinh chieu|email|(^| )thu |bai viet|tin tuc|(^| )tim |nhac|ghi (chu|lai|nho)|(^| )luu |(^| )them |(^| )tao |(^| )gui |dat lich|(^| )dich |tep|file|bieu do)/;
var LN_BO = /^(trợ lý ơi|trợ lý|jarvis)[\s,.!]*|^(cho (tôi|em|anh|chị) (biết|xem|hỏi)|xem giúp|xem|kiểm tra)\s+|\s*(giúp (tôi|em|anh|chị)?|với|nhé|nhỉ|ạ|đi|thế nào|ra sao|sao rồi|bao nhiêu)\s*$/g;

/** Chủ đề: [mã, biểu thức (có dấu), chỉ khớp có dấu?] – thứ tự = ưu tiên. */
var LN_CHU_DE = [
  ['lenh', /^(lệnh|các lệnh|danh sách lệnh|lệnh miễn phí|câu hỏi miễn phí|bạn làm được gì|bạn biết làm gì)$/, false],
  ['gio', /(mấy giờ|bây giờ là|hôm nay (là )?(thứ|ngày) (mấy|bao nhiêu)|hôm nay là ngày)/, true],
  ['lich', /(lịch (hôm nay|ngày mai|làm việc|họp|của tôi)|cuộc họp|có họp|họp gì|^lịch$)/, true],
  ['bao_tri', /(bảo trì|bảo dưỡng|đến hạn bảo)/, false],
  ['diem_danh', /(điểm danh|xác nhận chấm công)/, false],
  ['cho_duyet', /(chờ duyệt|chưa duyệt|chưa chốt|chờ chốt)/, false],
  ['nghi', /(nghỉ|vắng|đi muộn|đi làm muộn)/, true],
  ['kcs', /(kcs|lỗi|không đạt|chất lượng|hàng hỏng|phế phẩm|hàng hư)/, true],
  ['dung', /(dừng máy|máy dừng|ngừng máy|giờ dừng|dừng|ngừng)/, true],
  ['xep_hang', /((xưởng|tổ) nào|thấp nhất|cao nhất|xếp hạng|đứng đầu|đứng cuối|kém nhất|tốt nhất)/, false],
  ['hieu_suat', /(hiệu suất|năng suất|sản lượng|kpi|tình hình sản xuất|sản xuất)/, false]
];

/** Trả lời câu hỏi bằng lệnh sẵn; '' nếu không phải lệnh sẵn (để AI trả lời). */
function lenhNhanh_(text, sau) {
  var goc = String(text || '').trim();
  if (!goc || /^@/.test(goc) || goc.length > 160) return '';
  var t = goc.toLowerCase().replace(/[?!.]+$/g, '').replace(/\s+/g, ' ').replace(LN_BO, '').trim();
  if (!t) return '';
  var k = khongDau_(t);

  var tu = sau ? '' : lnTuThem_(t, k);   // câu đích của "=" không tra lại tab LenhNhanh (tránh gọi vòng)
  if (tu) {
    if (tu.charAt(0) !== '=') return tu;
    var dich = tu.slice(1).trim();
    if (typeof traLoiNhanh_ === 'function' && /^(bc|báo cáo|bản tin|tuần|việc|xong)\b/i.test(dich)) return traLoiNhanh_(dich);
    return lenhNhanh_(dich, true);
  }
  if (LN_AI.test(k)) return '';

  var cd = '';
  for (var i = 0; i < LN_CHU_DE.length && !cd; i++) {
    var c = LN_CHU_DE[i], re = c[1];
    if (re.test(t) || (!c[2] && new RegExp(khongDau_(re.source)).test(k))) cd = c[0];
  }
  if (cd === 'lenh') return lnDanhSach_();
  if (cd === 'gio') return lnGio_();
  if (cd === 'lich') return lnLich_(k);

  if (!cd && !lnCoThoiGian_(k)) return '';   // không đọc số liệu khi chắc chắn không phải lệnh sẵn
  var D = napDuLieu_(), T = traCuu_(D), hn = homNay_();
  var x = lnXuong_(t, k, T), nv = x ? '' : lnNguoi_(t, k, D);
  if (!cd && (x || nv) && lnCoThoiGian_(k)) cd = 'hieu_suat';   // "xưởng Ngọn hôm qua"
  if (!cd) return '';
  var tg = lnThoiGian_(k, D, hn, cd);

  var out;
  switch (cd) {
    case 'bao_tri': out = lnBaoTri_(D, T, hn); break;
    case 'diem_danh': out = lnDiemDanh_(D, T, tg); break;
    case 'cho_duyet': out = lnChoDuyet_(D, T, tg, x); break;
    case 'nghi': out = lnNghi_(D, tg); break;
    case 'kcs': out = lnKcs_(D, T, tg, x); break;
    case 'dung': out = lnDung_(D, T, tg, x); break;
    default: out = nv ? lnNguoiHs_(D, T, tg, nv) : x ? lnXuongHs_(D, T, tg, x) : lnNhaMay_(D, T, tg, cd === 'xep_hang');
  }
  return out + '\n\n(Lệnh sẵn – miễn phí. Cần phân tích sâu thì thêm chữ "phân tích" hoặc "vì sao" vào câu hỏi.)';
}

/* ============================ HIỂU CÂU ============================ */

function khongDau_(s) {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

/** Có chứa đúng từ / cụm từ (không dính chữ khác). */
function lnCoTu_(s, w) {
  if (!w) return false;
  var e = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp('(^|[^0-9a-zà-ỹđ])' + e + '(?=$|[^0-9a-zà-ỹđ])').test(s);
}

function lnCoThoiGian_(k) { return /(hom (nay|qua|kia)|\d{1,2}[\/\-.]\d{1,2}|tuan|thang|\d+ ngay)/.test(k); }

/** Khoảng thời gian trong câu. Mặc định: ngày gần nhất có số liệu (riêng "nghỉ" = hôm nay, "chờ duyệt" = 10 ngày qua). */
function lnThoiGian_(k, D, hn, cd) {
  var m, f = function (s) { return Number(s.slice(8)) + '/' + Number(s.slice(5, 7)); };
  var mot = function (d, ten) { return { tu: d, den: d, ten: (ten ? ten + ' (' : '') + tenNgay_(d).replace(/\/\d{4}$/, '') + (ten ? ')' : '') }; };
  var khoang = function (a, b, ten) { return { tu: a, den: b, ten: ten + ' (' + f(a) + ' → ' + f(b) + ')' }; };
  if (/hom kia/.test(k)) return mot(congNgay_(hn, -2), 'hôm kia');
  if (/hom qua/.test(k)) return mot(congNgay_(hn, -1), 'hôm qua');
  if (/hom nay/.test(k)) return mot(hn, 'hôm nay');
  if ((m = k.match(/(\d{1,2})[\/\-.](\d{1,2})(?:[\/\-.](\d{4}))?/))) {
    var d = (m[3] || hn.slice(0, 4)) + '-' + pad_(m[2]) + '-' + pad_(m[1]);
    if (d > hn && !m[3]) d = (Number(hn.slice(0, 4)) - 1) + d.slice(4);
    return mot(d);
  }
  if (/tuan truoc/.test(k)) return khoang(congNgay_(hn, -14), congNgay_(hn, -8), 'tuần trước');
  if (/(tuan nay|tuan qua|7 ngay)/.test(k)) return khoang(congNgay_(hn, -7), congNgay_(hn, -1), '7 ngày qua');
  if (/thang truoc/.test(k)) {
    var dau = congNgay_(hn.slice(0, 8) + '01', -1).slice(0, 8) + '01', cuoi = congNgay_(hn.slice(0, 8) + '01', -1);
    return khoang(dau, cuoi, 'tháng ' + Number(dau.slice(5, 7)));
  }
  if (/thang nay/.test(k)) return khoang(hn.slice(0, 8) + '01', hn, 'tháng ' + Number(hn.slice(5, 7)));
  if ((m = k.match(/(\d+) ngay (qua|gan (day|nhat)|vua qua)/))) return khoang(congNgay_(hn, -Math.min(Number(m[1]), 92)), congNgay_(hn, -1), m[1] + ' ngày qua');
  if (cd === 'nghi') return mot(hn, 'hôm nay');
  if (cd === 'cho_duyet') return khoang(congNgay_(hn, -10), hn, '10 ngày qua');
  var g = ngayGanNhat_(D, hn);
  return g ? mot(g) : khoang(congNgay_(hn, -10), congNgay_(hn, -1), '10 ngày qua');
}

/** Xưởng được nhắc tới: "xưởng Ngọn", tên đầy đủ, hoặc mã xưởng. Tên ngắn phải đúng dấu ("Cán" ≠ "cần"). */
function lnXuong_(t, k, T) {
  var tot = '', dai = 0;
  Object.keys(T.tenXuong).forEach(function (ma) {
    var ten = String(T.tenXuong[ma]).toLowerCase(), ngan = ten.replace(/^xưởng\s+/, '');
    var cach = [ten, 'xưởng ' + ngan, 'tổ ' + ngan];
    if (ngan.length >= 4) cach.push(ngan);
    var hop = cach.some(function (c) { return lnCoTu_(t, c); }) ||
      lnCoTu_(k, khongDau_('xưởng ' + ngan)) || (ma.length >= 2 && lnCoTu_(t, ma.toLowerCase()))   // mã xưởng so trên chữ có dấu: "cần" ≠ "CAN";
    if (hop && ten.length > dai) { tot = ma; dai = ten.length; }
  });
  return tot;
}

/** Công nhân được nhắc tới theo họ tên (đủ họ tên, hoặc 2 chữ cuối nếu chỉ một người trùng). */
function lnNguoi_(t, k, D) {
  var ds = [], hai = {};
  Object.keys(D.nvCon).forEach(function (m) {
    var ten = String(D.nvTen[m] || '').toLowerCase().trim();
    if (!ten) return;
    if (lnCoTu_(t, ten) || lnCoTu_(k, khongDau_(ten))) ds.push({ m: m, n: ten.length + 100 });
    var p = ten.split(/\s+/);
    if (p.length >= 3) { var h = p.slice(-2).join(' '); (hai[h] = hai[h] || []).push(m); }
  });
  if (!ds.length) Object.keys(hai).forEach(function (h) { if (hai[h].length === 1 && lnCoTu_(t, h)) ds.push({ m: hai[h][0], n: h.length }); });
  ds.sort(function (a, b) { return b.n - a.n; });
  return ds.length ? ds[0].m : '';
}

/** Câu tự thêm trong tab LenhNhanh (đọc qua bộ nhớ đệm 10 phút). */
function lnTuThem_(t, k) {
  var ds = lnDocTuThem_(), kq = '';
  ds.some(function (d) {
    return d.goi.some(function (g) {
      if (k === g || (g.length >= 6 && lnCoTu_(k, g))) { kq = d.tl; return true; }
      return false;
    });
  });
  return kq;
}

function lnDocTuThem_() {
  var C = CacheService.getScriptCache(), c = C.get('lenhNhanh');
  if (c) try { return JSON.parse(c); } catch (e) { /* đọc lại */ }
  var ds = [];
  try {
    var ss = typeof agSS_ === 'function' ? agSS_() : null, sh = ss && ss.getSheetByName('LenhNhanh');
    if (sh) {
      var b = bang_('LenhNhanh', ss);
      b.rows.forEach(function (r) {
        var tl = String(r[b.c.TraLoi] || '').trim();
        var goi = String(r[b.c.CachGoi] || '').split(/[;\n|]/).map(function (g) { return khongDau_(g.toLowerCase().replace(/[?!.]+$/, '').trim()); })
          .filter(function (g) { return g.length >= 2; });
        if (tl && goi.length) ds.push({ goi: goi, tl: tl });
      });
    }
  } catch (e) { /* chưa cài Công ty Agent */ }
  C.put('lenhNhanh', JSON.stringify(ds), 600);
  return ds;
}

/** Chạy 1 lần: tạo tab LenhNhanh (có vài dòng mẫu) trong sheet Công ty Agent. Chạy lại không ghi đè. */
function caiDatLenhNhanh() {
  var ss = typeof agSS_ === 'function' ? agSS_() : null;
  if (!ss) throw new Error('Chạy caiDatAgent trước (cần sheet "Trợ lý – Công ty Agent").');
  var sh = ss.getSheetByName('LenhNhanh');
  if (!sh) {
    sh = ss.insertSheet('LenhNhanh');
    sh.getRange(1, 1, 1, 3).setValues([['CachGoi', 'TraLoi', 'GhiChu']]);
    sh.getRange(2, 1, 4, 3).setValues([
      ['chào buổi sáng; tình hình hôm nay', '=bc', 'Dấu = : chạy câu lệnh khác (miễn phí)'],
      ['tuần này thế nào; tổng kết tuần', '=tuần', ''],
      ['xưởng yếu nhất', '=xưởng nào thấp nhất 7 ngày qua', 'Có thể ghép chủ đề + thời gian'],
      ['quy trình báo hỏng máy', 'Báo tổ bảo trì qua nhóm Zalo, ghi số máy và hiện tượng; tổ trưởng xác nhận trong ngày.', 'Câu trả lời cố định – sửa theo thực tế']
    ]);
    sh.setFrozenRows(1);
    sh.setColumnWidth(1, 280); sh.setColumnWidth(2, 380); sh.setColumnWidth(3, 260);
  }
  CacheService.getScriptCache().remove('lenhNhanh');
  Logger.log('Tab LenhNhanh: ' + ss.getUrl());
  return ss.getUrl();
}

/* ============================ TRẢ LỜI ============================ */

function lnPt_(p) { return p == null ? 'chưa tính được' : Math.round(p) + '%'; }
function lnNgan_(T, x) { return lnTen_(T, x).replace(/^Xưởng /, ''); }
function lnTen_(T, x) { return String(T.tenXuong[x] || x); }

/** Kỳ trước cùng độ dài để so sánh. */
function lnKyTruoc_(tg) {
  var n = Math.round((Date.parse(tg.den) - Date.parse(tg.tu)) / 864e5) + 1;
  return n === 1 ? { tu: congNgay_(tg.tu, -14), den: congNgay_(tg.tu, -1), ten: 'trung bình 14 ngày trước' }
    : { tu: congNgay_(tg.tu, -n), den: congNgay_(tg.tu, -1), ten: n + ' ngày trước đó' };
}
function lnSoVoi_(p, q, ten) {
  if (p == null || q == null) return '';
  var d = Math.round(p - q);
  return d === 0 ? ' Ngang ' + ten + '.' : (d > 0 ? ' Cao hơn ' : ' Thấp hơn ') + ten + ' ' + Math.abs(d) + ' điểm (' + Math.round(q) + '%).';
}

function lnNhaMay_(D, T, tg, xepHang) {
  var H = tongHop_(D, T, tg.tu, tg.den), t = tong_(H.X), q = lnKyTruoc_(tg), tq = tong_(tongHop_(D, T, q.tu, q.den).X);
  if (!t.mau) return 'Chưa có số liệu sản xuất ' + tg.ten + '.';
  var xs = Object.keys(H.X).filter(function (k) { return H.X[k].mau && pt_(H.X[k]) != null; })
    .sort(function (a, b) { return pt_(H.X[b]) - pt_(H.X[a]); });
  var cau = xepHang && xs.length > 1
    ? 'Sản xuất ' + tg.ten + ': cao nhất là ' + lnTen_(T, xs[0]) + ' ' + lnPt_(pt_(H.X[xs[0]])) + ', thấp nhất là ' + lnTen_(T, xs[xs.length - 1]) + ' ' + lnPt_(pt_(H.X[xs[xs.length - 1]])) + '. Toàn nhà máy ' + lnPt_(pt_(t)) + '.'
    : 'Hiệu suất toàn nhà máy ' + tg.ten + ' là ' + lnPt_(pt_(t)) + ', ' + Object.keys(t.nguoi).length + ' người làm, máy dừng ' + gio_(t.dung) + '.' + lnSoVoi_(pt_(t), pt_(tq), q.ten);
  return cau + '\n\n' + xs.map(function (k, i) {
    var o = H.X[k];
    return (i + 1) + '. ' + lnTen_(T, k) + ': ' + lnPt_(pt_(o)) + ' · ' + Object.keys(o.nguoi).length + ' người' + (o.dung ? ' · dừng ' + gio_(o.dung) : '');
  }).join('\n') + (t.cho ? '\n⚠ Còn ' + t.cho + ' dòng chờ duyệt chưa tính.' : '');
}

function lnXuongHs_(D, T, tg, x) {
  var o = tongHop_(D, T, tg.tu, tg.den).X[x], q = lnKyTruoc_(tg), oq = tongHop_(D, T, q.tu, q.den).X[x];
  var ten = T.tenXuong[x] || x;
  if (!o || !o.mau) return ten + ' chưa có số liệu sản xuất ' + tg.ten + '.';
  var cl = o.sl > 0 && o.loi > 0 ? ', đạt chất lượng ' + soNoiLn_((o.sl - o.loi) / o.sl * 100) + '%' : '';
  return ten + ' ' + tg.ten + ': hiệu suất ' + lnPt_(pt_(o)) + ', ' + Object.keys(o.nguoi).length + ' người' + (o.dung ? ', máy dừng ' + gio_(o.dung) : '') + cl + '.' +
    lnSoVoi_(pt_(o), oq && pt_(oq), q.ten) +
    (o.cho ? '\n\n⚠ Còn ' + o.cho + ' dòng chờ duyệt chưa tính.' : '') +
    (Object.keys(o.chuaKhai).length ? '\n⚠ ' + Object.keys(o.chuaKhai).length + ' lượt đi làm chưa có sản lượng đã chốt.' : '');
}

function lnNguoiHs_(D, T, tg, nv) {
  var g = nhomMoi_(), ngay = 0;
  ngayCong_(D, T, tg.tu, tg.den).forEach(function (o) { if (o.nv === nv) { congVao_(g, o); ngay++; } });
  var ten = D.nvTen[nv] || nv, x = D.nvXuong[nv];
  if (!ngay) return ten + ' (' + (T.tenXuong[x] || x) + ') không có ngày công ' + tg.ten + '.';
  return ten + ' (' + (T.tenXuong[x] || x) + ') ' + tg.ten + ': hiệu suất ' + lnPt_(pt_(g)) + ', ' + ngay + ' ngày công, ' +
    so0_(g.sl) + ' sản phẩm' + (g.loi ? ', ' + so0_(g.loi) + ' lỗi KCS' : '') + (g.dung ? ', dừng ' + gio_(g.dung) : '') + '.' +
    (Object.keys(g.chuaKhai).length ? '\n\n⚠ ' + Object.keys(g.chuaKhai).length + ' ngày đi làm chưa có sản lượng đã chốt.' : '');
}

function lnDung_(D, T, tg, x) {
  var H = tongHop_(D, T, tg.tu, tg.den), L = {};
  Object.keys(H.dungLyDo).forEach(function (ly) {
    var g = x ? (H.dungLyDo[ly].xuong[x] || 0) : H.dungLyDo[ly].gio;
    if (g > 0) L[ly] = g;
  });
  var ds = Object.keys(L).sort(function (a, b) { return L[b] - L[a]; }), tong = ds.reduce(function (s, k) { return s + L[k]; }, 0);
  var noi = x ? T.tenXuong[x] + ' ' : '';
  if (!ds.length) return noi + (noi ? 'không' : 'Không') + ' có giờ dừng máy ' + tg.ten + '.';
  return (noi ? noi : 'Máy ') + 'dừng tổng cộng ' + gio_(tong) + ' ' + tg.ten + ', nhiều nhất do ' + ds[0] + ' (' + gio_(L[ds[0]]) + ')' +
    (ds[1] ? ', tiếp theo là ' + ds[1] + ' (' + gio_(L[ds[1]]) + ')' : '') + '.\n\n' +
    ds.slice(0, 8).map(function (k) {
      var xs = x ? '' : ' (' + Object.keys(H.dungLyDo[k].xuong).sort(function (a, b) { return H.dungLyDo[k].xuong[b] - H.dungLyDo[k].xuong[a]; })
        .slice(0, 2).map(function (m) { return lnNgan_(T, m) + ' ' + gio_(H.dungLyDo[k].xuong[m]); }).join(', ') + ')';
      return '• ' + k + ': ' + gio_(L[k]) + xs;
    }).join('\n');
}

function lnNghi_(D, tg) {
  var tong = 0, muon = 0, ly = {}, soNgay = 0;
  for (var d = tg.tu; d <= tg.den; d = congNgay_(d, 1)) {
    var n = nghiNgay_(D, d);
    if (n.tong || n.muon) soNgay++;
    tong += n.tong; muon += n.muon;
    String(n.chiTiet || '').split(', ').forEach(function (s) { var m = s.match(/^(.*) (\d+)$/); if (m) ly[m[1]] = (ly[m[1]] || 0) + Number(m[2]); });
  }
  var mot = tg.tu === tg.den;
  if (!tong && !muon) return 'Chưa có ai báo nghỉ ' + tg.ten + (mot ? ' – có thể các xưởng chưa điểm danh.' : '.');
  var ct = Object.keys(ly).sort(function (a, b) { return ly[b] - ly[a]; }).map(function (k) { return k + ' ' + ly[k]; }).join(', ');
  return (mot ? 'Có ' + tong + ' người nghỉ ' + tg.ten : 'Tổng ' + tong + ' lượt nghỉ ' + tg.ten + ' (' + soNgay + ' ngày có người nghỉ)') +
    (ct ? ', gồm ' + ct : '') + '.' + (muon ? ' ' + muon + (mot ? ' người' : ' lượt') + ' đi muộn hoặc làm nửa ngày.' : '');
}

function lnKcs_(D, T, tg, x) {
  var b = D.PhieuKCS, c = b.c, tong = 0, X = {}, L = {};
  b.rows.forEach(function (r) {
    var d = ngay_(r[c.Ngay]);
    if (!d || d < tg.tu || d > tg.den) return;
    var n = so_(r[c.SoLuongKhongDat]); if (!n) return;
    var xx = xuongCua_(T, D, String(r[c.MaCD]).trim(), String(r[c.MaNV]).trim());
    if (x && xx !== x) return;
    tong += n; X[xx] = (X[xx] || 0) + n;
    var ml = String(r[c.MaLoi]).trim();
    if (ml) L[ml] = (L[ml] || 0) + n;
  });
  var noi = x ? T.tenXuong[x] + ' ' : '';
  if (!tong) return (noi || 'KCS ') + 'không ghi nhận sản phẩm không đạt ' + tg.ten + '.';
  var ls = Object.keys(L).sort(function (a, b) { return L[b] - L[a]; });
  return (noi || 'KCS ') + 'ghi nhận ' + so0_(tong) + ' sản phẩm không đạt ' + tg.ten + (ls.length ? ', lỗi nhiều nhất là ' + (T.tenLoi[ls[0]] || ls[0]) + ' (' + so0_(L[ls[0]]) + ')' : '') + '.\n\n' +
    (x ? '' : 'Theo xưởng: ' + Object.keys(X).sort(function (a, b) { return X[b] - X[a]; }).map(function (m) { return lnNgan_(T, m) + ' ' + so0_(X[m]); }).join(', ') + '\n') +
    (ls.length ? 'Theo lỗi: ' + ls.slice(0, 6).map(function (m) { return (T.tenLoi[m] || m) + ' ' + so0_(L[m]); }).join(', ') : '');
}

function lnChoDuyet_(D, T, tg, x) {
  var I = chiMuc_(D, T), X = {}, cu = '', n = 0;
  I.cho.forEach(function (r) {
    if (r.d < tg.tu || r.d > tg.den || (x && r.x !== x)) return;
    n++; X[r.x] = (X[r.x] || 0) + 1;
    if (!cu || r.d < cu) cu = r.d;
  });
  if (!n) return 'Không còn dòng sản lượng nào chờ duyệt ' + tg.ten + (x ? ' ở ' + T.tenXuong[x] : '') + '.';
  return 'Còn ' + n + ' dòng sản lượng chờ duyệt ' + tg.ten + ', cũ nhất từ ngày ' + Number(cu.slice(8)) + ' tháng ' + Number(cu.slice(5, 7)) + '.\n\n' +
    Object.keys(X).sort(function (a, b) { return X[b] - X[a]; }).map(function (m) { return '• ' + lnTen_(T, m) + ': ' + X[m]; }).join('\n');
}

function lnDiemDanh_(D, T, tg) {
  var ds = chuaDiemDanh_(D, T, tg.den);
  return ds.length ? 'Ngày ' + Number(tg.den.slice(8)) + ' tháng ' + Number(tg.den.slice(5, 7)) + ' còn ' + ds.length + ' xưởng chưa xác nhận điểm danh: ' + ds.join(', ') + '.'
    : 'Các xưởng đã xác nhận điểm danh đủ ngày ' + Number(tg.den.slice(8)) + ' tháng ' + Number(tg.den.slice(5, 7)) + '.';
}

function lnBaoTri_(D, T, hn) {
  var ds = baoTri_(D, T, hn);
  if (!ds.length) return 'Không có máy nào đến hạn hoặc quá hạn bảo trì trong 7 ngày tới.';
  var qua = ds.filter(function (s) { return /QUÁ HẠN/.test(s); }).length;
  return 'Có ' + ds.length + ' máy cần bảo trì trong 7 ngày tới' + (qua ? ', trong đó ' + qua + ' máy đã quá hạn' : '') + '.\n\n' + ds.map(function (s) { return '• ' + s; }).join('\n');
}

function lnLich_(k) {
  if (typeof CalendarApp === 'undefined') return '';
  var hn = homNay_(), mai = /ngay mai/.test(k), d = mai ? congNgay_(hn, 1) : hn;
  var bd = gioVNLn_(d, 0), kt = gioVNLn_(d, 24);
  var ev = CalendarApp.getDefaultCalendar().getEvents(bd, kt);
  var ten = mai ? 'ngày mai' : 'hôm nay';
  if (!ev.length) return 'Lịch ' + ten + ' trống, không có cuộc họp nào.';
  return 'Lịch ' + ten + ' có ' + ev.length + ' việc: ' + ev.slice(0, 6).map(function (e) {
    var h = Utilities.formatDate(e.getStartTime(), TZ, 'HH:mm').split(':');
    return Number(h[0]) + ' giờ' + (h[1] === '00' ? '' : ' ' + Number(h[1])) + ' ' + e.getTitle() + (e.getLocation && e.getLocation() ? ' tại ' + e.getLocation() : '');
  }).join('; ') + '.';
}
function gioVNLn_(ymd, h) { var p = ymd.split('-').map(Number); return new Date(Date.UTC(p[0], p[1] - 1, p[2], h - 7, 0)); }

function lnGio_() {
  var n = new Date(), hn = homNay_(), p = hn.split('-');
  var g = Utilities.formatDate(n, TZ, 'HH:mm').split(':');
  return 'Bây giờ là ' + Number(g[0]) + ' giờ ' + (g[1] === '00' ? 'đúng' : Number(g[1]) + ' phút') + ', ' + tenNgay_(hn).replace(/ \d.*$/, '').toLowerCase() +
    ', ngày ' + Number(p[2]) + ' tháng ' + Number(p[1]) + ' năm ' + p[0] + '.';
}

function soNoiLn_(x) { return String(Math.round(x * 10) / 10).replace('.', ','); }

function lnDanhSach_() {
  return 'Các câu hỏi trả lời ngay, không tốn tiền AI: báo cáo, tuần, việc, hiệu suất, xưởng nào thấp nhất, dừng máy, ai nghỉ, lỗi KCS, chờ duyệt, điểm danh, bảo trì, lịch, mấy giờ.\n\n' + [
    '• bc · bc 15/10 · tuần · việc · xong 5',
    '• hiệu suất hôm qua / tuần này / tháng trước',
    '• hiệu suất xưởng Ngọn 7 ngày qua · hiệu suất <họ tên công nhân> tháng này',
    '• xưởng nào thấp nhất hôm qua',
    '• dừng máy tuần này · xưởng CNC dừng máy hôm qua',
    '• hôm nay ai nghỉ · nghỉ tháng này',
    '• lỗi KCS hôm qua · chất lượng xưởng Ngọn tuần này',
    '• còn bao nhiêu dòng chờ duyệt · chưa điểm danh',
    '• máy nào sắp bảo trì',
    '• lịch hôm nay · lịch ngày mai · mấy giờ rồi',
    'Thêm câu của riêng bạn: tab LenhNhanh trong sheet "Trợ lý – Công ty Agent".',
    'Có chữ "vì sao, phân tích, so sánh, viết…" → chuyển cho AI (tính phí).'
  ].join('\n');
}
