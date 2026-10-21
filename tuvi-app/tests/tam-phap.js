/**
 * Kiểm thử Tử Vi đối chiếu các phái (TuViTamPhap.gs › tpLap_, kết quả chiTiet.tamPhap):
 * ba vòng nhân sinh, tám thế Mệnh – Thân, vận Thái Tuế, Lai Nhân cung, tự hóa, phi hóa.
 * Đối chiếu Lai Nhân cung với iztro (isOriginalPalace) nếu đã npm install trong tests/.
 * Chạy: node tests/tam-phap.js
 */
const path = require('path');
const { ctx } = require(path.join(__dirname, '..', 'tools', 'gia-lap.js'));
let ok = 0, sai = 0;
function kt(dk, msg) { if (dk) ok++; else { sai++; if (sai < 25) console.log('✗', msg); } }
const SAO = /Thái Tuế|Quan Phù|Bạch Hổ|Thiếu Dương|Tử Phù|Phúc Đức|Tang Môn|Tuế Phá|Điếu Khách|Thiếu Âm|Long Đức|Trực Phù|Lộc Tồn|Bác Sĩ|Tướng Quân|Bệnh Phù|Lực Sĩ|Tấu Thư|Đại Hao|Thanh Long|Phi Liêm|Phục Binh|Tiểu Hao|Hỷ Thần|Quan Phủ|Tràng Sinh|Đế Vượng|Mộc Dục|Tử Vi|Thiên Cơ|Thái Dương|Vũ Khúc|Thiên Đồng|Liêm Trinh|Thiên Phủ|Thái Âm|Tham Lang|Cự Môn|Thiên Tướng|Thiên Lương|Thất Sát|Phá Quân|Văn Xương|Văn Khúc|Tả Phù|Hữu Bật|Hóa /;
// Tên cung (Phúc Đức trùng tên sao) không tính là nêu tên sao
const boCung = t => ctx.CUNG_NAMES.reduce((a, c) => a.split(c).join('·'), t);
let iz = null;
try { iz = require(path.join(__dirname, 'node_modules', 'iztro')); } catch (e) { console.log('(bỏ qua đối chiếu iztro – chưa npm install trong tests/)'); }

let s = 11; const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
const theDem = {}, nhomDem = [0, 0, 0, 0];
let soIz = 0;
for (let k = 0; k < 300; k++) {
  const inp = { name: 'K' + k, gender: k % 2 ? 'nu' : 'nam', calendar: 'duong', day: 1 + Math.floor(rnd() * 28), month: 1 + Math.floor(rnd() * 12), year: 1940 + Math.floor(rnd() * 80), hour: Math.floor(rnd() * 24), minute: 30, viewYear: 2026 };
  const chart = ctx.tuviLapLaSo(inp), I = chart.info, P = chart.palaces;
  const dv = ctx.lgDaiVan_(chart, null), T = ctx.tpLap_(chart, dv);
  kt(T && T.baVong && T.phiTinh && T.vanThaiTue, 'đủ ba phần');
  kt(!/undefined|NaN|null\b/.test(JSON.stringify([T.baVong.de, T.vanThaiTue.map(v => v.de), T.phiTinh])), 'không undefined/NaN: ' + k);
  // Ba vòng: sao vòng Thái Tuế tại Mệnh thuộc đúng nhóm
  const nm = (I.menh - I.yChi + 12) % 4;
  kt(ctx.TP_TT_NHOM[nm].sao.indexOf(P[I.menh].thaiTue) >= 0, 'sao Thái Tuế tại Mệnh thuộc nhóm ' + ctx.TP_TT_NHOM[nm].ten);
  kt(ctx.TP_LT_NHOM.some(n => n.ten === T.baVong.menh.lt && n.sao.indexOf(P[I.menh].bacSi) >= 0), 'sao vòng Lộc Tồn tại Mệnh thuộc đúng nhóm');
  kt(ctx.TP_TS_NHOM.some(n => n.ten === T.baVong.menh.ts && n.sao.indexOf(P[I.menh].trangSinh) >= 0), 'sao Tràng Sinh tại Mệnh thuộc đúng nhóm');
  nhomDem[nm]++;
  // Mệnh – Di luôn đối nhóm (Tuế ↔ Tang, Dương ↔ Âm)
  const di = (I.menh + 6) % 12;
  kt(ctx.TP_TT_NHOM[(nm + 2) % 4].sao.indexOf(P[di].thaiTue) >= 0, 'Thiên Di ở nhóm đối');
  theDem[T.baVong.the.ma] = (theDem[T.baVong.the.ma] || 0) + 1;
  // Văn dễ hiểu không nêu tên sao
  T.baVong.de.forEach(d => kt(!SAO.test(d.v), 'dễ hiểu ba vòng không nêu tên sao: ' + d.v.slice(0, 60)));
  T.vanThaiTue.forEach(v => kt(!SAO.test(v.de), 'dễ hiểu vận không nêu tên sao'));
  const F = T.phiTinh;
  [].concat(F.laiNhan ? [F.laiNhan.de] : [], F.tuHoa.map(x => x.de), F.menhPhi, F.nhapMenh, F.kyXung, F.khac).forEach(t => kt(!SAO.test(boCung(t)), 'dễ hiểu Phi Tinh không nêu tên sao: ' + t.slice(0, 60)));
  // Vận Thái Tuế: 12 đại vận, đúng 3 vận đắc thời (3 cung tam hợp tuổi)
  kt(T.vanThaiTue.length === dv.filter(d => parseInt(d.khoang, 10) <= 90).length, 'đại vận đến 90 tuổi');
  kt(T.vanThaiTue.filter(v => v.dacThoi).length >= 2 && T.vanThaiTue.filter(v => v.dacThoi).length <= 3, '2–3 đại vận đắc thời trong đời');
  T.vanThaiTue.forEach(v => { const pi = ctx.CHI.indexOf(dv.find(d => d.khoang === v.khoang).chi); kt(v.dacThoi === (((pi - I.yChi) % 4 + 4) % 4 === 0), 'cờ đắc thời đúng tam hợp tuổi'); });
  // Lai Nhân cung: can cung trùng can năm, chỉ một cung trong Dần..Hợi
  const ln = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11].filter(i => P[i].can === I.yCan);
  kt(ln.length === 1, 'đúng một Lai Nhân cung');
  kt(F.laiNhan && F.laiNhan.cung === P[ln[0]].cung, 'Lai Nhân cung đúng');
  // Tự hóa: tính lại độc lập
  let tu = 0;
  for (let i = 0; i < 12; i++) chart.tuHoa[P[i].can].forEach(sao => { if (chart.pos[sao] === i) tu++; });
  kt(F.tuHoa.length === tu, 'số tự hóa khớp: ' + F.tuHoa.length + '/' + tu);
  // Phi hóa từ Mệnh: tối đa 2 câu (Lộc, Kỵ), loại trừ tự hóa
  kt(F.menhPhi.length <= 2, 'Mệnh phi tối đa Lộc + Kỵ');
  // Đối chiếu iztro (dương lịch, giờ → chỉ số canh giờ)
  if (iz && k < 120) {
    try {
      const gio = Math.floor((inp.hour + 1) / 2) % 12;
      const ds = `${inp.year}-${inp.month}-${inp.day}`;
      if (inp.hour !== 23) {
        const a = iz.astro.bySolar(ds, gio, inp.gender === 'nam' ? '男' : '女', true, 'zh-CN');
        const orig = a.palaces.find(p => p.isOriginalPalace);
        const map = { '子': 0, '丑': 1, '寅': 2, '卯': 3, '辰': 4, '巳': 5, '午': 6, '未': 7, '申': 8, '酉': 9, '戌': 10, '亥': 11 };
        kt(orig && map[orig.earthlyBranch] === ln[0], 'Lai Nhân khớp iztro: ' + ds + ' giờ ' + inp.hour);
        soIz++;
      }
    } catch (e) { kt(false, 'iztro lỗi ' + e.message); }
  }
}
// Phân bố: 4 nhóm Thái Tuế và các thế Mệnh – Thân đều xuất hiện
kt(nhomDem.every(n => n > 30), '4 nhóm Thái Tuế đều xuất hiện: ' + nhomDem);
kt([1, 2, 3, 4, 5, 6, 7, 8].filter(m => theDem[m]).length >= 6, 'ít nhất 6/8 thế Mệnh – Thân xuất hiện: ' + JSON.stringify(theDem));
// Gắn vào luanChiTiet
const r = ctx.lapLaSoDayDu_({ name: 'Thử', gender: 'nam', calendar: 'duong', day: 11, month: 3, year: 1990, hour: 8, minute: 30, viewYear: 2026 });
kt(r.chiTiet && r.chiTiet.tamPhap && r.chiTiet.tamPhap.baVong.de.length >= 6, 'chiTiet.tamPhap có trong lá số đầy đủ');
console.log('Thế Mệnh – Thân:', JSON.stringify(theDem), '· nhóm Thái Tuế tại Mệnh:', nhomDem.join('/'), iz ? '· đối chiếu iztro: ' + soIz + ' lá số' : '');
console.log(sai ? `✗ ${sai} lỗi, ${ok} đạt` : `✓ Tất cả ${ok} kiểm tra đạt`);
process.exit(sai ? 1 : 0);
