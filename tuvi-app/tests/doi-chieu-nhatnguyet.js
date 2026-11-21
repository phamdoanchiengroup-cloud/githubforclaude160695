/**
 * Đối chiếu Thiên Cơ Các với ca kiểm của Nhật Nguyệt (nhatnguyet.org) – Data: Nhat Nguyet (nhatnguyet.org), CC BY 4.0.
 * Dữ liệu trích gọn ở tests/du-lieu/nhatnguyet/ (xem README.md cùng thư mục). Chạy: node tests/doi-chieu-nhatnguyet.js
 *
 * Khác biệt trường phái ĐÃ BIẾT (không tính là lỗi, có kiểm riêng để không trôi):
 *  - Thiên Khôi / Thiên Việt người sinh năm can Canh: Thiên Cơ Các an Sửu / Mùi ("Giáp Mậu Canh ngưu dương"), Nhật Nguyệt an Ngọ / Dần.
 *  - Lưu Hà năm Canh và năm Đinh: hai bảng an khác nhau.
 *  - Tên nạp âm "Kim Bạch Kim" (ta) = "Kim Bạc Kim" (họ).
 *  - Âm → dương: ngày 30 ở tháng thiếu (hoặc tháng nhuận không có) Thiên Cơ Các báo nhập sai; Nhật Nguyệt cho tràn sang tháng sau.
 */
const fs = require('fs'), path = require('path');
const { ctx } = require('../tools/gia-lap.js');
const D = path.join(__dirname, 'du-lieu', 'nhatnguyet'), doc = f => JSON.parse(fs.readFileSync(path.join(D, f + '.json'), 'utf8')).ca;
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const kq = [];
function bc(ten, tong, sai, mau) { kq.push({ ten, tong, sai, mau: mau.slice(0, 3) }); }

// 1. Âm lịch: dương → âm (UTC+7 mặc định; ca có muiGio là múi giờ khác)
{ let t = 0, s = 0, m = [];
  doc('am-lich').filter(c => c.vao.phep === 'duong-sang-am').forEach(c => {
    const v = c.vao, a = c.ra.am, o = ctx.solarToLunar(v.dd, v.mm, v.yyyy, v.muiGio || 7); t++;
    if (o.day !== a.day || o.month !== a.month || o.year !== a.year || !!o.leap !== !!a.leap) { s++; m.push(v.dd + '/' + v.mm + '/' + v.yyyy + ' ta ' + o.day + '/' + o.month + ' họ ' + a.day + '/' + a.month); }
  });
  bc('Âm lịch – dương sang âm', t, s, m); }
// 2. Âm lịch: âm → dương (chỉ ngày âm có thật)
{ let t = 0, s = 0, m = [];
  doc('am-lich').filter(c => c.vao.phep === 'am-sang-duong').forEach(c => {
    const v = c.vao, r = c.ra; let o = null;
    try { o = ctx.lunarToSolar(v.ngay, v.thang, v.nam, v.nhuan ? 1 : 0, v.muiGio || 7); } catch (e) { o = null; }
    if (!o || !o.day) return;   // Thiên Cơ Các từ chối ngày không có thật (khác biệt đã biết)
    t++; if (r.hopLe === false || o.day !== r.duong.day || o.month !== r.duong.month || o.year !== r.duong.year) { s++; m.push(JSON.stringify(v)); }
  });
  bc('Âm lịch – âm sang dương', t, s, m); }
// 3. Tử Vi: Mệnh, Cục, bản mệnh, vị trí sao chung tên
{ const TEN = { 'Thiên Diêu': 'Thiên Riêu' }, NAP = { 'Kim Bạc Kim': 'Kim Bạch Kim' };
  let t = 0, s = 0, tm = 0, sm = 0, kv = 0, m = [], mm = [];
  doc('tu-vi').forEach(c => {
    const v = c.vao, r = c.ra;
    const tv = ctx.tuviLapLaSo_({ calendar: 'duong', day: v.dd, month: v.mm, year: v.yyyy, hour: v.gio * 2, minute: 0, gender: /Nữ/.test(v.gioiTinh) ? 'nu' : 'nam', viewYear: v.namXem || 2026, tz: 7 });
    const can = tv.info.namCanChi.split(' ')[0];
    tm++; if (CHI[tv.info.menh] !== r.menh || tv.info.cuc !== r.cuc || tv.info.banMenh.ten !== (NAP[r.banMenh] || r.banMenh)) { sm++; mm.push(v.dd + '/' + v.mm + '/' + v.yyyy); }
    Object.keys(r.sao).forEach(ho => {
      const ten = TEN[ho] || ho, p = tv.pos[ten]; if (p == null) return;
      const phai = (can === 'Canh' && (ten === 'Thiên Khôi' || ten === 'Thiên Việt' || ten === 'Lưu Hà')) || (can === 'Đinh' && ten === 'Lưu Hà');
      if (phai) { kv++; return; }   // khác trường phái đã biết
      t++; if (CHI[p] !== r.sao[ho]) { s++; m.push(v.dd + '/' + v.mm + '/' + v.yyyy + ' ' + ten + ' ta ' + CHI[p] + ' họ ' + r.sao[ho]); }
    });
  });
  bc('Tử Vi – Mệnh, Cục, bản mệnh', tm, sm, mm);
  bc('Tử Vi – vị trí sao chung tên (bỏ ' + kv + ' vị trí khác trường phái đã biết)', t, s, m); }
// 4. Bát Tự: tứ trụ (bỏ ca không có giờ sinh)
{ let t = 0, s = 0, m = [];
  doc('bat-tu').forEach(c => {
    const v = c.vao; if (v.gio == null) return;
    const b = ctx.batTuLap_({ calendar: 'duong', day: v.dd, month: v.mm, year: v.yyyy, hour: v.gio, minute: v.phut || 0, gender: 'nam', viewYear: 2026 });
    const ta = b.pillars.map(p => p.canTen + ' ' + p.chiTen); t++;
    if (ta.join() !== c.ra.join()) { s++; m.push(v.dd + '/' + v.mm + '/' + v.yyyy + ' ' + v.gio + ':' + v.phut + ' ta ' + ta + ' họ ' + c.ra); }
  });
  bc('Bát Tự – tứ trụ', t, s, m); }
// 5. Thần số học (Pythagoras, số bậc thầy 11/22/33 – thống nhất theo Nhật Nguyệt, quyết định 21/11)
{ const K = [['soDuongDoi', 'duongDoi'], ['soNgaySinh', 'ngaySinh'], ['soLinhHon', 'linhHon'], ['soSuMenh', 'suMenh'], ['soNhanCach', 'nhanCach'], ['soThaiDo', 'thaiDo'], ['soTruongThanh', 'truongThanh'], ['soNamCaNhan', 'namNay']];
  let t = 0, s = 0; const dem = {};
  doc('than-so-hoc').forEach(c => {
    const v = c.vao, r = c.ra, o = ctx.thanSoHocLap_({ name: v.hoTen, day: v.dd, month: v.mm, year: v.yyyy, viewYear: v.namXem }, { day: v.dd, month: v.mm, year: v.yyyy }, v.namXem);
    K.forEach(([a, b]) => { if (r[a] == null) return; let x = o[b]; if (x && typeof x === 'object') x = x.so != null ? x.so : x.n; t++; if (+x !== +r[a]) { s++; dem[a] = (dem[a] || 0) + 1; } });
    if (r.luoiPythago) { t++; if ([1, 2, 3, 4, 5, 6, 7, 8, 9].some(k => +o.bieuDo[k] !== +r.luoiPythago[k])) { s++; dem.luoiPythago = (dem.luoiPythago || 0) + 1; } }
  });
  bc('Thần số học – các chỉ số', t, s, Object.keys(dem).length ? [JSON.stringify(dem)] : []); }

let loi = 0;
kq.forEach(r => { if (r.sai) loi++; console.log((r.sai ? '✘ ' : '✔ ') + r.ten + ': ' + (r.tong - r.sai) + '/' + r.tong + ' khớp' + (r.sai ? '  ví dụ: ' + r.mau.join(' | ') : '')); });
console.log('Nguồn ca kiểm: Data: Nhat Nguyet (nhatnguyet.org), CC BY 4.0');
process.exit(loi ? 1 : 0);
