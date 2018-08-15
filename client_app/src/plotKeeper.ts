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
import { indexOf } from 'phovea_core/src';

export class PlotKeeper {

    private $node;
    private cohortData = [];
    private plotDiv;
    private domain;
    private dimension;
    private initialLoadBool;
    selectedCohort;
    selectedPlot;
    plotArray;
    private layerBool;
    comparisonArray;
    drawPromisChart;
    drawAgg;
    clearDiagram;
    scoreScale;
    timeScale;
    plotCount;

    constructor(parent: Element) {

        this.domain = {
            maxDay: 50,
            minDay: -10,
        }

        this.dimension = {
            height : 400,
            width : 600,
            margin : {x: 50, y: 10},
        }

        this.drawPromisChart = promisDiagram.drawPromisChart;
        this.drawAgg = promisDiagram.drawAgg;
        this.clearDiagram = promisDiagram.clearDiagram;

        this.$node = select(parent);
        const eventLineView = this.$node.append('div').classed('event_line_view', true);
        eventLine.create(eventLineView.node(), null);
        this.plotDiv = this.$node.append('div').classed('allDiagramDiv', true);
        this.plotArray = [];

        this.attachListener();
    }

    private attachListener(){

        events.on('clear_cohorts', (evt, item)=> {
            this.layerBool = false;
            this.clearDiagram(this.selectedPlot.svg, this.selectedPlot.cohortIndex);
            let layer = select('#layerDiv');
            layer.selectAll('*').remove();
            layer.classed('hidden', true);
            document.getElementById('layerButton').classList.remove('btn-warning');
            this.plotCount = 0;

        });
        
        events.on('draw_layers', (evt, item)=> {

            //this comes from the sidebar
        if(this.selectedPlot != undefined){    
            
            this.comparisonArray = item;
     
            this.clearDiagram(this.selectedPlot.svg, this.selectedPlot.cohortIndex);
            this.comparisonArray.layers.forEach((cohort, i) => {
  
                if(cohort.data.clumped){
                    //if it is aggregated
                  this.drawAgg(cohort.data.chartData, cohort.class, this.selectedPlot, cohort.data, i);
                }else{
                    this.drawPromisChart(cohort.data.chartData, cohort.class, this.selectedPlot, cohort.data, i);
                }
            });}
        });

        events.on('enter_layer_view', ()=> {
            this.layerBool = true;
            document.getElementById('layerButton').classList.add('btn-warning');
        });

        events.on('exit_layer_view', ()=> {
            this.layerBool = false;
            this.plotDiv.selectAll('*').remove();
            this.selectedPlot = this.addPlot(this.plotDiv, this.plotArray, this.domain, this.dimension, this.cohortData);
            document.getElementById('layerButton').classList.remove('btn-warning');
            events.fire('cohort_selected', this.cohortData[0]);
        });

        events.on('test', (evt, item)=> {
   
            this.cohortData = item[0];
            this.selectedCohort = this.cohortData[item[1][0]];
            let array = [];
            if(this.layerBool){
              let layer = select('#layerDiv');
              let selected = layer.selectAll('.fill').nodes();
               selected.forEach((sel, i) => {
                   let cohort = select(sel).data()[0];
                   let entry = {class: 'layer-' + i, data: cohort }
                   array.push(entry);
              });
              events.fire('update_layers', array);
            }
            if(!this.initialLoadBool){
                this.initialLoadBool = true;
                this.plotCount = 0;
                this.addPlot(this.plotDiv, this.plotArray, this.domain, this.dimension, this.cohortData).then(d=> {
                    console.log(d);
                    this.selectedPlot = d;
                    this.plotArray.push({plot: d, data: this.selectedCohort});
                    this.drawPromisChart(this.selectedCohort.promis, 'proLine', d, this.selectedCohort, null, this.cohortData);
                });
            }
        });

        events.on('add_plot_button', (evt, item)=> {
          
            let count = this.plotArray.length;
            this.plotCount++;
            this.addPlot(this.plotDiv, this.plotArray, this.domain, this.dimension, this.cohortData).then(d=>{
                
                this.plotArray.push({plot: d, data: this.selectedCohort});
                this.plotSelected(this.plotArray, d);
                this.drawPromisChart(this.selectedCohort.promis, 'proLine', d, this.selectedCohort, null, this.cohortData).then(d=>{
                    console.log(this.plotArray);
                    
                });
            });
        });

        events.on('domain updated', (evt, item)=> {
          
            this.domain.minDay = item[0];
            this.domain.maxDay = item[1];
           
            events.fire('xBrush_reset');
        });

        events.on('plot_selected', (evt, item)=>{
            let index = String(item);
      
            this.selectedPlot = this.plotArray.filter(p=> p.plot.cohortIndex == index)[0].plot;
            console.log(this.selectedPlot);
            this.plotSelected(this.plotArray, this.selectedPlot);
        });

        events.on('remove_plot', (evt, item)=> {
     
            let plotIndexes = this.plotArray.map(p=> p.plot.cohortIndex).indexOf(String(item));
            let removeIt = this.plotArray.filter((d, i) => i == plotIndexes);
            console.log(removeIt);
            removeIt[0].plot.$node.select('.panel').remove();
            let newArray = this.plotArray.filter((d, i) => i != plotIndexes);
           
            this.plotArray = newArray;
     
        });
        //cohort, clump, node, index
        events.on('update_chart', (evt, item)=> {
            console.log('chart?');
            console.log(this.selectedPlot);
           if(this.selectedPlot != undefined){
      
            if(this.selectedPlot.cohortIndex != undefined){
                this.clearDiagram(this.selectedPlot.svg, this.selectedPlot.cohortIndex);
            }

               if(this.layerBool == true){
                console.log('update chart??');
               }else{
               
                  let promis = item.chartData;
                  let scaleRelative = item.scaleR;
                  let clumped = item.clumped;
                  let separated = item.separated;
                  console.log('no layers');
               
                  if(clumped){
                      //if it is aggregated
                      if(separated){
                
                         this.drawAgg(item.promisSep[0], 'bottom', this.selectedPlot, item, null);
                         this.drawAgg(item.promisSep[1], 'middle', this.selectedPlot, item, null);
                         this.drawAgg(item.promisSep[2], 'top', this.selectedPlot, item, null);

                      }else{
                        console.log('not sep clumped!');
                        console.log(item);
                          this.drawAgg(promis, 'all', this.selectedPlot, item, null);
                      }
      
                  }else{
                      //if it is not aggregated
                      if(separated){
                         
                          this.drawPromisChart(item.promisSep[0], 'bottom', this.selectedPlot, item, null, this.cohortData);
                          this.drawPromisChart(item.promisSep[1], 'middle', this.selectedPlot, item, null, this.cohortData);
                          this.drawPromisChart(item.promisSep[2], 'top', this.selectedPlot, item, null, this.cohortData);
                      }else{
                          this.drawPromisChart(promis, 'proLine', this.selectedPlot, item, null, this.cohortData);
                      }

                  }
                 }
               }
        });
}

    private async plotSelected(plotArray, selectedPlot){
        console.log(plotArray);
        console.log(selectedPlot);
        selectAll('.selected_Plot').classed('selected_Plot', false);
        selectedPlot.plotHeader.classed('selected_Plot', true);
        this.selectedPlot = selectedPlot;
    }

    private async addPlot(plotDiv, plotArray, domain, dimension, data){
        
        let plot = await promisDiagram.create(plotDiv.node(), 'PROMIS Bank v1.2 - Physical Function', this.plotCount, domain, dimension, data);
        console.log(plot);
        return plot;
    }

}


export function create(parent: Element) {
    return new PlotKeeper(parent);
}