import { useEffect, useState, useRef, useCallback } from 'react';

import api from '../api';
import type { SpotData } from '../config/types';
import { TIME } from '../config/constants';

interface IUseSpotFetch {
  keys: string[];
  includeInterval: boolean;
}
function useSpotFetch({ keys, includeInterval }: IUseSpotFetch) {
  const [data, setData] = useState<SpotData[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  const intervalId = useRef<NodeJS.Timer | undefined>();

  async function getSpotData() {
    try {
      const spotDataArray: SpotData[] = [];

      for (const key of keys) {
        const newSpotData: SpotData = { key: '', data: -1 };
        const fetchedData = await api.spot(key);

        newSpotData.key = fetchedData.key;
        newSpotData.data = fetchedData.data;
        spotDataArray.push(newSpotData);
      }

      setData(spotDataArray);
      setIsError(false);
      setErrorCount(0);
    } catch (error) {
      console.error('Error fetching spot data:', error);
      setIsError(true);
      setErrorCount((errorCount) => errorCount + 1);

      if (!includeInterval) {
        setTimeout(() => getSpotData(), 5 * TIME.SECOND);
      }
    }
  }

  useEffect(() => {
    if (isPaused) {
      clearInterval(intervalId.current);
    } else {
      getSpotData();

      if (includeInterval) {
        const id = setInterval(getSpotData, 5 * TIME.SECOND);

        intervalId.current = id;
      }
    }

    return function cleanUp() {
      clearInterval(intervalId.current);
    };
  }, [isPaused]);

  const pauseInterval = useCallback(() => setIsPaused(true), []);
  const resumeInterval = useCallback(() => setIsPaused(false), []);

  return { data, isPaused, isError, errorCount, pauseInterval, resumeInterval };
}

export default useSpotFetch;
