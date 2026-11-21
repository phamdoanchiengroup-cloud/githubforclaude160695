/**
 * Kiểm thử Kỳ Môn Độn Giáp (KyMon.gs, đợt 1a – chỉ phần lập bàn).
 * Đối chiếu với dữ liệu sinh sẵn từ 2 thư viện MIT (tests/du-lieu/ky-mon-doi-chieu.json):
 *   3meta@2.6.0 (lịch lunar-typescript) và bigfishmarquis-qimen@1.0.0. Không chép mã thư viện vào dự án.
 * Khác biệt đã biết, kiểm theo đúng luật ghi dưới đây (đã ghi trong đầu KyMon.gs):
 *   K1. Múi giờ: 3meta tính tiết khí theo giờ Bắc Kinh. Mẫu được sinh bằng tiết khí tại cùng thời điểm vật lý;
 *       nếu để nguyên, 3meta lệch đúng ở các mẫu nằm trong 1 giờ đầu của tiết mới (trường tkGoc).
 *   K2. Ô giữa của lớp Người: (a) tuần thủ ở ô giữa – 3meta cho Trực sử đi từ cung 2, bigfish và dự án đi từ ô 5;
 *       (b) Trực sử rơi ô 5 khi dương độn – 3meta gửi cung 8, bigfish và dự án gửi cung 2 (cả hai độn).
 *       Dự án theo bigfish → so cung Trực sử và lớp cửa với bigfish.
 *   K3. Mã tinh: 3meta đặt nhóm Hợi Mão Mùi ở Thân; dự án và bigfish theo luật chuẩn: ở Tỵ.
 * Chạy: node tests/ky-mon.js
 */
const fs = require('fs'), path = require('path');
const { ctx } = require(path.join(__dirname, '..', 'tools', 'gia-lap.js'));
let ok = 0, sai = 0; const loi = {};
function kt(dk, msg, nhom) {
  if (dk) { ok++; return; }
  sai++; nhom = nhom || msg; loi[nhom] = (loi[nhom] || 0) + 1;
  if (loi[nhom] <= 3) console.log('✗', msg);
}
const J = JSON.parse(fs.readFileSync(path.join(__dirname, 'du-lieu', 'ky-mon-doi-chieu.json'), 'utf8'));
const NGOAI = [1, 2, 3, 4, 6, 7, 8, 9];
function lap(t) {
  return ctx.kmLap_({ year: +t.slice(0, 4), month: +t.slice(4, 6), day: +t.slice(6, 8), hour: +t.slice(8, 10), minute: +t.slice(10, 12) });
}
function maHoa(b) {
  const C = {}; b.cung.forEach(o => { C[o.so] = o; });
  return {
    m: (b.don === 'duong' ? 'd' : 'a') + b.cuc + b.nguyen + b.trucPhu.sao + b.trucPhu.cung + b.trucSu.mon + b.trucSu.cung,
    dia: [1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => C[i].diaBan).join(''),
    o8: NGOAI.map(i => '' + C[i].thienBan[0] + C[i].sao[0] + C[i].mon + C[i].than).join(''),
    C
  };
}

// 1. Đối chiếu từng mẫu
let dem = { mau: 0, K1: 0, K2: 0, K3: 0 };
J.mau.forEach(x => {
  dem.mau++;
  const b = lap(x.t), h = maHoa(b), nh = x.t + (x.n ? ' [' + x.n + ']' : '');
  kt(b.tietKhi.chiSo === x.tk, nh + ': tiết khí ' + b.tietKhi.ten + ' ≠ mẫu ' + x.tk, 'tiết khí');
  kt(ctx.canChiIndex(b.ngay.can, b.ngay.chi) === x.ng, nh + ': can chi ngày ' + b.ngay.ten, 'can chi ngày');
  kt(ctx.canChiIndex(b.gio.can, b.gio.chi) === x.gi, nh + ': can chi giờ ' + b.gio.ten, 'can chi giờ');
  kt(h.m.slice(0, 6) === x.m3.slice(0, 6), nh + ': độn/cục/nguyên/Trực phù/Trực sử ' + h.m + ' ≠ 3meta ' + x.m3, 'cục và trực');
  kt(h.m === (x.mB || x.m3), nh + ': cung Trực sử ' + h.m + ' ≠ bigfish ' + (x.mB || x.m3), 'cung Trực sử');
  kt(h.dia === x.dia && !x.diaB, nh + ': địa bàn ' + h.dia + ' ≠ ' + x.dia, 'địa bàn');
  kt(h.o8 === (x.o8B || x.o8), nh + ': 8 ô ' + h.o8 + ' ≠ bigfish ' + (x.o8B || x.o8), '8 ô');
  const buoc = (b.gio.chi - b.tuanThu.chi + 12) % 12, roi5 = ctx.kmDi_(b.trucSu.cungGoc, buoc, b.don === 'duong') === 5;
  const coK2 = b.trucPhu.cungGoc === 5 || (roi5 && b.don === 'duong');
  if (x.mB || x.o8B) {                                         // K2: chỉ khác cung Trực sử và lớp cửa
    dem.K2++;
    kt(coK2 && x.mB && x.mB.slice(0, 6) === x.m3.slice(0, 6), nh + ': K2 chỉ xảy ra ở ô giữa của lớp Người', 'K2');
    kt(x.o8 && x.o8B && NGOAI.every((_, i) => x.o8[4 * i] === x.o8B[4 * i] && x.o8[4 * i + 1] === x.o8B[4 * i + 1] && x.o8[4 * i + 3] === x.o8B[4 * i + 3]),
      nh + ': K2 chỉ khác lớp cửa', 'K2 lớp');
  } else kt(!coK2 || b.trucSu.cung === x.m3[6] * 1, nh + ': ca K2 mà 3meta lại trùng', 'K2 ngược');
  kt(b.tuanKhong.chi.join('') === x.kh && !x.khB, nh + ': tuần không ' + b.tuanKhong.ten, 'tuần không');
  kt(b.maTinh.cung === x.maB, nh + ': mã tinh ô ' + b.maTinh.cung + ' ≠ bigfish ' + x.maB, 'mã tinh');
  if (b.maTinh.chi !== x.ma3) { dem.K3++; kt([3, 7, 11].indexOf(b.gio.chi) >= 0 && x.ma3 === 8 && b.maTinh.chi === 5, nh + ': K3 sai luật', 'K3'); }
  if (x.tkGoc != null) {                                       // K1: trong 1 giờ đầu của tiết mới
    dem.K1++;
    const jdUT = ctx.jdFromDate(b.thoiDiem.ngay, b.thoiDiem.thang, b.thoiDiem.nam) - 0.5 + (b.thoiDiem.gio * 60 + b.thoiDiem.phut) / 1440 - 7 / 24;
    const d = b.tietKhi.batDau, jdDau = ctx.jdFromDate(d.ngay, d.thang, d.nam) - 0.5 + (d.gio * 60 + d.phut) / 1440 - 7 / 24;
    kt(x.tkGoc === (x.tk + 23) % 24 && jdUT - jdDau >= 0 && jdUT - jdDau <= 61 / 1440, nh + ': K1 không nằm trong giờ đầu của tiết', 'K1');
  }
  // cấu trúc: sao ô giữa đi cùng sao cung 2 gốc, mang can địa bàn ô giữa; ô giữa không có sao/cửa/thần
  const oNhue = NGOAI.find(i => h.C[i].sao[0] === 1);
  kt(h.C[oNhue].sao[1] === 4 && h.C[oNhue].thienBan[1] === h.C[5].diaBan && NGOAI.every(i => i === oNhue || h.C[i].sao.length === 1),
    nh + ': sao ô giữa phải đi cùng sao cung 2', 'ô giữa');
  kt(h.C[5].sao === undefined && h.C[5].mon === undefined && h.C[5].than === undefined, nh + ': ô giữa không có lớp trên', 'ô giữa trống');
});

// 2. Ví dụ có nguồn trong đề xuất (nghien-cuu/ky-mon/00-de-xuat.md)
let v = lap('202208071900');                                   // trước giờ giao Lập thu (19:29 giờ VN)
kt(v.tietKhi.ten === 'Đại Thử' && v.don === 'am' && v.cuc === 4 && v.nguyen === 2, '7/8/2022 19:00: Đại thử hạ nguyên âm độn cục 4 (được ' + v.tietKhi.ten + ' ' + v.don + v.cuc + ')');
kt(v.ngay.ten === 'Nhâm Thìn' && v.phuDau.ten === 'Kỷ Sửu', '7/8/2022: ngày Nhâm Thìn, phù đầu Kỷ Sửu');
v = lap('202208072000');
kt(v.tietKhi.ten === 'Lập Thu' && v.don === 'am' && v.cuc === 8 && v.nguyen === 2, '7/8/2022 20:00: Lập thu hạ nguyên âm độn cục 8');
kt(v.tietKhi.batDau.gio === 19 && v.tietKhi.batDau.phut === 29, 'Lập thu 2022 giao lúc 19:29 giờ VN (20:29 Bắc Kinh)');
// Dương độn cục 1, giờ Ất Sửu: Trực phù ở cung 9, Trực sử (cửa Hưu) ở cung 2 – tìm ngày bất kỳ cục 1 dương có giờ Ất Sửu
let vd = null;
for (let n = 0; n < 4000 && !vd; n++) {
  const d = ctx.jdToDate(ctx.jdFromDate(1, 1, 2020) + n);
  const b = ctx.kmLap_({ year: d[2], month: d[1], day: d[0], hour: 1, minute: 30 });
  if (b.don === 'duong' && b.cuc === 1 && b.gio.ten === 'Ất Sửu') vd = b;
}
kt(vd && vd.trucPhu.saoTen === 'Thiên Bồng' && vd.trucPhu.cung === 9 && vd.trucSu.monTen === 'Hưu' && vd.trucSu.cung === 2, 'dương cục 1 giờ Ất Sửu: sao gốc cung 1 tới cung 9, cửa gốc cung 1 tới cung 2');
kt(ctx.KM_CUC[18][0] === 1, 'Đông chí thượng nguyên là dương độn cục 1');
// Giờ Tý muộn: 23:30 thuộc ngày hôm sau (can chi ngày, phù đầu)
const a = lap('202208072330'), bsau = lap('202208080030');
kt(a.ngay.ten === bsau.ngay.ten && a.gio.ten === bsau.gio.ten && a.tyMuon && a.phuDau.ten === bsau.phuDau.ten, '23:30 ngày 7/8 dùng can chi ngày 8/8');

// 3. Giờ giao tiết so với lunar-javascript (tests/node_modules, nếu đã cài): sai < 1 phút, 1950–2050
let lj = null; try { lj = require('lunar-javascript'); } catch (e) { /* chưa cài: bỏ qua phần này */ }
if (lj) {
  const TEN = ['春分', '清明', '谷雨', '立夏', '小满', '芒种', '夏至', '小暑', '大暑', '立秋', '处暑', '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至', '小寒', '大寒', '立春', '雨水', '惊蛰'];
  let max = 0;
  for (let y = 1950; y <= 2050; y++) {
    const ds = ctx.kmTietKhiNam_(y);
    kt(ds.length === 24, y + ': đủ 24 tiết');
    const tb = lj.Solar.fromYmd(y, 6, 1).getLunar().getJieQiTable();
    ds.forEach(x => {
      const s = tb[TEN[x.chiSo]];
      if (!s || s.getYear() !== y) return;
      const ref = Date.UTC(s.getYear(), s.getMonth() - 1, s.getDay(), s.getHour() - 8, s.getMinute(), s.getSecond()) / 86400000 + 2440587.5;
      max = Math.max(max, Math.abs(x.jd - ref) * 1440);
    });
  }
  kt(max < 1, 'giờ giao tiết lệch tối đa ' + max.toFixed(2) + ' phút so với lunar-javascript (cần < 1)');
  console.log('Giờ giao tiết 1950–2050: lệch tối đa ' + max.toFixed(2) + ' phút so với lunar-javascript');
}

console.log('Mẫu: ' + dem.mau + ' | K1 (múi giờ 3meta): ' + dem.K1 + ' | K2 (ô giữa lớp Người): ' + dem.K2 + ' | K3 (mã tinh 3meta): ' + dem.K3);
Object.keys(loi).forEach(k => console.log('  nhóm lỗi "' + k + '": ' + loi[k]));
console.log('Kỳ Môn: đạt ' + ok + '/' + (ok + sai));
process.exit(sai ? 1 : 0);
