/**
 * Kiểm thử Thái Ất (ThaiAt.gs): thuộc tính bất biến, biên Lập xuân / Đông chí / Hạ chí, ca mẫu mục 5 của
 * nghien-cuu/thai-at/00-de-xuat.md, mệnh pháp, vận năm cá nhân, hỏi việc theo giờ.
 * Đối chiếu kintaiyi ở tests/doi-chieu-thai-at.js. Chạy: node tests/thai-at.js
 */
const path = require('path');
const { ctx } = require(path.join(__dirname, '..', 'tools', 'gia-lap.js'));
let ok = 0, sai = 0; const loi = {};
function kt(dk, msg, nhom) {
  if (dk) { ok++; return; }
  sai++; nhom = nhom || msg; loi[nhom] = (loi[nhom] || 0) + 1;
  if (loi[nhom] <= 3) console.log('✗', msg);
}
const O = ctx.TA_O, ten = o => O[o];
const gon = b => JSON.stringify({ tich: b.tich, cuc: b.cuc, don: b.don, thaiAt: b.thaiAt, toan: b.toan, than: b.than, cach: b.cach, soSanh: b.soSanh });

// 1. Bất biến trên 72 × 2 cục (và tích lớn)
[true, false].forEach(duong => {
  for (let T = 1; T <= 720; T++) {
    const b = ctx.taBan_(T, duong, (T - 1) % 12), nh = (duong ? 'dương ' : 'âm ') + T;
    kt(b.cuc >= 1 && b.cuc <= 72 && b.cuc === ((T - 1) % 72) + 1, nh + ': cục ngoài 1–72', 'cục');
    kt([1, 2, 3, 4, 6, 7, 8, 9].indexOf(b.thaiAt.cung) >= 0, nh + ': Thái Ất vào cung giữa / sai', 'Thái Ất');
    kt(b.thaiAt.namThu >= 1 && b.thaiAt.namThu <= 3, nh + ': năm thứ', 'năm thứ');
    ['chu', 'khach', 'dinh'].forEach(k => {
      const t = b.toan[k];
      kt(t.so >= 1 && t.so <= 40, nh + ': toán ' + k + ' = ' + t.so, 'toán 1–40');
      kt(t.daiTuong >= 1 && t.daiTuong <= 9 && t.daiTuong === (t.so % 10 || 1), nh + ': đại tướng ' + k, 'đại tướng');
      kt(t.thamTuong === ((t.daiTuong * 3) % 10 || 5), nh + ': tham tướng ' + k, 'tham tướng');
    });
    ctx.TA_THAN_THU_TU.forEach(ma => {
      const o = b.than[ma].o;
      kt(o >= 0 && o <= 16, nh + ': ' + ma + ' ngoài bàn', 'vị trí hợp lệ');
      if (['van_xuong', 'thuy_kich', 'dinh_muc', 'thai_tue', 'ke_than', 'hop_than', 'quan_co', 'than_co', 'dan_co'].indexOf(ma) >= 0) kt(o < 16, nh + ': ' + ma + ' rơi cung giữa', 'không vào giữa');
    });
    kt(b.o.length === 17 && b.o.reduce((s, x) => s + x.than.length, 0) === ctx.TA_THAN_THU_TU.length, nh + ': 17 ô', '17 ô');
    kt(b.cach.every(c => ctx.TA_CACH[c.ma] && ['cat', 'hung', 'trung'].indexOf(c.muc) >= 0), nh + ': mã cách lạ', 'mã cách');
    const cau = b.cach.filter(c => c.so == null && c.ma !== 'hoa_thuan');
    kt(b.cach.some(c => c.ma === 'hoa_thuan') === !cau.some(c => c.muc === 'hung'), nh + ': hòa thuận khi không có cách xấu', 'hòa thuận');
    kt(['chu_ro', 'chu', 'giang_co', 'khach', 'khach_ro'].indexOf(b.soSanh.nghieng) >= 0, nh + ': nghiêng', 'nghiêng');
  }
});
// Kế Thần khởi Dần (dương) / Thân (âm), Hợp Thần lục hợp, Thái Tuế = chi thứ r1(cục, 12)
kt(ten(ctx.taBan_(1, true, 0).than.ke_than.o) === 'Dần' && ten(ctx.taBan_(1, false, 0).than.ke_than.o) === 'Thân', 'Kế Thần khởi Dần/Thân');
kt(ten(ctx.taBan_(4, true, 3).than.hop_than.o) === 'Tuất', 'Hợp Thần Mão ↔ Tuất');
// Toán: ví dụ sách Kim Kính – Thái Ất cung 9, Văn Xương ở Hợi → 1 + 8 + 3 + 4 = 16
kt(ctx.taToan_(15, 9) === 16, 'Ví dụ Kim Kính: toán 16');

// 2. Cùng tích → cùng bàn; cùng cục → cùng lõi
{
  const a = ctx.taLap_({ ke: 'gio', day: 3, month: 4, year: 2025, hour: 1, minute: 5 }), b = ctx.taLap_({ ke: 'gio', day: 3, month: 4, year: 2025, hour: 2, minute: 55 });
  kt(a.tich === b.tich && gon(a) === gon(b), 'Cùng giờ Sửu → cùng tích, cùng bàn');
  kt(gon(a) === gon(ctx.taBan_(a.tich, true, a.thaiTue.chi)), 'taLap_ = taBan_(tích)');
  const t1 = ctx.taLap_({ ke: 'nam', year: 2026 }), t2 = ctx.taLap_({ ke: 'nam', day: 10, month: 10, year: 2026, hour: 9 });
  kt(gon(t1) === gon(t2), 'Tuế kế: chỉ năm = có ngày');
  const c1 = ctx.taBan_(55, true, 6), c2 = ctx.taBan_(55 + 72 * 7, true, 6);
  kt(JSON.stringify([c1.thaiAt, c1.toan, c1.than.van_xuong, c1.than.thuy_kich]) === JSON.stringify([c2.thaiAt, c2.toan, c2.than.van_xuong, c2.than.thuy_kich]), 'Cùng cục → cùng Thái Ất, Văn Xương, Thủy Kích, toán');
  // Giờ Tý muộn tính sang hôm sau
  const ty1 = ctx.taLap_({ ke: 'gio', day: 9, month: 5, year: 2025, hour: 23, minute: 30 }), ty2 = ctx.taLap_({ ke: 'gio', day: 10, month: 5, year: 2025, hour: 0, minute: 30 });
  kt(ty1.tich === ty2.tich && ty1.tyMuon && ty1.ngay.ten === ty2.ngay.ten, 'Giờ Tý muộn = giờ Tý ngày hôm sau');
}
// Thái Tuế của kế = chi thứ r1(cục, 12) tính từ Tý (cả 3 kế, 300 thời điểm)
for (let i = 0; i < 300; i++) {
  const y = 1900 + (i * 7) % 200, m = 1 + (i * 5) % 12, d = 1 + (i * 11) % 28, h = (i * 13) % 24;
  ['nam', 'thang', 'gio'].forEach(ke => {
    const b = ctx.taLap_({ ke, day: d, month: m, year: y, hour: h, minute: 0 });
    kt(b.thaiTue.chi === (b.cuc - 1) % 12, ke + ' ' + d + '/' + m + '/' + y + ': Thái Tuế ≠ chi theo cục', 'Thái Tuế theo cục');
    if (ke !== 'gio') kt(b.don === 'duong', ke + ': Tuế/Nguyệt kế luôn dương', 'dương độn');
  });
}
// Thời kế: 6 ngày liền = đủ 72 cục; ngày Giáp Tý giờ Tý = cục 1
{
  const seen = {}; let d0 = null;
  for (let i = 0; i < 6; i++) for (let h = 0; h < 24; h += 2) {
    const dt = new Date(Date.UTC(2024, 0, 1 + i)), b = ctx.taLap_({ ke: 'gio', day: dt.getUTCDate(), month: dt.getUTCMonth() + 1, year: dt.getUTCFullYear(), hour: h, minute: 10 });
    if (i === 0 && h === 0) d0 = b; seen[b.cuc] = (seen[b.cuc] || 0) + 1;
  }
  kt(d0.ngay.ten === 'Giáp Tý' && d0.cuc === 1, '1/1/2024 0h: Giáp Tý, cục 1');
  kt(Object.keys(seen).length === 72 && Object.values(seen).every(n => n === 1), '6 ngày liền đủ 72 cục, mỗi cục một lần');
}

// 3. Biên Lập xuân, Đông chí, Hạ chí (lệch 2 phút hai bên)
const bien = (tk, phut) => { const x = new Date(Date.UTC(tk.nam, tk.thang - 1, tk.ngay, tk.gio, tk.phut + phut)); return { day: x.getUTCDate(), month: x.getUTCMonth() + 1, year: x.getUTCFullYear(), hour: x.getUTCHours(), minute: x.getUTCMinutes() }; };
[1950, 2000, 2024, 2025, 2026, 2027, 2050, 2099].forEach(y => {
  const ds = ctx.kmTietKhiNam_(y), lx = ds.find(t => t.chiSo === 21), dc = ds.find(t => t.chiSo === 18), hc = ds.find(t => t.chiSo === 6);
  const tr = bien(lx, -2), sa = bien(lx, 2);
  const n1 = ctx.taLap_(Object.assign({ ke: 'nam' }, tr)), n2 = ctx.taLap_(Object.assign({ ke: 'nam' }, sa));
  kt(n1.namTiet === y - 1 && n2.namTiet === y && n2.tich === n1.tich + 1, y + ': ranh năm tại Lập xuân', 'Lập xuân – năm');
  const m1 = ctx.taLap_(Object.assign({ ke: 'thang' }, tr)), m2 = ctx.taLap_(Object.assign({ ke: 'thang' }, sa));
  kt(m1.thangTiet === 12 && m2.thangTiet === 1 && m2.tich === m1.tich + 1 && m2.thangChi === 'Dần', y + ': ranh tháng tại Lập xuân', 'Lập xuân – tháng');
  const g1 = ctx.taLap_(Object.assign({ ke: 'gio' }, bien(dc, -2))), g2 = ctx.taLap_(Object.assign({ ke: 'gio' }, bien(dc, 2)));
  kt(g1.don === 'am' && g2.don === 'duong', y + ': Đông chí đổi sang dương độn', 'Đông chí');
  const h1 = ctx.taLap_(Object.assign({ ke: 'gio' }, bien(hc, -2))), h2 = ctx.taLap_(Object.assign({ ke: 'gio' }, bien(hc, 2)));
  kt(h1.don === 'duong' && h2.don === 'am', y + ': Hạ chí đổi sang âm độn', 'Hạ chí');
});

// 4. Ca mẫu mục 5 của đề xuất
function so(b, mau, nh) {
  const t = b.than, c = b.toan;
  const ta = { tich: b.tich, cuc: (b.don === 'duong' ? 'd' : 'a') + b.cuc, ty: b.thaiAt.cung, vx: ten(t.van_xuong.o), tue: ten(t.thai_tue.o), ke: ten(t.ke_than.o),
    hop: ten(t.hop_than.o), tk: ten(t.thuy_kich.o), dm: ten(t.dinh_muc.o),
    chu: [c.chu.so, c.chu.daiTuong, c.chu.thamTuong], khach: [c.khach.so, c.khach.daiTuong, c.khach.thamTuong], dinh: [c.dinh.so, c.dinh.daiTuong, c.dinh.thamTuong] };
  Object.keys(mau).forEach(k => kt(JSON.stringify(ta[k]) === JSON.stringify(mau[k]), nh + ' ' + k + ': ' + JSON.stringify(ta[k]) + ' ≠ ' + JSON.stringify(mau[k]), 'ca mẫu ' + nh));
}
const NAM = {
  2024: { tich: 10155941, cuc: 'd53', ty: 2, vx: 'Khôn', tue: 'Thìn', ke: 'Tuất', hop: 'Dậu', tk: 'Hợi', dm: 'Dần', chu: [38, 8, 4], khach: [25, 5, 5], dinh: [14, 4, 2] },
  2025: { tich: 10155942, cuc: 'd54', ty: 2, vx: 'Khôn', tue: 'Tỵ', ke: 'Dậu', hop: 'Thân', tk: 'Tý', dm: 'Tốn', chu: [38, 8, 4], khach: [24, 4, 2], dinh: [9, 9, 7] },
  2026: { tich: 10155943, cuc: 'd55', ty: 3, vx: 'Thân', tue: 'Ngọ', ke: 'Thân', hop: 'Mùi', tk: 'Cấn', dm: 'Khôn', chu: [16, 6, 8], khach: [3, 3, 9], dinh: [22, 2, 6] },
  2027: { tich: 10155944, cuc: 'd56', ty: 3, vx: 'Dậu', tue: 'Mùi', ke: 'Mùi', hop: 'Ngọ', tk: 'Thìn', dm: 'Tuất', chu: [15, 5, 5], khach: [34, 4, 2], dinh: [10, 1, 3] },
  1552: { cuc: 'd13' }, 658: { tich: 10154575, cuc: 'd55' }
};
Object.keys(NAM).forEach(y => so(ctx.taLap_({ ke: 'nam', year: +y }), NAM[y], 'Tuế kế ' + y));
// Các thần khác 2024–2027 (Quân, Thần, Dân Cơ, Ngũ Phúc, Đại Du, Tứ Thần, Thiên Ất, Địa Ất, Trực Phù) – vị trí ô
const THAN = {
  2024: 'Sửu Tuất Tý Khôn Mão Dậu Thân Ngọ Tỵ', 2025: 'Sửu Hợi Sửu Khôn Mão Dậu Thân Ngọ Tỵ',
  2026: 'Sửu Hợi Dần Khôn Mão Khôn Dần Cấn Thân', 2027: 'Sửu Hợi Mão Khôn Mão Khôn Dần Cấn Thân'
};
Object.keys(THAN).forEach(y => {
  const b = ctx.taLap_({ ke: 'nam', year: +y });
  const ta = ['quan_co', 'than_co', 'dan_co', 'ngu_phuc', 'dai_du', 'tu_than', 'thien_at', 'dia_at', 'truc_phu'].map(m => ten(b.than[m].o)).join(' ');
  kt(ta === THAN[y], 'Thần năm ' + y + ': ' + ta + ' ≠ ' + THAN[y], 'thần năm');
});
// Cách nổi bật 2024–2027
{
  const c = y => ctx.taLap_({ ke: 'nam', year: y }).cach;
  kt(c(2024).some(x => x.ma === 'bach' && x.ai === 'van_xuong' && x.kieu === 'cung'), '2024: Văn Xương cung bách');
  kt(c(2025).some(x => x.ma === 'bach' && x.ai === 'van_xuong' && x.kieu === 'cung'), '2025: Văn Xương cung bách');
  const c26 = c(2026);
  kt(c26.some(x => x.ma === 'yem') && c26.some(x => x.ma === 'tu' && x.ai === 'khach_dai') && ['toan_doan', 'vo_thien', 'vo_dia'].every(m => c26.some(x => x.ma === m && x.ben === 'khach')), '2026: yểm, khách đại tướng tù, khách toán ngắn/thiếu trời/thiếu đất');
  const c27 = c(2027);
  kt(c27.some(x => x.ma === 'tuong_giua' && x.ben === 'chu') && c27.some(x => x.ma === 'bach' && x.ai === 'khach_dai') && c27.some(x => x.ma === 'vo_nhan' && x.ben === 'dinh'), '2027: tướng chủ ở giữa, khách đại tướng bách, định toán thiếu người');
}
// 5b Nguyệt kế (ngày giữa tháng tiết)
[[15, 11, 2026, { tich: 121871316, cuc: 'd12', ty: 4, vx: 'Thìn', tk: 'Dần', chu: [37, 7, 1], khach: [1, 1, 3], dinh: [4, 4, 2] }],
  [15, 12, 2026, { tich: 121871317, cuc: 'd13', ty: 6, vx: 'Tốn', tk: 'Thìn', chu: [18, 8, 4], khach: [19, 9, 7], dinh: [19, 9, 7] }],
  [15, 2, 2027, { tich: 121871319, cuc: 'd15', ty: 6, vx: 'Ngọ', tk: 'Khôn', chu: [9, 9, 7], khach: [7, 7, 1], dinh: [6, 6, 8] }],
  [15, 7, 2027, { tich: 121871324, cuc: 'd20', ty: 8, vx: 'Dậu', tk: 'Thìn', chu: [7, 7, 1], khach: [26, 6, 8], dinh: [2, 2, 6] }]
].forEach(([d, m, y, mau]) => so(ctx.taLap_({ ke: 'thang', day: d, month: m, year: y }), mau, 'Nguyệt kế ' + d + '/' + m + '/' + y));
// 5c Thời kế
[[1, 1, 2024, 0, 30, 'Giáp Tý', { cuc: 'd1', ty: 1, vx: 'Thân', ke: 'Dần', hop: 'Sửu', tk: 'Khôn', dm: 'Khôn', chu: [7, 7, 1], khach: [13, 3, 9], dinh: [13, 3, 9] }],
  [15, 3, 2025, 10, 0, 'Quý Mùi', { cuc: 'd18', ty: 7, vx: 'Khôn', ke: 'Dậu', hop: 'Thân', tk: 'Tý', dm: 'Tốn', chu: [7, 7, 1], khach: [26, 6, 8], dinh: [11, 1, 3] }],
  [15, 8, 2025, 15, 0, 'Bính Thìn', { cuc: 'a57', ty: 7, vx: 'Thìn', ke: 'Tý', hop: 'Tỵ', tk: 'Tỵ', dm: 'Mùi', chu: [12, 2, 6], khach: [3, 3, 9], dinh: [1, 1, 3] }],
  [21, 11, 2026, 20, 0, 'Kỷ Hợi', { cuc: 'a71', ty: 1, vx: 'Cấn', ke: 'Tuất', hop: 'Mão', tk: 'Tỵ', dm: 'Thân', chu: [31, 1, 3], khach: [16, 6, 8], dinh: [7, 7, 1] }],
  [6, 2, 2027, 8, 0, 'Bính Thìn', { cuc: 'd53', ty: 2, vx: 'Khôn', ke: 'Tuất', hop: 'Dậu', tk: 'Hợi', dm: 'Dần', chu: [38, 8, 4], khach: [25, 5, 5], dinh: [14, 4, 2] }]
].forEach(([d, m, y, h, mi, ngay, mau]) => {
  const b = ctx.taLap_({ ke: 'gio', day: d, month: m, year: y, hour: h, minute: mi }), nh = 'Thời kế ' + d + '/' + m + '/' + y + ' ' + h + 'h';
  kt(b.ngay.ten === ngay, nh + ': ngày ' + b.ngay.ten, 'ca mẫu ngày');
  so(b, mau, nh);
});
kt(ctx.taLap_({ ke: 'gio', day: 15, month: 3, year: 2025, hour: 10 }).cach.some(x => x.ma === 'tu' && x.ai === 'van_xuong'), '15/3/2025 10h: Văn Xương tù Thái Ất');
kt(ctx.taLap_({ ke: 'gio', day: 21, month: 11, year: 2026, hour: 20 }).cach.some(x => x.ma === 'tu' && x.ai === 'chu_dai'), '21/11/2026 20h: chủ đại tướng tù');

// 5. Hỏi việc theo giờ
{
  const b = ctx.taLap_({ ke: 'gio', day: 21, month: 11, year: 2026, hour: 20 });
  ['cong_viec', 'tai_loc', 'tinh_cam', 'di_xa', 'suc_khoe', 'kien_tung', 'thi_cu', 'chung'].forEach(l => ['khach', 'chu'].forEach(v => {
    const d = ctx.taDanhGia_(b, l, v);
    kt(['thuan', 'thuan_dk', 'nen_cho'].indexOf(d.muc) >= 0 && d.vai === v && Array.isArray(d.ly) && d.ly.length > 0 && d.ly.every(x => x.k && typeof x.diem === 'number' && x.ta), l + '/' + v + ': kết quả đánh giá', 'đánh giá');
  }));
  kt(ctx.taDanhGia_(b, 'cong_viec').vai === 'khach', 'Hỏi việc mặc định vai Khách');
  let nem = false; try { ctx.taDanhGia_(b, 'xo_so'); } catch (e) { nem = true; }
  kt(nem, 'Loại việc lạ phải báo lỗi');
  let nem2 = false; try { ctx.taLap_({ ke: 'ngay', day: 1, month: 1, year: 2025 }); } catch (e) { nem2 = true; }
  kt(nem2, 'Nhật kế chưa làm phải báo lỗi');
  // Phân bố 3 mức trên 2.000 giờ: mỗi mức có mặt, "thuận" 15–45%
  const dem = { thuan: 0, thuan_dk: 0, nen_cho: 0 };
  for (let i = 0; i < 2000; i++) { const x = new Date(Date.UTC(2020, 0, 1) + i * 7.3 * 3600e3);
    dem[ctx.taDanhGia_(ctx.taLap_({ ke: 'gio', day: x.getUTCDate(), month: x.getUTCMonth() + 1, year: x.getUTCFullYear(), hour: x.getUTCHours(), minute: 0 }), 'cong_viec').muc]++; }
  kt(dem.thuan > 300 && dem.thuan < 900 && dem.nen_cho > 200 && dem.thuan_dk > 500, 'Phân bố 3 mức: ' + JSON.stringify(dem));
}

// 6. Mệnh pháp và vận năm cá nhân
{
  const s = { day: 15, month: 8, year: 1990, hour: 10, minute: 30, gender: 'nam' }, m = ctx.taMenh_(s);
  kt(m.canChi.nam === 'Canh Ngọ' && m.chieu === 'thuan', 'Mệnh pháp: Canh Ngọ, nam năm dương → thuận');
  // Mệnh: đặt chi tháng Thân lên Ngọ (thuận), giờ Tỵ nằm trên ô Mão; ngày Tý nằm trên ô Tuất
  kt(m.menh.chiTen === 'Mão' && m.thanCung.chiTen === 'Tuất', 'Mệnh ở Mão, Thân ở Tuất: ' + m.menh.chiTen + ' ' + m.thanCung.chiTen);
  kt(new Set(m.cung12.map(c => c.chi)).size === 12 && m.cung12[0].ma === 'menh' && m.cung12[1].chi === (m.menh.chi + 1) % 12, '12 cung đủ, đi thuận');
  const nu = ctx.taMenh_(Object.assign({}, s, { gender: 'nu' }));
  kt(nu.chieu === 'nghich' && nu.cung12[1].chi === (nu.menh.chi + 11) % 12, 'Nữ năm dương → nghịch');
  const tong = m.cung12.reduce((n, c) => n + c.than.length, 0), giua = ctx.TA_THAN_THU_TU.filter(ma => m.banGio.than[ma].o === 16).length;
  kt(tong + giua === ctx.TA_THAN_THU_TU.length, 'Mọi thần của bàn giờ sinh được đặt (trừ cung giữa)');
  kt(['giu_xay', 'xong_pha', 'can_bang'].indexOf(m.theBamSinh.ma) >= 0 && m.han === null, 'Thế bẩm sinh; hạn 10 năm chưa làm');
  const n = ctx.taNamCaNhan_(s, 2027);
  kt(n.namXem === 2027 && n.tuoi === 38 && n.ghep === 'ghep_tcc' && n.ban.cuc === 56, 'Vận năm 2027: tuổi 38, bàn cục 56, ghi rõ cách ghép');
  kt(n.thanVaoCung.length + ctx.TA_THAN_THU_TU.filter(ma => n.ban.than[ma].o === 16).length === ctx.TA_THAN_THU_TU.length, 'Vận năm: mọi thần năm rơi vào một cung');
  kt(['thuan', 'thuan_dk', 'nen_cho'].indexOf(n.danhGia.muc) >= 0 && n.danhGia.vai === 'chu', 'Vận năm: vai Chủ mặc định');
}

console.log((sai ? '✘ ' : '✔ ') + 'Thái Ất: ' + ok + ' đúng, ' + sai + ' sai');
process.exit(sai ? 1 : 0);
