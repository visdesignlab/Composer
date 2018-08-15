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
import {timeParse, timeFormat} from 'd3-time-format';
import { promises } from 'fs';

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
    promisTable : ITable;
    //defined cohort info
    cohortOrderInfo; //defined cohort 
    totalProObjects;//Promis scores as objects for cohort
    totalDemoObjects;//demo for whole population
    totalCptObjects;//CPT as objects for defined cohort
    totalOsObjects;
    cohortIcdObjects;//ICD objects for cohort
    startDate;
  

    constructor() {
        /* 
        // GET THE GIVEN TABLE BY TABLE ID AS ARG
        */

        this.loadData('Demo_Revise').then((d)=> {
            let demoTable = d;
            this.mapDemoData(demoTable).then(value => {
                this.totalDemoObjects = value;
                events.fire('population demo loaded', value)});
        });

        this.loadData('CPT_codes').then((d)=>  this.getDataObjects('cpt_object', d).then(ob=> {
            this.totalCptObjects = ob;
            events.fire('create_button_down');
            events.fire('initial_cohort_load');
           // this.frequentSets(ob);
           // let cpt = this.getCPT(null, ob).then(d=> this.mapCPT(null, d).then(m=> this.frequentSets(m)));
        }));

        this.loadData('Total_Scores').then(d=>this.promisTable = d );

        this.attachListener();

    }

    
    private attachListener(){

        events.on('checkbox_hover', (evt, item)=> {//this is called when you click the checkboxes or hover
            let parent = item[0];
            let choice = item[1];
            let subFilter = this.totalDemoObjects.filter(d => d[parent] == choice);
           //gos right back to sidebar for the hover count
            events.fire('filter_counted', [this.totalDemoObjects.length, subFilter.length, parent]);
          });

        events.on('create_button_down', () => { // called in sidebar
    
                this.loadNewCohortData().then(data=> {
                    events.fire('new_cohort', data)});
          });
//this is for loading the data in don't delete this
       
        events.on('update_cohort_start', (evt, item)=> {
            let codes = item[0];
            let promis = item[1].chartData;
            let cpt = item[1].cpt;
            
            if(item[0] == null){
               this.getDays(promis, null).then(promisShifted=> {
                this.getBaselines(promisShifted).then(based=> {
                    this.updateCptDiff(codes[0], cpt, promisShifted).then(cptShifted=> {  
                        events.fire('min_day_calculated', [based, cptShifted, codes]);
                    });
                });
            });

            }else{
             
                this.searchByEvent(cpt, codes[0]).then((cptFiltered)=> {
                    let eventStartArray = cptFiltered;
                    this.addMinDay(promis, eventStartArray).then(co=> {
                        this.getDays(co, 'days').then(promisShifted=> {
                            this.getBaselines(promisShifted).then(based=> {
                                this.updateCptDiff(codes[0], cpt, promisShifted).then(cptShifted=> {
                                    events.fire('min_day_calculated', [based, cptShifted, codes]);
                                });
                            });
                        });
                    });
                });
            }
        });


        events.on('calc_bins', (evt, item)=> {
      
            if(item.layers){
                let layers = item.layers.map(l=> l.data);
                this.changeLayerData(layers).then(d=> {
                    console.log(d);
                    events.fire('bins_calculated', d)})
            }else{
                this.frequencyCalc(item).then(d=> events.fire('bins_calculated', d))
            }
          
        });

        events.on('filtering_Promis_count', (evt, item)=> {
            this.filterByPromisCount(item[0].promis, item[1]).then(d=> {
                events.fire('filtered_by_count', d);
            });
        });

         events.on('filter_data', (evt, item)=> {
            let cohort = item[0];
            let type = cohort.dataType;
             let promis = cohort.og[type];
       
             let cpt = cohort.cpt;
             let filters = item[1];

             if(filters[0].length > 1){
                let temp = [];
                filters.forEach(fil => {
                    if(fil.length > 1){
                        fil.forEach(f => { temp.push(f); });
                    }else{ temp.push(fil); }
                });
                filters = temp;
             }
             this.dataFilter(filters, this.totalDemoObjects, cpt, promis).then(ids=> {
      
                this.filterObjectByArray(ids, promis, 'promis').then(pro => {
                    this.filterObjectByArray(ids, cpt, 'cpt').then(cptFiltered => {
                        events.fire('promis_from_demo_refiltered', [filters, pro, cptFiltered, item[2]]);
                        events.fire('data_filtered', [filters, pro, cptFiltered, item[2]]);
                    });
                });
             });
        });

        events.on('selected_line_with_cpt', (evt, item)=> {
            this.filterObjectByArray(item[0], item[1], 'cpt').then((cpt)=> events.fire('chosen_pat_cpt', cpt));
         });

         //there are two of these you need to get rid of one

         events.on('change_sep_day', (evt, item)=> {
            let bool;
            console.log(item);
            let days = item;
            console.log(this.selected)
        
            this.getQuant_Separate(this.selected, 3, item.scaleR, days).then(sep=> {
                events.fire('separated_by_quant', [sep, days]);
            });

         })
 
        events.on('separate_cohort_agg', (evt, item)=> {
            let sepBool;
            if(item[1] == true){
                sepBool = true;
            }else{
                sepBool = false;
            }
            //YOU NEED TO CHANGE THIS TO WORK WITH SLIDER
            this.selected = item[0];
           this.frequencyCalc(this.selected).then(co=> { this.getQuant_Separate(co, 3, this.scoreChangeBool, 30).then(sep=> {
               this.selected = co;
                events.fire('separated_by_quant', [sep, 30]);
            })
        });
        });

        events.on('update_cpt_days', (evt, item)=>{
            this.updateCptDiff(this.targetOrder, item[0], null).then(cpt=> {
                events.fire('cpt_updated', cpt);
           });
        });

    }
    private async changeLayerData(layers) {
        let binned = await layers.map(d => {
                return this.frequencyCalc(d);
        });

       // return binned;
        return Promise.all(binned);
    }

    private async frequentSets(cpt) {
        console.log(cpt);
        let test = [];
        cpt.forEach(c=> {
          //  let array = []
            c.forEach(v => {
                test.push(v.value[0]);
            });
        });

        console.log(test);
    }
   
    //loads, maps and calculates the day differences for cpt, promis and oswestry index.
    private async loadNewCohortData(){
        let promis =  await this.loadPromisData(this.promisTable, 1123);
        let ids = promis.map(p=> +p.key);
        let cpt = await this.getCPT(ids, this.totalCptObjects).then(d=> this.mapCPT(promis, d));
        let basedPromis = await this.getDays(promis, null).then(promisShifted=>  this.getBaselines(promisShifted));
        let oswestry = await this.loadPromisData(this.promisTable, 3).then(d=> this.getDays(d, null).then(shift=> this.getBaselines(shift)));
        return [basedPromis, cpt, oswestry];
    }
    //takes table information and filters table. Loads objects and maps promis to key value pairs
    private async loadPromisData(table, formID){
        let promis;
        await this.loadPromisObjects(table, formID).then(ob=> (this.mapPromisScores(null, ob, formID).then(prom=> promis = prom)));
        return promis;
    }
    private async loadPromisObjects(dataTable: ITable, formID: any){
        let formNum: INumericalVector;
        dataTable.cols().forEach((vector: IAnyVector) => {
          if (vector.desc.name === 'FORM_ID') {
            formNum = <INumericalVector>vector;
          }
        });
        const albumData = await formNum.data();
        const indices = argFilter(albumData, (d) => d == formID);
        const promis = list(indices).filter(await dataTable.objects());
        const newPro = JSON.parse(JSON.stringify(promis));
        return newPro;
    }
    private async addMinDay(patients, eventArray) {
        
        let eventIds = eventArray.map(e=> e[0].key);
       
        let cohort = patients.map((p, i)=> {
            let index = eventIds.indexOf(p.key);
            if(eventArray[index].length > 1){
                let minDiff = eventArray[index][0].diff;
                let minTime = eventArray[index][0];
                p.cptTimeArray = eventArray[index];
                eventArray[index].forEach(e=> {
                        let diff = e.diff;
                        if(Math.abs(diff)< Math.abs(minDiff)){ minTime = e }
                    });
                p.CPTtime = minTime.time;
            }else{
                let minDiff = eventArray[index][0].diff;
                let minTime = eventArray[index][0];
                p.CPTtime = eventArray[index][0].time;
            }
            return p;
        });

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
    private async dataFilter(filters, demoObjects, CPT, promis) {
        let demo = JSON.parse(JSON.stringify(demoObjects));
        let cpt = JSON.parse(JSON.stringify(CPT));
        let cohortIds;
        let that = this;
        filters = filters.filter(fil=> fil.type != 'Start' && fil.filter != undefined);
        //use map to loop through each filter, changing demo value;
        let test = await filters.map(d=> {
            if(d.type == 'CPT'){
                that.searchByEvent(cpt, d.value).then((c)=> {
               
                    let ids = c.map(id=> id[0].key);
                    demo = demo.filter(dem=> ids.indexOf(dem.ID) > -1);
                    return demo;
                });
            }else if(d.type == 'X-CPT'){
                that.searchByEvent(cpt, d.value).then((c)=> {
                    let ids = c.map(id=> id[0].key);
                    demo = demo.filter(dem=> ids.indexOf(dem.ID) == -1);
                    console.log(demo);
                    console.log("ANTI FILTER");
                    return demo;
                });
            }else if(d.type == 'Demographic'){
                if(d.filter === 'BMI' || d.filter === 'CCI' || d.filter === 'AGE'){
                    demo = demo.filter(f => { return +f[d.filter] > +d.value[0] && +f[d.filter] < +d.value[1] });
                    return demo;
                }else{
                    if (String(d.filter) === 'DM_CODE') { 
                        demo = demo.filter(dm => dm[d.filter] == d.value || dm[d.filter] == d.value + 3);
                    }else{
                        demo = demo.filter(de=> {
                            if(d.value.indexOf(de[d.filter]) > -1){ return de; }
                        });
                        return demo;
                    }
                }
            }else{
                let ids = demo.map(dem=> dem.ID);
                promis = promis.filter(p=> ids.indexOf(p.key) > -1 && p.value.length > d.value );
                let pIndex = promis.map(p=> p.key);
                demo = demo.filter(f=> pIndex.indexOf(f.ID) > -1);
            }
            return demo;
        });
        cohortIds = demo.map(id=> id.ID);
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

    }
    private async frequencyCalc(cohort) {
        //item.promisSep[0], 'top', this.selectedNode, item
         // creates bin array for each patient scores and calulates slope for each bin
        //TODO : get rid of test in name and global variables?
            let scaleRelative = cohort.scaleR;
    
            let cohortFiltered = cohort.chartData.filter(d=> d.value.length > 1);
            let negdiff = 0;
            let posdiff = 0;
    
            //get the extreme diff values for each side of the zero event
            cohortFiltered.forEach(pat => {
                let patZero = pat.value.filter(p=> p.diff == 0);
                let patDiffArray = pat.value.map(d=> +d.diff);
         
                let patneg = d3.min(patDiffArray);
                let patpos = d3.max(patDiffArray);
                if(patneg < negdiff) {negdiff = patneg;  };
                if(patpos > posdiff) {posdiff = patpos;  };
            });
           
            negdiff = Math.round(negdiff / 10) * 10;
            posdiff = Math.round(posdiff / 10) * 10;
    
            //get diff of days between maxneg diff and maxpos diff
            let daydiff = posdiff - negdiff;
    
            let bincount = Math.floor(daydiff/10);
    
            await cohortFiltered.forEach(pat=> {
    
                for (let i = 1; i < pat.value.length; i++) {
    
                    if(pat.value[i] != undefined) {
                            
                            let x1 = pat.value[i-1].diff;
                            let x2 = pat.value[i].diff;
                            let y1;
                            let y2;

                            y1 = pat.value[i-1].SCORE;
                            y2 = pat.value[i].SCORE;

                            pat.value[i].calc = [[x1, y1],[x2, y2]];
                            let slope = (y2 - y1) / (x2 - x1);
    
                            pat.value[i].slope = slope;
                            pat.value[i].b = y1 - (slope * x1);

                    }
                }
    
                pat.bins = [];
    
                pat.bins.push({'x': negdiff, 'y': null});
                for (let i = 1; i < bincount; i++) {
                   let diffplus = negdiff + (i * 10);
                   pat.bins.push({'x': diffplus, 'y': null});
                }
                
                let patstart = pat.value[0].diff;
                patstart = Math.ceil(patstart / 10)* 10;
                let patend = pat.value[pat.value.length-1].diff;
                patend = Math.ceil(patend/10)* 10;
              
                let first = pat.bins.find((v)=> v.x == patstart);
                let last = pat.bins.find((v)=> v.x == patend);
    
                if(first != undefined){
                    const startIndex = pat.bins.indexOf(first);
                    first.y = pat.value[0].SCORE;
/*
                    if(scaleRelative){ first.y = pat.value[0].relScore; }else{ first.y = pat.value[0].SCORE; }
*/
                }
    
                if(last != undefined){
                    last.y = pat.value[pat.value.length-1].SCORE;
                  //  if(scaleRelative){  last.y = pat.value[pat.value.length-1].relScore; }else{  last.y = pat.value[pat.value.length-1].SCORE; }
                    }
    
                for(let i = pat.bins.indexOf(first); i < pat.bins.indexOf(last); i ++){
                    let x = pat.bins[i].x;
                    pat.bins[i].topvalue = pat.value.find((v)=> v.diff > pat.bins[i].x);
                    let top = pat.value.find((v)=> v.diff > x);
                    if(top != undefined){ pat.bins[i].y = (top.slope * x) + top.b; };
                }
            });
          
            return cohortFiltered;
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
                        minDate = new Date(g.CPTtime);
                        //minDate = this.parseTime(g.CPTtime, null);
                    }else minDate = g.min_date;
         
                //these have already been parsed
                let maxDate = g.max_date;
                            g.value.forEach((d) => {
                            try {
                           // d.diff = Math.ceil((this.parseTime(d['ASSESSMENT_START_DTM'], null).getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
                            d.diff = Math.ceil((new Date(d['ASSESSMENT_START_DTM']).getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
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
    private async getQuant_Separate(cohort, binNum, relativeChange, dayRange) {
  
        let arrayofArrays = [];

        let binTest = cohort.map(c=> {
            let bin = c.bins.map(b=> { return { x: b.x, y: b.y, b:c.b, key: c.key} })
            return bin });

        let diffArr = binTest.map(bin => {
            return bin.filter(b=> b.x > -1 && b.x < dayRange);
            //if(diffs.every(d=> d.y == null) == false){return diffs}
            });

        diffArr = diffArr.filter(d=> d.every(f=> f.y == null) == false);

        let avDiff;

    if(relativeChange == true){
        avDiff = diffArr.map(arr=> {
            arr = arr.map(d=> {
             return { x: d.x, y: +d.y - +d.b, key: d.key}
            });
            return arr;
        });
    }else{
        avDiff = diffArr.map(arr=> {
            arr = arr.map(d=> {
             return { x: d.x, y: +d.y, key: d.key}
            });
            return arr;
        });
    }
      
       let avs = avDiff.map(av=> { 
           let test = av.map(t=> t.y);
           let score = test.reduce((a, b) => a + b) / av.length;
           return {average: score, key: av[0].key };
        });
        
/*
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
         *
             let thresholdArray = Array.from(new Set(avsArray));
     */
             let avsArray = avs.map(d=> d.average);
             avsArray = avsArray.sort((a,b)=> a-b);
             console.log(avsArray.length)
            
             let thresholdArray = Array.from(new Set(avsArray));
             console.log(thresholdArray);

             let num = Math.floor(thresholdArray.length / binNum);
     
             let thresholds = [];
     
             for(let i = 0; i < (binNum - 1); i++){
               thresholds.push(thresholdArray[num]);
               num = num + num;  }

            console.log(thresholds);

            for(let i = 0; i < binNum; i++){
                if(i == 0){ 
                    arrayofArrays.push(avs.filter(c=> c.average < thresholds[i]));
                }else if(i == (binNum - 1)) {
                    arrayofArrays.push(avs.filter(c=> c.average > thresholds[i-1]));
                }else {
                    arrayofArrays.push(avs.filter(c=> c.average < thresholds[i] && c.average > thresholds[i-1] ));
                }
            }

            console.log(arrayofArrays);

            let test = arrayofArrays.forEach(a=> {
                a.map(d=> {
                    let index = cohort.map(c=> c.key).indexOf(d.key);
                    d.values = cohort[index];
                    return d.values;
                });
                console.log(a);
            });
            
        return arrayofArrays.map(a=> a.map(d=> d.values));
    }
    public async mapDemoData(table) {

            let that = this;

            // I THINK THIS IS WHAT IS KILLING THE APP? MOST LIKELY THE OBJECTS LOADING
            let patID = (await table.colData('PAT_ID')).map(d => +d);
            let GENDER = (await table.colData('PAT_GENDER')).map(d => d);
            let MARITAL_STATUS = (await table.colData('PAT_MARITAL_STAT')).map(d => d);
            let TOBACCO = (await table.colData('TOBACCO_USER')).map(d => d);
            let ALCOHOL = (await table.colData('ALCOHOL_USER')).map(d => d);
            let DRUG_USER = (await table.colData('ILLICIT_DRUG_USER')).map(d => d);
            let RACE = (await table.colData('PAT_RACE')).map(d => d);
            let BMI = (await table.colData('BMI')).map(d => +d);
            let patDOB = (await table.colData('PAT_BIRTHDATE')).map(d => new Date(String(d)));
            let CCI = (await table.colData('CCI')).map(d => +d);
            let DM_CODE = (await table.colData('DM_CODE')).map(d => +d);
        
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

          //  this.totalDemoObjects = popdemo;
    
            return popdemo;
       }

    //uses Phovea to access PROMIS data and draw table for cohort
    private async mapPromisScores(cohortIdArray, proObjects, formID) {

        let proObjectsFiltered = proObjects.filter((d) => {
            return d['FORM_ID'] === formID;
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
                key: +d.key,
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
        }else{
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
          /**
     *
     * @param ordersInfo
     */
    //you need the promis objects and the cpt objects
    //you should only have to do this once??
    private async mapCPT(patProInfo, CPTobjects) {
       
        let minDate = new Date();
        let maxDate = this.parseTime(CPTobjects[0].value[0]['PROC_DTM'], null);

        if(patProInfo){

            for(let i= 0;  i< CPTobjects.length; i++) {
                let keycpt = CPTobjects[i].key;
                for(let j = 0; j < patProInfo.length; j++) {
                  let keypromis = patProInfo[j].key;
                  if(keycpt == keypromis) {
                    CPTobjects[i].minPromis = patProInfo[j].min_date;
                  }
                } 
              };

        }else{
            console.log(CPTobjects);
        }

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

            if(patProInfo){
                try {
                    d.diff = Math.ceil((this.parseTime(d['PROC_DTM'], null).getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
                    } catch (TypeError) {
                            console.log('error');
                            d.diff = -1;
                        }
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
      // events.fire(id, table);//sends the id string to the getDataObjects
       return table;
    }
    public async getDataObjects(id: string, table: ITable) {
        let object = await table.objects();
        let newOb = JSON.parse(JSON.stringify(object));
       // events.fire(id, object);
        return newOb;
    }

    //YOU NEED TO INTEGRATE THIS HERE AND REMOVE FROM QUERYBOX.TS
    private async searchByEvent(cohort, searchedCodes) {
        
        //change the code to a code array make it sequence specific
        let withQuery = [];
        let queryDate = [];
        cohort.forEach((pat) => {
            let events = [];
            let elementBool;
            pat.eventArray = [];
            pat.forEach((p) => {
                
                searchedCodes.forEach(v => {
                    if (p.value[0].includes(+v)){
                            events.push(p);
                            withQuery.push(p);
                            pat.eventArray.push(p);
                    }
                });
            });
        });
        let found = cohort.filter(d=> {
            return d.eventArray.length > 0;
        });
    
        return found.map(d=> d.eventArray);
    }
    private async updateCptDiff(code, patCPT, patPromis){

       if(code!= null){

        code = code.map(c => +c);
        let filArray = []
     
        if(patPromis != null){
           
            let promisID = patPromis.map(p=> p.key);
            let filteredCPT = patCPT.filter(cpt=> {
                return promisID.indexOf(cpt[0].key > -1);
            });

            let mapped = filteredCPT.map(cpt=> {
                let index = promisID.indexOf(cpt[0].key);
                cpt.time = patPromis[index].CPTtime;
                cpt.forEach(visit => {
                    visit.diff = Math.ceil((this.parseTime(visit.time, null) - this.parseTime(cpt.time, null)) / (1000 * 60 * 60 * 24));
                });
                return cpt;
            });

            patCPT = mapped;
            return mapped;
        }
       }else{
           let startDayArray = [];
           patPromis.forEach(pat => {
             
           });
           return patCPT;
       }
      
       
    }

  }

  export function create() {
    return new DataManager();
}

   

