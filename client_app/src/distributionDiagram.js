/**
 * Created by saharmehrpour on 7/16/17.
 */
import { select, event } from 'd3-selection';
import * as events from 'phovea_core/src/event';
import { scaleLinear } from 'd3-scale';
import { max, histogram } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { transition } from 'd3-transition';

var distributionDiagram = (function() {
    function distributionDiagram(parent) {
        this.distributionDimension = { height: 200, width: 300 };
        this.$node = select(parent)
            .append('div')
            .classed('distributionDiv', true)
            .classed('hidden', true);
        this.svg = this.$node.append('svg')
            .attr('height', this.distributionDimension.height + 60)
            .attr('width', this.distributionDimension.width + 60);
        this.xScale = scaleLinear()
            .rangeRound([0, this.distributionDimension.width]);
        this.yScale = scaleLinear()
            .range([0, this.distributionDimension.height]);
        this.group = this.svg
            .append("g")
            .attr("transform", "translate(40,40)");
        this.group.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + this.distributionDimension.height + ")");
        this.group.append("g")
            .attr("class", "axis axis--y")
            .attr("transform", "translate(0,0)");
        this.attachListener();
    }
    /**
     * Attach listeners
     */
    distributionDiagram.prototype.attachListener = function() {
        var _this = this;
        // item: pat_id, number of similar patients, DATA
        events.on('update_similar', function(evt, item) {
            _this.distributionData = item[2]['all_scores'];
            _this.drawDiagram();
        });
    };
    /**
     * Draw the diagram with the given data from getSimilarRows
     */
    distributionDiagram.prototype.drawDiagram = function() {
        var _this = this;
        var self = this;
        this.$node.classed('hidden', false);
        var maxValue = max(this.distributionData, function(d) {
            return d;
        });
        var normalize = scaleLinear().domain([0, maxValue + 0.01]).range([0, 1]);
        var data = this.distributionData.map(function(d) { return normalize(d); });
        this.xScale.domain([0, 1 /*maxValue*/ ]).nice();
        var bins = histogram()
            .domain([0, 1 /*maxValue*/ ])
            .thresholds(this.xScale.ticks(20))(data);
        var totalPatients = data.length;
        var histogramData = bins.map(function(d) {
            totalPatients -= d.length;
            return { x0: d.x0, x1: d.x1, length: d.length, totalPatients: totalPatients + d.length };
        });
        this.yScale.domain([0, max(bins, function(d) {
            return d.length;
        })]);
        var barGroups = this.group.selectAll(".bar")
            .data(histogramData);
        barGroups.enter().append("g")
            .attr("class", "bar")
            .attr("transform", function(d) {
                return "translate(" + _this.xScale(d.x0) + ",0)";
            })
            .append("rect")
            .attr("x", 1)
            .attr("y", function(d) {
                return _this.distributionDimension.height - _this.yScale(d.length);
            })
            .attr("width", this.xScale(bins[0].x1) - this.xScale(bins[0].x0) - 3)
            .attr("height", function(d) {
                return _this.yScale(d.length);
            })
            .on("mouseover", function() {
                var currElement = this.parentNode;
                while (currElement) {
                    select(currElement).select('rect').classed('selectedRect', true);
                    currElement = currElement.nextSibling;
                }
                var totalPatients = (select(this.parentNode).datum())['totalPatients'];
                var t = transition('t').duration(500);
                select(".tooltip")
                    .html("Total patients: " + totalPatients)
                    .transition(t)
                    .style("opacity", 1)
                    .style("left", event.pageX + 10 + "px")
                    .style("top", event.pageY + 10 + "px");
            })
            .on("mouseout", function() {
                var currElement = this.parentNode;
                while (currElement) {
                    select(currElement).select('rect').classed('selectedRect', false);
                    currElement = currElement.nextSibling;
                }
                var t = transition('t').duration(500);
                select(".tooltip").transition(t)
                    .style("opacity", 0);
            })
            .on('click', function() {
                var totalPatients = (select(this.parentNode).datum())['totalPatients'];
                select(this.parentNode.parentNode).selectAll('rect').classed('displayedRect', false);
                var currElement = this.parentNode;
                while (currElement) {
                    select(currElement).select('rect').classed('displayedRect', true);
                    currElement = currElement.nextSibling;
                }
                // received in queryBox
                events.fire("number_of_similar_patients", [totalPatients]);
            });
        var t = transition('t').duration(2000);
        barGroups
            .attr("transform", function(d) {
                return "translate(" + _this.xScale(d.x0) + ",0)";
            })
            .select("rect")
            .attr("width", function() {
                return select(this).attr("width");
            })
            .attr("height", function() {
                return select(this).attr("height");
            });
        barGroups.enter().merge(barGroups)
            .selectAll("rect")
            .transition(t)
            .attr("y", function(d) {
                return _this.distributionDimension.height - _this.yScale(d.length);
            })
            .attr("width", this.xScale(bins[0].x1) - this.xScale(bins[0].x0) - 3)
            .attr("height", function(d) {
                return _this.yScale(d.length);
            });
        // update the axis
        this.group.select(".axis--x")
            .transition(t)
            .call(axisBottom(this.xScale));
        this.group.select(".axis--y")
            .transition(t)
            .call(axisLeft(scaleLinear()
                .range([this.distributionDimension.height, 0])
                .domain([0, max(bins, function(d) {
                    return d.length;
                })])));
    };
    return distributionDiagram;
}());
export { distributionDiagram };
export function create(parent) {
    return new distributionDiagram(parent);
}
//# sourceMappingURL=distributionDiagram.js.map