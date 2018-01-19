/**
 * Created by Jen on 1/19/2018.
 */

import * as ajax from 'phovea_core/src/ajax';
import {select, selectAll, event} from 'd3-selection';
import {values,keys,entries} from 'd3-collection';
import {type} from 'os';
import * as events from 'phovea_core/src/event';
//import {transition} from 'd3-transition';
//import {Constants} from './constants';
import * as parallel from './parallel';
import {scaleLinear,scaleTime,scaleOrdinal, scaleBand} from 'd3-scale';
//importing other modules from app
import * as demoGraph from './demoGraphs';

export class individualStats {

    private $node;
    private statWin

    constructor(parent: Element) {
        this.$node = select(parent)
        .append('div')
        .classed('individualStatWrapper', true);

        this.statWin = this.$node.append('div').classed('patientPromisOrders', true);
        this.attachListener();

    }

    private attachListener () {
        events.on('line_clicked', (evt, item)=> {
            console.log(item);
            this.drawOrderWin(item);
        });

    }

    private drawOrderWin(orders){

        let statArray = [];
        this.statWin.append('div').append('text').text('ID :   '+ orders[0].PAT_ID).append('br');
        this.statWin.append('br').append('br');


        orders.forEach((d, i) => {
            let div = this.statWin.append('div').classed('order' + (i + 1) + " ' ", true);
    
            div.append('text').text('Date :   '+ d.ASSESSMENT_START_DTM);
            div.append('br');
            
            div.append('text').text('Score :   '+ d.SCORE);
            div.append('br');
            div.append('br');
        });
       
    }

}

export function create(parent:Element) {
    return new individualStats(parent);
  }