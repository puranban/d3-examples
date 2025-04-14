import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { LineData, TooltipProps } from '@/types';
import Tooltip from './Tooltip';

interface Props {
  data: LineData[];
  width: number;
  height: number;
}

const LineChart: React.FC<Props> = ({ data, width, height, }) => {
  const svgRef = useRef<SVGSVGElement>(null);
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
      const margin = { top: 30, right: 30, bottom: 50, left: 60 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      // Parse dates and extract unique days
      const parseTime = d3.timeParse("%Y-%m-%dT%H:%M");
      const parsedData = data.map((d) => ({
        ...d,
        parsedTime: parseTime(d.date),
        date: d.date.split('T')[0], // Extract date part
        hour: d.date.split('T')[1].substring(0, 5) // Extract hour part
      }));

      const uniqueDates = Array.from(new Set(parsedData.map(d => d.date)));

      // X scale (time of day)
      const x = d3.scaleTime()
      .domain([new Date().setHours(0, 0, 0, 0), new Date().setHours(24, 0, 0, 0)])
      .range([0, innerWidth]);

      // Y scale (temperature)
      const y = d3.scaleLinear()
      .domain([d3.min(parsedData, d => d.temperature) || 0, 
        d3.max(parsedData, d => d.temperature) || 30])
      .nice()
      .range([innerHeight, 0]);

      // Color scale for different days
      const color = d3.scaleOrdinal<string>()
      .domain(uniqueDates)
      .range(d3.schemeCategory10);

      // Create SVG group
      const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

      // Add grid lines
      g.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x)
          .tickSize(-innerHeight)
          .tickFormat(() => "")
        );

      g.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y)
          .tickSize(-innerWidth)
          .tickFormat(() => "")
        );

      // X axis (time)
      g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x).ticks(d3.timeHour.every(3)))
        .append("text")
        .attr("x", innerWidth)
        .attr("y", -10)
        .attr("text-anchor", "end")
        .text("Time (24h)");

      // Y axis (temperature)
      g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Temperature (°C)");

      // Line generator
      const line = d3.line<typeof parsedData[0]>()
      .x(d => x(new Date().setHours(
        parseInt(d.hour.split(':')[0]),
        parseInt(d.hour.split(':')[1]),
        0, 0
      )))
      .y(d => y(d.temperature))
      .curve(d3.curveMonotoneX);

      // Draw a line for each date
      uniqueDates.forEach((date) => {
        const dayData = parsedData.filter(d => d.date === date);

        g.append("path")
          .datum(dayData)
          .attr("class", "line")
          .attr("d", line)
          .attr("fill", "none")
          .attr("stroke", color(date))
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", function() {
            // Make today's line solid, others dashed
            const today = new Date().toISOString().split('T')[0];
            return date === today ? "none" : "5,5";
          });
      });

      // Add data points and tooltip interaction
      g.selectAll(".dot")
        .data(parsedData)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(new Date().setHours(
          parseInt(d.hour.split(':')[0]),
          parseInt(d.hour.split(':')[1]),
          0, 0
        )))
        .attr("cy", d => y(d.temperature))
        .attr("r", 3)
        .attr("fill", d => color(d.date))
        .attr("opacity", 0.8)
        .on("mouseover", function(event: MouseEvent, d) {
          d3.select(this).attr("r", 5).attr("opacity", 1);
          setTooltip({
            x: event.pageX,
            y: event.pageY,
            content: (<>
              <strong>{d.date}</strong><br/>
              Time: {d.hour}<br/>
              Temperature: {d.temperature}°C
            </>),
            visible: true
          });
        })
        .on("mouseout", function() {
          d3.select(this).attr("r", 3).attr("opacity", 0.8);
          setTooltip((prev) => ({ ...prev, visible: false }));
        });

      // Add legend
      const legend = g.append("g")
      .attr("transform", `translate(${innerWidth - 100}, 0)`);

      uniqueDates.forEach((date, i) => {
        const legendItem = legend.append("g")
        .attr("transform", `translate(0, ${i * 20})`);

        legendItem.append("line")
          .attr("x1", 0)
          .attr("x2", 20)
          .attr("y1", 10)
          .attr("y2", 10)
          .attr("stroke", color(date))
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", () => {
            const today = new Date().toISOString().split('T')[0];
            return date === today ? "none" : "5,5";
          });

        legendItem.append("text")
          .attr("x", 30)
          .attr("y", 10)
          .attr("dy", "0.35em")
          .text(new Date(date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          }))
          .style("font-size", "12px");
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
