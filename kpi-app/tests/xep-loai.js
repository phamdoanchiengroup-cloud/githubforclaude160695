/**
 * Kiểm thử THANG 4 BẬC (chủ dự án 23/11, tests/xep-loai-4/): A ≥ 90 · B 80–89 · C 70–79 · D < 70. Bỏ S / A+.
 * (Bản trước kiểm thang 6 bậc 22/10.)   DATA=/đường/dẫn/csdl.json TZ=Asia/Ho_Chi_Minh node kpi-app/tests/xep-loai.js
 */
const path = require('path'), fs = require('fs');
const G = require('./gia-lap-kpi.js');
const GOC = path.join(__dirname, '..'), DATA = process.env.DATA;
if (!DATA) { console.log('Cần DATA=<file json dữ liệu>'); process.exit(1); }
let dem = 0, loi = 0;
const ok = (dk, ten, ct) => { dem++; if (dk) console.log('  ✓ ' + ten); else { loi++; console.log('  ✗ ' + ten + (ct !== undefined ? '  → ' + JSON.stringify(ct).slice(0, 400) : '')); } };
const MOC = [[150, 'A'], [95, 'A'], [90, 'A'], [89.99, 'B'], [85, 'B'], [80, 'B'], [79.9, 'C'], [70, 'C'], [69.9, 'D'], [0, 'D']];
const dung = f => MOC.filter(([v, l]) => f(v) !== l).map(([v, l]) => [v, l, f(v)]);

console.log('\n1. Máy chủ (Code.gs)');
const du = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const goc = JSON.parse(JSON.stringify(du.KPIThang));
const c = G.tao(path.join(GOC, 'Code.gs'), du, '2026-11-23T10:00:00+07:00');
ok(!dung(c.loaiKPI_).length, 'loaiKPI_ đúng mọi mốc', dung(c.loaiKPI_));
ok(c.KM_BAC.join() === 'A,B,C,D', 'thứ tự bậc hạ ngày công: A → B → C → D');
ok(c.BC_LOAI.join() === 'A,B,C,D,Thiếu công,Học việc' && c.BC_MAU_LOAI['Thiếu công'] && !c.BC_MAU_LOAI.S, 'báo cáo tháng: A, B, C, D, Thiếu công, Học việc');
// chuyển dòng đã lưu
ok(c.xl4Moi_(96, 'S', '2026-11-01') === 'A' && c.xl4Moi_(92, 'A+', '2026-11-01') === 'A' && c.xl4Moi_(87, 'A', '2026-11-01') === 'B' && c.xl4Moi_(82, 'B', '2026-11-01') === 'B', 'thang 22/10 → 4 bậc: S/A+ → A, A/B → B');
ok(c.xl4Moi_(92, 'A', '2026-11-22') === 'B' && c.xl4Moi_(96, 'A+', '2026-11-22') === 'B' && c.xl4Moi_(85, 'B', '2026-11-22') === 'C', 'dòng đã bị hạ bậc vì ngày công → hạ 1 bậc trên thang mới (92 lưu A → B; 85 lưu B → C)');
ok(c.xl4Moi_(95, 'A', '2026-10-03') === 'A' && c.xl4Moi_(100, 'A+', '2026-10-03') === 'A' && c.xl4Moi_(85, 'B', '2026-10-03') === 'B', 'chốt trước 22/10 (thang A+ ≥ 100, A ≥ 90): đọc đúng, không hạ nhầm');
ok(c.xl4Moi_(40, 'Thiếu công') === 'Thiếu công' && c.xl4Moi_(88, 'Học việc') === 'Học việc', 'Thiếu công / Học việc giữ nguyên');
c.xl4Chuyen_();
const sau = c.doc_('KPIThang');
const conCu = sau.filter(r => ['S', 'A+'].includes(String(r.Loai)));
const saiDiem = sau.filter(r => ['A', 'B', 'C', 'D'].includes(String(r.Loai)) && ['A', 'B', 'C', 'D'].indexOf(String(r.Loai)) < ['A', 'B', 'C', 'D'].indexOf(c.loaiKPI_(Number(r.TongKPI))));
const k = goc[0], iK = k.indexOf('Ky'), iL = k.indexOf('Loai');
const dem9 = {}; sau.filter(r => String(r.Ky).replace(/^'/, '').startsWith('2026-09')).forEach(r => { dem9[r.Loai] = (dem9[r.Loai] || 0) + 1; });
const dem10 = {}; sau.filter(r => String(r.Ky).replace(/^'/, '').startsWith('2026-10')).forEach(r => { dem10[r.Loai] = (dem10[r.Loai] || 0) + 1; });
ok(sau.length === goc.length - 1 && !conCu.length && !saiDiem.length, 'KPIThang (' + sau.length + ' dòng): không còn S / A+, không dòng nào cao hơn điểm cho phép', [conCu.slice(0, 2), saiDiem.slice(0, 2)]);
console.log('     T9:', JSON.stringify(dem9), ' T10:', JSON.stringify(dem10));
const truoc = JSON.stringify(c.doc_('KPIThang')); c.xl4Chuyen_();
ok(JSON.stringify(c.doc_('KPIThang')) === truoc, 'chạy lại không đổi gì (chỉ chạy 1 lần)');
const tk = c.doc_('TaiKhoan').filter(x => String(x.VaiTro).trim() === 'OWNER' && x.TrangThai === 'Đang dùng')[0];
const r = c.__goi('layKPIKy', c.__phienDai(tk), 'thang', '2026-11', '');
const la = (r.ds || []).filter(o => !['A', 'B', 'C', 'D', 'Thiếu công', 'Học việc'].includes(o.loai));
ok(r.ok && r.ds.length > 50 && !la.length, 'bảng KPI tháng 11: chỉ có A/B/C/D/Thiếu công (' + r.ds.length + ' người)', la.slice(0, 3));

console.log('\n2. Giao diện (Index.html, SoDo.html, QuyTrinh.html)');
const idx = fs.readFileSync(path.join(GOC, 'Index.html'), 'utf8'), sd = fs.readFileSync(path.join(GOC, 'SoDo.html'), 'utf8'), qt = fs.readFileSync(path.join(GOC, 'QuyTrinh.html'), 'utf8');
const lay = (s, ten) => { const m = s.match(new RegExp('function ' + ten + '\\(v\\)\\{[\\s\\S]*?\\n\\}|function ' + ten + '\\(v\\)\\{[^\\n]*\\}')); return m && new Function(m[0] + '; return ' + ten + ';')(); };
const loai = lay(idx, 'loai'), loaiFE = lay(idx, 'loaiFE');
ok(loai && !dung(v => loai(v)[0]).length, 'loai() (bảng KPI, KPI cá nhân) đúng mọi mốc', loai && dung(v => loai(v)[0]));
ok(loaiFE && !dung(loaiFE).length, 'loaiFE() đúng mọi mốc', loaiFE && dung(loaiFE));
ok(!/S ≥ ?95|S \(≥95\)|A\+ \(?90|lên hạng S|lên hạng A\+|\['D', ?'C', ?'B', ?'A', ?'A\+'/.test(idx), 'không còn chữ thang 6 bậc (S ≥95, A+ 90–94, lên hạng S…) trên giao diện');
ok(/A ≥90<\/span> <span class="cn-pill c">B 80–89/.test(idx) && /A \(≥90\), B \(80–89\)/.test(idx) && /lên hạng A\./.test(idx), 'hướng dẫn, chú thích, lời Rhino theo 4 bậc');
ok(/HOLO_THANG = \[\[90, 'A'\], \[80, 'B'\], \[70, 'C'\], \[0, 'D'\]\]/.test(idx), 'Đài quan sát: 4 vòng hạng A/B/C/D');
const m = sd.match(/o\.hang = function \(v\) \{[^\n]*?\};/), hangSD = m && new Function('var o={};' + m[0] + 'return o.hang;')();
ok(hangSD && !dung(hangSD).length, 'sơ đồ nhà máy: hạng xưởng 4 bậc', hangSD && dung(hangSD));
ok(/var TK_LOAI=\['A','B','C','D','Thiếu công','Học việc'\]/.test(qt), 'Thống kê (Quy trình): biểu đồ phân loại 4 bậc');

console.log('\n' + (loi ? '✗ ' + loi + '/' + dem + ' kiểm tra lỗi' : '✓ Đạt cả ' + dem + ' kiểm tra'));
process.exit(loi ? 1 : 0);
