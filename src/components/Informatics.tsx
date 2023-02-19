import api from '../api';
import { SpotData } from '../customTypes';

interface IInformatics {
  informData: SpotData;
}

function Informatics({ informData }: IInformatics) {
  return (
    <>
      {Object.keys(informData).map((key) => (
        <div key={key}>{`${api.OPEN_API[''][key]}: ${informData[key]}`}</div>
      ))}
    </>
  );
}

export default Informatics;
