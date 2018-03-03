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

    constructor(parent: Element){

        this.$node = select(parent);
        let statView = this.$node.append('div').classed('cohort_stat_view', true);
       
        this.statWrapper = statView.append('div').classed('cohortStatWrapper', true);
        this.attachListener();
    }

    private attachListener(){
        events.on('filter_aggregate', (evt, item) => {
            //console.log(item);
            item.forEach(pat => {
               // console.log(pat);
                pat.value.forEach(value => {
                    if(value.diff > 0 && value.diff < 30){console.log(value)};
                });
            });

        });

        events.on('cohort_interpolated', (evt, item)=>{

            this.cohort = item;

        });

        events.on('cohort_stats', (evt, item)=> {
            
            let index = +item[1] + 1;
            if(this.cohort == null){
                this.cohort = item[0];
            }

            this.statWrapper.append('div').append('text').text('Cohort ' + index);
            this.statWrapper.append('div').append('text').text(item[0].length);

            this.getAverage(this.cohort);
           
        });
        events.on('clear_cohorts', ()=>{
            this.statWrapper.selectAll('div').remove();
        });

        events.on('cohort_selected', ()=> {
            this.statWrapper.selectAll('div').remove();
        });

    }

    private getAverage(cohort) {
       
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
            if(patient.b != undefined){
                barray.push(patient.b);
                if(patient.b >= 43){topStart.push(patient)};
                if(patient.b < 43 && patient.b > 29){ middleStart.push(patient)};
                if(patient.b <= 29){bottomStart.push(patient)};
                patient.scorespan = [patient.b];
             /*
                patient.value.forEach(value => {
                    if(value.diff > 0 && value.diff < 30){console.log(value.SCORE)};
                });*/
                

            }

        });
        
        this.statWrapper.append('div').append('input') .attr('type', 'button')
        .attr('value', 'Filter Aggregate').on('click', () =>events.fire('filter_aggregate', bottomStart));
        this.statWrapper.append('div').append('text').text('Num of Patients with 1 score : '+ oneval.length);
        this.statWrapper.append('div').append('text').text('Num of Patients with 1 score for > 90 days from code: '+ outofrange.length);
        this.statWrapper.append('div').append('text').text('Average interpolated score at 0 day: ' + d3.mean(barray));
        this.statWrapper.append('div').append('text').text('Top Starting Percentile (>=43): ' + topStart.length + ' patients');
        this.statWrapper.append('div').append('text').text('Top Starting Percentile (<43, >29): ' + middleStart.length + ' patients');
        this.statWrapper.append('div').append('text').text('Top Starting Percentile (<=29): ' + bottomStart.length + ' patients');
    }

}

export function create(parent:Element) {
    return new CohortStat(parent);
  }