# -*- coding: utf-8 -*-
"""Dựng kpi-app/demo-lottie.html: nhúng thư viện lottie-web (bản light, MIT) + 4 file kpi-app/lottie/*.json vào tests/demo-lottie.src.html.
   LOTTIE=/đường/dẫn/lottie_light.min.js python3 kpi-app/tests/tao-demo-lottie.py
   (lấy lottie_light.min.js bằng: npm install lottie-web@5.12.2 → node_modules/lottie-web/build/player/)"""
import io, json, os, sys
D = os.path.dirname(os.path.abspath(__file__))
lib = os.environ.get('LOTTIE')
if not lib: sys.exit('Cần LOTTIE=<đường dẫn lottie_light.min.js>')
src = io.open(os.path.join(D, 'demo-lottie.src.html'), encoding='utf-8').read()
data = {}
for ten in ['dang-tong-hop-bao-cao', 'duyet-xong', 'da-duyet-het', 'mat-ket-noi']:
    data[ten] = json.load(io.open(os.path.join(D, '..', 'lottie', ten + '.json'), encoding='utf-8'))
code = io.open(lib, encoding='utf-8').read().replace('</script', '<\\/script')
src = src.replace('/*LOTTIE_LIB*/', '/* lottie-web 5.12.2 (bản light) – MIT License, (c) 2015 Bodymovin – https://github.com/airbnb/lottie-web */\n' + code)
src = src.replace('/*LOTTIE_DATA*/', json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/'))
io.open(os.path.join(D, '..', 'demo-lottie.html'), 'w', encoding='utf-8').write(src)
print('OK demo-lottie.html', len(src.encode('utf-8')) // 1024, 'KB')
