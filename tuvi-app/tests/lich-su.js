/** Lịch sử lá số: lập lại cùng người chỉ giữ bản mới nhất, ẩn trùng khi hiển thị, nút dọn trùng. Chạy: node tests/lich-su.js */
const fs = require('fs'), vm = require('vm'), path = __dirname + '/../';
const { ctx } = require(path + 'tools/gia-lap.js');
const code = fs.readFileSync(path + 'Code.gs', 'utf8');
vm.runInContext(code.slice(code.indexOf('var SHEET_NAME'), code.indexOf('var COT_JSON') + 60).replace(/^var /mg, 'globalThis.'), ctx);
vm.runInContext(code.slice(code.indexOf('/* ---------------------- Lưu trữ'), code.indexOf('/** Hàm chạy thử')), ctx);
let ok = 0, sai = 0; const k = (c, m) => { if (c) ok++; else { sai++; console.log('✘', m); } };
ctx.tkCan_ = () => ({ ten: 'an', vaiTro: 'tv' });
const lap = (o) => ctx.lapLaSoDayDu_(Object.assign({ name: 'Nguyễn Văn An', gender: 'nam', calendar: 'duong', day: 15, month: 8, year: 1990, hour: 10, minute: 30, viewYear: 2026, save: true, taiKhoan: 'an' }, o));
lap({}); lap({ viewYear: 2027 }); lap({ name: '  nguyễn  văn an ' });
k(ctx.getLichSu('x').length === 1, 'lưu 3 lần cùng người → 1 dòng');
lap({ minute: 45 }); lap({ name: 'Trần Thị B', gender: 'nu' }); lap({ taiKhoan: 'binh' });
k(ctx.getLichSu('x').length === 3, 'giờ khác, người khác = lá số khác; tài khoản khác không hiện: ' + ctx.getLichSu('x').length);
// Âm lịch cùng ngày dương → trùng
const sh = ctx.getSheet_(); const truoc = sh.getLastRow();
k(truoc === 5, 'số dòng sheet ' + truoc);
// dòng trùng cũ có sẵn trong sheet (trước khi có tính năng) → getLichSu ẩn, donLichSu xóa
const row = sh.getRange(2, 1, 1, 20).getValues()[0]; sh.appendRow(row); sh.appendRow(row);
k(ctx.getLichSu('x').filter(h => /an/i.test(h.name)).length === 2, 'ẩn trùng khi hiển thị');
const n = ctx.donLichSu('x'); k(n === 2, 'dọn xóa 2 dòng: ' + n);
k(ctx.donLichSu('x') === 0, 'dọn lần 2 = 0');
ctx.tkCan_ = () => ({ ten: 'chu', vaiTro: 'chu' });
k(ctx.getLichSu('x').length === 4, 'chủ thấy cả 4: ' + ctx.getLichSu('x').length);
console.log('Lịch sử: đạt ' + ok + '/' + (ok + sai));
