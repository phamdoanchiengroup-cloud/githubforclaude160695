/**
 * Kiểm thử phần máy chủ Thái Ất (21/11): API + bán – ThanhToan.gs › thaiAtThoiCuoc, thaiAtMenh, thaiAtHoi, taGanNam_ / ttCatThaiAtNam_,
 * muaPhan 'ta_menh' (theo lá số), 'ta_hoi' (theo tài khoản), combo 'hoi_2_mon' (Kỳ Môn + Thái Ất).
 * Apps Script giả lập (tools/gia-lap.js). Chạy: node tests/thai-at-hoi.js
 */
const path = require('path');
const { ctx } = require(path.join(__dirname, '..', 'tools', 'gia-lap.js'));
let ok = 0, sai = 0;
function kt(dk, msg) { if (dk) ok++; else { sai++; console.log('✗', msg); } }
function nem(fn) { try { fn(); return null; } catch (e) { return e.message; } }
const cache = ctx.CacheService.getScriptCache();
const MUC = ['thuan', 'thuan_dk', 'nen_cho'];
const vn = new Date(Date.now() + 7 * 3600e3);
const moc = new Date(Date.UTC(vn.getUTCFullYear(), vn.getUTCMonth(), vn.getUTCDate(), vn.getUTCHours() + 2));
if (moc.getUTCHours() % 2 === 0) moc.setUTCHours(moc.getUTCHours() + 1);   // đầu một giờ âm lịch
const T = (phut, them) => { const d = new Date(moc.getTime() + (them || 0) * 60e3); return { day: d.getUTCDate(), month: d.getUTCMonth() + 1, year: d.getUTCFullYear(), hour: d.getUTCHours(), minute: phut == null ? d.getUTCMinutes() : phut }; };
const nap = (ten, n) => ctx.ttKhoa_(() => ctx.ttCong_(ten, n, 'thử', 'THU'));
const dongMK = (ten, re) => ctx.ttSheet_('MoKhoa').rows.filter(v => v[1] === ten && re.test(String(v[3])));
const truSC = ten => ctx.ttSheet_('SoCai').rows.filter(v => v[1] === ten && v[2] < 0);
const PHI_HOI = ['luan', 'danhGia', 'nhacHoiLai'];
const LO_HOI = ['ketLuan', 'canCu', '"ly"', '"diem"', '"viec"', '"cach"', 'vaiKhac'];

// 0. Bảng giá
const bg = ctx.ttBangGia_();
kt(bg.phan.ta_menh.xu === 19 && bg.phan.ta_hoi.xu === 9 && bg.phan.hoi_2_mon.xu === 15 && !bg.phan.ta_hoi.an, 'bảng giá: ta_menh 19, ta_hoi 9, hoi_2_mon 15');

// 1. Thời cuộc chung: không cần đăng nhập, có cache
const tc = ctx.thaiAtThoiCuoc();
kt(tc.ok && tc.nam.ban.ke === 'nam' && tc.thang.ban.ke === 'thang' && tc.nam.ban.o.length === 17 && MUC.includes(tc.nam.muc) && MUC.includes(tc.thang.muc), 'thời cuộc: Tuế kế + Nguyệt kế, bàn 17 ô, có mức');
kt(tc.thang12.length === 12 && tc.thang12.map(x => x.thang).join() === '1,2,3,4,5,6,7,8,9,10,11,12' && tc.thang12.filter(x => x.nay).length === 1 && tc.thang12.find(x => x.nay).thang === tc.thangTiet, '12 dòng tháng tiết, đúng 1 tháng hiện tại');
kt(typeof tc.nam.van === 'object' && 'van' in tc.nam.van && Array.isArray(tc.nam.van.canCu), 'thời cuộc: khung văn {tieuDe, van, canCu}');
kt(cache.get('TAC_' + tc.namTiet + '_' + tc.thangTiet), 'thời cuộc: đã cache theo năm/tháng tiết');
cache.put('TAC_' + tc.namTiet + '_' + tc.thangTiet, JSON.stringify({ ok: true, tuCache: 1 }));
kt(ctx.thaiAtThoiCuoc().tuCache === 1, 'thời cuộc: lần sau đọc từ cache');
cache.remove('TAC_' + tc.namTiet + '_' + tc.thangTiet);
kt(!/"(soDu|daMua|token|email|danhGia|luan)"/.test(JSON.stringify(tc)), 'thời cuộc: không có trường riêng tư / trả phí');

// 2. Hỏi việc: chặn khách, loại sai, thời điểm sai
kt(/đăng nhập/.test(nem(() => ctx.thaiAtHoi('', 'cong_viec')) || ''), 'thaiAtHoi: khách bị chặn');
kt(/đăng nhập/.test(nem(() => ctx.muaPhan('', T(10), 'ta_hoi', 'cong_viec')) || '') && /đăng nhập/.test(nem(() => ctx.muaPhan('', T(10), 'hoi_2_mon', 'cong_viec')) || ''), 'muaPhan ta_hoi / hoi_2_mon: khách bị chặn');
const tk = ctx.dangKy('tahoi1', 'matkhau123', 'TA', 'tahoi1@vidu.vn', '').token;
['', 'chung', 'xo_so', 'toString', '__proto__', null].forEach(l => kt(/Loại việc không hợp lệ/.test(nem(() => ctx.thaiAtHoi(tk, l)) || ''), 'loại việc "' + l + '" bị từ chối'));
kt(/Loại việc/.test(nem(() => ctx.muaPhan(tk, T(10), 'ta_hoi', 'chung')) || ''), 'muaPhan ta_hoi: loại "chung" (chỉ dùng nội bộ) bị từ chối');
const xa = new Date(Date.now() + 7 * 3600e3 + 10 * 864e5);
kt(/Chỉ hỏi được/.test(nem(() => ctx.thaiAtHoi(tk, 'cong_viec', { day: xa.getUTCDate(), month: xa.getUTCMonth() + 1, year: xa.getUTCFullYear(), hour: 9, minute: 0 })) || ''), 'thời điểm quá 3 ngày tới bị từ chối');
kt(/Chỉ hỏi được/.test(nem(() => ctx.muaPhan(tk, { day: xa.getUTCDate(), month: xa.getUTCMonth() + 1, year: xa.getUTCFullYear(), hour: 9, minute: 0 }, 'ta_hoi', 'cong_viec')) || ''), 'muaPhan ta_hoi: thời điểm ngoài khung bị từ chối');

// 3. Phần miễn phí: bàn + 1 câu + mức, không lộ phần trả phí
const f = ctx.thaiAtHoi(tk, 'cong_viec', T(10));
kt(f.ok && f.mon === 'thai_at' && f.ban.ke === 'gio' && f.ban.o.length === 17 && f.ban.o.some(o => o.than.length) && f.ban.thaiAt.huong, 'miễn phí: bàn Thời kế 17 ô có thần');
kt(/^Giờ này/.test(f.cauHeLo) && MUC.includes(f.muc) && f.mucTen && f.vai === 'khach' && f.vaiTen, 'miễn phí: 1 câu hé lộ + mức, vai mặc định người chủ động');
kt(f.ma === 'ta_hoi:' + ctx.kmMaHoi_(T(10), 'cong_viec').slice(7) && /^ta_hoi:\d{10}:cong_viec$/.test(f.ma), 'mã ta_hoi cùng khung giờ âm lịch với km_hoi (' + f.ma + ')');
kt(f.gia === 9 && f.daMua === false && f.kyMonDaMua === false && f.giaCombo.gia === 15 && f.giaCombo.thieu.length === 2, 'miễn phí: giá 9, combo 15');
const js = JSON.stringify(f);
PHI_HOI.forEach(k => kt(!(k in f), 'miễn phí không có "' + k + '"'));
LO_HOI.forEach(k => kt(js.indexOf(k) < 0, 'miễn phí không lộ ' + k));
kt(ctx.thaiAtHoi(tk, 'cong_viec', T(10), 'chu').vai === 'chu', 'chọn vai người đang giữ');
kt(ctx.thaiAtHoi(tk, 'suc_khoe', T(10)).luuY.some(x => /bác sĩ/.test(x)), 'sức khỏe: thêm lời khuyên hỏi bác sĩ');

// 4. Mua ta_hoi: thiếu xu không trừ; đủ trừ 9 một lần; mua lại → daCo
const so0 = ctx.ttSoDu_('tahoi1');
const r0 = ctx.muaPhan(tk, T(10), 'ta_hoi', 'cong_viec');
kt(r0.ok === false && r0.gia === 9 && ctx.ttSoDu_('tahoi1') === so0, 'thiếu xu: báo thiếu, không trừ');
nap('tahoi1', 30);
const so1 = ctx.ttSoDu_('tahoi1');
const r1 = ctx.muaPhan(tk, T(10), 'ta_hoi', 'cong_viec');
kt(r1.ok && r1.gia === 9 && r1.soDu === so1 - 9 && ctx.ttSoDu_('tahoi1') === so1 - 9 && r1.ma === f.ma, 'mua ta_hoi: trừ đúng 9 xu');
kt(r1.ketQua && r1.ketQua.daMua && r1.ketQua.luan && r1.ketQua.danhGia && r1.ketQua.muc === f.muc && JSON.stringify(r1.ketQua.ban) === JSON.stringify(f.ban), 'mua: trả luôn kết quả đầy đủ, cùng bàn/mức với phần miễn phí');
const r2 = ctx.muaPhan(tk, T(10), 'ta_hoi', 'cong_viec'), r3 = ctx.muaPhan(tk, T(50), 'ta_hoi', 'cong_viec');
kt(r2.daCo && r3.daCo && ctx.ttSoDu_('tahoi1') === so1 - 9, 'mua lại cùng giờ âm lịch → daCo, không trừ hai lần');
kt(r2.ketQua && /hỏi lại sau ít nhất một ngày/.test(r2.ketQua.nhacHoiLai || ''), 'mua lại: kèm lời nhắc');
const mk = dongMK('tahoi1', /^ta_hoi:/);
kt(mk.length === 1 && mk[0][2] === 'TK:tahoi1' && mk[0][4] === 9 && /Thái Ất.*@\d{4}-\d\d-\d\d \d\d:10/.test(mk[0][5]), 'MoKhoa: 1 dòng theo tài khoản, lưu thời điểm đã hỏi');
kt(truSC('tahoi1').length === 1 && truSC('tahoi1')[0][2] === -9, 'sổ cái: 1 dòng trừ 9');
const ev = ctx.ttSheet_('SuKien').rows.filter(v => v[1] === 'mua' && v[2] === 'tahoi1');
kt(ev.length === 1 && /"phan":"ta_hoi"/.test(String(ev[0][3])), 'phễu: ghi sự kiện mua (phần ta_hoi)');

// 5. Mở lại + loại/giờ khác/tài khoản khác
const m1 = ctx.thaiAtHoi(tk, 'cong_viec', T(45));
kt(m1.daMua && m1.luan && m1.danhGia && m1.nhacHoiLai && m1.thoiDiem.minute === 10, 'đã mua: mở lại miễn phí, đúng thời điểm lúc mua');
kt(Array.isArray(m1.danhGia.ly) && m1.danhGia.ly.length && m1.danhGia.ly.every(x => x.k && x.ta && typeof x.tot === 'boolean' && !('diem' in x)), 'căn cứ: mã + câu, không đưa điểm số');
kt(m1.danhGia.vaiKhac && m1.danhGia.vaiKhac.vai === 'chu' && MUC.includes(m1.danhGia.vaiKhac.muc), 'đã mua: kèm mức cho vai còn lại');
kt(ctx.thaiAtHoi(tk, 'cong_viec', T(45), 'chu').daMua, 'đổi vai không phải mua lại');
kt(typeof m1.luan.ketLuan === 'string' && Array.isArray(m1.luan.canCu) && Array.isArray(m1.luan.viec), 'lời luận đúng khuôn {ketLuan, canCu, viec, luuY}');
kt(m1.giaCombo.gia === 6 && m1.giaCombo.thieu.join() === 'km_hoi', 'đã mua Thái Ất: combo chỉ còn 6 (15 − 9)');
kt(!ctx.thaiAtHoi(tk, 'tai_loc', T(10)).daMua && !ctx.thaiAtHoi(tk, 'cong_viec', T(10, 120)).daMua, 'loại việc khác / giờ âm lịch khác: chưa mua');
kt(!ctx.kyMonHoi(tk, 'cong_viec', T(10)).daMua, 'mua Thái Ất không mở Kỳ Môn');
const tk2 = ctx.dangKy('tahoi2', 'matkhau123', 'TA2', 'tahoi2@vidu.vn', '').token;
kt(!ctx.thaiAtHoi(tk2, 'cong_viec', T(10)).daMua, 'tài khoản khác không dùng được lượt của người khác');

// 6. taVanHoi_ chưa có / lỗi / có
const goc = ctx.taVanHoi_;
ctx.taVanHoi_ = undefined;
let p1 = ctx.thaiAtHoi(tk, 'cong_viec', T(10));
kt(p1.luan.ketLuan === '' && p1.luan.chuaCoVan, 'chưa có ThaiAtVan.gs: khung rỗng {ketLuan:"", …, chuaCoVan}');
ctx.taVanHoi_ = () => { throw new Error('hỏng'); };
kt(ctx.thaiAtHoi(tk, 'cong_viec', T(10)).luan.loiVan, 'taVanHoi_ lỗi: vẫn trả khung rỗng');
let nhan = null; ctx.taVanHoi_ = (b, l, d) => { nhan = { b, l, d }; return { ketLuan: 'x', canCu: ['c'], viec: ['1', '2', '3'], luuY: 'l' }; };
p1 = ctx.thaiAtHoi(tk, 'cong_viec', T(10));
kt(p1.luan.ketLuan === 'x' && nhan.b.o.length === 17 && nhan.b.than && nhan.l === 'cong_viec' && nhan.d.muc === f.muc && Array.isArray(nhan.d.ly) && nhan.d.vai === 'khach', 'taVanHoi_ nhận (bàn đầy đủ taLap_, loại, kết quả taDanhGia_)');
ctx.taVanHoi_ = goc;

// 7. Combo 2 môn
const tk3 = ctx.dangKy('tahoi3', 'matkhau123', 'TA3', 'tahoi3@vidu.vn', '').token;
nap('tahoi3', 40);
let s3 = ctx.ttSoDu_('tahoi3');
const c1 = ctx.muaPhan(tk3, T(20), 'hoi_2_mon', 'tai_loc');
kt(c1.ok && c1.gia === 15 && ctx.ttSoDu_('tahoi3') === s3 - 15, 'combo chưa mua môn nào: thu 15');
kt(c1.ketQua.kyMon && c1.ketQua.kyMon.luan && c1.ketQua.thaiAt && c1.ketQua.thaiAt.luan && c1.ketQua.haiMon && typeof c1.ketQua.haiMon.cungChieu === 'boolean', 'combo: trả cả 2 kết quả đầy đủ + đối chiếu 2 môn');
kt(ctx.kyMonHoi(tk3, 'tai_loc', T(20)).daMua && ctx.thaiAtHoi(tk3, 'tai_loc', T(20)).daMua, 'combo: mở cả kyMonHoi lẫn thaiAtHoi');
const mk3 = dongMK('tahoi3', /^(km_hoi|ta_hoi):/);
kt(mk3.length === 2 && mk3[0][4] + mk3[1][4] === 15 && mk3.every(v => /combo 2 môn/.test(v[5]) && /@\d{4}-\d\d-\d\d \d\d:20/.test(v[5])), 'combo: 2 dòng MoKhoa, tổng giá ghi = 15, lưu thời điểm');
kt(truSC('tahoi3').length === 1 && truSC('tahoi3')[0][2] === -15 && /hoi_2_mon:/.test(truSC('tahoi3')[0][4]), 'combo: 1 dòng sổ cái');
const c2 = ctx.muaPhan(tk3, T(40), 'hoi_2_mon', 'tai_loc');
kt(c2.ok && c2.daCo && ctx.ttSoDu_('tahoi3') === s3 - 15 && c2.ketQua.kyMon.nhacHoiLai, 'combo mua lại → daCo, không trừ');
kt(ctx.muaPhan(tk3, T(40), 'ta_hoi', 'tai_loc').daCo && ctx.muaPhan(tk3, T(40), 'km_hoi', 'tai_loc').daCo, 'sau combo: mua lẻ từng môn → daCo');
// đã mua Kỳ Môn lẻ → combo chỉ thu phần còn lại (15 − 9 = 6)
s3 = ctx.ttSoDu_('tahoi3');
ctx.muaPhan(tk3, T(15), 'km_hoi', 'tinh_cam');
kt(ctx.ttSoDu_('tahoi3') === s3 - 9 && ctx.thaiAtHoi(tk3, 'tinh_cam', T(30)).kyMonDaMua && ctx.thaiAtHoi(tk3, 'tinh_cam', T(30)).giaCombo.gia === 6, 'đã mua Kỳ Môn: thaiAtHoi báo kyMonDaMua, combo còn 6');
const c3 = ctx.muaPhan(tk3, T(30), 'hoi_2_mon', 'tinh_cam');
kt(c3.ok && c3.gia === 6 && ctx.ttSoDu_('tahoi3') === s3 - 15, 'combo khi đã có Kỳ Môn: chỉ thu 6 (15 − 9)');
kt(c3.ketQua.thaiAt.thoiDiem.minute === 15 && c3.ketQua.kyMon.thoiDiem.minute === 15, 'combo: môn còn thiếu lập đúng thời điểm đã hỏi môn trước');
kt(dongMK('tahoi3', /^ta_hoi:.*tinh_cam$/).length === 1 && dongMK('tahoi3', /^km_hoi:.*tinh_cam$/).length === 1, 'combo: không ghi trùng dòng Kỳ Môn đã có');
// thiếu xu
const tk4 = ctx.dangKy('tahoi4', 'matkhau123', 'TA4', 'tahoi4@vidu.vn', '').token, s4 = ctx.ttSoDu_('tahoi4');
const c4 = ctx.muaPhan(tk4, T(10), 'hoi_2_mon', 'di_xa');
kt(c4.ok === false && c4.gia === 15 && ctx.ttSoDu_('tahoi4') === s4 && !dongMK('tahoi4', /./).length, 'combo thiếu xu: không trừ, không ghi quyền');

// 8. Mệnh pháp: tóm tắt miễn phí, đầy đủ theo lá số
const LS = { name: 'Lan', day: 15, month: 8, year: 1990, hour: 10, minute: 30, gender: 'nu', calendar: 'duong' };
{ const g = ctx.thaiAtMenh('', LS); kt(g.ok && g.luan.tomTat && !g.cung12 && g.canDangNhap, 'thaiAtMenh: khách xem tóm tắt, không có phần trả phí'); }
kt(/không hợp lệ/.test(nem(() => ctx.thaiAtMenh(tk2, { day: 40, month: 1, year: 1990 })) || ''), 'thaiAtMenh: ngày sinh sai bị từ chối');
const me = ctx.thaiAtMenh(tk2, LS);
kt(me.ok && me.banNam.ke === 'nam' && me.banNam.o.length === 17 && me.theBamSinh.giai && /^Bạn thuộc mẫu người|./.test(me.luan.tomTat) && me.gia === 19 && me.daMua === false, 'mệnh miễn phí: bàn năm sinh + thế bẩm sinh + tóm tắt, giá 19');
['cung12', 'menh', 'thanCung', 'cachNamSinh', 'banGio'].forEach(k => kt(!(k in me), 'mệnh miễn phí không có "' + k + '"'));
kt(!('chiTiet' in me.luan) && !('loiKhuyen' in me.luan) && !('canCu' in me.luan) && !('chuToan' in me.theBamSinh), 'mệnh miễn phí: luan chỉ có tóm tắt');
nap('tahoi2', 40);
const s2 = ctx.ttSoDu_('tahoi2'), mm = ctx.muaPhan(tk2, LS, 'ta_menh');
kt(mm.ok && mm.gia === 19 && ctx.ttSoDu_('tahoi2') === s2 - 19, 'mua ta_menh: trừ 19');
kt(ctx.muaPhan(tk2, LS, 'ta_menh').daCo && ctx.ttSoDu_('tahoi2') === s2 - 19, 'mua lại ta_menh → daCo, không trừ');
const me2 = ctx.thaiAtMenh(tk2, LS);
kt(me2.daMua && me2.cung12.length === 12 && me2.cung12.every(c => c.ten && c.chiTen && ['tot', 'xau', 'tron'].includes(c.danhGia)) && me2.menh.chiTen && me2.thanCung.cungTen && me2.banGio.ke === 'gio', 'đã mua: 12 cung, cung Mệnh, cung Thân, bàn giờ sinh');
kt(Array.isArray(me2.luan.chiTiet) && Array.isArray(me2.luan.loiKhuyen) && Array.isArray(me2.luan.canCu) && me2.luan.tomTat === me.luan.tomTat, 'đã mua: luan đủ khuôn, tóm tắt trùng bản miễn phí');
kt(dongMK('tahoi2', /^ta_menh$/).length === 1 && dongMK('tahoi2', /^ta_menh$/)[0][2] === ctx.ttKhoaLaSo_(LS), 'ta_menh khóa theo lá số (ttKhoaLaSo_)');
kt(!ctx.thaiAtMenh(tk2, Object.assign({}, LS, { day: 16 })).daMua && !ctx.thaiAtMenh(tk2, Object.assign({}, LS, { name: 'Mai' })).daMua, 'lá số khác (ngày / tên khác) chưa mở');
kt(!ctx.thaiAtMenh(tk3, LS).daMua, 'tài khoản khác cùng lá số: chưa mở');
const goc2 = ctx.taVanMenh_;
ctx.taVanMenh_ = () => ({ tomTat: 'TT', chiTiet: [{ cung: 'menh', tieuDe: 'a', van: 'b' }], loiKhuyen: ['k'], canCu: ['c'], luuY: 'L' });
const me3 = ctx.thaiAtMenh(tk3, LS), me4 = ctx.thaiAtMenh(tk2, LS);
kt(me3.luan.tomTat === 'TT' && !me3.luan.chiTiet && me4.luan.chiTiet.length === 1 && me4.luan.luuY === 'L', 'có taVanMenh_: miễn phí chỉ nhận tomTat, đã mua nhận đủ');
ctx.taVanMenh_ = goc2;

// 9. Vận năm ghép vào lapLaSo (r.thaiAtNam): chưa mua năm chỉ heLo; đã mua năm có đủ
const LS7 = Object.assign({}, LS, { viewYear: 2027 });
const y0 = ctx.lapLaSo(LS7, tk2).thaiAtNam;
kt(y0 && y0.nam === 2027 && y0.khoa && y0.heLo && MUC.includes(y0.muc) && Object.keys(y0).sort().join() === 'heLo,khoa,muc,mucTen,nam,namCanChi', 'năm chưa mở: chỉ heLo + mức (' + y0.heLo + ')');
const yk = ctx.lapLaSo(LS7, '').thaiAtNam;
kt(yk && yk.khoa && !yk.luan && !yk.ban, 'khách (chưa đăng nhập): cũng chỉ thấy heLo');
const s2b = ctx.ttSoDu_('tahoi2'); ctx.muaPhan(tk2, LS7, 'nam', '2027');
kt(ctx.ttSoDu_('tahoi2') === s2b - 19, 'mua bức tranh chung năm 2027 (19)');
const y1 = ctx.lapLaSo(LS7, tk2).thaiAtNam;
kt(y1 && !y1.khoa && y1.ban && y1.ban.ke === 'nam' && y1.luan && Array.isArray(y1.ly) && Array.isArray(y1.cungDuocPhuc) && y1.heLo === y0.heLo && y1.muc === y0.muc, 'đã mua năm: thaiAtNam đầy đủ, hé lộ khớp');
kt(ctx.lapLaSo(Object.assign({}, LS, { viewYear: 2028 }), tk2).thaiAtNam.khoa, 'năm khác (2028) vẫn khóa');
const goc3 = ctx.taVanNam_;
ctx.taVanNam_ = () => ({ heLo: 'HL', van: 'V', viec: ['a', 'b', 'c'], canCu: [], ghiChu: '' });
const y2 = ctx.lapLaSo(LS7, tk3).thaiAtNam, y3 = ctx.lapLaSo(LS7, tk2).thaiAtNam;
kt(y2.heLo === 'HL' && !y2.luan && y3.luan.van === 'V' && y3.luan.viec.length === 3, 'có taVanNam_: miễn phí chỉ heLo, đã mua có van + 3 việc');
ctx.taVanNam_ = goc3;

// 10. Toàn quyền: xem đủ, không trừ
const tokChu = 'tok-chu-tahoi-00000000000001';
cache.put('SS_' + tokChu, JSON.stringify({ ten: 'chienpham' }));
if (!ctx.tkDoc_('chienpham')) ctx.tkGhi_('chienpham', { salt: 'x', hash: 'y', vaiTro: 'chu', hienThi: 'Chủ' });
const h0 = ctx.thaiAtHoi(tokChu, 'di_xa', T(10));
kt(h0.toanQuyen && h0.luan && h0.danhGia && h0.soDu === null && h0.giaCombo.gia === 0, 'chủ sở hữu: hỏi việc xem đủ');
kt(ctx.muaPhan(tokChu, T(10), 'ta_hoi', 'di_xa').toanQuyen && ctx.muaPhan(tokChu, T(10), 'hoi_2_mon', 'di_xa').toanQuyen && ctx.muaPhan(tokChu, LS, 'ta_menh').toanQuyen, 'chủ sở hữu: muaPhan → toanQuyen');
kt(ctx.thaiAtMenh(tokChu, LS).cung12.length === 12 && !ctx.lapLaSo(LS7, tokChu).thaiAtNam.khoa, 'chủ sở hữu: mệnh đầy đủ, năm đầy đủ');
for (let i = 0; i < 35; i++) ctx.thaiAtHoi(tokChu, 'di_xa', T(10));
ok++;

// 11. Giới hạn 30 lượt / 10 phút
const tk5 = ctx.dangKy('tahoi5', 'matkhau123', 'TA5', 'tahoi5@vidu.vn', '').token;
let dem = 0, loi = null;
for (let i = 0; i < 31 && !loi; i++) { loi = nem(() => ctx.thaiAtHoi(tk5, 'thi_cu', T(10))); if (!loi) dem++; }
kt(dem === 30 && /đợi khoảng 10 phút/.test(loi || ''), 'lượt thứ 31 trong 10 phút bị chặn (' + dem + ')');
kt(!nem(() => ctx.thaiAtHoi(tk2, 'thi_cu', T(10))), 'giới hạn tính riêng từng tài khoản');
const gv = JSON.parse(cache.get('TAH_tahoi5')); gv.t -= 601e3; cache.put('TAH_tahoi5', JSON.stringify(gv));
kt(!nem(() => ctx.thaiAtHoi(tk5, 'thi_cu', T(10))), 'sau 10 phút hỏi lại được');

// 12. Quản trị đổi giá
const bgMoi = JSON.parse(JSON.stringify(bg)); Object.keys(bgMoi.phan).forEach(k => { bgMoi.phan[k] = bgMoi.phan[k].xu; });
bgMoi.phan.ta_hoi = 7; bgMoi.phan.hoi_2_mon = 12; bgMoi.phan.ta_menh = 15;
ctx.qtLuuBangGia(tokChu, bgMoi);
kt(ctx.ttBangGia_().phan.ta_hoi.xu === 7 && ctx.ttBangGia_().phan.hoi_2_mon.xu === 12 && ctx.ttBangGia_().phan.ta_menh.xu === 15, 'Quản trị lưu giá Thái Ất');
const s5 = ctx.ttSoDu_('tahoi5'); nap('tahoi5', 40);
const g1 = ctx.muaPhan(tk5, T(10), 'hoi_2_mon', 'kien_tung');
kt(g1.ok && g1.gia === 12 && ctx.ttSoDu_('tahoi5') === s5 + 40 - 12, 'combo theo giá Quản trị (12 < 9+7)');
kt(ctx.thaiAtHoi(tk5, 'cong_viec', T(10)).gia === 7 && ctx.thaiAtMenh(tk5, LS).gia === 15, 'API báo giá theo bảng giá hiện hành');
ctx.PropertiesService.getScriptProperties().deleteProperty('TT_BANG_GIA');

console.log('Thái Ất API + bán: đạt ' + ok + '/' + (ok + sai));
process.exit(sai ? 1 : 0);
