/**
 * Kiểm thử tab Tứ Hóa Phi Tinh (TuViPhiTinh.gs): bảng Tứ Hóa trường Phi Tinh, can cung Ngũ Hổ Độn, Lai Nhân cung,
 * phi hóa 12 cung, đại vận/lưu niên, văn dễ hiểu không tên sao, chỉ chủ sở hữu gọi được API.
 * Chạy: node tests/phi-tinh.js
 */
const path = require('path');
const { ctx } = require(path.join(__dirname, '..', 'tools', 'gia-lap.js'));
let ok = 0, sai = 0;
function kt(dk, msg) { if (dk) ok++; else { sai++; if (sai < 30) console.log('✗', msg); } }
const T = ctx.PT_TU_HOA, CHI = ctx.CHI;
kt(T.length === 10 && T.every(r => r.length === 4), 'bảng Tứ Hóa 10 can × 4');
kt(T[8][2] === 'Tả Phù' && T[4][2] === 'Hữu Bật' && T[6].join() === 'Thái Dương,Vũ Khúc,Thái Âm,Thiên Đồng', 'Nhâm Khoa Tả Phù, Mậu Khoa Hữu Bật, Canh Nhật Vũ Âm Đồng');
const LAI = [10, 9, 8, 7, 6, 5, 4, 3, 2, 11];   // Giáp→Tuất … Nhâm→Dần, Quý→Hợi
const SAO = new Set(); T.forEach(r => r.forEach(s => SAO.add(s)));
['Thiên Phủ', 'Thiên Tướng', 'Thất Sát', 'Thiên Khôi', 'Thiên Việt', 'Lộc Tồn', 'Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh', 'Địa Không', 'Địa Kiếp'].forEach(s => SAO.add(s));
const TU_CAM = ['Hóa Kỵ', 'Hóa Lộc', 'Tuyệt mệnh'];
let soMau = 0;
for (let i = 0; i < 250; i++) {
  const inp = { name: 'T' + i, gender: i % 2 ? 'nu' : 'nam', calendar: 'duong', day: 1 + (i * 11) % 28, month: 1 + (i * 5) % 12, year: 1940 + (i * 7) % 80, hour: (i * 3) % 24, minute: 0, viewYear: 2026 };
  const tv = ctx.tuviLapLaSo(inp), N = ctx.ptNguyenCuc_(tv), id = '#' + i + ' ';
  const canDan = ((tv.info.yCan % 5) * 2 + 2) % 10;
  tv.palaces.forEach((p, k) => kt(p.can === (canDan + (k - 2 + 12) % 12) % 10, id + 'can cung Ngũ Hổ Độn ô ' + k));
  kt(N.ln === LAI[tv.info.yCan] && N.ln >= 2, id + 'Lai Nhân ' + CHI[N.ln]);
  N.phi.forEach((ds, k) => ds.forEach(f => {
    kt(f.sao === T[tv.palaces[k].can][f.h], id + 'sao hóa theo can cung');
    kt(f.toi != null && tv.pos[f.sao] === f.toi, id + f.sao + ' có vị trí');
  }));
  const R = ctx.ptLap_(tv, 2026, 5);
  kt(R.cung.length === 12 && new Set(R.cung.map(c => c.cung)).size === 12 && R.cung[0].cung === 'Mệnh', id + '12 cung, bắt đầu Mệnh');
  kt(R.daiVan.length === 12 && R.daiVan.filter(d => d.nay).length <= 1, id + '12 đại vận, tối đa 1 vận đang đi');
  kt(R.luuNien.length === 5 && R.luuNien[0].nam === 2026 && CHI.indexOf(R.luuNien[0].chi) === 6, id + 'lưu niên 2026 Mệnh năm ở Ngọ');
  kt(R.luuNien.every(l => l.can === ctx.CAN[((l.nam + 6) % 10 + 10) % 10]), id + 'can lưu niên = can năm');
  soMau += R.mau.length;
  // Văn dễ hiểu: không tên sao, không thuật ngữ Hóa…, không "Tuyệt mệnh"
  const deAll = [].concat(R.coBan.laiNhan ? [R.coBan.laiNhan.de] : [], ...R.cung.map(c => c.de), ...R.mau.map(m => m.de), ...R.daiVan.map(d => d.de.concat(d.mau.map(m => m.de))), ...R.luuNien.map(d => d.de));
  deAll.forEach(x => { SAO.forEach(s => kt(x.indexOf(s) < 0, id + 'câu dễ hiểu nêu tên sao ' + s + ': ' + x.slice(0, 60))); TU_CAM.forEach(w => kt(x.indexOf(w) < 0, id + 'câu dễ hiểu có "' + w + '"')); });
  kt(JSON.stringify(R).indexOf('Tuyệt mệnh') < 0, id + 'không hiển thị Tuyệt mệnh Kỵ');
}
kt(soMau > 250, 'các mẫu Kỵ có tên xuất hiện (' + soMau + ')');
// Chỉ chủ sở hữu
let bi = false; try { ctx.phiTinhLuan({ day: 1, month: 1, year: 1990, hour: 1, calendar: 'duong', gender: 'nam' }, 'khong-co'); } catch (e) { bi = true; }
kt(bi, 'người không phải chủ sở hữu bị chặn');
console.log('Phi Tinh: đạt ' + ok + '/' + (ok + sai));
process.exit(sai ? 1 : 0);
