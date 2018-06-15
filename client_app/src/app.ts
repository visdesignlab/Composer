/**
 * Created by Caleydo Team on 31.08.2016.
 */

import {select} from 'd3-selection';
import * as sideBar from './sideBar';
import * as similarityScoreDiagram from './similarityScoreDiagram';
import * as events from 'phovea_core/src/event';
import * as rectExploration from './rectExploration';
import * as distributionDiagram from './distributionDiagram';
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
import * as codeside from './codeSidebar';
//import * as eventLine from './eventLine';
import { selectAll } from 'd3';


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

    const header = document.querySelector('#caleydoHeader');
    let cohortButtons = select(header)//.select('.navbar')
    .append('div').classed('cohort-buttons', true);
    let that = this;
    let create = cohortButtons.insert('input').attr('type', 'button').attr('class', 'btn').attr('value', 'Add Cohort');
    let branch = cohortButtons.insert('input').attr('type', 'button').attr('class', 'btn').attr('value', 'Branch Cohort');
    let clear = cohortButtons.insert('input').attr('type', 'button').attr('class', 'btn').attr('value', 'Clear Cohorts');
    create.on('click', function(d){ events.fire('create_button_down'); });
    branch.on('click', function(d){ events.fire('branch_cohort'); });
    clear.on('click', function(d){ events.fire('clear_cohorts'); });

    // main div - all div are within this div
    const main = this.$node.append('div').classed('main', true);
    const populationView = main.append('div').classed('population_view', true);
    const plots = main.append('div').classed('plot_view', true);
    const statBar = this.$node.append('div').classed('stat_sidebar_view', true);
  
    PlotKeeper.create(plots.node());
  
    //const timeline = plots.node().append('div').classed('timeline_view', true);
   // timelineKeeper.create(timeline.node());

   // eventLine.create(eventLineView.node(), null);
    codeside.create(statBar.node());

    inStat.create(main.node());

    const cpt = main.append('Div').classed('cptDiv', true);

    this.setBusy(false);

    this.attachListener();

  }

  private attachListener() {
  
    events.on('cohort_made', (evt, item)=>{
        
        let remove = document.querySelectorAll('.cohort_stat_view');
        for (var i = remove.length; i--; ) {
          remove[i].remove();
       }
      });
  
      events.on('clear_cohorts', () => {
  
        selectAll('.cohort_stat_view').remove();
  
      });
  
      events.on('load_cpt', () => {
  
         this.$node.select('.main').select('.distributions').classed('hidden', true);
         this.$node.select('.main').select('.cptDiv').classed('hidden', false);
         this.$node.select('.main').select('.rectDiv').classed('hidden', false);
  
     });
  
      events.on('show_distributions', ()=> {
  
      this.$node.select('.main').select('.distributions').classed('hidden', false);
  
      });
  
            // item: pat_id, DATA
      events.on('update_hierarchy', () => {  // called in query box
  
          this.$node.select('.main').select('.allDiagramDiv').select('.scoreGroup').classed('hidden', false);
          this.$node.select('.main').select('.rectDiv').classed('hidden', true);
  
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