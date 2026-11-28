# -*- coding: utf-8 -*-
"""Dựng sku-du-lieu.gs (bảng TÊN SẢN PHẨM → SKU) từ file chủ dự án gửi (28/11).
  python3 tao-sku.py <SEA_AGL_T12.xlsx> <Danh_sach_hang_hoa...xlsx> <dh.json đơn đang làm (tùy chọn)>
- File SEA: sheet đầu, cột A = tên tiếng Anh, cột B = SKU.
- Danh mục nội bộ: chỉ lấy dòng có TÊN tiếng Việt trùng đúng tên trong Sheet đơn (cần dh.json) – file 9.653 dòng quá lớn để nhúng hết.
- Bổ sung tay: thêm dòng vào BO_SUNG bên dưới (tên → SKU) rồi chạy lại.
Khóa = tên chuẩn hóa (HOA, bỏ dấu, gộp khoảng trắng, chuẩn gạch nối / dấu /) – giống skuChuan_ trong sku.gs."""
import sys,io,re,json,unicodedata,openpyxl
BO_SUNG = {}
def nm(t):
    t=unicodedata.normalize('NFD',str(t or '').upper()); t=''.join(c for c in t if unicodedata.category(c)!='Mn').replace('Đ','D')
    t=t.replace('–','-').replace('—','-').replace("''",'"').replace('’',"'")
    t=re.sub(r'\s*-\s*',' - ',t); t=re.sub(r'\s*/\s*','/',t); return re.sub(r'\s+',' ',t).strip()
M={}
wb=openpyxl.load_workbook(sys.argv[1],read_only=True,data_only=True)
for r in list(wb.worksheets[0].iter_rows(values_only=True))[1:]:
    if r and r[0] and r[1]: M[nm(r[0])]=str(r[1]).strip()
nCat=0
if len(sys.argv)>3:
    TEN={}
    for r in openpyxl.load_workbook(sys.argv[2],read_only=True,data_only=True)['Danh muc nội bộ'].iter_rows(values_only=True):
        if r and r[1] and r[2] and r[1]!='Mã': TEN.setdefault(nm(r[2]),str(r[1]).strip())
    for tab,R in json.load(open(sys.argv[3])).items():
        for r in R:
            k=nm(r[1] if len(r)>1 else '')
            if k and k not in M and k in TEN: M[k]=TEN[k]; nCat+=1
for k,v in BO_SUNG.items(): M[nm(k)]=v
D=__import__('os').path.dirname(__file__)
io.open(D+'/sku-du-lieu.gs','w',encoding='utf-8').write('/* SINH RA bằng tests/sku/tao-sku.py – đừng sửa tay. Bảng tên sản phẩm (chuẩn hóa) → SKU: '+str(len(M))+' dòng (file SEA_AGL_T12 + '+str(nCat)+' tên tiếng Việt trùng Danh mục nội bộ), 28/11. */\nvar SKU_TEN = '+json.dumps(M,ensure_ascii=False,sort_keys=True,indent=0)+';\n')
print('SKU_TEN',len(M),'từ danh mục',nCat)
