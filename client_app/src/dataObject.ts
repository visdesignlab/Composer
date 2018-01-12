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

interface Subject {

registerObserver(o : Observer);
removeObserver(o : Observer);
notifyObserver();

}

interface Observer {

update(table : any);

}

export class dataObject implements Subject {
    //tables for all patient data
    demoTable : ITable;
    orderTable : ITable;
    proTable : ITable;
    cptTable : ITable;

    //assigned target patient info
    targetPatId;//string id for target patient
    targetProInfo;//PROMIS score filtered from proTable
  //  targetProObjects;//PROMIS Scores as objects for target patient
    targetOrderInfo;
    targetOrderObjects;

    //defined cohort info
    cohortProInfo; //used in order squares
    cohortOrderInfo; //defined cohort 

    cohortProObjects;//Promis scores as objects for cohort
    patOrderObjects;//orders as objects for all patient data
    cohortDemoObjects;//demographic info as objects for defined cohort
    cohortCptObjects;//CPT as objects for defined cohort

    selectedPatIds;//array of ids for defined patients 

    startDate;

    constructor() {
       // console.log('is this thing on');

        this.loadData('Demo_Revise');
        this.loadData('PROMIS_Scores');//.then(console.log(this.proTable));
       // this.loadData('Orders');
        this.loadData('CPT_codes');

        this.attachListener();
    }

    public registerObserver(o : Observer) {};
    public removeObserver(o : Observer) {};
    public notifyObserver() {};

    private attachListener(){

        let startDateSelection = d3.select('#start_date').select('text');

        events.on('start_date_updated', (evt, item)=> {
            //console.log('updated');
            this.startDate = item;
            startDateSelection.text(this.startDate);
            //console.log(startDateSelection);
        });

        events.on('PROMIS_Scores', (evt, item) => {//picked up in similarity score diagram
            this.proTable = item;
           // console.log(item);
            this.getDataObjects('pro_object', this.proTable);
        });
                 
        events.on('Orders', (evt, item)=> {
            //this.orderTable = item;
           // this.getDataObjects('order_object', this.orderTable);
        });

        events.on('CPT_codes', (evt, item)=> {
            this.cptTable = item;
            this.getDataObjects('cpt_object', this.cptTable);
        });

        events.on('order_object', (evt, item)=> {
            //this.patOrderObjects = item;
        });

        events.on('pro_object', (evt, item)=> {//picked up by similarity diagram
            this.cohortProObjects = item;
            //console.log(item);
        });

        events.on('cpt_object', (evt, item)=> {
            this.cohortCptObjects = item;
           // this.getOrders(this.patCptObjects);
        });

        events.on('cpt_object', (evt, item)=> {
            this.cohortCptObjects = item;
           // this.getOrders(this.patCptObjects);
        });


        events.on('dataUpdated', (evt, item) => {

            this.selectedPatientId(item[0]);

         });

        events.on('update_similar', (evt, item) => { 

            this.targetProInfo = item[2]['pat_PRO'][item[0]].slice();
       
           // console.log('update_similar '+this.targetPatientProInfo);
         });

         events.on('update_target', () => { //this is picked up from target patient search in query box

            const value = (<HTMLInputElement>document.getElementById('text_pat_id')).value;
            
            this.getTargetCPT(value, this.cohortProObjects);
       
         });

    }

    //uses Phovea to access PROMIS data and draw table for cohort
    private async getPromisScore(selectedPatIds) {

        let filteredPatScore = {};
       // console.log(this.patProObjects + 'found in promis score');
        this.cohortProObjects.forEach(item => {
        if (selectedPatIds.indexOf(item.PAT_ID) !== -1) {
        if (filteredPatScore[item.PAT_ID] === undefined) {
         filteredPatScore[item.PAT_ID] = [];
       }
       filteredPatScore[item.PAT_ID].push(item);
     }
   });
       let mapped = entries(filteredPatScore);
       this.cohortProInfo = mapped;
       events.fire('gotPromisScore', this.cohortProInfo);
 
     };

       //gets CPT objects for target patient and maps them to draw
   private async getTargetCPT(patID, cptObject) {

    // console.log(cptObject);
    // console.log(this.selectedPatientArray);
    let filteredPatScore = [];
    // console.log(this.patProObjects + 'found in promis score');
     this.cohortProObjects.forEach(item => {
     if (patID.indexOf(item.PAT_ID) !== -1) {
     filteredPatScore.push(item);
     }
     }); 
 
     let filteredPatOrders = {};
    // const patOrders = await this.orderTable.objects();
    console.log(cptObject);
    
      cptObject.forEach(item => {
          if (patID.indexOf(item.PAT_ID) !== -1) {
           if (filteredPatOrders[item.PAT_ID] === undefined) {
      filteredPatOrders[item.PAT_ID] = [];
    }
      filteredPatOrders[item.PAT_ID].push(item);
     }
      });
     let mapped = entries(filteredPatOrders);
 
     //console.log("mapped in cpt  "+mapped);
 
    // events.fire('filtered_CPT', mapped);
     events.fire('target_updated', [mapped, filteredPatScore]);
 
  };
/*
     private async updateTargetPatient(patID) {

         //get target patient PROMIS Scores
         

          let filteredPatScore = [];
          // console.log(this.patProObjects + 'found in promis score');
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
            console.log("target patient " + filteredPatOrders);
            console.log(filteredPatScore);
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

     public selectedPatientId(data){//this adds all of the filtered patients to an array

        let ids = [];
        
                data.forEach(element => {
                   ids.push(element.ID);
               });

       // console.log("selected group ids     "+ids);
        this.selectedPatIds = ids;

        events.fire('selected_pat_array', this.selectedPatIds);

        this.getPromisScore(this.selectedPatIds);
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

    public async loadData(id: string){
    
       let table = <ITable> await getById(id);//load the tables or orders and PROMIS scores on init of app
       //this.orderTable = <ITable> await getById('Orders');
      // object = await table.objects();//gets the table information for PROMIS scores as objets
       events.fire(id, table);//sends the object array to sidebar? for filtering against cohort
   
    }

    public async getDataObjects(id: string, table: ITable){

        let object = await table.objects();
        events.fire(id, object);

    }


  }

  export function create() {
    return new dataObject();
}

   

