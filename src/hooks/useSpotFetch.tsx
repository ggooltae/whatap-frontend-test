import { useEffect, useState } from 'react';

import api from '../api';
import type { SpotData } from '../customTypes';

interface IUseSpotFetch {
  keys: string[];
  intervalTime: number;
  includeInterval: boolean;
}

function useSpotFetch({ keys, intervalTime, includeInterval }: IUseSpotFetch) {
  const [data, setData] = useState<SpotData>({});
  const [isPaused, setIsPaused] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | undefined>();

  async function getSpotData() {
    try {
      const newSpotData: SpotData = {};

      for (const key of keys) {
        const fetchedData = await api.spot(key);

        newSpotData[fetchedData.key] = fetchedData.data;
      }

      setData(newSpotData);
    } catch (error) {
      console.error('Error fetching spot data:', error);
    }
  }

  useEffect(() => {
    if (isPaused) {
      clearInterval(intervalId);
    } else {
      getSpotData();

      if (includeInterval) {
        const id = setInterval(getSpotData, intervalTime);

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

  return { data, pauseInterval, resumeInterval };
}

export default useSpotFetch;
