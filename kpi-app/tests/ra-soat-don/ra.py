import json, re, sys, collections, html
d = json.load(open(sys.argv[1]))
NAM = 2026
def col(i):
    s=''; i+=1
    while i: i,r=divmod(i-1,26); s=chr(65+r)+s
    return s
def txt(x):
    if isinstance(x, dict) and '$d' in x: return x['$d'][:10]
    return '' if x is None else str(x).strip()
def so(x):
    if isinstance(x,(int,float)): return x
    t=txt(x).replace(',','').replace(' ','')
    try: return float(t)
    except: return None
def ngay(x):
    if isinstance(x, dict) and '$d' in x: return x['$d'][:10]
    if isinstance(x,(int,float)) and 40000<x<60000:
        import datetime; return (datetime.date(1899,12,30)+datetime.timedelta(days=int(x))).isoformat()
    t=txt(x)
    m=re.match(r'^(\d{1,2})[/\-.](\d{1,2})(?:[/\-.](\d{2,4}))?$', t)
    if m:
        dd,mm,yy=int(m[1]),int(m[2]),m[3]; y=int(yy) if yy else NAM
        if y<100: y+=2000
        if 1<=mm<=12 and 1<=dd<=31: return '%04d-%02d-%02d'%(y,mm,dd)
    return None
def ngayMa(ma):
    m=re.search(r'(\d{1,2})/(\d{1,2})', ma or '')
    if m and 1<=int(m[2])<=12: return '%04d-%02d-%02d'%(NAM,int(m[2]),int(m[1]))
    return None
GHI=re.compile(r'CHÚ Ý|\bNOTE\b|TẤT CẢ CÁC GẬY|DÙNG CHO|CẦN THÊM|STOCK KHO|CẬP NHẬT|TRỌNG LƯỢNG|1 TUẦN|/TUẦN|HỢP ĐỒNG|\bHSG\b')
loi=[]; dong={}  # tab -> list rows parsed
def them(tab,r,c,muc,mota,gt='',sua=''):
    loi.append(dict(tab=tab,dong=r,cot=c,muc=muc,mota=mota,gt=str(gt)[:80],sua=sua))
KENH=[t for t in d if t not in ('HT-2026',)]
for tab in KENH:
    v=d[tab]; hi=-1
    for i,r in enumerate(v[:10]):
        j='|'.join(txt(x) for x in r).upper()
        if 'LOẠI HÀNG' in j or 'SL ĐẶT' in j: hi=i; break
    if hi<0: them(tab,'-','-','Lỗi','Không thấy dòng tiêu đề (có chữ "Loại hàng" / "SL đặt") – web không đọc được tab này'); continue
    h=[txt(x).upper() for x in v[hi]]
    def tim(ks):
        for i,x in enumerate(h):
            if any(k in x for k in ks): return i
        return -1
    cTen=tim(['LOẠI HÀNG']); cSL=tim(['SỐ LƯỢNG ĐẶT','SL ĐẶT']); cThieu=tim(['CÒN THIẾU']); cDL=tim(['DEADLINE']); cTra=tim(['ĐÃ TRẢ'])
    for k,c in [('Còn thiếu',cThieu),('Deadline',cDL),('Đã trả',cTra)]:
        if c<0: them(tab,hi+1,'-','Lưu ý','Không có cột "%s"'%k)
    chang=[i for i,x in enumerate(h) if re.search(r'CỦA PHỐ|CỦA KHOA|CỦA LINH|TÙNG LÀM ĐẦU|UV CỦA|HOÀN THIỆN CỦA|ĐÓNG GÓI', x)]
    ma=''; ds=[]
    for ri in range(hi+1,len(v)):
        r=v[ri]+[None]*5; R=ri+1
        ten=txt(r[cTen]); m0=txt(r[0]); sl=so(r[cSL]); slT=txt(r[cSL])
        if not ten and not m0 and not slT: continue
        if (m0+' '+ten).upper() and GHI.search((m0+' '+ten).upper()) and sum(1 for x in r if txt(x))<=4: continue
        if m0 and re.search(r'\d|^#',m0): ma=m0
        if not ten and not slT: continue
        if ten and (sl is None or sl<=0):
            if slT and sl is None: them(tab,R,col(cSL),'Lỗi','Số lượng đặt không phải số → web bỏ qua dòng này',slT,'Ghi số (vd 12)')
            elif not slT: them(tab,R,col(cSL),'Lỗi','Có tên hàng nhưng trống Số lượng đặt → web bỏ qua dòng này',ten,'Điền số lượng đặt')
            continue
        if not ten:
            them(tab,R,col(cTen),'Lỗi','Có số lượng nhưng trống Loại hàng → web bỏ qua dòng này',slT,'Điền tên sản phẩm'); continue
        if not (m0 or ma): them(tab,R,'A','Lỗi','Dòng đầu bảng không có mã đơn',ten,'Ghi mã đơn ở cột A')
        mad=m0 or ma
        if mad and not ngayMa(mad) and not re.search(r'\d',mad): them(tab,R,'A','Lưu ý','Mã đơn không có ngày (dd/mm) – không biết đơn đặt ngày nào',mad)
        # còn thiếu
        tra=so(r[cTra]) if cTra>=0 else None
        if cThieu>=0:
            ct=txt(r[cThieu]); th=so(r[cThieu])
            if ct=='' and (tra or 0)<sl: them(tab,R,col(cThieu),'Lỗi','Trống "SX còn thiếu" → web hiểu là đã xong (còn thiếu 0) dù chưa trả đủ hàng',ten[:60],'Điền số còn thiếu (= SL đặt − đã trả)')
            elif ct!='' and th is None: them(tab,R,col(cThieu),'Lỗi','"SX còn thiếu" không phải số',ct,'Ghi số')
            elif th is not None:
                if th>sl: them(tab,R,col(cThieu),'Lỗi','Còn thiếu (%g) lớn hơn số lượng đặt (%g)'%(th,sl),ten[:60],'Kiểm tra lại')
                elif th<0: them(tab,R,col(cThieu),'Lỗi','Còn thiếu âm (%g)'%th,ten[:60],'Kiểm tra công thức')
                elif tra is not None and abs((sl-tra)-th)>0.01 and th>0: them(tab,R,col(cThieu),'Lưu ý','Còn thiếu %g ≠ đặt %g − đã trả %g'%(th,sl,tra),ten[:60],'Kiểm tra số đã trả / còn thiếu')
        if tra is not None and tra>sl: them(tab,R,col(cTra),'Lỗi','Đã trả (%g) nhiều hơn số đặt (%g)'%(tra,sl),ten[:60])
        # deadline
        if cDL>=0:
            dt=txt(r[cDL]); dl=ngay(r[cDL])
            if dt=='' and (so(r[cThieu]) if cThieu>=0 else 1): them(tab,R,col(cDL),'Lưu ý','Trống deadline → web không xếp được hạn, không biết trễ',ten[:60],'Điền deadline (dd/mm)')
            elif dt and not dl: them(tab,R,col(cDL),'Lỗi','Deadline không đọc được ngày',dt,'Ghi dạng dd/mm hoặc chọn ngày')
            elif dl and ngayMa(mad) and dl<ngayMa(mad): them(tab,R,col(cDL),'Lưu ý','Deadline %s trước ngày đặt trong mã đơn (%s)'%(dl[8:]+'/'+dl[5:7], mad),ten[:60],'Kiểm tra năm / tháng')
        for c in chang:
            x=r[c] if c<len(r) else None; t=txt(x)
            if t=='' : continue
            n=so(x)
            if n is not None and n>sl: them(tab,R,col(c),'Lưu ý','Cột "%s" ghi %g > số đặt %g (web tính tối đa bằng số đặt)'%(h[c].title()[:22],n,sl),ten[:50])
        ds.append(dict(tab=tab,R=R,ma=mad,ten=ten,sl=sl,th=so(r[cThieu]) if cThieu>=0 else None))
    dong[tab]=ds
    cnt=collections.Counter((x['ma'],x['ten'],x['sl']) for x in ds)
    for k,n in cnt.items():
        if n>1:
            rs=[x['R'] for x in ds if (x['ma'],x['ten'],x['sl'])==k]
            them(tab,', '.join(map(str,rs)),'A–D','Lưu ý','Trùng mã + tên + số lượng %d lần (nhập 2 lần? web cộng cả %d dòng)'%(n,n),k[0]+' · '+k[1][:50],'Xóa dòng thừa nếu nhập trùng')
# trùng giữa các tab kênh (không tính tab ĐƠN ƯU TIÊN)
kenh=[t for t in dong if t!='ĐƠN ƯU TIÊN']
gom=collections.defaultdict(list)
for t in kenh:
    for x in dong[t]: gom[(x['ma'],x['ten'])].append(x)
for k,xs in gom.items():
    tabs=set(x['tab'] for x in xs)
    if len(tabs)>1:
        for x in xs: them(x['tab'],x['R'],'A','Lỗi','Cùng mã đơn + cùng sản phẩm có ở %d tab (%s) → web cộng 2 lần'%(len(tabs),', '.join(sorted(tabs))),k[0]+' · '+k[1][:50],'Giữ ở 1 tab')
# ĐƠN ƯU TIÊN: mã không có ở tab kênh
if 'ĐƠN ƯU TIÊN' in dong:
    maK=set(x['ma'] for t in kenh for x in dong[t])
    for x in dong['ĐƠN ƯU TIÊN']:
        if x['ma'] in maK: continue
        goi=[y['ma'] for t in kenh for y in dong[t] if y['ten']==x['ten'] and ngayMa(y['ma']) and ngayMa(y['ma'])==ngayMa(x['ma'])]
        them('ĐƠN ƯU TIÊN',x['R'],'A','Lỗi','Mã đơn không có ở tab kênh nào → web không gắn được "ưu tiên" cho đơn này',x['ma']+' · '+x['ten'][:45],('Ghi đúng mã như tab kênh: '+', '.join(sorted(set(goi)))) if goi else 'Ghi đúng mã như ở tab kênh')
json.dump(loi,open('loi.json','w'),ensure_ascii=False)
c=collections.Counter((l['tab'],l['muc']) for l in loi); print(sum(1 for l in loi),'mục'); print(c.most_common())
c2=collections.Counter(l['mota'].split('(')[0].split('→')[0][:45] for l in loi); print(c2.most_common(25))
