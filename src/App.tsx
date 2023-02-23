import styled, { createGlobalStyle } from 'styled-components';

import Informatics from './components/Informatics';
import BarChart from './components/BarChart';
import LineChart from './components/LineChart';

import useSpotFetch from './hooks/useSpotFetch';
import useProjectFetch from './hooks/useProjectFetch';

import api from './api';
import { TIME } from './config/constants';

function App() {
  const { data: informData } = useSpotFetch({
    keys: api.INFORM_KEYS,
    intervalTime: TIME.INTERVAL_DELAY,
    includeInterval: false,
  });

  const {
    data: activeData,
    isPaused: isActiveIntervalPaused,
    pauseInterval: pauseActiveInterval,
    resumeInterval: resumeActiveInterval,
  } = useSpotFetch({
    keys: api.ACTIVE_KEYS,
    intervalTime: TIME.INTERVAL_DELAY,
    includeInterval: true,
  });

  const {
    data: TPSData,
    isPaused: isTPSIntervalPaused,
    pauseInterval: pauseTPSInterval,
    resumeInterval: resumeTPSInterval,
  } = useProjectFetch({
    type: 'app_counter',
    key: 'tps',
    intervalTime: TIME.INTERVAL_DELAY,
  });

  return (
    <>
      <Global />
      <GridContainer>
        <Title>Application Monitoring Dashboard</Title>
        <Informatics title={'Informatics'} informData={informData} />
        <BarChart
          title={'Active Status'}
          chartData={activeData}
          isPaused={isActiveIntervalPaused}
          pauseInterval={pauseActiveInterval}
          resumeInterval={resumeActiveInterval}
        />
        <LineChart
          title={'평균 TPS'}
          chartData={TPSData}
          isPaused={isTPSIntervalPaused}
          pauseInterval={pauseTPSInterval}
          resumeInterval={resumeTPSInterval}
        />
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
