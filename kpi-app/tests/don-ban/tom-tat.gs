/* ===== 18/11 (chủ dự án): SHEET "TÓM TẮT ĐƠN HÀNG CHO TRỢ LÝ (web)" – web tự ghi mỗi giờ (6h–22h, lượt đồng bộ 10 phút, giãn 60 phút) =====
   Để Claude (qua Google Drive) và Trợ lý Zalo sau này đọc ĐÚNG số của web: đã trừ hủy / bớt, tách tạm dừng, có ★, ngày dự kiến 5 làn.
   File riêng trong Drive chủ sở hữu (prop DTT_SS_ID), chỉ để đọc – web ghi đè mỗi lần. Các tab: TongQuan · TheoKenh · TungDon · TamDung · UuTien · DeNghi.
   Ngày "Dự kiến xong" = mô phỏng công suất (chưa dự phòng); cột "Cho Bán hàng" = + 2 ngày làm; "Kín lịch" = + 6 ngày làm. Kiểm thử: tests/thu-don.js */
var DTT_TEN = 'Tóm tắt đơn hàng cho trợ lý (web)', DTT_PROP = 'DTT_SS_ID', DTT_LUC = 'DTT_LUC', DTT_PHUT = 60, DTT_DON_MAX = 3000;
function dttSS_() {
  var p = PropertiesService.getScriptProperties(), id = p.getProperty(DTT_PROP);
  if (id) { try { return SpreadsheetApp.openById(id); } catch (e) {} }
  var ss = SpreadsheetApp.create(DTT_TEN); ss.getSheets()[0].setName('TongQuan'); p.setProperty(DTT_PROP, ss.getId()); return ss;
}
function dttGhi_(ss, ten, rows) {
  var sh = ss.getSheetByName(ten) || ss.insertSheet(ten); sh.clearContents();
  var nc = 1; rows.forEach(function(r) { if (r.length > nc) nc = r.length; });
  var v = rows.map(function(r) { var x = r.map(function(c) { return chuAnToan_(c == null ? '' : String(c)); }); while (x.length < nc) x.push(''); return x; });
  if (v.length) sh.getRange(1, 1, v.length, nc).setNumberFormat('@').setValues(v);
}
function dttDuLieu_() {
  var d = dhDocDon_(false), cs = dhCongSuat_(), G = dbkGiau_(d), N = dbtNhom_(G), R = dbkMoPhong_(G, null, cs), hn = homNayVN_();
  var kenh = {}; dbKenh_().forEach(function(z) { kenh[z[0]] = z[1]; });
  var don = [], theo = {}, tong = { thieu: 0, don: 0, tre: 0, setre: 0, cho: 0, dung: 0, eta: '' };
  Object.keys(N).forEach(function(k) {
    var g = N[k], x = R.m[k] || {}, eta = x.eta && x.eta < '9999' ? x.eta : '';
    var tt = !eta ? 'chờ hạn mới (trễ > 30 ngày)' : (!g.dl ? 'không deadline' : (g.dl < hn ? 'đã quá hạn' : (eta > g.dl ? 'dự kiến trễ' : 'kịp')));
    don.push([g.ma, kenh[g.tab] || g.tab, DBT_LAN_TEN[dbtLan_(g.tab)], g.thieu, g.sl, g.dl, eta, eta ? R.cong2(eta) : '', eta && g.dl ? dbkCach_(g.dl, eta) : '', tt, g.uu ? '★' : '']);
    var t = theo[g.tab] || (theo[g.tab] = { tab: g.tab, don: 0, thieu: 0, dung: 0, eta: '', tre: 0, setre: 0, cho: 0 });
    [t, tong].forEach(function(z) { z.don++; z.thieu += g.thieu; if (eta > z.eta) z.eta = eta; if (tt === 'đã quá hạn') z.tre++; if (tt === 'dự kiến trễ') z.setre++; if (!eta) z.cho++; });
  });
  var dung = [];
  G.don.forEach(function(o) { if (!o.dung || !(o.thieu > 0)) return; dung.push([o.maDon || '', kenh[o.tab] || o.tab, o.ten, o.thieu, o.dung.ly || '', o.dung.luc || '', o.dung.hen || '']);
    var t = theo[o.tab] || (theo[o.tab] = { tab: o.tab, don: 0, thieu: 0, dung: 0, eta: '', tre: 0, setre: 0, cho: 0 }); t.dung += o.thieu; tong.dung += o.thieu; });
  don.sort(function(a, b) { return String(a[6] || '9999').localeCompare(String(b[6] || '9999')) || String(a[0]).localeCompare(String(b[0])); });
  return { d: d, cs: cs, R: R, hn: hn, kenh: kenh, don: don, theo: theo, tong: tong, dung: dung };
}
function dttCapNhat_(ep) {
  var p = PropertiesService.getScriptProperties(), luc = Number(p.getProperty(DTT_LUC) || 0);
  if (!ep && Date.now() - luc < DTT_PHUT * 60000) return null;
  p.setProperty(DTT_LUC, String(Date.now()));
  var D = dttDuLieu_(), ss = dttSS_(), gio = Utilities.formatDate(new Date(), TZ_VN, 'yyyy-MM-dd HH:mm'), cf = D.cs.lan || dhLanCfg_(), T = D.tong;
  var choDuyet = 0, dn = []; try { var s2 = dhhSS_(false); if (s2) { choDuyet = dbDoc_(s2).filter(function(r) { return r.TrangThai === 'CHO_DUYET'; }).length;
    dn = dhhDoc_(s2, 'DeNghiUu').filter(function(r) { return r.TrangThai === 'CHO'; }).map(function(r) { return [r.MaDon, r.Tabs, r.NguoiTao, r.Luc, r.LyDo, r.NgayCan || '']; }); } } catch (e) {}
  dttGhi_(ss, 'TongQuan', [['Mục', 'Giá trị'], ['Cập nhật lúc', gio], ['Sheet đơn đọc lúc', D.d.luc || ''], ['Ghi chú', 'Web tự ghi mỗi giờ (6h–22h). Chỉ đọc – sửa ở đây sẽ bị ghi đè. Số đã trừ hủy / bớt, tách tạm dừng.'],
    ['Công suất (sp/ngày)', D.cs.sp], ['Chia làn', dhLanTxt_(cf)], ['Thứ tự nhận phần dư', cf.du.map(function(x) { return DH_LAN_TEN[x]; }).join(' → ')],
    ['Tổng còn phải làm (sp, đang sản xuất)', T.thieu], ['Số đơn đang làm', T.don], ['Tạm dừng (sp, không tính)', T.dung],
    ['Nhà máy xong hết khoảng (chưa dự phòng)', T.eta], ['Nhà máy kín lịch đến (+6 ngày làm)', T.eta ? D.R.congN(T.eta, DBK_DU_KIN) : ''],
    ['Đơn đã quá hạn', T.tre], ['Đơn chưa trễ nhưng dự kiến trễ', T.setre], ['Đơn chờ hạn mới (trễ > 30 ngày)', T.cho],
    ['Đơn Bán hàng chờ duyệt', choDuyet], ['Đề nghị ưu tiên chờ xử lý', dn.length]]);
  var thu = {}; DH_TABS.forEach(function(t, i) { thu[t] = i; });
  dttGhi_(ss, 'TheoKenh', [['Kênh', 'Làn', 'Số đơn', 'Còn phải làm (sp)', 'Tạm dừng (sp)', 'Xong hết khoảng', 'Kín lịch (+6 ngày làm)', 'Đã quá hạn', 'Dự kiến trễ', 'Chờ hạn mới']]
    .concat(Object.keys(D.theo).sort(function(a, b) { return ((thu[a] != null ? thu[a] : 99) - (thu[b] != null ? thu[b] : 99)) || a.localeCompare(b); }).map(function(t) { var z = D.theo[t];
      return [D.kenh[t] || t, DH_LAN_TEN[dbtLan_(t)], z.don, z.thieu, z.dung, z.eta, z.eta ? D.R.congN(z.eta, DBK_DU_KIN) : '', z.tre, z.setre, z.cho]; })));
  dttGhi_(ss, 'TungDon', [['Mã đơn', 'Kênh', 'Làn', 'Còn thiếu (sp)', 'SL đặt (dòng còn thiếu)', 'Deadline sớm nhất', 'Dự kiến xong (công suất)', 'Cho Bán hàng (+2 ngày làm)', 'Lệch (ngày, + = trễ)', 'Tình trạng', 'Ưu tiên']].concat(D.don.slice(0, DTT_DON_MAX)));
  dttGhi_(ss, 'TamDung', [['Mã đơn', 'Kênh', 'Mã sản phẩm', 'Còn thiếu (sp)', 'Lý do', 'Lúc dừng', 'Hẹn chạy lại']].concat(D.dung));
  var uw = {}; try { uw = dhUuWebDoc_(); } catch (e) {}
  dttGhi_(ss, 'UuTien', [['Mã đơn', 'Kênh', 'Người gắn ★', 'Lúc']].concat(Object.keys(uw).map(function(k) { var a = k.split('|'); return [a[0], D.kenh[a[1]] || a[1], uw[k].ai, uw[k].luc]; })));
  dttGhi_(ss, 'DeNghi', [['Mã đơn', 'Tab', 'Người đề nghị', 'Lúc', 'Lý do', 'Khách cần trước']].concat(dn));
  return { id: ss.getId(), luc: gio, don: D.don.length };
}
/* chủ sở hữu bấm cập nhật ngay (không chờ 1 giờ) */
function capNhatTomTatTroLy(token) { var q = qtQuyen_(token); if (q.loi) return q.loi; try { var r = dttCapNhat_(true); return sach_({ ok: true, msg: 'Đã cập nhật Sheet "' + DTT_TEN + '" (' + r.don + ' đơn).', id: r.id }); } catch (e) { return sach_({ ok: false, msg: 'Chưa cập nhật được: ' + String(e && e.message || e).slice(0, 150) }); } }
