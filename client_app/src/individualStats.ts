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
import * as d3 from 'd3';
import {extent, min, max, ascending} from 'd3-array';
import {axisBottom,axisLeft} from 'd3-axis';

export class individualStats {

    private $node;
    private statWin;
    private rectWin;
    private timeScale;
    private rectBoxDimension;
    private rectSvg;

    constructor(parent: Element) {

        this.$node = select(parent)
        .append('div')
        .classed('individualStatWrapper', true);

        this.rectWin = this.$node.append('div').classed('patientCPTOrders', true);
        this.statWin = this.$node.append('div').classed('patientPromisOrders', true);
       

        this.rectBoxDimension = {'width' : 600, 'height': 30};

        this.timeScale = scaleLinear()
        .range([0, this.rectBoxDimension.width])
        .clamp(true);

        this.rectSvg = this.rectWin.append('svg')
        .attr('width', this.rectBoxDimension.width)
        .attr('height', this.rectBoxDimension.height);

        this.attachListener();


    }

    private attachListener () {
        events.on('chosen_pat_cpt', (evt, item)=> {
            this.drawPatRects(item);
        });

        events.on('line_clicked', (evt, item)=> {
            this.drawOrderWin(item);
        });
        events.on('line_unclicked', (evt, item)=>{
           // console.log('item');
            this.statWin.select('.'+item[0].PAT_ID).remove();
        });

    }

    private drawOrderWin(orders){

        let statArray = [];
        let patBox = this.statWin.append('div').attr('class', orders[0].PAT_ID).classed('patBox', true);
        patBox.append('div').classed('patLabel', true).append('text').text('ID :   '+ orders[0].PAT_ID).append('br');
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

    private drawPatRects(orders) {
        this.timeScale.domain([-365, 365]);
        let rectGroup = this.rectSvg.selectAll('.rect_group').data(orders).enter()
        .append('g').classed('rect_group', true);

        let rects = rectGroup.selectAll('.ind_order_rect').data(d=> d);

        rects.exit().remove();

        let rectsEnter = rects.enter().append('rect').classed('.ind_order_rect', true);

        rects = rectsEnter.merge(rects);

        rects//.attr('class', this.getClassAssignment('ORDER_STATUS'))
        .attr('x', (g) => this.timeScale(g.diff))
        .attr('y', 0)
        .attr('width', 10)
        .attr('height', 25);

    }

}

export function create(parent:Element) {
    return new individualStats(parent);
  }