import React from 'react';
import styled from 'styled-components';

import api from '../api';
import type { SpotData } from '../config/types';
import { IGridContainer } from '../config/interfaces';

import { MESSAGE } from '../config/constants';

interface IInformatics {
  title: string;
  gridArea: string;
  informData: SpotData;
  isError: boolean;
}

function Informatics({ title, gridArea, informData, isError }: IInformatics) {
  return (
    <Container gridArea={gridArea}>
      <h3>{title}</h3>
      {isError ? (
        <h2>{MESSAGE.FETCH_ERROR}</h2>
      ) : (
        Object.keys(informData).map((key) => (
          <div key={key}>{`${api.OPEN_API[''][key]}: ${informData[key]}`}</div>
        ))
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
