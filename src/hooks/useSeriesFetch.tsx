import { useState, useEffect } from 'react';

import api from '../api';

import type { SeriesData } from '../config/types';
import { TIME } from '../config/constants';

interface IUseSeriesFetch {
  key: string;
  intervalTime: number;
}

function useSeriesFetch({ key, intervalTime }: IUseSeriesFetch) {
  const [data, setData] = useState<SeriesData>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isError, setIsError] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | undefined>();

  async function getSeriesData() {
    const currentTime = Date.now();

    try {
      const fetchedData = await api.series(`${key}/{stime}/{etime}`, {
        stime: (currentTime - 1 * TIME.HOUR).toString(),
        etime: currentTime.toString(),
      });

      const SeriesData = fetchedData.data.data.map((pointData: string[]) => ({
        time: pointData[0],
        data: pointData[1],
      }));

      setData(SeriesData);
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
      getSeriesData();

      const id = setInterval(getSeriesData, intervalTime);

      setIntervalId(id);
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

export default useSeriesFetch;
