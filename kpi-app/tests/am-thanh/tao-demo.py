# Dựng kpi-app/demo-am-thanh.html từ demo.src.html (chèn ảnh Rhino base64)
import base64, pathlib
g = pathlib.Path(__file__).resolve().parents[2]
src = (g / 'tests/am-thanh/demo.src.html').read_text(encoding='utf-8')
anh = base64.b64encode((g / 'anh/rhino-mascot/rhino-3b-nen-trong.webp').read_bytes()).decode()
(g / 'demo-am-thanh.html').write_text(src.replace('{{RHINO}}', 'data:image/webp;base64,' + anh), encoding='utf-8')
print('ok')
