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

        this.$node = select(parent);
        let statView = this.$node.append('div').classed('cohort_stat_view', true);

        this.statWrapper = statView.append('div').classed('cohortStatWrapper', true);
        this.attachListener();
    }

    private attachListener(){

        events.on('selected_stat_change', (evt, item) => {
            this.statWrapper.selectAll('div').remove();
            //console.log(item);
            this.cohort = item[0];
            this.index = +item[1] + 1;
            this.statWrapper.append('div').append('text').text('Cohort ' + this.index);
            this.statWrapper.append('div').append('text').text(item[0].length);
            this.getAverage(this.cohort);
            this.buildStatBox();
        });

        events.on('cohort_interpolated', (evt, item)=>{

            this.cohort = item;

        });

        events.on('cohort_stats', (evt, item)=> {
            
            this.index = +item[1] + 1;
            if(this.cohort == null){
                this.cohort = item[0];
            }

            this.statWrapper.append('div').append('text').text('Cohort ' + this.index);
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
       
        this.statWrapper.append('input').attr('type', 'radio').attr('name', 'sample').attr('id', 'sample1')
        .attr('value', 'bottom').on('click', () =>{});
        this.statWrapper.append('label').attr('for', 'sample1').text('bottom');
        this.statWrapper.append('input').attr('type', 'radio').attr('name', 'sample').attr('id', 'sample2')
        .attr('value', 'middle').on('click', () =>console.log(this));
        this.statWrapper.append('label').attr('for', 'sample2').text('middle');
        this.statWrapper.append('input').attr('type', 'radio').attr('name', 'sample').attr('id', 'sample3')
        .attr('value', 'top').on('click', () =>console.log(this));
        this.statWrapper.append('label').attr('for', 'sample1').text('top');
        this.statWrapper.append('div').append('input').attr('type', 'submit')
        .attr('value', 'Filter Aggregate').on('click', () =>{
            let checked = document.querySelector('input[name="sample"]:checked');
           
            let selected;
            if(checked['value'] == 'bottom'){selected = bottomStart;}
            if(checked['value'] == 'middle'){selected = middleStart;}
            if(checked['value'] == 'top'){selected = topStart;}
            events.fire('filter_aggregate', selected)});
    
        this.statWrapper.append('div').append('text').text('Num of Patients with 1 score : '+ oneval.length);
        this.statWrapper.append('div').append('text').text('Num of Patients with 1 score for > 90 days from code: '+ outofrange.length);
        this.statWrapper.append('div').append('text').text('Average interpolated score at 0 day: ' + d3.mean(barray));
        this.statWrapper.append('div').append('text').text('Top Starting Percentile (>=43): ' + topStart.length + ' patients');
        this.statWrapper.append('div').append('text').text('Top Starting Percentile (<43, >29): ' + middleStart.length + ' patients');
        this.statWrapper.append('div').append('text').text('Top Starting Percentile (<=29): ' + bottomStart.length + ' patients');
    }

    private buildStatBox()  {
        console.log(this.cohort);
        console.log(this.index);
    }

}

export function create(parent:Element, cohort, index) {
    return new CohortStat(parent, cohort, index);
  }