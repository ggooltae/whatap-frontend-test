import React from 'react';
import styled from 'styled-components';

import ErrorBoundary from './ErrorBoundary';

interface IWidgetBody {
  hasFetchError: boolean;
  fetchErrorCount: number;
  children?: React.ReactNode;
}

function WidgetBody({ hasFetchError, fetchErrorCount, children }: IWidgetBody) {
  return (
    <Container>
      <ErrorBoundary
        hasFetchError={hasFetchError}
        fetchErrorCount={fetchErrorCount}
      >
        {children}
      </ErrorBoundary>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  min-height: 3rem;
`;

export default WidgetBody;
