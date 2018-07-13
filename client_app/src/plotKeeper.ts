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
    selectedPlot;
    plotArray;
    private compareBool;
    private layerBool;
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

        events.on('comparison_update', (evt, item)=> {
          
            //this comes from the sidebar
            this.comparisonArray = item;
            this.plotArray = [];
    
            this.plotDiv.selectAll('*').remove();

            this.comparisonArray.forEach((cohort, i) => {
               
                let plot = this.buildPlot(this.plotDiv, i, this.domain);
                plot.svg.select(parent).on('click', (d, i)=> {console.log(d); console.log(i)});

                this.plotArray.push(plot);
                this.drawPromisChart(cohort.selectedCohort.promis, 'proLine', plot, cohort.selectedCohort);
            });

            this.selectedPlot = this.plotArray[0];
        });

        
        events.on('update_layers', (evt, item)=> {
          
            //this comes from the sidebar
        if(this.selectedPlot != undefined){    
            
            this.comparisonArray = item;
     
            this.clearDiagram(this.selectedPlot.svg, this.selectedPlot.cohortIndex);
            this.comparisonArray.forEach((cohort, i) => {
              
                if(cohort.data.clumped){
                    //if it is aggregated
                    this.frequencyCalc(cohort.data.promis, cohort.class, this.selectedPlot, item);//.then(co=> this.drawAgg(co, 'all'));
                    
                }else{
                    this.drawPromisChart(cohort.data.promis, cohort.class, this.selectedPlot, cohort.data);
                }
               
              //  this.drawPromisChart(cohort.data.promis, cohort.class, this.selectedPlot, cohort.data);
            });}
        });

        events.on('enter_comparison_view', ()=> {
            this.compareBool = true;
           
        });

        events.on('exit_comparison_view', ()=> {
          
            this.plotDiv.selectAll('*').remove();
            this.buildPlot(this.plotDiv, 0, this.domain);
            events.fire('cohort_selected', [this.cohortData[0], 0]);
            this.compareBool = false;
        });

        
        events.on('enter_layer_view', ()=> {
            this.layerBool = true;

            document.getElementById('layerButton').classList.add('btn-warning');
           
        });

        events.on('exit_layer_view', ()=> {
       
            this.layerBool = false;
            this.plotDiv.selectAll('*').remove();
            this.selectedPlot = this.buildPlot(this.plotDiv, 0, this.domain);
            document.getElementById('layerButton').classList.remove('btn-warning');
          
            events.fire('cohort_selected', [this.cohortData[0], 0]);
         
        });

        events.on('test', (evt, item)=> {

            this.cohortData = item[0];
            this.selectedCohort = this.cohortData[item[1][0]];

            if(!this.initialLoadBool){
                this.initialLoadBool = true;
               
                this.selectedPlot = this.buildPlot(this.plotDiv, 0, this.domain);
               
                this.drawPromisChart(this.selectedCohort.promis, 'proLine', this.selectedPlot, this.selectedCohort);
            }
        });

        events.on('domain updated', (evt, item)=> {
          
            this.domain.minDay = item[0];
            this.domain.maxDay = item[1];
            this.plotArray = [];
           
            if(!this.compareBool){
                events.fire('yBrush_reset');
            }else{
                this.plotDiv.selectAll('*').remove();

            this.comparisonArray.forEach((cohort, i) => {
                let plot = this.buildPlot(this.plotDiv, i, this.domain);
                this.plotArray.push(plot);
                this.drawPromisChart(cohort.selectedCohort.promis, 'proLine', plot, cohort.selectedCohort);
              });
            }
            

        });
        //cohort, clump, node, index
        events.on('update_chart', (evt, item)=> {
          
           if(this.selectedPlot != undefined){
            this.clearDiagram(this.selectedPlot.svg, this.selectedPlot.cohortIndex);
        
               if(this.layerBool == true){
           
                this.comparisonArray.forEach((cohort) => {
           
                    if(cohort.data.clumped){
                        //if it is aggregated
                        if(cohort.separated){
                            cohort.data.forEach(promis => {
                                this.frequencyCalc(cohort.data.promisSep[0], cohort.class, this.selectedPlot, item);
                            });
                        }else{
                       
                            this.frequencyCalc(cohort.data.promis, cohort.class, this.selectedPlot, item);//.then(co=> this.drawAgg(co, 'all'));
                        }
                    }else{
                        this.drawPromisChart(cohort.data.promis, cohort.class, this.selectedPlot, cohort.data);
                    }

                });

               }else{
               
                  let promis = item.promis;
                  let scaleRelative = item.scaleR;
                  let clumped = item.clumped;
                  let separated = item.separated;
               
                  if(clumped){
                      //if it is aggregated
                      if(separated){
                          this.frequencyCalc(item.promisSep[0], 'top', this.selectedPlot, item);
                          this.frequencyCalc(item.promisSep[1], 'middle', this.selectedPlot, item);//.then(co=> this.drawAgg(co, 'middle'));
                          this.frequencyCalc(item.promisSep[2], 'bottom', this.selectedPlot, item);//.then(co=> this.drawAgg(co, 'bottom'));
                      }else{
                          
                          this.frequencyCalc(promis, 'all', this.selectedPlot, item);//.then(co=> this.drawAgg(co, 'all'));
                      }
      
                  }else{
                      //if it is not aggregated
                      if(separated){
                         
                          this.drawPromisChart(item.promisSep[0], 'top', this.selectedPlot, item);
                          this.drawPromisChart(item.promisSep[1], 'middle', this.selectedPlot, item);
                          this.drawPromisChart(item.promisSep[2], 'bottom', this.selectedPlot, item);
                      }else{
                        this.drawPromisChart(promis, 'proLine', this.selectedPlot, item);
                      }
                  }
                 }

               }

        });
    

}

    private buildPlot(container, index, domain) {
        //similarityScoreDiagram.create(container.node(), 'PROMIS Bank v1.2 - Physical Function', cohort, index);
       return promisDiagram.create(container.node(), 'PROMIS Bank v1.2 - Physical Function', index, domain);

    }


}


export function create(parent: Element) {
    return new PlotKeeper(parent);
}