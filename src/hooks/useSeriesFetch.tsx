import { useState, useRef, useEffect, useCallback } from 'react';

import api from '../api';

import type { PointTimeData } from '../config/types';
import { TIME } from '../config/constants';

interface IUseSeriesFetch {
  key: string;
  intervalTime: number;
}

function useSeriesFetch({ key, intervalTime }: IUseSeriesFetch) {
  const [data, setData] = useState<PointTimeData[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  const cache = useRef<Map<string, PointTimeData[]>>(new Map());
  const intervalId = useRef<NodeJS.Timer | undefined>();

  async function getSeriesData() {
    const currentTime = Date.now() - (Date.now() % intervalTime);
    const stime = (currentTime - TIME.HOUR).toString();
    const etime = currentTime.toString();

    try {
      const cachedData = cache.current.get(`stime=${stime}/etime=${etime}`);

      if (!cachedData) {
        const fetchedData = await api.series(`${key}/{stime}/{etime}`, {
          stime,
          etime,
        });
        const SeriesData = fetchedData.data.data.map((pointData: string[]) => ({
          time: pointData[0],
          data: pointData[1],
        }));

        cache.current.set(`stime=${stime}/etime=${etime}`, SeriesData);

        if (cache.current.size >= 2) {
          const firstCacheKey = cache.current.keys().next().value;

          cache.current.delete(firstCacheKey);
        }

        setData(SeriesData);
      }

      setIsError(false);
      setErrorCount(0);
    } catch (error) {
      console.error('Error fetching spot data:', error);
      setIsError(true);
      setErrorCount((errorCount) => errorCount + 1);
    }
  }

  useEffect(() => {
    if (isPaused) {
      clearInterval(intervalId.current);
    } else {
      getSeriesData();

      const id = setInterval(getSeriesData, 5 * TIME.SECOND);

      intervalId.current = id;
    }

    return function cleanUp() {
      clearInterval(intervalId.current);
    };
  }, [isPaused]);

  const pauseInterval = useCallback(() => setIsPaused(true), []);
  const resumeInterval = useCallback(() => setIsPaused(false), []);

  return { data, isPaused, isError, errorCount, pauseInterval, resumeInterval };
}

export default useSeriesFetch;
