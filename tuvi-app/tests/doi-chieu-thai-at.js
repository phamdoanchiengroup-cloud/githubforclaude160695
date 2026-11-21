/**
 * Đối chiếu Thái Ất (ThaiAt.gs) với ca sinh từ kintaiyi 0.2.3 (MIT – kentang2017): tests/du-lieu/thai-at-doi-chieu.json
 * (sinh bằng tools/thai-at/sinh-doi-chieu.py trong virtualenv riêng; không chép mã thư viện vào dự án).
 * Báo tỷ lệ khớp từng trường. Chỗ ta CỐ Ý khác (quyết định chủ dự án 21/11) và lỗi bảng của kintaiyi (đề xuất mục 4c)
 * là "khác biệt đã biết": mỗi chỗ phải khớp đúng luật mô phỏng kintaiyi ghi dưới đây, nếu không thì tính là lỗi.
 *   K1 ranh năm Tuế kế: ta Lập xuân, kintaiyi năm âm lịch (Tết) → giữa Tết và Lập xuân tích ta = tích kintaiyi − 1.
 *   K2 ranh tháng Nguyệt kế: ta tháng tiết, kintaiyi tháng âm (tháng nhuận tính như tháng thường).
 *   K3 âm/dương độn Thời kế quanh Đông chí/Hạ chí: hàm jq() của kintaiyi trả tiết KẾ TIẾP của thời điểm 7 ngày trước
 *      (và đọc giờ nhập như giờ UTC) → đổi độn sớm khoảng 7 ngày. Ta đổi đúng giờ chí (giờ VN).
 *   K4 Kế Thần âm độn: kintaiyi 0.2.3 luôn khởi Dần; ta khởi Thân (bảng Thủy Kích của chính kintaiyi chỉ khớp khi khởi Thân).
 *   K5 Thủy Kích cục 30 và 66: bảng sf_list của kintaiyi gõ Sửu, quy tắc ra Thân (Khách toán, tướng khách kéo theo).
 *   K6 Toán khi ô khởi trùng cung Thái Ất: ta lấy số cung Thái Ất (Kim Kính), kintaiyi ra 0 hoặc 1.
 *   K7 Đại tướng: ta toán 10/20/30/40 → 1 (Kim Kính); kintaiyi → 5, và chủ toán 1 → lấy cung Thái Ất.
 *   K8 Quân Cơ: kintaiyi chia nguyên không trừ 1 → lệch một chi khi (tích + 250) chia hết cho 30.
 *   K9 Ngũ Phúc: kintaiyi 0.2.3 đánh khóa bảng từ 1 → lệch một cung (dư 0 rơi Trung).
 *   K10 Đại Du, Tiểu Du: hàm bigyo/smyo của kintaiyi đảo bảng chỉ số (chu kỳ 388, lấy dư lẫn lộn) – ta theo chu kỳ 288 và 24.
 * Chạy: node tests/doi-chieu-thai-at.js
 */
const fs = require('fs'), path = require('path');
const { ctx } = require(path.join(__dirname, '..', 'tools', 'gia-lap.js'));
const J = JSON.parse(fs.readFileSync(path.join(__dirname, 'du-lieu', 'thai-at-doi-chieu.json'), 'utf8'));
const O = ctx.TA_O, CO = ctx.TA_CUNG_O, OC = ctx.TA_O_CUNG, CHI_O = ctx.TA_CHI_O;
const mod = (x, m) => ((x % m) + m) % m;

const TRUONG = ['T', 'cuc', 'don', 'ty', 'vx', 'tk', 'ke_', 'hop', 'tue', 'dm', 'cc', 'kc', 'dc', 'cd', 'ct', 'kd', 'kt', 'dd', 'dt',
  'quan', 'than', 'dan', 'tu', 'tat', 'dat', 'tp', 'np', 'ddu', 'tdu'];
const TEN = { T: 'tích số', cuc: 'cục', don: 'âm/dương độn', ty: 'Thái Ất', vx: 'Văn Xương', tk: 'Thủy Kích', ke_: 'Kế Thần', hop: 'Hợp Thần',
  tue: 'Thái Tuế', dm: 'Định Mục', cc: 'Chủ toán', kc: 'Khách toán', dc: 'Định toán', cd: 'Chủ đại tướng', ct: 'Chủ tham tướng',
  kd: 'Khách đại tướng', kt: 'Khách tham tướng', dd: 'Định đại tướng', dt: 'Định tham tướng', quan: 'Quân Cơ', than: 'Thần Cơ',
  dan: 'Dân Cơ', tu: 'Tứ Thần', tat: 'Thiên Ất', dat: 'Địa Ất', tp: 'Trực Phù', np: 'Ngũ Phúc', ddu: 'Đại Du', tdu: 'Tiểu Du' };
const bang = {}; TRUONG.forEach(f => { bang[f] = { tong: 0, khop: 0, biet: {}, loi: 0, mau: [] }; });
const nhomBiet = {}; let loiNhom = 0;
function demBiet(k) { nhomBiet[k] = (nhomBiet[k] || 0) + 1; }

function taMa(b) {
  const t = b.than, c = b.toan;
  return { T: b.tich, cuc: b.cuc, don: b.don === 'duong' ? 'd' : 'a', ty: b.thaiAt.cung, vx: t.van_xuong.o, tk: t.thuy_kich.o, ke_: t.ke_than.o,
    hop: t.hop_than.o, tue: t.thai_tue.o, dm: t.dinh_muc.o, cc: c.chu.so, kc: c.khach.so, dc: c.dinh.so,
    cd: c.chu.daiTuong, ct: c.chu.thamTuong, kd: c.khach.daiTuong, kt: c.khach.thamTuong, dd: c.dinh.daiTuong, dt: c.dinh.thamTuong,
    quan: t.quan_co.o, than: t.than_co.o, dan: t.dan_co.o, tu: t.tu_than.o, tat: t.thien_at.o, dat: t.dia_at.o, tp: t.truc_phu.o,
    np: t.ngu_phuc.o, ddu: OC[t.dai_du.o], tdu: OC[t.tieu_du.o] };
}
// Mô phỏng kintaiyi 0.2.3 cho các khác biệt đã biết
const kTham = d => (d * 3) % 10 || 5;
const kTuong = (ben, s, ty) => ben === 'dinh' ? (s % 10 || 5) : s === 1 ? (ben === 'chu' ? ty : 1) : s < 10 ? s : (s % 10 || 5);
function kDaiDu(T) {
  let b = (T + 34) % 388; if (b > 36) b = b / 36;
  return { 7: 1, 8: 2, 9: 3, 1: 4, 2: 5, 3: 6, 4: 7, 6: 8 }[Math.floor(b)] || 5;
}
function kTieuDu(T) {
  let s = T % 360; if (s < 24) s = s % 3; if (s > 24) { s = s % 24; if (s > 3) s = s % 3; }
  return { 1: 1, 2: 2, 3: 3, 4: 4, 6: 5, 7: 6, 8: 7, 9: 8 }[Math.floor(s)] || 5;
}

function soSanh(x, ta, nhan) {
  const k = x, ty = ta.ty, luat = {};
  const tkK = k.tk, oTy = CO[ty];
  luat.ke_ = ta.don === 'a' ? [['K4', CHI_O[mod(2 - (ta.cuc - 1) % 12, 12)]]] : [];
  luat.tk = ta.cuc % 36 === 30 ? [['K5', 1]] : [];
  const toanK = (o) => ctx.taToan_(o, ty);
  luat.cc = ta.vx === oTy ? [['K6', 0], ['K6', 1]] : [];
  luat.kc = [];
  if (tkK !== ta.tk) luat.kc.push(['K5', toanK(tkK)]);
  if (ta.tk === oTy) luat.kc.push(['K6', 0], ['K6', 1]);
  luat.dc = ta.dm === oTy ? [['K6', 0], ['K6', 1]] : [];
  [['cc', 'cd', 'ct', 'chu'], ['kc', 'kd', 'kt', 'khach'], ['dc', 'dd', 'dt', 'dinh']].forEach(([fs, fd, ft, ben]) => {
    const sK = k[fs], dK = kTuong(ben, sK, ty), kn = sK === ta[fs] ? 'K7' : 'K5/K6 kéo theo';
    luat[fd] = [[kn, dK]];
    luat[ft] = [[k[fd] === ta[fd] ? 'K7' : kn, kTham(k[fd])]];
  });
  luat.quan = [['K8', CHI_O[(6 + Math.floor(((ta.T + 250) % 360) / 30)) % 12]]];
  luat.np = [['K9', [16, 14, 2, 6, 10][Math.floor(((ta.T + 250) % 225) / 45)]]];
  luat.ddu = [['K10', kDaiDu(ta.T)]];
  luat.tdu = [['K10', kTieuDu(ta.T)]];
  TRUONG.forEach(f => {
    const b = bang[f]; b.tong++;
    if (k[f] === ta[f]) { b.khop++; return; }
    const r = (luat[f] || []).find(([, v]) => v === k[f]);
    if (r) { b.biet[r[0]] = (b.biet[r[0]] || 0) + 1; return; }
    b.loi++; if (b.mau.length < 3) b.mau.push(nhan + ' ta ' + ta[f] + ' / kintaiyi ' + k[f]);
  });
}

J.ca.forEach(x => {
  const [y, m, d, h] = x.t, nhan = x.ke + ' ' + d + '/' + m + '/' + y + ' ' + h + 'h';
  const b = ctx.taLap_({ ke: x.ke, day: d, month: m, year: y, hour: h, minute: 0 });
  if (x.nhom === 'ranh_nam') {                                   // K1
    const dung = x.T === 10153917 + x.am[0] && (b.tich === x.T || b.tich === x.T - 1);
    if (!dung) { loiNhom++; console.log('✗ K1 sai luật:', nhan, b.tich, x.T); } else if (b.tich !== x.T) demBiet('K1 ranh năm (Tết ≠ Lập xuân)'); else demBiet('K1 (ca trùng, không lệch)');
    return;
  }
  if (x.nhom === 'ranh_thang') {                                 // K2
    const dung = x.T === (10153917 + x.am[0] - 1) * 12 + 2 + x.am[1];
    if (!dung) { loiNhom++; console.log('✗ K2 sai luật:', nhan, b.tich, x.T); } else if (b.tich !== x.T) demBiet('K2 ranh tháng (tháng âm ≠ tháng tiết)'); else demBiet('K2 (ca trùng, không lệch)');
    return;
  }
  let ta = taMa(b);
  if (x.ke === 'gio' && ta.don !== x.don) {                      // K3: kintaiyi đổi độn sớm 7 ngày, giờ nhập đọc như UTC
    const jdUtc = ctx.jdFromDate(d, m, y) - 0.5 + h / 24, L = ctx.kmKinhDoMatTroi_(jdUtc - 7);
    const kDuong = L >= 255 || L < 75;
    if ((kDuong ? 'd' : 'a') !== x.don) { loiNhom++; console.log('✗ K3 lệch độn không theo luật kintaiyi:', nhan); return; }
    demBiet('K3 độn trong 7 ngày trước Hạ chí/Đông chí (so tiếp bằng độn của kintaiyi)');
    ta = taMa(ctx.taBan_(b.tich, x.don === 'd', b.thaiTue.chi));
  }
  soSanh(x, ta, nhan);
});

let loi = loiNhom;
console.log('Đối chiếu Thái Ất với kintaiyi 0.2.3 – ' + J.ca.length + ' ca (' + bang.T.tong + ' ca so đủ trường)');
TRUONG.forEach(f => {
  const b = bang[f], biet = Object.keys(b.biet).map(k => k + ': ' + b.biet[k]).join(', ');
  if (b.loi) loi++;
  console.log((b.loi ? '✘ ' : '✔ ') + TEN[f].padEnd(17) + ' khớp ' + b.khop + '/' + b.tong + ' (' + (100 * b.khop / b.tong).toFixed(1) + '%)' +
    (biet ? '  | khác biệt đã biết ' + biet : '') + (b.loi ? '  | LỖI ' + b.loi + ': ' + b.mau.join(' ; ') : ''));
});
Object.keys(nhomBiet).forEach(k => console.log('  · ' + k + ': ' + nhomBiet[k] + ' ca'));
console.log('Nguồn ca kiểm: kintaiyi (MIT) – kentang2017');
process.exit(loi ? 1 : 0);
