
/* ===== 22/11 (chủ dự án): THÔNG BÁO ĐỔI DEADLINE cho Bán hàng (tab Order-Flow) =====
   - Sửa trên web (luuBangDon): ghi ngay, kèm tên người sửa.
   - Sửa thẳng trong Sheet đơn: so deadline hiện tại với bản ghi lần trước (sheet HanCuoi trong "CSDL Đơn hàng (web)") – chạy trong lượt đồng bộ
     10 phút (DH_TAB10_DONG_BO) và khi mở Order-Flow (tối đa 1 lần / 5 phút). Lần chạy đầu chỉ ghi mốc, không báo.
   - Chỉ xét mã còn thiếu > 0, bỏ hàng phụ; deadline = hạn mới nếu có. Hiện 7 ngày gần nhất. */
DHH_COT.DoiHan = ['Luc', 'Tab', 'MaDon', 'Ten', 'Cu', 'Moi', 'Nguon'];
DHH_COT.HanCuoi = ['Khoa', 'Dl'];
var DTH_NGAY = 7, DTH_CACH = 300;
function dthKhoa_(tab, ma, ten) { return String(tab || '') + '|' + String(ma || '') + '|' + plChuan_(ten); }
function dthGio_() { return Utilities.formatDate(new Date(), TZ_VN, 'yyyy-MM-dd HH:mm'); }
function dthRa_(d, ep) {
  var p = PropertiesService.getScriptProperties(), bay = Date.now();
  if (!ep && bay - Number(p.getProperty('DTH_LUC') || 0) < DTH_CACH * 1000) return 0;
  p.setProperty('DTH_LUC', String(bay));
  var ss = dhhSS_(true); if (!ss) return 0;
  d = d || dhDocDon_(false);
  var nay = {}; (d.don || []).forEach(function(o) { if (o.phu || !o.ten || !(o.thieu > 0)) return; nay[dthKhoa_(o.tab, o.maDon, o.ten)] = { dl: o.dl || '', o: o }; });
  var cu = {}, coCu = false; dhhDoc_(ss, 'HanCuoi').forEach(function(r) { coCu = true; cu[r.Khoa] = r.Dl; });
  var moc = Utilities.formatDate(new Date(bay - 864e5), TZ_VN, 'yyyy-MM-dd HH:mm'), web = {};
  dhhDoc_(ss, 'DoiHan').forEach(function(r) { if (r.Luc >= moc && r.Nguon !== 'Sheet') web[r.Tab + '|' + plChuan_(r.Ten) + '|' + r.Moi] = 1; });
  var ev = [], doi = false;
  Object.keys(nay).forEach(function(k) {
    var x = nay[k]; if (!(k in cu)) { doi = true; return; }
    if (String(cu[k]) === String(x.dl)) return; doi = true;
    if (coCu && !web[x.o.tab + '|' + plChuan_(x.o.ten) + '|' + x.dl]) ev.push({ Luc: dthGio_(), Tab: x.o.tab, MaDon: String(x.o.maDon || ''), Ten: x.o.ten, Cu: cu[k], Moi: x.dl, Nguon: 'Sheet' });
  });
  Object.keys(cu).forEach(function(k) { if (!(k in nay)) doi = true; });
  if (ev.length) dhhThem_(ss, 'DoiHan', ev);
  if (doi || !coCu) {
    var sh = ss.getSheetByName('HanCuoi'); if (!sh) { sh = ss.insertSheet('HanCuoi'); }
    sh.clearContents(); var rows = [DHH_COT.HanCuoi].concat(Object.keys(nay).map(function(k) { return [k, nay[k].dl]; }));
    sh.getRange(1, 1, rows.length, 2).setNumberFormat('@').setValues(rows);
    try { sh.hideSheet(); } catch (e) {}
  }
  if (ev.length) { try { CacheService.getScriptCache().remove('DTH_DS'); } catch (e) {} }
  return ev.length;
}
function dthGhiWeb_(ds, me) {   // gọi từ luuBangDon sau khi ghi deadline vào Sheet
  if (!ds || !ds.length) return;
  var ss = dhhSS_(true), d = null; try { d = dhDocDon_(false); } catch (e) {}
  var ma = {}; if (d) (d.don || []).forEach(function(o) { ma[o.tab + '|' + o.dong] = o.maDon || ''; });
  dhhThem_(ss, 'DoiHan', ds.map(function(x) { return { Luc: dthGio_(), Tab: x.tab, MaDon: x.maDon || ma[x.tab + '|' + x.dong] || '', Ten: x.ten, Cu: x.cu || '', Moi: x.moi || '', Nguon: String(me && (me.ten || me.tk) || 'web').slice(0, 60) }; }));
  try { CacheService.getScriptCache().remove('DTH_DS'); } catch (e) {}
}
function dthDs_() {   // -> [[luc, tab, maDon, ten, cu, moi, nguon]] 7 ngày gần nhất, mới trước (nhớ tạm 2 phút)
  var c = CacheService.getScriptCache(); try { var s = c.get('DTH_DS'); if (s) return JSON.parse(s); } catch (e) {}
  var ss = dhhSS_(false); if (!ss) return [];
  var moc = Utilities.formatDate(new Date(Date.now() - DTH_NGAY * 864e5), TZ_VN, 'yyyy-MM-dd');
  var a = dhhDoc_(ss, 'DoiHan').filter(function(r) { return r.Luc >= moc; }).map(function(r) { return [r.Luc, r.Tab, r.MaDon, r.Ten, r.Cu, r.Moi, r.Nguon === 'Sheet' ? '' : r.Nguon]; });
  a.sort(function(x, y) { return x[0] < y[0] ? 1 : -1; }); a = a.slice(0, 200);
  try { c.put('DTH_DS', JSON.stringify(a), 120); } catch (e) {}
  return a;
}
