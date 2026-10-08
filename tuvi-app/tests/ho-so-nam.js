/**
 * Kiểm thử Hồ sơ biến cố năm (HoiTu.gs › htHoSoNam_) và phần cắt khi chưa mở vận năm (ThanhToan.gs › ttCatPhan_).
 * Chạy: node tests/ho-so-nam.js
 */
const path = require('path');
const { ctx } = require(path.join(__dirname, '..', 'tools', 'gia-lap.js'));
let ok = 0, sai = 0;
function kt(dk, msg) { if (dk) ok++; else { sai++; if (sai < 25) console.log('✗', msg); } }
const SAO = /Tử Vi tinh|Thiên Cơ|Thái Dương|Vũ Khúc|Thiên Đồng|Liêm Trinh|Thiên Phủ|Thái Âm|Tham Lang|Cự Môn|Thiên Tướng|Thiên Lương|Thất Sát|Phá Quân|Kình Dương|Đà La|Hóa Kỵ|Hóa Lộc|Hóa Khoa|Thiên Mã|Tuần|Triệt|Sao |Mặt Trăng|Mặt Trời|Tài tinh|Ấn tinh|Thương Quan|Kiếp Tài/;
const MUC = ['Rất cao', 'Cao', 'Khá cao', 'Bình thường', 'Thấp'];
let s = 7; const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
const dem = { dong: {}, muc: {}, cao: 0 };
for (let k = 0; k < 30; k++) {
  const inp = { name: 'Khách ' + k, gender: k % 2 ? 'nu' : 'nam', calendar: 'duong', day: 1 + Math.floor(rnd() * 28), month: 1 + Math.floor(rnd() * 12), year: 1955 + Math.floor(rnd() * 55), hour: Math.floor(rnd() * 24), minute: 0, viewYear: 2020 + (k % 9) };
  const r = ctx.lapLaSoDayDu_(inp), H = r.moRong.tongHop.hoSoNam;
  kt(H && !H.loi, 'có hồ sơ năm: ' + (H && H.loi));
  if (!H || H.loi) continue;
  kt(H.nam === inp.viewYear, 'đúng năm xem');
  kt(H.qua === (H.nam < new Date().getFullYear()), 'cờ năm đã qua');
  kt(H.suKien.length === 19 && H.khiaCanh.length === 8 && H.he.length === 5, '19 sự kiện · 8 khía cạnh · 5 hệ');
  kt(!/undefined|NaN/.test(JSON.stringify(H)), 'không undefined/NaN');
  H.khiaCanh.forEach(c => kt(c.sk.every(k2 => H.suKien.some(x => x.k === k2 && x.kc === c.k)), 'khía cạnh trỏ đúng sự kiện'));
  H.suKien.forEach(x => {
    dem.dong[x.dong] = (dem.dong[x.dong] || 0) + 1;
    if (x.ngoai) { kt(x.p === 0 && x.dong === 'Ngoài độ tuổi', 'ngoài độ tuổi thì p = 0'); return; }
    dem.muc[x.muc] = (dem.muc[x.muc] || 0) + 1; if (x.p >= 40) dem.cao++;
    kt(x.p >= 2 && x.p <= 90, 'xác suất 2–90%: ' + x.k + ' ' + x.p);
    kt(x.muc === ctx.htMucP_(x.p, x.rel) && MUC.indexOf(x.muc) >= 0, 'nhãn mức khớp xác suất: ' + x.k);
    kt(!x.ung.some(h => x.nghich.indexOf(h) >= 0), 'một hệ không vừa ủng hộ vừa ngược chiều');
    const dongDung = x.ung.length >= 3 && !x.nghich.length ? 'Đồng thuận' : x.ung.length && x.nghich.length ? 'Đối lập' : x.ung.length >= 2 ? 'Nghiêng về' : x.ung.length === 1 ? 'Một hệ báo' : x.nghich.length ? 'Nghiêng chiều ngược' : 'Ít tín hiệu';
    kt(x.dong === dongDung, 'nhãn đồng thuận khớp số hệ: ' + x.k);
    kt(x.thang.every(m => m >= 1 && m <= 12) && x.thang.length <= 2, 'tháng âm lịch hợp lệ');
    const van = x.giai + ' ' + x.khuyen;
    kt(!SAO.test(van), 'văn dễ hiểu không nêu tên sao: ' + x.k + ' – ' + (van.match(SAO) || [''])[0]);
  });
  kt(!SAO.test(H.tom.join(' ') + H.khiaCanh.map(c => c.cau).join(' ')), 'tóm tắt không nêu tên sao');
  // Chưa mở vận năm: chỉ lộ thế đứng 5 hệ, nhãn khía cạnh và tối đa 1 sự kiện
  const q = { dvMo: {}, namMo: {}, thangMo: {}, dhNam: {} };
  ctx.ttCatPhan_(r, q);
  const K = r.moRong.tongHop.hoSoNam;
  kt(K.khoa && K.tom.length === 1, 'bản khóa chỉ giữ 1 câu tóm tắt');
  kt(K.suKien.filter(x => x.p != null).length <= 1, 'bản khóa lộ tối đa 1 xác suất');
  kt(K.suKien.every(x => x.p != null || (!x.giai && !x.ly && !x.khuyen)), 'bản khóa không lộ lời giải');
  kt(K.he.every(x => x.tot == null && x.xau == null), 'bản khóa không lộ điểm từng hệ');
}
kt((dem.dong['Đồng thuận'] || 0) > 10 && (dem.dong['Đối lập'] || 0) > 10, 'có cả đồng thuận lẫn đối lập: ' + JSON.stringify(dem.dong));
kt((dem.muc['Cao'] || 0) + (dem.muc['Rất cao'] || 0) > 5 && (dem.muc['Thấp'] || 0) > 50, 'phân bố mức hợp lý: ' + JSON.stringify(dem.muc));
console.log('Hồ sơ năm: đạt ' + ok + '/' + (ok + sai) + ' · ' + JSON.stringify(dem.muc) + ' · ' + JSON.stringify(dem.dong));
process.exit(sai ? 1 : 0);
