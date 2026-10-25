# Dựng trang demo: Index.html + dữ liệu giả + hiệu ứng đợt 2
import json,sys,re
idx=open('/home/user/githubforclaude160695/webbongda/Index.html',encoding='utf-8').read()
data=open('../harness/data.json',encoding='utf-8').read()
fx=open('fx2.html',encoding='utf-8').read()
a="p.t++; p.x+=p.vx+Math.sin((p.t+i)*.03)*.25; p.y+=p.vy; p.vy+=p.g;"
assert a in idx
idx=idx.replace(a,"var R=window.FX_TOC||1; p.t+=R; p.x+=(p.vx+Math.sin((p.t+i)*.03)*.25)*R; p.y+=p.vy*R; p.vy+=p.g*R;")
b="for(var k=0;k<nen;k++) if(Math.random()<.5)"
assert b in idx; idx=idx.replace(b,"for(var k=0;k<nen;k++) if(Math.random()<.5*(window.FX_TOC||1))")
mock="""<script>window.__DATA=%s;
(function(){function runner(){var ok=function(){},fail=function(){};var px;var p={withSuccessHandler:function(f){ok=f;return px;},withFailureHandler:function(f){fail=f;return px;},withUserObject:function(){return px;}};
px=new Proxy(p,{get:function(t,k){if(k in t)return t[k];return function(){setTimeout(function(){ok(k==='napDuLieu'?JSON.parse(JSON.stringify(window.__DATA)):{ok:true,vuaPhaLuoi:[],theVang:[],theDo:[]});},30);};}});return px;}
window.google={script:{run:new Proxy({},{get:function(t,k){return runner()[k];}})}};})();</script>"""%data
idx=idx.replace('<head>','<head>'+mock,1)
i=idx.rfind('</body>'); idx=idx[:i]+fx+idx[i:]
idx=idx.replace('<head>','<head><title>Demo Hiệu Ứng Rhino 2026</title>',1)
open(sys.argv[1],'w',encoding='utf-8').write(idx)
# Bản đăng Artifact: nhúng ảnh thành data URI (CSP chặn ảnh ngoài)
if len(sys.argv)>2:
    m=json.load(open('anh/map.json'))
    for u,d in m.items():
        if u in idx: idx=idx.replace(u,d)
    nap="""<script>window.__ANH=%s;
(function(){var A=window.__ANH;function doi(el){var s=el.getAttribute&&el.getAttribute('src');if(s&&A[s])el.setAttribute('src',A[s]);}
var g=window.driveImg;if(g){window.driveImg=function(){var r=g.apply(this,arguments);return A[r]||r;};}
new MutationObserver(function(ms){ms.forEach(function(m){if(m.type==='attributes')doi(m.target);else m.addedNodes.forEach(function(n){if(n.nodeType!==1)return;if(n.tagName==='IMG')doi(n);n.querySelectorAll&&n.querySelectorAll('img').forEach(doi);});});}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['src']});
})();</script>"""%json.dumps(m)
    # chèn ngay sau script chính (driveImg đã định nghĩa) = trước khối hiệu ứng đợt 2
    k=idx.rfind('<style>\n/* ================= HIỆU ỨNG ĐỢT 2')
    idx=idx[:k]+nap+idx[k:]
    open(sys.argv[2],'w',encoding='utf-8').write(idx)
