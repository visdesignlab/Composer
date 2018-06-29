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
    cohortIndex = 0;
    selectedCohort;//this is going to be the selected cohort from the cohort keeper array
    cptCodes;
    codes;
    cohortCompareArray = [];
    branchSelected;
    cohortTree = [];
    comparisonBool;

    constructor() {
        this.codes = codeDict.create();
        this.branchSelected = null;
        this.comparisonBool = false;
        this.attachListener();
    }

    private attachListener(){

        events.on('compare_cohorts', ()=> {
            console.log(this.cohortTree);
            });
        events.on('add_cpt_to_filterArray', (evt, item)=>{
   
              });
        events.on('aggregate_button_clicked', ()=> {

            let clumped = this.cohortTree[this.cohortIndex].clumped;
            console.log(clumped);
            if (clumped){
                clumped = false;
                document.getElementById('aggToggle').classList.remove('btn-warning');
            }else{
                clumped = true;
                document.getElementById('aggToggle').classList.add('btn-warning');
            }
            if(this.branchSelected == null){
                this.cohortTree[this.cohortIndex].clumped = clumped;
                this.selectedCohort = this.cohortTree[this.cohortIndex];
            }else{
                this.cohortTree[this.branchSelected[0]].branches[this.branchSelected[1]].clumped = clumped;
                this.selectedCohort = this.cohortTree[this.branchSelected[0]].branches[this.branchSelected[1]];
            }

            console.log(this.selectedCohort);
            events.fire('update_chart', this.selectedCohort);

            });

        events.on('branch_cohort', ()=> {

            console.log(this.cohortIndex);
            let branch;
            if(this.cohortTree[this.cohortIndex].branches.length == 0){
                console.log('first branch');
                branch = [];
            }else{ 
                branch = this.cohortTree[this.cohortIndex].branches;
                console.log('other branch');
            }

            let b = Object.assign([], this.cohortTree[this.cohortIndex].promis);
         
            let bcpt = Object.assign([], this.cohortTree[this.cohortIndex].cpt);
           
            let bfilter = Object.assign([], this.cohortTree[this.cohortIndex].events);
      
            branch.push(b);
          
            let newSpot = branch.length - 1;
            let indexBranch =  this.cohortTree[this.cohortIndex].events.length;
            this.cohortTree[this.cohortIndex].events.push(['Branch', newSpot, indexBranch]);
            let branchFirst = [{parentEvents: bfilter, parentLink: [this.cohortIndex, b.length - 2]}];

            let treeBranch = { 
                eventIndex: indexBranch,
                parentIndex: this.cohortIndex,
                events: bfilter,
                promis: b,
                cpt: bcpt,
                separated: false,
                clumped: false,
                scaleR: false,
                branches: [] };

            this.cohortTree[this.cohortIndex].branches.push(treeBranch);
           
            events.fire('branch_selected', [this.cohortIndex, newSpot]);
         
            });

        events.on('branch_selected', (evt, item)=> {
    
            this.branchSelected = item;
            this.cohortIndex = item[0];
            let branchIndex = item[1];
            this.selectedCohort = this.cohortTree[this.cohortIndex].branches[branchIndex];
            console.log(this.branchSelected);
            events.fire('update_filters', [this.cohortTree, this.branchSelected]);
            events.fire('selected_cohort_change', this.selectedCohort);
            //events.fire('send_filter_to_codebar', [this.cohortfilterarray[this.cohortIndex].branch[branchIndex], this.cohortfilterarray]);
            events.fire('send_filter_to_codebar', this.cohortTree[this.cohortIndex].branches[branchIndex].events);
            events.fire('test', [this.cohortTree, this.branchSelected]);
            });

        events.on('change_promis_scale', ()=> {
            let scaleRelative;
            if(this.branchSelected == null){
                scaleRelative = this.cohortTree[this.cohortIndex].scaleR;
                this.selectedCohort = this.cohortTree[this.cohortIndex];
            }else{
                scaleRelative = this.cohortTree[this.branchSelected[0]].branches[this.branchSelected[1]].scaleR;
                this.selectedCohort = this.cohortTree[this.branchSelected[0]].branches[this.branchSelected[1]];
            }

            if(!scaleRelative){
                scaleRelative = true;
                
            }else{
                scaleRelative = false;

            }

            this.selectedCohort.scaleR = scaleRelative;
            events.fire('update_scale', this.selectedCohort);
           
        });

        events.on('clear_cohorts', () => {
            this.removeCohortFilterArray();
            events.fire('selected_cohort_change', null);
            events.fire('selected_event_filter_change', []);
            });

        events.on('cohort_selected', (evt, item)=>{
            console.log(item);
            let cohort = item[0];
            let index = item[1];
            this.cohortIndex = index;

            console.log(item[0]);
           
            this.cohortTree[this.cohortIndex].promis = item[0].promis;
            this.selectedCohort = this.cohortTree[this.cohortIndex];
           
            let selectedLabel = document.getElementById('cohortKeeper').getElementsByClassName(index);
            this.branchSelected = null;

            events.fire('selected_cohort_change', this.selectedCohort);
           
            events.fire('send_filter_to_codebar', this.cohortTree[this.cohortIndex].events);
            console.log('cohort_selected?');
            events.fire('test', [this.cohortTree, [index]]);
          });

        events.on('cohort_stats', ()=>{
         
            events.fire('send_cohort', this.selectedCohort);
          });

//fired in sidebar. send the filter information to refine the sidebar
        events.on('demo_refine', (evt, item)=> {
     
            let filters = item;
            if(this.branchSelected == null){
                events.fire('get_selected_demo', [filters, this.cohortTree[this.cohortIndex].promis]);
            }else{
                let index = this.branchSelected[0];
                let branchIndex = this.branchSelected[1];
                events.fire('get_selected_demo', [filters, this.cohortTree[index].branches[branchIndex].promis]);
            }
            
          });

        events.on('separated_by_quant', (evt, item)=> {
           // this.seperatedCohortArray = item;
            if(this.branchSelected == null){
                this.cohortTree[this.cohortIndex].promisSep = item;
                this.cohortTree[this.cohortIndex].separated = true;
                this.selectedCohort = this.cohortTree[this.cohortIndex];
            }else{
                this.cohortTree[this.branchSelected[0]].branches[this.branchSelected[1]].promisSep = item;
                this.cohortTree[this.branchSelected[0]].branches[this.branchSelected[1]].separated = true;
                this.selectedCohort = this.cohortTree[this.branchSelected[0]].branches[this.branchSelected[1]];
            }
           events.fire('update_chart', this.selectedCohort);
          });

        events.on('selected_promis_filtered', (evt, item)=>{//fired in data manager
                
            if(this.branchSelected == null){
                this.cohortTree[this.cohortIndex].promis = item;
                this.selectedCohort = this.cohortTree[this.cohortIndex];
            }else{
                let index = this.branchSelected[0];
                let indexBranch = this.branchSelected[1];
                this.cohortTree[index].branches[indexBranch].promis = item;
                this.selectedCohort = this.cohortTree[index].branches[indexBranch];
                }

                events.fire('selected_cohort_change', this.selectedCohort);
            });

        events.on('add_demo_to_filter_array', (evt, item) => { // called in sidebar
       
            let filterReq = ['demographic', item[0], item[1]];
            this.addCohortFilter(filterReq);
           
          });

          events.on('create_button_down', ()=> {

            let newParent = {
                eventIndex: 0,
                parentIndex: null,
                events: [],
                promis: null,
                cpt: null,
                separated: false,
                clumped: false,
                scaleR: false,
                branches: [] };

            this.cohortTree.push(newParent);
            this.selectedCohort = this.cohortTree[this.cohortIndex];
          
            this.branchSelected = null;
            this.cohortIndex = this.cohortTree.length - 1;
           
          });

          
        events.on('add_layer_to_filter_array', (evt, item) => { // called in sidebar
            let filterReq = ['demographic', item[0], item[1]];
          
            if(this.branchSelected == null){
                this.cohortTree[this.cohortIndex].events.push(filterReq);
                events.fire('send_filter_to_codebar', this.cohortTree[this.cohortIndex].events);
                events.fire('test', [this.cohortTree, [this.cohortIndex]]);
            }else{
                this.cohortTree[this.cohortIndex].branches[this.branchSelected[1]].events.push(filterReq);
                events.fire('send_filter_to_codebar', this.cohortTree[this.cohortIndex].branches[this.branchSelected[1]].events);
                events.fire('test', [this.cohortTree, [this.branchSelected]]);
            }
          });

        events.on('frequency', ()=> { events.fire('frequency_test', this.selectedCohort)});
        events.on('promis_from_demo_refiltered', (evt, item)=> {
            if(this.branchSelected == null){
                this.cohortTree[this.cohortIndex].promis = item;
                this.selectedCohort = this.cohortTree[this.cohortIndex];
            }else{
                this.cohortTree[this.cohortIndex].branches[this.branchSelected[1]].promis = item;
                this.selectedCohort = this.cohortTree[this.cohortIndex].branches[this.branchSelected[1]]
            }
            events.fire('selected_cohort_change', this.selectedCohort);

          });

        events.on('cpt_mapped', (evt, item)=>{
              this.cohortTree[this.cohortIndex].cpt = item;
          });

        events.on('show_distributions', ()=> {
              events.fire('cohort_stat_array', this.cohortTree);
          });

        events.on('filtered_patient_promis', (evt, item) => {
          
           this.cohortTree[this.cohortIndex].promis = item;
           
           this.selectedCohort = this.cohortTree[this.cohortIndex];
          
            // events.fire('cohort_selected', [this.selectedCohort, this.cohortIndex, this.cohortTree]);
             events.fire('selected_cohort_change', this.selectedCohort);
             events.fire('add_to_cohort_bar', this.cohortTree);
       
             events.fire('selected_event_filter_change', this.cohortTree[this.cohortIndex]);
           
             //events.fire('update_cohort_description', [this.selectedCohort, this.selectedFilter]);
             events.fire('send_filter_to_codebar', this.cohortTree[this.cohortIndex].events);
             events.fire('test', [this.cohortTree, [this.cohortIndex]]);

          });

        events.on('filter_cohort_by_event', (evt, item)=> {
             console.log(item);

              let cptfil = ['CPT', item[2], item[0].length];

              if(this.branchSelected == null){

                    this.cohortTree[this.cohortIndex].events.push(cptfil);
                    this.cohortTree[this.cohortIndex].cpt = item[0];
                    this.cohortTree[this.cohortIndex].promis = item[1];
                    this.cohortTree[this.cohortIndex].separated = false;
                    this.cohortTree[this.cohortIndex].clumped = false;
                    this.selectedCohort = this.cohortTree[this.cohortIndex];

                    events.fire('send_filter_to_codebar', this.cohortTree[this.cohortIndex].events);
                    events.fire('test', [this.cohortTree, [this.cohortIndex]]);
                 
              }else{
                  let index = this.branchSelected[0];
                  let branchIndex = this.branchSelected[1];
                  this.cohortTree[index].branches[branchIndex].events.push(cptfil);
                  this.cohortTree[index].branches[branchIndex].cpt = item[0];
                  this.cohortTree[index].branches[branchIndex].promis = item[1];
                  this.selectedCohort = this.cohortTree[index].branches[branchIndex];

                  events.fire('send_filter_to_codebar',this.cohortTree[this.cohortIndex].branches[branchIndex].events);
                  events.fire('test', [this.cohortTree, this.branchSelected]);
                }

                events.fire('update_chart', this.selectedCohort);
             
          });

        events.on('filter_aggregate', (evt, item)=> {
            events.fire('filter_cohort_agg', [this.selectedCohort, item]);
          });

        events.on('separate_aggregate', (evt, item)=> {
            console.log(this.selectedCohort);
            if(this.selectedCohort.separated){
                console.log('sep!');
                this.selectedCohort.separated = false;
                document.getElementById('quartile-btn').classList.remove('btn-warning');
                document.getElementById('checkDiv').classList.add('hidden');
                events.fire('draw_plot', null);

            }else{
                console.log('not sep');
                this.selectedCohort.separated = true;
                document.getElementById('quartile-btn').classList.add('btn-warning');
                document.getElementById('checkDiv').classList.remove('hidden');
                events.fire('separate_cohort_agg', this.selectedCohort);
            }
            });

        events.on('filtered_by_quant', (evt, item)=> {
            
            if(this.branchSelected == null){
                this.cohortTree[this.cohortIndex].quantile = item;
                this.cohortTree[this.cohortIndex].promis = item;
                this.selectedCohort = this.cohortTree[this.cohortIndex];
            }else{
                this.cohortTree[this.branchSelected[0]].branches[this.branchSelected[1]].quantile = item;
                this.cohortTree[this.branchSelected[0]].branches[this.branchSelected[1]].promis = item;
                this.selectedCohort = this.cohortTree[this.branchSelected[0]].branches[this.branchSelected[1]];
            }
            events.fire('update_chart', this.selectedCohort);
          });

        events.on('filtered_by_count', (evt, item)=>{
           // this.selectedCohort = item[0];
         
            if(this.branchSelected == null){
                this.cohortTree[this.cohortIndex].events.push(['Score Count', item[1], item[0].length]);
                this.cohortTree[this.cohortIndex].promis = item[0];
                this.cohortTree[this.cohortIndex].separated = false;
                this.cohortTree[this.cohortIndex].clumped = false;
                this.selectedCohort = this.cohortTree[this.cohortIndex];
                events.fire('send_filter_to_codebar', this.cohortTree[this.cohortIndex].events);
                events.fire('test', [this.cohortTree, [this.cohortIndex]]);
            }else{
                this.cohortTree[this.cohortIndex].branches[this.branchSelected[1]].events.push(['Score Count', item[1], item[0].length]);
                this.cohortTree[this.cohortIndex].branches[this.branchSelected].promis = item[0];
                this.cohortTree[this.cohortIndex].branches[this.branchSelected].separated = false;
                this.cohortTree[this.cohortIndex].branches[this.branchSelected].clumped = false;
                this.selectedCohort = this.cohortTree[this.cohortIndex].branches[this.branchSelected[1]];
                events.fire('send_filter_to_codebar', this.cohortTree[this.cohortIndex].branches[this.branchSelected[1]].events);
                events.fire('test', [this.cohortTree, this.branchSelected]);
            }

            
            events.fire('update_chart', this.selectedCohort);
          });

        events.on('filter_by_Promis_count', (evt, item)=> {
              events.fire('filtering_Promis_count', [this.selectedCohort, item]);
          });

        events.on('send_stats', () => {
           events.fire('calculate_aggregate', [this.selectedCohort, this.cohortIndex]);
          });

        events.on('cohort_interpolated', (evt, item)=> {
            console.log('cohort interpolated');
            if(this.branchSelected == null){
                this.cohortTree[this.cohortIndex].promis = item;
                this.selectedCohort = this.cohortTree[this.cohortIndex];
            }else{
                this.cohortTree[this.cohortIndex].branches[this.branchSelected[1]].promis = item;
                this.selectedCohort = this.cohortTree[this.cohortIndex].branches[this.branchSelected[1]];
            }
            events.fire('update_chart', this.selectedCohort);
          });

        events.on('min_day_added', (evt, item)=> {
            if(this.branchSelected == null){
                this.cohortTree[this.cohortIndex].promis = item;
                this.selectedCohort = this.cohortTree[this.cohortIndex];
            }else{
                this.cohortTree[this.branchSelected[0]].branches[this.branchSelected[1]].promis = item;
                this.selectedCohort = this.cohortTree[this.branchSelected[0]].branches[this.branchSelected[1]];
            }
            events.fire('update_chart', this.selectedCohort);
          });

        events.on('update_start_button_clicked', (evt, item)=> {
              let cpt = this.cohortTree[this.cohortIndex].cpt;
              events.fire('update_cpt_days', [cpt, null]);
          });

        events.on('cpt_updated', (evt, item)=> {

             if(this.branchSelected == null){
                this.cohortTree[this.cohortIndex].cpt = item;
            }else{
                this.cohortTree[this.cohortIndex].branches[this.branchSelected[1]].cpt = item;
            }
          });

    }

    //adds a cohort filter to the cohort filter array for the cohorts
    //this is going to set the index because it fires first 
    private addCohortFilter (filter) {
      
        this.cohortTree[this.cohortIndex].events.push(filter);
     
        events.fire('cohort_added', this.cohortTree);
    }

    private removeCohortFilterArray () {

        this.cohortTree = [];
        this.cohortIndex = 0;

    }


  }

  export function create() {
    return new CohortManager();
}
