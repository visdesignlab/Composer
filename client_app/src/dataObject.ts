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


export class dataObject {
    //tables for all patient data
    demoTable : ITable;
    orderTable : ITable;
    proTable : ITable;
    cptTable : ITable;
    icdTable : ITable

    //assigned target patient info
    targetPatId;//string id for target patient
    targetProInfo;//PROMIS score filtered from proTable
  //  targetProObjects;//PROMIS Scores as objects for target patient
    targetOrderInfo;
    targetOrderObjects;

    //defined cohort info
    cohortIdArray;
    cohortProInfo; //used in order squares
    cohortOrderInfo; //defined cohort 

    cohortProObjects;//Promis scores as objects for cohort
    patOrderObjects;//orders as objects for all patient data
    populationDemographics;//demo for whole population
    filteredCohortDemo;//demographic info as objects for defined cohort
    cohortCptObjects;//CPT as objects for defined cohort
    cohortIcdObjects;//ICD objects for cohort

    selectedPatIds;//array of ids for defined patients 

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
       // this.loadData('Orders');
        this.loadData('CPT_codes');
        this.loadData('ICD_codes');

        this.attachListener();
    }

    private attachListener(){

        let startDateSelection = d3.select('#start_date').select('text');

        events.on('start_date_updated', (evt, item)=> {
         
            this.startDate = item;
            startDateSelection.text(this.startDate);
        });

        /* 
        // THESE GET THE OBJECTS FROM GIVEN TABLE 
        */

        events.on('Demo_Revise', (evt, item) => {
            this.demoTable = item;
            console.log(item);
            this.mapDemoData().then(value => {
                events.fire('population demo loaded', value);
            });
           // this.getDataObjects('demo_object', this.demoTable);
        });

        events.on('PROMIS_Scores', (evt, item) => {//picked up in similarity score diagram
            this.proTable = item;
            //console.log('pro table loaded');
            this.getDataObjects('pro_object', this.proTable);
        });
                 
        events.on('Orders', (evt, item)=> {
            console.log('order table loaded');
            //this.orderTable = item;
           // this.getDataObjects('order_object', this.orderTable);
        });

        events.on('CPT_codes', (evt, item)=> {
            this.cptTable = item;
            console.log('cpt table loaded');
            //this.getDataObjects('cpt_object', this.cptTable);
        });

        events.on('ICD_codes', (evt, item)=> {
            this.icdTable = item;
            //console.log('icd table loaded');
           // this.getDataObjects('icd_object', this.cptTable);
            
        });

        /* 
        // THESE SET VARIABLES TO OBJECTS AND SEND OBJECTS TO VIEWS
        */
        //THESE ARE TAKING AN ETERNITY. NEED TO USE RANGES TO FILTER TABLES
        events.on('demo_object', (evt, item)=> {
           // this.populationDemographics = item;
            //console.log('demo objects loaded');
        });

        events.on('order_object', (evt, item)=> {
            //this.patOrderObjects = item;
        });

        events.on('pro_object', (evt, item)=> {//picked up by similarity diagram

            this.cohortProObjects = item;
            events.fire('cpt_loaded', item);
            //console.log('promis objects loaded');
        });

        events.on('cpt_object', (evt, item)=> {

            this.cohortCptObjects = item;
           // console.log('cpt objects loaded');
            events.fire('update_target');
           // this.getOrders(this.patCptObjects);
        });

        events.on('icd_object', (evt, item)=> {

            this.cohortIcdObjects = item;
       
        });

        /* 
        // WHEN THE DATA CHANGES REASSIGN TARGET AND COHORT
        */
         events.on('update_target', () => { //this is picked up from target patient search in query box

            const value = (<HTMLInputElement>document.getElementById('text_pat_id')).value;
            this.updateTarget(value, this.cohortCptObjects);
       
         });

          // item: [d, parentValue]
          events.on('filter_data', (evt, item) => { // called in sidebar

            this.filterRequirements.demo = item;
            //console.log(this.filterRequirements);
            this.updateDemo(item, this.populationDemographics);

          });

          events.on('selected_pat_array', (evt, item)=> {
     
            this.cohortIdArray = item;
            this.getCPT(this.cohortIdArray, this.cohortCptObjects);
        });

        events.on('checkbox_hover', (evt, item)=> {//this is called when you click the checkboxes or hover
            
            let parent = item[0];
            let choice = item[1];
         
            let subFilter = this.populationDemographics.filter(d => d[parent] == choice);

           //gos right back to sidebar for the hover count
            events.fire('filter_counted', [this.populationDemographics.length, subFilter.length, parent]);

          });

    }

    private updateFiltered (filters, population){


    }
//pulled from parallel coord
    private updateDemo(sidebarFilter, demoObjects) {//picks up the filters from sidebar and creates sidebarfiltered data
        //this works with the value returned by the mapped patient demo
          let filter = demoObjects;
    
          sidebarFilter.forEach( d=> {
           
           let parent = d.attributeName;
           let choice = d.checkedOptions;
       
          if (parent == 'DM_CODE'){
         
           filter = filter.filter(d => d[parent] == choice || d[parent] == choice + 3);
          }else{
           if (choice.length == 1){
             filter = filter.filter(d => d[parent] == choice);
          }else if(choice.length == 2){
             filter = filter.filter(d => d[parent] == choice[0] || choice[1]);
             console.log(filter);
          }else if(choice.length == 2){
            filter = filter.filter(d => d[parent] == choice[0] || choice[1] || choice[2]);
            console.log(filter);
         }else if(choice.length == 3){
            filter = filter.filter(d => d[parent] == choice[0] || choice[1] || choice[2] || choice[3]);
            console.log(filter);
          }
        }
          
         });

           this.filteredCohortDemo = filter;

           events.fire('demo_filtered', [filter, this.populationDemographics]);
            
       }
    
    //uses Phovea to access PROMIS data and draw table for cohort
    private async getPromisScores(selectedPatIds, proObjects) {

        let filteredPatScore = {};
     
        proObjects.forEach(item => {
        if (selectedPatIds.indexOf(item.PAT_ID) !== -1) {
        if (filteredPatScore[item.PAT_ID] === undefined) {
         filteredPatScore[item.PAT_ID] = [];
        }
       filteredPatScore[item.PAT_ID].push(item);
        }
        });
       let mapped = entries(filteredPatScore);
       this.cohortProInfo = mapped;
       events.fire('gotPromisScore', mapped);
 
     };

     //uses Phovea to access PRO data and draw table
   private async getCPT(selectedPatIds, cptObject) {

    let filteredPatOrders = {};
   // const patOrders = await this.orderTable.objects();
   
     cptObject.forEach(item => {
         if (selectedPatIds.indexOf(item.PAT_ID) !== -1) {
          if (filteredPatOrders[item.PAT_ID] === undefined) {
     filteredPatOrders[item.PAT_ID] = [];
   }
     filteredPatOrders[item.PAT_ID].push(item);
    }
     });
     let mapped = entries(filteredPatOrders);

    events.fire('filtered_CPT', mapped);

    return mapped;

 };

       //gets CPT objects for target patient and maps them to draw
    private async updateTarget(patID, cptObject) {

        let filteredPatScore = [];//gets PROMIS Scores for target patient
  
        this.cohortProObjects.forEach(item => {
            if (patID.indexOf(item.PAT_ID) !== -1) {
            filteredPatScore.push(item);
        }
        }); 

        this.getCPT(patID, cptObject).then(value => {//gets CPT for target patient

            events.fire('target_updated', [value, filteredPatScore]);

          });
          
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
/*
     private async updateTargetPatient(patID) {

         //get target patient PROMIS Scores
         

          let filteredPatScore = [];
          
           this.cohortProObjects.forEach(item => {
           if (patID.indexOf(item.PAT_ID) !== -1) {
           filteredPatScore.push(item);
           }
           }); 

           //get target patient orders

           let filteredPatOrders = [];
           // console.log(this.patProObjects + 'found in promis score');
            this.cohortCptObjects.forEach(item => {
            if (patID.indexOf(item.PAT_ID) !== -1) {
           
            filteredPatOrders.push(item);
         }
       }); 
           events.fire('target_updated', [filteredPatOrders, filteredPatScore]);
     };*/

      //uses Phovea to access PROMIS data and draw table for cohort
      /*
     private async getTargetPromisScore(targetPatId) {
 
        let filteredPatScore = [];
       // console.log(this.patProObjects + 'found in promis score');
        this.cohortProObjects.forEach(item => {
        if (targetPatId.indexOf(item.PAT_ID) !== -1) {
        filteredPatScore.push(item);
        }
        }); 
       
       //this.targetProInfo = filteredPatScore;

       console.log(this.targetProInfo);//these are the same what the fuck is wrong
       console.log(filteredPatScore);

       events.fire('gotTargetPromisScore', filteredPatScore);
 
     };*/

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
    private async getOrders(selectedPatIds) {
  
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
        events.fire('orders_updated',[this.targetProInfo, this.cohortOrderInfo, this.cohortProInfo]);
 
     };
/*
       //uses Phovea to access PRO data and draw table for target patient
    private async getTargetOrders(targetPatId) {
   

        let filteredPatOrders = [];
        // console.log(this.patProObjects + 'found in promis score');
         this.cohortProObjects.forEach(item => {
         if (targetPatId.indexOf(item.PAT_ID) !== -1) {
        
         filteredPatOrders.push(item);
      }
    }); 

 //events.fire('orders_updated',[this.patOrderObjects, this.targetPatientProInfo, this.similarPatientProInfo]);
        events.fire('target_orders_updated',[this.targetProInfo, filteredPatOrders, this.cohortProInfo]);
 
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
    return new dataObject();
}

   

