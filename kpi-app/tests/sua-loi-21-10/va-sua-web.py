# -*- coding: utf-8 -*-
"""Mục 25 của va-index.py – 4 lỗi chủ dự án báo 21/10 (phần trình duyệt; phần máy chủ: sua-loi-21-10/va-sua.py).
Chạy bằng exec() sau mục 24."""

# ---------------------------------------------------------------- 2. Dải nhắc của công nhân: bỏ ngày nghỉ cả ngày (chấm công) và ngày lễ
R("""        if(nghiDH(nD)) return;                 // nghỉ dài hạn
        dsChuaNhap.push(nD);""", """        if(nghiDH(nD)) return;                 // nghỉ dài hạn
        if(gioCoMatNgay(ME.maNV,nD)<=0) return; // nghỉ cả ngày theo chấm công (21/10)
        if(laNgayLeKH(nD,mx)) return;          // ngày lễ / xưởng được miễn
        dsChuaNhap.push(nD);""")
R("""      if(gioCoMatNgay(x.MaNV,nD)<=0) return;          // nghỉ cả ngày (theo điểm danh)""",
  """      if(gioCoMatNgay(x.MaNV,nD)<=0) return;          // nghỉ cả ngày (theo điểm danh)
      if(laNgayLeKH(nD,x.MaXuong)) return;            // ngày lễ / xưởng được miễn (21/10)""")

# ---------------------------------------------------------------- 3. Công đoạn đã ngừng vẫn hiện đúng tên ở màn duyệt / lịch sử
R("""function cd(m){var r=ix_('cd',D.congdoan,function(x){return x.MaCD})[m];return r?r:{TenCD:m,MaXuong:'',CachCham:'CN'}}""",
  """function cd(m){var r=ix_('cd',D.congdoan,function(x){return x.MaCD})[m];if(r)return r;
  for(var i=0,n=(D.cdNgung||[]);i<n.length;i++)if(n[i].MaCD===m)return n[i];   // công đoạn đã ngừng (21/10)
  return {TenCD:m,MaXuong:'',CachCham:'CN'}}""")

# ---------------------------------------------------------------- 1. Tab "KPI phòng" của trưởng/phó phòng ghi rõ xưởng
R("""  var h='<div class="ptitle">Bảng KPI</div>'+
    '<div class="pdesc">Xếp hạng theo tổng điểm KPI · từ cao xuống thấp · chọn kỳ để xem tháng, quý hoặc năm</div>';""",
  """  var h='<div class="ptitle">Bảng KPI'+((ME.vaiTro==='TP'||ME.vaiTro==='CN')&&ME.tenXuong?' – '+esc(ME.tenXuong):'')+'</div>'+
    '<div class="pdesc">Xếp hạng theo tổng điểm KPI · từ cao xuống thấp · chọn kỳ để xem tháng, quý hoặc năm</div>';""")

# ---------------------------------------------------------------- 3 + 4. Tự tải lại sản lượng khi mở tab (dữ liệu trước đây chỉ tải lúc đăng nhập)
_k25 = s.rfind('</body>')
s = s[:_k25] + io.open(os.path.join(D, 'sua-loi-21-10', 'lam-moi.html'), encoding='utf-8').read() + s[_k25:]
