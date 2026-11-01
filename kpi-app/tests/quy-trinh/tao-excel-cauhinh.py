# Dựng file Excel cấu hình gậy + quy trình nháp từ <thư mục>/cauhinh.json. Dùng: python3 tao-excel-cauhinh.py <thư mục scratchpad> kpi-app/tests/quy-trinh/quy-trinh-web.html (file ra: <thư mục>/gui/Cau-hinh-gay-va-quy-trinh-nhap.xlsx, không commit)
import json,re,sys,unicodedata
from openpyxl import Workbook
from openpyxl.styles import Font,PatternFill,Alignment,Border,Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.utils import get_column_letter
S=sys.argv[1]; HTML=sys.argv[2]
d=json.load(open(S+'/cauhinh.json',encoding='utf8'))
N=d['nhan']
KIEU={'DANH':'Đánh','NHAY':'Nhảy','PHA':'Phá','PHANHAY':'Phá nhảy'}; VL={'FC':'Full carbon','MIX':'Mix carbon + GF','GF':'Glassfiber','KHAC':'Khác / chưa rõ'}
VLN={'FC':'FC','FCPHA':'FC','FCNHAY':'FC','MIX':'MIX','MIXFOAM':'MIX','MIXPHA':'MIX','NHAY139':'MIX','GFCB':'MIX','G750CB':'MIX','ZLUK':'MIX','GF29':'GF','GF1480':'GF'}
VLC={'MIXCB':'MIX','MIXCB25':'MIX','MIXCBPHA':'MIX','GFCBFOAM':'MIX','GFCB313':'MIX','GF736DP':'GF','GF736HK':'GF','GF740':'GF','GF1480':'GF','GFFOAM':'GF'}
def kieu(c,n):
    if c=='PHANHAY':return 'PHANHAY'
    if n.endswith('PHA') or c in('GF736DP','MIXCBPHA'):return 'PHA'
    if 'NHAY' in n or c.startswith('NHAY'):return 'NHAY'
    return 'DANH'
def vl(loai,c,n): return (VLC.get(c) if loai=='CHUOI' else (VLN.get(n) or VLC.get(c))) or 'KHAC'
TL=['GAY','NGON','CHUOI','NOI','PK']; TK=['DANH','NHAY','PHA','PHANHAY']; TV=['FC','MIX','GF','KHAC']
def nh(bang,k): return (k+' – '+N[bang].get(k,k)) if k and k!='KHONG' else ('—' if k=='KHONG' else '')
H=Font(bold=True,color='FFFFFF'); HF=PatternFill('solid',fgColor='1F4E79'); GF=PatternFill('solid',fgColor='DDEBF7'); YF=PatternFill('solid',fgColor='FFF2CC'); EF=PatternFill('solid',fgColor='E2EFDA')
th=Side(style='thin',color='BFBFBF'); B=Border(left=th,right=th,top=th,bottom=th)
def dau(ws,cols,widths):
    ws.append(cols)
    for i,c in enumerate(cols,1):
        x=ws.cell(1,i); x.font=H; x.fill=HF; x.alignment=Alignment(wrap_text=True,vertical='center'); ws.column_dimensions[get_column_letter(i)].width=widths[i-1]
    ws.freeze_panes='A2'; ws.row_dimensions[1].height=32
def nhom(ws,txt,n):
    ws.append([txt]); r=ws.max_row
    for i in range(1,n+1): ws.cell(r,i).fill=GF; ws.cell(r,i).font=Font(bold=True)
wb=Workbook()
# 0 hướng dẫn
w=wb.active; w.title='Hướng dẫn'
for l in ['CẤU HÌNH GẬY – bản Claude tổng hợp ngày 01/11/2026 (từ file THÔNG SỐ GẬY, danh mục mã hàng và 390 tên hàng trong Sheet "Trạng thái đơn hàng")',
 '',
 'Sheet "Dòng gậy": mọi dòng gậy web đang nhận ra, với 4 thông số chính (loại chuôi, loại ngọn, loại tip, loại ren) + đường kính đầu mặc định. Xếp theo: gậy → ngọn lẻ → chuôi lẻ; trong đó đánh / nhảy / phá / phá nhảy; trong đó Full carbon → Mix → Glassfiber.',
 '   Cột màu xanh lá "Sửa: …" để anh/chị ghi lại nếu thông số sai (để trống = đúng).',
 'Sheet "Tên hàng cần bổ sung" (nền vàng): 22 tên hàng web chưa chắc. Anh/chị chọn ở các cột xanh lá (có danh sách thả xuống).',
 'Sheet "Tất cả tên hàng": 390 tên trong đơn và cấu hình web đang hiểu – xem để phát hiện chỗ sai.',
 'Sheet "Bảng mã": nghĩa của từng mã chuôi / ngọn / tip / ren.',
 'Sheet "Quy trình nháp": quy trình từng xưởng mà web đang dùng – đây là BẢN NHÁP Claude tự soạn từ tên công đoạn + định mức + các file anh/chị gửi, không phải quy trình chuẩn của nhà máy. Anh/chị ghi chỗ sai vào các cột xanh lá.',
 '',
 'Gửi lại file này cho Claude (có thể sửa ít hay nhiều) – Claude sẽ đưa vào web. Không cần sửa trên web.']:
    w.append([l])
w.column_dimensions['A'].width=160; w['A1'].font=Font(bold=True,size=13)
# 1 dòng gậy
ws=wb.create_sheet('Dòng gậy')
cols=['Mã dòng','Tên dòng gậy','Loại hàng','Kiểu','Chất liệu','Loại chuôi','Loại ngọn','Loại tip','Loại ren','Đường kính đầu mặc định','Chuôi khi tay da sport','Tên gọi web dùng để nhận ra','Chắc chắn?','Số tên hàng trong đơn','Còn thiếu trong đơn','Sửa: chuôi','Sửa: ngọn','Sửa: tip','Sửa: ren','Sửa: ghi chú']
dau(ws,cols,[11,34,12,9,15,30,30,24,16,11,24,40,9,9,10,18,18,18,14,28])
dem={};thi={}
for t in d['ten']:
    k=t['pl'].get('dong') or ''; dem[k]=dem.get(k,0)+1; thi[k]=thi.get(k,0)+t['thieu']
rows=[]
for x in d['dong']:
    ma,ten,loai,al,c,n,tp,ren,chac=x[:9]; sp=x[9] if len(x)>9 else ''
    k=kieu(c,n); v=vl(loai,c,n)
    rows.append((TL.index(loai) if loai in TL else 9,TK.index(k),TV.index(v),ma,[ma,ten,N['loai'].get(loai,loai),KIEU[k],VL[v],nh('chuoi',c),nh('ngon',n),nh('tip',tp),nh('ren',ren),d['dau'].get(ma,''),nh('chuoi',sp) if sp else '',' | '.join(al),'Có' if chac else 'Chưa',dem.get(ma,0),thi.get(ma,0)]))
rows.sort(key=lambda r:(r[0],r[1],r[2],r[3]))
tr=None
for r in rows:
    g=r[4][2]+' – '+r[4][3]
    if g!=tr: tr=g; nhom(ws,g,len(cols))
    ws.append(r[4]); rr=ws.max_row
    if r[4][12]=='Chưa':
        for i in range(1,16): ws.cell(rr,i).fill=YF
    for i in range(16,21): ws.cell(rr,i).fill=EF
# 2 tên cần bổ sung
ws2=wb.create_sheet('Tên hàng cần bổ sung')
cols2=['Tên hàng (như trong Sheet đơn)','Số dòng đơn','Còn thiếu','Web đang đoán: dòng','Chuôi','Ngọn','Tip','Ren','Đầu','Vì sao chưa chắc','Điền: loại chuôi','Điền: loại ngọn','Điền: loại tip','Điền: loại ren','Điền: đường kính đầu','Điền: ghi chú']
dau(ws2,cols2,[46,8,9,22,22,22,18,12,7,34,24,24,20,14,10,30])
vang=[t for t in d['ten'] if t['pl'].get('tin')!='xanh' and t['pl'].get('loai') not in ('PK',)]
vang.sort(key=lambda t:(-t['thieu'],t['ten']))
def lst(b): return [k+' – '+v for k,v in N[b].items()]
ws_m=wb.create_sheet('Bảng mã')
col=1
dvs={}
for b,tn in [('chuoi','Loại chuôi'),('ngon','Loại ngọn'),('tip','Loại tip'),('ren','Loại ren')]:
    L=lst(b); ws_m.cell(1,col,tn).font=Font(bold=True)
    for i,v in enumerate(L,2): ws_m.cell(i,col,v)
    ws_m.column_dimensions[get_column_letter(col)].width=42
    dvs[b]="'Bảng mã'!$%s$2:$%s$%d"%(get_column_letter(col),get_column_letter(col),len(L)+1); col+=1
for t in vang:
    p=t['pl']; ws2.append([t['ten'],t['don'],t['thieu'],p.get('dong',''),nh('chuoi',p.get('chuoi','')),nh('ngon',p.get('ngon','')),nh('tip',p.get('tip','')),nh('ren',p.get('ren','')),p.get('dau',''),'; '.join(p.get('lyDo',[]))])
    rr=ws2.max_row
    for i in range(11,17): ws2.cell(rr,i).fill=EF
n2=ws2.max_row
for b,cl in [('chuoi','K'),('ngon','L'),('tip','M'),('ren','N')]:
    dv=DataValidation(type='list',formula1=dvs[b],allow_blank=True); ws2.add_data_validation(dv); dv.add('%s2:%s%d'%(cl,cl,max(2,n2)))
# 3 tất cả tên
ws3=wb.create_sheet('Tất cả tên hàng')
cols3=['Nhóm','Chất liệu','Tên hàng','Dòng','Chuôi','Ngọn','Tip','Ren','Đầu','Mức chắc chắn','Số dòng đơn','Đã đặt','Còn thiếu','Sửa: ghi chú']
dau(ws3,cols3,[18,15,48,12,26,26,20,12,7,12,8,8,9,30])
def khoi(p):
    k=KIEU.get(p.get('kieu'),'Đánh').lower(); l=p.get('loai')
    return {'GAY':'Gậy '+k,'NGON':'Ngọn lẻ '+k,'CHUOI':'Chuôi lẻ','NOI':'Tay nối','PK':'Phụ kiện'}.get(l,'Chưa rõ')
KH=['Gậy đánh','Gậy nhảy','Gậy phá','Gậy phá nhảy','Ngọn lẻ đánh','Ngọn lẻ nhảy','Ngọn lẻ phá','Ngọn lẻ phá nhảy','Chuôi lẻ','Tay nối','Phụ kiện','Chưa rõ']
al=sorted(d['ten'],key=lambda t:(KH.index(khoi(t['pl'])),TV.index(t['pl'].get('vl','KHAC')),-t['thieu']))
tr=None
for t in al:
    p=t['pl']; g=khoi(p)
    if g!=tr: tr=g; nhom(ws3,g,len(cols3))
    ws3.append([g,VL.get(p.get('vl'),''),t['ten'],p.get('dong',''),nh('chuoi',p.get('chuoi','')),nh('ngon',p.get('ngon','')),nh('tip',p.get('tip','')),nh('ren',p.get('ren','')),p.get('dau',''),{'xanh':'Chắc','vang':'Chưa chắc','do':'Không nhận ra'}.get(p.get('tin'),''),t['don'],t['sl'],t['thieu']])
    if p.get('tin')!='xanh':
        for i in range(1,14): ws3.cell(ws3.max_row,i).fill=YF
# 4 quy trình nháp
ws4=wb.create_sheet('Quy trình nháp')
src=open(HTML,encoding='utf8').read()
m=re.search(r'var QT_NHOM=\{(.*?)\n\};',src,re.S).group(1)
QN={}
for x,body in re.findall(r'(\w+):\[(.*?)\]\]\s*,?\s*\n',m+'\n'):
    QN[x]=[(a,re.compile(b)) for a,b in re.findall(r"\['([^']+)',/(.*?)/\]",body+']')]
NN={'POM':'SX POM (cấp Phôi Thô)','NOI':'Tay nối','GAY1K':'Gậy 1 khúc','PHIP':'Phíp','PK':'Phụ kiện','DONLE':'Đơn lẻ','LAMLAI':'Làm lại / sửa','HOTRO':'Hỗ trợ','CHUAXEP':'Chưa xếp'}
def kd(t): t=unicodedata.normalize('NFD',t or ''); t=''.join(ch for ch in t if unicodedata.category(ch)!='Mn').replace('đ','d').replace('Đ','D').lower(); return re.sub(r'\s+',' ',re.sub(r'[-_]+',' ',t)).strip()
def grp(x,nhn,ten):
    if nhn in NN: return NN[nhn],100
    for i,(a,rg) in enumerate(QN.get(x,[])):
        if rg.search(kd(ten)): return a,i
    return 'Khác',90
THX=['PHOICB','PHOITHO','NGONTARO','NGONTIP','CNC','SON','INUV','HT','DG']
TNH=['CHUOI','NGON','CHUNG','GAY1K','NOI','TIP','PHIP','POM','PK','DONLE','LAMLAI','HOTRO','CHUAXEP']
txm={p['MaXuong']:p['TenXuong'] for p in d['xuong']}
cols4=['Xưởng','Nhóm trên lưu đồ (Claude gộp)','Thứ tự nhóm','Nhánh','Bước','Mã CĐ','Tên công đoạn','Định mức','ĐVT','SL TB/ngày (30 ngày)','Sửa: nhánh đúng','Sửa: bước đúng','Sửa: thuộc nhóm','Sửa: ghi chú (sai ở đâu)']
dau(ws4,cols4,[18,26,8,12,7,18,48,9,10,11,14,10,20,40])
q=sorted(d['qt'],key=lambda c:(THX.index(c['MaXuong']) if c['MaXuong'] in THX else 99,grp(c['MaXuong'],c['Nhanh'],c['Ten'])[1],TNH.index(c['Nhanh']) if c['Nhanh'] in TNH else 99,c['Buoc']))
tr=None
for c in q:
    g,gi=grp(c['MaXuong'],c['Nhanh'],c['Ten'])
    if c['MaXuong']!=tr: tr=c['MaXuong']; nhom(ws4,txm.get(tr,tr),len(cols4))
    ws4.append([txm.get(c['MaXuong'],c['MaXuong']),g,(gi+1) if gi<90 else '',d['nhanh'].get(c['Nhanh'],c['Nhanh']),c['Buoc'],c['Ma'],c['Ten'],c['DM'],c['DVT'],round(c['SL'],1)])
    for i in range(11,15): ws4.cell(ws4.max_row,i).fill=EF
ws4.append([]); ws4.append(['Luồng bán thành phẩm giữa các xưởng (Claude soạn):']); ws4.cell(ws4.max_row,1).font=Font(bold=True)
for l in d['luong']: ws4.append([txm.get(l['Tu'],l['Tu']),'→ '+txm.get(l['Den'],l['Den']),'',l['BTP']])
for wsx in [ws,ws2,ws3,ws4]:
    for row in wsx.iter_rows(min_row=1,max_row=wsx.max_row):
        for x in row:
            if x.value is not None: x.border=B; x.alignment=Alignment(wrap_text=True,vertical='top')
wb.move_sheet('Bảng mã',offset=10)
wb.save(S+'/gui/Cau-hinh-gay-va-quy-trinh-nhap.xlsx')
print(len(rows),len(vang),len(al),len(q),{k:len(v) for k,v in QN.items()})
