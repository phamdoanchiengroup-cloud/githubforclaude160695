import json,collections,sys,datetime as dt
d=json.load(open(sys.argv[1]))
def rows(n):
  if n not in d: return []
  h=d[n][0]; return [dict(zip(h,list(r)+['']*(len(h)-len(r)))) for r in d[n][1:]]
def ng(v):
  if isinstance(v,dict): return v['$d'][:10]
  return str(v).strip()[:10]
def s(v): return str(v).strip()
C=collections.Counter
out=[]
def bao(nhom,msg,vd=None):
  out.append((nhom,msg,vd))
TK=rows('TaiKhoan'); NS=rows('NhanSu'); PB=rows('PhongBan'); CD=rows('CongDoan'); DM=rows('DinhMuc')
NK=rows('NhatKySanXuat'); DD=rows('DiemDanhNghi'); XN=rows('XacNhanDiemDanh'); NDH=rows('NghiDaiHan')
VP=rows('ViPham'); DMVP=rows('DanhMucViPham'); PT=rows('PhatNhapTre'); KT=rows('KPIThang'); KCS=rows('PhieuKCS')
MM=rows('MayMoc'); DX=rows('DeXuatDinhMuc'); TS=rows('TrongSoKPI'); TB=rows('ThongBao'); YC=rows('YeuCauSuaHoSo'); MTD=rows('MienTruDiemDanh')
xuong={s(p['MaXuong']) for p in PB}
ns={s(n['MaNV']):n for n in NS}
cd={s(c['MaCD']):c for c in CD}
dmm={s(x['MaCD']):x for x in DM}
def dup(lst,key,ten):
  c=C(key(x) for x in lst); dd=[k for k,v in c.items() if v>1 and k]
  if dd: bao(ten,'trùng khóa: %d'%len(dd),dd[:8])
# ---- Tài khoản
dup(TK,lambda x:s(x['TenDangNhap']).lower(),'TaiKhoan')
dup([t for t in TK if s(t['TrangThai'])=='Đang dùng'],lambda x:s(x['MaNV']),'TaiKhoan (MaNV dùng chung giữa 2 tài khoản đang dùng)')
for t in TK:
  vt=s(t['VaiTro']); tt=s(t['TrangThai']); m=s(t['MaNV'])
  if tt!='Đang dùng': continue
  if vt in('CN','TP','PP') and not m: bao('TaiKhoan','%s (%s) không có MaNV'%(t['TenDangNhap'],vt))
  if m and m not in ns: bao('TaiKhoan','%s: MaNV %s không có trong NhanSu'%(t['TenDangNhap'],m))
  if m in ns and s(ns[m]['TrangThai'])=='Nghỉ việc': bao('TaiKhoan','%s: nhân sự đã Nghỉ việc nhưng tài khoản còn Đang dùng'%t['TenDangNhap'])
  if vt in('CN','TP','PP') and s(t['MaXuong']) not in xuong: bao('TaiKhoan','%s (%s): MaXuong "%s" không có trong PhongBan'%(t['TenDangNhap'],vt,t['MaXuong']))
  if m in ns and vt in('CN','TP','PP') and s(t['MaXuong'])!=s(ns[m]['MaXuong']): bao('TaiKhoan','%s: xưởng tài khoản %s ≠ xưởng hồ sơ %s'%(t['TenDangNhap'],t['MaXuong'],ns[m]['MaXuong']))
  cdn=s(ns[m]['ChucDanh']).lower() if m in ns else ''
  laQL=any(k in cdn for k in ['trưởng phòng','phó phòng','trưởng bộ phận','phó bộ phận','phó bp','quản đốc'])
  if vt=='CN' and laQL: bao('Vai trò ↔ chức danh','%s: vai trò CN nhưng chức danh "%s" (bị coi là quản lý, không phạt nhập trễ, không vào bảng KPI CN)'%(t['TenDangNhap'],ns[m]['ChucDanh']))
  if vt in('TP','PP') and m in ns and not laQL: bao('Vai trò ↔ chức danh','%s: vai trò %s nhưng chức danh hồ sơ "%s"'%(t['TenDangNhap'],vt,ns[m]['ChucDanh']))
mk_mac=C(s(t['MatKhauMaHoa']) for t in TK if s(t['TrangThai'])=='Đang dùng').most_common(1)
if mk_mac and mk_mac[0][1]>3: bao('TaiKhoan','%d tài khoản đang dùng chung một mật khẩu (nhiều khả năng 123456)'%mk_mac[0][1], [ (t['TenDangNhap'],t['VaiTro'],t['DoiMatKhauLanDau']) for t in TK if s(t['MatKhauMaHoa'])==mk_mac[0][0] and s(t['TrangThai'])=='Đang dùng' and s(t['DoiMatKhauLanDau'])!='Có'][:12])
tkMa={s(t['MaNV']) for t in TK if s(t['TrangThai'])=='Đang dùng'}
khongTK=[n['MaNV'] for n in NS if s(n['TrangThai'])!='Nghỉ việc' and s(n['MaNV']) not in tkMa]
if khongTK: bao('NhanSu','%d nhân sự đang làm chưa có tài khoản (không tự nhập sản lượng được)'%len(khongTK),khongTK[:15])
# ---- Nhân sự
dup(NS,lambda x:s(x['MaNV']),'NhanSu')
dup([n for n in NS if s(n['SoCCCD'])],lambda x:s(x['SoCCCD']),'NhanSu (CCCD trùng)')
for n in NS:
  if s(n['MaXuong']) not in xuong: bao('NhanSu','%s: MaXuong "%s" không có trong PhongBan'%(n['MaNV'],n['MaXuong']))
  if not s(ng(n['NgayVaoLam'])): bao('NhanSu thiếu ngày vào làm',n['MaNV'])
  for c in [x.strip() for x in s(n['CongDoanLamDuoc']).split(',') if x.strip()]:
    if c not in cd: bao('NhanSu: công đoạn làm được không tồn tại','%s → %s'%(n['MaNV'],c))
    elif s(cd[c]['MaXuong'])!=s(n['MaXuong']): bao('NhanSu: công đoạn làm được thuộc xưởng khác','%s (%s) → %s (%s)'%(n['MaNV'],n['MaXuong'],c,cd[c]['MaXuong']))
    elif s(cd[c]['TrangThai'])=='Ngừng': bao('NhanSu: công đoạn làm được đã Ngừng','%s → %s'%(n['MaNV'],c))
print(C(s(n['TrangThai']) for n in NS), C(s(n['ChucDanh']) for n in NS).most_common(12))
# ---- Công đoạn / định mức
dup(CD,lambda x:s(x['MaCD']),'CongDoan')
dup(DM,lambda x:s(x['MaCD']),'DinhMuc')
for c in CD:
  if s(c['MaXuong']) not in xuong: bao('CongDoan','%s: xưởng "%s" không tồn tại'%(c['MaCD'],c['MaXuong']))
  if s(c['TrangThai'])!='Ngừng':
    x=dmm.get(s(c['MaCD']))
    try: g=float(x['DinhMucGio']) if x else 0
    except: g=-1
    if g<=0: bao('Công đoạn đang dùng chưa có định mức (hiệu suất = 0)','%s %s'%(c['MaCD'],c['TenCD']))
for x in DM:
  if s(x['MaCD']) not in cd: bao('DinhMuc mồ côi (công đoạn không tồn tại)',x['MaCD'])
# ---- Nhật ký
dup(NK,lambda x:s(x['MaDong']),'NhatKySanXuat (MaDong trùng)')
nkTT=C(s(r['TrangThai']) for r in NK); print('NK trạng thái',nkTT)
ccIdx={}
for r in DD: ccIdx.setdefault((s(r['MaNV']),ng(r['Ngay'])),[]).append(r)
def kh(r):
  k=s(r['KyHieu'])
  if k: return k
  l=s(r['LyDo']).lower()
  if 'nửa ngày' in l: return '0.5x'
  if 'muộn' in l: return 'x-1'
  return 'P'
def gio(k):
  if k in('','x'): return 8
  if k=='0.5x': return 4
  if k.startswith('x-'):
    try: return max(0,8-float(k[2:]))
    except: return 8
  return 0
trungCD=C(); nghiCoSL=[]; cn=[]; tuongLai=[]; slAm=[]; cao=[]; choCu=[]; khongNS=[]; khongCD=[]; khacX=[]
ngNK=[]
for r in NK:
  t=s(r['TrangThai']); n=ng(r['Ngay']); m=s(r['MaNV']); c=s(r['MaCD'])
  ngNK.append(n)
  if m not in ns: khongNS.append(m)
  if c not in cd: khongCD.append(c)
  elif m in ns and s(cd[c]['MaXuong'])!=s(ns[m]['MaXuong']): khacX.append((n,m,ns[m]['MaXuong'],c,cd[c]['MaXuong'],t))
  if t=='Từ chối': continue
  trungCD[(m,n,c)]+=1
  try: sl=float(r['SoLuongLamRa'])
  except: sl=-1
  if sl<=0: slAm.append((r['MaDong'],n,m,r['SoLuongLamRa']))
  g=0
  for x in ccIdx.get((m,n),[]): g=gio(kh(x))
  if (m,n) in ccIdx and g<=0: nghiCoSL.append((n,m,c,r['SoLuongLamRa'],t,[kh(x) for x in ccIdx[(m,n)]]))
  try: wd=dt.date.fromisoformat(n).weekday()
  except: wd=-1
  if wd==6: cn.append((n,m,t))
  if n>'2026-09-28': tuongLai.append((n,m,t))
  x=dmm.get(c)
  try:
    dg=float(x['DinhMucGio']); gl=float(r['GioLam'] or 8)
    if dg>0 and sl/(dg*8)>3: cao.append((n,m,c,int(sl),dg,round(sl/(dg*8)*100)))
  except: pass
  if t=='Chờ duyệt' and n<'2026-09-20': choCu.append((n,m,c))
tr=[k for k,v in trungCD.items() if v>1]
if tr: bao('Nhật ký: cùng người + ngày + công đoạn có >1 dòng (không tính dòng từ chối)','%d nhóm'%len(tr),tr[:8])
if slAm: bao('Nhật ký: số lượng ≤ 0','%d dòng'%len(slAm),slAm[:5])
if nghiCoSL: bao('Nhật ký: có sản lượng vào ngày chấm NGHỈ CẢ NGÀY (giờ có mặt 0 → hiệu suất ngày đó không tính, sản lượng "mất")','%d dòng, %d người-ngày'%(len(nghiCoSL),len({(a,b) for a,b,*_ in nghiCoSL})),nghiCoSL[:10])
if cn: bao('Nhật ký: sản lượng ngày Chủ nhật','%d dòng'%len(cn),C(x[0] for x in cn).most_common(6))
if tuongLai: bao('Nhật ký: ngày sau ngày xuất dữ liệu','%d'%len(tuongLai),tuongLai[:5])
if cao: bao('Nhật ký: sản lượng > 300% định mức 8 giờ (có thể gõ thừa số 0 hoặc định mức sai)','%d dòng'%len(cao),sorted(cao,key=lambda x:-x[5])[:12])
if choCu: bao('Nhật ký: chờ duyệt quá 8 ngày','%d'%len(choCu),choCu[:6])
if khongNS: bao('Nhật ký: MaNV không có trong NhanSu',C(khongNS).most_common(8))
if khongCD: bao('Nhật ký: MaCD không tồn tại',C(khongCD).most_common(8))
if khacX: bao('Nhật ký: công đoạn thuộc xưởng khác xưởng của người làm','%d dòng'%len(khacX),khacX[:6])
print('NK ngày từ',min(ngNK),'đến',max(ngNK))
# ---- Điểm danh
dupDD=[(k,[kh(x) for x in v]) for k,v in ccIdx.items() if len(v)>1]
if dupDD: bao('DiemDanhNghi: 1 người 1 ngày có >1 bản ghi (bản nào thắng tùy thứ tự)','%d'%len(dupDD),dupDD[:8])
for r in DD:
  m=s(r['MaNV'])
  if m not in ns: bao('DiemDanhNghi: MaNV không tồn tại',m)
  elif s(r['MaXuong'])!=s(ns[m]['MaXuong']): bao('DiemDanhNghi: MaXuong khác xưởng hồ sơ','%s %s: %s vs %s'%(ng(r['Ngay']),m,r['MaXuong'],ns[m]['MaXuong']))
khRong=[r for r in DD if not s(r['KyHieu'])]
if khRong: bao('DiemDanhNghi: thiếu ký hiệu (tự suy từ lý do → mặc định "P" nghỉ phép năm, cả ngày)','%d dòng'%len(khRong),C(s(r['LyDo']) for r in khRong).most_common(10))
ddCN=[r for r in DD if dt.date.fromisoformat(ng(r['Ngay'])).weekday()==6]
if ddCN: bao('DiemDanhNghi: chấm vào Chủ nhật','%d'%len(ddCN))
dup(XN,lambda x:(s(x['MaXuong']),ng(x['Ngay'])),'XacNhanDiemDanh')
# đi làm có sản lượng nhưng xưởng chưa xác nhận điểm danh
xnSet={(s(x['MaXuong']),ng(x['Ngay'])) for x in XN}
ngayCoSL=C()
for r in NK:
  if s(r['TrangThai'])=='Đã chốt' and s(r['MaCD']) in cd: ngayCoSL[(s(cd[s(r['MaCD'])]['MaXuong']),ng(r['Ngay']))]+=1
chuaXN=[k for k in ngayCoSL if k not in xnSet and k[1]>='2026-09-04']
if chuaXN: bao('Xưởng có sản lượng ngày đó nhưng CHƯA xác nhận điểm danh (từ 04/09) → không nhắc / không phạt người chưa nhập ngày đó','%d xưởng-ngày'%len(chuaXN),sorted(chuaXN)[:12])
# ---- Nghỉ dài hạn
for r in NDH:
  if ng(r['DenNgay'])<ng(r['TuNgay']): bao('NghiDaiHan: đến ngày < từ ngày',r['MaNghi'])
# ---- Vi phạm
mvp={s(x['MaVP']) for x in DMVP}
for v in VP:
  if s(v['MaVP']) not in mvp: bao('ViPham: mã vi phạm không có trong danh mục',v['MaVP'])
  if s(v['MaNV']) not in ns: bao('ViPham: MaNV không tồn tại',v['MaNV'])
khongMa=[v for v in VP if not s(v['MaGhi'])]
if khongMa: bao('ViPham: thiếu MaGhi (không xóa từng dòng trên web được)','%d dòng'%len(khongMa),C(s(v['MaVP']) for v in khongMa))
dup(VP,lambda x:(s(x['MaNV']),ng(x['Ngay']),s(x['MaVP'])),'ViPham (cùng người+ngày+mã)')
print('DMVP',[(x['MaVP'],x['MucTru'],x['Nhom']) for x in DMVP])
# ---- Phạt nhập trễ
dup(PT,lambda x:(s(x['MaNV']),ng(x['Ngay'])),'PhatNhapTre')
maQL=set()
for t in TK:
  if s(t['VaiTro']) in('TP','PP') and s(t['MaNV']): maQL.add(s(t['MaNV']))
for n in NS:
  cdn=s(n['ChucDanh']).lower()
  if any(k in cdn for k in ['trưởng phòng','phó phòng','trưởng bộ phận','phó bộ phận','phó bp','quản đốc']): maQL.add(s(n['MaNV']))
ptQL=[p for p in PT if s(p['MaNV']) in maQL]
if ptQL: bao('PhatNhapTre: phạt cả trưởng/phó phòng (không phải nhập)','%d'%len(ptQL),[(p['MaNV'],ng(p['Ngay'])) for p in ptQL][:8])
nkSet={(s(r['MaNV']),ng(r['Ngay'])) for r in NK}
ptCoNhap=[p for p in PT if (s(p['MaNV']),ng(p['Ngay'])) in nkSet]
if ptCoNhap: bao('PhatNhapTre: bị phạt nhưng ngày đó đã có nhật ký (nhập muộn sau hạn – đúng luật, hoặc phạt nhầm)','%d'%len(ptCoNhap),[(p['MaNV'],ng(p['Ngay'])) for p in ptCoNhap][:8])
vpNT={(s(v['MaNV']),ng(v['Ngay'])) for v in VP if s(v['MaVP'])=='NHAPTRE'}
ptSet={(s(p['MaNV']),ng(p['Ngay'])) for p in PT}
if len(ptSet-vpNT): bao('PhatNhapTre có nhưng không có vi phạm NHAPTRE tương ứng (CN không bị trừ nề nếp)','%d'%len(ptSet-vpNT),sorted(ptSet-vpNT)[:8])
if len(vpNT-ptSet): bao('Vi phạm NHAPTRE không có dòng PhatNhapTre tương ứng','%d'%len(vpNT-ptSet),sorted(vpNT-ptSet)[:8])
# ---- KPIThang
dup(KT,lambda x:(ng(x['Ky'])[:7],s(x['MaNV'])),'KPIThang (trùng kỳ+người)')
print('KPIThang kỳ',C((ng(x['Ky'])[:7],s(x['NguoiChot'])[:20]) for x in KT))
ktQL=[x for x in KT if s(x['MaNV']) in maQL]
if ktQL: bao('KPIThang: có trưởng/phó phòng trong bảng KPI công nhân','%d'%len(ktQL))
# ---- KCS
for k in KCS:
  if s(k['MaNV']) not in ns: bao('PhieuKCS: MaNV không tồn tại',k['MaNV'])
# ---- Máy
dup(MM,lambda x:s(x['MaMay']),'MayMoc')
for m in MM:
  if s(m['MaXuong']) not in xuong: bao('MayMoc: xưởng không tồn tại','%s %s'%(m['MaMay'],m['MaXuong']))
print('Máy tình trạng',C(s(m['TinhTrang']) for m in MM))
# ---- Trọng số
for t in TS:
  try:
    tong=sum(float(t[k]) for k in['SanLuong','ChatLuong','TuanThu','AnToan'])
    if abs(tong-100)>0.01 and abs(tong-1)>0.001: bao('TrongSoKPI: tổng 4 trọng số ≠ 100','%s: %s'%(ng(t['KyApDung']),tong))
  except Exception as e: bao('TrongSoKPI lỗi số',str(t))
print('TrongSo',[(ng(t['KyApDung']),t['SanLuong'],t['ChatLuong'],t['TuanThu'],t['AnToan'],t['TranKPI']) for t in TS])
# đề xuất
print('DeXuat',C(s(x['TrangThai']) for x in DX))
dxCho=[x for x in DX if s(x['TrangThai'])=='Chờ duyệt']
print('ThongBao chưa đọc',sum(1 for t in TB if s(t['DaDoc'])!='Rồi'), 'YC',C(s(y['TrangThai']) for y in YC))
print('MienTruDiemDanh',[(ng(m['Ngay']),m['MaXuong'],m['LyDo']) for m in MTD])
print('\n=========== PHÁT HIỆN')
for a,b,c in out: print('-',a,'|',b,'|',json.dumps(c,ensure_ascii=False,default=str)[:600] if c is not None else '')
