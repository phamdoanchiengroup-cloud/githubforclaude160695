# -*- coding: utf-8 -*-
"""Chèn ảnh + font thương hiệu Rhino (kpi-app/anh/rhino) dạng base64 vào mã màn đăng nhập.
   Dùng chung cho tests/dang-nhap/tao-demo-bi-a.py (bản demo) và tests/va-index.py (web thật)."""
import os, base64
GOC = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'anh', 'rhino')
RH = {'{{RH_LOGO}}': ('logo-rhino.png', 'image/png'), '{{RH_1}}': ('must-shaft.jpg', 'image/jpeg'), '{{RH_2}}': ('eclipse-2.jpg', 'image/jpeg'),
      '{{RH_3}}': ('retro-2.jpg', 'image/jpeg'), '{{RH_4}}': ('must-cue.jpg', 'image/jpeg'), '{{RH_KHAC}}': ('khac-laser.jpg', 'image/jpeg'),
      '{{RH_F_ORB}}': ('font/orbitron.woff2', 'font/woff2'), '{{RH_F_MIC}}': ('font/michroma.woff2', 'font/woff2'),
      '{{RH_F_OSW}}': ('font/oswald.woff2', 'font/woff2'), '{{RH_F_SAI}}': ('font/saira-condensed.woff2', 'font/woff2')}

def anh_rhino(s):
    for k, (f, loai) in RH.items():
        if k in s:
            s = s.replace(k, 'data:%s;base64,' % loai + base64.b64encode(open(os.path.join(GOC, f), 'rb').read()).decode())
    return s
