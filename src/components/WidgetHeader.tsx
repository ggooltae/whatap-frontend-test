import styled from 'styled-components';

import IntervalControlButton from './IntervalControlButton';

interface IWidgetHeader {
  title: string;
  isPaused?: boolean;
  pauseInterval?: () => void;
  resumeInterval?: () => void;
}

function WidgetHeader({
  title,
  isPaused,
  pauseInterval,
  resumeInterval,
}: IWidgetHeader) {
  return (
    <Container>
      <h3>{title}</h3>
      {isPaused !== undefined && resumeInterval && pauseInterval ? (
        <IntervalControlButton
          isPaused={isPaused}
          resumeInterval={resumeInterval}
          pauseInterval={pauseInterval}
        />
      ) : (
        <></>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 0.5rem;
`;

export default WidgetHeader;
