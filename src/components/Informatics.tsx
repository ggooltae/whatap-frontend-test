import React from 'react';
import styled from 'styled-components';

import IntervalControlButton from './IntervalControlButton';

import api from '../api';
import type { SpotData } from '../config/types';
import { IGridContainer } from '../config/interfaces';

import { MESSAGE } from '../config/constants';

interface IInformatics {
  title: string;
  gridArea: string;
  informData: SpotData;
  isError: boolean;
  isPaused?: boolean;
  pauseInterval?: () => void;
  resumeInterval?: () => void;
}

function Informatics({
  title,
  gridArea,
  informData,
  isError,
  isPaused,
  pauseInterval,
  resumeInterval,
}: IInformatics) {
  return (
    <Container gridArea={gridArea}>
      <h3>{title}</h3>
      {isError ? (
        <h2>{MESSAGE.FETCH_ERROR}</h2>
      ) : (
        <>
          {isPaused !== undefined && resumeInterval && pauseInterval ? (
            <IntervalControlButton
              isPaused={isPaused}
              resumeInterval={resumeInterval}
              pauseInterval={pauseInterval}
            />
          ) : (
            <></>
          )}

          {Object.keys(informData).map((key) => (
            <div
              key={key}
            >{`${api.OPEN_API[''][key]}: ${informData[key]}`}</div>
          ))}
        </>
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
  padding: 1rem;
  border: 1px solid black;
  border-radius: 0.5rem;
`;

export default React.memo(Informatics);
