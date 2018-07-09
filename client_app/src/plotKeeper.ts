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
//import * as promisDiagram from './promisDiagram';
import * as promisDiagram from './testPromis';
import * as timelineKeeper from './timelinekeeper';
import * as eventLine from './eventLine';

export class PlotKeeper {

    private $node;
    private cohortData = [];
    private plotDiv;
    private domain;
    private initialLoadBool;
    selectedCohort;
    private compareBool;
    comparisonArray;
    drawPromisChart;
    frequencyCalc;
    clearDiagram;
    scoreScale;
    timeScale;

    constructor(parent: Element) {

        this.domain = {

            maxDay: 50,
            minDay: -30,
        }

        this.scoreScale = scaleLinear().range()

        this.drawPromisChart = promisDiagram.drawPromisChart;
        this.frequencyCalc = promisDiagram.frequencyCalc;
        this.clearDiagram = promisDiagram.clearDiagram;

        this.$node = select(parent);
        const eventLineView = this.$node.append('div').classed('event_line_view', true);
        eventLine.create(eventLineView.node(), null);
        this.plotDiv = this.$node.append('div').classed('allDiagramDiv', true);
       
        const timeline = this.$node.append('div').classed('timeline_view', true);
        timelineKeeper.create(timeline.node());
        this.attachListener();
    }

    private attachListener(){

        let that = this;

        events.on('comparison_update', (evt, item)=> {
            console.log(item);
            //this comes from the sidebar
            this.comparisonArray = item;
   
            this.plotDiv.selectAll('*').remove();

            this.comparisonArray.forEach((cohort, i) => {
                console.log(cohort);
                this.buildPlot(this.plotDiv, cohort.selectedCohort, i, this.domain);
            });
        });

        events.on('enter_comparison_view', ()=> {
            console.log('maybe put something here');
            this.compareBool = true;
        });

        events.on('exit_comparison_view', ()=> {
          
            this.plotDiv.selectAll('*').remove();
            this.buildPlot(this.plotDiv, this.cohortData[0], 0, this.domain);
            events.fire('cohort_selected', [this.cohortData[0], 0]);
            this.compareBool = false;
        });

        events.on('test', (evt, item)=> {
        
            this.cohortData = item[0];
            let selectedCohort = this.cohortData[item[1][0]];

            console.log(this.cohortData);

            if(!this.initialLoadBool){
                this.initialLoadBool = true;
                console.log('make sure this only updates once');
                let cohort = this.buildPlot(this.plotDiv, selectedCohort, 0, this.domain);
                console.log(cohort);
            }
         
        });

        events.on('domain updated', (evt, item)=> {
            this.domain.minDay = item[0];
            this.domain.maxDay = item[1];
            if(!this.compareBool){
                events.fire('yBrush_reset');
            }else{
                this.plotDiv.selectAll('*').remove();

            this.comparisonArray.forEach((cohort, i) => {
                console.log(cohort);
                this.buildPlot(this.plotDiv, cohort.selectedCohort, i, this.domain);
            });
            }
            

        });

        events.on('update_chart', (evt, item)=> {

            this.clearDiagram();
           // this.clearAggDiagram();

            if(item != null){

                let promis = item.promis;
                let scaleRelative = item.scaleR;
                let clumped = item.clumped;
                let separated = item.separated;
                let cohortLabel = item.label;
                let zeroEvent;
    
                if(item.startEvent == null){ zeroEvent = 'First Promis Score';
                }else{
                    zeroEvent = item.startEvent[1][0].key;
                }
    
                if(scaleRelative){
                    console.log('change back rel');
                    this.scoreScale.domain([30, -30]);
                 }else{ 
                    console.log('change back to absolute');
                    this.scoreScale.domain([80, 0]);
                 }
    
                if(clumped){
                    //if it is aggregated
                    if(separated){
                        this.frequencyCalc(item.promisSep[0], 'top', this.domain);
                        this.frequencyCalc(item.promisSep[1], 'middle', this.domain);//.then(co=> this.drawAgg(co, 'middle'));
                        this.frequencyCalc(item.promisSep[2], 'bottom', this.domain);//.then(co=> this.drawAgg(co, 'bottom'));
                    }else{
                        
                        this.frequencyCalc(promis, 'all', this.domain);//.then(co=> this.drawAgg(co, 'all'));
                    }
    
                }else{
                    //if it is not aggregated
                    if(separated){
                       
                        this.drawPromisChart(item.promisSep[0], 'top', cohortLabel, this.domain);
                        this.drawPromisChart(item.promisSep[1], 'middle', cohortLabel, this.domain);
                        this.drawPromisChart(item.promisSep[2], 'bottom', cohortLabel, this.domain);
                    }else{
                      
                        this.drawPromisChart(promis, 'proLine', cohortLabel);
                    }
                }
            }
             
        });
    

}

    private buildPlot(container, cohort, index, domain) {
        //similarityScoreDiagram.create(container.node(), 'PROMIS Bank v1.2 - Physical Function', cohort, index);
       return promisDiagram.create(container.node(), 'PROMIS Bank v1.2 - Physical Function', cohort, index, domain);

    }


}


export function create(parent: Element) {
    return new PlotKeeper(parent);
}