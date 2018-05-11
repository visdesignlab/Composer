/**
 * Created by saharmehrpour on 4/20/17.
 */

import * as ajax from 'phovea_core/src/ajax';
import {BaseType, select, selectAll, event} from 'd3-selection';
import {nest, values, keys, map, entries} from 'd3-collection';
import * as events from 'phovea_core/src/event';
import {scaleLinear, scaleTime, scaleOrdinal} from 'd3-scale';
import {line, curveMonotoneX, curveLinear} from 'd3-shape';
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
import { stringify } from 'querystring';


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
    private clicked;
    private cptObjectLoadedBool;

    private maxDay;
    private minDay = 0;

    private zeroEvent = 'First Promis Score';
    private targetOrder;
    private codeArray;

   filteredOrders = {
       medGroup : [],
       proGroup : [],
   };

    height = 400;
    width = 600;
    promisDimension = {height: 500, width: 750};
    margin = {x: 80, y: 40};
    private sliderWidth = 10;
    private lineScale;
    private lineOpacity;
    private eventDayBool;
    private scaleRelative = false;
    private yBrushSelection = false;

    constructor(parent: Element, diagram, cohortData, max, min) {

        const that = this;

        this.diagram = diagram;
        this.$node = select(parent)
            .append('div')
            .classed('diagramDiv', true);

        this.$node.append('input')
        .attr('type', 'button')
        .attr('value', 'Update Start Day to Event')
        .on('click', () => {
            this.zeroEvent = this.targetOrder;
            this.clearDiagram();
            this.getDays(this.cohortProInfo);
            this.eventDayBool = true;
            this.getBaselines(null);
            this.interpolate(this.cohortProInfo);

            this.$node.select('.zeroLine').select('text').text(this.zeroEvent);
            events.fire('send_stats');

            });

        this.$node.append('text').attr('id', 'eventLabel');

        this.$node.append('input')
            .attr('type', 'button')
            .attr('value', 'Change Promis Score Scale')
           // .on('click', () => events.fire('show_cpt'));
           // .on('click', () => events.fire('load_cpt'));
            .on('click', () =>events.fire('change_promis_scale'));

        this.$node.append('input')
            .attr('type', 'button')
            .attr('value', 'Aggregate')
            .on('click', () => {
               this.frequencyTest();
                });

        this.svg = this.$node.append('svg')
            .attr('height', this.promisDimension.height)
            .attr('width', this.promisDimension.width);

        let scoreGroup = this.svg.append('g').classed('scoreGroup', true);

        // scales
        this.timeScale = scaleLinear()
            .range([0, this.promisDimension.width - this.margin.x]);
            //.clamp(true);

        this.scoreScale = scaleLinear()
            .domain([80, 0])
            .range([0, this.promisDimension.height - 3 * this.margin.y]);//.clamp(true);

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
                let start = that.scoreScale.invert(event.selection[0]);
                let end = that.scoreScale.invert(event.selection[1]);

                events.fire('score_domain_change', [+start, +end]);
               
            });
 
        slider.call(this.brush)
              .call(this.brush.move, this.scoreScale.range());

        slider.on('click', () => {
                if(this.yBrushSelection == true) {
                    if(this.scaleRelative == true ){
                        this.scoreScale.domain([30, -30]);
                    }else{ this.scoreScale.domain([80, 0]);}
                   
                    slider.call(this.brush)
                    .call(this.brush.move, this.scoreScale.range());
                    this.clearDiagram();
                    this.drawPromisChart();
                    this.yBrushSelection = false;
                }
            })
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

        events.on('score_domain_change', (evt, item)=>{

            this.scoreScale.domain(item);
            this.clearDiagram();
            this.drawPromisChart();
            this.yBrushSelection = true;
        });

        events.on('filtered_by_quant', (evt, item)=> {

            this.cohortProInfo = item[0];
            this.clearDiagram();
            this.drawPromisChart();
        });

        events.on('filtered_by_count', (evt, item)=> {

            this.cohortProInfo = item[0];
            this.clearDiagram();
            this.drawPromisChart();
        });

        events.on('change_promis_scale', ()=>{

            if(!this.scaleRelative){
                this.scaleRelative = true;
                this.interpolate(this.cohortProInfo);

                  }

            else{this.scaleRelative = false;
                this.changeScale(this.cohortProInfo);
            };

        });

        events.on('event_clicked', (evt, item)=> {

            this.targetOrder = item;
            this.$node.select('#eventLabel').text(this.targetOrder);


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

        events.on('selected_cohort_change', (evt, item) => {  // called in parrallel on brush and 

            this.cohortProInfo = item;
            this.clearDiagram();
            this.getDays(null);

                    });
        
        events.on('selected_event_filter_change', (evt, item)=> {

            this.codeArray = item;

        });

        events.on('min_day_added', (evt, item)=> {
       
          this.cohortProInfo = item;

        });

    }

    private getDays(date) {

      if(this.cohortProInfo != null)  {

 // ----- add diff days to the data
          
            let maxDiff = 0;// this sets the score scale max.
            //need to make this dynamic. 
            let diffArray = [];
            if (this.cohortProInfo != null) {

                this.cohortProInfo.forEach((g) => {

                    let  minDate;

                    if(g.CPTtime != undefined && date != null ) {
                        minDate = this.parseTime(g.CPTtime, null);
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

                            g.value.sort((a, b) => ascending(a.diff, b.diff));

                            });
            }else{console.log('error'); }

            diffArray.sort((a, b) => ascending(a, b));
            events.fire('timeline_max_set', max(diffArray));
            events.fire('day_dist', this.cohortProInfo);
            if(this.maxDay != undefined){
                this.drawPromisChart();
            }


        }

    }

    private async getBaselines(pat)  {


        this.cohortProInfo.forEach(patient => {
            let negative = 0;
            let positive = 0;
            let zeroValue = false;
            let negMin;
            let posMin;
            let absMin;

            patient.value.forEach((value) => {
                if(value.diff < 0) { negative = negative + 1;    }
                if(value.diff > 0) { positive = positive + 1;    }
                if(value.diff == Math.abs(0)) {
                    zeroValue = true;
                    value.diff = 0;   }
            });

            absMin = patient.value[0].diff;
            let baseStart;
            let baseEnd;
            let baseline;
            patient.window = {'neg' : null, 'pos': null };

            if(negative == 0){ negMin = null; posMin = 6000;
            }else if(positive == 0){ posMin = null; negMin = patient.value[0].diff;
            }else {
                negMin = patient.value[0].diff;
                posMin = 6000;
            }
            if(zeroValue)  {
               
                posMin = 0;
                negMin = 0;
                absMin = 0;
            }

            patient.value.forEach(value => {
                if(absMin != 0) {
                //if(value.diff != Math.abs(0)){
                    if(value.diff < 0) {
                        if(negMin != null) {
                            if(Math.abs(value.diff) < Math.abs(negMin)) {

                                negMin = value.diff;
                            }};
                        }
                    if(value.diff > 0) {
                        if(posMin != null) {
                        if(value.diff < posMin) {
                        posMin = value.diff;
                        }};
                    }}

                if(absMin != 0) {
                    if(Math.abs(value.diff) < Math.abs(absMin)) {
                        absMin = +value.diff;
                            };
                }else {

                }

                if(value.diff == absMin) {baseline = value.SCORE; };
                if(value.diff == negMin) {baseStart = value.SCORE; };
                if(value.diff == posMin) {baseEnd = value.SCORE; };

            });

         patient.value.forEach((value) => {
             if(posMin == null || negMin == null) {
                 patient.window = null;
                 //value.SCORE = +value.SCORE - baseline;
                 value.ogScore = value.SCORE;
                 value.relScore = value.SCORE - baseline;
   
             }else {
                value.window = {'neg': [negMin, baseStart], 'pos': [posMin, baseEnd]};
                patient.window = {'neg': [negMin, baseStart], 'pos': [posMin, baseEnd]};
                value.ogScore = value.SCORE;
                value.relScore = value.SCORE - baseline;
             }

         });

        // if(patient.window != null){ consPole.log(patient); }

        });
        

    }
    //estimates 
    private interpolate(cohort) {

     cohort.forEach(pat => {
            if(pat.window != null && pat.window != undefined) {
                let b;
               
               if((pat.window.neg[0] == Math.abs(0)) || (pat.window.pos[0] == Math.abs(0))) {
                
                   //let b;
                   if(pat.window.neg[0] == 0){b = pat.window.neg[1]; }
                   if(pat.window.pos[0] == 0){b = pat.window.pos[1]; }
               }else{
                    let x1 = pat.window.neg[0];
                    let x2 = pat.window.pos[0];
                    let y1 = pat.window.neg[1];
                    let y2 = pat.window.pos[1];
                    let X;
                    let Y;

                    if (x1 < x2){X = x1; Y = y1}
                    else {X = x2; Y = y2};

                    let slope = (y2 - y1) / (x2 - x1);
                    b = Y - (slope * X);
                    pat.slope = slope;
                    pat.b = +b;
               }

                pat.value.forEach((value) => {
                    value.b = b;
                   // value.slope = slope;
                    value.relScore = value.ogScore - b;

                });

            }

        });
        this.cohortProInfo = cohort;
       
        events.fire('cohort_interpolated', cohort);
        this.changeScale(cohort);
        //return newCohort;
    }

    private changeScale(cohort) {
       // this.scaleRelative = true;
        if(this.scaleRelative)  {
            this.scoreScale.domain([30, -30]);
            this.cohortProInfo.forEach(patient => {
                patient.value.forEach(value => {
                    value.SCORE = +value.relScore;
                });
            });
            };
        if(!this.scaleRelative) {
            this.scoreScale.domain([80, 0]);
            this.cohortProInfo.forEach(patient => {
                patient.value.forEach(value => {
                    value.SCORE = +value.ogScore;
                });
            });
        };
        this.clearDiagram();
        this.drawPromisChart();

    }
    /**
     * Draw the diagram with the given data from getSimilarRows
     * @param args
     */
    private drawPromisChart() {

            if(this.scaleRelative){

                const medScoreGroup = this.svg.select('#similar_score');
                let zeroLine = medScoreGroup.append('g').classed('zeroLine', true)
                .attr('transform', () => `translate(${this.margin.x},${this.margin.y})`)

                zeroLine.append('line')
                        .attr('x1', 0).attr('x2', 675)
                        .attr('y1', this.scoreScale(0)).attr('y2', this.scoreScale(0)).attr('stroke-width', .5)
                        .attr('stroke', 'red');

            }

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
                .curve(curveLinear)
                .x((d) => { return this.timeScale(+d['diff']); })
                .y((d) => { return this.scoreScale(+d['SCORE']); });

            // ------- draw
            const medScoreGroup = this.svg.select('#similar_score');

           medScoreGroup.append("clipPath").attr('id', 'clip')
           .append('rect')
           .attr('width', 850)
           .attr('height', this.height - 20);

            let that = this;
            medScoreGroup.selectAll('.line_group')
                .data(similarData)
                .enter()
                .append('g')
                .classed('line_group', true)
                .attr('transform', () => {
                    return `translate(${this.margin.x},${this.margin.y})`;
                })
                .each(function (d) {
                    let currGroup = select(this)
                        .append('path')
                        .attr('class', d[0]['PAT_ID'])
                        .classed('proLine', true)
                        .attr("clip-path","url(#clip)")
                        .attr('stroke-width', that.lineScale(lineCount))
                        .attr('stroke-opacity', that.lineScale(lineCount))
                        .attr('d', lineFunc);
                })
                .on('click', (d) => {

                    let selected = document.getElementsByClassName(d[0].PAT_ID);
                    let line = selected[0];

                    if(line.classList.contains('selected')){

                        line.classList.remove('selected');
                        let dots = document.getElementsByClassName(d[0].PAT_ID + ' clickdots');
                        for (var i = dots.length; i--; ) {
                            dots[i].remove();
                         }

                       events.fire('line_unclicked', d);

                    }else {

                        line.classList.add('selected');
                        this.addPromisDotsClick(d);
                        events.fire('line_clicked', d);
                };

                })
                .on('mouseover', (d)=> {
                    this.addPromisDotsHover(d);
                })
                .on('mouseout', (d)=> {
                    this.removeDots();
                });

               let zeroLine = medScoreGroup.append('g').classed('zeroLine', true)
                    .attr('transform', () => `translate(${this.margin.x},${this.margin.y})`)

               zeroLine.append('line')//.attr('class', 'myLine')
                    .attr('x1', this.timeScale(0)).attr('x2', this.timeScale(0))
                    .attr('y1', 0).attr('y2', 400).attr('stroke-width', .5).attr('stroke', 'red');
                zeroLine.append('text').text(this.zeroEvent).attr('x', this.timeScale(0));
        }

    private addPromisDotsHover (d) {

            let promisData = d;

            let promisRect = this.svg.select('#similar_score');
            let dots = promisRect.selectAll('g').append('g')
            .selectAll('circle').data(promisData);
            dots.enter().append('circle').attr('class', 'hoverdots')
            .attr('clip-path','url(#clip)')
            .attr('cx', (d, i)=> this.timeScale(d.diff))
            .attr('cy', (d)=> {
                let score; 
                score = d.SCORE;
                return this.scoreScale(score);
            }).attr('r', 5).attr('fill', '#21618C');
    
            dots.append('circle').attr('cx', ()=> this.timeScale(0))
            .attr('cy', (d)=> this.scoreScale(d.b[0])).attr('r', 5).attr('fill', 'red');

    }

    private addPromisDotsClick (d) {

        let promisData = d;

        let promisRect = this.svg.select('#similar_score');
        let dots = promisRect.selectAll('g').append('g')
        .selectAll('circle').data(promisData);
        dots.enter().append('circle').attr('class', d[0].PAT_ID)
        .classed('clickdots', true)
        .attr('clip-path','url(#clip)')
        .attr('cx', (d, i)=> this.timeScale(d.diff))
        .attr('cy', (d)=> {
            let score; 
            score = d.SCORE;
            return this.scoreScale(score);
        }).attr('r', 5).attr('fill', '#FF5733');



        this.clicked = true;

}

    private removeDots () {
        selectAll('.hoverdots').remove();
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
        let aggline =  this.svg.select('#similar_score');
        aggline.select('.avLine').remove();
        aggline.selectAll('.stLine').remove();
    }

    // creates bin array for each patient scores and calulates slope for each bin
    //TODO : get rid of test in name and global variables?
    private frequencyTest(){

        this.svg.select('#similar_score').selectAll('.line_group');
        
        let cohort = this.cohortProInfo.filter(d=> d.value.length > 1);

        let negdiff = 0;
        let posdiff = 0;

        //get the extreme diff values for each side of the zero event
        cohort.forEach(pat => {

            let patDiffArray = pat.value.map(d=> +d.diff);
            let patneg = d3.min(patDiffArray);
            let patpos = d3.max(patDiffArray);

            if(patneg < negdiff) {negdiff = patneg;  };
            if(patpos > posdiff) {posdiff = patpos;  };
   
        });
        negdiff = Math.round(negdiff / 10) * 10;
        posdiff = Math.round(posdiff / 10) * 10;
        //get diff of days between maxneg diff and maxpos diff
        let daydiff = posdiff - negdiff;
        let bincount = Math.floor(daydiff/10);
        //new Array(bincount).fill({'x': null, 'y': null});

        cohort.forEach(pat=> {

            for (let i = 1; i < pat.value.length; i++) {

                if(pat.value[i] != undefined) {

                        let x1 = pat.value[i-1].diff;
                        let x2 = pat.value[i].diff;
                        let y1 = pat.value[i-1].SCORE;
                        let y2 = pat.value[i].SCORE;

                        pat.value[i].calc = [[x1, y1],[x2, y2]];

                        let slope = (y2 - y1) / (x2 - x1);

                        pat.value[i].slope = slope;
                        pat.value[i].b = y1 - (slope * x1);
                }
            }

            pat.bins = [];

            pat.bins.push({'x': negdiff, 'y': null});
            for (let i = 1; i < bincount; i++) {
               let diffplus = negdiff + (i * 10);
               pat.bins.push({'x': diffplus, 'y': null});
            }
            
            let patstart = pat.value[0].diff;
            patstart = Math.ceil(patstart / 10)* 10;
            let patend = pat.value[pat.value.length - 1].diff;
            patend = Math.ceil(patend/10)* 10;
          
            let first = pat.bins.find((v)=> v.x == patstart);
            let last = pat.bins.find((v)=> v.x == patend);

            if(first != undefined){
    
                const startIndex = pat.bins.indexOf(first);
                first.y = pat.value[0].SCORE; }

            if(last != undefined){
        
                last.y = pat.value[pat.value.length - 1].SCORE; }


            for(let i = pat.bins.indexOf(first); i < pat.bins.indexOf(last); i ++){
              
                let x = pat.bins[i].x;
              
                    pat.bins[i].topvalue = pat.value.find((v)=> v.diff > pat.bins[i].x);
                        let top = pat.value.find((v)=> v.diff > x);
                
                        if(top != undefined){
                  
                         pat.bins[i].y = (top.slope * x) + top.b;
                     
                         };
            }


        });

        this.drawAgg(cohort);

    }

    //draws the lines for the mean and standard deviation for the PROMIS scores
    private drawAgg(cohort){
       
        let patbin = cohort.map((d)=> {
        
        let bin = d.bins;
    
        return bin;
        });

        let means = [];
        let devs = [];
        
        for(let i = 0; i < patbin[0].length; i++){
            let mean = d3.mean(patbin.map(d => d[i].y));
            let x = d3.mean(patbin.map(d => d[i].x));
            let dev =  d3.deviation(patbin.map(d => d[i].y));
            means.push([x, mean]);
            devs.push(dev);
        }
       // [d3.mean(yval.map(d => d[0])), d3.mean(yval.map(d => d[1])), ];
        //let topdev = [];
        let botdev = means.map((d, i)=> {
            let y = d[1] - devs[1];
            let x = d[0];

            return [x, y];
        });

        let topdev = means.map((d, i)=> {
            
           let y = d[1] + devs[1];
           let x = d[0];

           return [x, y];
        
        });

        let lineCount = this.cohortProInfo.length;

        let data = means;
        // -----  set domains and axis
        // time scale
        this.timeScale.domain([this.minDay, this.maxDay]);

        this.svg.select('.xAxis')
            .call(axisBottom(this.timeScale));

        this.svg.select('.yAxis')
            .call(axisLeft(this.scoreScale));
        // -------  define line function
        const lineFunc = line()
            .curve(curveLinear)
            .x((d, i) => { return this.timeScale(+d[0]); })
            .y((d) => { return this.scoreScale(+d[1]); });

        // ------- draw
        const medScoreGroup = this.svg.select('#similar_score');

        let that = this;
        medScoreGroup
            .append('path')
            .classed('avLine', true)
            .attr('clip-path','url(#clip)')
            .data([data])
            .attr('d', lineFunc)
            .attr('transform', () => {
                return `translate(${this.margin.x},${this.margin.y})`;
            });

            medScoreGroup
            .append('path')
            .classed('stLine', true)
            .attr('clip-path','url(#clip)')
            .data([topdev])
            .attr('d', lineFunc)
            .attr('transform', () => {
                return `translate(${this.margin.x},${this.margin.y})`;
            });

            medScoreGroup
            .append('path')
            .classed('stLine', true)
            .attr('clip-path','url(#clip)')
            .data([botdev])
            .attr('d', lineFunc)
            .attr('transform', () => {
                return `translate(${this.margin.x},${this.margin.y})`;
            });
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


export function create(parent: Element, diagram, cohortData,max, min) {
    return new similarityScoreDiagram(parent, diagram, cohortData, max, min);
}