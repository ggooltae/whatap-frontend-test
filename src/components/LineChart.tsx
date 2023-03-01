import React, { useEffect, useState, useRef } from 'react';
import { pointer, select } from 'd3-selection';
import { scaleLinear, scaleTime } from 'd3-scale';
import { axisLeft, axisBottom } from 'd3-axis';
import { line, area } from 'd3-shape';
import { bisector } from 'd3-array';
import 'd3-transition';
import debounce from 'lodash/debounce';
import styled from 'styled-components';

import WidgetHeader from './WidgetHeader';
import ErrorBoundary from './ErrorBoundary';

import { PointTimeData } from '../config/types';
import { IGridContainer } from '../config/interfaces';

import { MESSAGE, TIME, COLOR } from '../config/constants';

interface ILineChart {
  title: string;
  gridArea: string;
  chartData: PointTimeData[];
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
  const tooltipRef = useRef(null);
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
    const tooltip = select(tooltipRef.current);
    const chartArea = svg.select('#chartArea');

    const margin = { top: 0, bottom: 20, left: 40, right: 20 };
    const chartWidth =
      svgWidth === 0 ? 0 : svgWidth - margin.left - margin.right;
    const chartHeight =
      svgHeight === 0 ? 0 : svgHeight - margin.top - margin.bottom;

    const xScale = scaleTime()
      .domain([
        Math.min(...chartData.map((obj) => Number(obj.time))),
        Math.max(...chartData.map((obj) => Number(obj.time))),
      ])
      .range([0, chartWidth]);
    const yScale = scaleLinear()
      .domain([0, Math.max(...chartData.map((obj) => Number(obj.data))) * 1.2])
      .range([chartHeight, margin.bottom]);

    const lineGenerator = line<PointTimeData>()
      .x((d) => xScale(d.time))
      .y((d) => yScale(Number(d.data)));

    const areaGenerator = area<PointTimeData>()
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
      .attr('d', lineGenerator);

    svg
      .select('#areaPath')
      .attr('transform', `translate(${margin.left},0)`)
      .data([chartData])
      .attr('fill', COLOR.BLUE)
      .attr('opacity', 0.1)
      .attr('d', areaGenerator);

    svg
      .selectAll('circle')
      .data(chartData)
      .join('circle')
      .attr('cx', (d) => xScale(new Date(d.time)) + margin.left)
      .attr('cy', (d) => yScale(Number(d.data)))
      .attr('r', 3)
      .attr('fill', COLOR.BLUE);

    svg
      .select<SVGGElement>('#axisX')
      .attr('transform', `translate(${margin.left},${chartHeight})`)
      .call(axisBottom(xScale));

    svg
      .select<SVGGElement>('#axisY')
      .attr('transform', `translate(${margin.left},0)`)
      .call(axisLeft(yScale).ticks(5));

    chartArea
      .attr('transform', `translate(${margin.left},0)`)
      .attr('width', chartWidth)
      .attr('height', chartHeight)
      .attr('opacity', 0)
      .on('mousemove', (event) => {
        const [posX, posY] = pointer(event);
        const invertedPosX = xScale.invert(posX);
        const bisect = bisector((d: PointTimeData) => d.time).left;
        const index = bisect(chartData, invertedPosX);

        if (index) {
          const leftPointer = chartData[index - 1];
          const rightPointer = chartData[index];
          const nearPointer =
            Number(invertedPosX) - leftPointer.time >
            rightPointer.time - Number(invertedPosX)
              ? rightPointer
              : leftPointer;

          svg
            .selectAll('circle')
            .attr('r', '3')
            .attr('fill', COLOR.BLUE)
            .filter((d) => d === nearPointer)
            .attr('r', '5')
            .attr('fill', COLOR.HOVER);

          tooltip
            .html(
              new Date(nearPointer.time).toLocaleDateString() +
                '<br/>' +
                new Date(nearPointer.time).toLocaleTimeString() +
                '<br/>' +
                '<span style="font-size: 1rem">' +
                nearPointer.data +
                '</span>',
            )
            .style('left', `${posX + 50}px`)
            .style('top', `${posY + 10}px`);
        }
      })
      .on('mouseover', () => {
        tooltip.style('opacity', 0.8);
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0);
        svg.selectAll('circle').attr('r', '3').attr('fill', COLOR.BLUE);
      });

    return () => {
      chartArea.on('mousemove', null);
      chartArea.on('mouseover', null);
      chartArea.on('mouseout', null);
    };
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
        <Chart>
          <SVG ref={svgRef}>
            <path id="linePath" />
            <path id="areaPath" />
            <rect id="chartArea" />
            <g id="axisX" />
            <g id="axisY" />
          </SVG>
          <Tooltip ref={tooltipRef} />
        </Chart>
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

const Chart = styled.div`
  position: relative;
  width: 100%;
`;

const SVG = styled.svg`
  width: 100%;
`;

const Tooltip = styled.div`
  position: absolute;
  text-align: center;
  font-size: 0.5rem;
  width: 80px;
  background-color: yellow;
  border-radius: 5px;
  padding: 0.5rem;
  opacity: 0;
`;

export default React.memo(LineChart);
