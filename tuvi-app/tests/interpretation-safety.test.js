const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');

test('synthesis does not infer physical appearance from a birth chart', () => {
  const source = read('TongHop.gs');
  const fn = source.slice(source.indexOf('function thVocDang_(C)'), source.indexOf('function thCoThe_(C)'));
  assert.match(fn, /không phải phương pháp đã được kiểm chứng để suy ra chiều cao/i);
  assert.match(fn, /chiSo: \{ cao: null, beo: null/);
});

test('synthesis does not make personal health or injury predictions', () => {
  const source = read('TongHop.gs');
  const fn = source.slice(source.indexOf('function thCoThe_(C)'), source.indexOf('function thTinhCach_(C)'));
  assert.match(fn, /Không chẩn đoán sức khỏe/);
  assert.match(fn, /vung: \[\]/);
});

test('career ranking is described as relative score, not fit probability', () => {
  const source = read('TongHop.gs');
  assert.match(source, /Điểm xếp hạng tương đối trong danh sách này; không phải xác suất/);
  assert.doesNotMatch(source, /55% theo số hệ cùng gợi ý/);
  const ui = read('Script.html');
  assert.match(ui, /Điểm tương đối .*\/100/);
  assert.match(ui, /không phải xác suất thành công/);
});

test('birth-chart self-check does not claim to validate birth time', () => {
  const html = read('Index.html');
  assert.match(html, /không thể xác minh lá số hoặc giờ sinh đúng/);
  assert.doesNotMatch(html, /Khớp <b>từ 6\/8 nhóm<\/b> trở lên: lá số đúng là của bạn/);
});

test('poster data URI and shared UI version marker are present', () => {
  const image = read('Anh.html');
  const index = read('Index.html');
  const styles = read('Styles.html');
  const script = read('Script.html');
  assert.match(image, /var ANH_QC = 'data:image\/jpeg;base64,/);
  assert.match(index, /content="2026\.10\.24\.02"/);
  assert.match(styles, /--tcc-ban: "2026\.10\.24\.02"/);
  assert.match(script, /var BAN_GIAO_DIEN = '2026\.10\.24\.02'/);
});


test('9-domain chart is a data-driven selector with a side interpretation panel', () => {
  const script = read('Script.html');
  const styles = read('Styles.html');
  assert.match(script, /function th6BanDoHtml\(D, khach\)/);
  assert.match(script, /th6BanDoHtml\(T, false\)/);
  assert.match(script, /th6BanDoHtml\(M, true\)/);
  assert.match(script, /data-th6-bd/);
  assert.match(styles, /\.th6-bd-layout/);
  assert.doesNotMatch(script, /function vuTruHtml\(/);
  assert.doesNotMatch(script, /function th6BangNhiet\(/);
});

test('Tuần/Triệt badges use normalized coordinates for scaled mobile charts', () => {
  const script = read('Script.html');
  assert.match(script, /var ra = goc\(cellOf\(list\[0\]\)\.getBoundingClientRect\(\)\)/);
  assert.match(script, /var rb = goc\(cellOf\(list\[1\]\)\.getBoundingClientRect\(\)\)/);
});

test('3D controls are removed and the chart stays in 2D', () => {
  const html = read('Index.html');
  const script = read('Script.html');
  assert.doesNotMatch(html, /data-che-do="3d"|data-ls3d|data-bt3d/);
  assert.doesNotMatch(script, /function mo3D\(/);
  assert.doesNotMatch(script, /function ve3DMacDinh\(/);
});

test('mobile layout disables expensive background animation and extra poster overlay', () => {
  const styles = read('Styles.html');
  const script = read('Script.html');
  assert.match(styles, /@media \(max-width:760px\), \(pointer:coarse\)/);
  assert.match(styles, /\.bk-nen,\.bk-hat/);
  assert.match(styles, /\.mountains,\.tcc-goc-anh/);
  assert.match(script, /window\.innerWidth <= 760/);
  assert.match(script, /tccGocAnhImg.*window\.innerWidth > 760/);
});

test('PDF uses internal-score wording instead of unsupported probability labels', () => {
  const html = read('Index.html');
  const script = read('Script.html');
  assert.match(html, /Biến cố hội tụ 6 hệ \(điểm tín hiệu nội bộ, không phải xác suất\)/);
  assert.match(script, /Điểm tín hiệu nội bộ về/);
  assert.match(script, /bcSo\(y\.pct\) \+ '\/100<\\/b>'/);
  assert.match(script, /không xác minh tính cách hay dự đoán chắc chắn sự kiện tương lai/);
});
