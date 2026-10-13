/* ================== BỐ TRÍ MÁY TRONG SƠ ĐỒ 3D (13/10) ==================
   Chế độ "✥ Sắp xếp máy" của bản 3D: dời / xoay / nhân đôi / xóa máy. Trước đây chỉ nhớ trong trình duyệt đang dùng;
   nay lưu vào sheet BoTriMay để mọi người mở sơ đồ đều thấy cùng một bố trí.
   - Mỗi lần lưu thêm 1 dòng (dòng cuối = bố trí đang dùng, các dòng trên = lịch sử, muốn quay lại bản cũ thì xóa các dòng sau nó).
   - NoiDung = JSON {d:{'tầng|máy':[x0,y0,x1,y1,xoay,tên]}, n:[máy thêm], x:[máy xóa]} – chỉ ghi phần khác bản vẽ.
   - Xem: mọi vai trò có tab Sơ đồ. Sửa: chỉ ADMIN. */
var BTM_SHEET = 'BoTriMay', BTM_COT = ['ThoiGian', 'NguoiLuu', 'TomTat', 'NoiDung'], BTM_MAX = 45000;
function btmSheet_() {
  var ss = ss_(), sh = ss.getSheetByName(BTM_SHEET);
  if (!sh) {
    sh = ss.insertSheet(BTM_SHEET);
    sh.getRange(1, 1, 1, BTM_COT.length).setValues([BTM_COT]).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}
function btmSuaDuoc_(me) { return !!me && (me.vaiTro === 'ADMIN' || me.vaiTroGoc === 'ADMIN'); }
function layBoTriMay(token) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  var vt = MANH_GD.SoDo;
  if (vt.indexOf(me.vaiTro) < 0 && vt.indexOf(me.vaiTroGoc) < 0) return sach_({ ok: false, msg: 'Tài khoản không xem được sơ đồ.' });
  var sh = ss_().getSheetByName(BTM_SHEET), kq = { ok: true, sua: btmSuaDuoc_(me), data: null, luc: '', nguoi: '' };
  if (sh && sh.getLastRow() > 1) {
    var v = sh.getRange(sh.getLastRow(), 1, 1, 4).getDisplayValues()[0];
    try { kq.data = JSON.parse(v[3]); kq.luc = v[0]; kq.nguoi = v[1]; } catch (e) { kq.data = null; }
  }
  return sach_(kq);
}
function luuBoTriMay(token, json) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (!btmSuaDuoc_(me)) return sach_({ ok: false, msg: 'Chỉ ban điều hành (quản trị) được lưu bố trí máy.' });
  var o; try { o = JSON.parse(String(json || '')); } catch (e) { return sach_({ ok: false, msg: 'Dữ liệu bố trí không đọc được.' }); }
  if (!o || typeof o !== 'object' || Array.isArray(o)) return sach_({ ok: false, msg: 'Dữ liệu bố trí không đúng dạng.' });
  var d = (o.d && typeof o.d === 'object' && !Array.isArray(o.d)) ? o.d : {}, n = Array.isArray(o.n) ? o.n : [], x = Array.isArray(o.x) ? o.x : [];
  var chu = JSON.stringify({ d: d, n: n, x: x });
  if (chu.length > BTM_MAX) return sach_({ ok: false, msg: 'Bố trí quá lớn để lưu (' + chu.length + ' ký tự).' });
  var nd = Object.keys(d).length, tom = [nd && ('dời ' + nd + ' máy'), n.length && ('thêm ' + n.length + ' máy'), x.length && ('xóa ' + x.length + ' máy')].filter(Boolean).join(', ') || 'đúng bản vẽ';
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var sh = btmSheet_(), luc = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm');
    sh.appendRow(["'" + luc, me.ten || me.tk, tom, chu]);
    try { var shLog = ss_().getSheetByName('NhatKyThaoTac'); if (shLog) shLog.appendRow([new Date(), me.tk, 'Lưu bố trí máy 3D', tom, '', '']); } catch (e) {}
    return sach_({ ok: true, luc: luc, nguoi: me.ten || me.tk, tom: tom });
  } finally { lock.releaseLock(); }
}
