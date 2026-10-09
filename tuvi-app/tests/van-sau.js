/**
 * Kiểm thử Vận hạn chuyên sâu (VanSau.gs): hồ sơ 12 tháng, hiệu chỉnh theo sự kiện đã biết, đại vận 5 hệ,
 * Tử Vi 12 cung lưu niên + phi hóa, nhật vận nhiều hệ, ứng kỳ Mai Hoa, phần cắt khi chưa mua.
 * Chạy: node tests/van-sau.js
 */
const path = require('path');
const { ctx } = require(path.join(__dirname, '..', 'tools', 'gia-lap.js'));
let ok = 0, sai = 0;
function kt(dk, msg) { if (dk) ok++; else { sai++; if (sai < 25) console.log('✗', msg); } }
const SAO = /Tử Vi tinh|Thiên Cơ|Thái Dương|Vũ Khúc|Thiên Đồng|Liêm Trinh|Thất Sát|Kình Dương|Đà La|Hóa Kỵ|Hóa Lộc|Hóa Khoa|Thiên Mã|Sao |Mặt Trăng|Mặt Trời|nghịch hành|Tài tinh|Kiếp Tài/;
let s = 11; const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
const dem = { moc: 0, thuc: 0, hc: 0 };
for (let k = 0; k < 16; k++) {
  const inp = { name: 'K' + k, gender: k % 2 ? 'nu' : 'nam', calendar: 'duong', day: 1 + Math.floor(rnd() * 28), month: 1 + Math.floor(rnd() * 12), year: 1960 + Math.floor(rnd() * 45), hour: Math.floor(rnd() * 24), minute: 0, viewYear: 2024 + (k % 4) };
  const r = ctx.lapLaSoDayDu_(inp), T = r.moRong.tongHop;
  // --- Hồ sơ tháng ---
  const M = T.hoSoThang;
  kt(M && !M.loi && M.thang.length === 12, 'có 12 tháng: ' + (M && M.loi));
  if (M && !M.loi) {
    kt(!/undefined|NaN/.test(JSON.stringify(M)), 'tháng không undefined/NaN');
    M.thang.forEach((m, i) => {
      kt(m.thang === i + 1 && m.he.length === 4, 'tháng ' + (i + 1) + ' có 4 hệ');
      kt(!SAO.test(m.tom.join(' ') + ' ' + (m.dauMoc || []).join(' ')), 'văn tháng không nêu tên sao: ' + (m.tom.join(' ') + (m.dauMoc || []).join(' ')).match(SAO));
      dem.moc += (m.dauMoc || []).length; dem.thuc += (m.dauMoc || []).filter(d => /điểm ngoặt/.test(d)).length;
      m.noiBat.concat(m.canPhong).forEach(x => kt(x.ung.length > 0 && x.rel > 0, 'việc nổi bật có hệ ủng hộ'));
    });
    M.suKien.forEach(x => {
      const tong = x.p.reduce((a, b) => a + b, 0);
      kt(x.pNam >= 89 || tong <= -100 * Math.log(1 - x.pNam / 100) * 1.08 + 1, 'tổng xác suất 12 tháng ≈ số lần kỳ vọng cả năm (λ): ' + x.k + ' ' + tong + '/' + x.pNam);
      kt(Math.abs(x.rel.reduce((a, b) => a + b, 0) - 12) < 0.8, 'hệ số gấp trung bình 12 tháng ≈ 1: ' + x.k);
    });
  }
  // --- Đại vận 5 hệ ---
  const D = T.daiVanSau;
  kt(D && !D.loi && D.ds.length >= 6, 'có đại vận 5 hệ: ' + (D && D.loi));
  if (D && !D.loi) D.ds.forEach(d => {
    kt(d.he.length >= 4 && d.he.length <= 5, 'mỗi vận có 4–5 hệ');
    kt(d.dinh.every(x => x.nam >= d.nam && x.nam <= d.den && x.rel >= 1.8), 'năm đỉnh nằm trong vận');
    kt(!SAO.test(d.tom.join(' ')), 'tóm tắt vận không nêu tên sao');
  });
  // --- Mốc đổi vận riêng từng hệ ---
  if (D && !D.loi) D.ds.forEach(d => {
    kt(d.moc && d.moc[0].he === 'Tử Vi' && d.moc.every(m => m.nam >= d.nam && m.nam <= d.den), 'mốc đổi vận nằm trong giai đoạn');
    kt(!d.moc.some(m => m.he !== 'Tử Vi' && m.he !== 'Chiêm tinh') || /chuyển tiếp/.test(d.lech), 'có ghi chú lệch mốc khi hệ khác đổi vận giữa chừng');
    const bt = d.he.filter(x => x.he === 'Bát Tự')[0]; if (bt) kt(/\(\d{4}–\d{4}/.test(bt.y), 'Bát Tự ghi rõ năm của từng đại vận');
  });
  // --- Bát Tự tháng theo tiết khí ---
  if (M && !M.loi) kt(M.thang.every(m => /tiết khí/.test(m.ly['Bát Tự'][0])), 'Bát Tự tháng ghi theo tiết khí');
  // --- Mỗi hệ góp phần · kế hoạch · cầu nối ---
  const HN = T.hoSoNam;
  kt(HN.gocNhin && HN.gocNhin.length >= 5 && HN.gocNhin.some(x => x.he === 'Human Design'), 'có phần đóng góp của từng hệ, kể cả Human Design: ' + (HN.gocNhinLoi || ''));
  kt(!SAO.test(HN.gocNhin.filter(x => x.he !== 'Chiêm tinh').map(x => x.y).join(' ')), 'văn đóng góp không nêu tên sao: ' + (HN.gocNhin.map(x => x.y).join(' ').match(SAO) || ''));
  kt(Array.isArray(HN.hanhDong) && HN.hanhDong.every(x => x.lam && x.hd), 'kế hoạch hành động có lời khuyên + cách làm theo Human Design');
  kt(HN.cauNoi && HN.cauNoi.length >= 2 && !SAO.test(HN.cauNoi.join(' ')), 'có cầu nối HD – Kinh Dịch – Hà Lạc, không nêu tên sao');
  const gS = r.moRong.hd.act.p.sun.gate; kt(HN.cauNoi[0].indexOf(ctx.HL_QUE[gS - 1][2]) >= 0, 'cổng HD ' + gS + ' khớp quẻ Kinh Dịch cùng số');
  // --- Biến cố 30 năm ---
  const B = T.bienCo;
  kt(B && B.suKien.length === 19 && B.nam.length >= 25, 'biến cố 30 năm đủ 19 việc');
  if (B) B.suKien.forEach(x => kt(x.dinh.every(y => y.nam >= inp.viewYear && y.rel >= 1.8) && x.rel.length === B.nam.length, 'năm đỉnh biến cố hợp lệ'));
  // --- Tử Vi 12 cung + phi hóa ---
  const TV = r.chiTiet.tieuVan.secs, c12 = TV.filter(x => /^Mười hai cung/.test(x.tieuDe))[0], ph = TV.filter(x => /phi nhập/.test(x.tieuDe))[0];
  kt(c12 && c12.items.length === 12, '12 cung của năm');
  kt(!TV.some(x => x.tieuDe === 'Các lĩnh vực trong năm'), 'bỏ mục 4 lĩnh vực trùng với 12 cung');
  kt(ph && ph.items.filter(x => /^Hóa (Lộc|Quyền|Khoa|Kỵ) năm/.test(x)).length === 4 && /xung chiếu/.test(ph.items[3]), 'Tứ Hóa năm phi nhập + Kỵ xung');
  // --- Nhật vận ---
  const nv = r.chiTiet.nhatVan[0].secs[0].items.join(' ');
  kt(/Bát Tự: can ngày/.test(nv) && /Mặt Trăng đi qua nhà/.test(nv) && /ngày cá nhân/.test(nv), 'nhật vận có Bát Tự, Mặt Trăng, ngày cá nhân');
  // --- Hiệu chỉnh: chưa khai thì giữ trọng số gốc ---
  kt(T.hieuChinh && T.hieuChinh.soSk === 0 && !T.hieuChinh.ap, 'chưa khai sự kiện thì không hiệu chỉnh');
  const nams = [];
  for (let y = inp.year + 20; y < inp.viewYear && nams.length < 3; y += 3) nams.push(y);
  const r2 = ctx.lapLaSoDayDu_(Object.assign({}, inp, { events: nams.map((y, i) => ({ nam: y, loai: ['sucKhoe', 'quanLoc', 'taiLoc'][i] })) }));
  const H2 = r2.moRong.tongHop.hieuChinh;
  kt(H2 && H2.soSk === nams.length && H2.bang.length === 5, 'hiệu chỉnh đếm đúng số sự kiện');
  kt(H2.bang.every(x => x.heSo >= 0.6 && x.heSo <= 1.7), 'hệ số hiệu chỉnh trong 0,6–1,7');
  kt(!SAO.test(H2.tom), 'lời hiệu chỉnh không nêu tên sao');
  if (H2.ap) dem.hc++;
  // --- Cắt khi chưa mua ---
  ctx.ttCatPhan_(r, { dvMo: {}, namMo: {}, thangMo: {}, dhNam: {} });
  const MK = r.moRong.tongHop.hoSoThang, DK = r.moRong.tongHop.daiVanSau;
  kt(MK.khoa && MK.suKien.length === 0 && MK.thang.every(m => m.khoa && !m.tom && !m.noiBat), 'bản khóa tháng không lộ lời luận');
  kt(DK.ds.every(d => d.khoa && !d.tom && !d.dinh && d.he.every(x => !x.y)), 'bản khóa đại vận chỉ còn thế đứng các hệ');
  const HK = r.moRong.tongHop.hoSoNam;
  kt(!HK.hanhDong && !HK.cauNoi && (HK.gocNhin || []).every(x => !x.y), 'bản khóa năm không lộ kế hoạch, cầu nối, lời từng hệ');
  kt(r.moRong.tongHop.bienCo === null, 'chưa mua biến cố thì không có Biến cố 30 năm');
}
// Hiệu chỉnh (đơn vị): Bát Tự báo đúng 3 năm ốm, Chiêm tinh báo 3 năm khác → Bát Tự tăng, Chiêm tinh giảm
const namTin = []; for (let t = 1; t <= 70; t++) { const tin = {}; if ([30, 40, 50].includes(t)) tin.sucKhoe = { 'Bát Tự': { v: 1.2, ly: '' } }; if ([33, 44, 55].includes(t)) tin.sucKhoe = { 'Chiêm tinh': { v: 1.2, ly: '' } }; namTin.push({ nam: 1950 + t, tuoi: t, tin }); }
const HC = ctx.vsHieuChinh_({ tv: { info: { viewYear: 2030 } }, input: { events: [1980, 1990, 2000].map(n => ({ nam: n, loai: 'omDau' })) } }, namTin);
const hs = h => HC.bang.filter(x => x.he === h)[0].heSo;
kt(HC.ap && hs('Bát Tự') > 1.1 && hs('Chiêm tinh') < 1 && HC.W['Bát Tự'] > ctx.HSN_W['Bát Tự'], 'hệ báo trúng được tăng trọng số: ' + JSON.stringify(HC.bang));
kt(/Bát Tự báo trúng nhất/.test(HC.tom), 'lời hiệu chỉnh nêu hệ trúng nhất');
// Thiên văn: nhật thực 17/2/2026 và nguyệt thực 3/3/2026 phải được nhận ra
const tv = ctx.vsThienVan_(ctx.jdFromDate(10, 2, 2026), ctx.jdFromDate(10, 3, 2026), [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]);
const thuc = tv.trang.filter(t => t.thuc).map(t => ctx.jdToDate(t.jd).slice(0, 2).join('/'));
kt(thuc.some(x => /^1[6-8]\/2$/.test(x)) && thuc.some(x => /^[2-4]\/3$/.test(x)), 'nhận ra nhật thực 17/2 và nguyệt thực 3/3/2026: ' + thuc);
kt(tv.nghich.some(n => n.p === 'mercury'), 'nhận ra Sao Thủy nghịch hành cuối tháng 2/2026');
// Mai Hoa
const t = { y: 2026, m: 10, d: 8, h: 14, mi: 20 }, Q = ctx.tiLapQue_(t), R = ctx.tiQueKetQua_(Q, 'Hỏi thử', 'cong_viec', t);
kt(R.ungKy && R.ungKy.so === ({ 'Càn': 1, 'Đoài': 2, 'Ly': 3, 'Chấn': 4, 'Tốn': 5, 'Khảm': 6, 'Cấn': 7, 'Khôn': 8 })[Q.tren] + ({ 'Càn': 1, 'Đoài': 2, 'Ly': 3, 'Chấn': 4, 'Tốn': 5, 'Khảm': 6, 'Cấn': 7, 'Khôn': 8 })[Q.duoi] + Q.dong, 'quái số = số quẻ trên + dưới + hào động');
kt(R.ungKy.ngay.length >= 1 && R.luan.some(l => /^Hào \d động/.test(l)) && R.luan.some(l => /Ứng kỳ theo quái khí/.test(l)), 'có hào động và ứng kỳ');
kt(dem.moc > 100 && dem.thuc >= 1, 'có mốc ngày và điểm ngoặt: ' + JSON.stringify(dem));
console.log('Vận hạn chuyên sâu: đạt ' + ok + '/' + (ok + sai) + ' · ' + JSON.stringify(dem));
process.exit(sai ? 1 : 0);
