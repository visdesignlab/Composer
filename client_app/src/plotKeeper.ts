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
import * as promisDiagram from './promisDiagram';
import * as timelineKeeper from './timelinekeeper';
import * as eventLine from './eventLine';

export class PlotKeeper {

    private $node;
    private cohortData = [];
    private plotDiv;
    private domain;
    private cohortIndex;
    private initialLoadBool;
    selectedCohort;

    constructor(parent: Element) {

        this.$node = select(parent);
        const eventLineView = this.$node.append('div').classed('event_line_view', true);
        eventLine.create(eventLineView.node(), null);
        this.plotDiv = this.$node.append('Div').classed('allDiagramDiv', true);
       
        const timeline = this.$node.append('div').classed('timeline_view', true);
        timelineKeeper.create(timeline.node());
        this.cohortIndex = 1;
      //  this.buildPlot(this.plotDiv, this.cohortData, this.cohortIndex);
        this.attachListener();
    }

    private attachListener(){

        let that = this;

        events.on('comparison_update', (evt, item)=> {
            console.log(item);
            //this comes from the sidebar
            let comparisonArray = item;
   
            this.plotDiv.selectAll('*').remove();

            comparisonArray.forEach((cohort, i) => {
                console.log(cohort);
                this.buildPlot(this.plotDiv, cohort.selectedCohort, i);
            });
        });

        events.on('enter_comparison_view', ()=> {
          
            console.log('maybe put something here');
        });

        events.on('exit_comparison_view', ()=> {
          
            this.plotDiv.selectAll('*').remove();

            this.buildPlot(this.plotDiv, this.cohortData[0], 0);
            
            this.cohortIndex=1;

            events.fire('cohort_selected', [this.cohortData[0], 0]);
        });

        events.on('test', (evt, item)=> {
        
            this.cohortData = item[0];
            let selectedCohort = this.cohortData[item[1][0]];

            console.log(this.cohortData);

            if(!this.initialLoadBool){
                this.initialLoadBool = true;
                console.log('make sure this only updates once');
                this.buildPlot(this.plotDiv, selectedCohort, this.cohortIndex);
            }
         
        });

        events.on('domain updated', (evt, item)=> {
            this.domain = item;
        });

}

    private buildPlot(container, cohort, index) {
        //similarityScoreDiagram.create(container.node(), 'PROMIS Bank v1.2 - Physical Function', cohort, index);
        promisDiagram.create(container.node(), 'PROMIS Bank v1.2 - Physical Function', cohort, index);

    }


}


export function create(parent: Element) {
    return new PlotKeeper(parent);
}