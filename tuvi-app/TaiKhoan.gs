/**
 * ============================================================
 *  TaiKhoan.gs — TÀI KHOẢN ĐĂNG NHẬP & CHẾ ĐỘ KHÁCH
 *  - Tài khoản lưu trong Script Properties (khóa "TK_<tên>"), mật khẩu chỉ lưu dạng băm
 *    SHA-256 lặp TK_VONG vòng kèm salt ngẫu nhiên – không lưu mật khẩu gốc.
 *  - Phiên đăng nhập: mã ngẫu nhiên (UUID) giữ trong CacheService 6 giờ, gia hạn khi dùng.
 *  - Sai mật khẩu 5 lần → khóa tài khoản 15 phút.
 *  - Khách (chưa đăng nhập) vẫn lập được lá số, nhưng máy chủ chỉ trả về bản rút gọn
 *    (lá số + phần "hé lộ" như bản PDF xem thử); phần luận giải không rời khỏi máy chủ.
 *  - Vai trò: "chu" (chủ sở hữu – toàn quyền, quản trị), "vip" (xem không giới hạn, không quản trị)
 *    và "thanhVien" (tự đăng ký, mở khóa bằng xu – xem ThanhToan.gs).
 * ============================================================
 */
var TK_VONG = 400;
var TK_CHU = 'chienpham';
// Tài khoản chủ sở hữu khởi tạo sẵn (chỉ lưu salt + mã băm). Đổi mật khẩu trong ứng dụng sẽ ghi đè bản này.
var TK_CHU_SEED = { salt: '7fe52eb72ec40dc415be44affb00a655', hash: '9024324c936271c58add64e8807a84f33453831fbf8a08dcd8f70272a35c2cac', vaiTro: 'chu', hienThi: 'Chủ sở hữu' };

function tkHex_(bytes) { return bytes.map(function (b) { var v = (b + 256) % 256; return (v < 16 ? '0' : '') + v.toString(16); }).join(''); }
function tkSha_(s) { return tkHex_(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, s, Utilities.Charset.UTF_8)); }
function tkBam_(pass, salt) { var h = tkSha_(salt + ':' + pass); for (var i = 0; i < TK_VONG; i++) h = tkSha_(h + salt); return h; }
function tkSalt_() { return Utilities.getUuid().replace(/-/g, ''); }
function tkTen_(u) { return String(u || '').trim().toLowerCase(); }
function tkProps_() { return PropertiesService.getScriptProperties(); }
function tkDoc_(u) {
  u = tkTen_(u);
  var v = tkProps_().getProperty('TK_' + u);
  if (!v && u === TK_CHU) { tkGhi_(u, TK_CHU_SEED); return JSON.parse(JSON.stringify(TK_CHU_SEED)); }
  return v ? JSON.parse(v) : null;
}
function tkGhi_(u, o) { tkProps_().setProperty('TK_' + tkTen_(u), JSON.stringify(o)); }
function tkBang_(a, b) { if (a.length !== b.length) return false; var d = 0; for (var i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0; }
function tkKiemMatKhau_(p) {
  p = String(p || '');
  if (p.length < 8) throw new Error('Mật khẩu cần ít nhất 8 ký tự.');
  if (!/[A-Za-z]/.test(p) || !/[0-9]/.test(p)) throw new Error('Mật khẩu cần có cả chữ và số.');
  return p;
}
function tkNguoi_(u, o) { return { ten: u, hienThi: o.hienThi || u, vaiTro: o.vaiTro || 'thanhVien' }; }
var TK_VAI_TRO = { chu: 'Chủ sở hữu', vip: 'Thành viên VIP', thanhVien: 'Thành viên' };

/* ---------- Phiên ---------- */
function tkPhien_(token) {
  if (!token || typeof token !== 'string' || token.length < 20) return null;
  var c = CacheService.getScriptCache(), v = c.get('SS_' + token);
  if (!v) return null;
  var s = JSON.parse(v), o = tkDoc_(s.ten);
  if (!o) { c.remove('SS_' + token); return null; }
  c.put('SS_' + token, v, 21600);
  return tkNguoi_(s.ten, o);
}
function tkCan_(token, chiChu) {
  var u = tkPhien_(token);
  if (!u) throw new Error('Cần đăng nhập để dùng chức năng này.');
  if (chiChu && u.vaiTro !== 'chu') throw new Error('Chỉ chủ sở hữu mới dùng được chức năng này.');
  return u;
}

/* ---------- API cho giao diện ---------- */
function dangNhap(user, pass) {
  var u = tkTen_(user), c = CacheService.getScriptCache(), k = 'SAI_' + u;
  var sai = parseInt(c.get(k) || '0', 10);
  if (sai >= 5) throw new Error('Tài khoản tạm khóa do nhập sai nhiều lần. Thử lại sau 15 phút.');
  var o = tkDoc_(u);
  if (!o || !tkBang_(tkBam_(String(pass || ''), o.salt), o.hash)) {
    c.put(k, String(sai + 1), 900);
    Utilities.sleep(600);
    throw new Error('Sai tên đăng nhập hoặc mật khẩu.');
  }
  c.remove(k);
  var token = Utilities.getUuid() + Utilities.getUuid().replace(/-/g, '');
  c.put('SS_' + token, JSON.stringify({ ten: u }), 21600);
  o.lanCuoi = new Date().toISOString(); tkGhi_(u, o);
  return { token: token, nguoiDung: tkNguoi_(u, o) };
}
function phien(token) { return tkPhien_(token); }
function dangXuat(token) { if (token) CacheService.getScriptCache().remove('SS_' + token); return true; }
function doiMatKhau(token, cu, moi) {
  var u = tkCan_(token), o = tkDoc_(u.ten);
  if (!tkBang_(tkBam_(String(cu || ''), o.salt), o.hash)) throw new Error('Mật khẩu hiện tại không đúng.');
  tkKiemMatKhau_(moi);
  o.salt = tkSalt_(); o.hash = tkBam_(moi, o.salt); tkGhi_(u.ten, o);
  return true;
}
function dsTaiKhoan(token) {
  tkCan_(token, true);
  tkDoc_(TK_CHU);
  var p = tkProps_().getProperties(), out = [];
  Object.keys(p).forEach(function (k) {
    if (k.indexOf('TK_') !== 0) return;
    var o = JSON.parse(p[k]), u = k.slice(3);
    out.push({ ten: u, hienThi: o.hienThi || u, vaiTro: o.vaiTro || 'thanhVien', lienHe: o.lienHe || '', tuDangKy: !!o.tuDangKy, gioiThieu: o.gioiThieu || '', taoLuc: o.taoLuc || '', lanCuoi: o.lanCuoi || '' });
  });
  var TT = { chu: 0, vip: 1, thanhVien: 2 };
  return out.sort(function (a, b) { return (TT[a.vaiTro] || 2) - (TT[b.vaiTro] || 2) || String(b.taoLuc).localeCompare(String(a.taoLuc)); });
}
function tkTaoMoi_(user, pass, hienThi, vaiTro, them) {
  var u = tkTen_(user);
  if (!/^[a-z0-9._-]{3,32}$/.test(u)) throw new Error('Tên đăng nhập 3–32 ký tự: chữ thường không dấu, số, dấu chấm, gạch.');
  if (tkDoc_(u)) throw new Error('Tên đăng nhập đã tồn tại.');
  tkKiemMatKhau_(pass);
  var salt = tkSalt_(), o = { salt: salt, hash: tkBam_(pass, salt), vaiTro: vaiTro, hienThi: String(hienThi || u).trim().slice(0, 60) || u, taoLuc: new Date().toISOString() };
  for (var k in (them || {})) o[k] = them[k];
  tkGhi_(u, o);
  return u;
}
function taoTaiKhoan(token, user, pass, hienThi, vaiTro) {
  tkCan_(token, true);
  tkTaoMoi_(user, pass, hienThi, vaiTro === 'vip' ? 'vip' : 'thanhVien');
  return dsTaiKhoan(token);
}
/** Khách tự đăng ký tài khoản thành viên, đăng nhập luôn */
function dangKy(user, pass, hienThi, lienHe, maGioiThieu) {
  var c = CacheService.getScriptCache(), n = parseInt(c.get('DK_DEM') || '0', 10);
  if (n >= 30) throw new Error('Hệ thống đang nhận quá nhiều đăng ký – vui lòng thử lại sau ít phút.');
  lienHe = String(lienHe || '').trim().slice(0, 80);
  var hopLe = lienHe.indexOf('@') >= 0 ? /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(lienHe) : /^\+?\d{9,13}$/.test(lienHe.replace(/[\s.-]/g, ''));
  if (!hopLe) throw new Error('Nhập số điện thoại hoặc email hợp lệ – dùng khi cần khôi phục tài khoản.');
  var gt = tkTen_(maGioiThieu), them = { lienHe: lienHe, tuDangKy: true };
  if (gt && gt !== tkTen_(user) && tkDoc_(gt)) them.gioiThieu = gt;
  var u = tkTaoMoi_(user, pass, hienThi, 'thanhVien', them);
  c.put('DK_DEM', String(n + 1), 600);
  return dangNhap(u, pass);
}
function qtDatVaiTro(token, user, vaiTro) {
  tkCan_(token, true);
  var u = tkTen_(user), o = tkDoc_(u);
  if (!o) throw new Error('Không tìm thấy tài khoản.');
  if (o.vaiTro === 'chu') throw new Error('Không đổi vai trò chủ sở hữu.');
  o.vaiTro = vaiTro === 'vip' ? 'vip' : 'thanhVien';
  tkGhi_(u, o);
  return dsTaiKhoan(token);
}
function datLaiMatKhau(token, user, pass) {
  tkCan_(token, true);
  var u = tkTen_(user), o = tkDoc_(u);
  if (!o) throw new Error('Không tìm thấy tài khoản.');
  tkKiemMatKhau_(pass);
  o.salt = tkSalt_(); o.hash = tkBam_(pass, o.salt); tkGhi_(u, o);
  return true;
}
function xoaTaiKhoan(token, user) {
  var me = tkCan_(token, true), u = tkTen_(user);
  if (u === TK_CHU || u === me.ten) throw new Error('Không thể xóa tài khoản chủ sở hữu.');
  tkProps_().deleteProperty('TK_' + u);
  return dsTaiKhoan(token);
}

/* ---------- Lập lá số theo quyền ---------- */
function lapLaSo(input, token) {
  input = input || {};
  var u = tkPhien_(token);
  if (!u) input.save = false;
  input.taiKhoan = u ? u.ten : '';
  var r = lapLaSoDayDu_(input);
  try { r.teaser = demoTeaser_(r); } catch (e) { r.teaser = {}; }
  var khoa = ttKhoaLaSo_(input), bg = ttBangGia_();
  if (!u) { var k = khachRutGon_(r); k.khoa = khoa; k.bangGia = bg; return k; }
  var q = ttQuyen_(u, khoa), soDu = q.toanQuyen ? null : ttSoDu_(u.ten), soVe = q.toanQuyen ? 0 : ttSoVe_(u.ten);
  if (!q.co_ban) {                                   // đã đăng nhập nhưng chưa mở lá số này: vẫn là bản rút gọn, kèm nút mở khóa
    var k2 = khachRutGon_(r);
    k2.nguoiDung = u; k2.khoa = khoa; k2.quyen = q; k2.bangGia = bg; k2.soDu = soDu; k2.soVe = soVe; k2.canMo = true; k2.saved = r.saved; k2.saveError = r.saveError;
    return k2;
  }
  if (!q.toanQuyen) ttCatPhan_(r, q);
  r.nguoiDung = u; r.khoa = khoa; r.quyen = q; r.bangGia = bg; r.soDu = soDu; r.soVe = soVe;
  return r;
}
/** Bản rút gọn cho khách: đủ để vẽ lá số và phần "hé lộ", không có lời luận */
function khachRutGon_(r) {
  var tv = r.tuvi, B = r.battu;
  return {
    khach: true, createdAt: r.createdAt, saoInfo: r.saoInfo, teaser: r.teaser,
    // Xem miễn phí: xuất thân, vóc dáng, tính cách, nghề hợp – để khách tự kiểm chứng độ chính xác
    mien: r.moRong && r.moRong.tongHop ? { xuatThan: r.moRong.tongHop.xuatThan, vocDang: r.moRong.tongHop.vocDang, tinhCach: r.moRong.tongHop.tinhCach, nghe: r.moRong.tongHop.nghe } : null,
    tuvi: { info: tv.info, palaces: tv.palaces, luanGiai: { cung: (tv.luanGiai.cung || []).map(function (c) { return { cung: c.cung, yNghia: c.yNghia }; }) } },
    battu: { pillars: B.pillars.map(function (p) { return { tru: p.tru, can: p.can, chi: p.chi, canTen: p.canTen, chiTen: p.chiTen, canHanh: p.canHanh, chiHanh: p.chiHanh }; }),
      nhatChu: B.nhatChu, cuong: B.cuong },
    moi: moiVanHan_(r)
  };
}
/** "Mồi" vận hạn cho bản giới hạn: chỉ khung + điểm, không có lời luận */
function moiVanHan_(r) {
  var CT = r.chiTiet || {}, T = (r.moRong && r.moRong.tongHop) || {}, vy = r.tuvi.info.viewYear;
  var out = {
    nam: vy,
    daiVan: (CT.daiVan || []).map(function (d) { return { khoang: d.khoang, nam: d.nam, cung: d.cung, diem: d.diem, danhGia: d.danhGia, isNow: d.isNow }; }),
    thang: (T.thang || []).map(function (m) { return { thang: m.thang, diem: m.diem, danhGia: m.danhGia }; }),
    namNay: T.namNay ? { tieuDe: T.namNay.tieuDe, diem: T.namNay.diem, dong: (T.namNay.ketLuan || [])[0] || '' } : null,
    tieuVan: CT.tieuVan ? { nam: CT.tieuVan.nam, canChi: CT.tieuVan.canChi, danhGia: CT.tieuVan.danhGia, diem: CT.tieuVan.diem } : null
  };
  return out;
}

/* ---------- Phần "hé lộ" (dùng cho khách và bản PDF xem thử) ---------- */
function che_(s) { return String(s).replace(/\b(19|20)(\d{2})\b/g, '$1██'); }
function demoTeaser_(res) {
  var I = res.tuvi.info, B = res.battu, M = res.moRong || {}, T = M.tongHop || {}, TL = T.tomLuoc, D = res.duDoan, vy = I.viewYear;
  var menh = res.tuvi.palaces[I.menh].chinh.map(function (s) { return s.n; }).join(' – ') || 'vô chính diệu';
  var cung = (res.tuvi.luanGiai.cung || []).slice().sort(function (a, b) { return b.diem - a.diem; });
  var dvNow = (res.chiTiet.daiVan || []).filter(function (d) { return d.isNow; })[0];
  var dvTot = (res.chiTiet.daiVan || []).filter(function (d) { return +String(d.nam).slice(0, 4) >= vy; }).sort(function (a, b) { return b.diem - a.diem; })[0];
  var out = {};
  out.tom = TL ? { lo: [TL.tieuDe + '.', TL.phuDe], an: ['2 điểm sáng khác được 6 hệ cùng xác nhận', '3 điều cần canh chừng – có 1 điều liên quan sức khỏe', '3 hành động then chốt cho 10 năm tới', 'Giai đoạn vàng của đời bạn: ' + che_(TL.chiSo[0].gt + ' tuổi (' + TL.chiSo[0].phu + ')')] } : null;
  out.chart = { lo: ['Mệnh ' + menh + ', Thân cư ' + I.thanCu + ', ' + I.cuc + '.', 'Cung mạnh nhất: ' + cung[0].cung + ' (' + cung[0].danhGia + ').'],
    an: ['Cung yếu nhất – nơi bạn dễ "mất" nhất: ███', 'Ý nghĩa của ' + (res.tuvi.palaces[I.menh].tuan || res.tuvi.palaces[I.menh].triet ? 'Tuần/Triệt đang đóng ở Mệnh' : 'bộ sao tam hợp chiếu Mệnh') + ' với vận của bạn'] };
  out.chart.lo.push('Lá số có ' + (res.tuvi.luanGiai.cachCuc || []).length + ' cách cục nổi bật, trong đó có "' + ((res.tuvi.luanGiai.cachCuc || [])[0] || { ten: '—' }).ten + '".');
  out.chart.an = out.chart.an.concat(['Luận chi tiết 12 cung: tài lộc, sự nghiệp, hôn nhân, con cái, sức khỏe, nhà cửa…', 'Cung ' + cung[cung.length - 1].cung + ' đang ở mức "' + cung[cung.length - 1].danhGia + '" – vì sao và cách hóa giải']);
  var HT = T.hoiTu;
  if (HT) {
    var nong = (HT.cuaSo || []).filter(function (c) { return c.nam >= vy; });
    var manh = []; HT.chuDe.forEach(function (c) { c.dinh.forEach(function (x) { manh.push({ ten: c.ten, x: x }); }); });
    manh.sort(function (a, b) { return b.x.soHe - a.x.soHe || a.x.nam - b.x.nam; });
    out.bien = { lo: ['Trong 30 năm tới có ' + manh.length + ' mốc biến cố được từ 3 hệ trở lên cùng chỉ ra' + (manh[0] ? ' – mạnh nhất là "' + manh[0].ten + '" với ' + manh[0].x.soHe + ' hệ đồng thuận.' : '.')],
      an: manh.slice(0, 4).map(function (m) { return m.ten + ': năm ' + che_(m.x.nam) + ' – ' + m.x.soHe + ' hệ cùng báo'; }).concat(nong.length ? ['Năm "nóng" nhất phía trước: ' + che_(nong[0].nam) + ' – ' + nong[0].cd.length + ' chủ đề cùng hội tụ'] : []) };
  }
  out.van = { lo: dvNow ? ['Bạn đang ở đại vận ' + dvNow.khoang + ' tại cung ' + dvNow.cung + ' – đánh giá: ' + dvNow.danhGia + '.'] : [],
    an: ['Năm ' + vy + ' qua năm lăng kính: lĩnh vực nào mở, lĩnh vực nào cần phòng', 'Tháng tốt nhất và tháng cần tránh trong năm ' + vy + ' (Tử Vi × Bát Tự × Thần số)', '7 ngày tới: ngày nào nên ký kết, ngày nào nên nghỉ ngơi'] };
  if (T.thang && T.thang.length) { var tt = T.thang.slice().sort(function (a, b) { return b.diem - a.diem; })[0]; out.van.lo.push('Một tháng sáng trong năm ' + vy + ': tháng ' + tt.thang + ' âm lịch (' + tt.danhGia.toLowerCase() + ').'); }
  out.battu = { lo: ['Tứ trụ ' + B.pillars.map(function (p) { return p.canTen + ' ' + p.chiTen; }).join(' · ') + '.', 'Nhật chủ ' + B.nhatChu + ' – ' + B.cuong + '.'],
    an: ['Dụng thần – yếu tố giúp bạn đổi vận: ███', 'Cách cục Bát Tự: ███ cách', 'Luận Tứ Trụ đủ 12 lĩnh vực: cha mẹ, anh em, hôn nhân, con cái, tài lộc, sự nghiệp, sức khỏe…', 'Lưu niên Tứ Trụ 14 năm – năm nào dễ có hỷ sự 💍, năm nào cần thủ'] };
  if (M.haLac) {
    var HL = M.haLac.luan;
    out.halac = { lo: ['Quẻ Tiên thiên của bạn: ' + M.haLac.tien.ten + ' – ' + M.haLac.tien.y + '.'],
      an: ['Quẻ Hậu thiên (nửa sau đời): ████', 'Quẻ năm ' + vy + ': ' + (HL.namNay ? HL.namNay.danhGia.replace(/./g, '█') : '███') + ' – lời khuyên cụ thể', '12 vận hào và ' + HL.nam.length + ' quẻ năm được luận chi tiết'] };
  }
  if (M.chiemTinhLuan) {
    var C = M.chiemTinh; var by = {}; C.hanhTinh.forEach(function (p) { by[p.key] = p; });
    out.astro = { lo: [M.chiemTinhLuan.tomTat + '.'], an: ['Sao Kim ở ███ – cách bạn yêu và điều bạn thật sự cần ở người kia', 'Mốc Sao Thổ hồi quy của bạn: năm ' + che_((M.chiemTinhLuan.chuKy.filter(function (c) { return c.ten === 'Sao Thổ hồi quy'; })[0] || { nam: 2000 }).nam), (C.goc || []).length + ' góc chiếu định hình tính cách'] };
  }
  if (M.thanSo) out.so = { lo: ['Số chủ đạo ' + M.thanSo.duongDoi + ' – ' + tsTenNgan_(M.thanSo.duongDoi) + '.'], an: ['Số linh hồn: █ · Số sứ mệnh: █', 'Năm cá nhân ' + vy + ' là năm số █ – nên làm gì', '4 đỉnh cao đời người: đỉnh thứ hai bắt đầu năm ' + che_(I.solar.year + M.thanSo.dinhCao[1].tu)] };
  if (M.hd) out.hd = { lo: ['Bạn thuộc loại ' + M.hd.loaiTen + '.'], an: ['Thẩm quyền ra quyết định: ███', 'Hồ sơ ' + M.hd.profile.replace(/\d/g, '█') + ' – vai trò của bạn trong đời', 'Bản đồ 9 trung tâm và các kênh năng lượng'] };
  if (T.matMa && out.tom) out.tom.an.push(T.matMa.length + ' "mật mã cá nhân": nguyên tố linh hồn, con số định mệnh, khung giờ vàng, quý nhân…');
  if (T.tinhCach) out.nguoi = { lo: ['Tính cách: ' + (T.tinhCach.truc.filter(function (t) { return Math.abs(t.gt) > 0.35; })[0] || { moTa: '—' }).moTa.split(':')[0] + '.', T.xuatThan && T.xuatThan.ketLuan[0] ? (T.xuatThan.ketLuan[0].t || T.xuatThan.ketLuan[0]) : ''].filter(function (x) { return typeof x === 'string'; }),
    an: ['Xuất thân và gia cảnh mà 6 hệ cùng chỉ ra', 'Vóc dáng, nét mặt và dấu hiệu trên cơ thể (bớt, nốt ruồi, vùng dễ tổn thương)', 'Điểm mạnh – điểm cần rèn được nhiều hệ xác nhận'] };
  if (T.phoiNgau) {
    var P = T.phoiNgau, top = P.tuoiHop.tot[0];
    out.duyen = { lo: [P.ketLuan[0] ? String(P.ketLuan[0].t || P.ketLuan[0]).split('.')[0] + '.' : 'Chân dung người bạn đời được ghép từ 5 hệ.'],
      an: [(I.male ? 'Người vợ' : 'Người chồng') + ' tương lai: dáng ███, tính ███, gặp qua ███', 'Năm kết hôn & năm có con kèm xác suất % từng năm – cả 10 năm đã qua (nếu bạn đã lập gia đình) và các năm phía trước', 'Chân dung con cái: trai/gái, số con, tính cách', 'Tuổi hợp nhất: ' + che_(top.nam) + ' (' + top.diem + '/10) · 4 năm sinh hợp khác', 'Tháng sinh âm lịch và dương lịch hợp: █, █, █'] };
  }
  if (T.duongDoi) out.doi = { lo: [String(T.duongDoi.ketLuan[0] || T.duongDoi.chuDe[0] || '').replace(/^[✓✗◇]\s*/, '').split(/\.\s/)[0] + '.'], an: ['Nghề được nhiều hệ cùng gợi ý nhất: ███', 'Chặng đời rực rỡ nhất: ███ tuổi', '12 đại vận Tử Vi chi tiết – Tứ Hóa, cung chức từng vận'] };
  out.them = { lo: ['Kiểm chứng giờ sinh bằng các sự kiện bạn đã trải qua.'], an: ['Bảng màu – số – hướng – ngày may mắn tổng hợp từ 6 hệ'] };
  return out;
}
function tsTenNgan_(n) { var m = { 1: 'người tiên phong', 2: 'người hòa giải', 3: 'người truyền cảm hứng', 4: 'người thực tế', 5: 'người tự do', 6: 'người nuôi dưỡng', 7: 'người tìm chân lý', 8: 'người quyền lực', 9: 'người nhân đạo', 10: 'người linh hoạt', 11: 'bậc thầy trực giác', 22: 'bậc thầy kiến tạo', 33: 'bậc thầy chữa lành' }; return m[n] || ''; }

