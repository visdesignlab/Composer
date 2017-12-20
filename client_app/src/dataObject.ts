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
    proTable :ITable;
    targetPatientProInfo;
    similarPatientsProInfo;
    similarOrderInfo;

    patProObjects;
    patOrderObjects;
    patDemoObjects;

    constructor() {
        console.log('is this thing on');

        this.loadData('Demo_Revise', this.demoTable, this.patDemoObjects);
        this.loadData('PROMIS_Scores', this.proTable, this.patProObjects);//.then(console.log(this.proTable));
        this.loadData('Orders', this.orderTable, this.patOrderObjects);
        this.attachListener();
    }

    public registerObserver(o : Observer) {};
    public removeObserver(o : Observer) {};
    public notifyObserver() {};

    private attachListener(){

        events.on('PROMIS_Scores', (evt, item) => {
          
            this.patProObjects = item[0];
        });
                 
        events.on('Orders', (evt, item)=> {
            console.log(item)
            this.orderTable = item[1];
        });


        events.on('dataUpdated', (evt, item) => {

            this.getPromisScore(item[0]); 
            this.getOrders(item[0]);
         });


        events.on('update_similar', (evt, item) => { 
            this.targetPatientProInfo = item[2]['pat_PRO'][item[0]].slice();
           // this.similarPatientsProInfo = entries(item[2]['similar_PRO']);
           // this.similarOrderInfo = entries(item[2]['similar_Orders']);
         });

    }

    //uses Phovea to access PRO data and draw table
    private async getPromisScore(data) {
        
        let ids = [];
 
         data.forEach(element => {
            ids.push(element.ID);
        });
 
      let filteredPatScore = {};
     console.log(this.patProObjects);
      this.patProObjects.forEach(item => {
      if (ids.indexOf(item.PAT_ID) !== -1) {
       if (filteredPatScore[item.PAT_ID] === undefined) {
         filteredPatScore[item.PAT_ID] = [];
       }
       filteredPatScore[item.PAT_ID].push(item);
     }
   });
      let mapped = entries(filteredPatScore);
   
      this.similarPatientsProInfo = mapped;
 
     };
 

     //uses Phovea to access PRO data and draw table
     private async getOrders(data) {
        
        let ids = [];
 
         data.forEach(element => {
            ids.push(element.ID);
        });
 

        let filteredPatOrders = {};
        const patOrders = await this.orderTable.objects();
       
         patOrders.forEach(item => {
             if (ids.indexOf(item.PAT_ID) !== -1) {
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

    public async loadData(id: string, table : ITable, object : any){
    
       table = <ITable> await getById(id);//load the tables or orders and PROMIS scores on init of app
       //this.orderTable = <ITable> await getById('Orders');
       object = await table.objects();//gets the table information for PROMIS scores as objets

      events.fire(id, [object, table]);//sends the object array to sidebar? for filtering against cohort
      console.log(id);

     // return table;
    }

    public async getDataObjects(id: string, table: ITable, objects: any){

    }


  }

  export function create() {
    return new dataObject();
}

   

