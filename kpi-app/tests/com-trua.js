/**
 * Kiểm tra cơm trưa (tests/com-trua.gs, đã gộp vào Code.gs): thực đơn, đăng ký ăn / không ăn, hạn 16:00 hôm trước,
 * quyền xem tổng hợp, vai trò BEP, tổng kết sang tháng (lưu Drive rồi xóa) và mục "Suất ăn trưa" trong báo cáo tháng.
 *   DATA=/đường/dẫn/csdl.json node kpi-app/tests/com-trua.js      (dữ liệu thật – KHÔNG đưa vào repo)
 */
const path = require('path'), fs = require('fs');
const G = require('./gia-lap-kpi.js');
const MOI = path.join(__dirname, '..', 'Code.gs'), DATA = process.env.DATA;
if (!DATA) { console.log('Cần DATA=<file json dữ liệu>'); process.exit(1); }
let dem = 0, loi = 0;
const ok = (dk, ten, ct) => { dem++; if (dk) console.log('  ✓ ' + ten); else { loi++; console.log('  ✗ ' + ten + (ct !== undefined ? '  → ' + JSON.stringify(ct).slice(0, 400) : '')); } };

const du = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const hTK = du.TaiKhoan[0], iDoi = hTK.indexOf('DoiMatKhauLanDau');
du.TaiKhoan.slice(1).forEach(r => { r[iDoi] = 'Không'; });
du.TaiKhoan.push(hTK.map(h => ({ TenDangNhap: 'bep', HoTen: 'Bếp ăn', VaiTro: 'BEP', MaXuong: '', TrangThai: 'Đang dùng', DoiMatKhauLanDau: 'Không' }[h] || '')));
// 12/10/2026 (thứ Hai) 14:30 – bếp báo thực đơn ngày mai
const c = G.tao(MOI, du, '2026-10-12T14:30:00+07:00');
// trường hợp thật 11/10: sheet DangKyCom đã có nhưng trống trơn (không có dòng tiêu đề) -> trước đây lỗi "number of columns … at least 1"
c.SpreadsheetApp.getActiveSpreadsheet().insertSheet('DangKyCom');

const tk = f => c.doc_('TaiKhoan').filter(f)[0];
const vt = v => x => String(x.VaiTro).trim() === v && String(x.TrangThai).trim() === 'Đang dùng';
const owner = tk(vt('OWNER')), tp = tk(x => vt('TP')(x) && x.MaXuong), cn = tk(x => vt('CN')(x) && x.MaXuong !== tp.MaXuong), cn2 = tk(x => vt('CN')(x) && x.MaXuong === tp.MaXuong), bep = tk(vt('BEP')), cn3 = tk(x => vt('CN')(x) && x.MaXuong !== tp.MaXuong && x.TenDangNhap !== cn.TenDangNhap);
const P = t => c.taoPhien_(t), tO = P(owner), tTP = P(tp), tCN = P(cn), tCN2 = P(cn2), tB = P(bep), tCN3 = P(cn3);
const nghi = new Set(c.doc_('NhanSu').filter(x => String(x.TrangThai).trim() === 'Nghỉ việc').map(x => String(x.MaNV).trim()));
const soNguoi = c.doc_('TaiKhoan').filter(x => String(x.TrangThai).trim() === 'Đang dùng' && String(x.VaiTro).trim() !== 'BEP' && !(x.MaNV && nghi.has(String(x.MaNV).trim()))).length;   // tài khoản đang dùng, bỏ người đã nghỉ việc

console.log('\n1. Thực đơn');
let r = c.__goi('luuThucDon', tCN, '2026-10-13', 'Cơm, gà rang', '');
ok(!r.ok && /Chỉ bếp/.test(r.msg), 'công nhân không nhập được thực đơn', r);
r = c.__goi('luuThucDon', tB, '2026-10-11', 'Cơm', '');
ok(!r.ok && /đã qua/.test(r.msg), 'không nhập thực đơn cho ngày đã qua', r);
r = c.__goi('luuThucDon', tB, '2026-10-13', 'Cơm trắng\nGà rang sả ớt\nRau muống xào tỏi\nCanh bí đỏ\nChuối tráng miệng', 'Có suất chay');
ok(r.ok && /16:00 ngày 12\/10/.test(r.msg), 'bếp lưu thực đơn ngày 13/10, báo hạn 16:00 ngày 12/10', r.msg);
r = c.__goi('luuThucDon', tO, '2026-10-13', 'Cơm trắng\nGà rang sả ớt\nRau muống xào tỏi\nCanh bí đỏ\nDưa hấu', 'Có suất chay');
ok(r.ok && c.__sheets.ThucDon.rows.length === 2, 'ban điều hành sửa thực đơn: vẫn 1 dòng (ghi đè)', c.__sheets.ThucDon.rows.length);
c.__goi('luuThucDon', tB, '2026-10-14', 'Cơm, cá kho, canh chua', '');

console.log('\n2. Đăng ký của mọi người');
r = c.__goi('napComTrua', tCN);
const t13 = r.ok && r.thucDon.find(t => t.ngay === '2026-10-13');
ok(t13 && t13.conHan && /Dưa hấu/.test(t13.mon) && t13.ghiChu === 'Có suất chay', 'công nhân thấy thực đơn ngày mai, còn hạn', r.thucDon);
ok(r.quyen && !r.quyen.xem && !r.quyen.sua && !r.tongHop.length, 'công nhân không thấy tổng hợp, không sửa được thực đơn', r.quyen);
r = c.__goi('dangKyCom', tCN, '2026-10-13', true); ok(r.ok && r.an === 1, 'công nhân bấm Ăn', r);
r = c.__goi('dangKyCom', tCN, '2026-10-13', false); ok(r.ok && r.an === 0 && /không ăn/.test(r.msg), 'đổi sang Không ăn trước hạn', r);
ok(c.__sheets.DangKyCom.rows.filter(x => String(x[1]).toLowerCase() === String(cn.TenDangNhap).toLowerCase()).length === 1, 'đổi ý không sinh dòng trùng');
c.__goi('dangKyCom', tCN2, '2026-10-13', true); c.__goi('dangKyCom', tTP, '2026-10-13', true); c.__goi('dangKyCom', tO, '2026-10-13', true); c.__goi('dangKyCom', tCN3, '2026-10-13', false);
r = c.__goi('dangKyCom', tB, '2026-10-13', true); ok(!r.ok && /bếp/i.test(r.msg), 'tài khoản bếp không đăng ký suất ăn', r.msg);
r = c.__goi('dangKyCom', tCN, '2026-10-20', true); ok(!r.ok && /chưa báo thực đơn/.test(r.msg), 'ngày chưa có thực đơn thì không đăng ký được', r.msg);
r = c.__goi('napComTrua', tCN); ok(r.cuaToi['2026-10-13'] === 0, 'trang của tôi hiện đúng lựa chọn (Không ăn)', r.cuaToi);

console.log('\n3. Tổng hợp gửi bếp');
r = c.__goi('napComTrua', tB);
let th = r.tongHop.find(x => x.ngay === '2026-10-13');
ok(r.quyen.xem && r.quyen.sua && th && th.an === 3 && th.khong === 2 && th.an + th.khong + th.chua === soNguoi, 'bếp: 3 ăn, 2 không ăn, còn lại chưa đăng ký (tổng = ' + soNguoi + ' tài khoản đang dùng, đã bỏ người nghỉ việc và tài khoản bếp)', th && [th.an, th.khong, th.chua]);
th = c.__goi('napComTrua', tO).tongHop.find(x => x.ngay === '2026-10-13');   // ban điều hành: có tên
const xTP = th.xuong.find(x => x.mx === tp.MaXuong), xVP = th.xuong.find(x => x.mx === 'VP');
ok(xTP && xTP.an === 2 && xTP.dsAn.length === 2, 'ban điều hành: xưởng của trưởng phòng 2 suất, có tên', xTP);
ok(xVP && xVP.an === 1 && !(xVP.dsAn || []).concat(xVP.dsKhong || [], xVP.dsChua || []).includes('Bếp ăn') && th.xuong[th.xuong.length - 1].mx === 'VP', 'tài khoản không gắn xưởng gom vào "Văn phòng / khác" (cuối bảng)', xVP);
r = c.__goi('napComTrua', tTP); th = r.tongHop.find(x => x.ngay === '2026-10-13');
ok(r.quyen.xem && !r.quyen.sua && th.xuong.length > 1 && th.xuong.every(x => x.mx === tp.MaXuong ? Array.isArray(x.dsAn) : x.dsAn === undefined), 'trưởng phòng: thấy số mọi xưởng, tên chỉ xưởng mình');
const khongTP = th.dsKhongCT;
r = c.__goi('napComTrua', tO); th = r.tongHop.find(x => x.ngay === '2026-10-13');
ok(th.xuong.every(x => Array.isArray(x.dsChua)), 'ban điều hành: thấy tên mọi xưởng');
{ const rb = c.__goi('napComTrua', tB), tb = rb.tongHop.find(x => x.ngay === '2026-10-13');
  ok(tb.xuong.every(x => x.dsAn === undefined && x.dsKhong === undefined) && !tb.dsKhongCT.length && !tb.dsMuon.length && tb.an === 3 && tb.xuong.length > 1,
    'bếp: chỉ thấy số suất từng xưởng + tổng, không có họ tên / mã NV', tb.dsKhongCT); }
const cnK = th.dsKhongCT.find(x => x.ten === cn.HoTen);
ok(th.dsKhongCT.length === 2 && cnK && cnK.ma === String(cn.MaNV) && cnK.xuong === c.tenXuong_(cn.MaXuong) && th.dsKhongCT.some(x => x.ten === cn3.HoTen) && !th.dsKhongCT.some(x => x.ten === 'Bếp ăn'),
  'ban điều hành: danh sách không ăn đủ họ tên, mã NV, xưởng', th.dsKhongCT);
ok(Array.isArray(khongTP) && khongTP.every(x => x.mx === tp.MaXuong), 'trưởng phòng: danh sách không ăn chỉ xưởng mình', khongTP);
r = c.__goi('napComTrua', tCN); ok(!r.tongHop.length, 'công nhân không nhận danh sách không ăn');

console.log('\n4. 16:00 hôm trước chỉ là giờ nhắc');
c.__datGio('2026-10-12T15:59:00+07:00'); ok(c.__goi('dangKyCom', tCN, '2026-10-13', true).ok, '15:59 vẫn đổi được');
c.__datGio('2026-10-12T17:20:00+07:00'); r = c.__goi('dangKyCom', tCN, '2026-10-13', false);
ok(r.ok, 'quá 16:00 vẫn đăng ký / đổi được (16:00 chỉ là giờ nhắc)', r.msg);
const muonTk = tk(x => vt('CN')(x) && x.MaXuong === tp.MaXuong && x.TenDangNhap !== cn2.TenDangNhap);
c.__datGio('2026-10-13T07:45:00+07:00'); r = c.__goi('dangKyCom', P(muonTk), '2026-10-13', true);
ok(r.ok, 'sáng ngày ăn người quên vẫn đăng ký được', r.msg);
r = c.__goi('napComTrua', tO); th = r.tongHop.find(x => x.ngay === '2026-10-13');
ok(th.muon === 2 && th.muonAn === 1 && th.dsMuon.length === 2 && th.dsMuon.every(m => m.luc >= '2026-10-12 16:00' && 'ma' in m && m.xuong),
  'ban điều hành: tổng hợp ghi rõ 2 người đăng ký sau giờ nhắc (1 ăn), có giờ, mã NV, xưởng', th && th.dsMuon);
r = c.__goi('napComTrua', tTP); th = r.tongHop.find(x => x.ngay === '2026-10-13');
ok(th.muon === 2 && th.dsMuon.length === 1 && th.dsMuon[0].mx === tp.MaXuong, 'trưởng phòng: thấy số đăng ký muộn, tên chỉ xưởng mình', th.dsMuon);
c.__datGio('2026-10-14T09:00:00+07:00'); r = c.__goi('dangKyCom', tCN, '2026-10-13', true);
ok(!r.ok && /đã qua/.test(r.msg), 'ngày ăn đã qua thì không đăng ký được nữa', r.msg);
c.__datGio('2026-10-12T16:00:00+07:00');
ok(c.__goi('dangKyCom', tCN, '2026-10-14', false).ok, 'ngày 14/10 vẫn đăng ký được (hạn 16:00 ngày 13)');
r = c.__goi('napComTrua', tCN); ok(!r.thucDon.find(t => t.ngay === '2026-10-13').conHan && r.thucDon.find(t => t.ngay === '2026-10-14').conHan, 'trang báo đúng ngày nào còn hạn');
r = c.__goi('xoaThucDon', tCN, '2026-10-14'); ok(!r.ok, 'công nhân không xóa được thực đơn');

ok(c.dauCot_('DangKyCom').slice(0, 2).join() === 'Ngay,TenDangNhap', 'sheet DangKyCom trống trơn: tự ghi dòng tiêu đề', c.dauCot_('DangKyCom'));
console.log('\n4b. Trưởng / phó phòng đăng ký hộ');
c.__datGio('2026-10-13T08:00:00+07:00');
r = c.__goi('dangKyComHo', tCN, '2026-10-14', [cn2.TenDangNhap], true); ok(!r.ok && /trưởng/.test(r.msg), 'công nhân không đăng ký hộ được', r.msg);
r = c.__goi('dangKyComHo', tTP, '2026-10-14', [cn.TenDangNhap], true); ok(!r.ok && /xưởng của bạn/.test(r.msg), 'trưởng phòng không đăng ký hộ người xưởng khác', r.msg);
r = c.__goi('dangKyComHo', tTP, '2026-10-14', [cn2.TenDangNhap], true); ok(r.ok && r.so === 1 && /đăng ký hộ/.test(r.msg), 'trưởng phòng đăng ký hộ người trong xưởng', r.msg);
r = c.__goi('napComTrua', tCN2); ok(r.cuaToi['2026-10-14'] === 1 && r.cuaToiHo['2026-10-14'] === tp.HoTen, 'người được đăng ký hộ thấy tên trưởng phòng', [r.cuaToi, r.cuaToiHo]);
r = c.__goi('dangKyCom', tCN2, '2026-10-14', false); r = c.__goi('napComTrua', tCN2); ok(r.cuaToi['2026-10-14'] === 0 && !r.cuaToiHo['2026-10-14'], 'tự đổi lại được, mất dấu "đăng ký hộ"', [r.cuaToi, r.cuaToiHo]);
r = c.__goi('napComTrua', tTP);
const dsHo = r.hoNguoi || [];
ok(r.quyen.ho && dsHo.length > 1 && dsHo.every(x => c.doc_('TaiKhoan').find(t => t.TenDangNhap.toLowerCase() === x.tk).MaXuong === tp.MaXuong) && !dsHo.some(x => x.tk === tp.TenDangNhap.toLowerCase()) && r.hoDK['2026-10-14'],
  'trưởng phòng nhận danh sách người trong xưởng (trừ chính mình) + trạng thái từng ngày', dsHo.length);
const chuaDK = dsHo.filter(x => !r.hoDK['2026-10-14'][x.tk]).map(x => x.tk);
r = c.__goi('dangKyComHo', tTP, '2026-10-14', chuaDK, true); ok(r.ok && r.so === chuaDK.length, 'đăng ký ăn cho tất cả người chưa đăng ký một lần', r.msg);
r = c.__goi('napComTrua', tTP); ok(dsHo.every(x => r.hoDK['2026-10-14'][x.tk]), 'sau đó cả xưởng đã có lựa chọn');
ok(!c.__goi('napComTrua', tCN).quyen.ho, 'công nhân không có mục đăng ký hộ');
{ const rO = c.__goi('napComTrua', tO), tkX = x => c.doc_('TaiKhoan').find(t => t.TenDangNhap.toLowerCase() === x.tk);
  ok(rO.hoNguoi.length > 0 && rO.hoNguoi.every(x => !String(tkX(x).MaXuong || '').trim()), 'ban điều hành: danh sách đăng ký hộ chỉ gồm người khối văn phòng (không gắn xưởng)', rO.hoNguoi.length);
  const rr = c.__goi('dangKyComHo', tO, '2026-10-14', [cn.TenDangNhap], true); ok(!rr.ok && /văn phòng/.test(rr.msg), 'ban điều hành không đăng ký hộ được công nhân xưởng', rr.msg); }
ok(c.dauCot_('DangKyCom').includes('DangKyHo'), 'sheet DangKyCom có cột DangKyHo');
// trả dữ liệu ngày 14 về như trước phần này để các bước sau tính đúng
{ const bo = new Set(chuaDK.concat([cn2.TenDangNhap.toLowerCase()]));
  c.xoaNhieuDong_('DangKyCom', c.doc_('DangKyCom').filter(x => String(x.Ngay).replace(/^'/, '').slice(0, 10) === '2026-10-14' && bo.has(String(x.TenDangNhap).toLowerCase())).map(x => x._row)); }

console.log('\n5. Vai trò BEP');
r = c.__goi('napDuLieu', tB);
ok(r.ok && r.me.vaiTro === 'BEP' && !r.nhansu.length && !r.nhatky.length && r.phongban.length > 0, 'bếp không nhận dữ liệu sản xuất / nhân sự', r.ok && [r.nhansu.length, r.nhatky.length]);
r = c.__goi('napComTrua', tB); ok(r.quyen.dangKy === false && r.quyen.sua && r.quyen.xem, 'bếp: báo thực đơn + xem tổng hợp, không có quyền đăng ký', r.quyen);
ok(!c.__goi('layBaoCaoThang', tB, '2026-09', '', 'html').ok, 'bếp không tải được báo cáo KPI');

console.log('\n6. Sang tháng: tổng kết, lưu Drive, xóa dữ liệu tháng cũ');
c.__datGio('2026-10-31T10:00:00+07:00');
c.__goi('luuThucDon', tB, '2026-11-02', 'Cơm, thịt kho trứng', ''); c.__goi('dangKyCom', tCN, '2026-11-02', true);
c.__datGio('2026-11-04T23:00:00+07:00');
const tc = c.__goi('comTongKetThang_', '2026-10');
const folder = c.DriveApp.__thuMuc.find(f => f.ten === 'Báo cáo KPI hằng tháng');
const sub = folder && folder.con.find(f => f.ten === '2026-10');
ok(tc && /spreadsheets/.test(tc.tep) && sub && sub.tep.length === 1, 'tạo file "Đăng ký cơm trưa 2026-10" trong thư mục báo cáo tháng trên Drive', tc);
const bt = c.__bangMoi && c.__bangMoi[0];
const ct = bt && bt.ds.find(s => s.ten === 'Chi tiết từng người');
ok(bt && bt.ten === 'Đăng ký cơm trưa 2026-10' && ct && ct.rows.length - 1 === soNguoi * 2, 'file có tổng hợp + chi tiết từng người × 2 ngày + thực đơn', bt && bt.ds.map(s => [s.ten, s.rows.length]));
ok(ct && ct.rows[0].join() === 'Ngày,Xưởng,Họ tên,Mã NV,Đăng ký' && ct.rows.some(x => x[4] === 'Ăn') && ct.rows.some(x => x[4] === 'Không ăn' && x[3]) && ct.rows.some(x => x[4] === 'Chưa đăng ký'), 'chi tiết có cột Mã NV, ghi rõ Ăn / Không ăn / Chưa đăng ký');
const sat = c.doc_('SuatAnThang');
ok(sat.length > 1 && sat.reduce((s, x) => s + Number(x.SuatAn), 0) === 4, 'SuatAnThang: tổng 4 suất tháng 10 (ngày 13: 4 người ăn; ngày 14: chỉ 1 người báo không ăn)', sat.map(x => [x.MaXuong, x.SuatAn, x.KhongAn]));
const dk = c.doc_('DangKyCom').map(x => String(x.Ngay)), tdn = c.doc_('ThucDon').map(x => String(x.Ngay));
ok(!dk.some(n => /2026-10/.test(n)) && dk.some(n => /2026-11-02/.test(n)) && !tdn.some(n => /2026-10/.test(n)) && tdn.some(n => /2026-11/.test(n)), 'xóa đăng ký + thực đơn tháng 10, giữ tháng 11', [dk, tdn]);
ok(c.__goi('comTongKetThang_', '2026-10').boQua, 'chạy lại không làm gì thêm');

console.log('\n7. Báo cáo tháng có mục Suất ăn trưa');
const html = c.__goi('layBaoCaoThang', tO, '2026-10', '', 'html').html || '';
ok(/Suất ăn trưa/.test(html) && /Toàn nhà máy/.test(html), 'báo cáo toàn nhà máy có bảng suất ăn theo xưởng');
const hx = c.__goi('layBaoCaoThang', tTP, '2026-10', '', 'html').html || '';
ok(/Suất ăn trưa/.test(hx), 'báo cáo xưởng có dòng suất ăn của xưởng');
ok(/comTongKetThang_\(kyCu\)/.test(fs.readFileSync(MOI, 'utf8')), 'chốt tháng tự động gọi tổng kết cơm trưa trước khi gửi báo cáo');

console.log('\n' + (loi ? '✗ ' : '✓ ') + (dem - loi) + '/' + dem + ' đạt');
process.exit(loi ? 1 : 0);
