# -*- coding: utf-8 -*-
"""Tạo kpi-app/xem-thu-dang-nhap.html từ tests/dang-nhap-khac.html (cùng nguồn với Index.html)."""
import io, os, sys
D = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(D, 'dang-nhap'))
from anh_rhino import anh_rhino
bb = anh_rhino(io.open(os.path.join(D, 'dang-nhap-khac.html'), encoding='utf-8').read())
import base64
bb = bb.replace('{{ANH_NGON}}', 'data:image/png;base64,' + base64.b64encode(open(os.path.join(D, '..', 'anh', 'ngon-carbon.png'), 'rb').read()).decode())
CSS = bb.split('<!--CSS-->')[1].split('<!--HTML-->')[0]
HTML = bb.split('<!--HTML-->')[1].split('<!--JS-->')[0]
JS = bb.split('<!--JS-->')[1]
trang = u'''<!DOCTYPE html>
<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Xem thử đăng nhập — Carbon Billiards</title>
<link href="https://fonts.googleapis.com/css2?family=Arimo:wght@400;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
<style>
:root{--mono:'JetBrains Mono',ui-monospace,Consolas,monospace}
*{box-sizing:border-box;margin:0;padding:0}
body{background:#000;-webkit-font-smoothing:antialiased}
.hide{display:none!important}
label{display:block;margin-bottom:5px;text-transform:uppercase}
input{width:100%;outline:none;font-family:inherit}
.alert{padding:11px 14px;border-radius:10px;font-size:13px;border:1px solid}
.a-bd{background:rgba(242,85,90,.12);border-color:rgba(242,85,90,.35);color:#ff9ea1}
.a-ok{background:rgba(74,222,128,.12);border-color:rgba(74,222,128,.35);color:#86efac}
#gate #lerr.a-ok{background:rgba(74,222,128,.12);border-color:rgba(74,222,128,.35);color:#9ff0bd}
.spin{width:26px;height:26px;border:2.5px solid rgba(255,255,255,.2);border-top-color:#fff;border-radius:50%;animation:sp .7s linear infinite}
@keyframes sp{to{transform:rotate(360deg)}}
''' + CSS + u'''
</style></head><body>
''' + HTML + u'''
<script>
function $(i){return document.getElementById(i)}
''' + JS + u'''
/* ---- Bản xem thử: mật khẩu "demo" = đúng, còn lại = sai ---- */
function lerr(m){var e=$('lerr');e.textContent=m;e.className='alert a-bd';}
function login(){
  if(BB.dang||$('btnLogin').disabled)return;
  if(!$('l_tk').value.trim()||!$('l_mk').value){lerr('Nhập đủ mã nhân viên và mật khẩu.');return}
  $('btnLogin').disabled=true; bbCho();
  setTimeout(function(){                       // giả lập chờ máy chủ trả lời
    $('btnLogin').disabled=false;
    if($('l_mk').value==='demo'){
      window.ME={ten:'Phạm Doãn Chiến'};
      bbTrung(function(){ setTimeout(function(){ bbXep(); $('l_mk').value=''; },2600); });
    } else { bbTruot(); lerr('Sai tên đăng nhập hoặc mật khẩu. (Bản xem thử: gõ "demo")'); }
  },900);
}
bbKhoiDong();
</script></body></html>
'''
io.open(os.path.join(D, '..', 'xem-thu-dang-nhap.html'), 'w', encoding='utf-8').write(trang)
print('OK xem-thu-dang-nhap.html')
