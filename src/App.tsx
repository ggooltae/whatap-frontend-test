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
  const {
    data: appInformData,
    isError: isAppInformDataError,
    errorCount: appInformDataErrorCount,
  } = useSpotFetch({
    keys: api.APP_INFORM_KEYS,
    includeInterval: false,
  });
  const {
    data: cpuInformData,
    isPaused: isCpuDataIntervalPaused,
    isError: isCpuInformDataError,
    errorCount: cpuInformDataErrorCount,
    pauseInterval: pauseCpuDataInterval,
    resumeInterval: resumeCpuDataInterval,
  } = useSpotFetch({
    keys: api.CPU_USAGE_KEY,
    includeInterval: true,
  });

  const {
    data: activeStatusData,
    isPaused: isActiveStatusIntervalPaused,
    isError: isActiveStatusError,
    errorCount: activeStatusErrorCount,
    pauseInterval: pauseActiveStatusInterval,
    resumeInterval: resumeActiveStatusInterval,
  } = useSpotFetch({
    keys: api.ACTIVE_KEYS,
    includeInterval: true,
  });

  const {
    data: dbcStatusData,
    isPaused: isDbcStatusIntervalPaused,
    isError: isDbcStatusError,
    errorCount: dbcStatusErrorCount,
    pauseInterval: pauseDbcStatusInterval,
    resumeInterval: resumeDbcStatusInterval,
  } = useSpotFetch({
    keys: api.DBC_STATUS_KEYS,
    includeInterval: true,
  });

  const {
    data: TPSData,
    isPaused: isTPSIntervalPaused,
    isError: isTPSError,
    errorCount: TPSErrorCount,
    pauseInterval: pauseTPSInterval,
    resumeInterval: resumeTPSInterval,
  } = useProjectFetch({
    type: 'app_counter',
    key: 'tps',
    timeRange: TIME.MINUTE,
  });

  const {
    data: activeUserData,
    isPaused: isActiveUserIntervalPaused,
    isError: isActiveUserError,
    errorCount: activeUserErrorCount,
    pauseInterval: pauseActiveUserInterval,
    resumeInterval: resumeActiveUserInterval,
  } = useSeriesFetch({
    key: 'visitor_5m',
    intervalTime: 5 * TIME.MINUTE,
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
          errorCount={appInformDataErrorCount}
        />
        <Informatics
          title={'CPU Informatics'}
          gridArea={'c'}
          informData={cpuInformData}
          isPaused={isCpuDataIntervalPaused}
          isError={isCpuInformDataError}
          errorCount={cpuInformDataErrorCount}
          pauseInterval={pauseCpuDataInterval}
          resumeInterval={resumeCpuDataInterval}
        />
        <BarChart
          title={'Active Status'}
          gridArea={'d'}
          chartData={activeStatusData}
          isPaused={isActiveStatusIntervalPaused}
          isError={isActiveStatusError}
          errorCount={activeStatusErrorCount}
          pauseInterval={pauseActiveStatusInterval}
          resumeInterval={resumeActiveStatusInterval}
        />
        <BarChart
          title={'DB Connection Status'}
          gridArea={'e'}
          chartData={dbcStatusData}
          isPaused={isDbcStatusIntervalPaused}
          isError={isDbcStatusError}
          errorCount={dbcStatusErrorCount}
          pauseInterval={pauseDbcStatusInterval}
          resumeInterval={resumeDbcStatusInterval}
        />
        <LineChart
          title={'평균 TPS'}
          gridArea={'f'}
          chartData={TPSData}
          isPaused={isTPSIntervalPaused}
          isError={isTPSError}
          errorCount={TPSErrorCount}
          pauseInterval={pauseTPSInterval}
          resumeInterval={resumeTPSInterval}
        />
        <LineChart
          title={'Active User'}
          gridArea={'g'}
          chartData={activeUserData}
          isPaused={isActiveUserIntervalPaused}
          isError={isActiveUserError}
          errorCount={activeUserErrorCount}
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
  grid-gap: 0.5rem;
  grid-template-areas:
    'a a'
    'b c'
    'd e'
    'f g';
  padding: 2rem;

  @media screen and (max-width: 800px) {
    display: flex;
    flex-direction: column;
  }
`;

const Title = styled.h1`
  grid-area: a;
  text-align: center;
  margin-bottom: 2rem;
`;

export default App;
