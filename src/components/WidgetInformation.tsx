import styled from 'styled-components';

import { WidgetData } from '../config/types';
import { WIDGET_DESC } from '../config/widgetData';

interface IWidgetInformation {
  widgetKey: string;
}

function WidgetInformation({ widgetKey }: IWidgetInformation) {
  const widgetInfo: WidgetData = WIDGET_DESC[widgetKey];

  return (
    <Container>
      <Title>{widgetInfo.title}</Title>
      <Description>{widgetInfo.description}</Description>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  border-bottom: solid black 1px;
  width: 100%;
`;

const Description = styled.pre`
  font-family: inherit;
  line-height: 1.5;
  white-space: pre-wrap;
  width: 100%;
  height: 100%;
`;

export default WidgetInformation;
