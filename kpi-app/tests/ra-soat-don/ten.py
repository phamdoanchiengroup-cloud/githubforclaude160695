import json, re, sys, collections, difflib, unicodedata
d=json.load(open(sys.argv[1])); NGAY_CHUP='2026-11-07'
def txt(x): return x['$d'][:10] if isinstance(x,dict) and '$d' in x else ('' if x is None else str(x))
TABS=['DEALER','KHO','WEB LẺ CUSTOM','WEB LẺ ĐƠN THƯỜNG','OEM','A ĐÔNG','POD-A.BÁCH','ĐƠN ƯU TIÊN']
rows=[]
for t in TABS:
    v=d.get(t) or []; hi=-1
    for i,r in enumerate(v[:10]):
        j='|'.join(txt(x) for x in r).upper()
        if 'LOẠI HÀNG' in j or 'SL ĐẶT' in j: hi=i; break
    h=[txt(x).upper() for x in v[hi]]; cTen=next(i for i,x in enumerate(h) if 'LOẠI HÀNG' in x); ma=''
    for ri in range(hi+1,len(v)):
        r=v[ri]+[None]*3; m0=txt(r[0]).strip(); ten=txt(r[cTen])
        if m0 and (re.search(r'\d',m0) or m0.startswith('#')): ma=m0
        if ten.strip(): rows.append(dict(tab=t,R=ri+1,ma=m0 or ma,m0=m0,ten=ten))
out=[]
def them(tab,R,cot,loai,mota,gt,sua): out.append(dict(tab=tab,dong=R,cot=cot,loai=loai,mota=mota,gt=gt[:90],sua=sua[:90]))
# 1. khoảng trắng thừa
for x in rows:
    t=x['ten']
    if t!=t.strip() or '  ' in t: them(x['tab'],x['R'],'B','khoảng trắng','Thừa khoảng trắng (đầu/cuối hoặc 2 dấu cách) – tên trông giống nhưng máy coi là khác',repr(t)[1:-1],re.sub(r'\s+',' ',t).strip())
# 2. từ sai chính tả: từ hiếm (≤ 2 lần) gần giống từ phổ biến (≥ 3 lần), không phân biệt hoa/thường
tu=collections.Counter()
for x in rows:
    for w in re.findall(r"[^\W\d_]{3,}",x['ten']): tu[w.upper()]+=1
pho=[w for w,n in tu.items() if n>=3 and len(w)>=4]
goi={}
for w,n in tu.items():
    if n>2 or len(w)<5: continue
    c=difflib.get_close_matches(w,pho,n=1,cutoff=0.83)
    if not c or c[0]==w or w.endswith(c[0]) or c[0].endswith(w): continue
    if c[0].rstrip('S')==w.rstrip('S'): continue
    goi[w]=c[0]
BAI={'DÔ':'RÔ (chất rô)'}   # tên chất bài: cơ, rô, tép (chuồn), bích
for x in rows:
    for w in re.findall(r"[^\W\d_]{2,}",x['ten']):
        W=w.upper()
        if W in goi: them(x['tab'],x['R'],'B','chính tả','"%s" có thể gõ sai – chỗ khác viết "%s" (%d lần)'%(w,goi[W],tu[goi[W]]),x['ten'],'Sửa thành "%s" nếu cùng loại'%goi[W])
        if W in BAI and 'POKER' in x['ten'].upper(): them(x['tab'],x['R'],'B','chính tả','"%s" có thể gõ sai – chất bài là "%s"'%(w,BAI[W]),x['ten'],'Sửa thành "RÔ"')
# 3. cùng sản phẩm viết nhiều kiểu (khác hoa/thường, dấu, ký tự) giữa các dòng
def chuan(s): s=unicodedata.normalize('NFD',s.lower()); s=''.join(c for c in s if unicodedata.category(c)!='Mn'); return re.sub(r'[^a-z0-9]','',s.replace('đ','d'))
nhom=collections.defaultdict(list)
for x in rows: nhom[chuan(x['ten'])].append(x)
for k,xs in nhom.items():
    kieu=collections.Counter(re.sub(r'\s+',' ',x['ten']).strip() for x in xs)
    if len(kieu)>1 and k:
        chinh=kieu.most_common(1)[0][0]
        for x in xs:
            t=re.sub(r'\s+',' ',x['ten']).strip()
            if t!=chinh: them(x['tab'],x['R'],'B','viết nhiều kiểu','Cùng sản phẩm nhưng viết khác (hoa/thường, dấu, ký tự) với %d dòng khác'%kieu[chinh],t,chinh)
# 4. ngày đặt trong mã đơn
for x in rows:
    if not x['m0']: continue
    m=re.search(r'(\d{1,2})\s*/\s*(\d{1,2})(?:\s*/\s*(\d{2,4}))?',x['m0'])
    if not m: continue
    dd,mm=int(m[1]),int(m[2]); y=int(m[3]) if m[3] else 2026
    if y<100: y+=2000
    import datetime
    try: nd=datetime.date(y,mm,dd).isoformat()
    except Exception: them(x['tab'],x['R'],'A','ngày đặt','Ngày đặt trong mã không có thật (%s)'%m[0],x['m0'],'Sửa ngày / tháng'); continue
    if nd>NGAY_CHUP and 'TUẦN' not in x['m0'].upper(): them(x['tab'],x['R'],'A','ngày đặt','Ngày đặt %s sau ngày chụp Sheet 07/11 – có thể đảo ngày / tháng'%m[0],x['m0'],'Kiểm tra')
    elif nd<'2025-11-01': them(x['tab'],x['R'],'A','ngày đặt','Ngày đặt %s đã hơn 1 năm – sai năm hoặc đơn quá cũ'%m[0],x['m0'],'Kiểm tra')
    if re.search(r'[A-Za-z0-9]\s+-|-\s+[A-Za-z0-9]',x['m0']) and re.search(r'\d',x['m0']): them(x['tab'],x['R'],'A','mã đơn','Mã đơn có dấu cách trước / sau dấu "-" – dễ ghi lệch giữa các tab',x['m0'],re.sub(r'\s*-\s*','-',x['m0']))
json.dump(out,open('ten.json','w'),ensure_ascii=False)
c=collections.Counter(o['loai'] for o in out); print(c)
for o in out[:200]:
    if o['loai'] in ('chính tả','ngày đặt'): print(o['tab'],o['dong'],o['mota'][:80],'|',o['gt'][:50])
