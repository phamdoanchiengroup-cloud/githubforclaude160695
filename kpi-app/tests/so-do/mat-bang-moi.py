# -*- coding: utf-8 -*-
"""Sửa cấu trúc phòng trong so-do/nha-may-3d.html theo mặt bằng bố trí máy tầng 1–3 chủ dự án gửi lại (10/10).
   Toạ độ đo trên bản PDF (lưới trục X1–X6 × Y1–Y5, 1 m = 11,088 pt, gốc tại trục X1/Y1); diện tích + số người lấy đúng chữ ghi
   trên bản vẽ. Theo yêu cầu: "Bộ phận may" và "Tập kết sản phẩm tạm" (tầng 3) thành kho, "Máy CNC thùng chạy ren" thành Phòng QC.
   Chạy một lần: python3 tests/so-do/mat-bang-moi.py (đã chạy thì DATA mới nằm sẵn trong nha-may-3d.html)."""
import io, os, re, json
import re as _re
P = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'so-do', 'nha-may-3d.html')
s = io.open(P, encoding='utf-8').read()
m = re.search(r'const DATA = (\[.*?\])\n;', s, re.S)
D = json.loads(m.group(1))

def ph(n, c, r, a=None, p=None, w=1, pn=None):
    o = {'n': n, 'a': a, 'p': p, 'c': c, 'w': w, 'r': r}
    if pn: o['pn'] = pn
    return o
def giu(fi, ten, **sua):   # giữ phòng cũ (lấy phòng đầu tiên trùng tên), sửa vài trường
    R = dict(next(x for x in D[fi]['rooms'] if x['n'] == ten)); R.update(sua); return R

# ---------- Tầng 1 (BTM-01) ----------
D[0]['rooms'] = [
    giu(0, 'Thang máy & phòng kỹ thuật'),
    giu(0, 'WC-01', a=21.8),
    ph('Thang bộ T-03', 'thang', [[0.0, 0.15, 4.33, 5.4]]),
    ph('Phòng nén khí', 'ky', [[4.43, 0.15, 6.5, 4.7]]),
    ph('Thang bộ T-02', 'thang', [[41.68, 16.97, 44.92, 25.9]]),
    ph('P. kỹ thuật', 'ky', [[41.68, 25.9, 44.92, 27.25]]),
    # RYM 1–4: phòng có vách kính + vách panel phía trên
    ph('Khu chuốt', 'sx', [[0.0, 20.9, 7.2, 25.0]]),
    # sảnh nướng mở, nối thẳng xuống hành lang qua cửa SD4
    ph('Nướng + rút khuôn', 'sx', [[0.0, 25.0, 17.8, 34.25], [7.2, 23.45, 17.8, 25.0], [7.2, 16.97, 11.3, 23.45]], a=212, p=10, w=0),
    ph('ISO phôi CB', 'sx', [[11.3, 16.97, 17.8, 23.45]], p=4),
    ph('Cuốn', 'sx', [[17.8, 16.97, 29.14, 34.25]], a=194.2, p=5),
    ph('Cắt', 'sx', [[29.14, 20.08, 35.97, 34.25]], a=94.9, p=3),
    ph('P. quản lý', 'vp', [[29.14, 16.97, 35.97, 20.08]], a=20, p=1),
    giu(0, 'Kho lạnh', a=112.8),
    giu(0, 'Hành lang TN', a=38),
    ph('Hành lang SX', 'hl', [[6.5, 13.6, 41.68, 16.97], [0.0, 12.09, 6.5, 17.07], [4.43, 4.7, 6.5, 12.09]], a=150, w=0),
    ph('P. khuôn', 'sx', [[6.5, 8.4, 17.8, 13.6]], a=55, p=3),
    ph('Khu đổ foam', 'sx', [[6.5, 4.2, 17.8, 8.4], [11.5, 0.15, 17.8, 4.2]], a=99.3, p=4, w=0),
    ph('Khu đúc keo', 'sx', [[6.5, 0.15, 11.5, 4.2]], w=0),
    ph('Khu vực phôi thô', 'sx', [[17.8, 0.15, 38.6, 13.6], [38.6, 0.15, 42.3, 9.0]], a=315.3, p=14),
    ph('P. quản lý', 'vp', [[38.6, 9.0, 42.3, 13.6]], a=17.1, p=1),
]
D[0]['xw'] = [[7.2, 16.97, 11.3, 16.97],   # tường hành lang trước sảnh nướng (cửa SD4)
              [6.5, 4.7, 6.5, 8.4]]        # vách trái khu đổ foam

# ---------- Tầng 2 (BTM-02): vách khớp bản vẽ, chỉ cập nhật diện tích / số người ----------
SO2 = {'Đánh ráp, đánh bóng': (149, 10), 'Bọc da': (47.9, 4), 'Bôi keo': (14.5, 2), 'ISO': (122, 7), 'Khu vực in UV': (230, 14),
       'P. cắt mặt': (47.7, 5), 'Khu vực hoàn thiện': (49.2, 2), 'Hành lang SX': (148.4, None), 'Hành lang TH': (16.2, None),
       'Khu chờ khô bán thành phẩm': (44, 4), 'Quản lý': (13, 1), 'P. kiểm tra chuẩn bị': (63, 5), 'P. ráp tuốt lót': (99, 7),
       'Buồng sấy': (38.3, 1), 'WC-02': (21.8, None), 'Khu hoàn thiện (buồng sơn kín 1–5)': (None, 8)}
for R in D[1]['rooms']:
    if R['n'] in SO2: R['a'], R['p'] = SO2[R['n']]
    # phòng quản lý phía dưới hành lang thuộc bộ phận Sơn (11/10: "toàn bộ phía dưới hành lang là BP Sơn")
    if R['n'] in ('Quản lý', 'P. quản lý', 'P. quản lý BP Sơn') and R['r'][0][1] < 13.7: R['n'], R['a'], R['p'] = 'P. quản lý BP Sơn', 13, 1
    elif R['n'] == 'P. quản lý': R['a'], R['p'] = (15.4, 1) if R['r'][0][0] < 20 else (18.9, 1)

# ---------- Tầng 3 (BTM-03) ----------
D[2]['rooms'] = [
    giu(2, 'Thang máy & phòng kỹ thuật'),
    giu(2, 'WC-03', a=21.8),
    giu(2, 'Thang bộ T-03'),
    giu(2, 'Thang bộ T-02'),
    ph('Khu làm đầu', 'sx', [[0.0, 25.7, 12.0, 34.25]], w=0),
    ph('Khu vực ngọn', 'sx', [[12.0, 25.7, 22.45, 34.25], [14.6, 16.97, 22.45, 25.7], [12.0, 22.7, 14.6, 25.7]], a=256, p=19, w=0),
    ph('Kho (khu tập kết)', 'kho', [[0.0, 20.81, 12.0, 25.7], [7.15, 16.97, 12.0, 20.81]], a=79.75),
    ph('P. quản lý', 'vp', [[12.0, 16.97, 14.6, 22.7]], a=15, p=1),
    ph('Đóng gói', 'sx', [[22.45, 28.2, 26.99, 34.25]], a=25.8, p=3),
    ph('P. quản lý', 'vp', [[26.99, 28.2, 30.9, 34.25]], a=20.8, p=2),
    ph('P. kỹ thuật làm phôi', 'sx', [[30.9, 28.2, 44.81, 34.25]], a=78, p=4),
    ph('Khu vực CNC', 'sx', [[22.45, 25.73, 41.68, 28.2], [22.45, 22.92, 33.7, 25.73], [30.9, 16.97, 33.7, 22.92]], a=80, p=6, w=0),
    ph('P. máy CNC 2', 'sx', [[22.45, 16.97, 30.9, 22.92]], a=64, p=8),
    ph('P. máy tiện', 'sx', [[33.7, 23.1, 41.68, 25.73]], a=21, p=2),
    ph('P. máy CNC 1', 'sx', [[33.7, 16.97, 41.68, 23.1]], a=50, p=6),
    ph('Hành lang', 'hl', [[6.2, 13.3, 44.92, 16.97], [0.0, 12.09, 6.2, 16.97], [4.33, 3.85, 6.2, 12.09]], a=160, w=0),
    ph('Bộ phận đóng gói', 'sx', [[6.2, 0.15, 30.0, 8.65], [6.2, 8.65, 26.3, 13.3], [4.33, 0.15, 6.2, 3.85]], a=292.6),
    ph('P. máy MT', 'sx', [[26.3, 8.65, 30.0, 13.3]]),
    ph('Phòng QC', 'vp', [[30.0, 5.1, 38.0, 13.3]], a=61.6),
    ph('Bàn cắt', 'sx', [[30.0, 2.2, 38.0, 5.1]], a=21),
    ph('Hoàn thiện', 'sx', [[30.0, 0.15, 38.0, 2.2]], a=21, w=0),
    ph('Kho (khu bộ phận may)', 'kho', [[38.0, 0.15, 44.92, 11.0], [38.0, 11.0, 40.4, 13.3]], a=85.9),
    ph('Phòng kỹ thuật', 'ky', [[40.4, 11.0, 44.92, 13.3]], a=9),
]
# Cuốn – Cắt thông nhau (không có vách); tường bao do xw vẽ
for R in D[0]['rooms']:
    if R['n'] in ('Cuốn', 'Cắt'): R['w'] = 0
    if R['n'] == 'Thang bộ T-03': R['r'] = [[0.0, 0.15, 4.33, 6.1]]
D[0]['xw'] += [[17.8, 16.97, 17.8, 34.25], [17.8, 16.97, 29.14, 16.97]]
for R in D[2]['rooms']:
    if R['n'] == 'Thang bộ T-03': R['r'] = [[0.0, 0.15, 4.33, 5.9]]

# ---------- Cửa (đo trên bản vẽ: [x, y, h/v, rộng, loại D/S/F/E]) ----------
D[0]['doors'] = [
    [17.8, 24.5, 'v', 1.9, 'D'], [14.5, 23.45, 'h', 1.9, 'D'], [7.2, 22.9, 'v', 1.9, 'D'], [10.2, 16.97, 'h', 1.9, 'S'],
    [7.15, 18.11, 'v', 0.9, 'F'], [29.14, 18.49, 'v', 1.0, 'D'], [36.14, 31.72, 'v', 1.9, 'F'], [43.56, 27.25, 'h', 0.9, 'F'],
    [43.5, 34.25, 'h', 1.0, 'E'], [19.42, 16.97, 'h', 1.9, 'S'], [16.3, 13.6, 'h', 1.9, 'S'], [4.43, 10.43, 'v', 0.9, 'D'],
    [4.43, 7.31, 'v', 0.9, 'D'], [-0.1, 12.65, 'v', 1.0, 'E'], [-0.1, 5.59, 'v', 1.0, 'E'], [4.33, 5.3, 'v', 1.0, 'F'],
    [17.8, 6.6, 'v', 1.9, 'D'], [27.0, 13.6, 'h', 1.9, 'S'], [37.6, 13.6, 'h', 1.9, 'S'], [39.2, 9.0, 'h', 1.1, 'D'],
    [34.72, 0.0, 'h', 1.0, 'E'], [43.5, 0.0, 'h', 1.0, 'E'], [41.84, 14.54, 'v', 1.0, 'F'], [5.5, 4.7, 'h', 1.6, 'D']]
D[2]['doors'] = [
    [10.53, 16.97, 'h', 1.9, 'S'], [13.0, 22.7, 'h', 1.1, 'D'], [7.15, 18.11, 'v', 0.9, 'F'], [26.3, 28.2, 'h', 0.9, 'D'],
    [27.72, 28.2, 'h', 0.9, 'D'], [31.9, 28.2, 'h', 1.9, 'D'], [23.55, 22.92, 'h', 1.9, 'D'], [33.7, 24.6, 'v', 1.9, 'D'],
    [32.17, 16.97, 'h', 1.9, 'S'], [43.56, 27.25, 'h', 0.9, 'F'], [42.56, 16.97, 'h', 1.0, 'F'], [16.18, 16.97, 'h', 1.9, 'S'],
    [11.1, 13.3, 'h', 1.9, 'S'], [25.3, 13.3, 'h', 1.9, 'S'], [34.05, 13.3, 'h', 1.9, 'S'], [39.2, 13.3, 'h', 1.9, 'S'],
    [4.43, 10.43, 'v', 0.9, 'D'], [4.43, 7.31, 'v', 0.9, 'D'], [4.33, 5.0, 'v', 1.0, 'F'], [26.3, 9.2, 'v', 1.1, 'D'],
    [38.0, 3.8, 'v', 1.9, 'D'], [40.4, 12.2, 'v', 1.0, 'D'], [8.65, 25.7, 'h', 0.9, 'D']]

# ---------- Máy tầng 1: dời cột bàn 3–4 và máy khoan C về đúng vị trí bản vẽ; thêm máy khu chuốt / nướng / cuốn / cắt ----------
COT = {'N1': 30.47, 'T1': 30.47, 'T17': 30.47, 'T19': 30.47, 'T3': 30.47, 'T5': 30.47,
       'N2': 34.27, 'T2': 34.27, 'T18': 34.27, 'T20': 34.27, 'T4': 34.27, 'T6': 34.27,
       'C1': 36.82, 'C4': 36.82, 'C2': 39.2, 'C5': 39.2, 'C3': 41.68, 'C6': 41.68}
for M in D[0]['mc']:
    if M['l'] in COT:
        r = M['r']; w = abs(r[2] - r[0]); x0 = round(COT[M['l']] - w / 2, 2); M['r'] = [x0, r[1], round(x0 + w, 2), r[3]]
D[0]['mc'] = [M for M in D[0]['mc'] if M.get('src') != 'mb10']
def may(l, x0, y0, x1, y1, h, t='tb', note=None):
    o = {'l': l, 't': t, 'r': [x0, y0, x1, y1], 'h': h, 'src': 'mb10'}
    if note: o['note'] = note
    return o
SK = []
for i, (ya, yb) in enumerate(((31.2, 33.55), (28.38, 30.72), (25.55, 27.9), (22.74, 25.07))):
    SK += [may('SKTG50-B', 21.41, ya, 23.55, yb, 1.4), may('SKTG50-B', 23.62, ya, 25.76, yb, 1.4)]
D[0]['mc'] += [
    may('RYM 10', 1.92, 32.57, 2.83, 34.07, 1.2), may('RYM 9', 0.05, 31.19, 1.55, 32.12, 1.2),
    may('RYM 9', 1.19, 29.26, 2.71, 30.2, 1.2), may('RYM 10', 2.71, 29.26, 4.21, 30.2, 1.2),
    may('RYM 7', 1.19, 27.35, 2.71, 28.27, 1.2), may('RYM 8', 2.71, 27.35, 4.21, 28.27, 1.2),
    may('RYM 3', 1.19, 23.52, 2.71, 24.45, 1.2), may('RYM 4', 2.71, 23.52, 4.21, 24.45, 1.2),
    may('RYM 1', 1.19, 21.61, 2.71, 22.54, 1.2), may('RYM 2', 2.71, 21.61, 4.21, 22.54, 1.2),
    may('TQD-50A', 3.68, 32.17, 6.06, 34.07, 1.5), may('TQD-50A', 6.14, 32.17, 8.57, 34.07, 1.5),
    may('RT2', 9.92, 32.45, 13.76, 33.47, 0.9), may('RT1', 9.92, 28.74, 13.76, 29.77, 0.9),
    may('TD-4-15', 11.07, 30.53, 12.62, 31.64, 1.0), may('TD-4-15', 10.47, 25.2, 11.59, 26.75, 1.0),
    may('GH-2', 15.77, 31.44, 17.64, 34.07, 1.2), may('GH-2', 15.77, 28.47, 17.64, 31.1, 1.2),
    may('TWC-36-B', 19.05, 29.4, 20.38, 33.02, 1.0), may('TWC-36-B', 27.88, 29.67, 29.2, 33.31, 1.0),
    may('TWC-36-B', 27.88, 24.98, 29.2, 28.63, 1.0),
    may('DZC1200-B', 31.98, 31.49, 33.74, 33.61, 1.2), may('CB-X1', 31.07, 28.44, 34.2, 29.79, 0.9),
    may('CB-X2', 31.07, 23.41, 34.2, 24.77, 0.9)] + SK

# ---------- Phòng đóng gói tầng 3: theo ảnh chụp thực tế (11/10) ----------
for R in D[2]['rooms']:
    if R['n'] == 'Bộ phận đóng gói': R['san'] = 'trang'   # sàn epoxy trắng bóng
D[2]['mc'] = [M for M in D[2]['mc'] if M.get('src') != 'mb10']
K = [(5.64, 7.7), (7.7, 9.75), (9.75, 11.79), (11.79, 13.84), (13.84, 15.89), (15.89, 17.9), (17.9, 19.94), (19.94, 21.99), (21.99, 23.98), (23.98, 26.05)]
DG = [may('K%d' % (i + 1), a, 0.2, b - 0.05, 1.15, 2.0, 'ke', 'Kệ hàng đóng gói') for i, (a, b) in enumerate(K)]
DG += [may('K11', 7.43, 12.3, 9.46, 13.2, 2.0, 'ke', 'Kệ hàng đóng gói'),
       may('Kh3', 6.4, 7.97, 7.2, 9.5, 2.0, 'ke', 'Kệ hàng'), may('Kh2', 6.4, 5.94, 7.2, 7.48, 2.0, 'ke', 'Kệ hàng'), may('Kh1', 6.4, 3.9, 7.2, 5.45, 2.0, 'ke', 'Kệ hàng'),
       may('SEAL', 6.45, 10.0, 7.17, 11.53, 1.3, 'seal', 'Máy co màng / hàn miệng túi'),
       may('MT', 8.92, 7.25, 9.55, 8.53, 0.75)]
for (a, b) in ((13.14, 14.69), (16.04, 17.59), (18.96, 20.5), (21.86, 23.41)):
    DG.append(may('Lz%d' % (len([m for m in DG if m['l'].startswith('Lz')]) + 1), a, 12.4, b, 13.06, 0.75, 'laser', 'Bàn khắc laser'))
for (ya, yb) in ((8.41, 9.46), (5.78, 6.83), (3.24, 4.27)):
    for (xa, xb) in ((14.47, 16.02), (17.0, 18.56), (19.54, 21.1), (22.09, 23.65)):
        DG.append(may('VSĐG', xa, ya, xb, yb, 0.85, 'bandg', 'Bàn đóng gói (khung đèn LED)'))
DG += [may('MT', 27.56, 11.8, 28.83, 12.43, 0.75), may('MT', 27.52, 10.55, 28.14, 11.73, 0.75), may('MT', 28.24, 10.55, 28.87, 11.73, 0.75),
       may('Tủ chữa cháy', 24.55, 6.0, 24.95, 6.25, 1.6, 'pccc')]
D[2]['mc'] += DG
# vạch băng keo vàng đen: viền khu bàn đóng gói + lối đi trước dãy kệ và dọc khu đóng đơn lẻ
D[2]['bang'] = [[13.7, 2.5, 24.4, 2.5], [24.4, 2.5, 24.4, 10.2], [24.4, 10.2, 13.7, 10.2], [13.7, 10.2, 13.7, 2.5],
                [7.6, 1.75, 26.2, 1.75], [25.3, 1.75, 25.3, 8.4]]

# ---------- Phòng ngọn tầng 3 (khu vực ngọn + làm đầu): theo ảnh chụp thực tế (11/10) ----------
import re as _re
for R in D[2]['rooms']:
    if R['n'] in ('Khu vực ngọn', 'Khu làm đầu'): R['san'] = 'trang'
for M in D[2]['mc']:
    if _re.match(r'^(MT\d|D\d)$', M['l']): M['t'] = 'tienn'
    elif _re.match(r'^M\d$', M['l']): M['t'] = 'cncn'
NGON = []
for xa in (14.95, 17.25, 20.6):      # xe ống giấy giữa các dãy bàn
    for ya in (21.2, 24.2, 27.2, 30.2):
        if xa == 14.95 and ya < 23: continue   # chỗ này là phòng quản lý
        NGON.append(may('Xe ống ngọn', xa, ya, xa + 1.0, ya + 0.6, 1.0, 'xeong', 'Xe đẩy ống giấy cắm ngọn cơ'))
for xc in (1.25, 6.1, 11.14):         # khu làm đầu
    NGON.append(may('Xe ống ngọn', xc - 0.5, 30.9, xc + 0.5, 31.5, 1.0, 'xeong', 'Xe đẩy ống giấy cắm ngọn cơ'))
for (xa, ya) in ((12.4, 31.6), (13.15, 31.6), (12.4, 32.25)):
    NGON.append(may('Sọt nhựa', xa, ya, xa + 0.6, ya + 0.4, 0.32, 'sot'))
D[2]['mc'] += NGON
D[2]['bang'] += [[14.75, 20.6, 21.75, 20.6], [21.75, 20.6, 21.75, 32.6], [21.75, 32.6, 14.75, 32.6], [14.75, 32.6, 14.75, 20.6],
                 [0.3, 27.9, 12.6, 27.9]]

# ---------- Khu phôi thô tầng 1 (sảnh phôi thô, P. khuôn, khu đổ foam, đúc keo): theo ảnh chụp thực tế (11/10) ----------
SAN1 = {'Khu vực phôi thô': 'trang', 'P. khuôn': 'trang', 'Khu đúc keo': 'trang', 'Khu đổ foam': 'xam'}
for R in D[0]['rooms']:
    if R['n'] in SAN1: R['san'] = SAN1[R['n']]
for M in D[0]['mc']:
    if _re.match(r'^(T\d+|N\d)$', M['l']): M['t'] = 'tienl'
    if M['l'] == 'F2' and M['r'][1] > 2: M['l'] = 'F3'
PT = []
for xa in (22.2, 31.85):                       # xe ống giấy giữa hai cột máy tiện
    for ya in (2.0, 5.0, 8.0, 11.0):
        PT.append(may('Xe ống phôi', xa, ya, xa + 1.0, ya + 0.6, 1.0, 'xeong', 'Xe đẩy ống giấy cắm phôi'))
for ya in (3.4, 9.6):                          # lối giữa
    PT.append(may('Xe ống phôi', 26.4, ya, 27.4, ya + 0.6, 1.0, 'xeong', 'Xe đẩy ống giấy cắm phôi'))
PT += [may('Sọt nhựa', 27.9, 5.6, 28.7, 6.15, 0.45, 'sot'), may('Sọt nhựa', 27.9, 6.3, 28.7, 6.85, 0.45, 'sot'),
       may('Sọt nhựa', 36.2, 5.2, 37.0, 5.75, 0.45, 'sot'), may('Chậu cây', 27.35, 7.95, 27.85, 8.45, 1.6, 'cay')]
# P. khuôn: kệ hàng sát vách, xe ống giấy dọc vách khu foam, sọt nhựa đựng phôi ở giữa
PT += [may('Kệ khuôn', 6.6, 9.0, 7.2, 11.0, 2.0, 'ke', 'Kệ chai hóa chất + thùng'), may('Kệ khuôn', 6.6, 11.1, 7.2, 13.1, 2.0, 'ke', 'Kệ chai hóa chất + thùng'),
       may('Kệ khuôn', 8.0, 12.95, 10.0, 13.5, 2.0, 'ke', 'Kệ hàng'), may('Kệ khuôn', 10.1, 12.95, 12.1, 13.5, 2.0, 'ke', 'Kệ hàng')]
for xa in (8.2, 9.3, 10.4, 11.5, 12.6):
    PT.append(may('Xe ống phôi', xa, 8.6, xa + 1.0, 9.2, 1.0, 'xeong', 'Xe đẩy ống giấy cắm phôi'))
for (xa, ya) in ((10.4, 10.4), (11.4, 10.4), (10.4, 11.15), (13.2, 11.6)):
    PT.append(may('Sọt nhựa', xa, ya, xa + 0.85, ya + 0.6, 0.45, 'sot'))
# khu đổ foam: thùng phuy hóa chất cạnh máy rót; khu đúc keo: bàn làm việc sát cửa sổ
for (x, y, mau) in ((11.6, 0.35, 'xanh'), (13.1, 0.35, 'đỏ'), (15.2, 0.35, 'xanh'), (15.8, 1.3, 'đỏ'), (17.05, 1.7, 'xanh'), (17.05, 4.4, 'đỏ')):
    PT.append(may('Phuy ' + mau, x, y, x + 0.58, y + 0.58, 0.9, 'phuy', 'Thùng phuy hóa chất 200 lít'))
PT += [may('Bàn làm việc', 7.0, 0.4, 9.4, 1.1, 0.85, 'ban'), may('Xe ống phôi', 9.9, 2.8, 10.9, 3.4, 1.0, 'xeong', 'Xe đẩy ống giấy cắm phôi')]
D[0]['mc'] = [M for M in D[0]['mc'] if M.get('src') != 'mb11'] + [dict(M, src='mb11') for M in PT]
D[0]['bang'] = [[25.95, 0.6, 25.95, 13.2], [28.9, 0.6, 28.9, 13.2], [35.7, 0.6, 35.7, 4.7], [35.7, 4.7, 42.1, 4.7],
                [11.5, 0.3, 11.5, 4.2], [7.5, 9.4, 7.5, 12.8]]

# ---------- Khu phôi carbon tầng 1 (chuốt, nướng + rút khuôn, ISO phôi CB, cuốn, cắt): theo ảnh chụp thực tế (11/10) ----------
for R in D[0]['rooms']:
    R['san'] = {'Nướng + rút khuôn': 'gach', 'ISO phôi CB': 'gach', 'Khu chuốt': 'gach', 'Cuốn': 'trang', 'Cắt': 'trang'}.get(R['n'], R.get('san'))
    if R.get('san') is None: R.pop('san', None)
LOAI = [(r'^RYM', 'chuot'), (r'^TQD', 'mai'), (r'^TD-', 'mai'), (r'^RT\d', 'rutkhuon'), (r'^GH-', 'lo'), (r'^TWC', 'banthep'),
        (r'^DZC', 'maycat'), (r'^CB-X', 'bankinh'), (r'^SKTG', 'cuon')]
for M in D[0]['mc']:
    for mu, t in LOAI:
        if _re.match(mu, M['l']): M['t'] = t
CB = []
for (x, y) in ((13.9, 30.3), (14.6, 30.3), (9.0, 30.3), (8.3, 26.0), (13.0, 26.2), (5.2, 25.6)):     # sọt tròn đựng phôi ở khu nướng
    CB.append(may('Sọt tròn', x, y, x + 0.5, y + 0.5, 0.45, 'ro'))
for y in (18.8, 19.6, 20.4, 21.2):                                                              # lối đi: sọt xanh + kệ
    CB.append(may('Sọt nhựa', 7.4, y, 8.3, y + 0.62, 0.5, 'sot'))
CB += [may('Kệ hàng', 10.65, 18.4, 11.25, 20.4, 2.0, 'ke'), may('Kệ hàng', 10.65, 20.5, 11.25, 22.5, 2.0, 'ke'),
       # ISO phôi CB: kệ sát vách, bàn mặt kính, sọt tròn
       may('Kệ ISO', 17.1, 17.5, 17.7, 19.5, 2.0, 'ke'), may('Kệ ISO', 17.1, 19.6, 17.7, 21.6, 2.0, 'ke'),
       may('Bàn ISO', 11.8, 18.6, 13.9, 19.6, 0.85, 'bankinh'), may('Bàn ISO', 11.8, 20.6, 13.9, 21.6, 0.85, 'bankinh'), may('Bàn ISO', 14.6, 18.6, 16.4, 19.6, 0.85, 'bankinh'),
       may('Sọt tròn', 14.7, 21.0, 15.2, 21.5, 0.45, 'ro'), may('Sọt tròn', 15.5, 21.0, 16.0, 21.5, 0.45, 'ro'),
       # cắt: bàn gỗ ép + kệ cuối phòng
       may('Bàn gỗ', 33.6, 25.0, 35.0, 28.0, 0.85, 'banthep'), may('Kệ hàng', 29.4, 33.6, 31.4, 34.2, 2.0, 'ke')]
D[0]['mc'] = [M for M in D[0]['mc'] if M.get('src') != 'mb12'] + [dict(M, src='mb12') for M in CB]
D[0]['bang'] += [[20.8, 17.4, 20.8, 33.8], [26.45, 17.4, 26.45, 33.8], [30.7, 23.0, 34.6, 23.0], [34.6, 23.0, 34.6, 30.2], [34.6, 30.2, 30.7, 30.2], [30.7, 30.2, 30.7, 23.0]]

# ---------- Tầng 2: phòng In UV + bộ phận Sơn – theo ảnh chụp thực tế (11/10) ----------
SAN2 = ('Khu vực in UV', 'Khu vực hoàn thiện', 'Khu chờ khô bán thành phẩm', 'P. quản lý BP Sơn', 'P. kiểm tra chuẩn bị', 'P. ráp tuốt lót',
        'Buồng sấy', 'Khu hoàn thiện (buồng sơn kín 1–5)', 'Khu sơn tĩnh điện (vách tấm panel)')
for R in D[1]['rooms']:
    if R['n'] in SAN2: R['san'] = 'trang'
for M in D[1]['mc']:
    cy = (M['r'][1] + M['r'][3]) / 2
    if M['l'] == 'MT1' and cy > 23.2: M['t'] = 'tuuv'          # tủ cao cạnh máy in UV
    if _re.match(r'^BS\d', M['l']): M['t'] = 'bantien'
    if M['l'].startswith('STĐ'): M['t'] = 'phunson'
U = []
def xj(x, y, mau=''):
    U.append(may('Xe jig' + (' trắng' if mau else ''), x, y, x + 1.0, y + 0.6, 1.15, 'xejig', 'Xe jig treo cơ'))
# In UV: bàn máy tính trước máy in, xe jig dọc 2 lối đi
for x in (23.2, 29.0, 34.2, 39.6):
    U.append(may('MT', x, 24.6, x + 1.2, 25.1, 0.75))
for x in (29.4, 37.2):
    U.append(may('MT', x, 32.2, x + 1.2, 32.7, 0.75))
for x in (22.8, 28.5, 31.0, 33.6, 39.0): xj(x, 25.6)
for x in (23.6, 28.6, 36.0, 42.6): xj(x, 30.9)
# Khu vực hoàn thiện (cạnh phòng UV): bãi xe jig + kệ + bàn gỗ
for x in (31.0, 32.1, 33.2, 34.3):
    for y in (18.4, 19.1, 19.8): xj(x, y)
U += [may('Kệ hàng', 34.0, 22.5, 36.0, 23.05, 2.0, 'ke'), may('Kệ hàng', 37.9, 17.4, 38.45, 19.4, 2.0, 'ke'), may('Bàn gỗ', 30.5, 21.8, 32.3, 22.8, 0.85, 'banthep')]
# Sơn – khu chờ khô: xe jig cơ đã sơn trắng
for x in (8.7, 9.8, 10.85):
    for y in (7.4, 8.2, 9.0, 9.8): xj(x, y, 'trắng')
# Sơn – P. kiểm tra chuẩn bị: thùng carton, sọt, xe jig sát vách
for (x, y) in ((17.5, 9.5), (18.5, 9.5), (17.5, 10.3), (20.3, 9.8), (21.3, 9.8)):
    U.append(may('Thùng carton', x, y, x + 0.85, y + 0.55, 0.35, 'thung'))
U += [may('Sọt tròn', 19.6, 11.2, 20.1, 11.7, 0.45, 'ro'), may('Sọt tròn', 22.4, 11.0, 22.9, 11.5, 0.45, 'ro')]
for y in (9.0, 9.8, 10.6): xj(15.1, y, 'trắng')
# Sơn – P. quản lý BP Sơn: bàn họp
U.append(may('Bàn họp', 12.4, 8.8, 13.9, 9.7, 0.75, 'ban'))
# Sơn – trước buồng sơn kín và máy phun sơn: xe jig
for x in (7.5, 11.6, 15.7, 19.8, 23.9): xj(x, 3.4, 'trắng')
for x in (28.5, 32.6, 36.7, 40.8): xj(x, 3.9, 'trắng')
U.append(may('Bàn pha sơn', 42.6, 4.6, 44.4, 5.4, 0.85, 'banthep'))
D[1]['mc'] = [M for M in D[1]['mc'] if M.get('src') != 'mb13'] + [dict(M, src='mb13') for M in U]
D[1]['bang'] = [[22.6, 26.4, 41.5, 26.4], [22.6, 30.6, 44.5, 30.6], [30.8, 18.2, 35.5, 18.2], [35.5, 18.2, 35.5, 20.6], [35.5, 20.6, 30.8, 20.6], [30.8, 20.6, 30.8, 18.2],
                [8.55, 7.25, 11.75, 7.25], [11.75, 7.25, 11.75, 10.55], [11.75, 10.55, 8.55, 10.55], [8.55, 10.55, 8.55, 7.25],
                [17.2, 9.2, 22.6, 9.2], [22.6, 9.2, 22.6, 11.9], [22.6, 11.9, 17.2, 11.9], [17.2, 11.9, 17.2, 9.2],
                [4.6, 5.3, 26.8, 5.3], [27.3, 5.3, 44.4, 5.3]]

moi = json.dumps(D, ensure_ascii=False, separators=(',', ':'))
s = s[:m.start(1)] + moi + s[m.end(1):]
io.open(P, 'w', encoding='utf-8').write(s)
print('OK', [len(F['rooms']) for F in D])
