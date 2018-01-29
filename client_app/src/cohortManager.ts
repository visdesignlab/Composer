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
/*
interface IfilterRequirements {
    'demo': null, //this is sent from sidebar
    'icd': null,
    'cpt': null
   };*/

export class CohortManager {

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

    selectedPatIds;//array of ids for defined patients 

 
    cohortCounter = 0;
    cohortfilterarray = [];
    cohortkeeperarray = [];

    //attempting to set up structure to hold filters
    filterRequirements = {
        'demo': null, //this is sent from sidebar
        'icd': null,
        'cpt': null
       };

    constructor() {


        this.attachListener();


    }

    private attachListener(){


    }

    private addCohortFilter () {

        let filter = this.filterRequirements;


        this.cohortfilterarray.push(filter);
        this.cohortCounter =+ 1;

        events.fire('cohort_added', this.cohortfilterarray);

    }

    private removeCohortFilterArray () {

        this.cohortfilterarray = [];
      

    }


  }

  export function create() {
    return new CohortManager();
}

   