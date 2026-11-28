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
['GAY NOVA X1 MAU DO', 'NGON RHINO 12.4', 'CHUOI CARBON EVO'].forEach((ten, i) => TABS.KHO.push(['#KHO-DUNG-02/11', ten, '', 60, i === 2 ? 0 : 60, '30/11', '', '', '', '', '', '', '']));   // 17/11: đơn sẽ tạm dừng cả đơn (mã thứ 3 đã xong)
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
  const bien = src.split('\n').filter(s => /^var (DH_TAB_BAC1|DH_LE_TAB|DH_HAN_LE|DH_LAN_MIN|DH_SIM_C|DH_CS_DON|DH_LAN5|DH_LAN_DU|DH_LAN_KENH)\b/.test(s)).join('\n');
  const ham = ['dhCachNgay', 'dhCS', 'dhNgayCong', 'dhLaNgayLam', 'dhSoNgayLam', 'dhNgayLamThu', 'dhLaSX', 'dhGomDon', 'dhTenChuan', 'dhUuTen', 'dhLaUu', 'dhTreTen', 'dhBacDong', 'dhBac',
    'dhHanLeN', 'dhCongNgayLam', 'dhLanLe', 'dhLaLe', 'dhLan1', 'dhDlNgam', 'dhQua30', 'dhLa1K', 'dhBRoute', 'dhK2', 'dhKs', 'dhSimDong', 'dhMoPhong', 'dhCSDon', 'dhLanSo', 'dhLanNap', 'dhTabK'].map(lay).join('\n');
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
const web2 = webMoPhong(DHd, hn, thu), R2 = c.dbkMoPhong_(c.dbkGiau_(c.dhDocDon_(false)), { ma: '(thử) X', tab: 'OEM', thieu: 250, dl: '2026-12-20', bac: 2 }, cs);
ok(web2['(thử) X|OEM'] && R2.m['(thử) X|OEM'].eta === web2['(thử) X|OEM'], 'đơn thử 250 sp (như "Thử nhận đơn"): ngày xong trùng web ' + web2['(thử) X|OEM'], [web2['(thử) X|OEM'], R2.m['(thử) X|OEM']]);
ok(R.cong2('2026-11-21') === '2026-11-25', '+2 ngày làm việc bỏ qua chủ nhật 22/11 + ngày nghỉ 24/11 (Ngày Văn hóa VN): 21/11 → 25/11', R.cong2('2026-11-21'));
ok(R.cong2('2026-11-20') === '2026-11-23', '20/11 → 23/11 (bỏ chủ nhật 22, không có ngày lễ chen)', R.cong2('2026-11-20'));

/* 17/11 tối (chủ dự án): thứ tự bậc làn chính: Dealer (kể cả trễ) → trễ hạn + ★ + hàng ưu tiên → còn lại */
{ const src = fs.readFileSync(path.join(__dirname, 'quy-trinh', 'quy-trinh-web.html'), 'utf8'), i0 = src.indexOf('\nfunction dhBacDong('), j0 = src.indexOf('\n}', i0);
  const ctx = { HN: '2026-11-17' }; vm.createContext(ctx);
  vm.runInContext("var DH_TAB_BAC1={'WEB LẺ CUSTOM':1,'WEB LẺ ĐƠN THƯỜNG':1}; function dhHomNay(){return HN} function dhTenChuan(s){return String(s||'').toUpperCase().trim()} function dhLaUu(o,m){ return o.tab==='KHO'&&!!m[dhTenChuan(o.maDon)+'|'+dhTenChuan(o.ten)] }" + src.slice(i0, j0 + 2), ctx);
  const b = (o, mu, mtr) => ctx.dhBacDong(o, mu || {}, mtr || {});
  const kq = [b({ tab: 'DEALER', dl: '2026-12-30' }), b({ tab: 'DEALER', dl: '2026-11-01' }), b({ tab: 'OEM', dl: '2026-11-01' }), b({ tab: 'KHO', uuWeb: { ai: 'x' } }), b({ tab: 'KHO', maDon: '#K1', ten: 'A' }, { '#K1|A': 1 }), b({ tab: 'OEM', dl: '2026-12-30' }), b({ tab: 'POD-X' })];
  ok(kq.join() === '2,1,1,1,1,2,2', '17/11 tối: ưu tiên TRONG LÀN – trễ hạn / ★ / hàng ưu tiên = 1, còn lại = 2', kq);
  vm.runInContext(src.match(/\nvar DH_LAN5=[^\n]*/)[0] + '\nvar DH_LAN_KENH={};function dhTabK(t){ return t===\'ĐƠN ƯU TIÊN\'?\'KHO\':t; }\n' + src.slice(src.indexOf('\nfunction dhLanSo('), src.indexOf('\n', src.indexOf('\nfunction dhLanSo(') + 1)), ctx);
  const ls = ['WEB LẺ CUSTOM', 'POD-A.BÁCH', 'DEALER', 'KHO', 'OEM', 'A ĐÔNG', 'TAB MỚI'].map(x => ctx.dhLanSo(x));
  ok(ls.join() === '1,1,2,3,4,5,3' && ctx.DH_LAN5.map(x => x[2]).join() === '0.1,0.2,0.5,0.05,0.15', '5 làn: Lẻ + POD 10% · Dealer 20% · Kho 50% · OEM 5% · A Đông 15%; tab mới tạm vào làn Kho', ls);
  const DHx = c.__goi('layDonHangXuong', own, true), wx = webMoPhong(DHx, hn, null), Rx = c.dbkMoPhong_(c.dbkGiau_(c.dhDocDon_(false)), null, cs);
  const dea = Object.keys(wx).filter(z => /\|DEALER$/.test(z) && wx[z]).map(z => wx[z]).sort(), treKhac = DHx.don.filter(o => o.tab === 'OEM' && o.thieu > 0 && o.dl && o.dl < hn && o.dl >= '2026-10-18').map(o => wx[(o.maDon || '(không mã)') + '|OEM']).filter(Boolean).sort();
  ok(dea.length && Object.keys(wx).every(z => (Rx.m[z] || {}).eta === wx[z]), 'máy chủ vẫn trùng web 100% với thứ tự mới');
  /* làn riêng: Dealer không phải chờ Kho – tăng Kho thêm rất nhiều không làm Dealer muộn đi */
  const dea2 = Object.keys(wx).filter(z => /\|DEALER$/.test(z) && wx[z]).sort((a, b) => wx[b].localeCompare(wx[a]))[0];
  const Rk = c.dbkMoPhong_(c.dbkGiau_(c.dhDocDon_(false)), { ma: '(thử) KHO 5000', tab: 'KHO', thieu: 5000, dl: '2026-11-20', bac: 1 }, cs);
  const canDea = DHx.don.filter(o => o.tab === 'DEALER' && o.thieu > 0 && !o.dung && !(o.dl && (Date.parse(hn) - Date.parse(o.dl)) / 864e5 > 30)).reduce((a, o) => a + o.thieu, 0), soNgay = Math.ceil(canDea / (cs.sp * 0.20));
  let hanToi = hn, dem = 0; while (dem < soNgay) { hanToi = new Date(Date.parse(hanToi + 'T00:00:00Z') + 864e5).toISOString().slice(0, 10); if (new Date(hanToi + 'T00:00:00Z').getUTCDay() !== 0 && hanToi !== '2026-11-24') dem++; }
  ok(dea2 && Rk.m[dea2].eta <= hanToi, 'thêm đơn Kho 5.000 sp trễ: Dealer vẫn có làn riêng 20% – xong chậm nhất ' + hanToi + ' (' + canDea + ' sp ÷ ' + (cs.sp * 0.2) + ' sp/ngày), thực tế ' + Rk.m[dea2].eta, [wx[dea2], Rk.m[dea2], hanToi]); }

console.log('\n2. Bán hàng thấy ngày dự kiến (đã cộng 2 ngày làm)');
const shTK = c.ss_().getSheetByName('TaiKhoan'); r = c.__goi('taoTaiKhoanBH', own, { ds: c.__goi('dsUngVienBH', own).ds.filter(u => u.goiY).slice(0, 2).map(u => u.maNV) });
const iD2 = shTK.rows[0].indexOf('DoiMatKhauLanDau'), iV2 = shTK.rows[0].indexOf('VaiTro'); shTK.rows.forEach((row, i) => { if (i && row[iV2] === 'BH') row[iD2] = 'Không'; }); c.xoaCache_('TaiKhoan');
const bhTK = TK().filter(t => t.VaiTro === 'BH'), B1 = P(bhTK[0]), B2 = P(bhTK[1]);
r = c.__goi('luuDonBan', B1, { maDon: '#BH9-17/11', tab: 'OEM', dl: '2026-12-15', dong: [{ ten: 'GAY NOVA X1 MAU DO', sl: 30 }, { ten: 'NGON RHINO 12.4', sl: 20 }], lenh: 'dk0000001' });
ok(r.ok, 'BH gửi đơn 50 sp', r);
r = c.__goi('layDonBan', B1); x = r.ds[0];
ok(x && x.tt === 'CHO_DUYET' && /^\d{4}-\d\d-\d\d$/.test(x.duKien || ''), 'đơn chờ duyệt có "nếu duyệt hôm nay: dự kiến xong ~' + (x && x.duKien) + '"', x);
const Rt = c.dbkMoPhong_(c.dbkGiau_(c.dhDocDon_(false)), { ma: '(thử) #BH9-17/11', tab: 'OEM', thieu: 50, dl: '2026-12-15', bac: 2 }, cs);
ok(x && x.duKien === Rt.cong2(Rt.m['(thử) #BH9-17/11|OEM'].eta), 'ngày đó = mô phỏng + 2 ngày làm', [x && x.duKien, Rt.m['(thử) #BH9-17/11|OEM']]);
r = c.__goi('duyetDonBan', gd, { id: x.id, pb: x.pb, hanh: 'DUYET', dl: '2026-12-15', lenh: 'dk0000002' }); ok(r.ok, 'Giám đốc duyệt', r);
r = c.__goi('layDonBan', B1); x = r.ds[0];
const sau = webMoPhong(c.__goi('layDonHangXuong', own, true), hn, null)['#BH9-17/11|OEM'];
ok(x.tt === 'DA_DUYET' && x.td && x.td.eta && x.td.eta === R.cong2(sau), 'đơn đang sản xuất: dự kiến xong ' + (x.td && x.td.eta) + ' = ngày bảng đơn tính (' + sau + ') + 2 ngày làm', [x.td, sau]);
ok(x.td.eta > sau, 'luôn muộn hơn ngày bảng đơn hiện cho sản xuất (dự phòng)');

console.log('\n3. Bảng đơn nhà máy (4 cột)');
r = c.__goi('layBangDonNhaMay', B2);
ok(r.ok && r.ds.length > 50 && r.ds.every(d => d.length === 14 && (d[5] === 0 || d[5] === 1) && (d[6] === '' || /^\d{4}-/.test(d[6]))), 'Bán hàng khác cũng xem được – mỗi dòng chỉ [kênh, mã đơn, mã SP, số đặt, deadline, cờ tạm dừng, hạn riêng (21/11), còn thiếu (22/11)] (' + (r.ds || []).length + ' dòng)', r.msg || (r.ds || [])[0]);
ok(r.ds.every(d => d.length === 14 && (d[5] === 0 || d[5] === 1)) && !JSON.stringify(r).match(/qua"|nguoiDat|ghiChu|uuTien|dong"/), 'từng dòng không lộ tiến độ bộ phận / ghi chú / người đặt (22/11: chủ dự án cho Bán hàng xem Đặt / Thiếu / Giao)');
ok(!r.ds.some(d => d[1] === '#OEM-HUY-01/11'), 'không có mã đã hủy');
ok(r.ds.some(d => d[1] === '#BH9-17/11' && d[3] === 30), 'có đơn vừa duyệt');
const thuTab = r.ds.map(d => c.DH_TABS.indexOf(d[0])); ok(thuTab.every((v, i) => !i || v >= thuTab[i - 1]), 'xếp theo kênh như Sheet (Dealer → Kho → Web lẻ … → POD)');
ok(c.__goi('layBangDonNhaMay', tp).ok && !c.__goi('layBangDonNhaMay', c077).ok, '23/11: TP Sơn XEM được (Order-Flow mở cho TP/PP); C077 (không duyệt) vẫn không');
ok(c.__goi('layBangDonNhaMay', gd).ok, 'người duyệt xem được');
/* 17/11: thống kê theo kênh + kín lịch */
r = c.__goi('layBangDonNhaMay', B2); const tk = r.tk || [], tong = tk[tk.length - 1] || {};
const w3 = webMoPhong(c.__goi('layDonHangXuong', own, true), hn, null), maxTab = {}; let maxAll = '';
Object.keys(w3).forEach(z => { const e = w3[z], t = z.split('|').pop(); if (!e) return; if (e > (maxTab[t] || '')) maxTab[t] = e; if (e > maxAll) maxAll = e; });
ok(tk.length >= 7 && tong.tab === '' && tong.sl === r.ds.filter(d => d[7] > 0).reduce((a, d) => a + d[3], 0), 'có ' + (tk.length - 1) + ' kênh + dòng tổng; tổng SL đặt = tổng các mã còn thiếu trong bảng (' + tong.sl + ')', tk);
ok(tong.xong === R.congN(maxAll, 6) && tong.xong > maxAll, 'nhà máy kín lịch đến ' + tong.xong + ' = ngày xong đơn cuối cùng trên bảng đơn (' + maxAll + ') + 6 ngày làm việc (~1 tuần)', [tong.xong, maxAll]);
ok(tk.slice(0, -1).every(z => !maxTab[z.tab] ? !z.xong : z.xong === R.congN(maxTab[z.tab], 6)), 'mỗi kênh: xong hết = đơn xong muộn nhất của kênh + 6 ngày làm việc', tk.map(z => [z.tab, z.xong, maxTab[z.tab]]));
ok(tk.slice(0, -1).every(z => z.thieu <= z.sl && z.don > 0) && tong.thieu === tk.slice(0, -1).reduce((a, z) => a + z.thieu, 0), 'còn phải làm ≤ SL đặt; tổng = cộng các kênh');
const le = tk.find(z => z.tab === 'WEB LẺ ĐƠN THƯỜNG'); ok(le && le.xong && le.xong < tong.xong, 'kênh lẻ (làn riêng 10%) xong sớm hơn ngày kín lịch chung', le);

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
ok(r.ok && p0.length === 7 * 4 && p0.every(p => p.canhBao && /^KPI web – /.test(p.mo)), r.msg + ' (7 tab × 4 cột, đều là CẢNH BÁO; tab 10 ngày đã sang file riêng)', [r, p0.length]);
const pOEM = p0.filter(p => p.tab === 'OEM').map(p => p.c).sort((a, b) => a - b); ok(pOEM.join() === '1,2,4,6', 'tab OEM khóa cột A (mã đơn), B (tên), D (SL), F (deadline) – không khóa cột bộ phận', pOEM);
ok(p0.filter(p => p.tab === 'OEM').every(p => p.r === 2 && p.r + p.nr - 1 >= 1000), 'khóa từ dòng dưới tiêu đề tới hết bảng (đơn mới vẫn bị khóa)');
r = c.__goi('datKhoaSheetDon', own, { muc: 'CANH_BAO' }); ok(prs().length === 28, 'bấm lại không tạo khóa trùng');
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
const shK = ssDH().getSheetByName('KHO'); shK.getProtections('RANGE').forEach(p => p.remove()); ok(prs().length === 24, 'giả lập: có người gỡ 4 khóa tab KHO');
st.ra = 0; st.tu = '2026-11-01 08:00:00'; c.PropertiesService.getScriptProperties().setProperty('DH_KHOA', JSON.stringify(st)); c.dhkRa_();
ok(prs().length === 28, 'lượt rà 6 giờ: đặt lại khóa tab KHO');
const sk = c.dhhDoc_(c.dhhSS_(false), 'SuKien').filter(z => z.ThaoTac === 'KHOA_SHEET_DAT_LAI'); ok(sk.length === 1 && /KHO/.test(sk[0].ChiTiet), 'ghi sổ "khóa bị gỡ – đặt lại"', sk);
ok(JSON.parse(c.PropertiesService.getScriptProperties().getProperty('DH_KHOA')).tu === '2026-11-01 08:00:00', 'giữ ngày bắt đầu cảnh báo');
/* khóa hẳn */
r = c.__goi('datKhoaSheetDon', own, { muc: 'KHOA' }); p0 = prs();
ok(r.ok && p0.length === 28 && p0.every(p => !p.canhBao && p.editors.join() === 'chu@vidu.com' && !p.mien), r.msg + ' – chỉ tài khoản chạy web sửa được', p0[0]);
r = c.__goi('luuBangDon', own, { ds: [{ tab: 'OEM', dong: 3, ten: TABS.OEM[2][1], sl: { moi: 77, cu: TABS.OEM[2][3] } }] });
ok(r.ok && ssDH().getSheetByName('OEM').getRange(3, 4).getValue() === 77, 'web vẫn sửa SL được khi đã khóa (tài khoản chạy web)', r);
r = c.__goi('datKhoaSheetDon', own, { muc: '' }); ok(r.ok && prs().length === 0 && c.__goi('layKhoaSheetDon', gd).tt.muc === '', 'gỡ khóa: xóa hết khóa của web', r);

{
console.log('\n6. Tạm dừng sản xuất (17/11)');
const D0 = c.__goi('layDonHangXuong', own, true), dongK = D0.don.filter(o => o.maDon === '#KHO-DUNG-02/11'), o1 = dongK[0];
const truoc = webMoPhong(D0, hn, null), kinTruoc = c.__goi('layBangDonNhaMay', gd).tk.slice(-1)[0];
ok(dongK.length === 3 && truoc['#KHO-DUNG-02/11|KHO'], 'đơn #KHO-DUNG-02/11 có 3 mã, đang được xếp lịch ' + truoc['#KHO-DUNG-02/11|KHO']);
const DP = x => Object.assign({ loai: 'DUNG_DON', tab: 'KHO', dong: o1.dong, ten: o1.ten, maDon: o1.maDon, lyDo: 'Chờ khách thanh toán', lenh: 'dung00001' }, x);
ok(!c.__goi('huyBotDon', tp, DP()).ok && !c.__goi('huyBotDon', c077, DP()).ok, 'TP Sơn / C077 không tạm dừng được');
ok(!c.__goi('huyBotDon', gd, DP({ lyDo: 'abc', lenh: null })).ok, 'thiếu lý do → chặn');
ok(!c.__goi('huyBotDon', gd, DP({ hen: '2026-11-01', lenh: null })).ok, 'ngày chạy lại đã qua → chặn');
const dongXong = dongK.find(o => !(o.thieu > 0)); ok(!c.__goi('huyBotDon', gd, DP({ loai: 'DUNG', dong: dongXong.dong, ten: dongXong.ten, lenh: null })).ok, 'mã đã làm xong → không tạm dừng');
r = c.__goi('huyBotDon', gd, DP({ hen: '2026-11-25' }));
ok(r.ok && r.n === 2 && r.nhom && /bỏ qua 1/.test(r.msg), r.msg + ' (mã đã xong bỏ qua)', r);
const D1 = c.__goi('layDonHangXuong', own, true), dk = D1.don.filter(o => o.maDon === '#KHO-DUNG-02/11');
ok(dk.length === 3 && dk.filter(o => o.dung).length === 2 && dk.filter(o => o.dung).every(o => o.st === 'tamDung' && o.dung.ly === 'Chờ khách thanh toán' && o.dung.hen === '2026-11-25'), 'đơn VẪN hiện đủ 3 dòng; 2 dòng có cờ tạm dừng (lý do, hẹn 25/11), trạng thái "tamDung"', dk.map(o => [o.st, o.dung]));
const sau6 = webMoPhong(D1, hn, null), R6 = c.dbkMoPhong_(c.dbkGiau_(c.dhDocDon_(false)), null, cs);
ok(!sau6['#KHO-DUNG-02/11|KHO'] && !R6.m['#KHO-DUNG-02/11|KHO'], 'web + máy chủ: đơn tạm dừng ra khỏi mô phỏng công suất');
const k6 = Object.keys(sau6); ok(k6.every(z => (R6.m[z] || {}).eta === sau6[z]), 'ngày xong các đơn khác: máy chủ vẫn trùng web 100%');
ok(k6.some(z => truoc[z] && sau6[z] < truoc[z]) && k6.every(z => !truoc[z] || sau6[z] <= truoc[z]), 'các đơn khác xong SỚM hơn hoặc bằng (không đơn nào muộn đi)', k6.filter(z => sau6[z] < truoc[z]).length);
const shK = c.SpreadsheetApp.openById(c.DH_SHEET_ID).getSheetByName('KHO'), mauD = () => dongK.map(o => shK.getRange(o.dong, 1, 1, 3).getBackgrounds()[0][0]);
ok(mauD().join() === '#ffffff,#ffffff,#ffffff', '17/11 tối: Sheet đơn GIỮ NGUYÊN khi tạm dừng (không tô màu)', mauD());
const bt = c.__goi('layBangDonNhaMay', B1), tkK = bt.tk.find(z => z.tab === 'KHO'), tg = bt.tk.slice(-1)[0];
ok(bt.ds.filter(d => d[1] === '#KHO-DUNG-02/11' && d[7] > 0).every(d => d[5] === 1) && tkK.dung === 120 && tg.dung === 120 && tg.donDung === 1 && tg.thieu === kinTruoc.thieu - 120, 'Bảng đơn nhà máy: dòng có cờ tạm dừng; thống kê tách "tạm dừng 120 sp (1 đơn)", còn làm giảm 120', [tkK, tg.thieu, kinTruoc.thieu]);
ok(tg.xong <= kinTruoc.xong, 'ngày kín lịch không muộn đi (' + kinTruoc.xong + ' → ' + tg.xong + ')');
r = c.__goi('huyBotDon', gd, DP({ loai: 'DUNG', lenh: null })); ok(!r.ok && /đang tạm dừng/.test(r.msg), 'tạm dừng lại mã đang dừng → báo đang dừng', r);
r = c.__goi('huyBotDon', c067, { loai: 'BOT', tab: 'KHO', dong: o1.dong, ten: o1.ten, maDon: o1.maDon, slMoi: 40, lyDo: 'Khách giảm số' });
const o1b = c.__goi('layDonHangXuong', own, true).don.find(o => o.dong === o1.dong && o.tab === 'KHO');
ok(r.ok && o1b.sl === 40 && o1b.dung, 'bớt SL mã đang tạm dừng: vẫn giữ tạm dừng (2 lớp riêng)', [r.msg, o1b.sl, !!o1b.dung]);
/* nhắc */
r = c.__goi('demDonBanCho', gd); ok(r.dung && r.dung.tong === 2 && r.dung.den === 0, 'chưa đến ngày hẹn: chưa nhắc', r.dung);
const shH = c.dhhSS_(false).getSheetByName('DongHuy'), hH = shH.rows[0], iHen = hH.indexOf('Hen'), iLoai = hH.indexOf('Loai'), iLuc = hH.indexOf('Luc');
shH.rows.forEach((row, i) => { if (i && row[iLoai] === 'DUNG') row[iHen] = '2026-11-17'; }); c.dhhXoaCache_();
r = c.__goi('demDonBanCho', gd); ok(r.dung && r.dung.den === 1 && r.dung.ds[0].ma === '#KHO-DUNG-02/11', 'đến ngày hẹn chạy lại → Việc hôm nay nhắc 1 đơn', r.dung);
shH.rows.forEach((row, i) => { if (i && row[iLoai] === 'DUNG') { row[iHen] = ''; row[iLuc] = '2026-10-30 08:00:00'; } }); c.dhhXoaCache_();
r = c.__goi('demDonBanCho', c067); ok(r.dung && r.dung.den === 1 && r.dung.ds[0].ngay === 18, 'không ghi ngày hẹn, đã dừng 18 ngày (> 14) → nhắc', r.dung);
/* Bán hàng thấy */
r = c.__goi('luuDonBan', B1, { maDon: '#BH7-17/11', tab: 'OEM', dong: [{ ten: 'GAY NOVA X1 MAU DO', sl: 10 }], lenh: 'dk0000007' }); const id7 = r.id;
c.__goi('duyetDonBan', gd, { id: id7, hanh: 'DUYET', dl: '2026-12-20', lenh: 'dk0000008' });
const o7 = c.__goi('layDonHangXuong', own, true).don.find(o => o.maDon === '#BH7-17/11');
r = c.__goi('huyBotDon', gd, { loai: 'DUNG', tab: 'OEM', dong: o7.dong, ten: o7.ten, maDon: o7.maDon, lyDo: 'Khách tạm hoãn' }); ok(r.ok, 'tạm dừng đơn của Bán hàng', r);
x = c.__goi('layDonBan', B1).ds.find(z => z.id === id7);
ok(x.td.dung.length === 1 && x.td.dung[0].ly === 'Khách tạm hoãn' && !x.td.eta, 'Bán hàng thấy mã tạm dừng + lý do, không có ngày dự kiến', x.td);
/* chạy lại */
r = c.__goi('hoanTacHuyDon', gd, { nhom: dk.find(o => o.dung).dung.nhom, lyDo: 'Chạy lại sản xuất' });
const D2 = c.__goi('layDonHangXuong', own, true);
ok(r.ok && r.chay === 1 && /Đã chạy lại/.test(r.msg) && D2.don.filter(o => o.maDon === '#KHO-DUNG-02/11').every(o => !o.dung) && webMoPhong(D2, hn, null)['#KHO-DUNG-02/11|KHO'], r.msg + ' → vào lại mô phỏng', r);
ok(mauD().join() === '#ffffff,#ffffff,#ffffff', 'chạy lại: Sheet vẫn nguyên', mauD());
ok(c.__goi('layDonHangXuong', own, true).don.find(o => o.dong === o1.dong && o.tab === 'KHO').sl === 40, 'bớt SL vẫn còn sau khi chạy lại');

}
console.log('\n9. Hạn riêng từng mã (21/11)');
{ const D0 = c.__goi('layDonHangXuong', own, true), hn9 = c.homNayVN_();
  // chọn 1 dòng KHO còn thiếu, deadline xa nhất (để hạn riêng có tác dụng rõ)
  const o9 = D0.don.filter(o => o.tab === 'KHO' && o.thieu > 0 && o.dl > '2026-12-01' && !o.dung && o.maDon).sort((a, b) => b.dl < a.dl ? -1 : 1)[0];
  const k9 = o9.maDon + '|KHO', cs9 = c.dhCongSuat_(), truoc = c.dbkMoPhong_(c.dbkGiau_(c.dhDocDon_(false)), null, cs9), han9 = '2026-11-20';
  let r9 = c.__goi('luuHanRieng', tp, { maDon: o9.maDon, tab: 'KHO', ten: o9.ten, han: han9, ly: 'gấp' }); ok(!r9.ok, 'trưởng phòng không đặt được hạn riêng', r9);
  r9 = c.__goi('luuHanRieng', gd, { maDon: o9.maDon, tab: 'KHO', ten: o9.ten, han: han9, ly: '' }); ok(!r9.ok && /lý do/.test(r9.msg), 'bắt buộc lý do', r9);
  r9 = c.__goi('luuHanRieng', gd, { maDon: o9.maDon, tab: 'KHO', ten: o9.ten, han: o9.dl, ly: 'x' }); ok(!r9.ok && /SỚM hơn deadline/.test(r9.msg), 'không cho hạn riêng bằng / muộn hơn deadline dòng', r9);
  r9 = c.__goi('luuHanRieng', gd, { maDon: o9.maDon, tab: 'KHO', ten: o9.ten, han: '2026-11-01', ly: 'x' }); ok(!r9.ok, 'không cho hạn riêng trong quá khứ', r9);
  const shTruoc = JSON.stringify(c.__ngoai[c.DH_SHEET_ID].sheets.KHO);
  r9 = c.__goi('luuHanRieng', gd, { maDon: o9.maDon, tab: 'KHO', ten: o9.ten, han: han9, ly: 'Khách cần gấp mã này' });
  ok(r9.ok && r9.hanRieng && r9.hanRieng.han === han9 && /không đổi/.test(r9.msg), 'Giám đốc đặt hạn riêng ' + han9 + ' cho ' + o9.ten + ' (đơn ' + o9.maDon + ', deadline ' + o9.dl + ')', r9);
  const D1 = c.__goi('layDonHangXuong', own, true), o9b = D1.don.find(o => o.tab === 'KHO' && o.dong === o9.dong);
  ok(o9b.hanRieng && o9b.hanRieng.han === han9 && o9b.dl === o9.dl, 'bảng đơn có hạn riêng, deadline Sheet giữ nguyên ' + o9b.dl, o9b && [o9b.hanRieng, o9b.dl]);
  ok(JSON.stringify(c.__ngoai[c.DH_SHEET_ID].sheets.KHO) === shTruoc, 'không ghi gì vào Sheet đơn (tab KHO giữ nguyên)');
  const td9 = c.dbTienDo_(c.dhDocDon_(false), { Tab: 'KHO', MaDon: o9.maDon });
  ok(td9.hr && td9.hr.length === 1 && td9.hr[0].han === han9 && td9.hr[0].dl === o9.dl, 'thẻ đơn của Bán hàng có "nhà máy ưu tiên mã … – mục tiêu nội bộ, deadline khách vẫn …"', td9.hr);
  const sau = c.dbkMoPhong_(c.dbkGiau_(c.dhDocDon_(false)), null, cs9), w9 = webMoPhong(D1, hn9, null);
  const kk = Object.keys(w9), lech9 = kk.filter(z => (sau.m[z] || {}).eta !== w9[z]);
  ok(!lech9.length, 'có hạn riêng: ngày xong máy chủ vẫn trùng web 100% (' + kk.length + ' đơn)', lech9.slice(0, 4).map(z => [z, w9[z], sau.m[z]]));
  const doi = kk.filter(z => z !== k9 && (truoc.m[z] || {}).eta !== (sau.m[z] || {}).eta);
  ok(doi.length > 0, 'các đơn khác tự tính lại ngày dự kiến (' + doi.length + ' đơn đổi ngày)', doi.length);
  const vs = c.__goi('viSaoDonBH', own, { ma: o9.maDon, tab: 'KHO' });
  ok(vs.ok && JSON.stringify(vs).indexOf('hạn riêng') >= 0, '"Vì sao" ghi lý do bậc: ⏱ hạn riêng', vs.msg || (vs.rows || []).slice(0, 2));
  const B9 = c.__goi('layBangDonNhaMay', own), d9 = B9.ds.find(d => d[1] === o9.maDon && d[2] === o9.ten);
  ok(d9 && d9[6] === han9, 'Bảng đơn nhà máy (tab Đơn bán hàng) có cột hạn riêng', d9);
  r9 = c.__goi('luuHanRieng', gd, { maDon: o9.maDon, tab: 'KHO', ten: o9.ten, han: '' });
  ok(r9.ok && !c.__goi('layDonHangXuong', own, true).don.find(o => o.tab === 'KHO' && o.dong === o9.dong).hanRieng, 'bỏ hạn riêng', r9);
}

console.log('\n10. Thông báo đổi deadline cho Bán hàng (22/11)');
{ c.dhXoaCacheDon_ && c.dhXoaCacheDon_();
  let n0 = c.dthRa_(null, true); ok(n0 === 0, 'lần chạy đầu chỉ ghi mốc, không báo', n0);
  const sh = c.__ngoai[c.DH_SHEET_ID].sheets.KHO, iDl = sh[0].indexOf('Deadline');
  const iR = sh.findIndex((r, i) => i > 0 && Number(r[4]) > 0 && r[0] && String(r[iDl]).includes('/')), cuDl = sh[iR][iDl];
  sh[iR][iDl] = '28/12'; c.dhXoaCacheDon_ && c.dhXoaCacheDon_(); c.CacheService.getScriptCache().remove('DH_DON_v1');
  const n1 = c.dthRa_(null, true), ev = c.dthDs_();
  ok(n1 >= 1 && ev[0][5] === '2026-12-28' && ev[0][6] === '', 'sửa deadline thẳng trong Sheet → 1 thông báo (cũ ' + ev[0][4] + ' → mới ' + ev[0][5] + ', nguồn Sheet)', [n1, ev[0]]);
  ok(c.dthRa_(null, true) === 0, 'chạy lại không báo trùng');
  const D = c.__goi('layDonHangXuong', gd, true), o = D.don.find(x => x.tab === 'KHO' && x.thieu > 0 && x.dl && x.dong !== iR + 1 && !x.dung);
  const r1 = c.__goi('luuBangDon', gd, { ds: [{ tab: 'KHO', dong: o.dong, ten: o.ten, dl: { cu: o.dl, moi: '2026-12-30' } }] });
  const ev2 = c.dthDs_(); ok(r1.ok && ev2[0][5] === '2026-12-30' && /Giám|Hưng|giamdoc/i.test(ev2[0][6]), 'Giám đốc đổi deadline trên web → thông báo kèm tên người sửa (' + ev2[0][6] + ')', [r1.msg, ev2[0]]);
  c.dhXoaCacheDon_ && c.dhXoaCacheDon_(); const n3 = c.dthRa_(null, true);
  ok(!c.dthDs_().some((x, i) => i > 0 && x[5] === '2026-12-30' && x[6] === ''), 'lượt rà Sheet sau đó không báo trùng thay đổi vừa làm trên web', [n3, c.dthDs_().slice(0, 3)]);
  const bd = c.__goi('layDonBan', own); ok(bd.ok && Array.isArray(bd.doiHan) && bd.doiHan.length >= 2, 'trang Order-Flow nhận danh sách đổi deadline (' + (bd.doiHan || []).length + ')', bd.msg);
  const bt = c.__goi('layBangDonNhaMay', own), dd = bt.ds.find(d => d[1] === o.maDon && d[2] === o.ten);
  ok(bt.doiHan && dd && dd.length === 14 && dd[4] === '2026-12-30', 'Bảng đơn nhà máy có deadline mới + cột tồn kho / đã trả', dd);
  sh[iR][iDl] = cuDl;
}

console.log('\n' + (l ? '✗ ' + l + ' / ' + n + ' lỗi' : '✓ Đạt ' + n + ' / ' + n));
process.exit(l ? 1 : 0);
