/**
 * Kiểm thử bộ "kiểm tra cài đặt" (Code.gs › HAM_CAN_CO, BAN_MOI_CAN_CO): với bản mã hiện tại trong repo,
 * mọi file phải có hàm đặc trưng và mọi dấu hiệu "bản mới" phải khớp – tránh báo nhầm "file bản cũ" cho chủ dự án.
 * Chạy: node tests/cai-dat.js
 */
const fs = require('fs'), path = require('path'), vm = require('vm');
const { ctx } = require(path.join(__dirname, '..', 'tools', 'gia-lap.js'));
const code = fs.readFileSync(path.join(__dirname, '..', 'Code.gs'), 'utf8');
// Code.gs đầy đủ (gia-lap chỉ nạp một phần) để có hàm của chính Code.gs và hai bảng dấu hiệu
vm.runInContext(code, ctx, { filename: 'Code.gs' });
let ok = 0, sai = 0;
function kt(dk, msg) { if (dk) ok++; else { sai++; console.log('✗', msg); } }
const soGs = fs.readdirSync(path.join(__dirname, '..')).filter(f => f.endsWith('.gs') && f !== 'LaSo3D.gs').length;
kt(Object.keys(ctx.HAM_CAN_CO).length + 1 === soGs, 'HAM_CAN_CO liệt kê đủ ' + (soGs - 1) + ' file .gs (trừ Code.gs, LaSo3D.gs tùy chọn): đang có ' + Object.keys(ctx.HAM_CAN_CO).length);
Object.keys(ctx.HAM_CAN_CO).forEach(f => {
  kt(fs.existsSync(path.join(__dirname, '..', f)), 'file ' + f + ' tồn tại');
  kt(typeof ctx[ctx.HAM_CAN_CO[f]] === 'function', f + ' có hàm ' + ctx.HAM_CAN_CO[f]);
});
Object.keys(ctx.BAN_MOI_CAN_CO).forEach(f => {
  const m = ctx.BAN_MOI_CAN_CO[f], h = ctx[m[0]];
  kt(typeof h === 'function', f + ': có hàm ' + m[0]);
  kt(typeof h === 'function' && String(h).indexOf(m[1]) >= 0, f + ': hàm ' + m[0] + ' phải chứa "' + m[1] + '" (nếu không, kiemTraCaiDat sẽ báo nhầm là bản cũ)');
});
const m = code.match(/đủ (\d+) file \.gs/); kt(m && +m[1] === soGs, 'câu báo "đủ N file .gs" khớp số file thật (' + soGs + ')');
console.log('Kiểm tra cài đặt: đạt ' + ok + '/' + (ok + sai));
process.exit(sai ? 1 : 0);
