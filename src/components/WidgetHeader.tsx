import React from 'react';
import styled from 'styled-components';
import isEqual from 'lodash/isEqual';

interface IWidgetHeader {
  title: string;
  children?: React.ReactNode;
}

function WidgetHeader({ title, children }: IWidgetHeader) {
  return (
    <Container>
      <h3>{title}</h3>
      {children}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 0.5rem;
`;

export default React.memo(WidgetHeader, (prev, curr) =>
  isEqual(prev.children, curr.children),
);
