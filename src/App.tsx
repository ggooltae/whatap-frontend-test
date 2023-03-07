import styled, { createGlobalStyle } from 'styled-components';

import Widget from './components/Widget';
import WidgetHeader from './components/WidgetHeader';
import IntervalControlButton from './components/IntervalControlButton';
import WidgetBody from './components/WidgetBody';
import Informatics from './components/Informatics';
import BarChart from './components/BarChart';
import LineChart from './components/LineChart';

import useMessageQueue from './hooks/useMessageQueue';
import useFetch from './hooks/useFetch';

import api from './api';
import { IProjectFetch, ISeriesFetch, ISpotFetch } from './config/interfaces';
import { TIME } from './config/constants';

function App() {
  const addMessageQueue = useMessageQueue();

  const {
    data: appInformData,
    hasFetchError: hasAppInformDataError,
    fetchErrorCount: appInformDataErrorCount,
  } = useFetch<ISpotFetch>({
    fetchType: 'spot',
    keys: api.APP_INFORM_KEYS,
    includeInterval: false,
    addMessageQueue,
  });
  const {
    data: cpuInformData,
    isPaused: isCpuDataIntervalPaused,
    hasFetchError: hasCpuInformDataError,
    fetchErrorCount: cpuInformDataErrorCount,
    pauseInterval: pauseCpuDataInterval,
    resumeInterval: resumeCpuDataInterval,
  } = useFetch<ISpotFetch>({
    fetchType: 'spot',
    keys: api.CPU_USAGE_KEY,
    includeInterval: true,
    addMessageQueue,
  });

  const {
    data: activeStatusData,
    isPaused: isActiveStatusIntervalPaused,
    hasFetchError: hasActiveStatusError,
    fetchErrorCount: activeStatusErrorCount,
    pauseInterval: pauseActiveStatusInterval,
    resumeInterval: resumeActiveStatusInterval,
  } = useFetch<ISpotFetch>({
    fetchType: 'spot',
    keys: api.ACTIVE_KEYS,
    includeInterval: true,
    addMessageQueue,
  });

  const {
    data: dbcStatusData,
    isPaused: isDbcStatusIntervalPaused,
    hasFetchError: hasDbcStatusError,
    fetchErrorCount: dbcStatusErrorCount,
    pauseInterval: pauseDbcStatusInterval,
    resumeInterval: resumeDbcStatusInterval,
  } = useFetch<ISpotFetch>({
    fetchType: 'spot',
    keys: api.DBC_STATUS_KEYS,
    includeInterval: true,
    addMessageQueue,
  });

  const {
    data: TPSData,
    isPaused: isTPSIntervalPaused,
    hasFetchError: hasTPSError,
    fetchErrorCount: TPSErrorCount,
    pauseInterval: pauseTPSInterval,
    resumeInterval: resumeTPSInterval,
  } = useFetch<IProjectFetch>({
    fetchType: 'project',
    key: 'app_counter/tps',
    timeRange: TIME.MINUTE,
    includeInterval: true,
    addMessageQueue,
  });

  const {
    data: activeUserData,
    isPaused: isActiveUserIntervalPaused,
    hasFetchError: hasActiveUserError,
    fetchErrorCount: activeUserErrorCount,
    pauseInterval: pauseActiveUserInterval,
    resumeInterval: resumeActiveUserInterval,
  } = useFetch<ISeriesFetch>({
    fetchType: 'series',
    key: 'visitor_5m',
    intervalTime: 5 * TIME.MINUTE,
    includeInterval: true,
    addMessageQueue,
  });

  return (
    <>
      <Global />
      <GridContainer>
        <Title>Application Monitoring Dashboard</Title>
        <Widget gridArea="b">
          <WidgetHeader title="App Informatics" />
          <WidgetBody
            hasFetchError={hasAppInformDataError}
            fetchErrorCount={appInformDataErrorCount}
          >
            <Informatics informData={appInformData} />
          </WidgetBody>
        </Widget>
        <Widget gridArea="c">
          <WidgetHeader title="CPU Informatics">
            <IntervalControlButton
              isPaused={isCpuDataIntervalPaused}
              pauseInterval={pauseCpuDataInterval}
              resumeInterval={resumeCpuDataInterval}
            />
          </WidgetHeader>
          <WidgetBody
            hasFetchError={hasCpuInformDataError}
            fetchErrorCount={cpuInformDataErrorCount}
          >
            <Informatics informData={cpuInformData} />
          </WidgetBody>
        </Widget>
        <Widget gridArea="d">
          <WidgetHeader title="Active Status">
            <IntervalControlButton
              isPaused={isActiveStatusIntervalPaused}
              pauseInterval={pauseActiveStatusInterval}
              resumeInterval={resumeActiveStatusInterval}
            />
          </WidgetHeader>
          <WidgetBody
            hasFetchError={hasActiveStatusError}
            fetchErrorCount={activeStatusErrorCount}
          >
            <BarChart chartData={activeStatusData} />
          </WidgetBody>
        </Widget>
        <Widget gridArea="e">
          <WidgetHeader title="DB Connection Status">
            <IntervalControlButton
              isPaused={isDbcStatusIntervalPaused}
              pauseInterval={pauseDbcStatusInterval}
              resumeInterval={resumeDbcStatusInterval}
            />
          </WidgetHeader>
          <WidgetBody
            hasFetchError={hasDbcStatusError}
            fetchErrorCount={dbcStatusErrorCount}
          >
            <BarChart chartData={dbcStatusData} />
          </WidgetBody>
        </Widget>
        <Widget gridArea="f">
          <WidgetHeader title="평균 TPS">
            <IntervalControlButton
              isPaused={isTPSIntervalPaused}
              pauseInterval={pauseTPSInterval}
              resumeInterval={resumeTPSInterval}
            />
          </WidgetHeader>
          <WidgetBody
            hasFetchError={hasTPSError}
            fetchErrorCount={TPSErrorCount}
          >
            <LineChart chartData={TPSData} />
          </WidgetBody>
        </Widget>
        <Widget gridArea="g">
          <WidgetHeader title="Active User">
            <IntervalControlButton
              isPaused={isActiveUserIntervalPaused}
              pauseInterval={pauseActiveUserInterval}
              resumeInterval={resumeActiveUserInterval}
            />
          </WidgetHeader>
          <WidgetBody
            hasFetchError={hasActiveUserError}
            fetchErrorCount={activeUserErrorCount}
          >
            <LineChart chartData={activeUserData} />
          </WidgetBody>
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
