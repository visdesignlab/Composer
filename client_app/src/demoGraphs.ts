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


export class demoGraphs {

    private $node;
    private svg;
    private group;
    private distributionData;
    private xScale;
    private yScale;
    private BMI;
    private AGE;
    private CCI;
    private GENDER;
    private days;
    private distibutionDivs;
    private midLineCohort;
    private populationDemo;


    private distributionDimension = {height: 100, width: 180};

    constructor(parent: Element) {

        this.$node = select(parent)
            .append('div')
            .classed('distributionDiv', true)
           // .classed('hidden', true);

        this.BMI = this.$node.append('div').classed('distribution', true).attr('id', 'BMI').append('svg')
            .attr('height', this.distributionDimension.height + 60)
            .attr('width', this.distributionDimension.width + 20);

        this.AGE = this.$node.append('div').classed('distribution', true).attr('id', 'AGE').append('svg')
        .attr('height', this.distributionDimension.height + 60)
        .attr('width', this.distributionDimension.width + 20);

        this.CCI = this.$node.append('div').classed('distribution', true).attr('id', 'CCI').append('svg')
        .attr('height', this.distributionDimension.height + 60)
        .attr('width', this.distributionDimension.width + 20);

        this.svg =  this.$node.selectAll('svg');

        this.distibutionDivs = this.$node.selectAll('.distribution');

      
        
        ///////SETTING SCALES//////////////////////////////
        this.xScale = scaleLinear()
            .rangeRound([0, this.distributionDimension.width]);

        this.yScale = scaleLinear()
            .range([0, this.distributionDimension.height]);

        this.group = this.svg
            .append("g")
            .attr("transform", "translate(20,40)");

        this.group.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + this.distributionDimension.height + ")");
/*
        this.group.append("g")
            .attr("class", "axis axis--y")
            .attr("transform", "translate(0,0)");
*/
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
        events.on('population demo loaded', (evt, item)=> {
            
            this.populationDemo = item;
           
            this.drawDiagram(null, item, 'BMI');
            this.drawDiagram(null, item, 'AGE');
            this.drawDiagram(null, item, 'CCI');
         
        });

        events.on('demo_filtered', (evt, item) => { 

           let selected = item[0];
           let all = item[1];
           this.drawDiagram(selected, all, 'BMI');
           this.drawDiagram(selected, all, 'AGE');
           this.drawDiagram(selected, all, 'CCI');
        });

        events.on('day_dist', (evt, item)=> {
            //this.drawPROMIS(item, 'days');
           // this.drawDiagram(null, item, 'days');
        })

    }


    /**
     * Draw the diagram with the given data from getSimilarRows
     */
    private drawDiagram(selected, patData, type) {
    

        var self = this;
   
        this.$node.classed('hidden', false);

        let dataAll = patData.map((d: number) => +d[type]);

        let maxValue = max(patData, function (d/*: number*/) {
            return +d[type];
        });

        
        if (type == 'BMI') dataAll = dataAll.filter(d => d > 0);
        
        let x = this.xScale.domain([0, maxValue]).nice();
       
        let xAxis = axisBottom(x);
 
        let binsALL = histogram()
        .domain(x.domain())
        .thresholds(x.ticks(25))
        (dataAll);

        let totalPatients = dataAll.length;

        let histogramDataALL = binsALL.map(function (d) {
            totalPatients -= d.length;
            return {x0: d.x0, x1: d.x1, length: d.length, totalPatients: totalPatients + d.length, frequency: d.length/dataAll.length}
        });

       // this.yScale.domain([0, 1]);

        this.yScale.domain([0, max(histogramDataALL, function (d) {
            return d.frequency + .1;
        })]);

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
       // .attr("width", this.xScale(bins[0].x1) - this.xScale(bins[0].x0) - 3)
        .attr("width", this.xScale(binsALL[0].x1) - this.xScale(binsALL[0].x0) - 3)
        .attr("height", (d) => {
            return this.yScale(d.frequency);
       });

               // update the axis
        this[type].select(".axis--x")//.data(binsALL)
               //.transition(t)
               .call(xAxis);


        let plotLabel = this[type].select('.plotLabel').append('text').text(type).classed('Label', true)
        .attr('transform', 'translate(0, 0)');

        
    
    }

}

export function create(parent: Element) {
    return new demoGraphs(parent);
}