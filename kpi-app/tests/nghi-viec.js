/** Kiểm thử cho nghỉ việc hàng loạt (16/11 tối): DATA=<csdl.json> TZ=Asia/Ho_Chi_Minh node kpi-app/tests/nghi-viec.js */
const path = require('path'), fs = require('fs'); const G = require('./gia-lap-kpi.js');
const DATA = process.env.DATA; if (!DATA) { console.log('Cần DATA='); process.exit(1); }
let n = 0, l = 0; const ok = (c, t, x) => { n++; if (!c) l++; console.log((c ? '  ✓ ' : '  ✗ ') + t + (c ? '' : ' → ' + JSON.stringify(x).slice(0, 300))); };
const du = JSON.parse(fs.readFileSync(DATA, 'utf8')); const iDoi = du.TaiKhoan[0].indexOf('DoiMatKhauLanDau'); du.TaiKhoan.slice(1).forEach(x => { x[iDoi] = 'Không'; });
const c = G.tao(path.join(__dirname, '..', 'Code.gs'), du, '2026-11-16T09:00:00+07:00');
const TK = c.doc_('TaiKhoan').filter(t => t.TrangThai === 'Đang dùng'), own = c.__phienDai(TK.find(t => t.VaiTro === 'OWNER')), adm = c.__phienDai(TK.find(t => t.VaiTro === 'ADMIN'));
const nv = c.doc_('NhanSu').filter(x => x.TrangThai === 'Đang làm' && TK.some(t => t.MaNV === x.MaNV && t.VaiTro === 'CN')).slice(0, 3).map(x => x.MaNV);
let r = c.__goi('luuNghiViecHangLoat', adm, nv.join(' ')); ok(!r.ok, 'không phải chủ sở hữu → bị chặn', r);
r = c.__goi('xemNghiViecHangLoat', own, nv.join(', ') + ' X999'); ok(r.ok && r.doi === 3 && r.dong.find(d => d.ma === 'X999' && !d.co), 'xem trước: 3 người sẽ đổi, mã lạ báo không có', r);
r = c.__goi('luuNghiViecHangLoat', own, nv.join('\n')); ok(r.ok && r.nNV === 3 && r.nTK >= 3, 'xác nhận: 3 người nghỉ việc + ngừng tài khoản', r);
ok(nv.every(m => c.doc_('NhanSu').find(x => x.MaNV === m).TrangThai === 'Nghỉ việc' && c.doc_('TaiKhoan').filter(t => t.MaNV === m).every(t => t.TrangThai === 'Ngừng')), 'Sheet: NhanSu = Nghỉ việc, TaiKhoan = Ngừng');
r = c.__goi('luuNghiViecHangLoat', own, nv.join(' ')); ok(r.ok && r.nNV === 0 && r.nTK === 0, 'chạy lại lần 2: không đổi gì (không lặp)', r);
console.log(n + ' kiểm thử, ' + l + ' lỗi'); process.exit(l ? 1 : 0);
