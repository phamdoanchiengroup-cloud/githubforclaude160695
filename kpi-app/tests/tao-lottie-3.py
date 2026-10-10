# -*- coding: utf-8 -*-
"""Đợt 3: 6 hoạt ảnh Lottie cho các phần khác của web KPI, ghi vào kpi-app/lottie/.
   python3 kpi-app/tests/tao-lottie-3.py
   tra-lai · may-bao-tri · ghi-vi-pham · nghi-dai-han · them-nhan-su · doi-mat-khau"""
import json, math, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); sys.dont_write_bytecode = True
from lottie_cu import *

RA = os.path.join(os.path.dirname(__file__), '..', 'lottie')
NEN, KHAY, TOI = mau('#21262b'), mau('#2a3036'), mau('#06201e')

def hien(b, dai=14, s1=100, vuot=112):
    return kf([(0, [0, 0]), (b, [0, 0]), (b + dai * .7, [vuot, vuot]), (b + dai, [s1, s1])], (0.3, 1), (0.6, 0))
def mo(b, dai=8): return kf([(0, 0), (b, 0), (b + dai, 100)])
def quai(w, h):
    k = w * 0.55
    return {'ty': 'sh', 'ks': tinh({'v': [[-w, 0], [-w, -h + w], [0, -h], [w, -h + w], [w, 0]],
                                    'i': [[0, 0], [0, 0], [-k, 0], [0, -k], [0, 0]], 'o': [[0, 0], [0, -k], [k, 0], [0, 0], [0, 0]], 'c': False})}
def lop_ind(ds):
    for i, l in enumerate(ds): l['ind'] = i + 1
    return ds

# ---------- 1. Trả lại sản lượng (từ chối): phiếu bật ra khỏi khay, dấu ✕, mũi tên trả về (1 lần, 110 khung) ----------
OP = 110
phieu = [nhom('d%d' % i, [duong([(-16, y), (16 - i * 8, y)]), vien(XAM, 4)]) for i, y in enumerate([-16, -4, 8])]
phieu.append(nhom('to', [chunhat(54, 66, 6), to(NEN), vien(XAM, 4.5)]))
phieu_l = lop('phieu', 0, phieu, OP, p=kf([(0, [100, 108, 0]), (28, [92, 54, 0])], (0.3, 1), (0.6, 0)), r=kf([(0, 0), (28, -8)], (0.3, 1), (0.6, 0)))
x_l = lop('dau x', 0, [nhom('x', [duong([(-7, -7), (7, 7)]), duong([(7, -7), (-7, 7)]), vien(mau('#ffffff'), 4.5)]),
                       nhom('tron', [elip(34), to(DO)])], OP, p=(134, 36), s=hien(26))
ten_l = lop('mui ten', 0, [nhom('than', [duong([(36, 0), (-34, 0)]), vien(AM, 5), cat(kf([(0, 0), (40, 0), (64, 100)], (0.3, 1), (0.6, 0)))]),
                           nhom('dau', [duong([(-24, -9), (-35, 0), (-24, 9)]), vien(AM, 5)], o=mo(62, 4))], OP, p=(100, 184))
truoc = lop('khay truoc', 0, [nhom('mieng', [chunhat(104, 30, 6), to(KHAY)]), nhom('vien', [duong([(-52, -15), (52, -15)]), vien(XAM, 5)])], OP, p=(100, 146))
sau = lop('khay sau', 0, [nhom('sau', [duong([(-52, -22), (-52, 15), (52, 15), (52, -22)]), vien(XAM, 5)])], OP, p=(100, 146))
tra_lai = tep('tra-lai', OP, lop_ind([x_l, truoc, phieu_l, sau, ten_l]))

# ---------- 2. Máy đang sửa: bánh răng quay, cờ lê lắc (lặp 180 khung) ----------
OP = 180
def banh_rang(r, rang, w):
    it = [nhom('lo', [elip(r * 0.7), to(NEN)])]
    for k in range(rang):
        it.append(nhom('rang %d' % k, [chunhat(w, w * 1.1, 2, (0, -r)), to(XAM)], r=360 / rang * k))
    it.append(nhom('than', [elip(r * 2), to(XAM)]))
    return it
br1 = lop('banh rang lon', 0, banh_rang(36, 9, 14), OP, p=(84, 112), r=kf([(0, 0), (180, 120)], (0.5, 0.5), (0.5, 0.5)))
br2 = lop('banh rang nho', 0, banh_rang(20, 7, 11), OP, p=(142, 70), r=kf([(0, 0), (180, -360 / 7 * 4)], (0.5, 0.5), (0.5, 0.5)))
for g in br2['shapes']:
    for it in g['it']:
        if it.get('ty') == 'fl' and it['c']['k'] == XAM: it['c'] = tinh(CY)
co_le = lop('co le', 0, [nhom('can', [duong([(0, 0), (0, 54)]), vien(AM, 10)]),
                         nhom('dau', [elip(24), vien(AM, 8), cat(tinh(78), tinh(0), tinh(-40))], p=(0, -8))], OP, p=(58, 54),
            r=kf([(0, -38), (45, -22), (90, -38), (135, -22), (180, -38)], (0.45, 1), (0.55, 0)))
may_bao_tri = tep('may-bao-tri', OP, lop_ind([co_le, br2, br1]))

# ---------- 3. Ghi vi phạm nề nếp: bút ghi một dòng vào sổ, dấu trừ điểm (1 lần, 120 khung) ----------
OP = 120
so = [nhom('dong %d' % i, [duong([(-28, y), (32 - i * 10, y)]), vien(XAM2, 5)]) for i, y in enumerate([-38, -22, -6])]
so += [nhom('gay', [duong([(-38, -58), (-38, 58)]), vien(XAM, 4)]), nhom('bia', [chunhat(96, 116, 8), to(NEN), vien(XAM, 5)])]
moi = nhom('dong moi', [duong([(-28, 12), (30, 12)]), vien(AM, 5), cat(kf([(0, 0), (18, 0), (50, 100)], (0.4, 0.4), (0.6, 0.6)))])
but = lop('but', 0, [nhom('ngoi', [duong([(0, 0), (0, -38)]), vien(CY, 8)]), nhom('dau', [duong([(-4, -6), (0, 2), (4, -6)], True), to(XAM)])], OP,
          p=kf([(0, [72, 112, 0]), (18, [72, 112, 0]), (50, [130, 112, 0]), (62, [140, 90, 0])], (0.4, 0.4), (0.6, 0.6)), r=tinh(28),
          o=kf([(0, 0), (10, 100), (60, 100), (70, 0)]))
tru = lop('tru diem', 0, [nhom('gach', [duong([(-8, 0), (8, 0)]), vien(TOI, 5)]), nhom('tron', [elip(32), to(AM)])], OP, p=(148, 48), s=hien(58))
ghi_vi_pham = tep('ghi-vi-pham', OP, lop_ind([but, tru, lop('so', 0, [moi] + so, OP, p=(96, 100))]))

# ---------- 4. Nghỉ dài hạn / lịch tháng: dải ngày nghỉ tô dần trên lịch (1 lần, 110 khung) ----------
OP = 110
lich = []
X0, Y0, B = -42, -10, 14
dai = [(1, 1, 6, 18), (2, 0, 3, 50)]   # (hàng, cột đầu, cột cuối, khung bắt đầu)
for h, c0, c1, b in dai:
    x0, x1 = X0 + c0 * B - 6, X0 + c1 * B + 6
    lich.append(nhom('dai %d' % h, [chunhat(x1 - x0, 12, 6, ((x0 + x1) / 2, Y0 + h * B)), to(AM, 85)], a=(x0, Y0 + h * B), p=(x0, Y0 + h * B),
                     s=kf([(0, [0, 100]), (b, [0, 100]), (b + 28, [100, 100])], (0.3, 1), (0.6, 0))))
for h in range(4):
    for c in range(7):
        lich.append(nhom('o %d %d' % (h, c), [elip(5, p=(X0 + c * B, Y0 + h * B)), to(XAM2 if (h, c) != (0, 3) else CY)]))
lich += [nhom('vong', [duong([(-24, -52), (-24, -38)]), duong([(24, -52), (24, -38)]), vien(XAM, 5)]),
         nhom('dau lich', [chunhat(112, 20, 6, (0, -36)), to(XAM2)]),
         nhom('khung', [chunhat(112, 100, 10, (0, -4)), to(NEN), vien(XAM, 5)])]
nghi_dai_han = tep('nghi-dai-han', OP, [lop('lich', 1, lich, OP, p=(100, 104))])

# ---------- 5. Thêm nhân sự: thẻ nhân viên trượt lên, dấu + thành ✓ (1 lần, 110 khung) ----------
OP = 110
the = [nhom('dong %d' % i, [duong([(-6, y), (36 - i * 14, y)]), vien(XAM2 if i else XAM, 5)]) for i, y in enumerate([-12, 2, 16])]
the += [nhom('dau', [elip(22, p=(-34, -10)), to(CY)]), nhom('vai', [chunhat(32, 16, 8, (-34, 12)), to(CY)]),
        nhom('khung', [chunhat(124, 78, 10), to(NEN), vien(XAM, 5)])]
the_l = lop('the', 0, the, OP, p=kf([(0, [100, 140, 0]), (26, [100, 106, 0])], (0.3, 1), (0.6, 0)), o=kf([(0, 0), (12, 100)]))
cong = nhom('cong', [duong([(-8, 0), (8, 0)]), duong([(0, -8), (0, 8)]), vien(TOI, 4.5)], s=kf([(0, [100, 100]), (46, [100, 100]), (54, [0, 0])]))
tich = nhom('tich', [duong([(-8, 0), (-2, 6), (9, -6)]), vien(TOI, 4.5), cat(kf([(0, 0), (52, 0), (68, 100)]))])
huy = lop('huy hieu', 0, [cong, tich, nhom('tron', [elip(36), to(CY)])], OP, p=(156, 68), s=hien(22))
them_nhan_su = tep('them-nhan-su', OP, lop_ind([huy, the_l]))

# ---------- 6. Đổi mật khẩu: 4 chấm sáng dần, ổ khóa sập lại (1 lần, 120 khung) ----------
OP = 120
cham = [nhom('cham %d' % i, [elip(14), to(CY)], p=(-33 + i * 22, 0), s=hien(6 + i * 9, 10)) for i in range(4)]
cham += [nhom('nen %d' % i, [elip(14), to(XAM2)], p=(-33 + i * 22, 0)) for i in range(4)]
khoa = [nhom('lo', [elip(9, 9, (0, 8)), to(TOI)]), nhom('lo2', [chunhat(4, 10, 1, (0, 14)), to(TOI)]),
        nhom('than', [chunhat(60, 46, 9, (0, 12)), to(CY)]),
        nhom('quai', [quai(17, 32), vien(XAM, 8)], p=kf([(0, [0, -24]), (52, [0, -24]), (62, [0, -6]), (68, [0, -9])], (0.3, 1), (0.7, 0)))]
song = nhom('song', [elip(80), vien(CY, 3, kf([(0, 0), (64, 0), (66, 60), (96, 0)]))], p=(0, 10), s=kf([(0, [100, 100]), (64, [100, 100]), (96, [160, 160])], (0.2, 1), (0.5, 0)))
doi_mat_khau = tep('doi-mat-khau', OP, [lop('cham', 1, cham, OP, p=(100, 44)), lop('khoa', 2, khoa, OP, p=(100, 120)),
                                        lop('song', 3, [song], OP, p=(100, 120))])

for ten_tep, d in [('tra-lai', tra_lai), ('may-bao-tri', may_bao_tri), ('ghi-vi-pham', ghi_vi_pham),
                   ('nghi-dai-han', nghi_dai_han), ('them-nhan-su', them_nhan_su), ('doi-mat-khau', doi_mat_khau)]:
    with open(os.path.join(RA, ten_tep + '.json'), 'w', encoding='utf-8') as f:
        json.dump(d, f, ensure_ascii=False, separators=(',', ':'))
    print(ten_tep, os.path.getsize(os.path.join(RA, ten_tep + '.json')), 'byte')
