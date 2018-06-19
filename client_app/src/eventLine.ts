/**
 * Created by Jen Rogers on 3/22/2018.
 */
import * as ajax from 'phovea_core/src/ajax';
import {BaseType, select, selectAll, event} from 'd3-selection';
import {nest, values, keys, map, entries} from 'd3-collection';
import * as events from 'phovea_core/src/event';
import {scaleLinear, scaleTime, scaleOrdinal} from 'd3-scale';
import {line, curveMonotoneX, curveLinear} from 'd3-shape';
import {timeParse} from 'd3-time-format';
import {extent, min, max, ascending} from 'd3-array';
import {axisBottom, axisLeft} from 'd3-axis';
import {drag} from 'd3-drag';
import * as d3 from 'd3';
//import {Constants} from './constants';
import {transition} from 'd3-transition';
import {brush, brushY} from 'd3-brush';
import * as dataCalc from './dataCalculations';
import * as dataManager from './dataManager';
import {ITable, asTable} from 'phovea_core/src/table';
import {IAnyVector, INumericalVector} from 'phovea_core/src/vector';
import {list as listData, getFirstByName, get as getById} from 'phovea_core/src/data';
import {range, list, join, Range, Range1D, all} from 'phovea_core/src/range';
import {asVector} from 'phovea_core/src/vector/Vector';
import {argFilter} from 'phovea_core/src/';

export class EventLine {
    private $node;
    private eventScale;
    private circleScale;
    private filter;
    private startCodes;

    constructor(parent: Element, cohort) {

    this.$node = select(parent);
    this.eventScale = scaleLinear().domain([0, 4])
            .range([0, 750]).clamp(true);

    this.circleScale = scaleLinear().domain([0, 3000])
            .range([1, 15]).clamp(true);

    this.attachListener();
    this.drawLine();
    this.drawEventButtons();
    const that = this;
    this.startCodes = null;

    }

    private attachListener() {

    events.on('send_filter_to_codebar', (evt, item)=> {
            this.updateEvents(item);
            let eventIndex = item.length;
            let event = item[eventIndex -1];
         
           if(event[1].length != 0){
            this.startCodes = event[1];
           }else{
               this.startCodes = null;
           }
          
    });
    }

    private drawLine(){
        let eventLine = this.$node;
        let eventLineSvg = eventLine.append('svg').classed('event_line_svg', true)
        .attr('height', 25).attr('width', 700);

    }

    private updateEvents(filters) {
       
        function filText(d){
            if(d[0] == 'demographic'){return 'First Score'}else{
                let label = d[1][1];
                return label[0].parent;
            }
        }

        function labelClick(d){
            let rec = select(d);
                if(d[0] == 'demographic'){
                  //  events.fire('revert_to_promis');
                    that.startCodes = null;
                    console.log(that.startCodes);
                    }else{
                    that.startCodes = d[1];
                    console.log(that.startCodes);
                   // events.fire('event_selected', d[1]);
                }
        }

        let that = this;
        let svg = this.$node.select('.event_line_svg');
        
        svg.selectAll('.event_label').remove();

        let events = svg.selectAll('.event_label').data(filters);
        events.exit().remove();
        let eventsEnter = events.enter().append('g').classed('event_label', true);

        events = eventsEnter.merge(events);
        events.attr('transform', (d, i) => `translate(${(i * 82)}, 0)`);
       
        let rect = events.append('rect').attr('rx', 3).attr('ry', 3);
        let text = events.append('text').text(d=> filText(d)).attr('transform', 'translate(18,15)');
        let eventNodes = events.nodes();

        let last = eventNodes.length;
        eventNodes[last - 1].classList.add('selected-event');

        events.on('click', (d, i)=> {

            selectAll('.event_label').classed('selected-event', false);

            let boop = events.nodes();
          
            select(boop[i]).classed('selected-event', true);
            labelClick(d)});
        }

        private drawEventButtons(){
            let div = this.$node.append('div').classed('event-buttons', true);
    
            div.append('input')
            .attr('type', 'button').attr('id', 'event-start')
            .classed('btn', true).classed('btn-default', true).classed('btn-sm', true)//.classed('disabled', true)
            .attr('value', 'Update Start Day to Event')
            .on('click', () => {
                if(this.startCodes == null){
                   // events.fire('revert_to_promis');
                   events.fire('event_selected', this.startCodes);
                }else{
                    events.fire('event_selected', this.startCodes);
                }
               
            });
        }

}

export function create(parent:Element, cohort) {
    return new EventLine(parent, cohort);
  }