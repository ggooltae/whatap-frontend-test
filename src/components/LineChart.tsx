import React, { useEffect, useState, useRef } from 'react';
import { select } from 'd3-selection';
import { scaleLinear, scaleTime } from 'd3-scale';
import { axisLeft, axisBottom } from 'd3-axis';
import { line, area } from 'd3-shape';
import 'd3-transition';
import debounce from 'lodash/debounce';
import styled from 'styled-components';

import WidgetHeader from './WidgetHeader';
import ErrorBoundary from './ErrorBoundary';

import { SeriesData, PointTimeData } from '../config/types';
import { IGridContainer } from '../config/interfaces';

import { MESSAGE, TIME, COLOR } from '../config/constants';

interface ILineChart {
  title: string;
  gridArea: string;
  chartData: SeriesData;
  isPaused: boolean;
  isError: boolean;
  errorCount: number;
  pauseInterval: () => void;
  resumeInterval: () => void;
}

function LineChart({
  title,
  gridArea,
  chartData,
  isPaused,
  isError,
  errorCount,
  pauseInterval,
  resumeInterval,
}: ILineChart) {
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
    const margin = { top: 0, bottom: 20, left: 40, right: 20 };
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    const xScale = scaleTime()
      .domain([
        Math.min(...chartData.map((obj) => Number(obj.time))),
        Math.max(...chartData.map((obj) => Number(obj.time))),
      ])
      .range([0, chartWidth]);
    const yScale = scaleLinear()
      .domain([0, Math.max(...chartData.map((obj) => Number(obj.data))) * 1.2])
      .range([chartHeight, margin.bottom]);

    const valueLine = line<PointTimeData>()
      .x((d) => xScale(d.time))
      .y((d) => yScale(Number(d.data)));

    const fillArea = area<PointTimeData>()
      .x((d) => xScale(d.time))
      .y0(chartHeight)
      .y1((d) => yScale(Number(d.data)));

    svg
      .select('#linePath')
      .attr('transform', `translate(${margin.left},0)`)
      .data([chartData])
      .attr('fill', 'none')
      .attr('stroke', COLOR.BLUE)
      .attr('stroke-width', 1.5)
      .attr('d', valueLine);

    svg
      .select('#areaPath')
      .attr('transform', `translate(${margin.left},0)`)
      .data([chartData])
      .attr('fill', COLOR.BLUE)
      .attr('opacity', 0.1)
      .attr('d', fillArea);

    svg
      .select<SVGGElement>('#axisX')
      .attr('transform', `translate(${margin.left},${chartHeight})`)
      .call(axisBottom(xScale));

    svg
      .select<SVGGElement>('#axisY')
      .attr('transform', `translate(${margin.left},0)`)
      .call(axisLeft(yScale).ticks(5));
  }, [chartData, svgWidth, svgHeight]);

  return (
    <Container gridArea={gridArea} id="container">
      <WidgetHeader
        title={title}
        isPaused={isPaused}
        resumeInterval={resumeInterval}
        pauseInterval={pauseInterval}
      />
      {isError ? (
        <ErrorBoundary
          message={`${MESSAGE.FETCH_ERROR} (재시도 횟수: ${errorCount})`}
        />
      ) : (
        <SVG ref={svgRef}>
          <path id="linePath" />
          <path id="areaPath" />
          <g id="axisX" />
          <g id="axisY" />
        </SVG>
      )}
    </Container>
  );
}

const Container = styled.div<IGridContainer>`
  grid-area: ${(props) => props.gridArea};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  border: 1px solid black;
  border-radius: 0.5rem;
  background-color: white;
`;

const SVG = styled.svg`
  width: 100%;
`;

export default React.memo(LineChart);
