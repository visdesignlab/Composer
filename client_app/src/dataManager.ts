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
import * as dataCalculations from './dataCalculations';


export class dataManager {

    private findMinDate = dataCalculations.findMinDate;
    private findMaxDate = dataCalculations.findMaxDate;
    private parseTime = dataCalculations.parseTime;

    //tables for all patient data
    demoTable : ITable;
    orderTable : ITable;
    proTable : ITable;
    proTableSample : ITable;
    cptTable : ITable;
    icdTable : ITable;

    //defined cohort info
    cohortIdArray;
    cohortProInfo; //used in order squares
    cohortOrderInfo; //defined cohort 

    cohortProObjects;//Promis scores as objects for cohort
    populationDemographics;//demo for whole population
    filteredCohortDemo;//demographic info as objects for defined cohort
    cohortCptObjects;//CPT as objects for defined cohort
    cohortIcdObjects;//ICD objects for cohort
    filteredPatPromis;

    selectedPatIds;//array of ids for defined patients 

    startDate;
    cohortCounter = 0;
    cohortfilterarray = [];

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
       // this.loadData('Orders');
        this.loadData('CPT_codes');
        this.loadData('ICD_codes');

        this.attachListener();


    }

    private attachListener(){

        let startDateSelection = d3.select('#start_date').select('text');

        events.on('filtered_CPT_by_order', (evt, item)=> {
           
            this.filterbyCPT(item);

           
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
           // this.getDataObjects('demo_object', this.demoTable);
        });

        events.on('PROMIS_Scores', (evt, item) => {//picked up in similarity score diagram
            this.proTable = item;
            this.getDataObjects('pro_object', this.proTable);
        });
                 
        events.on('Orders', (evt, item)=> {
            
            //this.orderTable = item;
           // this.getDataObjects('order_object', this.orderTable);
        });

        events.on('CPT_codes', (evt, item)=> {
            this.cptTable = item;
          
            //this.getDataObjects('cpt_object', this.cptTable);
        });

        events.on('load_cpt', ()=> {
            //this is called from cpt button 
            //loads the cpt objects form the table for all patients
            this.getDataObjects('cpt_object', this.cptTable);
           
        })

        events.on('ICD_codes', (evt, item)=> {

            this.icdTable = item;
            
           // this.getDataObjects('icd_object', this.cptTable);
            
        });

        /* 
        // THESE SET VARIABLES TO OBJECTS AND SEND OBJECTS TO VIEWS
        */
        //THESE ARE TAKING AN ETERNITY. NEED TO USE RANGES TO FILTER TABLES
        events.on('demo_object', (evt, item)=> {
           // this.populationDemographics = item;
           
        });

        events.on('pro_object', (evt, item)=> {//picked up by similarity diagram
            console.log(item);
            this.cohortProObjects = item;
            this.getPromisScores(null, item);
        });

        events.on('gotPromisScores', (evt, item)=> {
           // this.getCPT(null, this.cohortCptObjects, this.filteredPatPromis);
        });

        events.on('cpt_object', (evt, item)=> {

            this.cohortCptObjects = item;
            this.getCPT(this.selectedPatIds, this.cohortCptObjects, this.filteredPatPromis);
            console.log('cptfinding');
         
        });

        events.on('icd_object', (evt, item)=> {

            this.cohortIcdObjects = item;
       
        });

          // item: [d, parentValue]
          events.on('filter_data', (evt, item) => { // called in sidebar

            this.filterRequirements.demo = item;
         
            this.demoFilter(item, this.populationDemographics);
            this.addCohortFilter();
          });

        events.on('selected_pat_array', (evt, item)=> {
     
            this.cohortIdArray = item;
            this.getCPT(this.cohortIdArray, this.cohortCptObjects, this.filteredPatPromis);
        });

        events.on('checkbox_hover', (evt, item)=> {//this is called when you click the checkboxes or hover
            
            let parent = item[0];
            let choice = item[1];
         
            let subFilter = this.populationDemographics.filter(d => d[parent] == choice);

           //gos right back to sidebar for the hover count
            events.fire('filter_counted', [this.populationDemographics.length, subFilter.length, parent]);

          });

        events.on('clear_cohorts', () => {
              this.removeCohortFilterArray();
              
          });

    }

    private addCohortFilter () {
        console.log(this.cohortCounter);
        
        let filter = this.filterRequirements;
        //console.log(filter);

        this.cohortfilterarray.push(filter);
        //when a filter is passed to to a 
        console.log(this.cohortfilterarray);
        this.cohortCounter =+ 1;

        events.fire('cohort_added', this.cohortfilterarray);


    }

    private removeCohortFilterArray () {

        this.cohortfilterarray = [];
        console.log('cohort array empty  '+this.cohortfilterarray);

    }

    private filterbyCPT (selectedCPT){

        let tempPatArray = [];

     
        selectedCPT.forEach(element => {
            tempPatArray.push(element[0].key);
        });
        
        this.selectedPatIds = tempPatArray;
        this.getPromisScores(this.selectedPatIds, this.cohortProObjects);

    }

//pulled from paralle coord
    private demoFilter(sidebarFilter, demoObjects) {
        //picks up the filters from sidebar and creates sidebarfiltered data
        //this works with the value returned by the mapped patient demo
        //sets patId array to filter

          this.selectedPatIds = [];

          let filter = demoObjects;
    
          sidebarFilter.forEach( d=> {
           
           let parent = d.attributeName;
           let choice = d.checkedOptions;
       
          if (parent == 'DM_CODE'){
         
           filter = filter.filter(d => d[parent] == choice || d[parent] == choice + 3);
          }else{
           if (choice.length === 1){
             filter = filter.filter(d => d[parent] == choice);
          }else if(choice.length === 2){
             filter = filter.filter(d => d[parent] == choice[0] || choice[1]);
             console.log(filter);
          }else if(choice.length === 2){
            filter = filter.filter(d => d[parent] == choice[0] || choice[1] || choice[2]);
            console.log(filter);
         }else if(choice.length === 3){
            filter = filter.filter(d => d[parent] == choice[0] || choice[1] || choice[2] || choice[3]);
            console.log(filter);
          }
        }
         });
            filter.forEach((element) => {
                this.selectedPatIds.push(element.ID);
            });

           this.filteredCohortDemo = filter;
           this.getPromisScores(this.selectedPatIds, this.cohortProObjects);
       }

    
    //uses Phovea to access PROMIS data and draw table for cohort
    private async getPromisScores(selectedPatIds, proObjects) {
        console.log(selectedPatIds);
      // let mapped = entries(filteredPatScore);
      // this.cohortProInfo = mapped;
      // events.fire('pro_object_filtered', filteredPatScore);
    let PROMIS = proObjects.filter((d) => {
        return d['FORM_ID'] === 1123
    });
   
    let yayornay = 'nay';

    let filteredPatOrders = {};

    if (selectedPatIds != null ) {

        yayornay = 'yay';

        PROMIS.forEach((d) => {
               
            if (selectedPatIds.indexOf(d.PAT_ID) != -1) {
                    if (filteredPatOrders[d.PAT_ID] == undefined) {
                        filteredPatOrders[d.PAT_ID] = [];
                        }
                        filteredPatOrders[d.PAT_ID].push(d);
                        }
            });
        }

    if (selectedPatIds == null){
        PROMIS.forEach((d) => {

                    if (filteredPatOrders[d.PAT_ID] == undefined) {
                            filteredPatOrders[d.PAT_ID] = [];
                            }
                            filteredPatOrders[d.PAT_ID].push(d);
                          //  }
        });

       }
       let mapped = entries(filteredPatOrders);
       //return filteredPatOrders;
       let patPromis = mapped.map(d=> {
           return {
             key: d.key,
             value: d.value,
             min_date: this.findMinDate(d.value),
             max_date: this.findMaxDate(d.value),
           }
      });

      events.fire('gotPromisScores', patPromis);
      this.filteredPatPromis = patPromis;
      console.log(this.filteredPatPromis);

      if (yayornay == 'yay')events.fire('filteredPatients', patPromis);
     };

     //uses Phovea to access PRO data and draw table
   private async getCPT(selectedPatIds, cptObject, filteredPatPromis) {

    let filteredPatOrders = {};
   // const patOrders = await this.orderTable.objects();
   if (selectedPatIds != null) {
     cptObject.forEach((item) => {
         if (selectedPatIds.indexOf(item.PAT_ID) != -1) {
          if (filteredPatOrders[item.PAT_ID] === undefined) {
     filteredPatOrders[item.PAT_ID] = [];
   }
     filteredPatOrders[item.PAT_ID].push(item);
    }
     });
    }

     if (selectedPatIds == null) {
        cptObject.forEach((d) => {
               // if (selectedPatIds.indexOf(d.PAT_ID) !== -1) {
                    if (filteredPatOrders[d.PAT_ID] === undefined) {
                            filteredPatOrders[d.PAT_ID] = [];
                            }
                            filteredPatOrders[d.PAT_ID].push(d);
                          //  }
        });
    }

     const mapped = entries(filteredPatOrders);

    events.fire('filtered_CPT', mapped);
    //return mapped;

 };

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

           this.populationDemographics = popdemo;
           return popdemo;
   
        }


    public selectedPatientId(data){//this adds all of the filtered patient ids to an array

        let ids = [];
        
                data.forEach(element => {
                   ids.push(element.ID);
               });

      
        this.selectedPatIds = ids;

        events.fire('selected_pat_array', this.selectedPatIds);

        this.getPromisScores(this.selectedPatIds, this.cohortProObjects);
       // this.getOrders(this.selectedPatIds);

     }
 
     //uses Phovea to access PRO data and draw table for similar cohort
  /*  private async getOrders(selectedPatIds) {
  
        let filteredPatOrders = {};
        //const patOrders = await this.orderTable.objects();
       
         this.patOrderObjects.forEach(item => {
             if (selectedPatIds.indexOf(item.PAT_ID) !== -1) {
              if (filteredPatOrders[item.PAT_ID] === undefined) {
         filteredPatOrders[item.PAT_ID] = [];
        }
         filteredPatOrders[item.PAT_ID].push(item);
        }
         });
        let mapped = entries(filteredPatOrders);
   
        this.cohortOrderInfo = mapped;

 //events.fire('orders_updated',[this.patOrderObjects, this.targetPatientProInfo, this.similarPatientProInfo]);
        events.fire('orders_updated',[null, this.cohortOrderInfo, this.cohortProInfo]);
 
     };*/


    public async loadData(id: string){ //loads the tables from Phovea
    
       let table = <ITable> await getById(id);
      
       events.fire(id, table);//sends the id string to the getDataObjects
   
    }

    public async getDataObjects(id: string, table: ITable){ 

        let object = await table.objects();
        events.fire(id, object);

    }


  }

  export function create() {
    return new dataManager();
}

   

