export interface IGridContainer {
  gridArea: string;
}

export interface IProjectFetch {
  fetchType: 'project';
  key: string;
  timeRange: number;
}

export interface ISeriesFetch {
  fetchType: 'series';
  key: string;
  intervalTime: number;
}

export interface ISpotFetch {
  fetchType: 'spot';
  keys: string[];
  includeInterval: boolean;
}
