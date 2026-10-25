# Hóp bụng nhẹ kiểu liquify: kéo vùng bụng phía trước vào trong theo phương ngang, mờ dần ra ngoài
import sys, numpy as np
from PIL import Image
from scipy.ndimage import map_coordinates
src, dst, cx, cy, rx, ry, s = sys.argv[1], sys.argv[2], *map(float, sys.argv[3:8])
a = np.asarray(Image.open(src).convert('RGBA')).astype(np.float32)
H, W = a.shape[:2]
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
w = np.exp(-(((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2))
sx = xx + s * w          # lấy mẫu lệch sang phải → nội dung dịch sang trái (vào trong)
out = np.stack([map_coordinates(a[..., c], [yy, sx], order=1, mode='nearest') for c in range(4)], -1)
Image.fromarray(out.clip(0, 255).astype(np.uint8)).save(dst)
