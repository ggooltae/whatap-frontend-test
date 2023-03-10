import api from '../api';
import { SpotData } from '../config/types';
import { TIME } from '../config/constants';

interface IGetSpotData {
  keys: string[];
  includeInterval: boolean;
  setData: React.Dispatch<React.SetStateAction<SpotData[]>>;
  setHasFetchError: React.Dispatch<React.SetStateAction<boolean>>;
  setFetchErrorCount: React.Dispatch<React.SetStateAction<number>>;
}

async function getSpotData({
  keys,
  includeInterval,
  setData,
  setHasFetchError,
  setFetchErrorCount,
}: IGetSpotData) {
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
    setHasFetchError(false);
    setFetchErrorCount(0);
  } catch (error) {
    console.error('Error fetching spot data:', error);
    setHasFetchError(true);
    setFetchErrorCount((errorCount) => errorCount + 1);

    if (!includeInterval) {
      setTimeout(
        () =>
          getSpotData({
            keys,
            includeInterval,
            setData,
            setHasFetchError,
            setFetchErrorCount,
          }),
        5 * TIME.SECOND,
      );
    }
  }
}

export default getSpotData;
