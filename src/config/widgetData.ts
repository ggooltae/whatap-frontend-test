import { WidgetData } from './types';

export const WIDGET_DESC: Record<string, WidgetData> = Object.freeze({
  act_stat: {
    title: 'Active Status',
    description: `활성화상태의 액티브 트랜잭션들을 각 상태별로 갯수를 보여줍니다.

    - METHOD:	메소드를 수행중인 상태
    - SQL:	SQL을 수행중인 상태
    - HTTPC:	외부 API 호출 상태
    - DBC:	트랜잭션이 Connection Pool로 부터 새로운 Connection을 획득(get)하려는 상태
    - SOCKET:	외부로 TCP Socket을 연결 중인 상태`,
  },
  db_conn: {
    title: 'DB Connection Status',
    description: `전체 DB Connection 수, 활성 DB Connection 수, 비활성 DB Connection 수를 시각화 한 차트입니다.`,
  },
  avg_tps: {
    title: '평균 TPS(Transaction Per Second)',
    description:
      '5초 간격의 평균 TPS 데이터를 1분간 측정하여 시각화한 차트입니다.',
  },
  act_user: {
    title: 'Active User',
    description:
      '5분 간격의 액티브 사용자 데이터를 1시간동안 측정하여 시각화한 차트입니다.',
  },
});
