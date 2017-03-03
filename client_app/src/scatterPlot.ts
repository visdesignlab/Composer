/**
 * Created by saharmehrpour on 3/3/17.
 */

import {select} from 'd3-selection';
import {max, min} from 'd3-array';
import {scaleLinear} from 'd3-scale';
import {axisBottom,axisLeft} from 'd3-axis';

export default class ScatterPlot {

  private $node;
  private data;
  private result;

  constructor(parent:Element, data, result) {
    this.$node = select(parent)
      .append("div")
      .classed("scatterDiv", true);
    this.data = data;
    this.result = result;

  }

  init() {
    return this.build();
  }

  private build(){
    return this.drawScatterPlot();
  }

  private drawScatterPlot(){
    let scale_0 = scaleLinear()
      .domain([min(this.data, (d) => {
        return +d[0]
      }), max(this.data, (d) => {
        return +d[0]
      })])
      .range([30, 290]);

    let scale_1 = scaleLinear()
      .domain([min(this.data, (d) => {
        return +d[1]
      }), max(this.data, (d) => {
        return +d[1]
      })])
      .range([20, 270]);

    let circles_one = this.$node.append('svg')
      .attr("width", 300)
      .attr("height", 300)
      .selectAll("circle")
      .data(this.data);

    circles_one.enter()
      .append("circle")
      .attr("cx", function (d) {
        return scale_0(d[0]);
      })
      .attr("cy", function (d) {
        return scale_1(d[1]);
      })
      .attr("r", 2)
      .style("fill", (d, i) => {
        if (this.result[i] == 0)
          return "darkgreen";
        if (this.result[i] == 1)
          return "darkred";
        return "darkblue";
      })
      .style("stroke", (d, i) => {
        if (this.result[i] == 0)
          return "darkgreen";
        if (this.result[i] == 1)
          return "darkred";
        return "darkblue";
      })
      .style("opacity", 0.5);

    let svg = this.$node.select('svg');

    svg.append('g')
      .attr("transform", "translate(0,270)")
      .call(axisBottom(scale_0));

    svg.append("g")
      .attr("transform", "translate(30,0)")
      .call(axisLeft(scale_1));

  }
}

export function create(parent:Element, data, result) {
  return new ScatterPlot(parent, data, result);
}
