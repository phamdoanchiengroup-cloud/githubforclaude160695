/* ===== 08/11 TĂNG TỐC ĐỢT 4 – ĐĂNG NHẬP NHANH (chủ dự án: "CN, TP, PP mất hơn 20 giây để đăng nhập, thấy số") =====
   Chủ dự án chọn A: (1) Sheets API tự bật: 2-CAP-NHAT.bat ghi dịch vụ Sheets vào appsscript.json; lịch giữ nóng tự kiểm tra
   (đọc 2 cách so khớp như KIEM_TRA_SHEETS_API) rồi bật đọc gộp – mỗi lần đăng nhập đọc ~20 trang tính trong 1 lượt thay vì 20 lượt.
   (2) Giữ nóng bộ nhớ nhật ký dùng chung (NKD3): lịch 5 phút/lần (6h–22h) đọc lại sheet nhật ký khi bản nhớ sắp hết hạn,
   nên người đăng nhập không phải chờ đọc ~20.000 dòng. Lịch tự cài khi chủ sở hữu mở web (không cần chạy tay). */
var TT4_HAM = 'GIU_NONG_DANG_NHAP', TT4_LAM_MOI = 480;   // làm mới bản nhớ khi đã quá 8 phút (bản nhớ sống 15 phút)
function tt4CaiLich_() {
  var p = PropertiesService.getScriptProperties();
  if (p.getProperty('TT4_LICH') === '1' || p.getProperty('TT4_TAT') === '1') return;
  if (!ScriptApp.getProjectTriggers().some(function(t) { return t.getHandlerFunction() === TT4_HAM; }))
    ScriptApp.newTrigger(TT4_HAM).timeBased().everyMinutes(5).create();
  p.setProperty('TT4_LICH', '1');
}
function GIU_NONG_DANG_NHAP(e) {
  if (!noiBo_(e)) return chanWeb_('GIU_NONG_DANG_NHAP');
  var gio = gioVN_(); if (gio < 6 || gio >= 22) return;
  var p = PropertiesService.getScriptProperties(), t0 = Date.now();
  /* (1) Sheets API: tự kiểm tra 1 lần / ngày tới khi khớp (chủ dự án tắt tay bằng TAT_SHEETS_API thì thôi) */
  try {
    var sa = p.getProperty('KPI_SHEETS_API'), kt = p.getProperty('TT4_KT_API') || '', hn = homNayVN_();
    if (typeof Sheets !== 'undefined' && sa !== '1' && p.getProperty('KPI_SHEETS_TAT') !== '1' && kt !== hn) { p.setProperty('TT4_KT_API', hn); KIEM_TRA_SHEETS_API(e); }
  } catch (x) {}
  /* (2) nhật ký dùng chung: còn nóng thì thôi, sắp hết hạn thì đọc lại */
  try {
    var c = CacheService.getScriptCache(), pb = nkdPB_(), m = c.get(NKD_K + '_m'), tu = Number(c.get(NKD_K + '_t') || 0);
    m = m ? JSON.parse(m) : null;
    if (!(m && m.pb === pb && Date.now() - tu < TT4_LAM_MOI * 1000)) {
      var sh = ss_().getSheetByName(NKD_TEN);
      if (sh) nkdGhi_(pb, sh.getDataRange().getValues());
    }
  } catch (x) {}
  try { var n = Number(p.getProperty('TT4_DEM') || 0) + 1; if (n % 12 === 1) Logger.log('Giữ nóng đăng nhập: ' + (Date.now() - t0) + ' ms'); p.setProperty('TT4_DEM', String(n)); } catch (x) {}
}
/* Chạy tay nếu muốn tắt / bật lại lịch giữ nóng */
function TAT_GIU_NONG_DANG_NHAP() {
  if (!noiBo_(arguments[0])) return chanWeb_('TAT_GIU_NONG_DANG_NHAP');
  ScriptApp.getProjectTriggers().forEach(function(t) { if (t.getHandlerFunction() === TT4_HAM) ScriptApp.deleteTrigger(t); });
  var p = PropertiesService.getScriptProperties(); p.setProperty('TT4_TAT', '1'); p.deleteProperty('TT4_LICH'); Logger.log('Đã tắt lịch giữ nóng đăng nhập.');
}
function BAT_GIU_NONG_DANG_NHAP() {
  if (!noiBo_(arguments[0])) return chanWeb_('BAT_GIU_NONG_DANG_NHAP');
  var p = PropertiesService.getScriptProperties(); p.deleteProperty('TT4_TAT'); p.deleteProperty('TT4_LICH'); tt4CaiLich_(); Logger.log('Đã bật lịch giữ nóng đăng nhập (5 phút/lần, 6h–22h).');
}
function tt4TrangThai_() {
  var p = PropertiesService.getScriptProperties(), lich = false;
  try { lich = ScriptApp.getProjectTriggers().some(function(t) { return t.getHandlerFunction() === TT4_HAM; }); } catch (e) {}
  return { sheetsApi: typeof Sheets !== 'undefined' ? (p.getProperty('KPI_SHEETS_API') === '1' ? 'bat' : 'chuaKhop') : 'chuaCo', lich: lich };
}
