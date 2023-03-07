import { PointTimeData } from '../config/types';

import api from '../api';
import { TIME } from '../config/constants';

interface IGetSeriesData {
  key: string;
  intervalTime: number;
  cache: Map<string, PointTimeData>;
  setData: React.Dispatch<React.SetStateAction<PointTimeData[]>>;
  setHasFetchError: React.Dispatch<React.SetStateAction<boolean>>;
  setFetchErrorCount: React.Dispatch<React.SetStateAction<number>>;
}

async function getSeriesData({
  key,
  intervalTime,
  cache,
  setData,
  setHasFetchError,
  setFetchErrorCount,
}: IGetSeriesData) {
  const currentTime = Date.now() - (Date.now() % intervalTime);
  const stime = (currentTime - TIME.HOUR).toString();
  const etime = currentTime.toString();

  try {
    const cachedData = cache.get(`stime=${stime}/etime=${etime}`);

    if (!cachedData) {
      const fetchedData = await api.series(`${key}/{stime}/{etime}`, {
        stime,
        etime,
      });
      const SeriesData = fetchedData.data.data.map((pointData: string[]) => ({
        time: pointData[0],
        data: pointData[1],
      }));

      cache.set(`stime=${stime}/etime=${etime}`, SeriesData);

      if (cache.size >= 2) {
        const firstCacheKey = cache.keys().next().value;

        cache.delete(firstCacheKey);
      }

      setData(SeriesData);
    }

    setHasFetchError(false);
    setFetchErrorCount(0);
  } catch (error) {
    console.error('Error fetching spot data:', error);
    setHasFetchError(true);
    setFetchErrorCount((errorCount) => errorCount + 1);
  }
}

export default getSeriesData;
