/**
 * Dựng trang demo "Lá số Tử Vi 3D" (demo/la-so-3d.html) từ một lá số thật của bộ máy an sao.
 * Chạy: node tools/demo-3d.js ['{"name":"...","gender":"nam","calendar":"duong","day":15,"month":8,"year":1990,"hour":10,"minute":30}']
 * Khuôn trang: demo/la-so-3d.tpl.html (chỗ /*DATA*\/ được thay bằng dữ liệu lá số).
 */
const fs = require('fs'), path = require('path');
const { ctx } = require('./gia-lap.js');
const D = path.join(__dirname, '..');
const macDinh = { name: 'Nguyễn Văn An', gender: 'nam', calendar: 'duong', day: 15, month: 8, year: 1990, hour: 10, minute: 30, place: '21.03|105.85|Hà Nội', tz: '7' };
const inp = Object.assign({}, macDinh, process.argv[2] ? JSON.parse(process.argv[2]) : {});
const r = ctx.lapLaSo(inp, '');
const I = r.tuvi.info;
const P = r.tuvi.palaces.slice().sort((a, b) => a.chi - b.chi);
const data = {
  mau: !process.argv[2],
  info: { name: I.name, gioiTinh: I.gender, namCanChi: I.namCanChi, conGiap: I.conGiap, amDuong: I.amDuong, banMenh: I.banMenh.ten, cuc: I.cuc,
    gioTen: I.gioTen, solar: I.solar, lunar: I.lunar, noi: String(inp.place || '').split('|')[2] || '' },
  palaces: P.map(p => ({ chi: p.chi, chiTen: p.chiTen, canTen: p.canTen, cung: p.cung, cungIdx: p.cungIdx, isThan: !!p.isThan, tuan: !!p.tuan, triet: !!p.triet,
    diem10: p.diem10, chinh: p.chinh.map(s => ({ n: s.n, h: s.h, b: s.b || '', hoa: s.hoa || '' })), cat: p.cat.map(s => s.n), hung: p.hung.map(s => s.n) })),
  luan: Object.fromEntries(r.tuvi.luanGiai.cung.map(c => [c.cung, { yNghia: c.yNghia, lines: c.lines, danhGia: c.danhGia }]))
};
const tpl = fs.readFileSync(path.join(D, 'demo/la-so-3d.tpl.html'), 'utf8');
const out = tpl.replace('/*DATA*/null', JSON.stringify(data).replace(/</g, '\\u003c'));
fs.writeFileSync(path.join(D, 'demo/la-so-3d.html'), out);
console.log('Đã dựng demo/la-so-3d.html –', data.info.name, '·', (out.length / 1024).toFixed(0) + ' KB');
