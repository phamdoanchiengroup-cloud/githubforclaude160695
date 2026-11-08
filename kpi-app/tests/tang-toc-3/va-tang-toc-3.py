# -*- coding: utf-8 -*-
"""Vá Code.gs – tăng tốc đợt 3 (08/11): bộ nhớ đệm nhật ký dùng chung, bộ đo tốc độ, khóa mã hóa bản lưu trên máy,
trang chính trả thẳng file (không biên dịch mẫu). Chạy bằng exec() cuối tests/va-code.py. Kiểm thử: tests/tang-toc-3.js"""
s = s.rstrip() + '\n' + io.open(os.path.join(os.path.dirname(__file__), 'tang-toc-3', 'toc-do-3.gs'), encoding='utf-8').read()
# 0) doGet: Index.html không có <? ?> -> trả thẳng file, khỏi biên dịch mẫu 0,8 MB mỗi lần mở trang
R("""  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
""", """  return HtmlService.createHtmlOutputFromFile('Index')   // 08/11: Index không có mẫu <? ?> -> khỏi biên dịch mỗi lần mở
""")
# thời điểm bắt đầu lượt gọi (biến toàn cục chạy lại mỗi lượt)
R("""var HAN_PHIEN = 6 * 60 * 60;""", """var __T0 = Date.now();   // 08/11: đo thời gian chạy mỗi lượt gọi (gắn __ms vào kết quả)
var HAN_PHIEN = 6 * 60 * 60;""")
R("""function sach_(v) {
  xong_();                                            // cuối lượt: ghi bộ đệm, tăng phiên bản dữ liệu nếu có ghi
  ganPhanDoi_(v);                                     // báo giao diện phần dữ liệu nào vừa đổi
  return sachLoi_(v);
}""", """function sach_(v) {
  xong_();                                            // cuối lượt: ghi bộ đệm, tăng phiên bản dữ liệu nếu có ghi
  ganPhanDoi_(v);                                     // báo giao diện phần dữ liệu nào vừa đổi
  var r = sachLoi_(v);
  if (r && typeof r === 'object' && Object.prototype.toString.call(r) !== '[object Array]' && 'ok' in r) r.__ms = Date.now() - __T0;   // 08/11 bộ đo
  return r;
}""")
R("""  Object.keys(r).forEach(function(k) { o[k] = goiBang_(r[k]); });
  return JSON.stringify(o);""", """  Object.keys(r).forEach(function(k) { o[k] = goiBang_(r[k]); });
  o.__ms = Date.now() - __T0;   // 08/11 bộ đo
  return JSON.stringify(o);""")
# 1) đọc nhật ký qua bộ nhớ dùng chung
R("""  if (__DOC_CACHE.hasOwnProperty(name)) return __DOC_CACHE[name];
  var sh = ss_().getSheetByName(name);
  if (!sh) { __DOC_CACHE[name] = []; return []; }
  var v = sh.getDataRange().getValues();""", """  if (__DOC_CACHE.hasOwnProperty(name)) return __DOC_CACHE[name];
  var pbNK = (name === NKD_TEN && nkdDung_()) ? nkdPB_() : '';   // 08/11: nhật ký dùng chung giữa các lượt gọi
  if (pbNK) { var vNK = nkdLay_(pbNK); if (vNK) { __NKD_TT.trung++; return (__DOC_CACHE[name] = bangThanhDoiTuong_(vNK)); } __NKD_TT.truot++; }
  var sh = ss_().getSheetByName(name);
  if (!sh) { __DOC_CACHE[name] = []; return []; }
  var v = sh.getDataRange().getValues();
  if (pbNK) nkdGhi_(pbNK, v);""")
R("""  var can = tenDs.filter(function(t) { return !__DOC_CACHE.hasOwnProperty(t) && !__CHO_GHI[t] && ss_().getSheetByName(t); });
  if (can.length < 2) return;
  try {
    var gop = docGopApi_(can);
    can.forEach(function(t) { __DOC_CACHE[t] = bangThanhDoiTuong_(gop[t] || []); });""", """  var can = tenDs.filter(function(t) { return !__DOC_CACHE.hasOwnProperty(t) && !__CHO_GHI[t] && ss_().getSheetByName(t); });
  var iNK = can.indexOf(NKD_TEN), pbNK = '';   // 08/11: nhật ký có trong bộ nhớ dùng chung -> khỏi đọc
  if (iNK >= 0 && nkdDung_()) { pbNK = nkdPB_(); var vNK = nkdLay_(pbNK); if (vNK) { __DOC_CACHE[NKD_TEN] = bangThanhDoiTuong_(vNK); can.splice(iNK, 1); pbNK = ''; __NKD_TT.trung++; } else __NKD_TT.truot++; }
  if (can.length < 2) return;
  try {
    var gop = docGopApi_(can);
    can.forEach(function(t) { __DOC_CACHE[t] = bangThanhDoiTuong_(gop[t] || []); });
    if (pbNK && gop[NKD_TEN]) nkdGhi_(pbNK, gop[NKD_TEN]);""")
R("""function xoaCache_(name) {
  __DA_GHI[name || '*'] = 1;""", """function xoaCache_(name) {
  if (!name || name === NKD_TEN) nkdBo_();            // 08/11: bỏ bản nhật ký dùng chung
  __DA_GHI[name || '*'] = 1;""")
R("""  tangPhienBan_();
  Logger.log('Đã xóa bộ nhớ tạm. Tải lại trang web để thấy số liệu mới.');""", """  tangPhienBan_(); nkdBo_();
  Logger.log('Đã xóa bộ nhớ tạm. Tải lại trang web để thấy số liệu mới.');""")
# 3) Thoát / đổi mật khẩu -> đổi khóa (bản lưu cũ trên các máy không mở được nữa)
R("""function dangXuat(token) {
  if (token) {""", """function dangXuat(token) {
  if (token) { try { var meX = docPhien_(token); if (meX) boKhoaLuu_(meX.tk); } catch (e) {}""")
R("""  ghiBam_(tk._row, taoBam_(moi));""", """  ghiBam_(tk._row, taoBam_(moi)); boKhoaLuu_(tk.TenDangNhap);   // 08/11: đổi mật khẩu -> bỏ khóa bản lưu trên máy""")
