import sys, numpy as np
from PIL import Image
from rembg import new_session, remove
ten, x0,y0,x1,y1, model = sys.argv[1], *map(int, sys.argv[2:6]), sys.argv[6]
im = Image.open('goc.png').convert('RGB').crop((x0,y0,x1,y1))
s = new_session(model)
out = remove(im, session=s, only_mask=True)
out.save(f'm_{ten}.png')
print(ten, np.array(out).mean())
