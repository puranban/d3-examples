import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { ScatterData, TooltipProps } from '@/types';
import Tooltip from './Tooltip';

interface Props {
  data: ScatterData[];
  width: number;
  height: number;
}

const ScatterPlot: React.FC<Props> = ({ data, width, height }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<TooltipProps>({
    x: 0,
    y: 0,
    content: '',
    visible: false,
  });

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 50, right: 100, bottom: 100, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // X scale (precipitation probability)
    const x = d3.scaleLinear()
      .domain([0, 100])
      .range([0, innerWidth]);

    // Y scale (relative humidity)
    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([innerHeight, 0]);

    // Color scale based on temperature
    const color = d3.scaleSequential(d3.interpolatePlasma)
    .domain([
      d3.min(data, d => d.temperature) || 0,
      d3.max(data, d => d.temperature) || 0
    ]);

    // Size scale based on precipitation probability
    const size = d3.scaleLinear()
      .domain([0, 100])
      .range([5, 20]);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X axis
    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .attr("text-anchor", "end")
      .selectAll("text")
      .style("font-size", "0.7rem");

    // Y axis
    g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
      .attr("text-anchor", "end")
      .selectAll("text")
      .style("font-size", "0.7rem");

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

    // Add data points
    g.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => x(d.precipitation))
      .attr("cy", d => y(d.humidity))
      .attr("r", d => size(d.precipitation))
      .attr("fill", d => color(d.temperature))
      .attr("opacity", 0.8)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1)
      .on("mouseover", function(event: MouseEvent, d: ScatterData) {
        d3.select(this).attr("opacity", 1).attr("r", size(d.precipitation) * 1.2);
        setTooltip({
          x: event.pageX,
          y: event.pageY,
          content: (<>
            <strong>{d.date}</strong><br/>
            Precipitation: {d.precipitation}%<br/>
            Humidity: {d.humidity}%<br/>
            Max Temp: {d.temperature}°C
          </>),
          visible: true
        });
      })
      .on("mouseout", function(_, d: ScatterData) {
        d3.select(this).attr("opacity", 0.8).attr("r", size(d.precipitation));
        setTooltip((prev) => ({...prev, visible: false }));
      });

    // Add color legend
    const legend = g.append("g")
      .attr("transform", `translate(${innerWidth + 10}, 0)`);

    const legendHeight = 150;
    const legendWidth = 20;

    const defs = svg.append("defs");
    const linearGradient = defs.append("linearGradient")
      .attr("id", "legend-gradient")
      .attr("x1", "0%")
      .attr("x2", "0%")
      .attr("y1", "0%")
      .attr("y2", "100%");

    const tempExtent = d3.extent(data, d => d.temperature) as [number, number];

    linearGradient.selectAll("stop")
      .data(d3.range(0, 1.01, 0.1))
      .enter().append("stop")
      .attr("offset", d => `${d * 100}%`)
      .attr("stop-color", d => color(d3.interpolate(tempExtent[0], tempExtent[1])(d)));

    legend.append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .attr("x", 20)
      .style("fill", "url(#legend-gradient)");

    const legendScale = d3.scaleLinear()
      .domain(tempExtent)
      .range([legendHeight, 0]);

    legend.append("g")
      .attr("transform", `translate(${legendWidth + 20}, 0)`)
      .call(d3.axisRight(legendScale))
      .attr("x", 0)
      .attr("y", legendHeight / 2)
      .attr("text-anchor", "start")
      .style("font-size", "0.7rem");

    // Add size legend
    const sizeLegend = g.append("g")
      .attr("transform", `translate(${innerWidth - 100}, ${innerHeight + 60})`);

    const sizeValues = [20, 50, 80];

    sizeValues.forEach((value, i) => {
      sizeLegend.append("circle")
        .attr("cx", i * 40)
        .attr("cy",10)
        .attr("r", size(value))
        .attr("fill", "#999")
        .attr("opacity", 0.6);

      sizeLegend.append("text")
        .attr("x", i * 40)
        .attr("y", size(value) + 20)
        .text(`${value}%`)
        .style("font-size", "10px")
        .style("text-anchor", "middle");
    });

    sizeLegend.append("text")
      .attr("x", -30)
      .attr("y", -15)
      .text("Precipitation Probability")
      .style("font-size", "12px");

  }, [data, width, height]);

  return (
    <>
      <svg ref={svgRef} width={width} height={height} />
      <Tooltip {...tooltip} />
    </>
  );
};

export default ScatterPlot;
