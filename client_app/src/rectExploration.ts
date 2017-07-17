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
import {transition} from 'd3-transition';
import {brush, brushY, brushX} from 'd3-brush';
import * as similarityScore  from './similarityScoreDiagram';
import * as d3 from 'd3';

export class rectExploration {

  private $node;
  private timeScale;
  private timeScaleMini;
  private patientInfo;
  private svg;
  private targetPatientProInfo;
 // private container: d3.Selection<SVGElement>;
  private brush;
  private targetPatientOrders;
  private currentlySelectedName;
  private similarData;
  private allData;
  private selectedOrder;



  rectBoxDimension = {width: 1100, height: 100 };
  orderBar = {width: 10, height: 60 };
  margin = {top: 20, right: 10, bottom: 10, left: 10};
  contextDimension = {width: this.rectBoxDimension.width, height:55};
    
  constructor(parent: Element) {

    this.$node = select(parent)
        .append('div')
        .classed('rectDiv', true)
    
    this.svg = this.$node.append('svg')
        .attr('width', this.rectBoxDimension.width)
        .attr('height', this.rectBoxDimension.height*2)
    
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
      .attr('id', 'pat_rect_line')
       .attr('transform', `translate(${this.margin.left},${this.margin.top})`); 

  let context = this.svg.append('g')
            .attr('class', 'context')
            .attr('width', this.contextDimension.width)
            .attr('height', this.contextDimension.height)
            .attr('transform', `translate(${this.margin.left},${this.rectBoxDimension.height + this.margin.top})`);

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
        this.drawPatOrderRects();
        this.drawMiniRects();
      });
    
    context.append('g')
    .attr('class', 'brush')
      .call(this.brush)
      //.call(this.brush.move, this.brush.extent());
    
  this.attachListener();
  this.drawCheckboxes();
      }
  
 /**
   * Utility method
   * @param pat
   * @returns {Date}
   */
  
  private findMinDate(pat) {

    let minDate = new Date();
    for (let index = 0; index < pat.length; index++) {
      if (!pat[index]['ASSESSMENT_START_DTM']) continue;
      if (this.parseTime(pat[index]['ASSESSMENT_START_DTM'], null) < minDate)
        minDate = this.parseTime(pat[index]['ASSESSMENT_START_DTM'], null)
    }
    return minDate
  }

   /**
   * Attach listeners
   */
  
  private attachListener() {

    // item: pat_id, number of similar patients, DATA
    events.on('update_similar', (evt, item) => { // called in queryBox
      
 

     this.targetPatientProInfo = item[2]['pat_PRO'][item[0]].slice();

      this.setOrderScale();
      this.targetPatientOrders = item[2]['pat_Orders'][item[0]].slice();
      this.drawPatOrderRects();
      this.drawMiniRects();
    });

    // item: pat_id, DATA
    events.on('update_all_info', (evt, item) => {  // called in query box

      
      // this.targetPatientProInfo = item[1]['PRO'][item[0]];
      this.targetPatientProInfo = item[2]['pat_PRO'][item[0]].slice();

      this.setOrderScale();
      this.targetPatientOrders = item[2]['pat_Orders'][item[0]].slice();
      this.drawPatOrderRects();
      this.drawMiniRects();
    });

  }




 /**
   * Draw the diagram with the given data from getSimilarRows
   * @param args
   */
  private setOrderScale() {
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
    this.timeScaleMini.domain([-1,maxDiff]);
    

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

   
        console.log(this.targetPatientProInfo.filter( (d) => {  return d['PAT_ID'] }));
  }


  /**
   *
   * @param ordersInfo
   */

  private drawPatOrderRects() {

     let ordersInfo = this.targetPatientOrders;
     // let ordersInfo = this.targetPatientProInfo; why is this not determining the date??

      let minDate = this.findMinDate(this.targetPatientProInfo);
 
      ordersInfo.forEach((d) => {
        let time = this.parseTime(d['ORDER_DTM'], minDate).getTime();
        d.diff = Math.ceil((time - minDate.getTime()) / (1000 * 60 * 60 * 24));
      });
/*
      ordersInfo.forEach((d) => {
      let time = this.parseTime(d['ASSESSMENT_START_DTM'], minDate).getTime();
      d.diff = Math.ceil((time - minDate.getTime()) / (1000 * 60 * 60 * 24));
      });*/
 

      const self = this;
      function getClassAssignment (attString) {
      //this uses a work around to use a function with classed. As well it preserves the already assinged classes
        
        return function (d) { 
          let element = select(this);
          element.classed (d[attString], true);
          return element.attr('class');
        }
      }

      let orderRect = this.svg.select('#pat_rect_line')
      /* .append('g')
      .attr('transform', () => {
        return `translate(${this.margin.bottom},0)`; // If there is a label for the x-axis change 0
      })*/
      .selectAll('.orderRect')
      .data([ordersInfo]);
      let orderRectEnter = orderRect.enter()
      .append('g')
      //.attr('transform', () => `translate(0,${this.rectBoxDimension.height - 50})`)
      .classed('orderRect', true);
      orderRect = orderRectEnter.merge(orderRect);

      let rects = orderRect.selectAll('rect')
      .data((d) => d);
      let rectsEnter = rects.enter()
      .append('rect');
      rects = rectsEnter.merge(rects);
      rects.attr('class', getClassAssignment('ORDER_CATALOG_TYPE'))
      .attr('class', getClassAssignment('ORDER_STATUS'))
      //.attr('class', (d) => `${d['ORDER_CATALOG_TYPE']} ${d['ORDER_STATUS']}`) //this assigns the multiple class names but erases the eld classes
      .attr('x', (g) => this.timeScale(g.diff))
      .attr('y', 0)
      .attr('width', this.orderBar.width)
      .attr('height', this.orderBar.height)
      //.classed('selectedOrder', d => d.ORDER_MNEMONIC === this.currentlySelectedName)
      //.classed('unselectedOrder', d => this.currentlySelectedName !== undefined && d.ORDER_MNEMONIC !== this.currentlySelectedName)
      //this is the mousclick event that greys rects
        .on('click', d => {
          this.svg.selectAll('rects');
          if (this.currentlySelectedName === undefined) {
            this.currentlySelectedName = d.ORDER_MNEMONIC;
           console.log(this.currentlySelectedName);
       
           
           
          // var selectedOrder = this.currentlySelectedName;
           //return selectedOrder;
           
          
          } else {
            this.currentlySelectedName = undefined;
          }
          
          this.drawPatOrderRects();
         // console.log(selectedOrder);
         var selectedGroup = d3.selectAll('.selectedOrder');
         console.log(selectedGroup.size());
    
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
      .classed('selectedOrder', d => d.ORDER_MNEMONIC === this.currentlySelectedName)
      .classed('unselectedOrder', d => this.currentlySelectedName !== undefined && d.ORDER_MNEMONIC !== this.currentlySelectedName);
      
       this.svg.select('.xAxis')
      .call(axisBottom(this.timeScale))
        
      if (this.currentlySelectedName) {
        // 
      } else {
        // empty the bar chart
      }
  }

  private drawMiniRects() {

      let ordersInfo2 = this.targetPatientOrders;
      let minDate = this.findMinDate(this.targetPatientProInfo);
  
      ordersInfo2.forEach((d) => {
        let time = this.parseTime(d['ORDER_DTM'], minDate).getTime();
        d.diff = Math.ceil((time - minDate.getTime()) / (1000 * 60 * 60 * 24));
      }); 

      const self = this;
     this.svg.select('.context')
     .selectAll('.orderRectMini')
      .data([ordersInfo2])
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

      //input checkboxes for hiding orders
      this.$node.append('input')
              .attr('type', 'checkbox')
              .attr('checked', true)
              .attr('value', 'med')
              .attr('id', 'med-check')
              .on('click', () => this.updateRectMed());

      this.$node.append('text')
            .text('Medications')
            .attr('padding', 5);


      this.$node.append('input')
              .attr('type', 'checkbox')
              .attr('checked', true)
              .attr('value', 'Pro')
              .attr('id', 'pro-check')
              .on('click', () => this.updateRectPro());

      this.$node.append('text')
            .text('Procedures')
            .attr('padding', 5);
  
  }

 
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


  /**
   * parse time
   * @param date
   * @param nullDate
   * @returns {null}
   */
  private parseTime(date, nullDate) {
    let parseT1 = timeParse('%x %X');
    let parseT2 = timeParse('%x');
    let time = nullDate;

    if (date) {
      if(date.split(' ').length > 1){
        time = parseT1(date);
      }
      else
        time = parseT2(date)
    }
    return time
  }

//sets up the brush for brush business
private brushed (start, end ){

//var selectBool = event.selection;

let newMin = start;
let newMax = end;


events.fire('brushed', [newMin, newMax]);

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

