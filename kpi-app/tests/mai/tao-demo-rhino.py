# -*- coding: utf-8 -*-
"""Dựng kpi-app/demo-rhino.html: đặt Mai (hiện tại) cạnh chú tê giác Rhino (đề xuất) ở đúng các chỗ nhân vật xuất hiện trên web.
   Chạy: python3 tests/mai/tao-demo-rhino.py"""
import io, os, re
D = os.path.dirname(os.path.abspath(__file__))
doc = lambda p: io.open(os.path.join(D, p), encoding='utf-8').read()
MAI = doc('mai-chibi.js').strip()
RHINO = doc('rhino-chibi.js').strip()
CSS = re.search(r'MAI_CSS = r"""(.*?)"""', doc('va-mai.py'), re.S).group(1)

HTML = r"""<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Demo nhân vật Rhino</title>
<style>
:root{--bg:#14181b;--panel:#1f2529;--panel2:#252c31;--ink:#e8eef0;--ink2:#c3ccd0;--ink3:#8b979d;--line:#2f3a40;--cyan:#2fd3c6;--acc-rgb:47,211,198;--amber:#f0b04e;--red:#f26b6b;--vang:#f7b829}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif}
.wrap{max-width:1120px;margin:0 auto;padding:22px 16px 60px}
h1{font-size:22px;margin:0 0 4px}h2{font-size:15px;margin:30px 0 4px;letter-spacing:.02em}.mo{color:var(--ink3);margin:0 0 12px}
.dk{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0 4px}.dk button{background:var(--panel2);color:var(--ink);border:1px solid var(--line);border-radius:9px;padding:7px 13px;cursor:pointer;font:inherit}
.dk button[aria-pressed=true]{border-color:var(--vang);color:var(--vang)}
.cot2{display:grid;grid-template-columns:1fr 1fr;gap:14px}@media(max-width:760px){.cot2{grid-template-columns:1fr}}
.o{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:12px 14px;position:relative;overflow:hidden}
.o>.nhan{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--ink3);margin-bottom:8px}
.o.moi>.nhan{color:var(--vang)}
.tt{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;text-align:center}.tt svg{width:100%;max-width:120px;height:auto;aspect-ratio:200/270}
.tt small{display:block;color:var(--ink3);font-size:11.5px}
@media(max-width:560px){.tt{grid-template-columns:repeat(3,1fr)}}
/* góc màn hình: dựng lại #maiGoc ở dạng tĩnh trong khung */
.goc{display:flex;align-items:flex-end;min-height:150px;padding-top:20px}
.goc svg{width:92px;height:124px;flex:none;margin-right:-16px;position:relative;z-index:1}
.goc .bb{flex:1;background:var(--panel2);border:1.5px solid rgba(var(--acc-rgb),.5);border-radius:14px;padding:9px 14px 10px 22px;font-size:13px}
.moi .goc .bb{border-color:rgba(247,184,41,.55)}
.goc .bb small{display:block;color:var(--ink3);font-size:11.5px}.goc .bb .kh{font-weight:650;font-size:14px;line-height:1.4;margin:2px 0 4px}.goc .bb .kh b{color:var(--cyan)}
.moi .goc .bb .kh b,.moi .mai-bang .kh b,.moi .mai-thoai .loi b{color:var(--vang)}
.moi .mai-bang{background:linear-gradient(100deg,rgba(247,184,41,.12),rgba(247,184,41,.02) 60%);border-color:rgba(247,184,41,.3)}
.thoai{display:flex;align-items:flex-end;padding-top:14px}.thoai svg{width:120px;height:162px;flex:none;margin-right:-24px;margin-bottom:-6px;position:relative;z-index:1}
.moi .mai-thoai{border-color:rgba(247,184,41,.6)}.moi .mai-thoai .ten{background:var(--vang);color:#2b2b2b}
.btn{background:var(--panel2);color:var(--ink);border:1px solid var(--line);border-radius:8px;padding:5px 12px;font:inherit;font-size:13px}.btn.pri{background:var(--cyan);color:#06201e;border:0}.moi .btn.pri{background:var(--vang);color:#2b2b2b}
/* màn đăng nhập: chân dung tròn cạnh lời chào */
.dn{display:flex;align-items:center;gap:14px;background:#2b2b2b;border-radius:12px;padding:16px}
.dn .cd{width:84px;height:84px;border-radius:50%;background:radial-gradient(circle at 50% 35%,#3a3a3a,#1e1e1e);border:2px solid var(--vang);overflow:hidden;flex:none}
.dn .cd svg{width:100%;height:100%}
.dn b{font-size:17px}.dn small{display:block;color:#b9b9b9}
.ghi{color:var(--ink3);font-size:12.5px;margin-top:8px}
"""+CSS+r"""
/* tai tê giác: thỉnh thoảng vẫy */
.mai .tai-p{transform-origin:142px 82px;animation:rhTai 3.8s ease-in-out infinite}
@keyframes rhTai{0%,80%,100%{transform:rotate(0)}86%{transform:rotate(14deg)}92%{transform:rotate(-4deg)}}
@media (prefers-reduced-motion:reduce){.mai *{animation:none!important}}
</style></head><body><div class="wrap">
<h1>Nhân vật hướng dẫn: Mai (hiện tại) và chú tê giác Rhino (đề xuất)</h1>
<p class="mo">Chú tê giác tự vẽ, phong cách anime chibi thân thiện: mắt to màu hổ phách, má hồng, sừng ngà ánh vàng, chỏm lông vàng trên đầu. Chú mặc áo khoác đồng phục than chì viền vàng theo màu thương hiệu Rhino (#2b2b2b, #f7b829). Mọi tư thế và hiệu ứng (chớp mắt, nói, vẫy tay, chỉ tay, cổ vũ, lo lắng) giữ đúng như Mai đang dùng trên web, nên đổi nhân vật không cần sửa lời thoại hay chỗ xuất hiện.</p>
<div class="dk"><button type="button" id="bNoi" aria-pressed="false">💬 Cho nhân vật nói</button><button type="button" id="bChuyen" aria-pressed="false">⏸ Dừng chuyển động</button></div>

<h2>1. Các tư thế</h2>
<div class="cot2">
 <div class="o"><div class="nhan">Mai – hiện tại</div><div class="tt" data-nv="MAI"></div></div>
 <div class="o moi"><div class="nhan">Tê giác Rhino – đề xuất</div><div class="tt" data-nv="RHINO"></div></div>
</div>

<h2>2. Lời chào ở góc màn hình (mỗi ngày 1 lần, nhắc nghỉ 10:00 / 15:00, khen khi gửi sản lượng)</h2>
<div class="cot2">
 <div class="o"><div class="nhan">Mai</div><div class="goc"><svg class="mai vay noi" viewBox="0 0 200 270" data-nv="MAI"></svg><div class="bb"><small>🌤 Chào buổi sáng, Chiến!</small><div class="kh">Hôm nay hơn hôm qua một chút là <b>đủ giỏi rồi</b>!</div><span class="mai-chip mc-ns">Năng suất</span></div></div></div>
 <div class="o moi"><div class="nhan">Tê giác Rhino</div><div class="goc"><svg class="mai vay noi" viewBox="0 0 200 270" data-nv="RHINO"></svg><div class="bb"><small>🌤 Chào buổi sáng, Chiến!</small><div class="kh">Hôm nay hơn hôm qua một chút là <b>đủ giỏi rồi</b>!</div><span class="mai-chip mc-ns">Năng suất</span></div></div></div>
</div>

<h2>3. Dải khẩu hiệu của ngày (trang Việc hôm nay, Nhập sản lượng)</h2>
<div class="cot2">
 <div class="o"><div class="nhan">Mai</div><div class="mai-bang"><svg class="mai vui" viewBox="0 0 200 270" data-nv="MAI"></svg><div class="nd"><span class="mai-chip mc-cl">Chất lượng</span><div class="kh">Làm đúng ngay từ đầu – <b>nhanh nhất</b> là không phải làm lại.</div><small>Khẩu hiệu hôm nay</small></div></div></div>
 <div class="o moi"><div class="nhan">Tê giác Rhino</div><div class="mai-bang"><svg class="mai vui" viewBox="0 0 200 270" data-nv="RHINO"></svg><div class="nd"><span class="mai-chip mc-cl">Chất lượng</span><div class="kh">Làm đúng ngay từ đầu – <b>nhanh nhất</b> là không phải làm lại.</div><small>Khẩu hiệu hôm nay</small></div></div></div>
</div>

<h2>4. Hướng dẫn công nhân nhập sản lượng (lần đầu đăng nhập) và hộp đọc lại trước khi gửi</h2>
<div class="cot2">
 <div class="o"><div class="nhan">Mai</div><div class="thoai"><svg class="mai chi noi" viewBox="0 0 200 270" data-nv="MAI"></svg><div class="mai-thoai"><span class="ten">Mai</span><div class="loi">Bạn chọn <b>công đoạn</b> đã làm hôm nay ở ô này nhé. Không thấy công đoạn của mình thì báo tổ trưởng.</div><div class="dk"><span class="buoc">Bước 2 / 6</span><button class="btn" type="button">Quay lại</button><button class="btn pri" type="button">Tiếp</button></div></div></div></div>
 <div class="o moi"><div class="nhan">Tê giác Rhino</div><div class="thoai"><svg class="mai chi noi" viewBox="0 0 200 270" data-nv="RHINO"></svg><div class="mai-thoai"><span class="ten" data-ten>Rhino</span><div class="loi">Bạn chọn <b>công đoạn</b> đã làm hôm nay ở ô này nhé. Không thấy công đoạn của mình thì báo tổ trưởng.</div><div class="dk"><span class="buoc">Bước 2 / 6</span><button class="btn" type="button">Quay lại</button><button class="btn pri" type="button">Tiếp</button></div></div></div></div>
</div>
<div class="cot2" style="margin-top:14px">
 <div class="o"><div class="nhan">Mai – số lớn bất thường</div><div class="thoai"><svg class="mai lo" viewBox="0 0 200 270" data-nv="MAI"></svg><div class="mai-thoai"><span class="ten">Mai</span><div class="loi">Tổng hôm nay là <span class="vang">6.200</span> cái – cao hơn mọi ngày nhiều. Bạn xem lại giúp Mai có gõ thừa số 0 không nhé?</div><div class="dk"><span class="buoc"></span><button class="btn" type="button">Sửa lại</button><button class="btn pri" type="button">Đúng rồi, gửi</button></div></div></div></div>
 <div class="o moi"><div class="nhan">Tê giác Rhino – số lớn bất thường</div><div class="thoai"><svg class="mai lo" viewBox="0 0 200 270" data-nv="RHINO"></svg><div class="mai-thoai"><span class="ten" data-ten>Rhino</span><div class="loi">Tổng hôm nay là <span class="vang">6.200</span> cái – cao hơn mọi ngày nhiều. Bạn xem lại giúp mình có gõ thừa số 0 không nhé?</div><div class="dk"><span class="buoc"></span><button class="btn" type="button">Sửa lại</button><button class="btn pri" type="button">Đúng rồi, gửi</button></div></div></div></div>
</div>

<h2>5. Màn đăng nhập "Khắc laser": chân dung tròn cạnh lời chào</h2>
<div class="cot2">
 <div class="o"><div class="nhan">Mai</div><div class="dn"><div class="cd"><svg class="mai" viewBox="34 26 132 132" data-nv="MAI"></svg></div><div><b>Chào buổi sáng!</b><small>Nhập mã nhân viên để vào ca.</small></div></div></div>
 <div class="o moi"><div class="nhan">Tê giác Rhino</div><div class="dn"><div class="cd"><svg class="mai" viewBox="34 26 132 132" data-nv="RHINO"></svg></div><div><b>Chào buổi sáng!</b><small>Nhập mã nhân viên để vào ca.</small></div></div></div>
</div>
<p class="ghi">Nếu chọn tê giác: thay hình ở đủ 5 chỗ trên, đổi chữ "Mai" trong lời thoại thành tên chú tê giác, màu nhấn của bong bóng lời thoại chuyển sang vàng Rhino. Màn đăng nhập có thêm động tác lấy tay bịt tai khi bật Caps Lock và mắt nhìn theo chữ đang gõ; phần này sẽ vẽ lại cho tê giác khi gắn vào web.</p>
</div>
<script>
""" + MAI.replace("var MAI=", "var MAI_SVG=", 1) + "\n" + RHINO + r"""
var NV={MAI:MAI_SVG,RHINO:RHINO};
var TT=[['','Bình thường'],['vay noi','Vẫy chào + nói'],['chi','Chỉ tay'],['covu vui','Cổ vũ'],['lo','Lo lắng']];
document.querySelectorAll('.tt').forEach(function(o){var k=o.dataset.nv;o.innerHTML=TT.map(function(t){return '<div><svg class="mai '+t[0]+'" viewBox="0 0 200 270">'+NV[k]+'</svg><small>'+t[1]+'</small></div>'}).join('')});
document.querySelectorAll('svg[data-nv]').forEach(function(s){s.innerHTML=NV[s.dataset.nv]});
// gradient của 2 nhân vật có id riêng (g* / r*) nên đặt chung 1 trang không lẫn màu
document.getElementById('bNoi').onclick=function(){var on=this.getAttribute('aria-pressed')!=='true';this.setAttribute('aria-pressed',on);document.querySelectorAll('.tt svg').forEach(function(s){s.classList.toggle('noi',on)})};
document.getElementById('bChuyen').onclick=function(){var on=this.getAttribute('aria-pressed')!=='true';this.setAttribute('aria-pressed',on);this.textContent=on?'▶ Cho chuyển động':'⏸ Dừng chuyển động';document.querySelectorAll('svg.mai *').forEach(function(e){e.style.animationPlayState=on?'paused':''})};
</script></body></html>
"""
RA = os.path.join(D, '..', '..', 'demo-rhino.html')
io.open(RA, 'w', encoding='utf-8').write(HTML)
print('OK ->', os.path.abspath(RA), len(HTML) // 1024, 'KB')
