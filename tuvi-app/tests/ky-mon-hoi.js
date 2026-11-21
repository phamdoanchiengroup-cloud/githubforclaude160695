/**
 * Kiểm thử Kỳ Môn "Hỏi một việc" (KyMon.gs › kyMonHoi, kmDanhGia_; ThanhToan.gs › muaPhan 'km_hoi', ttMuaKmHoi_).
 * Apps Script giả lập (tools/gia-lap.js). Chạy: node tests/ky-mon-hoi.js
 */
const path = require('path');
const { ctx } = require(path.join(__dirname, '..', 'tools', 'gia-lap.js'));
let ok = 0, sai = 0;
function kt(dk, msg) { if (dk) ok++; else { sai++; console.log('✗', msg); } }
function nem(fn) { try { fn(); return null; } catch (e) { return e.message; } }
const cache = ctx.CacheService.getScriptCache();
const LOAI = ['cong_viec', 'tai_loc', 'tinh_cam', 'di_xa', 'suc_khoe', 'kien_tung', 'thi_cu'];
const MUC = ['thuan', 'thuan_dk', 'nen_cho'];
// Giờ VN hiện tại (đọc bằng getUTC*) và một mốc giữa giờ âm lịch kế tiếp để mọi phép thử nằm cùng một giờ âm lịch
const vn = new Date(Date.now() + 7 * 3600e3);
const moc = new Date(Date.UTC(vn.getUTCFullYear(), vn.getUTCMonth(), vn.getUTCDate(), vn.getUTCHours() + 2));
if (moc.getUTCHours() % 2 === 0) moc.setUTCHours(moc.getUTCHours() + 1);   // giờ lẻ = đầu một giờ âm lịch (Sửu 1h, Dần 3h, …)
const T = (phut, them) => { const d = new Date(moc.getTime() + (them || 0) * 60e3); return { day: d.getUTCDate(), month: d.getUTCMonth() + 1, year: d.getUTCFullYear(), hour: d.getUTCHours(), minute: phut == null ? d.getUTCMinutes() : phut }; };

// 1. Chặn: khách, loại việc sai, thời điểm sai
kt(/đăng nhập/.test(nem(() => ctx.kyMonHoi('', 'cong_viec')) || ''), 'khách chưa đăng nhập bị chặn');
kt(/đăng nhập/.test(nem(() => ctx.muaPhan('', T(10), 'km_hoi', 'cong_viec')) || ''), 'muaPhan km_hoi: khách bị chặn');
const tk = ctx.dangKy('kmhoi1', 'matkhau123', 'KM', 'kmhoi1@vidu.vn', '').token;
['', 'xo_so', 'toString', '__proto__', 'cong_viec ', null].forEach(l => kt(/Loại việc không hợp lệ/.test(nem(() => ctx.kyMonHoi(tk, l)) || ''), 'loại việc "' + l + '" bị từ chối'));
kt(/Loại việc/.test(nem(() => ctx.muaPhan(tk, T(10), 'km_hoi', 'xo_so')) || ''), 'muaPhan km_hoi: loại việc sai bị từ chối');
const xa = new Date(Date.now() + 7 * 3600e3 + 10 * 864e5), cu = new Date(Date.now() + 7 * 3600e3 - 3 * 864e5);
[[xa, 'quá 3 ngày tới'], [cu, 'quá 1 ngày trước']].forEach(([d, t]) =>
  kt(/Chỉ hỏi được/.test(nem(() => ctx.kyMonHoi(tk, 'cong_viec', { day: d.getUTCDate(), month: d.getUTCMonth() + 1, year: d.getUTCFullYear(), hour: 9, minute: 0 })) || ''), 'thời điểm ' + t + ' bị từ chối'));
kt(/không có thật|không hợp lệ/.test(nem(() => ctx.kyMonHoi(tk, 'cong_viec', { day: 31, month: 2, year: 2026, hour: 9, minute: 0 })) || ''), 'ngày 31/2 bị từ chối');
kt(/không hợp lệ/.test(nem(() => ctx.kyMonHoi(tk, 'cong_viec', { day: 1, month: 1, year: 2026, hour: 25, minute: 0 })) || ''), 'giờ 25 bị từ chối');
kt(/không hợp lệ/.test(nem(() => ctx.kyMonHoi(tk, 'cong_viec', 'hom nay')) || ''), 'thời điểm dạng chuỗi bị từ chối');

// 2. Phần miễn phí: bàn 9 cung + 1 mức + 1 khung giờ tốt, KHÔNG lộ phần trả phí
const f = ctx.kyMonHoi(tk, 'cong_viec', T(10));
kt(f.ok && f.loai === 'cong_viec' && f.loaiTen && MUC.includes(f.muc) && f.mucTen && f.loiMuc, 'miễn phí: có 1 mức kết luận (' + f.muc + ')');
kt(f.ban && f.ban.cung.length === 9 && f.ban.cung.filter(o => o.so !== 5).every(o => o.mon && o.sao.length && o.than && o.thienBan.length), 'miễn phí: bàn đủ 9 ô (cửa, sao, thần, can)');
kt(f.gioTot && /^giờ /.test(f.gioTot.ten) && /^\d\d:00$/.test(f.gioTot.tu) && /^\d\d:00$/.test(f.gioTot.den) && f.gioTot.huong && MUC.includes(f.gioTot.muc), 'miễn phí: 1 khung giờ tốt hôm nay kèm hướng');
kt(f.ma === ctx.kmMaHoi_(T(10), 'cong_viec') && /^km_hoi:\d{10}:cong_viec$/.test(f.ma), 'mã km_hoi:<yyyymmddhh>:<loại> (' + f.ma + ')');
kt(f.gia === 9 && f.daMua === false && f.toanQuyen === false && typeof f.soDu === 'number', 'miễn phí: giá 9 xu, chưa mua, có số dư');
kt(f.luuY.length === 1 && /Quyết định cuối cùng là của bạn/.test(f.luuY[0]), 'miễn phí: có lời lưu ý chung');
const js = JSON.stringify(f);
['luan', 'danhGia', 'khungTot', 'nhacHoiLai'].forEach(k => kt(!(k in f), 'miễn phí không có trường trả phí "' + k + '"'));
['ketLuan', 'canCu', 'dungThan', 'nguoiHoi', '"diem"', '"ly"', '"viec"'].forEach(k => kt(js.indexOf(k) < 0, 'miễn phí không lộ "' + k + '" ở bất kỳ đâu'));
kt(!/%/.test(f.loiMuc + f.mucTen) && !/chắc chắn|nhất định|đại hung|tai họa|phá sản|chết/.test(js), 'miễn phí: không có %, không có chữ cấm');
kt(ctx.kyMonHoi(tk, 'suc_khoe', T(10)).luuY.some(x => /bác sĩ/.test(x)) && ctx.kyMonHoi(tk, 'kien_tung', T(10)).luuY.some(x => /luật sư/.test(x)) &&
  ctx.kyMonHoi(tk, 'tai_loc', T(10)).luuY.some(x => /tài chính/.test(x)), 'sức khỏe / kiện tụng / tiền bạc: thêm lời khuyên hỏi người chuyên môn');
const now = ctx.kyMonHoi(tk, 'thi_cu');
kt(now.ok && now.thoiDiem.year === vn.getUTCFullYear() && now.thoiDiem.hour === vn.getUTCHours(), 'bỏ trống thời điểm = bây giờ (giờ VN)');

// 3. Mua: thiếu xu → không trừ; đủ → trừ 9 đúng một lần; mua lại cùng giờ âm lịch + loại → daCo
const so0 = ctx.ttSoDu_('kmhoi1');
const r0 = ctx.muaPhan(tk, T(10), 'km_hoi', 'cong_viec');
kt(r0.ok === false && r0.gia === 9 && r0.thieu === 9 - so0 && ctx.ttSoDu_('kmhoi1') === so0, 'thiếu xu: báo thiếu, không trừ');
ctx.ttKhoa_(() => ctx.ttCong_('kmhoi1', 25, 'thử', 'THU'));
const so1 = ctx.ttSoDu_('kmhoi1');
const r1 = ctx.muaPhan(tk, T(10), 'km_hoi', 'cong_viec');
kt(r1.ok && r1.gia === 9 && r1.soDu === so1 - 9 && ctx.ttSoDu_('kmhoi1') === so1 - 9 && r1.ma === f.ma, 'mua: trừ đúng 9 xu');
kt(r1.ketQua && r1.ketQua.daMua && r1.ketQua.luan && r1.ketQua.danhGia && Array.isArray(r1.ketQua.khungTot), 'mua: trả luôn kết quả đầy đủ');
kt(r1.ketQua.muc === f.muc && JSON.stringify(r1.ketQua.ban) === JSON.stringify(f.ban), 'mua: cùng bàn, cùng mức với phần miễn phí (hai tầng không lệch)');
const r2 = ctx.muaPhan(tk, T(10), 'km_hoi', 'cong_viec'), r3 = ctx.muaPhan(tk, T(55), 'km_hoi', 'cong_viec');
kt(r2.ok && r2.daCo && r3.ok && r3.daCo && ctx.ttSoDu_('kmhoi1') === so1 - 9, 'mua lại cùng giờ âm lịch (kể cả phút khác) → daCo, không trừ thêm');
kt(r2.ketQua && r2.ketQua.nhacHoiLai && /hỏi lại sau ít nhất một ngày/.test(r2.ketQua.nhacHoiLai), 'mua lại: kèm lời nhắc "một việc không hỏi hai lần"');
const mk = ctx.ttSheet_('MoKhoa').rows.filter(v => v[2] === 'TK:kmhoi1' && /^km_hoi:/.test(v[3]));
kt(mk.length === 1 && mk[0][1] === 'kmhoi1' && mk[0][3] === f.ma && mk[0][4] === 9 && /@\d{4}-\d\d-\d\d \d\d:10/.test(mk[0][5]), 'MoKhoa: 1 dòng theo tài khoản (TK:<tên>), lưu thời điểm đã hỏi');
const sc = ctx.ttSheet_('SoCai').rows.filter(v => v[1] === 'kmhoi1' && v[2] < 0);
kt(sc.length === 1 && sc[0][2] === -9 && /Kỳ Môn/.test(sc[0][4]) && sc[0][5] === 'TK:kmhoi1', 'sổ cái: 1 dòng trừ 9 xu');

// 4. Mở lại: kyMonHoi cùng loại, cùng giờ âm lịch → đủ phần trả phí, đúng thời điểm lúc mua
const m1 = ctx.kyMonHoi(tk, 'cong_viec', T(48));
kt(m1.daMua && m1.luan && m1.danhGia && m1.khungTot && m1.nhacHoiLai, 'đã mua: kyMonHoi mở lại miễn phí, đủ phần trả phí');
kt(m1.thoiDiem.minute === 10 && JSON.stringify(m1.ban) === JSON.stringify(f.ban), 'đã mua: lập lại đúng bàn lúc mua (phút 10), không lập bàn mới');
kt(typeof m1.luan.ketLuan === 'string' && Array.isArray(m1.luan.canCu) && Array.isArray(m1.luan.viec), 'lời luận đúng khuôn {ketLuan, canCu, viec}');
kt(typeof ctx.kmVanLuan_ !== 'function' || (m1.luan.ketLuan.length > 50 && m1.luan.viec.length === 3), 'có KyMonVan.gs: lời luận có nội dung, 3 việc nên làm');
kt(m1.danhGia.dungThan[0].vai === 'chinh' && m1.danhGia.dungThan[0].cung >= 1 && m1.danhGia.dungThan[0].cung <= 9 && m1.danhGia.dungThan[0].cung !== 5 && m1.danhGia.nguoiHoi.huong, 'đã mua: có dụng thần chính và ô người hỏi');
kt(m1.danhGia.ly.length && m1.danhGia.ly.every(x => x.k && x.ta && typeof x.tot === 'boolean' && !('diem' in x)), 'căn cứ: mã + câu, không đưa điểm số ra ngoài');
kt(m1.khungTot.length === 3 && new Set(m1.khungTot.map(k => k.ngay)).size === 3, '3 khung giờ tốt trong 3 ngày');
const khac = ctx.kyMonHoi(tk, 'tai_loc', T(48)), gioSau = ctx.kyMonHoi(tk, 'cong_viec', T(10, 120));
kt(!khac.daMua && !('luan' in khac) && !gioSau.daMua && !('luan' in gioSau) && gioSau.ma !== f.ma, 'loại việc khác hoặc giờ âm lịch khác: chưa mua (phải mua riêng)');
const tk2 = ctx.dangKy('kmhoi2', 'matkhau123', 'KM2', 'kmhoi2@vidu.vn', '').token;
kt(!ctx.kyMonHoi(tk2, 'cong_viec', T(10)).daMua, 'tài khoản khác không được dùng lượt đã mua của người khác');

// 5. Khóa giờ âm lịch: Tý 23:00–01:00 là một giờ (qua nửa đêm), giờ chẵn thuộc giờ âm bắt đầu từ giờ lẻ trước
const ma = (d, m, y, h, mi) => ctx.kmMaHoi_({ day: d, month: m, year: y, hour: h, minute: mi }, 'di_xa');
kt(ma(21, 11, 2026, 23, 30) === ma(22, 11, 2026, 0, 45) && ma(21, 11, 2026, 23, 30) === 'km_hoi:2026112123:di_xa', 'giờ Tý muộn 23:30 và 00:45 hôm sau cùng một mã');
kt(ma(22, 11, 2026, 1, 0) === 'km_hoi:2026112201:di_xa' && ma(22, 11, 2026, 2, 59) === 'km_hoi:2026112201:di_xa' && ma(22, 11, 2026, 3, 0) === 'km_hoi:2026112203:di_xa', 'giờ Sửu 01:00–02:59, giờ Dần từ 03:00');
kt(ma(31, 12, 2026, 23, 5) === 'km_hoi:2026123123:di_xa' && ma(1, 1, 2027, 0, 5) === 'km_hoi:2026123123:di_xa', 'giờ Tý qua năm mới vẫn cùng mã');
const ga = ctx.kmGioAm_({ day: 22, month: 11, year: 2026, hour: 10, minute: 0 });
kt(ga.ten === 'Tỵ' && ga.tu === '09:00' && ga.den === '11:00', 'giờ âm lịch 10:00 = giờ Tỵ 09:00–11:00');

// 6. Chấm 7 loại việc: luôn ra 1 trong 3 mức, dụng thần đúng loại
const ban = ctx.kmLap_({ day: 21, month: 11, year: 2026, hour: 9, minute: 0 });
LOAI.forEach(l => {
  const d = ctx.kmDanhGia_(ban, l), dc = d.dungThan[0], o = ban.cung[dc.cung - 1];
  kt(MUC.includes(d.muc) && dc.cung !== 5 && d.ly.length >= 3, l + ': mức ' + d.muc + ', dụng thần ô ' + dc.cung);
  const L = ctx.KM_LOAI[l].dt[0];
  kt(L.kieu === 'mon' ? o.mon === L.gt : L.kieu === 'than' ? o.than === L.gt : L.kieu === 'sao' ? o.sao.includes(L.gt) : L.kieu === 'ma' ? dc.cung === (ban.maTinh.cung === 5 ? 2 : ban.maTinh.cung) : true, l + ': ô dụng thần chứa đúng ' + dc.ten);
});
kt(ctx.kmDanhGia_(ban, 'tai_loc').dungThan.some(d => d.kieu === 'can' && d.gt === 4) && ctx.kmDanhGia_(ban, 'thi_cu').dungThan.some(d => d.kieu === 'sao' && d.gt === 3), 'tiền bạc có can Mậu; thi cử có sao Thiên Phụ');
kt(ctx.kmDanhGia_(ban, 'suc_khoe').dungThan.some(d => d.nguoc && d.gt === 1), 'sức khỏe: Thiên Nhuế là yếu tố cản (không chẩn đoán)');
kt(/Loại việc/.test(nem(() => ctx.kmDanhGia_(ban, 'xo_so')) || ''), 'kmDanhGia_: loại việc sai báo lỗi');
{ // phân bố mức trên 600 bàn: mỗi loại đều có đủ 3 mức, không mức nào áp đảo
  let s = 7; const r = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
  const bans = []; for (let i = 0; i < 600; i++) { const d = new Date(Date.UTC(1995, 0, 1) + r() * 40 * 365 * 864e5); bans.push(ctx.kmLap_({ day: d.getUTCDate(), month: d.getUTCMonth() + 1, year: d.getUTCFullYear(), hour: d.getUTCHours(), minute: d.getUTCMinutes() })); }
  LOAI.forEach(l => { const c = { thuan: 0, thuan_dk: 0, nen_cho: 0 }; bans.forEach(b => c[ctx.kmDanhGia_(b, l).muc]++);
    kt(MUC.every(m => c[m] >= 90 && c[m] <= 360), l + ': phân bố mức hợp lý ' + JSON.stringify(c)); });
}

// 7. kmVanLuan_ chưa có / lỗi → khung rỗng, không làm hỏng lượt đã mua
const goc = ctx.kmVanLuan_;
ctx.kmVanLuan_ = undefined;
const p1 = ctx.kyMonHoi(tk, 'cong_viec', T(10));
kt(p1.daMua && p1.luan.ketLuan === '' && p1.luan.canCu.length === 0 && p1.luan.viec.length === 0 && p1.luan.chuaCoVan, 'chưa có KyMonVan.gs: khung {ketLuan:"", canCu:[], viec:[]}');
ctx.kmVanLuan_ = () => { throw new Error('hỏng'); };
const p2 = ctx.kyMonHoi(tk, 'cong_viec', T(10));
kt(p2.daMua && p2.luan.ketLuan === '' && p2.luan.loiVan, 'kmVanLuan_ lỗi: vẫn trả khung rỗng');
let nhan = null; ctx.kmVanLuan_ = (b, l, m, d) => { nhan = { b, l, m, d }; return { ketLuan: 'x', canCu: [], viec: [] }; };
ctx.kyMonHoi(tk, 'cong_viec', T(10));
kt(nhan && nhan.b.cung.length === 9 && nhan.b.trucPhu && nhan.l === 'cong_viec' && nhan.m === f.muc, 'kmVanLuan_ nhận (bàn đầy đủ của kmLap_, loại, mức)');
kt(nhan && nhan.d.dungThan.cung && !Array.isArray(nhan.d.dungThan) && Array.isArray(nhan.d.ly) && nhan.d.ly.every(x => typeof x === 'string') &&
  nhan.d.gioTot.length === 3 && nhan.d.gioTot.every(k => k.nam && k.thang && k.ngay && typeof k.chi === 'number' && k.huong), 'danhGia gửi văn: dungThan 1 đối tượng, ly là mã, gioTot {nam, thang, ngay, chi, huong}');
ctx.kmVanLuan_ = goc;

// 7b. Văn thật (KyMonVan.gs): 7 loại × 3 mức × nhiều bàn – không lỗi, đủ 4 phần, không chữ Hán, không %, tầng Kết luận không nêu tên sao/cửa/thần
if (typeof ctx.kmVanLuan_ === 'function') {
  const HAN = /[\u3400-\u9fff]/, TEN = new RegExp('(' + ctx.KM_SAO.concat(ctx.KM_THAN).join('|') + '|cửa (' + ctx.KM_MON.join('|') + ')\\b)', 'i');
  let lan = 0, loiVan = [];
  [[21, 11, 2026, 9], [7, 8, 2022, 21], [1, 1, 2027, 0], [15, 6, 2026, 14]].forEach(([d, m, y, h]) => {
    const b = ctx.kmLap_({ day: d, month: m, year: y, hour: h, minute: 20 });
    LOAI.forEach(l => {
      const dg = ctx.kmDanhGia_(b, l), kh = ctx.kmKhungTot3Ngay_({ day: d, month: m, year: y, hour: h, minute: 20 }, l);
      MUC.forEach(mu => {
        lan++;
        let v; try { v = ctx.kmVanLuan_(b, l, mu, ctx.kmGoiVan_(b, Object.assign({}, dg, { muc: mu }), kh)); } catch (e) { loiVan.push(l + '/' + mu + ': ' + e.message); return; }
        const tat = JSON.stringify(v);
        if (!(v && typeof v.ketLuan === 'string' && v.ketLuan.length > 80 && Array.isArray(v.canCu) && v.canCu.length && Array.isArray(v.viec) && v.viec.length === 3 && typeof v.luuY === 'string' && v.luuY))
          loiVan.push(l + '/' + mu + ': thiếu phần');
        else if (HAN.test(tat)) loiVan.push(l + '/' + mu + ': có chữ Hán');
        else if (/%/.test(tat)) loiVan.push(l + '/' + mu + ': có %');
        else if (TEN.test(v.ketLuan)) loiVan.push(l + '/' + mu + ': Kết luận nêu tên ' + v.ketLuan.match(TEN)[0]);
        else if (/chắc chắn|nhất định|đại hung|tai họa|phá sản|\bchết\b|bỏ ngay/i.test(tat)) loiVan.push(l + '/' + mu + ': có chữ cấm');
      });
    });
  });
  kt(!loiVan.length, 'văn thật ' + lan + ' bài (7 loại × 3 mức × 4 bàn): ' + (loiVan.slice(0, 5).join(' | ') || 'đạt'));
  const g1 = ctx.kmGoiVan_(ban, ctx.kmDanhGia_(ban, 'cong_viec'), ctx.kmKhungTot3Ngay_({ day: 21, month: 11, year: 2026, hour: 9, minute: 0 }, 'cong_viec'));
  kt(g1.gioTot.length === 3 && g1.ly.every(x => typeof x === 'string'), 'danhGia gửi văn: 3 khung giờ, ly là mã');
  const dgCho = Object.assign({}, ctx.kmDanhGia_(ban, 'thi_cu'), { muc: 'nen_cho' }), gc = ctx.kmGoiVan_(ban, dgCho, []);
  kt(gc.choDen && gc.choDen.nam === 2026 && gc.choDen.thang === 11 && gc.choDen.ngay === 24, 'nên chờ, không có khung tốt: chờ đến 3 ngày sau (24/11)');
  kt(ctx.kmGoiVan_(ban, ctx.kmDanhGia_(ban, 'thi_cu'), []).choDen === undefined || ctx.kmDanhGia_(ban, 'thi_cu').muc === 'nen_cho', 'mức khác "nên chờ": không gửi choDen');
}
// 8. Toàn quyền (chủ sở hữu): xem đủ, không trừ xu
const tokChu = 'tok-chu-kmhoi-0000000000001';
cache.put('SS_' + tokChu, JSON.stringify({ ten: 'chienpham' }));
if (!ctx.tkDoc_('chienpham')) ctx.tkGhi_('chienpham', { salt: 'x', hash: 'y', vaiTro: 'chu', hienThi: 'Chủ' });
const c1 = ctx.kyMonHoi(tokChu, 'di_xa', T(10));
kt(c1.toanQuyen && c1.luan && c1.danhGia && c1.soDu === null, 'chủ sở hữu: xem đủ phần trả phí');
kt(ctx.muaPhan(tokChu, T(10), 'km_hoi', 'di_xa').toanQuyen === true, 'chủ sở hữu: muaPhan km_hoi → toanQuyen, không trừ');
for (let i = 0; i < 35; i++) ctx.kyMonHoi(tokChu, 'di_xa', T(10));
ok++;   // không bị giới hạn lượt

// 9. Giới hạn 30 lượt / 10 phút / tài khoản
const tk3 = ctx.dangKy('kmhoi3', 'matkhau123', 'KM3', 'kmhoi3@vidu.vn', '').token;
let dem = 0, loiGH = null;
for (let i = 0; i < 31 && !loiGH; i++) { loiGH = nem(() => ctx.kyMonHoi(tk3, 'tinh_cam', T(10))); if (!loiGH) dem++; }
kt(dem === 30 && /đợi khoảng 10 phút/.test(loiGH || ''), 'lượt thứ 31 trong 10 phút bị chặn (' + dem + ')');
kt(!nem(() => ctx.kyMonHoi(tk2, 'tinh_cam', T(10))), 'giới hạn tính riêng từng tài khoản');
const v = JSON.parse(cache.get('KMH_kmhoi3')); v.t -= 601e3; cache.put('KMH_kmhoi3', JSON.stringify(v));
kt(!nem(() => ctx.kyMonHoi(tk3, 'tinh_cam', T(10))), 'sau 10 phút hỏi lại được');

// 10. Bảng giá: km_hoi có trong bảng giá, Quản trị đổi giá thì mua theo giá mới
const bg = ctx.ttBangGia_();
kt(bg.phan.km_hoi && bg.phan.km_hoi.xu === 9 && bg.phan.km_hoi.ten === 'Kỳ Môn – hỏi một việc' && !bg.phan.km_hoi.an, 'bảng giá: km_hoi 9 xu');
const bgMoi = JSON.parse(JSON.stringify(bg)); Object.keys(bgMoi.phan).forEach(k => { bgMoi.phan[k] = bgMoi.phan[k].xu; }); bgMoi.phan.km_hoi = 7;
ctx.qtLuuBangGia(tokChu, bgMoi);
kt(ctx.ttBangGia_().phan.km_hoi.xu === 7 && ctx.ttBangGia_().phan.co_ban.xu === bg.phan.co_ban.xu, 'Quản trị lưu giá km_hoi = 7, giá khác giữ nguyên');
const so2 = ctx.ttSoDu_('kmhoi1'), r7 = ctx.muaPhan(tk, T(10), 'km_hoi', 'tinh_cam');
kt(r7.ok && r7.gia === 7 && ctx.ttSoDu_('kmhoi1') === so2 - 7, 'mua theo giá Quản trị (7 xu)');
kt(ctx.kyMonHoi(tk, 'thi_cu', T(10)).gia === 7, 'kyMonHoi báo giá theo bảng giá hiện hành');
ctx.PropertiesService.getScriptProperties().deleteProperty('TT_BANG_GIA');
kt(ctx.ttQuyen_({ ten: 'kmhoi1', vaiTro: 'thanhVien' }, 'TK:kmhoi1').hoiVien === '' || !ctx.ttHoiVien_('kmhoi1'), 'dòng km_hoi theo TK: không bị hiểu nhầm là Hội viên năm');

console.log('Kỳ Môn hỏi một việc: đạt ' + ok + '/' + (ok + sai));
process.exit(sai ? 1 : 0);
