import { useState, useRef, useEffect, useCallback } from 'react';

import getProjectData from '../utils/getProjectData';
import getSeriesData from '../utils/getSeriesData';
import getSpotData from '../utils/getSpotData';

import type { PointTimeData, SpotData } from '../config/types';
import { IProjectFetch, ISeriesFetch, ISpotFetch } from '../config/interfaces';

import { TIME } from '../config/constants';

function useFetch<T extends IProjectFetch | ISeriesFetch | ISpotFetch>(
  args: T,
) {
  type dataType = T extends ISpotFetch ? SpotData[] : PointTimeData[];

  const [data, setData] = useState<dataType | undefined>(undefined);
  const [isPaused, setIsPaused] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  const cache = useRef<Map<string, PointTimeData>>(new Map());
  const intervalId = useRef<NodeJS.Timer | undefined>();

  let fetchFunction: () => void;

  switch (args.fetchType) {
    case 'project':
      fetchFunction = () =>
        getProjectData({
          key: args.key,
          timeRange: args.timeRange,
          cache: cache.current,
          setData: setData as React.Dispatch<
            React.SetStateAction<PointTimeData[]>
          >,
          setIsError,
          setErrorCount,
        });
      break;
    case 'series':
      fetchFunction = () =>
        getSeriesData({
          key: args.key,
          intervalTime: args.intervalTime,
          cache: cache.current,
          setData: setData as React.Dispatch<
            React.SetStateAction<PointTimeData[]>
          >,
          setIsError,
          setErrorCount,
        });
      break;
    case 'spot':
      fetchFunction = () =>
        getSpotData({
          keys: args.keys,
          includeInterval: args.includeInterval,
          setData: setData as React.Dispatch<React.SetStateAction<SpotData[]>>,
          setIsError,
          setErrorCount,
        });
      break;
  }

  useEffect(() => {
    if (isPaused) {
      clearInterval(intervalId.current);
    } else {
      fetchFunction();

      const id = setInterval(fetchFunction, 5 * TIME.SECOND);

      intervalId.current = id;
    }

    return function cleanUp() {
      clearInterval(intervalId.current);
    };
  }, [isPaused]);

  const pauseInterval = useCallback(() => setIsPaused(true), []);
  const resumeInterval = useCallback(() => setIsPaused(false), []);

  return {
    data,
    isPaused,
    isError,
    errorCount,
    pauseInterval,
    resumeInterval,
  };
}

export default useFetch;
