/**
 * Kiểm thử thần sát Bát Tự (BatTuThanSat.gs): dữ liệu, cách an đối chiếu khẩu quyết độc lập, gắn vào batTuLap, từ điển.
 * Chạy: node tests/than-sat.js
 */
const path = require('path');
const { ctx } = require(path.join(__dirname, '..', 'tools', 'gia-lap.js'));
let ok = 0, sai = 0;
function kt(dk, msg) { if (dk) ok++; else { sai++; if (sai < 30) console.log('✗', msg); } }
const CAN = ctx.CAN, CHI = ctx.CHI, DS = ctx.THS_DS;

// 1. Dữ liệu
kt(DS.length >= 128, 'ít nhất 128 sao (có ' + DS.length + ')');
const ten = new Set();
DS.forEach(e => {
  kt(!ten.has(e.t), 'trùng tên ' + e.t); ten.add(e.t);
  kt(['cat', 'hung', 'trung'].includes(e.l), e.t + ' loại');
  kt(['tb', 'tt', 'hd', 'tr', 'nh'].includes(e.n), e.t + ' nhóm');
  kt(['tatCa', 'conLai', 'vongGio', 'ngay', 'ngayGio', 'tuDien'].includes(e.a), e.t + ' trụ áp dụng');
  kt(e.y && e.an && e.de, e.t + ' có nghĩa, cách an, câu dễ hiểu');
  kt(e.l === 'cat' || e.k, e.t + ' (hung/trung) có hướng cân bằng');
});
// Câu dễ hiểu không nêu tên sao (bỏ qua tên trực trùng từ thường: Định, Thành, Bình…)
const TU_THUONG = new Set(['Kiến', 'Trừ', 'Mãn', 'Bình', 'Định', 'Chấp', 'Phá', 'Nguy', 'Thành', 'Khai', 'Bế', 'Thâu']);
const tenSao = new Set();
DS.forEach(e => e.t.split(/ \(|\)/).map(w => w.trim()).forEach(w => { if (w.length > 3 && !TU_THUONG.has(w)) tenSao.add(w); }));
DS.forEach(e => tenSao.forEach(w => kt(e.de.indexOf(w) < 0 && (e.k || '').indexOf(w) < 0, e.t + ': câu dễ hiểu nêu tên sao "' + w + '"')));

// 2. Cách an – đối chiếu khẩu quyết độc lập
const QUY = { 0: [1, 7], 4: [1, 7], 6: [1, 7], 1: [0, 8], 5: [0, 8], 2: [11, 9], 3: [11, 9], 8: [5, 3], 9: [5, 3], 7: [6, 2] };   // Giáp Mậu Canh ngưu dương…
const LOC = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0];   // Dương Nhẫn = Lộc tiến 1 (Tam Mệnh Thông Hội, cả can âm)
let soSao = 0;
for (let i = 0; i < 600; i++) {
  const P = [0, 1, 2, 3].map(k => { const c = (i * 7 + k * 13 + (i >> 3)) % 10, z = (c % 2 + 2 * ((i * 5 + k * 3 + (i >> 2)) % 6)) % 12; return { can: c, chi: z }; });
  const T = ctx.thsTheoTru_(P, i % 2 === 0), co = (k, t) => T[k].some(x => x.t === t), id = '#' + i + ' ' + P.map(p => CAN[p.can] + ' ' + CHI[p.chi]).join(' | ') + ': ';
  kt(T.length === 4 && T.every(d => Array.isArray(d)), id + '4 danh sách');
  T.forEach((d, k) => { soSao += d.length; kt(new Set(d.map(x => x.t)).size === d.length, id + 'trùng sao trong trụ ' + k); });
  [0, 1, 2, 3].forEach(k => {
    const qn = QUY[P[2].can].includes(P[k].chi) || QUY[P[0].can].includes(P[k].chi);
    kt(co(k, 'Thiên Ất Quý Nhân') === qn, id + 'Thiên Ất trụ ' + k);
    kt(co(k, 'Lộc Thần (Kiến Lộc)') === (LOC[P[2].can] === P[k].chi), id + 'Lộc Thần trụ ' + k);
    kt(co(k, 'Dương Nhẫn') === ((LOC[P[2].can] + 1) % 12 === P[k].chi), id + 'Dương Nhẫn trụ ' + k);
    kt(co(k, 'Thái Tuế') === (k > 0 && P[k].chi === P[0].chi), id + 'Thái Tuế trụ ' + k);
    kt(co(k, 'Kiến') === (k === 2 && P[2].chi === P[1].chi), id + 'trực Kiến trụ ' + k);
    kt(!co(k, 'Khôi Cương') || k === 2, id + 'Khôi Cương chỉ ở trụ ngày');
  });
  const kv = [(P[2].chi - P[2].can + 10) % 12, (P[2].chi - P[2].can + 11) % 12];
  [0, 1, 3].forEach(k => kt(co(k, 'Không Vong') === kv.includes(P[k].chi), id + 'Không Vong trụ ' + k));
  kt(!co(2, 'Không Vong'), id + 'trụ ngày không tự phạm Không Vong');
  kt(T.every(d => !d.some(x => x.t === 'Kình Dương')), id + 'Kình Dương chỉ trong từ điển');
}
kt(soSao / 2400 > 5 && soSao / 2400 < 30, 'trung bình mỗi trụ 5–30 sao (' + (soSao / 2400).toFixed(1) + ')');

// Đức Tú: một can vừa Đức vừa Tú không tự thành sao
{ const T = ctx.thsTheoTru_([{ can: 5, chi: 1 }, { can: 1, chi: 0 }, { can: 6, chi: 2 }, { can: 3, chi: 4 }], true);   // Kỷ Sửu | Ất Tý | Canh Dần | Đinh Thìn
  kt(!T.some(d => d.some(x => x.t === 'Đức Tú Quý Nhân')), 'Đức Tú cần hai trụ khác nhau'); }

// 3. Gắn vào batTuLap + từ điển
for (let i = 0; i < 40; i++) {
  const inp = { name: 'T' + i, gender: i % 2 ? 'nu' : 'nam', calendar: 'duong', day: 1 + (i * 11) % 28, month: 1 + (i * 5) % 12, year: 1950 + (i * 7) % 70, hour: (i * 3) % 24, minute: 0, viewYear: 2026 };
  const B = ctx.batTuLap(inp);
  kt(!B.thanSatLoi && B.thanSatTru && B.thanSatTru.length === 4, '#' + i + ' batTuLap có thần sát theo trụ');
  B.thanSatTru.forEach(d => d.forEach(x => kt(B.thanSatNghia[x.t] && B.thanSatNghia[x.t].y, '#' + i + ' có nghĩa cho ' + x.t)));
  // Cung vị / 12 lĩnh vực / lưu niên (btctThanSat_) phải cùng vị trí với bảng thần sát mới – bài luận không tự mâu thuẫn
  ctx.btctThanSat_(B, null).forEach(t => t.tru.forEach(k => kt(B.thanSatTru[k].some(x => (ctx.BTCT_TEN_MOI[x.t] || x.t) === t.ten), '#' + i + ' ' + t.ten + ' ở trụ ' + k + ' khớp bảng mới')));
  B.thanSatTru.forEach((d, k) => d.filter(x => x.n === 'tb' || x.n === 'tt').forEach(x => kt(ctx.btctThanSat_(B, null).some(t => t.ten === (ctx.BTCT_TEN_MOI[x.t] || x.t) && t.tru.includes(k)), '#' + i + ' ' + x.t + ' có trong luận cung vị')));
}
const TD = ctx.thamKhaoThanSat();
kt(TD.ds.length === DS.length && TD.ds.every(x => x.t && x.an && x.y), 'từ điển đủ sao, có cách an');
kt(TD.nguon.length >= 3 && TD.nguon.every(n => !/huyenco/i.test(n.ten + (n.url || ''))), 'nguồn tham khảo là cổ thư/tra cứu, không lấy trang khác làm nguồn');

console.log('Thần sát: đạt ' + ok + '/' + (ok + sai));
process.exit(sai ? 1 : 0);
