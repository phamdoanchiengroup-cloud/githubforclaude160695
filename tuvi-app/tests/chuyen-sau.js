/**
 * Kiểm thử tab "👑 Lá số chủ sở hữu" (TuViChuyenSau.gs): bộ sao từng cung, 12 đại vận soi sao hạn, thọ khí, chặn người không phải chủ.
 * Chạy: node tests/chuyen-sau.js
 */
const path = require('path');
const { ctx } = require(path.join(__dirname, '..', 'tools', 'gia-lap.js'));
let ok = 0, sai = 0;
function kt(dk, msg) { if (dk) ok++; else { sai++; if (sai < 30) console.log('✗', msg); } }
const MUC = ['Êm', 'Cần để ý', 'Nặng', 'Rất nặng'], THO = ['Dồi dào', 'Khá', 'Vừa', 'Cần giữ gìn'];
const tenSao = p => new Set([].concat(p.chinh, p.cat, p.hung, p.tieu, p.vong || []).map(s => s.n));
const demMuc = {};
for (let i = 0; i < 300; i++) {
  const inp = { name: 'T' + i, gender: i % 2 ? 'nu' : 'nam', calendar: 'duong', day: 1 + (i * 11) % 28, month: 1 + (i * 5) % 12, year: 1940 + (i * 7) % 80, hour: (i * 3) % 24, minute: 0, viewYear: 2026 };
  const tv = ctx.tuviLapLaSo(inp), r = ctx.tvcsLap_(tv), P = tv.palaces;
  const id = '#' + i + ' ';
  kt(r.boSao.length === 12 && r.boSao[0].cung === 'Mệnh', id + '12 cung, bắt đầu từ Mệnh');
  // Bộ sao "đồng cung" chính tinh phải thật sự có mặt (ở cung hoặc cung xung chiếu khi vô chính diệu)
  r.boSao.forEach(c => {
    const pi = ctx.CHI.indexOf(c.chi), S = tenSao(P[pi]), X = tenSao(P[(pi + 6) % 12]);
    c.bo.forEach(b => {
      const lu = ctx.TVCS_BO_SAO.filter(x => x.ten === b.ten)[0];
      kt(!!lu, id + 'bộ ' + b.ten + ' có trong bảng');
      (lu.d || []).forEach(n => kt(S.has(n) || (ctx.SAO[n][1] === 'chinh' && !P[pi].chinh.length && X.has(n)), id + c.cung + ': bộ ' + b.ten + ' thiếu ' + n));
      if (lu.chi) kt(lu.chi.indexOf(pi) >= 0, id + b.ten + ' sai địa chi');
      if (lu.o) kt(lu.o.indexOf(c.cung) >= 0 || (lu.o.indexOf('Thân') >= 0 && c.than), id + b.ten + ' xét sai cung ' + c.cung);
      kt(['cat', 'hung', 'trung'].indexOf(b.loai) >= 0 && b.y, id + b.ten + ' có loại và ý nghĩa');
    });
  });
  // Thương ở Nô Bộc, Sứ ở Tật Ách; Thiên Di luôn bị kẹp
  const pNo = P.findIndex(p => p.cung === 'Nô Bộc'), pTat = P.findIndex(p => p.cung === 'Tật Ách'), pDi = P.findIndex(p => p.cung === 'Thiên Di');
  kt(tv.pos['Thiên Thương'] === pNo && tv.pos['Thiên Sứ'] === pTat, id + 'Thương ở Nô, Sứ ở Tật');
  kt([(pDi + 1) % 12, (pDi + 11) % 12].sort().join() === [pNo, pTat].sort().join(), id + 'Thương – Sứ kẹp Thiên Di');
  kt(r.daiVan.length >= 9 && r.daiVan.every((v, k) => v.stt === k + 1 && v.den === v.tu + 9 && MUC.indexOf(v.muc) >= 0), id + 'đại vận đủ, liên tiếp, mức hợp lệ');
  kt(r.daiVan.filter(v => v.hienTai).length <= 1, id + 'tối đa một vận đang đi');
  r.daiVan.forEach(v => {
    demMuc[v.muc] = (demMuc[v.muc] || 0) + 1;
    if (v.cung === 'Thiên Di') kt(v.dau.some(x => /kẹp/.test(x)), id + 'vận ở Thiên Di phải nêu Thương – Sứ kẹp');
    if (v.cung === 'Tật Ách') kt(v.han.some(h => h.sao === 'Thiên Sứ'), id + 'vận ở Tật Ách có Thiên Sứ');
    if (v.stt === 6) kt(v.dau.some(x => /thứ sáu/.test(x)), id + 'đại vận thứ sáu có lời nhắc');
    kt(v.dvKy && v.dvKy.sao && v.dvLoc && v.dvLoc.sao, id + 'có Hóa Kỵ – Hóa Lộc của vận');
    v.nam.forEach(n => kt(n.tuoi >= v.tu && n.tuoi <= v.den && n.nam === r.namSinh + n.tuoi - 1 && n.ly.length, id + 'năm hệ trọng nằm trong vận'));
    kt(v.han.every(h => h.y), id + 'sao hạn có lời giải');
  });
  kt(THO.indexOf(r.tho.muc) >= 0 && /bác sĩ/.test(r.tho.luuY), id + 'thọ khí có mức và lời lưu ý');
  const van = JSON.stringify(r);
  kt(!/(tử vong|chết|qua đời|tuổi thọ là|sống đến)/i.test(van), id + 'không đoán tuổi mất');
  kt(r.nguon.length >= 5 && r.nguon.every(n => /^https:\/\//.test(n.url)), id + 'có nguồn tham khảo');
}
// Phân bố mức đại vận không dồn về "nặng"
const tong = Object.values(demMuc).reduce((a, b) => a + b, 0);
kt((demMuc['Rất nặng'] || 0) / tong < 0.08, 'Rất nặng < 8% số vận (' + JSON.stringify(demMuc) + ')');
kt((demMuc['Êm'] || 0) / tong > 0.15, 'Êm > 15% số vận');
// Bản công khai gộp vào 26 bước: lời dễ hiểu không tên sao, vận chưa mở bị cắt
const TEN_SAO = Object.keys(ctx.SAO).filter(n => n.split(' ').length >= 2 && !['Phúc Đức', 'Long Đức', 'Thái Tuế', 'Tràng Sinh', 'Mộc Dục', 'Quan Đới', 'Lâm Quan', 'Đế Vượng', 'Bác Sĩ', 'Lực Sĩ', 'Tướng Quân', 'Hỷ Thần', 'Quan Phủ', 'Quan Phù', 'Tử Phù', 'Trực Phù', 'Thiếu Dương', 'Thiếu Âm', 'Thiên Tài', 'Thiên Phúc', 'Thiên Quan'].includes(n));
const coTenSao = t => TEN_SAO.filter(n => t.indexOf(n) >= 0);
for (let i = 0; i < 60; i++) {
  const inp = { name: 'C' + i, gender: i % 2 ? 'nu' : 'nam', calendar: 'duong', day: 1 + (i * 13) % 28, month: 1 + (i * 7) % 12, year: 1950 + (i * 9) % 60, hour: (i * 5) % 24, minute: 0, viewYear: 2026 };
  const r = ctx.lapLaSoDayDu_(inp), CT = r.chiTiet;
  kt(CT.boSao && Object.keys(CT.boSao).length === 12 && CT.saoHan && CT.saoHan.length >= 9, '#C' + i + ' có boSao 12 cung và saoHan');
  Object.values(CT.boSao).forEach(ds => ds.forEach(b => { const s = coTenSao(b.de + ' ' + b.khuyen); kt(!s.length && b.de, '#C' + i + ' bộ ' + b.ten + ' lời dễ hiểu có tên sao: ' + s); }));
  CT.saoHan.forEach(v => { const s = coTenSao(v.de); kt(!s.length, '#C' + i + ' sao hạn công khai có tên sao: ' + s + ' | ' + v.de); kt(!/Rất nặng|chết|tử vong/.test(v.de + v.muc), '#C' + i + ' sao hạn công khai dùng chữ nặng'); });
  kt(CT.trinhTu.buoc.length === 26 && CT.trinhTu.buoc.filter(b => b.gop).length === 16, '#C' + i + ' 26 bước, 16 bước có gộp');
  const cungGop = [].concat(...CT.trinhTu.buoc.map(b => (b.gop && b.gop.cung) || []));
  kt(cungGop.length === 12 && new Set(cungGop).size === 12, '#C' + i + ' 12 cung đều được gộp đúng một lần: ' + cungGop);
  if (i < 10) {   // khách chưa đăng nhập: vận chưa mở chỉ còn khung
    const k = ctx.lapLaSo(inp, '');
    const sh = (k.chiTiet && k.chiTiet.saoHan) || [];
    kt(sh.length && sh.every(v => v.khoa && !v.de && !v.ky), '#C' + i + ' khách: saoHan bị cắt');
  }
}
// Chặn người không phải chủ sở hữu
let chan = false;
try { ctx.tuViChuSoHuu({ day: 1, month: 1, year: 1990, hour: 8, calendar: 'duong' }, ''); } catch (e) { chan = /đăng nhập|chủ sở hữu/.test(e.message); }
kt(chan, 'tuViChuSoHuu chặn khi chưa đăng nhập');
console.log('Lá số chủ sở hữu: đạt ' + ok + '/' + (ok + sai), JSON.stringify(demMuc));
process.exit(sai ? 1 : 0);
