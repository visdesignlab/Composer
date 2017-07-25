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
            .attr('height', this.distributionDimension.height + 40)
            .attr('width', this.distributionDimension.width + 40);

        this.xScale = scaleLinear()
            .rangeRound([0, this.distributionDimension.width]);

        this.yScale = scaleLinear()
            .range([0, this.distributionDimension.height]);

        this.group = this.svg
            .append("g")
            .attr("transform", "translate(20,20)");

        this.group.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + this.distributionDimension.height + ")");

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

        this.$node.classed('hidden', false);

        let maxValue = max(this.distributionData, function (d: number) {
            return d
        });

        this.xScale.domain([0, maxValue]).nice();

        let bins = histogram()
            .domain([0, maxValue])
            .thresholds(this.xScale.ticks(20))
            (this.distributionData);

        this.yScale.domain([0, max(bins, function (d) {
            return d.length;
        })]);

        let barGroups = this.group.selectAll(".bar")
            .data(bins);

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
            .transition(t)
            .attr("y", (d) => {
                return this.distributionDimension.height - this.yScale(d.length);
            })
            .attr("width", this.xScale(bins[0].x1) - this.xScale(bins[0].x0) - 3)
            .attr("height", (d) => {
                return this.yScale(d.length);
            });

        this.group.select(".axis--x")
            .transition(t)
            .call(axisBottom(this.xScale));
    }

}


export function create(parent: Element) {
    return new distributionDiagram(parent);
}