/* ===== 17/11 (chủ dự án chọn "cảnh báo trước, khóa sau") – GIAI ĐOẠN 2: HỦY / BỚT / ĐỔI HẠN / SL CHỈ QUA WEB, KHÓA CỘT TRÊN SHEET ĐƠN =====
   - Cột khóa ở mọi tab kênh: Mã đơn (cột A), Loại hàng (tên SP), Số lượng đặt, Deadline, Hạn mới HT đơn cũ; tab ĐẾN HẠN 10 NGÀY: Deadline + Hạn mới
     (tab này đồng bộ 2 chiều sang tab kênh). Web vẫn ghi được (chạy bằng tài khoản chủ sở hữu): duyệt đơn Bán hàng, sửa SL / deadline trong bảng đơn, hủy / bớt.
   - CANH_BAO: Protection setWarningOnly – ai sửa trên Sheet thấy hộp cảnh báo của Google (vẫn sửa được) + web ghi nhật ký "Sửa tay" (tab SuaTay
     trong Sheet "CSDL Đơn hàng (web)": lúc, email nếu Google cho biết, tab, ô, cột, giá trị cũ → mới). Hết ~14 ngày chủ sở hữu bấm KHÓA HẲN.
   - KHOA: chỉ tài khoản chạy web (chủ sở hữu) sửa được các cột đó. '' = gỡ hết khóa có tiền tố "KPI web – " (không phụ thuộc trạng thái đã lưu).
   - Nhật ký ghi từ trigger onEdit đã có của Sheet đơn (DH_TAB10_SUA, không thêm trigger mới – tiết kiệm quota). Cứ 6 giờ (lượt đồng bộ 10 phút)
     rà lại: tab mới / Sheet thêm dòng / khóa bị ai gỡ -> đặt lại + ghi sổ; xóa nhật ký sửa tay cũ hơn 90 ngày.
   - Góp ý bao-mat-ung-dung 17/11: gỡ khóa cũ trước khi tạo (bấm 2 lần không trùng), addEditor(tài khoản chạy web) trước removeEditors, lưu trạng thái
     SAU khi khóa xong, dán nhiều ô ghi phạm vi + số ô, email thường rỗng với Gmail -> "không rõ" (xem Lịch sử chỉnh sửa của ô), chỉ 4 người xem nhật ký.
   Kiểm thử: tests/du-kien.js (mục Khóa Sheet) */
DHH_COT.SuaTay = ['Luc', 'Email', 'Tab', 'O', 'SoO', 'Cot', 'Cu', 'Moi'];
var DHK_PROP = 'DH_KHOA', DHK_TIEN_TO = 'KPI web – ', DHK_RA_GIO = 6, DHK_GIU_NGAY = 90, DHK_DU_DONG = 300, DHK_THEM_DONG = 500, DHK_NGAY_CANH_BAO = 14;
function dhkTT_() { var o = null; try { o = JSON.parse(PropertiesService.getScriptProperties().getProperty(DHK_PROP) || 'null'); } catch (e) {} return o && typeof o === 'object' ? o : { muc: '' }; }
function dhkNgay_(tu) { if (!tu) return 0; return Math.max(0, Math.floor((Date.parse(homNayVN_() + 'T00:00:00Z') - Date.parse(String(tu).slice(0, 10) + 'T00:00:00Z')) / 864e5)); }
/* Gỡ mọi khóa của web rồi (nếu muc) đặt lại. Gọi trong khóa script. -> { tab: {tên tab: {hdr, max, cot: {số cột: nhãn}}}, n, boQua: [] } */
function dhkAp_(muc) {
  var ss = SpreadsheetApp.openById(DH_SHEET_ID), RANGE = SpreadsheetApp.ProtectionType.RANGE, go = 0;
  ss.getSheets().forEach(function(sh) { sh.getProtections(RANGE).forEach(function(p) { if (String(p.getDescription() || '').indexOf(DHK_TIEN_TO) === 0) { p.remove(); go++; } }); });
  var kq = { tab: {}, n: 0, go: go, boQua: [] }; if (!muc) return kq;
  var toi = String(Session.getEffectiveUser().getEmail() || '').toLowerCase();
  var dat = function(sh, hdr, cot) {
    var max = sh.getMaxRows();
    if (max - sh.getLastRow() < DHK_DU_DONG) { try { sh.insertRowsAfter(max, DHK_THEM_DONG); max += DHK_THEM_DONG; } catch (e) {} }   // còn ít dòng trống: thêm dòng để đơn mới vẫn nằm trong vùng khóa
    if (max <= hdr) return;
    Object.keys(cot).forEach(function(c) {
      var p = sh.getRange(hdr + 1, Number(c), max - hdr, 1).protect().setDescription(DHK_TIEN_TO + cot[c] + (muc === 'KHOA' ? ' (khóa – sửa trên web)' : ' (cảnh báo – nên sửa trên web)'));
      if (muc === 'CANH_BAO') p.setWarningOnly(true);
      else {
        try { p.addEditor(Session.getEffectiveUser()); } catch (e) {}
        var bo = p.getEditors().filter(function(u) { return String(u.getEmail() || '').toLowerCase() !== toi; });
        if (bo.length) p.removeEditors(bo);
        try { if (p.canDomainEdit()) p.setDomainEdit(false); } catch (e) {}
      }
      kq.n++;
    });
    kq.tab[String(sh.getName())] = { hdr: hdr, max: max, cot: cot };
  };
  var tabs = DH_TABS.slice(); try { (dhDocDonGoc_(false).tabMoi || []).forEach(function(t) { if (tabs.indexOf(t) < 0) tabs.push(t); }); } catch (e) {}
  tabs.forEach(function(tab) {
    var sh = dhTabGhi_(ss, tab); if (!sh || DH_TAB_LOAI.test(String(sh.getName()).trim()) || kq.tab[String(sh.getName())]) return;
    var meta = dhMetaTab_(sh, tab); if (!meta || !(meta.ten >= 0) || !(meta.sl >= 0)) { kq.boQua.push(tab); return; }
    var cot = {}; cot[1] = 'Mã đơn'; cot[meta.ten + 1] = 'Loại hàng (tên SP)'; cot[meta.sl + 1] = 'Số lượng đặt';
    if (meta.dl >= 0) cot[meta.dl + 1] = 'Deadline'; if (meta.hanMoi >= 0) cot[meta.hanMoi + 1] = 'Hạn mới HT đơn cũ';
    dat(sh, meta.hdr, cot);
  });
  var s10 = ss.getSheetByName(DH10_TEN);
  if (s10) {
    var v = s10.getRange(1, 1, Math.min(3, Math.max(1, s10.getLastRow())), Math.max(1, s10.getLastColumn())).getValues(), hdr = 0, c10 = {};
    for (var i = 0; i < v.length && !hdr; i++) v[i].forEach(function(x, j) { var t = String(x == null ? '' : x).trim().toUpperCase(); if (t === 'DEADLINE' || t === 'HẠN MỚI HT ĐƠN CŨ') { hdr = i + 1; c10[j + 1] = t === 'DEADLINE' ? 'Deadline (tab 10 ngày)' : 'Hạn mới (tab 10 ngày)'; } });
    if (hdr) dat(s10, hdr, c10);
  }
  return kq;
}
/* Chủ sở hữu: muc = 'CANH_BAO' | 'KHOA' | '' (gỡ) */
function datKhoaSheetDon(token, p) {
  var me = docPhien_(token); if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (!me.laOwner) return sach_({ ok: false, msg: 'Chỉ chủ sở hữu bật / tắt khóa cột Sheet đơn.' });
  var muc = String(p && p.muc || ''); if (['CANH_BAO', 'KHOA', ''].indexOf(muc) < 0) return sach_({ ok: false, msg: 'Thao tác không hợp lệ.' });
  var l = LockService.getScriptLock(); try { l.waitLock(25000); } catch (e) { return sach_({ ok: false, msg: 'Sheet đang được ghi – thử lại sau vài giây.' }); }
  try {
    var cu = dhkTT_(), kq;
    try { kq = dhkAp_(muc); } catch (e) { return sach_({ ok: false, msg: 'Chưa đặt được khóa: ' + String(e && e.message || e).slice(0, 200) + '. Tài khoản chạy web cần là chủ hoặc người được sửa Sheet đơn.' }); }
    if (muc) { try { dhCaiTab10_(); } catch (e) {} }   // nhật ký sửa tay dùng trigger onEdit DH_TAB10_SUA đã có
    var gio = dhhGio_(), st = muc ? { muc: muc, luc: gio, ai: String(me.ten || me.tk || '').slice(0, 60), tu: muc === 'CANH_BAO' ? (cu.muc === 'CANH_BAO' && cu.tu ? cu.tu : gio) : (cu.tu || ''), tab: kq.tab, n: kq.n, ra: Date.now() } : { muc: '', luc: gio, ai: String(me.ten || me.tk || '').slice(0, 60) };
    PropertiesService.getScriptProperties().setProperty(DHK_PROP, JSON.stringify(st));   // lưu SAU khi khóa xong
    try { var ss = dhhSS_(true); dhhThem_(ss, 'SuKien', [{ Luc: gio, Ai: st.ai, Tk: String(me.tk || ''), MaNV: String(me.maNV || ''), ThaoTac: 'KHOA_SHEET_' + (muc || 'GO'), Id: '', MaDong: '', ChiTiet: JSON.stringify({ n: kq.n, go: kq.go, tab: Object.keys(kq.tab), boQua: kq.boQua }).slice(0, 4000), Lenh: '' }]); } catch (e) {}
    try { ghiLog_(me, 'Khóa cột Sheet đơn', muc ? (muc === 'KHOA' ? 'Khóa hẳn' : 'Cảnh báo') + ' ' + kq.n + ' cột / ' + Object.keys(kq.tab).length + ' tab' : 'Gỡ ' + kq.go + ' khóa'); } catch (e) {}
    var nTab = Object.keys(kq.tab).length;
    return sach_({ ok: true, tt: dhkWeb_(st), msg: !muc ? 'Đã gỡ ' + kq.go + ' vùng khóa của web trên Sheet đơn.' :
      (muc === 'KHOA' ? 'Đã KHÓA HẲN ' : 'Đã bật CẢNH BÁO cho ') + kq.n + ' cột ở ' + nTab + ' tab' + (kq.boQua.length ? ' (bỏ qua ' + kq.boQua.join(', ') + ': không nhận ra cột)' : '') + '.' });
  } finally { l.releaseLock(); }
}
function dhkWeb_(st) { st = st || dhkTT_(); return { muc: st.muc || '', luc: st.luc || '', ai: st.ai || '', tu: st.tu || '', ngay: st.muc === 'CANH_BAO' ? dhkNgay_(st.tu) : 0, nTab: Object.keys(st.tab || {}).length, n: st.n || 0, hetCB: st.muc === 'CANH_BAO' && dhkNgay_(st.tu) >= DHK_NGAY_CANH_BAO ? 1 : 0 }; }
/* Người duyệt (4 người gồm chủ sở hữu): trạng thái khóa + 100 lần sửa tay mới nhất */
function layKhoaSheetDon(token) {
  var q = dbQuyen_(token); if (q.loi) return q.loi;
  if (!q.duyet) return sach_({ ok: false, msg: 'Chỉ Giám đốc / Phó GĐ / chị Kim Loan xem.' });
  var ss = dhhSS_(false), ds = ss ? dhhDoc_(ss, 'SuaTay') : [];
  return sach_({ ok: true, tt: dhkWeb_(), owner: q.me.laOwner ? 1 : 0, nSua: ds.length,
    sua: ds.slice(-100).reverse().map(function(r) { return { luc: r.Luc, ai: r.Email, tab: r.Tab, o: r.O, soO: Number(r.SoO) || 1, cot: r.Cot, cu: r.Cu, moi: r.Moi }; }) });
}
/* Gọi từ trigger onEdit của Sheet đơn (DH_TAB10_SUA, sau noiBo_): ô sửa thuộc cột khóa -> ghi nhật ký */
function dhkSuaTay_(e) {
  if (!e || !e.range || typeof e.range.getA1Notation !== 'function') return;
  var st = dhkTT_(); if (!st.muc || !st.tab) return;
  var rg = e.range, sh = rg.getSheet(), m = st.tab[String(sh.getName())]; if (!m) return;
  var r0 = rg.getRow(), nr = rg.getNumRows(), c0 = rg.getColumn(), nc = rg.getNumColumns();
  if (r0 + nr - 1 <= m.hdr) return;
  var cs = Object.keys(m.cot).map(Number).filter(function(c) { return c >= c0 && c < c0 + nc; }); if (!cs.length) return;
  var ai = ''; try { ai = e.user && typeof e.user.getEmail === 'function' ? String(e.user.getEmail() || '') : ''; } catch (x) {}
  var mot = nr === 1 && nc === 1;
  var rec = { Luc: dhhGio_(), Email: (ai || 'không rõ').slice(0, 80), Tab: String(sh.getName()).slice(0, 60), O: rg.getA1Notation().slice(0, 30), SoO: nr * nc, Cot: cs.map(function(c) { return m.cot[c]; }).join(', ').slice(0, 120),
    Cu: mot ? String(e.oldValue == null ? '' : e.oldValue).slice(0, 200) : '', Moi: mot ? String(e.value == null ? '' : e.value).slice(0, 200) : '(dán / sửa ' + (nr * nc) + ' ô)' };
  var l = LockService.getScriptLock(); if (!l.tryLock(3000)) return;
  try { dhhThem_(dhhSS_(true), 'SuaTay', [rec]); } finally { l.releaseLock(); }
}
/* Lượt đồng bộ 10 phút (đã giữ khóa): cứ 6 giờ rà lại khóa + dọn nhật ký cũ */
function dhkRa_() {
  var st = dhkTT_(); if (!st.muc) return;
  if (Date.now() - (Number(st.ra) || 0) < DHK_RA_GIO * 3600000) return;
  var ss = SpreadsheetApp.openById(DH_SHEET_ID), RANGE = SpreadsheetApp.ProtectionType.RANGE, ly = [];
  var dem = {}; ss.getSheets().forEach(function(sh) { dem[String(sh.getName())] = sh.getProtections(RANGE).filter(function(p) { return String(p.getDescription() || '').indexOf(DHK_TIEN_TO) === 0; }).length; });
  Object.keys(st.tab || {}).forEach(function(t) { var m = st.tab[t], sh = ss.getSheetByName(t);
    if (!sh) { ly.push('không thấy tab ' + t); return; }
    if ((dem[t] || 0) < Object.keys(m.cot).length) ly.push('khóa ở tab ' + t + ' bị gỡ');
    if (sh.getMaxRows() - sh.getLastRow() < DHK_DU_DONG || sh.getMaxRows() > m.max) ly.push('tab ' + t + ' thêm dòng'); });
  var tabs = DH_TABS.slice(); try { (dhDocDonGoc_(false).tabMoi || []).forEach(function(t) { tabs.push(t); }); } catch (e) {}
  tabs.forEach(function(tab) { var sh = dhTabGhi_(ss, tab); if (sh && !DH_TAB_LOAI.test(String(sh.getName()).trim()) && !(st.tab || {})[String(sh.getName())]) ly.push('tab mới ' + sh.getName()); });
  if (ly.length) {
    var kq = dhkAp_(st.muc); st.tab = kq.tab; st.n = kq.n;
    try { dhhThem_(dhhSS_(true), 'SuKien', [{ Luc: dhhGio_(), Ai: 'web (tự rà)', Tk: '', MaNV: '', ThaoTac: 'KHOA_SHEET_DAT_LAI', Id: '', MaDong: '', ChiTiet: JSON.stringify({ ly: ly.slice(0, 20), n: kq.n }).slice(0, 4000), Lenh: '' }]); } catch (e) {}
  }
  st.ra = Date.now(); PropertiesService.getScriptProperties().setProperty(DHK_PROP, JSON.stringify(st));
  try {   // dọn nhật ký sửa tay cũ hơn 90 ngày (dòng ghi theo thứ tự thời gian)
    var csdl = dhhSS_(false), sh2 = csdl && csdl.getSheetByName('SuaTay');
    if (sh2 && sh2.getLastRow() > 1) { var moc = Utilities.formatDate(new Date(Date.now() - DHK_GIU_NGAY * 864e5), TZ_VN, 'yyyy-MM-dd'), v = sh2.getRange(2, 1, sh2.getLastRow() - 1, 1).getValues(), k = 0;
      while (k < v.length && String(v[k][0]).replace(/^'/, '') < moc) k++; if (k) sh2.deleteRows(2, k); }
  } catch (e) {}
}
