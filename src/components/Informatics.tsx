import React from 'react';

import api from '../api';
import { SpotData } from '../customTypes';

interface IInformatics {
  informData: SpotData;
}

function Informatics({ informData }: IInformatics) {
  return (
    <>
      <h3>Informatics</h3>
      {Object.keys(informData).map((key) => (
        <div key={key}>{`${api.OPEN_API[''][key]}: ${informData[key]}`}</div>
      ))}
    </>
  );
}

export default React.memo(Informatics);
