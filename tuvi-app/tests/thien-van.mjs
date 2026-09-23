/**
 * Đối chiếu Astro.gs / ChiemTinh.gs / HumanDesign.gs / ThanSoHoc.gs / TongHop.gs
 *  - Vị trí hành tinh, Mọc, Thiên đỉnh ↔ astronomy-engine (MIT)
 *  - Nhà Placidus: kiểm tra tính chất chia ba bán cung
 *  - Human Design ↔ hd-chart-engine (MIT)
 *  - Chạy trọn lapLaSo (kể cả phần tổng hợp 5 hệ) cho nhiều lá số ngẫu nhiên
 * Chạy: npm install && node thien-van.mjs
 */
import fs from 'fs'; import path from 'path'; import vm from 'vm'; import { fileURLToPath } from 'url';
import * as A from 'astronomy-engine';
import { calculateChart } from 'hd-chart-engine';
const D = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const ctx = { console, Math, Date, JSON }; vm.createContext(ctx);
fs.readdirSync(D).filter(f => f.endsWith('.gs') && f !== 'Code.gs').forEach(f => vm.runInContext(fs.readFileSync(path.join(D, f), 'utf8'), ctx, { filename: f }));
const code = fs.readFileSync(path.join(D, 'Code.gs'), 'utf8');
vm.runInContext(code.slice(code.indexOf('function lapLaSo'), code.indexOf('/* ---------------------- Lưu trữ')), ctx);
let seed = 7; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
const R = Math.PI / 180, dA = (a, b) => Math.abs(((a - b) % 360 + 540) % 360 - 180) * 60;
let loi = 0; const ok = (dk, msg) => { if (!dk) { loi++; console.log('✘', msg); } };

// 1. Hành tinh & góc
const BODIES = { sun: 'Sun', moon: 'Moon', mercury: 'Mercury', venus: 'Venus', mars: 'Mars', jupiter: 'Jupiter', saturn: 'Saturn', uranus: 'Uranus', neptune: 'Neptune', pluto: 'Pluto' };
const maxE = {}; let maxAsc = 0, maxPl = 0;
for (let k = 0; k < 200; k++) {
  const y = 1930 + Math.floor(rnd() * 90), m = 1 + Math.floor(rnd() * 12), d = 1 + Math.floor(rnd() * 28), h = Math.floor(rnd() * 24), mi = Math.floor(rnd() * 60);
  const lat = -40 + rnd() * 100, lon = -180 + rnd() * 360;
  const jd = ctx.astJD_(y, m, d, h, mi, 7), pos = ctx.astToanBo(jd), t = A.MakeTime(jd - 2451545);
  for (const b in BODIES) {
    const v = A.GeoVector(BODIES[b], t, true);
    const eqd = A.RotateVector(A.Rotation_EQJ_ECT(t), v), l2 = Math.atan2(eqd.y, eqd.x) / R;
    maxE[b] = Math.max(maxE[b] || 0, dA(pos[b], l2));
  }
  const g = ctx.astGoc_(jd, lat, lon), obs = new A.Observer(lat, lon, 0);
  const rot = A.CombineRotation(A.Rotation_ECT_EQD(t), A.Rotation_EQD_HOR(t, obs));
  const hor = L => A.HorizonFromVector(A.RotateVector(rot, A.VectorFromSphere(new A.Spherical(0, L, 1), t)), '');
  maxAsc = Math.max(maxAsc, Math.abs(hor(g.asc).lat) * 60);
  if (Math.abs(lat) < 60) { // Placidus: cung 11 = 1/3 bán cung ngày
    const P = ctx.ctPlacidus_(jd, lat, lon), eps = ctx.astObliquity_(jd), l = P.cusp[10];
    const ra = Math.atan2(Math.sin(l * R) * Math.cos(eps * R), Math.cos(l * R)) / R, dec = Math.asin(Math.sin(eps * R) * Math.sin(l * R)) / R;
    const H = ((g.ramc - ra) % 360 + 540) % 360 - 180, sa = 90 + Math.asin(Math.tan(lat * R) * Math.tan(dec * R)) / R;
    maxPl = Math.max(maxPl, Math.abs(-H / sa - 1 / 3));
  }
}
console.log('Sai số lớn nhất (phút cung):', Object.entries(maxE).map(([k, v]) => k + ' ' + v.toFixed(2)).join(' · '));
console.log('Mọc: độ cao lệch tối đa', maxAsc.toFixed(2) + '′ · Placidus: lệch tỷ lệ bán cung', maxPl.toExponential(1));
Object.entries(maxE).forEach(([k, v]) => ok(v < 6, k + ' lệch ' + v.toFixed(1) + '′'));
ok(maxAsc < 1, 'Mọc lệch'); ok(maxPl < 1e-4, 'Placidus sai');

// 2. Human Design
let tot = 0, gBad = 0, typeBad = 0;
for (let k = 0; k < 150; k++) {
  const y = 1945 + Math.floor(rnd() * 75), m = 1 + Math.floor(rnd() * 12), d = 1 + Math.floor(rnd() * 28), h = Math.floor(rnd() * 24), mi = Math.floor(rnd() * 60), p = x => String(x).padStart(2, '0');
  const ref = calculateChart({ date: `${y}-${p(m)}-${p(d)}`, time: `${p(h)}:${p(mi)}`, lat: 21.03, lon: 105.85, tz: 'Asia/Bangkok' });
  const me = ctx.hdLap(ctx.astJD_(y, m, d, h, mi, 7));
  for (const b in ref.planets) for (const s of ['p', 'd']) { const mb = me.act[s][b]; if (!mb) continue; tot++; if (mb.gate !== ref.planets[b][s].g) gBad++; }
}
console.log('Human Design: cổng khác tham chiếu', gBad + '/' + tot);
ok(gBad / tot < 0.01, 'HD lệch cổng quá 1%');

// 3. Chạy trọn bộ
let t0 = Date.now(), n = 0;
for (let k = 0; k < 40; k++) {
  const inp = { name: ['Nguyễn Văn An', 'Trần Thị Thùy Vy', 'Lê Đức Huy', ''][k % 4], gender: k % 2 ? 'nu' : 'nam', calendar: k % 3 ? 'duong' : 'am', day: 1 + Math.floor(rnd() * 28), month: 1 + Math.floor(rnd() * 12),
    year: 1940 + Math.floor(rnd() * 80), hour: Math.floor(rnd() * 24), minute: 0, viewYear: 2026, place: '10.78|106.70|TP. Hồ Chí Minh', tz: '7' };
  const r = ctx.lapLaSo(inp); n++;
  ok(!r.moRongLoi && r.moRong && r.moRong.tongHop.tinhCach.truc.length === 5, 'lapLaSo mở rộng lỗi: ' + r.moRongLoi + ' ' + JSON.stringify(inp));
}
console.log('lapLaSo đầy đủ:', n, 'lá số,', Math.round((Date.now() - t0) / n), 'ms/lá');
console.log(loi ? '✘ ' + loi + ' lỗi' : '✔ Tất cả kiểm tra đạt');
process.exit(loi ? 1 : 0);
