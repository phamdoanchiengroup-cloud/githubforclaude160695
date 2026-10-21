# -*- coding: utf-8 -*-
"""Đợt 2: 6 hoạt ảnh Lottie cho các phần khác của web KPI (cùng phong cách 4 mẫu đầu), ghi vào kpi-app/lottie/.
   python3 kpi-app/tests/tao-lottie-2.py
   chot-thang · diem-danh-xong · gui-cho-duyet · xuat-excel · chua-co-du-lieu · het-phien"""
import json, math, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); sys.dont_write_bytecode = True
from lottie_cu import *

RA = os.path.join(os.path.dirname(__file__), '..', 'lottie')
NEN = mau('#21262b')        # màu mặt thẻ (che nét phía sau)
TOI = mau('#06201e')

def vien_dut(c, w, gach=8, ho=9, lech=None):
    v = vien(c, w); v['d'] = [{'n': 'd', 'nm': 'gach', 'v': tinh(gach)}, {'n': 'g', 'nm': 'ho', 'v': tinh(ho)}, {'n': 'o', 'nm': 'lech', 'v': lech or tinh(0)}]
    return v
def quai(w, h):
    """Quai ổ khóa hình chữ U ngược, đỉnh tròn (rộng 2w, cao h, chân ở y=0)."""
    k = w * 0.55
    return {'ty': 'sh', 'ks': tinh({'v': [[-w, 0], [-w, -h + w], [0, -h], [w, -h + w], [w, 0]],
                                    'i': [[0, 0], [0, 0], [-k, 0], [0, -k], [0, 0]],
                                    'o': [[0, 0], [0, -k], [k, 0], [0, 0], [0, 0]], 'c': False})}
def xuat_hien(b, dai=14, s0=0, s1=100, vuot=110):
    """Phóng từ s0 lên s1 bắt đầu ở khung b (có nảy nhẹ)."""
    return kf([(0, [s0, s0]), (b, [s0, s0]), (b + dai * .7, [vuot, vuot]), (b + dai, [s1, s1])], (0.3, 1), (0.6, 0))
def mo_dan(b, dai=10, o0=0, o1=100):
    return kf([(0, o0), (b, o0), (b + dai, o1)])

# ---------- 1. Chốt tháng: con dấu đóng lên bảng KPI (phát 1 lần, 110 khung) ----------
OP = 110
giay = []
for i, y in enumerate([-34, -18, -2]):
    giay.append(nhom('dong %d' % i, [duong([(-30, y), (30 - i * 12, y)]), vien(XAM2, 5)]))
for i, (x, h) in enumerate([(-24, 14), (-10, 22), (4, 18), (18, 28)]):
    giay.append(nhom('cot %d' % i, [chunhat(9, h, 2, (x, 40 - h / 2)), to(CY, 70)]))
# dấu đỏ-cam in lên giấy lúc con dấu chạm (khung 24)
giay.append(nhom('khung', [chunhat(92, 112, 9), to(NEN), vien(XAM, 5)]))
an = nhom('vet dau', [elip(64), vien(AM, 5), duong([(-14, 1), (-4, 11), (15, -10)]), vien(AM, 6)],
          p=(0, 6), r=-12, s=kf([(0, [0, 0]), (23, [0, 0]), (24, [118, 118]), (36, [100, 100])], (0.3, 1), (0.6, 0)),
          o=kf([(0, 0), (23, 0), (24, 100)]))
# con dấu: rơi xuống – ép – nhấc lên – mờ
dau = [nhom('num', [elip(30, 16, (0, -44)), to(XAM)]),
       nhom('than', [chunhat(16, 34, 4, (0, -22)), to(XAM)]),
       nhom('de', [chunhat(60, 14, 4, (0, 0)), to(AM)])]
dau_lop = lop('con dau', 1, dau, OP,
              p=kf([(0, [100, 10, 0]), (18, [100, 96, 0]), (24, [100, 100, 0]), (32, [100, 96, 0]), (54, [100, 10, 0])], (0.4, 1), (0.6, 0)),
              s=kf([(0, [100, 100, 100]), (20, [100, 100, 100]), (24, [108, 90, 100]), (32, [100, 100, 100])]),
              o=kf([(0, 0), (6, 100), (44, 100), (56, 0)]))
# khóa nhỏ góc dưới phải: cái quai sập xuống (khung 64–74)
khoa = [nhom('lo khoa', [elip(5, 5, (0, 8)), to(TOI)]),
        nhom('than khoa', [chunhat(26, 20, 4, (0, 9)), to(CY)]),
        nhom('quai', [quai(8, 16), vien(CY, 4.5)],
             p=kf([(0, [0, -7]), (64, [0, -7]), (74, [0, 1])], (0.3, 1), (0.7, 0)))]
khoa_lop = lop('khoa', 2, khoa, OP, p=(146, 146), s=xuat_hien(56, 12, s0=0), o=mo_dan(56, 6))
chot_thang = tep('chot-thang', OP, [dau_lop, khoa_lop, lop('vet', 3, [an], OP), lop('giay', 4, giay, OP)])

# ---------- 2. Điểm danh xong: từng người sáng lên, 1 người nghỉ (phát 1 lần, 120 khung) ----------
OP = 120
nguoi = []
for i, x in enumerate([-64, -32, 0, 32, 64]):
    b = 8 + i * 9
    mau_i = AM if i == 3 else CY
    nguoi.append(nhom('nguoi %d' % i, [
        nhom('dau', [elip(16, p=(0, -14)), to(mau_i)]),
        nhom('vai', [chunhat(26, 16, 8, (0, 6)), to(mau_i)])],
        p=(x, -16), s=xuat_hien(b, 14, s0=60, s1=100, vuot=112), o=mo_dan(b, 6)))
    nguoi.append(nhom('nen %d' % i, [elip(16, p=(0, -14)), chunhat(26, 16, 8, (0, 6)), to(XAM2)], p=(x, -16)))
thanh = [nhom('day', [duong([(-74, 34), (74, 34)]), vien(CY, 8), cat(kf([(0, 0), (10, 0), (62, 80)], (0.3, 1), (0.6, 0)))]),
         nhom('ray', [duong([(-74, 34), (74, 34)]), vien(XAM2, 8)])]
tich = nhom('tich', [nhom('dau', [duong([(-7, 0), (-2, 5), (8, -6)]), vien(TOI, 4.5), cat(kf([(0, 0), (78, 0), (90, 100)]))]),
                     nhom('nen', [elip(30), to(CY)])], p=(0, 70), s=xuat_hien(68, 14))
diem_danh = tep('diem-danh-xong', OP, [lop('nguoi', 1, nguoi, OP, p=(100, 96)), lop('thanh', 2, thanh, OP, p=(100, 96)),
                                       lop('tich', 3, [tich], OP, p=(100, 96))])

# ---------- 3. Gửi sản lượng – chờ duyệt: phiếu trượt vào khay, đồng hồ chờ (phát 1 lần, 180 khung) ----------
OP = 180
phieu = []
for i, y in enumerate([-16, -4, 8]):
    phieu.append(nhom('d%d' % i, [duong([(-16, y), (16 - i * 8, y)]), vien(CY, 4)]))
phieu.append(nhom('to', [chunhat(54, 66, 6), to(NEN), vien(XAM, 4.5)]))
phieu_lop = lop('phieu', 2, phieu, OP, p=kf([(0, [100, 28, 0]), (34, [100, 104, 0])], (0.3, 1), (0.6, 0)), o=kf([(0, 0), (8, 100)]))
khay_truoc = lop('khay truoc', 1, [nhom('mieng', [chunhat(104, 30, 6, (0, 0)), to(mau('#2a3036'))]),
                                   nhom('vien', [duong([(-52, -15), (52, -15)]), vien(XAM, 5)])], OP, p=(100, 146))
khay_sau = lop('khay sau', 3, [nhom('sau', [duong([(-52, -22), (-52, 15), (52, 15), (52, -22)]), vien(XAM, 5)])], OP, p=(100, 146))
dong_ho = [nhom('kim phut', [duong([(0, 0), (0, -12)]), vien(AM, 3.5)], r=kf([(0, 0), (60, 0), (180, 720)], (0.5, 0.5), (0.5, 0.5))),
           nhom('kim gio', [duong([(0, 0), (7, 0)]), vien(AM, 3.5)], r=kf([(0, 0), (60, 0), (180, 60)], (0.5, 0.5), (0.5, 0.5))),
           nhom('mat', [elip(36), to(NEN), vien(AM, 4)])]
dh_lop = lop('dong ho', 0, dong_ho, OP, p=(146, 60), s=xuat_hien(40, 16), o=mo_dan(40, 6))
dh_lop['ind'] = 4
gui_cho = tep('gui-cho-duyet', OP, [dh_lop, khay_truoc, phieu_lop, khay_sau])

# ---------- 4. Xuất Excel: ô bảng điền dần, mũi tên tải xuống (phát 1 lần, 120 khung) ----------
OP = 120
bang = []
for r in range(4):
    for c in range(3):
        b = 4 + (r * 3 + c) * 3.5
        bang.append(nhom('o %d %d' % (r, c), [chunhat(26, 12, 2, (-30 + c * 30, -27 + r * 18)), to(CY if c else XAM, 75 if c else 60)],
                         a=(-30 + c * 30, -27 + r * 18), p=(-30 + c * 30, -27 + r * 18),
                         s=kf([(0, [0, 100]), (b, [0, 100]), (b + 10, [100, 100])], (0.3, 1), (0.6, 0))))
bang.append(nhom('khung', [chunhat(100, 82, 8), to(NEN), vien(XAM, 4.5)]))
bang_lop = lop('bang', 2, bang, OP, p=kf([(0, [100, 92, 0]), (54, [100, 92, 0]), (68, [100, 76, 0])], (0.3, 1), (0.6, 0)),
               s=kf([(0, [100, 100, 100]), (54, [100, 100, 100]), (68, [82, 82, 100])], (0.3, 1), (0.6, 0)))
ten = lop('mui ten', 1, [nhom('than', [duong([(0, -16), (0, 14)]), duong([(-12, 3), (0, 15), (12, 3)]), vien(AM, 6)])], OP,
          p=kf([(0, [100, 120, 0]), (60, [100, 120, 0]), (84, [100, 150, 0])], (0.3, 1), (0.6, 0)), o=kf([(0, 0), (60, 0), (66, 100)]))
khay = lop('khay', 3, [nhom('k', [duong([(-34, -6), (-34, 8), (34, 8), (34, -6)]), vien(XAM, 5)]),
                       nhom('sang', [duong([(-34, -6), (-34, 8), (34, 8), (34, -6)]), vien(CY, 5, kf([(0, 0), (84, 0), (88, 100)]))])], OP, p=(100, 172))
xuat_excel = tep('xuat-excel', OP, [ten, bang_lop, khay])

# ---------- 5. Kỳ chưa có dữ liệu: kính lúp dò trên biểu đồ trống (lặp 240 khung) ----------
OP = 240
truc = [nhom('truc', [duong([(-70, -50), (-70, 44), (72, 44)]), vien(XAM, 5)]),
        nhom('vach ngang', [duong([(-60, 4), (66, 4)]), vien_dut(XAM2, 4, 7, 9, kf([(0, 0), (240, -64)], (0.5, 0.5), (0.5, 0.5)))])]
lup = [nhom('kinh', [elip(38), to(CY, 12), vien(CY, 5.5)]),
       nhom('can', [duong([(14, 14), (30, 30)]), vien(CY, 7)])]
lup_lop = lop('kinh lup', 1, lup, OP,
              p=kf([(0, [70, 92, 0]), (80, [128, 78, 0]), (160, [104, 104, 0]), (240, [70, 92, 0])], (0.45, 1), (0.55, 0)),
              r=kf([(0, -6), (80, 6), (160, -2), (240, -6)], (0.45, 1), (0.55, 0)))
chua_co = tep('chua-co-du-lieu', OP, [lup_lop, lop('bieu do', 2, truc, OP, p=(100, 96))])

# ---------- 6. Hết phiên đăng nhập: đồng hồ + ổ khóa (lặp 180 khung) ----------
OP = 180
mat = []
for k in range(12):
    g = math.radians(k * 30); dx, dy = math.sin(g), -math.cos(g)
    dai = 10 if k % 3 == 0 else 6
    mat.append(nhom('vach %d' % k, [duong([(dx * 44, dy * 44), (dx * (44 - dai), dy * (44 - dai))]), vien(XAM if k % 3 == 0 else XAM2, 4)]))
mat.append(nhom('kim phut', [duong([(0, 0), (0, -34)]), vien(XAM, 5)], r=kf([(0, 0), (180, 360)], (0.5, 0.5), (0.5, 0.5))))
mat.append(nhom('kim gio', [duong([(0, 0), (20, 0)]), vien(XAM, 5)], r=kf([(0, 0), (180, 30)], (0.5, 0.5), (0.5, 0.5))))
mat.append(nhom('mat', [elip(112), to(NEN), vien(XAM, 5)]))
khoa2 = [nhom('lo', [elip(7, 7, (0, 10)), to(TOI)]), nhom('lo2', [chunhat(3, 8, 1, (0, 15)), to(TOI)]),
         nhom('than', [chunhat(38, 28, 6, (0, 12)), to(AM)]),
         nhom('quai', [quai(11, 22), vien(AM, 6)],
              p=kf([(0, [0, 0]), (90, [0, 0]), (102, [0, -5]), (114, [0, 0]), (180, [0, 0])], (0.4, 1), (0.6, 0)))]
het_phien = tep('het-phien', OP, [lop('khoa', 1, khoa2, OP, p=(142, 140), r=kf([(0, 0), (90, 0), (96, -8), (102, 6), (108, -3), (114, 0)])),
                                  lop('dong ho', 2, mat, OP, p=(92, 92))])

for ten_tep, d in [('chot-thang', chot_thang), ('diem-danh-xong', diem_danh), ('gui-cho-duyet', gui_cho),
                   ('xuat-excel', xuat_excel), ('chua-co-du-lieu', chua_co), ('het-phien', het_phien)]:
    with open(os.path.join(RA, ten_tep + '.json'), 'w', encoding='utf-8') as f:
        json.dump(d, f, ensure_ascii=False, separators=(',', ':'))
    print(ten_tep, os.path.getsize(os.path.join(RA, ten_tep + '.json')), 'byte')
