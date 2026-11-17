/** Kiểm thử 17/11: ngày dự kiến xong cho Bán hàng (máy chủ chép mô phỏng của bảng đơn – so với đúng hàm dhMoPhong trong quy-trinh-web.html
 *  trên cùng dữ liệu), bảng đơn nhà máy 4 cột, "đang xem", giai đoạn 2 khóa cột Sheet đơn (cảnh báo / khóa hẳn / gỡ / nhật ký sửa tay / tự rà lại).
 *   DATA=<csdl.json> TZ=Asia/Ho_Chi_Minh node kpi-app/tests/du-kien.js */
const path = require('path'), fs = require('fs'), vm = require('vm'); const G = require('./gia-lap-kpi.js');
const DATA = process.env.DATA; if (!DATA) { console.log('Cần DATA='); process.exit(1); }
let n = 0, l = 0; const ok = (c, t, x) => { n++; if (!c) l++; console.log((c ? '  ✓ ' : '  ✗ ') + t + (c ? '' : ' → ' + String(JSON.stringify(x)).slice(0, 500))); };
const du = JSON.parse(fs.readFileSync(DATA, 'utf8'));
['DonHangChup', 'PhanLoaiSKU', 'CauHinhSP', 'BTPTheoSKU', 'DonUuTien'].forEach(k => { if (du[k]) du[k] = du[k].slice(0, 1); });
const iDoi = du.TaiKhoan[0].indexOf('DoiMatKhauLanDau'); du.TaiKhoan.slice(1).forEach(x => { x[iDoi] = 'Không'; });
const c = G.tao(path.join(__dirname, '..', 'Code.gs'), du, '2026-11-17T09:00:00+07:00');

/* Sheet đơn giả: nhiều kênh, có đơn lẻ không deadline (hạn ngầm theo ngày đặt), đơn trễ, trễ > 30 ngày, hàng đã qua một phần bộ phận */
const H = ['', 'Loại hàng cần sản xuất', 'Loại Phôi', 'Số lượng đặt', 'SX CÒN THIẾU', 'Deadline', 'CHÚ THÍCH CÁC BỘ PHẬN', 'Phôi của Phố', 'Sơn của Khoa', 'UV', 'Hoàn thiện', 'Làm đầu', 'TỔNG SP CÓ THỂ GIAO'];
const TEN = ['GAY NOVA X1 MAU DO', 'NGON RHINO 12.4', 'GAY PHA RHINO BREAK', 'CHUOI CARBON EVO', 'GAY NHAY JUMP 3 KHUC', 'NGON CARBON 11.8 MAU DEN', 'GAY 1 KHUC POOL 147'];
let hat = 7; const rnd = m => { hat = (hat * 1103515245 + 12345) % 2147483648; return Math.floor(hat / 2147483648 * m); };
const tab = (ten, so, kieu) => { const r = [H]; for (let i = 0; i < so; i++) {
  const sl = kieu === 'le' ? 1 + rnd(2) : 5 + rnd(120), qua = rnd(3) ? 0 : Math.floor(sl * rnd(80) / 100), thieu = Math.max(1, sl - Math.floor(qua / 2));
  const ngay = 1 + rnd(16), thang = rnd(4) ? 11 : 10, dl = kieu === 'le' && rnd(2) ? '' : (rnd(6) === 0 ? '05/10' : (10 + rnd(18)) + '/' + (rnd(3) ? 12 : 11));
  r.push(['#' + ten.slice(0, 3).replace(/\W/g, 'X') + i + '-' + ('0' + ngay).slice(-2) + '/' + thang, TEN[rnd(TEN.length)], '', sl, thieu, dl, '', qua || '', qua ? Math.floor(qua / 2) : '', '', '', '', '']); }
  return r; };
const TABS = { DEALER: tab('DEALER', 14), KHO: tab('KHO', 16), 'WEB LẺ ĐƠN THƯỜNG': tab('WEB', 18, 'le'), 'WEB LẺ CUSTOM': tab('CUS', 8, 'le'), OEM: tab('OEM', 12), 'A ĐÔNG': tab('ADO', 6), 'POD-A.BÁCH': tab('POD', 9, 'le') };
TABS.OEM.push(['#OEM-HUY-01/11', 'GAY NOVA X1 MAU DO', '', 40, 40, '20/12', '', '', '', '', '', '', '']);   // sẽ hủy
TABS['ĐẾN HẠN 10 NGÀY'] = [['KÊNH', 'MÃ ĐƠN', 'LOẠI HÀNG CẦN SẢN XUẤT', 'SL ĐẶT', 'CÒN THIẾU', 'HẠN DÙNG', 'CÒN (NGÀY)', 'DEADLINE', 'HẠN MỚI HT ĐƠN CŨ', 'MÃ DÒNG WEB']];
c.__ngoai = { [c.DH_SHEET_ID]: { ten: 'x', sheets: TABS } };
const TK = () => c.doc_('TaiKhoan').filter(t => t.TrangThai === 'Đang dùng'), ma = m => TK().find(t => String(t.MaNV).trim().toUpperCase() === m);
const P = t => t && c.__phienDai(t);
const own = P(TK().find(t => String(t.VaiTro).trim() === 'OWNER')), gd = P(ma('C019')), c067 = P(ma('C067')), c077 = P(ma('C077'));
const tp = P(TK().find(t => /TP|PP/.test(t.VaiTro) && String(t.MaXuong) === 'SON'));
let r, x;

/* Hàm mô phỏng THẬT của web (quy-trinh-web.html) – lấy nguyên văn, chạy trên dữ liệu layDonHangXuong trả về */
function webMoPhong(DHd, hn, them) {
  const src = fs.readFileSync(path.join(__dirname, 'quy-trinh', 'quy-trinh-web.html'), 'utf8');
  const lay = ten => { const i = src.indexOf('\nfunction ' + ten + '('); if (i < 0) throw new Error('không thấy ' + ten); let j = src.indexOf('{', i), d = 0, q = null;
    for (; j < src.length; j++) { const ch = src[j]; if (q) { if (ch === '\\') { j++; continue; } if (ch === q) q = null; continue; } if (ch === "'" || ch === '"') { q = ch; continue; } if (ch === '{') d++; else if (ch === '}' && --d === 0) break; }
    return src.slice(i + 1, j + 1); };
  const bien = src.split('\n').filter(s => /^var (DH_TAB_BAC1|DH_LE_TAB|DH_HAN_LE|DH_LAN_MIN|DH_SIM_C|DH_CS_DON)\b/.test(s)).join('\n');
  const ham = ['dhCachNgay', 'dhCS', 'dhNgayCong', 'dhLaNgayLam', 'dhSoNgayLam', 'dhNgayLamThu', 'dhLaSX', 'dhGomDon', 'dhTenChuan', 'dhUuTen', 'dhLaUu', 'dhTreTen', 'dhBacDong', 'dhBac',
    'dhHanLeN', 'dhCongNgayLam', 'dhLanLe', 'dhLaLe', 'dhLan1', 'dhDlNgam', 'dhQua30', 'dhLa1K', 'dhBRoute', 'dhK2', 'dhKs', 'dhSimDong', 'dhMoPhong', 'dhCSDon'].map(lay).join('\n');
  const ctx = { DH: DHd, DHHT: null, HN: hn, them, kq: null }; vm.createContext(ctx);
  vm.runInContext(bien + '\n' + ham + '\nfunction dhHomNay(){ return HN; }\nkq = dhMoPhong(dhCSDon(), them);', ctx);
  const m = {}; ctx.kq.forEach(g => { m[g.ma + '|' + g.tab] = g.eta; }); return m;
}

console.log('\n1. Ngày dự kiến: máy chủ = đúng mô phỏng của bảng đơn');
r = c.__goi('huyBotDon', own, { loai: 'HUY_DON', tab: 'OEM', dong: TABS.OEM.length, ten: 'GAY NOVA X1 MAU DO', maDon: '#OEM-HUY-01/11', lyDo: 'Khách hủy cả đơn' });
ok(r.ok, 'hủy 1 đơn OEM (mã hủy không được tính vào mô phỏng)', r);
const DHd = c.__goi('layDonHangXuong', own, true); ok(DHd.ok && DHd.don.length > 70, 'bảng đơn đọc ' + (DHd.don || []).length + ' dòng', DHd.msg);
const hn = c.homNayVN_(), web = webMoPhong(DHd, hn, null);
const cs = c.dhCongSuat_(), R = c.dbkMoPhong_(c.dbkGiau_(c.dhDocDon_(false)), null, cs);
const k = Object.keys(web), lech = k.filter(z => (R.m[z] || {}).eta !== web[z]);
ok(k.length > 50 && !lech.length && Object.keys(R.m).length === k.length, k.length + ' đơn: ngày xong máy chủ trùng web 100%', lech.slice(0, 5).map(z => [z, web[z], R.m[z]]));
ok(!R.m['#OEM-HUY-01/11|OEM'], 'đơn đã hủy không có trong mô phỏng');
ok(k.some(z => !web[z]), 'có đơn trễ > 30 ngày không xếp lịch (chờ đặt hạn mới) – cả 2 bên giống nhau', k.filter(z => !web[z]).length);
const thu = { ma: '(thử) X', tab: 'OEM', thieu: 250, dl: '2026-12-20', dong: [] };
const web2 = webMoPhong(DHd, hn, thu), R2 = c.dbkMoPhong_(c.dbkGiau_(c.dhDocDon_(false)), { ma: '(thử) X', tab: 'OEM', thieu: 250, dl: '2026-12-20', bac: 4 }, cs);
ok(web2['(thử) X|OEM'] && R2.m['(thử) X|OEM'].eta === web2['(thử) X|OEM'], 'đơn thử 250 sp (như "Thử nhận đơn"): ngày xong trùng web ' + web2['(thử) X|OEM'], [web2['(thử) X|OEM'], R2.m['(thử) X|OEM']]);
ok(R.cong2('2026-11-21') === '2026-11-25', '+2 ngày làm việc bỏ qua chủ nhật 22/11 + ngày nghỉ 24/11 (Ngày Văn hóa VN): 21/11 → 25/11', R.cong2('2026-11-21'));
ok(R.cong2('2026-11-20') === '2026-11-23', '20/11 → 23/11 (bỏ chủ nhật 22, không có ngày lễ chen)', R.cong2('2026-11-20'));

console.log('\n2. Bán hàng thấy ngày dự kiến (đã cộng 2 ngày làm)');
const shTK = c.ss_().getSheetByName('TaiKhoan'); r = c.__goi('taoTaiKhoanBH', own, { ds: c.__goi('dsUngVienBH', own).ds.filter(u => u.goiY).slice(0, 2).map(u => u.maNV) });
const iD2 = shTK.rows[0].indexOf('DoiMatKhauLanDau'), iV2 = shTK.rows[0].indexOf('VaiTro'); shTK.rows.forEach((row, i) => { if (i && row[iV2] === 'BH') row[iD2] = 'Không'; }); c.xoaCache_('TaiKhoan');
const bhTK = TK().filter(t => t.VaiTro === 'BH'), B1 = P(bhTK[0]), B2 = P(bhTK[1]);
r = c.__goi('luuDonBan', B1, { maDon: '#BH9-17/11', tab: 'OEM', dl: '2026-12-15', dong: [{ ten: 'GAY NOVA X1 MAU DO', sl: 30 }, { ten: 'NGON RHINO 12.4', sl: 20 }], lenh: 'dk0000001' });
ok(r.ok, 'BH gửi đơn 50 sp', r);
r = c.__goi('layDonBan', B1); x = r.ds[0];
ok(x && x.tt === 'CHO_DUYET' && /^\d{4}-\d\d-\d\d$/.test(x.duKien || ''), 'đơn chờ duyệt có "nếu duyệt hôm nay: dự kiến xong ~' + (x && x.duKien) + '"', x);
const Rt = c.dbkMoPhong_(c.dbkGiau_(c.dhDocDon_(false)), { ma: '(thử) #BH9-17/11', tab: 'OEM', thieu: 50, dl: '2026-12-15', bac: 4 }, cs);
ok(x && x.duKien === Rt.cong2(Rt.m['(thử) #BH9-17/11|OEM'].eta), 'ngày đó = mô phỏng + 2 ngày làm', [x && x.duKien, Rt.m['(thử) #BH9-17/11|OEM']]);
r = c.__goi('duyetDonBan', gd, { id: x.id, pb: x.pb, hanh: 'DUYET', dl: '2026-12-15', lenh: 'dk0000002' }); ok(r.ok, 'Giám đốc duyệt', r);
r = c.__goi('layDonBan', B1); x = r.ds[0];
const sau = webMoPhong(c.__goi('layDonHangXuong', own, true), hn, null)['#BH9-17/11|OEM'];
ok(x.tt === 'DA_DUYET' && x.td && x.td.eta && x.td.eta === R.cong2(sau), 'đơn đang sản xuất: dự kiến xong ' + (x.td && x.td.eta) + ' = ngày bảng đơn tính (' + sau + ') + 2 ngày làm', [x.td, sau]);
ok(x.td.eta > sau, 'luôn muộn hơn ngày bảng đơn hiện cho sản xuất (dự phòng)');

console.log('\n3. Bảng đơn nhà máy (4 cột)');
r = c.__goi('layBangDonNhaMay', B2);
ok(r.ok && r.ds.length > 50 && r.ds.every(d => d.length === 5), 'Bán hàng khác cũng xem được – mỗi dòng chỉ [kênh, mã đơn, mã SP, số đặt, deadline] (' + (r.ds || []).length + ' dòng)', r.msg || (r.ds || [])[0]);
ok(!JSON.stringify(r).match(/thieu|qua"|nguoiDat|ghiChu|uuTien/), 'không lộ còn thiếu / tiến độ bộ phận / ghi chú / người đặt');
ok(!r.ds.some(d => d[1] === '#OEM-HUY-01/11'), 'không có mã đã hủy');
ok(r.ds.some(d => d[1] === '#BH9-17/11' && d[3] === 30), 'có đơn vừa duyệt');
const thuTab = r.ds.map(d => c.DH_TABS.indexOf(d[0])); ok(thuTab.every((v, i) => !i || v >= thuTab[i - 1]), 'xếp theo kênh như Sheet (Dealer → Kho → Web lẻ … → POD)');
ok(!c.__goi('layBangDonNhaMay', tp).ok && !c.__goi('layBangDonNhaMay', c077).ok, 'TP Sơn / C077 không gọi được (chỉ Bán hàng + người duyệt)');
ok(c.__goi('layBangDonNhaMay', gd).ok, 'người duyệt xem được');

console.log('\n4. Người khác đang xem đơn');
r = c.__goi('luuDonBan', B2, { maDon: '#BH8-17/11', tab: 'KHO', dong: [{ ten: 'NGON RHINO 12.4', sl: 5 }], lenh: 'dk0000003' }); const id8 = r.id;
r = c.__goi('dbDangXem', gd, [id8]); ok(r.ok && !r.xem[id8], 'Giám đốc mở thẻ: chưa ai khác xem');
r = c.__goi('dbDangXem', c067, [id8, 'xx', '<b>']); ok(r.ok && r.xem[id8] && r.xem[id8].length === 1 && Object.keys(r.xem).length === 1, 'chị Kim Loan mở cùng thẻ → thấy "' + (r.xem[id8] || []).join() + ' đang xem" (mã lạ bị bỏ)', r);
r = c.__goi('dbDangXem', gd, [id8]); ok(r.xem[id8] && r.xem[id8].length === 1, 'Giám đốc cũng thấy chị Kim Loan');
ok(!c.__goi('dbDangXem', B1, [id8]).ok && !c.__goi('dbDangXem', c077, [id8]).ok, 'Bán hàng / C077 không gọi được');

console.log('\n5. Giai đoạn 2 – khóa cột Sheet đơn');
const ssDH = () => c.SpreadsheetApp.openById(c.DH_SHEET_ID), prs = () => ssDH().getSheets().reduce((a, s) => a.concat(s.getProtections('RANGE').map(p => Object.assign({ tab: s.getName() }, p))), []);
ok(!c.__goi('datKhoaSheetDon', gd, { muc: 'CANH_BAO' }).ok, 'Giám đốc không bật được (chỉ chủ sở hữu)');
r = c.__goi('datKhoaSheetDon', own, { muc: 'CANH_BAO' });
let p0 = prs();
ok(r.ok && p0.length === 7 * 4 + 2 && p0.every(p => p.canhBao && /^KPI web – /.test(p.mo)), r.msg + ' (7 tab × 4 cột + 2 cột tab 10 ngày, đều là CẢNH BÁO)', [r, p0.length]);
const pOEM = p0.filter(p => p.tab === 'OEM').map(p => p.c).sort((a, b) => a - b); ok(pOEM.join() === '1,2,4,6', 'tab OEM khóa cột A (mã đơn), B (tên), D (SL), F (deadline) – không khóa cột bộ phận', pOEM);
ok(p0.filter(p => p.tab === 'OEM').every(p => p.r === 2 && p.r + p.nr - 1 >= 1000), 'khóa từ dòng dưới tiêu đề tới hết bảng (đơn mới vẫn bị khóa)');
r = c.__goi('datKhoaSheetDon', own, { muc: 'CANH_BAO' }); ok(prs().length === 30, 'bấm lại không tạo khóa trùng');
const ev = (tab, row, col, cu, moi, nr, nc) => { const sh = ssDH().getSheetByName(tab); return { triggerUid: 'T10', range: sh.getRange(row, col, nr || 1, nc || 1), oldValue: cu, value: moi, user: { getEmail: () => '' } }; };
c.__trigger = [{ id: 'T10', ham: 'DH_TAB10_SUA' }];
c.DH_TAB10_SUA(ev('OEM', 3, 4, '50', '60'));
c.DH_TAB10_SUA(ev('OEM', 3, 8, '', '5'));        // cột Phôi – không khóa
c.DH_TAB10_SUA(ev('KHO', 1, 4, 'Số lượng đặt', 'SL'));   // dòng tiêu đề
c.DH_TAB10_SUA(ev('DEALER', 4, 1, null, null, 3, 6));   // dán 3 dòng × 6 cột
r = c.__goi('layKhoaSheetDon', gd);
ok(r.ok && r.nSua === 2 && r.sua[1].o === 'D3' && r.sua[1].cu === '50' && r.sua[1].moi === '60' && r.sua[1].ai === 'không rõ' && /Số lượng đặt/.test(r.sua[1].cot), 'sửa SL ô D3 ghi nhật ký (50 → 60, người sửa "không rõ" vì Google không cho biết email)', r.sua);
ok(r.sua[0].o === 'A4:F6' && r.sua[0].soO === 18 && /dán/.test(r.sua[0].moi), 'dán nhiều ô: ghi phạm vi A4:F6, 18 ô');
ok(r.tt.muc === 'CANH_BAO' && r.tt.ngay === 0 && !r.tt.hetCB, 'trạng thái: cảnh báo, 0 ngày');
ok(!c.__goi('layKhoaSheetDon', B1).ok && !c.__goi('layKhoaSheetDon', tp).ok, 'Bán hàng / TP không xem nhật ký');
c.DH_TAB10_SUA({ range: { getA1Notation: 'x' } }); ok(c.__goi('layKhoaSheetDon', gd).nSua === 2, 'sự kiện giả (không phải trigger thật) bị bỏ qua');
/* sau 14 ngày: nhắc chủ sở hữu */
const st = JSON.parse(c.PropertiesService.getScriptProperties().getProperty('DH_KHOA')); st.tu = '2026-11-01 08:00:00'; c.PropertiesService.getScriptProperties().setProperty('DH_KHOA', JSON.stringify(st));
r = c.__goi('demDonBanCho', own); ok(r.khoa && r.khoa.hetCB === 1 && r.khoa.ngay === 16, 'sau 16 ngày cảnh báo: Việc hôm nay nhắc chủ sở hữu khóa hẳn', r.khoa);
ok(!c.__goi('demDonBanCho', gd).khoa, 'người duyệt khác không nhận nhắc này');
/* tự rà: ai đó gỡ khóa ở tab KHO -> đặt lại */
const shK = ssDH().getSheetByName('KHO'); shK.getProtections('RANGE').forEach(p => p.remove()); ok(prs().length === 26, 'giả lập: có người gỡ 4 khóa tab KHO');
st.ra = 0; st.tu = '2026-11-01 08:00:00'; c.PropertiesService.getScriptProperties().setProperty('DH_KHOA', JSON.stringify(st)); c.dhkRa_();
ok(prs().length === 30, 'lượt rà 6 giờ: đặt lại khóa tab KHO');
const sk = c.dhhDoc_(c.dhhSS_(false), 'SuKien').filter(z => z.ThaoTac === 'KHOA_SHEET_DAT_LAI'); ok(sk.length === 1 && /KHO/.test(sk[0].ChiTiet), 'ghi sổ "khóa bị gỡ – đặt lại"', sk);
ok(JSON.parse(c.PropertiesService.getScriptProperties().getProperty('DH_KHOA')).tu === '2026-11-01 08:00:00', 'giữ ngày bắt đầu cảnh báo');
/* khóa hẳn */
r = c.__goi('datKhoaSheetDon', own, { muc: 'KHOA' }); p0 = prs();
ok(r.ok && p0.length === 30 && p0.every(p => !p.canhBao && p.editors.join() === 'chu@vidu.com' && !p.mien), r.msg + ' – chỉ tài khoản chạy web sửa được', p0[0]);
r = c.__goi('luuBangDon', own, { ds: [{ tab: 'OEM', dong: 3, ten: TABS.OEM[2][1], sl: { moi: 77, cu: TABS.OEM[2][3] } }] });
ok(r.ok && ssDH().getSheetByName('OEM').getRange(3, 4).getValue() === 77, 'web vẫn sửa SL được khi đã khóa (tài khoản chạy web)', r);
r = c.__goi('datKhoaSheetDon', own, { muc: '' }); ok(r.ok && prs().length === 0 && c.__goi('layKhoaSheetDon', gd).tt.muc === '', 'gỡ khóa: xóa hết khóa của web', r);

console.log('\n' + (l ? '✗ ' + l + ' / ' + n + ' lỗi' : '✓ Đạt ' + n + ' / ' + n));
process.exit(l ? 1 : 0);
