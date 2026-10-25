/* ================= STATE ================= */
var BANNER_HEP_ID='1RbTWbhEL38WiZYu36A-ewZ3_1ELyiyFC';
var GIAI_THUONG_IMG='https://cdn.jsdelivr.net/gh/phamdoanchiengroup-cloud/githubforclaude160695@c833aa220e53b38de4f026b699e832bb74b2ed85/webbongda/anh/co-cau-giai-thuong.webp';
var KHUNG_LEGEND_URL='https://drive.google.com/thumbnail?id=1eRrSr1Mwy61ZT07KwFSMFOymIn9iMSV2&sz=w1000';
var STATE = {
  token: localStorage.getItem('bd_token') || '',
  data: null,
  tab: 'home',
  loading: false
};

/* ================= UTIL ================= */
function $(id){return document.getElementById(id);}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){
  return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
/* Ảnh Drive → link ảnh thu nhỏ. w: bề rộng tải về (mặc định w600 – đủ nét cho logo/ảnh thẻ, nhẹ hơn w1600 khoảng 5–10 lần).
   Chỉ ảnh xem toàn khung (banner, ảnh thư viện mở lớn) mới truyền 'w1600'. */
function driveImg(u, w){
  w=w||'w600';
  u=String(u||'').trim();
  if(!u) return '';
  if(u.indexOf('drive.google.com')<0 && u.indexOf('docs.google.com')<0){
    if(/^[A-Za-z0-9_-]{25,}$/.test(u)) return 'https://drive.google.com/thumbnail?id='+u+'&sz='+w;
    return u;
  }
  var id='';
  var m=u.match(/\/file\/d\/([A-Za-z0-9_-]+)/) ||
        u.match(/[?&]id=([A-Za-z0-9_-]+)/) ||
        u.match(/\/d\/([A-Za-z0-9_-]+)/);
  if(m) id=m[1];
  if(!id) return u;
  return 'https://drive.google.com/thumbnail?id='+id+'&sz='+w;
}

/* ===== ẢNH SÂN THẬT (top-down) cho màn xếp đội hình =====
   Để dùng sân tự vẽ lại: đặt SAN_IMG = '' (rỗng).
   Đổi sân khác: thay link/ID Drive bên dưới (ảnh phải để "Bất kỳ ai có liên kết"). */
var SAN_IMG = 'https://drive.google.com/thumbnail?id=1ammDZ5_o5yjtatKO7u1Sq52pegFotOvJ&sz=w1600';
function sanImgUrl_(){
  if(!SAN_IMG) return '';
  // Nếu đã là link ảnh trực tiếp (thumbnail) thì giữ nguyên độ nét; nếu là link chia sẻ Drive thì đổi sang link ảnh
  return SAN_IMG.indexOf('/thumbnail?')>=0 ? SAN_IMG : driveImg(SAN_IMG);
}
function sanPhotoHtml_(){
  var u = sanImgUrl_();
  return u ? '<div class="pitch-photo-wrap"><div class="pitch-rot"><img class="pitch-photo" src="'+esc(u)+'" alt="" onerror="var w=this.closest(\'.pitch-photo-wrap\');if(w)w.style.display=\'none\'"></div></div>' : '';
}
/* Trả về hậu tố class cho sân: ' photo' (+ ' vert' nếu sân dọc) khi có ảnh */
function sanPhotoCls_(dinhDoc){ return SAN_IMG ? (' photo'+(dinhDoc?' vert':'')) : ''; }
function toast(msg,type){
  var t=$('toast');
  t.textContent=msg;
  t.className='toast show'+(type==='err'?' err':(type==='ok'?' ok':''));
  clearTimeout(t._tm);
  t._tm=setTimeout(function(){t.className='toast';},2800);
}
function openModal(id){
  $(id).classList.add('show');
  // Reset wide class nếu không phải modal đội
  if(id === 'mGeneric' && !window._keepWide){
    $('mGenericBox').classList.remove('wide');
  }
  window._keepWide = false;
}
function closeModal(id){$(id).classList.remove('show');}
function srv(fn,args){return new Promise(function(res,rej){
  google.script.run.withSuccessHandler(res).withFailureHandler(rej)[fn].apply(null,args||[]);
});}

function viTriLabel(v){
  var m={TM:'🧤 TM',HVTT:'🛡️ HVTT',HVCT:'🏃 HVC',TV:'⚙️ TV',TD:'⚡ TĐ'};
  return m[String(v||'').toUpperCase()] || '?';
}
function viTriShort(v){
  var m={TM:'TM',HVTT:'HVTT',HVCT:'HVC',TV:'TV',TD:'TĐ'};
  return m[String(v||'').toUpperCase()] || '?';
}
function viTriClass(v){
  var m={TM:'tm',HVTT:'hvtt',HVCT:'hvct',TV:'tv',TD:'td'};
  return m[String(v||'').toUpperCase()] || 'chua';
}
function viTriListHtml(str){
  if(!str) return '<span class="pill chua">—</span>';
  return String(str).toUpperCase().split(',')
    .filter(function(v){return v;})
    .map(function(v){
      return '<span class="pill '+viTriClass(v)+'" style="margin-right:3px">'+viTriShort(v)+'</span>';
    }).join('');
}
function hatGiongLabel(h){
  var m={BIET:'👍 Biết đá',PT:'🎉 Phong trào'};
  return m[String(h||'').toUpperCase()] || '—';
}
function hatGiongClass(h){
  var m={BIET:'biet',PT:'pt'};
  return m[String(h||'').toUpperCase()] || 'chua';
}
function hatGiongPill(h){
  if(!h) return '<span class="pill chua">—</span>';
  return '<span class="pill '+hatGiongClass(h)+'">'+hatGiongLabel(h)+'</span>';
}

function tenDoi(maDoi){
  if(!maDoi) return '(chưa)';
  var d=STATE.data.doi.filter(function(x){return x.maDoi===maDoi;})[0];
  return d?d.tenDoi:'(?)';
}
function doiObj(maDoi){
  return STATE.data.doi.filter(function(x){return x.maDoi===maDoi;})[0];
}
function cauThuObj(maCT){
  return STATE.data.cauThu.filter(function(x){return x.maCT===maCT;})[0];
}
function cauThuTrongDoi(maDoi, gomCaGH){
  return STATE.data.cauThu.filter(function(c){
    if (c.maDoi === maDoi) return true;
    // Nếu gom cả GH: thêm những người có maDoiGoc === maDoi
    if (gomCaGH && c.maDoiGoc === maDoi) return true;
    return false;
  });
}
function logoDoiHtml(maDoi,size){
  size=size||28;
  var d=doiObj(maDoi);
  var st='width:'+size+'px;height:'+size+'px;border-radius:'+Math.round(size*0.28)+'px;flex:0 0 auto;';
  if(d&&d.logoUrl){
    return '<img src="'+esc(driveImg(d.logoUrl))+'" style="'+st+'object-fit:cover;border:1px solid var(--vien)" '
      +'onerror="this.outerHTML=\'<div style=&quot;'+st+'background:linear-gradient(135deg,var(--neon),var(--cam));display:flex;align-items:center;justify-content:center;font-family:\\\'Oswald\\\';color:#04122b;font-size:'+Math.round(size*0.42)+'px&quot;>'+esc((d.tenDoi||'?').slice(0,2).toUpperCase())+'</div>\'">';
  }
  var ten=d?d.tenDoi:'?';
  return '<div style="'+st+'background:linear-gradient(135deg,var(--neon),var(--cam));display:flex;align-items:center;justify-content:center;font-family:\'Oswald\';color:#04122b;font-size:'+Math.round(size*0.42)+'px">'+esc((ten||'?').slice(0,2).toUpperCase())+'</div>';
}
/* Logo đội TO, hiển thị đầy đủ (object-fit:contain) — dùng cho màn xem đội hình 2 đội */
function thLogo_(maDoi){
  var d=doiObj(maDoi);
  var vt=esc((d?d.tenDoi:'?').slice(0,2).toUpperCase());
  if(d&&d.logoUrl){
    return '<img class="th-logo" src="'+esc(driveImg(d.logoUrl))+'" alt="" '
      +'onerror="this.outerHTML=\'<div class=&quot;th-logo ph&quot;>'+vt+'</div>\'">';
  }
  return '<div class="th-logo ph">'+vt+'</div>';
}
function demViTriDoi(maDoi){
  var cnt={TM:0,HVTT:0,HVCT:0,TV:0,TD:0,K:0};
  cauThuTrongDoi(maDoi, true).forEach(function(c){
    var vl=String(c.viTriList||'').toUpperCase().split(',').filter(function(v){return v;});
    if(vl.length){ vl.forEach(function(v){ if(cnt[v]!==undefined) cnt[v]++; }); }
    else cnt.K++;
  });
  return cnt;
}
function demHatGiongDoi(maDoi){
  var cnt={BIET:0,PT:0,'':0};
  cauThuTrongDoi(maDoi, true).forEach(function(c){
    var h=String(c.hatGiong||'').toUpperCase();
    if(cnt[h]!==undefined) cnt[h]++; else cnt['']++;
  });
  return cnt;
}

/* ================= TẢI DỮ LIỆU ================= */
function tai(){
  STATE.loading=true;
  return srv('napDuLieu',[STATE.token]).then(function(d){
    STATE.loading=false;
    if(!d||!d.ok){ toast((d&&d.msg)||'Lỗi tải dữ liệu','err'); return; }
    if(d.hetHan){ STATE.token=''; localStorage.removeItem('bd_token'); }
    STATE.data=d;
    napDoiHinhLocal_();
    napToaDoLocal_();   // ⭐ load tọa độ slot đã chỉnh tay
    
    // ⭐ Đồng bộ state màu áo từ server
    if(d.mauAoConfig && d.mauAoConfig.length){
      STATE.data.mauAoConfig = d.mauAoConfig;
      // Nếu KHÔNG đang sửa dở (temp rỗng) → cập nhật temp
      if(!window._CAU_MAU_TEMP || !window._CAU_MAU_TEMP.length){
        window._CAU_MAU_TEMP = d.mauAoConfig.slice();
      }
    }
    
    $('tenGiai').textContent=d.tenGiai||'Giải bóng đá công ty';
    $('loading').style.display='none';
    $('app').style.display='block';
    render();
        // Nạp cấu hình màu áo vào biến global
    srv('napMauAoConfig').then(function(cfg){
      if(cfg && cfg.ok){
        window._MAU_AO_LIST = cfg.items || [];
        // Đồng bộ STATE luôn
        if(!STATE.data.mauAoConfig || !STATE.data.mauAoConfig.length){
          STATE.data.mauAoConfig = cfg.items || [];
        }
      }
    });
    }).catch(function(e){ STATE.loading=false; toast('Lỗi: '+e.message,'err'); });
}
/* ================= ĐĂNG NHẬP ================= */
function doLogin(){
  var mk=$('mkAdmin').value;
  if(!mk){toast('Nhập mật khẩu','err');return;}
  $('btnLogin').innerHTML='<span class="spin"></span>';
  srv('dangNhapAdmin',[mk]).then(function(r){
    $('btnLogin').textContent='Đăng nhập';
    if(r&&r.ok){
      STATE.token=r.token; localStorage.setItem('bd_token',r.token);
      $('mkAdmin').value=''; closeModal('mLogin');
      toast('Đã đăng nhập BTC','ok'); tai();
    } else toast((r&&r.msg)||'Sai mật khẩu','err');
  }).catch(function(e){$('btnLogin').textContent='Đăng nhập';toast('Lỗi: '+e.message,'err');});
}
function doLogout(){
  srv('dangXuat',[STATE.token]);
  STATE.token='';localStorage.removeItem('bd_token');
  toast('Đã đăng xuất'); tai();
}

/* ============================================================
   ⭐ BANNER ĐỘNG — tự chạy 5 cảnh: banner giải, trận tiếp theo (đếm ngược),
   kết quả mới nhất (khi đã có tỷ số), lịch thi đấu, các đội, giải thưởng.
   Dữ liệu lấy từ STATE.data nên nhập tỷ số xong là banner tự đổi.
   ============================================================ */
var VIDEO_GIOI_THIEU = 'https://youtu.be/lhtLebUcmPQ';   // video giới thiệu khổ ngang (có tiếng)
var BD = { timer: null, i: 0, dung: false, canh: [], cham: [], DUR: 6000, du: 0, el: null };
var BD_THU = ['CHỦ NHẬT','THỨ HAI','THỨ BA','THỨ TƯ','THỨ NĂM','THỨ SÁU','THỨ BẢY'];
function bdP2_(x){ return (x < 10 ? '0' : '') + x; }
/* Giờ thi đấu: nhận "15:00 20/10/2026" hoặc "2026-10-20 15:00:00" */
function bdGio_(s){
  s = String(s || '');
  var m = s.match(/(\d{1,2}):(\d{2})\s+(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (m) return new Date(+m[5], +m[4] - 1, +m[3], +m[1], +m[2]);
  m = s.match(/(\d{4})-(\d{1,2})-(\d{1,2})[ T](\d{1,2}):(\d{2})/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
  return null;
}
function bdNgay_(d){ return bdP2_(d.getDate()) + '/' + bdP2_(d.getMonth() + 1); }
function bdGioTxt_(d){ return bdP2_(d.getHours()) + ':' + bdP2_(d.getMinutes()); }
function bdDaDa_(t){ return t.trangThai === 'Đã đá' && t.banThangA !== '' && t.banThangB !== ''; }

function veBannerDong(el){
  var d = STATE.data, n = 0;
  var v = function(){ return ' style="--i:' + (n++) + '"'; };
  var lg = function(id){ var x = doiObj(id); return x && x.logoUrl ? esc(driveImg(x.logoUrl)) : ''; };
  var ten = function(id){ var x = doiObj(id); return x ? x.tenDoi : '?'; };
  var ngan = function(id){ return String(ten(id)).replace(/\bFC\b/g, '').trim(); };
  var tran = (d.tranDau || []).map(function(t){ var o = {}; for (var k in t) o[k] = t[k]; o._d = bdGio_(t.gioThiDau); return o; })
    .filter(function(t){ return t._d && t.maDoiB; }).sort(function(a, b){ return a._d - b._d; });
  var now = new Date();
  var sap = tran.filter(function(t){ return !bdDaDa_(t) && t._d > now; })[0] || null;
  var daDa = tran.filter(bdDaDa_);
  var km = tran[0];
  var canh = [];
  var doiHtml = function(id){ return '<div class="bdx-doi bdx-vao"' + v() + '><img alt="" src="' + lg(id) + '"><div class="bdx-ten">' + esc(ten(id)) + '</div></div>'; };

  // 1. Banner giải
  var bn = d.bannerUrl || BANNER_HEP_ID || '';
  if (bn) canh.push('<div class="bdx-canh bdx-hero"><div class="bdx-anh" style="background-image:url(\'' + esc(driveImg(bn, 'w1600')) + '\')"></div>'
    + (km ? '<div class="bdx-day"><span>Khai mạc</span><b>' + bdGioTxt_(km._d) + ' · ' + BD_THU[km._d.getDay()] + ' · ' + bdNgay_(km._d) + '/' + km._d.getFullYear() + '</b><span>Công ty TNHH Carbon Billiards</span></div>' : '') + '</div>');

  // Các trận cùng ngày với trận t (để hiện 2 trận trên 1 khung)
  var cungNgay = function(t){ return tran.filter(function(x){ return x._d.toDateString() === t._d.toDateString(); }); };
  // Thẻ 1 trận trong khung 2 trận: logo · tỷ số (hoặc VS) · logo, dưới là người ghi bàn
  var the2 = function(t, xong){
    var aW = xong && t.banThangA > t.banThangB, bW = xong && t.banThangB > t.banThangA;
    var ghi = function(id){
      if (!xong || typeof doiSuKien_ !== 'function') return '';
      var p = {}, thuTu = [];
      (d.suKien || []).filter(function(s){ return s.maTran === t.maTran && s.loai === 'BAN' && doiSuKien_(s, t) === id; })
        .sort(function(a, b){ return (a.phut || 0) - (b.phut || 0); })
        .forEach(function(s){ var c = cauThuObj(s.maCT); var k = c ? c.hoTen : '?'; if (!p[k]) { p[k] = []; thuTu.push(k); } if (s.phut) p[k].push(s.phut + "'"); });
      return thuTu.map(function(k){ return '⚽ ' + esc(k) + (p[k].length ? ' ' + p[k].join(' ') : ''); }).join('<br>');
    };
    var gA = ghi(t.maDoiA), gB = ghi(t.maDoiB);
    return '<div class="bdx-the bdx-vao"' + v() + '>'
      + '<div class="bdx-hang">'
      +   '<div class="bdx-doi2' + (bW ? ' bdx-thua' : '') + '"><img alt="" src="' + lg(t.maDoiA) + '"><div>' + esc(ten(t.maDoiA)) + '</div></div>'
      +   '<div class="bdx-so2' + (xong ? '' : ' bdx-cho') + '">' + (xong ? t.banThangA + ' – ' + t.banThangB : 'VS') + '</div>'
      +   '<div class="bdx-doi2' + (aW ? ' bdx-thua' : '') + '"><img alt="" src="' + lg(t.maDoiB) + '"><div>' + esc(ten(t.maDoiB)) + '</div></div>'
      + '</div>'
      + (xong ? ((gA || gB) ? '<div class="bdx-ghi"><div>' + gA + '</div><div class="r">' + gB + '</div></div>' : '')
              : '<div class="bdx-the-gio">' + bdGioTxt_(t._d) + (t.sanDau ? ' · ' + esc(t.sanDau) : '') + '</div>')
      + '</div>';
  };
  var tenVong = function(t){ return typeof nhanLuot_ === 'function' ? nhanLuot_(t) : String(t.vongDau || '').replace(/[^\p{L}\p{N}\s]/gu, '').trim(); };

  // 2. Trận tiếp theo + đếm ngược (cùng ngày có 2 trận thì hiện cả 2)
  if (sap) { n = 0; var sapDs = cungNgay(sap).filter(function(t){ return !bdDaDa_(t); });
    canh.push('<div class="bdx-canh"><div class="bdx-khoi"><div class="bdx-nhan bdx-vao"' + v() + '>' + (sapDs.length > 1 ? 'Ngày thi đấu tiếp theo' : 'Trận tiếp theo') + ' · ' + esc(tenVong(sap)) + '</div>'
      + (sapDs.length > 1
          ? '<div class="bdx-2">' + sapDs.slice(0, 2).map(function(t){ return the2(t, false); }).join('') + '</div>'
            + '<div class="bdx-gio bdx-vao"' + v() + '>' + BD_THU[sap._d.getDay()] + ' · ' + bdNgay_(sap._d) + '/' + sap._d.getFullYear() + '</div>'
          : '<div class="bdx-tran">' + doiHtml(sap.maDoiA) + '<div class="bdx-vs bdx-vao"' + v() + '>VS</div>' + doiHtml(sap.maDoiB) + '</div>'
            + '<div class="bdx-gio bdx-vao"' + v() + '>' + BD_THU[sap._d.getDay()] + ' · ' + bdGioTxt_(sap._d) + ' ' + bdNgay_(sap._d) + '/' + sap._d.getFullYear() + (sap.sanDau ? ' · ' + esc(sap.sanDau) : '') + '</div>')
      + '<div class="bdx-dem bdx-vao"' + v() + ' data-den="' + sap._d.getTime() + '"><div><b data-k="d">0</b><span>Ngày</span></div><div><b data-k="h">00</b><span>Giờ</span></div><div><b data-k="m">00</b><span>Phút</span></div><div><b data-k="s">00</b><span>Giây</span></div></div>'
      + '</div></div>');
  }

  // 3. Kết quả ngày thi đấu gần nhất (2 trận cùng ngày hiện chung 1 khung)
  if (daDa.length) { n = 0; var t = daDa[daDa.length - 1], kqDs = cungNgay(t).filter(bdDaDa_);
    canh.push('<div class="bdx-canh"><div class="bdx-khoi"><div class="bdx-nhan bdx-vao"' + v() + '>Kết quả ' + esc(tenVong(t)) + ' · ' + BD_THU[t._d.getDay()] + ' ' + bdNgay_(t._d) + '/' + t._d.getFullYear() + '</div>'
      + (kqDs.length > 1
          ? '<div class="bdx-2">' + kqDs.slice(0, 2).map(function(x){ return the2(x, true); }).join('') + '</div>'
          : '<div class="bdx-tran">' + doiHtml(t.maDoiA) + '<div class="bdx-vs bdx-kq bdx-vao"' + v() + '>' + t.banThangA + ' – ' + t.banThangB + '</div>' + doiHtml(t.maDoiB) + '</div>')
      + '</div></div>');
  }

  // 4. Lịch thi đấu theo ngày
  if (tran.length) { n = 0; var ngay = {}, thuTu = [];
    tran.forEach(function(t){ var k = t._d.toDateString(); if (!ngay[k]) { ngay[k] = []; thuTu.push(k); } ngay[k].push(t); });
    canh.push('<div class="bdx-canh"><div class="bdx-khoi"><div class="bdx-nhan bdx-vao"' + v() + '>Lịch thi đấu</div><div class="bdx-lich">'
      + thuTu.slice(0, 4).map(function(k){ var ds = ngay[k], d0 = ds[0]._d;
        return '<div class="bdx-ngay bdx-vao"' + v() + '><div class="bdx-t">' + BD_THU[d0.getDay()] + ' · ' + bdGioTxt_(d0) + '</div><div class="bdx-d">' + bdNgay_(d0) + '</div>'
          + ds.map(function(t){ var xong = bdDaDa_(t);
            return '<div class="bdx-cap"><img alt="" src="' + lg(t.maDoiA) + '"><span class="bdx-tn">' + esc(ngan(t.maDoiA)) + '</span><div class="bdx-so' + (xong ? ' bdx-da' : '') + '">' + (xong ? t.banThangA + ' – ' + t.banThangB : 'VS') + '</div><span class="bdx-tn bdx-p">' + esc(ngan(t.maDoiB)) + '</span><img alt="" src="' + lg(t.maDoiB) + '"></div>'; }).join('')
          + '<div class="bdx-t">' + (/khai/i.test(ds[0].vongDau) ? 'Giao hữu khai mạc' : esc(ds[0].vongDau || '')) + '</div></div>'; }).join('')
      + '</div></div></div>');
  }

  // 5. Các đội (giao hữu trước như trang chủ)
  var ds = (d.doi || []).slice().sort(function(a, b){ return (b.loaiDoi === 'GH') - (a.loaiDoi === 'GH'); });
  if (ds.length) { n = 0;
    canh.push('<div class="bdx-canh"><div class="bdx-khoi"><div class="bdx-nhan bdx-vao"' + v() + '>Các đội tham dự</div><div class="bdx-cacdoi">'
      + ds.map(function(x){ return '<div class="bdx-doi bdx-vao' + (x.loaiDoi === 'GH' ? ' bdx-gh' : '') + '"' + v() + '><img alt="" src="' + lg(x.maDoi) + '"><div class="bdx-ten">' + esc(x.tenDoi) + '</div></div>'; }).join('')
      + '</div><div class="bdx-chu bdx-vao"' + v() + '>Vòng tròn 1 lượt · <span style="color:#ffd84a">Giao hữu khai mạc</span></div></div></div>');
  }

  // 6. Cơ cấu giải thưởng (ảnh BTC thiết kế)
  if (GIAI_THUONG_IMG) canh.push('<div class="bdx-canh bdx-thuong"><img class="bdx-vao" style="--i:0" alt="Cơ cấu giải thưởng" src="' + esc(driveImg(GIAI_THUONG_IMG)) + '"></div>');

  el.className = 'bdong';
  el.innerHTML = canh.join('') + '<div class="bdx-dk"><div class="bdx-cham">'
    + canh.map(function(_, i){ return '<button type="button" aria-label="Cảnh ' + (i + 1) + '" onclick="bdDen_(' + i + ')"></button>'; }).join('')
    + '</div>' + (VIDEO_GIOI_THIEU ? '<button type="button" class="bdx-video" onclick="moVideoGioiThieu()">▶ Xem video giới thiệu</button>' : '') + '</div>';
  el.style.setProperty('--dur', BD.DUR + 'ms');
  el.onmouseenter = function(){ BD.dung = true; el.classList.add('bdx-dung'); };
  el.onmouseleave = function(){ BD.dung = false; el.classList.remove('bdx-dung'); };
  BD.el = el;
  BD.canh = [].slice.call(el.querySelectorAll('.bdx-canh'));
  BD.cham = [].slice.call(el.querySelectorAll('.bdx-cham button'));
  if (!BD.canh.length) return;
  bdDen_(Math.min(BD.i, BD.canh.length - 1));
  clearInterval(BD.timer);
  BD.timer = setInterval(function(){
    if (!document.body.contains(BD.el)) { clearInterval(BD.timer); return; }
    bdDem_();
    if (BD.dung || document.hidden) return;
    BD.du += 250;
    if (BD.du >= BD.DUR) bdDen_((BD.i + 1) % BD.canh.length);
  }, 250);
}
function bdDen_(i){
  BD.i = i; BD.du = 0;
  BD.canh.forEach(function(c, k){ c.classList.toggle('bdx-hien', k === i); });
  BD.cham.forEach(function(b){ b.classList.remove('bdx-dang'); });
  void BD.el.offsetWidth; if (BD.cham[i]) BD.cham[i].classList.add('bdx-dang');
  bdDem_();
}
function bdDem_(){
  var box = BD.el && BD.el.querySelector('.bdx-dem'); if (!box) return;
  var s = Math.max(0, Math.floor((+box.getAttribute('data-den') - Date.now()) / 1000));
  var dd = Math.floor(s / 86400); s -= dd * 86400; var h = Math.floor(s / 3600); s -= h * 3600; var m = Math.floor(s / 60); s -= m * 60;
  box.querySelector('[data-k=d]').textContent = dd; box.querySelector('[data-k=h]').textContent = bdP2_(h);
  box.querySelector('[data-k=m]').textContent = bdP2_(m); box.querySelector('[data-k=s]').textContent = bdP2_(s);
}
/* Mở video giới thiệu (có tiếng) trong khung xem của thư viện media */
function moVideoGioiThieu(){
  var embed = youtubeEmbed_(VIDEO_GIOI_THIEU);
  var lb = document.getElementById('mediaLightbox');
  if (!lb) {
    lb = document.createElement('div'); lb.id = 'mediaLightbox'; lb.className = 'media-lightbox';
    lb.onclick = function(e){ if (e.target === lb) closeMediaLightbox(); };
    document.body.appendChild(lb);
  }
  lb.innerHTML = '<button class="lb-close" onclick="closeMediaLightbox()">✕</button><div class="lb-content">'
    + '<iframe src="' + esc(embed) + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>'
    + '<div class="lb-goi-y">💡 Video mờ? Bấm <b>⚙</b> → <b>Chất lượng</b> → <b>1080p</b>, hoặc bấm <b>⛶</b> xem toàn màn hình.</div>'
    + '<div class="lb-title">Giải vô địch bóng đá Rhino Billiards 2026</div></div>';
  lb.classList.add('show');
  document.addEventListener('keydown', escListenerLB_);
}

/* ================= KHUNG MATCH DAY TRANG CHỦ (giao diện 2026) =================
   Poster từng ngày thi đấu (khóa "dd/mm/yyyy"), tải qua jsDelivr. Ngày không có poster thì dùng ảnh banner giải. */
var MATCH_DAY_POSTER = {
  '29/10/2026': 'https://cdn.jsdelivr.net/gh/phamdoanchiengroup-cloud/githubforclaude160695@c833aa220e53b38de4f026b699e832bb74b2ed85/webbongda/anh/match-day-luot2-v2.webp',
  '03/11/2026': 'https://cdn.jsdelivr.net/gh/phamdoanchiengroup-cloud/githubforclaude160695@c833aa220e53b38de4f026b699e832bb74b2ed85/webbongda/anh/match-day-luot3.webp'
};
/* Một ngày thi đấu được coi là KẾT THÚC khi mọi trận đã nhập tỷ số (Đã đá),
   hoặc đã quá giờ bóng lăn MD_HET_SAU_MS mà BTC chưa kịp nhập → web tự chuyển sang ngày (poster) kế tiếp. */
var MD_HET_SAU_MS = 3 * 60 * 60 * 1000;
var MD = { timer: null };
/* Màu ánh sáng của đội theo màu áo (Doi.MauAo) */
function mdMauDoi_(maDoi){
  var m = String((doiObj(maDoi) || {}).mauAo || '').toLowerCase();
  if (/đỏ|do\b/.test(m)) return '#e0313f';
  if (/xanh/.test(m)) return '#3d8bff';
  if (/xám|bạc|trắng/.test(m)) return '#b9c6d8';
  return '#f6c453';
}
/* Vẽ khung Match Day cho ngày thi đấu sắp tới. Không có trận sắp tới → trả false để dùng banner động. */
/* Dữ liệu ngày thi đấu sắp tới (dùng chung cho khung trang chủ và thanh gọn ở các tab khác). Không có → null */
function mdDuLieu_(){
  var d = STATE.data;
  var tran = (d.tranDau || []).map(function(t){ var o = {}; for (var k in t) o[k] = t[k]; o._d = bdGio_(t.gioThiDau); return o; })
    .filter(function(t){ return t._d && t.maDoiB; })
    .sort(function(a, b){ return a._d - b._d || (Number(a.thuTuKO) || 0) - (Number(b.thuTuKO) || 0); });
  var now = new Date();
  var sap = tran.filter(function(t){ return !bdDaDa_(t) && t._d.getTime() + MD_HET_SAU_MS > now.getTime(); })[0];
  if (!sap) return null;
  var luot = nhanLuot_(sap), so = luot.match(/(\d+)/);
  var ngayTxt = bdP2_(sap._d.getDate()) + '/' + bdP2_(sap._d.getMonth() + 1) + '/' + sap._d.getFullYear();
  return {
    tran: tran, sap: sap, luot: luot, ngayTxt: ngayTxt,
    ngay: tran.filter(function(t){ return t._d.toDateString() === sap._d.toDateString() && !bdDaDa_(t); }).slice(0, 2),
    giai: tran.filter(function(t){ return !laTranGiaoHuu_(t); }),
    luotTo: so ? 'LƯỢT ' + bdP2_(+so[1]) : String(luot).toUpperCase(),
    poster: MATCH_DAY_POSTER[ngayTxt] || driveImg(d.bannerUrl || BANNER_HEP_ID || '', 'w1600')
  };
}
/* Đồng hồ đếm ngược trong khung .md-dem[data-den] (1 đồng hồ mỗi trang) */
function mdChayDem_(dem){
  var chay = function(){
    if (!document.body.contains(dem)) { clearInterval(MD.timer); return; }
    var s = Math.max(0, Math.floor((+dem.getAttribute('data-den') - Date.now()) / 1000));
    dem.querySelector('[data-k=d]').textContent = bdP2_(Math.floor(s / 86400));
    dem.querySelector('[data-k=h]').textContent = bdP2_(Math.floor(s % 86400 / 3600));
    dem.querySelector('[data-k=m]').textContent = bdP2_(Math.floor(s % 3600 / 60));
    dem.querySelector('[data-k=s]').textContent = bdP2_(s % 60);
  };
  clearInterval(MD.timer); chay(); MD.timer = setInterval(chay, 1000);
}
function mdDemHtml_(sap){
  return '<div class="md-dem" data-den="' + sap._d.getTime() + '">'
    + '<div class="md-kinh"><b data-k="d">--</b><span>Ngày</span></div><div class="md-kinh"><b data-k="h">--</b><span>Giờ</span></div>'
    + '<div class="md-kinh"><b data-k="m">--</b><span>Phút</span></div><div class="md-kinh"><b data-k="s">--</b><span>Giây</span></div></div>';
}
/* Thanh Match Day gọn cho các tab không phải trang chủ */
function veThanhMatchDay_(el){
  var D = mdDuLieu_(); if (!D) return false;
  var lg = function(id){ var x = doiObj(id); return x && x.logoUrl ? '<img alt="" src="' + esc(driveImg(x.logoUrl)) + '">' : ''; };
  var ten = function(id){ var x = doiObj(id); return x ? tenDoiNgan_(x.tenDoi) : '?'; };
  el.className = 'md-wrap';
  el.innerHTML = '<div class="md-kinh mdb">'
    + (D.poster ? '<img class="mdb-poster" alt="Poster" src="' + esc(D.poster) + '" onclick="moAnhLon_(\'' + esc(D.poster) + '\')">' : '')
    + '<div class="mdb-tieu"><span class="md-hud-nhan">◇ Ngày thi đấu tiếp theo</span>'
    +   '<b><span class="md-bac">MATCH</span> <span class="md-kim">DAY</span> <span class="mdb-luot md-kim">' + esc(D.luotTo) + '</span></b>'
    +   '<span class="md-hud-nhan mo">' + BD_THU[D.sap._d.getDay()] + ' · ' + D.ngayTxt + '</span></div>'
    + '<div class="mdb-tran">' + D.ngay.map(function(t){
        return '<div class="mdb-cap" onclick="xemDoiHinhTran(\'' + t.maTran + '\')" title="Xem đội hình 2 đội">'
          + '<span class="mdb-doi">' + lg(t.maDoiA) + '<i>' + esc(ten(t.maDoiA)) + '</i></span>'
          + '<span class="mdb-gio md-kim">' + bdGioTxt_(t._d) + '</span>'
          + '<span class="mdb-doi">' + lg(t.maDoiB) + '<i>' + esc(ten(t.maDoiB)) + '</i></span></div>';
      }).join('') + '</div>'
    + mdDemHtml_(D.sap) + '</div>';
  mdChayDem_(el.querySelector('.md-dem'));
  return true;
}
function veMatchDay_(el){
  var D = mdDuLieu_(); if (!D) return false;
  var d = STATE.data, tran = D.tran, sap = D.sap, ngay = D.ngay, giai = D.giai;
  var luot = D.luot, luotTo = D.luotTo, ngayTxt = D.ngayTxt, poster = D.poster;
  var ten = function(id){ var x = doiObj(id); return x ? x.tenDoi : '?'; };
  var lg = function(id){ var x = doiObj(id); return x && x.logoUrl ? esc(driveImg(x.logoUrl)) : ''; };
  var dt = function(id){ var x = doiObj(id), c = x && x.doiTruong ? cauThuObj(x.doiTruong) : null; return c ? 'ĐT ' + c.hoTen : ''; };
  var gioChung = ngay.every(function(t){ return bdGioTxt_(t._d) === bdGioTxt_(sap._d); });

  var doiHtml = function(id, phai){
    return '<div class="md-doi' + (phai ? ' phai' : '') + '"><span class="md-logo" style="--beam:' + mdMauDoi_(id) + '">'
      + (lg(id) ? '<img alt="" src="' + lg(id) + '">' : '') + '</span>'
      + '<b>' + esc(ten(id)) + '<small>' + esc(dt(id)) + '</small></b></div>';
  };
  var tranHtml = function(t){
    var i = giai.indexOf(t);
    var nhan = t.vongDau === 'Chung kết' ? 'Chung kết' : laTranGiaoHuu_(t) ? 'Giao hữu' : 'Trận ' + bdP2_(i + 1);
    return '<div class="md-kinh md-tran" onclick="xemDoiHinhTran(\'' + t.maTran + '\')" title="Xem đội hình 2 đội">'
      + '<span class="md-so-tran md-hud-nhan">' + esc(nhan) + '</span>'
      + doiHtml(t.maDoiA, false)
      + '<div class="md-giua"><span class="md-gio md-kim">' + bdGioTxt_(t._d) + '</span><span class="md-vs">VS</span></div>'
      + doiHtml(t.maDoiB, true) + '</div>';
  };

  // Băng chạy: kết quả ngày đá gần nhất, vua phá lưới, đội dẫn đầu (lấy từ sheet)
  var tin = [];
  var daDa = tran.filter(bdDaDa_);
  if (daDa.length) {
    var cuoi = daDa[daDa.length - 1];
    daDa.filter(function(t){ return t._d.toDateString() === cuoi._d.toDateString(); }).forEach(function(t){
      tin.push(nhanLuot_(t) + ' · ' + ten(t.maDoiA) + ' ' + t.banThangA + ' – ' + t.banThangB + ' ' + ten(t.maDoiB));
    });
  }
  var demBan = {};
  suKienGiai_(['BAN']).forEach(function(x){ if (x.s.maCT) demBan[x.s.maCT] = (demBan[x.s.maCT] || 0) + 1; });
  var top = Object.keys(demBan).sort(function(a, b){ return demBan[b] - demBan[a]; });
  if (top.length && (top.length === 1 || demBan[top[0]] > demBan[top[1]])) {
    var c = cauThuObj(top[0]);
    if (c) tin.push(c.hoTen + ' dẫn đầu danh sách ghi bàn · ' + demBan[top[0]] + ' bàn');
  }
  var bxh = (d.bxh && d.bxh.TatCa) || [];
  if (bxh.length && bxh[0].st > 0 && (!bxh[1] || bxh[0].diem > bxh[1].diem)) tin.push(bxh[0].tenDoi + ' dẫn đầu bảng xếp hạng · ' + bxh[0].diem + ' điểm');
  var tinHtml = tin.map(function(s){ return '<span>' + esc(s) + '</span>'; }).join('');

  el.className = 'md-wrap';
  el.innerHTML = '<div class="md-hero">'
    + '<div class="md-may"><span class="md-goc a"></span><span class="md-goc b"></span><span class="md-goc c"></span><span class="md-goc d"></span>'
    +   (poster ? '<div class="md-poster" onclick="moAnhLon_(\'' + esc(poster) + '\')"><img alt="Poster ' + esc(luot) + '" src="' + esc(poster) + '"></div>' : '')
    +   '<div class="md-den"></div><div class="md-chu-anh md-hud-nhan mo">' + (MATCH_DAY_POSTER[ngayTxt] ? 'Poster chính thức · ' + esc(luot) : esc(d.tenGiai || '')) + '</div></div>'
    + '<div class="md-bang">'
    +   '<span class="md-hud-nhan">◇ ' + esc(d.tenGiai || '') + ' · ' + esc(String(sap.vongDau || '').toUpperCase()) + '</span>'
    +   '<h2 class="md-tieu"><span><span class="md-bac">MATCH</span> <span class="md-kim">DAY</span></span><span class="md-vien" data-chu="' + esc(luotTo) + '">' + esc(luotTo) + '</span></h2>'
    +   '<div class="md-chips"><span class="md-chip dam">' + BD_THU[sap._d.getDay()] + ' · ' + ngayTxt + '</span>'
    +     '<span class="md-chip">' + ngay.length + ' trận' + (gioChung ? ' · ' + bdGioTxt_(sap._d) : '') + (sap.sanDau ? ' · ' + esc(sap.sanDau) : '') + '</span></div>'
    +   ngay.map(tranHtml).join('')
    +   mdDemHtml_(sap)
    +   (VIDEO_GIOI_THIEU ? '<button type="button" class="btn neon md-video" onclick="moVideoGioiThieu()">▶ Xem video giới thiệu</button>' : '')
    + '</div></div>'
    + (tin.length ? '<div class="md-chay"><div class="md-ray">' + tinHtml + tinHtml + tinHtml + tinHtml + '</div></div>' : '');

  mdChayDem_(el.querySelector('.md-dem'));
  try { fxMatchDay_(el); } catch(e) {}
  return true;
}
/* Xem ảnh lớn (poster) trong khung xem của thư viện media */
function moAnhLon_(url){
  var lb = document.getElementById('mediaLightbox');
  if (!lb) {
    lb = document.createElement('div'); lb.id = 'mediaLightbox'; lb.className = 'media-lightbox';
    lb.onclick = function(e){ if (e.target === lb) closeMediaLightbox(); };
    document.body.appendChild(lb);
  }
  lb.innerHTML = '<button class="lb-close" onclick="closeMediaLightbox()">✕</button><div class="lb-content">'
    + '<img src="' + esc(url) + '" alt="" style="max-width:100%;max-height:86vh;display:block;margin:0 auto"></div>';
  lb.classList.add('show');
  document.addEventListener('keydown', escListenerLB_);
}

/* ===== HIỆU ỨNG 2026: hạt vàng (canvas nhẹ, tự dừng khi khung bị xóa hoặc khuất màn hình) ===== */
var FX_GIAM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
function fxHat_(cv, nen){
  if(!cv || FX_GIAM) return null;
  var ctx=cv.getContext('2d'), ds=[], W=0, H=0, dpr=Math.min(2,window.devicePixelRatio||1), thay=true;
  function co(){ var r=cv.getBoundingClientRect(); W=r.width; H=r.height; cv.width=Math.max(1,W*dpr); cv.height=Math.max(1,H*dpr); ctx.setTransform(dpr,0,0,dpr,0,0); }
  function them(x,y,vx,vy,s,song,g){ ds.push({x:x,y:y,vx:vx,vy:vy,s:s,song:song,g:g||0,t:0,mau:Math.random()<.7?'255,214,102':'255,159,46'}); }
  if('IntersectionObserver' in window){ new IntersectionObserver(function(es){ thay=es[0].isIntersecting; }).observe(cv); }
  function khung(){
    if(!document.body.contains(cv)) return;
    if(thay && !document.hidden){
      var r=cv.getBoundingClientRect(); if(Math.abs(r.width-W)>2 || Math.abs(r.height-H)>2) co();
      ctx.clearRect(0,0,W,H);
      for(var k=0;k<nen;k++) if(Math.random()<.5) them(Math.random()*W,H+4,(Math.random()-.5)*.3,-(.4+Math.random()*.9),1+Math.random()*2,240+Math.random()*200);
      for(var i=ds.length-1;i>=0;i--){ var p=ds[i]; p.t++; p.x+=p.vx+Math.sin((p.t+i)*.03)*.25; p.y+=p.vy; p.vy+=p.g; var a=1-p.t/p.song;
        if(a<=0||p.y<-10){ ds.splice(i,1); continue; }
        ctx.beginPath(); ctx.fillStyle='rgba('+p.mau+','+(a*.9)+')'; ctx.shadowColor='rgba(255,180,60,.9)'; ctx.shadowBlur=8; ctx.arc(p.x,p.y,p.s,0,6.283); ctx.fill(); }
    }
    requestAnimationFrame(khung);
  }
  co(); requestAnimationFrame(khung);
  return { bung:function(x,y,n,luc){ for(var i=0;i<n;i++){ var g=Math.random()*6.283, v=(.6+Math.random())*luc; them(x,y,Math.cos(g)*v,Math.sin(g)*v-1.2,1+Math.random()*2.4,70+Math.random()*60,.04); } } };
}
/* Sóng vàng tỏa ra từ chỗ bấm trên nút */
document.addEventListener('click', function(e){
  if(FX_GIAM) return;
  var b = e.target.closest && e.target.closest('.btn, nav.tabs button'); if(!b) return;
  var r=b.getBoundingClientRect(), g=document.createElement('span'), d=Math.max(r.width,r.height)*2.2;
  g.className='fx-gon'; g.style.width=g.style.height=d+'px'; g.style.left=(e.clientX-r.left)+'px'; g.style.top=(e.clientY-r.top)+'px';
  b.appendChild(g); setTimeout(function(){ if(g.parentNode) g.parentNode.removeChild(g); }, 750);
}, true);
/* Gắn đèn sân, hạt vàng, poster nghiêng theo chuột vào khung Match Day vừa vẽ */
function fxMatchDay_(el){
  var hero = el.querySelector('.md-hero'); if(!hero) return;
  hero.insertAdjacentHTML('afterbegin','<canvas class="fx-hat"></canvas><span class="md-chum t"></span><span class="md-chum p"></span>');
  fxHat_(hero.querySelector('canvas'), 2);
  var po = hero.querySelector('.md-poster'), img = po && po.querySelector('img');
  if(!po || !img || FX_GIAM) return;
  po.insertAdjacentHTML('beforeend','<span class="md-phan-chieu"></span>');
  hero.addEventListener('pointermove', function(e){
    if(e.pointerType!=='mouse') return;
    var r=po.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
    x=Math.max(-.6,Math.min(.6,x)); y=Math.max(-.6,Math.min(.6,y));
    img.style.transform='perspective(900px) rotateY('+(x*16)+'deg) rotateX('+(-y*10)+'deg)';
    po.style.setProperty('--px',(x+.5)*100+'%'); po.style.setProperty('--py',(y+.5)*100+'%');
  });
  hero.addEventListener('pointerleave', function(){ img.style.transform=''; });
}
/* Ghi bàn: lật thẻ người dẫn đầu (chỉ lần đầu mở trang), sau đó thẻ bồng bềnh + ánh kim lướt */
var FX_GBD_DA_MO = false;
function fxGhiBan_(){
  var the = document.querySelector('.gbd-the'); if(!the) return;
  if(!FX_GBD_DA_MO && !FX_GIAM){ FX_GBD_DA_MO = true; the.classList.add('mo'); }
}

/* Icon khối đặc cho thanh tab (SVG 24×24, màu theo chữ) */
var ICON_TAB = {
  home:'<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>',
  lich:'<path fill-rule="evenodd" d="M7 2h2v2h6V2h2v2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2V2zM5 9v11h14V9H5zm2 2h4v4H7v-4z"/>',
  hinh:'<circle cx="12" cy="7" r="3.2"/><circle cx="4.8" cy="9.2" r="2.3"/><circle cx="19.2" cy="9.2" r="2.3"/><path d="M5.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5z"/><path d="M.5 19c0-2.6 2-4.7 4.5-4.7.8 0 1.5.2 2.1.5A8 8 0 0 0 4.4 19z"/><path d="M23.5 19c0-2.6-2-4.7-4.5-4.7-.8 0-1.5.2-2.1.5a8 8 0 0 1 2.7 4.2z"/>',
  the:'<path fill-rule="evenodd" d="M4 3h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm4.5 4a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 17h8c0-2-1.8-3.2-4-3.2s-4 1.2-4 3.2zM14 8h6v2h-6zm0 4h6v2h-6z"/>',
  media:'<path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z"/>',
  dsdk:'<path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>',
  tran:'<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>',
  dangky:'<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>',
  live:'<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-2 14.5v-9l6 4.5-6 4.5z"/>',
  boc:'<path fill-rule="evenodd" d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm2.5 3a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm9 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM12 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM7.5 15a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm9 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>',
  caumau:'<path d="M16 3l5 3-2 4.5-2-1V21H7V9.5l-2 1L3 6l5-3c.5 1.5 2 2.5 4 2.5S15.5 4.5 16 3z"/>',
  mauao:'<path fill-rule="evenodd" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1 0 1.7-.8 1.7-1.7 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.8-1.7 1.7-1.7h1.9c3 0 5.5-2.5 5.5-5.5C22 6 17.5 2 12 2zM6.5 13a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>',
  livemau:'<path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z"/>',
  ql:'<path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.48.48 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2z"/>'
};
function iconTab_(k){ return ICON_TAB[k] ? '<svg class="tab-ic" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">' + ICON_TAB[k] + '</svg>' : ''; }

/* ================= RENDER KHUNG ================= */
function isAdmin(){return STATE.data&&STATE.data.admin;}

function render(){
  var d=STATE.data;
  $('subline').textContent=(d.doi.length)+' đội · '+(d.cauThu.length)+' cầu thủ';

  var oldBanner=document.getElementById('bannerWrap');
  if(oldBanner) oldBanner.remove();
  var oldHero2=document.getElementById('heroWrap');
  if(oldHero2) oldHero2.remove();
  if($('hero')) $('hero').innerHTML='';

 // ⭐ Tất cả các tab dùng CHUNG 1 nguồn: d.bannerUrl (từ Sheet)
// ⭐ Banner động (tự chạy các cảnh, dữ liệu từ Sheet) thay cho ảnh banner tĩnh
{
  var appEl=$('app');
  var bannerWrap=document.createElement('div');
  bannerWrap.id='bannerWrap';
  appEl.insertBefore(bannerWrap, appEl.firstChild);
  var oldNen=document.getElementById('nenDau'); if(oldNen) oldNen.remove();
  var nenDau=document.createElement('div'); nenDau.id='nenDau'; nenDau.className='nen-dau';
  appEl.insertBefore(nenDau, bannerWrap);
  try {
    // Mọi tab: khung Match Day lớn (poster + 2 trận + đếm ngược) giống trang chủ. Hết trận sắp tới: về banner động.
    // (Thanh gọn veThanhMatchDay_ vẫn giữ trong mã nếu sau này muốn dùng lại.)
    if(!veMatchDay_(bannerWrap)) veBannerDong(bannerWrap);
  }
  catch(e){   // lỗi gì thì quay về ảnh banner cũ, không làm hỏng trang
    var bannerUrl_ = d.bannerUrl || BANNER_HEP_ID || '';
    bannerWrap.className='banner-hep';
    bannerWrap.innerHTML = bannerUrl_ ? '<img src="'+driveImg(bannerUrl_, 'w1600')+'" onerror="this.parentNode.style.display=\'none\'">' : '';
  }
}

  $('authBox').innerHTML = isAdmin()
    ? '<button class="btn ghost sm" onclick="doLogout()">Đăng xuất BTC</button>'
    : '<button class="btn neon sm" onclick="openModal(\'mLogin\')">🔐 BTC</button>';

  $('adminbar').innerHTML = isAdmin()
    ? '<div class="adminbar"><span>🛠️ Chế độ ban tổ chức — có thể chia đội, cập nhật tỷ số, nhập sự kiện</span></div>'
    : '';

 var tabs=[
    ['home','Trang chủ'],
    ['lich','Lịch & KQ'],
    ['hinh','Đội hình'],
    ['the','Thẻ cầu thủ'],
    ['media','Hình ảnh'],
    ['dsdk','Danh sách ĐK']
  ];
    if(isAdmin()){
    tabs.push(['tran','Trận đặc biệt']);
    tabs.push(['dangky','Đăng ký']);
    tabs.push(['live','Live bốc thăm']);
    tabs.push(['boc','Bốc thăm']);
    tabs.push(['caumau','Cấu hình áo']);
    tabs.push(['mauao','Gán màu áo']);
    tabs.push(['livemau','Live bốc màu']);
    tabs.push(['ql','Quản lý']);
  }
  $('tabs').innerHTML=tabs.map(function(t){
    return '<button class="'+(STATE.tab===t[0]?'on':'')+'" onclick="setTab(\''+t[0]+'\')">'+iconTab_(t[0])+'<span>'+t[1]+'</span></button>';
  }).join('');

  renderView();
}
function setTab(t){
  // Nếu rời khỏi tab cấu hình màu → giữ temp (không xóa)
  // Chỉ xóa khi cố tình thoát
  STATE.tab=t;
  render();
}

function renderView(){
  var t = STATE.tab;
  if(t==='ko'||t==='doi'||t==='thuong'||t==='dt'||t==='tk'||t==='bxh') t = STATE.tab = 'home';
  if(t==='dangky' && !isAdmin()) t = STATE.tab = 'home';

  // Gọi view function (view function tự set $('view').innerHTML)
  if(t==='home')            viewHome();
  else if(t==='the')        viewTheCauThu();
  else if(t==='hinh')       viewDoiHinh();
  else if(t==='media')      viewMedia();
  else if(t==='lich')       viewLich();
  else if(t==='dsdk')       viewDanhSachDK();
  else if(t==='tran' && isAdmin()) viewTranDacBiet();
  else if(t==='dangky')     viewDangKy();
  else if(t==='live')       viewLive();
  else if(t==='mauao')      viewGanMauAo();
  else if(t==='livemau')    viewLiveMau();
  else if(t==='caumau')     viewCauHinhMauAo();
  else if(t==='uv')         viewUngVien();
  else if(t==='vt')         viewHatGiong();
  else if(t==='ql')         viewQL();
  else                      viewHome();

  // ⭐ Bọc lại thành lưới 7/3 cho mọi tab TRỪ home và hinh
  //   (home và hinh tự đã có layout 2 cột riêng)
  if(t !== 'home' && t !== 'hinh'){
    var view = $('view');
    var inner = view.innerHTML;
    view.innerHTML =
      '<div class="home-2col">'
      +   '<div class="home-col-left">'  + inner                   + '</div>'
      +   '<div class="home-col-right">' + sidebarChungHtml_()    + '</div>'
      + '</div>';
  }
}

/* ================= VIEW: TRANG CHỦ ================= */
function viewHome(){
  var d=STATE.data;
  var doiGiai = d.doi.filter(function(t){ return String(t.loaiDoi||'').toUpperCase()!=='GH'; });
  var ghTeamsHome = d.doi.filter(function(t){ return String(t.loaiDoi||'').toUpperCase()==='GH'; });
  var h='';

  // ⭐ Bố cục 2 cột: trái 70% (kết quả · BXH · các đội) — phải 30% (lịch sắp tới · ghi bàn · thẻ)
  h+='<div class="home-2col trang-chu">';

  // ===== CỘT TRÁI =====
  h+='<div class="home-col-left">';
  if(isAdmin()){
    h+='<button class="btn neon block" style="font-size:19px;padding:18px;margin-bottom:16px;letter-spacing:.5px" '
      +'onclick="setTab(\'dangky\')">📝 MỞ FORM ĐĂNG KÝ (BTC)</button>';
  }
  h+=homeSoLieuHtml_(doiGiai);
  h+=homeKetQuaHtml_();
  h+=bxhCardHtml_(false);

  // Các đội (bấm logo xem danh sách cầu thủ)
  if(ghTeamsHome.length || doiGiai.length){
    h+='<div class="card home-doi"><h2>👥 Các đội</h2>'
      +'<p class="muted" style="font-size:12.5px;margin:-8px 0 14px">'
      +  'Bấm vào <b style="color:var(--neon)">logo đội</b> để xem danh sách cầu thủ.'
      +'</p>'
      +'<div class="team-logo-row">';
    doiGiai.concat(ghTeamsHome).forEach(function(team){
      var gh=String(team.loaiDoi||'').toUpperCase()==='GH';
      var n=cauThuTrongDoi(team.maDoi, !gh).length;
      h+='<div class="team-logo-item" onclick="modalDoiCauThu(\''+team.maDoi+'\')">'
        +logoDoiHtml(team.maDoi,84)
        +'<div class="tl-name">'+esc(team.tenDoi)+'</div>'
        +'<div class="tl-count">'+n+' cầu thủ</div>'
        +(gh?'<span class="gh-badge" style="position:absolute;top:8px;right:8px;font-size:9px;padding:2px 7px">GH</span>':'')
        +'</div>';
    });
    h+='</div></div>';
  }

  // Cơ cấu giải thưởng (ảnh BTC thiết kế) — cuối cột trái
  if(GIAI_THUONG_IMG){
    h+='<div class="banner-left giaithuong-home">'
      +'<img src="'+esc(driveImg(GIAI_THUONG_IMG))+'" alt="Cơ cấu giải thưởng" '
      +'onerror="this.parentNode.style.display=\'none\'"></div>';
  }
  h+='</div>'; // Đóng cột trái

  // ===== CỘT PHẢI =====
  h+='<div class="home-col-right">';
  // Lịch thi đấu sắp tới (trận đã đá nằm ở "Kết quả trận đấu" bên trái)
  // trận chưa đá và chưa qua ngày (trận cũ chưa nhập tỷ số thì không hiện ở đây)
  var homNay=new Date(); homNay.setHours(0,0,0,0);
  var sapToi=(d.tranDau||[]).filter(function(t){ var g=bdGio_(t.gioThiDau); return !tranDaDa_(t) && (!g || g>=homNay); });
  h+='<div class="card"><h2>📅 Lịch sắp tới</h2>';
  if(sapToi.length){
    h+='<p class="muted" style="font-size:12px;margin:-8px 0 12px">'
      +  'Bấm vào <b style="color:var(--neon)">trận đấu</b> để xem đội hình 2 đội.'
      +'</p>';
    h+=lichGonHtml_(sapToi);
  } else {
    h+='<div class="empty">'+((d.tranDau||[]).length?'Đã đá hết các trận.':'Chưa có trận đấu.')+'</div>';
  }
  h+='</div>';
  h+=homeGhiBanHtml_();
  h+=homeTheHtml_();
  h+='</div>'; // Đóng cột phải

  h+='</div>'; // Đóng .home-2col

  $('view').innerHTML=h;
  try { fxGhiBan_(); } catch(e) {}
}
/* ============================================================
   SIDEBAR CHUNG — hiển thị ở cột phải của MỌI tab (trừ home/hinh)
   Gồm: BXH gọn + Lịch thi đấu
   ============================================================ */
  function sidebarChungHtml_(){
  var d = STATE.data;
  var h = '';

  // BXH gọn
  h += bxhCardHtml_(true);

  // Lịch thi đấu
  if(d.tranDau && d.tranDau.length){
    h += '<div class="card"><h2>📅 Lịch thi đấu</h2>';
    var vt = d.tranDau.filter(function(t){ return t.vongDau !== 'Chung kết'; });
    var ck = d.tranDau.filter(function(t){ return t.vongDau === 'Chung kết'; });
    vt.sort(function(a,b){ return (Number(a.thuTuKO)||0) - (Number(b.thuTuKO)||0); });
    vt.concat(ck).forEach(function(m){ h += matchRow(m, true); });          // ⭐ đổi dòng này
    h += '</div>';
  } else {
    h += '<div class="card"><h2>📅 Lịch thi đấu</h2>'
      +  '<div class="empty">Chưa có trận đấu.</div></div>';
  }

  return h;
}


// Load top ghi bàn + top thẻ cho trang chủ
function loadHomeTop(){
  srv('thongKe',[STATE.token]).then(function(r){
    var box = $('homeTopBox');
    if(!box) return;
    if(!r || !r.ok){
      box.innerHTML = '<h2>⚽ Top ghi bàn</h2><div class="muted">Không tải được.</div>';
      return;
    }
    var h = '';
    // Top ghi bàn
    h += '<div class="card"><h2>⚽ Vua phá lưới</h2>';
    if(!r.vuaPhaLuoi.length){
      h += '<div class="muted">Chưa có bàn thắng.</div>';
    } else {
      r.vuaPhaLuoi.slice(0,5).forEach(function(p,i){
        h += '<div class="scorer-row'+(i===0?' top1':i===1?' top2':i===2?' top3':'')+'">'
          +'<div class="rank">'+(i+1)+'</div>'
          +'<div class="info"><div class="name">'+esc(p.hoTen)+'</div>'
          +'<div class="sub">'+esc(tenDoi(p.maDoi))+'</div></div>'
          +'<div class="val">'+p.soLuong+'</div></div>';
      });
    }
    h += '</div>';
    // Top thẻ vàng
    h += '<div class="card"><h2>🟨 Thẻ vàng nhiều nhất</h2>';
    if(!r.theVang.length){
      h += '<div class="muted">Chưa có thẻ vàng.</div>';
    } else {
      r.theVang.slice(0,3).forEach(function(p,i){
        h += '<div class="scorer-row">'
          +'<div class="rank" style="background:rgba(255,214,10,.2);color:#fbbf24">'+(i+1)+'</div>'
          +'<div class="info"><div class="name">'+esc(p.hoTen)+'</div>'
          +'<div class="sub">'+esc(tenDoi(p.maDoi))+'</div></div>'
          +'<div class="val" style="color:var(--vang)">'+p.soLuong+'</div></div>';
      });
    }
    h += '</div>';
    // Top thẻ đỏ
    if(r.theDo && r.theDo.length){
      h += '<div class="card"><h2>🟥 Thẻ đỏ</h2>';
      r.theDo.slice(0,3).forEach(function(p,i){
        h += '<div class="scorer-row">'
          +'<div class="rank" style="background:rgba(239,68,68,.2);color:#f87171">'+(i+1)+'</div>'
          +'<div class="info"><div class="name">'+esc(p.hoTen)+'</div>'
          +'<div class="sub">'+esc(tenDoi(p.maDoi))+'</div></div>'
          +'<div class="val" style="color:var(--do)">'+p.soLuong+'</div></div>';
      });
      h += '</div>';
    }
    box.outerHTML = h;
  });
}

/* ================= THẺ CẦU THỦ FIFA ================= */
function viTriChinh_(c){
  var vl = String(c.viTriList || '').toUpperCase().split(',').filter(function(v){return v;});
  if (!vl.length) return '';
  var uuTien = ['TM','TD','TV','HVTT','HVCT'];
  for (var i=0;i<uuTien.length;i++){
    if (vl.indexOf(uuTien[i])>=0) return uuTien[i];
  }
  return vl[0];
}
function posShortThe_(v){
  return ({TM:'GK',HVTT:'CB',HVCT:'LB',TV:'CM',TD:'ST'})[v] || 'ST';
}
function tenDaiClass_(ten){
  var n = String(ten||'').trim().length;
  if (n >= 20) return 'len-20';
  if (n >= 16) return 'len-16';
  if (n >= 13) return 'len-13';
  return '';
}
/* Vạch kẻ sân 3D */
function pitch3dMarkings_(horiz){
  return '<div class="p3ln mid"></div><div class="p3circle"></div><div class="p3spot"></div>'
    + '<div class="p3box t"></div><div class="p3box b"></div>'
    + (horiz ? '' : '<div class="p3goal t"><div class="net"></div></div><div class="p3goal b"><div class="net"></div></div>');
}
/* 1 ô vị trí trên sân 3D (thẻ đứng thẳng + bóng đổ + nhãn) */
function slot3dHtml_(i, x, y, c, isCap, label, clickable, uuTienDoiGoc){
  var inner = c ? miniCardHtml_(c, isCap, uuTienDoiGoc) : '<div class="avt3d">+</div>';
  var cls = 'pos-slot' + (c ? '' : ' empty');
  var attrs = clickable ? (' data-slot="'+i+'" onclick="clickSlot('+i+')"') : '';
  return '<div class="'+cls+'"'+attrs+' style="left:'+x+'%;top:'+y+'%">'
    + '<div class="p3d-shadow"></div>'
    + '<div class="p3d-stand">'+inner+'</div>'
    + '<div class="p3d-lab">'+esc(label)+'</div></div>';
}
/* Khung viền riêng của cầu thủ (đội giao hữu có khung thẻ riêng).
   uuTienDoiGoc = true → dùng maDoiGoc (để thẻ trong danh sách đội chính
   vẫn hiện khung của đội chính, không phải khung GH). */
function khungCuaCauThu_(c, uuTienDoiGoc){
  if(!c) return '';
  var maDoiDung = c.maDoi;
  if(uuTienDoiGoc && c.maDoiGoc) maDoiDung = c.maDoiGoc;
  if(!maDoiDung) return '';
  var t = doiObj(maDoiDung);
  // ⭐ Mọi đội có khungThe đều dùng — không chỉ GH
  if(t && t.khungThe){
    return driveImg(t.khungThe);
  }
  return '';
}
/* Thẻ mini trên sân (đội hình) — ảnh, rating, vị trí, logo, SỐ ÁO, tên */
/* Thẻ mini trên sân (đội hình) — ảnh, rating, vị trí, logo, SỐ ÁO, tên */
function miniCardHtml_(c, isCap, uuTienDoiGoc){
  var loaiThe = String(c.loaiThe||'').toLowerCase();
  if(['bac','vang','kimcuong','huyenthoai'].indexOf(loaiThe) < 0){
    loaiThe = (String(c.hatGiong||'').toUpperCase()==='BIET') ? 'vang' : 'bac';
  }
  var rating = Number(c.rating) || 80;
  var posShort = posShortThe_(viTriChinh_(c));
  var photoHtml = c.anhUrl
    ? '<img src="'+esc(driveImg(c.anhUrl))+'" alt="" '
      +'onerror="this.outerHTML=\'<div class=&quot;ph&quot;>'
      +esc((c.hoTen||'?').slice(0,1).toUpperCase())+'</div>\'">'
    : '<div class="ph">'+esc((c.hoTen||'?').slice(0,1).toUpperCase())+'</div>';
  // ⭐ Logo: ưu tiên đội gốc nếu được yêu cầu
  var maDoiDung = (uuTienDoiGoc && c.maDoiGoc) ? c.maDoiGoc : c.maDoi;
  var d = doiObj(maDoiDung);
  var logoHtml = '?';
  if(d){
    logoHtml = d.logoUrl
      ? '<img src="'+esc(driveImg(d.logoUrl))+'" alt="" '
        +'onerror="this.outerHTML=\''+esc((d.tenDoi||'?').slice(0,2).toUpperCase())+'\'">'
      : esc((d.tenDoi||'?').slice(0,2).toUpperCase());
  }
  // ⭐ Nhãn GH nếu đang mượn ở GH
  var ghBadge = '';
  if (c.maDoiGoc && c.maDoi && c.maDoi !== c.maDoiGoc) {
    var _doiHT = doiObj(c.maDoi);
    if (_doiHT && String(_doiHT.loaiDoi||'').toUpperCase() === 'GH') {
      ghBadge = '<div style="position:absolute;top:2px;left:2px;background:#fde047;color:#1a0520;font-family:Oswald;font-size:7px;font-weight:900;padding:1px 4px;border-radius:3px;z-index:6">GH</div>';
    }
  }

  var tenFull = String(c.hoTen||'').trim();
  var parts = tenFull.split(/\s+/);
  var tenNgan = parts.length >= 2 ? parts.slice(-2).join(' ') : tenFull;
  var soAoHtml = c.soAo ? '<div class="so">'+esc(c.soAo)+'</div>' : '';
  var _kh = khungCuaCauThu_(c, uuTienDoiGoc);
  var frStyle = _kh ? ' style="--fr:url(\''+esc(_kh)+'\')"' : '';
  return '<div class="mini-card '+loaiThe+(isCap?' cap':'')+'"'+frStyle+'>'
    + ghBadge
    + photoHtml
    + '<div class="rt">'+rating+'</div>'
    + '<div class="pt">'+posShort+'</div>'
    + '<div class="lg">'+logoHtml+'</div>'
    + soAoHtml
    + '<div class="nm-bar">'+esc(tenNgan)+'</div>'
    + '</div>';
}
/* ============================================================
   HELPERS CHO MODAL ĐỘI HÌNH 2 ĐỘI (thiết kế mới)
   ============================================================ */
function thvSlotHtml_(x, y, c, isCap, label, uuTienDoiGoc){
  var inner;
  if(c){
    inner = thvCardHtml_(c, isCap, uuTienDoiGoc);
  } else {
    inner = '<div class="thv-empty">+</div>';
  }
  return '<div class="thv-slot" style="left:'+x.toFixed(2)+'%;top:'+y.toFixed(2)+'%">'
    + inner
    + '<div class="thv-label">'+esc(label)+'</div>'
    + '</div>';
}

function thvCardHtml_(c, isCap, uuTienDoiGoc){
  /* Loại thẻ */
  var loai = String(c.loaiThe||'').toLowerCase();
  if(['bac','vang','kimcuong','huyenthoai'].indexOf(loai) < 0){
    loai = (String(c.hatGiong||'').toUpperCase()==='BIET') ? 'vang' : 'bac';
  }

    /* Khung riêng của đội (nếu có) */
  var _kh = khungCuaCauThu_(c, uuTienDoiGoc);
  var frStyle = _kh ? ' style="--fr:url(\''+esc(_kh)+'\')"' : '';
  var frClass = _kh ? ' has-fr' : '';      // ⭐ THÊM DÒNG NÀY

    // ⭐ Biến scale + position riêng cho từng người
  var scVal = Number(c.anhScale) || 1;
  var yVal = Number(c.anhY) || 0;
  var imgStyle = '';
  if(scVal !== 1) imgStyle += '--anh-sc:'+scVal+';';
  if(yVal !== 0) imgStyle += '--anh-y:'+yVal+'%;';
  var imgStyleAttr = imgStyle ? ' style="'+imgStyle+'"' : '';

    var maDoiHien2_ = (uuTienDoiGoc && c.maDoiGoc) ? c.maDoiGoc : c.maDoi;
  var anhDung2_ = anhCuaCauThu_(c, maDoiHien2_);
  var avt = anhDung2_
    ? '<img src="'+esc(driveImg(anhDung2_))+'" alt=""'+imgStyleAttr+' '
      + 'onerror="this.outerHTML=\'<span>'+esc((c.hoTen||'?').slice(0,1).toUpperCase())+'</span>\'">'
    : esc((c.hoTen||'?').slice(0,1).toUpperCase());

  var rating = Number(c.rating) || 80;
  var posShort = posShortThe_(viTriChinh_(c));

  var maDoiDung = (uuTienDoiGoc && c.maDoiGoc) ? c.maDoiGoc : c.maDoi;
  var d = doiObj(maDoiDung);
  var lg = '';
  if(d){
    lg = d.logoUrl
      ? '<img src="'+esc(driveImg(d.logoUrl))+'" alt="" '
        + 'onerror="this.outerHTML=\''+esc((d.tenDoi||'?').slice(0,2).toUpperCase())+'\'">'
      : esc((d.tenDoi||'?').slice(0,2).toUpperCase());
  }

    var parts = String(c.hoTen||'').trim().split(/\s+/);
  var tenNgan = parts.length >= 2 ? parts.slice(-2).join(' ') : (c.hoTen||'');
  var soAo = c.soAo ? '<div class="thv-so">'+esc(c.soAo)+'</div>' : '';

  // ⭐ Tự co font-size theo độ dài tên — tránh xuống dòng / tràn
  var _tenLen = tenNgan.length;
  var _fsCoef;
  if(_tenLen > 20)      _fsCoef = 0.080;   // rất dài (KIERAN TRƯỢNGPIER)
  else if(_tenLen > 17) _fsCoef = 0.092;   // dài (DŨNGEGO COSTA)
  else if(_tenLen > 14) _fsCoef = 0.105;   // vừa (THUỜNGRY HENRY)
  else if(_tenLen > 11) _fsCoef = 0.115;   // ngắn (THINHAGO MOTTA)
  else                  _fsCoef = 0.125;   // rất ngắn (LAMINE YAHUNG)

  return '<div class="thv-card '+loai+frClass+'"'+frStyle
    + ' onclick="event.stopPropagation();xemTheTo(\''+c.maCT+'\','+(uuTienDoiGoc?1:0)+')">'
    + '<div class="thv-avt">'+avt+'</div>'
    + '<div class="thv-rt">'+rating+'</div>'
    + soAo
    + '<div class="thv-nm" style="font-size:calc(var(--S) * '+_fsCoef+')">'+esc(tenNgan)+'</div>'
    + '</div>';
}
/* ⭐ Trả về ảnh phù hợp với đội đang hiển thị:
   - Nếu có ảnh override cho maDoiHien → dùng ảnh đó
   - Không thì dùng ảnh gốc */
function anhCuaCauThu_(c, maDoiHien){
  if (!c) return '';
  if (c.anhTheoDoi && maDoiHien && c.anhTheoDoi[maDoiHien]){
    return c.anhTheoDoi[maDoiHien];
  }
  return c.anhUrl || '';
}
function renderTheFifa(c, uuTienDoiGoc){
  var loai = String(c.loaiThe || '').toLowerCase();
  if (['bac','vang','kimcuong','huyenthoai'].indexOf(loai) < 0) {
    loai = (String(c.hatGiong||'').toUpperCase()==='BIET') ? 'vang' : 'bac';
  }
  // ⭐ Nhãn GH
  var ghBadge = '';
  if (c.maDoiGoc && c.maDoi && c.maDoi !== c.maDoiGoc) {
    var _doiHienTai = doiObj(c.maDoi);
    if (_doiHienTai && String(_doiHienTai.loaiDoi||'').toUpperCase() === 'GH') {
      ghBadge = '<div class="gh-badge" style="position:absolute;top:4px;left:4px;z-index:8;background:#fde047;color:#1a0520;font-family:Oswald;font-size:9px;font-weight:900;padding:2px 6px;border-radius:4px;letter-spacing:.5px">GH</div>';
    }
  }
  var isLegend = (loai === 'huyenthoai');
  var cs = c.chiSo || {};
  function soAnToan_(v){
    var n = Number(v);
    return (isFinite(n) && n > 0) ? n : 75;
  }
  cs = {
    PAC: soAnToan_(cs.PAC), SHO: soAnToan_(cs.SHO), PAS: soAnToan_(cs.PAS),
    DRI: soAnToan_(cs.DRI), DEF: soAnToan_(cs.DEF), PHY: soAnToan_(cs.PHY)
  };
  var rating = Number(c.rating);
  if (!isFinite(rating) || rating <= 0) rating = 80;
  var pos = viTriChinh_(c);
  var posShort = posShortThe_(pos);

  // ⭐ Logo CLB: ưu tiên đội gốc nếu được yêu cầu
  var maDoiDung = (uuTienDoiGoc && c.maDoiGoc) ? c.maDoiGoc : c.maDoi;
  var clubLogo = '';
  if (maDoiDung) {
    var _d = doiObj(maDoiDung);
    var _ten = _d ? _d.tenDoi : '?';
    var _logo = _d ? _d.logoUrl : '';
    if (_logo) {
      clubLogo = '<img src="'+esc(driveImg(_logo))+'" alt="" '
        +'onerror="this.outerHTML=\'<span style=&quot;font-size:11px;font-weight:900&quot;>'+esc((_ten||'?').slice(0,2).toUpperCase())+'</span>\'">';
    } else {
      clubLogo = esc((_ten||'?').slice(0,2).toUpperCase());
    }
  } else {
    clubLogo = '?';
  }

    var maDoiHien = (uuTienDoiGoc && c.maDoiGoc) ? c.maDoiGoc : c.maDoi;
  var anhDung = anhCuaCauThu_(c, maDoiHien);

  var photoHtml;
  if (anhDung) {
    // ⭐ Biến scale + position riêng cho từng người
    var scVal = Number(c.anhScale) || 1;
    var yVal = Number(c.anhY) || 0;
    var imgStyle = '';
    if(scVal !== 1) imgStyle += '--anh-sc:'+scVal+';';
    if(yVal !== 0) imgStyle += '--anh-y:'+yVal+'%;';
    var imgStyleAttr = imgStyle ? ' style="'+imgStyle+'"' : '';

        photoHtml = '<img src="'+esc(driveImg(anhDung))+'" alt=""'+imgStyleAttr+' '
      + 'onerror="this.style.display=\'none\';this.parentNode.classList.add(\'empty\')">'
      + '<button class="xoa-anh" style="position:absolute;top:4px;right:4px;width:20px;height:20px;border-radius:50%;background:rgba(239,68,68,.9);color:#fff;font-size:12px;font-weight:800;border:0;cursor:pointer;display:none;align-items:center;justify-content:center;z-index:5;line-height:1" onclick="event.stopPropagation();xoaAnhThe(\''+c.maCT+'\')">×</button>';
  } else {
    photoHtml = '<div class="placeholder"><div class="icon">🖼️</div><div>CHỌN ẢNH</div></div>';
  }

  var soAoHtml = '';
  if (isAdmin()) {
    soAoHtml = '<div class="fc-soao" onclick="event.stopPropagation();suaSoAoThe(\''+c.maCT+'\')" title="Bấm để nhập số áo">'
      + (c.soAo ? esc(c.soAo) : '+') + '</div>';
  } else if (c.soAo) {
    soAoHtml = '<div class="fc-soao">'+esc(c.soAo)+'</div>';
  }

  var _kh = khungCuaCauThu_(c, uuTienDoiGoc);
  var frameImg = _kh
    ? '<div class="frame-image" style="background-image:url(\''+esc(_kh)+'\')"></div>'
    : '<div class="frame-image"></div>';
  // ⭐ Mọi loại thẻ dùng chung: Aurora chậm 15s + Tia sáng quét
  var legendLayers = '<div class="halo"></div>' + frameImg + '<div class="shine"></div>';

  return '<div class="futc '+loai+'" data-id="'+c.maCT+'" onclick="xemTheTo(\''+c.maCT+'\','+(uuTienDoiGoc?1:0)+')">'
    + ghBadge
    + soAoHtml
    + legendLayers
    + '<div class="body">'
    +   (c.doiTruong ? '<div class="cap-badge">👑 ĐT</div>' : '')
    +   '<div class="header">'
    +     '<div class="head-left">'
    +       '<div class="rating'+(isAdmin()?' editable':'')+'" '
    +         (isAdmin()?'onclick="event.stopPropagation();suaRating(\''+c.maCT+'\',this)"':'')+'>'
    +         rating+'</div>'
    +       '<div class="pos-tag'+(isAdmin()?' editable':'')+'" '
    +         (isAdmin()?'onclick="event.stopPropagation();suaViTriChinh(\''+c.maCT+'\',this)"':'')+'>'
    +         posShort+'</div>'
    +     '</div>'
    +   '</div>'
    +   '<div class="photo-wrap">'
    +     '<div class="photo-zone" onclick="event.stopPropagation();chonAnhThe(\''+c.maCT+'\')">'
    +       photoHtml
    +       '<input type="file" accept="image/*" id="file-the-'+c.maCT+'" onchange="uploadAnhThe(\''+c.maCT+'\',this)" style="display:none">'
    +     '</div>'
    +   '</div>'
    +   '<div class="name-bar"><div class="name '+tenDaiClass_(c.hoTen)+'">'+esc(c.hoTen)+'</div></div>'
    +   '<div class="h-divider"></div>'
    +   '<div class="stats">'
    +     statRow_('PAC', cs.PAC, c.maCT)
    +     statRow_('DRI', cs.DRI, c.maCT)
    +     statRow_('SHO', cs.SHO, c.maCT)
    +     statRow_('PAS', cs.PAS, c.maCT)
    +     statRow_('DEF', cs.DEF, c.maCT)
    +     statRow_('PHY', cs.PHY, c.maCT)
    +   '</div>'
    + '</div>'
    + '</div>';
}
/* ⭐ Đổi ảnh riêng cho đội GH — chỉ áp dụng khi xem trong đội đó */
function doiAnhTheoDoi(maCT, maDoi, tenDoi){
  if(!isAdmin()){ toast('Chỉ BTC','err'); return; }
  var c = cauThuObj(maCT);
  if(!c) return;
  var cur = (c.anhTheoDoi && c.anhTheoDoi[maDoi]) || '';

  $('mGenericBox').innerHTML =
      '<h2 style="margin:0 0 12px;font-size:20px;font-family:var(--ff-title);'
    + 'letter-spacing:1px;color:var(--cam2)">🖼️ ẢNH RIÊNG CHO ĐỘI</h2>'
    + '<p class="muted" style="margin-bottom:14px;font-size:13px">'
    + 'Ảnh này chỉ dùng khi hiển thị trong đội <b style="color:var(--cam2)">'
    + esc(tenDoi) + '</b>. Đội gốc vẫn dùng ảnh cũ.'
    + '</p>'
    + '<div style="display:flex;gap:10px;margin-bottom:14px">'
    +   '<button class="btn neon block" onclick="chonFileAnhTheoDoi(\''+maCT+'\',\''+maDoi+'\')">'
    +     '📁 Tải ảnh lên'
    +   '</button>'
    +   '<button class="btn cam block" onclick="danLinkAnhTheoDoi(\''+maCT+'\',\''+maDoi+'\')">'
    +     '🔗 Dán link Drive'
    +   '</button>'
    + '</div>'
    + '<input type="file" id="file-theo-doi-'+maCT+'" accept="image/*" '
    +   'onchange="uploadAnhTheoDoi(\''+maCT+'\',\''+maDoi+'\',this)" style="display:none">'
    + '<button class="btn outline block" onclick="xemTheTo(\''+maCT+'\',0)">← Quay lại</button>';
  openModal('mGeneric');
}

function chonFileAnhTheoDoi(maCT, maDoi){
  var inp = document.getElementById('file-theo-doi-'+maCT);
  if(inp) inp.click();
}

function danLinkAnhTheoDoi(maCT, maDoi){
  var c = cauThuObj(maCT);
  var cur = (c.anhTheoDoi && c.anhTheoDoi[maDoi]) || '';
  var url = prompt('Dán link ảnh Drive/Imgur cho đội này:\n(để trống + OK = xóa)', cur);
  if(url === null) return;
  url = url.trim();
  srv('capNhatAnhTheoDoi', [STATE.token, maCT, maDoi, url]).then(function(r){
    toast((r&&r.msg)||'Xong', r&&r.ok?'ok':'err');
    if(r && r.ok) tai();
  });
}

function uploadAnhTheoDoi(maCT, maDoi, inp){
  var f = inp.files && inp.files[0];
  if(!f) return;
  var reader = new FileReader();
  reader.onload = function(ev){
    var img = new Image();
    img.onload = function(){
      var W = 300, H = 400;
      var canvas = document.createElement('canvas');
      canvas.width = W; canvas.height = H;
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = '#0a0e1a';
      ctx.fillRect(0,0,W,H);
      var srcW = img.width, srcH = img.height;
      var scale = Math.max(W/srcW, H/srcH);
      ctx.drawImage(img, (W-srcW*scale)/2, (H-srcH*scale)/2, srcW*scale, srcH*scale);
      var dataUrl = canvas.toDataURL('image/jpeg', 0.75);
      srv('capNhatAnhTheoDoi', [STATE.token, maCT, maDoi, dataUrl]).then(function(r){
        toast((r&&r.msg)||'Xong', r&&r.ok?'ok':'err');
        if(r && r.ok) tai();
      });
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(f);
}

function xoaAnhTheoDoi(maCT, maDoi){
  if(!confirm('Xóa ảnh riêng cho đội này? Sẽ dùng lại ảnh gốc.')) return;
  srv('capNhatAnhTheoDoi', [STATE.token, maCT, maDoi, '']).then(function(r){
    toast((r&&r.msg)||'Xong', r&&r.ok?'ok':'err');
    if(r && r.ok){ closeModal('mGeneric'); tai(); }
  });
}
function xemTheTo(maCT, uuTienDoiGoc){
  var c = cauThuObj(maCT);
  if (!c) return;
  var maDoiHien = (uuTienDoiGoc && c.maDoiGoc) ? c.maDoiGoc : c.maDoi;
  var info = [];
  if(c.tenThat) info.push('<span class="ttv-item" style="border-color:var(--vang);background:rgba(255,214,10,.06)"><b>Tên</b>'+esc(c.tenThat)+'</span>');
  if(c.maNV)    info.push('<span class="ttv-item"><b>Mã NV</b>'+esc(c.maNV)+'</span>');
  if(c.tenXuong)info.push('<span class="ttv-item"><b>Xưởng</b>'+esc(c.tenXuong)+'</span>');
  if(c.tenAo)   info.push('<span class="ttv-item"><b>Tên in áo</b>'+esc(c.tenAo)+'</span>');
  if(c.sizeAo)  info.push('<span class="ttv-item"><b>Size</b>'+esc(c.sizeAo)+'</span>');
  if(maDoiHien) info.push('<span class="ttv-item"><b>Đội</b>'+esc(tenDoi(maDoiHien))+'</span>');
  var infoHtml = info.length ? '<div class="the-thongtin">'+info.join('')+'</div>' : '';

    $('mGenericBox').innerHTML =
      '<div style="max-width:340px;margin:0 auto">'
    +   '<div id="theCanChup">' + renderTheFifa(c, uuTienDoiGoc) + '</div>'
    +   infoHtml
    +   '<div style="display:flex;flex-direction:column;gap:8px;margin-top:16px">'
    +     '<button class="btn neon block" onclick="taiThePng(\''+maCT+'\')">📸 Tải thẻ PNG</button>'
    // ⭐ Nút đổi ảnh override nếu đang xem trong đội GH
    +     (function(){
            if(!isAdmin()) return '';
            if(uuTienDoiGoc) return '';              // đang xem trong đội gốc → không hiện
            if(!c.maDoiGoc) return '';               // không có đội gốc → không phải mượn
            if(c.maDoi === c.maDoiGoc) return '';    // cùng đội → không phải mượn
            var teamHienTai = doiObj(c.maDoi);
            var laGH = teamHienTai && String(teamHienTai.loaiDoi||'').toUpperCase()==='GH';
            if(!laGH) return '';
            var hasOverride = c.anhTheoDoi && c.anhTheoDoi[c.maDoi];
            return '<button class="btn cam block" onclick="doiAnhTheoDoi(\''+maCT+'\',\''+c.maDoi+'\',\''+esc(teamHienTai.tenDoi)+'\')">'
              + (hasOverride ? '🖼️ Sửa ảnh cho ' + esc(teamHienTai.tenDoi) : '🖼️ Thêm ảnh riêng cho ' + esc(teamHienTai.tenDoi))
              + '</button>'
              + (hasOverride ? '<button class="btn outline sm" onclick="xoaAnhTheoDoi(\''+maCT+'\',\''+c.maDoi+'\')">↩️ Xóa ảnh riêng (dùng ảnh gốc)</button>' : '');
          })()
    +     '<button class="btn outline" onclick="closeModal(\'mGeneric\')">Đóng</button>'
    +   '</div>'
    + '</div>';
  openModal('mGeneric');
}
function chonAnhThe(maCT){
  if (!isAdmin()) { toast('Chỉ BTC mới đổi được ảnh','err'); return; }
  $('mGenericBox').innerHTML = 
    '<h2 style="margin:0 0 12px;font-size:20px;font-family:var(--ff-title);letter-spacing:1px;color:var(--neon)">📸 CHỌN ẢNH CẦU THỦ</h2>'
    +'<p class="muted" style="margin-bottom:14px;font-size:13px">Chọn 1 trong 2 cách:</p>'
    +'<button class="btn neon block" style="padding:14px;font-size:15px;margin-bottom:10px" onclick="closeModal(\'mGeneric\');chonFileAnh(\''+maCT+'\')">'
    +'📁 Tải ảnh lên (tự nén, lưu thẳng vào sheet)'
    +'</button>'
    +'<button class="btn cam block" style="padding:14px;font-size:15px;margin-bottom:10px" onclick="doiPopupLinkAnh(\''+maCT+'\')">'
    +'🔗 Dán link Drive / Imgur (ảnh chất lượng gốc)'
    +'</button>'
    +'<button class="btn outline block" onclick="closeModal(\'mGeneric\')">Đóng</button>';
  openModal('mGeneric');
}

function chonFileAnh(maCT){
  var inp = document.getElementById('file-the-'+maCT);
  if (inp) inp.click();
}

function doiPopupLinkAnh(maCT){
  var c = cauThuObj(maCT);
  $('mGenericBox').innerHTML = 
    '<h2 style="margin:0 0 12px;font-size:20px;font-family:var(--ff-title);letter-spacing:1px;color:var(--neon)">🔗 DÁN LINK ẢNH</h2>'
    +'<p class="muted" style="margin-bottom:12px;font-size:13px">'
    +'Vào Google Drive / Imgur → chuột phải ảnh → <b>Chia sẻ → Bất kỳ ai có link</b> → copy link → dán vào đây.'
    +'</p>'
    +'<label>Link ảnh</label>'
    +'<input id="linkAnhUrl" value="'+esc(c&&c.anhUrl&&!c.anhUrl.startsWith('data:')?c.anhUrl:'')+'" '
    +'placeholder="https://drive.google.com/file/d/..." style="font-size:13px">'
    +'<div style="display:flex;gap:8px;margin-top:16px">'
    +'<button class="btn neon block" onclick="luuLinkAnh(\''+maCT+'\')">💾 Lưu</button>'
    +'<button class="btn outline" onclick="closeModal(\'mGeneric\')">Đóng</button>'
    +'</div>';
  openModal('mGeneric');
  setTimeout(function(){var e=$('linkAnhUrl');if(e)e.focus();},100);
}

function luuLinkAnh(maCT){
  var url = $('linkAnhUrl').value.trim();
  if (!url) { toast('Nhập link ảnh','err'); return; }
  srv('capNhatThe',[STATE.token, maCT, {AnhUrl: url}]).then(function(r){
    toast((r&&r.msg)||'Xong', r&&r.ok?'ok':'err');
    if (r&&r.ok) { closeModal('mGeneric'); tai(); }
  });
}
function uploadAnhThe(maCT, inp){
  var f = inp.files && inp.files[0];
  if (!f) return;
  if (!f.type.startsWith('image/')) { toast('Chỉ nhận file ảnh','err'); return; }

  var reader = new FileReader();
  reader.onload = function(ev){
    var img = new Image();
    img.onload = function(){
      var W = 300, H = 400;  // nhỏ hơn để base64 nhẹ
      var canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = '#0a0e1a';
      ctx.fillRect(0,0,W,H);

      var srcW = img.width, srcH = img.height;
      var scale = Math.max(W/srcW, H/srcH);
      var dstW = srcW*scale, dstH = srcH*scale;
      ctx.drawImage(img, (W-dstW)/2, (H-dstH)/2, dstW, dstH);

      // Nén xuống JPEG q=0.7 → ~25KB
      var dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      if (dataUrl.length > 40000) {
        dataUrl = canvas.toDataURL('image/jpeg', 0.5);
      }

      srv('capNhatThe',[STATE.token, maCT, {AnhUrl: dataUrl}]).then(function(r){
        toast((r&&r.msg)||'Xong', r&&r.ok?'ok':'err');
        if (r&&r.ok) tai();
      });
    };
    img.onerror = function(){ toast('Không đọc được ảnh','err'); };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(f);
}
function xoaAnhThe(maCT){
  if (!isAdmin()) return;
  if (!confirm('Xóa ảnh?')) return;
  srv('capNhatThe',[STATE.token, maCT, {AnhUrl: ''}]).then(function(r){
    toast((r&&r.msg)||'Xong', r&&r.ok?'ok':'err');
    if (r&&r.ok) tai();
  });
}
function suaSoAoThe(maCT){
  if (!isAdmin()) { toast('Chỉ BTC mới nhập được số áo','err'); return; }
  var c = cauThuObj(maCT);
  if (!c) return;
  // Tìm badge số áo của thẻ đó trong DOM
  var card = document.querySelector('.futc[data-id="'+maCT+'"]');
  if (!card) return;
  var badge = card.querySelector('.fc-soao');
  if (!badge) return;

  // Nếu đang mở input rồi → bỏ qua
  if (card.querySelector('.fc-soao-input')) {
    card.querySelector('.fc-soao-input').focus();
    return;
  }

  // Ẩn badge, tạo input
  badge.style.display = 'none';
  var inp = document.createElement('input');
  inp.type = 'text';
  inp.className = 'fc-soao-input';
  inp.value = c.soAo || '';
  inp.placeholder = '#';
  inp.maxLength = 3;
  inp.onclick = function(e){ e.stopPropagation(); };
  inp.onkeydown = function(e){
    e.stopPropagation();
    if (e.key === 'Enter') { luuSoAoNhanh(maCT, inp.value); }
    if (e.key === 'Escape') { huyNhapSoAo(maCT); }
  };
  inp.onblur = function(){
    // Đợi 100ms để phân biệt blur do Enter vs click ra ngoài
    setTimeout(function(){
      var still = card.querySelector('.fc-soao-input');
      if (still) luuSoAoNhanh(maCT, still.value);
    }, 100);
  };
  card.appendChild(inp);
  setTimeout(function(){ inp.focus(); inp.select(); }, 30);
}

function huyNhapSoAo(maCT){
  var card = document.querySelector('.futc[data-id="'+maCT+'"]');
  if (!card) return;
  var inp = card.querySelector('.fc-soao-input');
  if (inp) inp.remove();
  var badge = card.querySelector('.fc-soao');
  if (badge) badge.style.display = '';
}

function luuSoAoNhanh(maCT, so){
  so = String(so || '').trim();
  var card = document.querySelector('.futc[data-id="'+maCT+'"]');
  var inp = card ? card.querySelector('.fc-soao-input') : null;
  if (inp) inp.remove();

  var c = cauThuObj(maCT);
  // Nếu giá trị không đổi → chỉ hiện lại badge
  if (c && String(c.soAo||'') === so) {
    var badge = card ? card.querySelector('.fc-soao') : null;
    if (badge) {
      badge.style.display = '';
      badge.textContent = c.soAo ? c.soAo : '+';
    }
    return;
  }
  srv('capNhatCauThu', [STATE.token, maCT, {soAo: so}]).then(function(r){
    toast((r && r.ok) ? ('Đã lưu số áo #'+so+' cho '+(c?c.hoTen:'')) : ((r && r.msg) || 'Lỗi'), r && r.ok ? 'ok' : 'err');
    if (r && r.ok) tai();
    else {
      // Lỗi → khôi phục badge
      var badge = card ? card.querySelector('.fc-soao') : null;
      if (badge) {
        badge.style.display = '';
        badge.textContent = c && c.soAo ? c.soAo : '+';
      }
    }
  });
}

/* Modal xem đội — dùng thẻ FIFA */
function modalDoiCauThu(maDoi){
  var team=doiObj(maDoi); if(!team) return;
  window._TEAM_DANG_XEM = team;    // ⭐ THÊM DÒNG NÀY
  var laDoiGH = String(team.loaiDoi||'').toUpperCase()==='GH';
  var players=cauThuTrongDoi(maDoi, !laDoiGH);  // Đội chính gom cả GH, đội GH chỉ lấy người hiện tại
  var dt=team.doiTruong?cauThuObj(team.doiTruong):null;
  var h='<div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">'
    +logoDoiHtml(maDoi,64)
    +'<div><div style="font-family:var(--ff-title);font-size:24px;letter-spacing:.5px;color:var(--chu2);text-transform:uppercase">'+esc(team.tenDoi)+'</div>'
    +'<div class="muted" style="font-size:13px;margin-top:2px">'
    +(dt?'👑 '+esc(dt.hoTen)+' · ':'')
    +'👥 '+players.length+' cầu thủ</div></div></div>';

  if(!players.length){
    h+='<div class="empty">Chưa có cầu thủ nào trong đội.</div>';
  } else {
    players.sort(function(a,b){
  var ca=team.doiTruong===a.maCT?0:1, cb=team.doiTruong===b.maCT?0:1;
  if(ca!==cb) return ca-cb;
  return (Number(b.rating)||0) - (Number(a.rating)||0);
});
    h += '<div class="fifa-grid-wrap" id="gridDoiModal">';
    players.forEach(function(c){
      // Đội chính: ưu tiên logo + khung đội gốc | Đội GH: dùng đội hiện tại
      h += renderTheFifa(c, !laDoiGH);
    });
    h += '</div>';
  }
   h+='<div style="display:flex;gap:8px;margin-top:16px;flex-wrap:wrap">'
  +'<button class="btn neon block" style="flex:1" onclick="taiTheDoiHienTai()">'
  +'📸 Tải danh sách '+players.length+' thẻ'
  +'</button>'
  +'<button class="btn outline" onclick="closeModal(\'mGeneric\')">Đóng</button>'
  +'</div>';
  $('mGenericBox').innerHTML=h;
  $('mGenericBox').classList.add('wide');
  window._keepWide = true;
  openModal('mGeneric');
}

/* ================= VIEW: LỊCH ================= */
function viewLich(){
  var tran=STATE.data.tranDau;
  if(!tran.length){
    $('view').innerHTML='<div class="card"><div class="empty">Chưa có trận đấu nào.'+
      (isAdmin()?' Vào tab <b>Quản lý</b> để tạo lịch vòng bảng.':'')+'</div></div>';
    return;
  }
  var nhom={};
  tran.forEach(function(m){ (nhom[m.vongDau]=nhom[m.vongDau]||[]).push(m); });

  var order={'Vòng tròn':10,'Chung kết':80};
  var thuTu=Object.keys(nhom).sort(function(a,b){
    return (order[a]||50)-(order[b]||50);
  });

  var h='';
  thuTu.forEach(function(v){
    h+='<div class="card"><h2>'+esc(v)+'</h2>';
    nhom[v].sort(function(a,b){return (Number(a.thuTuKO)||0)-(Number(b.thuTuKO)||0);});
    nhom[v].forEach(function(m){ h+=matchRow(m); });
    h+='</div>';
  });
  $('view').innerHTML=h;
}
function matchRow(m, compact){
  var da=m.trangThai==='Đã đá'&&m.banThangA!==''&&m.banThangB!=='';
  var aWin=da&&m.banThangA>m.banThangB, bWin=da&&m.banThangB>m.banThangA;
  var score=da?('<span class="score">'+m.banThangA+' - '+m.banThangB+'</span>')
              :'<span class="score pending">vs</span>';
  var nameB=m.maDoiB?esc(tenDoi(m.maDoiB)):'<span class="muted">(chờ / Bye)</span>';
  var info=(m.gioThiDau||m.sanDau)?('<div class="muted" style="width:100%;font-size:13px;margin-top:6px;text-align:center">🕒 '+
    esc([m.gioThiDau,m.sanDau].filter(Boolean).join(' · '))+'</div>'):'';
  var xemBtn=m.maDoiB
    ?'<button class="btn neon sm" style="width:100%;margin-top:8px" onclick="event.stopPropagation();xemDoiHinhTran(\''+m.maTran+'\')">⚔️ Xem đội hình 2 đội</button>':'';
  var vd=videoCuaTran_(m.maTran);
  var videoBtn=vd
    ?'<button class="btn vang sm btn-video-tran" style="width:100%;margin-top:8px" onclick="event.stopPropagation();moLightboxMedia(\''+vd.maMedia+'\')">▶ Xem video giới thiệu trận</button>':'';
  var adminBtn=isAdmin()&&m.maDoiB
    ?'<button class="btn cam sm" style="width:100%;margin-top:8px" onclick="modalTySo(\''+m.maTran+'\')">⚽ Nhập tỷ số / giờ / sân / sự kiện</button>':'';

  var tag=(m.vongDau==='Chung kết')
    ?'<div style="width:100%;text-align:center;font-size:12px;color:var(--cam2);font-weight:700;letter-spacing:.05em;margin-bottom:8px">🥇 CHUNG KẾT</div>':'';

  // ⭐ Compact: chỉ logo, không tên đội (vẫn có nút Xem đội hình)
  if(compact){
    var h='<div class="match compact"'+(m.maDoiB?(' onclick="xemDoiHinhTran(\''+m.maTran+'\')" style="cursor:pointer"'):'')+'>'
      + tag
      + '<div class="team r'+(aWin?' win':'')+'">'
        + logoDoiHtml(m.maDoiA,180) + '</div>'
      + score
      + '<div class="team'+(bWin?' win':'')+'">'
        + (m.maDoiB?logoDoiHtml(m.maDoiB,180):'<span class="muted" style="font-size:12px">Bye</span>') + '</div>'
      + info
      + xemBtn                                   // ⭐ THÊM DÒNG NÀY
      + videoBtn
      + '</div>';
    return h;
  }

  // Bản đầy đủ (tab Lịch) — giữ nguyên như cũ
  var h='<div class="match">'
    +tag
    +'<div class="team r'+(aWin?' win':'')+'">'
      +'<span class="tn">'+esc(tenDoi(m.maDoiA))+'</span>'+logoDoiHtml(m.maDoiA,150)+'</div>'
    +score
    +'<div class="team'+(bWin?' win':'')+'">'
      +(m.maDoiB?logoDoiHtml(m.maDoiB,150):'')+'<span class="tn">'+nameB+'</span></div>'
    +info+suKienTranHtml(m)+xemBtn+videoBtn+adminBtn+'</div>';
  return h;
}
/* Video gắn với trận (lấy video đầu tiên theo thứ tự thư viện) */
function videoCuaTran_(maTran){
  if(!maTran) return null;
  return (STATE.data.media||[]).filter(function(x){ return x.loai==='VIDEO' && x.maTran===maTran; })[0] || null;
}
function nhanTran_(t){
  return [t.vongDau, tenDoi(t.maDoiA)+(t.maDoiB?' vs '+tenDoi(t.maDoiB):''), t.gioThiDau].filter(Boolean).join(' · ');
}
function suKienTranHtml(m){
  var sk=STATE.data.suKien.filter(function(s){return s.maTran===m.maTran;});
  if(!sk.length) return '';
  sk.sort(function(a,b){return (a.phut||0)-(b.phut||0);});
  function icon(l){return l==='BAN'?'⚽':l==='VANG'?'🟨':l==='DO'?'🟥':'•';}
  function dong(s){
    var ct=cauThuObj(s.maCT);
    var ten=ct?ct.hoTen:'(?)';
    var phut=s.phut?(' '+s.phut+"'"):'';
    return '<div class="sk-item">'+icon(s.loai)+' '+esc(ten)+'<span class="sk-phut">'+phut+'</span></div>';
  }
  var colA=sk.filter(function(s){return doiSuKien_(s,m)===m.maDoiA;}).map(dong).join('');
  var colB=sk.filter(function(s){return doiSuKien_(s,m)===m.maDoiB;}).map(dong).join('');
  var khac=sk.filter(function(s){var x=doiSuKien_(s,m);return x!==m.maDoiA&&x!==m.maDoiB;}).map(dong).join('');
  return '<div class="sk-wrap">'
    +'<div class="sk-col">'+(colA+khac||'<span class="muted" style="font-size:12px">—</span>')+'</div>'
    +'<div class="sk-col right">'+(colB||'<span class="muted" style="font-size:12px">—</span>')+'</div>'
    +'</div>';
}

/* ===== TRANG CHỦ: kết quả · ghi bàn · thẻ ===== */
function tranDaDa_(m){
  return m.trangThai==='Đã đá' && m.banThangA!=='' && m.banThangB!=='';
}
function tranObj_(maTran){
  return STATE.data.tranDau.filter(function(t){ return t.maTran===maTran; })[0];
}
function laDoiGH_(maDoi){
  var d=doiObj(maDoi); return !!d && String(d.loaiDoi||'').toUpperCase()==='GH';
}
function laTranGiaoHuu_(m){
  return !!m && (laDoiGH_(m.maDoiA) || laDoiGH_(m.maDoiB));
}
/* Đội của 1 sự kiện trong trận m. MaDoi trong SuKien đôi khi ghi nhầm (VD: đội giao hữu cũ của cầu thủ),
   khi đó lấy đội hiện tại / đội gốc của cầu thủ nếu trùng 1 trong 2 đội của trận. */
function doiSuKien_(s,m){
  if(!m) return s.maDoi;
  if(s.maDoi===m.maDoiA || s.maDoi===m.maDoiB) return s.maDoi;
  var c=cauThuObj(s.maCT);
  if(c){
    if(c.maDoi===m.maDoiA || c.maDoi===m.maDoiB) return c.maDoi;
    if(c.maDoiGoc===m.maDoiA || c.maDoiGoc===m.maDoiB) return c.maDoiGoc;
  }
  return s.maDoi;
}
function doiThu_(maDoi,m){ return m.maDoiA===maDoi ? m.maDoiB : m.maDoiA; }
/* Sự kiện của các trận giải chung đã có (bỏ trận giao hữu), kèm trận và đội đã gán đúng */
function suKienGiai_(loai){
  return (STATE.data.suKien||[]).filter(function(s){ return loai.indexOf(s.loai)>=0; }).map(function(s){
    var m=tranObj_(s.maTran);
    return { s:s, m:m, maDoi:doiSuKien_(s,m) };
  }).filter(function(x){ return x.m && !laTranGiaoHuu_(x.m); });
}
/* Ngày thi đấu "dd/mm/yyyy" lấy từ giờ thi đấu ("15:00 23/10/2026" hoặc "2026-10-23 15:00:00") */
function ngayTran_(m){
  var g=String(m.gioThiDau||''), x=g.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if(x) return {k:x[3]+bdP2_(+x[2])+bdP2_(+x[1]), t:bdP2_(+x[1])+'/'+bdP2_(+x[2])+'/'+x[3]};
  x=g.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
  if(x) return {k:x[1]+bdP2_(+x[2])+bdP2_(+x[3]), t:bdP2_(+x[3])+'/'+bdP2_(+x[2])+'/'+x[1]};
  return {k:'', t:''};
}
/* Nhãn lượt: các ngày có trận giải chung đánh số Lượt 1, 2, 3… theo thứ tự ngày; trận giao hữu ghi "Giao hữu" */
function nhanLuot_(m){
  if(laTranGiaoHuu_(m)) return /khai/i.test(m.vongDau||'') ? 'Giao hữu khai mạc' : 'Giao hữu';
  if(m.vongDau==='Chung kết') return 'Chung kết';
  var ngay={};
  (STATE.data.tranDau||[]).forEach(function(t){ if(!laTranGiaoHuu_(t) && t.vongDau!=='Chung kết'){ var k=ngayTran_(t).k; if(k) ngay[k]=1; } });
  var ds=Object.keys(ngay).sort(), i=ds.indexOf(ngayTran_(m).k);
  return i>=0 ? 'Lượt '+(i+1) : (m.vongDau||'');
}
function homeKetQuaHtml_(){
  var ds=(STATE.data.tranDau||[]).filter(tranDaDa_);
  var h='<div class="card"><h2>⚽ Kết quả trận đấu</h2>';
  if(!ds.length) return h+'<div class="empty">Chưa có trận nào đá xong.</div></div>';
  // nhóm theo ngày, ngày mới nhất lên đầu; trong ngày theo thứ tự trận
  var nhom={}, thuTu=[];
  ds.forEach(function(m){ var n=ngayTran_(m); if(!nhom[n.k]){ nhom[n.k]={t:n.t, ds:[]}; thuTu.push(n.k); } nhom[n.k].ds.push(m); });
  thuTu.sort().reverse().forEach(function(k){
    var g=nhom[k]; g.ds.sort(function(a,b){ return (Number(a.thuTuKO)||0)-(Number(b.thuTuKO)||0); });
    var dt=bdGio_(g.ds[0].gioThiDau);
    h+='<div class="kq-ngay"><span class="kq-luot">'+esc(nhanLuot_(g.ds[0]))+'</span>'
      +'<span class="kq-ngay-t">'+(dt?BD_THU[dt.getDay()]+' · ':'')+esc(g.t)+'</span></div>';
    g.ds.forEach(function(m){ h+=matchRow(m, false); });
  });
  return h+'</div>';
}
/* Lịch gọn cho cột phải trang chủ: nhóm theo ngày, mỗi trận 1 dòng (logo · tên · giờ · tên · logo) */
function lichGonHtml_(ds){
  var nhom={}, thuTu=[];
  ds.forEach(function(m){ var n=ngayTran_(m); var k=n.k||'zz'; if(!nhom[k]){ nhom[k]={t:n.t, ds:[]}; thuTu.push(k); } nhom[k].ds.push(m); });
  var h='';
  thuTu.sort().forEach(function(k){
    var g=nhom[k]; g.ds.sort(function(a,b){ return (Number(a.thuTuKO)||0)-(Number(b.thuTuKO)||0); });
    var dt=bdGio_(g.ds[0].gioThiDau);
    h+='<div class="lg-ngay"><span class="kq-luot">'+esc(nhanLuot_(g.ds[0]))+'</span><span class="kq-ngay-t">'+(dt?BD_THU[dt.getDay()]+' · ':'')+esc(g.t||'Chưa có ngày')+'</span></div>';
    g.ds.forEach(function(m){
      var gd=bdGio_(m.gioThiDau);
      h+='<div class="lg-tran"'+(m.maDoiB?' onclick="xemDoiHinhTran(\''+m.maTran+'\')"':'')+'>'
        +'<div class="lg-doi">'+logoDoiHtml(m.maDoiA,46)+'<span>'+esc(tenDoiNgan_(tenDoi(m.maDoiA)))+'</span></div>'
        +'<div class="lg-gio">'+(gd?bdGioTxt_(gd):'VS')+'</div>'
        +'<div class="lg-doi r">'+(m.maDoiB?logoDoiHtml(m.maDoiB,46):'')+'<span>'+(m.maDoiB?esc(tenDoiNgan_(tenDoi(m.maDoiB))):'Bye')+'</span></div>'
        +'</div>';
    });
  });
  return h;
}
/* Dải số liệu nhanh đầu trang chủ */
function homeSoLieuHtml_(doiGiai){
  var td=(STATE.data.tranDau||[]).filter(function(m){ return !laTranGiaoHuu_(m); });
  var da=td.filter(tranDaDa_).length;
  var ban=suKienGiai_(['BAN']).length, vang=suKienGiai_(['VANG']).length, dodo=suKienGiai_(['DO']).length;
  var o=function(n,l){ return '<div class="stat"><div class="n">'+n+'</div><div class="l">'+l+'</div></div>'; };
  return '<div class="card home-solieu"><div class="hero">'
    +o(doiGiai.length,'Đội')+o(da+'/'+td.length,'Trận đã đá')+o(ban,'Bàn thắng')+o(vang,'Thẻ vàng')+(dodo?o(dodo,'Thẻ đỏ'):'')
    +'</div></div>';
}
function homeGhiBanHtml_(){
  var nhom={};
  suKienGiai_(['BAN']).forEach(function(x){
    var k=x.s.maCT; if(!k) return;
    if(!nhom[k]) nhom[k]={maCT:k, maDoi:x.maDoi, ban:[]};
    nhom[k].ban.push(x);
  });
  var ds=Object.keys(nhom).map(function(k){ return nhom[k]; });
  ds.sort(function(a,b){
    return b.ban.length-a.ban.length || String((cauThuObj(a.maCT)||{}).hoTen||'').localeCompare(String((cauThuObj(b.maCT)||{}).hoTen||''),'vi');
  });
  var tong=ds.reduce(function(t,p){ return t+p.ban.length; },0);
  var h='<div class="card ds-gon"><h2>⚽ Ghi bàn</h2>';
  if(!ds.length) return h+'<div class="empty">Chưa có bàn thắng.</div></div>';
  h+='<div class="muted ds-tong">'+tong+' bàn thắng · giải chung</div>';
  // Người dẫn đầu (một mình nhiều bàn nhất): thẻ cầu thủ FIFA cỡ lớn
  var dau=ds[0], cDau=cauThuObj(dau.maCT);
  if(cDau && (!ds[1] || dau.ban.length>ds[1].ban.length)){
    var phutDau=dau.ban.filter(function(x){return x.s.phut;}).map(function(x){return x.s.phut+"'";}).join(' · ');
    h+='<div class="gbd">'
      +'<span class="gbd-cot" aria-hidden="true"></span>'
      +'<div class="gbd-the"><div class="fx-noi">'+renderTheFifa(cDau, true)+'<span class="gbd-kim" aria-hidden="true"></span></div></div>'
      +'<div class="gbd-info"><span class="gbd-nhan">Dẫn đầu ghi bàn</span>'
      +'<div class="gbd-dong"><div class="gbd-so">'+dau.ban.length+'<small>bàn</small></div>'
      +'<div class="gbd-ten">'+esc(cDau.hoTen||'')+'</div></div>'
      +'<div class="gbd-phu">'+logoDoiHtml(dau.maDoi,22)+'<span>'+esc(tenDoi(dau.maDoi))+(phutDau?' · '+phutDau:'')+'</span></div></div></div>';
  }
  var hang=0, truoc=-1;
  ds.forEach(function(p,i){
    if(p.ban.length!==truoc){ hang=i+1; truoc=p.ban.length; }
    var c=cauThuObj(p.maCT)||{};
    // "vs EVO 5' 10'" — gom theo đối thủ
    var dt={}, thuTu=[];
    p.ban.sort(function(a,b){ return (Number(a.m.thuTuKO)||0)-(Number(b.m.thuTuKO)||0) || a.s.phut-b.s.phut; }).forEach(function(x){
      var k=doiThu_(x.maDoi,x.m); if(!dt[k]){ dt[k]=[]; thuTu.push(k); } if(x.s.phut) dt[k].push(x.s.phut+"'");
    });
    var chiTiet=thuTu.map(function(k){ return 'vs '+esc(tenDoiNgan_(tenDoi(k)))+(dt[k].length?' '+dt[k].join(' '):''); }).join(' · ');
    h+='<div class="ds-dong">'
      +'<div class="ds-hang'+(hang<=3?' h'+hang:'')+'">'+hang+'</div>'
      +logoDoiHtml(p.maDoi,30)
      +'<div class="ds-info"><div class="ds-ten" title="'+esc(c.hoTen||'')+'">'+esc(c.hoTen||'(?)')+'</div><div class="ds-phu">'+chiTiet+'</div></div>'
      +'<div class="ds-so">'+p.ban.length+'</div></div>';
  });
  return h+'</div>';
}
function homeTheHtml_(){
  var ds=suKienGiai_(['VANG','DO']);
  ds.sort(function(a,b){ return (Number(b.m.thuTuKO)||0)-(Number(a.m.thuTuKO)||0) || a.s.phut-b.s.phut; });
  var soVang=ds.filter(function(x){return x.s.loai==='VANG';}).length, soDo=ds.length-soVang;
  var h='<div class="card ds-gon"><h2>🟨 Thẻ phạt</h2>';
  if(!ds.length) return h+'<div class="empty">Chưa có thẻ phạt.</div></div>';
  h+='<div class="muted ds-tong">'+soVang+' thẻ vàng · '+soDo+' thẻ đỏ</div>';
  ds.forEach(function(x){
    var c=cauThuObj(x.s.maCT)||{}, vang=x.s.loai==='VANG', nt=ngayTran_(x.m).t;
    h+='<div class="ds-dong">'
      +'<div class="ds-the '+(vang?'vang':'do')+'"></div>'
      +logoDoiHtml(x.maDoi,30)
      +'<div class="ds-info"><div class="ds-ten" title="'+esc(c.hoTen||'')+'">'+esc(c.hoTen||'(?)')+'</div>'
      +'<div class="ds-phu">vs '+esc(tenDoiNgan_(tenDoi(doiThu_(x.maDoi,x.m))))+(nt?' · '+esc(nt.slice(0,5)):'')+'</div></div>'
      +'<div class="ds-so '+(vang?'vang':'do')+'">'+(x.s.phut?x.s.phut+"'":'')+'</div></div>';
  });
  return h+'</div>';
}
/* ===== Xem đội hình 2 đội của 1 trận ===== */
/* Tên đội gọn (bỏ chữ "FC") để hiển thị to trên màn xem đội hình */
function tenDoiNgan_(ten){
  return String(ten||'').replace(/\bFC\b/gi,'').replace(/\s+/g,' ').trim() || String(ten||'');
}
var MATCH_VIEW = { maTran:'', soDoA:'', soDoB:'' };
function laMobile_(){
  return false;   // ⭐ Tắt hẳn mobile layout — luôn dùng layout desktop giống "xem bản máy tính"
}
function doiSoDoTranView(side,val){
  if(side==='A') MATCH_VIEW.soDoA=val; else MATCH_VIEW.soDoB=val;
  xemDoiHinhTran(MATCH_VIEW.maTran);
}
function xemDoiHinhTran(maTran){
  var m = STATE.data.tranDau.filter(function(t){return t.maTran===maTran;})[0];
  if(!m){ toast('Không tìm thấy trận','err'); return; }
  var teamA = doiObj(m.maDoiA);
  var teamB = m.maDoiB ? doiObj(m.maDoiB) : null;
  if(!teamA || !teamB){ toast('Trận chưa đủ 2 đội','err'); return; }
  if(MATCH_VIEW.maTran !== maTran){
    MATCH_VIEW = { maTran:maTran, soDoA:chuanSoDo_(getDoiHinh_(m.maDoiA).soDo), soDoB:chuanSoDo_(getDoiHinh_(m.maDoiB).soDo) };
  }
  function soDoCua(side){ var k=(side==='A')?MATCH_VIEW.soDoA:MATCH_VIEW.soDoB; return SO_DO_LIST[k]?k:chuanSoDo_(k); }

  /* Map toạ độ sơ đồ dọc → sân ngang theo vạch vôi của ảnh san-doi-hinh-cat.webp (tính theo % khung ảnh):
     đường biên dọc 3.6% → 96.4% (giữa 50%), khung thành trái 3.7% / phải 96.3%, giữa sân 50%.
     Chiều sâu chia 4 tuyến (thủ môn · hậu vệ · tiền vệ · tiền đạo) cách nhau ~12.5% để thẻ không chạm nhau. */
  var GIUA_DOC = 50, NUA_DOC = 46;
  var TUYEN = [[15,44],[44,32],[70,20],[86,19],[102,7]];   // [sl.y, % tính từ khung thành đội mình]; hậu vệ (sl.y 70–86) đứng cùng một tuyến
  function sauTuyen_(y){
    if(y <= TUYEN[0][0]) return TUYEN[0][1];
    for(var i=1;i<TUYEN.length;i++){
      var a=TUYEN[i-1], b=TUYEN[i];
      if(y <= b[0]) return a[1] + (y - a[0]) * (b[1] - a[1]) / (b[0] - a[0]);
    }
    return TUYEN[TUYEN.length-1][1];
  }
  function slotPos(sl, isDoiA) {
    var y_view = GIUA_DOC + (sl.x - 50) / 50 * NUA_DOC;
    var tien = sauTuyen_(sl.y);
    return { x: isDoiA ? tien : 100 - tien, y: y_view };
  }

  function slotsHtml(maDoi, team, side){
    var cfg = getDoiHinh_(maDoi);
    var soDo = SO_DO_LIST_2DOI[soDoCua(side)] || SO_DO_LIST['2-3-1'];
    var laGH_ = team && String(team.loaiDoi||'').toUpperCase()==='GH';
    var uuTien = !laGH_;
    var out = '', demTuyen_ = {};
    soDo.forEach(function(sl, i){
      var maCT = cfg.slots[i] || '';
      var c = maCT ? cauThuObj(maCT) : null;
      var p = slotPos(sl, side==='A');
      var isCap = team && c && team.doiTruong === c.maCT;
      var tuyen_ = sl.y>=90 ? 0 : sl.y>=60 ? 1 : sl.y>=30 ? 2 : 3;   // thủ môn · hậu vệ · tiền vệ · tiền đạo
      demTuyen_[tuyen_] = (demTuyen_[tuyen_]||0) + 1;
      out += thvSlotHtml_(p.x, p.y, c, isCap, sl.label, uuTien).replace('class="thv-slot" style="', 'class="thv-slot" style="--i:'+(tuyen_*3+demTuyen_[tuyen_]-1)+';');
    });
    return out;
  }

  function benchHtml(maDoi, team){
    var cfg = getDoiHinh_(maDoi);
    var daXep = {};
    Object.keys(cfg.slots).forEach(function(k){ if(cfg.slots[k]) daXep[cfg.slots[k]] = true; });
    var laGH_ = team && String(team.loaiDoi||'').toUpperCase()==='GH';
    var bench = cauThuTrongDoi(maDoi, !laGH_).filter(function(c){ return !daXep[c.maCT]; });
    bench.sort(function(a,b){
  return (Number(b.rating)||0) - (Number(a.rating)||0);
});
    var inner = '';
    if(!bench.length){
      inner = '<div class="bench-empty">Không có cầu thủ dự bị.</div>';
    } else {
      // ⭐ Hiển thị thẻ FIFA có khung viền
      inner = '<div class="bench-fifa-wrap bench-2doi">';
      bench.forEach(function(c){
        inner += '<div class="bench-fifa">'
          + renderTheFifa(c, !laGH_)
          + '</div>';
      });
      inner += '</div>';
    }
    return '<div class="bench" style="margin-top:0">'
      + '<div class="bench-title"><span>🪑 Dự bị '+esc(team.tenDoi)+' ('+bench.length+')</span></div>'
      + inner
      + '</div>';
  }

  var da = (m.trangThai==='Đã đá' && m.banThangA!=='' && m.banThangB!=='');
  var scoreTxt = da ? (m.banThangA + ' - ' + m.banThangB) : 'vs';

  function soDoCtrl(side){
    var cur = soDoCua(side);
    if(isAdmin()){
      var opts = Object.keys(SO_DO_LIST_2DOI).map(function(s){ return '<option value="'+s+'"'+(s===cur?' selected':'')+'>'+s+'</option>'; }).join('');
      return '<select onchange="doiSoDoTranView(\''+side+'\',this.value)">'+opts+'</select>';
    }
    return esc(cur);
  }

  function logoHtml(team){
    if(team.logoUrl){
      return '<img src="'+esc(driveImg(team.logoUrl))+'" alt="" '
        + 'onerror="this.outerHTML=\''+esc((team.tenDoi||'?').slice(0,2).toUpperCase())+'\'">';
    }
    return esc((team.tenDoi||'?').slice(0,2).toUpperCase());
  }

  var h = '<div class="tran-hinh">';
  h += '<div class="thv-stage thv-fx">';
  h +=   '<span class="thv-vong v1" aria-hidden="true"></span><span class="thv-vong v2" aria-hidden="true"></span>';
  h +=   '<div class="thv-logo left">'+logoHtml(teamA)+'</div>';
  h +=   '<div class="thv-logo right">'+logoHtml(teamB)+'</div>';
  h +=   '<div class="thv-team left">'
       +     '<div class="thv-team-name">'+esc(tenDoiNgan_(teamA.tenDoi))+'</div>'
       +     '<div class="thv-team-sodo">'+soDoCtrl('A')+'</div>'
       +   '</div>';
  h +=   '<div class="thv-team right">'
       +     '<div class="thv-team-name">'+esc(tenDoiNgan_(teamB.tenDoi))+'</div>'
       +     '<div class="thv-team-sodo">'+soDoCtrl('B')+'</div>'
       +   '</div>';
  h +=   '<div class="thv-vs">'+esc(scoreTxt)+'</div>';
  h +=   '<div class="thv-pitch"><div class="thv-pitch-bg"></div>'
       +     slotsHtml(m.maDoiA, teamA, 'A')
       +     slotsHtml(m.maDoiB, teamB, 'B')
       +   '</div>';
  h += '</div>';
  h += '<div class="th-benches">'+ benchHtml(m.maDoiA, teamA) + benchHtml(m.maDoiB, teamB) +'</div>';
  h += '</div>';
    h += '<div style="display:flex;gap:10px;margin-top:14px;justify-content:center;flex-wrap:wrap">'
    +  '<button class="btn neon" onclick="taiSoDoPng(\''+maTran+'\')">📸 Tải ảnh sơ đồ PNG</button>'
    +  '<button class="btn outline" onclick="closeModal(\'mGeneric\')">Đóng</button>'
    +  '</div>';

  $('mGenericBox').innerHTML = '<div id="sodoCanChup">' + h + '</div>';
  $('mGenericBox').classList.add('wide');
  window._keepWide = true;
  openModal('mGeneric');
  // Hạt vàng: bung ra khi chữ VS đập xuống, sau đó tàn lửa bay nhẹ
  try {
    var st_ = document.querySelector('#sodoCanChup .thv-stage');
    if(st_ && !FX_GIAM){
      st_.insertAdjacentHTML('beforeend','<canvas class="fx-hat"></canvas>');
      var hat_ = fxHat_(st_.querySelector('canvas.fx-hat'), 1);
      setTimeout(function(){ var r=st_.getBoundingClientRect(), v=st_.querySelector('.thv-vs'); if(!hat_||!v) return; var q=v.getBoundingClientRect(); hat_.bung(q.left-r.left+q.width/2, q.top-r.top+q.height/2, 70, 4.5); }, 1000);
    }
  } catch(e) {}
}

/* ================= VIEW: DANH SÁCH CẦU THỦ ĐĂNG KÝ ================= */
function viewDanhSachDK(){
  var d=STATE.data;
  var xuongOpts='<option value="">— Tất cả xưởng —</option>'
    +(d.phongBan||[]).map(function(p){return '<option value="'+esc(p.maXuong)+'">'+esc(p.tenXuong)+'</option>';}).join('');
  var doiOpts='<option value="">— Tất cả đội —</option><option value="__NONE__">Chưa chia đội</option>'
    +d.doi.map(function(t){return '<option value="'+esc(t.maDoi)+'">'+esc(t.tenDoi)+'</option>';}).join('');
  var h='<div class="card"><h2>📋 Danh sách cầu thủ đăng ký</h2>'
    +'<div class="dsdk-tools">'
    +'<input id="dsdkTim" placeholder="🔎 Tìm tên / mã NV / tên in áo…" oninput="locDanhSachDK()">'
    +'<select id="dsdkXuong" onchange="locDanhSachDK()">'+xuongOpts+'</select>'
    +'<select id="dsdkDoi" onchange="locDanhSachDK()">'+doiOpts+'</select>'
    +'</div><div id="dsdkBox"></div></div>';
  $('view').innerHTML=h;
  locDanhSachDK();
}
function locDanhSachDK(){
  var d=STATE.data;
  var kw=($('dsdkTim')?$('dsdkTim').value:'').trim().toLowerCase();
  var mx=$('dsdkXuong')?$('dsdkXuong').value:'';
  var md=$('dsdkDoi')?$('dsdkDoi').value:'';
  var ds=d.cauThu.filter(function(c){
    if(mx && c.maXuong!==mx) return false;
    if(md==='__NONE__'){ if(c.maDoi) return false; }
    else if(md && c.maDoi!==md) return false;
    if(kw){
      var hay=(String(c.hoTen||'')+' '+String(c.maNV||'')+' '+String(c.tenAo||'')).toLowerCase();
      if(hay.indexOf(kw)<0) return false;
    }
    return true;
  });
  ds.sort(function(a,b){ return String(a.hoTen||'').localeCompare(String(b.hoTen||'')); });
  var box=$('dsdkBox'); if(!box) return;
  if(!ds.length){ box.innerHTML='<div class="empty">Không có cầu thủ nào khớp.</div>'; return; }
  var adm=isAdmin();
  var h='<div class="muted" style="margin-bottom:8px">'+ds.length+' cầu thủ'+(adm?' · bấm ✏️ để sửa tên áo / số áo / size':'')+'</div>'
    +'<div class="dsdk-wrap"><table class="dsdk-table"><thead><tr>'
    +'<th class="num">#</th><th>Họ tên</th><th>Tên thật</th><th>Tên in áo</th><th class="num">Số áo</th><th class="num">Size</th>'
    +'<th>Mã NV</th><th>Xưởng</th><th>Đội</th><th>Đội gốc</th><th>Vị trí</th>'+(adm?'<th></th>':'')+'</tr></thead><tbody>';
  ds.forEach(function(c,i){
    h+='<tr>'
      +'<td class="num muted">'+(i+1)+'</td>'
      +'<td><b>'+esc(c.hoTen||'')+'</b></td>'
      +'<td style="color:var(--neon);font-weight:600">'+esc(c.tenThat||'—')+'</td>'
      +'<td style="color:var(--cam2);font-weight:700">'+esc(c.tenAo||'')+'</td>'
      +'<td class="num"><span class="dsdk-ao">'+(c.soAo?esc(c.soAo):'—')+'</span></td>'
      +'<td class="num">'+(c.sizeAo?'<span class="pill size">'+esc(c.sizeAo)+'</span>':'—')+'</td>'
      +'<td class="muted">'+esc(c.maNV||'')+'</td>'
      +'<td class="muted">'+esc(c.tenXuong||'')+'</td>'
      +'<td>'+(c.maDoi?esc(tenDoi(c.maDoi)):'<span class="muted">Chưa chia</span>')+'</td>'
      +'<td>'+(c.maDoiGoc?esc(tenDoi(c.maDoiGoc)):'<span class="muted">—</span>')+'</td>'
      +'<td>'+viTriListHtml(c.viTriList)+'</td>'
      +(adm?'<td class="num"><button class="btn outline sm" onclick="modalSuaCauThu(\''+c.maCT+'\')">✏️</button></td>':'')
      +'</tr>';
  });
  h+='</tbody></table></div>';
  box.innerHTML=h;
}

/* ================= VIEW: TRẬN ĐẶC BIỆT / GIAO HỮU + SẮP LỊCH ================= */
function viewTranDacBiet(){
  if(!isAdmin()){ $('view').innerHTML='<div class="card"><div class="empty">Cần đăng nhập BTC.</div></div>'; return; }
  var d=STATE.data;
  var ghTeams=d.doi.filter(function(t){return String(t.loaiDoi||'').toUpperCase()==='GH';});
  var ghTeamOpts=ghTeams.map(function(t){return '<option value="'+esc(t.maDoi)+'">'+esc(t.tenDoi)+'</option>';}).join('');
  var allTeamOpts=d.doi.map(function(t){return '<option value="'+esc(t.maDoi)+'">'+esc(t.tenDoi)+(String(t.loaiDoi||'').toUpperCase()==='GH'?' (GH)':'')+'</option>';}).join('');
  var xuongOpts='<option value="">— Xưởng (tuỳ chọn) —</option>'+(d.phongBan||[]).map(function(p){return '<option value="'+esc(p.maXuong)+'">'+esc(p.tenXuong)+'</option>';}).join('');
  var sizeOpts=['','S','M','L','XL','2XL','3XL','4-5XL'].map(function(s){return '<option value="'+s+'">'+(s||'— Size —')+'</option>';}).join('');

  var h='<div class="card"><h2>🎌 Đội giao hữu (không tính giải chung)</h2>'
    +'<p class="muted" style="margin-bottom:10px;font-size:13px">Dùng cho trận khai mạc — VD: <b>RETRO</b> (ban lãnh đạo) vs <b>JUNIOR</b> (quản lý mới). Mỗi đội có logo + màu áo riêng; cầu thủ có số áo & tên in áo riêng. Đội giao hữu <b>không xuất hiện ở BXH</b> và <b>không vào vòng bảng</b>.</p>'
    +'<div class="dsdk-tools">'
    +'<input id="ghTen" placeholder="Tên đội (VD: RETRO)">'
    +'<input id="ghLogo" placeholder="Link logo đội (Drive/Imgur)">'
    +'<input id="ghMau" placeholder="Màu áo (VD: Đỏ đen)">'
    +'<input id="ghKhung" placeholder="Link khung viền thẻ riêng (PNG)">'
    +'<button class="btn neon sm" onclick="taoDoiGiaoHuu()">➕ Tạo đội GH</button>'
    +'</div>'
    +'<p class="muted" style="font-size:12px;margin:6px 0 0">💡 Khung viền thẻ nên là ảnh <b>PNG trong suốt ô ảnh</b> (như khung thẻ giải chung). Để trống thì cầu thủ dùng khung mặc định.</p>';
  if(!ghTeams.length){ h+='<div class="muted">Chưa có đội giao hữu.</div>'; }
  else {
    ghTeams.forEach(function(t){
      var players=cauThuTrongDoi(t.maDoi);
      h+='<div class="gh-team"><div class="gh-team-head">'+logoDoiHtml(t.maDoi,40)
        +'<div style="flex:1;min-width:0"><b style="font-family:var(--ff-title);font-size:17px">'+esc(t.tenDoi)+'</b>'
        +'<div class="muted" style="font-size:12px">'+(t.mauAo?('Áo: '+esc(t.mauAo)+' · '):'')+(t.khungThe?'Khung riêng ✓ · ':'Khung: mặc định · ')+players.length+' cầu thủ</div></div>'
        +'<button class="btn outline sm" onclick="suaDoiGH(\''+t.maDoi+'\')">✏️</button>'
        +'<button class="btn danger sm" onclick="xoaDoiGH(\''+t.maDoi+'\')">🗑</button></div>';
      if(players.length){
        players.sort(function(a,b){return (Number(a.soAo)||999)-(Number(b.soAo)||999);});
        h+='<div class="gh-players">';
        players.forEach(function(c){
          h+='<div class="gh-pl"><span class="gh-ao">'+(c.soAo?esc(c.soAo):'—')+'</span>'
            +'<span class="gh-nm">'+esc(c.hoTen)+(c.tenAo?' · <i style="color:var(--cam2)">'+esc(c.tenAo)+'</i>':'')+'</span>'
            +'<button class="btn outline sm" onclick="modalSuaCauThu(\''+c.maCT+'\')">✏️</button></div>';
        });
        h+='</div>';
      }
      // Chọn từ người ĐÃ ĐĂNG KÝ (ưu tiên người chưa chia đội)
      var dsChon = d.cauThu.filter(function(c){ return c.maDoi!==t.maDoi; })
        .sort(function(a,b){
          var pa=a.maDoi?1:0, pb=b.maDoi?1:0;           // chưa chia đội lên đầu
          if(pa!==pb) return pa-pb;
          return String(a.hoTen||'').localeCompare(String(b.hoTen||''));
        });
      var chonOpts=dsChon.map(function(c){
        var st=c.maDoi?tenDoi(c.maDoi):'Chưa chia đội';
        return '<option value="'+esc(c.maCT)+'">'+esc(c.hoTen)+(c.maNV?' ('+esc(c.maNV)+')':'')+' — '+esc(st)+'</option>';
      }).join('');
      h+='<details class="gh-add"><summary>➕ Chọn từ người đã đăng ký</summary>'
        +'<div class="dsdk-tools" style="margin-top:10px">'
        +'<select id="pk_'+t.maDoi+'"><option value="">— Chọn cầu thủ đã ĐK —</option>'+chonOpts+'</select>'
        +'<button class="btn neon sm" onclick="chonNguoiDaDK(\''+t.maDoi+'\')">Thêm vào đội</button>'
        +'</div>'
        +'<p class="muted" style="font-size:12px;margin-top:6px">Người đang ở đội khác sẽ được <b>chuyển</b> sang đội giao hữu này.</p>'
        +'</details>';
      h+='<details class="gh-add"><summary>➕ Thêm cầu thủ MỚI (chưa đăng ký)</summary>'
        +'<div class="dsdk-tools" style="margin-top:10px">'
        +'<input id="ap_ten_'+t.maDoi+'" placeholder="Họ tên *">'
        +'<input id="ap_ao_'+t.maDoi+'" placeholder="Tên in áo" style="text-transform:uppercase">'
        +'<input id="ap_so_'+t.maDoi+'" placeholder="Số áo" style="max-width:90px">'
        +'<select id="ap_size_'+t.maDoi+'">'+sizeOpts+'</select>'
        +'<input id="ap_nv_'+t.maDoi+'" placeholder="Mã NV (tuỳ chọn)" style="text-transform:uppercase">'
        +'<select id="ap_xuong_'+t.maDoi+'">'+xuongOpts+'</select>'
        +'<button class="btn neon sm" onclick="themCTGiaoHuu(\''+t.maDoi+'\')">Lưu</button>'
        +'</div></details></div>';
    });
  }
  h+='</div>';

  h+='<div class="card"><h2>⚔️ Tạo trận khai mạc / giao hữu</h2>';
  if(ghTeams.length<2){ h+='<div class="muted">Cần ít nhất 2 đội giao hữu để tạo trận.</div>'; }
  else {
    h+='<div class="dsdk-tools">'
      +'<input id="kmNhan" placeholder="Tên trận" value="🎉 Khai mạc">'
      +'<select id="kmA">'+ghTeamOpts+'</select><span style="align-self:center">vs</span>'
      +'<select id="kmB">'+ghTeamOpts+'</select>'
      +'<input id="kmGio" placeholder="Giờ (VD: 08:00 20/12)"><input id="kmSan" placeholder="Sân">'
      +'<button class="btn neon sm" onclick="taoTranKhaiMac()">➕ Tạo trận</button></div>'
      +'<p class="muted" style="font-size:12.5px;margin-top:8px">Sau khi tạo: vào tab <b>⚽ Đội hình</b> chọn đội giao hữu để xếp đội hình, rồi ở <b>📅 Lịch</b> bấm <b>"Xem đội hình 2 đội"</b>.</p>';
  }
  h+='</div>';

  h+='<div class="card"><h2>🗂 Sắp lịch thi đấu thủ công</h2>'
    +'<details class="gh-add"><summary>➕ Tạo trận (giải chung / tuỳ chỉnh)</summary>'
    +'<div class="dsdk-tools" style="margin-top:10px">'
    +'<select id="mtA"><option value="">— Đội A —</option>'+allTeamOpts+'</select>'
    +'<select id="mtB"><option value="">— Đội B —</option>'+allTeamOpts+'</select>'
    +'<input id="mtVong" placeholder="Nhãn vòng (mặc định: Vòng tròn)">'
    +'<input id="mtGio" placeholder="Giờ"><input id="mtSan" placeholder="Sân">'
    +'<button class="btn neon sm" onclick="taoTranThuCongUI()">Tạo</button></div></details>';
  var tran=d.tranDau.slice();
  if(!tran.length){ h+='<div class="muted">Chưa có trận nào.</div>'; }
  else {
    var nhom={}; tran.forEach(function(m){ var v=m.vongDau||'(Khác)'; (nhom[v]=nhom[v]||[]).push(m); });
    Object.keys(nhom).forEach(function(v){
      var ds=nhom[v].sort(function(a,b){return (Number(a.thuTuKO)||0)-(Number(b.thuTuKO)||0);});
      h+='<div class="sched-grp"><div class="sched-grp-t">'+esc(v)+' ('+ds.length+')</div>';
      ds.forEach(function(m,i){
        h+='<div class="sched-row"><span class="sched-idx">'+(i+1)+'</span>'
          +'<span class="sched-teams">'+esc(tenDoi(m.maDoiA))+' <b>vs</b> '+(m.maDoiB?esc(tenDoi(m.maDoiB)):'<i class="muted">(chờ)</i>')+'</span>'
          +(m.gioThiDau?'<span class="muted" style="font-size:11px;white-space:nowrap">🕒 '+esc(m.gioThiDau)+'</span>':'')
          +'<span class="sched-btns">'
          +'<button class="btn outline sm" onclick="dtTran(\''+m.maTran+'\',-1)" title="Lên">▲</button>'
          +'<button class="btn outline sm" onclick="dtTran(\''+m.maTran+'\',1)" title="Xuống">▼</button>'
          +'<button class="btn danger sm" onclick="xoaTranUI(\''+m.maTran+'\')">🗑</button></span></div>';
      });
      h+='</div>';
    });
  }
  h+='</div>';
  $('view').innerHTML=h;
}
function taoDoiGiaoHuu(){
  var ten=$('ghTen').value.trim(); if(!ten){toast('Nhập tên đội','err');return;}
  srv('themDoiGiaoHuu',[STATE.token,ten,$('ghMau').value.trim(),$('ghLogo').value.trim(),$('ghKhung').value.trim()]).then(function(r){
    toast((r&&r.msg)||'Xong', r&&r.ok?'ok':'err'); if(r&&r.ok) tai();
  });
}
function xoaDoiGH(maDoi){ if(!confirm('Xóa đội giao hữu này? (gỡ cầu thủ khỏi đội)'))return;
  srv('xoaDoi',[STATE.token,maDoi]).then(function(r){toast((r&&r.msg)||'Xong',r&&r.ok?'ok':'err'); if(r&&r.ok) tai();});
}
function suaDoiGH(maDoi){
  var t=doiObj(maDoi); if(!t)return;
  var ten=prompt('Tên đội:',t.tenDoi); if(ten===null)return;
  var logo=prompt('Link logo đội:',t.logoUrl||''); if(logo===null)return;
  var mau=prompt('Màu áo:',t.mauAo||''); if(mau===null)return;
  var khung=prompt('Link khung viền thẻ riêng (PNG, để trống = mặc định):',t.khungThe||''); if(khung===null)return;
  srv('suaDoi',[STATE.token,maDoi,ten,undefined,mau,undefined,logo]).then(function(r){
    srv('datKhungThe',[STATE.token,maDoi,khung.trim()]).then(function(){
      toast((r&&r.msg)||'Đã cập nhật đội','ok'); tai();
    });
  });
}
function themCTGiaoHuu(maDoi){
  var p={ hoTen:($('ap_ten_'+maDoi)||{}).value||'', tenAo:($('ap_ao_'+maDoi)||{}).value||'',
    soAo:($('ap_so_'+maDoi)||{}).value||'', sizeAo:($('ap_size_'+maDoi)||{}).value||'',
    maNV:($('ap_nv_'+maDoi)||{}).value||'', maXuong:($('ap_xuong_'+maDoi)||{}).value||'' };
  p.hoTen=String(p.hoTen).trim();
  if(!p.hoTen){toast('Nhập họ tên','err');return;}
  srv('themCauThuVaoDoi',[STATE.token,p,maDoi]).then(function(r){toast((r&&r.msg)||'Xong',r&&r.ok?'ok':'err'); if(r&&r.ok) tai();});
}
function chonNguoiDaDK(maDoi){
  var sel=$('pk_'+maDoi); if(!sel||!sel.value){toast('Chọn cầu thủ đã đăng ký','err');return;}
  srv('ganCauThuVaoDoi',[STATE.token,sel.value,maDoi]).then(function(r){toast((r&&r.msg)||'Xong',r&&r.ok?'ok':'err'); if(r&&r.ok) tai();});
}
function taoTranKhaiMac(){
  var a=$('kmA').value,b=$('kmB').value;
  if(a===b){toast('2 đội phải khác nhau','err');return;}
  srv('taoTranGiaoHuu',[STATE.token,a,b,$('kmNhan').value.trim(),$('kmGio').value.trim(),$('kmSan').value.trim()]).then(function(r){toast((r&&r.msg)||'Xong',r&&r.ok?'ok':'err'); if(r&&r.ok) tai();});
}
function taoTranThuCongUI(){
  var a=$('mtA').value,b=$('mtB').value;
  if(!a||!b){toast('Chọn đủ 2 đội','err');return;}
  srv('taoTranThuCong',[STATE.token,a,b,$('mtVong').value.trim(),$('mtGio').value.trim(),$('mtSan').value.trim()]).then(function(r){toast((r&&r.msg)||'Xong',r&&r.ok?'ok':'err'); if(r&&r.ok) tai();});
}
function dtTran(maTran,huong){
  srv('doiThuTuTran',[STATE.token,maTran,huong]).then(function(r){ if(r&&r.ok){ tai(); } else toast((r&&r.msg)||'Lỗi','err'); });
}
function xoaTranUI(maTran){ if(!confirm('Xóa trận này?'))return;
  srv('xoaTran',[STATE.token,maTran]).then(function(r){toast((r&&r.msg)||'Xong',r&&r.ok?'ok':'err'); if(r&&r.ok) tai();});
}

/* ================= BXH — dựng HTML dùng lại được ================= */
function bxhCardHtml_(compact){
  var bxh=STATE.data.bxh||{}, arr=bxh['TatCa']||[];
  var h='';
  var ck=STATE.data.tranDau.filter(function(t){return t.vongDau==='Chung kết';})[0];
  if(ck){
    var da=ck.trangThai==='Đã đá'&&ck.banThangA!==''&&ck.banThangB!=='';
    if(da&&ck.banThangA!==ck.banThangB){
      var win=ck.banThangA>ck.banThangB?ck.maDoiA:ck.maDoiB;
      h+='<div class="champ"><div class="t">🏆 Nhà vô địch</div><div class="n">'+esc(tenDoi(win))+'</div></div>';
    }
    var aw=da&&ck.banThangA>ck.banThangB, bw=da&&ck.banThangB>ck.banThangA;
    var click=(isAdmin())?(' onclick="modalTySo(\''+ck.maTran+'\')" style="cursor:pointer"'):'';
    h+='<div class="card"><h2>🥇 Chung kết</h2>'
      +'<div class="ko" style="max-width:420px;margin:0 auto"'+click+'>'
      +'<div class="r"><span class="'+(aw?'win':'')+'">'+esc(tenDoi(ck.maDoiA))+'</span>'
      +'<span class="s">'+(da?ck.banThangA:'')+'</span></div>'
      +'<div class="r"><span class="'+(bw?'win':'')+'">'+esc(tenDoi(ck.maDoiB))+'</span>'
      +'<span class="s">'+(da?ck.banThangB:'')+'</span></div></div>'
      +((ck.gioThiDau||ck.sanDau)?'<div class="muted" style="text-align:center;margin-top:10px">'+esc([ck.gioThiDau,ck.sanDau].filter(Boolean).join(' · '))+'</div>':'')
      +'</div>';
  }
  if(!arr.length){
    h+='<div class="card"><h2>🏆 Bảng xếp hạng</h2><div class="empty">Chưa có dữ liệu xếp hạng.'+
      (isAdmin()?' Tạo đội và lịch thi đấu trước.':'')+'</div></div>';
  } else {
    var soQua=Number(STATE.data.soQua)||2;
    var cols = compact
      ? '<th class="num">#</th><th>Đội</th><th class="num">Tr</th><th class="num">HS</th><th class="num">Đ</th>'
      : '<th class="num">#</th><th>Đội</th><th class="num">Tr</th><th class="num">T</th><th class="num">H</th><th class="num">B</th><th class="num">BT</th><th class="num">BB</th><th class="num">HS</th><th class="num">Đ</th><th>Phong độ</th>';
    h+='<div class="card"><h2>🏆 Bảng xếp hạng</h2><table class="bxh-table bxh-moi'+(compact?' compact':'')+'"><thead><tr>'
      +cols+'</tr></thead><tbody>';
    arr.forEach(function(o){
      var qua=o.hang<=soQua;
      var cell=(compact
        ? '<td class="num">'+o.st+'</td>'
        : '<td class="num">'+o.st+'</td><td class="num">'+o.t+'</td><td class="num">'+o.h+'</td><td class="num">'+o.b_+'</td><td class="num">'+o.bt+'</td><td class="num">'+o.bb+'</td>')
        +'<td class="num bxh-hs">'+(o.hs>0?'+':'')+o.hs+'</td>'
        +'<td class="num"><span class="bxh-diem">'+o.diem+'</span></td>'
        +(compact?'':'<td>'+phongDoHtml_(o.maDoi)+'</td>');
      h+='<tr class="'+(qua?'qua':'')+(o.hang===soQua?' ranh':'')+'">'
        +'<td class="num"><span class="bxh-hang">'+o.hang+'</span></td>'
        +'<td><span class="bxh-doi">'+logoDoiHtml(o.maDoi,compact?28:38)+'<b>'+esc(compact?tenDoiNgan_(o.tenDoi):o.tenDoi)+'</b></span></td>'+cell+'</tr>';
    });
    h+='</tbody></table><div class="bxh-chu">'
      +'<span><i class="bxh-vach"></i>Top '+soQua+' vào <b>Chung kết</b></span><span>Thắng 3đ · Hòa 1đ</span>'
      +(compact?'':'<span><span class="pd t">T</span>Thắng <span class="pd h">H</span>Hòa <span class="pd b">B</span>Thua</span>')
      +'</div></div>';
  }
  return h;
}

/* Phong độ: kết quả các trận giải chung đã đá của đội (cũ → mới, tối đa 5 trận) */
function phongDoHtml_(maDoi){
  var ds=(STATE.data.tranDau||[]).filter(function(m){ return tranDaDa_(m) && !laTranGiaoHuu_(m) && (m.maDoiA===maDoi || m.maDoiB===maDoi); })
    .sort(function(a,b){ var x=bdGio_(a.gioThiDau), y=bdGio_(b.gioThiDau); return (x?x.getTime():0)-(y?y.getTime():0) || (Number(a.thuTuKO)||0)-(Number(b.thuTuKO)||0); })
    .slice(-5);
  if(!ds.length) return '<span class="muted">—</span>';
  return '<span class="bxh-pd">'+ds.map(function(m){
    var ta=m.maDoiA===maDoi, mine=ta?m.banThangA:m.banThangB, opp=ta?m.banThangB:m.banThangA;
    var k=mine>opp?'t':mine<opp?'b':'h', ch={t:'T',h:'H',b:'B'}[k];
    return '<span class="pd '+k+'" title="'+esc(tenDoi(ta?m.maDoiB:m.maDoiA))+' '+mine+'–'+opp+'">'+ch+'</span>';
  }).join('')+'</span>';
}

/* ================= VIEW: BXH (giữ lại, không còn tab) ================= */
function viewBXH(){
  var h=bxhCardHtml_(false);
  h+='<div id="tkBox"><div class="loadwrap" style="padding:20px"><div class="spin"></div></div></div>';
  $('view').innerHTML=h;
  renderThongKe();
}

function renderThongKe(){
  srv('thongKe',[STATE.token]).then(function(r){
    var box=$('tkBox'); if(!box) return;
    if(!r||!r.ok){ box.innerHTML='<div class="card"><div class="empty">Lỗi tải thống kê.</div></div>'; return; }
    var h='<div class="hero">'
      +'<div class="stat"><div class="n">'+r.tongBanThang+'</div><div class="l">⚽ Bàn thắng</div></div>'
      +'<div class="stat"><div class="n">'+r.tongTheVang+'</div><div class="l">🟨 Thẻ vàng</div></div>'
      +'<div class="stat"><div class="n">'+r.tongTheDo+'</div><div class="l">🟥 Thẻ đỏ</div></div>'
      +'</div>';
    h+='<div class="card"><h2>👟 Vua phá lưới</h2>';
    if(!r.vuaPhaLuoi.length){ h+='<div class="muted">Chưa có bàn thắng nào được ghi nhận.</div>'; }
    else {
      r.vuaPhaLuoi.slice(0,20).forEach(function(p,i){
        h+='<div class="scorer-row'+(i===0?' top1':i===1?' top2':i===2?' top3':'')+'">'
          +'<div class="rank">'+(i+1)+'</div>'
          +'<div class="info"><div class="name">'+esc(p.hoTen)+'</div>'
          +'<div class="sub">'+esc(tenDoi(p.maDoi))
          +(p.tenXuong?' · '+esc(p.tenXuong):'')
          +(p.maNV?' · '+esc(p.maNV):'')+'</div></div>'
          +'<div class="val">'+p.soLuong+'</div></div>';
      });
    }
    h+='</div>';
    h+='<div class="card"><h2>🟨 Thẻ vàng</h2>';
    if(!r.theVang.length){ h+='<div class="muted">Chưa có thẻ vàng nào.</div>'; }
    else {
      r.theVang.forEach(function(p,i){
        h+='<div class="scorer-row"><div class="rank" style="background:rgba(255,214,10,.2);color:#fbbf24">'+(i+1)+'</div>'
          +'<div class="info"><div class="name">'+esc(p.hoTen)+'</div>'
          +'<div class="sub">'+esc(tenDoi(p.maDoi))+(p.tenXuong?' · '+esc(p.tenXuong):'')+'</div></div>'
          +'<div class="val" style="color:var(--vang)">'+p.soLuong+'</div></div>';
      });
    }
    h+='</div>';
    h+='<div class="card"><h2>🟥 Thẻ đỏ</h2>';
    if(!r.theDo.length){ h+='<div class="muted">Chưa có thẻ đỏ nào.</div>'; }
    else {
      r.theDo.forEach(function(p,i){
        h+='<div class="scorer-row"><div class="rank" style="background:rgba(239,68,68,.2);color:#f87171">'+(i+1)+'</div>'
          +'<div class="info"><div class="name">'+esc(p.hoTen)+'</div>'
          +'<div class="sub">'+esc(tenDoi(p.maDoi))+(p.tenXuong?' · '+esc(p.tenXuong):'')+'</div></div>'
          +'<div class="val" style="color:var(--do)">'+p.soLuong+'</div></div>';
      });
    }
    h+='</div>';
    box.innerHTML=h;
  });
}

/* ================= VIEW: ĐĂNG KÝ ================= */
function viewDangKy(){
  var d=STATE.data;
  var xuongOpts=d.phongBan.map(function(p){
    return '<option value="'+esc(p.maXuong)+'">'+esc(p.tenXuong)+'</option>';
  }).join('');
  var sizeOpts = [
    {v:'S',    g:'39-45kg · ≤1m50'},
    {v:'M',    g:'46-55kg · ≤1m65'},
    {v:'L',    g:'56-65kg · ≤1m75'},
    {v:'XL',   g:'66-75kg · ≤1m83'},
    {v:'2XL',  g:'76-85kg · ≤1m85'},
    {v:'3XL',  g:'86-95kg · ≤1m90'},
    {v:'4-5XL',g:'>125kg · ≤1m95'}
  ].map(function(o){
    return '<option value="'+o.v+'">'+o.v+' — '+o.g+'</option>';
  }).join('');

  var h='<div class="card"><h2>📝 Đăng ký tham gia giải</h2>'
    +'<p class="muted" style="margin-bottom:16px">'
    +'Điền thông tin để BTC xếp bạn vào đội qua bốc thăm.</p>'
    +'<div class="grid2">'
    +'<div><label>Mã nhân viên <span class="req">*</span></label>'
    +'<input id="dkMaNV" placeholder="NV001" style="text-transform:uppercase"></div>'
    +'<div><label>Họ tên <span class="req">*</span></label>'
    +'<input id="dkHoTen" placeholder="Nguyễn Văn A"></div>'
    +'</div>'
    +'<div class="grid2">'
    +'<div><label>Xưởng / Bộ phận <span class="req">*</span></label>'
    +'<select id="dkXuong"><option value="">— Chọn xưởng —</option>'+xuongOpts+'</select></div>'
    +'<div><label>Size áo (theo bảng Châu Á)</label>'
    +'<select id="dkSize"><option value="">— Chọn size —</option>'+sizeOpts+'</select>'
    +'<div class="muted" style="margin-top:6px;font-size:11.5px;line-height:1.7">'
    +'📏 <b>S</b>: 39-45kg · <b>M</b>: 46-55kg · <b>L</b>: 56-65kg<br>'
    +'<b>XL</b>: 66-75kg · <b>2XL</b>: 76-85kg · <b>3XL</b>: 86-95kg · <b>4-5XL</b>: >125kg'
    +'</div>'
    +'</div>'
    +'<label>Tên trên áo (in lên lưng áo)</label>'
    +'<input id="dkTenAo" placeholder="VD: AN, BINH, TÙNG..." style="text-transform:uppercase" maxlength="15">'
    +'<label>Vị trí có thể chơi (chọn 1 hoặc nhiều) <span class="req">*</span></label>'
    +'<div class="pos-check">'
    +'<input type="checkbox" id="dkVT_TM" value="TM"><label for="dkVT_TM" onclick="this.classList.toggle(\'on\')">🧤 Thủ môn</label>'
    +'<input type="checkbox" id="dkVT_HVTT" value="HVTT"><label for="dkVT_HVTT" onclick="this.classList.toggle(\'on\')">🛡️ HV trung tâm</label>'
    +'<input type="checkbox" id="dkVT_HVCT" value="HVCT"><label for="dkVT_HVCT" onclick="this.classList.toggle(\'on\')">🏃 HV cánh</label>'
    +'<input type="checkbox" id="dkVT_TV" value="TV"><label for="dkVT_TV" onclick="this.classList.toggle(\'on\')">⚙️ Tiền vệ</label>'
    +'<input type="checkbox" id="dkVT_TD" value="TD"><label for="dkVT_TD" onclick="this.classList.toggle(\'on\')">⚡ Tiền đạo</label>'
    +'</div>'
    +'<label>Tự đánh giá trình độ <span class="req">*</span></label>'
    +'<select id="dkHatGiong">'
    +'<option value="">— Chọn mức —</option>'
    +'<option value="BIET">👍 Biết đá</option>'
    +'<option value="PT">🎉 Phong trào</option>'
    +'</select>'
    +'<label>Ghi chú</label>'
    +'<input id="dkGhiChu" placeholder="tùy chọn">'
    +'<button class="btn neon block" style="margin-top:20px;padding:14px;font-size:15px" onclick="dangKy()" id="btnDK">🎯 ĐĂNG KÝ</button>'
    +'</div>';

  var chuaDoi=d.cauThu.filter(function(c){return !c.maDoi;});
  h+='<div class="card"><h2>⏳ Đã ĐK · chưa chia đội ('+chuaDoi.length+')</h2>';
  if(!chuaDoi.length){
    h+='<div class="muted">Chưa có ai đang chờ.</div>';
  } else {
    h+='<table><thead><tr><th>Cầu thủ</th><th>Tên thật</th><th>Mã NV</th><th>Xưởng</th><th>Vị trí</th><th>Hạt giống</th><th>Size</th>'
      +(isAdmin()?'<th></th>':'')+'</tr></thead><tbody>';
    chuaDoi.forEach(function(c){
      h+='<tr>'
        +'<td><b>'+esc(c.hoTen)+'</b>'
        +(c.tenAo?' <span style="color:var(--cam2);font-size:11.5px">('+esc(c.tenAo)+')</span>':'')
        +'</td>'
        +'<td style="color:var(--neon);font-weight:600">'+esc(c.tenThat||'—')+'</td>'
        +'<td class="muted" style="font-size:12.5px">'+esc(c.maNV||'')+'</td>'
        +'<td class="muted">'+esc(c.tenXuong||'')+'</td>'
        +'<td>'+viTriListHtml(c.viTriList)+'</td>'
        +'<td>'+hatGiongPill(c.hatGiong)+'</td>'
        +'<td>'+(c.sizeAo?'<span class="pill size">'+esc(c.sizeAo)+'</span>':'<span class="muted">—</span>')+'</td>';
      if(isAdmin()){
        h+='<td class="rowbtn">'
          +'<button class="btn outline sm" onclick="modalSuaCauThu(\''+c.maCT+'\')">✏️</button>'
          +'<button class="btn danger sm" onclick="xoaCT(\''+c.maCT+'\')">Xóa</button>'
          +'</td>';
      }
      h+='</tr>';
    });
    h+='</tbody></table>';
  }
  h+='</div>';
  $('view').innerHTML=h;
}
function dangKy(){
  var maNV=$('dkMaNV').value.trim().toUpperCase();
  var hoTen=$('dkHoTen').value.trim();
  var maXuong=$('dkXuong').value;
  var sizeAo=$('dkSize').value;
  var tenAo=$('dkTenAo').value.trim().toUpperCase();
  var hatGiong=$('dkHatGiong').value;
  var ghiChu=$('dkGhiChu').value;

  var viTri=[];
  ['TM','HVTT','HVCT','TV','TD'].forEach(function(v){
    var cb=$('dkVT_'+v);
    if(cb && cb.checked) viTri.push(v);
  });

  if(!maNV){toast('Nhập mã NV','err');return;}
  if(!hoTen){toast('Nhập họ tên','err');return;}
  if(!maXuong){toast('Chọn xưởng','err');return;}
  if(!viTri.length){toast('Chọn ít nhất 1 vị trí','err');return;}
  if(!hatGiong){toast('Chọn mức tự đánh giá','err');return;}

  var payload={
    maNV:maNV, hoTen:hoTen, maXuong:maXuong,
    sizeAo:sizeAo, tenAo:tenAo,
    viTriList:viTri,
    hatGiong:hatGiong,
    ghiChu:ghiChu
  };

  $('btnDK').innerHTML='<span class="spin"></span>';
  $('btnDK').disabled=true;
  srv('dangKyCauThu',[payload]).then(function(r){
    $('btnDK').textContent='🎯 ĐĂNG KÝ';
    $('btnDK').disabled=false;
    toast((r&&r.msg)||'Xong',r&&r.ok?'ok':'err');
    if(r&&r.ok) tai();
  }).catch(function(e){
    $('btnDK').textContent='🎯 ĐĂNG KÝ';
    $('btnDK').disabled=false;
    toast('Lỗi: '+e.message,'err');
  });
}

/* ================= MODAL: TỶ SỐ ================= */
function modalTySo(maTran){
  var m=STATE.data.tranDau.filter(function(t){return t.maTran===maTran;})[0];
  if(!m)return;
  $('mGenericBox').innerHTML='<h2 style="margin:0 0 4px;font-size:20px;font-family:\'Oswald\';letter-spacing:1px;color:var(--neon)">⚽ TRẬN ĐẤU</h2>'
    +'<div style="text-align:center;margin:8px 0 16px;font-weight:700;font-size:15px">'
    +esc(tenDoi(m.maDoiA))+' <span class="muted" style="font-weight:400">vs</span> '+esc(tenDoi(m.maDoiB))
    +'</div>'
    +'<div class="modal-sec">'
    +'<div class="modal-sec-title">🕒 Giờ & sân thi đấu</div>'
    +'<div class="grid2">'
    +'<div><label>Giờ thi đấu</label>'
    +'<input id="tsGio" value="'+esc(m.gioThiDau||'')+'" placeholder="VD: 17:00 20/9"></div>'
    +'<div><label>Sân</label>'
    +'<input id="tsSan" value="'+esc(m.sanDau||'')+'" placeholder="VD: Sân số 3"></div>'
    +'</div>'
    +'<button class="btn neon block" style="margin-top:12px" onclick="luuGioSan(\''+maTran+'\')">💾 Lưu giờ & sân</button>'
    +'</div>'
    +'<div class="modal-sec">'
    +'<div class="modal-sec-title">⚽ Tỷ số</div>'
    +'<div class="grid2">'
    +'<div><label>'+esc(tenDoi(m.maDoiA))+'</label>'
    +'<input id="tsA" type="number" min="0" value="'+(m.banThangA!==''?m.banThangA:'')+'" '
    +'style="text-align:center;font-size:28px;font-weight:800;font-family:var(--ff-mono);letter-spacing:1px"></div>'
    +'<div><label>'+esc(tenDoi(m.maDoiB))+'</label>'
    +'<input id="tsB" type="number" min="0" value="'+(m.banThangB!==''?m.banThangB:'')+'" '
    +'style="text-align:center;font-size:28px;font-weight:800;font-family:var(--ff-mono);letter-spacing:1px"></div>'
    +'</div>'
    +'<button class="btn cam block" style="margin-top:12px" onclick="luuTySo(\''+maTran+'\')">💾 Lưu tỷ số</button>'
    +'</div>'
    +'<button class="btn outline block" onclick="closeModal(\'mGeneric\');modalSuKien(\''+maTran+'\')">📋 Nhập bàn thắng / thẻ vàng / thẻ đỏ</button>'
    +'<button class="btn outline block" style="margin-top:10px" onclick="closeModal(\'mGeneric\')">Đóng</button>';
  openModal('mGeneric');
}
function luuGioSan(maTran){
  var gio=$('tsGio').value, san=$('tsSan').value;
  srv('datThongTinTran',[STATE.token,maTran,san,gio]).then(function(r){
    toast((r&&r.ok)?'Đã lưu giờ & sân':((r&&r.msg)||'Lỗi'),r&&r.ok?'ok':'err');
    if(r&&r.ok){closeModal('mGeneric');tai();}
  });
}
function luuTySo(maTran){
  var a=$('tsA').value,b=$('tsB').value;
  if(a===''||b===''){toast('Nhập cả hai tỷ số','err');return;}
  srv('capNhatTySo',[STATE.token,maTran,a,b]).then(function(r){
    toast((r&&r.msg)||'Xong',r&&r.ok?'ok':'err');
    if(r&&r.ok){closeModal('mGeneric');tai();}
  });
}

/* ================= MODAL: SỰ KIỆN TRẬN ================= */
function modalSuKien(maTran){
  var m=STATE.data.tranDau.filter(function(t){return t.maTran===maTran;})[0];
  if(!m)return;
  var cA=cauThuTrongDoi(m.maDoiA, true);
  var cB=cauThuTrongDoi(m.maDoiB, true);
  var allC=cA.concat(cB);
  if(!allC.length){
    toast('Chưa có cầu thủ trong 2 đội','err');return;
  }
  var opts=allC.map(function(c){
    return '<option value="'+esc(c.maCT)+'">'
      +esc(c.hoTen)
      +(c.tenAo?' ('+esc(c.tenAo)+')':'')
      +' — '+esc(tenDoi(c.maDoi))+'</option>';
  }).join('');

  var sk=STATE.data.suKien.filter(function(s){return s.maTran===maTran;});
  var skHtml='';
  if(sk.length){
    sk.sort(function(a,b){return a.phut-b.phut;});
    skHtml='<div style="margin-top:14px"><label>Sự kiện đã nhập ('+sk.length+')</label>';
    sk.forEach(function(s){
      var c=cauThuObj(s.maCT);
      var loaiTxt=s.loai==='BAN'?'⚽ Bàn thắng':s.loai==='VANG'?'🟨 Thẻ vàng':'🟥 Thẻ đỏ';
      var loaiCls=s.loai==='BAN'?'sk-ban':s.loai==='VANG'?'sk-vang':'sk-do';
      skHtml+='<div class="sk-row">'
        +'<span class="phut">'+s.phut+"'</span>"
        +'<span class="pill '+loaiCls+'">'+loaiTxt+'</span>'
        +'<span style="flex:1">'+esc(c?c.hoTen:'(?)')
        +' <span class="muted">('+esc(tenDoi(s.maDoi))+')</span></span>'
        +'<button class="btn danger sm" onclick="xoaSK(\''+s.maSK+'\',\''+maTran+'\')">Xóa</button>'
        +'</div>';
    });
    skHtml+='</div>';
  }

  $('mGenericBox').innerHTML='<h2 style="margin:0 0 4px;font-size:20px;font-family:\'Oswald\';letter-spacing:1px;color:var(--neon)">📋 SỰ KIỆN TRẬN</h2>'
    +'<p class="muted" style="margin-bottom:14px">'
    +esc(tenDoi(m.maDoiA))+' vs '+esc(tenDoi(m.maDoiB))+'</p>'
    +'<label>Loại sự kiện</label>'
    +'<select id="skLoai">'
    +'<option value="BAN">⚽ Bàn thắng</option>'
    +'<option value="VANG">🟨 Thẻ vàng</option>'
    +'<option value="DO">🟥 Thẻ đỏ</option>'
    +'</select>'
    +'<div class="grid2">'
    +'<div><label>Phút</label>'
    +'<input id="skPhut" type="number" min="1" max="120" placeholder="12" value="1"></div>'
    +'<div><label>Cầu thủ</label>'
    +'<select id="skCT">'+opts+'</select></div>'
    +'</div>'
    +'<button class="btn neon block" style="margin-top:14px" onclick="luuSK(\''+maTran+'\')">➕ Thêm sự kiện</button>'
    +skHtml
    +'<div style="margin-top:16px">'
    +'<button class="btn outline block" onclick="closeModal(\'mGeneric\')">Đóng</button>'
    +'</div>';
  openModal('mGeneric');
}
function luuSK(maTran){
  var loai=$('skLoai').value;
  var phut=$('skPhut').value;
  var maCT=$('skCT').value;
  if(!phut || Number(phut)<1){toast('Nhập phút hợp lệ','err');return;}
  if(!maCT){toast('Chọn cầu thủ','err');return;}
  srv('themSuKien',[STATE.token,maTran,loai,phut,maCT]).then(function(r){
    toast((r&&r.msg)||'Xong',r&&r.ok?'ok':'err');
    if(r&&r.ok){ tai(); modalSuKien(maTran); }
  });
}
function xoaSK(maSK,maTran){
  if(!confirm('Xóa sự kiện này?'))return;
  srv('xoaSuKien',[STATE.token,maSK]).then(function(r){
    toast((r&&r.msg)||'Xong',r&&r.ok?'ok':'err');
    if(r&&r.ok){ tai(); modalSuKien(maTran); }
  });
}

/* ================= MODAL: SỬA CẦU THỦ ================= */
function modalSuaCauThu(maCT){
  var c = cauThuObj(maCT);
  if(!c){ toast('Không tìm thấy cầu thủ','err'); return; }
  var d = STATE.data;
  var xuongOpts = d.phongBan.map(function(p){
    return '<option value="'+esc(p.maXuong)+'"'+(c.maXuong===p.maXuong?' selected':'')+'>'
      +esc(p.tenXuong)+'</option>';
  }).join('');
  var sizeOpts = ['','S','M','L','XL','2XL','3XL','4-5XL'].map(function(s){
    return '<option value="'+s+'"'+(String(c.sizeAo||'')===s?' selected':'')+'>'+(s||'— Chọn size —')+'</option>';
  }).join('');
  var viTri = String(c.viTriList||'').toUpperCase().split(',').filter(function(v){return v;});
  function posChk(v,label){
    var on = viTri.indexOf(v)>=0;
    return '<label class="'+(on?'on':'')+'" data-pos="'+v+'" onclick="this.classList.toggle(\'on\')">'+label+'</label>';
  }

  $('mGenericBox').innerHTML =
    '<h2 style="margin:0 0 12px;font-size:20px;font-family:var(--ff-title);letter-spacing:1px;color:var(--neon)">✏️ SỬA CẦU THỦ</h2>'
    +'<div class="muted" style="margin-bottom:10px;font-size:13px">'+esc(c.hoTen)+' · NV: '+esc(c.maNV||'—')+'</div>'
    +'<label>Họ tên</label>'
    +'<input id="scHoTen" value="'+esc(c.hoTen||'')+'" disabled style="opacity:.6">'
    +'<div class="grid2">'
    +'<div><label>Xưởng</label><select id="scXuong">'+xuongOpts+'</select></div>'
    +'<div><label>Size áo</label><select id="scSize">'+sizeOpts+'</select></div>'
    +'</div>'
    +'<div class="grid2">'
    +'<div><label>Số áo</label><input id="scSoAo" value="'+esc(c.soAo||'')+'" maxlength="3"></div>'
    +'<div><label>Tên áo</label><input id="scTenAo" value="'+esc(c.tenAo||'')+'" style="text-transform:uppercase" maxlength="15"></div>'
    +'</div>'
    +'<label>Vị trí (chọn 1 hoặc nhiều)</label>'
    +'<div class="pos-check">'
    + posChk('TM','🧤 Thủ môn')
    + posChk('HVTT','🛡️ HV trung tâm')
    + posChk('HVCT','🏃 HV cánh')
    + posChk('TV','⚙️ Tiền vệ')
    + posChk('TD','⚡ Tiền đạo')
    +'</div>'
    +'<label>Trình độ</label>'
    +'<select id="scHatGiong">'
    +'<option value="">— Chưa gán —</option>'
    +'<option value="BIET"'+(c.hatGiong==='BIET'?' selected':'')+'>👍 Biết đá</option>'
    +'<option value="PT"'+(c.hatGiong==='PT'?' selected':'')+'>🎉 Phong trào</option>'
    +'</select>'
    +'<label>Loại thẻ</label>'
    +'<select id="scLoaiThe">'
    +'<option value="bac"'+(c.loaiThe==='bac'?' selected':'')+'>🥈 Bạc</option>'
    +'<option value="vang"'+(c.loaiThe==='vang'?' selected':'')+'>🔴 Đỏ</option>'
    +'<option value="kimcuong"'+(c.loaiThe==='kimcuong'?' selected':'')+'>🔵 Xanh</option>'
    +'<option value="huyenthoai"'+(c.loaiThe==='huyenthoai'?' selected':'')+'>✨ Huyền thoại</option>'
    +'</select>'
    +'<label>Ghi chú</label>'
    +'<input id="scGhiChu" value="'+esc(c.ghiChu||'')+'">'
    +'<div style="display:flex;gap:8px;margin-top:18px">'
    +'<button class="btn neon block" onclick="luuSuaCauThu(\''+maCT+'\')">💾 Lưu</button>'
    +'<button class="btn outline" onclick="closeModal(\'mGeneric\')">Đóng</button>'
    +'</div>';
  openModal('mGeneric');
}

function luuSuaCauThu(maCT){
  var viTri = [];
  document.querySelectorAll('#mGenericBox .pos-check label.on').forEach(function(lab){
    var v = lab.dataset.pos;
    if(v) viTri.push(v);
  });
  var fields = {
    soAo:      $('scSoAo').value.trim(),
    tenAo:     $('scTenAo').value.trim(),
    sizeAo:    $('scSize').value,
    hatGiong:  $('scHatGiong').value,
    ghiChu:    $('scGhiChu').value.trim(),
    viTriList: viTri,
    loaiThe:   $('scLoaiThe').value
  };
  srv('capNhatCauThu', [STATE.token, maCT, fields]).then(function(r){
    toast((r&&r.msg)||'Xong', r&&r.ok?'ok':'err');
    if(r&&r.ok){ closeModal('mGeneric'); tai(); }
  });
}

function xoaCT(maCT){
  var c = cauThuObj(maCT);
  if(!c) return;
  if(!confirm('Xóa cầu thủ "'+c.hoTen+'"?')) return;
  srv('xoaCauThu', [STATE.token, maCT]).then(function(r){
    toast((r&&r.msg)||'Xong', r&&r.ok?'ok':'err');
    if(r&&r.ok) tai();
  });
}

/* ================= VIEW: BỐC THĂM 3 BƯỚC ================= */
function viewBoc(){
  if(!isAdmin()){
    $('view').innerHTML='<div class="card"><div class="empty">Cần đăng nhập BTC.</div></div>';
    return;
  }
  var h='<div class="dice-hero">'
    +'<div class="icon">🎲</div>'
    +'<h2>BỐC THĂM CHIA ĐỘI</h2>'
    +'<p>B1: Bốc đội trưởng (để riêng) · B2: Chia cầu thủ vào đội · B3: Đội trưởng bốc đội mình</p>'
    +'</div>'
    +'<div id="bocContent"><div class="loadwrap"><div class="spin"></div></div></div>';
  $('view').innerHTML=h;
  srv('trangThaiChiaDoi',[STATE.token]).then(renderBoc);
}

function renderBoc(tt){
  if(!tt||!tt.ok){
    $('bocContent').innerHTML='<div class="card"><div class="empty">Lỗi tải trạng thái: '+(tt&&tt.msg||'')+'</div></div>';
    return;
  }
  window._TT=tt;
  var d=STATE.data, h='';

  h+='<div class="card"><h2>📊 Tổng quan</h2>'
    +'<div class="pos-summary">'
    +'<div class="item"><div class="n">'+tt.soDoi+'</div><div class="l">Đội</div></div>'
    +'<div class="item"><div class="n">'+tt.soDTCho+'</div><div class="l">ĐT chờ bốc</div></div>'
    +'<div class="item"><div class="n">'+tt.daChia+'</div><div class="l">CT đã vào đội</div></div>'
    +'<div class="item"><div class="n">'+tt.chuaChia+'</div><div class="l">CT chưa chia</div></div>'
    +'</div>'
    +'<div class="muted" style="margin-top:10px;font-size:13px">'
    +'Chưa chia: 👍 <b style="color:var(--neon)">'+tt.bietChuaChia+'</b> biết đá · '
    +'🎉 <b style="color:var(--cam2)">'+tt.ptChuaChia+'</b> phong trào'
    +'</div></div>';

  if(!tt.soDoi){
    h+='<div class="card"><div class="empty">Chưa có đội nào. Vào tab ⚙️ Quản lý để tạo đội trước.</div></div>';
    $('bocContent').innerHTML=h; return;
  }

  var step1='<div class="step-card"><div class="step-no">1</div>'
    +'<div class="step-body">'
    +'<h2 style="margin:0 0 6px">👑 Bốc chọn đội trưởng</h2>'
    +'<p class="muted" style="margin-bottom:12px">Chọn ứng viên (ít nhất '+tt.soDoi+' người). '
    +'Hệ thống bốc ngẫu nhiên '+tt.soDoi+' đội trưởng và <b>để riêng</b> — chưa xếp vào đội. '
    +'Đội trưởng sẽ tự bốc đội mình ở Bước 3.</p>';
  if(tt.soDTCho){
    step1+='<div style="margin-bottom:12px">'
      +'<div class="muted" style="font-size:12.5px;margin-bottom:6px">Đội trưởng đang chờ bốc đội ('+tt.soDTCho+'):</div>'
      +'<div style="display:flex;flex-wrap:wrap;gap:6px">';
    tt.dtCho.forEach(function(c){
      step1+='<span class="pill captain" style="font-size:13px;padding:6px 12px">👑 '+esc(c.hoTen)
        +(c.hatGiong==='BIET'?' •B':'')+'</span>';
    });
    step1+='</div></div>';
  }
  step1+='<div class="rowbtn">'
    +'<button class="btn neon" onclick="modalBocDT()">🎲 '+(tt.soDTCho?'Bốc lại':'Bốc')+' đội trưởng</button>'
    +(tt.soDTCho?'<button class="btn outline sm" onclick="huyDTCho()">Hủy danh sách</button>':'')
    +(tt.soDTDaCo?'<button class="btn outline sm" onclick="goHetDT()">↩️ Gỡ toàn bộ ĐT</button>':'')
    +'</div>'
    +'</div></div>';
  h+=step1;

  var phaKe = tt.bietChuaChia>0 ? 'biết đá' : (tt.ptChuaChia>0 ? 'phong trào' : '');
  var step2='<div class="step-card"><div class="step-no">2</div>'
    +'<div class="step-body">'
    +'<h2 style="margin:0 0 6px">🎯 Chia cầu thủ vào đội</h2>'
    +'<p class="muted" style="margin-bottom:12px">Mỗi lượt chia <b>1 người/đội</b> ('+tt.soDoi+' người). '
    +'Biết đá chia hết trước, rồi phong trào. Lượt cuối thiếu người thì chia ngẫu nhiên số còn lại. '
    +'<b>Đội trưởng chờ không bị tính vào đây.</b></p>';
  if(tt.chuaChia){
    step2+='<div style="text-align:center;margin-bottom:12px;font-size:13.5px">'
      +'Lượt kế tiếp: <b style="color:'+(phaKe==='biết đá'?'var(--neon)':'var(--cam2)')+'">'+esc(phaKe)+'</b> · '
      +'còn <b>'+tt.chuaChia+'</b> chưa chia</div>';
  } else {
    step2+='<div style="padding:10px 12px;background:rgba(34,211,238,.1);border:1px solid var(--neon);border-radius:10px;color:var(--neon);font-size:13.5px;text-align:center;margin-bottom:12px">'
      +'✅ Đã chia hết cầu thủ vào đội.</div>';
  }
  step2+='<div class="rowbtn">'
    +'<button class="btn cam" style="font-size:16px;padding:14px 30px" onclick="bocLuot()" '+(tt.chuaChia?'':'disabled')+'>🎲 BỐC 1 LƯỢT</button>'
    +'<button class="btn neon" onclick="chiaTatCa()" '+(tt.chuaChia?'':'disabled')+'>⏩ Chia hết luôn</button>'
    +'</div>'
    +'<div class="rowbtn" style="margin-top:8px">'
    +'<button class="btn outline sm" onclick="modalChuyen()">🔁 Chuyển cầu thủ giữa các đội</button>'
    +'<button class="btn outline sm" onclick="resetChia()">🔄 Reset chia (giữ ĐT)</button>'
    +'</div>'
    +'</div></div>';
  h+=step2;

  var step3='<div class="step-card"><div class="step-no">3</div>'
    +'<div class="step-body">'
    +'<h2 style="margin:0 0 6px">🏆 Đội trưởng bốc đội</h2>'
    +'<p class="muted" style="margin-bottom:12px">Từng đội trưởng lên bốc ngẫu nhiên đội mình sẽ dẫn dắt. '
    +'Nên làm sau khi đã chia xong cầu thủ ở Bước 2.</p>';
  if(!tt.soDTCho){
    if(tt.coDTDu && tt.soDTDaCo){
      step3+='<div style="padding:10px 12px;background:rgba(34,211,238,.1);border:1px solid var(--neon);border-radius:10px;color:var(--neon);font-size:13.5px;text-align:center">'
        +'✅ Tất cả đội trưởng đã bốc đội xong.</div>';
    } else {
      step3+='<div class="muted" style="text-align:center;padding:8px">Chưa có đội trưởng chờ. Làm Bước 1 trước.</div>';
    }
  } else {
    step3+='<div style="display:flex;flex-direction:column;gap:8px">';
    tt.dtCho.forEach(function(c){
      step3+='<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:rgba(10,14,30,.5);border:1px solid var(--vien2);border-radius:10px">'
        +'<span style="flex:1;font-weight:600">👑 '+esc(c.hoTen)
        +(c.tenXuong?' <span class="muted" style="font-size:11px">· '+esc(c.tenXuong)+'</span>':'')+'</span>'
        +'<button class="btn cam sm" onclick="dtBoc(\''+c.maCT+'\')">🎲 Bốc đội</button>'
        +'</div>';
    });
    step3+='</div>'
      +'<div class="rowbtn" style="margin-top:10px">'
      +'<button class="btn neon sm" onclick="dtBocHetUI()">⏩ Bốc hết một lần</button>'
      +'</div>';
  }
  step3+='</div></div>';
  h+=step3;

  h+='<div class="card"><h2>⚖️ Cân bằng các đội</h2>'
    +'<table><thead><tr><th>Đội</th><th>ĐT</th><th class="num">Biết đá</th><th class="num">Tổng</th></tr></thead><tbody>';
  tt.thongKeDoi.forEach(function(o){
    h+='<tr><td><b>'+esc(o.tenDoi)+'</b></td>'
      +'<td>'+(o.coDT?'👑':'<span class="muted">—</span>')+'</td>'
      +'<td class="num"><b style="color:var(--neon)">'+o.biet+'</b></td>'
      +'<td class="num">'+o.tong+'</td></tr>';
  });
  h+='</tbody></table></div>';

  if(d.doi.length){
    h+='<div class="card"><h2>🏟️ Đội hình hiện tại</h2><div class="draft-teams">';
    var sapXep=d.doi.slice().sort(function(a,b){
      var ta=Number(a.thuTuBoc)||999, tb=Number(b.thuTuBoc)||999;
      if(ta!==tb) return ta-tb; return a.maDoi.localeCompare(b.maDoi);
    });
    sapXep.forEach(function(team){
      var players=cauThuTrongDoi(team.maDoi, true);
      var dt=team.doiTruong?cauThuObj(team.doiTruong):null;
      var cnt=demViTriDoi(team.maDoi);
      h+='<div class="draft-team">'
        +'<div class="head"><div class="name">'+esc(team.tenDoi)+'</div>'
        +'<span class="badge">'+players.length+'</span></div>'
        +(dt?'<div class="muted" style="font-size:12px;margin-bottom:6px">👑 '+esc(dt.hoTen)+'</div>'
            :'<div class="muted" style="font-size:12px;margin-bottom:6px;color:var(--cam2)">Chưa có ĐT</div>')
        +'<div class="muted" style="font-size:11px;margin-bottom:6px">'
        +'🧤'+cnt.TM+' 🛡️'+cnt.HVTT+' 🏃'+cnt.HVCT+' ⚙️'+cnt.TV+' ⚡'+cnt.TD+'</div>'
        +'<div class="players">';
      if(!players.length) h+='<span class="muted">Chưa có ai</span>';
      players.forEach(function(c){
        var isC=team.doiTruong===c.maCT;
        h+='<span class="p">'+(isC?'👑 ':'')+esc(c.hoTen)
          +(c.hatGiong==='BIET'?' <span style="color:var(--neon);font-size:10px">•B</span>':'')+'</span>';
      });
      h+='</div></div>';
    });
    h+='</div></div>';
  }

  $('bocContent').innerHTML=h;
}
function modalBocDT(){
  var d=STATE.data;
  var ds=d.cauThu.slice().sort(function(a,b){return String(a.hoTen).localeCompare(String(b.hoTen));});
  var rows=ds.map(function(c){
    var goiY=(c.hatGiong==='BIET');
    return '<label class="uv-item">'
      +'<input type="checkbox" class="uvChk" value="'+esc(c.maCT)+'"'+(goiY?' checked':'')+'>'
      +'<span>'+esc(c.hoTen)
      +(c.tenXuong?' <span class="muted" style="font-size:11px">· '+esc(c.tenXuong)+'</span>':'')
      +(c.hatGiong==='BIET'?' <span class="pill sk-ban" style="font-size:10px">Biết đá</span>':'')
      +'</span></label>';
  }).join('');
  $('mGenericBox').innerHTML='<h2 style="margin:0 0 4px;font-size:20px;font-family:var(--ff-title);letter-spacing:1px;color:var(--neon)">👑 BỐC ĐỘI TRƯỞNG</h2>'
    +'<p class="muted" style="margin-bottom:10px">Chọn ít nhất <b>'+d.doi.length+'</b> ứng viên. '
    +'Hệ thống bốc '+d.doi.length+' người làm ĐT (để riêng, bốc đội ở Bước 3).</p>'
    +'<div style="display:flex;gap:8px;margin-bottom:8px">'
    +'<button class="btn outline sm" onclick="uvAll(true)">Chọn tất cả</button>'
    +'<button class="btn outline sm" onclick="uvAll(false)">Bỏ chọn</button>'
    +'</div>'
    +'<div class="uv-list">'+rows+'</div>'
    +'<div style="display:flex;gap:8px;margin-top:16px">'
    +'<button class="btn neon block" onclick="chayBocDT()">🎲 Bốc ngẫu nhiên</button>'
    +'<button class="btn outline" onclick="closeModal(\'mGeneric\')">Đóng</button>'
    +'</div>';
  openModal('mGeneric');
}
function uvAll(v){ document.querySelectorAll('.uvChk').forEach(function(c){c.checked=v;}); }
function chayBocDT(){
  var ds=[];
  document.querySelectorAll('.uvChk:checked').forEach(function(c){ds.push(c.value);});
  if(ds.length<STATE.data.doi.length){ toast('Cần ít nhất '+STATE.data.doi.length+' ứng viên','err'); return; }
  if(!confirm('Bốc '+STATE.data.doi.length+' đội trưởng ngẫu nhiên?\n(ĐT cũ nếu có sẽ được bốc lại.)'))return;
  srv('chonDoiTruongCho',[STATE.token,ds]).then(function(r){
    toast((r&&r.msg)||'Xong',r&&r.ok?'ok':'err');
    if(r&&r.ok){closeModal('mGeneric');tai();}
  });
}
function huyDTCho(){
  if(!confirm('Hủy danh sách đội trưởng chờ?'))return;
  srv('huyDoiTruongCho',[STATE.token]).then(function(r){
    toast((r&&r.msg)||'Xong',r&&r.ok?'ok':'err'); if(r&&r.ok)tai();
  });
}
function goHetDT(){
  if(!confirm('Gỡ toàn bộ đội trưởng (kể cả đã bốc đội)?'))return;
  srv('goToanBoDoiTruong',[STATE.token]).then(function(r){
    toast((r&&r.msg)||'Xong',r&&r.ok?'ok':'err'); if(r&&r.ok)tai();
  });
}
function bocLuot(){
  var btns=document.querySelectorAll('#bocContent button');
  btns.forEach(function(b){b.disabled=true;});
  srv('bocMotLuot',[STATE.token]).then(function(r){
    if(r&&r.ok){ toast((r.xong?'✅ ':'🎲 ')+r.msg,'ok'); tai(); }
    else { toast((r&&r.msg)||'Lỗi','err'); btns.forEach(function(b){b.disabled=false;}); }
  }).catch(function(e){toast('Lỗi: '+e.message,'err');btns.forEach(function(b){b.disabled=false;});});
}
function chiaTatCa(){
  if(!confirm('Chia hết cầu thủ chưa có đội trong một lần (2 pha)?'))return;
  var btns=document.querySelectorAll('#bocContent button');
  btns.forEach(function(b){b.disabled=true;});
  srv('chiaDoiTatCa',[STATE.token]).then(function(r){
    toast((r&&r.msg)||'Xong',r&&r.ok?'ok':'err');
    if(r&&r.ok)tai(); else btns.forEach(function(b){b.disabled=false;});
  }).catch(function(e){toast('Lỗi: '+e.message,'err');btns.forEach(function(b){b.disabled=false;});});
}
function resetChia(){
  if(!confirm('Gỡ cầu thủ (không phải ĐT) về chưa chia?'))return;
  srv('resetChiaDoi',[STATE.token]).then(function(r){
    toast((r&&r.msg)||'Xong',r&&r.ok?'ok':'err'); if(r&&r.ok)tai();
  });
}
function modalChuyen(){
  var d=STATE.data;
  var dtSet={}; d.doi.forEach(function(t){ if(t.doiTruong) dtSet[t.doiTruong]=true; });
  var coDoi=d.cauThu.filter(function(c){ return c.maDoi && !dtSet[c.maCT]; });
  if(!coDoi.length){ toast('Chưa có cầu thủ nào (không phải ĐT) trong đội để chuyển','err'); return; }
  var optCT=coDoi.sort(function(a,b){return String(tenDoi(a.maDoi)).localeCompare(String(tenDoi(b.maDoi)));})
    .map(function(c){ return '<option value="'+esc(c.maCT)+'">'+esc(c.hoTen)+' — '+esc(tenDoi(c.maDoi))+'</option>'; }).join('');
  var optDoi=d.doi.map(function(t){ return '<option value="'+esc(t.maDoi)+'">'+esc(t.tenDoi)+'</option>'; }).join('');
  $('mGenericBox').innerHTML='<h2 style="margin:0 0 10px;font-size:20px;font-family:var(--ff-title);letter-spacing:1px;color:var(--neon)">🔁 CHUYỂN CẦU THỦ</h2>'
    +'<label>Cầu thủ</label><select id="cvCT">'+optCT+'</select>'
    +'<label>Chuyển sang đội</label><select id="cvDoi">'+optDoi+'</select>'
    +'<div style="display:flex;gap:8px;margin-top:16px">'
    +'<button class="btn neon block" onclick="luuChuyen()">💾 Chuyển</button>'
    +'<button class="btn outline" onclick="closeModal(\'mGeneric\')">Đóng</button>'
    +'</div>';
  openModal('mGeneric');
}
function luuChuyen(){
  var maCT=$('cvCT').value, maDoi=$('cvDoi').value;
  if(!maCT){toast('Chọn cầu thủ','err');return;}
  srv('chuyenCauThu',[STATE.token,maCT,maDoi]).then(function(r){
    toast((r&&r.msg)||'Xong',r&&r.ok?'ok':'err');
    if(r&&r.ok){closeModal('mGeneric');tai();}
  });
}
function dtBoc(maCT){
  srv('dtBocDoi',[STATE.token,maCT]).then(function(r){
    if(r&&r.ok) toast('🏆 '+r.msg,'ok'); else toast((r&&r.msg)||'Lỗi','err');
    if(r&&r.ok)tai();
  });
}
function dtBocHetUI(){
  if(!confirm('Bốc hết đội trưởng còn lại một lần?'))return;
  srv('dtBocHet',[STATE.token]).then(function(r){
    toast((r&&r.msg)||'Xong',r&&r.ok?'ok':'err'); if(r&&r.ok)tai();
  });
}

/* ================= VIEW: HẠT GIỐNG ================= */
function viewHatGiong(){
  if(!isAdmin()){
    $('view').innerHTML='<div class="card"><div class="empty">Cần đăng nhập BTC.</div></div>';
    return;
  }
  var d=STATE.data;
  var xuongOpts=d.phongBan.map(function(p){
    return '<option value="'+esc(p.maXuong)+'">'+esc(p.tenXuong)+'</option>';
  }).join('');

  var h='<div class="card"><h2>🏅 Gán hạt giống & vị trí</h2>'
    +'<p class="muted" style="margin-bottom:12px">'
    +'Hạt giống: <span class="pill biet">👍 Biết đá</span> '
    +'<span class="pill pt">🎉 Phong trào</span>. '
    +'Vị trí: TM · HVTT · HVCT · TV · TĐ.</p>'
    +'<div class="grid2">'
    +'<div><label>Lọc theo xưởng</label>'
    +'<select id="hgXuong" onchange="locHatGiong()">'
    +'<option value="">— Tất cả —</option>'+xuongOpts+'</select></div>'
    +'<div><label>Lọc theo hạt giống</label>'
    +'<select id="hgLoc" onchange="locHatGiong()">'
    +'<option value="">— Tất cả —</option>'
    +'<option value="BIET">👍 Biết đá</option>'
    +'<option value="PT">🎉 Phong trào</option>'
    +'<option value="__NONE__">— Chưa gán —</option>'
    +'</select></div>'
    +'</div>'
    +'<button class="btn cam" style="margin-top:10px" onclick="randomLaiChiSo()">🎲 Random lại 6 chỉ số</button>'
    +'<div id="hgList" style="margin-top:14px"></div>'
    +'</div>';
  $('view').innerHTML=h;
  locHatGiong();
}
function locHatGiong(){
  var mx=$('hgXuong')?$('hgXuong').value:'';
  var mh=$('hgLoc')?$('hgLoc').value:'';
  var d=STATE.data;
  var ds=d.cauThu.filter(function(c){
    if(mx && c.maXuong!==mx) return false;
    if(mh==='__NONE__'){ if(c.hatGiong) return false; }
    else if(mh && String(c.hatGiong||'').toUpperCase()!==mh) return false;
    return true;
  });
  ds.sort(function(a,b){
    var ha=String(a.hatGiong||'ZZ'), hb=String(b.hatGiong||'ZZ');
    if(ha!==hb) return ha.localeCompare(hb);
    return a.hoTen.localeCompare(b.hoTen);
  });
  if(!ds.length){
    $('hgList').innerHTML='<div class="empty">Không có cầu thủ nào.</div>';
    return;
  }
  var h='<div class="muted" style="margin-bottom:8px">'+ds.length+' cầu thủ</div>';
  h+='<table><thead><tr><th>Cầu thủ</th><th>Xưởng</th><th>Vị trí</th><th>Hạt giống</th></tr></thead><tbody>';
  ds.forEach(function(c){
    var posChecks=['TM','HVTT','HVCT','TV','TD'].map(function(v){
      var checked=String(c.viTriList||'').toUpperCase().split(',').indexOf(v)>=0;
      return '<label class="'+(checked?'on':'')+'" data-pos="'+v+'" '
        +'onclick="toggleViTri(\''+c.maCT+'\',\''+v+'\',this)">'+viTriLabel(v)+'</label>';
    }).join('');
    h+='<tr>'
      +'<td><b>'+esc(c.hoTen)+'</b>'
      +(c.tenAo?' <span style="color:var(--cam2);font-size:11.5px">('+esc(c.tenAo)+')</span>':'')
      +(c.maDoi?' <span class="pill ct">'+esc(tenDoi(c.maDoi))+'</span>':'')
      +'</td>'
      +'<td class="muted">'+esc(c.tenXuong||'')+'</td>'
      +'<td><div class="pos-check">'+posChecks+'</div></td>'
      +'<td><select onchange="luuHatGiong(\''+c.maCT+'\',this.value)" style="min-width:140px">'
      +'<option value=""'+(!c.hatGiong?' selected':'')+'>— Chưa gán —</option>'
      +'<option value="BIET"'+(c.hatGiong==='BIET'?' selected':'')+'>👍 Biết đá</option>'
      +'<option value="PT"'+(c.hatGiong==='PT'?' selected':'')+'>🎉 Phong trào</option>'
      +'</select></td>'
      +'</tr>';
  });
  h+='</tbody></table>';
  $('hgList').innerHTML=h;
}
function toggleViTri(maCT,v,el){
  var c=cauThuObj(maCT);
  if(!c)return;
  var list=String(c.viTriList||'').toUpperCase().split(',').filter(function(x){return x;});
  var i=list.indexOf(v);
  if(i>=0) list.splice(i,1);
  else list.push(v);
  var vl=list.join(',');
  c.viTriList=vl;
  if(list.indexOf(v)>=0) el.classList.add('on');
  else el.classList.remove('on');
  srv('capNhatCauThu',[STATE.token,maCT,{viTriList:vl}]).then(function(r){
    if(!r||!r.ok) toast((r&&r.msg)||'Lỗi','err');
  });
}
function luuHatGiong(maCT,h){
  var c=cauThuObj(maCT);
  if(c) c.hatGiong=h;
  srv('capNhatCauThu',[STATE.token,maCT,{hatGiong:h}]).then(function(r){
    if(r&&r.ok) toast('Đã cập nhật','ok');
    else toast((r&&r.msg)||'Lỗi','err');
  });
}
function randomLaiChiSo(){
  if(!confirm('Random lại toàn bộ rating + 6 chỉ số? Các chỉ số đã sửa sẽ bị ghi đè.'))return;
  srv('randomLaiChiSoAll',[STATE.token]).then(function(r){
    toast((r&&r.msg)||'Xong',r&&r.ok?'ok':'err');
    if(r&&r.ok)tai();
  });
}

/* ================= VIEW: QUẢN LÝ ================= */
function viewQL(){
  if(!isAdmin()){
    $('view').innerHTML='<div class="card"><div class="empty">Cần đăng nhập BTC.</div></div>';
    return;
  }
  var d=STATE.data;
  var h='';

  h+='<div class="card"><h2>⚙️ Cấu hình giải</h2>'
    +'<label>Tên giải</label><input id="cfTen" value="'+esc(d.tenGiai)+'">'
    +'<label>Link banner trang chủ (Drive/Imgur)</label>'
    +'<input id="cfBanner" value="'+esc(d.bannerUrl||'')+'" placeholder="https://...">'
    +'<label>Cơ cấu giải thưởng (xuống dòng tự do)</label>'
    +'<textarea id="cfThuong" rows="8" style="font-family:inherit;resize:vertical" placeholder="🥇 Nhất: 5.000.000đ&#10;🥈 Nhì: 3.000.000đ&#10;🥉 Ba: 2.000.000đ&#10;⚽ Vua phá lưới: 500.000đ">'
    +esc(d.giaiThuong||'')+'</textarea>'
    +'<button class="btn neon" style="margin-top:14px" onclick="luuCf()">💾 Lưu cấu hình</button>'
    +'</div>';

  h+='<div class="card"><h2>➕ Tạo đội mới</h2>'
    +'<div><label>Tên đội <span class="req">*</span></label>'
    +'<input id="ndTen" placeholder="VD: EVO FC"></div>'
    +'<div class="grid2">'
    +'<div><label>Màu áo</label><input id="ndMau" placeholder="Đỏ"></div>'
    +'<div><label>Link logo (Drive)</label><input id="ndLogo" placeholder="https://drive.google.com/..."></div>'
    +'</div>'
    +'<button class="btn neon" style="margin-top:14px" onclick="taoDoi()">+ Tạo đội</button>'
    +'</div>';

  h+='<div class="card"><h2>👥 Các đội</h2>';
  if(!d.doi.length){
    h+='<div class="muted">Chưa có đội.</div>';
  } else {
    h+='<table><thead><tr><th>Logo</th><th>Đội</th><th>ĐT</th>'
      +'<th class="num">SL</th><th class="num">Thứ tự</th><th class="num">Khung</th><th></th></tr></thead><tbody>';
    d.doi.forEach(function(t){
      var n=cauThuTrongDoi(t.maDoi, true).length;
      var dt=t.doiTruong?cauThuObj(t.doiTruong):null;
      h+='<tr>'
        +'<td>'+(t.logoUrl
          ?'<img src="'+esc(driveImg(t.logoUrl))+'" style="width:36px;height:36px;border-radius:9px;object-fit:cover;border:1px solid var(--vien)" onerror="this.style.display=\'none\'">'
          :'<div style="width:36px;height:36px;border-radius:9px;background:linear-gradient(135deg,var(--neon),var(--cam));display:flex;align-items:center;justify-content:center;font-family:\'Oswald\';color:#04122b;font-size:16px">'+esc((t.tenDoi||'?').slice(0,2).toUpperCase())+'</div>')
        +'</td>'
        +'<td><b>'+esc(t.tenDoi)+'</b></td>'
        +'<td>'+(dt?'👑 '+esc(dt.hoTen):'<span class="muted">—</span>')+'</td>'
        +'<td class="num">'+n+'</td>'
        +'<td class="num"><input type="number" style="width:64px;text-align:center" '
        +'value="'+(t.thuTuBoc||0)+'" onchange="luuThuTu(\''+t.maDoi+'\',this.value)"></td>'
        +'<td class="num">'
        +(t.khungThe
          ? '<img src="'+esc(driveImg(t.khungThe))+'" style="width:36px;height:48px;object-fit:contain;background:rgba(0,0,0,.3);border-radius:4px" onerror="this.outerHTML=\'<span class=&quot;muted&quot;>?</span>\'">'
          : '<span class="muted" style="font-size:11px">mặc định</span>')
        +'</td>'
        +'<td class="rowbtn">'
        +'<button class="btn outline sm" onclick="modalSuaDoi(\''+t.maDoi+'\')" title="Sửa tên/logo/màu/khung">✏️</button>'
        +'<button class="btn danger sm" onclick="xoaDoiUI(\''+t.maDoi+'\',\''+esc(t.tenDoi)+'\')">🗑</button>'
        +'</td></tr>';
    });
    h+='</tbody></table>';
  }
  h+='</div>';

  h+='<div class="card"><h2>📅 Lịch thi đấu</h2>'
    +'<p class="muted" style="margin-bottom:12px">'
    +'Tạo lịch <b>vòng tròn 1 lượt</b> (mọi đội gặp nhau 1 lần). '
    +'Nhập ngày giờ + tỷ số ở tab <b>Lịch & KQ</b>. Sau khi đá xong vòng tròn, tạo Chung kết cho Top 2.</p>'
    +'<div class="rowbtn">'
    +'<button class="btn neon" onclick="taoLich()">🔄 Tạo lại lịch vòng tròn</button>'
    +'<button class="btn cam" onclick="taoKO()">🏆 Tạo chung kết (Top 2)</button>'
    +'</div></div>';

  h+='<div class="card"><h2>💡 Quy trình gợi ý</h2>'
    +'<ol style="margin-left:20px;line-height:2;color:var(--mo);font-size:13.5px">'
    +'<li>Tạo <b style="color:var(--neon)">các đội</b> + đặt thứ tự</li>'
    +'<li>Mọi người vào tab <b>Đăng ký</b> tự đăng ký</li>'
    +'<li>BTC vào tab <b>Hạt giống</b> gán Biết đá / Phong trào + vị trí cho từng người</li>'
    +'<li>Vào tab <b>Bốc thăm</b> — <b>Bước 1</b>: chọn ứng viên → bốc đội trưởng (để riêng, chưa vào đội)</li>'
    +'<li><b>Bước 2</b>: bấm "BỐC 1 LƯỢT" nhiều lần (biết đá chia hết trước, phong trào sau) hoặc "Chia hết luôn". Cân chỉnh bằng "Chuyển cầu thủ" nếu cần</li>'
    +'<li><b>Bước 3</b>: từng đội trưởng bấm "Bốc đội" để nhận đội mình dẫn dắt</li>'
    +'<li>Vào <b>Quản lý</b> → "Tạo lại lịch vòng tròn", rồi nhập ngày giờ + tỷ số ở tab <b>Lịch & KQ</b></li>'
    +'<li>Nhập tỷ số + giờ/sân + sự kiện (bàn thắng/thẻ) ở tab <b>Lịch & KQ</b> (nút ⚽ Tỷ số)</li>'
    +'<li>Xem <b>Thống kê</b> vua phá lưới, thẻ vàng/đỏ · Tạo <b>vòng knock-out</b> khi xong vòng bảng</li>'
    +'</ol></div>';

  $('view').innerHTML=h;
}

function modalSuaDoi(maDoi){
  var t=doiObj(maDoi);
  if(!t)return;
  $('mGenericBox').innerHTML='<h2 style="margin:0 0 12px;font-size:20px;font-family:\'Oswald\';letter-spacing:1px;color:var(--neon)">✏️ SỬA ĐỘI</h2>'
    +'<label>Tên đội</label><input id="sdTen" value="'+esc(t.tenDoi)+'">'
    +'<label>Màu áo</label><input id="sdMau" value="'+esc(t.mauAo||'')+'">'
    +'<label>Link logo (Drive)</label><input id="sdLogo" value="'+esc(t.logoUrl||'')+'" placeholder="https://drive.google.com/...">'
    +'<label>Link khung viền thẻ (PNG trong suốt)</label>'
    +'<input id="sdKhung" value="'+esc(t.khungThe||'')+'" placeholder="https://drive.google.com/file/d/... (để trống = khung mặc định)">'
    +'<div class="muted" style="margin-top:6px;font-size:12px;line-height:1.6">'
    +  '💡 Dán link ảnh PNG có <b>ô ảnh trong suốt</b> — khung này sẽ thay cho khung mặc định (bạc/đỏ/xanh/huyền thoại) ở mọi thẻ cầu thủ của đội.'
    +'</div>'
    +'<div id="sdKhungPreview" style="margin-top:10px;display:none;align-items:center;gap:12px;padding:10px;background:rgba(10,14,30,.4);border:1px dashed var(--vien2);border-radius:10px">'
    +  '<img id="sdKhungImg" src="" style="width:60px;height:80px;object-fit:contain;background:rgba(0,0,0,.3);border-radius:6px" onerror="this.style.display=\'none\'">'
    +  '<span class="muted" style="font-size:12px">Xem trước khung</span>'
    +'</div>'
    +'<div style="display:flex;gap:8px;margin-top:18px">'
    +'<button class="btn neon block" onclick="luuSuaDoi(\''+maDoi+'\')">💾 Lưu</button>'
    +'<button class="btn outline" onclick="closeModal(\'mGeneric\')">Đóng</button>'
    +'</div>';

  // ⭐ Hiện preview nếu đã có khung
  setTimeout(function(){
    var inp = $('sdKhung');
    if(!inp) return;
    var u = inp.value.trim();
    if(u) hienPreviewKhung_(u);
    inp.addEventListener('input', function(){ hienPreviewKhung_(inp.value.trim()); });
  }, 50);

  openModal('mGeneric');
}

/* Hiện preview khung khi BTC paste link */
function hienPreviewKhung_(url){
  var box = $('sdKhungPreview');
  var img = $('sdKhungImg');
  if(!box || !img) return;
  if(!url){
    box.style.display = 'none';
    return;
  }
  var realUrl = driveImg(url);
  img.src = realUrl;
  img.style.display = '';
  box.style.display = 'flex';
}
function luuSuaDoi(maDoi){
  var ten=$('sdTen').value.trim();
  var mau=$('sdMau').value;
  var logo=$('sdLogo').value;
  var khung=$('sdKhung').value.trim();
  if(!ten){toast('Nhập tên đội','err');return;}
  // ⭐ Lưu thông tin đội, sau đó lưu khung riêng (2 API calls)
  srv('suaDoi',[STATE.token,maDoi,ten,'',mau,undefined,logo]).then(function(r){
    if(!r || !r.ok){
      toast((r&&r.msg)||'Lỗi lưu đội','err');
      return;
    }
    // Gọi tiếp datKhungThe để lưu khung viền
    srv('datKhungThe',[STATE.token,maDoi,khung]).then(function(r2){
      toast(r2&&r2.ok ? 'Đã cập nhật đội + khung viền' : ((r2&&r2.msg)||'Lỗi khung'),
            r2&&r2.ok ? 'ok':'err');
      if(r2&&r2.ok){ closeModal('mGeneric'); tai(); }
    }).catch(function(e){
      toast('Lỗi khung: '+e.message,'err');
    });
  });
}
function luuCf(){
  srv('luuCauHinh',[
    STATE.token,
    $('cfTen').value,
    2,
    $('cfBanner').value,
    $('cfThuong').value
  ]).then(function(r){
    toast((r&&r.msg)||'Xong',r&&r.ok?'ok':'err'); if(r&&r.ok)tai();
  });
}
function taoDoi(){
  var ten=$('ndTen').value.trim();
  if(!ten){toast('Nhập tên đội','err');return;}
  srv('themDoi',[STATE.token,ten,'',$('ndMau').value,$('ndLogo').value]).then(function(r){
    toast((r&&r.msg)||'Xong',r&&r.ok?'ok':'err'); if(r&&r.ok)tai();
  });
}
function luuThuTu(maDoi,v){
  srv('datThuTuBocTham',[STATE.token,maDoi,v]).then(function(r){
    if(r&&r.ok) toast('Đã lưu thứ tự bốc','ok');
  });
}
function xoaDoiUI(maDoi,ten){
  if(!confirm('Xóa đội "'+ten+'"? Cầu thủ sẽ được gỡ khỏi đội.'))return;
  srv('xoaDoi',[STATE.token,maDoi]).then(function(r){
    toast((r&&r.msg)||'Xong',r&&r.ok?'ok':'err'); if(r&&r.ok)tai();
  });
}
function taoLich(){
  if(!confirm('Tạo lại toàn bộ lịch vòng tròn? Tỷ số vòng tròn cũ sẽ bị xóa.'))return;
  toast('Đang tạo lịch…');
  srv('taoLichVongBang',[STATE.token]).then(function(r){
    toast((r&&r.msg)||'Xong',r&&r.ok?'ok':'err');
    if(r&&r.ok){STATE.tab='lich';tai();}
  });
}
function taoKO(){
  if(!confirm('Tạo trận Chung kết cho Top 2 bảng xếp hạng?'))return;
  toast('Đang tạo…');
  srv('sinhVongKnockOut',[STATE.token]).then(function(r){
    toast((r&&r.msg)||'Xong',r&&r.ok?'ok':'err');
    if(r&&r.ok){STATE.tab='bxh';tai();}
  });
}

/* ================= VIEW: ỨNG VIÊN ĐT ================= */
function viewUngVien(){
  if(!isAdmin()){
    $('view').innerHTML='<div class="card"><div class="empty">Cần đăng nhập BTC.</div></div>';
    return;
  }
  srv('dsUngVienDT',[STATE.token]).then(function(r){
    if(!r||!r.ok){
      $('view').innerHTML='<div class="card"><div class="empty">Lỗi: '+(r&&r.msg||'')+'</div></div>';
      return;
    }
    var daChon={};
    r.items.forEach(function(x){ daChon[x.maCT]=true; });
    var d=STATE.data;
    var allCT=d.cauThu.slice().sort(function(a,b){
      return String(a.hoTen).localeCompare(String(b.hoTen));
    });
    var h='<div class="uv-card">'
      +'<h2 style="margin:0 0 10px;font-family:var(--ff-title);font-size:22px;letter-spacing:1px;color:var(--neon);text-transform:uppercase">👑 Ứng viên đội trưởng</h2>'
      +'<p class="muted" style="margin-bottom:12px">Chọn những người có thể làm đội trưởng. '
      +'Live sẽ bốc ngẫu nhiên từ danh sách này ra <b>'+d.doi.length+'</b> người.</p>'
      +'<div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap">'
      +'<span class="pill ok" id="uvCount">Đã chọn: '+(r.items.length)+'</span>'
      +'<button class="btn outline sm" onclick="uvAll2(true)">Chọn tất cả</button>'
      +'<button class="btn outline sm" onclick="uvAll2(false)">Bỏ chọn hết</button>'
      +'<button class="btn outline sm" onclick="uvChiBiet()">Chỉ chọn người Biết đá</button>'
      +'</div>'
      +'<div class="uv-pick-list">';
    allCT.forEach(function(c){
      var on=daChon[c.maCT]?' on':'';
      var ck=daChon[c.maCT]?' checked':'';
      h+='<label class="uv-pick-item'+on+'" onclick="uvToggle(this)">'
        +'<input type="checkbox" class="uvChk2" value="'+esc(c.maCT)+'"'+ck+'>'
        +'<div class="uv-info">'
        +'<div class="uv-name">'+esc(c.hoTen)
        +(c.hatGiong==='BIET'?' <span class="pill sk-ban" style="font-size:10px">Biết đá</span>':'')
        +'</div>'
        +'<div class="uv-sub">'
        +(c.maNV?'NV: '+esc(c.maNV)+' · ':'')
        +(c.tenXuong?esc(c.tenXuong)+' · ':'')
        +(c.maDoi?'Đội: '+esc(tenDoi(c.maDoi)):'Chưa vào đội')
        +'</div></div></label>';
    });
    h+='</div>'
      +'<div style="display:flex;gap:10px;margin-top:14px">'
      +'<button class="btn neon block" onclick="luuUV()">💾 Lưu danh sách</button>'
      +'<button class="btn outline" onclick="xoaUV()">🗑 Xóa hết</button>'
      +'</div>'
      +'</div>';
    if(r.items.length){
      h+='<div class="card"><h2>📋 Đã chọn ('+r.items.length+')</h2>'
        +'<div style="display:flex;flex-wrap:wrap;gap:6px">';
      r.items.forEach(function(x){
        h+='<span class="pill captain" style="font-size:13px;padding:6px 12px">👑 '+esc(x.hoTen)
          +(x.maNV?' <span style="opacity:.7">('+esc(x.maNV)+')</span>':'')+'</span>';
      });
      h+='</div></div>';
    }
    $('view').innerHTML=h;
  });
}
function uvToggle(el){
  setTimeout(function(){
    var ck=el.querySelector('input');
    if(ck && ck.checked) el.classList.add('on');
    else el.classList.remove('on');
    uvUpdateCount();
  },0);
}
function uvUpdateCount(){
  var n=document.querySelectorAll('.uvChk2:checked').length;
  var el=$('uvCount');
  if(el) el.textContent='Đã chọn: '+n;
}
function uvAll2(v){
  document.querySelectorAll('.uvChk2').forEach(function(c){
    c.checked=v;
    var lab=c.closest('.uv-pick-item');
    if(lab){ if(v) lab.classList.add('on'); else lab.classList.remove('on'); }
  });
  uvUpdateCount();
}
function uvChiBiet(){
  document.querySelectorAll('.uv-pick-item').forEach(function(lab){
    var name=lab.querySelector('.uv-name');
    var ck=lab.querySelector('input');
    var isBiet=name && name.innerHTML.indexOf('Biết đá')>=0;
    ck.checked=isBiet;
    if(isBiet) lab.classList.add('on'); else lab.classList.remove('on');
  });
  uvUpdateCount();
}
function luuUV(){
  var ds=[];
  document.querySelectorAll('.uvChk2:checked').forEach(function(c){ ds.push(c.value); });
  if(ds.length<STATE.data.doi.length){
    toast('Cần ít nhất '+STATE.data.doi.length+' ứng viên','err'); return;
  }
  srv('luuUngVienDT',[STATE.token,ds]).then(function(r){
    toast((r&&r.msg)||'Xong',r&&r.ok?'ok':'err');
    if(r&&r.ok) viewUngVien();
  });
}
function xoaUV(){
  if(!confirm('Xóa hết danh sách ứng viên?'))return;
  srv('luuUngVienDT',[STATE.token,[]]).then(function(r){
    toast((r&&r.msg)||'Xong',r&&r.ok?'ok':'err');
    if(r&&r.ok) viewUngVien();
  });
}

/* ================= LIVE BỐC THĂM ================= */
var LIVE = {
  token: localStorage.getItem('bd_live_token') || '',
  dangQuay: false,
  ketQuaHienTai: null
};
var LIVE_STEP = 'b1';

function viewLive(){
  if(!isAdmin()){
    $('view').innerHTML='<div class="card"><div class="empty">'
      +'🔒 Chỉ ban tổ chức mới vào được màn hình này.'
      +'<div style="margin-top:14px"><button class="btn neon" onclick="openModal(\'mLogin\')">🔐 Đăng nhập BTC</button></div>'
      +'</div></div>';
    return;
  }
  if(!LIVE.token){
    LIVE_STEP='b1';
    return viewLiveDangNhap();
  }
  viewLiveMain();
}
function viewLiveDangNhap(){
  var h='<div class="live-lock">'
    +'<div style="font-size:52px;margin-bottom:8px">🎬</div>'
    +'<h2>LIVE BỐC THĂM</h2>'
    +'<p class="muted" style="margin-bottom:20px">Nhập mật khẩu để vào màn hình bốc thăm</p>'
    +'<input type="password" id="liveMK" placeholder="••••••••" '
    +'onkeydown="if(event.key===\'Enter\')liveLogin()">'
    +'<button class="btn neon block" style="margin-top:16px;padding:14px" '
    +'onclick="liveLogin()" id="btnLiveLogin">🔓 Mở Live</button>'
    +'</div>';
  $('view').innerHTML=h;
  setTimeout(function(){var e=$('liveMK');if(e)e.focus();},150);
}
function liveLogin(){
  var mk=$('liveMK').value;
  if(!mk){toast('Nhập mật khẩu','err');return;}
  $('btnLiveLogin').innerHTML='<span class="spin"></span>';
  srv('liveDangNhap',[mk]).then(function(r){
    $('btnLiveLogin').textContent='🔓 Mở Live';
    if(r&&r.ok){
      LIVE.token=r.token;
      localStorage.setItem('bd_live_token',r.token);
      toast('Đã mở Live','ok');
      viewLiveMain();
    } else toast((r&&r.msg)||'Sai mật khẩu','err');
  }).catch(function(e){$('btnLiveLogin').textContent='🔓 Mở Live';toast('Lỗi: '+e.message,'err');});
}
function liveLogout(){
  if(!confirm('Đóng Live? Cần nhập lại mật khẩu để vào.'))return;
  LIVE.token=''; localStorage.removeItem('bd_live_token');
  LIVE.ketQuaHienTai=null;
  LIVE_STEP='b1';
  viewLiveDangNhap();
}
function viewLiveMain(){
  Promise.all([
    srv('liveBuoc1TrangThai'),
    srv('liveTrangThai'),
    srv('liveBuoc3TrangThai')
  ]).then(function(arr){
    var tt1=arr[0], tt2=arr[1], tt3=arr[2];
    if(!tt1||!tt1.ok){ $('view').innerHTML='<div class="card"><div class="empty">Lỗi: '+(tt1&&tt1.msg||'')+'</div></div>'; return; }
    renderLiveMainFull(tt1, tt2, tt3);
  }).catch(function(e){
    $('view').innerHTML='<div class="card"><div class="empty">Lỗi: '+esc(e.message)+'</div></div>';
  });
}
function renderLiveMainFull(tt1, tt2, tt3){
  var h='<div style="max-width:720px;margin:0 auto">'
    +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">'
    +'<div style="font-family:var(--ff-title);font-size:22px;color:var(--neon);letter-spacing:1px">🎬 LIVE BỐC THĂM</div>'
    +'<button class="btn outline sm" onclick="liveLogout()">Đóng</button>'
    +'</div>';
  h+='<div class="live-step-tabs">'
    +'<button class="'+(LIVE_STEP==='b1'?'on':(tt1.hoanTat?'done':''))+'" onclick="liveChonBuoc(\'b1\')">'
    +'<span class="stt">1</span>Bốc đội trưởng<div style="font-size:11px;opacity:.8">'+tt1.daBoc+'/'+tt1.soDoi+'</div></button>'
    +'<button class="'+(LIVE_STEP==='b2'?'on':'')+'" onclick="liveChonBuoc(\'b2\')">'
    +'<span class="stt">2</span>Cầu thủ bốc đội<div style="font-size:11px;opacity:.8">'+(tt2?tt2.daBoc+'/'+tt2.tong:'—')+'</div></button>'
    +'<button class="'+(LIVE_STEP==='b3'?'on':(tt3.hoanTat?'done':''))+'" onclick="liveChonBuoc(\'b3\')">'
    +'<span class="stt">3</span>ĐT bốc đội<div style="font-size:11px;opacity:.8">'+tt3.daBocDoi+'/'+tt3.soDoi+'</div></button>'
    +'</div>';
  h+='<div id="liveStepArea"></div>';
  h+='<div class="card" style="margin-top:16px"><h2>📜 Lịch sử bốc gần đây</h2>'
    +'<div id="liveHistory" class="live-history"><div class="loadwrap" style="padding:16px"><div class="spin"></div></div></div>'
    +'</div>';
  h+='</div>';
  $('view').innerHTML=h;
  if(LIVE_STEP==='b1') renderLiveBuoc1(tt1);
  else if(LIVE_STEP==='b2') renderLiveBuoc2(tt2);
  else if(LIVE_STEP==='b3') renderLiveBuoc3(tt3);
  loadLiveHistory();
}
function liveChonBuoc(b){
  LIVE_STEP=b;
  LIVE.ketQuaHienTai=null;
  viewLiveMain();
}

/* ===== BƯỚC 1 ===== */
function renderLiveBuoc1(tt){
  var h='';
  if(!tt.tongUV || tt.tongUV < tt.soDoi){
    h+='<div class="live-input-card" style="text-align:center">'
      +'<div style="font-size:52px;margin-bottom:8px">⚠️</div>'
      +'<div style="font-family:var(--ff-title);font-size:22px;color:var(--cam2);margin-bottom:8px">CHƯA ĐỦ ỨNG VIÊN</div>'
      +'<p class="muted">BTC cần vào tab <b>👑 Ứng viên ĐT</b> chọn ít nhất <b>'+tt.soDoi+'</b> người.</p>'
      +'<p class="muted" style="margin-top:6px">Hiện có: <b>'+tt.tongUV+'</b></p>'
      +'</div>';
    $('liveStepArea').innerHTML=h;
    return;
  }
  if(!tt.soDTChon){
    h+='<div class="live-input-card" style="text-align:center">'
      +'<div style="font-size:52px;margin-bottom:8px">⚠️</div>'
      +'<div style="font-family:var(--ff-title);font-size:22px;color:var(--cam2);margin-bottom:8px">BTC CHƯA BỐC ĐỘI TRƯỞNG</div>'
      +'<p class="muted">Vào tab <b>🎲 Bốc thăm</b> → <b>Bước 1</b> bốc ngẫu nhiên '+tt.soDoi+' đội trưởng trước.</p>'
      +'</div>';
    $('liveStepArea').innerHTML=h;
    return;
  }
  if(tt.hoanTat){
    h+='<div class="live-input-card" style="text-align:center">'
      +'<div style="font-size:60px;margin-bottom:8px">👑</div>'
      +'<div style="font-family:var(--ff-title);font-size:26px;color:var(--vang);margin-bottom:8px">ĐÃ CÔNG BỐ ĐỦ '+tt.soDTChon+' ĐỘI TRƯỞNG</div>'
      +'<p class="muted">Danh sách đã ẩn. Chuyển sang bước tiếp theo.</p>'
      +'<div style="display:flex;gap:8px;justify-content:center;margin-top:14px;flex-wrap:wrap">'
      +'<button class="btn neon" onclick="liveChonBuoc(\'b2\')">▶️ Sang Bước 2</button>'
      +'<button class="btn outline" onclick="liveResetB1()">🔄 Công bố lại</button>'
      +'</div>'
      +'</div>';
    $('liveStepArea').innerHTML=h;
    return;
  }

  h+='<div class="live-input-card">'
    +'<div style="text-align:center;margin-bottom:16px">'
    +'<div style="font-family:var(--ff-title);font-size:22px;color:var(--neon);letter-spacing:1px">🎲 BỐC ĐỘI TRƯỞNG</div>'
    +'<p class="muted" style="font-size:13px;margin-top:4px">'
    +'Đã công bố <b style="color:var(--neon)">'+tt.daBoc+'/'+tt.soDTChon+'</b> · '+tt.tongUV+' ứng viên'
    +'</p>'
    +'</div>';
  h+='<div id="liveB1Area"></div>';
  h+='<div style="margin-top:18px">'
    +'<div class="muted" style="font-size:12.5px;margin-bottom:8px;text-transform:uppercase;letter-spacing:.08em;font-weight:700">'
    +'Danh sách ứng viên ('+tt.tongUV+')</div>'
    +'<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px">';
  tt.dsUV.forEach(function(c){
    var cls = 'background:rgba(10,14,30,.5);border-color:var(--vien2)';
    var icon = '⚪';
    var nameColor = 'var(--chu2)';
    var badge = '';
    if(c.daCongBo){
      cls = 'background:linear-gradient(135deg,rgba(255,214,10,.2),rgba(255,214,10,.06));border-color:var(--vang)';
      icon = '👑';
      nameColor = 'var(--vang)';
      badge = '<span style="font-size:9.5px;font-weight:800;padding:2px 6px;border-radius:999px;background:var(--vang);color:#0a0e1a">ĐT</span>';
    }
    h+='<div style="display:flex;align-items:center;gap:8px;padding:10px 12px;border:1.5px solid;border-radius:10px;'+cls+'">'
      +'<span style="font-size:16px">'+icon+'</span>'
      +'<div style="flex:1;min-width:0">'
      +'<div style="font-weight:600;font-size:13px;color:'+nameColor+';overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(c.hoTen)+'</div>'
      +(c.maNV?'<div style="font-size:10.5px;color:var(--mo)">'+esc(c.maNV)+'</div>':'')
      +'</div>'
      +badge
      +'</div>';
  });
  h+='</div></div>';
  h+='<button class="btn cam block" style="margin-top:16px;padding:16px;font-size:17px;font-weight:700" '
    +'id="btnBocB1" onclick="liveBocB1()">🎲 CÔNG BỐ ĐỘI TRƯỞNG #'+(tt.daBoc+1)+'</button>';
  h+='</div>';
  $('liveStepArea').innerHTML=h;
  if(LIVE.ketQuaHienTai && LIVE.ketQuaHienTai.buoc==='b1'){
    hienKetQuaB1(LIVE.ketQuaHienTai);
  }
}
function liveBocB1(){
  var btn=$('btnBocB1');
  if(btn){ btn.disabled=true; btn.innerHTML='<span class="spin"></span> Đang bốc…'; }
  srv('liveBoc1DoiTruong',[LIVE.token]).then(function(r){
    if(!r||!r.ok){ toast((r&&r.msg)||'Lỗi','err'); if(btn){btn.disabled=false;btn.textContent='🎲 BỐC NGAY';} return; }
    batDauQuayTen(r);
  }).catch(function(e){
    toast('Lỗi: '+e.message,'err');
    if(btn){btn.disabled=false;btn.textContent='🎲 BỐC NGAY';}
  });
}
function batDauQuayTen(kq){
  srv('liveBuoc1TrangThai').then(function(tt1){
    var list = (tt1 && tt1.ok && tt1.dsUV) ? tt1.dsUV : [];
    if(!list.length){
      LIVE.ketQuaHienTai={ buoc:'b1', maCT:kq.maCT, hoTen:kq.hoTen, maNV:kq.maNV,
        tenXuong:kq.tenXuong, soDaBoc:kq.soDaBoc, conLai:kq.conLai };
      hienKetQuaB1(LIVE.ketQuaHienTai);
      return;
    }
    var O_W = 428;
    var SO_O_RANDOM = 60;
    function pickKhac(list, truoc) {
      if (list.length <= 1) return list[0];
      var chon;
      do { chon = list[Math.floor(Math.random() * list.length)]; }
      while (truoc && chon.maCT === truoc.maCT);
      return chon;
    }
    var track = [];
    for(var i=0;i<SO_O_RANDOM;i++){ track.push(pickKhac(list, track[track.length-1])); }
    var oTrung = { maCT: kq.maCT, hoTen: kq.hoTen, maNV: kq.maNV, tenXuong: kq.tenXuong };
    if (track.length && track[track.length-1].maCT === oTrung.maCT) {
      track.push(pickKhac(list, track[track.length-1]));
    }
    var indexTrung = track.length;
    track.push(oTrung);
    for(var j=0;j<3;j++){ track.push(pickKhac(list, track[track.length-1])); }
    function itemHtml(x){
      return '<div class="roulette-name-item">'
        +'<div class="nm">'+esc(x.hoTen)+'</div>'
        +'<div class="nv">'+(x.maNV?'NV: '+esc(x.maNV):'')+'</div>'
        +(x.tenXuong?'<div class="xuong">'+esc(x.tenXuong)+'</div>':'')
        +'</div>';
    }
    var trackHtml=track.map(itemHtml).join('');
    var h='<div class="roulette-name-wrap">'
      +'<div class="roulette-name-track" id="rtName">'+trackHtml+'</div>'
      +'<div class="roulette-pointer"></div>'
      +'</div>'
      +'<div style="text-align:center;margin-top:12px;font-size:16px;color:var(--mo)">Đang quay…</div>';
    $('liveB1Area').innerHTML=h;
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        var trackEl=$('rtName');
        if(!trackEl) return;
        var wrapW=trackEl.parentNode.offsetWidth;
        
        // ⭐ Ô rộng 400px + margin 14px × 2 = 428px
        var O_W_FULL = 428;
        var targetX = wrapW/2 - (indexTrung * O_W_FULL + 214);  // 214 = 14 + 200
        
        trackEl.style.transition='none';
        trackEl.style.transform='translateX(0px)';
        
        requestAnimationFrame(function(){
          trackEl.style.transition='transform 7s cubic-bezier(.12,.85,.35,1)';
          trackEl.style.transform='translateX('+targetX+'px)';
        });
      });
    });
    setTimeout(function(){
      LIVE.ketQuaHienTai={ buoc:'b1', maCT:kq.maCT, hoTen:kq.hoTen, maNV:kq.maNV,
        tenXuong:kq.tenXuong, soDaBoc:kq.soDaBoc, conLai:kq.conLai };
      hienKetQuaB1(LIVE.ketQuaHienTai);
    },7200);
  });
}
function hienKetQuaB1(kq){
  var ct = cauThuObj(kq.maCT);
  var theHtml = ct ? '<div style="max-width:280px;margin:18px auto 0">'
    + renderTheFifa(ct)
    + '</div>' : '';
  var h='<div class="live-dt-result">'
    +'<div style="font-size:52px;margin-bottom:8px">👑</div>'
    +'<div class="ten-nguoi">'+esc(kq.hoTen)+'</div>'
    +(kq.maNV?'<div class="ma-nv">NV: '+esc(kq.maNV)+'</div>':'')
    +'<div class="chuc-danh">ĐỘI TRƯỞNG #'+kq.soDaBoc+'</div>'
    +theHtml;
  if(kq.conLai > 0){
    h+='<button class="btn cam block" style="margin-top:20px;padding:16px;font-size:17px" onclick="liveBocTiepB1()">'
      +'🎲 BỐC ĐỘI TRƯỞNG #'+(kq.soDaBoc+1)+'</button>';
  } else {
    h+='<div style="margin-top:16px;padding:12px;border-radius:10px;background:rgba(255,214,10,.1);border:1.5px solid var(--vang);text-align:center">'
      +'<div style="font-family:var(--ff-title);font-size:20px;color:var(--vang);letter-spacing:1px">🎉 ĐÃ ĐỦ '+kq.soDaBoc+' ĐỘI TRƯỞNG</div>'
      +'</div>'
      +'<button class="btn neon block" style="margin-top:14px;padding:16px;font-size:17px" onclick="liveChonBuoc(\'b2\')">'
      +'▶️ SANG BƯỚC 2</button>';
  }
  h+='</div>';
  $('liveB1Area').innerHTML=h;
  if(kq.conLai > 0) banPhaoHoa(15);
  else banPhaoHoa(40);
}
function liveBocTiepB1(){
  LIVE.ketQuaHienTai=null;
  viewLiveMain();
}
function liveResetB1(){
  if(!confirm('Bốc lại từ đầu? Tất cả đánh dấu đội trưởng sẽ bị xóa.'))return;
  srv('liveResetBuoc1',[LIVE.token]).then(function(r){
    toast((r&&r.msg)||'Xong',r&&r.ok?'ok':'err');
    if(r&&r.ok){ LIVE.ketQuaHienTai=null; viewLiveMain(); }
  });
}

/* ===== BƯỚC 2 ===== */
function renderLiveBuoc2(tt){
  var h='';
  if(tt.khoa || (tt.tong && tt.daBoc >= tt.tong && tt.tong>0)){
    h+='<div class="live-input-card" style="text-align:center">'
      +'<div style="font-size:52px;margin-bottom:8px">🔒</div>'
      +'<div style="font-family:var(--ff-title);font-size:22px;color:var(--vang);margin-bottom:8px">ĐÃ BỐC XONG</div>'
      +'<p class="muted">Tất cả cầu thủ đã bốc đội xong.</p>'
      +'<button class="btn neon" style="margin-top:14px" onclick="liveChonBuoc(\'b3\')">▶️ Sang Bước 3</button>'
      +'</div>';
    $('liveStepArea').innerHTML=h;
    return;
  }
  var pct = tt.tong ? Math.round(tt.daBoc/tt.tong*100) : 0;
  h+='<div class="live-status">'
    +'<div class="item"><div class="n">'+tt.tong+'</div><div class="l">Tổng</div></div>'
    +'<div class="item"><div class="n" style="color:var(--neon)">'+tt.daBoc+'</div><div class="l">Đã bốc</div></div>'
    +'<div class="item"><div class="n" style="color:var(--cam2)">'+tt.conLai+'</div><div class="l">Còn lại</div></div>'
    +'</div>'
    +'<div class="progress"><div class="bar" style="width:'+pct+'%"></div></div>';
  if(LIVE.ketQuaHienTai && LIVE.ketQuaHienTai.buoc==='b2'){
    h+='<div id="liveB2Area"></div>';
    $('liveStepArea').innerHTML=h;
    renderLiveKetQua(LIVE.ketQuaHienTai);
  } else {
    h+='<div class="live-input-card">'
      +'<label style="text-align:center;font-size:13px">Nhập mã nhân viên để bốc</label>'
      +'<input type="text" id="liveMaNV" placeholder="NV001" autocomplete="off" '
      +'oninput="liveTraMaNV()" onkeydown="if(event.key===\'Enter\')liveBoc()">'
      +'<div id="liveInfo"></div>'
      +'<button class="btn neon block" id="btnLiveBoc" style="margin-top:16px;padding:16px;font-size:17px" '
      +'onclick="liveBoc()" disabled>🎲 BỐC THĂM</button>'
      +'</div>';
    $('liveStepArea').innerHTML=h;
    setTimeout(function(){var e=$('liveMaNV');if(e)e.focus();},100);
  }
}
function renderLiveInput(){
  var h='<div class="live-input-card">'
    +'<label style="text-align:center;font-size:13px">Nhập mã nhân viên để bốc</label>'
    +'<input type="text" id="liveMaNV" placeholder="NV001" autocomplete="off" '
    +'oninput="liveTraMaNV()" onkeydown="if(event.key===\'Enter\')liveBoc()">'
    +'<div id="liveInfo"></div>'
    +'<button class="btn neon block" id="btnLiveBoc" style="margin-top:16px;padding:16px;font-size:17px" '
    +'onclick="liveBoc()" disabled>🎲 BỐC THĂM</button>'
    +'</div>';
  var area=$('liveStepArea') || $('liveArea');
  if(area) area.innerHTML=h;
  setTimeout(function(){var e=$('liveMaNV');if(e)e.focus();},100);
}

/* ===== BƯỚC 3 ===== */
function renderLiveBuoc3(tt){
  var h='';
  if(!tt.soDT){
    h+='<div class="live-input-card" style="text-align:center">'
      +'<div style="font-size:52px;margin-bottom:8px">⚠️</div>'
      +'<div style="font-family:var(--ff-title);font-size:22px;color:var(--cam2);margin-bottom:8px">CHƯA CÓ ĐỘI TRƯỞNG</div>'
      +'<p class="muted">Hoàn thành Bước 1 để bốc đội trưởng trước.</p>'
      +'<button class="btn neon" style="margin-top:14px" onclick="liveChonBuoc(\'b1\')">◀️ Về Bước 1</button>'
      +'</div>';
    $('liveStepArea').innerHTML=h;
    return;
  }
  if(tt.hoanTat){
    renderLiveFinal(tt);
    return;
  }
  var pct = tt.soDoi ? Math.round(tt.daBocDoi/tt.soDoi*100) : 0;
  h+='<div class="live-status">'
    +'<div class="item"><div class="n">'+tt.soDoi+'</div><div class="l">Tổng đội</div></div>'
    +'<div class="item"><div class="n" style="color:var(--neon)">'+tt.daBocDoi+'</div><div class="l">Đã gán</div></div>'
    +'<div class="item"><div class="n" style="color:var(--cam2)">'+tt.conLai+'</div><div class="l">Còn lại</div></div>'
    +'</div>'
    +'<div class="progress"><div class="bar" style="width:'+pct+'%"></div></div>';
  h+='<div class="live-input-card">'
    +'<div style="text-align:center;margin-bottom:14px">'
    +'<div style="font-family:var(--ff-title);font-size:20px;color:var(--neon);letter-spacing:1px">🎲 ĐỘI TRƯỞNG BỐC ĐỘI</div>'
    +'<p class="muted" style="font-size:13px;margin-top:4px">Còn <b style="color:var(--cam2)">'+tt.doiTrong.length+'</b> đội chưa có chủ</p>'
    +'</div>';
  h+='<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:16px">';
  tt.doiTrong.forEach(function(d){
    h+='<div style="text-align:center">';
    if(d.logoUrl){
      h+='<img src="'+esc(driveImg(d.logoUrl))+'" style="width:52px;height:52px;border-radius:12px;object-fit:cover;border:2px solid var(--vien2)" '
        +'onerror="this.outerHTML=\'<div style=&quot;width:52px;height:52px;border-radius:12px;background:linear-gradient(135deg,var(--neon),var(--cam));display:flex;align-items:center;justify-content:center;font-family:\\\'Oswald\\\';color:#04122b;font-size:20px&quot;>'
        +esc((d.tenDoi||'?').slice(0,2).toUpperCase())+'</div>\'">';
    } else {
      h+='<div style="width:52px;height:52px;border-radius:12px;background:linear-gradient(135deg,var(--neon),var(--cam));display:flex;align-items:center;justify-content:center;font-family:\'Oswald\';color:#04122b;font-size:20px">'
        +esc((d.tenDoi||'?').slice(0,2).toUpperCase())+'</div>';
    }
    h+='<div style="font-size:11px;color:var(--mo);margin-top:4px;max-width:64px;text-transform:uppercase;font-weight:700">'+esc(d.tenDoi)+'</div>';
    h+='</div>';
  });
  h+='</div>';
  h+='<label style="text-align:center;font-size:13px">Nhập mã NV đội trưởng đang lên bốc</label>'
    +'<input type="text" id="liveMaNV_DT" placeholder="NV001" autocomplete="off" '
    +'oninput="liveTraMaNV_DT()" onkeydown="if(event.key===\'Enter\')liveDTBocDoi()">'
    +'<div id="liveInfoDT"></div>'
    +'<button class="btn cam block" id="btnLiveDTBoc" style="margin-top:16px;padding:16px;font-size:17px" '
    +'onclick="liveDTBocDoi()" disabled>🎲 BỐC ĐỘI</button>'
    +'</div>';
  var chua=tt.dtList.filter(function(x){ return !x.daCoDoi; });
  if(chua.length){
    h+='<div class="card" style="margin-top:14px"><h2>👑 ĐT còn chờ bốc ('+chua.length+')</h2>'
      +'<div style="display:flex;flex-wrap:wrap;gap:6px">';
    chua.forEach(function(x){
      h+='<span class="pill captain" style="font-size:13px;padding:6px 12px">👑 '+esc(x.hoTen)
        +(x.maNV?' <span style="opacity:.7">('+esc(x.maNV)+')</span>':'')+'</span>';
    });
    h+='</div></div>';
  }
  $('liveStepArea').innerHTML=h;
  setTimeout(function(){var e=$('liveMaNV_DT');if(e)e.focus();},100);
}
var _liveTimerDT=null;
function liveTraMaNV_DT(){
  var inp=$('liveMaNV_DT'); if(!inp) return;
  var info=$('liveInfoDT');
  var btn=$('btnLiveDTBoc');
  var ma=inp.value.trim().toUpperCase();
  if(btn) btn.disabled=true;
  if(!ma){ if(info) info.innerHTML=''; clearTimeout(_liveTimerDT); return; }
  if(info) info.innerHTML='<div class="muted" style="padding:8px">Đang tìm…</div>';
  clearTimeout(_liveTimerDT);
  _liveTimerDT=setTimeout(function(){
    srv('liveBuoc3TrangThai').then(function(tt){
      if(!tt||!tt.ok){ if(info) info.innerHTML='<div class="live-info err">Lỗi</div>'; return; }
      var c=tt.dtList.filter(function(x){ return String(x.maNV||'').toUpperCase()===ma; })[0];
      if(!c){
        if(info) info.innerHTML='<div class="live-info err">'
          +'<div style="color:var(--do);font-weight:700">⚠️ Không phải đội trưởng</div>'
          +'<div class="muted" style="font-size:12px;margin-top:4px">Mã '+esc(ma)+' không có trong danh sách ĐT</div>'
          +'</div>';
        if(btn) btn.disabled=true;
        return;
      }
      if(c.daCoDoi){
        if(info) info.innerHTML='<div class="live-info err">'
          +'<div class="ten">'+esc(c.hoTen)+'</div>'
          +'<div style="color:var(--do);font-weight:700;margin-top:6px">⚠️ ĐÃ BỐC RỒI</div>'
          +'<div style="margin-top:6px;color:var(--neon)">Thuộc: <b>'+esc(c.tenDoi)+'</b></div>'
          +'</div>';
        if(btn) btn.disabled=true;
        return;
      }
      info.innerHTML='<div class="live-info ok">'
        +'<div class="ten">'+esc(c.hoTen)+'</div>'
        +'<div style="color:var(--neon);font-weight:700;margin-top:4px">✅ Sẵn sàng bốc đội</div>'
        +'</div>';
      if(btn){ btn.disabled=false; btn.dataset.maNV=ma; }
    });
  },300);
}
function liveDTBocDoi(){
  var btn=$('btnLiveDTBoc');
  var ma=btn&&btn.dataset.maNV;
  if(!ma){
    var inp=$('liveMaNV_DT');
    ma=inp?inp.value.trim().toUpperCase():'';
  }
  if(!ma){ toast('Nhập mã NV đội trưởng','err'); return; }
  if(LIVE.dangQuay) return;
  LIVE.dangQuay=true;
  if(btn){ btn.disabled=true; btn.innerHTML='<span class="spin"></span> Đang bốc…'; }
  srv('liveBuoc3TrangThai').then(function(tt){
    if(!tt||!tt.ok){ toast('Lỗi tải','err'); LIVE.dangQuay=false; return; }
    srv('liveDTBocDoiRandom',[LIVE.token,ma]).then(function(r){
      if(!r||!r.ok){
        toast((r&&r.msg)||'Lỗi','err');
        LIVE.dangQuay=false;
        if(btn){btn.disabled=false;btn.textContent='🎲 BỐC ĐỘI';}
        return;
      }
      batDauQuayDoiDT(r, tt.doiTrong);
    });
  });
}
function batDauQuayDoiDT(kq, doiTruocBoc){
  var doiList=doiTruocBoc || [];
  if(!doiList.length){ doiList=STATE.data.doi; }
  if(!doiList.length){ toast('Không có đội để quay','err'); LIVE.dangQuay=false; return; }
  var doiTrung=null;
  if(kq.maDoi){
    doiTrung=doiList.filter(function(d){ return d.maDoi===kq.maDoi; })[0];
    if(!doiTrung){
      var dAll=STATE.data.doi.filter(function(d){ return d.maDoi===kq.maDoi; })[0];
      if(dAll) doiTrung={maDoi:dAll.maDoi, tenDoi:dAll.tenDoi, logoUrl:dAll.logoUrl};
    }
  }
  var O_W = 308;
  var SO_O_RANDOM = 40;
  function pickKhac(list, truoc) {
    if (list.length <= 1) return list[0];
    var chon;
    do { chon = list[Math.floor(Math.random() * list.length)]; }
    while (truoc && chon.maDoi === truoc.maDoi);
    return chon;
  }
  var track = [];
  for(var i=0;i<SO_O_RANDOM;i++){ track.push(pickKhac(doiList, track[track.length-1])); }
  var oTrung = doiTrung || {tenDoi:'?', logoUrl:'', maDoi:''};
  if (track.length && track[track.length-1].maDoi === oTrung.maDoi) {
    track.push(pickKhac(doiList, track[track.length-1]));
  }
  var indexTrung = track.length;
  track.push(oTrung);
  for(var j=0;j<3;j++){ track.push(pickKhac(doiList, track[track.length-1])); }
  function itemHtml(d){
    var logoHtml;
    if(d.logoUrl){
      logoHtml='<img src="'+esc(driveImg(d.logoUrl))+'" onerror="this.outerHTML=\'<div class=&quot;ph&quot;>'
        +esc((d.tenDoi||'?').slice(0,2).toUpperCase())+'</div>\'">';
    } else {
      logoHtml='<div class="ph">'+esc((d.tenDoi||'?').slice(0,2).toUpperCase())+'</div>';
    }
    return '<div class="roulette-item">'+logoHtml
      +'<div class="ten">'+esc(d.tenDoi||'?')+'</div></div>';
  }
  var trackHtml=track.map(itemHtml).join('');
  var h='<div class="live-input-card" style="max-width:820px">'
    +'<div style="text-align:center;margin-bottom:18px">'
    +'<div style="font-family:var(--ff-title);font-size:28px;letter-spacing:1.5px;color:var(--neon)">🎲 ĐANG BỐC ĐỘI…</div>'
    +'<div style="font-size:17px;margin-top:8px">'
    +'<b style="color:var(--chu2);font-size:22px">'+esc(kq.hoTen)+'</b></div>'
    +'</div>'
    +'<div class="roulette-wrap">'
    +'<div class="roulette-track" id="rouletteTrackDT">'+trackHtml+'</div>'
    +'<div class="roulette-pointer"></div>'
    +'</div>'
    +'<div style="text-align:center;margin-top:12px;font-size:16px;color:var(--mo)">Đang chọn đội…</div>'
    +'</div>';
  $('liveStepArea').innerHTML=h;
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      var trackEl=$('rouletteTrackDT');
      if(!trackEl) return;
      var wrapW=trackEl.parentNode.offsetWidth;
      
      // ⭐ Ô rộng 280px + margin 14px × 2 = 308px
      var O_W_FULL = 308;
      var targetX = wrapW/2 - (indexTrung * O_W_FULL + 154);
      
      trackEl.style.transition='none';
      trackEl.style.transform='translateX(0px)';
      
      requestAnimationFrame(function(){
        trackEl.style.transition='transform 7s cubic-bezier(.12,.85,.35,1)';
        trackEl.style.transform='translateX('+targetX+'px)';
      });
    });
  });
  setTimeout(function(){ hienKetQuaDTBocDoi(kq); },7200);
}
function hienKetQuaDTBocDoi(kq){
  LIVE.dangQuay=false;
  var h='<div class="live-input-card" style="text-align:center;background:linear-gradient(135deg,rgba(34,211,238,.08),rgba(236,47,139,.05))">'
    +'<div class="live-result">'
    +'<div class="chuc-mung">🎉 ĐÃ BỐC ĐƯỢC ĐỘI 🎉</div>';
  if(kq.logoUrl){
    h+='<img src="'+esc(driveImg(kq.logoUrl))+'" class="logo-big" '
      +'onerror="this.outerHTML=\'<div class=&quot;logo-big-ph&quot;>'
      +esc((kq.tenDoi||'?').slice(0,2).toUpperCase())+'</div>\'">';
  } else {
    h+='<div class="logo-big-ph">'+esc((kq.tenDoi||'?').slice(0,2).toUpperCase())+'</div>';
  }
  var ct = STATE.data.cauThu.filter(function(x){
    return String(x.hoTen||'') === String(kq.hoTen||'');
  })[0];
  var theHtml = ct ? '<div style="max-width:280px;margin:16px auto 0">'
    + renderTheFifa(ct)
    + '</div>' : '';
  h+='<div class="ten-nguoi">'+esc(kq.hoTen)+'</div>'
    +'<div style="font-size:14px;color:var(--mo);margin-bottom:6px">sẽ dẫn dắt</div>'
    +'<div class="ten-doi">'+esc(kq.tenDoi)+'</div>'
    +theHtml
    +'<div class="loi-chuc" style="margin-top:14px">"Chúc mừng đội trưởng — hãy dẫn dắt đội mình tới chiến thắng!"</div>';
  if(kq.tuDongGan){
    h+='<div style="margin:20px 0;padding:16px;border-radius:12px;background:rgba(255,214,10,.1);border:1.5px solid var(--vang)">'
      +'<div style="font-size:12px;color:var(--vang);font-weight:800;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px">🎁 Đội cuối cùng tự động</div>'
      +'<div style="font-size:20px;font-weight:700;color:var(--chu2);margin-bottom:6px">👑 '+esc(kq.tuDongGan.hoTen)+'</div>'
      +'<div style="font-size:15px;color:var(--cam2)">dẫn dắt <b>'+esc(kq.tuDongGan.tenDoi)+'</b></div>'
      +'</div>';
  }
  if(kq.conLai > 0){
    h+='<button class="btn neon block" style="margin-top:16px;padding:16px;font-size:17px" onclick="liveBocDoiTiep()">'
      +'🎲 ĐỘI TRƯỞNG TIẾP THEO</button>';
  } else {
    h+='<button class="btn cam block" style="margin-top:16px;padding:16px;font-size:17px" onclick="liveChonBuoc(\'b3\')">'
      +'🎊 XEM KẾT QUẢ CUỐI</button>';
  }
  h+='</div></div>';
  $('liveStepArea').innerHTML=h;
  banPhaoHoa(kq.conLai > 0 ? 20 : 60);
}
function renderLiveFinal(tt){
  var h='<div class="live-final">'
    +'<div style="font-size:56px;margin-bottom:8px">🎊</div>'
    +'<h2>ĐÃ XÁC ĐỊNH XONG 4 ĐỘI</h2>'
    +'<p class="sub">Chúc mừng các đội trưởng và các đội bóng!</p>'
    +'<div class="live-final-grid">';
  var dtCoDoi=tt.dtList.filter(function(x){ return x.daCoDoi; });
  dtCoDoi.sort(function(a,b){ return String(a.tenDoi).localeCompare(String(b.tenDoi)); });
  dtCoDoi.forEach(function(dt){
    h+='<div class="live-final-item">';
    if(dt.logoUrl){
      h+='<img src="'+esc(driveImg(dt.logoUrl))+'" '
        +'onerror="this.outerHTML=\'<div class=&quot;logo-ph&quot;>'
        +esc((dt.tenDoi||'?').slice(0,2).toUpperCase())+'</div>\'">';
    } else {
      h+='<div class="logo-ph">'+esc((dt.tenDoi||'?').slice(0,2).toUpperCase())+'</div>';
    }
    h+='<div class="ten-doi">'+esc(dt.tenDoi)+'</div>'
      +'<div class="ten-dt">👑 '+esc(dt.hoTen)+'</div>'
      +(dt.maNV?'<div class="ma-nv">NV: '+esc(dt.maNV)+'</div>':'')
      +'</div>';
  });
  h+='</div>'
    +'<div class="live-final-actions">'
    +'<button class="btn neon" onclick="banPhaoHoa(80)">🎆 BẮN PHÁO HOA</button>'
    +'<button class="btn outline" onclick="liveChonBuoc(\'b1\')">🔄 Xem lại Bước 1</button>'
    +'<button class="btn outline" onclick="liveResetB3()">↩️ Bốc lại Bước 3</button>'
    +'</div>'
    +'</div>';
  $('liveStepArea').innerHTML=h;
  setTimeout(function(){ banPhaoHoa(60); }, 200);
  setTimeout(function(){ banPhaoHoa(40); }, 1000);
  setTimeout(function(){ banPhaoHoa(50); }, 1800);
}
function liveResetB3(){
  if(!confirm('Bốc lại Bước 3? Các đội trưởng sẽ bị gỡ khỏi đội.'))return;
  srv('liveResetBuoc3',[LIVE.token]).then(function(r){
    toast((r&&r.msg)||'Xong',r&&r.ok?'ok':'err');
    if(r&&r.ok) viewLiveMain();
  });
}
function banPhaoHoa(soLuong){
  soLuong = soLuong || 40;
  var wrap=document.createElement('div');
  wrap.className='fw-canvas';
  document.body.appendChild(wrap);
  var colors=['#22d3ee','#ec2f8b','#facc15','#22c55e','#a855f7','#f97316','#fff'];
  var soLanNo=Math.min(6, Math.ceil(soLuong/10));
  for(var b=0; b<soLanNo; b++){
    (function(lan){
      setTimeout(function(){
        var cx=window.innerWidth*(0.2 + Math.random()*0.6);
        var cy=window.innerHeight*(0.15 + Math.random()*0.5);
        var soHat=Math.floor(soLuong/soLanNo);
        var mau=colors[Math.floor(Math.random()*colors.length)];
        for(var i=0;i<soHat;i++){
          var goc=Math.random()*Math.PI*2;
          var luc=80 + Math.random()*140;
          var tx=Math.cos(goc)*luc;
          var ty=Math.sin(goc)*luc + 60;
          var p=document.createElement('div');
          p.className='fw-particle';
          p.style.left=cx+'px';
          p.style.top=cy+'px';
          p.style.background=mau;
          p.style.boxShadow='0 0 8px '+mau+', 0 0 16px '+mau;
          p.style.setProperty('--tx', tx+'px');
          p.style.setProperty('--ty', ty+'px');
          p.style.animationDelay=(Math.random()*0.15)+'s';
          wrap.appendChild(p);
          setTimeout(function(){ if(p.parentNode) p.parentNode.removeChild(p); }, 2600);
        }
      }, lan*180);
    })(b);
  }
  setTimeout(function(){
    if(wrap.parentNode) wrap.parentNode.removeChild(wrap);
  }, 5000);
}
function liveBocDoiTiep(){ viewLiveMain(); }

/* ===== BƯỚC 2 — HÀM ===== */
var _liveTimer=null;
function liveTraMaNV(){
  var inp=$('liveMaNV');
  if(!inp) return;
  var info=$('liveInfo');
  var btn=$('btnLiveBoc');
  var ma=inp.value.trim().toUpperCase();
  if(btn) btn.disabled=true;
  if(!ma){
    if(info) info.innerHTML='';
    clearTimeout(_liveTimer);
    return;
  }
  if(info) info.innerHTML='<div class="muted" style="padding:8px">Đang tìm…</div>';
  clearTimeout(_liveTimer);
  _liveTimer=setTimeout(function(){
    srv('liveTraMaNV',[LIVE.token,ma]).then(function(r){
      if(!r||!r.ok){
        if(info) info.innerHTML='<div class="live-info err">'+(r&&r.msg||'Không tìm thấy')+'</div>';
        if(btn) btn.disabled=true;
        return;
      }
      if(r.daBoc){
        info.innerHTML='<div class="live-info err">'
          +'<div class="ten">'+esc(r.hoTen)+'</div>'
          +'<div style="color:var(--do);font-weight:700;margin-top:6px">⚠️ ĐÃ BỐC RỒI</div>'
          +(r.tenDoi?'<div style="margin-top:6px;color:var(--neon)">Thuộc: <b>'+esc(r.tenDoi)+'</b></div>':'')
          +'</div>';
        if(btn) btn.disabled=true;
      } else if(!r.maDoi){
        info.innerHTML='<div class="live-info err">'
          +'<div class="ten">'+esc(r.hoTen)+'</div>'
          +'<div style="color:var(--do);font-weight:700;margin-top:6px">⚠️ Chưa được BTC chia vào đội</div>'
          +'</div>';
        if(btn) btn.disabled=true;
      } else {
        info.innerHTML='<div class="live-info ok">'
          +'<div class="ten">'+esc(r.hoTen)+'</div>'
          +'<div style="color:var(--neon);font-weight:700;margin-top:4px">✅ Sẵn sàng bốc</div>'
          +'</div>';
        if(btn) btn.disabled=false;
        if(btn) btn.dataset.maNV=ma;
      }
    }).catch(function(e){
      if(info) info.innerHTML='<div class="live-info err">Lỗi: '+esc(e.message)+'</div>';
      if(btn) btn.disabled=true;
    });
  },300);
}
function liveBoc(){
  var btn=$('btnLiveBoc');
  var ma=btn&&btn.dataset.maNV;
  if(!ma){
    var inp=$('liveMaNV');
    ma=inp?inp.value.trim().toUpperCase():'';
  }
  if(!ma){toast('Nhập mã NV','err');return;}
  if(LIVE.dangQuay) return;
  srv('liveTraMaNV',[LIVE.token,ma]).then(function(r){
    if(!r||!r.ok){toast((r&&r.msg)||'Lỗi','err');return;}
    if(r.daBoc){toast(r.hoTen+' đã bốc rồi','err');return;}
    if(!r.maDoi){toast(r.hoTen+' chưa được chia đội','err');return;}
    LIVE.dangQuay=true;
    if(btn){btn.disabled=true;btn.innerHTML='<span class="spin"></span> Đang bốc…';}
    batDauQuay(r.hoTen, r.maDoi, ma);
  });
}
function batDauQuay(hoTen, maDoiTrung, maNV){
  var doiList=STATE.data.doi;
  if(!doiList.length){toast('Chưa có đội','err');return;}
  var doiTrung=doiList.filter(function(d){return d.maDoi===maDoiTrung;})[0];
  if(!doiTrung){toast('Không tìm thấy đội','err');return;}
  var O_W = 308;
  var SO_O_RANDOM = 40;
  function pickKhac(list, truoc) {
    if (list.length <= 1) return list[0];
    var chon;
    do { chon = list[Math.floor(Math.random() * list.length)]; }
    while (truoc && chon.maDoi === truoc.maDoi);
    return chon;
  }
  var track = [];
  for(var i=0;i<SO_O_RANDOM;i++){ track.push(pickKhac(doiList, track[track.length-1])); }
  if (track.length && track[track.length-1].maDoi === doiTrung.maDoi) {
    track.push(pickKhac(doiList, track[track.length-1]));
  }
  var indexTrung = track.length;
  track.push(doiTrung);
  for(var j=0;j<3;j++){ track.push(pickKhac(doiList, track[track.length-1])); }
  function itemHtml(d){
    var logoHtml;
    if(d.logoUrl){
      logoHtml='<img src="'+esc(driveImg(d.logoUrl))+'" onerror="this.outerHTML=\'<div class=&quot;ph&quot;>'
        +esc((d.tenDoi||'?').slice(0,2).toUpperCase())+'</div>\'">';
    } else {
      logoHtml='<div class="ph">'+esc((d.tenDoi||'?').slice(0,2).toUpperCase())+'</div>';
    }
    return '<div class="roulette-item">'+logoHtml
      +'<div class="ten">'+esc(d.tenDoi)+'</div></div>';
  }
  var trackHtml=track.map(itemHtml).join('');
  var h='<div class="live-input-card" style="max-width:820px">'
    +'<div style="text-align:center;margin-bottom:18px">'
    +'<div style="font-family:var(--ff-title);font-size:28px;letter-spacing:1.5px;color:var(--neon)">🎲 ĐANG BỐC…</div>'
    +'<div style="font-size:17px;margin-top:8px">'
    +'<b style="color:var(--chu2);font-size:22px">'+esc(hoTen)+'</b></div>'
    +'</div>'
    +'<div class="roulette-wrap">'
    +'<div class="roulette-track" id="rouletteTrack">'+trackHtml+'</div>'
    +'<div class="roulette-pointer"></div>'
    +'</div>'
    +'<div style="text-align:center;margin-top:12px;font-size:16px;color:var(--mo)">Đang chọn đội…</div>'
    +'</div>';
  var area=$('liveStepArea') || $('liveArea');
  if(area) area.innerHTML=h;
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      var trackEl=$('rouletteTrack');
      if(!trackEl) return;
      var wrapW=trackEl.parentNode.offsetWidth;
      
      // ⭐ Ô rộng 280px + margin 14px × 2 = 308px
      var O_W_FULL = 308;
      var targetX = wrapW/2 - (indexTrung * O_W_FULL + 154);  // 154 = 14 + 140
      
      trackEl.style.transition='none';
      trackEl.style.transform='translateX(0px)';
      
      requestAnimationFrame(function(){
        trackEl.style.transition='transform 7s cubic-bezier(.12,.85,.35,1)';
        trackEl.style.transform='translateX('+targetX+'px)';
      });
    });
  });
  setTimeout(function(){ hienKetQua(hoTen, maDoiTrung, maNV); },7200);
}
function hienKetQua(hoTen, maDoi, maNV){
  srv('liveBocCaNhan',[LIVE.token,maNV]).then(function(r){
    LIVE.dangQuay=false;
    if(!r||!r.ok){
      toast((r&&r.msg)||'Lỗi','err');
      LIVE.ketQuaHienTai=null;
      viewLiveMain();
      return;
    }
    LIVE.ketQuaHienTai={
      hoTen:r.hoTen,
      tenDoi:r.tenDoi,
      logoUrl:r.logoUrl
    };
    renderLiveKetQua(LIVE.ketQuaHienTai);
    loadLiveHistory();
  });
}
function renderLiveKetQua(kq){
  var logoHtml;
  if(kq.logoUrl){
    logoHtml='<img src="'+esc(driveImg(kq.logoUrl))+'" class="logo-big" '
      +'onerror="this.outerHTML=\'<div class=&quot;logo-big-ph&quot;>'
      +esc((kq.tenDoi||'?').slice(0,2).toUpperCase())+'</div>\'">';
  } else {
    logoHtml='<div class="logo-big-ph">'+esc((kq.tenDoi||'?').slice(0,2).toUpperCase())+'</div>';
  }
  var ct = STATE.data.cauThu.filter(function(x){
    return String(x.hoTen||'') === String(kq.hoTen||'');
  })[0];
  var theHtml = ct ? '<div style="max-width:280px;margin:16px auto 0">'
    + renderTheFifa(ct)
    + '</div>' : '';
  var h='<div class="live-input-card" style="max-width:560px;text-align:center;background:linear-gradient(135deg,rgba(34,211,238,.08),rgba(236,47,139,.05))">'
    +'<div class="live-result">'
    +'<div class="chuc-mung">🎉 CHÚC MỪNG! 🎉</div>'
    +logoHtml
    +'<div class="ten-nguoi">'+esc(kq.hoTen)+'</div>'
    +'<div style="font-size:14px;color:var(--mo);margin-bottom:6px">chính thức gia nhập</div>'
    +'<div class="ten-doi">'+esc(kq.tenDoi)+'</div>'
    +theHtml
    +'<div class="loi-chuc" style="margin-top:14px">"Chúc mừng bạn đã về với đội — hãy chiến đấu hết mình!"</div>'
    +'<button class="btn neon block" style="padding:16px;font-size:17px" onclick="tiepTucBoc()">🎲 BỐC NGƯỜI TIẾP</button>'
    +'</div></div>';
  var area=$('liveStepArea') || $('liveArea');
  if(area) area.innerHTML=h;
  banPhaoHoa(12);
}
function tiepTucBoc(){
  LIVE.ketQuaHienTai=null;
  viewLiveMain();
}
function loadLiveHistory(){
  srv('liveLichSuAll').then(function(r){
    var box=$('liveHistory');
    if(!box) return;
    if(!r||!r.ok||!r.items||!r.items.length){
      box.innerHTML='<div class="muted" style="padding:12px;text-align:center">Chưa có ai bốc.</div>';
      return;
    }
    var h='';
    r.items.forEach(function(it){
      var logoHtml;
      if(it.logoUrl){
        logoHtml='<img src="'+esc(driveImg(it.logoUrl))+'" class="mini-logo" '
          +'onerror="this.outerHTML=\'<div class=&quot;mini-logo-ph&quot;>'
          +esc((it.tenDoi||'?').slice(0,2).toUpperCase())+'</div>\'">';
      } else {
        logoHtml='<div class="mini-logo-ph">'+esc((it.tenDoi||'?').slice(0,2).toUpperCase())+'</div>';
      }
      var tag = it.loai==='DT_BOC_DOI'
        ? '<span class="pill captain" style="font-size:10px;padding:2px 6px">👑 ĐT</span> '
        : '';
      h+='<div class="live-history-item">'
        +logoHtml
        +'<span class="h-ct">'+tag+esc(it.hoTen)+'</span>'
        +'<span class="h-doi">→ '+esc(it.tenDoi)+'</span>'
        +'</div>';
    });
    box.innerHTML=h;
  });
}

/* ================= ĐÓNG MODAL CLICK NGOÀI ================= */
document.addEventListener('click',function(e){
  if(e.target.classList && e.target.classList.contains('modal')){
    e.target.classList.remove('show');
  }
});
/* ================= VIEW: THẺ CẦU THỦ ================= */
function viewTheCauThu(){
  var d = STATE.data;
  var ds = d.cauThu.slice();

  var h = '<div class="card"><h2>🎴 Thẻ cầu thủ ('+ds.length+')</h2>'
    + '<p class="muted" style="margin-bottom:12px">'
    + 'Xem thẻ của tất cả cầu thủ đã đăng ký. Bấm vào thẻ để phóng to.'
    + '</p>';

  // Bộ lọc
  var doiOpts = '<option value="">— Tất cả đội —</option>'
    + '<option value="__NONE__">— Chưa vào đội —</option>'
    + d.doi.map(function(t){
        return '<option value="'+esc(t.maDoi)+'">'+esc(t.tenDoi)+'</option>';
      }).join('');
  var theOpts = '<option value="">— Tất cả loại thẻ —</option>'
    + '<option value="bac">🥈 Bạc</option>'
    + '<option value="vang">🔴 Đỏ</option>'
    + '<option value="kimcuong">🔵 Xanh</option>'
    + '<option value="huyenthoai">✨ Huyền thoại</option>';
  var hgOpts = '<option value="">— Tất cả trình độ —</option>'
    + '<option value="BIET">👍 Biết đá</option>'
    + '<option value="PT">🎉 Phong trào</option>';
  var vtOpts = '<option value="">— Tất cả vị trí —</option>'
    + '<option value="TM">🧤 Thủ môn</option>'
    + '<option value="HVTT">🛡️ HV trung tâm</option>'
    + '<option value="HVCT">🏃 HV cánh</option>'
    + '<option value="TV">⚙️ Tiền vệ</option>'
    + '<option value="TD">⚡ Tiền đạo</option>';

  h += '<div class="grid2" style="margin-bottom:14px">'
    + '<div><label>Lọc theo đội</label>'
    + '<select id="theLocDoi" onchange="locTheCauThu()">'+doiOpts+'</select></div>'
    + '<div><label>Lọc theo loại thẻ</label>'
    + '<select id="theLocThe" onchange="locTheCauThu()">'+theOpts+'</select></div>'
    + '</div>'
    + '<div class="grid2" style="margin-bottom:14px">'
    + '<div><label>Lọc theo trình độ</label>'
    + '<select id="theLocHg" onchange="locTheCauThu()">'+hgOpts+'</select></div>'
    + '<div><label>Lọc theo vị trí</label>'
    + '<select id="theLocVt" onchange="locTheCauThu()">'+vtOpts+'</select></div>'
    + '</div>'
    + '<div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap">'
    +   '<button class="btn neon" id="btnTaiTatCaThe" onclick="taiTatCaTheHienThi()">'
    +     '📸 Tải tất cả thẻ đang hiển thị'
    +   '</button>'
    + '</div>'
    + '<div id="theList"></div>'
    + '</div>';

  $('view').innerHTML = h;
  locTheCauThu();
}

function locTheCauThu(){
  var d = STATE.data;
  var mxDoi = $('theLocDoi') ? $('theLocDoi').value : '';
  var mxThe = $('theLocThe') ? $('theLocThe').value : '';
  var mxHg  = $('theLocHg')  ? $('theLocHg').value  : '';
  var mxVt  = $('theLocVt')  ? $('theLocVt').value  : '';

  // ⭐ Kiểm tra đội đang lọc có phải đội chính không
  var locDoiChinh = false;
  if(mxDoi && mxDoi !== '__NONE__'){
    var _dt = doiObj(mxDoi);
    locDoiChinh = _dt && String(_dt.loaiDoi||'').toUpperCase()!=='GH';
  }

  var ds = d.cauThu.filter(function(c){
    // Lọc đội: nếu là đội chính → gom cả cầu thủ có maDoiGoc === mxDoi
    if (mxDoi === '__NONE__') {
      if (c.maDoi) return false;
    } else if (mxDoi) {
      if (locDoiChinh) {
        // Đội chính: cầu thủ đang thuộc đội này HOẶC có đội gốc là đội này
        if (c.maDoi !== mxDoi && c.maDoiGoc !== mxDoi) return false;
      } else {
        // Đội GH: chỉ lấy cầu thủ đang thực sự thuộc GH
        if (c.maDoi !== mxDoi) return false;
      }
    }

    // Lọc loại thẻ
    if (mxThe) {
      var lt = String(c.loaiThe || '').toLowerCase();
      if (!lt) lt = (String(c.hatGiong||'').toUpperCase()==='BIET') ? 'vang' : 'bac';
      if (lt !== mxThe) return false;
    }

    // Lọc hạt giống
    if (mxHg && String(c.hatGiong||'').toUpperCase() !== mxHg) return false;

    // Lọc vị trí
    if (mxVt) {
      var vl = String(c.viTriList||'').toUpperCase().split(',').filter(function(v){return v;});
      if (vl.indexOf(mxVt) < 0) return false;
    }

    return true;
  });

  // Sắp xếp: đội trưởng lên đầu, rồi theo rating giảm dần
  ds.sort(function(a,b){
    var ra = Number(a.rating)||0, rb = Number(b.rating)||0;
    if (ra !== rb) return rb - ra;
    return String(a.hoTen||'').localeCompare(String(b.hoTen||''));
  });

  var box = $('theList');
  if (!box) return;

  if (!ds.length) {
    box.innerHTML = '<div class="empty">Không có cầu thủ nào khớp bộ lọc.</div>';
    return;
  }

  var h = '<div class="muted" style="margin-bottom:10px">'+ds.length+' cầu thủ</div>';
  h += '<div class="fifa-grid-wrap" id="gridTheList">';
  ds.forEach(function(c){
    // ⭐ Ưu tiên logo + khung đội gốc khi:
    //   - Đang lọc theo 1 đội chính cụ thể, HOẶC
    //   - Không lọc đội (xem tất cả) — vẫn ưu tiên đội gốc cho cầu thủ mượn GH
    var uuTien = locDoiChinh || (!mxDoi);
    h += renderTheFifa(c, uuTien);
  });
  h += '</div>';
  box.innerHTML = h;
}
/* ================= KHỞI ĐỘNG ================= */
/* ================= VIEW: ĐỘI HÌNH THI ĐẤU ================= */
var HINH_STATE = {
  maDoi: '',
  soDo: '2-3-1'
};
function taiTatCaTheHienThi(){
  var soThe = document.querySelectorAll('#gridTheList .futc').length;
  if(!soThe){ toast('Không có thẻ nào','err'); return; }

  // ⭐ Nếu đang lọc theo 1 đội cụ thể → lấy logo + tên đội đó
  var mxDoi = $('theLocDoi') ? $('theLocDoi').value : '';
  var logoUrl = '';
  var tieuDe = 'Danh sách thẻ cầu thủ';
  if(mxDoi && mxDoi !== '__NONE__'){
    var d = doiObj(mxDoi);
    if(d){
      logoUrl = d.logoUrl || '';
      tieuDe = d.tenDoi;
    }
  }

  taiDanhSachThePng('#gridTheList', 'the_' + soThe + 'ct', {
    tieuDe: tieuDe,
    logoUrl: logoUrl
  });
}
/* Chuẩn hoá mã sơ đồ — Google Sheets hay tự đổi "3-1-2" thành ngày "3-1-2002".
   Hàm này khôi phục lại đúng sơ đồ (năm YYYY → số cuối = YYYY-2000). */
function chuanSoDo_(s){
  s = String(s||'').trim();
  if(SO_DO_LIST[s]) return s;
  var m = s.match(/^(\d+)-(\d+)-(\d{4})$/);   // vd "3-1-2002" → "3-1-2"
  if(m){
    var v = m[1]+'-'+m[2]+'-'+(parseInt(m[3],10)-2000);
    if(SO_DO_LIST[v]) return v;
  }
  return SO_DO_LIST[s] ? s : '2-3-1';
}

var SO_DO_LIST = {
  '2-3-1': [
    {pos:'TM',  x:50, y:90, label:'TM'},
    {pos:'HVTT',x:24, y:70, label:'LB'},
    {pos:'HVTT',x:76, y:70, label:'RB'},
    {pos:'TV',  x:18, y:35, label:'LM'},
    {pos:'TV',  x:50, y:46, label:'CM'},
    {pos:'TV',  x:82, y:35, label:'RM'},
    {pos:'TD',  x:50, y:15, label:'ST'}
  ],
  '3-1-2': [
    {pos:'TM',  x:50, y:90, label:'TM'},
    {pos:'HVTT',x:14, y:62, label:'LB'},       /* ⭐ sang trái + cao lên */
    {pos:'HVTT',x:50, y:68, label:'CB'},       /* ⭐ xuống dưới */
    {pos:'HVTT',x:86, y:62, label:'RB'},       /* ⭐ sang phải + cao lên */
    {pos:'TV',  x:50, y:42, label:'CM'},
    {pos:'TD',  x:32, y:15, label:'LS'},
    {pos:'TD',  x:68, y:15, label:'RS'}
  ],
  '2-2-2': [
    {pos:'TM',  x:50, y:90, label:'TM'},
    {pos:'HVTT',x:26, y:70, label:'LB'},
    {pos:'HVTT',x:74, y:70, label:'RB'},
    {pos:'TV',  x:14, y:46, label:'LM'},       /* ⭐ dịch sang trái */
    {pos:'TV',  x:86, y:46, label:'RM'},       /* ⭐ dịch sang phải */
    {pos:'TD',  x:32, y:15, label:'LS'},
    {pos:'TD',  x:68, y:15, label:'RS'}
  ],
  '1-3-2': [
    {pos:'TM',  x:50, y:90, label:'TM'},
    {pos:'HVTT',x:50, y:70, label:'CB'},
    {pos:'TV',  x:18, y:46, label:'LM'},
    {pos:'TV',  x:50, y:44, label:'CM'},
    {pos:'TV',  x:82, y:46, label:'RM'},
    {pos:'TD',  x:32, y:15, label:'LS'},
    {pos:'TD',  x:68, y:15, label:'RS'}
  ],
  '3-2-1': [
    {pos:'TM',  x:50, y:90, label:'TM'},
    {pos:'HVTT',x:14, y:62, label:'LB'},       /* ⭐ sang trái + cao lên */
    {pos:'HVTT',x:50, y:68, label:'CB'},       /* ⭐ xuống dưới */
    {pos:'HVTT',x:86, y:62, label:'RB'},       /* ⭐ sang phải + cao lên */
    {pos:'TV',  x:34, y:40, label:'CM'},
    {pos:'TV',  x:66, y:40, label:'CM'},
    {pos:'TD',  x:50, y:15, label:'ST'}
  ],
  '2-1-2-1': [
    {pos:'TM',  x:50, y:90, label:'TM'},
    {pos:'HVTT',x:28, y:70, label:'LB'},
    {pos:'HVTT',x:72, y:70, label:'RB'},
    {pos:'TV',  x:50, y:54, label:'CDM'},
    {pos:'TV',  x:22, y:34, label:'LM'},
    {pos:'TV',  x:78, y:34, label:'RM'},
    {pos:'TD',  x:50, y:15, label:'ST'}
  ]
};
/* ⭐ Bản sao dành RIÊNG cho modal 2 đội — sửa tự do không ảnh hưởng tab Đội hình */
var SO_DO_LIST_2DOI = {
  '2-3-1': [
    {pos:'TM',  x:50, y:102, label:'TM'},
    {pos:'HVTT',x:26, y:70, label:'LB'},
    {pos:'HVTT',x:74, y:70, label:'RB'},
    {pos:'TV',  x:18, y:42, label:'LM'},
    {pos:'TV',  x:50, y:46, label:'CM'},
    {pos:'TV',  x:82, y:42, label:'RM'},
    {pos:'TD',  x:50, y:15, label:'ST'}
  ],
  '3-1-2': [
    {pos:'TM',  x:50, y:102, label:'TM'},
    {pos:'HVTT',x:22, y:65, label:'LB'},
    {pos:'HVTT',x:50, y:70, label:'CB'},
    {pos:'HVTT',x:78, y:65, label:'RB'},
    {pos:'TV',  x:50, y:42, label:'CM'},
    {pos:'TD',  x:32, y:15, label:'LS'},
    {pos:'TD',  x:68, y:15, label:'RS'}
  ],
  '2-2-2': [
    {pos:'TM',  x:50, y:102, label:'TM'},
    {pos:'HVTT',x:30, y:75, label:'LB'},
    {pos:'HVTT',x:70, y:75, label:'RB'},
    {pos:'TV',  x:26, y:46, label:'LM'},
    {pos:'TV',  x:74, y:46, label:'RM'},
    {pos:'TD',  x:35, y:15, label:'LS'},
    {pos:'TD',  x:65, y:15, label:'RS'}
  ],
  '1-3-2': [
    {pos:'TM',  x:50, y:102, label:'TM'},
    {pos:'HVTT',x:50, y:70, label:'CB'},
    {pos:'TV',  x:18, y:46, label:'LM'},
    {pos:'TV',  x:50, y:44, label:'CM'},
    {pos:'TV',  x:82, y:46, label:'RM'},
    {pos:'TD',  x:32, y:15, label:'LS'},
    {pos:'TD',  x:68, y:15, label:'RS'}
  ],
  '3-2-1': [
    {pos:'TM',  x:50, y:102, label:'TM'},
    {pos:'HVTT',x:22, y:73, label:'LB'},
    {pos:'HVTT',x:50, y:75, label:'CB'},
    {pos:'HVTT',x:78, y:73, label:'RB'},
    {pos:'TV',  x:34, y:46, label:'CM'},
    {pos:'TV',  x:66, y:46, label:'CM'},
    {pos:'TD',  x:50, y:15, label:'ST'}
  ],
  '2-1-2-1': [
    {pos:'TM',  x:50, y:102, label:'TM'},
    {pos:'HVTT',x:28, y:70, label:'LB'},
    {pos:'HVTT',x:72, y:70, label:'RB'},
    {pos:'TV',  x:50, y:50, label:'CDM'},
    {pos:'TV',  x:22, y:34, label:'LM'},
    {pos:'TV',  x:78, y:34, label:'RM'},
    {pos:'TD',  x:50, y:15, label:'ST'}
  ]
};

function getDoiHinh_(maDoi){
  if(!STATE.data.doiHinh[maDoi]) STATE.data.doiHinh[maDoi] = { soDo:'2-3-1', slots:{} };
var cfg = STATE.data.doiHinh[maDoi];
if(!cfg.slots) cfg.slots = {};
if(!cfg.soDo || !SO_DO_LIST[cfg.soDo]) cfg.soDo = chuanSoDo_(cfg.soDo);
  return cfg;
}
/* ============================================================
   TAB ĐỘI HÌNH — Slot + thẻ mini mới (prefix dh-)
   Độc lập với slot3dHtml_ / miniCardHtml_ (dùng cho modal 2 đội)
   ============================================================ */
function slotDhHtml_(i, x, y, c, isCap, label, clickable, uuTienDoiGoc){
  var inner;
  if(c){
    inner = miniCardDhHtml_(c, isCap, uuTienDoiGoc);
  } else {
    inner = '<div class="dh-card-empty">+</div>';
  }
  var cls = 'dh-slot' + (c?'':' empty') + (isCap?' cap':'');
  var attrs = clickable ? (' data-slot="'+i+'" onclick="clickSlot('+i+')"') : '';
  return '<div class="'+cls+'"'+attrs+' style="left:'+x+'%;top:'+y+'%">'
    + inner
    + '<div class="dh-label">'+esc(label)+'</div>'
    + '</div>';
}

function miniCardDhHtml_(c, isCap, uuTienDoiGoc){
  var scVal = Number(c.anhScale) || 1;
  var yVal = Number(c.anhY) || 0;
  var imgStyle = '';
  if(scVal !== 1) imgStyle += '--anh-sc:'+scVal+';';
  if(yVal !== 0) imgStyle += '--anh-y:'+yVal+'%;';
  var imgStyleAttr = imgStyle ? ' style="'+imgStyle+'"' : '';

    var maDoiHien_ = (uuTienDoiGoc && c.maDoiGoc) ? c.maDoiGoc : c.maDoi;
  var anhDung_ = anhCuaCauThu_(c, maDoiHien_);
  var photoHtml = anhDung_
    ? '<img src="'+esc(driveImg(anhDung_))+'" alt=""'+imgStyleAttr+' '
      + 'onerror="this.outerHTML=\'<div class=&quot;ph&quot;>'
      + esc((c.hoTen||'?').slice(0,1).toUpperCase())+'</div>\'">'
    : '<div class="ph">'+esc((c.hoTen||'?').slice(0,1).toUpperCase())+'</div>';

  var loaiThe = String(c.loaiThe||'').toLowerCase();
  if(['bac','vang','kimcuong','huyenthoai'].indexOf(loaiThe) < 0){
    loaiThe = (String(c.hatGiong||'').toUpperCase()==='BIET') ? 'vang' : 'bac';
  }
  var rating = Number(c.rating) || 80;
  var soAoHtml = c.soAo ? '<div class="so">'+esc(c.soAo)+'</div>' : '';
  var tenFull = String(c.hoTen||'').trim();
  var parts = tenFull.split(/\s+/);
  var tenNgan = parts.length >= 2 ? parts.slice(-2).join(' ') : tenFull;

  var _kh = khungCuaCauThu_(c, uuTienDoiGoc);
  var frStyle = _kh ? ' style="--fr:url(\''+esc(_kh)+'\')"' : '';
  var frClass = _kh ? ' has-fr' : '';

  return '<div class="dh-card '+loaiThe+frClass+(isCap?' cap':'')+'"'+frStyle+'>'
    + photoHtml
    + '<div class="rt">'+rating+'</div>'
    + soAoHtml
    + '<div class="nm">'+esc(tenNgan)+'</div>'
    + '</div>';
}
/* ============================================================
   KÉO THẢ SLOT TRÊN SÂN (chỉ BTC) — lưu tọa độ tạm vào localStorage
   Nhấn giữ ~200ms rồi kéo. Nhấp đúp để nhập tọa độ chính xác.
   ============================================================ */
function napToaDoLocal_(){
  try{
    var raw = localStorage.getItem('bd_sodo_custom');
    if(!raw) return;
    var obj = JSON.parse(raw);
    Object.keys(obj).forEach(function(k){
      if(!SO_DO_LIST[k]) return;
      var arr = obj[k];
      arr.forEach(function(sl, i){
        if(SO_DO_LIST[k][i] && sl && isFinite(sl.x) && isFinite(sl.y)){
          SO_DO_LIST[k][i].x = Number(sl.x);
          SO_DO_LIST[k][i].y = Number(sl.y);
        }
      });
    });
  }catch(e){}
}

function luuToaDoLocal_(){
  try{
    var obj = {};
    Object.keys(SO_DO_LIST).forEach(function(k){
      obj[k] = SO_DO_LIST[k].map(function(sl){
        return { x: sl.x, y: sl.y };
      });
    });
    localStorage.setItem('bd_sodo_custom', JSON.stringify(obj));
  }catch(e){}
}

function resetToaDoSlot(){
  if(!confirm('Reset toạ độ tất cả slot về mặc định?')) return;
  try{ localStorage.removeItem('bd_sodo_custom'); }catch(e){}
  toast('Đã reset — đang tải lại…','ok');
  setTimeout(function(){ location.reload(); }, 700);
}

function ganKeoSlotDh_(){
  if(!isAdmin()) return;
  var pitch = document.querySelector('.dh-pitch');
  if(!pitch) return;
  var soDoArr = SO_DO_LIST[HINH_STATE.soDo];
  if(!soDoArr) return;

  pitch.querySelectorAll('.dh-slot').forEach(function(el){
    var idx = +el.dataset.slot;
    if(isNaN(idx)) return;
    var dragging = false;
    var startX = 0, startY = 0, startLeft = 0, startTop = 0;
    var timer = null;
    var daKeo = false;

    function diem_(e){
      if(e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      return { x: e.clientX, y: e.clientY };
    }
    function batDau(e){
      var p = diem_(e);
      startX = p.x; startY = p.y;
      startLeft = soDoArr[idx].x;
      startTop  = soDoArr[idx].y;
      daKeo = false;
      timer = setTimeout(function(){
        dragging = true;
        el.classList.add('dragging');
        el.style.transition = 'none';
        el.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
      }, 200);
    }
    function diChuyen(e){
      if(!dragging) return;
      e.preventDefault();
      var p = diem_(e);
      var rect = pitch.getBoundingClientRect();
      var dx = (p.x - startX) / rect.width  * 100;
      var dy = (p.y - startY) / rect.height * 100;
      var nx = Math.max(0, Math.min(100, startLeft + dx));
      var ny = Math.max(0, Math.min(100, startTop  + dy));
      el.style.left = nx + '%';
      el.style.top  = ny + '%';
      soDoArr[idx].x = Math.round(nx * 10) / 10;
      soDoArr[idx].y = Math.round(ny * 10) / 10;
      daKeo = true;
    }
    function ketThuc(e){
      clearTimeout(timer);
      if(dragging){
        dragging = false;
        el.classList.remove('dragging');
        el.style.transition = '';
        el.style.cursor = '';
        document.body.style.userSelect = '';
        luuToaDoLocal_();
        toast('Toạ độ: x=' + soDoArr[idx].x + ' y=' + soDoArr[idx].y + ' (đã lưu tạm)', 'ok');
        if(daKeo){
          el._vuaKeo = true;
          setTimeout(function(){ el._vuaKeo = false; }, 400);
        }
      }
    }

    el.addEventListener('mousedown', batDau);
    el.addEventListener('touchstart', batDau, { passive: true });
    document.addEventListener('mousemove', diChuyen);
    document.addEventListener('touchmove', diChuyen, { passive: false });
    document.addEventListener('mouseup', ketThuc);
    document.addEventListener('touchend', ketThuc);

    // Đúp chuột → nhập toạ độ chính xác
    el.addEventListener('dblclick', function(ev){
      ev.stopPropagation();
      var cur = soDoArr[idx];
      var s = prompt('Nhập "x,y" (0-100):', cur.x + ',' + cur.y);
      if(!s) return;
      var m = s.split(',').map(function(v){ return parseFloat(v.trim()); });
      if(m.length !== 2 || isNaN(m[0]) || isNaN(m[1])){ toast('Sai định dạng','err'); return; }
      cur.x = Math.max(0, Math.min(100, Math.round(m[0] * 10) / 10));
      cur.y = Math.max(0, Math.min(100, Math.round(m[1] * 10) / 10));
      el.style.left = cur.x + '%';
      el.style.top  = cur.y + '%';
      luuToaDoLocal_();
      toast('Đã cập nhật x=' + cur.x + ' y=' + cur.y, 'ok');
    });
  });
}
function viewDoiHinh(){
  var d = STATE.data;
  if(!d.doi.length){
    $('view').innerHTML = '<div class="card"><div class="empty">Chưa có đội nào.</div></div>';
    return;
  }
  if(!HINH_STATE.maDoi || !doiObj(HINH_STATE.maDoi)){
    HINH_STATE.maDoi = d.doi[0].maDoi;
  }
  var team = doiObj(HINH_STATE.maDoi);
  var cfg = getDoiHinh_(HINH_STATE.maDoi);
  HINH_STATE.soDo = cfg.soDo || '2-3-1';
  var laDoiGH = String(team.loaiDoi||'').toUpperCase()==='GH';
  var gomCaGH = !laDoiGH;

  /* ============ CỘT TRÁI: chọn đội + sơ đồ + dự bị ============ */
  var leftH = '<div class="form-bar">';

  leftH += '<div>'
    + '<label>Đội</label>'
    + '<select onchange="HINH_STATE.maDoi=this.value;_slotDangChon=-1;viewDoiHinh()">';
  d.doi.forEach(function(t){
    leftH += '<option value="'+esc(t.maDoi)+'"'+(t.maDoi===HINH_STATE.maDoi?' selected':'')+'>'
      + esc(t.tenDoi) + '</option>';
  });
  leftH += '</select></div>';

  leftH += '<div>'
    + '<label>Sơ đồ</label>'
    + '<select onchange="doiSoDo(this.value)">';
  Object.keys(SO_DO_LIST).forEach(function(s){
    leftH += '<option value="'+s+'"'+(s===HINH_STATE.soDo?' selected':'')+'>'+s+'</option>';
  });
  leftH += '</select></div>';

    if(isAdmin()){
    leftH += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">'
      + '<button class="btn outline sm" onclick="tuDongXepHinh()">🤖 Tự động xếp</button>'
      + '<button class="btn danger sm" onclick="xoaHinhDoi()">🗑 Xóa đội hình</button>'
      + '</div>'
      + '<button class="btn neon block sm" id="btnLuuHinh" onclick="luuDoiHinhServer()">💾 Lưu lên server</button>'
      + '<button class="btn outline block sm" onclick="resetToaDoSlot()" '
      + 'style="font-size:11.5px;margin-top:4px" title="Chỉ ảnh hưởng hiển thị sân, không đụng dữ liệu đội">'
      + '↩️ Reset toạ độ slot</button>';
  }
  leftH += '</div>';

  // Danh sách dự bị
  var daXep = {};
  Object.keys(cfg.slots).forEach(function(k){ if(cfg.slots[k]) daXep[cfg.slots[k]] = true; });
  var allPlayers = cauThuTrongDoi(HINH_STATE.maDoi, gomCaGH);
  var bench = allPlayers.filter(function(c){ return !daXep[c.maCT]; });
   bench.sort(function(a,b){
    var ra = Number(a.rating)||0, rb = Number(b.rating)||0;
    if(ra !== rb) return rb - ra;
    return String(a.hoTen).localeCompare(String(b.hoTen));
  });

  leftH += '<div class="bench" id="benchBox">'
    + '<div class="bench-title"><span>🪑 Dự bị / chưa xếp ('+bench.length+')</span>'
    + (isAdmin()?'<span style="font-size:10.5px;color:var(--neon)">Bấm cầu thủ để xếp vào slot</span>':'')
    + '</div>';

  if(!bench.length){
    leftH += '<div class="bench-empty">Tất cả cầu thủ đã được xếp vào đội hình.</div>';
  } else {
    leftH += '<div class="bench-fifa-wrap">';
    bench.forEach(function(c){
      // Nút "+" để xếp vào sân (chỉ BTC)
      var addBtn = isAdmin()
        ? '<button class="bench-add" onclick="event.stopPropagation();ganVaoSlot(\''+c.maCT+'\')" title="Xếp vào đội hình">+</button>'
        : '';
      // Click vào thẻ → mở modal xem chi tiết (renderTheFifa đã có onclick sẵn)
      leftH += '<div class="bench-fifa">'
        + renderTheFifa(c, gomCaGH)
        + addBtn
        + '</div>';
    });
    leftH += '</div>';
  }
  leftH += '</div>';

  /* ============ CỘT PHẢI: sân ảnh thật ============ */
    /* ============ CỘT PHẢI: sân + đội hình (thiết kế mới) ============ */
  var rightH = '';
  rightH += '<div class="dh-pitch">';

  // Vẽ slot cầu thủ theo sơ đồ (ảnh sân đã có vạch kẻ sẵn, không vẽ nữa)
  var soDo = SO_DO_LIST[HINH_STATE.soDo] || SO_DO_LIST['2-3-1'];
  soDo.forEach(function(sl, i){
    var maCT = cfg.slots[i] || '';
    var c = maCT ? cauThuObj(maCT) : null;
    var isCap = c && team.doiTruong === c.maCT;
    rightH += slotDhHtml_(i, sl.x, sl.y, c, isCap, sl.label, true, gomCaGH);
  });

  rightH += '</div>';

  /* ============ KHUNG 2 CỘT ============ */
  var h = '<div class="card">'
    + '<h2>⚽ Đội hình thi đấu</h2>'
    + '<div class="doihinh-2col">'
    +   '<div class="doihinh-col-left">'  + leftH  + '</div>'
    +   '<div class="doihinh-col-right">' + rightH + '</div>'
    + '</div>'
    + '</div>';

    $('view').innerHTML = h;

  // ⭐ Gắn sự kiện kéo thả slot (chỉ BTC)
  ganKeoSlotDh_();
}

function doiSoDo(s){
  if(!SO_DO_LIST[s]) return;
  var cfg = getDoiHinh_(HINH_STATE.maDoi);
  cfg.soDo = s;
  HINH_STATE.soDo = s;
  luuDoiHinh();
  viewDoiHinh();
}

var _slotDangChon = -1;
var _slotDangChon = -1;
function clickSlot(i){
  // Nếu vừa kéo thả → không mở/gán
  var el = document.querySelector('.dh-slot[data-slot="'+i+'"]');
  if(el && el._vuaKeo) return;

  var cfg = getDoiHinh_(HINH_STATE.maDoi);
  var maCT = cfg.slots[i];

  // ⭐ CÓ cầu thủ → mở modal xem thẻ cho MỌI người (kể cả admin)
  if(maCT){
    var _t = doiObj(HINH_STATE.maDoi);
    var _uu = !(_t && String(_t.loaiDoi||'').toUpperCase()==='GH');
    xemTheTo(maCT, _uu?1:0);
    return;
  }

  // Slot TRỐNG → chỉ admin mới chọn để xếp cầu thủ
  if(!isAdmin()) return;
  _slotDangChon = i;
  toast('Đã chọn vị trí trống — bấm dấu + trên thẻ dự bị để xếp vào');
}

/* ⭐ Gỡ cầu thủ khỏi slot (BTC bấm nút × trên thẻ) */
function goCauThuKhoiSlot(maCT){
  if(!isAdmin()) return;
  var cfg = getDoiHinh_(HINH_STATE.maDoi);
  var found = false;
  Object.keys(cfg.slots).forEach(function(k){
    if(cfg.slots[k] === maCT){
      delete cfg.slots[k];
      found = true;
    }
  });
  if(found){
    luuDoiHinh();
    viewDoiHinh();
    toast('Đã gỡ khỏi đội hình','ok');
  }
}

function ganVaoSlot(maCT){
  if(!isAdmin()) return;
  if(_slotDangChon < 0){
    // Không có slot chọn sẵn → tự tìm slot trống đầu tiên
    var cfg = getDoiHinh_(HINH_STATE.maDoi);
    var soDo = SO_DO_LIST[HINH_STATE.soDo];
    for(var i=0;i<soDo.length;i++){
      if(!cfg.slots[i]){ _slotDangChon = i; break; }
    }
    if(_slotDangChon < 0){ toast('Đội hình đã đầy, hãy gỡ 1 vị trí trước','err'); return; }
  }
  var cfg = getDoiHinh_(HINH_STATE.maDoi);
  // Nếu cầu thủ đang ở slot khác → gỡ khỏi slot cũ
  Object.keys(cfg.slots).forEach(function(k){
    if(cfg.slots[k] === maCT) delete cfg.slots[k];
  });
  cfg.slots[_slotDangChon] = maCT;
  _slotDangChon = -1;
  luuDoiHinh();
  viewDoiHinh();
  toast('Đã xếp vào đội hình','ok');
}

function tuDongXepHinh(){
  if(!isAdmin()) return;
  if(!confirm('Tự động xếp cầu thủ theo vị trí sở trường?')) return;
  var cfg = getDoiHinh_(HINH_STATE.maDoi);
  cfg.slots = {};
  var soDo = SO_DO_LIST[HINH_STATE.soDo];
  // ⭐ Đội chính gom cả cầu thủ đang mượn ở GH
  var _team = doiObj(HINH_STATE.maDoi);
  var _laGH = _team && String(_team.loaiDoi||'').toUpperCase()==='GH';
  var players = cauThuTrongDoi(HINH_STATE.maDoi, !_laGH).slice();
  var used = {};

  soDo.forEach(function(sl, i){
    var match = players.filter(function(c){
      if(used[c.maCT]) return false;
      var vl = String(c.viTriList||'').toUpperCase().split(',').filter(function(v){return v;});
      return vl.indexOf(sl.pos) >= 0;
    })[0];
    if(match){ cfg.slots[i] = match.maCT; used[match.maCT] = true; }
  });
  // Lấp slot còn trống bằng ai chưa xếp
  var conLai = players.filter(function(c){ return !used[c.maCT]; });
  soDo.forEach(function(sl, i){
    if(!cfg.slots[i] && conLai.length){
      var c = conLai.shift();
      cfg.slots[i] = c.maCT;
    }
  });
  luuDoiHinh();
  viewDoiHinh();
  toast('Đã tự động xếp đội hình','ok');
}

function xoaHinhDoi(){
  if(!isAdmin()) return;
  if(!confirm('Xóa toàn bộ đội hình '+doiObj(HINH_STATE.maDoi).tenDoi+'?')) return;
  var cfg = getDoiHinh_(HINH_STATE.maDoi);
  cfg.slots = {};
  luuDoiHinh();
  viewDoiHinh();
  toast('Đã xóa đội hình','ok');
}

// Lưu local (cache) — server đã có STATE.data.doiHinh từ napDuLieu
function luuDoiHinh(){
  try{
    localStorage.setItem('bd_doihinh_' + (STATE.data.maDotBoc||'DOT1'),
      JSON.stringify(STATE.data.doiHinh||{}));
  }catch(e){}

  // ⭐ Auto-save server sau 3s nếu là admin (debounce)
  if(isAdmin()){
    clearTimeout(window._autoSaveHinhTimer);
    window._autoSaveHinhTimer = setTimeout(function(){
      var cfg = getDoiHinh_(HINH_STATE.maDoi);
      srv('luuDoiHinh', [STATE.token, HINH_STATE.maDoi, cfg.soDo, cfg.slots]).then(function(r){
        if(r&&r.ok){
          var btn = $('btnLuuHinh');
          if(btn){
            var old = btn.innerHTML;
            btn.innerHTML = '✅ Đã tự động lưu';
            btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
            btn.style.color = '#fff';
            setTimeout(function(){
              btn.innerHTML = '💾 Lưu lên server';
              btn.style.background = '';
              btn.style.color = '';
            }, 1800);
          }
        }
      });
    }, 3000);
  }
}

// Chỉ là hàm no-op — đội hình đã được server gửi kèm trong napDuLieu
function napDoiHinhLocal_(){
  if(!STATE.data.doiHinh) STATE.data.doiHinh = {};
}

// Gửi 1 đội hình lên server
function luuDoiHinhServer(){
  if(!isAdmin()){ toast('Chỉ BTC mới lưu được','err'); return; }
  var cfg = getDoiHinh_(HINH_STATE.maDoi);
  var btn = $('btnLuuHinh');
  if(btn){ btn.disabled = true; btn.innerHTML = '<span class="spin"></span> Đang lưu…'; }
  srv('luuDoiHinh', [STATE.token, HINH_STATE.maDoi, cfg.soDo, cfg.slots]).then(function(r){
    if(btn){ btn.disabled = false; btn.innerHTML = '💾 Lưu lên server'; }
    toast(r&&r.ok ? 'Đã lưu đội hình lên server' : ((r&&r.msg)||'Lỗi'), r&&r.ok?'ok':'err');
  }).catch(function(e){
    if(btn){ btn.disabled = false; btn.innerHTML = '💾 Lưu lên server'; }
    toast('Lỗi: '+e.message,'err');
  });
}

// Gửi tất cả đội hình lên server 1 lượt
function luuTatCaDoiHinh(){
  if(!isAdmin()) return;
  var promises = [];
  STATE.data.doi.forEach(function(t){
    var cfg = getDoiHinh_(t.maDoi);
    promises.push(srv('luuDoiHinh', [STATE.token, t.maDoi, cfg.soDo, cfg.slots]));
  });
  Promise.all(promises).then(function(){
    toast('Đã lưu tất cả đội hình','ok');
  });
}
/* ================= SỬA INLINE TRÊN THẺ ================= */
function statRow_(key, val, maCT){
  var cls = isAdmin() ? ' editable' : '';
  var onclick = isAdmin()
    ? ' onclick="event.stopPropagation();suaChiSo(\''+maCT+'\',\''+key+'\',this)"'
    : '';
  // ⭐ Thêm class "long" nếu giá trị >= 100
  var longCls = (Number(val) >= 100) ? ' long' : '';
  return '<div class="row"><span class="v'+cls+longCls+'"'+onclick+'>'+val+'</span>'
    +'<span class="lbl">'+key+'</span></div>';
}

function suaRating(maCT, el){
  if(!isAdmin()) return;
  if(el.querySelector('input')) return;
  var c = cauThuObj(maCT);
  if(!c) return;
  var cur = Number(c.rating)||80;
  el.innerHTML = '<input type="number" class="edit-input rating-edit" min="1" max="99" '
    +'value="'+cur+'" '
    +'onclick="event.stopPropagation()" '
    +'onkeydown="if(event.key===\'Enter\'){event.target.blur()};if(event.key===\'Escape\'){event.target.dataset.huy=1;event.target.blur()}" '
    +'onblur="luuRating(\''+maCT+'\',this)">';
  var inp = el.querySelector('input');
  inp.focus(); inp.select();
}

function luuRating(maCT, inp){
  var el = inp.parentNode;
  if(inp.dataset.huy){
    el.textContent = (cauThuObj(maCT)||{}).rating || 80;
    return;
  }
  var val = Number(inp.value);
  if(!isFinite(val) || val < 1 || val > 99){
    toast('Rating phải từ 1–99','err');
    el.textContent = (cauThuObj(maCT)||{}).rating || 80;
    return;
  }
  val = Math.round(val);
  srv('capNhatThe', [STATE.token, maCT, {Rating: val}]).then(function(r){
    toast(r&&r.ok ? 'Đã lưu rating '+val : (r&&r.msg||'Lỗi'), r&&r.ok?'ok':'err');
    if(r&&r.ok) tai();
    else el.textContent = (cauThuObj(maCT)||{}).rating || 80;
  });
}

function suaChiSo(maCT, key, el){
  if(!isAdmin()) return;
  if(el.querySelector('input')) return;
  var c = cauThuObj(maCT);
  if(!c) return;
  var cur = Number(c.chiSo && c.chiSo[key]) || 75;
  var old = el.textContent;
  el.innerHTML = '<input type="number" class="edit-input sm" min="1" max="99" '
    +'value="'+cur+'" style="width:34px" '
    +'onclick="event.stopPropagation()" '
    +'onkeydown="if(event.key===\'Enter\'){event.target.blur()};if(event.key===\'Escape\'){event.target.dataset.huy=1;event.target.blur()}" '
    +'onblur="luuChiSo(\''+maCT+'\',\''+key+'\',this,\''+old+'\')">';
  var inp = el.querySelector('input');
  inp.focus(); inp.select();
}

function luuChiSo(maCT, key, inp, old){
  var el = inp.parentNode;
  if(inp.dataset.huy){ el.textContent = old; return; }
  var val = Number(inp.value);
  if(!isFinite(val) || val < 1 || val > 99){
    toast(key+' phải từ 1–99','err');
    el.textContent = old;
    return;
  }
  val = Math.round(val);
  var f = {};
  f[key] = val;
  srv('capNhatThe', [STATE.token, maCT, f]).then(function(r){
    if(r&&r.ok){ el.textContent = val; toast('Đã lưu '+key+' = '+val,'ok'); }
    else { el.textContent = old; toast((r&&r.msg)||'Lỗi','err'); }
  });
}

function suaViTriChinh(maCT, el){
  if(!isAdmin()) return;
  if(el.querySelector('select')) return;
  var c = cauThuObj(maCT);
  if(!c) return;
  var vl = String(c.viTriList||'').toUpperCase().split(',').filter(function(v){return v;});
  var uuTien = ['TM','TD','TV','HVTT','HVCT'];
  var cur = '';
  for(var i=0;i<uuTien.length;i++){ if(vl.indexOf(uuTien[i])>=0){ cur = uuTien[i]; break; } }
  if(!cur && vl.length) cur = vl[0];

  var opts = uuTien.map(function(v){
    return '<option value="'+v+'"'+(v===cur?' selected':'')+'>'+posShortThe_(v)+'</option>';
  }).join('');
  el.innerHTML = '<select class="edit-input pos-edit" '
    +'onclick="event.stopPropagation()" '
    +'onchange="luuViTriChinh(\''+maCT+'\',this)" '
    +'onblur="setTimeout(function(){if(this&&this.parentNode&&this.parentNode.querySelector(\'select\'))this.parentNode.querySelector(\'select\').blur()}.bind(this),200)">'
    +opts+'</select>';
  var sel = el.querySelector('select');
  sel.focus();
}

function luuViTriChinh(maCT, sel){
  var el = sel.parentNode;
  var v = sel.value;
  var c = cauThuObj(maCT);
  if(!c) return;
  var vl = String(c.viTriList||'').toUpperCase().split(',').filter(function(x){return x;});
  // Đưa vị trí mới lên đầu
  var i = vl.indexOf(v);
  if(i>=0) vl.splice(i,1);
  vl.unshift(v);
  var newVl = vl.join(',');
  srv('capNhatCauThu', [STATE.token, maCT, {viTriList: newVl}]).then(function(r){
    if(r&&r.ok){
      el.textContent = posShortThe_(v);
      toast('Đã đổi vị trí chính → '+posShortThe_(v),'ok');
      tai();
    } else {
      el.textContent = posShortThe_(cur);
      toast((r&&r.msg)||'Lỗi','err');
    }
  });
}

/* ============================================================
   TAB: GÁN MÀU ÁO (BTC âm thầm gán)
   ============================================================ */


function viewGanMauAo(){
  if(!isAdmin()){ $('view').innerHTML='<div class="card"><div class="empty">Cần đăng nhập BTC.</div></div>'; return; }

  // Nạp cấu hình 4 mẫu áo trước
  srv('napMauAoConfig').then(function(cfg){
    var mauList = (cfg && cfg.ok && cfg.items) ? cfg.items : [];
    if(mauList.length === 0){
      $('view').innerHTML = '<div class="card"><div class="empty">'
        +'Chưa cấu hình mẫu áo.<br>'
        +'<button class="btn neon" style="margin-top:12px" onclick="setTab(\'caumau\')">'
        +'👕 Vào Cấu hình áo trước'
        +'</button></div></div>';
      return;
    }
    window._MAU_AO_LIST = mauList;
    renderGanMauAo(mauList);
  });
}

function renderGanMauAo(mauList){
  srv('dsMauDaGan', [STATE.token]).then(function(r){
    if(!r || !r.ok){ $('view').innerHTML='<div class="card"><div class="empty">Lỗi: '+(r&&r.msg||'')+'</div></div>'; return; }

    var h = '<div class="card">'
      +'<h2>🎨 Gán màu áo cho từng đội</h2>'
      +'<p class="muted" style="margin-bottom:14px">'
      +'<b>Bước 1 (âm thầm):</b> Chọn màu cho từng đội. '
      +'Màu sẽ <b>KHÔNG hiển thị công khai</b> — chỉ BTC thấy. '
      +'Sau đó vào tab <b>🎨 Live bốc màu</b> để tổ chức bốc cho từng đội trưởng.'
      +'</p>';

    var chuaGan = r.items.filter(function(x){ return !x.mauAo; }).length;
    var daGan = r.items.length - chuaGan;
    h += '<div class="hero" style="margin-bottom:14px">'
      +'<div class="stat"><div class="n">'+r.items.length+'</div><div class="l">Tổng đội</div></div>'
      +'<div class="stat"><div class="n" style="color:var(--neon)">'+daGan+'</div><div class="l">Đã gán màu</div></div>'
      +'<div class="stat"><div class="n" style="color:var(--cam2)">'+chuaGan+'</div><div class="l">Chưa gán</div></div>'
      +'</div>';

    h += '<div class="rowbtn" style="margin-bottom:14px">'
      +'<button class="btn outline sm" onclick="resetCongBoMauUI()">🔄 Reset công bố màu</button>'
      +'<button class="btn neon sm" onclick="setTab(\'livemau\')">🎬 Sang Live bốc màu</button>'
      +'</div>';

    h += '<div id="ganMauList">';
    r.items.forEach(function(t){
      var mauObj = mauList.filter(function(c){
        return c.ten.toUpperCase() === String(t.mauAo).toUpperCase();
      })[0];
      var imgUrl = mauObj && mauObj.url ? driveImg(mauObj.url) : '';

      h += '<div class="doi-mau '+(t.mauAo?'':'pending')+'" data-ma-doi="'+esc(t.maDoi)+'">'
        +'<div class="logo-box">'
          +(t.logoUrl
            ? '<img src="'+esc(driveImg(t.logoUrl))+'" onerror="this.outerHTML=\''+esc((t.tenDoi||'?').slice(0,2).toUpperCase())+'\'">'
            : esc((t.tenDoi||'?').slice(0,2).toUpperCase()))
        +'</div>'
        +'<div style="flex:1;min-width:0">'
          +'<div class="ten-doi">'+esc(t.tenDoi)+'</div>'
          +(t.daCongBo
            ? '<div class="muted" style="font-size:11.5px;color:var(--vang)">✅ Đã công bố live</div>'
            : (t.mauAo
                ? '<div class="muted" style="font-size:11.5px">🔒 Đã gán, chờ bốc</div>'
                : '<div class="muted" style="font-size:11.5px;color:var(--cam2)">Chưa gán màu</div>'))
        +'</div>'
        +'<div class="mau-result" onclick="modalChonMau(\''+esc(t.maDoi)+'\',\''+esc(t.tenDoi)+'\')" '
          +'style="cursor:pointer;padding:8px 14px;background:rgba(0,0,0,.3);border-radius:10px;display:flex;align-items:center;gap:10px">'
          +(imgUrl
            ? '<img src="'+esc(imgUrl)+'" style="width:36px;height:36px;object-fit:contain;flex:0 0 auto" onerror="this.style.display=\'none\'">'
              +'<span style="font-weight:700">'+esc(t.mauAo)+'</span>'
            : '<span class="muted">— Chọn màu —</span>')
          +'<span style="font-size:11px;color:var(--neon);margin-left:6px">✎</span>'
        +'</div>'
        +'</div>';
    });
    h += '</div>';

    h += '</div>';
    $('view').innerHTML = h;
  });
}

function modalChonMau(maDoi, tenDoi){
  var mauList = window._MAU_AO_LIST || [];
  if(!mauList.length){
    toast('Chưa cấu hình mẫu áo', 'err');
    return;
  }

  var h = '<h2 style="margin:0 0 12px;font-size:20px;font-family:var(--ff-title);letter-spacing:1px;color:var(--neon)">'
    +'👕 CHỌN MẪU ÁO</h2>'
    +'<p class="muted" style="margin-bottom:12px;font-size:13px">'
    +'Đội: <b style="color:var(--chu2)">'+esc(tenDoi)+'</b></p>'
    +'<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px">';

  mauList.forEach(function(c){
    var imgUrl = c.url ? driveImg(c.url) : '';
    h += '<div class="mau-chon-item" data-mau="'+esc(c.ten)+'" '
      +'onclick="luuMauDoi(\''+esc(maDoi)+'\',\''+esc(c.ten)+'\',this)" '
      +'style="background:rgba(10,14,30,.5);border:1.5px solid var(--vien2);border-radius:12px;padding:12px;cursor:pointer;text-align:center;transition:.15s">'
      +(imgUrl
        ? '<img src="'+esc(imgUrl)+'" style="width:100%;height:130px;object-fit:contain;display:block;margin-bottom:8px" onerror="this.style.display=\'none\'">'
        : '<div style="height:130px;display:flex;align-items:center;justify-content:center;color:#6478a0;font-size:12px">Chưa có ảnh</div>')
      +'<div style="font-family:var(--ff-title);font-size:15px;font-weight:700;color:var(--chu2);letter-spacing:.5px;text-transform:uppercase">'
        +esc(c.ten)
      +'</div>'
      +'</div>';
  });
  h += '</div>'
    +'<button class="btn danger block" style="margin-top:12px" onclick="xoaMauDoi(\''+esc(maDoi)+'\')">'
      +'🗑 Xóa áo'
    +'</button>'
    +'<button class="btn outline block" style="margin-top:8px" onclick="closeModal(\'mGeneric\')">Đóng</button>';

  $('mGenericBox').innerHTML = h;
  openModal('mGeneric');
}

function luuMauDoi(maDoi, tenMau, el){
  el.parentNode.querySelectorAll('.mau-chon-item').forEach(function(x){ x.classList.remove('on'); });
  el.classList.add('on');

  srv('ganMauChoDoi', [STATE.token, maDoi, tenMau]).then(function(r){
    if(r && r.ok){
      toast(r.msg, 'ok');
      closeModal('mGeneric');
      viewGanMauAo();
    } else {
      toast((r&&r.msg)||'Lỗi', 'err');
    }
  });
}

function xoaMauDoi(maDoi){
  if(!confirm('Xóa màu áo của đội này?')) return;
  srv('ganMauChoDoi', [STATE.token, maDoi, '']).then(function(r){
    if(r && r.ok){
      toast('Đã xóa màu', 'ok');
      closeModal('mGeneric');
      viewGanMauAo();
    }
  });
}

function resetCongBoMauUI(){
  if(!confirm('Reset công bố màu? Các đội sẽ về trạng thái "chưa bốc" để live lại.')) return;
  srv('resetCongBoMau', [STATE.token]).then(function(r){
    toast((r&&r.msg)||'Xong', r&&r.ok?'ok':'err');
    if(r && r.ok) viewGanMauAo();
  });
}

/* ============================================================
   TAB: LIVE BỐC MÀU ÁO
   ============================================================ */
var LIVE_MAU = {
  token: localStorage.getItem('bd_live_mau_token') || '',
  dangQuay: false,
  ketQua: null,
  buoc: 'login'
};

function viewLiveMau(){
  if(!isAdmin()){
    $('view').innerHTML='<div class="card"><div class="empty">🔒 Chỉ BTC mới vào được.</div></div>';
    return;
  }

  // Nạp cấu hình màu áo trước
  srv('napMauAoConfig').then(function(cfg){
    if(cfg && cfg.ok){
      window._MAU_AO_LIST = cfg.items || [];
    } else {
      window._MAU_AO_LIST = [];
    }
    if(!LIVE_MAU.token){
      return viewLiveMauDangNhap();
    }
    viewLiveMauMain();
  });
}

function viewLiveMauDangNhap(){
  var h = '<div class="live-lock">'
    +'<div style="font-size:52px;margin-bottom:8px">🎨</div>'
    +'<h2>LIVE BỐC MÀU ÁO</h2>'
    +'<p class="muted" style="margin-bottom:20px">Nhập mật khẩu để mở live</p>'
    +'<input type="password" id="liveMauMK" placeholder="••••••••" '
    +'onkeydown="if(event.key===\'Enter\')liveMauLogin()">'
    +'<button class="btn neon block" style="margin-top:16px;padding:14px" '
    +'onclick="liveMauLogin()" id="btnLiveMauLogin">🔓 Mở Live màu</button>'
    +'<button class="btn outline block" style="margin-top:10px" onclick="setTab(\'mauao\')">'
    +'← Về gán màu</button>'
    +'</div>';
  $('view').innerHTML = h;
  setTimeout(function(){var e=$('liveMauMK');if(e)e.focus();},150);
}

function liveMauLogin(){
  var mk = $('liveMauMK').value;
  if(!mk){ toast('Nhập mật khẩu','err'); return; }
  $('btnLiveMauLogin').innerHTML = '<span class="spin"></span>';
  srv('liveMauDangNhap', [mk]).then(function(r){
    $('btnLiveMauLogin').textContent = '🔓 Mở Live màu';
    if(r && r.ok){
      LIVE_MAU.token = r.token;
      localStorage.setItem('bd_live_mau_token', r.token);
      toast('Đã mở Live màu','ok');
      viewLiveMauMain();
    } else toast((r&&r.msg)||'Sai mật khẩu','err');
  }).catch(function(e){
    $('btnLiveMauLogin').textContent = '🔓 Mở Live màu';
    toast('Lỗi: '+e.message,'err');
  });
}

function liveMauLogout(){
  if(!confirm('Đóng Live màu?')) return;
  LIVE_MAU.token = '';
  localStorage.removeItem('bd_live_mau_token');
  LIVE_MAU.ketQua = null;
  viewLiveMauDangNhap();
}

function viewLiveMauMain(){
  srv('liveMauTrangThai').then(function(tt){
    if(!tt || !tt.ok){
      $('view').innerHTML='<div class="card"><div class="empty">Lỗi: '+(tt&&tt.msg||'')+'</div></div>';
      return;
    }
    renderLiveMau(tt);
  });
}

function renderLiveMau(tt){
  var h = '<div style="max-width:720px;margin:0 auto">'
    +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">'
    +'<div style="font-family:var(--ff-title);font-size:22px;color:var(--neon);letter-spacing:1px">🎨 LIVE BỐC MÀU ÁO</div>'
    +'<button class="btn outline sm" onclick="liveMauLogout()">Đóng</button>'
    +'</div>';

  h += '<div class="live-status">'
    +'<div class="item"><div class="n">'+tt.tong+'</div><div class="l">Tổng đội</div></div>'
    +'<div class="item"><div class="n" style="color:var(--neon)">'+tt.daBoc+'</div><div class="l">Đã bốc</div></div>'
    +'<div class="item"><div class="n" style="color:var(--cam2)">'+tt.chuaBoc+'</div><div class="l">Chờ bốc</div></div>'
    +'</div>';

  if(tt.chuaCoMau > 0){
    h += '<div style="padding:12px;background:rgba(236,47,139,.1);border:1px solid var(--cam2);border-radius:10px;color:var(--cam2);font-size:13.5px;margin-bottom:14px">'
      +'⚠️ Còn <b>'+tt.chuaCoMau+'</b> đội chưa được BTC gán màu. '
      +'Vào tab <b>🎨 Gán màu áo</b> gán trước khi live.'
      +'</div>';
  }

  if(tt.khoa || (tt.tong > 0 && tt.daBoc >= tt.tong)){
    h += '<div class="live-input-card" style="text-align:center">'
      +'<div style="font-size:52px;margin-bottom:8px">🔒</div>'
      +'<div style="font-family:var(--ff-title);font-size:22px;color:var(--vang);margin-bottom:8px">ĐÃ BỐC XONG</div>'
      +'<p class="muted">Tất cả '+tt.tong+' đội đã bốc màu.</p>'
      +'<div style="margin-top:16px">'
      +'<button class="btn neon" onclick="resetCongBoMauUI()">🔄 Bốc lại</button>'
      +'</div>'
      +'</div>';
    h += '</div>';
    $('view').innerHTML = h;
    return;
  }

  if(LIVE_MAU.ketQua){
    h += '<div id="liveMauArea"></div>';
    $('view').innerHTML = h + '</div>';
    hienKetQuaMau(LIVE_MAU.ketQua);
    return;
  }

  h += '<div class="live-input-card">'
    +'<label style="text-align:center;font-size:13px">Đội trưởng nhập mã NV để bốc màu</label>'
    +'<input type="text" id="liveMauMaNV" placeholder="NV001" autocomplete="off" '
    +'oninput="liveMauTraMaNV()" onkeydown="if(event.key===\'Enter\')liveMauBocClick()">'
    +'<div id="liveMauInfo"></div>'
    +'<button class="btn cam block" id="btnLiveMauBoc" style="margin-top:16px;padding:16px;font-size:17px" '
    +'onclick="liveMauBocClick()" disabled>🎲 BỐC MÀU</button>'
    +'</div>';

  h += '<div class="card" style="margin-top:14px"><h2>📜 Đã bốc màu</h2>'
    +'<div id="liveMauHistory" class="live-history"></div></div>';

  h += '</div>';
  $('view').innerHTML = h;

  // Load history
  loadLiveMauHistory();
  setTimeout(function(){var e=$('liveMauMaNV');if(e)e.focus();},100);
}

var _liveMauTimer = null;
function liveMauTraMaNV(){
  var inp = $('liveMauMaNV'); if(!inp) return;
  var info = $('liveMauInfo');
  var btn = $('btnLiveMauBoc');
  var ma = inp.value.trim().toUpperCase();
  if(btn) btn.disabled = true;
  if(!ma){ if(info) info.innerHTML=''; clearTimeout(_liveMauTimer); return; }
  if(info) info.innerHTML = '<div class="muted" style="padding:8px">Đang tìm…</div>';
  clearTimeout(_liveMauTimer);
  _liveMauTimer = setTimeout(function(){
    srv('liveMauTraMaNV', [LIVE_MAU.token, ma]).then(function(r){
      if(!r || !r.ok){
        if(info) info.innerHTML = '<div class="live-info err">'+(r&&r.msg||'Lỗi')+'</div>';
        return;
      }
      if(r.daCongBo){
        info.innerHTML = '<div class="live-info err">'
          +'<div class="ten">'+esc(r.hoTen)+'</div>'
          +'<div style="color:var(--do);font-weight:700;margin-top:4px">⚠️ ĐỘI NÀY ĐÃ BỐC RỒI</div>'
          +'<div style="margin-top:6px">Đội: <b>'+esc(r.tenDoi)+'</b></div>'
          +'</div>';
        return;
      }
      if(!r.coMau){
        info.innerHTML = '<div class="live-info err">'
          +'<div class="ten">'+esc(r.hoTen)+'</div>'
          +'<div style="color:var(--do);font-weight:700;margin-top:4px">⚠️ CHƯA CÓ MÀU</div>'
          +'<div style="margin-top:6px">Đội <b>'+esc(r.tenDoi)+'</b> chưa được BTC gán màu.</div>'
          +'</div>';
        return;
      }
      info.innerHTML = '<div class="live-info ok">'
        +'<div class="ten">'+esc(r.hoTen)+'</div>'
        +'<div class="muted" style="font-size:12.5px;margin-top:4px">Đội: <b>'+esc(r.tenDoi)+'</b></div>'
        +'<div style="color:var(--neon);font-weight:700;margin-top:6px">✅ Sẵn sàng bốc màu</div>'
        +'</div>';
      if(btn){ btn.disabled = false; btn.dataset.maNV = ma; }
    });
  }, 300);
}

function liveMauBocClick(){
  var btn = $('btnLiveMauBoc');
  var ma = (btn && btn.dataset.maNV) || ($('liveMauMaNV') ? $('liveMauMaNV').value.trim().toUpperCase() : '');
  if(!ma){ toast('Nhập mã NV','err'); return; }
  if(LIVE_MAU.dangQuay) return;
  LIVE_MAU.dangQuay = true;
  if(btn){ btn.disabled = true; btn.innerHTML = '<span class="spin"></span> Đang bốc…'; }

  srv('liveMauBoc', [LIVE_MAU.token, ma]).then(function(r){
    LIVE_MAU.dangQuay = false;
    if(!r || !r.ok){
      toast((r&&r.msg)||'Lỗi', 'err');
      if(btn){ btn.disabled = false; btn.textContent = '🎲 BỐC MÀU'; }
      return;
    }
    batDauQuayMau(r);
  }).catch(function(e){
    LIVE_MAU.dangQuay = false;
    toast('Lỗi: '+e.message, 'err');
    if(btn){ btn.disabled = false; btn.textContent = '🎲 BỐC MÀU'; }
  });
}

function batDauQuayMau(kq){
  var mauList = window._MAU_AO_LIST || [];
  if(!mauList.length){
    toast('Chưa cấu hình mẫu áo', 'err');
    return;
  }

  // Lọc những mẫu áo có ảnh
  var coAnh = mauList.filter(function(m){ return m.url; });
  if(coAnh.length < 2){
    toast('Cần ít nhất 2 mẫu áo có ảnh. Vào Cấu hình áo.', 'err');
    return;
  }

  var mauTrung = mauList.filter(function(c){ return c.ten === kq.mauAo; })[0];
  if(!mauTrung || !mauTrung.url){
    toast('Mẫu áo "'+kq.mauAo+'" chưa có ảnh. Vào Cấu hình áo.', 'err');
    return;
  }

  var O_W = 240 + 32;
  var SO_O_RANDOM = 40;

  var track = [];
  for(var k=0; k<SO_O_RANDOM; k++){
    track.push(coAnh[Math.floor(Math.random() * coAnh.length)]);
  }
  var indexTrung = track.length;
  track.push(mauTrung);
  for(var k2=0; k2<3; k2++){
    track.push(coAnh[Math.floor(Math.random() * coAnh.length)]);
  }

  var trackHtml = track.map(function(m){
    return '<div style="flex:0 0 '+O_W+'px;height:340px;margin:0 16px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;border-radius:22px;background:linear-gradient(135deg,rgba(22,31,66,.95),rgba(14,21,48,.75));border:2px solid var(--vien2);padding:14px;box-shadow:0 6px 28px rgba(0,0,0,.5)">'
      +'<div style="flex:1;width:100%;display:flex;align-items:center;justify-content:center;min-height:0">'
        +'<img src="'+esc(driveImg(m.url))+'" style="max-width:100%;max-height:100%;object-fit:contain;filter:drop-shadow(0 8px 14px rgba(0,0,0,.6))">'
      +'</div>'
      +'<div style="font-family:var(--ff-title);font-size:18px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:var(--chu2);text-shadow:0 2px 6px rgba(0,0,0,.9);text-align:center">'+esc(m.ten)+'</div>'
      +'</div>';
  }).join('');

  var h = '<div class="live-input-card" style="max-width:820px">'
    +'<div style="text-align:center;margin-bottom:18px">'
    +'<div style="font-family:var(--ff-title);font-size:26px;letter-spacing:1.5px;color:var(--neon)">🎨 ĐANG BỐC MÀU…</div>'
    +'<div style="font-size:16px;margin-top:8px">'
    +'<b style="color:var(--chu2);font-size:20px">'+esc(kq.hoTen)+'</b>'
    +'<div class="muted" style="font-size:13px;margin-top:4px">Đội '+esc(kq.tenDoi)+'</div>'
    +'</div>'
    +'</div>'
    +'<div class="roulette-wrap" style="height:380px">'
    +'<div class="roulette-track" id="rtMau">'+trackHtml+'</div>'
    +'<div class="roulette-pointer"></div>'
    +'</div>'
    +'<div style="text-align:center;margin-top:12px;font-size:15px;color:var(--mo)">Đang chọn màu…</div>'
    +'</div>';

  $('view').innerHTML = h;

  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      var trackEl = $('rtMau');
      if(!trackEl) return;
      var wrapW = trackEl.parentNode.offsetWidth;
      
      // ⭐ Tính offset chính xác
      // Mỗi ô rộng 240px + margin 16px trái + 16px phải = 272px
      // Tâm ô thứ i nằm ở: i * 272 + 16 (margin trái) + 120 (nửa ô) = i*272 + 136
      // Muốn tâm ô trùng với giữa wrap: translateX = wrapW/2 - (indexTrung*272 + 136)
      
      var O_W_FULL = 272;  // 240 + 16 + 16
      var targetX = wrapW/2 - (indexTrung * O_W_FULL + 136);
      
      trackEl.style.transition = 'none';
      trackEl.style.transform = 'translateX(0px)';
      
      requestAnimationFrame(function(){
        trackEl.style.transition = 'transform 7s cubic-bezier(.12,.85,.35,1)';
        trackEl.style.transform = 'translateX('+targetX+'px)';
      });
    });
  });

  setTimeout(function(){
    LIVE_MAU.ketQua = kq;
    hienKetQuaMau(kq);
  }, 7200);
}

function hienKetQuaMau(kq){
  var mauList = window._MAU_AO_LIST || [];
  var mauObj = mauList.filter(function(c){ return c.ten === kq.mauAo; })[0] || {ten: kq.mauAo, url: ''};
  var imgUrl = mauObj.url ? driveImg(mauObj.url) : '';

  var h = '<div class="live-input-card" style="max-width:560px;text-align:center;background:linear-gradient(135deg,rgba(34,211,238,.08),rgba(236,47,139,.05))">'
    +'<div class="live-result">'
    +'<div class="chuc-mung">🎉 ĐÃ BỐC ĐƯỢC MÀU 🎉</div>';

  if(kq.logoUrl){
    h += '<img src="'+esc(driveImg(kq.logoUrl))+'" class="logo-big" '
      +'onerror="this.outerHTML=\'<div class=&quot;logo-big-ph&quot;>'+esc((kq.tenDoi||'?').slice(0,2).toUpperCase())+'</div>\'">';
  } else {
    h += '<div class="logo-big-ph">'+esc((kq.tenDoi||'?').slice(0,2).toUpperCase())+'</div>';
  }

  h += '<div class="ten-nguoi">'+esc(kq.tenDoi)+'</div>'
    +'<div style="font-size:14px;color:var(--mo);margin-bottom:16px">Đội trưởng: '+esc(kq.hoTen)+'</div>';

  if(imgUrl){
    h += '<div style="width:220px;height:260px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;animation:pulseLogo 1.5s ease-in-out infinite alternate">'
      +'<img src="'+esc(imgUrl)+'" style="max-width:100%;max-height:100%;object-fit:contain;filter:drop-shadow(0 0 30px rgba(34,211,238,.7))">'
      +'</div>';
  }

  h += '<div style="font-family:var(--ff-title);font-size:36px;font-weight:900;color:#22d3ee;letter-spacing:3px;text-transform:uppercase;text-shadow:0 0 24px #22d3ee,0 3px 8px rgba(0,0,0,.9);margin-bottom:16px">'
    +esc(kq.mauAo)
    +'</div>';

  h += '<div class="loi-chuc">"Chúc mừng đội ' + esc(kq.tenDoi) + ' — màu áo chính thức!"</div>';
  h += '<button class="btn neon block" style="margin-top:16px;padding:16px;font-size:17px" onclick="tiepTucBocMau()">'
    +'🎲 ĐỘI TIẾP THEO</button>';
  h += '</div></div>';

  $('view').innerHTML = '<div style="max-width:720px;margin:0 auto">' + h + '</div>';
  banPhaoHoa(40);
}

function tiepTucBocMau(){
  LIVE_MAU.ketQua = null;
  viewLiveMauMain();
}

function loadLiveMauHistory(){
  srv('liveMauLichSu').then(function(r){
    var box = $('liveMauHistory');
    if(!box) return;
    if(!r || !r.ok || !r.items || !r.items.length){
      box.innerHTML = '<div class="muted" style="padding:12px;text-align:center">Chưa có đội nào bốc.</div>';
      return;
    }
    var h = '';
    r.items.forEach(function(it){
      var mauObj = MAU_MAC_DINH.filter(function(c){ return c.ten === it.mauAo; })[0] || {hex: '#666'};
      h += '<div class="live-history-item">'
        +'<div style="width:28px;height:28px;border-radius:50%;background:'+mauObj.hex+';border:2px solid rgba(255,255,255,.9);flex:0 0 auto;box-shadow:0 0 8px '+mauObj.hex+'"></div>'
        +'<span class="h-ct">'+esc(it.tenDoi)+'</span>'
        +'<span class="h-doi" style="color:'+mauObj.hex+';text-shadow:0 0 8px '+mauObj.hex+'">'+esc(it.mauAo)+'</span>'
        +'</div>';
    });
    box.innerHTML = h;
  });
}
/* ============================================================
   VIEW: CẤU HÌNH 4 MẪU ÁO
   ============================================================ */
function viewCauHinhMauAo(){
  if(!isAdmin()){
    $('view').innerHTML = '<div class="card"><div class="empty">Cần đăng nhập BTC.</div></div>';
    return;
  }

  // ⭐ Ưu tiên dùng _CAU_MAU_TEMP nếu có (đang sửa dở)
  var ds;
  if(window._CAU_MAU_TEMP && window._CAU_MAU_TEMP.length){
    ds = window._CAU_MAU_TEMP.slice();
  } else {
    ds = (STATE.data.mauAoConfig || []).slice();
  }
  
  // Đảm bảo có 4 slot
  var macDinh = [
    { ten: 'Be',        ma: 'BE',   url: '' },
    { ten: 'Xanh Real', ma: 'REAL', url: '' },
    { ten: 'Xám',       ma: 'XAM',  url: '' },
    { ten: 'Đỏ',        ma: 'DO',   url: '' }
  ];
  for(var i = ds.length; i < 4; i++){
    ds.push(macDinh[i] || { ten: 'Màu '+(i+1), ma: '', url: '' });
  }
  
  // Cập nhật temp
  window._CAU_MAU_TEMP = ds.slice();

  var h = '<div class="card">'
    +'<h2>👕 Cấu hình 4 mẫu áo</h2>'
    +'<p class="muted" style="margin-bottom:14px">'
    +'Upload 4 ảnh áo lên Drive → dán link chia sẻ vào đây. '
    +'Những ảnh này sẽ được dùng trong <b>Live bốc màu</b> và <b>Gán màu áo</b>.'
    +'</p>'
    +'<div class="hint" style="background:rgba(34,211,238,.08);border:1px solid rgba(34,211,238,.3);border-radius:12px;padding:14px 16px;font-size:13px;color:#c5d4e8;line-height:1.7;margin-bottom:16px">'
    +'📌 <b>Cách lấy link:</b> Upload ảnh lên Drive → chuột phải → <b>Chia sẻ → Bất kỳ ai có link</b> → Copy link → Dán vào ô dưới.'
    +'</div>';

  h += '<div class="ao-gan-grid" id="cauMauGrid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px">';
  ds.slice(0, 4).forEach(function(mau, i){
    var imgUrl = driveImg(mau.url);
    h += '<div class="ao-gan-item" style="background:rgba(10,14,30,.5);border:1.5px solid var(--vien2);border-radius:14px;padding:14px">'
      +'<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">'
        +'<div style="width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,var(--neon),var(--cam));color:#04122b;font-family:var(--ff-mono);font-weight:900;font-size:13px;display:flex;align-items:center;justify-content:center;flex:0 0 auto">'
          +(i+1)
        +'</div>'
        +'<input type="text" value="'+esc(mau.ten)+'" '
          +'onchange="capNhatTenMau('+i+', this.value)" '
          +'placeholder="Tên màu" '
          +'style="flex:1;background:rgba(0,0,0,.3);border:1px solid var(--vien2);border-radius:8px;padding:6px 10px;color:var(--chu2);font-family:inherit;font-size:14px;font-weight:600;outline:none">'
      +'</div>'
      +'<input type="text" value="'+esc(mau.url)+'" '
        +'onchange="capNhatUrlMau('+i+', this.value)" '
        +'oninput="previewCauMau('+i+', this.value)" '
        +'placeholder="https://drive.google.com/file/d/..." '
        +'style="width:100%;background:rgba(0,0,0,.4);border:1.5px solid var(--vien2);border-radius:9px;padding:10px 12px;color:var(--chu);font-size:13px;outline:none;font-family:inherit;margin-bottom:10px">'
      +'<div class="preview" id="cauMauPreview-'+i+'" '
        +'style="width:100%;aspect-ratio:1/1;border-radius:10px;background:repeating-linear-gradient(45deg,rgba(255,255,255,.03) 0 10px,rgba(255,255,255,.06) 10px 20px),rgba(10,14,30,.5);border:1.5px dashed var(--vien2);display:flex;align-items:center;justify-content:center;overflow:hidden">'
        +(imgUrl
          ? '<img src="'+esc(imgUrl)+'" alt="" style="width:100%;height:100%;object-fit:contain" '
            +'onerror="this.parentNode.innerHTML=\'<div style=&quot;color:#6478a0;font-size:12px;text-align:center;padding:20px;font-style:italic&quot;>❌ Không load được ảnh</div>\'">'
          : '<div style="color:#6478a0;font-size:12px;text-align:center;padding:20px;font-style:italic">Chưa có ảnh<br>Dán link Drive ở trên</div>')
      +'</div>'
      +'</div>';
  });
  h += '</div>';

  h += '<button class="btn neon block" style="margin-top:16px;padding:14px;font-size:15px" onclick="luuCauHinhMauAo()" id="btnLuuCauMau">'
    +'💾 Lưu cấu hình'
    +'</button>';

  h += '</div>';
  $('view').innerHTML = h;
}

// State tạm thời cho form cấu hình
window._CAU_MAU_TEMP = null;
function layCauMauTemp_(){
  // Nếu temp đã có → dùng luôn
  if(window._CAU_MAU_TEMP && window._CAU_MAU_TEMP.length === 4){
    return window._CAU_MAU_TEMP;
  }
  
  // Nếu chưa có → khởi tạo từ STATE
  var ds = (STATE.data.mauAoConfig || []).slice();
  var macDinh = [
    { ten: 'Be',        ma: 'BE',   url: '' },
    { ten: 'Xanh Real', ma: 'REAL', url: '' },
    { ten: 'Xám',       ma: 'XAM',  url: '' },
    { ten: 'Đỏ',        ma: 'DO',   url: '' }
  ];
  for(var i = ds.length; i < 4; i++){
    ds.push(macDinh[i] || { ten: 'Màu '+(i+1), ma: '', url: '' });
  }
  ds = ds.slice(0, 4);
  window._CAU_MAU_TEMP = ds;
  return ds;
}

function capNhatTenMau(i, val){
  var ds = layCauMauTemp_();
  ds[i].ten = String(val||'').trim();
}
function capNhatUrlMau(i, val){
  var ds = layCauMauTemp_();
  ds[i].url = String(val||'').trim();
}
function previewCauMau(i, val){
  var wrap = document.getElementById('cauMauPreview-'+i);
  if(!wrap) return;
  var url = driveImg(val);
  if(!url){
    wrap.innerHTML = '<div style="color:#6478a0;font-size:12px;text-align:center;padding:20px;font-style:italic">Chưa có ảnh<br>Dán link Drive ở trên</div>';
    return;
  }
  wrap.innerHTML = '<img src="'+esc(url)+'" alt="" style="width:100%;height:100%;object-fit:contain" '
    +'onerror="this.parentNode.innerHTML=\'<div style=&quot;color:#6478a0;font-size:12px;text-align:center;padding:20px;font-style:italic&quot;>❌ Không load được ảnh<br>Kiểm tra lại link</div>\'">';
}

function luuCauHinhMauAo(){
  var ds = layCauMauTemp_();
  var btn = $('btnLuuCauMau');
  if(btn){ btn.disabled = true; btn.innerHTML = '<span class="spin"></span> Đang lưu…'; }

  srv('luuMauAoConfig', [STATE.token, ds]).then(function(r){
    if(btn){ btn.disabled = false; btn.textContent = '💾 Lưu cấu hình'; }
    if(r && r.ok){
      toast(r.msg, 'ok');
      // ⭐ QUAN TRỌNG: Cập nhật state ngay, không reset temp
      STATE.data.mauAoConfig = ds.slice();
      // Không reset _CAU_MAU_TEMP để giữ dữ liệu vừa nhập
      // Reload lại view (nhưng giữ nguyên biến temp)
      viewCauHinhMauAo();
    } else {
      toast((r&&r.msg)||'Lỗi', 'err');
    }
  }).catch(function(e){
    if(btn){ btn.disabled = false; btn.textContent = '💾 Lưu cấu hình'; }
    toast('Lỗi: '+e.message, 'err');
  });
}
/* ============================================================
   VIEW: MEDIA — ảnh & video giải đấu
   ============================================================ */
function viewMedia(){
  var d = STATE.data;
  var list = (d.media || []).slice();
  var h = '';

  h += '<div class="card">';
  h += '<h2>📸 Hình ảnh & Video ('+list.length+')</h2>';

  if(isAdmin()){
    h += '<div style="margin-bottom:18px;padding:16px;background:rgba(34,211,238,.06);border:1px solid var(--vien2);border-radius:12px">'
      +  '<div style="font-family:var(--ff-title);font-size:14px;letter-spacing:1px;color:var(--neon);text-transform:uppercase;margin-bottom:10px">➕ Thêm media (BTC)</div>'
      +  '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;margin-bottom:10px">'
      +    '<select id="mdLoai" style="padding:10px 12px">'
      +      '<option value="ANH">🖼️ Ảnh</option>'
      +      '<option value="VIDEO">🎬 Video (YouTube / Drive)</option>'
      +    '</select>'
      +    '<input id="mdTieuDe" placeholder="Tiêu đề (tuỳ chọn)">'
      +  '</div>'
      +  '<input id="mdUrl" placeholder="Link ảnh Drive / Link YouTube / Link Drive video" style="margin-bottom:10px">'
      +  '<input id="mdMoTa" placeholder="Mô tả ngắn (tuỳ chọn)" style="margin-bottom:10px">'
      +  '<select id="mdTran" style="margin-bottom:10px;width:100%;padding:10px 12px"><option value="">🎬 Gắn với trận đấu (tuỳ chọn) — không gắn</option>'
      +    (d.tranDau||[]).filter(function(t){return t.maDoiB;}).map(function(t){ return '<option value="'+esc(t.maTran)+'">'+esc(nhanTran_(t))+'</option>'; }).join('')
      +  '</select>'
      +  '<button class="btn neon block" onclick="themMediaUI()">➕ Thêm vào thư viện</button>'
      +  '<p class="muted" style="font-size:11.5px;margin-top:8px;line-height:1.7">'
      +    '💡 <b>Ảnh</b>: upload Drive → chia sẻ "Bất kỳ ai có link" → dán link.<br>'
      +    '💡 <b>Video YouTube</b>: dán link <code>youtube.com/watch?v=...</code> hoặc <code>youtu.be/...</code><br>'
      +    '💡 <b>Video Drive</b>: upload file → chia sẻ → dán link.<br>'
      +    '💡 <b>Gắn với trận</b>: trận đó trong Lịch thi đấu sẽ có nút <b>▶ Xem video giới thiệu trận</b>.'
      +  '</p>'
      +  '</div>';
  }

  if(!list.length){
    h += '<div class="empty">Chưa có ảnh/video nào.'
      + (isAdmin() ? ' Thêm bằng form phía trên.' : '')
      + '</div>';
  } else {
    h += '<div class="media-grid">';
    list.forEach(function(m){
      var isVideo = (m.loai === 'VIDEO');
      var thumbUrl = isVideo ? youtubeThumb_(m.url) : driveImg(m.url);
      var ctrl = '';
      if(isAdmin()){
        ctrl = '<div class="admin-ctrl">'
          + '<button onclick="event.stopPropagation();doiThuTuMediaUI(\''+m.maMedia+'\',-1)" title="Lên">▲</button>'
          + '<button onclick="event.stopPropagation();doiThuTuMediaUI(\''+m.maMedia+'\',1)" title="Xuống">▼</button>'
          + (isVideo ? '<button onclick="event.stopPropagation();ganVideoTranUI(\''+m.maMedia+'\')" title="Gắn với trận">🔗</button>' : '')
          + '<button class="rm" onclick="event.stopPropagation();xoaMediaUI(\''+m.maMedia+'\')" title="Xóa">🗑</button>'
          + '</div>';
      }
      var mediaHtml = thumbUrl
        ? '<img src="'+esc(thumbUrl)+'" alt="" onerror="this.style.display=\'none\'">'
        : (isVideo ? '<div style="position:absolute;inset:0;background:linear-gradient(135deg,#0c1a3d,#08122e);display:flex;align-items:center;justify-content:center;font-size:40px;color:rgba(34,211,238,.4)">🎬</div>' : '');

      h += '<div class="media-item'+(isVideo?' video':'')+'" onclick="moLightboxMedia(\''+m.maMedia+'\')">'
        + mediaHtml
        + ctrl
        + '<div class="badge-media">'+(isVideo?'🎬 VIDEO':'🖼️ ẢNH')+'</div>'
        + '<div class="info">'
        +   '<div class="ttl">'+esc(m.tieuDe || (isVideo?'Video':'Ảnh'))+'</div>'
        +   (m.moTa ? '<div class="sub">'+esc(m.moTa)+'</div>' : '')
        +   (m.maTran && tranObj_(m.maTran) ? '<div class="sub" style="color:var(--neon)">⚽ '+esc(nhanTran_(tranObj_(m.maTran)))+'</div>' : '')
        + '</div>'
        + '</div>';
    });
    h += '</div>';
  }
  h += '</div>';
  $('view').innerHTML = h;
}

function moLightboxMedia(maMedia){
  var list = STATE.data.media || [];
  var m = list.filter(function(x){ return x.maMedia === maMedia; })[0];
  if(!m) return;

  var inner = '', moNgoai = '';
  if(m.loai === 'VIDEO'){
    // Điện thoại (nhất là iPhone, trình duyệt trong Zalo/Facebook) hay chặn khung phát Drive → luôn có nút mở video ở tab mới
    var ytm = String(m.url||'').match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    var dId = driveId_(m.url);
    var linkMo = ytm ? ('https://www.youtube.com/watch?v='+ytm[1]) : (dId ? ('https://drive.google.com/file/d/'+dId+'/view') : m.url);
    moNgoai = '<a class="btn neon sm lb-mo-ngoai" href="'+esc(linkMo)+'" target="_blank" rel="noopener">▶ Không xem được? Mở video ở tab mới ↗</a>';
    moNgoai = '<div class="lb-goi-y">💡 Video mờ? Bấm <b>⚙</b> trên trình phát → <b>Chất lượng</b> → chọn <b>1080p</b>, hoặc bấm <b>⛶</b> xem toàn màn hình.</div>' + moNgoai;
    var embed = youtubeEmbed_(m.url);
    if(embed){
      inner = '<iframe src="'+esc(embed)+'" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>';
    } else {
      var did = driveId_(m.url);
      if(did){
        inner = '<iframe src="https://drive.google.com/file/d/'+esc(did)+'/preview" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>';
      } else {
        inner = '<div style="padding:30px;color:var(--mo)">Không nhận diện được link video.</div>';
      }
    }
  } else {
    inner = '<img src="'+esc(driveImg(m.url, 'w1600'))+'" alt="">';
  }

  var lb = document.getElementById('mediaLightbox');
  if(!lb){
    lb = document.createElement('div');
    lb.id = 'mediaLightbox';
    lb.className = 'media-lightbox';
    lb.onclick = function(e){ if(e.target === lb) closeMediaLightbox(); };
    document.body.appendChild(lb);
  }
  lb.innerHTML = '<button class="lb-close" onclick="closeMediaLightbox()">✕</button>'
    + '<div class="lb-content">'
    +   inner
    +   moNgoai
    +   (m.tieuDe ? '<div class="lb-title">'+esc(m.tieuDe)+'</div>' : '')
    +   (m.moTa ? '<div class="lb-desc">'+esc(m.moTa)+'</div>' : '')
    + '</div>';
  lb.classList.add('show');
  document.addEventListener('keydown', escListenerLB_);
}
function closeMediaLightbox(){
  var lb = document.getElementById('mediaLightbox');
  if(lb){ lb.classList.remove('show'); lb.innerHTML = ''; }   // xoá trình phát để video dừng hẳn khi đóng
  document.removeEventListener('keydown', escListenerLB_);
}
function escListenerLB_(e){
  if(e.key === 'Escape') closeMediaLightbox();
}

function driveId_(url){
  var m = String(url||'').match(/\/file\/d\/([A-Za-z0-9_-]+)/) ||
          String(url||'').match(/[?&]id=([A-Za-z0-9_-]+)/) ||
          String(url||'').match(/\/d\/([A-Za-z0-9_-]+)/);
  return m ? m[1] : '';
}
function youtubeEmbed_(url){
  var m = String(url||'').match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? ('https://www.youtube.com/embed/'+m[1]+'?autoplay=1&rel=0&playsinline=1&modestbranding=1') : '';
}
function youtubeThumb_(url){
  var m = String(url||'').match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if(m) return 'https://img.youtube.com/vi/'+m[1]+'/hqdefault.jpg';
  var did = driveId_(url);
  if(did) return 'https://drive.google.com/thumbnail?id='+did+'&sz=w600';
  return '';
}

function themMediaUI(){
  var loai = $('mdLoai').value;
  var url = $('mdUrl').value.trim();
  var tieuDe = $('mdTieuDe').value.trim();
  var moTa = $('mdMoTa').value.trim();
  if(!url){ toast('Nhập link ảnh/video','err'); return; }

  var maTran = $('mdTran') ? $('mdTran').value : '';
  srv('themMedia', [STATE.token, { loai: loai, url: url, tieuDe: tieuDe, moTa: moTa, maTran: maTran }])
    .then(function(r){
      toast((r&&r.msg)||'Xong', r&&r.ok?'ok':'err');
      if(r && r.ok) tai();
    });
}
function tranObj_(maTran){
  return (STATE.data.tranDau||[]).filter(function(t){ return t.maTran===maTran; })[0] || null;
}
function ganVideoTranUI(maMedia){
  var ds=(STATE.data.tranDau||[]).filter(function(t){return t.maDoiB;});
  var m=(STATE.data.media||[]).filter(function(x){return x.maMedia===maMedia;})[0]||{};
  var txt='Gắn video "'+(m.tieuDe||'Video')+'" với trận nào? Nhập số:\n0. Bỏ gắn\n'
    + ds.map(function(t,i){ return (i+1)+'. '+nhanTran_(t)+(t.maTran===m.maTran?'  ← đang gắn':''); }).join('\n');
  var v=prompt(txt, '');
  if(v===null) return;
  var n=parseInt(v,10);
  if(isNaN(n)||n<0||n>ds.length){ toast('Số không hợp lệ','err'); return; }
  srv('ganVideoTran', [STATE.token, maMedia, n===0?'':ds[n-1].maTran]).then(function(r){
    toast((r&&r.msg)||'Xong', r&&r.ok?'ok':'err');
    if(r && r.ok) tai();
  });
}
function xoaMediaUI(maMedia){
  if(!confirm('Xóa media này?')) return;
  srv('xoaMedia', [STATE.token, maMedia]).then(function(r){
    toast((r&&r.msg)||'Xong', r&&r.ok?'ok':'err');
    if(r && r.ok) tai();
  });
}
function doiThuTuMediaUI(maMedia, huong){
  srv('doiThuTuMedia', [STATE.token, maMedia, huong]).then(function(r){
    if(r && r.ok) tai();
  });
}
/* ============================================================
   ⭐ TẢI PNG THẺ CẦU THỦ + SƠ ĐỒ 2 ĐỘI
   ============================================================ */
var _ANH_B64_CACHE = {};   // cache base64 theo URL để không fetch lại

/**
 * Chuyển MỌI ảnh (cả thẻ <img> và CSS background) sang base64
 * bằng cách gọi server, tránh lỗi CORS từ Google Drive.
 */
function _chuyenAnhSangB64_(rootEl) {
  if (!rootEl) return Promise.resolve();

  // 1. Xử lý tất cả thẻ <img>
  const imgTasks = Array.from(rootEl.querySelectorAll('img')).map(img => {
    const src = img.src || '';
    if (!src || src.startsWith('data:')) return Promise.resolve();

    return srv('getImageBase64FromUrl', [src]).then(res => {
      if (res && res.ok) {
        img.setAttribute('data-old-src', src);
        img.src = res.data;
        // Đợi ảnh mới load xong
        return new Promise(resolve => {
          if (img.complete) resolve();
          else img.onload = img.onerror = resolve;
        });
      } else {
        console.warn('Không thể lấy base64 cho ảnh:', src, res?.msg);
        img.style.visibility = 'hidden'; // Ẩn ảnh lỗi để không chặn quá trình chụp
      }
    });
  });

  // 2. Xử lý tất cả CSS background-image
  const bgTasks = [];
  const allElements = [rootEl, ...rootEl.querySelectorAll('*')];
  allElements.forEach(el => {
    const bgImage = getComputedStyle(el).backgroundImage;
    if (!bgImage || bgImage === 'none' || !bgImage.includes('url(')) return;

    if (!el.hasAttribute('data-old-bg')) {
      el.setAttribute('data-old-bg', el.style.backgroundImage || '__none__');
    }

    const urlMatch = bgImage.match(/url\(["']?([^"')]+)["']?\)/);
    if (urlMatch && urlMatch[1]) {
      const originalUrl = urlMatch[1];
      if (originalUrl.startsWith('data:')) return;

      bgTasks.push(
        srv('getImageBase64FromUrl', [originalUrl]).then(res => {
          if (res && res.ok) {
            el.style.backgroundImage = `url(${res.data})`;
          } else {
            console.warn('Không thể lấy base64 cho background:', originalUrl, res?.msg);
            el.style.backgroundImage = 'none'; // Xóa background lỗi
          }
        })
      );
    }
  });

  return Promise.all([...imgTasks, ...bgTasks]);
}
/* ⭐ Chuyển MỌI CSS background-image (khung PNG, pattern, ...) → base64 */
function _chuyenBgSangB64_(rootEl){
  if(!rootEl) return Promise.resolve();
  var all = [rootEl].concat(Array.from(rootEl.querySelectorAll('*')));
  var tasks = [];

  all.forEach(function(el){
    var bg = getComputedStyle(el).backgroundImage;
    if(!bg || bg === 'none' || bg.indexOf('url(') < 0) return;

    // Lưu background gốc để khôi phục
    if(!el.hasAttribute('data-old-bg')){
      el.setAttribute('data-old-bg', el.style.backgroundImage || '__none__');
    }

    var re = /url\(["']?([^"')]+)["']?\)/g;
    var match, found = false;
    var localTasks = [];
    var newBg = bg;

    while((match = re.exec(bg)) !== null){
      var url = match[1];
      if(url.indexOf('data:') === 0) continue;
      found = true;
      (function(u){
        localTasks.push(_layAnhB64_(u).then(function(b64){
          if(b64){
            newBg = newBg.split(u).join(b64);
          } else {
            // Không lấy được → bỏ background này, tránh CORS
            newBg = 'none';
          }
        }));
      })(url);
    }

    if(found){
      tasks.push(Promise.all(localTasks).then(function(){
        el.style.backgroundImage = newBg;
      }));
    }
  });

  return Promise.all(tasks);
}
/* ⭐ Ẩn halo/shine/sparkles trước khi chụp — tránh vệt mờ */
function _anHieuUngTruocChup_(){
  var s = document.createElement('style');
  s.id = 'tmp-hide-fx';
  s.textContent =
    '.futc .halo, .futc .shine, .futc .sparkles, ' +
    '.futc .halo::before, .futc .shine::before, canvas.fx-hat, .thv-vong, .fx-gon {' +
    '  display: none !important; opacity: 0 !important; ' +
    '}';
  document.head.appendChild(s);
  return s;
}
function _khoiPhucBg_(rootEl){
  if(!rootEl) return;
  var all = [rootEl].concat(Array.from(rootEl.querySelectorAll('[data-old-bg]')));
  all.forEach(function(el){
    var old = el.getAttribute('data-old-bg');
    if(old === null) return;
    if(old === '__none__') el.style.backgroundImage = '';
    else el.style.backgroundImage = old;
    el.removeAttribute('data-old-bg');
  });
}
/* ⭐ Chuyển background của pseudo-element ::after sang base64
   (khung PNG trên sân 2 đội + tab Đội hình không phải <img> thật) */
var _PSEUDO_STYLES_ = [];

function _chuyenBgPseudoSangB64_(rootEl){
  if(!rootEl) return Promise.resolve();
  _PSEUDO_STYLES_ = [];

  var cards = Array.from(rootEl.querySelectorAll('.thv-card.has-fr, .dh-card.has-fr'));
  if(!cards.length) return Promise.resolve();

  var tasks = cards.map(function(card){
    var bg;
    try {
      bg = getComputedStyle(card, '::after').backgroundImage;
    } catch(e){ return Promise.resolve(); }
    if(!bg || bg === 'none' || bg.indexOf('url(') < 0) return Promise.resolve();

    var m = bg.match(/url\(["']?([^"')]+)["']?\)/);
    if(!m) return Promise.resolve();
    var url = m[1];
    if(url.indexOf('data:') === 0) return Promise.resolve();

    return srv('getImageBase64FromUrl', [url]).then(function(res){
      if(res && res.ok && res.data){
        var cls = 'pseudo-b64-' + Math.random().toString(36).slice(2, 9);
        card.classList.add(cls);
        var style = document.createElement('style');
        style.textContent = '.' + cls + '::after{background-image:url("' + res.data + '") !important}';
        document.head.appendChild(style);
        _PSEUDO_STYLES_.push({ style: style, card: card, cls: cls });
      } else {
        console.warn('Không lấy được khung pseudo:', url.slice(0, 100));
      }
    }).catch(function(err){
      console.warn('Lỗi lấy khung pseudo:', url.slice(0, 100), err);
    });
  });

  return Promise.all(tasks);
}

function _khoiPhucBgPseudo_(){
  _PSEUDO_STYLES_.forEach(function(item){
    if(item.style && item.style.parentNode) item.style.parentNode.removeChild(item.style);
    if(item.card && item.cls) item.card.classList.remove(item.cls);
  });
  _PSEUDO_STYLES_ = [];
}
function _khoiPhucAnh_(rootEl){
  if(!rootEl) return;
  rootEl.querySelectorAll('img[data-old-src]').forEach(function(img){
    img.src = img.getAttribute('data-old-src');
    img.removeAttribute('data-old-src');
    if(img.getAttribute('data-hidden-by-fail')){
      img.style.visibility = '';
      img.removeAttribute('data-hidden-by-fail');
    }
  });
}

function _tatAnimTam_(){
  var s = document.createElement('style');
  s.id = 'tmp-no-anim';
  s.textContent = '* { animation: none !important; transition: none !important; }';
  document.head.appendChild(s);
  return s;
}
function taiTheDoiHienTai(){
  var team = window._TEAM_DANG_XEM;
  if(!team){ toast('Không có thông tin đội','err'); return; }
  var tenFile = 'the_doi_' + String(team.tenDoi||'').replace(/\s+/g,'_');
  taiDanhSachThePng('#mGenericBox .fifa-grid-wrap', tenFile, {
    tieuDe: team.tenDoi,
    logoUrl: team.logoUrl || ''
  });
}
/* ============================================================
   ⭐ TẢI DANH SÁCH THẺ CẦU THỦ THÀNH 1 ẢNH PNG
   ============================================================ */
function taiDanhSachThePng(selector, tenFile, opts){
  opts = opts || {};
  var wrap = document.querySelector(selector);
  if(!wrap){ toast('Không tìm thấy danh sách thẻ','err'); return; }
  if(typeof htmlToImage === 'undefined'){
    toast('Thư viện chụp ảnh chưa load — Ctrl+F5','err');
    return;
  }

  var soThe = wrap.querySelectorAll('.futc').length;
  if(!soThe){ toast('Không có thẻ nào để tải','err'); return; }

  toast('Đang chuẩn bị ảnh ' + soThe + ' thẻ… (10-30 giây)');

  var fxOff = _anHieuUngTruocChup_();
  var animOff = _tatAnimTam_();

  // ⭐ Tạo outer wrapper bao quanh wrap
  var outer = document.createElement('div');
  var outerId = 'tmp-outer-' + Math.random().toString(36).slice(2, 9);
  outer.id = outerId;
  outer.style.cssText = 'display:block;width:max-content;min-width:100%;'
    + 'background:linear-gradient(135deg,#0a1230 0%,#161f42 100%);padding:0;margin:0';

  wrap.parentNode.insertBefore(outer, wrap);
  outer.appendChild(wrap);

  // ⭐ Ép grid 4 cột + padding
  var gridFixStyle = document.createElement('style');
  gridFixStyle.id = 'tmp-grid-fix';
  gridFixStyle.textContent =
      '#' + outerId + ' .fifa-grid-wrap {' +
      '  display:grid !important;' +
      '  grid-template-columns:repeat(6, minmax(0, 1fr)) !important;' +
      '  gap:16px !important;' +
      '  padding:24px !important;' +
      '  max-width:none !important;' +
      '  width:100% !important;' +
      '  box-sizing:border-box !important;' +
      '}';
  document.head.appendChild(gridFixStyle);

     // ⭐ Header — logo to, tên đội KHÔNG xuống dòng, subtitle tách biệt
  var header = document.createElement('div');
  header.id = 'tmp-header-chup';
  header.style.cssText =
    'padding:40px 60px;'
    + 'background:linear-gradient(135deg,rgba(34,211,238,.18),rgba(236,47,139,.12));'
    + 'border-bottom:3px solid rgba(34,211,238,.55);'
    + 'display:flex;align-items:center;justify-content:center;gap:40px;'
    + 'box-sizing:border-box;';

  // ⭐ Logo to hơn + flex:0 0 auto để không bị co
  var logoHtml = '';
  if(opts.logoUrl){
    logoHtml = '<img src="' + esc(driveImg(opts.logoUrl)) + '" '
      + 'style="width:200px;height:200px;object-fit:contain;flex:0 0 200px;'
      + 'filter:drop-shadow(0 10px 24px rgba(0,0,0,.8)) drop-shadow(0 0 24px rgba(34,211,238,.45))" '
      + 'onerror="console.warn(\'Header logo lỗi:\',this.src); this.style.display=\'none\'">';
  }

  // ⭐ Font-size tự co theo độ dài tên — tránh xuống dòng
  var tieuDe = opts.tieuDe || (tenFile || 'Danh sách cầu thủ').replace(/_/g,' ');
  var nameLen = tieuDe.length;
  var nameFontSize = nameLen > 25 ? 30 : (nameLen > 18 ? 38 : (nameLen > 12 ? 44 : 52));

  header.innerHTML = logoHtml
    + '<div style="display:flex;flex-direction:column;justify-content:center;'
    +      'min-width:0;text-align:left">'
    +   '<div style="font-family:Oswald,sans-serif;font-size:' + nameFontSize + 'px;'
    +        'font-weight:800;color:#f8fbff;letter-spacing:3px;text-transform:uppercase;'
    +        'text-shadow:0 4px 14px rgba(0,0,0,.95),0 0 28px rgba(34,211,238,.55);'
    +        'line-height:1;white-space:nowrap;margin:0 0 16px 0">'
    +     esc(tieuDe)
    +   '</div>'
    +   '<div style="font-size:17px;color:#93a4c7;'
    +        'letter-spacing:1.8px;font-weight:600;line-height:1;white-space:nowrap;margin:0">'
    +     soThe + ' cầu thủ &nbsp;·&nbsp; ' + new Date().toLocaleDateString('vi-VN')
    +   '</div>'
    + '</div>';

  outer.insertBefore(header, wrap);

  _chuyenAnhSangB64_(outer).then(function(){
    return _chuyenBgSangB64_(outer);
  }).then(function(){
    return _chuyenBgPseudoSangB64_(outer);
  }).then(function(){
    return new Promise(function(r){ setTimeout(r, 800); });
  }).then(function(){
    // ⭐ Log để debug logo
    var logoImg = header.querySelector('img');
    if(logoImg){
      console.log('Logo check:',
        'complete=' + logoImg.complete,
        'natural=' + logoImg.naturalWidth + 'x' + logoImg.naturalHeight,
        'src=' + logoImg.src.slice(0, 80));
    } else {
      console.warn('Không có logo trong header — có thể opts.logoUrl rỗng');
    }

        // ⭐ pixelRatio cao hơn — ảnh nét gấp 2-3 lần
    var pr;
    if(soThe > 30)      pr = 2.5;   // cũ 1.5
    else if(soThe > 20) pr = 3;     // cũ 2
    else if(soThe > 12) pr = 4;     // cũ 2
    else                pr = 5;     // cũ 3
    return htmlToImage.toPng(outer, {
      quality: 1,
      pixelRatio: pr,
      backgroundColor: '#0a1230',
      cacheBust: true,
      skipFonts: true
    });
  }).then(function(dataUrl){
    var ten = (tenFile || 'danh_sach_the').replace(/\s+/g,'_').replace(/[^\w_\-]/g,'');
    var a = document.createElement('a');
    a.download = ten + '.png';
    a.href = dataUrl;
    a.click();
    toast('Đã tải ' + soThe + ' thẻ!', 'ok');
  }).catch(function(e){
    var msg = (e && (e.message || e.reason)) ||
              (typeof e === 'string' ? e : '') ||
              'Lỗi không xác định — xem Console F12';
    console.error('Lỗi tải danh sách:', e);
    toast('Lỗi: ' + msg, 'err');
  }).finally(function(){
    fxOff.remove();
    animOff.remove();
    _khoiPhucAnh_(outer);
    _khoiPhucBg_(outer);
    _khoiPhucBgPseudo_();
    outer.parentNode.insertBefore(wrap, outer);
    outer.remove();
    gridFixStyle.remove();
  });
}

/* ⭐ Bọc selector trong container tạm để chụp khi cần capture nhiều element rời */
function _taoWrapperChup_(innerSelector, tenFile){
  // Nếu selector trỏ trực tiếp tới .fifa-grid-wrap → chụp luôn
  var direct = document.querySelector(innerSelector);
  if(direct && direct.classList.contains('fifa-grid-wrap')){
    taiDanhSachThePng(innerSelector, tenFile);
    return;
  }
  // Ngược lại → tạo wrapper tạm
  toast('Không tìm thấy lưới thẻ','err');
}
/* ---- Tải 1 thẻ cầu thủ thành PNG ---- */
function taiThePng(maCT){
  var wrap = document.getElementById('theCanChup');
  var card = wrap ? wrap.querySelector('.futc') : null;
  if(!card){ toast('Không tìm thấy thẻ','err'); return; }
  var c = cauThuObj(maCT);

  if(typeof htmlToImage === 'undefined'){
    toast('Thư viện chụp ảnh chưa load — Ctrl+F5','err');
    return;
  }

  toast('Đang chuẩn bị ảnh… (5-10 giây)');

  // 1. Ẩn hiệu ứng động (halo/shine/sparkles)
  var fxOff = _anHieuUngTruocChup_();
  // 2. Tắt animation/transition
  var animOff = _tatAnimTam_();

  // 3. Chuyển ảnh <img> → base64
  _chuyenAnhSangB64_(card).then(function(){
    // 4. Chuyển CSS background → base64 (khung PNG)
    return _chuyenBgSangB64_(card);
  }).then(function(){
        return htmlToImage.toPng(card, {
      quality: 1,
      pixelRatio: 5,
      backgroundColor: null,
      cacheBust: true,
      skipFonts: true            // ⭐ Bỏ qua Google Fonts — chữ dùng font hệ thống
    });
  }).then(function(dataUrl){
    var ten = (c ? c.hoTen : 'the').replace(/\s+/g,'_').replace(/[^\w_\-]/g,'');
    var a = document.createElement('a');
    a.download = ten + '_the.png';
    a.href = dataUrl;
    a.click();
    toast('Đã tải thẻ ' + (c?c.hoTen:''), 'ok');
  }).catch(function(e){
    var msg = (e && (e.message || e.reason)) ||
              (typeof e === 'string' ? e : '') ||
              'Lỗi không xác định — xem Console F12';
    console.error('Lỗi tải thẻ:', e);
    toast('Lỗi: ' + msg, 'err');
  }).finally(function(){
    // 5. Khôi phục
    fxOff.remove();
    animOff.remove();
    _khoiPhucAnh_(card);
    _khoiPhucBg_(card);
  });
}

/* ---- Tải sơ đồ 2 đội thành PNG ---- */
function taiSoDoPng(maTran){
  var stage = document.querySelector('#sodoCanChup .thv-stage');
  if(!stage){ toast('Không tìm thấy sơ đồ','err'); return; }

  if(typeof htmlToImage === 'undefined'){
    toast('Thư viện chụp ảnh chưa load — Ctrl+F5','err');
    return;
  }

  toast('Đang chuẩn bị ảnh sơ đồ… (15-25 giây)');

  var fxOff = _anHieuUngTruocChup_();
  var animOff = _tatAnimTam_();

  _chuyenAnhSangB64_(stage).then(function(){
    return _chuyenBgSangB64_(stage);
  }).then(function(){
    return _chuyenBgPseudoSangB64_(stage);   // ⭐ THÊM DÒNG NÀY
  }).then(function(){
    var w = stage.offsetWidth;
    var h = stage.offsetHeight;
    return htmlToImage.toPng(stage, {
      quality: 1,
      pixelRatio:4,
      backgroundColor: '#08122e',
      cacheBust: true,
      width: w,
      height: h,
      skipFonts: true
    });
  }).then(function(dataUrl){
    var ten = 'sodo_2doi_' + new Date().toISOString().slice(0,10) + '.png';
    var a = document.createElement('a');
    a.download = ten;
    a.href = dataUrl;
    a.click();
    toast('Đã tải ảnh sơ đồ!', 'ok');
  }).catch(function(e){
    var msg = (e && (e.message || e.reason)) ||
              (typeof e === 'string' ? e : '') ||
              'Lỗi không xác định';
    console.error('Lỗi tải sơ đồ:', e);
    toast('Lỗi: ' + msg, 'err');
  }).finally(function(){
    fxOff.remove();
    animOff.remove();
    _khoiPhucAnh_(stage);
    _khoiPhucBg_(stage);
    _khoiPhucBgPseudo_();                    // ⭐ THÊM DÒNG NÀY
  });
}
/* ⭐ Debug: liệt kê ảnh + background trong modal hiện tại */
function debugAnhModal(){
  var card = document.querySelector('#theCanChup .futc') ||
             document.querySelector('#sodoCanChup');
  if(!card){ console.log('Không tìm thấy modal'); return; }

  console.log('=== ẢNH <img> ===');
  card.querySelectorAll('img').forEach(function(img, i){
    console.log('#' + i,
      img.src.slice(0, 90),
      '| complete:', img.complete,
      '| natural:', img.naturalWidth + 'x' + img.naturalHeight,
      '| hidden:', img.style.visibility);
  });

  console.log('=== CSS BACKGROUND ===');
  [card].concat(Array.from(card.querySelectorAll('*'))).forEach(function(el, i){
    var bg = getComputedStyle(el).backgroundImage;
    if(bg && bg !== 'none' && bg.indexOf('url(') >= 0){
      console.log('#' + i, el.className || el.tagName, '→', bg.slice(0, 130));
    }
  });
}
/* ⭐ TEST TẠM — sẽ xóa sau khi debug xong */
console.log('=== [TEST] App đã load, bắt đầu test server ===');
setTimeout(function(){
  console.log('=== [TEST] Đang gọi getImageBase64FromUrl... ===');
  srv('getImageBase64FromUrl', ['https://drive.google.com/thumbnail?id=149ByNMnkk91bYP3PmWVphhxYdXkvVKgw&sz=w1600'])
    .then(function(r){
      if(r && r.ok){
        console.log('✅ [TEST] SERVER OK — data length:', r.data ? r.data.length : 0);
        console.log('✅ [TEST] Đoạn đầu data:', r.data ? r.data.slice(0, 80) : '');
      } else {
        console.log('❌ [TEST] SERVER trả về lỗi:', r ? r.msg : 'null');
      }
    })
    .catch(function(e){
      console.error('❌ [TEST] SERVER FAIL:', e);
      console.error('   → Có thể Code.gs chưa deploy. Xem hướng dẫn bên dưới.');
    });
}, 2000);

tai();
