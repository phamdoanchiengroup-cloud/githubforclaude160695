import json, re, collections, html
L=json.load(open('loi.json')); e=html.escape
def dongs(rs):
    rs=sorted(set(int(x) for r in rs for x in str(r).replace(' ','').split(',') if x.isdigit())); out=[]; i=0
    while i<len(rs):
        j=i
        while j+1<len(rs) and rs[j+1]==rs[j]+1: j+=1
        out.append(str(rs[i]) if i==j else '%d–%d'%(rs[i],rs[j])); i=j+1
    return ', '.join(out)
TABS=['DEALER','KHO','WEB LẺ CUSTOM','WEB LẺ ĐƠN THƯỜNG','OEM','A ĐÔNG','POD-A.BÁCH','ĐƠN ƯU TIÊN']
# 1. cần sửa
loi=[l for l in L if l['muc']=='Lỗi']; trung=[l for l in L if 'Trùng' in l['mota']]
rows=[]
g=collections.OrderedDict()
for l in loi:
    if l['tab']=='ĐƠN ƯU TIÊN':
        ma=l['gt'].split(' · ')[0]; k=('ĐƠN ƯU TIÊN',ma); g.setdefault(k,{'d':[],'l':l})['d'].append(l['dong'])
    else: rows.append((l['tab'],str(l['dong']),l['cot'],l['mota'],l['gt'],l['sua'] or 'Kiểm tra lại số'))
for (t,ma),v in g.items(): rows.append((t,dongs(v['d']),'A','Mã "%s" không có ở tab kênh nào → web không gắn được "ưu tiên" cho %d dòng hàng này'%(ma,len(v['d'])),ma,v['l']['sua']))
for l in trung: rows.append((l['tab'],l['dong'],'A–D',l['mota'],l['gt'],l['sua']))
rows.sort(key=lambda r:(TABS.index(r[0]) if r[0] in TABS else 99, int(re.match(r'\d+',r[1]).group()) if re.match(r'\d+',r[1]) else 0))
# 2. deadline trống: theo tab, theo mã
dl=collections.OrderedDict()
for l in L:
    if 'Trống deadline' not in l['mota']: continue
    dl.setdefault(l['tab'],collections.OrderedDict())
dlm=collections.defaultdict(lambda: collections.defaultdict(list))
ma_cua={}
import json as J
for l in L:
    if 'Trống deadline' in l['mota']: dlm[l['tab']][None].append(l['dong'])
# cần mã: đọc lại từ dữ liệu
d=J.load(open(__import__('sys').argv[1]))
def txt(x): return x['$d'][:10] if isinstance(x,dict) and '$d' in x else ('' if x is None else str(x).strip())
maDong={}
for t,v in d.items():
    ma=''
    for i,r in enumerate(v):
        m0=txt(r[0]) if r else ''
        if m0 and (re.search(r'\d',m0) or m0.startswith('#')): ma=m0
        maDong[(t,i+1)]=ma
dlg=collections.OrderedDict()
for t in TABS:
    if t not in dlm: continue
    gm=collections.OrderedDict()
    for r in dlm[t][None]: gm.setdefault(maDong.get((t,int(r)),'') or '(không mã)',[]).append(r)
    dlg[t]=gm
# 3. cột bộ phận > số đặt
bp=collections.OrderedDict()
for l in L:
    if l['mota'].startswith('Cột "'): bp.setdefault(l['tab'],[]).append(l)
demo=[l for l in L if 'không có ngày' in l['mota']]
tong=collections.Counter(l['tab'] for l in L)
css='''body{font:10.5px/1.45 "Be Vietnam Pro",Arial,sans-serif;color:#1a2421;margin:0}h1{font-size:18px;margin:0 0 4px;color:#0b4f4a}h2{font-size:13.5px;color:#0b4f4a;border-left:4px solid #0b7a73;padding-left:8px;margin:18px 0 6px}
.g{color:#5a6b66;font-size:10px}table{border-collapse:collapse;width:100%;margin:4px 0 8px}th,td{border:1px solid #cfd8d5;padding:3px 5px;vertical-align:top;text-align:left}th{background:#e8f1ef;font-size:9.5px}
td.n{white-space:nowrap;font-weight:600}.do{color:#b42a25;font-weight:600}tr.k td{background:#f3f6f5;font-weight:600}.o{display:inline-block;border:1px solid #cfd8d5;border-radius:6px;padding:4px 10px;margin:0 6px 6px 0}.o b{font-size:15px;display:block}
@page{size:A4;margin:12mm 10mm}'''
h='<html><head><meta charset="utf-8"><style>'+css+'</style></head><body>'
h+='<h1>Rà soát Sheet "Trạng thái đơn hàng"</h1><div class="g">Bản chụp Sheet lúc 11:56 ngày 07/11/2026 (dữ liệu web KPI dùng). Rà 7 tab kênh + tab ĐƠN ƯU TIÊN; chưa rà tab HT-2026. "Dòng" = số dòng trên Sheet, "Cột" = chữ cột trên Sheet. Dòng nào đã sửa sau 07/11 thì bỏ qua.</div>'
h+='<div style="margin-top:8px"><span class="o"><b class="do">%d</b>chỗ cần sửa (ảnh hưởng số trên web)</span><span class="o"><b>%d</b>chỗ tên / mã viết lệch</span><span class="o"><b>%d</b>dòng trống deadline</span><span class="o"><b>%d</b>ô bộ phận ghi lớn hơn số đặt</span><span class="o"><b>Không</b>cộng trùng tab ĐƠN ƯU TIÊN vào tổng</span></div>'%(len(rows),len(json.load(open('ten.json'))),sum(len(x) for g2 in dlg.values() for x in g2.values()),sum(len(x) for x in bp.values()))
h+='<h2>1. Cần sửa – làm sai số trên web</h2><table><tr><th>Tab</th><th>Dòng</th><th>Cột</th><th>Lỗi</th><th>Giá trị</th><th>Cách sửa</th></tr>'
cu=None
for r in rows:
    if r[0]!=cu: cu=r[0]; h+='<tr class="k"><td colspan="6">%s</td></tr>'%e(cu)
    h+='<tr><td>%s</td><td class="n">%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td></tr>'%tuple(e(x) for x in r)
h+='</table><div class="g">Dòng trùng: có thể là 2 dòng thật (2 lô khác nhau) – nếu đúng là nhập 2 lần thì xóa 1 dòng, nếu là 2 lô thì ghi chú để phân biệt.</div>'
h+='<h2>2. Trống deadline – web không xếp được hạn, không báo trễ</h2><div class="g">Gom theo mã đơn: <b>mã</b> (dòng). Nếu tab nào cố ý không ghi deadline (vd đơn lẻ giao ngay) thì báo lại để web bỏ qua tab đó.</div><table><tr><th style="width:16%">Tab</th><th>Mã đơn (dòng trên Sheet)</th></tr>'
for t,gm in dlg.items():
    h+='<tr><td class="n">%s<br><span class="g">%d dòng · %d đơn</span></td><td>%s</td></tr>'%(e(t),sum(len(x) for x in gm.values()),len(gm),' · '.join('<b>%s</b> (%s)'%(e(ma),dongs(rs)) for ma,rs in gm.items()))
h+='</table>'
h+='<h2>3. Cột bộ phận ghi lớn hơn số đặt – kiểm tra lại</h2><div class="g">Web chỉ tính tối đa bằng số đặt, nhưng số lớn hơn thường là gõ nhầm hoặc ghi cả hàng làm bù. Dạng: <b>dòng</b> cột (ghi / đặt).</div><table><tr><th style="width:16%">Tab</th><th>Ô cần xem</th></tr>'
for t,ls in bp.items():
    def ngan(l):
        m=re.search(r'ghi ([\d.]+) > số đặt ([\d.]+)',l['mota']); bo=re.search(r'"([^"]+)"',l['mota']).group(1)
        return '<b>%s</b> %s %s (%s/%s)'%(l['dong'],l['cot'],e(bo.split(' Của ')[0]),m[1],m[2])
    h+='<tr><td class="n">%s<br><span class="g">%d ô</span></td><td>%s</td></tr>'%(e(t),len(ls),' · '.join(ngan(l) for l in sorted(ls,key=lambda x:int(x['dong']))))
h+='</table>'
T=json.load(open('ten.json'))
ct=[x for x in T if x['loai']=='chính tả']; vk=[x for x in T if x['loai']=='viết nhiều kiểu']; kt=[x for x in T if x['loai']=='khoảng trắng']; md=[x for x in T if x['loai'] in ('mã đơn','ngày đặt')]
h+='<h2>4. Tên sản phẩm</h2><div class="g">Tên viết khác nhau thì web và người đọc coi là sản phẩm khác: khó cộng, khó tìm, dễ phân loại sai chất liệu.</div>'
h+='<b>4a. Có thể sai chính tả</b><table><tr><th style="width:16%">Tab</th><th style="width:6%">Dòng</th><th style="width:5%">Cột</th><th>Nội dung</th><th>Tên đang ghi</th><th>Gợi ý</th></tr>'+''.join('<tr><td>%s</td><td class="n">%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td></tr>'%(e(x['tab']),x['dong'],x['cot'],e(x['mota']),e(x['gt']),e(x['sua'])) for x in ct)+'</table>'
gv=collections.OrderedDict()
for x in vk: gv.setdefault(x['sua'],[]).append(x)
h+='<b>4b. Cùng sản phẩm viết nhiều kiểu (%d dòng) – nên thống nhất theo cách viết phổ biến</b><table><tr><th style="width:38%%">Nên viết</th><th>Dòng đang viết khác (tab · dòng: cách viết)</th></tr>'%len(vk)
for k,xs in gv.items(): h+='<tr><td>%s</td><td>%s</td></tr>'%(e(k),'<br>'.join('%s · <b>%s</b>: %s'%(e(x['tab']),x['dong'],e(x['gt'])) for x in xs))
h+='</table>'
if kt:
    gk=collections.OrderedDict()
    for x in kt: gk.setdefault(x['tab'],[]).append(x['dong'])
    h+='<b>4c. Thừa khoảng trắng trong tên (%d dòng, cột B)</b> – dấu cách ở đầu / cuối hoặc 2 dấu cách liền: '%len(kt)+' · '.join('%s dòng %s'%(e(t),dongs(rs)) for t,rs in gk.items())+'<br>'
if md:
    h+='<h2>5. Mã đơn và ngày đặt</h2><div class="g">Đã kiểm ngày đặt trong mã đơn: ngày có thật, không sau ngày chụp, không quá 1 năm – <b>không thấy lỗi ngày</b>. Còn:</div><table><tr><th style="width:16%">Tab</th><th style="width:6%">Dòng</th><th>Nội dung</th><th>Mã đang ghi</th><th>Gợi ý</th></tr>'+''.join('<tr><td>%s</td><td class="n">%s</td><td>%s</td><td>%s</td><td>%s</td></tr>'%(e(x['tab']),x['dong'],e(x['mota']),e(x['gt']),e(x['sua'])) for x in md)+'</table>'
if demo: h+='<h2>6. Lưu ý khác</h2><table><tr><th>Tab</th><th>Dòng</th><th>Nội dung</th></tr><tr><td>DEALER</td><td class="n">%s</td><td>Mã "#DEMO" không có ngày đặt – web không biết đơn đặt ngày nào. Nếu là hàng mẫu thường xuyên thì không cần sửa.</td></tr></table>'%dongs([l['dong'] for l in demo])
h+='<div class="g" style="margin-top:14px">Lập tự động bằng web KPI · '+str(len(L))+' mục.</div></body></html>'
open('ra-soat.html','w').write(h)
