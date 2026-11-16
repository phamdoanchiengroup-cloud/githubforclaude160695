/** Kiểm thử bậc ưu tiên mới + gắn ưu tiên + làn đơn lẻ 10–13% + gợi ý ngày hẹn + đơn lẻ quá 10 ngày + nhập nhanh Đến hạn 10 ngày (15/11 chiều)
 *   DATA=<csdl.json> TZ=Asia/Ho_Chi_Minh node kpi-app/tests/uu-tien-web.js */
const path = require('path'), fs = require('fs'); const G = require('./gia-lap-kpi.js');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const DATA = process.env.DATA; if (!DATA) { console.log('Cần DATA='); process.exit(1); }
let n = 0, l = 0; const ok = (c, t, x) => { n++; if (!c) l++; console.log((c ? '  ✓ ' : '  ✗ ') + t + (c ? '' : ' → ' + JSON.stringify(x).slice(0, 300))); };
const du = JSON.parse(fs.readFileSync(DATA, 'utf8')); ['DonHangChup', 'PhanLoaiSKU', 'CauHinhSP', 'BTPTheoSKU', 'DonUuTien'].forEach(k => { if (du[k]) du[k] = du[k].slice(0, 1); });
const iDoi = du.TaiKhoan[0].indexOf('DoiMatKhauLanDau'); du.TaiKhoan.slice(1).forEach(x => { x[iDoi] = 'Không'; });
const c = G.tao(path.join(__dirname, '..', 'Code.gs'), du, '2026-11-16T09:00:00+07:00');
console.log('1. Máy chủ – gắn ưu tiên');
const TK = c.doc_('TaiKhoan').filter(t => t.TrangThai === 'Đang dùng'), tk = ma => TK.find(t => String(t.MaNV).toUpperCase() === ma);
const tab = [['', 'Loại hàng cần sản xuất', 'Loại Phôi', 'Số lượng đặt', 'SX CÒN THIẾU', 'Deadline'], ['#M-01/11', 'GAY NOVA X1 MAU DO', '', 50, 50, '30/12']];
c.__ngoai = { [c.DH_SHEET_ID]: { ten: 'x', sheets: { OEM: tab } } }; c.dhDocDon_(true);
const gd = c.__phienDai(tk('C019')), kl = c.__phienDai(tk('C067')), tp = c.__phienDai(TK.find(t => String(t.VaiTro).trim() === 'TP'));
let r = c.__goi('luuUuTienDon', tp, { maDon: '#M-01/11', tab: 'OEM', bat: true }); ok(!r.ok, 'trưởng phòng không gắn được ưu tiên', r);
r = c.__goi('layDonHangXuong', gd, true); ok(r.q.uuGan === true && c.__goi('layDonHangXuong', tp, false).q.uuGan === false, 'quyền gắn: Giám đốc có, TP không');
r = c.__goi('luuUuTienDon', kl, { maDon: '#M-01/11', tab: 'OEM', bat: true }); ok(r.ok, 'chị Kim Loan (C067) gắn được', r);
r = c.__goi('layDonHangXuong', gd, false); const o1 = r.don.find(o => o.maDon === '#M-01/11');
ok(o1 && o1.uuWeb && /^Ưu tiên \(/.test(o1.uuTien), 'đơn có cờ ưu tiên + ghi ai gắn', o1 && [o1.uuWeb, o1.uuTien]);
ok(c.doc_('DonUuTien').length === 1 && !c.ss_().getSheetByName('DonUuTien').rows.some(rw => String(rw.join()).includes('#CONG_THUC')), 'lưu ở sheet ẩn DonUuTien (file KPI, không ghi Sheet đơn)');
r = c.__goi('luuUuTienDon', gd, { maDon: '#M-01/11', tab: 'OEM', bat: false }); ok(r.ok && c.doc_('DonUuTien').length === 0 && !c.__goi('layDonHangXuong', gd, false).don[0].uuWeb, 'bỏ ưu tiên: xóa cờ');
console.log('1b. Máy chủ – sửa deadline đơn (15/11 tối)');
r = c.__goi('luuBangDon', tp, { ds: [{ tab: 'OEM', dong: 2, ten: 'GAY NOVA X1 MAU DO', dl: { cu: '2026-12-30', moi: '2027-01-15' } }] }); ok(!r.ok, 'trưởng phòng không sửa được deadline đơn', r);
r = c.__goi('luuBangDon', gd, { ds: [{ tab: 'OEM', dong: 2, ten: 'GAY NOVA X1 MAU DO', dl: { cu: '2026-12-20', moi: '2027-01-15' } }] }); ok(!r.ok && r.xungDot, 'deadline trong Sheet khác số web đang thấy → báo xung đột', r);
r = c.__goi('luuBangDon', c.__phienDai(tk('C077')), { ds: [{ tab: 'OEM', dong: 2, ten: 'GAY NOVA X1 MAU DO', dl: { cu: '2026-12-30', moi: '2027-01-15' } }] });
const oDl = c.__goi('layDonHangXuong', gd, true).don.find(o => o.maDon === '#M-01/11');
ok(r.ok && r.n === 1 && oDl.dl === '2027-01-15' && String(c.__ngoai[c.DH_SHEET_ID].sheets.OEM[1][5]).indexOf('15/01/2027') >= 0, 'Phó GĐ C077 ghi deadline mới vào cột DEADLINE của Sheet, web đọc lại đúng (sang năm 2027)', [r, oDl && oDl.dl, c.__ngoai[c.DH_SHEET_ID].sheets.OEM[1]]);
ok(c.dhCoNote_({ maNV: 'C077' }) && c.dhCoUu_({ maNV: 'C056' }), 'C077 sửa được Note; C056 (Phó GĐ SX) gắn ưu tiên / sửa deadline');
(async () => {
  console.log('2. Web');
  const b = await chromium.launch(), pg = await b.newPage({ viewport: { width: 1300, height: 900 } }), er = []; pg.on('pageerror', e => er.push(e.message));
  await pg.setContent('<html><body><main id=main style="width:1240px"></main></body></html>');
  await pg.addScriptTag({ content: 'window.esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\\"":"&quot;"}[c]));window.qtSo=n=>String(Math.round(n||0));window.toast=()=>{};window.__goi=[];window.call=(f,a,cb)=>{window.__goi.push([f,a]);};window.$=id=>document.getElementById(id);' });
  await pg.addScriptTag({ content: fs.readFileSync(path.join(__dirname, '..', 'QuyTrinh.html'), 'utf8').replace(/^[\s\S]*?<script>/, '').replace(/<\/script>[\s\S]*$/, '') });
  const w = await pg.evaluate(() => { const hn = dhHomNay(), out = {}, R = ['PHOI','SON','TARO','UV','HT','TIP','DG'];
    const mk = (ma, tab, sl, dl, x) => Object.assign({ maDon: ma, tab: tab, kenh: tab, ten: 'Gậy ' + ma, sl: sl, thieu: sl, dl: dl, btp: R, pl: { loai: 'GAY' }, qua: {}, hen: {}, dong: 2 }, x || {});
    window.DHHT = { ok: true, luc: 'x', don: [] };
    out.bac = [dhBacDong(mk('D', 'DEALER', 50, dhNgayCong(hn, 20))), dhBacDong(mk('W', 'WEB LẺ ĐƠN THƯỜNG', 1, '')), dhBacDong(mk('P', 'POD-A.BÁCH', 1, '')), dhBacDong(mk('K', 'KHO', 50, dhNgayCong(hn, 20))), dhBacDong(mk('U', 'OEM', 50, dhNgayCong(hn, 20), { uuTien: 'Ưu tiên (GĐ)', uuWeb: { ai: 'GĐ' } })), dhBacDong(mk('T', 'OEM', 50, dhNgayCong(hn, -3)))];
    window.DH = { luc: 'a', cs: { sp: 310, nghi: [], lam: [], bp: {} }, don: [mk('O', 'OEM', 500, dhNgayCong(hn, 30))], q: { bp: 'SON', sua: ['SON'], uuGan: true, ten: 'GĐ' }, cot: { OEM: { qty: { PHOI: 1, SON: 1, UV: 1, HT: 1, DG: 1 }, hen: { SON: 1 } } }, bpDs: [['PHOI','Phôi'],['SON','Sơn'],['UV','UV'],['HT','Hoàn thiện'],['DG','Đóng gói']] };
    out.lan0 = dhLanLe().pct;
    DH.luc = 'b'; for (let i = 0; i < 60; i++) DH.don.push(mk('W' + i, 'WEB LẺ CUSTOM', 30, '', { ngayDat: dhNgayCong(hn, -(i % 20) - 1) }));
    out.lan1 = dhLanLe(); DH.luc = 'c';
    /* gần xong trước khi bằng hạn */
    const dlx = dhNgayCong(hn, 40); DH.don = [mk('A', 'OEM', 300, dlx), mk('B', 'OEM', 300, dlx, { qua: { PHOI: 300, SON: 300, TARO: 300, UV: 300 }, p2: { c: 300, n: 300 } })];
    const m = dhMoPhong(dhCSDon()); out.ab = [m.find(g => g.ma === 'A').eta, m.find(g => g.ma === 'B').eta];
    out.gy = dhGoiYHen(200); out.gyNho = dhGoiYHen(10); out.mucSom = dhSoHen(dhNgayCong(hn, 3), out.gy); out.mucXa = dhSoHen(dhNgayCong(out.gy.hen, 5), out.gy);
    DHCSThu = { sl: 200, dl: '' }; out.cs = dhVeCongSuat(); DHCSThu = { sl: 200, dl: dhNgayCong(hn, 3) }; out.cs2 = dhVeCongSuat(); DHCSThu = null;
    /* đơn lẻ quá 10 ngày */
    const le = [mk('L1', 'WEB LẺ CUSTOM', 1, '', { ngayDat: dhNgayCong(hn, -14), pl: { loai: 'GAY' } }), mk('L2', 'POD-ECOMSTONE', 2, '', { ngayDat: dhNgayCong(hn, -3) }), mk('L3', 'WEB LẺ ĐƠN THƯỜNG', 1, '', { ngayDat: dhNgayCong(hn, -20), thieu: 0 })];
    out.le10 = dhLe10Ds(le).map(o => o.maDon);
    const g1 = { ma: 'H1', tab: 'OEM', dl: dhNgayCong(hn, 2), thieu: 40, dong: [mk('H1', 'OEM', 40, dhNgayCong(hn, 2), { dong: 5, qua: { SON: 10 } }), mk('H1', 'OEM', 30, dhNgayCong(hn, 2), { dong: 6, btp: ['PHOI','TARO','HT','TIP','DG'], pl: { loai: 'NGON' } })] };
    /* 15/11 khuya: mục "Đến hạn 10 ngày tới" trong bảng đơn */
    DH.q = { bp: 'SON', sua: ['SON'] }; DH.don = [mk('A1', 'OEM', 10, dhNgayCong(hn, 3), { st: 'dangSX' }), mk('A1', 'OEM', 5, dhNgayCong(hn, 3), { st: 'dangSX', dong: 3 }), mk('B1', 'KHO', 8, dhNgayCong(hn, 1), { st: 'dangSX', dong: 4 }), mk('C1', 'OEM', 9, dhNgayCong(hn, 20), { st: 'dangSX', dong: 7 }), mk('T1', 'OEM', 9, dhNgayCong(hn, -2), { st: 'treHan', dong: 8 })];
    out.h10 = dhHan10Ds(DH.don).map(o => o.maDon + ':' + o.dong);
    DHB.tab = '@han10'; DHV = 'bang'; try { out.bang = dhVeBang(DH.don); } catch (e) { out.loiBang = e.message; }
    DHB.tab = ''; DHV = 'tt'; dhChon('han10'); window.__dhMo = 'han10'; out.cuHan10 = (function(){ var v = dhCu('han10'); return [v, DHB.tab]; })(); out.chon = [DHV, DHB.tab]; DH.don.push(mk('L9', 'WEB LẺ CUSTOM', 1, '', { ngayDat: dhNgayCong(hn, -15), st: 'dangSX', dong: 9 })); dhChon('le10'); out.chonLe = [DHV, DHB.tab]; try { out.bangLe = dhVeBang(DH.don); } catch (e) { out.loiLe = e.message; } out.nhom = DH_NHOM[0][2].map(x => x[0]).join();
    DH.q = { uuGan: true, ten: 'GĐ' }; out.nut = dhUuNut(g1.dong[0]); DH.q.uuGan = false; out.nut2 = dhUuNut(g1.dong[0]);
    return JSON.parse(JSON.stringify(out)); });
  ok(er.length === 0, 'không lỗi script', er);
  ok(w.bac.join() === '3,1,1,3,2,2', 'bậc: Dealer 3 · Web lẻ 1 · POD 1 · Kho 3 · đơn gắn ưu tiên 2 · đơn trễ 2', w.bac);
  ok(w.lan0 === 0.10, 'ít đơn lẻ → làn đơn lẻ 10% (sàn)', w.lan0);
  ok(w.lan1.pct === 0.13 && w.lan1.spNgay > 0, 'nhiều đơn lẻ → làn 13% (trần), có số sp lẻ/ngày', w.lan1);
  ok(w.ab[1] <= w.ab[0], 'bằng deadline: đơn đã qua nhiều bộ phận (gần xong) xong trước', w.ab);
  ok(w.gy && w.gy.hen > w.gy.xong && w.gy.ngayLamHen === Math.ceil(w.gy.ngayLam * 1.2) && w.gyNho.hen <= w.gy.hen, 'ngày hẹn gợi ý = ngày xong khi xếp cuối + 20% dự phòng; đơn nhỏ hẹn sớm hơn', [w.gy, w.gyNho]);
  ok(w.mucSom === 'do' && w.mucXa === '', 'deadline quá sớm → cảnh báo đỏ; sau ngày gợi ý → không cảnh báo', [w.mucSom, w.mucXa]);
  ok(/Ngày hẹn gợi ý cho đơn <b>200 sp/.test(w.cs) && /sớm hơn gợi ý/.test(w.cs2) && /Chỉ cảnh báo/.test(w.cs2), 'Thử nhận đơn: để trống deadline → gợi ý ngày hẹn; deadline sớm → chỉ cảnh báo', '');
  ok(w.le10.join() === 'L1', 'đơn lẻ / POD còn thiếu quá 10 ngày từ ngày đặt → cảnh báo (bỏ đơn mới đặt, đơn đã xong)', w.le10);
  ok(w.h10.join() === 'B1:4,A1:2,A1:3', 'Đến hạn 10 ngày tới: đủ dòng của đơn hạn trong 10 ngày, hạn sớm trước; bỏ đơn xa + đơn đã trễ', w.h10);
  ok(!w.loiBang && /Đến hạn 10 ngày tới/.test(w.bang) && /data-t="@han10"/.test(w.bang) && !/@le10/.test(w.bang), 'bảng đơn có mục "Đến hạn 10 ngày tới" (thay mục Lẻ / POD quá 10 ngày)', w.loiBang || '');
  ok(w.chon.join() === 'bang,@han10' && w.nhom === 'bang,congsuat', 'ô "Đến hạn 10 ngày tới" mở thẳng mục trong bảng đơn; bỏ mục đứng riêng', [w.chon, w.nhom]);
  ok(w.chonLe.join() === 'bang,@le10' && !w.loiLe && /Đơn lẻ \/ POD quá 10 ngày<\/b>/.test(w.bangLe) && /L9/.test(w.bangLe) && !/A1/.test(w.bangLe), 'ô đầu trang "Lẻ / POD quá 10 ngày" mở danh sách đơn lẻ / POD quá hạn trong bảng đơn', w.loiLe || w.chonLe);
  ok(w.cuHan10 && w.cuHan10.join() === 'bang,@han10', '16/11 rà soát: Tổng quan → Đến hạn 10 ngày → Xem tất cả mở mục trong bảng (không mở màn hình cũ đã bỏ)', w.cuHan10);
  ok(/Gắn ưu tiên cả đơn/.test(w.nut) && !/button/.test(w.nut2), 'nút ★ Gắn ưu tiên chỉ hiện với 4 tài khoản', '');
  console.log(n + ' kiểm thử, ' + l + ' lỗi'); await b.close(); process.exit(l ? 1 : 0);
})();
