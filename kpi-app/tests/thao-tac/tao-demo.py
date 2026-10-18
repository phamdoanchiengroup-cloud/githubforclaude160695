# -*- coding: utf-8 -*-
"""Dựng kpi-app/demo-thao-tac.html: 10 hiệu ứng thao tác bên trong (mục 7–16) – chèn hình Mai.
   python3 kpi-app/tests/thao-tac/tao-demo.py"""
import io, os
D = os.path.dirname(os.path.abspath(__file__))
s = io.open(os.path.join(D, 'demo.src.html'), encoding='utf-8').read()
s = s.replace('/*MAI*/', io.open(os.path.join(D, '..', 'mai', 'mai-chibi.js'), encoding='utf-8').read().strip())
io.open(os.path.join(D, '..', '..', 'demo-thao-tac.html'), 'w', encoding='utf-8').write(s)
print('OK demo-thao-tac.html', len(s.encode('utf-8')) // 1024, 'KB')
