# -*- coding: utf-8 -*-
"""Vá Index.html – 21/11 KPI mới từ T11: web không còn "Học việc"; ô Xếp loại / hạng lấy loại máy chủ (đã tính ngày công tối thiểu, "Thiếu công").
Chạy bằng exec() cuối tests/va-index.py. Kiểm thử: tests/kpi-moi.js (máy chủ)."""
def _w(cu, moi):
    global s
    assert s.count(cu) == 1, cu[:80]
    s = s.replace(cu, moi)
_w("function vhHocViec(){ if(!ME||ME.vaiTro!=='CN')return false;", "function vhHocViec(){ if(!ME||ME.vaiTro!=='CN'||today()>='2026-11-01')return false;   /* 21/11: bỏ học việc từ T11 */")
_w("tong: Number(o.tong) || 0, spl: Number(o.spl) || 0, may: true };", "tong: Number(o.tong) || 0, spl: Number(o.spl) || 0, may: true, loai: o.loai || '' };")
_w("""  var k=kpi(maNV);
  if(k){
    var lo=loai(k.tong);""", """  var k=kpi(maNV);
  if(k){
    var lo=loai(k.tong); if(k.loai){ lo=[k.loai, k.loai==='Thiếu công'?'p-bd':lo[1]]; }   // 21/11: loại máy chủ (ngày công tối thiểu)""")
_w("box('Xếp loại',vhHocViec()?'Học việc':lo[0],null,vhHocViec()?'tháng đầu chưa xếp loại':'A đến D')", "box('Xếp loại',vhHocViec()?'Học việc':lo[0],null,vhHocViec()?'tháng đầu chưa xếp loại':(lo[0]==='Thiếu công'?'đi làm dưới 50% ngày công':'S đến D'))")
_w("me.hang?'#'+me.hang+' / '+(theoXuong[me.MaXuong]||[]).length:'Học việc',null,me.hang?'trong xưởng':'tháng đầu chưa xếp hạng')", "me.hang?'#'+me.hang+' / '+(theoXuong[me.MaXuong]||[]).length:(me.loai==='Thiếu công'?'Thiếu công':'Học việc'),null,me.hang?'trong xưởng':(me.loai==='Thiếu công'?'chưa đủ 50% ngày công':'tháng đầu chưa xếp hạng'))")
_w("""var huy=!o.hang?'<span title="Đang học việc – chưa xếp hạng">–</span>'""", """var huy=!o.hang?'<span title="'+(o.loai==='Thiếu công'?'Thiếu công – chưa xếp hạng':'Đang học việc – chưa xếp hạng')+'">–</span>'""")
