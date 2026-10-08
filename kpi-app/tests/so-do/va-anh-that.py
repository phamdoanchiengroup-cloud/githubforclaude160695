# -*- coding: utf-8 -*-
# exec từ tao-demo.py: thêm chế độ "📷 Ảnh như thật" vào bản 3D (biến b) – dò tia sáng bằng three-gpu-pathtracer 0.0.23
# (hợp three 0.160; nạp động khi bấm nút nên không làm chậm lúc mở trang).
b = R(b, '"three/addons/":"https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"}',
      '"three/addons/":"https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/",'
      '"three/examples/jsm/":"https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/",'
      '"three-mesh-bvh":"https://cdn.jsdelivr.net/npm/three-mesh-bvh@0.7.6/build/index.module.js",'
      '"three-gpu-pathtracer":"https://cdn.jsdelivr.net/npm/three-gpu-pathtracer@0.0.23/build/index.module.js"}')

b = R(b, '      <label class="sun" for="hour">',
      '      <div class="seg pt-thanh"><button id="btnAnh" aria-pressed="false" title="Dựng ảnh bằng dò tia sáng: ánh sáng, bóng đổ, '
      'phản chiếu như ảnh chụp. Cần card đồ họa; đứng yên vài giây cho ảnh mịn.">📷 Ảnh như thật</button>'
      '<button id="btnTaiAnh" hidden>⤓ Tải ảnh</button></div>\n'
      '      <span class="pt-tt" id="ptTT" aria-live="polite" hidden></span>\n'
      '      <label class="sun" for="hour">')

b = R(b, '.lbl.bt{background:#e5484d;color:#fff;border-color:#a61b20}</style>', '''.lbl.bt{background:#e5484d;color:#fff;border-color:#a61b20}
.pt-thanh button[aria-pressed="true"]{background:#f7b829!important;color:#1d2328!important}
.pt-tt{background:var(--panel);border:1px solid var(--line);border-radius:6px;padding:6px 10px;font:500 12px var(--f-mono);color:var(--ink);box-shadow:0 1px 3px rgba(0,0,0,.12)}
.pt-tt i{display:inline-block;width:70px;height:4px;border-radius:2px;background:var(--line);vertical-align:2px;margin-left:8px;overflow:hidden}
.pt-tt i b{display:block;height:100%;background:#f7b829}
.app.pt-on .lbl,.app.pt-on .ax{opacity:0;transition:opacity .4s}</style>''')

PT_JS = r"""/* ---------- Ảnh như thật: dò tia sáng (path tracing) ----------
   Đứng yên thì mỗi khung hình cộng thêm mẫu tia sáng → ảnh mịn dần (bóng mềm, ánh sáng dội giữa các bề mặt,
   phản chiếu sàn epoxy và kính). Đang xoay/kéo thì tạm hiện bản thường cho mượt. Bầu trời (đúng giờ đang chọn)
   được chụp vào hộp lập phương để làm nguồn sáng môi trường; mặt trời là đèn chiếu song song. */
const PT_MAX=600; const ptSo=(k,d)=>+(window[k]||d); /* PT_NANG, PT_TROI: chỉnh tay khi cần */ let PT=null, ptBat=false, ptDung=false, ptCan=false, ptTai=false, ptCube=null, ptCu=null;
const btnAnh=document.getElementById('btnAnh'), btnTai=document.getElementById('btnTaiAnh'), ptTT=document.getElementById('ptTT');
function ptChu(t){ptTT.hidden=!t;ptTT.innerHTML=t||'';}
function ptBauTroi(){ if(!ptCube)ptCube=new THREE.WebGLCubeRenderTarget(512,{type:THREE.HalfFloatType});
  new THREE.CubeCamera(1,3000,ptCube).update(renderer,envScene); }
/* Cảnh riêng cho bộ dựng ảnh: mô hình có ~6.700 vật thể rời (mỗi người, cây, máy, cột…) và bộ dựng ảnh 0.0.23
   lấy nhầm vật liệu khi số vật thể > 255 (đường đỏ, tường xanh). Nên gộp: vật liệu giống hệt nhau dùng chung một bản,
   rồi trộn mọi vật thể cùng vật liệu thành một khối (đã nhân sẵn vị trí thật) → vài trăm khối, nhẹ và đúng màu. */
let BGU=null, ptCanh=null, ptDen=null;
function ptKhoa(m){ const h=c=>c?c.getHexString():'';
  return [m.type,h(m.color),m.roughness,m.metalness,h(m.emissive),m.emissiveIntensity,m.map&&m.map.uuid,m.normalMap&&m.normalMap.uuid,m.roughnessMap&&m.roughnessMap.uuid,
    m.transparent,m.opacity,m.side,m.alphaMap&&m.alphaMap.uuid].join('|'); }
function ptTaoCanh(){
  scene.updateMatrixWorld(true);
  const nhom=new Map();
  scene.traverseVisible(o=>{
    if(!o.isMesh||o.isInstancedMesh||o===sky||Array.isArray(o.material)||!o.material||o.material.isShaderMaterial||o.material.visible===false)return;
    const g0=o.geometry; if(!g0||!g0.attributes.position)return;
    const k=ptKhoa(o.material); let n=nhom.get(k); if(!n){n={m:o.material,ds:[]};nhom.set(k,n);}
    const g=new THREE.BufferGeometry(); g.setAttribute('position',g0.attributes.position.clone());
    if(g0.attributes.normal)g.setAttribute('normal',g0.attributes.normal.clone());
    g.setAttribute('uv',g0.attributes.uv?g0.attributes.uv.clone():new THREE.Float32BufferAttribute(new Float32Array(g0.attributes.position.count*2),2));
    if(g0.index)g.setIndex(g0.index.clone()); else g.setIndex([...Array(g0.attributes.position.count).keys()]);
    if(!g.attributes.normal)g.computeVertexNormals();
    g.applyMatrix4(o.matrixWorld); n.ds.push(g); });
  const c=new THREE.Scene();
  nhom.forEach(n=>{ const g=BGU.mergeGeometries(n.ds,false); n.ds.forEach(x=>x.dispose()); if(g)c.add(new THREE.Mesh(g,n.m)); });
  ptDen=sun.clone(); ptDen.target=new THREE.Object3D(); ptDen.target.position.copy(sun.target.position); ptDen.position.copy(sun.position);
  c.add(ptDen,ptDen.target);
  c.environment=ptCube.texture; c.background=ptCube.texture; // ảnh chụp ngoài trời: nắng gắt hơn, trời dịu hơn so với bản thường để bóng đổ rõ nét
  ptDen.intensity=sun.intensity*ptSo('PT_NANG',4.5); c.environmentIntensity=scene.environmentIntensity*ptSo('PT_TROI',.38); c.backgroundIntensity=1;
  if(ptCanh)ptCanh.traverse(o=>{if(o.isMesh)o.geometry.dispose();});
  ptCanh=c; return nhom.size; }
function ptDungCanh(){ if(!PT)return; ptDung=true; ptCan=false; ptChu('Đang dựng hình học cho ảnh thật…'); selBox.visible=false;
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    try{ ptBauTroi(); scene.background=ptCube.texture; sky.visible=false; ptTaoCanh(); PT.setScene(ptCanh,cam); }
    catch(e){ console.error(e); ptTat(); ptChu('Máy này chưa dựng được ảnh thật (card đồ họa không đủ)'); }
    ptDung=false; })); }
function ptTat(){ ptBat=false; document.querySelector('.app').classList.remove('pt-on'); btnAnh.setAttribute('aria-pressed','false'); btnTai.hidden=true; ptChu('');
  if(ptCu){scene.background=ptCu.bg;ptCu=null;} sky.visible=true; setHour(+hourEl.value); }
btnAnh.onclick=async()=>{
  if(ptBat){ptTat();return;}
  ptBat=true; btnAnh.setAttribute('aria-pressed','true'); document.querySelector('.app').classList.add('pt-on'); btnTai.hidden=false;
  ptCu={bg:scene.background};
  if(!PT){ ptChu('Đang nạp bộ dựng ảnh…');
    // three 0.160 chưa có Scene.backgroundRotation / environmentRotation (bộ dựng ảnh cần) → bổ sung
    if(!new THREE.Scene().backgroundRotation)['backgroundRotation','environmentRotation'].forEach(k=>Object.defineProperty(THREE.Scene.prototype,k,
      {configurable:true,get(){return this['_'+k]||(this['_'+k]=new THREE.Euler());},set(v){this['_'+k]=v;}}));
    try{ const [m,u]=await Promise.all([import('three-gpu-pathtracer'),import('three/addons/utils/BufferGeometryUtils.js')]); BGU=u; PT=new m.WebGLPathTracer(renderer);
      PT.bounces=5; PT.transmissiveBounces=6; PT.filterGlossyFactor=.5; PT.tiles.set(2,2); PT.minSamples=2; PT.renderDelay=250; PT.fadeDuration=500;
      PT.rasterizeSceneCallback=()=>{ if(st.hq)composer.render(); else renderer.render(scene,cam); };
    }catch(e){ console.error(e); ptTat(); ptChu('Không tải được bộ dựng ảnh (cần mạng)'); return; } }
  if(ptBat) ptDungCanh(); };
btnTai.onclick=()=>{ptTai=true;};
ctl.addEventListener('change',()=>{ if(ptBat&&PT&&!ptDung&&ptCanh) PT.updateCamera(); });
{ const a0=apply; apply=function(){ a0(); if(ptBat)ptCan=true; }; }            // đổi tầng / bật tắt / tô màu → dựng lại cảnh
{ const s0=select; select=function(u,go){ s0(u,go); if(ptBat){ptCan=true;selBox.visible=false;} }; }
{ const h0=setHour; setHour=function(h){ h0(h); if(ptBat){sky.visible=false;if(ptCube)scene.background=ptCube.texture;ptCan=true;} }; }
function ptVe(){
  const dichuyen=floors.some(F=>Math.abs(F.ty-F.yNow)>.01)||!!flyT;
  if(ptCan&&!ptDung&&!dichuyen) ptDungCanh();
  if(ptDung||ptCan||dichuyen){ if(st.hq)composer.render(); else renderer.render(scene,cam); return; }
  PT.pausePathTracing=PT.samples>=PT_MAX;
  PT.renderSample();
  const n=Math.min(PT_MAX,Math.floor(PT.samples));
  ptChu('Ảnh thật · '+n+'/'+PT_MAX+' mẫu<i><b style="width:'+(n/PT_MAX*100)+'%"></b></i>');
  if(ptTai){ptTai=false;const a=document.createElement('a');a.download='nha-may-anh-that-'+n+'-mau.png';a.href=renderer.domElement.toDataURL('image/png');a.click();}
}
window.__pt={get on(){return ptBat},get samples(){return PT?PT.samples:0},get dung(){return ptDung||ptCan},get PT(){return PT},get soVatLieu(){return PT&&PT._materials?PT._materials.length:0}};
let tPrev=0;"""
b = R(b, 'let tPrev=0;', PT_JS)
b = R(b, '    if(st.hq)composer.render();else renderer.render(scene,cam);\n    lr.render(scene,cam);',
      '    if(ptBat&&PT)ptVe(); else if(st.hq)composer.render();else renderer.render(scene,cam);\n    lr.render(scene,cam);')
