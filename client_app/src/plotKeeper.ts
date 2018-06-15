/**
 * Created by Jen on 1/12/17.
 */

import * as ajax from 'phovea_core/src/ajax';
import {brushX} from 'd3-brush';
import * as d3 from 'd3';
import {BaseType, select, selectAll, event} from 'd3-selection';
import {nest, values, keys, map, entries} from 'd3-collection';
import * as events from 'phovea_core/src/event';
import {scaleLinear, scaleTime, scaleOrdinal} from 'd3-scale';
import {extent, min, max, ascending, histogram, mean, deviation} from 'd3-array';
import {axisBottom, axisLeft} from 'd3-axis';
import {drag} from 'd3-drag';
import { format } from 'd3-format';
import {transition} from 'd3-transition';
import * as distributionDiagram from './distributionDiagram';
import * as dataCalc from './dataCalculations';
import * as similarityScoreDiagram from './similarityScoreDiagram';
import * as timelineKeeper from './timelinekeeper';
import * as eventLine from './eventLine';

export class PlotKeeper {

    private $node;
    private cohortData;
    private plotDiv;
    private maxDay;
    private minDay;

    constructor(parent: Element) {

        this.$node = select(parent);
        const eventLineView = this.$node.append('div').classed('event_line_view', true);
        eventLine.create(eventLineView.node(), null);
        this.drawEventButtons();
        this.buildPlot(this.cohortData);
        const timeline = this.$node.append('div').classed('timeline_view', true);
        timelineKeeper.create(timeline.node());
        this.attachListener();
    }

    private attachListener(){

        let that = this;

        events.on('domain updated', (evt, item)=> {
            this.maxDay = item[1];
            this.minDay = item[0];
        });

        events.on('got_promis_scores', (evt, item) => {  // called in parrallel on brush and 
            this.cohortData = item;
                });

        events.on('selected_cohort_change', (evt, item) => {  // called in parrallel on brush and 
                this.cohortData = item;
                    });

        events.on('add_another_plot', (evt, item) => {  // called in parrallel on brush and 

            let cohort = item;

            for(let i = 0; i < cohort.length; i++){
                similarityScoreDiagram.create(this.plotDiv.node(), 'PROMIS Bank v1.2 - Physical Function', cohort[i], this.maxDay, this.minDay);
            }
        });
}

    private buildPlot(cohort) {

        this.plotDiv = this.$node.append('Div').classed('allDiagramDiv', true);
        similarityScoreDiagram.create(this.plotDiv.node(), 'PROMIS Bank v1.2 - Physical Function', cohort, this.maxDay, this.minDay);

    }

    private drawEventButtons(){
        let div = this.$node.append('div').classed('event-buttons', true);

        div.append('input')
        .attr('type', 'button')
        .classed('btn', true).classed('btn-default', true)
        .attr('value', 'Update Start Day to Event')
        .on('click', () => events.fire('update_start_button_clicked'));
/*
        div.append('input')
            .attr('type', 'button')
            .classed('btn', true).classed('btn-default', true)
            .attr('value', 'Change Promis Score Scale')
            .on('click', () =>events.fire('change_promis_scale'));

        div.append('input')
            .attr('type', 'button')
            .classed('btn', true).classed('btn-default', true)
            .attr('value', 'Aggregate Scores')
            .on('click', () => {
                events.fire('aggregate_button_clicked');
            });
*/
    }

}


export function create(parent: Element) {
    return new PlotKeeper(parent);
}