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

interface Subject {

registerObserver(o : Observer);
removeObserver(o : Observer);
notifyObserver();

}

interface Observer {

update(table : any);

}

export class dataObject implements Subject {

    demoTable : ITable;
    orderTable : ITable;
    proTable : ITable;
    cptTable : ITable;
    targetPatientProInfo;
    similarPatientsProInfo; //used in order squares
    similarOrderInfo;

    patProObjects;
    patOrderObjects;
    patDemoObjects;
    patCptObjects;

    selectedPatIds;

    constructor() {
        console.log('is this thing on');

        this.loadData('Demo_Revise');
        this.loadData('PROMIS_Scores');//.then(console.log(this.proTable));
        this.loadData('Orders');
        this.loadData('CPT_codes');
        this.attachListener();
    }

    public registerObserver(o : Observer) {};
    public removeObserver(o : Observer) {};
    public notifyObserver() {};

    private attachListener(){

        events.on('PROMIS_Scores', (evt, item) => {
            this.proTable = item;
            this.getDataObjects('pro_object', this.proTable);
        });
                 
        events.on('Orders', (evt, item)=> {
            this.orderTable = item;
            this.getDataObjects('order_object', this.orderTable);
        });

        events.on('CPT_codes', (evt, item)=> {
            this.cptTable = item;
            this.getDataObjects('cpt_object', this.cptTable);
        });

        events.on('order_object', (evt, item)=> {
            this.patOrderObjects = item;
        });

        events.on('pro_object', (evt, item)=> {
            this.patProObjects = item;
        });

        events.on('cpt_object', (evt, item)=> {
            this.patCptObjects = item;
           // this.getOrders(this.patCptObjects);
        });


        events.on('dataUpdated', (evt, item) => {
            this.selectedPatientId(item[0]);
           // this.getPromisScore(this.selectedPatIds); 
           // this.getOrders(this.selectedPatIds);
         });

        events.on('update_similar', (evt, item) => { 
            this.targetPatientProInfo = item[2]['pat_PRO'][item[0]].slice();
        
         });

    }

    //uses Phovea to access PROMIS data and draw table
    private async getPromisScore(selectedPatIds) {
        /*
        let ids = [];
 
        data.forEach(element => {
            ids.push(element.ID);
        });*/
 
        let filteredPatScore = {};
       // console.log(this.patProObjects + 'found in promis score');
        this.patProObjects.forEach(item => {
        if (selectedPatIds.indexOf(item.PAT_ID) !== -1) {
        if (filteredPatScore[item.PAT_ID] === undefined) {
         filteredPatScore[item.PAT_ID] = [];
       }
       filteredPatScore[item.PAT_ID].push(item);
     }
   });
       let mapped = entries(filteredPatScore);
       this.similarPatientsProInfo = mapped;
       events.fire('gotPromisScore', this.similarPatientsProInfo);
 
     };

     public selectedPatientId(data){//this adds all of the filtered patients to an array

        let ids = [];
        
                data.forEach(element => {
                   ids.push(element.ID);
               });

        console.log("selected group ids     "+ids);
        this.selectedPatIds = ids;

        events.fire('selected_pat_array', this.selectedPatIds);

        this.getPromisScore(this.selectedPatIds);
        this.getOrders(this.selectedPatIds);

     }
 
     //uses Phovea to access PRO data and draw table
     private async getOrders(selectedPatIds) {
        /*
        let ids = [];
 
         selectedPatIds.forEach(element => {
            ids.push(element.ID);
        });*/
 
        let filteredPatOrders = {};
        const patOrders = await this.orderTable.objects();
       
         patOrders.forEach(item => {
             if (selectedPatIds.indexOf(item.PAT_ID) !== -1) {
              if (filteredPatOrders[item.PAT_ID] === undefined) {
         filteredPatOrders[item.PAT_ID] = [];
       }
         filteredPatOrders[item.PAT_ID].push(item);
        }
         });
        let mapped = entries(filteredPatOrders);
   
        this.similarOrderInfo = mapped;

 //events.fire('orders_updated',[this.patOrderObjects, this.targetPatientProInfo, this.similarPatientProInfo]);
        events.fire('orders_updated',[this.targetPatientProInfo, this.similarOrderInfo, this.similarPatientsProInfo]);
 
     };

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

   

