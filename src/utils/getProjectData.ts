import api from '../api';
import { PointTimeData } from '../config/types';
import { TIME } from '../config/constants';

interface IGetProjectData {
  key: string;
  timeRange: number;
  cache: Map<string, PointTimeData>;
  setData: React.Dispatch<React.SetStateAction<PointTimeData[]>>;
  setIsError: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorCount: React.Dispatch<React.SetStateAction<number>>;
}

async function getProjectData({
  key,
  timeRange,
  cache,
  setData,
  setIsError,
  setErrorCount,
}: IGetProjectData) {
  const maxDataSize = timeRange / (5 * TIME.SECOND);
  const currentTime = Date.now() - (Date.now() % (5 * TIME.SECOND));

  try {
    const newProjectData: PointTimeData[] = [];

    for (let i = maxDataSize; i > 0; i--) {
      const stime = (currentTime - 5 * TIME.SECOND * i).toString();
      const etime = (currentTime - 5 * TIME.SECOND * (i - 1)).toString();
      const timeMerge = 'avg';
      const cachedData = cache.get(
        `stime=${stime}/etime=${etime}/timeMerge=${timeMerge}`,
      );

      if (cachedData) {
        newProjectData.push(cachedData);
      } else {
        const response = await api.project(
          `tag/${key}?stime={stime}&etime={etime}&timeMerge={timeMerge}`,
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

        if (cache.size >= maxDataSize) {
          const firstCacheKey = cache.keys().next().value;

          cache.delete(firstCacheKey);
        }

        cache.set(
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

export default getProjectData;
