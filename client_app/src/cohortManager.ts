/**
 * Created by Jen Rogers on 1/29/18.
 * cohortkeeper to keep all those cohorts.
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
import * as codeDict from './cptDictionary';

export class CohortManager {

    cohortIdArray;//array of ids for defined patients
    allPatientPromis;
    cohortIndex = 0;
    cohortfilterarray = [];
    cohortkeeperarray = [];
    cptObjectKeeper = [];
    selectedCohort;//this is going to be the selected cohort from the cohort keeper array
    selectedFilter;//this is the selected filter from the cohortfilterarray;
    selectedCPT;
    cptCodes;
    codes;

    //attempting to set up structure to hold filters
    filterRequirements = {
        'demo': null, //this is sent from sidebar
        'icd': null,
        'cpt': []
       };

    constructor() {
        this.codes = codeDict.create();
        this.attachListener();

    }

    private attachListener(){

        events.on('clear_cohorts', () => {
            this.removeCohortFilterArray();
            this.selectedCohort = this.allPatientPromis;
            events.fire('selected_cohort_change', this.selectedCohort);
        });

        events.on('got_promis_scores', (evt, item)=> {
            console.log('got promis scores fired');
            this.allPatientPromis = item;
        });

          // item: [d, parentValue]
          events.on('demo_filter_button_pushed', (evt, item) => { // called in sidebar
            let filterReq = {demo: null, cpt: []};
            filterReq.demo = item;
            this.addCohortFilter(filterReq);
          });

          events.on('cohort_selected', (evt, item)=>{

            d3.select('#cohortKeeper').selectAll('.selected').classed('selected', false);
            let cohort = item[0];
            let index = item[1];
            this.cohortIndex = index;
            this.selectedFilter = this.cohortfilterarray[this.cohortIndex];
            this.selectedCohort = this.cohortkeeperarray[this.cohortIndex];
            this.selectedCPT = this.cptObjectKeeper[this.cohortIndex];
            let selectedLabel = document.getElementById('cohortKeeper').getElementsByClassName(index);
            selectedLabel[0].classList.add('selected');
            
            events.fire('selected_cohort_change', this.selectedCohort);
            events.fire('selected_cpt_change', this.selectedCPT);
          });

          events.on('filtered_CPT_by_order', (evt, item)=>{
             // this.selectedCohort.cpt.push(item[1]);
          });

          events.on('filtered_patient_promis', (evt, item) => {
             this.cohortkeeperarray.push(item);
             this.cohortIndex = this.cohortkeeperarray.length - 1;
             this.selectedCohort = this.cohortkeeperarray[this.cohortIndex];
             this.selectedFilter = this.cohortfilterarray[this.cohortIndex];
             let index = +this.cohortIndex;
         
             events.fire('selected_cohort_change', this.selectedCohort);
             events.fire('new_cohort_added', this.selectedCohort);
          });

          events.on('cpt_mapped', (evt, item)=> {
              console.log('cpt for you  ' + item.length);
              this.cptObjectKeeper.push(item);
              console.log(this.cptObjectKeeper);
              this.selectedCPT = this.cptObjectKeeper[this.cohortIndex];

          });
    }

    private addCohortFilter (filter) {

        this.cohortfilterarray.push(filter);
        events.fire('cohort_added', this.cohortfilterarray);
    }

    private removeCohortFilterArray () {

        this.cohortfilterarray = [];
        this.cohortkeeperarray = [];
        this.cptObjectKeeper = [];
        this.cohortIndex = 0;

    }


  }

  export function create() {
    return new CohortManager();
}
