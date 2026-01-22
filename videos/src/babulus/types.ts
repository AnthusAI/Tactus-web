export type Bullet = {
  id: string;
  text: string;
};

export type CuePoint = {
  id: string;
  label: string;
  startSec: number;
  endSec: number;
  text: string;
  bullets?: Bullet[];
};

export type Scene = {
  id: string;
  title: string;
  startSec: number;
  endSec: number;
  cues: CuePoint[];
};

export type Script = {
  scenes: Scene[];
  posterTimeSec?: number | null;
  fps?: number;
};
