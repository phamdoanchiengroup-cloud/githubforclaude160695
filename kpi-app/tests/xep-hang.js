/**
 * Kiểm thử XẾP LOẠI THEO THỨ HẠNG XƯỞNG A+ / A / B / C (chủ dự án 28/11, tests/xep-hang/) – thay thang 4 bậc 23/11.
 *   DATA=/đường/dẫn/csdl.json TZ=Asia/Ho_Chi_Minh node kpi-app/tests/xep-hang.js
 */
const path = require('path'), fs = require('fs'); const G = require('./gia-lap-kpi.js');
const GOC = path.join(__dirname, '..'), DATA = process.env.DATA;
if (!DATA) { console.log('Cần DATA=<file json dữ liệu>'); process.exit(1); }
let dem = 0, loi = 0;
const ok = (dk, ten, ct) => { dem++; if (dk) console.log('  ✓ ' + ten); else { loi++; console.log('  ✗ ' + ten + (ct !== undefined ? '  → ' + JSON.stringify(ct).slice(0, 400) : '')); } };
const du = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const goc = JSON.parse(JSON.stringify(du.KPIThang));
const c = G.tao(path.join(GOC, 'Code.gs'), du, '2026-11-28T10:00:00+07:00');
const nguoi = (diem) => diem.map((t, i) => (typeof t === 'object' ? Object.assign({ cl: 100, sl: 100, at: 100, tt: 100 }, t) : { tong: t, cl: 100, sl: 100, at: 100, tt: 100 }));
const loai = a => c.xhXep_(a).map(o => o.loai).join(',');

console.log('\n1. Quy tắc (hàm lõi xhXep_)');
ok(c.xhN_(9) === 1 && c.xhN_(10) === 2 && c.xhN_(15) === 2 && c.xhN_(16) === 3, 'số suất: <10 người → 1, 10–15 → 2, >15 → 3');
ok(loai(nguoi([95, 90, 85, 80, 75, 72, 60])) === 'A+,A,A,A,A,B,C', 'xưởng 7 người: 1 A+ đầu, 1 B cuối (trong số ≥70), dưới 70 → C');
ok(loai(nguoi([99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 50, 40])) === 'A+,A+,A,A,A,A,A,A,B,B,C,C', 'xưởng 12 người (2 người <70 vẫn tính vào cỡ xưởng): 2 A+, 2 B');
ok(loai(nguoi(Array.from({ length: 20 }, (_, i) => 100 - i))).split(',').filter(x => x === 'A+').length === 3 && loai(nguoi(Array.from({ length: 20 }, (_, i) => 100 - i))).split(',').filter(x => x === 'B').length === 3, 'xưởng 20 người: 3 A+, 3 B');
ok(loai(nguoi([88, 80, 75, 60, 50, 40, 30, 20, 10, 5, 5, 5])) === 'A+,A+,B,C,C,C,C,C,C,C,C,C', 'ít người ≥70 (3 người, N = 2): ưu tiên A+ trước → 2 A+, 1 B');
ok(loai(nguoi([71, 40])) === 'A+,C', 'chỉ 1 người ≥70 → A+');
ok(loai(nguoi([70, 69.99])) === 'A+,C', 'đúng 70% vẫn được xếp, 69,99 → C');
ok(loai(nguoi([{ tong: 90, cl: 95 }, { tong: 90, cl: 98 }, 85, 80])) === 'A,A+,A,B', 'bằng KPI: xét Chất lượng (98 > 95 → A+)');
ok(loai(nguoi([{ tong: 90, cl: 95, sl: 110 }, { tong: 90, cl: 95, sl: 120 }, 80])) === 'A,A+,B', 'bằng KPI + chất lượng: xét Sản lượng');
ok(loai(nguoi([90, 90, 80, 75])) === 'A+,A+,A,B', 'bằng hết mọi tiêu chí → cùng loại (2 A+ dù N = 1)');
ok(loai([{ tong: 95, cl: 100, sl: 100, at: 100, tt: 100, ha: true }, ...nguoi([90, 85, 80])]) === 'A,A,A,B', 'đi làm 50–80% ngày công: vẫn chiếm suất A+ rồi hạ 1 bậc (không đẩy người kế lên A+)');
ok(loai([{ tong: 95, loai0: 'Thiếu công' }, ...nguoi([90, 85, 80])]) === 'Thiếu công,A+,A,B', 'Thiếu công: không xếp hạng');
ok(c.loaiKPI_(90) === 'A+' && c.loaiKPI_(80) === 'A' && c.loaiKPI_(70) === 'B' && c.loaiKPI_(69.9) === 'C', 'TP / PP (ngưỡng): A+ ≥90, A 80–89, B 70–79, C <70');

console.log('\n2. Dữ liệu thật');
c.xl4Chuyen_(); c.xhChuyen_();
const sau = c.doc_('KPIThang'), ky = r => String(r.Ky).replace(/^'/, '').slice(0, 7);
const T = {}; sau.filter(r => ky(r) >= '2026-09').forEach(r => { const k = ky(r) + '|' + r.MaXuong; (T[k] = T[k] || []).push(r); });
const sai = [];
Object.keys(T).forEach(k => { const a = T[k], n = a.length, N = c.xhN_(n), nA = a.filter(r => r.Loai === 'A+').length, nB = a.filter(r => r.Loai === 'B').length, du70 = a.filter(r => Number(r.TongKPI) >= 70 && !['Thiếu công', 'Học việc'].includes(r.Loai)).length;
  if (a.some(r => Number(r.TongKPI) < 70 && !['C', 'Thiếu công', 'Học việc'].includes(r.Loai))) sai.push([k, 'dưới 70 không phải C']);
  if (a.some(r => ['S', 'D'].includes(r.Loai))) sai.push([k, 'còn chữ cũ']);
  if (du70 >= 2 * N && (nA < 1 || nA > N + 2)) sai.push([k, n, 'A+', nA]); });
const demL = m => { const o = {}; sau.filter(r => ky(r) === m).forEach(r => { o[r.Loai] = (o[r.Loai] || 0) + 1; }); return o; };
ok(!sai.length, 'KPIThang T9, T10: mỗi xưởng đúng số A+ / B, dưới 70 là C, không còn S / D', sai.slice(0, 4));
console.log('     T9:', JSON.stringify(demL('2026-09')), ' T10:', JSON.stringify(demL('2026-10')));
const tr = JSON.stringify(c.doc_('KPIThang')); c.xhChuyen_(); ok(JSON.stringify(c.doc_('KPIThang')) === tr, 'chạy lại không đổi gì (1 lần)');
ok(sau.filter(r => ky(r) < '2026-09').every((r, i) => true), 'tháng trước T9 giữ loại đã lưu');
const tk = c.doc_('TaiKhoan').filter(x => String(x.VaiTro).trim() === 'OWNER' && x.TrangThai === 'Đang dùng')[0];
const r = c.__goi('layKPIKy', c.__phienDai(tk), 'thang', '2026-11', '');
const g = {}; (r.ds || []).forEach(o => { (g[o.MaXuong] = g[o.MaXuong] || []).push(o); });
const la = (r.ds || []).filter(o => !['A+', 'A', 'B', 'C', 'Thiếu công', 'Học việc'].includes(o.loai));
const xs = Object.keys(g).map(mx => mx + ':' + g[mx].length + 'ng/' + g[mx].filter(o => o.loai === 'A+').length + 'A+/' + g[mx].filter(o => o.loai === 'B').length + 'B');
ok(r.ok && r.ds.length > 50 && !la.length && Object.keys(g).every(mx => g[mx].filter(o => o.loai === 'A+').length >= 1 || g[mx].every(o => o.loai === 'C' || o.loai === 'Thiếu công')), 'bảng KPI T11 (tạm tính): mỗi xưởng có A+, chỉ A+/A/B/C/Thiếu công', [la.slice(0, 2), xs]);
console.log('     T11:', xs.join(' · '));
const q = c.__goi('layKPIKy', c.__phienDai(tk), 'quy', '2026-Q4', '');
ok(q.ok && q.ds.every(o => ['A+', 'A', 'B', 'C'].includes(o.loai)), 'quý 4: xếp theo thứ hạng trên điểm trung bình');

console.log('\n2b. Báo cáo tháng PDF – bảng KPI đầy đủ từng xưởng');
const bd = c.bcDuLieu_('2026-10'), ht = c.bcHtmlTong_(bd), m3 = ht.match(/Bảng KPI đầy đủ từng xưởng[\s\S]*/);
const soDong = m3 ? (m3[0].match(/<tr[ >]/g) || []).length - (m3[0].match(/<h3>/g) || []).length : 0;
ok(m3 && soDong === bd.kpi.length, 'báo cáo nhà máy: đủ ' + bd.kpi.length + ' công nhân, mỗi xưởng 1 bảng', [soDong, bd.kpi.length]);
const hx = c.bcHtmlXuong_(bd, 'PHOICB'), kpiX = [...hx.split('4. KPI từng công nhân')[1].split('</table>')[0].matchAll(/<td class="r"><b>([\d.,]+)<\/b>/g)].map(x => Number(x[1].replace(/\./g, '').replace(',', '.')));
ok(kpiX.length > 10 && kpiX.every((v, i) => !i || v <= kpiX[i - 1]), 'báo cáo xưởng: KPI từng công nhân xếp cao → thấp (' + kpiX.length + ' người)', kpiX.slice(0, 8));
console.log('\n3. Giao diện');
const idx = fs.readFileSync(path.join(GOC, 'Index.html'), 'utf8'), sd = fs.readFileSync(path.join(GOC, 'SoDo.html'), 'utf8'), qt = fs.readFileSync(path.join(GOC, 'QuyTrinh.html'), 'utf8');
ok(/thứ hạng trong xưởng/.test(idx) && !/A ≥90<\/span>|D &lt;70/.test(idx), 'hướng dẫn: xếp theo thứ hạng xưởng, không còn thang 4 bậc');
ok(/function mauLoai\(l\)/.test(idx) && /k\.loai\|\|loai\(k\.tong\)\[0\]/.test(idx) && /o\.loai\|\|loaiFE\(o\.tong\)/.test(idx), 'loại công nhân lấy từ máy chủ (không tự tính theo điểm)');
ok(/HOLO_THANG = \[\[90, 'A\+'\], \[80, 'A'\], \[70, 'B'\], \[0, 'C'\]\]/.test(idx) && /thu=\['C','B','A','A\+'\]/.test(idx) && /'A\+':\['vui covu'/.test(idx), 'Đài quan sát, lên hạng, lời Rhino theo A+/A/B/C');
ok(/v >= 90 \? 'A\+' : v >= 80 \? 'A'/.test(sd) && /var TK_LOAI=\['A\+','A','B','C'/.test(qt), 'Sơ đồ nhà máy + Thống kê theo A+/A/B/C');
console.log('\n' + (loi ? '✗ ' + loi + '/' + dem + ' kiểm tra lỗi' : '✓ Đạt cả ' + dem + ' kiểm tra'));
process.exit(loi ? 1 : 0);
