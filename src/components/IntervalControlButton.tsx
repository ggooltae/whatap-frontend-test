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
    <button onClick={handleButtonClick}>{isPaused ? 'start' : 'stop'}</button>
  );
}

export default IntervalControlButton;
