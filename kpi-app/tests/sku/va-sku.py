# -*- coding: utf-8 -*-
"""Vá Code.gs – 28/11 (chủ dự án): gắn SKU cho từng mã hàng của Sheet đơn (o.sku) để Order-Flow + tab Đơn hàng hiện SKU to, tên nhỏ.
Dữ liệu: sku/sku-du-lieu.gs (dựng bằng sku/tao-sku.py), hàm: sku/sku.gs. Chạy bằng exec() ở CUỐI tests/va-code.py."""
import io as _io, os as _os
_D = _os.path.dirname(_os.path.abspath(__file__)) if '__file__' in globals() else ''
_sd = _os.path.join(_os.path.dirname(_os.path.abspath(RA)), 'tests', 'sku')
s = s + '\n' + _io.open(_os.path.join(_sd, 'sku-du-lieu.gs'), encoding='utf-8').read() + '\n' + _io.open(_os.path.join(_sd, 'sku.gs'), encoding='utf-8').read()
R("  try { var tUu = Object.keys(phu).filter(function(n) { return plChuan_(n) === 'DON UU TIEN'; })[0]; if (tUu) dhUuDongGoi_(ds, phu[tUu]); } catch (eUG) {}",
  "  try { var tUu = Object.keys(phu).filter(function(n) { return plChuan_(n) === 'DON UU TIEN'; })[0]; if (tUu) dhUuDongGoi_(ds, phu[tUu]); } catch (eUG) {}\n  try { var gSku = function(o) { var k = skuCua_(o.ten); if (k) o.sku = k; }; ds.forEach(gSku); uu.forEach(gSku); Object.keys(phu).forEach(function(n) { phu[n].forEach(gSku); }); } catch (eSku) {}   // 28/11: SKU từng mã")
R("var DH_DON_KHOA = 'DH_DON_v15';", "var DH_DON_KHOA = 'DH_DON_v16';   // v16 (28/11): o.sku")
R("Math.max(0, o.thieu || 0), Math.max(0, Number(o.kho) || 0), Math.max(0, Number(o.daTra) || 0)]; }) });",
  "Math.max(0, o.thieu || 0), Math.max(0, Number(o.kho) || 0), Math.max(0, Number(o.daTra) || 0), o.sku || skuCua_(o.ten)]; }) });   // [10] SKU (28/11)")
R("dong: dong.map(function(z) { return [z.ten, z.sl, z.thieu]; }) }; });", "dong: dong.map(function(z) { return [z.ten, z.sl, z.thieu, skuCua_(z.ten)]; }) }; });   // [3] SKU (28/11)")
R("return [r.Luc, r.Tab, r.MaDon, r.Ten, r.Cu, r.Moi, r.Nguon === 'Sheet' ? '' : r.Nguon]; });", "return [r.Luc, r.Tab, r.MaDon, r.Ten, r.Cu, r.Moi, r.Nguon === 'Sheet' ? '' : r.Nguon, skuCua_(r.Ten)]; });   // [7] SKU (28/11)")
