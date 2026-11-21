/** Kiểm thử 21/11 – chốt KPI quản lý (TP/PP) + trần 150% công nhân / 130% xưởng (trước khi gắn quỹ thưởng).
 *   DATA=<csdl.json số thật> [SO=<ql2.json: kết quả hàm web cũ, A = như cũ, B = coi CN đã nghỉ là còn làm>] TZ=Asia/Ho_Chi_Minh node kpi-app/tests/kpi-ql.js */
const path = require('path'), fs = require('fs'); const G = require('./gia-lap-kpi.js');
let n = 0, l = 0; const ok = (c, t, x) => { n++; if (!c) l++; console.log((c ? '  ✓ ' : '  ✗ ') + t + (c ? '' : ' → ' + String(JSON.stringify(x)).slice(0, 400))); };
const du = JSON.parse(fs.readFileSync(process.env.DATA, 'utf8'));
const c = G.tao(path.join(__dirname, '..', 'Code.gs'), du, '2026-11-21T10:00:00+07:00');
c.PropertiesService.getScriptProperties().setProperty('KPI_MOC_LUU_TRU', '2026-10');
const TK = c.doc_('TaiKhoan'), own = c.__phienDai(TK.find(t => String(t.VaiTro).trim() === 'OWNER'));
const gd = c.__phienDai(TK.find(t => String(t.MaNV).trim().toUpperCase() === 'C019'));
const ql = ky => c.__goi('layKPIQuanLy', own, ky);
const SO = process.env.SO ? JSON.parse(fs.readFileSync(process.env.SO, 'utf8')) : null;

console.log('\n1. KPI quản lý tính cả công nhân đã nghỉ (trước khi chốt)');
for (const ky of ['2026-09', '2026-10']) {
  const r = ql(ky); ok(r.ok && r.ds.length > 20 && !r.daChot, ky + ': ' + r.ds.length + ' TP/PP, chưa chốt', r.msg);
  if (SO) { const A = {}; SO.A[ky].ds.forEach(o => { A[o.maNV] = o; });   // A = web cũ (chỉ CN còn làm hôm nay)
    const khac = r.ds.filter(o => A[o.maNV] && Math.abs(A[o.maNV].hieuSuatXuong - o.hieuSuatXuong) > 0.01).length;
    ok(khac > 0, ky + ': hiệu suất xưởng nay khác web cũ ở ' + khac + ' TP/PP (vì tính cả CN đã nghỉ có nhật ký trong tháng)', khac); }
  ok(r.ds.every(o => o.hieuSuatXuong <= 130), ky + ': mọi xưởng ≤ 130%', r.ds.map(o => o.hieuSuatXuong).filter(x => x > 130));
}
const uv10 = ql('2026-10').ds.find(o => o.maXuong === 'INUV');
ok(uv10 && Math.abs(uv10.tong - 90.73) < 0.1, 'In UV T10 = 90,7 (tính cả CN đã nghỉ; 21/11 tối: cách mới áp từ T9 – vận hành ×5)', uv10 && uv10.tong);

console.log('\n2. Chốt tháng → lưu KPI quản lý, không tự đổi nữa');
let r = c.__goi('chotThang', own, '2026-10'); ok(r.ok && /cho 16\d người/.test(r.msg), r.msg + ' (tháng 10 có 153 người lúc chốt cũ + 11 CN làm trong T10 nhưng nghỉ trước ngày chốt – trừ người không có nhật ký)', r);
const kq = c.doc_('KPIQuanLyThang').filter(x => c.chuanKy_(x.Ky) === '2026-10');
ok(kq.length === ql('2026-10').ds.length && kq.every(x => x.Loai && x.TongKPI !== ''), 'sheet KPIQuanLyThang: ' + kq.length + ' dòng T10 (điểm, loại, lúc chốt)', kq[0]);
const r1 = ql('2026-10'); ok(r1.daChot && r1.ds.every(o => o.daChot), 'web hiện "đã chốt" cho T10');
const ns = c.ss_().getSheetByName('NhanSu'), iTT = ns.rows[0].indexOf('TrangThai'), iX = ns.rows[0].indexOf('MaXuong'), iM = ns.rows[0].indexOf('MaNV');
const kThang = c.doc_('KPIThang').filter(x => c.chuanKy_(x.Ky) === '2026-10' && x.MaXuong === 'INUV').map(x => String(x.MaNV).trim());
ns.rows.forEach((row, i) => { if (i && kThang.includes(String(row[iM]).trim())) row[iTT] = 'Nghỉ việc'; }); c.xoaCache_('NhanSu');
const r2 = ql('2026-10'), uv2 = r2.ds.find(o => o.maXuong === 'INUV');
ok(uv2 && Math.abs(uv2.tong - uv10.tong) < 0.01, 'cho nghỉ hết CN In UV sau khi chốt → KPI quản lý T10 không đổi (' + (uv2 && uv2.tong) + ')', [uv2 && uv2.tong, uv10.tong]);
r = c.__goi('chotThang', own, '2026-10', 'INUV'); ok(r.ok && c.doc_('KPIQuanLyThang').filter(x => c.chuanKy_(x.Ky) === '2026-10').length === kq.length, 'chốt lại riêng 1 xưởng → không nhân đôi dòng, giữ xưởng khác', c.doc_('KPIQuanLyThang').length);

console.log('\n3. Trần hiệu suất công nhân 150% từ tháng 11');
c.__goi('layKPIKy', own, 'thang', '2026-11', '');
const ts = c.doc_('TrongSoKPI'), moi = ts[ts.length - 1];
ok(Number(moi.TranKPI) === 150 && c.chuanKy_(moi.KyApDung) === '2026-09' && Number(moi.SanLuong) === 70 && Number(moi.ChatLuong) === 20, 'tự thêm dòng trọng số: từ 2026-09 trần 150% (21/11 tối: áp từ T9), giữ 70/20/5/5', moi);
ok(Number(c.trongSoKy_(ts, '2026-08').TranKPI) === 500 && Number(c.trongSoKy_(ts, '2026-09').TranKPI) === 150 && Number(c.trongSoKy_(ts, '2026-11').TranKPI) === 150, 'tháng 8 vẫn trần cũ, từ tháng 9 trần 150');
c.__goi('layKPIKy', own, 'thang', '2026-11', ''); ok(c.doc_('TrongSoKPI').length === ts.length, 'chỉ thêm 1 lần');
r = c.__goi('layKPIKy', own, 'thang', '2026-11', ''); ok(r.ok && (r.ds || []).every(o => Number(o.sl) <= 150.0001), 'KPI tháng 11: hiệu suất mọi người ≤ 150%', (r.ds || []).filter(o => o.sl > 150).slice(0, 3));
console.log('\n' + (l ? '✗ ' + l + ' / ' + n + ' lỗi' : '✓ Đạt ' + n + ' / ' + n)); process.exit(l ? 1 : 0);
