import styled from 'styled-components';

interface IErrorMessage {
  message: string;
}

function ErrorMessage({ message }: IErrorMessage) {
  return <Message>{message}</Message>;
}

const Message = styled.p`
  color: red;
`;

export default ErrorMessage;
