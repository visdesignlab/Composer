/**
 * Created by Jen Rogers on 2/28/2018.
 */
import * as ajax from 'phovea_core/src/ajax';
import {BaseType, select, selectAll,event} from 'd3-selection';
import {nest,values,keys,map,entries} from 'd3-collection';
import * as events from 'phovea_core/src/event';
import {scaleLinear,scaleTime,scaleOrdinal} from 'd3-scale';
import {line,curveMonotoneX} from 'd3-shape';
import {timeParse} from 'd3-time-format';
import {extent, min, max, ascending} from 'd3-array';
import {axisBottom,axisLeft} from 'd3-axis';
import {drag} from 'd3-drag';
//import {Constants} from './constants';
import * as dataCalc from './dataCalculations';
import {transition} from 'd3-transition';
import {brush, brushY, brushX} from 'd3-brush';
import * as similarityScore  from './similarityScoreDiagram';
import * as d3 from 'd3';
import {tsv} from 'd3-request';
import {argFilter} from 'phovea_core/src/';
import { filteredOrders } from './similarityScoreDiagram';
import * as codeDict from './cptDictionary';

export class CohortStat{
    private $node;
    private statWrapper;
    private statView;
    private cohort;
    private index;

    constructor(parent: Element, cohort, index){

        this.cohort = cohort;
        this.index = index;
        let number = index + 1;
       

        this.$node = select(parent).attr('id', index);
        this.statView = this.$node.append('div').classed('cohort_stat_view', true);
        this.statWrapper = this.statView.append('div').classed('cohortStatWrapper' + index, true);
        this.getPromisCount(this.cohort);
        this.buildStatBox();
        this.attachListener();
    }

    private attachListener(){
        events.on('calculate_agg', (evt,item)=> {
            this.statWrapper.select('.statsAfterEvent').remove();
            this.getAverage(item);
        });
    }

    private getPromisCount(cohort){

        let oneval = [];
        let outofrange = [];
        let topStart = [];
        let middleStart = [];
        let bottomStart = [];
        let barray = [];

        cohort.forEach(patient => {
            if(patient.value.length == 1){

                if(patient.value[0].diff > Math.abs(90)){
                    outofrange.push(patient);
                }

                oneval.push(patient.key);

            }
        });

        this.statWrapper.append('div').append('text').text('Patients with 1 score : '+ oneval.length);

    }

    private getAverage(selected) {
        let index = selected[1];
        let cohort = selected[0];
        let statAfterEvent = this.statWrapper.append('div').classed('statsAfterEvent', true);
      
       // let oneval = [];
        let outofrange = [];
        let topStart = [];
        let middleStart = [];
        let bottomStart = [];
        let barray = [];

        cohort.forEach(patient => {
  
            if(patient.b != undefined){
                barray.push(patient.b);
                if(patient.b >= 43){topStart.push(patient)};
                if(patient.b < 43 && patient.b > 29){ middleStart.push(patient)};
                if(patient.b <= 29){bottomStart.push(patient)};
                patient.scorespan = [patient.b];

            }else{
            
            }

        });
    
 
        statAfterEvent.append('div').append('text').text('Patients with 1 score for > 90 days from code: '+ outofrange.length);
        statAfterEvent.append('div').append('text').text('Average interpolated score at 0 day: ' + d3.mean(barray));
        statAfterEvent.append('div').append('text').text('Top Starting Percentile (>=43): ' + topStart.length + ' patients');
        statAfterEvent.append('div').append('text').text('Top Starting Percentile (<43, >29): ' + middleStart.length + ' patients');
        statAfterEvent.append('div').append('text').text('Top Starting Percentile (<=29): ' + bottomStart.length + ' patients');
    }

    private buildStatBox()  {
       // console.log(this.cohort);
       // console.log(this.index);
    }

}

export function create(parent:Element, cohort, index) {
    return new CohortStat(parent, cohort, index);
  }