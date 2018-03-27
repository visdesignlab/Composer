/**
 * Created by Jen Rogers on 12/14/17.
 * data for the views.
 */
import * as ajax from 'phovea_core/src/ajax';
import {ITable, asTable} from 'phovea_core/src/table';
import {IAnyVector} from 'phovea_core/src/vector';
import {list as listData, getFirstByName, get as getById} from 'phovea_core/src/data';
import {tsv} from 'd3-request';
import {ICategoricalVector, INumericalVector} from 'phovea_core/src/vector/IVector';
import {VALUE_TYPE_CATEGORICAL, VALUE_TYPE_INT} from 'phovea_core/src/datatype';
import {range, list, join, Range, Range1D, all} from 'phovea_core/src/range';
import {asVector} from 'phovea_core/src/vector/Vector';
import {argFilter} from 'phovea_core/src/';
import * as events from 'phovea_core/src/event';
import {nest, values, keys, map, entries} from 'd3-collection';
import * as d3 from 'd3';
import { filteredOrders } from 'client_app/src/similarityScoreDiagram';
import * as dataCalc from './dataCalculations';

export class DataManager {

    private findMinDate = dataCalc.findMinDate;
    private findMaxDate = dataCalc.findMaxDate;
    private findMinDateCPT = dataCalc.findMinDateCPT;
    private findMaxDateCPT = dataCalc.findMaxDateCPT;
    private parseTime = dataCalc.parseTime;

    //tables for all patient data
    demoTable : ITable;
    orderTable : ITable;
    proTable : ITable;
    proTableSample : ITable;
    cptTable : ITable;
    icdTable : ITable;

    //defined cohort info
    cohortIdArray;
    cohortOrderInfo; //defined cohort 

    totalProObjects;//Promis scores as objects for cohort
    totalDemoObjects;//demo for whole population
    //filteredCohortDemo;//demographic info as objects for defined cohort
    totalCptObjects;//CPT as objects for defined cohort
    cohortIcdObjects;//ICD objects for cohort
    filteredPatPromis;
    patCPT;

    startDate;

    //attempting to set up structure to hold filters
    filterRequirements = {
        'demo': null, //this is sent from sidebar
        'icd': null,
        'cpt': null
       };

    constructor() {
        /* 
        // GET THE GIVEN TABLE BY TABLE ID AS ARG
        */

        this.loadData('Demo_Revise');
        this.loadData('PROMIS_Scores');
        this.loadData('ICD_codes');
        this.loadData('CPT_codes');

        this.attachListener();

    }

    private attachListener(){

        let startDateSelection = d3.select('#start_date').select('text');

        events.on('filter_cohort_by_event', (evt, item)=> {

            let idArray = this.getCohortIdArrayAfterMap(item[0], 'cpt');
            let filteredPromis = this.filterMappedPromisByArray(idArray, this.filteredPatPromis);
            events.fire('selected_promis_filtered', filteredPromis);
        });

        events.on('start_date_updated', (evt, item)=> {
         
            this.startDate = item;
            startDateSelection.text(this.startDate);
        });

        /* 
        // THESE GET THE OBJECTS FROM GIVEN TABLE 
        */

        events.on('Demo_Revise', (evt, item) => {
            this.demoTable = item;
            
            this.mapDemoData().then(value => {
               events.fire('population demo loaded', value);
            });
            this.getDataObjects('demo_object', this.demoTable);
        });

        events.on('PROMIS_Scores', (evt, item) => {//picked up in similarity score diagram
            
            this.proTable = item;
            this.getDataObjects('pro_object', this.proTable);
        });

        events.on('CPT_codes', (evt, item)=> {
            this.cptTable = item;
            events.fire('load_cpt');
        });

        events.on('load_cpt', ()=> {
            //this is called from cpt button
            //loads the cpt objects form the table for all patients
            this.getDataObjects('cpt_object', this.cptTable);
        });

        events.on('ICD_codes', (evt, item)=> {

            this.icdTable = item;
        });

        events.on('filter_cohort_agg', (evt, item)=> {
            this.getQuant_test(item[0], item[1]);
        });

        /* 
        // THESE SET VARIABLES TO OBJECTS AND SEND OBJECTS TO VIEWS
        */
        //THESE ARE TAKING AN ETERNITY. NEED TO USE RANGES TO FILTER TABLES

        events.on('pro_object', (evt, item)=> {//picked up by similarity diagram
            this.totalProObjects = item;
            this.mapPromisScores(null, item);
        });

        events.on('got_promis_scores', (evt, item)=> {
           // this.getCPT(null, this.totalCptObjects, this.filteredPatPromis);
        });

        events.on('cpt_object', (evt, item)=> {
            
            this.totalCptObjects = item;
            //this.getCPT(this.cohortIdArray, this.totalCptObjects, this.filteredPatPromis);
        });

        events.on('icd_object', (evt, item)=> {
            this.cohortIcdObjects = item;
        });

        //Cohort Filtering
          // item: [d, parentValue]
        events.on('demo_filter_button_pushed', (evt, item) => { // called in sidebar
           // this.filterRequirements.demo = item;
            this.demoFilter(item, this.totalDemoObjects);
          });

        events.on('new_cohort_added', (evt, item)=> {
            this.filteredPatPromis = item;
            this.getCPT(this.cohortIdArray, this.totalCptObjects);
        });

        events.on('selected_cohort_change', (evt, item) => {  // called in parrallel on brush and 
            this.filteredPatPromis = item;
                });

        events.on('filtered_CPT', (evt, item) => {
            this.mapCPT(this.filteredPatPromis, item);
          });

        events.on('selected_pat_array', (evt, item)=> {
            this.cohortIdArray = item;
            this.getCPT(this.cohortIdArray, this.totalCptObjects);
        });

        events.on('filtering_Promis_count', (evt, item)=> {
            this.filterByPromisCount(item[0], item[1]);
        });

        events.on('filter_by_cpt', (evt, item)=> {
           // console.log(this.filteredPatPromis);
           console.log(this.patCPT);
            this.searchByEvent(this.patCPT, item);
        });

        events.on('checkbox_hover', (evt, item)=> {//this is called when you click the checkboxes or hover
            let parent = item[0];
            let choice = item[1];
            let subFilter = this.totalDemoObjects.filter(d => d[parent] == choice);

           //gos right back to sidebar for the hover count
            events.fire('filter_counted', [this.totalDemoObjects.length, subFilter.length, parent]);

          });
    }

//pulled from parallel coord
    private demoFilter(sidebarFilter, demoObjects) {

         this.cohortIdArray = [];

          let filter = demoObjects;
          sidebarFilter.forEach( (d)=> {
           let parent = d.attributeName;
           let choice = d.checkedOptions;
           if(parent != 'BMI' || 'CCI' || 'AGE') {

                if (parent == 'DM_CODE') {
                   
                        filter = filter.filter(d => d[parent] == choice || d[parent] == choice + 3);
                }else{ 
                       
                        if (choice.length === 1){
                            filter = filter.filter(d => d[parent] == choice);
                        }else if(choice.length === 2){
                            filter = filter.filter(d => d[parent] == choice[0] || choice[1]);
                       
                        }else if(choice.length === 2){
                            filter = filter.filter(d => d[parent] == choice[0] || choice[1] || choice[2]);
                           
                        }else if(choice.length === 3){
                            filter = filter.filter(d => d[parent] == choice[0] || choice[1] || choice[2] || choice[3]);

                        }
                }
           }
           if(parent == 'BMI' || parent == 'CCI' || parent == 'AGE') {

                filter = filter.filter(d => +d[parent] > choice[0] && +d[parent] < choice[1]);
           }

         });
            filter.forEach((element) => {
                this.cohortIdArray.push(element.ID);
            });

           //this is a test, manual array for filter

           events.fire('cohort_filtered_demo', [filter.length, sidebarFilter]);//should I maybe use the array instead?
           this.mapPromisScores(this.cohortIdArray, this.totalProObjects);
       }

    private filterByPromisCount(cohort, count) {
    
        let filter = [];

        cohort.forEach(patient => {
            if(patient.value.length > count){
               // console.log(patient.value.length)
                filter.push(patient);
            }

       });

       events.fire('filtered_by_count', [filter, count]);
    }

    private getQuant_test(cohort, quant) {

       // console.log(cohort);
      //  console.log(quant);

        let oneval = [];
        let outofrange = [];
        let topStart = [];
        let middleStart = [];
        let bottomStart = [];
        let barray = [];
        let selected;

        cohort.forEach(patient => {
            if(patient.value.length == 1){
                if(patient.value[0].diff > Math.abs(90)){
                    outofrange.push(patient);
                }

                oneval.push(patient.key);

            }
            if(patient.b != undefined) {
                barray.push(patient.b);
                if(patient.b >= 43){topStart.push(patient)};
                if(patient.b < 43 && patient.b > 29){ middleStart.push(patient)};
                if(patient.b <= 29){bottomStart.push(patient)};
                patient.scorespan = [patient.b];

            }else{
                //console.log(patient);
            }
            
            if(quant == 'bottom'){ selected = bottomStart };
            if(quant == 'middle'){ selected = middleStart };
            if(quant == 'top'){ selected = topStart };

            
        });
        events.fire('filtered_by_quant', [selected, quant]);

    }
       public async mapDemoData() {

            let that = this;

            // I THINK THIS IS WHAT IS KILLING THE APP? MOST LIKELY THE OBJECTS LOADING
            let patID = (await this.demoTable.colData('PAT_ID')).map(d => +d);
            let GENDER = (await this.demoTable.colData('PAT_GENDER')).map(d => d);
            let MARITAL_STATUS = (await this.demoTable.colData('PAT_MARITAL_STAT')).map(d => d);
            let TOBACCO = (await this.demoTable.colData('TOBACCO_USER')).map(d => d);
            let ALCOHOL = (await this.demoTable.colData('ALCOHOL_USER')).map(d => d);
            let DRUG_USER = (await this.demoTable.colData('ILLICIT_DRUG_USER')).map(d => d);
            let RACE = (await this.demoTable.colData('PAT_RACE')).map(d => d);
            let BMI = (await this.demoTable.colData('BMI')).map(d => +d);
            let patDOB = (await this.demoTable.colData('PAT_BIRTHDATE')).map(d => new Date(String(d)));
            let CCI = (await this.demoTable.colData('CCI')).map(d => +d);
            let DM_CODE = (await this.demoTable.colData('DM_CODE')).map(d => +d);
        
            let patAge = [];
        
            patDOB.forEach((d) => { 
                let diff = Date.now() - d.getTime();
                patAge.push(diff / (1000 * 60 * 60 * 24 * 365.25));
            
            });
        
            let popdemo = patID.map((id, i) => {
                return {
                ID: id,
                GENDER: GENDER[i],
                AGE: patAge[i],
                BMI: BMI[i],
                MARITAL_STATUS: MARITAL_STATUS[i],
                TOBACCO: TOBACCO[i],
                ALCOHOL: ALCOHOL[i],
                DRUG_USER: DRUG_USER[i],
                RACE : RACE[i],
                CCI: CCI[i],
                DM_CODE: DM_CODE[i]
                };
            });

            this.totalDemoObjects = popdemo;
    
            return popdemo;
  
       }


    //uses Phovea to access PROMIS data and draw table for cohort
    private async mapPromisScores(cohortIdArray, proObjects) {

        proObjects = proObjects.filter((d) => {
            return d['FORM_ID'] === 1123
        });

        let yayornay = 'nay';

        let filteredPatOrders = {};

        if (cohortIdArray != null ) {

            yayornay = 'yay';

            proObjects.forEach((d) => {

                if (cohortIdArray.indexOf(d.PAT_ID) != -1) {
                        if (filteredPatOrders[d.PAT_ID] == undefined) {
                            filteredPatOrders[d.PAT_ID] = [];
                            }
                            filteredPatOrders[d.PAT_ID].push(d);
                            }
                });
            }

        if (cohortIdArray == null){
            proObjects.forEach((d) => {

                        if (filteredPatOrders[d.PAT_ID] == undefined) {
                                filteredPatOrders[d.PAT_ID] = [];
                                }
                                filteredPatOrders[d.PAT_ID].push(d);
                            //  }
            });

        }
        let mapped =  await entries(filteredPatOrders);
        //return filteredPatOrders;
        let patPromis = mapped.map(d=> {
            return {
                key: d.key,
                value: d.value,
                min_date: this.findMinDate(d.value),
                max_date: this.findMaxDate(d.value),
            }
        });
        if (yayornay !== 'yay'){
            events.fire('got_promis_scores', patPromis);
        };

        this.filteredPatPromis = patPromis;

        if (yayornay == 'yay'){
            events.fire('filtered_patient_promis', patPromis);}

     };

     private getAverage(selected) {

        let outofrange = [];
        let topStart = [];
        let middleStart = [];
        let bottomStart = [];
        let barray = [];

        selected.forEach(patient => {
  
            if(patient.b != undefined){
                barray.push(patient.b);
                if(patient.b >= 43){topStart.push(patient)};
                if(patient.b < 43 && patient.b > 29){ middleStart.push(patient)};
                if(patient.b <= 29){bottomStart.push(patient)};
                patient.scorespan = [patient.b];

            }else{
            
            }

        });

       console.log(topStart);
    }

     //uses Phovea to access PRO data and draw table
   private async getCPT(cohortIdArray, cptObject) {

        let filteredPatOrders = {};
        // const patOrders = await this.orderTable.objects();
        if (cohortIdArray != null) {
            cptObject.forEach((item) => {
                if (cohortIdArray.indexOf(item.PAT_ID) != -1) {
                if (filteredPatOrders[item.PAT_ID] === undefined) {
            filteredPatOrders[item.PAT_ID] = [];
        }
            filteredPatOrders[item.PAT_ID].push(item);
            }
            });
            }

        if (cohortIdArray == null) {
            cptObject.forEach((d) => {
                if (filteredPatOrders[d.PAT_ID] === undefined) {
                        filteredPatOrders[d.PAT_ID] = [];
                    }
                filteredPatOrders[d.PAT_ID].push(d);
            });
    }

        const mapped = entries(filteredPatOrders);

        events.fire('filtered_CPT', mapped);
       // this.patCPT = mapped;

 };

          /**
     *
     * @param ordersInfo
     */
    //you need the promis objects and the cpt objects
    private mapCPT(patProInfo, CPTobjects) {

        let minDate = new Date();
        let maxDate = this.parseTime(CPTobjects[0].value[0]['PROC_DTM'], null);

        for(let i= 0;  i< CPTobjects.length; i++) {

            let keycpt = CPTobjects[i].key;

            for(let j = 0; j < patProInfo.length; j++) {

              let keypromis = patProInfo[j].key;

              if(keycpt == keypromis) {
                CPTobjects[i].minPromis = patProInfo[j].min_date;
              }
            } 
          };

        CPTobjects.forEach((d) => {
                let minDatePat = this.findMinDateCPT(d.value);
                let maxDatePat = this.findMaxDateCPT(d.value);

                if(minDate.getTime() > minDatePat.getTime())minDate = minDatePat;
                if(maxDate.getTime() < maxDatePat.getTime())maxDate = maxDatePat;

                let time = this.parseTime(d['PROC_DTM'], minDate).getTime();
                d.diff = Math.ceil((time - minDate.getTime()) / (1000 * 60 * 60 * 24));
            });

        const self = this;

              // ----- add diff days to the data
        let filteredOrders = [];

        CPTobjects.forEach((g) => {

                //g.array = [];
        let minDate = g.minPromis;//changed min date for cpt to min date of promis score

        g.value.forEach((d) => {

            d.array = []; 
            d.time = d['PROC_DTM'];

            try {
                d.diff = Math.ceil((this.parseTime(d['PROC_DTM'], null).getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
                } catch (TypeError) {
                        console.log('error');
                        d.diff = -1;
                      }
                if(d['CPT_1'] !== 0){ d.array.push(d['CPT_1']);   };
                if(d['CPT_2'] !== 0){ d.array.push(d['CPT_2']);    };
                if(d['CPT_3'] !== 0){ d.array.push(d['CPT_3']);    };
                if(d['CPT_4'] !== 0){ d.array.push(d['CPT_4']);    };
                if(d['CPT_5'] !== 0){ d.array.push(d['CPT_5']);    };
                if(d['CPT_6'] !== 0){ d.array.push(d['CPT_6']);    };
                if(d['CPT_7'] !== 0){ d.array.push(d['CPT_7']);    };
                if(d['CPT_5'] !== 0){ d.array.push(d['CPT_5']);    };
                if(d['CPT_6'] !== 0){ d.array.push(d['CPT_6']);    };
                if(d['CPT_7'] !== 0){ d.array.push(d['CPT_7']);    };

                d.diff = d.diff;

                });

        let filter = g.value.map(function(blob) {
            let temp = [];
            temp.push(blob.array);
            return {
                    key: blob.PAT_ID,
                    value : temp,
                    time: blob.PROC_DTM,
                    diff : blob.diff
                };
            });

        filteredOrders.push(filter);

        });

        events.fire('cpt_mapped', filteredOrders);
        this.patCPT = filteredOrders;
    }

    private getCohortIdArrayAfterMap (selectedData, typeofData: string)   {
        let tempPatArray = [];

        if(typeofData == 'cpt') {
            selectedData.forEach((element) => {
                tempPatArray.push(element[0].key);
            });
        }else {
            selectedData.forEach((element) => {
                tempPatArray.push(element.ID);
            });
        } return tempPatArray;
    }

    private filterMappedPromisByArray (selectedIdArray, promisObjects)   {

        let res = promisObjects.filter((f) => selectedIdArray.includes(+f.key));
        return res;
    }

    public async loadData(id: string) { //loads the tables from Phovea
       let table = <ITable> await getById(id);
       events.fire(id, table);//sends the id string to the getDataObjects
    }

    public async getDataObjects(id: string, table: ITable) {
        let object = await table.objects();
        events.fire(id, object);
    }

    //YOU NEED TO INTEGRATE THIS HERE AND REMOVE FROM QUERYBOX.TS

    private searchByEvent(cohort, value) {

        let withQuery = [];
        let queryDate = [];
        /*
        if (this.currentlySelectedName != undefined ){
          this.currentlySelectedName = undefined;
        }*/
  
       // const value = (<HTMLInputElement>document.getElementById('order_search')).value;
      
        //this.targetOrder = value;

        cohort.forEach((element) => {
            console.log(element);
            let elementBool;
            element.forEach(g => {
                if (g.value[0].includes(+value)){
                    if(elementBool != g.key){
                        withQuery.push(element);
                        queryDate.push(g);
                    }elementBool = g.key;
                    }
            });
          
        });

       // this.queryDataArray = withQuery;
       // this.queryDateArray = queryDate;

        events.fire('query_order', value);
        events.fire('filter_cohort_by_event', [withQuery, value]);
    }


  }

  export function create() {
    return new DataManager();
}

   

