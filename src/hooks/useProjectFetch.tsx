import { useState, useRef, useEffect } from 'react';

import api from '../api';
import { SIZE } from '../config/constants';
import type { ProjectData } from '../customTypes';

interface IUseProjectFetch {
  type: string;
  key: string;
  intervalTime: number;
}

function useProjectFetch({ type, key, intervalTime }: IUseProjectFetch) {
  const [data, setData] = useState<ProjectData>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | undefined>();

  const dataRef = useRef<ProjectData>([]);

  async function getProjectData(type: string, key: string) {
    const currentTime = Date.now();

    try {
      if (dataRef.current.length === 0) {
        const newProjectData: ProjectData = [];

        for (let i = SIZE.PROJECT_DATA_SIZE_LIMIT; i > 0; i--) {
          const response = await api.project(
            `tag/${type}/${key}?stime={stime}&etime={etime}&timeMerge={timeMerge}`,
            {
              stime: (currentTime - intervalTime * i).toString(),
              etime: (currentTime - intervalTime * (i - 1)).toString(),
              timeMerge: 'avg',
            },
          );

          newProjectData.push({
            time: currentTime - intervalTime * (i - 1),
            data: response.data,
          });
        }

        setData(newProjectData);
      } else {
        const newProjectData: ProjectData = dataRef.current.slice();
        const response = await api.project(
          `tag/${type}/${key}?stime={stime}&etime={etime}&timeMerge={timeMerge}`,
          {
            stime: (currentTime - intervalTime).toString(),
            etime: currentTime.toString(),
            timeMerge: 'avg',
          },
        );

        newProjectData.shift();
        newProjectData.push({
          time: currentTime,
          data: response.data,
        });

        setData(newProjectData);
      }
    } catch (error) {
      console.error('Error fetching project data:', error);
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

  return { data, isPaused, pauseInterval, resumeInterval };
}

export default useProjectFetch;
