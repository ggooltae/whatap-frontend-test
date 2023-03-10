import React, { useEffect, useState, useRef } from 'react';
import { pointer, select } from 'd3-selection';
import { scaleLinear, scaleBand } from 'd3-scale';
import { axisLeft } from 'd3-axis';
import 'd3-transition';
import debounce from 'lodash/debounce';
import styled from 'styled-components';

import api from '../api';
import type { SpotData } from '../config/types';

import { TIME, COLOR } from '../config/constants';

interface IBarChart {
  chartData: SpotData[] | undefined;
}

function BarChart({ chartData = [] }: IBarChart) {
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
    const margin = { top: 20, right: 20, bottom: 0, left: 50 };

    const keyArray = chartData.map((spotData) => spotData.key);
    const dataArray = chartData.map((spotData) => Number(spotData.data));

    const xScale = scaleLinear()
      .domain([0, Math.max(...dataArray)])
      .range([0, svgWidth - margin.left - margin.right - 20]);
    const yScale = scaleBand()
      .domain(keyArray.map((key) => key.replace(/\w+_/, '').toUpperCase()))
      .range([margin.top, svgHeight - margin.bottom])
      .padding(0.1);

    tooltip.style('opacity', 0);

    svg
      .selectAll('rect')
      .data(chartData)
      .join('rect')
      .attr('x', margin.left)
      .attr(
        'y',
        (_, i) => yScale(keyArray[i].replace(/\w+_/, '').toUpperCase()) || 0,
      )
      .attr('fill', COLOR.BLUE)
      .attr('height', yScale.bandwidth())
      .transition()
      .duration(500)
      .attr('width', (d) => xScale(d.data));

    svg
      .selectAll('.value-text')
      .data(dataArray)
      .join('text')
      .attr('class', 'value-text')
      .attr(
        'y',
        (_, i) =>
          (yScale(keyArray[i].replace(/\w+_/, '').toUpperCase()) || 0) +
          yScale.bandwidth() / 2,
      )
      .attr('dy', '0.35em')
      .transition()
      .duration(500)
      .text((d) => d)
      .attr('x', (d) => xScale(d) + margin.left + 5);

    svg
      .select<SVGGElement>('#axisY')
      .attr('transform', `translate(${margin.left},0)`)
      .call(axisLeft(yScale));

    svg
      .selectAll<SVGRectElement, SpotData>('rect')
      .on('mousemove', function (event, d) {
        const [posX, posY] = pointer(event);

        select(this).attr('fill', COLOR.HOVER);
        tooltip
          .html(`${api.OPEN_API[''][d.key]}`)
          .style('left', `${posX + 10}px`)
          .style('top', `${posY + 10}px`)
          .style('opacity', 0.8);
      })
      .on('mouseover', function () {
        tooltip.style('opacity', 0.8);
      })
      .on('mouseout', function () {
        select(this).attr('fill', COLOR.BLUE);
        tooltip.style('opacity', 0);
      });

    return () => {
      svg.selectAll('rect').on('mousemove', null);
      svg.selectAll('rect').on('mouseover', null);
      svg.selectAll('rect').on('mouseout', null);
    };
  }, [chartData, svgWidth, svgHeight]);

  return (
    <Chart>
      <SVG ref={svgRef}>
        <g id="axisY" />
      </SVG>
      <Tooltip ref={tooltipRef} />
    </Chart>
  );
}

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
  font-size: 0.8rem;
  background-color: yellow;
  border-radius: 5px;
  width: 7.5rem;
  padding: 0.5rem;
  opacity: 0;
`;

export default React.memo(BarChart);
