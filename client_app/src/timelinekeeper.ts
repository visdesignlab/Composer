/**
 * Created by Jen on 1/12/17.
 */

import * as ajax from 'phovea_core/src/ajax';
import {brushX} from 'd3-brush';
import * as d3 from 'd3';
import * as json from 'json-stringify-safe';
//import * as fs from 'graceful-fs';
import {BaseType, select, selectAll, event} from 'd3-selection';
import {nest, values, keys, map, entries} from 'd3-collection';
import * as events from 'phovea_core/src/event';
import {scaleLinear, scaleTime, scaleOrdinal} from 'd3-scale';
import {line, curveMonotoneX} from 'd3-shape';
import {timeParse} from 'd3-time-format';
import {extent, min, max, ascending, histogram, mean, deviation} from 'd3-array';
import {axisBottom, axisLeft} from 'd3-axis';
import {drag} from 'd3-drag';
import { format } from 'd3-format';
import {transition} from 'd3-transition';
import * as distributionDiagram from './distributionDiagram';
import {ITable, asTable} from 'phovea_core/src/table';
import {IAnyVector} from 'phovea_core/src/vector';
import {list as listData, getFirstByName, get as getById} from 'phovea_core/src/data';
import { writeJson } from 'fs-extra';
import * as dataCalc from './dataCalculations';
import * as similarityScoreDiagram from './similarityScoreDiagram';
import { Domain } from 'domain';
import { path } from 'd3-path';

export class TimelineKeeper {

    private $node;
    private brush;
    private icdObjects;
    private cptObjects;
    private populationDemo;
    private populationPromis;
    private filteredPromis;
    private parseTime = dataCalc.parseTime;
    private findMinDate = dataCalc.findMinDate;
    private findMaxDate = dataCalc.findMaxDate;
    private maxDay;
    private timeScale;
    private timeScaleMini;
    private selectedcohort;
    private queryDateArray;
    private queryDataArray;
    private targetOrder;
    private filteredCPT;

    constructor(parent: Element) {

        this.$node = select(parent);
//1252 days is the max number of days for the patients
        this.timeScale = scaleLinear()
            .domain([-300, 1251])
            .range([0, 700]).clamp(true);

        this.$node.append('div').classed('day_line', true);

        this.attachListener();

    };

    private attachListener() {

        events.on('timeline_max_set', (evt, item) =>{
            this.maxDay = item;
            });

        events.on('cpt_mapped', (evt, item)=> {
            // this.timeScale.domain([-10, this.maxDay]);
             this.filteredCPT = item;
        });

        events.on('selected_cpt_change', (evt, item) => {

           // this.timeScale.domain([-10, this.maxDay]);
            this.filteredCPT = item;
        });

        events.on('filteredPatients', (evt, item)=>{
            this.filteredPromis = item;
        });

        events.on('population demo loaded', (evt, item)=> {
            this.populationDemo = item;
            this.showStats();
        });

        events.on('pro_object_filtered', (evt, item)=> {
           this.filteredPromis = item;
        });

        events.on('selected_cohort_change', (evt, item)=> {
            this.selectedcohort = item;
         });

        events.on('timeline_max_set', (evt, item)=> {
            this.maxDay = item;
            select('.day_line').select('.maxDay').text(this.maxDay + " Days");
        });

        events.on('filteredPatients', (evt, item)=> this.filteredPromis = item);

        events.on('score_scale_changed', ()=> {
            select('.slider').call(this.brush).transition()
            .delay(850).call(this.brush.move, [this.timeScale(-20), this.timeScale(90)]);
        });
    }

    private showStats () {

        let timeline = this.$node.select('.day_line');

        let timelineMin = timeline.append('text').text('0 Days');

        let timelineSVG = timeline.append('svg').classed('day_line_svg', true)
                          .attr('height', 70).attr('width', 710);

        timelineSVG.append('g')
                        .attr('class', '.xAxisMini')
                        .attr('transform', () => `translate(30,50)`)
                        .call(axisBottom(this.timeScale));

        let timelineMax = timeline.append('text').classed('maxDay', true).text(this.maxDay);

         // ----- SLIDER

        let slider = timelineSVG.append('g')
         .attr('class', 'slider')
         .attr('transform', `translate(20,20)`);

        let that = this;

        this.brush = brushX()
        .extent([[0, 0], [700, 30]])
        .handleSize(0)
        .on("end", () => {
            if (event.selection === null) {
              //this.setOrderScale();
             
            } else {
              let start = this.timeScale.invert(event.selection[0]);
              let end = this.timeScale.invert(event.selection[1]);
                console.log(start);

              events.fire('domain updated', [start, end]);
            }

          });


        slider.call(this.brush)
         .call(this.brush.move, [this.timeScale(-30), this.timeScale(50)]);


     // -----
    }

    private updateDays(start, end) {

        let startDay = this.timeScale(start);
        let endDay = this.timeScale(end);

        this.maxDay = endDay;
    }

   

}

export function create(parent: Element) {
    return new TimelineKeeper(parent);
}