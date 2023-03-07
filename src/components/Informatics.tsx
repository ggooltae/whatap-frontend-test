import React from 'react';
import styled from 'styled-components';

import api from '../api';
import type { SpotData } from '../config/types';

interface IInformatics {
  informData: SpotData[] | undefined;
}

function Informatics({ informData = [] }: IInformatics) {
  return (
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
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Inform = styled.p`
  margin: 0.2rem 0;
`;

export default React.memo(Informatics);
