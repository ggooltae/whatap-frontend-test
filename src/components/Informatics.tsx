import React from 'react';
import styled from 'styled-components';

import ErrorBoundary from './ErrorBoundary';

import api from '../api';
import type { SpotData } from '../config/types';

import { MESSAGE } from '../config/constants';

interface IInformatics {
  informData: SpotData[] | undefined;
  isError: boolean;
  errorCount: number;
}

function Informatics({ informData = [], isError, errorCount }: IInformatics) {
  return isError ? (
    <ErrorBoundary
      message={`${MESSAGE.FETCH_ERROR} (재시도 횟수: ${errorCount})`}
    />
  ) : (
    <InformContainer>
      {informData.map((spotData, i) => (
        <Inform key={spotData.key}>{`${api.OPEN_API[''][spotData.key]}: ${
          informData[i].data
        }`}</Inform>
      ))}
    </InformContainer>
  );
}

const InformContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
`;

const Inform = styled.p`
  margin: 0.2rem 0;
`;

export default React.memo(Informatics);
