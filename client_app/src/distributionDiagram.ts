/**
 * Total Overhaul, Jen 1/12/17
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
    private distibutionDivs;
    private midLineCohort;


    private distributionDimension = {height: 200, width: 300};

    constructor(parent: Element) {

        this.$node = select(parent)
            .append('div')
            .classed('distributionDiv', true)
           // .classed('hidden', true);

        this.BMI = this.$node.append('div').classed('distribution', true).attr('id', 'BMI').append('svg')
            .attr('height', this.distributionDimension.height + 70)
            .attr('width', this.distributionDimension.width + 60);

        this.AGE = this.$node.append('div').classed('distribution', true).attr('id', 'AGE').append('svg')
        .attr('height', this.distributionDimension.height + 70)
        .attr('width', this.distributionDimension.width + 60);

        this.CCI = this.$node.append('div').classed('distribution', true).attr('id', 'CCI').append('svg')
        .attr('height', this.distributionDimension.height + 70)
        .attr('width', this.distributionDimension.width + 60);

        this.svg =  this.$node.selectAll('svg');

        this.distibutionDivs = this.$node.selectAll('.distribution');

//////////CHECKBOXES FOR HIDING THE COHORT OR TOTAL DISTRIBUTION BARS///////////////////////////////////////
        let rectLabel = this.distibutionDivs.append('div').attr('transform', 'translate(150, 230)');
        let checkAll = rectLabel.insert("input").attr('type', 'checkbox').attr('value', 'All').attr('checked', true);
        checkAll.on('click', function(){
            let target =  (this).parentNode.parentNode.querySelector('.ALL');
            if(target.classList.contains('hidden')){
                target.classList.remove('hidden');
            }else{target.classList.add('hidden'); }
        });
        rectLabel.append('text').text('All').attr('color', '#BCAAE7');
       
        let checkCohort = rectLabel.insert("input").attr('type', 'checkbox').attr('checked', true).attr('value', 'Cohort').attr('transform', 'translate(40, 220)');;
            checkCohort.on('click', function(d){
                let target =  (this).parentNode.parentNode.querySelector('.COHORT');
                if(target.classList.contains('hidden')){
                    target.classList.remove('hidden');
                }else{target.classList.add('hidden'); }
        });
        rectLabel.append('text').text('Cohort').attr('color', '#D0A016');
        
///////SETTING SCALES//////////////////////////////
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
        this.group.append('g').classed('midLineCohort', true);
        selectAll('.midLineCohort').append('text');
        selectAll('.midLineCohort').append('line');
        this.group.append('g').classed('plotLabel', true);

        this.attachListener();
    }

    /**
     * Attach listeners
     */
    private attachListener() {

        events.on('demo_filtered', (evt, item) => { 

            console.log('updated');
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
        //console.log(type);
       // console.log(patData);

        this.$node.classed('hidden', false);

        let maxValue = max(patData, function (d/*: number*/) {
            return +d[type];
        });

        let dataCohort = selected.map((d: number) => +d[type]);
        let dataAll = patData.map((d: number) => +d[type]);

        if (type == 'BMI'){
            dataCohort = dataCohort.filter(d => d > 0);
            dataAll = dataAll.filter(d => d > 0);
        }

        let x = this.xScale.domain([0, maxValue]).nice();
       
        let xAxis = axisBottom(x);
 
        let bins = histogram()
            .domain(x.domain())
            .thresholds(x.ticks(25))
            (dataCohort);

        let binsALL = histogram()
        .domain(x.domain())
        .thresholds(x.ticks(25))
        (dataAll);

        let totalPatients = dataAll.length;
        let selectedPatients = dataCohort.length;

        let histogramData = bins.map(function (d) {
            selectedPatients -= d.length;
            return {x0: d.x0, x1: d.x1, length: d.length, totalPatients: selectedPatients + d.length, frequency: d.length/dataCohort.length}
        });


        let histogramDataALL = binsALL.map(function (d) {
            totalPatients -= d.length;
            return {x0: d.x0, x1: d.x1, length: d.length, totalPatients: totalPatients + d.length, frequency: d.length/dataAll.length}
        });

        this.yScale.domain([0, 1]);

        this.yScale.domain([0, max(histogramDataALL, function (d) {
            return d.frequency + .1;
        })]);

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


        // update the axis
        this[type].select(".axis--x")//.data(binsALL)
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
        
        if(meanCohort > meanvalue){
            barGroups.classed('selected', true);
            
        };

        let meanLine = this[type].select('.midLine').append('line')
        .attr('x1', this.xScale(meanvalue)).attr('x2', this.xScale(meanvalue))
        .attr('y1', 0).attr('y2', 200).attr('stroke-width', .5);
        this[type].select('.midLine').append('text').text('total population mean:  ' + meanvalue)
        .attr('x', this.xScale(meanvalue));

        let meanLineCohort = this[type].select('.midLineCohort').select('line')
        .attr('x1', this.xScale(meanCohort)).attr('x2', this.xScale(meanCohort))
        .attr('y1', 20).attr('y2', 200).attr('stroke-width', .5).attr('stroke', 'red');

        this[type].select('.midLineCohort').select('text').text('Cohort mean:  ' + meanCohort)
        .attr('x', this.xScale(meanCohort)).attr('y', 20);

        let plotLabel = this[type].select('.plotLabel').append('text').text(type).classed('Label', true)
        .attr('transform', 'translate(150, 230)');

       
    }

}

export function create(parent: Element) {
    return new distributionDiagram(parent);
}