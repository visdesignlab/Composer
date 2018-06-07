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
import {transition} from 'd3-transition';

export class individualStats {

    private $node;
    private statWin;
    private rectWin;
    private timeScale;
    private rectBoxDimension;
    private rectSvg;
    private cptFilter;

    constructor(parent: Element) {

        this.$node = select(parent)
        .append('div')
        .classed('individualStatWrapper', true);

        this.rectWin = this.$node.append('div').classed('patientCPTOrders', true);
        this.statWin = this.$node.append('div').classed('patientPromisOrders', true);
       

        this.rectBoxDimension = {'width' : 720, 'height': 200};

        this.timeScale = scaleLinear().range([0, 630]);
     
        this.rectSvg = this.rectWin.append('svg')
            .attr('width', this.rectBoxDimension.width)
            .attr('height', this.rectBoxDimension.height);

        this.attachListener();

    }

    private attachListener () {
        events.on('chosen_pat_cpt', (evt, item)=> {
            this.rectSvg.selectAll('.rect_group').remove();
            this.drawPatRects(item);
        });

        events.on('send_filter_to_codebar', (evt, item)=>{
            console.log(item.filter(d=> {return d[0] == 'CPT'}));
            this.cptFilter = item.filter(d=> {return d[0] == 'CPT'});
        });

    }

    private drawOrderWin(orders){

        let statArray = [];
        let patBox = this.statWin.append('div').attr('class', orders.key).classed('patBox', true);
        patBox.append('div').classed('patLabel', true).append('text').text('ID :   '+ orders.key).append('br');
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
    
        this.timeScale.domain([-30, 40]);
        let patGroup = this.rectSvg.selectAll('.rect_group').data(orders);

        patGroup.exit().remove();
        
        let patGroupEnter = patGroup.enter()
        .append('g').classed('rect_group', true).attr('width', 720);

        patGroup = patGroupEnter.merge(patGroup);

        patGroup
        .attr('transform', 
        (d, i) => `translate(0,${(i * 26)})`);

        let patGroupText = patGroupEnter
        .append('text').text(d=>d[0].key)
        .attr('transform', `translate(0,12)`);

        let patInnerGroup = patGroupEnter.append('g')
        .classed('patInnerGroup', true)
        .attr('transform', 'translate(70, 0)')
        .attr('width', 600);

        let rectGroup = patGroup.select('.patInnerGroup')
        .selectAll('.visitDays')
        .data(d => d);

        let rectGroupEnter = rectGroup
        .enter()
        .append('g')

        rectGroup = rectGroupEnter.merge(rectGroup);

        rectGroup.exit().remove();

        rectGroup.classed('visitDays', true)
        .attr('transform', (d) => `translate(`+ this.timeScale(d.diff) +`,0)`);

        let rects = rectGroup.selectAll('rect')
        .data(d => d.value[0]);

    let rectsEnter = rects
        .enter()
        .append('rect')
        .attr('class', d => d)
        .classed('cpt-rect', true);
    
    rects = rectsEnter.merge(rects);

    rects.exit().remove();

    rects
        .attr('y', 0)
        .attr('width', 10)
        .attr('height', 25)
    
    .on("mouseover", (d) => {
            let t = transition('t').duration(500);
            select(".tooltip")
                .html(() => {
                    return this.renderOrdersTooltip(d);
                })
                .transition(t)
                .style("opacity", 1)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY + 10}px`);
        })
        .on("mouseout", () => {
            let t = transition('t').duration(500);
            select(".tooltip").transition(t)
                .style("opacity", 0);
        })
        .on('click', function (d) {
       // console.log(d);
        let parentData = select(this.parentNode);
       // console.log(parentData);
    });
    if(this.cptFilter != undefined && this.cptFilter.length != 0){
        let selectedRects = selectAll('.cpt-rect');
       
        selectedRects.on('click', d=> console.log(d));
        let codes = this.cptFilter.map(c => c[1]);
       // console.log(codes);

        codes.forEach(code => {
            console.log(code);
            console.log(selectedRects.filter(d=> code[0].includes(d.toString())));
            let selected = selectedRects.filter(d=> code[0].includes(d.toString()));
           // selected.classed('selected-cpt', true);
            selected.classed(code[1][0].key, true);
        });
        
    }
   
    }

    private renderOrdersTooltip(tooltip_data) {
        let text
        text = tooltip_data;
        
        /*
    if(tooltip_data['CPT_1'] !== 0){text = "<strong style='color:darkslateblue'>" + tooltip_data['CPT_1'] + "</strong></br>";}
        if(tooltip_data['CPT_2'] !== 0){text += "<span>" + tooltip_data['CPT_2'] + "</span></br>"; }
      */
        return text;
      }

}

export function create(parent:Element) {
    return new individualStats(parent);
  }