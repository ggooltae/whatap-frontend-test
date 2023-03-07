import { useState } from 'react';
import styled from 'styled-components';

import Modal from './Modal';
import WidgetInformation from './WidgetInformation';

import { COLOR } from '../config/constants';

interface IInformationButton {
  widgetKey: string;
}

function InformationButton({ widgetKey }: IInformationButton) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {isModalOpen && (
        <Modal closeModal={() => setIsModalOpen(false)}>
          <WidgetInformation widgetKey={widgetKey} />
        </Modal>
      )}
      <Button onClick={() => setIsModalOpen(true)}>info</Button>
    </>
  );
}

const Button = styled.button`
  height: 1.3rem;
  margin: 0 0.5rem;
  outline: none;
  box-shadow: none;
  border: 1px solid gray;
  background-color: inherit;
  border-radius: 3px;

  &:hover {
    cursor: pointer;
    background-color: ${COLOR.LIGHT_GRAY};
    border-color: black;
  }
`;

export default InformationButton;
