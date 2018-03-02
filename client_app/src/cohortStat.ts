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

        events.on('cohort_interpolated', (evt, item)=>{

        
            //this.interpolate(item).then(value=> console.log(value));
            console.log(item);
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
            //this.interpolate(this.cohort);
        });
        events.on('clear_cohorts', ()=>{
            this.statWrapper.selectAll('div').remove();
        });

        events.on('cohort_selected', ()=> {
            this.statWrapper.selectAll('div').remove();
        });

    }

    private getAverage(cohort) {
        //console.log(cohort);
        let oneval = [];
        let outofrange = [];
        let topStart = [];
        let middleStart = [];
        let bottomStart = [];

        cohort.forEach(patient => {
            if(patient.value.length == 1){
                if(patient.value[0].diff > Math.abs(90)){
                    outofrange.push(patient);
                }
              
                oneval.push(patient.key);

            }
            if(patient.b != undefined){
                console.log(patient.b);
                patient.scorespan = [patient.b];
                patient.value.forEach(value => {
                    if(value.diff > 0 && value.diff < 30){console.log(value.SCORE)};
                });
                

            }
            
        });
        console.log(outofrange);
      
        this.statWrapper.append('div').append('text').text('Num of Patients with 1 score : '+ oneval.length);
        this.statWrapper.append('div').append('text').text('Num of Patients with 1 score for than 90 days from code: '+ outofrange.length);
    }

    private async interpolate(cohort) {


        cohort.forEach(pat => {
            if(pat.window != null && pat.window != undefined) {
                let b;
                //console.log(pat.window.neg[0]);
               if((pat.window.neg[0] == Math.abs(0)) || (pat.window.pos[0] == Math.abs(0))) {
                   //console.log('zero value yo');
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
                    
                    return pat.b = +b, pat.slope = slope;
               }

               // console.log(pat);
                pat.value.forEach((value) => {
                    value.b = b;
                   // value.slope = slope;
                   // value.relScore = value.ogScore - b;
                });
                return pat;
            }//else{ console.log('no window');}

        });

        return cohort;

    }


}

export function create(parent:Element) {
    return new CohortStat(parent);
  }