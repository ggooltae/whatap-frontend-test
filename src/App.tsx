import { useEffect, useState } from 'react';
import api from './api';

const HOUR = 1000 * 60 * 60;
const INTERVAL_DELAY = 5000;

type SpotData = Record<string, number>;
type SeriesData = {
  records: object[];
  total: number;
};

function App() {
  const [spotData, setSpotData] = useState<SpotData>();
  const [sqlSeries, setSqlSeries] = useState<SeriesData>();

  useEffect(() => {
    async function getSpotData() {
      const newSpotData: SpotData = {};

      for (const apiKey of api.API_KEYS) {
        const fetchedData = await api.spot(apiKey);

        newSpotData[fetchedData.key] = fetchedData.data;
      }

      setSpotData(newSpotData);
    }
    async function getSeriesData() {
      const newSeriesData = await api.series('sql/{stime}/{etime}', {
        stime: (Date.now() - HOUR).toString(),
        etime: Date.now().toString(),
      });

      setSqlSeries(newSeriesData.data);
    }

    getSpotData();
    getSeriesData();

    const spotIntervalId = setInterval(getSpotData, INTERVAL_DELAY);
    const seriesIntervalId = setInterval(getSeriesData, INTERVAL_DELAY);

    return function cleanUp() {
      clearInterval(spotIntervalId);
      clearInterval(seriesIntervalId);
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Application Monitoring Dashboard</h1>
      <h3>Spot 정보 조회</h3>
      <pre>{JSON.stringify(spotData, null, 4)}</pre>
      <hr />
      <h3>Series 정보 조회</h3>
      <pre>{JSON.stringify(sqlSeries, null, 4)}</pre>
    </div>
  );
}

export default App;
