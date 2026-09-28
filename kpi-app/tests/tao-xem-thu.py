# -*- coding: utf-8 -*-
"""Tạo kpi-app/xem-thu-dang-nhap.html từ tests/dang-nhap-bi-a.html (cùng nguồn với Index.html)."""
import io, os
D = os.path.dirname(__file__)
bb = io.open(os.path.join(D, 'dang-nhap-bi-a.html'), encoding='utf-8').read()
CSS = bb.split('<!--CSS-->')[1].split('<!--HTML-->')[0]
HTML = bb.split('<!--HTML-->')[1].split('<!--JS-->')[0]
JS = bb.split('<!--JS-->')[1]
trang = u'''<!DOCTYPE html>
<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Xem thử đăng nhập Bàn bi-a</title>
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
.spin{width:26px;height:26px;border:2.5px solid rgba(255,255,255,.2);border-top-color:#fff;border-radius:50%;animation:sp .7s linear infinite}
@keyframes sp{to{transform:rotate(360deg)}}
.tong{position:fixed;top:34px;right:40px;z-index:50;display:flex;gap:6px;padding:5px;border-radius:12px;
  background:rgba(0,0,0,.55);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.14);font-family:system-ui,sans-serif}
.tong button{border:0;background:transparent;color:#dfe6ea;font:600 12.5px system-ui,sans-serif;padding:7px 11px;border-radius:8px;cursor:pointer;display:flex;align-items:center;gap:6px}
.tong button i{width:12px;height:12px;border-radius:50%;display:inline-block}
.tong button.on{background:#fff;color:#111}
@media (max-width:860px),(orientation:portrait){.tong{top:22px;right:50%;transform:translateX(50%)}.tong button{padding:6px 8px;font-size:11.5px}#gate .bb-khung{padding-top:74px}}
''' + CSS + u'''
</style></head><body>
<div class="tong" id="tong">
  <button class="on" onclick="chonTong('dem',this)"><i style="background:#2168b3"></i>Xanh đêm</button>
  <button onclick="chonTong('than',this)"><i style="background:#555c65;box-shadow:inset 0 0 0 3px #ff8a3d"></i>Than chì</button>
  <button onclick="chonTong('vang',this)"><i style="background:#9a2d45"></i>Rượu vang</button>
</div>
''' + HTML + u'''
<script>
function $(i){return document.getElementById(i)}
''' + JS + u'''
/* ---- Bản xem thử: mật khẩu "demo" = đúng, còn lại = sai ---- */
function lerr(m,ok){var e=$('lerr');e.textContent=m;e.className='alert '+(ok?'a-ok':'a-bd');}
function login(){
  if(BB.dang)return;
  $('lerr').className='alert a-bd hide';
  if($('l_mk').value==='demo'){
    $('btnLogin').disabled=true;
    bbTrung(function(){
      lerr('Đúng mật khẩu — bản thật sẽ mở ứng dụng lúc này.',true);
      setTimeout(function(){$('btnLogin').disabled=false;bbXep();},2200);
    });
  } else { bbTruot(); lerr('Sai tên đăng nhập hoặc mật khẩu. (Bản xem thử: gõ "demo")'); }
}
function chonTong(t,b){bbDoiTong(t);document.querySelectorAll('#tong button').forEach(function(x){x.classList.remove('on')});b.classList.add('on')}
bbKhoiDong();
</script></body></html>
'''
io.open(os.path.join(D, '..', 'xem-thu-dang-nhap.html'), 'w', encoding='utf-8').write(trang)
print('OK xem-thu-dang-nhap.html')
