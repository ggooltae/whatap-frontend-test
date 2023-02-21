export type SpotData = Record<string, number>;

export type SeriesData = {
  records: Record<string, number | string>[];
  total: number;
};

export type ProjectData = { time: number; data: string | number }[];

export type TimeData = { time: number; data: string | number };
