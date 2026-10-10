# -*- coding: utf-8 -*-
"""Đợt 4: 6 hoạt ảnh Lottie cho các phần khác của web KPI, ghi vào kpi-app/lottie/.
   python3 kpi-app/tests/tao-lottie-4.py
   chot-ca · de-xuat-dinh-muc · mien-tru · cap-lai-mat-khau · gan-cong-doan · thanh-ly-may"""
import json, math, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); sys.dont_write_bytecode = True
from lottie_cu import *

RA = os.path.join(os.path.dirname(__file__), '..', 'lottie')
NEN, KHAY, TOI = mau('#21262b'), mau('#2a3036'), mau('#06201e')
def hien(b, dai=14, s1=100, vuot=112):
    return kf([(0, [0, 0]), (b, [0, 0]), (b + dai * .7, [vuot, vuot]), (b + dai, [s1, s1])], (0.3, 1), (0.6, 0))
def mo(b, dai=8): return kf([(0, 0), (b, 0), (b + dai, 100)])
def danh_so(ds):
    for i, l in enumerate(ds): l['ind'] = i + 1
    return ds
def tich_tron(d=34, b=0):
    return [nhom('dau', [duong([(-d * .22, 0), (-d * .06, d * .17), (d * .26, -d * .17)]), vien(TOI, d * .13), cat(kf([(0, 0), (b, 0), (b + 14, 100)]))]),
            nhom('nen', [elip(d), to(CY)])]

# ---------- 1. Chốt ca: thẻ ca vào máy chấm công rồi bật ra đã bấm lỗ (1 lần, 130 khung) ----------
OP = 130
the = [nhom('lo bam', [chunhat(16, 5, 2, (0, -18)), to(AM)], o=kf([(0, 0), (58, 0), (60, 100)])),
       nhom('dong', [duong([(-12, 0), (12, 0)]), duong([(-12, 10), (6, 10)]), vien(XAM2, 4)]),
       nhom('the', [chunhat(40, 58, 5), to(NEN), vien(CY, 4)])]
the_l = lop('the ca', 0, the, OP, p=kf([(0, [100, 22, 0]), (14, [100, 40, 0]), (40, [100, 130, 0]), (60, [100, 130, 0]), (82, [100, 56, 0])], (0.35, 1), (0.6, 0)),
            o=kf([(0, 0), (8, 100)]))
may = [nhom('kim phut', [duong([(0, 0), (0, -13)]), vien(XAM, 3.5)], p=(0, 8), r=kf([(0, 0), (36, 0), (60, 360)], (0.4, 0.4), (0.6, 0.6))),
       nhom('kim gio', [duong([(0, 0), (8, 0)]), vien(XAM, 3.5)], p=(0, 8)),
       nhom('mat', [elip(44, p=(0, 8)), to(NEN), vien(XAM, 4)]),
       nhom('khe', [chunhat(54, 7, 3, (0, -48)), to(TOI)]),
       nhom('than', [chunhat(96, 96, 12), to(KHAY), vien(XAM, 5)])]
may_l = lop('may cham cong', 0, may, OP, p=(100, 134))
dau = lop('tich', 0, tich_tron(32, 92), OP, p=(150, 46), s=hien(86))
chot_ca = tep('chot-ca', OP, danh_so([dau, may_l, the_l]))

# ---------- 2. Đề xuất định mức: kim trên thước trượt từ mức cũ sang mức mới, mũi tên gửi lên (1 lần, 120 khung) ----------
OP = 120
thuoc = [nhom('vach %d' % i, [duong([(x, 34), (x, 34 + (10 if i % 2 == 0 else 6))]), vien(XAM, 3)]) for i, x in enumerate(range(-70, 71, 14))]
thuoc += [nhom('day moi', [duong([(-14, 20), (42, 20)]), vien(CY, 10), cat(kf([(0, 0), (12, 0), (52, 100)], (0.3, 1), (0.6, 0)))]),
          nhom('ray', [duong([(-70, 20), (70, 20)]), vien(XAM2, 10)])]
kim_cu = nhom('kim cu', [duong([(0, 4), (-7, -8), (7, -8)], True), to(XAM)], p=(-14, 8))
kim_moi = nhom('kim moi', [duong([(0, 4), (-8, -10), (8, -10)], True), to(CY)],
               p=kf([(0, [-14, 6]), (12, [-14, 6]), (46, [48, 6]), (54, [42, 6])], (0.3, 1), (0.6, 0)))
ten = lop('mui ten', 0, [nhom('t', [duong([(0, 16), (0, -16)]), duong([(-11, -5), (0, -17), (11, -5)]), vien(AM, 6)])], OP,
          p=kf([(0, [100, 92, 0]), (60, [100, 92, 0]), (96, [100, 44, 0])], (0.3, 1), (0.6, 0)), o=kf([(0, 0), (60, 0), (66, 100), (96, 100), (110, 0)]))
de_xuat = tep('de-xuat-dinh-muc', OP, danh_so([ten, lop('kim', 0, [kim_moi, kim_cu], OP, p=(100, 100)), lop('thuoc', 0, thuoc, OP, p=(100, 100))]))

# ---------- 3. Miễn trừ KPI: khiên che lên ngày bị trừ (1 lần, 110 khung) ----------
OP = 110
lich = []
for h in range(3):
    for c in range(5):
        lich.append(nhom('o%d%d' % (h, c), [elip(6, p=(-32 + c * 16, -6 + h * 16)), to(XAM2)]))
lich += [nhom('ngay tru', [chunhat(16, 14, 4, (0, 10)), to(DO, 85)], o=kf([(0, 100), (40, 100), (56, 25)])),
         nhom('dau', [chunhat(96, 18, 6, (0, -30)), to(XAM2)]), nhom('khung', [chunhat(96, 84, 10, (0, -6)), to(NEN), vien(XAM, 5)])]
khien = [nhom('dau', [duong([(-10, 0), (-3, 8), (11, -8)]), vien(TOI, 6), cat(kf([(0, 0), (40, 0), (56, 100)]))]),
         nhom('khien', [{'ty': 'sh', 'ks': tinh({'v': [[0, -30], [26, -20], [24, 8], [0, 30], [-24, 8], [-26, -20]],
                                                  'i': [[0, 0], [-8, -4], [4, -14], [14, 4], [0, 0], [-4, 6]],
                                                  'o': [[8, 4], [0, 0], [-4, 14], [-14, -4], [4, -6], [0, 0]], 'c': True})}, to(CY)])]
khien_l = lop('khien', 0, khien, OP, p=(120, 120), s=hien(24, 16))
mien_tru = tep('mien-tru', OP, danh_so([khien_l, lop('lich', 0, lich, OP, p=(88, 92))]))

# ---------- 4. Cấp lại mật khẩu: chìa khóa trượt vào, xoay, tia sáng (1 lần, 100 khung) ----------
OP = 100
chia = [nhom('rang', [duong([(22, 0), (22, 12)]), duong([(34, 0), (34, 9)]), vien(AM, 7)]),
        nhom('than', [duong([(-14, 0), (44, 0)]), vien(AM, 8)]),
        nhom('dau', [elip(36, p=(-30, 0)), vien(AM, 8)])]
chia_l = lop('chia', 0, chia, OP, p=kf([(0, [40, 100, 0]), (34, [96, 100, 0])], (0.3, 1), (0.6, 0)),
             s=kf([(0, [100, 100, 100]), (38, [100, 100, 100]), (46, [100, 25, 100]), (54, [100, 100, 100])], (0.4, 0.4), (0.6, 0.6)), o=kf([(0, 0), (8, 100)]))
tia = []
for i, (x, y, b) in enumerate([(150, 52, 56), (160, 96, 62), (136, 34, 68)]):
    tia.append(nhom('tia %d' % i, [duong([(0, -8), (0, 8)]), duong([(-8, 0), (8, 0)]), vien(CY, 3.5)], p=(x, y),
                    s=kf([(0, [0, 0]), (b, [0, 0]), (b + 10, [110, 110]), (b + 22, [80, 80])])))
cap_lai = tep('cap-lai-mat-khau', OP, danh_so([lop('tia', 0, tia, OP, p=(0, 0)), chia_l]))

# ---------- 5. Gán công đoạn cho nhiều người: dây nối từng người tới thẻ công đoạn (1 lần, 120 khung) ----------
OP = 120
nguoi = []
for i, y in enumerate([-44, 0, 44]):
    nguoi += [nhom('dau%d' % i, [elip(14, p=(-62, y - 7)), to(CY)]), nhom('vai%d' % i, [chunhat(24, 12, 6, (-62, y + 6)), to(CY)])]
day = [nhom('day %d' % i, [duong([(-46, y), (14, 0)]), vien(XAM, 3.5), cat(kf([(0, 0), (12 + i * 14, 0), (34 + i * 14, 100)], (0.3, 1), (0.6, 0)))])
       for i, y in enumerate([-44, 0, 44])]
the = [nhom('d%d' % i, [duong([(28, y), (62 - i * 10, y)]), vien(XAM2, 4)]) for i, y in enumerate([-12, 0, 12])]
the += [nhom('nhan', [chunhat(30, 8, 3, (45, -24)), to(AM)]), nhom('the', [chunhat(54, 70, 7, (45, 0)), to(NEN), vien(XAM, 4.5)])]
dau = lop('tich', 0, tich_tron(28, 84), OP, p=(172, 62), s=hien(80))
gan_cd = tep('gan-cong-doan', OP, danh_so([dau, lop('the', 0, the, OP, p=(100, 100)), lop('nguoi', 0, nguoi, OP, p=(100, 100)),
                                          lop('day', 0, day, OP, p=(100, 100))]))

# ---------- 6. Thanh lý máy: máy hạ vào hộp lưu trữ, mũi tên vòng "khôi phục được" (1 lần, 120 khung) ----------
OP = 120
may = [nhom('banh rang', [elip(16, p=(-10, -2)), vien(XAM, 4)]), nhom('vach', [duong([(8, -8), (18, -8)]), duong([(8, 4), (18, 4)]), vien(XAM, 4)]),
       nhom('than', [chunhat(58, 40, 6), to(KHAY), vien(XAM, 4.5)])]
may_l = lop('may', 0, may, OP, p=kf([(0, [100, 54, 0]), (16, [100, 54, 0]), (56, [100, 146, 0])], (0.4, 0.6), (0.6, 0.2)))
hop_truoc = lop('hop truoc', 0, [nhom('nhan', [chunhat(30, 8, 3, (0, 4)), to(XAM2)]), nhom('mat', [chunhat(108, 44, 6), to(NEN), vien(XAM, 5)])], OP, p=(100, 150))
nap = lop('nap', 0, [nhom('nap', [chunhat(118, 10, 4, (59, 0)), to(XAM)])], OP, p=(41, 125),
          r=kf([(0, -100), (56, -100), (70, 0)], (0.3, 1), (0.6, 0)))
vong = lop('khoi phuc', 0, [nhom('cung', [elip(34), vien(CY, 5), cat(tinh(80), tinh(0), tinh(20))]),
                            nhom('dau', [duong([(4, -24), (11, -16), (2, -11)]), vien(CY, 5)])], OP, p=(160, 52), s=hien(78), r=kf([(0, -60), (78, -60), (100, 0)]))
thanh_ly = tep('thanh-ly-may', OP, danh_so([vong, nap, hop_truoc, may_l]))

for ten_tep, d in [('chot-ca', chot_ca), ('de-xuat-dinh-muc', de_xuat), ('mien-tru', mien_tru),
                   ('cap-lai-mat-khau', cap_lai), ('gan-cong-doan', gan_cd), ('thanh-ly-may', thanh_ly)]:
    with open(os.path.join(RA, ten_tep + '.json'), 'w', encoding='utf-8') as f:
        json.dump(d, f, ensure_ascii=False, separators=(',', ':'))
    print(ten_tep, os.path.getsize(os.path.join(RA, ten_tep + '.json')), 'byte')
