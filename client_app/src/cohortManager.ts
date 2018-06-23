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
    branchSelected;
    cohortTree = [];

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
        this.branchSelected = null;
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
                document.getElementById('aggToggle').classList.remove('btn-warning');
                this.clumpedBool = false;
            }else{

                if(this.seperatedBool){
                    events.fire('draw_aggs', this.seperatedCohortArray);
                }else{ events.fire('draw_aggs', null); }
                document.getElementById('aggToggle').classList.add('btn-warning');
                this.clumpedBool = true;
            }
        });

        events.on('branch_cohort', ()=> {
            let branch;
            if(this.cohortkeeperarray[this.cohortIndex].branch == undefined){
                console.log('new branch');
                branch = [];
            }else{ branch = this.cohortkeeperarray[this.cohortIndex].branch; }
            
            let b = Object.assign([], this.cohortkeeperarray[this.cohortIndex]);
            let bcpt = [Object.assign([], this.cptObjectKeeper[this.cohortIndex])];
            let bfilter = [Object.assign([], this.cohortfilterarray[this.cohortIndex])];
            branch.push(b);
            this.cohortkeeperarray[this.cohortIndex].branch = branch;
            
            this.cptObjectKeeper[this.cohortIndex].branch = bcpt;
            this.cohortfilterarray[this.cohortIndex].branch = bfilter;
            let newSpot = branch.length - 1;
            let indexBranch = this.cohortfilterarray[this.cohortIndex].length
            this.cohortfilterarray[this.cohortIndex].push(['Branch', newSpot, indexBranch]);
            let treeBranch = { 
                eventIndex: indexBranch,
                parentIndex: this.cohortIndex, 
                events: null, 
                promis: this.cohortkeeperarray[this.cohortIndex], 
                branches: [] };
            
            this.cohortTree[this.cohortIndex].branches.push(treeBranch);

            console.log(this.cohortTree)
         
            events.fire('update_filters', [this.selectedFilter, this.cohortkeeperarray]);
            events.fire('branch_selected', [this.cohortIndex, newSpot, branch[newSpot]]);
        });

        events.on('branch_selected', (evt, item)=> {
   
            this.branchSelected = item;
            this.selectedCohort = item[2];
  
            this.cohortIndex = item[0];
            let branchIndex = item[1];
            this.selectedCPT = this.cptObjectKeeper[this.cohortIndex].branch[branchIndex];
            this.selectedFilter = this.cohortfilterarray[this.cohortIndex].branch[branchIndex];
      
            events.fire('selected_cohort_change', this.selectedCohort);
            events.fire('selected_cpt_change', this.selectedCPT);
            events.fire('selected_stat_change', [this.selectedCohort, this.cohortIndex]);
            events.fire('selected_event_filter_change', this.selectedFilter.cpt);
            events.fire('update_cohort_description', [this.selectedCohort, this.selectedFilter]);
            events.fire('send_filter_to_codebar', [this.cohortfilterarray[this.cohortIndex].branch[branchIndex], this.cohortfilterarray]);
        });

        events.on('clear_cohorts', () => {
            this.removeCohortFilterArray();
            events.fire('selected_cohort_change', null);
            events.fire('selected_event_filter_change', []);
        });

        events.on('cohort_selected', (evt, item)=>{

           // d3.select('#cohortKeeper').selectAll('.selected').classed('selected', false);
            let cohort = item[0];
            let index = item[1];
            this.cohortIndex = index;
            this.selectedFilter = this.cohortfilterarray[this.cohortIndex];
            this.selectedCohort = this.cohortkeeperarray[this.cohortIndex];
            this.selectedCPT = this.cptObjectKeeper[this.cohortIndex];
            let selectedLabel = document.getElementById('cohortKeeper').getElementsByClassName(index);
          //  selectedLabel[0].classList.add('selected');
            this.branchSelected = null;

            events.fire('selected_cohort_change', this.selectedCohort);
            events.fire('selected_cpt_change', this.selectedCPT);
            events.fire('selected_stat_change', [this.selectedCohort, index]);
            events.fire('selected_event_filter_change', this.selectedFilter.cpt);
            events.fire('update_cohort_description', [this.selectedCohort, this.selectedFilter]);
            events.fire('send_filter_to_codebar', [this.cohortfilterarray[this.cohortIndex], this.cohortfilterarray]);

          });

        events.on('cohort_stats', ()=>{
         
            events.fire('send_cohort', this.selectedCohort);
          });

          events.on('cpt_mapped', (evt, item)=> {
            //THIS IS THE ENTIRE FILTERED CPT. NOT PER PAT.
              this.cptObjectKeeper.push(item);
              this.selectedCPT = this.cptObjectKeeper[this.cohortIndex];

          });
//fired in sidebar. send the filter information to refine the sidebar
          events.on('demo_refine', (evt, item)=> {
     
            let filters = item;
            if(this.branchSelected == null){
                events.fire('get_selected_demo', [filters, this.cohortkeeperarray[this.cohortIndex]]);
            }else{
                let index = this.branchSelected[0];
                let branchIndex = this.branchSelected[1];

                events.fire('get_selected_demo', [filters, this.cohortkeeperarray[index].branch[branchIndex]]);
            }
            
          });

          events.on('separated_by_quant', (evt, item)=> {
            this.seperatedCohortArray = item;
            this.seperatedBool = true;
          });

        events.on('selected_promis_filtered', (evt, item)=>{//fired in data manager
          
            if(this.branchSelected == null){
              
                if(this.cohortkeeperarray[this.cohortIndex].branch == undefined){
             
                    this.cohortkeeperarray[this.cohortIndex] = item;
                    this.selectedCohort = item;
                }else{
             
              
                }
               
                events.fire('selected_cohort_change', this.selectedCohort);
            }else{
              
                let index = this.branchSelected[0];
                let indexBranch = this.branchSelected[1];
                this.cohortkeeperarray[index].branch[indexBranch] = item;
                this.selectedCohort = item;
                events.fire('selected_cohort_change', this.selectedCohort);
                }
            
        });

          events.on('add_demo_to_filter_array', (evt, item) => { // called in sidebar
       
            let filterReq = ['demographic', item[0], item[1]];
            this.addCohortFilter(filterReq);
           
          });

          
          events.on('add_layer_to_filter_array', (evt, item) => { // called in sidebar
            let filterReq = ['demographic', item[0], item[1]];

            if(this.branchSelected == null){
               
                this.cohortfilterarray[this.cohortIndex].push(filterReq);
                events.fire('send_filter_to_codebar', [this.cohortfilterarray[this.cohortIndex], this.cohortfilterarray]);
            }else{
               
            }
          });

          events.on('frequency', ()=> { events.fire('frequency_test', this.selectedCohort)});

          events.on('mapped_cpt_filtered', (evt, item)=>{
              this.selectedCPT = item;
          });

          events.on('promis_from_demo_refiltered', (evt, item)=> {
          
              this.branchoNot(item, this.cohortkeeperarray).then(selected=> { 

                this.selectedCohort = selected;
                events.fire('selected_cohort_change', selected);
                events.fire('update_cohort_description', [selected, this.selectedFilter]);
               });

          });

          events.on('cpt_mapped', (evt, item)=>{
        
              this.cptObjectKeeper[this.cohortIndex] = item;
          });

          events.on('show_distributions', ()=> {
              events.fire('cohort_stat_array', this.cohortkeeperarray);
          });

          events.on('filtered_patient_promis', (evt, item) => {
            
             this.cohortkeeperarray.push(item);

             let  newParent = {
                 eventIndex: 0,
                 parentIndex: null,
                 events: this.cohortfilterarray[this.cohortIndex], 
                 promis: this.cohortkeeperarray[this.cohortIndex], 
                 branches: [] };

             this.cohortTree.push(newParent);
            // console.log(this.cohortTree);
            
             this.selectedCohort = this.cohortkeeperarray[this.cohortIndex];
             this.selectedFilter = this.cohortfilterarray[this.cohortIndex];

             events.fire('selected_cohort_change', this.selectedCohort);
             events.fire('add_to_cohort_bar', [this.cohortfilterarray, this.cohortkeeperarray]);
             events.fire('add_to_cohort_stat', [this.selectedCohort, this.cohortIndex]);
             events.fire('selected_event_filter_change', this.cohortfilterarray[this.cohortIndex]);
             events.fire('update_cohort_description', [this.selectedCohort, this.selectedFilter]);
             events.fire('send_filter_to_codebar', [this.cohortfilterarray[this.cohortIndex], this.cohortfilterarray]);

          });

          events.on('add_cpt_to_filterArray', (evt, item)=>{
            
            this.cohortfilterarray[this.cohortIndex].push(item);
            console.log(this.cohortTree);
          });

          events.on('filter_cohort_by_event', (evt, item)=> {
              this.selectedCPT = item[0];
              
              let cptfil = ['CPT', item[1], item[0].length];
              
              if(this.branchSelected == null){
                   
                    if(this.cohortfilterarray[this.cohortIndex].branch == undefined){
                        this.cptObjectKeeper[this.cohortIndex] = item[0];
                        this.cohortfilterarray[this.cohortIndex].push(cptfil);
                        events.fire('send_filter_to_codebar', [this.cohortfilterarray[this.cohortIndex], this.cohortfilterarray]);
                    }else{
                        
                        let tempBranch = this.cohortfilterarray[this.cohortIndex].branch;
                        this.cohortfilterarray[this.cohortIndex].push(cptfil);
                        this.cohortfilterarray[this.cohortIndex].branch = tempBranch;

                        let tempcpt =  item[0];
                        tempcpt.branch = this.cptObjectKeeper[this.cohortIndex].branch;
                        this.cptObjectKeeper[this.cohortIndex] = tempcpt;
                        
                        events.fire('send_filter_to_codebar', [this.cohortfilterarray[this.cohortIndex], this.cohortfilterarray]);
                        
                    }
               
              }else{
               
                  let index = this.branchSelected[0];
                  let branchIndex = this.branchSelected[1];
                  this.cptObjectKeeper[this.cohortIndex].branch[branchIndex] = item[0];
                  this.cohortfilterarray[index].branch[branchIndex].push(cptfil);
                 
                  events.fire('send_filter_to_codebar',[ this.cohortfilterarray[this.cohortIndex].branch[branchIndex], this.cohortfilterarray]);
              }

              console.log(this.cohortTree);
              
          });

          events.on('filter_aggregate', (evt, item)=> {
            events.fire('filter_cohort_agg', [this.selectedCohort, item]);
        });

        events.on('separate_aggregate', (evt, item)=> {
            events.fire('separate_cohort_agg', this.selectedCohort);
        });

        events.on('filter_by_cpt', (evt, item)=> {
            let code = item;
        });

          events.on('filtered_by_quant', (evt, item)=> {
            this.cohortfilterarray[this.cohortIndex].quantile = item;
          });

          events.on('filtered_by_count', (evt, item)=>{
            this.selectedCohort = item[0];
            this.cohortkeeperarray[this.cohortIndex] = item[0];
            this.cohortfilterarray[this.cohortIndex].minCount = item[1];
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

          events.on('min_day_added', (evt, item)=> {
              //do I need this??
              /*
              if(this.branchSelected == null){
                  console.log('branch null');
                  this.cohortkeeperarray[this.cohortIndex] = item;
                  this.selectedCohort = item;
              }else{
                  let index = this.branchSelected[0];
                  let branchIndex = this.branchSelected[1];
                  this.cohortkeeperarray[index].branch[branchIndex] = item;
                  this.selectedCohort = item;
              }*/
              this.branchoNot(item, this.cohortkeeperarray).then(cohort=> {

                  this.selectedCohort = cohort;
              });
        
          });

          events.on('update_start_button_clicked', (evt, item)=> {
           
              events.fire('update_cpt_days', this.selectedCPT);
          });

    }

    private async branchoNot(item, array){

        let selected;
      

        if(this.branchSelected == null){
            if(array[this.cohortIndex].branch == undefined){
                
                array[this.cohortIndex] = item;
                selected = item;
        
            }else{
              
                let tempBranch = array[this.cohortIndex].branch;
                item.branch = tempBranch;
                array[this.cohortIndex] = item;
                selected = item;
            }
        }else{
           
            let index = this.branchSelected[0];
            let indexBranch = this.branchSelected[1];
            array[index].branch[indexBranch] = item;
            selected = item;
           
            }
        return selected;
    }

    //adds a cohort filter to the cohort filter array for the cohorts
    //this is going to set the index because it fires first 
    private addCohortFilter (filter) {

        this.cohortfilterarray.push([filter]);
        this.cohortIndex = this.cohortfilterarray.length - 1;

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
