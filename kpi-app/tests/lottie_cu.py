# -*- coding: utf-8 -*-
"""Hàm vẽ dùng chung cho tao-lottie.py và tao-lottie-2.py (JSON chuẩn Bodymovin, khung 200×200, 60 hình/giây)."""
import math

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
