/**
 * Kiểm thử Hà Lạc – lục hào nạp giáp: bát cung, Thế Ứng, nạp giáp, lục thân, phục thần, luận lĩnh vực.
 * Chạy: node tests/ha-lac.js
 */
const path = require('path');
const { ctx } = require(path.join(__dirname, '..', 'tools', 'gia-lap.js'));
let ok = 0, sai = 0;
function kt(dk, msg) { if (dk) ok++; else { sai++; if (sai < 20) console.log('✗', msg); } }
// 1. Bát cung: 64 quẻ, mỗi cung 8 quẻ
const M = ctx.hlCungMap_(), dem = {};
Object.values(M).forEach(v => { dem[v.cung] = (dem[v.cung] || 0) + 1; });
kt(Object.keys(M).length === 64, '64 quẻ');
Object.keys(dem).forEach(k => kt(dem[k] === 8, 'cung ' + k + ' đủ 8 quẻ'));
function q(t, d) { return ctx.hlTuHao_(ctx.hlHaoCua_(t, d)); }
// 2. Mẫu kinh điển
[['Khảm', 'Chấn', 'Khảm', 'Nhị thế'], ['Ly', 'Khảm', 'Ly', 'Tam thế'], ['Khôn', 'Càn', 'Khôn', 'Tam thế'], ['Ly', 'Khôn', 'Càn', 'Du hồn'],
 ['Ly', 'Càn', 'Càn', 'Quy hồn'], ['Càn', 'Tốn', 'Càn', 'Nhất thế'], ['Khôn', 'Cấn', 'Đoài', 'Ngũ thế'], ['Đoài', 'Chấn', 'Chấn', 'Quy hồn']
].forEach(([t, d, c, th]) => { const m = M[q(t, d).hao.join('')]; kt(m.cung === c && ctx.HL_THE_TEN[m.the] === th, q(t, d).ten + ' → ' + c + ' ' + th + ' (được ' + m.cung + ' ' + ctx.HL_THE_TEN[m.the] + ')'); });
// 3. Thiên Phong Cấu: nạp giáp, lục thân, phục thần Thê Tài Giáp Dần dưới hào 2
const bt = { pillars: [{ can: 0, chi: 0 }, { can: 2, chi: 2 }, { can: 0, chi: 0 }, { can: 0, chi: 0 }] };
const L = ctx.hlLucHao_(q('Càn', 'Tốn'), 1, bt);
kt(L.hao.map(h => h.canChi).join(',') === 'Tân Sửu,Tân Hợi,Tân Dậu,Nhâm Ngọ,Nhâm Thân,Nhâm Tuất', 'nạp giáp Cấu');
kt(L.hao.map(h => h.lucThan).join(',') === 'Phụ Mẫu,Tử Tôn,Huynh Đệ,Quan Quỷ,Huynh Đệ,Phụ Mẫu', 'lục thân Cấu');
kt(L.theVi === 1 && L.ungVi === 4, 'Thế 1 Ứng 4');
kt(L.phuc.length === 1 && L.phuc[0].lucThan === 'Thê Tài' && L.phuc[0].vi === 2 && L.phuc[0].canChi === 'Giáp Dần', 'phục thần Cấu');
kt(L.hao[0].thu === 'Thanh Long' && L.hao[5].thu === 'Huyền Vũ', 'lục thú ngày Giáp');
kt(L.khongVong.join(',') === 'Tuất,Hợi', 'không vong tuần Giáp Tý');
kt(L.hao[0].hoa.canChi === 'Giáp Tý', 'hào 1 động hóa Giáp Tý');
// 4. Nhiều lá số: cấu trúc luận
let s = 11; const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
const bac = { tot: 0, vua: 0, kho: 0 };
for (let k = 0; k < 200; k++) {
  const inp = { name: 'A', gender: k % 2 ? 'nu' : 'nam', calendar: 'duong', day: 1 + Math.floor(rnd() * 28), month: 1 + Math.floor(rnd() * 12), year: 1940 + Math.floor(rnd() * 80), hour: Math.floor(rnd() * 24), minute: 0, viewYear: 2026 };
  const b = ctx.batTuLap(inp), tv = ctx.tuviLapLaSo(inp), hl = ctx.haLacLap(b, tv), Lu = ctx.haLacLuan(hl, b, 2026);
  ['tien', 'hau'].forEach(x => {
    const H = hl.lucHao[x];
    kt(H.hao.length === 6 && H.hao.filter(h => h.the).length === 1 && H.hao.filter(h => h.ung).length === 1, 'Thế/Ứng duy nhất');
    kt(Math.abs(H.theVi - H.ungVi) === 3, 'Thế Ứng cách 3');
    kt(H.hao.filter(h => h.dong).length === 1 && H.hao[H.dong - 1].hoa, 'một hào động có hào hóa');
    const co = new Set(H.hao.map(h => h.lucThan).concat(H.phuc.map(p => p.lucThan)));
    kt(co.size === 5, 'đủ 5 lục thân (kể cả phục thần)');
  });
  kt(Lu.linhVuc.length === 8, '8 lĩnh vực');
  Lu.linhVuc.forEach(v => {
    bac[v.bac]++;
    kt(v.van && v.khuyen && isFinite(v.diem), 'lĩnh vực có văn và điểm');
    kt(!/Quan Quỷ|Thê Tài|Tử Tôn|Huynh Đệ|Phụ Mẫu|Thế|Ứng/.test(v.van + v.them.join(' ') + v.khuyen), 'văn dễ hiểu không chứa thuật ngữ: ' + v.ten);
    kt((v.bac === 'tot') === (v.diem >= 0.8) && (v.bac === 'kho') === (v.diem < -0.6), 'mức khớp điểm');
  });
  kt(Lu.daiVan.every(d => d.lucThan), 'đại vận có lục thân');
  kt(Lu.queKhac.length === 3 && Lu.thoiVi.ds.length === 2, 'quẻ Biến/Thác/Tổng & thời vị');
}
kt(bac.tot > 200 && bac.kho > 200 && bac.vua > 200, 'phân bố tốt/vừa/khó không lệch: ' + JSON.stringify(bac));
console.log('Hà Lạc lục hào: đạt ' + ok + '/' + (ok + sai) + ' · ' + JSON.stringify(bac));
process.exit(sai ? 1 : 0);
