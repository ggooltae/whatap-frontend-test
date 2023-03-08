import React from 'react';

import ErrorMessage from './ErrorMessage';

import { MESSAGE } from '../config/constants';

interface IErrorBoundary {
  hasFetchError?: boolean;
  fetchErrorCount?: number;
  children: React.ReactNode;
}

interface IState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<IErrorBoundary, IState> {
  constructor(props: IErrorBoundary) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.setState({ error });
  }

  componentDidUpdate(_: IErrorBoundary, prevState: IState) {
    if (prevState.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.props.hasFetchError) {
      return (
        <ErrorMessage
          message={`${MESSAGE.FETCH_ERROR} (재시도 횟수: ${this.props.fetchErrorCount})`}
        />
      );
    }

    if (this.state.hasError) {
      return <ErrorMessage message={`에러 발생, ${this.state.error}`} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
