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
import {scaleLinear,scaleTime,scaleOrdinal, scaleBand, scaleLog} from 'd3-scale';
import {asVector} from 'phovea_core/src/vector/Vector';
import {argFilter} from 'phovea_core/src/';
import * as events from 'phovea_core/src/event';
import {nest, values, keys, map, entries} from 'd3-collection';
import * as d3 from 'd3';
import * as dataCalc from './dataCalculations';
import {extent, min, max, ascending, histogram, mean, deviation} from 'd3-array';

export class DataManager {

    private findMinDate = dataCalc.findMinDate;
    private findMaxDate = dataCalc.findMaxDate;
    private findMinDateCPT = dataCalc.findMinDateCPT;
    private findMaxDateCPT = dataCalc.findMaxDateCPT;
    private parseTime = dataCalc.parseTime;
    private targetOrder;
    private seperateValue;
    private scoreChangeBool;
    private selected;

    //tables for all patient data
    demoTable : ITable;

    //defined cohort info
  //  cohortIdArray;
    cohortOrderInfo; //defined cohort 

    totalProObjects;//Promis scores as objects for cohort
    totalDemoObjects;//demo for whole population
    //filteredCohortDemo;//demographic info as objects for defined cohort
    totalCptObjects;//CPT as objects for defined cohort
    cohortIcdObjects;//ICD objects for cohort

    startDate;

    constructor() {
        /* 
        // GET THE GIVEN TABLE BY TABLE ID AS ARG
        */

        this.loadData('Demo_Revise').then((d)=> this.getDataObjects('demo_object', d));
        this.loadData('PROMIS_Scores').then((d)=>  this.getDataObjects('pro_object', d));
        this.loadData('CPT_codes').then((d)=>  this.getDataObjects('cpt_object', d));

        this.attachListener();

    }

    private attachListener(){

       // let startDateSelection = d3.select('#start_date').select('text');

        events.on('checkbox_hover', (evt, item)=> {//this is called when you click the checkboxes or hover
            let parent = item[0];
            let choice = item[1];
            let subFilter = this.totalDemoObjects.filter(d => d[parent] == choice);

           //gos right back to sidebar for the hover count
            events.fire('filter_counted', [this.totalDemoObjects.length, subFilter.length, parent]);

          });

        events.on('create_button_down', (evt, item) => { // called in sidebar
            let filter = [];
            this.demoFilter(filter, this.totalDemoObjects).then(ids=> {
                let cohortIDs = ids;
                //this.mapPromisScores(cohortIDs, this.totalProObjects, filter).then(promis=> {
                this.loadPromisData(cohortIDs, filter).then(promis=> {
                   
                    this.getCPT(cohortIDs, this.totalCptObjects).then(d=> {
                        this.mapCPT(promis, d).then(orders=> {
                         
                            this.getDays(promis, null).then(promisShifted=> {
                                this.getBaselines(promisShifted).then(based=> {
                                    events.fire('new_cohort', [based, orders, filter]);
                                });
                               
                            });
                        });
                    });
                });
            });
          });

        events.on('Demo_Revise', (evt, item) => {
            this.demoTable = item;
            
            this.mapDemoData().then(value => {
               events.fire('population demo loaded', value);
            });
          
        });

        events.on('update_cohort_start', (evt, item)=> {
            let codes = item[0];
            let promis = item[1].promis;
            let cpt = item[1].cpt;
            
            if(item[0] == null){
              
               this.getDays(promis, null).then(promisShifted=> {
              
                this.getBaselines(promisShifted).then(based=> {
                    this.updateDiff(codes, cpt, promisShifted).then(cptShifted=> {  
                        events.fire('min_day_calculated', [based, cptShifted, codes]);
                    });
                });
            });

            }else{
                console.log(codes);
                this.searchByEvent(cpt, codes[0]).then((cptFiltered)=> {
               
                    let eventStartArray = cptFiltered[1];
             
                    this.addMinDay(promis, eventStartArray).then(co=> {
                        this.getDays(co, 'days').then(promisShifted=> {
                            this.getBaselines(promisShifted).then(based=> {
                                this.updateDiff(codes, cptFiltered[0], null).then(cptShifted=> {
                                    events.fire('min_day_calculated', [based, cptShifted, codes]);
                                });
                            });
                        });
                    });
                });
            }
        });


        events.on('filter_cohort_agg', (evt, item)=> {
            console.log('filter cohrot agg happens');
       
        });

        events.on('filtering_Promis_count', (evt, item)=> {
            this.filterByPromisCount(item[0].promis, item[1]).then(d=> {
                events.fire('filtered_by_count', d);
            });
        });

        events.on('filter_by_cpt', (evt, item)=> {
 
            let cpt = item[2].cpt;
            let promis = item[2].promis;

            this.searchByEvent(cpt, item[0]).then((d)=> {

                let order = item;
                this.getCohortIdArrayAfterMap(d[0], 'cpt').then(id=> this.filterObjectByArray(id, promis, 'promis').then(ob=> {
                        events.fire('filter_cohort_by_event', [cpt, ob, order]);
                   })
                );
               
            });
        });
        events.on('get_selected_demo', (evt, item)=> {

            let promis = item[1].promis;
            let cpt = item[1].cpt;
            let filters = item[0];

            this.getCohortIdArrayAfterMap(promis, 'demo')
            .then(id=>  this.filterObjectByArray(id, this.totalDemoObjects, 'demo')
            .then(ob => this.demoFilter(filters, ob).then(ids=> {
                this.filterObjectByArray(ids, promis, 'promis').then(pro => {
                    this.filterObjectByArray(ids, cpt, 'cpt').then(cptFiltered => {
                        events.fire('promis_from_demo_refiltered', [filters, pro, cptFiltered]);
                    });
                });
                
            })));
 
         });

         events.on('filter_demo_data', (evt, item)=> {
    
             let promis = item[0].promis;
             let cpt = item[0].cpt;
             let filters = item[1];
             this.demoFilter(filters, this.totalDemoObjects).then(ids=> {
     
                this.filterObjectByArray(ids, promis, 'promis').then(pro => {
                    this.filterObjectByArray(ids, cpt, 'cpt').then(cptFiltered => {
                        events.fire('promis_from_demo_refiltered', [filters, pro, cptFiltered, item[2]]);
                    });
                });
             });
        });

        events.on('selected_line_with_cpt', (evt, item)=> {
            this.filterObjectByArray(item[0], item[1], 'cpt').then((cpt)=> events.fire('chosen_pat_cpt', cpt));
         });

         events.on('change_sep_bool', (evt, item)=> {
            let bool;
        
            this.getQuant_Separate(this.selected.promis, 3, item.scaleR).then(sep=> {
                events.fire('separated_by_quant', sep);
            });

         })
 
        events.on('separate_cohort_agg', (evt, item)=> {
            let sepBool;
            if(item[1] == true){
                sepBool = true;
            }else{
                sepBool = false;
            }
            this.selected = item[0];
        
            this.getQuant_Separate(item[0].promis, 3, this.scoreChangeBool).then(sep=> {
                events.fire('separated_by_quant', sep);
            });
        });

        /* 
        // THESE SET VARIABLES TO OBJECTS AND SEND OBJECTS TO VIEWS
        */
        //THESE ARE TAKING AN ETERNITY. NEED TO USE RANGES TO FILTER TABLES

        events.on('pro_object', (evt, item)=> {//picked up by similarity diagram
            this.totalProObjects = item;
        });

        events.on('cpt_object', (evt, item)=> {
            console.log('cpt loaded');
            this.totalCptObjects = item;
            events.fire('create_button_down');
            events.fire('initial_cohort_load');
        });

        events.on('update_cpt_days', (evt, item)=>{
    
            this.updateDiff(this.targetOrder, item[0], null).then(cpt=> {
                events.fire('cpt_updated', cpt);
            });
        });

    }

    private async loadPromisData(cohortIDs, filter){

        let promis = this.loadData('PROMIS_Scores').then((d)=>  this.getDataObjects('pro_object', d).then(ob=> (this.mapPromisScores(cohortIDs, ob, filter))));

        return promis;
    }

    private async addMinDay(patients, eventArray) {
        let cohort = patients
      
        if(eventArray != null){

            for(var i= 0;  i< cohort.length; i++) {
                var keyA = cohort[i].key;
                for(var j = 0; j< eventArray.length; j++) {
                  var keyB = eventArray[j].key;
                  if(keyA == keyB) {
                    cohort[i].CPTtime = eventArray[j].time;
                  }
                }
              }
        }else{ console.log('vent array is null'); }

         return cohort;
}

    private addEventDay(patients, eventArray) {

        let cohort = patients;

        for(var i= 0;  i< cohort.length; i++) {
            var keyA = cohort[i].key;
            for(var j = 0; j< eventArray.length; j++) {
            var keyB = eventArray[j].key;
            if(keyA == keyB) {
                cohort[i].CPTtime = eventArray[j].time;
            }
            }
        }

    }   


//pulled from parallel coord
//this hapens when demo button it pushed
    private async demoFilter(filters, demoObjects) {

        let demo = JSON.parse(JSON.stringify(demoObjects));

        let cohortIds;

        filters = filters.filter(fil=> fil.type != 'Start');

        filters.forEach( (d)=> {

        let filter = String(d.filter);
        let choice = d.value;
            if(filter === 'BMI' || filter === 'CCI' || filter === 'AGE'){
        
                demo = demo.filter(f => { return +f[filter] > +choice[0] && +f[filter] < +choice[1] });
                cohortIds = demo.map(d=> d.ID);

            }else{
                if (String(filter) === 'DM_CODE') { demo = demo.filter(dm => dm[filter] == choice || dm[filter] == choice + 3); 
                }else{
        
              
                    demo = demo.filter(de=> {
                        if(choice.indexOf(de[filter]) > -1){ return de; }
                    });
                    cohortIds = demo.map(d=> d.ID);
                }
            }
        });

        return cohortIds;
    }

    private async filterByPromisCount(cohort, count) {
    
        let filter = [];

        cohort.forEach(patient => {
            if(patient.value.length > count){
                filter.push(patient);
            }

       });
       return [filter, count];
     //  events.fire('filtered_by_count', [filter, count]);
    }

    private async getDays(cohort, date) {
     
        // ----- add diff days to the data
          
            let maxDiff = 0;// this sets the score scale max.
            //need to make this dynamic. 
            let diffArray = [];
            if (cohort != null) {
                
                cohort.forEach((g) => {
                    let  minDate;
                    if(g.CPTtime != undefined && date != null ) {
                        minDate = this.parseTime(g.CPTtime, null);
                      
                    }else minDate = g.min_date;
                //these have already been parsed
                let maxDate = g.max_date;
                            g.value.forEach((d) => {
                            try {
                            d.diff = Math.ceil((this.parseTime(d['ASSESSMENT_START_DTM'], null).getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
                            maxDiff = d.diff > maxDiff ? d.diff : maxDiff;
                            }
                            catch (typeError) {
                            d.diff = -1;
                            }
                            });
                            try { 
                                g.days = (Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24))) + 1;
                            }catch (typeError){
                                g.days = -1;
                            }
                           
                            diffArray.push(g.days + 1);

                            g.value.sort((a, b) => ascending(a.diff, b.diff));

                            });

                            diffArray.sort((a, b) => ascending(a, b));
                            events.fire('timeline_max_set', max(diffArray));
                            events.fire('day_dist', cohort);
                  
                            return cohort;

            }else{console.log('error'); }

    }
    
    //breaks each pat value scores into Original and relative score
    private async getBaselines(cohort)  {
        
        cohort.forEach(pat => {
        
            pat.value = pat.value.sort((a, b)=> a.diff - b.diff);

            let pos = pat.value.filter(v=> v.diff > 0).map(m=> [m.diff, m.SCORE]);

            let neg = pat.value.filter(v=> v.diff < 0).map(m=> [m.diff, m.SCORE]);

            let zeroScore = pat.value.filter(v=> v.diff == 0).map(m=> [m.diff, m.SCORE]);
          
            if(zeroScore.length > 0 ){ 
                pat.b = zeroScore[0][1];
                pat.value.forEach(val => {
                    val.relScore = val.SCORE - pat.b;
                });

            }else{
        
                let array1;
                let array2;

                if(neg.length == 0){ 
                    array1 = pos[0];
                }else{
                    array1 = neg[neg.length - 1];
                }

                if(pos.length == 0){ 
                    array2 = neg[neg.length - 1];
                }else{
                    array2 = pos[0];
                }

                if(array1 == array2){
              
                    pat.b = array1[1];
                }else{
                    let x1 = array1[0];
                    let x2 = array2[0];
                    let y1 = array1[1];
                    let y2 = array2[1];
                    
                    let slope = (y2 - y1) / (x2 - x1);
          
                    let b = y1 - (slope * x1);
                    pat.slope = slope;
                    pat.b = +b;
                }

                pat.value.forEach(val => {
                    val.relScore = val.SCORE - pat.b;
                });
            }
        });

        return cohort;
    }
 
    private async getQuant_Separate(cohort, binNum, relativeChange) {

        let arrayofArrays = [];

        if(relativeChange == true){

       

            cohort.forEach(pat => {
                let afterEvent = pat.value.filter(v=> v.diff > -1);
                let scores2 = pat.value.map(s=> s.relScore);
                let scores = pat.value.map(s=> {
                    if(s.diff > -1){ return s.relScore}else{ return 0 }});
                let scores3 = pat.value.map(s=> {
                        if(s.diff > -1){ return s.relScore}});
                 let avs = scores.reduce((a, b) => parseFloat(a) + parseFloat(b)) / scores.length;
                 let avs2 = scores2.reduce((a, b) => parseFloat(a) + parseFloat(b)) / scores2.length;
                 pat.avChange2 = avs2;
                 pat.avChange = avs;
                 pat.test = scores3;
         
             });
     
             let avsArray = cohort.map(d=> d.avChange);
           
             avsArray = avsArray.sort((a,b)=> a-b);
         
             let thresholdArray = Array.from(new Set(avsArray));
     
             let num = Math.floor(thresholdArray.length / binNum);
     
             let thresholds = [];
     
             for(let i = 0; i < (binNum - 1); i++){
               thresholds.push(thresholdArray[num]);
               num = num + num;  }
               
             for(let i = 0; i < binNum; i++){
                 if(i == 0){ 
                     arrayofArrays.push(cohort.filter(c=> c.avChange < thresholds[i]));
                 }else if(i == (binNum - 1)) {
                     arrayofArrays.push(cohort.filter(c=> c.avChange > thresholds[i-1]));
                 }else {
                     arrayofArrays.push(cohort.filter(c=> c.avChange < thresholds[i] && c.avChange > thresholds[i-1] ));
                 }
             }
        }else {
     
            let barray = cohort.map(pat=> {
                if(pat.b != undefined){return pat.b;
                }else { return pat.value[0].SCORE; }
            });

        
       
            barray = barray.sort((a,b)=> a-b);
         
            let thresholdArray = Array.from(new Set(barray));
    
            let num = Math.floor(thresholdArray.length / binNum);
    
            let thresholds = [];

            for(let i = 0; i < (binNum - 1); i++){
                thresholds.push(thresholdArray[num]);
                num = num + num;  }

  
            if(cohort[0].b != undefined){
                for(let i = 0; i < binNum; i++){
                    if(i == 0){ 
                        arrayofArrays.push(cohort.filter(c=> c.b < thresholds[i]));
                    }else if(i == (binNum - 1)) {
                        arrayofArrays.push(cohort.filter(c=> c.b > thresholds[i-1]));
                    }else {
                        arrayofArrays.push(cohort.filter(c=> c.b < thresholds[i] && c.b > thresholds[i-1] ));
                    }
                }
            }else {
                for(let i = 0; i < binNum; i++){
                    if(i == 0){ 
                        arrayofArrays.push(cohort.filter(c=> c.value[0].SCORE < thresholds[i]));
                    }else if(i == (binNum - 1)) {
                        arrayofArrays.push(cohort.filter(c=> c.value[0].SCORE > thresholds[i-1]));
                    }else {
                        arrayofArrays.push(cohort.filter(c=> c.value[0].SCORE < thresholds[i] && c.value[0].SCORE > thresholds[i-1] ));
                    }

                }
            }
        }
            
        return arrayofArrays;
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
    private async mapPromisScores(cohortIdArray, proObjects, filter) {

        let proObjectsFiltered = proObjects.filter((d) => {
            return d['FORM_ID'] === 1123;
        });

        let filteredPatOrders = {};

        if (cohortIdArray != null ) {

            proObjectsFiltered.forEach((d) => {

                if (cohortIdArray.indexOf(d.PAT_ID) !== -1) {
                        if (filteredPatOrders[d.PAT_ID] == undefined) {
                            filteredPatOrders[d.PAT_ID] = [];
                            }
                            filteredPatOrders[d.PAT_ID].push(d);
                            }
                });
            }

        if (cohortIdArray == null){
            proObjectsFiltered.forEach((d) => {

                        if (filteredPatOrders[d.PAT_ID] == undefined) {
                                filteredPatOrders[d.PAT_ID] = [];
                                }
                                filteredPatOrders[d.PAT_ID].push(d);
            });

        }
        let mapped =  await entries(filteredPatOrders);
        //return filteredPatOrders;
        let patPromis = mapped.map(d=> {
            return {
                key: d.key,
                value: d.value,
                min_date: this.findMinDate(d.value),
                max_date: this.findMaxDate(d.value)
            };
        });

        return patPromis;

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
        return mapped;

 };

      //uses Phovea to access PRO data and draw table
    private async getDemo(cohortIdArray, demObject) {
        
        let filteredPatOrders = {};
        // const patOrders = await this.orderTable.objects();
        if (cohortIdArray != null) {
       
            demObject.forEach((item) => {
                if (cohortIdArray.indexOf(item.PAT_ID) != -1) {
                if (filteredPatOrders[item.PAT_ID] === undefined) {
            filteredPatOrders[item.PAT_ID] = [];
        }
            filteredPatOrders[item.PAT_ID].push(item);
            }
            });
            }

        if (cohortIdArray == null) {
            demObject.forEach((d) => {
                if (filteredPatOrders[d.PAT_ID] === undefined) {
                        filteredPatOrders[d.PAT_ID] = [];
                    }
                filteredPatOrders[d.PAT_ID].push(d);
            });
        }
        const mapped = entries(filteredPatOrders);
        return mapped;
    };

          /**
     *
     * @param ordersInfo
     */
    //you need the promis objects and the cpt objects
    //you should only have to do this once??
    private async mapCPT(patProInfo, CPTobjects) {
       
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

        return filteredOrders;
    }

    private async getCohortIdArrayAfterMap (selectedData, typeofData: string)   {
        let tempPatArray = [];
        if(typeofData == 'cpt') {
            selectedData.forEach((element) => {
                tempPatArray.push(element[0].key);
            });
        }else if(typeofData == 'demo') {
            tempPatArray = selectedData.map(d=> +d.key);
        } return tempPatArray;
    }

    private async filterObjectByArray (selectedIdArray, objects, obType)   {

        if(obType == 'cpt') { 
            let res = [];
            objects.forEach(pat => {
                if(selectedIdArray.includes(pat[0].key)){
                    res.push(pat);
                }
            });
          
            return res;
       }
       if(obType == 'promis') { 
            let res = objects.filter((f) => selectedIdArray.includes(+f.key));
            return res;
       }
        if(obType == 'demo') {
            let res = objects.filter((f) => selectedIdArray.includes(f.ID));
            return res;
        }else{ console.log('obType not found'); }
    }

    public async loadData(id: string) { //loads the tables from Phovea
       let table = <ITable> await getById(id);
       events.fire(id, table);//sends the id string to the getDataObjects
       return table;
    }

    public async getDataObjects(id: string, table: ITable) {
        let object = await table.objects();
        let newOb = JSON.parse(JSON.stringify(object));
        events.fire(id, object);
        return newOb;
    }

    //YOU NEED TO INTEGRATE THIS HERE AND REMOVE FROM QUERYBOX.TS

    private async searchByEvent(cohort, value) {
        
        //change the code to a code array make it sequence specific
        let withQuery = [];
        let queryDate = [];
        let eventArray = [];

       cohort.forEach((element) => {
        let events = [];
        let elementBool;
        element.forEach(g => {
            value.forEach(v => {

                if (g.value[0].includes(+v)){
                        events.push(g);
                    if(elementBool != g.key){
                        withQuery.push(element);
                        queryDate.push(g);
                    }elementBool = g.key;
                    }
            });
        });
        if(events.length != 0) eventArray.push(events);
    });
      
        return [withQuery, queryDate];
    }

    private async updateDiff(code, patCPT, patPromis){

       if(code!= null){

        code = code[0].map(c => +c);
        let filArray = []
        patCPT.forEach(pat => {
            let fil = pat.filter(visit=> {
                return visit.value[0].some(r => code.includes(r));
               });
      
            filArray.push(fil);
            pat.eventDay = fil[0].time;

            pat.forEach(visit => {
                visit.diff = Math.ceil((this.parseTime(visit.time, null) - this.parseTime(pat.eventDay, null)) / (1000 * 60 * 60 * 24));
            });
        });

       }else{
           let startDayArray = [];
           patPromis.forEach(pat => {
             
           });
       }
      
       return patCPT;
    }

  }

  export function create() {
    return new DataManager();
}

   

