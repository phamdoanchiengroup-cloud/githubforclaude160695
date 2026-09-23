/**
 * Đối chiếu bộ máy Thiên Cơ Các với thư viện mã nguồn mở:
 *  - iztro (SylarLong/iztro, MIT)            : vị trí Mệnh, Thân, Cục, đại hạn, ~50 sao Tử Vi
 *  - lunar-javascript (6tail, MIT)           : Tứ trụ, khởi vận, Thai nguyên, Mệnh/Thân cung Bát Tự,
 *                                              Thập nhị trực, 12 thần Hoàng/Hắc đạo, Nhị thập bát tú
 * Chạy:  cd tests && npm install && npm test
 * Ghi chú: các sao an khác nhau giữa phái Việt Nam và Trung Hoa (Thiên Quý, Giải Thần, Lưu Hà,
 * chiều đi của Linh Tinh…) không đưa vào so sánh.
 */
var fs = require('fs');
var path = require('path');
var vm = require('vm');
var iztro = require('iztro');
var Solar = require('lunar-javascript').Solar;

var ctx = {};
vm.createContext(ctx);
['Lunar.gs', 'TuVi.gs', 'BatTu.gs', 'LuanGiai.gs'].forEach(function (f) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'), ctx, { filename: f });
});

var seed = 20260923;
function rnd() { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }
function ri(a, b) { return a + Math.floor(rnd() * (b - a + 1)); }

var ZH = '甲乙丙丁戊己庚辛壬癸', BR = '子丑寅卯辰巳午未申酉戌亥';
var Z = { '紫微': 'Tử Vi', '天机': 'Thiên Cơ', '太阳': 'Thái Dương', '武曲': 'Vũ Khúc', '天同': 'Thiên Đồng', '廉贞': 'Liêm Trinh',
  '天府': 'Thiên Phủ', '太阴': 'Thái Âm', '贪狼': 'Tham Lang', '巨门': 'Cự Môn', '天相': 'Thiên Tướng', '天梁': 'Thiên Lương',
  '七杀': 'Thất Sát', '破军': 'Phá Quân', '左辅': 'Tả Phù', '右弼': 'Hữu Bật', '文昌': 'Văn Xương', '文曲': 'Văn Khúc',
  '天魁': 'Thiên Khôi', '天钺': 'Thiên Việt', '禄存': 'Lộc Tồn', '天马': 'Thiên Mã', '擎羊': 'Kình Dương', '陀罗': 'Đà La',
  '地空': 'Địa Không', '地劫': 'Địa Kiếp', '红鸾': 'Hồng Loan', '天喜': 'Thiên Hỷ', '咸池': 'Đào Hoa', '天姚': 'Thiên Riêu',
  '天刑': 'Thiên Hình', '天哭': 'Thiên Khốc', '天虚': 'Thiên Hư', '龙池': 'Long Trì', '凤阁': 'Phượng Các', '三台': 'Tam Thai',
  '八座': 'Bát Tọa', '恩光': 'Ân Quang', '天官': 'Thiên Quan', '天福': 'Thiên Phúc', '孤辰': 'Cô Thần', '寡宿': 'Quả Tú',
  '破碎': 'Phá Toái', '华盖': 'Hoa Cái', '台辅': 'Thai Phụ', '封诰': 'Phong Cáo', '天才': 'Thiên Tài', '天寿': 'Thiên Thọ',
  '天伤': 'Thiên Thương', '天使': 'Thiên Sứ', '天德': 'Thiên Đức', '月德': 'Nguyệt Đức', '天空': 'Thiên Không', '火星': 'Hỏa Tinh' };

var report = [];
function check(name, total, bad, maxRate) {
  var rate = total ? bad / total : 0;
  report.push({ name: name, total: total, bad: bad, ok: rate <= maxRate });
}

/* 1. Tử Vi vs iztro */
var n = 0, badStar = 0, badMenh = 0, starCount = 0;
for (var i = 0; i < 2000; i++) {
  var y = ri(1940, 2030), m = ri(1, 12), d = ri(1, 29), h = ri(0, 11), g = rnd() < 0.5 ? '男' : '女';
  if (!ctx.lunarToSolar(d, m, y, 0)) continue;
  var a;
  try { a = iztro.astro.byLunar(y + '-' + m + '-' + d, h, g, false, true, 'zh-CN'); } catch (e) { continue; }
  var tv = ctx.tuviLapLaSo({ calendar: 'am', day: d, month: m, year: y, hour: h * 2, minute: 0, gender: g === '男' ? 'nam' : 'nu', viewYear: 2026 });
  n++;
  if (BR.indexOf(a.earthlyBranchOfSoulPalace) !== tv.info.menh || BR.indexOf(a.earthlyBranchOfBodyPalace) !== tv.info.than) badMenh++;
  a.palaces.forEach(function (p) {
    var pi = BR.indexOf(p.earthlyBranch);
    if (p.decadal.range[0] !== tv.palaces[pi].daiHan) badMenh++;
    p.majorStars.concat(p.minorStars, p.adjectiveStars).forEach(function (s) {
      var vn = Z[s.name];
      if (!vn || (vn === 'Hỏa Tinh' && !tv.info.thuan)) return;
      starCount++;
      if (tv.pos[vn] !== pi) badStar++;
    });
  });
}
check('Tử Vi – Mệnh/Thân/Đại hạn (' + n + ' lá số)', n, badMenh, 0);
check('Tử Vi – vị trí sao', starCount, badStar, 0);

/* 2. Bát Tự vs lunar-javascript (giờ Trung Quốc = giờ VN + 1) */
var nb = 0, badP = 0, badPhu = 0;
for (i = 0; i < 2000; i++) {
  var yy = ri(1930, 2029), mo = ri(1, 12), dd = ri(1, 28), hh = ri(0, 22), mi = ri(0, 59);
  var bt = ctx.batTuLap({ calendar: 'duong', day: dd, month: mo, year: yy, hour: hh, minute: mi, gender: 'nam', viewYear: 2026 });
  var t = new Date(Date.UTC(yy, mo - 1, dd, hh, mi) + 3600e3);
  var ec = Solar.fromYmdHms(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate(), t.getUTCHours(), t.getUTCMinutes(), 0).getLunar().getEightChar();
  var ecVN = Solar.fromYmdHms(yy, mo, dd, hh, mi, 0).getLunar().getEightChar();
  ecVN.setSect(1);
  var gz = function (x) { return ZH[x.can] + BR[x.chi]; };
  nb++;
  var P = bt.pillars;
  if (gz(P[0]) !== ec.getYear() || gz(P[1]) !== ec.getMonth() || gz(P[2]) !== ecVN.getDay() || gz(P[3]) !== ecVN.getTime()) { badP++; continue; }
  if (ecVN.getMonth() !== ec.getMonth()) { nb--; continue; } // sát giờ giao tiết, bỏ qua
  if (gz(bt.phuTru[0]) !== ecVN.getTaiYuan() || gz(bt.phuTru[1]) !== ecVN.getMingGong() || gz(bt.phuTru[2]) !== ecVN.getShenGong()) badPhu++;
}
check('Bát Tự – tứ trụ (lệch cho phép khi sinh sát giờ giao tiết)', nb, badP, 0.003);
check('Bát Tự – Thai nguyên, Mệnh cung, Thân cung', nb - badP, badPhu, 0);

/* 3. Lịch ngày */
var TRUC = '建除满平定执破危成收开闭';
var TS = ['青龙', '明堂', '天刑', '朱雀', '金匮', '天德', '白虎', '玉堂', '天牢', '玄武', '司命', '勾陈'];
var XIU = '危室壁奎娄胃昴毕觜参井鬼柳星张翼轸角亢氐房心尾箕斗牛女虚';
var tvRef = ctx.tuviLapLaSo({ calendar: 'duong', day: 15, month: 8, year: 1990, hour: 10, minute: 30, gender: 'nam', viewYear: 2026 });
var btRef = ctx.batTuLap({ calendar: 'duong', day: 15, month: 8, year: 1990, hour: 10, minute: 30, gender: 'nam', viewYear: 2026 });
var nd = 0, badTruc = 0, badThan = 0, badTu = 0;
for (i = 0; i < 300; i++) {
  var days = ctx.lgNhatVan_(tvRef, btRef, ri(1950, 2040) + '-' + ri(1, 12) + '-' + ri(1, 28), 7, true);
  days.forEach(function (x) {
    var p = x.ngay.split('/').map(Number);
    var L = Solar.fromYmd(p[2], p[1], p[0]).getLunar();
    nd++;
    if (TRUC.charAt(ctx.LG_TRUC.indexOf(x.truc)) !== L.getZhiXing()) badTruc++;
    if (TS[ctx.LG_12_THAN.indexOf(x.than)] !== L.getDayTianShen()) badThan++;
    if (XIU.charAt(ctx.LG_TU.map(function (t) { return t[0]; }).indexOf(x.tu)) !== L.getXiu()) badTu++;
  });
}
check('Lịch – Thập nhị trực (lệch cho phép do múi giờ ngày giao tiết)', nd, badTruc, 0.01);
check('Lịch – 12 thần Hoàng/Hắc đạo (theo tiết)', nd, badThan, 0.01);
check('Lịch – Nhị thập bát tú', nd, badTu, 0);

var fail = false;
report.forEach(function (r) {
  if (!r.ok) fail = true;
  console.log((r.ok ? '✔ ' : '✘ ') + r.name + ': ' + (r.total - r.bad) + '/' + r.total + ' khớp');
});
process.exit(fail ? 1 : 0);
