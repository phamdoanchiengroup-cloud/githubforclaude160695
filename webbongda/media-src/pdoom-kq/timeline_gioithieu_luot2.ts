// Giới thiệu lượt 2 (29/10/2026): mở đầu → nhìn lại lượt 1 → BXH → trận 3 → trận 4 → hẹn gặp. Cắt trên downbeat.
import type { TimelineEntry } from './engine/engine';
import type { SceneClass } from './engine/scene';
import type { Lyrics } from './engine/lyrics';
import type { AudioData } from './engine/audio';

const modules = import.meta.glob<{ default: SceneClass }>('./scenes/*.ts');
const scene = (name: string) => () => {
  const m = modules[`./scenes/${name}.ts`];
  return m ? m() : Promise.reject(new Error(`scene module not found: scenes/${name}.ts`));
};

const LABEL = 'VÒNG TRÒN · LƯỢT 2 · 29.10.2026';
const NGAY = 'THỨ NĂM 29.10.2026';
const T3 = {
  n: 3, gio: '15:00', ngay: NGAY,
  a: { key: 'rhino', ten: 'RHINO FC', hang: 4, diem: 0, hs: '−1', ct: [
    { the: 'CTCF3038CB', ten: 'Linhtaro Martínez', ghi: 'ĐỘI TRƯỞNG' },
    { the: 'CT1927A8A3', ten: 'Lamine YaHưng', ghi: '1 BÀN LƯỢT 1' },
    { the: 'CTF4C60022', ten: 'Aymeric Longporte', ghi: '1 BÀN LƯỢT 1' },
  ] },
  b: { key: 'timetip', ten: 'TIME-TIP FC', hang: 3, diem: 1, hs: '0', ct: [
    { the: 'CTBE7CF0D3', ten: 'Memphis Điệppay', ghi: 'ĐỘI TRƯỞNG' },
    { the: 'CTAF341436', ten: 'Mario Mạnhdžukić', ghi: '1 BÀN LƯỢT 1' },
    { the: 'CT164C0111', ten: 'Kai Hàvertz', ghi: '1 BÀN LƯỢT 1' },
  ] },
};
const T4 = {
  n: 4, gio: '15:00', ngay: NGAY,
  a: { key: 'evo', ten: 'EVO FC', hang: 1, diem: 3, hs: '+1', ct: [
    { the: 'CT7CE12C78', ten: 'Marcus Thànhram', ghi: 'ĐỘI TRƯỞNG' },
    { the: 'CT5C278C3F', ten: 'Kieran Trườngppier', ghi: '2 BÀN LƯỢT 1' },
    { the: 'CTCB3567FC', ten: 'Đạtvid Silva', ghi: '1 BÀN LƯỢT 1' },
  ] },
  b: { key: 'cuebots', ten: 'CUEBOTS FC', hang: 2, diem: 1, hs: '0', ct: [
    { the: 'CT6FADD0C5', ten: 'Class-Jan HữuAnhlaar', ghi: 'ĐỘI TRƯỞNG · 1 BÀN' },
    { the: 'CT8EB83F73', ten: 'Zinedine ZiĐức', ghi: '1 BÀN LƯỢT 1' },
  ] },
};

export function makeTimeline(_ly: Lyrics, au: AudioData): TimelineEntry[] {
  const d = (i: number) => au.downbeats[i]!;
  const E = (id: string, start: number, end: number, params: Record<string, any>): TimelineEntry =>
    ({ id, load: scene('kq'), start, end, params: { label: LABEL, ...params } });
  return [
    E('open', 0, d(3), { kind: 'open', sub: 'VÒNG TRÒN · LƯỢT 2 · 2 TRẬN · 15:00', words: [
      ['GIẢI BÓNG ĐÁ', 'bone', 150], ['RHINO BILLIARDS', 'bone', 170], ['2026', 'signal', 330],
      ['LƯỢT 2', 'bone', 300], ['29.10', 'bone', 300], ['MATCH DAY', 'signal', 250],
    ] }),
    E('recap', d(3), d(6), { kind: 'recap', kq: [['rhino', 'RHINO FC', 2, 3, 'EVO FC', 'evo'], ['cuebots', 'CUEBOTS FC', 2, 2, 'TIME-TIP FC', 'timetip']] }),
    E('table', d(6), d(9), { kind: 'table' }),
    E('tran3', d(9), d(14), { kind: 'preview', ...T3 }),
    E('tran4', d(14), d(19), { kind: 'preview', ...T4 }),
    E('outro', d(19), au.duration, { kind: 'outro2', gio: '15:00', ngay: NGAY }),
  ];
}
