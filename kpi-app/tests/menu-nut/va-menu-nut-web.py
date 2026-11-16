# -*- coding: utf-8 -*-
"""Vá Index.html – mục 49 (16/11 tối, chủ dự án): nút ☰ mở menu trên máy tính (menu trái đang ẩn kỹ).
Bản 2 (chủ dự án chê nút nổi xấu): dùng luôn nút ☰ có sẵn ở thanh tiêu đề (trước chỉ hiện trên điện thoại), làm kiểu kính
giống các nút ☀ / ? bên phải, đứng cạnh logo KPI. Máy tính: bấm = mở / đóng menu trái (html.nav-mo); điện thoại giữ như cũ.
Chạy bằng exec() cuối tests/va-index.py."""
_k49 = s.rfind('</body>')
s = s[:_k49] + r"""<style id="menuNho">
@media (min-width:901px){
  html:not(.cn-moi) header .hnut{display:inline-flex!important;width:38px;height:38px;padding:0;margin-right:10px;align-items:center;justify-content:center;
    border-radius:11px;border:1px solid rgba(140,195,255,.28);background:linear-gradient(180deg,rgba(255,255,255,.14),rgba(255,255,255,.04));
    color:#eaf4ff;box-shadow:inset 0 1px 0 rgba(255,255,255,.18),0 4px 14px -6px rgba(0,0,0,.6);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
    transition:background .18s,border-color .18s,box-shadow .18s}
  html:not(.cn-moi) header .hnut svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;}
  html:not(.cn-moi) header .hnut:hover{border-color:rgba(110,190,255,.6);background:linear-gradient(180deg,rgba(255,255,255,.2),rgba(255,255,255,.07))}
  html:not(.cn-moi).nav-mo header .hnut{border-color:#1ea7ff;box-shadow:0 0 0 1px rgba(30,167,255,.5),0 0 16px -2px rgba(30,167,255,.7)}
  html.rs:not(.cn-moi) header .hnut,html.rs:not(.cn-moi) header .hnut:hover{background:rgba(255,255,255,.14)!important;color:#fff!important;border:1px solid rgba(255,255,255,.38)!important;
    box-shadow:inset 0 1px 0 rgba(255,255,255,.35),0 6px 18px -8px rgba(0,0,0,.55)!important;backdrop-filter:blur(14px) saturate(140%)!important;-webkit-backdrop-filter:blur(14px) saturate(140%)!important}
  html.rs:not(.cn-moi) header .hnut:hover{background:rgba(255,255,255,.24)!important}
  html.rs:not(.cn-moi).nav-mo header .hnut{background:rgba(255,255,255,.3)!important;border-color:#fff!important}
  html[data-gd="sang"]:not(.cn-moi):not(.rs) header .hnut{color:#0b1d33;border-color:rgba(11,29,51,.22);background:#fff}
  html:not(.cn-moi).nav-mo #nav{transform:none!important;box-shadow:0 0 60px rgba(0,0,0,.6),0 0 30px -6px rgba(30,167,255,.6)}
}
</style>
<script>
(function(){
  var h=document.documentElement;
  function may(){ return window.innerWidth>900 && !h.classList.contains('cn-moi'); }
  function dong(){ h.classList.remove('nav-mo'); }
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('header .hnut');
    if(b&&may()){ e.stopPropagation(); e.preventDefault(); h.classList.toggle('nav-mo'); b.setAttribute('aria-expanded',h.classList.contains('nav-mo')?'true':'false'); return; }
    if(!h.classList.contains('nav-mo')) return;
    var nav=document.getElementById('nav'); if(nav&&nav.contains(e.target)&&!(e.target.closest&&e.target.closest('button'))) return;
    dong();
  },true);
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') dong(); });
})();
</script>
""" + s[_k49:]
