# -*- coding: utf-8 -*-
"""Vá Index.html – mục 49 (16/11 tối, chủ dự án): nút "☰ Menu" nhỏ, dễ thấy ở mép trái (máy tính) – menu trái đang ẩn kỹ (chỉ rê chuột mép trái mới hiện).
Bấm nút: mở / đóng menu; bấm ra ngoài hoặc chọn mục thì đóng. Điện thoại giữ thanh dưới như cũ. Chạy bằng exec() cuối tests/va-index.py."""
_k49 = s.rfind('</body>')
s = s[:_k49] + r"""<style id="menuNho">
#btnMenuNho{display:none}
@media (min-width:901px){
  html:not(.cn-moi) #btnMenuNho{display:flex;align-items:center;gap:6px;position:fixed;left:12px;top:72px;z-index:160;padding:6px 12px;border-radius:999px;
    border:1px solid #1ea7ff;background:#0b1d33;color:#f4ecda;font:600 13px/1 inherit;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.35),0 0 12px -2px rgba(30,167,255,.6)}
  html:not(.cn-moi) #btnMenuNho:hover{background:#12355c}
  html:not(.cn-moi).nav-mo #nav{transform:none!important;box-shadow:0 0 60px rgba(0,0,0,.6),0 0 30px -6px rgba(30,167,255,.6)}
  html:not(.cn-moi).nav-mo #btnMenuNho{left:auto;right:auto;transform:translateX(var(--navw,250px))}
}
</style>
<button type="button" id="btnMenuNho" aria-label="Mở menu" title="Mở / đóng menu"><span aria-hidden="true" style="font-size:15px">☰</span> Menu</button>
<script>
(function(){
  var b=document.getElementById('btnMenuNho'), h=document.documentElement; if(!b) return;
  function dong(){ h.classList.remove('nav-mo'); b.setAttribute('aria-expanded','false'); }
  b.onclick=function(e){ e.stopPropagation(); var nav=document.getElementById('nav'); if(nav) h.style.setProperty('--navw',(nav.getBoundingClientRect().width||250)+'px');
    var mo=!h.classList.contains('nav-mo'); h.classList.toggle('nav-mo',mo); b.setAttribute('aria-expanded',mo?'true':'false'); };
  document.addEventListener('click',function(e){ if(!h.classList.contains('nav-mo')) return; var nav=document.getElementById('nav');
    if(nav&&nav.contains(e.target)&&!e.target.closest('button')) return; if(e.target===b) return; dong(); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') dong(); });
  var hien=function(){ var app=document.getElementById('app'); b.style.visibility=(app&&app.style.display==='block')?'visible':'hidden'; };
  hien(); setInterval(hien,1500);
})();
</script>
""" + s[_k49:]
