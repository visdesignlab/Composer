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
          //  this.statWin.selectAll('div').remove();
            this.drawOrderWin(item);
        });
        events.on('line_unclicked', (evt, item)=>{
            console.log('item');
            this.statWin.select('.'+item[0].PAT_ID).remove();
        });

    }

    private drawOrderWin(orders){

        let statArray = [];
        let patBox = this.statWin.append('div').attr('class', orders[0].PAT_ID).classed('patBox', true);
        patBox.append('div').append('text').text('ID :   '+ orders[0].PAT_ID).append('br');
        patBox.append('br').append('br');


        orders.forEach((d, i) => {
            let div = patBox.append('div').classed('order' + (i + 1) + " ' ", true);
    
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