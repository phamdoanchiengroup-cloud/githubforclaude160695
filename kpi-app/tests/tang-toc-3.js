/**
 * Kiểm thử tăng tốc đợt 3 (08/11): bộ nhớ đệm nhật ký dùng chung, bộ đo tốc độ, khóa bản lưu trên máy, doGet trả thẳng file.
 *   DATA=<csdl.json> TZ=Asia/Ho_Chi_Minh node kpi-app/tests/tang-toc-3.js
 */
const path = require('path'), fs = require('fs');
const G = require('./gia-lap-kpi.js');
const DATA = process.env.DATA; if (!DATA) { console.log('Cần DATA='); process.exit(1); }
let dem = 0, loi = 0; const ok = (d, t, c) => { dem++; if (d) console.log('  ✓ ' + t); else { loi++; console.log('  ✗ ' + t + (c !== undefined ? '  → ' + JSON.stringify(c).slice(0, 300) : '')); } };
const du = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const iDoi = du.TaiKhoan[0].indexOf('DoiMatKhauLanDau'); du.TaiKhoan.slice(1).forEach(x => { x[iDoi] = 'Không'; });
const c = G.tao(path.join(__dirname, '..', 'Code.gs'), du, '2026-11-09T09:00:00+07:00');
const TK = c.doc_('TaiKhoan').filter(t => t.TrangThai === 'Đang dùng'), vt = v => TK.find(t => String(t.VaiTro).trim() === v);
const Town = c.__phienDai(vt('OWNER')), Tadm = c.__phienDai(vt('ADMIN'));
const bo = o => JSON.stringify(o, (k, v) => k === '__ms' || k === 'tuBoNho' ? undefined : v);
const tatNK = r => (r.nhatky || []).concat(r.choDuyet || []);
const doc = (ten, ...a) => { const t = c.__thongKe; t.o = 0; t.doc = 0; const r = c.__goi(ten, ...a); return [r, t.o || 0]; };
const nkO = c.__sheets.NhatKySanXuat.rows.length * c.__sheets.NhatKySanXuat.rows[0].length;

console.log('\n1. Nhật ký dùng chung giữa các lượt gọi');
c.__goi('XOA_BO_NHO_TAM');
const [a1, o1] = doc('napDuLieu', Tadm), [a2, o2] = doc('napDuLieu', Tadm);
ok(a1 && a1.ok && bo(a1) === bo(a2), 'lượt 2 trả y hệt lượt 1');
ok(o1 - o2 >= nkO * 0.95, 'lượt 2 không đọc lại sheet nhật ký (' + Math.round(o1 / 1000) + 'k → ' + Math.round(o2 / 1000) + 'k ô)', [o1, o2, nkO]);
const [k1] = doc('layKPIKy', Town, 'thang', '2026-10', ''); c.__goi('XOA_BO_NHO_TAM'); c.__cache && Object.keys(c.__cache).filter(k => /^NKD3/.test(k)).forEach(k => delete c.__cache[k]);
const [k2] = doc('layKPIKy', Town, 'thang', '2026-10', ''); const [k3, o3] = doc('layKPIKy', Town, 'thang', '2026-10', '');
if (bo(k1) !== bo(k3)) { const A = bo(k1), B = bo(k3); let i = 0; while (A[i] === B[i]) i++; console.log('    khác ở:', A.slice(i - 80, i + 80), '\n           ', B.slice(i - 80, i + 80)); }
ok(bo(k1) === bo(k2) && bo(k2) === bo(k3), 'Bảng KPI tính từ bản nhớ (ngày tháng khôi phục đúng kiểu Date) = tính từ sheet');
const ngD = c.doc_('NhatKySanXuat');
ok(Object.prototype.toString.call(ngD.find(r => r.Ngay).Ngay) === '[object Date]' && ngD.every(r => r._row >= 2), 'dòng nhớ giữ ngày dạng Date và số dòng _row');

console.log('\n2. Có người ghi → bỏ bản nhớ ngay');
const cn = TK.find(t => String(t.VaiTro).trim() === 'CN' && t.MaNV), tCN = c.__phienDai(cn);
const ns = c.doc_('NhanSu').find(x => x.MaNV === cn.MaNV) || {}, cd = c.doc_('CongDoan').filter(x => x.MaXuong === (cn.MaXuong || ns.MaXuong) && x.TrangThai !== 'Ngừng')[0];
const truoc = tatNK(c.__goi('napDuLieu', Tadm)).length;
const g = c.__goi('congNhanGuiSanLuong', tCN, [{ Ngay: '2026-11-09', MaCD: cd.MaCD, GioLam: 8, SoLuongLamRa: 7, SoLoi: 0, GhiChu: 'thử tăng tốc' }]);
const sau = tatNK(c.__goi('napDuLieu', Tadm));
ok(g && g.ok && sau.length === truoc + 1 && sau.some(r => r.GhiChu === 'thử tăng tốc'), 'công nhân gửi sản lượng → lượt đọc sau thấy dòng mới', [g && g.msg, truoc, sau.length]);

console.log('\n3. Sửa tay trong Sheet: lượt ghi (giữ khóa) luôn đọc thẳng sheet');
c.__goi('napDuLieu', Tadm);   // bản nhớ mới
const rows = c.__sheets.NhatKySanXuat.rows, iGC = rows[0].indexOf('GhiChu'), iNg = rows[0].indexOf('Ngay'), cuoi = rows.slice(1).reverse().find(x => /2026-11-0/.test(c.ngayVN_(x[iNg]))), gcCu = cuoi[iGC];
cuoi[iGC] = 'SUA-TAY';   // sửa thẳng trong Sheet, không qua web
ok(!tatNK(c.__goi('napDuLieu', Tadm)).some(r => r.GhiChu === 'SUA-TAY'), 'lượt chỉ đọc: còn bản nhớ ≤ 10 phút (như bộ nhớ tạm KPI cũ)');
const docKhoa = c.__goi('XOA_BO_NHO_TAM') || 1; vmRun = null;
ok(tatNK(c.__goi('napDuLieu', Tadm)).some(r => r.GhiChu === 'SUA-TAY'), 'chạy XOA_BO_NHO_TAM → thấy ngay');
cuoi[iGC] = gcCu; c.__goi('XOA_BO_NHO_TAM');
c.__goi('napDuLieu', Tadm); cuoi[iGC] = 'SUA-TAY-2';
const cn2 = TK.find(t => String(t.VaiTro).trim() === 'CN' && t.MaNV && t.MaNV !== cn.MaNV && t.MaXuong === cn.MaXuong) || TK.find(t => String(t.VaiTro).trim() === 'CN' && t.MaNV && t.MaNV !== cn.MaNV);
const ns2 = c.doc_('NhanSu').find(x => x.MaNV === cn2.MaNV) || {}, cd2 = c.doc_('CongDoan').filter(x => x.MaXuong === (cn2.MaXuong || ns2.MaXuong) && x.TrangThai !== 'Ngừng')[0];
const thuKhoa = c.__goi('congNhanGuiSanLuong', c.__phienDai(cn2), [{ Ngay: '2026-11-09', MaCD: cd2.MaCD, GioLam: 1, SoLuongLamRa: 1, SoLoi: 0, GhiChu: 'lần 2' }]);
ok(thuKhoa && thuKhoa.ok && c.__sheets.NhatKySanXuat.rows.some(r => r[iGC] === 'SUA-TAY-2') && tatNK(c.__goi('napDuLieu', Tadm)).some(r => r.GhiChu === 'SUA-TAY-2'), 'lượt ghi đọc thẳng sheet, không ghi đè sửa tay; sau đó bản nhớ mới');

console.log('\n4. Bộ đo tốc độ');
let r = c.__goi('layKPIKy', Town, 'thang', '2026-10', '');
ok(typeof r.__ms === 'number' && r.__ms >= 0, 'kết quả có __ms (thời gian máy chủ chạy)', r.__ms);
ok(typeof JSON.parse(c.__goiTho('napDuLieu', Tadm)).__ms === 'number', 'gói đăng nhập có __ms');
c.__goi('ghiTocDo', Tadm, [{ f: 'napDuLieu', ms: 1800, sv: 900 }, { f: 'napDuLieu', ms: 6200, sv: 3100 }, { f: 'layKPIKy', ms: 400 }, { f: 'x;bad', ms: 5 }, { f: 'trang', ms: -3 }, 'rác']);
c.__goi('ghiTocDo', Town, [{ f: 'vaoApp', ms: 2500 }]);
r = c.__goi('layTocDo', Town, 7);
const hn = r.ngay[0] && r.ngay[0].o;
ok(r.ok && hn && hn.f.napDuLieu[0] === 2 && hn.f.napDuLieu[1] === 8000 && hn.f.napDuLieu[2] === 6200 && hn.f.napDuLieu[3] === 4000 && !hn.f['x;bad'] && !hn.f.trang, 'gộp đúng: lượt, tổng, chậm nhất, thời gian máy chủ; bỏ tên / số không hợp lệ', hn);
ok(hn.f.napDuLieu[5 + 2] === 1 && hn.f.napDuLieu[5 + 5] === 1 && hn.v['napDuLieu|ADMIN'] && hn.v['vaoApp|OWNER'], 'chia ngăn thời gian + theo vai trò', hn.v);
ok(c.__goi('layTocDo', Tadm).ok === false && c.__goi('ghiTocDo', 'sai-token', []).ok === false, 'chỉ chủ sở hữu xem; phiên sai không ghi được');

console.log('\n5. Khóa mã hóa bản lưu trên máy');
const k_1 = c.__goi('layKhoaLuu', Tadm), k_2 = c.__goi('layKhoaLuu', Tadm);
ok(k_1.ok && k_1.khoa.length >= 40 && k_1.khoa === k_2.khoa, 'mỗi tài khoản một khóa cố định');
ok(c.__goi('layKhoaLuu', Town).khoa !== k_1.khoa && c.__goi('layKhoaLuu', 'sai').ok === false, 'tài khoản khác khóa khác; phiên sai không lấy được');
const Tadm2 = c.__phienDai(vt('ADMIN')); c.__goi('dangXuat', Tadm2);
ok(c.__goi('layKhoaLuu', Tadm).khoa !== k_1.khoa, 'bấm Thoát → đổi khóa (bản lưu cũ trên máy không mở được)');

console.log('\n6. Trang chính');
ok(/createHtmlOutputFromFile\('Index'\)/.test(fs.readFileSync(path.join(__dirname, '..', 'Code.gs'), 'utf8')) && !/<\?/.test(fs.readFileSync(path.join(__dirname, '..', 'Index.html'), 'utf8')), 'doGet trả thẳng Index.html (Index không có mẫu <? ?>)');

console.log((loi ? '\n✗ ' : '\n✓ ') + (dem - loi) + '/' + dem + ' đạt');
process.exit(loi ? 1 : 0);
