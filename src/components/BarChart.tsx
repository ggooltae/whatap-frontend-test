import { useEffect, useRef } from 'react';
import { select } from 'd3-selection';
import { scaleLinear, scaleBand } from 'd3-scale';
import { axisLeft } from 'd3-axis';
import 'd3-transition';
import styled from 'styled-components';

import type { SpotData } from '../config/types';
import { IGridContainer } from '../config/interfaces';

interface IBarChart {
  title: string;
  gridArea: string;
  chartData: SpotData;
  isPaused: boolean;
  pauseInterval: () => void;
  resumeInterval: () => void;
}

function BarChart({
  title,
  gridArea,
  chartData,
  isPaused,
  pauseInterval,
  resumeInterval,
}: IBarChart) {
  const svgRef = useRef<SVGSVGElement>(null);

  function handleButtonClick() {
    isPaused ? resumeInterval() : pauseInterval();
  }

  useEffect(() => {
    const svg = select(svgRef.current);
    const svgWidth = svgRef.current?.clientWidth || 0;
    const svgHeight = svgRef.current?.clientHeight || 0;
    const margin = { top: 20, right: 20, bottom: 20, left: 50 };

    const keys = Object.keys(chartData);
    const values = Object.values(chartData);

    const xScale = scaleLinear()
      .domain([0, Math.max(...values)])
      .range([0, svgWidth - margin.left - margin.right - 10]);
    const yScale = scaleBand()
      .domain(keys.map((key) => key.replace('act_', '').toUpperCase()))
      .range([margin.top, svgHeight - margin.bottom])
      .padding(0.1);

    svg
      .selectAll('rect')
      .data(values)
      .join('rect')
      .attr('x', margin.left)
      .attr(
        'y',
        (_, i) => yScale(keys[i].replace('act_', '').toUpperCase()) || 0,
      )
      .attr('fill', 'steelblue')
      .attr('height', yScale.bandwidth())
      .transition()
      .duration(1000)
      .attr('width', (d) => xScale(d));

    svg
      .selectAll('.value-text')
      .data(values)
      .join('text')
      .attr('class', 'value-text')
      .attr(
        'y',
        (_, i) =>
          (yScale(keys[i].replace('act_', '').toUpperCase()) || 0) +
          yScale.bandwidth() * 0.8,
      )
      .attr('fill', 'black')
      .transition()
      .duration(1000)
      .text((d) => d)
      .attr('x', (d) => xScale(d) + margin.left + 5);

    svg
      .select<SVGGElement>('#axisY')
      .attr('transform', `translate(${margin.left},0)`)
      .call(axisLeft(yScale));
  }, [chartData]);

  return (
    <Container gridArea={gridArea}>
      <h3>{title}</h3>
      <button onClick={handleButtonClick}>{isPaused ? 'start' : 'stop'}</button>
      <SVG ref={svgRef}>
        <g id="axisY" />
      </SVG>
    </Container>
  );
}

const Container = styled.div<IGridContainer>`
  grid-area: ${(props) => props.gridArea};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border: 1px solid black;
  border-radius: 0.5rem;
  background-color: white;
`;

const SVG = styled.svg`
  width: 80%;
`;

export default BarChart;
