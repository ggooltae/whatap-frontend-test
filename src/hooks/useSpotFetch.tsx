import { useEffect, useState } from 'react';

import api from '../api';
import type { SpotData } from '../config/types';
import { TIME } from '../config/constants';

interface IUseSpotFetch {
  keys: string[];
  includeInterval: boolean;
}
function useSpotFetch({ keys, includeInterval }: IUseSpotFetch) {
  const [data, setData] = useState<SpotData>({});
  const [isPaused, setIsPaused] = useState(false);
  const [isError, setIsError] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | undefined>();

  async function getSpotData() {
    try {
      const newSpotData: SpotData = {};

      for (const key of keys) {
        const fetchedData = await api.spot(key);

        newSpotData[fetchedData.key] = fetchedData.data;
      }

      setData(newSpotData);
      setIsError(false);
    } catch (error) {
      console.error('Error fetching spot data:', error);
      setIsError(true);
    }
  }

  useEffect(() => {
    if (isPaused) {
      clearInterval(intervalId);
    } else {
      getSpotData();

      if (includeInterval) {
        const id = setInterval(getSpotData, 5 * TIME.SECOND);

        setIntervalId(id);
      }
    }

    return function cleanUp() {
      clearInterval(intervalId);
    };
  }, [isPaused]);

  function pauseInterval() {
    setIsPaused(true);
  }

  function resumeInterval() {
    setIsPaused(false);
  }

  return { data, isPaused, isError, pauseInterval, resumeInterval };
}

export default useSpotFetch;
