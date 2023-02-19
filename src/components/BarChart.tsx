import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

import api from '../api';
import { SpotData } from '../customTypes';

interface IBarChart {
  activeData: SpotData;
}

function BarChart({ activeData }: IBarChart) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const keys = Object.keys(activeData);
    const values = Object.values(activeData);
    const rects = svg.selectAll('rect').data(values);
    const texts = svg.selectAll('text').data(values);

    rects
      .join('rect')
      .attr('x', 0)
      .attr('y', (_, i) => i * 25)
      .attr('fill', 'skyblue')
      .attr('height', 20)
      .transition()
      .duration(500)
      .attr('width', (d) => d * 30 + 5);

    texts
      .join('text')
      .attr('x', 5)
      .attr('y', (_, i) => i * 25 + 15)
      .attr('fill', 'black')
      .text(
        (d, i) =>
          `${api.OPEN_API[''][keys[i]].replace(/^액티브\s|\s수$/g, '')} (${d})`,
      );
  }, [activeData]);

  return (
    <>
      <h3>Active Status</h3>
      <svg ref={svgRef}></svg>
    </>
  );
}

export default BarChart;
