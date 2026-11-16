// Rà logic phân tích: phân bố điểm, mâu thuẫn trong hệ, Tổng hợp 6 hệ, vận hạn, độ trùng văn. Chạy: node logic-phan-tich.js
const { ctx } = require('/home/user/githubforclaude160695/tuvi-app/tools/gia-lap.js');
const VY = 2026;
let s = 7; const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
const NAMED = [
 ['A','nam',12,3,1990,8,15],['B','nu',25,7,1995,14,40],['C','nam',3,11,1985,23,30],['D','nu',19,1,2000,23,10],['E','nam',7,9,1978,5,0],
 ['F','nu',30,4,1988,19,20],['G','nam',15,6,2002,11,50],['H','nu',1,12,1970,2,5],['I','nam',22,2,1993,16,30],['K','nu',9,10,1983,0,45]];
const inputs = NAMED.map(a => ({ name: a[0], gender: a[1], day: a[2], month: a[3], year: a[4], hour: a[5], minute: a[6] }));
const NR = +(process.argv[2] || 150);
for (let k = 0; k < NR; k++) inputs.push({ name: 'R' + k, gender: k % 2 ? 'nu' : 'nam', day: 1 + Math.floor(rnd() * 28), month: 1 + Math.floor(rnd() * 12), year: 1965 + Math.floor(rnd() * 42), hour: Math.floor(rnd() * 24), minute: Math.floor(rnd() * 60) });
const C10 = x => ctx.chuanHoa10_(x);
const cnt = {}; const inc = (g, k) => { cnt[g] = cnt[g] || {}; cnt[g][k] = (cnt[g][k] || 0) + 1; };
const pairs = {}; const addP = (g, x, y) => { (pairs[g] = pairs[g] || []).push([x, y]); };
const flag = {}; const fl = (g, ok, ex) => { flag[g] = flag[g] || { n: 0, sai: 0, vd: [] }; flag[g].n++; if (!ok) { flag[g].sai++; if (flag[g].vd.length < 4) flag[g].vd.push(ex); } };
const texts = {};
const DG_SO = { 'Rất tốt': 2, 'Tốt': 1, 'Khá': 0.5, 'Trung bình': 0, 'Kém': -1, 'Cần thận trọng': -2 };
const BTV = { 'Đại cát': 2, 'Cát': 1, 'Bình': 0, 'Hơi kém': -1, 'Cẩn trọng': -2 };
function sentences(str) { return String(str || '').split(/(?<=[.!?…])\s+|\n+/).map(x => x.replace(/\d+([.,]\d+)?/g, '#').trim()).filter(x => x.length > 25); }
function walk(o, out) { if (o == null) return out; if (typeof o === 'string') { out.push(o); return out; } if (Array.isArray(o)) { o.forEach(x => walk(x, out)); return out; } if (typeof o === 'object') Object.keys(o).forEach(k => { if (!/^(icon|k|key|he|nhom|huong|bac|han|chi|canChi|loai)$/.test(k)) walk(o[k], out); }); return out; }
inputs.forEach((inp, idx) => {
  Object.assign(inp, { calendar: 'duong', viewYear: VY });
  const r = ctx.lapLaSoDayDu_(inp), M = r.moRong, DH = M.deHieu, T6 = DH.th6, TH = M.tongHop;
  const tag = inp.name;
  // 1. Phân bố nhãn từng hệ
  r.chiTiet.cung.forEach(c => { inc('TV cung danhGia', c.danhGia); inc('TV cung th6Huong', ctx.th6Huong_(C10(c.diem)));
    const h = ctx.th6Huong_(C10(c.diem)), dg = c.danhGia;
    fl('TV: nhãn cung (chi tiết) ↔ câu tổng hợp 6 hệ cùng chiều', !((h === 'xau' && DG_SO[dg] >= 0) || (h === 'tot' && DG_SO[dg] <= 0) || (h === 'vua' && Math.abs(DG_SO[dg]) >= 1)), tag + ' ' + c.cung + ' ' + dg + ' (' + C10(c.diem) + ') → ' + h); });
  r.battuChiTiet.linhVuc.forEach(l => { inc('BT linhVuc danhGia', l.danhGia);
    const kl = (l.secs || []).filter(s => /Kết luận/.test(s.tieuDe))[0], it = kl ? kl.items : []; const m = String(it[0] || '').match(/\(([\d.]+)\/10\)/);
    const d = m ? +m[1] : C10(l.diem); inc('BT linhVuc th6Huong', ctx.th6Huong_(d));
    const dgD = DG_SO[l.danhGia];
    fl('BT: nhãn lĩnh vực ↔ điểm "Kết luận (x/10)" cùng chiều', !((ctx.th6Huong_(d) === 'xau' && dgD > 0) || (ctx.th6Huong_(d) === 'tot' && dgD < 0)), tag + ' ' + l.key + ' ' + l.danhGia + ' vs ' + d + '/10 «' + String(it[0]).slice(0, 80) + '»'); });
  (M.chiemTinhLuan.phanTich.linhVuc || []).forEach(x => { inc('CT linhVuc bac', x.bac); inc('CT th6Huong', ctx.th6Huong_(C10(x.diem * 1.8))); });
  (M.haLac.luan.linhVuc || []).forEach(x => { inc('HL linhVuc bac', x.bac); inc('HL th6Huong', ctx.th6Huong_(C10(x.diem * 1.5))); });
  // 2. Tổng hợp 6 hệ
  T6.linhVuc.forEach(x => { inc('TH6 huong', x.huong); inc('TH6 soHe', x.soHe); inc('TH6 ' + x.k, x.huong);
    inc('TH6 dong/soHe khi tot', x.huong === 'tot' ? x.dong + '/' + x.soHe : '-');
    const ng = x.phieu.filter(p => p.huong !== x.huong && p.huong !== 'vua').length;
    fl('TH6: kết luận thuận/cần lưu ý mà có hệ NGƯỢC chiều', !(x.huong !== 'vua' && ng > 0), tag + ' ' + x.k + ' ' + x.huong + ' ' + x.diem + ' phiếu ' + x.phieu.map(p => p.he + ':' + p.d10 + p.huong).join(' '));
    fl('TH6: kết luận thuận/cần lưu ý chỉ được < nửa số hệ cùng chiều', !(x.huong !== 'vua' && x.dong * 2 < x.soHe), tag + ' ' + x.k + ' ' + x.huong + ' ' + x.dong + '/' + x.soHe + ' «' + x.ket + '»');
    fl('TH6: "vừa" nhưng các phiếu chia hai cực (≥1 thuận & ≥1 khó)', !(x.huong === 'vua' && x.phieu.some(p => p.huong === 'tot') && x.phieu.some(p => p.huong === 'xau')), tag + ' ' + x.k + ' ' + x.phieu.map(p => p.he + ':' + p.d10).join(' '));
    fl('TH6: cùng 1 hệ vừa ở "điểm sáng" vừa ở "cần lưu ý"', !x.manh.some(m => x.yeu.some(y => y.he === m.he)), tag + ' ' + x.k);
    fl('TH6: noiBat ngược chiều kết luận', !(x.huong === 'tot' && x.noiBat && x.yeu.some(y => y.t === x.noiBat.t)) && !(x.huong === 'xau' && x.noiBat && x.manh.some(y => y.t === x.noiBat.t)), tag + ' ' + x.k + ' ' + x.huong + ' noiBat=' + (x.noiBat && x.noiBat.t));
    addP('TH6 diem', x.diem, 0);
  });
  inc('TH6 doTin', Math.round(T6.doTin / 10) * 10); inc('TH6 #theManh', T6.theManh.length); inc('TH6 #canChuY', T6.canChuY.length);
  // Tổng hợp cũ (dh.tongHop) vs th6 cùng lĩnh vực
  const old = {}; (DH.tongHop || []).forEach(k => old[k.nhom] = k.diem);
  T6.linhVuc.forEach(x => { if (old[x.k] == null) return; const ho = ctx.th6HuongChung_(old[x.k]);
    fl('Tổng hợp cũ (dh.tongHop, vẫn dùng làm dự phòng/báo cáo) ↔ th6 cùng chiều', !((ho === 'tot' && x.huong === 'xau') || (ho === 'xau' && x.huong === 'tot')), tag + ' ' + x.k + ' cũ ' + old[x.k] + ' / mới ' + x.diem); });
  // 3. Vận hạn
  const dvTV = r.chiTiet.daiVan.filter(d => d.isNow)[0], tvN = r.chiTiet.tieuVan, nv = r.chiTiet.nguyetVan;
  const dvBT = (r.battu.daiVan || []).filter(d => VY >= d.nam && VY < d.nam + 10)[0];
  const lnBT = (r.battuChiTiet.luuNien || []).filter(y => y.nam === VY)[0];
  const hlN = (M.haLac.luan.nam || []).filter(y => y.nam === VY)[0];
  const thN = TH.namNay, hsn = TH.hoSoNam;
  if (dvTV && tvN) { addP('TV đại vận ↔ tiểu vận năm (điểm thô)', dvTV.diem, tvN.diem); inc('TV tieuVan danhGia', tvN.danhGia); inc('TV daiVan(now) danhGia', dvTV.danhGia); }
  if (tvN && nv) { const tb = nv.reduce((t, m) => t + m.diem, 0) / nv.length; addP('TV tiểu vận năm ↔ TB 12 nguyệt vận', tvN.diem, tb);
    nv.forEach(m => inc('TV nguyetVan danhGia', m.danhGia));
    const tot = nv.filter(m => DG_SO[m.danhGia] >= 1).length, xau = nv.filter(m => DG_SO[m.danhGia] <= -1).length;
    inc('TV: số tháng Tốt+/Kém- khi năm ' + tvN.danhGia, tot + '/' + xau);
    const sp = Math.max(...nv.map(m => C10(m.diem))) - Math.min(...nv.map(m => C10(m.diem))); addP('TV biên độ tháng (thang 10)', sp, 0); }
  if (dvTV && lnBT) addP('TV tiểu vận ↔ BT lưu niên (điểm)', tvN.diem, lnBT.diem);
  if (dvBT && lnBT) { addP('BT đại vận(danhGia) ↔ BT lưu niên(diem)', BTV[dvBT.danhGia], lnBT.diem); }
  if (dvTV && dvBT) addP('TV đại vận ↔ BT đại vận', dvTV.diem, BTV[dvBT.danhGia]);
  if (thN) { addP('Tổng hợp năm (namNay.diem) ↔ TV tiểu vận', thN.diem, tvN.diem); inc('TongHop namNay ketLuan[0] mở đầu', String(thN.ketLuan[0]).split(/[–(]/)[0].trim()); }
  if (thN && hsn) { const a = String(thN.ketLuan[0]), b = String(hsn.tom[0]); const sa = /thử thách|thủ hơn/.test(a) ? -1 : /thuận|tốt|khởi sắc/.test(a) ? 1 : 0, sb = /thử thách|chắc hơn tiến/.test(b) ? -1 : /thuận/.test(b) ? 1 : 0;
    fl('Năm: "Năm theo 6 hệ" (tongHop.namNay) ↔ "Hồ sơ biến cố năm" cùng chiều', !(sa && sb && sa !== sb), tag + ' «' + a.slice(0, 90) + '» vs «' + b.slice(0, 90) + '»'); }
  if (thN && dvTV) { fl('Năm: TV tiểu vận "Tốt/Rất tốt" nhưng Tổng hợp năm "nhiều thử thách" (hoặc ngược lại)', !((DG_SO[tvN.danhGia] >= 1 && thN.diem < -0.3) || (DG_SO[tvN.danhGia] <= -1 && thN.diem > 0.3)), tag + ' TV ' + tvN.danhGia + ' / TH ' + thN.diem.toFixed(2)); }
  // 4. Văn (chỉ 10 lá đặt tên + 20 lá đầu ngẫu nhiên)
  if (idx < 30) {
    const add = (sec, o) => { texts[sec] = texts[sec] || []; texts[sec].push({ tag, s: new Set(sentences(walk(o, []).join('\n'))) }); };
    add('Bát Tự dễ hiểu (deHieu.battu)', DH.battu); add('Chiêm tinh dễ hiểu', DH.chiemTinh); add('Thần số dễ hiểu', DH.thanSo); add('Human Design dễ hiểu', DH.hd); add('Hà Lạc dễ hiểu', DH.haLac);
    add('Tổng hợp 6 hệ (th6, văn)', T6.linhVuc.map(x => [x.ket, x.manh, x.yeu, x.them, x.khuyen]));
    add('TV 12 cung chi tiết (chiTiet.cung.secs)', r.chiTiet.cung.map(c => c.secs));
    add('TV 26 bước (trinhTu)', r.chiTiet.trinhTu);
    add('BT 12 lĩnh vực chi tiết', r.battuChiTiet.linhVuc.map(l => l.secs));
    add('TongHop tính cách', TH.tinhCach); add('TongHop phối ngẫu', TH.phoiNgau); add('TongHop đường đời', TH.duongDoi);
    add('Hồ sơ biến cố năm', TH.hoSoNam); add('Hồ sơ 12 tháng', TH.hoSoThang);
    add('TV tiểu vận năm', r.chiTiet.tieuVan); add('TV 12 nguyệt vận', r.chiTiet.nguyetVan);
  }
});
// ---- In kết quả
const pct = (a, b) => (b ? Math.round(a / b * 1000) / 10 : 0) + '%';
console.log('=== N lá số =', inputs.length, '===');
console.log('\n## PHÂN BỐ NHÃN');
Object.keys(cnt).forEach(g => { const t = Object.values(cnt[g]).reduce((a, b) => a + b, 0); console.log(g + ': ' + Object.entries(cnt[g]).sort((a, b) => b[1] - a[1]).map(([k, v]) => k + ' ' + v + ' (' + pct(v, t) + ')').join(' · ')); });
console.log('\n## KIỂM MÂU THUẪN');
Object.keys(flag).forEach(g => { const f = flag[g]; console.log(g + ': ' + f.sai + '/' + f.n + ' (' + pct(f.sai, f.n) + ')'); f.vd.forEach(v => console.log('    vd: ' + v)); });
console.log('\n## TƯƠNG QUAN (Pearson)');
function pear(a) { const n = a.length, mx = a.reduce((t, p) => t + p[0], 0) / n, my = a.reduce((t, p) => t + p[1], 0) / n; let sxy = 0, sx = 0, sy = 0; a.forEach(([x, y]) => { sxy += (x - mx) * (y - my); sx += (x - mx) ** 2; sy += (y - my) ** 2; }); return { n, r: sx && sy ? (sxy / Math.sqrt(sx * sy)).toFixed(2) : 'n/a', mx: mx.toFixed(2), my: my.toFixed(2) }; }
Object.keys(pairs).forEach(g => { const p = pear(pairs[g]); const xs = pairs[g].map(q => q[0]).sort((a, b) => a - b); console.log(g + ': r=' + p.r + ' n=' + p.n + ' TBx=' + p.mx + ' TBy=' + p.my + ' | x: min ' + xs[0].toFixed(1) + ' p25 ' + xs[Math.floor(xs.length / 4)].toFixed(1) + ' p50 ' + xs[Math.floor(xs.length / 2)].toFixed(1) + ' p75 ' + xs[Math.floor(xs.length * 3 / 4)].toFixed(1) + ' max ' + xs[xs.length - 1].toFixed(1)); });
console.log('\n## ĐỘ TRÙNG VĂN giữa các lá số (câu giống hệt sau khi thay số bằng #; 30 lá)');
Object.keys(texts).forEach(sec => { const L = texts[sec]; let tot = 0, np = 0; const freq = {};
  L.forEach(x => x.s.forEach(c => freq[c] = (freq[c] || 0) + 1));
  for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) { const a = L[i].s, b = L[j].s; let inter = 0; a.forEach(c => { if (b.has(c)) inter++; }); const u = a.size + b.size - inter; tot += u ? inter / u : 0; np++; }
  const all = Object.keys(freq).length, cauTB = L.reduce((t, x) => t + x.s.size, 0) / L.length;
  const pho = Object.entries(freq).filter(([c, v]) => v >= L.length * 0.8);
  const tyLePho = L.reduce((t, x) => { let k = 0; x.s.forEach(c => { if (freq[c] >= L.length * 0.8) k++; }); return t + k / (x.s.size || 1); }, 0) / L.length;
  const rieng = L.reduce((t, x) => { let k = 0; x.s.forEach(c => { if (freq[c] === 1) k++; }); return t + k / (x.s.size || 1); }, 0) / L.length;
  console.log(sec + ': TB ' + cauTB.toFixed(0) + ' câu/lá · Jaccard TB giữa 2 lá ' + (tot / np * 100).toFixed(1) + '% · câu xuất hiện ở ≥80% lá chiếm ' + (tyLePho * 100).toFixed(1) + '% · câu chỉ riêng 1 lá ' + (rieng * 100).toFixed(1) + '% · ' + all + ' câu khác nhau');
  pho.sort((a, b) => b[1] - a[1]).slice(0, 2).forEach(([c, v]) => console.log('    phổ biến (' + v + '/' + L.length + '): ' + c.slice(0, 150)));
});
