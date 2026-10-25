// node chup.js <Index.html> <ra-prefix> [tab] [w] [tranMa]
const {chromium}=require('/opt/node22/lib/node_modules/playwright');const fs=require('fs');
(async()=>{
 const [,,file,out,tab='home',w='980',tran='']=process.argv;
 const data=fs.readFileSync(__dirname+'/data.json','utf8');
 let html=fs.readFileSync(file,'utf8');
 const mock=`<script>window.__DATA=${data};
 (function(){function runner(){var ok=function(){},fail=function(){};var px;var p={withSuccessHandler:function(f){ok=f;return px;},withFailureHandler:function(f){fail=f;return px;},withUserObject:function(){return px;}};
 px=new Proxy(p,{get:function(t,k){if(k in t)return t[k];return function(){setTimeout(function(){ok(k==='napDuLieu'?JSON.parse(JSON.stringify(window.__DATA)):{ok:true,vuaPhaLuoi:[],theVang:[],theDo:[]});},30);};}});return px;}
 window.google={script:{run:new Proxy({},{get:function(t,k){return runner()[k];}})}};})();</script>`;
 html=html.replace('<head>','<head>'+mock);
 // CSS/JS tách ra web/ (tải qua jsDelivr): khi chạy thử thì dùng bản trong máy
 html=html.replace(/https:\/\/(cdn|fastly)\.jsdelivr\.net\/gh\/[^"']*?\/webbongda\/web\//g,'file://'+require('path').resolve(__dirname,'../../web')+'/');
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:+w,height:900}});
 p.on('pageerror',e=>console.log('PAGEERR',e.message));p.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text().slice(0,200))});
 fs.writeFileSync(__dirname+'/_tmp.html',html);
 await p.goto('file://'+__dirname+'/_tmp.html');await p.waitForTimeout(2500);
 if(tab!=='home'){await p.evaluate(t=>setTab(t),tab);await p.waitForTimeout(1500);}
 if(tran){await p.evaluate(t=>xemDoiHinhTran(t),tran);await p.waitForTimeout(2500);}
 await p.waitForTimeout(1500);
 await p.screenshot({path:out+'.png',fullPage:!tran});
 await b.close();})();
