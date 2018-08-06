/**
 * Created by Jen Rogers 07/20/2017.
 */

import * as ajax from 'phovea_core/src/ajax';
import {BaseType, select, selectAll, event} from 'd3-selection';
import {nest, values, keys, map, entries} from 'd3-collection'
import * as events from 'phovea_core/src/event';
import {scaleLinear, scaleTime, scaleOrdinal} from 'd3-scale';
import {timeParse} from 'd3-time-format';
import {extent, min, max, ascending} from 'd3-array';
//import {Constants} from './constants';
import {axisBottom, axisLeft} from 'd3-axis';
import {transition} from 'd3-transition';
import * as d3 from 'd3';

/*
This is for calculations that I do repeatedly that I don't want to keep typing
*/

export class dataCalc {

    startDate;
    private filteredOrders;

    constructor(parent: Element) {

       // this.filteredOrders = this.getTargetPatient();
    }

}

 /**
     * Used in calc for pat promis scores
     * @param pat
     * @returns {Date}
     */
    export function findMinDate(pat) {
       // console.log(pat);
        let timeArray = pat.map(p=> new Date(p['ASSESSMENT_START_DTM']));
        let minDate = min(timeArray);
        return minDate
    }

        /**
     * Used in calc for pat promis scores
     * @param pat
     * @returns {Date}
     */
    export function findMaxDate(pat) {
        let timeArray = pat.map(p=> new Date(p['ASSESSMENT_START_DTM']));
        let maxDate = max(timeArray);
        return maxDate
    }

     /**
     * Utility method
     * @param pat
     * @returns {Date}
     */
    export function findMinDateCPT(pat) {
               
        let minDate = new Date();
        for (let index = 0; index < pat.length; index++) {
            if (!pat[index]['PROC_DTM']) continue;
            if (this.parseTime(pat[index]['PROC_DTM'], null).getTime() < minDate.getTime())
                minDate = this.parseTime(pat[index]['PROC_DTM'], null)
        }
        return minDate
    }

    /**
    * Used in calc for pat promis scores
    * @param pat
    * @returns {Date}
    */
    export function findMaxDateCPT(pat) {

    let maxDate = this.parseTime(pat[0]['PROC_DTM'], null);

    for (let index = 0; index < pat.length; index++) {
        if (!pat[index]['PROC_DTM']) continue;
        if (this.parseTime(pat[index]['PROC_DTM'], null) > maxDate)
            maxDate = this.parseTime(pat[index]['PROC_DTM'], null)
    }
    
    return maxDate;
    
    }
    /**
     * filteres target patient orders into arrays 
     * @param ordersInfo
     */
    export function orderHierarchy(ordersInfo) {

    
      let filteredOrders = {
             procedureGroup : [],
             medicationGroup : [],
      }
      
        ordersInfo.forEach((d) => {
            
            if (d['ORDER_CATALOG_TYPE'] == 'PROCEDURE') {
                filteredOrders.procedureGroup.push(d);
               
            }else if(d['ORDER_CATALOG_TYPE'] == 'MEDICATION'){
                filteredOrders.medicationGroup.push(d);
               
            }else { console.log('type not found');  }
           
        });
        
       
        return filteredOrders;

    }


/**
     * parse time
     * @param date
     * @param nullDate
     * @returns {null}
     */
    export function parseTime(date, nullDate) {

        let parseT1 = timeParse('%x %X');
        let parseT2 = timeParse('%x');
        let time = nullDate;

        if (date) {
            if (date.split(' ').length > 1) {
                time = parseT1(date);
            }
            else
                time = parseT2(date)
        }
        //console.log(' :' + time);
        return time
    }
//get med and pro groups for target patient
        export function orderType(type) {
          
         let value = type;
    
        let dataset = 'selected';
   
        let targetOrder = value;
        const url = `/data_api/filteredOrderType/${dataset}/${targetOrder}`;
        // const url = `/data_api/filteredOrdersByMonth/${dataset}/${targetOrder}`;
         this.setBusy(true);
         this.getData(url).then((args) => {

        events.fire('find_order_type', [args]);
        this.setBusy(false);
        //console.log(args);
      
        events.fire('query_order_type', value);

      });
  }

/**
   * Draw the diagram with the given data from getSimilarRows
   * @param args
   */
  export function setOrderScale() {

 
    // find the max difference between the first patient visit and the last visit. 
    //This determines the domain scale of the graph.
    // ----- add diff days to the data

    let maxDiff = 0;

    let minPatDate = this.findMinDate(this.targetProInfo);
 
    this.startDate = "patient";
    events.fire('start_date_patient', minPatDate);

    //minPatDate is the first date of the target patient PROMIS records

    this.targetProInfo.forEach((d) => {
      d.diff = Math.ceil((this.parseTime(d['ASSESSMENT_START_DTM'], null).getTime() - minPatDate.getTime()) / (1000 * 60 * 60 * 24));
      maxDiff = d.diff > maxDiff ? d.diff : maxDiff
    });
    this.targetProInfo.sort((a, b) => ascending(a.diff, b.diff));

    const patData = this.targetProInfo.filter((d) => {
      return d['FORM'] == this.svg//changed to svg because I dont have a diagram
    });


    // -----  set domain for initial draw call
    this.timeScale.domain([-1, maxDiff]);
    if (this.timeScaleMini != null){
         this.timeScaleMini.domain([-1,maxDiff]);
    }

   
    events.on('brushed', (newMin, newMax) => {  // from brushed in rect exploration
    
   //------- set domain after brush event

    if (this.brush.move != null) {
      this.timeScale.domain([newMax[0], newMax[1]])
    }
    
    
    return this.timeScale.domain([newMax[0], newMax[1]]);
   
    });
    
    this.svg.select('.xAxis')
      .call(axisBottom(this.timeScale));

  }

  
//make this more generic
  export function reformatCPT(patProInfo, similarOrdersInfo) {

    let minDate = this.findMinDate(patProInfo);
              
    similarOrdersInfo.forEach((d) => {
        let time = this.parseTime(d['PROC_DTM'], minDate).getTime();
        d.diff = Math.ceil((time - minDate.getTime()) / (1000 * 60 * 60 * 24));
    });

    const self = this;

// ----- add diff days to the data

    let filteredOrders = [];
    similarOrdersInfo.forEach((g) => {

//g.array = [];

    if(g.value != null){
    let minDate = this.findMinDateCPT(g.value);
    }
    g.value.forEach((d) => {

    d.array = []; 
    d.time = d['PROC_DTM'];

    try {
        d.diff = Math.ceil((this.parseTime(d['PROC_DTM'], null).getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
     
      }
    catch (TypeError) {
        console.log('error');
        d.diff = -1;
    }
    if(d['CPT_1'] !== 0){ d.array.push(d['CPT_1']);   };
    if(d['CPT_2'] !== 0){ d.array.push(d['CPT_2'])    };
    if(d['CPT_3'] !== 0){ d.array.push(d['CPT_3'])    };
    if(d['CPT_4'] !== 0){ d.array.push(d['CPT_4'])    };
    if(d['CPT_5'] !== 0){ d.array.push(d['CPT_5'])    };
    if(d['CPT_6'] !== 0){ d.array.push(d['CPT_6'])    };
    if(d['CPT_7'] !== 0){ d.array.push(d['CPT_7'])    };
    if(d['CPT_5'] !== 0){ d.array.push(d['CPT_5'])    };
    if(d['CPT_6'] !== 0){ d.array.push(d['CPT_6'])    };
    if(d['CPT_7'] !== 0){ d.array.push(d['CPT_7'])    };
    //console.log(g.array);
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

events.fire('cpt_filtered', filteredOrders);
this.filteredCPT = filteredOrders;
select('#pat_cpt').selectAll('.patCPTRecord').remove();
this.drawOrders(filteredOrders);
this.drawMiniRects(this.targetProInfo, filteredOrders);

 }
//Draw the CPT rects for the patients. This takes the filtered CPT that has been formatted
export function drawOrders (filteredCPT) {


    let patGroups = this.svg.select('#pat_cpt')
    .selectAll('.patCPTRecord')
    .data(filteredCPT);
    //.data(similarOrdersInfo);

let patGroupEnter = patGroups
    .enter()
    //.append('g').attr('class', d=>d[0].key)//.attr('class', d=> d.key);
    .append('g').attr('class', 'patCPTRecord')

    patGroups = patGroupEnter.merge(patGroups);
    patGroups.exit().remove();

let patInnerGroup = patGroupEnter.append('g')
    .classed('patInnerGroup', true)
   // .attr('transform', 'translate(60, 0)');

 let rectGroup = patGroups.select('.patInnerGroup')
    .selectAll('.visitDays')
    .data(d => d)     

let rectGroupEnter = rectGroup
    .enter()
    .append('g')

rectGroup = rectGroupEnter.merge(rectGroup);

rectGroup.exit().remove();

rectGroup.classed('visitDays', true)
 .attr('transform', (d) => `translate(`+ this.timeScale(d.diff) +`,0)`);

let rects = rectGroup.selectAll('rect')
      .data(d => d.value[0]);

let rectsEnter = rects
      .enter()
      .append('rect')
      .attr('class', d => d);

rects = rectsEnter.merge(rects);

rects.exit().remove();

rects
      .attr('y', 0)
      .attr('width', this.orderBar.width)
      .attr('height', this.orderBar.height)
   
   .on("mouseover", (d) => {
        let t = transition('t').duration(500);
        select(".tooltip")
            .html(() => {
                return this.renderOrdersTooltip(d);
            })
            .transition(t)
            .style("opacity", 1)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY + 10}px`);
    })
    .on("mouseout", () => {
        let t = transition('t').duration(500);
        select(".tooltip").transition(t)
            .style("opacity", 0);
    })
    .on('click', function (d) {
     
      let parentData = select(this.parentNode).data;
 
    });

  // fix height of the svg
  this.svg
     .attr('height', this.rectBoxDimension.height + 50 + ((this.orderBar.height + 5) * filteredCPT.length));
}

  export function getClassAssignment (attString) {
      //this uses a work around to use a function with classed. As well it preserves the already assinged classes
        
        return function (d) { 
          let element = select(this);
          element.classed (d[attString], true);
          return element.attr('class');
        }

        
  }
