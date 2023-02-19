import { SeriesData } from '../customTypes';

interface ILineChart {
  sqlSeriesData: SeriesData | undefined;
}

function LineChart({ sqlSeriesData }: ILineChart) {
  return (
    <>
      <h3>Series 정보 조회</h3>
      <pre>{JSON.stringify(sqlSeriesData, null, 4)}</pre>
    </>
  );
}

export default LineChart;
