import { useEffect, useState } from 'react';

import Informatics from './components/Informatics';
import BarChart from './components/BarChart';
import LineChart from './components/LineChart';

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
      try {
        const newSpotData: SpotData = {};

        for (const key of keys) {
          const fetchedData = await api.spot(key);

          newSpotData[fetchedData.key] = fetchedData.data;
        }

        setState(newSpotData);
      } catch (error) {
        console.error('Error fetching spot data:', error);
      }
    }
    async function getSeriesData() {
      try {
        const newSeriesData = await api.series('sql/{stime}/{etime}', {
          stime: (Date.now() - HOUR).toString(),
          etime: Date.now().toString(),
        });

        setSqlSeriesData(newSeriesData.data);
      } catch (error) {
        console.error('Error fetching series data:', error);
      }
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
      <Informatics informData={informData} />
      <BarChart activeData={activeData} />
      <LineChart sqlSeriesData={sqlSeriesData} />
    </div>
  );
}

export default App;
