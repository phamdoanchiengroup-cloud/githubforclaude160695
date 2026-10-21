# -*- coding: utf-8 -*-
"""Vá Index.html – mục 26: mở gói dữ liệu nạp (máy chủ trả MỘT chuỗi JSON, mảng lớn ở dạng bảng { __b, c, h }).
Chạy bằng exec() ở cuối tests/va-index.py; dùng chung R() và s. Máy chủ: tests/tang-toc-2/va-tang-toc.py."""

# Hàm mở gói: đặt ngay trước napTruoc_ (cùng khối với luồng đăng nhập)
R("""var inApp=false;
/* B5: nạp dữ liệu song song với hoạt cảnh đăng nhập; vaoHeThong dùng lại kết quả nếu đã có / đang tải */""",
  """var inApp=false;
/* Tăng tốc 21/10: napDuLieu / napPhan trả MỘT chuỗi JSON; mảng lớn gói dạng bảng {__b:1,c:[cột],h:[[giá trị]]} (null = không có khóa) */
function moGoi_(r){
  if(typeof r==='string'){ try{ r=JSON.parse(r); }catch(e){ return {ok:false,msg:'Dữ liệu tải về bị lỗi, tải lại trang.'}; } }
  if(!r||typeof r!=='object') return r;
  for(var k in r){ var v=r[k];
    if(v&&v.__b===1&&v.c&&v.h){ var c=v.c, n=c.length, a=new Array(v.h.length);
      for(var i=0;i<v.h.length;i++){ var d=v.h[i], o={}; for(var j=0;j<n;j++){ if(d[j]!==null) o[c[j]]=d[j]; } a[i]=o; }
      r[k]=a; } }
  return r;
}
/* B5: nạp dữ liệu song song với hoạt cảnh đăng nhập; vaoHeThong dùng lại kết quả nếu đã có / đang tải */""")
# 1) nạp trước lúc khắc tên
R("""  google.script.run.withSuccessHandler(function(r){o.xong=true;o.r=r;if(o.cho)o.cho();})""",
  """  google.script.run.withSuccessHandler(function(r){o.xong=true;o.r=moGoi_(r);if(o.cho)o.cho();})""")
# 2) vaoHeThong khi chưa nạp trước (vd. sau đổi mật khẩu)
R("""    if(!o||o.tk!==tk){ google.script.run.withSuccessHandler(c.s).withFailureHandler(c.f).napDuLieu(tk); return; }""",
  """    if(!o||o.tk!==tk){ google.script.run.withSuccessHandler(function(r){ c.s(moGoi_(r)); }).withFailureHandler(c.f).napDuLieu(tk); return; }""")
# 3) reload sau khi lưu
R("""  var g=google.script.run.withSuccessHandler(function(r){
    busy(false);
    if(r.hetHan){hetHan();return}""", """  var g=google.script.run.withSuccessHandler(function(r){
    busy(false); r=moGoi_(r);
    if(r.hetHan){hetHan();return}""")
# 4) tự tải lại sản lượng khi mở tab (mục 25)
R("""  google.script.run.withSuccessHandler(function(r){
    LM.dang=false;
    if(!r||!r.ok)return;""", """  google.script.run.withSuccessHandler(function(r){
    LM.dang=false; r=moGoi_(r);
    if(!r||!r.ok)return;""")
