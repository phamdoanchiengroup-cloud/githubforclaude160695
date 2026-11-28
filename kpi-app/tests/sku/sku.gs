/* ===== 28/11 (chủ dự án): HIỆN SKU thay tên sản phẩm (Order-Flow + tab Đơn hàng). Bảng tên → SKU: sku-du-lieu.gs (chủ dự án gửi file, Claude nạp).
   skuCua_(ten): tên trùng bảng (bỏ khác biệt hoa / thường, dấu, khoảng trắng, gạch nối) → SKU; tên vốn đã là SKU (không dấu cách, có "/") → giữ; còn lại '' (web hiện tên). ===== */
function skuChuan_(t) {
  return String(t == null ? '' : t).toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/Đ/g, 'D')
    .replace(/[–—]/g, '-').replace(/''/g, '"').replace(/’/g, "'").replace(/\s*-\s*/g, ' - ').replace(/\s*\/\s*/g, '/').replace(/\s+/g, ' ').trim();
}
function skuCua_(ten) {
  var k = skuChuan_(ten); if (!k) return '';
  if (Object.prototype.hasOwnProperty.call(SKU_TEN, k)) return SKU_TEN[k];
  var g = String(ten).trim();
  if (!/\s/.test(g) && g.indexOf('/') > 0 && g.length >= 8) return g;
  return '';
}
