// Nghiệm chứng: 8 nhóm có phân biệt được giờ sinh không? + mô phỏng cách chấm. + Giờ Tý muộn. Chạy: node logic-nghiem-chung.js
const { ctx } = require('/home/user/githubforclaude160695/tuvi-app/tools/gia-lap.js');
const NG = [['nam', 12, 3, 1990], ['nu', 25, 7, 1995], ['nam', 3, 11, 1985], ['nu', 9, 10, 1983], ['nam', 22, 2, 1993]];
const sach = t => String(t).replace(/\d+([.,]\d+)?/g, '#');
console.log('## 1. Văn 8 nhóm qua 12 giờ sinh (cùng ngày)');
const tong = {}, keDong = {};
NG.forEach(([g, d, m, y]) => {
  const ds = [];
  for (let h = 0; h < 12; h++) { const hour = h === 0 ? 0 : h * 2; ds.push(ctx.nghiemChungLap_({ name: 'x', gender: g, calendar: 'duong', day: d, month: m, year: y, hour, minute: 30, viewYear: 2026 }).doan); }
  ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].forEach((ma, i) => {
    const v = ds.map(x => x[i].text), kh = new Set(v).size;
    let ke = 0; for (let h = 0; h < 12; h++) if (v[h] === v[(h + 1) % 12]) ke++;
    // tỉ lệ câu (dòng) chung giữa hai giờ kề nhau
    let chung = 0, n = 0; for (let h = 0; h < 12; h++) { const a = new Set(ds[h][i].dong.map(z => sach(z.t))), b = new Set(ds[(h + 1) % 12][i].dong.map(z => sach(z.t))); let c = 0; a.forEach(z => { if (b.has(z)) c++; }); chung += (a.size + b.size - c) ? c / (a.size + b.size - c) : 1; n++; }
    (tong[ma] = tong[ma] || []).push(kh); (keDong[ma] = keDong[ma] || []).push(chung / n);
  });
});
['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].forEach(ma => console.log(ma + ' ' + ctx.NC_TEN_NHOM[ma] + ': số bản văn khác nhau trên 12 giờ (5 ngày) = ' + tong[ma].join(',') + ' · câu chung giữa 2 giờ kề nhau TB ' + (keDong[ma].reduce((a, b) => a + b, 0) / keDong[ma].length * 100).toFixed(0) + '%'));
// Giữa các NGƯỜI khác nhau: nhóm B có bao nhiêu câu phổ biến
console.log('\n## 2. Câu nghiệm chứng giống nhau giữa NGƯỜI khác nhau (40 lá ngẫu nhiên)');
let s = 3; const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
const freq = {}, perG = {}; let nla = 40, vdPct = [], vdCon = [];
for (let k = 0; k < nla; k++) {
  const r = ctx.nghiemChungLap_({ name: 'x', gender: k % 2 ? 'nu' : 'nam', calendar: 'duong', day: 1 + Math.floor(rnd() * 28), month: 1 + Math.floor(rnd() * 12), year: 1966 + Math.floor(rnd() * 38), hour: Math.floor(rnd() * 24), minute: 10, viewYear: 2026 });
  r.doan.forEach(g => { const seen = new Set(); g.dong.forEach(z => { const c = g.ma + '|' + sach(z.t); if (seen.has(c)) return; seen.add(c); freq[c] = (freq[c] || 0) + 1; perG[g.ma] = (perG[g.ma] || 0) + 1; });
    if (/%/.test(g.text) && vdPct.length < 3) vdPct.push(g.ma + ': ' + g.text.match(/[^.]*%[^.]*/)[0].slice(0, 160));
    if (/Số con|Trai – gái|con trai|con gái/i.test(g.text) && vdCon.length < 3) vdCon.push(g.ma + ': ' + (g.text.match(/(Số con|Trai – gái)[^.]*\./) || [g.text.slice(0, 120)])[0]); });
}
['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].forEach(ma => { const ds = Object.entries(freq).filter(([c]) => c[0] === ma), pho = ds.filter(([, v]) => v >= nla * 0.25);
  const tl = pho.reduce((t, [, v]) => t + v, 0) / (perG[ma] || 1);
  console.log(ma + ': ' + ds.length + ' câu khác nhau / ' + perG[ma] + ' lượt; câu gặp ở ≥25% số người chiếm ' + (tl * 100).toFixed(0) + '% lượt' + (pho[0] ? ' · vd (' + pho.sort((a, b) => b[1] - a[1])[0][1] + '/40): ' + pho[0][0].slice(2, 150) : '')); });
console.log('Ví dụ % hiển thị cho khách: '); vdPct.forEach(v => console.log('   ' + v));
console.log('Ví dụ số con / trai–gái trong nhóm G: '); vdCon.forEach(v => console.log('   ' + v));
// 3. Mô phỏng chấm
console.log('\n## 3. Mô phỏng cách chấm (nghiemChungTinhDiem_)');
const MUC = ['dung_het', 'dung_phan_lon', 'dung_mot_nua', 'sai_phan_lon', 'sai_hoan_toan'];
function mp(ten, gen, lan) { const kq = {}; for (let i = 0; i < lan; i++) { const a = gen(); a._doTin = { A: .6, B: .7, C: .6, D: .6, E: .5, F: .6, G: .6, H: .6 }; const r = ctx.nghiemChungTinhDiem_(a); kq[r.ketLuan] = (kq[r.ketLuan] || 0) + 1; } console.log(ten + ': ' + Object.entries(kq).map(([k, v]) => k + ' ' + (v / lan * 100).toFixed(0) + '%').join(' · ')); }
mp('Chọn ngẫu nhiên đều 5 mức, 8 nhóm', () => { const a = {}; 'ABCDEFGH'.split('').forEach(m => a[m] = MUC[Math.floor(Math.random() * 5)]); return a; }, 20000);
mp('Người dễ đồng ý (Barnum): 45% đúng phần lớn, 25% đúng hết, 20% một nửa, 10% sai phần lớn', () => { const a = {}; 'ABCDEFGH'.split('').forEach(m => { const x = Math.random(); a[m] = x < .25 ? 'dung_het' : x < .7 ? 'dung_phan_lon' : x < .9 ? 'dung_mot_nua' : 'sai_phan_lon'; }); return a; }, 20000);
mp('Người trẻ: F,G không áp dụng, 6 nhóm còn lại ngẫu nhiên đều', () => { const a = { F: 'khong_ap_dung', G: 'khong_ap_dung' }; 'ABCDEH'.split('').forEach(m => a[m] = MUC[Math.floor(Math.random() * 5)]); return a; }, 20000);
mp('Chỉ chấm 4 nhóm (4 nhóm kia "không áp dụng"), ngẫu nhiên đều', () => { const a = { E: 'khong_ap_dung', F: 'khong_ap_dung', G: 'khong_ap_dung', H: 'khong_ap_dung' }; 'ABCD'.split('').forEach(m => a[m] = MUC[Math.floor(Math.random() * 5)]); return a; }, 20000);
const r1 = ctx.nghiemChungTinhDiem_({ A: 'dung_het', B: 'dung_het', C: 'dung_phan_lon', D: 'sai_hoan_toan', E: 'khong_ap_dung', F: 'khong_ap_dung', G: 'khong_ap_dung', H: 'khong_ap_dung', _doTin: {} });
console.log('Ca biên: 4 nhóm chấm, 3 đúng cao + 1 sai hoàn toàn → ' + r1.ketLuan + ' (' + r1.pct + '%)');
const r2 = ctx.nghiemChungTinhDiem_({ A: 'dung_phan_lon', B: 'dung_phan_lon', C: 'dung_phan_lon', D: 'dung_phan_lon', E: 'dung_phan_lon', F: 'dung_phan_lon', G: 'dung_mot_nua', H: 'dung_mot_nua', _doTin: {} });
console.log('Ca biên: 6/8 "đúng phần lớn" + 2 "một nửa" → ' + r2.ketLuan + ' (' + r2.pct + '%)');
// 4. Giờ Tý muộn
console.log('\n## 4. Giờ Tý muộn');
[[3, 11, 1985, 'nam'], [19, 1, 2000, 'nu'], [31, 12, 1999, 'nam'], [3, 2, 1992, 'nu']].forEach(([d, m, y, g]) => {
  const run = (dd, mm, yy, h, mi) => ctx.lapLaSoDayDu_({ name: 'x', gender: g, calendar: 'duong', day: dd, month: mm, year: yy, hour: h, minute: mi, viewYear: 2026 });
  const a = run(d, m, y, 22, 50), b = run(d, m, y, 23, 30); const nd = new Date(Date.UTC(y, m - 1, d + 1)); const c = run(nd.getUTCDate(), nd.getUTCMonth() + 1, nd.getUTCFullYear(), 0, 30);
  const f = r => { const I = r.tuvi.info, p = r.battu.pillars; return 'âm ' + I.lunar.day + '/' + I.lunar.month + ' · Mệnh ' + I.menh + ' · cục ' + I.cuc + ' · trụ ' + p.map(x => x.canTen + ' ' + x.chiTen).join('|') + ' · TSH đường đời ' + (r.moRong.thanSo && (r.moRong.thanSo.duongDoi || r.moRong.thanSo.lifePath || '')).toString().slice(0, 6) + ' · ASC ' + (r.moRong.chiemTinh.asc && (r.moRong.chiemTinh.asc.cung || r.moRong.chiemTinh.asc.ten || JSON.stringify(r.moRong.chiemTinh.asc).slice(0, 30))) + ' · HD ' + r.moRong.hd.loaiTen + ' ' + r.moRong.hd.profile; };
  console.log(d + '/' + m + '/' + y + ' ' + g); console.log('  22:50  ' + f(a)); console.log('  23:30  ' + f(b)); console.log('  00:30+1 ' + f(c)); console.log('  ghi chú 23:30: ' + (b.tuvi.info.notes || b.tuvi.notes || []).join(' | ').slice(0, 200));
});
