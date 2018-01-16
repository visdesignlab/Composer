/**
 * Created by Jen on 1/12/17.
 */

import * as ajax from 'phovea_core/src/ajax';
import * as d3 from 'd3';
import * as json from 'json-stringify-safe';
//import * as fs from 'graceful-fs';
import {BaseType, select, selectAll, event} from 'd3-selection';
import {nest, values, keys, map, entries} from 'd3-collection';
import * as events from 'phovea_core/src/event';
import {scaleLinear, scaleTime, scaleOrdinal} from 'd3-scale';
import {line, curveMonotoneX} from 'd3-shape';
import {timeParse} from 'd3-time-format';
import {extent, min, max, ascending, histogram, mean, deviation} from 'd3-array';
import {axisBottom, axisLeft} from 'd3-axis';
import {drag} from 'd3-drag';
import { format } from 'd3-format';
import {transition} from 'd3-transition';
import * as distributionDiagram from './distributionDiagram';
import {ITable, asTable} from 'phovea_core/src/table';
import {IAnyVector} from 'phovea_core/src/vector';
import {list as listData, getFirstByName, get as getById} from 'phovea_core/src/data';
import { writeJson } from 'fs-extra';
import * as dataCalculations from './dataCalculations';
import * as similarityScoreDiagram from './similarityScoreDiagram';
import { dataCalc } from './dataCalculations';

export class populationStat {

    private $node;
    private icdObjects;
    private cptObjects;
    private populationDemo;
    private populationPromis;
    private parseTime = dataCalculations.parseTime;
    private findMinDate = dataCalculations.findMinDate;
    private findMaxDate = dataCalculations.findMaxDate;

    constructor(parent: Element) {

        this.$node = select(parent);

        this.$node.append('div').classed('pop_count', true).append('text').text('number of patients:   ');

        const dgmPromisPhysicalDiv = this.$node.append('Div').classed('allDiagramDiv', true);
        similarityScoreDiagram.create(dgmPromisPhysicalDiv.node(), 'PROMIS Bank v1.2 - Physical Function');

        const distributions = this.$node.append('div').classed('distributions', true);
        distributionDiagram.create(distributions.node());

        this.attachListener();
        


    }

    private attachListener() {  

        events.on('population demo loaded', (evt, item)=> {
           // console.log(item);
            this.populationDemo = item;
            this.showStats();
        });
        events.on('pro_object', (evt, item)=> {
            this.populationPromis = item;
            this.promisReformat(item);
        });
    }

    private showStats () {
        let popCount = this.populationDemo.length;
        this.$node.select('.pop_count').append('text').text(this.populationDemo.length);
        
    }

    private promisReformat (promis) {

        let PROMIS = promis.filter((d) => {
           return d['FORM'] == 'PROMIS Bank v1.2 - Physical Function'
          });

        let filteredPatOrders = {};

        PROMIS.forEach((d) => {
            let maxDiff = 0;
           // console.log(d);
            
             if (filteredPatOrders[d.PAT_ID] === undefined) {
            filteredPatOrders[d.PAT_ID] = [];
          }
            filteredPatOrders[d.PAT_ID].push(d);
            
          });

          let mapped = entries(filteredPatOrders);
          //return filteredPatOrders; 
          let patPromis = mapped.map(d=> {
              return {
                key: d.key,
                value: d.value,
                min_date: this.findMinDate(d.value),
                max_date: this.findMaxDate(d.value),
              }
         });

          console.log(patPromis);
          events.fire('gotPromisScore', patPromis);
    }

    private async loadICDSet () {

        let ch1 = []; //Certain infectious and parasitic diseases
        let ch2 = []; //neoplasms
        let ch3 = []; //Diseases of the blood and blood-forming organs and certain disorders involving the immune mechanism
        let ch4 = []; //Endocrine, nutritional and metabolic diseases
        let ch5 = []; //Mental and behavioural disorders
        let ch6 = []; //Diseases of the nervous system
        let ch7 = []; //Diseases of the eye and adnexa
        let ch8 = []; //Diseases of the ear and mastoid process
        let ch9 = []; //Diseases of the circulatory system
        let ch10 = []; //Diseases of the respiratory system
        let ch11 = []; //digestive
        let ch12 = []; //Diseases of the skin and subcutaneous tissue
        let ch13 = []; //Diseases of the musculoskeletal system and connective tissue
        let ch14 = []; //Diseases of the genitourinary system
        let ch15 = []; //Pregnancy, childbirth and the puerperium
        let ch16 = []; //Certain conditions originating in the perinatal period
        let ch17 = []; //Congenital malformations, deformations and chromosomal abnormalities
        let ch18 = []; //Symptoms, signs and abnormal clinical and laboratory findings, not elsewhere classified
        let ch19 = []; //Injury, poisoning and certain other consequences of external causes
        let ch20 = []; //External causes of morbidity and mortality
        let ch21 = []; //Factors influencing health status and contact with health services
        let ch22 = []; //Codes for special purposes

        let table = <ITable> await getById('icd_set');
        let ICD = await table.col(0).data();
        ICD.forEach(element => {
            if(element[0] == 'A' || element[0] == 'B')ch1.push(element);
            if (element[0] == 'C')ch2.push(element);
            if(element[0] == 'D'){
               // console.log(element + " "+ element[1]);
                if(element[1] == ('0' || '1' || '2' || '3' || '4')){ch2.push(element);}
                if(element[1] == '5' || '6' || '7' || '8'){ch3.push(element);}
            }
            if(element[0] == 'E')ch4.push(element);
            if(element[0] == 'F')ch5.push(element);
            if(element[0] == 'G')ch6.push(element);
            if(element[0] == 'H'){
                if(element[1] == ('0' || '1' || '2' || '3' || '4' || '5'))ch7.push(element);
                if(element[1] == ('6' || '7' || '8'))ch8.push(element);
            }
            if(element[0] == 'I')ch9.push(element);
            if(element[0] == 'J')ch10.push(element);
            if(element[0] == 'K')ch11.push(element);
            if(element[0] == 'L')ch12.push(element);
            if(element[0] == 'M')ch13.push(element);
            if(element[0] == 'N')ch14.push(element);
            if(element[0] == 'O')ch15.push(element);
            if(element[0] == 'P')ch16.push(element);
            if(element[0] == 'Q')ch17.push(element);
            if(element[0] == 'R')ch18.push(element);
            if(element[0] == ('S' || 'T'))ch19.push(element);
            if(element[0] == ('v' || 'w' || 'X' || 'Y'))ch20.push(element);
            if(element[0] == 'Z')ch21.push(element);
            if(element[0] == 'U')ch22.push(element);
            if(element[0] == 0)console.log(element);

        });
        let icd_obj = {

            'ch1' : ch1,
            'ch2' : ch2,
            'ch3' : ch3,
            'ch4' : ch4,
            'ch5' : ch5,
            'ch6' : ch6,
            'ch7' : ch7,
            'ch8' : ch8,
            'ch9' : ch9,
            'ch10' : ch10,
            'ch11' : ch11,
            'ch12' : ch12,
            'ch13' : ch13,
            'ch14' : ch14,
            'ch15' : ch15,
            'ch16' : ch16,
            'ch17' : ch17,
            'ch18' : ch18,
            'ch19' : ch19,
            'ch20' : ch20,
            'ch21' : ch21,
            'ch22' : ch22
          
        };

    
   //writeJson('test', icd_obj);

   

}}

export function create(parent: Element) {
    return new populationStat(parent);
}