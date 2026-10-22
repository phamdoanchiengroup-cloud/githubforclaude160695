/** Luận giải hằng ngày qua email (TienIch.gs › mục 8). Chạy: node tests/van-ngay.js  (TK_PASS = mật khẩu chủ sở hữu để thử đăng ký) */
const { ctx } = require('../tools/gia-lap.js');
let ok = 0, sai = 0; function kt(dk, ten) { if (dk) ok++; else { sai++; console.log('  ✘', ten); } }
const thu = []; ctx.MailApp = { sendEmail: o => thu.push(o) };
const SAO = /Tử Vi|Thiên Cơ|Thái Dương|Vũ Khúc|Thiên Đồng|Liêm Trinh|Thiên Phủ|Thái Âm|Tham Lang|Cự Môn|Thiên Tướng|Thiên Lương|Thất Sát|Phá Quân|Hóa Kỵ|Hóa Lộc|lưu tinh|Nhật chủ|Tỷ Kiên|Kiếp Tài|Thương Quan|Chính Quan|Thiên Ấn|Chính Ấn|Thực Thần|Thiên Tài|Chính Tài/;
const LON = /khởi sự|ký kết|cưới hỏi|khai trương|xuất hành|nhậm chức|đi xa|đàm phán/;
let ngayXung = 0, ngay = 0;
[1958, 1972, 1984, 1990, 1995, 2001, 2008].forEach((y, j) => {
  const inp = { name: 'Người thử ' + j, gender: j % 2 ? 'nu' : 'nam', calendar: 'duong', day: 2 + (y * 7) % 26, month: 1 + y % 12, year: y, hour: (y * 5) % 24, minute: 0, tz: '7' };
  for (let k = 0; k < 12; k++) {
    const d = new Date(Date.UTC(2026, 0, 1 + k * 31)), t = { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate() };
    const D = ctx.tiVanNgayDuLieu_(inp, t), ten = y + ' ' + t.d + '/' + t.m;
    kt(D.homNay && D.ngayMai, 'đủ hôm nay + ngày mai ' + ten);
    if (!D.homNay) continue;
    [D.homNay, D.ngayMai].forEach(N => {
      ngay++;
      kt(N.ngay && N.thu && N.nhan && N.tong && N.gio.length === 6 && N.nen.length && N.tranh.length, 'đủ mục ' + ten);
      const van = [N.tong].concat(N.luu, N.nen, N.tranh).join(' ');
      kt(!SAO.test(van), 'văn dễ hiểu không nêu tên sao / thuật ngữ ' + ten + ': ' + (van.match(SAO) || [''])[0]);
      if (N.xung) { ngayXung++; kt(N.nhan !== 'Ngày thuận' && N.nhan !== 'Ngày khá', 'ngày xung tuổi không gắn nhãn thuận ' + ten); kt(!N.nen.some(x => LON.test(x)), 'ngày xung tuổi không khuyên việc lớn ' + ten); }
      if (N.nhan === 'Ngày nên chậm') kt(!N.nen.some(x => LON.test(x)), 'ngày kém không khuyên việc lớn ' + ten);
    });
    kt(D.homNay.ngay === t.d + '/' + t.m + '/' + t.y, 'đúng ngày hôm nay ' + ten);
    const h = ctx.tiVanNgayHtml_(D); kt(!/undefined|NaN|null/.test(h) && h.indexOf('Ngày mai') > 0, 'email không lỗi chữ ' + ten);
  }
});
kt(ngayXung > 10, 'có gặp ngày xung tuổi trong mẫu (' + ngayXung + '/' + ngay + ')');
// Quyền: tài khoản thường không đăng ký được
const dk = ctx.dangKy('khachvn', 'matkhau123', 'Khách VN', '0912000222', '');
let loi = ''; try { ctx.dangKyVanNgay({ name: 'A', gender: 'nam', calendar: 'duong', day: 1, month: 1, year: 1990, hour: 8 }, 'a@example.com', dk.token); } catch (e) { loi = e.message; }
kt(/chủ sở hữu/.test(loi), 'tài khoản thường bị từ chối');
if (process.env.TK_PASS) {
  const tok = ctx.dangNhap('chienpham', process.env.TK_PASS).token, inp = { name: 'Lá số thử', gender: 'nam', calendar: 'duong', day: 15, month: 8, year: 1990, hour: 10, minute: 30 };
  const r = ctx.dangKyVanNgay(inp, 'thu@example.com', tok);
  kt(r.ok && thu.length === 1 && /Thiên Cơ Các · /.test(thu[0].subject) && thu[0].to === 'thu@example.com', 'chủ sở hữu đăng ký + gửi ngay bản thử');
  ctx.dangKyVanNgay(inp, 'thu@example.com', tok);
  kt(ctx.dsVanNgay(tok).length === 1, 'đăng ký lại cùng email không bị trùng dòng');
  const n1 = ctx.guiVanNgay(), n2 = ctx.guiVanNgay();
  kt(n1 === 1 && n2 === 0, 'trigger gửi mỗi email một lần mỗi ngày (' + n1 + ', ' + n2 + ')');
  kt(ctx.huyVanNgay('thu@example.com', tok).n === 1 && ctx.dsVanNgay(tok).length === 0, 'ngừng nhận');
} else console.log('  (bỏ qua phần đăng ký của chủ sở hữu – chưa có TK_PASS)');
console.log('Luận giải hằng ngày: đạt ' + ok + '/' + (ok + sai));
process.exit(sai ? 1 : 0);
