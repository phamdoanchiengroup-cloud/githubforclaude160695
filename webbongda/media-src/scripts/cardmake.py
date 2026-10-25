# Ghép thẻ cầu thủ từ khung thẻ + ảnh cầu thủ trên Drive, theo bố cục thẻ của web.
import json, os, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, PngImagePlugin
PngImagePlugin.MAX_TEXT_CHUNK = 100 * 2**20
B = os.path.dirname(os.path.abspath(__file__))
C = B + '/drive/clean/'
F = B + '/fonts/'
W, H = 1700, 2360
YEL = (253, 224, 71)
CREAM = (255, 246, 228)
INK = (28, 14, 30)

def fnt(name, size): return ImageFont.truetype(F + name, size)

def cap_size(name, cap):
    f = fnt(name, 400); b = f.getbbox('H'); return round(400 * cap / (b[3] - b[1]))

def txt(s, font, cap, fill, sx=1.0, stroke=7, shadow=(0, 0), track=0):
    """Vẽ chữ có viền tối; trả ảnh RGBA cắt sát theo đường cơ sở (top = đỉnh chữ hoa)."""
    size = cap_size(font, cap); f = fnt(font, size)
    hb = f.getbbox('H'); pad = stroke * 2 + 40 + max(abs(shadow[0]), abs(shadow[1]))
    widths = [f.getlength(ch) for ch in s]
    tw = int(sum(widths) + track * (len(s) - 1))
    im = Image.new('RGBA', (tw + pad * 2, size * 2 + pad * 2), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    def draw(dx, dy, fl, st):
        x = pad + dx
        for ch, cw in zip(s, widths):
            d.text((x, pad + size // 2 + dy), ch, font=f, fill=fl, stroke_width=st, stroke_fill=INK)
            x += cw + track
    if shadow != (0, 0): draw(shadow[0], shadow[1], INK, stroke)
    draw(0, 0, fill, stroke)
    top = pad + size // 2 + hb[1]  # đỉnh chữ hoa
    if sx != 1.0:
        im = im.resize((max(1, round(im.width * sx)), im.height), Image.LANCZOS)
    return im, round((pad - stroke) * sx), top  # ảnh, lề trái tới mép chữ, vị trí đỉnh chữ hoa

def place_left(card, im_info, x, top):
    im, lx, t = im_info; card.alpha_composite(im, (round(x - lx), round(top - t)))

def place_center(card, im_info, cx, top):
    im, lx, t = im_info
    bb = im.getchannel('A').getbbox(); w = bb[2] - bb[0]
    card.alpha_composite(im, (round(cx - w / 2 - bb[0]), round(top - t)))

def vitri(v):
    s = [x.strip() for x in v.split(',')]
    for k, lab in [('TD', 'ST'), ('TV', 'CM'), ('HVCT', 'LB'), ('HVTT', 'CB'), ('TM', 'GK')]:
        if k in s: return lab
    return ''

def card_name(p):
    return p['MaCT'] if p['team'] in ('retro', 'juni') else p['MaCT'] + '_' + p['team']

def make(p, team):
    frame = Image.open(C + ('frame_juni' if team == 'juni' else 'frame_' + team) + '.png').convert('RGBA').resize((W, H), Image.LANCZOS)
    card = frame.copy()
    # ảnh cầu thủ
    ph = Image.open(C + p.get('photo', 'p_' + p['MaCT']) + '.png').convert('RGBA')
    sc = float(p['AnhScale'].replace(',', '.')) if p['AnhScale'].strip() else 1.0
    ay = float(p['AnhY']) if p['AnhY'].strip() else 0.0
    w = round(1335 * sc); h = round(ph.height * w / ph.width)
    ph = ph.resize((w, h), Image.LANCZOS)
    x = (W - w) // 2; y = round(308 + ay * 1.45)
    a = np.array(ph.getchannel('A')).astype(np.float32)
    # điểm bắt đầu mờ dần tính theo đỉnh đầu, để mặt và cổ luôn rõ nét
    rows = np.where((a > 200).sum(1) > 20)[0]
    head = y + (rows[0] if len(rows) else 0)
    f0 = max(1180, head + 880); f1 = f0 + 520
    yy = np.arange(h)[:, None] + y
    fade = np.clip(1 - (yy - f0) / (f1 - f0) * 0.8, 0.2, 1.0) * np.clip((y + h - yy) / 220, 0, 1)
    ph.putalpha(Image.fromarray((a * fade).clip(0, 255).astype('uint8')))
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0)); layer.paste(ph, (x, y))
    card.alpha_composite(layer)
    # chữ
    place_left(card, txt(str(p['Rating']), 'RobotoCond-1.ttf', 166, YEL, 1.0, 8), 220, 349)
    pos = vitri(p['ViTriList'])
    if pos: place_left(card, txt(pos, 'Roboto-700.ttf', 72, CREAM, 1.0, 7, track=10), 216, 683)
    num = p['SoAo'].strip()
    ni = txt(num, 'Oswald-700.ttf', 369, YEL, 0.74, 9, shadow=(9, 9))
    bw = ni[0].getchannel('A').getbbox(); wnum = bw[2] - bw[0]
    if wnum > 470:  # số áo dài (vd. 80B, A83) thì ép ngang cho vừa
        ni = txt(num, 'Oswald-700.ttf', 369, YEL, 0.74 * 470 / wnum, 9, shadow=(9, 9))
    place_center(card, ni, 1432, 393)
    name = p['HoTen'].strip()
    nm = txt(name, 'Roboto-900.ttf', 108, YEL, 0.96, 8)
    bw = nm[0].getchannel('A').getbbox()
    if bw[2] - bw[0] > 1320:
        nm = txt(name, 'Roboto-900.ttf', 108 * 1320 / (bw[2] - bw[0]), YEL, 0.96, 8)
    place_center(card, nm, 849, 1640)
    cols = [(179, 'PAC', 'PAS'), (692, 'DRI', 'DEF'), (1183, 'SHO', 'PHY')]
    for cx, l1, l2 in cols:
        for lab, top in [(l1, 1804), (l2, 1939)]:
            ni = txt(str(p[lab]), 'RobotoCond-1.ttf', 88, YEL, 1.0, 6)
            place_left(card, ni, cx, top)
            bw = ni[0].getchannel('A').getbbox()
            right = cx - ni[1] + bw[2] - 6
            place_left(card, txt(lab, 'Roboto-700.ttf', 88, CREAM, 0.95, 6), max(right + 22, cx + 125), top)
    return card

if __name__ == '__main__':
    import sys
    meta = json.load(open(B + '/drive/meta.json', encoding='utf-8'))
    os.makedirs(B + '/cards', exist_ok=True)
    only = sys.argv[1:] or None
    if only and only[0] == '--team': teams = set(only[1:]); only = None
    else: teams = None
    for p in meta:
        if only and p['MaCT'] not in only: continue
        if teams and p['team'] not in teams: continue
        make(p, p['team']).save(B + '/cards/' + card_name(p) + '.png')
