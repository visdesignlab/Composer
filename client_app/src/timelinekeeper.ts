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
import { Domain } from 'domain';
import { path } from 'd3-path';

export class TimelineKeeper {

    private $node;
    private brush;
    private populationDemo;

    private parseTime = dataCalc.parseTime;
    private findMinDate = dataCalc.findMinDate;
    private findMaxDate = dataCalc.findMaxDate;
    private maxDay;
    private timeScale;
    private timeScaleMini;
    private queryDateArray;
    private queryDataArray;
    private margin;
    

    constructor(parent: Element) {

        this.$node = select(parent);
        this.margin = 50;
//1252 days is the max number of days for the patients
        this.timeScale = scaleLinear()
            .domain([-300, 1251])
            .range([0, 640]).clamp(true);

        this.$node.append('div').classed('day_line', true);

        this.attachListener();

    };

    private attachListener() {

        events.on('timeline_max_set', (evt, item) =>{
            this.maxDay = item;
            });

        events.on('timeline_max_set', (evt, item)=> {
            this.maxDay = item;
            select('.day_line').select('.maxDay').text(this.maxDay + " Days");
        });

        events.on('score_scale_changed', ()=> {
            select('.slider').call(this.brush).transition()
            .delay(850).call(this.brush.move, [this.timeScale(-20), this.timeScale(90)]);
        });
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