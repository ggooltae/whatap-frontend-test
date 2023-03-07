import React, { MouseEvent } from 'react';
import styled from 'styled-components';

import Portal from './Portal';

import { COLOR } from '../config/constants';

interface IModal {
  children: React.ReactNode;
  closeModal: () => void;
}

function Modal({ children, closeModal }: IModal) {
  function handleBackgroundClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;

    closeModal();
  }

  return (
    <Portal>
      <Background onClick={handleBackgroundClick}>
        <Content>{children}</Content>
      </Background>
    </Portal>
  );
}

const Background = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0px;
  left: 0px;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 50rem;
  height: 30rem;
  padding: 2rem;
  background-color: ${COLOR.LIGHT_GRAY};
  border-radius: 10px;
  box-shadow: 1px 1px 1px black;
  animation: smoothOpen 0.3s;

  @keyframes smoothOpen {
    from {
      opacity: 0;
      transform: translateY(100%);
    }
    to {
      opacity: 1;
      transform: translateY(0%);
    }
  }
`;

export default Modal;
