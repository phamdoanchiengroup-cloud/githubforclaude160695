# -*- coding: utf-8 -*-
"""Sinh 4 hoạt ảnh Lottie (JSON chuẩn Bodymovin) cùng tông màu web KPI, ghi vào kpi-app/lottie/.
   python3 kpi-app/tests/tao-lottie.py
Mở được bằng LottieFiles (Upload) để sửa tiếp, hoặc phát bằng lottie-web."""
import json, math, os

RA = os.path.join(os.path.dirname(__file__), '..', 'lottie')
os.makedirs(RA, exist_ok=True)

def mau(h, a=1):
    h = h.lstrip('#'); return [int(h[i:i+2], 16) / 255 for i in (0, 2, 4)] + [a]
CY, CY2, TR, XAM, XAM2, AM, DO = mau('#2fd3c6'), mau('#16a89d'), mau('#ffffff'), mau('#aab5bc'), mau('#3a434b'), mau('#f0b04e'), mau('#f26b6b')

def tinh(v): return {'a': 0, 'k': v}
def kf(ds, de=(0.25, 1), ra=(0.5, 0)):
    """ds = [(khung, giá trị)] ; giá trị số hoặc list. Nội suy mượt (ease-out)."""
    out = []
    for i, (t, v) in enumerate(ds):
        v = v if isinstance(v, list) else [v]
        k = {'t': t, 's': v}
        if i < len(ds) - 1:
            n = len(v)
            k['i'] = {'x': [de[0]] * n, 'y': [de[1]] * n}
            k['o'] = {'x': [ra[0]] * n, 'y': [ra[1]] * n}
        out.append(k)
    return {'a': 1, 'k': out}
def tr(p=(0, 0), a=(0, 0), s=(100, 100), r=0, o=100):
    return {'ty': 'tr', 'p': p if isinstance(p, dict) else tinh(list(p)), 'a': tinh(list(a)), 's': s if isinstance(s, dict) else tinh(list(s)),
            'r': r if isinstance(r, dict) else tinh(r), 'o': o if isinstance(o, dict) else tinh(o), 'sk': tinh(0), 'sa': tinh(0)}
def nhom(ten, it, **k): return {'ty': 'gr', 'nm': ten, 'it': it + [tr(**k)]}
def elip(w, h=None, p=(0, 0)): return {'ty': 'el', 'p': tinh(list(p)), 's': tinh([w, h or w]), 'd': 1}
def chunhat(w, h, r=0, p=(0, 0)): return {'ty': 'rc', 'p': tinh(list(p)), 's': tinh([w, h]), 'r': tinh(r), 'd': 1}
def duong(pts, dong=False):
    return {'ty': 'sh', 'ks': tinh({'i': [[0, 0]] * len(pts), 'o': [[0, 0]] * len(pts), 'v': [list(p) for p in pts], 'c': dong})}
def vien(c, w, o=100): return {'ty': 'st', 'c': tinh(c), 'o': o if isinstance(o, dict) else tinh(o), 'w': tinh(w), 'lc': 2, 'lj': 2, 'ml': 4}
def to(c, o=100): return {'ty': 'fl', 'c': tinh(c), 'o': o if isinstance(o, dict) else tinh(o), 'r': 1}
def cat(e, s=None, o=None): return {'ty': 'tm', 's': s or tinh(0), 'e': e, 'o': o or tinh(0), 'm': 1}
def lop(ten, ind, shapes, op, p=(100, 100), s=None, r=None, o=None):
    ks = {'o': o or tinh(100), 'r': r or tinh(0), 'p': p if isinstance(p, dict) else tinh(list(p) + [0]), 'a': tinh([0, 0, 0]), 's': s or tinh([100, 100, 100])}
    return {'ddd': 0, 'ind': ind, 'ty': 4, 'nm': ten, 'sr': 1, 'ks': ks, 'ao': 0, 'shapes': shapes, 'ip': 0, 'op': op, 'st': 0, 'bm': 0}
def tep(ten, op, lops, w=200, h=200):
    return {'v': '5.7.4', 'fr': 60, 'ip': 0, 'op': op, 'w': w, 'h': h, 'nm': ten, 'ddd': 0, 'assets': [], 'layers': lops}

# ---------- 1. Đang tổng hợp báo cáo (lặp 150 khung = 2,5 giây) ----------
OP = 150
giay = [nhom('khung', [chunhat(70, 90, 8), vien(XAM, 5)]),
        nhom('goc gap', [duong([(14, -45), (35, -24)]), vien(XAM, 5)])]
dong = []
for i, (y, dai) in enumerate([(-20, 40), (-4, 40), (12, 28)]):
    b = 10 + i * 22
    dong.append(nhom('dong %d' % i, [duong([(-20, y), (-20 + dai, y)]), vien(CY, 6),
                 cat(kf([(0, 0), (b, 0), (b + 26, 100), (118, 100), (136, 0)]))]))
# cột biểu đồ nhỏ mọc lên ở chân trang giấy
cot = []
for i, (x, hcao) in enumerate([(-14, 10), (-2, 16), (10, 7)]):
    b = 72 + i * 8
    cot.append(nhom('cot %d' % i, [chunhat(7, hcao, 1.5, (x, 34 - hcao / 2)), to(AM)],
                    s=kf([(0, [100, 0]), (b, [100, 0]), (b + 16, [100, 100]), (118, [100, 100]), (136, [100, 0])]), a=(x, 34), p=(x, 34)))
vong = nhom('vong', [elip(150), vien(CY2, 6), cat(e=kf([(0, 4), (75, 70), (OP, 4)]), s=tinh(0), o=kf([(0, 0), (OP, 720)], (0.4, 0.6), (0.6, 0.4)))])
nen = nhom('nen vong', [elip(150), vien(XAM2, 6)])
bao_cao = tep('dang-tong-hop-bao-cao', OP, [
    lop('giay', 1, dong + cot + giay, OP),
    lop('vong', 2, [vong], OP),
    lop('nen', 3, [nen], OP)])

# ---------- 2. Duyệt xong (phát 1 lần, 80 khung) ----------
OP = 80
tron = nhom('tron', [elip(96), to(CY)], s=kf([(0, [0, 0]), (14, [112, 112]), (22, [100, 100])], (0.3, 1), (0.6, 0)))
dau = nhom('dau tich', [duong([(-22, 1), (-6, 17), (24, -15)]), vien(mau('#06201e'), 10), cat(kf([(14, 0), (34, 100)], (0.2, 1), (0.6, 0)))])
tia = []
for k in range(8):
    g = math.radians(k * 45 + 22.5); dx, dy = math.cos(g), math.sin(g)
    tia.append(nhom('tia %d' % k, [duong([(dx * 58, dy * 58), (dx * 72, dy * 72)]), vien(CY if k % 2 else AM, 5),
        cat(e=kf([(18, 0), (30, 100)]), s=kf([(24, 0), (40, 100)]))]))
song = nhom('song', [elip(96), vien(CY, 3, kf([(0, 0), (10, 0), (12, 70), (44, 0)]))], s=kf([(10, [100, 100]), (44, [160, 160])], (0.2, 1), (0.5, 0)))
thanh_cong = tep('duyet-xong', OP, [lop('dau', 1, [dau], OP), lop('tron', 2, [tron], OP), lop('tia', 3, tia, OP), lop('song', 4, [song], OP)])

# ---------- 3. Đã duyệt hết / trang trống (lặp 240 khung = 4 giây, nhẹ nhàng) ----------
OP = 240
bang = [nhom('kep', [chunhat(30, 12, 4, (0, -46)), to(XAM)]),
        nhom('bang', [chunhat(80, 100, 10), vien(XAM, 5)])]
for i, y in enumerate([-18, 4, 26]):
    bang.append(nhom('tich %d' % i, [duong([(-24, y), (-18, y + 6), (-8, y - 6)]), vien(CY, 5)]))
    bang.append(nhom('vach %d' % i, [duong([(0, y), (22, y)]), vien(XAM2, 5)]))
noi = lop('bang', 1, bang, OP, p=kf([(0, [100, 104, 0]), (120, [100, 96, 0]), (240, [100, 104, 0])], (0.45, 1), (0.55, 0)))
sao = []
for i, (x, y, s0) in enumerate([(-56, -40, 20), (58, -22, 90), (48, 44, 160)]):
    sao.append(nhom('sao %d' % i, [duong([(0, -9), (0, 9)]), duong([(-9, 0), (9, 0)]), vien(AM if i == 1 else CY, 3.5)], p=(x, y),
                    s=kf([(0, [0, 0]), (s0, [0, 0]), (s0 + 24, [100, 100]), (s0 + 56, [0, 0]), (239, [0, 0])])))
bong = nhom('bong', [elip(70, 10, (0, 0)), to(mau('#000000'), 30)], s=kf([(0, [90, 100]), (120, [110, 100]), (240, [90, 100])], (0.45, 1), (0.55, 0)))
trong = tep('da-duyet-het', OP, [noi, lop('sao', 2, sao, OP), lop('bong', 3, [bong], OP, p=(100, 166))])

# ---------- 4. Mất kết nối (180 khung, lặp) ----------
OP = 180
cung = []
for i, (d, b) in enumerate([(130, 30), (90, 20), (50, 10)]):
    cung.append(nhom('cung %d' % i, [elip(d), vien(XAM, 7, kf([(0, 25), (b, 25), (b + 12, 100), (100, 100), (118, 25), (180, 25)])),
                 cat(tinh(25), tinh(0), tinh(-45))], p=(0, 30)))
cham = nhom('cham', [elip(14, p=(0, 30)), to(XAM)])
gach = nhom('gach', [duong([(-46, -40), (46, 52)]), vien(DO, 8), cat(kf([(52, 0), (70, 100), (150, 100), (166, 0)], (0.2, 1), (0.6, 0)))])
lac = kf([(70, 0), (74, -6), (78, 5), (82, -3), (86, 0)])
mat_mang = tep('mat-ket-noi', OP, [lop('gach', 1, [gach], OP), lop('wifi', 2, cung + [cham], OP, r=lac)])

for ten, d in [('dang-tong-hop-bao-cao', bao_cao), ('duyet-xong', thanh_cong), ('da-duyet-het', trong), ('mat-ket-noi', mat_mang)]:
    with open(os.path.join(RA, ten + '.json'), 'w', encoding='utf-8') as f:
        json.dump(d, f, ensure_ascii=False, separators=(',', ':'))
    print(ten, os.path.getsize(os.path.join(RA, ten + '.json')), 'byte')
