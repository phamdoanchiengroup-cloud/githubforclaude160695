// Kết quả vòng 1: scenes cut on downbeats (data/audio.json, ~1.64 s per bar).
import type { TimelineEntry } from './engine/engine';
import type { SceneClass } from './engine/scene';
import type { Lyrics } from './engine/lyrics';
import type { AudioData } from './engine/audio';

const modules = import.meta.glob<{ default: SceneClass }>('./scenes/*.ts');
const scene = (name: string) => () => {
  const m = modules[`./scenes/${name}.ts`];
  return m ? m() : Promise.reject(new Error(`scene module not found: scenes/${name}.ts`));
};

const M1 = {
  n: 1,
  a: { key: 'rhino', ten: 'RHINO FC', ban: 2, goals: [
    { m: 20, ten: 'Lamine YaHưng', so: '19', the: 'CT1927A8A3' },
    { m: 23, ten: 'Aymeric Longporte', so: '11', the: 'CTF4C60022' },
  ] },
  b: { key: 'evo', ten: 'EVO FC', ban: 3, goals: [
    { m: 5, ten: 'Kieran Trườngppier', so: '10', the: 'CT5C278C3F' },
    { m: 10, ten: 'Kieran Trườngppier', so: '10', the: 'CT5C278C3F' },
    { m: 32, ten: 'Đạtvid Silva', so: '18', the: 'CTCB3567FC' },
  ], vang: [{ m: 16, ten: 'Kieran Trườngppier' }] },
};
const M2 = {
  n: 2,
  a: { key: 'cuebots', ten: 'CUEBOTS FC', ban: 2, goals: [
    { m: 1, ten: 'Zinedine ZiĐức', so: '09', the: 'CT8EB83F73' },
    { m: 30, ten: 'Class-Jan HữuAnhlaar', so: '31', the: 'CT6FADD0C5' },
  ] },
  b: { key: 'timetip', ten: 'TIME-TIP FC', ban: 2, goals: [
    { m: 10, ten: 'Mario Mạnhdžukić', so: '21', the: 'CTAF341436' },
    { m: 18, ten: 'Kai Hàvertz', so: '18', the: 'CT164C0111' },
  ] },
};

export function makeTimeline(_ly: Lyrics, au: AudioData): TimelineEntry[] {
  const d = (i: number) => au.downbeats[i]!;
  const E = (id: string, start: number, end: number, params: Record<string, any>): TimelineEntry =>
    ({ id, load: scene('kq'), start, end, params });
  return [
    E('open', 0, d(3), { kind: 'open' }),
    E('match1', d(3), d(9), { kind: 'match', ...M1 }),
    E('match2', d(9), d(15), { kind: 'match', ...M2 }),
    E('table', d(15), d(19), { kind: 'table' }),
    E('outro', d(19), au.duration, { kind: 'outro' }),
  ];
}
