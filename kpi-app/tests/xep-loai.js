/**
 * Kiểm thử thang xếp loại 22/10 (tests/xep-loai/): S ≥ 95, A+ ≥ 90, A ≥ 85, B ≥ 80, C ≥ 70, D < 70.
 *   DATA=/đường/dẫn/csdl.json TZ=Asia/Ho_Chi_Minh node kpi-app/tests/xep-loai.js
 */
const path = require('path'), fs = require('fs');
const G = require('./gia-lap-kpi.js');
const GOC = path.join(__dirname, '..'), DATA = process.env.DATA;
if (!DATA) { console.log('Cần DATA=<file json dữ liệu>'); process.exit(1); }
let dem = 0, loi = 0;
const ok = (dk, ten, ct) => { dem++; if (dk) console.log('  ✓ ' + ten); else { loi++; console.log('  ✗ ' + ten + (ct !== undefined ? '  → ' + JSON.stringify(ct).slice(0, 400) : '')); } };
const MOC = [[100, 'S'], [95, 'S'], [94.99, 'A+'], [90, 'A+'], [89.9, 'A'], [85, 'A'], [84.9, 'B'], [80, 'B'], [79.9, 'C'], [70, 'C'], [69.9, 'D'], [0, 'D']];
const dung = f => MOC.filter(([v, l]) => f(v) !== l).map(([v, l]) => [v, l, f(v)]);

console.log('\n1. Máy chủ (Code.gs)');
const du = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const c = G.tao(path.join(GOC, 'Code.gs'), du, '2026-10-22T10:00:00+07:00');
ok(!dung(c.loaiKPI_).length, 'loaiKPI_ đúng mọi mốc', dung(c.loaiKPI_));
ok(c.BC_LOAI.join() === 'S,A+,A,B,C,D,Học việc' && c.BC_MAU_LOAI.S, 'báo cáo tháng có loại S (màu riêng)');
const tk = c.doc_('TaiKhoan').filter(x => String(x.VaiTro).trim() === 'OWNER' && x.TrangThai === 'Đang dùng')[0];
const r = c.__goi('layKPIKy', c.__phienDai(tk), 'thang', '2026-10', '');
const sai = (r.ds || []).filter(o => o.loai !== 'Học việc' && o.loai !== c.loaiKPI_(o.tong));
ok(r.ok && r.ds.length > 50 && !sai.length, 'bảng KPI tháng 10: loại khớp thang mới (' + r.ds.length + ' người, ' + r.ds.filter(o => o.loai === 'S').length + ' người hạng S)', sai.slice(0, 3));

console.log('\n2. Giao diện (Index.html, SoDo.html)');
const idx = fs.readFileSync(path.join(GOC, 'Index.html'), 'utf8'), sd = fs.readFileSync(path.join(GOC, 'SoDo.html'), 'utf8');
const lay = (s, ten) => { const m = s.match(new RegExp('function ' + ten + '\\(v\\)\\{[\\s\\S]*?\\n\\}|function ' + ten + '\\(v\\)\\{[^\\n]*\\}')); return m && new Function(m[0] + '; return ' + ten + ';')(); };
const loai = lay(idx, 'loai'), loaiFE = lay(idx, 'loaiFE');
ok(loai && !dung(v => loai(v)[0]).length, 'loai() (bảng KPI, KPI cá nhân) đúng mọi mốc', loai && dung(v => loai(v)[0]));
ok(loaiFE && !dung(loaiFE).length, 'loaiFE() đúng mọi mốc', loaiFE && dung(loaiFE));
ok(!/A\+ ?≥ ?100|≥ 100<\/td>|A 90–99|toi\.tong>=100/.test(idx), 'không còn chữ thang cũ (A+ ≥ 100, A 90–99) trên giao diện');
ok(/S ≥95/.test(idx) && /S \(≥95\)/.test(idx) && /lên hạng S/.test(idx), 'hướng dẫn, chú thích, lời Rhino có hạng S');
ok(/thu=\['D','C','B','A','A\+','S'\]/.test(idx) && /'S':'lS'/.test(idx), 'lên hạng S có pháo giấy + giọng "loại S"');
ok(/"lS"/.test(fs.readFileSync(path.join(GOC, 'AmThanh.html'), 'utf8')), 'AmThanh.html có giọng "loại S"');
const m = sd.match(/o\.hang = function \(v\) \{[^\n]*?\};/), hangSD = m && new Function('var o={};' + m[0] + 'return o.hang;')();
ok(hangSD && !dung(hangSD).length, 'sơ đồ nhà máy: hạng xưởng đúng thang mới', hangSD && dung(hangSD));

console.log('\n' + (loi ? '✗ ' + loi + '/' + dem + ' kiểm tra lỗi' : '✓ Đạt cả ' + dem + ' kiểm tra'));
process.exit(loi ? 1 : 0);
