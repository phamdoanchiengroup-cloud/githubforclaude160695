# -*- coding: utf-8 -*-
"""Vá bản 3D của chủ dự án (so-do/nha-may-3d.html): thêm tô màu KPI / sĩ số, thẻ chi tiết, máy bảo trì – dùng chung SS của trang cha.
   Dùng cho demo (tao-demo.py) và web thật (va-so-do.py, mục 15 của va-index.py)."""

def R(s, old, new, n=1):
    assert s.count(old) == n, (old[:80], s.count(old))
    return s.replace(old, new)

def va_ba(ba_d, nhan_kpi='KPI hôm nay'):
    b = ba_d
    b = R(b, '<script type="importmap">', '''<script>window.SS=(window.parent&&window.parent!==window&&window.parent.SS)||null;</script>
<style>.ss-the{margin-top:10px;display:grid;gap:5px;font-size:13px}.ss-the .ss-dong{display:flex;justify-content:space-between;gap:10px;border-bottom:1px dashed var(--line);padding-bottom:4px}
.ss-the .ss-dong span{color:var(--muted)}.ss-the small{color:var(--muted);font-size:11.5px}.ss-trong{color:var(--muted)}
.ss-bt{padding:8px 10px;border-radius:6px;background:rgba(229,72,77,.12);border:1px solid rgba(229,72,77,.5)}
.lbl.bt{background:#e5484d;color:#fff;border-color:#a61b20}</style>
<script type="importmap">''')
    b = R(b, '''      <label class="sun" for="hour">''', '''      <div class="seg" id="segMau" role="group" aria-label="Tô màu"><button data-c="" aria-pressed="false">Màu thật</button><button data-c="kpi" aria-pressed="true">''' + nhan_kpi + '''</button><button data-c="siso" aria-pressed="false">Sĩ số</button></div>
      <label class="sun" for="hour">''')
    b = R(b, 'cat:false,hq:!small,sel:null};', 'cat:false,kpi:!!window.SS,hq:!small,sel:null};')
    b = R(b, 'st.cat?m.userData.cat:m.userData.real', 'veMau(m)', 2)
    b = R(b, 'let flyT=null;', '''function veMau(m){
  if(st.cat)return m.userData.cat;
  if(st.kpi&&window.SS){const R=DATA[m.userData.fi].rooms[m.userData.ri];const c=SS.mau(m.userData.fi,R)||(R.c==='sx'||R.c==='son'?'#8b9196':null);if(c)return mat(c,{roughness:.8});}
  return m.userData.real;}
const segMau=document.getElementById('segMau');
function veSegMau(){segMau.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String((st.kpi?SS.cheDo:'')===b.dataset.c)));}
if(!window.SS)segMau.remove();
else{segMau.onclick=e=>{const b=e.target.closest('button');if(!b)return;st.kpi=!!b.dataset.c;if(b.dataset.c)SS.datCheDo(b.dataset.c);else{apply();legend();}veSegMau();};
  SS.nghe.push(()=>{apply();legend();veSegMau();});}
let flyT=null;''')
    b = R(b, "document.getElementById('legend').innerHTML=st.cat?", "document.getElementById('legend').innerHTML=st.kpi&&window.SS&&!st.cat?SS.chuGiai():st.cat?")
    b = R(b, '''</dl>
     ${Object.keys(eq).length?''', '''</dl>${window.SS?SS.the(u.fi,R):''}
     ${Object.keys(eq).length?''')
    b = R(b, '</dl>${Mc.note?', "</dl>${window.SS?SS.theMay(u.fi,Mc):''}${Mc.note?")
    b = R(b, 'parts.mc.add(m);pick.push(m);const a=rc(Mc.r);', '''parts.mc.add(m);pick.push(m);const a=rc(Mc.r);
    if(window.SS&&SS.baoTri(fi,Mc)){parts.mc.add(box(a.x1-a.x0+.5,.04,a.y1-a.y0+.5,S({color:0xe5484d,emissive:0xe5484d,emissiveIntensity:.9}),px((a.x0+a.x1)/2),.08,pz((a.y0+a.y1)/2),false));
      const el=document.createElement('div');el.className='lbl bt';el.textContent='⚠ Bảo trì';const L=new CSS2DObject(el);L.position.set(px((a.x0+a.x1)/2),Mc.h+.7,pz((a.y0+a.y1)/2));L.userData.big=true;parts.labels.add(L);}''')
    return b
