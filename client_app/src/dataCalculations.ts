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
import {Constants} from './constants';
import {axisBottom, axisLeft} from 'd3-axis';
import {transition} from 'd3-transition';
import * as d3 from 'd3';

export class dataCalc {


    private filteredOrders;
  

    constructor(parent: Element) {

        this.filteredOrders = this.getTargetPatient();
    }

     private getTargetPatient () {
     // item: pat_id, number of similar patients, DATA

    events.on('update_similar', (evt, item) => { // called in queryBox

      // this.targetPatientProInfo = item[2]['pat_PRO'][item[0]].slice();
     //  this.similarPatientsProInfo = entries(item[2]['similar_PRO']);
       this.filteredOrders = item[1]['Orders'][item[0]];

    });

    // item: pat_id, DATA
    events.on('update_all_info', (evt, item) => {  // called in query box
    
     //  this.targetPatientProInfo = item[2]['pat_PRO'][item[0]].slice();
      // this.similarPatientsProInfo = entries(item[2]['similar_PRO']);
       this.filteredOrders = item[1]['Orders'][item[0]];
    
  });

    console.log('orders have changed');
    return this.filteredOrders;
  
}
}

 /**
     * Utility method
     * @param pat
     * @returns {Date}
     */
    export function findMinDate(pat) {

        let minDate = new Date();
        for (let index = 0; index < pat.length; index++) {
            if (!pat[index]['ASSESSMENT_START_DTM']) continue;
            if (this.parseTime(pat[index]['ASSESSMENT_START_DTM'], null) < minDate)
                minDate = this.parseTime(pat[index]['ASSESSMENT_START_DTM'], null)
        }
        return minDate
    }

    /**
     * filteres target patient orders into arrays 
     * @param ordersInfo
     */
    export function orderHierarchy(ordersInfo) {

      //  let minDate = this.findMinDate(this.targetPatientProInfo);
      let filteredOrders = {
             procedureGroup : [],
             medicationGroup : [],
      }
      
        ordersInfo.forEach((d) => {
            
            if (d['ORDER_CATALOG_TYPE'] == 'PROCEDURE') {
                filteredOrders.procedureGroup.push(d);
                //console.log('pro added');
            }else if(d['ORDER_CATALOG_TYPE'] == 'MEDICATION'){
                filteredOrders.medicationGroup.push(d);
                //console.log(d['PRIMARY_MNEMONIC']);
            }else { console.log('type not found');  }
           
        });
        
       // console.log("number of procedures" + filteredOrders.procedureGroup.length);
       // console.log("number of medications" + filteredOrders.medicationGroup.length);
        return filteredOrders;
        /*
         this.svg.select('#pat_orders')
         .append('text')
         .text('Procedure Orders for patient:   ' + procedureGroup.length)
         .attr('transform', 'translate(450, 100)');
          this.svg.select('#pat_orders')
         .append('text')
         .text('Procedure Orders for patient:   ' + medicationGroup.length)
         .attr('transform', 'translate(450, 120)');
        */
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
        return time
    }
//get med and pro groups for target patient
        export function orderType(type) {
          
       const value = type;
    
      console.log(value);

      let dataset = 'selected';
   
      let targetOrder = value;
      const url = `/data_api/filteredOrderType/${dataset}/${targetOrder}`;
     // const url = `/data_api/filteredOrdersByMonth/${dataset}/${targetOrder}`;
      this.setBusy(true);
      this.getData(url).then((args) => {

        events.fire('find_order_type', [args]);
        this.setBusy(false);
        console.log(args);
      
        events.fire('query_order_type', value);
        //this.drawPatOrderRects(this.targetPatientOrders);
       // this.loadDataFromServer();
        
      });
  }

/**
   * Draw the diagram with the given data from getSimilarRows
   * @param args
   */
  export function setOrderScale() {
    // find the max difference between the first patient visit and the last visit. This determines the domain scale of the graph.
    // ----- add diff days to the data

    let maxDiff = 0;

    let minPatDate = this.findMinDate(this.targetPatientProInfo);
    this.targetPatientProInfo.forEach((d) => {
      d.diff = Math.ceil((this.parseTime(d['ASSESSMENT_START_DTM'], null).getTime() - minPatDate.getTime()) / (1000 * 60 * 60 * 24));
      maxDiff = d.diff > maxDiff ? d.diff : maxDiff
    });
    this.targetPatientProInfo.sort((a, b) => ascending(a.diff, b.diff));

    const patData = this.targetPatientProInfo.filter((d) => {
      return d['FORM'] == this.svg//changed to svg because I dont have a diagram
    });


    // -----  set domain for initial draw call
    this.timeScale.domain([-1, maxDiff]);
    if (this.timeScaleMini != null){
         this.timeScaleMini.domain([-1,maxDiff]);
    }
   
    

    events.on('brushed', (newMin, newMax) => {  // from brushed in rect exploration
    
   //------- set domain after brush event
    console.log(newMax[1]);
    if (this.brush.move != null) {
      this.timeScale.domain([newMax[0], newMax[1]])
    }
    
    
    return this.timeScale.domain([newMax[0], newMax[1]]);
   
    });
    
    this.svg.select('.xAxis')
      .call(axisBottom(this.timeScale));
  }


  /**
   *
   * @param ordersInfo
   */

  export function drawPatOrderRects(ordersInfo) {

     ordersInfo = this.targetPatientOrders;
     // let ordersInfo = this.targetPatientProInfo; why is this not determining the date??
      let minDate = this.findMinDate(this.targetPatientProInfo);
  
         ordersInfo.forEach((d) => {
        let time = this.parseTime(d['ORDER_DTM'], minDate).getTime();
        d.diff = Math.ceil((time - minDate.getTime()) / (1000 * 60 * 60 * 24));
      });
 

      const self = this;

      events.on ('query_order', event => {
          this.currentlySelectedName = event.args[0];
         // console.log(event);
      });


      let orderRect = this.svg.select('#pat_rect_line')
      // let orderRect = this.svg.append('g').attr('class', 'pat_rect_line ')
    // .attr('transform', (d, i) => 'translate(0, ' + (i * 100) + ')')

     
      .selectAll('.orderRect')
      .data([ordersInfo]);
      let orderRectEnter = orderRect.enter()
      .append('g')
      .classed('orderRect', true);
      orderRect = orderRectEnter.merge(orderRect);

      let rects = orderRect.selectAll('rect')
      .data((d) => d);
      let rectsEnter = rects.enter()
      .append('rect');
      rects = rectsEnter.merge(rects);
      rects.attr('class', this.getClassAssignment('ORDER_CATALOG_TYPE'))
      .attr('class', this.getClassAssignment('ORDER_STATUS'))
      .attr('x', (g) => this.timeScale(g.diff))
      .attr('y', 0)
      .attr('width', this.orderBar.width)
      .attr('height', this.orderBar.height)
     
      //this is the mousclick event that greys rects
      .on('click', this.assignCurrentName.bind(this))//end the mousclick event that shows the graph
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
      });
      
      
      d3.selectAll('.MEDICATION, .PROCEDURE')
      .classed('selectedOrder', d =>  d.PRIMARY_MNEMONIC == this.currentlySelectedName)
      .classed('unselectedOrder', d => this.currentlySelectedName !== undefined && d.PRIMARY_MNEMONIC !== this.currentlySelectedName);
      
       this.svg.select('.xAxis')
      .call(axisBottom(this.timeScale))


  }

  export function getClassAssignment (attString) {
      //this uses a work around to use a function with classed. As well it preserves the already assinged classes
        
        return function (d) { 
          let element = select(this);
          element.classed (d[attString], true);
          return element.attr('class');
        }
  }
/*
  export async function loadDataFromServer() {

    console.log('Loading Data from the a Server');
    // listData() returns a list of all datasets loaded by the server
    // notice the await keyword - you'll see an explanation below
    const allDatasets = await listData();
    //console.log('All loaded datasets:');
    console.log(allDatasets);
     // we could use those dataset to filter them based on their description and pick the one(s) we're interested in
    // here we pick the first dataset and cast it to ITable - by default the datasets are returned as IDataType
    let tempTable: ITable;
    let orderArray = [];
    // retrieving a dataset by name. Note that only the first dataset will be returned.
    tempTable = <ITable> await getById('Orders');
   
    let tempVector = await tempTable.cols()[5].data();
    console.log(tempVector);

  }*/
