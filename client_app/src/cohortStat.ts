/**
 * Created by Jen Rogers on 2/28/2018.
 */
import * as ajax from 'phovea_core/src/ajax';
import {BaseType, select, selectAll,event} from 'd3-selection';
import {nest,values,keys,map,entries} from 'd3-collection'
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

    constructor(parent: Element){

        console.log('this is a test');
        this.$node = select(parent);
        let statView = this.$node.append('div').classed('cohort_stat_view', true);
       
        this.statWrapper = statView.append('div').classed('cohortStatWrapper', true);
        this.attachListener();
    }

    private attachListener(){
        events.on('cohort_stats', (evt, item)=> {
            console.log(item);
            let index = +item[1] + 1;
            
            this.statWrapper.append('div').append('text').text('Cohort ' + index);
            this.statWrapper.append('div').append('text').text(item[0].length);
        });
        events.on('clear_cohorts', ()=>{
            this.statWrapper.selectAll('div').remove();
        });

        events.on('cohort_selected', ()=> {
            this.statWrapper.selectAll('div').remove();
        });
    }

}

export function create(parent:Element) {
    return new CohortStat(parent);
  }