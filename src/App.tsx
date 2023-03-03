import styled, { createGlobalStyle } from 'styled-components';

import Informatics from './components/Informatics';
import BarChart from './components/BarChart';
import LineChart from './components/LineChart';

import useFetch from './hooks/useFetch';

import api from './api';
import { IProjectFetch, ISeriesFetch, ISpotFetch } from './config/interfaces';
import { TIME } from './config/constants';

function App() {
  const {
    data: appInformData,
    isError: isAppInformDataError,
    errorCount: appInformDataErrorCount,
  } = useFetch<ISpotFetch>({
    fetchType: 'spot',
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
  } = useFetch<ISpotFetch>({
    fetchType: 'spot',
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
  } = useFetch<ISpotFetch>({
    fetchType: 'spot',
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
  } = useFetch<ISpotFetch>({
    fetchType: 'spot',
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
  } = useFetch<IProjectFetch>({
    fetchType: 'project',
    key: 'app_counter/tps',
    timeRange: TIME.MINUTE,
  });

  const {
    data: activeUserData,
    isPaused: isActiveUserIntervalPaused,
    isError: isActiveUserError,
    errorCount: activeUserErrorCount,
    pauseInterval: pauseActiveUserInterval,
    resumeInterval: resumeActiveUserInterval,
  } = useFetch<ISeriesFetch>({
    fetchType: 'series',
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
          informData={appInformData || []}
          isError={isAppInformDataError}
          errorCount={appInformDataErrorCount}
        />
        <Informatics
          title={'CPU Informatics'}
          gridArea={'c'}
          informData={cpuInformData || []}
          isPaused={isCpuDataIntervalPaused}
          isError={isCpuInformDataError}
          errorCount={cpuInformDataErrorCount}
          pauseInterval={pauseCpuDataInterval}
          resumeInterval={resumeCpuDataInterval}
        />
        <BarChart
          title={'Active Status'}
          gridArea={'d'}
          chartData={activeStatusData || []}
          isPaused={isActiveStatusIntervalPaused}
          isError={isActiveStatusError}
          errorCount={activeStatusErrorCount}
          pauseInterval={pauseActiveStatusInterval}
          resumeInterval={resumeActiveStatusInterval}
        />
        <BarChart
          title={'DB Connection Status'}
          gridArea={'e'}
          chartData={dbcStatusData || []}
          isPaused={isDbcStatusIntervalPaused}
          isError={isDbcStatusError}
          errorCount={dbcStatusErrorCount}
          pauseInterval={pauseDbcStatusInterval}
          resumeInterval={resumeDbcStatusInterval}
        />
        <LineChart
          title={'평균 TPS'}
          gridArea={'f'}
          chartData={TPSData || []}
          isPaused={isTPSIntervalPaused}
          isError={isTPSError}
          errorCount={TPSErrorCount}
          pauseInterval={pauseTPSInterval}
          resumeInterval={resumeTPSInterval}
        />
        <LineChart
          title={'Active User'}
          gridArea={'g'}
          chartData={activeUserData || []}
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
  min-width: 500px;

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
