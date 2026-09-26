/**
 * Kiểm thử Human Design – quy trình 11 bước: mạch kênh, cổng, cầu nối định nghĩa, biến số (màu/tông),
 * hồi quy Mặt Trời, chu kỳ 7 năm, luận tổng hợp; đối chiếu màu Mặt Trời với hd-chart-engine (nếu đã npm install).
 * Chạy: node tests/human-design.js
 */
const path = require('path');
const { ctx } = require(path.join(__dirname, '..', 'tools', 'gia-lap.js'));
let ok = 0, sai = 0;
function kt(dk, msg) { if (dk) ok++; else { sai++; if (sai < 25) console.log('✗', msg); } }
// Mạch: đủ 36 kênh, không trùng
const tatCa = [].concat(...Object.values(ctx.HD_MACH)).map(x => x.slice().sort((a, b) => a - b).join('-'));
kt(tatCa.length === 36 && new Set(tatCa).size === 36, '36 kênh chia đủ vào các mạch');
kt(ctx.HD_CHANNELS.every(c => tatCa.indexOf([c[0], c[1]].sort((a, b) => a - b).join('-')) >= 0), 'mọi kênh có mạch');
let s = 17; const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
const loai = {}, mau = [];
(async () => {
  let hde = null;
  try { hde = await import(path.join(__dirname, 'node_modules', 'hd-chart-engine', 'dist', 'index.js')); } catch (e) { hde = null; }
  for (let k = 0; k < 150; k++) {
    const y = 1945 + Math.floor(rnd() * 75), m = 1 + Math.floor(rnd() * 12), d = 1 + Math.floor(rnd() * 28), h = Math.floor(rnd() * 24), mi = Math.floor(rnd() * 60);
    const jd = ctx.astJD_(y, m, d, h, mi, 7), hd = ctx.hdLap(jd);
    const T = { y, m, d, h, mi, tz: 7, jd, lat: 21.03, lon: 105.85, noiSinh: 'Hà Nội' };
    const P = ctx.hdPhanTich_(hd, T, 2026);
    loai[hd.loai] = (loai[hd.loai] || 0) + 1;
    kt(P.cong.kichHoat.length + P.cong.trong.length === 64, '64 cổng = kích hoạt + trống');
    kt(P.kenh.dem['Cá nhân'] + P.kenh.dem['Tập thể'] + P.kenh.dem['Bộ tộc'] === hd.kenh.length, 'đếm kênh theo mạch');
    kt(P.trungTam.filter(c => c.dinh).length === Object.keys(hd.dinh).length, '9 trung tâm khớp');
    kt(P.dinhNghia.nhom.length === hd.soNhom, 'số nhóm định nghĩa');
    P.dinhNghia.cau.forEach(c => kt(!hd.gates[c.cong], 'cổng cầu nối chưa kích hoạt'));
    if (hd.soNhom === 1 || hd.soNhom === 0) kt(P.dinhNghia.cau.length === 0, 'định nghĩa đơn không cần cầu nối');
    P.bienSo.forEach(b => kt(b.gt && b.y, 'biến số có giá trị'));
    kt(P.chuKy7.filter(c => c.nay).length === 1 || 2026 - y >= 84, 'đúng một chu kỳ 7 năm hiện tại');
    kt(P.tongHop.length === 9 && P.loiKhuyen.length === 3, 'luận tổng hợp 9 mục + 3 lời khuyên');
    kt(!/undefined|NaN/.test(JSON.stringify(P)), 'không có undefined/NaN');
    kt(Math.abs(ctx.astToanBoSun_(ctx.astTimMatTroi_(ctx.astToanBoSun_(jd), ctx.astJD_(2026, m, d, 12, 0, 7))) - ctx.astToanBoSun_(jd)) < 0.01, 'hồi quy Mặt Trời');
    if (hde && k < 60) {
      const p2 = (x) => String(x).padStart(2, '0');
      const r = hde.calculateChart({ date: `${y}-${p2(m)}-${p2(d)}`, time: `${p2(h)}:${p2(mi)}`, lat: 21.03, lon: 105.85, tz: 'Asia/Bangkok' });
      const sp = r.planets.sun.p, sd = r.planets.sun.d;
      mau.push(sp.g === hd.act.p.sun.gate && sp.c === hd.act.p.sun.color, sd.g === hd.act.d.sun.gate && sd.c === hd.act.d.sun.color);
    }
  }
  if (mau.length) { const khop = mau.filter(Boolean).length; kt(khop / mau.length >= 0.9, 'màu Mặt Trời khớp hd-chart-engine ' + khop + '/' + mau.length); console.log('Màu Mặt Trời khớp hd-chart-engine: ' + khop + '/' + mau.length); }
  kt(Object.keys(loai).length >= 4, 'đủ các loại: ' + JSON.stringify(loai));
  console.log('Human Design 11 bước: đạt ' + ok + '/' + (ok + sai) + ' · ' + JSON.stringify(loai));
  process.exit(sai ? 1 : 0);
})();
