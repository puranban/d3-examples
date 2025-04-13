import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { LineData, TooltipProps } from '../types';
import Tooltip from './Tooltip';

interface Props {
  data: LineData[];
  width: number;
  height: number;
}

const LineChart: React.FC<Props> = ({ data, width, height, }) => {
  const svgRef = useRef(null);
  const [tooltip, setTooltip] = useState<TooltipProps>({
    x: 0,
    y: 0,
    content: '',
    visible: false,
  });

  useEffect(
    () => {
      if (!data || data.length === 0 || !svgRef.current) {
        return;
      }

      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      // Set dimension and margins for the charts
      const margin = {
        top: 30,
        right: 30,
        bottom: 50,
        left: 60
      };
      const innerWidth = width - margin.left -margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      // set up the X scale and domain
      const x = d3.scaleLinear()
      .domain(d3.extent(data, d => new Date(d.date).getHours()
      ) as [number, number])
      .range([0, innerWidth]);

      // set up the Y scale and domain
      const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.temperature) || 0])
      .nice()
      .range([innerHeight, 0]);

      // create the line generator
      const line = d3.line<LineData>()
      .x(d => x(new Date(d.date).getHours()))
      .y(d => y(d.temperature))
      .curve(d3.curveMonotoneX);

      const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

      // add the X axis
      g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end");

      // add the Y axis
      g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(5))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Value");

      // draw the line
      g.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2);

      // Add data points
      g.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(new Date(d.date).getHours()))
        .attr("cy", d => y(d.temperature))
        .attr("r", 5)
        .attr("fill", "steelblue")
        .on("mouseover", function(event: MouseEvent, d: LineData) {
          d3.select(this).attr("fill", "orange");
          setTooltip({
            x: event.pageX,
            y: event.pageY,
            content: `${d.date}: ${d.temperature} Celsius`,
            visible: true
          });
        })
        .on("mouseout", function() {
          d3.select(this).attr("fill", "steelblue");
          setTooltip(prev => ({ ...prev, visible: false }));
        });
    },
    [data, height, width],
  );

  return (
    <>
      <svg ref={svgRef} width={width} height={height} />
      <Tooltip {...tooltip} />
    </>
  );
};

export default LineChart;
