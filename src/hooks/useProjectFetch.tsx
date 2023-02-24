import { useState, useRef, useEffect } from 'react';

import api from '../api';
import type { SeriesData } from '../config/types';

interface IUseProjectFetch {
  type: string;
  key: string;
  intervalTime: number;
  timeRange: number;
}

function useProjectFetch({
  type,
  key,
  intervalTime,
  timeRange,
}: IUseProjectFetch) {
  const [data, setData] = useState<SeriesData>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isError, setIsError] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | undefined>();

  const dataRef = useRef<SeriesData>([]);

  const maxDataSize = timeRange / intervalTime;

  async function getProjectData(type: string, key: string) {
    const currentTime = Date.now();

    try {
      if (dataRef.current.length === 0) {
        const newProjectData: SeriesData = [];

        for (let i = maxDataSize; i > 0; i--) {
          const stime = (currentTime - intervalTime * i).toString();
          const etime = (currentTime - intervalTime * (i - 1)).toString();
          const timeMerge = 'avg';
          const response = await api.project(
            `tag/${type}/${key}?stime={stime}&etime={etime}&timeMerge={timeMerge}`,
            {
              stime,
              etime,
              timeMerge,
            },
          );

          newProjectData.push({
            time: currentTime - intervalTime * (i - 1),
            data: response.data,
          });
        }

        setData(newProjectData);
      } else {
        const copiedData = dataRef.current.slice();
        const recentTime = copiedData[copiedData.length - 1].time;
        const response = await api.project(
          `tag/${type}/${key}?stime={stime}&etime={etime}&timeMerge={timeMerge}`,
          {
            stime: recentTime.toString(),
            etime: (recentTime + intervalTime).toString(),
            timeMerge: 'avg',
          },
        );

        copiedData.shift();
        copiedData.push({
          time: recentTime + intervalTime,
          data: response.data,
        });

        setData(copiedData);
      }

      setIsError(false);
    } catch (error) {
      console.error('Error fetching project data:', error);

      setIsError(true);
    }
  }

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    if (isPaused) {
      clearInterval(intervalId);
    } else {
      getProjectData(type, key);

      const id = setInterval(() => getProjectData(type, key), intervalTime);

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

export default useProjectFetch;
