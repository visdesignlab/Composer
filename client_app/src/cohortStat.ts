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
    private cohort;
    private index;

    constructor(parent: Element, cohort, index){

        this.cohort = cohort;
        this.index = index;
        let number = index + 1;
       

        this.$node = select(parent);
        let statView = this.$node.append('div').classed('cohort_stat_view', true);
        this.statWrapper = statView.append('div').classed('cohortStatWrapper', true);
       // this.statWrapper.append('div').append('text').text('Cohort ' + number);
       // this.statWrapper.append('div').append('text').text(this.cohort.length);
        this.getPromisCount(this.cohort);
       // this.getAverage(this.cohort);
        this.buildStatBox();
        this.attachListener();
    }

    private attachListener(){

        events.on('calculate_agg', (evt,item)=> {
            console.log('agg calc!');
            this.getAverage(this.cohort);
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

    private getAverage(cohort) {
        
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
    
 
        this.statWrapper.append('div').append('text').text('Patients with 1 score for > 90 days from code: '+ outofrange.length);
        this.statWrapper.append('div').append('text').text('Average interpolated score at 0 day: ' + d3.mean(barray));
        this.statWrapper.append('div').append('text').text('Top Starting Percentile (>=43): ' + topStart.length + ' patients');
        this.statWrapper.append('div').append('text').text('Top Starting Percentile (<43, >29): ' + middleStart.length + ' patients');
        this.statWrapper.append('div').append('text').text('Top Starting Percentile (<=29): ' + bottomStart.length + ' patients');
    }

    private buildStatBox()  {
       // console.log(this.cohort);
       // console.log(this.index);
    }

}

export function create(parent:Element, cohort, index) {
    return new CohortStat(parent, cohort, index);
  }