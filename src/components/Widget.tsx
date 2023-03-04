import styled from 'styled-components';

import { IGridContainer } from '../config/interfaces';

interface IWidget {
  gridArea: string;
  children: React.ReactNode;
}

function Widget({ gridArea, children }: IWidget) {
  return <Container gridArea={gridArea}>{children}</Container>;
}

const Container = styled.div<IGridContainer>`
  grid-area: ${(props) => props.gridArea};
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 1.5rem;
  border: 1px solid black;
  border-radius: 0.5rem;
`;

export default Widget;
