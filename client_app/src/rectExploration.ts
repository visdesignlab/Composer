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
import {brush, brushY} from 'd3-brush';

export class rectExploration {

  private $node;
  private timeScale;
  private patientInfo;
  private svg;
  private targetPatientProInfo;

  rContainerDimension = {width: 1000, height: 300 };
  similarBar = {width: 30, height: 60 };
  margin = {top: 10, right: 10, bottom: 10, left: 10};
  

  constructor(parent: Element) {

    this.$node = select(parent)
        .append('div')
        .classed('rectDiv', true)
        
    this.svg = this.$node.append('svg')
        .attr('width', this.rContainerDimension.width)
        .attr('height', this.rContainerDimension.height);
    
    this.timeScale = scaleLinear()
        .range([0, this.rContainerDimension.width])
        .clamp(true);

   this.svg.append('g')
      .attr('id', 'pat_orders');
    
  this.attachListener();
    
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
      //this.similarPatientsProInfo = entries(item[2]['similar_PRO']);

      //this.clearDiagram();
      this.drawDiagram();
      this.targetPatOrderRect(item[2]['pat_Orders'][item[0]].slice());

    });

    // item: pat_id, DATA
    events.on('update_all_info', (evt, item) => {  // called in query box

      
      this.targetPatientProInfo = item[1]['PRO'][item[0]];
     // this.similarPatientsProInfo = [];

      //this.clearDiagram();
      this.drawDiagram();
      //this.addOrderSquares(item[1]['Orders'][item[0]]);


    });

  }


 /**
   * Draw the diagram with the given data from getSimilarRows
   * @param args
   */
  private drawDiagram() {

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

    // -----  set domains and axis

    // time scale

    this.timeScale.domain([-1, maxDiff]);

    this.svg.select('.xAxis')
      .call(axisBottom(this.timeScale));
  }


  /**
   *
   * @param ordersInfo
   */

  private targetPatOrderRect(ordersInfo) {

    let minDate = this.findMinDate(this.targetPatientProInfo);

    ordersInfo.forEach((d) => {
      let time = this.parseTime(d['ORDER_DTM'], minDate).getTime();
      d.diff = Math.ceil((time - minDate.getTime()) / (1000 * 60 * 60 * 24));
    });

    const self = this;

    this.svg.select('#pat_orders')
      .append('g')
      .attr('transform', () => {
        return `translate(${this.margin.bottom},0)`; // If there is a label for the x-axis change 0
      })
      .selectAll('.similarRect')
      .data([ordersInfo])
      .enter()
      .append('g')
      //.attr('transform', () => `translate(0,${this.rContainerDimension.height - 50})`)
      .classed('similarRect', true)
      .selectAll('rect')
      .data((d) => d)
      .enter()
      .append('rect')
      .attr('class', (d) => `${d['ORDER_CATALOG_TYPE']}`, (d) => `${d['ORDER_STATUS']}`)
      //.attr('class', (d) => `${d['ORDER_STATUS']}`)
      .attr('x', (g) => this.timeScale(g.diff))
      .attr('y', 0)
      .attr('width', this.similarBar.width)
      .attr('height', this.similarBar.height);



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


/**
   * get Data by API
   * @param URL
   * @returns {Promise<any>}
   */
  private async getData(URL) {
    return await ajax.getAPIJSON(URL);
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

