import styled from 'styled-components';

interface IIntervalControlButton {
  isPaused: boolean;
  resumeInterval: () => void;
  pauseInterval: () => void;
}

function IntervalControlButton({
  isPaused,
  resumeInterval,
  pauseInterval,
}: IIntervalControlButton) {
  function handleButtonClick() {
    isPaused ? resumeInterval() : pauseInterval();
  }

  return (
    <Button onClick={handleButtonClick}>{isPaused ? 'resume' : 'pause'}</Button>
  );
}

const Button = styled.button`
  &:hover {
    cursor: pointer;
  }
`;

export default IntervalControlButton;
