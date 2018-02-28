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

export class PlotKeeper {

    private $node;
    private cohortData;
    private plotDiv
    private maxDay;
    private minDay;

    constructor(parent: Element) {

        this.$node = select(parent);

        this.plotDiv = this.$node.append('Div').classed('allDiagramDiv', true);
        similarityScoreDiagram.create(this.plotDiv.node(), 'PROMIS Bank v1.2 - Physical Function', this.cohortData, this.maxDay, this.minDay);
        
        this.attachListener();
    }

    private attachListener(){
        let that = this;

        events.on('domain updated', (evt, item)=> {
            
            this.maxDay = item[1];
            this.minDay = item[0];
        });

        events.on('cohort_made', ()=> {
           // similarityScoreDiagram.create(this.plotDiv.node(), 'PROMIS Bank v1.2 - Physical Function', this.cohortData, this.maxDay, this.minDay);
        });

        events.on('got_promis_scores', (evt, item) => {  // called in parrallel on brush and 
            console.log('fired');
            that.cohortData = item;
            //similarityScoreDiagram.create(that.plotDiv.node(), 'PROMIS Bank v1.2 - Physical Function', this.cohortData);
            //this.clearDiagram();
           // this.getDays(null);
           //similarityScoreDiagram.create(this.plotDiv.node(), 'PROMIS Bank v1.2 - Physical Function', this.cohortData);
                });

    events.on('selected_cohort_change', (evt, item) => {  // called in parrallel on brush and 

            this.cohortData = item;
           // this.clearDiagram();
           // this.getDays(null);
           // events.fire('change_promis_scale');
                });
    }
}


export function create(parent: Element) {
    return new PlotKeeper(parent);
}