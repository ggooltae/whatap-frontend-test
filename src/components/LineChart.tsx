import { useEffect, useRef } from 'react';
import { select } from 'd3-selection';
import { scaleLinear, scaleTime } from 'd3-scale';
import { axisLeft, axisBottom } from 'd3-axis';
import { line } from 'd3-shape';
import 'd3-transition';

import { ProjectData, TimeData } from '../customTypes';

interface ILineChart {
  TPSData: ProjectData;
}

function LineChart({ TPSData }: ILineChart) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = select(svgRef.current);
    const svgWidth = svgRef.current?.clientWidth || 0;
    const svgHeight = svgRef.current?.clientHeight || 0;
    const margin = { top: 0, bottom: 20, left: 30, right: 20 };
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    const xScale = scaleTime()
      .domain([
        Math.min(...TPSData.map((obj) => Number(obj.time))),
        Math.max(...TPSData.map((obj) => Number(obj.time))),
      ])
      .range([0, chartWidth]);
    const yScale = scaleLinear()
      .domain([0, Math.max(...TPSData.map((obj) => Number(obj.data)))])
      .range([chartHeight, margin.bottom]);

    const valueLine = line<TimeData>()
      .x((d) => xScale(d.time))
      .y((d) => yScale(Number(d.data)));

    svg
      .select('#chart')
      .attr('transform', `translate(${margin.left},0)`)
      .data([TPSData])
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
  }, [TPSData]);

  return (
    <>
      <h3>평균 TPS</h3>
      <svg ref={svgRef} width="800" height="300">
        <path id="chart" />
        <g id="axisX" />
        <g id="axisY" />
      </svg>
    </>
  );
}

export default LineChart;
