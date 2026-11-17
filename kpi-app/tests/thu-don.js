/** Kiểm thử 17/11 khuya: Bán hàng "Thử trước khi đặt" (thử nhận đơn mới, thử đẩy 1 đơn lên ưu tiên – so với đúng hàm web) + gửi / xử lý đề nghị ưu tiên.
 *   DATA=<csdl.json> TZ=Asia/Ho_Chi_Minh node kpi-app/tests/thu-don.js
 *  (phần dựng dữ liệu chép từ du-kien.js) – Kiểm thử 17/11: ngày dự kiến xong cho Bán hàng (máy chủ chép mô phỏng của bảng đơn – so với đúng hàm dhMoPhong trong quy-trinh-web.html
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
function webMoPhong(DHd, hn, them, ut) {
  const src = fs.readFileSync(path.join(__dirname, 'quy-trinh', 'quy-trinh-web.html'), 'utf8');
  const lay = ten => { const i = src.indexOf('\nfunction ' + ten + '('); if (i < 0) throw new Error('không thấy ' + ten); let j = src.indexOf('{', i), d = 0, q = null;
    for (; j < src.length; j++) { const ch = src[j]; if (q) { if (ch === '\\') { j++; continue; } if (ch === q) q = null; continue; } if (ch === "'" || ch === '"') { q = ch; continue; } if (ch === '{') d++; else if (ch === '}' && --d === 0) break; }
    return src.slice(i + 1, j + 1); };
  const bien = src.split('\n').filter(s => /^var (DH_TAB_BAC1|DH_LE_TAB|DH_HAN_LE|DH_LAN_MIN|DH_SIM_C|DH_CS_DON|DH_LAN5|DH_LAN_DU|DH_LAN_KENH)\b/.test(s)).join('\n');
  const ham = ['dhCachNgay', 'dhCS', 'dhNgayCong', 'dhLaNgayLam', 'dhSoNgayLam', 'dhNgayLamThu', 'dhLaSX', 'dhGomDon', 'dhTenChuan', 'dhUuTen', 'dhLaUu', 'dhTreTen', 'dhBacDong', 'dhBac',
    'dhHanLeN', 'dhCongNgayLam', 'dhLanLe', 'dhLaLe', 'dhLan1', 'dhDlNgam', 'dhQua30', 'dhLa1K', 'dhBRoute', 'dhK2', 'dhKs', 'dhSimDong', 'dhMoPhong', 'dhCSDon', 'dhLanSo', 'dhLanNap'].map(lay).join('\n');
  const ctx = { DH: DHd, DHHT: null, HN: hn, them, ut: ut || null, kq: null }; vm.createContext(ctx);
  vm.runInContext(bien + '\n' + ham + '\nfunction dhHomNay(){ return HN; }\nkq = dhMoPhong(dhCSDon(), them, ut);', ctx);
  const m = {}; ctx.kq.forEach(g => { m[g.ma + '|' + g.tab] = g.eta; }); return m;
}


const shTK = c.ss_().getSheetByName('TaiKhoan'); c.__goi('taoTaiKhoanBH', own, { ds: c.__goi('dsUngVienBH', own).ds.filter(u => u.goiY).slice(0, 2).map(u => u.maNV) });
const iD2 = shTK.rows[0].indexOf('DoiMatKhauLanDau'), iV2 = shTK.rows[0].indexOf('VaiTro'); shTK.rows.forEach((row, i) => { if (i && row[iV2] === 'BH') row[iD2] = 'Không'; }); c.xoaCache_('TaiKhoan');
const bhTK = TK().filter(t => t.VaiTro === 'BH'), B1 = P(bhTK[0]), B2 = P(bhTK[1]);
const hn = c.homNayVN_(), cs = c.dhCongSuat_(), G0 = () => c.dbkGiau_(c.dhDocDon_(false));

console.log('\n1. Thử đẩy ưu tiên: máy chủ = đúng hàm web (dhMoPhong với ut)');
const DHd = c.__goi('layDonHangXuong', own, true), w0 = webMoPhong(DHd, hn, null), R0 = c.dbkMoPhong_(G0(), null, cs);
const dsK = Object.keys(w0).filter(k => w0[k] && /\|KHO$/.test(k) && !/DUNG/.test(k)).sort((a, b) => w0[a].localeCompare(w0[b]));
const kDay = dsK[Math.floor(dsK.length * 0.8)], maDay = kDay.split('|')[0];
const ut = { [kDay]: 1 }, w1 = webMoPhong(DHd, hn, null, ut), R1 = c.dbkMoPhong_(G0(), null, cs, ut);
const lech = Object.keys(w1).filter(z => (R1.m[z] || {}).eta !== w1[z]);
ok(Object.keys(w1).length > 50 && !lech.length, 'đẩy ' + kDay + ' lên đầu làn: ' + Object.keys(w1).length + ' đơn, ngày xong máy chủ trùng web 100%', lech.slice(0, 5).map(z => [z, w1[z], R1.m[z]]));
ok(w1[kDay] < w0[kDay], 'đơn được đẩy xong sớm hơn: ' + w0[kDay] + ' → ' + w1[kDay]);
const kQua = Object.keys(w0).find(z => !w0[z]);
const w2 = webMoPhong(DHd, hn, null, { [kQua]: 1 }), R2 = c.dbkMoPhong_(G0(), null, cs, { [kQua]: 1 });
ok(kQua && w2[kQua] && R2.m[kQua].eta === w2[kQua], 'đẩy đơn trễ > 30 ngày (đang chờ hạn mới) → được xếp lịch, trùng web ' + w2[kQua], [kQua, w2[kQua], R2.m[kQua]]);

console.log('\n2. Thử nhận đơn mới (Bán hàng)');
r = c.__goi('thuDonBH', tp, { loai: 'NHAN', tab: 'KHO', sl: 100 }); ok(!r.ok, 'trưởng phòng SX (không phải BH / người duyệt) bị chặn', r);
r = c.__goi('thuDonBH', B1, { loai: 'NHAN', tab: 'XYZ', sl: 100 }); ok(!r.ok && /kênh/.test(r.msg), 'kênh lạ → báo chọn kênh', r);
r = c.__goi('thuDonBH', B1, { loai: 'NHAN', tab: 'KHO', sl: '1,5' }); ok(!r.ok && /Số lượng/.test(r.msg), 'số lượng không nguyên → báo lỗi', r);
r = c.__goi('thuDonBH', B1, { loai: 'NHAN', tab: 'KHO', sl: 100, dl: '2026-11-01' }); ok(!r.ok && /Deadline/.test(r.msg), 'deadline đã qua → báo lỗi', r);
const nK = c.__goi('thuDonBH', B1, { loai: 'NHAN', tab: 'KHO', sl: 3000 });
const wK = webMoPhong(DHd, hn, { ma: '(thử) đơn mới', tab: 'KHO', thieu: 3000, dl: '', dong: [] })['(thử) đơn mới|KHO'];
ok(nK.ok && nK.lan === 'Kho' && nK.cuoi === wK && nK.hen === R0.congN(wK, 6) && !nK.xong, 'không deadline: xếp cuối làn Kho xong ' + nK.cuoi + ' (= web) → hẹn khách an toàn ' + nK.hen + ' (+6 ngày làm)', [nK, wK]);
const nD = c.__goi('thuDonBH', B1, { loai: 'NHAN', tab: 'DEALER', sl: 3000 }), nO = c.__goi('thuDonBH', B1, { loai: 'NHAN', tab: 'OEM', sl: 3000 });
ok(nD.ok && nO.ok && nD.lan === 'Dealer' && nO.lan === 'OEM' && nD.hen !== nO.hen, 'cùng 3.000 sp: Dealer hẹn ' + nD.hen + ', OEM hẹn ' + nO.hen + ' (khác làn → khác ngày)', [nD.hen, nO.hen]);
const xa = R0.congN(nK.hen, 5), nX = c.__goi('thuDonBH', B1, { loai: 'NHAN', tab: 'KHO', sl: 3000, dl: xa });
ok(nX.ok && nX.mau === '' && nX.kip === 1 && nX.xong <= xa, 'deadline sau ngày hẹn an toàn (' + xa + ') → an toàn, kịp, xong ' + nX.xong, nX);
const gan = R0.congN(hn, 3), nG = c.__goi('thuDonBH', B1, { loai: 'NHAN', tab: 'KHO', sl: 3000, dl: gan });
const wG = webMoPhong(DHd, hn, { ma: '(thử) đơn mới', tab: 'KHO', thieu: 3000, dl: gan, dong: [] });
ok(nG.ok && nG.mau === 'do' && nG.kip === 0 && nG.xong === R0.cong2(wG['(thử) đơn mới|KHO']), 'deadline ' + gan + ' quá gần → đỏ, không kịp; xong = web + 2 ngày làm (' + nG.xong + ')', [nG, wG['(thử) đơn mới|KHO']]);
const biTre = Object.keys(w0).filter(z => { const n = DHd.don.filter(o => (o.maDon || '(không mã)') + '|' + o.tab === z && o.thieu > 0 && o.dl).map(o => o.dl).sort()[0]; return n && w0[z] && w0[z] <= n && wG[z] > n; }).length;
ok(nG.biTre === biTre && biTre > 0, 'chen đơn 3.000 sp hạn gần: ' + biTre + ' đơn khác đang kịp thành trễ (= tính lại từ hàm web)', [nG.biTre, biTre]);
const vg = c.__goi('thuDonBH', B1, { loai: 'NHAN', tab: 'KHO', sl: 3000, dl: R0.congN(nK.cuoi, 2) });
ok(vg.ok && vg.mau === 'vang', 'deadline giữa ngày xong cuối làn và ngày hẹn an toàn → vàng', vg);

console.log('\n3. Thử đẩy một đơn lên ưu tiên (Bán hàng)');
const dM = c.__goi('thuDonBH', B1, { loai: 'DAY', gt: maDay.toLowerCase() });
const luiWeb = Object.keys(w1).filter(z => z !== kDay && w0[z] && w1[z] && w1[z] > w0[z]);
ok(dM.ok && dM.kieu === 'ma' && dM.duoc.length === 1 && dM.duoc[0].moi === R0.cong2(w1[kDay]) && dM.duoc[0].cu === R0.cong2(w0[kDay]), 'gõ mã đơn chữ thường ' + maDay.toLowerCase() + ' → khớp, xong ' + dM.duoc[0].cu + ' → ' + dM.duoc[0].moi + ' (sớm ' + dM.duoc[0].som + ' ngày)', dM);
ok(dM.tong.n === luiWeb.length && dM.nLui === luiWeb.length && dM.lui.length === luiWeb.length && dM.lui.every(x => x.d > 0 && x.kenh), 'ĐỦ danh sách ' + luiWeb.length + ' đơn bị lùi (mã, kênh, deadline, số ngày) – khớp hàm web', [dM.tong, luiWeb.length]);
ok(dM.theo.reduce((a, t) => a + t.n, 0) === dM.tong.n && dM.lui.every((x, i, a) => !i || a[i - 1].tre > x.tre || (a[i - 1].tre === x.tre && a[i - 1].d >= x.d)), 'bảng theo kênh cộng đúng tổng; danh sách xếp đơn thành trễ trước, lùi nhiều trước');
ok(dM.guiDuoc === 1 && !dM.daUu && !dM.cho, 'Bán hàng + khớp mã đơn → được gửi đề nghị', dM);
r = c.__goi('thuDonBH', gd, { loai: 'DAY', gt: maDay }); ok(r.ok && r.guiDuoc === 0, 'người duyệt thử được nhưng không có nút gửi đề nghị (gắn ★ thẳng)', r.guiDuoc);
const tenHang = DHd.don.find(o => o.maDon === maDay && o.tab === 'KHO' && o.thieu > 0).ten;
r = c.__goi('thuDonBH', B1, { loai: 'DAY', gt: tenHang }); ok(r.ok && r.kieu === 'ten' && r.duoc.length >= 1 && r.guiDuoc === 0, 'gõ tên hàng ' + tenHang + ' → ' + (r.duoc || []).length + ' đơn được đẩy, không gửi đề nghị theo tên', r.kieu);
r = c.__goi('thuDonBH', B1, { loai: 'DAY', gt: 'GAY' }); ok(!r.ok && /cùng khớp/.test(r.msg), 'gõ "GAY" khớp nhiều tên → báo gõ cụ thể hơn', r);
r = c.__goi('thuDonBH', B1, { loai: 'DAY', gt: '#KHONG-CO' }); ok(!r.ok && /Không tìm thấy/.test(r.msg), 'mã lạ → không tìm thấy', r);

console.log('\n4. Gửi đề nghị ưu tiên');
r = c.__goi('guiDeNghiUu', gd, { gt: maDay, lyDo: 'Khách cần gấp', daXem: 1 }); ok(!r.ok, 'người duyệt không gửi đề nghị', r);
r = c.__goi('guiDeNghiUu', B1, { gt: maDay, lyDo: 'gấp', daXem: 1 }); ok(!r.ok && /lý do/.test(r.msg), 'lý do quá ngắn → chặn', r);
r = c.__goi('guiDeNghiUu', B1, { gt: maDay, lyDo: 'Khách đặt cho giải đấu' }); ok(!r.ok && /đã xem/.test(r.msg), 'chưa tick "đã xem các đơn bị lùi" → chặn', r);
r = c.__goi('guiDeNghiUu', B1, { gt: tenHang, lyDo: 'Khách đặt cho giải đấu', daXem: 1 }); ok(!r.ok && /MÃ ĐƠN/.test(r.msg), 'gửi theo tên hàng → chặn (chỉ theo mã đơn)', r);
r = c.__goi('guiDeNghiUu', B1, { gt: maDay, lyDo: 'Khách đặt cho giải đấu 05/12', can: '2026-12-01', daXem: 1, lenh: 'lenhDN001' });
ok(r.ok && /Đã gửi/.test(r.msg), r.msg, r);
r = c.__goi('guiDeNghiUu', B1, { gt: maDay, lyDo: 'Khách đặt cho giải đấu 05/12', daXem: 1, lenh: 'lenhDN001' }); ok(r.ok, 'bấm 2 lần (cùng lệnh) → không tạo bản ghi thứ 2', r);
r = c.__goi('guiDeNghiUu', B2, { gt: maDay, lyDo: 'Khách khác cũng cần gấp', daXem: 1 }); ok(!r.ok && /đang chờ/.test(r.msg), 'BH khác gửi trùng mã đơn đang chờ → chặn', r);
const ssD = c.dhhSS_(false), dn = c.dhhDoc_(ssD, 'DeNghiUu');
ok(dn.length === 1 && dn[0].TrangThai === 'CHO' && dn[0].NgayCan === '2026-12-01' && JSON.parse(dn[0].KetQua).nLui === luiWeb.length && dn[0].Tabs === 'KHO', '1 bản ghi ở tab DeNghiUu: chờ, khách cần 01/12, kết quả thử do MÁY CHỦ tính lại (' + luiWeb.length + ' đơn lùi)', dn);
r = c.__goi('thuDonBH', B2, { loai: 'DAY', gt: maDay }); ok(r.ok && r.cho && r.guiDuoc === 0, 'thử lại đơn đó → thấy "đã có đề nghị đang chờ", không có nút gửi', r.cho);
r = c.__goi('layDonBan', B1); ok(r.ok && r.dn.length === 1 && r.dn[0].tt === 'CHO' && r.dn[0].can === '2026-12-01', 'BH gửi thấy đề nghị của mình', r.dn);
r = c.__goi('layDonBan', B2); ok(r.ok && r.dn.length === 0, 'BH khác không thấy đề nghị của người khác', r.dn);
r = c.__goi('layDonBan', gd); ok(r.ok && r.dn.length === 1 && r.dn[0].ai, 'người duyệt thấy đề nghị', r.dn);
r = c.__goi('demDonBanCho', c067); ok(r.ok && r.dn && r.dn.n === 1 && r.dn.ds[0].ma === maDay, 'Việc hôm nay người duyệt: 1 đề nghị ưu tiên chờ', r.dn);

console.log('\n5. Người duyệt xử lý');
const idDN = dn[0].Id;
r = c.__goi('xuLyDeNghiUu', B1, { id: idDN, hanh: 'DONG_Y' }); ok(!r.ok, 'BH không tự duyệt được', r);
r = c.__goi('xuLyDeNghiUu', gd, { id: idDN, hanh: 'KHONG', lyDo: '' }); ok(!r.ok && /lý do/.test(r.msg), 'không đồng ý mà thiếu lý do → chặn', r);
const etaTruoc = c.__goi('thuDonBH', B2, { loai: 'DAY', gt: maDay });
r = c.__goi('xuLyDeNghiUu', gd, { id: idDN, hanh: 'DONG_Y' }); ok(r.ok && /★/.test(r.msg), r.msg, r);
r = c.__goi('xuLyDeNghiUu', c067, { id: idDN, hanh: 'KHONG', lyDo: 'Không cần nữa' }); ok(!r.ok && r.cu, 'người thứ 2 xử lý cùng đề nghị → báo đã xử lý', r);
ok(Object.keys(c.dhUuWebDoc_()).includes(maDay + '|KHO'), 'đồng ý = gắn ★ ưu tiên cả đơn (cùng chỗ nút ★ trên bảng đơn)');
r = c.__goi('thuDonBH', B1, { loai: 'DAY', gt: maDay }); ok(r.ok && r.daUu === 1 && r.guiDuoc === 0, 'thử lại → "đã ★ ưu tiên", không gửi được nữa', r.daUu);
const G1 = c.dbkGiau_(c.dhDocDon_(false)), R3 = c.dbkMoPhong_(G1, null, cs);
ok(R3.m[kDay].eta < w0[kDay], 'mô phỏng sau ★: đơn ' + maDay + ' xong ' + w0[kDay] + ' → ' + R3.m[kDay].eta, R3.m[kDay]);
r = c.__goi('layDonBan', B1); ok(r.dn[0].tt === 'DONG_Y' && r.dn[0].xlAi, 'BH thấy "Đã đồng ý ★" + người duyệt', r.dn);
r = c.__goi('guiDeNghiUu', B1, { gt: maDay, lyDo: 'Gửi lại lần nữa', daXem: 1 }); ok(!r.ok && /đã được ★/.test(r.msg), 'đơn đã ★ → không gửi đề nghị nữa', r);

console.log('\n6. Giới hạn thử 60 lần / giờ');
c.CacheService.getScriptCache().put('DBT_' + bhTK[1].TenDangNhap, '60', 3600);
r = c.__goi('thuDonBH', B2, { loai: 'NHAN', tab: 'KHO', sl: 10 }); ok(!r.ok && /nhiều lần/.test(r.msg), 'quá 60 lần → báo nghỉ ít phút', r);

console.log('\n7. Chủ sở hữu tự chia 5 làn (⚙ Công suất)');
r = c.__goi('luuLanCongSuat', gd, { pt: [10, 20, 50, 5, 15], du: [2, 3, 4, 5, 1], kenh: {} }); ok(!r.ok, 'Giám đốc không sửa được (chỉ chủ sở hữu)', r);
r = c.__goi('luuLanCongSuat', own, { pt: [10, 20, 50, 5, 10], du: [2, 3, 4, 5, 1] }); ok(!r.ok && /100%/.test(r.msg), 'tổng 95% → chặn', r);
r = c.__goi('luuLanCongSuat', own, { pt: [10, 20, 50, 5, 15], du: [2, 3, 3, 5, 1] }); ok(!r.ok && /phần dư/.test(r.msg), 'thứ tự dư trùng làn → chặn', r);
r = c.__goi('luuLanCongSuat', own, { pt: [10.5, 20, 49.5, 5, 15], du: [2, 3, 4, 5, 1] }); ok(!r.ok, 'tỷ lệ lẻ thập phân → chặn', r);
const D0 = c.__goi('layDonHangXuong', own, true), e0 = webMoPhong(D0, hn, null);
r = c.__goi('luuLanCongSuat', own, { pt: [10, 30, 40, 0, 20], du: [5, 2, 3, 4, 1], kenh: { OEM: 2, 'POD-A.BÁCH': 1, KHO: 3 } });
ok(r.ok && r.cs.lan.pt.join() === '10,30,40,0,20' && r.cs.lan.du.join() === '5,2,3,4,1' && JSON.stringify(r.cs.lan.kenh) === '{"OEM":2}', 'lưu 10·30·40·0·20, dư A Đông trước, OEM vào làn Dealer (chỉ lưu kênh khác mặc định)', r.cs && r.cs.lan);
const D1 = c.__goi('layDonHangXuong', own, true), e1 = webMoPhong(D1, hn, null), R7 = c.dbkMoPhong_(c.dbkGiau_(c.dhDocDon_(false)), null, c.dhCongSuat_());
const lech7 = Object.keys(e1).filter(z => (R7.m[z] || {}).eta !== e1[z]);
ok(D1.cs.lan && !lech7.length && Object.keys(e1).some(z => e1[z] !== e0[z]), 'web nhận cấu hình mới; ngày xong máy chủ trùng web 100% với tỷ lệ mới (và khác trước)', lech7.slice(0, 3).map(z => [z, e1[z], R7.m[z]]));
r = c.__goi('thuDonBH', B1, { loai: 'NHAN', tab: 'OEM', sl: 100 }); ok(r.ok && r.lan === 'Dealer', 'Bán hàng thử đơn OEM → xếp vào làn Dealer theo cấu hình', r.lan);
r = c.__goi('layDonBan', B1); ok(r.lanTxt === 'Lẻ + POD 10% · Dealer 30% · Kho 40% · OEM 0% · A Đông 20%', 'trang Bán hàng hiện tỷ lệ mới: ' + r.lanTxt, r.lanTxt);
r = c.__goi('layLichSuLan', own); ok(r.ok && r.ls.length === 1 && /OEM → Dealer/.test(r.ls[0].kenh) && /A Đông → Dealer/.test(r.ls[0].du), 'lịch sử đổi làn: cũ → mới, thứ tự dư, kênh đổi làn', r.ls);
r = c.__goi('luuLanCongSuat', own, { pt: [10, 20, 50, 5, 15], du: [2, 3, 4, 5, 1], kenh: { OEM: 4 } }); ok(r.ok && !Object.keys(r.cs.lan.kenh).length, 'về mặc định 10·20·50·5·15', r.cs && r.cs.lan);

console.log('\n' + (l ? '✗ ' + l + ' / ' + n + ' lỗi' : '✓ Đạt ' + n + ' / ' + n));
process.exit(l ? 1 : 0);
