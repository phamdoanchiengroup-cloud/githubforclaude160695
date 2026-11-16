// Tử Vi: so điểm/nhãn giữa 26 bước (TuViTrinhTu) – 12 cung (LuanGiai) – danh sách đại vận / tiểu vận. Chạy: node logic-tuvi-noibo.js 150
const { ctx } = require('/home/user/githubforclaude160695/tuvi-app/tools/gia-lap.js');
let s = 7; const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
const N = +(process.argv[2] || 150), C10 = x => ctx.chuanHoa10_(x);
const chieu = d => d >= 6 ? 1 : d < 4.5 ? -1 : 0;
const DG = { 'Rất tốt': 1, 'Tốt': 1, 'Khá': 0, 'Trung bình': 0, 'Kém': -1, 'Cần thận trọng': -1 };
const st = {}; const f = (g, ok, vd) => { st[g] = st[g] || { n: 0, s: 0, vd: [] }; st[g].n++; if (!ok) { st[g].s++; if (st[g].vd.length < 3) st[g].vd.push(vd); } };
let dl = [];
for (let k = 0; k < N; k++) {
  const inp = { name: 'R' + k, gender: k % 2 ? 'nu' : 'nam', calendar: 'duong', day: 1 + Math.floor(rnd() * 28), month: 1 + Math.floor(rnd() * 12), year: 1965 + Math.floor(rnd() * 42), hour: Math.floor(rnd() * 24), minute: Math.floor(rnd() * 60), viewYear: 2026 };
  const r = ctx.lapLaSoDayDu_(inp), P = r.tuvi.palaces, ct = {}; r.chiTiet.cung.forEach(c => ct[c.cung] = c);
  P.forEach(p => { const c = ct[p.cung]; if (!c || p.diem10 == null) return; const a = p.diem10, b = C10(c.diem); dl.push(Math.abs(a - b));
    f('Điểm cung: bảng sao/26 bước (palace.diem10) ↔ 12 cung chi tiết (chiTiet.cung) cùng chiều', !(chieu(a) * chieu(b) === -1), inp.name + ' ' + p.cung + ' ' + a + ' vs ' + b + ' (' + c.danhGia + ')'); });
  const B = {}; r.chiTiet.trinhTu.buoc.forEach(b => B[b.so] = b);
  const dv = r.chiTiet.daiVan.filter(d => d.isNow)[0], tv = r.chiTiet.tieuVan;
  const t26 = (B[26].de || []).join(' ');
  const mucDV = /Đại vận[^.]*ở mức ([^.]+)\./.exec(t26), mucTN = /Vận năm \d+ ở mức ([^.]+)\./.exec(t26);
  const m2c = m => /rõ rệt|khá thuận/.test(m) ? 1 : /cố gắng/.test(m) ? -1 : 0;
  if (dv && mucDV) f('Bước 26 "Đại vận ở mức…" ↔ danh sách Đại vận (nhãn) khớp chiều', !(m2c(mucDV[1]) * DG[dv.danhGia] === -1) && !(m2c(mucDV[1]) === 0 && Math.abs(DG[dv.danhGia]) === 1 && /Rất|Cần/.test(dv.danhGia)), inp.name + ' bước26: ' + mucDV[1] + ' / danh sách: ' + dv.danhGia + ' (' + dv.diem + ')');
  if (dv && mucDV) f('Bước 26 "Đại vận" ↔ danh sách Đại vận: cùng MỨC (gom 3 bậc)', m2c(mucDV[1]) === DG[dv.danhGia], inp.name + ' ' + mucDV[1] + ' / ' + dv.danhGia);
  if (tv && mucTN) f('Bước 26 "Vận năm" ↔ Tiểu vận năm (nhãn): cùng MỨC (gom 3 bậc)', m2c(mucTN[1]) === DG[tv.danhGia], inp.name + ' ' + mucTN[1] + ' / ' + tv.danhGia + ' (' + tv.diem + ')');
  const M = ct['Mệnh']; f('Bước 6 "Chính tinh thủ Mệnh" (tot/xau) ↔ nhãn cung Mệnh', !((B[6].huong === 'tot' && DG[M.danhGia] === -1) || (B[6].huong === 'xau' && DG[M.danhGia] === 1)), inp.name + ' bước6 ' + B[6].huong + ' / Mệnh ' + M.danhGia);
  [19, 20, 21, 22, 23, 24].forEach(n => { const b = B[n]; const cg = b.gop && b.gop.cung; if (!cg) return; const c = ct[cg[0]]; if (!c) return;
    f('Bước 19–24 (chủ đề đời sống) ↔ nhãn cung chi tiết', !((b.huong === 'tot' && DG[c.danhGia] === -1) || (b.huong === 'xau' && DG[c.danhGia] === 1)), inp.name + ' ' + b.ten + ' ' + b.huong + ' / ' + cg[0] + ' ' + c.danhGia); });
}
dl.sort((a, b) => a - b);
console.log('Lệch tuyệt đối điểm cung (palace.diem10 vs chiTiet.cung): TB ' + (dl.reduce((a, b) => a + b, 0) / dl.length).toFixed(2) + ' · p50 ' + dl[dl.length >> 1].toFixed(1) + ' · p90 ' + dl[Math.floor(dl.length * .9)].toFixed(1) + ' · max ' + dl[dl.length - 1].toFixed(1));
Object.keys(st).forEach(g => { const x = st[g]; console.log(g + ': lệch ' + x.s + '/' + x.n + ' (' + (x.s / x.n * 100).toFixed(1) + '%)'); x.vd.forEach(v => console.log('   vd: ' + v)); });
