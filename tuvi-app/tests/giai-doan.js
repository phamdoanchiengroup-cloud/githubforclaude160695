/** Kiểm thử bán theo giai đoạn: đại vận / vận năm / tháng / Đồng hành / Trọn đời / gói gia đình và phần cắt ở máy chủ. Chạy: node tests/giai-doan.js */
const { ctx } = require('../tools/gia-lap.js');
let ok = 0, sai = 0; function kt(dk, ten) { if (dk) ok++; else { sai++; console.log('  ✘', ten); } }
const dk = ctx.dangKy('khachgd', 'matkhau123', 'Khách GĐ', 'khachgd@vidu.vn', '');
const tok = dk.token; kt(tok, 'đăng ký có token');
const G = k => ctx.TT_PHAN_MAC_DINH[k].xu, qua0 = ctx.ttSoDu_('khachgd');
ctx.ttKhoa_(() => ctx.ttCong_('khachgd', 1000, 'test', ''));
const vy = new Date().getFullYear();
const inp = { name: 'Nguyễn Văn An', gender: 'nam', calendar: 'duong', day: 5, month: 6, year: 1990, hour: 8, minute: 0, viewYear: vy, place: '21.03|105.85|Hà Nội', tz: '7' };
let r = ctx.lapLaSo(inp, tok);
// 16/11 – phương án A "Tài khoản là chìa khóa": Tổng hợp 6 hệ + dò giờ + 1 đại vận đã qua gần nhất miễn phí cho tài khoản
kt(!r.khach && !r.tongKhoa && r.quyen.co_ban && r.quyen.do_gio && qua0 === 0 && dk.canXacThuc, 'tài khoản: Tổng hợp 6 hệ + dò giờ miễn phí; quà chỉ sau khi xác thực email (16/11)');
kt(r.tuvi.luanGiai.cung.length === 12 && r.battu.goiY && r.battu.phanTich && r.moRong.chiemTinhLuan && r.moRong.haLac && r.moRong.thanSo && r.moRong.hd, 'luận giải 6 hệ mở miễn phí');
kt(r.moRong.deHieu.th6 && r.moRong.tongHop.tinhCach, 'Tổng hợp 6 hệ có kết luận đầy đủ');
const moDv = () => r.chiTiet.daiVan.filter(d => !d.khoa), bd = d => +String(d.nam).slice(0, 4);
kt(moDv().length === 1 && bd(moDv()[0]) + 9 < vy && moDv()[0].secs.length > 0 && r.vanTom.dvQuaMienPhi === bd(moDv()[0]), 'đúng 1 đại vận đã qua gần nhất mở miễn phí (' + r.vanTom.dvQuaMienPhi + ')');
kt(r.chiTiet.daiVan.filter(d => bd(d) + 9 < vy).every(d => bd(d) <= r.vanTom.dvQuaMienPhi), 'vận miễn phí là vận đã qua GẦN NHẤT');
kt(r.vanTom.coNam === false && r.chiTiet.nhatVan.length === 0 && r.vanTom.coThang === false, 'chưa mua: vận năm, nhật vận khóa');
kt(r.moRong.tongHop.thang.every(t => t.khoa && t.tv === undefined), '12 tháng chỉ còn điểm');
kt(r.battuChiTiet.luuNien.length === 0, 'lưu niên Bát Tự khóa');
const loNam = x => { const j = JSON.stringify(x.moRong); return /Hồ sơ năm \(profection\): năm/.test(j) || /là Năm Cá Nhân \d/.test(j) || (x.moRong.tongHop.namNay.nguon || []).length > 0 || /Mặt Trăng tiến triển/.test(j); };
kt(!loNam(r), 'rà soát B1: chưa mua năm → không lộ lời luận năm của Chiêm tinh / Thần số / HD / Tổng hợp');
// Rà soát V2: lời luận đại vận trong tab từng hệ không lộ phần đang bán
const dvc = r.battuChiTiet.daiVanCungVi || [];
const giao = (s, e, ds) => ds.some(b => s <= b + 9 && e >= b && (!(s <= vy && vy <= e) || (b <= vy && vy <= b + 9))), mp0 = [r.vanTom.dvQuaMienPhi];
kt(dvc.length && dvc.every(d => !!d.khoa === !giao(+d.nam, +d.nam + 9, mp0)) && dvc.some(d => !d.khoa) && dvc.filter(d => d.khoa).every(d => d.items.length === 1), 'Bát Tự: chỉ mở giai đoạn trùng năm với đại vận miễn phí, còn lại chỉ giữ khung');
const hl = (r.moRong.haLac.luan || {}).daiVan || [];
kt(hl.length && hl.every(v => !!v.khoa === !giao(+String(v.nam).slice(0, 4), +String(v.nam).slice(-4), mp0)) && hl.filter(v => v.isNow).every(v => v.khoa), 'Hà Lạc: chỉ mở giai đoạn trùng đại vận miễn phí, vận hiện tại khóa');
const vl = r.duDoan && r.duDoan.vanLon ? [].concat(r.duDoan.vanLon.tot || [], r.duDoan.vanLon.xau || []) : [];
kt(vl.length && vl.every(d => bd(d) === r.vanTom.dvQuaMienPhi ? !d.khoa : d.khoa && d.hoa.length === 0), 'Dự đoán: chỉ đại vận miễn phí mở, vận khác chỉ giữ khung + mức');
kt(ctx.muaPhan(tok, inp, 'co_ban').daCo, 'Tổng hợp đã có sẵn → mua lại không trừ');
let m = ctx.muaPhan(tok, inp, 'phoi_ngau'); kt(m.ok && m.gia === G('phoi_ngau'), 'mua phối ngẫu ' + G('phoi_ngau') + ' (không cần mở gì trước)');
const nowDv = r.chiTiet.daiVan.filter(d => d.isNow)[0], bdNow = bd(nowDv);
m = ctx.muaPhan(tok, inp, 'dai_van', bdNow); kt(m.ok && m.gia === G('dai_van'), 'mua đại vận hiện tại ' + G('dai_van'));
const past = r.chiTiet.daiVan.filter(d => bd(d) + 9 < vy && bd(d) !== r.vanTom.dvQuaMienPhi)[0];
m = ctx.muaPhan(tok, inp, 'dai_van', bd(past)); kt(m.ok && m.gia === G('dai_van_qua'), 'đại vận đã qua (cũ hơn) giá kiểm chứng ' + G('dai_van_qua'));
m = ctx.muaPhan(tok, inp, 'dai_van', r.vanTom.dvQuaMienPhi); kt(m.daCo, 'vận miễn phí: mua lại → đã có, không trừ');
m = ctx.muaPhan(tok, inp, 'dai_van', bdNow); kt(m.daCo, 'mua lại → đã có, không trừ');
r = ctx.lapLaSo(inp, tok);
kt(moDv().length === 3, 'đúng 3 đại vận mở (1 miễn phí + 2 đã mua)');
kt(moDv().every(d => d.secs.length > 0), 'vận đã mở có lời luận');
kt(r.duDoan.vanLon && [].concat(r.duDoan.vanLon.tot || [], r.duDoan.vanLon.xau || []).filter(d => bd(d) === bdNow).every(d => !d.khoa), 'đại vận đã mua: lời luận trong Dự đoán cũng mở');
{ const mo = moDv().map(bd); kt(r.battuChiTiet.daiVanCungVi.every(d => !!d.khoa === !giao(+d.nam, +d.nam + 9, mo)) && r.moRong.haLac.luan.daiVan.every(v => !!v.khoa === !giao(+String(v.nam).slice(0, 4), +String(v.nam).slice(-4), mo)), 'đại vận đã mua lẻ: giai đoạn Bát Tự / Hà Lạc trùng năm cũng mở'); }
m = ctx.muaPhan(tok, inp, 'nam', vy); kt(m.ok && m.gia === G('nam'), 'mua vận năm ' + G('nam'));
r = ctx.lapLaSo(inp, tok);
kt(r.vanTom.coNam && r.chiTiet.nguyetVan.length === 12 && !r.chiTiet.tieuVan.khoa, 'vận năm mở: 12 nguyệt vận + tiểu vận');
kt(loNam(r) && r.moRong.tongHop.namNay.nguon.length > 0, 'đã mua năm → lời luận năm của các hệ hiện đủ');
kt(r.battuChiTiet.luuNien.length === 1 && r.battuChiTiet.luuNien[0].nam === vy, 'lưu niên Bát Tự chỉ năm đã mua');
kt(r.vanTom.coThang === false, 'nhật vận vẫn khóa sau khi mua năm');
kt(r.namCd && ['cv', 'tien', 'tc', 'sk'].every(k => r.namCd[k].khoa && r.namCd[k].tom && !r.namCd[k].items), 'bức tranh chung: 4 chủ đề chỉ 1 dòng tóm tắt (chủ đề bán riêng 9 xu)');
m = ctx.muaPhan(tok, inp, 'dong_hanh', vy); kt(m.ok && m.gia === G('dong_hanh') - G('nam'), 'Đồng hành trừ phần năm đã mua (' + (G('dong_hanh') - G('nam')) + ')');
r = ctx.lapLaSo(inp, tok);
kt(r.vanTom.coThang && r.chiTiet.nhatVan.length === 7, 'đồng hành: nhật vận mở');
kt(['cv', 'tien', 'tc', 'sk'].every(k => r.namCd[k].co && r.namCd[k].items.length) && r.moRong.tongHop.hoSoNam.suKien.every(x => !x.khoa), 'đồng hành: mở cả 4 chủ đề năm');
const iNext = { ...inp, viewYear: vy + 1 }; r = ctx.lapLaSo(iNext, tok);
kt(r.vanTom.coNam === false, 'năm sau vẫn phải mua riêng (thu định kỳ)');
m = ctx.muaPhan(tok, inp, 'thang', (vy + 1) + '-3'); kt(m.ok && m.gia === G('thang'), 'mua tháng lẻ ' + G('thang'));
try { ctx.muaPhan(tok, inp, 'thang', 'abc'); kt(false, 'tháng sai phải lỗi'); } catch (e) { kt(/Tháng/.test(e.message), 'kiểm tra định dạng tháng'); }
const daTraTG = G('phoi_ngau') + G('dai_van') + G('dai_van_qua'), giaTG = G('tron_goi') - Math.min(daTraTG, Math.floor(G('tron_goi') / 2));
m = ctx.muaPhan(tok, inp, 'tron_goi'); kt(m.ok && m.gia === giaTG, 'Trọn đời trừ phần lẻ đã trả (bạn đời + 2 đại vận = ' + daTraTG + ', tối đa 50%) → ' + giaTG);
r = ctx.lapLaSo(inp, tok);
kt(r.chiTiet.daiVan.every(d => !d.khoa), 'Trọn đời: mở cả 12 đại vận');
kt((r.battuChiTiet.daiVanCungVi || []).every(d => !d.khoa) && ((r.moRong.haLac.luan || {}).daiVan || []).every(v => !v.khoa), 'Trọn đời: đại vận Bát Tự / Hà Lạc mở hết');
kt(r.quyen.bien_co && r.quyen.phoi_ngau && r.quyen.do_gio, 'Trọn đời gồm biến cố, phối ngẫu, dò giờ');
// Gói gia đình: mỗi lượt = Đồng hành cả năm cho 1 lá số
m = ctx.muaPhan(tok, null, 'gia_dinh_3'); kt(m.ok && m.gia === G('gia_dinh_3') && m.soVe === 3, 'mua gói gia đình 3 (' + G('gia_dinh_3') + ' xu) → 3 lượt');
const me = { name: 'Trần Thị Mẹ', gender: 'nu', calendar: 'duong', day: 2, month: 3, year: 1965, hour: 6, minute: 0, viewYear: vy, place: '21.03|105.85|Hà Nội', tz: '7' };
r = ctx.lapLaSo(me, tok); kt(!r.tongKhoa && !r.vanTom.coNam && r.soVe === 3, 'lá số người nhà: Tổng hợp miễn phí, vận năm chưa mở, thấy 3 lượt');
m = ctx.dungLuotGiaDinh(tok, me); kt(m.ok && m.soVe === 2, 'dùng 1 lượt → còn 2');
r = ctx.lapLaSo(me, tok); kt(r.vanTom.coNam && r.vanTom.coThang && r.chiTiet.nhatVan.length === 7 && r.chiTiet.daiVan.filter(d => !d.khoa).length <= 1 && !r.quyen.bien_co, 'lượt gia đình: Đồng hành cả năm (vận năm + tháng + nhật vận), đại vận vẫn bán riêng');
m = ctx.dungLuotGiaDinh(tok, me); kt(m.daCo && m.soVe === 2, 'dùng lại cho cùng lá số không mất lượt');
const soDu = ctx.ttSoDu_('khachgd'); kt(soDu === qua0 + 1000 - G('phoi_ngau') - G('dai_van') - G('dai_van_qua') - G('nam') - (G('dong_hanh') - G('nam')) - G('thang') - giaTG - G('gia_dinh_3'), 'số dư khớp sổ cái (' + soDu + ')');
// Khách chưa đăng nhập
r = ctx.lapLaSo(inp, ''); kt(!loNam(r), 'khách: không lộ lời luận năm'); kt(!r.khach && !r.canMo && r.tongKhoa && r.tuvi.luanGiai.cung.length === 12 && r.chiTiet.daiVan.every(d => d.khoa) && r.moRong.tongHop.thang.every(t => t.khoa) && !r.moRong.tongHop.hoiTu, 'khách chưa đăng nhập: đọc được 6 hệ, vận hạn & biến cố khóa');
console.log('Đạt', ok, '/', ok + sai);
