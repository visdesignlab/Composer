/**
 * Created by Jen Rogers on 1/29/18.
 * cohortkeeper to keep all those cohorts.
 */
import * as ajax from 'phovea_core/src/ajax';
import {list as listData, getFirstByName, get as getById} from 'phovea_core/src/data';
import * as events from 'phovea_core/src/event';
import {nest, values, keys, map, entries} from 'd3-collection';
import * as d3 from 'd3';
import * as dataCalculations from './dataCalculations';
import * as codeDict from './cptDictionary';

class Cohort {

        label: string;
        dataType: string;
        cohortIndex: any;
        eventIndex: any;
        parentIndex: any;
        flatIndex: any;
        og: {promis: any[]; oswestry: any[]};
        promis: any[];
        oswestry: any[];
        chartData: Object[];
        cpt: any[];
        filterArray: any;
        promisSep: any;
        promisAgg: any;
        separated: any;
        clumped: any;
        scaleR: boolean;
        startEvent: any;
        branches: any;

        constructor() {
            this.promisSep = null;
            this.promisAgg = null;
            this.separated = null;
            this.clumped = false;
            this.scaleR = false;
            this.startEvent = null;
            this.branches = [];
            this.parentIndex = null;
            this.filterArray = [];
        }

    }

export class CohortManager {

    cohortIdArray;//array of ids for defined patients
    cohortIndex;
    selectedCohort;//this is going to be the selected cohort from the cohort keeper array
    codes;
    branchSelected;
    cohortTree = [];
    comparisonBool;
    layerBool;
    counter;
    layerKeeper;
    plotCount;

    constructor() {
        this.codes = codeDict.create();
        this.branchSelected = null;
        this.cohortIndex = 0;
        this.counter = 0;
        this.layerKeeper = {layers : [], clumped: false, scaleR: false}
        this.plotCount = 0;
        this.selectedCohort;
        this.cohortTree;
        
        this.attachListener();
    }

    private attachListener(){

        events.on('add_layer_to_filter_array', (evt, item) => { // called in sidebar
    
                if(this.branchSelected == null){
                    
                    this.flatten(this.cohortTree).then(flatData=> {
                        this.selectedCohort =  flatData[this.cohortIndex];
                        console.log(flatData);
                        events.fire('test', [flatData, [this.cohortIndex]]);
                    });
                }else{
                    this.flatten(this.cohortTree).then(flatData=> {
                        this.selectedCohort = flatData[this.cohortIndex].branches[this.branchSelected[1]];
                        events.fire('test', [flatData, [this.branchSelected]]);
                    });
                }
                events.fire('update_chart', this.selectedCohort);
        });

        events.on('update_layers', (evt, item)=> {
 
            if(this.layerKeeper.scaleR == true){
                item.forEach(cohort => {
                    cohort.data.scaleR = true;
                });
            }else{
                item.forEach(cohort => {
                    cohort.data.scaleR = false;
                });
            }
            if(this.layerKeeper.clumped == true){
                item.forEach(cohort => {
                    cohort.data.clumped = true;
                });
            }else{
                item.forEach(cohort => {
                    cohort.data.clumped = false;
                });
            }
            
            this.layerKeeper.layers = item;
       
            events.fire('draw_layers', this.layerKeeper);
        });
    

        events.on('aggregate_button_clicked', ()=> {
            if(this.layerBool == true){
                if(!this.layerKeeper.clumped){
                    this.layerKeeper.layers.forEach(layer => {
                        layer.data.clumped = true;
                    });
                    this.layerKeeper.clumped = true;
                }else{
                    this.layerKeeper.layers.forEach(layer => {
                        layer.data.clumped = false;
                    });
                    this.layerKeeper.clumped = false;
                    }
                events.fire('calc_bins', this.layerKeeper);
            }else{
                let clumped = this.selectedCohort.clumped;
                if(clumped){
                    clumped = false;
                    this.selectedCohort.clumped = false;
                }else{
                    clumped = true;
                    this.selectedCohort.clumped = true;
                }
               events.fire('calc_bins', this.selectedCohort);
            }
        });

        events.on('bins_calculated', (evt, item)=> {
            if(this.layerBool){
                item.forEach((layer, i) => {
                    this.layerKeeper.layers[i].data.chartData = layer;
                });
                events.fire('draw_layers', this.layerKeeper);
            }else{
                this.selectedCohort.chartData = item;
                
                
                events.fire('update_chart', this.selectedCohort);
            }
        });

        events.on('branch_cohort', ()=> {

            let branch;
            if(this.cohortTree[this.cohortIndex].branches.length == 0){
                branch = [];
            }else{ 
                branch = this.cohortTree[this.cohortIndex].branches;
            }
            let og = this.selectedCohort.og;
            let promis = this.selectedCohort.promis;
            let cpt = this.selectedCohort.cpt;
            let oswestry = this.selectedCohort.oswestry;
            let filterArray = this.selectedCohort.filterArray;
            let chartData = this.selectedCohort.chartData;
            let dataType = this.selectedCohort.dataType;
            let bcpt = JSON.parse(JSON.stringify(cpt));
            let bos = JSON.parse(JSON.stringify(oswestry));
            let bchart = JSON.parse(JSON.stringify(chartData));
            let bfilter = Object.assign([], this.cohortTree[this.cohortIndex].filterArray);
            let b = JSON.parse(JSON.stringify(promis));
            let bog = JSON.parse(JSON.stringify(og));
      
            branch.push(b);
          
            let newSpot = branch.length - 1;
            let indexBranch =  this.cohortTree[this.cohortIndex].filterArray.length;
            let filterReq = {type: 'Branch', value: [newSpot, indexBranch], count: this.cohortTree[this.cohortIndex].length };
            this.cohortTree[this.cohortIndex].filterArray.push(filterReq);
            let branchFirst = [{parentEvents: bfilter, parentLink: [this.cohortIndex, b.length - 2]}];

            let treeBranch = new Cohort();

            treeBranch.label = "C-"+ String(this.cohortIndex + 1) + " Branch-" + String((this.cohortTree[this.cohortIndex].branches + 1));
            treeBranch.eventIndex = indexBranch;
            treeBranch.parentIndex = this.cohortIndex;
            treeBranch.flatIndex = this.counter;
            treeBranch.filterArray = bfilter;
            treeBranch.promis = b;
            treeBranch.og = bog;
            treeBranch.cpt = bcpt;
            treeBranch.oswestry = bos;
            treeBranch.chartData = bchart;
            treeBranch.cohortIndex = [this.cohortIndex, newSpot];
            treeBranch.dataType = dataType;
            this.cohortTree[this.cohortIndex].branches.push(treeBranch);
            this.counter++;
           
           // events.fire('branch_selected', treeBranch.cohortIndex);
            this.selectCohort(treeBranch);
            });

        events.on('change_promis_scale', ()=> {

            if(this.layerBool == true){
            
                if(!this.layerKeeper.scaleR){
                    this.layerKeeper.layers.forEach(layer => {
                        layer.data.scaleR = true;
                    });
                    this.layerKeeper.scaleR = true;
                }else{
                        this.layerKeeper.layers.forEach(layer => {
                            layer.data.scaleR = false;
                        });
                        this.layerKeeper.scaleR = false;
                    }
                
                events.fire('draw_layers', this.layerKeeper);
            }else{  
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
                
                events.fire('update_chart', this.selectedCohort);
            }
           
        });

        events.on('clear_cohorts', () => {
            this.removeCohortFilterArray();
            this.counter = 0;
            events.fire('clear_charts', null);
            this.layerBool = false;
            events.fire('create_button_down');
            });

         events.on('cpt_filter_button', (evt, item)=> {
   
            let filterLabel = item[1][0].key;
            console.log(this.selectedCohort);
            console.log(item);
            console.log('cpt filter button');
   
            let filterArray = this.selectedCohort.filterArray;
            console.log(filterArray);
        /*
            if(item !== undefined){
                console.log(item);
                let test = filterArray.map(d=> d.filter);
                let testIndex = test.indexOf(item.parent);
        
                if(+testIndex > -1){
                    this.selectedCohort.filterArray = filterArray;
                    this.selectedCohort.filterArray[testIndex].value = item[0];
              
                }else{
                    let filterReq = { filter: filterLabel, type: 'CPT', value: item[0], count: null };
                    this.selectedCohort.filterArray.push(filterReq);
                    console.log(this.selectedCohort);
                    console.log(this.selectedCohort.filterArray);
                }*/
                let filterReq = { filter: filterLabel, type: 'CPT', value: item[0], count: null };
                this.selectedCohort.filterArray.push(filterReq);
                console.log(this.selectedCohort);
                console.log(this.selectedCohort.filterArray);

                events.fire('filter_data', [this.selectedCohort,  this.selectedCohort.filterArray, filterLabel]);
          //  }
         });

         events.on('cpt_exclude', (evt, item)=> {
   
            let filterLabel = item[1][0].key;
       
            let filterArray = this.selectedCohort.filterArray;
            if(filterArray[0].length > 1){
                let temp = [];
                filterArray.forEach(fil => {
                    if(fil.length > 1){
                        fil.forEach(f => { temp.push(f); });
                    }else{ temp.push(fil); }
                });
                filterArray = temp;
            }
            if(item != null){
                let test = filterArray.map(d=> d.filter);
                let testIndex = test.indexOf(item.parent);
        
                if(+testIndex > -1){
                    this.selectedCohort.filterArray = filterArray;
                    this.selectedCohort.filterArray[testIndex].value = item[0];
              
                }else{
                    let filterReq = { filter: filterLabel, type: 'X-CPT', value: item[0], count: null };
                    this.selectedCohort.filterArray.push(filterReq);
                }
                events.fire('filter_data', [this.selectedCohort,  this.selectedCohort.filterArray, filterLabel]);
            }
         });

         events.on('filter_by_count', (evt, item)=> {
   
            let filterLabel = 'Score Count';
       
            let filterArray = this.selectedCohort.filterArray;
            if(filterArray[0].length > 1){
                let temp = [];
                filterArray.forEach(fil => {
                    if(fil.length > 1){
                        fil.forEach(f => { temp.push(f); });
                    }else{ temp.push(fil); }
                });
                filterArray = temp;
            }
            if(item != null){
                let test = filterArray.map(d=> d.filter);
                let testIndex = test.indexOf(item.parent);
        
                if(+testIndex > -1){
                    this.selectedCohort.filterArray = filterArray;
                    this.selectedCohort.filterArray[testIndex].value = item[0];
              
                }else{
                    let filterReq = { filter: filterLabel, type: 'Score', value: item, count: null };
                    this.selectedCohort.filterArray.push(filterReq);
                }
                events.fire('filter_data', [this.selectedCohort,  this.selectedCohort.filterArray, filterLabel]);
            }
         });
        
          events.on('change_plot_data', (evt, item)=> {
            this.selectedCohort.chartData = this.selectedCohort[item];
            this.selectedCohort.dataType = item;
            events.fire('filter_data', [this.selectedCohort,  this.selectedCohort.filterArray, null]);
            //maybe add layerbool for os?
            console.log("is this firing?");
        });

          events.on('compare_button_down', ()=> {
    
                if(!this.comparisonBool){
                    this.comparisonBool = true;
                    events.fire('enter_comparison_view');
                }else{
                    this.comparisonBool = false;
                    events.fire('exit_comparison_view');
                }
            });
    
            events.on('demo_filter_change', (evt, item)=> {
          
                let filterArray = this.selectedCohort.filterArray;
                if(filterArray[0].length > 1){
                    let temp = [];
                    filterArray.forEach(fil => {
                        if(fil.length > 1){
                            fil.forEach(f => { temp.push(f); });
                        }else{ temp.push(fil); }
                    });
                    filterArray = temp;
                }
                if(item.choice != null){
                    let test = filterArray.map(d=> d.filter);
                    let testIndex = test.indexOf(item.parent);
                    if(+testIndex > -1){
                        this.selectedCohort.filterArray = filterArray;
                        this.selectedCohort.filterArray[testIndex].value = item.choice;
                    }else{
                        let filterReq = { filter: item.parent, type: 'Demographic', value: item.choice, count: null };
                        this.selectedCohort.filterArray.push(filterReq);
                    }
                    events.fire('filter_data', [this.selectedCohort,  this.selectedCohort.filterArray, item.parent]);
                }
            });

        events.on('event_selected', (evt, item)=> {
            let codes = item;
            events.fire('update_cohort_start', [codes, this.selectedCohort]);
        });

        events.on('layer_button_down', (evt, item)=> {
           
            if(!this.layerBool){
                this.layerBool = true;
                events.fire('enter_layer_view');
               
            }else{
                this.layerBool = false;
                events.fire('exit_layer_view');
            }
        });

        events.on('separated_by_quant', (evt, item)=> {
           // this.seperatedCohortArray = item;
            if(this.branchSelected == null){
                this.cohortTree[this.cohortIndex].promisSep = item[0];
                this.cohortTree[this.cohortIndex].separated = true;
                this.selectedCohort = this.cohortTree[this.cohortIndex];
            }else{
                this.cohortTree[this.branchSelected[0]].branches[this.branchSelected[1]].promisSep = item[0];
                this.cohortTree[this.branchSelected[0]].branches[this.branchSelected[1]].separated = true;
                this.selectedCohort = this.cohortTree[this.branchSelected[0]].branches[this.branchSelected[1]];
            }
            console.log('sep by quant');
           events.fire('update_chart', this.selectedCohort);
          
          });

   //     events.on('frequency', ()=> { events.fire('frequency_test', this.selectedCohort)});

        events.on('new_cohort', (evt, item)=> {

            let promis = item[0];
            let cpt = item[1];
            let oswestry = item[2];
        
            let filterReq = { filter: 'All Patients', type: 'Start', value: null, count: item[1].length };

            let newParent = new Cohort();

            newParent.label = 'Cohort-' + String((this.cohortTree.length + 1));
            newParent.eventIndex = 0;
            newParent.flatIndex = this.counter;
            newParent.cpt = item[1];
            newParent.promis = promis;
            newParent.og = {promis: promis, oswestry: oswestry};
            newParent.dataType = 'promis';
            newParent.oswestry = oswestry;
            newParent.chartData = promis;
            newParent.cohortIndex = this.cohortTree.length;
            this.cohortIndex = this.cohortTree.length;

            newParent.filterArray.push(filterReq);
            this.cohortTree.push(newParent);
            this.selectedCohort = this.cohortTree[this.cohortIndex];
     
            this.branchSelected = null;
            
            this.counter++;
            this.selectedCohort = newParent;
            console.log('new cohort');
            //events.fire('update_chart', this.selectedCohort);
           // events.fire('test', [this.cohortTree, [this.cohortIndex]]);
            this.flatten(this.cohortTree).then(flatData=> {//
                events.fire('update_chart', this.selectedCohort);
                events.fire('test', [flatData, [this.cohortIndex]]);
            });
          
        });

        events.on('data_filtered', (evt, item)=> {
      
            let filters = item[0];
          //  let promis = item[1];
            let chartData = item[1];
            let cpt = item[2];
            let tag = item[3];

            console.log(item);
            console.log(this.selectedCohort);

            let test = this.selectedCohort.filterArray.map(d=> d.filter);
       
            let testIndex;
            if(tag == null){
                testIndex = filters.length - 1;
            }else{
                testIndex = test.indexOf(tag);
            } 
     
            if(testIndex > -1){
                while(testIndex < this.selectedCohort.filterArray.length){
                    this.selectedCohort.filterArray[testIndex].count = item[1].length;
                    testIndex++;
                }
            }else{
            console.log('not found!');
            }

            if(this.branchSelected == null){
           
               this.selectedCohort.chartData = chartData;
               this.selectedCohort.cpt = cpt;

            }else{
            
                this.selectedCohort.chartData = chartData;
                this.selectedCohort.cpt = cpt;
            }
            console.log('data filtered');
            console.log('selected index ', this.selectedCohort.cohortIndex);
            this.flatten(this.cohortTree).then(flatData=> {//
                events.fire('update_chart', this.selectedCohort);
                events.fire('test', [flatData, [this.selectedCohort.cohortIndex]]);
            });
          });

        events.on('show_distributions', ()=> {
              events.fire('cohort_stat_array', this.cohortTree);
          });

        events.on('remove_filter', (evt, item)=>{
            let filterArray = this.selectedCohort.filterArray;
     
            if(filterArray[0].length > 1){
                let temp = [];
                filterArray.forEach(fil => {
                    if(fil.length > 1){
                        fil.forEach(f => { temp.push(f); });
                    }else{ temp.push(fil); }
                });
                filterArray = temp;
            }

            let newFilters = filterArray.filter(f=> f.filter != item.filter);

            this.selectedCohort.filterArray = newFilters;
            events.fire('filter_data', [this.selectedCohort,  this.selectedCohort.filterArray, null]);
        });

        events.on('filter_aggregate', (evt, item)=> {
            events.fire('filter_cohort_agg', [this.selectedCohort, item]);
          });

        events.on('separate_aggregate', (evt, item)=> {
    
            if(this.selectedCohort.separated){
                this.selectedCohort.separated = false;
                document.getElementById('quartile-btn').classList.remove('btn-warning');
                document.getElementById('checkDiv').classList.add('hidden');
                events.fire('update_chart', this.selectedCohort);

            }else{
                this.selectedCohort.separated = true;
                document.getElementById('quartile-btn').classList.add('btn-warning');
                document.getElementById('checkDiv').classList.remove('hidden');
                events.fire('separate_cohort_agg', [this.selectedCohort, item]);
            }
            });

        events.on('filtered_by_quant', (evt, item)=> {
            if(this.branchSelected == null){
                this.cohortTree[this.cohortIndex].quantile = item;
                this.cohortTree[this.cohortIndex].chartData = item;
                this.selectedCohort = this.cohortTree[this.cohortIndex];
            }else{
                this.cohortTree[this.branchSelected[0]].branches[this.branchSelected[1]].quantile = item;
                this.cohortTree[this.branchSelected[0]].branches[this.branchSelected[1]].chartData = item;
                this.selectedCohort = this.cohortTree[this.branchSelected[0]].branches[this.branchSelected[1]];
            }
            events.fire('update_chart', this.selectedCohort);
          });

        events.on('cohort_interpolated', (evt, item)=> {
    
            if(this.branchSelected == null){
            
                this.cohortTree[this.cohortIndex].chartData = item;
                this.selectedCohort = this.cohortTree[this.cohortIndex];
            }else{
        
                this.cohortTree[this.cohortIndex].branches[this.branchSelected[1]].chartData = item;
                this.selectedCohort = this.cohortTree[this.cohortIndex].branches[this.branchSelected[1]];
            }
            console.log('cohort interpolated');
                events.fire('update_chart', this.selectedCohort);
          });

        events.on('min_day_calculated', (evt, item)=> {

            let chartData = item[0];
            let cpt = item[1];
            let codes = item[2];
            let index;

            if(this.branchSelected == null){
               
                this.cohortTree[this.cohortIndex].chartData = chartData;
                this.cohortTree[this.cohortIndex].cpt = cpt;
                this.cohortTree[this.cohortIndex].startEvent = codes;
                this.selectedCohort = this.cohortTree[this.cohortIndex];
                index= this.cohortIndex;
            }else{
                this.cohortTree[this.branchSelected[0]].branches[this.branchSelected[1]].chartData = chartData;
                this.cohortTree[this.branchSelected[0]].branches[this.branchSelected[1]].cpt = cpt;
                this.cohortTree[this.branchSelected[0]].branches[this.branchSelected[1]].startEvent = codes;
                this.selectedCohort = this.cohortTree[this.branchSelected[0]].branches[this.branchSelected[1]];
                index = this.branchSelected;
            }
            this.flatten(this.cohortTree).then(flatData=> {
                events.fire('update_chart', this.selectedCohort);
                events.fire('test', [flatData, index]);
            });

        });
        events.on('selected_line_array', (evt, item)=> {
            events.fire('selected_line_with_cpt', [item, this.selectedCohort.cpt]);
        });
        events.on('update_promis', (evt, item)=> {
  
           // let promis = item;
            let chartData = item;
            if(this.branchSelected == null){
               
               this.cohortTree[this.cohortIndex].chartData = chartData;
                this.selectedCohort = this.cohortTree[this.cohortIndex];
            }else{
            
                this.cohortTree[this.branchSelected[0]].branches[this.branchSelected[1]].chartData = chartData;
                this.selectedCohort = this.cohortTree[this.branchSelected[0]].branches[this.branchSelected[1]];
            }
            events.fire('update_chart', this.selectedCohort);
        });
        events.on('cpt_updated', (evt, item)=> {
            /*
             if(this.branchSelected == null){
                this.cohortTree[this.cohortIndex].cpt = item;
                this.selectedCohort = this.cohortTree[this.cohortIndex];
            }else{
                this.cohortTree[this.cohortIndex].branches[this.branchSelected[1]].cpt = item;
                this.selectedCohort = this.cohortTree[this.branchSelected[0]].branches[this.branchSelected[1]];
            }
            */
           console.log('cpt updated');
            this.selectedCohort.cpt = item;
            this.flatten(this.cohortTree).then(cohort=> {
                events.fire('update_chart', this.selectedCohort);
            });
          });

    }

    //adds a cohort filter to the cohort filter array for the cohorts
    //this is going to set the index because it fires first 
    private addCohortFilter (filter) {
        this.cohortTree[this.cohortIndex].filterArray.push(filter);
        events.fire('cohort_added', this.cohortTree);
    }

    private removeCohortFilterArray () {
        this.cohortTree = [];
        this.cohortIndex = 0;
    }

    async removeCohort(cohort){

        if(cohort.cohortIndex.length > 1){
            let pIndex = cohort.cohortIndex[0];
            let bIndex = cohort.cohortIndex[1];
            let test = this.cohortTree[pIndex].branches.filter(d=> d.label != cohort.label);
            this.cohortTree[pIndex].branches = test;
            this.selectedCohort = this.cohortTree[0];
            this.cohortIndex = 0;
            this.cohortTree[pIndex] = await this.removeFilter('Branch', this.cohortTree[pIndex]);
            
            this.flatten(this.cohortTree).then(flatData=> {
                events.fire('update_chart', this.selectedCohort);
                events.fire('test', [flatData, 0]);
            })
      
        }else{
            let test = this.cohortTree.filter(d=> d.label != cohort.label);
            test.forEach((cohort, i) => {
                cohort.label = 'Cohort-'+ (i+1);
                cohort.cohortIndex = i;
                if(cohort.branches.length > 0){
                    cohort.branches.forEach((branch, b) => {
                        branch.cohortIndex = [i, b];
                        branch.label = 'C-' + (i + 1) + ' Branch-' + (b + 1);
                    });
                }
            });

            this.cohortTree = test;
            if(this.cohortTree.length > 0){
                this.selectedCohort = this.cohortTree[0];
                this.cohortIndex = 0;
                this.flatten(this.cohortTree).then(flatData=> {
                    events.fire('update_chart', this.selectedCohort);
                    events.fire('test', [flatData, 0]);
                })
            }else{
                this.cohortIndex = 0;
                events.fire('create_button_down');
            }
        }
    }
/*
Removes a filer from a cohort object.  

*/
    async removeFilter(removedFilter, cohort){
       let remove = removedFilter? removedFilter.filter : removedFilter;

        
        let filterArray = cohort.filterArray;
     
        if(filterArray[0].length > 1){
            let temp = [];
            filterArray.forEach(fil => {
                if(fil.length > 1){
                    fil.forEach(f => { temp.push(f); });
                }else{ temp.push(fil); }
            });
            filterArray = temp;
        }

        let newFilters = filterArray.filter(f=> f.filter != remove);

        cohort.filterArray = newFilters;
      
       return cohort;
    }

    selectCohort(d) {
        console.log('select cohort firing');
        this.selectedCohort = d;
        this.flatten(this.cohortTree).then(flatData=>{
            events.fire('update_chart', this.selectedCohort);
            events.fire('test', [flatData, this.selectedCohort.cohortIndex]);
        });

        if(d.parentIndex === null){
            this.selectedCohort = d;
            this.branchSelected = null;
        }else{
            this.branchSelected = d;
            events.fire('branch_selected', d.cohortIndex);
        }
    }

    async flatten(cohortData){
         
        let flat = [];
        let counter = 0;

        cohortData.forEach(group => {
            group.flatIndex = counter;
            counter = counter + 1;
            flat.push(group);
            if(group.branches.length > 0){
                group.branches.forEach(branch => {
                    branch.flatIndex = counter;
                    counter = counter + 1;
                    flat.push(branch);
                });
            }
        });
        
        return flat;
    }

    async branchCohort(){
        let branch;
        if(this.selectedCohort.branches.length == 0){
            branch = [];
        }else{ 
            branch = this.selectedCohort.branches;
        }
        let parentIndex = this.selectedCohort.cohortIndex;
        if(parentIndex.length > 1){
            console.log('parent is branch');
            console.log([parentIndex].push(0));
        }
        let og = this.selectedCohort.og;
        let promis = this.selectedCohort.promis;
        let cpt = this.selectedCohort.cpt;
        let oswestry = this.selectedCohort.oswestry;
        let filterArray = this.selectedCohort.filterArray;
        let chartData = this.selectedCohort.chartData;
        let dataType = this.selectedCohort.dataType;
        let bcpt = JSON.parse(JSON.stringify(cpt));
        let bos = JSON.parse(JSON.stringify(oswestry));
        let bchart = JSON.parse(JSON.stringify(chartData));
        let bfilter = Object.assign([], this.cohortTree[this.cohortIndex].filterArray);
        let b = JSON.parse(JSON.stringify(promis));
        let bog = JSON.parse(JSON.stringify(og));
  
        branch.push(b);
      
        let newSpot = branch.length - 1;
        let indexBranch =  this.cohortTree[this.cohortIndex].filterArray.length;
        let filterReq = {type: 'Branch', value: [newSpot, indexBranch], count: this.cohortTree[this.cohortIndex].length };
        this.cohortTree[this.cohortIndex].filterArray.push(filterReq);
        let branchFirst = [{parentEvents: bfilter, parentLink: [this.cohortIndex, b.length - 2]}];

        let treeBranch = new Cohort();

        treeBranch.label = "C-"+ String(this.cohortIndex + 1) + " Branch-" + String((this.cohortTree[this.cohortIndex].branches.length + 1));
        treeBranch.eventIndex = indexBranch;
        treeBranch.parentIndex = this.cohortIndex;
        treeBranch.flatIndex = this.counter;
        treeBranch.filterArray = bfilter;
        treeBranch.promis = b;
        treeBranch.og = bog;
        treeBranch.cpt = bcpt;
        treeBranch.oswestry = bos;
        treeBranch.chartData = bchart;
        treeBranch.cohortIndex = [this.cohortIndex, newSpot];
        treeBranch.dataType = dataType;
        this.cohortTree[this.cohortIndex].branches.push(treeBranch);
        this.counter++;
        this.selectCohort(treeBranch);
    }


  }

  export function create() {
    return new CohortManager();
}
