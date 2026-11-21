// Sinh dữ liệu đối chiếu Kỳ Môn từ 3meta@2.6.0 và bigfishmarquis-qimen@1.0.0 (MIT). Chạy: tsx gen.js <node_modules> <out.json>
const NM = process.argv[2], OUT = process.argv[3];
const { QimenChart } = require(NM + '/3meta');
const { Solar } = require(NM + '/lunar-typescript');
const { shiJiaGenerate } = require(NM + '/bigfishmarquis-qimen/src/engines/shijia.ts');
const { chaiBuJuByGanZhi } = require(NM + '/bigfishmarquis-qimen/src/engines/chaibuquju.ts');
const fs = require('fs');
const TG = '甲乙丙丁戊己庚辛壬癸', DZ = '子丑寅卯辰巳午未申酉戌亥';
const SAO = ['天蓬','天芮','天冲','天辅','天禽','天心','天柱','天任','天英'];
const MON = ['休门','生门','伤门','杜门','景门','死门','惊门','开门'];
const THAN = ['值符','腾蛇','太阴','六合','白虎','玄武','九地','九天'];
const TERMS_CN = ['春分','清明','谷雨','立夏','小满','芒种','夏至','小暑','大暑','立秋','处暑','白露','秋分','寒露','霜降','立冬','小雪','大雪','冬至','小寒','大寒','立春','雨水','惊蛰'];
let seed = 20261121; function rnd() { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }
const p2 = n => String(n).padStart(2, '0');
const key = d => '' + d.getUTCFullYear() + p2(d.getUTCMonth() + 1) + p2(d.getUTCDate()) + p2(d.getUTCHours()) + p2(d.getUTCMinutes());
// d: Date mà các trường UTC = giờ đồng hồ Việt Nam
function termAt(dVN) {              // tiết khí tại cùng thời điểm vật lý: giờ Bắc Kinh = giờ VN + 1h
  const b = new Date(dVN.getTime() + 3600e3);
  return Solar.fromYmdHms(b.getUTCFullYear(), b.getUTCMonth() + 1, b.getUTCDate(), b.getUTCHours(), b.getUTCMinutes(), 0).getLunar().getPrevJieQi(false).getName();
}
function one(dVN, nhan) {
  const s = dVN.getUTCFullYear() + '-' + p2(dVN.getUTCMonth() + 1) + '-' + p2(dVN.getUTCDate()) + ' ' + p2(dVN.getUTCHours()) + ':' + p2(dVN.getUTCMinutes()) + ':00';
  const raw = QimenChart.byDatetime(s);
  const term = termAt(dVN);
  const c = QimenChart.byDatetime(s, { solarTerm: term });
  const tk = TERMS_CN.indexOf(term);
  const day = c.timeInfo.chineseDay, hour = c.timeInfo.chineseTime;
  const gz = x => { const a = TG.indexOf(x[0]), b = DZ.indexOf(x[1]); return ((6 * a - 5 * b) % 60 + 60) % 60; };
  const P = {}; c.palaces.forEach(p => P[p.position] = p);
  const first = x => Array.isArray(x) ? x[0] : x;
  // 3meta: 8 ô ngoài, mỗi ô 4 ký tự: can thiên bàn, sao, cửa, thần (chỉ số); địa bàn 9 ô riêng (ô 2 của 3meta gộp can ô giữa → lấy phần tử đầu)
  const dia = [1,2,3,4,5,6,7,8,9].map(i => TG.indexOf(first(P[i].earthlyStem))).join('');
  const o8 = [1,2,3,4,6,7,8,9].map(i => '' + TG.indexOf(first(P[i].heavenlyStem)) + SAO.indexOf(first(P[i].star)) + MON.indexOf(P[i].gate) + THAN.indexOf(P[i].deity)).join('');
  const m3 = [c.ju.type === '阳遁' ? 'd' : 'a', c.ju.number, ['上元','中元','下元'].indexOf(c.yuan), SAO.indexOf(c.zhiFu.star), c.zhiFu.position, MON.indexOf(c.zhiShi.gate), c.zhiShi.position].join('');
  // bigfish: cục theo chaiBuJu (truyền ngày can chi đã đổi lúc 23h của lunar → không truyền giờ)
  const cb = chaiBuJuByGanZhi(term, day[0], day[1]);
  const fp = { year: { gan: 'x', zhi: 'x' }, month: { gan: 'x', zhi: 'x' }, day: { gan: day[0], zhi: day[1] }, hour: { gan: hour[0], zhi: hour[1] } };
  const b = shiJiaGenerate(hour[0], hour[1], cb.juNumber, cb.isYangDun ? 'yang' : 'yin', fp, term);
  const B = {}; b.palaces.forEach(p => B[p.palaceNumber] = p);
  const diaB = [1,2,3,4,5,6,7,8,9].map(i => TG.indexOf(B[i].skyStem)).join('');          // skyStem = địa bàn (ghi chú của chính thư viện)
  const o8B = [1,2,3,4,6,7,8,9].map(i => '' + TG.indexOf(B[i].earthStem) + SAO.indexOf(B[i].star) + MON.indexOf(B[i].door) + THAN.indexOf(B[i].god)).join('');
  const mB = [cb.isYangDun ? 'd' : 'a', cb.juNumber, ['上','中','下'].indexOf(cb.yuan), SAO.indexOf(b.zhiFuStar), b.zhiFuPalace, MON.indexOf(b.zhiShiDoor), b.zhiShiPalace].join('');
  const maB = [1,2,3,4,6,7,8,9].find(i => B[i].marks.includes('马')) || 0;
  const khongB = b.kongWang.map(x => DZ.indexOf(x)).join('');
  const r = { t: key(dVN), tk, ng: gz(day), gi: gz(hour), m3, dia, o8 };
  if (nhan) r.n = nhan;
  if (mB !== m3) r.mB = mB;
  if (diaB !== dia) r.diaB = diaB;
  if (o8B !== o8) r.o8B = o8B;
  r.kh = c.timeInfo.voidness.map(x => DZ.indexOf(x)).join('');
  if (khongB !== r.kh) r.khB = khongB;
  r.ma3 = DZ.indexOf(c.postHorse.branch); r.maB = maB;
  if (raw.timeInfo.solarTerm !== term) r.tkGoc = TERMS_CN.indexOf(raw.timeInfo.solarTerm);   // 3meta để nguyên (giờ Bắc Kinh) cho tiết khác
  return r;
}
const out = [];
// 1) 2.000 thời điểm ngẫu nhiên 1950–2050 (giờ VN, theo phút)
const t0 = Date.UTC(1950, 0, 1), t1 = Date.UTC(2050, 11, 31, 23, 59);
for (let i = 0; i < 2000; i++) out.push(one(new Date(t0 + Math.floor(rnd() * (t1 - t0) / 60000) * 60000)));
// 2) Sát giờ giao tiết: 150 tiết ngẫu nhiên, lúc −3 phút và +3 phút (giờ VN)
for (let i = 0; i < 150; i++) {
  const y = 1950 + Math.floor(rnd() * 101), tb = Solar.fromYmd(y, 6, 1).getLunar().getJieQiTable();
  const ks = Object.keys(tb).filter(k => /^[一-鿿]+$/.test(k)); const k = ks[Math.floor(rnd() * ks.length)], s = tb[k];
  const vn = Date.UTC(s.getYear(), s.getMonth() - 1, s.getDay(), s.getHour() - 1, s.getMinute(), 0);
  if (new Date(vn).getUTCFullYear() < 1950 || new Date(vn).getUTCFullYear() > 2050) continue;
  out.push(one(new Date(vn - 3 * 60000), 'truoc-tiet'), one(new Date(vn + 3 * 60000), 'sau-tiet'));
}
// 3) Giờ Tý muộn: 100 ngày ngẫu nhiên × 22:59, 23:00, 23:59, 00:00 hôm sau
for (let i = 0; i < 100; i++) {
  const d = t0 + Math.floor(rnd() * (t1 - t0) / 86400000) * 86400000;
  [[22, 59], [23, 0], [23, 59], [24, 0]].forEach(([h, m]) => out.push(one(new Date(d + (h * 60 + m) * 60000), 'ty-muon')));
}
// 4) Ví dụ đề xuất: 7/8/2022 quanh Lập thu
[[12, 0], [19, 0], [19, 25], [19, 35], [21, 0], [22, 0]].forEach(([h, m]) => out.push(one(new Date(Date.UTC(2022, 7, 7, h, m)), 'lap-thu-2022')));
const header = {
  nguon: ['3meta@2.6.0 (MIT, © 2025 3metaJun, https://github.com/3metaJun/3meta; lịch: lunar-typescript, MIT)',
    'bigfishmarquis-qimen@1.0.0 (MIT, © 2026 BigFishMarquis, https://github.com/perfhelf/bigfishmarquis-qimen)'],
  ngayTao: '2026-11-21', soMau: out.length,
  cachTao: 'Giờ đồng hồ Việt Nam đưa thẳng vào 3meta (can chi ngày/giờ theo giờ đồng hồ); tiết khí lấy tại cùng thời điểm vật lý (giờ Bắc Kinh = giờ VN + 1h) rồi truyền vào tùy chọn solarTerm. bigfish nhận cùng tiết khí và can chi ngày/giờ của 3meta, cục do chaiBuJuByGanZhi tính.',
  truong: {
    t: 'yyyyMMddHHmm giờ VN', tk: 'chỉ số tiết theo TIET_KHI (0 = Xuân Phân)', ng: 'chỉ số 60 Giáp Tý của ngày', gi: 'của giờ',
    m3: '3meta: độn(d/a) cục nguyên(0 thượng,1 trung,2 hạ) saoTrựcPhù cungTrựcPhù cửaTrựcSử cungTrựcSử',
    dia: 'can địa bàn ô 1..9 (chỉ số CAN)', o8: '8 ô 1,2,3,4,6,7,8,9 × [can thiên bàn chính, sao chính, cửa, thần]',
    mB: 'bigfish, chỉ ghi khi khác m3', diaB: 'bigfish, khi khác', o8B: 'bigfish, khi khác',
    kh: 'tuần không (2 chỉ số CHI) của 3meta', khB: 'bigfish khi khác', ma3: 'chi mã tinh của 3meta', maB: 'ô mã tinh của bigfish',
    tkGoc: 'tiết 3meta tự nhận khi để giờ Bắc Kinh (chỉ ghi khi khác tk)', n: 'nhóm ca biên'
  },
  chiSo: { sao: SAO.join(','), mon: MON.join(','), than: THAN.join(',') }
};
fs.writeFileSync(OUT, JSON.stringify({ header, mau: out }).replace(/\},\{"t"/g, '},\n{"t"') + '\n');
console.log('so mau', out.length);
