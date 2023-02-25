import styled, { createGlobalStyle } from 'styled-components';

import Informatics from './components/Informatics';
import BarChart from './components/BarChart';
import LineChart from './components/LineChart';

import useSpotFetch from './hooks/useSpotFetch';
import useProjectFetch from './hooks/useProjectFetch';
import useSeriesFetch from './hooks/useSeriesFetch';

import api from './api';
import { TIME } from './config/constants';

function App() {
  const { data: appInformData, isError: isAppInformDataError } = useSpotFetch({
    keys: api.APP_INFORM_KEYS,
    includeInterval: false,
  });
  const { data: projectInformData, isError: isProjectInformDataError } =
    useSpotFetch({
      keys: api.DBC_INFORM_KEYS,
      intervalTime: 5 * TIME.SECOND,
      includeInterval: true,
    });

  const {
    data: activeStatusData,
    isPaused: isActiveStatusIntervalPaused,
    isError: isActiveStatusError,
    pauseInterval: pauseActiveStatusInterval,
    resumeInterval: resumeActiveStatusInterval,
  } = useSpotFetch({
    keys: api.ACTIVE_KEYS,
    intervalTime: 5 * TIME.SECOND,
    includeInterval: true,
  });

  const {
    data: TPSData,
    isPaused: isTPSIntervalPaused,
    isError: isTPSError,
    pauseInterval: pauseTPSInterval,
    resumeInterval: resumeTPSInterval,
  } = useProjectFetch({
    type: 'app_counter',
    key: 'tps',
    intervalTime: 5 * TIME.SECOND,
    timeRange: TIME.MINUTE,
  });

  const {
    data: activeUserData,
    isPaused: isActiveUserIntervalPaused,
    isError: isActiveUserError,
    pauseInterval: pauseActiveUserInterval,
    resumeInterval: resumeActiveUserInterval,
  } = useSeriesFetch({
    key: 'visitor_5m',
    intervalTime: TIME.MINUTE,
  });

  return (
    <>
      <Global />
      <GridContainer>
        <Title>Application Monitoring Dashboard</Title>
        <Informatics
          title={'App Informatics'}
          gridArea={'b'}
          informData={appInformData}
          isError={isAppInformDataError}
        />
        <Informatics
          title={'DBC Informatics'}
          gridArea={'c'}
          informData={projectInformData}
          isError={isProjectInformDataError}
        />
        <BarChart
          title={'Active Status'}
          gridArea={'d'}
          chartData={activeStatusData}
          isPaused={isActiveStatusIntervalPaused}
          isError={isActiveStatusError}
          pauseInterval={pauseActiveStatusInterval}
          resumeInterval={resumeActiveStatusInterval}
        />
        <LineChart
          title={'평균 TPS'}
          gridArea={'f'}
          chartData={TPSData}
          isPaused={isTPSIntervalPaused}
          isError={isTPSError}
          pauseInterval={pauseTPSInterval}
          resumeInterval={resumeTPSInterval}
        />
        <LineChart
          title={'Active User'}
          gridArea={'g'}
          chartData={activeUserData}
          isPaused={isActiveUserIntervalPaused}
          isError={isActiveUserError}
          pauseInterval={pauseActiveUserInterval}
          resumeInterval={resumeActiveUserInterval}
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
    'd e'
    'f g';
  padding: 3rem;
`;

const Title = styled.h1`
  grid-area: a;
  text-align: center;
  margin-bottom: 2rem;
`;

export default App;
