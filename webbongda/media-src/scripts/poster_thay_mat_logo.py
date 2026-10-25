import numpy as np, cv2
from PIL import Image, ImageFilter
S='/tmp/claude-0/-home-user/f0d6a37d-9c1e-53d3-8cf4-9490d12819cc/scratchpad'
goc = Image.open('goc.png').convert('RGB'); W,H = goc.size
def full_mask(ten, box):
    m = np.zeros((H,W),np.uint8); x0,y0,x1,y1 = box
    mm = np.array(Image.open(f'm_{ten}.png').convert('L'))
    m[y0:y1,x0:x1] = mm; return m
MAT = {  # (đỉnh đầu, cằm, tâm mặt x) trên poster AI ; trên ảnh thật
 'R': ((148,300,200),(7,484,461)), 'E': ((603,760,185),(10,349,383)),
 'T': ((208,350,1283),(4,284,248)), 'C': ((618,775,1292),(10,409,411)) }
DAT = {'R': (0.401,140,'trai'), 'E': (0.46,600,'trai'), 'T': (0.596,198,'phai'), 'C': (0.40,610,'phai')}
P = {  # người: (mask, khung tách, ảnh thật, đáy cắt)
 'R': ((0,120,330,600), 'p_CTCF3038CB_rhino', 600),
 'E': ((0,590,330,1000), 'p_CT7CE12C78_evo', 990),
 'T': ((1170,170,1448,620), 'p_CTBE7CF0D3_timetip', 610),
 'C': ((1150,600,1448,990), 'p_CT6FADD0C5_cuebots', 985),
}
LG = {'RL': ((235,235,485,515),'rhino'), 'EL': ((250,625,510,905),'evo'), 'TL': ((980,225,1240,520),'timetip'), 'CL': ((955,625,1200,905),'cuebots')}
BANNER = [(95,500,540,595),(130,888,492,992),(905,515,1342,607),(948,888,1332,992)]

# 1. xóa người + logo AI (inpaint)
xoa = np.zeros((H,W),np.uint8); pm = {}; lm = {}
for k,(b,_,_) in P.items(): pm[k]=full_mask(k,b); xoa |= (pm[k]>100)
for k,(b,_) in LG.items(): lm[k]=full_mask(k,b); xoa |= (lm[k]>100)
xoa = cv2.dilate(xoa.astype(np.uint8)*255, np.ones((9,9),np.uint8))
arr = cv2.cvtColor(np.array(goc), cv2.COLOR_RGB2BGR)
# lấp chỗ trống: inpaint ở độ phân giải 1/4 (mảng lớn mượt, không vệt), phóng lại, mép mềm + hạt nhiễu
nho = cv2.resize(arr, (W//4, H//4), interpolation=cv2.INTER_AREA)
mn = cv2.dilate(cv2.resize(xoa, (W//4, H//4), interpolation=cv2.INTER_NEAREST), np.ones((3,3),np.uint8))
lap = cv2.inpaint(nho, mn, 8, cv2.INPAINT_TELEA)
lap = cv2.GaussianBlur(cv2.resize(lap, (W,H), interpolation=cv2.INTER_CUBIC), (0,0), 6)
rng = np.random.default_rng(3); lap = np.clip(lap.astype(np.float32) + rng.normal(0,5,lap.shape), 0, 255)
mm = cv2.GaussianBlur(xoa.astype(np.float32)/255, (0,0), 4)[:,:,None]
nen = (arr*(1-mm) + lap*mm).astype(np.uint8)
out = Image.fromarray(cv2.cvtColor(nen, cv2.COLOR_BGR2RGB)).convert('RGBA')

def dau(mask):  # đỉnh đầu, tâm & bề rộng đầu (đo ở 9-11% chiều cao người tính từ đỉnh)
    ys,xs = np.where(mask>100); top=ys.min(); hh=ys.max()-top
    ws=[]; cs=[]
    for y in range(int(top+0.06*hh), int(top+0.12*hh)):
        r=np.where(mask[y]>100)[0]
        if len(r): ws.append(r.max()-r.min()); cs.append((r.max()+r.min())/2)
    return top, float(np.median(cs)), float(np.median(ws))

# 2. dán người thật
for k,(b,f,day) in P.items():
    # (tỷ lệ, đỉnh đầu y, phía bám mép) — ảnh thật phủ kín vùng người cũ, mép thẳng của ảnh nằm ngoài khung / sau logo, băng tên
    sc, dinh, phia = DAT[k]
    th = Image.open(f'{S}/drive/clean/{f}.png').convert('RGBA')
    rt = MAT[k][1][0]
    aa = np.array(th.split()[-1]).astype(np.float32); hh_, ww_ = aa.shape
    ramp = np.clip(np.arange(ww_)/(0.10*ww_),0,1)          # mờ dần ở mép phía trong (giữa poster)
    aa *= (ramp[::-1] if phia=='trai' else ramp)[None,:]
    th.putalpha(Image.fromarray(aa.astype(np.uint8)))
    th2 = th.resize((round(ww_*sc), round(hh_*sc)), Image.LANCZOS)
    y = round(dinh - rt*sc)
    x = -6 if phia=='trai' else W + 6 - th2.size[0]
    s = sc
    lop = Image.new('RGBA',(W,H),(0,0,0,0)); lop.paste(th2,(x,y),th2)
    # cắt ở đáy khung người + giới hạn theo cột khung (không tràn sang giữa poster)
    la = np.array(lop); la[day:,:,3]=0
    x0,_,x1,_ = b; la[:,:max(0,x0-5),3]=0; la[:,min(W,x1+5):,3]=0
    lop = Image.fromarray(la)
    # bóng đổ nhẹ
    sh = Image.fromarray(np.dstack([np.zeros((H,W,3),np.uint8), (la[:,:,3]*0.5).astype(np.uint8)])).filter(ImageFilter.GaussianBlur(12))
    out.alpha_composite(sh); out.alpha_composite(lop)
    print(k, 'scale', round(s,3), 'pos', x, y)

# 3. dán logo thật lên vị trí logo AI
for k,(b,key) in LG.items():
    ys,xs=np.where(lm[k]>100); bx0,bx1,by0,by1 = xs.min(),xs.max(),ys.min(),ys.max()
    lg = Image.open(f'{S}/rm/public/logo_{key}.png').convert('RGBA'); lg=lg.crop(lg.getbbox())
    hh = (by1-by0)*1.0; ww = (bx1-bx0)*1.0
    s = min(hh/lg.size[1], ww/lg.size[0])*1.04
    lg2 = lg.resize((round(lg.size[0]*s), round(lg.size[1]*s)), Image.LANCZOS)
    cx=(bx0+bx1)/2; cy=(by0+by1)/2
    x=round(cx-lg2.size[0]/2); y=round(cy-lg2.size[1]/2)
    glow = Image.new('RGBA',(W,H),(0,0,0,0)); g=Image.new('RGBA',lg2.size,(255,200,90,0)); g.putalpha(lg2.split()[-1].point(lambda v:int(v*0.55)))
    glow.paste(g,(x,y),g); glow=glow.filter(ImageFilter.GaussianBlur(14))
    sd = Image.new('RGBA',(W,H),(0,0,0,0)); d=Image.new('RGBA',lg2.size,(0,0,0,0)); d.putalpha(lg2.split()[-1].point(lambda v:int(v*0.6)))
    sd.paste(d,(x+6,y+10),d); sd=sd.filter(ImageFilter.GaussianBlur(8))
    out.alpha_composite(glow); out.alpha_composite(sd)
    lop=Image.new('RGBA',(W,H),(0,0,0,0)); lop.paste(lg2,(x,y),lg2); out.alpha_composite(lop)
    print(k,'logo',x,y,lg2.size)

# 4. dán lại băng tên đội từ ảnh gốc (nằm trước người), trừ phần người AI và logo AI
ga = np.array(goc.convert('RGBA'))
for (x0,y0,x1,y1) in BANNER:
    m = np.zeros((H,W),np.uint8); m[y0:y1,x0:x1]=255
    loai = np.zeros((H,W),bool)
    for v in pm.values(): loai |= v>60
    for v in lm.values(): loai |= v>60
    loai = cv2.dilate(loai.astype(np.uint8),np.ones((5,5),np.uint8))>0
    m[loai]=0
    m[905:985,1222:1336]=255   # chữ "FC" của CUEBOTS FC bị mask người AI ăn vào
    m = cv2.GaussianBlur(m,(3,3),0)
    lop = ga.copy(); lop[:,:,3]=m
    out.alpha_composite(Image.fromarray(lop))
out.convert('RGB').save('ket_qua.png')
