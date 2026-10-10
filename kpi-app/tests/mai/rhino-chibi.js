var RHINO=''+
'<defs>'+
 '<linearGradient id="rDa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c3ccd4"/><stop offset=".55" stop-color="#a7b2bc"/><stop offset="1" stop-color="#8e9aa5"/></linearGradient>'+
 '<linearGradient id="rMom" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6eaee"/><stop offset="1" stop-color="#c9d1d8"/></linearGradient>'+
 '<linearGradient id="rSung" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#f3e3c0"/><stop offset=".7" stop-color="#fff8ea"/><stop offset="1" stop-color="#f7b829"/></linearGradient>'+
 '<linearGradient id="rMong" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2408"/><stop offset=".5" stop-color="#b9781a"/><stop offset="1" stop-color="#ffd36a"/></linearGradient>'+
 '<linearGradient id="rAo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3c3c3c"/><stop offset="1" stop-color="#232323"/></linearGradient>'+
 '<radialGradient id="rMa" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff8aa0" stop-opacity=".6"/><stop offset="1" stop-color="#ff8aa0" stop-opacity="0"/></radialGradient>'+
'</defs>'+
/* chỏm lông vàng trên đỉnh đầu (kiểu "ăng-ten" anime) – đung đưa */
'<g class="duoi"><path d="M101 54c-3-13 3-22 15-25-7 6-10 13-9 24z" fill="#f7b829"/><path d="M104 54c0-9 3-15 9-19" stroke="#fff3cf" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".7"/></g>'+
'<g class="than-tren">'+
/* chân + giày thể thao */
'<rect x="80" y="232" width="15" height="24" rx="7" fill="#8e9aa5"/><rect x="105" y="232" width="15" height="24" rx="7" fill="#8e9aa5"/>'+
'<path d="M74 256c0-7 6-10 13-10h8v14H77c-2 0-3-2-3-4z" fill="#f4f7f8"/><path d="M126 256c0-7-6-10-13-10h-8v14h18c2 0 3-2 3-4z" fill="#f4f7f8"/>'+
'<path d="M76 258h19M105 258h19" stroke="#f7b829" stroke-width="2.5" stroke-linecap="round"/>'+
/* thân: áo khoác đồng phục than chì, viền vàng Rhino */
'<path d="M66 238c0-38 12-66 34-70 22 4 34 32 34 70z" fill="url(#rAo)"/>'+
'<path d="M88 168l12 24 12-24z" fill="#f4f7f8"/>'+
'<path d="M86 168l14 26 14-26" fill="none" stroke="#f7b829" stroke-width="4" stroke-linejoin="round"/>'+
'<path d="M100 194v44" stroke="#111" stroke-width="2"/>'+
'<path d="M68 222h64" stroke="#f7b829" stroke-width="2" opacity=".6"/>'+
'<rect x="104" y="200" width="24" height="11" rx="2.5" fill="#eef2f4"/><rect x="104" y="200" width="24" height="3" rx="1.5" fill="#f7b829"/>'+
'<text x="116" y="209.4" text-anchor="middle" font-size="6" font-weight="700" fill="#2b2b2b" font-family="Arial,sans-serif">RHINO</text>'+
/* tay trái */
'<path d="M72 180c-8 10-12 22-12 34" stroke="#333" stroke-width="13" fill="none" stroke-linecap="round"/>'+
'<rect x="53" y="208" width="14" height="6" rx="3" fill="#f7b829"/><circle cx="60" cy="219" r="7" fill="#aab5bf"/>'+
/* tay phải: chỉ / cổ vũ */
'<g class="tay-chi"><path d="M128 180c8 10 12 22 12 34" stroke="#333" stroke-width="13" fill="none" stroke-linecap="round"/>'+
 '<rect x="133" y="208" width="14" height="6" rx="3" fill="#f7b829"/><circle cx="140" cy="219" r="7" fill="#aab5bf"/>'+
 '<path class="ngon" d="M140 220l1 10" stroke="#aab5bf" stroke-width="4.5" stroke-linecap="round"/></g>'+
/* cổ */
'<path d="M90 158h20v12c-5 3-15 3-20 0z" fill="#98a4ae"/>'+
/* tai (vẽ trước đầu để chân tai nằm dưới) */
'<g class="tai"><path d="M52 84c-14-12-18-30-10-42 12 4 20 18 22 34z" fill="url(#rDa)"/><path d="M53 76c-8-8-10-18-6-26 6 4 10 12 11 22z" fill="#f2b7c2"/></g>'+
'<g class="tai tai-p"><path d="M148 84c14-12 18-30 10-42-12 4-20 18-22 34z" fill="url(#rDa)"/><path d="M147 76c8-8 10-18 6-26-6 4-10 12-11 22z" fill="#f2b7c2"/></g>'+
/* đầu tròn, má phúng phính */
'<path d="M38 112c0-38 27-62 62-62s62 24 62 62c0 30-14 50-36 58-9 4-17 5-26 5s-17-1-26-5c-22-8-36-28-36-58z" fill="url(#rDa)"/>'+
/* nếp da trán + đốm sáng */
'<path d="M80 66c13-5 27-5 40 0" stroke="#8e9aa5" stroke-width="2" fill="none" stroke-linecap="round" opacity=".55"/>'+
'<path d="M86 74c9-3 19-3 28 0" stroke="#8e9aa5" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".4"/>'+
'<ellipse cx="66" cy="72" rx="12" ry="6" fill="#fff" opacity=".22" transform="rotate(-25 66 72)"/>'+
/* má hồng */
'<ellipse cx="56" cy="136" rx="12" ry="7" fill="url(#rMa)"/><ellipse cx="144" cy="136" rx="12" ry="7" fill="url(#rMa)"/>'+
/* mõm sáng màu */
'<ellipse cx="100" cy="145" rx="35" ry="23" fill="url(#rMom)"/>'+
'<ellipse cx="89" cy="147" rx="3.4" ry="2.3" fill="#6b7782"/><ellipse cx="111" cy="147" rx="3.4" ry="2.3" fill="#6b7782"/>'+
/* sừng: sừng lớn trên mõm, đầu sừng ánh vàng */
'<path d="M89 132C91 116 95 102 104 86c-1 15 2 31 7 46z" fill="url(#rSung)" stroke="#d9c08c" stroke-width="1.2" stroke-linejoin="round"/>'+
'<path d="M95 126c1-9 3-17 7-26" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>'+
/* mắt trái */
'<g class="mat-g"><ellipse cx="68" cy="112" rx="14" ry="17" fill="#fff"/><ellipse cx="68" cy="115" rx="12" ry="14.5" fill="url(#rMong)"/>'+
 '<ellipse cx="68" cy="116" rx="5.5" ry="7.5" fill="#1d1206"/><ellipse cx="62.5" cy="107" rx="4.4" ry="5.6" fill="#fff"/><circle cx="73" cy="122" r="2.4" fill="#fff" opacity=".9"/><circle cx="65" cy="124" r="1.2" fill="#fff" opacity=".7"/>'+
 '<path d="M52 108c2-11 9-17 17-17 8 0 14 4 16 10" stroke="#2b2b2b" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M53 106l-5-3" stroke="#2b2b2b" stroke-width="2" stroke-linecap="round"/></g>'+
/* mắt phải */
'<g class="mat-g"><ellipse cx="132" cy="112" rx="14" ry="17" fill="#fff"/><ellipse cx="132" cy="115" rx="12" ry="14.5" fill="url(#rMong)"/>'+
 '<ellipse cx="132" cy="116" rx="5.5" ry="7.5" fill="#1d1206"/><ellipse cx="126.5" cy="107" rx="4.4" ry="5.6" fill="#fff"/><circle cx="137" cy="122" r="2.4" fill="#fff" opacity=".9"/><circle cx="129" cy="124" r="1.2" fill="#fff" opacity=".7"/>'+
 '<path d="M148 108c-2-11-9-17-17-17-8 0-14 4-16 10" stroke="#2b2b2b" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M147 106l5-3" stroke="#2b2b2b" stroke-width="2" stroke-linecap="round"/></g>'+
/* miệng */
'<path class="mieng-cuoi" d="M92 156c3 4 6 4 8 1.5 2 2.5 5 2.5 8-1.5" stroke="#5c6670" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'+
'<g class="mieng-mo"><path d="M93 154c1.5 9 12.5 9 14 0z" fill="#8f2a42"/><path d="M96 160c2.5 1.6 5.5 1.6 8 0" stroke="#ff8fa3" stroke-width="2.6" stroke-linecap="round"/></g>'+
/* lông mày */
'<g class="may-vui" stroke="#5c6670" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".9"><path d="M58 86c5-3 11-3 16-1"/><path d="M126 85c5-2 11-2 16 1"/></g>'+
'<g class="may-lo" stroke="#5c6670" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".9"><path d="M58 88c6 0 11-2 16-6"/><path d="M142 88c-6 0-11-2-16-6"/></g>'+
/* mồ hôi + lấp lánh */
'<path class="mo-hoi" d="M154 78c4 6 6 10 3 13s-8 0-7-4 2-6 4-9z" fill="#9fe3ff" stroke="#5ab8e0" stroke-width="1"/>'+
'<g class="lap-lanh" fill="#f7b829"><path d="M22 70l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/><path d="M176 40l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" style="animation-delay:.4s"/><path d="M170 150l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z" style="animation-delay:.8s"/></g>'+
'</g>';
