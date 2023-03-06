export interface IGridContainer {
  gridArea: string;
}

export interface IProjectFetch {
  fetchType: 'project';
  key: string;
  timeRange: number;
  includeInterval: boolean;
  addMessageQueue: (fn: () => Promise<void>) => void;
}

export interface ISeriesFetch {
  fetchType: 'series';
  key: string;
  intervalTime: number;
  includeInterval: boolean;
  addMessageQueue: (fn: () => Promise<void>) => void;
}

export interface ISpotFetch {
  fetchType: 'spot';
  keys: string[];
  includeInterval: boolean;
  addMessageQueue: (fn: () => Promise<void>) => void;
}
