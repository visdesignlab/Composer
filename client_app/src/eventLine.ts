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


    constructor(parent: Element, cohort) {

    this.$node = select(parent);
    this.eventScale = scaleLinear().domain([0, 4])
            .range([0, 750]).clamp(true);

    this.circleScale = scaleLinear().domain([0, 3000])
            .range([1, 10]).clamp(true);

    this.attachListener();

    this.drawLine();

    }

    private attachListener() {
        events.on('update_event_line', (evt, item)=> {
            this.filter = item[0];
            this.updateEvents(item);
        });
        events.on('selected_event_filter_change', (evt, item)=> {
            this.filter = item;
            this.updateEvents(item);
        });
    }

    private drawLine(){
        let eventLine = this.$node.append('div').classed('event_line', true);
        let eventLineSvg = eventLine.append('svg').classed('event_line_svg', true)
        .attr('height', 70).attr('width', 710);

        eventLineSvg.append('g').attr('transform', () => `translate(75,0)`).append('line')
        .attr('x1', 0).attr('x2', 770).attr('y1', 10).attr('y2', 10).attr('stroke', '#212F3C').attr('stroke-width', '1px');
    }

    private updateEvents(filters) {
        console.log(filters);
        let that = this;
        this.$node.selectAll('.event').remove();
        console.log(filters);
        let event = this.$node.select('.event_line_svg').selectAll('.event').data(filters);

        event.exit().remove();

        let eventEnter = event.enter().append('g').classed('event', true).attr('transform', translate);

        let circle = eventEnter.append('circle').attr('cx', 5).attr('cy', 10).attr('r', d=> this.circleScale(d[1])).attr('fill', 'red')
        
        eventEnter.append('text').text(d => d[0]).attr('transform', 'translate(5,20)');
        eventEnter.append('text').text(d => d[1]).attr('transform', 'translate(5,30)').attr('class', 'accent');

        event = eventEnter.merge(event);
        event.on('click', circleclick);

        function translate(d, i) {
            return "translate(" + (75 + that.eventScale(i)) + "," + 0 + ")";
          }

          function circleclick(d){ events.fire('event_clicked', d[0]); }

    }
}

export function create(parent:Element, cohort) {
    return new EventLine(parent, cohort);
  }