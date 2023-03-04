import styled, { createGlobalStyle } from 'styled-components';

import Widget from './components/Widget';
import WidgetHeader from './components/WidgetHeader';
import IntervalControlButton from './components/IntervalControlButton';
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
        <Widget gridArea="b">
          <WidgetHeader title="App Informatics" />
          <Informatics
            informData={appInformData || []}
            isError={isAppInformDataError}
            errorCount={appInformDataErrorCount}
          />
        </Widget>
        <Widget gridArea="c">
          <WidgetHeader title="CPU Informatics">
            <IntervalControlButton
              isPaused={isCpuDataIntervalPaused}
              pauseInterval={pauseCpuDataInterval}
              resumeInterval={resumeCpuDataInterval}
            />
          </WidgetHeader>
          <Informatics
            informData={cpuInformData || []}
            isError={isCpuInformDataError}
            errorCount={cpuInformDataErrorCount}
          />
        </Widget>
        <Widget gridArea="d">
          <WidgetHeader title="Active Status">
            <IntervalControlButton
              isPaused={isActiveStatusIntervalPaused}
              pauseInterval={pauseActiveStatusInterval}
              resumeInterval={resumeActiveStatusInterval}
            />
          </WidgetHeader>
          <BarChart
            chartData={activeStatusData || []}
            isError={isActiveStatusError}
            errorCount={activeStatusErrorCount}
          />
        </Widget>
        <Widget gridArea="e">
          <WidgetHeader title="DB Connection Status">
            <IntervalControlButton
              isPaused={isDbcStatusIntervalPaused}
              pauseInterval={pauseDbcStatusInterval}
              resumeInterval={resumeDbcStatusInterval}
            />
          </WidgetHeader>
          <BarChart
            chartData={dbcStatusData || []}
            isError={isDbcStatusError}
            errorCount={dbcStatusErrorCount}
          />
        </Widget>
        <Widget gridArea="f">
          <WidgetHeader title="평균 TPS">
            <IntervalControlButton
              isPaused={isTPSIntervalPaused}
              pauseInterval={pauseTPSInterval}
              resumeInterval={resumeTPSInterval}
            />
          </WidgetHeader>
          <LineChart
            chartData={TPSData || []}
            isError={isTPSError}
            errorCount={TPSErrorCount}
          />
        </Widget>
        <Widget gridArea="g">
          <WidgetHeader title="Active User">
            <IntervalControlButton
              isPaused={isActiveUserIntervalPaused}
              pauseInterval={pauseActiveUserInterval}
              resumeInterval={resumeActiveUserInterval}
            />
          </WidgetHeader>
          <LineChart
            chartData={activeUserData || []}
            isError={isActiveUserError}
            errorCount={activeUserErrorCount}
          />
        </Widget>
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
