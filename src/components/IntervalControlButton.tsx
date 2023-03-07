import React from 'react';
import styled from 'styled-components';
import { BsFillPlayFill, BsFillPauseFill } from 'react-icons/bs';

import { COLOR } from '../config/constants';

interface IIntervalControlButton {
  isPaused: boolean;
  resumeInterval: () => void;
  pauseInterval: () => void;
}

interface IControlButton {
  backgroundColor: string;
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
    <ControlButton
      onClick={handleButtonClick}
      backgroundColor={isPaused ? COLOR.RED : COLOR.GREEN}
    >
      {isPaused ? <BsFillPlayFill /> : <BsFillPauseFill />}
    </ControlButton>
  );
}

const ControlButton = styled.button<IControlButton>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1.3rem;
  width: 2rem;
  outline: none;
  box-shadow: none;
  border: 1px solid gray;
  background-color: ${(props) => props.backgroundColor};
  color: ${COLOR.WHITE};
  border-radius: 3px;

  &:hover {
    cursor: pointer;
  }
`;

export default React.memo(IntervalControlButton);
