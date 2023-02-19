import { useEffect, useState } from 'react';

import Informatics from './components/Informatics';

import api from './api';
import { SpotData, SeriesData } from './customTypes';

const HOUR = 1000 * 60 * 60;
const INTERVAL_DELAY = 5000;

function App() {
  const [informData, setInformData] = useState<SpotData>({});
  const [activeData, setActiveData] = useState<SpotData>({});
  const [sqlSeriesData, setSqlSeriesData] = useState<SeriesData>();

  useEffect(() => {
    async function getSpotData(
      keys: string[],
      setState: React.Dispatch<React.SetStateAction<SpotData>>,
    ) {
      const newSpotData: SpotData = {};

      for (const key of keys) {
        const fetchedData = await api.spot(key);

        newSpotData[fetchedData.key] = fetchedData.data;
      }

      setState(newSpotData);
    }
    async function getSeriesData() {
      const newSeriesData = await api.series('sql/{stime}/{etime}', {
        stime: (Date.now() - HOUR).toString(),
        etime: Date.now().toString(),
      });

      setSqlSeriesData(newSeriesData.data);
    }

    getSpotData(api.INFORM_KEYS, setInformData);
    getSpotData(api.ACTIVE_KEYS, setActiveData);
    getSeriesData();

    const activeIntervalId = setInterval(
      () => getSpotData(api.ACTIVE_KEYS, setActiveData),
      INTERVAL_DELAY,
    );
    const seriesIntervalId = setInterval(getSeriesData, INTERVAL_DELAY);

    return function cleanUp() {
      clearInterval(activeIntervalId);
      clearInterval(seriesIntervalId);
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Application Monitoring Dashboard</h1>
      <h3>Informatics</h3>
      <Informatics informData={informData} />
      <h3>Active 정보 조회</h3>
      <pre>{JSON.stringify(activeData, null, 4)}</pre>
      <hr />
      <h3>Series 정보 조회</h3>
      <pre>{JSON.stringify(sqlSeriesData, null, 4)}</pre>
    </div>
  );
}

export default App;
