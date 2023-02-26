import React from 'react';
import styled from 'styled-components';

import WidgetHeader from './WidgetHeader';
import ErrorBoundary from './ErrorBoundary';

import api from '../api';
import type { SpotData } from '../config/types';
import { IGridContainer } from '../config/interfaces';

import { MESSAGE } from '../config/constants';

interface IInformatics {
  title: string;
  gridArea: string;
  informData: SpotData;
  isError: boolean;
  errorCount: number;
  isPaused?: boolean;
  pauseInterval?: () => void;
  resumeInterval?: () => void;
}

function Informatics({
  title,
  gridArea,
  informData,
  isError,
  errorCount,
  isPaused,
  pauseInterval,
  resumeInterval,
}: IInformatics) {
  return (
    <Container gridArea={gridArea}>
      <WidgetHeader
        title={title}
        isPaused={isPaused}
        resumeInterval={resumeInterval}
        pauseInterval={pauseInterval}
      />
      {isError ? (
        <ErrorBoundary
          message={`${MESSAGE.FETCH_ERROR} (재시도 횟수: ${errorCount})`}
        />
      ) : (
        <InformContainer>
          {Object.keys(informData).map((key) => (
            <p key={key}>{`${api.OPEN_API[''][key]}: ${informData[key]}`}</p>
          ))}
        </InformContainer>
      )}
    </Container>
  );
}

const Container = styled.div<IGridContainer>`
  grid-area: ${(props) => props.gridArea};
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 1.5rem;
  border: 1px solid black;
  border-radius: 0.5rem;
`;

const InformContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
`;

export default React.memo(Informatics);
