/** Kiểm thử 21/11 – KPI MỚI từ tháng 11/2026 (tests/kpi-moi/va-kpi-moi.py): bỏ học việc, chuyên cần theo chấm công,
 *  ngày công tối thiểu, bỏ ngày trước khi vào làm / sau khi nghỉ việc, vận hành TP/PP theo tỷ lệ; tháng cũ giữ cách cũ.
 *   DATA=<csdl.json số thật> TZ=Asia/Ho_Chi_Minh node kpi-app/tests/kpi-moi.js */
const path = require('path'), fs = require('fs'); const G = require('./gia-lap-kpi.js');
let n = 0, l = 0; const ok = (c, t, x) => { n++; if (!c) l++; console.log((c ? '  ✓ ' : '  ✗ ') + t + (c ? '' : ' → ' + String(JSON.stringify(x)).slice(0, 400))); };
const du = JSON.parse(fs.readFileSync(process.env.DATA, 'utf8'));
const c = G.tao(path.join(__dirname, '..', 'Code.gs'), du, '2026-11-21T18:00:00+07:00');
c.PropertiesService.getScriptProperties().setProperty('KPI_MOC_LUU_TRU', '2026-10');
const T11 = '2026-11', T10 = '2026-10';
let dt = c.docDuLieuKPI_(false);
const dangLam = dt.nhansu.filter(x => String(x.TrangThai).trim() !== 'Nghỉ việc' && !/TP|PP|OWNER|GD|BH/.test(String(x.VaiTro || '')));
const coNK = ma => dt.nhatky.filter(r => String(r.MaNV).trim() === ma && c.ngayVN_(r.Ngay).slice(0, 7) === T11).map(r => c.ngayVN_(r.Ngay));
const mau = dangLam.map(x => String(x.MaNV).trim()).find(m => new Set(coNK(m)).size >= 10);

console.log('\n1. Bỏ học việc từ T11 – tháng cũ không đổi');
ok(dangLam.every(x => !c.laHocViecThang_(x.MaNV, T11)), 'T11: không ai là học việc (' + dangLam.length + ' người đang làm)');
const hv10 = dangLam.filter(x => c.laHocViecThang_(x.MaNV, T10)).length;
ok(c.laHocViecThang_.toString().includes('KPI_MOI_TU') && hv10 >= 0, 'T10 vẫn dùng quy tắc học việc cũ (' + hv10 + ' người học việc T10)');
ok(c.loaiCo_(mau, T10, 91) === 'A+' && c.loaiCo_(mau, T10, 60) === 'D', 'T10: loại theo điểm như cũ (91 → A+, 60 → D)');

console.log('\n2. Chuyên cần theo chấm công (người mẫu ' + mau + ')');
const k0 = c.kpiThang_(mau, T11, dt);
ok(k0 && k0.cong && k0.cong.lv >= 10, 'T11 có đếm công: ' + JSON.stringify(k0.cong));
const ngay = [...new Set(coNK(mau))].sort();
const datCC = (kh) => { dt.idxCC = dt.idxCC || {}; Object.keys(kh).forEach(i => { dt.idxCC[mau + '|' + ngay[i]] = kh[i]; }); };
const xoaCC = () => ngay.forEach(d => { delete dt.idxCC[mau + '|' + d]; });
xoaCC(); const kGoc = c.kpiThang_(mau, T11, dt);
datCC({ 0: 'Nkp' }); let k = c.kpiThang_(mau, T11, dt);
ok(Math.abs((kGoc.tt - k.tt) - 15) < 0.01 || k.tt === 0, '1 ngày Nkp → Tuân thủ −15 (' + kGoc.tt + ' → ' + k.tt + ')', [kGoc.tt, k.tt]);
xoaCC(); datCC({ 0: 'Nkl', 1: 'Nkl' }); k = c.kpiThang_(mau, T11, dt);
ok(Math.abs(k.tt - kGoc.tt) < 0.01, '2 ngày Nkl đầu tiên → không trừ', [kGoc.tt, k.tt]);
xoaCC(); datCC({ 0: 'Nkl', 1: 'Nkl', 2: 'KLD' }); k = c.kpiThang_(mau, T11, dt);
ok(Math.abs((kGoc.tt - k.tt) - 5) < 0.01, 'ngày không lương thứ 3 → −5', [kGoc.tt, k.tt]);
xoaCC(); datCC({ 0: 'x-1', 1: 'x-1.5' }); k = c.kpiThang_(mau, T11, dt);
ok(Math.abs((kGoc.tt - k.tt) - 4) < 0.01 && k.cong.muon === 2, '2 lần đi muộn → −4', [kGoc.tt, k.tt, k.cong]);
xoaCC(); datCC({ 0: 'P', 1: 'NL', 2: 'TS' }); k = c.kpiThang_(mau, T11, dt);
ok(Math.abs(k.tt - kGoc.tt) < 0.01 && k.cong.lv === kGoc.cong.lv - 3, 'phép / lễ / thai sản → không trừ, không tính vào ngày phải làm (' + kGoc.cong.lv + ' → ' + k.cong.lv + ')', [k.tt, k.cong]);

console.log('\n3. Ngày công tối thiểu');
xoaCC(); k = c.kpiThang_(mau, T11, dt);
ok(c.loaiCo_(mau, T11, 91) === 'A+', 'đủ công: 91 điểm → A+');
const lv = kGoc.cong.lv, nghi = Math.ceil(lv * 0.3); const kh = {}; for (let i = 0; i < nghi; i++) kh[i] = 'Nkl';
datCC(kh); k = c.kpiThang_(mau, T11, dt);
ok(k.cong.cong / k.cong.lv < 0.8 && k.cong.cong / k.cong.lv >= 0.5 && c.loaiCo_(mau, T11, 91) === 'A', 'đi ' + k.cong.cong + '/' + k.cong.lv + ' ngày (50–80%) → hạ 1 bậc: 91 → A', [k.cong, c.loaiCo_(mau, T11, 91)]);
ok(c.loaiCo_(mau, T11, 60) === 'D', 'đã là D thì vẫn D');
xoaCC(); const kh2 = {}; for (let i = 0; i < Math.ceil(lv * 0.6); i++) kh2[i] = 'Nkp';
datCC(kh2); k = c.kpiThang_(mau, T11, dt);
ok(c.loaiCo_(mau, T11, 99) === 'Thiếu công' && c.kmThieuCong_(mau, T11), 'đi < 50% → "Thiếu công", không xếp loại', [k.cong, c.loaiCo_(mau, T11, 99)]);
ok(!c.kmThieuCong_(mau, T10), 'tháng cũ không có "Thiếu công"');
xoaCC(); c.kpiThang_(mau, T11, dt);

console.log('\n4. Ngày trước khi vào làm / sau khi nghỉ việc không tính');
const ns = c.ss_().getSheetByName('NhanSu'), H = ns.rows[0], iM = H.indexOf('MaNV'), iV = H.indexOf('NgayVaoLam');
const dong = ns.rows.findIndex((r, i) => i && String(r[iM]).trim() === mau), cuV = ns.rows[dong][iV];
ns.rows[dong][iV] = ngay[3]; c.xoaCache_('NhanSu'); c.__NGAY_VAO = null;
const kVao = c.kpiThang_(mau, T11, dt);
ok(c.ngayVaoLam_(mau) === ngay[3] && kVao.cong.lv === kGoc.cong.lv - 3, 'vào làm ' + ngay[3] + ' → ngày phải làm ' + kGoc.cong.lv + ' → ' + kVao.cong.lv + ' (không bị tính "có mặt, SL 0" trước đó)', [c.ngayVaoLam_(mau), kVao.cong]);
ns.rows[dong][iV] = cuV; c.xoaCache_('NhanSu'); c.__NGAY_VAO = null;
const nghi1 = dt.nhansuTatCa.find(x => String(x.TrangThai).trim() === 'Nghỉ việc' && coNK(String(x.MaNV).trim()).length);
if (nghi1) { const m = String(nghi1.MaNV).trim(), cuoi = c.kmCuoiLam_(m, dt), kq = c.kpiThang_(m, T11, dt);
  ok(cuoi && cuoi === coNK(m).sort().pop() && kq.cong.lv <= 13, 'người đã nghỉ ' + m + ': chỉ tính đến ngày cuối có nhật ký ' + cuoi + ' (' + kq.cong.lv + ' ngày)', [cuoi, kq.cong]); }
ok(c.kmCuoiLam_(mau, dt) === '', 'người đang làm: không cắt ngày cuối');

console.log('\n5. Vận hành TP/PP theo tỷ lệ (T11), T10 như cũ');
const TK = c.doc_('TaiKhoan'), own = c.__phienDai(TK.find(t => String(t.VaiTro).trim() === 'OWNER'));
const q11 = c.__goi('layKPIQuanLy', own, T11), q10 = c.__goi('layKPIQuanLy', own, T10);
ok(q11.ok && q11.ds.length > 10 && q11.ds.every(o => o.vanHanh >= 0 && o.vanHanh <= 100), 'T11: ' + q11.ds.length + ' TP/PP, vận hành 0–100', q11.msg);
const vh = {}; q11.ds.forEach(o => { vh[o.maXuong] = Math.round(o.vanHanh * 10) / 10; });
ok(Object.values(vh).filter(v => v < 50).length === 0, 'T11 không xưởng nào bị trừ về gần 0 vì đông người: ' + JSON.stringify(vh), vh);
ok(q10.ok && q10.ds.some(o => o.vanHanh < 50), 'T10 giữ cách cũ (có xưởng vận hành < 50 do trừ theo lượt)', q10.ds.map(o => o.vanHanh));

console.log('\n6. Bảng KPI tháng 11 qua hàm web');
const r = c.__goi('layKPIKy', own, 'thang', T11, '');
const ds = (r && (r.ds || r.danhSach || r.rows)) || [];
ok(r && r.ok !== false && ds.length > 50, 'layKPIKy T11: ' + ds.length + ' dòng', r && r.msg);
ok(!ds.some(o => String(o.loai || o.Loai) === 'Học việc'), 'không còn dòng "Học việc"');

console.log('\n7. Chốt T11 → loại đã hạ bậc / Thiếu công được giữ khi đọc lại');
xoaCC(); const kh3 = {}; for (let i = 0; i < Math.ceil(lv * 0.6); i++) kh3[i] = 'Nkp';
const cc0 = c.docDuLieuKPI_; c.docDuLieuKPI_ = function () { const d = cc0.apply(this, arguments); d.idxCC = d.idxCC || {}; Object.keys(kh3).forEach(i => { d.idxCC[mau + '|' + ngay[i]] = kh3[i]; }); return d; };
let rc = c.__goi('chotThang', own, T11); ok(rc && rc.ok, 'chốt T11: ' + (rc && rc.msg), rc);
const dongK = c.doc_('KPIThang').find(x => c.chuanKy_(x.Ky) === T11 && String(x.MaNV).trim() === mau);
ok(dongK && dongK.Loai === 'Thiếu công', 'KPIThang lưu ' + mau + ' = "Thiếu công"', dongK);
Object.keys(c.__KCONG).forEach(k2 => delete c.__KCONG[k2]); c.__KM_CHOT = null; c.docDuLieuKPI_ = cc0;
ok(c.loaiCo_(mau, T11, Number(dongK.TongKPI)) === 'Thiếu công' && c.kmThieuCong_(mau, T11), 'đọc lại sau chốt (không tính lại công) → vẫn "Thiếu công", không xếp hạng');

console.log('\n' + (n - l) + '/' + n + ' đạt'); process.exit(l ? 1 : 0);
