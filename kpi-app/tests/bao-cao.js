/**
 * Kiểm tra báo cáo tháng (tests/bao-cao.gs, đã gộp vào Code.gs) trên dữ liệu thật — KHÔNG đưa file dữ liệu vào repo.
 *   DATA=/đường/dẫn/csdl.json [S=<thư mục lưu HTML/PDF xem thử>] node kpi-app/tests/bao-cao.js
 */
const path = require('path'), fs = require('fs');
const G = require('./gia-lap-kpi.js');
const MOI = path.join(__dirname, '..', 'Code.gs'), DATA = process.env.DATA, S = process.env.S;
if (!DATA) { console.log('Cần DATA=<file json dữ liệu>'); process.exit(1); }
const duLieu = () => JSON.parse(fs.readFileSync(DATA, 'utf8'));
let dem = 0, loi = 0;
const ok = (dk, ten, ct) => { dem++; if (dk) console.log('  ✓ ' + ten); else { loi++; console.log('  ✗ ' + ten + (ct !== undefined ? '  → ' + JSON.stringify(ct).slice(0, 300) : '')); } };
const tkTheo = (c, f) => c.doc_('TaiKhoan').filter(f)[0];
const phien = (c, tk) => c.taoPhien_(tk);
const chu = h => h.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ');

console.log('\n1. Quyền tải báo cáo');
const c = G.tao(MOI, duLieu(), '2026-10-05T10:00:00+07:00');
const owner = tkTheo(c, x => String(x.TenDangNhap).toLowerCase() === 'giamdoc');
const tp = tkTheo(c, x => String(x.VaiTro).trim() === 'TP' && x.MaXuong);
const cn = tkTheo(c, x => String(x.VaiTro).trim() === 'CN');
const tOwner = phien(c, owner), tTP = phien(c, tp), tCN = phien(c, cn);
let r = c.layBaoCaoThang(tCN, '2026-09', '', 'html');
ok(!r.ok && /Chỉ ban điều hành|hết hạn/.test(r.msg), 'công nhân không tải được (' + r.msg + ')', r.msg);
ok(!c.layBaoCaoThang(tOwner, '2026-13', '', 'html').ok && !c.layBaoCaoThang(tOwner, '2099-01', '', 'html').ok, 'tháng sai / tương lai bị chặn');
const khac = c.doc_('PhongBan').map(p => p.MaXuong).find(m => m !== tp.MaXuong);
r = c.layBaoCaoThang(tTP, '2026-09', khac, 'html');
const tenTP = c.tenXuong_(tp.MaXuong);
ok(r.ok && chu(r.html).indexOf('Báo cáo tháng') >= 0 && chu(r.html).indexOf(tenTP.replace(/^Xưởng\s*/i, '')) >= 0 && chu(r.html).indexOf('So sánh các xưởng') < 0, 'TP xin xưởng khác vẫn chỉ nhận báo cáo xưởng mình (' + tenTP + ')');
const html = c.layBaoCaoThang(tOwner, '2026-09', '', 'html').html;
ok(/So sánh các xưởng/.test(html) && /10 công nhân dẫn đầu/.test(html) && /KPI quản lý/.test(html), 'ban điều hành: báo cáo toàn nhà máy đủ các mục');
r = c.layBaoCaoThang(tOwner, '2026-09', '', 'pdf');
ok(r.ok && /^Bao-cao-KPI-2026-09-Toan-nha-may\.pdf$/.test(r.ten) && r.b64.length > 1000, 'tải PDF: có tên tệp và nội dung', r.ten);
r = c.layBaoCaoThang(tTP, '2026-09', '', 'pdf');
ok(r.ok && /^Bao-cao-KPI-2026-09-[A-Za-z-]+\.pdf$/.test(r.ten) && !/[^\x20-\x7e]/.test(r.ten), 'tên tệp xưởng không dấu: ' + r.ten);

console.log('\n2. Số liệu khớp với Bảng KPI trên web');
const du = c.bcDuLieu_('2026-09');
const web = c.layKPIKy(tOwner, 'thang', '2026-09', '');
ok(web.ok && web.ds.length === du.kpi.length, 'cùng số người có KPI (' + du.kpi.length + ')', [web.ds.length, du.kpi.length]);
const mapW = {}; web.ds.forEach(o => { mapW[o.MaNV] = o; });
const lech = du.kpi.filter(o => !mapW[o.MaNV] || Math.abs(mapW[o.MaNV].tong - o.tong) > 0.01 || mapW[o.MaNV].hang !== o.hang);
ok(!lech.length, 'KPI và hạng từng người trùng với bảng KPI', lech.slice(0, 3));
const t = c.bcTomTat_(du, '');
const tb = web.ds.reduce((s, o) => s + o.tong, 0) / web.ds.length;
ok(Math.abs(t.kpiTB - tb) < 0.01 && html.indexOf(c.bcSo_(tb, 1)) >= 0, 'KPI trung bình in trong báo cáo = trung bình bảng KPI (' + c.bcSo_(tb, 1) + ')');
const tongPL = Object.values(t.phanLoai).reduce((a, b) => a + b, 0);
ok(tongPL === t.soNguoi, 'phân loại A+..D cộng lại đủ số người');
const slTay = c.doc_('NhatKySanXuat').filter(x => String(x.TrangThai).trim() === 'Đã chốt' && c.ngayVN_(x.Ngay).slice(0, 7) === '2026-09').reduce((s, x) => s + (Number(x.SoLuongLamRa) || 0), 0);
ok(Math.abs(t.sl - slTay) < 0.01, 'tổng sản lượng = cộng tay nhật ký đã duyệt tháng 9 (' + c.bcSo_(slTay) + ')', [t.sl, slTay]);
ok(!du.duSo && /không so sánh/.test(chu(html)), 'tháng 8 quá ít dữ liệu: báo cáo ghi rõ không so sánh');
const xs = du.dsX.filter(m => c.bcTomTat_(du, m).soNguoi);
const cong = xs.reduce((s, m) => s + c.bcTomTat_(du, m).soNguoi, 0);
ok(cong === t.soNguoi, 'tổng số người các xưởng = toàn nhà máy');
ok(!/Xưởng Xưởng|NaN|undefined|null/.test(chu(html)), 'không có chữ lỗi (NaN, undefined, "Xưởng Xưởng")');
xs.forEach(m => { const h = c.bcHtmlXuong_(du, m); if (/NaN|undefined|Xưởng Xưởng/.test(chu(h))) ok(false, 'báo cáo xưởng ' + m + ' có chữ lỗi'); });
ok(true, 'đủ ' + xs.length + ' báo cáo xưởng dựng được, không chữ lỗi');

console.log('\n3. Gửi tự động khi chốt tháng');
const c2 = G.tao(MOI, duLieu(), '2026-10-03T23:00:00+07:00');
c2.TAO_SHEET_NGUOI_NHAN_BAO_CAO();
const shN = c2.SpreadsheetApp.getActiveSpreadsheet().getSheetByName('NguoiNhanBaoCao');
const mxA = xs[0];
shN.getRange(2, 1, 4, 3).setValues([['bgd@vidu.com', 'TOAN_NHA_MAY', ''], ['tp@vidu.com', mxA, ''], ['hr@vidu.com', 'TAT_CA', ''], ['sai-email', 'TOAN_NHA_MAY', '']]);
const nhan = c2.bcNguoiNhan_();
ok(nhan.tong.join() === 'bgd@vidu.com,hr@vidu.com' && nhan.xuong[mxA].join() === 'tp@vidu.com', 'đọc người nhận đúng, bỏ email sai', nhan);
c2.chotThangTuDong();
const thu = c2.__mail || [];
const thuTong = thu.find(m => /Báo cáo sản xuất & KPI tháng 9\/2026/.test(m.subject));
ok(thuTong && thuTong.to === 'bgd@vidu.com,hr@vidu.com' && thuTong.attachments.length === 1 && /Toan-nha-may/.test(thuTong.attachments[0].getName()), 'ngày làm việc thứ 3: chốt + gửi báo cáo toàn nhà máy kèm PDF', thu.map(m => m.subject));
ok(/đã chốt chính thức/.test(thuTong.htmlBody) && /đã chốt chính thức/.test(thuTong.attachments[0].__html), 'báo cáo gửi đi ghi "đã chốt chính thức"');
const thuX = thu.filter(m => / – /.test(m.subject));
ok(thuX.length === xs.length && thuX.find(m => m.to === 'tp@vidu.com,hr@vidu.com'), 'mỗi xưởng một email; TAT_CA nhận mọi xưởng', thuX.map(m => m.to));
const tm = c2.DriveApp.__thuMuc.find(x => x.ten === 'Báo cáo KPI hằng tháng'), tm9 = tm && tm.con.find(x => x.ten === '2026-09');
ok(tm9 && tm9.tep.filter(x => !x.rac).length === xs.length + 1, 'lưu ' + (xs.length + 1) + ' tệp PDF vào Drive / Báo cáo KPI hằng tháng / 2026-09');
c2.__mail = []; c2.GUI_BAO_CAO_THANG_TRUOC();
ok(tm9.tep.filter(x => !x.rac).length === xs.length + 1 && tm9.tep.filter(x => x.rac).length === xs.length + 1, 'gửi lại: tệp cũ vào thùng rác, không bị trùng');
const c3 = G.tao(MOI, duLieu(), '2026-10-02T23:00:00+07:00'); c3.chotThangTuDong();
ok(!(c3.__mail || []).length, 'chưa tới ngày làm việc thứ 3: không gửi');
const c4 = G.tao(MOI, duLieu(), '2026-10-03T23:00:00+07:00'); c4.chotThangTuDong();
ok(!(c4.__mail || []).length && c4.daChotChinhThuc_('2026-09'), 'chưa có ai trong danh sách nhận: vẫn chốt bình thường, không lỗi');

if (S) { fs.writeFileSync(path.join(S, 'bc-tong.html'), html); fs.writeFileSync(path.join(S, 'bc-xuong.html'), c.bcHtmlXuong_(du, xs[0])); console.log('\nĐã ghi HTML xem thử vào ' + S); }
console.log(`\n${dem - loi}/${dem} đạt`); process.exit(loi ? 1 : 0);
