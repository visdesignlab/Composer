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
import {extent, min, max, ascending, histogram, mean, deviation} from 'd3-array';
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
            .attr('height', this.distributionDimension.height + 100)
            .attr('width', this.distributionDimension.width + 60);

        this.AGE = this.$node.append('svg').attr('id', 'AGE')
        .attr('height', this.distributionDimension.height + 100)
        .attr('width', this.distributionDimension.width + 60);

        this.CCI = this.$node.append('svg').attr('id', 'CCI')
        .attr('height', this.distributionDimension.height + 100)
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
        this.group.append('g').classed('ALL', true);

        this.group.append('g').classed('midLine', true);
        this.group.append('g').classed('plotLabel', true);

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
           let selected = item[0];
           let all = item[1];
           this.drawDiagram(selected, all, 'BMI');
           this.drawDiagram(selected, all, 'AGE');
           this.drawDiagram(selected, all, 'CCI');
        });

    }

    /**
     * Draw the diagram with the given data from getSimilarRows
     */
    private drawDiagram(selected, patData, type) {
        var self = this;
        console.log(type);
        console.log(patData);
       //let data = patData.filter(element => +element['BMI']);

        //console.log(data);

        this.$node.classed('hidden', false);

        let maxValue = max(patData, function (d/*: number*/) {
            return +d[type];
        });

       // let normalize = scaleLinear().domain([0, maxValue + 0.01]).range([0, 1]);
        let dataCohort = selected.map((d: number) => +d[type]);
        let dataAll = patData.map((d: number) => +d[type]);

        console.log(mean(dataAll));
        console.log(mean(dataCohort));

        this.xScale.domain([0, maxValue]).nice();

        let xAxis = axisBottom(this.xScale);
     
        let bins = histogram()
            .domain([0, maxValue])
            .thresholds(this.xScale.ticks(25))
            //(this.distributionData);
            (dataCohort);

        let binsALL = histogram()
        .domain([0, maxValue])
        .thresholds(this.xScale.ticks(25))
        //(this.distributionData);
        (dataAll);

       
        let totalPatients = dataAll.length;
        let selectedPatients = dataCohort.length;

       // console.log(dataAll);
       // console.log(dataCohort);

        let histogramData = bins.map(function (d) {
            selectedPatients -= d.length;
            return {x0: d.x0, x1: d.x1, length: d.length, totalPatients: selectedPatients + d.length, frequency: d.length/dataCohort.length}
        });

        console.log(histogramData);

        let histogramDataALL = binsALL.map(function (d) {
            totalPatients -= d.length;
            return {x0: d.x0, x1: d.x1, length: d.length, totalPatients: totalPatients + d.length, frequency: d.length/dataAll.length}
        });

        this.yScale.domain([0, 1]);

        this.yScale.domain([0, max(histogramDataALL, function (d) {
            return d.frequency + .1;
        })]);

        console.log(histogramDataALL);

        //needs to be cleaned up but bars for cohort////////////////////////////
        let barGroups = this[type].select('.COHORT').selectAll(".bar")
            .data(histogramData);

            barGroups.exit().remove();

        let barEnter = barGroups.enter().append("g")
            .attr("class", "bar");

            barGroups = barEnter.merge(barGroups);

            barGroups
            .attr("transform", (d) => {
                return "translate(" + this.xScale(d.x0) + ",0)";
            });
            barEnter.append("rect");
            barGroups.select('rect')
            .attr("x", 1)
            .attr("y", (d) => {
                return this.distributionDimension.height - this.yScale(d.frequency);
            })
            .attr("width", this.xScale(bins[0].x1) - this.xScale(bins[0].x0) - 3)
            .attr("height", (d) => {
                return this.yScale(d.frequency);
            });
/*
        barGroups
            .select("rect")
            .transition(9000)
            .attr("y", (d) => {
                return this.distributionDimension.height - this.yScale(d.frequency);
            })
            .attr("width", this.xScale(bins[0].x1) - this.xScale(bins[0].x0) - 3)
            .attr("height", (d) => {
                return this.yScale(d.frequency);
            });*/

//////////////bar groups for all data////////////////////////////////
            let barGroupsALL = this[type].select('.ALL').selectAll(".barALL")
            .data(histogramDataALL);

            barGroupsALL.exit().remove();

        let barEnterALL = barGroupsALL.enter().append("g")
            .attr("class", "barALL");

            barGroupsALL = barEnterALL.merge(barGroupsALL);

            barGroupsALL
            .attr("transform", (d) => {
                return "translate(" + this.xScale(d.x0) + ",0)";
            });
            barEnterALL.append("rect");

            barGroupsALL.select('rect')
            .transition(9000)
            .attr("x", 1)
            .attr("y", (d) => {
                return this.distributionDimension.height - this.yScale(d.frequency);
            })
            .attr("width", this.xScale(bins[0].x1) - this.xScale(bins[0].x0) - 3)
            .attr("height", (d) => {
                return this.yScale(d.frequency);
           });

        
/*
        barGroupsALL
            .select("rect")
            //.classed('displayedRect', false)
            .transition(9000)
            .attr("y", (d) => {
                return this.distributionDimension.height - this.yScale(d.frequency);
            })
            .attr("width", this.xScale(binsALL[0].x1) - this.xScale(binsALL[0].x0) - 3)
            .attr("height", (d) => {
                return this.yScale(d.frequency);
            });*/

        // update the axis
        this.group.select(".axis--x")//.data(binsALL)
            //.transition(t)
            .call(xAxis);

        this.group.select(".axis--y")
           // .transition(t)
            .call(axisLeft(scaleLinear()
                .range([this.distributionDimension.height, 0])
                .domain([0, max(histogramDataALL, function (d) {
                    return d.frequency + .1;
                })])));

        let meanvalue = mean(dataAll);
        let meanCohort = mean(dataCohort);

        console.log(deviation(dataAll));
        console.log(deviation(dataCohort));
        
        if(meanCohort > meanvalue){
            barGroups.classed('selected', true);
            console.log(barGroups);
        };

        let meanLine = this[type].select('.midLine').append('line')
        .attr('x1', this.xScale(meanvalue)).attr('x2', this.xScale(meanvalue))
        .attr('y1', 0).attr('y2', 200).attr('stroke-width', 1);
        this[type].select('.midLine').append('text').text('total population mean:  ' + meanvalue).attr('x', this.xScale(meanvalue));

        let plotLabel = this[type].select('.plotLabel').append('text').text(type).classed('Label', true)
        .attr('transform', 'translate(150, 230)');

        let rectLabel = this[type].select('.plotLabel').append('g');
        rectLabel.append('rect').attr('width', 10).attr('height', 10).attr('fill', '#BCAAE7').attr('transform', 'translate(0, 220)');
        rectLabel.append('text').text('All').attr('transform', 'translate(10, 230)');
        rectLabel.append('rect').attr('width', 10).attr('height', 10).attr('fill', '#D0A016').attr('transform', 'translate(40, 220)');;
        rectLabel.append('text').text('Cohort').attr('transform', 'translate(50, 230)');
    }

}

export function create(parent: Element) {
    return new distributionDiagram(parent);
}