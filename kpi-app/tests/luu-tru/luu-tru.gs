/* ===== 08/11 DỌN DẸP HẰNG THÁNG (chủ dự án: "chỉ nên giữ tháng hiện tại và tháng trước") =====
   Ngày 1 hằng tháng 3h sáng (lịch tự cài khi chủ sở hữu mở web):
   1) Sao lưu tháng: chép cả file vào thư mục Drive "KPI_Backup_Thang", giữ 24 bản gần nhất (bản hằng ngày "KPI_Backup" vẫn giữ 30 ngày).
   2) Chỉ khi đã có bản sao tháng này:
      - Nhật ký sản lượng: tháng cũ hơn tháng trước (đã chốt chính thức) chuyển sang NhatKySanXuat_LuuTru cùng file (LUU_TRU_NHAT_KY, SO_THANG_GIU = 1).
        Bảng KPI, Thống kê, phân tích định mức, biểu đồ dài ngày tự đọc thêm trang lưu trữ khi cần (docNKTu_).
      - Nhật ký thao tác: xóa dòng trước đầu tháng trước (tra lại trong bản sao tháng). */
var LD_HAM = 'DON_DEP_HANG_THANG', LD_THU_MUC = 'KPI_Backup_Thang', LD_GIU = 24;
/* Nhật ký sản lượng từ ngày tu (yyyy-mm-dd; '' = toàn bộ): ghép thêm trang lưu trữ khi tu cũ hơn mốc lưu trữ */
function docNKTu_(tu) {
  var a = doc_('NhatKySanXuat'), moc = mocLuuTru_();
  if (!moc || (tu && String(tu).slice(0, 7) >= moc) || !ss_().getSheetByName(TEN_LUU_TRU)) return a;
  return docAnToan_(TEN_LUU_TRU).concat(a);
}
function ldCaiLich_() {
  var p = PropertiesService.getScriptProperties();
  if (p.getProperty('LD_LICH') === '1' || p.getProperty('LD_TAT') === '1') return;
  var ds = ScriptApp.getProjectTriggers();
  ds.forEach(function(t) { if (t.getHandlerFunction() === 'LUU_TRU_NHAT_KY') ScriptApp.deleteTrigger(t); });   // lịch cũ ngày 5 (nếu có) -> gộp vào lịch mới
  if (!ds.some(function(t) { return t.getHandlerFunction() === LD_HAM; })) {
    ScriptApp.newTrigger(LD_HAM).timeBased().onMonthDay(1).atHour(3).inTimezone(TZ_VN).create();
    try { var b = ScriptApp.newTrigger(LD_HAM).timeBased(); if (b.after) b.after(15 * 60 * 1000).create(); } catch (e) {}   // chạy lần đầu sau 15 phút
  }
  p.setProperty('LD_LICH', '1');
}
function saoLuuThang_() {
  var ky = kyVN_(), ten = SpreadsheetApp.getActiveSpreadsheet().getName() + ' — thang ' + ky, it = DriveApp.getFoldersByName(LD_THU_MUC);
  var tm = it.hasNext() ? it.next() : DriveApp.createFolder(LD_THU_MUC), co = false, ds = [], f = tm.getFiles();
  while (f.hasNext()) { var x = f.next(); if (x.isTrashed && x.isTrashed()) continue; if (x.getName() === ten) co = true; ds.push(x); }
  if (!co) { var moi = DriveApp.getFileById(SpreadsheetApp.getActiveSpreadsheet().getId()).makeCopy(ten, tm); ds.push(moi); }
  ds.sort(function(a, b) { return b.getDateCreated().getTime() - a.getDateCreated().getTime(); });
  ds.slice(LD_GIU).forEach(function(x) { x.setTrashed(true); });   // vào thùng rác Drive, không xóa vĩnh viễn
  return ten;
}
function donNhatKyThaoTac_() {
  var sh = ss_().getSheetByName('NhatKyThaoTac'); if (!sh || sh.getLastRow() < 2) return 0;
  var moc = kyTruoc_(kyVN_()) + '-01', v = sh.getRange(2, 1, sh.getLastRow() - 1, 1).getValues(), xoa = [];
  v.forEach(function(r, i) { var d = r[0]; if (!d) return; var ng = Object.prototype.toString.call(d) === '[object Date]' ? Utilities.formatDate(d, TZ_VN, 'yyyy-MM-dd') : String(d).slice(0, 10); if (/^\d{4}-\d{2}-\d{2}$/.test(ng) && ng < moc) xoa.push(i + 2); });
  if (xoa.length) xoaNhieuDong_('NhatKyThaoTac', xoa);
  return xoa.length;
}
function DON_DEP_HANG_THANG(e) {
  if (!noiBo_(e)) return chanWeb_(LD_HAM);
  var p = PropertiesService.getScriptProperties(), ky = kyVN_(), kq = [];
  try { kq.push('sao lưu: ' + saoLuuThang_()); p.setProperty('LD_SAO_LUU', ky); } catch (x) { kq.push('LỖI sao lưu tháng: ' + (x && x.message)); }
  if (p.getProperty('LD_SAO_LUU') === ky) {   // chưa sao lưu được thì chưa dọn
    try { LUU_TRU_NHAT_KY(e); kq.push('lưu trữ nhật ký sản lượng: xong'); } catch (x) { kq.push('LỖI lưu trữ nhật ký: ' + (x && x.message)); }
    try { kq.push('xóa ' + donNhatKyThaoTac_() + ' dòng nhật ký thao tác cũ'); } catch (x) { kq.push('LỖI dọn nhật ký thao tác: ' + (x && x.message)); }
  }
  p.setProperty('LD_LAN_CUOI', Utilities.formatDate(new Date(), TZ_VN, 'yyyy-MM-dd HH:mm') + ' · ' + kq.join(' · '));
  try { ghiLog_({ tk: 'HE_THONG', ten: 'Dọn dẹp tháng' }, 'Dọn dẹp hằng tháng', kq.join(' · '), '', ''); } catch (x) {}
  Logger.log(kq.join('\n'));
}
