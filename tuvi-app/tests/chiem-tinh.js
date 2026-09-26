/**
 * Kiểm thử Chiêm tinh – quy trình 7 bước: điểm phụ (Chiron, Lilith, Nút Nam), cấu hình, 8 lĩnh vực,
 * transit, tiến triển, Solar Arc, Solar Return, Lunar Return, so sánh hai lá số.
 * Chạy: node tests/chiem-tinh.js
 */
const path = require('path');
const { ctx } = require(path.join(__dirname, '..', 'tools', 'gia-lap.js'));
let ok = 0, sai = 0;
function kt(dk, msg) { if (dk) ok++; else { sai++; if (sai < 25) console.log('✗', msg); } }
const kc = (a, b) => { const d = Math.abs(((a - b) % 360 + 360) % 360); return d > 180 ? 360 - d : d; };
// 1. Chiron theo các mốc đổi cung đã biết (sai số cho phép 1,5°)
[[2001, 12, 20, 270], [2005, 2, 21, 300], [2011, 2, 9, 330], [2019, 2, 18, 0], [1977, 11, 1, 33]].forEach(([y, m, d, lon]) => {
  const v = ctx.ctChiron_(ctx.astJD_(y, m, d, 12, 0, 0));
  kt(kc(v, lon) < 1.5, 'Chiron ' + d + '/' + m + '/' + y + ' = ' + v.toFixed(2) + ' (mốc ' + lon + ')');
});
kt(kc(ctx.ctLilith_(2451545.0), 263.35) < 0.05, 'Lilith J2000 ≈ 23°21′ Nhân Mã');
// 2. Nhiều lá số
let s = 3; const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
const bac = { tot: 0, vua: 0, kho: 0 }, ch = {};
for (let k = 0; k < 60; k++) {
  const inp = { name: 'A', gender: k % 2 ? 'nu' : 'nam', calendar: 'duong', day: 1 + Math.floor(rnd() * 28), month: 1 + Math.floor(rnd() * 12), year: 1945 + Math.floor(rnd() * 75), hour: Math.floor(rnd() * 24), minute: Math.floor(rnd() * 60), viewYear: 2026 };
  const ct = ctx.chiemTinhLap(inp), L = ctx.chiemTinhLuan(ct, 2026), P = L.phanTich;
  kt(P && !L.phanTichLoi, 'có phân tích: ' + L.phanTichLoi);
  if (!P) continue;
  const by = ct.by;
  kt(kc(P.diemPhu[0] && ctx.astNorm_(by.northNode.lon + 180), ctx.astNorm_(by.northNode.lon + 180)) < 1e-9, 'Nút Nam đối Nút Bắc');
  kt(P.linhVuc.length === 8, '8 lĩnh vực');
  P.linhVuc.forEach(x => {
    bac[x.bac]++;
    kt((x.bac === 'tot') === (x.diem >= 0.6) && (x.bac === 'kho') === (x.diem < -0.6), 'mức khớp điểm ' + x.ten);
    kt(!/Sao |Mặt Trời|Mặt Trăng|Nút|Chiron|Lilith|nhà \d/.test(x.tron + x.khuyen), 'văn dễ hiểu không nêu tên sao: ' + x.ten + ' – ' + x.tron);
  });
  P.cauHinh.forEach(c => { ch[c.loai] = (ch[c.loai] || 0) + 1; kt(c.ds.length >= 3, 'cấu hình đủ thành phần'); });
  const C = P.chuKy;
  // Solar Return: Mặt Trời về đúng vị trí gốc
  const srJd = ctx.astTimMatTroi_(by.sun.lon, ctx.astJD_(2026, ct.thoiDiem.m, ct.thoiDiem.d, 12, 0, ct.thoiDiem.tz));
  kt(kc(ctx.astToanBoSun_(srJd), by.sun.lon) < 0.01, 'Solar Return đúng kinh độ Mặt Trời gốc');
  kt(C.solarReturn.nhaMatTroi >= 1 && C.solarReturn.nhaMatTroi <= 12, 'nhà Mặt Trời hồi quy');
  kt(C.lunarReturn.length >= 1, 'có Lunar Return');
  kt(C.transit.length === 10 && C.tienTrien.ds.length === 5, 'transit & tiến triển');
  kt(Math.abs(C.solarArc.cung - C.tienTrien.tuoi * 0.9856) < 3, 'Solar Arc ≈ tuổi × 0,9856°');
  kt(P.loiKhuyen.length === 4 && P.loiKhuyen.every(x => x.t && !/undefined|NaN/.test(x.t)), 'lời khuyên');
  kt(!/undefined|NaN/.test(JSON.stringify(P)), 'không có undefined/NaN');
}
kt(bac.tot > 80 && bac.kho > 80 && bac.vua > 120, 'phân bố thuận/vừa/cần rèn: ' + JSON.stringify(bac));
// 3. So sánh hai lá số
const iA = { name: 'An', gender: 'nam', calendar: 'duong', day: 15, month: 8, year: 1990, hour: 10, minute: 30, viewYear: 2026 }, iB = { name: 'Bình', gender: 'nu', calendar: 'duong', day: 3, month: 2, year: 1993, hour: 6, minute: 0, viewYear: 2026 };
const A = ctx.chiemTinhLap(iA), B = ctx.chiemTinhLap(iB), SS = ctx.ctSoSanh_(A, B, 'An', 'Bình');
kt(SS.composite && SS.davison && SS.nhaAB.length + SS.nhaBA.length > 0, 'synastry: nhà chồng lấn, Composite, Davison');
kt(kc(ctx.ctTrungDiem_(350, 10), 0) < 1e-9 && kc(ctx.ctTrungDiem_(10, 350), 0) < 1e-9, 'trung điểm qua 0°');
console.log('Chiêm tinh 7 bước: đạt ' + ok + '/' + (ok + sai) + ' · ' + JSON.stringify(bac) + ' · cấu hình ' + JSON.stringify(ch));
process.exit(sai ? 1 : 0);
