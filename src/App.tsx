import { useEffect, useState, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

import Informatics from './components/Informatics';
import BarChart from './components/BarChart';
import LineChart from './components/LineChart';

import api from './api';
import type { SpotData, ProjectData } from './customTypes';

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
    <>
      <Global />
      <GridContainer>
        <Title>Application Monitoring Dashboard</Title>
        <Informatics informData={informData} />
        <BarChart activeData={activeData} />
        <LineChart TPSData={TPSData} />
      </GridContainer>
    </>
  );
}

const Global = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
  }

  body {
    padding: 0rem;
    background-color: white;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr, 3fr, 3fr, 3fr;
  grid-gap: 0.5rem;
  grid-template-areas:
    'a a'
    'b c'
    'd d';
  padding: 3rem;
`;

const Title = styled.h1`
  grid-area: a;
  text-align: center;
  margin-bottom: 2rem;
`;

export default App;
