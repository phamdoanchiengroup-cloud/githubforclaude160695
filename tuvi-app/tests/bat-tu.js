/** Kiểm thử phân tích Bát Tự 9 bước (BatTuPhanTich.gs) trên 400 lá số ngẫu nhiên. Chạy: node tests/bat-tu.js */
const { ctx } = require('../tools/gia-lap.js');
let ok = 0, sai = 0; function kt(dk, ten) { if (dk) ok++; else { sai++; if (sai < 15) console.log('  ✘', ten); } }
let rnd = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(77);
const dem = { vuong: 0, dacBiet: 0 }, HANH = ['Mộc', 'Hỏa', 'Thổ', 'Kim', 'Thủy'];
for (let k = 0; k < 400; k++) {
  const inp = { name: 'A', gender: k % 2 ? 'nu' : 'nam', calendar: 'duong', day: 1 + Math.floor(rnd() * 28), month: 1 + Math.floor(rnd() * 12), year: 1940 + Math.floor(rnd() * 80), hour: Math.floor(rnd() * 24), minute: 0, viewYear: 2026 };
  const B = ctx.batTuLap(inp), P = B.phanTich;
  kt(P && !B.phanTichLoi, 'có phân tích 9 bước (' + (B.phanTichLoi || '') + ')');
  if (!P) continue;
  const tongPct = HANH.reduce((a, h) => a + P.diem.pct[h], 0);
  kt(Math.abs(tongPct - 100) < 0.6, 'tổng % ngũ hành = 100 (' + tongPct + ')');
  kt(P.vuong === (P.diem.phe >= 40), 'ngưỡng vượng/nhược 40% nhất quán');
  kt(B.vuong === P.vuong && B.tyLeTro === P.diem.phe, 'bt.vuong/tyLeTro dùng kết quả mới');
  kt(P.dungThan.ky.indexOf(P.dungThan.dung) < 0 && P.dungThan.hy.indexOf(P.dungThan.dung) < 0, 'dụng thần không trùng hỷ/kỵ');
  kt(P.dungThan.hy.every(h => P.dungThan.ky.indexOf(h) < 0), 'hỷ không trùng kỵ');
  kt(B.goiY.hy[0] === P.dungThan.dung, 'quy ước goiY.hy[0] = dụng thần');
  kt(P.tieuChi.length === 4 && P.dungThan.phuongPhap.length >= 4, 'đủ 4 tiêu chí và 4 phương pháp dụng thần');
  kt(P.daiVan.length === B.daiVan.length && B.daiVan.every(d => d.danhGia), 'đại vận có đánh giá mới');
  kt(!/undefined|NaN/.test(JSON.stringify(P)), 'không có undefined/NaN');
  if (P.vuong) dem.vuong++; if (P.cachCuc.dacBiet) dem.dacBiet++;
}
kt(dem.vuong > 120 && dem.vuong < 280, 'tỷ lệ thân vượng hợp lý (' + dem.vuong + '/400)');
kt(dem.dacBiet < 32, 'ngoại cách hiếm (' + dem.dacBiet + '/400)');
// lá số mẫu: Nhâm Thủy sinh tháng Thân – Ấn vượng → thân vượng, dụng Tài (Hỏa)
const M = ctx.batTuLap({ name: 'A', gender: 'nam', calendar: 'duong', day: 15, month: 8, year: 1990, hour: 10, minute: 30, viewYear: 2026 }).phanTich;
kt(M.vuong && M.dungThan.ducPhu.cuc === 'Ấn nhiều' && M.dungThan.dung === 'Hỏa', 'lá số mẫu: thân vượng Ấn nhiều → dụng Hỏa');
kt(M.cachCuc.ten === 'Thiên Ấn cách', 'lá số mẫu: Thiên Ấn cách');
const L = ctx.btpLuuNienDacBiet_(ctx.batTuLap({ name: 'A', gender: 'nam', calendar: 'duong', day: 15, month: 8, year: 1990, hour: 10, minute: 30, viewYear: 2026 }), 2032, null);
kt(Array.isArray(L), 'hàm lưu niên đặc biệt chạy');
console.log('Bát Tự 9 bước: đạt ' + ok + '/' + (ok + sai) + ' · thân vượng ' + dem.vuong + '/400 · ngoại cách ' + dem.dacBiet + '/400');
if (sai) process.exit(1);
