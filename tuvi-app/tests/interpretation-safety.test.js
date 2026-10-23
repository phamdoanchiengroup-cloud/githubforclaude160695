const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');

test('synthesis does not infer physical appearance from a birth chart', () => {
  const source = read('TongHop.gs');
  const fn = source.slice(source.indexOf('function thVocDang_(C)'), source.indexOf('function thCoThe_(C)'));
  assert.match(fn, /Không thể xác định đáng tin cậy ngoại hình thực tế/);
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
  assert.match(index, /content="2026\.10\.23\.16"/);
  assert.match(styles, /--tcc-ban: "2026\.10\.23\.16"/);
  assert.match(script, /var BAN_GIAO_DIEN = '2026\.10\.23\.16'/);
});
