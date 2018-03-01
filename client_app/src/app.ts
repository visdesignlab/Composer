/**
 * Created by Caleydo Team on 31.08.2016.
 */

import {select} from 'd3-selection';
//import * as printLogs from './printLogs';
//import * as svgTable from './svgTable';
import * as queryBox from './queryBox';
import * as sideBar from './sideBar';
import * as similarityScoreDiagram from './similarityScoreDiagram';
import * as events from 'phovea_core/src/event';
import * as rectExploration from './rectExploration';
import * as distributionDiagram from './distributionDiagram';
//import * as patOrderBreakdown from './patOrderBreakdown';
import * as parallel from './parallel';
import * as dataManager from './dataManager';
import * as cohortManager from './cohortManager';
import * as cptBreak from './cptBreakdown';
import * as populationStat from './populationStat';
import * as timelineKeeper from './timelinekeeper';
import * as inStat from './individualStats';
import { individualStats } from './individualStats';
import { CohortManager } from './cohortManager';
import * as PlotKeeper from './plotKeeper';
import * as cohortStat from './cohortStat';


/**
 * The main class for the App app
 */
export class App {

  private $node;

  constructor(parent: Element) {
  
    this.$node = select(parent);

    
  }

  /**
   * Initialize the view and return a promise
   * that is resolved as soon the view is compconstely initialized.
   * @returns {Promise<App>}
   */
  init() {
    return this.build();
  }

  /**
   * Load and initialize all necessary views
   * @returns {Promise<App>}
   */
  private async build() {

    // loading header
    this.$node.select('h3').remove();

    const data = dataManager.create();//dataobject with all the info
    const cohort = cohortManager.create();
    
    // create side bar
    const sideBarDiv = this.$node.append('div').classed('sideBar', true);
    const side = sideBar.create(sideBarDiv.node());
    await side.init();

    // main div - all div are within this div
    const main = this.$node.append('div').classed('main', true);

          // query box
    queryBox.create(main.node());

    const parallelView = main.append('div').classed('parallel_view', true);
    const populationView = main.append('div').classed('population_view', true);
    const timeline = main.append('div').classed('timeline_view', true)
    const plots = main.append('div').classed('plot_view', true);

    // population distributions, initial visualization for all of the data
    //populationStat.create(populationView.node());
    timelineKeeper.create(timeline.node());
    PlotKeeper.create(plots.node());

    inStat.create(main.node());


    const cpt = main.append('Div').classed('cptDiv', true);
   // cptBreak.create(cpt.node());
    this.$node.select('.cptDiv').classed('hidden', true);

    //const cstat = main.append('Div').classed('cohort_stat_view', true);
    cohortStat.create(main.node());
   // cptBreak.create(cpt.node());
   // this.$node.select('.cohort_stat_view');//.classed('hidden', true);
      // PROMIS diagrams
   // const dgmPromisPhysicalDiv = main.append('Div').classed('allDiagramDiv', true);
   // similarityScoreDiagram.create(dgmPromisPhysicalDiv.node(), 'PROMIS Bank v1.2 - Physical Function');
     //similarityScoreDiagram.create(dgmPromisPhysicalDiv.node(), 'Oswestry Index (ODI)');
     //similarityScoreDiagram.create(dgmPromisPhysicalDiv.node(), 'PROMIS Bank v1.0 - Depression');
     
    this.setBusy(false);

    events.on('parallel', () => {

    //parallel coord plot 
    parallel.create(parallelView.node(), data);

    });

    events.on('show_orders', () => {

           // console.log('works!');
            //this.$node.select('.main').select('.allDiagramDiv').classed('hidden', true);
           // this.$node.select('.main').select('.orderBreakdownDiv').classed('hidden', false);
            this.$node.select('.main').select('.rectDiv').classed('hidden', false);
            this.$node.select('.main').select('.cptDiv').classed('hidden', true);

        });

    events.on('show_cpt', () => {
          
                     // console.log('works!');
                      this.$node.select('.main').select('.allDiagramDiv').classed('hidden', true);
                     // this.$node.select('.main').select('.orderBreakdownDiv').classed('hidden', true);
                      this.$node.select('.main').select('.cptDiv').classed('hidden', false);
                      this.$node.select('.main').select('.rectDiv').classed('hidden', false);
          
                  });

    events.on('load_cpt', () => {
          
      // console.log('works!');
       this.$node.select('.main').select('.distributions').classed('hidden', true);
      // this.$node.select('.main').select('.orderBreakdownDiv').classed('hidden', true);
       this.$node.select('.main').select('.cptDiv').classed('hidden', false);
       this.$node.select('.main').select('.rectDiv').classed('hidden', false);

   });

        events.on('show_distributions', ()=> {
          this.$node.select('.main').select('.distributions').classed('hidden', false);
          //this.$node.select('.main').select('.orderBreakdownDiv').classed('hidden', true);
          this.$node.select('.main').select('.cptDiv').classed('hidden', true);
          this.$node.select('.main').select('.rectDiv').classed('hidden', true);
        });
        
          // item: pat_id, DATA
        events.on('update_hierarchy', () => {  // called in query box

            this.$node.select('.main').select('.allDiagramDiv').select('.scoreGroup').classed('hidden', false);
           // this.$node.select('.main').select('.orderBreakdownDiv').classed('hidden', true);
            this.$node.select('.main').select('.rectDiv').classed('hidden', true);
           // console.log('remove pat hierarchy');

        });
      
   
  }

  /**
   * Show or hide the application loading indicator
   * @param isBusy
   */
  setBusy(isBusy: boolean) {
    this.$node.select('.busy').classed('hidden', !isBusy);
  }

}

/**
 * Factory method to create a new app instance
 * @param parent
 * @returns {App}
 */
export function create(parent:Element) {
  return new App(parent);
}