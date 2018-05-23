/**
 * Created by Jen Rogers on 1/29/18.
 * cohortkeeper to keep all those cohorts.
 */
import * as ajax from 'phovea_core/src/ajax';
import {list as listData, getFirstByName, get as getById} from 'phovea_core/src/data';
import * as events from 'phovea_core/src/event';
import {nest, values, keys, map, entries} from 'd3-collection';
import * as d3 from 'd3';
import { filteredOrders } from 'client_app/src/similarityScoreDiagram';
import * as dataCalculations from './dataCalculations';
import * as codeDict from './cptDictionary';

export class CohortManager {

    cohortIdArray;//array of ids for defined patients
    allPatientPromis;
    cohortIndex = 0;
    cohortfilterarray = [];
    cohortkeeperarray = [];
    cptObjectKeeper = [];
    selectedCohort;//this is going to be the selected cohort from the cohort keeper array
    selectedFilter;//this is the selected filter from the cohortfilterarray;
    selectedCPT;
    cptCodes;
    codes;
    cohortCompareArray = [];
    seperatedBool;
    clumpedBool;
    seperatedCohortArray = [];

    //attempting to set up structure to hold filters
    filterRequirements = {
        'demo': null, //this is sent from sidebar
        'icd': null,
        'cpt': []
       };

    constructor() {
        this.codes = codeDict.create();
        this.seperatedBool = false;
        this.clumpedBool = false;
        this.attachListener();
    }

    private attachListener(){

        events.on('add_cohort_plot', (evt, item)=> {
            this.cohortCompareArray.push(this.cohortkeeperarray[item]);
            events.fire('add_another_plot', this.cohortCompareArray);
        });

        events.on('aggregate_button_clicked', ()=> {
            if(this.clumpedBool){
                events.fire('clear_clumpin');
                if(this.seperatedBool) {
                    events.fire('draw_plot', this.seperatedCohortArray);
                }else{ events.fire('draw_plot', null); }

                this.clumpedBool = false;
            }else{

                if(this.seperatedBool){
                    events.fire('draw_aggs', this.seperatedCohortArray);
                }else{ events.fire('draw_aggs', null); }
                this.clumpedBool = true;
            }
           
        });

        events.on('clear_cohorts', () => {
            this.removeCohortFilterArray();
          //  this.selectedCohort = this.allPatientPromis;
            events.fire('selected_cohort_change', null);
            events.fire('selected_event_filter_change', []);
        });

        events.on('cohort_selected', (evt, item)=>{

            d3.select('#cohortKeeper').selectAll('.selected').classed('selected', false);
 
            let cohort = item[0];
            let index = item[1];
            this.cohortIndex = index;
            this.selectedFilter = this.cohortfilterarray[this.cohortIndex];
            this.selectedCohort = this.cohortkeeperarray[this.cohortIndex];
            this.selectedCPT = this.cptObjectKeeper[this.cohortIndex];
            let selectedLabel = document.getElementById('cohortKeeper').getElementsByClassName(index);
            selectedLabel[0].classList.add('selected');

            events.fire('selected_cohort_change', this.selectedCohort);
            events.fire('selected_cpt_change', this.selectedCPT);
            events.fire('selected_stat_change', [this.selectedCohort, index]);
            events.fire('selected_event_filter_change', this.selectedFilter.cpt);
            events.fire('update_cohort_description', [this.selectedCohort, this.selectedFilter]);
            events.fire('send_filter_to_codebar', this.cohortfilterarray[this.cohortIndex]);

          });


        events.on('cohort_stats', ()=>{
            events.fire('send_cohort', this.selectedCohort);
          });

          events.on('cpt_mapped', (evt, item)=> {
            //THIS IS THE ENTIRE FILTERED CPT. NOT PER PAT.
              this.cptObjectKeeper.push(item);
              this.selectedCPT = this.cptObjectKeeper[this.cohortIndex];

          });

          events.on('demo_refine', (evt, item)=> {
            console.log(item);
            let filters = item;
            console.log(this.cohortkeeperarray[this.cohortIndex]);
            events.fire('get_selected_demo', [filters, this.cohortkeeperarray[this.cohortIndex]]);
          });

          events.on('separated_by_quant', (evt, item)=> {
            this.seperatedCohortArray = item;
            this.seperatedBool = true;
          });

        events.on('selected_promis_filtered', (evt, item)=>{//fired in data manager
            this.cohortkeeperarray[this.cohortIndex] = item;
            this.selectedCohort = item;
            events.fire('selected_cohort_change', this.selectedCohort);
        });

          events.on('add_demo_to_filter_array', (evt, item) => { // called in sidebar
       
            let filterReq = ['demographic', item[0], item[1]];
            this.addCohortFilter(filterReq);
           
          });

          
          events.on('add_layer_to_filter_array', (evt, item) => { // called in sidebar
        
            let filterReq = ['demographic', item[0], item[1]];
            this.cohortfilterarray[this.cohortIndex].push(filterReq);
            events.fire('send_filter_to_codebar', this.cohortfilterarray[this.cohortIndex]);
          });

          events.on('mapped_cpt_filtered', (evt, item)=>{
    
              this.selectedCPT = item;
              //THIS IS JACKED UP WHY IS IT JACKED UP
       

          });

          events.on('promis_from_demo_refiltered', (evt, item)=> {
              
              this.cohortkeeperarray[this.cohortIndex] = item;
              this.selectedCohort = item;

              //let filterReq = ['demographic', item[0], item[1]];
              //this.addCohortFilter(filterReq);

              events.fire('selected_cohort_change', this.selectedCohort);
             // events.fire('selected_cpt_change', this.selectedCPT);
             // events.fire('selected_stat_change', [this.selectedCohort, index]);
             // events.fire('selected_event_filter_change', this.selectedFilter.cpt);
              events.fire('update_cohort_description', [this.selectedCohort, this.selectedFilter]);
             // events.fire('send_filter_to_codebar', this.cohortfilterarray[this.cohortIndex]);
          });

          events.on('cpt_mapped', (evt, item)=>{
        
              this.cptObjectKeeper[this.cohortIndex] = item;
          });

          events.on('show_distributions', ()=> {
              //events.fire('cohort_stats', [this.selectedCohort, this.cohortIndex]);
              events.fire('cohort_stat_array', this.cohortkeeperarray);
          });

          events.on('filtered_patient_promis', (evt, item) => {
             this.cohortkeeperarray.push(item);
 
             this.selectedCohort = this.cohortkeeperarray[this.cohortIndex];
             this.selectedFilter = this.cohortfilterarray[this.cohortIndex];

             events.fire('selected_cohort_change', this.selectedCohort);
           
             events.fire('add_to_cohort_bar', [this.cohortfilterarray, this.cohortkeeperarray]);
             events.fire('add_to_cohort_stat', [this.selectedCohort, this.cohortIndex]);
             events.fire('selected_event_filter_change', []);
             events.fire('update_cohort_description', [this.selectedCohort, this.selectedFilter]);
             events.fire('send_filter_to_codebar', this.cohortfilterarray[this.cohortIndex]);

          });

          events.on('add_cpt_to_filterArray', (evt, item)=>{
           
            this.cohortfilterarray[this.cohortIndex].push(item);
          });

          events.on('filter_cohort_by_event', (evt, item)=> {
              this.selectedCPT = item[0];
              this.cptObjectKeeper[this.cohortIndex] = item[0];

              //do I want to keep the patient count available for the filter?

              this.cohortfilterarray[this.cohortIndex].push(['CPT', item[1], item[0].length]);
        
             // this.selectedFilter = this.cohortfilterarray[this.cohortIndex];
               
              events.fire('update_filters', [this.cohortfilterarray, this.cohortkeeperarray]);
              events.fire('update_cohort_description', [this.selectedCohort, this.selectedFilter]);
         
              //this is sent to similarity score diagram to set the target code array to the selected cohort's cpt filters

              events.fire('send_filter_to_codebar', this.cohortfilterarray[this.cohortIndex]);
          });

          events.on('filter_aggregate', (evt, item)=> {
          
            events.fire('filter_cohort_agg', [this.selectedCohort, item]);
        });

        events.on('separate_aggregate', (evt, item)=> {

            events.fire('separate_cohort_agg', this.selectedCohort);
        });

        events.on('filter_by_cpt', (evt, item)=> {
            let code = item;
           // events.fire()
        })

          events.on('filtered_by_quant', (evt, item)=> {
            this.cohortfilterarray[this.cohortIndex].quantile = item;
          
          });

          events.on('filtered_by_count', (evt, item)=>{
            this.selectedCohort = item[0];
            this.cohortkeeperarray[this.cohortIndex] = item[0];
            this.cohortfilterarray[this.cohortIndex].minCount = item[1];
            events.fire('update_filters', [this.cohortfilterarray, this.cohortkeeperarray]);
           // events.fire('update_cohort_description', [this.selectedCohort, this.selectedFilter]);
          });

          events.on('filter_by_Promis_count', (evt, item)=> {
              events.fire('filtering_Promis_count', [this.selectedCohort, item]);
          });

          events.on('send_stats', () => {
         
           // events.fire('calculate_agg', [this.selectedCohort, this.cohortIndex]);
           events.fire('calculate_aggregate', [this.selectedCohort, this.cohortIndex]);
          });

          events.on('cohort_interpolated', (evt, item)=> {
            this.cohortkeeperarray[this.cohortIndex] = item;
            this.selectedCohort = item;
          });


    }

    //adds a cohort filter to the cohort filter array for the cohorts
    //this is going to set the index because it fires first 
    private addCohortFilter (filter) {

        this.cohortfilterarray.push([filter]);
        this.cohortIndex = this.cohortfilterarray.length - 1;
       // this.cohortfilterarray[this.cohortIndex] = [];
       // this.cohortfilterarray[this.cohortIndex].push(filter);
        events.fire('cohort_added', this.cohortfilterarray);
    }

    private removeCohortFilterArray () {

        this.cohortfilterarray = [];
        this.cohortkeeperarray = [];
        this.cptObjectKeeper = [];
        this.cohortIndex = 0;

    }


  }

  export function create() {
    return new CohortManager();
}
