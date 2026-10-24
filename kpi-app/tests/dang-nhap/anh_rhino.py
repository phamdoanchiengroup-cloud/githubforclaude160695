# -*- coding: utf-8 -*-
"""Chèn ảnh + font thương hiệu Rhino (kpi-app/anh/rhino) dạng base64 vào mã màn đăng nhập.
   Dùng chung cho tests/dang-nhap/tao-demo-bi-a.py (bản demo) và tests/va-index.py (web thật)."""
import os, base64
GOC = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'anh', 'rhino')
RH = {'{{RH_LOGO}}': ('logo-rhino.png', 'image/png'), '{{RH_1}}': ('must-shaft.jpg', 'image/jpeg'), '{{RH_2}}': ('eclipse-2.jpg', 'image/jpeg'),
      '{{RH_3}}': ('retro-2.jpg', 'image/jpeg'), '{{RH_4}}': ('must-cue.jpg', 'image/jpeg'), '{{RH_KHAC}}': ('khac-laser.jpg', 'image/jpeg'),
      '{{RH_F_ORB}}': ('font/orbitron.woff2', 'font/woff2'), '{{RH_F_MIC}}': ('font/michroma.woff2', 'font/woff2'),
      '{{RH_F_OSW}}': ('font/oswald.woff2', 'font/woff2'), '{{RH_F_SAI}}': ('font/saira-condensed.woff2', 'font/woff2')}

import json
def anh_drive(ten, tuy_chon='s0-rw-l80'):
    """Đường dẫn ảnh trên Google Drive theo kpi-app/anh-drive.json ('' nếu chưa có mã file).
       tuy_chon: máy chủ ảnh Google tự thu nhỏ/nén (w1920 = rộng tối đa 1920px, s0 = giữ cỡ; rj = JPEG, rw = WebP; l80 = chất lượng 80)."""
    ma = json.load(open(os.path.join(GOC, '..', '..', 'anh-drive.json'), encoding='utf-8')).get(ten, '')
    return 'https://lh3.googleusercontent.com/d/%s=%s' % (ma, tuy_chon) if ma else ''

def anh_rhino(s):
    s = s.replace('{{NEN_DN}}', anh_drive('nen-dang-nhap', 'w1920-rj-l80'))   # ảnh gốc PNG 2,7 MB -> JPEG ~280 KB
    for k, (f, loai) in RH.items():
        if k in s:
            s = s.replace(k, 'data:%s;base64,' % loai + base64.b64encode(open(os.path.join(GOC, f), 'rb').read()).decode())
    return s
