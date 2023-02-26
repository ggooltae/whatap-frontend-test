import styled from 'styled-components';

interface IErrorBoundary {
  message: string;
}

function ErrorBoundary({ message }: IErrorBoundary) {
  return <ErrorMessage>{message}</ErrorMessage>;
}

const ErrorMessage = styled.p`
  color: red;
`;

export default ErrorBoundary;
