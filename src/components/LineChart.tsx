import { useEffect, useRef } from 'react';
import { select } from 'd3-selection';
import { scaleLinear, scaleTime } from 'd3-scale';
import { axisLeft, axisBottom } from 'd3-axis';
import { line } from 'd3-shape';
import 'd3-transition';
import styled from 'styled-components';

import IntervalControlButton from './IntervalControlButton';

import { SeriesData, PointTimeData } from '../config/types';
import { IGridContainer } from '../config/interfaces';

import { MESSAGE } from '../config/constants';

interface ILineChart {
  title: string;
  gridArea: string;
  chartData: SeriesData;
  isPaused: boolean;
  isError: boolean;
  pauseInterval: () => void;
  resumeInterval: () => void;
}

function LineChart({
  title,
  gridArea,
  chartData,
  isPaused,
  isError,
  pauseInterval,
  resumeInterval,
}: ILineChart) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = select(svgRef.current);
    const svgWidth = svgRef.current?.clientWidth || 0;
    const svgHeight = svgRef.current?.clientHeight || 0;
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
      .domain([
        Math.min(...chartData.map((obj) => Number(obj.data))) * 0.8,
        Math.max(...chartData.map((obj) => Number(obj.data))) * 1.2,
      ])
      .range([chartHeight, margin.bottom]);

    const valueLine = line<PointTimeData>()
      .x((d) => xScale(d.time))
      .y((d) => yScale(Number(d.data)));

    svg
      .select('#chart')
      .attr('transform', `translate(${margin.left},0)`)
      .data([chartData])
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', valueLine);

    svg
      .select<SVGGElement>('#axisX')
      .attr('transform', `translate(${margin.left},${chartHeight})`)
      .call(axisBottom(xScale));

    svg
      .select<SVGGElement>('#axisY')
      .attr('transform', `translate(${margin.left},0)`)
      .call(axisLeft(yScale));
  }, [chartData]);

  return (
    <Container gridArea={gridArea}>
      <h3>{title}</h3>
      {isError ? (
        <h2>{MESSAGE.FETCH_ERROR}</h2>
      ) : (
        <>
          <IntervalControlButton
            isPaused={isPaused}
            resumeInterval={resumeInterval}
            pauseInterval={pauseInterval}
          />{' '}
          <SVG ref={svgRef}>
            <path id="chart" />
            <g id="axisX" />
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
  justify-content: center;
  align-items: center;
  padding: 1rem;
  border: 1px solid black;
  border-radius: 0.5rem;
  background-color: white;
`;

const SVG = styled.svg`
  width: 80%;
`;

export default LineChart;
