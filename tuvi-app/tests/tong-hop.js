/**
 * Kiểm thử Tổng hợp 6 hệ bản 2 (DeHieu.gs › th6Lap_) và mồi bản miễn phí (TaiKhoan.gs › th6Moi_).
 * Chạy: node tests/tong-hop.js
 */
const path = require('path');
const { ctx } = require(path.join(__dirname, '..', 'tools', 'gia-lap.js'));
let ok = 0, sai = 0;
function kt(dk, msg) { if (dk) ok++; else { sai++; if (sai < 25) console.log('✗', msg); } }
const SAO = /Tử Vi tinh|Thiên Cơ|Thái Dương|Vũ Khúc|Thiên Đồng|Liêm Trinh|Thiên Phủ|Thái Âm|Tham Lang|Cự Môn|Thiên Tướng|Thiên Lương|Thất Sát|Phá Quân|Kình Dương|Đà La|Hóa Kỵ|Hóa Lộc|Tuần|Triệt|Sao |Mặt Trăng|Mặt Trời/;
let s = 21; const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
const phanBo = { tot: 0, vua: 0, xau: 0 };
for (let k = 0; k < 40; k++) {
  const inp = { name: 'Khách ' + k, gender: k % 2 ? 'nu' : 'nam', calendar: 'duong', day: 1 + Math.floor(rnd() * 28), month: 1 + Math.floor(rnd() * 12), year: 1950 + Math.floor(rnd() * 60), hour: Math.floor(rnd() * 24), minute: 0, viewYear: 2026 };
  const r = ctx.lapLaSoDayDu_(inp), T = r.moRong.deHieu.th6;
  kt(T && !T.loi, 'có tổng hợp: ' + (T && T.loi));
  if (!T || T.loi) continue;
  kt(T.linhVuc.length === 9, '9 lĩnh vực');
  T.linhVuc.forEach(x => {
    phanBo[x.huong]++;
    kt(x.diem >= 0 && x.diem <= 10, 'điểm trong 0–10');
    kt(x.huong === (x.diem >= 6 ? 'tot' : x.diem <= 4.8 ? 'xau' : 'vua'), 'nhãn khớp điểm ' + x.ten);
    kt(x.dong <= x.soHe && x.soHe <= 4, 'số hệ đồng thuận hợp lệ');
    kt(x.ket && !/undefined|NaN/.test(JSON.stringify(x)), 'có kết luận, không undefined');
    const vanChinh = x.ket + ' ' + (x.noiBat ? x.noiBat.t : '') + ' ' + x.manh.concat(x.yeu).map(m => m.t).join(' ') + ' ' + x.khuyen.join(' ');
    kt(!SAO.test(vanChinh), 'không nêu tên sao trong kết luận: ' + x.ten + ' – ' + (vanChinh.match(SAO) || [''])[0]);
    x.namToi.forEach(n => kt(n.nam >= 2026 && n.soHe >= 3, 'năm nổi bật tương lai, ≥3 hệ'));
    [x.manh, x.yeu].forEach(ds => { const he = ds.map(m => m.he); kt(new Set(he).size === he.length, 'mỗi hệ tối đa một câu mỗi chiều'); });
  });
  const M = ctx.th6Moi_(r);
  kt(M && M.linhVuc.length === 9 && M.linhVuc.filter(x => x.lo).length === 1, 'bản miễn phí lộ đúng 1 lĩnh vực');
  kt(M.linhVuc.every(x => x.lo || !x.ket), 'bản miễn phí không lộ lời luận các lĩnh vực khóa');
}
kt(phanBo.tot > 40 && phanBo.xau > 20 && phanBo.vua > 60, 'phân bố thuận/vừa/cần lưu ý: ' + JSON.stringify(phanBo));
console.log('Tổng hợp 6 hệ: đạt ' + ok + '/' + (ok + sai) + ' · ' + JSON.stringify(phanBo));
process.exit(sai ? 1 : 0);
