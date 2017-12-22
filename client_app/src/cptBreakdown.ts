/**
 * Created by Jen Rogers on 8/11/17.
 */
import * as ajax from 'phovea_core/src/ajax';
import {BaseType, select, selectAll,event} from 'd3-selection';
import {nest,values,keys,map,entries} from 'd3-collection'
import * as events from 'phovea_core/src/event';
import {scaleLinear,scaleTime,scaleOrdinal} from 'd3-scale';
import {line,curveMonotoneX} from 'd3-shape';
import {timeParse} from 'd3-time-format';
import {extent, min, max, ascending} from 'd3-array';
import {axisBottom,axisLeft} from 'd3-axis';
import {drag} from 'd3-drag';
import {Constants} from './constants';
import * as dataCalc from './dataCalculations';
import {transition} from 'd3-transition';
import {brush, brushY, brushX} from 'd3-brush';
import * as similarityScore  from './similarityScoreDiagram';
import * as d3 from 'd3';
import {ITable, asTable} from 'phovea_core/src/table';
import {IAnyVector} from 'phovea_core/src/vector';
import {list as listData, getFirstByName, get as getById} from 'phovea_core/src/data';
//import * as csvUrl from 'file-loader!../data/number_one_artists.csv';
import {tsv} from 'd3-request';
import {ICategoricalVector, INumericalVector} from 'phovea_core/src/vector/IVector';
import {VALUE_TYPE_CATEGORICAL, VALUE_TYPE_INT} from 'phovea_core/src/datatype';
import {range, list, join, Range, Range1D, all} from 'phovea_core/src/range';
import {asVector} from 'phovea_core/src/vector/Vector';
import {argFilter} from 'phovea_core/src/';

export class cptBreakdown {

  private $node;


  rectBoxDimension = {width: 1100, height: 90 };
  orderBar = {width: 10, height: 60 };
  similarBar = {width: 8, height: 30 };
  margin = {top: 20, right: 10, bottom: 10, left: 10};
  contextDimension = {width: this.rectBoxDimension.width, height:55};
 
  selectedPatientArray;
  cptObject;

  table: ITable;
  table2: ITable;
    
  constructor(parent: Element) {

    this.attachListener();
  
      }

  /**
   * Attach listeners
   */
  
  private attachListener() {

    events.on('selected_pat_array', (evt, item)=> {
      //  console.log(item);
        this.selectedPatientArray = item;
        this.getOrders(this.selectedPatientArray, this.cptObject);
    });

    events.on('cpt_object', (evt, item)=> {
       // console.log(item);
        this.cptObject = item;
        //this.getOrders(this.selectedPatientArray, item);
       // this.getOrders(this.patCptObjects);
    });
   

  }

   //uses Phovea to access PRO data and draw table
   private async getOrders(selectedPatIds, cptObject) {
    /*
    let ids = [];

     selectedPatIds.forEach(element => {
        ids.push(element.ID);
    });*/
    console.log(cptObject);
    console.log(this.selectedPatientArray);

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

   // this.similarOrderInfo = mapped;
    console.log(mapped);
//events.fire('orders_updated',[this.patOrderObjects, this.targetPatientProInfo, this.similarPatientProInfo]);
   // events.fire('orders_updated',[this.targetPatientProInfo, this.similarOrderInfo, this.similarPatientsProInfo]);

 };

 


  }
   

export function create(parent:Element) {
  return new cptBreakdown(parent);
}

