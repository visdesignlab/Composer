/**
 * Created by saharmehrpour on 4/20/17.
 */

import * as ajax from 'phovea_core/src/ajax';
import {BaseType, select, selectAll, event} from 'd3-selection';
import {nest, values, keys, map, entries} from 'd3-collection';
import * as events from 'phovea_core/src/event';
import {scaleLinear, scaleTime, scaleOrdinal} from 'd3-scale';
import {line, curveMonotoneX} from 'd3-shape';
import {timeParse} from 'd3-time-format';
import {extent, min, max, ascending} from 'd3-array';
import {axisBottom, axisLeft} from 'd3-axis';
import {drag} from 'd3-drag';
import * as d3 from 'd3';
//import {Constants} from './constants';
import {transition} from 'd3-transition';
import {brush, brushY} from 'd3-brush';
import * as dataCalc from './dataCalculations';
import * as dataManager from './dataManager';
import {ITable, asTable} from 'phovea_core/src/table';
import {IAnyVector, INumericalVector} from 'phovea_core/src/vector';
import {list as listData, getFirstByName, get as getById} from 'phovea_core/src/data';
import {range, list, join, Range, Range1D, all} from 'phovea_core/src/range';
import {asVector} from 'phovea_core/src/vector/Vector';
import {argFilter} from 'phovea_core/src/';


export const filteredOrders = this.filteredOrders;

export class similarityScoreDiagram {

    private $node;
    private diagram;
    private timeScale;
    private scoreScale;
    private svg;
    private brush;

    private targetProInfo;
    private cohortProInfo;
    private targetOrderInfo;
    private cohortOrderInfo;
    private findMinDate = dataCalc.findMinDate;//function for calculating the minDate for given patient record
    private parseTime = dataCalc.parseTime;
    private setOrderScale = dataCalc.setOrderScale;
    private getClassAssignment = dataCalc.getClassAssignment;
    private orderHierarchy = dataCalc.orderHierarchy;

    private maxDay;
    private minDay = 0;

    private zeroEvent = 'First Promis Score';
    private targetOrder;

   filteredOrders = {
       medGroup : [],
       proGroup : [],
   }

    height = 400;
    width = 600;
    promisDimension = {height: 500, width: 750};
    margin = {x: 80, y: 40};
    private sliderWidth = 10;
    private lineScale;
    private lineOpacity;

    constructor(parent: Element, diagram) {

        this.diagram = diagram;
        this.$node = select(parent)
            .append('div')
            .classed('diagramDiv', true);

        this.$node.append('input')
        .attr('type', 'button')
        .attr('value', 'Update Start Day to Event')
        .on('click', () => {
            this.clearDiagram();
            this.getDays(this.cohortProInfo);
            this.zeroEvent = this.targetOrder;
            this.$node.select('.zeroLine').select('text').text(this.zeroEvent);
            });

        this.$node.append('text').attr('id', 'eventLabel');

        this.svg = this.$node.append('svg')
            .attr('height', this.promisDimension.height)
            .attr('width', this.promisDimension.width);

        let scoreGroup = this.svg.append('g').classed('scoreGroup', true);

        // scales
        this.timeScale = scaleLinear()
            .range([0, this.promisDimension.width - this.margin.x])
            .clamp(true);

        this.scoreScale = scaleLinear()
            .domain([80, 10])
            .range([0, this.promisDimension.height - 3 * this.margin.y]).clamp(true);

        this.lineScale = scaleLinear()
            .domain([1, 6071])
            .range([1, .2])//.clamp(true);

        this.lineOpacity = scaleLinear()
            .domain([1, 6071])
            .range([.8, .2])//.clamp(true);

        // axis
        scoreGroup.append('g')
            .attr('class', 'xAxis')
            .attr('transform', `translate(${this.margin.x},${this.promisDimension.height - 2 * this.margin.y})`);
      
        scoreGroup.append('g')
            .attr('class', 'yAxis')
            .attr('transform', `translate(${(this.margin.x - this.sliderWidth)},${this.margin.y})`);

        // ----- SLIDER

        let slider = scoreGroup.append('g')
            .attr('class', 'slider')
            .attr('transform', `translate(${(this.margin.x - this.sliderWidth + 2)},${this.margin.y})`);

        this.brush = brushY()
            .extent([[0, 0], [this.sliderWidth - 2, this.scoreScale.range()[1]]])
            .on("end", () => {
                let start = event.selection[0];
                let end = event.selection[1];

                this.updateSlider(start, end)
            });

        slider.call(this.brush)
            .call(this.brush.move, this.scoreScale.range());

        // -----

        scoreGroup.append('text')
            .text(`${this.diagram}`)
            .attr('text-anchor', 'middle')
            .attr('transform', `translate(${this.margin.x / 4},${this.promisDimension.height * 0.5}) rotate(-90)`);

        scoreGroup.append('g')
            .attr('class', 'grid')
            .attr('transform', `translate(${this.margin.x},${this.margin.y})`)
            .call(axisLeft(this.scoreScale)
                .tickSize(-(this.promisDimension.width - this.margin.x))
            )
            .selectAll('text').remove();

            scoreGroup.append('g')
            .attr('id', 'pat_score');

            scoreGroup.append('g')
            .attr('id', 'similar_score');

            this.svg.append('g')
            .attr('id', 'pat_orders');

            this.svg.append('g')
            .attr('id', 'promis_orders');

        this.attachListener();

    }


    /**
     * Attach listeners
     */
    private attachListener() {

        events.on('change_promis_scale', ()=>{
            this.changeScale();
        });

        events.on('filter_cohort_by_event', (evt, item)=> {
            this.targetOrder = item[1];
        });

        events.on('domain updated', (evt, item)=> {
          
            this.maxDay = item[1];
            this.minDay = item[0];

            if(this.cohortProInfo != undefined){

                this.clearDiagram();
                this.drawPromisChart();
            }

        });

        events.on('got_promis_scores', (evt, item) => {  // called in parrallel on brush and 
                console.log('got promis score fired');
                this.cohortProInfo = item;
                this.clearDiagram();
                this.getDays(null);

                    });

        events.on('selected_cohort_change', (evt, item) => {  // called in parrallel on brush and 
                console.log('selected cohor change fired');
                this.cohortProInfo = item;
                this.clearDiagram();
                this.getDays(null);
        
                    });

        events.on('min date to cpt', (evt, item)=> {
            this.addMinDay(item);
        });

    }

    private addMinDay(eventArray) {

        let cohort = this.cohortProInfo;
        for(var i= 0;  i< cohort.length; i++) {
            var keyA = cohort[i].key;
            for(var j = 0; j< eventArray.length; j++) {
              var keyB = eventArray[j].key;
              if(keyA == keyB) {
                cohort[i].CPTtime = eventArray[j].time;
              }
            }
          }
          this.cohortProInfo = cohort;
          console.log(cohort);
}

    private getDays (date) {

         // ----- add diff days to the data

        let maxDiff = 0;// this sets the score scale max.
         //need to make this dynamic. 
        let diffArray = [];
        if (this.cohortProInfo != null) {

            this.cohortProInfo.forEach((g) => {

                let  minDate;

                if(g.CPTtime != undefined && date != null ) {
                    minDate = this.parseTime(g.CPTtime, null);
                    console.log(g);
                }else minDate = g.min_date;
               //these have already been parsed
               let maxDate = g.max_date;

                        g.value.forEach((d) => {
                        try {
                        d.diff = Math.ceil((this.parseTime(d['ASSESSMENT_START_DTM'], null).getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
                        maxDiff = d.diff > maxDiff ? d.diff : maxDiff
                        }
                        catch (TypeError) {
                        d.diff = -1;
                        }
                        });

                        g.days = (Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24))) + 1;
                        diffArray.push(g.days + 1);

                        g.value.sort((a, b) => ascending(a.diff, b.diff))

                        });
        }else{console.log('error'); }


        diffArray.sort((a, b) => ascending(a, b));
    
        events.fire('timeline_max_set', max(diffArray));
        events.fire('day_dist', this.cohortProInfo);

        this.drawPromisChart();
    }

    private changeScale(){
       // console.log(this.cohortProInfo);
        this.cohortProInfo.forEach(patient => {
            let minDiff = patient.value[0].diff;
            let baseline;
            console.log(minDiff);
         patient.value.forEach(value => {
            if(value.diff < Math.abs(minDiff)) minDiff = value.diff;
            if(value.diff == minDiff) baseline = +value.SCORE;
         });
         patient.value.forEach(value => {
            value.ogScore = value.SCORE;
            value.SCORE = +value.SCORE - baseline;
            
         });
        });
        console.log(this.cohortProInfo);
        this.clearDiagram();
        this.scoreScale.domain([30, -30]);
        events.fire('score_scale_changed');
        this.drawPromisChart();

        const medScoreGroup = this.svg.select('#similar_score');
        let zeroLine = medScoreGroup.append('g').classed('zeroLine', true)
        .attr('transform', () => `translate(${this.margin.x},${this.margin.y})`)

        zeroLine.append('line')
                .attr('x1', 0).attr('x2', 675)
                .attr('y1', this.scoreScale(0)).attr('y2', this.scoreScale(0)).attr('stroke-width', .5)
                .attr('stroke', 'red');

        zeroLine.append('text').text(this.zeroEvent).attr('x', this.timeScale(0));

    }
    /**
     * Draw the diagram with the given data from getSimilarRows
     * @param args
     */
    private drawPromisChart() {

            let lineCount = this.cohortProInfo.length;
   
            let similarData = this.cohortProInfo.map((d) => {
            let res = d.value.filter((g) => {//this is redundant for now because promis physical function already filtered
            return g['FORM'] == this.diagram;
            });
           
            res.sort((a, b) => ascending(a.diff, b.diff));
            res.forEach(r=> r.maxday = d.days);
            return res;
            });
    
            // -----  set domains and axis
            // time scale
            this.timeScale.domain([this.minDay, this.maxDay]);
    
            this.svg.select('.xAxis')
                .call(axisBottom(this.timeScale));
                
            this.svg.select('.yAxis')
                .call(axisLeft(this.scoreScale));
    
            // -------  define line function
            const lineFunc = line()
                .curve(curveMonotoneX)
                .x((d) => { return this.timeScale(+d['diff']); })
                .y((d) => { return this.scoreScale(+d['SCORE']); });
    
            // ------- draw
            const medScoreGroup = this.svg.select('#similar_score');
            let that = this;
            medScoreGroup.selectAll('.med_group')
                .data(similarData)
                .enter()
                .append('g')
                .attr('transform', () => {
                    return `translate(${this.margin.x},${this.margin.y})`;
                })
                .each(function (d) {
                    let currGroup = select(this)
                        .append('path')
                        .attr('class', 'proLine') 
                        .attr('stroke-width', that.lineScale(lineCount))
                        .attr('stroke-opacity', that.lineScale(lineCount))
                        .attr('d', () => lineFunc(d));
                })
                .on('click', (d) => {

                    events.fire('line_clicked', d);
                    this.addPromisDots(d);
                });

               let zeroLine = medScoreGroup.append('g').classed('zeroLine', true)
                    .attr('transform', () => `translate(${this.margin.x},${this.margin.y})`)

               zeroLine.append('line')
                    .attr('x1', this.timeScale(0)).attr('x2', this.timeScale(0))
                    .attr('y1', 0).attr('y2', 400).attr('stroke-width', .5).attr('stroke', 'red');
                zeroLine.append('text').text(this.zeroEvent).attr('x', this.timeScale(0));
        }
    
    private addPromisDots (d){

        let promisData = d;

        let promisRects = this.svg.select('#similar_score').selectAll('g').append('g')
        //.attr('transform', () => {
        //    return `translate(${this.margin.x},${this.margin.y})`;
       // })
        .selectAll('circle').data(promisData);
        promisRects.enter().append('circle').attr('cx', (d, i)=> this.timeScale(d.diff))
        .attr('cy', (d)=> this.scoreScale(d.SCORE)).attr('r', 5).attr('fill', '#21618C');

    }
    /**
     * Utility method
     * @param start
     * @param end
     */
    private updateSlider(start, end) {

        let lowScore = this.scoreScale.invert(end);
        let highScore = this.scoreScale.invert(start);

        let pro = this.svg.select('#pro_score')
            .selectAll('path')
            .style('opacity', 0);

        pro.filter(function (d) {
            if (!d.length) return false;
            return d[0].SCORE <= highScore && d[0].SCORE >= lowScore
        }).style('opacity', 1);


        let med = this.svg.select('#similar_score')
            .selectAll('path')
            .style('opacity', 0);

        med.filter(function (d) {
            if (!d.length) return false;
            return d[0].SCORE <= highScore && d[0].SCORE >= lowScore
        }).style('opacity', 1);

    }

    /**
     * clear the diagram
     */
    private clearDiagram() {

        this.svg.select('#pat_score').selectAll('g').remove();
        this.svg.select('#similar_score').selectAll('g').remove();
        this.svg.select('#pat_orders').selectAll('line,g').remove();
        this.svg.select('#similar_orders').selectAll('g').remove();
        this.svg.select('.zeroLine').remove();
    }


    
    /**
     * Get the data via API
     * @param URL
     * @returns {Promise<any>}
     */
    private async getData(URL) {
        return await ajax.getAPIJSON(URL);
    }


    private renderOrdersTooltip(tooltip_data) {

        let text = "<strong style='color:darkslateblue'>" + tooltip_data['ORDER_CATALOG_TYPE'] + "</strong></br>";
        text += "<span>" + tooltip_data['ORDER_MNEMONIC'] + "</span></br>";
        text += "<span>" + tooltip_data['ORDER_DTM'] + "</span></br>";
        return text;
    }

    /**
     * Show or hide the application loading indicator
     * @param isBusy
     */
    setBusy(isBusy: boolean) {
        let status = select('.busy').classed('hidden');
        if (status == isBusy)
            select('.busy').classed('hidden', !isBusy);
    }

}

export let targetPatientOrders;


export function create(parent: Element, diagram) {
    return new similarityScoreDiagram(parent, diagram);
}