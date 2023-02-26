import { useEffect, useState, useRef } from 'react';
import { select } from 'd3-selection';
import { scaleLinear, scaleBand } from 'd3-scale';
import { axisLeft } from 'd3-axis';
import 'd3-transition';
import debounce from 'lodash/debounce';
import styled from 'styled-components';

import ErrorBoundary from './ErrorBoundary';
import IntervalControlButton from './IntervalControlButton';

import type { SpotData } from '../config/types';
import { IGridContainer } from '../config/interfaces';

import { MESSAGE, TIME } from '../config/constants';

interface IBarChart {
  title: string;
  gridArea: string;
  chartData: SpotData;
  isPaused: boolean;
  isError: boolean;
  errorCount: number;
  pauseInterval: () => void;
  resumeInterval: () => void;
}

function BarChart({
  title,
  gridArea,
  chartData,
  isPaused,
  isError,
  errorCount,
  pauseInterval,
  resumeInterval,
}: IBarChart) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);

  function getSvgSize() {
    const newWidth = svgRef.current?.clientWidth || 0;
    setSvgWidth(newWidth);

    const newHeight = svgRef.current?.clientHeight || 0;
    setSvgHeight(newHeight);
  }

  useEffect(() => {
    const debouncedGetSvgSize = debounce(getSvgSize, TIME.RESIZE_DEBOUNCE_TIME);

    getSvgSize();
    window.addEventListener('resize', debouncedGetSvgSize);

    return () => window.removeEventListener('resize', debouncedGetSvgSize);
  }, []);

  useEffect(() => {
    const svg = select(svgRef.current);
    const margin = { top: 20, right: 20, bottom: 20, left: 50 };

    const keys = Object.keys(chartData);
    const values = Object.values(chartData);

    const xScale = scaleLinear()
      .domain([0, Math.max(...values)])
      .range([0, svgWidth - margin.left - margin.right - 20]);
    const yScale = scaleBand()
      .domain(keys.map((key) => key.replace(/\w+_/, '').toUpperCase()))
      .range([margin.top, svgHeight - margin.bottom])
      .padding(0.1);

    svg
      .selectAll('rect')
      .data(values)
      .join('rect')
      .attr('x', margin.left)
      .attr(
        'y',
        (_, i) => yScale(keys[i].replace(/\w+_/, '').toUpperCase()) || 0,
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
          (yScale(keys[i].replace(/\w+_/, '').toUpperCase()) || 0) +
          yScale.bandwidth() / 2,
      )
      .attr('dy', '0.35em')
      .transition()
      .duration(1000)
      .text((d) => d)
      .attr('x', (d) => xScale(d) + margin.left + 5);

    svg
      .select<SVGGElement>('#axisY')
      .attr('transform', `translate(${margin.left},0)`)
      .call(axisLeft(yScale));
  }, [chartData, svgWidth, svgHeight]);

  return (
    <Container gridArea={gridArea}>
      <h3>{title}</h3>
      {isError ? (
        <ErrorBoundary
          message={`${MESSAGE.FETCH_ERROR} (재시도 횟수: ${errorCount})`}
        />
      ) : (
        <>
          <IntervalControlButton
            isPaused={isPaused}
            resumeInterval={resumeInterval}
            pauseInterval={pauseInterval}
          />
          <SVG ref={svgRef}>
            <g id="axisY" />
          </SVG>
        </>
      )}
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
  width: 100%;
`;

export default BarChart;
