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
    patProObjects;
    patOrderObjects;

    constructor() {
        console.log('is this thing on');
        this.loadData();
       

    }

    public registerObserver(o : Observer) {};
    public removeObserver(o : Observer) {};
    public notifyObserver() {};

    public async loadData(){
        
       this.proTable = <ITable> await getById('PRO');
       this.patProObjects = await this.proTable.objects();

       this.orderTable = <ITable> await getById('Orders');

       events.fire('dataloaded', [this.patProObjects, this.orderTable]);
    }

  }

  export function create() {
    return new dataObject();
}

   

