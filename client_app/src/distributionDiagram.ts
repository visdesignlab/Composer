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
import { format } from 'd3-format';
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
    private BMI;
    private AGE;
    private CCI;


    private distributionDimension = {height: 200, width: 300};

    constructor(parent: Element) {

        this.$node = select(parent)
            .append('div')
            .classed('distributionDiv', true)
            .classed('hidden', true);

        this.BMI = this.$node.append('svg').attr('id', 'BMI')
            .attr('height', this.distributionDimension.height + 60)
            .attr('width', this.distributionDimension.width + 60);

        this.AGE = this.$node.append('svg').attr('id', 'AGE')
        .attr('height', this.distributionDimension.height + 60)
        .attr('width', this.distributionDimension.width + 60);

        this.CCI = this.$node.append('svg').attr('id', 'CCI')
        .attr('height', this.distributionDimension.height + 60)
        .attr('width', this.distributionDimension.width + 60);

        this.svg =  this.$node.selectAll('svg');

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
        
        this.group.append('g').classed('COHORT', true);

        this.attachListener();
    }

    /**
     * Attach listeners
     */
    private attachListener() {

        //called in parallel mapPatData

        events.on('dataLoaded', (evt, item)=> {
            //console.log(item);
            //this.drawDiagram(item, 'BMI');
           // this.drawDiagram(item, 'AGE');
           // this.drawDiagram(item, 'CCI');
        })
     
        events.on('dataUpdated', (evt, item) => { 
           console.log(item);
           this.drawDiagram(item, 'BMI');
           this.drawDiagram(item, 'AGE');
           this.drawDiagram(item, 'CCI');
        });

    }

    /**
     * Draw the diagram with the given data from getSimilarRows
     */
    private drawDiagram(patData, type) {
        var self = this;
        console.log(type);
       //let data = patData.filter(element => +element['BMI']);

        //console.log(data);

        this.$node.classed('hidden', false);

        let maxValue = max(patData, function (d/*: number*/) {
            return +d[type];
        });

       // let normalize = scaleLinear().domain([0, maxValue + 0.01]).range([0, 1]);
        let dataCohort = patData.map((d: number) => +d[type]);

        this.xScale.domain([0, maxValue]).nice();

        let bins = histogram()
            .domain([0, maxValue])
            .thresholds(this.xScale.ticks(25))
            //(this.distributionData);
            (dataCohort);

        let totalPatients = dataCohort.length;
        let histogramData = bins.map(function (d) {
            totalPatients -= d.length;
            return {x0: d.x0, x1: d.x1, length: d.length, totalPatients: totalPatients + d.length}
        });

        this.yScale.domain([0, max(bins, function (d) {
            return d.length;
        })]);

        let barGroups = this[type].select('.COHORT').selectAll(".bar")
            .data(histogramData);

            barGroups.exit().remove();

        let barEnter = barGroups.enter().append("g")
            .attr("class", "bar");

            barGroups = barEnter.merge(barGroups);

            barGroups
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

        barGroups
            .selectAll("rect")
            //.classed('displayedRect', false)
            //.transition(t)
            .attr("y", (d) => {
                return this.distributionDimension.height - this.yScale(d.length);
            })
            .attr("width", this.xScale(bins[0].x1) - this.xScale(bins[0].x0) - 3)
            .attr("height", (d) => {
                return this.yScale(d.length);
            });

        // update the axis
        this.group.select(".axis--x")
            //.transition(t)
            .call(axisBottom(this.xScale));

        this.group.select(".axis--y")
           // .transition(t)
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