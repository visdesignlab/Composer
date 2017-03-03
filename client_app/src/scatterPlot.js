/**
 * Created by saharmehrpour on 3/3/17.
 */
import { select } from 'd3-selection';
import { max, min } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
var ScatterPlot = (function () {
    function ScatterPlot(parent, data, result) {
        this.$node = select(parent)
            .append("div")
            .classed("scatterDiv", true);
        this.data = data;
        this.result = result;
    }
    ScatterPlot.prototype.init = function () {
        return this.build();
    };
    ScatterPlot.prototype.build = function () {
        return this.drawScatterPlot();
    };
    ScatterPlot.prototype.drawScatterPlot = function () {
        var _this = this;
        var scale_0 = scaleLinear()
            .domain([min(this.data, function (d) {
                return +d[0];
            }), max(this.data, function (d) {
                return +d[0];
            })])
            .range([30, 290]);
        var scale_1 = scaleLinear()
            .domain([min(this.data, function (d) {
                return +d[1];
            }), max(this.data, function (d) {
                return +d[1];
            })])
            .range([20, 270]);
        var circles_one = this.$node.append('svg')
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
            .style("fill", function (d, i) {
            if (_this.result[i] == 0)
                return "darkgreen";
            if (_this.result[i] == 1)
                return "darkred";
            return "darkblue";
        })
            .style("stroke", function (d, i) {
            if (_this.result[i] == 0)
                return "darkgreen";
            if (_this.result[i] == 1)
                return "darkred";
            return "darkblue";
        })
            .style("opacity", 0.5);
        var svg = this.$node.select('svg');
        svg.append('g')
            .attr("transform", "translate(0,270)")
            .call(axisBottom(scale_0));
        svg.append("g")
            .attr("transform", "translate(30,0)")
            .call(axisLeft(scale_1));
    };
    return ScatterPlot;
}());
export default ScatterPlot;
export function create(parent, data, result) {
    return new ScatterPlot(parent, data, result);
}
//# sourceMappingURL=scatterPlot.js.map