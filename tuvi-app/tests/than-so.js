/**
 * Kiểm thử Thần số học – quy trình 6 bước (chỉ số cốt lõi, bổ sung, nợ nghiệp, chu kỳ, luận, trường hợp đặc biệt).
 * Chạy: node tests/than-so.js
 */
const path = require('path');
const { ctx } = require(path.join(__dirname, '..', 'tools', 'gia-lap.js'));
let ok = 0, sai = 0;
function kt(dk, msg) { if (dk) ok++; else { sai++; if (sai < 20) console.log('✗', msg); } }
function lap(ten, d, m, y, g) { return ctx.thanSoHocLap({ name: ten, gender: g || 'nam' }, { day: d, month: m, year: y }, 2026); }
// 1. Mẫu tính tay
let T = lap('Nguyễn Thị Hương', 11, 11, 1991, 'nu');
kt(T.duongDoi === 6 && T.ngaySinh === 11 && T.thaiDo === 4, 'ĐĐ 6, ngày sinh 11 (giữ số bậc thầy), thái độ 4');
kt(T.tenChuan === 'NGUYEN THI HUONG', 'bỏ dấu tên');
kt(T.phanTich.dacBiet.some(x => /bậc thầy/.test(x.ten) && x.co), 'phát hiện số bậc thầy 11');
kt(T.phanTich.dacBiet.some(x => /lặp/.test(x.ten) && x.co && /1 \(×6\)/.test(x.t)), 'số lặp: sáu số 1');
kt(T.phanTich.boSung.some(x => x.ten === 'Tiềm Thức' && x.so === 9 - T.baiHoc.length), 'tiềm thức = 9 − bài học nghiệp');
// 2. Nợ nghiệp
T = lap('An', 13, 5, 1990);
kt(T.phanTich.noNghiep.some(x => x.so === 13 && x.o === 'Ngày sinh'), 'ngày 13 → nợ nghiệp 13');
T = lap('An', 19, 1, 2000); // 1+9+1+2 = 13 → nợ 13 ở Đường Đời
kt(T.phanTich.noNghiep.some(x => x.so === 13 && x.o === 'Đường Đời'), 'tổng ngày sinh 13 → nợ nghiệp ở Đường Đời');
T = lap('An', 1, 1, 2000);
kt(T.phanTich.noNghiep.length === 0, 'không có nợ nghiệp');
// 3. Số 0: 1/9/1999 → 1+9+1+9+9+9 = 38 → 11 (không qua 10) ; 2/8/2008 → 2+8+2+8 = 20
T = lap('An', 2, 8, 2008);
kt(T.phanTich.dacBiet.some(x => /Số 0/.test(x.ten) && x.co), 'đường đời đi qua 20 → số 0');
// 4. Nhiều lá số
let s = 5; const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
const TEN = ['Nguyễn Văn An', 'Trần Thị Bích Ngọc', 'Lê Minh', 'Phạm Đức Thắng', 'Hoàng Yến', ''];
for (let k = 0; k < 300; k++) {
  const t = lap(TEN[k % TEN.length], 1 + Math.floor(rnd() * 28), 1 + Math.floor(rnd() * 12), 1940 + Math.floor(rnd() * 80), k % 2 ? 'nu' : 'nam');
  const P = t.phanTich;
  kt(P && !t.phanTichLoi, 'có phân tích: ' + t.phanTichLoi);
  if (!P) continue;
  kt(P.coLoi.length === (t.coTen ? 6 : 3), 'số chỉ số cốt lõi');
  kt(P.luan.length === 6 && P.luan.every(x => x.items.length >= 2), '6 mục luận tổng hợp');
  kt(P.loiKhuyen.length === 5 && P.loiKhuyen.every(x => x.t && !/undefined/.test(x.t)), '5 lời khuyên');
  kt(P.dinhCao.filter(x => x.nay).length === 1, 'đúng một đỉnh cao hiện tại');
  kt(P.chuKy.filter(x => x.nay).length === 1 && P.chuKy.every(x => x.so >= 1 && x.so <= 9), 'chu kỳ 9 năm');
  kt(P.ngay.length === 30 && P.thang.length === 12, 'lịch tháng/ngày');
  kt(!/undefined|NaN/.test(JSON.stringify(P)), 'không có undefined/NaN');
  P.noNghiep.forEach(x => kt([13, 14, 16, 19].indexOf(x.so) >= 0, 'mã nợ nghiệp hợp lệ'));
}
console.log('Thần số học 6 bước: đạt ' + ok + '/' + (ok + sai));
process.exit(sai ? 1 : 0);
