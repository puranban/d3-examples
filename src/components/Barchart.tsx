import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { BarData, TooltipProps } from '@/types';
import Tooltip from './Tooltip';

interface Props {
  data: BarData[];
  width: number;
  height: number;
}
const BarChart: React.FC<Props> = ({ data, width, height }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<TooltipProps>({ x: 0, y: 0, content: '', visible: false });

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 40, right: 30, bottom: 70, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Prepare data for grouped bars
    const dates = data.map(d => d.date);
    const metrics = ['temperature', 'precipitation'] as const;

    // X scale for dates (outer grouping)
    const x0 = d3.scaleBand()
      .domain(dates)
      .range([0, innerWidth])
      .padding(0.2);

    // X scale for metrics (inner grouping)
    const x1 = d3.scaleBand()
      .domain(metrics.map(String))
      .range([0, x0.bandwidth()])
      .padding(0.1);

    // Y scale (shared for both metrics)
    const maxTemp = d3.max(data, d => d.temperature) || 0;
    const maxPrecip = d3.max(data, d => d.precipitation) || 0;
    const yMax = Math.max(maxTemp, maxPrecip);

    console.log("bar", data, maxTemp, maxPrecip, yMax);
    const y = d3.scaleLinear()
      .domain([0, yMax])
      .nice()
      .range([innerHeight, 0]);

    // Color scale
    const color = d3.scaleOrdinal<string>()
      .domain(metrics.map(String))
      .range(['#ff7f0e', '#1f77b4']); // Orange for temp, blue for precip

    // Create SVG group
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add axes
    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x0))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("font-size", "0.7rem")
      .style("text-anchor", "end");

    g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
      .attr("text-anchor", "end")
      .selectAll("text")
      .style("font-size", "0.7rem");

    // Create groups for each date
    const dateGroups = g.selectAll(".date-group")
      .data(data)
      .enter().append("g")
      .attr("class", "date-group")
      .attr("transform", d => `translate(${x0(d.date)},0)`);

    // Add bars for each metric
    metrics.forEach(metric => {
      dateGroups.append("rect")
        .attr("class", `bar bar-${metric}`)
        .attr("x", x1(String(metric)))
        .attr("y", d => y(metric === 'temperature' ? d.temperature : d.precipitation))
        .attr("width", x1.bandwidth())
        .attr("height", d => innerHeight - y(metric === 'temperature' ? d.temperature : d.precipitation))
        .attr("fill", color(String(metric)))
        .on("mouseover", function(event: MouseEvent, d) {
          d3.select(this).attr("opacity", 0.7);
          setTooltip({
            x: event.pageX,
            y: event.pageY,
            content: (<>
              <strong>{d.date}</strong> <br />
              {metric}: {
                metric === 'temperature'
                  ? `${d.temperature}°C`
                  : `${d.precipitation}mm`
              }
            </>),
            visible: true
          });
        })
        .on("mouseout", function() {
          d3.select(this).attr("opacity", 1);
          setTooltip(prev => ({ ...prev, visible: false }));
        });
    });

    // Add legend
    const legend = g.append("g")
      .attr("transform", `translate(${innerWidth - 100}, -20)`);

    metrics.forEach((metric, i) => {
      legend.append("rect")
        .attr("x", 0)
        .attr("y", i * 20)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", color(String(metric)));

      legend.append("text")
        .attr("x", 20)
        .attr("y", i * 20 + 12)
        .text(metric === 'temperature' ? 'Temperature (°C)' : 'Precipitation (mm)')
        .style("font-size", "0.7rem");
    });
  }, [data, width, height]);

  return (
    <>
      <svg ref={svgRef} width={width} height={height} />
      <Tooltip {...tooltip} />
    </>
  );
};

export default BarChart;
