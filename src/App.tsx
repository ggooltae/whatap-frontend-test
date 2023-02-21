import { useEffect, useState, useRef } from 'react';

import Informatics from './components/Informatics';
import BarChart from './components/BarChart';
import LineChart from './components/LineChart';

import api from './api';
import { SpotData, ProjectData } from './customTypes';

import { TIME, SIZE } from './config/constants';

function App() {
  const [informData, setInformData] = useState<SpotData>({});
  const [activeData, setActiveData] = useState<SpotData>({});
  const [TPSData, setTPSData] = useState<ProjectData>([]);
  const TPSDataRef = useRef<ProjectData>([]);

  useEffect(() => {
    TPSDataRef.current = TPSData;
  }, [TPSData]);

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
    async function getProjectData(
      type: string,
      key: string,
      setState: React.Dispatch<React.SetStateAction<ProjectData>>,
    ) {
      const currentTime = Date.now();

      try {
        if (TPSDataRef.current.length === 0) {
          const newProjectData: ProjectData = [];

          for (let i = SIZE.PROJECT_DATA_SIZE_LIMIT; i > 0; i--) {
            const response = await api.project(
              `tag/${type}/${key}?stime={stime}&etime={etime}&timeMerge={timeMerge}`,
              {
                stime: (currentTime - TIME.INTERVAL_DELAY * i).toString(),
                etime: (currentTime - TIME.INTERVAL_DELAY * (i - 1)).toString(),
                timeMerge: 'avg',
              },
            );

            newProjectData.push({
              time: currentTime - TIME.INTERVAL_DELAY * (i - 1),
              data: response.data,
            });
          }

          setState(newProjectData);
        } else {
          const newProjectData: ProjectData = TPSDataRef.current.slice();
          const response = await api.project(
            `tag/${type}/${key}?stime={stime}&etime={etime}&timeMerge={timeMerge}`,
            {
              stime: (currentTime - TIME.INTERVAL_DELAY).toString(),
              etime: currentTime.toString(),
              timeMerge: 'avg',
            },
          );

          newProjectData.shift();
          newProjectData.push({
            time: currentTime,
            data: response.data,
          });

          setState(newProjectData);
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    }

    getSpotData(api.INFORM_KEYS, setInformData);
    getSpotData(api.ACTIVE_KEYS, setActiveData);
    getProjectData('app_counter', 'tps', setTPSData);

    const activeIntervalId = setInterval(
      () => getSpotData(api.ACTIVE_KEYS, setActiveData),
      TIME.INTERVAL_DELAY,
    );
    const seriesIntervalId = setInterval(
      () => getProjectData('app_counter', 'tps', setTPSData),
      TIME.INTERVAL_DELAY,
    );

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
      <LineChart TPSData={TPSData} />
    </div>
  );
}

export default App;
