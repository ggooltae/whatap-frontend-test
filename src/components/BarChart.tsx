import { useEffect, useRef } from 'react';
import { select } from 'd3-selection';
import { scaleLinear, scaleBand } from 'd3-scale';
import { axisLeft } from 'd3-axis';
import 'd3-transition';

import { SpotData } from '../customTypes';

interface IBarChart {
  activeData: SpotData;
}

function BarChart({ activeData }: IBarChart) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = select(svgRef.current);
    const svgWidth = svg.node()?.getBoundingClientRect().width || 0;
    const svgHeight = svg.node()?.getBoundingClientRect().height || 0;

    const keys = Object.keys(activeData);
    const values = Object.values(activeData);
    const margin = { top: 20, right: 20, bottom: 20, left: 50 };

    const bars = svg.selectAll('rect').data(values);
    const texts = svg.selectAll('.value-text').data(values);

    const xScale = scaleLinear()
      .domain([0, Math.max(...values)])
      .range([0, svgWidth - margin.left - margin.right]);
    const yScale = scaleBand()
      .domain(keys.map((key) => key.replace('act_', '').toUpperCase()))
      .range([margin.top, svgHeight - margin.bottom])
      .padding(0.1);

    const yAxis = axisLeft(yScale);

    if (svg.select('#yAxisGroup').empty()) {
      svg
        .append('g')
        .attr('id', 'yAxisGroup')
        .attr('transform', `translate(${margin.left},0)`)
        .call(yAxis);
    } else {
      svg
        .select<SVGGElement>('#yAxisGroup')
        .attr('transform', `translate(${margin.left},0)`)
        .call(yAxis);
    }

    bars
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

    texts
      .join('text')
      .attr('class', 'value-text')
      .attr(
        'y',
        (_, i) =>
          (yScale(keys[i].replace('act_', '').toUpperCase()) || 0) +
          yScale.bandwidth() * 0.8,
      )
      .attr('fill', 'red')
      .transition()
      .duration(1000)
      .text((d) => d)
      .attr('x', (d) => xScale(d) + margin.left + 5);
  }, [activeData]);

  return (
    <>
      <h3>Active Status</h3>
      <svg ref={svgRef}></svg>
    </>
  );
}

export default BarChart;
