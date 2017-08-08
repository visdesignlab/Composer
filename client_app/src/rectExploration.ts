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


export class rectExploration {

  private $node;
  private timeScale;
  private timeScaleMini;
  private patientInfo;
  private svg;
  private targetPatientProInfo;
  private brush;
  private targetPatientOrders;
  private currentlySelectedName;
  private currentlySelectedNameDate;
  private similarData;
  private allData;
  private selectedOrder;
  private orderLabel;
  private selectedTargetPatOrderCount;
  private selectedSimilarOrderCount;

  private similarPatientsProInfo;
 
  private findMinDate = dataCalc.findMinDate;//function for calculating the minDate for given patient record
  private parseTime = dataCalc.parseTime;
  private setOrderScale = dataCalc.setOrderScale;
  private getClassAssignment = dataCalc.getClassAssignment;

  rectBoxDimension = {width: 1100, height: 90 };
  orderBar = {width: 10, height: 60 };
  margin = {top: 20, right: 10, bottom: 10, left: 10};
  contextDimension = {width: this.rectBoxDimension.width, height:55};

  table: ITable;
  table2: ITable;
    
  constructor(parent: Element) {

    this.$node = select(parent)
        .append('div')
        .classed('rectDiv', true);
    
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
    
    
  this.attachListener();
  this.drawCheckboxes();
  this.drawQueryBox();
      }
  
 
  /**
   * Attach listeners
   */
  
  private attachListener() {

    // item: pat_id, number of similar patients, DATA
    events.on('update_similar', (evt, item) => { // called in queryBox

       this.targetPatientProInfo = item[2]['pat_PRO'][item[0]].slice();
       this.similarPatientsProInfo = entries(item[2]['similar_PRO']);

      this.setOrderScale();
      this.targetPatientOrders = item[2]['pat_Orders'][item[0]].slice();
      this.drawPatOrderRects();
      this.drawMiniRects();


    });

    // item: pat_id, DATA
    events.on('update_all_info', (evt, item) => {  // called in query box
      this.targetPatientProInfo = item[1]['PRO'][item[0]];
      this.similarPatientsProInfo = [];

      this.setOrderScale();
 
      this.drawPatOrderRects();
      this.drawMiniRects();
    });



  }

     /**
     * firing event to update the vis for info of a patient
     */
    private queryOrder() {
           const value = (<HTMLInputElement>document.getElementById('order_search')).value;
        
            //const url = `/data_api/getPatInfo/${value}/${this.dataset}`;
            this.setBusy(true);
            console.log(value);
            this.currentlySelectedName = value;
            console.log(this.currentlySelectedName);
            this.svg.selectAll('.selectedOrder')
            .remove('.selectedOrder');
            this.svg.selectAll('unselectedOrder')
            .remove('.unselectedOrder');
            events.fire('query_search', value);
            //d3.selectAll('rects').selectAll('.selectedOrders')
            this.setBusy(false);
            
    }

  private findOrders () {

      let dataset = 'selected';
     // let targetOrder = 'OMEPRAZOLE';
      let targetOrder = this.currentlySelectedName;
      const url = `/data_api/filteredOrdersByMonth/${dataset}/${targetOrder}`;
      this.setBusy(true);
      this.getData(url).then((args) => {
        events.fire('find_orders', [args]);
        this.setBusy(false);
        console.log('this is my function')
        console.log(args);
      });
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
 

      const self = this;


      let orderRect = this.svg.select('#pat_rect_line')
     
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
        .on('click', d => {
          this.svg.selectAll('rects');
          if (this.currentlySelectedName === undefined) {
            this.currentlySelectedName = d.ORDER_MNEMONIC;
            this.currentlySelectedNameDate = d.ORDER_DTM;
           console.log(this.currentlySelectedName);
           this.orderLabel = this.currentlySelectedName;//adds the order name to the label
          // events.fire()
           this.findOrders();
          // console.log(d.similar_orders);
           
          } else {
            this.currentlySelectedName = undefined;
            this.orderLabel = "Select An Order";
            this.selectedTargetPatOrderCount = "  ";
             this.selectedSimilarOrderCount = "   ";
             d3.selectAll('.orderLabel').remove();
            //this.drawOrderLabel();
          }
          
          this.drawPatOrderRects();
          this.selectedTargetPatOrderCount = this.svg.selectAll('.selectedOrder').size();
           this.selectedSimilarOrderCount = d3.selectAll('#similar_orders').selectAll('.selectedOrder').size()/3;
           this.drawOrderLabel();//draws the label with the order count for patient and similar patients
          let selectedGroupTargetPat = this.svg.selectAll('.selectedOrder');
          let selectedGroupSimilar = d3.selectAll('#similar_orders').selectAll('.selectedOrder');
         
           console.log(selectedGroupTargetPat.size());//logs the number of orders in the selected order for target patient
           console.log(selectedGroupSimilar.size()/3);//logs the number of orders in the selected order of similar patients
          
           this.loadDataFromServer();
    
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
              .on('click', () => this.updateRectPro());

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
              .on('click', () => this.updateRectMed())

             this.$node.select('.checkbox-med')
            .append('text')
            .text('Medications');
        
  
  }

      //this is where your order search starts
private drawQueryBox (){
  let form= this.$node.append('form');

        form.append('input')
            .attr('type', 'text')
            .attr('placeholder', 'Search Order Name')
            .attr('id', 'order_search')
            .attr('value');

        form.append('input')
            .attr('type', 'button')
            .attr('value', 'order_search')
            .on('click', () => this.queryOrder());
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

   public async loadDataFromServer() {
     
   
    console.log('Loading Data from the a Server');
    // listData() returns a list of all datasets loaded by the server
    // notice the await keyword - you'll see an explanation below
    const allDatasets = await listData();
    //console.log('All loaded datasets:');
    //console.log(allDatasets);
     // we could use those dataset to filter them based on their description and pick the one(s) we're interested in
    // here we pick the first dataset and cast it to ITable - by default the datasets are returned as IDataType
    let tempTable: ITable;
    let orderArray = [];
    // retrieving a dataset by name. Note that only the first dataset will be returned.
    tempTable = <ITable> await getById('Orders');
   
    let tempVector = await tempTable.cols()[5].data();
    //console.log(tempVector);
    //console.log(this.currentlySelectedName);

   }

/*
 const url = `/data_api/getSimilarRows/${value}/${n}/${this.dataset}`;
            this.setBusy(true);
            this.getData(url).then((args) => {

                this.setBusy(false);
                this.similarArgs = args;*/

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
