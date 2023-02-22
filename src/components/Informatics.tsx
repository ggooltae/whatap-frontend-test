import React from 'react';
import styled from 'styled-components';

import api from '../api';
import type { SpotData } from '../customTypes';

interface IInformatics {
  informData: SpotData;
}

function Informatics({ informData }: IInformatics) {
  return (
    <Container>
      <h3>Informatics</h3>
      {Object.keys(informData).map((key) => (
        <div key={key}>{`${api.OPEN_API[''][key]}: ${informData[key]}`}</div>
      ))}
    </Container>
  );
}

const Container = styled.div`
  grid-area: b;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 1rem;
  border: 1px solid black;
  border-radius: 0.5rem;
  background-color: white;
`;

export default React.memo(Informatics);
