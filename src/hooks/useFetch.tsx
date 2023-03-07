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

  const [data, setData] = useState<dataType | undefined>();
  const [isPaused, setIsPaused] = useState(false);
  const [hasFetchError, setHasFetchError] = useState(false);
  const [fetchErrorCount, setFetchErrorCount] = useState(0);

  const cache = useRef<Map<string, PointTimeData>>(new Map());
  const intervalId = useRef<NodeJS.Timer | undefined>();

  let fetchFunction: () => Promise<void>;

  switch (args.fetchType) {
    case 'project':
      fetchFunction = async () =>
        await getProjectData({
          key: args.key,
          timeRange: args.timeRange,
          cache: cache.current,
          setData: setData as React.Dispatch<
            React.SetStateAction<PointTimeData[]>
          >,
          setHasFetchError,
          setFetchErrorCount,
        });
      break;
    case 'series':
      fetchFunction = async () =>
        await getSeriesData({
          key: args.key,
          intervalTime: args.intervalTime,
          cache: cache.current,
          setData: setData as React.Dispatch<
            React.SetStateAction<PointTimeData[]>
          >,
          setHasFetchError,
          setFetchErrorCount,
        });
      break;
    case 'spot':
      fetchFunction = async () =>
        await getSpotData({
          keys: args.keys,
          includeInterval: args.includeInterval,
          setData: setData as React.Dispatch<React.SetStateAction<SpotData[]>>,
          setHasFetchError,
          setFetchErrorCount,
        });
      break;
  }

  useEffect(() => {
    if (isPaused) {
      clearInterval(intervalId.current);
    } else {
      args.addMessageQueue(fetchFunction);

      if (args.includeInterval) {
        const id = setInterval(() => {
          args.addMessageQueue(fetchFunction);
        }, 5 * TIME.SECOND);

        intervalId.current = id;
      }
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
    hasFetchError,
    fetchErrorCount,
    pauseInterval,
    resumeInterval,
  };
}

export default useFetch;
