/** Luận giải hằng ngày qua email (TienIch.gs › mục 8). Chạy: node tests/van-ngay.js  (TK_PASS = mật khẩu chủ sở hữu để thử đăng ký) */
const { ctx } = require('../tools/gia-lap.js');
let ok = 0, sai = 0; function kt(dk, ten) { if (dk) ok++; else { sai++; console.log('  ✘', ten); } }
const thu = []; ctx.MailApp = { sendEmail: o => thu.push(o) }; ctx.Logger = ctx.Logger || { log: () => {} };
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
      // Bản đầy đủ: 4 lĩnh vực, 4 hệ, 3 buổi, điều kiêng lịch cổ
      kt(N.linhVuc.length === 4 && N.linhVuc.every(L => L.van.length && /^(thuận|bình|cần giữ)$/.test(L.muc)), 'đủ 4 lĩnh vực ' + ten);
      kt(N.linhVuc.filter(L => L.noi).length <= 1 && N.he.length === 4 && N.buoi.length === 3 && N.ky.length === 2 && N.viecNho, 'đủ 4 hệ, 3 buổi, lời kiêng ' + ten);
      kt(!SAO.test(N.linhVuc.map(L => L.van.join(' ')).join(' ')), 'văn lĩnh vực không nêu tên sao ' + ten);
      if (N.xung) kt(N.linhVuc[0].muc !== 'thuận', 'ngày xung tuổi: công việc không gắn "thuận" ' + ten);
      if (!N.hoangDao) kt(!N.nen.some(x => /cưới hỏi|khai trương|nhập trạch/.test(x)), 'ngày Hắc đạo không khuyên lễ lớn ' + ten);
      if (/Hợi/.test(N.canChi)) kt(!N.nen.some(x => /cưới hỏi/.test(x)), 'ngày Hợi (kiêng cưới gả) không khuyên cưới hỏi ' + ten);
      if (/Tỵ/.test(N.canChi)) kt(!N.nen.some(x => /xuất hành|đi xa/.test(x)), 'ngày Tỵ (kiêng đi xa) không khuyên xuất hành ' + ten);
    });
    kt(!/hôm nay/i.test(D.ngayMai.luu.concat(D.ngayMai.linhVuc.map(L => L.van.join(' '))).join(' ') + D.ngayMai.tong), 'ngày mai không viết nhầm "hôm nay" ' + ten);
    kt(ctx.tiVanChuanBi_(D.ngayMai).length >= 1, 'có lời dặn chuẩn bị cho ngày mai ' + ten);
    kt(D.homNay.ngay === t.d + '/' + t.m + '/' + t.y, 'đúng ngày hôm nay ' + ten);
    const h = ctx.tiVanNgayHtml_(D); kt(!/undefined|NaN|null/.test(h) && h.indexOf('Ngày mai') > 0, 'email không lỗi chữ ' + ten);
    const chu = h.replace(/<[^>]+>/g, ' ').replace(/Thiên Cơ Các/g, '').replace(/Tử Vi(?=\s*·|, Bát Tự)/g, '');
    kt(!SAO.test(chu), 'toàn bộ email không nêu tên sao ' + ten + ': ' + (chu.match(SAO) || [''])[0]);
    kt(/Theo từng lĩnh vực/.test(h) && /Lịch trong ngày/.test(h) && /Chuẩn bị từ tối nay/.test(h) && /Điều kiêng theo lịch cổ/.test(h), 'email có đủ các mục mới ' + ten);
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
// Zalo (dùng chung bot Trợ lý KPI): bản chữ thường ≤1900 ký tự/tin, chỉ gửi cho lá số của chủ sở hữu, mỗi lá số một lần mỗi ngày
{
  const inp = { name: 'Lá số Zalo', gender: 'nam', calendar: 'duong', day: 15, month: 8, year: 1990, hour: 10, minute: 30 };
  const D = ctx.tiVanNgayDuLieu_(inp, { y: 2026, m: 10, d: 22 }), Z = ctx.tiVanNgayZalo_(D), chu = Z.join('\n');
  kt(Z.length === 2 && Z.every(x => x.length <= 1900), 'bản Zalo 2 tin, mỗi tin ≤1900 ký tự (' + Z.map(x => x.length) + ')');
  kt(!/<[a-z\/]/i.test(chu) && !/undefined|NaN|null/.test(chu), 'bản Zalo không còn thẻ HTML, không lỗi chữ');
  kt(!SAO.test(chu.replace(/Thiên Cơ Các/g, '')), 'bản Zalo không nêu tên sao');
  kt(/HÔM NAY/.test(Z[0]) && /NGÀY MAI/.test(Z[1]) && /Giờ đẹp nhất/.test(Z[0]), 'bản Zalo đủ hôm nay, ngày mai, giờ đẹp');
  const zl = []; ctx.UrlFetchApp = { fetch: (url, o) => { zl.push({ url, body: JSON.parse(o.payload) }); return { getContentText: () => '{"ok":true}', getResponseCode: () => 200 }; } };
  const sh = ctx.tiShVanNgay_(), P = ctx.PropertiesService.getScriptProperties();
  kt(!ctx.tiZaloCo_(), 'chưa nhập token thì không gửi Zalo');
  sh.appendRow([ctx.TK_CHU, 'chu@example.com', JSON.stringify(inp), new Date(), '', 'bật']);
  sh.appendRow([ctx.TK_CHU, 'chu2@example.com', JSON.stringify(inp), new Date(), '', 'bật']);
  sh.appendRow(['khachvip', 'vip@example.com', JSON.stringify(inp), new Date(), '', 'bật']);
  P.setProperty('ZALO_TOKEN', 'tok-thu'); P.setProperty('ZALO_CHAT_ID', 'chat-thu');
  const e0 = thu.length, n = ctx.guiVanNgay();
  kt(n === 3 && thu.length - e0 === 3, 'email vẫn gửi đủ 3 dòng (' + n + ')');
  kt(zl.length === 2 && zl.every(x => x.body.chat_id === 'chat-thu' && /bottok-thu\/sendMessage$/.test(x.url)), 'Zalo chỉ gửi 1 lần cho lá số chủ sở hữu (2 tin), không gửi cho VIP (' + zl.length + ')');
  ctx.thuZaloVanNgay(); kt(zl.length === 4, 'thuZaloVanNgay gửi ngay');
  ctx.UrlFetchApp = { fetch: () => ({ getContentText: () => '{"ok":false,"description":"Unauthorized"}', getResponseCode: () => 401 }) };
  let lz = ''; try { ctx.thuZaloVanNgay(); } catch (e) { lz = e.message; } kt(/Unauthorized/.test(lz), 'báo rõ khi Zalo từ chối');
  P.deleteProperty('ZALO_TOKEN'); P.deleteProperty('ZALO_CHAT_ID');
  const SAMPLE = Z; if (process.env.XEM_ZALO) console.log(SAMPLE.join('\n\n------\n\n'));
}
console.log('Luận giải hằng ngày: đạt ' + ok + '/' + (ok + sai));
process.exit(sai ? 1 : 0);
