import { useState, useRef, useEffect, useCallback } from 'react';

import api from '../api';
import type { PointTimeData } from '../config/types';
import { TIME } from '../config/constants';

interface IUseProjectFetch {
  type: string;
  key: string;
  timeRange: number;
}

function useProjectFetch({ type, key, timeRange }: IUseProjectFetch) {
  const [data, setData] = useState<PointTimeData[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  const cache = useRef<Map<string, PointTimeData>>(new Map());
  const intervalId = useRef<NodeJS.Timer | undefined>();

  const maxDataSize = timeRange / (5 * TIME.SECOND);

  async function getProjectData(type: string, key: string) {
    const currentTime = Date.now() - (Date.now() % (5 * TIME.SECOND));

    try {
      const newProjectData: PointTimeData[] = [];

      for (let i = maxDataSize; i > 0; i--) {
        const stime = (currentTime - 5 * TIME.SECOND * i).toString();
        const etime = (currentTime - 5 * TIME.SECOND * (i - 1)).toString();
        const timeMerge = 'avg';
        const cachedData = cache.current.get(
          `stime=${stime}/etime=${etime}/timeMerge=${timeMerge}`,
        );

        if (cachedData) {
          newProjectData.push(cachedData);
        } else {
          const response = await api.project(
            `tag/${type}/${key}?stime={stime}&etime={etime}&timeMerge={timeMerge}`,
            {
              stime,
              etime,
              timeMerge,
            },
          );

          const pointTimeData = {
            time: currentTime - 5 * TIME.SECOND * (i - 1),
            data: response.data,
          };

          if (cache.current.size >= maxDataSize) {
            const firstCacheKey = cache.current.keys().next().value;

            cache.current.delete(firstCacheKey);
          }

          cache.current.set(
            `stime=${stime}/etime=${etime}/timeMerge=${timeMerge}`,
            pointTimeData,
          );
          newProjectData.push(pointTimeData);
        }
      }

      setData(newProjectData);
      setIsError(false);
      setErrorCount(0);
    } catch (error) {
      console.error('Error fetching project data:', error);
      setIsError(true);
      setErrorCount((errorCount) => errorCount + 1);
    }
  }

  useEffect(() => {
    if (isPaused) {
      clearInterval(intervalId.current);
    } else {
      getProjectData(type, key);

      const id = setInterval(() => getProjectData(type, key), 5 * TIME.SECOND);

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

export default useProjectFetch;
