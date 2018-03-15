/**
 * Created by Jen Rogers on 7/21/17.
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

import * as dataCalc from './dataCalculations';
import {transition} from 'd3-transition';
import {brush, brushY, brushX} from 'd3-brush';
import * as similarityScore  from './similarityScoreDiagram';
import * as d3 from 'd3';

import {list as listData, getFirstByName, get as getById} from 'phovea_core/src/data';

import {tsv} from 'd3-request';

import {argFilter} from 'phovea_core/src/';
import { fillWithNone } from 'phovea_core/src/idtype/IIDType';


export class rectExploration {

  private $node;
  private timeScale;
  private timeScaleMini;
 
  private svg;

  private targetProInfo;
  private targetOrders;
  private targetCPT;

  private brush;
 
  private currentlySelectedName;
 
  private selectedOrder;
  private orderLabel;
  private selectedTargetPatOrderCount;
  private selectedSimilarOrderCount;

  private cohortProInfo;
 
  private findMinDate = dataCalc.findMinDate;//function for calculating the minDate for given patient record
  private findMinDateCPT = dataCalc.findMinDateCPT;
  private parseTime = dataCalc.parseTime;
  private setOrderScale = dataCalc.setOrderScale;
  private getClassAssignment = dataCalc.getClassAssignment;
  //private drawPatOrderRects = dataCalc.drawPatOrderRects;
  private reformatCPT = dataCalc.reformatCPT;
  private drawOrders = dataCalc.drawOrders;
  private orderType = dataCalc.orderType;

  private filteredCPT;

  private queryBool;
  queryDataArray;

  rectBoxDimension = {width: 1100, height: 90 };
  orderBar = {width: 10, height: 60 };
  similarBar = {width: 8, height: 30 };
  margin = {top: 20, right: 10, bottom: 10, left: 10};
  contextDimension = {width: this.rectBoxDimension.width, height:55};
  private patOrderGroup;

  constructor(parent: Element) {

    this.$node = select(parent)
        .append('div')
        .classed('rectDiv', true).attr('height', 700);
    
    this.svg = this.$node.append('svg')
        .attr('width', this.rectBoxDimension.width)
        .attr('height', this.rectBoxDimension.height*1.5)
    
    this.timeScale = scaleLinear()
        .range([0, this.rectBoxDimension.width])
        .clamp(true);

    this.timeScaleMini = scaleLinear()
        .range([0, this.contextDimension.width])
        .clamp(true);
  

     // axis
     this.svg.append('g')
      .attr('class', 'xAxis')
      .attr('transform', `translate(${this.margin.left},${this.rectBoxDimension.height- 10})`);

    //append patient order svg group
   this.svg.append('g')
      .attr('id', 'pat_cpt')
       .attr('transform', `translate(${this.margin.left},${this.margin.top})`); 
  //this.patOrderGroup = this.svg.select('#similar_cpt')

   let context = this.svg.append('g')
            .attr('class', 'context')
            .attr('width', this.contextDimension.width)
            .attr('height', this.contextDimension.height)
            .attr('transform', `translate(${this.margin.left},${this.rectBoxDimension.height + this.margin.top})`)
            .on("click", () => {
              if(event.selection != null) {
                this.setOrderScale();
              }
            });

      this.brush = brushX()
      .extent([[0, -.50], [this.contextDimension.width, this.contextDimension.height- 30]])
      .handleSize(0)
      .on("end", () => {
        if (event.selection === null) {
          this.setOrderScale();
         
        } else {
          let start = event.selection[0];
          let end = event.selection[1];
          this.timeScale.domain([start, end]);
      
          this.svg.select('.context')
          .append('g')
          .attr('class', '.xAxisMini')
          .attr('transform', () => `translate(0,${this.contextDimension.height- 30})`)
          .call(axisBottom(this.timeScaleMini));
        }
        this.drawPatOrderRects(this.targetOrders, this.targetProInfo);
       // this.reformatCPT(this.targetCPT)
        this.drawMiniRects(this.targetProInfo, this.targetCPT);
      });
    
    context.append('g')
    .attr('class', 'brush')
    .call(this.brush);
    
    
  this.attachListener();
  this.drawCheckboxes();
  this.drawQueryBox();
      }
  
 
  /**
   * Attach listeners
   */
  
  private attachListener() {

/*
    events.on('target_updated', (evt, item) => {
        
        this.targetCPT = item[0];
        this.targetProInfo = item[1];
     
        this.setOrderScale();
       // this.drawPatOrderRects(item[0], item[1]);
        this.reformatCPT(this.targetProInfo, this.targetCPT);
    });*/

    events.on('show_cpt', (evt)=> {
      this.queryBool = 'cpt';
    });

    events.on('show_orders', (evt)=> {
      this.queryBool = 'order';
    });

    events.on('cpt_filtered', (evt, item)=>{
    
      this.filteredCPT = item;
    })


  }

 private drawPatOrderRects(ordersInfo, targetProInfo) {

     let timeType = 'PROC_DTM';

     let minDate = this.findMinDate(targetProInfo);
 
        ordersInfo.forEach((d) => {
       let time = this.parseTime(d['ORDER_DTM'], minDate).getTime();
       d.diff = Math.ceil((time - minDate.getTime()) / (1000 * 60 * 60 * 24));
     });

     const self = this;

     events.on ('query_order', event => {
         this.currentlySelectedName = event.args[0];
      
     });

     let orderRect = this.svg.select('#pat_rect_line')
     .selectAll('.orderRect')
     .data([ordersInfo]);

     orderRect.exit().remove();

     let orderRectEnter = orderRect.enter()
     .append('g')
     .classed('orderRect', true);
     
     orderRect = orderRectEnter.merge(orderRect);

     let rects = orderRect.selectAll('rect')
     .data((d) => d);

     rects.exit().remove();

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
     .on('click', (d)=> {
         this.assignCurrentName.bind(this);
         console.log(d.ORDER_DTM);
         events.fire('date clicked', d.ORDER_DTM);
       })//end the mousclick event that shows the graph
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

    /**
     * firing event to update the vis for info of a patient
     */
    private queryOrder() {

      let withQuery = [];
          
      if (this.currentlySelectedName != undefined ){
        this.currentlySelectedName = undefined;
      }

      const value = (<HTMLInputElement>document.getElementById('order_search')).value;
    
      if (this.queryBool == "order"){
       
        let dataset = 'selected';
        let targetOrder = value;
        const url = `/data_api/filteredOrdersByMonth/${dataset}/${targetOrder}`;
        this.setBusy(true);
        this.getData(url).then((args) => {
  
          events.fire('find_orders', [args]);
          this.setBusy(false);
         
        
          events.fire('query_order', value);
          this.drawPatOrderRects(this.targetOrders, this.targetProInfo);
         // this.loadDataFromServer();
          
        });

      }

      if (this.queryBool == "cpt"){

      
          let dataset = 'selected';
          let targetOrder = value;
          
         let rects = selectAll('.visitDays').selectAll('rect');
   
         events.fire('query_order', value);

         let selectedRects = rects.nodes();
         let selected =  <any>( <any>selectedRects );
         let parentElem;
         selected.forEach(node=> {
          node.classList.remove('selectedOrder', 'unselectedOrder');

          if(node.classList.contains(value)){
         
            node.classList.add('selectedOrder');
            let parent = node.parentNode.parentNode.parentNode;

          if(parentElem != parent){
             withQuery.push(parent.__data__);
             parentElem = parent;
      
          };

          }else{node.classList.add('unselectedOrder');}
          });

       
  }

  this.queryDataArray = withQuery;
  
}
  
  private drawMiniRects(promis, orders) {

      let test = 'CPT';

      let minDate;

      if (test == 'CPT') minDate = this.findMinDateCPT(promis);
        
      if(test == 'Order') minDate = this.findMinDate(promis);

      orders.forEach((d) => {
        let time = this.parseTime(d['PROC_DTM'], minDate).getTime();//changed this to cpt date but should be flexible
        d.diff = Math.ceil((time - minDate.getTime()) / (1000 * 60 * 60 * 24));
      }); 

     this.svg.select('.context')
     .selectAll('.orderRectMini')
      .data(orders)
      .enter()
      .append('g')
      .classed('orderRectMini', true)
      .selectAll('rect')
      .data((d) => d)
      .enter()
      .append('rect')
      .attr('x', (g) => this.timeScaleMini(g.diff))
      .attr('y', 0)
      .attr('width', 2)
      .attr('height', 15);
      
  }

  /**
   * Draw the checkboxes for hiding the procedures/med rects
   * 
   */
  private drawCheckboxes() {
      this.svg.append('g')
              .attr('class', 'colorLabels')
              .attr('transform', () => `translate(${this.rectBoxDimension.width - 200},${this.rectBoxDimension.height+ 70})`)
              .append('rect')
              .attr('width', '20')
              .attr('height', '20')
              .attr('class', 'med-swatch ORDERED');
              
      this.svg.select('.colorLabels')
                .append('rect')
              .attr('width', '20')
              .attr('height', '20')
              .attr('x', '25')
              .attr('class', 'med-swatch COMPLETED');

      this.svg.select('.colorLabels')
              .append('rect')
              .attr('width', '20')
              .attr('height', '20')
              .attr('x', '50')
              .attr('class', 'med-swatch DISCONTINUED');

      this.svg.select('.colorLabels')
              .append('rect')
              .attr('width', '20')
              .attr('height', '20')
              .attr('x', '100')
              .attr('class', 'pro-swatch ORDERED');
      
      
      this.svg.select('.colorLabels')
              .append('rect')
              .attr('width', '20')
              .attr('height', '20')
              .attr('x', '125')
              .attr('class', 'pro-swatch COMPLETED');

      //input checkboxes for hiding orders
        d3.select('.rectDiv')
            .append('div')
            .classed('checkbox-pro', true)
              .append('input')
              .attr('type', 'checkbox')
              .attr('checked', true)
              .attr('value', 'Pro')
               .attr('x', 175)
              .attr('id', 'pro-check')
              //.on('click', () => this.updateRectPro());

      this.$node.select('.checkbox-pro')
            .append('text')
            .text('Procedures')

      d3.select('.rectDiv')
            .append('div')
            .classed('checkbox-med', true)
             .append('input')
              .attr('type', 'checkbox')
              .attr('checked', true)
              .attr('value', 'med')
              .attr('id', 'med-check')
              //.on('click', () => this.updateRectMed())

             this.$node.select('.checkbox-med')
            .append('text')
            .text('Medications');
        
  }

      //this is where your order search starts
  private drawQueryBox (){

    let form = this.$node.append('form');

    form.append('input')
            .attr('type', 'text')
            .attr('placeholder', 'Search Order Name')
            .attr('id', 'order_search')
            .attr('value');

    form.append('input')
            .attr('type', 'button')
            .attr('value', 'order search')
            .on('click', () => this.queryOrder());

    form.append('input')
            .attr('type', 'button')
            .attr('value', 'filter cohort by selected')
            .on('click', () => {
              events.fire('filtered_CPT_by_order', this.queryDataArray);
              selectAll('.selectedOrder').classed('selectedOrder', false);
              selectAll('.unselectedOrder').classed('unselectedOrder', false);
            });
}
       
  private drawOrderLabel() {

    d3.selectAll('.orderLabel').remove();
    
    d3.select('.rectDiv ')
        .append('div')
        .classed('orderLabel', true)
        .append('text')
        .text(this.orderLabel);
          
    d3.select('.rectDiv')
        .append('div')
        .classed('orderLabel', true)
        .append('text')
        .text('Order Frequency for Target Patient: ' + this.selectedTargetPatOrderCount);

    d3.select('.orderLabel')
        .append('div')
        .classed('orderLabel', true)
        .append('text')
        .text('Orders found in Similar Patients: ' + this.selectedSimilarOrderCount);
          
  }
  

 /*
private updateRectMed() {
      
      //var rect = this.$node.getElementsByClassName('.MEDICATION');
      var cbMed = select("#med-check").property("checked");
      if (!cbMed) selectAll(".MEDICATION").classed('hidden', true);
      
      else selectAll(".MEDICATION").classed('hidden', false);
      
}


private updateRectPro() {
      
     var cbPro = this.$node.select("#pro-check").property("checked");
      if (!cbPro) selectAll(".PROCEDURE").classed('hidden', true);
      
      else selectAll(".PROCEDURE").classed('hidden', false);
}

*/

private assignCurrentName (d) {
          
          if (this.currentlySelectedName != undefined){
            this.currentlySelectedName = undefined;
          }

          this.drawPatOrderRects(this.targetOrders, this.targetProInfo);

}


/**
   * get Data by API
   * @param URL
   * @returns {Promise<any>}
   */
  private async getData(URL) {
    return await ajax.getAPIJSON(URL);
  }

  //tooltip
  private renderOrdersTooltip(tooltip_data) {

    let text = "<strong style='color:darkslateblue'>" + tooltip_data['ORDER_CATALOG_TYPE'] + "</strong></br>";
    text += "<span>" + tooltip_data['ORDER_MNEMONIC'] + "</span></br>";
    text += "<span>" + tooltip_data['ORDER_DTM'] + "</span></br>";
    return text;
  }

  /**
   * Show or hide the application loading indicator
   * @param isBusy
   */
  setBusy(isBusy: boolean) {
    let status = select('.busy').classed('hidden');
    if (status == isBusy)
      select('.busy').classed('hidden', !isBusy);
  }

}

export function create(parent:Element) {
  return new rectExploration(parent);
}