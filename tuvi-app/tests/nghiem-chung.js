/** Kiểm thử Nghiệm chứng (dựa trên tổng hợp 6 hệ): đủ 8 nhóm, không lộ tên sao, không câu thiểu số, chấm điểm có "Không áp dụng". Chạy: node tests/nghiem-chung.js */
const { ctx } = require('../tools/gia-lap.js');
let ok = 0, sai = 0; function kt(dk, ten) { if (dk) ok++; else { sai++; console.log('  ✘', ten); } }
const TEN_SAO = /Tử Vi(?! &)|Thiên Cơ|Thái Dương|Vũ Khúc|Thiên Đồng|Liêm Trinh|Thiên Phủ|Thái Âm|Tham Lang|Cự Môn|Thiên Tướng|Thiên Lương|Thất Sát|Phá Quân|Kình Dương|Đà La|Hóa Kỵ|Địa Kiếp/;
let rnd = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(21), cau = 0, loSao = 0, thieuSo = 0, rong = 0;
for (let k = 0; k < 25; k++) {
  const inp = { name: 'A', gender: k % 2 ? 'nu' : 'nam', calendar: 'duong', day: 1 + Math.floor(rnd() * 28), month: 1 + Math.floor(rnd() * 12), year: 1950 + Math.floor(rnd() * 70), hour: Math.floor(rnd() * 24), minute: 0, viewYear: 2026, place: '21.03|105.85|Hà Nội', tz: 7 };
  const r = ctx.nghiemChungLap(inp);
  kt(r.doan.length === 8, 'đủ 8 nhóm');
  r.doan.forEach(d => {
    if (!d.dong.length) rong++;
    kt(d.doTin >= 0 && d.doTin <= 1, 'độ tin trong [0,1]');
    d.dong.forEach(x => { cau++; if (TEN_SAO.test(x.t)) loSao++; if (x.so != null && x.so < 0.34) thieuSo++; kt(!/undefined|NaN|\[object/.test(x.t + x.nhan), 'không có undefined/NaN'); });
    if (r.data.tuoi < 20 && d.ma === 'F') kt(d.apDung === false, 'người trẻ: hôn nhân không áp dụng');
  });
}
kt(loSao === 0, 'không nêu tên sao (' + loSao + ' câu)');
kt(thieuSo === 0, 'không dùng câu thiểu số');
kt(rong <= 10, 'ít nhóm rỗng (' + rong + '/200)');
let t = ctx.nghiemChungTinhDiem_({ A: 'dung_het', B: 'dung_het', C: 'dung_phan_lon', D: 'dung_het', E: 'dung_het', H: 'dung_phan_lon', F: 'khong_ap_dung', G: 'khong_ap_dung', _doTin: { A: .6, B: .8, C: .5, D: .7, E: .6, H: .9 } });
kt(t.ketLuan === 'XAC_NHAN' && t.soNhom === 6, '6 nhóm khớp, 2 không áp dụng → xác nhận');
t = ctx.nghiemChungTinhDiem_({ A: 'sai_phan_lon', B: 'dung_mot_nua', C: 'sai_hoan_toan', D: 'dung_mot_nua', E: 'sai_phan_lon' });
kt(t.ketLuan === 'CO_THE_SAI', 'phần lớn sai → chưa khớp');
t = ctx.nghiemChungTinhDiem_({ A: 'dung_het', B: 'dung_het', F: 'khong_ap_dung', G: 'khong_ap_dung' });
kt(t.ketLuan === 'CO_THE_SAI' && t.soNhom === 2, 'chấm dưới 4 nhóm thật → không kết luận khớp');
console.log('Nghiệm chứng: ' + cau + ' câu trên 25 lá số · đạt ' + ok + '/' + (ok + sai));
if (sai) process.exit(1);
