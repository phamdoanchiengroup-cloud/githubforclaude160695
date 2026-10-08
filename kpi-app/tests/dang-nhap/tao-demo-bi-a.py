# -*- coding: utf-8 -*-
"""Dựng kpi-app/demo-dang-nhap-bi-a.html, demo-dang-nhap-rhino.html và demo-dang-nhap-khac.html: màn đăng nhập bi-a HIỆN TẠI (tests/dang-nhap-bi-a.html)
   đặt cạnh BẢN MỚI (tests/dang-nhap-bi-a-2.html, có Mai). Mỗi bản chạy trong một khung riêng với login() giả:
   mật khẩu "demo" là đúng, sai thì báo như máy chủ thật.
   python3 kpi-app/tests/dang-nhap/tao-demo-bi-a.py"""
import io, os, base64, html
D = os.path.dirname(os.path.abspath(__file__))
T = os.path.join(D, '..')
doc = lambda p: io.open(p, encoding='utf-8').read()
ANH = 'data:image/png;base64,' + base64.b64encode(open(os.path.join(T, '..', 'anh', 'ngon-carbon.png'), 'rb').read()).decode()
MAI = doc(os.path.join(T, 'mai', 'mai-chibi.js')).strip().replace("var MAI=''+", "var MAI_SVG=''+", 1)

GIA = r"""
var ME=null, __dangDangNhap=false;
function $(i){return document.getElementById(i)}
function today(){var d=new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
function lerr(m){var e=$('lerr');e.className='alert a-bd';e.textContent=m;e.classList.remove('hide');
  var g=$('gate'); if(g&&g.classList.contains('bb-vao')){g.classList.remove('bb-vao');try{bbXep();bbChu('Đăng nhập')}catch(x){}}}
/* login() giống bản thật sau khi vá (va-index.py mục 5), chỉ thay máy chủ bằng hẹn giờ */
function login(){
  if(__dangDangNhap)return;
  var tk=$('l_tk').value.trim(), mk=$('l_mk').value;
  if(!tk||!mk){lerr('Nhập đủ tên đăng nhập và mật khẩu');return}
  __dangDangNhap=true; $('btnLogin').disabled=true; $('lerr').classList.add('hide');
  try{bbCho()}catch(e){}
  setTimeout(function(){
    __dangDangNhap=false; $('btnLogin').disabled=false;
    if(mk!=='demo'){bbTruot();lerr('Sai tên đăng nhập hoặc mật khẩu');return}
    ME={ten:'Nguyễn Thị Lan'}; $('btnLogin').disabled=true;
    bbTrung(function(){ $('btnLogin').disabled=false; $('demoXong').classList.add('hien'); });
  }, 1100);
}
function lamLai(){ $('demoXong').classList.remove('hien'); $('l_mk').value=''; bbXep(); }
"""

import sys
sys.path.insert(0, D)
from anh_rhino import anh_rhino

def khung(nguon, co_mai, dau=''):
    s = anh_rhino(doc(os.path.join(T, nguon)).replace('{{ANH_NGON}}', ANH))
    css = s.split('<!--CSS-->')[1].split('<!--HTML-->')[0]
    htm = s.split('<!--HTML-->')[1].split('<!--JS-->')[0]
    js = s.split('<!--JS-->')[1]
    return ('<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
            '<link href="https://fonts.googleapis.com/css2?family=Arimo:wght@400;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">'
            '<style>*{box-sizing:border-box}body{margin:0}.hide{display:none!important}.alert{padding:12px 15px;border-radius:10px;font-size:13px;border:1px solid}'
            '#demoXong{position:fixed;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:14px;background:rgba(10,11,13,.82);color:#f5f2eb;font:600 17px Inter,sans-serif;text-align:center;padding:20px;opacity:0;pointer-events:none;transition:opacity .3s}'
            '#demoXong.hien{opacity:1;pointer-events:auto}#demoXong small{font-weight:400;opacity:.75;font-size:13px}'
            '#demoXong button{font:600 14px Inter,sans-serif;padding:10px 20px;border-radius:10px;border:1px solid #d9bd8c;background:none;color:#d9bd8c;cursor:pointer}\n'
            + css + '</style></head><body>' + htm +
            '<div id="demoXong">✓ Đã vào hệ thống<small>(demo dừng ở đây – web thật sẽ mở trang làm việc)</small><button onclick="lamLai()">↻ Thử lại</button></div>'
            '<script>' + dau + (MAI if co_mai else '') + GIA + js + '\nbbKhoiDong();</script></body></html>')

cu = khung('dang-nhap-bi-a.html', False)
for nguon, mau, ra in [('dang-nhap-bi-a-2.html', 'demo-bi-a.src.html', 'demo-dang-nhap-bi-a.html'),
                       ('dang-nhap-rhino.html', 'demo-rhino.src.html', 'demo-dang-nhap-rhino.html')]:
    moi = khung(nguon, True)
    trang = doc(os.path.join(D, mau)).replace('{{MOI}}', html.escape(moi, quote=True)).replace('{{CU}}', html.escape(cu, quote=True))
    io.open(os.path.join(T, '..', ra), 'w', encoding='utf-8').write(trang)
    print('OK', ra, len(trang.encode('utf-8')) // 1024, 'KB')

# Bản "Khắc laser" (09/10): đặt cạnh bản Phòng trưng bày và bản hiện tại
trang = anh_rhino(doc(os.path.join(D, 'demo-khac.src.html')))
for k, nguon, mai in [('{{MOI}}', 'dang-nhap-khac.html', True), ('{{TRUOC}}', 'dang-nhap-rhino.html', True), ('{{CU}}', 'dang-nhap-bi-a.html', False)]:
    trang = trang.replace(k, html.escape(khung(nguon, mai), quote=True))
io.open(os.path.join(T, '..', 'demo-dang-nhap-khac.html'), 'w', encoding='utf-8').write(trang)
print('OK demo-dang-nhap-khac.html', len(trang.encode('utf-8')) // 1024, 'KB')

# Hiệu ứng thêm cho màn Khắc laser (09/10): dây kéo bật đèn + nút chạy trốn – đặt cạnh bản hiện tại
trang = anh_rhino(doc(os.path.join(D, 'demo-hieu-ung.src.html')))
for k, dau in [('{{MOI}}', 'window.LK_HU={day:true,chay:true};'), ('{{CU}}', '')]:
    trang = trang.replace(k, html.escape(khung('dang-nhap-khac.html', True, dau), quote=True))
io.open(os.path.join(T, '..', 'demo-dang-nhap-hieu-ung.html'), 'w', encoding='utf-8').write(trang)
print('OK demo-dang-nhap-hieu-ung.html', len(trang.encode('utf-8')) // 1024, 'KB')
