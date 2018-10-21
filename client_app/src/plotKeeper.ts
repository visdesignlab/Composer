/**
 * Created by Jen on 1/12/17.
 */


import {BaseType, select, selectAll, event} from 'd3-selection';
import * as events from 'phovea_core/src/event';
import * as PromisDiagram from './promisDiagram';
import * as eventLine from './eventLine';



export class PlotKeeper {

    private $node;
    private cohortData = [];
    private plotDiv;
    private domain;
    private dimension;
    private initialLoadBool;
    selectedPlot;
    plotArray;
    private layerBool;
    layerKeeperArray;
    scoreScale;
    timeScale;
    plotCount;
    cohortManager;

    constructor(parent: Element, cohortManager: Object) {

        this.domain = [-10, 50];
           // maxDay: 50, minDay: -10,
      //  }
        this.dimension = {
            height : 400, width : 600, margin : {x: 40, y: 10},
        }
      
        this.$node = select(parent);
        const eventLineView = this.$node.append('div').classed('event_line_view', true);
        eventLine.create(eventLineView.node(), null);
        this.plotDiv = this.$node.append('div').classed('allDiagramDiv', true);
        this.plotArray = [];
        this.cohortManager = cohortManager;

        this.attachListener();
    }

    private attachListener(){

        events.on('clear_cohorts', (evt, item)=> {
            this.layerBool = false;
            this.selectedPlot.clearDiagram();
            let layer = select('#layerDiv');
            layer.selectAll('*').remove();
            layer.classed('hidden', true);
            document.getElementById('layerButton').classList.remove('btn-warning');
            this.plotCount = 0;
        });
        
        events.on('draw_layers', (evt, item)=> {

            //this comes from the sidebar
        if(this.selectedPlot != undefined){    
            
            this.layerKeeperArray = item;
            this.selectedPlot.clearDiagram();
            this.layerKeeperArray.layers.forEach((cohort, i) => {
                if(cohort.data.clumped){
                    //if it is aggregated
                  this.selectedPlot.drawAgg(cohort.data.chartData, cohort.class, i, cohort.data);
                }else{
                    //promis, clump, i, cohort, data
                    this.selectedPlot.drawPromisChart(cohort.data.chartData, cohort.class, i, cohort.data, this.cohortManager.cohortTree);
                }
            });}
        });

        events.on('enter_layer_view', ()=> {
            this.layerBool = true;
            document.getElementById('layerButton').classList.add('btn-warning');
        });

        events.on('exit_layer_view', ()=> {
            this.layerBool = false;
            this.selectedPlot.clearDiagram();
            let layer = select('#layerDiv');
            layer.selectAll('*').remove();
            layer.classed('hidden', true);
            document.getElementById('layerButton').classList.remove('btn-warning');
            events.fire('cohort_selected', this.cohortManager.cohortTree[0]);
        });

        events.on('test', (evt, item)=> {
    
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
                this.addPlot(this.plotDiv, this.plotArray, this.domain, this.dimension, this.cohortManager.selectedCohort, this.cohortManager.cohortTree).then(d=> {
                    this.selectedPlot = d;
                    this.plotArray.push({plot: d, data: this.cohortManager.selectedCohort});
                });
            }
        });

        events.on('add_plot_button', (evt, item)=> {
          
            let count = this.plotArray.length;
            this.plotCount++;
            this.addPlot(this.plotDiv, this.plotArray, this.domain, this.dimension, this.cohortManager.selectedCohort, this.cohortManager.cohortTree).then(d=>{
                this.plotArray.push({plot: d, data: this.cohortManager.selectedCohort});
                this.plotSelected(this.plotArray, d);
                this.selectedPlot = d;
            });
        });

        events.on('plot_selected', (evt, item)=>{
            let index = String(item);
            if(this.plotArray.length > 1){
                this.selectedPlot = this.plotArray.filter(p=> p.plot.cohortIndex == index)[0].plot;
                this.plotSelected(this.plotArray, this.selectedPlot);
            }else{
                this.selectedPlot = this.plotArray[0].plot;
                this.plotSelected(this.plotArray, this.selectedPlot);
            }

        });
        events.on('remove_plot', (evt, item)=> {
     
            let plotIndexes = this.plotArray.map(p=> p.plot.cohortIndex).indexOf(String(item));
            let removeIt = this.plotArray.filter((d, i) => i == plotIndexes);
            removeIt[0].plot.$node.select('.panel').remove();
            let newArray = this.plotArray.filter((d, i) => i != plotIndexes);
            this.plotArray = newArray;
        });
        events.on('update_chart', (evt, item)=> {
           if(this.selectedPlot != undefined){
      
                if(this.selectedPlot.cohortIndex != undefined){
                    this.selectedPlot.clearDiagram();
                }

                if(this.layerBool == true){
               
                }else{
               
                  let promis = this.cohortManager.selectedCohort.chartData;
                  let scaleRelative = item.scaleR;
                  let clumped = item.clumped;
                  let separated = item.separated;
              
                  if(clumped){
                      if(separated){
                         this.selectedPlot.drawAgg(item.promisSep[0], 'bottom', null, item);
                         this.selectedPlot.drawAgg(item.promisSep[1], 'middle', null, item);
                         this.selectedPlot.drawAgg(item.promisSep[2], 'top', null, item);
                      }else{
                        this.selectedPlot.drawAgg(this.cohortManager.selectedCohort.chartData, 'all', null, item);
                      }
                  }else{
                      //if it is not aggregated
                      if(separated){
                          this.selectedPlot.drawPromisChart(item.promisSep[0], 'bottom', null, item, this.cohortManager.cohortTree);
                          this.selectedPlot.drawPromisChart(item.promisSep[1], 'middle', null, item, this.cohortManager.cohortTree);
                          this.selectedPlot.drawPromisChart(item.promisSep[2], 'top', null, item, this.cohortManager.cohortTree);
                      }else{
                       
                        this.selectedPlot.drawPromisChart(this.cohortManager.selectedCohort.chartData, 'proLine', null, item, this.cohortManager.cohortTree);
                      }

                  }
                 }
               }
        });
}

    private async plotSelected(plotArray, selectedPlot){
        selectAll('.selected_Plot').classed('selected_Plot', false);
        selectedPlot.plotHeader.classed('selected_Plot', true);
        this.selectedPlot = selectedPlot;
    }

    private async addPlot(plotDiv, plotArray, domain, dimension, selectedData, data){
        let plot = await PromisDiagram.create(plotDiv.node(), 'PROMIS Bank v1.2 - Physical Function', this.plotCount, domain, dimension, selectedData, data);
        return plot;
    }

}


export function create(parent: Element, cohortManager : Object) {
    return new PlotKeeper(parent, cohortManager);
}