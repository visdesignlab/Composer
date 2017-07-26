/**
 * Created by saharmehrpour on 7/16/17.
 */

import * as ajax from 'phovea_core/src/ajax';
import {BaseType, select, selectAll, event} from 'd3-selection';
import {nest, values, keys, map, entries} from 'd3-collection'
import * as events from 'phovea_core/src/event';
import {scaleLinear, scaleTime, scaleOrdinal} from 'd3-scale';
import {line, curveMonotoneX} from 'd3-shape';
import {timeParse} from 'd3-time-format';
import {extent, min, max, ascending, histogram} from 'd3-array';
import {axisBottom, axisLeft} from 'd3-axis';
import {drag} from 'd3-drag';
import {Constants} from './constants';
import {transition} from 'd3-transition';
import {brush, brushY} from 'd3-brush';

export class distributionDiagram {

    private $node;
    private svg;
    private group;
    private distributionData;
    private xScale;
    private yScale;

    private distributionDimension = {height: 200, width: 300};

    constructor(parent: Element) {

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
    private attachListener() {

        // item: pat_id, number of similar patients, DATA
        events.on('update_similar', (evt, item) => { // called in queryBox
            this.distributionData = item[2]['all_scores'];
            this.drawDiagram();
        });

    }

    /**
     * Draw the diagram with the given data from getSimilarRows
     */
    private drawDiagram() {
        var self = this;

        this.$node.classed('hidden', false);

        let maxValue = max(this.distributionData, function (d: number) {
            return d
        });

        let normalize = scaleLinear().domain([0, maxValue + 0.01]).range([0, 1]);
        let data = this.distributionData.map((d: number) => normalize(d));

        this.xScale.domain([0, 1/*maxValue*/]).nice();

        let bins = histogram()
            .domain([0, 1/*maxValue*/])
            .thresholds(this.xScale.ticks(20))
            //(this.distributionData);
            (data);

        let totalPatients = data.length;
        let histogramData = bins.map(function (d) {
            totalPatients -= d.length;
            return {x0: d.x0, x1: d.x1, length: d.length, totalPatients: totalPatients + d.length}
        });

        this.yScale.domain([0, max(bins, function (d) {
            return d.length;
        })]);

        let barGroups = this.group.selectAll(".bar")
            .data(histogramData);

        barGroups.enter().append("g")
            .attr("class", "bar")
            .attr("transform", (d) => {
                return "translate(" + this.xScale(d.x0) + ",0)";
            })
            .append("rect")
            .attr("x", 1)
            .attr("y", (d) => {
                return this.distributionDimension.height - this.yScale(d.length);
            })
            .attr("width", this.xScale(bins[0].x1) - this.xScale(bins[0].x0) - 3)
            .attr("height", (d) => {
                return this.yScale(d.length);
            })
            .on("mouseover", function () {
                let currElement = this.parentNode;
                while (currElement) {
                    select(currElement).select('rect').classed('selectedRect', true);
                    currElement = currElement.nextSibling;
                }
                let totalPatients = (select(this.parentNode).datum())['totalPatients'];
                let t = transition('t').duration(500);
                select(".tooltip")
                    .html(`Total patients: ${totalPatients}`)
                    .transition(t)
                    .style("opacity", 1)
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY + 10}px`);

            })
            .on("mouseout", function () {
                let currElement = this.parentNode;
                while (currElement) {
                    select(currElement).select('rect').classed('selectedRect', false);
                    currElement = currElement.nextSibling;
                }

                let t = transition('t').duration(500);
                select(".tooltip").transition(t)
                    .style("opacity", 0);
            })
            .on('click', function () {
                let totalPatients = (select(this.parentNode).datum())['totalPatients'];

                select(this.parentNode.parentNode).selectAll('rect').classed('displayedRect', false);

                let currElement = this.parentNode;
                while (currElement) {
                    select(currElement).select('rect').classed('displayedRect', true);
                    currElement = currElement.nextSibling;
                }

                // received in queryBox
                events.fire("number_of_similar_patients", [totalPatients]);
            });

        let t = transition('t').duration(2000);

        barGroups
            .attr("transform", (d) => {
                return "translate(" + this.xScale(d.x0) + ",0)";
            })
            .select("rect")
            .attr("width", function () {
                return select(this).attr("width");
            })
            .attr("height", function () {
                return select(this).attr("height");
            });

        barGroups.enter().merge(barGroups)
            .selectAll("rect")
            //.classed('displayedRect', false)
            .transition(t)
            .attr("y", (d) => {
                return this.distributionDimension.height - this.yScale(d.length);
            })
            .attr("width", this.xScale(bins[0].x1) - this.xScale(bins[0].x0) - 3)
            .attr("height", (d) => {
                return this.yScale(d.length);
            });

        // update the axis

        this.group.select(".axis--x")
            .transition(t)
            .call(axisBottom(this.xScale));

        this.group.select(".axis--y")
            .transition(t)
            .call(axisLeft(scaleLinear()
                .range([this.distributionDimension.height, 0])
                .domain([0, max(bins, function (d) {
                    return d.length;
                })])));
    }

}


export function create(parent: Element) {
    return new distributionDiagram(parent);
}